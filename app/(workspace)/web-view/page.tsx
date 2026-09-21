"use client";

import { useEffect, useState } from "react";
import { WorkspaceGuard } from "../../../components/workspace-guard";
import { getSlides, getTopics } from "../../../lib/storage";
import type { Slide, Topic } from "../../../lib/types";

export default function WebViewPage() {
  const [topics, setTopics] = useState<Topic[]>([]); const [topic, setTopic] = useState(""); const [slides, setSlides] = useState<Slide[]>([]);
  useEffect(() => { setTopics(getTopics()); setSlides(getSlides()); const initial = new URLSearchParams(window.location.search).get("topic"); if (initial) setTopic(initial); }, []);
  const visible = slides.filter((slide) => !topic || slide.topic === topic);
  return <WorkspaceGuard><div className="mx-auto max-w-5xl px-6 py-12"><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-brick">Knowledge hub</p><h1 className="mt-2 text-4xl font-black text-maroon">Web view</h1></div><select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-maroon"><option value="">All topics</option>{topics.map((item) => <option key={item.name}>{item.name}</option>)}</select></div>{visible.length ? <div className="space-y-5">{visible.map((slide) => <article key={slide.id} className="rounded-2xl border border-line bg-white p-7 shadow-soft"><p className="text-xs font-bold uppercase tracking-[.14em] text-brick">{slide.topic}</p><h2 className="mt-2 text-2xl font-black text-maroon">{slide.title}</h2><p className="mt-3 max-w-3xl leading-7 text-muted">{slide.description}</p></article>)}</div> : <div className="rounded-2xl border border-dashed border-[#e5bcba] bg-white p-12 text-center text-sm text-muted">No content matches this topic.</div>}</div></WorkspaceGuard>;
}
