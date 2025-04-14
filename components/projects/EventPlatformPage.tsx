"use client";
import React, {
	useState,
	useEffect,
	useMemo,
	useRef,
	useCallback,
} from "react";
import Head from "next/head";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
	FiUser,
	FiVideo,
	FiStar,
	FiMessageSquare,
	FiBarChart2,
	FiMenu,
	FiX,
	FiSend,
	FiCheckCircle,
	FiUsers,
	FiAward,
	FiMic,
	FiShare2,
	FiHeart,
	FiClock,
	FiBell,
	FiMoreHorizontal,
	FiVolume2,
	FiVolumeX,
	FiMaximize,
	FiMinimize,
	FiChevronRight,
	FiChevronLeft,
	FiSettings,
	FiDownload,
	FiWifi,
	FiAlertCircle,
	FiCamera,
	FiPause,
	FiPlayCircle,
	FiSlack,
	FiCopy,
	FiArrowUp,
	FiThumbsUp,
	FiLock,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";

type ViewMode = "webinar" | "viewer";
type SidebarTab = "chat" | "polls" | "participants";
type ConnectionStatus = "excellent" | "good" | "fair" | "poor" | "reconnecting";
type VideoStatus = "playing" | "paused" | "buffering" | "error";

interface User {
	id: string;
	name: string;
	role?: string;
	avatarUrl?: string;
	status?: "online" | "away" | "busy" | "offline";
	recentlyActive?: boolean;
	connectionQuality?: ConnectionStatus;
}

interface PinnedSpeaker extends User {
	isLive: boolean;
	streamTitle: string;
	isMuted: boolean;
	isVideoOn: boolean;
	isScreenSharing: boolean;
}

interface SpotlightParticipant extends User {
	topic: string;
	isHandRaised?: boolean;
	secondsInSpotlight?: number;
}

interface ChatMessage {
	id: string;
	user: User;
	text: string;
	timestamp: Date;
	isRead?: boolean;
	reactions?: {
		type: string;
		count: number;
		reacted: boolean;
	}[];
}

interface PollOption {
	id: string;
	text: string;
	votes: number;
	color: string;
}

interface Poll {
	id: string;
	question: string;
	options: PollOption[];
	userVotedOptionId?: string;
	isOpen: boolean;
	createdAt: Date;
	endsAt?: Date;
}

interface SystemNotification {
	id: string;
	type: "info" | "success" | "warning" | "error";
	message: string;
	autoDismiss?: boolean;
	timestamp: Date;
}

interface EventInfo {
	id: string;
	title: string;
	description: string;
	startTime: Date;
	endTime: Date;
	hostName: string;
	participantCount: number;
	inviteLink: string;
}

const POLL_COLORS = ["#4f46e5", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
const CONNECTION_COLORS = {
	excellent: "emerald-500",
	good: "green-500",
	fair: "yellow-500",
	poor: "orange-500",
	reconnecting: "red-500",
};

const EVENT_INFO: EventInfo = {
	id: "evt-2205-781",
	title: "The Future of Hybrid Events: Engaging Remote Audiences",
	description:
		"Join us for an interactive session on creating engaging hybrid events that connect in-person and virtual attendees seamlessly.",
	startTime: new Date(Date.now() - 1000 * 60 * 30),
	endTime: new Date(Date.now() + 1000 * 60 * 60),
	hostName: "Eva Rodriguez",
	participantCount: 238,
	inviteLink: "https://eventhub.io/e/evt-2205-781",
};

const MOCK_USERS: User[] = [
	{
		id: "user1",
		name: "Alex Morgan",
		role: "Host",
		avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
		status: "online",
		connectionQuality: "excellent",
	},
	{
		id: "user2",
		name: "Jamie Chen",
		role: "Moderator",
		avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		status: "online",
		connectionQuality: "good",
	},
	{
		id: "user3",
		name: "Taylor Kim",
		role: "Presenter",
		avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
		status: "online",
		connectionQuality: "good",
	},
	{
		id: "user4",
		name: "Jordan Smith",
		role: "Attendee",
		avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
		status: "online",
		recentlyActive: true,
		connectionQuality: "fair",
	},
	{
		id: "user5",
		name: "Casey Brown",
		role: "Attendee",
		avatarUrl: "https://randomuser.me/api/portraits/women/23.jpg",
		status: "away",
		connectionQuality: "good",
	},
	{
		id: "user6",
		name: "Morgan Lee",
		role: "Attendee",
		avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		status: "online",
		connectionQuality: "excellent",
	},
	{
		id: "user7",
		name: "Riley Johnson",
		role: "Attendee",
		avatarUrl: "https://randomuser.me/api/portraits/women/29.jpg",
		status: "online",
		connectionQuality: "fair",
	},
	{
		id: "user8",
		name: "Quinn Martinez",
		role: "Attendee",
		avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
		status: "busy",
		connectionQuality: "good",
	},
	{
		id: "user9",
		name: "Avery Wilson",
		role: "Attendee",
		avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
		status: "offline",
		connectionQuality: "poor",
	},
	{
		id: "user10",
		name: "Sam Davis",
		role: "Attendee",
		avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg",
		status: "online",
		connectionQuality: "good",
	},
];

const MOCK_PINNED_SPEAKER: PinnedSpeaker = {
	id: "speaker1",
	name: "Dr. Eva Rodriguez",
	role: "Keynote Speaker",
	avatarUrl: "https://randomuser.me/api/portraits/women/76.jpg",
	isLive: true,
	streamTitle: "The Future of Hybrid Events: Engaging Remote Audiences",
	isMuted: false,
	isVideoOn: true,
	isScreenSharing: false,
	status: "online",
	connectionQuality: "excellent",
};

const MOCK_SPOTLIGHT_PARTICIPANTS: SpotlightParticipant[] = [
	{
		id: "user2",
		name: "Jamie Chen",
		topic: "How to maintain engagement in virtual Q&A sessions",
		avatarUrl: MOCK_USERS[1].avatarUrl,
		status: "online",
		isHandRaised: false,
		secondsInSpotlight: 45,
		connectionQuality: "good",
	},
	{
		id: "user4",
		name: "Jordan Smith",
		topic: "Best practices for hybrid event networking",
		avatarUrl: MOCK_USERS[3].avatarUrl,
		status: "online",
		isHandRaised: true,
		secondsInSpotlight: 0,
		connectionQuality: "fair",
	},
	{
		id: "user1",
		name: "Alex Morgan",
		topic: "Platform features that boost interaction",
		avatarUrl: MOCK_USERS[0].avatarUrl,
		status: "online",
		isHandRaised: false,
		secondsInSpotlight: 120,
		connectionQuality: "excellent",
	},
];

const MOCK_CHAT_MESSAGES: ChatMessage[] = [
	{
		id: "msg1",
		user: MOCK_USERS[3],
		text: "Great insights on hybrid engagement models!",
		timestamp: new Date(Date.now() - 60000 * 5),
		isRead: true,
		reactions: [
			{ type: "👍", count: 3, reacted: false },
			{ type: "❤️", count: 1, reacted: false },
		],
	},
	{
		id: "msg2",
		user: MOCK_USERS[1],
		text: "What metrics do you track for virtual engagement?",
		timestamp: new Date(Date.now() - 60000 * 4),
		isRead: true,
		reactions: [],
	},
	{
		id: "msg3",
		user: MOCK_USERS[2],
		text: "We've seen 40% higher retention with interactive polls. It's been a game changer for our virtual events.",
		timestamp: new Date(Date.now() - 60000 * 3),
		isRead: true,
		reactions: [
			{ type: "👍", count: 5, reacted: true },
			{ type: "🚀", count: 2, reacted: false },
		],
	},
	{
		id: "msg4",
		user: MOCK_USERS[5],
		text: "Are these strategies applicable to smaller events with less than 50 participants?",
		timestamp: new Date(Date.now() - 60000 * 2),
		isRead: false,
		reactions: [],
	},
	{
		id: "msg5",
		user: MOCK_USERS[4],
		text: "Dr. Rodriguez, could you elaborate on the hybrid networking techniques you mentioned earlier? Those breakout room strategies sound promising.",
		timestamp: new Date(Date.now() - 60000 * 1),
		isRead: false,
		reactions: [],
	},
];

const MOCK_POLLS: Poll[] = [
	{
		id: "poll1",
		question: "What's your preferred event format?",
		options: [
			{ id: "opt1a", text: "Fully Virtual", votes: 42, color: POLL_COLORS[0] },
			{ id: "opt1b", text: "Hybrid", votes: 67, color: POLL_COLORS[1] },
			{ id: "opt1c", text: "In-Person", votes: 23, color: POLL_COLORS[2] },
		],
		isOpen: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 15),
	},
	{
		id: "poll2",
		question: "Which engagement feature do you value most?",
		options: [
			{ id: "opt2a", text: "Live Q&A", votes: 58, color: POLL_COLORS[0] },
			{
				id: "opt2b",
				text: "Interactive Polls",
				votes: 45,
				color: POLL_COLORS[1],
			},
			{
				id: "opt2c",
				text: "Networking Sessions",
				votes: 32,
				color: POLL_COLORS[2],
			},
			{ id: "opt2d", text: "Breakout Rooms", votes: 29, color: POLL_COLORS[3] },
		],
		isOpen: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 10),
		userVotedOptionId: "opt2b",
	},
	{
		id: "poll3",
		question: "What's your biggest hybrid event challenge?",
		options: [
			{
				id: "opt3a",
				text: "Technical Issues",
				votes: 75,
				color: POLL_COLORS[0],
			},
			{
				id: "opt3b",
				text: "Audience Engagement",
				votes: 62,
				color: POLL_COLORS[1],
			},
			{
				id: "opt3c",
				text: "Content Delivery",
				votes: 38,
				color: POLL_COLORS[2],
			},
			{ id: "opt3d", text: "Networking", votes: 45, color: POLL_COLORS[3] },
		],
		isOpen: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 5),
	},
];

const slideIn = {
	hidden: { x: "100%" },
	visible: {
		x: 0,
		transition: { type: "spring", stiffness: 300, damping: 30 },
	},
	exit: { x: "100%", transition: { duration: 0.2, ease: "easeIn" } },
} as const;

const fadeIn = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;

const scaleIn = {
	hidden: { scale: 0.95, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: { duration: 0.3, ease: "easeOut" },
	},
} as const;

const pulseAnimation = {
	scale: [1, 1.03, 1],
	transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
} as const;

const toastVariants = {
	initial: { opacity: 0, y: -20, scale: 0.8 },
	animate: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
} as const;

const formatDuration = (milliseconds: number): string => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;
	}

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatRelativeTime = (date: Date): string => {
	const now = new Date();
	const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffSeconds < 60) return "Just now";
	if (diffSeconds < 120) return "1 min ago";
	if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} mins ago`;
	if (diffSeconds < 7200) return "1 hour ago";
	if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;

	return date.toLocaleString();
};

const getRandomInt = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Avatar = ({
	src,
	name,
	size = "md",
	className = "",
	status = "",
	connectionQuality,
	showConnectionQuality = false,
	isRaising = false,
	onClick,
}: {
	src?: string;
	name: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	className?: string;
	status?: "online" | "away" | "busy" | "offline" | "";
	connectionQuality?: ConnectionStatus;
	showConnectionQuality?: boolean;
	isRaising?: boolean;
	onClick?: () => void;
}) => {
	const sizeClasses = {
		xs: "w-6 h-6 text-xs",
		sm: "w-8 h-8 text-xs",
		md: "w-10 h-10 text-sm",
		lg: "w-14 h-14 text-base",
		xl: "w-20 h-20 text-lg",
	};

	const statusColors = {
		online: "bg-emerald-500",
		away: "bg-amber-500",
		busy: "bg-red-500",
		offline: "bg-gray-400",
	};

	return (
		<div className="relative">
			<motion.div
				className={`relative rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 
                     border-2 border-white shadow-lg flex items-center justify-center overflow-hidden 
                     ${sizeClasses[size]} ${className} ${
					onClick ? "cursor-pointer" : ""
				}`}
				whileHover={onClick ? { scale: 1.05 } : {}}
				whileTap={onClick ? { scale: 0.95 } : {}}
				onClick={onClick}
				animate={isRaising ? { y: [0, -5, 0] } : {}}
				transition={isRaising ? { repeat: Infinity, duration: 1 } : {}}
			>
				{src ? (
					<img src={src} alt={name} className="w-full h-full object-cover" />
				) : (
					<span className="font-medium text-white">
						{name
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</span>
				)}
			</motion.div>

			{status && (
				<div
					className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white`}
				></div>
			)}

			{showConnectionQuality && connectionQuality && (
				<div
					className={`absolute -top-1 -right-1 flex items-center justify-center bg-${CONNECTION_COLORS[connectionQuality]} rounded-full p-1 border border-white`}
				>
					<FiWifi className="w-2 h-2 text-white" />
				</div>
			)}
		</div>
	);
};

