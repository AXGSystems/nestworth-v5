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
let chatMsgId = 0;

interface ChatMessage {
  id: number;
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
      id: ++chatMsgId,
      role: 'coach',
      text: 'Hey Christian! I\'m your NestWorth Coach. I can help with spending analysis, bill savings, forecast projections, and more. What would you like to know?',
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
        id: ++chatMsgId,
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
        id: ++chatMsgId,
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
    <div className="space-y-5">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center">
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
            <h1 className="text-xl font-black tracking-tight">
              NestWorth Coach
            </h1>
            <p className="text-[13px] opacity-80">
              AI-powered financial insights for your household
            </p>
          </div>
        </div>
      </div>

      {/* ---- Layout: chat + sidebar ---- */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        {/* Chat area */}
        <div className="space-y-5">
          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.key}
                type="button"
                onClick={() => handleSend(prompt.label)}
                className="nw-btn-pill text-[12px]"
                style={{ minHeight: 36, padding: '0 14px' }}
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Chat messages */}
          <Card className="min-h-[320px] sm:min-h-[420px] max-h-[55vh] sm:max-h-[62vh] overflow-y-auto !p-4">
            <div className="space-y-4" aria-live="polite">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {msg.role === 'coach' ? (
                    <div className="w-8 h-8 rounded-full bg-[var(--acc)] flex items-center justify-center shrink-0 shadow-sm">
                      <svg
                        width={15}
                        height={15}
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
                    <Avatar letter="C" size={32} color="var(--acc)" />
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[var(--acc)] text-white rounded-br-md'
                        : 'nw-card-inner rounded-bl-md'
                    }`}
                  >
                    <p className="text-[13px] leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>
                    <p
                      className={`text-[10px] mt-1.5 ${
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
          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="Ask your coach anything..."
              aria-label="Ask your coach a question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
              className="nw-input flex-1"
            />
            <button
              type="button"
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              aria-label="Send message"
              className="nw-btn disabled:opacity-40"
              style={{ width: 50, height: 50, padding: 0 }}
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
        <div className="space-y-5 hidden lg:block">
          <Card>
            <div className="nw-section-header" style={{ fontSize: 14 }}>
              <span>Quick Stats</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[var(--t2)]">Budget Used</span>
                <span className="text-[14px] font-bold text-[var(--t1)] font-[tabular-nums]">
                  {Math.round((totalSpent / totalBudget) * 100)}%
                </span>
              </div>
              <div className="nw-section-divider" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[var(--t2)]">Savings Rate</span>
                <span className="text-[14px] font-bold text-[var(--pos)] font-[tabular-nums]">
                  {latestRate}%
                </span>
              </div>
              <div className="nw-section-divider" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[var(--t2)]">Achievements</span>
                <span className="text-[14px] font-bold text-[var(--t1)] font-[tabular-nums]">
                  {completedAch}/{achievements.length}
                </span>
              </div>
              <div className="nw-section-divider" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[var(--t2)]">Sync Issues</span>
                <span className={`text-[14px] font-bold font-[tabular-nums] ${staleCount > 0 ? 'text-[var(--warn)]' : 'text-[var(--pos)]'}`}>
                  {staleCount}
                </span>
              </div>
            </div>
          </Card>

          <Card variant="accent">
            <div className="nw-section-header" style={{ fontSize: 14 }}>
              <span>Coach Tips</span>
            </div>
            <div className="space-y-3 text-[13px] text-[var(--t2)] leading-relaxed">
              <p>
                Ask about <strong className="text-[var(--t1)]">Spending</strong> to see who is spending what this week.
              </p>
              <p>
                Ask about <strong className="text-[var(--t1)]">Bills</strong> to find savings opportunities worth $209/mo.
              </p>
              <p>
                Ask about <strong className="text-[var(--t1)]">Forecast</strong> to see end-of-year projections.
              </p>
            </div>
          </Card>

          <Card>
            <div className="nw-section-header" style={{ fontSize: 14 }}>
              <span>Household</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar letter="C" size={36} color="var(--acc)" />
                <div>
                  <p className="text-[14px] font-bold text-[var(--t1)]">Christian</p>
                  <p className="text-[11px] text-[var(--t2)]">Primary</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar letter="Ch" size={36} color="var(--gold)" />
                <div>
                  <p className="text-[14px] font-bold text-[var(--t1)]">Channelle</p>
                  <p className="text-[11px] text-[var(--t2)]">Partner</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
