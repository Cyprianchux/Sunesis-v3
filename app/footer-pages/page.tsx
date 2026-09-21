import Link from "next/link";

const content: Record<string, { title: string; body: string }> = {
  "platform-overview": { title: "Platform Overview", body: "Sunesis turns complex ideas into structured, memorable knowledge through topics, slides, and focused learning views." },
  solutions: { title: "Solutions", body: "Build personal study spaces, teaching materials, presentation content, and reusable knowledge hubs." },
  "how-it-works": { title: "How It Works", body: "Create an account, make a topic, add slides, then move between slide view, web view, and the typing board." },
  "privacy-policy": { title: "Privacy Policy", body: "Your local workspace data is stored in your browser. Keep credentials private and use a trusted device." },
  "terms-of-use": { title: "Terms of Use", body: "Use Sunesis responsibly to create and share learning content that you have permission to use." },
};

export default async function FooterPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = (await searchParams).page || "platform-overview"; const item = content[page] || { title: page.replaceAll("-", " "), body: "This Sunesis resource is being prepared." };
  return <main className="grid min-h-screen place-items-center px-6 py-12"><article className="w-full max-w-2xl rounded-3xl border border-line bg-white p-8 text-center shadow-soft sm:p-12"><p className="text-xs font-bold uppercase tracking-[.15em] text-brick">Sunesis resource</p><h1 className="mt-4 text-4xl font-black capitalize text-maroon">{item.title}</h1><p className="mx-auto mt-5 max-w-xl leading-8 text-muted">{item.body}</p><Link href="/" className="mt-8 inline-block rounded-xl bg-brick px-5 py-3 text-sm font-bold text-white">Back to Sunesis</Link></article></main>;
}
