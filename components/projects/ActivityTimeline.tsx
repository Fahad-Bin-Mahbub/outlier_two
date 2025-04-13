"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

interface Theme {
	isDark: boolean;
	colors: {
		primary: string;
		secondary: string;
		accent: string;
		background: string;
		surface: string;
		text: string;
		textSecondary: string;
		border: string;
		gradient: string;
		cardGradient: string;
		timelineLine: string;
		timelineDot: string;
		activityBg: string;
	};
}

const appTheme: Theme["colors"] = {
	primary: "#3B82F6",
	secondary: "#10B981",
	accent: "#F59E0B",
	background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)",
	surface: "rgba(255, 255, 255, 0.95)",
	text: "#1E293B",
	textSecondary: "#64748B",
	border: "rgba(59, 130, 246, 0.2)",
	gradient: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)",
	cardGradient:
		"linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)",
	timelineLine: "#E2E8F0",
	timelineDot: "#3B82F6",
	activityBg: "rgba(59, 130, 246, 0.05)",
};

interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info";
	duration?: number;
}

const HeartIcon: React.FC<{ className?: string; filled?: boolean }> = ({
	className = "w-4 h-4",
	filled = false,
}) => (
	<svg
		className={`${className} transition-all duration-300 hover:scale-110`}
		fill={filled ? "currentColor" : "none"}
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
		/>
	</svg>
);