const Badge = ({
	children,
	variant = "default",
	className = "",
	pulse = false,
	onClick,
}: {
	children: React.ReactNode;
	variant?: "default" | "live" | "success" | "warning" | "info" | "error";
	className?: string;
	pulse?: boolean;
	onClick?: () => void;
}) => {
	const variantClasses = {
		default: "bg-slate-100 text-slate-700 border border-slate-200",
		live: "bg-red-50 text-red-700 border border-red-200",
		success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
		warning: "bg-amber-50 text-amber-700 border border-amber-200",
		info: "bg-blue-50 text-blue-700 border border-blue-200",
		error: "bg-red-50 text-red-700 border border-red-200",
	};

	return (
		<motion.span
			className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                 ${variantClasses[variant]} ${className} ${
				pulse ? "animate-pulse" : ""
			} 
                 ${onClick ? "cursor-pointer hover:bg-opacity-80" : ""}`}
			whileHover={onClick ? { scale: 1.05 } : {}}
			whileTap={onClick ? { scale: 0.95 } : {}}
			onClick={onClick}
		>
			{variant === "live" && (
				<span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
			)}
			{variant === "success" && <FiCheckCircle className="w-3 h-3 mr-1" />}
			{variant === "warning" && <FiBell className="w-3 h-3 mr-1" />}
			{variant === "info" && <FiStar className="w-3 h-3 mr-1" />}
			{variant === "error" && <FiAlertCircle className="w-3 h-3 mr-1" />}
			{children}
		</motion.span>
	);
};

const Button = ({
	children,
	variant = "default",
	size = "md",
	onClick,
	className = "",
	icon,
	isActive = false,
	disabled = false,
	tooltip = "",
	loading = false,
	fullWidth = false,
}: {
	children?: React.ReactNode;
	variant?:
		| "default"
		| "primary"
		| "secondary"
		| "danger"
		| "success"
		| "outline"
		| "ghost";
	size?: "xs" | "sm" | "md" | "lg";
	onClick?: () => void;
	className?: string;
	icon?: React.ReactNode;
	isActive?: boolean;
	disabled?: boolean;
	tooltip?: string;
	loading?: boolean;
	fullWidth?: boolean;
}) => {
	const variantClasses = {
		default:
			"bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm",
		primary:
			"bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg",
		secondary:
			"bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg",
		danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
		success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
		outline:
			"bg-transparent hover:bg-slate-50 text-indigo-600 border border-indigo-200 hover:border-indigo-300",
		ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
	};

	const sizeClasses = {
		xs: "px-2 py-1 text-xs rounded-md",
		sm: "px-2.5 py-1.5 text-xs rounded-lg",
		md: "px-4 py-2 text-sm rounded-lg",
		lg: "px-5 py-2.5 text-base rounded-xl",
	};

	const activeClass = isActive ? "ring-2 ring-offset-2 ring-indigo-500" : "";

	return (
		<div className="relative group">
			<motion.button
				onClick={disabled || loading ? undefined : onClick}
				whileHover={!disabled && !loading ? { scale: 1.03 } : {}}
				whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
				className={`font-medium transition-all duration-200 flex items-center justify-center gap-2 
                  ${variantClasses[variant]} ${
					sizeClasses[size]
				} ${activeClass} ${className}
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${loading ? "opacity-80 cursor-wait" : ""}
                  ${fullWidth ? "w-full" : ""}`}
			>
				{loading ? (
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
						className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
					/>
				) : (
					icon
				)}
				{children}
			</motion.button>

			{tooltip && (
				<div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
					{tooltip}
				</div>
			)}
		</div>
	);
};

const AudioIndicator = ({
	audioLevel = 0,
	muted = false,
}: {
	audioLevel: number;
	muted?: boolean;
}) => {
	const maxBars = 5;
	const visibleBars = muted ? 0 : Math.ceil(audioLevel * maxBars);

	return (
		<div className="flex items-center space-x-0.5 h-3">
			{Array.from({ length: maxBars }).map((_, i) => (
				<motion.div
					key={i}
					className={`w-0.5 rounded-full ${
						i < visibleBars ? "bg-emerald-500" : "bg-gray-300"
					}`}
					animate={{
						height: i < visibleBars ? [8, 12, 8][i % 3] : 4,
					}}
					transition={{
						repeat: Infinity,
						duration: 0.4,
						repeatType: "reverse",
						delay: i * 0.1,
					}}
				/>
			))}
		</div>
	);
};

const VideoPlayer = ({
	userName,
	isLive = false,
	isMuted = false,
	isVideoOn = true,
	className = "",
	connectionQuality = "excellent",
	onToggleMute,
	onToggleVideo,
	onToggleFullscreen,
	videoStatus = "playing",

	thumbnailUrl,
}: {
	userName: string;
	isLive?: boolean;
	isMuted?: boolean;
	isVideoOn?: boolean;
	className?: string;
	connectionQuality?: ConnectionStatus;
	onToggleMute?: () => void;
	onToggleVideo?: () => void;
	onToggleFullscreen?: () => void;
	videoStatus?: VideoStatus;
	thumbnailUrl?: string;
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [audioLevel, setAudioLevel] = useState(0);
	const [showControls, setShowControls] = useState(false);

	const generateGradient = (name: string) => {
		const hash = name
			.split("")
			.reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);
		const hue1 = Math.abs(hash % 360);
		const hue2 = (hue1 + 40) % 360;
		return `linear-gradient(135deg, hsl(${hue1}, 80%, 40%), hsl(${hue2}, 80%, 35%))`;
	};

	const placeholderGradient = useMemo(
		() => generateGradient(userName),
		[userName]
	);

	useEffect(() => {
		if (isMuted || videoStatus !== "playing") {
			setAudioLevel(0);
			return;
		}

		const interval = setInterval(() => {
			setAudioLevel(Math.random() * 0.8 + 0.2);
		}, 200);

		return () => clearInterval(interval);
	}, [isMuted, videoStatus]);

	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			const container = videoRef.current?.parentElement;
			container?.requestFullscreen();
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}

		if (onToggleFullscreen) {
			onToggleFullscreen();
		}
	}, [onToggleFullscreen]);

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () =>
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={`relative rounded-xl overflow-hidden shadow-xl ${className}`}
			onMouseEnter={() => setShowControls(true)}
			onMouseLeave={() => setShowControls(false)}
			style={{
				background:
					isVideoOn && videoStatus !== "error" ? "#000" : placeholderGradient,
			}}
		>
			{}
			<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
				{isVideoOn && videoStatus !== "error" ? (
					<div className="absolute inset-0 w-full h-full">
						{}
						{thumbnailUrl ? (
							<img
								src={thumbnailUrl}
								alt={`${userName}'s stream`}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70 z-10"></div>

								{}
								<div className="absolute inset-0 z-0 opacity-20">
									<svg
										className="w-full h-full"
										viewBox="0 0 100 100"
										preserveAspectRatio="none"
									>
										<defs>
											<pattern
												id="grid"
												width="10"
												height="10"
												patternUnits="userSpaceOnUse"
											>
												<path
													d="M 10 0 L 0 0 0 10"
													fill="none"
													stroke="rgba(255,255,255,0.2)"
													strokeWidth="0.5"
												/>
											</pattern>
										</defs>
										<rect width="100" height="100" fill="url(#grid)" />
									</svg>
								</div>

								{}
								<motion.div
									className="absolute w-full h-full z-0 opacity-60"
									initial={false}
								>
									<motion.div
										className="absolute rounded-full bg-white/20 backdrop-blur-md"
										animate={{
											x: ["-10%", "110%"],
											y: ["40%", "60%"],
											width: ["30%", "40%", "30%"],
											height: ["30%", "40%", "30%"],
										}}
										transition={{
											duration: 20,
											repeat: Infinity,
											repeatType: "reverse",
											ease: "easeInOut",
										}}
									/>
									<motion.div
										className="absolute rounded-full bg-white/10 backdrop-blur-sm"
										animate={{
											x: ["80%", "20%"],
											y: ["20%", "70%"],
											width: ["20%", "25%", "20%"],
											height: ["20%", "25%", "20%"],
										}}
										transition={{
											duration: 15,
											repeat: Infinity,
											repeatType: "reverse",
											ease: "easeInOut",
											delay: 2,
										}}
									/>
									<motion.div
										className="absolute rounded-full bg-white/15 backdrop-blur-sm"
										animate={{
											x: ["50%", "30%"],
											y: ["80%", "30%"],
											width: ["15%", "20%", "15%"],
											height: ["15%", "20%", "15%"],
										}}
										transition={{
											duration: 18,
											repeat: Infinity,
											repeatType: "reverse",
											ease: "easeInOut",
											delay: 5,
										}}
									/>
								</motion.div>

								{}
								<div className="relative z-20 text-center">
									{videoStatus === "buffering" ? (
										<div className="flex flex-col items-center">
											<motion.div
												className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
												animate={{ rotate: 360 }}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "linear",
												}}
											>
												<div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
											</motion.div>
											<p className="text-white text-lg font-medium">
												Buffering...
											</p>
										</div>
									) : (
										<div className="text-center">
											<div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
												<FaUser className="w-12 h-12 text-white/80" />
											</div>
											<h3 className="text-white text-xl font-bold">
												{userName}
											</h3>
										</div>
									)}
								</div>
							</div>
						)}

						{}
						<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none"></div>
					</div>
				) : (
					<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800">
						{}
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="absolute w-full h-full bg-gradient-to-t from-black/40 to-transparent z-10" />
							<motion.div
								animate={{
									scale: [1, 1.2, 1],
									opacity: [0.2, 0.3, 0.2],
								}}
								transition={{
									duration: 8,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute w-48 h-48 sm:w-72 sm:h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
							/>
							<motion.div
								animate={{
									scale: [1.2, 1, 1.2],
									opacity: [0.15, 0.25, 0.15],
								}}
								transition={{
									duration: 7,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 1,
								}}
								className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-purple-500 rounded-full blur-3xl opacity-15"
							/>
							<motion.div
								animate={{
									scale: [0.9, 1.1, 0.9],
									opacity: [0.2, 0.3, 0.2],
								}}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 2,
								}}
								className="absolute w-32 h-32 sm:w-48 sm:h-48 bg-pink-500 rounded-full blur-3xl opacity-20"
							/>

							<div className="relative z-20 flex flex-col items-center">
								<motion.div
									whileHover={{ scale: 1.05 }}
									className="p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl"
								>
									{videoStatus === "error" ? (
										<FiAlertCircle className="w-8 h-8 sm:w-14 sm:h-14 text-red-500" />
									) : (
										<FiVideo className="w-8 h-8 sm:w-14 sm:h-14 text-white/80" />
									)}
								</motion.div>
								<p className="mt-3 sm:mt-5 text-base sm:text-2xl font-bold text-white text-center px-2 tracking-wide">
									{videoStatus === "error" ? "Video unavailable" : userName}
								</p>
								{videoStatus === "buffering" && (
									<div className="mt-3 flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
										<motion.div
											className="w-2 h-2 bg-blue-500 rounded-full"
											animate={{ scale: [1, 1.5, 1] }}
											transition={{
												repeat: Infinity,
												duration: 1,
												repeatType: "loop",
											}}
										/>
										<motion.div
											className="w-2 h-2 bg-blue-500 rounded-full"
											animate={{ scale: [1, 1.5, 1] }}
											transition={{
												repeat: Infinity,
												duration: 1,
												delay: 0.2,
												repeatType: "loop",
											}}
										/>
										<motion.div
											className="w-2 h-2 bg-blue-500 rounded-full"
											animate={{ scale: [1, 1.5, 1] }}
											transition={{
												repeat: Infinity,
												duration: 1,
												delay: 0.4,
												repeatType: "loop",
											}}
										/>
										<span className="text-white text-sm">Buffering</span>
									</div>
								)}
								{isLive && (
									<motion.div
										animate={pulseAnimation}
										className="mt-2 sm:mt-3 flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-500/30"
									>
										<div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full animate-pulse mr-2 sm:mr-3" />
										<span className="text-sm sm:text-base text-red-100 font-semibold">
											LIVE
										</span>
									</motion.div>
								)}
							</div>
						</div>
					</div>
				)}

				{}
				<div
					className={`absolute top-3 right-3 z-30 flex items-center space-x-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs`}
				>
					<FiWifi
						className={`w-3 h-3 text-${CONNECTION_COLORS[connectionQuality]}`}
					/>
					<span className="capitalize">{connectionQuality}</span>
				</div>

				{}
				{videoStatus === "playing" && (
					<div className="absolute top-3 left-3 z-30 flex items-center space-x-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
						{isMuted ? (
							<FiVolumeX className="w-3 h-3 text-red-400" />
						) : (
							<AudioIndicator audioLevel={audioLevel} muted={isMuted} />
						)}
					</div>
				)}

				{}
				<AnimatePresence>
					{(showControls || videoStatus === "paused") && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{ duration: 0.2 }}
							className="absolute bottom-3 left-0 right-0 z-30 flex justify-center"
						>
							<div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
								<Button
									variant="danger"
									size="sm"
									className="px-4"
									onClick={() => onToggleMute && onToggleMute()}
									icon={
										isMuted ? (
											<FiMic className="w-4 h-4" />
										) : (
											<FiVolumeX className="w-4 h-4" />
										)
									}
								>
									{isMuted ? "Unmute" : "Mute"}
								</Button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
};

