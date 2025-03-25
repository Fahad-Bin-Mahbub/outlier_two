"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

interface VideoContent {
	id: string;
	type: "video";
	title: string;
	author: string;
	avatar: string;
	videoUrl: string;
	duration: number;
	likes: number;
	comments: CommentItem[];
	description: string;
	tags: string[];
}

interface BlogContent {
	id: string;
	type: "blog";
	title: string;
	author: string;
	avatar: string;
	excerpt: string;
	readTime: number;
	likes: number;
	comments: CommentItem[];
	category: string;
	publishedAt: string;
	coverImage: string;
	fullContent: string;
}

interface PollContent {
	id: string;
	type: "poll";
	question: string;
	author: string;
	avatar: string;
	options: Array<{
		id: string;
		text: string;
		votes: number;
	}>;
	totalVotes: number;
	likes: number;
	comments: CommentItem[];
	userVote?: string;
	expiresAt: string;
}

interface CommentItem {
	id: string;
	author: string;
	avatar: string;
	text: string;
	timestamp: string;
	likes: number;
}

type ContentItem = VideoContent | BlogContent | PollContent;

const formatNumber = (num: number): string => {
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
	return num.toString();
};

const formatTimeAgo = (timestamp: string): string => {
	return timestamp;
};

const mockComments: CommentItem[] = [
	{
		id: "c1",
		author: "Alice Johnson",
		avatar: "https://i.pravatar.cc/150?img=20",
		text: "This is amazing! Love the content 💖",
		timestamp: "2 min ago",
		likes: 5,
	},
	{
		id: "c2",
		author: "Bob Smith",
		avatar: "https://i.pravatar.cc/150?img=21",
		text: "Great work, really helpful!",
		timestamp: "5 min ago",
		likes: 3,
	},
];

const mockContent: ContentItem[] = [
	{
		id: "1",
		type: "video",
		title: "Morning Coffee Ritual",
		author: "Sarah Chen",
		avatar: "https://i.pravatar.cc/150?img=1",
		videoUrl:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		duration: 45,
		likes: 1234,
		comments: [...mockComments],
		description:
			"Starting the day right with my favorite coffee blend and some peaceful morning vibes.",
		tags: ["morning", "coffee", "lifestyle"],
	},
	{
		id: "2",
		type: "blog",
		title: "The Art of Minimalist Design in 2024",
		author: "Alex Rodriguez",
		avatar: "https://i.pravatar.cc/150?img=2",
		excerpt:
			"Exploring how minimalism continues to shape modern design trends, from architecture to digital interfaces. We dive deep into the principles that make minimalist design so timeless and effective.",
		readTime: 5,
		likes: 892,
		comments: [...mockComments],
		category: "Design",
		publishedAt: "2 hours ago",
		coverImage:
			"https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg",
		fullContent:
			"Minimalist design has become more than just a trend—it's a philosophy that continues to influence how we interact with digital and physical spaces. In this comprehensive guide, we'll explore the core principles that make minimalism so effective and timeless. From the careful use of white space to the strategic selection of typography, every element serves a purpose. The key to successful minimalist design lies in understanding that less is indeed more, but achieving that 'less' requires thoughtful consideration of every detail.",
	},
	{
		id: "3",
		type: "poll",
		question:
			"What's your preferred way to stay productive while working from home?",
		author: "Jordan Kim",
		avatar: "https://i.pravatar.cc/150?img=3",
		options: [
			{ id: "a", text: "Dedicated home office", votes: 245 },
			{ id: "b", text: "Coffee shop or café", votes: 123 },
			{ id: "c", text: "Coworking space", votes: 89 },
			{ id: "d", text: "Different location each day", votes: 67 },
		],
		totalVotes: 524,
		likes: 156,
		comments: [...mockComments],
		expiresAt: "2 days left",
	},
	{
		id: "4",
		type: "video",
		title: "Quick Pasta Recipe",
		author: "Maria Santos",
		avatar: "https://i.pravatar.cc/150?img=4",
		videoUrl:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
		duration: 120,
		likes: 2156,
		comments: [...mockComments],
		description:
			"Simple 15-minute pasta recipe that never fails to impress. Perfect for busy weeknights!",
		tags: ["cooking", "pasta", "quick-meals"],
	},
	{
		id: "5",
		type: "blog",
		title: "Sustainable Living: Small Changes, Big Impact",
		author: "Emma Green",
		avatar: "https://i.pravatar.cc/150?img=5",
		excerpt:
			"Discover practical ways to reduce your environmental footprint without overwhelming lifestyle changes. From energy-saving tips to mindful consumption habits.",
		readTime: 7,
		likes: 1456,
		comments: [...mockComments],
		category: "Lifestyle",
		publishedAt: "5 hours ago",
		coverImage:
			"https://images.pexels.com/photos/9875680/pexels-photo-9875680.jpeg",
		fullContent:
			"Sustainable living doesn't have to be overwhelming. Small, consistent changes in our daily routines can lead to significant environmental impact over time. This guide will walk you through practical steps you can take today to reduce your carbon footprint while maintaining your quality of life.",
	},
	{
		id: "6",
		type: "poll",
		question: "Which tech trend excites you most for 2024?",
		author: "David Tech",
		avatar: "https://i.pravatar.cc/150?img=6",
		options: [
			{ id: "a", text: "AI Integration", votes: 456 },
			{ id: "b", text: "Sustainable Tech", votes: 234 },
			{ id: "c", text: "AR/VR Advancement", votes: 189 },
			{ id: "d", text: "Quantum Computing", votes: 123 },
		],
		totalVotes: 1002,
		likes: 287,
		comments: [...mockComments],
		expiresAt: "1 day left",
	},
];

