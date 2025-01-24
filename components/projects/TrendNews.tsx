"use client";

import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
	type JSX,
} from "react";
import {
	Search,
	ChevronDown,
	LogOut,
	Newspaper,
	WifiOff,
	CalendarDays,
	User,
	XCircle,
	ChevronLeft,
	ChevronRight,
	BookmarkPlus,
	Share2,
	Sun,
	Moon,
	Bookmark,
	Filter,
	Clock,
	ArrowUpDown,
	ExternalLink,
	ImageOff,
	Coffee,
	ArrowLeft,
	RefreshCw,
	Info,
	X,
	Github,
	Twitter,
	Facebook,
	Instagram,
	TrendingUp,
	Bell,
	Menu,
	Settings,
	Home,
} from "lucide-react";

// TypeScript Interfaces
interface NewsArticle {
	id: string;
	title: string;
	description: string | null;
	category: string;
	urlToImage: string | null;
	publishedAt: string;
	source: { name: string };
	url: string;
	imageLoaded?: boolean;
	imageError?: boolean;
	content?: string | null;
	isTrending?: boolean;
}

interface NewsApiResponseArticle {
	source: { id: string | null; name: string };
	author: string | null;
	title: string;
	description: string | null;
	url: string;
	urlToImage: string | null;
	publishedAt: string;
	content: string | null;
}

interface NewsApiResponse {
	status: string;
	totalResults: number;
	articles: NewsApiResponseArticle[];
}

interface ApiErrorResponse {
	message: string;
	code?: string;
	status?: number;
}

// Mock data for development
const mockApiData: NewsApiResponse = {
	status: "ok",
	totalResults: 10,
	articles: [
		{
			source: {
				id: null,
				name: "NPR",
			},
			author: "Rachel Treisman",
			title:
				"Cory Booker's Senate floor speech warning against Trump passes record 24-hour mark - NPR",
			description:
				"The New Jersey Democrat spent more than 25 hours criticizing the Trump administration's policies on immigration, education, the economy and more since 7 p.m. ET Monday. He ended his marathon speech shortly after 8 p.m. on Tuesday.",
			url: "https://www.npr.org/2025/04/01/nx-s1-5347318/cory-booker-senate-speech",
			urlToImage:
				"https://npr.brightspotcdn.com/dims3/default/strip/false/crop/2100x1181+0+108/resize/1400/quality/100/format/jpeg/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F56%2F3b%2Ffcb67afc44ebbd6ab097eec90688%2Fap25091479075476.jpg",
			publishedAt: "2025-04-02T00:07:40Z",
			content:
				"Sen. Cory Booker devoted all of Monday night and into Tuesday eveningon the Senate floor, delivering an impassioned speech in protest of the Trump administration's policies. This effort, which also i… [+9136 chars]",
		},
		{
			source: {
				id: "nbc-news",
				name: "NBC News",
			},
			author: "Bridget Bowman, Matt Dixon",
			title:
				"Republican Randy Fine wins special election for deep-red House seat in Florida - NBC News",
			description:
				"The Republican candidates have prevailed in a pair of special congressional elections in Florida Tuesday, NBC News projects, giving Republicans some more breathing room as they navigate a narrow House majority.",
			url: "https://www.nbcnews.com/politics/elections/republican-randy-fine-wins-special-election-deep-red-house-seat-florid-rcna198089",
			urlToImage:
				"https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/rockcms/2025-03/250325-randy-fine-2021-ac-1159p-725c68.jpg",
			publishedAt: "2025-04-01T23:27:55Z",
			content:
				"The Republican candidates have prevailed in a pair of special congressional elections in Florida Tuesday, NBC News projects, giving Republicans some more breathing room as they navigate a narrow Hous… [+7090 chars]",
		},
		{
			source: {
				id: null,
				name: "BBC News",
			},
			author: null,
			title: "Trump is pressing the nuclear option on tariffs - BBC",
			description:
				"The option of a 20% universal tariff is the only way to get to some of the massive revenues of trillions of dollars claimed by some of his advisers.",
			url: "https://www.bbc.com/news/articles/c99pvll3ne3o",
			urlToImage:
				"https://ichef.bbci.co.uk/news/1024/branded_news/a903/live/e04f43a0-0f40-11f0-801a-296f2b6075c3.jpg",
			publishedAt: "2025-04-01T23:02:27Z",
			content:
				"Every time Donald Trump has mentioned his plan to levy massive tariffs on imports into the US, there has been a widespread assumption that they will be delayed, watered down or rowed back.\r\nToday, he… [+2607 chars]",
		},
		{
			source: {
				id: "associated-press",
				name: "Associated Press",
			},
			author: "Carla Johnson",
			title:
				"Mass layoffs are underway at the nation's public health agencies - AP News",
			description:
				"Employees across the massive U.S. Health and Human Services Department received notices Tuesday that their jobs were being eliminated, part of a sweeping overhaul designed to vastly shrink the agencies responsible for protecting and promoting Americans' healt…",
			url: "https://apnews.com/article/health-human-services-layoffs-restructuring-rfk-jr-ec4d7731695e4204970c7eab953b2289",
			urlToImage:
				"https://dims.apnews.com/dims4/default/14e84bd/2147483647/strip/true/crop/4000x2250+0+209/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F73%2Fa5%2Fceadb3d87e46e104ca1788a1aedd%2F834d3b9d817747dda40d4a9a7dd3bd19",
			publishedAt: "2025-04-01T22:26:00Z",
			content:
				"Employees across the massive U.S. Health and Human Services Department received notices Tuesday that their jobs were being eliminated, part of a sweeping overhaul designed to vastly shrink the agenci… [+8620 chars]",
		},
		{
			source: {
				id: null,
				name: "CNBC",
			},
			author: "Sean Conlon",
			title:
				"Stock futures are little changed as Trump tariffs loom: Live updates - CNBC",
			description:
				"During Tuesday's session, the S&P 500 finished about 0.4% higher, seesawing between gains and losses throughout the chaotic trading day.",
			url: "https://www.cnbc.com/2025/04/01/stock-market-today-live-updates.html",
			urlToImage:
				"https://image.cnbcfm.com/api/v1/image/108124228-1743518085226-gettyimages-2207954605-mms12372_hfsh2vp7.jpeg?v=1743518174&w=1920&h=1080",
			publishedAt: "2025-04-01T22:05:00Z",
			content:
				"Stock futures moved higher on Tuesday evening as Wall Street braces for the expected rollout of President Donald Trump's tariffs on Wednesday.\r\nFutures tied to the S&amp;P 500 rose 0.2%, while Nasdaq… [+2208 chars]",
		},
		{
			source: {
				id: null,
				name: "New York Post",
			},
			author: "Whitney Vasquez",
			title:
				"'NYPD Blue' star Kim Delaney won't be charged for felony assault after allegedly trying to run over her husband - New York Post",
			description: "Kim and her husband are off the hook.",
			url: "https://nypost.com/2025/04/01/entertainment/kim-delaney-wont-be-charged-for-felony-assault-over-alleged-fight-with-husband/",
			urlToImage:
				"https://nypost.com/wp-content/uploads/sites/2/2025/04/101519782.jpg?quality=75&strip=all&w=1024",
			publishedAt: "2025-04-01T22:01:00Z",
			content:
				"Kim Delaney is off the hook following her arrest over an incident with her husband. \r\nThe 'NYPD Blue' alum, 63, will not be charged despite allegedly trying to mow down her significant other, James M… [+3034 chars]",
		},
	],
};

// Add additional mock articles
const additionalMockArticles = [
	{
		source: {
			id: null,
			name: "The Wall Street Journal",
		},
		author: "Jennifer Lee",
		title: "Major tech companies announce joint AI safety initiative",
		description:
			"Leading technology firms have formed an unprecedented coalition to establish ethical guidelines and safety protocols for artificial intelligence development.",
		url: "https://www.wsj.com/tech/ai/major-tech-companies-announce-joint-ai-safety-initiative-a87b54e1",
		urlToImage:
			"https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
		publishedAt: "2025-04-01T16:30:00Z",
		content:
			"In a rare show of industry-wide cooperation, major technology companies announced today the formation of a joint initiative focused on artificial intelligence safety and ethics. The coalition includes leaders from across the tech sector who have agreed to establish common standards for responsible AI development. This collaborative approach represents a significant shift in how competitive technology firms are approaching AI governance.",
	},
	{
		source: {
			id: null,
			name: "The Guardian",
		},
		author: "Sarah Johnson",
		title:
			"Global climate summit ends with historic carbon reduction agreement",
		description:
			"World leaders have signed a groundbreaking agreement to reduce carbon emissions by 60% within the next decade, setting the most ambitious climate targets in history.",
		url: "https://www.theguardian.com/environment/2025/apr/09/global-climate-summit-historic-agreement",
		urlToImage:
			"https://images.unsplash.com/photo-1569225070969-d29e804244a0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		publishedAt: "2025-04-09T18:30:00Z",
		content:
			"In what experts are calling a watershed moment for international climate policy, representatives from 195 countries have agreed to unprecedented carbon reduction targets after two weeks of intensive negotiations. The agreement, which will take effect immediately, includes provisions for financial aid to developing nations, technology sharing, and regular progress assessments. The new pact commits nations to reducing carbon emissions by 60% within the next decade – the most ambitious climate target in history.",
	},
	{
		source: {
			id: null,
			name: "CNN",
		},
		author: "Michael Rodriguez",
		title:
			"Breakthrough cancer treatment shows 90% success rate in clinical trials",
		description:
			"A revolutionary immunotherapy approach has demonstrated remarkable results against previously untreatable forms of cancer, offering new hope to millions of patients worldwide.",
		url: "https://www.cnn.com/2025/04/08/health/cancer-breakthrough-immunotherapy-trials",
		urlToImage:
			"https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		publishedAt: "2025-04-08T14:15:00Z",
		content:
			"Scientists at the National Cancer Institute have revealed promising results from a Phase III clinical trial testing a novel immunotherapy approach that targets multiple cancer variations simultaneously. Unlike conventional treatments that often become ineffective as cancer cells mutate, this new therapy appears to maintain effectiveness across various cancer types and stages. The treatment, which combines specialized antibodies with engineered immune cells, demonstrated a remarkable 90% success rate in patients with advanced forms of previously untreatable cancers.",
	},
	{
		source: {
			id: "techcrunch",
			name: "TechCrunch",
		},
		author: "Dominic-Madori Davis",
		title:
			"An accounting startup has turned tax preparations into a Pokémon Showdown game - TechCrunch",
		description:
			"Accounting software company Open Ledger has launched a new product in time for tax day. Meet PokéTax, a game that helps make tax filing quite fun.",
		url: "https://techcrunch.com/2025/04/01/an-accounting-startup-has-turned-tax-preparations-into-a-pokemon-showdown-game/",
		urlToImage:
			"https://techcrunch.com/wp-content/uploads/2025/04/OpenLedger-PokeTax.png?w=1000",
		publishedAt: "2025-04-01T20:00:00Z",
		content:
			"Accounting software company Open Ledger has launched a new product in time for tax day.\r\nMeet PokéTax, a game that helps make tax filing quite fun. Instead of tax forms, users take on Tax Trainers g… [+1543 chars]",
	},
];

// Combine all mock articles and mark trending ones
const allMockArticles = [...mockApiData.articles, ...additionalMockArticles];
const trendingArticleIndices = [0, 2, 7, 9];
mockApiData.articles = allMockArticles;
mockApiData.totalResults = allMockArticles.length;

// API key configuration
const API_KEY = "YOUR_API_KEY";
const IS_API_KEY_CONFIGURED = API_KEY !== "YOUR_API_KEY";

// Date formatting utilities
const formatDate = (dateString: string | undefined | null): string => {
	if (!dateString || dateString === "Date Unavailable")
		return "Date Unavailable";
	try {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) {
			console.warn(
				"Invalid date string encountered for long format:",
				dateString
			);
			return "Date Unavailable";
		}
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	} catch (e) {
		console.error("Error parsing date:", dateString, e);
		return "Date Unavailable";
	}
};

const formatShortDate = (dateString: string | undefined | null): string => {
	if (!dateString || dateString === "Date Unavailable") return "N/A";
	try {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) {
			console.warn("Invalid date string for short format:", dateString);
			return "N/A";
		}
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	} catch (e) {
		console.error("Error parsing short date:", dateString, e);
		return "N/A";
	}
};

