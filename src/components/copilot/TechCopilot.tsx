"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchKnowledge, type KnowledgeEntry } from "@/data/lotusKnowledge";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  category?: string;
}

const FLOAT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SUGGESTED_QUERIES = [
  "What is the LBK0504?",
  "Input voltage range?",
  "How does Lotus compare to standard?",
  "What is SOI technology?",
  "Quiescent current at 5V?",
];

export function TechCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "LOTUS TECHNICAL COPILOT — Query the Lotus Microsystems knowledge base. Ask about specs, technology, thermal performance, or comparisons.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleSubmit(query: string) {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: query,
    };

    const results = searchKnowledge(query);

    let responseText: string;
    let category: string | undefined;

    if (results.length > 0) {
      const top = results[0];
      responseText = top.answer;
      category = top.category?.toUpperCase();

      if (results.length > 1) {
        responseText += `\n\nRelated: ${results
          .slice(1, 3)
          .map((r) => r.question)
          .join(" | ")}`;
      }
    } else {
      responseText =
        "No matching data found in the knowledge base. Try querying specific parameters: voltage, current, efficiency, SOI, interposer, thermal, or LBK0504.";
    }

    const assistantMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: responseText,
      category,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-3x right-3x z-50 w-[48px] h-[48px] flex items-center justify-center border transition-colors ${
          isOpen ? "bg-orange text-static-white border-orange" : "bg-silicon text-white border-silicon"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M3 4h14M3 8h10M3 12h12M3 16h8" />
        </svg>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: FLOAT }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[360px] bg-white border-l border-border z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-2x border-b border-border flex items-center justify-between">
              <TechnicalLabel className="text-orange">TECHNICAL COPILOT</TechnicalLabel>
              <button
                onClick={() => setIsOpen(false)}
                className="w-[24px] h-[24px] flex items-center justify-center text-silicon hover:text-orange transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2x flex flex-col gap-2x">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: FLOAT }}
                  className={`${
                    msg.role === "user" ? "self-end bg-linen" : "self-start bg-white border border-border"
                  } p-2x max-w-[300px]`}
                >
                  {msg.category && (
                    <span className="text-[9px] tracking-technical uppercase text-orange font-mono block mb-[4px]">
                      {msg.category}
                    </span>
                  )}
                  <p className="font-mono text-[12px] leading-[18px] text-silicon whitespace-pre-line">
                    {msg.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Suggested queries */}
            {messages.length <= 1 && (
              <div className="px-2x pb-1x flex flex-wrap gap-[8px]">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSubmit(q)}
                    className="text-[10px] font-mono tracking-technical text-silicon border border-border px-[8px] py-[4px] hover:border-orange hover:text-orange transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-2x border-t border-border flex gap-1x">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(input)}
                placeholder="Query specs..."
                className="flex-1 bg-linen px-2x py-1x font-mono text-[12px] text-silicon border border-border focus:border-orange focus:outline-none placeholder:text-border"
              />
              <button
                onClick={() => handleSubmit(input)}
                className="px-2x py-1x bg-orange text-static-white font-mono text-[10px] tracking-technical hover:bg-silicon transition-colors"
              >
                ASK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
