"use client";

import { useEffect, useState } from "react";
import { WorkspaceGuard } from "../../../components/workspace-guard";
import { getSlides, getTopics } from "../../../lib/storage";
import type { Slide, Topic } from "../../../lib/types";
import { descriptionToHtml } from "../../../lib/rich-text";

export default function SlideViewPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [jumpTo, setJumpTo] = useState("");
  useEffect(() => {
    setTopics(getTopics());
    setSlides(getSlides());
    const initial = new URLSearchParams(window.location.search).get("topic");
    if (initial) setTopic(initial);
  }, []);
  const visible = slides.filter((slide) => !topic || slide.topic === topic);
  const current = visible[index];
  const jump = () => {
    const slideNumber = Number.parseInt(jumpTo, 10);
    if (Number.isInteger(slideNumber) && slideNumber >= 1 && slideNumber <= visible.length) {
      setIndex(slideNumber - 1);
      setJumpTo("");
    }
  };
  return (
    <WorkspaceGuard>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-brick">
              Focused learning
            </p>
            <h1 className="mt-2 text-4xl font-black text-maroon">Slide view</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <select
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setIndex(0);
              }}
              className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-maroon"
            >
              <option value="">Choose a topic</option>
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
              <label htmlFor="slide-jump">Jump to</label>
              <input
                id="slide-jump"
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
        <section className="relative grid min-h-[430px] place-items-center rounded-3xl bg-gradient-to-br from-[#6b1212] to-[#241013] p-10 text-center text-white shadow-2xl">
          {current ? (
            <div className="max-w-2xl">
              <h2 className="mt-5 text-4xl font-black">{current.title}</h2>
              <div
                className="mt-5 text-left text-lg leading-8 text-[#f0d5d2]"
                dangerouslySetInnerHTML={{ __html: descriptionToHtml(current.description) }}
              />
              {current.mediaUrl &&
                (current.mediaType === "video" ? (
                  <video
                    className="mx-auto mt-6 max-h-56 rounded-xl"
                    controls
                    src={current.mediaUrl}
                  />
                ) : (
                  <img
                    className="mx-auto mt-6 max-h-56 rounded-xl object-contain"
                    src={current.mediaUrl}
                    alt={current.title}
                  />
                ))}
            </div>
          ) : (
            <p className="text-[#f0d5d2]">Select a topic to view slides</p>
          )}
          <button
            disabled={index === 0}
            onClick={() => setIndex((value) => value - 1)}
            className="absolute left-5 rounded-full bg-white/10 px-4 py-3 text-2xl disabled:opacity-30"
          >
            ‹
          </button>
          <button
            disabled={!current || index === visible.length - 1}
            onClick={() => setIndex((value) => value + 1)}
            className="absolute right-5 rounded-full bg-white/10 px-4 py-3 text-2xl disabled:opacity-30"
          >
            ›
          </button>
        </section>
        <p className="mt-4 text-center text-xs text-muted">
          {visible.length ? `${index + 1} of ${visible.length}` : "No slides available"}
        </p>
      </div>
    </WorkspaceGuard>
  );
}
