"use client";
import ProjectComponent from '@/components/projects/TrendNews';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="h-[60px] flex items-center justify-between px-5 sticky top-0 z-50 border-b border-white/[0.07] bg-black/70 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.6)]">
        <button onClick={() => router.back()} className="group flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 font-medium cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span className="hidden sm:block">Back</span>
        </button>
        <div className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-blue-500/10 text-blue-300 border-blue-500/20">React</span>
          <h1 className="font-semibold text-sm text-white max-w-[200px] sm:max-w-xs truncate">TrendNews</h1>
        </div>
        <Link href="/" className="w-7 h-7 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors" title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>
      </header>
      <main className="flex-1 w-full bg-neutral-950"><ProjectComponent /></main>
    </div>
  );
}
