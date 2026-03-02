"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import projectsData from "@/public/projects.json";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
} from "framer-motion";
import Image from "next/image";
const ITEMS_PER_PAGE = 12;

// ─── Floating Particle ────────────────────────────────────────────
function FloatingParticle({
	x,
	y,
	size,
	delay,
}: {
	x: number;
	y: number;
	size: number;
	delay: number;
}) {
	return (
		<motion.div
			className="absolute rounded-full bg-white/5 pointer-events-none"
			style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
			animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
			transition={{
				duration: 6 + delay * 2,
				repeat: Infinity,
				delay,
				ease: "easeInOut",
			}}
		/>
	);
}

// ─── Hero Section ─────────────────────────────────────────────────
function HeroSection() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.9, ease: "easeOut" }}
			className="w-full flex flex-col items-center text-center mb-24 mt-4"
		>
			{/* Photo Placeholder */}
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{
					duration: 0.7,
					delay: 0.1,
					type: "spring",
					stiffness: 100,
				}}
				className="relative mb-8"
			>
				<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_60px_rgba(139,92,246,0.3)]">
					{/* Gradient placeholder */}
					<div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 via-blue-600/40 to-indigo-700/60 flex flex-col items-center justify-center gap-1">
						<Image
							src="/Fahad Bin Mahbub Photo.jpg"
							alt="Fahad Bin Mahbub"
							fill
							className="object-cover"
							priority
						/>
					</div>
				</div>
				{/* Glow ring */}
				<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-xl scale-125 -z-10" />
				{/* Available badge */}
				<div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#030303] shadow-lg">
					<div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
				</div>
			</motion.div>

			{/* Name */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.2 }}
				className="mb-3"
			>
				<span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4 tracking-wider uppercase">
					<span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
					AI Trainer · Outlier.ai
				</span>
				<h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/30 leading-none">
					Fahad Bin Mahbub
				</h1>
			</motion.div>

			{/* Role */}
			<motion.p
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.3 }}
				className="text-lg md:text-xl font-medium text-neutral-300 mb-4"
			>
				Software Engineer &amp; AI Trainer
			</motion.p>

			{/* Bio */}
			<motion.p
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.4 }}
				className="max-w-xl text-sm md:text-base text-neutral-500 leading-relaxed mb-8"
			>
				I craft interactive experiences and intelligent interfaces as an AI
				Trainer at Outlier.ai. This portfolio showcases a curated collection of
				my work — from pixel-perfect UI experiments to complex React
				applications.
			</motion.p>

			{/* Social Links */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.5 }}
				className="flex items-center gap-3"
			>
				{/* GitHub */}
				<a
					href="https://github.com/Fahad-Bin-Mahbub"
					target="_blank"
					rel="noopener noreferrer"
					className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 transition-all duration-300 text-sm text-neutral-300 hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					GitHub
				</a>
				{/* Portfolio */}
				<a
					href="https://fahad-bin-mahbub.github.io/"
					target="_blank"
					rel="noopener noreferrer"
					className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 transition-all duration-300 text-sm text-neutral-300 hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
						<path d="M2 12h20" />
					</svg>
					Portfolio
				</a>
				{/* LinkedIn */}
				<a
					href="https://www.linkedin.com/in/fahad-bin-mahbub-650151212/"
					target="_blank"
					rel="noopener noreferrer"
					className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 transition-all duration-300 text-sm text-neutral-300 hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
					</svg>
					LinkedIn
				</a>
			</motion.div>
		</motion.div>
	);
}

// ─── Stats Bar ─────────────────────────────────────────────────────
function StatsBar({ total }: { total: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.6 }}
			className="w-full flex items-center justify-center gap-6 md:gap-12 mb-16 flex-wrap"
		>
			<div className="flex flex-col items-center gap-1">
				<span className="text-3xl md:text-4xl font-bold tabular-nums text-white">
					{total}
				</span>
				<span className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
					Total Projects
				</span>
			</div>
		</motion.div>
	);
}

