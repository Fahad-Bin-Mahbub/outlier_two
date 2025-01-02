"use client";

import projectsData from '@/public/projects.json';
import { notFound, useRouter } from 'next/navigation';
import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProjectPage({ params: paramsPromise }: { params: Promise<{ type: string; slug: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { type, slug } = params;

  const project = projectsData.find((p: any) => p.type === type && p.slug === slug);
  if (!project) {
    notFound();
  }

  let Content;
  if (type === 'html') {
    Content = (
      <iframe
        src={`/HTML/${slug}.html`}
        className="w-full h-[calc(100vh-60px)] border-none bg-white"
        title={(project as any).title}
        allow="fullscreen"
      />
    );
  } else {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Glassmorphism Header */}
      <header className="h-[60px] flex items-center justify-between px-5 sticky top-0 z-50 border-b border-white/[0.07] bg-black/70 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.6)]">
        {/* Left: Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 font-medium cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </div>
            <span className="hidden sm:block">Back</span>
          </button>
        </motion.div>

        {/* Center: Project title */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2"
        >
          <span
            className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              type === 'react'
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                : 'bg-orange-500/10 text-orange-300 border-orange-500/20'
            }`}
          >
            {type}
          </span>
          <h1 className="font-semibold text-sm text-white max-w-[200px] sm:max-w-xs truncate">
            {(project as any).title}
          </h1>
        </motion.div>

        {/* Right: Category badge + Home link */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          {(project as any).category && (
            <span className="hidden md:inline-flex text-[11px] px-3 py-1 rounded-full bg-white/[0.06] text-white/60 border border-white/[0.08] font-medium">
              {(project as any).category}
            </span>
          )}
          <Link
            href="/"
            className="w-7 h-7 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
            title="Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </Link>
        </motion.div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full bg-neutral-950">
        {Content}
      </main>
    </div>
  );
}
