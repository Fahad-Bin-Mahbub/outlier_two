"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
	FiBell,
	FiMessageSquare,
	FiCheckSquare,
	FiUser,
	FiInfo,
	FiCalendar,
	FiCheck,
	FiX,
	FiPlus,
	FiFilter,
	FiSearch,
	FiMenu,
	FiArrowRight,
	FiGithub,
	FiTwitter,
	FiInstagram,
	FiLinkedin,
	FiMail,
	FiPhone,
	FiHeart,
	FiSettings,
	FiHeadphones,
	FiHelpCircle,
	FiClock,
	FiShield,
	FiCommand,
	FiKey,
} from "react-icons/fi";
import { BsCheckAll, BsThreeDots } from "react-icons/bs";

type NotificationType = "message" | "task" | "mention" | "system" | "calendar";

interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	timestamp: Date;
	read: boolean;
	priority?: "high" | "medium" | "low";
	avatar?: string;
	actionUrl?: string;
	actionLabel?: string;
	secondaryAction?: {
		label: string;
		action: string;
	};
}

interface User {
	id: string;
	name: string;
	role: string;
	avatar: string;
	email: string;
	active: boolean;
}

export default function NotificationSystemExport() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [showNotifications, setShowNotifications] = useState(false);
	const [activeFilter, setActiveFilter] = useState<NotificationType | "all">(
		"all"
	);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [isMobile, setIsMobile] = useState(false);
	const [activeUsers, setActiveUsers] = useState<User[]>([]);
	const [notificationSound] = useState<HTMLAudioElement | null>(
		typeof Audio !== "undefined"
			? new Audio(
					"https://www.myinstants.com/media/sounds/discord-notification.mp3"
			  )
			: null
	);
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [animateCount, setAnimateCount] = useState(false);
	const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

	const notificationRef = useRef<HTMLDivElement>(null);
	const firstNotificationRef = useRef<HTMLDivElement>(null);
	const settingsRef = useRef<HTMLDivElement>(null);
	const keyboardShortcutsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const checkDeviceSize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkDeviceSize();
		window.addEventListener("resize", checkDeviceSize);
		return () => window.removeEventListener("resize", checkDeviceSize);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				notificationRef.current &&
				!notificationRef.current.contains(event.target as Node)
			) {
				setShowNotifications(false);
			}
			if (
				settingsRef.current &&
				!settingsRef.current.contains(event.target as Node)
			) {
				setShowSettings(false);
			}
			if (
				keyboardShortcutsRef.current &&
				!keyboardShortcutsRef.current.contains(event.target as Node) &&
				showKeyboardShortcuts
			) {
				setShowKeyboardShortcuts(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showKeyboardShortcuts]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				if (showNotifications) setShowNotifications(false);
				if (showSettings) setShowSettings(false);
				if (showKeyboardShortcuts) setShowKeyboardShortcuts(false);
				return;
			}

			if (showNotifications && e.key === "Tab" && !e.shiftKey) {
				const notificationItems = document.querySelectorAll("[data-id]");
				if (
					notificationItems.length > 0 &&
					document.activeElement !== notificationItems[0]
				) {
					e.preventDefault();
					(notificationItems[0] as HTMLElement).focus();
				}
			}

			const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
			const modifierKey = isMac ? e.metaKey : e.altKey;

			if (modifierKey) {
				if (e.key === "a" || e.key === "A") {
					e.preventDefault();
					setShowNotifications((prev) => !prev);
				} else if (e.key === "s" || e.key === "S") {
					e.preventDefault();
					setShowSettings((prev) => !prev);
				} else if (e.key === "k" || e.key === "K") {
					e.preventDefault();
					setShowKeyboardShortcuts((prev) => !prev);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [showNotifications, showSettings, showKeyboardShortcuts]);

	useEffect(() => {
		const mockUsers: User[] = [
			{
				id: "u1",
				name: "Alex Morgan",
				role: "Product Manager",
				avatar: "https://randomuser.me/api/portraits/women/44.jpg",
				email: "alex@example.com",
				active: true,
			},
			{
				id: "u2",
				name: "Jamie Chen",
				role: "UX Designer",
				avatar: "https://randomuser.me/api/portraits/men/32.jpg",
				email: "jamie@example.com",
				active: true,
			},
			{
				id: "u3",
				name: "Taylor Wilson",
				role: "Frontend Developer",
				avatar: "https://randomuser.me/api/portraits/women/68.jpg",
				email: "taylor@example.com",
				active: true,
			},
			{
				id: "u4",
				name: "Morgan Smith",
				role: "Backend Developer",
				avatar: "https://randomuser.me/api/portraits/men/75.jpg",
				email: "morgan@example.com",
				active: false,
			},
			{
				id: "u5",
				name: "Riley Johnson",
				role: "Mobile Developer",
				avatar: "https://randomuser.me/api/portraits/women/90.jpg",
				email: "riley@example.com",
				active: true,
			},
		];

		setActiveUsers(mockUsers);
	}, []);

	useEffect(() => {
		const mockNotifications: Notification[] = [
			{
				id: "n1",
				type: "message",
				title: "New message from Jamie Chen",
				message:
					"Hi, I have uploaded the new design mockups for the homepage. Can you review them when you get a chance?",
				timestamp: new Date(Date.now() - 12 * 60000),
				read: false,
				avatar: "https://randomuser.me/api/portraits/men/32.jpg",
				actionUrl: "/messages/j-chen",
				actionLabel: "Reply",
				secondaryAction: {
					label: "View Files",
					action: "/files/design-mockups",
				},
			},
			{
				id: "n2",
				type: "task",
				title: "Task assigned to you",
				message:
					'Alex Morgan assigned you the task "Update API documentation" in the Mobile App project',
				timestamp: new Date(Date.now() - 45 * 60000),
				read: false,
				priority: "high",
				avatar: "https://randomuser.me/api/portraits/women/44.jpg",
				actionUrl: "/projects/p2/tasks/t15",
				actionLabel: "View Task",
			},
			{
				id: "n3",
				type: "mention",
				title: "You were mentioned in a comment",
				message:
					'Taylor Wilson mentioned you in a comment: "Can @you help with the responsive layout issues we discussed yesterday?"',
				timestamp: new Date(Date.now() - 3 * 60 * 60000),
				read: false,
				avatar: "https://randomuser.me/api/portraits/women/68.jpg",
				actionUrl: "/projects/p1/tasks/t8/comments",
				actionLabel: "View Comment",
			},
			{
				id: "n4",
				type: "system",
				title: "System Maintenance",
				message:
					"The system will be undergoing scheduled maintenance tonight from 2AM to 4AM UTC. Please save your work before this time.",
				timestamp: new Date(Date.now() - 5 * 60 * 60000),
				read: true,
				priority: "medium",
				actionUrl: "/system/maintenance",
				actionLabel: "Learn More",
			},
			{
				id: "n5",
				type: "calendar",
				title: "Upcoming Meeting",
				message:
					"Website Redesign Weekly Standup in 30 minutes (10:00 AM) in Meeting Room 3",
				timestamp: new Date(Date.now() - 25 * 60000),
				read: false,
				priority: "medium",
				actionUrl: "/calendar/meetings/m45",
				actionLabel: "Join Meeting",
				secondaryAction: {
					label: "View Agenda",
					action: "/calendar/meetings/m45/agenda",
				},
			},
		];

		setNotifications(mockNotifications);

		const interval = setInterval(() => {
			const types: NotificationType[] = [
				"message",
				"task",
				"mention",
				"system",
				"calendar",
			];
			const priorities = ["high", "medium", "low"];
			const randomType = types[Math.floor(Math.random() * types.length)];
			const randomPriority = priorities[
				Math.floor(Math.random() * priorities.length)
			] as "high" | "medium" | "low";
			const randomUser =
				activeUsers[Math.floor(Math.random() * activeUsers.length)];

			if (!randomUser) return;

			let title = "";
			let message = "";
			let actionUrl = "";
			let actionLabel = "";

			switch (randomType) {
				case "message":
					title = `New message from ${randomUser.name}`;
					message = `Hey, just checking in on the project progress. Do you have any updates?`;
					actionUrl = `/messages/${randomUser.id}`;
					actionLabel = "Reply";
					break;
				case "task":
					title = "Task assigned to you";
					message = `${randomUser.name} assigned you the task "${
						[
							"Review design changes",
							"Update documentation",
							"Fix navigation bug",
							"Create new components",
						][Math.floor(Math.random() * 4)]
					}"`;
					actionUrl = "/projects/tasks";
					actionLabel = "View Task";
					break;
				case "mention":
					title = "You were mentioned in a comment";
					message = `${randomUser.name} mentioned you in a comment: "${
						[
							"Can @you check this?",
							"I think @you should review this",
							"As @you suggested yesterday",
							"@you might want to look at this approach",
						][Math.floor(Math.random() * 4)]
					}"`;
					actionUrl = "/comments";
					actionLabel = "View Comment";
					break;
				case "system":
					title = [
						"System Update",
						"Security Alert",
						"Storage Warning",
						"New Feature Available",
					][Math.floor(Math.random() * 4)];
					message = [
						"A new system update is available.",
						"Unusual login activity detected.",
						"Your storage is 90% full.",
						"We just released a new feature you might like.",
					][Math.floor(Math.random() * 4)];
					actionUrl = "/system";
					actionLabel = "Learn More";
					break;
				case "calendar":
					title = [
						"Upcoming Meeting",
						"Event Reminder",
						"Schedule Change",
						"New Invitation",
					][Math.floor(Math.random() * 4)];
					message = `${
						["Weekly Standup", "Project Review", "Team Sync", "Client Meeting"][
							Math.floor(Math.random() * 4)
						]
					} in ${[15, 30, 45, 60][Math.floor(Math.random() * 4)]} minutes`;
					actionUrl = "/calendar";
					actionLabel = "View Event";
					break;
			}

			const newNotification: Notification = {
				id: `n${Date.now()}`,
				type: randomType,
				title,
				message,
				timestamp: new Date(),
				read: false,
				priority: randomPriority,
				avatar:
					randomType === "message" ||
					randomType === "mention" ||
					randomType === "task"
						? randomUser.avatar
						: undefined,
				actionUrl,
				actionLabel,
				...(Math.random() > 0.7 && {
					secondaryAction: {
						label: ["View Details", "Download", "Share", "More Info"][
							Math.floor(Math.random() * 4)
						],
						action: "/action",
					},
				}),
			};

			setAnimateCount(true);
			setTimeout(() => setAnimateCount(false), 1000);

			if (randomPriority === "high" && notificationSound) {
				notificationSound.play().catch(() => {});
			}

			setNotifications((prev) => [newNotification, ...prev].slice(0, 20));

			if (randomPriority === "high") {
				setToastMessage(`New ${randomType}: ${title}`);
				setShowToast(true);
				setTimeout(() => setShowToast(false), 4000);
			}
		}, 30000);

		return () => clearInterval(interval);
	}, [activeUsers, notificationSound]);

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle("dark-mode");
	};
	const validateEmail = (email: any) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleNewsletterSubscribe = async () => {
		setEmailError("");

		if (!newsletterEmail.trim()) {
			setEmailError("Email address is required");
			return;
		}

		if (!validateEmail(newsletterEmail.trim())) {
			setEmailError("Please enter a valid email address");
			return;
		}

		setIsSubscribing(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setToastMessage("Successfully subscribed to newsletter!");
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);

			setNewsletterEmail("");
			setEmailError("");
		} catch (error) {
			setEmailError("Subscription failed. Please try again.");
		} finally {
			setIsSubscribing(false);
		}
	};
	const getUnreadCount = () => {
		return notifications.filter((n) => !n.read).length;
	};

	const getFilteredNotifications = () => {
		if (activeFilter === "all") return notifications;
		return notifications.filter((n) => n.type === activeFilter);
	};

	const markAsRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n))
		);
	};

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		setToastMessage("All notifications marked as read");
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
		setToastMessage("Notification removed");
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	const formatTime = (date: Date) => {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;

		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours}h ago`;

		const diffDays = Math.floor(diffHours / 24);
		if (diffDays === 1) return "Yesterday";
		return `${diffDays}d ago`;
	};

	const handleActionClick = (
		notification: Notification,
		isSecondary = false
	) => {
		markAsRead(notification.id);
		setShowNotifications(false);

		const actionText =
			isSecondary && notification.secondaryAction
				? notification.secondaryAction.label
				: notification.actionLabel;

		setToastMessage(`${actionText} - ${notification.title}`);
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	const swipeHandlers = useSwipeable({
		onSwipedLeft: (eventData) => {
			let element = eventData.event.target as HTMLElement;

			while (element && !element.hasAttribute("data-id")) {
				element = element.parentElement as HTMLElement;
				if (!element) break;
			}

			if (element) {
				const notificationId = element.getAttribute("data-id");
				if (notificationId) {
					removeNotification(notificationId);

					setToastMessage("Notification dismissed");
					setShowToast(true);
					setTimeout(() => setShowToast(false), 3000);
				}
			}
		},

		preventScrollOnSwipe: true,
		trackMouse: false,
		trackTouch: true,
		delta: 50,
		swipeDuration: 500,
	});

	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case "message":
				return <FiMessageSquare className="h-5 w-5" />;
			case "task":
				return <FiCheckSquare className="h-5 w-5" />;
			case "mention":
				return <FiUser className="h-5 w-5" />;
			case "system":
				return <FiInfo className="h-5 w-5" />;
			case "calendar":
				return <FiCalendar className="h-5 w-5" />;
			default:
				return <FiInfo className="h-5 w-5" />;
		}
	};

	const getNotificationColor = (
		type: NotificationType,
		priority?: "high" | "medium" | "low"
	) => {
		if (priority === "high") {
			return "text-red-600";
		}

		switch (type) {
			case "message":
				return "text-blue-600";
			case "task":
				return "text-purple-600";
			case "mention":
				return "text-yellow-600";
			case "system":
				return "text-gray-600";
			case "calendar":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);

	const minSwipeDistance = 50;

	const onTouchStart = (e: React.TouchEvent, id: string) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = (id: string) => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;

		if (isLeftSwipe) {
			removeNotification(id);
			setToastMessage("Notification dismissed");
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		}

		setTouchStart(null);
		setTouchEnd(null);
	};
	const getNotificationTextColor = (
		type: NotificationType,
		priority?: "high" | "medium" | "low"
	) => {
		if (priority === "high") {
			return "text-red-600";
		}

		switch (type) {
			case "message":
				return "text-blue-600";
			case "task":
				return "text-purple-600";
			case "mention":
				return "text-yellow-600";
			case "system":
				return "text-gray-600";
			case "calendar":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	const getGroupedCounts = () => {
		return {
			message: notifications.filter((n) => n.type === "message").length,
			task: notifications.filter((n) => n.type === "task").length,
			mention: notifications.filter((n) => n.type === "mention").length,
			system: notifications.filter((n) => n.type === "system").length,
			calendar: notifications.filter((n) => n.type === "calendar").length,
		};
	};

	const groupCounts = getGroupedCounts();

	const isMac =
		typeof navigator !== "undefined" &&
		/Mac|iPod|iPhone|iPad/.test(navigator.platform);
	const modifierKey = isMac ? "⌘" : "Alt";

	const keyboardShortcuts = [
		{
			key: "Esc",
			description: "Close panels (notifications, settings, shortcuts)",
		},
		{ key: `${modifierKey} + A`, description: "Toggle notifications panel" },
		{ key: `${modifierKey} + S`, description: "Toggle settings panel" },
		{
			key: `${modifierKey} + K`,
			description: "Toggle keyboard shortcuts guide",
		},
		{ key: "Tab", description: "Navigate through notifications" },
	];

	const handleNavClick = (name: string) => {
		setToastMessage(`Navigating to ${name}`);
		setShowToast(true);
		setTimeout(() => setShowToast(false), 2000);
	};

	return (
		<div
			className={`min-h-screen font-sans text-gray-900 flex flex-col ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100"
			}`}
		>
			{}
			<AnimatePresence>
				{showKeyboardShortcuts && (
					<motion.div
						ref={keyboardShortcutsRef}
						initial={{ opacity: 0, y: -20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
						style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
					>
						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} p-6 rounded-xl max-w-md w-full`}
							style={{
								boxShadow: isDarkMode
									? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
									: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
							}}
						>
							<div className="flex justify-between items-center mb-4">
								<h3
									className={`text-xl font-bold ${
										isDarkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Keyboard Shortcuts
								</h3>
								<button
									onClick={() => setShowKeyboardShortcuts(false)}
									className="p-2 rounded-full hover:bg-gray-200"
								>
									<FiX className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								{keyboardShortcuts.map((shortcut, idx) => (
									<div
										key={idx}
										className={`flex items-center justify-between p-3 rounded-lg ${
											isDarkMode ? "bg-gray-750" : "bg-gray-50"
										}`}
									>
										<span
											className={`${
												isDarkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											{shortcut.description}
										</span>
										<span
											className={`px-3 py-1.5 rounded font-mono text-sm ${
												isDarkMode
													? "bg-gray-700 text-gray-300"
													: "bg-gray-200 text-gray-800"
											}`}
										>
											{shortcut.key}
										</span>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<header
				className={`${
					isDarkMode ? "bg-gray-800" : "bg-white"
				} py-4 px-6 shadow-sm sticky top-0 z-50`}
			>
				<div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
					<div className="flex items-center">
						<h1 className="text-lg md:text-2xl font-bold text-blue-600 flex items-center">
							<FiBell className="mr-2" /> NotifyMe
						</h1>
					</div>

					<div className="flex items-center space-x-4">
						{}
						<button
							onClick={() => setShowKeyboardShortcuts(true)}
							className={`relative p-3 rounded-xl hidden md:flex ${
								isDarkMode
									? "text-blue-400 hover:text-blue-300"
									: "text-blue-600 hover:text-blue-800"
							} focus:outline-none transition-all duration-200 ease-in-out`}
							aria-label="Keyboard shortcuts"
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.1)"
									: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)",
							}}
						>
							<FiKey className="h-6 w-6" />
						</button>

						<div className="relative" ref={settingsRef}>
							<button
								onClick={() => setShowSettings(!showSettings)}
								className={`relative p-3 rounded-xl ${
									isDarkMode
										? "text-blue-400 hover:text-blue-300"
										: "text-blue-600 hover:text-blue-800"
								} focus:outline-none transition-all duration-200 ease-in-out`}
								aria-label="Settings"
								style={{
									boxShadow: showSettings
										? isDarkMode
											? "inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.1)"
											: "inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)"
										: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.1)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)",
								}}
							>
								<FiSettings className="h-6 w-6" />
							</button>

							<AnimatePresence>
								{showSettings && (
									<motion.div
										initial={{ opacity: 0, y: 10, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: 10, scale: 0.95 }}
										transition={{ duration: 0.15, ease: "easeOut" }}
										className={`absolute right-[-60px] mt-3 w-[250px] md:w-[280px] rounded-xl z-10 ${
											isDarkMode ? "bg-gray-800" : "bg-white"
										}`}
										style={{
											boxShadow: isDarkMode
												? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1)"
												: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
										}}
									>
										<div
											className={`p-4 border-b ${
												isDarkMode ? "border-gray-700" : "border-gray-200"
											}`}
										>
											<h3
												className={`text-lg font-medium ${
													isDarkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Settings
											</h3>
										</div>
										<div className="p-4 space-y-4">
											<div className="flex items-center justify-between">
												<span
													className={`${
														isDarkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Dark Mode
												</span>
												<button
													onClick={toggleDarkMode}
													className={`w-12 h-6 rounded-full p-1 transition-colors ${
														isDarkMode ? "bg-blue-600" : "bg-gray-300"
													}`}
													style={{
														boxShadow: isDarkMode
															? "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.1)"
															: "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
													}}
												>
													<motion.div
														className="w-4 h-4 bg-white rounded-full"
														animate={{ x: isDarkMode ? 24 : 0 }}
													/>
												</button>
											</div>
											<div className="flex items-center justify-between">
												<span
													className={`${
														isDarkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Notification Sound
												</span>
												<button
													className={`w-12 h-6 rounded-full p-1 transition-colors ${
														isDarkMode ? "bg-blue-600" : "bg-blue-600"
													}`}
													style={{
														boxShadow: isDarkMode
															? "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.1)"
															: "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
													}}
												>
													<motion.div
														className="w-4 h-4 bg-white rounded-full"
														animate={{ x: 24 }}
													/>
												</button>
											</div>
											<div className="flex items-center justify-between">
												<span
													className={`${
														isDarkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Show Desktop Alerts
												</span>
												<button
													className={`w-12 h-6 rounded-full p-1 transition-colors ${
														isDarkMode ? "bg-blue-600" : "bg-blue-600"
													}`}
													style={{
														boxShadow: isDarkMode
															? "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.1)"
															: "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
													}}
												>
													<motion.div
														className="w-4 h-4 bg-white rounded-full"
														animate={{ x: 24 }}
													/>
												</button>
											</div>
										</div>
										<div
											className={`p-3 border-t ${
												isDarkMode
													? "border-gray-700 bg-gray-750"
													: "border-gray-200 bg-gray-50"
											} rounded-b-xl`}
										>
											<a
												href="#"
												onClick={() => {
													setShowSettings(false);
													setToastMessage(
														"Advanced settings will be available soon"
													);
													setShowToast(true);
													setTimeout(() => setShowToast(false), 3000);
												}}
												className={`block text-center text-sm ${
													isDarkMode
														? "text-blue-400 hover:text-blue-300"
														: "text-blue-600 hover:text-blue-800"
												} font-medium`}
											>
												Advanced Settings
											</a>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<div className="relative" ref={notificationRef}>
							<button
								onClick={() => setShowNotifications(!showNotifications)}
								className={`relative p-3 rounded-xl ${
									isDarkMode
										? "text-blue-400 hover:text-blue-300"
										: "text-blue-600 hover:text-blue-800"
								} focus:outline-none transition-all duration-200 ease-in-out`}
								aria-label="Notifications"
								style={{
									boxShadow: showNotifications
										? isDarkMode
											? "inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.1)"
											: "inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)"
										: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.1)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)",
								}}
							>
								<FiBell className="h-6 w-6" />

								{getUnreadCount() > 0 && (
									<motion.span
										initial={{ scale: 0 }}
										animate={{
											scale: animateCount ? [1, 1.2, 1] : 1,
											transition: {
												duration: 0.4,
												ease: "easeInOut",
											},
										}}
										className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1"
									>
										{getUnreadCount()}
									</motion.span>
								)}
							</button>

							<AnimatePresence>
								{showNotifications && (
									<motion.div
										initial={{ opacity: 0, y: 10, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: 10, scale: 0.95 }}
										transition={{ duration: 0.15, ease: "easeOut" }}
										className={`absolute right-[-60px] mt-3 w-[300px] md:w-[380px] rounded-xl z-10 ${
											isDarkMode ? "bg-gray-800" : "bg-white"
										}`}
										style={{
											boxShadow: isDarkMode
												? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1)"
												: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
										}}
									>
										<div
											className={`p-4 border-b ${
												isDarkMode ? "border-gray-700" : "border-gray-200"
											}`}
										>
											<div className="flex justify-between items-center">
												<h3
													className={`text-lg font-medium ${
														isDarkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Notifications
												</h3>
												<button
													onClick={markAllAsRead}
													className={`text-xs ${
														isDarkMode
															? "text-blue-400 hover:text-blue-300"
															: "text-blue-600 hover:text-blue-800"
													} font-medium focus:outline-none flex items-center`}
												>
													<BsCheckAll className="mr-1" /> Mark all as read
												</button>
											</div>

											<div className="mt-3 flex space-x-2 overflow-x-auto pb-1">
												<button
													onClick={() => setActiveFilter("all")}
													className={`px-3 py-1 text-xs rounded-full focus:outline-none transition-colors ${
														activeFilter === "all"
															? isDarkMode
																? "bg-blue-900 text-blue-300 font-medium"
																: "bg-blue-100 text-blue-800 font-medium"
															: isDarkMode
															? "bg-gray-700 text-gray-300 hover:bg-gray-600"
															: "bg-gray-100 text-gray-600 hover:bg-gray-200"
													}`}
													style={{
														boxShadow:
															activeFilter === "all"
																? isDarkMode
																	? "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.1)"
																	: "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)"
																: isDarkMode
																? "2px 2px 5px rgba(0, 0, 0, 0.5), -2px -2px 5px rgba(255, 255, 255, 0.05)"
																: "2px 2px 5px rgba(0, 0, 0, 0.05), -2px -2px 5px rgba(255, 255, 255, 0.5)",
													}}
												>
													All
												</button>
												<button
													onClick={() => setActiveFilter("message")}
													className={`px-3 py-1 text-xs rounded-full focus:outline-none transition-colors flex items-center ${
														activeFilter === "message"
															? isDarkMode
																? "bg-blue-900 text-blue-300 font-medium"
																: "bg-blue-100 text-blue-800 font-medium"
															: isDarkMode
															? "bg-gray-700 text-gray-300 hover:bg-gray-600"
															: "bg-gray-100 text-gray-600 hover:bg-gray-200"
													}`}
													style={{
														boxShadow:
															activeFilter === "message"
																? isDarkMode
																	? "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.1)"
																	: "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)"
																: isDarkMode
																? "2px 2px 5px rgba(0, 0, 0, 0.5), -2px -2px 5px rgba(255, 255, 255, 0.05)"
																: "2px 2px 5px rgba(0, 0, 0, 0.05), -2px -2px 5px rgba(255, 255, 255, 0.5)",
													}}
												>
													<span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
													Messages
												</button>
												<button
													onClick={() => setActiveFilter("task")}
													className={`px-3 py-1 text-xs rounded-full focus:outline-none transition-colors flex items-center ${
														activeFilter === "task"
															? isDarkMode
																? "bg-purple-900 text-purple-300 font-medium"
																: "bg-purple-100 text-purple-800 font-medium"
															: isDarkMode
															? "bg-gray-700 text-gray-300 hover:bg-gray-600"
															: "bg-gray-100 text-gray-600 hover:bg-gray-200"
													}`}
													style={{
														boxShadow:
															activeFilter === "task"
																? isDarkMode
																	? "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.1)"
																	: "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)"
																: isDarkMode
																? "2px 2px 5px rgba(0, 0, 0, 0.5), -2px -2px 5px rgba(255, 255, 255, 0.05)"
																: "2px 2px 5px rgba(0, 0, 0, 0.05), -2px -2px 5px rgba(255, 255, 255, 0.5)",
													}}
												>
													<span className="w-2 h-2 bg-purple-500 rounded-full mr-1.5"></span>
													Tasks
												</button>
												<button
													onClick={() => setActiveFilter("calendar")}
													className={`px-3 py-1 text-xs rounded-full focus:outline-none transition-colors flex items-center ${
														activeFilter === "calendar"
															? isDarkMode
																? "bg-green-900 text-green-300 font-medium"
																: "bg-green-100 text-green-800 font-medium"
															: isDarkMode
															? "bg-gray-700 text-gray-300 hover:bg-gray-600"
															: "bg-gray-100 text-gray-600 hover:bg-gray-200"
													}`}
													style={{
														boxShadow:
															activeFilter === "calendar"
																? isDarkMode
																	? "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.1)"
																	: "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)"
																: isDarkMode
																? "2px 2px 5px rgba(0, 0, 0, 0.5), -2px -2px 5px rgba(255, 255, 255, 0.05)"
																: "2px 2px 5px rgba(0, 0, 0, 0.05), -2px -2px 5px rgba(255, 255, 255, 0.5)",
													}}
												>
													<span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
													Calendar
												</button>
											</div>
										</div>

										<div className="max-h-[500px] overflow-y-auto overscroll-contain">
											{getFilteredNotifications().length === 0 ? (
												<div className="p-12 text-center">
													<div className="mx-auto h-12 w-12 text-gray-400 mb-4">
														<FiBell className="h-12 w-12" />
													</div>
													<h3
														className={`text-sm font-medium ${
															isDarkMode ? "text-white" : "text-gray-900"
														} mb-1`}
													>
														No notifications found
													</h3>
													<p
														className={`text-sm ${
															isDarkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														When you get notifications, they'll show up here
													</p>
												</div>
											) : (
												getFilteredNotifications().map(
													(notification, index) => (
														<div
															key={notification.id}
															ref={index === 0 ? firstNotificationRef : null}
															data-id={notification.id}
															onTouchStart={(e) =>
																onTouchStart(e, notification.id)
															}
															onTouchMove={onTouchMove}
															onTouchEnd={() => onTouchEnd(notification.id)}
															className={`p-4 ${
																isDarkMode
																	? !notification.read
																		? "bg-gray-750"
																		: "hover:bg-gray-750"
																	: !notification.read
																	? "bg-gray-50"
																	: "hover:bg-gray-50"
															} transition-colors relative`}
															tabIndex={0}
															style={{
																boxShadow:
																	index !==
																	getFilteredNotifications().length - 1
																		? isDarkMode
																			? "0 1px 2px rgba(0, 0, 0, 0.2)"
																			: "0 1px 2px rgba(0, 0, 0, 0.05)"
																		: "none",
																borderRadius:
																	index === 0
																		? "0"
																		: index ===
																		  getFilteredNotifications().length - 1
																		? "0 0 12px 12px"
																		: "0",
																touchAction: "pan-y",
																userSelect: "none",
															}}
														>
															<div className="flex">
																{notification.avatar ? (
																	<div
																		className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
																		style={{
																			boxShadow: isDarkMode
																				? "2px 2px 5px rgba(0, 0, 0, 0.4), -2px -2px 5px rgba(255, 255, 255, 0.1)"
																				: "2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.8)",
																			borderRadius: "50%",
																		}}
																	>
																		<img
																			className="h-10 w-10 rounded-full"
																			src={notification.avatar}
																			alt=""
																		/>
																	</div>
																) : (
																	<div
																		className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(
																			notification.type,
																			notification.priority
																		)}`}
																		style={{
																			boxShadow: isDarkMode
																				? "2px 2px 5px rgba(0, 0, 0, 0.4), -2px -2px 5px rgba(255, 255, 255, 0.1)"
																				: "2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.8)",
																			background: isDarkMode
																				? "#1f2937"
																				: "white",
																		}}
																	>
																		{getNotificationIcon(notification.type)}
																	</div>
																)}

																<div className="ml-3 flex-1 min-w-0">
																	<div className="flex justify-between items-start">
																		<p
																			className={`text-sm font-medium ${
																				!notification.read
																					? isDarkMode
																						? "text-white"
																						: "text-gray-900"
																					: isDarkMode
																					? "text-gray-300"
																					: "text-gray-700"
																			}`}
																		>
																			{notification.title}
																			{notification.priority === "high" && (
																				<span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
																					High priority
																				</span>
																			)}
																		</p>
																		<div className="ml-2 flex-shrink-0 flex">
																			<p
																				className={`text-xs ${
																					isDarkMode
																						? "text-gray-400"
																						: "text-gray-500"
																				} whitespace-nowrap`}
																			>
																				{formatTime(notification.timestamp)}
																			</p>
																		</div>
																	</div>
																	<p
																		className={`mt-1 text-sm ${
																			!notification.read
																				? isDarkMode
																					? "text-gray-300"
																					: "text-gray-800"
																				: isDarkMode
																				? "text-gray-400"
																				: "text-gray-600"
																		}`}
																	>
																		{notification.message}
																	</p>

																	<div className="mt-2 flex space-x-3">
																		{notification.actionLabel && (
																			<button
																				onClick={() =>
																					handleActionClick(notification)
																				}
																				className="text-xs font-medium px-3 py-1 rounded-lg focus:outline-none transition-all duration-200"
																				style={{
																					color:
																						notification.priority === "high"
																							? isDarkMode
																								? "#f87171"
																								: "#e53e3e"
																							: isDarkMode
																							? "#60a5fa"
																							: "#3182ce",
																					boxShadow: isDarkMode
																						? "2px 2px 5px rgba(0, 0, 0, 0.4), -2px -2px 5px rgba(255, 255, 255, 0.1)"
																						: "2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.8)",
																				}}
																			>
																				{notification.actionLabel}
																			</button>
																		)}
																		{notification.secondaryAction && (
																			<button
																				onClick={() =>
																					handleActionClick(notification, true)
																				}
																				className={`text-xs font-medium ${
																					isDarkMode
																						? "text-gray-400 hover:text-gray-200"
																						: "text-gray-600 hover:text-gray-900"
																				} px-3 py-1 rounded-lg focus:outline-none transition-all duration-200`}
																				style={{
																					boxShadow: isDarkMode
																						? "2px 2px 5px rgba(0, 0, 0, 0.4), -2px -2px 5px rgba(255, 255, 255, 0.1)"
																						: "2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.8)",
																				}}
																			>
																				{notification.secondaryAction.label}
																			</button>
																		)}
																	</div>
																</div>
															</div>

															{}
															<div className="absolute right-2 flex space-x-1 z-10">
																{!notification.read && (
																	<button
																		onClick={() => markAsRead(notification.id)}
																		className={`p-1 rounded-full ${
																			isDarkMode
																				? "text-gray-500 hover:text-blue-400 bg-gray-800"
																				: "text-gray-400 hover:text-blue-600 bg-white"
																		} focus:outline-none`}
																		title="Mark as read"
																		style={{
																			boxShadow: isDarkMode
																				? "2px 2px 5px rgba(0, 0, 0, 0.3), -2px -2px 5px rgba(255, 255, 255, 0.05)"
																				: "2px 2px 5px rgba(0, 0, 0, 0.05), -2px -2px 5px rgba(255, 255, 255, 0.5)",
																			transition: "all 0.2s ease",
																		}}
																	>
																		<FiCheck className="h-4 w-4" />
																	</button>
																)}
																<button
																	onClick={() =>
																		removeNotification(notification.id)
																	}
																	className={`p-1 rounded-full ${
																		isDarkMode
																			? "text-gray-500 hover:text-red-400 bg-gray-800"
																			: "text-gray-400 hover:text-red-600 bg-white"
																	} focus:outline-none`}
																	title="Remove"
																	style={{
																		boxShadow: isDarkMode
																			? "2px 2px 5px rgba(0, 0, 0, 0.3), -2px -2px 5px rgba(255, 255, 255, 0.05)"
																			: "2px 2px 5px rgba(0, 0, 0, 0.05), -2px -2px 5px rgba(255, 255, 255, 0.5)",
																		transition: "all 0.2s ease",
																	}}
																>
																	<FiX className="h-4 w-4" />
																</button>
															</div>

															{isMobile && (
																<div
																	className={`mt-6 text-xs ${
																		isDarkMode
																			? "text-gray-500"
																			: "text-gray-400"
																	} flex items-center justify-end`}
																>
																	<span>Swipe left to dismiss</span>
																	<FiArrowRight className="ml-1 h-3 w-3" />
																</div>
															)}
														</div>
													)
												)
											)}
										</div>

										<div
											className={`p-3 border-t ${
												isDarkMode
													? "border-gray-700 bg-gray-750"
													: "border-gray-200 bg-gray-50"
											} rounded-b-xl`}
										>
											<a
												href="#"
												onClick={() => {
													setShowNotifications(false);
													setToastMessage("View all notifications");
													setShowToast(true);
													setTimeout(() => setShowToast(false), 3000);
												}}
												className={`block text-center text-sm ${
													isDarkMode
														? "text-blue-400 hover:text-blue-300"
														: "text-blue-600 hover:text-blue-800"
												} font-medium`}
											>
												View all notifications
											</a>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<div className="relative ml-1">
							<button
								className={`w-10 h-10 rounded-full focus:outline-none flex items-center justify-center ${
									isDarkMode ? "bg-gray-700" : "bg-white"
								}`}
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.1)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)",
								}}
								onClick={() => {
									setToastMessage("User profile settings");
									setShowToast(true);
									setTimeout(() => setShowToast(false), 2000);
								}}
							>
								<img
									src="https://randomuser.me/api/portraits/men/32.jpg"
									alt="User"
									className="h-8 w-8 rounded-full"
								/>
							</button>
						</div>
					</div>
				</div>
			</header>

			<section
				className={`${isDarkMode ? "bg-gray-800" : "bg-blue-50"} py-16 px-4`}
			>
				<div className="max-w-7xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h2
							className={`text-4xl md:text-5xl font-bold mb-4 ${
								isDarkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Stay Informed, Stay Productive
						</h2>
						<p
							className={`text-lg md:text-xl max-w-3xl mx-auto mb-8 ${
								isDarkMode ? "text-gray-300" : "text-gray-600"
							}`}
						>
							NotifyMe helps teams communicate better with an elegant
							notification system that brings important information to the
							forefront
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<button
								className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.1)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.5)",
								}}
								onClick={() => {
									setToastMessage(
										"Get Started Free - Sign up form would appear"
									);
									setShowToast(true);
									setTimeout(() => setShowToast(false), 3000);
								}}
							>
								Get Started Free
							</button>
							<button
								className={`px-6 py-3 ${
									isDarkMode
										? "bg-gray-700 text-white"
										: "bg-white text-gray-800"
								} font-medium rounded-xl shadow-lg hover:bg-gray-100 transition-colors`}
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.1)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.5)",
								}}
								onClick={() => {
									setToastMessage("Demo video would play");
									setShowToast(true);
									setTimeout(() => setShowToast(false), 3000);
								}}
							>
								Watch Demo
							</button>
						</div>
					</motion.div>
				</div>
			</section>

			<main className="flex-1 max-w-7xl w-full mx-auto px-4 py-16">
				<div className="text-center mb-16">
					<h2
						className={`text-3xl font-bold ${
							isDarkMode ? "text-white" : "text-gray-900"
						} mb-2`}
					>
						Interactive Notification System
					</h2>
					<p
						className={`${
							isDarkMode ? "text-gray-400" : "text-gray-600"
						} max-w-2xl mx-auto`}
					>
						Experience our complete notification system with real-time updates
						and modern neumorphic design
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
					<div
						className={`${
							isDarkMode ? "bg-gray-800" : "bg-white"
						} p-8 rounded-xl`}
						style={{
							boxShadow: isDarkMode
								? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
								: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
						}}
					>
						<h3
							className={`text-xl font-bold ${
								isDarkMode ? "text-white" : "text-gray-900"
							} mb-6 flex items-center`}
						>
							<FiShield className="mr-2 text-blue-500" />
							System Features
						</h3>
						<ul className="space-y-5">
							<li className="flex items-start">
								<span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
									<FiCheck className="h-3 w-3 text-blue-600" />
								</span>
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Dynamic notification counters with subtle animations that
									highlight new activity
								</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
									<FiCheck className="h-3 w-3 text-blue-600" />
								</span>
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Contextual menus with quick actions tailored to each
									notification type
								</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
									<FiCheck className="h-3 w-3 text-blue-600" />
								</span>
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Mobile-optimized with intuitive swipe-to-dismiss gesture
									support
								</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
									<FiCheck className="h-3 w-3 text-blue-600" />
								</span>
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Keyboard navigation support ({modifierKey}+N to toggle
									notifications,
									{modifierKey}+K for keyboard shortcuts)
								</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
									<FiCheck className="h-3 w-3 text-blue-600" />
								</span>
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Neumorphic design with soft shadows and elegant blue color
									palette
								</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
									<FiCheck className="h-3 w-3 text-blue-600" />
								</span>
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Dark mode support with optimized neumorphic design for both
									themes
								</span>
							</li>
						</ul>
					</div>

					<div
						className={`${
							isDarkMode ? "bg-gray-800" : "bg-white"
						} p-8 rounded-xl`}
						style={{
							boxShadow: isDarkMode
								? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
								: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
						}}
					>
						<h3
							className={`text-xl font-bold ${
								isDarkMode ? "text-white" : "text-gray-900"
							} mb-6 flex items-center`}
						>
							<FiClock className="mr-2 text-blue-500" />
							Activity Dashboard
						</h3>
						<div className="space-y-6">
							<div>
								<div className="flex justify-between items-center mb-1">
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Total Notifications
									</span>
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-blue-400" : "text-blue-600"
										}`}
									>
										{notifications.length}
									</span>
								</div>
								<div
									className={`w-full ${
										isDarkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-full h-2.5 overflow-hidden`}
								>
									<div
										className="bg-blue-600 h-2.5"
										style={{ width: "100%" }}
									></div>
								</div>
							</div>

							<div>
								<div className="flex justify-between items-center mb-1">
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Unread Notifications
									</span>
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-blue-400" : "text-blue-600"
										}`}
									>
										{getUnreadCount()}
									</span>
								</div>
								<div
									className={`w-full ${
										isDarkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-full h-2.5 overflow-hidden`}
								>
									<div
										className="bg-blue-600 h-2.5"
										style={{
											width: `${
												(getUnreadCount() / notifications.length) * 100
											}%`,
										}}
									></div>
								</div>
							</div>

							<div className="pt-4">
								<div className="flex justify-between items-center mb-2">
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Notification Types
									</span>
								</div>
								<div
									className={`w-full ${
										isDarkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-full h-2.5 overflow-hidden mb-4`}
								>
									<div className="flex h-2.5">
										<div
											className="bg-blue-600 h-2.5"
											style={{
												width: `${
													(groupCounts.message / notifications.length) * 100
												}%`,
											}}
										></div>
										<div
											className="bg-purple-600 h-2.5"
											style={{
												width: `${
													(groupCounts.task / notifications.length) * 100
												}%`,
											}}
										></div>
										<div
											className="bg-yellow-600 h-2.5"
											style={{
												width: `${
													(groupCounts.mention / notifications.length) * 100
												}%`,
											}}
										></div>
										<div
											className="bg-green-600 h-2.5"
											style={{
												width: `${
													(groupCounts.calendar / notifications.length) * 100
												}%`,
											}}
										></div>
										<div
											className="bg-gray-600 h-2.5"
											style={{
												width: `${
													(groupCounts.system / notifications.length) * 100
												}%`,
											}}
										></div>
									</div>
								</div>
								<div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mb-2">
									<div className="flex items-center">
										<div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
										<span
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Messages
										</span>
									</div>
									<div className="flex items-center">
										<div className="w-2 h-2 bg-purple-600 rounded-full mr-1"></div>
										<span
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Tasks
										</span>
									</div>
									<div className="flex items-center">
										<div className="w-2 h-2 bg-yellow-600 rounded-full mr-1"></div>
										<span
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Mentions
										</span>
									</div>
									<div className="flex items-center">
										<div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
										<span
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Calendar
										</span>
									</div>
									<div className="flex items-center">
										<div className="w-2 h-2 bg-gray-600 rounded-full mr-1"></div>
										<span
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											System
										</span>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 mt-6">
								<button
									onClick={() => {
										const newNotification: Notification = {
											id: `n${Date.now()}`,
											type: "system",
											title: "Manual Notification",
											message:
												"This notification was manually triggered by you.",
											timestamp: new Date(),
											read: false,
											priority: "medium",
											actionUrl: "#",
											actionLabel: "Acknowledge",
										};

										setAnimateCount(true);
										setTimeout(() => setAnimateCount(false), 1000);

										setNotifications((prev) => [newNotification, ...prev]);
										setToastMessage("New notification added");
										setShowToast(true);
										setTimeout(() => setShowToast(false), 3000);
									}}
									className={`py-2.5 px-4 ${
										isDarkMode
											? "bg-blue-900 text-blue-300"
											: "bg-blue-50 text-blue-600"
									} rounded-xl text-sm font-medium transition-all duration-200`}
									style={{
										boxShadow: isDarkMode
											? "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)"
											: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
									}}
								>
									<div className="flex items-center justify-center">
										<FiPlus className="mr-1" />
										Add Notification
									</div>
								</button>

								<button
									onClick={markAllAsRead}
									className={`py-2.5 px-4 ${
										isDarkMode
											? "bg-blue-900 text-blue-300"
											: "bg-blue-50 text-blue-600"
									} rounded-xl text-sm font-medium transition-all duration-200`}
									style={{
										boxShadow: isDarkMode
											? "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)"
											: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
									}}
								>
									<div className="flex items-center justify-center">
										<BsCheckAll className="mr-1" />
										Mark All Read
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>

				{}
				<div
					className={`${
						isDarkMode ? "bg-gray-800" : "bg-white"
					} p-8 rounded-xl mb-16`}
					style={{
						boxShadow: isDarkMode
							? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
							: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
					}}
				>
					<h3
						className={`text-xl font-bold ${
							isDarkMode ? "text-white" : "text-gray-900"
						} mb-6 flex items-center`}
					>
						<FiKey className="mr-2 text-blue-500" />
						Keyboard Shortcuts
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{keyboardShortcuts.map((shortcut, index) => (
							<div
								key={index}
								className={`flex items-center p-4 rounded-lg ${
									isDarkMode ? "bg-gray-750" : "bg-gray-50"
								}`}
								style={{
									boxShadow: isDarkMode
										? "inset 2px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.05)"
										: "inset 2px 2px 5px rgba(0, 0, 0, 0.05), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
								}}
							>
								<div
									className={`flex-shrink-0 w-12 h-12 rounded-full ${
										isDarkMode ? "bg-gray-800" : "bg-white"
									} flex items-center justify-center text-blue-600 mr-4`}
									style={{
										boxShadow: isDarkMode
											? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
											: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
									}}
								>
									<FiCommand className="h-6 w-6" />
								</div>
								<div>
									<div
										className={`inline-block px-3 py-1 rounded mb-1 font-mono ${
											isDarkMode
												? "bg-blue-900 text-blue-300"
												: "bg-blue-100 text-blue-800"
										}`}
									>
										{shortcut.key}
									</div>
									<p
										className={`${
											isDarkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										{shortcut.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div
					className={`${
						isDarkMode ? "bg-gray-800" : "bg-white"
					} p-8 rounded-xl mb-16`}
					style={{
						boxShadow: isDarkMode
							? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
							: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
					}}
				>
					<h3
						className={`text-xl font-bold ${
							isDarkMode ? "text-white" : "text-gray-900"
						} mb-6 flex items-center`}
					>
						<FiFilter className="mr-2 text-blue-500" />
						Notification Types
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
						<div
							className={`p-6 rounded-xl ${
								isDarkMode ? "bg-gray-750" : "bg-blue-50"
							} text-center`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
						>
							<div
								className={`mx-auto w-16 h-16 rounded-full ${
									isDarkMode ? "bg-gray-800" : "bg-white"
								} flex items-center justify-center text-blue-600 mb-4`}
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
								}}
							>
								<FiMessageSquare className="h-8 w-8" />
							</div>
							<h4
								className={`font-medium ${
									isDarkMode ? "text-blue-400" : "text-blue-700"
								} text-lg`}
							>
								Messages
							</h4>
							<p
								className={`text-sm ${
									isDarkMode ? "text-blue-300" : "text-blue-600"
								} mt-2`}
							>
								{notifications.filter((n) => n.type === "message").length}{" "}
								notifications
							</p>
							<p
								className={`text-xs ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								} mt-2`}
							>
								Direct messages from team members
							</p>
						</div>

						<div
							className={`p-6 rounded-xl ${
								isDarkMode ? "bg-gray-750" : "bg-purple-50"
							} text-center`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
						>
							<div
								className={`mx-auto w-16 h-16 rounded-full ${
									isDarkMode ? "bg-gray-800" : "bg-white"
								} flex items-center justify-center text-purple-600 mb-4`}
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
								}}
							>
								<FiCheckSquare className="h-8 w-8" />
							</div>
							<h4
								className={`font-medium ${
									isDarkMode ? "text-purple-400" : "text-purple-700"
								} text-lg`}
							>
								Tasks
							</h4>
							<p
								className={`text-sm ${
									isDarkMode ? "text-purple-300" : "text-purple-600"
								} mt-2`}
							>
								{notifications.filter((n) => n.type === "task").length}{" "}
								notifications
							</p>
							<p
								className={`text-xs ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								} mt-2`}
							>
								Assigned tasks and updates
							</p>
						</div>

						<div
							className={`p-6 rounded-xl ${
								isDarkMode ? "bg-gray-750" : "bg-yellow-50"
							} text-center`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
						>
							<div
								className={`mx-auto w-16 h-16 rounded-full ${
									isDarkMode ? "bg-gray-800" : "bg-white"
								} flex items-center justify-center text-yellow-600 mb-4`}
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
								}}
							>
								<FiUser className="h-8 w-8" />
							</div>
							<h4
								className={`font-medium ${
									isDarkMode ? "text-yellow-400" : "text-yellow-700"
								} text-lg`}
							>
								Mentions
							</h4>
							<p
								className={`text-sm ${
									isDarkMode ? "text-yellow-300" : "text-yellow-600"
								} mt-2`}
							>
								{notifications.filter((n) => n.type === "mention").length}{" "}
								notifications
							</p>
							<p
								className={`text-xs ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								} mt-2`}
							>
								When you're mentioned in comments
							</p>
						</div>

						<div
							className={`p-6 rounded-xl ${
								isDarkMode ? "bg-gray-750" : "bg-gray-50"
							} text-center`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
						>
							<div
								className={`mx-auto w-16 h-16 rounded-full ${
									isDarkMode ? "bg-gray-800" : "bg-white"
								} flex items-center justify-center text-gray-600 mb-4`}
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
								}}
							>
								<FiInfo className="h-8 w-8" />
							</div>
							<h4
								className={`font-medium ${
									isDarkMode ? "text-gray-300" : "text-gray-700"
								} text-lg`}
							>
								System
							</h4>
							<p
								className={`text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-600"
								} mt-2`}
							>
								{notifications.filter((n) => n.type === "system").length}{" "}
								notifications
							</p>
							<p
								className={`text-xs ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								} mt-2`}
							>
								System updates and alerts
							</p>
						</div>

						<div
							className={`p-6 rounded-xl ${
								isDarkMode ? "bg-gray-750" : "bg-green-50"
							} text-center`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
						>
							<div
								className={`mx-auto w-16 h-16 rounded-full ${
									isDarkMode ? "bg-gray-800" : "bg-white"
								} flex items-center justify-center text-green-600 mb-4`}
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
										: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
								}}
							>
								<FiCalendar className="h-8 w-8" />
							</div>
							<h4
								className={`font-medium ${
									isDarkMode ? "text-green-400" : "text-green-700"
								} text-lg`}
							>
								Calendar
							</h4>
							<p
								className={`text-sm ${
									isDarkMode ? "text-green-300" : "text-green-600"
								} mt-2`}
							>
								{notifications.filter((n) => n.type === "calendar").length}{" "}
								notifications
							</p>
							<p
								className={`text-xs ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								} mt-2`}
							>
								Meeting and event reminders
							</p>
						</div>
					</div>
				</div>

				<div className="py-8 mb-16">
					<div className="text-center mb-12">
						<h2
							className={`text-3xl font-bold ${
								isDarkMode ? "text-white" : "text-gray-900"
							} mb-2`}
						>
							Key Features
						</h2>
						<p
							className={`${
								isDarkMode ? "text-gray-400" : "text-gray-600"
							} max-w-2xl mx-auto`}
						>
							Everything you need for a seamless notification experience
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} p-6 rounded-xl`}
							style={{
								boxShadow: isDarkMode
									? "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.05)"
									: "6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.8)",
							}}
						>
							<div
								className={`w-14 h-14 ${
									isDarkMode ? "bg-blue-900" : "bg-blue-100"
								} rounded-xl flex items-center justify-center mb-4`}
								style={{
									boxShadow: isDarkMode
										? "inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.05)"
										: "inset 2px 2px 5px rgba(0, 0, 0, 0.05), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
								}}
							>
								<FiMessageSquare
									className={`h-7 w-7 ${
										isDarkMode ? "text-blue-400" : "text-blue-600"
									}`}
								/>
							</div>
							<h3
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								} mb-2`}
							>
								Real-time Updates
							</h3>
							<p
								className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
							>
								Get instant notifications with real-time counters and live
								updates as they happen. Never miss important information again.
							</p>
						</div>

						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} p-6 rounded-xl`}
							style={{
								boxShadow: isDarkMode
									? "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.05)"
									: "6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.8)",
							}}
						>
							<div
								className={`w-14 h-14 ${
									isDarkMode ? "bg-purple-900" : "bg-purple-100"
								} rounded-xl flex items-center justify-center mb-4`}
								style={{
									boxShadow: isDarkMode
										? "inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.05)"
										: "inset 2px 2px 5px rgba(0, 0, 0, 0.05), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
								}}
							>
								<FiFilter
									className={`h-7 w-7 ${
										isDarkMode ? "text-purple-400" : "text-purple-600"
									}`}
								/>
							</div>
							<h3
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								} mb-2`}
							>
								Smart Categorization
							</h3>
							<p
								className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
							>
								Notifications are intelligently grouped by type, making it easy
								to filter and focus on what matters most to you.
							</p>
						</div>

						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} p-6 rounded-xl`}
							style={{
								boxShadow: isDarkMode
									? "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.05)"
									: "6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.8)",
							}}
						>
							<div
								className={`w-14 h-14 ${
									isDarkMode ? "bg-green-900" : "bg-green-100"
								} rounded-xl flex items-center justify-center mb-4`}
								style={{
									boxShadow: isDarkMode
										? "inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.05)"
										: "inset 2px 2px 5px rgba(0, 0, 0, 0.05), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
								}}
							>
								<FiSettings
									className={`h-7 w-7 ${
										isDarkMode ? "text-green-400" : "text-green-600"
									}`}
								/>
							</div>
							<h3
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								} mb-2`}
							>
								Full Customization
							</h3>
							<p
								className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
							>
								Tailor the notification system to your needs with configurable
								settings, including dark mode and sound alerts.
							</p>
						</div>
					</div>
				</div>

				<div
					className={`${
						isDarkMode ? "bg-gray-800" : "bg-blue-50"
					} p-8 rounded-xl mb-16`}
					style={{
						boxShadow: isDarkMode
							? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
							: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
					}}
				>
					<h3
						className={`text-xl font-bold text-center ${
							isDarkMode ? "text-white" : "text-gray-900"
						} mb-8`}
					>
						What Our Users Say
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div
							className={`${
								isDarkMode ? "bg-gray-750" : "bg-white"
							} p-6 rounded-xl`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
						>
							<div className="flex items-center mb-4">
								<img
									src="https://randomuser.me/api/portraits/women/44.jpg"
									alt="User"
									className="h-12 w-12 rounded-full mr-4"
									style={{
										boxShadow: isDarkMode
											? "2px 2px 4px rgba(0, 0, 0, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.05)"
											: "2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.5)",
									}}
								/>
								<div>
									<h4
										className={`font-medium ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Alex Morgan
									</h4>
									<p
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Product Manager
									</p>
								</div>
							</div>
							<p
								className={`${
									isDarkMode ? "text-gray-300" : "text-gray-600"
								} mb-3`}
							>
								"NotifyMe's notification system has completely transformed how
								our team communicates. The real-time updates and smart
								categorization save us so much time every day."
							</p>
							<div className="flex">
								{[1, 2, 3, 4, 5].map((star) => (
									<svg
										key={star}
										className="h-5 w-5 text-yellow-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>
						</div>

						<div
							className={`${
								isDarkMode ? "bg-gray-750" : "bg-white"
							} p-6 rounded-xl`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
						>
							<div className="flex items-center mb-4">
								<img
									src="https://randomuser.me/api/portraits/men/32.jpg"
									alt="User"
									className="h-12 w-12 rounded-full mr-4"
									style={{
										boxShadow: isDarkMode
											? "2px 2px 4px rgba(0, 0, 0, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.05)"
											: "2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.5)",
									}}
								/>
								<div>
									<h4
										className={`font-medium ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Jamie Chen
									</h4>
									<p
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										UX Designer
									</p>
								</div>
							</div>
							<p
								className={`${
									isDarkMode ? "text-gray-300" : "text-gray-600"
								} mb-3`}
							>
								"The neumorphic design is stunning! As a designer, I appreciate
								the attention to detail. The mobile swipe gestures and keyboard
								shortcuts make it super efficient."
							</p>
							<div className="flex">
								{[1, 2, 3, 4, 5].map((star) => (
									<svg
										key={star}
										className="h-5 w-5 text-yellow-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>
						</div>

						<div
							className={`${
								isDarkMode ? "bg-gray-750" : "bg-white"
							} p-6 rounded-xl`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
						>
							<div className="flex items-center mb-4">
								<img
									src="https://randomuser.me/api/portraits/women/68.jpg"
									alt="User"
									className="h-12 w-12 rounded-full mr-4"
									style={{
										boxShadow: isDarkMode
											? "2px 2px 4px rgba(0, 0, 0, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.05)"
											: "2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.5)",
									}}
								/>
								<div>
									<h4
										className={`font-medium ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Taylor Wilson
									</h4>
									<p
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Frontend Developer
									</p>
								</div>
							</div>
							<p
								className={`${
									isDarkMode ? "text-gray-300" : "text-gray-600"
								} mb-3`}
							>
								"Implementation was a breeze. The code is clean,
								well-structured, and highly customizable. Dark mode support was
								a nice bonus that our users love."
							</p>
							<div className="flex">
								{[1, 2, 3, 4, 5].map((star) => (
									<svg
										key={star}
										className="h-5 w-5 text-yellow-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>
						</div>
					</div>
				</div>

				<div
					className={`${
						isDarkMode ? "bg-blue-900" : "bg-blue-600"
					} p-12 rounded-xl mb-16 text-center`}
					style={{
						boxShadow: isDarkMode
							? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
							: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
					}}
				>
					<h2 className="text-3xl font-bold text-white mb-4">
						Ready to Transform Your Notifications?
					</h2>
					<p className="text-blue-100 max-w-2xl mx-auto mb-8">
						Join thousands of teams who have enhanced their productivity with
						our notification system. Get started today with our 14-day free
						trial.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							className={`px-8 py-3 bg-white text-blue-600 font-medium rounded-xl shadow-lg hover:bg-gray-100 transition-colors`}
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.5)",
							}}
							onClick={() => {
								setToastMessage("Starting free trial...");
								setShowToast(true);
								setTimeout(() => setShowToast(false), 3000);
							}}
						>
							Start Free Trial
						</button>
						<button
							className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
							style={{
								boxShadow: isDarkMode
									? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
									: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.3)",
							}}
							onClick={() => {
								setToastMessage("Demo scheduler will open");
								setShowToast(true);
								setTimeout(() => setShowToast(false), 3000);
							}}
						>
							Schedule Demo
						</button>
					</div>
				</div>
			</main>

			<footer
				className={`${
					isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
				} py-16 relative overflow-hidden`}
			>
				<div className="absolute inset-0 opacity-5">
					<div
						className="absolute top-0 left-0 w-full h-full"
						style={{
							backgroundImage: `radial-gradient(circle, ${
								isDarkMode ? "#3B82F6" : "#60A5FA"
							} 1px, transparent 1px)`,
							backgroundSize: "30px 30px",
						}}
					/>
				</div>

				<div className="max-w-7xl mx-auto px-4 mb-16">
					<div
						className={`${
							isDarkMode ? "bg-gray-800" : "bg-white"
						} rounded-2xl p-8 md:p-10 relative overflow-hidden`}
						style={{
							boxShadow: isDarkMode
								? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
								: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
						}}
					>
						<div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 opacity-10">
							<div className="w-full h-full rounded-full bg-blue-500" />
						</div>

						<div className="grid md:grid-cols-2 gap-8 items-center">
							<div>
								<h3
									className={`text-2xl font-bold ${
										isDarkMode ? "text-white" : "text-gray-900"
									} mb-3`}
								>
									Stay updated with NotifyMe
								</h3>
								<p
									className={`${
										isDarkMode ? "text-gray-400" : "text-gray-600"
									} mb-6 max-w-md`}
								>
									Get the latest product updates, company news, and notification
									tips delivered straight to your inbox.
								</p>
								<div className="flex flex-col sm:flex-row gap-3">
									<div className="flex-1">
										<div
											className="relative"
											style={{
												boxShadow: isDarkMode
													? "inset 3px 3px 7px rgba(0, 0, 0, 0.3), inset -3px -3px 7px rgba(255, 255, 255, 0.05)"
													: "inset 3px 3px 7px rgba(0, 0, 0, 0.05), inset -3px -3px 7px rgba(255, 255, 255, 0.7)",
												borderRadius: "0.75rem",
												border: emailError
													? "2px solid #ef4444"
													: "2px solid transparent",
											}}
										>
											<input
												type="email"
												placeholder="Your email address"
												value={newsletterEmail}
												onChange={(e) => {
													setNewsletterEmail(e.target.value);

													if (emailError) setEmailError("");
												}}
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														handleNewsletterSubscribe();
													}
												}}
												className={`w-full py-3 px-4 outline-none ${
													isDarkMode
														? "bg-gray-800 text-gray-200"
														: "bg-white text-gray-800"
												} rounded-xl ${emailError ? "text-red-600" : ""}`}
												style={{ background: "transparent" }}
												disabled={isSubscribing}
											/>
											{emailError && (
												<div className="absolute left-0 -bottom-6 flex items-center text-red-500 text-xs">
													<svg
														className="w-3 h-3 mr-1"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
															clipRule="evenodd"
														/>
													</svg>
													{emailError}
												</div>
											)}
										</div>
									</div>
									<button
										onClick={handleNewsletterSubscribe}
										disabled={isSubscribing || !newsletterEmail.trim()}
										className={`px-6 py-3 ${
											isSubscribing || !newsletterEmail.trim()
												? isDarkMode
													? "bg-gray-600 cursor-not-allowed"
													: "bg-gray-400 cursor-not-allowed"
												: isDarkMode
												? "bg-blue-600 hover:bg-blue-700"
												: "bg-blue-600 hover:bg-blue-700"
										} text-white font-medium rounded-xl transition-all flex items-center justify-center min-w-[120px]`}
										style={{
											boxShadow: isDarkMode
												? "4px 4px 10px rgba(0, 0, 0, 0.3), -4px -4px 10px rgba(255, 255, 255, 0.05)"
												: "4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.7)",
										}}
									>
										{isSubscribing ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Subscribing...
											</>
										) : (
											"Subscribe"
										)}
									</button>
								</div>
								<p
									className={`mt-${emailError ? "8" : "3"} text-xs ${
										isDarkMode ? "text-gray-500" : "text-gray-500"
									}`}
								>
									We respect your privacy. Unsubscribe at any time.
								</p>
							</div>

							<div className="hidden md:flex justify-end">
								<div
									className="relative w-60 h-60 flex items-center justify-center"
									style={{
										boxShadow: isDarkMode
											? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)"
											: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)",
										borderRadius: "50%",
										background: isDarkMode ? "#1F2937" : "white",
									}}
								>
									<FiBell
										className={`w-24 h-24 ${
											isDarkMode ? "text-blue-400" : "text-blue-500"
										}`}
									/>
									<div
										className="absolute top-8 right-4 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs animate-pulse"
										style={{
											boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
										}}
									>
										3
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
						<div className="md:col-span-2">
							<div
								className={`${
									isDarkMode ? "bg-gray-800" : "bg-white"
								} p-6 rounded-xl mb-6`}
								style={{
									boxShadow: isDarkMode
										? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
										: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
								}}
							>
								<h3
									className={`text-xl font-bold mb-3 ${
										isDarkMode ? "text-white" : "text-gray-900"
									} flex items-center`}
								>
									<FiBell className="mr-2 text-blue-500" /> NotifyMe
								</h3>
								<p
									className={`mb-4 ${
										isDarkMode ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Modern notification system with neumorphic design and
									real-time updates. Stay informed with elegant design and
									powerful features.
								</p>

								<div className="flex flex-wrap gap-3 mb-4">
									<a
										href="#"
										onClick={() => {
											setToastMessage("Navigating to #Notifications");
											setShowToast(true);
											setTimeout(() => setShowToast(false), 2000);
										}}
										className={`${
											isDarkMode
												? "bg-gray-700 text-blue-400"
												: "bg-blue-50 text-blue-600"
										} px-3 py-1 rounded-md text-sm hover:opacity-90 transition-opacity`}
									>
										#Notifications
									</a>
									<a
										href="#"
										onClick={() => {
											setToastMessage("Navigating to #Neumorphic");
											setShowToast(true);
											setTimeout(() => setShowToast(false), 2000);
										}}
										className={`${
											isDarkMode
												? "bg-gray-700 text-blue-400"
												: "bg-blue-50 text-blue-600"
										} px-3 py-1 rounded-md text-sm hover:opacity-90 transition-opacity`}
									>
										#Neumorphic
									</a>
									<a
										href="#"
										onClick={() => {
											setToastMessage("Navigating to #NextJS");
											setShowToast(true);
											setTimeout(() => setShowToast(false), 2000);
										}}
										className={`${
											isDarkMode
												? "bg-gray-700 text-blue-400"
												: "bg-blue-50 text-blue-600"
										} px-3 py-1 rounded-md text-sm hover:opacity-90 transition-opacity`}
									>
										#NextJS
									</a>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<div
									className={`flex items-center ${
										isDarkMode ? "text-gray-400" : "text-gray-600"
									} rounded-lg p-3 flex-1`}
								>
									<FiMail className="w-5 h-5 mr-2 flex-shrink-0" />
									<span className="text-sm">hello@notifyme.com</span>
								</div>
								<div
									className={`flex items-center ${
										isDarkMode ? "text-gray-400" : "text-gray-600"
									} rounded-lg p-3 flex-1`}
								>
									<FiPhone className="w-5 h-5 mr-2 flex-shrink-0" />
									<span className="text-sm">+1 (555) 123-4567</span>
								</div>
							</div>
						</div>

						<div>
							<h4
								className={`font-semibold mb-5 ${
									isDarkMode ? "text-gray-200" : "text-gray-900"
								} pb-2 border-b ${
									isDarkMode ? "border-gray-800" : "border-gray-200"
								}`}
							>
								Product
							</h4>
							<ul className="space-y-3">
								{[
									"Features",
									"Pricing",
									"Integrations",
									"API",
									"Documentation",
								].map((item) => (
									<li key={item}>
										<a
											href="#"
											onClick={() => {
												setToastMessage(`Navigating to ${item}`);
												setShowToast(true);
												setTimeout(() => setShowToast(false), 2000);
											}}
											className={`${
												isDarkMode
													? "text-gray-400 hover:text-white"
													: "text-gray-600 hover:text-gray-900"
											} flex items-center group transition-colors`}
										>
											<span
												className={`w-1.5 h-1.5 rounded-full ${
													isDarkMode ? "bg-gray-700" : "bg-gray-300"
												} mr-2 group-hover:bg-blue-500 transition-colors`}
											></span>
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4
								className={`font-semibold mb-5 ${
									isDarkMode ? "text-gray-200" : "text-gray-900"
								} pb-2 border-b ${
									isDarkMode ? "border-gray-800" : "border-gray-200"
								}`}
							>
								Company
							</h4>
							<ul className="space-y-3">
								{["About Us", "Careers", "Blog", "Press", "Contact"].map(
									(item) => (
										<li key={item}>
											<a
												href="#"
												onClick={() => {
													setToastMessage(`Navigating to ${item}`);
													setShowToast(true);
													setTimeout(() => setShowToast(false), 2000);
												}}
												className={`${
													isDarkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-600 hover:text-gray-900"
												} flex items-center group transition-colors`}
											>
												<span
													className={`w-1.5 h-1.5 rounded-full ${
														isDarkMode ? "bg-gray-700" : "bg-gray-300"
													} mr-2 group-hover:bg-blue-500 transition-colors`}
												></span>
												{item}
											</a>
										</li>
									)
								)}
							</ul>
						</div>

						<div>
							<h4
								className={`font-semibold mb-5 ${
									isDarkMode ? "text-gray-200" : "text-gray-900"
								} pb-2 border-b ${
									isDarkMode ? "border-gray-800" : "border-gray-200"
								}`}
							>
								Support
							</h4>
							<ul className="space-y-3">
								{["Help Center", "Community", "Status Page", "Security"].map(
									(item) => (
										<li key={item}>
											<a
												href="#"
												onClick={() => {
													setToastMessage(`Navigating to ${item}`);
													setShowToast(true);
													setTimeout(() => setShowToast(false), 2000);
												}}
												className={`${
													isDarkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-600 hover:text-gray-900"
												} flex items-center group transition-colors`}
											>
												<span
													className={`w-1.5 h-1.5 rounded-full ${
														isDarkMode ? "bg-gray-700" : "bg-gray-300"
													} mr-2 group-hover:bg-blue-500 transition-colors`}
												></span>
												{item}
											</a>
										</li>
									)
								)}
								<li>
									<a
										href="#"
										onClick={() => {
											setToastMessage("Contacting support...");
											setShowToast(true);
											setTimeout(() => setShowToast(false), 2000);
										}}
										className={`mt-4 inline-flex items-center px-4 py-2 rounded-lg ${
											isDarkMode
												? "bg-blue-600 text-white hover:bg-blue-700"
												: "bg-blue-600 text-white hover:bg-blue-700"
										} transition-colors font-medium text-sm`}
										style={{
											boxShadow: isDarkMode
												? "3px 3px 6px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.05)"
												: "3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.7)",
										}}
									>
										<FiHeadphones className="mr-2" />
										Contact Support
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div
						className={`mb-12 py-6 px-6 rounded-xl ${
							isDarkMode ? "bg-gray-800" : "bg-white"
						}`}
						style={{
							boxShadow: isDarkMode
								? "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
								: "4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.5)",
						}}
					>
						<div className="flex flex-wrap justify-center items-center gap-8">
							<div className="flex flex-col items-center">
								<FiShield
									className={`w-8 h-8 ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} mb-2`}
								/>
								<span
									className={`text-xs ${
										isDarkMode ? "text-gray-500" : "text-gray-500"
									} text-center`}
								>
									ISO 27001 Certified
								</span>
							</div>
							<div className="flex flex-col items-center">
								<FiHeart
									className={`w-8 h-8 ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} mb-2`}
								/>
								<span
									className={`text-xs ${
										isDarkMode ? "text-gray-500" : "text-gray-500"
									} text-center`}
								>
									99.9% Uptime
								</span>
							</div>
							<div className="flex flex-col items-center">
								<FiCheck
									className={`w-8 h-8 ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} mb-2`}
								/>
								<span
									className={`text-xs ${
										isDarkMode ? "text-gray-500" : "text-gray-500"
									} text-center`}
								>
									GDPR Compliant
								</span>
							</div>
							<div className="flex flex-col items-center">
								<FiHelpCircle
									className={`w-8 h-8 ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} mb-2`}
								/>
								<span
									className={`text-xs ${
										isDarkMode ? "text-gray-500" : "text-gray-500"
									} text-center`}
								>
									24/7 Support
								</span>
							</div>
							<div className="flex flex-col items-center">
								<FiUser
									className={`w-8 h-8 ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} mb-2`}
								/>
								<span
									className={`text-xs ${
										isDarkMode ? "text-gray-500" : "text-gray-500"
									} text-center`}
								>
									10,000+ Users
								</span>
							</div>
						</div>
					</div>

					<div
						className={`pt-8 border-t ${
							isDarkMode ? "border-gray-800" : "border-gray-200"
						}`}
					>
						<div className="flex flex-col md:flex-row justify-between items-center">
							<div className="flex flex-col sm:flex-row items-center mb-4 md:mb-0">
								<p
									className={`${
										isDarkMode ? "text-gray-500" : "text-gray-500"
									} text-sm mr-2`}
								>
									2025 NotifyMe. Notifications beyond.
								</p>
							</div>
							<div className="flex flex-wrap justify-center gap-x-6">
								<a
									href="#"
									onClick={() => {
										setToastMessage("Viewing Privacy Policy");
										setShowToast(true);
										setTimeout(() => setShowToast(false), 2000);
									}}
									className={`${
										isDarkMode
											? "text-gray-400 hover:text-white"
											: "text-gray-600 hover:text-gray-900"
									} text-sm transition-colors`}
								>
									Privacy Policy
								</a>
								<a
									href="#"
									onClick={() => {
										setToastMessage("Viewing Terms of Service");
										setShowToast(true);
										setTimeout(() => setShowToast(false), 2000);
									}}
									className={`${
										isDarkMode
											? "text-gray-400 hover:text-white"
											: "text-gray-600 hover:text-gray-900"
									} text-sm transition-colors`}
								>
									Terms of Service
								</a>
								<a
									href="#"
									onClick={() => {
										setToastMessage("Viewing Cookie Policy");
										setShowToast(true);
										setTimeout(() => setShowToast(false), 2000);
									}}
									className={`${
										isDarkMode
											? "text-gray-400 hover:text-white"
											: "text-gray-600 hover:text-gray-900"
									} text-sm transition-colors`}
								>
									Cookie Policy
								</a>
								<a
									href="#"
									onClick={() => {
										setToastMessage("Viewing Accessibility Info");
										setShowToast(true);
										setTimeout(() => setShowToast(false), 2000);
									}}
									className={`${
										isDarkMode
											? "text-gray-400 hover:text-white"
											: "text-gray-600 hover:text-gray-900"
									} text-sm transition-colors`}
								>
									Accessibility
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>

			{isMobile && (
				<div className="fixed bottom-6 right-6 z-10">
					<button
						onClick={() => setShowNotifications(!showNotifications)}
						className={`relative w-14 h-14 flex items-center justify-center rounded-full ${
							isDarkMode
								? "bg-gray-800 text-blue-400"
								: "bg-white text-blue-600"
						} transition-all duration-300`}
						style={{
							boxShadow: showNotifications
								? isDarkMode
									? "inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.1)"
									: "inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)"
								: isDarkMode
								? "6px 6px 12px rgba(0, 0, 0, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.1)"
								: "6px 6px 12px rgba(0, 0, 0, 0.15), -6px -6px 12px rgba(255, 255, 255, 0.8)",
						}}
					>
						<span className="sr-only">View notifications</span>
						<FiBell className="h-6 w-6" />

						{getUnreadCount() > 0 && (
							<motion.span
								initial={{ scale: 0 }}
								animate={{
									scale: animateCount ? [1, 1.2, 1] : 1,
									transition: {
										duration: 0.4,
										ease: "easeInOut",
									},
								}}
								className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1 border border-white"
							>
								{getUnreadCount()}
							</motion.span>
						)}
					</button>
				</div>
			)}

			<AnimatePresence>
				{showToast && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-xl ${
							isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
						} z-50 flex items-center max-w-md`}
						style={{
							boxShadow: isDarkMode
								? "4px 4px 10px rgba(0, 0, 0, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.1)"
								: "4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.7)",
						}}
					>
						<FiInfo
							className={`h-5 w-5 mr-3 ${
								isDarkMode ? "text-blue-400" : "text-blue-600"
							}`}
						/>
						<span className="text-sm">{toastMessage}</span>
					</motion.div>
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
	);
}
