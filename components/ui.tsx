import {
  useEffect,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";

export function Button({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-xl bg-brick px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/10 transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-line bg-[#fcf7f6] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-[#b39a97] focus:border-[#de908d] focus:bg-white focus:ring-4 focus:ring-[#f9e4e2]",
        className,
      )}
      {...props}
    />
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white p-6 shadow-soft", className)}>
      {children}
    </section>
  );
}

export function Toast({
  message,
  type = "info",
  onDismiss,
}: {
  message: string;
  type?: "info" | "success" | "error";
  onDismiss?: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss?.(), 5000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);
  return (
    <div
      role="status"
      className={cn(
        "fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-xl",
        type === "success" && "bg-emerald-600",
        type === "error" && "bg-red-700",
        type === "info" && "bg-sky-600",
      )}
    >
      {message}
    </div>
  );
}
