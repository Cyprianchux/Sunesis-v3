"use client";

import { useRef } from "react";
import { Brand } from "../components/brand";
import { BrandPix } from "../components/brand-pix";
import { Footer } from "../components/footer";
import { AuthCard } from "../components/auth-card";

const features = [
  ["◈", "Smart understanding", "Break down complex topics into structured, digestible knowledge."],
  ["▦", "Topic-based learning", "Organize content by themes for faster comprehension and recall."],
  ["▶", "Slide view mode", "Present knowledge one slide at a time for focused learning."],
  ["◎", "Web view mode", "Browse all content in a full-page layout like a digital knowledge hub."],
  ["▤", "Typing board", "Use a board to explain contents and concepts."],
  ["⌕", "Search & filter", "Instantly find insights across all topics and materials."],
  ["✎", "Create & manage slides", "Build visual knowledge cards with text, images, and videos."],
  ["ϟ", "Fast navigation", "Move through topics and materials with zero friction."],
  ["▣", "Persistent storage", "Your learning content stays available even offline."],
  ["✓", "Secure access", "Hashed credentials and protected user sessions."],
  ["↗", "Progress tracking", "Monitor learning growth over time."],
];

export default function Home() {
  const authRef = useRef<HTMLElement>(null);
  return (
    <>
      <div className="overflow-hidden">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Brand />
          <button
            onClick={() => authRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm font-bold text-maroon"
          >
            Sign in →
          </button>
        </header>
        <main>
          <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 lg:grid-cols-[1fr_.9fr] lg:py-20">
            <div>
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[.16em] text-brick">
                ● A clearer way to learn
              </p>
              <h1 className="max-w-2xl text-5xl font-black leading-[.98] tracking-tight text-maroon sm:text-7xl">
                Turn information into <span className="text-brick">understanding.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                Sunesis is a focused learning and presentation workspace for turning complex ideas
                into structured, memorable knowledge.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-muted">
                <li>✓ Learn with more clarity</li>
                <li>✓ Present ideas with confidence</li>
                <li>✓ Keep every insight organized</li>
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button
                  onClick={() => authRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-xl bg-brick px-5 py-3 font-bold text-white shadow-lg shadow-red-900/20"
                >
                  Get started →
                </button>
                <span className="text-xs text-muted">● Free to use</span>
              </div>
            </div>
            <div className="relative min-h-[360px]">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6dcda] blur-sm" />
              <div className="absolute right-0 top-16 rounded-xl border border-line bg-white px-4 py-3 text-xs font-bold text-maroon shadow-xl">
                💡 Make ideas stick
              </div>
              <div className="absolute bottom-10 left-0 rounded-xl border border-line bg-white px-4 py-3 text-xs font-bold text-maroon shadow-xl">
                ▦ Learn in layers
              </div>
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative grid h-64 w-64 place-items-center rounded-[4rem] bg-gradient-to-br from-brick via-[#7a1e4e] to-indigo-950 text-8xl font-black text-white shadow-2xl shadow-red-900/25">
                  <BrandPix />
                </div>
              </div>
            </div>
          </section>
          <section
            ref={authRef}
            id="auth-section"
            className="grid items-center gap-10 bg-gradient-to-br from-[#6b1212] to-[#471010] px-6 py-20 lg:grid-cols-[.9fr_1fr] lg:px-[max(1.5rem,calc((100% - 1050px)/2))]"
          >
            <div className="text-white">
              <p className="mb-5 text-xs font-bold uppercase tracking-[.16em] text-[#ffb1a8]">
                ● Your workspace awaits
              </p>
              <h2 className="text-4xl font-black leading-tight">
                Start building your
                <br />
                <span className="text-[#ffb1a8]">knowledge base.</span>
              </h2>
              <p className="mt-5 max-w-sm leading-7 text-[#e7c3bf]">
                Log in to continue learning, or create your free account in seconds.
              </p>
            </div>
            <AuthCard />
          </section>
          <section className="mx-auto grid max-w-7xl gap-5 px-6 py-24 sm:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-full mx-auto mb-7 max-w-xl text-center">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-brick">
                ● Everything in one place
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-maroon">
                Tools for thinking <span className="text-brick">better.</span>
              </h2>
              <p className="mt-3 text-sm text-muted">
                Everything you need to capture, shape, and share what you know.
              </p>
            </div>
            {features.map(([icon, title, description]) => (
              <article
                key={title}
                className="rounded-2xl border border-[#f2e4e2] bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="mb-5 text-2xl text-brick">{icon}</div>
                <h3 className="font-bold text-maroon">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
            <article className="rounded-2xl bg-gradient-to-br from-[#c93a30] to-[#8f1a1a] p-6 text-white">
              <h3 className="font-bold">Start now</h3>
              <p className="mt-2 text-sm leading-6">
                Create an account and begin mastering information right away.
              </p>
              <button
                onClick={() => authRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-bold text-brick"
              >
                Get started
              </button>
            </article>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
