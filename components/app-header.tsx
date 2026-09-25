"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Brand } from "./brand";
import * as storage from "../lib/storage";
import type { Slide, Topic } from "../lib/types";

export function AppHeader({ searchPlaceholder = "Search..." }: { searchPlaceholder?: string }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const isBoard = pathname === "/board";

  useEffect(() => {
    setTopics(storage.getTopics?.() || []);
    setSlides(storage.getSlides?.() || []);
    setSearch(new URLSearchParams(window.location.search).get("search") || "");
  }, [pathname]);

  const results = useMemo(() => {
    const terms = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (!terms.length || isBoard) return { topics: [], slides: [] };
    const matches = (value: string) => {
      const normalized = value.toLowerCase();
      return terms.every((term) => normalized.includes(term));
    };
    return {
      topics: topics.filter((topic) => matches(`${topic.name} ${topic.creator}`)),
      slides: slides.filter((slide) =>
        matches(`${slide.topic} ${slide.title} ${stripMarkup(slide.description)}`),
      ),
    };
  }, [isBoard, search, slides, topics]);

  const updateSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) params.set("search", value);
    else params.delete("search");
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, { scroll: false });
  };

  const signOut = () => {
    storage.logout();
    router.push("/");
  };
  const navigation = [
    { href: "/slide-view", label: "Slides" },
    { href: "/web-view", label: "Web view" },
    { href: "/slide-admin", label: "Setup" },
    { href: "/board", label: "Board" },
  ].filter(
    (item) =>
      (pathname !== "/slide-view" || item.href !== "/slide-view") &&
      (pathname !== "/web-view" || item.href !== "/web-view"),
  );
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-[#fffafa]/90 px-4 py-3 shadow-sm backdrop-blur md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3">
        <Brand href="/account" />
        <div className="mx-auto hidden w-full max-w-md md:block">
          <SearchBox
            value={search}
            placeholder={isBoard ? "Search your board..." : searchPlaceholder}
            onChange={updateSearch}
            results={results}
            isBoard={isBoard}
          />
        </div>
        <div className="relative flex items-center justify-end gap-1">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-lg px-3 py-2 text-xl text-maroon md:hidden"
          >
            ⌕
          </button>
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(!open)}
            className="rounded-lg px-3 py-2 text-xl text-maroon md:hidden"
          >
            ☰
          </button>
          {searchOpen && (
            <div className="absolute right-0 top-12 w-64 md:hidden">
              <SearchBox
                value={search}
                placeholder={isBoard ? "Search your board..." : searchPlaceholder}
                onChange={updateSearch}
                results={results}
                isBoard={isBoard}
              />
            </div>
          )}
          <nav
            className={`${open ? "flex" : "hidden"} absolute right-0 top-12 w-52 flex-col gap-1 rounded-2xl border border-line bg-white p-2 shadow-xl md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-maroon hover:bg-tint"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-maroon hover:bg-tint"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function SearchBox({
  value,
  placeholder,
  onChange,
  results,
  isBoard,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  results: { topics: Topic[]; slides: Slide[] };
  isBoard: boolean;
}) {
  const hasResults = results.topics.length > 0 || results.slides.length > 0;
  const hasQuery = value.trim().length > 0;
  return (
    <div className="relative">
      <input
        aria-label="Search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-tint"
      />
      {!isBoard && hasQuery && (
        <div className="absolute left-0 right-0 top-12 z-50 max-h-80 overflow-auto rounded-2xl border border-line bg-white p-2 text-sm shadow-xl">
          {hasResults ? (
            <>
              {results.topics.map((topic) => (
                <Link
                  key={`topic-${topic.name}`}
                  href={`/web-view?topic=${encodeURIComponent(topic.name)}&search=${encodeURIComponent(value)}`}
                  className="block rounded-xl px-3 py-2 text-maroon hover:bg-tint"
                >
                  <span className="block text-xs font-bold uppercase tracking-wide text-brick">
                    Topic
                  </span>
                  {topic.name}
                </Link>
              ))}
              {results.slides.map((slide) => (
                <Link
                  key={`slide-${slide.id}`}
                  href={`/web-view?topic=${encodeURIComponent(slide.topic)}&search=${encodeURIComponent(value)}`}
                  className="block rounded-xl px-3 py-2 text-maroon hover:bg-tint"
                >
                  <span className="block text-xs font-bold uppercase tracking-wide text-brick">
                    Slide · {slide.topic}
                  </span>
                  {slide.title}
                </Link>
              ))}
            </>
          ) : (
            <p className="px-3 py-2 text-muted">No topics or slides match.</p>
          )}
        </div>
      )}
    </div>
  );
}

function stripMarkup(value: string) {
  if (typeof document === "undefined") return value.replace(/<[^>]*>/g, " ");
  const element = document.createElement("div");
  element.innerHTML = value;
  return element.textContent || "";
}
