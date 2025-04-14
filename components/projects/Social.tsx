"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMMUNITIES = [
	{
		id: 1,
		name: "Technology",
		icon: "💻",
		memberCount: 456000,
		description: "Latest in tech, programming, and digital innovation",
	},
	{
		id: 2,
		name: "Startups",
		icon: "🚀",
		memberCount: 324000,
		description: "Building the next big thing in Silicon Valley",
	},
	{
		id: 3,
		name: "Design",
		icon: "🎨",
		memberCount: 278000,
		description: "UI/UX, product design, and creative inspiration",
	},
	{
		id: 4,
		name: "Artificial Intelligence",
		icon: "🤖",
		memberCount: 387000,
		description: "AI, machine learning, and the future of technology",
	},
	{
		id: 5,
		name: "Web Development",
		icon: "🌐",
		memberCount: 245000,
		description: "Frontend, backend, and full-stack development",
	},
	{
		id: 6,
		name: "Crypto",
		icon: "💰",
		memberCount: 143000,
		description: "Blockchain, DeFi, and cryptocurrency discussions",
	},
	{
		id: 7,
		name: "Remote Work",
		icon: "🏠",
		memberCount: 198000,
		description: "Remote work culture and digital nomad lifestyle",
	},
	{
		id: 8,
		name: "Product Management",
		icon: "📱",
		memberCount: 167000,
		description: "Building and scaling digital products",
	},
];

const USERS = [
	{
		id: "u1",
		name: "Alex Johnson",
		colors: ["from-blue-500", "to-indigo-600"],
	},
	{
		id: "u2",
		name: "Sarah Williams",
		colors: ["from-purple-500", "to-pink-600"],
	},
	{
		id: "u3",
		name: "Michael Chen",
		colors: ["from-green-500", "to-emerald-600"],
	},
	{
		id: "u4",
		name: "Emma Davis",
		colors: ["from-orange-500", "to-red-600"],
	},
	{
		id: "u5",
		name: "David Wilson",
		colors: ["from-cyan-500", "to-blue-600"],
	},
];

const CURRENT_USER = {
	id: "current",
	name: "Ritesh Kumar",
	colors: ["from-orange-500", "to-pink-600"],
};

const MOCK_POSTS = [
	{
		id: 1,
		title: "The Future of AI in Software Development",
		content:
			"As we move towards more sophisticated AI tools, the landscape of software development is rapidly evolving. Here's my perspective on how AI will transform our development workflows...",
		author: USERS[0].name,
		authorColors: USERS[0].colors,
		communityId: 1,
		time: "2 hours ago",
		likes: 442,
		replies: [
			{
				id: 1,
				content:
					"This is incredibly insightful! I've been experimenting with AI pair programming tools and the productivity boost is remarkable.",
				author: USERS[1].name,
				authorColors: USERS[1].colors,
				time: "1 hour ago",
				likes: 86,
			},
			{
				id: 2,
				content:
					"Great analysis! Would love to hear your thoughts on how this affects code quality and testing practices.",
				author: USERS[2].name,
				authorColors: USERS[2].colors,
				time: "45 minutes ago",
				likes: 52,
			},
		],
	},
	{
		id: 2,
		title: "Building a Successful SaaS Startup in 2024",
		content:
			"After launching our SaaS product and reaching $1M ARR, here are the key lessons we learned about product-market fit and growth...",
		author: USERS[1].name,
		authorColors: USERS[1].colors,
		communityId: 2,
		time: "3 hours ago",
		likes: 385,
		replies: [
			{
				id: 3,
				content:
					"Your insights on customer acquisition are gold! Would love to hear more about your marketing strategy.",
				author: USERS[3].name,
				authorColors: USERS[3].colors,
				time: "2 hours ago",
				likes: 45,
			},
		],
	},
	{
		id: 3,
		title: "Modern UI Design Trends for Web Apps",
		content:
			"Exploring the latest trends in web app design, from neumorphism to glassmorphism, and how to implement them effectively...",
		author: USERS[2].name,
		authorColors: USERS[2].colors,
		communityId: 3,
		time: "5 hours ago",
		likes: 276,
		replies: [],
	},
];

