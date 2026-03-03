"use client";
import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	useRef,
	useCallback,
	useMemo,
} from "react";
import { FaSun, FaMoon, FaBell } from "react-icons/fa";

// Type definitions
type Link = {
	id: string;
	url: string;
	title: string;
	description: string;
	category: string;
	tags: string[];
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	updatedBy: string;
	status: "pending" | "approved" | "rejected";
	isFavorite: boolean;
	versions: LinkVersion[];
	comments: Comment[];
	aiSuggestions: AISuggestion[];
};

type LinkVersion = {
	id: string;
	linkId: string;
	title: string;
	description: string;
	category: string;
	tags: string[];
	updatedBy: string;
	updatedAt: Date;
	changeDescription: string;
};

type Comment = {
	id: string;
	linkId: string;
	userId: string;
	userName: string;
	userAvatar: string;
	content: string;
	createdAt: Date;
	replies: Comment[];
};

type AISuggestion = {
	id: string;
	type: "category" | "tag" | "similar" | "description";
	content: string;
	confidence: number;
	isApplied: boolean;
};

type User = {
	id: string;
	name: string;
	avatar: string;
	role: "admin" | "editor" | "viewer";
	team: string;
};

type Category = {
	id: string;
	name: string;
	description: string;
	color: string;
	icon: string;
};

type SavedFilter = {
	id: string;
	name: string;
	criteria: FilterCriteria;
	createdBy: string;
	isPublic: boolean;
};

type FilterCriteria = {
	search: string;
	categories: string[];
	tags: string[];
	status: ("pending" | "approved" | "rejected")[];
	dateRange: { start: Date | null; end: Date | null };
	createdBy: string[];
};

type Toast = {
	id: string;
	type: "success" | "error" | "info" | "warning";
	message: string;
	duration: number;
};

type ThemeType = "light" | "dark";

// Context definitions
type AppContextType = {
	theme: ThemeType;
	toggleTheme: () => void;
	user: User;
	links: Link[];
	categories: Category[];
	savedFilters: SavedFilter[];
	addLink: (
		link: Omit<
			Link,
			| "id"
			| "createdAt"
			| "updatedAt"
			| "versions"
			| "comments"
			| "aiSuggestions"
		>
	) => void;
	updateLink: (link: Link) => void;
	deleteLink: (id: string) => void;
	addComment: (linkId: string, content: string) => void;
	addReply: (linkId: string, commentId: string, content: string) => void;
	toggleFavorite: (id: string) => void;
	approveLink: (id: string) => void;
	rejectLink: (id: string) => void;
	saveFilter: (
		name: string,
		criteria: FilterCriteria,
		isPublic: boolean
	) => void;
	showToast: (type: Toast["type"], message: string, duration?: number) => void;
	filterLinks: (criteria: FilterCriteria) => Link[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockCategories: Category[] = [
	{
		id: "1",
		name: "Development",
		description: "Programming and development resources",
		color: "#3b82f6",
		icon: "fa-code",
	},
	{
		id: "2",
		name: "Design",
		description: "UI/UX and graphic design resources",
		color: "#ec4899",
		icon: "fa-palette",
	},
	{
		id: "3",
		name: "Marketing",
		description: "Marketing and SEO resources",
		color: "#10b981",
		icon: "fa-bullhorn",
	},
	{
		id: "4",
		name: "Business",
		description: "Business and entrepreneurship resources",
		color: "#f59e0b",
		icon: "fa-briefcase",
	},
	{
		id: "5",
		name: "Education",
		description: "Learning and educational resources",
		color: "#8b5cf6",
		icon: "fa-graduation-cap",
	},
];

const mockTags = [
	"react",
	"typescript",
	"javascript",
	"css",
	"html",
	"design",
	"ui",
	"ux",
	"marketing",
	"seo",
	"business",
	"entrepreneurship",
	"education",
	"learning",
	"ai",
	"machine-learning",
	"productivity",
	"tools",
	"resources",
	"inspiration",
	"tutorial",
	"guide",
	"article",
	"video",
	"podcast",
];

const mockUsers: User[] = [
	{
		id: "1",
		name: "Alex Johnson",
		avatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
		role: "admin",
		team: "Engineering",
	},
	{
		id: "2",
		name: "Samantha Lee",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
		role: "editor",
		team: "Design",
	},
	{
		id: "3",
		name: "David Chen",
		avatar:
			"https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
		role: "viewer",
		team: "Marketing",
	},
	{
		id: "4",
		name: "Maria Rodriguez",
		avatar:
			"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
		role: "editor",
		team: "Product",
	},
];

const generateMockLinks = (count: number): Link[] => {
	const links: Link[] = [];
	const domains = [
		"github.com",
		"medium.com",
		"dev.to",
		"dribbble.com",
		"youtube.com",
		"smashingmagazine.com",
	];
	const titles = [
		"Building a Scalable React Application with TypeScript",
		"The Future of AI in Link Management",
		"How to Design for Accessibility",
		"SEO Best Practices for 2025",
		"The Ultimate Guide to CSS Grid",
		"Machine Learning Fundamentals",
		"Productivity Hacks for Developers",
		"Design Systems in Practice",
		"Modern Authentication Strategies",
		"Building Robust APIs with GraphQL",
	];
	const descriptions = [
		"A comprehensive guide to building scalable React applications with TypeScript and best practices.",
		"Exploring how AI is transforming link management and organization in 2025.",
		"Learn how to make your websites accessible to everyone with these practical tips.",
		"Stay ahead of the curve with these SEO best practices for 2025.",
		"Master CSS Grid with this in-depth guide and practical examples.",
		"An introduction to machine learning concepts and algorithms.",
		"Boost your productivity with these developer-focused tips and tools.",
		"Learn how to create and maintain design systems for your organization.",
		"Implement secure authentication in your applications with these modern strategies.",
		"Build flexible and efficient APIs with GraphQL and TypeScript.",
	];

	for (let i = 0; i < count; i++) {
		const categoryIndex = Math.floor(Math.random() * mockCategories.length);
		const userIndex = Math.floor(Math.random() * mockUsers.length);
		const tagsCount = Math.floor(Math.random() * 5) + 1;
		const selectedTags: string[] = [];

		for (let j = 0; j < tagsCount; j++) {
			const tagIndex = Math.floor(Math.random() * mockTags.length);
			if (!selectedTags.includes(mockTags[tagIndex])) {
				selectedTags.push(mockTags[tagIndex]);
			}
		}

		const titleIndex = Math.floor(Math.random() * titles.length);
		const domainIndex = Math.floor(Math.random() * domains.length);
		const createdDate = new Date();
		createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));

		const updatedDate = new Date(createdDate);
		if (Math.random() > 0.5) {
			updatedDate.setDate(
				updatedDate.getDate() + Math.floor(Math.random() * 10) + 1
			);
		}

		const status: Link["status"] =
			Math.random() > 0.7
				? "pending"
				: Math.random() > 0.5
				? "approved"
				: "rejected";

		const commentsCount = Math.floor(Math.random() * 5);
		const comments: Comment[] = [];

		for (let j = 0; j < commentsCount; j++) {
			const commentUserIndex = Math.floor(Math.random() * mockUsers.length);
			const commentDate = new Date(createdDate);
			commentDate.setDate(
				commentDate.getDate() + Math.floor(Math.random() * 5) + 1
			);

			const repliesCount =
				Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
			const replies: Comment[] = [];

			for (let k = 0; k < repliesCount; k++) {
				const replyUserIndex = Math.floor(Math.random() * mockUsers.length);
				const replyDate = new Date(commentDate);
				replyDate.setDate(
					replyDate.getDate() + Math.floor(Math.random() * 3) + 1
				);

				replies.push({
					id: `reply-${i}-${j}-${k}`,
					linkId: `link-${i}`,
					userId: mockUsers[replyUserIndex].id,
					userName: mockUsers[replyUserIndex].name,
					userAvatar: mockUsers[replyUserIndex].avatar,
					content: `This is a reply to the comment. It's quite insightful and adds to the conversation.`,
					createdAt: replyDate,
					replies: [],
				});
			}

			comments.push({
				id: `comment-${i}-${j}`,
				linkId: `link-${i}`,
				userId: mockUsers[commentUserIndex].id,
				userName: mockUsers[commentUserIndex].name,
				userAvatar: mockUsers[commentUserIndex].avatar,
				content: `This is a comment on the link. It contains some thoughts and opinions about the resource.`,
				createdAt: commentDate,
				replies,
			});
		}

		const versionsCount =
			Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
		const versions: LinkVersion[] = [];

		for (let j = 0; j < versionsCount; j++) {
			const versionDate = new Date(createdDate);
			versionDate.setDate(versionDate.getDate() + j + 1);

			versions.push({
				id: `version-${i}-${j}`,
				linkId: `link-${i}`,
				title: `${titles[titleIndex]} (v${j})`,
				description: `${descriptions[titleIndex]} This is version ${
					j + 1
				} of the description.`,
				category: mockCategories[categoryIndex].id,
				tags: selectedTags.slice(0, j + 1),
				updatedBy: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
				updatedAt: versionDate,
				changeDescription: `Updated title, description, and tags for version ${
					j + 1
				}.`,
			});
		}

		const aiSuggestionsCount = Math.floor(Math.random() * 4) + 1;
		const aiSuggestions: AISuggestion[] = [];

		const suggestionTypes: AISuggestion["type"][] = [
			"category",
			"tag",
			"similar",
			"description",
		];

		for (let j = 0; j < aiSuggestionsCount; j++) {
			const type = suggestionTypes[j % suggestionTypes.length];
			let content = "";

			switch (type) {
				case "category":
					content =
						mockCategories[Math.floor(Math.random() * mockCategories.length)]
							.name;
					break;
				case "tag":
					content = mockTags[Math.floor(Math.random() * mockTags.length)];
					break;
				case "similar":
					content = `https://${
						domains[Math.floor(Math.random() * domains.length)]
					}/similar-resource-${Math.floor(Math.random() * 100)}`;
					break;
				case "description":
					content = `AI-suggested description: ${
						descriptions[Math.floor(Math.random() * descriptions.length)]
					}`;
					break;
			}

			aiSuggestions.push({
				id: `suggestion-${i}-${j}`,
				type,
				content,
				confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
				isApplied: Math.random() > 0.7,
			});
		}

		links.push({
			id: `link-${i}`,
			url: `https://${domains[domainIndex]}/article-${i}`,
			title: titles[titleIndex],
			description: descriptions[titleIndex],
			category: mockCategories[categoryIndex].id,
			tags: selectedTags,
			createdBy: mockUsers[userIndex].id,
			createdAt: createdDate,
			updatedAt: updatedDate,
			updatedBy: mockUsers[userIndex].id,
			status,
			isFavorite: Math.random() > 0.8,
			versions,
			comments,
			aiSuggestions,
		});
	}

	return links;
};