const Card = ({
	children,
	className = "",
	highlight = false,
	onClose,
	title,
	footer,
}: {
	children: React.ReactNode;
	className?: string;
	highlight?: boolean;
	onClose?: () => void;
	title?: React.ReactNode;
	footer?: React.ReactNode;
}) => (
	<motion.div
		variants={fadeIn}
		initial="hidden"
		animate="visible"
		className={`bg-white rounded-xl ${
			highlight
				? "border-2 border-indigo-300 ring-4 ring-indigo-100/50"
				: "border border-slate-200"
		} 
               overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
	>
		{title && (
			<div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center">
				{title}
				{onClose && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						icon={<FiX className="w-4 h-4" />}
						className="!p-1"
					/>
				)}
			</div>
		)}

		{children}

		{footer && (
			<div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50">
				{footer}
			</div>
		)}
	</motion.div>
);

const Toast = ({
	message,
	type = "info",
	onDismiss,
	id,
}: {
	message: string;
	type?: "info" | "success" | "warning" | "error";
	onDismiss: (id: string) => void;
	id: string;
}) => {
	const icons = {
		info: <FiInfo className="w-5 h-5 text-blue-500" />,
		success: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
		warning: <FiBell className="w-5 h-5 text-amber-500" />,
		error: <FiAlertCircle className="w-5 h-5 text-red-500" />,
	};

	const bgColors = {
		info: "bg-blue-50",
		success: "bg-emerald-50",
		warning: "bg-amber-50",
		error: "bg-red-50",
	};

	const borderColors = {
		info: "border-blue-200",
		success: "border-emerald-200",
		warning: "border-amber-200",
		error: "border-red-200",
	};

	return (
		<motion.div
			variants={toastVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className={`p-3 rounded-lg shadow-lg border ${bgColors[type]} ${borderColors[type]} flex items-start gap-3 max-w-md w-full`}
		>
			<div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
			<div className="flex-1 text-sm">{message}</div>
			<Button
				variant="ghost"
				size="xs"
				onClick={() => onDismiss(id)}
				icon={<FiX className="w-4 h-4" />}
				className="!p-1 mt-0.5"
			/>
		</motion.div>
	);
};

const ToastContainer = ({
	notifications,
	removeNotification,
}: {
	notifications: SystemNotification[];
	removeNotification: (id: string) => void;
}) => {
	return (
		<div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm">
			<AnimatePresence>
				{notifications.map((notification) => (
					<Toast
						key={notification.id}
						id={notification.id}
						message={notification.message}
						type={notification.type}
						onDismiss={removeNotification}
					/>
				))}
			</AnimatePresence>
		</div>
	);
};
const EventFooter = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<footer className="bg-white border-t border-slate-200 mt-5">
			{}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
							Platform
						</h3>
						<div className="space-y-2">
							<p className="text-sm text-slate-600">
								Professional hybrid event platform for seamless virtual
								experiences
							</p>
							<div className="flex items-center space-x-2">
								<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
								<span className="text-xs text-slate-500">
									Platform Status: Online
								</span>
							</div>
						</div>
					</div>

					{}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
							Features
						</h3>
						<ul className="space-y-2">
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Live Streaming
								</span>
							</li>
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Interactive Chat
								</span>
							</li>
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Real-time Polls
								</span>
							</li>
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Screen Sharing
								</span>
							</li>
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Event Recording
								</span>
							</li>
						</ul>
					</div>

					{}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
							Support
						</h3>
						<ul className="space-y-2">
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Help Center
								</span>
							</li>
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Technical Support
								</span>
							</li>
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Community Forums
								</span>
							</li>
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									Contact Us
								</span>
							</li>
							<li>
								<span className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
									System Status
								</span>
							</li>
						</ul>
					</div>

					{}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
							Event Info
						</h3>
						<div className="space-y-3">
							<div className="flex items-center space-x-2">
								<FiClock className="w-4 h-4 text-slate-400" />
								<span className="text-sm text-slate-600">
									{currentTime.toLocaleTimeString()}
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<FiUsers className="w-4 h-4 text-slate-400" />
								<span className="text-sm text-slate-600">
									238 Active Participants
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<FiWifi className="w-4 h-4 text-emerald-500" />
								<span className="text-sm text-slate-600">
									Excellent Connection
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<FiGlobe className="w-4 h-4 text-slate-400" />
								<span className="text-sm text-slate-600">Global Event</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="border-t border-slate-200 bg-slate-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
						<div className="flex items-center space-x-4">
							<span className="text-xs text-slate-500">
								Built for seamless virtual experiences
							</span>
							<div className="hidden sm:flex items-center space-x-1">
								<span className="text-xs text-slate-400">•</span>
								<span className="text-xs text-slate-500">Privacy Policy</span>
								<span className="text-xs text-slate-400">•</span>
								<span className="text-xs text-slate-500">Terms of Service</span>
								<span className="text-xs text-slate-400">•</span>
								<span className="text-xs text-slate-500">Accessibility</span>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-3">
								<Button
									variant="ghost"
									size="xs"
									className="!p-1"
									tooltip="Share on Social Media"
								>
									<FiShare2 className="w-4 h-4 text-slate-400" />
								</Button>
								<Button
									variant="ghost"
									size="xs"
									className="!p-1"
									tooltip="Help & Support"
								>
									<FiHelpCircle className="w-4 h-4 text-slate-400" />
								</Button>
								<Button
									variant="ghost"
									size="xs"
									className="!p-1"
									tooltip="Platform Settings"
								>
									<FiSettings className="w-4 h-4 text-slate-400" />
								</Button>
							</div>

							<div className="flex items-center space-x-2 text-xs text-slate-500">
								<span>Powered by modern web technology</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

const FiGlobe = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className || ""}
	>
		<circle cx="12" cy="12" r="10"></circle>
		<line x1="2" y1="12" x2="22" y2="12"></line>
		<path d="m2 12 l2.5 2.5 L12 12 l7.5 2.5 L22 12"></path>
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
	</svg>
);

const FiHelpCircle = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className || ""}
	>
		<circle cx="12" cy="12" r="10"></circle>
		<path d="m9 9 6 6"></path>
		<path d="M9.55 9.55a4 4 0 1 0 4.9 4.9"></path>
	</svg>
);
const AppHeader = ({
	currentMode,
	onToggleMode,
	onToggleSidebar,
	viewerCount = 238,
	eventInfo,
	elapsedTime,
	isRecording = false,
	onToggleRecording,
	onShare,
	onInvite,
	connectionStatus = "excellent",
}: {
	currentMode: ViewMode;
	onToggleMode: (mode: ViewMode) => void;
	onToggleSidebar: () => void;
	viewerCount?: number;
	eventInfo: EventInfo;
	elapsedTime: number;
	isRecording?: boolean;
	onToggleRecording?: () => void;
	onShare?: () => void;
	onInvite?: () => void;
	connectionStatus?: ConnectionStatus;
}) => (
	<header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
		<div className="flex items-center">
			<div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shadow-lg">
				<FiVideo className="text-white w-5 h-5 sm:w-6 sm:h-6" />
			</div>
			<div className="ml-3 sm:ml-4">
				<h1 className="font-bold text-slate-900 text-lg sm:text-2xl">
					EventHub
				</h1>
				<div className="hidden md:flex items-center mt-0.5">
					<div
						className={`w-1.5 h-1.5 bg-${CONNECTION_COLORS[connectionStatus]} rounded-full animate-pulse mr-1.5`}
					></div>
					<p className="text-xs text-slate-500 font-medium">Live Event</p>
					<span className="mx-1.5 text-slate-300">•</span>
					<div className="flex items-center">
						<FiUser className="w-3 h-3 text-slate-400 mr-1" />
						<p className="text-xs text-slate-500 font-medium">
							{viewerCount} viewers
						</p>
					</div>
					<span className="mx-1.5 text-slate-300 hidden sm:inline-block">
						•
					</span>
					<p className="text-xs text-slate-500 font-medium hidden sm:inline-block">
						{formatDuration(elapsedTime)}
					</p>
				</div>
			</div>
		</div>

		<div className="flex items-center gap-2 sm:gap-4">
			{isRecording && (
				<Badge
					variant="error"
					pulse
					className="hidden sm:flex"
					onClick={onToggleRecording}
				>
					REC
				</Badge>
			)}

			<Button
				variant="outline"
				size="sm"
				className="hidden sm:flex"
				icon={<FiShare2 className="w-4 h-4" />}
				onClick={onShare}
			>
				Share
			</Button>

			<Button
				variant="outline"
				size="sm"
				className="hidden md:flex"
				icon={<FiUsers className="w-4 h-4" />}
				onClick={onInvite}
			>
				Invite
			</Button>

			<div className="hidden lg:flex items-center p-1 bg-slate-100 rounded-lg shadow-inner">
				{(["webinar", "viewer"] as ViewMode[]).map((mode) => (
					<button
						key={mode}
						onClick={() => onToggleMode(mode)}
						className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
							currentMode === mode
								? "bg-white text-indigo-700 shadow-sm border border-slate-200"
								: "text-slate-600 hover:bg-white/50"
						}`}
					>
						{mode === "webinar" ? "Host View" : "Attendee View"}
					</button>
				))}
			</div>

			<Badge variant="live" pulse className="hidden sm:flex">
				LIVE NOW
			</Badge>

			<Button
				variant="primary"
				onClick={onToggleSidebar}
				className="p-2.5"
				icon={<FiMenu className="w-5 h-5" />}
				tooltip="Event Panel"
			/>
		</div>
	</header>
);

