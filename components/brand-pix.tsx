import Link from "next/link";

export function BrandPix({ href = "#" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-maroon"
    >
      <img src="/images/sunesisBG.png" alt="" className="h-auto w-auto rounded-xl object-cover" />
    </Link>
  );
}