const mockSavedFilters: SavedFilter[] = [
	{
		id: "1",
		name: "My Favorites",
		criteria: {
			search: "",
			categories: [],
			tags: [],
			status: ["approved"],
			dateRange: { start: null, end: null },
			createdBy: [],
		},
		createdBy: "1",
		isPublic: true,
	},
	{
		id: "2",
		name: "Development Resources",
		criteria: {
			search: "",
			categories: ["1"],
			tags: ["react", "typescript"],
			status: ["approved"],
			dateRange: { start: null, end: null },
			createdBy: [],
		},
		createdBy: "1",
		isPublic: true,
	},
	{
		id: "3",
		name: "Pending Design Links",
		criteria: {
			search: "",
			categories: ["2"],
			tags: [],
			status: ["pending"],
			dateRange: { start: null, end: null },
			createdBy: [],
		},
		createdBy: "2",
		isPublic: false,
	},
];

// Main App Component
const LinkRepository: React.FC = () => {
	const [theme, setTheme] = useState<ThemeType>(() => {
		const savedTheme = localStorage.getItem("theme");
		return (savedTheme as ThemeType) || "light";
	});

	const [links, setLinks] = useState<Link[]>(() => generateMockLinks(20));
	const [categories] = useState<Category[]>(mockCategories);
	const [currentUser] = useState<User>(mockUsers[0]);
	const [savedFilters, setSavedFilters] =
		useState<SavedFilter[]>(mockSavedFilters);
	const [toasts, setToasts] = useState<Toast[]>([]);

	// Apply theme to document
	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem("theme", theme);
	}, [theme]);

	// Toast management
	const showToast = useCallback(
		(type: Toast["type"], message: string, duration = 3000) => {
			const id = `toast-${Date.now()}`;
			setToasts((prev) => [...prev, { id, type, message, duration }]);

			setTimeout(() => {
				setToasts((prev) => prev.filter((toast) => toast.id !== id));
			}, duration);
		},
		[]
	);

	// Link management functions
	const addLink = useCallback(
		(
			newLink: Omit<
				Link,
				| "id"
				| "createdAt"
				| "updatedAt"
				| "versions"
				| "comments"
				| "aiSuggestions"
			>
		) => {
			const now = new Date();
			const link: Link = {
				id: `link-${Date.now()}`,
				...newLink,
				createdAt: now,
				updatedAt: now,
				versions: [],
				comments: [],
				aiSuggestions: generateAISuggestions(newLink),
			};

			setLinks((prev) => [link, ...prev]);
			showToast("success", "Link added successfully!");
		},
		[showToast]
	);

	const updateLink = useCallback(
		(updatedLink: Link) => {
			setLinks((prev) => {
				return prev.map((link) => {
					if (link.id === updatedLink.id) {
						// Create a version of the previous state
						const version: LinkVersion = {
							id: `version-${Date.now()}`,
							linkId: link.id,
							title: link.title,
							description: link.description,
							category: link.category,
							tags: [...link.tags],
							updatedBy: currentUser.id,
							updatedAt: new Date(),
							changeDescription: "Updated link information",
						};

						return {
							...updatedLink,
							versions: [version, ...link.versions],
							updatedAt: new Date(),
							updatedBy: currentUser.id,
						};
					}
					return link;
				});
			});

			showToast("success", "Link updated successfully!");
		},
		[currentUser.id, showToast]
	);

	const deleteLink = useCallback(
		(id: string) => {
			setLinks((prev) => prev.filter((link) => link.id !== id));
			showToast("info", "Link deleted successfully!");
		},
		[showToast]
	);

	const addComment = useCallback(
		(linkId: string, content: string) => {
			setLinks((prev) => {
				return prev.map((link) => {
					if (link.id === linkId) {
						const newComment: Comment = {
							id: `comment-${Date.now()}`,
							linkId,
							userId: currentUser.id,
							userName: currentUser.name,
							userAvatar: currentUser.avatar,
							content,
							createdAt: new Date(),
							replies: [],
						};

						return {
							...link,
							comments: [newComment, ...link.comments],
						};
					}
					return link;
				});
			});

			showToast("success", "Comment added successfully!");
		},
		[currentUser, showToast]
	);

	const addReply = useCallback(
		(linkId: string, commentId: string, content: string) => {
			setLinks((prev) => {
				return prev.map((link) => {
					if (link.id === linkId) {
						const findAndAddReply = (comments: Comment[]): Comment[] => {
							return comments.map((comment) => {
								if (comment.id === commentId) {
									const newReply: Comment = {
										id: `reply-${Date.now()}`,
										linkId,
										userId: currentUser.id,
										userName: currentUser.name,
										userAvatar: currentUser.avatar,
										content,
										createdAt: new Date(),
										replies: [],
									};

									return {
										...comment,
										replies: [...comment.replies, newReply],
									};
								}

								if (comment.replies.length > 0) {
									return {
										...comment,
										replies: findAndAddReply(comment.replies),
									};
								}

								return comment;
							});
						};

						return {
							...link,
							comments: findAndAddReply(link.comments),
						};
					}
					return link;
				});
			});

			showToast("success", "Reply added successfully!");
		},
		[currentUser, showToast]
	);

	const toggleFavorite = useCallback(
		(id: string) => {
			setLinks((prev) => {
				return prev.map((link) => {
					if (link.id === id) {
						return {
							...link,
							isFavorite: !link.isFavorite,
						};
					}
					return link;
				});
			});

			showToast("info", "Favorites updated!");
		},
		[showToast]
	);

	const approveLink = useCallback(
		(id: string) => {
			setLinks((prev) => {
				return prev.map((link) => {
					if (link.id === id) {
						return {
							...link,
							status: "approved",
							updatedAt: new Date(),
							updatedBy: currentUser.id,
						};
					}
					return link;
				});
			});

			showToast("success", "Link approved!");
		},
		[currentUser.id, showToast]
	);

	const rejectLink = useCallback(
		(id: string) => {
			setLinks((prev) => {
				return prev.map((link) => {
					if (link.id === id) {
						return {
							...link,
							status: "rejected",
							updatedAt: new Date(),
							updatedBy: currentUser.id,
						};
					}
					return link;
				});
			});

			showToast("warning", "Link rejected!");
		},
		[currentUser.id, showToast]
	);

	const saveFilter = useCallback(
		(name: string, criteria: FilterCriteria, isPublic: boolean) => {
			const newFilter: SavedFilter = {
				id: `filter-${Date.now()}`,
				name,
				criteria,
				createdBy: currentUser.id,
				isPublic,
			};

			setSavedFilters((prev) => [...prev, newFilter]);
			showToast("success", "Filter saved successfully!");
		},
		[currentUser.id, showToast]
	);

	const filterLinks = useCallback(
		(criteria: FilterCriteria) => {
			return links.filter((link) => {
				// Search text
				if (
					criteria.search &&
					!link.title.toLowerCase().includes(criteria.search.toLowerCase()) &&
					!link.description
						.toLowerCase()
						.includes(criteria.search.toLowerCase()) &&
					!link.url.toLowerCase().includes(criteria.search.toLowerCase())
				) {
					return false;
				}

				// Categories
				if (
					criteria.categories.length > 0 &&
					!criteria.categories.includes(link.category)
				) {
					return false;
				}

				// Tags
				if (
					criteria.tags.length > 0 &&
					!criteria.tags.some((tag) => link.tags.includes(tag))
				) {
					return false;
				}

				// Status
				if (
					criteria.status.length > 0 &&
					!criteria.status.includes(link.status)
				) {
					return false;
				}

				// Date range
				if (
					criteria.dateRange.start &&
					link.createdAt < criteria.dateRange.start
				) {
					return false;
				}

				if (criteria.dateRange.end) {
					const endDate = new Date(criteria.dateRange.end);
					endDate.setHours(23, 59, 59, 999);
					if (link.createdAt > endDate) {
						return false;
					}
				}

				// Created by
				if (
					criteria.createdBy.length > 0 &&
					!criteria.createdBy.includes(link.createdBy)
				) {
					return false;
				}

				return true;
			});
		},
		[links]
	);

	const toggleTheme = useCallback(() => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	}, []);

	// Generate AI suggestions based on link content
	function generateAISuggestions(
		link: Omit<
			Link,
			| "id"
			| "createdAt"
			| "updatedAt"
			| "versions"
			| "comments"
			| "aiSuggestions"
		>
	): AISuggestion[] {
		const suggestions: AISuggestion[] = [];

		// Category suggestion
		if (Math.random() > 0.3) {
			const suggestedCategory = mockCategories.find(
				(c) => c.id !== link.category
			);
			if (suggestedCategory) {
				suggestions.push({
					id: `suggestion-category-${Date.now()}`,
					type: "category",
					content: suggestedCategory.name,
					confidence: Math.random() * 0.3 + 0.6,
					isApplied: false,
				});
			}
		}

		// Tag suggestions
		const existingTags = new Set(link.tags);
		const availableTags = mockTags.filter((tag) => !existingTags.has(tag));

		for (let i = 0; i < Math.min(3, availableTags.length); i++) {
			if (Math.random() > 0.3) {
				const randomIndex = Math.floor(Math.random() * availableTags.length);
				const tag = availableTags[randomIndex];
				availableTags.splice(randomIndex, 1);

				suggestions.push({
					id: `suggestion-tag-${Date.now()}-${i}`,
					type: "tag",
					content: tag,
					confidence: Math.random() * 0.4 + 0.6,
					isApplied: false,
				});
			}
		}

		// Similar link suggestion
		if (Math.random() > 0.5) {
			suggestions.push({
				id: `suggestion-similar-${Date.now()}`,
				type: "similar",
				content: `https://example.com/similar-resource-${Math.floor(
					Math.random() * 1000
				)}`,
				confidence: Math.random() * 0.2 + 0.7,
				isApplied: false,
			});
		}

		// Description enhancement suggestion
		if (Math.random() > 0.4) {
			suggestions.push({
				id: `suggestion-description-${Date.now()}`,
				type: "description",
				content: `AI-enhanced description: ${link.description} This resource also covers advanced topics and practical examples.`,
				confidence: Math.random() * 0.3 + 0.6,
				isApplied: false,
			});
		}

		return suggestions;
	}

	const contextValue = useMemo<AppContextType>(
		() => ({
			theme,
			toggleTheme,
			user: currentUser,
			links,
			categories,
			savedFilters,
			addLink,
			updateLink,
			deleteLink,
			addComment,
			addReply,
			toggleFavorite,
			approveLink,
			rejectLink,
			saveFilter,
			showToast,
			filterLinks,
		}),
		[
			theme,
			toggleTheme,
			currentUser,
			links,
			categories,
			savedFilters,
			addLink,
			updateLink,
			deleteLink,
			addComment,
			addReply,
			toggleFavorite,
			approveLink,
			rejectLink,
			saveFilter,
			showToast,
			filterLinks,
		]
	);

	return (
		<AppContext.Provider value={contextValue}>
			<div
				className={`min-h-screen bg-gradient-to-br transition-colors duration-300 ${
					theme === "light"
						? "from-blue-50 to-indigo-100"
						: "from-gray-900 to-blue-900"
				}`}
			>
				<Layout>
					<Dashboard />
				</Layout>
				<ToastContainer toasts={toasts} />
			</div>
		</AppContext.Provider>
	);
};

