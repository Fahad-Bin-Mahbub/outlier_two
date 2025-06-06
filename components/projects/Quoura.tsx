"use client";
import React, { useState, useRef, useEffect } from "react";
import {
	Home,
	FileText,
	Edit,
	Users,
	Bell,
	Search,
	ChevronDown,
	MoreHorizontal,
	ThumbsUp,
	MessageSquare,
	Share2,
	Bookmark,
	Copy,
	XCircle,
	List,
	AlertTriangle,
	Globe,
	User,
	MessageCircle,
	DollarSign,
	BarChart2,
	Star,
	Moon,
	Settings,
	HelpCircle,
	LogOut,
	X,
	Link,
} from "lucide-react";

const mockAuthors = {
	current: {
		id: "current-user",
		name: "John Doe",
		avatar: "https://i.pravatar.cc/100?img=11",
		description: "Software Engineer • Just now",
	},
	sigrid: {
		id: "sigrid",
		name: "Sigrid Roberts",
		avatar: "https://i.pravatar.cc/100?img=32",
		description: "Lifelong learner and educator • Jan 15",
	},
	grammarly: {
		id: "grammarly",
		name: "Grammarly",
		avatar: "https://i.pravatar.cc/100?img=33",
		description: "Sponsored",
	},
	jean: {
		id: "jean",
		name: "Jean-Marie Valheur",
		avatar: "https://i.pravatar.cc/100?img=54",
		description: "Technology Enthusiast • Apr 17",
	},
	alice: {
		id: "alice",
		name: "Alice Johnson",
		avatar: "https://i.pravatar.cc/100?img=44",
		description: "Programming Expert • Apr 12",
	},
	bob: {
		id: "bob",
		name: "Bob Smith",
		avatar: "https://i.pravatar.cc/100?img=55",
		description: "Public Speaker • Apr 10",
	},
};

const topics = [
	{
		name: "Technology",
		icon: (
			<svg
				className="w-3 h-3 text-white"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
			</svg>
		),
		bgColor: "bg-gray-700",
	},
	{
		name: "Health",
		icon: (
			<svg
				className="w-3 h-3 text-white"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
					clipRule="evenodd"
				/>
				<path
					fillRule="evenodd"
					d="M9.25 6.75a.75.75 0 011.5 0v6.5a.75.75 0 01-1.5 0v-6.5z"
					clipRule="evenodd"
				/>
			</svg>
		),
		bgColor: "bg-green-600",
	},
	{
		name: "Food",
		icon: (
			<svg
				className="w-3 h-3 text-white"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M3 10a7 7 0 0 1 7-7h3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-3a4 4 0 1 0 0 8h3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-3a7 7 0 0 1-7-7z" />
				<path d="M10 13a3 3 0 1 0 0-6H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3a6 6 0 1 1 0 12H7a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h3z" />
			</svg>
		),
		bgColor: "bg-red-600",
	},
	{
		name: "Movies",
		icon: (
			<svg
				className="w-3 h-3 text-white"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
				/>
			</svg>
		),
		bgColor: "bg-red-700",
	},
	{
		name: "Science",
		icon: (
			<svg
				className="w-3 h-3 text-white"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M19.8 18.4L14 10.67V6.5l1.35-1.69c.26-.33.03-.81-.39-.81H9.04c-.42 0-.65.48-.39.81L10 6.5v4.17L4.2 18.4c-.49.66-.02 1.6.8 1.6h14c.82 0 1.29-.94.8-1.6z" />
			</svg>
		),
		bgColor: "bg-purple-600",
	},
	{
		name: "Business",
		icon: (
			<svg
				className="w-3 h-3 text-white"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z" />
			</svg>
		),
		bgColor: "bg-blue-700",
	},
	{
		name: "Travel",
		icon: (
			<svg
				className="w-3 h-3 text-white"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M20.19 4H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.81-2-1.81-2zM20 8h-2v2h2v2h-2v2h2v2h-2v2h-2V8H8v10H6v-2H4v-2h2v-2H4V8h2V6h2v2h8V6h2v2h2V8z" />
			</svg>
		),
		bgColor: "bg-green-700",
	},
	{
		name: "Education",
		icon: (
			<svg
				className="w-3 h-3 text-white"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
			</svg>
		),
		bgColor: "bg-amber-700",
	},
];

