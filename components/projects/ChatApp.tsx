"use client";
import { useState, useEffect, useMemo, useCallback } from "react";

interface Message {
	id: number;
	text: string;
	sender: string;
	time: string;
	isRead: boolean;
	conversationId: number;
	timestamp: number;
	isSent?: boolean;
}

interface Conversation {
	id: number;
	contactName: string;
	lastMessageTime: string;
	unreadCount: number;
	lastTimestamp: number;
	avatar?: string;
	lastMessage?: string;
}

const ChatApp = () => {
	const now = Date.now();
	const hour = 3600 * 1000;
	const day = 24 * hour;

	const [messages, setMessages] = useState<Message[]>([
		{
			id: 1,
			text: "Hey there! How are you?",
			sender: "Alice",
			time: "10:30 AM",
			isRead: false,
			conversationId: 1,
			timestamp: now - hour,
		},
		{
			id: 2,
			text: "Can you send me the project files?",
			sender: "Alice",
			time: "10:25 AM",
			isRead: true,
			conversationId: 1,
			timestamp: now - hour - 5 * 60 * 1000,
		},
		{
			id: 3,
			text: "Meeting at 2pm tomorrow",
			sender: "Bob",
			time: "9:15 AM",
			isRead: false,
			conversationId: 2,
			timestamp: now - 2 * hour,
		},
		{
			id: 4,
			text: "I finished the report",
			sender: "Bob",
			time: "9:10 AM",
			isRead: true,
			conversationId: 2,
			timestamp: now - 2 * hour - 5 * 60 * 1000,
		},
		{
			id: 5,
			text: "Remember to bring the documents",
			sender: "Charlie",
			time: "Yesterday",
			isRead: true,
			conversationId: 3,
			timestamp: now - day,
		},
		{
			id: 6,
			text: "The project is due next week",
			sender: "Dana",
			time: "Yesterday",
			isRead: true,
			conversationId: 4,
			timestamp: now - day - hour,
		},
	]);

	const [newMessage, setNewMessage] = useState("");
	const [activeConversation, setActiveConversation] = useState<number | null>(
		null
	);
	const [showChat, setShowChat] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [notification, setNotification] = useState<{
		show: boolean;
		message: string;
		sender: string;
	}>({
		show: false,
		message: "",
		sender: "",
	});
	const [isSending, setIsSending] = useState(false);

	const toggleTheme = () => {
		document.documentElement.classList.add("color-theme-in-transition");
		setTheme(theme === "light" ? "dark" : "light");
		setTimeout(() => {
			document.documentElement.classList.remove("color-theme-in-transition");
		}, 1000);
	};

	useEffect(() => {
		const latestUnread = messages.find((msg) => !msg.isRead && !msg.isSent);

		if (latestUnread && latestUnread.timestamp > now - 5000) {
			setNotification({
				show: true,
				message: latestUnread.text,
				sender: latestUnread.sender,
			});

			const timer = setTimeout(() => {
				setNotification({ show: false, message: "", sender: "" });
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [messages]);

	const conversations = messages.reduce(
		(convs: Conversation[], message: Message) => {
			const existingConvIndex = convs.findIndex(
				(c) => c.id === message.conversationId
			);

			if (existingConvIndex >= 0) {
				if (message.timestamp > convs[existingConvIndex].lastTimestamp) {
					convs[existingConvIndex].lastTimestamp = message.timestamp;
					convs[existingConvIndex].lastMessageTime = message.time;
					convs[existingConvIndex].lastMessage = message.text;
				}

				if (!message.isRead && !message.isSent) {
					convs[existingConvIndex].unreadCount++;
				}
				return convs;
			}

			return [
				...convs,
				{
					id: message.conversationId,
					contactName:
						message.sender === "You"
							? findContactName(message.conversationId, messages)
							: message.sender,
					lastMessageTime: message.time,
					unreadCount: !message.isRead && !message.isSent ? 1 : 0,
					lastTimestamp: message.timestamp,
					avatar: getInitialsColor(
						message.sender === "You"
							? findContactName(message.conversationId, messages)
							: message.sender
					),
					lastMessage: message.text,
				},
			];
		},
		[]
	);

	function findContactName(conversationId: number, msgs: Message[]): string {
		const contactMsg = msgs.find(
			(m) => m.conversationId === conversationId && m.sender !== "You"
		);
		return contactMsg?.sender || "Unknown";
	}

	function getInitialsColor(name: string): string {
		const colors = [
			"bg-violet-200 text-violet-600",
			"bg-emerald-200 text-emerald-600",
			"bg-amber-200 text-amber-600",
			"bg-rose-200 text-rose-600",
			"bg-sky-200 text-sky-600",
			"bg-fuchsia-200 text-fuchsia-600",
			"bg-lime-200 text-lime-600",
		];

		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}

		return colors[Math.abs(hash) % colors.length];
	}

	const formatTime = useCallback((timestamp: number): string => {
		const date = new Date(timestamp);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (date.toDateString() === yesterday.toDateString()) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString([], { month: "short", day: "numeric" });
		}
	}, []);

	const sortedConversations = [...conversations].sort((a, b) => {
		if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
		if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

		return b.lastTimestamp - a.lastTimestamp;
	});

	const filteredConversations = sortedConversations.filter(
		(conv) =>
			searchTerm === "" ||
			conv.contactName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const mostRecentMessage = useMemo(() => {
		return messages
			.filter((msg) => !msg.isRead && !msg.isSent)
			.sort((a, b) => b.timestamp - a.timestamp)[0];
	}, [messages]);

	const unreadConversations = useMemo(() => {
		return filteredConversations.filter((conv) => conv.unreadCount > 0);
	}, [filteredConversations]);

	const readConversations = useMemo(() => {
		return filteredConversations.filter((conv) => conv.unreadCount === 0);
	}, [filteredConversations]);

	const conversationMessages = activeConversation
		? messages
				.filter((msg) => msg.conversationId === activeConversation)
				.sort((a, b) => a.timestamp - b.timestamp)
		: [];

	const handleConversationClick = (convId: number) => {
		setActiveConversation(convId);
		setShowChat(true);

		setMessages(
			messages.map((msg) =>
				msg.conversationId === convId && !msg.isSent
					? { ...msg, isRead: true }
					: msg
			)
		);
	};

	const handleSend = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (!newMessage.trim() || !activeConversation) return;

			setIsSending(true);
			const timestamp = Date.now();

			const newMsg: Message = {
				id: Math.max(...messages.map((m) => m.id)) + 1,
				text: newMessage,
				sender: "You",
				time: formatTime(timestamp),
				isRead: true,
				conversationId: activeConversation,
				timestamp: timestamp,
				isSent: true,
			};

			setMessages((prevMessages) => [...prevMessages, newMsg]);
			setNewMessage("");

			setTimeout(() => {
				const responses = [
					"Hello! How are you?",
					"Good day!",
					"Thank you.",
					"I understand.",
					"Great!",
				];
				const randomResponse =
					responses[Math.floor(Math.random() * responses.length)];

				const responseMsg: Message = {
					id: Math.max(...messages.map((m) => m.id)) + 2,
					text: randomResponse,
					sender: findContactName(activeConversation, messages),
					time: formatTime(timestamp),
					isRead: false,
					conversationId: activeConversation,
					timestamp: timestamp,
					isSent: false,
				};

				setMessages((prevMessages) => [...prevMessages, responseMsg]);
				setIsSending(false);
			}, 2000);
		},
		[newMessage, activeConversation, messages, formatTime]
	);

	const simulateNewMessage = useCallback(() => {
		const availableConversations = conversations.filter(
			(c) => c.id !== activeConversation
		);

		if (availableConversations.length === 0) return;

		const randomConv =
			availableConversations[
				Math.floor(Math.random() * availableConversations.length)
			];

		const newMessages = [
			"Hey, do you have a minute?",
			"Did you see my email?",
			"Can we meet tomorrow?",
			"I have a question about the project.",
			"Just checking in!",
		];

		const randomMessage =
			newMessages[Math.floor(Math.random() * newMessages.length)];

		setMessages((prev) => {
			const newId = Math.max(...prev.map((m) => m.id)) + 1;
			const incomingMsg: Message = {
				id: newId,
				text: randomMessage,
				sender: randomConv.contactName,
				time: formatTime(Date.now()),
				isRead: false,
				conversationId: randomConv.id,
				timestamp: Date.now(),
				isSent: false,
			};
			return [...prev, incomingMsg];
		});
	}, [activeConversation, conversations, formatTime]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (Math.random() < 0.25) {
				simulateNewMessage();
			}
		}, 30000);

		return () => clearInterval(intervalId);
	}, [simulateNewMessage]);

	const handleBackToList = () => {
		setShowChat(false);
	};

	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
      .color-theme-in-transition * {
        transition: all 0.5s ease-out !important;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .conversation-item {
        transition: all 0.2s ease;
      }
      
      .message-bubble {
        animation: fadeIn 0.3s ease-out;
      }
      
      .notification-popup {
        animation: slideIn 0.4s ease-out;
      }

      .pulse-animation {
        animation: pulse 0.5s ease-in-out;
      }
      
      
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.04);
        border-radius: 3px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.15);
        border-radius: 3px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.25);
      }
      
      
      .dark ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.04);
      }
      
      .dark ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
      }
      
      .dark ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.25);
      }

      
      @keyframes typingBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      
      .typing-dot:nth-child(1) { animation: typingBounce 1s infinite 0.2s; }
      .typing-dot:nth-child(2) { animation: typingBounce 1s infinite 0.4s; }
      .typing-dot:nth-child(3) { animation: typingBounce 1s infinite 0.6s; }
    `;
		document.head.appendChild(style);

		return () => {
			document.head.removeChild(style);
		};
	}, []);

	return (
		<div
			className={`flex flex-col h-screen ${
				theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
			}`}
		>
			{}
			<header
				className={`${
					theme === "dark"
						? "bg-indigo-900 shadow-lg"
						: "bg-gradient-to-r from-indigo-600 to-violet-500 shadow-md"
				} text-white py-3 px-4 flex justify-between items-center transition-colors duration-300`}
			>
				<h1 className="text-xl md:text-2xl font-bold flex items-center">
					<svg
						className="w-6 h-6 mr-2"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37485 5.27072 7.03255C6.10083 5.69025 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M12 12V12.01M8 12V12.01M16 12V12.01"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
						MessengerPro
					</span>
				</h1>
				<div className="flex items-center space-x-1">
					<button
						onClick={toggleTheme}
						className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/30"
						aria-label="Toggle theme"
					>
						{theme === "dark" ? (
							<svg
								className="w-5 h-5"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M12 2V4"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M12 20V22"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M4.93 4.93L6.34 6.34"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M17.66 17.66L19.07 19.07"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M2 12H4"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M20 12H22"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M4.93 19.07L6.34 17.66"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M17.66 6.34L19.07 4.93"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						) : (
							<svg
								className="w-5 h-5"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M21 12.79C20.8427 14.4922 20.2037 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.88302 19.5345 5.67425 18.3258C4.46548 17.117 3.62593 15.589 3.25393 13.9205C2.88192 12.252 2.99274 10.5121 3.57348 8.9043C4.15423 7.29651 5.18085 5.88737 6.53324 4.84175C7.88562 3.79614 9.5078 3.15731 11.21 3C10.2134 4.34827 9.73385 6.00945 9.85853 7.68141C9.98322 9.35338 10.7038 10.9251 11.8894 12.1106C13.0749 13.2962 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6517 13.7866 21 12.79Z"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
					</button>
				</div>
			</header>

			{}
			{notification.show && (
				<div
					className={`fixed top-16 right-4 max-w-xs ${
						theme === "dark" ? "bg-gray-800" : "bg-white"
					} rounded-lg shadow-xl p-3 border-l-4 border-indigo-500 notification-popup z-50`}
				>
					<div className="flex">
						<div
							className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mr-3 ${getInitialsColor(
								notification.sender
							)}`}
						>
							{notification.sender.charAt(0)}
						</div>
						<div>
							<h4 className="font-semibold">{notification.sender}</h4>
							<p
								className={`text-sm ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}
							>
								{notification.message}
							</p>
						</div>
					</div>
				</div>
			)}

			{}
			<main className="flex-1 flex overflow-hidden">
				{}
				<div
					className={`${
						showChat ? "hidden md:block" : "block"
					} w-full md:w-1/3 lg:w-1/4 overflow-hidden ${
						theme === "dark"
							? "bg-gray-800 border-gray-700"
							: "bg-white border-gray-200"
					} border-r flex flex-col transition-all duration-300`}
				>
					{}
					<div
						className={`p-3 sticky top-0 z-10 transition-colors duration-300 ${
							theme === "dark" ? "bg-gray-800" : "bg-white"
						} border-b ${
							theme === "dark" ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<div className="relative">
							<input
								type="text"
								placeholder="Search conversations..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`w-full p-2.5 pl-10 rounded-lg ${
									theme === "dark"
										? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
										: "bg-gray-50 text-gray-900 border-gray-200"
								} border focus:outline-none focus:ring-2 ${
									theme === "dark"
										? "focus:ring-indigo-500/50"
										: "focus:ring-indigo-500/50"
								} transition-all duration-200`}
							/>
							<svg
								className={`absolute left-3 top-4 w-4 h-4 ${
									theme === "dark" ? "text-gray-400" : "text-gray-500"
								}`}
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clipRule="evenodd"
								/>
							</svg>
							{searchTerm && (
								<button
									onClick={() => setSearchTerm("")}
									className={`absolute right-3 top-3 ${
										theme === "dark"
											? "text-gray-400 hover:text-white"
											: "text-gray-500 hover:text-gray-700"
									} cursor-pointer`}
								>
									<svg
										className="w-4 h-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							)}
						</div>
					</div>

					{}
					{mostRecentMessage && (
						<div
							className={`px-4 py-3 ${
								theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-50"
							} border-b ${
								theme === "dark" ? "border-indigo-800/50" : "border-indigo-100"
							} transition-all duration-300`}
						>
							<div className="font-medium mb-1.5 text-indigo-500 text-sm flex items-center">
								<svg
									className="w-4 h-4 mr-1"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M5.6 9.6H12"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M5.6 14.4H8.4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M14.4 19.2H9.6C7.4 19.2 6.3 19.2 5.65 18.55C5 17.9 5 16.8 5 14.6V9.4C5 7.2 5 6.1 5.65 5.45C6.3 4.8 7.4 4.8 9.6 4.8H14.4C16.6 4.8 17.7 4.8 18.35 5.45C19 6.1 19 7.2 19 9.4V14.6C19 16.8 19 17.9 18.35 18.55C17.7 19.2 16.6 19.2 14.4 19.2Z"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
									<path
										d="M19 11.6L20.8263 10.6474C21.1882 10.4327 21.369 10.3254 21.5 10.3254C21.6739 10.3254 21.8252 10.4092 21.9086 10.5547C22 10.7149 22 10.9548 22 11.4347V12.5653C22 13.0452 22 13.2851 21.9086 13.4453C21.8252 13.5908 21.6739 13.6746 21.5 13.6746C21.369 13.6746 21.1882 13.5673 20.8263 13.3526L19 12.4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Latest Message
							</div>
							<div
								className="cursor-pointer hover:bg-indigo-500/10 p-2 rounded-lg transition-colors duration-150"
								onClick={() =>
									handleConversationClick(mostRecentMessage.conversationId)
								}
							>
								<div className="flex items-center mb-1.5">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mr-3 ${getInitialsColor(
											mostRecentMessage.sender
										)} shadow-sm transition-all`}
									>
										{mostRecentMessage.sender.charAt(0)}
									</div>
									<div>
										<h3 className="font-semibold text-sm">
											{mostRecentMessage.sender}
										</h3>
										<span className="text-xs opacity-75">
											{mostRecentMessage.time}
										</span>
									</div>
								</div>
								<p
									className={`text-sm pb-1 ${
										theme === "dark" ? "text-indigo-100" : "text-gray-900"
									} transition-colors duration-200`}
								>
									{mostRecentMessage.text}
								</p>
								<div className="flex justify-end mt-1">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setMessages(
												messages.map((msg) =>
													msg.id === mostRecentMessage.id
														? { ...msg, isRead: true }
														: msg
												)
											);
										}}
										className="text-xs font-medium text-indigo-500 hover:text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-100/30 transition-colors duration-200 cursor-pointer active:scale-95"
									>
										Mark as read
									</button>
								</div>
							</div>
						</div>
					)}

					{}
					{unreadConversations.length > 0 && (
						<div>
							<div className="px-4 py-2 font-medium text-xs uppercase tracking-wider text-indigo-500 flex items-center">
								<svg
									className="w-3.5 h-3.5 mr-1"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Unread Messages
							</div>
							<div
								className={`divide-y ${
									theme === "dark" ? "divide-gray-700/50" : "divide-gray-100"
								}`}
							>
								{unreadConversations.map((conversation) => (
									<div
										key={conversation.id}
										className={`conversation-item px-4 py-3 ${
											theme === "dark"
												? "hover:bg-gray-700/50"
												: "hover:bg-gray-50"
										} cursor-pointer ${
											conversation.id === activeConversation
												? theme === "dark"
													? "bg-gray-700/70"
													: "bg-indigo-50/70"
												: ""
										}`}
										onClick={() => handleConversationClick(conversation.id)}
									>
										<div className="flex justify-between items-start">
											<div className="flex items-center">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mr-3 shadow-sm ${conversation.avatar} transform transition-transform duration-200 hover:scale-105`}
												>
													{conversation.contactName.charAt(0)}
												</div>
												<div>
													<h3
														className={`font-semibold ${
															theme === "dark" ? "text-white" : "text-gray-900"
														} flex items-center text-sm`}
													>
														{conversation.contactName}
														{conversation.unreadCount > 0 && (
															<span className="ml-2 text-xs rounded-full w-5 h-5 flex items-center justify-center bg-indigo-600 text-white pulse-animation">
																{conversation.unreadCount}
															</span>
														)}
													</h3>
													<p
														className={`mt-0.5 text-sm ${
															theme === "dark"
																? "text-indigo-200"
																: "text-gray-800"
														} truncate w-48 md:w-36 lg:w-48 font-medium`}
													>
														{conversation.lastMessage}
													</p>
												</div>
											</div>
											<span
												className={`text-xs ${
													theme === "dark" ? "text-gray-400" : "text-gray-500"
												}`}
											>
												{conversation.lastMessageTime}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{}
					{readConversations.length > 0 && (
						<div className="overflow-y-auto flex-grow">
							<div
								className={`px-4 py-2 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								} text-xs uppercase tracking-wider font-medium flex items-center`}
							>
								<svg
									className="w-3.5 h-3.5 mr-1"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.5 12.5L10.5 14.5L15.5 9.5"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
								</svg>
								Earlier
							</div>
							<div
								className={`divide-y ${
									theme === "dark" ? "divide-gray-700/50" : "divide-gray-100"
								}`}
							>
								{readConversations.map((conversation) => (
									<div
										key={conversation.id}
										className={`conversation-item px-4 py-3 ${
											theme === "dark"
												? "hover:bg-gray-700/50"
												: "hover:bg-gray-50"
										} cursor-pointer ${
											conversation.id === activeConversation
												? theme === "dark"
													? "bg-gray-700/70"
													: "bg-indigo-50/70"
												: ""
										}`}
										onClick={() => handleConversationClick(conversation.id)}
									>
										<div className="flex justify-between items-start">
											<div className="flex items-center">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mr-3 shadow-sm ${conversation.avatar} transform transition-transform duration-200 hover:scale-105`}
												>
													{conversation.contactName.charAt(0)}
												</div>
												<div>
													<h3
														className={`font-medium ${
															theme === "dark"
																? "text-gray-200"
																: "text-gray-900"
														} text-sm`}
													>
														{conversation.contactName}
													</h3>
													<p
														className={`mt-0.5 text-sm ${
															theme === "dark"
																? "text-gray-400"
																: "text-gray-600"
														} truncate w-48 md:w-36 lg:w-48`}
													>
														{conversation.lastMessage}
													</p>
												</div>
											</div>
											<span
												className={`text-xs ${
													theme === "dark" ? "text-gray-500" : "text-gray-500"
												}`}
											>
												{conversation.lastMessageTime}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{}
					{filteredConversations.length === 0 && (
						<div
							className={`p-8 text-center ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							} flex-grow flex flex-col items-center justify-center`}
						>
							<svg
								className={`w-16 h-16 ${
									theme === "dark" ? "text-gray-600" : "text-gray-300"
								} mb-4`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
							{searchTerm ? (
								<p>
									No conversations found matching "
									<span className="font-semibold text-indigo-500">
										{searchTerm}
									</span>
									"
								</p>
							) : (
								<p>No conversations yet</p>
							)}
							<button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 cursor-pointer active:scale-95 transform shadow-md hover:shadow-lg">
								Start a new chat
							</button>
						</div>
					)}
				</div>

				{}
				<div
					className={`${
						!showChat ? "hidden md:flex" : "flex"
					} flex-col w-full md:w-2/3 lg:w-3/4 ${
						theme === "dark" ? "bg-gray-900" : "bg-gray-50"
					} transition-all duration-300`}
				>
					{activeConversation ? (
						<>
							{}
							<div
								className={`py-2.5 px-4 ${
									theme === "dark"
										? "bg-gray-800 border-gray-700"
										: "bg-white border-gray-200"
								} border-b flex items-center transition-colors duration-300 sticky top-0 z-10`}
							>
								<button
									className={`md:hidden mr-3 ${
										theme === "dark"
											? "text-indigo-400 hover:text-indigo-300"
											: "text-indigo-600 hover:text-indigo-800"
									} cursor-pointer p-1 rounded-full hover:bg-indigo-100/20 transition-all duration-200 active:scale-95`}
									onClick={handleBackToList}
									aria-label="Back to conversations"
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<div className="flex items-center">
									{conversations.find((c) => c.id === activeConversation) && (
										<div
											className={`w-9 h-9 rounded-full flex items-center justify-center font-medium mr-3 ${getInitialsColor(
												conversations.find((c) => c.id === activeConversation)
													?.contactName || ""
											)}`}
										>
											{(
												conversations.find((c) => c.id === activeConversation)
													?.contactName || ""
											).charAt(0)}
										</div>
									)}
									<div>
										<div className="font-semibold text-sm">
											{
												conversations.find((c) => c.id === activeConversation)
													?.contactName
											}
										</div>
										<div className="text-xs text-green-500">Online</div>
									</div>
								</div>
								<div className="ml-auto flex">
									<button
										className={`p-2 rounded-full ${
											theme === "dark"
												? "hover:bg-gray-700 text-gray-300"
												: "hover:bg-gray-100 text-gray-700"
										} cursor-pointer transition-colors duration-200`}
									>
										<svg
											className="w-5 h-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.499 20.7963C20.663 20.7019 20.8185 20.5345 20.9007 20.364C21 20.1582 21 19.9181 21 19.438V16.6207C21 16.2169 21 16.015 20.9335 15.842C20.8749 15.6891 20.7795 15.553 20.6559 15.4456C20.516 15.324 20.3262 15.255 19.9468 15.117L16.74 13.9188C16.2985 13.7596 16.0777 13.68 15.8683 13.6732C15.6836 13.6672 15.5019 13.7093 15.3395 13.7962C15.1559 13.8948 15.0179 14.0632 14.742 14.4L13.8 15.6C11.5255 14.2842 9.71584 12.4745 8.4 10.2L9.6 9.25795C9.9368 8.98205 10.1052 8.84409 10.2038 8.66048C10.2907 8.49815 10.3328 8.31643 10.3268 8.1317C10.32 7.92231 10.2404 7.70153 10.0812 7.26L8.88299 4.05321C8.74448 3.67376 8.67523 3.48403 8.55366 3.3441C8.44624 3.22049 8.31013 3.12515 8.15722 3.06645C7.98425 3 7.78235 3 7.37855 3H4.56152C4.08165 3 3.84171 3 3.63586 3.09925C3.4654 3.18146 3.29802 3.33701 3.2037 3.50103C3.08968 3.69907 3.07375 3.91662 3.04189 4.35173C3.01413 4.73086 3 5.11378 3 5.5Z"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
									<button
										className={`p-2 rounded-full ${
											theme === "dark"
												? "hover:bg-gray-700 text-gray-300"
												: "hover:bg-gray-100 text-gray-700"
										} cursor-pointer transition-colors duration-200 ml-1`}
									>
										<svg
											className="w-5 h-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
								</div>
							</div>

							{}
							<div
								className={`flex-1 p-4 overflow-y-auto ${
									theme === "dark" ? "bg-gray-900" : "bg-gray-50"
								} transition-colors duration-300`}
							>
								{conversationMessages.map((message) => (
									<div
										key={message.id}
										className={`mb-3 flex ${
											message.sender === "You" ? "justify-end" : "justify-start"
										}`}
									>
										{message.sender !== "You" && (
											<div
												className={`h-8 w-8 rounded-full flex items-center justify-center font-medium mr-2 ${getInitialsColor(
													message.sender
												)} shadow-sm self-end`}
											>
												{message.sender.charAt(0)}
											</div>
										)}
										<div
											className={`max-w-xs md:max-w-md rounded-2xl py-2.5 px-3.5 message-bubble ${
												message.sender === "You"
													? theme === "dark"
														? "bg-indigo-600 text-white rounded-br-none"
														: "bg-indigo-600 text-white rounded-br-none"
													: theme === "dark"
													? "bg-gray-800 text-white rounded-bl-none shadow-md"
													: "bg-white text-gray-800 rounded-bl-none shadow-sm"
											} transform transition-all duration-200 hover:scale-[1.01]`}
										>
											<p className="text-sm leading-relaxed">{message.text}</p>
											<div
												className={`text-xs mt-1 ${
													message.sender === "You"
														? theme === "dark"
															? "text-indigo-200"
															: "text-indigo-100"
														: theme === "dark"
														? "text-gray-400"
														: "text-gray-500"
												} flex items-center ${
													message.sender === "You" ? "justify-end" : ""
												}`}
											>
												{message.time}
												{message.sender === "You" && (
													<svg
														className="ml-1 w-3.5 h-3.5 text-indigo-200"
														viewBox="0 0 24 24"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M9 12L11 14L15 10M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												)}
											</div>
										</div>
										{message.sender === "You" && (
											<div className="w-8 h-8 opacity-0">{}</div>
										)}
									</div>
								))}

								{isSending && (
									<div className="mb-3 flex justify-start">
										<div
											className={`h-8 w-8 rounded-full flex items-center justify-center font-medium mr-2 ${
												conversations.find((c) => c.id === activeConversation)
													?.avatar
											} shadow-sm self-end`}
										>
											{(
												conversations.find((c) => c.id === activeConversation)
													?.contactName || ""
											).charAt(0)}
										</div>
										<div
											className={`py-2.5 px-4 rounded-2xl rounded-bl-none ${
												theme === "dark" ? "bg-gray-800" : "bg-white"
											} shadow-sm`}
										>
											<div className="flex space-x-1">
												<div className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></div>
												<div className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></div>
												<div className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></div>
											</div>
										</div>
									</div>
								)}

								{conversationMessages.length === 0 && !isSending && (
									<div
										className={`h-full flex items-center justify-center ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
									>
										<div className="text-center max-w-md mx-auto py-12">
											<div className="mb-6">
												<svg
													className={`w-16 h-16 mx-auto ${
														theme === "dark"
															? "text-indigo-900"
															: "text-indigo-100"
													}`}
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37485 5.27072 7.03255C6.10083 5.69025 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z"
														stroke="currentColor"
														strokeWidth="1"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12 12V12.01M8 12V12.01M16 12V12.01"
														stroke="currentColor"
														strokeWidth="1"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</div>
											<h3
												className={`text-lg font-medium ${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												No messages yet
											</h3>
											<p className="mt-2 text-center text-sm">
												Start a conversation with{" "}
												<span className="font-semibold text-indigo-500">
													{
														conversations.find(
															(c) => c.id === activeConversation
														)?.contactName
													}
												</span>
											</p>
											<div className="mt-6">
												<button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-700 transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
													Send your first message
												</button>
											</div>
										</div>
									</div>
								)}
							</div>

							{}
							<form
								onSubmit={handleSend}
								className={`p-3 border-t ${
									theme === "dark"
										? "border-gray-700 bg-gray-800"
										: "border-gray-200 bg-white"
								} transition-colors duration-300 sticky bottom-0 z-10`}
							>
								<div className="flex items-center">
									<button
										type="button"
										className={`p-2 ${
											theme === "dark"
												? "text-gray-400 hover:text-gray-200"
												: "text-gray-500 hover:text-gray-700"
										} rounded-full hover:bg-indigo-100/10 cursor-pointer transition-colors duration-200`}
									>
										<svg
											className="w-5 h-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="1.5"
											/>
											<path
												d="M8.5 12.5C9.32843 12.5 10 11.8284 10 11C10 10.1716 9.32843 9.5 8.5 9.5C7.67157 9.5 7 10.1716 7 11C7 11.8284 7.67157 12.5 8.5 12.5Z"
												fill="currentColor"
											/>
											<path
												d="M15.5 12.5C16.3284 12.5 17 11.8284 17 11C17 10.1716 16.3284 9.5 15.5 9.5C14.6716 9.5 14 10.1716 14 11C14 11.8284 14.6716 12.5 15.5 12.5Z"
												fill="currentColor"
											/>
											<path
												d="M7.5 16.5C8.55556 15.4444 9.71481 14.6667 12 14.6667C14.2852 14.6667 15.5963 15.4444 16.5 16.5"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
											/>
										</svg>
									</button>
									<button
										type="button"
										className={`p-2 ${
											theme === "dark"
												? "text-gray-400 hover:text-gray-200"
												: "text-gray-500 hover:text-gray-700"
										} rounded-full hover:bg-indigo-100/10 cursor-pointer transition-colors duration-200`}
									>
										<svg
											className="w-5 h-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M15.172 7L6.808 15.364M6.8 15.4L12.1 20.7C12.3 20.9 12.6 21 12.9 21C13.2 21 13.5 20.9 13.7 20.7L20.707 13.693C20.9 13.5 21 13.2 21 12.9C21 12.6 20.9 12.3 20.707 12.107L15.4 6.8C15.2 6.6 14.9 6.5 14.6 6.5C14.3 6.5 14 6.6 13.8 6.8L6.8 13.8C6.6 14 6.5 14.3 6.5 14.6C6.5 14.9 6.6 15.2 6.8 15.4Z"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M17.5 10.5L11.5 4.5"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
									<div className="relative flex-1 mx-2">
										<input
											type="text"
											value={newMessage}
											onChange={(e) => setNewMessage(e.target.value)}
											placeholder="Type a message..."
											className={`w-full px-4 py-2.5 ${
												theme === "dark"
													? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
													: "bg-gray-50 text-gray-900 border-gray-200"
											} border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200`}
										/>
									</div>
									<button
										type="submit"
										disabled={isSending || !newMessage.trim()}
										className={`px-3.5 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95 transition-all duration-200 cursor-pointer
                    ${
											isSending || !newMessage.trim()
												? "bg-gray-400 text-white cursor-not-allowed"
												: theme === "dark"
												? "bg-indigo-600 hover:bg-indigo-500 text-white"
												: "bg-indigo-600 hover:bg-indigo-700 text-white"
										}
                  `}
									>
										{isSending ? (
											<svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
													fill="none"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
										) : (
											<svg
												className="w-5 h-5"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M10.3009 13.6949L20.102 3.89398M10.5795 14.1265L12.8019 18.5709C13.339 19.6451 13.6075 20.1822 13.9458 20.3365C14.2394 20.4707 14.5831 20.4745 14.8806 20.3468C15.223 20.2008 15.5058 19.6735 16.0716 18.619L21.5231 7.71213C22.0603 6.70745 22.3289 6.20511 22.2139 5.83869C22.1131 5.52417 21.8613 5.27238 21.5467 5.17156C21.1803 5.05654 20.678 5.32516 19.6733 5.86239L8.76644 11.3139C7.71194 11.8797 7.18469 12.1626 7.03871 12.505C6.91097 12.8025 6.91476 13.1462 7.049 13.4397C7.20334 13.7781 7.74038 14.0466 8.81447 14.5837L10.4328 15.5766"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										)}
									</button>
								</div>
							</form>
						</>
					) : (
						<div
							className={`h-full flex items-center justify-center ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							} flex-col p-4 transition-colors duration-300`}
						>
							<div className="max-w-md text-center py-8">
								<div className="flex justify-center mb-6">
									<div
										className={`p-4 rounded-full ${
											theme === "dark" ? "bg-gray-800" : "bg-indigo-50"
										}`}
									>
										<svg
											className={`w-20 h-20 ${
												theme === "dark" ? "text-indigo-700" : "text-indigo-400"
											}`}
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37485 5.27072 7.03255C6.10083 5.69025 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M12 12V12.01M8 12V12.01M16 12V12.01"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</div>
								</div>
								<h2
									className={`text-xl font-semibold ${
										theme === "dark" ? "text-gray-200" : "text-gray-700"
									} mb-2`}
								>
									Welcome to MessengerPro
								</h2>
								<p className="mb-6">
									Select a conversation from the list to start chatting or
									create a new one
								</p>
								<button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
									Start a new chat
								</button>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default ChatApp;