const ModeToggle = ({
	currentMode,
	onToggleMode,
}: {
	currentMode: ViewMode;
	onToggleMode: (mode: ViewMode) => void;
}) => (
	<div className="lg:hidden p-3 sm:p-4 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
		<div className="flex items-center p-1 bg-slate-100 rounded-lg shadow-inner">
			{(["webinar", "viewer"] as ViewMode[]).map((mode) => (
				<button
					key={mode}
					onClick={() => onToggleMode(mode)}
					className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
						currentMode === mode
							? "bg-white text-indigo-700 shadow-sm border border-slate-200"
							: "text-slate-600 hover:bg-white/50"
					}`}
				>
					{mode === "webinar" ? "Host View" : "Attendee View"}
				</button>
			))}
		</div>
	</div>
);

const StageArea = ({
	speaker,
	isCompact = false,
	onToggleMute,
	onToggleVideo,
	onToggleFullscreen,
	onViewProfile,
	videoStatus = "playing",
}: {
	speaker: PinnedSpeaker;
	isCompact?: boolean;
	onToggleMute?: () => void;
	onToggleVideo?: () => void;
	onToggleFullscreen?: () => void;
	onViewProfile?: () => void;
	videoStatus?: VideoStatus;
}) => (
	<Card highlight>
		<div className="p-4 sm:p-6 border-b border-slate-100">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
				<div className="flex-1">
					<h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center">
						<span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
						<span className="text-red-600 font-semibold">Live Stream</span>
					</h2>
					<p className="text-slate-900 text-lg sm:text-2xl font-bold mt-1 leading-tight">
						{speaker.streamTitle}
					</p>
				</div>
				<div className="flex items-center gap-2">
					{speaker.isLive && (
						<Badge variant="live" pulse>
							LIVE
						</Badge>
					)}
					<Button
						variant="outline"
						size="sm"
						icon={<FiMoreHorizontal className="w-4 h-4" />}
						className="!p-2"
					/>
				</div>
			</div>
		</div>

		<div className="p-4 sm:p-6 pt-3 sm:pt-4">
			<VideoPlayer
				userName={speaker.name}
				isLive={speaker.isLive}
				isMuted={speaker.isMuted}
				isVideoOn={speaker.isVideoOn}
				connectionQuality={speaker.connectionQuality}
				onToggleMute={onToggleMute}
				onToggleVideo={onToggleVideo}
				onToggleFullscreen={onToggleFullscreen}
				videoStatus={videoStatus}
			/>

			<div className="flex items-center mt-4 sm:mt-6 p-4 sm:p-5 bg-indigo-50 rounded-xl border border-indigo-100">
				<Avatar
					src={speaker.avatarUrl}
					name={speaker.name}
					size="lg"
					status="online"
					connectionQuality={speaker.connectionQuality}
					showConnectionQuality={true}
				/>
				<div className="ml-4 sm:ml-5">
					<h3 className="font-bold text-slate-900 text-base sm:text-xl">
						{speaker.name}
					</h3>
					<p className="text-indigo-700 text-sm sm:text-base font-semibold">
						{speaker.role}
					</p>
				</div>
				<div className="ml-auto flex gap-2">
					<Button
						variant="primary"
						size="sm"
						className="hidden sm:flex"
						icon={<FiAward className="w-4 h-4" />}
						onClick={onViewProfile}
					>
						View Profile
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="!p-2 sm:hidden"
						icon={<FiAward className="w-4 h-4" />}
						onClick={onViewProfile}
					/>
				</div>
			</div>
		</div>
	</Card>
);

const SpotlightArea = ({
	participant,
	isCompact = false,
	onReply,
	onToggleSpotlight,
}: {
	participant: SpotlightParticipant;
	isCompact?: boolean;
	onReply?: () => void;
	onToggleSpotlight?: () => void;
}) => (
	<Card>
		<div className="p-4 sm:p-6 border-b border-slate-100">
			<h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
				<div className="p-2 sm:p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg mr-3 shadow-md">
					<FiMic className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4" />
				</div>
				Audience Spotlight
				<span className="ml-2 text-sm font-normal text-slate-500">
					{formatDuration(
						participant.secondsInSpotlight
							? participant.secondsInSpotlight * 1000
							: 0
					)}
				</span>
			</h2>
			<div className="mt-2 sm:mt-3 flex items-center justify-between">
				<p className="text-slate-700 text-sm sm:text-base font-medium italic">
					"{participant.topic}"
				</p>
				<Badge
					variant="info"
					className="hidden sm:flex"
					onClick={onToggleSpotlight}
				>
					Q&A
				</Badge>
			</div>
		</div>

		<div className="p-4 sm:p-6 pt-3 sm:pt-4">
			<VideoPlayer
				userName={participant.name}
				isLive={false}
				isMuted={false}
				isVideoOn={true}
				connectionQuality={participant.connectionQuality}
				videoStatus={participant.secondsInSpotlight ? "playing" : "buffering"}
			/>

			<div className="mt-4 sm:mt-5 p-4 sm:p-5 bg-purple-50 rounded-xl border border-purple-100">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Avatar
							src={participant.avatarUrl}
							name={participant.name}
							size="md"
							status="online"
							isRaising={participant.isHandRaised}
						/>
						<div className="ml-3 sm:ml-4">
							<h3 className="font-bold text-slate-900 text-base sm:text-lg">
								{participant.name}
							</h3>
							<p className="text-purple-700 text-xs sm:text-sm font-semibold">
								Participant
							</p>
						</div>
					</div>
					<Button
						variant="secondary"
						size="sm"
						icon={<FiMessageSquare className="w-4 h-4" />}
						onClick={onReply}
					>
						<span className="hidden sm:inline">Reply</span>
					</Button>
				</div>
			</div>
		</div>
	</Card>
);

const ParticipantsList = ({
	participants,
	className = "",
	onToggleMute,
	onSendDirectMessage,
	onPromoteToSpotlight,
	searchQuery = "",
	onSearchChange,
}: {
	participants: User[];
	className?: string;
	onToggleMute?: (userId: string) => void;
	onSendDirectMessage?: (userId: string) => void;
	onPromoteToSpotlight?: (userId: string) => void;
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
}) => {
	const [activeMenuUser, setActiveMenuUser] = useState<string | null>(null);
	const actionMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				actionMenuRef.current &&
				!actionMenuRef.current.contains(e.target as Node)
			) {
				setActiveMenuUser(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const filteredParticipants = searchQuery
		? participants.filter(
				(user) =>
					user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(user.role &&
						user.role.toLowerCase().includes(searchQuery.toLowerCase()))
		  )
		: participants;

	return (
		<Card className={className}>
			<div className="p-4 sm:p-5 border-b border-slate-100">
				<h3 className="font-bold text-slate-900 flex items-center text-base sm:text-lg">
					<div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-3 shadow-md">
						<FiUsers className="text-white w-4 h-4" />
					</div>
					Participants{" "}
					<span className="ml-2 text-sm font-semibold text-slate-500">
						({participants.length})
					</span>
				</h3>
			</div>

			<div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
				{filteredParticipants.length > 0 ? (
					filteredParticipants.map((user) => (
						<motion.div
							key={user.id}
							whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.7)" }}
							className="p-3 sm:p-4 flex items-center justify-between relative"
						>
							<div className="flex items-center">
								<Avatar
									src={user.avatarUrl}
									name={user.name}
									size="sm"
									status={user.status}
									connectionQuality={user.connectionQuality}
									onClick={() =>
										onPromoteToSpotlight && onPromoteToSpotlight(user.id)
									}
								/>
								<div className="ml-3 sm:ml-4">
									<p className="font-medium text-slate-900 text-sm sm:text-base flex items-center">
										{user.name}
										{user.recentlyActive && (
											<Badge
												variant="info"
												className="ml-2 !py-0 !px-1.5 text-[10px]"
											>
												New
											</Badge>
										)}
									</p>
									<p
										className={`text-xs sm:text-sm font-semibold ${
											user.role === "Host"
												? "text-red-600"
												: user.role === "Moderator"
												? "text-purple-600"
												: user.role === "Presenter"
												? "text-indigo-600"
												: "text-slate-500"
										}`}
									>
										{user.role}
									</p>
								</div>
							</div>

							<div className="flex items-center">
								{user.connectionQuality && (
									<div
										className={`w-2 h-2 mr-2 rounded-full bg-${
											CONNECTION_COLORS[user.connectionQuality]
										}`}
									></div>
								)}

								<Button
									variant="outline"
									size="sm"
									className="!p-1.5 !border-slate-200"
									icon={<FiMoreHorizontal className="w-3.5 h-3.5" />}
									onClick={() =>
										setActiveMenuUser(
											activeMenuUser === user.id ? null : user.id
										)
									}
								/>

								{activeMenuUser === user.id && (
									<div
										ref={actionMenuRef}
										className="absolute right-12 top-4 z-10 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px]"
									>
										<button
											className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
											onClick={() => {
												onSendDirectMessage && onSendDirectMessage(user.id);
												setActiveMenuUser(null);
											}}
										>
											<FiMessageSquare className="mr-2 w-4 h-4 text-indigo-500" />
											Message
										</button>

										<button
											className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
											onClick={() => {
												onToggleMute && onToggleMute(user.id);
												setActiveMenuUser(null);
											}}
										>
											<FiVolumeX className="mr-2 w-4 h-4 text-amber-500" />
											Mute
										</button>
									</div>
								)}
							</div>
						</motion.div>
					))
				) : (
					<div className="p-4 text-center text-slate-500">
						No participants match your search
					</div>
				)}
			</div>

			<div className="p-3 border-t border-slate-100 bg-slate-50/50">
				<Button
					variant="primary"
					size="sm"
					className="w-full justify-center"
					icon={<FiUsers className="w-4 h-4" />}
				>
					View All Participants
				</Button>
			</div>
		</Card>
	);
};

const ChatSection = ({
	messages,
	onSendMessage,
	currentUser,
	onReactToMessage,
	onDeleteMessage,
}: {
	messages: ChatMessage[];
	onSendMessage: (text: string) => void;
	currentUser: User;
	onReactToMessage?: (messageId: string, reaction: string) => void;
	onDeleteMessage?: (messageId: string) => void;
}) => {
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(
		null
	);
	const messageMenuRef = useRef<HTMLDivElement>(null);

	const handleSend = () => {
		if (newMessage.trim()) {
			onSendMessage(newMessage.trim());
			setNewMessage("");
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (Math.random() < 0.1) {
				setIsTyping(true);
				setTimeout(() => setIsTyping(false), 3000);
			}
		}, 8000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				messageMenuRef.current &&
				!messageMenuRef.current.contains(e.target as Node)
			) {
				setActiveMessageMenu(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	const REACTIONS = ["👍", "❤️", "😂", "🎉", "🚀", "👏"];

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
				{messages.map((msg) => (
					<motion.div
						key={msg.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className={`group flex ${
							msg.user.id === currentUser.id ? "justify-end" : "justify-start"
						}`}
					>
						<div className="relative">
							<div
								className={`max-w-[85%] p-3 sm:p-4 rounded-2xl shadow-sm ${
									msg.user.id === currentUser.id
										? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
										: "bg-white border border-slate-200 text-slate-800"
								}`}
							>
								{msg.user.id !== currentUser.id && (
									<div className="flex items-center mb-2">
										<Avatar
											src={msg.user.avatarUrl}
											name={msg.user.name}
											size="sm"
											className="mr-2"
											status={msg.user.status}
										/>
										<div>
											<span className="text-sm font-semibold text-slate-900">
												{msg.user.name}
											</span>
											<p
												className={`text-xs ${
													msg.user.id === currentUser.id
														? "text-indigo-200"
														: "text-slate-500"
												}`}
											>
												{msg.user.role}
											</p>
										</div>
									</div>
								)}
								<p className="text-sm sm:text-base leading-relaxed">
									{msg.text}
								</p>
								<div className="flex justify-between items-center mt-1.5">
									<p
										className={`text-xs ${
											msg.user.id === currentUser.id
												? "text-indigo-200"
												: "text-slate-400"
										}`}
									>
										{formatRelativeTime(msg.timestamp)}
									</p>

									{}
									<Button
										variant="ghost"
										size="xs"
										className={`!p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
											msg.user.id === currentUser.id
												? "text-indigo-200"
												: "text-slate-400"
										}`}
										icon={<FiMoreHorizontal className="w-3 h-3" />}
										onClick={() =>
											setActiveMessageMenu(
												activeMessageMenu === msg.id ? null : msg.id
											)
										}
									/>

									{}
									{activeMessageMenu === msg.id && (
										<div
											ref={messageMenuRef}
											className="absolute right-0 top-full mt-1 z-10 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px]"
										>
											<div className="px-2 py-1">
												<div className="flex flex-wrap gap-1">
													{REACTIONS.map((reaction) => (
														<button
															key={reaction}
															className="p-1 hover:bg-slate-100 rounded"
															onClick={() => {
																onReactToMessage &&
																	onReactToMessage(msg.id, reaction);
																setActiveMessageMenu(null);
															}}
														>
															{reaction}
														</button>
													))}
												</div>
											</div>
											<hr className="my-1" />
											<button
												className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
												onClick={() => {
													navigator.clipboard.writeText(msg.text);
													setActiveMessageMenu(null);
												}}
											>
												<FiCopy className="mr-2 w-4 h-4" />
												Copy text
											</button>

											{msg.user.id === currentUser.id && (
												<button
													className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center text-red-600"
													onClick={() => {
														onDeleteMessage && onDeleteMessage(msg.id);
														setActiveMessageMenu(null);
													}}
												>
													<FiX className="mr-2 w-4 h-4" />
													Delete
												</button>
											)}
										</div>
									)}
								</div>
							</div>

							{}
							{msg.reactions && msg.reactions.length > 0 && (
								<div
									className={`flex mt-1 ${
										msg.user.id === currentUser.id
											? "justify-end"
											: "justify-start"
									}`}
								>
									<div className="flex bg-white rounded-full shadow-sm border border-slate-200 px-1 py-0.5">
										{msg.reactions.map((reaction, idx) => (
											<motion.button
												key={idx}
												whileHover={{ scale: 1.2 }}
												whileTap={{ scale: 0.9 }}
												className={`px-1 rounded-full ${
													reaction.reacted ? "bg-indigo-100" : ""
												}`}
												onClick={() =>
													onReactToMessage &&
													onReactToMessage(msg.id, reaction.type)
												}
											>
												<span className="text-xs">{reaction.type}</span>
												<span className="ml-0.5 text-[10px] text-slate-600">
													{reaction.count}
												</span>
											</motion.button>
										))}
									</div>
								</div>
							)}
						</div>
					</motion.div>
				))}

				{}
				{isTyping && (
					<div className="flex justify-start">
						<div className="max-w-[85%] p-3 rounded-2xl bg-white border border-slate-200 flex items-center space-x-2">
							<div className="flex space-x-1">
								<motion.div
									className="w-2 h-2 bg-slate-400 rounded-full"
									animate={{ y: [0, -5, 0] }}
									transition={{
										repeat: Infinity,
										duration: 0.8,
										repeatType: "loop",
									}}
								/>
								<motion.div
									className="w-2 h-2 bg-slate-400 rounded-full"
									animate={{ y: [0, -5, 0] }}
									transition={{
										repeat: Infinity,
										duration: 0.8,
										delay: 0.2,
										repeatType: "loop",
									}}
								/>
								<motion.div
									className="w-2 h-2 bg-slate-400 rounded-full"
									animate={{ y: [0, -5, 0] }}
									transition={{
										repeat: Infinity,
										duration: 0.8,
										delay: 0.4,
										repeatType: "loop",
									}}
								/>
							</div>
							<span className="text-xs text-slate-500">
								Someone is typing...
							</span>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			<div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
				<div className="flex gap-2">
					<input
						type="text"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSend()}
						placeholder="Type your message..."
						className="flex-1 p-3 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm border border-slate-200 text-slate-900 placeholder-slate-500"
					/>
					<Button
						variant="primary"
						onClick={handleSend}
						disabled={!newMessage.trim()}
						className="p-3 !px-4"
						icon={<FiSend className="w-4 h-4" />}
					/>
				</div>
				<div className="flex justify-between items-center mt-3 px-2 text-xs text-slate-500">
					<p>Messages are moderated</p>
					<p className="flex items-center">
						<FiClock className="w-3 h-3 mr-1" /> Chat updates in real-time
					</p>
				</div>
			</div>
		</div>
	);
};

const PollsSection = ({
	polls,
	onVote,
	onCreatePoll,
}: {
	polls: Poll[];
	onVote: (pollId: string, optionId: string) => void;
	onCreatePoll?: () => void;
}) => {
	const [focusedPoll, setFocusedPoll] = useState<string | null>(null);

	const hasVotedInAllPolls = polls.every((poll) => poll.userVotedOptionId);

	useEffect(() => {
		if (polls.length > 0 && !hasVotedInAllPolls) {
			const firstUnvotedPoll = polls.find((poll) => !poll.userVotedOptionId);
			if (firstUnvotedPoll) {
				setFocusedPoll(firstUnvotedPoll.id);
			}
		}
	}, [polls, hasVotedInAllPolls]);

	return (
		<div className="h-full overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-5">
			{polls.map((poll) => {
				const totalVotes = poll.options.reduce(
					(sum, opt) => sum + opt.votes,
					0
				);
				const hasVoted = !!poll.userVotedOptionId;
				const isFocused = focusedPoll === poll.id;

				return (
					<motion.div
						key={poll.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className={`bg-white rounded-xl border ${
							isFocused
								? "border-indigo-300 ring-4 ring-indigo-100/50"
								: "border-slate-200"
						} overflow-hidden shadow-lg`}
					>
						<div className="p-4 sm:p-5 border-b border-slate-100">
							<div className="flex justify-between items-start">
								<h4 className="font-bold text-slate-900 text-base sm:text-lg">
									{poll.question}
								</h4>
								{!poll.isOpen ? (
									<Badge variant="default">Closed</Badge>
								) : (
									<Badge variant="success">Active</Badge>
								)}
							</div>
							<div className="flex justify-between mt-1">
								<p className="text-xs text-slate-500 flex items-center">
									<FiUser className="mr-1 w-3 h-3" /> {totalVotes} votes
								</p>
								<p className="text-xs text-slate-500">
									{formatRelativeTime(poll.createdAt)}
								</p>
							</div>
						</div>

						<div className="p-4 sm:p-5">
							<div className="space-y-3">
								{poll.options.map((option) => {
									const percentage =
										totalVotes > 0
											? Math.round((option.votes / totalVotes) * 100)
											: 0;
									const hasVotedForThisOption =
										poll.userVotedOptionId === option.id;

									return (
										<div key={option.id} className="space-y-2">
											<motion.button
												whileHover={
													poll.isOpen && !poll.userVotedOptionId
														? { scale: 1.01 }
														: {}
												}
												whileTap={
													poll.isOpen && !poll.userVotedOptionId
														? { scale: 0.99 }
														: {}
												}
												onClick={() =>
													poll.isOpen &&
													!poll.userVotedOptionId &&
													onVote(poll.id, option.id)
												}
												disabled={!poll.isOpen || !!poll.userVotedOptionId}
												className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all ${
													hasVotedForThisOption
														? "border-indigo-500 ring-4 ring-indigo-500/10 bg-indigo-50"
														: "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
												} ${hasVoted ? "cursor-default" : "hover:shadow-md"}`}
											>
												<div className="flex justify-between items-center">
													<span
														className={`font-semibold text-sm sm:text-base ${
															hasVotedForThisOption
																? "text-indigo-700"
																: "text-slate-800"
														}`}
													>
														{option.text}
													</span>

													<div className="flex items-center">
														{hasVoted && (
															<span
																className={`text-sm font-bold mr-2 ${
																	hasVotedForThisOption
																		? "text-indigo-700"
																		: "text-slate-700"
																}`}
															>
																{percentage}%
															</span>
														)}

														{hasVotedForThisOption && (
															<div className="bg-indigo-100 p-1 rounded-full">
																<FiCheckCircle className="text-indigo-600 w-4 h-4" />
															</div>
														)}
													</div>
												</div>
											</motion.button>

											{hasVoted && (
												<div className="w-full h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
													<motion.div
														initial={{ width: 0 }}
														animate={{ width: `${percentage}%` }}
														transition={{ duration: 0.8, ease: "easeOut" }}
														className="h-full rounded-full"
														style={{ backgroundColor: option.color }}
													/>
												</div>
											)}
										</div>
									);
								})}
							</div>

							{poll.userVotedOptionId ? (
								<div className="mt-4 sm:mt-5 flex items-center justify-center p-2 sm:p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-700 text-sm">
									<FiCheckCircle className="mr-2" />
									<span className="font-medium">Thanks for voting!</span>
								</div>
							) : poll.isOpen ? (
								<div className="mt-4 sm:mt-5 text-center text-sm text-slate-600">
									<p>Select an option to cast your vote</p>
								</div>
							) : (
								<div className="mt-4 sm:mt-5 text-center text-sm text-slate-600">
									<p>This poll is now closed</p>
								</div>
							)}
						</div>
					</motion.div>
				);
			})}

			{polls.length === 0 && (
				<div className="flex flex-col items-center justify-center h-full p-6 text-center">
					<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
						<FiBarChart2 className="w-8 h-8 text-slate-400" />
					</div>
					<h3 className="text-lg font-semibold text-slate-800 mb-2">
						No active polls
					</h3>
					<p className="text-slate-600 text-sm mb-4">
						There are no active polls at the moment
					</p>
					{onCreatePoll && (
						<Button
							variant="primary"
							size="md"
							icon={<FiBarChart2 className="w-4 h-4" />}
							onClick={onCreatePoll}
						>
							Create Poll
						</Button>
					)}
				</div>
			)}

			{polls.length > 0 && onCreatePoll && (
				<div className="flex justify-center">
					<Button
						variant="outline"
						size="md"
						icon={<FiBarChart2 className="w-4 h-4" />}
						onClick={onCreatePoll}
					>
						Create New Poll
					</Button>
				</div>
			)}
		</div>
	);
};