// ─── Footer ────────────────────────────────────────────────────────
function Footer() {
	return (
		<motion.footer
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8, delay: 0.3 }}
			className="w-full mt-32 border-t border-white/5 pt-16 pb-10"
		>
			{/* Top gradient line */}
			<div className="absolute left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent -mt-16 mb-16" />

			<div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-10">
				{/* Tagline */}
				<div>
					<h3 className="text-xl md:text-2xl font-bold text-white mb-2">
						Let&apos;s Connect
					</h3>
					<p className="text-neutral-500 text-sm max-w-sm">
						Interested in my work or want to collaborate? Reach out through any
						of the links below.
					</p>
				</div>

				{/* Social Links */}
				<div className="flex items-center gap-4 flex-wrap justify-center">
					{[
						{
							name: "GitHub",
							href: "#",
							icon: (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
							),
							color: "hover:text-white hover:border-white/30",
						},
						{
							name: "Portfolio",
							href: "#",
							icon: (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10" />
									<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
									<path d="M2 12h20" />
								</svg>
							),
							color: "hover:text-purple-400 hover:border-purple-500/30",
						},
						{
							name: "LinkedIn",
							href: "#",
							icon: (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							),
							color: "hover:text-blue-400 hover:border-blue-500/30",
						},
						{
							name: "Email",
							href: "mailto:your@email.com",
							icon: (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect width="20" height="16" x="2" y="4" rx="2" />
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
								</svg>
							),
							color: "hover:text-emerald-400 hover:border-emerald-500/30",
						},
					].map(({ name, href, icon, color }) => (
						<a
							key={name}
							href={href}
							target={href.startsWith("mailto") ? undefined : "_blank"}
							rel="noopener noreferrer"
							className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 text-sm font-medium transition-all duration-300 ${color}`}
						>
							{icon}
							{name}
						</a>
					))}
				</div>

				{/* Divider */}
				<div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

				{/* Bottom line */}
				<div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 text-xs text-neutral-600">
					<span>© 2026 Your Name · All Rights Reserved</span>
					<span className="flex items-center gap-1.5">
						Built with
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="text-neutral-500"
						>
							<path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
						</svg>
						Next.js &amp; Framer Motion
					</span>
				</div>
			</div>
		</motion.footer>
	);
}

// ─── Dashboard Content ─────────────────────────────────────────────
function DashboardContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");

	const updateParams = (updates: Record<string, string | number | null>) => {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(updates).forEach(([key, value]) => {
			if (value === null || (key === "page" && value === 1)) {
				params.delete(key);
			} else {
				params.set(key, value.toString());
			}
		});
		const queryString = params.toString();
		router.replace(queryString ? `?${queryString}` : "/", { scroll: false });
	};

	const handlePageChange = (page: number) => {
		updateParams({ page });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const featuredProjects = useMemo(() => {
		return (projectsData as any[]).filter((p: any) => p.featured === true);
	}, []);

	const filteredProjects = projectsData as any[];

	const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
	const paginatedProjects = filteredProjects.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	// Deterministic particles (avoids SSR hydration mismatch)
	const particles = useMemo(
		() =>
			[
				{ x: 8, y: 12, size: 3 },
				{ x: 22, y: 45, size: 2.5 },
				{ x: 37, y: 8, size: 4 },
				{ x: 51, y: 67, size: 2 },
				{ x: 64, y: 22, size: 3.5 },
				{ x: 79, y: 55, size: 2 },
				{ x: 91, y: 30, size: 4 },
				{ x: 14, y: 75, size: 2.5 },
				{ x: 43, y: 88, size: 3 },
				{ x: 70, y: 78, size: 2 },
				{ x: 85, y: 90, size: 3.5 },
				{ x: 5, y: 55, size: 2 },
				{ x: 30, y: 35, size: 4 },
				{ x: 55, y: 15, size: 2.5 },
				{ x: 75, y: 42, size: 3 },
				{ x: 95, y: 65, size: 2 },
				{ x: 18, y: 92, size: 4 },
				{ x: 60, y: 50, size: 2.5 },
			].map((p, i) => ({ ...p, delay: i * 0.3 })),
		[]
	);

	return (
		<div className="min-h-screen bg-[#030303] text-white selection:bg-purple-500/30 font-sans">
			{/* Animated Background */}
			<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
				<motion.div
					animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
					transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-800/20 blur-[140px]"
				/>
				<motion.div
					animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 3,
					}}
					className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-800/20 blur-[140px]"
				/>
				<motion.div
					animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.15, 0.08] }}
					transition={{
						duration: 18,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 6,
					}}
					className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[120px]"
				/>
				{particles.map((p, i) => (
					<FloatingParticle key={i} {...p} />
				))}
				{/* Grid pattern */}
				<div
					className="absolute inset-0 opacity-[0.015]"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			<main className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
				{/* Hero + Personal Info */}
				<HeroSection />

				{/* Stats */}
				<StatsBar total={projectsData.length} />

				{/* Featured Section */}
				{featuredProjects.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: 0.2 }}
							className="w-full mb-24"
						>
							<div className="flex items-center gap-3 mb-10">
								<div className="w-8 h-[1px] bg-purple-500/60" />
								<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
									Featured Works
								</span>
								<div className="flex-1 h-[1px] bg-white/5" />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{featuredProjects.map((project: any, i: number) => (
									<motion.div
										key={project.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: i * 0.1 }}
									>
										<Link
											href={`/r/${project.slug}`}
											className="group relative block"
										>
											<div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl transition-all duration-500 group-hover:border-purple-500/40 group-hover:shadow-purple-500/10 group-hover:scale-[1.02]">
												<div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-blue-600/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
												<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
												<div className="absolute inset-0 flex flex-col justify-end p-7 z-20">
													<h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors leading-tight">
														{project.title}
													</h3>
													<p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
														{project.description}
													</p>
												</div>
												{/* Shine effect */}
												<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-white/0 via-white/5 to-white/0" />
											</div>
										</Link>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}

				{/* All Projects Header */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="w-full flex items-center gap-3 mb-8"
				>
					<div className="w-8 h-[1px] bg-white/20" />
					<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
						All Projects
					</span>
					<div className="flex-1 h-[1px] bg-white/5" />
				</motion.div>

				{/* Controls Layout Removed */}

				{/* Grid */}
				<motion.div
					layout
					className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 min-h-[500px] items-start"
				>
					<AnimatePresence mode="popLayout">
						{paginatedProjects.map((project: any, idx: number) => (
							<motion.div
								layout
								initial={{ opacity: 0, scale: 0.92, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.88, y: 16 }}
								transition={{
									duration: 0.35,
									delay: (idx % ITEMS_PER_PAGE) * 0.04,
								}}
								key={project.id}
								className="h-full"
							>
								<Link href={`/r/${project.slug}`} className="block h-full">
									<div className="group relative h-full min-h-[220px] rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_30px_-8px_rgba(139,92,246,0.15)] flex flex-col">
										{/* Hover gradient */}
										<div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-blue-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

										<div className="p-6 flex flex-col flex-1 relative z-10">
											<div className="flex-1">
												<div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/25 transition-all duration-300">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<ellipse cx="12" cy="12" rx="10" ry="4" />
														<ellipse
															cx="12"
															cy="12"
															rx="10"
															ry="4"
															transform="rotate(60 12 12)"
														/>
														<ellipse
															cx="12"
															cy="12"
															rx="10"
															ry="4"
															transform="rotate(120 12 12)"
														/>
														<circle cx="12" cy="12" r="2" />
													</svg>
												</div>
												<h2 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors line-clamp-2 leading-tight mb-2.5">
													{project.title}
												</h2>
												<p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed group-hover:text-neutral-400 transition-colors">
													{project.description}
												</p>
											</div>

											<div className="mt-5 flex items-center justify-end">
												<div className="flex items-center text-xs text-neutral-600 group-hover:text-white transition-colors font-semibold">
													View
													<svg
														className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path d="M5 12h14" />
														<path d="m12 5 7 7-7 7" />
													</svg>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</AnimatePresence>

					{filteredProjects.length === 0 && (
						<div className="col-span-full py-24 text-center text-neutral-600 flex flex-col items-center">
							<svg
								className="w-14 h-14 text-neutral-800 mb-5"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p className="text-base">
								No projects found
							</p>
						</div>
					)}
				</motion.div>

				{/* Pagination */}
				{totalPages > 1 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-16 flex items-center justify-center space-x-2 w-full"
					>
						<button
							onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed transition-all flex items-center text-sm text-neutral-400 hover:text-white"
						>
							<svg
								className="w-4 h-4 mr-1.5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="m15 18-6-6 6-6" />
							</svg>
							Prev
						</button>
						<div className="flex space-x-1 px-3">
							{Array.from({ length: totalPages }).map((_, idx) => {
								const pageNum = idx + 1;
								if (
									pageNum === 1 ||
									pageNum === totalPages ||
									(pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
								) {
									return (
										<button
											key={pageNum}
											onClick={() => handlePageChange(pageNum)}
											className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
												currentPage === pageNum
													? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
													: "text-neutral-500 hover:text-white hover:bg-white/10"
											}`}
										>
											{pageNum}
										</button>
									);
								}
								if (
									pageNum === currentPage - 2 ||
									pageNum === currentPage + 2
								) {
									return (
										<span
											key={pageNum}
											className="w-9 h-9 flex items-center justify-center text-neutral-700"
										>
											·
										</span>
									);
								}
								return null;
							})}
						</div>
						<button
							onClick={() =>
								handlePageChange(Math.min(totalPages, currentPage + 1))
							}
							disabled={currentPage === totalPages}
							className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed transition-all flex items-center text-sm text-neutral-400 hover:text-white"
						>
							Next
							<svg
								className="w-4 h-4 ml-1.5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="m9 18 6-6-6-6" />
							</svg>
						</button>
					</motion.div>
				)}

				{/* Footer */}
				<Footer />
			</main>
		</div>
	);
}

export default function Home() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-[#030303] flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
						<span className="text-neutral-600 text-sm">Loading portfolio…</span>
					</div>
				</div>
			}
		>
			<DashboardContent />
		</Suspense>
	);
}