// Custom hook for accessing the AppContext
const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { theme, toggleTheme, user } = useAppContext();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="flex flex-col min-h-screen">
			<header
				className={`sticky top-0 z-10 ${
					theme === "light" ? "bg-white/80" : "bg-gray-800/80"
				} backdrop-blur-md border-b ${
					theme === "light" ? "border-gray-200" : "border-gray-700"
				} px-4 py-3 flex items-center justify-between shadow-sm`}
			>
				<div className="flex items-center">
					<button
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className={`mr-4 text-xl ${
							theme === "light"
								? "text-gray-700 hover:text-gray-900"
								: "text-gray-300 hover:text-white"
						} transition-colors duration-200`}
					>
						<i className={`fas ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
					</button>
					<div className="flex items-center">
						<i
							className={`fas fa-link text-2xl mr-2 ${
								theme === "light" ? "text-blue-600" : "text-blue-400"
							}`}
						></i>
						<h1
							className={`text-xl font-bold ${
								theme === "light" ? "text-gray-800" : "text-white"
							}`}
						>
							LinkHub
							<span
								className={`${
									theme === "light" ? "text-blue-600" : "text-blue-400"
								}`}
							>
								Pro
							</span>
						</h1>
					</div>
				</div>

				<div className="flex-1 mx-8">
					<div
						className={`relative ${
							theme === "light" ? "text-gray-600" : "text-gray-300"
						}`}
					>
						<span className="absolute inset-y-0 left-0 flex items-center pl-3">
							<i className="fas fa-search"></i>
						</span>
						<input
							type="search"
							placeholder="Search across all links..."
							className={`w-full py-2 pl-10 pr-4 rounded-full ${
								theme === "light"
									? "bg-gray-100 border-gray-300 placeholder-gray-500 focus:bg-white"
									: "bg-gray-700 border-gray-600 placeholder-gray-400 focus:bg-gray-600"
							} border focus:outline-none focus:ring-2 ${
								theme === "light"
									? "focus:ring-blue-300"
									: "focus:ring-blue-700"
							} transition-colors duration-200`}
						/>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					<button
						onClick={toggleTheme}
						className={`p-2 rounded-full ${
							theme === "light"
								? "bg-gray-200 text-gray-700 hover:bg-gray-300"
								: "bg-gray-700 text-gray-300 hover:bg-gray-600"
						} transition-colors duration-200`}
					>
						{theme === "light" ? <FaSun /> : <FaMoon />}
					</button>

					<button
						className={`p-2 rounded-full ${
							theme === "light"
								? "bg-gray-200 text-gray-700 hover:bg-gray-300"
								: "bg-gray-700 text-gray-300 hover:bg-gray-600"
						} transition-colors duration-200 relative`}
					>
						<FaBell />
						<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
					</button>

					<div className="flex items-center">
						<img
							src={user.avatar}
							alt={user.name}
							className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
						/>
						<div className="ml-2">
							<p
								className={`text-sm font-medium ${
									theme === "light" ? "text-gray-800" : "text-white"
								}`}
							>
								{user.name}
							</p>
							<p
								className={`text-xs ${
									theme === "light" ? "text-gray-500" : "text-gray-400"
								}`}
							>
								{user.role}
							</p>
						</div>
					</div>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				<aside
					className={`${
						isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"
					} transition-all duration-300 ${
						theme === "light" ? "bg-white/90" : "bg-gray-800/90"
					} backdrop-blur-md border-r ${
						theme === "light" ? "border-gray-200" : "border-gray-700"
					} h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0 z-10`}
				>
					<Sidebar />
				</aside>

				<main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
					{children}
				</main>
			</div>
		</div>
	);
};

// Sidebar Component
const Sidebar: React.FC = () => {
	const { theme, categories, savedFilters } = useAppContext();
	const [activeSection, setActiveSection] = useState<string>("all");

	return (
		<nav className="py-4">
			<div className="px-4 mb-6">
				<h2
					className={`text-xs uppercase font-bold tracking-wider ${
						theme === "light" ? "text-gray-500" : "text-gray-400"
					} mb-3`}
				>
					Main
				</h2>
				<ul>
					{[
						{ id: "all", name: "All Links", icon: "fa-globe" },
						{ id: "favorites", name: "Favorites", icon: "fa-star" },
						{ id: "pending", name: "Pending Approval", icon: "fa-clock" },
						{ id: "my-links", name: "My Links", icon: "fa-user" },
						{ id: "recent", name: "Recently Added", icon: "fa-history" },
					].map((item) => (
						<li key={item.id} className="mb-2">
							<button
								onClick={() => setActiveSection(item.id)}
								className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
									activeSection === item.id
										? theme === "light"
											? "bg-blue-50 text-blue-700"
											: "bg-blue-900/40 text-blue-300"
										: theme === "light"
										? "text-gray-700 hover:bg-gray-100"
										: "text-gray-300 hover:bg-gray-700"
								}`}
							>
								<i className={`fas ${item.icon} w-5 text-center`}></i>
								<span className="ml-3">{item.name}</span>
								{item.id === "pending" && (
									<span
										className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
											theme === "light"
												? "bg-blue-100 text-blue-800"
												: "bg-blue-800 text-blue-200"
										}`}
									>
										3
									</span>
								)}
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="px-4 mb-6">
				<h2
					className={`text-xs uppercase font-bold tracking-wider ${
						theme === "light" ? "text-gray-500" : "text-gray-400"
					} mb-3`}
				>
					Categories
				</h2>
				<ul>
					{categories.map((category) => (
						<li key={category.id} className="mb-2">
							<button
								onClick={() => setActiveSection(`category-${category.id}`)}
								className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
									activeSection === `category-${category.id}`
										? theme === "light"
											? "bg-blue-50 text-blue-700"
											: "bg-blue-900/40 text-blue-300"
										: theme === "light"
										? "text-gray-700 hover:bg-gray-100"
										: "text-gray-300 hover:bg-gray-700"
								}`}
							>
								<i
									className={`fas ${category.icon} w-5 text-center`}
									style={{ color: category.color }}
								></i>
								<span className="ml-3">{category.name}</span>
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="px-4 mb-6">
				<div className="flex items-center justify-between mb-3">
					<h2
						className={`text-xs uppercase font-bold tracking-wider ${
							theme === "light" ? "text-gray-500" : "text-gray-400"
						}`}
					>
						Saved Filters
					</h2>
					<button
						className={`text-xs ${
							theme === "light"
								? "text-blue-600 hover:text-blue-800"
								: "text-blue-400 hover:text-blue-300"
						}`}
					>
						<i className="fas fa-plus"></i>
					</button>
				</div>
				<ul>
					{savedFilters.map((filter) => (
						<li key={filter.id} className="mb-2">
							<button
								onClick={() => setActiveSection(`filter-${filter.id}`)}
								className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
									activeSection === `filter-${filter.id}`
										? theme === "light"
											? "bg-blue-50 text-blue-700"
											: "bg-blue-900/40 text-blue-300"
										: theme === "light"
										? "text-gray-700 hover:bg-gray-100"
										: "text-gray-300 hover:bg-gray-700"
								}`}
							>
								<i className="fas fa-filter w-5 text-center"></i>
								<span className="ml-3">{filter.name}</span>
								{!filter.isPublic && (
									<i className="fas fa-lock ml-auto text-xs opacity-70"></i>
								)}
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="px-4">
				<h2
					className={`text-xs uppercase font-bold tracking-wider ${
						theme === "light" ? "text-gray-500" : "text-gray-400"
					} mb-3`}
				>
					Team
				</h2>
				<ul>
					{[
						{ id: "team-links", name: "Team Links", icon: "fa-users" },
						{ id: "analytics", name: "Analytics", icon: "fa-chart-line" },
						{ id: "settings", name: "Settings", icon: "fa-cog" },
					].map((item) => (
						<li key={item.id} className="mb-2">
							<button
								onClick={() => setActiveSection(item.id)}
								className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
									activeSection === item.id
										? theme === "light"
											? "bg-blue-50 text-blue-700"
											: "bg-blue-900/40 text-blue-300"
										: theme === "light"
										? "text-gray-700 hover:bg-gray-100"
										: "text-gray-300 hover:bg-gray-700"
								}`}
							>
								<i className={`fas ${item.icon} w-5 text-center`}></i>
								<span className="ml-3">{item.name}</span>
							</button>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
};