const VideoIcon = () => (
	<svg
		className="w-5 h-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
		/>
	</svg>
);

const ArticleIcon = () => (
	<svg
		className="w-5 h-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
		/>
	</svg>
);

const PollIcon = () => (
	<svg
		className="w-5 h-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
		/>
	</svg>
);

const AllIcon = () => (
	<svg
		className="w-5 h-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 11H5m14-7H5m14 14H5"
		/>
	</svg>
);

const HeartIcon = ({ filled = false }) => (
	<svg
		className="w-5 h-5"
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

const CommentIcon = () => (
	<svg
		className="w-5 h-5"
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

const CloseIcon = () => (
	<svg
		className="w-6 h-6"
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

const SendIcon = () => (
	<svg
		className="w-5 h-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
		/>
	</svg>
);

const SwipeIcon = ({ direction }: { direction: "left" | "right" }) => (
	<motion.div
		initial={{ opacity: 0, x: direction === "left" ? 20 : -20 }}
		animate={{ opacity: 1, x: 0 }}
		exit={{ opacity: 0, x: direction === "left" ? -20 : 20 }}
		className={`flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-full shadow-lg ${
			direction === "left" ? "flex-row" : "flex-row-reverse space-x-reverse"
		}`}
	>
		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
			<path
				fillRule="evenodd"
				d={
					direction === "left"
						? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
						: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
				}
				clipRule="evenodd"
			/>
		</svg>
	</motion.div>
);

const CommentComponent: React.FC<{
	comment: CommentItem;
	onLike: () => void;
	isLiked: boolean;
}> = ({ comment, onLike, isLiked }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex space-x-3 p-3 bg-gray-50 rounded-xl"
		>
			<img
				src={comment.avatar}
				alt={`${comment.author}'s avatar`}
				className="w-8 h-8 rounded-full flex-shrink-0"
			/>
			<div className="flex-1 min-w-0">
				<div className="flex items-center space-x-2 mb-1">
					<span className="text-sm font-semibold text-gray-900 truncate">
						{comment.author}
					</span>
					<span className="text-xs text-gray-500 flex-shrink-0">
						{comment.timestamp}
					</span>
				</div>
				<p className="text-sm text-gray-700 mb-2">{comment.text}</p>
			</div>
		</motion.div>
	);
};

const DetailModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	content: ContentItem | null;
	onLike: () => void;
	isLiked: boolean;
	onAddComment: (text: string) => void;
	onLikeComment: (commentId: string) => void;
	likedComments: Set<string>;
}> = ({
	isOpen,
	onClose,
	content,
	onLike,
	isLiked,
	onAddComment,
	onLikeComment,
	likedComments,
}) => {
	const [commentText, setCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const commentInputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isOpen && commentInputRef.current) {
			setTimeout(() => {
				commentInputRef.current?.focus();
			}, 100);
		}
	}, [isOpen]);

	const handleSubmitComment = async () => {
		if (!commentText.trim() || isSubmitting) return;

		setIsSubmitting(true);
		await new Promise((resolve) => setTimeout(resolve, 300));
		onAddComment(commentText.trim());
		setCommentText("");
		setIsSubmitting(false);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmitComment();
		}
	};

	if (!isOpen || !content) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm"
			onClick={onClose}
		>
			<motion.div
				initial={{ y: "100%" }}
				animate={{ y: 0 }}
				exit={{ y: "100%" }}
				transition={{ type: "spring", damping: 25, stiffness: 500 }}
				className="w-full max-w-md max-h-[90vh] bg-white rounded-t-3xl overflow-scroll"
				onClick={(e) => e.stopPropagation()}
			>
				{}
				<div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
					<h2 className="text-lg font-bold text-gray-900 truncate flex-1 mr-4">
						{content.type === "poll" ? content.question : content.title}
					</h2>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onClose}
						className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
					>
						<CloseIcon />
					</motion.button>
				</div>

				{}
				<div className="flex-1 overflow-y-auto">
					{}
					<div className="flex items-center space-x-3 p-4 border-b border-gray-50">
						<img
							src={content.avatar}
							alt={`${content.author}'s profile picture`}
							className="w-12 h-12 rounded-full ring-2 ring-blue-100"
						/>
						<div>
							<p className="font-semibold text-gray-900">{content.author}</p>
							{content.type === "blog" && (
								<p className="text-sm text-gray-500">
									{content.publishedAt} • {content.readTime} min read
								</p>
							)}
						</div>
					</div>

					{}
					<div className="p-4">
						{content.type === "blog" && (
							<div className="mb-6">
								<img
									src={content.coverImage}
									alt={`Cover for ${content.title}`}
									className="w-full h-48 object-cover rounded-xl mb-4"
								/>
								<p className="text-gray-700 leading-relaxed">
									{content.fullContent}
								</p>
							</div>
						)}

						{content.type === "video" && (
							<div className="mb-6">
								<p className="text-gray-700 mb-4">{content.description}</p>
								<div className="flex flex-wrap gap-2">
									{content.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
										>
											#{tag}
										</span>
									))}
								</div>
							</div>
						)}

						{content.type === "poll" && (
							<div className="mb-6">
								<p className="text-center text-sm text-gray-500 mb-4">
									<strong>{formatNumber(content.totalVotes)}</strong> total
									votes • {content.expiresAt}
								</p>
							</div>
						)}

						{}
						<div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={onLike}
								className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
									isLiked
										? "text-red-500 bg-red-50"
										: "text-gray-500 hover:text-red-500 hover:bg-red-50"
								}`}
							>
								<HeartIcon filled={isLiked} />
								<span className="font-medium">
									{formatNumber(content.likes)}
								</span>
							</motion.button>
							<div className="flex items-center space-x-2 text-gray-500">
								<CommentIcon />
								<span>{formatNumber(content.comments.length)} comments</span>
							</div>
						</div>

						{}
						<div className="space-y-3 mb-6">
							<h3 className="font-semibold text-gray-900">Comments</h3>
							{content.comments.map((comment) => (
								<CommentComponent
									key={comment.id}
									comment={comment}
									onLike={() => onLikeComment(comment.id)}
									isLiked={likedComments.has(comment.id)}
								/>
							))}
						</div>
					</div>
				</div>

				{}
				<div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
					<div className="flex space-x-3">
						<img
							src="https://i.pravatar.cc/150?img=50"
							alt="Your avatar"
							className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
						/>
						<div className="flex-1 relative">
							<textarea
								ref={commentInputRef}
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Add a comment..."
								className="w-full p-3 pr-12 text-sm border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
								rows={1}
								style={{ minHeight: "44px", maxHeight: "120px" }}
								onInput={(e) => {
									const target = e.target as HTMLTextAreaElement;
									target.style.height = "auto";
									target.style.height =
										Math.min(target.scrollHeight, 120) + "px";
								}}
							/>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleSubmitComment}
								disabled={!commentText.trim() || isSubmitting}
								className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
									commentText.trim() && !isSubmitting
										? "text-blue-500 hover:bg-blue-50"
										: "text-gray-400"
								}`}
							>
								{isSubmitting ? (
									<div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
								) : (
									<SendIcon />
								)}
							</motion.button>
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