const InviteDialog = ({
	isOpen,
	onClose,
	eventInfo,
}: {
	isOpen: boolean;
	onClose: () => void;
	eventInfo: EventInfo;
}) => {
	const [copied, setCopied] = useState(false);
	const [inviteMethod, setInviteMethod] = useState<"link" | "email" | "slack">(
		"link"
	);

	const handleCopy = () => {
		navigator.clipboard.writeText(eventInfo.inviteLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-xl shadow-2xl w-full max-w-md"
			>
				<div className="p-5 border-b border-slate-200 flex justify-between items-center">
					<h2 className="text-xl font-bold text-slate-900">
						Invite Participants
					</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						icon={<FiX className="w-5 h-5" />}
						className="!p-1"
					/>
				</div>

				<div className="p-5">
					<div className="flex border border-slate-200 rounded-lg p-1 mb-5">
						{(["link", "email", "slack"] as const).map((method) => (
							<button
								key={method}
								onClick={() => setInviteMethod(method)}
								className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
									inviteMethod === method
										? "bg-white text-indigo-700 shadow-sm border border-slate-200"
										: "text-slate-600 hover:bg-white/50"
								}`}
							>
								{method === "link" && "Invite Link"}
								{method === "email" && "Email"}
								{method === "slack" && "Slack"}
							</button>
						))}
					</div>

					{inviteMethod === "link" && (
						<>
							<div className="bg-slate-50 p-3 rounded-lg mb-4">
								<p className="text-sm font-medium text-slate-900">Event Link</p>
								<p className="mt-1 text-xs text-slate-600">
									Share this link with others to invite them to the event
								</p>

								<div className="mt-3 flex">
									<input
										type="text"
										value={eventInfo.inviteLink}
										readOnly
										className="flex-1 p-2 bg-white rounded-l-md border border-slate-300 text-sm focus:ring-0 focus:border-indigo-500 outline-none text-slate-900"
									/>
									<Button
										variant={copied ? "success" : "primary"}
										onClick={handleCopy}
										className="rounded-l-none px-3"
										icon={
											copied ? (
												<FiCheckCircle className="w-4 h-4" />
											) : (
												<FiCopy className="w-4 h-4" />
											)
										}
									>
										{copied ? "Copied!" : "Copy"}
									</Button>
								</div>
							</div>

							<div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
								<div>
									<p className="text-sm font-medium text-slate-900">
										Add to calendar
									</p>
									<p className="text-xs text-slate-600">
										Export this event to your calendar
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									icon={<FiDownload className="w-4 h-4" />}
								>
									Export
								</Button>
							</div>
						</>
					)}

					{inviteMethod === "email" && (
						<>
							<div className="mb-4">
								<label className="block text-sm font-medium text-slate-700 mb-1">
									Email Addresses
								</label>
								<textarea
									placeholder="Enter email addresses (one per line)"
									rows={4}
									className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder-slate-500"
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-slate-700 mb-1">
									Message (optional)
								</label>
								<textarea
									placeholder="Add a personal message"
									rows={3}
									className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder-slate-500"
								/>
							</div>
						</>
					)}

					{inviteMethod === "slack" && (
						<div className="text-center p-4">
							<FiSlack className="w-12 h-12 text-slate-400 mx-auto mb-3" />
							<h3 className="text-lg font-semibold text-slate-900 mb-2">
								Connect with Slack
							</h3>
							<p className="text-sm text-slate-600 mb-4">
								Share this event directly to your Slack workspace
							</p>

							<Button
								variant="primary"
								size="lg"
								icon={<FiSlack className="w-5 h-5" />}
								fullWidth
							>
								Connect with Slack
							</Button>
						</div>
					)}
				</div>

				<div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>

					{inviteMethod !== "link" && (
						<Button
							variant="primary"
							icon={
								inviteMethod === "email" ? (
									<FiSend className="w-4 h-4" />
								) : (
									<FiShare2 className="w-4 h-4" />
								)
							}
						>
							{inviteMethod === "email" ? "Send Invites" : "Share"}
						</Button>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
};

const ShareDialog = ({
	isOpen,
	onClose,
	eventInfo,
}: {
	isOpen: boolean;
	onClose: () => void;
	eventInfo: EventInfo;
}) => {
	const [shareMethod, setShareMethod] = useState<
		"social" | "embed" | "download"
	>("social");
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(eventInfo.inviteLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (!isOpen) return null;

	const socialPlatforms = [
		{
			name: "Social Media 1",
			icon: "social1",
			color: "bg-blue-400",
			textColor: "text-white",
		},
		{
			name: "Social Media 2",
			icon: "social2",
			color: "bg-blue-600",
			textColor: "text-white",
		},
		{
			name: "Social Media 3",
			icon: "social3",
			color: "bg-blue-700",
			textColor: "text-white",
		},
		{
			name: "Email",
			icon: "mail",
			color: "bg-slate-100",
			textColor: "text-slate-800",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-xl shadow-2xl w-full max-w-md"
			>
				<div className="p-5 border-b border-slate-200 flex justify-between items-center">
					<h2 className="text-xl font-bold text-slate-900">Share Event</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						icon={<FiX className="w-5 h-5" />}
						className="!p-1"
					/>
				</div>

				<div className="p-5">
					<div className="flex border border-slate-200 rounded-lg p-1 mb-5">
						{(["social", "embed", "download"] as const).map((method) => (
							<button
								key={method}
								onClick={() => setShareMethod(method)}
								className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
									shareMethod === method
										? "bg-white text-indigo-700 shadow-sm border border-slate-200"
										: "text-slate-600 hover:bg-white/50"
								}`}
							>
								{method === "social" && "Social Media"}
								{method === "embed" && "Embed"}
								{method === "download" && "Download"}
							</button>
						))}
					</div>

					{shareMethod === "social" && (
						<>
							<div className="mb-4">
								<div className="grid grid-cols-2 gap-3">
									{socialPlatforms.map((platform) => (
										<button
											key={platform.name}
											className={`${platform.color} ${platform.textColor} rounded-lg p-3 text-center flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity font-medium`}
										>
											<span>{platform.name}</span>
										</button>
									))}
								</div>
							</div>

							<div className="mt-4">
								<p className="text-sm font-medium text-slate-900 mb-2">
									Share link
								</p>
								<div className="flex">
									<input
										type="text"
										value={eventInfo.inviteLink}
										readOnly
										className="flex-1 p-2 bg-slate-50 rounded-l-md border border-slate-300 text-sm focus:ring-0 focus:border-indigo-500 outline-none text-slate-900"
									/>
									<Button
										variant={copied ? "success" : "primary"}
										onClick={handleCopy}
										className="rounded-l-none px-3"
										icon={
											copied ? (
												<FiCheckCircle className="w-4 h-4" />
											) : (
												<FiCopy className="w-4 h-4" />
											)
										}
									>
										{copied ? "Copied!" : "Copy"}
									</Button>
								</div>
							</div>
						</>
					)}

					{shareMethod === "embed" && (
						<>
							<div className="bg-slate-50 p-3 rounded-lg mb-4">
								<p className="text-sm font-medium text-slate-900">Embed code</p>
								<p className="mt-1 text-xs text-slate-600">
									Copy and paste this code into your website
								</p>

								<div className="mt-3">
									<pre className="p-3 bg-slate-800 text-white rounded-md text-xs overflow-x-auto">
										{`<iframe src="${eventInfo.inviteLink}" width="100%" height="600" frameborder="0" allow="camera; microphone" allowfullscreen></iframe>`}
									</pre>
								</div>

								<Button
									variant={copied ? "success" : "primary"}
									onClick={handleCopy}
									className="mt-3 w-full"
									icon={
										copied ? (
											<FiCheckCircle className="w-4 h-4" />
										) : (
											<FiCopy className="w-4 h-4" />
										)
									}
								>
									{copied ? "Copied!" : "Copy Embed Code"}
								</Button>
							</div>

							<div className="rounded-lg border border-slate-200 p-3">
								<p className="text-sm font-medium text-slate-900">Preview</p>
								<div className="mt-2 bg-slate-100 rounded-md aspect-video flex items-center justify-center p-4">
									<div className="text-center">
										<FiVideo className="w-10 h-10 text-slate-400 mx-auto mb-2" />
										<p className="text-sm text-slate-600">{eventInfo.title}</p>
									</div>
								</div>
							</div>
						</>
					)}

					{shareMethod === "download" && (
						<div className="space-y-3">
							<div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-slate-900">
										Video Recording
									</p>
									<p className="text-xs text-slate-600">
										Download the recording after the event
									</p>
								</div>
								<Button
									variant="primary"
									size="sm"
									icon={<FiDownload className="w-4 h-4" />}
									disabled={true}
									tooltip="Available after event ends"
								>
									Download
								</Button>
							</div>

							<div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-slate-900">
										Event Transcript
									</p>
									<p className="text-xs text-slate-600">
										Text transcript of the event
									</p>
								</div>
								<Button
									variant="primary"
									size="sm"
									icon={<FiDownload className="w-4 h-4" />}
									disabled={true}
									tooltip="Available after event ends"
								>
									Download
								</Button>
							</div>

							<div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-slate-900">
										Poll Results
									</p>
									<p className="text-xs text-slate-600">
										CSV file with poll results
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									icon={<FiDownload className="w-4 h-4" />}
								>
									Download
								</Button>
							</div>

							<div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-slate-900">Chat Log</p>
									<p className="text-xs text-slate-600">
										Complete chat history
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									icon={<FiDownload className="w-4 h-4" />}
								>
									Download
								</Button>
							</div>
						</div>
					)}
				</div>

				<div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end rounded-b-xl">
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
				</div>
			</motion.div>
		</motion.div>
	);
};

