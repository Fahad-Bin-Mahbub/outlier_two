"use client"
import { useState, useEffect, useRef } from "react";
import {
	Bell,
	Search,
	MessageSquare,
	User,
	Home,
	Users,
	FileText,
	Video,
	BarChart2,
	Moon,
	Sun,
	Send,
	Phone,
	FileUp,
	Image as ImageIcon,
	ChevronDown,
	Camera,
	Settings,
	LogOut,
	Heart,
	Share2,
	Bookmark,
	X,
	Plus,
	Filter,
	MapPin,
	Briefcase,
	Palette,
	MoreHorizontal,
	Calendar,
	Link,
	Award,
	Zap,
	Bookmark as BookmarkIcon,
	ThumbsUp,
	Edit,
	Eye,
	Grid,
	List,
	Upload,
} from "lucide-react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";

// Toast notification component
const Toast = ({ message, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 transition-all transform animate-slideInUp
      ${type === "success" ? "bg-green-500 text-white" : ""}
      ${type === "error" ? "bg-red-500 text-white" : ""}
      ${type === "info" ? "bg-blue-500 text-white" : ""}
      ${type === "warning" ? "bg-yellow-500 text-white" : ""}`}
		>
			{type === "success" && <ThumbsUp size={18} />}
			{type === "error" && <X size={18} />}
			{type === "info" && <Bell size={18} />}
			{type === "warning" && <Bell size={18} />}
			<p>{message}</p>
			<button
				onClick={onClose}
				className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
			>
				<X size={16} />
			</button>
		</div>
	);
};

// Type definitions
interface Post {
	id: number;
	user: {
		name: string;
		avatar: string;
		title: string;
	};
	content: string;
	media: {
		type: "none" | "image" | "video" | "poll";
		url: string;
		options?: string[];
	};
	likes: number;
	comments: {
		id: number;
		user: {
			name: string;
			avatar: string;
		};
		content: string;
		time: string;
	}[];
	time: string;
	isLiked: boolean;
	showComments: boolean;
	tags?: string[];
}

interface PortfolioItem {
	id: number;
	type: string;
	url: string;
	title: string;
}

interface Chat {
	id: number;
	name: string;
	avatar: string;
	online: boolean;
	unread: number;
	lastMessage: string;
	time: string;
}

interface ProfileData {
	name: string;
	title: string;
	bio: string;
	skills: string[];
	avatar: string;
	portfolio: PortfolioItem[];
	coverImage?: string;
	location?: string;
	website?: string;
	followers?: number;
	following?: number;
	availability?: string;
	software?: string[];
}

interface SearchFilters {
	industry: string;
	skills: string;
	location: string;
	artStyle: string;
	software: string;
	availability: string;
}

interface ToastData {
	visible: boolean;
	message: string;
	type: "success" | "error" | "info" | "warning";
}

// The DnD components for react drag-and-drop
const Droppable = ({ children, droppableId, direction = "vertical" }) => {
	return (
		<div data-droppable-id={droppableId} className="droppable">
			{children}
		</div>
	);
};

const Draggable = ({ children, draggableId, index }) => {
	return (
		<div
			data-draggable-id={draggableId}
			data-index={index}
			className="draggable"
		>
			{children}
		</div>
	);
};

const DragDropContext = ({ children, onDragEnd }) => {
	return <div className="drag-drop-context">{children}</div>;
};

// Main component
export default function ArtistHubExport() {
	// State for toast notifications
	const [toast, setToast] = useState<ToastData>({
		visible: false,
		message: "",
		type: "info",
	});

	// Show toast helper function
	const showToast = (
		message: string,
		type: "success" | "error" | "info" | "warning" = "info"
	) => {
		setToast({
			visible: true,
			message,
			type,
		});
	};

	// Theme and UI state management
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [activeTab, setActiveTab] = useState<
		"home" | "profile" | "network" | "analytics"
	>("home");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	const [isMobileView, setIsMobileView] = useState<boolean>(false);
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({
		industry: "",
		skills: "",
		location: "",
		artStyle: "",
		software: "",
		availability: "",
	});

	// Notification system state
	const [notifications, setNotifications] = useState({
		messages: 3,
		mentions: 2,
		updates: 5,
		items: [
			{
				id: 1,
				type: "like",
				user: "Jamie Wilson",
				content: "liked your post about UI Design",
				time: "5m ago",
				avatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 2,
				type: "comment",
				user: "Alex Chen",
				content: "commented on your portfolio",
				time: "15m ago",
				avatar:
					"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 3,
				type: "follow",
				user: "Sarah Johnson",
				content: "started following you",
				time: "1h ago",
				avatar:
					"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 4,
				type: "mention",
				user: "Design Team",
				content: "mentioned you in a comment",
				time: "2h ago",
				avatar:
					"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 5,
				type: "project",
				user: "Studio Collab",
				content: "invited you to a new project",
				time: "1d ago",
				avatar:
					"https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
		],
	});
	const [showNotificationDropdown, setShowNotificationDropdown] =
		useState<boolean>(false);
	const [showProfileDropdown, setShowProfileDropdown] =
		useState<boolean>(false);

	// Trending hashtags
	const [trendingTags, setTrendingTags] = useState([
		{ id: 1, tag: "#UIDesign", count: 423 },
		{ id: 2, tag: "#MotionDesign", count: 318 },
		{ id: 3, tag: "#Illustration", count: 287 },
		{ id: 4, tag: "#3DArt", count: 245 },
		{ id: 5, tag: "#Typography", count: 201 },
		{ id: 6, tag: "#Branding", count: 189 },
	]);

	// User profile data and state
	const [profileData, setProfileData] = useState<ProfileData>({
		name: "Alex Morgan",
		title: "UI/UX Designer",
		bio: "Creative professional with 7+ years of experience in digital product design. Passionate about creating meaningful user experiences and elegant interfaces.",
		skills: [
			"UI Design",
			"UX Research",
			"Prototyping",
			"Design Systems",
			"Motion Design",
			"Branding",
		],
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
		portfolio: [
			{
				id: 1,
				type: "image",
				url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
				title: "Brand Identity",
			},
			{
				id: 2,
				type: "image",
				url: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
				title: "Mobile App",
			},
			{ id: 3, type: "pdf", url: "#", title: "Design Case Study" },
			{
				id: 4,
				type: "video",
				url: "https://images.unsplash.com/photo-1601506521935-02f9a9e8e9b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
				title: "Product Demo",
			},
		],
		location: "San Francisco, CA",
		website: "alexmorgan.design",
		followers: 1458,
		following: 482,
		availability: "Available for freelance",
		software: [
			"Figma",
			"Adobe Creative Suite",
			"Sketch",
			"Framer",
			"Principle",
		],
	});

	// References for click outside handlers
	const notificationRef = useRef(null);
	const profileRef = useRef(null);

	// Content state management
	const [posts, setPosts] = useState<Post[]>([]);
	const [displayMode, setDisplayMode] = useState("grid"); // 'grid' or 'list'
	const [filterVisible, setFilterVisible] = useState(false);
	const [chats, setChats] = useState<Chat[]>([
		{
			id: 1,
			name: "Design Team",
			avatar:
				"https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
			online: true,
			unread: 3,
			lastMessage: "Can you share the design assets?",
			time: "10m",
		},
		{
			id: 2,
			name: "Jamie Wilson",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
			online: true,
			unread: 0,
			lastMessage: "The client loved your proposal!",
			time: "1h",
		},
		{
			id: 3,
			name: "Studio Collab",
			avatar:
				"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
			online: false,
			unread: 0,
			lastMessage: "Meeting scheduled for tomorrow",
			time: "3h",
		},
		{
			id: 4,
			name: "Alex Chen",
			avatar:
				"https://images.unsplash.com/photo-1563833717765-00fac8b1dc37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
			online: false,
			unread: 5,
			lastMessage: "Let's discuss the creative brief",
			time: "1d",
		},
	]);

	// Analytics data
	const [analytics, setAnalytics] = useState({
		profileViews: [12, 18, 15, 22, 30, 25, 35],
		engagement: [5, 8, 12, 9, 15, 12, 18],
		networkGrowth: [2, 3, 1, 4, 2, 5, 3],
		followerGain: [1, 3, 2, 5, 4, 6, 8],
		contentPerformance: [
			{
				id: 1,
				title: "UI Design Case Study",
				views: 120,
				engagement: 45,
				shares: 12,
			},
			{
				id: 2,
				title: "Brand Identity Project",
				views: 85,
				engagement: 32,
				shares: 8,
			},
			{
				id: 3,
				title: "Mobile App Prototype",
				views: 210,
				engagement: 67,
				shares: 24,
			},
		],
		audienceInsights: {
			industries: { Design: 45, Technology: 30, Marketing: 15, Other: 10 },
			locations: { "United States": 40, Europe: 25, Asia: 20, Other: 15 },
		},
	});

	// Interactive features state
	const [activeChatId, setActiveChatId] = useState<number | null>(null);
	const [likedPosts, setLikedPosts] = useState<number[]>([]);
	const [savedPosts, setSavedPosts] = useState<number[]>([]);
	const [sharedPosts, setSharedPosts] = useState<{ [key: number]: number }>({});
	const [commentsVisible, setCommentsVisible] = useState<number[]>([]);

	// Profile editing state
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [editedProfileData, setEditedProfileData] = useState(profileData);
	const [isDraggingSkill, setIsDraggingSkill] = useState(false);
	const [isDraggingPortfolio, setIsDraggingPortfolio] = useState(false);

	// Post creation state
	const [newPost, setNewPost] = useState({
		content: "",
		mediaType: "none" as "none" | "image" | "video" | "poll",
		mediaUrl: "",
		pollOptions: ["", ""] as string[],
		tags: [] as string[],
	});
	const [newComment, setNewComment] = useState("");
	const [postTag, setPostTag] = useState("");

	// Fetch posts on initial load
	useEffect(() => {
		async function fetchPosts() {
			try {
				// Simulate API call
				setTimeout(() => {
					const dummyPosts: Post[] = [
						{
							id: 1,
							user: {
								name: "Sarah Johnson",
								avatar:
									"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
								title: "Art Director",
							},
							content:
								"Just finished this brand identity project for a sustainable fashion brand. I explored organic shapes and earthy colors to reflect their eco-friendly approach.",
							media: {
								type: "image",
								url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
							},
							likes: 42,
							comments: [
								{
									id: 1,
									user: {
										name: "Michael Chen",
										avatar:
											"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
									},
									content:
										"Love the color palette! Really fits with their brand values.",
									time: "15m ago",
								},
							],
							time: "2h ago",
							isLiked: false,
							showComments: false,
							tags: ["#Branding", "#Sustainability", "#DesignProcess"],
						},
						{
							id: 2,
							user: {
								name: "David Kim",
								avatar:
									"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
								title: "Motion Designer",
							},
							content:
								"Exploring some new animation techniques for micro-interactions. What do you think of this loading animation?",
							media: {
								type: "video",
								url: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
							},
							likes: 78,
							comments: [],
							time: "5h ago",
							isLiked: false,
							showComments: false,
							tags: ["#MotionDesign", "#Animation", "#Microinteractions"],
						},
						{
							id: 3,
							user: {
								name: "Emily Davis",
								avatar:
									"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
								title: "Product Designer",
							},
							content:
								"Which color scheme works better for this healthcare app? Looking for some feedback from fellow designers.",
							media: {
								type: "poll",
								url: "",
								options: [
									"Option A - Blue/Green",
									"Option B - Purple/Teal",
									"Option C - Neutral with accents",
								],
							},
							likes: 34,
							comments: [],
							time: "1d ago",
							isLiked: false,
							showComments: false,
							tags: ["#UIDesign", "#ColorTheory", "#HealthcareDesign"],
						},
						{
							id: 4,
							user: {
								name: "Alex Morgan",
								avatar: profileData.avatar,
								title: profileData.title,
							},
							content:
								"Just updated my portfolio with some recent UI design work. Check it out and let me know what you think!",
							media: {
								type: "image",
								url: "https://images.unsplash.com/photo-1601933470096-0e5334c14d68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
							},
							likes: 56,
							comments: [
								{
									id: 1,
									user: {
										name: "Jamie Wilson",
										avatar:
											"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
									},
									content: "Great work! The visual hierarchy is on point.",
									time: "4h ago",
								},
								{
									id: 2,
									user: {
										name: "Sarah Johnson",
										avatar:
											"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
									},
									content: "Love the color palette and typography choices!",
									time: "2h ago",
								},
							],
							time: "6h ago",
							isLiked: true,
							showComments: false,
							tags: ["#UIDesign", "#Portfolio", "#DesignShowcase"],
						},
					];
					setPosts(dummyPosts);
					setLikedPosts([4]); // Pre-like your own post
				}, 500);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		}
		fetchPosts();
	}, []);

	// Handle window resize for responsive design
	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Handle clicks outside of dropdowns
	useEffect(() => {
		function handleClickOutside(event) {
			if (
				notificationRef.current &&
				!notificationRef.current.contains(event.target)
			) {
				setShowNotificationDropdown(false);
			}
			if (profileRef.current && !profileRef.current.contains(event.target)) {
				setShowProfileDropdown(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Theme toggle functionality
	function toggleTheme() {
		setTheme(theme === "light" ? "dark" : "light");
	}

	// Search functionality
	function handleSearch(e) {
		e.preventDefault();
		showToast(`Searching for: ${searchQuery}`, "info");
	}

	// Filter change handler
	function handleFilterChange(e) {
		setSearchFilters({
			...searchFilters,
			[e.target.name]: e.target.value,
		});
	}

	// Drag and drop functionality
	function handleDragEnd(result, type: "skills" | "portfolio") {
		if (!result.destination) return;

		// Simulate drag and drop since we're not using the real library
		showToast(`Item reordered successfully`, "success");

		if (type === "skills") {
			// In a real implementation, this would reorder the skills array
			setEditedProfileData((prev) => ({ ...prev }));
		} else {
			// In a real implementation, this would reorder the portfolio array
			setEditedProfileData((prev) => ({ ...prev }));
		}
	}

	// File upload handler
	function handleFileUpload(e, type: "avatar" | "cover" | "media") {
		// Simulating file upload
		showToast(`${type} updated successfully`, "success");

		if (type === "media") {
			setNewPost((prev) => ({
				...prev,
				mediaType: "image",
				mediaUrl:
					"https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80",
			}));
		} else {
			// For profile avatar or cover image
			const demoUrls = {
				avatar:
					"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
				cover:
					"https://images.unsplash.com/photo-1542281286-9e0a16bb7366?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			};

			setEditedProfileData((prev) => ({
				...prev,
				[type]: demoUrls[type],
			}));
		}
	}

	// Add tag to post
	function handleAddTag() {
		if (postTag.trim() && !newPost.tags.includes(postTag.trim())) {
			setNewPost((prev) => ({
				...prev,
				tags: [...prev.tags, postTag.trim()],
			}));
			setPostTag("");
		}
	}

	// Handle post submission
	function handlePostSubmit(e) {
		e.preventDefault();
		if (newPost.content.trim()) {
			const post: Post = {
				id: Date.now(),
				user: {
					name: profileData.name,
					avatar: profileData.avatar,
					title: profileData.title,
				},
				content: newPost.content,
				media: {
					type: newPost.mediaType,
					url:
						newPost.mediaUrl ||
						"https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80",
					options:
						newPost.mediaType === "poll" ? newPost.pollOptions : undefined,
				},
				likes: 0,
				comments: [],
				time: "Just now",
				isLiked: false,
				showComments: false,
				tags: newPost.tags,
			};
			setPosts((prev) => [post, ...prev]);
			setNewPost({
				content: "",
				mediaType: "none",
				mediaUrl: "",
				pollOptions: ["", ""],
				tags: [],
			});
			showToast("Post created successfully!", "success");
		}
	}

	// Handle like functionality
	function handleLikePost(postId) {
		if (likedPosts.includes(postId)) {
			setLikedPosts((prev) => prev.filter((id) => id !== postId));
			setPosts((prev) =>
				prev.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p))
			);
		} else {
			setLikedPosts((prev) => [...prev, postId]);
			setPosts((prev) =>
				prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
			);
			showToast("Post liked!", "success");
		}
	}

	// Handle save functionality
	function handleSavePost(postId) {
		if (savedPosts.includes(postId)) {
			setSavedPosts((prev) => prev.filter((id) => id !== postId));
			showToast("Post removed from saved items", "info");
		} else {
			setSavedPosts((prev) => [...prev, postId]);
			showToast("Post saved to your collection!", "success");
		}
	}

	// Handle share functionality
	function handleSharePost(postId) {
		setSharedPosts((prev) => ({
			...prev,
			[postId]: (prev[postId] || 0) + 1,
		}));
		showToast("Post shared successfully!", "success");
	}

	// Handle comment visibility
	function handleToggleComments(postId) {
		if (commentsVisible.includes(postId)) {
			setCommentsVisible((prev) => prev.filter((id) => id !== postId));
		} else {
			setCommentsVisible((prev) => [...prev, postId]);
		}
	}

	// Add comment to post
	function handleAddComment(e, postId) {
		e.preventDefault();
		if (newComment.trim()) {
			const comment = {
				id: Date.now(),
				user: {
					name: profileData.name,
					avatar: profileData.avatar,
				},
				content: newComment.trim(),
				time: "Just now",
			};
			setPosts((prev) =>
				prev.map((p) =>
					p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
				)
			);
			setNewComment("");
			showToast("Comment added!", "success");
		}
	}

	return (
		<div
			className={`min-h-screen transition-all duration-300 ${
				theme === "light"
					? "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
					: "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
			}`}
		>
			{/* Toast Notification */}
			{toast.visible && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
				/>
			)}

			{/* Header */}
			<header
				className={`fixed top-0 w-full z-30 backdrop-blur-lg bg-opacity-90 ${
					theme === "light"
						? "bg-white/90 border-b border-gray-200"
						: "bg-gray-800/90 border-b border-gray-700"
				}`}
			>
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					<div className="flex items-center">
						{/* Mobile menu button */}
						<button
							className="md:hidden mr-3 p-2 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? (
								<X size={20} />
							) : (
								<div className="w-5 h-5 flex flex-col justify-between">
									<span
										className={`block h-0.5 w-full rounded-full ${
											theme === "light" ? "bg-gray-800" : "bg-gray-200"
										}`}
									></span>
									<span
										className={`block h-0.5 w-full rounded-full ${
											theme === "light" ? "bg-gray-800" : "bg-gray-200"
										}`}
									></span>
									<span
										className={`block h-0.5 w-full rounded-full ${
											theme === "light" ? "bg-gray-800" : "bg-gray-200"
										}`}
									></span>
								</div>
							)}
						</button>

						{/* Logo */}
						<h1
							className={`text-xl font-bold mr-8 ${
								theme === "light"
									? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
									: "bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
							}`}
						>
							CreativePro
						</h1>

						{/* Search Form */}
						<form
							onSubmit={handleSearch}
							className="hidden md:flex items-center relative group"
						>
							<input
								type="text"
								placeholder="Search creators, projects, skills..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className={`pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
									theme === "light"
										? "bg-gray-100 group-hover:bg-gray-50 focus:bg-white"
										: "bg-gray-700 group-hover:bg-gray-600 focus:bg-gray-600"
								}`}
							/>
							<Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
						</form>
					</div>

					<div className="flex items-center space-x-2 md:space-x-4">
						{/* Notifications */}
						<div className="relative" ref={notificationRef}>
							<button
								onClick={() =>
									setShowNotificationDropdown(!showNotificationDropdown)
								}
								className={`p-2 rounded-full relative transition-all duration-300 hover:scale-105 active:scale-95 ${
									theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
								}`}
							>
								<Bell
									size={20}
									className="transform transition-transform hover:rotate-12"
								/>
								{notifications.messages +
									notifications.mentions +
									notifications.updates >
									0 && (
									<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
										{notifications.messages +
											notifications.mentions +
											notifications.updates}
									</span>
								)}
							</button>

							{/* Notifications Dropdown */}
							{showNotificationDropdown && (
								<div
									className={`absolute right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto rounded-lg shadow-lg z-40 transform transition-all duration-300 animate-fadeIn ${
										theme === "light"
											? "bg-white/95 backdrop-blur-lg border border-gray-200"
											: "bg-gray-800/95 backdrop-blur-lg border border-gray-700"
									}`}
								>
									<div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
										<h3 className="font-medium">Notifications</h3>
										<button
											onClick={() =>
												showToast("All notifications marked as read", "success")
											}
											className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
										>
											Mark all as read
										</button>
									</div>

									<div className="divide-y divide-gray-200 dark:divide-gray-700">
										{notifications.items.map((item) => (
											<div
												key={item.id}
												className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
											>
												<div className="flex items-start space-x-3">
													<div className="flex-shrink-0">
														<img
															src={item.avatar}
															alt={item.user}
															className="w-10 h-10 rounded-full"
														/>
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm">
															<span className="font-medium">{item.user}</span>{" "}
															{item.content}
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
															{item.time}
														</p>
													</div>
													{item.type === "like" && (
														<Heart
															size={16}
															className="text-red-500 flex-shrink-0"
														/>
													)}
													{item.type === "comment" && (
														<MessageSquare
															size={16}
															className="text-blue-500 flex-shrink-0"
														/>
													)}
													{item.type === "follow" && (
														<User
															size={16}
															className="text-green-500 flex-shrink-0"
														/>
													)}
													{item.type === "mention" && (
														<At
															size={16}
															className="text-purple-500 flex-shrink-0"
														/>
													)}
													{item.type === "project" && (
														<Briefcase
															size={16}
															className="text-amber-500 flex-shrink-0"
														/>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* User Profile */}
						<div className="relative" ref={profileRef}>
							<button
								onClick={() => setShowProfileDropdown(!showProfileDropdown)}
								className={`flex items-center space-x-2 p-1 rounded-full transition-all duration-300 ${
									theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
								}`}
							>
								<div className="relative">
									<img
										src={profileData.avatar}
										alt="Profile"
										className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-blue-500 object-cover"
									/>
									<div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
								</div>
								<ChevronDown
									size={16}
									className="hidden md:block text-gray-500"
								/>
							</button>

							{/* Profile Dropdown */}
							{showProfileDropdown && (
								<div
									className={`absolute right-0 mt-2 w-60 rounded-lg shadow-lg overflow-hidden z-40 transition-all duration-300 animate-fadeIn ${
										theme === "light"
											? "bg-white/95 backdrop-blur-lg border border-gray-200"
											: "bg-gray-800/95 backdrop-blur-lg border border-gray-700"
									}`}
								>
									<div className="p-4 border-b border-gray-200 dark:border-gray-700">
										<div className="flex items-start space-x-3">
											<img
												src={profileData.avatar}
												alt={profileData.name}
												className="w-12 h-12 rounded-full object-cover"
											/>
											<div className="flex-1 min-w-0">
												<p className="font-semibold truncate">
													{profileData.name}
												</p>
												<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
													{profileData.title}
												</p>
												<p className="text-xs text-green-500 flex items-center mt-1">
													<span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
													Online
												</p>
											</div>
										</div>
									</div>

									<div className="py-1">
										<button
											onClick={() => {
												setActiveTab("profile");
												setShowProfileDropdown(false);
											}}
											className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-300 ${
												theme === "light"
													? "hover:bg-gray-100"
													: "hover:bg-gray-700"
											}`}
										>
											<User size={16} className="mr-3 text-gray-500" />
											Profile
										</button>
										<button
											onClick={() => {
												showToast("Settings page coming soon", "info");
												setShowProfileDropdown(false);
											}}
											className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-300 ${
												theme === "light"
													? "hover:bg-gray-100"
													: "hover:bg-gray-700"
											}`}
										>
											<Settings size={16} className="mr-3 text-gray-500" />
											Settings
										</button>
										<button
											onClick={() => {
												showToast("You have been signed out", "info");
												setShowProfileDropdown(false);
											}}
											className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-300 ${
												theme === "light"
													? "hover:bg-gray-100 text-red-600 hover:text-red-700"
													: "hover:bg-gray-700 text-red-400 hover:text-red-300"
											}`}
										>
											<LogOut size={16} className="mr-3" />
											Sign out
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Theme Toggle */}
						<button
							onClick={toggleTheme}
							className={`p-2 rounded-full transition-all duration-300 ${
								theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
							}`}
							aria-label={
								theme === "light"
									? "Switch to dark mode"
									: "Switch to light mode"
							}
						>
							{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
						</button>
					</div>
				</div>
			</header>

			<div className="pt-16 flex min-h-screen">
				{/* Mobile Navigation Overlay */}
				{isMobileMenuOpen && (
					<div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
						onClick={() => setIsMobileMenuOpen(false)}
					></div>
				)}

				{/* Sidebar Navigation */}
				<nav
					className={`fixed left-0 top-16 bottom-0 w-64 overflow-y-auto flex-shrink-0 transition-all duration-300 transform z-30
          ${
						isMobileMenuOpen
							? "translate-x-0"
							: "-translate-x-full md:translate-x-0"
					}
          ${
						theme === "light"
							? "bg-white border-r border-gray-200 shadow-sm"
							: "bg-gray-900/95 border-r border-gray-700"
					}`}
				>
					<div className="p-4 flex flex-col h-full">
						{/* Main Navigation */}
						<ul className="space-y-2">
							<li>
								<button
									onClick={() => {
										setActiveTab("home");
										isMobileView && setIsMobileMenuOpen(false);
									}}
									className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 
                    ${
											activeTab === "home"
												? "bg-blue-600 text-white"
												: theme === "light"
												? "text-gray-700 hover:bg-blue-500 hover:text-white"
												: "text-gray-200 hover:bg-blue-600 hover:text-white"
										}`}
								>
									<Home size={20} className="flex-shrink-0 mr-3" />
									<span className="font-medium">Home</span>
								</button>
							</li>
							<li>
								<button
									onClick={() => {
										setActiveTab("profile");
										isMobileView && setIsMobileMenuOpen(false);
									}}
									className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 
                    ${
											activeTab === "profile"
												? "bg-blue-600 text-white"
												: theme === "light"
												? "text-gray-700 hover:bg-blue-500 hover:text-white"
												: "text-gray-200 hover:bg-blue-600 hover:text-white"
										}`}
								>
									<User size={20} className="flex-shrink-0 mr-3" />
									<span className="font-medium">Profile</span>
								</button>
							</li>
							<li>
								<button
									onClick={() => {
										setActiveTab("network");
										isMobileView && setIsMobileMenuOpen(false);
									}}
									className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 
                    ${
											activeTab === "network"
												? "bg-blue-600 text-white"
												: theme === "light"
												? "text-gray-700 hover:bg-blue-500 hover:text-white"
												: "text-gray-200 hover:bg-blue-600 hover:text-white"
										}`}
								>
									<Users size={20} className="flex-shrink-0 mr-3" />
									<span className="font-medium">Network</span>
								</button>
							</li>
							<li>
								<button
									onClick={() => {
										setActiveTab("analytics");
										isMobileView && setIsMobileMenuOpen(false);
									}}
									className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 
                    ${
											activeTab === "analytics"
												? "bg-blue-600 text-white"
												: theme === "light"
												? "text-gray-700 hover:bg-blue-500 hover:text-white"
												: "text-gray-200 hover:bg-blue-600 hover:text-white"
										}`}
								>
									<BarChart2 size={20} className="flex-shrink-0 mr-3" />
									<span className="font-medium">Analytics</span>
								</button>
							</li>
						</ul>

						{/* Trending Tags Section */}
						<div className="mt-8">
							<h3 className="font-semibold mb-3 text-gray-500 dark:text-gray-400">
								Trending Tags
							</h3>
							<ul className="space-y-2">
								{trendingTags.map((tag) => (
									<li key={tag.id}>
										<button
											onClick={() => {
												setSearchQuery(tag.tag);
												showToast(`Searching for ${tag.tag}`, "info");
												isMobileView && setIsMobileMenuOpen(false);
											}}
											className={`flex items-center justify-between w-full p-2 rounded-lg text-sm transition-all duration-300 
                        ${
													theme === "light"
														? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
														: "text-gray-300 hover:bg-blue-900/20 hover:text-blue-300"
												}`}
										>
											<span>{tag.tag}</span>
											<span
												className={`text-xs px-2 py-1 rounded-full ${
													theme === "light"
														? "bg-blue-100 text-blue-600"
														: "bg-blue-900/30 text-blue-300"
												}`}
											>
												{tag.count}
											</span>
										</button>
									</li>
								))}
							</ul>
						</div>

						{/* Mobile Search (only visible on mobile) */}
						<div className="mt-auto pt-4 block md:hidden">
							<form onSubmit={handleSearch} className="relative">
								<input
									type="text"
									placeholder="Search..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
										theme === "light"
											? "bg-gray-100 focus:bg-white"
											: "bg-gray-700 focus:bg-gray-600"
									}`}
								/>
								<Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
							</form>
						</div>
					</div>
				</nav>

				{/* Main Content Area */}
				<main
					className={`flex-1 transition-all duration-300 ${
						isMobileMenuOpen ? "md:ml-64" : "ml-0 md:ml-64"
					}`}
				>
					<div className="max-w-3xl mx-auto p-4 overflow-y-auto">
						{/* Home Tab Content */}
						{activeTab === "home" && (
							<div className="space-y-6">
								{/* Post Creation Card */}
								<div
									className={`rounded-xl p-4 transform transition-all duration-300 hover:scale-[1.01] ${
										theme === "light"
											? "bg-white/95 backdrop-blur-lg shadow-sm"
											: "bg-gray-800/95 backdrop-blur-lg shadow-lg shadow-black/10"
									}`}
								>
									<div className="flex items-start space-x-3">
										<img
											src={profileData.avatar}
											alt="Your profile"
											className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-blue-500 object-cover"
										/>
										<form
											onSubmit={handlePostSubmit}
											className="flex-1 space-y-4"
										>
											<textarea
												value={newPost.content}
												onChange={(e) =>
													setNewPost((prev) => ({
														...prev,
														content: e.target.value,
													}))
												}
												placeholder="Share your work or ideas with other creators..."
												className={`w-full rounded-lg px-4 py-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
													theme === "light"
														? "bg-gray-50 hover:bg-gray-100 focus:bg-white"
														: "bg-gray-700 hover:bg-gray-600 focus:bg-gray-600"
												}`}
												rows={3}
											/>

											{/* Tags Input */}
											{newPost.tags.length > 0 && (
												<div className="flex flex-wrap gap-2">
													{newPost.tags.map((tag, index) => (
														<div
															key={index}
															className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
																theme === "light"
																	? "bg-blue-100 text-blue-700"
																	: "bg-blue-900/30 text-blue-300"
															}`}
														>
															<span>{tag}</span>
															<button
																type="button"
																onClick={() =>
																	setNewPost((prev) => ({
																		...prev,
																		tags: prev.tags.filter(
																			(_, i) => i !== index
																		),
																	}))
																}
																className="hover:text-red-500 transition-colors"
															>
																<X size={14} />
															</button>
														</div>
													))}
												</div>
											)}

											{/* Tag Input */}
											<div className="flex items-center space-x-2">
												<input
													type="text"
													value={postTag}
													onChange={(e) => setPostTag(e.target.value)}
													placeholder="Add a tag (e.g. #Design)"
													className={`flex-1 rounded-lg px-3 py-1.5 text-sm transition-all duration-300 ${
														theme === "light"
															? "bg-gray-50 hover:bg-gray-100 focus:bg-white"
															: "bg-gray-700 hover:bg-gray-600 focus:bg-gray-600"
													} focus:outline-none focus:ring-1 focus:ring-blue-500`}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															handleAddTag();
														}
													}}
												/>
												<button
													type="button"
													onClick={handleAddTag}
													className={`p-1.5 rounded-lg transition-colors ${
														theme === "light"
															? "bg-blue-100 text-blue-600 hover:bg-blue-200"
															: "bg-blue-900/30 text-blue-300 hover:bg-blue-800/30"
													}`}
												>
													<Plus size={16} />
												</button>
											</div>

											{/* Media Attachment Preview */}
											{newPost.mediaType !== "none" && newPost.mediaUrl && (
												<div className="relative rounded-lg overflow-hidden">
													<img
														src={newPost.mediaUrl}
														alt="Media preview"
														className="w-full h-48 object-cover rounded-lg"
													/>
													<button
														type="button"
														onClick={() =>
															setNewPost((prev) => ({
																...prev,
																mediaType: "none",
																mediaUrl: "",
															}))
														}
														className="absolute top-2 right-2 p-1 rounded-full bg-gray-900/70 text-white hover:bg-red-500 transition-colors"
													>
														<X size={16} />
													</button>
												</div>
											)}

											{/* Poll Options */}
											{newPost.mediaType === "poll" && (
												<div className="space-y-2">
													{newPost.pollOptions.map((option, index) => (
														<div
															key={index}
															className="flex items-center space-x-2"
														>
															<input
																type="text"
																value={option}
																onChange={(e) => {
																	const newOptions = [...newPost.pollOptions];
																	newOptions[index] = e.target.value;
																	setNewPost((prev) => ({
																		...prev,
																		pollOptions: newOptions,
																	}));
																}}
																placeholder={`Option ${index + 1}`}
																className={`flex-1 rounded-lg px-3 py-2 text-sm ${
																	theme === "light"
																		? "bg-gray-50 focus:bg-white"
																		: "bg-gray-700 focus:bg-gray-600"
																} focus:outline-none focus:ring-1 focus:ring-blue-500`}
															/>
															<button
																type="button"
																onClick={() => {
																	if (newPost.pollOptions.length > 2) {
																		const newOptions = [...newPost.pollOptions];
																		newOptions.splice(index, 1);
																		setNewPost((prev) => ({
																			...prev,
																			pollOptions: newOptions,
																		}));
																	} else {
																		showToast(
																			"A poll needs at least 2 options",
																			"warning"
																		);
																	}
																}}
																className={`p-1 rounded-full ${
																	theme === "light"
																		? "text-red-500 hover:bg-red-50"
																		: "text-red-400 hover:bg-red-900/20"
																}`}
															>
																<X size={16} />
															</button>
														</div>
													))}
													<button
														type="button"
														onClick={() =>
															setNewPost((prev) => ({
																...prev,
																pollOptions: [...prev.pollOptions, ""],
															}))
														}
														className={`text-sm flex items-center space-x-1 ${
															theme === "light"
																? "text-blue-600 hover:text-blue-700"
																: "text-blue-400 hover:text-blue-300"
														}`}
													>
														<Plus size={14} />
														<span>Add Option</span>
													</button>
												</div>
											)}

											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-2">
													<button
														type="button"
														onClick={() => {
															// Open file upload dialog
															const input = document.createElement("input");
															input.type = "file";
															input.accept = "image/*,video/*";
															input.onchange = (e) =>
																handleFileUpload(e, "media");
															input.click();
														}}
														className={`p-2 rounded-lg transition-colors ${
															newPost.mediaType === "image"
																? "bg-blue-500 text-white"
																: theme === "light"
																? "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
																: "text-gray-300 hover:text-blue-300 hover:bg-blue-900/20"
														}`}
														title="Upload image or video"
													>
														<ImageIcon size={20} />
													</button>
													<button
														type="button"
														onClick={() =>
															setNewPost((prev) => ({
																...prev,
																mediaType:
																	prev.mediaType === "video" ? "none" : "video",
																mediaUrl:
																	prev.mediaType === "video"
																		? ""
																		: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?auto=format&fit=crop&w=880&q=80",
															}))
														}
														className={`p-2 rounded-lg transition-colors ${
															newPost.mediaType === "video"
																? "bg-blue-500 text-white"
																: theme === "light"
																? "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
																: "text-gray-300 hover:text-blue-300 hover:bg-blue-900/20"
														}`}
														title="Add video"
													>
														<Video size={20} />
													</button>
													<button
														type="button"
														onClick={() =>
															setNewPost((prev) => ({
																...prev,
																mediaType:
																	prev.mediaType === "poll" ? "none" : "poll",
																pollOptions:
																	prev.mediaType === "poll"
																		? ["", ""]
																		: ["Option 1", "Option 2"],
															}))
														}
														className={`p-2 rounded-lg transition-colors ${
															newPost.mediaType === "poll"
																? "bg-blue-500 text-white"
																: theme === "light"
																? "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
																: "text-gray-300 hover:text-blue-300 hover:bg-blue-900/20"
														}`}
														title="Create poll"
													>
														<FileText size={20} />
													</button>
												</div>
												<button
													type="submit"
													disabled={!newPost.content.trim()}
													className={`px-4 py-2 rounded-lg transition-all duration-300 ${
														newPost.content.trim()
															? "bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105 active:scale-95"
															: "bg-blue-300 text-white cursor-not-allowed dark:bg-blue-800/50"
													}`}
												>
													Post
												</button>
											</div>
										</form>
									</div>
								</div>

								{/* View Filters */}
								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-2">
										<button
											onClick={() => setDisplayMode("grid")}
											className={`p-2 rounded-lg transition-colors ${
												displayMode === "grid"
													? "bg-blue-500 text-white"
													: theme === "light"
													? "text-gray-600 hover:bg-gray-100"
													: "text-gray-300 hover:bg-gray-700"
											}`}
											title="Grid view"
										>
											<Grid size={20} />
										</button>
										<button
											onClick={() => setDisplayMode("list")}
											className={`p-2 rounded-lg transition-colors ${
												displayMode === "list"
													? "bg-blue-500 text-white"
													: theme === "light"
													? "text-gray-600 hover:bg-gray-100"
													: "text-gray-300 hover:bg-gray-700"
											}`}
											title="List view"
										>
											<List size={20} />
										</button>
									</div>

									<button
										onClick={() => setFilterVisible(!filterVisible)}
										className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
											theme === "light"
												? "hover:bg-gray-100"
												: "hover:bg-gray-700"
										}`}
									>
										<Filter size={16} />
										<span>Filter</span>
									</button>
								</div>

								{/* Filter Options */}
								{filterVisible && (
									<div
										className={`p-4 rounded-xl animate-fadeIn ${
											theme === "light"
												? "bg-white shadow-sm"
												: "bg-gray-800/90 shadow-md"
										}`}
									>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div>
												<label className="block text-sm font-medium mb-1">
													Art Style
												</label>
												<select
													value={searchFilters.artStyle}
													onChange={handleFilterChange}
													name="artStyle"
													className={`w-full p-2 rounded-lg text-sm ${
														theme === "light"
															? "bg-gray-50 focus:bg-white"
															: "bg-gray-700 focus:bg-gray-600"
													} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
												>
													<option value="">Any Style</option>
													<option value="minimalist">Minimalist</option>
													<option value="abstract">Abstract</option>
													<option value="realistic">Realistic</option>
													<option value="illustration">Illustration</option>
													<option value="3d">3D</option>
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1">
													Software
												</label>
												<select
													value={searchFilters.software}
													onChange={handleFilterChange}
													name="software"
													className={`w-full p-2 rounded-lg text-sm ${
														theme === "light"
															? "bg-gray-50 focus:bg-white"
															: "bg-gray-700 focus:bg-gray-600"
													} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
												>
													<option value="">Any Software</option>
													<option value="figma">Figma</option>
													<option value="photoshop">Photoshop</option>
													<option value="illustrator">Illustrator</option>
													<option value="sketch">Sketch</option>
													<option value="blender">Blender</option>
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1">
													Location
												</label>
												<select
													value={searchFilters.location}
													onChange={handleFilterChange}
													name="location"
													className={`w-full p-2 rounded-lg text-sm ${
														theme === "light"
															? "bg-gray-50 focus:bg-white"
															: "bg-gray-700 focus:bg-gray-600"
													} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
												>
													<option value="">Any Location</option>
													<option value="nyc">New York, NY</option>
													<option value="sf">San Francisco, CA</option>
													<option value="la">Los Angeles, CA</option>
													<option value="london">London, UK</option>
													<option value="remote">Remote</option>
												</select>
											</div>
										</div>
										<div className="flex justify-end mt-4 space-x-2">
											<button
												onClick={() => {
													setSearchFilters({
														industry: "",
														skills: "",
														location: "",
														artStyle: "",
														software: "",
														availability: "",
													});
													showToast("Filters cleared", "info");
												}}
												className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
													theme === "light"
														? "hover:bg-gray-100"
														: "hover:bg-gray-700"
												}`}
											>
												Clear
											</button>
											<button
												onClick={() => {
													setFilterVisible(false);
													showToast("Filters applied", "success");
												}}
												className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
											>
												Apply
											</button>
										</div>
									</div>
								)}

								{/* Posts Display */}
								{displayMode === "grid" ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{posts.map((post) => (
											<div
												key={post.id}
												className={`rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] ${
													theme === "light"
														? "bg-white shadow-sm hover:shadow-md"
														: "bg-gray-800 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20"
												}`}
											>
												{/* Post media */}
												{post.media.type === "image" && (
													<div className="relative group">
														<img
															src={post.media.url}
															alt="Post"
															className="w-full h-52 object-cover"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
															<div className="absolute bottom-3 right-3 flex space-x-2">
																<button
																	onClick={() => handleLikePost(post.id)}
																	className={`p-1.5 rounded-full transition-colors ${
																		likedPosts.includes(post.id)
																			? "bg-red-500 text-white"
																			: "bg-white/20 text-white hover:bg-white/30"
																	}`}
																>
																	<Heart
																		size={18}
																		fill={
																			likedPosts.includes(post.id)
																				? "currentColor"
																				: "none"
																		}
																	/>
																</button>
																<button
																	onClick={() => handleSavePost(post.id)}
																	className={`p-1.5 rounded-full transition-colors ${
																		savedPosts.includes(post.id)
																			? "bg-blue-500 text-white"
																			: "bg-white/20 text-white hover:bg-white/30"
																	}`}
																>
																	<BookmarkIcon
																		size={18}
																		fill={
																			savedPosts.includes(post.id)
																				? "currentColor"
																				: "none"
																		}
																	/>
																</button>
															</div>
														</div>
													</div>
												)}

												{/* Post content */}
												<div className="p-4">
													<div className="flex items-start space-x-3 mb-3">
														<img
															src={post.user.avatar}
															alt={post.user.name}
															className="w-10 h-10 rounded-full object-cover"
														/>
														<div>
															<h3 className="font-medium">{post.user.name}</h3>
															<p className="text-sm text-gray-500 dark:text-gray-400">
																{post.user.title} • {post.time}
															</p>
														</div>
													</div>

													<p className="mb-3 line-clamp-3">{post.content}</p>

													{post.tags && post.tags.length > 0 && (
														<div className="flex flex-wrap gap-1 mb-3">
															{post.tags.map((tag, index) => (
																<span
																	key={index}
																	className={`text-xs px-2 py-0.5 rounded-full ${
																		theme === "light"
																			? "bg-blue-100 text-blue-700"
																			: "bg-blue-900/30 text-blue-300"
																	}`}
																>
																	{tag}
																</span>
															))}
														</div>
													)}

													{post.media.type === "poll" && post.media.options && (
														<div className="mb-3 space-y-2">
															{post.media.options.map((option, index) => (
																<button
																	key={index}
																	onClick={() =>
																		showToast(
																			`Voted for "${option}"`,
																			"success"
																		)
																	}
																	className={`w-full p-2 rounded-lg text-left transition-colors ${
																		theme === "light"
																			? "bg-gray-100 hover:bg-gray-200"
																			: "bg-gray-700 hover:bg-gray-600"
																	}`}
																>
																	{option}
																</button>
															))}
														</div>
													)}

													<div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
														<button
															onClick={() => handleLikePost(post.id)}
															className={`flex items-center text-sm transition-all duration-300 group ${
																likedPosts.includes(post.id)
																	? "text-red-500 font-medium"
																	: "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
															}`}
														>
															<Heart
																size={18}
																className="mr-1 transform transition-transform duration-300 group-hover:scale-110"
																fill={
																	likedPosts.includes(post.id)
																		? "currentColor"
																		: "none"
																}
															/>
															<span>{post.likes}</span>
														</button>
														<button
															onClick={() => handleToggleComments(post.id)}
															className={`flex items-center text-sm transition-colors duration-300 ${
																commentsVisible.includes(post.id)
																	? "text-blue-500 dark:text-blue-400"
																	: "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
															}`}
														>
															<MessageSquare size={18} className="mr-1" />
															{post.comments.length}
														</button>
														<button
															onClick={() => handleSharePost(post.id)}
															className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
														>
															<Share2 size={18} className="mr-1" />
															Share
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="space-y-6">
										{posts.map((post) => (
											<div
												key={post.id}
												className={`rounded-xl p-4 transform transition-all duration-300 hover:scale-[1.01] ${
													theme === "light"
														? "bg-white/90 backdrop-blur-lg shadow-sm"
														: "bg-gray-800/90 backdrop-blur-lg shadow-lg shadow-black/10"
												}`}
											>
												<div className="flex items-start space-x-3 mb-4">
													<img
														src={post.user.avatar}
														alt={post.user.name}
														className="w-10 h-10 rounded-full object-cover"
													/>
													<div>
														<h3 className="font-medium">{post.user.name}</h3>
														<p className="text-sm text-gray-500 dark:text-gray-400">
															{post.user.title} • {post.time}
														</p>
													</div>
												</div>

												<p className="mb-4">{post.content}</p>

												{post.tags && post.tags.length > 0 && (
													<div className="flex flex-wrap gap-1.5 mb-4">
														{post.tags.map((tag, index) => (
															<span
																key={index}
																className={`text-xs px-2 py-0.5 rounded-full ${
																	theme === "light"
																		? "bg-blue-100 text-blue-700"
																		: "bg-blue-900/30 text-blue-300"
																}`}
															>
																{tag}
															</span>
														))}
													</div>
												)}

												{post.media.type === "image" && (
													<div className="mb-4 rounded-lg overflow-hidden">
														<img
															src={post.media.url}
															alt="Post"
															className="w-full max-h-96 object-cover"
														/>
													</div>
												)}

												{post.media.type === "video" && (
													<div className="mb-4 rounded-lg overflow-hidden bg-gray-900 relative">
														<img
															src={post.media.url}
															alt="Video thumbnail"
															className="w-full h-64 object-cover opacity-80"
														/>
														<div className="absolute inset-0 flex items-center justify-center">
															<button
																onClick={() =>
																	showToast("Video player coming soon", "info")
																}
																className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
															>
																<svg
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	className="w-8 h-8 text-white"
																>
																	<polygon points="5 3 19 12 5 21 5 3"></polygon>
																</svg>
															</button>
														</div>
													</div>
												)}

												{post.media.type === "poll" && post.media.options && (
													<div className="mb-4 space-y-2">
														{post.media.options.map((option, index) => (
															<button
																key={index}
																onClick={() =>
																	showToast(`Voted for "${option}"`, "success")
																}
																className={`w-full p-3 rounded-lg text-left transition-colors ${
																	theme === "light"
																		? "bg-gray-100 hover:bg-gray-200"
																		: "bg-gray-700 hover:bg-gray-600"
																}`}
															>
																{option}
															</button>
														))}
													</div>
												)}

												<div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
													<button
														onClick={() => handleLikePost(post.id)}
														className={`flex items-center text-sm transition-all duration-300 group ${
															likedPosts.includes(post.id)
																? "text-red-500 font-medium"
																: "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
														}`}
													>
														<Heart
															size={18}
															className="mr-1 transform transition-transform duration-300 group-hover:scale-110"
															fill={
																likedPosts.includes(post.id)
																	? "currentColor"
																	: "none"
															}
														/>
														<span>{post.likes}</span>
													</button>
													<button
														onClick={() => handleToggleComments(post.id)}
														className={`flex items-center text-sm transition-colors duration-300 ${
															commentsVisible.includes(post.id)
																? "text-blue-500 dark:text-blue-400"
																: "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
														}`}
													>
														<MessageSquare size={18} className="mr-1" />
														{post.comments.length}
													</button>
													<button
														onClick={() => handleSharePost(post.id)}
														className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 group"
													>
														<Share2
															size={18}
															className="mr-1 transform transition-transform duration-300 group-hover:scale-110"
														/>
														Share
														{sharedPosts[post.id]
															? ` (${sharedPosts[post.id]})`
															: ""}
													</button>
													<button
														onClick={() => handleSavePost(post.id)}
														className={`flex items-center text-sm transition-colors duration-300 ${
															savedPosts.includes(post.id)
																? "text-blue-500 dark:text-blue-400 font-medium"
																: "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
														}`}
													>
														<BookmarkIcon
															size={18}
															className="mr-1"
															fill={
																savedPosts.includes(post.id)
																	? "currentColor"
																	: "none"
															}
														/>
														{savedPosts.includes(post.id) ? "Saved" : "Save"}
													</button>
												</div>

												{/* Comments Section */}
												{commentsVisible.includes(post.id) && (
													<div className="mt-4 space-y-4 animate-fadeIn">
														{post.comments.map((comment) => (
															<div
																key={comment.id}
																className="flex items-start space-x-3"
															>
																<img
																	src={comment.user.avatar}
																	alt={comment.user.name}
																	className="w-8 h-8 rounded-full object-cover"
																/>
																<div className="flex-1 min-w-0">
																	<div
																		className={`rounded-lg p-3 ${
																			theme === "light"
																				? "bg-gray-100"
																				: "bg-gray-700"
																		}`}
																	>
																		<p className="font-medium text-sm">
																			{comment.user.name}
																		</p>
																		<p className="text-sm">{comment.content}</p>
																	</div>
																	<div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
																		<span>{comment.time}</span>
																		<button
																			onClick={() =>
																				showToast("Comment liked!", "success")
																			}
																			className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
																		>
																			Like
																		</button>
																		<button
																			onClick={() =>
																				showToast(
																					"Reply feature coming soon",
																					"info"
																				)
																			}
																			className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
																		>
																			Reply
																		</button>
																	</div>
																</div>
															</div>
														))}

														{/* Add Comment */}
														<div className="flex items-start space-x-3">
															<img
																src={profileData.avatar}
																alt="Your profile"
																className="w-8 h-8 rounded-full object-cover"
															/>
															<form
																onSubmit={(e) => handleAddComment(e, post.id)}
																className="flex-1"
															>
																<div className="relative">
																	<input
																		type="text"
																		value={newComment}
																		onChange={(e) =>
																			setNewComment(e.target.value)
																		}
																		placeholder="Write a comment..."
																		className={`w-full pr-10 pl-4 py-2 rounded-full text-sm ${
																			theme === "light"
																				? "bg-gray-100 focus:bg-white"
																				: "bg-gray-700 focus:bg-gray-600"
																		} focus:outline-none focus:ring-2 focus:ring-blue-500`}
																	/>
																	<button
																		type="submit"
																		disabled={!newComment.trim()}
																		className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
																			newComment.trim()
																				? "text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
																				: "text-gray-400 cursor-not-allowed"
																		}`}
																	>
																		<Send size={16} />
																	</button>
																</div>
															</form>
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{/* Profile Tab Content */}
						{activeTab === "profile" && (
							<div className="space-y-6">
								{/* Profile Header */}
								<div
									className={`rounded-xl overflow-hidden transform transition-all duration-300 ${
										theme === "light"
											? "bg-white/95 backdrop-blur-lg shadow-sm"
											: "bg-gray-800/95 backdrop-blur-lg shadow-lg shadow-black/10"
									}`}
								>
									{/* Cover Image */}
									<div
										className={`h-48 relative overflow-hidden ${
											isEditingProfile && editedProfileData.coverImage
												? ""
												: theme === "light"
												? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
												: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
										}`}
									>
										{isEditingProfile && editedProfileData.coverImage && (
											<img
												src={editedProfileData.coverImage}
												alt="Cover"
												className="w-full h-full object-cover"
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent"></div>
										{isEditingProfile && (
											<button
												onClick={() => {
													const input = document.createElement("input");
													input.type = "file";
													input.accept = "image/*";
													input.onchange = (e) => handleFileUpload(e, "cover");
													input.click();
												}}
												className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm text-white text-sm transition-all duration-300"
											>
												<Camera size={18} className="mr-1" />
												Change Cover
											</button>
										)}

										{/* Availability Badge */}
										<div className="absolute top-4 left-4">
											<div
												className={`px-3 py-1 rounded-full text-sm backdrop-blur-sm ${
													theme === "light"
														? "bg-green-500/80 text-white"
														: "bg-green-600/80 text-white"
												}`}
											>
												{isEditingProfile ? (
													<select
														value={editedProfileData.availability}
														onChange={(e) =>
															setEditedProfileData((prev) => ({
																...prev,
																availability: e.target.value,
															}))
														}
														className="bg-transparent border-none outline-none"
													>
														<option value="Available for freelance">
															Available for freelance
														</option>
														<option value="Open to work">Open to work</option>
														<option value="Not available">Not available</option>
													</select>
												) : (
													profileData.availability
												)}
											</div>
										</div>
									</div>

									<div className="px-6 pb-6">
										{/* Profile Image and Action Buttons */}
										<div className="flex justify-between items-end -mt-16 mb-4">
											<div className="relative group">
												<div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transform transition-transform duration-300 group-hover:scale-105">
													<img
														src={
															isEditingProfile
																? editedProfileData.avatar
																: profileData.avatar
														}
														alt="Profile"
														className="w-full h-full object-cover"
													/>
													{isEditingProfile && (
														<button
															onClick={() => {
																const input = document.createElement("input");
																input.type = "file";
																input.accept = "image/*";
																input.onchange = (e) =>
																	handleFileUpload(e, "avatar");
																input.click();
															}}
															className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
														>
															<Camera size={24} className="text-white" />
														</button>
													)}
												</div>
											</div>

											<div className="flex space-x-2">
												{!isEditingProfile && (
													<button
														onClick={() =>
															showToast(
																"Coming soon: Download profile as PDF",
																"info"
															)
														}
														className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
															theme === "light"
																? "border border-gray-300 hover:bg-gray-100"
																: "border border-gray-600 hover:bg-gray-700"
														}`}
													>
														<span className="hidden md:inline">Download</span>{" "}
														CV
													</button>
												)}

												<button
													onClick={() => {
														if (isEditingProfile) {
															setProfileData(editedProfileData);
															setIsEditingProfile(false);
															showToast(
																"Profile updated successfully!",
																"success"
															);
														} else {
															setIsEditingProfile(true);
															setEditedProfileData(profileData);
														}
													}}
													className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
														isEditingProfile
															? "bg-green-500 hover:bg-green-600 text-white"
															: "bg-blue-500 hover:bg-blue-600 text-white"
													}`}
												>
													{isEditingProfile ? "Save Changes" : "Edit Profile"}
												</button>
											</div>
										</div>

										{/* Profile Info */}
										<div className="space-y-4">
											{/* Name and Title */}
											{isEditingProfile ? (
												<div className="space-y-3">
													<input
														type="text"
														value={editedProfileData.name}
														onChange={(e) =>
															setEditedProfileData((prev) => ({
																...prev,
																name: e.target.value,
															}))
														}
														className={`text-xl font-bold w-full px-3 py-2 rounded-lg ${
															theme === "light" ? "bg-gray-100" : "bg-gray-700"
														} focus:outline-none focus:ring-2 focus:ring-blue-500`}
													/>
													<input
														type="text"
														value={editedProfileData.title}
														onChange={(e) =>
															setEditedProfileData((prev) => ({
																...prev,
																title: e.target.value,
															}))
														}
														className={`text-gray-500 dark:text-gray-400 w-full px-3 py-2 rounded-lg ${
															theme === "light" ? "bg-gray-100" : "bg-gray-700"
														} focus:outline-none focus:ring-2 focus:ring-blue-500`}
													/>
												</div>
											) : (
												<>
													<h2 className="text-2xl font-bold">
														{profileData.name}
													</h2>
													<p className="text-gray-500 dark:text-gray-400">
														{profileData.title}
													</p>
												</>
											)}

											{/* Contact Info */}
											<div className="flex flex-wrap items-center gap-3 text-sm">
												<div className="flex items-center">
													<MapPin
														size={16}
														className="mr-1 text-gray-500 dark:text-gray-400"
													/>
													{isEditingProfile ? (
														<input
															type="text"
															value={editedProfileData.location}
															onChange={(e) =>
																setEditedProfileData((prev) => ({
																	...prev,
																	location: e.target.value,
																}))
															}
															className={`px-2 py-1 rounded-lg ${
																theme === "light"
																	? "bg-gray-100"
																	: "bg-gray-700"
															} focus:outline-none focus:ring-2 focus:ring-blue-500`}
														/>
													) : (
														<span>{profileData.location}</span>
													)}
												</div>
												<div className="flex items-center">
													<Link
														size={16}
														className="mr-1 text-gray-500 dark:text-gray-400"
													/>
													{isEditingProfile ? (
														<input
															type="text"
															value={editedProfileData.website}
															onChange={(e) =>
																setEditedProfileData((prev) => ({
																	...prev,
																	website: e.target.value,
																}))
															}
															className={`px-2 py-1 rounded-lg ${
																theme === "light"
																	? "bg-gray-100"
																	: "bg-gray-700"
															} focus:outline-none focus:ring-2 focus:ring-blue-500`}
														/>
													) : (
														<a
															href="#"
															className="text-blue-500 hover:underline"
														>
															{profileData.website}
														</a>
													)}
												</div>
												<div className="flex items-center space-x-2">
													<div className="flex items-center">
														<Users
															size={16}
															className="mr-1 text-gray-500 dark:text-gray-400"
														/>
														<span className="font-semibold">
															{profileData.followers}
														</span>
														<span className="text-gray-500 dark:text-gray-400 ml-1">
															followers
														</span>
													</div>
													<span className="text-gray-400">•</span>
													<div>
														<span className="font-semibold">
															{profileData.following}
														</span>
														<span className="text-gray-500 dark:text-gray-400 ml-1">
															following
														</span>
													</div>
												</div>
											</div>

											{/* Bio */}
											<div>
												<h3 className="font-medium mb-2">About</h3>
												{isEditingProfile ? (
													<textarea
														value={editedProfileData.bio}
														onChange={(e) =>
															setEditedProfileData((prev) => ({
																...prev,
																bio: e.target.value,
															}))
														}
														rows={4}
														className={`w-full px-3 py-2 rounded-lg ${
															theme === "light"
																? "bg-gray-100 text-gray-900"
																: "bg-gray-700 text-gray-100"
														} focus:outline-none focus:ring-2 focus:ring-blue-500`}
													/>
												) : (
													<p
														className={`${
															theme === "light"
																? "text-gray-900"
																: "text-gray-100"
														}`}
													>
														{profileData.bio}
													</p>
												)}
											</div>

											{/* Skills */}
											<div>
												<div className="flex justify-between items-center mb-2">
													<h3 className="font-medium">Skills</h3>
													{isEditingProfile && (
														<button
															onClick={() => {
																const skill = prompt("Enter new skill:");
																if (skill?.trim()) {
																	setEditedProfileData((prev) => ({
																		...prev,
																		skills: [...prev.skills, skill.trim()],
																	}));
																}
															}}
															className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
														>
															<Plus size={16} className="mr-1" />
															Add Skill
														</button>
													)}
												</div>
												<DragDropContext
													onDragEnd={(result) =>
														handleDragEnd(result, "skills")
													}
												>
													<Droppable
														droppableId="skills"
														direction="horizontal"
													>
														{(provided, snapshot) => (
															<div className="flex flex-wrap gap-2">
																{(isEditingProfile
																	? editedProfileData.skills
																	: profileData.skills
																).map((skill, index) => (
																	<Draggable
																		key={skill}
																		draggableId={skill}
																		index={index}
																	>
																		{(provided, snapshot) => (
																			<div
																				className={`group relative px-3 py-1 rounded-full text-sm transition-all duration-300 cursor-move ${
																					theme === "light"
																						? "bg-blue-50 text-blue-700 hover:bg-blue-100"
																						: "bg-blue-900/50 text-blue-300 hover:bg-blue-800/50"
																				} ${
																					snapshot.isDragging
																						? "shadow-lg scale-105"
																						: ""
																				}`}
																			>
																				{skill}
																				{isEditingProfile && (
																					<button
																						onClick={() => {
																							setEditedProfileData((prev) => ({
																								...prev,
																								skills: prev.skills.filter(
																									(s) => s !== skill
																								),
																							}));
																						}}
																						className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-xs"
																					>
																						×
																					</button>
																				)}
																			</div>
																		)}
																	</Draggable>
																))}
															</div>
														)}
													</Droppable>
												</DragDropContext>
											</div>

											{/* Software */}
											{profileData.software && (
												<div>
													<div className="flex justify-between items-center mb-2">
														<h3 className="font-medium">Software & Tools</h3>
														{isEditingProfile && (
															<button
																onClick={() => {
																	const software = prompt(
																		"Enter software/tool name:"
																	);
																	if (software?.trim()) {
																		setEditedProfileData((prev) => ({
																			...prev,
																			software: [
																				...prev.software,
																				software.trim(),
																			],
																		}));
																	}
																}}
																className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
															>
																<Plus size={16} className="mr-1" />
																Add Software
															</button>
														)}
													</div>
													<div className="flex flex-wrap gap-2">
														{(isEditingProfile
															? editedProfileData.software
															: profileData.software
														).map((software, index) => (
															<div
																key={index}
																className={`group relative px-3 py-1 rounded-full text-sm ${
																	theme === "light"
																		? "bg-purple-50 text-purple-700"
																		: "bg-purple-900/40 text-purple-300"
																}`}
															>
																{software}
																{isEditingProfile && (
																	<button
																		onClick={() => {
																			setEditedProfileData((prev) => ({
																				...prev,
																				software: prev.software.filter(
																					(_, i) => i !== index
																				),
																			}));
																		}}
																		className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-xs"
																	>
																		×
																	</button>
																)}
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Portfolio Section */}
								<div
									className={`rounded-xl p-6 ${
										theme === "light" ? "bg-white shadow-sm" : "bg-gray-800"
									}`}
								>
									<div className="flex justify-between items-center mb-4">
										<h3 className="font-medium text-lg">Portfolio</h3>
										{isEditingProfile && (
											<button
												onClick={() => {
													const type = prompt(
														"Enter item type (image/pdf/video):"
													);
													const url = prompt("Enter URL:");
													const title = prompt("Enter title:");
													if (type && url && title) {
														setEditedProfileData((prev) => ({
															...prev,
															portfolio: [
																...prev.portfolio,
																{ id: Date.now(), type, url, title },
															],
														}));
														showToast("Portfolio item added!", "success");
													}
												}}
												className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
											>
												<Plus size={16} className="mr-1" />
												Add Item
											</button>
										)}
									</div>

									<DragDropContext
										onDragEnd={(result) => handleDragEnd(result, "portfolio")}
									>
										<Droppable droppableId="portfolio" direction="horizontal">
											{(provided, snapshot) => (
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
													{(isEditingProfile
														? editedProfileData.portfolio
														: profileData.portfolio
													).map((item, index) => (
														<Draggable
															key={item.id.toString()}
															draggableId={item.id.toString()}
															index={index}
														>
															{(provided, snapshot) => (
																<div
																	className={`rounded-lg overflow-hidden relative group transition-all duration-300 ${
																		snapshot.isDragging
																			? "shadow-lg scale-105"
																			: "hover:shadow-md"
																	}`}
																>
																	{item.type === "image" ? (
																		<img
																			src={item.url}
																			alt={item.title}
																			className="w-full h-48 object-cover"
																		/>
																	) : item.type === "pdf" ? (
																		<div
																			className={`w-full h-48 flex items-center justify-center ${
																				theme === "light"
																					? "bg-red-50"
																					: "bg-red-900/20"
																			}`}
																		>
																			<FileText
																				size={48}
																				className={`${
																					theme === "light"
																						? "text-red-500"
																						: "text-red-400"
																				}`}
																			/>
																		</div>
																	) : (
																		<div
																			className={`w-full h-48 flex items-center justify-center ${
																				theme === "light"
																					? "bg-purple-50"
																					: "bg-purple-900/20"
																			}`}
																		>
																			<Video
																				size={48}
																				className={`${
																					theme === "light"
																						? "text-purple-500"
																						: "text-purple-400"
																				}`}
																			/>
																		</div>
																	)}

																	<div
																		className={`absolute inset-0 flex items-center justify-center ${
																			isEditingProfile
																				? "bg-black bg-opacity-50"
																				: "bg-black bg-opacity-0 group-hover:bg-opacity-40"
																		} transition-all duration-300`}
																	>
																		{isEditingProfile ? (
																			<div className="flex space-x-2">
																				<button
																					onClick={() => {
																						const newTitle = prompt(
																							"Enter new title:",
																							item.title
																						);
																						if (newTitle?.trim()) {
																							setEditedProfileData((prev) => ({
																								...prev,
																								portfolio: prev.portfolio.map(
																									(p) =>
																										p.id === item.id
																											? {
																													...p,
																													title:
																														newTitle.trim(),
																											  }
																											: p
																								),
																							}));
																						}
																					}}
																					className="p-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
																				>
																					Edit
																				</button>
																				<button
																					onClick={() => {
																						setEditedProfileData((prev) => ({
																							...prev,
																							portfolio: prev.portfolio.filter(
																								(p) => p.id !== item.id
																							),
																						}));
																					}}
																					className="p-2 bg-red-500/80 hover:bg-red-500 rounded text-white transition-colors"
																				>
																					Delete
																				</button>
																			</div>
																		) : (
																			<button
																				onClick={() =>
																					showToast(
																						`Opening ${item.title}`,
																						"info"
																					)
																				}
																				className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
																			>
																				View Project
																			</button>
																		)}
																	</div>

																	<div
																		className={`p-3 ${
																			theme === "light"
																				? "bg-white"
																				: "bg-gray-700"
																		}`}
																	>
																		<h4 className="font-medium">
																			{item.title}
																		</h4>
																		<p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
																			{item.type}
																		</p>
																	</div>
																</div>
															)}
														</Draggable>
													))}
												</div>
											)}
										</Droppable>
									</DragDropContext>
								</div>
							</div>
						)}

						{/* Network/Search Tab Content */}
						{activeTab === "network" && (
							<div className="space-y-6">
								<div
									className={`p-6 rounded-xl ${
										theme === "light"
											? "bg-white shadow-sm"
											: "bg-gray-800 shadow-md"
									}`}
								>
									<h2 className="text-xl font-bold mb-6">
										Find Creative Professionals
									</h2>

									<form onSubmit={handleSearch} className="space-y-6">
										<div className="relative">
											<input
												type="text"
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												placeholder="Search for people, skills, or companies..."
												className={`w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300 ${
													theme === "light"
														? "bg-gray-100 focus:bg-white"
														: "bg-gray-700 focus:bg-gray-600"
												} focus:outline-none focus:ring-2 focus:ring-blue-500`}
											/>
											<Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div>
												<label
													htmlFor="industry"
													className="block text-sm font-medium mb-2"
												>
													Industry
												</label>
												<select
													id="industry"
													name="industry"
													value={searchFilters.industry}
													onChange={handleFilterChange}
													className={`w-full p-3 rounded-xl ${
														theme === "light"
															? "bg-gray-100 focus:bg-white"
															: "bg-gray-700 focus:bg-gray-600"
													} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
												>
													<option value="">Any Industry</option>
													<option value="design">Design</option>
													<option value="technology">Technology</option>
													<option value="marketing">Marketing</option>
													<option value="film">Film & Video</option>
													<option value="photography">Photography</option>
												</select>
											</div>
											<div>
												<label
													htmlFor="skills"
													className="block text-sm font-medium mb-2"
												>
													Skills
												</label>
												<select
													id="skills"
													name="skills"
													value={searchFilters.skills}
													onChange={handleFilterChange}
													className={`w-full p-3 rounded-xl ${
														theme === "light"
															? "bg-gray-100 focus:bg-white"
															: "bg-gray-700 focus:bg-gray-600"
													} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
												>
													<option value="">Any Skill</option>
													<option value="ui">UI Design</option>
													<option value="ux">UX Design</option>
													<option value="graphic">Graphic Design</option>
													<option value="motion">Motion Design</option>
													<option value="3d">3D Modeling</option>
												</select>
											</div>
											<div>
												<label
													htmlFor="artStyle"
													className="block text-sm font-medium mb-2"
												>
													Art Style
												</label>
												<select
													id="artStyle"
													name="artStyle"
													value={searchFilters.artStyle}
													onChange={handleFilterChange}
													className={`w-full p-3 rounded-xl ${
														theme === "light"
															? "bg-gray-100 focus:bg-white"
															: "bg-gray-700 focus:bg-gray-600"
													} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
												>
													<option value="">Any Style</option>
													<option value="minimalist">Minimalist</option>
													<option value="abstract">Abstract</option>
													<option value="realistic">Realistic</option>
													<option value="illustration">Illustration</option>
													<option value="3d">3D</option>
												</select>
											</div>
										</div>
										<div className="flex justify-end space-x-3">
											<button
												type="button"
												className={`px-4 py-2 rounded-xl transition-all duration-300 ${
													theme === "light"
														? "border border-gray-300 hover:bg-gray-100"
														: "border border-gray-600 hover:bg-gray-700"
												}`}
											>
												Reset
											</button>
											<button
												type="submit"
												className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
											>
												Search
											</button>
										</div>
									</form>
								</div>

								{/* Search Results */}
								<div
									className={`p-6 rounded-xl ${
										theme === "light"
											? "bg-white shadow-sm"
											: "bg-gray-800 shadow-md"
									}`}
								>
									<div className="flex justify-between items-center mb-6">
										<h3 className="text-lg font-medium">
											Creative Professionals
										</h3>
										<div className="flex items-center space-x-2">
											<button
												className={`p-1.5 rounded-lg text-sm transition-colors ${
													theme === "light"
														? "bg-gray-100 text-gray-700"
														: "bg-gray-700 text-gray-200"
												}`}
											>
												Relevance
											</button>
											<span className="text-gray-400">•</span>
											<button
												className={`p-1.5 rounded-lg text-sm transition-colors ${
													theme === "light"
														? "text-gray-500 hover:bg-gray-100"
														: "text-gray-400 hover:bg-gray-700"
												}`}
											>
												Recent
											</button>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[
											{
												name: "Sarah Johnson",
												title: "Senior Designer",
												skills: ["UI Design", "Animation"],
												avatar:
													"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
												location: "New York, NY",
												availability: "Available for freelance",
											},
											{
												name: "Michael Chen",
												title: "UX Researcher",
												skills: ["UX Research", "Prototyping"],
												avatar:
													"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
												location: "San Francisco, CA",
												availability: "Full-time only",
											},
											{
												name: "Emily Davis",
												title: "Creative Director",
												skills: ["Branding", "Art Direction"],
												avatar:
													"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
												location: "London, UK",
												availability: "Open to opportunities",
											},
											{
												name: "Liam Patel",
												title: "Motion Designer",
												skills: ["Motion Graphics", "3D Animation"],
												avatar:
													"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
												location: "Los Angeles, CA",
												availability: "Available for projects",
											},
										].map((person, index) => (
											<div
												key={index}
												className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] group ${
													theme === "light"
														? "bg-gray-50 hover:bg-gray-100"
														: "bg-gray-700/50 hover:bg-gray-600/50"
												}`}
											>
												<div className="flex items-start space-x-3">
													<img
														src={person.avatar}
														alt={person.name}
														className="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 ring-transparent group-hover:ring-blue-500 transition-all duration-300"
													/>
													<div className="flex-1 min-w-0">
														<h4 className="font-medium">{person.name}</h4>
														<p className="text-sm text-gray-500 dark:text-gray-400">
															{person.title}
														</p>
														<div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
															<MapPin size={12} className="mr-1" />
															<span>{person.location}</span>
														</div>
														<div className="mt-1 text-xs text-green-500 flex items-center">
															<span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
															{person.availability}
														</div>
													</div>
												</div>
												<div className="mt-3 flex flex-wrap gap-1.5">
													{person.skills.map((skill, idx) => (
														<span
															key={idx}
															className={`text-xs px-2 py-0.5 rounded-full ${
																theme === "light"
																	? "bg-blue-100 text-blue-700"
																	: "bg-blue-900/30 text-blue-300"
															}`}
														>
															{skill}
														</span>
													))}
												</div>
												<div className="mt-4 flex space-x-2">
													<button
														onClick={() =>
															showToast(
																`Connection request sent to ${person.name}!`,
																"success"
															)
														}
														className={`flex-1 py-2 rounded-lg text-sm transition-all duration-300 ${
															theme === "light"
																? "bg-blue-500 text-white hover:bg-blue-600"
																: "bg-blue-600 text-white hover:bg-blue-700"
														}`}
													>
														Connect
													</button>
													<button
														onClick={() => {
															setActiveChatId(index + 1);
															showToast(
																`Chat opened with ${person.name}`,
																"info"
															);
														}}
														className={`flex-1 py-2 rounded-lg text-sm transition-all duration-300 ${
															theme === "light"
																? "border border-gray-300 hover:bg-gray-200"
																: "border border-gray-600 hover:bg-gray-700"
														}`}
													>
														Message
													</button>
												</div>
											</div>
										))}
									</div>

									<div className="mt-6 flex justify-center">
										<button
											onClick={() =>
												showToast("Loading more results...", "info")
											}
											className={`px-4 py-2 rounded-lg text-sm transition-colors ${
												theme === "light"
													? "bg-gray-100 hover:bg-gray-200 text-gray-800"
													: "bg-gray-700 hover:bg-gray-600 text-gray-200"
											}`}
										>
											Load More
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Analytics Tab Content */}
						{activeTab === "analytics" && (
							<div className="space-y-6">
								{/* Overview Cards */}
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
									<div
										className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 relative group ${
											theme === "light"
												? "bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm"
												: "bg-gradient-to-br from-blue-900/20 to-blue-800/20 shadow-md"
										}`}
									>
										<div className="absolute -top-4 -right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg transform transition-transform duration-300 group-hover:scale-110">
											<img
												src={profileData.avatar}
												alt="Profile"
												className="w-full h-full object-cover"
											/>
										</div>
										<h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">
											Profile Views
										</h3>
										<p className="text-2xl font-bold mt-1">152</p>
										<p className="text-sm text-green-500 flex items-center mt-1">
											<svg
												className="w-4 h-4 mr-1"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M5 10l7-7m0 0l7 7m-7-7v18"
												/>
											</svg>
											+12% from last week
										</p>
									</div>
									<div
										className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
											theme === "light"
												? "bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm"
												: "bg-gradient-to-br from-purple-900/20 to-purple-800/20 shadow-md"
										}`}
									>
										<h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">
											Post Engagement
										</h3>
										<p className="text-2xl font-bold mt-1">84</p>
										<p className="text-sm text-green-500 flex items-center mt-1">
											<svg
												className="w-4 h-4 mr-1"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M5 10l7-7m0 0l7 7m-7-7v18"
												/>
											</svg>
											+8% from last week
										</p>
									</div>
									<div
										className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
											theme === "light"
												? "bg-gradient-to-br from-green-50 to-green-100 shadow-sm"
												: "bg-gradient-to-br from-green-900/20 to-green-800/20 shadow-md"
										}`}
									>
										<h3 className="text-sm font-medium text-green-600 dark:text-green-400">
											New Connections
										</h3>
										<p className="text-2xl font-bold mt-1">27</p>
										<p className="text-sm text-green-500 flex items-center mt-1">
											<svg
												className="w-4 h-4 mr-1"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M5 10l7-7m0 0l7 7m-7-7v18"
												/>
											</svg>
											+15% from last week
										</p>
									</div>
									<div
										className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
											theme === "light"
												? "bg-gradient-to-br from-orange-50 to-orange-100 shadow-sm"
												: "bg-gradient-to-br from-orange-900/20 to-orange-800/20 shadow-md"
										}`}
									>
										<h3 className="text-sm font-medium text-orange-600 dark:text-orange-400">
											Content Reach
										</h3>
										<p className="text-2xl font-bold mt-1">1.2K</p>
										<p className="text-sm text-green-500 flex items-center mt-1">
											<svg
												className="w-4 h-4 mr-1"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M5 10l7-7m0 0l7 7m-7-7v18"
												/>
											</svg>
											+23% from last week
										</p>
									</div>
								</div>

								{/* Growth Trends Chart */}
								<div
									className={`p-6 rounded-xl ${
										theme === "light"
											? "bg-white shadow-sm"
											: "bg-gray-800 shadow-md"
									}`}
								>
									<h3 className="text-lg font-medium mb-4">Growth Trends</h3>
									<div className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<AreaChart
												data={[
													{
														name: "Mon",
														views: analytics.profileViews[0],
														engagement: analytics.engagement[0],
														followers: analytics.followerGain[0],
													},
													{
														name: "Tue",
														views: analytics.profileViews[1],
														engagement: analytics.engagement[1],
														followers: analytics.followerGain[1],
													},
													{
														name: "Wed",
														views: analytics.profileViews[2],
														engagement: analytics.engagement[2],
														followers: analytics.followerGain[2],
													},
													{
														name: "Thu",
														views: analytics.profileViews[3],
														engagement: analytics.engagement[3],
														followers: analytics.followerGain[3],
													},
													{
														name: "Fri",
														views: analytics.profileViews[4],
														engagement: analytics.engagement[4],
														followers: analytics.followerGain[4],
													},
													{
														name: "Sat",
														views: analytics.profileViews[5],
														engagement: analytics.engagement[5],
														followers: analytics.followerGain[5],
													},
													{
														name: "Sun",
														views: analytics.profileViews[6],
														engagement: analytics.engagement[6],
														followers: analytics.followerGain[6],
													},
												]}
												margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
											>
												<CartesianGrid
													strokeDasharray="3 3"
													stroke={theme === "light" ? "#e5e7eb" : "#374151"}
												/>
												<XAxis
													dataKey="name"
													stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
												/>
												<YAxis
													stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
												/>
												<RechartsTooltip
													contentStyle={{
														backgroundColor:
															theme === "light" ? "white" : "#1f2937",
														border: "none",
														borderRadius: "0.5rem",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
													}}
												/>
												<Area
													type="monotone"
													dataKey="views"
													stackId="1"
													stroke="#3b82f6"
													fill="#93c5fd"
													fillOpacity={0.3}
													name="Profile Views"
												/>
												<Area
													type="monotone"
													dataKey="engagement"
													stackId="1"
													stroke="#8b5cf6"
													fill="#c4b5fd"
													fillOpacity={0.3}
													name="Engagement"
												/>
												<Area
													type="monotone"
													dataKey="followers"
													stackId="1"
													stroke="#10b981"
													fill="#6ee7b7"
													fillOpacity={0.3}
													name="New Followers"
												/>
												<Legend />
											</AreaChart>
										</ResponsiveContainer>
									</div>
								</div>

								{/* Content Performance */}
								<div
									className={`p-6 rounded-xl ${
										theme === "light"
											? "bg-white shadow-sm"
											: "bg-gray-800 shadow-md"
									}`}
								>
									<h3 className="text-lg font-medium mb-4">
										Content Performance
									</h3>
									<div className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart
												data={analytics.contentPerformance}
												margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
											>
												<CartesianGrid
													strokeDasharray="3 3"
													stroke={theme === "light" ? "#e5e7eb" : "#374151"}
												/>
												<XAxis
													dataKey="title"
													stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
												/>
												<YAxis
													stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
												/>
												<RechartsTooltip
													contentStyle={{
														backgroundColor:
															theme === "light" ? "white" : "#1f2937",
														border: "none",
														borderRadius: "0.5rem",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
													}}
												/>
												<Legend />
												<Bar
													dataKey="views"
													fill="#3b82f6"
													radius={[4, 4, 0, 0]}
													name="Views"
												/>
												<Bar
													dataKey="engagement"
													fill="#8b5cf6"
													radius={[4, 4, 0, 0]}
													name="Engagement"
												/>
												<Bar
													dataKey="shares"
													fill="#10b981"
													radius={[4, 4, 0, 0]}
													name="Shares"
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>

								{/* Audience Insights */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<div
										className={`p-6 rounded-xl ${
											theme === "light"
												? "bg-white shadow-sm"
												: "bg-gray-800 shadow-md"
										}`}
									>
										<h3 className="text-lg font-medium mb-4">
											Industry Distribution
										</h3>
										<div className="h-80">
											<ResponsiveContainer width="100%" height="100%">
												<PieChart>
													<Pie
														data={Object.entries(
															analytics.audienceInsights.industries
														).map(([name, value]) => ({
															name,
															value,
														}))}
														cx="50%"
														cy="50%"
														innerRadius={60}
														outerRadius={80}
														fill="#8884d8"
														paddingAngle={5}
														dataKey="value"
														label={({ name, percent }) =>
															`${name} ${(percent * 100).toFixed(0)}%`
														}
													>
														{Object.entries(
															analytics.audienceInsights.industries
														).map((entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][
																		index % 4
																	]
																}
															/>
														))}
													</Pie>
													<RechartsTooltip
														contentStyle={{
															backgroundColor:
																theme === "light" ? "white" : "#1f2937",
															border: "none",
															borderRadius: "0.5rem",
															boxShadow:
																"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
														}}
													/>
													<Legend />
												</PieChart>
											</ResponsiveContainer>
										</div>
									</div>
									<div
										className={`p-6 rounded-xl ${
											theme === "light"
												? "bg-white shadow-sm"
												: "bg-gray-800 shadow-md"
										}`}
									>
										<h3 className="text-lg font-medium mb-4">
											Geographic Distribution
										</h3>
										<div className="h-80">
											<ResponsiveContainer width="100%" height="100%">
												<PieChart>
													<Pie
														data={Object.entries(
															analytics.audienceInsights.locations
														).map(([name, value]) => ({
															name,
															value,
														}))}
														cx="50%"
														cy="50%"
														innerRadius={60}
														outerRadius={80}
														fill="#8884d8"
														paddingAngle={5}
														dataKey="value"
														label={({ name, percent }) =>
															`${name} ${(percent * 100).toFixed(0)}%`
														}
													>
														{Object.entries(
															analytics.audienceInsights.locations
														).map((entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][
																		index % 4
																	]
																}
															/>
														))}
													</Pie>
													<RechartsTooltip
														contentStyle={{
															backgroundColor:
																theme === "light" ? "white" : "#1f2937",
															border: "none",
															borderRadius: "0.5rem",
															boxShadow:
																"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
														}}
													/>
													<Legend />
												</PieChart>
											</ResponsiveContainer>
										</div>
									</div>
								</div>

								{/* Export Analytics */}
								<div className="flex justify-end">
									<button
										onClick={() =>
											showToast("Analytics report exported!", "success")
										}
										className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
											theme === "light"
												? "bg-blue-500 hover:bg-blue-600 text-white"
												: "bg-blue-600 hover:bg-blue-700 text-white"
										}`}
									>
										<Download size={16} className="mr-2" />
										Export Report
									</button>
								</div>
							</div>
						)}
					</div>
				</main>

				{/* Right Sidebar - Chats */}
				<aside
					className={`fixed right-0 top-16 bottom-0 w-64 overflow-hidden transition-all duration-300 transform ${
						isMobileView ? "translate-x-full md:translate-x-0" : ""
					} ${
						theme === "light"
							? "bg-white border-l border-gray-200"
							: "bg-gray-800 border-l border-gray-700"
					}`}
				>
					<div className="flex flex-col h-full">
						<div className="p-4 border-b border-gray-200 dark:border-gray-700">
							<h2 className="font-bold flex items-center justify-between">
								<span>Chats</span>
								<button
									onClick={() =>
										showToast("New chat feature coming soon", "info")
									}
									className={`p-1 rounded-full transition-colors ${
										theme === "light"
											? "hover:bg-gray-100 text-gray-700"
											: "hover:bg-gray-700 text-gray-300"
									}`}
								>
									<Edit size={16} />
								</button>
							</h2>
						</div>

						<div className="overflow-y-auto flex-1">
							<div className="space-y-1 p-2">
								{chats.map((chat) => (
									<button
										key={chat.id}
										onClick={() => setActiveChatId(chat.id)}
										className={`flex items-center w-full p-2 rounded-lg transition-all duration-300 group ${
											activeChatId === chat.id
												? "bg-blue-600 text-white"
												: theme === "light"
												? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
												: "text-gray-200 hover:bg-blue-900/20 hover:text-blue-300"
										}`}
									>
										<div className="relative flex-shrink-0 mr-3">
											<div
												className={`relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ${
													activeChatId === chat.id
														? "ring-white ring-offset-blue-600"
														: "ring-transparent group-hover:ring-blue-400 group-hover:ring-offset-blue-50 dark:group-hover:ring-offset-gray-800"
												} transition-all duration-300`}
											>
												<img
													src={chat.avatar}
													alt={chat.name}
													className="w-full h-full object-cover"
												/>
											</div>
											{chat.online && (
												<div className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
											)}
										</div>
										<div className="flex-1 min-w-0 text-left">
											<div className="flex justify-between items-center">
												<h3 className="font-medium truncate">{chat.name}</h3>
												<span
													className={`text-xs ml-2 flex-shrink-0 transition-colors duration-300 ${
														activeChatId === chat.id
															? "text-blue-100"
															: theme === "light"
															? "text-gray-500 group-hover:text-blue-500"
															: "text-gray-400 group-hover:text-blue-300"
													}`}
												>
													{chat.time}
												</span>
											</div>
											<p
												className={`text-sm truncate transition-colors duration-300 ${
													activeChatId === chat.id
														? "text-blue-100"
														: theme === "light"
														? "text-gray-600 group-hover:text-blue-500"
														: "text-gray-400 group-hover:text-blue-300"
												}`}
											>
												{chat.lastMessage}
											</p>
										</div>
										{chat.unread > 0 && (
											<div className="ml-2 flex-shrink-0">
												<div
													className={`flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full text-xs font-medium ${
														activeChatId === chat.id
															? "bg-white text-blue-600"
															: "bg-blue-600 text-white"
													} transition-colors duration-300`}
												>
													{chat.unread}
												</div>
											</div>
										)}
									</button>
								))}
							</div>
						</div>
					</div>
				</aside>

				{/* Active Chat Modal */}
				{activeChatId && (
					<div
						className={`fixed right-4 bottom-0 w-80 ${
							theme === "light"
								? "bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200"
								: "bg-gray-800/95 backdrop-blur-lg shadow-lg border border-gray-700"
						} rounded-t-xl overflow-hidden z-20`}
					>
						<div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
							<div className="flex items-center space-x-3">
								<div className="relative">
									<div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-blue-500">
										<img
											src={
												chats.find((c) => c.id === activeChatId)?.avatar || ""
											}
											alt="Chat"
											className="w-full h-full object-cover"
										/>
									</div>
									{chats.find((c) => c.id === activeChatId)?.online && (
										<div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
									)}
								</div>
								<div>
									<h3 className="font-medium text-sm">
										{chats.find((c) => c.id === activeChatId)?.name}
									</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
										{chats.find((c) => c.id === activeChatId)?.online ? (
											<>
												<span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
												Online
											</>
										) : (
											"Offline"
										)}
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-1">
								<button
									className={`p-1.5 rounded-lg transition-all duration-300 ${
										theme === "light"
											? "text-gray-600 hover:bg-gray-100 hover:text-blue-600 active:bg-gray-200"
											: "text-gray-400 hover:bg-gray-700 hover:text-blue-400 active:bg-gray-600"
									}`}
									aria-label="Start voice call"
									onClick={() =>
										showToast("Video call feature coming soon", "info")
									}
								>
									<Phone size={16} />
								</button>
								<button
									className={`p-1.5 rounded-lg transition-all duration-300 ${
										theme === "light"
											? "text-gray-600 hover:bg-gray-100 hover:text-blue-600 active:bg-gray-200"
											: "text-gray-400 hover:bg-gray-700 hover:text-blue-400 active:bg-gray-600"
									}`}
									aria-label="Share file"
									onClick={() =>
										showToast("File sharing feature coming soon", "info")
									}
								>
									<FileUp size={16} />
								</button>
								<button
									className={`p-1.5 rounded-lg transition-all duration-300 ${
										theme === "light"
											? "text-gray-600 hover:bg-gray-100 hover:text-red-600 active:bg-gray-200"
											: "text-gray-400 hover:bg-gray-700 hover:text-red-400 active:bg-gray-600"
									}`}
									onClick={() => setActiveChatId(null)}
									aria-label="Close chat"
								>
									<X size={16} />
								</button>
							</div>
						</div>
						<div className="h-96 p-4 overflow-y-auto space-y-4">
							<div className="flex space-x-2">
								<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
									<img
										src={chats.find((c) => c.id === activeChatId)?.avatar || ""}
										alt="User"
										className="w-full h-full object-cover"
									/>
								</div>
								<div
									className={`max-w-[75%] rounded-2xl p-3 ${
										theme === "light" ? "bg-gray-100" : "bg-gray-700"
									}`}
								>
									<p className="text-sm">
										Hey, what do you think about the latest design proposal?
									</p>
									<p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
										10:30 AM
									</p>
								</div>
							</div>
							<div className="flex justify-end">
								<div
									className={`max-w-[75%] rounded-2xl p-3 ${
										theme === "light"
											? "bg-blue-500 text-white"
											: "bg-blue-600 text-white"
									}`}
								>
									<p className="text-sm">
										I think it looks great! Just a few tweaks needed on the
										typography.
									</p>
									<div className="flex items-center justify-end mt-1 space-x-1">
										<p className="text-[11px] text-blue-100">10:32 AM</p>
										<svg
											className="h-4 w-4 text-blue-100"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								</div>
							</div>
							<div className="flex space-x-2">
								<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
									<img
										src={chats.find((c) => c.id === activeChatId)?.avatar || ""}
										alt="User"
										className="w-full h-full object-cover"
									/>
								</div>
								<div
									className={`max-w-[75%] rounded-2xl p-3 ${
										theme === "light" ? "bg-gray-100" : "bg-gray-700"
									}`}
								>
									<p className="text-sm">
										Agreed. Can you send me the updated version by EOD?
									</p>
									<p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
										10:33 AM
									</p>
								</div>
							</div>
							<div className="flex justify-end">
								<div
									className={`max-w-[75%] rounded-2xl p-3 ${
										theme === "light"
											? "bg-blue-500 text-white"
											: "bg-blue-600 text-white"
									}`}
								>
									<p className="text-sm">
										Sure thing! I'll have it ready for you.
									</p>
									<div className="flex items-center justify-end mt-1 space-x-1">
										<p className="text-[11px] text-blue-100">10:35 AM</p>
										<svg
											className="h-4 w-4 text-blue-100"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								</div>
							</div>
						</div>
						<div
							className={`p-3 border-t ${
								theme === "light" ? "border-gray-200" : "border-gray-700"
							}`}
						>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									showToast("Message sent!", "success");
								}}
								className="flex items-center space-x-2"
							>
								<div className="flex-1 relative">
									<input
										type="text"
										placeholder="Type a message..."
										className={`w-full py-2 pl-3 pr-8 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
											theme === "light"
												? "bg-gray-100 hover:bg-gray-50 focus:bg-white"
												: "bg-gray-700 hover:bg-gray-600 focus:bg-gray-600"
										}`}
									/>
									<button
										type="button"
										className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</button>
								</div>
								<button
									type="submit"
									className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									<Send size={16} />
								</button>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

// For @hello-pangea/dnd support
function At(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={props.size || 24}
			height={props.size || 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={props.className || ""}
		>
			<circle cx="12" cy="12" r="4"></circle>
			<path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
		</svg>
	);
}

function Download(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={props.size || 24}
			height={props.size || 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={props.className || ""}
		>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
			<polyline points="7 10 12 15 17 10"></polyline>
			<line x1="12" y1="15" x2="12" y2="3"></line>
		</svg>
	);
}
