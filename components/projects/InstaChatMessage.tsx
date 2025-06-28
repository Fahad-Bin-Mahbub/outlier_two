"use client";

import { useState, useEffect, useRef } from "react";
import { RiRobot2Line } from "react-icons/ri";
import {
	FiHome,
	FiSearch,
	FiCompass,
	FiMessageSquare,
	FiHeart,
	FiPlusSquare,
	FiUser,
	FiMoreHorizontal,
	FiSun,
	FiMoon,
	FiX,
} from "react-icons/fi";
import { BsThreeDotsVertical, BsCheck2All, BsArrowLeft } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

interface Conversation {
	id: number;
	username: string;
	fullName: string;
	lastMessage: string;
	time: string;
	unread: boolean;
	isActive: boolean;
	avatar?: string;
}

interface Message {
	id: number;
	text: string;
	sender: "user" | "other";
	time: string;
	read: boolean;
}

interface ToastProps {
	message: string;
	type: "info" | "success" | "error" | "warning";
	id: string;
	onDismiss: () => void;
	position?: number;
}

const avatarImages = [
	"https://i.pravatar.cc/150?img=1",
	"https://i.pravatar.cc/150?img=2",
	"https://i.pravatar.cc/150?img=3",
	"https://i.pravatar.cc/150?img=4",
	"https://i.pravatar.cc/150?img=5",
	"https://i.pravatar.cc/150?img=6",
	"https://i.pravatar.cc/150?img=7",
	"https://i.pravatar.cc/150?img=8",
];

const userAvatar = "https://i.pravatar.cc/150?img=12";

const Toast = ({ message, type, id, position = 0, onDismiss }: ToastProps) => {
	const bgColor = {
		info: "bg-blue-500",
		success: "bg-green-500",
		error: "bg-red-500",
		warning: "bg-yellow-500",
	};

	return (
		<motion.div
			key={id}
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`fixed z-50 px-6 py-3 rounded-lg shadow-lg text-white ${bgColor[type]} max-w-xs flex items-center justify-between`}
			transition={{ duration: 0.3 }}
			style={{ top: `${4 + position * 60}px`, right: "1rem" }}
		>
			<span>{message}</span>
			<button
				onClick={onDismiss}
				className="ml-4 text-white hover:text-gray-200 transition-colors"
			>
				<FiX size={18} />
			</button>
		</motion.div>
	);
};