const CreatePollDialog = ({
	isOpen,
	onClose,
	onCreatePoll,
}: {
	isOpen: boolean;
	onClose: () => void;
	onCreatePoll: (question: string, options: string[]) => void;
}) => {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", ""]);
	const [errors, setErrors] = useState<{ question?: string; options?: string }>(
		{}
	);

	const handleOptionChange = (index: number, value: string) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const addOption = () => {
		if (options.length < 5) {
			setOptions([...options, ""]);
		}
	};

	const removeOption = (index: number) => {
		if (options.length > 2) {
			const newOptions = [...options];
			newOptions.splice(index, 1);
			setOptions(newOptions);
		}
	};

	const validateForm = () => {
		const newErrors: { question?: string; options?: string } = {};

		if (!question.trim()) {
			newErrors.question = "Question is required";
		}

		const validOptions = options.filter((opt) => opt.trim().length > 0);
		if (validOptions.length < 2) {
			newErrors.options = "At least 2 options are required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			const validOptions = options.filter((opt) => opt.trim().length > 0);
			onCreatePoll(question, validOptions);
			onClose();

			setQuestion("");
			setOptions(["", ""]);
			setErrors({});
		}
	};

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-xl shadow-2xl w-full max-w-md"
			>
				<div className="p-5 border-b border-slate-200 flex justify-between items-center">
					<h2 className="text-xl font-bold text-slate-900">Create New Poll</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						icon={<FiX className="w-5 h-5" />}
						className="!p-1"
					/>
				</div>

				<div className="p-5">
					<div className="mb-4">
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Question
						</label>
						<input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							placeholder="Enter your poll question"
							className={`w-full p-3 bg-slate-50 rounded-lg border ${
								errors.question
									? "border-red-300 ring-red-100"
									: "border-slate-200"
							} text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900`}
						/>
						{errors.question && (
							<p className="text-red-500 text-xs mt-1">{errors.question}</p>
						)}
					</div>

					<div className="mb-4">
						<div className="flex justify-between items-center mb-1">
							<label className="block text-sm font-medium text-slate-700">
								Options
							</label>
							<span className="text-xs text-slate-500">
								{options.length}/5 options
							</span>
						</div>

						{options.map((option, index) => (
							<div key={index} className="flex items-center mb-2">
								<input
									type="text"
									value={option}
									onChange={(e) => handleOptionChange(index, e.target.value)}
									placeholder={`Option ${index + 1}`}
									className={`flex-1 p-3 bg-slate-50 rounded-lg border ${
										errors.options ? "border-red-300" : "border-slate-200"
									} text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900`}
								/>
								{options.length > 2 && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removeOption(index)}
										icon={<FiX className="w-4 h-4" />}
										className="ml-2 !p-2"
									/>
								)}
							</div>
						))}

						{errors.options && (
							<p className="text-red-500 text-xs mt-1">{errors.options}</p>
						)}

						{options.length < 5 && (
							<Button
								variant="outline"
								size="sm"
								onClick={addOption}
								icon={<FiPlus className="w-4 h-4" />}
								className="mt-2 w-full"
							>
								Add Option
							</Button>
						)}
					</div>

					<div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 text-sm">
						<FiInfo className="w-5 h-5 mr-2 text-blue-500" />
						<p>
							Polls are visible to all participants and results update in
							real-time.
						</p>
					</div>
				</div>

				<div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="primary"
						icon={<FiBarChart2 className="w-4 h-4" />}
						onClick={handleSubmit}
					>
						Create Poll
					</Button>
				</div>
			</motion.div>
		</motion.div>
	);
};

const FiInfo = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className || ""}
	>
		<circle cx="12" cy="12" r="10"></circle>
		<line x1="12" y1="16" x2="12" y2="12"></line>
		<line x1="12" y1="8" x2="12.01" y2="8"></line>
	</svg>
);

const FiPlus = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className || ""}
	>
		<line x1="12" y1="5" x2="12" y2="19"></line>
		<line x1="5" y1="12" x2="19" y2="12"></line>
	</svg>
);

const ProfileDialog = ({
	isOpen,
	onClose,
	user,
}: {
	isOpen: boolean;
	onClose: () => void;
	user: User;
}) => {
	if (!isOpen || !user) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
			>
				<div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

				<div className="px-6 pb-6 -mt-12">
					<div className="flex justify-between items-start">
						<Avatar
							src={user.avatarUrl}
							name={user.name}
							size="xl"
							className="border-4 border-white"
							status={user.status}
						/>

						<Button
							variant="ghost"
							size="sm"
							onClick={onClose}
							icon={<FiX className="w-5 h-5" />}
							className="!p-1 bg-white shadow-sm"
						/>
					</div>

					<div className="mt-3">
						<h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
						<p
							className={`text-sm font-semibold ${
								user.role === "Host"
									? "text-red-600"
									: user.role === "Moderator"
									? "text-purple-600"
									: user.role === "Presenter"
									? "text-indigo-600"
									: "text-slate-600"
							}`}
						>
							{user.role}
						</p>
					</div>

					<div className="grid grid-cols-3 gap-3 mt-5">
						<div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
							<p className="text-lg font-bold text-slate-900">12</p>
							<p className="text-xs text-slate-600">Events</p>
						</div>
						<div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
							<p className="text-lg font-bold text-slate-900">3.2K</p>
							<p className="text-xs text-slate-600">Followers</p>
						</div>
						<div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
							<p className="text-lg font-bold text-slate-900">98%</p>
							<p className="text-xs text-slate-600">Satisfaction</p>
						</div>
					</div>

					<div className="mt-5 space-y-4">
						<div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
							<h3 className="text-sm font-semibold text-slate-900">About</h3>
							<p className="mt-1 text-sm text-slate-600">
								{user.role === "Keynote Speaker"
									? "Expert in digital transformation and hybrid work strategies with 15+ years of experience in corporate event management."
									: "Active participant in virtual events focusing on community engagement and online collaboration."}
							</p>
						</div>

						<div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
							<h3 className="text-sm font-semibold text-slate-900">
								Connection Status
							</h3>
							<div className="flex items-center mt-1">
								<div
									className={`w-2 h-2 rounded-full bg-${
										CONNECTION_COLORS[user.connectionQuality || "good"]
									}`}
								></div>
								<p className="ml-2 text-sm text-slate-600 capitalize">
									{user.connectionQuality || "Good"} Connection
								</p>
							</div>
						</div>
					</div>

					<div className="mt-6 flex gap-3">
						<Button
							variant="primary"
							icon={<FiMessageSquare className="w-4 h-4" />}
							fullWidth
						>
							Message
						</Button>
						<Button
							variant="outline"
							icon={<FiShare2 className="w-4 h-4" />}
							fullWidth
						>
							Share Profile
						</Button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

const FiSearch = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className || ""}
	>
		<circle cx="11" cy="11" r="8"></circle>
		<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
	</svg>
);

