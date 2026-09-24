"use client";

import { useEffect, useState } from "react";
import { WorkspaceGuard } from "../../../components/workspace-guard";
import { getSlides, getTopics } from "../../../lib/storage";
import type { Slide, Topic } from "../../../lib/types";
import { descriptionToHtml } from "../../../lib/rich-text";

export default function WebViewPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [jumpTo, setJumpTo] = useState("");
  useEffect(() => {
    setTopics(getTopics());
    setSlides(getSlides());
    const initial = new URLSearchParams(window.location.search).get("topic");
    if (initial) setTopic(initial);
  }, []);
  const visible = slides.filter((slide) => !topic || slide.topic === topic);
  const jump = () => {
    const slideNumber = Number.parseInt(jumpTo, 10);
    if (Number.isInteger(slideNumber) && slideNumber >= 1 && slideNumber <= visible.length) {
      document
        .getElementById(`web-slide-${slideNumber}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      setJumpTo("");
    }
  };
  return (
    <WorkspaceGuard>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-brick">Knowledge hub</p>
            <h1 className="mt-2 text-4xl font-black text-maroon">Web view</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-maroon"
            >
              <option value="">All topics</option>
              {topics.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                jump();
              }}
              className="flex items-center gap-2 text-sm font-semibold text-maroon"
            >
              <label htmlFor="web-slide-jump">Jump to</label>
              <input
                id="web-slide-jump"
                type="number"
                min="1"
                max={visible.length || undefined}
                value={jumpTo}
                onChange={(e) => setJumpTo(e.target.value)}
                placeholder="No."
                className="w-16 rounded-xl border border-line bg-white px-3 py-3 text-center text-sm outline-none focus:ring-4 focus:ring-tint"
              />
              <button
                type="submit"
                aria-label="Go to slide"
                title="Go to slide"
                className="rounded-xl bg-brick px-3 py-3 text-lg font-bold leading-none text-white transition hover:bg-red-800"
              >
                →
              </button>
            </form>
          </div>
        </div>
        {visible.length ? (
          <div className="space-y-5">
            {visible.map((slide, slideIndex) => (
              <article
                id={`web-slide-${slideIndex + 1}`}
                key={slide.id}
                className="scroll-mt-24 rounded-2xl border border-line bg-white p-7 shadow-soft"
              >
                <h2 className="text-2xl font-black text-maroon">{slide.title}</h2>
                <div
                  className="mt-3 max-w-3xl text-lg leading-8 text-muted"
                  dangerouslySetInnerHTML={{ __html: descriptionToHtml(slide.description) }}
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e5bcba] bg-white p-12 text-center text-sm text-muted">
            No content matches this topic.
          </div>
        )}
      </div>
    </WorkspaceGuard>
  );
}
