"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Toast } from "./ui";
import { emailPattern } from "../lib/utils";
import { getUsers, hashPassword, saveUser, setCurrentUser } from "../lib/storage";
import { passwordRules, type User } from "../lib/types";

export function AuthCard() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [notice, setNotice] = useState<{ message: string; type: "info" | "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ username: "", email: "", password: "", confirm: "", remember: false });
  const update = (key: keyof typeof values, value: string | boolean) => setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setNotice(null);
    if (mode === "forgot") { if (!emailPattern.test(values.email)) return setNotice({ message: "Please provide a valid email address.", type: "error" }); setNotice({ message: "If an account exists, a reset link has been sent.", type: "success" }); return; }
    if (mode === "register") {
      if (!values.username || !values.email || !values.password || !values.confirm) return setNotice({ message: "All fields are required.", type: "error" });
      if (!emailPattern.test(values.email)) return setNotice({ message: "Please provide a valid email address.", type: "error" });
      if (!passwordRules.every((rule) => rule.test(values.password))) return setNotice({ message: "Use 8 characters with an uppercase letter and number.", type: "error" });
      if (values.password !== values.confirm) return setNotice({ message: "Passwords do not match.", type: "error" });
      const username = values.username.trim().toLowerCase(); const users = getUsers();
      if (users[username]) return setNotice({ message: "User already exists.", type: "error" });
      setLoading(true); const user: User = { username, email: values.email.trim().toLowerCase(), passwordHash: await hashPassword(values.password), role: "user", verified: true }; saveUser(user); setCurrentUser(user, values.remember); setLoading(false); router.push("/account"); return;
    }
    const username = values.username.trim().toLowerCase(); const user = getUsers()[username];
    if (!user || user.passwordHash !== await hashPassword(values.password)) return setNotice({ message: "Invalid username or password.", type: "error" });
    setCurrentUser(user, values.remember); router.push("/account");
  };
  const rules = values.password ? passwordRules.map((rule) => ({ ...rule, valid: rule.test(values.password) })) : [];
  return <div className="w-full max-w-md rounded-3xl bg-white p-7 text-left shadow-2xl shadow-black/20 sm:p-9">{notice && <Toast message={notice.message} type={notice.type} />}<div className="mb-7 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-tint text-xl text-brick">{mode === "register" ? "+" : mode === "forgot" ? "?" : "→"}</span><div><h2 className="text-xl font-bold text-maroon">{mode === "register" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Welcome back"}</h2><p className="text-xs text-muted">{mode === "register" ? "Begin your learning journey" : mode === "forgot" ? "We'll email you a reset link" : "Sign in to your workspace"}</p></div></div><form onSubmit={submit} className="space-y-4">{mode !== "forgot" && <><label className="block text-xs font-bold text-maroon">Username<Input value={values.username} onChange={(e) => update("username", e.target.value)} placeholder="Enter your username" autoComplete="username" /></label></>}{mode !== "login" && <label className="block text-xs font-bold text-maroon">Email<Input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} placeholder="Enter your email" autoComplete="email" /></label>}{mode !== "forgot" && <label className="block text-xs font-bold text-maroon">Password<Input type="password" value={values.password} onChange={(e) => update("password", e.target.value)} placeholder={mode === "register" ? "Create a password" : "Enter your password"} autoComplete={mode === "register" ? "new-password" : "current-password"} />{rules.length > 0 && <ul className="mt-2 space-y-1 text-[11px]">{rules.map((rule) => <li className={rule.valid ? "text-emerald-600" : "text-red-400"} key={rule.label}>{rule.valid ? "✓" : "○"} {rule.label}</li>)}</ul>}</label>}{mode === "register" && <label className="block text-xs font-bold text-maroon">Confirm password<Input type="password" value={values.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="Confirm password" /></label>}{mode === "login" && <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-muted"><input type="checkbox" checked={values.remember} onChange={(e) => update("remember", e.target.checked)} /> Remember me</label><button type="button" className="font-bold text-brick" onClick={() => setMode("forgot")}>Forgot password?</button></div>}<Button className="w-full" disabled={loading}>{loading ? "Processing..." : mode === "register" ? "Create account →" : mode === "forgot" ? "Send reset link →" : "Sign in →"}</Button></form><p className="mt-5 text-center text-xs text-muted">{mode === "login" && <>Don't have an account? <button className="font-bold text-brick" onClick={() => setMode("register")}>Register</button></>}{mode === "register" && <>Already have an account? <button className="font-bold text-brick" onClick={() => setMode("login")}>Login</button></>}{mode === "forgot" && <>Remembered your password? <button className="font-bold text-brick" onClick={() => setMode("login")}>Back to sign in</button></>}</p></div>;
}
