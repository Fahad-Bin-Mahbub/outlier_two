"use client";

import { useState, useRef, useEffect } from "react";
import {
	Send,
	Paperclip,
	Smile,
	Moon,
	Sun,
	Search,
	Download,
	Menu,
	X,
	Image,
	Video,
	File,
	Gift,
} from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
});

type MessageType = {
	id: string;
	text: string;
	sender: "me" | "friend";
	time: Date;
	attachment?: {
		type: "image" | "file";
		url: string;
		filename?: string;
	};
	sending?: boolean;
};

type Friend = {
	id: string;
	name: string;
	pic: string;
	status: "online" | "offline";
	lastSeen?: string;
	unread?: number;
	typing?: boolean;
};

const Chat = () => {
	const [currentFriend, setCurrentFriend] = useState<string>("1");
	const [msgInput, setMsgInput] = useState("");
	const [attachment, setAttachment] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [isLoaded, setIsLoaded] = useState(false);
	const [showEmojis, setShowEmojis] = useState(false);
	const [showAttachMenu, setShowAttachMenu] = useState(false);
	const [menuOpen, setMenuOpen] = useState(true);
	const [isSending, setIsSending] = useState(false);
	const [animating, setAnimating] = useState(false);
	const [lastFriend, setLastFriend] = useState<string>("1");
	const [isDark, setIsDark] = useState(false);
	const [isSearching, setIsSearching] = useState(false);

	const bottomRef = useRef<HTMLDivElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLInputElement>(null);
	const videoRef = useRef<HTMLInputElement>(null);
	const gifRef = useRef<HTMLInputElement>(null);
	const emojiRef = useRef<HTMLDivElement>(null);
	const attachRef = useRef<HTMLDivElement>(null);
	const chatRef = useRef<HTMLDivElement>(null);

	const pics = [
		"https://randomuser.me/api/portraits/women/44.jpg",
		"https://randomuser.me/api/portraits/men/32.jpg",
		"https://randomuser.me/api/portraits/men/75.jpg",
		"https://randomuser.me/api/portraits/women/63.jpg",
		"https://randomuser.me/api/portraits/men/19.jpg",
	];

	const [friends, setFriends] = useState<Friend[]>([
		{
			id: "1",
			name: "Sarah Johnson",
			pic: pics[0],
			status: "online",
		},
		{
			id: "2",
			name: "Mike Chen",
			pic: pics[1],
			status: "online",
			unread: 1,
		},
		{
			id: "3",
			name: "Alex Rodriguez",
			pic: pics[2],
			status: "offline",
			lastSeen: "2h ago",
		},
		{
			id: "4",
			name: "Emily Wilson",
			pic: pics[3],
			status: "online",
		},
		{
			id: "5",
			name: "John Smith",
			pic: pics[4],
			status: "offline",
			lastSeen: "1d ago",
			unread: 1,
		},
	]);

	const [messagesByContact, setMessagesByContact] = useState<
		Record<string, MessageType[]>
	>({
		"1": [
			{
				id: "1-a",
				text: "Hey! How are you doing?",
				sender: "friend",
				time: new Date(Date.now() - 3600000),
			},
			{
				id: "1-b",
				text: "I'm doing great! Just finished that project we were talking about.",
				sender: "me",
				time: new Date(Date.now() - 3500000),
			},
			{
				id: "1-c",
				text: "That's awesome! Can you show me what you've done?",
				sender: "friend",
				time: new Date(Date.now() - 3400000),
			},
			{
				id: "1-d",
				text: "Sure, here's a screenshot of the homepage:",
				sender: "me",
				time: new Date(Date.now() - 3300000),
				attachment: {
					type: "image",
					url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
				},
			},
			{
				id: "1-e",
				text: "This looks amazing! I love the clean design.",
				sender: "friend",
				time: new Date(Date.now() - 3200000),
			},
		],
		"2": [
			{
				id: "2-a",
				text: "Hey, are we still on for coffee tomorrow?",
				sender: "friend",
				time: new Date(Date.now() - 86400000),
			},
			{
				id: "2-b",
				text: "Yes, definitely! Looking forward to it.",
				sender: "me",
				time: new Date(Date.now() - 82800000),
			},
			{
				id: "2-c",
				text: "Great! How about 10 AM at the usual place?",
				sender: "friend",
				time: new Date(Date.now() - 79200000),
			},
		],
		"3": [
			{
				id: "3-a",
				text: "Did you get a chance to review those documents?",
				sender: "friend",
				time: new Date(Date.now() - 172800000),
			},
			{
				id: "3-b",
				text: "Yes, everything looks good to me!",
				sender: "me",
				time: new Date(Date.now() - 169200000),
			},
		],
		"4": [
			{
				id: "4-a",
				text: "Happy birthday! 🎂",
				sender: "me",
				time: new Date(Date.now() - 604800000),
			},
			{
				id: "4-b",
				text: "Thank you so much! 😊",
				sender: "friend",
				time: new Date(Date.now() - 601200000),
			},
		],
		"5": [
			{
				id: "5-a",
				text: "Can you send me the presentation for tomorrow?",
				sender: "friend",
				time: new Date(Date.now() - 86400000),
			},
		],
	});

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messagesByContact[currentFriend], currentFriend]);

	useEffect(() => {
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview);
			}
		};
	}, []);

	useEffect(() => {
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setIsDark(prefersDark);
	}, []);

	useEffect(() => {
		setFriends((prevFriends) =>
			prevFriends.map((friend) =>
				friend.id === currentFriend ? { ...friend, unread: 0 } : friend
			)
		);

		if (window.innerWidth < 768) {
			setMenuOpen(false);
		}
	}, [currentFriend]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				showEmojis &&
				emojiRef.current &&
				!emojiRef.current.contains(event.target as Node) &&
				event.target instanceof Node &&
				event.target instanceof Element &&
				!event.target.closest(".EmojiPickerReact")
			) {
				setShowEmojis(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showEmojis]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setMenuOpen(true);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.style.scrollBehavior = "smooth";
		}
	}, []);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				showAttachMenu &&
				attachRef.current &&
				!attachRef.current.contains(event.target as Node)
			) {
				setShowAttachMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showAttachMenu]);

	const handleSendMessage = () => {
		if (!msgInput.trim() && !attachment) return;

		const now = new Date();
		let media;

		if (attachment && preview) {
			const isImage = attachment.type.startsWith("image/");
			media = {
				type: isImage ? "image" : "file",
				url: preview,
				filename: isImage ? undefined : attachment.name,
			};
		}

		const uniqueId = `${currentFriend}-${Date.now()}-${Math.random()
			.toString(36)
			.substring(2, 9)}`;

		const newMsg: MessageType = {
			id: uniqueId,
			text: msgInput,
			sender: "me",
			time: now,
			attachment: media as {
				type: "image" | "file";
				url: string;
				filename: string;
			},
			sending: true,
		};

		setMessagesByContact((prev) => ({
			...prev,
			[currentFriend]: [...prev[currentFriend], newMsg],
		}));

		setIsSending(true);

		setTimeout(() => {
			setMessagesByContact((prev) => ({
				...prev,
				[currentFriend]: prev[currentFriend].map((msg) =>
					msg.id === uniqueId ? { ...msg, sending: false } : msg
				),
			}));
			setIsSending(false);
		}, 1000);

		setMsgInput("");
		setAttachment(null);
		setPreview(null);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (preview) {
			URL.revokeObjectURL(preview);
		}

		setAttachment(file);
		const filePreview = URL.createObjectURL(file);
		setPreview(filePreview);
		setShowAttachMenu(false);
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			alert("Please select an image file");
			return;
		}

		if (preview) {
			URL.revokeObjectURL(preview);
		}

		setAttachment(file);
		const filePreview = URL.createObjectURL(file);
		setPreview(filePreview);
		setShowAttachMenu(false);
	};

	const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("video/")) {
			alert("Please select a video file");
			return;
		}

		if (preview) {
			URL.revokeObjectURL(preview);
		}

		setAttachment(file);
		const filePreview = URL.createObjectURL(file);
		setPreview(filePreview);
		setShowAttachMenu(false);
	};

	const handleGifChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (
			!file.type.startsWith("image/") ||
			!file.name.toLowerCase().endsWith(".gif")
		) {
			alert("Please select a GIF file");
			return;
		}

		if (preview) {
			URL.revokeObjectURL(preview);
		}

		setAttachment(file);
		const filePreview = URL.createObjectURL(file);
		setPreview(filePreview);
		setShowAttachMenu(false);
	};

	const openFileDialog = () => {
		fileRef.current?.click();
	};

	const openImageDialog = () => {
		imageRef.current?.click();
	};

	const formatMessageTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	const formatDateDivider = (date: Date) => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return "Today";
		} else if (date.toDateString() === yesterday.toDateString()) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString([], { month: "short", day: "numeric" });
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const removeMediaPreview = () => {
		if (preview) {
			URL.revokeObjectURL(preview);
		}
		setAttachment(null);
		setPreview(null);
	};

	const handleEmojiSelect = (emojiData: any) => {
		setMsgInput((prev) => prev + emojiData.emoji);
		setShowEmojis(false);
	};

	const toggleEmojiPicker = () => {
		setShowEmojis((prev) => !prev);
	};

	const toggleAttachMenu = () => {
		setShowAttachMenu((prev) => !prev);
	};

	const toggleMenu = () => {
		setMenuOpen((prev) => !prev);
	};

	const toggleDarkMode = () => {
		setIsDark(!isDark);
	};

	const handleSearchClick = () => {
		setIsSearching(!isSearching);
	};

	const downloadFile = (url: string, fileName: string) => {
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName || "download";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const getLastMessageTimestamp = (contactId: string) => {
		const messages = messagesByContact[contactId];
		if (!messages || messages.length === 0) return new Date(0);
		return messages[messages.length - 1].time;
	};

	const filteredContacts = friends
		.filter((friend) => friend.name.toLowerCase().includes(query.toLowerCase()))
		.sort((a, b) => {
			const timestampA = getLastMessageTimestamp(a.id);
			const timestampB = getLastMessageTimestamp(b.id);
			return timestampB.getTime() - timestampA.getTime();
		});

	const getActiveContact = () => friends.find((f) => f.id === currentFriend);

	const handleContactChange = (contactId: string) => {
		if (contactId === currentFriend) return;

		setAnimating(true);
		setLastFriend(currentFriend);
		setCurrentFriend(contactId);

		setFriends((prevFriends) =>
			prevFriends.map((friend) =>
				friend.id === contactId ? { ...friend, unread: 0 } : friend
			)
		);

		if (window.innerWidth < 768) {
			setMenuOpen(false);
		}

		setTimeout(() => {
			setAnimating(false);
		}, 300);
	};

	if (!isLoaded) {
		return (
			<div
				className={`h-screen overflow-hidden flex items-center justify-center ${
					isDark ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
				}`}
			>
				<div className="flex flex-col items-center">
					<div className="relative w-24 h-24 mb-8">
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
						<div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
							<div className="relative w-16 h-16">
								<div className="absolute inset-0 rounded-full bg-blue-500/20"></div>
								<div className="absolute inset-1 rounded-full bg-blue-500/10"></div>
								<div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-blue-500"></div>
								<div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-blue-500"></div>
								<div className="absolute top-2 left-10 w-2 h-2 rounded-full bg-blue-500"></div>
								<div className="absolute -bottom-2 right-2 w-4 h-4 bg-blue-500/20 transform rotate-45"></div>
							</div>
						</div>
					</div>
					<div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
						ChatWithBuddy
					</div>
					<div className="relative w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-loading-bar-very-slow"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<style jsx global>{`
				@keyframes subtle-gradient {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}

				@keyframes subtle-pulse {
					0% {
						opacity: 0.8;
						transform: scale(1);
					}
					50% {
						opacity: 1;
						transform: scale(1.02);
					}
					100% {
						opacity: 0.8;
						transform: scale(1);
					}
				}

				@keyframes subtle-rotate {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}

				.logo-container {
					animation: subtle-pulse 3s ease-in-out infinite;
				}

				.logo-gradient {
					background-size: 200% 200%;
					animation: subtle-gradient 6s ease infinite;
				}

				.logo-icon {
					animation: subtle-rotate 20s linear infinite;
				}

				@keyframes gradient {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}

				.animate-gradient {
					background-size: 200% 200%;
					animation: gradient 6s ease infinite;
				}

				.chat-particle-bg {
					position: relative !important;
					overflow-y: auto !important;
					overflow-x: hidden !important;
					background: ${isDark ? "#111827" : "#ffffff"} !important;
					isolation: isolate !important;
					z-index: 0 !important;
					height: 100% !important;
				}

				.chat-particle-bg::before {
					content: "" !important;
					position: absolute !important;
					inset: 0 !important;
					pointer-events: none !important;
					${isDark
						? `
            background-image: 
              radial-gradient(2px 2px at 20% 30%, rgba(59, 130, 246, 0.15) 90%, transparent) 0 0,
              radial-gradient(2px 2px at 40% 70%, rgba(99, 102, 241, 0.15) 90%, transparent) 0 0,
              radial-gradient(2px 2px at 60% 20%, rgba(139, 92, 246, 0.15) 90%, transparent) 0 0,
              radial-gradient(2px 2px at 80% 50%, rgba(59, 130, 246, 0.15) 90%, transparent) 0 0;
            background-size: 100px 100px !important;
            opacity: 0.15 !important;
          `
						: `
            background-image: url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg') !important;
            background-repeat: repeat !important;
            background-size: 400px !important;
            opacity: 0.3 !important;
          `}
					z-index: -2 !important;
				}

				@keyframes particleMove {
					0% {
						transform: translate(0, 0) !important;
					}
					100% {
						transform: translate(-50px, -50px) !important;
					}
				}

				.message {
					opacity: 0;
					transform: translateY(20px);
					animation: messageAppear 0.3s ease forwards;
				}

				@keyframes messageAppear {
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.typing-indicator span {
					display: inline-block;
					animation: blink 1.4s infinite;
				}

				.typing-indicator span:nth-child(2) {
					animation-delay: 0.2s;
				}

				.typing-indicator span:nth-child(3) {
					animation-delay: 0.4s;
				}

				@keyframes blink {
					0% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-4px);
					}
					100% {
						transform: translateY(0);
					}
				}

				.hover-scale {
					transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.hover-scale:hover {
					transform: scale(1.02);
				}

				.active-scale:active {
					transform: scale(0.98);
				}

				.message-bubble {
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					background: transparent !important;
				}

				.message-bubble:hover {
					transform: translateY(-1px);
					box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
						0 2px 4px -1px rgba(0, 0, 0, 0.06);
				}

				.contact-item {
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.contact-item:hover {
					transform: translateX(4px);
				}

				.emoji-picker-transition {
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.emoji-picker-enter {
					opacity: 0;
					transform: scale(0.95) translateY(10px);
				}

				.emoji-picker-enter-active {
					opacity: 1;
					transform: scale(1) translateY(0);
				}

				.emoji-picker-exit {
					opacity: 1;
					transform: scale(1) translateY(0);
				}

				.emoji-picker-exit-active {
					opacity: 0;
					transform: scale(0.95) translateY(10px);
				}

				.input-focus-ring {
					transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.input-focus-ring:focus {
					box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
				}

				@keyframes shimmer {
					0% {
						background-position: -200% 0;
					}
					100% {
						background-position: 200% 0;
					}
				}

				.loading-shimmer {
					background: linear-gradient(
						90deg,
						rgba(255, 255, 255, 0.1) 25%,
						rgba(255, 255, 255, 0.2) 37%,
						rgba(255, 255, 255, 0.1) 63%
					);
					background-size: 200% 100%;
					animation: shimmer 1.4s infinite;
				}

				.loading-shimmer-dark {
					background: linear-gradient(
						90deg,
						rgba(17, 24, 39, 0.1) 25%,
						rgba(17, 24, 39, 0.2) 37%,
						rgba(17, 24, 39, 0.1) 63%
					);
				}

				@keyframes message-slide-in {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes message-fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				.message-animation {
					animation: message-slide-in 0.3s ease-out forwards;
					opacity: 0;
				}

				.message-animation:nth-child(1) {
					animation-delay: 0.1s;
				}
				.message-animation:nth-child(2) {
					animation-delay: 0.15s;
				}
				.message-animation:nth-child(3) {
					animation-delay: 0.2s;
				}
				.message-animation:nth-child(4) {
					animation-delay: 0.25s;
				}
				.message-animation:nth-child(5) {
					animation-delay: 0.3s;
				}

				.chat-background-pattern {
					display: none;
				}

				.chat-background-overlay {
					display: none;
				}

				.message-container {
					position: relative;
					z-index: 2;
					background: transparent;
				}

				.h-16 {
					background: ${isDark
						? "rgba(31, 41, 55, 0.95)"
						: "rgba(255, 255, 255, 0.95)"} !important;
					backdrop-filter: blur(12px);
					border-bottom: 1px solid
						${isDark ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.5)"};
				}

				.rounded-2xl {
					${!isDark &&
					`
            background: white !important;
            box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13) !important;
          `}
				}

				.message-sender-me .rounded-2xl {
					background: linear-gradient(
						to bottom right,
						#00a884,
						#008f73
					) !important;
				}
			`}</style>
			<div
				className={`h-screen overflow-hidden flex flex-col md:flex-row ${
					isDark
						? "bg-gray-900 text-gray-100"
						: "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
				}`}
			>
				<div
					className={`${
						menuOpen ? "block" : "hidden"
					} md:block w-full md:w-96 flex flex-col fixed md:relative z-20 h-full transition-all duration-500 ${
						isDark
							? "bg-gray-800/80 border-gray-700/50"
							: "bg-white/80 border-gray-200/50"
					} backdrop-blur-lg border-r`}
				>
					<div
						className={`p-6 ${
							isDark ? "border-gray-700/50" : "border-gray-200/50"
						} border-b`}
					>
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-4">
								<div className="relative w-11 h-11 transform hover:scale-105 transition-transform duration-300 logo-container">
									<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-5 logo-gradient"></div>
									<div className="absolute inset-[2px] rounded-xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-lg">
										<div className="relative w-7 h-7">
											<div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 logo-gradient"></div>
											<div className="absolute inset-[1.5px] rounded-lg bg-white flex items-center justify-center">
												<svg
													className="w-4 h-4 text-gray-900 logo-icon"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
													/>
													<path
														d="M20 4L20 8M20 8H16M20 8L16 4"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</div>
										</div>
									</div>
								</div>
								<div className="flex flex-col">
									<h1
										className={`text-2xl font-semibold tracking-tight ${
											isDark ? "text-white" : "text-gray-900"
										}`}
									>
										ChatWithBuddy
									</h1>
									<span className="text-xs font-medium text-gray-500 animate-fade-in">
										Secure Messaging
									</span>
								</div>
							</div>
							<div className="flex items-center justify-between w-full">
								<button
									onClick={toggleDarkMode}
									className="p-2 mx-12 rounded-full transition-all duration-300 hover:bg-gray-200"
								>
									{isDark ? (
										<Sun className="w-5 h-5 text-gray-200" />
									) : (
										<Moon className="w-5 h-5 text-gray-700" />
									)}
								</button>
							</div>
						</div>
						<div className="relative">
							<button
								onClick={handleSearchClick}
								className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
									isDark ? "text-gray-300" : "text-gray-600"
								}`}
							>
								<Search className="w-5 h-5" />
							</button>
							<input
								type="text"
								placeholder="Search conversations..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all duration-300 ${
									isDark
										? "focus:ring-blue-500/30 bg-gray-700/80 text-gray-100 placeholder-gray-300"
										: "focus:ring-blue-500/20 bg-gray-50/80 text-gray-900 placeholder-gray-500"
								} backdrop-blur-sm hover:bg-opacity-90 shadow-sm hover:shadow-md`}
							/>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto p-2 space-y-2">
						{filteredContacts.length > 0 ? (
							filteredContacts.map((contact) => (
								<div
									key={contact.id}
									onClick={() => handleContactChange(contact.id)}
									className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
										currentFriend === contact.id
											? `${
													isDark
														? "bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20"
														: "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"
											  } shadow-lg shadow-blue-500/5`
											: `${
													isDark
														? "hover:bg-gray-700/50"
														: "hover:bg-gray-50/80"
											  }`
									} transform hover:scale-[1.02] active:scale-[0.98]`}
								>
									<div className="relative">
										<img
											src={contact.pic}
											alt={contact.name}
											className="w-12 h-12 rounded-full object-cover shadow-lg ring-2 ring-white/10 transition-transform duration-200 hover:scale-105"
										/>
										{contact.status === "online" && (
											<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
										)}
									</div>
									<div className="ml-4 flex-1 min-w-0">
										<div className="flex justify-between items-center">
											<h3
												className={`font-medium truncate ${
													contact.unread
														? "font-semibold"
														: isDark
														? "text-gray-200"
														: "text-gray-800"
												}`}
											>
												{contact.name}
											</h3>
											{messagesByContact[contact.id].length > 0 && (
												<span
													className={`text-xs whitespace-nowrap ml-2 ${
														isDark ? "text-gray-300" : "text-gray-500"
													}`}
												>
													{formatMessageTime(
														messagesByContact[contact.id][
															messagesByContact[contact.id].length - 1
														].time
													)}
												</span>
											)}
										</div>
										<div className="flex justify-between items-center">
											<p
												className={`text-sm truncate max-w-[180px] ${
													contact.unread
														? "font-medium"
														: isDark
														? "text-gray-300"
														: "text-gray-600"
												}`}
											>
												{messagesByContact[contact.id].length > 0
													? messagesByContact[contact.id][
															messagesByContact[contact.id].length - 1
													  ].text ||
													  (messagesByContact[contact.id][
															messagesByContact[contact.id].length - 1
													  ].attachment?.type === "image"
															? "Sent an image"
															: messagesByContact[contact.id][
																	messagesByContact[contact.id].length - 1
															  ].attachment?.type === "file"
															? `Sent ${
																	messagesByContact[contact.id][
																		messagesByContact[contact.id].length - 1
																	].attachment?.filename
															  }`
															: "")
													: ""}
											</p>
											{contact.unread ? (
												<span
													className={`bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5 ml-2 animate-pulse`}
												>
													{contact.unread}
												</span>
											) : null}
										</div>
									</div>
								</div>
							))
						) : (
							<div
								className={`flex flex-col items-center justify-center h-full py-12 px-4 text-center ${
									isDark ? "text-gray-200" : "text-gray-600"
								}`}
							>
								<div className="relative w-20 h-20 mb-6">
									<div
										className={`absolute inset-0 rounded-xl ${
											isDark
												? "bg-gradient-to-br from-blue-900/10 to-purple-900/10"
												: "bg-gradient-to-br from-blue-500/5 to-purple-500/5"
										}`}
									></div>
									<div
										className={`absolute inset-1 rounded-lg ${
											isDark ? "bg-gray-700" : "bg-white"
										} flex items-center justify-center`}
									>
										<Search
											className={`w-8 h-8 ${
												isDark ? "text-gray-300" : "text-gray-500"
											}`}
										/>
									</div>
								</div>
								<h3
									className={`text-lg font-semibold ${
										isDark ? "text-gray-100" : "text-gray-800"
									} mb-2`}
								>
									No Contacts Found
								</h3>
								<p
									className={`text-sm max-w-xs ${
										isDark ? "text-gray-300" : "text-gray-600"
									}`}
								>
									Try adjusting your search or add new contacts to start
									chatting
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden">
					<div
						className={`h-16 px-6 flex items-center justify-between ${
							isDark ? "bg-gray-800/95" : "bg-white/95"
						} backdrop-blur-lg border-b ${
							isDark ? "border-gray-700/50" : "border-gray-200/50"
						}`}
					>
						<div className="flex items-center">
							{!menuOpen && (
								<div className="md:hidden mr-4">
									<button
										onClick={toggleMenu}
										className={`p-2 rounded-xl ${
											isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
										}`}
									>
										<Menu
											size={20}
											className={isDark ? "text-gray-200" : "text-gray-700"}
										/>
									</button>
								</div>
							)}
							<div className="relative">
								<img
									src={getActiveContact()?.pic}
									alt={getActiveContact()?.name}
									className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white"
								/>
								{getActiveContact()?.status === "online" && (
									<div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
								)}
							</div>
							<div className="ml-4">
								<h3
									className={`font-medium ${
										isDark ? "text-white" : "text-gray-900"
									}`}
								>
									{getActiveContact()?.name}
								</h3>
								<p
									className={`text-xs ${
										isDark ? "text-gray-300" : "text-gray-600"
									}`}
								>
									{getActiveContact()?.status === "online"
										? "Active now"
										: `Active ${getActiveContact()?.lastSeen}`}
								</p>
							</div>
						</div>
					</div>

					<div
						ref={chatRef}
						className="flex-1 min-h-0 p-6 overflow-y-auto scrollbar-thin relative"
						style={{
							backgroundImage: isDark
								? "url('https://i.pinimg.com/736x/d5/5d/fe/d55dfe6820a275b74f00de0a824ab9e0.jpg')"
								: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
							backgroundRepeat: "repeat",
							backgroundSize: "400px",
							opacity: isDark ? "0.85" : "1",
						}}
					>
						<div className="space-y-4 relative">
							{messagesByContact[currentFriend].map((message, index) => {
								const showDateDivider =
									index === 0 ||
									new Date(message.time).toDateString() !==
										new Date(
											messagesByContact[currentFriend][index - 1].time
										).toDateString();

								return (
									<div
										key={message.id}
										className={`message-animation ${
											message.sender === "me" ? "message-sender-me" : ""
										}`}
										style={{ animationDelay: `${index * 0.05}s` }}
									>
										{showDateDivider && (
											<div className="text-center my-6">
												<span
													className={`px-4 py-1.5 rounded-full text-xs font-medium ${
														isDark
															? "bg-gray-800/80 text-gray-200"
															: "bg-white/80 text-gray-600"
													} backdrop-blur-sm shadow-sm`}
												>
													{formatDateDivider(message.time)}
												</span>
											</div>
										)}
										<div
											className={`flex ${
												message.sender === "me"
													? "justify-end"
													: "justify-start"
											}`}
										>
											<div
												className={`flex items-end max-w-[90%] md:max-w-[75%] ${
													message.sender === "me" ? "flex-row-reverse" : ""
												}`}
											>
												{message.sender === "friend" && (
													<img
														src={getActiveContact()?.pic}
														alt={getActiveContact()?.name}
														className="w-8 h-8 rounded-full mr-2 mb-1 hidden xs:block"
													/>
												)}
												<div>
													<div
														className={`rounded-2xl px-4 py-3 ${
															message.sender === "me"
																? "rounded-br-none bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
																: isDark
																? "rounded-bl-none bg-gray-700 text-gray-100"
																: "rounded-bl-none bg-white text-gray-800"
														}`}
													>
														{message.text && (
															<p className="break-words leading-relaxed">
																{message.text}
															</p>
														)}
														{message.attachment?.type === "image" && (
															<div className="relative group">
																<img
																	src={message.attachment.url}
																	alt="Shared image"
																	className="rounded-lg mt-2 max-w-full h-auto max-h-64 object-cover transform transition-all duration-300 group-hover:scale-[1.02]"
																/>
																<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
															</div>
														)}
														{message.attachment?.type === "file" && (
															<div>
																<div
																	className={`flex items-center rounded-lg p-3 mt-2 ${
																		message.sender === "me"
																			? "bg-white/20 backdrop-blur-sm"
																			: isDark
																			? "bg-gray-600/50 backdrop-blur-sm"
																			: "bg-gray-50/80 backdrop-blur-sm"
																	} transform transition-all duration-200 hover:scale-[1.02]`}
																>
																	<Paperclip
																		size={16}
																		className={
																			message.sender === "me"
																				? "text-white/90"
																				: isDark
																				? "text-gray-200"
																				: "text-gray-700"
																		}
																	/>
																	<span className="flex flex-row ml-2 gap-1 text-sm truncate max-w-[280px]">
																		<span
																			className={`flex ${
																				message.sender === "me"
																					? "text-white"
																					: isDark
																					? "text-gray-100"
																					: "text-gray-800"
																			}`}
																		>
																			{message.attachment.filename}
																		</span>
																		<button
																			onClick={() =>
																				message.attachment &&
																				downloadFile(
																					message.attachment.url,
																					message.attachment.filename ??
																						"download"
																				)
																			}
																			className={`flex cursor-pointer items-center text-center justify-center text-xs px-1.5 py-1.5 ${
																				message.sender === "me"
																					? "bg-white/30 text-white hover:bg-white/40"
																					: isDark
																					? "bg-gray-500/30 text-gray-100 hover:bg-gray-500/40"
																					: "bg-black/10 text-gray-900 hover:bg-black/20"
																			} backdrop-blur rounded-[48px] transition-colors duration-200`}
																		>
																			<Download size={14} />
																		</button>
																	</span>
																</div>
															</div>
														)}
														<div
															className={`flex items-center justify-end mt-1 text-xs ${
																message.sender === "me"
																	? "text-white/90"
																	: isDark
																	? "text-gray-300"
																	: "text-gray-600"
															}`}
														>
															<span className="mr-1">
																{formatMessageTime(message.time)}
															</span>
															{message.sender === "me" && (
																<div className="flex flex-col">
																	{message.sending ? (
																		<span className="text-[10px] font-medium opacity-80">
																			<span className="inline-block animate-pulse">
																				Sending
																			</span>
																			<span className="inline-flex ml-0.5">
																				<span className="animate-bounce delay-100">
																					.
																				</span>
																				<span className="animate-bounce delay-200">
																					.
																				</span>
																				<span className="animate-bounce delay-300">
																					.
																				</span>
																			</span>
																		</span>
																	) : (
																		<div className="flex items-center gap-0.5">
																			<span className="text-[10px] font-medium opacity-80">
																				Sent
																			</span>
																			<svg
																				className="w-2.5 h-2.5 transform scale-90 transition-transform duration-200"
																				viewBox="0 0 24 24"
																				fill="none"
																				xmlns="http://www.w3.org/2000/svg"
																			>
																				<path
																					d="M20 6L9 17L4 12"
																					stroke="currentColor"
																					strokeWidth="2"
																					strokeLinecap="round"
																					strokeLinejoin="round"
																				/>
																			</svg>
																		</div>
																	)}
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
							<div ref={bottomRef} />
						</div>
					</div>

					<div
						className={`p-4 ${
							isDark
								? "bg-gray-800/90 border-gray-700/50"
								: "bg-white/90 border-gray-200/50"
						} backdrop-blur-lg border-t`}
					>
						{preview && (
							<div className="mb-4 relative">
								<div className="relative w-32 h-32 rounded-lg overflow-hidden group">
									<img
										src={preview}
										alt="Preview"
										className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<button
										onClick={removeMediaPreview}
										className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transform transition-all duration-200 hover:scale-110"
									>
										<X size={14} />
									</button>
								</div>
							</div>
						)}

						<div className="flex items-center gap-2">
							<div className="relative" ref={attachRef}>
								<button
									onClick={toggleAttachMenu}
									className={`p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
										isDark
											? "hover:bg-gray-700 text-gray-200 hover:text-white"
											: "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
									} transform hover:scale-105 active:scale-95`}
								>
									<Paperclip className="w-5 h-5" />
								</button>
								{showAttachMenu && (
									<div
										className={`absolute bottom-12 left-0 z-[9999] w-56 rounded-2xl shadow-xl backdrop-blur-xl ${
											isDark
												? "bg-gray-800/95 border-gray-700/50"
												: "bg-white/95 border-gray-200/50"
										} border`}
										style={{
											animation:
												"slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
											opacity: 0,
											transform: "translateY(10px)",
											animationFillMode: "forwards",
										}}
									>
										<div className="p-2">
											<div className="space-y-1">
												<button
													onClick={() => imageRef.current?.click()}
													className={`group flex items-center w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
														isDark
															? "text-gray-100 hover:bg-gray-700/70"
															: "text-gray-800 hover:bg-gray-50/80"
													}`}
												>
													<div
														className={`p-2 mr-3 rounded-lg transition-colors duration-200 ${
															isDark
																? "bg-gray-600/70 text-gray-100 group-hover:bg-gray-500/70"
																: "bg-gray-50/80 text-gray-800 group-hover:bg-gray-100/80"
														}`}
													>
														<Image className="w-5 h-5" />
													</div>
													<span>Photos & Videos</span>
												</button>
												<button
													onClick={() => gifRef.current?.click()}
													className={`group flex items-center w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
														isDark
															? "text-gray-100 hover:bg-gray-700/70"
															: "text-gray-800 hover:bg-gray-50/80"
													}`}
												>
													<div
														className={`p-2 mr-3 rounded-lg transition-colors duration-200 ${
															isDark
																? "bg-gray-600/70 text-gray-100 group-hover:bg-gray-500/70"
																: "bg-gray-50/80 text-gray-800 group-hover:bg-gray-100/80"
														}`}
													>
														<Gift className="w-5 h-5" />
													</div>
													<span>GIF</span>
												</button>
												<button
													onClick={() => fileRef.current?.click()}
													className={`group flex items-center w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
														isDark
															? "text-gray-100 hover:bg-gray-700/70"
															: "text-gray-800 hover:bg-gray-50/80"
													}`}
												>
													<div
														className={`p-2 mr-3 rounded-lg transition-colors duration-200 ${
															isDark
																? "bg-gray-600/70 text-gray-100 group-hover:bg-gray-500/70"
																: "bg-gray-50/80 text-gray-800 group-hover:bg-gray-100/80"
														}`}
													>
														<File className="w-5 h-5" />
													</div>
													<span>Document</span>
												</button>
											</div>
										</div>
									</div>
								)}
							</div>

							<div className="relative" ref={emojiRef}>
								<button
									onClick={toggleEmojiPicker}
									className={`p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
										isDark
											? "hover:bg-gray-700 text-gray-200 hover:text-white"
											: "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
									} transform hover:scale-105 active:scale-95`}
								>
									<Smile className="w-5 h-5" />
								</button>
								{showEmojis && (
									<div className="absolute bottom-full mb-2 left-0 z-[9999]">
										{" "}
										<EmojiPicker
											onEmojiClick={handleEmojiSelect}
											theme={isDark ? Theme.DARK : Theme.LIGHT}
											width={350}
											height={400}
											searchPlaceholder="Search emojis..."
											style={{
												background: isDark
													? "linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))"
													: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95))",
												border: isDark
													? "1px solid rgba(55, 65, 81, 0.5)"
													: "1px solid rgba(229, 231, 235, 0.5)",
												borderRadius: "16px",
												boxShadow:
													"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
											}}
										/>
									</div>
								)}
							</div>

							<div className="flex-1">
								<input
									type="text"
									value={msgInput}
									onChange={(e) => setMsgInput(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Type a message..."
									className={`w-full rounded-xl py-3 px-4 focus:outline-none focus:ring-2 transition-all duration-200 ${
										isDark
											? "focus:ring-blue-500/40 bg-gray-700 text-white placeholder-gray-300"
											: "focus:ring-blue-500/30 bg-gray-100 text-gray-900 placeholder-gray-500"
									} backdrop-blur-sm`}
								/>
							</div>

							<button
								onClick={handleSendMessage}
								disabled={!msgInput.trim() && !attachment}
								className={`p-2.5 rounded-xl transition-all duration-300 transform ${
									!msgInput.trim() && !attachment
										? `${
												isDark ? "text-gray-500" : "text-gray-400"
										  } cursor-not-allowed opacity-50`
										: `${
												isDark
													? "bg-blue-600 text-white hover:bg-blue-700"
													: "bg-blue-500 text-white hover:bg-blue-600"
										  } cursor-pointer hover:scale-105 active:scale-95`
								}`}
							>
								<Send className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<input
				type="file"
				ref={fileRef}
				onChange={handleFileChange}
				className="hidden"
			/>
			<input
				type="file"
				ref={imageRef}
				accept="image/*"
				onChange={handleImageChange}
				className="hidden"
			/>
			<input
				type="file"
				ref={videoRef}
				accept="video/*"
				onChange={handleVideoChange}
				className="hidden"
			/>
			<input
				type="file"
				ref={gifRef}
				accept=".gif"
				onChange={handleGifChange}
				className="hidden"
			/>
		</>
	);
};

export default Chat;
