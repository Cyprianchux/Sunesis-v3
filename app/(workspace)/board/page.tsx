"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Toast } from "../../../components/ui";
import { WorkspaceGuard } from "../../../components/workspace-guard";
import { getBoardEntries, saveBoardEntries } from "../../../lib/storage";
import type { BoardEntry } from "../../../lib/types";
import { makeId } from "../../../lib/utils";

function AlignmentIcon({ alignment }: { alignment: "left" | "center" | "right" }) {
  const position =
    alignment === "left" ? "items-start" : alignment === "center" ? "items-center" : "items-end";
  return (
    <span aria-hidden="true" className={`flex h-5 w-6 flex-col justify-center gap-0.5 ${position}`}>
      <span className="h-0.5 w-5 rounded-full bg-current" />
      <span className="h-0.5 w-4 rounded-full bg-current" />
      <span className="h-0.5 w-5 rounded-full bg-current" />
      <span className="h-0.5 w-3 rounded-full bg-current" />
    </span>
  );
}

function ToolButton({
  label,
  children,
  active,
  light,
  onClick,
}: {
  label: string;
  children: ReactNode;
  active?: boolean;
  light: boolean;
  onClick: () => void;
}) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={label}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className={`peer rounded-lg border px-3 py-2 text-sm font-bold transition ${light ? "border-line bg-white text-maroon hover:bg-[#fcf7f6]" : "border-[#402528] bg-[#241013] text-white hover:bg-[#402528]"} ${active ? "ring-2 ring-[#de908d]" : ""}`}
      >
        {children}
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-semibold opacity-0 shadow-lg transition-opacity group-hover:opacity-100 peer-focus-visible:opacity-100 ${light ? "border-line bg-white text-maroon" : "border-[#402528] bg-[#241013] text-white"}`}
      >
        {label}
      </span>
    </span>
  );
}

function BoardContent() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<BoardEntry[]>([]);
  const [light, setLight] = useState(false);
  const [fontSize, setFontSize] = useState(32);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [notice, setNotice] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const searchMatchesRef = useRef<TextMatch[]>([]);
  const searchQuery = searchParams?.get("search") || "";

  useEffect(() => {
    setEntries(getBoardEntries());
    setLight(window.localStorage.getItem("sunesisWordLightMode") === "true");
    setFontSize(Number(window.localStorage.getItem("sunesisWordFontSize")) || 32);
    if (editorRef.current) editorRef.current.innerHTML = "<div><br /></div>";
  }, []);

  const save = () => {
    if (!content.trim()) return;
    const next = [
      ...entries,
      { id: makeId(), content: content.trim(), createdAt: new Date().toISOString() },
    ];
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

  const updateContent = () => {
    if (editorRef.current) setContent(editorRef.current.innerText.replace(/\u00a0/g, " "));
  };

  useEffect(() => {
    searchMatchesRef.current = editorRef.current
      ? findTextMatches(editorRef.current, searchQuery)
      : [];
    setMatchIndex(0);
  }, [content, searchQuery]);

  useEffect(() => {
    const match = searchMatchesRef.current[matchIndex];
    if (!match || !editorRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.setStart(match.node, match.start);
    range.setEnd(match.node, match.end);
    selection.removeAllRanges();
    selection.addRange(range);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();
    editorRef.current.scrollTop += rect.top - editorRect.top - editorRect.height / 3;
  }, [content, matchIndex, searchQuery]);

  useEffect(() => {
    const handleSearchNavigation = (event: globalThis.KeyboardEvent) => {
      if (
        !searchMatchesRef.current.length ||
        (event.key !== "ArrowDown" && event.key !== "ArrowUp")
      )
        return;
      event.preventDefault();
      setMatchIndex((current) => {
        const count = searchMatchesRef.current.length;
        return event.key === "ArrowDown" ? (current + 1) % count : (current - 1 + count) % count;
      });
    };
    window.addEventListener("keydown", handleSearchNavigation);
    return () => window.removeEventListener("keydown", handleSearchNavigation);
  }, []);

  const setEditorContent = (value: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
        .split("\n")
        .map(
          (line) =>
            `<div>${line ? line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "<br />"}</div>`,
        )
        .join("");
    }
    setContent(value);
  };

  const alignSelection = (nextAlignment: "left" | "center" | "right") => {
    const command =
      nextAlignment === "left"
        ? "justifyLeft"
        : nextAlignment === "center"
          ? "justifyCenter"
          : "justifyRight";
    document.execCommand(command);
    setAlignment(nextAlignment);
    updateContent();
    editorRef.current?.focus();
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    const editor = event.currentTarget;
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const currentBlock =
      selection.anchorNode?.parentElement?.closest("div") || selection.anchorNode?.parentElement;
    const currentLine = currentBlock?.innerText || "";
    if (currentLine === "• ") {
      event.preventDefault();
      if (currentBlock) currentBlock.innerHTML = "<br />";
      updateContent();
      return;
    }

    if (currentLine.startsWith("• ")) {
      event.preventDefault();
      document.execCommand("insertParagraph");
      document.execCommand("insertText", false, "• ");
      updateContent();
    }

  };

  const addBullet = () => {
    editorRef.current?.focus();
    document.execCommand("insertText", false, "• ");
    updateContent();
  };

  const buttonClass =
    "rounded-xl border border-[#402528] bg-[#241013] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#402528]";

  return (
    <WorkspaceGuard>
      <div className="mx-auto max-w-5xl px-6 py-10">
        {notice && <Toast message={notice} />}
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-brick">Thinking space</p>
          <h1 className="mt-2 text-4xl font-black text-maroon">Typing board</h1>
          <p className="mt-2 text-muted">Write, save, and revisit your explanations.</p>
        </header>
        <div className="mb-4 flex flex-wrap gap-2">
          <ToolButton
            light={light}
            label={light ? "Switch to dark board" : "Switch to light board"}
            onClick={() => {
              const next = !light;
              setLight(next);
              window.localStorage.setItem("sunesisWordLightMode", String(next));
            }}
          >
            ◐
          </ToolButton>
          <ToolButton
            light={light}
            label="Decrease font size"
            onClick={() => {
              const next = Math.max(20, fontSize - 4);
              setFontSize(next);
              window.localStorage.setItem("sunesisWordFontSize", String(next));
            }}
          >
            −
          </ToolButton>
          <ToolButton
            light={light}
            label="Increase font size"
            onClick={() => {
              const next = fontSize + 4;
              setFontSize(next);
              window.localStorage.setItem("sunesisWordFontSize", String(next));
            }}
          >
            +
          </ToolButton>
          <ToolButton light={light} label="Insert bullet" onClick={addBullet}>
            •
          </ToolButton>
          <ToolButton
            light={light}
            label="Align text left"
            active={alignment === "left"}
            onClick={() => alignSelection("left")}
          >
            <AlignmentIcon alignment="left" />
          </ToolButton>
          <ToolButton
            light={light}
            label="Align text center"
            active={alignment === "center"}
            onClick={() => alignSelection("center")}
          >
            <AlignmentIcon alignment="center" />
          </ToolButton>
          <ToolButton
            light={light}
            label="Align text right"
            active={alignment === "right"}
            onClick={() => alignSelection("right")}
          >
            <AlignmentIcon alignment="right" />
          </ToolButton>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Typing board editor"
          aria-multiline="true"
          onInput={updateContent}
          onKeyDown={handleEditorKeyDown}
          spellCheck
          className={`min-h-[420px] w-full resize-y overflow-auto rounded-2xl border p-8 outline-none ${light ? "border-line bg-white text-ink" : "border-[#402528] bg-[#241013] text-white"} focus:ring-4 focus:ring-tint`}
          style={{ fontSize }}
          data-placeholder="Start writing here..."
        />
        <p className="mt-3 text-xs text-muted">Enter = new line · Shift + Enter = save</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={save} className={buttonClass}>
            ▣ Save write-up
          </button>
          <button onClick={removeLast} className={buttonClass}>
            Delete last
          </button>
          <button onClick={clear} className={`${buttonClass} border-red-900`}>
            Clear all
          </button>
        </div>
        {entries.length > 0 && (
          <section className="mt-10 rounded-2xl border border-line bg-white p-6">
            <h2 className="font-bold text-maroon">Saved write-ups</h2>
            <div className="mt-4 grid gap-3">
              {entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setEditorContent(entry.content)}
                  className={`${buttonClass} text-left`}
                >
                  {entry.content.slice(0, 100)}
                  {entry.content.length > 100 ? "..." : ""}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </WorkspaceGuard>
  );
}

export default function BoardPage() {
  return (
    <Suspense fallback={null}>
      <BoardContent />
    </Suspense>
  );
}

type TextMatch = { node: Text; start: number; end: number };

function findTextMatches(root: HTMLElement, query: string): TextMatch[] {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!terms.length) return [];
  const matches: TextMatch[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();
  while (node) {
    const textNode = node as Text;
    const value = textNode.data.toLowerCase();
    terms.forEach((term) => {
      let start = value.indexOf(term);
      while (start !== -1) {
        matches.push({ node: textNode, start, end: start + term.length });
        start = value.indexOf(term, start + term.length);
      }
    });
    node = walker.nextNode();
  }
  return matches;
}
