"use client";

import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [text, setText] = useState(value);
  const [debouncedText, setDebouncedText] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedText(text);
    }, 150);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  function handleBlur() {
    if (text !== value) {
      onChange(text);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <textarea
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label="Card description"
        placeholder="Add a description (supports Markdown)..."
        className="min-h-[120px] flex-1 resize-y rounded-md border border-slate-200 p-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
      />
      <div className="prose prose-sm prose-slate max-h-[200px] min-h-[120px] flex-1 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-2">
        {debouncedText ? (
          <Markdown>{debouncedText}</Markdown>
        ) : (
          <p className="text-sm text-slate-400">Preview</p>
        )}
      </div>
    </div>
  );
}