const Avatar = ({
	name,
	size = 40,
	colors = ["from-blue-500", "to-indigo-600"],
}) => {
	const initials = name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<motion.div
			whileHover={{ scale: 1.05 }}
			className={`rounded-xl bg-gradient-to-br ${colors[0]} ${colors[1]} flex items-center justify-center shadow-lg`}
			style={{ width: size, height: size }}
		>
			<span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
				{initials}
			</span>
		</motion.div>
	);
};

const Toast = ({ message, onClose }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			className="fixed bottom-4 right-4 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3"
		>
			<div className="bg-white/20 rounded-full p-1">✓</div>
			<p>{message}</p>
			<button
				onClick={onClose}
				className="ml-2 text-white/80 hover:text-white cursor-pointer"
			>
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
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</motion.div>
	);
};

const AndromedaApp = () => {
	const [darkMode, setDarkMode] = useState(false);
	const [posts, setPosts] = useState(MOCK_POSTS);
	const [selectedPost, setSelectedPost] = useState(null);
	const [showNewPostModal, setShowNewPostModal] = useState(false);
	const [newPostTitle, setNewPostTitle] = useState("");
	const [newPostContent, setNewPostContent] = useState("");
	const [newPostCommunityId, setNewPostCommunityId] = useState(1);
	const [replyContent, setReplyContent] = useState("");
	const [selectedCommunity, setSelectedCommunity] = useState(null);
	const [sortBy, setSortBy] = useState("Latest");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const [likedPosts, setLikedPosts] = useState([]);
	const [likedReplies, setLikedReplies] = useState([]);
	const [toast, setToast] = useState(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const isDarkMode = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			setDarkMode(isDarkMode);

			const checkMobile = () => {
				setIsMobile(window.innerWidth < 768);
				if (window.innerWidth < 768) {
					setSidebarOpen(false);
				}
			};

			checkMobile();
			window.addEventListener("resize", checkMobile);
			return () => window.removeEventListener("resize", checkMobile);
		}
	}, []);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleCommunitySelect = (communityId) => {
		setSelectedCommunity(communityId);
		if (isMobile) {
			setSidebarOpen(false);
		}
	};

	const filteredPosts = posts.filter((post) => {
		if (!selectedCommunity) return true;
		return post.communityId === selectedCommunity;
	});

	const sortedPosts = [...filteredPosts].sort((a, b) => {
		if (sortBy === "Latest") {
			return b.id - a.id;
		} else {
			return b.likes - a.likes;
		}
	});

	const likePost = (postId) => {
		if (likedPosts.includes(postId)) {
			setLikedPosts(likedPosts.filter((id) => id !== postId));
			setPosts(
				posts.map((post) =>
					post.id === postId ? { ...post, likes: post.likes - 1 } : post
				)
			);
		} else {
			setLikedPosts([...likedPosts, postId]);
			setPosts(
				posts.map((post) =>
					post.id === postId ? { ...post, likes: post.likes + 1 } : post
				)
			);
		}
	};

	const likeReply = (postId, replyId) => {
		const isLiked = likedReplies.some(
			(like) => like.postId === postId && like.replyId === replyId
		);

		if (isLiked) {
			setLikedReplies(
				likedReplies.filter(
					(like) => !(like.postId === postId && like.replyId === replyId)
				)
			);
			setPosts(
				posts.map((post) => {
					if (post.id === postId) {
						const updatedReplies = post.replies.map((reply) =>
							reply.id === replyId
								? { ...reply, likes: reply.likes - 1 }
								: reply
						);
						return { ...post, replies: updatedReplies };
					}
					return post;
				})
			);
		} else {
			setLikedReplies([...likedReplies, { postId, replyId }]);
			setPosts(
				posts.map((post) => {
					if (post.id === postId) {
						const updatedReplies = post.replies.map((reply) =>
							reply.id === replyId
								? { ...reply, likes: reply.likes + 1 }
								: reply
						);
						return { ...post, replies: updatedReplies };
					}
					return post;
				})
			);
		}
	};

	const addReply = (postId) => {
		if (!replyContent.trim()) return;

		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					const newReply = {
						id: post.replies.length + 1,
						content: replyContent,
						author: CURRENT_USER.name,
						authorColors: CURRENT_USER.colors,
						time: "Just now",
						likes: 0,
					};
					return { ...post, replies: [...post.replies, newReply] };
				}
				return post;
			})
		);

		setReplyContent("");
		showToast("Reply posted successfully!");
	};

	const formatNumber = (num) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		}
		return num.toString();
	};

	const getCurrentCommunityName = () => {
		if (!selectedCommunity) return "All Communities";
		const community = COMMUNITIES.find((c) => c.id === selectedCommunity);
		return community ? community.name : "All Communities";
	};

	const createNewPost = () => {
		if (!newPostTitle.trim() || !newPostContent.trim()) return;

		const newPost = {
			id: posts.length + 1,
			title: newPostTitle,
			content: newPostContent,
			author: CURRENT_USER.name,
			authorColors: CURRENT_USER.colors,
			communityId: newPostCommunityId,
			time: "Just now",
			likes: 0,
			replies: [],
		};

		setPosts([newPost, ...posts]);
		setNewPostTitle("");
		setNewPostContent("");
		setShowNewPostModal(false);
		showToast("Post created successfully!");
	};

	const showToast = (message) => {
		setToast(message);
		setTimeout(() => setToast(null), 3000);
	};

	const handleComingSoon = (feature) => {
		showToast(`${feature} will be available soon!`);
	};

	const getCommunityColor = (communityId) => {
		switch (communityId) {
			case 1:
				return "bg-blue-500/10 text-blue-500";
			case 2:
				return "bg-purple-500/10 text-purple-500";
			case 3:
				return "bg-green-500/10 text-green-500";
			case 4:
				return "bg-teal-500/10 text-teal-500";
			case 5:
				return "bg-cyan-500/10 text-cyan-500";
			case 6:
				return "bg-amber-500/10 text-amber-500";
			case 7:
				return "bg-rose-500/10 text-rose-500";
			case 8:
				return "bg-pink-500/10 text-pink-500";
			default:
				return "bg-gray-500/10 text-gray-500";
		}
	};

	return (
		<div
			className={`min-h-screen ${
				darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
			} transition-colors duration-300`}
		>
			{}
			<header
				className={`fixed top-0 left-0 right-0 z-30 ${
					darkMode
						? "bg-gray-950/80 border-b border-gray-800"
						: "bg-white/80 border-b border-gray-100"
				} backdrop-blur-lg transition-colors duration-300`}
			>
				<div className="container mx-auto py-4 flex justify-between items-center">
					<div className="flex items-center gap-4">
						{isMobile && (
							<motion.button
								whileTap={{ scale: 0.95 }}
								onClick={toggleSidebar}
								className={`p-2 rounded-lg ${
									darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
								} transition-colors cursor-pointer`}
							>
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
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</motion.button>
						)}
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
								<span className="text-white font-bold text-lg">A</span>
							</div>
							<h1 className="text-xl font-semibold tracking-tight">
								Andromeda
							</h1>
						</div>
					</div>

					<div className="hidden md:flex flex-1 max-w-xl mx-6">
						<div className="w-full relative">
							<input
								type="text"
								placeholder="Search discussions..."
								className={`w-full pl-10 pr-4 py-2.5 rounded-xl ${
									darkMode
										? "bg-gray-900/70 border-gray-800 text-white placeholder-gray-500 focus:border-gray-700"
										: "bg-gray-100/70 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300"
								} border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
							/>
							<div className="absolute left-3 top-3 text-gray-400">
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
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={toggleDarkMode}
							className={`p-2 rounded-lg ${
								darkMode
									? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							} transition-colors cursor-pointer`}
						>
							{darkMode ? "☀️" : "🌙"}
						</motion.button>

						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowNewPostModal(true)}
							className="bg-gradient-to-r from-indigo-500 to-purple-600 cursor-pointer hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
							<span className="hidden sm:inline">New Post</span>
						</motion.button>
					</div>
				</div>
			</header>

			<div className="flex pt-[73px]">
				{}
				<aside
					className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          ${
						darkMode
							? "bg-gray-950 border-r border-gray-800"
							: "bg-white border-r border-gray-100"
					} 
          fixed top-[73px] left-0 bottom-0 w-72 z-20
          overflow-y-auto
          md:translate-x-0 transition-transform duration-300 ease-in-out
        `}
				>
					<div className="p-6 space-y-8">
						<div>
							<h2 className="text-lg font-semibold mb-4">Communities</h2>
							<div className="flex flex-col space-y-2">
								<motion.button
									whileHover={{ x: 4 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => handleCommunitySelect(null)}
									className={`flex items-center p-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
										!selectedCommunity
											? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
											: darkMode
											? "hover:bg-gray-900"
											: "hover:bg-gray-50"
									}`}
								>
									<span className="mr-3 text-xl">🌎</span>
									<div className="flex-1">
										<span className="block font-medium text-sm">
											All Communities
										</span>
										<span className="text-xs opacity-70">
											Explore everything
										</span>
									</div>
								</motion.button>
								{COMMUNITIES.map((community) => (
									<motion.button
										key={community.id}
										whileHover={{ x: 4 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => handleCommunitySelect(community.id)}
										className={`flex items-center p-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
											selectedCommunity === community.id
												? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
												: darkMode
												? "hover:bg-gray-900"
												: "hover:bg-gray-50"
										}`}
									>
										<span className="mr-3 text-xl">{community.icon}</span>
										<div className="flex-1">
											<span className="block font-medium text-sm">
												{community.name}
											</span>
											<span className="text-xs opacity-70">
												{formatNumber(community.memberCount)} members
											</span>
										</div>
									</motion.button>
								))}
							</div>
						</div>

						<div
							className={`border-t pt-6 ${
								darkMode ? "border-gray-800" : "border-gray-200"
							}`}
						>
							<h3 className="text-sm font-medium mb-3 text-gray-500">
								Your Communities
							</h3>
							<motion.button
								whileTap={{ scale: 0.98 }}
								onClick={() => handleComingSoon("Create Community feature")}
								className={`w-full py-3 px-4 rounded-xl font-medium text-sm cursor-pointer
                  ${
										darkMode
											? "bg-gray-900 hover:bg-gray-800"
											: "bg-gray-100 hover:bg-gray-200"
									}
                  transition-all duration-200 flex items-center justify-center gap-2
                `}
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Create Community
							</motion.button>
						</div>
					</div>
				</aside>

				{}
				<main
					className={`flex-1 min-h-screen ${
						isMobile ? "px-4" : "px-8"
					} py-6 transition-all duration-300
          ${isMobile && sidebarOpen ? "opacity-30 pointer-events-none" : ""}
          ${!isMobile ? "ml-72" : ""}
        `}
				>
					<div className="max-w-3xl mx-auto">
						{}
						<div
							className={`
              flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 
              sticky top-[73px] py-4 px-6 -mx-6 rounded-2xl z-10
              ${
								darkMode
									? "bg-gray-950/80 border border-gray-800"
									: "bg-white/70 border border-gray-100"
							} 
              backdrop-blur-xl
            `}
						>
							<h2 className="text-xl font-semibold">
								{getCurrentCommunityName()}
							</h2>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className={`rounded-xl border px-4 py-2 text-sm font-medium cursor-pointer ${
									darkMode
										? "bg-gray-900 border-gray-800 text-gray-300"
										: "bg-gray-100 border-gray-200 text-gray-700"
								} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
							>
								<option value="Latest">Latest</option>
								<option value="Most Liked">Most Liked</option>
							</select>
						</div>

						{}
						<div className="space-y-8">
							{sortedPosts.map((post) => (
								<motion.div
									key={post.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className={`rounded-2xl p-6 ${
										darkMode
											? "bg-gray-900/50 border border-gray-800 hover:bg-gray-900/70"
											: "bg-white hover:bg-white/90 border border-gray-100"
									} transition-all duration-200 shadow-xl shadow-black/5`}
								>
									{}
									<div className="flex justify-between items-start mb-4">
										<div className="flex items-center gap-3">
											<Avatar
												name={post.author}
												colors={post.authorColors}
												size={44}
											/>
											<div>
												<h3 className="font-medium text-sm">{post.author}</h3>
												<div className="flex items-center gap-2 text-sm text-gray-500">
													<span className="text-xs">{post.time}</span>
													<span>•</span>
													<span
														className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCommunityColor(
															post.communityId
														)}`}
													>
														{
															COMMUNITIES.find((c) => c.id === post.communityId)
																?.name
														}
													</span>
												</div>
											</div>
										</div>
									</div>

									{}
									<div
										onClick={() =>
											setSelectedPost(selectedPost === post.id ? null : post.id)
										}
										className="cursor-pointer group"
									>
										<h2 className="text-xl font-semibold mb-3 group-hover:text-indigo-500 transition-colors">
											{post.title}
										</h2>
										<p
											className={`${
												darkMode ? "text-gray-400" : "text-gray-600"
											} text-sm leading-relaxed`}
										>
											{post.content}
										</p>
									</div>

									{}
									<div className="flex items-center gap-4 mt-5">
										<motion.button
											whileTap={{ scale: 0.95 }}
											onClick={() => likePost(post.id)}
											className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer
                        ${
													darkMode
														? "hover:bg-gray-800/70"
														: "hover:bg-gray-100"
												}
                        ${likedPosts.includes(post.id) ? "text-red-500" : ""}
                      `}
										>
											<svg
												className={`w-5 h-5 transition-colors ${
													likedPosts.includes(post.id)
														? "text-red-500 fill-current"
														: "text-indigo-500"
												}`}
												fill="none"
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
											<span>{formatNumber(post.likes)}</span>
										</motion.button>

										<motion.button
											whileTap={{ scale: 0.95 }}
											onClick={() =>
												setSelectedPost(
													selectedPost === post.id ? null : post.id
												)
											}
											className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer
                        ${
													darkMode
														? "hover:bg-gray-800/70"
														: "hover:bg-gray-100"
												}
                      `}
										>
											<svg
												className="w-5 h-5 text-indigo-500"
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
											<span>{post.replies.length}</span>
										</motion.button>

										<motion.button
											whileTap={{ scale: 0.95 }}
											onClick={() => handleComingSoon("Post sharing")}
											className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer
                        ${
													darkMode
														? "hover:bg-gray-800/70"
														: "hover:bg-gray-100"
												}
                      `}
										>
											<svg
												className="w-5 h-5 text-indigo-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
												/>
											</svg>
											<span>Share</span>
										</motion.button>
									</div>

									{}
									<AnimatePresence>
										{selectedPost === post.id && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className={`mt-6 pt-6 border-t ${
													darkMode ? "border-gray-800" : "border-gray-200"
												}`}
											>
												<div className="space-y-4 mb-6">
													{post.replies.map((reply) => (
														<motion.div
															key={reply.id}
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.1 }}
															className={`p-4 rounded-xl ${
																darkMode
																	? "bg-gray-800/50 border border-gray-700"
																	: "bg-gray-50 border border-gray-100"
															}`}
														>
															<div className="flex justify-between items-start">
																<div className="flex items-center gap-3">
																	<Avatar
																		name={reply.author}
																		colors={reply.authorColors}
																		size={36}
																	/>
																	<div>
																		<div className="font-medium text-sm">
																			{reply.author}
																		</div>
																		<div className="text-xs text-gray-500">
																			{reply.time}
																		</div>
																	</div>
																</div>
															</div>
															<p className="mt-3 text-sm leading-relaxed">
																{reply.content}
															</p>
															<div className="mt-3 flex items-center gap-4">
																<motion.button
																	whileTap={{ scale: 0.95 }}
																	onClick={() => likeReply(post.id, reply.id)}
																	className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer 
                                    ${
																			darkMode
																				? "text-gray-400 hover:text-red-500"
																				: "text-gray-500 hover:text-red-500"
																		}
                                    ${
																			likedReplies.some(
																				(like) =>
																					like.postId === post.id &&
																					like.replyId === reply.id
																			)
																				? "text-red-500"
																				: ""
																		}
                                  `}
																>
																	<svg
																		className={`w-4 h-4 ${
																			likedReplies.some(
																				(like) =>
																					like.postId === post.id &&
																					like.replyId === reply.id
																			)
																				? "text-red-500 fill-current"
																				: ""
																		}`}
																		fill="none"
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
																	<span>{reply.likes}</span>
																</motion.button>
															</div>
														</motion.div>
													))}
												</div>

												{}
												<div className="flex gap-3 items-start">
													<Avatar
														name={CURRENT_USER.name}
														colors={CURRENT_USER.colors}
														size={36}
													/>
													<div className="flex-1">
														<textarea
															placeholder="Write a reply..."
															value={replyContent}
															onChange={(e) => setReplyContent(e.target.value)}
															rows={2}
															className={`w-full rounded-xl px-4 py-3 ${
																darkMode
																	? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
																	: "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400"
															} border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm`}
														/>
														<div className="flex justify-end mt-2">
															<motion.button
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.95 }}
																onClick={() => addReply(post.id)}
																className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
															>
																Reply
															</motion.button>
														</div>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							))}
						</div>
					</div>
				</main>
			</div>

			{}
			<AnimatePresence>
				{showNewPostModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 cursor-pointer"
						onClick={() => setShowNewPostModal(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className={`w-full max-w-md rounded-xl shadow-2xl cursor-pointer ${
								darkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
							} p-6`}
						>
							<div className="flex justify-between items-center mb-5">
								<div className="flex items-center gap-3">
									<Avatar
										name={CURRENT_USER.name}
										colors={CURRENT_USER.colors}
										size={44}
									/>
									<div>
										<h2 className="text-xl font-bold">Create New Post</h2>
										<p className="text-sm text-gray-500">
											Posting as {CURRENT_USER.name}
										</p>
									</div>
								</div>
								<motion.button
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowNewPostModal(false)}
									className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
								>
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</motion.button>
							</div>

							<div className="space-y-5">
								<div>
									<label className="block mb-2 font-medium">Title</label>
									<input
										type="text"
										value={newPostTitle}
										onChange={(e) => setNewPostTitle(e.target.value)}
										placeholder="Enter post title..."
										className={`w-full rounded-lg px-4 py-3 border ${
											darkMode
												? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
												: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
										} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
									/>
								</div>

								<div>
									<label className="block mb-2 font-medium">Content</label>
									<textarea
										value={newPostContent}
										onChange={(e) => setNewPostContent(e.target.value)}
										placeholder="Write your post content..."
										rows={4}
										className={`w-full rounded-lg px-4 py-3 border ${
											darkMode
												? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
												: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
										} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
									/>
								</div>

								<div>
									<label className="block mb-2 font-medium">Community</label>
									<select
										value={newPostCommunityId}
										onChange={(e) =>
											setNewPostCommunityId(Number(e.target.value))
										}
										className={`w-full rounded-lg px-4 py-3 border ${
											darkMode
												? "bg-gray-800 border-gray-700 text-white"
												: "bg-white border-gray-300 text-gray-900"
										} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
									>
										{COMMUNITIES.map((community) => (
											<option key={community.id} value={community.id}>
												{community.icon} {community.name}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="flex justify-end gap-3 mt-6">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowNewPostModal(false)}
									className={`px-4 py-2 rounded-lg cursor-pointer ${
										darkMode
											? "bg-gray-800 hover:bg-gray-700 text-white"
											: "bg-gray-200 hover:bg-gray-300 text-gray-900"
									}`}
								>
									Cancel
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.95 }}
									onClick={createNewPost}
									className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
								>
									Create Post
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{isMobile && sidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/30 z-[5] cursor-pointer"
						onClick={() => setSidebarOpen(false)}
					></motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{toast && <Toast message={toast} onClose={() => setToast(null)} />}
			</AnimatePresence>
		</div>
	);
};

export default AndromedaApp;
