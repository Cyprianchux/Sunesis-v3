"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Brand } from "./brand";
import { logout } from "../lib/storage";

export function AppHeader({ searchPlaceholder = "Search..." }: { searchPlaceholder?: string }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const signOut = () => {
    logout();
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
          <input
            aria-label="Search"
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-tint"
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
              <input
                autoFocus
                aria-label="Search"
                placeholder={searchPlaceholder}
                className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm shadow-lg outline-none focus:ring-4 focus:ring-tint"
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