const WebinarView = ({
	speaker,
	spotlightParticipant,
	participants,
	onToggleMute,
	onToggleVideo,
	onToggleFullscreen,
	onViewProfile,
	onToggleSpotlight,
	onReplyToSpotlight,
	videoStatus = "playing",
}: {
	speaker: PinnedSpeaker;
	spotlightParticipant: SpotlightParticipant | null;
	participants: User[];
	onToggleMute?: () => void;
	onToggleVideo?: () => void;
	onToggleFullscreen?: () => void;
	onViewProfile?: () => void;
	onToggleSpotlight?: () => void;
	onReplyToSpotlight?: () => void;
	videoStatus?: VideoStatus;
}) => (
	<div className="grid grid-cols-1 gap-5 sm:gap-6">
		<div className="space-y-5 sm:space-y-6">
			<StageArea
				speaker={speaker}
				onToggleMute={onToggleMute}
				onToggleVideo={onToggleVideo}
				onToggleFullscreen={onToggleFullscreen}
				onViewProfile={onViewProfile}
				videoStatus={videoStatus}
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
				{spotlightParticipant && (
					<SpotlightArea
						participant={spotlightParticipant}
						onReply={onReplyToSpotlight}
						onToggleSpotlight={onToggleSpotlight}
					/>
				)}
				<ParticipantsList
					participants={participants}
					onToggleMute={(userId) => console.log(`Mute participant: ${userId}`)}
					onSendDirectMessage={(userId) =>
						console.log(`Message participant: ${userId}`)
					}
					onPromoteToSpotlight={(userId) =>
						console.log(`Spotlight participant: ${userId}`)
					}
				/>
			</div>
		</div>
	</div>
);