const ContentPlatform: React.FC = () => {
	const [currentTab, setCurrentTab] = useState(0);
	const [content, setContent] = useState<ContentItem[]>(mockContent);
	const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
	const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
	const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
		null
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null
	);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const tabs = [
		{ label: "All", icon: AllIcon, filter: () => true },
		{
			label: "Videos",
			icon: VideoIcon,
			filter: (item: ContentItem) => item.type === "video",
		},
		{
			label: "Articles",
			icon: ArticleIcon,
			filter: (item: ContentItem) => item.type === "blog",
		},
		{
			label: "Polls",
			icon: PollIcon,
			filter: (item: ContentItem) => item.type === "poll",
		},
	];

	const swipeHandlers = useSwipeable({
		onSwipedLeft: () => {
			if (currentTab < tabs.length - 1 && !isTransitioning && !isModalOpen) {
				setSwipeDirection("left");
				setIsTransitioning(true);
				setCurrentTab(currentTab + 1);

				setTimeout(() => {
					setSwipeDirection(null);
					setIsTransitioning(false);
				}, 300);
			}
		},
		onSwipedRight: () => {
			if (currentTab > 0 && !isTransitioning && !isModalOpen) {
				setSwipeDirection("right");
				setIsTransitioning(true);
				setCurrentTab(currentTab - 1);

				setTimeout(() => {
					setSwipeDirection(null);
					setIsTransitioning(false);
				}, 300);
			}
		},
		onSwiping: (eventData) => {
			if (!isModalOpen && Math.abs(eventData.deltaX) > 50) {
				if (eventData.deltaX > 0 && currentTab > 0) {
					setSwipeDirection("right");
				} else if (eventData.deltaX < 0 && currentTab < tabs.length - 1) {
					setSwipeDirection("left");
				}
			}
		},
		onSwipeStart: () => {
			setSwipeDirection(null);
		},
		trackMouse: false,
		trackTouch: true,
		preventScrollOnSwipe: false,
		delta: 50,
		rotationAngle: 0,
		swipeDuration: 500,
		touchEventOptions: { passive: false },
	});

	const handleLike = (id: string) => {
		setLikedItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});

		setContent((prev) =>
			prev.map((item) =>
				item.id === id
					? {
							...item,
							likes: likedItems.has(id) ? item.likes - 1 : item.likes + 1,
					  }
					: item
			)
		);
	};

	const handleLikeComment = (commentId: string) => {
		setLikedComments((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(commentId)) {
				newSet.delete(commentId);
			} else {
				newSet.add(commentId);
			}
			return newSet;
		});
	};

	const handleAddComment = (text: string) => {
		if (!selectedContent) return;

		const newComment: CommentItem = {
			id: `c${Date.now()}`,
			author: "You",
			avatar: "https://i.pravatar.cc/150?img=50",
			text,
			timestamp: "now",
			likes: 0,
		};

		setContent((prev) =>
			prev.map((item) =>
				item.id === selectedContent.id
					? { ...item, comments: [...item.comments, newComment] }
					: item
			)
		);

		setSelectedContent((prev) =>
			prev ? { ...prev, comments: [...prev.comments, newComment] } : null
		);
	};

	const handlePollVote = (pollId: string, optionId: string) => {
		setContent((prev) =>
			prev.map((item) => {
				if (item.id === pollId && item.type === "poll") {
					const updatedOptions = item.options.map((option) => ({
						...option,
						votes: option.id === optionId ? option.votes + 1 : option.votes,
					}));

					return {
						...item,
						options: updatedOptions,
						totalVotes: item.totalVotes + 1,
						userVote: optionId,
					};
				}
				return item;
			})
		);
	};

	const openModal = (item: ContentItem) => {
		setSelectedContent(item);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedContent(null);
	};

	const VideoCard: React.FC<{
		video: VideoContent;
		isLiked: boolean;
		onLike: () => void;
		onOpenDetail: () => void;
	}> = ({ video, isLiked, onLike, onOpenDetail }) => {
		const videoRef = useRef<HTMLVideoElement | null>(null);
		const [isPlaying, setIsPlaying] = useState(false);

		useEffect(() => {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const video = entry.target as HTMLVideoElement;
						if (entry.isIntersecting) {
							if (!isPlaying) {
								video.play().catch(() => console.log("Video autoplay blocked"));
								setIsPlaying(true);
							}
						} else {
							if (isPlaying) {
								video.pause();
								setIsPlaying(false);
							}
						}
					});
				},
				{ threshold: 0.5, rootMargin: "0px 0px -50px 0px" }
			);

			if (videoRef.current) {
				observer.observe(videoRef.current);
			}

			return () => {
				if (videoRef.current) {
					observer.unobserve(videoRef.current);
				}
			};
		}, [isPlaying]);

		return (
			<article className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden hover:shadow-lg transition-all duration-300">
				<div
					className="relative bg-gray-900 aspect-video"
					onClick={onOpenDetail}
				>
					<video
						ref={videoRef}
						className="object-cover w-full h-full cursor-pointer"
						src={video.videoUrl}
						muted
						loop
						playsInline
					/>
					<div className="absolute right-2 bottom-2 px-2 py-1 text-xs text-white bg-black bg-opacity-70 rounded">
						{Math.floor(video.duration / 60)}:
						{(video.duration % 60).toString().padStart(2, "0")}
					</div>
					{isPlaying && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex absolute top-2 left-2 items-center px-2 py-1 space-x-1 text-xs text-white bg-red-500 rounded-full"
						>
							<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
							<span>LIVE</span>
						</motion.div>
					)}
				</div>

				<div className="p-4">
					<div className="flex items-center mb-3 space-x-3">
						<img
							src={video.avatar}
							alt={`${video.author}'s profile`}
							className="w-8 h-8 rounded-full ring-2 ring-blue-100"
						/>
						<p className="text-sm font-semibold text-gray-900">
							{video.author}
						</p>
					</div>

					<h3
						className="mb-2 font-bold text-gray-900 cursor-pointer hover:text-blue-600"
						onClick={onOpenDetail}
					>
						{video.title}
					</h3>
					<p className="mb-3 text-sm text-gray-600">{video.description}</p>

					<div className="flex flex-wrap gap-2 mb-3">
						{video.tags.map((tag, index) => (
							<span
								key={index}
								className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
							>
								#{tag}
							</span>
						))}
					</div>

					<div className="flex justify-between items-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={onLike}
							className={`flex items-center space-x-1 ${
								isLiked ? "text-red-500" : "text-gray-500"
							} hover:text-red-500 transition-colors p-2 -m-2 rounded-lg`}
						>
							<HeartIcon filled={isLiked} />
							<span className="text-sm font-medium">
								{formatNumber(video.likes)}
							</span>
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							onClick={onOpenDetail}
							className="flex items-center p-2 -m-2 space-x-1 text-gray-500 rounded-lg transition-colors hover:text-gray-700"
						>
							<CommentIcon />
							<span className="text-sm">
								{formatNumber(video.comments.length)}
							</span>
						</motion.button>
					</div>
				</div>
			</article>
		);
	};

	const BlogCard: React.FC<{
		blog: BlogContent;
		isLiked: boolean;
		onLike: () => void;
		onOpenDetail: () => void;
	}> = ({ blog, isLiked, onLike, onOpenDetail }) => {
		return (
			<article className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden hover:shadow-lg transition-all duration-300">
				<div
					className="overflow-hidden relative h-48 bg-gray-200 cursor-pointer"
					onClick={onOpenDetail}
				>
					<img
						src={blog.coverImage}
						alt={`Cover for ${blog.title}`}
						className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
					/>
					<div className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full shadow-lg">
						{blog.category}
					</div>
				</div>

				<div className="p-4">
					<div className="flex items-center mb-3 space-x-3">
						<img
							src={blog.avatar}
							alt={`${blog.author}'s profile`}
							className="w-8 h-8 rounded-full ring-2 ring-blue-100"
						/>
						<div>
							<p className="text-sm font-semibold text-gray-900">
								{blog.author}
							</p>
							<p className="text-xs text-gray-500">
								{blog.publishedAt} • {blog.readTime} min read
							</p>
						</div>
					</div>

					<h3
						className="mb-2 font-bold leading-tight text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
						onClick={onOpenDetail}
					>
						{blog.title}
					</h3>
					<p className="mb-4 text-sm text-gray-600 line-clamp-3">
						{blog.excerpt}
					</p>

					<div className="flex justify-between items-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={onLike}
							className={`flex items-center space-x-1 ${
								isLiked ? "text-red-500" : "text-gray-500"
							} hover:text-red-500 transition-colors p-2 -m-2 rounded-lg`}
						>
							<HeartIcon filled={isLiked} />
							<span className="text-sm font-medium">
								{formatNumber(blog.likes)}
							</span>
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							onClick={onOpenDetail}
							className="flex items-center p-2 -m-2 space-x-1 text-gray-500 rounded-lg transition-colors hover:text-gray-700"
						>
							<CommentIcon />
							<span className="text-sm">
								{formatNumber(blog.comments.length)}
							</span>
						</motion.button>
					</div>
				</div>
			</article>
		);
	};

	const PollCard: React.FC<{
		poll: PollContent;
		isLiked: boolean;
		onLike: () => void;
		onVote: (optionId: string) => void;
		onOpenDetail: () => void;
	}> = ({ poll, isLiked, onLike, onVote, onOpenDetail }) => {
		const maxVotes = Math.max(...poll.options.map((opt) => opt.votes));

		return (
			<article className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 p-4 hover:shadow-lg transition-all duration-300">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center space-x-3">
						<img
							src={poll.avatar}
							alt={`${poll.author}'s profile`}
							className="w-8 h-8 rounded-full ring-2 ring-blue-100"
						/>
						<p className="text-sm font-semibold text-gray-900">{poll.author}</p>
					</div>
					<span className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
						{poll.expiresAt}
					</span>
				</div>

				<h3
					className="mb-4 font-bold leading-tight text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
					onClick={onOpenDetail}
				>
					{poll.question}
				</h3>

				<div className="mb-4 space-y-3">
					{poll.options.map((option) => {
						const percentage =
							poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
						const isSelected = poll.userVote === option.id;
						const isWinning = option.votes === maxVotes && maxVotes > 0;

						return (
							<motion.button
								key={option.id}
								whileHover={{ scale: poll.userVote ? 1 : 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => !poll.userVote && onVote(option.id)}
								disabled={!!poll.userVote}
								className={`w-full text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden ${
									isSelected
										? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
										: isWinning && poll.userVote
										? "border-purple-500 bg-purple-50"
										: "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
								} ${!poll.userVote ? "cursor-pointer" : "cursor-default"}`}
							>
								{poll.userVote && (
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${percentage}%` }}
										transition={{ duration: 0.8, ease: "easeOut" }}
										className={`absolute left-0 top-0 h-full ${
											isSelected
												? "bg-gradient-to-r from-blue-300 to-blue-200"
												: "bg-gradient-to-r from-purple-300 to-purple-200"
										} opacity-40`}
									/>
								)}

								<div className="flex relative justify-between items-center">
									<span
										className={`text-sm ${
											isSelected ? "font-semibold" : "font-medium"
										} flex-1 pr-2`}
									>
										{option.text}
									</span>

									<div className="flex items-center space-x-2 flex-shrink-0">
										{poll.userVote && (
											<span className="text-sm font-bold text-gray-700">
												{percentage.toFixed(1)}%
											</span>
										)}
										{isSelected && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="flex justify-center items-center w-6 h-6 text-xs text-white bg-blue-500 rounded-full"
											>
												✓
											</motion.div>
										)}
									</div>
								</div>
							</motion.button>
						);
					})}
				</div>

				<p className="mb-4 text-sm text-center text-gray-500">
					<strong>{formatNumber(poll.totalVotes)}</strong>{" "}
					{poll.totalVotes === 1 ? "vote" : "votes"}
				</p>

				<div className="flex justify-between items-center">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onLike}
						className={`flex items-center space-x-1 ${
							isLiked ? "text-red-500" : "text-gray-500"
						} hover:text-red-500 transition-colors p-2 -m-2 rounded-lg`}
					>
						<HeartIcon filled={isLiked} />
						<span className="text-sm font-medium">
							{formatNumber(poll.likes)}
						</span>
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.05 }}
						onClick={onOpenDetail}
						className="flex items-center p-2 -m-2 space-x-1 text-gray-500 rounded-lg transition-colors hover:text-gray-700"
					>
						<CommentIcon />
						<span className="text-sm">
							{formatNumber(poll.comments.length)}
						</span>
					</motion.button>
				</div>
			</article>
		);
	};

	return (
		<div
			{...swipeHandlers}
			className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative"
		>
			<div className="mx-auto max-w-md min-h-screen bg-white shadow-xl relative">
				{}
				<motion.header
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="sticky top-0 z-40 p-4 border-b border-gray-100 backdrop-blur-lg bg-white/90"
				>
					<h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
						ContentFlow
					</h1>
				</motion.header>

				{}
				<nav className="px-2 sm:px-4 py-2 relative">
					<div className="flex p-0.5 sm:p-1 bg-gray-100 rounded-2xl relative overflow-hidden">
						{}
						<motion.div
							className="absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 bg-white rounded-lg sm:rounded-xl shadow-md z-10"
							animate={{
								left: `${(currentTab / tabs.length) * 100}%`,
								width: `${100 / tabs.length}%`,
							}}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						/>

						{tabs.map((tab, index) => {
							const IconComponent = tab.icon;
							return (
								<motion.button
									key={index}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setCurrentTab(index)}
									className={`flex-1 flex flex-col items-center justify-center py-2 sm:py-3 px-0.5 sm:px-2 rounded-lg sm:rounded-xl transition-all duration-300 relative z-20 min-w-0 ${
										currentTab === index
											? "text-blue-600 font-semibold"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									<div className="w-5 h-5 sm:w-5 sm:h-5 mb-0.5 sm:mb-1">
										<IconComponent />
									</div>
									{}
									<span className="text-xs sm:text-sm font-medium truncate max-w-full leading-tight">
										{window.innerWidth < 380
											? tab.label.slice(0, 8)
											: tab.label}
									</span>
								</motion.button>
							);
						})}
					</div>

					{}
					<div className="flex items-center justify-center mt-2 text-xs text-gray-400">
						<span className="hidden sm:inline">
							Swipe anywhere to navigate •{" "}
						</span>
					</div>
				</nav>

				{}
				<main className="px-4 pb-20">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentTab}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							{content.filter(tabs[currentTab].filter).map((item, index) => {
								const animationDelay = index * 0.1;

								switch (item.type) {
									case "video":
										return (
											<motion.div
												key={item.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3, delay: animationDelay }}
											>
												<VideoCard
													video={item}
													isLiked={likedItems.has(item.id)}
													onLike={() => handleLike(item.id)}
													onOpenDetail={() => openModal(item)}
												/>
											</motion.div>
										);
									case "blog":
										return (
											<motion.div
												key={item.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3, delay: animationDelay }}
											>
												<BlogCard
													blog={item}
													isLiked={likedItems.has(item.id)}
													onLike={() => handleLike(item.id)}
													onOpenDetail={() => openModal(item)}
												/>
											</motion.div>
										);
									case "poll":
										return (
											<motion.div
												key={item.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3, delay: animationDelay }}
											>
												<PollCard
													poll={item}
													isLiked={likedItems.has(item.id)}
													onLike={() => handleLike(item.id)}
													onVote={(optionId) =>
														handlePollVote(item.id, optionId)
													}
													onOpenDetail={() => openModal(item)}
												/>
											</motion.div>
										);
									default:
										return null;
								}
							})}
						</motion.div>
					</AnimatePresence>
				</main>

				{}
				<AnimatePresence>
					{isModalOpen && (
						<DetailModal
							isOpen={isModalOpen}
							onClose={closeModal}
							content={selectedContent}
							onLike={() => selectedContent && handleLike(selectedContent.id)}
							isLiked={
								selectedContent ? likedItems.has(selectedContent.id) : false
							}
							onAddComment={handleAddComment}
							onLikeComment={handleLikeComment}
							likedComments={likedComments}
						/>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default ContentPlatform;