const getTimeAgo = (dateString: string): string => {
	try {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "";

		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.round(diffMs / 60000);

		if (diffMins < 60) {
			return `${diffMins}m ago`;
		} else if (diffMins < 1440) {
			return `${Math.floor(diffMins / 60)}h ago`;
		} else {
			return `${Math.floor(diffMins / 1440)}d ago`;
		}
	} catch (e) {
		return "";
	}
};

// Main NewsHub Component
const NewsHub: React.FC = () => {
	// Mobile viewport handling
	useEffect(() => {
		if (typeof document !== "undefined") {
			let viewportMeta = document.querySelector('meta[name="viewport"]');
			if (!viewportMeta) {
				viewportMeta = document.createElement("meta");
				viewportMeta.name = "viewport";
				document.head.appendChild(viewportMeta);
			}
			viewportMeta.content =
				"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
		}
	}, []);

	// State
	const [news, setNews] = useState<NewsArticle[]>([]);
	const [totalResults, setTotalResults] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
	const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
		null
	);
	const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
	const [favorites, setFavorites] = useState<string[]>(() => {
		const saved =
			typeof window !== "undefined"
				? localStorage.getItem("newshub-favorites")
				: null;
		return saved ? JSON.parse(saved) : [];
	});
	const [readingHistory, setReadingHistory] = useState<string[]>(() => {
		const saved =
			typeof window !== "undefined"
				? localStorage.getItem("newshub-history")
				: null;
		return saved ? JSON.parse(saved) : [];
	});
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("newshub-theme");
			if (saved !== null) {
				return JSON.parse(saved) === "dark";
			}
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return false;
	});
	const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
	const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
	const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
	const [readLater, setReadLater] = useState<string[]>(() => {
		const saved =
			typeof window !== "undefined"
				? localStorage.getItem("newshub-readlater")
				: null;
		return saved ? JSON.parse(saved) : [];
	});

	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error" | "info";
	} | null>(null);

	const [imageTimeouts, setImageTimeouts] = useState<{
		[key: string]: NodeJS.Timeout;
	}>({});
	const [categoryMenuOpen, setCategoryMenuOpen] = useState<boolean>(false);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [showIntro, setShowIntro] = useState<boolean>(true);
	const [showTrendingOnly, setShowTrendingOnly] = useState<boolean>(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

	// Refs
	const filterMenuRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const categoryMenuRef = useRef<HTMLDivElement>(null);
	const articleModalRef = useRef<HTMLDivElement>(null);
	const aboutModalRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const userDropdownRef = useRef<HTMLDivElement>(null);

	const ARTICLES_PER_PAGE = 12;

	// Handle body overflow for modals
	useEffect(() => {
		if (isArticleModalOpen || isAboutModalOpen || mobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		// Cleanup to reset overflow when component unmounts
		return () => {
			document.body.style.overflow = "";
		};
	}, [isArticleModalOpen, isAboutModalOpen, mobileMenuOpen]);

	// Toast management
	useEffect(() => {
		if (toast) {
			const timer = setTimeout(() => {
				setToast(null);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [toast]);

	// Available categories
	const categories = useMemo(() => {
		return [
			"All",
			"Politics",
			"Business",
			"Technology",
			"Health",
			"Entertainment",
			"Sports",
			"World",
			"General",
		];
	}, []);

	// Map source names to categories
	const mapSourceToCategory = useCallback(
		(sourceName: string | undefined): string => {
			if (!sourceName) return "General";
			const lowerSourceName = sourceName.toLowerCase();

			if (
				/\b(npr|nbc news|ap news|associated press|politico|cnn|msnbc)\b/i.test(
					lowerSourceName
				)
			)
				return "Politics";

			if (
				/\b(cnbc|bloomberg|wall street journal|wsj|financial times|ft|reuters|forbes|business insider|marketwatch|barron's)\b/i.test(
					lowerSourceName
				)
			)
				return "Business";

			if (
				/\b(techcrunch|the verge|wired|ars technica|gizmodo|engadget|cnet|mit tech review|hackernoon)\b/i.test(
					lowerSourceName
				)
			)
				return "Technology";

			if (
				/\b(health|medical news today|stat news|webmd|nih|mayo clinic|thelancet)\b/i.test(
					lowerSourceName
				) ||
				lowerSourceName.includes("ap news")
			)
				return "Health";

			if (
				/\b(sport|espn|bleacher report|bbc sport|skysports|cbssports|nbcsports)\b/i.test(
					lowerSourceName
				)
			)
				return "Sports";

			if (
				/\b(entertainment weekly|ew|hollywood reporter|variety|tmz|e! news|rolling stone|billboard|new york post|nypost)\b/i.test(
					lowerSourceName
				)
			)
				return "Entertainment";

			if (
				/\b(bbc news|reuters|al jazeera|associated press|guardian)\b/i.test(
					lowerSourceName
				)
			)
				return "World";

			return "General";
		},
		[]
	);

	// Toast helper function
	const showToast = useCallback(
		(message: string, type: "success" | "error" | "info" = "info") => {
			setToast({ message, type });
		},
		[]
	);

	// Toggle dark mode
	const toggleDarkMode = useCallback(() => {
		setIsDarkMode((prev) => {
			const newMode = !prev;
			if (typeof window !== "undefined") {
				localStorage.setItem(
					"newshub-theme",
					JSON.stringify(newMode ? "dark" : "light")
				);
			}
			return newMode;
		});
	}, []);

	// Toggle favorites
	const toggleFavorite = useCallback(
		(articleId: string, e?: React.MouseEvent) => {
			if (e) e.stopPropagation();
			setFavorites((prev) => {
				const isFavorite = prev.includes(articleId);
				const newFavorites = isFavorite
					? prev.filter((id) => id !== articleId)
					: [...prev, articleId];
				if (typeof window !== "undefined")
					localStorage.setItem(
						"newshub-favorites",
						JSON.stringify(newFavorites)
					);
				showToast(
					isFavorite ? "Removed from favorites" : "Added to favorites",
					"success"
				);
				return newFavorites;
			});
		},
		[showToast]
	);

	// Toggle read later
	const toggleReadLater = useCallback(
		(articleId: string, e?: React.MouseEvent) => {
			if (e) e.stopPropagation();
			setReadLater((prev) => {
				const isReadLater = prev.includes(articleId);
				const newReadLater = isReadLater
					? prev.filter((id) => id !== articleId)
					: [...prev, articleId];
				if (typeof window !== "undefined")
					localStorage.setItem(
						"newshub-readlater",
						JSON.stringify(newReadLater)
					);
				showToast(
					isReadLater ? "Removed from read later" : "Added to read later",
					"success"
				);
				return newReadLater;
			});
		},
		[showToast]
	);

	// Add to reading history
	const addToReadingHistory = useCallback((articleId: string) => {
		setReadingHistory((prev) => {
			if (prev[0] === articleId) return prev;
			const updatedHistory = [
				articleId,
				...prev.filter((id) => id !== articleId),
			].slice(0, 20);
			if (typeof window !== "undefined")
				localStorage.setItem("newshub-history", JSON.stringify(updatedHistory));
			return updatedHistory;
		});
	}, []);

	// Share article
	const shareArticle = useCallback(
		async (article: NewsArticle, e?: React.MouseEvent) => {
			if (e) e.stopPropagation();
			try {
				if (navigator.share) {
					await navigator.share({
						title: article.title,
						text: article.description || article.title,
						url: article.url,
					});
					showToast("Shared successfully!", "success");
				} else if (navigator.clipboard) {
					await navigator.clipboard.writeText(article.url);
					showToast("Link copied to clipboard!", "success");
				} else {
					showToast("Sharing not supported on this browser.", "error");
				}
			} catch (err: any) {
				if (err.name === "AbortError") {
					console.log("Share canceled by user");
					showToast("Share canceled", "info");
				} else {
					console.error("Share failed:", err);
					showToast("Failed to share article.", "error");
				}
			}
		},
		[showToast]
	);

	// Modal handlers
	const openArticleModal = useCallback(
		(article: NewsArticle) => {
			setSelectedArticle(article);
			setIsArticleModalOpen(true);
			addToReadingHistory(article.id);
		},
		[addToReadingHistory]
	);

	const closeArticleModal = useCallback(() => {
		setIsArticleModalOpen(false);
		setSelectedArticle(null);
	}, []);

	const openAboutModal = useCallback(() => {
		setIsAboutModalOpen(true);
	}, []);

	const closeAboutModal = useCallback(() => {
		setIsAboutModalOpen(false);
	}, []);

	// Menu toggles
	const toggleCategoryMenu = useCallback(() => {
		setCategoryMenuOpen((prev) => !prev);
	}, []);

	const toggleMobileMenu = useCallback(() => {
		setMobileMenuOpen((prev) => !prev);
	}, []);

	const toggleUserDropdown = useCallback(() => {
		setIsUserDropdownOpen((prev) => !prev);
	}, []);

	// Image handling
	const handleImageLoad = useCallback((articleId: string) => {
		setNews((prev) =>
			prev.map((article) =>
				article.id === articleId
					? { ...article, imageLoaded: true, imageError: false }
					: article
			)
		);
		setImageTimeouts((prevTimeouts) => {
			if (prevTimeouts[articleId]) {
				clearTimeout(prevTimeouts[articleId]);
				const { [articleId]: _removed, ...rest } = prevTimeouts;
				return rest;
			}
			return prevTimeouts;
		});
	}, []);

	const handleImageError = useCallback((articleId: string) => {
		console.warn(`Image failed to load for article ID: ${articleId}`);
		setNews((prev) =>
			prev.map((article) =>
				article.id === articleId
					? { ...article, imageLoaded: false, imageError: true }
					: article
			)
		);
		setImageTimeouts((prevTimeouts) => {
			if (prevTimeouts[articleId]) {
				clearTimeout(prevTimeouts[articleId]);
				const { [articleId]: _removed, ...rest } = prevTimeouts;
				return rest;
			}
			return prevTimeouts;
		});
	}, []);

	// Fetch news data
	const fetchNews = useCallback(
		async (page = 1, isRefresh = false) => {
			if (!isRefresh) setIsLoading(true);
			setError(null);
			setCurrentPage(page);

			// Clear any pending image timeouts
			Object.values(imageTimeouts).forEach(clearTimeout);
			setImageTimeouts({});

			// Use mock data if API key is not configured
			if (!IS_API_KEY_CONFIGURED) {
				console.warn("NewsAPI Key not configured. Displaying mock data.");

				let processedMockData: NewsArticle[] = mockApiData.articles
					.filter((article): article is NewsApiResponseArticle =>
						Boolean(
							article &&
								article.title &&
								article.title !== "[Removed]" &&
								article.url
						)
					)
					.map((article, index): NewsArticle => {
						const articleId = article.url;
						const mappedCategory = mapSourceToCategory(article.source?.name);
						const isTrending = trendingArticleIndices.includes(index);

						return {
							id: articleId,
							title: article.title,
							description: article.description || null,
							category: mappedCategory,
							urlToImage: article.urlToImage || null,
							publishedAt: article.publishedAt || "Date Unavailable",
							source: { name: article.source?.name || "Unknown Source" },
							url: article.url,
							content: article.content || null,
							imageLoaded: false,
							imageError: false,
							isTrending,
						};
					});

				// Apply category filter
				if (selectedCategory !== "All") {
					processedMockData = processedMockData.filter(
						(a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
					);
				}

				// Apply trending filter
				if (showTrendingOnly) {
					processedMockData = processedMockData.filter(
						(a) => a.isTrending === true
					);
				}

				// Apply search filter
				if (debouncedSearchTerm.trim()) {
					const searchLower = debouncedSearchTerm.toLowerCase();
					processedMockData = processedMockData.filter(
						(a) =>
							a.title.toLowerCase().includes(searchLower) ||
							(a.description &&
								a.description.toLowerCase().includes(searchLower)) ||
							a.source.name.toLowerCase().includes(searchLower)
					);
				}

				// Apply sort order
				processedMockData.sort((a, b) => {
					if (
						a.publishedAt === "Date Unavailable" &&
						b.publishedAt === "Date Unavailable"
					)
						return 0;
					if (a.publishedAt === "Date Unavailable")
						return sortOrder === "oldest" ? 1 : -1;
					if (b.publishedAt === "Date Unavailable")
						return sortOrder === "oldest" ? -1 : 1;

					try {
						const dateA = new Date(a.publishedAt).getTime();
						const dateB = new Date(b.publishedAt).getTime();

						if (isNaN(dateA) && isNaN(dateB)) return 0;
						if (isNaN(dateA)) return sortOrder === "oldest" ? 1 : -1;
						if (isNaN(dateB)) return sortOrder === "oldest" ? -1 : 1;

						return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
					} catch (e) {
						console.warn(
							"Sorting error for dates:",
							a.publishedAt,
							b.publishedAt
						);
						return 0;
					}
				});

				// Update news state while preserving image loading states
				setNews((prevNews) => {
					const existingImageStates = prevNews.reduce((acc, currentArticle) => {
						acc[currentArticle.id] = {
							imageLoaded: currentArticle.imageLoaded,
							imageError: currentArticle.imageError,
						};
						return acc;
					}, {} as { [key: string]: { imageLoaded?: boolean; imageError?: boolean } });

					return processedMockData.map((article) => {
						const existingState = existingImageStates[article.id];
						return {
							...article,
							imageLoaded: existingState?.imageLoaded ?? false,
							imageError: existingState?.imageError ?? false,
						};
					});
				});

				setTotalResults(processedMockData.length);
				setCurrentPage(1);
				setError(
					"Displaying sample articles. Configure NewsAPI key for live data."
				);
				setIsLoading(false);
				if (isRefresh) setRefreshing(false);
				return;
			}

			// Real API implementation would go here
			// For now, we'll just use the mock data
			setIsLoading(false);
			if (isRefresh) setRefreshing(false);
		},
		[
			selectedCategory,
			debouncedSearchTerm,
			sortOrder,
			IS_API_KEY_CONFIGURED,
			mapSourceToCategory,
			showTrendingOnly,
			imageTimeouts,
		]
	);

	// Refresh news handler
	const refreshNews = useCallback(() => {
		if (refreshing || isLoading) return;
		setRefreshing(true);
		fetchNews(currentPage, true);
	}, [fetchNews, currentPage, refreshing, isLoading]);

	// Search term debounce
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [searchTerm]);

	// Handle outside clicks for menus and modals
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isFilterMenuOpen &&
				filterMenuRef.current &&
				!filterMenuRef.current.contains(event.target as Node)
			)
				setIsFilterMenuOpen(false);

			if (
				categoryMenuOpen &&
				categoryMenuRef.current &&
				!categoryMenuRef.current.contains(event.target as Node)
			)
				setCategoryMenuOpen(false);

			if (
				isUserDropdownOpen &&
				userDropdownRef.current &&
				!userDropdownRef.current.contains(event.target as Node)
			)
				setIsUserDropdownOpen(false);

			// Only close modals on clicks outside the modal content
			if (
				isArticleModalOpen &&
				articleModalRef.current &&
				!articleModalRef.current.contains(event.target as Node) &&
				(event.target as HTMLElement).closest('[role="dialog"]')
			)
				closeArticleModal();

			if (
				isAboutModalOpen &&
				aboutModalRef.current &&
				!aboutModalRef.current.contains(event.target as Node) &&
				(event.target as HTMLElement).closest('[role="dialog"]')
			)
				closeAboutModal();

			if (
				mobileMenuOpen &&
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node)
			)
				setMobileMenuOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [
		isFilterMenuOpen,
		categoryMenuOpen,
		isArticleModalOpen,
		closeArticleModal,
		isAboutModalOpen,
		closeAboutModal,
		mobileMenuOpen,
		isUserDropdownOpen,
	]);

	// Dark mode class setup
	useEffect(() => {
		if (typeof document !== "undefined") {
			if (isDarkMode) {
				document.documentElement.classList.add("dark-mode");
				document.documentElement.style.colorScheme = "dark";
			} else {
				document.documentElement.classList.remove("dark-mode");
				document.documentElement.style.colorScheme = "light";
			}
		}
	}, [isDarkMode]);

	// Handle Escape key
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				if (isArticleModalOpen) closeArticleModal();
				else if (isAboutModalOpen) closeAboutModal();
				else if (isFilterMenuOpen) setIsFilterMenuOpen(false);
				else if (categoryMenuOpen) setCategoryMenuOpen(false);
				else if (mobileMenuOpen) setMobileMenuOpen(false);
				else if (isUserDropdownOpen) setIsUserDropdownOpen(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isArticleModalOpen,
		closeArticleModal,
		isAboutModalOpen,
		closeAboutModal,
		isFilterMenuOpen,
		categoryMenuOpen,
		mobileMenuOpen,
		isUserDropdownOpen,
	]);

	// Initial news fetch
	useEffect(() => {
		fetchNews(1);
		if (selectedCategory !== "All" || debouncedSearchTerm || showTrendingOnly) {
			setShowIntro(false);
		}
	}, [
		selectedCategory,
		debouncedSearchTerm,
		sortOrder,
		fetchNews,
		showTrendingOnly,
	]);

	// Set up image load timeouts
	useEffect(() => {
		const currentEffectTimeouts: { [key: string]: NodeJS.Timeout } = {};

		const setupTimeoutIfNeeded = (article: NewsArticle) => {
			if (
				article.urlToImage &&
				!article.imageLoaded &&
				!article.imageError &&
				!imageTimeouts[article.id]
			) {
				const timeoutId = setTimeout(() => {
					console.log(`Image load timeout triggered for ${article.id}`);

					setNews((prevNews) =>
						prevNews.map((a) =>
							a.id === article.id && !a.imageLoaded && !a.imageError
								? { ...a, imageError: true, imageLoaded: false }
								: a
						)
					);

					setImageTimeouts((prev) => {
						const { [article.id]: _removed, ...rest } = prev;
						return rest;
					});
				}, 8000);

				currentEffectTimeouts[article.id] = timeoutId;
			}
		};

		news.forEach(setupTimeoutIfNeeded);

		if (Object.keys(currentEffectTimeouts).length > 0) {
			setImageTimeouts((prev) => ({ ...prev, ...currentEffectTimeouts }));
		}

		return () => {
			Object.values(currentEffectTimeouts).forEach(clearTimeout);
		};
	}, [news, imageTimeouts]);

	// Calculate total pages
	const totalPages = useMemo(() => {
		if (!totalResults) return 0;

		const resultsToConsider = IS_API_KEY_CONFIGURED
			? Math.min(totalResults, 100)
			: totalResults;
		return Math.ceil(resultsToConsider / ARTICLES_PER_PAGE);
	}, [totalResults, ARTICLES_PER_PAGE, IS_API_KEY_CONFIGURED]);

	// Filter and display news articles
	const displayedNews = useMemo(() => {
		let filteredNews = [...news];

		if (showFavoritesOnly) {
			filteredNews = filteredNews.filter((article) =>
				favorites.includes(article.id)
			);
		}

		return filteredNews;
	}, [news, favorites, showFavoritesOnly]);

	// Get trending news
	const trendingNews = useMemo(() => {
		return news.filter((article) => article.isTrending);
	}, [news]);

	// Category change handler
	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		setCategoryMenuOpen(false);
		setCurrentPage(1);
		setShowIntro(false);
	};

	// Search input change handler
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	// Reset intro on search clear
	useEffect(() => {
		if (debouncedSearchTerm) {
			setShowIntro(false);
		}
	}, [debouncedSearchTerm]);

	// Search form submit handler
	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setDebouncedSearchTerm(searchTerm);
		setCurrentPage(1);
		if (searchInputRef.current) searchInputRef.current.blur();
		setShowIntro(false);
	};

	// Clear search handler
	const clearSearch = () => {
		setSearchTerm("");
		setDebouncedSearchTerm("");
		setCurrentPage(1);

		if (selectedCategory === "All" && !showTrendingOnly) {
			setShowIntro(true);
		}
	};

	// Page change handler
	const handlePageChange = (newPage: number) => {
		if (
			IS_API_KEY_CONFIGURED &&
			newPage >= 1 &&
			newPage <= totalPages &&
			newPage !== currentPage &&
			!isLoading
		) {
			fetchNews(newPage);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else if (!IS_API_KEY_CONFIGURED) {
			console.log("Pagination disabled for mock data.");
		}
	};

	// Sort order change handler
	const handleSortChange = () => {
		setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
		setCurrentPage(1);
		setIsFilterMenuOpen(false);
	};

	// Filter toggles
	const toggleFavoritesFilter = () => {
		setShowFavoritesOnly((prev) => !prev);

		if (!showFavoritesOnly) {
			setShowTrendingOnly(false);
		}
		setCurrentPage(1);
		setIsFilterMenuOpen(false);
	};

	const toggleTrendingFilter = () => {
		setShowTrendingOnly((prev) => !prev);

		if (!showTrendingOnly) {
			setShowFavoritesOnly(false);
		}
		setCurrentPage(1);
		setIsFilterMenuOpen(false);
	};

	// CSS classes for light/dark mode
	const getThemeClasses = {
		// Common classes
		primaryBtn: `inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg active:scale-95 ${
			isDarkMode
				? "bg-cyan-700 text-white hover:bg-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900"
				: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500 focus:ring-offset-white"
		}`,
		secondaryBtn: `px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
			isDarkMode
				? "bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500 focus:ring-offset-slate-900"
				: "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 focus:ring-offset-white"
		}`,
		iconBtn: `p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
			isDarkMode
				? "text-slate-400 hover:bg-slate-700 hover:text-white focus:ring-cyan-500 focus:ring-offset-slate-900"
				: "text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus:ring-sky-500 focus:ring-offset-white"
		}`,
		modalOverlay: `fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-opacity ${
			isDarkMode
				? "bg-black/85 backdrop-blur-sm"
				: "bg-slate-900/80 backdrop-blur-sm"
		}`,
		modalContent: `w-full mx-auto max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[100vh] overflow-scroll relative transition-transform rounded-xl border shadow-lg flex flex-col ${
			isDarkMode
				? "bg-slate-800 border-slate-700 text-slate-100"
				: "bg-white border-slate-200 text-slate-900"
		}`,
		modalHeader: `sticky top-0 flex-shrink-0 z-10 flex items-center justify-between p-4 sm:p-5 border-b ${
			isDarkMode
				? "bg-slate-800/90 backdrop-blur-sm border-slate-700"
				: "bg-white/95 backdrop-blur-sm border-slate-200"
		}`,
		modalBody: `overflow-y-auto flex-grow p-4 sm:p-6 modal-scrollbar`,
		modalFooter: `p-3 sm:p-4 border-t text-right ${
			isDarkMode
				? "bg-slate-800/50 border-slate-700/50"
				: "bg-slate-50/50 border-slate-200/50"
		}`,
		card: `rounded-xl overflow-hidden transition-all duration-300 border hover:shadow-lg ${
			isDarkMode
				? "bg-slate-800 border-slate-700 hover:border-cyan-700/60"
				: "bg-white border-slate-200/80 hover:border-slate-300"
		}`,
		input: `w-full px-4 py-2 rounded-lg border text-sm transition-shadow ${
			isDarkMode
				? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
				: "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
		}`,
		// Background and text colors
		bgPrimary: isDarkMode ? "bg-slate-900" : "bg-slate-50",
		bgSecondary: isDarkMode ? "bg-slate-800" : "bg-white",
		bgTertiary: isDarkMode ? "bg-slate-700" : "bg-slate-100",
		textPrimary: isDarkMode ? "text-white" : "text-slate-900",
		textSecondary: isDarkMode ? "text-slate-300" : "text-slate-700",
		textTertiary: isDarkMode ? "text-slate-400" : "text-slate-500",
		accentPrimary: isDarkMode ? "text-cyan-400" : "text-sky-600",
		accentSecondary: isDarkMode ? "text-amber-400" : "text-amber-600",
		borderPrimary: isDarkMode ? "border-slate-700" : "border-slate-200",
		borderSecondary: isDarkMode ? "border-slate-600" : "border-slate-300",
	};

	// Article Skeleton Component
	const ArticleSkeleton: React.FC = () => (
		<div className={`${getThemeClasses.card} animate-pulse`}>
			<div
				className={`${
					isDarkMode ? "bg-slate-700" : "bg-slate-300"
				} w-full h-48`}
			></div>
			<div className="p-5 space-y-4">
				<div
					className={`h-4 rounded w-1/4 ${
						isDarkMode ? "bg-slate-600" : "bg-slate-300"
					}`}
				></div>
				<div
					className={`h-6 rounded w-3/4 ${
						isDarkMode ? "bg-slate-700" : "bg-slate-400"
					}`}
				></div>
				<div
					className={`h-4 rounded w-full ${
						isDarkMode ? "bg-slate-600" : "bg-slate-300"
					}`}
				></div>
				<div
					className={`h-4 rounded w-5/6 ${
						isDarkMode ? "bg-slate-700" : "bg-slate-300"
					}`}
				></div>
				<div
					className={`flex justify-between items-center pt-3 border-t ${getThemeClasses.borderPrimary}`}
				>
					<div
						className={`h-4 rounded w-1/3 ${
							isDarkMode ? "bg-slate-600" : "bg-slate-300"
						}`}
					></div>
					<div
						className={`h-4 rounded w-1/4 ${
							isDarkMode ? "bg-slate-700" : "bg-slate-300"
						}`}
					></div>
				</div>
			</div>
		</div>
	);

	// Article Modal Component
	const ArticleModal: React.FC = () => {
		if (!selectedArticle) return null;

		const handleModalInteraction = (e: React.MouseEvent) => e.stopPropagation();

		const displayUrl = (url: string): string => {
			try {
				const parsedUrl = new URL(url);
				let display =
					parsedUrl.hostname.replace(/^www\./, "") + parsedUrl.pathname;
				if (display.endsWith("/")) display = display.slice(0, -1);
				return display.length > 50 ? display.substring(0, 47) + "..." : display;
			} catch (e) {
				console.error("Error parsing URL:", url, e);
				return url.length > 50 ? url.substring(0, 47) + "..." : url;
			}
		};

		const modalContentId = "article-modal-content";
		const modalTitleId = "article-modal-title";

		return (
			<div
				className={`${getThemeClasses.modalOverlay} ${
					isArticleModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				aria-modal="true"
				role="dialog"
				aria-labelledby={modalTitleId}
				aria-describedby={modalContentId}
				onClick={closeArticleModal}
			>
				<div
					ref={articleModalRef}
					onClick={handleModalInteraction}
					className={`${getThemeClasses.modalContent} ${
						isArticleModalOpen
							? "scale-100 opacity-100 translate-y-0"
							: "scale-95 opacity-0 translate-y-4"
					}`}
				>
					<div className={getThemeClasses.modalHeader}>
						<button
							onClick={closeArticleModal}
							className={`flex items-center gap-1.5 p-2 -ml-2 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 ${
								isDarkMode
									? "text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-cyan-500"
									: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-sky-500"
							}`}
							aria-label="Close article details"
						>
							<ArrowLeft size={18} />{" "}
							<span className="hidden sm:inline">Back</span>
						</button>
						<div className="flex items-center gap-3">
							<button
								onClick={(e) => toggleFavorite(selectedArticle.id, e)}
								className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 ${
									favorites.includes(selectedArticle.id)
										? isDarkMode
											? "bg-yellow-400/10 text-yellow-400 focus:ring-yellow-400"
											: "bg-amber-500/10 text-amber-600 focus:ring-amber-500"
										: isDarkMode
										? "text-slate-400 hover:bg-slate-700 hover:text-yellow-400 focus:ring-yellow-400"
										: "text-slate-500 hover:bg-slate-200 hover:text-amber-500 focus:ring-amber-500"
								}`}
								aria-label={
									favorites.includes(selectedArticle.id)
										? "Remove from favorites"
										: "Add to favorites"
								}
								title={
									favorites.includes(selectedArticle.id)
										? "Remove from favorites"
										: "Add to favorites"
								}
							>
								<Bookmark
									size={18}
									className={
										favorites.includes(selectedArticle.id) ? "fill-current" : ""
									}
								/>
							</button>
							<button
								onClick={(e) => toggleReadLater(selectedArticle.id, e)}
								className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 ${
									readLater.includes(selectedArticle.id)
										? isDarkMode
											? "bg-cyan-400/10 text-cyan-400 focus:ring-cyan-400"
											: "bg-sky-500/10 text-sky-600 focus:ring-sky-500"
										: isDarkMode
										? "text-slate-400 hover:bg-slate-700 hover:text-cyan-400 focus:ring-cyan-400"
										: "text-slate-500 hover:bg-slate-200 hover:text-sky-600 focus:ring-sky-500"
								}`}
								aria-label={
									readLater.includes(selectedArticle.id)
										? "Remove from read later"
										: "Add to read later list"
								}
								title={
									readLater.includes(selectedArticle.id)
										? "Remove from read later"
										: "Add to read later list"
								}
							>
								<BookmarkPlus
									size={18}
									className={
										readLater.includes(selectedArticle.id) ? "fill-current" : ""
									}
								/>
							</button>
							<button
								onClick={(e) => shareArticle(selectedArticle, e)}
								className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${
									isDarkMode
										? "text-slate-400 hover:bg-slate-700 hover:text-slate-100 focus:ring-cyan-500"
										: "text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:ring-sky-500"
								}`}
								aria-label="Share article"
								title="Share article"
							>
								<Share2 size={18} />
							</button>
							<a
								href={selectedArticle.url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => addToReadingHistory(selectedArticle.id)}
								className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${
									isDarkMode
										? "text-slate-400 hover:bg-slate-700 hover:text-slate-100 focus:ring-cyan-500"
										: "text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:ring-sky-500"
								}`}
								aria-label="Open original article in new tab"
								title="Open original article in new tab"
							>
								<ExternalLink size={18} />
							</a>
						</div>
					</div>

					<div
						id={modalContentId}
						className={`${getThemeClasses.modalBody} overflow-y-auto`}
					>
						<div className="p-4 sm:p-6 md:p-8">
							{selectedArticle.isTrending && (
								<span
									className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 mr-2 tracking-wide flex items-center gap-1.5 ${
										isDarkMode
											? "bg-amber-900/60 text-amber-200 border border-amber-800/40"
											: "bg-amber-100 text-amber-800 border border-amber-200/60"
									}`}
								>
									<TrendingUp size={12} />
									Trending
								</span>
							)}
							<span
								className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wide ${
									isDarkMode
										? "bg-cyan-900/60 text-cyan-200 border border-cyan-800/40"
										: "bg-sky-100 text-sky-800 border border-sky-200/60"
								}`}
							>
								{selectedArticle.category}
							</span>
							<h2
								id={modalTitleId}
								className={`text-2xl md:text-3xl font-bold mb-3 leading-tight ${getThemeClasses.textPrimary}`}
							>
								{selectedArticle.title}
							</h2>

							<div
								className={`mb-6 space-y-2 text-sm ${getThemeClasses.textTertiary}`}
							>
								<div className="flex flex-wrap gap-x-4 gap-y-2">
									<span className="flex items-center gap-1.5 whitespace-nowrap">
										<User size={14} /> {selectedArticle.source.name}
									</span>
									<span className="flex items-center gap-1.5 whitespace-nowrap">
										<CalendarDays size={14} />{" "}
										{formatDate(selectedArticle.publishedAt)}
									</span>
								</div>
								<div className="flex items-start gap-1.5">
									<ExternalLink size={14} className="mt-0.5 flex-shrink-0" />
									<a
										href={selectedArticle.url}
										target="_blank"
										rel="noopener noreferrer"
										onClick={() => addToReadingHistory(selectedArticle.id)}
										className={`break-words hover:underline focus:outline-none focus:ring-1 rounded px-0.5 -ml-0.5 text-xs sm:text-sm ${
											isDarkMode
												? "text-cyan-400 hover:text-cyan-300 focus:ring-cyan-400"
												: "text-sky-600 hover:text-sky-700 focus:ring-sky-600"
										}`}
										title="View original source"
									>
										{displayUrl(selectedArticle.url)}
									</a>
								</div>
							</div>

							{selectedArticle.urlToImage && !selectedArticle.imageError ? (
								<figure
									className={`mb-6 rounded-lg overflow-hidden shadow-lg ${
										isDarkMode
											? "bg-slate-700 border border-slate-600/50"
											: "bg-slate-200 border border-slate-300/50"
									}`}
								>
									<img
										src={selectedArticle.urlToImage}
										alt={`Image for ${selectedArticle.title}`}
										className="w-full h-auto object-cover max-h-[400px]"
										onError={() => handleImageError(selectedArticle.id)}
									/>
								</figure>
							) : selectedArticle.urlToImage && selectedArticle.imageError ? (
								<div
									className={`mb-6 rounded-lg h-48 flex items-center justify-center ${
										isDarkMode
											? "bg-slate-700/60 border border-slate-600/50"
											: "bg-slate-100 border border-slate-200/80"
									}`}
								>
									<ImageOff
										size={36}
										className={isDarkMode ? "text-slate-500" : "text-slate-400"}
									/>
								</div>
							) : null}

							{selectedArticle.description && (
								<p
									className={`text-base sm:text-lg mb-6 leading-relaxed ${
										isDarkMode ? "text-slate-300" : "text-slate-700"
									}`}
								>
									{selectedArticle.description}
								</p>
							)}

							<div
								className={`text-sm sm:text-base leading-relaxed ${
									isDarkMode ? "text-slate-300" : "text-slate-700"
								}`}
							>
								{selectedArticle.content ? (
									typeof selectedArticle.content === "string" &&
									selectedArticle.content.includes("\n") ? (
										selectedArticle.content.split(/[\r\n]+/).map(
											(paragraph, index) =>
												paragraph.trim() && (
													<p key={index} className="mb-4">
														{paragraph}
													</p>
												)
										)
									) : (
										<p className="mb-4">{selectedArticle.content}</p>
									)
								) : (
									<div
										className={`p-6 rounded-lg text-center mt-6 border-t ${
											isDarkMode
												? "bg-slate-700/30 border-slate-600/50 text-slate-300"
												: "bg-slate-100/70 border-slate-200/70 text-slate-600"
										}`}
									>
										<Coffee
											size={36}
											className={`${
												isDarkMode ? "text-slate-500" : "text-slate-400"
											} mb-4 mx-auto`}
										/>
										<p className="mb-6">
											Full article content isn't available here. View the
											original source for the complete story.
										</p>
										<a
											href={selectedArticle.url}
											target="_blank"
											rel="noopener noreferrer"
											onClick={() => addToReadingHistory(selectedArticle.id)}
											className={getThemeClasses.primaryBtn}
										>
											<ExternalLink size={18} /> Read Full Article on{" "}
											{selectedArticle.source.name}
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// About Modal Component
	const AboutModal: React.FC = () => {
		if (!isAboutModalOpen) return null;
		const handleModalInteraction = (e: React.MouseEvent) => e.stopPropagation();
		const modalTitleId = "about-modal-title";
		const modalContentId = "about-modal-content";

		return (
			<div
				className={`${getThemeClasses.modalOverlay} z-[51] ${
					isAboutModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={closeAboutModal}
				aria-modal="true"
				role="dialog"
				aria-labelledby={modalTitleId}
				aria-describedby={modalContentId}
			>
				<div
					ref={aboutModalRef}
					onClick={handleModalInteraction}
					className={`${getThemeClasses.modalContent} max-w-xl ${
						isAboutModalOpen
							? "scale-100 opacity-100 translate-y-0"
							: "scale-95 opacity-0 translate-y-4"
					}`}
				>
					<div className={getThemeClasses.modalHeader}>
						<h2
							id={modalTitleId}
							className={`text-lg font-semibold ${getThemeClasses.textPrimary}`}
						>
							About Hub
						</h2>
						<button
							onClick={closeAboutModal}
							className={getThemeClasses.iconBtn}
							aria-label="Close about modal"
						>
							<X size={20} />
						</button>
					</div>
					<div
						id={modalContentId}
						className={`${getThemeClasses.modalBody} space-y-4 text-sm sm:text-base`}
					>
						<p className={`${getThemeClasses.textSecondary} leading-relaxed`}>
							Welcome to Hub, your streamlined source for current events. We
							aggregate top headlines from various trusted sources across
							different categories, bringing you a diverse range of news in one
							convenient place.
						</p>
						<p className={`${getThemeClasses.textSecondary} leading-relaxed`}>
							Use the search bar to find specific topics, filter by category,
							save articles for later reading using the{" "}
							<BookmarkPlus size={16} className="inline-block -mt-1 mx-0.5" />{" "}
							icon, or bookmark your favorites with the{" "}
							<Bookmark size={16} className="inline-block -mt-1 mx-0.5" /> icon.
							Our goal is to provide a clean, efficient, and customizable news
							reading experience.
						</p>
						<div
							className={`${getThemeClasses.textSecondary} leading-relaxed border-t pt-4 mt-4 ${getThemeClasses.borderPrimary}`}
						>
							This interface is powered by the{" "}
							<a
								href="https://newsapi.org/"
								target="_blank"
								rel="noopener noreferrer"
								className={`font-medium underline hover:opacity-80 transition-opacity ${getThemeClasses.accentPrimary}`}
							>
								NewsAPI.org
							</a>{" "}
							service.
							{!IS_API_KEY_CONFIGURED && (
								<span
									className={`block mt-2 text-xs p-2 rounded border ${
										isDarkMode
											? "bg-amber-900/50 border-amber-700/40 text-amber-300"
											: "bg-amber-100 border-amber-300 text-amber-800"
									}`}
								>
									Currently showing sample data. Configure a valid NewsAPI key
									for live articles.
								</span>
							)}
						</div>
					</div>
					<div className={getThemeClasses.modalFooter}>
						<button
							onClick={closeAboutModal}
							className={getThemeClasses.secondaryBtn}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		);
	};

	// Pagination Component
	const PaginationControls: React.FC = () => {
		if (!IS_API_KEY_CONFIGURED || !totalPages || totalPages <= 1) return null;

		const pageNumbers: JSX.Element[] = [];
		const maxPagesToShow = 5;
		const sidePages = Math.floor((maxPagesToShow - 1) / 2);
		let startPage: number, endPage: number;

		if (totalPages <= maxPagesToShow) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage <= sidePages + 1) {
				startPage = 1;
				endPage = maxPagesToShow;
			} else if (currentPage >= totalPages - sidePages) {
				startPage = totalPages - maxPagesToShow + 1;
				endPage = totalPages;
			} else {
				startPage = currentPage - sidePages;
				endPage = currentPage + sidePages;
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					disabled={isLoading}
					className={`mx-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
						currentPage === i
							? isDarkMode
								? "bg-cyan-600 text-white shadow-md cursor-default"
								: "bg-sky-600 text-white shadow-md cursor-default"
							: isDarkMode
							? "bg-slate-700 text-slate-300 hover:bg-slate-600"
							: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
					}`}
					aria-current={currentPage === i ? "page" : undefined}
					aria-label={`Go to page ${i}`}
				>
					{i}
				</button>
			);
		}

		return (
			<nav
				className="mt-12 flex items-center justify-center space-x-1 sm:space-x-2"
				aria-label="Pagination"
			>
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1 || isLoading}
					className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
						isDarkMode
							? "bg-slate-700 text-slate-300 hover:bg-slate-600"
							: "bg-slate-200 text-slate-700 hover:bg-slate-300"
					}`}
					aria-label="Previous Page"
				>
					<ChevronLeft size={16} className="mr-1" /> Prev
				</button>

				{startPage > 1 && (
					<>
						<button
							onClick={() => handlePageChange(1)}
							className={`mx-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
								isDarkMode
									? "bg-slate-700 text-slate-300 hover:bg-slate-600"
									: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
							}`}
							aria-label="Go to page 1"
						>
							1
						</button>
						{startPage > 2 && (
							<span
								className={`px-1 text-sm font-medium ${
									isDarkMode ? "text-slate-500" : "text-slate-400"
								}`}
								aria-hidden="true"
							>
								...
							</span>
						)}
					</>
				)}

				{pageNumbers}

				{endPage < totalPages && (
					<>
						{endPage < totalPages - 1 && (
							<span
								className={`px-1 text-sm font-medium ${
									isDarkMode ? "text-slate-500" : "text-slate-400"
								}`}
								aria-hidden="true"
							>
								...
							</span>
						)}
						<button
							onClick={() => handlePageChange(totalPages)}
							className={`mx-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
								isDarkMode
									? "bg-slate-700 text-slate-300 hover:bg-slate-600"
									: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
							}`}
							aria-label={`Go to page ${totalPages}`}
						>
							{totalPages}
						</button>
					</>
				)}

				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages || isLoading}
					className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
						isDarkMode
							? "bg-slate-700 text-slate-300 hover:bg-slate-600"
							: "bg-slate-200 text-slate-700 hover:bg-slate-300"
					}`}
					aria-label="Next Page"
				>
					Next <ChevronRight size={16} className="ml-1" />
				</button>
			</nav>
		);
	};

	// Mobile Menu Component
	const MobileMenu: React.FC = () => {
		if (!mobileMenuOpen) return null;

		return (
			<div
				className={`fixed inset-0 z-40 ${
					isDarkMode ? "bg-black/80" : "bg-slate-800/60"
				} backdrop-blur-sm transition-opacity duration-300 ${
					mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => setMobileMenuOpen(false)}
			>
				<div
					ref={mobileMenuRef}
					onClick={(e) => e.stopPropagation()}
					className={`fixed right-0 top-0 w-64 max-w-full h-full overflow-auto mobile-scrollbar transition-transform duration-300 ${
						mobileMenuOpen ? "translate-x-0" : "translate-x-full"
					} ${
						isDarkMode
							? "bg-slate-900 border-l border-slate-700"
							: "bg-white border-l border-slate-200"
					}`}
				>
					<div
						className={`p-4 border-b ${getThemeClasses.borderPrimary} flex justify-between items-center`}
					>
						<div className="flex items-center gap-2">
							<Newspaper className={getThemeClasses.accentPrimary} size={20} />
							<span className={`font-bold ${getThemeClasses.textPrimary}`}>
								Hub
							</span>
						</div>
						<button
							onClick={() => setMobileMenuOpen(false)}
							className={getThemeClasses.iconBtn}
							aria-label="Close menu"
						>
							<X size={20} />
						</button>
					</div>

					<div className="p-4">
						<div className="mb-8">
							<h3
								className={`text-sm font-semibold mb-3 ${getThemeClasses.textSecondary}`}
							>
								Categories
							</h3>
							<div className="space-y-1">
								{categories.map((category) => (
									<button
										key={category}
										onClick={() => {
											handleCategoryChange(category);
											setMobileMenuOpen(false);
										}}
										className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
											selectedCategory === category
												? isDarkMode
													? "bg-cyan-900/50 text-cyan-300 font-medium"
													: "bg-sky-100 text-sky-700 font-medium"
												: isDarkMode
												? "text-slate-300 hover:bg-slate-800"
												: "text-slate-700 hover:bg-slate-100"
										}`}
									>
										{category}
									</button>
								))}
							</div>
						</div>

						<div className="mb-8">
							<h3
								className={`text-sm font-semibold mb-3 ${getThemeClasses.textSecondary}`}
							>
								Filters
							</h3>
							<div className="space-y-2">
								<button
									onClick={() => {
										toggleTrendingFilter();
										setMobileMenuOpen(false);
									}}
									className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
										showTrendingOnly
											? isDarkMode
												? "bg-amber-900/50 text-amber-300 font-medium"
												: "bg-amber-100 text-amber-700 font-medium"
											: isDarkMode
											? "text-slate-300 hover:bg-slate-800"
											: "text-slate-700 hover:bg-slate-100"
									}`}
								>
									<TrendingUp size={16} />
									Show Trending Only
								</button>
								<button
									onClick={() => {
										toggleFavoritesFilter();
										setMobileMenuOpen(false);
									}}
									className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
										showFavoritesOnly
											? isDarkMode
												? "bg-yellow-900/50 text-yellow-300 font-medium"
												: "bg-amber-100 text-amber-700 font-medium"
											: isDarkMode
											? "text-slate-300 hover:bg-slate-800"
											: "text-slate-700 hover:bg-slate-100"
									}`}
								>
									<Bookmark size={16} />
									Show Favorites Only
								</button>
								<button
									onClick={() => {
										handleSortChange();
										setMobileMenuOpen(false);
									}}
									className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
										isDarkMode
											? "text-slate-300 hover:bg-slate-800"
											: "text-slate-700 hover:bg-slate-100"
									}`}
								>
									<ArrowUpDown size={16} />
									Sort: {sortOrder === "newest" ? "Newest" : "Oldest"} First
								</button>
							</div>
						</div>
						<div className="mb-8">
							<h3
								className={`text-sm font-semibold mb-3 ${getThemeClasses.textSecondary}`}
							>
								Settings
							</h3>
							<div className="space-y-2">
								<button
									onClick={() => {
										toggleDarkMode();
										setMobileMenuOpen(false);
									}}
									className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
										isDarkMode
											? "text-slate-300 hover:bg-slate-800"
											: "text-slate-700 hover:bg-slate-100"
									}`}
								>
									{isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
									{isDarkMode ? "Light Mode" : "Dark Mode"}
								</button>
								<button
									onClick={() => {
										openAboutModal();
										setMobileMenuOpen(false);
									}}
									className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
										isDarkMode
											? "text-slate-300 hover:bg-slate-800"
											: "text-slate-700 hover:bg-slate-100"
									}`}
								>
									<Info size={16} />
									About Hub
								</button>
							</div>
						</div>
						<div className="mt-auto pt-6 border-t text-sm text-center">
							<span
								className={isDarkMode ? "text-slate-400" : "text-slate-500"}
							>
								Hub &copy; {new Date().getFullYear()}
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// Trending News Section Component
	const TrendingNewsSection: React.FC = () => {
		if (trendingNews.length === 0 || showFavoritesOnly) return null;

		return (
			<section className="mb-10" aria-labelledby="trending-heading">
				<div className="flex items-center justify-between mb-4">
					<h2
						id="trending-heading"
						className={`text-xl font-bold flex items-center gap-2 ${getThemeClasses.textPrimary}`}
					>
						<TrendingUp className={getThemeClasses.accentSecondary} size={20} />
						Trending Now
					</h2>
					<button
						onClick={toggleTrendingFilter}
						className={`text-sm flex items-center gap-1 transition-colors ${getThemeClasses.accentPrimary}`}
					>
						{showTrendingOnly ? "View all news" : "View all trending"}
					</button>
				</div>

				<div className="relative overflow-x-auto pb-2 -mb-2 hide-scrollbar">
					<div className="flex space-x-4 py-2">
						{trendingNews.slice(0, 6).map((article) => (
							<div
								key={article.id}
								className={`flex-shrink-0 w-72 sm:w-80 ${getThemeClasses.card} cursor-pointer`}
								onClick={() => openArticleModal(article)}
							>
								<div
									className={`relative h-36 ${
										isDarkMode ? "bg-slate-700" : "bg-slate-200"
									}`}
								>
									{article.urlToImage && !article.imageError ? (
										<img
											src={article.urlToImage}
											alt=""
											className={`w-full h-full object-cover transition-opacity duration-500 ${
												article.imageLoaded ? "opacity-100" : "opacity-0"
											}`}
											onLoad={() => handleImageLoad(article.id)}
											onError={() => handleImageError(article.id)}
											loading="lazy"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<ImageOff
												className={
													isDarkMode ? "text-slate-600" : "text-slate-400"
												}
												size={32}
											/>
										</div>
									)}

									<div className="absolute top-2 left-2 flex gap-1">
										<span
											className={`px-1.5 py-0.5 rounded text-xs flex items-center gap-1 ${
												isDarkMode
													? "bg-amber-900/80 text-amber-200 backdrop-blur-sm"
													: "bg-amber-600/80 text-white backdrop-blur-sm"
											}`}
										>
											<TrendingUp size={10} /> Trending
										</span>
									</div>

									<div className="absolute bottom-2 right-2">
										<span
											className={`px-1.5 py-0.5 rounded text-xs ${
												isDarkMode
													? "bg-black/60 text-white backdrop-blur-sm"
													: "bg-white/70 text-slate-800 backdrop-blur-sm"
											}`}
										>
											{getTimeAgo(article.publishedAt)}
										</span>
									</div>
								</div>

								<div className="p-4">
									<span
										className={`text-xs font-medium ${getThemeClasses.textTertiary}`}
									>
										{article.source.name}
									</span>
									<h3
										className={`text-sm font-semibold mt-1 mb-2 line-clamp-2 ${getThemeClasses.textPrimary}`}
									>
										{article.title}
									</h3>
									<div className="flex items-center justify-between text-xs">
										<span
											className={`px-2 py-0.5 rounded-full ${
												isDarkMode
													? "bg-slate-700 text-slate-300"
													: "bg-slate-100 text-slate-800"
											}`}
										>
											{article.category}
										</span>
										<div className="flex items-center gap-3">
											<button
												onClick={(e) => {
													e.stopPropagation();
													toggleFavorite(article.id);
												}}
												className={`transition-colors ${
													favorites.includes(article.id)
														? isDarkMode
															? "text-yellow-400"
															: "text-amber-600"
														: isDarkMode
														? "text-slate-500 hover:text-yellow-400"
														: "text-slate-400 hover:text-amber-600"
												}`}
												aria-label={
													favorites.includes(article.id)
														? "Remove from favorites"
														: "Add to favorites"
												}
											>
												<Bookmark
													size={14}
													className={
														favorites.includes(article.id) ? "fill-current" : ""
													}
												/>
											</button>
											<button
												onClick={(e) => shareArticle(article, e)}
												className={`transition-colors ${
													isDarkMode
														? "text-slate-500 hover:text-slate-300"
														: "text-slate-400 hover:text-slate-700"
												}`}
												aria-label="Share article"
											>
												<Share2 size={14} />
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	};

	// Main component render
	return (
		<div
			className={`min-h-screen font-sans antialiased transition-colors duration-300 ${getThemeClasses.bgPrimary} ${getThemeClasses.textSecondary}`}
		>
			{/* Header */}
			<header
				className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-colors duration-300 ${
					isDarkMode
						? "bg-slate-900/85 border-slate-700/70 shadow-md shadow-black/20"
						: "bg-white/95 border-slate-200/80 shadow-sm"
				}`}
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo & Navigation */}
						<div className="flex-shrink-0 flex items-center gap-2">
							<Newspaper
								className={`h-7 w-7 flex-shrink-0 ${getThemeClasses.accentPrimary}`}
							/>
							<span
								className={`text-xl font-bold ${getThemeClasses.textPrimary}`}
							>
								Hub
							</span>

							{/* Desktop Navigation Links */}
							<div className="hidden md:flex ml-6 space-x-1">
								<button
									onClick={() => {
										handleCategoryChange("All");
										setShowTrendingOnly(false);
										setShowFavoritesOnly(false);
									}}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										selectedCategory === "All" &&
										!showTrendingOnly &&
										!showFavoritesOnly
											? isDarkMode
												? "bg-slate-800 text-white"
												: "bg-slate-100 text-slate-900"
											: isDarkMode
											? "text-slate-300 hover:bg-slate-800 hover:text-white"
											: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
									}`}
								>
									<Home size={16} className="inline-block mr-1.5 -mt-0.5" />
									Home
								</button>
								<button
									onClick={toggleTrendingFilter}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										showTrendingOnly
											? isDarkMode
												? "bg-amber-900/60 text-amber-200"
												: "bg-amber-100 text-amber-800"
											: isDarkMode
											? "text-slate-300 hover:bg-slate-800 hover:text-white"
											: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
									}`}
								>
									<TrendingUp
										size={16}
										className="inline-block mr-1.5 -mt-0.5"
									/>
									Trending
								</button>
								<button
									onClick={toggleFavoritesFilter}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										showFavoritesOnly
											? isDarkMode
												? "bg-yellow-900/60 text-yellow-200"
												: "bg-amber-100 text-amber-800"
											: isDarkMode
											? "text-slate-300 hover:bg-slate-800 hover:text-white"
											: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
									}`}
								>
									<Bookmark size={16} className="inline-block mr-1.5 -mt-0.5" />
									Favorites
								</button>
							</div>
						</div>

						{/* Search Form - Desktop */}
						<form
							onSubmit={handleSearchSubmit}
							className="hidden md:flex items-center w-full max-w-md lg:max-w-[50rem] ml-auto mr-4 relative group"
						>
							<input
								ref={searchInputRef}
								type="search"
								placeholder="Search news articles..."
								value={searchTerm}
								onChange={handleSearchChange}
								className={
									getThemeClasses.input + " pl-10 pr-9 py-2.5 rounded-lg"
								}
								aria-label="Search articles"
							/>
							<Search
								className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none transition-colors ${
									isDarkMode
										? "text-slate-400 peer-focus:text-cyan-400"
										: "text-slate-500 peer-focus:text-sky-500"
								}`}
							/>
							{searchTerm && (
								<button
									type="button"
									onClick={clearSearch}
									className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors ${
										isDarkMode
											? "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
											: "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
									}`}
									aria-label="Clear search"
								>
									<XCircle size={18} />
								</button>
							)}
						</form>

						{/* User Profile Section */}
						<div className="flex items-center gap-3">
							<div className="relative" ref={userDropdownRef}>
								<div
									className={`flex items-center gap-2 cursor-pointer rounded-lg py-2 px-3 hover:bg-opacity-10 ${
										isDarkMode
											? "text-slate-300 hover:bg-slate-700 hover:text-cyan-400"
											: "text-slate-600 hover:bg-slate-100 hover:text-sky-600"
									}`}
									onClick={toggleUserDropdown}
								>
									<User
										className={`h-5 w-5 ${getThemeClasses.accentPrimary}`}
									/>
									<span
										className={`text-sm font-medium hidden sm:inline ${
											isDarkMode ? "text-slate-200" : "text-slate-700"
										}`}
									>
										Ryouta Kise
									</span>
									<ChevronDown
										className={`h-4 w-4 ${getThemeClasses.textTertiary}`}
									/>
								</div>

								{isUserDropdownOpen && (
									<div
										className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 border ${
											isDarkMode
												? "bg-slate-800 border-slate-700"
												: "bg-white border-slate-200"
										}`}
									>
										<div className="py-1">
											<div
												className={`px-4 py-3 border-b ${getThemeClasses.borderPrimary}`}
											>
												<p
													className={`text-sm font-medium ${getThemeClasses.textPrimary}`}
												>
													Ryouta Kise
												</p>
												<p className="text-xs text-slate-500">
													member@example.com
												</p>
											</div>

											<a
												href="#profile"
												className={`flex items-center gap-2 px-4 py-2 text-sm ${
													isDarkMode
														? "text-slate-300 hover:bg-slate-700"
														: "text-slate-700 hover:bg-slate-100"
												}`}
												onClick={() => setIsUserDropdownOpen(false)}
											>
												<User className="h-4 w-4" />
												<span>Profile</span>
											</a>

											<a
												href="#saved"
												className={`flex items-center gap-2 px-4 py-2 text-sm ${
													isDarkMode
														? "text-slate-300 hover:bg-slate-700"
														: "text-slate-700 hover:bg-slate-100"
												}`}
												onClick={() => setIsUserDropdownOpen(false)}
											>
												<BookmarkPlus className="h-4 w-4" />
												<span>Saved</span>
											</a>

											<div
												className={`border-t ${getThemeClasses.borderPrimary} my-1`}
											></div>

											<a
												href="#signout"
												className={`flex items-center gap-2 px-4 py-2 text-sm text-red-500 ${
													isDarkMode
														? "hover:bg-slate-700"
														: "hover:bg-slate-100"
												}`}
												onClick={() => setIsUserDropdownOpen(false)}
											>
												<LogOut className="h-4 w-4" />
												<span>Sign out</span>
											</a>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Action Buttons & Mobile Menu */}
						<div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
							{/* About Button - Desktop */}
							<button
								onClick={openAboutModal}
								className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
									isDarkMode
										? "text-slate-300 hover:bg-slate-700 hover:text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900"
										: "text-slate-600 hover:bg-slate-100 hover:text-sky-600 focus:ring-sky-500 focus:ring-offset-white"
								}`}
								aria-label="About Hub"
								title="About Hub"
							>
								<Info size={16} />{" "}
								<span className="hidden lg:inline">About</span>
							</button>
							<div
								className={`hidden md:block w-px h-6 ${
									isDarkMode ? "bg-slate-700" : "bg-slate-300"
								} mx-1`}
							></div>

							{/* Refresh Button */}
							<button
								onClick={refreshNews}
								disabled={isLoading || refreshing}
								className={`hidden sm:flex items-center gap-1.5 p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
									isDarkMode
										? "text-slate-400 hover:bg-slate-700 hover:text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 disabled:text-slate-600 disabled:hover:bg-transparent disabled:hover:text-slate-600"
										: "text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:ring-sky-500 focus:ring-offset-white disabled:text-slate-400 disabled:hover:bg-transparent disabled:hover:text-slate-400"
								} ${refreshing ? "animate-spin" : ""}`}
								aria-label="Refresh news"
								title="Refresh news"
							>
								<RefreshCw size={16} />
							</button>

							{/* Desktop Action Buttons */}
							<div className="hidden md:flex items-center space-x-2">
								<button
									onClick={toggleDarkMode}
									className={getThemeClasses.iconBtn}
									aria-label={
										isDarkMode ? "Switch to light mode" : "Switch to dark mode"
									}
									title={
										isDarkMode ? "Switch to light mode" : "Switch to dark mode"
									}
								>
									{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
								</button>

								<div className="relative" ref={filterMenuRef}>
									<button
										onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
										id="filter-button"
										className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
											isFilterMenuOpen
												? isDarkMode
													? "bg-slate-700 text-cyan-400"
													: "bg-slate-200 text-sky-600"
												: ""
										} ${getThemeClasses.iconBtn}`}
										aria-label="Filter and display options"
										aria-haspopup="true"
										aria-expanded={isFilterMenuOpen}
										title="Filter and display options"
									>
										<Filter size={18} />
									</button>
									{isFilterMenuOpen && (
										<div
											className={`absolute right-0 mt-2 py-2 w-60 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-30 origin-top-right animate-fadeIn ${
												isDarkMode
													? "bg-slate-800 border border-slate-700 text-slate-200"
													: "bg-white border border-slate-200 text-slate-800 shadow-lg"
											}`}
											role="menu"
											aria-orientation="vertical"
											aria-labelledby="filter-button"
										>
											<div
												className={`px-4 py-2 text-sm font-medium border-b ${
													isDarkMode
														? "border-slate-700/50 text-slate-400"
														: "border-slate-200 text-slate-600"
												}`}
											>
												Display Options
											</div>
											<button
												onClick={toggleTrendingFilter}
												className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors duration-150 ${
													isDarkMode
														? "hover:bg-slate-700 " +
														  (showTrendingOnly
																? "text-amber-300 font-medium"
																: "text-slate-300")
														: "hover:bg-slate-100 " +
														  (showTrendingOnly
																? "text-amber-600 font-medium"
																: "text-slate-700")
												}`}
												role="menuitemcheckbox"
												aria-checked={showTrendingOnly}
											>
												<span className="flex items-center gap-2">
													<TrendingUp size={16} /> Show Trending Only
												</span>
												{showTrendingOnly && (
													<span
														className={`text-xs px-1.5 py-0.5 rounded-full ${
															isDarkMode
																? "bg-amber-900 text-amber-300"
																: "bg-amber-100 text-amber-700"
														}`}
													>
														On
													</span>
												)}
											</button>
											<button
												onClick={toggleFavoritesFilter}
												className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors duration-150 ${
													isDarkMode
														? "hover:bg-slate-700 " +
														  (showFavoritesOnly
																? "text-cyan-300 font-medium"
																: "text-slate-300")
														: "hover:bg-slate-100 " +
														  (showFavoritesOnly
																? "text-sky-600 font-medium"
																: "text-slate-700")
												}`}
												role="menuitemcheckbox"
												aria-checked={showFavoritesOnly}
											>
												<span className="flex items-center gap-2">
													<Bookmark size={16} /> Show Favorites Only
												</span>
												{showFavoritesOnly && (
													<span
														className={`text-xs px-1.5 py-0.5 rounded-full ${
															isDarkMode
																? "bg-cyan-900 text-cyan-300"
																: "bg-sky-100 text-sky-700"
														}`}
													>
														On
													</span>
												)}
											</button>
											<button
												onClick={handleSortChange}
												className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-150 ${
													isDarkMode
														? "text-slate-300 hover:bg-slate-700"
														: "text-slate-700 hover:bg-slate-100"
												}`}
												role="menuitem"
											>
												<ArrowUpDown size={16} /> Sort:{" "}
												{sortOrder === "newest" ? "Newest" : "Oldest"} First
											</button>
										</div>
									)}
								</div>
							</div>

							{/* Mobile Search & Menu Buttons */}
							<div className="md:hidden flex items-center space-x-2">
								<form onSubmit={handleSearchSubmit} className="relative group">
									<input
										type="search"
										placeholder="Search..."
										value={searchTerm}
										onChange={handleSearchChange}
										className={`w-24 sm:w-32 pl-8 pr-7 py-1.5 rounded-lg text-xs ${getThemeClasses.input}`}
										aria-label="Search articles (mobile)"
									/>
									<Search
										className={`absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors ${
											isDarkMode
												? "text-slate-500 peer-focus:text-cyan-400"
												: "text-slate-400 peer-focus:text-sky-500"
										}`}
									/>
									{searchTerm && (
										<button
											type="button"
											onClick={clearSearch}
											className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full transition-colors ${
												isDarkMode
													? "text-slate-500 hover:text-slate-300 hover:bg-slate-700"
													: "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
											}`}
											aria-label="Clear search"
										>
											<XCircle size={16} />
										</button>
									)}
								</form>

								{/* Mobile Menu Button */}
								<button
									onClick={toggleMobileMenu}
									className={getThemeClasses.iconBtn}
									aria-label="Menu"
									aria-expanded={mobileMenuOpen}
								>
									<Menu size={20} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
				{/* Introduction Section */}
				{showIntro && !isLoading && !error && (
					<div
						className={`relative mb-8 p-5 rounded-lg border overflow-hidden shadow-sm transition-opacity duration-500 ${
							isDarkMode
								? "bg-slate-800/80 border-slate-700/70"
								: "bg-white border-slate-200/80"
						}`}
					>
						<button
							onClick={() => setShowIntro(false)}
							className={`absolute top-2 right-2 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
								isDarkMode
									? "text-slate-500 hover:text-slate-300 hover:bg-slate-700"
									: "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
							}`}
							aria-label="Dismiss introduction"
						>
							<XCircle size={18} />
						</button>
						<div className="flex items-center gap-3">
							<Info
								className={`h-6 w-6 flex-shrink-0 ${getThemeClasses.accentPrimary}`}
							/>
							<div>
								<h2
									className={`text-lg font-semibold mb-1 ${getThemeClasses.textPrimary}`}
								>
									Welcome to Hub!
								</h2>
								<p className={`text-sm ${getThemeClasses.textSecondary}`}>
									Explore top headlines, search topics, and save articles.{" "}
									{!IS_API_KEY_CONFIGURED && " (Currently showing sample data)"}{" "}
									Click 'About' or the{" "}
									<Info size={14} className="inline -mt-1" /> icon for more
									info.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Trending News Section */}
				<TrendingNewsSection />

				{/* Categories Section */}
				<section aria-labelledby="category-heading" className="mb-6 md:mb-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
						<h2
							id="category-heading"
							className={`text-lg font-semibold mb-2 md:mb-0 ${
								isDarkMode ? "text-slate-200" : "text-slate-700"
							}`}
						>
							Categories
						</h2>
						{/* Mobile Category Selector */}
						<div className="relative md:hidden" ref={categoryMenuRef}>
							<button
								onClick={toggleCategoryMenu}
								id="category-menu-button"
								className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
									isDarkMode
										? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
										: "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
								}`}
								aria-haspopup="true"
								aria-expanded={categoryMenuOpen}
								aria-controls="category-menu-dropdown"
							>
								<span>{selectedCategory}</span> <Filter size={14} />
							</button>
							{categoryMenuOpen && (
								<div
									id="category-menu-dropdown"
									className={`absolute left-0 right-0 mt-1 py-1 w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-30 max-h-60 overflow-y-auto mobile-scrollbar origin-top animate-fadeIn ${
										isDarkMode
											? "bg-slate-800 border border-slate-700"
											: "bg-white border border-slate-200"
									}`}
									role="menu"
									aria-orientation="vertical"
									aria-labelledby="category-menu-button"
								>
									{categories.map((category) => (
										<button
											key={category}
											onClick={() => handleCategoryChange(category)}
											className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
												selectedCategory === category
													? isDarkMode
														? "bg-cyan-700/80 text-white font-medium"
														: "bg-sky-100 text-sky-700 font-medium"
													: isDarkMode
													? "text-slate-300 hover:bg-slate-700"
													: "text-slate-700 hover:bg-slate-100"
											}`}
											role="menuitem"
										>
											{category}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
					{/* Desktop Categories */}
					<div className="relative hidden md:block">
						<div className="overflow-x-auto pb-2 -mb-2 category-scrollbar">
							<div className="flex space-x-3 whitespace-nowrap py-1">
								{categories.map((category) => (
									<button
										key={category}
										onClick={() => handleCategoryChange(category)}
										disabled={isLoading}
										className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
											selectedCategory === category
												? isDarkMode
													? "bg-gradient-to-r from-cyan-600 to-sky-600 text-white"
													: "bg-gradient-to-r from-sky-600 to-blue-600 text-white"
												: isDarkMode
												? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600"
												: "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400"
										}`}
										aria-pressed={selectedCategory === category}
									>
										{category}
									</button>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Status Bar */}
				<div className="mb-6 min-h-[2.5rem] flex items-center text-sm">
					{!isLoading && !error && totalResults > 0 && (
						<p className={getThemeClasses.textTertiary}>
							Showing {displayedNews.length} article
							{displayedNews.length !== 1 ? "s" : ""}
							{IS_API_KEY_CONFIGURED &&
								` of ~${Math.min(totalResults, 100)} total`}
							{debouncedSearchTerm && (
								<>
									{" "}
									matching "<strong>{debouncedSearchTerm}</strong>"
								</>
							)}
							{selectedCategory !== "All" && (
								<>
									{" "}
									in "<strong>{selectedCategory}</strong>"
								</>
							)}
							.
							{IS_API_KEY_CONFIGURED &&
								totalPages > 1 &&
								` (Page ${currentPage} of ${totalPages})`}
							{showTrendingOnly && (
								<span
									className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
										isDarkMode
											? "bg-amber-900/50 text-amber-300 border border-amber-700/30"
											: "bg-amber-100 text-amber-700 border border-amber-200/50"
									}`}
								>
									<TrendingUp size={12} /> Trending
								</span>
							)}
							{showFavoritesOnly && (
								<span
									className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
										isDarkMode
											? "bg-yellow-900/50 text-yellow-300 border border-yellow-700/30"
											: "bg-amber-100 text-amber-700 border border-amber-200/50"
									}`}
								>
									<Bookmark size={12} /> Favorites
								</span>
							)}
						</p>
					)}
					{error && (
						<div
							className={`w-full p-3 rounded-lg border flex items-center gap-3 shadow-md text-sm ${
								error.includes("Invalid API Key") ||
								error.includes("Configure NewsAPI key") ||
								error.includes("Upgrade required") ||
								!IS_API_KEY_CONFIGURED
									? isDarkMode
										? "bg-amber-900/60 border-amber-700/40 text-amber-300"
										: "bg-amber-100 border-amber-300 text-amber-800"
									: isDarkMode
									? "bg-red-900/60 border-red-700/40 text-red-300"
									: "bg-red-100 border-red-300 text-red-800"
							}`}
						>
							<WifiOff className="h-5 w-5 flex-shrink-0" />
							<span>
								{error}
								{(error.includes("Invalid API Key") ||
									error.includes("Configure NewsAPI key") ||
									!IS_API_KEY_CONFIGURED) && (
									<>
										{" "}
										Get a free key:{" "}
										<a
											href="https://newsapi.org/"
											target="_blank"
											rel="noopener noreferrer"
											className="font-medium underline hover:opacity-80 transition-opacity"
										>
											newsapi.org
										</a>
									</>
								)}
							</span>
						</div>
					)}
					{!isLoading &&
						!error &&
						displayedNews.length === 0 &&
						totalResults === 0 && (
							<p className={isDarkMode ? "text-slate-500" : "text-slate-500"}>
								No articles found for your current selection. Try adjusting
								filters or search terms.
							</p>
						)}
				</div>

				{/* News Articles Grid */}
				<section aria-live="polite" aria-atomic="true">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						{isLoading ? (
							// Loading skeletons
							Array.from({ length: ARTICLES_PER_PAGE }).map((_, index) => (
								<ArticleSkeleton key={`skeleton-${index}`} />
							))
						) : displayedNews.length > 0 ? (
							// Display news articles
							displayedNews.map((article) => (
								<article
									key={article.id}
									className={`article-card relative rounded-xl overflow-hidden transition-all duration-300 ease-in-out group flex flex-col border hover:shadow-xl cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${
										isDarkMode
											? "bg-slate-800/80 border-slate-700/70 hover:bg-slate-800 hover:border-cyan-700/60 shadow-lg shadow-black/25 focus-within:ring-cyan-500 focus-within:ring-offset-slate-900"
											: "bg-white/95 border-slate-200/90 hover:border-slate-300 shadow-md hover:shadow-slate-300/60 focus-within:ring-sky-500 focus-within:ring-offset-white"
									}`}
									onClick={() => openArticleModal(article)}
									onKeyPress={(e) => {
										if (e.key === "Enter" || e.key === " ")
											openArticleModal(article);
									}}
									tabIndex={0}
									role="button"
									aria-labelledby={`article-title-${article.id}`}
									aria-describedby={`article-desc-${article.id}`}
								>
									{/* Article Image Section */}
									<div
										className={`article-image relative w-full h-40 sm:h-48 overflow-hidden ${
											isDarkMode ? "bg-slate-700" : "bg-slate-200"
										}`}
									>
										{!article.urlToImage && !article.imageError ? (
											<div
												className={`flex flex-col items-center justify-center h-full w-full text-center p-4 ${
													isDarkMode ? "bg-slate-800/50" : "bg-slate-100/80"
												}`}
											>
												<ImageOff
													size={36}
													className={`mb-2 ${
														isDarkMode ? "text-slate-500" : "text-slate-400"
													}`}
													strokeWidth={1.5}
												/>
												<span
													className={`text-xs font-medium ${
														isDarkMode ? "text-slate-500" : "text-slate-500"
													}`}
												>
													No Image
												</span>
											</div>
										) : article.imageError ? (
											<div
												className={`flex flex-col items-center justify-center h-full w-full text-center p-4 ${
													isDarkMode ? "bg-slate-800/50" : "bg-slate-100/80"
												}`}
											>
												<ImageOff
													size={36}
													className={`mb-2 ${
														isDarkMode ? "text-slate-500" : "text-slate-400"
													}`}
													strokeWidth={1.5}
												/>
												<span
													className={`text-xs font-medium ${
														isDarkMode ? "text-slate-500" : "text-slate-500"
													}`}
												>
													Image Error
												</span>
											</div>
										) : (
											<>
												<img
													src={article.urlToImage! || "/placeholder.svg"}
													alt=""
													className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:scale-105 ${
														article.imageLoaded ? "opacity-100" : "opacity-0"
													}`}
													onLoad={() => handleImageLoad(article.id)}
													onError={() => handleImageError(article.id)}
													loading="lazy"
												/>
												{!article.imageLoaded && !article.imageError && (
													<div
														className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
															isDarkMode ? "bg-slate-700/60" : "bg-slate-200/60"
														}`}
													>
														<div
															className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
																isDarkMode
																	? "border-cyan-300"
																	: "border-sky-600"
															}`}
														></div>
													</div>
												)}
											</>
										)}
										{/* Image Badges */}
										<div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 pointer-events-none">
											{article.isTrending && (
												<div
													className={`px-2 py-0.5 rounded text-xs backdrop-blur-sm flex items-center gap-1 shadow ${
														isDarkMode
															? "bg-amber-900/70 text-amber-200 border border-amber-700/30"
															: "bg-amber-500/70 text-white border border-amber-600/30"
													}`}
													title="Trending"
												>
													<TrendingUp size={10} /> Trending
												</div>
											)}
											{readingHistory.includes(article.id) && (
												<div
													className={`px-2 py-0.5 rounded text-xs backdrop-blur-sm flex items-center gap-1 shadow ${
														isDarkMode
															? "bg-black/60 text-slate-200 border border-slate-600/30"
															: "bg-white/70 text-slate-700 border border-slate-200/50"
													}`}
													title="Already Read"
												>
													<Clock size={12} /> Read
												</div>
											)}
											{readLater.includes(article.id) && (
												<div
													className={`px-2 py-0.5 rounded text-xs backdrop-blur-sm flex items-center gap-1 shadow ${
														isDarkMode
															? "bg-cyan-900/70 text-cyan-100 border border-cyan-700/30"
															: "bg-sky-600/80 text-white border border-sky-700/30"
													}`}
													title="Saved for Later"
												>
													<BookmarkPlus size={12} /> Saved
												</div>
											)}
										</div>
										{/* Action Buttons */}
										<div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
											<button
												onClick={(e) => toggleFavorite(article.id, e)}
												className={`touch-target p-1.5 rounded-full transition-all duration-200 backdrop-blur-sm ${
													favorites.includes(article.id)
														? isDarkMode
															? "bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30"
															: "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"
														: isDarkMode
														? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 hover:text-yellow-300"
														: "bg-white/60 text-slate-600 hover:bg-white/80 hover:text-amber-600"
												}`}
												aria-label={
													favorites.includes(article.id)
														? "Remove from favorites"
														: "Add to favorites"
												}
												title={
													favorites.includes(article.id)
														? "Remove from favorites"
														: "Add to favorites"
												}
											>
												<Bookmark
													size={16}
													className={
														favorites.includes(article.id) ? "fill-current" : ""
													}
												/>
											</button>
											<button
												onClick={(e) => shareArticle(article, e)}
												className={`touch-target p-1.5 rounded-full backdrop-blur-sm transition-colors duration-200 ${
													isDarkMode
														? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 hover:text-slate-100"
														: "bg-white/60 text-slate-600 hover:bg-white/80 hover:text-slate-800"
												}`}
												aria-label="Share article"
												title="Share article"
											>
												<Share2 size={16} />
											</button>
										</div>
									</div>
									{/* Article Content Section */}
									<div className="p-3 sm:p-5 flex flex-col flex-grow">
										<span
											className={`inline-block self-start px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 tracking-wide ${
												isDarkMode
													? "bg-slate-700 text-cyan-300"
													: "bg-sky-100 text-sky-700"
											}`}
										>
											{article.category}
										</span>
										<h3
											id={`article-title-${article.id}`}
											className={`text-sm sm:text-base md:text-lg font-semibold mb-2 leading-tight flex-grow group-hover:text-[color:var(--primary-color)] transition-colors ${
												isDarkMode ? "text-slate-100" : "text-slate-800"
											}`}
										>
											{article.title}
										</h3>
										<p
											id={`article-desc-${article.id}`}
											className={`text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3 ${
												isDarkMode ? "text-slate-400" : "text-slate-600"
											}`}
										>
											{article.description || "No description available."}
										</p>
										<div
											className={`mt-auto pt-3 border-t text-xs flex justify-between items-center ${
												isDarkMode
													? "border-slate-700/50 text-slate-500"
													: "border-slate-200/80 text-slate-500"
											}`}
										>
											<span className="truncate pr-2">
												{article.source.name}
											</span>
											<span className="whitespace-nowrap">
												{formatShortDate(article.publishedAt)}
											</span>
										</div>
									</div>
								</article>
							))
						) : (
							// No Articles Found State
							<div
								className={`col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 px-6 rounded-lg border-2 border-dashed flex flex-col items-center justify-center min-h-[400px] ${
									isDarkMode
										? "border-slate-700 bg-slate-800/40"
										: "border-slate-300 bg-slate-50/60"
								}`}
							>
								<Newspaper
									className={isDarkMode ? "text-slate-600" : "text-slate-400"}
									size={48}
									strokeWidth={1}
								/>
								<h3
									className={`text-xl font-semibold mt-6 mb-2 ${
										isDarkMode ? "text-slate-200" : "text-slate-700"
									}`}
								>
									{showFavoritesOnly
										? "No Favorites Yet"
										: showTrendingOnly
										? "No Trending Articles"
										: "No Articles Found"}
								</h3>
								<p
									className={`max-w-md mx-auto mb-8 ${
										isDarkMode ? "text-slate-400" : "text-slate-600"
									}`}
								>
									{showFavoritesOnly
										? "You haven't added any articles to your favorites. Use the bookmark icon!"
										: showTrendingOnly
										? "There are no trending articles that match your criteria."
										: debouncedSearchTerm
										? `We couldn't find articles matching "${debouncedSearchTerm}"${
												selectedCategory !== "All"
													? ` in "${selectedCategory}"`
													: ""
										  }.`
										: `There are currently no articles available for "${selectedCategory}".`}
									<br className="mt-2" /> Try adjusting your search or filter
									criteria.
								</p>
								<div className="flex flex-wrap justify-center gap-3">
									{(debouncedSearchTerm ||
										selectedCategory !== "All" ||
										showFavoritesOnly ||
										showTrendingOnly) && (
										<button
											onClick={() => {
												clearSearch();
												handleCategoryChange("All");
												setShowFavoritesOnly(false);
												setShowTrendingOnly(false);
											}}
											className={getThemeClasses.primaryBtn}
										>
											<RefreshCw size={16} /> Reset View
										</button>
									)}
								</div>
								{!IS_API_KEY_CONFIGURED &&
									!error?.includes("Invalid API Key") && (
										<p
											className={`${getThemeClasses.textTertiary} mt-6 text-xs`}
										>
											Note: Showing sample data. Configure API key for live
											news.
										</p>
									)}
							</div>
						)}
					</div>
				</section>

				{/* Pagination */}
				{!isLoading &&
					IS_API_KEY_CONFIGURED &&
					displayedNews.length > 0 &&
					totalPages > 1 && <PaginationControls />}
			</main>

			{/* Footer */}
			<footer
				className={`mt-16 py-12 border-t ${
					isDarkMode
						? "border-slate-700/60 bg-slate-900/50"
						: "border-slate-200/80 bg-slate-50/50"
				}`}
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
						{/* Logo & Description */}
						<div>
							<div className="flex items-center gap-2 mb-4">
								<Newspaper
									className={`h-6 w-6 ${getThemeClasses.accentPrimary}`}
								/>
								<span
									className={`text-lg font-bold ${getThemeClasses.textPrimary}`}
								>
									Hub
								</span>
							</div>
							<p className={`text-sm mb-4 ${getThemeClasses.textTertiary}`}>
								Your streamlined source for current events, bringing you top
								headlines from trusted sources across different categories.
							</p>
							<div className="flex space-x-3">
								<a
									href="#"
									className={`p-2 rounded-full transition-colors ${
										isDarkMode
											? "text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
											: "text-slate-500 hover:text-sky-600 hover:bg-slate-200"
									}`}
									aria-label="Twitter"
								>
									<Twitter size={18} />
								</a>
								<a
									href="#"
									className={`p-2 rounded-full transition-colors ${
										isDarkMode
											? "text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
											: "text-slate-500 hover:text-sky-600 hover:bg-slate-200"
									}`}
									aria-label="Facebook"
								>
									<Facebook size={18} />
								</a>
								<a
									href="#"
									className={`p-2 rounded-full transition-colors ${
										isDarkMode
											? "text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
											: "text-slate-500 hover:text-sky-600 hover:bg-slate-200"
									}`}
									aria-label="Instagram"
								>
									<Instagram size={18} />
								</a>
								<a
									href="#"
									className={`p-2 rounded-full transition-colors ${
										isDarkMode
											? "text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
											: "text-slate-500 hover:text-sky-600 hover:bg-slate-200"
									}`}
									aria-label="GitHub"
								>
									<Github size={18} />
								</a>
							</div>
						</div>

						{/* Quick Links */}
						<div>
							<h3
								className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
									isDarkMode ? "text-slate-300" : "text-slate-800"
								}`}
							>
								Quick Links
							</h3>
							<ul className="space-y-2">
								{categories.slice(0, 6).map((category) => (
									<li key={category}>
										<button
											onClick={() => handleCategoryChange(category)}
											className={`text-sm transition-colors cursor-pointer ${
												isDarkMode
													? "text-slate-400 hover:text-cyan-400"
													: "text-slate-600 hover:text-sky-600"
											}`}
										>
											{category === "All" ? "All Categories" : category}
										</button>
									</li>
								))}
							</ul>
						</div>

						{/* Resources */}
						<div>
							<h3
								className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
									isDarkMode ? "text-slate-300" : "text-slate-800"
								}`}
							>
								Resources
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										API Documentation
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										Developer Resources
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										Feedback
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										Status
									</a>
								</li>
							</ul>
						</div>

						{/* Legal */}
						<div>
							<h3
								className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
									isDarkMode ? "text-slate-300" : "text-slate-800"
								}`}
							>
								Legal
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										Cookie Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										GDPR Compliance
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm transition-colors ${
											isDarkMode
												? "text-slate-400 hover:text-cyan-400"
												: "text-slate-600 hover:text-sky-600"
										}`}
									>
										Accessibility
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div
						className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
							isDarkMode ? "border-slate-700/40" : "border-slate-200/60"
						}`}
					>
						<div className="flex items-center gap-2">
							<User className={`h-5 w-5 ${getThemeClasses.accentPrimary}`} />
							<span
								className={`text-sm font-medium ${
									isDarkMode ? "text-slate-300" : "text-slate-700"
								}`}
							>
								Ryouta Kise
							</span>
						</div>
						<div className={`text-sm ${getThemeClasses.textTertiary}`}>
							<span>Hub &copy; {new Date().getFullYear()} | </span>
							<span>
								Powered by{" "}
								<a
									href="https://newsapi.org/"
									target="_blank"
									rel="noopener noreferrer"
									className={`font-medium transition hover:underline ${
										isDarkMode
											? "text-cyan-400 hover:text-cyan-300"
											: "text-sky-600 hover:text-sky-700"
									}`}
								>
									NewsAPI.org
								</a>
							</span>
						</div>
						<div className="flex items-center gap-4">
							<button
								onClick={openAboutModal}
								className={`text-sm transition-colors hover:underline ${
									isDarkMode
										? "text-slate-400 hover:text-cyan-400"
										: "text-slate-600 hover:text-sky-600"
								}`}
							>
								About
							</button>
							<a
								href="#"
								className={`text-sm transition-colors hover:underline ${
									isDarkMode
										? "text-slate-400 hover:text-cyan-400"
										: "text-slate-600 hover:text-sky-600"
								}`}
							>
								Contact
							</a>
							<a
								href="#"
								className={`text-sm transition-colors hover:underline ${
									isDarkMode
										? "text-slate-400 hover:text-cyan-400"
										: "text-slate-600 hover:text-sky-600"
								}`}
							>
								Support
							</a>
						</div>
					</div>
				</div>
			</footer>

			{/* Modals */}
			{isArticleModalOpen && <ArticleModal />}
			{isAboutModalOpen && <AboutModal />}
			{mobileMenuOpen && <MobileMenu />}

			{/* Toast Notification */}
			<div
				id="snackbar"
				role="alert"
				className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg z-[60] transition-all duration-500 text-sm font-medium flex items-center gap-2 ${
					toast
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-4 pointer-events-none"
				} ${
					toast?.type === "error"
						? isDarkMode
							? "bg-red-900 text-red-100"
							: "bg-red-100 text-red-900"
						: toast?.type === "success"
						? isDarkMode
							? "bg-green-900 text-green-100"
							: "bg-green-100 text-green-900"
						: isDarkMode
						? "bg-slate-800 text-slate-100"
						: "bg-slate-900 text-white"
				}`}
			>
				{toast?.message}
			</div>

			{/* Global Styles */}
			<style jsx global>{`
				/* Custom Properties */
				:root {
					--primary-color: ${isDarkMode ? "#22d3ee" : "#0ea5e9"};
					--primary-hover: ${isDarkMode ? "#67e8f9" : "#0284c7"};
					color-scheme: ${isDarkMode ? "dark" : "light"};
				}

				/* Global Styles */
				html,
				body {
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
						Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
						"Helvetica Neue", sans-serif;
					-webkit-text-size-adjust: 100%;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					overscroll-behavior-y: contain;
				}

				/* Responsive touch targets */
				@media (max-width: 640px) {
					button,
					a {
						min-height: 40px;
						min-width: 40px;
					}
				}

				/* Custom Scrollbars */
				.modal-scrollbar::-webkit-scrollbar,
				.mobile-scrollbar::-webkit-scrollbar {
					width: 6px;
					height: 6px;
				}

				.modal-scrollbar::-webkit-scrollbar-track,
				.mobile-scrollbar::-webkit-scrollbar-track {
					background: ${isDarkMode
						? "rgba(30, 41, 59, 0.1)"
						: "rgba(248, 250, 252, 0.1)"};
					border-radius: 4px;
				}

				.modal-scrollbar::-webkit-scrollbar-thumb,
				.mobile-scrollbar::-webkit-scrollbar-thumb {
					background-color: ${isDarkMode
						? "rgba(75, 85, 99, 0.8)"
						: "rgba(156, 163, 175, 0.8)"};
					border-radius: 4px;
				}

				.modal-scrollbar::-webkit-scrollbar-thumb:hover,
				.mobile-scrollbar::-webkit-scrollbar-thumb:hover {
					background-color: ${isDarkMode
						? "rgba(107, 114, 128, 0.8)"
						: "rgba(107, 114, 128, 0.8)"};
				}

				/* Hide Scrollbars for Categories */
				.category-scrollbar::-webkit-scrollbar,
				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}

				.category-scrollbar,
				.hide-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				/* Animations */
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(-5px) scale(0.98);
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.2s ease-out forwards;
				}

				/* Mobile Touch Scrolling */
				@media (hover: none) and (pointer: coarse) {
					.modal-scrollbar,
					.mobile-scrollbar {
						-webkit-overflow-scrolling: touch;
						scrollbar-width: thin;
					}

					button,
					a {
						-webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
					}
				}

				/* Dark mode overrides */
				.dark-mode {
					color-scheme: dark;
				}
			`}</style>
		</div>
	);
};

export default NewsHub;
