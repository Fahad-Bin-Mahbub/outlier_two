"use client";

import type React from "react";

import { useState, useEffect, useRef, useMemo } from "react";

interface DiffLine {
	oldLineNumber: number | null;
	newLineNumber: number | null;
	type: "added" | "removed" | "modified" | "unchanged" | "conflict";
	oldContent: string;
	newContent: string;
	isCollapsed?: boolean;
	isConflict?: boolean;
}

interface DiffSection {
	id: string;
	startLine: number;
	endLine: number;
	isCollapsed: boolean;
	type: "unchanged" | "changed" | "conflict";
	lines: DiffLine[];
}

interface HistoryEntry {
	id: string;
	timestamp: string;
	action: string;
	details: string;
	oldCode: string;
	newCode: string;
}

const Button = ({
	children,
	onClick,
	disabled = false,
	variant = "primary",
	size = "md",
	className = "",
}: {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	className?: string;
}) => {
	const baseClasses =
		"inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

	const variants = {
		primary:
			"bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
		secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
		outline:
			"border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-900/20 focus:ring-purple-500",
		ghost:
			"text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 focus:ring-slate-500",
	};

	const sizes = {
		sm: "px-3 py-1.5 text-sm rounded-md",
		md: "px-4 py-2 text-sm rounded-lg",
		lg: "px-6 py-3 text-base rounded-lg",
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
		>
			{children}
		</button>
	);
};

