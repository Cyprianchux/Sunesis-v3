"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Toast } from "../../../components/ui";
import { WorkspaceGuard } from "../../../components/workspace-guard";
import { getBoardEntries, saveBoardEntries } from "../../../lib/storage";
import type { BoardEntry } from "../../../lib/types";
import { makeId } from "../../../lib/utils";

function AlignmentIcon({ alignment }: { alignment: "left" | "center" | "right" }) {
  const position = alignment === "left" ? "items-start" : alignment === "center" ? "items-center" : "items-end";
  return <span aria-hidden="true" className={`flex h-5 w-6 flex-col justify-center gap-0.5 ${position}`}><span className="h-0.5 w-5 rounded-full bg-current" /><span className="h-0.5 w-4 rounded-full bg-current" /><span className="h-0.5 w-5 rounded-full bg-current" /><span className="h-0.5 w-3 rounded-full bg-current" /></span>;
}

function ToolButton({ label, children, active, light, onClick }: { label: string; children: ReactNode; active?: boolean; light: boolean; onClick: () => void }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${light ? "border-line bg-white text-maroon hover:bg-[#fcf7f6]" : "border-[#402528] bg-[#241013] text-white hover:bg-[#402528]"} ${active ? "ring-2 ring-[#de908d]" : ""}`}>{children}</button>;
}

export default function BoardPage() {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<BoardEntry[]>([]);
  const [light, setLight] = useState(false);
  const [fontSize, setFontSize] = useState(32);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [notice, setNotice] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEntries(getBoardEntries());
    setLight(window.localStorage.getItem("sunesisWordLightMode") === "true");
    setFontSize(Number(window.localStorage.getItem("sunesisWordFontSize")) || 32);
  }, []);

  const save = () => {
    if (!content.trim()) return;
    const next = [...entries, { id: makeId(), content: content.trim(), createdAt: new Date().toISOString() }];
    setEntries(next);
    saveBoardEntries(next);
    setNotice("Write-up saved successfully.");
  };

  const removeLast = () => {
    if (!entries.length) return setNotice("No saved write-ups found.");
    const next = entries.slice(0, -1);
    setEntries(next);
    saveBoardEntries(next);
    setContent("");
  };

  const clear = () => {
    setEntries([]);
    saveBoardEntries([]);
    setContent("");
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    const editor = event.currentTarget;
    const beforeCursor = content.slice(0, editor.selectionStart);
    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const currentLine = beforeCursor.slice(lineStart);
    if (currentLine === "• ") {
      event.preventDefault();
      const next = `${content.slice(0, lineStart)}${content.slice(editor.selectionStart)}`;
      setContent(next);
      requestAnimationFrame(() => {
        editor.focus();
        editor.setSelectionRange(lineStart, lineStart);
      });
      return;
    }
    if (currentLine.startsWith("• ")) {
      event.preventDefault();
      const next = `${content.slice(0, editor.selectionStart)}\n• ${content.slice(editor.selectionEnd)}`;
      setContent(next);
      const cursor = editor.selectionStart + 3;
      requestAnimationFrame(() => {
        editor.focus();
        editor.setSelectionRange(cursor, cursor);
      });
    }
  };

  const addBullet = () => {
    const editor = editorRef.current;
    const start = editor?.selectionStart ?? content.length;
    const prefix = content.slice(0, start);
    const suffix = content.slice(start);
    const next = `${prefix}${prefix && !prefix.endsWith("\n") ? "\n" : ""}• ${suffix}`;
    setContent(next);
    const cursor = start + (prefix && !prefix.endsWith("\n") ? 3 : 2);
    requestAnimationFrame(() => {
      editor?.focus();
      editor?.setSelectionRange(cursor, cursor);
    });
  };

  const buttonClass = "rounded-xl border border-[#402528] bg-[#241013] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#402528]";

  return <WorkspaceGuard><div className="mx-auto max-w-5xl px-6 py-10">
    {notice && <Toast message={notice} />}
    <header className="mb-8"><p className="text-xs font-bold uppercase tracking-[.15em] text-brick">Thinking space</p><h1 className="mt-2 text-4xl font-black text-maroon">Typing board</h1><p className="mt-2 text-muted">Write, save, and revisit your explanations.</p></header>
    <div className="mb-4 flex flex-wrap gap-2">
      <ToolButton light={light} label={light ? "Switch to dark board" : "Switch to light board"} onClick={() => { const next = !light; setLight(next); window.localStorage.setItem("sunesisWordLightMode", String(next)); }}>◐</ToolButton>
      <ToolButton light={light} label="Decrease font size" onClick={() => { const next = Math.max(20, fontSize - 4); setFontSize(next); window.localStorage.setItem("sunesisWordFontSize", String(next)); }}>−</ToolButton>
      <ToolButton light={light} label="Increase font size" onClick={() => { const next = fontSize + 4; setFontSize(next); window.localStorage.setItem("sunesisWordFontSize", String(next)); }}>+</ToolButton>
      <ToolButton light={light} label="Align text left" active={alignment === "left"} onClick={() => setAlignment("left")}><AlignmentIcon alignment="left" /></ToolButton>
      <ToolButton light={light} label="Align text center" active={alignment === "center"} onClick={() => setAlignment("center")}><AlignmentIcon alignment="center" /></ToolButton>
      <ToolButton light={light} label="Align text right" active={alignment === "right"} onClick={() => setAlignment("right")}><AlignmentIcon alignment="right" /></ToolButton>
      <ToolButton light={light} label="Insert bullet" onClick={addBullet}>•</ToolButton>
    </div>
    <textarea ref={editorRef} autoFocus value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={handleEditorKeyDown} spellCheck className={`min-h-[420px] w-full resize-y rounded-2xl border p-8 outline-none ${light ? "border-line bg-white text-ink" : "border-[#402528] bg-[#241013] text-white"} focus:ring-4 focus:ring-tint`} style={{ fontSize, textAlign: alignment }} placeholder="Start writing here..." />
    <p className="mt-3 text-xs text-muted">Enter = new line · Shift + Enter = save</p>
    <div className="mt-5 flex flex-wrap gap-3"><button onClick={save} className={buttonClass}>▣ Save write-up</button><button onClick={removeLast} className={buttonClass}>Delete last</button><button onClick={clear} className={`${buttonClass} border-red-900`}>Clear all</button></div>
    {entries.length > 0 && <section className="mt-10 rounded-2xl border border-line bg-white p-6"><h2 className="font-bold text-maroon">Saved write-ups</h2><div className="mt-4 grid gap-3">{entries.map((entry) => <button key={entry.id} onClick={() => setContent(entry.content)} className={`${buttonClass} text-left`}>{entry.content.slice(0, 100)}{entry.content.length > 100 ? "..." : ""}</button>)}</div></section>}
  </div></WorkspaceGuard>;
}