const MessageIcon: React.FC<{ className?: string }> = ({
	className = "w-4 h-4",
}) => (
	<svg
		className={`${className} transition-all duration-300 hover:scale-110`}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
		/>
	</svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({
	className = "w-4 h-4",
}) => (
	<svg
		className={`${className} transition-all duration-300 hover:scale-110`}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
		/>
	</svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({
	className = "w-4 h-4",
}) => (
	<svg
		className={`${className} transition-transform duration-300`}
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

const ChevronUpIcon: React.FC<{ className?: string }> = ({
	className = "w-4 h-4",
}) => (
	<svg
		className={`${className} transition-transform duration-300`}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M5 15l7-7 7 7"
		/>
	</svg>
);

const UserIcon: React.FC<{ className?: string }> = ({
	className = "w-8 h-8",
}) => (
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
			d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
		/>
	</svg>
);

const SunIcon: React.FC<{ className?: string }> = ({
	className = "w-5 h-5",
}) => (
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

const MoonIcon: React.FC<{ className?: string }> = ({
	className = "w-5 h-5",
}) => (
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

const XIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
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

const CheckIcon: React.FC<{ className?: string }> = ({
	className = "w-5 h-5",
}) => (
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
			d="M5 13l4 4L19 7"
		/>
	</svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({
	className = "w-5 h-5",
}) => (
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
			d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

const AlertIcon: React.FC<{ className?: string }> = ({
	className = "w-5 h-5",
}) => (
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
			d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
		/>
	</svg>
);

const RocketIcon: React.FC<{ className?: string }> = ({
	className = "w-6 h-6",
}) => (
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
		<circle cx="12" cy="12" r="1" fill="currentColor" />
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M8 21l1-1m0 0l1-1m-1 1v-2m0 2h-2"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M16 3l-1 1m0 0l-1 1m1-1v2m0-2h2"
		/>
	</svg>
);

const StarIcon: React.FC<{ className?: string }> = ({
	className = "w-6 h-6",
}) => (
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
			d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
		/>
		<circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.6" />
	</svg>
);

const DiamondIcon: React.FC<{ className?: string }> = ({
	className = "w-6 h-6",
}) => (
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
			d="M9 3l3 2 3-2M12 21V5M5 8l2 3-2 3 7 5 7-5-2-3 2-3-7-5-7 5z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M9 11l3-6 3 6-3 8-3-8z"
			fill="currentColor"
			opacity="0.1"
		/>
		<circle cx="12" cy="11" r="1" fill="currentColor" opacity="0.8" />
	</svg>
);

const ClipboardIcon: React.FC<{ className?: string }> = ({
	className = "w-6 h-6",
}) => (
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
			d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-1"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M10 11h4M10 13h4M10 15h2"
		/>
		<circle cx="9" cy="9" r="1" fill="currentColor" opacity="0.6" />
	</svg>
);

const EnvelopeIcon: React.FC<{ className?: string }> = ({
	className = "w-6 h-6",
}) => (
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
			d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
		/>
	</svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({
	className = "w-5 h-5",
}) => (
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
			d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
		/>
	</svg>
);

const ClockIcon: React.FC<{
	className?: string;
	style?: React.CSSProperties;
}> = ({ className = "w-4 h-4", style }) => (
	<svg
		className={className}
		style={style}
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

const ActivityIcon: React.FC<{
	className?: string;
	style?: React.CSSProperties;
}> = ({ className = "w-4 h-4", style }) => (
	<svg
		className={className}
		style={style}
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

const TimelineIcon: React.FC<{
	className?: string;
	style?: React.CSSProperties;
}> = ({ className = "w-5 h-5", style }) => (
	<svg
		className={className}
		style={style}
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
		<circle cx="12" cy="12" r="2" fill="currentColor" />
	</svg>
);

const HistoryIcon: React.FC<{
	className?: string;
	style?: React.CSSProperties;
}> = ({ className = "w-5 h-5", style }) => (
	<svg
		className={className}
		style={style}
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
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M4 12a8 8 0 018-8V2.5"
		/>
	</svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({
	className = "w-4 h-4",
}) => (
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
			d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
		/>
	</svg>
);

const Footer: React.FC<{ colors: Theme["colors"] }> = ({ colors }) => {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ name: "Features", href: "#features" },
			{ name: "Timeline", href: "#timeline" },
			{ name: "Analytics", href: "#analytics" },
			{ name: "API Documentation", href: "#api" },
		],
		company: [
			{ name: "About Us", href: "#about" },
			{ name: "Careers", href: "#careers" },
			{ name: "Contact", href: "#contact" },
			{ name: "Blog", href: "#blog" },
		],
		support: [
			{ name: "Help Center", href: "#help" },
			{ name: "Community", href: "#community" },
			{ name: "Status", href: "#status" },
			{ name: "Feedback", href: "#feedback" },
		],
		legal: [
			{ name: "Privacy Policy", href: "#privacy" },
			{ name: "Terms of Service", href: "#terms" },
			{ name: "Cookie Policy", href: "#cookies" },
			{ name: "GDPR", href: "#gdpr" },
		],
	};

	const socialLinks = [
		{
			name: "Twitter",
			href: "https://twitter.com/activitytimeline",
			icon: (
				<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
					<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
				</svg>
			),
		},
		{
			name: "GitHub",
			href: "https://github.com/activitytimeline",
			icon: (
				<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						fillRule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		{
			name: "LinkedIn",
			href: "https://linkedin.com/company/activitytimeline",
			icon: (
				<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						fillRule="evenodd"
						d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		{
			name: "Discord",
			href: "https://discord.gg/activitytimeline",
			icon: (
				<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
					<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" />
				</svg>
			),
		},
	];

	return (
		<footer
			className="relative mt-16 border-t backdrop-blur-md text-black"
			style={{
				background: `linear-gradient(135deg, ${colors.surface}f0, ${colors.background}f0)`,
				borderColor: colors.border,
			}}
		>
			{}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className="absolute top-0 left-1/4 w-32 h-32 rounded-full opacity-3"
					style={{
						background: `radial-gradient(circle, ${colors.primary}, transparent)`,
					}}
				></div>
				<div
					className="absolute bottom-0 right-1/4 w-24 h-24 rounded-full opacity-3"
					style={{
						background: `radial-gradient(circle, ${colors.secondary}, transparent)`,
					}}
				></div>
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
				{}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
					{}
					<div className="lg:col-span-2">
						<div className="flex items-center space-x-3 mb-4">
							<div
								className="p-2 rounded-xl"
								style={{
									background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
								}}
							>
								<TimelineIcon className="w-6 h-6 text-white" />
							</div>
							<div>
								<h3
									className="text-xl font-bold"
									style={{ color: colors.text }}
								>
									Activity Timeline
								</h3>
								<p className="text-sm" style={{ color: colors.textSecondary }}>
									User Interaction Platform
								</p>
							</div>
						</div>
						<p
							className="text-sm leading-relaxed mb-6 max-w-sm"
							style={{ color: colors.textSecondary }}
						>
							A modern, interactive social media timeline interface built with
							React and TypeScript. Track user interactions, monitor system
							events, and visualize activity history with beautiful, responsive
							design.
						</p>

						{}
						<div className="flex items-center space-x-4">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer group"
									style={{
										background: colors.surface,
										borderColor: colors.border,
										color: colors.textSecondary,
									}}
									title={`Follow us on ${social.name}`}
								>
									<div
										className="transition-colors duration-300 group-hover:text-blue-500"
										style={{ color: colors.textSecondary }}
									>
										{social.icon}
									</div>
								</a>
							))}
						</div>
					</div>

					{}
					<div>
						<h4
							className="text-sm font-semibold mb-4 uppercase tracking-wider"
							style={{ color: colors.text }}
						>
							Product
						</h4>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-sm transition-all duration-300 hover:translate-x-1 cursor-pointer"
										style={{ color: colors.textSecondary }}
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4
							className="text-sm font-semibold mb-4 uppercase tracking-wider"
							style={{ color: colors.text }}
						>
							Company
						</h4>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-sm transition-all duration-300 hover:translate-x-1 cursor-pointer"
										style={{ color: colors.textSecondary }}
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4
							className="text-sm font-semibold mb-4 uppercase tracking-wider"
							style={{ color: colors.text }}
						>
							Support
						</h4>
						<ul className="space-y-3">
							{footerLinks.support.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-sm transition-all duration-300 hover:translate-x-1 cursor-pointer"
										style={{ color: colors.textSecondary }}
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4
							className="text-sm font-semibold mb-4 uppercase tracking-wider"
							style={{ color: colors.text }}
						>
							Legal
						</h4>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-sm transition-all duration-300 hover:translate-x-1 cursor-pointer"
										style={{ color: colors.textSecondary }}
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{}
				<div
					className="p-6 rounded-xl border mb-8"
					style={{
						background: colors.cardGradient,
						borderColor: colors.border,
					}}
				>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
						<div>
							<h4
								className="text-lg font-semibold mb-1"
								style={{ color: colors.text }}
							>
								Stay Updated
							</h4>
							<p className="text-sm" style={{ color: colors.textSecondary }}>
								Get notified about new features, updates, and timeline
								improvements.
							</p>
						</div>
						<div className="flex space-x-3 max-w-md w-full md:w-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 text-sm"
								style={{
									background: colors.surface,
									borderColor: colors.border,
									color: colors.text,
								}}
							/>
							<button
								className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 cursor-pointer text-sm whitespace-nowrap"
								style={{
									background: colors.primary,
									color: "white",
								}}
							>
								Subscribe
							</button>
						</div>
					</div>
				</div>

				{}
				<div
					className="pt-8 border-t flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
					style={{ borderColor: colors.border }}
				>
					<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
						<p className="text-sm" style={{ color: colors.textSecondary }}>
							{currentYear} Activity Timeline.
						</p>
						<div className="flex items-center space-x-4 text-xs">
							<span
								className="px-2 py-1 rounded-full"
								style={{
									background: colors.primary + "20",
									color: colors.primary,
								}}
							>
								Version 1.0.0
							</span>
							<span
								className="px-2 py-1 rounded-full"
								style={{
									background: colors.secondary + "20",
									color: colors.secondary,
								}}
							>
								React 18
							</span>
							<span
								className="px-2 py-1 rounded-full"
								style={{
									background: colors.accent + "20",
									color: colors.accent,
								}}
							>
								Next.js 14
							</span>
						</div>
					</div>

					<div className="flex items-center space-x-6 text-sm">
						<a
							href="#privacy"
							className="transition-colors duration-300 cursor-pointer"
							style={{ color: colors.textSecondary }}
						>
							Privacy
						</a>
						<a
							href="#terms"
							className="transition-colors duration-300 cursor-pointer"
							style={{ color: colors.textSecondary }}
						>
							Terms
						</a>
						<a
							href="#contact"
							className="transition-colors duration-300 cursor-pointer"
							style={{ color: colors.textSecondary }}
						>
							Contact
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};
const LoadingScreen: React.FC<{ colors: Theme["colors"] }> = ({ colors }) => {
	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center"
			style={{ background: colors.background }}
		>
			{}
			<div className="absolute inset-0 overflow-hidden">
				<div
					className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-10 animate-pulse"
					style={{
						background: `radial-gradient(circle, ${colors.primary}, transparent)`,
						animationDuration: "3s",
					}}
				></div>
				<div
					className="absolute bottom-20 left-10 w-24 h-24 rounded-full opacity-10 animate-pulse"
					style={{
						background: `radial-gradient(circle, ${colors.secondary}, transparent)`,
						animationDuration: "2s",
						animationDelay: "1s",
					}}
				></div>
				<div
					className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-5 animate-bounce"
					style={{
						background: `radial-gradient(circle, ${colors.accent}, transparent)`,
						animationDuration: "4s",
					}}
				></div>
				<div
					className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full opacity-5 animate-bounce"
					style={{
						background: `radial-gradient(circle, ${colors.primary}, transparent)`,
						animationDuration: "3.5s",
						animationDelay: "0.5s",
					}}
				></div>
			</div>

			{}
			<div className="relative z-10 text-center px-4">
				{}
				<div className="mb-8">
					<div
						className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-2xl animate-pulse"
						style={{
							background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
							boxShadow: `0 0 40px ${colors.primary}40`,
						}}
					>
						<TimelineIcon
							className="w-10 h-10 text-white animate-spin"
							style={{ animationDuration: "3s" }}
						/>
					</div>
				</div>

				{}
				<h1
					className="text-3xl md:text-4xl font-bold mb-2 animate-fadeInUp"
					style={{
						color: colors.text,
						animationDelay: "0.2s",
						animationFillMode: "both",
					}}
				>
					Activity Timeline
				</h1>

				<p
					className="text-lg mb-8 animate-fadeInUp"
					style={{
						color: colors.textSecondary,
						animationDelay: "0.4s",
						animationFillMode: "both",
					}}
				>
					Loading your workspace...
				</p>

				{}
				<div className="flex items-center justify-center space-x-2 mb-8">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="w-3 h-3 rounded-full animate-bounce"
							style={{
								background: colors.primary,
								animationDelay: `${i * 0.2}s`,
								animationDuration: "1.4s",
							}}
						></div>
					))}
				</div>

				{}
				<div
					className="w-64 h-1 mx-auto rounded-full overflow-hidden"
					style={{ background: colors.border }}
				>
					<div
						className="h-full rounded-full animate-loading-progress"
						style={{
							background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
						}}
					></div>
				</div>

				{}
				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
					{[
						{
							icon: <RocketIcon className="w-6 h-6" />,
							text: "Real-time Updates",
							delay: "0.6s",
						},
						{
							icon: <StarIcon className="w-6 h-6" />,
							text: "Interactive Timeline",
							delay: "0.8s",
						},
						{
							icon: <DiamondIcon className="w-6 h-6" />,
							text: "Responsive Design",
							delay: "1s",
						},
					].map((feature, index) => (
						<div
							key={index}
							className="flex flex-col items-center space-y-2 animate-fadeInUp"
							style={{
								animationDelay: feature.delay,
								animationFillMode: "both",
							}}
						>
							<div
								className="w-12 h-12 rounded-xl flex items-center justify-center"
								style={{
									background: colors.cardGradient,
									color: colors.primary,
									border: `1px solid ${colors.border}`,
								}}
							>
								{feature.icon}
							</div>
							<span
								className="text-sm font-medium"
								style={{ color: colors.textSecondary }}
							>
								{feature.text}
							</span>
						</div>
					))}
				</div>
			</div>

			{}
			<div className="absolute inset-0 pointer-events-none">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="absolute w-2 h-2 rounded-full animate-float"
						style={{
							background: colors.primary,
							opacity: 0.3,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animationDuration: `${3 + Math.random() * 2}s`,
						}}
					></div>
				))}
			</div>
		</div>
	);
};

interface ActivityItem {
	id: string;
	user: {
		name: string;
		avatar: string;
		id: string;
	};
	action: string;
	content: string;
	timestamp: Date;
	likes: number;
	replies: number;
	isLiked: boolean;
	expandedContent?: string;
	comments: Comment[];
}

interface Comment {
	id: string;
	user: {
		name: string;
		avatar: string;
		id: string;
	};
	content: string;
	timestamp: Date;
	likes: number;
	isLiked: boolean;
	replies: CommentReply[];
}

interface CommentReply {
	id: string;
	user: {
		name: string;
		avatar: string;
		id: string;
	};
	content: string;
	timestamp: Date;
	likes: number;
	isLiked: boolean;
}

const getRelativeTime = (date: Date): string => {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
	if (diffInSeconds < 604800)
		return `${Math.floor(diffInSeconds / 86400)}d ago`;
	return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

const generateMockComments = (activityIndex: number): Comment[] => {
	const users = [
		{
			name: "Alice Johnson",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Bob Smith",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Carol Williams",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "David Brown",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Emma Davis",
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Michael Chen",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Sarah Wilson",
			avatar:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "James Rodriguez",
			avatar:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
		},
	];

	const commentTexts = [
		"Great work on this! Really appreciate the attention to detail.",
		"This is exactly what we needed. Thanks for implementing this feature.",
		"I have a question about the implementation approach used here.",
		"Excellent progress! This will definitely improve our workflow.",
		"Could you provide more details about the technical specifications?",
		"This looks promising. When can we expect the full rollout?",
		"I noticed some potential improvements we could make to this.",
		"Perfect timing! This addresses the issues we discussed last week.",
		"The user experience improvements are really noticeable here.",
		"Thanks for the quick turnaround on this request.",
	];

	const replyTexts = [
		"Thanks for the feedback! I'll make those adjustments.",
		"Good point. Let me look into that and get back to you.",
		"I'm glad you found it helpful. Happy to discuss further.",
		"That's a great suggestion. I'll incorporate that in the next iteration.",
		"Absolutely! I'll send over the documentation shortly.",
		"The rollout is scheduled for next week. I'll keep you updated.",
		"I'd love to hear your ideas. Can we schedule a quick call?",
		"You're welcome! Always happy to help improve our processes.",
		"Thanks! The UX team did an amazing job on the design.",
		"No problem at all. Let me know if you need anything else.",
	];

	const commentCount = Math.floor(Math.random() * 5);

	return Array.from({ length: commentCount }, (_, i) => {
		const commentIndex = (activityIndex * 10 + i) % users.length;
		const user = users[commentIndex];
		const commentId = `comment-${activityIndex}-${i}`;

		const replyCount = Math.floor(Math.random() * 3);
		const replies: CommentReply[] = Array.from(
			{ length: replyCount },
			(_, j) => {
				const replyIndex = (commentIndex + j + 1) % users.length;
				const replyUser = users[replyIndex];

				return {
					id: `reply-${activityIndex}-${i}-${j}`,
					user: { ...replyUser, id: `user-reply-${replyIndex}` },
					content: replyTexts[(activityIndex + i + j) % replyTexts.length],
					timestamp: new Date(
						Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000
					),
					likes: Math.floor(Math.random() * 15),
					isLiked: Math.random() > 0.7,
				};
			}
		);

		return {
			id: commentId,
			user: { ...user, id: `user-comment-${commentIndex}` },
			content: commentTexts[(activityIndex + i) % commentTexts.length],
			timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
			likes: Math.floor(Math.random() * 25),
			isLiked: Math.random() > 0.6,
			replies: replies,
		};
	});
};

const generateMockData = (count: number, startIndex = 0): ActivityItem[] => {
	const actions = [
		"logged into the system",
		"updated profile information",
		"completed task assignment",
		"joined team meeting",
		"submitted project report",
		"reviewed document",
		"created new workspace",
		"modified user permissions",
		"exported data report",
		"scheduled team sync",
	];

	const activityDescriptions = [
		"Successfully completed the quarterly review process and submitted feedback for all team members.",
		"Updated the project roadmap with new milestones and adjusted delivery timelines based on client requirements.",
		"Collaborated with the design team to finalize the user interface mockups for the mobile application.",
		"Resolved three critical bugs in the authentication system and deployed the fixes to production.",
		"Conducted a comprehensive security audit of the database and implemented recommended improvements.",
		"Organized and facilitated the weekly sprint planning meeting with stakeholders from multiple departments.",
		"Created detailed documentation for the new API endpoints and shared it with the development team.",
		"Analyzed user engagement metrics and prepared a presentation for the executive leadership team.",
		"Migrated legacy data to the new cloud infrastructure and verified data integrity across all systems.",
		"Coordinated with the marketing team to launch the new product feature announcement campaign.",
		"Implemented automated testing procedures that reduced manual QA time by 40% this quarter.",
		"Mentored two junior developers and helped them successfully complete their first major project deliverables.",
		"Negotiated contract terms with our primary vendor and secured a 15% cost reduction for next year.",
		"Led the incident response for yesterday's service outage and restored full functionality within 2 hours.",
		"Presented the new customer onboarding process to the support team and gathered valuable feedback.",
		"Optimized database queries that improved application performance by 25% across all user interactions.",
		"Facilitated cross-team collaboration session that resulted in streamlined workflow between departments.",
		"Completed certification training in cloud architecture and earned advanced practitioner credentials.",
		"Reviewed and approved budget allocations for Q4 technology initiatives and infrastructure upgrades.",
		"Established new coding standards and best practices that will be adopted across all development teams.",
	];

	const expandedDescriptions = [
		"This comprehensive review involved evaluating team performance metrics, identifying areas for improvement, and creating personalized development plans. The process included one-on-one meetings with each team member, analysis of project contributions, and alignment with company objectives for the upcoming quarter.",
		"The roadmap update required extensive stakeholder consultation and careful consideration of resource allocation. Key changes include accelerated mobile development timeline, integration of new third-party services, and adjustment of feature priorities based on recent user feedback and market analysis.",
		"The collaboration session focused on creating intuitive user experiences that align with accessibility standards and modern design principles. We reviewed user journey maps, conducted usability testing sessions, and incorporated feedback from beta users to refine the interface design.",
		"The bug fixes addressed critical security vulnerabilities in the login system, resolved session timeout issues, and improved error handling for edge cases. Each fix underwent thorough testing in staging environment before deployment, ensuring zero downtime during the update process.",
		"The security audit encompassed vulnerability scanning, access control review, and compliance verification against industry standards. Recommendations included implementing multi-factor authentication, encrypting sensitive data fields, and establishing automated monitoring for suspicious activities.",
		"The sprint planning session brought together product managers, developers, designers, and QA engineers to prioritize upcoming work. We reviewed backlog items, estimated effort requirements, identified dependencies, and established clear success criteria for each sprint goal.",
		"The API documentation includes comprehensive endpoint descriptions, request/response examples, authentication requirements, and error handling guidelines. This resource will significantly reduce integration time for both internal teams and external partners working with our platform.",
		"The metrics analysis revealed key insights about user behavior patterns, feature adoption rates, and engagement trends. The presentation highlighted opportunities for product improvement, recommended A/B testing strategies, and proposed initiatives to increase user retention and satisfaction.",
		"The data migration project involved transferring 2.5TB of historical records while maintaining system availability. We implemented incremental sync processes, performed extensive validation checks, and established rollback procedures to ensure business continuity throughout the transition.",
		"The product launch campaign coordination included creating marketing materials, scheduling social media content, preparing press releases, and organizing demo sessions for key customers. The campaign successfully generated 300% more leads than our previous feature announcements.",
		"The automated testing implementation covers unit tests, integration tests, and end-to-end scenarios. This initiative significantly improved code quality, reduced regression issues, and enabled faster deployment cycles while maintaining high reliability standards.",
		"The mentoring program involved weekly code reviews, pair programming sessions, and career development discussions. Both junior developers successfully delivered their assigned features ahead of schedule and demonstrated significant improvement in coding practices and problem-solving skills.",
		"The vendor negotiation process included competitive analysis, cost-benefit evaluation, and service level agreement optimization. The new contract terms provide better support response times, expanded service coverage, and flexible scaling options that align with our growth projections.",
		"The incident response involved immediate system diagnostics, coordinated communication with affected users, and implementation of temporary workarounds. Post-incident analysis identified root causes and resulted in preventive measures to avoid similar issues in the future.",
		"The onboarding process presentation covered streamlined account setup, interactive tutorial development, and improved help documentation. The support team provided valuable insights about common user questions, which will be incorporated into the self-service resources.",
		"The database optimization project focused on query performance analysis, index optimization, and connection pooling improvements. These changes resulted in faster page load times, reduced server resource usage, and improved overall user experience across the platform.",
		"The collaboration session established new communication protocols, shared project management tools, and cross-functional team structures. These improvements have already shown positive results in project delivery times and inter-departmental coordination effectiveness.",
		"The cloud architecture certification involved intensive study of distributed systems, scalability patterns, and security best practices. This expertise will be valuable for upcoming infrastructure modernization projects and cloud migration initiatives planned for next year.",
		"The budget review process included detailed analysis of current spending patterns, ROI evaluation of existing tools, and strategic planning for technology investments. The approved allocations will support critical infrastructure upgrades and new development initiatives.",
		"The coding standards establishment involved researching industry best practices, consulting with senior developers, and creating comprehensive guidelines for code quality, documentation, and testing. These standards will improve code maintainability and team collaboration efficiency.",
	];

	const users = [
		{
			name: "Alice Johnson",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Bob Smith",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Carol Williams",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "David Brown",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Emma Davis",
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Michael Chen",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Sarah Wilson",
			avatar:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "James Rodriguez",
			avatar:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Lisa Thompson",
			avatar:
				"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face",
		},
		{
			name: "Ryan Parker",
			avatar:
				"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
		},
	];

	return Array.from({ length: count }, (_, i) => {
		const index = startIndex + i;
		const user = users[index % users.length];
		const comments = generateMockComments(index);

		return {
			id: `activity-${index}`,
			user: { ...user, id: `user-${index}` },
			action: actions[index % actions.length],
			content: activityDescriptions[index % activityDescriptions.length],
			timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
			likes: Math.floor(Math.random() * 50),
			replies: comments.length,
			isLiked: Math.random() > 0.5,
			expandedContent:
				expandedDescriptions[index % expandedDescriptions.length],
			comments: comments,
		};
	});
};

const ToastNotification: React.FC<{
	toast: Toast;
	onClose: (id: string) => void;
	colors: Theme["colors"];
}> = ({ toast, onClose, colors }) => {
	const { id, message, type, duration = 3000 } = toast;

	useEffect(() => {
		const timer = setTimeout(() => {
			onClose(id);
		}, duration);

		return () => clearTimeout(timer);
	}, [id, duration, onClose]);

	const getIcon = () => {
		switch (type) {
			case "success":
				return <CheckIcon className="w-5 h-5" />;
			case "error":
				return <AlertIcon className="w-5 h-5" />;
			case "info":
				return <InfoIcon className="w-5 h-5" />;
		}
	};

	const getColor = () => {
		switch (type) {
			case "success":
				return "#10B981";
			case "error":
				return "#EF4444";
			case "info":
				return colors.primary;
		}
	};

	return (
		<div
			className="flex items-center p-3 md:p-4 rounded-xl shadow-lg border animate-slideIn backdrop-blur-md max-w-full"
			style={{
				background: colors.surface,
				borderColor: getColor(),
				color: colors.text,
				boxShadow: `0 0 15px ${getColor()}40`,
			}}
		>
			<div
				className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full mr-2 md:mr-3 flex-shrink-0"
				style={{ background: `${getColor()}20`, color: getColor() }}
			>
				{getIcon()}
			</div>
			<p className="flex-1 text-sm md:text-base min-w-0 break-words pr-2">
				{message}
			</p>
			<button
				onClick={() => onClose(id)}
				className="ml-2 md:ml-3 p-1 rounded-full hover:bg-gray-200  transition-colors cursor-pointer flex-shrink-0"
			>
				<XIcon className="w-4 h-4" />
			</button>
		</div>
	);
};

const ToastContainer: React.FC<{
	toasts: Toast[];
	onClose: (id: string) => void;
	colors: Theme["colors"];
}> = ({ toasts, onClose, colors }) => {
	return (
		<div className="fixed top-4 right-4 left-4 md:left-auto md:top-6 md:right-6 z-[9999] w-auto md:w-80 flex flex-col items-stretch md:items-end space-y-2">
			{toasts.map((toast) => (
				<ToastNotification
					key={toast.id}
					toast={toast}
					onClose={onClose}
					colors={colors}
				/>
			))}
		</div>
	);
};

const Avatar: React.FC<{
	user: ActivityItem["user"];
	size?: "sm" | "md" | "lg";
	colors: Theme["colors"];
	onClick?: () => void;
}> = ({ user, size = "md", colors, onClick }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isPressed, setIsPressed] = useState(false);
	const [imageLoadError, setImageLoadError] = useState(false);

	const sizeClasses = {
		sm: "w-8 h-8 text-sm",
		md: "w-12 h-12 text-lg",
		lg: "w-16 h-16 text-xl",
	};

	const iconSizes = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	const getGradient = () => {
		const hash = user.name.split("").reduce((acc, char) => {
			return char.charCodeAt(0) + ((acc << 5) - acc);
		}, 0);

		const hue1 = Math.abs(hash % 360);
		const hue2 = (hue1 + 40) % 360;

		return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
	};

	const getInitials = () => {
		return user.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	};

	const isImageUrl = (url: string) => {
		return (
			url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")
		);
	};

	return (
		<div
			className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden group`}
			style={{
				background: getGradient(),
				transform: isPressed
					? "scale(0.95) rotate(0deg)"
					: isHovered
					? "scale(1.1) rotate(5deg)"
					: "scale(1) rotate(0deg)",
				boxShadow: isHovered
					? `0 0 20px ${colors.primary}80`
					: "0 4px 12px rgba(0, 0, 0, 0.15)",
			}}
			title={`${user.name} - Click to view profile`}
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				setIsHovered(false);
				setIsPressed(false);
			}}
			onMouseDown={() => setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.();
				}
			}}
			aria-label={`View ${user.name}'s profile`}
		>
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>

			{isImageUrl(user.avatar) && !imageLoadError ? (
				<img
					src={user.avatar}
					alt={user.name}
					className="w-full h-full object-cover relative z-10 transition-all duration-300 group-hover:scale-110 rounded-full"
					onError={() => setImageLoadError(true)}
					onLoad={() => setImageLoadError(false)}
				/>
			) : (
				<span className="uppercase relative z-10 transition-all duration-300 group-hover:scale-110">
					{getInitials()}
				</span>
			)}

			<div
				className={`absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 animate-ping`}
				style={{ borderColor: "rgba(255, 255, 255, 0.5)" }}
			></div>
		</div>
	);
};

const CommentReplyItem: React.FC<{
	reply: CommentReply;
	colors: Theme["colors"];
	onLike: (replyId: string) => void;
	onAvatarClick: (user: CommentReply["user"]) => void;
	onDelete: (replyId: string) => void;
}> = ({ reply, colors, onLike, onAvatarClick, onDelete }) => {
	const isCurrentUser = reply.user.id === "current-user";

	return (
		<div className="flex space-x-3 mt-3 ml-8">
			<Avatar
				user={reply.user}
				size="sm"
				colors={colors}
				onClick={() => onAvatarClick(reply.user)}
			/>
			<div className="flex-1 min-w-0">
				<div
					className="p-3 rounded-lg border relative"
					style={{
						background: colors.surface,
						borderColor: colors.border,
					}}
				>
					<div className="flex items-center justify-between mb-1">
						<h4 className="text-sm font-medium" style={{ color: colors.text }}>
							{reply.user.name}
						</h4>
						<div className="flex items-center space-x-2">
							<span className="text-xs" style={{ color: colors.textSecondary }}>
								{getRelativeTime(reply.timestamp)}
							</span>
							{isCurrentUser && (
								<button
									onClick={() => onDelete(reply.id)}
									className="p-1 rounded-full transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer"
									style={{
										color: colors.textSecondary,
										background: colors.surface,
									}}
									title="Delete reply"
								>
									<TrashIcon className="w-3 h-3" />
								</button>
							)}
						</div>
					</div>
					<p className="text-sm" style={{ color: colors.text }}>
						{reply.content}
					</p>
				</div>

				<div className="flex items-center space-x-2 mt-2">
					<button
						onClick={() => onLike(reply.id)}
						className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300 hover:scale-105 border cursor-pointer"
						style={{
							background: reply.isLiked ? colors.primary : colors.surface,
							borderColor: reply.isLiked ? colors.primary : colors.border,
							color: reply.isLiked ? "white" : colors.textSecondary,
						}}
					>
						<HeartIcon className="w-3 h-3" filled={reply.isLiked} />
						<span>{reply.likes}</span>
					</button>
				</div>
			</div>
		</div>
	);
};

const CommentItem: React.FC<{
	comment: Comment;
	colors: Theme["colors"];
	onLike: (commentId: string) => void;
	onReply: (commentId: string) => void;
	onReplyLike: (commentId: string, replyId: string) => void;
	onAvatarClick: (user: Comment["user"]) => void;
	onDelete: (commentId: string) => void;
	onReplyDelete: (commentId: string, replyId: string) => void;
	isReplying: boolean;
	replyText: string;
	onReplyTextChange: (text: string) => void;
	onReplySubmit: () => void;
	onReplyCancel: () => void;
}> = ({
	comment,
	colors,
	onLike,
	onReply,
	onReplyLike,
	onAvatarClick,
	onDelete,
	onReplyDelete,
	isReplying,
	replyText,
	onReplyTextChange,
	onReplySubmit,
	onReplyCancel,
}) => {
	const isCurrentUser = comment.user.id === "current-user";

	return (
		<div
			className="border-b pb-4 last:border-b-0 group"
			style={{ borderColor: colors.border }}
		>
			<div className="flex space-x-3">
				<Avatar
					user={comment.user}
					size="sm"
					colors={colors}
					onClick={() => onAvatarClick(comment.user)}
				/>
				<div className="flex-1 min-w-0">
					<div
						className="p-3 rounded-lg border relative"
						style={{
							background: colors.cardGradient,
							borderColor: colors.border,
						}}
					>
						<div className="flex items-center justify-between mb-1">
							<h4
								className="text-sm font-medium"
								style={{ color: colors.text }}
							>
								{comment.user.name}
							</h4>
							<div className="flex items-center space-x-2">
								<span
									className="text-xs"
									style={{ color: colors.textSecondary }}
								>
									{getRelativeTime(comment.timestamp)}
								</span>
								{isCurrentUser && (
									<button
										onClick={() => onDelete(comment.id)}
										className="p-1 rounded-full transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer"
										style={{
											color: colors.textSecondary,
											background: colors.surface,
										}}
										title="Delete comment"
									>
										<TrashIcon className="w-3 h-3" />
									</button>
								)}
							</div>
						</div>
						<p className="text-sm" style={{ color: colors.text }}>
							{comment.content}
						</p>
					</div>

					<div className="flex items-center space-x-3 mt-2">
						<button
							onClick={() => onLike(comment.id)}
							className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300 hover:scale-105 border cursor-pointer"
							style={{
								background: comment.isLiked ? colors.primary : colors.surface,
								borderColor: comment.isLiked ? colors.primary : colors.border,
								color: comment.isLiked ? "white" : colors.textSecondary,
							}}
						>
							<HeartIcon className="w-3 h-3" filled={comment.isLiked} />
							<span>{comment.likes}</span>
						</button>

						<button
							onClick={() => onReply(comment.id)}
							className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300 hover:scale-105 border cursor-pointer"
							style={{
								background: colors.surface,
								borderColor: colors.border,
								color: colors.textSecondary,
							}}
						>
							<MessageIcon className="w-3 h-3" />
							<span>Reply</span>
						</button>
					</div>

					{}
					{isReplying && (
						<div className="mt-3 ml-8">
							<textarea
								value={replyText}
								onChange={(e) => onReplyTextChange(e.target.value)}
								placeholder="Write a reply..."
								className="w-full p-2 text-sm rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all duration-300"
								style={{
									background: colors.surface,
									borderColor: colors.border,
									color: colors.text,
								}}
								rows={2}
								autoFocus
							/>
							<div className="flex space-x-2 mt-2">
								<button
									onClick={onReplySubmit}
									disabled={!replyText.trim()}
									className="px-3 py-1 text-xs rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									style={{
										background: colors.primary,
										color: "white",
									}}
								>
									Send
								</button>
								<button
									onClick={onReplyCancel}
									className="px-3 py-1 text-xs rounded-lg font-medium transition-all duration-300 border cursor-pointer"
									style={{
										background: colors.surface,
										borderColor: colors.border,
										color: colors.text,
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					)}

					{}
					{comment.replies.length > 0 && (
						<div className="mt-3">
							{comment.replies.map((reply) => (
								<CommentReplyItem
									key={reply.id}
									reply={reply}
									colors={colors}
									onLike={(replyId) => onReplyLike(comment.id, replyId)}
									onAvatarClick={onAvatarClick}
									onDelete={(replyId) => onReplyDelete(comment.id, replyId)}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const CommentSection: React.FC<{
	item: ActivityItem;
	colors: Theme["colors"];
	onAvatarClick: (user: ActivityItem["user"]) => void;
	addToast: (message: string, type: Toast["type"]) => void;
	onUpdateActivity: (
		activityId: string,
		updatedActivity: Partial<ActivityItem>
	) => void;
}> = ({ item, colors, onAvatarClick, addToast, onUpdateActivity }) => {
	const [newCommentText, setNewCommentText] = useState("");
	const [replyingToComment, setReplyingToComment] = useState<string | null>(
		null
	);
	const [replyText, setReplyText] = useState("");

	const handleCommentSubmit = () => {
		if (!newCommentText.trim()) return;

		const newComment: Comment = {
			id: `comment-${Date.now()}`,
			user: {
				name: "Current User",
				avatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
				id: "current-user",
			},
			content: newCommentText.trim(),
			timestamp: new Date(),
			likes: 0,
			isLiked: false,
			replies: [],
		};

		const updatedComments = [...item.comments, newComment];
		onUpdateActivity(item.id, {
			comments: updatedComments,
			replies: updatedComments.length,
		});

		setNewCommentText("");
		addToast("Comment posted successfully!", "success");
	};

	const handleCommentLike = (commentId: string) => {
		const updatedComments = item.comments.map((comment) => {
			if (comment.id === commentId) {
				const newIsLiked = !comment.isLiked;
				return {
					...comment,
					isLiked: newIsLiked,
					likes: newIsLiked ? comment.likes + 1 : comment.likes - 1,
				};
			}
			return comment;
		});

		onUpdateActivity(item.id, { comments: updatedComments });
		addToast(
			updatedComments.find((c) => c.id === commentId)?.isLiked
				? "Comment liked!"
				: "Comment unliked",
			"success"
		);
	};

	const handleReplySubmit = () => {
		if (!replyText.trim() || !replyingToComment) return;

		const newReply: CommentReply = {
			id: `reply-${Date.now()}`,
			user: {
				name: "Current User",
				avatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
				id: "current-user",
			},
			content: replyText.trim(),
			timestamp: new Date(),
			likes: 0,
			isLiked: false,
		};

		const updatedComments = item.comments.map((comment) => {
			if (comment.id === replyingToComment) {
				return {
					...comment,
					replies: [...comment.replies, newReply],
				};
			}
			return comment;
		});

		onUpdateActivity(item.id, {
			comments: updatedComments,
			replies: updatedComments.length,
		});

		setReplyText("");
		setReplyingToComment(null);
		addToast("Reply posted successfully!", "success");
	};

	const handleReplyLike = (commentId: string, replyId: string) => {
		const updatedComments = item.comments.map((comment) => {
			if (comment.id === commentId) {
				const updatedReplies = comment.replies.map((reply) => {
					if (reply.id === replyId) {
						const newIsLiked = !reply.isLiked;
						return {
							...reply,
							isLiked: newIsLiked,
							likes: newIsLiked ? reply.likes + 1 : reply.likes - 1,
						};
					}
					return reply;
				});
				return { ...comment, replies: updatedReplies };
			}
			return comment;
		});

		onUpdateActivity(item.id, { comments: updatedComments });
		addToast("Reply liked!", "success");
	};

	const handleCommentDelete = (commentId: string) => {
		const updatedComments = item.comments.filter(
			(comment) => comment.id !== commentId
		);
		onUpdateActivity(item.id, {
			comments: updatedComments,
			replies: updatedComments.length,
		});
		addToast("Comment deleted successfully!", "success");
	};

	const handleReplyDelete = (commentId: string, replyId: string) => {
		const updatedComments = item.comments.map((comment) => {
			if (comment.id === commentId) {
				return {
					...comment,
					replies: comment.replies.filter((reply) => reply.id !== replyId),
				};
			}
			return comment;
		});

		onUpdateActivity(item.id, {
			comments: updatedComments,
			replies: updatedComments.length,
		});
		addToast("Reply deleted successfully!", "success");
	};

	return (
		<div
			className="mt-4 p-4 rounded-lg border"
			style={{
				background: colors.surface,
				borderColor: colors.border,
			}}
		>
			{}
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold" style={{ color: colors.text }}>
					Comments ({item.comments.length})
				</h3>
			</div>

			{}
			<div className="mb-4">
				<textarea
					value={newCommentText}
					onChange={(e) => setNewCommentText(e.target.value)}
					placeholder="Write a comment..."
					className="w-full p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all duration-300"
					style={{
						background: colors.cardGradient,
						borderColor: colors.border,
						color: colors.text,
					}}
					rows={3}
				/>
				<div className="flex justify-end mt-2">
					<button
						onClick={handleCommentSubmit}
						disabled={!newCommentText.trim()}
						className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						style={{
							background: colors.primary,
							color: "white",
						}}
					>
						Post Comment
					</button>
				</div>
			</div>

			{}
			{item.comments.length > 0 ? (
				<div className="space-y-4">
					{item.comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							colors={colors}
							onLike={handleCommentLike}
							onReply={(commentId) => setReplyingToComment(commentId)}
							onReplyLike={handleReplyLike}
							onAvatarClick={onAvatarClick}
							onDelete={handleCommentDelete}
							onReplyDelete={handleReplyDelete}
							isReplying={replyingToComment === comment.id}
							replyText={replyText}
							onReplyTextChange={setReplyText}
							onReplySubmit={handleReplySubmit}
							onReplyCancel={() => {
								setReplyingToComment(null);
								setReplyText("");
							}}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-8">
					<div
						className="w-12 h-12 mx-auto mb-3 opacity-50"
						style={{ color: colors.textSecondary }}
					>
						<MessageIcon className="w-12 h-12" />
					</div>
					<p className="text-sm" style={{ color: colors.textSecondary }}>
						No comments yet. Be the first to comment!
					</p>
				</div>
			)}
		</div>
	);
};

const InfoModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	colors: Theme["colors"];
}> = ({ isOpen, onClose, colors }) => {
	if (!isOpen) return null;

	const features = [
		{
			icon: <RocketIcon className="w-6 h-6" />,
			title: "Real-time Updates",
			description:
				"Stay connected with live activity feeds and instant notifications",
		},
		{
			icon: <StarIcon className="w-6 h-6" />,
			title: "Interactive Timeline",
			description: "Engage with posts through likes, replies, and shares",
		},
		{
			icon: <DiamondIcon className="w-6 h-6" />,
			title: "Responsive Design",
			description: "Optimized for both desktop and mobile experiences",
		},
		{
			icon: <ClipboardIcon className="w-6 h-6" />,
			title: "Keyboard Navigation",
			description: "Full keyboard support for efficient navigation (desktop)",
		},
	];

	const shortcuts = [
		{ key: "↑ / ↓", action: "Navigate timeline items" },
		{ key: "Enter", action: "Expand/collapse item" },
		{ key: "L", action: "Like/unlike post" },
		{ key: "R", action: "Reply to post" },
		{ key: "S", action: "Share post" },
		{ key: "Esc", action: "Clear focus" },
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 backdrop-blur-md transition-opacity duration-300"
				style={{ background: "rgba(0, 0, 0, 0.5)" }}
				onClick={onClose}
			></div>
			<div
				className="relative rounded-2xl shadow-2xl border animate-modalAppear w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto scrollbar-hide"
				style={{
					background: colors.surface,
					borderColor: colors.border,
					boxShadow: `0 0 30px ${colors.primary}50, 0 0 15px ${colors.secondary}30`,
				}}
			>
				<div className="relative">
					<div
						className="h-20 rounded-t-2xl flex items-center justify-center"
						style={{
							background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
						}}
					>
						<div className="text-center">
							<h2 className="text-2xl font-bold text-white">
								Activity Timeline
							</h2>
							<p className="text-white/80 text-sm">Version 1.0.0</p>
						</div>
					</div>

					<button
						onClick={onClose}
						className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-30 text-white transition-all duration-300 hover:bg-opacity-50 hover:scale-110 cursor-pointer"
					>
						<XIcon className="w-5 h-5" />
					</button>
				</div>

				<div className="p-6">
					<div className="mb-6">
						<h3
							className="text-xl font-bold mb-4"
							style={{ color: colors.text }}
						>
							About This App
						</h3>
						<p
							className="text-base leading-relaxed"
							style={{ color: colors.textSecondary }}
						>
							Activity Timeline is a modern, interactive social media timeline
							interface built with React and TypeScript. It features a beautiful
							responsive design, smooth animations, and comprehensive
							accessibility support.
						</p>
					</div>

					<div className="mb-6">
						<h3
							className="text-xl font-bold mb-4"
							style={{ color: colors.text }}
						>
							Key Features
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{features.map((feature, index) => (
								<div
									key={index}
									className="p-3 rounded-xl border transition-all duration-300 hover:scale-105"
									style={{
										background: colors.cardGradient,
										borderColor: colors.border,
									}}
								>
									<div className="flex items-start space-x-3">
										<div style={{ color: colors.primary }}>{feature.icon}</div>
										<div>
											<h4
												className="font-semibold mb-1"
												style={{ color: colors.text }}
											>
												{feature.title}
											</h4>
											<p
												className="text-sm"
												style={{ color: colors.textSecondary }}
											>
												{feature.description}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="mb-6">
						<h3
							className="text-xl font-bold mb-4"
							style={{ color: colors.text }}
						>
							Keyboard Shortcuts (Desktop)
						</h3>
						<div
							className="p-3 rounded-xl border"
							style={{
								background: colors.cardGradient,
								borderColor: colors.border,
							}}
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{shortcuts.map((shortcut, index) => (
									<div
										key={index}
										className="flex items-center justify-between"
									>
										<div className="flex space-x-1">
											{shortcut.key.split(" / ").map((key, keyIndex) => (
												<span
													key={keyIndex}
													className="flex items-center space-x-1"
												>
													{keyIndex > 0 && (
														<span style={{ color: colors.textSecondary }}>
															/
														</span>
													)}
													<kbd
														className="px-2 py-1 text-xs rounded border font-mono"
														style={{
															background: colors.surface,
															borderColor: colors.border,
															color: colors.text,
														}}
													>
														{key.trim()}
													</kbd>
												</span>
											))}
										</div>
										<span
											className="text-sm ml-3"
											style={{ color: colors.textSecondary }}
										>
											{shortcut.action}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="pt-4 border-t" style={{ borderColor: colors.border }}>
						<button
							onClick={onClose}
							className="w-full py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer"
							style={{
								background: colors.primary,
								color: "white",
							}}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const ProfileModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	user: ActivityItem["user"] | null;
	colors: Theme["colors"];
	addToast: (message: string, type: Toast["type"]) => void;
}> = ({ isOpen, onClose, user, colors, addToast }) => {
	const [isFollowing, setIsFollowing] = useState(false);
	const [userStats, setUserStats] = useState<{
		posts: number;
		followers: number;
		following: number;
	} | null>(null);

	const getStats = () => {
		if (!user) return { posts: 0, followers: 0, following: 0 };
		const hash = Number.parseInt(user.id.replace(/\D/g, "") || "0");
		return {
			posts: 50 + (hash % 150),
			followers: 120 + (hash % 880),
			following: 80 + (hash % 220),
		};
	};

	useEffect(() => {
		if (isOpen && user) {
			setUserStats(getStats());
			setIsFollowing(false);
		}
	}, [isOpen, user]);

	const handleFollowToggle = () => {
		if (!userStats) return;

		if (isFollowing) {
			setIsFollowing(false);
			setUserStats((prev) =>
				prev ? { ...prev, followers: prev.followers - 1 } : null
			);
			addToast(`You unfollowed ${user?.name}`, "info");
		} else {
			setIsFollowing(true);
			setUserStats((prev) =>
				prev ? { ...prev, followers: prev.followers + 1 } : null
			);
			addToast(`You are now following ${user?.name}!`, "success");
		}
	};

	if (!isOpen || !user) return null;
	if (!userStats) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-4">
			<div
				className="absolute inset-0 backdrop-blur-md transition-opacity duration-300"
				style={{ background: "rgba(0, 0, 0, 0.5)" }}
				onClick={onClose}
			></div>
			<div
				className="relative rounded-2xl shadow-2xl border animate-modalAppear w-full max-w-sm mx-auto"
				style={{
					background: colors.surface,
					borderColor: colors.border,
					boxShadow: `0 0 30px ${colors.primary}50, 0 0 15px ${colors.secondary}30`,
				}}
			>
				<div className="relative">
					<div
						className="h-16 rounded-t-2xl"
						style={{
							background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
						}}
					></div>

					<button
						onClick={onClose}
						className="absolute top-2 right-2 p-1.5 rounded-full bg-black bg-opacity-30 text-white transition-all duration-300 hover:bg-opacity-50 hover:scale-110 cursor-pointer"
					>
						<XIcon className="w-4 h-4" />
					</button>

					<div className="absolute -bottom-6 left-4">
						<Avatar user={user} size="sm" colors={colors} />
					</div>
				</div>

				<div className="pt-8 p-4 pb-4">
					<h3 className="text-lg font-bold" style={{ color: colors.text }}>
						{user.name}
					</h3>
					<p className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
						@{user.name.toLowerCase().replace(/\s/g, "")}
					</p>

					<p className="mt-2 text-sm" style={{ color: colors.text }}>
						Digital creator and social media enthusiast. Sharing moments and
						connecting with amazing people.
					</p>

					<div className="flex justify-between mt-3">
						<div className="text-center">
							<p className="text-lg font-bold" style={{ color: colors.text }}>
								{userStats.posts}
							</p>
							<p className="text-xs" style={{ color: colors.textSecondary }}>
								Posts
							</p>
						</div>
						<div className="text-center">
							<p className="text-lg font-bold" style={{ color: colors.text }}>
								{userStats.followers}
							</p>
							<p className="text-xs" style={{ color: colors.textSecondary }}>
								Followers
							</p>
						</div>
						<div className="text-center">
							<p className="text-lg font-bold" style={{ color: colors.text }}>
								{userStats.following}
							</p>
							<p className="text-xs" style={{ color: colors.textSecondary }}>
								Following
							</p>
						</div>
					</div>

					<div className="mt-3">
						<button
							onClick={handleFollowToggle}
							className="w-full py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer text-sm"
							style={{
								background: isFollowing ? colors.textSecondary : colors.primary,
								color: "white",
							}}
						>
							{isFollowing ? "Unfollow" : "Follow"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const ShareModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	item: ActivityItem | null;
	colors: Theme["colors"];
	addToast: (message: string, type: Toast["type"]) => void;
}> = ({ isOpen, onClose, item, colors, addToast }) => {
	const [isWebShareSupported, setIsWebShareSupported] = useState(false);

	useEffect(() => {
		setIsWebShareSupported(
			typeof navigator !== "undefined" && "share" in navigator
		);
	}, []);

	if (!isOpen || !item) return null;

	const getShareContent = () => {
		const url = typeof window !== "undefined" ? window.location.href : "";
		const title = `${item.user.name} ${item.action}`;
		const text = `${item.content.substring(0, 100)}${
			item.content.length > 100 ? "..." : ""
		}`;

		return { url, title, text };
	};

	const { url, title, text } = getShareContent();

	const handleWebShare = async () => {
		if (!isWebShareSupported) return;

		try {
			await navigator.share({
				title,
				text,
				url,
			});
			addToast("Shared successfully!", "success");
			onClose();
		} catch (err) {
			if ((err as Error).name !== "AbortError") {
				console.error("Error sharing:", err);
				addToast("Failed to share", "error");
			}
		}
	};

	const shareOptions = [
		...(isWebShareSupported
			? [
					{
						name: "Share via Device",
						icon: <ShareIcon className="w-6 h-6" />,
						color: colors.primary,
						action: handleWebShare,
						description: "Use your device's native share menu",
					},
			  ]
			: []),

		{
			name: "Share on Social Media",
			icon: <ShareIcon className="w-6 h-6" />,
			color: "#1DA1F2",
			action: () => {
				const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
					`${title}\n\n${text}`
				)}&url=${encodeURIComponent(url)}`;
				window.open(twitterUrl, "_blank", "width=550,height=420");
				addToast("Opened social media share dialog", "success");
				onClose();
			},
			description: "Share on social media platforms",
		},

		{
			name: "Share Professionally",
			icon: <ClipboardIcon className="w-6 h-6" />,
			color: "#0077B5",
			action: () => {
				const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
					url
				)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
					text
				)}`;
				window.open(linkedinUrl, "_blank", "width=550,height=420");
				addToast("Opened professional sharing dialog", "success");
				onClose();
			},
			description: "Share on professional networks",
		},

		{
			name: "Share with Friends",
			icon: <UserIcon className="w-6 h-6" />,
			color: "#1877F2",
			action: () => {
				const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					url
				)}&quote=${encodeURIComponent(`${title}\n\n${text}`)}`;
				window.open(facebookUrl, "_blank", "width=550,height=420");
				addToast("Opened Facebook share dialog", "success");
				onClose();
			},
			description: "Share on Facebook",
		},

		{
			name: "Copy Link",
			icon: <ClipboardIcon className="w-6 h-6" />,
			color: colors.accent,
			action: async () => {
				try {
					await navigator.clipboard.writeText(url);
					addToast("Link copied to clipboard!", "success");
					onClose();
				} catch (err) {
					console.error("Failed to copy link:", err);

					const textArea = document.createElement("textarea");
					textArea.value = url;
					document.body.appendChild(textArea);
					textArea.select();
					try {
						document.execCommand("copy");
						addToast("Link copied to clipboard!", "success");
						onClose();
					} catch (fallbackErr) {
						addToast("Failed to copy link", "error");
					}
					document.body.removeChild(textArea);
				}
			},
			description: "Copy link to clipboard",
		},

		{
			name: "Share via Email",
			icon: <EnvelopeIcon className="w-6 h-6" />,
			color: "#EA4335",
			action: () => {
				const subject = encodeURIComponent(title);
				const body = encodeURIComponent(
					`${text}\n\nView full activity: ${url}`
				);
				const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
				window.location.href = mailtoUrl;
				addToast("Email client opened", "info");
				onClose();
			},
			description: "Share via email client",
		},
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 backdrop-blur-md transition-opacity duration-300"
				style={{ background: "rgba(0, 0, 0, 0.5)" }}
				onClick={onClose}
			></div>
			<div
				className="relative rounded-2xl p-4 md:p-6 max-w-md w-full shadow-2xl border animate-modalAppear max-h-[85vh] overflow-y-auto scrollbar-hide"
				style={{
					background: colors.surface,
					borderColor: colors.border,
					boxShadow: `0 0 30px ${colors.primary}50, 0 0 15px ${colors.secondary}30`,
				}}
			>
				<div className="flex items-center justify-between mb-4 md:mb-6">
					<h3
						className="text-lg md:text-xl font-bold"
						style={{ color: colors.text }}
					>
						Share Activity
					</h3>
					<button
						onClick={onClose}
						className="p-1.5 md:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
						style={{ color: colors.textSecondary }}
					>
						<XIcon className="w-4 h-4 md:w-5 md:h-5" />
					</button>
				</div>

				<div
					className="mb-3 md:mb-4 p-2.5 md:p-3 rounded-xl border"
					style={{
						background: colors.cardGradient,
						borderColor: colors.border,
					}}
				>
					<p className="text-sm font-medium" style={{ color: colors.text }}>
						{item.user.name}
					</p>
					<p
						className="text-xs md:text-sm mt-1 line-clamp-2"
						style={{ color: colors.textSecondary }}
					>
						{item.content}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-2 md:gap-3">
					{shareOptions.map((option) => (
						<button
							key={option.name}
							onClick={option.action}
							className="flex items-start space-x-2.5 md:space-x-3 p-2.5 md:p-3 rounded-xl transition-all duration-300 hover:scale-105 border group cursor-pointer text-left"
							style={{
								background: colors.cardGradient,
								borderColor: colors.border,
								color: colors.text,
							}}
						>
							<div
								className="group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mt-0.5"
								style={{ color: option.color }}
							>
								{option.icon}
							</div>
							<div className="flex-1 min-w-0">
								<span className="font-medium text-sm md:text-base block">
									{option.name}
								</span>
								{option.description && (
									<span
										className="text-xs opacity-75 block mt-0.5"
										style={{ color: colors.textSecondary }}
									>
										{option.description}
									</span>
								)}
							</div>
						</button>
					))}
				</div>

				{}
				<div
					className="mt-4 pt-4 border-t"
					style={{ borderColor: colors.border }}
				>
					<p
						className="text-xs font-medium mb-2"
						style={{ color: colors.textSecondary }}
					>
						Share Preview:
					</p>
					<div
						className="p-2 rounded-lg text-xs font-mono break-all"
						style={{
							background: colors.activityBg,
							color: colors.textSecondary,
						}}
					>
						{title}
					</div>
				</div>
			</div>
		</div>
	);
};

const ReplyModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	item: ActivityItem | null;
	colors: Theme["colors"];
	onSubmit: (text: string) => void;
	addToast: (message: string, type: Toast["type"]) => void;
}> = ({ isOpen, onClose, item, colors, onSubmit, addToast }) => {
	const [replyText, setReplyText] = useState("");

	if (!isOpen || !item) return null;

	const handleSubmit = () => {
		if (replyText.trim()) {
			onSubmit(replyText.trim());
			setReplyText("");
			onClose();
			addToast("Reply posted successfully!", "success");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 backdrop-blur-md transition-opacity duration-300"
				style={{ background: "rgba(0, 0, 0, 0.5)" }}
				onClick={onClose}
			></div>
			<div
				className="relative rounded-2xl p-6 max-w-lg w-full shadow-2xl border animate-modalAppear"
				style={{
					background: colors.surface,
					borderColor: colors.border,
					boxShadow: `0 0 30px ${colors.primary}50, 0 0 15px ${colors.secondary}30`,
				}}
			>
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-bold" style={{ color: colors.text }}>
						Reply to {item.user.name}
					</h3>
					<button
						onClick={onClose}
						className="p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
						style={{ color: colors.textSecondary }}
					>
						<XIcon className="w-5 h-5" />
					</button>
				</div>

				<div
					className="mb-4 p-3 rounded-xl border"
					style={{
						background: colors.cardGradient,
						borderColor: colors.border,
					}}
				>
					<div className="flex items-center space-x-3 mb-2">
						<Avatar user={item.user} size="sm" colors={colors} />
						<p className="text-sm font-medium" style={{ color: colors.text }}>
							{item.user.name}
						</p>
					</div>
					<p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
						{item.content}
					</p>
				</div>

				<textarea
					value={replyText}
					onChange={(e) => setReplyText(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Write your reply... (Ctrl+Enter to send)"
					className="w-full p-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all duration-300 modal-scrollbar"
					style={{
						background: colors.surface,
						borderColor: colors.border,
						color: colors.text,
					}}
					rows={4}
					autoFocus
				/>

				<div className="flex space-x-3 mt-4">
					<button
						onClick={handleSubmit}
						disabled={!replyText.trim()}
						className="flex-1 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						style={{
							background: colors.primary,
							color: "white",
						}}
					>
						Send Reply
					</button>
					<button
						onClick={onClose}
						className="px-6 py-2 rounded-xl font-medium transition-all duration-300 border cursor-pointer"
						style={{
							background: colors.surface,
							borderColor: colors.border,
							color: colors.text,
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

const CommentModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	item: ActivityItem | null;
	colors: Theme["colors"];
	onAvatarClick: (user: ActivityItem["user"]) => void;
	addToast: (message: string, type: Toast["type"]) => void;
	onUpdateActivity: (
		activityId: string,
		updatedActivity: Partial<ActivityItem>
	) => void;
}> = ({
	isOpen,
	onClose,
	item,
	colors,
	onAvatarClick,
	addToast,
	onUpdateActivity,
}) => {
	const [newCommentText, setNewCommentText] = useState("");
	const [replyingToComment, setReplyingToComment] = useState<string | null>(
		null
	);
	const [replyText, setReplyText] = useState("");
	const [localComments, setLocalComments] = useState<Comment[]>([]);

	useEffect(() => {
		if (item && isOpen) {
			setLocalComments(item.comments);
		}
	}, [item, isOpen]);

	if (!isOpen || !item) return null;

	const handleCommentSubmit = () => {
		if (!newCommentText.trim()) return;

		const newComment: Comment = {
			id: `comment-${Date.now()}`,
			user: {
				name: "Current User",
				avatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
				id: "current-user",
			},
			content: newCommentText.trim(),
			timestamp: new Date(),
			likes: 0,
			isLiked: false,
			replies: [],
		};

		const updatedComments = [...localComments, newComment];
		setLocalComments(updatedComments);
		onUpdateActivity(item.id, {
			comments: updatedComments,
			replies: updatedComments.length,
		});

		setNewCommentText("");
		addToast("Comment posted successfully!", "success");
	};

	const handleCommentLike = (commentId: string) => {
		const updatedComments = localComments.map((comment) => {
			if (comment.id === commentId) {
				const newIsLiked = !comment.isLiked;
				return {
					...comment,
					isLiked: newIsLiked,
					likes: newIsLiked ? comment.likes + 1 : comment.likes - 1,
				};
			}
			return comment;
		});

		setLocalComments(updatedComments);
		onUpdateActivity(item.id, { comments: updatedComments });
		addToast(
			updatedComments.find((c) => c.id === commentId)?.isLiked
				? "Comment liked!"
				: "Comment unliked",
			"success"
		);
	};

	const handleReplySubmit = () => {
		if (!replyText.trim() || !replyingToComment) return;

		const newReply: CommentReply = {
			id: `reply-${Date.now()}`,
			user: {
				name: "Current User",
				avatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
				id: "current-user",
			},
			content: replyText.trim(),
			timestamp: new Date(),
			likes: 0,
			isLiked: false,
		};

		const updatedComments = localComments.map((comment) => {
			if (comment.id === replyingToComment) {
				return {
					...comment,
					replies: [...comment.replies, newReply],
				};
			}
			return comment;
		});

		setLocalComments(updatedComments);
		onUpdateActivity(item.id, {
			comments: updatedComments,
			replies: updatedComments.length,
		});

		setReplyText("");
		setReplyingToComment(null);
		addToast("Reply posted successfully!", "success");
	};

	const handleReplyLike = (commentId: string, replyId: string) => {
		const updatedComments = localComments.map((comment) => {
			if (comment.id === commentId) {
				const updatedReplies = comment.replies.map((reply) => {
					if (reply.id === replyId) {
						const newIsLiked = !reply.isLiked;
						return {
							...reply,
							isLiked: newIsLiked,
							likes: newIsLiked ? reply.likes + 1 : reply.likes - 1,
						};
					}
					return reply;
				});
				return { ...comment, replies: updatedReplies };
			}
			return comment;
		});

		setLocalComments(updatedComments);
		onUpdateActivity(item.id, { comments: updatedComments });
		addToast("Reply liked!", "success");
	};

	const handleCommentDelete = (commentId: string) => {
		const updatedComments = localComments.filter(
			(comment) => comment.id !== commentId
		);
		setLocalComments(updatedComments);
		onUpdateActivity(item.id, {
			comments: updatedComments,
			replies: updatedComments.length,
		});
		addToast("Comment deleted successfully!", "success");
	};

	const handleReplyDelete = (commentId: string, replyId: string) => {
		const updatedComments = localComments.map((comment) => {
			if (comment.id === commentId) {
				return {
					...comment,
					replies: comment.replies.filter((reply) => reply.id !== replyId),
				};
			}
			return comment;
		});

		setLocalComments(updatedComments);
		onUpdateActivity(item.id, {
			comments: updatedComments,
			replies: updatedComments.length,
		});
		addToast("Reply deleted successfully!", "success");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 backdrop-blur-md transition-opacity duration-300"
				style={{ background: "rgba(0, 0, 0, 0.5)" }}
				onClick={onClose}
			></div>
			<div
				className="relative rounded-2xl shadow-2xl border animate-modalAppear w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden"
				style={{
					background: colors.surface,
					borderColor: colors.border,
					boxShadow: `0 0 30px ${colors.primary}50, 0 0 15px ${colors.secondary}30`,
				}}
			>
				{}
				<div
					className="sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-md"
					style={{
						background: colors.surface + "95",
						borderColor: colors.border,
					}}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Avatar
								user={item.user}
								size="sm"
								colors={colors}
								onClick={() => onAvatarClick(item.user)}
							/>
							<div>
								<h3
									className="text-lg font-bold"
									style={{ color: colors.text }}
								>
									Comments
								</h3>
								<p className="text-sm" style={{ color: colors.textSecondary }}>
									{item.user.name}'s activity • {localComments.length} comments
								</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
							style={{ color: colors.textSecondary }}
						>
							<XIcon className="w-5 h-5" />
						</button>
					</div>
				</div>

				{}
				<div
					className="px-6 py-4 border-b"
					style={{ borderColor: colors.border }}
				>
					<div
						className="p-4 rounded-lg border-l-4"
						style={{
							background: colors.activityBg,
							borderLeftColor: colors.primary,
						}}
					>
						<p
							className="font-medium mb-1 text-sm"
							style={{ color: colors.text }}
						>
							{item.action}
						</p>
						<p
							className="text-sm line-clamp-2"
							style={{ color: colors.textSecondary }}
						>
							{item.content}
						</p>
					</div>
				</div>

				{}
				<div className="flex flex-col h-full max-h-[calc(85vh-200px)]">
					{}
					<div
						className="px-6 py-3 border-b"
						style={{ borderColor: colors.border }}
					>
						<div className="flex space-x-3 items-stretch">
							<div className="flex-1">
								<textarea
									value={newCommentText}
									onChange={(e) => setNewCommentText(e.target.value)}
									placeholder="Write a comment..."
									className="w-full p-2 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all duration-300 text-sm h-10"
									style={{
										background: colors.cardGradient,
										borderColor: colors.border,
										color: colors.text,
										minHeight: "40px",
										maxHeight: "40px",
									}}
								/>
							</div>
							<button
								onClick={handleCommentSubmit}
								disabled={!newCommentText.trim()}
								className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap h-10 cursor-pointer"
								style={{
									background: colors.primary,
									color: "white",
									minHeight: "40px",
									maxHeight: "40px",
								}}
							>
								Post
							</button>
						</div>
					</div>

					{}
					<div className="flex-1 overflow-y-auto modal-scrollbar px-6 py-4">
						{localComments.length > 0 ? (
							<div className="space-y-4">
								{localComments.map((comment) => (
									<CommentItem
										key={comment.id}
										comment={comment}
										colors={colors}
										onLike={handleCommentLike}
										onReply={(commentId) => setReplyingToComment(commentId)}
										onReplyLike={handleReplyLike}
										onAvatarClick={onAvatarClick}
										onDelete={handleCommentDelete}
										onReplyDelete={handleReplyDelete}
										isReplying={replyingToComment === comment.id}
										replyText={replyText}
										onReplyTextChange={setReplyText}
										onReplySubmit={handleReplySubmit}
										onReplyCancel={() => {
											setReplyingToComment(null);
											setReplyText("");
										}}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div
									className="w-16 h-16 mx-auto mb-4 opacity-50"
									style={{ color: colors.textSecondary }}
								>
									<MessageIcon className="w-16 h-16" />
								</div>
								<h4
									className="text-lg font-medium mb-2"
									style={{ color: colors.text }}
								>
									No comments yet
								</h4>
								<p className="text-sm" style={{ color: colors.textSecondary }}>
									Be the first to share your thoughts!
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const FullScreenCardDetail: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	item: ActivityItem | null;
	colors: Theme["colors"];
	onLike: (id: string) => void;
	onReply: (id: string) => void;
	onShare: (id: string) => void;
	onAvatarClick: (user: ActivityItem["user"]) => void;
	onUpdateActivity: (
		activityId: string,
		updatedActivity: Partial<ActivityItem>
	) => void;
	addToast: (message: string, type: Toast["type"]) => void;
}> = ({
	isOpen,
	onClose,
	item,
	colors,
	onLike,
	onReply,
	onShare,
	onAvatarClick,
	onUpdateActivity,
	addToast,
}) => {
	const [showComments, setShowComments] = useState(false);
	const [touchStartY, setTouchStartY] = useState<number | null>(null);

	if (!isOpen || !item) return null;

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStartY(e.touches[0].clientY);
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!touchStartY) return;

		const touchEndY = e.changedTouches[0].clientY;
		const deltaY = touchStartY - touchEndY;

		if (deltaY < -100) {
			onClose();
		}

		setTouchStartY(null);
	};

	return (
		<div
			className={`fixed inset-0 z-[60] bg-black transition-all duration-500 ${
				isOpen ? "translate-x-0" : "translate-x-full"
			}`}
			style={{ background: colors.background }}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{}
			<div
				className="sticky top-0 z-10 px-4 py-3 border-b backdrop-blur-md"
				style={{
					background: colors.surface + "95",
					borderColor: colors.border,
				}}
			>
				<div className="flex items-center justify-between">
					<button
						onClick={onClose}
						className="p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
						style={{ color: colors.textSecondary }}
					>
						<XIcon className="w-6 h-6" />
					</button>
					<h2 className="text-lg font-semibold" style={{ color: colors.text }}>
						Activity Details
					</h2>
					<div className="w-10" /> {}
				</div>
			</div>

			{}
			<div
				className="flex-1 h-[calc(100vh-80px)] overflow-y-auto mobile-scrollbar-hide"
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<div className="p-4 space-y-6 pb-8">
					{}
					<div className="flex items-center space-x-4">
						<Avatar
							user={item.user}
							colors={colors}
							onClick={() => onAvatarClick(item.user)}
							size="lg"
						/>
						<div className="flex-1">
							<h3 className="text-xl font-bold" style={{ color: colors.text }}>
								{item.user.name}
							</h3>
							<div className="flex items-center space-x-2 mt-1">
								<ClockIcon
									className="w-4 h-4"
									style={{ color: colors.textSecondary }}
								/>
								<span
									className="text-sm"
									style={{ color: colors.textSecondary }}
								>
									{getRelativeTime(item.timestamp)}
								</span>
							</div>
						</div>
					</div>

					{}
					<div
						className="p-4 rounded-xl border-l-4"
						style={{
							background: colors.activityBg,
							borderLeftColor: colors.primary,
						}}
					>
						<p
							className="font-semibold mb-2 text-lg"
							style={{ color: colors.text }}
						>
							{item.action}
						</p>
						<p
							className="text-base leading-relaxed"
							style={{
								color: colors.text,
								lineHeight: "1.6",
							}}
						>
							{item.content}
						</p>
					</div>

					{}
					{item.expandedContent && (
						<div
							className="p-4 rounded-xl border"
							style={{
								background: colors.surface,
								borderColor: colors.border,
							}}
						>
							<div className="flex items-center space-x-2 mb-3">
								<div
									className="p-2 rounded-lg"
									style={{ background: colors.primary + "20" }}
								>
									<HistoryIcon
										className="w-5 h-5"
										style={{ color: colors.primary }}
									/>
								</div>
								<span
									className="font-semibold"
									style={{ color: colors.primary }}
								>
									Additional Details
								</span>
							</div>
							<p
								className="text-base leading-relaxed"
								style={{
									color: colors.text,
									lineHeight: "1.6",
								}}
							>
								{item.expandedContent}
							</p>
						</div>
					)}

					{}
					<div
						className="p-4 rounded-xl border"
						style={{
							background: colors.surface,
							borderColor: colors.border,
						}}
					>
						<h4
							className="font-semibold mb-4 text-center"
							style={{ color: colors.text }}
						>
							Activity Metrics
						</h4>
						<div className="grid grid-cols-2 gap-4">
							<div
								className="text-center p-4 rounded-lg border"
								style={{
									background: colors.cardGradient,
									borderColor: colors.border,
								}}
							>
								<div className="flex items-center justify-center mb-2">
									<div style={{ color: colors.primary }}>
										<HeartIcon className="w-6 h-6" />
									</div>
								</div>
								<p
									className="text-2xl font-bold mb-1"
									style={{ color: colors.text }}
								>
									{item.likes}
								</p>
								<p
									className="text-sm font-medium"
									style={{ color: colors.textSecondary }}
								>
									Likes
								</p>
							</div>
							<div
								className="text-center p-4 rounded-lg border"
								style={{
									background: colors.cardGradient,
									borderColor: colors.border,
								}}
							>
								<div className="flex items-center justify-center mb-2">
									<div style={{ color: colors.secondary }}>
										<MessageIcon className="w-6 h-6" />
									</div>
								</div>
								<p
									className="text-2xl font-bold mb-1"
									style={{ color: colors.text }}
								>
									{item.replies}
								</p>
								<p
									className="text-sm font-medium"
									style={{ color: colors.textSecondary }}
								>
									Comments
								</p>
							</div>
						</div>
					</div>

					{}
					<div className="space-y-3">
						<button
							onClick={() => onLike(item.id)}
							className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl text-base font-semibold transition-all duration-300 border shadow-sm active:scale-95"
							style={{
								background: item.isLiked
									? `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`
									: colors.surface,
								borderColor: item.isLiked ? colors.primary : colors.border,
								color: item.isLiked ? "white" : colors.text,
								minHeight: "56px",
							}}
						>
							<HeartIcon className="w-6 h-6" filled={item.isLiked} />
							<span>{item.isLiked ? "Unlike Post" : "Like Post"}</span>
							<span
								className="px-3 py-1 rounded-full text-sm font-bold"
								style={{
									background: item.isLiked
										? "rgba(255,255,255,0.2)"
										: colors.primary + "20",
									color: item.isLiked ? "white" : colors.primary,
								}}
							>
								{item.likes}
							</span>
						</button>

						<button
							onClick={() => setShowComments(!showComments)}
							className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl text-base font-semibold transition-all duration-300 border shadow-sm active:scale-95"
							style={{
								background: showComments
									? colors.secondary + "10"
									: colors.surface,
								borderColor: showComments ? colors.secondary : colors.border,
								color: colors.text,
								minHeight: "56px",
							}}
						>
							<div style={{ color: colors.secondary }}>
								<MessageIcon className="w-6 h-6" />
							</div>
							<span>{showComments ? "Hide Comments" : "View Comments"}</span>
							<span
								className="px-3 py-1 rounded-full text-sm font-bold"
								style={{
									background: colors.secondary + "20",
									color: colors.secondary,
								}}
							>
								{item.replies}
							</span>
						</button>
					</div>

					{}
					{showComments && (
						<div className="mt-6">
							<CommentSection
								item={item}
								colors={colors}
								onAvatarClick={onAvatarClick}
								addToast={addToast}
								onUpdateActivity={onUpdateActivity}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const ActionButtons: React.FC<{
	item: ActivityItem;
	onLike: (id: string) => void;
	onReply: (id: string) => void;
	onShare: (id: string) => void;
	colors: Theme["colors"];
	isMobile?: boolean;
}> = ({ item, onLike, onReply, onShare, colors, isMobile = false }) => (
	<div
		className={`flex items-center ${
			isMobile ? "space-x-2 mt-3" : "space-x-3 mt-4"
		}`}
	>
		<button
			onClick={(e) => {
				e.stopPropagation();
				onLike(item.id);
			}}
			className={`flex items-center justify-center space-x-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border group cursor-pointer ${
				isMobile ? "w-16 h-8" : "px-4 py-2"
			}`}
			style={{
				background: item.isLiked
					? `linear-gradient(135deg, #EF4444, #F87171)`
					: colors.surface,
				borderColor: item.isLiked ? "#EF4444" : colors.border,
				color: item.isLiked ? "white" : colors.text,
			}}
			aria-label={`${item.isLiked ? "Unlike" : "Like"} this post`}
		>
			<HeartIcon
				className={`group-hover:animate-pulse ${
					isMobile ? "w-3 h-3" : "w-4 h-4"
				}`}
				filled={item.isLiked}
			/>
			<span className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
				{item.likes}
			</span>
		</button>

		<button
			onClick={(e) => {
				e.stopPropagation();
				onReply(item.id);
			}}
			className={`flex items-center justify-center space-x-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border group cursor-pointer ${
				isMobile ? "w-16 h-8" : "px-4 py-2"
			}`}
			style={{
				background: colors.surface,
				borderColor: colors.border,
				color: colors.secondary,
			}}
			aria-label="Reply to this post"
		>
			<MessageIcon
				className={`group-hover:animate-bounce ${
					isMobile ? "w-3 h-3" : "w-4 h-4"
				}`}
			/>
			<span className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
				{item.replies}
			</span>
		</button>

		<button
			onClick={(e) => {
				e.stopPropagation();
				onShare(item.id);
			}}
			className={`flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border group cursor-pointer ${
				isMobile ? "w-16 h-8" : "px-4 py-2 space-x-2"
			}`}
			style={{
				background: colors.surface,
				borderColor: colors.border,
				color: colors.accent,
			}}
			aria-label="Share this post"
		>
			<ShareIcon
				className={`group-hover:animate-spin ${
					isMobile ? "w-3 h-3" : "w-4 h-4"
				}`}
			/>
			{!isMobile && <span className="font-medium text-sm">Share</span>}
		</button>
	</div>
);

const TimelineItem: React.FC<{
	item: ActivityItem;
	isExpanded: boolean;
	onToggleExpand: (id: string) => void;
	onLike: (id: string) => void;
	onReply: (id: string) => void;
	onShare: (id: string) => void;
	onAvatarClick: (user: ActivityItem["user"]) => void;
	isMobile: boolean;
	colors: Theme["colors"];
	index: number;
	isFocused?: boolean;
	onUpdateActivity: (
		activityId: string,
		updatedActivity: Partial<ActivityItem>
	) => void;
	addToast: (message: string, type: Toast["type"]) => void;
	onCardTap?: (cardId: string, e: React.MouseEvent) => void;
	isDragging?: boolean;
	isCurrentCard?: boolean;
}> = ({
	item,
	isExpanded,
	onToggleExpand,
	onLike,
	onReply,
	onShare,
	onAvatarClick,
	isMobile,
	colors,
	index,
	isFocused,
	onUpdateActivity,
	addToast,
	onCardTap,
	isDragging = false,
	isCurrentCard = false,
}) => {
	const [showComments, setShowComments] = useState(false);

	const handleReplyClick = () => {
		setShowComments(true);
	};

	const handleCardClick = (e: React.MouseEvent) => {
		if (!isMobile || !onCardTap) return;

		const target = e.target as HTMLElement;
		const isButton = target.closest("button") !== null;

		if (isButton) {
			return;
		}

		onCardTap(item.id, e);
	};

	return (
		<div
			className={`relative ${
				isMobile ? "w-[calc(100vw-2rem)] max-w-sm flex-shrink-0" : "w-full"
			}`}
		>
			{}
			{!isMobile && (
				<div className="absolute left-4 top-0 bottom-0 flex flex-col items-center">
					{}
					<div
						className="w-0.5 flex-1"
						style={{ background: colors.timelineLine }}
					/>
					{}
					<div
						className={`w-3 h-3 rounded-full border-2 bg-white z-10 transition-all duration-300 ${
							isFocused ? "scale-150 shadow-lg" : ""
						}`}
						style={{
							borderColor: colors.timelineDot,
							boxShadow: isFocused
								? `0 0 15px ${colors.timelineDot}50`
								: undefined,
						}}
					/>
					{}
					<div
						className="w-0.5 flex-1"
						style={{ background: colors.timelineLine }}
					/>
				</div>
			)}

			{}
			<div
				className={`
          timeline-card relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 backdrop-blur-md border group overflow-hidden
          ${isMobile ? "p-4 ml-0" : "p-6 ml-12"}
          ${isFocused ? "scale-[1.02] shadow-xl" : "hover:scale-[1.01]"}
          ${isMobile && isDragging ? "scale-95" : ""}
          ${isMobile && isExpanded ? "scale-[1.01] shadow-2xl" : ""}
          hover:border-blue-500
    `}
				style={{
					background:
						isExpanded && isMobile
							? `linear-gradient(145deg, ${colors.cardGradient}, ${colors.surface})`
							: colors.cardGradient,
					borderColor: isFocused ? colors.primary : colors.border,
					borderWidth: "1px",
					animationDelay: `${index * 100}ms`,
					boxShadow: isFocused
						? `0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px ${colors.primary}20`
						: undefined,
					cursor: isMobile ? "pointer" : "default",
					userSelect: isMobile ? "none" : "auto",
					touchAction: isMobile ? "manipulation" : "auto",
				}}
				tabIndex={isFocused ? 0 : -1}
				onClick={handleCardClick}
			>
				{}
				<div
					className="absolute top-4 right-4 p-2 rounded-full"
					style={{ background: colors.activityBg }}
				>
					<ActivityIcon className="w-4 h-4" style={{ color: colors.primary }} />
				</div>

				{}
				{isMobile && (
					<div
						className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 ${
							isExpanded ? "rotate-180" : ""
						}`}
						style={{
							background: colors.primary + "20",
							color: colors.primary,
						}}
					>
						<ChevronDownIcon className="w-4 h-4" />
					</div>
				)}

				{}
				<div className="flex items-start space-x-4 mb-4">
					<Avatar
						user={item.user}
						colors={colors}
						onClick={() => onAvatarClick(item.user)}
						size={isMobile ? "sm" : "md"}
					/>

					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between mb-2">
							<div>
								<h3
									className={`font-semibold truncate ${
										isMobile ? "text-base" : "text-lg"
									}`}
									style={{ color: colors.text }}
								>
									{item.user.name}
								</h3>
								<div className="flex items-center space-x-2 mt-1">
									<ClockIcon
										className="w-3 h-3"
										style={{ color: colors.textSecondary }}
									/>
									<span
										className={`font-medium ${
											isMobile ? "text-xs" : "text-sm"
										}`}
										style={{ color: colors.textSecondary }}
									>
										{getRelativeTime(item.timestamp)}
									</span>
								</div>
							</div>
						</div>

						{}
						<div
							className={`p-3 rounded-lg border-l-4 ${
								isMobile ? "text-sm" : "text-base"
							}`}
							style={{
								background: colors.activityBg,
								borderLeftColor: colors.primary,
							}}
						>
							<p className="font-medium mb-1" style={{ color: colors.text }}>
								{item.action}
							</p>
							<p className="text-sm" style={{ color: colors.textSecondary }}>
								{item.content}
							</p>
						</div>

						{}
						{!isMobile && item.expandedContent && (
							<>
								<button
									onClick={() => onToggleExpand(item.id)}
									className="flex items-center space-x-2 mt-3 px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 border cursor-pointer text-sm"
									style={{
										background: colors.surface,
										borderColor: colors.border,
										color: colors.primary,
									}}
								>
									{isExpanded ? (
										<>
											<ChevronUpIcon className="w-4 h-4" />
											<span className="font-medium">Show less details</span>
										</>
									) : (
										<>
											<ChevronDownIcon className="w-4 h-4" />
											<span className="font-medium">Show more details</span>
										</>
									)}
								</button>

								<div
									className={`overflow-hidden transition-all duration-500 ${
										isExpanded
											? "max-h-96 opacity-100 mt-3"
											: "max-h-0 opacity-0"
									}`}
								>
									<div
										className="p-4 rounded-lg border"
										style={{
											background: colors.surface,
											borderColor: colors.border,
										}}
									>
										<div className="flex items-center space-x-2 mb-2">
											<HistoryIcon
												className="w-4 h-4"
												style={{ color: colors.primary }}
											/>
											<span
												className="font-medium text-sm"
												style={{ color: colors.primary }}
											>
												Additional Details
											</span>
										</div>
										<p className="text-sm" style={{ color: colors.text }}>
											{item.expandedContent}
										</p>
									</div>
								</div>
							</>
						)}

						<ActionButtons
							item={item}
							onLike={onLike}
							onReply={onReply}
							onShare={onShare}
							colors={colors}
							isMobile={isMobile}
						/>

						{}
						{isMobile && isExpanded && (
							<div className="mt-6 space-y-4 animate-fadeInUp">
								{}
								{item.expandedContent && (
									<div
										className="p-4 rounded-xl border-l-4 shadow-sm"
										style={{
											background: `linear-gradient(145deg, ${colors.surface}, ${colors.cardGradient})`,
											borderLeft: `4px solid ${colors.primary}`,
											borderRight: `1px solid ${colors.border}`,
											borderTop: `1px solid ${colors.border}`,
											borderBottom: `1px solid ${colors.border}`,
										}}
									>
										<div className="flex items-center space-x-2 mb-3">
											<div
												className="p-1.5 rounded-lg"
												style={{ background: colors.primary + "20" }}
											>
												<HistoryIcon
													className="w-4 h-4"
													style={{ color: colors.primary }}
												/>
											</div>
											<span
												className="font-semibold text-sm"
												style={{ color: colors.primary }}
											>
												Detailed Information
											</span>
										</div>
										<p
											className="text-sm leading-relaxed text-justify"
											style={{
												color: colors.text,
												lineHeight: "1.6",
												wordWrap: "break-word",
												overflowWrap: "break-word",
												hyphens: "auto",
											}}
										>
											{item.expandedContent}
										</p>
									</div>
								)}

								{}
								<div
									className="p-4 rounded-xl border shadow-sm"
									style={{
										background: `linear-gradient(145deg, ${colors.activityBg}, ${colors.surface})`,
										borderColor: colors.border,
									}}
								>
									<div className="text-center mb-3">
										<h4
											className="font-semibold text-sm"
											style={{ color: colors.text }}
										>
											Activity Metrics
										</h4>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div
											className="text-center p-3 rounded-lg border"
											style={{
												background: colors.surface,
												borderColor: colors.border + "60",
											}}
										>
											<div className="flex items-center justify-center mb-2">
												<div style={{ color: colors.primary }}>
													<HeartIcon className="w-5 h-5 mr-1" />
												</div>
											</div>
											<p
												className="text-xl font-bold mb-1"
												style={{ color: colors.text }}
											>
												{item.likes}
											</p>
											<p
												className="text-xs font-medium"
												style={{ color: colors.textSecondary }}
											>
												Likes
											</p>
										</div>
										<div
											className="text-center p-3 rounded-lg border"
											style={{
												background: colors.surface,
												borderColor: colors.border + "60",
											}}
										>
											<div className="flex items-center justify-center mb-2">
												<div style={{ color: colors.secondary }}>
													<MessageIcon className="w-5 h-5 mr-1" />
												</div>
											</div>
											<p
												className="text-xl font-bold mb-1"
												style={{ color: colors.text }}
											>
												{item.replies}
											</p>
											<p
												className="text-xs font-medium"
												style={{ color: colors.textSecondary }}
											>
												Comments
											</p>
										</div>
									</div>
								</div>

								{}
								<div
									className="p-4 rounded-xl border shadow-sm"
									style={{
										background: colors.surface,
										borderColor: colors.border,
									}}
								>
									<div className="text-center mb-3">
										<h4
											className="font-semibold text-sm"
											style={{ color: colors.text }}
										>
											Quick Actions
										</h4>
									</div>
									<div className="grid grid-cols-1 gap-3">
										<button
											onClick={(e) => {
												e.stopPropagation();
												onLike(item.id);
											}}
											className="flex items-center justify-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border shadow-sm active:scale-95"
											style={{
												background: item.isLiked
													? `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`
													: colors.surface,
												borderColor: item.isLiked
													? colors.primary
													: colors.border,
												color: item.isLiked ? "white" : colors.text,
												minHeight: "48px",
											}}
										>
											<HeartIcon className="w-5 h-5" filled={item.isLiked} />
											<span>{item.isLiked ? "Unlike Post" : "Like Post"}</span>
											<span
												className="px-2 py-1 rounded-full text-xs font-bold"
												style={{
													background: item.isLiked
														? "rgba(255,255,255,0.2)"
														: colors.primary + "20",
													color: item.isLiked ? "white" : colors.primary,
												}}
											>
												{item.likes}
											</span>
										</button>

										<button
											onClick={(e) => {
												e.stopPropagation();
												onReply(item.id);
											}}
											className="flex items-center justify-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border shadow-sm active:scale-95"
											style={{
												background: colors.surface,
												borderColor: colors.border,
												color: colors.text,
												minHeight: "48px",
											}}
										>
											<div style={{ color: colors.secondary }}>
												<MessageIcon className="w-5 h-5" />
											</div>
											<span>Add Comment</span>
											<span
												className="px-2 py-1 rounded-full text-xs font-bold"
												style={{
													background: colors.secondary + "20",
													color: colors.secondary,
												}}
											>
												{item.replies}
											</span>
										</button>

										<button
											onClick={(e) => {
												e.stopPropagation();
												onShare(item.id);
											}}
											className="flex items-center justify-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border shadow-sm active:scale-95"
											style={{
												background: colors.surface,
												borderColor: colors.border,
												color: colors.text,
												minHeight: "48px",
											}}
										>
											<div style={{ color: colors.accent }}>
												<ShareIcon className="w-5 h-5" />
											</div>
											<span>Share Post</span>
										</button>
									</div>
								</div>

								{}
								<div
									className="p-4 rounded-xl border-2 border-dashed opacity-90"
									style={{
										background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)`,
										borderColor: colors.primary + "30",
									}}
								>
									<div className="text-center">
										<div className="flex items-center justify-center mb-2">
											<div
												className="p-2 rounded-full"
												style={{ background: colors.primary + "20" }}
											>
												<div style={{ color: colors.primary }}>
													<ActivityIcon className="w-4 h-4" />
												</div>
											</div>
										</div>
										<p
											className="text-xs font-medium mb-1"
											style={{ color: colors.textSecondary }}
										>
											Posted {getRelativeTime(item.timestamp)}
										</p>
										<p
											className="text-xs"
											style={{ color: colors.textSecondary }}
										>
											Tap the card again to collapse this view
										</p>
									</div>
								</div>
							</div>
						)}

						{}
						{showComments && (
							<div className="mt-4">
								<div className="flex items-center justify-between mb-3">
									<button
										onClick={() => setShowComments(false)}
										className="flex items-center space-x-2 text-sm transition-all duration-300 hover:scale-105"
										style={{ color: colors.textSecondary }}
									>
										<ChevronUpIcon className="w-4 h-4" />
										<span>Hide Comments</span>
									</button>
								</div>
								<CommentSection
									item={item}
									colors={colors}
									onAvatarClick={onAvatarClick}
									addToast={addToast}
									onUpdateActivity={onUpdateActivity}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const sortActivitiesByTimestamp = (
	activities: ActivityItem[]
): ActivityItem[] => {
	return [...activities].sort((a, b) => {
		const dateA =
			a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
		const dateB =
			b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);

		return dateB.getTime() - dateA.getTime();
	});
};

const ActivityTimeline: React.FC<{
	colors: Theme["colors"];
}> = ({ colors }) => {
	const [activities, setActivities] = useState<ActivityItem[]>([]);
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);

	const [shareModalOpen, setShareModalOpen] = useState(false);
	const [shareItem, setShareItem] = useState<ActivityItem | null>(null);
	const [replyModalOpen, setReplyModalOpen] = useState(false);
	const [replyItem, setReplyItem] = useState<ActivityItem | null>(null);
	const [profileModalOpen, setProfileModalOpen] = useState(false);
	const [profileUser, setProfileUser] = useState<ActivityItem["user"] | null>(
		null
	);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [commentModalOpen, setCommentModalOpen] = useState(false);
	const [commentItem, setCommentItem] = useState<ActivityItem | null>(null);

	const [toasts, setToasts] = useState<Toast[]>([]);

	const [focusedItemIndex, setFocusedItemIndex] = useState(-1);

	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [touchStart, setTouchStart] = useState<{
		x: number;
		y: number;
		time: number;
	} | null>(null);
	const [touchEnd, setTouchEnd] = useState<{
		x: number;
		y: number;
		time: number;
	} | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState(0);
	const [expandedMobileCards, setExpandedMobileCards] = useState<Set<string>>(
		new Set()
	);

	const [fullScreenCardId, setFullScreenCardId] = useState<string | null>(null);
	const [isFullScreenTransitioning, setIsFullScreenTransitioning] =
		useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const initialActivities = generateMockData(10);
		setActivities(sortActivitiesByTimestamp(initialActivities));
	}, []);

	const addToast = useCallback(
		(message: string, type: Toast["type"] = "info") => {
			setToasts((prev) => {
				const exists = prev.some((toast) => toast.message === message);
				if (exists) {
					return prev;
				}

				const id = `toast-${Date.now()}`;
				return [...prev, { id, message, type }];
			});
		},
		[]
	);

	const loadMoreData = useCallback(async () => {
		if (loading || !hasMore) return;

		setLoading(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setActivities((prev) => {
				const newData = generateMockData(5, prev.length);
				const updatedActivities = [...prev, ...newData];

				if (updatedActivities.length >= 50) {
					setHasMore(false);
				}

				return sortActivitiesByTimestamp(updatedActivities);
			});
		} catch (error) {
			console.error("Error loading more data:", error);
			addToast("Failed to load more activities", "error");
		} finally {
			setLoading(false);
		}
	}, [loading, hasMore, addToast]);

	useEffect(() => {
		if (!loadMoreRef.current || !hasMore || loading) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && hasMore) {
					loadMoreData();
				}
			},
			{ threshold: 0.1, rootMargin: "100px" }
		);

		const currentRef = loadMoreRef.current;
		observer.observe(currentRef);

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
			observer.disconnect();
		};
	}, [loadMoreData, hasMore, loading]);

	useEffect(() => {
		const isModalOpen =
			shareModalOpen ||
			replyModalOpen ||
			profileModalOpen ||
			infoModalOpen ||
			commentModalOpen ||
			!!fullScreenCardId;

		if (isModalOpen) {
			document.body.style.overflow = "hidden";
			document.body.classList.add("modal-open");
		} else {
			document.body.style.overflow = "";
			document.body.classList.remove("modal-open");
		}

		return () => {
			document.body.style.overflow = "";
			document.body.classList.remove("modal-open");
		};
	}, [
		shareModalOpen,
		replyModalOpen,
		profileModalOpen,
		infoModalOpen,
		commentModalOpen,
		fullScreenCardId,
	]);

	const toggleExpand = (id: string) => {
		setExpandedItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	const handleLike = useCallback(
		(id: string) => {
			setActivities((prev) => {
				const updatedActivities = prev.map((item) => {
					if (item.id === id) {
						const newIsLiked = !item.isLiked;
						const newLikes = newIsLiked ? item.likes + 1 : item.likes - 1;

						if (newIsLiked) {
							addToast(`You liked ${item.user.name}'s activity`, "success");
						} else {
							addToast(`You disliked ${item.user.name}'s activity`, "info");
						}

						return { ...item, isLiked: newIsLiked, likes: newLikes };
					}
					return item;
				});

				return sortActivitiesByTimestamp(updatedActivities);
			});
		},
		[addToast]
	);

	const handleShare = (id: string) => {
		const item = activities.find((a) => a.id === id);
		if (item) {
			setShareItem(item);
			setShareModalOpen(true);
		}
	};

	const handleReply = (id: string) => {
		const item = activities.find((a) => a.id === id);
		if (item) {
			setCommentItem(item);
			setCommentModalOpen(true);
		}
	};

	const handleReplySubmit = (text: string) => {
		if (replyItem) {
			setActivities((prev) => {
				const updatedActivities = prev.map((item) =>
					item.id === replyItem.id
						? { ...item, replies: item.replies + 1 }
						: item
				);

				return sortActivitiesByTimestamp(updatedActivities);
			});
		}
	};

	const handleAvatarClick = (user: ActivityItem["user"]) => {
		setProfileUser(user);
		setProfileModalOpen(true);
	};

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	const onUpdateActivity = (
		activityId: string,
		updatedActivity: Partial<ActivityItem>
	) => {
		setActivities((prev) => {
			const updatedActivities = prev.map((item) =>
				item.id === activityId ? { ...item, ...updatedActivity } : item
			);

			return sortActivitiesByTimestamp(updatedActivities);
		});
	};

	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			if (!isMobile) return;

			const touch = e.touches[0];
			setTouchStart({
				x: touch.clientX,
				y: touch.clientY,
				time: Date.now(),
			});
			setTouchEnd(null);
			setIsDragging(false);
			setDragOffset(0);
		},
		[isMobile]
	);

	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!isMobile || !touchStart) return;

			const touch = e.touches[0];
			const deltaX = touch.clientX - touchStart.x;
			const deltaY = touch.clientY - touchStart.y;

			if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
				e.preventDefault();
				setIsDragging(true);
				setDragOffset(deltaX);
			}
		},
		[isMobile, touchStart]
	);

	const handleTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			if (!isMobile || !touchStart) return;

			const touch = e.changedTouches[0];
			const endTime = Date.now();
			const deltaX = touch.clientX - touchStart.x;
			const deltaY = touch.clientY - touchStart.y;
			const deltaTime = endTime - touchStart.time;
			const isSwipe = Math.abs(deltaX) > 50 && deltaTime < 300;

			setTouchEnd({
				x: touch.clientX,
				y: touch.clientY,
				time: endTime,
			});

			setIsDragging(false);
			setDragOffset(0);

			if (isSwipe && Math.abs(deltaX) > Math.abs(deltaY)) {
				const isSwipeLeft = deltaX < 0;
				const isSwipeRight = deltaX > 0;

				if (isSwipeLeft && currentCardIndex < activities.length - 1) {
					const newIndex = currentCardIndex + 1;
					setCurrentCardIndex(newIndex);
					scrollToCard(newIndex);
					addToast(`Card ${newIndex + 1} of ${activities.length}`, "info");
				} else if (isSwipeRight && currentCardIndex > 0) {
					const newIndex = currentCardIndex - 1;
					setCurrentCardIndex(newIndex);
					scrollToCard(newIndex);
					addToast(`Card ${newIndex + 1} of ${activities.length}`, "info");
				} else if (
					(isSwipeLeft && currentCardIndex >= activities.length - 1) ||
					(isSwipeRight && currentCardIndex <= 0)
				) {
					addToast(
						currentCardIndex <= 0
							? "This is the first card"
							: "This is the last card",
						"info"
					);
				}
			}

			setTouchStart(null);
		},
		[isMobile, touchStart, currentCardIndex, activities.length, addToast]
	);

	const scrollToCard = useCallback((index: number) => {
		if (!scrollContainerRef.current) return;

		const container = scrollContainerRef.current;
		const cardWidth = container.clientWidth - 32;
		const scrollPosition = index * (cardWidth + 16);

		container.scrollTo({
			left: scrollPosition,
			behavior: "smooth",
		});
	}, []);

	const handleMobileCardTap = useCallback(
		(cardId: string, e: React.MouseEvent) => {
			if (!isMobile) return;

			if (isDragging || Math.abs(dragOffset) > 5) {
				e.preventDefault();
				return;
			}

			setIsFullScreenTransitioning(true);
			setTimeout(() => {
				setFullScreenCardId(cardId);
				setIsFullScreenTransitioning(false);
				addToast("Swipe down or tap X to close", "info");
			}, 100);
		},
		[isMobile, isDragging, dragOffset, addToast]
	);

	const handleFullScreenClose = useCallback(() => {
		setIsFullScreenTransitioning(true);
		setFullScreenCardId(null);
		setTimeout(() => {
			setIsFullScreenTransitioning(false);
		}, 500);
	}, []);

	useEffect(() => {
		if (
			isMobile ||
			shareModalOpen ||
			replyModalOpen ||
			profileModalOpen ||
			infoModalOpen ||
			commentModalOpen ||
			!!fullScreenCardId
		)
			return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.target instanceof HTMLTextAreaElement ||
				e.target instanceof HTMLInputElement
			) {
				return;
			}

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setFocusedItemIndex((prev) => {
						const newIndex = Math.min(prev + 1, activities.length - 1);
						if (newIndex >= 0 && timelineRef.current) {
							const itemElement = timelineRef.current.children[newIndex];
							if (itemElement) {
								itemElement.scrollIntoView({
									behavior: "smooth",
									block: "nearest",
								});
							}
						}
						return newIndex;
					});
					break;
				case "ArrowUp":
					e.preventDefault();
					setFocusedItemIndex((prev) => {
						const newIndex = Math.max(prev - 1, 0);
						if (newIndex >= 0 && timelineRef.current) {
							const itemElement = timelineRef.current.children[newIndex];
							if (itemElement) {
								itemElement.scrollIntoView({
									behavior: "smooth",
									block: "nearest",
								});
							}
						}
						return newIndex;
					});
					break;
				case "Enter":
					if (focusedItemIndex >= 0 && focusedItemIndex < activities.length) {
						e.preventDefault();
						toggleExpand(activities[focusedItemIndex].id);
					}
					break;
				case "l":
				case "L":
					if (focusedItemIndex >= 0 && focusedItemIndex < activities.length) {
						e.preventDefault();
						handleLike(activities[focusedItemIndex].id);
					}
					break;
				case "r":
				case "R":
					if (focusedItemIndex >= 0 && focusedItemIndex < activities.length) {
						e.preventDefault();
						handleReply(activities[focusedItemIndex].id);
					}
					break;
				case "s":
				case "S":
					if (focusedItemIndex >= 0 && focusedItemIndex < activities.length) {
						e.preventDefault();
						handleShare(activities[focusedItemIndex].id);
					}
					break;
				case "Escape":
					setFocusedItemIndex(-1);
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isMobile,
		activities,
		focusedItemIndex,
		shareModalOpen,
		replyModalOpen,
		profileModalOpen,
		infoModalOpen,
		commentModalOpen,
		fullScreenCardId,
	]);

	useEffect(() => {
		if (!isMobile && activities.length > 0 && focusedItemIndex === -1) {
		}
	}, [activities, isMobile, focusedItemIndex]);

	return (
		<div
			className={`min-h-screen transition-all duration-1000 relative overflow-hidden ${
				isMobile ? "h-screen overflow-hidden" : ""
			}`}
			style={{ background: colors.background }}
		>
			{}
			<nav
				className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm"
				style={{
					background: colors.surface + "95",
					borderColor: colors.border,
				}}
			>
				<div className="w-full px-4">
					<div className="flex items-center py-4">
						<div className="flex items-center space-x-3">
							<button
								onClick={() => window.location.reload()}
								className="p-2 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
								style={{ background: colors.primary }}
								title="Refresh page"
							>
								<TimelineIcon className="w-6 h-6 text-white" />
							</button>
							<button
								onClick={() => window.location.reload()}
								className="flex flex-col transition-all duration-300 hover:scale-105 cursor-pointer"
								title="Refresh page"
							>
								<h1
									className="text-xl md:text-2xl font-bold text-left"
									style={{ color: colors.text }}
								>
									Activity Timeline
								</h1>
								<p
									className="text-sm text-left"
									style={{ color: colors.textSecondary }}
								>
									User Interaction History
								</p>
							</button>
						</div>
						<div className="flex items-center space-x-3 ml-auto">
							<button
								onClick={() => setInfoModalOpen(true)}
								className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer border"
								style={{
									background: colors.surface,
									borderColor: colors.border,
									color: colors.primary,
								}}
							>
								<InfoIcon className="w-4 h-4" />
								<span className="font-medium">Info</span>
							</button>
						</div>
					</div>
				</div>
			</nav>

			{}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{}
				<div
					className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-5 bg-element-hover transition-all duration-700"
					style={{
						background: `radial-gradient(circle, ${colors.primary}, transparent)`,
					}}
				></div>
				<div
					className="absolute bottom-20 left-10 w-24 h-24 rounded-full opacity-5 bg-element-hover transition-all duration-700"
					style={{
						background: `radial-gradient(circle, ${colors.secondary}, transparent)`,
					}}
				></div>

				{}
				<div
					className="absolute top-1/4 left-1/4 w-16 h-16 rotate-45 opacity-3 bg-element-hover transition-all duration-500"
					style={{
						background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
						borderRadius: "20%",
					}}
				></div>

				<div
					className="absolute top-3/4 right-1/3 w-20 h-20 opacity-3 bg-element-hover transition-all duration-500"
					style={{
						background: `linear-gradient(45deg, ${colors.secondary}15, ${colors.primary}15)`,
						clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
					}}
				></div>

				{}
				<div
					className="absolute top-1/2 right-1/4 w-12 h-12 opacity-4 bg-element-hover transition-all duration-600 animate-float-slow"
					style={{
						background: `linear-gradient(60deg, ${colors.accent}25, transparent)`,
						clipPath:
							"polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				></div>

				<div
					className="absolute top-1/3 left-1/2 w-8 h-8 opacity-4 bg-element-hover transition-all duration-600 animate-float-slow"
					style={{
						background: `linear-gradient(120deg, ${colors.primary}30, transparent)`,
						clipPath:
							"polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
						animationDelay: "2s",
					}}
				></div>

				{}
				<div
					className="absolute top-1/6 left-1/6 w-40 h-1 opacity-2 bg-element-hover transition-all duration-500"
					style={{
						background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
						borderRadius: "50px",
						transform: "rotate(25deg)",
					}}
				></div>

				<div
					className="absolute bottom-1/4 right-1/6 w-32 h-1 opacity-2 bg-element-hover transition-all duration-500"
					style={{
						background: `linear-gradient(90deg, transparent, ${colors.secondary}40, transparent)`,
						borderRadius: "50px",
						transform: "rotate(-15deg)",
					}}
				></div>

				{}
				<div className="absolute top-1/2 left-1/6 grid grid-cols-3 gap-2 opacity-3">
					{[...Array(9)].map((_, i) => (
						<div
							key={i}
							className="w-1 h-1 rounded-full bg-element-hover transition-all duration-300"
							style={{
								background: colors.primary,
								animationDelay: `${i * 0.1}s`,
							}}
						></div>
					))}
				</div>

				<div className="absolute bottom-1/3 right-1/5 grid grid-cols-4 gap-1 opacity-3">
					{[...Array(12)].map((_, i) => (
						<div
							key={i}
							className="w-0.5 h-0.5 rounded-full bg-element-hover transition-all duration-300"
							style={{
								background: colors.secondary,
								animationDelay: `${i * 0.05}s`,
							}}
						></div>
					))}
				</div>

				{}
				<div
					className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-2 bg-element-hover transition-all duration-1000"
					style={{
						background: `radial-gradient(circle at 30% 30%, ${colors.primary}15, ${colors.secondary}10, transparent 70%)`,
					}}
				></div>

				<div
					className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-2 bg-element-hover transition-all duration-1000"
					style={{
						background: `radial-gradient(circle at 70% 70%, ${colors.secondary}15, ${colors.accent}10, transparent 70%)`,
					}}
				></div>

				{}
				<div
					className="absolute top-2/3 left-2/3 w-24 h-24 rounded-full opacity-3 bg-element-hover transition-all duration-700 animate-pulse-slow"
					style={{
						border: `1px solid ${colors.primary}30`,
						background: "transparent",
					}}
				></div>

				<div
					className="absolute top-1/5 right-2/5 w-16 h-16 rounded-full opacity-3 bg-element-hover transition-all duration-700 animate-pulse-slow"
					style={{
						border: `1px solid ${colors.accent}30`,
						background: "transparent",
						animationDelay: "1s",
					}}
				></div>
			</div>

			<ToastContainer toasts={toasts} onClose={removeToast} colors={colors} />

			<div className="max-w-6xl mx-auto px-4 relative z-10 py-8">
				{}
				<div className="text-center md:text-left mb-8 md:mb-12">
					<div className="relative z-10">
						<h2
							className="text-2xl md:text-3xl font-bold mb-2"
							style={{ color: colors.text }}
						>
							Recent Activity
						</h2>
						<p
							className="text-base md:text-lg max-w-3xl mx-auto md:mx-0 leading-relaxed"
							style={{ color: colors.textSecondary }}
						>
							Track and monitor user interactions, system events, and activity
							history in chronological order
						</p>
					</div>
				</div>

				{isMobile ? (
					<div className="h-[calc(100vh-140px)] flex flex-col">
						<div
							ref={scrollContainerRef}
							className="flex-1 flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 px-4 touch-pan-x"
							style={{
								scrollBehavior: "smooth",
								transform: `translateX(${dragOffset}px)`,
								transition: isDragging ? "none" : "transform 0.3s ease-out",
							}}
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
						>
							{activities.map((activity, index) => (
								<div key={activity.id} className="snap-start flex-shrink-0">
									<TimelineItem
										item={activity}
										isExpanded={false}
										onToggleExpand={() => {}}
										onLike={handleLike}
										onReply={handleReply}
										onShare={handleShare}
										onAvatarClick={handleAvatarClick}
										isMobile={true}
										colors={colors}
										index={index}
										onUpdateActivity={onUpdateActivity}
										addToast={addToast}
										onCardTap={handleMobileCardTap}
										isDragging={isDragging}
										isCurrentCard={index === currentCardIndex}
									/>
								</div>
							))}

							{loading && (
								<div className="w-[calc(100vw-2rem)] max-w-sm flex items-center justify-center p-4 flex-shrink-0">
									<div
										className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
										style={{
											borderColor: colors.primary,
											borderTopColor: "transparent",
										}}
									></div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="relative">
						{}
						<div ref={timelineRef} className="space-y-8 max-w-4xl">
							{activities.map((activity, index) => (
								<div
									key={activity.id}
									className="animate-fadeInUp"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									<TimelineItem
										item={activity}
										isExpanded={expandedItems.has(activity.id)}
										onToggleExpand={toggleExpand}
										onLike={handleLike}
										onReply={handleReply}
										onShare={handleShare}
										onAvatarClick={handleAvatarClick}
										isMobile={false}
										colors={colors}
										index={index}
										isFocused={focusedItemIndex === index}
										onUpdateActivity={onUpdateActivity}
										addToast={addToast}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				{hasMore && (
					<div ref={loadMoreRef} className="mt-12 flex justify-center">
						{loading ? (
							<div className="flex items-center space-x-4">
								<div
									className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"
									style={{
										borderColor: colors.primary,
										borderTopColor: "transparent",
									}}
								></div>
								<span style={{ color: colors.textSecondary }}>
									Loading more activities...
								</span>
							</div>
						) : (
							<div style={{ color: colors.textSecondary }}>
								Scroll to load more
							</div>
						)}
					</div>
				)}
			</div>

			{}
			<InfoModal
				isOpen={infoModalOpen}
				onClose={() => setInfoModalOpen(false)}
				colors={colors}
			/>

			<ShareModal
				isOpen={shareModalOpen}
				onClose={() => setShareModalOpen(false)}
				item={shareItem}
				colors={colors}
				addToast={addToast}
			/>

			<ReplyModal
				isOpen={replyModalOpen}
				onClose={() => setReplyModalOpen(false)}
				item={replyItem}
				colors={colors}
				onSubmit={handleReplySubmit}
				addToast={addToast}
			/>

			<ProfileModal
				isOpen={profileModalOpen}
				onClose={() => setProfileModalOpen(false)}
				user={profileUser}
				colors={colors}
				addToast={addToast}
			/>

			<CommentModal
				isOpen={commentModalOpen}
				onClose={() => setCommentModalOpen(false)}
				item={commentItem}
				colors={colors}
				onAvatarClick={handleAvatarClick}
				addToast={addToast}
				onUpdateActivity={onUpdateActivity}
			/>

			{}
			<FullScreenCardDetail
				isOpen={!!fullScreenCardId}
				onClose={handleFullScreenClose}
				item={
					fullScreenCardId
						? activities.find((a) => a.id === fullScreenCardId) || null
						: null
				}
				colors={colors}
				onLike={handleLike}
				onReply={handleReply}
				onShare={handleShare}
				onAvatarClick={handleAvatarClick}
				onUpdateActivity={onUpdateActivity}
				addToast={addToast}
			/>
			<Footer colors={colors} />
			{}
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap");

				* {
					font-family: "Raleway", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
				}

				body,
				html {
					font-family: "Raleway", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
				}

				body,
				html {
					scrollbar-width: thin;
					scrollbar-color: ${colors.primary} ${colors.surface};
				}

				body::-webkit-scrollbar,
				html::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}

				body::-webkit-scrollbar-track,
				html::-webkit-scrollbar-track {
					background: ${colors.surface};
					border-radius: 4px;
				}

				body::-webkit-scrollbar-thumb,
				html::-webkit-scrollbar-thumb {
					background: ${colors.primary};
					border-radius: 4px;
					transition: all 0.3s ease;
				}

				body::-webkit-scrollbar-thumb:hover,
				html::-webkit-scrollbar-thumb:hover {
					background: ${colors.secondary};
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}

				.custom-scrollbar::-webkit-scrollbar-track {
					background: ${colors.surface};
					border-radius: 4px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: ${colors.primary};
					border-radius: 4px;
					transition: all 0.3s ease;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: ${colors.secondary};
				}

				.custom-scrollbar {
					scrollbar-width: thin;
					scrollbar-color: ${colors.primary} ${colors.surface};
				}

				.modal-scrollbar::-webkit-scrollbar {
					width: 6px;
					height: 6px;
				}

				.modal-scrollbar::-webkit-scrollbar-track {
					background: rgba(248, 250, 252, 0.4);
					border-radius: 3px;
				}

				.modal-scrollbar::-webkit-scrollbar-thumb {
					background: ${colors.primary};
					border-radius: 3px;
				}

				.modal-scrollbar::-webkit-scrollbar-thumb:hover {
					background: ${colors.secondary};
				}

				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fadeInUp {
					animation: fadeInUp 0.5s ease-out forwards;
					opacity: 0;
				}

				@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateX(20px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				.animate-slideIn {
					animation: slideIn 0.3s ease-out forwards;
				}

				@keyframes modalAppear {
					from {
						opacity: 0;
						transform: scale(0.95);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}

				.animate-modalAppear {
					animation: modalAppear 0.3s ease-out forwards;
				}

				@media (max-width: 768px) {
					.scrollbar-hide {
						-ms-overflow-style: none;
						scrollbar-width: none;
					}
					.scrollbar-hide::-webkit-scrollbar {
						display: none;
					}
				}

				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}

				@keyframes loading-progress {
					0% {
						width: 0%;
						transform: translateX(-100%);
					}
					50% {
						width: 100%;
						transform: translateX(0%);
					}
					100% {
						width: 100%;
						transform: translateX(100%);
					}
				}

				.animate-loading-progress {
					animation: loading-progress 2s ease-in-out infinite;
				}

				@keyframes float {
					0%,
					100% {
						transform: translateY(0px) rotate(0deg);
						opacity: 0.3;
					}
					50% {
						transform: translateY(-20px) rotate(180deg);
						opacity: 0.8;
					}
				}

				.animate-float {
					animation: float 3s ease-in-out infinite;
				}

				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fadeInUp {
					animation: fadeInUp 0.8s ease-out forwards;
					opacity: 0;
				}

				@keyframes float-slow {
					0%,
					100% {
						transform: translateY(0px) rotate(0deg);
					}
					50% {
						transform: translateY(-15px) rotate(180deg);
					}
				}

				.animate-float-slow {
					animation: float-slow 6s ease-in-out infinite;
				}

				@keyframes pulse-slow {
					0%,
					100% {
						opacity: 0.3;
						transform: scale(1);
					}
					50% {
						opacity: 0.6;
						transform: scale(1.05);
					}
				}

				.animate-pulse-slow {
					animation: pulse-slow 4s ease-in-out infinite;
				}

				.bg-element-hover:hover {
					opacity: 0.8 !important;
					transform: scale(1.1);
					filter: blur(0px) brightness(1.2);
					box-shadow: 0 0 20px currentColor;
				}

				.opacity-2 {
					opacity: 0.02;
				}
				.opacity-3 {
					opacity: 0.03;
				}
				.opacity-4 {
					opacity: 0.04;
				}
				.opacity-5 {
					opacity: 0.05;
				}

				body.modal-open {
					overflow: hidden !important;
					position: fixed;
					width: 100%;
					height: 100%;
				}

				body.modal-open .min-h-screen {
					overflow: hidden !important;
				}

				body.modal-open *::-webkit-scrollbar {
					display: none !important;
				}

				body.modal-open * {
					scrollbar-width: none !important;
					-ms-overflow-style: none !important;
				}

				body.modal-open .modal-scrollbar::-webkit-scrollbar {
					display: block !important;
					width: 6px !important;
					height: 6px !important;
				}

				body.modal-open .modal-scrollbar {
					scrollbar-width: thin !important;
					-ms-overflow-style: auto !important;
				}

				body.modal-open .min-h-screen > *:not(.fixed) {
					pointer-events: none;
				}

				body.modal-open .fixed {
					pointer-events: auto;
				}

				.touch-pan-x {
					touch-action: pan-x;
					-webkit-overflow-scrolling: touch;
				}

				@keyframes swipe-feedback {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(0.98);
					}
					100% {
						transform: scale(1);
					}
				}

				.swipe-feedback {
					animation: swipe-feedback 0.2s ease-out;
				}

				@keyframes mobile-expand {
					from {
						max-height: 0;
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						max-height: 500px;
						opacity: 1;
						transform: translateY(0);
					}
				}

				.mobile-expand {
					animation: mobile-expand 0.3s ease-out forwards;
				}

				@media (max-width: 768px) {
					button,
					.cursor-pointer {
						min-height: 44px;
						min-width: 44px;
					}

					.mobile-action-button {
						padding: 12px 16px;
						font-size: 16px;
						touch-action: manipulation;
					}

					.timeline-card {
						transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
					}

					.timeline-card.expanded {
						transform: scale(1.02);
						box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
							0 10px 10px -5px rgba(0, 0, 0, 0.04);
					}
				}

				@keyframes mobileExpandIn {
					from {
						opacity: 0;
						transform: translateY(-10px) scale(0.95);
						maxheight: 0;
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
						maxheight: 1000px;
					}
				}

				@keyframes mobileExpandOut {
					from {
						opacity: 1;
						transform: translateY(0) scale(1);
						maxheight: 1000px;
					}
					to {
						opacity: 0;
						transform: translateY(-10px) scale(0.95);
						maxheight: 0;
					}
				}

				.mobile-expand-enter {
					animation: mobileExpandIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
				}

				.mobile-expand-exit {
					animation: mobileExpandOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
				}

				.enhanced-gradient {
					background: linear-gradient(
						145deg,
						rgba(255, 255, 255, 0.9),
						rgba(248, 250, 252, 0.8)
					);
					backdrop-filter: blur(10px);
				}

				.timeline-card:hover {
					border-color: ${colors.primary} !important;
					border-width: 2px !important;
					box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.1),
						0 0 0 1px ${colors.primary}30 !important;
					transform: translateY(-2px) !important;
				}

				.dragging * {
					user-select: none !important;
					-webkit-user-select: none !important;
					-moz-user-select: none !important;
					-ms-user-select: none !important;
				}

				.touch-feedback:active {
					transform: scale(0.98);
					transition: transform 0.1s ease-out;
				}

				.smooth-scroll {
					scroll-behavior: smooth;
					-webkit-overflow-scrolling: touch;
				}

				.touch-pan-x {
					touch-action: pan-x;
					-webkit-overflow-scrolling: touch;
				}

				@media (max-width: 768px) {
					body,
					html {
						height: 100vh;
						overflow: hidden;
						position: fixed;
						width: 100%;
					}

					body.modal-open {
						overflow: hidden !important;
						position: fixed !important;
						width: 100% !important;
						height: 100vh !important;
					}
				}

				@keyframes swipe-feedback {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(0.98);
					}
					100% {
						transform: scale(1);
					}
				}

				@media (max-width: 768px) {
					.scrollbar-hide {
						-ms-overflow-style: none;
						scrollbar-width: none;
					}
					.scrollbar-hide::-webkit-scrollbar {
						display: none;
					}
				}

				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}

				.mobile-scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
					-webkit-overflow-scrolling: touch;
				}

				.mobile-scrollbar-hide::-webkit-scrollbar {
					display: none;
				}

				@media (max-width: 768px) {
					.mobile-scrollbar-hide {
						-ms-overflow-style: none !important;
						scrollbar-width: none !important;
					}

					.mobile-scrollbar-hide::-webkit-scrollbar {
						display: none !important;
						width: 0 !important;
						height: 0 !important;
					}
				}
			`}</style>
		</div>
	);
};

const App: React.FC = () => {
	const colors = appTheme;
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2500);

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return <LoadingScreen colors={colors} />;
	}

	return <ActivityTimeline colors={colors} />;
};

export default App;
