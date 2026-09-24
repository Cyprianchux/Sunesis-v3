import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-maroon"
    >
      <img src="/images/sunesisIcon.png" alt="" className="h-10 w-10 rounded-xl object-cover" />
      <span className="bg-gradient-to-r from-brick via-[#7a1e4e] to-indigo-950 bg-clip-text text-transparent">
        sunesis
      </span>
    </Link>
  );
}