const InstaChatMessaging = () => {
	const [darkMode, setDarkMode] = useState(true);
	const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
	const [message, setMessage] = useState("");
	const [activeTab, setActiveTab] = useState("messages");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isMobileView, setIsMobileView] = useState(false);
	const [showChatOnMobile, setShowChatOnMobile] = useState(false);
	const [showAIChat, setShowAIChat] = useState(false);
	const [toasts, setToasts] = useState<ToastProps[]>([]);
	const [toastIdCounter, setToastIdCounter] = useState(0);

	const [conversations, setConversations] = useState<Conversation[]>([]);

	const [chatMessagesMap, setChatMessagesMap] = useState<
		Record<number, Message[]>
	>({});
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 768);
			if (window.innerWidth >= 768) {
				setShowChatOnMobile(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const showToast = (
		message: string,
		type: "info" | "success" | "error" | "warning" = "info"
	) => {
		const uniqueId = `toast-${toastIdCounter}`;
		setToastIdCounter((prev) => prev + 1);

		const newToast = {
			message,
			type,
			id: uniqueId,
			onDismiss: () => dismissToast(uniqueId),
		};
		setToasts((prev) => [...prev, newToast]);

		setTimeout(() => {
			dismissToast(uniqueId);
		}, 5000);
	};

	const dismissToast = (id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	const getRandomAvatar = (index: number) => {
		return avatarImages[index % avatarImages.length];
	};

	useEffect(() => {
		const initialConversations: Conversation[] = [
			{
				id: 1,
				username: "sarah_johnson",
				fullName: "Sarah Johnson",
				lastMessage: "Hey! How are you doing?",
				time: "2h",
				unread: true,
				isActive: true,
				avatar: getRandomAvatar(0),
			},
			{
				id: 2,
				username: "mike_designs",
				fullName: "Mike Designs",
				lastMessage: "Check out my new artwork!",
				time: "1d",
				unread: false,
				isActive: true,
				avatar: getRandomAvatar(1),
			},
			{
				id: 3,
				username: "travel_with_me",
				fullName: "Travel Blog",
				lastMessage: "You should visit this place!",
				time: "3d",
				unread: true,
				isActive: false,
				avatar: getRandomAvatar(2),
			},
			{
				id: 4,
				username: "jane_photography",
				fullName: "Jane Photography",
				lastMessage: "Thanks for the follow!",
				time: "1w",
				unread: false,
				isActive: false,
				avatar: getRandomAvatar(3),
			},
			{
				id: 5,
				username: "food_lover",
				fullName: "Food Lover",
				lastMessage: "This recipe is amazing!",
				time: "2w",
				unread: false,
				isActive: false,
				avatar: getRandomAvatar(4),
			},
		];
		setConversations(initialConversations);
	}, []);

	const aiConversation: Conversation = {
		id: 999,
		username: "diana_ai",
		fullName: "Diana AI",
		lastMessage: "Hi there! How can I help you today?",
		time: "now",
		unread: false,
		isActive: true,
		avatar: "https://i.pravatar.cc/150?img=20",
	};

	const generateConversation = (chat: Conversation): Message[] => {
		const defaultMessages: Partial<Message>[] = [
			{
				text: "Hey! How are you doing today?",
				sender: "user",
				time: "10:32 AM",
				read: true,
			},
		];

		const conversationTemplates: Record<string, Partial<Message>[]> = {
			sarah_johnson: [
				{ text: "Hi there! Just got back from my trip.", sender: "other" },
				{ text: "Have you seen the photos I posted?", sender: "other" },
				{ text: "They look amazing! Where did you go?", sender: "user" },
				{
					text: "I went to California! The beaches were incredible.",
					sender: "other",
				},
			],
			mike_designs: [
				{ text: "Hey, I just finished the new logo design.", sender: "other" },
				{
					text: "Would love your feedback when you have time.",
					sender: "other",
				},
				{
					text: "Absolutely! I will take a look this afternoon.",
					sender: "user",
				},
				{ text: "Thanks! No rush, just whenever you can.", sender: "other" },
			],
			travel_with_me: [
				{ text: "Check out this hidden beach I discovered!", sender: "other" },
				{
					text: "Adding it to my travel bucket list right now!",
					sender: "user",
				},
				{
					text: "It's even better in person. The water is crystal clear.",
					sender: "other",
				},
				{ text: "Have you tried the local food there?", sender: "user" },
			],
			jane_photography: [
				{ text: "Thanks for following my page!", sender: "other" },
				{
					text: "I love your photography style. Really inspiring!",
					sender: "user",
				},
				{
					text: "That means a lot! I'm trying some new techniques this month.",
					sender: "other",
				},
				{
					text: "Can't wait to see what you come up with next.",
					sender: "user",
				},
			],
			food_lover: [
				{
					text: "Just posted a new pasta recipe you might like.",
					sender: "other",
				},
				{
					text: "That looks delicious! I will try making it this weekend.",
					sender: "user",
				},
				{
					text: "Let me know how it turns out! The secret is in the sauce.",
					sender: "other",
				},
				{ text: "Any wine pairing recommendations?", sender: "user" },
			],
			diana_ai: [
				{
					text: "Hello! I'm Diana, your AI assistant. How can I help you today?",
					sender: "other",
				},
				{
					text: "I need help organizing my schedule for next week.",
					sender: "user",
				},
				{
					text: "I'd be happy to help with that! Would you like me to set up reminders too?",
					sender: "other",
				},
				{ text: "That would be great, thanks!", sender: "user" },
			],
		};

		const template = conversationTemplates[chat.username] || defaultMessages;

		return template.map((msg, index) => {
			const time = new Date();
			time.setMinutes(time.getMinutes() - (template.length - index) * 2);

			return {
				id: index + 1,
				text: msg.text || `Message from ${chat.username}`,
				sender: msg.sender || "other",
				time: time.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				read: true,
			};
		});
	};

	useEffect(() => {
		if (selectedChat) {
			if (!chatMessagesMap[selectedChat.id]) {
				const mockMessages = generateConversation(selectedChat);

				setChatMessagesMap((prev) => ({
					...prev,
					[selectedChat.id]: mockMessages,
				}));

				setMessages(mockMessages);
			} else {
				setMessages(chatMessagesMap[selectedChat.id]);
			}

			if (conversations.find((conv) => conv.id === selectedChat.id)?.unread) {
				setConversations((prevConversations) =>
					prevConversations.map((conv) =>
						conv.id === selectedChat.id ? { ...conv, unread: false } : conv
					)
				);

				showToast(
					`Marked conversation with ${selectedChat.username} as read`,
					"success"
				);
			}

			if (isMobileView) {
				setShowChatOnMobile(true);
			}
		}
	}, [selectedChat, isMobileView]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim() && selectedChat) {
			const currentTime = new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});

			const newMessage: Message = {
				id: Date.now(),
				text: message,
				sender: "user",
				time: currentTime,
				read: false,
			};

			setMessages((prev) => [...prev, newMessage]);
			setChatMessagesMap((prev) => ({
				...prev,
				[selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
			}));

			setConversations((prevConversations) =>
				prevConversations.map((conv) =>
					conv.id === selectedChat.id
						? {
								...conv,
								lastMessage:
									message.slice(0, 30) + (message.length > 30 ? "..." : ""),
								time: "now",
						  }
						: conv
				)
			);

			setMessage("");

			if (selectedChat.id === aiConversation.id) {
				setTimeout(() => {
					const aiResponse: Message = {
						id: Date.now(),
						text: "I'm Diana, your AI assistant. How can I help you today?",
						sender: "other",
						time: new Date().toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
						read: true,
					};

					setMessages((prev) => [...prev, aiResponse]);
					setChatMessagesMap((prev) => ({
						...prev,
						[selectedChat.id]: [...(prev[selectedChat.id] || []), aiResponse],
					}));

					setConversations((prevConversations) =>
						prevConversations.map((conv) =>
							conv.id === selectedChat.id
								? {
										...conv,
										lastMessage:
											aiResponse.text.slice(0, 30) +
											(aiResponse.text.length > 30 ? "..." : ""),
								  }
								: conv
						)
					);
				}, 1000);
			}
		}
	};

	const handleChatSelect = (conversation: Conversation) => {
		setSelectedChat(conversation);
		setShowAIChat(conversation.id === aiConversation.id);

		if (conversation.unread) {
			setConversations((prevConversations) =>
				prevConversations.map((conv) =>
					conv.id === conversation.id ? { ...conv, unread: false } : conv
				)
			);

			showToast(
				`Marked conversation with ${conversation.username} as read`,
				"success"
			);
		}
	};

	const handleBackToList = () => {
		setShowChatOnMobile(false);
	};

	const startAIChat = () => {
		handleChatSelect(aiConversation);
		setShowAIChat(true);
	};

	const handleNonfunctionalButton = () => {
		showToast("This feature is not available yet", "info");
	};

	const getMainContent = () => {
		if (isMobileView && showChatOnMobile) {
			return renderChatArea();
		} else if (isMobileView) {
			return renderConversationList();
		} else {
			return (
				<div className="flex flex-1">
					{renderConversationList()}
					{renderChatArea()}
				</div>
			);
		}
	};

	const renderConversationList = () => {
		return (
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3 }}
				className={`w-full md:w-80 border-r ${
					darkMode
						? "border-gray-700 bg-gray-800"
						: "border-gray-200 bg-gray-50"
				} flex flex-col`}
			>
				<div
					className={`p-4 border-b ${
						darkMode ? "border-gray-700" : "border-gray-200"
					} flex justify-between items-center`}
				>
					<h1 className="text-xl font-semibold">Messages</h1>
					<button
						onClick={() =>
							showToast("New message feature coming soon!", "info")
						}
						className={`${
							darkMode
								? "text-blue-400 hover:text-blue-300"
								: "text-blue-500 hover:text-blue-600"
						} transition-colors duration-200 cursor-pointer`}
					>
						<FiPlusSquare size={20} />
					</button>
				</div>

				<motion.div
					whileHover={{ scale: 1.02 }}
					className={`p-3 flex items-center space-x-3 border-b ${
						darkMode
							? "border-green-800 bg-green-900"
							: "border-green-200 bg-green-50"
					} cursor-pointer hover:${
						darkMode ? "bg-green-800" : "bg-green-100"
					} transition-colors duration-200`}
					onClick={startAIChat}
				>
					<div className="relative">
						<motion.div
							initial={{ rotate: 0 }}
							whileHover={{ rotate: 15 }}
							transition={{ duration: 0.3 }}
							className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-800 ring-2 ring-green-500"
						>
							<RiRobot2Line size={24} />
						</motion.div>
						<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-center">
							<p
								className={`font-semibold truncate ${
									darkMode ? "text-white" : "text-black"
								}`}
							>
								Diana AI
							</p>
							<p
								className={`text-xs ${
									darkMode ? "text-green-400" : "text-green-600"
								}`}
							>
								24/7
							</p>
						</div>
						<div className="flex justify-between items-center">
							<p
								className={`text-sm truncate ${
									darkMode ? "text-gray-300" : "text-gray-600"
								}`}
							>
								Chat with our AI assistant
							</p>
						</div>
					</div>
				</motion.div>

				<div
					className={`p-3 border-b ${
						darkMode ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<div
						className={`relative rounded-md ${
							darkMode ? "bg-gray-700" : "bg-gray-100"
						} transition-all duration-300 focus-within:ring-2 ${
							darkMode
								? "focus-within:ring-blue-500"
								: "focus-within:ring-blue-400"
						}`}
					>
						<FiSearch
							className={`absolute left-3 top-2.5 ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						/>
						<input
							type="text"
							placeholder="Search messages"
							className={`w-full py-1.5 pl-10 pr-3 text-sm rounded-md outline-none transition-colors duration-200 ${
								darkMode
									? "bg-gray-700 text-white placeholder-gray-400"
									: "bg-gray-100 text-gray-900 placeholder-gray-500"
							}`}
						/>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto">
					<AnimatePresence>
						{conversations.map((conversation) => (
							<motion.div
								key={conversation.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								whileHover={{
									scale: 1.01,
									backgroundColor: darkMode
										? "rgba(55, 65, 81, 0.8)"
										: "rgba(243, 244, 246, 0.8)",
								}}
								className={`p-3 flex items-center space-x-3 border-b ${
									darkMode ? "border-gray-700" : "border-gray-200"
								} ${
									selectedChat?.id === conversation.id
										? darkMode
											? "bg-gray-700"
											: "bg-gray-100"
										: ""
								} cursor-pointer transition-all duration-200`}
								onClick={() => handleChatSelect(conversation)}
							>
								<div className="relative">
									<motion.div
										whileHover={{ scale: 1.1 }}
										transition={{ duration: 0.2 }}
										className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${
											conversation.isActive ? "ring-2 ring-green-500" : ""
										}`}
									>
										{conversation.avatar ? (
											<img
												src={conversation.avatar}
												alt={conversation.username}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
												<span>
													{conversation.username.charAt(0).toUpperCase()}
												</span>
											</div>
										)}
									</motion.div>
									{conversation.isActive && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
										></motion.div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-center">
										<p
											className={`font-semibold truncate ${
												conversation.unread
													? darkMode
														? "text-white"
														: "text-black"
													: darkMode
													? "text-gray-300"
													: "text-gray-600"
											}`}
										>
											{conversation.username}
										</p>
										<p
											className={`text-xs ${
												conversation.unread
													? darkMode
														? "text-blue-400"
														: "text-blue-500"
													: darkMode
													? "text-gray-400"
													: "text-gray-500"
											}`}
										>
											{conversation.time}
										</p>
									</div>
									<div className="flex justify-between items-center">
										<p
											className={`text-sm truncate ${
												conversation.unread
													? darkMode
														? "text-white font-medium"
														: "text-black font-medium"
													: darkMode
													? "text-gray-400"
													: "text-gray-500"
											}`}
										>
											{conversation.lastMessage}
										</p>
										{conversation.unread && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="w-2 h-2 bg-blue-500 rounded-full"
											></motion.div>
										)}
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</motion.div>
		);
	};

	const renderChatArea = () => {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				className={`flex-1 flex flex-col ${
					darkMode ? "bg-gray-900" : "bg-white"
				}`}
			>
				{selectedChat ? (
					<>
						<div
							className={`p-4 border-b ${
								darkMode ? "border-gray-700" : "border-gray-200"
							} flex items-center`}
						>
							{isMobileView && (
								<button
									onClick={handleBackToList}
									className={`mr-3 ${
										darkMode
											? "text-white hover:text-blue-300"
											: "text-black hover:text-blue-500"
									} transition-colors duration-200 cursor-pointer`}
								>
									<motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
										<BsArrowLeft size={20} />
									</motion.div>
								</button>
							)}
							<div className="relative mr-3">
								<motion.div
									whileHover={{ scale: 1.1 }}
									transition={{ duration: 0.2 }}
									className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
										selectedChat.isActive ? "ring-2 ring-green-500" : ""
									}`}
								>
									{selectedChat.id === aiConversation.id ? (
										<div className="w-full h-full bg-green-200 flex items-center justify-center text-green-800">
											<RiRobot2Line size={16} />
										</div>
									) : selectedChat.avatar ? (
										<img
											src={selectedChat.avatar}
											alt={selectedChat.username}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
											<span className="text-sm">
												{selectedChat.username.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
								</motion.div>
								{selectedChat.isActive && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"
									></motion.div>
								)}
							</div>
							<div className="flex-1">
								<p className="font-semibold">{selectedChat.username}</p>
								<p
									className={`text-xs ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									{selectedChat.id === aiConversation.id
										? "Always active"
										: selectedChat.isActive
										? "Active now"
										: `Active ${selectedChat.time} ago`}
								</p>
							</div>
							<button
								onClick={() => showToast("More options coming soon", "info")}
								className={`${
									darkMode
										? "text-gray-300 hover:text-gray-100"
										: "text-gray-600 hover:text-gray-800"
								} transition-colors duration-200 cursor-pointer`}
							>
								<motion.div
									whileHover={{ rotate: 90 }}
									transition={{ duration: 0.3 }}
								>
									<FiMoreHorizontal size={20} />
								</motion.div>
							</button>
						</div>

						{showAIChat && messages.length <= 0 && (
							<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
									className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center mb-4"
								>
									<motion.div
										animate={{
											rotate: [0, 10, 0, -10, 0],
										}}
										transition={{
											repeat: Infinity,
											repeatType: "reverse",
											duration: 5,
										}}
									>
										<RiRobot2Line size={32} className="text-green-800" />
									</motion.div>
								</motion.div>
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2, duration: 0.4 }}
									className="text-lg font-semibold mb-2"
								>
									Welcome to AI chat!
								</motion.h2>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4, duration: 0.4 }}
									className={`text-sm mb-4 ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									It's Diana. How are you today?
								</motion.p>
							</div>
						)}

						{messages.length > 0 && (
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								<AnimatePresence>
									{messages.map((msg) => (
										<motion.div
											key={msg.id}
											initial={{ opacity: 0, y: 20, scale: 0.8 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											transition={{ duration: 0.2 }}
											className={`flex ${
												msg.sender === "user" ? "justify-end" : "justify-start"
											}`}
										>
											{msg.sender === "other" && (
												<div className="h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
													{selectedChat.id === aiConversation.id ? (
														<div className="w-full h-full bg-green-200 flex items-center justify-center">
															<RiRobot2Line
																size={16}
																className="text-green-800"
															/>
														</div>
													) : (
														<img
															src={selectedChat.avatar || "#"}
															alt={selectedChat.username}
															className="w-full h-full object-cover"
														/>
													)}
												</div>
											)}
											<motion.div
												whileHover={{ scale: 1.02 }}
												className={`max-w-[70%] rounded-2xl py-2 px-4 ${
													msg.sender === "user"
														? `${
																darkMode ? "bg-blue-600" : "bg-blue-500"
														  } text-white shadow-md`
														: `${darkMode ? "bg-gray-700" : "bg-gray-200"} ${
																darkMode ? "text-white" : "text-gray-900"
														  } shadow-md`
												}`}
											>
												<p>{msg.text}</p>
												<div
													className={`text-xs flex items-center justify-end mt-1 ${
														msg.sender === "user"
															? "text-blue-200"
															: darkMode
															? "text-gray-400"
															: "text-gray-500"
													}`}
												>
													<span>{msg.time}</span>
													{msg.sender === "user" && (
														<motion.span
															initial={{ scale: 0 }}
															animate={{ scale: 1 }}
															className="ml-1"
														>
															<BsCheck2All
																size={16}
																className={msg.read ? "text-blue-300" : ""}
															/>
														</motion.span>
													)}
												</div>
											</motion.div>
											{msg.sender === "user" && (
												<div className="h-8 w-8 rounded-full overflow-hidden ml-2 flex-shrink-0">
													<img
														src={userAvatar}
														alt="User"
														className="w-full h-full object-cover"
													/>
												</div>
											)}
										</motion.div>
									))}
								</AnimatePresence>
								<div ref={messagesEndRef} />
							</div>
						)}

						<form
							onSubmit={handleSendMessage}
							className={`border-t ${
								darkMode ? "border-gray-700" : "border-gray-200"
							} p-3`}
						>
							<div
								className={`flex items-center rounded-full overflow-hidden border p-1 pl-4 pr-2 ${
									darkMode
										? "border-gray-600 focus-within:border-blue-500"
										: "border-gray-300 focus-within:border-blue-400"
								} transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-300 focus-within:ring-opacity-50`}
							>
								<input
									type="text"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder={
										selectedChat.id === aiConversation.id
											? "Ask Diana something..."
											: "Message..."
									}
									className={`flex-1 outline-none text-sm ${
										darkMode
											? "bg-gray-900 text-white"
											: "bg-white text-gray-900"
									}`}
								/>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									type="submit"
									className={`ml-2 p-2 rounded-full ${
										message.trim()
											? "bg-blue-600 text-white hover:bg-blue-500"
											: darkMode
											? "bg-gray-700 text-gray-400"
											: "bg-gray-200 text-gray-500"
									} cursor-pointer transition-colors duration-200`}
									disabled={!message.trim()}
								>
									<IoSend size={16} />
								</motion.button>
							</div>
						</form>
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
							className={`w-16 h-16 rounded-full ${
								darkMode ? "bg-gray-700" : "bg-gray-200"
							} flex items-center justify-center mb-4`}
						>
							<motion.div
								animate={{ y: [0, -5, 0, 5, 0] }}
								transition={{ repeat: Infinity, duration: 4 }}
							>
								<FiMessageSquare
									size={24}
									className={darkMode ? "text-gray-400" : "text-gray-500"}
								/>
							</motion.div>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.4 }}
							className="text-lg font-semibold mb-2"
						>
							Your Messages
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.4 }}
							className={`text-sm mb-4 ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							Send private photos and messages to a friend or group.
						</motion.p>
						<motion.button
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.4 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => showToast("Coming soon!", "info")}
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all duration-200 cursor-pointer"
						>
							Send Message
						</motion.button>
					</div>
				)}
			</motion.div>
		);
	};

	return (
		<div
			className={`flex h-screen w-full ${
				darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
			} transition-colors duration-300`}
		>
			<AnimatePresence>
				{toasts.map((toast, index) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						id={toast.id}
						position={index}
						onDismiss={() => dismissToast(toast.id)}
					/>
				))}
			</AnimatePresence>

			<motion.div
				initial={{ x: -20, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.3 }}
				className={`w-16 md:w-20 border-r ${
					darkMode ? "border-gray-700" : "border-gray-200"
				} flex flex-col items-center py-4`}
			>
				{}
				<motion.div
					whileHover={{ scale: 1.1 }}
					className={`text-2xl font-bold mb-8 ${
						darkMode ? "text-blue-400" : "text-blue-500"
					}`}
				>
					<div className="flex flex-col items-center">
						<motion.span
							animate={{ y: [0, -2, 0] }}
							transition={{ repeat: Infinity, duration: 2 }}
							className="text-lg font-light"
						>
							Insta
						</motion.span>
						<motion.span
							animate={{ y: [0, 2, 0] }}
							transition={{ repeat: Infinity, duration: 2 }}
							className="text-lg font-bold"
						>
							Chat
						</motion.span>
					</div>
				</motion.div>

				<nav className="flex flex-col items-center space-y-6">
					{[
						{ icon: <FiHome size={24} />, tab: "home", tooltip: "Home" },
						{ icon: <FiSearch size={24} />, tab: "search", tooltip: "Search" },
						{
							icon: <FiCompass size={24} />,
							tab: "explore",
							tooltip: "Explore",
						},
						{
							icon: <FiMessageSquare size={24} />,
							tab: "messages",
							tooltip: "Messages",
							badge: true,
						},
						{
							icon: <FiHeart size={24} />,
							tab: "notifications",
							tooltip: "Notifications",
						},
						{
							icon: <FiPlusSquare size={24} />,
							tab: "create",
							tooltip: "Create",
						},
						{ icon: <FiUser size={24} />, tab: "profile", tooltip: "Profile" },
					].map((item) => (
						<div key={item.tab} className="relative group">
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className={`p-2 rounded-md ${
									activeTab === item.tab
										? darkMode
											? "text-blue-400"
											: "text-blue-500"
										: darkMode
										? "text-gray-300"
										: "text-gray-600"
								} transition-colors duration-200 cursor-pointer hover:${
									darkMode ? "text-blue-300" : "text-blue-400"
								}`}
								onClick={() => {
									setActiveTab(item.tab);
									if (item.tab !== "messages") {
										showToast(`${item.tooltip} coming soon!`, "info");
									}
								}}
							>
								{item.icon}
							</motion.button>
							{item.badge && (
								<motion.span
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
								></motion.span>
							)}
							<div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
								{item.tooltip}
							</div>
						</div>
					))}
				</nav>

				{}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={toggleDarkMode}
					className={`mt-auto p-3 rounded-full ${
						darkMode
							? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
							: "bg-gray-200 text-indigo-700 hover:bg-gray-300"
					} cursor-pointer transition-all duration-200 flex items-center justify-center`}
				>
					{darkMode ? (
						<FiSun size={20} className="text-yellow-300" />
					) : (
						<FiMoon size={20} className="text-indigo-700" />
					)}
				</motion.button>
			</motion.div>

			{getMainContent()}
		</div>
	);
};

export default InstaChatMessaging;
