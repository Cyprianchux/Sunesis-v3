import Link from "next/link";

const groups = [
  ["Platform", "Platform Overview", "Solutions", "How It Works", "Safety Approach"],
  ["Resources", "Help Center", "Guides", "Updates", "Community"],
  ["Legal", "Privacy Policy", "Terms of Use", "Cookies", "Data Protection"],
  ["Company", "About Sunesis", "Contact", "Careers", "Partnerships"],
];

export function Footer() {
  return <footer className="bg-[#200909] px-8 py-14 text-white"><div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">{groups.map(([heading, ...links]) => <div key={heading}><h3 className="mb-4 text-sm font-bold">{heading}</h3>{links.map((link) => <Link key={link} href={`/footer-pages?page=${link.toLowerCase().replaceAll(" ", "-")}`} className="mb-3 block text-xs text-[#c9a3a0] hover:text-white">{link}</Link>)}</div>)}</div><p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-5 text-xs text-[#a5827f]">© 2026 Sunesis. All rights reserved.</p></footer>;
}