// Dashboard Component
const Dashboard: React.FC = () => {
	const { theme, links, categories, user } = useAppContext();
	const [activeTab, setActiveTab] = useState<"all" | "favorites" | "pending">(
		"all"
	);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">(
		"newest"
	);

	// Filter links based on active tab and filters
	const filteredLinks = useMemo(() => {
		let result = [...links];

		// Filter by tab
		if (activeTab === "favorites") {
			result = result.filter((link) => link.isFavorite);
		} else if (activeTab === "pending") {
			result = result.filter((link) => link.status === "pending");
		}

		// Filter by category
		if (selectedCategory) {
			result = result.filter((link) => link.category === selectedCategory);
		}

		// Filter by tags
		if (selectedTags.length > 0) {
			result = result.filter((link) =>
				selectedTags.some((tag) => link.tags.includes(tag))
			);
		}

		// Filter by search term
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			result = result.filter(
				(link) =>
					link.title.toLowerCase().includes(term) ||
					link.description.toLowerCase().includes(term) ||
					link.url.toLowerCase().includes(term) ||
					link.tags.some((tag) => tag.toLowerCase().includes(term))
			);
		}

		// Sort links
		result.sort((a, b) => {
			if (sortBy === "newest") {
				return b.createdAt.getTime() - a.createdAt.getTime();
			} else if (sortBy === "oldest") {
				return a.createdAt.getTime() - b.createdAt.getTime();
			} else {
				return a.title.localeCompare(b.title);
			}
		});

		return result;
	}, [links, activeTab, selectedCategory, selectedTags, searchTerm, sortBy]);

	// Stats for summary
	const stats = useMemo(() => {
		return {
			total: links.length,
			favorites: links.filter((link) => link.isFavorite).length,
			pending: links.filter((link) => link.status === "pending").length,
			approved: links.filter((link) => link.status === "approved").length,
			rejected: links.filter((link) => link.status === "rejected").length,
			added7Days: links.filter((link) => {
				const now = new Date();
				const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
				return link.createdAt > sevenDaysAgo;
			}).length,
		};
	}, [links]);

	// Get all unique tags from links
	const allTags = useMemo(() => {
		const tagSet = new Set<string>();
		links.forEach((link) => {
			link.tags.forEach((tag) => tagSet.add(tag));
		});
		return Array.from(tagSet).sort();
	}, [links]);

	return (
		<div className="container mx-auto">
			<div className="mb-8">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
					<div>
						<h1
							className={`text-2xl font-bold ${
								theme === "light" ? "text-gray-800" : "text-white"
							}`}
						>
							Link Repository
						</h1>
						<p
							className={`${
								theme === "light" ? "text-gray-600" : "text-gray-300"
							}`}
						>
							Manage and organize your team's knowledge base
						</p>
					</div>

					<div className="mt-4 md:mt-0 flex space-x-2">
						<button
							onClick={() => setIsAddLinkModalOpen(true)}
							className={`flex items-center px-4 py-2 rounded-lg font-medium ${
								theme === "light"
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "bg-blue-500 text-white hover:bg-blue-600"
							} transition-colors duration-200`}
						>
							<i className="fas fa-plus mr-2"></i>
							Add New Link
						</button>

						<button
							className={`flex items-center px-4 py-2 rounded-lg font-medium ${
								theme === "light"
									? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
									: "bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600"
							} transition-colors duration-200`}
						>
							<i className="fas fa-download mr-2"></i>
							Export
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<StatsCard
						icon="fa-link"
						title="Total Links"
						value={stats.total}
						change="+12% from last month"
						color="blue"
					/>
					<StatsCard
						icon="fa-star"
						title="Favorites"
						value={stats.favorites}
						change="+5% from last month"
						color="yellow"
					/>
					<StatsCard
						icon="fa-clock"
						title="Pending Approval"
						value={stats.pending}
						change="-2% from last month"
						color="orange"
					/>
					<StatsCard
						icon="fa-calendar-alt"
						title="Added in 7 days"
						value={stats.added7Days}
						change="+18% from last week"
						color="green"
					/>
				</div>
			</div>

			<div
				className={`rounded-xl overflow-hidden ${
					theme === "light"
						? "bg-white border border-gray-200 shadow-md"
						: "bg-gray-800/80 backdrop-blur-sm border border-gray-700"
				} transition-colors duration-300`}
			>
				<div className="p-4">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
						<div className="flex flex-wrap items-center space-x-2">
							<button
								onClick={() => setActiveTab("all")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
									activeTab === "all"
										? theme === "light"
											? "bg-blue-100 text-blue-800"
											: "bg-blue-900/40 text-blue-300"
										: theme === "light"
										? "bg-gray-100 text-gray-700 hover:bg-gray-200"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								}`}
							>
								All Links
							</button>

							<button
								onClick={() => setActiveTab("favorites")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
									activeTab === "favorites"
										? theme === "light"
											? "bg-blue-100 text-blue-800"
											: "bg-blue-900/40 text-blue-300"
										: theme === "light"
										? "bg-gray-100 text-gray-700 hover:bg-gray-200"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								}`}
							>
								<i className="fas fa-star mr-2"></i>
								Favorites
							</button>

							<button
								onClick={() => setActiveTab("pending")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
									activeTab === "pending"
										? theme === "light"
											? "bg-blue-100 text-blue-800"
											: "bg-blue-900/40 text-blue-300"
										: theme === "light"
										? "bg-gray-100 text-gray-700 hover:bg-gray-200"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								}`}
							>
								<i className="fas fa-clock mr-2"></i>
								Pending
							</button>
						</div>

						<div className="flex items-center space-x-2">
							<div className="relative">
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value as any)}
									className={`appearance-none pl-3 pr-8 py-2 rounded-lg ${
										theme === "light"
											? "bg-gray-100 text-gray-700 border-gray-300 focus:border-blue-500"
											: "bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-400"
									} border focus:outline-none focus:ring-2 ${
										theme === "light"
											? "focus:ring-blue-300/50"
											: "focus:ring-blue-600/50"
									} transition-colors duration-200`}
								>
									<option value="newest">Newest First</option>
									<option value="oldest">Oldest First</option>
									<option value="alphabetical">Alphabetical</option>
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
									<i
										className={`fas fa-chevron-down ${
											theme === "light" ? "text-gray-500" : "text-gray-400"
										}`}
									></i>
								</div>
							</div>

							<div className="flex border rounded-lg overflow-hidden">
								<button
									onClick={() => setViewMode("grid")}
									className={`p-2 ${
										viewMode === "grid"
											? theme === "light"
												? "bg-blue-100 text-blue-800"
												: "bg-blue-900/40 text-blue-300"
											: theme === "light"
											? "bg-gray-100 text-gray-600 hover:bg-gray-200"
											: "bg-gray-700 text-gray-300 hover:bg-gray-600"
									} ${
										theme === "light"
											? "border-r border-gray-300"
											: "border-r border-gray-600"
									} transition-colors duration-200`}
								>
									<i className="fas fa-th-large"></i>
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`p-2 ${
										viewMode === "list"
											? theme === "light"
												? "bg-blue-100 text-blue-800"
												: "bg-blue-900/40 text-blue-300"
											: theme === "light"
											? "bg-gray-100 text-gray-600 hover:bg-gray-200"
											: "bg-gray-700 text-gray-300 hover:bg-gray-600"
									} transition-colors duration-200`}
								>
									<i className="fas fa-list"></i>
								</button>
							</div>
						</div>
					</div>

					<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
						<div
							className={`relative flex-grow ${
								theme === "light" ? "text-gray-600" : "text-gray-300"
							}`}
						>
							<span className="absolute inset-y-0 left-0 flex items-center pl-3">
								<i className="fas fa-search"></i>
							</span>
							<input
								type="search"
								placeholder="Filter links by title, description, URL, or tags..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`w-full py-2 pl-10 pr-4 rounded-lg ${
									theme === "light"
										? "bg-gray-100 border-gray-300 placeholder-gray-500 focus:bg-white"
										: "bg-gray-700 border-gray-600 placeholder-gray-400 focus:bg-gray-600"
								} border focus:outline-none focus:ring-2 ${
									theme === "light"
										? "focus:ring-blue-300/50"
										: "focus:ring-blue-600/50"
								} transition-colors duration-200`}
							/>
						</div>

						<div className="relative md:w-48">
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className={`appearance-none w-full pl-3 pr-8 py-2 rounded-lg ${
									theme === "light"
										? "bg-gray-100 text-gray-700 border-gray-300 focus:border-blue-500"
										: "bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-400"
								} border focus:outline-none focus:ring-2 ${
									theme === "light"
										? "focus:ring-blue-300/50"
										: "focus:ring-blue-600/50"
								} transition-colors duration-200`}
							>
								<option value="">All Categories</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<i
									className={`fas fa-chevron-down ${
										theme === "light" ? "text-gray-500" : "text-gray-400"
									}`}
								></i>
							</div>
						</div>

						<button
							onClick={() => {
								setSelectedCategory("");
								setSelectedTags([]);
								setSearchTerm("");
								setSortBy("newest");
							}}
							className={`px-4 py-2 rounded-lg font-medium ${
								theme === "light"
									? "bg-gray-100 text-gray-700 hover:bg-gray-200"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							} transition-colors duration-200`}
						>
							<i className="fas fa-times mr-2"></i>
							Clear Filters
						</button>
					</div>

					{selectedTags.length > 0 || selectedCategory ? (
						<div className="flex flex-wrap items-center gap-2 mb-6">
							<span
								className={`text-sm ${
									theme === "light" ? "text-gray-600" : "text-gray-400"
								}`}
							>
								Active filters:
							</span>

							{selectedCategory && (
								<span
									className={`flex items-center px-3 py-1 rounded-full text-sm ${
										theme === "light"
											? "bg-blue-100 text-blue-800"
											: "bg-blue-900/40 text-blue-300"
									}`}
								>
									<span>
										Category:{" "}
										{categories.find((c) => c.id === selectedCategory)?.name}
									</span>
									<button
										onClick={() => setSelectedCategory("")}
										className="ml-2 text-opacity-70 hover:text-opacity-100"
									>
										<i className="fas fa-times"></i>
									</button>
								</span>
							)}

							{selectedTags.map((tag) => (
								<span
									key={tag}
									className={`flex items-center px-3 py-1 rounded-full text-sm ${
										theme === "light"
											? "bg-green-100 text-green-800"
											: "bg-green-900/40 text-green-300"
									}`}
								>
									<span>#{tag}</span>
									<button
										onClick={() =>
											setSelectedTags((prev) => prev.filter((t) => t !== tag))
										}
										className="ml-2 text-opacity-70 hover:text-opacity-100"
									>
										<i className="fas fa-times"></i>
									</button>
								</span>
							))}
						</div>
					) : null}

					<div className="flex flex-wrap gap-2 mb-6">
						{allTags.slice(0, 10).map((tag) => (
							<button
								key={tag}
								onClick={() => {
									if (selectedTags.includes(tag)) {
										setSelectedTags((prev) => prev.filter((t) => t !== tag));
									} else {
										setSelectedTags((prev) => [...prev, tag]);
									}
								}}
								className={`px-3 py-1 rounded-full text-sm ${
									selectedTags.includes(tag)
										? theme === "light"
											? "bg-green-100 text-green-800"
											: "bg-green-900/40 text-green-300"
										: theme === "light"
										? "bg-gray-100 text-gray-700 hover:bg-gray-200"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								} transition-colors duration-200`}
							>
								#{tag}
							</button>
						))}

						{allTags.length > 10 && (
							<button
								className={`px-3 py-1 rounded-full text-sm ${
									theme === "light"
										? "bg-gray-100 text-gray-700 hover:bg-gray-200"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								} transition-colors duration-200`}
							>
								+{allTags.length - 10} more
							</button>
						)}
					</div>

					{filteredLinks.length === 0 ? (
						<div
							className={`flex flex-col items-center justify-center p-8 ${
								theme === "light" ? "text-gray-500" : "text-gray-400"
							}`}
						>
							<i className="fas fa-search text-5xl mb-4 opacity-30"></i>
							<h3 className="text-xl font-medium mb-2">No links found</h3>
							<p className="text-center max-w-md">
								No links match your current filters. Try adjusting your search
								criteria or clearing the filters.
							</p>
						</div>
					) : viewMode === "grid" ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredLinks.map((link) => (
								<LinkCard key={link.id} link={link} />
							))}
						</div>
					) : (
						<div className="divide-y divide-gray-200 dark:divide-gray-700">
							{filteredLinks.map((link) => (
								<LinkListItem key={link.id} link={link} />
							))}
						</div>
					)}
				</div>

				<div
					className={`flex items-center justify-between px-4 py-3 ${
						theme === "light"
							? "bg-gray-50 border-t border-gray-200"
							: "bg-gray-800 border-t border-gray-700"
					}`}
				>
					<div
						className={`text-sm ${
							theme === "light" ? "text-gray-600" : "text-gray-400"
						}`}
					>
						Showing <span className="font-medium">{filteredLinks.length}</span>{" "}
						of <span className="font-medium">{links.length}</span> links
					</div>

					<div className="flex items-center space-x-2">
						<button
							className={`px-3 py-1 rounded-md ${
								theme === "light"
									? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									: "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
							} transition-colors duration-200`}
							disabled
						>
							<i className="fas fa-chevron-left"></i>
						</button>

						<button
							className={`px-3 py-1 rounded-md ${
								theme === "light"
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "bg-blue-500 text-white hover:bg-blue-600"
							} transition-colors duration-200`}
						>
							1
						</button>

						<button
							className={`px-3 py-1 rounded-md ${
								theme === "light"
									? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
									: "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
							} transition-colors duration-200`}
						>
							2
						</button>

						<button
							className={`px-3 py-1 rounded-md ${
								theme === "light"
									? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
									: "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
							} transition-colors duration-200`}
						>
							<i className="fas fa-chevron-right"></i>
						</button>
					</div>
				</div>
			</div>

			{isAddLinkModalOpen && (
				<AddLinkModal onClose={() => setIsAddLinkModalOpen(false)} />
			)}
		</div>
	);
};

// Stats Card Component
type StatsCardProps = {
	icon: string;
	title: string;
	value: number;
	change: string;
	color: "blue" | "green" | "yellow" | "orange" | "red" | "purple";
};

const StatsCard: React.FC<StatsCardProps> = ({
	icon,
	title,
	value,
	change,
	color,
}) => {
	const { theme } = useAppContext();

	const getColorClasses = () => {
		const baseClasses = `absolute top-0 right-0 w-16 h-16 rounded-bl-xl flex items-center justify-center`;

		if (theme === "light") {
			switch (color) {
				case "blue":
					return `${baseClasses} bg-blue-100 text-blue-600`;
				case "green":
					return `${baseClasses} bg-green-100 text-green-600`;
				case "yellow":
					return `${baseClasses} bg-yellow-100 text-yellow-600`;
				case "orange":
					return `${baseClasses} bg-orange-100 text-orange-600`;
				case "red":
					return `${baseClasses} bg-red-100 text-red-600`;
				case "purple":
					return `${baseClasses} bg-purple-100 text-purple-600`;
				default:
					return `${baseClasses} bg-blue-100 text-blue-600`;
			}
		} else {
			switch (color) {
				case "blue":
					return `${baseClasses} bg-blue-900/40 text-blue-400`;
				case "green":
					return `${baseClasses} bg-green-900/40 text-green-400`;
				case "yellow":
					return `${baseClasses} bg-yellow-900/40 text-yellow-400`;
				case "orange":
					return `${baseClasses} bg-orange-900/40 text-orange-400`;
				case "red":
					return `${baseClasses} bg-red-900/40 text-red-400`;
				case "purple":
					return `${baseClasses} bg-purple-900/40 text-purple-400`;
				default:
					return `${baseClasses} bg-blue-900/40 text-blue-400`;
			}
		}
	};

	const getChangeColorClasses = () => {
		if (change.startsWith("+")) {
			return theme === "light" ? "text-green-600" : "text-green-400";
		} else if (change.startsWith("-")) {
			return theme === "light" ? "text-red-600" : "text-red-400";
		} else {
			return theme === "light" ? "text-gray-600" : "text-gray-400";
		}
	};

	return (
		<div
			className={`relative rounded-xl overflow-hidden ${
				theme === "light"
					? "bg-white border border-gray-200 shadow-sm hover:shadow-md"
					: "bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-800"
			} p-4 transition-all duration-300`}
		>
			<div className={getColorClasses()}>
				<i className={`fas ${icon} text-xl`}></i>
			</div>

			<h3
				className={`text-sm font-medium ${
					theme === "light" ? "text-gray-500" : "text-gray-400"
				} mb-1`}
			>
				{title}
			</h3>

			<div className="mt-4">
				<p
					className={`text-3xl font-bold ${
						theme === "light" ? "text-gray-800" : "text-white"
					}`}
				>
					{value}
				</p>

				<p className={`text-sm mt-2 ${getChangeColorClasses()}`}>{change}</p>
			</div>
		</div>
	);
};

// Link Card Component
const LinkCard: React.FC<{ link: Link }> = ({ link }) => {
	const { theme, categories, toggleFavorite, approveLink, rejectLink, user } =
		useAppContext();
	const [showActions, setShowActions] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [showAISuggestions, setShowAISuggestions] = useState(false);

	const category = categories.find((c) => c.id === link.category);
	const formattedDate = link.createdAt.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const getStatusBadge = () => {
		switch (link.status) {
			case "approved":
				return (
					<span
						className={`px-2 py-0.5 text-xs rounded-full ${
							theme === "light"
								? "bg-green-100 text-green-800"
								: "bg-green-900/40 text-green-300"
						}`}
					>
						Approved
					</span>
				);
			case "pending":
				return (
					<span
						className={`px-2 py-0.5 text-xs rounded-full ${
							theme === "light"
								? "bg-yellow-100 text-yellow-800"
								: "bg-yellow-900/40 text-yellow-300"
						}`}
					>
						Pending
					</span>
				);
			case "rejected":
				return (
					<span
						className={`px-2 py-0.5 text-xs rounded-full ${
							theme === "light"
								? "bg-red-100 text-red-800"
								: "bg-red-900/40 text-red-300"
						}`}
					>
						Rejected
					</span>
				);
		}
	};

	return (
		<div
			className={`relative rounded-xl overflow-hidden ${
				theme === "light"
					? "bg-white border border-gray-200 shadow-sm hover:shadow-md"
					: "bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-800"
			} transition-all duration-300`}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			<div className="p-4">
				<div className="flex items-start justify-between mb-2">
					<div
						className="rounded-full w-8 h-8 flex items-center justify-center"
						style={{
							backgroundColor:
								category?.color + (theme === "light" ? "20" : "40"),
						}}
					>
						<i
							className={`fas ${category?.icon} ${
								theme === "light" ? "text-gray-700" : "text-gray-200"
							}`}
						></i>
					</div>

					<div className="flex items-center space-x-1">
						{getStatusBadge()}

						<button
							onClick={() => toggleFavorite(link.id)}
							className={`p-1 rounded-full transition-colors duration-200 ${
								link.isFavorite
									? "text-yellow-500 hover:text-yellow-600"
									: theme === "light"
									? "text-gray-400 hover:text-gray-600"
									: "text-gray-500 hover:text-gray-300"
							}`}
						>
							<i className={`${link.isFavorite ? "fas" : "far"} fa-star`}></i>
						</button>
					</div>
				</div>

				<h3
					className={`font-bold mb-1 line-clamp-2 ${
						theme === "light" ? "text-gray-800" : "text-white"
					}`}
				>
					{link.title}
				</h3>

				<p
					className={`text-sm mb-3 line-clamp-2 ${
						theme === "light" ? "text-gray-600" : "text-gray-300"
					}`}
				>
					{link.description}
				</p>

				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					className={`text-sm mb-3 block truncate ${
						theme === "light"
							? "text-blue-600 hover:text-blue-800"
							: "text-blue-400 hover:text-blue-300"
					}`}
				>
					{link.url}
				</a>

				<div className="flex flex-wrap gap-1 mb-3">
					{link.tags.slice(0, 3).map((tag) => (
						<span
							key={tag}
							className={`px-2 py-0.5 rounded-full text-xs ${
								theme === "light"
									? "bg-gray-100 text-gray-700"
									: "bg-gray-700 text-gray-300"
							}`}
						>
							#{tag}
						</span>
					))}
					{link.tags.length > 3 && (
						<span
							className={`px-2 py-0.5 rounded-full text-xs ${
								theme === "light"
									? "bg-gray-100 text-gray-700"
									: "bg-gray-700 text-gray-300"
							}`}
						>
							+{link.tags.length - 3}
						</span>
					)}
				</div>

				<div
					className={`flex items-center justify-between text-xs ${
						theme === "light" ? "text-gray-500" : "text-gray-400"
					}`}
				>
					<span>Added on {formattedDate}</span>

					<div className="flex items-center space-x-2">
						<button
							onClick={() => setShowComments(!showComments)}
							className="flex items-center hover:underline"
						>
							<i className="fas fa-comment mr-1"></i>
							{link.comments.length}
						</button>

						<button
							onClick={() => setShowHistory(!showHistory)}
							className="flex items-center hover:underline"
						>
							<i className="fas fa-history mr-1"></i>
							{link.versions.length}
						</button>

						{link.aiSuggestions.length > 0 && (
							<button
								onClick={() => setShowAISuggestions(!showAISuggestions)}
								className="flex items-center hover:underline"
							>
								<i className="fas fa-robot mr-1"></i>
								{link.aiSuggestions.length}
							</button>
						)}
					</div>
				</div>
			</div>

			{(showComments || showHistory || showAISuggestions) && (
				<div
					className={`p-4 border-t ${
						theme === "light" ? "border-gray-200" : "border-gray-700"
					}`}
				>
					{showComments && (
						<div>
							<h4
								className={`text-sm font-bold mb-2 ${
									theme === "light" ? "text-gray-700" : "text-gray-300"
								}`}
							>
								Comments
							</h4>

							{link.comments.length === 0 ? (
								<p
									className={`text-sm ${
										theme === "light" ? "text-gray-500" : "text-gray-400"
									}`}
								>
									No comments yet. Be the first to comment!
								</p>
							) : (
								<div className="space-y-3">
									{link.comments.map((comment) => (
										<CommentItem
											key={comment.id}
											comment={comment}
											linkId={link.id}
										/>
									))}
								</div>
							)}

							<div className="mt-3">
								<CommentForm linkId={link.id} />
							</div>
						</div>
					)}

					{showHistory && (
						<div>
							<h4
								className={`text-sm font-bold mb-2 ${
									theme === "light" ? "text-gray-700" : "text-gray-300"
								}`}
							>
								Version History
							</h4>

							{link.versions.length === 0 ? (
								<p
									className={`text-sm ${
										theme === "light" ? "text-gray-500" : "text-gray-400"
									}`}
								>
									No changes have been made to this link yet.
								</p>
							) : (
								<div className="space-y-2">
									{link.versions.map((version) => (
										<div
											key={version.id}
											className={`text-sm p-2 rounded ${
												theme === "light" ? "bg-gray-100" : "bg-gray-700"
											}`}
										>
											<div className="flex items-center justify-between mb-1">
												<span
													className={`font-medium ${
														theme === "light"
															? "text-gray-700"
															: "text-gray-300"
													}`}
												>
													{version.updatedAt.toLocaleDateString("en-US", {
														year: "numeric",
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
											<p
												className={
													theme === "light" ? "text-gray-600" : "text-gray-400"
												}
											>
												{version.changeDescription}
											</p>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{showAISuggestions && (
						<div>
							<h4
								className={`text-sm font-bold mb-2 ${
									theme === "light" ? "text-gray-700" : "text-gray-300"
								}`}
							>
								AI Suggestions
							</h4>

							<div className="space-y-2">
								{link.aiSuggestions.map((suggestion) => (
									<div
										key={suggestion.id}
										className={`text-sm p-2 rounded ${
											suggestion.isApplied
												? theme === "light"
													? "bg-green-100"
													: "bg-green-900/30"
												: theme === "light"
												? "bg-blue-50"
												: "bg-blue-900/30"
										}`}
									>
										<div className="flex items-center justify-between mb-1">
											<span
												className={`font-medium ${
													suggestion.isApplied
														? theme === "light"
															? "text-green-700"
															: "text-green-300"
														: theme === "light"
														? "text-blue-700"
														: "text-blue-300"
												}`}
											>
												{suggestion.type === "category" && "Suggested Category"}
												{suggestion.type === "tag" && "Suggested Tag"}
												{suggestion.type === "similar" && "Similar Resource"}
												{suggestion.type === "description" &&
													"Description Enhancement"}
											</span>

											<span
												className={`text-xs ${
													suggestion.isApplied
														? theme === "light"
															? "text-green-600"
															: "text-green-400"
														: theme === "light"
														? "text-blue-600"
														: "text-blue-400"
												}`}
											>
												{suggestion.isApplied
													? "Applied"
													: `${Math.round(
															suggestion.confidence * 100
													  )}% confidence`}
											</span>
										</div>

										<p
											className={`${
												suggestion.isApplied
													? theme === "light"
														? "text-green-600"
														: "text-green-400"
													: theme === "light"
													? "text-blue-600"
													: "text-blue-400"
											}`}
										>
											{suggestion.content}
										</p>

										{!suggestion.isApplied && (
											<div className="mt-2 flex space-x-2">
												<button
													className={`px-2 py-1 text-xs rounded ${
														theme === "light"
															? "bg-blue-100 text-blue-700 hover:bg-blue-200"
															: "bg-blue-900/50 text-blue-300 hover:bg-blue-800"
													} transition-colors duration-200`}
												>
													Apply
												</button>

												<button
													className={`px-2 py-1 text-xs rounded ${
														theme === "light"
															? "bg-gray-100 text-gray-700 hover:bg-gray-200"
															: "bg-gray-700 text-gray-300 hover:bg-gray-600"
													} transition-colors duration-200`}
												>
													Dismiss
												</button>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{showActions && user.role !== "viewer" && (
				<div
					className={`absolute top-0 right-0 p-2 space-x-1 rounded-bl-lg ${
						theme === "light" ? "bg-white/90" : "bg-gray-800/90"
					} backdrop-blur-sm shadow-sm`}
				>
					<button
						className={`p-1 rounded-full ${
							theme === "light"
								? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
								: "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
						} transition-colors duration-200`}
					>
						<i className="fas fa-edit"></i>
					</button>

					{link.status === "pending" && user.role === "admin" && (
						<>
							<button
								onClick={() => approveLink(link.id)}
								className={`p-1 rounded-full ${
									theme === "light"
										? "text-green-500 hover:text-green-700 hover:bg-green-100"
										: "text-green-400 hover:text-green-300 hover:bg-green-900/30"
								} transition-colors duration-200`}
							>
								<i className="fas fa-check"></i>
							</button>

							<button
								onClick={() => rejectLink(link.id)}
								className={`p-1 rounded-full ${
									theme === "light"
										? "text-red-500 hover:text-red-700 hover:bg-red-100"
										: "text-red-400 hover:text-red-300 hover:bg-red-900/30"
								} transition-colors duration-200`}
							>
								<i className="fas fa-times"></i>
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
};

// Link List Item Component
const LinkListItem: React.FC<{ link: Link }> = ({ link }) => {
	const { theme, categories, toggleFavorite, approveLink, rejectLink, user } =
		useAppContext();
	const [showActions, setShowActions] = useState(false);

	const category = categories.find((c) => c.id === link.category);
	const formattedDate = link.createdAt.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const getStatusBadge = () => {
		switch (link.status) {
			case "approved":
				return (
					<span
						className={`px-2 py-0.5 text-xs rounded-full ${
							theme === "light"
								? "bg-green-100 text-green-800"
								: "bg-green-900/40 text-green-300"
						}`}
					>
						Approved
					</span>
				);
			case "pending":
				return (
					<span
						className={`px-2 py-0.5 text-xs rounded-full ${
							theme === "light"
								? "bg-yellow-100 text-yellow-800"
								: "bg-yellow-900/40 text-yellow-300"
						}`}
					>
						Pending
					</span>
				);
			case "rejected":
				return (
					<span
						className={`px-2 py-0.5 text-xs rounded-full ${
							theme === "light"
								? "bg-red-100 text-red-800"
								: "bg-red-900/40 text-red-300"
						}`}
					>
						Rejected
					</span>
				);
		}
	};

	return (
		<div
			className={`py-4 ${
				theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-800"
			} transition-colors duration-200`}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			<div className="flex items-start">
				<div
					className="rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"
					style={{
						backgroundColor:
							category?.color + (theme === "light" ? "20" : "40"),
					}}
				>
					<i
						className={`fas ${category?.icon} ${
							theme === "light" ? "text-gray-700" : "text-gray-200"
						}`}
					></i>
				</div>

				<div className="ml-3 flex-grow">
					<div className="flex items-start justify-between">
						<div>
							<h3
								className={`font-bold ${
									theme === "light" ? "text-gray-800" : "text-white"
								}`}
							>
								{link.title}
							</h3>

							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className={`text-sm block truncate mb-1 ${
									theme === "light"
										? "text-blue-600 hover:text-blue-800"
										: "text-blue-400 hover:text-blue-300"
								}`}
							>
								{link.url}
							</a>
						</div>

						<div className="flex items-center space-x-2">
							{getStatusBadge()}

							<button
								onClick={() => toggleFavorite(link.id)}
								className={`p-1 rounded-full transition-colors duration-200 ${
									link.isFavorite
										? "text-yellow-500 hover:text-yellow-600"
										: theme === "light"
										? "text-gray-400 hover:text-gray-600"
										: "text-gray-500 hover:text-gray-300"
								}`}
							>
								<i className={`${link.isFavorite ? "fas" : "far"} fa-star`}></i>
							</button>

							{showActions && user.role !== "viewer" && (
								<div className="flex space-x-1">
									<button
										className={`p-1 rounded-full ${
											theme === "light"
												? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
												: "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
										} transition-colors duration-200`}
									>
										<i className="fas fa-edit"></i>
									</button>

									{link.status === "pending" && user.role === "admin" && (
										<>
											<button
												onClick={() => approveLink(link.id)}
												className={`p-1 rounded-full ${
													theme === "light"
														? "text-green-500 hover:text-green-700 hover:bg-green-100"
														: "text-green-400 hover:text-green-300 hover:bg-green-900/30"
												} transition-colors duration-200`}
											>
												<i className="fas fa-check"></i>
											</button>

											<button
												onClick={() => rejectLink(link.id)}
												className={`p-1 rounded-full ${
													theme === "light"
														? "text-red-500 hover:text-red-700 hover:bg-red-100"
														: "text-red-400 hover:text-red-300 hover:bg-red-900/30"
												} transition-colors duration-200`}
											>
												<i className="fas fa-times"></i>
											</button>
										</>
									)}
								</div>
							)}
						</div>
					</div>

					<p
						className={`text-sm mb-2 line-clamp-2 ${
							theme === "light" ? "text-gray-600" : "text-gray-300"
						}`}
					>
						{link.description}
					</p>

					<div className="flex flex-wrap gap-1 mb-2">
						{link.tags.map((tag) => (
							<span
								key={tag}
								className={`px-2 py-0.5 rounded-full text-xs ${
									theme === "light"
										? "bg-gray-100 text-gray-700"
										: "bg-gray-700 text-gray-300"
								}`}
							>
								#{tag}
							</span>
						))}
					</div>

					<div
						className={`flex items-center text-xs ${
							theme === "light" ? "text-gray-500" : "text-gray-400"
						}`}
					>
						<span className="mr-4">Added on {formattedDate}</span>

						<div className="flex items-center space-x-4">
							<span className="flex items-center">
								<i className="fas fa-comment mr-1"></i>
								{link.comments.length} comments
							</span>

							<span className="flex items-center">
								<i className="fas fa-history mr-1"></i>
								{link.versions.length} versions
							</span>

							{link.aiSuggestions.length > 0 && (
								<span className="flex items-center">
									<i className="fas fa-robot mr-1"></i>
									{link.aiSuggestions.length} AI suggestions
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Comment Item Component
const CommentItem: React.FC<{ comment: Comment; linkId: string }> = ({
	comment,
	linkId,
}) => {
	const { theme } = useAppContext();
	const [isReplying, setIsReplying] = useState(false);

	return (
		<div
			className={`p-2 rounded ${
				theme === "light" ? "bg-gray-50" : "bg-gray-750"
			}`}
		>
			<div className="flex items-start">
				<img
					src={comment.userAvatar}
					alt={comment.userName}
					className="w-6 h-6 rounded-full object-cover mr-2"
				/>

				<div className="flex-1">
					<div className="flex justify-between items-start">
						<div>
							<span
								className={`text-xs font-medium ${
									theme === "light" ? "text-gray-700" : "text-gray-300"
								}`}
							>
								{comment.userName}
							</span>
							<span
								className={`text-xs ml-2 ${
									theme === "light" ? "text-gray-500" : "text-gray-400"
								}`}
							>
								{comment.createdAt.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>

						<button
							className={`text-xs ${
								theme === "light"
									? "text-gray-500 hover:text-gray-700"
									: "text-gray-400 hover:text-gray-200"
							}`}
						>
							<i className="fas fa-ellipsis-h"></i>
						</button>
					</div>

					<p
						className={`text-sm mt-1 ${
							theme === "light" ? "text-gray-700" : "text-gray-300"
						}`}
					>
						{comment.content}
					</p>

					<div className="mt-2 flex items-center space-x-4">
						<button
							onClick={() => setIsReplying(!isReplying)}
							className={`text-xs ${
								theme === "light"
									? "text-gray-500 hover:text-gray-700"
									: "text-gray-400 hover:text-gray-200"
							}`}
						>
							{isReplying ? "Cancel" : "Reply"}
						</button>
					</div>

					{isReplying && (
						<div className="mt-2">
							<CommentForm
								linkId={linkId}
								parentId={comment.id}
								onSubmit={() => setIsReplying(false)}
							/>
						</div>
					)}

					{comment.replies.length > 0 && (
						<div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							{comment.replies.map((reply) => (
								<CommentItem key={reply.id} comment={reply} linkId={linkId} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Comment Form Component
const CommentForm: React.FC<{
	linkId: string;
	parentId?: string;
	onSubmit?: () => void;
}> = ({ linkId, parentId, onSubmit }) => {
	const { theme, user, addComment, addReply } = useAppContext();
	const [content, setContent] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (content.trim()) {
			if (parentId) {
				addReply(linkId, parentId, content);
			} else {
				addComment(linkId, content);
			}

			setContent("");
			if (onSubmit) onSubmit();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex items-start">
			<img
				src={user.avatar}
				alt={user.name}
				className="w-6 h-6 rounded-full object-cover mr-2 flex-shrink-0"
			/>

			<div className="flex-1">
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder={parentId ? "Write a reply..." : "Write a comment..."}
					className={`w-full p-2 text-sm rounded-lg resize-none ${
						theme === "light"
							? "bg-gray-100 border-gray-300 focus:border-blue-500 text-gray-700 placeholder-gray-500"
							: "bg-gray-700 border-gray-600 focus:border-blue-400 text-gray-200 placeholder-gray-400"
					} border focus:outline-none focus:ring-2 ${
						theme === "light"
							? "focus:ring-blue-300/50"
							: "focus:ring-blue-600/50"
					} transition-colors duration-200`}
					rows={2}
				/>

				<div className="flex justify-end mt-2">
					<button
						type="submit"
						disabled={!content.trim()}
						className={`px-3 py-1 rounded text-sm font-medium ${
							content.trim()
								? theme === "light"
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "bg-blue-500 text-white hover:bg-blue-600"
								: theme === "light"
								? "bg-gray-200 text-gray-500 cursor-not-allowed"
								: "bg-gray-700 text-gray-400 cursor-not-allowed"
						} transition-colors duration-200`}
					>
						{parentId ? "Reply" : "Comment"}
					</button>
				</div>
			</div>
		</form>
	);
};

// Add Link Modal Component
const AddLinkModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const { theme, categories, addLink, user } = useAppContext();
	const [url, setUrl] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [aiSuggestions, setAiSuggestions] = useState<{
		title: string;
		description: string;
		category: string;
		tags: string[];
	} | null>(null);

	// Handle backdrop click
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	// Handle URL analyze
	const handleAnalyzeUrl = () => {
		if (!url) return;

		setIsAnalyzing(true);

		// Simulate AI analysis
		setTimeout(() => {
			// This would be replaced with actual API call to analyze the URL
			const mockTitles = [
				"Understanding React Hooks: A Comprehensive Guide",
				"The Future of Web Development with TypeScript",
				"Machine Learning Fundamentals for Web Developers",
				"Building Scalable UIs with Tailwind CSS",
				"Mastering State Management in Modern React Applications",
			];

			const mockDescriptions = [
				"Learn how to use React Hooks effectively and build cleaner, more maintainable components in your applications.",
				"Explore how TypeScript is transforming web development and why it's becoming the standard for large-scale applications.",
				"A beginner-friendly introduction to machine learning concepts for web developers looking to expand their skill set.",
				"Discover how to create responsive, maintainable user interfaces using the utility-first approach of Tailwind CSS.",
				"Deep dive into advanced state management techniques for complex React applications beyond simple useState and useReducer.",
			];

			const randomIndex = Math.floor(Math.random() * mockTitles.length);
			const suggestedTitle = mockTitles[randomIndex];
			const suggestedDescription = mockDescriptions[randomIndex];
			const suggestedCategory =
				categories[Math.floor(Math.random() * categories.length)].id;
			const suggestedTags = Array.from(
				{ length: Math.floor(Math.random() * 5) + 2 },
				() => {
					const possibleTags = [
						"react",
						"typescript",
						"javascript",
						"webdev",
						"frontend",
						"ui",
						"programming",
						"coding",
						"tutorial",
						"guide",
					];
					return possibleTags[Math.floor(Math.random() * possibleTags.length)];
				}
			).filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

			setAiSuggestions({
				title: suggestedTitle,
				description: suggestedDescription,
				category: suggestedCategory,
				tags: suggestedTags,
			});

			setIsAnalyzing(false);
		}, 1500);
	};

	// Handle tag input
	const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();

			const newTag = tagInput.trim().toLowerCase();
			if (newTag && !tags.includes(newTag)) {
				setTags([...tags, newTag]);
			}

			setTagInput("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (url && title && description && category) {
			addLink({
				url,
				title,
				description,
				category,
				tags,
				createdBy: user.id,
				updatedBy: user.id,
				status: user.role === "admin" ? "approved" : "pending",
				isFavorite: false,
			});

			onClose();
		}
	};

	// Apply AI suggestions
	const applyAiSuggestions = () => {
		if (aiSuggestions) {
			setTitle(aiSuggestions.title);
			setDescription(aiSuggestions.description);
			setCategory(aiSuggestions.category);
			setTags(aiSuggestions.tags);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			onClick={handleBackdropClick}
		>
			<div
				className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl ${
					theme === "light" ? "bg-white" : "bg-gray-800"
				} shadow-xl transition-all duration-300 transform animate-modalAppear`}
				onClick={(e) => e.stopPropagation()}
			>
				<div
					className={`flex items-center justify-between p-4 border-b ${
						theme === "light" ? "border-gray-200" : "border-gray-700"
					}`}
				>
					<h2
						className={`text-xl font-bold ${
							theme === "light" ? "text-gray-800" : "text-white"
						}`}
					>
						Add New Link
					</h2>

					<button
						onClick={onClose}
						className={`p-1 rounded-full ${
							theme === "light"
								? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
								: "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
						} transition-colors duration-200`}
					>
						<i className="fas fa-times"></i>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-4">
					<div className="mb-4">
						<label
							className={`block text-sm font-medium mb-1 ${
								theme === "light" ? "text-gray-700" : "text-gray-300"
							}`}
						>
							URL
						</label>

						<div className="flex">
							<input
								type="url"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								required
								placeholder="https://example.com/article"
								className={`flex-grow px-3 py-2 rounded-l-lg ${
									theme === "light"
										? "bg-white border-gray-300 focus:border-blue-500 text-gray-700 placeholder-gray-500"
										: "bg-gray-700 border-gray-600 focus:border-blue-400 text-gray-200 placeholder-gray-400"
								} border focus:outline-none focus:ring-2 ${
									theme === "light"
										? "focus:ring-blue-300/50"
										: "focus:ring-blue-600/50"
								} transition-colors duration-200`}
							/>

							<button
								type="button"
								onClick={handleAnalyzeUrl}
								disabled={!url || isAnalyzing}
								className={`px-4 py-2 rounded-r-lg font-medium ${
									!url || isAnalyzing
										? theme === "light"
											? "bg-gray-200 text-gray-500 cursor-not-allowed"
											: "bg-gray-700 text-gray-400 cursor-not-allowed"
										: theme === "light"
										? "bg-blue-600 text-white hover:bg-blue-700"
										: "bg-blue-500 text-white hover:bg-blue-600"
								} transition-colors duration-200`}
							>
								{isAnalyzing ? (
									<span className="flex items-center">
										<i className="fas fa-circle-notch fa-spin mr-2"></i>
										Analyzing
									</span>
								) : (
									<span className="flex items-center">
										<i className="fas fa-magic mr-2"></i>
										Analyze
									</span>
								)}
							</button>
						</div>

						<p
							className={`mt-1 text-xs ${
								theme === "light" ? "text-gray-500" : "text-gray-400"
							}`}
						>
							The AI will analyze the URL and suggest metadata
						</p>
					</div>

					{aiSuggestions && (
						<div
							className={`mb-4 p-3 rounded-lg ${
								theme === "light"
									? "bg-blue-50 border border-blue-200"
									: "bg-blue-900/20 border border-blue-800"
							}`}
						>
							<div className="flex justify-between items-start mb-2">
								<h3
									className={`text-sm font-medium ${
										theme === "light" ? "text-blue-800" : "text-blue-300"
									}`}
								>
									AI Suggestions
								</h3>

								<button
									type="button"
									onClick={applyAiSuggestions}
									className={`text-xs px-2 py-1 rounded ${
										theme === "light"
											? "bg-blue-100 text-blue-700 hover:bg-blue-200"
											: "bg-blue-800 text-blue-200 hover:bg-blue-700"
									} transition-colors duration-200`}
								>
									Apply All
								</button>
							</div>

							<div className="space-y-2 text-sm">
								<p
									className={
										theme === "light" ? "text-blue-700" : "text-blue-300"
									}
								>
									<span className="font-medium">Title:</span>{" "}
									{aiSuggestions.title}
								</p>

								<p
									className={
										theme === "light" ? "text-blue-700" : "text-blue-300"
									}
								>
									<span className="font-medium">Description:</span>{" "}
									{aiSuggestions.description.substring(0, 100)}...
								</p>

								<p
									className={
										theme === "light" ? "text-blue-700" : "text-blue-300"
									}
								>
									<span className="font-medium">Category:</span>{" "}
									{
										categories.find((c) => c.id === aiSuggestions.category)
											?.name
									}
								</p>

								<div
									className={
										theme === "light" ? "text-blue-700" : "text-blue-300"
									}
								>
									<span className="font-medium">Tags:</span>
									<div className="flex flex-wrap gap-1 mt-1">
										{aiSuggestions.tags.map((tag) => (
											<span
												key={tag}
												className={`px-2 py-0.5 rounded-full text-xs ${
													theme === "light"
														? "bg-blue-100 text-blue-800"
														: "bg-blue-800 text-blue-200"
												}`}
											>
												#{tag}
											</span>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					<div className="mb-4">
						<label
							className={`block text-sm font-medium mb-1 ${
								theme === "light" ? "text-gray-700" : "text-gray-300"
							}`}
						>
							Title
						</label>

						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							placeholder="Enter a descriptive title"
							className={`w-full px-3 py-2 rounded-lg ${
								theme === "light"
									? "bg-white border-gray-300 focus:border-blue-500 text-gray-700 placeholder-gray-500"
									: "bg-gray-700 border-gray-600 focus:border-blue-400 text-gray-200 placeholder-gray-400"
							} border focus:outline-none focus:ring-2 ${
								theme === "light"
									? "focus:ring-blue-300/50"
									: "focus:ring-blue-600/50"
							} transition-colors duration-200`}
						/>
					</div>

					<div className="mb-4">
						<label
							className={`block text-sm font-medium mb-1 ${
								theme === "light" ? "text-gray-700" : "text-gray-300"
							}`}
						>
							Description
						</label>

						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							placeholder="Provide a brief description of the link"
							rows={3}
							className={`w-full px-3 py-2 rounded-lg ${
								theme === "light"
									? "bg-white border-gray-300 focus:border-blue-500 text-gray-700 placeholder-gray-500"
									: "bg-gray-700 border-gray-600 focus:border-blue-400 text-gray-200 placeholder-gray-400"
							} border focus:outline-none focus:ring-2 ${
								theme === "light"
									? "focus:ring-blue-300/50"
									: "focus:ring-blue-600/50"
							} transition-colors duration-200`}
						/>
					</div>

					<div className="mb-4">
						<label
							className={`block text-sm font-medium mb-1 ${
								theme === "light" ? "text-gray-700" : "text-gray-300"
							}`}
						>
							Category
						</label>

						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							required
							className={`w-full px-3 py-2 rounded-lg appearance-none ${
								theme === "light"
									? "bg-white border-gray-300 focus:border-blue-500 text-gray-700"
									: "bg-gray-700 border-gray-600 focus:border-blue-400 text-gray-200"
							} border focus:outline-none focus:ring-2 ${
								theme === "light"
									? "focus:ring-blue-300/50"
									: "focus:ring-blue-600/50"
							} transition-colors duration-200`}
						>
							<option value="">Select a category</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<div className="mb-6">
						<label
							className={`block text-sm font-medium mb-1 ${
								theme === "light" ? "text-gray-700" : "text-gray-300"
							}`}
						>
							Tags
						</label>

						<div
							className={`flex flex-wrap gap-2 mb-2 p-2 rounded-lg ${
								theme === "light"
									? "bg-gray-50 border border-gray-300"
									: "bg-gray-750 border border-gray-600"
							}`}
						>
							{tags.length > 0 ? (
								tags.map((tag) => (
									<span
										key={tag}
										className={`flex items-center px-2 py-1 rounded-full text-sm ${
											theme === "light"
												? "bg-blue-100 text-blue-800"
												: "bg-blue-900/40 text-blue-300"
										}`}
									>
										#{tag}
										<button
											type="button"
											onClick={() => removeTag(tag)}
											className="ml-1 text-opacity-70 hover:text-opacity-100"
										>
											<i className="fas fa-times"></i>
										</button>
									</span>
								))
							) : (
								<span
									className={`text-sm ${
										theme === "light" ? "text-gray-500" : "text-gray-400"
									}`}
								>
									No tags added yet
								</span>
							)}
						</div>

						<div className="flex">
							<input
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={handleTagInputKeyDown}
								placeholder="Add tags (press Enter or comma to add)"
								className={`w-full px-3 py-2 rounded-lg ${
									theme === "light"
										? "bg-white border-gray-300 focus:border-blue-500 text-gray-700 placeholder-gray-500"
										: "bg-gray-700 border-gray-600 focus:border-blue-400 text-gray-200 placeholder-gray-400"
								} border focus:outline-none focus:ring-2 ${
									theme === "light"
										? "focus:ring-blue-300/50"
										: "focus:ring-blue-600/50"
								} transition-colors duration-200`}
							/>
						</div>

						<p
							className={`mt-1 text-xs ${
								theme === "light" ? "text-gray-500" : "text-gray-400"
							}`}
						>
							Add relevant tags to help categorize and find this link
						</p>
					</div>

					<div className="flex items-center justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className={`px-4 py-2 rounded-lg font-medium ${
								theme === "light"
									? "bg-gray-100 text-gray-700 hover:bg-gray-200"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							} transition-colors duration-200`}
						>
							Cancel
						</button>

						<button
							type="submit"
							className={`px-4 py-2 rounded-lg font-medium ${
								theme === "light"
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "bg-blue-500 text-white hover:bg-blue-600"
							} transition-colors duration-200`}
						>
							{user.role === "admin" ? "Add Link" : "Submit for Approval"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

// Toast Container Component
const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
	const { theme } = useAppContext();

	const getToastClasses = (type: Toast["type"]) => {
		const baseClasses =
			"p-3 rounded-lg shadow-lg flex items-start max-w-md transform transition-all duration-300";

		if (theme === "light") {
			switch (type) {
				case "success":
					return `${baseClasses} bg-green-100 text-green-800 border-l-4 border-green-500`;
				case "error":
					return `${baseClasses} bg-red-100 text-red-800 border-l-4 border-red-500`;
				case "warning":
					return `${baseClasses} bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500`;
				case "info":
					return `${baseClasses} bg-blue-100 text-blue-800 border-l-4 border-blue-500`;
				default:
					return `${baseClasses} bg-gray-100 text-gray-800 border-l-4 border-gray-500`;
			}
		} else {
			switch (type) {
				case "success":
					return `${baseClasses} bg-green-900/30 text-green-300 border-l-4 border-green-600`;
				case "error":
					return `${baseClasses} bg-red-900/30 text-red-300 border-l-4 border-red-600`;
				case "warning":
					return `${baseClasses} bg-yellow-900/30 text-yellow-300 border-l-4 border-yellow-600`;
				case "info":
					return `${baseClasses} bg-blue-900/30 text-blue-300 border-l-4 border-blue-600`;
				default:
					return `${baseClasses} bg-gray-800 text-gray-300 border-l-4 border-gray-600`;
			}
		}
	};

	const getToastIcon = (type: Toast["type"]) => {
		switch (type) {
			case "success":
				return "fa-check-circle";
			case "error":
				return "fa-exclamation-circle";
			case "warning":
				return "fa-exclamation-triangle";
			case "info":
				return "fa-info-circle";
			default:
				return "fa-bell";
		}
	};

	return (
		<div className="fixed bottom-4 right-4 z-50 space-y-2">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={getToastClasses(toast.type)}
					style={{
						animation: `fadeInUp 0.3s ease-out, fadeOut 0.3s ease-in ${
							toast.duration - 300
						}ms forwards`,
					}}
				>
					<div className="flex-shrink-0 mr-2">
						<i className={`fas ${getToastIcon(toast.type)} text-lg`}></i>
					</div>
					<div className="flex-1">{toast.message}</div>
				</div>
			))}
		</div>
	);
};

// Global styles
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .bg-gray-750 {
    background-color: #232c3d;
  }
  
  /* Responsive adaptations */
  @media (max-width: 640px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    body {
      font-size: 0.9rem;
    }
    
    .text-xl {
      font-size: 1.1rem;
    }
    
    .text-2xl {
      font-size: 1.25rem;
    }
    
    .text-3xl {
      font-size: 1.5rem;
    }
    
    .px-4 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    
    .py-2 {
      padding-top: 0.4rem;
      padding-bottom: 0.4rem;
    }
  }
  
  @media (max-width: 320px) {
    body {
      font-size: 0.85rem;
    }
    
    .container {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    
    .px-4 {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }
`;
document.head.appendChild(style);

export default LinkRepository;