const initialPosts = [
	{
		id: "1",
		author: mockAuthors.sigrid,
		title: "How do European and American lifestyles truly compare in 2025?",
		content:
			"I spent three weeks in Norway last October. A relative died and left me some money earmarked for travel. I went modestly and budgeted carefully since I am not wealthy in the US. Not impoverished, as I have a home and food, but definitely not affluent. My observations about the differences were surprising...",
		timestamp: new Date(2025, 3, 15),
		upvotes: 7500,
		comments: [
			{
				id: "c1",
				author: {
					id: "user1",
					name: "Jane Smith",
					avatar: "https://i.pravatar.cc/100?img=5",
				},
				content:
					"As someone who has lived in both Europe and the US for extended periods, I can say there are significant pros and cons to both lifestyles. The work-life balance in Europe tends to be better, but career advancement can be faster in the US.",
				timestamp: new Date(2025, 3, 16),
				upvotes: 234,
			},
			{
				id: "c2",
				author: {
					id: "user2",
					name: "Mark Johnson",
					avatar: "https://i.pravatar.cc/100?img=12",
				},
				content:
					"The healthcare system in Europe is definitely more accessible overall, though the US can offer cutting-edge treatments faster in some specialized fields.",
				timestamp: new Date(2025, 3, 17),
				upvotes: 129,
			},
		],
		isCommentSectionOpen: false,
		hasUpvoted: false,
		hasDownvoted: false,
	},
	{
		id: "2",
		author: mockAuthors.grammarly,
		title: "Write with confidence in English",
		content:
			"Eliminate grammar errors and enhance your writing with our AI-powered assistant. Perfect for professionals, students, and everyone in between.",
		timestamp: new Date(2025, 3, 20),
		upvotes: 287,
		comments: [],
		isCommentSectionOpen: false,
		hasUpvoted: false,
		hasDownvoted: false,
	},
	{
		id: "3",
		author: mockAuthors.jean,
		title:
			"What has Elon Musk accomplished with Twitter since his acquisition?",
		content:
			"A new report from analyst Tiffany Fong recently shed light on this matter, revealing strategic changes and internal communications that show the direction Musk has been taking the platform...",
		timestamp: new Date(2025, 3, 17),
		upvotes: 1142,
		comments: [
			{
				id: "c3",
				author: {
					id: "user3",
					name: "Tim Anders",
					avatar: "https://i.pravatar.cc/100?img=22",
				},
				content:
					"I think his primary motivation was creating a platform that aligns with his vision of free speech, though the execution has been controversial at best.",
				timestamp: new Date(2025, 3, 18),
				upvotes: 78,
			},
		],
		isCommentSectionOpen: false,
		hasUpvoted: false,
		hasDownvoted: false,
	},
	{
		id: "4",
		author: mockAuthors.alice,
		title:
			"What clean code practices have had the biggest impact on your development workflow?",
		content:
			"After years of wrestling with legacy codebases, I have found that certain clean code practices dramatically improve maintainability and team collaboration. Particularly, consistent naming conventions and the single responsibility principle have transformed how my team works...",
		timestamp: new Date(2025, 3, 18),
		upvotes: 845,
		comments: [],
		isCommentSectionOpen: false,
		hasUpvoted: false,
		hasDownvoted: false,
	},
	{
		id: "5",
		author: mockAuthors.bob,
		title: "What techniques helped you overcome public speaking anxiety?",
		content:
			"After years of paralyzing fear, I have finally found methods that help me speak confidently in front of audiences. The journey was not easy, but these specific approaches made a tremendous difference in my career...",
		timestamp: new Date(2025, 3, 19),
		upvotes: 635,
		comments: [],
		isCommentSectionOpen: false,
		hasUpvoted: false,
		hasDownvoted: false,
	},
];

