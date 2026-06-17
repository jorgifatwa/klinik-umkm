"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const suggestedQuestions = [
  "Cara menghitung laba?",
  "Apa itu cash flow?",
  "Bagaimana menentukan harga jual?",
];

export function ChatBox() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<Array<{ question: string; answer: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function sendQuestion(text: string) {
    if (!text) return;
    setIsLoading(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text }),
    });
    const data = await response.json();
    setIsLoading(false);
    if (data.answer) {
      setHistory((current) => [...current, { question: text, answer: data.answer }]);
      setQuestion("");
    }
  }

  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-semibold text-slate-950">AI Financial Assistant</h1>
        <p className="mt-2 text-slate-600">Tanyakan tentang laba rugi, cash flow, modal usaha, atau harga jual.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {suggestedQuestions.map((item) => (
          <button key={item} type="button" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100" onClick={() => sendQuestion(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="question">Pertanyaan</Label>
          <div className="flex gap-3">
            <Input id="question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Tulis pertanyaan Anda" />
            <Button type="button" onClick={() => sendQuestion(question)} disabled={isLoading || question.length === 0}>{isLoading ? "Mengirim..." : "Kirim"}</Button>
          </div>
        </div>
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Pertanyaan</p>
              <p className="mt-1 text-slate-700">{item.question}</p>
              <p className="mt-4 text-sm font-semibold text-slate-950">Jawaban</p>
              <p className="mt-1 text-slate-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