const Badge = ({
	children,
	variant = "default",
	className = "",
}: {
	children: React.ReactNode;
	variant?: "default" | "success" | "error" | "warning" | "info";
	className?: string;
}) => {
	const variants = {
		default:
			"bg-slate-100 text-slate-800 border border-slate-300 dark:bg-gray-800 dark:text-gray-200 dark:border-slate-600",
		success:
			"bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-600",
		error:
			"bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-600",
		warning:
			"bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-600",
		info: "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-600",
	};

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${variants[variant]} ${className}`}
		>
			{children}
		</span>
	);
};

const ChevronDown = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 9l-7 7-7-7"
		/>
	</svg>
);

const ChevronRight = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 5l7 7-7 7"
		/>
	</svg>
);

const Download = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
);

const ArrowUp = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M7 11l5-5m0 0l5 5m-5-5v12"
		/>
	</svg>
);

const ArrowDown = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M17 13l-5 5m0 0l-5-5m5 5V6"
		/>
	</svg>
);

const AlertTriangle = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
		/>
	</svg>
);

const Edit3 = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
		/>
	</svg>
);

const Save = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
		/>
	</svg>
);

const X = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M6 18L18 6M6 6l12 12"
		/>
	</svg>
);

const Moon = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
		/>
	</svg>
);

const Sun = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
		/>
	</svg>
);

const Code2 = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
		/>
	</svg>
);

const FileText = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
);

const Zap = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M13 10V3L4 14h7v7l9-11h-7z"
		/>
	</svg>
);

const History = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

const Clock = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

const Loader2 = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={`${className} animate-spin`}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
		/>
	</svg>
);

const CheckCircle = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

const Menu = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M4 6h16M4 12h16M4 18h16"
		/>
	</svg>
);

const AnimatedLogo = ({ className = "w-7 h-7" }: { className?: string }) => (
	<div className={`relative logo-container ${className}`}>
		<svg className="w-full h-full" viewBox="0 0 40 40" fill="none">
			{/* Main Container Circle - Subtle Background */}
			<circle
				cx="20"
				cy="20"
				r="18"
				fill="currentColor"
				opacity="0.05"
				className="transition-all duration-700"
			/>

			{/* Split Screen Concept - Two Panels */}
			<g className="split-panels">
				{/* Left Panel */}
				<rect
					x="6"
					y="8"
					width="12"
					height="24"
					fill="currentColor"
					opacity="0.1"
					rx="2"
					className="panel-left"
				/>

				{/* Right Panel */}
				<rect
					x="22"
					y="8"
					width="12"
					height="24"
					fill="currentColor"
					opacity="0.1"
					rx="2"
					className="panel-right"
				/>

				{/* Divider Line */}
				<line
					x1="20"
					y1="10"
					x2="20"
					y2="30"
					stroke="currentColor"
					strokeWidth="1.5"
					opacity="0.3"
					className="divider"
				/>
			</g>

			{/* Code Lines - Subtle representation */}
			<g className="code-lines">
				{/* Old code lines (left side) */}
				<rect
					x="8"
					y="12"
					width="8"
					height="1.5"
					fill="currentColor"
					opacity="0.4"
					rx="0.5"
					className="line-old-1"
				/>
				<rect
					x="8"
					y="16"
					width="6"
					height="1.5"
					fill="currentColor"
					opacity="0.4"
					rx="0.5"
					className="line-old-2"
				/>
				<rect
					x="8"
					y="20"
					width="9"
					height="1.5"
					fill="currentColor"
					opacity="0.4"
					rx="0.5"
					className="line-old-3"
				/>
				<rect
					x="8"
					y="24"
					width="7"
					height="1.5"
					fill="currentColor"
					opacity="0.4"
					rx="0.5"
					className="line-old-4"
				/>

				{/* New code lines (right side) */}
				<rect
					x="24"
					y="12"
					width="8"
					height="1.5"
					fill="currentColor"
					opacity="0.6"
					rx="0.5"
					className="line-new-1"
				/>
				<rect
					x="24"
					y="16"
					width="9"
					height="1.5"
					fill="currentColor"
					opacity="0.6"
					rx="0.5"
					className="line-new-2"
				/>
				<rect
					x="24"
					y="20"
					width="6"
					height="1.5"
					fill="currentColor"
					opacity="0.6"
					rx="0.5"
					className="line-new-3"
				/>
				<rect
					x="24"
					y="24"
					width="8"
					height="1.5"
					fill="currentColor"
					opacity="0.6"
					rx="0.5"
					className="line-new-4"
				/>
			</g>

			{/* Stylized Logo Text - Central "D" */}
			<g className="logo-text" opacity="0.8">
				<text
					x="20"
					y="26"
					textAnchor="middle"
					className="font-display font-bold select-none"
					style={{
						fontSize: "16px",
						fontFamily: "Aileron, sans-serif",
						fill: "currentColor",
						fontWeight: "600",
					}}
				>
					D
				</text>
			</g>

			{/* Comparison Arrow - Subtle indicator */}
			<g className="comparison-arrow" opacity="0.3">
				<path
					d="M17 12h6m-3-2l3 2-3 2"
					stroke="currentColor"
					strokeWidth="1"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="arrow"
				/>
			</g>

			{/* Diff Indicators - Very subtle */}
			<circle
				cx="32"
				cy="12"
				r="1.5"
				fill="#22c55e"
				opacity="0.7"
				className="indicator-add"
			/>
			<circle
				cx="32"
				cy="20"
				r="1.5"
				fill="#f59e0b"
				opacity="0.7"
				className="indicator-modify"
			/>
			<circle
				cx="32"
				cy="28"
				r="1.5"
				fill="#ef4444"
				opacity="0.7"
				className="indicator-remove"
			/>
		</svg>

		<style jsx>{`
			.logo-container {
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			}

			.logo-container:hover {
				transform: scale(1.05);
			}

			.split-panels .panel-left {
				animation: subtlePulse 4s ease-in-out infinite;
				animation-delay: 0s;
			}

			.split-panels .panel-right {
				animation: subtlePulse 4s ease-in-out infinite;
				animation-delay: 0.5s;
			}

			.code-lines .line-old-1,
			.code-lines .line-old-2,
			.code-lines .line-old-3,
			.code-lines .line-old-4 {
				animation: lineGlow 3s ease-in-out infinite;
				animation-delay: 0s;
			}

			.code-lines .line-new-1,
			.code-lines .line-new-2,
			.code-lines .line-new-3,
			.code-lines .line-new-4 {
				animation: lineGlow 3s ease-in-out infinite;
				animation-delay: 1s;
			}

			.comparison-arrow .arrow {
				animation: arrowFlow 2s ease-in-out infinite;
			}

			.logo-text {
				animation: textGlow 3s ease-in-out infinite;
			}

			.indicator-add {
				animation: indicatorPulse 2s ease-in-out infinite;
				animation-delay: 0.2s;
			}

			.indicator-modify {
				animation: indicatorPulse 2s ease-in-out infinite;
				animation-delay: 0.6s;
			}

			.indicator-remove {
				animation: indicatorPulse 2s ease-in-out infinite;
				animation-delay: 1s;
			}

			@keyframes subtlePulse {
				0%,
				100% {
					opacity: 0.1;
				}
				50% {
					opacity: 0.15;
				}
			}

			@keyframes lineGlow {
				0%,
				100% {
					opacity: 0.4;
				}
				50% {
					opacity: 0.7;
				}
			}

			@keyframes arrowFlow {
				0%,
				100% {
					opacity: 0.3;
					transform: translateX(0px);
				}
				50% {
					opacity: 0.8;
					transform: translateX(1px);
				}
			}

			@keyframes indicatorPulse {
				0%,
				100% {
					opacity: 0.4;
					transform: scale(1);
				}
				50% {
					opacity: 0.9;
					transform: scale(1.1);
				}
			}

			@keyframes textGlow {
				0%,
				100% {
					opacity: 0.7;
				}
				50% {
					opacity: 1;
				}
			}

			/* Live Background Animation Keyframes */
			@keyframes float1 {
				0%,
				100% {
					transform: translateX(0px) translateY(0px) rotate(0deg);
				}
				25% {
					transform: translateX(30px) translateY(-20px) rotate(5deg);
				}
				50% {
					transform: translateX(-15px) translateY(-40px) rotate(-3deg);
				}
				75% {
					transform: translateX(-25px) translateY(-10px) rotate(8deg);
				}
			}

			@keyframes float2 {
				0%,
				100% {
					transform: translateX(0px) translateY(0px) rotate(0deg);
				}
				25% {
					transform: translateX(-40px) translateY(25px) rotate(-7deg);
				}
				50% {
					transform: translateX(20px) translateY(50px) rotate(4deg);
				}
				75% {
					transform: translateX(35px) translateY(15px) rotate(-5deg);
				}
			}

			@keyframes float3 {
				0%,
				100% {
					transform: translateX(0px) translateY(0px) rotate(0deg);
				}
				25% {
					transform: translateX(25px) translateY(30px) rotate(6deg);
				}
				50% {
					transform: translateX(-30px) translateY(-20px) rotate(-8deg);
				}
				75% {
					transform: translateX(10px) translateY(40px) rotate(3deg);
				}
			}

			@keyframes float4 {
				0%,
				100% {
					transform: translateX(0px) translateY(0px) rotate(0deg);
				}
				25% {
					transform: translateX(-20px) translateY(-35px) rotate(-4deg);
				}
				50% {
					transform: translateX(40px) translateY(10px) rotate(7deg);
				}
				75% {
					transform: translateX(-15px) translateY(25px) rotate(-6deg);
				}
			}

			@keyframes float5 {
				0%,
				100% {
					transform: translateX(0px) translateY(0px) rotate(0deg);
				}
				25% {
					transform: translateX(35px) translateY(20px) rotate(3deg);
				}
				50% {
					transform: translateX(-25px) translateY(45px) rotate(-5deg);
				}
				75% {
					transform: translateX(15px) translateY(-30px) rotate(8deg);
				}
			}

			@keyframes float6 {
				0%,
				100% {
					transform: translateX(0px) translateY(0px) rotate(0deg);
				}
				25% {
					transform: translateX(20px) translateY(-25px) rotate(4deg);
				}
				50% {
					transform: translateX(-35px) translateY(15px) rotate(-6deg);
				}
				75% {
					transform: translateX(25px) translateY(35px) rotate(5deg);
				}
			}

			@keyframes float7 {
				0%,
				100% {
					transform: translateX(0px) translateY(0px) rotate(0deg);
				}
				25% {
					transform: translateX(-30px) translateY(20px) rotate(-5deg);
				}
				50% {
					transform: translateX(15px) translateY(-35px) rotate(7deg);
				}
				75% {
					transform: translateX(40px) translateY(10px) rotate(-3deg);
				}
			}

			@keyframes gradientShift {
				0%,
				100% {
					background-position: 0% 50%;
					transform: scale(1) rotate(0deg);
				}
				25% {
					background-position: 25% 75%;
					transform: scale(1.05) rotate(1deg);
				}
				50% {
					background-position: 100% 50%;
					transform: scale(0.98) rotate(-1deg);
				}
				75% {
					background-position: 75% 25%;
					transform: scale(1.02) rotate(0.5deg);
				}
			}

			@keyframes shrink {
				0% {
					width: 100%;
				}
				100% {
					width: 0%;
				}
			}
		`}</style>
	</div>
);

const highlightSyntax = (code: string): string => {
	return code
		.replace(
			/\b(import|export|const|let|var|function|class|interface|type|enum|return|if|else|for|while|try|catch|finally|async|await|public|private|protected|static)\b/g,
			`<span class="syntax-keyword">$1</span>`
		)
		.replace(
			/\b(React|useState|useEffect|useCallback|useMemo|string|number|boolean|void|null|undefined|any|object)\b/g,
			`<span class="syntax-type">$1</span>`
		)
		.replace(/'([^']*)'/g, `<span class="syntax-string">'$1'</span>`)
		.replace(/"([^"]*)"/g, `<span class="syntax-string">"$1"</span>`)
		.replace(/`([^`]*)`/g, `<span class="syntax-string">\`$1\`</span>`)
		.replace(/\/\/.*$/gm, `<span class="syntax-comment">$&</span>`)
		.replace(/\/\*[\s\S]*?\*\//g, `<span class="syntax-comment">$&</span>`)
		.replace(/\b(\d+)\b/g, `<span class="syntax-number">$1</span>`);
};

const calculateDiff = (oldContent: string, newContent: string): DiffLine[] => {
	const oldLines = oldContent.split("\n");
	const newLines = newContent.split("\n");
	const diff: DiffLine[] = [];

	let oldIndex = 0;
	let newIndex = 0;

	while (oldIndex < oldLines.length || newIndex < newLines.length) {
		const oldLine = oldLines[oldIndex] || "";
		const newLine = newLines[newIndex] || "";

		if (oldIndex >= oldLines.length) {
			diff.push({
				oldLineNumber: null,
				newLineNumber: newIndex + 1,
				type: "added",
				oldContent: "",
				newContent: newLine,
			});
			newIndex++;
		} else if (newIndex >= newLines.length) {
			diff.push({
				oldLineNumber: oldIndex + 1,
				newLineNumber: null,
				type: "removed",
				oldContent: oldLine,
				newContent: "",
			});
			oldIndex++;
		} else if (oldLine === newLine) {
			diff.push({
				oldLineNumber: oldIndex + 1,
				newLineNumber: newIndex + 1,
				type: "unchanged",
				oldContent: oldLine,
				newContent: newLine,
			});
			oldIndex++;
			newIndex++;
		} else {
			const similarity = calculateSimilarity(oldLine, newLine);
			if (similarity > 0.3) {
				diff.push({
					oldLineNumber: oldIndex + 1,
					newLineNumber: newIndex + 1,
					type: "modified",
					oldContent: oldLine,
					newContent: newLine,
					isConflict: similarity < 0.7,
				});
				oldIndex++;
				newIndex++;
			} else {
				diff.push({
					oldLineNumber: oldIndex + 1,
					newLineNumber: null,
					type: "removed",
					oldContent: oldLine,
					newContent: "",
				});
				diff.push({
					oldLineNumber: null,
					newLineNumber: newIndex + 1,
					type: "added",
					oldContent: "",
					newContent: newLine,
				});
				oldIndex++;
				newIndex++;
			}
		}
	}

	return diff;
};

const calculateSimilarity = (str1: string, str2: string): number => {
	const longer = str1.length > str2.length ? str1 : str2;
	const shorter = str1.length > str2.length ? str2 : str1;

	if (longer.length === 0) return 1.0;

	const editDistance = levenshteinDistance(longer, shorter);
	return (longer.length - editDistance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
	const matrix = [];

	for (let i = 0; i <= str2.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= str1.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= str2.length; i++) {
		for (let j = 1; j <= str1.length; j++) {
			if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					matrix[i][j - 1] + 1,
					matrix[i - 1][j] + 1
				);
			}
		}
	}

	return matrix[str2.length][str1.length];
};

const groupIntoSections = (diffLines: DiffLine[]): DiffSection[] => {
	const sections: DiffSection[] = [];
	let currentSection: DiffLine[] = [];
	let currentType: "unchanged" | "changed" | "conflict" = "unchanged";
	let sectionStart = 0;

	diffLines.forEach((line, index) => {
		const lineType =
			line.type === "unchanged"
				? "unchanged"
				: line.isConflict
				? "conflict"
				: "changed";

		if (lineType !== currentType || currentSection.length > 20) {
			if (currentSection.length > 0) {
				sections.push({
					id: `section-${sections.length}`,
					startLine: sectionStart,
					endLine: sectionStart + currentSection.length - 1,
					isCollapsed: currentType === "unchanged" && currentSection.length > 5,
					type: currentType,
					lines: currentSection,
				});
			}
			currentSection = [line];
			currentType = lineType;
			sectionStart = index;
		} else {
			currentSection.push(line);
		}
	});

	if (currentSection.length > 0) {
		sections.push({
			id: `section-${sections.length}`,
			startLine: sectionStart,
			endLine: sectionStart + currentSection.length - 1,
			isCollapsed: currentType === "unchanged" && currentSection.length > 5,
			type: currentType,
			lines: currentSection,
		});
	}

	return sections;
};

export default function CodeDiffExport() {
	const [isDark, setIsDark] = useState(false);
	const [oldCode, setOldCode] = useState("");
	const [newCode, setNewCode] = useState("");
	const [sections, setSections] = useState<DiffSection[]>([]);
	const [currentChangeIndex, setCurrentChangeIndex] = useState<number>(0);
	const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
	const [editingLine, setEditingLine] = useState<number | null>(null);
	const [editContent, setEditContent] = useState<string>("");
	const [showInputs, setShowInputs] = useState(true);
	const [showHistory, setShowHistory] = useState(false);
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [showDiffContent, setShowDiffContent] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState<
		"success" | "error" | "info" | "warning"
	>("success");
	const [isLoading, setIsLoading] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
	const [lastSavedContent, setLastSavedContent] = useState<string>("");
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showFooter, setShowFooter] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const changeRefs = useRef<(HTMLDivElement | null)[]>([]);

	const sampleOldCode = `import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick
}) => {
  return (
    <button
      className={cn(
        'rounded-md font-medium',
        variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800',
        size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`;

	const sampleNewCode = `import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick
}) => {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-colors',
        variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 
        variant === 'destructive' ? 'bg-red-500 hover:bg-red-600 text-white' :
        'bg-gray-200 hover:bg-gray-300 text-gray-800',
        size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2',
        (disabled || loading) && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};`;

	useEffect(() => {
		if (!oldCode && !newCode) {
			setOldCode(sampleOldCode);
			setNewCode(sampleNewCode);
			setLastSavedContent("");
			setHasUnsavedChanges(true);
		}
	}, []);

	useEffect(() => {
		const progressSteps = [
			{ progress: 30, delay: 200 },
			{ progress: 60, delay: 500 },
			{ progress: 100, delay: 800 },
		];

		progressSteps.forEach(({ progress, delay }) => {
			setTimeout(() => {
				setLoadingProgress(progress);
			}, delay);
		});

		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1200);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (oldCode && newCode) {
			const diffLines = calculateDiff(oldCode, newCode);
			const diffSections = groupIntoSections(diffLines);
			setSections(diffSections);
			setCurrentChangeIndex(0);

			if (lastSavedContent === "") {
				setLastSavedContent(newCode);
			}
		}
	}, [oldCode, newCode, lastSavedContent]);

	useEffect(() => {
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		document.body.style.overflow = "auto";
		document.body.style.overflowX = "hidden";
		document.body.style.height = "auto";
		document.body.style.margin = "0";
		document.body.style.padding = "0";
		document.body.style.backgroundColor = isDark ? "#0f172a" : "#f8fafc";
		document.body.style.overscrollBehavior = "none";

		document.documentElement.style.overflow = "auto";
		document.documentElement.style.overflowX = "hidden";
		document.documentElement.style.height = "auto";
		document.documentElement.style.margin = "0";
		document.documentElement.style.padding = "0";
		document.documentElement.style.backgroundColor = isDark
			? "#0f172a"
			: "#f8fafc";
		document.documentElement.style.overscrollBehavior = "none";

		return () => {
			document.body.style.overflow = "";
			document.body.style.overflowX = "";
			document.body.style.height = "";
			document.body.style.margin = "";
			document.body.style.padding = "";
			document.body.style.backgroundColor = "";
			document.body.style.overscrollBehavior = "";
			document.documentElement.style.overflow = "";
			document.documentElement.style.overflowX = "";
			document.documentElement.style.height = "";
			document.documentElement.style.margin = "";
			document.documentElement.style.padding = "";
			document.documentElement.style.backgroundColor = "";
			document.documentElement.style.overscrollBehavior = "";
		};
	}, [isDark]);

	const addToHistory = (action: string, details: string) => {
		const newEntry: HistoryEntry = {
			id: Date.now().toString(),
			timestamp: new Date().toLocaleString(),
			action,
			details,
			oldCode,
			newCode,
		};
		setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
	};

	const showToastNotification = (
		type: "success" | "error" | "info" | "warning",
		message: string
	) => {
		setToastType(type);
		setToastMessage(message);
		setShowToast(true);
		setTimeout(() => {
			setShowToast(false);
		}, 3000);
	};

	const changes = useMemo(() => {
		const changeLines: number[] = [];
		sections.forEach((section, sectionIndex) => {
			if (section.type !== "unchanged") {
				section.lines.forEach((line, lineIndex) => {
					if (line.type !== "unchanged") {
						changeLines.push(sectionIndex * 1000 + lineIndex);
					}
				});
			}
		});
		return changeLines;
	}, [sections]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key) {
					case "ArrowDown":
						e.preventDefault();
						navigateToChange("next");
						break;
					case "ArrowUp":
						e.preventDefault();
						navigateToChange("prev");
						break;
					case "s":
						e.preventDefault();
						if (editingLine !== null) {
							handleSave();
						} else {
							const currentCode = newCode || "";
							const savedCode = lastSavedContent || "";

							if (
								currentCode.trim() !== savedCode.trim() ||
								hasUnsavedChanges
							) {
								const saveTime = new Date().toLocaleString();
								addToHistory("Save", `File saved at ${saveTime}`);
								setLastSavedTime(saveTime);
								setLastSavedContent(currentCode);
								setHasUnsavedChanges(false);
								showToastNotification("success", "File saved successfully!");
							} else {
								showToastNotification("info", "No changes to save");
							}
						}
						break;
					case "e":
						e.preventDefault();
						exportDiff();
						break;
					case "h":
						e.preventDefault();
						setShowHistory(!showHistory);
						break;
				}
			}

			if (e.key === "Escape") {
				if (editingLine !== null) {
					setEditingLine(null);
					setEditContent("");
				} else if (showHistory) {
					setShowHistory(false);
				} else if (showMobileMenu) {
					setShowMobileMenu(false);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		currentChangeIndex,
		changes.length,
		editingLine,
		showHistory,
		showMobileMenu,
		sections.length,
		newCode,
		lastSavedContent,
		hasUnsavedChanges,
	]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (showMobileMenu) {
				const target = e.target as HTMLElement;
				const mobileMenuContainer = document.querySelector(
					".mobile-menu-container"
				);
				if (mobileMenuContainer && !mobileMenuContainer.contains(target)) {
					setShowMobileMenu(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showMobileMenu]);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop =
				window.pageYOffset || document.documentElement.scrollTop;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			const isNearBottom = scrollTop + windowHeight >= documentHeight - 100;
			setShowFooter(isNearBottom);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navigateToChange = (direction: "next" | "prev") => {
		if (changes.length === 0) return;

		let newIndex = currentChangeIndex;
		if (direction === "next") {
			newIndex = (currentChangeIndex + 1) % changes.length;
		} else {
			newIndex =
				currentChangeIndex === 0 ? changes.length - 1 : currentChangeIndex - 1;
		}

		setCurrentChangeIndex(newIndex);

		const changeId = changes[newIndex];
		const element = changeRefs.current[changeId];
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	const toggleSection = (sectionId: string) => {
		setSections((prev) =>
			prev.map((section) =>
				section.id === sectionId
					? { ...section, isCollapsed: !section.isCollapsed }
					: section
			)
		);
	};

	const exportDiff = () => {
		const diffText = sections
			.map((section) => {
				let sectionText = `\n--- ${section.type.toUpperCase()} SECTION (Lines ${
					section.startLine + 1
				}-${section.endLine + 1}) ---\n`;

				section.lines.forEach((line) => {
					const prefix =
						line.type === "added"
							? "+"
							: line.type === "removed"
							? "-"
							: line.type === "modified"
							? "~"
							: " ";

					if (line.oldContent && line.type !== "added") {
						sectionText += `${prefix} ${line.oldLineNumber || ""}: ${
							line.oldContent
						}\n`;
					}
					if (line.newContent && line.type !== "removed") {
						sectionText += `${prefix} ${line.newLineNumber || ""}: ${
							line.newContent
						}\n`;
					}
				});

				return sectionText;
			})
			.join("\n");

		const blob = new Blob([diffText], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `code-diff-${new Date().toISOString().slice(0, 10)}.txt`;
		a.click();
		URL.revokeObjectURL(url);

		addToHistory("Export", "Diff exported to file");
		showToastNotification("success", "Downloaded successfully!");
	};

	const startEditing = (
		lineIndex: number,
		sectionIndex: number,
		content: string
	) => {
		const globalLineIndex = sectionIndex * 1000 + lineIndex;
		setEditingLine(globalLineIndex);
		setEditContent(content);
		setHasUnsavedChanges(true);
	};

	const handleSave = () => {
		if (editingLine === null) return;

		const sectionIndex = Math.floor(editingLine / 1000);
		const lineIndex = editingLine % 1000;

		const currentContent = sections[sectionIndex].lines[lineIndex].newContent;
		if (editContent === currentContent) {
			showToastNotification("info", "No changes made");
			setEditingLine(null);
			setEditContent("");
			return;
		}

		setSections((prev) =>
			prev.map((section, sIdx) => {
				if (sIdx === sectionIndex) {
					return {
						...section,
						lines: section.lines.map((line, lIdx) => {
							if (lIdx === lineIndex) {
								return { ...line, newContent: editContent };
							}
							return line;
						}),
					};
				}
				return section;
			})
		);

		const newLines = newCode.split("\n");
		const actualLineNumber =
			sections[sectionIndex].lines[lineIndex].newLineNumber;
		if (actualLineNumber) {
			newLines[actualLineNumber - 1] = editContent;
			const updatedNewCode = newLines.join("\n");
			setNewCode(updatedNewCode);
			setLastSavedContent(updatedNewCode);
		}

		addToHistory("Edit", `Modified line ${actualLineNumber}`);
		const saveTime = new Date().toLocaleString();
		addToHistory("Save", `File saved at ${saveTime}`);
		setLastSavedTime(saveTime);
		setHasUnsavedChanges(false);
		showToastNotification("success", "File saved successfully!");
		setEditingLine(null);
		setEditContent("");
	};

	const cancelEdit = () => {
		setEditingLine(null);
		setEditContent("");
	};

	const getLineClassName = (line: DiffLine, isOld = false) => {
		const base =
			"font-mono text-sm leading-relaxed px-2 sm:px-4 py-1 border-l-4 transition-all duration-200 border";

		if (line.isConflict) {
			return `${base} ${
				isDark
					? "bg-red-950/50 border-l-red-400 border-red-500/30 text-red-100"
					: "bg-red-100/80 border-l-red-600 border-red-200 text-red-900"
			}`;
		}

		switch (line.type) {
			case "added":
				return `${base} ${
					isDark
						? "bg-green-950/50 border-l-green-400 border-green-500/30 text-green-100"
						: "bg-green-100/80 border-l-green-600 border-green-200 text-green-900"
				}`;
			case "removed":
				return `${base} ${
					isDark
						? "bg-red-950/50 border-l-red-400 border-red-500/30 text-red-100"
						: "bg-red-100/80 border-l-red-600 border-red-200 text-red-900"
				}`;
			case "modified":
				return `${base} ${
					isOld
						? isDark
							? "bg-yellow-950/50 border-l-yellow-400 border-yellow-500/30 text-yellow-100"
							: "bg-yellow-100/80 border-l-yellow-600 border-yellow-200 text-yellow-900"
						: isDark
						? "bg-purple-950/50 border-l-purple-400 border-purple-500/30 text-purple-100"
						: "bg-purple-100/80 border-l-purple-600 border-purple-200 text-purple-900"
				}`;
			default:
				return `${base} ${
					isDark
						? "bg-gray-900/50 border-l-gray-600 border-gray-600/30 text-gray-100"
						: "bg-slate-50/90 border-l-slate-400 border-slate-200 text-slate-800"
				}`;
		}
	};

	const generateDiff = async () => {
		if (!oldCode.trim() || !newCode.trim()) {
			alert("Please enter both old and new code versions");
			return;
		}

		setIsGenerating(true);

		await new Promise((resolve) => setTimeout(resolve, 1500));

		setShowInputs(false);

		setTimeout(() => {
			setShowDiffContent(true);
			setIsGenerating(false);
		}, 300);

		addToHistory("Generate", "New diff comparison created");
		setHasUnsavedChanges(true);
	};

	const resetDiff = () => {
		setShowDiffContent(false);
		setTimeout(() => {
			setShowInputs(true);
			setSections([]);
			setEditingLine(null);
			setCurrentChangeIndex(0);
			setIsGenerating(false);
			setLastSavedContent("");
			setHasUnsavedChanges(false);
		}, 300);
	};

	const loadFromHistory = (entry: HistoryEntry) => {
		setOldCode(entry.oldCode);
		setNewCode(entry.newCode);
		setShowHistory(false);
		setShowInputs(false);
		setLastSavedContent("");
		addToHistory("Load", `Loaded from history: ${entry.timestamp}`);
		setHasUnsavedChanges(true);
	};

	return (
		<>
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				<div className="absolute inset-0">
					<div
						className={`absolute w-64 h-64 rounded-full ${
							isDark
								? "bg-gradient-to-br from-purple-500/30 to-blue-500/30"
								: "bg-gradient-to-br from-purple-400/25 to-blue-400/25"
						}`}
						style={{
							top: "10%",
							left: "5%",
							animation: "float1 20s ease-in-out infinite",
							filter: "blur(1px)",
						}}
					/>

					<div
						className={`absolute w-48 h-48 rounded-full ${
							isDark
								? "bg-gradient-to-br from-blue-500/35 to-indigo-500/35"
								: "bg-gradient-to-br from-blue-300/30 to-indigo-300/30"
						}`}
						style={{
							top: "60%",
							right: "10%",
							animation: "float2 25s ease-in-out infinite",
							filter: "blur(0.5px)",
						}}
					/>

					<div
						className={`absolute w-32 h-32 rounded-full ${
							isDark
								? "bg-gradient-to-br from-indigo-500/40 to-purple-500/40"
								: "bg-gradient-to-br from-indigo-300/35 to-purple-300/35"
						}`}
						style={{
							top: "30%",
							right: "25%",
							animation: "float3 15s ease-in-out infinite",
							filter: "blur(0.8px)",
						}}
					/>

					<div
						className={`absolute w-40 h-40 rounded-full ${
							isDark
								? "bg-gradient-to-br from-purple-600/25 to-pink-500/25"
								: "bg-gradient-to-br from-purple-300/30 to-pink-300/30"
						}`}
						style={{
							bottom: "20%",
							left: "15%",
							animation: "float4 22s ease-in-out infinite",
							filter: "blur(1.5px)",
						}}
					/>

					<div
						className={`absolute w-56 h-56 rounded-full ${
							isDark
								? "bg-gradient-to-br from-blue-600/20 to-cyan-500/20"
								: "bg-gradient-to-br from-blue-300/25 to-cyan-300/25"
						}`}
						style={{
							top: "5%",
							right: "5%",
							animation: "float5 30s ease-in-out infinite",
							filter: "blur(2px)",
						}}
					/>

					{/* Additional smaller floating elements */}
					<div
						className={`absolute w-20 h-20 rounded-full ${
							isDark
								? "bg-gradient-to-br from-cyan-500/45 to-blue-500/45"
								: "bg-gradient-to-br from-cyan-300/40 to-blue-300/40"
						}`}
						style={{
							top: "45%",
							left: "8%",
							animation: "float6 18s ease-in-out infinite",
							filter: "blur(0.3px)",
						}}
					/>

					<div
						className={`absolute w-28 h-28 rounded-full ${
							isDark
								? "bg-gradient-to-br from-pink-500/35 to-purple-500/35"
								: "bg-gradient-to-br from-pink-300/35 to-purple-300/35"
						}`}
						style={{
							bottom: "35%",
							right: "30%",
							animation: "float7 16s ease-in-out infinite",
							filter: "blur(1.2px)",
						}}
					/>

					{/* Test element - more visible for debugging */}
					<div
						className={`absolute w-96 h-96 rounded-full ${
							isDark
								? "bg-gradient-to-br from-purple-400/50 to-blue-400/50"
								: "bg-gradient-to-br from-purple-500/40 to-blue-500/40"
						}`}
						style={{
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							animation: "float1 15s ease-in-out infinite",
							filter: "blur(2px)",
						}}
					/>

					{/* Subtle mesh gradient overlay */}
					<div
						className={`absolute inset-0 ${
							isDark
								? "bg-gradient-to-br from-purple-900/15 via-blue-900/10 to-indigo-900/15"
								: "bg-gradient-to-br from-purple-200/20 via-blue-200/15 to-indigo-200/20"
						}`}
						style={{
							animation: "gradientShift 40s ease-in-out infinite",
						}}
					/>
				</div>
			</div>

			{/* Premium Font Imports and Custom Styles */}
			<style jsx global>{`
				/* Import sophisticated font combination from Google Fonts */
				@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap");
				@import url("https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
				@import url("https://fonts.googleapis.com/css2?family=Aileron:wght@100;200;300;400;500;600;700;800;900&display=swap");

				/* Global font and body setup with premium typography */
				* {
					font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI",
						system-ui, sans-serif;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					font-feature-settings: "ss01" 1, "ss02" 1, "cv01" 1, "cv02" 1;
					text-rendering: optimizeLegibility;
					font-variant-ligatures: common-ligatures;
					letter-spacing: -0.005em;
				}

				/* Enhanced typography hierarchy */
				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					font-family: "Outfit", sans-serif;
					font-weight: 700;
					letter-spacing: -0.02em;
					line-height: 1.2;
				}

				/* Button and UI element text enhancement */
				button,
				.btn {
					font-family: "Outfit", sans-serif;
					font-weight: 500;
					letter-spacing: -0.01em;
				}

				/* Input and form text styling */
				input,
				textarea,
				select {
					font-family: "Outfit", sans-serif;
					letter-spacing: -0.005em;
				}

				/* Premium heading typography with Aileron */
				.font-display,
				.logo-text,
				.brand-text,
				.heading-elegant {
					font-family: "Aileron", -apple-system, BlinkMacSystemFont, "Segoe UI",
						system-ui, sans-serif !important;
					font-feature-settings: "ss01" 1, "liga" 1;
					letter-spacing: -0.01em;
					line-height: 1.2;
					font-weight: 600;
				}

				/* Enhanced monospace font for code areas */
				.font-mono,
				code,
				pre,
				kbd,
				textarea[class*="font-mono"] {
					font-family: "Source Code Pro", "Fira Code", "SF Mono", "Monaco",
						"Inconsolata", "Roboto Mono", monospace !important;
					font-feature-settings: "liga" 1, "calt" 1, "ss01" 1, "ss02" 1,
						"ss03" 1, "ss04" 1;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					text-rendering: optimizeSpeed;
					font-variant-ligatures: contextual;
				}

				/* Prevent over-scroll and ensure proper body background */
				html,
				body {
					margin: 0;
					padding: 0;
					overscroll-behavior: none;
					-webkit-overflow-scrolling: touch;
					background-color: ${isDark ? "#0f172a" : "#f8fafc"};
					min-height: 100vh;
					font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, "Helvetica Neue", Arial, sans-serif;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					text-rendering: optimizeLegibility;
				}

				/* Prevent bounce scrolling on iOS Safari */
				body {
					position: relative;
					overflow-x: hidden;
				}

				/* Prevent rubber band scrolling */
				html {
					overflow: auto;
					height: 100%;
				}

				/* Main Scrollbars - 12px width */
				::-webkit-scrollbar {
					width: 12px;
					height: 12px;
				}

				::-webkit-scrollbar-track {
					background: ${isDark ? "#0f172a" : "#f8fafc"};
					border-radius: 6px;
					border: 1px solid ${isDark ? "#1e293b" : "#e2e8f0"};
				}

				::-webkit-scrollbar-thumb {
					background: ${isDark ? "#6366f1" : "#8b5cf6"};
					border-radius: 6px;
					border: 2px solid ${isDark ? "#0f172a" : "#f8fafc"};
					transition: all 0.2s ease;
				}

				::-webkit-scrollbar-thumb:hover {
					background: ${isDark ? "#7c3aed" : "#7c3aed"};
				}

				::-webkit-scrollbar-thumb:active {
					background: ${isDark ? "#5b21b6" : "#6d28d9"};
				}

				::-webkit-scrollbar-corner {
					background: ${isDark ? "#0f172a" : "#f8fafc"};
				}

				/* Firefox scrollbars */
				html {
					scrollbar-width: thin;
					scrollbar-color: ${isDark ? "#6366f1 #0f172a" : "#8b5cf6 #f8fafc"};
				}

				/* Custom scrollable areas - 8px width */
				.custom-scrollbar {
					scrollbar-width: thin;
					scrollbar-color: ${isDark ? "#6366f1 #1e293b" : "#8b5cf6 #e2e8f0"};
				}

				/* Toast progress bar animation */
				@keyframes shrink {
					from {
						width: 100%;
					}
					to {
						width: 0%;
					}
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}

				.custom-scrollbar::-webkit-scrollbar-track {
					background: ${isDark ? "#1e293b" : "#e2e8f0"};
					border-radius: 4px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: ${isDark ? "#6366f1" : "#8b5cf6"};
					border-radius: 4px;
					transition: all 0.2s ease;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: ${isDark ? "#7c3aed" : "#7c3aed"};
				}

				/* Code scrollbars - 6px width */
				.code-scrollbar {
					scrollbar-width: thin;
					scrollbar-color: ${isDark ? "#475569 #1e293b" : "#64748b #e2e8f0"};
				}

				.code-scrollbar::-webkit-scrollbar {
					width: 6px;
					height: 6px;
				}

				.code-scrollbar::-webkit-scrollbar-track {
					background: ${isDark ? "#1e293b" : "#e2e8f0"};
					border-radius: 3px;
				}

				.code-scrollbar::-webkit-scrollbar-thumb {
					background: ${isDark ? "#475569" : "#64748b"};
					border-radius: 3px;
					transition: all 0.2s ease;
				}

				.code-scrollbar::-webkit-scrollbar-thumb:hover {
					background: ${isDark ? "#64748b" : "#475569"};
				}

				/* Ensure proper theme transitions */
				::-webkit-scrollbar-track,
				::-webkit-scrollbar-thumb,
				.custom-scrollbar::-webkit-scrollbar-track,
				.custom-scrollbar::-webkit-scrollbar-thumb,
				.code-scrollbar::-webkit-scrollbar-track,
				.code-scrollbar::-webkit-scrollbar-thumb {
					transition: background-color 0.3s ease;
				}

				/* Syntax highlighting styles - theme responsive */
				.syntax-keyword {
					color: ${isDark ? "#c084fc" : "#7c3aed"};
					font-weight: 600;
				}

				.syntax-type {
					color: ${isDark ? "#93c5fd" : "#2563eb"};
				}

				.syntax-string {
					color: ${isDark ? "#86efac" : "#16a34a"};
				}

				.syntax-comment {
					color: ${isDark ? "#9ca3af" : "#6b7280"};
					font-style: italic;
				}

				.syntax-number {
					color: ${isDark ? "#fdba74" : "#ea580c"};
				}
			`}</style>

			{/* Loading Screen */}
			{isLoading && (
				<div
					className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
						isDark ? "bg-slate-900" : "bg-slate-50"
					}`}
				>
					<div className="text-center space-y-6">
						{/* Logo */}
						<div
							className={`w-16 h-16 mx-auto p-3 rounded-xl ${
								isDark
									? "bg-purple-600/20 text-purple-400"
									: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700"
							}`}
						>
							<AnimatedLogo className="w-full h-full" />
						</div>

						{/* App Name */}
						<h1
							className={`text-xl font-display font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}
						>
							Code Diff Viewer
						</h1>

						{/* Loading Progress Bar */}
						<div className="w-48 mx-auto space-y-2">
							<div
								className={`w-full h-1 rounded-full overflow-hidden ${
									isDark ? "bg-slate-800" : "bg-gray-200"
								}`}
							>
								<div
									className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
									style={{ width: `${loadingProgress}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			<div
				className={`min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-700 relative z-10 ${
					isDark
						? "bg-slate-900/60 text-white backdrop-blur-sm"
						: "bg-slate-50/60 text-slate-900 backdrop-blur-sm"
				} ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
				style={{
					position: "relative",
					top: 0,
					left: 0,
					overscrollBehavior: "none",
					transform: isLoading ? "translateY(20px)" : "translateY(0)",
					transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
				}}
			>
				{/* Header */}
				<div
					className={`relative z-50 border-b transition-all duration-300 ${
						isDark
							? "bg-slate-800 border-slate-700"
							: "bg-gradient-to-r from-white via-purple-50/30 to-white border-purple-200 shadow-sm"
					}`}
				>
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center justify-between">
							{/* Logo and Title Section */}
							<div className="flex items-center gap-4 flex-1 min-w-0">
								<div
									className={`p-3 rounded-xl transition-all duration-300 ${
										isDark
											? "bg-purple-600/20 text-purple-400"
											: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 border border-purple-300 shadow-md"
									}`}
								>
									<AnimatedLogo className="h-7 w-7" />
								</div>
								<div className="min-w-0 flex-1">
									<h1 className="text-lg sm:text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 bg-clip-text text-transparent truncate">
										Code Diff Viewer
									</h1>
									<p
										className={`text-xs sm:text-sm transition-colors duration-300 ${
											isDark ? "text-gray-400" : "text-slate-600"
										} hidden sm:block`}
									>
										Professional code comparison and analysis
									</p>
									{lastSavedTime && (
										<div className="flex items-center gap-2 mt-1">
											<div
												className={`w-2 h-2 rounded-full ${
													hasUnsavedChanges ? "bg-orange-500" : "bg-green-500"
												}`}
											/>
											<span
												className={`text-xs ${
													isDark ? "text-gray-500" : "text-slate-500"
												}`}
											>
												{hasUnsavedChanges
													? "Unsaved changes"
													: `Saved at ${lastSavedTime}`}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Professional Action Buttons Section */}
							<div className="flex items-center gap-3 flex-shrink-0">
								{/* Theme Toggle Button */}
								<button
									onClick={() => setIsDark(!isDark)}
									className={`group relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
										isDark
											? "bg-gradient-to-br from-purple-600/20 to-purple-700/20 hover:from-purple-600/30 hover:to-purple-700/30 border border-purple-500/30 hover:border-purple-400/50"
											: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 hover:border-purple-300"
									} shadow-lg hover:shadow-xl backdrop-blur-sm`}
									title={
										isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
									}
								>
									<div
										className={`transition-all duration-300 ${
											isDark ? "text-purple-300" : "text-purple-600"
										}`}
									>
										{isDark ? (
											<Sun className="h-5 w-5" />
										) : (
											<Moon className="h-5 w-5" />
										)}
									</div>
									<div
										className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
											isDark ? "bg-purple-400/5" : "bg-purple-600/5"
										}`}
									/>
								</button>

								{!showInputs && (
									<>
										{/* Desktop Professional Buttons */}
										<div className="hidden md:flex items-center gap-3">
											<button
												onClick={() => setShowHistory(!showHistory)}
												className={`group relative px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
													isDark
														? "bg-gradient-to-br from-purple-600/15 to-purple-700/15 hover:from-purple-600/25 hover:to-purple-700/25 border border-purple-500/25 hover:border-purple-400/40"
														: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 hover:border-purple-300"
												} shadow-lg hover:shadow-xl backdrop-blur-sm`}
											>
												<div className="flex items-center gap-2">
													<History
														className={`h-4 w-4 transition-colors duration-300 ${
															isDark
																? "text-purple-300 group-hover:text-purple-200"
																: "text-purple-600 group-hover:text-purple-700"
														}`}
													/>
													<span
														className={`text-sm font-medium transition-colors duration-300 ${
															isDark
																? "text-purple-300 group-hover:text-purple-200"
																: "text-purple-600 group-hover:text-purple-700"
														}`}
													>
														History
													</span>
												</div>
												<div
													className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
														isDark ? "bg-purple-400/5" : "bg-purple-600/5"
													}`}
												/>
											</button>

											<button
												onClick={resetDiff}
												className={`group relative px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
													isDark
														? "bg-gradient-to-br from-purple-600/15 to-purple-700/15 hover:from-purple-600/25 hover:to-purple-700/25 border border-purple-500/25 hover:border-purple-400/40"
														: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 hover:border-purple-300"
												} shadow-lg hover:shadow-xl backdrop-blur-sm`}
											>
												<div className="flex items-center gap-2">
													<FileText
														className={`h-4 w-4 transition-colors duration-300 ${
															isDark
																? "text-purple-300 group-hover:text-purple-200"
																: "text-purple-600 group-hover:text-purple-700"
														}`}
													/>
													<span
														className={`text-sm font-medium transition-colors duration-300 ${
															isDark
																? "text-purple-300 group-hover:text-purple-200"
																: "text-purple-600 group-hover:text-purple-700"
														}`}
													>
														New Diff
													</span>
												</div>
												<div
													className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
														isDark ? "bg-purple-400/5" : "bg-purple-600/5"
													}`}
												/>
											</button>

											<button
												onClick={exportDiff}
												className={`group relative px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
													isDark
														? "bg-gradient-to-br from-purple-600/15 to-purple-700/15 hover:from-purple-600/25 hover:to-purple-700/25 border border-purple-500/25 hover:border-purple-400/40"
														: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 hover:border-purple-300"
												} shadow-lg hover:shadow-xl backdrop-blur-sm`}
											>
												<div className="flex items-center gap-2">
													<Download
														className={`h-4 w-4 transition-colors duration-300 ${
															isDark
																? "text-purple-300 group-hover:text-purple-200"
																: "text-purple-600 group-hover:text-purple-700"
														}`}
													/>
													<span
														className={`text-sm font-medium transition-colors duration-300 ${
															isDark
																? "text-purple-300 group-hover:text-purple-200"
																: "text-purple-600 group-hover:text-purple-700"
														}`}
													>
														Export
													</span>
												</div>
												<div
													className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
														isDark ? "bg-purple-400/5" : "bg-purple-600/5"
													}`}
												/>
											</button>
										</div>

										{/* Mobile Hamburger Menu - Hidden on Desktop */}
										<div className="md:hidden relative mobile-menu-container">
											<button
												onClick={() => setShowMobileMenu(!showMobileMenu)}
												className={`group relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
													isDark
														? "bg-gradient-to-br from-purple-600/20 to-purple-700/20 hover:from-purple-600/30 hover:to-purple-700/30 border border-purple-500/30 hover:border-purple-400/50"
														: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 hover:border-purple-300"
												} shadow-lg hover:shadow-xl backdrop-blur-sm`}
												title="Menu"
											>
												<div
													className={`transition-all duration-300 ${
														isDark ? "text-purple-300" : "text-purple-600"
													}`}
												>
													<Menu className="h-5 w-5" />
												</div>
												<div
													className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
														isDark ? "bg-purple-400/5" : "bg-purple-600/5"
													}`}
												/>
											</button>

											{/* Mobile Dropdown Menu */}
											{showMobileMenu && (
												<div
													className={`absolute right-0 top-12 w-48 z-[60] rounded-lg border shadow-xl animate-in slide-in-from-top-2 fade-in duration-200 ${
														isDark
															? "bg-slate-800 border-slate-700"
															: "bg-white border-gray-200"
													}`}
												>
													<div className="py-2">
														<button
															onClick={() => {
																setShowHistory(!showHistory);
																setShowMobileMenu(false);
															}}
															className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors duration-200 cursor-pointer ${
																isDark
																	? "hover:bg-slate-700 text-white"
																	: "hover:bg-gray-100 text-gray-900"
															}`}
														>
															<History className="h-4 w-4" />
															History
														</button>

														<button
															onClick={() => {
																resetDiff();
																setShowMobileMenu(false);
															}}
															className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors duration-200 cursor-pointer ${
																isDark
																	? "hover:bg-slate-700 text-white"
																	: "hover:bg-gray-100 text-gray-900"
															}`}
														>
															<FileText className="h-4 w-4" />
															New Diff
														</button>

														<button
															onClick={() => {
																exportDiff();
																setShowMobileMenu(false);
															}}
															className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors duration-200 cursor-pointer ${
																isDark
																	? "hover:bg-slate-700 text-white"
																	: "hover:bg-gray-100 text-gray-900"
															}`}
														>
															<Download className="h-4 w-4" />
															Export
														</button>
													</div>
												</div>
											)}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Enhanced History Sidebar */}
				{showHistory && (
					<div
						className={`fixed right-0 top-0 h-full w-80 z-50 transform transition-all duration-500 ease-in-out ${
							showHistory ? "translate-x-0" : "translate-x-full"
						} ${
							isDark
								? "bg-gradient-to-b from-slate-800 to-slate-900 border-l border-slate-600"
								: "bg-gradient-to-b from-white to-purple-50/30 border-l border-purple-200"
						} shadow-2xl backdrop-blur-sm animate-in slide-in-from-right-4 fade-in duration-500`}
					>
						{/* Header with gradient */}
						<div
							className={`p-6 border-b ${
								isDark
									? "border-slate-700 bg-gradient-to-r from-slate-800 via-slate-800 to-purple-900/20"
									: "border-purple-200 bg-gradient-to-r from-white via-purple-50/50 to-purple-100/30"
							}`}
						>
							<div className="flex items-center justify-between mb-2">
								<h3
									className={`text-lg font-bold flex items-center gap-3 ${
										isDark ? "text-white" : "text-slate-800"
									}`}
								>
									<div
										className={`p-2 rounded-lg ${
											isDark
												? "bg-purple-600/20 text-purple-400"
												: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700"
										}`}
									>
										<Clock className="h-5 w-5" />
									</div>
									<span
										className={
											isDark
												? ""
												: "bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent"
										}
									>
										Change History
									</span>
								</h3>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowHistory(false)}
									className="hover:scale-110 transition-transform duration-200"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
							<p
								className={`text-sm ${
									isDark ? "text-gray-400" : "text-slate-600"
								}`}
							>
								Track all your changes and saves
							</p>
						</div>

						{/* History Content */}
						<div className="p-6 h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
							<div className="space-y-3">
								{history.length === 0 ? (
									<div
										className={`text-center py-8 ${
											isDark ? "text-gray-400" : "text-gray-600"
										}`}
									>
										<Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
										<p className="text-sm font-medium mb-1">
											No history available
										</p>
										<p className="text-xs opacity-75">
											Start making changes to see them here
										</p>
									</div>
								) : (
									history.map((entry, index) => (
										<div
											key={entry.id}
											className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${
												isDark
													? "bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-purple-500/50"
													: "bg-white/80 hover:bg-white border border-purple-200/60 hover:border-purple-300 shadow-sm hover:shadow-lg"
											} animate-in slide-in-from-bottom-2 fade-in`}
											style={{ animationDelay: `${index * 50}ms` }}
											onClick={() => loadFromHistory(entry)}
										>
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-center gap-3">
													<div
														className={`p-1.5 rounded-lg ${
															entry.action === "Save"
																? isDark
																	? "bg-green-600/20 text-green-400"
																	: "bg-green-100 text-green-700"
																: entry.action === "Edit"
																? isDark
																	? "bg-blue-600/20 text-blue-400"
																	: "bg-blue-100 text-blue-700"
																: entry.action === "Generate"
																? isDark
																	? "bg-purple-600/20 text-purple-400"
																	: "bg-purple-100 text-purple-700"
																: isDark
																? "bg-gray-600/20 text-gray-400"
																: "bg-gray-100 text-gray-700"
														}`}
													>
														{entry.action === "Save" && (
															<Save className="h-3 w-3" />
														)}
														{entry.action === "Edit" && (
															<Edit3 className="h-3 w-3" />
														)}
														{entry.action === "Generate" && (
															<Zap className="h-3 w-3" />
														)}
														{entry.action === "Load" && (
															<Download className="h-3 w-3" />
														)}
														{entry.action === "Export" && (
															<FileText className="h-3 w-3" />
														)}
													</div>
													<div>
														<span
															className={`font-semibold text-sm ${
																isDark ? "text-white" : "text-slate-800"
															}`}
														>
															{entry.action}
														</span>
														<div
															className={`text-xs mt-1 ${
																isDark ? "text-gray-400" : "text-slate-500"
															}`}
														>
															{new Date(entry.timestamp).toLocaleTimeString()}
														</div>
													</div>
												</div>
												<ChevronRight
													className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 ${
														isDark ? "text-gray-500" : "text-slate-400"
													}`}
												/>
											</div>
											<p
												className={`text-xs leading-relaxed ${
													isDark ? "text-gray-300" : "text-slate-600"
												}`}
											>
												{entry.details}
											</p>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				)}

				{/* Loading Overlay */}
				{isGenerating && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-in fade-in duration-500">
						<div
							className={`rounded-2xl p-8 text-center transform transition-all duration-700 ${
								isDark
									? "bg-slate-800 border border-slate-700"
									: "bg-white border border-slate-200"
							} shadow-xl`}
						>
							<div className="flex flex-col items-center gap-6">
								<div className="relative">
									<Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
								</div>
								<div className="space-y-2">
									<h3 className="text-xl font-bold text-purple-600">
										Analyzing Code Differences
									</h3>
									<p
										className={`text-sm ${
											isDark ? "text-gray-400" : "text-slate-600"
										}`}
									>
										Processing your code comparison...
									</p>
								</div>
								<div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div className="h-full bg-purple-500 rounded-full animate-pulse"></div>
								</div>
							</div>
						</div>
					</div>
				)}

				{showInputs ? (
					/* Input Section */
					<div
						className={`w-full transition-all duration-700 ${
							showInputs
								? "animate-in slide-in-from-bottom-4 fade-in"
								: "animate-out slide-out-to-top-4 fade-out"
						}`}
					>
						<div className="container mx-auto px-4 py-8 relative z-10">
							<div className="max-w-7xl mx-auto">
								<div className="grid lg:grid-cols-2 gap-8">
									{/* Old Code Input */}
									<div
										className={`rounded-xl border transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl ${
											isDark
												? "bg-slate-800 border-slate-700"
												: "bg-gradient-to-br from-white to-red-50/20 border-red-200 shadow-lg shadow-red-100/50"
										}`}
									>
										<div
											className={`p-6 border-b transition-colors duration-300 ${
												isDark ? "border-slate-700" : "border-gray-200"
											}`}
										>
											<h3 className="font-display font-bold text-xl flex items-center gap-3">
												<div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-sm" />
												<span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
													Original Code
												</span>
											</h3>
											<p
												className={`text-sm mt-2 transition-colors duration-300 ${
													isDark ? "text-gray-400" : "text-slate-600"
												}`}
											>
												Paste your original code version here
											</p>
										</div>
										<div className="p-6">
											<textarea
												value={oldCode}
												onChange={(e) => {
													setOldCode(e.target.value);
													setHasUnsavedChanges(true);
												}}
												placeholder="Paste your original code here..."
												className={`w-full h-[300px] font-mono text-sm resize-y border rounded-lg p-4 transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none custom-scrollbar ${
													isDark
														? "bg-slate-900 text-gray-100 placeholder-gray-500 border-slate-600"
														: "bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-300"
												}`}
											/>
										</div>
									</div>

									{/* New Code Input */}
									<div
										className={`rounded-xl border transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl ${
											isDark
												? "bg-slate-800 border-slate-700"
												: "bg-gradient-to-br from-white to-green-50/20 border-green-200 shadow-lg shadow-green-100/50"
										}`}
									>
										<div
											className={`p-6 border-b transition-colors duration-300 ${
												isDark ? "border-slate-700" : "border-gray-200"
											}`}
										>
											<h3 className="font-display font-bold text-xl flex items-center gap-3">
												<div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm" />
												<span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
													Modified Code
												</span>
											</h3>
											<p
												className={`text-sm mt-2 transition-colors duration-300 ${
													isDark ? "text-gray-400" : "text-slate-600"
												}`}
											>
												Paste your modified code version here
											</p>
										</div>
										<div className="p-6">
											<textarea
												value={newCode}
												onChange={(e) => {
													setNewCode(e.target.value);
													setHasUnsavedChanges(true);
												}}
												placeholder="Paste your modified code here..."
												className={`w-full h-[300px] font-mono text-sm resize-y border rounded-lg p-4 transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none custom-scrollbar ${
													isDark
														? "bg-slate-900 text-gray-100 placeholder-gray-500 border-slate-600"
														: "bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-300"
												}`}
											/>
										</div>
									</div>
								</div>

								<div className="mt-16 mb-16 text-center">
									<Button
										onClick={generateDiff}
										disabled={isGenerating}
										size="lg"
										className={`px-12 py-4 text-lg font-bold transition-all duration-300 ${
											isGenerating ? "opacity-75" : ""
										}`}
									>
										{isGenerating ? (
											<>
												<Loader2 className="h-6 w-6 mr-3 animate-spin" />
												Generating Diff...
											</>
										) : (
											<>
												<Zap className="h-6 w-6 mr-3" />
												Generate Professional Diff
											</>
										)}
									</Button>
									<p
										className={`mt-4 text-sm transition-all duration-300 ${
											isDark ? "text-gray-400" : "text-slate-500"
										}`}
									>
										Compare your code versions with professional diff analysis
									</p>
								</div>
							</div>
						</div>
					</div>
				) : (
					/* Diff View */
					<div
						className={`transition-all duration-700 ${
							showDiffContent
								? "animate-in slide-in-from-right-4 fade-in"
								: "opacity-0"
						}`}
					>
						{/* Modern Navigation Toolbar */}
						<div
							className={`relative z-40 border-b backdrop-blur-xl transition-all duration-300 ${
								isDark
									? "bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-slate-600/50 shadow-xl shadow-black/20"
									: "bg-gradient-to-r from-white/95 via-purple-50/95 to-white/95 border-purple-200/50 shadow-lg shadow-purple-100/50"
							}`}
						>
							<div className="container mx-auto px-6 py-5">
								<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
									{/* Navigation Controls - Modern Card Design */}
									<div className="flex items-center gap-6">
										<div
											className={`flex items-center rounded-2xl p-1 transition-all duration-300 ${
												isDark
													? "bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600/50 shadow-lg"
													: "bg-gradient-to-r from-white to-purple-50 border border-purple-200/60 shadow-md"
											}`}
										>
											{/* Previous Button */}
											<button
												onClick={() => navigateToChange("prev")}
												disabled={changes.length === 0}
												className={`group relative p-3 rounded-xl transition-all duration-300 ${
													changes.length === 0
														? "opacity-40 cursor-not-allowed"
														: isDark
														? "hover:bg-purple-600/20 hover:shadow-lg active:scale-95 cursor-pointer"
														: "hover:bg-purple-100/70 hover:shadow-md active:scale-95 cursor-pointer"
												}`}
												title="Previous change (Ctrl+↑)"
											>
												<ArrowUp
													className={`h-5 w-5 transition-all duration-300 ${
														changes.length === 0
															? isDark
																? "text-gray-600"
																: "text-gray-400"
															: isDark
															? "text-purple-300 group-hover:text-purple-200"
															: "text-purple-600 group-hover:text-purple-700"
													}`}
												/>
												<div
													className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
														isDark ? "bg-purple-400/10" : "bg-purple-600/10"
													}`}
												/>
											</button>

											{/* Counter Display */}
											<div
												className={`mx-2 px-4 py-2 rounded-xl font-mono text-sm font-bold transition-all duration-300 ${
													isDark
														? "bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-purple-200 border border-purple-500/30"
														: "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-300/50 shadow-sm"
												}`}
											>
												<span className="tabular-nums">
													{changes.length > 0
														? `${currentChangeIndex + 1}/${changes.length}`
														: "0/0"}
												</span>
											</div>

											{/* Next Button */}
											<button
												onClick={() => navigateToChange("next")}
												disabled={changes.length === 0}
												className={`group relative p-3 rounded-xl transition-all duration-300 ${
													changes.length === 0
														? "opacity-40 cursor-not-allowed"
														: isDark
														? "hover:bg-purple-600/20 hover:shadow-lg active:scale-95 cursor-pointer"
														: "hover:bg-purple-100/70 hover:shadow-md active:scale-95 cursor-pointer"
												}`}
												title="Next change (Ctrl+↓)"
											>
												<ArrowDown
													className={`h-5 w-5 transition-all duration-300 ${
														changes.length === 0
															? isDark
																? "text-gray-600"
																: "text-gray-400"
															: isDark
															? "text-purple-300 group-hover:text-purple-200"
															: "text-purple-600 group-hover:text-purple-700"
													}`}
												/>
												<div
													className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
														isDark ? "bg-purple-400/10" : "bg-purple-600/10"
													}`}
												/>
											</button>
										</div>

										{/* Elegant Divider */}
										<div
											className={`w-px h-8 transition-colors duration-300 ${
												isDark
													? "bg-gradient-to-b from-transparent via-slate-500 to-transparent"
													: "bg-gradient-to-b from-transparent via-purple-300 to-transparent"
											}`}
										/>
									</div>

									{/* Statistics Badges - Modern Glass Cards */}
									<div className="flex flex-wrap items-center gap-3">
										{/* Added Lines Badge */}
										<div
											className={`group relative rounded-2xl p-0.5 transition-all duration-300 hover:scale-105 ${
												isDark
													? "bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-500/30 hover:to-emerald-500/30"
													: "bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200"
											}`}
										>
											<div
												className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] backdrop-blur-sm transition-all duration-300 ${
													isDark
														? "bg-green-900/60 border border-green-500/30 text-green-200"
														: "bg-white/80 border border-green-300/40 text-green-800 shadow-sm"
												}`}
											>
												<div
													className={`w-2 h-2 rounded-full ${
														isDark ? "bg-green-400" : "bg-green-500"
													} animate-pulse`}
												/>
												<span className="font-bold text-sm tabular-nums">
													+
													{sections.reduce(
														(acc, s) =>
															acc +
															s.lines.filter((l) => l.type === "added").length,
														0
													)}
												</span>
											</div>
										</div>

										{/* Removed Lines Badge */}
										<div
											className={`group relative rounded-2xl p-0.5 transition-all duration-300 hover:scale-105 ${
												isDark
													? "bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-500/30 hover:to-pink-500/30"
													: "bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200"
											}`}
										>
											<div
												className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] backdrop-blur-sm transition-all duration-300 ${
													isDark
														? "bg-red-900/60 border border-red-500/30 text-red-200"
														: "bg-white/80 border border-red-300/40 text-red-800 shadow-sm"
												}`}
											>
												<div
													className={`w-2 h-2 rounded-full ${
														isDark ? "bg-red-400" : "bg-red-500"
													} animate-pulse`}
												/>
												<span className="font-bold text-sm tabular-nums">
													-
													{sections.reduce(
														(acc, s) =>
															acc +
															s.lines.filter((l) => l.type === "removed")
																.length,
														0
													)}
												</span>
											</div>
										</div>

										{/* Modified Lines Badge */}
										<div
											className={`group relative rounded-2xl p-0.5 transition-all duration-300 hover:scale-105 ${
												isDark
													? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-500/30"
													: "bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200"
											}`}
										>
											<div
												className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] backdrop-blur-sm transition-all duration-300 ${
													isDark
														? "bg-blue-900/60 border border-blue-500/30 text-blue-200"
														: "bg-white/80 border border-blue-300/40 text-blue-800 shadow-sm"
												}`}
											>
												<div
													className={`w-2 h-2 rounded-full ${
														isDark ? "bg-blue-400" : "bg-blue-500"
													} animate-pulse`}
												/>
												<span className="font-bold text-sm tabular-nums">
													~
													{sections.reduce(
														(acc, s) =>
															acc +
															s.lines.filter((l) => l.type === "modified")
																.length,
														0
													)}
												</span>
											</div>
										</div>

										{/* Conflicts Badge */}
										<div
											className={`group relative rounded-2xl p-0.5 transition-all duration-300 hover:scale-105 ${
												sections.filter((s) => s.type === "conflict").length > 0
													? isDark
														? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-500/30 hover:to-orange-500/30"
														: "bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200"
													: isDark
													? "bg-gradient-to-r from-gray-700/20 to-gray-600/20"
													: "bg-gradient-to-r from-gray-100 to-gray-200"
											}`}
										>
											<div
												className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] backdrop-blur-sm transition-all duration-300 ${
													sections.filter((s) => s.type === "conflict").length >
													0
														? isDark
															? "bg-yellow-900/60 border border-yellow-500/30 text-yellow-200"
															: "bg-white/80 border border-yellow-300/40 text-yellow-800 shadow-sm"
														: isDark
														? "bg-gray-800/60 border border-gray-600/30 text-gray-400"
														: "bg-white/60 border border-gray-300/40 text-gray-600 shadow-sm"
												}`}
											>
												<AlertTriangle
													className={`h-4 w-4 transition-all duration-300 ${
														sections.filter((s) => s.type === "conflict")
															.length > 0
															? isDark
																? "text-yellow-400 animate-pulse"
																: "text-yellow-600 animate-pulse"
															: isDark
															? "text-gray-500"
															: "text-gray-500"
													}`}
												/>
												<span className="font-bold text-sm tabular-nums">
													{sections.filter((s) => s.type === "conflict").length}{" "}
													Conflicts
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Main Diff Content */}
						<div
							className={`w-full max-w-full overflow-x-hidden ${
								showFooter ? "pb-16" : "pb-4"
							} ${
								showDiffContent
									? "animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300"
									: "opacity-0"
							}`}
						>
							<div className="container mx-auto px-4 py-8 relative z-10 max-w-full">
								<div className="grid lg:grid-cols-2 gap-2 max-w-7xl mx-auto overflow-x-hidden">
									{/* Old Code Panel */}
									<div
										className={`rounded-l-xl lg:rounded-r-none rounded-r-xl lg:border-r transition-all duration-300 ${
											isDark
												? "bg-slate-800 border border-slate-700 shadow-lg"
												: "bg-white border border-red-200 shadow-lg shadow-red-100/50"
										}`}
									>
										<div
											className={`px-6 py-4 border-b transition-colors duration-300 ${
												isDark
													? "bg-slate-800 border-slate-700"
													: "bg-slate-50 border-slate-200"
											}`}
										>
											<h3
												className={`font-bold text-lg flex items-center gap-3 ${
													isDark ? "text-white" : "text-slate-800"
												}`}
											>
												<div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-sm" />
												<span
													className={
														isDark
															? "text-white"
															: "bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
													}
												>
													Original Code
												</span>
											</h3>
										</div>
										<div
											className="overflow-auto max-w-full code-scrollbar"
											ref={containerRef}
										>
											{sections.map((section, sectionIndex) => (
												<div
													key={section.id}
													className="transition-all duration-300"
												>
													{section.type !== "unchanged" && (
														<div
															className={`px-6 py-3 text-xs font-bold border-b transition-colors duration-300 ${
																isDark
																	? "bg-slate-700 text-gray-300 border-slate-600"
																	: "bg-gray-100 text-gray-700 border-gray-300"
															}`}
														>
															{section.type.toUpperCase()} SECTION
															{section.type === "conflict" && (
																<AlertTriangle className="inline h-3 w-3 ml-2 text-red-500" />
															)}
														</div>
													)}

													{section.isCollapsed ? (
														<div
															className={`px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-3 ${
																isDark
																	? "bg-slate-800 hover:bg-slate-700 text-gray-400"
																	: "bg-gray-50 hover:bg-gray-100 text-gray-600"
															}`}
															onClick={() => toggleSection(section.id)}
														>
															<ChevronRight className="h-4 w-4 transition-transform duration-200" />
															<span className="text-sm font-medium">
																{section.lines.length} unchanged lines hidden
															</span>
														</div>
													) : (
														<>
															{section.type === "unchanged" &&
																section.lines.length > 5 && (
																	<div
																		className={`px-6 py-3 cursor-pointer transition-all duration-300 flex items-center gap-3 border-b ${
																			isDark
																				? "bg-slate-800 hover:bg-slate-700 text-gray-400 border-slate-600"
																				: "bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-300"
																		}`}
																		onClick={() => toggleSection(section.id)}
																	>
																		<ChevronDown className="h-4 w-4 transition-transform duration-200" />
																		<span className="text-xs font-medium">
																			Collapse unchanged
																		</span>
																	</div>
																)}

															{section.lines.map((line, lineIndex) => {
																const globalIndex =
																	sectionIndex * 1000 + lineIndex;
																return (
																	<div
																		key={globalIndex}
																		ref={(el) => {
																			changeRefs.current[globalIndex] = el;
																		}}
																		className={`flex ${getLineClassName(
																			line,
																			true
																		)} transition-all duration-300`}
																	>
																		<div
																			className={`w-12 text-right text-xs py-2 pr-3 select-none flex-shrink-0 font-medium ${
																				isDark
																					? "text-gray-500"
																					: "text-gray-400"
																			}`}
																		>
																			{line.oldLineNumber}
																		</div>
																		<div
																			className="flex-1 whitespace-pre-wrap break-all overflow-hidden py-1 max-w-full"
																			dangerouslySetInnerHTML={{
																				__html: highlightSyntax(
																					line.oldContent || ""
																				),
																			}}
																		/>
																	</div>
																);
															})}
														</>
													)}
												</div>
											))}
										</div>
									</div>

									{/* New Code Panel */}
									<div
										className={`rounded-r-xl lg:rounded-l-none rounded-l-xl transition-all duration-300 ${
											isDark
												? "bg-slate-800 border border-slate-700 shadow-lg"
												: "bg-white border border-green-200 shadow-lg shadow-green-100/50"
										}`}
									>
										<div
											className={`px-6 py-4 border-b transition-colors duration-300 ${
												isDark
													? "bg-slate-800 border-slate-700"
													: "bg-slate-50 border-slate-200"
											}`}
										>
											<h3
												className={`font-bold text-lg flex items-center gap-3 ${
													isDark ? "text-white" : "text-slate-800"
												}`}
											>
												<div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm" />
												<span
													className={
														isDark
															? "text-white"
															: "bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent"
													}
												>
													Modified Code
												</span>
											</h3>
										</div>
										<div className="overflow-auto max-w-full code-scrollbar">
											{sections.map((section, sectionIndex) => (
												<div
													key={section.id}
													className="transition-all duration-300"
												>
													{section.type !== "unchanged" && (
														<div
															className={`px-6 py-3 text-xs font-bold border-b transition-colors duration-300 ${
																isDark
																	? "bg-slate-700 text-gray-300 border-slate-600"
																	: "bg-gray-100 text-gray-700 border-gray-300"
															}`}
														>
															{section.type.toUpperCase()} SECTION
															{section.type === "conflict" && (
																<AlertTriangle className="inline h-3 w-3 ml-2 text-red-500" />
															)}
														</div>
													)}

													{section.isCollapsed ? (
														<div
															className={`px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-3 ${
																isDark
																	? "bg-slate-800 hover:bg-slate-700 text-gray-400"
																	: "bg-gray-50 hover:bg-gray-100 text-gray-600"
															}`}
															onClick={() => toggleSection(section.id)}
														>
															<ChevronRight className="h-4 w-4 transition-transform duration-200" />
															<span className="text-sm font-medium">
																{section.lines.length} unchanged lines hidden
															</span>
														</div>
													) : (
														<>
															{section.type === "unchanged" &&
																section.lines.length > 5 && (
																	<div
																		className={`px-6 py-3 cursor-pointer transition-all duration-300 flex items-center gap-3 border-b ${
																			isDark
																				? "bg-slate-800 hover:bg-slate-700 text-gray-400 border-slate-600"
																				: "bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-300"
																		}`}
																		onClick={() => toggleSection(section.id)}
																	>
																		<ChevronDown className="h-4 w-4 transition-transform duration-200" />
																		<span className="text-xs font-medium">
																			Collapse unchanged
																		</span>
																	</div>
																)}

															{section.lines.map((line, lineIndex) => {
																const globalIndex =
																	sectionIndex * 1000 + lineIndex;
																const isEditing = editingLine === globalIndex;

																return (
																	<div
																		key={globalIndex}
																		className={`flex ${getLineClassName(
																			line
																		)} transition-all duration-300`}
																	>
																		<div
																			className={`w-12 text-right text-xs py-2 pr-3 select-none flex-shrink-0 font-medium ${
																				isDark
																					? "text-gray-500"
																					: "text-gray-400"
																			}`}
																		>
																			{line.newLineNumber}
																		</div>
																		<div className="flex-1 relative group">
																			{isEditing ? (
																				<div className="flex items-start gap-3 p-2">
																					<textarea
																						value={editContent}
																						onChange={(e) =>
																							setEditContent(e.target.value)
																						}
																						className={`flex-1 min-h-[2rem] font-mono text-sm resize-none rounded-lg p-2 transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
																							isDark
																								? "bg-slate-900 border border-slate-600 text-gray-100"
																								: "bg-white border border-gray-300 text-gray-900"
																						}`}
																						autoFocus
																					/>
																					<div className="flex flex-col gap-2 flex-shrink-0">
																						<Button
																							size="sm"
																							onClick={handleSave}
																							className="h-8 w-8 p-0"
																						>
																							<Save className="h-3 w-3" />
																						</Button>
																						<Button
																							size="sm"
																							variant="outline"
																							onClick={cancelEdit}
																							className="h-8 w-8 p-0"
																						>
																							<X className="h-3 w-3" />
																						</Button>
																					</div>
																				</div>
																			) : (
																				<>
																					<div
																						className="whitespace-pre-wrap break-all py-1 overflow-hidden max-w-full"
																						dangerouslySetInnerHTML={{
																							__html: highlightSyntax(
																								line.newContent || ""
																							),
																						}}
																					/>
																					{line.type !== "removed" && (
																						<Button
																							size="sm"
																							variant="ghost"
																							className={`absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-all duration-300 h-6 w-6 p-0 ${
																								isDark
																									? "hover:bg-slate-700 text-gray-400"
																									: "hover:bg-gray-100 text-gray-600"
																							}`}
																							onClick={() =>
																								startEditing(
																									lineIndex,
																									sectionIndex,
																									line.newContent
																								)
																							}
																						>
																							<Edit3 className="h-3 w-3" />
																						</Button>
																					)}
																				</>
																			)}
																		</div>
																	</div>
																);
															})}
														</>
													)}
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Toast Notification - Simplified and Always Visible */}
					<div className="fixed top-6 right-0 md:right-6  z-[99999] pointer-events-auto">
						<div
							className={`relative rounded-lg shadow-xl border-2 min-w-[320px] max-w-md transform transition-all duration-300 ease-out ${
								showToast
									? "translate-x-0 opacity-100 scale-100"
									: "translate-x-full opacity-0 scale-95"
							} ${
								toastType === "success"
									? isDark
										? "bg-green-800 border-green-500 text-green-100"
										: "bg-green-100 border-green-400 text-green-900"
									: toastType === "info"
									? isDark
										? "bg-blue-800 border-blue-500 text-blue-100"
										: "bg-blue-100 border-blue-400 text-blue-900"
									: toastType === "warning"
									? isDark
										? "bg-yellow-800 border-yellow-500 text-yellow-100"
										: "bg-yellow-100 border-yellow-400 text-yellow-900"
									: isDark
									? "bg-red-800 border-red-500 text-red-100"
									: "bg-red-100 border-red-400 text-red-900"
							}`}
						>
							{/* Content */}
							<div className="flex items-center gap-3 px-4 py-3">
								{/* Icon */}
								<div
									className={`flex-shrink-0 ${
										toastType === "success"
											? isDark
												? "text-green-300"
												: "text-green-600"
											: toastType === "info"
											? isDark
												? "text-blue-300"
												: "text-blue-600"
											: toastType === "warning"
											? isDark
												? "text-yellow-300"
												: "text-yellow-600"
											: isDark
											? "text-red-300"
											: "text-red-600"
									}`}
								>
									{toastType === "success" && (
										<CheckCircle className="h-5 w-5" />
									)}
									{toastType === "info" && (
										<svg
											className="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									)}
									{toastType === "warning" && (
										<AlertTriangle className="h-5 w-5" />
									)}
									{toastType === "error" && (
										<svg
											className="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									)}
								</div>

								{/* Message */}
								<div className="flex-1">
									<p className="font-medium text-sm">{toastMessage}</p>
								</div>

								{/* Close button */}
								<button
									onClick={() => setShowToast(false)}
									className={`flex-shrink-0 p-1 rounded transition-colors cursor-pointer ${
										isDark
											? "hover:bg-white/10 text-gray-300 hover:text-white"
											: "hover:bg-black/5 text-gray-500 hover:text-gray-700"
									}`}
								>
									<X className="h-4 w-4" />
								</button>
							</div>

							{/* Progress bar */}
							<div
								className={`absolute bottom-0 left-0 h-1 rounded-b-lg ${
									toastType === "success"
										? isDark
											? "bg-green-400"
											: "bg-green-500"
										: toastType === "info"
										? isDark
											? "bg-blue-400"
											: "bg-blue-500"
										: toastType === "warning"
										? isDark
											? "bg-yellow-400"
											: "bg-yellow-500"
										: isDark
										? "bg-red-400"
										: "bg-red-500"
								}`}
								style={{
									width: "100%",
									animation: "shrink 3000ms linear forwards",
									transformOrigin: "left",
								}}
							/>
						</div>
					</div>
				)}

				{/* Footer - Only visible when scrolled to bottom */}
				{/* Enhanced Footer - Only visible when scrolled to bottom */}
				{showFooter && (
					<div
						className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-out transform ${
							showFooter
								? "translate-y-0 opacity-100"
								: "translate-y-full opacity-0"
						}`}
					>
						<div
							className={`border-t backdrop-blur-sm ${
								isDark
									? "bg-slate-900/90 border-slate-700 text-gray-400"
									: "bg-white/90 border-gray-200 text-gray-600"
							}`}
						>
							{/* Main Footer Content */}
							<div className="container mx-auto px-4 py-6">
								<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
									{/* Brand Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<div
												className={`p-2 rounded-lg ${
													isDark
														? "bg-purple-600/20 text-purple-400"
														: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700"
												}`}
											>
												<AnimatedLogo className="w-6 h-6" />
											</div>
											<span className="text-lg font-display font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
												Code Diff Viewer
											</span>
										</div>
										<p
											className={`text-sm ${
												isDark ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Professional code comparison and analysis tool for
											developers and teams.
										</p>
										<div className="flex items-center gap-3 pt-2">
											{/* Social Media Icons */}
											<a
												href="#"
												className={`p-2 rounded-full transition-colors duration-200 ${
													isDark
														? "bg-slate-800 hover:bg-purple-900/30 hover:text-purple-400"
														: "bg-gray-100 hover:bg-purple-100 hover:text-purple-700"
												}`}
											>
												<svg
													className="w-4 h-4"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
												</svg>
											</a>
											<a
												href="#"
												className={`p-2 rounded-full transition-colors duration-200 ${
													isDark
														? "bg-slate-800 hover:bg-purple-900/30 hover:text-purple-400"
														: "bg-gray-100 hover:bg-purple-100 hover:text-purple-700"
												}`}
											>
												<svg
													className="w-4 h-4"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
												</svg>
											</a>
											<a
												href="#"
												className={`p-2 rounded-full transition-colors duration-200 ${
													isDark
														? "bg-slate-800 hover:bg-purple-900/30 hover:text-purple-400"
														: "bg-gray-100 hover:bg-purple-100 hover:text-purple-700"
												}`}
											>
												<svg
													className="w-4 h-4"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
												</svg>
											</a>
										</div>
									</div>

									{/* Quick Links */}
									<div className="space-y-4">
										<h4
											className={`text-sm font-bold uppercase tracking-wider ${
												isDark ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Quick Links
										</h4>
										<ul className="space-y-2">
											<li>
												<a
													href="#"
													className={`text-sm transition-colors duration-200 hover:underline ${
														isDark
															? "hover:text-purple-400"
															: "hover:text-purple-700"
													}`}
												>
													Documentation
												</a>
											</li>
											<li>
												<a
													href="#"
													className={`text-sm transition-colors duration-200 hover:underline ${
														isDark
															? "hover:text-purple-400"
															: "hover:text-purple-700"
													}`}
												>
													API Reference
												</a>
											</li>
											<li>
												<a
													href="#"
													className={`text-sm transition-colors duration-200 hover:underline ${
														isDark
															? "hover:text-purple-400"
															: "hover:text-purple-700"
													}`}
												>
													Examples
												</a>
											</li>
											<li>
												<a
													href="#"
													className={`text-sm transition-colors duration-200 hover:underline ${
														isDark
															? "hover:text-purple-400"
															: "hover:text-purple-700"
													}`}
												>
													Changelog
												</a>
											</li>
										</ul>
									</div>

									{/* Resources */}
									<div className="space-y-4">
										<h4
											className={`text-sm font-bold uppercase tracking-wider ${
												isDark ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Resources
										</h4>
										<ul className="space-y-2">
											<li>
												<a
													href="#"
													className={`text-sm transition-colors duration-200 hover:underline ${
														isDark
															? "hover:text-purple-400"
															: "hover:text-purple-700"
													}`}
												>
													Blog
												</a>
											</li>
											<li>
												<a
													href="#"
													className={`text-sm transition-colors duration-200 hover:underline ${
														isDark
															? "hover:text-purple-400"
															: "hover:text-purple-700"
													}`}
												>
													Community
												</a>
											</li>
											<li>
												<a
													href="#"
													className={`text-sm transition-colors duration-200 hover:underline ${
														isDark
															? "hover:text-purple-400"
															: "hover:text-purple-700"
													}`}
												>
													Report Issues
												</a>
											</li>
											<li>
												<a
													href="#"
													className={`text-sm transition-colors duration-200 hover:underline ${
														isDark
															? "hover:text-purple-400"
															: "hover:text-purple-700"
													}`}
												>
													Feature Requests
												</a>
											</li>
										</ul>
									</div>

									{/* Newsletter */}
									<div className="space-y-4">
										<h4
											className={`text-sm font-bold uppercase tracking-wider ${
												isDark ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Stay Updated
										</h4>
										<p
											className={`text-sm ${
												isDark ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Subscribe to our newsletter for the latest updates and
											features.
										</p>
										<div className="flex">
											<input
												type="email"
												placeholder="Your email"
												className={`px-4 py-2 text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full ${
													isDark
														? "bg-slate-800 border border-slate-600 text-white placeholder-gray-500"
														: "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
												}`}
											/>
											<button
												className={`px-4 py-2 rounded-r-lg text-white text-sm font-medium transition-all duration-300 ${
													isDark
														? "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
														: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
												}`}
											>
												Subscribe
											</button>
										</div>
									</div>
								</div>
							</div>

							{/* Bottom Bar */}
							<div
								className={`py-4 border-t ${
									isDark ? "border-slate-700/50" : "border-gray-200"
								}`}
							>
								<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
									<p className="text-sm">
										© 2025 Code Diff Viewer. All rights reserved.
									</p>
									<div className="flex items-center gap-6">
										<a href="#" className="text-sm hover:underline">
											Privacy Policy
										</a>
										<a href="#" className="text-sm hover:underline">
											Terms of Service
										</a>
										<a href="#" className="text-sm hover:underline">
											Cookie Policy
										</a>
									</div>
									{/* Keyboard Shortcuts Button */}
									<button
										className={`text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-200 ${
											isDark
												? "bg-slate-800 hover:bg-slate-700 border border-slate-700"
												: "bg-gray-100 hover:bg-gray-200 border border-gray-200"
										}`}
									>
										<Code2 className="h-3.5 w-3.5" />
										<span>Keyboard Shortcuts</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