const QuoraClone = () => {
	const [posts, setPosts] = useState(initialPosts);
	const [questionModalOpen, setQuestionModalOpen] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [activeTab, setActiveTab] = useState("question");
	const [activeTopic, setActiveTopic] = useState(null);
	const [followingAuthors, setFollowingAuthors] = useState(new Set());
	const [toast, setToast] = useState({ msg: "", visible: false });
	const [searchActive, setSearchActive] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [addQuestionDropdown, setAddQuestionDropdown] = useState(false);
	const [languageDropdown, setLanguageDropdown] = useState(false);
	const [profileDropdown, setProfileDropdown] = useState(false);

	const dropdownRef = useRef(null);
	const addQuestionDropdownRef = useRef(null);
	const languageDropdownRef = useRef(null);
	const profileDropdownRef = useRef(null);

	const [spaces, setSpaces] = useState([
		{ name: "Science", followers: "32K", followed: false },
		{ name: "Politics", followers: "623K", followed: false },
		{ name: "Programming", followers: "981K", followed: false },
		{ name: "Finance", followers: "85K", followed: false },
		{ name: "Books", followers: "524K", followed: false },
	]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
			if (
				addQuestionDropdownRef.current &&
				!addQuestionDropdownRef.current.contains(event.target)
			) {
				setAddQuestionDropdown(false);
			}
			if (
				languageDropdownRef.current &&
				!languageDropdownRef.current.contains(event.target)
			) {
				setLanguageDropdown(false);
			}
			if (
				profileDropdownRef.current &&
				!profileDropdownRef.current.contains(event.target)
			) {
				setProfileDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const showToast = (msg) => {
		setToast({ msg, visible: true });
		setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
	};

	const toggleAuthorFollow = (authorId) => {
		setFollowingAuthors((prev) => {
			const next = new Set(prev);
			next.has(authorId) ? next.delete(authorId) : next.add(authorId);
			return next;
		});

		const action = followingAuthors.has(authorId) ? "Unfollowed" : "Following";
		const author = Object.values(mockAuthors).find(
			(a) => a.id === authorId
		)?.name;
		showToast(`${action} ${author}`);
	};

	const toggleSpaceFollow = (idx) => {
		setSpaces((prev) =>
			prev.map((s, i) => (i === idx ? { ...s, followed: !s.followed } : s))
		);

		const space = spaces[idx];
		showToast(`${space.followed ? "Unfollowed" : "Following"} ${space.name}`);
	};

	const handleTopicClick = (topicName) => {
		setActiveTopic(activeTopic === topicName ? null : topicName);
		showToast(
			`"${topicName}" ${activeTopic === topicName ? "unselected" : "selected"}`
		);
	};

	const handlePostUpvote = (postId) => {
		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					if (post.hasUpvoted) {
						return {
							...post,
							upvotes: post.upvotes - 1,
							hasUpvoted: false,
						};
					} else if (post.hasDownvoted) {
						return {
							...post,
							upvotes: post.upvotes + 2,
							hasUpvoted: true,
							hasDownvoted: false,
						};
					}
					return {
						...post,
						upvotes: post.upvotes + 1,
						hasUpvoted: true,
					};
				}
				return post;
			})
		);
	};

	const handlePostDownvote = (postId) => {
		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					if (post.hasDownvoted) {
						return {
							...post,
							upvotes: post.upvotes + 1,
							hasDownvoted: false,
						};
					} else if (post.hasUpvoted) {
						return {
							...post,
							upvotes: post.upvotes - 2,
							hasDownvoted: true,
							hasUpvoted: false,
						};
					}
					return {
						...post,
						upvotes: post.upvotes - 1,
						hasDownvoted: true,
					};
				}
				return post;
			})
		);
	};

	const toggleComments = (postId) => {
		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					return { ...post, isCommentSectionOpen: !post.isCommentSectionOpen };
				}
				return post;
			})
		);
	};

	const handleAddComment = (postId, commentText) => {
		if (!commentText.trim()) return;

		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					const newComment = {
						id: `comment-${Date.now()}`,
						author: mockAuthors.current,
						content: commentText,
						timestamp: new Date(),
						upvotes: 0,
					};

					return {
						...post,
						comments: [...post.comments, newComment],
					};
				}
				return post;
			})
		);
	};

	const handleCommentUpvote = (commentId) => {
		setPosts(
			posts.map((post) => {
				const updatedComments = post.comments.map((comment) => {
					if (comment.id === commentId) {
						return { ...comment, upvotes: comment.upvotes + 1 };
					}
					return comment;
				});

				return { ...post, comments: updatedComments };
			})
		);
	};

	const openShareModal = (post) => {
		setSelectedPost(post);
		setShareModalOpen(true);
	};

	const handleSharePost = (commentText) => {
		if (!selectedPost) return;

		const sharedPost = {
			id: `shared-${Date.now()}`,
			author: mockAuthors.current,
			title: commentText,
			content: "",
			timestamp: new Date(),
			upvotes: 0,
			comments: [],
			isCommentSectionOpen: false,
			isSharedPost: true,
			originalPost: selectedPost,
			sharedBy: mockAuthors.current,
			hasUpvoted: false,
			hasDownvoted: false,
		};

		setPosts([sharedPost, ...posts]);
		showToast("Post shared successfully");
	};

	const handleAddPost = (newPostData) => {
		const newPost = {
			id: `post-${Date.now()}`,
			...newPostData,
			timestamp: new Date(),
			upvotes: 0,
			comments: [],
			isCommentSectionOpen: false,
			hasUpvoted: false,
			hasDownvoted: false,
		};

		setPosts([newPost, ...posts]);
		showToast("Post added successfully");
	};

	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
	const toggleAddQuestionDropdown = (e) => {
		e.stopPropagation();
		setAddQuestionDropdown(!addQuestionDropdown);
		setLanguageDropdown(false);
		setProfileDropdown(false);
	};
	const toggleLanguageDropdown = () => {
		setLanguageDropdown(!languageDropdown);
		setAddQuestionDropdown(false);
		setProfileDropdown(false);
	};
	const toggleProfileDropdown = () => {
		setProfileDropdown(!profileDropdown);
		setAddQuestionDropdown(false);
		setLanguageDropdown(false);
	};

	const handleSearchFocus = () => setSearchActive(true);
	const handleSearchBlur = () => setTimeout(() => setSearchActive(false), 200);
	const handleSearchInput = (e) => setSearchQuery(e.target.value);

	const openQuestionModal = () => {
		setQuestionModalOpen(true);
		setAddQuestionDropdown(false);
	};

	const CommentComponent = ({ comment, onUpvote }) => {
		return (
			<div className="py-3 border-t border-gray-100 first:border-t-0">
				<div className="flex">
					<div className="flex-shrink-0 mr-2">
						<div className="w-8 h-8 rounded-full overflow-hidden">
							<img
								src={comment.author.avatar}
								alt={comment.author.name}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
					<div className="flex-1">
						<div className="flex items-center">
							<span className="font-medium text-sm">{comment.author.name}</span>
							<span className="text-gray-500 text-xs ml-2">
								·{" "}
								{new Date(comment.timestamp).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}
							</span>
						</div>
						<div className="mt-1 text-sm">{comment.content}</div>
						<div className="mt-2 flex items-center">
							<button
								className="flex items-center text-gray-500 hover:bg-gray-50 rounded-sm mr-3 cursor-pointer"
								onClick={() => onUpvote(comment.id)}
							>
								<div className="flex items-center">
									<ThumbsUp size={16} className="mr-1" />
									<span className="text-xs">{comment.upvotes}</span>
								</div>
							</button>
							<button className="text-gray-500 hover:bg-gray-50 rounded-sm text-sm cursor-pointer">
								Reply
							</button>
							<button className="ml-auto text-gray-400 cursor-pointer">
								<MoreHorizontal size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const ShareModal = ({ isOpen, onClose, onShare, post }) => {
		const [shareText, setShareText] = useState("");
		const modalRef = useRef(null);

		useEffect(() => {
			const handleClickOutside = (event) => {
				if (modalRef.current && !modalRef.current.contains(event.target)) {
					onClose();
				}
			};

			if (isOpen) {
				document.addEventListener("mousedown", handleClickOutside);
			}
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [isOpen, onClose]);

		if (!isOpen || !post) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div
					ref={modalRef}
					className="bg-white rounded-md w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
				>
					<div className="flex items-center border-b border-gray-200 px-4 py-3">
						<button
							onClick={onClose}
							className="mr-2 text-gray-500 hover:text-gray-700 cursor-pointer"
						>
							<X size={20} />
						</button>
						<div className="flex-1">
							<div className="flex items-center">
								<Globe size={16} className="mr-2 text-gray-500" />
								<span className="text-base font-medium">Everyone</span>
								<ChevronDown size={16} className="ml-1 text-gray-500" />
							</div>
						</div>
					</div>

					<div className="flex-1 p-4">
						<div className="flex items-center mb-3">
							<div className="w-8 h-8 rounded-full overflow-hidden mr-2">
								<img
									src={mockAuthors.current.avatar}
									alt="Your profile"
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<span className="font-medium">{mockAuthors.current.name}</span>
								<button className="text-sm text-gray-600 border rounded-full px-3 py-0.5 ml-2 cursor-pointer">
									Choose credential{" "}
									<ChevronDown size={14} className="inline ml-1" />
								</button>
							</div>
						</div>

						<textarea
							value={shareText}
							onChange={(e) => setShareText(e.target.value)}
							placeholder="Say something about this..."
							className="w-full border-none p-2 text-base focus:outline-none focus:ring-0 mb-3 min-h-[80px]"
						/>

						<div className="bg-gray-50 border border-gray-200 rounded-md p-3">
							<div className="flex items-start">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
										{post.author.name.charAt(0)}
									</div>
								</div>
								<div className="ml-2">
									<div className="flex items-center">
										<span className="font-medium">{post.author.name}</span>
										<span className="text-gray-500 text-sm ml-2">
											·{" "}
											{new Date(post.timestamp).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</span>
									</div>

									<div className="mt-1">
										<div className="flex items-center">
											<div className="w-4 h-4 rounded-sm bg-red-900 mr-1 flex items-center justify-center">
												<span className="text-white text-xs">Q</span>
											</div>
											<span className="text-sm text-gray-700">
												Quonora · Question
											</span>
										</div>
									</div>

									<p className="text-sm mt-1">
										"
										{post.title.length > 100
											? post.title.substring(0, 100) + "..."
											: post.title}
										"
									</p>

									<div className="text-xs text-gray-500 mt-1 flex items-center">
										<Link size={12} className="mr-1" />
										<span className="underline">
											https://qa-platform.com/question/...
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-200 p-3 flex justify-between items-center">
						<div className="flex">
							<button className="text-gray-500 p-1 rounded hover:bg-gray-100 cursor-pointer">
								<span className="text-xl">Aa</span>
							</button>
							<button className="text-gray-500 p-1 rounded hover:bg-gray-100 ml-2 cursor-pointer">
								<MessageSquare size={20} />
							</button>
						</div>
						<button
							onClick={() => {
								onShare(shareText);
								onClose();
							}}
							className="px-6 py-1.5 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 cursor-pointer"
						>
							Share
						</button>
					</div>
				</div>
			</div>
		);
	};

	const QuestionModal = ({
		isOpen,
		onClose,
		onAddPost,
		activeTab,
		setActiveTab,
	}) => {
		const [questionText, setQuestionText] = useState("");
		const [postTitle, setPostTitle] = useState("");
		const [postContent, setPostContent] = useState("");
		const modalRef = useRef(null);

		useEffect(() => {
			const handleClickOutside = (event) => {
				if (modalRef.current && !modalRef.current.contains(event.target)) {
					onClose();
				}
			};

			if (isOpen) {
				document.addEventListener("mousedown", handleClickOutside);
			}
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [isOpen, onClose]);

		const handleSubmit = () => {
			if (activeTab === "question" && questionText.trim()) {
				onAddPost({
					title: questionText,
					content: "",
					author: mockAuthors.current,
				});
				setQuestionText("");
				onClose();
			} else if (activeTab === "post" && postTitle.trim()) {
				onAddPost({
					title: postTitle,
					content: postContent,
					author: mockAuthors.current,
				});
				setPostTitle("");
				setPostContent("");
				onClose();
			}
		};

		if (!isOpen) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div
					ref={modalRef}
					className="bg-white rounded-md w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
				>
					<div className="flex items-center border-b border-gray-200 px-4 py-3">
						<button
							onClick={onClose}
							className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
						>
							<X size={24} />
						</button>
						<div className="flex-1 flex">
							<button
								className={`flex-1 px-4 py-2 text-base font-medium cursor-pointer ${
									activeTab === "question"
										? "text-blue-500 border-b-2 border-blue-500"
										: "text-gray-600"
								}`}
								onClick={() => setActiveTab("question")}
							>
								Add Question
							</button>
							<button
								className={`flex-1 px-4 py-2 text-base font-medium cursor-pointer ${
									activeTab === "post"
										? "text-blue-500 border-b-2 border-blue-500"
										: "text-gray-600"
								}`}
								onClick={() => setActiveTab("post")}
							>
								Create Post
							</button>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto p-4">
						{activeTab === "question" && (
							<>
								<div className="bg-blue-50 p-4 rounded mb-4">
									<h3 className="text-blue-600 font-medium mb-2">
										Tips on getting good answers quickly
									</h3>
									<ul className="list-disc pl-5 text-blue-600">
										<li className="mb-1">
											Make sure your question has not been asked already
										</li>
										<li className="mb-1">
											Keep your question short and to the point
										</li>
										<li className="mb-1">Double-check grammar and spelling</li>
									</ul>
								</div>

								<div className="mb-4 flex items-center">
									<div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
										<img
											src={mockAuthors.current.avatar}
											alt="Your profile"
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="relative">
										<button className="text-sm font-medium bg-gray-100 rounded-full px-3 py-1 flex items-center cursor-pointer">
											Public <ChevronDown size={14} className="ml-1" />
										</button>
									</div>
								</div>

								<div className="mb-4">
									<input
										type="text"
										value={questionText}
										onChange={(e) => setQuestionText(e.target.value)}
										placeholder='Start your question with "What", "How", "Why", etc.'
										className="w-full border-none p-2 text-lg focus:outline-none focus:ring-0"
									/>
								</div>
							</>
						)}

						{activeTab === "post" && (
							<div className="h-80">
								<div className="mb-4 flex items-center">
									<div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
										<img
											src={mockAuthors.current.avatar}
											alt="Your profile"
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="relative">
										<button className="text-sm font-medium bg-gray-100 rounded-full px-3 py-1 flex items-center cursor-pointer">
											Public <ChevronDown size={14} className="ml-1" />
										</button>
									</div>
								</div>

								<div className="mb-4">
									<input
										type="text"
										value={postTitle}
										onChange={(e) => setPostTitle(e.target.value)}
										placeholder="Enter a title for your post"
										className="w-full border-none p-2 text-lg focus:outline-none focus:ring-0"
									/>
								</div>

								<div className="mb-4">
									<textarea
										value={postContent}
										onChange={(e) => setPostContent(e.target.value)}
										placeholder="Write your post content here..."
										className="w-full border-none p-2 text-base focus:outline-none focus:ring-0 min-h-[200px] resize-none"
									/>
								</div>
							</div>
						)}
					</div>

					<div className="border-t border-gray-200 px-4 py-3 flex justify-end">
						<button
							onClick={onClose}
							className="mr-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
							type="button"
						>
							Cancel
						</button>
						<button
							className={`px-4 py-2 text-sm text-white rounded-full cursor-pointer ${
								(activeTab === "question" && questionText.trim()) ||
								(activeTab === "post" && postTitle.trim())
									? "bg-blue-500 hover:bg-blue-600"
									: "bg-blue-300 cursor-not-allowed"
							}`}
							disabled={
								(activeTab === "question" && !questionText.trim()) ||
								(activeTab === "post" && !postTitle.trim())
							}
							onClick={handleSubmit}
							type="button"
						>
							{activeTab === "question" ? "Add question" : "Create post"}
						</button>
					</div>
				</div>
			</div>
		);
	};

	const sportSearchResults = [
		{ type: "space", name: '"Economics" of Sports', icon: "🏎️" },
		{ type: "space", name: "Indian Sports History and News", icon: "🏏" },
		{
			type: "question",
			text: "What are some moments in sports history that caused scientists or doctors to re-evaluate the capabilities of humans as a species?",
		},
		{ type: "question", text: "What is your favourite sport and why?" },
		{ type: "topic", name: "Puma (company)", icon: "🐆" },
	];

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm w-full">
				<div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
					<div className="flex items-center space-x-4">
						<div className="text-[#b92b27] text-2xl font-bold leading-none">
							Quonora
						</div>
						<div className="hidden md:flex space-x-1">
							<button className="p-2 text-[#b92b27] border-b-2 border-[#b92b27] cursor-pointer">
								<Home size={18} />
							</button>
							<button className="p-2 text-gray-500 hover:bg-gray-50 rounded cursor-pointer">
								<FileText size={18} />
							</button>
							<button className="p-2 text-gray-500 hover:bg-gray-50 rounded cursor-pointer">
								<Edit size={18} />
							</button>
							<button className="p-2 text-gray-500 hover:bg-gray-50 rounded cursor-pointer">
								<Users size={18} />
							</button>
							<button className="p-2 text-gray-500 hover:bg-gray-50 rounded cursor-pointer">
								<Bell size={18} />
							</button>
						</div>
					</div>

					<div className="relative flex-grow max-w-md mx-4">
						<div className="relative">
							<Search
								className="absolute left-3 top-2.5 text-gray-400"
								size={16}
							/>
							<input
								type="text"
								placeholder="Search Quonora"
								value={searchQuery}
								onChange={handleSearchInput}
								onFocus={handleSearchFocus}
								onBlur={handleSearchBlur}
								className="pl-10 pr-4 py-1.5 bg-gray-100 rounded-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white text-sm"
							/>

							{searchActive && searchQuery && (
								<div className="absolute left-0 right-0 z-40 bg-white shadow-lg border border-gray-200 rounded-sm mt-1">
									<div className="p-2 border-b border-gray-100 flex items-center">
										<Search size={14} className="text-gray-400 mr-2" />
										<span className="text-sm">
											Search: <strong>{searchQuery}</strong>
										</span>
									</div>

									<div className="max-h-96 overflow-y-auto">
										{sportSearchResults.map((result, index) => (
											<div
												key={index}
												className="p-2 hover:bg-gray-50 cursor-pointer"
											>
												{result.type === "space" &&
													result.name &&
													result.icon && (
														<div className="flex items-center">
															<span className="mr-2">{result.icon}</span>
															<div className="text-sm">
																<span className="text-gray-500">Space: </span>
																<span>{result.name}</span>
															</div>
														</div>
													)}
												{result.type === "question" && result.text && (
													<div className="text-sm">{result.text}</div>
												)}
												{result.type === "topic" &&
													result.name &&
													result.icon && (
														<div className="flex items-center">
															<span className="mr-2">{result.icon}</span>
															<div className="text-sm">
																<span className="text-gray-500">Topic: </span>
																<span>{result.name}</span>
															</div>
														</div>
													)}
											</div>
										))}

										<div className="p-2 border-t border-gray-100 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
											<div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">
												<span className="text-lg">+</span>
											</div>
											<span className="text-sm text-blue-600">
												Add New Question
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<button className="hidden md:block text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-sm text-sm cursor-pointer">
							Try Premium
						</button>

						<div className="relative" ref={profileDropdownRef}>
							<button
								onClick={toggleProfileDropdown}
								className="p-1 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
								type="button"
							>
								<div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
									<img
										src={mockAuthors.current.avatar}
										alt="Your profile"
										className="w-full h-full object-cover"
									/>
								</div>
							</button>

							{profileDropdown && (
								<div className="absolute right-0 z-40 bg-white shadow-md rounded-sm border border-gray-200 w-64 mt-1">
									<div className="border-b border-gray-100">
										<div className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
											<div className="flex items-center">
												<div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
													<img
														src={mockAuthors.current.avatar}
														alt="Your profile"
														className="w-full h-full object-cover"
													/>
												</div>
												<div>
													<div className="font-medium">
														{mockAuthors.current.name}
													</div>
												</div>
											</div>
											<ChevronDown size={16} className="text-gray-500" />
										</div>
									</div>

									<div className="py-1 border-b border-gray-100">
										<div className="px-4 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
											<MessageCircle size={16} className="mr-3 text-gray-500" />
											<span className="text-sm">Messages</span>
										</div>
										<div className="px-4 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
											<Bookmark size={16} className="mr-3 text-gray-500" />
											<span className="text-sm">Bookmarks</span>
										</div>
										<div className="px-4 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
											<Star size={16} className="mr-3 text-gray-500" />
											<span className="text-sm">Try Premium</span>
										</div>
									</div>

									<div className="py-1 border-b border-gray-100">
										<div className="px-4 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
											<div className="flex items-center">
												<Moon size={16} className="mr-3 text-gray-500" />
												<span className="text-sm">Dark mode</span>
											</div>
											<span className="text-xs text-blue-500 font-medium">
												OFF
											</span>
										</div>
										<div className="px-4 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
											<Settings size={16} className="mr-3 text-gray-500" />
											<span className="text-sm">Settings</span>
										</div>
										<div className="px-4 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
											<HelpCircle size={16} className="mr-3 text-gray-500" />
											<span className="text-sm">Help</span>
										</div>
										<div className="px-4 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
											<LogOut size={16} className="mr-3 text-gray-500" />
											<span className="text-sm">Logout</span>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="relative" ref={languageDropdownRef}>
							<button
								onClick={toggleLanguageDropdown}
								className="p-1 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
								type="button"
							>
								<Globe size={18} className="text-gray-600" />
							</button>

							{languageDropdown && (
								<div className="absolute right-0 z-40 bg-white shadow-md rounded-sm border border-gray-200 w-56 mt-1">
									<div className="py-2 px-4 border-b border-gray-100">
										<h4 className="font-medium">Languages</h4>
									</div>
									<div className="py-2">
										<div className="px-4 py-1.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
											<div className="flex items-center">
												<div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
													<span className="text-xs font-medium">EN</span>
												</div>
												<span className="text-sm">English</span>
											</div>
											<div className="text-blue-500">
												<svg
													viewBox="0 0 24 24"
													width="18"
													height="18"
													fill="currentColor"
												>
													<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
												</svg>
											</div>
										</div>
										<div className="px-4 py-1.5 text-sm text-blue-500 hover:bg-gray-50 cursor-pointer">
											Add language
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="relative" ref={addQuestionDropdownRef}>
							<div className="flex">
								<button
									onClick={openQuestionModal}
									className="bg-[#b92b27] text-white text-sm font-medium rounded-l-full py-1.5 pl-3 pr-2 flex items-center hover:bg-[#a52724] cursor-pointer"
									type="button"
								>
									Add question
								</button>

								<button
									onClick={toggleAddQuestionDropdown}
									className="bg-[#b92b27] text-white rounded-r-full py-1.5 pl-0 pr-2 flex items-center hover:bg-[#a52724] border-l border-[#a52724] cursor-pointer"
									type="button"
								>
									<ChevronDown size={14} />
								</button>
							</div>

							{addQuestionDropdown && (
								<div className="absolute top-full right-0 mt-1 bg-white shadow-md rounded-sm border border-gray-200 w-36 z-40">
									<button
										className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-sm cursor-pointer"
										onClick={() => {
											setActiveTab("post");
											openQuestionModal();
										}}
										type="button"
									>
										<Edit size={14} className="mr-2 text-gray-500" /> Create
										post
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<ShareModal
				isOpen={shareModalOpen}
				onClose={() => setShareModalOpen(false)}
				onShare={handleSharePost}
				post={selectedPost}
			/>

			<QuestionModal
				isOpen={questionModalOpen}
				onClose={() => setQuestionModalOpen(false)}
				onAddPost={handleAddPost}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>

			{toast.visible && (
				<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md z-50 text-sm">
					{toast.msg}
				</div>
			)}

			<div className="flex flex-1 max-w-5xl mx-auto">
				<div className="hidden md:block w-44 pt-4 px-4 border-r border-gray-100 overflow-y-auto sticky top-14 self-start max-h-[calc(100vh-3.5rem)]">
					<div className="space-y-2">
						{topics.map((topic, index) => (
							<div
								key={index}
								onClick={() => handleTopicClick(topic.name)}
								className={`flex items-center px-2 py-1 text-sm cursor-pointer rounded-sm
                            ${
															activeTopic === topic.name
																? "bg-gray-200"
																: "hover:bg-gray-50"
														}`}
							>
								<div
									className={`w-5 h-5 ${topic.bgColor} rounded-sm flex items-center
                              justify-center mr-2 flex-shrink-0`}
								>
									{topic.icon}
								</div>
								<span className="text-gray-700">{topic.name}</span>
							</div>
						))}
					</div>

					<div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
						<div className="space-x-1 mb-0.5">
							<a href="#" className="hover:underline">
								About
							</a>{" "}
							·
							<a href="#" className="hover:underline">
								Careers
							</a>{" "}
							·
						</div>
						<div className="space-x-1 mb-0.5">
							<a href="#" className="hover:underline">
								Terms
							</a>{" "}
							·
							<a href="#" className="hover:underline">
								Privacy
							</a>{" "}
							·
						</div>
						<div className="space-x-1">
							<a href="#" className="hover:underline">
								Your Choices
							</a>
						</div>
					</div>
				</div>

				<div className="flex-1 py-4 px-4 md:px-6 max-w-2xl">
					<div className="bg-white rounded-sm border border-gray-200 mb-4">
						<div className="flex items-center p-3">
							<img
								src={mockAuthors.current.avatar}
								alt="Your avatar"
								className="w-8 h-8 rounded-full object-cover flex-shrink-0"
							/>
							<div
								onClick={() => {
									setActiveTab("question");
									openQuestionModal();
								}}
								className="flex items-center flex-1 ml-3 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 cursor-pointer transition"
							>
								<span className="text-sm text-gray-600 select-none">
									What do you want to ask or share?
								</span>
							</div>
						</div>

						<div className="flex border-t border-gray-100">
							<button
								className="flex-1 py-1.5 text-gray-600 hover:bg-gray-50 text-sm flex items-center justify-center cursor-pointer"
								onClick={() => {
									setActiveTab("question");
									openQuestionModal();
								}}
								type="button"
							>
								<div className="w-4 h-4 mr-1 rounded-full border border-gray-300 flex items-center justify-center text-xs">
									?
								</div>
								Ask
							</button>

							<button
								className="flex-1 py-1.5 text-gray-600 hover:bg-gray-50 text-sm flex items-center justify-center border-l border-r border-gray-100 cursor-pointer"
								onClick={openQuestionModal}
								type="button"
							>
								<Edit size={14} className="mr-1" />
								Answer
							</button>

							<button
								className="flex-1 py-1.5 text-gray-600 hover:bg-gray-50 text-sm flex items-center justify-center cursor-pointer"
								onClick={() => {
									setActiveTab("post");
									openQuestionModal();
								}}
								type="button"
							>
								<Edit size={14} className="mr-1" />
								Post
							</button>
						</div>
					</div>

					<div className="space-y-4">
						{posts.map((post) => (
							<div
								key={post.id}
								className="bg-white rounded-sm border border-gray-200 overflow-hidden"
							>
								<div className="p-3">
									<div className="flex items-center mb-2">
										<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
											<img
												src={post.author.avatar}
												alt={post.author.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="ml-2 flex-grow">
											<div className="flex items-center">
												<span className="font-medium text-sm">
													{post.author.name}
												</span>
												<button
													onClick={() => toggleAuthorFollow(post.author.id)}
													className={`ml-2 text-xs font-medium rounded cursor-pointer
                                      ${
																				followingAuthors.has(post.author.id)
																					? "text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-0.5"
																					: "text-blue-500 hover:underline"
																			}`}
													type="button"
												>
													{followingAuthors.has(post.author.id)
														? "Following"
														: "Follow"}
												</button>
											</div>
											<div className="text-xs text-gray-500">
												{post.author.description}
											</div>
										</div>
										<button
											className="flex-shrink-0 ml-2 cursor-pointer"
											onClick={toggleDropdown}
											type="button"
										>
											<MoreHorizontal size={14} className="text-gray-400" />
										</button>
										{dropdownOpen && (
											<div
												ref={dropdownRef}
												className="absolute right-8 mt-8 bg-white shadow-md rounded-sm border border-gray-100 w-48 z-40"
											>
												<button
													className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center text-sm cursor-pointer"
													type="button"
												>
													<Copy size={14} className="mr-2" /> Copy link
												</button>
												<button
													className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center text-sm cursor-pointer"
													type="button"
												>
													<XCircle size={14} className="mr-2" /> Not interested
													in this
												</button>
												<button
													className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center text-sm cursor-pointer"
													type="button"
												>
													<Bookmark size={14} className="mr-2" /> Bookmark
												</button>
												<button
													className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center text-sm cursor-pointer"
													type="button"
												>
													<AlertTriangle size={14} className="mr-2" /> Report
												</button>
											</div>
										)}
									</div>

									<h2 className="text-base font-bold mb-1.5">{post.title}</h2>

									{post.content && (
										<p className="text-gray-700 text-sm">{post.content}</p>
									)}

									{post.isSharedPost && post.originalPost && (
										<div className="border border-gray-200 rounded-sm mt-3 p-3">
											<div className="flex items-center mb-2">
												<div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
													<img
														src={post.originalPost.author.avatar}
														alt={post.originalPost.author.name}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="ml-2">
													<div className="flex items-center">
														<span className="font-medium text-xs">
															{post.originalPost.author.name}
														</span>
													</div>
													<div className="text-xs text-gray-500">
														{post.originalPost.author.description}
													</div>
												</div>
											</div>
											<p className="text-sm text-gray-700">
												{post.originalPost.title}
											</p>
											{post.originalPost.content && (
												<p className="text-xs text-gray-600 mt-1">
													{post.originalPost.content.substring(0, 120)}...
												</p>
											)}
										</div>
									)}

									{post.author.id === "grammarly" && (
										<>
											<div className="rounded-sm overflow-hidden mt-3">
												<img
													src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
													alt="Person typing on laptop"
													className="w-full object-cover h-40"
												/>
											</div>
										</>
									)}
								</div>

								<div className="border-t border-gray-100 py-1 px-2 flex items-center">
									<div className="flex items-center gap-1">
										<button
											className={`${
												post.hasUpvoted ? "text-blue-500" : "text-gray-500"
											} hover:bg-gray-50 rounded-sm flex text-sm  p-1 cursor-pointer`}
											type="button"
											onClick={() => handlePostUpvote(post.id)}
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
												className="fill-current"
											>
												<path
													d="M12 4 3 15h6v5h6v-5h6z"
													fillRule="evenodd"
												></path>
											</svg>
											Upvote
										</button>
										<span className="text-xs font-medium">
											{post.upvotes >= 1000
												? (post.upvotes / 1000).toFixed(1) + "K"
												: post.upvotes}
										</span>
										<button
											className={`${
												post.hasDownvoted ? "text-red-500" : "text-gray-400"
											} hover:bg-gray-50 rounded-sm p-1 cursor-pointer`}
											type="button"
											onClick={() => handlePostDownvote(post.id)}
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
												className="fill-current transform rotate-180"
											>
												<path
													d="M12 4 3 15h6v5h6v-5h6z"
													fillRule="evenodd"
												></path>
											</svg>
										</button>
									</div>
									<div className="flex items-center ml-2">
										<button
											className="flex items-center text-gray-500 hover:bg-gray-50 rounded-sm p-1 cursor-pointer"
											type="button"
											onClick={() => toggleComments(post.id)}
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
												className="fill-current"
											>
												<path
													d="M12.071 18.86c4.103 0 7.429-3.102 7.429-6.93C19.5 8.103 16.174 5 12.071 5s-7.429 3.103-7.429 6.93c0 1.291.379 2.5 1.037 3.534.32.501-1.551 3.058-1.131 3.467.46.453 3.887-1.725 4.46-1.438 1.022.393 2.077.6 3.063.6z"
													fillRule="nonzero"
												></path>
											</svg>
											<span className="text-xs ml-1">
												{post.comments.length}
											</span>
										</button>
									</div>
									<div className="flex items-center ml-2">
										<button
											className="flex items-center text-gray-500 hover:bg-gray-50 rounded-sm p-1 cursor-pointer"
											type="button"
											onClick={() => openShareModal(post)}
										>
											<Share2 size={18} />
										</button>
									</div>
									<button
										className="ml-auto text-gray-400 hover:bg-gray-50 rounded-sm p-1 cursor-pointer"
										type="button"
									>
										<MoreHorizontal size={14} />
									</button>
								</div>

								{post.isCommentSectionOpen && (
									<div className="border-t border-gray-100 p-3">
										<div className="text-sm font-medium mb-2">Comments</div>

										{post.comments.length > 0 ? (
											<div className="mb-3">
												{post.comments.map((comment) => (
													<CommentComponent
														key={comment.id}
														comment={comment}
														onUpvote={handleCommentUpvote}
													/>
												))}
											</div>
										) : (
											<div className="text-sm text-gray-500 mb-3">
												No comments yet. Be the first to comment!
											</div>
										)}

										<div className="flex items-start">
											<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
												<img
													src={mockAuthors.current.avatar}
													alt="Your profile"
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="flex-1 relative">
												<input
													type="text"
													placeholder="Add a comment..."
													className="w-full border border-gray-200 rounded-full py-1.5 px-3 pr-16 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															handleAddComment(post.id, e.target.value);
															e.target.value = "";
														}
													}}
												/>
												<button
													type="button"
													className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 font-medium text-sm cursor-pointer"
													onClick={(e) => {
														const input = e.target
															.closest("div")
															.querySelector("input");
														if (input) {
															handleAddComment(post.id, input.value);
															input.value = "";
														}
													}}
												>
													Post
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="hidden lg:block w-64 pt-4 px-4 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto">
					<div className="bg-white border border-gray-100 rounded-sm p-2 mb-3 text-center">
						<div className="text-gray-400 text-xs">Advertisement</div>
						<div className="w-full h-32 bg-gray-100 mt-1 flex items-center justify-center text-gray-500 text-sm">
							Ad Space
						</div>
					</div>

					<div className="bg-white border border-gray-100 rounded-sm p-3">
						<h3 className="font-bold text-sm mb-2">Spaces to follow</h3>

						<div className="space-y-2">
							{spaces.map((space, index) => (
								<div key={index} className="flex items-center">
									<div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
										<img
											src={`https://i.pravatar.cc/100?img=${20 + index}`}
											alt={space.name}
											className="w-full h-full object-cover"
										/>
									</div>

									<div className="ml-2 flex-grow">
										<div className="text-sm font-medium">{space.name}</div>
										<div className="text-xs text-gray-500">
											{space.followers} followers
										</div>
									</div>

									<button
										type="button"
										onClick={() => toggleSpaceFollow(index)}
										className={`ml-auto text-xs font-medium rounded cursor-pointer
                                ${
																	space.followed
																		? "text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-0.5"
																		: "text-blue-500 hover:underline"
																}`}
									>
										{space.followed ? "Following" : "Follow"}
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuoraClone;
