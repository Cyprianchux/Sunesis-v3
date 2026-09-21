"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Brand } from "../../components/brand";

function VerifyEmailContent() {
  const token = useSearchParams().get("token");
  return <main className="grid min-h-screen place-items-center px-6"><div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-soft"><Brand /><div className="mt-8"><div className={`text-5xl ${token ? "text-emerald-600" : "text-red-600"}`}>{token ? "✓" : "×"}</div><h1 className="mt-4 text-2xl font-black text-maroon">{token ? "Email verified" : "Verification failed"}</h1><p className="mt-3 text-sm leading-6 text-muted">{token ? "Your email has been confirmed. You can now sign in." : "This verification link is invalid or has expired."}</p><Link href="/" className="mt-6 inline-block text-sm font-bold text-brick">Sign in →</Link></div></div></main>;
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center text-sm font-bold text-maroon">Loading...</main>}><VerifyEmailContent /></Suspense>;
}