const ViewerView = ({
	speaker,
	spotlightParticipant,
	participants,
	onToggleMute,
	onToggleVideo,
	onToggleFullscreen,
	onViewProfile,
	videoStatus = "playing",
}: {
	speaker: PinnedSpeaker;
	spotlightParticipant: SpotlightParticipant | null;
	participants: User[];
	onToggleMute?: () => void;
	onToggleVideo?: () => void;
	onToggleFullscreen?: () => void;
	onViewProfile?: () => void;
	videoStatus?: VideoStatus;
}) => {
	const [isHandRaised, setIsHandRaised] = useState(false);

	const handleRaiseHand = () => {
		setIsHandRaised(!isHandRaised);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
			<div className="space-y-5 sm:space-y-6">
				<StageArea
					speaker={speaker}
					onToggleMute={onToggleMute}
					onToggleVideo={onToggleVideo}
					onToggleFullscreen={onToggleFullscreen}
					onViewProfile={onViewProfile}
					videoStatus={videoStatus}
				/>
				<ParticipantsList participants={participants.slice(0, 5)} />
			</div>
			<div className="space-y-5 sm:space-y-6">
				{spotlightParticipant ? (
					<SpotlightArea participant={spotlightParticipant} />
				) : (
					<Card className="p-6 sm:p-8 text-center">
						<div className="p-5 sm:p-6 bg-indigo-50 rounded-full inline-flex mx-auto mb-4 sm:mb-5">
							<FiStar className="text-indigo-500 w-8 h-8 sm:w-12 sm:h-12" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
							No active Q&A
						</h3>
						<p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
							The spotlight section will appear here when an audience Q&A
							session begins. Want to ask a question? Raise your hand to join
							the conversation.
						</p>
						<Button
							variant={isHandRaised ? "secondary" : "primary"}
							size="md"
							className="mt-5 mx-auto"
							icon={
								isHandRaised ? (
									<FiArrowUp className="w-4 h-4 text-white" />
								) : (
									<FiMessageSquare className="w-4 h-4" />
								)
							}
							onClick={handleRaiseHand}
						>
							{isHandRaised ? "Hand Raised" : "Raise Hand"}
						</Button>
					</Card>
				)}

				<Card className="overflow-hidden">
					<div className="p-4 sm:p-5 border-b border-slate-100">
						<h3 className="font-bold text-slate-900 flex items-center text-base sm:text-lg">
							<div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg mr-3 shadow-md">
								<FiClock className="text-white w-4 h-4" />
							</div>
							Event Schedule
						</h3>
					</div>

					<div className="p-4 sm:p-5 space-y-4">
						<div className="flex items-start">
							<div className="min-w-[40px] sm:min-w-[50px] text-center">
								<div className="bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm rounded-lg p-1 sm:p-2">
									NOW
								</div>
							</div>
							<div className="ml-3 sm:ml-4 border-l-2 border-indigo-500 pl-3 sm:pl-4 pb-4">
								<h4 className="font-semibold text-base text-slate-900">
									Keynote Presentation
								</h4>
								<p className="text-slate-600 text-sm">
									The Future of Hybrid Events
								</p>
								<p className="text-xs text-slate-500 mt-1">
									Dr. Eva Rodriguez • 45 min
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="min-w-[40px] sm:min-w-[50px] text-center">
								<p className="text-slate-500 font-medium text-xs sm:text-sm">
									11:30
								</p>
							</div>
							<div className="ml-3 sm:ml-4 border-l-2 border-slate-200 pl-3 sm:pl-4 pb-4">
								<h4 className="font-semibold text-base text-slate-900">
									Panel Discussion
								</h4>
								<p className="text-slate-600 text-sm">
									Audience Engagement Strategies
								</p>
								<p className="text-xs text-slate-500 mt-1">
									Multiple Speakers • 30 min
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="min-w-[40px] sm:min-w-[50px] text-center">
								<p className="text-slate-500 font-medium text-xs sm:text-sm">
									12:00
								</p>
							</div>
							<div className="ml-3 sm:ml-4 border-l-2 border-slate-200 pl-3 sm:pl-4">
								<h4 className="font-semibold text-base text-slate-900">
									Networking Break
								</h4>
								<p className="text-slate-600 text-sm">Virtual Meet & Greet</p>
								<p className="text-xs text-slate-500 mt-1">45 min</p>
							</div>
						</div>
					</div>

					<div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
						<span className="text-xs text-slate-500">Time zone: Local</span>
						<Button
							variant="outline"
							size="xs"
							icon={<FiDownload className="w-3 h-3" />}
						>
							Add to Calendar
						</Button>
					</div>
				</Card>

				<Card>
					<div className="p-4 sm:p-5 border-b border-slate-100">
						<h3 className="font-bold text-slate-900 flex items-center text-base sm:text-lg">
							<div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3 shadow-md">
								<FiMessageSquare className="text-white w-4 h-4" />
							</div>
							Engagement Metrics
						</h3>
					</div>

					<div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
						<div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
							<FiUser className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
							<p className="text-lg font-bold text-slate-900">238</p>
							<p className="text-xs text-slate-600">Viewers</p>
						</div>

						<div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
							<FiMessageSquare className="w-5 h-5 text-purple-500 mx-auto mb-1" />
							<p className="text-lg font-bold text-slate-900">114</p>
							<p className="text-xs text-slate-600">Messages</p>
						</div>

						<div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
							<FiBarChart2 className="w-5 h-5 text-amber-500 mx-auto mb-1" />
							<p className="text-lg font-bold text-slate-900">87%</p>
							<p className="text-xs text-slate-600">Poll Response</p>
						</div>

						<div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
							<FiThumbsUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
							<p className="text-lg font-bold text-slate-900">156</p>
							<p className="text-xs text-slate-600">Reactions</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};

const EventSidebar = ({
	onClose,
	sidebarTab,
	onTabChange,
	chatMessages,
	onSendMessage,
	currentUser,
	polls,
	onVote,
	participants,
	onCreatePoll,
	onReactToMessage,
	onDeleteMessage,
	onToggleMute,
	onSendDirectMessage,
	onPromoteToSpotlight,
	unreadCount = 0,
}: {
	onClose: () => void;
	sidebarTab: SidebarTab;
	onTabChange: (tab: SidebarTab) => void;
	chatMessages: ChatMessage[];
	onSendMessage: (text: string) => void;
	currentUser: User;
	polls: Poll[];
	onVote: (pollId: string, optionId: string) => void;
	participants: User[];
	onCreatePoll?: () => void;
	onReactToMessage?: (messageId: string, reaction: string) => void;
	onDeleteMessage?: (messageId: string) => void;
	onToggleMute?: (userId: string) => void;
	onSendDirectMessage?: (userId: string) => void;
	onPromoteToSpotlight?: (userId: string) => void;
	unreadCount?: number;
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<motion.aside
			variants={slideIn}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="fixed md:sticky inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-50 md:z-auto md:top-16 md:h-[calc(100vh-4rem)]"
		>
			<div className="flex flex-col h-full border-l border-slate-200">
				<div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
					<div className="flex justify-between items-center">
						<h2 className="text-lg sm:text-xl font-bold text-indigo-900">
							Event Panel
						</h2>
						<button
							onClick={onClose}
							className="md:hidden p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
						>
							<FiX className="w-5 h-5" />
						</button>
					</div>

					<div className="flex mt-4 bg-slate-100 p-1 rounded-lg shadow-inner">
						{(["chat", "polls", "participants"] as SidebarTab[]).map((tab) => (
							<button
								key={tab}
								onClick={() => onTabChange(tab)}
								className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center ${
									sidebarTab === tab
										? "bg-white text-indigo-700 shadow-md border border-slate-200"
										: "text-slate-600 hover:bg-white/50"
								}`}
							>
								{tab === "chat" && <FiMessageSquare className="mr-2 w-4 h-4" />}
								{tab === "polls" && <FiBarChart2 className="mr-2 w-4 h-4" />}
								{tab === "participants" && <FiUsers className="mr-2 w-4 h-4" />}
								<span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
								{tab === "chat" && unreadCount > 0 && (
									<span className="ml-1.5 flex items-center justify-center bg-red-500 text-white w-5 h-5 rounded-full text-xs font-bold">
										{unreadCount}
									</span>
								)}
							</button>
						))}
					</div>
				</div>

				<div className="flex-1 overflow-hidden min-h-0 bg-slate-50">
					{sidebarTab === "chat" && (
						<ChatSection
							messages={chatMessages}
							onSendMessage={onSendMessage}
							currentUser={currentUser}
							onReactToMessage={onReactToMessage}
							onDeleteMessage={onDeleteMessage}
						/>
					)}

					{sidebarTab === "polls" && (
						<PollsSection
							polls={polls}
							onVote={onVote}
							onCreatePoll={onCreatePoll}
						/>
					)}

					{sidebarTab === "participants" && (
						<div className="h-full overflow-y-auto">
							<div className="p-3 sm:p-4 bg-white border-b border-slate-200">
								<div className="relative">
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search participants..."
										className="w-full p-2.5 pl-9 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
									/>
									<FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
								</div>
							</div>
							<ParticipantsList
								participants={participants}
								className="rounded-none border-0 shadow-none"
								searchQuery={searchQuery}
								onSearchChange={setSearchQuery}
								onToggleMute={onToggleMute}
								onSendDirectMessage={onSendDirectMessage}
								onPromoteToSpotlight={onPromoteToSpotlight}
							/>
						</div>
					)}
				</div>
			</div>
		</motion.aside>
	);
};

const EventPlatformPage = () => {
	const [currentMode, setCurrentMode] = useState<ViewMode>("webinar");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [sidebarTab, setSidebarTab] = useState<SidebarTab>("chat");
	const [currentSpotlightIndex, setCurrentSpotlightIndex] = useState(0);
	const [chatMessages, setChatMessages] =
		useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
	const [polls, setPolls] = useState<Poll[]>(MOCK_POLLS);
	const [isRecording, setIsRecording] = useState(false);
	const [videoStatus, setVideoStatus] = useState<VideoStatus>("playing");
	const [elapsedTime, setElapsedTime] = useState(1000 * 60 * 30);
	const [unreadCount, setUnreadCount] = useState(2);

	const [showInviteDialog, setShowInviteDialog] = useState(false);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [showCreatePollDialog, setShowCreatePollDialog] = useState(false);
	const [showProfileDialog, setShowProfileDialog] = useState(false);
	const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(
		null
	);

	const [notifications, setNotifications] = useState<SystemNotification[]>([]);

	const [speakerState, setSpeakerState] =
		useState<PinnedSpeaker>(MOCK_PINNED_SPEAKER);

	const currentUser = useMemo(() => MOCK_USERS[0], []);

	useEffect(() => {
		const timer = setInterval(() => {
			setElapsedTime((prev) => prev + 1000);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const autoDismissNotifications = notifications.filter((n) => n.autoDismiss);

		if (autoDismissNotifications.length > 0) {
			const timeoutIds = autoDismissNotifications.map((notification) => {
				return setTimeout(() => {
					removeNotification(notification.id);
				}, 5000);
			});

			return () => {
				timeoutIds.forEach((id) => clearTimeout(id));
			};
		}
	}, [notifications]);

	useEffect(() => {
		if (MOCK_SPOTLIGHT_PARTICIPANTS.length > 0) {
			const timer = setTimeout(() => {
				setCurrentSpotlightIndex(
					(prev) => (prev + 1) % MOCK_SPOTLIGHT_PARTICIPANTS.length
				);

				addNotification({
					type: "info",
					message: `Spotlight changed to ${
						MOCK_SPOTLIGHT_PARTICIPANTS[
							(currentSpotlightIndex + 1) % MOCK_SPOTLIGHT_PARTICIPANTS.length
						].name
					}`,
					autoDismiss: true,
				});
			}, 15000);
			return () => clearTimeout(timer);
		}
	}, [currentSpotlightIndex]);

	useEffect(() => {
		try {
			localStorage.setItem("eventHubViewMode", currentMode);
		} catch (e) {
			console.error("Failed to save view mode to localStorage", e);
		}
	}, [currentMode]);

	useEffect(() => {
		try {
			const savedMode = localStorage.getItem(
				"eventHubViewMode"
			) as ViewMode | null;
			if (savedMode && (savedMode === "webinar" || savedMode === "viewer")) {
				setCurrentMode(savedMode);
			}
		} catch (e) {
			console.error("Failed to retrieve view mode from localStorage", e);
		}
	}, []);

	useEffect(() => {
		const handleOrientationChange = () => {
			setIsSidebarOpen(false);
		};

		window.addEventListener("orientationchange", handleOrientationChange);
		window.addEventListener("resize", handleOrientationChange);

		return () => {
			window.removeEventListener("orientationchange", handleOrientationChange);
			window.removeEventListener("resize", handleOrientationChange);
		};
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			if (Math.random() < 0.05) {
				const qualities: ConnectionStatus[] = [
					"excellent",
					"good",
					"fair",
					"poor",
					"reconnecting",
				];
				const randomQuality =
					qualities[Math.floor(Math.random() * (qualities.length - 1))];

				setSpeakerState((prev) => ({
					...prev,
					connectionQuality: randomQuality,
				}));

				if (randomQuality === "poor" || randomQuality === "reconnecting") {
					addNotification({
						type: "warning",
						message: `${speakerState.name}'s connection quality is ${randomQuality}`,
						autoDismiss: true,
					});

					if (randomQuality === "reconnecting") {
						setVideoStatus("buffering");

						setTimeout(() => {
							setSpeakerState((prev) => ({
								...prev,
								connectionQuality: "fair",
							}));
							setVideoStatus("playing");

							addNotification({
								type: "success",
								message: `${speakerState.name}'s connection has been restored`,
								autoDismiss: true,
							});
						}, 5000);
					}
				}
			}
		}, 30000);

		return () => clearInterval(timer);
	}, [speakerState.name]);

	useEffect(() => {
		const messageTimer = setInterval(() => {
			if (Math.random() < 0.3) {
				const randomUser =
					MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
				if (randomUser.id !== currentUser.id) {
					const messages = [
						"This presentation is very insightful!",
						"Can you explain more about the engagement metrics?",
						"I'm interested in learning more about hybrid event strategies.",
						"What tools do you recommend for virtual networking?",
						"Great point about audience participation!",
						"How do you handle technical difficulties during live events?",
						"I've used similar approaches with good success.",
						"Are the slides going to be available after the presentation?",
						"This aligns perfectly with our organization's goals.",
						"What's your take on asynchronous participation options?",
					];

					const newMessage: ChatMessage = {
						id: `msg${Date.now()}`,
						user: randomUser,
						text: messages[Math.floor(Math.random() * messages.length)],
						timestamp: new Date(),
						isRead: false,
						reactions: [],
					};

					setChatMessages((prev) => [...prev, newMessage]);

					if (sidebarTab !== "chat") {
						setUnreadCount((prev) => prev + 1);
					}
				}
			}
		}, 15000);

		return () => clearInterval(messageTimer);
	}, [currentUser.id, sidebarTab]);

	const currentSpotlightParticipant =
		MOCK_SPOTLIGHT_PARTICIPANTS[currentSpotlightIndex] || null;

	const addNotification = (
		notification: Omit<SystemNotification, "id" | "timestamp">
	) => {
		const newNotification: SystemNotification = {
			...notification,
			id: `notif-${Date.now()}`,
			timestamp: new Date(),
		};

		setNotifications((prev) => [...prev, newNotification]);
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const handleSendMessage = (text: string) => {
		const newMessage: ChatMessage = {
			id: `msg${Date.now()}`,
			user: currentUser,
			text,
			timestamp: new Date(),
			isRead: true,
			reactions: [],
		};
		setChatMessages((prev) => [...prev, newMessage]);
	};

	const handleVotePoll = (pollId: string, optionId: string) => {
		setPolls((prev) =>
			prev.map((poll) => {
				if (poll.id === pollId && !poll.userVotedOptionId && poll.isOpen) {
					addNotification({
						type: "success",
						message: "Your vote has been recorded",
						autoDismiss: true,
					});

					return {
						...poll,
						userVotedOptionId: optionId,
						options: poll.options.map((opt) =>
							opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
						),
					};
				}
				return poll;
			})
		);
	};

	const handleCreatePoll = (question: string, options: string[]) => {
		const newPoll: Poll = {
			id: `poll${Date.now()}`,
			question,
			options: options.map((text, index) => ({
				id: `opt-${Date.now()}-${index}`,
				text,
				votes: 0,
				color: POLL_COLORS[index % POLL_COLORS.length],
			})),
			isOpen: true,
			createdAt: new Date(),
		};

		setPolls((prev) => [...prev, newPoll]);

		addNotification({
			type: "success",
			message: "New poll created successfully",
			autoDismiss: true,
		});
	};

	const handleReactToMessage = (messageId: string, reaction: string) => {
		setChatMessages((prev) =>
			prev.map((msg) => {
				if (msg.id === messageId) {
					const existingReactionIndex = msg.reactions?.findIndex(
						(r) => r.type === reaction
					);

					if (
						existingReactionIndex !== undefined &&
						existingReactionIndex >= 0
					) {
						const updatedReactions = [...(msg.reactions || [])];
						const existingReaction = updatedReactions[existingReactionIndex];

						if (existingReaction.reacted) {
							updatedReactions[existingReactionIndex] = {
								...existingReaction,
								count: Math.max(0, existingReaction.count - 1),
								reacted: false,
							};

							if (updatedReactions[existingReactionIndex].count === 0) {
								updatedReactions.splice(existingReactionIndex, 1);
							}
						} else {
							updatedReactions[existingReactionIndex] = {
								...existingReaction,
								count: existingReaction.count + 1,
								reacted: true,
							};
						}

						return {
							...msg,
							reactions: updatedReactions,
						};
					} else {
						return {
							...msg,
							reactions: [
								...(msg.reactions || []),
								{ type: reaction, count: 1, reacted: true },
							],
						};
					}
				}
				return msg;
			})
		);
	};

	const handleDeleteMessage = (messageId: string) => {
		setChatMessages((prev) => prev.filter((msg) => msg.id !== messageId));

		addNotification({
			type: "info",
			message: "Message deleted",
			autoDismiss: true,
		});
	};

	const handleToggleMute = () => {
		setSpeakerState((prev) => ({
			...prev,
			isMuted: !prev.isMuted,
		}));

		addNotification({
			type: "info",
			message: `Speaker ${speakerState.isMuted ? "unmuted" : "muted"}`,
			autoDismiss: true,
		});
	};

	const handleToggleVideo = () => {
		setVideoStatus((prev) => (prev === "playing" ? "paused" : "playing"));
	};

	const handleToggleRecording = () => {
		setIsRecording((prev) => !prev);

		addNotification({
			type: isRecording ? "info" : "success",
			message: isRecording ? "Recording stopped" : "Recording started",
			autoDismiss: true,
		});
	};

	const handleShare = () => {
		setShowShareDialog(true);
	};

	const handleInvite = () => {
		setShowInviteDialog(true);
	};

	const handleViewProfile = () => {
		setSelectedProfileUser(speakerState);
		setShowProfileDialog(true);
	};

	useEffect(() => {
		if (sidebarTab === "chat") {
			setUnreadCount(0);

			setChatMessages((prev) =>
				prev.map((msg) => ({
					...msg,
					isRead: true,
				}))
			);
		}
	}, [sidebarTab]);

	return (
		<>
			<Head>
				<title>
					EventHub - {currentMode === "webinar" ? "Host" : "Attendee"} View
				</title>
				<meta
					name="description"
					content="Professional hybrid event platform for engaging remote audiences"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				/>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<div className="flex flex-col h-screen bg-slate-50 font-[Inter]">
				<AppHeader
					currentMode={currentMode}
					onToggleMode={setCurrentMode}
					onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
					eventInfo={EVENT_INFO}
					elapsedTime={elapsedTime}
					isRecording={isRecording}
					onToggleRecording={handleToggleRecording}
					onShare={handleShare}
					onInvite={handleInvite}
					connectionStatus={speakerState.connectionQuality}
				/>

				<ModeToggle currentMode={currentMode} onToggleMode={setCurrentMode} />

				<div className="fixed bottom-5 right-5 z-40 md:hidden">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setIsSidebarOpen(true)}
						className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center relative"
					>
						<FiMessageSquare className="w-6 h-6" />
						{unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
								{unreadCount}
							</span>
						)}
					</motion.button>
				</div>

				<div className="flex flex-1 overflow-hidden">
					<main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6">
						<div className="max-w-7xl mx-auto">
							{currentMode === "webinar" ? (
								<WebinarView
									speaker={speakerState}
									spotlightParticipant={currentSpotlightParticipant}
									participants={MOCK_USERS}
									onToggleMute={handleToggleMute}
									onToggleVideo={handleToggleVideo}
									onToggleFullscreen={() => {}}
									onViewProfile={handleViewProfile}
									onToggleSpotlight={() => {}}
									onReplyToSpotlight={() => {
										setSidebarTab("chat");
										setIsSidebarOpen(true);
									}}
									videoStatus={videoStatus}
								/>
							) : (
								<ViewerView
									speaker={speakerState}
									spotlightParticipant={currentSpotlightParticipant}
									participants={MOCK_USERS}
									onToggleMute={handleToggleMute}
									onToggleVideo={handleToggleVideo}
									onToggleFullscreen={() => {}}
									onViewProfile={handleViewProfile}
									videoStatus={videoStatus}
								/>
							)}
						</div>
						<EventFooter />
					</main>

					<AnimatePresence>
						{isSidebarOpen && (
							<EventSidebar
								onClose={() => setIsSidebarOpen(false)}
								sidebarTab={sidebarTab}
								onTabChange={setSidebarTab}
								chatMessages={chatMessages}
								onSendMessage={handleSendMessage}
								currentUser={currentUser}
								polls={polls}
								onVote={handleVotePoll}
								participants={MOCK_USERS}
								onCreatePoll={() => setShowCreatePollDialog(true)}
								onReactToMessage={handleReactToMessage}
								onDeleteMessage={handleDeleteMessage}
								onToggleMute={(userId) => {
									console.log(`Mute user ${userId}`);
									addNotification({
										type: "info",
										message: `Participant muted`,
										autoDismiss: true,
									});
								}}
								onSendDirectMessage={(userId) => {
									console.log(`Message user ${userId}`);
									addNotification({
										type: "info",
										message: `Direct messaging opened`,
										autoDismiss: true,
									});
								}}
								onPromoteToSpotlight={(userId) => {
									addNotification({
										type: "success",
										message: `Participant added to spotlight queue`,
										autoDismiss: true,
									});
								}}
								unreadCount={unreadCount}
							/>
						)}
					</AnimatePresence>
				</div>

				{}
				<ToastContainer
					notifications={notifications}
					removeNotification={removeNotification}
				/>

				{}
				<AnimatePresence>
					{showInviteDialog && (
						<InviteDialog
							isOpen={showInviteDialog}
							onClose={() => setShowInviteDialog(false)}
							eventInfo={EVENT_INFO}
						/>
					)}

					{showShareDialog && (
						<ShareDialog
							isOpen={showShareDialog}
							onClose={() => setShowShareDialog(false)}
							eventInfo={EVENT_INFO}
						/>
					)}

					{showCreatePollDialog && (
						<CreatePollDialog
							isOpen={showCreatePollDialog}
							onClose={() => setShowCreatePollDialog(false)}
							onCreatePoll={handleCreatePoll}
						/>
					)}

					{showProfileDialog && selectedProfileUser && (
						<ProfileDialog
							isOpen={showProfileDialog}
							onClose={() => setShowProfileDialog(false)}
							user={selectedProfileUser}
						/>
					)}
				</AnimatePresence>
				<style jsx global>
					{`
						button,
						a {
							cursor: pointer;
						}
					`}
				</style>
			</div>
		</>
	);
};

export default EventPlatformPage;
