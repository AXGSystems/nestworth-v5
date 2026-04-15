'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Card, StatCard, Avatar, Badge } from '@/components/ui';
import {
  coachResponses,
  budgetCategories,
  savingsRateHistory,
  achievements,
  accounts,
} from '@/lib/data';

/* ---- Chat message type ---- */
interface ChatMessage {
  role: 'user' | 'coach';
  text: string;
  time: string;
}

/* ---- Quick prompts ---- */
const QUICK_PROMPTS = [
  { label: 'Spending', key: 'Spending' },
  { label: 'Sync Issues', key: 'Sync' },
  { label: 'Bill Savings', key: 'Bills' },
  { label: 'Save More', key: 'Save' },
  { label: 'Audit Trail', key: 'Audit' },
  { label: 'Forecast', key: 'Forecast' },
  { label: 'Budget', key: 'Budget' },
];

/* ---- Derived stats ---- */
const totalSpent = budgetCategories.reduce((a, c) => a + c.spent, 0);
const totalBudget = budgetCategories.reduce((a, c) => a + c.allocated, 0);
const latestRate = savingsRateHistory[savingsRateHistory.length - 1].r;
const completedAch = achievements.filter((a) => a.done).length;
const staleCount = accounts.filter((a) => a.status !== 'ok').length;

function getTimestamp(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'coach',
      text: 'Hey Von! I\'m your NestWorth Coach. I can help with spending analysis, bill savings, forecast projections, and more. What would you like to know?',
      time: getTimestamp(),
    },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        role: 'user',
        text: text.trim(),
        time: getTimestamp(),
      };

      /* Find matching response */
      const key = Object.keys(coachResponses).find((k) =>
        text.toLowerCase().includes(k.toLowerCase()),
      );
      const response = key
        ? coachResponses[key]
        : 'I can help with Spending, Sync, Bills, Save, Audit, Forecast, and Budget. Try asking about one of those topics!';

      const coachMsg: ChatMessage = {
        role: 'coach',
        text: response,
        time: getTimestamp(),
      };

      setMessages((prev) => [...prev, userMsg, coachMsg]);
      setInput('');
      scrollToBottom();
    },
    [scrollToBottom],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(input);
      }
    },
    [handleSend, input],
  );

  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">
              NestWorth Coach
            </p>
            <p className="text-xs opacity-80">
              AI-powered financial insights for your household
            </p>
          </div>
        </div>
      </div>

      {/* ---- Layout: chat + sidebar ---- */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        {/* Chat area */}
        <div className="space-y-3">
          {/* Quick prompts */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.key}
                type="button"
                onClick={() => handleSend(prompt.label)}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[var(--accS)] text-[var(--acc)] hover:brightness-105 active:scale-95 transition-all duration-150"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Chat messages */}
          <Card className="min-h-[400px] max-h-[60vh] overflow-y-auto !p-3">
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {msg.role === 'coach' ? (
                    <div className="w-7 h-7 rounded-full bg-[var(--acc)] flex items-center justify-center shrink-0">
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                  ) : (
                    <Avatar letter="V" size={28} color="var(--acc)" />
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-[var(--acc)] text-white rounded-br-md'
                        : 'bg-[var(--accS)] text-[var(--t1)] rounded-bl-md'
                    }`}
                  >
                    <p className="text-[13px] leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.role === 'user'
                          ? 'text-white/60'
                          : 'text-[var(--t3)]'
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </Card>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask your coach anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-3 bg-[var(--cardBg)] border border-[var(--cardBorder)] rounded-xl text-sm text-[var(--t1)] placeholder:text-[var(--t3)] outline-none focus:border-[var(--acc)] transition-colors"
            />
            <button
              type="button"
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[var(--acc)] text-white disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all duration-150"
            >
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1={22} y1={2} x2={11} y2={13} />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-3 hidden lg:block">
          <Card>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--t3)] mb-2">
              Quick Stats
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--t2)]">Budget Used</span>
                <span className="text-[13px] font-bold text-[var(--t1)]">
                  {Math.round((totalSpent / totalBudget) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--t2)]">Savings Rate</span>
                <span className="text-[13px] font-bold text-[var(--pos)]">
                  {latestRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--t2)]">Achievements</span>
                <span className="text-[13px] font-bold text-[var(--t1)]">
                  {completedAch}/{achievements.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--t2)]">Sync Issues</span>
                <span className={`text-[13px] font-bold ${staleCount > 0 ? 'text-[var(--warn)]' : 'text-[var(--pos)]'}`}>
                  {staleCount}
                </span>
              </div>
            </div>
          </Card>

          <Card variant="accent">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--t3)] mb-2">
              Coach Tips
            </p>
            <div className="space-y-2 text-[12px] text-[var(--t2)]">
              <p>
                Ask about <strong>Spending</strong> to see who is spending what this week.
              </p>
              <p>
                Ask about <strong>Bills</strong> to find savings opportunities worth $209/mo.
              </p>
              <p>
                Ask about <strong>Forecast</strong> to see end-of-year projections.
              </p>
            </div>
          </Card>

          <Card>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--t3)] mb-2">
              Household
            </p>
            <div className="flex items-center gap-3 mb-2">
              <Avatar letter="V" size={32} color="var(--acc)" />
              <div>
                <p className="text-[13px] font-bold text-[var(--t1)]">Von</p>
                <p className="text-[10px] text-[var(--t2)]">Primary</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar letter="C" size={32} color="var(--gold)" />
              <div>
                <p className="text-[13px] font-bold text-[var(--t1)]">Caroline</p>
                <p className="text-[10px] text-[var(--t2)]">Partner</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
