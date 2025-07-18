"use client";
import React, { useState, FormEvent, useEffect, useRef } from "react";
import {
	FaUser,
	FaReply,
	FaLightbulb,
	FaExclamationTriangle,
	FaSun,
	FaMoon,
	FaBook,
	FaHeart,
	FaPlus,
	FaSignInAlt,
	FaGithub,
	FaTwitter,
	FaFacebook,
	FaEye,
	FaEyeSlash,
	FaBars,
	FaArrowLeft,
	FaArrowRight,
	FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const generateId = () =>
	`id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function isCommentNew(timestamp: string): boolean {
	const now = new Date();
	const commentDate = new Date(timestamp);
	if (isNaN(commentDate.getTime())) return false;
	const diffMs = now.getTime() - commentDate.getTime();
	return diffMs < 24 * 60 * 60 * 1000 && diffMs > 0;
}

function formatTimestamp(timestamp: string): string {
	const date = new Date(timestamp);
	if (isNaN(date.getTime())) return "";

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) return "Just now";
	if (diffMins < 60)
		return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
	if (diffHours < 24)
		return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
	if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

	return date.toLocaleDateString();
}

interface ReactionType {
	id: "insightful" | "spoiler";
	name: string;
	icon: React.ReactNode;
	count: number;
	reactedBy: string[];
}

interface CommentType {
	id: string;
	author: string;
	timestamp: string;
	content: string;
	replies: CommentType[];
	reactions: ReactionType[];
}

interface BookThreadType {
	bookId: string;
	bookTitle: string;
	bookCover?: string;
	author?: string;
	comments: CommentType[];
}

const availableReactionsList = [
	{ id: "insightful" as const, name: "Insightful", icon: <FaLightbulb /> },
	{
		id: "spoiler" as const,
		name: "Spoiler Alert",
		icon: <FaExclamationTriangle />,
	},
];

const SPOILER_THRESHOLD = 5;
const CURRENT_USER_ID = "current-user";
const LOCAL_STORAGE_KEY = "literati_book_club_data";
const THEME_STORAGE_KEY = "literati_theme";

const initialBookThreads: BookThreadType[] = [
	{
		bookId: "book1",
		bookTitle: "The Whispering Pages",
		bookCover:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=300",
		author: "Eliza Montgomery",
		comments: [
			{
				id: generateId(),
				author: "Alice Wonderland",
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
				content:
					"Just finished chapter 5! The revelation about the library's true purpose was mind-blowing. And the twist with the antagonist being the founder's descendant? Didn't see that coming!",
				replies: [
					{
						id: generateId(),
						author: "Bob The Builder",
						timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
						content:
							"Absolutely! The way the 'whispers' were actually echoes of past events was a brilliant concept. The library's architecture descriptions were phenomenal too.",
						replies: [],
						reactions: [
							{
								id: "insightful",
								name: "Insightful",
								icon: <FaLightbulb />,
								count: 3,
								reactedBy: [],
							},
						],
					},
				],
				reactions: [
					{
						id: "insightful",
						name: "Insightful",
						icon: <FaLightbulb />,
						count: 5,
						reactedBy: [],
					},
					{
						id: "spoiler",
						name: "Spoiler Alert",
						icon: <FaExclamationTriangle />,
						count: 1,
						reactedBy: [],
					},
				],
			},
			{
				id: generateId(),
				author: "Charlie Brown",
				timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
				content:
					"MAJOR SPOILER for 'The Whispering Pages': I can't believe Elara was the one who sealed the ancient knowledge away, not to protect it, but to hoard it! And then her own creation, the mechanical owl, turning against her in the climax – pure genius writing!",
				replies: [],
				reactions: [
					{
						id: "spoiler",
						name: "Spoiler Alert",
						icon: <FaExclamationTriangle />,
						count: SPOILER_THRESHOLD,
						reactedBy: [],
					},
				],
			},
		],
	},
	{
		bookId: "book2",
		bookTitle: "Galaxy Trekkers: Nebula of Lost Souls",
		bookCover:
			"https://images.unsplash.com/photo-1629760946220-5693ee4c46ac?auto=format&fit=crop&q=80&w=200&h=300",
		author: "Marcus Ray",
		comments: [
			{
				id: generateId(),
				author: "Diana Prince",
				timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
				content:
					"The world-building in 'Galaxy Trekkers' is unparalleled. The concept of a sentient nebula that feeds on memories is both terrifying and fascinating. What did everyone think of Captain Eva's sacrifice to save her crew from the nebula's core?",
				replies: [],
				reactions: [
					{
						id: "insightful",
						name: "Insightful",
						icon: <FaLightbulb />,
						count: 8,
						reactedBy: [],
					},
				],
			},
			{
				id: generateId(),
				author: "Clark Kent",
				timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
				content:
					"SPOILER for 'Galaxy Trekkers': The fact that the 'Lost Souls' weren't lost but were integrated into the nebula's consciousness, and Eva joined them willingly to become a guardian, was a deeply philosophical twist. And the anacron (the energy source) being a fragment of a dying god? Wow!",
				replies: [],
				reactions: [
					{
						id: "spoiler",
						name: "Spoiler Alert",
						icon: <FaExclamationTriangle />,
						count: SPOILER_THRESHOLD + 1,
						reactedBy: [],
					},
				],
			},
		],
	},
	{
		bookId: "book3",
		bookTitle: "Chronicles of the Sunken City",
		bookCover:
			"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		author: "Serena Waters",
		comments: [
			{
				id: generateId(),
				author: "Bruce Wayne",
				timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
				content:
					"This fantasy novel has me hooked. The mystery of why the city sank and the political intrigue among the surviving underwater factions is captivating. The coral magic system is also very unique.",
				replies: [],
				reactions: [
					{
						id: "insightful",
						name: "Insightful",
						icon: <FaLightbulb />,
						count: 12,
						reactedBy: [],
					},
				],
			},
			{
				id: generateId(),
				author: "Selina Kyle",
				timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
				content:
					"Okay, this is a HUGE SPOILER for 'Sunken City', so read at your own risk! The prophecy wasn't about the city rising again, but about its inhabitants evolving to conquer the surface world. And the 'Sea King' is actually the long-lost prince of the surface kingdom, cursed by his own brother! I'm still reeling.",
				replies: [],
				reactions: [
					{
						id: "spoiler",
						name: "Spoiler Alert",
						icon: <FaExclamationTriangle />,
						count: 3,
						reactedBy: [],
					},
				],
			},
		],
	},
];

const fadeIn = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3 },
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: { duration: 0.2 },
	},
};

const scale = {
	tap: { scale: 0.98 },
	hover: { scale: 1.02 },
};

const CommentItem: React.FC<{
	comment: CommentType;
	level: number;
	onAddReply: (parentId: string, replyContent: string) => void;
	onAddReaction: (commentId: string, reactionId: ReactionType["id"]) => void;
	isDarkTheme: boolean;
}> = ({ comment, level, onAddReply, onAddReaction, isDarkTheme }) => {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const [userManuallyRevealed, setUserManuallyRevealed] = useState(false);
	const [formattedTimestamp, setFormattedTimestamp] = useState<string>("");
	const [hasMounted, setHasMounted] = useState(false);
	const commentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setHasMounted(true);
		setFormattedTimestamp(formatTimestamp(comment.timestamp));
	}, [comment.timestamp]);

	const spoilerReactionCount =
		comment.reactions.find((r) => r.id === "spoiler")?.count || 0;

	const [isContentVisible, setIsContentVisible] = useState(
		() => spoilerReactionCount < SPOILER_THRESHOLD
	);

	useEffect(() => {
		if (spoilerReactionCount >= SPOILER_THRESHOLD) {
			if (!userManuallyRevealed) {
				setIsContentVisible(false);
			}
		} else {
			setIsContentVisible(true);
			setUserManuallyRevealed(false);
		}
	}, [spoilerReactionCount, userManuallyRevealed]);

	const handleRevealContent = () => {
		setIsContentVisible(true);
		setUserManuallyRevealed(true);
	};

	const handleReplySubmit = (e: FormEvent) => {
		e.preventDefault();
		if (replyContent.trim()) {
			onAddReply(comment.id, replyContent);
			setReplyContent("");
			setShowReplyForm(false);
		}
	};

	const commentIsNew = hasMounted && isCommentNew(comment.timestamp);

	const hasUserReacted = (reactionId: string) => {
		const reaction = comment.reactions.find((r) => r.id === reactionId);
		return reaction?.reactedBy.includes(CURRENT_USER_ID) || false;
	};

	return (
		<motion.div
			ref={commentRef}
			initial="hidden"
			animate="visible"
			exit="exit"
			variants={fadeIn}
			className={`relative ${
				isDarkTheme ? "bg-slate-800 text-white" : "bg-white text-slate-900"
			} shadow-md rounded-lg p-4 mb-4 transition-all duration-300 ease-in-out 
                ${
									level > 0
										? `ml-2 md:ml-${Math.min(level * 4, 12)} border-l-2 ${
												isDarkTheme ? "border-indigo-700" : "border-indigo-200"
										  } pl-3`
										: `border ${
												isDarkTheme ? "border-slate-700" : "border-transparent"
										  }`
								}`}
			style={{
				maxWidth: `calc(100% - ${level * 8}px)`,
				marginLeft: level > 0 ? `${Math.min(level * 16, 60)}px` : 0,
			}}
		>
			{commentIsNew && (
				<motion.span
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm z-10"
				>
					NEW
				</motion.span>
			)}
			<div className="flex items-start space-x-3">
				<div
					className={`flex-shrink-0 ${
						isDarkTheme ? "bg-slate-700" : "bg-slate-200"
					} rounded-full p-2 ${
						isDarkTheme ? "text-slate-300" : "text-slate-600"
					} shadow-inner`}
				>
					<FaUser />
				</div>
				<div>
					<p
						className={`text-sm font-semibold ${
							isDarkTheme ? "text-white" : "text-slate-800"
						}`}
					>
						{comment.author}
					</p>
					{hasMounted && formattedTimestamp ? (
						<p
							className={`text-xs ${
								isDarkTheme ? "text-slate-400" : "text-slate-500"
							} flex items-center`}
						>
							<FaClock className="w-3 h-3 mr-1" />
							{formattedTimestamp}
						</p>
					) : (
						<p
							className={`text-xs ${
								isDarkTheme ? "text-slate-400" : "text-slate-500"
							} h-4`}
						>
							{" "}
						</p>
					)}
				</div>
			</div>

			{spoilerReactionCount >= SPOILER_THRESHOLD && !isContentVisible ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className={`mt-3 p-4 ${
						isDarkTheme
							? "bg-amber-900/50 border border-amber-700"
							: "bg-amber-50 border border-amber-300"
					} rounded-md text-center transition-opacity duration-300`}
				>
					<div
						className={`flex items-center justify-center ${
							isDarkTheme ? "text-amber-400" : "text-amber-600"
						} mb-2`}
					>
						<FaExclamationTriangle className="w-5 h-5" />
						<span className="ml-2 font-semibold">Spoiler Alert!</span>
					</div>
					<div
						className={`text-sm ${
							isDarkTheme ? "text-amber-200" : "text-amber-700"
						} mb-3`}
					>
						This content has been marked as a spoiler by {spoilerReactionCount}{" "}
						{spoilerReactionCount === 1 ? "reader" : "readers"}
					</div>
					<motion.button
						onClick={handleRevealContent}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className={`mt-1 px-4 py-1.5 text-sm font-medium text-white ${
							isDarkTheme
								? "bg-amber-600 hover:bg-amber-500"
								: "bg-amber-500 hover:bg-amber-600"
						} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-200 transform flex items-center justify-center mx-auto space-x-2`}
					>
						<FaEye className="w-4 h-4" />
						<span>Reveal Content</span>
					</motion.button>
				</motion.div>
			) : (
				<div
					className={`mt-3 ${
						isDarkTheme ? "text-slate-300" : "text-slate-700"
					} whitespace-pre-wrap prose prose-sm max-w-none ${
						isDarkTheme ? "prose-invert" : ""
					}`}
				>
					{comment.content}
				</div>
			)}

			<div className="mt-4 flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setShowReplyForm(!showReplyForm)}
					className={`flex items-center space-x-1.5 ${
						isDarkTheme
							? "text-indigo-400 hover:text-indigo-300"
							: "text-indigo-600 hover:text-indigo-700"
					} transition-colors duration-150 font-medium`}
				>
					<FaReply />
					<span>{showReplyForm ? "Cancel" : "Reply"}</span>
				</motion.button>

				{availableReactionsList.map((reactionMeta) => {
					const currentReaction = comment.reactions.find(
						(r) => r.id === reactionMeta.id
					);
					const userHasReacted = hasUserReacted(reactionMeta.id);

					return (
						<motion.button
							key={reactionMeta.id}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => onAddReaction(comment.id, reactionMeta.id)}
							className={`flex items-center space-x-1.5 ${
								userHasReacted
									? isDarkTheme
										? "text-indigo-400 bg-indigo-900/50"
										: "text-indigo-600 bg-indigo-50"
									: isDarkTheme
									? "text-slate-400 hover:text-indigo-400 hover:bg-indigo-900/30"
									: "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
							} transition-colors duration-150 group py-1 px-1.5 rounded-md`}
							aria-label={`${userHasReacted ? "Remove" : "Add"} ${
								reactionMeta.name
							} reaction`}
						>
							{React.cloneElement(reactionMeta.icon as React.ReactElement, {
								className: `w-4 h-4 group-hover:scale-110 transition-transform ${
									userHasReacted
										? "text-yellow-500"
										: isDarkTheme
										? "text-slate-400"
										: "text-slate-500"
								}`,
							})}
							<span
								className={`text-xs font-medium ${
									userHasReacted
										? isDarkTheme
											? "text-indigo-300"
											: "text-indigo-700"
										: ""
								}`}
							>
								{reactionMeta.name}
							</span>
							<span className="text-xs text-slate-400">
								({currentReaction ? currentReaction.count : 0})
							</span>
						</motion.button>
					);
				})}
			</div>

			<AnimatePresence>
				{showReplyForm && (
					<motion.form
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						onSubmit={handleReplySubmit}
						className={`mt-4 pt-3 pl-4 border-l-2 ${
							isDarkTheme ? "border-slate-700" : "border-slate-200"
						}`}
					>
						<textarea
							value={replyContent}
							onChange={(e) => setReplyContent(e.target.value)}
							placeholder={`Reply to ${comment.author}...`}
							rows={3}
							className={`block w-full rounded-md ${
								isDarkTheme
									? "border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
									: "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
							} shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
							required
						/>
						<div className="mt-2.5 flex justify-end space-x-2">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								type="button"
								onClick={() => setShowReplyForm(false)}
								className={`px-4 py-2 text-sm font-semibold ${
									isDarkTheme
										? "text-slate-300 bg-slate-700 hover:bg-slate-600"
										: "text-slate-700 bg-slate-100 hover:bg-slate-200"
								} rounded-md shadow-sm transition-colors`}
							>
								Cancel
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								type="submit"
								className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform"
							>
								Post Reply
							</motion.button>
						</div>
					</motion.form>
				)}
			</AnimatePresence>

			{comment.replies && comment.replies.length > 0 && (
				<div className="mt-4 space-y-3">
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							level={level + 1}
							onAddReply={onAddReply}
							onAddReaction={onAddReaction}
							isDarkTheme={isDarkTheme}
						/>
					))}
				</div>
			)}
		</motion.div>
	);
};

const AddBookModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	onAddBook: (book: Omit<BookThreadType, "comments">) => void;
	isDarkTheme: boolean;
}> = ({ isOpen, onClose, onAddBook, isDarkTheme }) => {
	const [bookTitle, setBookTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [coverUrl, setCoverUrl] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (bookTitle.trim()) {
			onAddBook({
				bookId: generateId(),
				bookTitle: bookTitle.trim(),
				author: author.trim() || undefined,
				bookCover: coverUrl.trim() || undefined,
			});

			setBookTitle("");
			setAuthor("");
			setCoverUrl("");

			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
		>
			<motion.div
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.9, y: 20 }}
				className={`w-full max-w-md ${
					isDarkTheme ? "bg-slate-800" : "bg-white"
				} rounded-xl shadow-2xl overflow-hidden`}
			>
				<div
					className={`px-6 py-4 border-b ${
						isDarkTheme ? "border-slate-700" : "border-slate-200"
					}`}
				>
					<div className="flex items-center justify-between">
						<h3
							className={`text-xl font-bold ${
								isDarkTheme ? "text-white" : "text-slate-900"
							}`}
						>
							Add New Book
						</h3>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={onClose}
							className={`p-1 rounded-full ${
								isDarkTheme ? "hover:bg-slate-700" : "hover:bg-slate-100"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={`h-6 w-6 ${
									isDarkTheme ? "text-slate-400" : "text-slate-500"
								}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</motion.button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					<div className="space-y-4">
						<div>
							<label
								htmlFor="bookTitle"
								className={`block text-sm font-medium ${
									isDarkTheme ? "text-slate-300" : "text-slate-700"
								}`}
							>
								Book Title *
							</label>
							<input
								type="text"
								id="bookTitle"
								value={bookTitle}
								onChange={(e) => setBookTitle(e.target.value)}
								className={`mt-1 block w-full rounded-md p-3 ${
									isDarkTheme
										? "bg-slate-700 border-slate-600 text-white"
										: "bg-white border-slate-300 text-slate-900"
								} shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
								required
							/>
						</div>

						<div>
							<label
								htmlFor="author"
								className={`block text-sm font-medium ${
									isDarkTheme ? "text-slate-300" : "text-slate-700"
								}`}
							>
								Author
							</label>
							<input
								type="text"
								id="author"
								value={author}
								onChange={(e) => setAuthor(e.target.value)}
								className={`mt-1 block w-full rounded-md p-3 ${
									isDarkTheme
										? "bg-slate-700 border-slate-600 text-white"
										: "bg-white border-slate-300 text-slate-900"
								} shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
							/>
						</div>

						<div>
							<label
								htmlFor="coverUrl"
								className={`block text-sm font-medium ${
									isDarkTheme ? "text-slate-300" : "text-slate-700"
								}`}
							>
								Cover Image URL
							</label>
							<input
								type="text"
								id="coverUrl"
								value={coverUrl}
								onChange={(e) => setCoverUrl(e.target.value)}
								className={`mt-1 block w-full rounded-md p-3 ${
									isDarkTheme
										? "bg-slate-700 border-slate-600 text-white"
										: "bg-white border-slate-300 text-slate-900"
								} shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
								placeholder="https://example.com/book-cover.jpg"
							/>
						</div>
					</div>

					<div className="mt-6 flex justify-end space-x-3">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={onClose}
							className={`px-4 py-2 text-sm font-medium rounded-md ${
								isDarkTheme
									? "bg-slate-700 text-slate-300 hover:bg-slate-600"
									: "bg-slate-100 text-slate-700 hover:bg-slate-200"
							} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500`}
						>
							Cancel
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Add Book
						</motion.button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

const AuthModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	isDarkTheme: boolean;
}> = ({ isOpen, onClose, isDarkTheme }) => {
	const [isSignIn, setIsSignIn] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		console.log("Auth data:", {
			email,
			password,
			username: isSignIn ? "" : username,
		});

		alert(
			isSignIn
				? "Sign in successful! Welcome back!"
				: "Account created successfully! Welcome to Literati Book Club!"
		);

		setEmail("");
		setPassword("");
		setUsername("");
		onClose();
	};

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
		>
			<motion.div
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.9, y: 20 }}
				className={`w-full max-w-md ${
					isDarkTheme ? "bg-slate-800" : "bg-white"
				} rounded-xl shadow-2xl overflow-hidden`}
			>
				<div
					className={`px-6 py-4 border-b ${
						isDarkTheme ? "border-slate-700" : "border-slate-200"
					}`}
				>
					<div className="flex items-center justify-between">
						<h3
							className={`text-xl font-bold ${
								isDarkTheme ? "text-white" : "text-slate-900"
							}`}
						>
							{isSignIn ? "Sign In" : "Create Account"}
						</h3>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={onClose}
							className={`p-1 rounded-full ${
								isDarkTheme ? "hover:bg-slate-700" : "hover:bg-slate-100"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={`h-6 w-6 ${
									isDarkTheme ? "text-slate-400" : "text-slate-500"
								}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</motion.button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					<div className="space-y-4">
						{!isSignIn && (
							<div>
								<label
									htmlFor="username"
									className={`block text-sm font-medium ${
										isDarkTheme ? "text-slate-300" : "text-slate-700"
									}`}
								>
									Username
								</label>
								<input
									type="text"
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className={`mt-1 block w-full rounded-md p-3 ${
										isDarkTheme
											? "bg-slate-700 border-slate-600 text-white"
											: "bg-white border-slate-300 text-slate-900"
									} shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
									required={!isSignIn}
								/>
							</div>
						)}

						<div>
							<label
								htmlFor="email"
								className={`block text-sm font-medium ${
									isDarkTheme ? "text-slate-300" : "text-slate-700"
								}`}
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={`mt-1 block w-full rounded-md p-3 ${
									isDarkTheme
										? "bg-slate-700 border-slate-600 text-white"
										: "bg-white border-slate-300 text-slate-900"
								} shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
								required
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className={`block text-sm font-medium ${
									isDarkTheme ? "text-slate-300" : "text-slate-700"
								}`}
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className={`mt-1 block w-full rounded-md p-3 ${
									isDarkTheme
										? "bg-slate-700 border-slate-600 text-white"
										: "bg-white border-slate-300 text-slate-900"
								} shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
								required
							/>
						</div>
					</div>

					<div className="mt-6">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							{isSignIn ? "Sign In" : "Create Account"}
						</motion.button>
					</div>

					<div className="mt-4 text-center">
						<button
							type="button"
							onClick={() => setIsSignIn(!isSignIn)}
							className={`text-sm ${
								isDarkTheme ? "text-indigo-400" : "text-indigo-600"
							} hover:underline focus:outline-none`}
						>
							{isSignIn
								? "Need an account? Sign up"
								: "Already have an account? Sign in"}
						</button>
					</div>

					<div
						className={`mt-6 relative ${
							isDarkTheme ? "text-slate-400" : "text-slate-500"
						}`}
					>
						<div className="absolute inset-0 flex items-center">
							<div
								className={`w-full border-t ${
									isDarkTheme ? "border-slate-700" : "border-slate-300"
								}`}
							></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span
								className={`px-2 ${isDarkTheme ? "bg-slate-800" : "bg-white"}`}
							>
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-6 grid grid-cols-3 gap-3">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							className={`w-full flex items-center justify-center py-2 px-4 border ${
								isDarkTheme
									? "border-slate-700 bg-slate-800"
									: "border-slate-300 bg-white"
							} rounded-md shadow-sm text-sm font-medium ${
								isDarkTheme ? "text-slate-300" : "text-slate-700"
							} hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
						>
							<FaTwitter
								className={`h-5 w-5 ${
									isDarkTheme ? "text-slate-400" : "text-slate-500"
								}`}
							/>
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							className={`w-full flex items-center justify-center py-2 px-4 border ${
								isDarkTheme
									? "border-slate-700 bg-slate-800"
									: "border-slate-300 bg-white"
							} rounded-md shadow-sm text-sm font-medium ${
								isDarkTheme ? "text-slate-300" : "text-slate-700"
							} hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
						>
							<FaFacebook
								className={`h-5 w-5 ${
									isDarkTheme ? "text-slate-400" : "text-slate-500"
								}`}
							/>
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							className={`w-full flex items-center justify-center py-2 px-4 border ${
								isDarkTheme
									? "border-slate-700 bg-slate-800"
									: "border-slate-300 bg-white"
							} rounded-md shadow-sm text-sm font-medium ${
								isDarkTheme ? "text-slate-300" : "text-slate-700"
							} hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
						>
							<FaGithub
								className={`h-5 w-5 ${
									isDarkTheme ? "text-slate-400" : "text-slate-500"
								}`}
							/>
						</motion.button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

const Toast: React.FC<{
	message: string;
	type: "success" | "error" | "info";
	onClose: () => void;
}> = ({ message, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	const getTypeStyles = () => {
		switch (type) {
			case "success":
				return "bg-emerald-500";
			case "error":
				return "bg-red-500";
			case "info":
				return "bg-blue-500";
			default:
				return "bg-slate-700";
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg text-white shadow-lg ${getTypeStyles()}`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					{type === "success" && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
					)}
					{type === "error" && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					)}
					{type === "info" && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 100 2h.01a1 1 0 100-2H10z"
								clipRule="evenodd"
							/>
						</svg>
					)}
					<p>{message}</p>
				</div>
				<button
					onClick={onClose}
					className="ml-4 text-white hover:text-slate-200 focus:outline-none"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</motion.div>
	);
};

const BookClubForum: React.FC = () => {
	const [bookThreads, setBookThreads] = useState<BookThreadType[]>(() => {
		if (typeof window !== "undefined") {
			const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
			return savedData ? JSON.parse(savedData) : initialBookThreads;
		}
		return initialBookThreads;
	});

	const [selectedBookId, setSelectedBookId] = useState<string>("");
	const [newCommentContent, setNewCommentContent] = useState("");
	const [isDarkTheme, setIsDarkTheme] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [showAddBookModal, setShowAddBookModal] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error" | "info";
	} | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		setHasMounted(true);
		const prefersDark =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

		if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
			setIsDarkTheme(true);
			document.body.classList.add("theme-dark");
		} else {
			setIsDarkTheme(false);
			document.body.classList.add("theme-light");
		}

		if (bookThreads.length > 0) {
			setSelectedBookId(bookThreads[0].bookId);
		}

		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [bookThreads.length]);

	useEffect(() => {
		if (hasMounted) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookThreads));
		}
	}, [bookThreads, hasMounted]);

	useEffect(() => {
		if (!hasMounted) return;

		if (isDarkTheme) {
			document.body.classList.remove("theme-light");
			document.body.classList.add("theme-dark");
			localStorage.setItem(THEME_STORAGE_KEY, "dark");
		} else {
			document.body.classList.remove("theme-dark");
			document.body.classList.add("theme-light");
			localStorage.setItem(THEME_STORAGE_KEY, "light");
		}
	}, [isDarkTheme, hasMounted]);

	const currentThread = bookThreads.find(
		(thread) => thread.bookId === selectedBookId
	);

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		setToast({ message, type });
	};

	const handleAddTopLevelComment = (e: FormEvent) => {
		e.preventDefault();
		if (!newCommentContent.trim() || !currentThread) return;
		const newComment: CommentType = {
			id: generateId(),
			author: "Alex Smith",
			timestamp: new Date().toISOString(),
			content: newCommentContent,
			replies: [],
			reactions: [],
		};
		setBookThreads((prevThreads) =>
			prevThreads.map((thread) =>
				thread.bookId === selectedBookId
					? { ...thread, comments: [newComment, ...thread.comments] }
					: thread
			)
		);
		setNewCommentContent("");
		showToast("Comment added successfully!", "success");
	};

	const addReplyToComment = (
		comments: CommentType[],
		parentId: string,
		reply: CommentType
	): CommentType[] => {
		return comments.map((comment) => {
			if (comment.id === parentId) {
				return { ...comment, replies: [reply, ...comment.replies] };
			}
			if (comment.replies.length > 0) {
				return {
					...comment,
					replies: addReplyToComment(comment.replies, parentId, reply),
				};
			}
			return comment;
		});
	};

	const handleAddReply = (parentId: string, replyContent: string) => {
		if (!replyContent.trim() || !currentThread) return;
		const newReply: CommentType = {
			id: generateId(),
			author: "Alex Smith",
			timestamp: new Date().toISOString(),
			content: replyContent,
			replies: [],
			reactions: [],
		};
		setBookThreads((prevThreads) =>
			prevThreads.map((thread) =>
				thread.bookId === selectedBookId
					? {
							...thread,
							comments: addReplyToComment(thread.comments, parentId, newReply),
					  }
					: thread
			)
		);
		showToast("Reply added successfully!", "success");
	};

	const addReactionToCommentList = (
		comments: CommentType[],
		commentId: string,
		reactionId: ReactionType["id"]
	): CommentType[] => {
		return comments.map((comment) => {
			if (comment.id === commentId) {
				const existingReactionIndex = comment.reactions.findIndex(
					(r) => r.id === reactionId
				);
				let newReactions = [...comment.reactions];
				const reactionMeta = availableReactionsList.find(
					(ar) => ar.id === reactionId
				);

				if (existingReactionIndex > -1) {
					if (
						newReactions[existingReactionIndex].reactedBy.includes(
							CURRENT_USER_ID
						)
					) {
						newReactions[existingReactionIndex] = {
							...newReactions[existingReactionIndex],
							count: Math.max(0, newReactions[existingReactionIndex].count - 1),
							reactedBy: newReactions[existingReactionIndex].reactedBy.filter(
								(id) => id !== CURRENT_USER_ID
							),
						};

						if (newReactions[existingReactionIndex].count === 0) {
							newReactions = newReactions.filter(
								(_, index) => index !== existingReactionIndex
							);
						}
					} else {
						newReactions[existingReactionIndex] = {
							...newReactions[existingReactionIndex],
							count: newReactions[existingReactionIndex].count + 1,
							reactedBy: [
								...newReactions[existingReactionIndex].reactedBy,
								CURRENT_USER_ID,
							],
						};
					}
				} else if (reactionMeta) {
					newReactions.push({
						...reactionMeta,
						icon: React.cloneElement(reactionMeta.icon as React.ReactElement, {
							className: "w-4 h-4",
						}),
						count: 1,
						reactedBy: [CURRENT_USER_ID],
					});
				}
				return { ...comment, reactions: newReactions };
			}
			if (comment.replies.length > 0) {
				return {
					...comment,
					replies: addReactionToCommentList(
						comment.replies,
						commentId,
						reactionId
					),
				};
			}
			return comment;
		});
	};

	const handleAddReaction = (
		commentId: string,
		reactionId: ReactionType["id"]
	) => {
		if (!currentThread) return;
		setBookThreads((prevThreads) =>
			prevThreads.map((thread) =>
				thread.bookId === selectedBookId
					? {
							...thread,
							comments: addReactionToCommentList(
								thread.comments,
								commentId,
								reactionId
							),
					  }
					: thread
			)
		);
	};

	const handleAddBook = (bookData: Omit<BookThreadType, "comments">) => {
		const newBook: BookThreadType = {
			...bookData,
			comments: [],
		};

		setBookThreads((prev) => [...prev, newBook]);
		setSelectedBookId(newBook.bookId);
		showToast("New book added successfully!", "success");
	};

	const filteredComments = (comments: CommentType[]): CommentType[] => {
		if (!searchTerm) return comments;

		return comments
			.filter((comment) => {
				const contentMatch = comment.content
					.toLowerCase()
					.includes(searchTerm.toLowerCase());

				const filteredReplies = filteredComments(comment.replies);

				return contentMatch || filteredReplies.length > 0;
			})
			.map((comment) => {
				return {
					...comment,
					replies: filteredComments(comment.replies),
				};
			});
	};

	const filteredThreadComments = currentThread
		? filteredComments(currentThread.comments)
		: [];

	if (!hasMounted) {
		return <div className="min-h-screen bg-slate-100 p-4">Loading...</div>;
	}

	return (
		<div
			className={`min-h-screen ${
				isDarkTheme ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
			} transition-colors duration-300`}
		>
			<header
				className={`sticky top-0 z-50 ${
					isDarkTheme ? "bg-slate-800" : "bg-white"
				} ${
					isScrolled ? "shadow-md" : ""
				} px-4 py-3 transition-all duration-300`}
			>
				<div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
					<div className="flex items-center space-x-2">
						<FaBook className="h-6 w-6 text-indigo-600" />
						<h1 className="text-xl font-bold sm:text-2xl">
							<span className="text-indigo-600">Literati</span>
							<div className="hidden md:block">Book Club</div>
						</h1>
					</div>

					<nav className="hidden md:flex items-center space-x-6">
						<a
							href="#"
							className={`font-medium ${
								isDarkTheme ? "text-white" : "text-slate-900"
							} hover:text-indigo-600 transition-colors`}
						>
							Home
						</a>
						<a
							href="#"
							className={`font-medium ${
								isDarkTheme ? "text-white" : "text-slate-900"
							} hover:text-indigo-600 transition-colors`}
						>
							Books
						</a>
						<a
							href="#"
							className={`font-medium ${
								isDarkTheme ? "text-white" : "text-slate-900"
							} hover:text-indigo-600 transition-colors`}
						>
							Members
						</a>
						<a
							href="#"
							className={`font-medium ${
								isDarkTheme ? "text-white" : "text-slate-900"
							} hover:text-indigo-600 transition-colors`}
						>
							Events
						</a>
					</nav>

					<div className="flex items-center space-x-3">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsSearchActive(!isSearchActive)}
							className={`p-2 rounded-full ${
								isDarkTheme
									? "bg-slate-700 hover:bg-slate-600"
									: "bg-slate-100 hover:bg-slate-200"
							} transition-colors`}
							aria-label="Search"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
								/>
							</svg>
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsDarkTheme(!isDarkTheme)}
							className={`p-2 rounded-full ${
								isDarkTheme
									? "bg-slate-700 hover:bg-slate-600"
									: "bg-slate-100 hover:bg-slate-200"
							} transition-colors`}
							aria-label="Toggle theme"
						>
							{isDarkTheme ? (
								<FaSun className="w-5 h-5 text-yellow-400" />
							) : (
								<FaMoon className="w-5 h-5" />
							)}
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowAuthModal(true)}
							className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md`}
						>
							<FaSignInAlt className="w-4 h-4" />
							<span>Sign In</span>
						</motion.button>

						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-2 rounded-md border border-slate-300"
						>
							<FaBars className="w-5 h-5" />
						</button>
					</div>
				</div>

				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className={`md:hidden mt-2 py-3 px-2 rounded-lg ${
								isDarkTheme ? "bg-slate-700" : "bg-white"
							} shadow-lg`}
						>
							<nav className="flex flex-col space-y-3">
								<a
									href="#"
									className={`px-3 py-2 rounded-md font-medium ${
										isDarkTheme
											? "text-white hover:bg-slate-600"
											: "text-slate-900 hover:bg-slate-100"
									}`}
								>
									Home
								</a>
								<a
									href="#"
									className={`px-3 py-2 rounded-md font-medium ${
										isDarkTheme
											? "text-white hover:bg-slate-600"
											: "text-slate-900 hover:bg-slate-100"
									}`}
								>
									Books
								</a>
								<a
									href="#"
									className={`px-3 py-2 rounded-md font-medium ${
										isDarkTheme
											? "text-white hover:bg-slate-600"
											: "text-slate-900 hover:bg-slate-100"
									}`}
								>
									Members
								</a>
								<a
									href="#"
									className={`px-3 py-2 rounded-md font-medium ${
										isDarkTheme
											? "text-white hover:bg-slate-600"
											: "text-slate-900 hover:bg-slate-100"
									}`}
								>
									Events
								</a>
								<button
									onClick={() => {
										setShowAuthModal(true);
										setIsMobileMenuOpen(false);
									}}
									className="mt-2 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
								>
									<FaSignInAlt className="w-4 h-4" />
									<span>Sign In</span>
								</button>
							</nav>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{isSearchActive && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className="mt-3"
						>
							<div
								className={`flex items-center border-2 ${
									isDarkTheme
										? "border-slate-600 bg-slate-700"
										: "border-slate-300 bg-white"
								} rounded-lg overflow-hidden`}
							>
								<input
									type="text"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder="Search discussions..."
									className={`block w-full py-2 px-4 focus:outline-none ${
										isDarkTheme
											? "bg-slate-700 text-white placeholder-slate-400"
											: "bg-white text-slate-900 placeholder-slate-500"
									}`}
								/>
								{searchTerm && (
									<button
										onClick={() => setSearchTerm("")}
										className={`px-3 ${
											isDarkTheme
												? "text-slate-400 hover:text-white"
												: "text-slate-500 hover:text-slate-700"
										}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					<div className="lg:col-span-3">
						<div
							className={`sticky top-24 ${
								isDarkTheme ? "bg-slate-800" : "bg-white"
							} shadow-lg rounded-xl p-5 transition-colors duration-300`}
						>
							<h2
								className={`text-xl font-semibold mb-4 ${
									isDarkTheme ? "text-white" : "text-slate-800"
								}`}
							>
								Select a Book
							</h2>

							<div className="space-y-4">
								{bookThreads.map((thread) => (
									<motion.button
										key={thread.bookId}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setSelectedBookId(thread.bookId)}
										className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
											thread.bookId === selectedBookId
												? `${
														isDarkTheme
															? "bg-indigo-900/50 ring-2 ring-indigo-500"
															: "bg-indigo-50 ring-2 ring-indigo-500"
												  }`
												: `${
														isDarkTheme
															? "hover:bg-slate-700"
															: "hover:bg-slate-100"
												  }`
										}`}
									>
										{thread.bookCover && (
											<img
												src={thread.bookCover}
												alt={thread.bookTitle}
												className="w-12 h-16 object-cover rounded-md shadow-md"
											/>
										)}
										<div className="flex flex-col min-w-0">
											<h3
												className={`font-medium truncate ${
													isDarkTheme ? "text-white" : "text-slate-900"
												}`}
											>
												{thread.bookTitle}
											</h3>
											{thread.author && (
												<p
													className={`text-sm ${
														isDarkTheme ? "text-slate-400" : "text-slate-600"
													}`}
												>
													by {thread.author}
												</p>
											)}
											<div className="mt-1 flex items-center text-xs text-slate-500">
												<span>{thread.comments.length} comments</span>
											</div>
										</div>
									</motion.button>
								))}

								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowAddBookModal(true)}
									className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg border-2 border-dashed ${
										isDarkTheme
											? "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
											: "border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700"
									} transition-colors`}
								>
									<FaPlus className="w-4 h-4" />
									<span>Add New Book</span>
								</motion.button>
							</div>
						</div>
					</div>

					<div className="lg:col-span-9">
						{currentThread ? (
							<section>
								<div
									className={`${
										isDarkTheme ? "bg-slate-800" : "bg-white"
									} shadow-lg rounded-xl p-6 mb-6 transition-colors duration-300`}
								>
									<div className="sm:flex sm:items-start sm:justify-between">
										<div className="flex items-start space-x-4">
											{currentThread.bookCover && (
												<img
													src={currentThread.bookCover}
													alt={currentThread.bookTitle}
													className="hidden sm:block w-16 h-24 object-cover rounded-md shadow-md"
												/>
											)}
											<div>
												<h2
													className={`text-2xl sm:text-3xl font-bold ${
														isDarkTheme ? "text-white" : "text-slate-800"
													}`}
												>
													{currentThread.bookTitle}
												</h2>
												{currentThread.author && (
													<p
														className={`text-lg ${
															isDarkTheme ? "text-slate-300" : "text-slate-600"
														}`}
													>
														by {currentThread.author}
													</p>
												)}
											</div>
										</div>

										<div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-2">
											<span
												className={`px-3 py-1 text-sm font-medium rounded-full ${
													isDarkTheme
														? "bg-indigo-900/50 text-indigo-300"
														: "bg-indigo-100 text-indigo-800"
												}`}
											>
												{currentThread.comments.length} Comments
											</span>
										</div>
									</div>
								</div>

								<motion.form
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4 }}
									onSubmit={handleAddTopLevelComment}
									className={`mb-8 ${
										isDarkTheme ? "bg-slate-800" : "bg-white"
									} shadow-lg rounded-xl p-5 sm:p-6 transition-colors duration-300`}
								>
									<h3
										className={`text-lg font-semibold mb-3 ${
											isDarkTheme ? "text-white" : "text-slate-900"
										}`}
									>
										Share Your Thoughts
									</h3>
									<textarea
										value={newCommentContent}
										onChange={(e) => setNewCommentContent(e.target.value)}
										placeholder={`What are your insights on "${currentThread.bookTitle}"?`}
										rows={4}
										className={`block w-full rounded-lg border ${
											isDarkTheme
												? "border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
												: "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
										} shadow-sm py-2.5 px-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow hover:shadow-md`}
										required
									/>
									<div className="mt-4 flex justify-end">
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											type="submit"
											className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out hover:shadow-lg"
										>
											Post Comment
										</motion.button>
									</div>
								</motion.form>

								{searchTerm && (
									<div
										className={`mb-4 p-3 ${
											isDarkTheme
												? "bg-slate-800 text-white"
												: "bg-white text-slate-900"
										} rounded-lg shadow`}
									>
										<p>
											Showing results for:{" "}
											<span className="font-semibold">"{searchTerm}"</span>
											{filteredThreadComments.length === 0 && (
												<span className="ml-2 text-slate-500">
													No matching comments found
												</span>
											)}
										</p>
									</div>
								)}

								<div className="space-y-6">
									{filteredThreadComments.length > 0 ? (
										filteredThreadComments.map((comment) => (
											<CommentItem
												key={comment.id}
												comment={comment}
												level={0}
												onAddReply={handleAddReply}
												onAddReaction={handleAddReaction}
												isDarkTheme={isDarkTheme}
											/>
										))
									) : (
										<div
											className={`text-center ${
												isDarkTheme
													? "text-slate-300 bg-slate-800"
													: "text-slate-500 bg-white"
											} py-10 rounded-lg shadow`}
										>
											<p className="text-lg">
												{searchTerm
													? "No comments match your search."
													: "No comments yet for this book."}
											</p>
											<p className="text-sm mt-2">
												{searchTerm
													? "Try a different search term or clear your search."
													: "Be the first to share your thoughts!"}
											</p>
										</div>
									)}
								</div>
							</section>
						) : (
							<div
								className={`text-center ${
									isDarkTheme ? "text-slate-300" : "text-slate-500"
								} py-10 text-lg`}
							>
								{bookThreads.length === 0 ? (
									<div className="space-y-4">
										<p>Welcome to Literati Book Club!</p>
										<p className="text-base">
											Get started by adding a book to discuss.
										</p>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => setShowAddBookModal(true)}
											className="mt-4 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md"
										>
											<div className="flex items-center space-x-2">
												<FaPlus className="w-4 h-4" />
												<span>Add Your First Book</span>
											</div>
										</motion.button>
									</div>
								) : (
									"Select a book to view and participate in discussions."
								)}
							</div>
						)}
					</div>
				</div>
			</main>

			{currentThread && currentThread.comments.length > 10 && (
				<div className={`max-w-7xl mx-auto px-4 py-6 flex justify-center`}>
					<div
						className={`flex items-center space-x-1 ${
							isDarkTheme ? "text-white" : "text-slate-900"
						}`}
					>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className={`p-2 rounded-md ${
								isDarkTheme
									? "bg-slate-700 hover:bg-slate-600"
									: "bg-slate-100 hover:bg-slate-200"
							}`}
						>
							<FaArrowLeft className="w-5 h-5" />
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className={`px-4 py-2 rounded-md ${
								isDarkTheme ? "bg-indigo-600" : "bg-indigo-100 text-indigo-700"
							}`}
						>
							1
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className={`px-4 py-2 rounded-md ${
								isDarkTheme
									? "bg-slate-700 hover:bg-slate-600"
									: "bg-slate-100 hover:bg-slate-200"
							}`}
						>
							2
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className={`p-2 rounded-md ${
								isDarkTheme
									? "bg-slate-700 hover:bg-slate-600"
									: "bg-slate-100 hover:bg-slate-200"
							}`}
						>
							<FaArrowRight className="w-5 h-5" />
						</motion.button>
					</div>
				</div>
			)}

			<footer
				className={`mt-12 py-8 ${
					isDarkTheme
						? "bg-slate-800 text-slate-300"
						: "bg-slate-100 text-slate-600"
				} transition-colors duration-300`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-lg font-semibold mb-4">About Literati</h3>
							<p className="text-sm">
								A community-driven book club platform connecting readers through
								meaningful discussions about literature.
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="#"
										className="hover:text-indigo-600 transition-colors"
									>
										Home
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-indigo-600 transition-colors"
									>
										Book Catalog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-indigo-600 transition-colors"
									>
										Reading Challenges
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-indigo-600 transition-colors"
									>
										Community Guidelines
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Resources</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="#"
										className="hover:text-indigo-600 transition-colors"
									>
										Reading Guides
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-indigo-600 transition-colors"
									>
										Book Recommendations
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-indigo-600 transition-colors"
									>
										Author Interviews
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-indigo-600 transition-colors"
									>
										Literary Events
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
							<div className="flex space-x-4 mb-4">
								<a
									href="#"
									className="text-slate-400 hover:text-indigo-600 transition-colors"
								>
									<FaTwitter className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-slate-400 hover:text-indigo-600 transition-colors"
								>
									<FaFacebook className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-slate-400 hover:text-indigo-600 transition-colors"
								>
									<FaGithub className="w-5 h-5" />
								</a>
							</div>
							<p className="text-sm">
								Subscribe to our newsletter for the latest book recommendations
								and club news.
							</p>
						</div>
					</div>
				</div>
			</footer>

			<AnimatePresence>
				{showAddBookModal && (
					<AddBookModal
						isOpen={showAddBookModal}
						onClose={() => setShowAddBookModal(false)}
						onAddBook={handleAddBook}
						isDarkTheme={isDarkTheme}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showAuthModal && (
					<AuthModal
						isOpen={showAuthModal}
						onClose={() => setShowAuthModal(false)}
						isDarkTheme={isDarkTheme}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{toast && (
					<Toast
						message={toast.message}
						type={toast.type}
						onClose={() => setToast(null)}
					/>
				)}
			</AnimatePresence>

			<style jsx global>{`
				.theme-dark {
					--bg-primary: #0f172a;
					--bg-secondary: #1e293b;
					--text-primary: #f8fafc;
					--text-secondary: #94a3b8;
				}
				button,
				a {
					cursor: pointer;
				}
				.theme-light {
					--bg-primary: #f8fafc;
					--bg-secondary: #ffffff;
					--text-primary: #0f172a;
					--text-secondary: #64748b;
				}

				body {
					background-color: var(--bg-primary);
					color: var(--text-primary);
				}

				@media (max-width: 320px) {
					.responsive-mobile {
						padding-left: 0.5rem;
						padding-right: 0.5rem;
					}
				}
			`}</style>
		</div>
	);
};

export default BookClubForum;
