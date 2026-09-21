"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer } from "../../../components/footer";
import { WorkspaceGuard } from "../../../components/workspace-guard";
import { getCurrentUser, getSlides, getTopics } from "../../../lib/storage";
import type { Topic } from "../../../lib/types";

export default function AccountPage() {
  const [user, setUser] = useState(""); const [topics, setTopics] = useState<Topic[]>([]);
  useEffect(() => { setUser(getCurrentUser() || "learner"); setTopics(getTopics()); }, []);
  return <WorkspaceGuard><section className="bg-gradient-to-br from-[#6b1212] to-[#471010] px-6 py-12 text-center text-white"><h1 className="text-3xl font-black">Welcome, {user}</h1><p className="mt-2 text-[#e7c3bf]">Select a topic to continue</p></section><section className="mx-auto min-h-[55vh] max-w-6xl px-6 py-12"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-brick">Your library</p><h2 className="mt-2 text-3xl font-black text-maroon">Knowledge topics</h2></div><Link href="/slide-admin" className="rounded-xl bg-brick px-4 py-3 text-sm font-bold text-white">+ Create content</Link></div>{topics.length === 0 ? <div className="rounded-2xl border border-dashed border-[#e5bcba] bg-white p-12 text-center"><p className="font-bold text-maroon">Your knowledge base is ready for its first topic.</p><p className="mt-2 text-sm text-muted">Create a topic, then add slides in Content Manager.</p></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{topics.map((topic) => <article key={topic.name} className="rounded-2xl border border-line bg-white p-6 shadow-soft transition hover:-translate-y-1"><div className="text-2xl text-brick">▦</div><h3 className="mt-4 font-bold text-maroon">{topic.name}</h3><p className="mt-1 text-xs text-muted">{getSlides().filter((slide) => slide.topic === topic.name).length} slides · by {topic.creator}</p><div className="mt-5 flex gap-2"><Link href={`/slide-view?topic=${encodeURIComponent(topic.name)}`} className="rounded-lg bg-brick px-3 py-2 text-xs font-bold text-white">Learn</Link><Link href={`/web-view?topic=${encodeURIComponent(topic.name)}`} className="rounded-lg border border-line px-3 py-2 text-xs font-bold text-maroon">Web view</Link></div></article>)}</div>}</section><Footer /></WorkspaceGuard>;
}
