import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REALM = "AXG Lockdown";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function middleware(req: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASS;

  if (!expectedUser || !expectedPass) {
    return new NextResponse("Server misconfigured: auth env vars missing", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const header = req.headers.get("authorization");
  if (header && header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const idx = decoded.indexOf(":");
      if (idx > 0) {
        const user = decoded.slice(0, idx);
        const pass = decoded.slice(idx + 1);
        if (timingSafeEqual(user, expectedUser) && timingSafeEqual(pass, expectedPass)) {
          return NextResponse.next();
        }
      }
    } catch {
      /* fall through to 401 */
    }
  }

  return unauthorized();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
