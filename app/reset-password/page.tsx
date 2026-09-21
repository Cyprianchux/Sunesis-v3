"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Brand } from "../../components/brand";
import { Button, Input, Toast } from "../../components/ui";
import { passwordRules } from "../../lib/types";

function ResetPasswordContent() {
  const token = useSearchParams().get("token"); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [success, setSuccess] = useState(false); const [error, setError] = useState("");
  const submit = () => { if (!token) return setError("This password reset link is invalid or has expired."); if (!passwordRules.every((rule) => rule.test(password))) return setError("Use 8 characters with an uppercase letter and number."); if (password !== confirm) return setError("Passwords do not match."); setSuccess(true); };
  return <main className="grid min-h-screen place-items-center px-6"><div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-soft"><Brand /><div className="mt-8">{error && <Toast message={error} type="error" />}{success ? <><div className="text-5xl text-emerald-600">✓</div><h1 className="mt-4 text-2xl font-black text-maroon">Password reset</h1><p className="mt-3 text-sm text-muted">Your password has been updated.</p></> : <><div className="text-5xl text-brick">⌘</div><h1 className="mt-4 text-2xl font-black text-maroon">Choose a new password</h1><p className="mt-3 text-sm text-muted">Enter a new password for your Sunesis account.</p><Input className="mt-6" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" /><Input className="mt-3" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" /><Button onClick={submit} className="mt-4 w-full">Reset password →</Button></>}<Link href="/" className="mt-6 inline-block text-sm font-bold text-brick">Back to login</Link></div></div></main>;
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center text-sm font-bold text-maroon">Loading...</main>}><ResetPasswordContent /></Suspense>;
}
