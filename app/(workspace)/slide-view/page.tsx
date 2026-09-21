"use client";

import { useEffect, useState } from "react";
import { WorkspaceGuard } from "../../../components/workspace-guard";
import { getSlides, getTopics } from "../../../lib/storage";
import type { Slide, Topic } from "../../../lib/types";

export default function SlideViewPage() {
  const [topics, setTopics] = useState<Topic[]>([]); const [topic, setTopic] = useState(""); const [slides, setSlides] = useState<Slide[]>([]); const [index, setIndex] = useState(0);
  useEffect(() => { setTopics(getTopics()); setSlides(getSlides()); const initial = new URLSearchParams(window.location.search).get("topic"); if (initial) setTopic(initial); }, []);
  const visible = slides.filter((slide) => !topic || slide.topic === topic); const current = visible[index];
  return <WorkspaceGuard><div className="mx-auto max-w-5xl px-6 py-12"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-brick">Focused learning</p><h1 className="mt-2 text-4xl font-black text-maroon">Slide view</h1></div><select value={topic} onChange={(e) => { setTopic(e.target.value); setIndex(0); }} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-maroon"><option value="">Choose a topic</option>{topics.map((item) => <option key={item.name}>{item.name}</option>)}</select></div><section className="relative grid min-h-[430px] place-items-center rounded-3xl bg-gradient-to-br from-[#6b1212] to-[#241013] p-10 text-center text-white shadow-2xl">{current ? <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#ffb1a8]">{current.topic}</p><h2 className="mt-5 text-4xl font-black">{current.title}</h2><p className="mt-5 leading-8 text-[#f0d5d2]">{current.description}</p></div> : <p className="text-[#f0d5d2]">Select a topic to view slides</p>}<button disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="absolute left-5 rounded-full bg-white/10 px-4 py-3 text-2xl disabled:opacity-30">‹</button><button disabled={!current || index === visible.length - 1} onClick={() => setIndex((value) => value + 1)} className="absolute right-5 rounded-full bg-white/10 px-4 py-3 text-2xl disabled:opacity-30">›</button></section><p className="mt-4 text-center text-xs text-muted">{visible.length ? `${index + 1} of ${visible.length}` : "No slides available"}</p></div></WorkspaceGuard>;
}
