"use client";

import React, {
	useState,
	useEffect,
	useRef,
	createContext,
	useContext,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Section {
	id: string;
	title: string;
	content: string;
}

interface Magazine {
	id: number;
	title: string;
	date: string;
	issue: string;
	coverImage: string;
	description: string;
	category: string;
	isExclusive: boolean;
	sections: Section[];
	popularity: number;
	readTime: string;
}

interface SubscriptionPlan {
	id: string;
	name: string;
	price: string;
	features: string[];
	buttonText: string;
	recommended: boolean;
}

interface BookmarkItem {
	magazineId: number;
	sectionId: string;
	magazineTitle: string;
	sectionTitle: string;
	date: string;
}

interface UserProfile {
	name: string;
	email: string;
	avatar: string;
	joinedDate: string;
	preferences: {
		notificationsEnabled: boolean;
		defaultFontSize: number;
		prefersDarkMode: boolean;
	};
}

interface ThemeContextType {
	darkMode: boolean;
	toggleDarkMode: () => void;
	fontSize: number;
	setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const MagazinePortal: React.FC = () => {
	const [currentPage, setCurrentPage] = useState<string>("home");
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [fontSize, setFontSize] = useState<number>(16);
	const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
	const [activeSection, setActiveSection] = useState<string>("introduction");
	const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
	const [isSignupModalOpen, setIsSignupModalOpen] = useState<boolean>(false);
	const [isDownloadModalOpen, setIsDownloadModalOpen] =
		useState<boolean>(false);
	const [currentMagazine, setCurrentMagazine] = useState<Magazine | null>(null);
	const [subscriptionStatus, setSubscriptionStatus] = useState<string>("free");
	const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] =
		useState<boolean>(false);
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [newsletterEmail, setNewsletterEmail] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [bookmarksModalOpen, setBookmarksModalOpen] = useState<boolean>(false);
	const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
	const [searchResults, setSearchResults] = useState<Magazine[]>([]);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] =
		useState<boolean>(false);
	const [isReadingMode, setIsReadingMode] = useState<boolean>(false);
	const [readingProgress, setReadingProgress] = useState<number>(0);
	const [userProfile, setUserProfile] = useState<UserProfile>({
		name: "Guest User",
		email: "",
		avatar:
			"https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		joinedDate: "May 2025",
		preferences: {
			notificationsEnabled: true,
			defaultFontSize: 16,
			prefersDarkMode: false,
		},
	});
	const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
	const [currentPage1, setCurrentPage1] = useState<number>(1);
	const [issuesPerPage] = useState<number>(8);
	const [likedArticles, setLikedArticles] = useState<number[]>([]);

	const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
		introduction: useRef<HTMLDivElement>(null),
		feature1: useRef<HTMLDivElement>(null),
		feature2: useRef<HTMLDivElement>(null),
		conclusion: useRef<HTMLDivElement>(null),
	};

	const contentRef = useRef<HTMLDivElement>(null);

	const categories = [
		{ id: "all", name: "All Issues" },
		{ id: "technology", name: "Technology" },
		{ id: "business", name: "Business" },
		{ id: "health", name: "Health & Wellness" },
		{ id: "sustainability", name: "Sustainability" },
		{ id: "culture", name: "Culture" },
		{ id: "science", name: "Science" },
	];

	const magazines: Magazine[] = [
		{
			id: 1,
			title: "The Digital Frontier",
			date: "May 1, 2025",
			issue: "Issue #42",
			coverImage:
				"https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description:
				"Exploring the latest in technology and digital transformation",
			category: "technology",
			isExclusive: false,
			popularity: 95,
			readTime: "12 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"The digital landscape is evolving at an unprecedented pace. In this issue, we delve into the transformative technologies shaping our future...",
				},
				{
					id: "feature1",
					title: "AI Revolution",
					content:
						"Artificial intelligence continues to revolutionize industries across the globe. From healthcare to finance, AI-driven solutions are optimizing processes and enabling new possibilities...",
				},
				{
					id: "feature2",
					title: "Cybersecurity Challenges",
					content:
						"As digital systems become more integrated into our daily lives, cybersecurity threats evolve in complexity. Organizations must adopt robust security frameworks...",
				},
				{
					id: "conclusion",
					title: "Looking Ahead",
					content:
						"The future of technology promises exciting advancements. Quantum computing, extended reality, and sustainable tech are all on the horizon...",
				},
			],
		},
		{
			id: 2,
			title: "Sustainable Tomorrow",
			date: "April 24, 2025",
			issue: "Issue #41",
			coverImage:
				"https://images.unsplash.com/photo-1719825523711-eda3221c111c?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			description: "Innovations in sustainability and green technology",
			category: "sustainability",
			isExclusive: false,
			popularity: 87,
			readTime: "15 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Sustainability has become the cornerstone of modern innovation. This issue explores groundbreaking developments in renewable energy...",
				},
				{
					id: "feature1",
					title: "Renewable Energy",
					content:
						"Solar and wind power technologies have reached new efficiency milestones. We examine the latest breakthroughs and their impact...",
				},
				{
					id: "feature2",
					title: "Circular Economy",
					content:
						"The concept of a circular economy is gaining traction globally. Companies are redesigning products and processes to eliminate waste...",
				},
				{
					id: "conclusion",
					title: "Policy Developments",
					content:
						"Governments worldwide are implementing ambitious climate policies. We analyze recent legislation and its implications for businesses...",
				},
			],
		},
		{
			id: 3,
			title: "Health & Wellness Redefined",
			date: "April 17, 2025",
			issue: "Issue #40",
			coverImage:
				"https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "New approaches to health and wellness in the digital age",
			category: "health",
			isExclusive: true,
			popularity: 92,
			readTime: "10 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"The intersection of technology and healthcare is yielding remarkable advances in personal wellness...",
				},
				{
					id: "feature1",
					title: "Digital Health Platforms",
					content:
						"Telemedicine and health monitoring apps are transforming how we manage our wellbeing...",
				},
				{
					id: "feature2",
					title: "Mental Health Innovation",
					content:
						"New therapeutic approaches and digital tools are making mental healthcare more accessible...",
				},
				{
					id: "conclusion",
					title: "The Future of Healthcare",
					content:
						"Personalized medicine and AI diagnostics promise to revolutionize treatment approaches...",
				},
			],
		},
		{
			id: 4,
			title: "Business Innovation Quarterly",
			date: "April 10, 2025",
			issue: "Issue #39",
			coverImage:
				"https://images.unsplash.com/photo-1607703703674-df96af81dffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "Strategies and insights for the modern business landscape",
			category: "business",
			isExclusive: true,
			popularity: 88,
			readTime: "18 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Business models continue to evolve in response to technological disruption and changing consumer preferences...",
				},
				{
					id: "feature1",
					title: "Remote Work Revolution",
					content:
						"The shift to distributed workforces has fundamentally changed organizational structures and management approaches...",
				},
				{
					id: "feature2",
					title: "Digital Transformation",
					content:
						"Companies across sectors are embracing digital tools to streamline operations and enhance customer experiences...",
				},
				{
					id: "conclusion",
					title: "Leadership for the Future",
					content:
						"A new generation of business leaders is emerging with skills suited to navigating complexity and change...",
				},
			],
		},
		{
			id: 5,
			title: "Science Horizons",
			date: "April 3, 2025",
			issue: "Issue #38",
			coverImage:
				"https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "Exploring the frontiers of scientific discovery",
			category: "science",
			isExclusive: false,
			popularity: 83,
			readTime: "14 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Scientific breakthroughs continue to push the boundaries of human knowledge and capability...",
				},
				{
					id: "feature1",
					title: "Space Exploration",
					content:
						"Recent missions to Mars and beyond are yielding fascinating insights about our solar system...",
				},
				{
					id: "feature2",
					title: "Genomics Revolution",
					content:
						"Advanced sequencing technologies are transforming our understanding of genetics and disease...",
				},
				{
					id: "conclusion",
					title: "Ethics of Science",
					content:
						"As scientific capabilities expand, so too do the ethical considerations that must guide research...",
				},
			],
		},
		{
			id: 6,
			title: "Cultural Canvas",
			date: "March 27, 2025",
			issue: "Issue #37",
			coverImage:
				"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "Analyzing trends in arts, media, and society",
			category: "culture",
			isExclusive: true,
			popularity: 79,
			readTime: "12 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Cultural expressions reflect and shape our collective identity and values...",
				},
				{
					id: "feature1",
					title: "Digital Arts",
					content:
						"New media platforms are democratizing artistic expression and audience engagement...",
				},
				{
					id: "feature2",
					title: "Global Influences",
					content:
						"Cross-cultural exchange is accelerating, creating rich hybrid forms of expression...",
				},
				{
					id: "conclusion",
					title: "Cultural Preservation",
					content:
						"As globalization advances, efforts to preserve cultural heritage take on new urgency...",
				},
			],
		},
		{
			id: 7,
			title: "Next-Gen Tech Review",
			date: "March 20, 2025",
			issue: "Issue #36",
			coverImage:
				"https://images.unsplash.com/photo-1695462131736-8308d61fd4f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			description: "Hands-on with the latest consumer technology",
			category: "technology",
			isExclusive: false,
			popularity: 91,
			readTime: "16 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Consumer technology continues to evolve at a rapid pace, with new devices reshaping daily life...",
				},
				{
					id: "feature1",
					title: "Wearable Innovation",
					content:
						"The latest generation of smart watches and health trackers offer unprecedented capabilities...",
				},
				{
					id: "feature2",
					title: "Smart Home Ecosystems",
					content:
						"Connected home devices are becoming more integrated and intuitive to use...",
				},
				{
					id: "conclusion",
					title: "Digital Well-being",
					content:
						"As technology becomes more embedded in our lives, balancing connectivity with mental health is crucial...",
				},
			],
		},
		{
			id: 8,
			title: "Global Economics Insight",
			date: "March 13, 2025",
			issue: "Issue #35",
			coverImage:
				"https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "Analysis of economic trends and financial markets",
			category: "business",
			isExclusive: true,
			popularity: 86,
			readTime: "20 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Economic forces are reshaping global markets and creating new challenges and opportunities...",
				},
				{
					id: "feature1",
					title: "Emerging Markets",
					content:
						"Developing economies are establishing themselves as key players in the global marketplace...",
				},
				{
					id: "feature2",
					title: "Sustainable Finance",
					content:
						"ESG investing is shifting capital toward environmentally and socially responsible businesses...",
				},
				{
					id: "conclusion",
					title: "Future of Currency",
					content:
						"Digital currencies and payment systems are transforming how value is exchanged...",
				},
			],
		},
		{
			id: 9,
			title: "Wellness Wisdom",
			date: "March 6, 2025",
			issue: "Issue #34",
			coverImage:
				"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "Holistic approaches to health and wellbeing",
			category: "health",
			isExclusive: false,
			popularity: 84,
			readTime: "13 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"A holistic view of wellness encompasses physical, mental, and spiritual dimensions of health...",
				},
				{
					id: "feature1",
					title: "Mindfulness Practices",
					content:
						"Evidence-based meditation and mindfulness techniques for stress reduction and mental clarity...",
				},
				{
					id: "feature2",
					title: "Nutrition Science",
					content:
						"Current research on dietary approaches that support optimal health and longevity...",
				},
				{
					id: "conclusion",
					title: "Sleep Optimization",
					content:
						"Strategies for improving sleep quality and its profound effects on overall wellbeing...",
				},
			],
		},
		{
			id: 10,
			title: "Green Infrastructure",
			date: "February 27, 2025",
			issue: "Issue #33",
			coverImage:
				"https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "Building sustainable cities and communities",
			category: "sustainability",
			isExclusive: true,
			popularity: 81,
			readTime: "17 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Urban planning is increasingly focused on creating sustainable, resilient, and livable cities...",
				},
				{
					id: "feature1",
					title: "Eco-friendly Architecture",
					content:
						"Innovative building designs that minimize environmental impact and maximize efficiency...",
				},
				{
					id: "feature2",
					title: "Transportation Revolution",
					content:
						"Next-generation mobility solutions are reducing emissions and improving urban connectivity...",
				},
				{
					id: "conclusion",
					title: "Community Engagement",
					content:
						"Successful sustainability initiatives depend on active participation from residents and stakeholders...",
				},
			],
		},
		{
			id: 11,
			title: "Quantum Computing Today",
			date: "February 20, 2025",
			issue: "Issue #32",
			coverImage:
				"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "Understanding the next computing revolution",
			category: "technology",
			isExclusive: true,
			popularity: 93,
			readTime: "15 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Quantum computing represents a fundamental shift in computational capability and approach...",
				},
				{
					id: "feature1",
					title: "Quantum Principles",
					content:
						"The key concepts of superposition and entanglement that power quantum computation...",
				},
				{
					id: "feature2",
					title: "Current Applications",
					content:
						"Early quantum algorithms are already showing promise in specific domains...",
				},
				{
					id: "conclusion",
					title: "Quantum Future",
					content:
						"The roadmap for quantum technology development and its potential impacts...",
				},
			],
		},
		{
			id: 12,
			title: "Artistic Renaissance",
			date: "February 13, 2025",
			issue: "Issue #31",
			coverImage:
				"https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
			description: "Exploring new movements in contemporary art",
			category: "culture",
			isExclusive: false,
			popularity: 78,
			readTime: "11 min read",
			sections: [
				{
					id: "introduction",
					title: "Introduction",
					content:
						"Contemporary art is experiencing a renaissance fueled by new technologies and cultural shifts...",
				},
				{
					id: "feature1",
					title: "Digital Creativity",
					content:
						"NFTs and blockchain are creating new economic models for artists and collectors...",
				},
				{
					id: "feature2",
					title: "Immersive Installations",
					content:
						"Interactive and experiential art is blurring the line between creator and audience...",
				},
				{
					id: "conclusion",
					title: "Democratization of Art",
					content:
						"Social media and digital platforms are making art more accessible to global audiences...",
				},
			],
		},
	];

	const subscriptionPlans: SubscriptionPlan[] = [
		{
			id: "free",
			name: "Free Plan",
			price: "$0/month",
			features: [
				"Access to free weekly issues",
				"Basic article viewer",
				"Mobile and desktop compatible",
			],
			buttonText: "Choose",
			recommended: false,
		},
		{
			id: "basic",
			name: "Basic Plan",
			price: "$4.99/month",
			features: [
				"All Free Plan features",
				"Access to archive (last 3 months)",
				"Download magazines as PDF",
				"Remove ads",
			],
			buttonText: "Upgrade",
			recommended: false,
		},
		{
			id: "premium",
			name: "Premium Plan",
			price: "$9.99/month",
			features: [
				"All Basic Plan features",
				"Exclusive premium content",
				"Full archive access",
				"Early access to new issues",
				"Member-only webinars",
			],
			buttonText: "Upgrade",
			recommended: true,
		},
	];

	useEffect(() => {
		const handleScroll = () => {
			if (contentRef.current && currentPage === "article") {
				const element = contentRef.current;
				const totalHeight = element.scrollHeight - element.clientHeight;
				const scrollPosition = element.scrollTop;

				if (totalHeight > 0) {
					setReadingProgress((scrollPosition / totalHeight) * 100);
				}
			}
		};

		const contentElement = contentRef.current;
		if (contentElement) {
			contentElement.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (contentElement) {
				contentElement.removeEventListener("scroll", handleScroll);
			}
		};
	}, [currentPage, contentRef]);

	useEffect(() => {
		if (isReadingMode && currentPage === "article") {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isReadingMode, currentPage]);

	const notify = (message: string) => {
		toast.info(message, {
			position: "bottom-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			style: {
				background: darkMode ? "#1e3a8a" : "white",
				color: darkMode ? "white" : "#1e3a8a",
				borderRadius: "10px",
				boxShadow: darkMode
					? "inset 2px 2px 5px rgba(255, 255, 255, 0.1), inset -3px -3px 7px rgba(0, 0, 0, 0.5)"
					: "inset 2px 2px 5px rgba(0, 0, 0, 0.05), inset -3px -3px 7px rgba(255, 255, 255, 0.6)",
			},
		});
	};

	const toggleBookmark = (magazineId: number, sectionId: string) => {
		const currentMag = magazines.find((m) => m.id === magazineId);
		if (!currentMag) return;

		const sectionInfo = currentMag.sections.find((s) => s.id === sectionId);
		if (!sectionInfo) return;

		const bookmarkItem: BookmarkItem = {
			magazineId,
			sectionId,
			magazineTitle: currentMag.title,
			sectionTitle: sectionInfo.title,
			date: currentMag.date,
		};

		const existingBookmarkIndex = bookmarks.findIndex(
			(b) => b.magazineId === magazineId && b.sectionId === sectionId
		);

		if (existingBookmarkIndex >= 0) {
			const newBookmarks = [...bookmarks];
			newBookmarks.splice(existingBookmarkIndex, 1);
			setBookmarks(newBookmarks);
			notify("Bookmark removed");
		} else {
			setBookmarks([...bookmarks, bookmarkItem]);
			notify("Bookmark added");

			const bookmarkButton = document.getElementById(
				`bookmark-${magazineId}-${sectionId}`
			);
			if (bookmarkButton) {
				bookmarkButton.classList.add("bookmark-pulse");
				setTimeout(() => {
					bookmarkButton.classList.remove("bookmark-pulse");
				}, 700);
			}
		}
	};

	const navigateTo = (page: string, magazineId: number | null = null) => {
		setCurrentPage(page);
		setIsMenuOpen(false);
		setIsReadingMode(false);

		if (page === "article" && magazineId) {
			const magazine = magazines.find((m) => m.id === magazineId);
			if (magazine) {
				if (magazine.isExclusive && subscriptionStatus === "free") {
					notify("This content requires a premium subscription");
					setIsSubscriptionModalOpen(true);
					return;
				}
				setCurrentMagazine(magazine);
				setActiveSection("introduction");

				setReadingProgress(0);

				window.scrollTo(0, 0);

				console.log(`Article view: ${magazine.title}`);
			}
		}
	};

	const scrollToSection = (sectionId: string) => {
		setActiveSection(sectionId);
		const ref = sectionRefs[sectionId];
		if (ref && ref.current) {
			ref.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const toggleLoginModal = () => {
		setIsLoginModalOpen(!isLoginModalOpen);
		setIsSignupModalOpen(false);
	};

	const toggleSignupModal = () => {
		setIsSignupModalOpen(!isSignupModalOpen);
		setIsLoginModalOpen(false);
	};

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			notify("Please fill in all fields");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			notify("Please enter a valid email address");
			return;
		}

		setIsLoggedIn(true);
		setIsLoginModalOpen(false);

		setUserProfile({
			...userProfile,
			name: email.split("@")[0],
			email: email,
		});

		notify("Successfully logged in!");

		setEmail("");
		setPassword("");
	};

	const handleSignup = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !email || !password || !confirmPassword) {
			notify("Please fill in all fields");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			notify("Please enter a valid email address");
			return;
		}

		if (password.length < 8) {
			notify("Password must be at least 8 characters");
			return;
		}

		if (password !== confirmPassword) {
			notify("Passwords do not match");
			return;
		}

		setIsLoggedIn(true);
		setIsSignupModalOpen(false);

		setUserProfile({
			...userProfile,
			name: name,
			email: email,
		});

		notify("Account created successfully!");

		setName("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
	};

	const toggleSubscriptionModal = () => {
		if (!isLoggedIn) {
			notify("Please log in to manage your subscription");
			toggleLoginModal();
			return;
		}
		setIsSubscriptionModalOpen(!isSubscriptionModalOpen);
	};

	const changeSubscription = (planId: string) => {
		if (planId === subscriptionStatus) {
			notify("You are already on this plan");
			return;
		}

		setSubscriptionStatus(planId);
		setIsSubscriptionModalOpen(false);
		notify(`Subscription updated to ${planId} plan!`);
	};

	const toggleDownloadModal = () => {
		if (!isLoggedIn) {
			notify("Please log in to download magazines");
			toggleLoginModal();
			return;
		}

		if (subscriptionStatus === "free") {
			notify("Downloading requires a premium subscription");
			setIsSubscriptionModalOpen(true);
			return;
		}

		setIsDownloadModalOpen(!isDownloadModalOpen);
	};

	const handleNewsletterSubscribe = (e: React.FormEvent) => {
		e.preventDefault();

		if (!newsletterEmail) {
			notify("Please enter your email");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newsletterEmail)) {
			notify("Please enter a valid email address");
			return;
		}

		notify("Newsletter subscription successful!");
		setNewsletterEmail("");
	};

	const downloadMagazine = (format: string) => {
		notify(`Downloading magazine in ${format} format...`);
		setTimeout(() => {
			notify("Download complete!");
		}, 2000);
		setIsDownloadModalOpen(false);
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);

		setUserProfile({
			...userProfile,
			preferences: {
				...userProfile.preferences,
				prefersDarkMode: !darkMode,
			},
		});
	};

	const toggleBookmarksModal = () => {
		if (bookmarks.length === 0 && isLoggedIn) {
			notify("You don't have any bookmarks yet");
			return;
		}

		if (!isLoggedIn) {
			notify("Please log in to view your bookmarks");
			toggleLoginModal();
			return;
		}

		setBookmarksModalOpen(!bookmarksModalOpen);
	};

	const toggleSearchModal = () => {
		setIsSearchModalOpen(!isSearchModalOpen);
		if (!isSearchModalOpen) {
			setSearchTerm("");
			setSearchResults([]);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();

		if (!searchTerm) {
			notify("Please enter a search term");
			return;
		}

		const results = magazines.filter(
			(magazine) =>
				magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				magazine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				magazine.sections.some((section) =>
					section.content.toLowerCase().includes(searchTerm.toLowerCase())
				)
		);

		setSearchResults(results);

		if (results.length === 0) {
			notify("No results found");
		}
	};

	const toggleReadingMode = () => {
		setIsReadingMode(!isReadingMode);
	};

	const toggleProfileModal = () => {
		if (!isLoggedIn) {
			notify("Please log in to view your profile");
			toggleLoginModal();
			return;
		}

		setIsProfileModalOpen(!isProfileModalOpen);
	};

	const toggleProfileDropdown = () => {
		setIsProfileDropdownOpen(!isProfileDropdownOpen);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
		setIsProfileDropdownOpen(false);
		setSubscriptionStatus("free");
		notify("You have been logged out");
	};

	const toggleLikeArticle = (magazineId: number) => {
		if (!isLoggedIn) {
			notify("Please log in to like articles");
			toggleLoginModal();
			return;
		}

		if (likedArticles.includes(magazineId)) {
			setLikedArticles(likedArticles.filter((id) => id !== magazineId));
		} else {
			setLikedArticles([...likedArticles, magazineId]);

			const likeButton = document.getElementById(`like-${magazineId}`);
			if (likeButton) {
				likeButton.classList.add("like-pulse");
				setTimeout(() => {
					likeButton.classList.remove("like-pulse");
				}, 700);
			}
		}
	};

	const indexOfLastIssue = currentPage1 * issuesPerPage;
	const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;

	const filteredMagazines =
		categoryFilter === "all"
			? magazines
			: magazines.filter((magazine) => magazine.category === categoryFilter);

	const currentIssues = filteredMagazines.slice(
		indexOfFirstIssue,
		indexOfLastIssue
	);

	const totalPages = Math.ceil(filteredMagazines.length / issuesPerPage);

	const paginate = (pageNumber: number) => {
		if (pageNumber < 1 || pageNumber > totalPages) return;
		setCurrentPage1(pageNumber);

		window.scrollTo(0, 0);
	};

	const renderHomePage = () => (
		<div className="relative overflow-hidden">
			{}
			<div className="relative pt-10 pb-16 md:pt-20 md:pb-32 overflow-hidden">
				{}
				<div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-blue-900 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
				<div className="absolute bottom-0 left-0 w-64 h-64 md:w-80 md:h-80 bg-blue-800 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="flex flex-col md:flex-row items-center">
						<div className="md:w-1/2 mb-10 md:mb-0 animate-fadeIn">
							<h1
								className="text-3xl md:text-5xl font-bold mb-4 text-blue-900"
								style={{
									textShadow: darkMode
										? "2px 2px 4px rgba(0, 0, 0, 0.3)"
										: "2px 2px 4px rgba(0, 0, 0, 0.1)",
								}}
							>
								Discover The World Through Our Pages
							</h1>
							<p className="text-lg md:text-xl mb-8 text-gray-700">
								Immerse yourself in thought-provoking content with our weekly
								magazine releases. Stay informed about the latest developments
								across technology, business, health, and more.
							</p>
							<div className="flex flex-wrap gap-4">
								<button
									className="px-6 py-3 bg-blue-900 text-white rounded-lg shadow-neu-blue transform transition duration-300 hover:scale-105 hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed active:scale-95"
									onClick={() => navigateTo("issues")}
								>
									Browse Issues
								</button>
								<button
									className="px-6 py-3 bg-gray-200 text-blue-900 rounded-lg shadow-neu-light transform transition duration-300 hover:scale-105 hover:shadow-neu-light-hover active:shadow-neu-light-pressed active:scale-95"
									onClick={toggleSubscriptionModal}
								>
									Subscribe Now
								</button>
							</div>
						</div>
						<div className="md:w-1/2 relative animate-fadeInUp">
							<div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-neu-float transform transition duration-500 hover:rotate-1 hover:scale-105 perspective">
								<img
									src="https://images.unsplash.com/photo-1519638831568-d9897f54ed69?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
									alt="Latest Magazine"
									className="w-full h-full object-cover transform hover:scale-110 transition-all duration-700"
								/>
							</div>
							<div className="absolute -bottom-6 -right-6 bg-blue-800 text-white p-4 md:p-6 rounded-lg shadow-neu-blue transform rotate-3 backdrop-blur-sm bg-opacity-90">
								<p className="font-bold">Latest Issue</p>
								<p className="text-sm opacity-90">May 7, 2025</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="py-16 bg-gradient-to-b from-gray-100 to-white">
				<div className="container mx-auto px-4">
					<h2
						className="text-2xl md:text-3xl font-bold mb-2 text-center text-blue-900"
						style={{
							textShadow: darkMode
								? "2px 2px 4px rgba(0, 0, 0, 0.3)"
								: "2px 2px 4px rgba(0, 0, 0, 0.1)",
						}}
					>
						Featured Issues
					</h2>
					<p className="text-center text-blue-700 mb-8">
						Handpicked content for your reading pleasure
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{magazines.slice(0, 3).map((magazine) => (
							<div
								key={magazine.id}
								className="relative bg-white rounded-xl p-6 shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden group"
								onClick={() => navigateTo("article", magazine.id)}
							>
								<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
								<div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
									<img
										src={magazine.coverImage}
										alt={magazine.title}
										className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
									/>
								</div>
								<span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-2">
									{magazine.category}
								</span>
								<div className="flex justify-between items-start">
									<h3 className="text-xl font-bold mb-2 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
										{magazine.title}
									</h3>
									<span className="flex items-center text-sm text-blue-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										{magazine.readTime}
									</span>
								</div>
								<p className="text-sm text-gray-600 mb-2">
									{magazine.date} • {magazine.issue}
								</p>
								<p className="text-gray-700 mb-4">{magazine.description}</p>
								{magazine.isExclusive && (
									<div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md transform rotate-2">
										PREMIUM
									</div>
								)}
								<div className="flex justify-between items-center">
									<button
										className="py-2 px-4 bg-blue-800 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover transition-all duration-300 transform hover:translate-y-px active:shadow-neu-blue-pressed"
										onClick={(e) => {
											e.stopPropagation();
											navigateTo("article", magazine.id);
										}}
									>
										<span className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-1"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											Read Now
										</span>
									</button>
									<div className="flex space-x-2">
										<button
											id={`like-${magazine.id}`}
											className={`p-2 rounded-full ${
												likedArticles.includes(magazine.id)
													? "bg-red-100 text-red-500"
													: "bg-gray-100 text-gray-500"
											} hover:bg-red-100 hover:text-red-500 transition-colors duration-300`}
											onClick={(e) => {
												e.stopPropagation();
												toggleLikeArticle(magazine.id);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill={
													likedArticles.includes(magazine.id)
														? "currentColor"
														: "none"
												}
												stroke="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button
											className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
											onClick={(e) => {
												e.stopPropagation();
												toggleDownloadModal();
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="text-center mt-10">
						<button
							className="px-6 py-3 bg-white text-blue-900 rounded-lg shadow-neu-light transform transition duration-300 hover:scale-105 hover:shadow-neu-light-hover active:shadow-neu-light-pressed active:scale-95"
							onClick={() => navigateTo("issues")}
						>
							<span className="flex items-center justify-center">
								View All Issues
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</span>
						</button>
					</div>
				</div>
			</div>

			{}
			<div className="py-16">
				<div className="container mx-auto px-4">
					<h2
						className="text-2xl md:text-3xl font-bold mb-2 text-center text-blue-900"
						style={{
							textShadow: darkMode
								? "2px 2px 4px rgba(0, 0, 0, 0.3)"
								: "2px 2px 4px rgba(0, 0, 0, 0.1)",
						}}
					>
						Trending Now
					</h2>
					<p className="text-center text-blue-700 mb-8">
						Most popular articles from our collection
					</p>

					<div className="relative">
						<div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 z-0"></div>
						<div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-20 z-0"></div>

						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
							{}
							{magazines
								.sort((a, b) => b.popularity - a.popularity)
								.slice(0, 1)
								.map((magazine) => (
									<div
										key={`trending-${magazine.id}`}
										className="md:col-span-2 xl:col-span-2 bg-white rounded-xl overflow-hidden shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 group cursor-pointer"
										onClick={() => navigateTo("article", magazine.id)}
									>
										<div className="flex flex-col md:flex-row h-full">
											<div className="md:w-1/2 h-56 md:h-auto relative overflow-hidden">
												<img
													src={magazine.coverImage}
													alt={magazine.title}
													className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
												/>
												<div className="absolute top-4 left-4 bg-blue-800 text-white text-xs font-bold px-2 py-1 rounded">
													TRENDING #1
												</div>
												{magazine.isExclusive && (
													<div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
														PREMIUM
													</div>
												)}
											</div>
											<div className="md:w-1/2 p-6 flex flex-col justify-between">
												<div>
													<span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-2">
														{magazine.category}
													</span>
													<h3 className="text-xl font-bold mb-2 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
														{magazine.title}
													</h3>
													<p className="text-sm text-gray-600 mb-3">
														{magazine.date} • {magazine.issue}
													</p>
													<p className="text-gray-700 mb-4">
														{magazine.description}
													</p>
												</div>
												<div className="flex justify-between items-center">
													<div className="flex items-center text-sm text-blue-600">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 mr-1"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														{magazine.readTime}
													</div>
													<div className="flex items-center text-sm text-yellow-600">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 mr-1"
															fill="currentColor"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
															/>
														</svg>
														{magazine.popularity}% popularity
													</div>
												</div>
											</div>
										</div>
									</div>
								))}

							{}
							{magazines
								.sort((a, b) => b.popularity - a.popularity)
								.slice(1, 4)
								.map((magazine, index) => (
									<div
										key={`trending-secondary-${magazine.id}`}
										className="bg-white rounded-xl overflow-hidden shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
										onClick={() => navigateTo("article", magazine.id)}
									>
										<div className="relative h-40 overflow-hidden">
											<img
												src={magazine.coverImage}
												alt={magazine.title}
												className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
											/>
											<div className="absolute top-3 left-3 bg-blue-800 text-white text-xs font-bold px-2 py-1 rounded">
												TRENDING #{index + 2}
											</div>
											{magazine.isExclusive && (
												<div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
													PREMIUM
												</div>
											)}
										</div>
										<div className="p-4">
											<div className="flex justify-between items-start">
												<span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-2">
													{magazine.category}
												</span>
												<div className="flex items-center text-yellow-600 text-xs">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-3 w-3 mr-1"
														fill="currentColor"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
														/>
													</svg>
													{magazine.popularity}%
												</div>
											</div>
											<h3 className="text-lg font-bold mb-1 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
												{magazine.title}
											</h3>
											<p className="text-xs text-gray-600 mb-2">
												{magazine.date}
											</p>
											<p className="text-sm text-gray-700 line-clamp-2 mb-3">
												{magazine.description}
											</p>
											<div className="flex justify-between items-center">
												<div className="flex items-center text-xs text-blue-600">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-3 w-3 mr-1"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													{magazine.readTime}
												</div>
												<button
													className="text-blue-700 text-sm font-semibold hover:text-blue-900 transition-colors duration-300 flex items-center"
													onClick={(e) => {
														e.stopPropagation();
														navigateTo("article", magazine.id);
													}}
												>
													Read
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4 ml-1"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M14 5l7 7m0 0l-7 7m7-7H3"
														/>
													</svg>
												</button>
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="py-16 bg-gradient-to-br from-blue-50 to-white">
				<div className="container mx-auto px-4">
					<h2
						className="text-2xl md:text-3xl font-bold mb-2 text-center text-blue-900"
						style={{
							textShadow: darkMode
								? "2px 2px 4px rgba(0, 0, 0, 0.3)"
								: "2px 2px 4px rgba(0, 0, 0, 0.1)",
						}}
					>
						A Premium Reading Experience
					</h2>
					<p className="text-center text-blue-700 mb-12">
						Designed with your comfort and convenience in mind
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="p-6 bg-white rounded-xl shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-1 group">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-blue-900"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-3 text-blue-900 text-center">
								Customizable Experience
							</h3>
							<p className="text-gray-700 text-center">
								Adjust font sizes, toggle dark mode, and personalize your
								reading experience to suit your preferences.
							</p>
						</div>
						<div className="p-6 bg-white rounded-xl shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-1 group">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-blue-900"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-3 text-blue-900 text-center">
								Download & Read Offline
							</h3>
							<p className="text-gray-700 text-center">
								Download issues in multiple formats to read offline at your
								convenience, anytime and anywhere.
							</p>
						</div>
						<div className="p-6 bg-white rounded-xl shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-1 group">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-blue-900"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-3 text-blue-900 text-center">
								Bookmark Your Favorites
							</h3>
							<p className="text-gray-700 text-center">
								Save sections and articles to easily return to them later,
								creating your personal collection.
							</p>
						</div>
						<div className="p-6 bg-white rounded-xl shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-1 group">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-blue-900"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-3 text-blue-900 text-center">
								Exclusive Content
							</h3>
							<p className="text-gray-700 text-center">
								Access premium articles and features with our subscription plans
								for an enhanced reading experience.
							</p>
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="py-16">
				<div className="container mx-auto px-4">
					<h2
						className="text-2xl md:text-3xl font-bold mb-2 text-center text-blue-900"
						style={{
							textShadow: darkMode
								? "2px 2px 4px rgba(0, 0, 0, 0.3)"
								: "2px 2px 4px rgba(0, 0, 0, 0.1)",
						}}
					>
						Explore Categories
					</h2>
					<p className="text-center text-blue-700 mb-12">
						Dive into your favorite topics
					</p>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{categories
							.filter((cat) => cat.id !== "all")
							.map((category) => (
								<div
									key={category.id}
									className="relative overflow-hidden rounded-xl cursor-pointer group"
									onClick={() => {
										setCategoryFilter(category.id);
										navigateTo("issues");
									}}
								>
									<div className="aspect-square bg-gradient-to-br from-blue-700 to-blue-900 p-6 flex flex-col items-center justify-center text-white shadow-neu-blue hover:shadow-neu-blue-hover transition-all duration-300">
										<div className="text-3xl mb-3 opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
											{category.id === "technology" && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-12 w-12"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
											)}
											{category.id === "business" && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-12 w-12"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
											)}
											{category.id === "health" && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-12 w-12"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
													/>
												</svg>
											)}
											{category.id === "sustainability" && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-12 w-12"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											)}
											{category.id === "culture" && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-12 w-12"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
													/>
												</svg>
											)}
											{category.id === "science" && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-12 w-12"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
													/>
												</svg>
											)}
										</div>
										<h3 className="text-lg font-semibold text-center">
											{category.name}
										</h3>
									</div>
									<div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
								</div>
							))}
					</div>
				</div>
			</div>

			{}
			<div className="py-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
				<div className="container mx-auto px-4">
					<h2
						className="text-2xl md:text-3xl font-bold mb-2 text-center"
						style={{
							textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
						}}
					>
						What Our Readers Say
					</h2>
					<p className="text-center text-blue-200 mb-12">
						Join thousands of satisfied subscribers
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
							<div className="flex items-center mb-4">
								<img
									src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80"
									alt="Testimonial Avatar"
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div className="ml-4">
									<h4 className="font-bold">Sarah T.</h4>
									<div className="flex text-yellow-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									</div>
								</div>
							</div>
							<p className="italic text-blue-800">
								"EclipseMag keeps me up-to-date with the latest tech trends. The
								reading experience is seamless across my desktop and mobile
								devices. Worth every penny!"
							</p>
						</div>

						<div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
							<div className="flex items-center mb-4">
								<img
									src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80"
									alt="Testimonial Avatar"
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div className="ml-4">
									<h4 className="font-bold">Michael R.</h4>
									<div className="flex text-yellow-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									</div>
								</div>
							</div>
							<p className="italic text-blue-800">
								"The premium content is absolutely worth the subscription. I
								especially love the customizable font size and dark mode for
								late-night reading."
							</p>
						</div>

						<div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
							<div className="flex items-center mb-4">
								<img
									src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80"
									alt="Testimonial Avatar"
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div className="ml-4">
									<h4 className="font-bold">Jessica L.</h4>
									<div className="flex text-yellow-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									</div>
								</div>
							</div>
							<p className="italic text-blue-800">
								"I love the bookmark feature! It lets me save interesting
								sections to come back to later. The UI is beautiful and the
								reading experience is smooth and distraction-free."
							</p>
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 relative overflow-hidden">
				{}
				<div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full opacity-20"></div>
				<div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-700 rounded-full opacity-20"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-900 opacity-30">
					<svg
						className="w-full h-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
					>
						<path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
					</svg>
					<defs>
						<pattern
							id="grid"
							width="10"
							height="10"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 10 0 L 0 0 0 10"
								fill="none"
								stroke="rgba(255,255,255,0.1)"
								strokeWidth="0.5"
							/>
						</pattern>
					</defs>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-4xl mx-auto text-center text-white">
						<h2
							className="text-3xl md:text-5xl font-bold mb-6"
							style={{
								textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
							}}
						>
							Ready to Start Your Reading Journey?
						</h2>
						<p className="text-lg md:text-xl mb-8 text-blue-100">
							Join thousands of readers who trust our premium content to stay
							informed and inspired. Unlock exclusive content today!
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<button
								className="px-8 py-4 bg-white text-blue-900 rounded-lg shadow-neu-light-glow transform transition duration-300 hover:scale-105 hover:shadow-neu-light-hover active:shadow-neu-light-pressed active:scale-95 font-bold"
								onClick={toggleSubscriptionModal}
							>
								<span className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
										/>
									</svg>
									Subscribe Now
								</span>
							</button>
							<button
								className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg shadow-lg backdrop-filter backdrop-blur-sm transform transition duration-300 hover:scale-105 hover:bg-white hover:bg-opacity-10 active:scale-95"
								onClick={() => navigateTo("issues")}
							>
								<span className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
									Browse Free Issues
								</span>
							</button>
						</div>

						<div className="mt-12 pt-6 border-t border-blue-700">
							<p className="text-blue-200 mb-4">
								Or stay updated with our weekly newsletter
							</p>
							<form
								onSubmit={handleNewsletterSubscribe}
								className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
							>
								<input
									type="email"
									placeholder="Your email"
									value={newsletterEmail}
									onChange={(e) => setNewsletterEmail(e.target.value)}
									className="flex-grow px-4 py-3 rounded-lg focus:outline-none bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border border-blue-300 border-opacity-30 text-white placeholder-blue-200"
								/>
								<button
									type="submit"
									className="px-6 py-3 bg-white text-blue-900 rounded-lg shadow-neu-light hover:shadow-neu-light-hover active:shadow-neu-light-pressed transform transition duration-300 hover:scale-105 active:scale-95 font-semibold"
								>
									Subscribe
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderIssuesPage = () => (
		<div className="py-12 animate-fadeIn">
			<div className="container mx-auto px-4">
				<h1
					className="text-3xl md:text-4xl font-bold mb-4 text-blue-900"
					style={{
						textShadow: darkMode
							? "2px 2px 4px rgba(0, 0, 0, 0.3)"
							: "2px 2px 4px rgba(0, 0, 0, 0.1)",
					}}
				>
					Magazine Issues
				</h1>
				<p className="text-blue-700 mb-8">
					Explore our collection of thought-provoking content
				</p>

				{}
				<div className="mb-8 overflow-x-auto">
					<div className="flex flex-nowrap gap-2 pb-2">
						{categories.map((category) => (
							<button
								key={category.id}
								className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
									categoryFilter === category.id
										? "bg-blue-900 text-white shadow-neu-blue"
										: "bg-white text-blue-900 shadow-neu-light hover:shadow-neu-light-hover"
								}`}
								onClick={() => setCategoryFilter(category.id)}
							>
								{category.name}
							</button>
						))}
					</div>
				</div>

				{}
				<div className="flex flex-wrap justify-between items-center mb-8">
					<div className="flex gap-4 mb-4 md:mb-0">
						<div className="relative">
							<select
								className="appearance-none px-4 py-2 pr-10 bg-white text-blue-900 rounded-lg shadow-neu-light focus:outline-none cursor-pointer"
								onChange={() => notify("Sorting option applied")}
							>
								<option value="newest">Newest First</option>
								<option value="oldest">Oldest First</option>
								<option value="popular">Most Popular</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-900">
								<svg
									className="fill-current h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</div>
						</div>

						<div className="relative">
							<select
								className="appearance-none px-4 py-2 pr-10 bg-white text-blue-900 rounded-lg shadow-neu-light focus:outline-none cursor-pointer"
								onChange={() => notify("Filter applied")}
							>
								<option value="all">All Content</option>
								<option value="free">Free Content</option>
								<option value="premium">Premium Only</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-900">
								<svg
									className="fill-current h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{currentIssues.map((magazine, index) => (
						<div
							key={magazine.id}
							className="bg-white rounded-xl overflow-hidden shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group animate-fadeInDelayed"
							style={{ animationDelay: `${index * 0.1}s` }}
							onClick={() => navigateTo("article", magazine.id)}
						>
							<div className="relative h-56 overflow-hidden">
								<img
									src={magazine.coverImage}
									alt={magazine.title}
									className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
								<div className="absolute bottom-4 left-4 right-4">
									<div className="flex justify-between items-center mb-2">
										<span className="inline-block px-2 py-1 bg-blue-100 bg-opacity-90 backdrop-filter backdrop-blur-sm text-blue-800 text-xs font-semibold rounded">
											{magazine.category}
										</span>
										{magazine.isExclusive && (
											<div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md transform rotate-2">
												PREMIUM
											</div>
										)}
									</div>
									<h3
										className="text-lg font-bold text-white"
										style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
									>
										{magazine.title}
									</h3>
								</div>
							</div>
							<div className="p-4">
								<div className="flex justify-between items-center mb-2">
									<p className="text-sm text-gray-600">
										{magazine.date} • {magazine.issue}
									</p>
									<div className="flex items-center text-sm text-yellow-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="currentColor"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
											/>
										</svg>
										{magazine.popularity}%
									</div>
								</div>
								<p className="text-gray-700 text-sm mb-4 line-clamp-2">
									{magazine.description}
								</p>
								<div className="flex justify-between items-center">
									<div className="flex items-center text-sm text-blue-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										{magazine.readTime}
									</div>
									<div className="flex space-x-2">
										<button
											id={`like-${magazine.id}`}
											className={`p-2 rounded-full ${
												likedArticles.includes(magazine.id)
													? "bg-red-100 text-red-500"
													: "bg-gray-100 text-gray-500"
											} hover:bg-red-100 hover:text-red-500 transition-colors duration-300`}
											onClick={(e) => {
												e.stopPropagation();
												toggleLikeArticle(magazine.id);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill={
													likedArticles.includes(magazine.id)
														? "currentColor"
														: "none"
												}
												stroke="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button
											className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
											onClick={(e) => {
												e.stopPropagation();
												toggleDownloadModal();
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{}
				{currentIssues.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 bg-white bg-opacity-50 rounded-xl shadow-neu-light my-8">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-16 w-16 text-blue-300 mb-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
						<h3 className="text-xl font-semibold text-blue-900 mb-2">
							No magazines found
						</h3>
						<p className="text-gray-600 mb-6 text-center max-w-md">
							We couldn't find any magazines matching your current filters. Try
							adjusting your search criteria.
						</p>
						<button
							className="px-4 py-2 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover transition-all duration-300"
							onClick={() => setCategoryFilter("all")}
						>
							View All Issues
						</button>
					</div>
				)}

				{}
				{totalPages > 1 && (
					<div className="mt-12 flex justify-center">
						<div className="flex items-center space-x-2">
							<button
								className={`w-10 h-10 flex items-center justify-center rounded-lg ${
									currentPage1 === 1
										? "bg-gray-200 text-gray-500 cursor-not-allowed"
										: "bg-white text-blue-900 shadow-neu-light hover:shadow-neu-light-hover cursor-pointer"
								}`}
								onClick={() => paginate(currentPage1 - 1)}
								disabled={currentPage1 === 1}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>

							{[...Array(totalPages)].map((_, index) => {
								const pageNumber = index + 1;

								if (
									pageNumber === 1 ||
									pageNumber === totalPages ||
									(pageNumber >= currentPage1 - 1 &&
										pageNumber <= currentPage1 + 1)
								) {
									return (
										<button
											key={pageNumber}
											className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${
												currentPage1 === pageNumber
													? "bg-blue-900 text-white shadow-neu-blue transform scale-110"
													: "bg-white text-blue-900 shadow-neu-light hover:shadow-neu-light-hover"
											}`}
											onClick={() => paginate(pageNumber)}
										>
											{pageNumber}
										</button>
									);
								} else if (
									(pageNumber === currentPage1 - 2 && currentPage1 > 3) ||
									(pageNumber === currentPage1 + 2 &&
										currentPage1 < totalPages - 2)
								) {
									return (
										<span
											key={pageNumber}
											className="w-10 h-10 flex items-center justify-center text-blue-900"
										>
											...
										</span>
									);
								}
								return null;
							})}

							<button
								className={`w-10 h-10 flex items-center justify-center rounded-lg ${
									currentPage1 === totalPages
										? "bg-gray-200 text-gray-500 cursor-not-allowed"
										: "bg-white text-blue-900 shadow-neu-light hover:shadow-neu-light-hover cursor-pointer"
								}`}
								onClick={() => paginate(currentPage1 + 1)}
								disabled={currentPage1 === totalPages}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);

	const renderArticlePage = () => {
		if (!currentMagazine) return null;

		return (
			<div
				className={`py-6 md:py-12 relative ${
					isReadingMode ? "reading-mode" : ""
				}`}
			>
				{}
				<div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
					<div
						className="h-full bg-blue-900 transition-all duration-300 ease-out"
						style={{ width: `${readingProgress}%` }}
					></div>
				</div>

				<div
					className="container mx-auto px-4 transition-all duration-500"
					ref={contentRef}
				>
					{}
					<div className="flex flex-col md:flex-row md:items-center mb-8 animate-fadeIn">
						<div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
							<div className="rounded-xl overflow-hidden shadow-neu-float group">
								<img
									src={currentMagazine.coverImage}
									alt={currentMagazine.title}
									className="w-full h-auto transform group-hover:scale-110 transition-all duration-700"
								/>
							</div>
						</div>
						<div className="md:w-2/3 md:pl-4">
							<div className="flex flex-wrap gap-2 mb-3">
								<span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
									{currentMagazine.category}
								</span>
								<span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
									{currentMagazine.readTime}
								</span>
								{currentMagazine.isExclusive && (
									<span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
										PREMIUM
									</span>
								)}
							</div>
							<h1
								className="text-2xl md:text-4xl font-bold mb-2 text-blue-900"
								style={{
									textShadow: darkMode
										? "2px 2px 4px rgba(0, 0, 0, 0.3)"
										: "2px 2px 4px rgba(0, 0, 0, 0.1)",
								}}
							>
								{currentMagazine.title}
							</h1>
							<p className="text-gray-600 mb-4">
								{currentMagazine.date} • {currentMagazine.issue}
							</p>
							<p className="text-lg text-gray-700 mb-6">
								{currentMagazine.description}
							</p>
							<div className="flex flex-wrap gap-4">
								<button
									className="px-4 py-2 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed transition-all duration-300 flex items-center"
									onClick={toggleDownloadModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
										/>
									</svg>
									Download
								</button>
								<button
									className="px-4 py-2 bg-white text-blue-900 rounded-lg shadow-neu-light hover:shadow-neu-light-hover active:shadow-neu-light-pressed transition-all duration-300 flex items-center"
									onClick={() => notify("Sharing feature activated")}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
										/>
									</svg>
									Share
								</button>
								<button
									id={`like-${currentMagazine.id}`}
									className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
										likedArticles.includes(currentMagazine.id)
											? "bg-red-100 text-red-600 shadow-neu-red"
											: "bg-white text-gray-700 shadow-neu-light hover:bg-red-50 hover:text-red-500"
									}`}
									onClick={() => toggleLikeArticle(currentMagazine.id)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2"
										viewBox="0 0 20 20"
										fill={
											likedArticles.includes(currentMagazine.id)
												? "currentColor"
												: "none"
										}
										stroke="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
											clipRule="evenodd"
										/>
									</svg>
									{likedArticles.includes(currentMagazine.id)
										? "Liked"
										: "Like"}
								</button>
							</div>
						</div>
					</div>

					{}
					<div
						className={`bg-white rounded-xl p-4 shadow-neu-float mb-8 ${
							isReadingMode ? "hidden" : "sticky top-0 z-20"
						}`}
					>
						<div className="flex flex-wrap justify-between items-center">
							<div className="flex items-center space-x-4 mb-4 md:mb-0">
								<button
									className="p-2 text-blue-900 hover:text-blue-700 transition-colors duration-300 group"
									onClick={() => navigateTo("issues")}
								>
									<span className="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 mr-1 group-hover:-translate-x-1 transition-transform duration-300"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 19l-7-7m0 0l7-7m-7 7h18"
											/>
										</svg>
										<span className="hidden md:inline">Back to Issues</span>
									</span>
								</button>
								<div className="flex items-center space-x-3 border-l border-gray-300 pl-3">
									<button
										className="flex items-center justify-center p-2 text-blue-900 hover:text-blue-700 transition-colors duration-300"
										onClick={() => setFontSize(Math.max(12, fontSize - 2))}
										title="Decrease font size"
									>
										<span className="text-lg font-semibold">A-</span>
									</button>
									<div className="text-gray-500 text-sm whitespace-nowrap">
										{fontSize}px
									</div>
									<button
										className="flex items-center justify-center p-2 text-blue-900 hover:text-blue-700 transition-colors duration-300"
										onClick={() => setFontSize(Math.min(24, fontSize + 2))}
										title="Increase font size"
									>
										<span className="text-lg font-semibold">A+</span>
									</button>
								</div>
							</div>

							<div className="flex flex-wrap gap-2">
								<div className="relative">
									<select
										className="appearance-none px-3 py-2 pr-8 bg-gray-100 text-blue-900 rounded-lg cursor-pointer focus:outline-none"
										value={activeSection}
										onChange={(e) => scrollToSection(e.target.value)}
									>
										{currentMagazine.sections.map((section) => (
											<option key={section.id} value={section.id}>
												{section.title}
											</option>
										))}
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-900">
										<svg
											className="fill-current h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
										>
											<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
										</svg>
									</div>
								</div>
								
								<button
									className="p-2 rounded-lg bg-gray-100 text-blue-900 hover:bg-gray-200 transition-colors duration-300"
									onClick={toggleReadingMode}
									title={
										isReadingMode ? "Exit reading mode" : "Enter reading mode"
									}
								>
									{isReadingMode ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>

					{}
					<div className="bg-white rounded-xl p-6 md:p-8 shadow-neu-float mb-8 animate-fadeInDelayed">
						{currentMagazine.sections.map((section) => (
							<div
								key={section.id}
								ref={sectionRefs[section.id]}
								className={`mb-10 scroll-mt-20 ${
									activeSection === section.id ? "active-section" : ""
								}`}
							>
								<div className="flex justify-between items-center mb-4">
									<h2
										className={`text-xl md:text-2xl font-bold text-blue-900 transition-all duration-300 ${
											activeSection === section.id
												? "text-blue-700 transform scale-105"
												: ""
										}`}
										id={`section-${section.id}`}
									>
										{section.title}
									</h2>
									<button
										id={`bookmark-${currentMagazine.id}-${section.id}`}
										className={`p-2 rounded-full ${
											bookmarks.some(
												(b) =>
													b.magazineId === currentMagazine.id &&
													b.sectionId === section.id
											)
												? "text-yellow-500 bg-yellow-50"
												: "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
										} transition-colors duration-300`}
										onClick={() =>
											toggleBookmark(currentMagazine.id, section.id)
										}
										aria-label="Bookmark this section"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill={
												bookmarks.some(
													(b) =>
														b.magazineId === currentMagazine.id &&
														b.sectionId === section.id
												)
													? "currentColor"
													: "none"
											}
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
											/>
										</svg>
									</button>
								</div>
								<div
									className="text-gray-700 leading-relaxed article-content transition-all duration-300"
									style={{ fontSize: `${fontSize}px` }}
								>
									<p>{section.content}</p>
									<p className="mt-4">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit.
										Nulla facilisi. Sed euismod, nisl vitae ultricies lacinia,
										nisl nisl aliquam nisl, vitae ultricies nisl nisl sit amet
										nisl. Sed euismod, nisl vitae ultricies lacinia, nisl nisl
										aliquam nisl, vitae ultricies nisl nisl sit amet nisl.
									</p>
									<p className="mt-4">
										Sed euismod, nisl vitae ultricies lacinia, nisl nisl aliquam
										nisl, vitae ultricies nisl nisl sit amet nisl. Sed euismod,
										nisl vitae ultricies lacinia, nisl nisl aliquam nisl, vitae
										ultricies nisl nisl sit amet nisl.
									</p>
									<p className="mt-4">
										Etiam eu purus nec dolor efficitur malesuada. Duis urna
										magna, maximus vitae semper at, elementum ut dolor. Etiam eu
										purus nec dolor efficitur malesuada. Duis urna magna,
										maximus vitae semper at, elementum ut dolor.
									</p>
								</div>
							</div>
						))}
					</div>

					{}
					{readingProgress > 20 && (
						<button
							className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 hover:shadow-xl flex items-center justify-center z-50 transform hover:scale-110 transition-all duration-300"
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 11l7-7 7 7M5 19l7-7 7 7"
								/>
							</svg>
						</button>
					)}

					{}
					<div className="flex justify-between mb-12">
						<button
							className="px-5 py-2 bg-white text-blue-900 rounded-lg shadow-neu-light hover:shadow-neu-light-hover active:shadow-neu-light-pressed transition-all duration-300 group"
							onClick={() => {
								const prevMagazineId = currentMagazine.id - 1;
								if (prevMagazineId > 0) {
									navigateTo("article", prevMagazineId);
								} else {
									notify("This is the first issue");
								}
							}}
						>
							<span className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								Previous Issue
							</span>
						</button>
						<button
							className="px-5 py-2 bg-white text-blue-900 rounded-lg shadow-neu-light hover:shadow-neu-light-hover active:shadow-neu-light-pressed transition-all duration-300 group"
							onClick={() => {
								const nextMagazineId = currentMagazine.id + 1;
								if (nextMagazineId <= magazines.length) {
									navigateTo("article", nextMagazineId);
								} else {
									notify("This is the latest issue");
								}
							}}
						>
							<span className="flex items-center">
								Next Issue
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</span>
						</button>
					</div>

					{}
					<div className="mt-12">
						<h3 className="text-xl md:text-2xl font-bold mb-6 text-blue-900">
							You May Also Like
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{magazines
								.filter(
									(m) =>
										m.id !== currentMagazine.id &&
										m.category === currentMagazine.category
								)
								.slice(0, 3)
								.map((magazine, index) => (
									<div
										key={magazine.id}
										className="bg-white rounded-xl overflow-hidden shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group animate-fadeInDelayed"
										style={{ animationDelay: `${index * 0.1}s` }}
										onClick={() => navigateTo("article", magazine.id)}
									>
										<div className="h-40 relative overflow-hidden">
											<img
												src={magazine.coverImage}
												alt={magazine.title}
												className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
											{magazine.isExclusive && (
												<div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
													PREMIUM
												</div>
											)}
										</div>
										<div className="p-4">
											<h4 className="font-bold text-blue-900 group-hover:text-blue-700 transition-colors duration-300 mb-1">
												{magazine.title}
											</h4>
											<div className="flex justify-between items-center">
												<p className="text-sm text-gray-600">{magazine.date}</p>
												<span className="text-xs text-blue-600">
													{magazine.readTime}
												</span>
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderPage = () => {
		switch (currentPage) {
			case "home":
				return renderHomePage();
			case "issues":
				return renderIssuesPage();
			case "article":
				return renderArticlePage();
			default:
				return renderHomePage();
		}
	};

	return (
		<ThemeContext.Provider
			value={{ darkMode, toggleDarkMode, fontSize, setFontSize }}
		>
			<div
				className={`min-h-screen transition-colors duration-500 ${
					darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
				}`}
			>
				{}
				<header
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} shadow-md transition-colors duration-500 sticky top-0 z-30 ${
						isReadingMode ? "opacity-0 pointer-events-none" : ""
					}`}
				>
					<div className="container mx-auto px-4">
						<div className="flex justify-between items-center py-4">
							<div className="flex items-center">
								<div
									className={`text-2xl font-bold ${
										darkMode ? "text-blue-400" : "text-blue-900"
									} cursor-pointer flex items-center`}
									onClick={() => navigateTo("home")}
								>
									<div className="w-10 h-10 mr-2 rounded-full bg-blue-800 flex items-center justify-center shadow-neu-blue transform transition duration-300 hover:rotate-12">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
									<span className="bg-gradient-to-r from-blue-800 to-blue-600 text-transparent bg-clip-text">
										EclipseMag
									</span>
								</div>
								<nav className="hidden md:flex ml-8">
									<ul className="flex space-x-6">
										<li>
											<a
												className={`cursor-pointer transition-colors duration-300 ${
													currentPage === "home"
														? (darkMode ? "text-blue-400" : "text-blue-800") +
														  " font-semibold"
														: darkMode
														? "text-gray-300 hover:text-blue-400"
														: "text-gray-700 hover:text-blue-800"
												}`}
												onClick={() => navigateTo("home")}
											>
												Home
											</a>
										</li>
										<li>
											<a
												className={`cursor-pointer transition-colors duration-300 ${
													currentPage === "issues"
														? (darkMode ? "text-blue-400" : "text-blue-800") +
														  " font-semibold"
														: darkMode
														? "text-gray-300 hover:text-blue-400"
														: "text-gray-700 hover:text-blue-800"
												}`}
												onClick={() => navigateTo("issues")}
											>
												Issues
											</a>
										</li>
										<li>
											<a
												className={`cursor-pointer transition-colors duration-300 ${
													darkMode
														? "text-gray-300 hover:text-blue-400"
														: "text-gray-700 hover:text-blue-800"
												}`}
												onClick={() => {
													setCategoryFilter("all");
													navigateTo("issues");
												}}
											>
												Categories
											</a>
										</li>
										<li>
											<a
												className={`cursor-pointer transition-colors duration-300 ${
													darkMode
														? "text-gray-300 hover:text-blue-400"
														: "text-gray-700 hover:text-blue-800"
												}`}
												onClick={() => notify("About page coming soon")}
											>
												About
											</a>
										</li>
									</ul>
								</nav>
							</div>
							<div className="flex items-center space-x-3">
								<button
									className="p-2 rounded-full text-gray-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-300"
									onClick={toggleSearchModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</button>
								<button
									className="p-2 rounded-full text-gray-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-300"
									onClick={toggleBookmarksModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
										/>
									</svg>
								</button>
								
								<button
									className="hidden md:block transition-colors duration-300 px-4 py-2 rounded-lg text-sm font-semibold"
									onClick={toggleSubscriptionModal}
									style={{
										color: darkMode ? "white" : "#2a4478",
										background: "transparent",
										boxShadow: darkMode
											? "inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.1)"
											: "inset 2px 2px 5px rgba(0, 0, 0, 0.05), inset -2px -2px 5px rgba(255, 255, 255, 0.7)",
									}}
								>
									Subscribe
								</button>

								{isLoggedIn ? (
									<div className="relative">
										<button
											className="flex items-center space-x-2 cursor-pointer"
											onClick={toggleProfileDropdown}
										>
											<div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 transform transition-transform duration-300 hover:scale-110">
												<img
													src={userProfile.avatar}
													alt="Profile"
													className="w-full h-full object-cover"
												/>
											</div>
											<span className="hidden md:block text-sm font-medium">
												{userProfile.name}
											</span>
										</button>

										{isProfileDropdownOpen && (
											<div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl z-50 animate-fadeInDown">
												<a
													className="block px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer"
													onClick={toggleProfileModal}
												>
													<span className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 mr-2"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
															/>
														</svg>
														My Profile
													</span>
												</a>
												<a
													className="block px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer"
													onClick={toggleBookmarksModal}
												>
													<span className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 mr-2"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
															/>
														</svg>
														My Bookmarks
													</span>
												</a>
												<a
													className="block px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer"
													onClick={toggleSubscriptionModal}
												>
													<span className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 mr-2"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M15 9a2 2 0 10-4 0v5a2 2 0 104 0V9z"
															/>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01"
															/>
														</svg>
														Subscription
													</span>
												</a>
												<div className="border-t border-gray-200 my-1"></div>
												<a
													className="block px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
													onClick={handleLogout}
												>
													<span className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 mr-2"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
															/>
														</svg>
														Logout
													</span>
												</a>
											</div>
										)}
									</div>
								) : (
									<button
										className="hidden md:flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed transition-all duration-300 text-sm font-semibold"
										onClick={toggleLoginModal}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
											/>
										</svg>
										Login
									</button>
								)}

								<button
									className="md:hidden text-gray-700 hover:text-blue-800 cursor-pointer"
									onClick={() => setIsMenuOpen(!isMenuOpen)}
								>
									{isMenuOpen ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
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
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 6h16M4 12h16M4 18h16"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>

					{}
					{isMenuOpen && (
						<div
							className={`md:hidden ${
								darkMode ? "bg-gray-800" : "bg-white"
							} py-4 px-4 shadow-lg animate-fadeInDown`}
						>
							<nav>
								<ul className="space-y-4">
									<li>
										<a
											className={`block cursor-pointer ${
												currentPage === "home"
													? (darkMode ? "text-blue-400" : "text-blue-800") +
													  " font-semibold"
													: darkMode
													? "text-gray-300"
													: "text-gray-700"
											}`}
											onClick={() => {
												navigateTo("home");
												setIsMenuOpen(false);
											}}
										>
											Home
										</a>
									</li>
									<li>
										<a
											className={`block cursor-pointer ${
												currentPage === "issues"
													? (darkMode ? "text-blue-400" : "text-blue-800") +
													  " font-semibold"
													: darkMode
													? "text-gray-300"
													: "text-gray-700"
											}`}
											onClick={() => {
												navigateTo("issues");
												setIsMenuOpen(false);
											}}
										>
											Issues
										</a>
									</li>
									<li>
										<a
											className={`block cursor-pointer ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
											onClick={() => {
												setCategoryFilter("all");
												navigateTo("issues");
												setIsMenuOpen(false);
											}}
										>
											Categories
										</a>
									</li>
									<li>
										<a
											className={`block cursor-pointer ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
											onClick={() => {
												notify("About page coming soon");
												setIsMenuOpen(false);
											}}
										>
											About
										</a>
									</li>
									<li>
										<a
											className={`block cursor-pointer ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
											onClick={() => {
												toggleSubscriptionModal();
												setIsMenuOpen(false);
											}}
										>
											Subscribe
										</a>
									</li>
									<li>
										<a
											className={`block cursor-pointer ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
											onClick={() => {
												isLoggedIn ? toggleProfileModal() : toggleLoginModal();
												setIsMenuOpen(false);
											}}
										>
											{isLoggedIn ? "My Account" : "Login"}
										</a>
									</li>
									{isLoggedIn && (
										<li>
											<a
												className="block text-red-500 cursor-pointer"
												onClick={() => {
													handleLogout();
													setIsMenuOpen(false);
												}}
											>
												Logout
											</a>
										</li>
									)}
								</ul>
							</nav>
						</div>
					)}
				</header>

				{}
				<main>{renderPage()}</main>

				{}
				{isReadingMode && (
					<button
						className="fixed top-4 right-4 z-50 p-3 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
						onClick={toggleReadingMode}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
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
					</button>
				)}

				{}
				<footer
					className={`bg-gradient-to-br from-blue-900 to-blue-800 text-white py-12 ${
						isReadingMode ? "hidden" : ""
					}`}
				>
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							<div>
								<h3 className="text-xl font-bold mb-4 flex items-center">
									<div className="w-8 h-8 mr-2 rounded-full bg-white flex items-center justify-center shadow-neu-light">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-blue-900"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
									EclipseMag
								</h3>
								<p className="text-blue-100 mb-4">
									Your source for premium content and thought-provoking
									articles. Stay informed with our weekly magazine releases.
								</p>
								<div className="flex space-x-4">
									<a
										className="text-white hover:text-blue-200 transition-colors duration-300 transform hover:scale-110"
										onClick={() => notify("Social media link")}
									>
										<svg
											className="h-6 w-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
									<a
										className="text-white hover:text-blue-200 transition-colors duration-300 transform hover:scale-110"
										onClick={() => notify("Social media link")}
									>
										<svg
											className="h-6 w-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
										</svg>
									</a>
									<a
										className="text-white hover:text-blue-200 transition-colors duration-300 transform hover:scale-110"
										onClick={() => notify("Social media link")}
									>
										<svg
											className="h-6 w-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
								<ul className="space-y-2">
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => navigateTo("home")}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Home
										</a>
									</li>
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => navigateTo("issues")}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											All Issues
										</a>
									</li>
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => {
												setCategoryFilter("technology");
												navigateTo("issues");
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Technology
										</a>
									</li>
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => {
												setCategoryFilter("business");
												navigateTo("issues");
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Business
										</a>
									</li>
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => notify("About page coming soon")}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											About Us
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">Support</h3>
								<ul className="space-y-2">
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => notify("FAQ page coming soon")}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											FAQs
										</a>
									</li>
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => notify("Contact page coming soon")}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>
											Contact Us
										</a>
									</li>
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => notify("Privacy page coming soon")}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											Privacy Policy
										</a>
									</li>
									<li>
										<a
											className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer flex items-center"
											onClick={() => notify("Terms page coming soon")}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											Terms of Service
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">
									Subscribe to Newsletter
								</h3>
								<p className="text-blue-100 mb-4">
									Get weekly updates on new issues and exclusive content.
								</p>
								<form
									onSubmit={handleNewsletterSubscribe}
									className="flex flex-col space-y-2"
								>
									<div className="relative">
										<input
											type="email"
											placeholder="Your email"
											value={newsletterEmail}
											onChange={(e) => setNewsletterEmail(e.target.value)}
											className="w-full px-4 py-2 pr-10 rounded-lg focus:outline-none bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border border-blue-300 border-opacity-30 text-white placeholder-blue-200"
										/>
										<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>
										</div>
									</div>
									<button
										type="submit"
										className="w-full py-2 bg-white text-blue-900 rounded-lg shadow-neu-light hover:shadow-neu-light-hover active:shadow-neu-light-pressed transform transition duration-300 hover:scale-105 active:scale-95"
									>
										Subscribe
									</button>
								</form>
							</div>
						</div>
						<div className="mt-8 pt-8 border-t border-blue-800 text-center text-blue-100">
							<p>
								&copy; {new Date().getFullYear()} EclipseMag. All rights
								reserved.
							</p>
						</div>
					</div>
				</footer>

				{}
				{isLoginModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-sm animate-fadeIn">
						<div
							className={`${
								darkMode ? "bg-gray-800" : "bg-white"
							} rounded-xl p-6 md:p-8 w-full max-w-md shadow-neu-float animate-scaleIn`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2
									className={`text-2xl font-bold ${
										darkMode ? "text-blue-400" : "text-blue-900"
									}`}
								>
									Login
								</h2>
								<button
									className={`${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-600 hover:text-gray-800"
									} cursor-pointer transition-colors duration-300`}
									onClick={toggleLoginModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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
								</button>
							</div>
							<div>
								<form onSubmit={handleLogin}>
									<div className="mb-4">
										<label
											className={`block ${
												darkMode ? "text-gray-300" : "text-gray-700"
											} mb-2`}
											htmlFor="email"
										>
											Email
										</label>
										<div className="relative">
											<input
												type="email"
												id="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className={`w-full px-4 py-2 pl-10 rounded-lg border ${
													darkMode
														? "bg-gray-700 border-gray-600 text-white"
														: "bg-white border-gray-300 text-gray-900"
												} focus:outline-none focus:ring-2 focus:ring-blue-500`}
												placeholder="Enter your email"
												required
											/>
											<div
												className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
											</div>
										</div>
									</div>
									<div className="mb-6">
										<label
											className={`block ${
												darkMode ? "text-gray-300" : "text-gray-700"
											} mb-2`}
											htmlFor="password"
										>
											Password
										</label>
										<div className="relative">
											<input
												type="password"
												id="password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className={`w-full px-4 py-2 pl-10 rounded-lg border ${
													darkMode
														? "bg-gray-700 border-gray-600 text-white"
														: "bg-white border-gray-300 text-gray-900"
												} focus:outline-none focus:ring-2 focus:ring-blue-500`}
												placeholder="Enter your password"
												required
											/>
											<div
												className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
													/>
												</svg>
											</div>
										</div>
									</div>
									<button
										type="submit"
										className="w-full py-3 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed transition-all duration-300 transform hover:translate-y-px active:translate-y-1"
									>
										<span className="flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
												/>
											</svg>
											Login
										</span>
									</button>
								</form>
								<div className="mt-4 text-center">
									<a
										className={`${
											darkMode
												? "text-blue-400 hover:text-blue-300"
												: "text-blue-600 hover:text-blue-800"
										} cursor-pointer transition-colors duration-300`}
										onClick={() => {
											toggleLoginModal();
											notify("Password reset functionality coming soon");
										}}
									>
										Forgot password?
									</a>
								</div>
								<div
									className={`mt-6 pt-6 border-t ${
										darkMode ? "border-gray-700" : "border-gray-300"
									} text-center`}
								>
									<p className={darkMode ? "text-gray-300" : "text-gray-700"}>
										Don't have an account?{" "}
										<a
											className={`font-bold ${
												darkMode
													? "text-blue-400 hover:text-blue-300"
													: "text-blue-600 hover:text-blue-800"
											} cursor-pointer transition-colors duration-300`}
											onClick={toggleSignupModal}
										>
											Sign up
										</a>
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{}
				{isSignupModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-sm animate-fadeIn">
						<div
							className={`${
								darkMode ? "bg-gray-800" : "bg-white"
							} rounded-xl p-6 md:p-8 w-full max-w-md shadow-neu-float animate-scaleIn`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2
									className={`text-2xl font-bold ${
										darkMode ? "text-blue-400" : "text-blue-900"
									}`}
								>
									Create an Account
								</h2>
								<button
									className={`${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-600 hover:text-gray-800"
									} cursor-pointer transition-colors duration-300`}
									onClick={toggleSignupModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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
								</button>
							</div>
							<div>
								<form onSubmit={handleSignup}>
									<div className="mb-4">
										<label
											className={`block ${
												darkMode ? "text-gray-300" : "text-gray-700"
											} mb-2`}
											htmlFor="name"
										>
											Name
										</label>
										<div className="relative">
											<input
												type="text"
												id="name"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className={`w-full px-4 py-2 pl-10 rounded-lg border ${
													darkMode
														? "bg-gray-700 border-gray-600 text-white"
														: "bg-white border-gray-300 text-gray-900"
												} focus:outline-none focus:ring-2 focus:ring-blue-500`}
												placeholder="Enter your name"
												required
											/>
											<div
												className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
													/>
												</svg>
											</div>
										</div>
									</div>
									<div className="mb-4">
										<label
											className={`block ${
												darkMode ? "text-gray-300" : "text-gray-700"
											} mb-2`}
											htmlFor="signup-email"
										>
											Email
										</label>
										<div className="relative">
											<input
												type="email"
												id="signup-email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className={`w-full px-4 py-2 pl-10 rounded-lg border ${
													darkMode
														? "bg-gray-700 border-gray-600 text-white"
														: "bg-white border-gray-300 text-gray-900"
												} focus:outline-none focus:ring-2 focus:ring-blue-500`}
												placeholder="Enter your email"
												required
											/>
											<div
												className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
											</div>
										</div>
									</div>
									<div className="mb-4">
										<label
											className={`block ${
												darkMode ? "text-gray-300" : "text-gray-700"
											} mb-2`}
											htmlFor="signup-password"
										>
											Password
										</label>
										<div className="relative">
											<input
												type="password"
												id="signup-password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className={`w-full px-4 py-2 pl-10 rounded-lg border ${
													darkMode
														? "bg-gray-700 border-gray-600 text-white"
														: "bg-white border-gray-300 text-gray-900"
												} focus:outline-none focus:ring-2 focus:ring-blue-500`}
												placeholder="Create a password"
												required
											/>
											<div
												className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
													/>
												</svg>
											</div>
										</div>
									</div>
									<div className="mb-6">
										<label
											className={`block ${
												darkMode ? "text-gray-300" : "text-gray-700"
											} mb-2`}
											htmlFor="confirm-password"
										>
											Confirm Password
										</label>
										<div className="relative">
											<input
												type="password"
												id="confirm-password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												className={`w-full px-4 py-2 pl-10 rounded-lg border ${
													darkMode
														? "bg-gray-700 border-gray-600 text-white"
														: "bg-white border-gray-300 text-gray-900"
												} focus:outline-none focus:ring-2 focus:ring-blue-500`}
												placeholder="Confirm your password"
												required
											/>
											<div
												className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
													/>
												</svg>
											</div>
										</div>
									</div>
									<button
										type="submit"
										className="w-full py-3 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed transition-all duration-300 transform hover:translate-y-px active:translate-y-1"
									>
										<span className="flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
												/>
											</svg>
											Create Account
										</span>
									</button>
								</form>
								<div
									className={`mt-6 pt-6 border-t ${
										darkMode ? "border-gray-700" : "border-gray-300"
									} text-center`}
								>
									<p className={darkMode ? "text-gray-300" : "text-gray-700"}>
										Already have an account?{" "}
										<a
											className={`font-bold ${
												darkMode
													? "text-blue-400 hover:text-blue-300"
													: "text-blue-600 hover:text-blue-800"
											} cursor-pointer transition-colors duration-300`}
											onClick={toggleLoginModal}
										>
											Login
										</a>
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{}
				{isSubscriptionModalOpen && (
					<div className="fixed inset-0 h-full bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-sm animate-fadeIn overflow-y-auto">
						<div
							className={`${
								darkMode ? "bg-gray-800" : "bg-white"
							} rounded-xl p-6 md:p-8 w-full h-full max-w-4xl shadow-neu-float animate-scaleIn my-8`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2
									className={`text-2xl font-bold ${
										darkMode ? "text-blue-400" : "text-blue-900"
									}`}
								>
									Choose Your Subscription Plan
								</h2>
								<button
									className={`${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-600 hover:text-gray-800"
									} cursor-pointer transition-colors duration-300`}
									onClick={toggleSubscriptionModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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
								</button>
							</div>

							<p
								className={`${
									darkMode ? "text-gray-300" : "text-gray-600"
								} mb-8`}
							>
								Unlock premium content and enhanced features with our
								subscription plans.
							</p>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{subscriptionPlans.map((plan, index) => (
									<div
										key={plan.id}
										className={`${
											darkMode ? "bg-gray-700" : "bg-white"
										} rounded-xl p-6 shadow-neu-float hover:shadow-neu-float-hover transition-all duration-300 transform hover:-translate-y-1 ${
											plan.recommended ? "ring-2 ring-blue-500" : ""
										} animate-fadeInDelayed`}
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										<div className="relative">
											{plan.id === "premium" && (
												<div className="absolute -top-2 -right-2 w-16 h-16">
													<div className="absolute transform rotate-45 bg-yellow-500 text-white text-xs font-bold py-1 right-[-35px] top-[15px] w-[140px] text-center">
														BEST VALUE
													</div>
												</div>
											)}
											<div className="text-center mb-4">
												<div
													className={`w-16 h-16 rounded-full ${
														plan.id === "free"
															? "bg-gray-200 text-gray-700"
															: plan.id === "basic"
															? "bg-blue-100 text-blue-700"
															: "bg-blue-900 text-white"
													} flex items-center justify-center mx-auto mb-3`}
												>
													{plan.id === "free" && (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-8 w-8"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													)}
													{plan.id === "basic" && (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-8 w-8"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
															/>
														</svg>
													)}
													{plan.id === "premium" && (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-8 w-8"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
															/>
														</svg>
													)}
												</div>
												<h3
													className={`text-xl font-bold mb-2 ${
														darkMode ? "text-blue-300" : "text-blue-900"
													}`}
												>
													{plan.name}
												</h3>
												<p
													className={`text-2xl font-bold mb-2 ${
														darkMode ? "text-white" : "text-gray-800"
													}`}
												>
													{plan.price}
												</p>
												{plan.id !== "free" && (
													<p className="text-sm text-gray-500 mb-4">
														{plan.id === "basic"
															? "Billed monthly"
															: "Billed monthly or $99/year"}
													</p>
												)}
											</div>
										</div>

										<div className="border-t border-b py-4 mb-6">
											<ul className="space-y-3">
												{plan.features.map((feature, idx) => (
													<li key={idx} className="flex items-start">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className={`h-5 w-5 ${
																plan.id === "premium"
																	? "text-green-500"
																	: plan.id === "basic"
																	? "text-blue-500"
																	: "text-gray-500"
															} mr-2 mt-0.5 flex-shrink-0`}
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
														<span
															className={
																darkMode ? "text-gray-300" : "text-gray-700"
															}
														>
															{feature}
														</span>
													</li>
												))}
											</ul>
										</div>

										<button
											className={`w-full py-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:translate-y-px active:translate-y-1 ${
												plan.id === subscriptionStatus
													? `${
															darkMode
																? " bg-gray-600 text-gray-300"
																: "bg-gray-300 text-gray-700 "
													  }`
													: plan.id === "premium"
													? "bg-blue-900 text-white shadow-neu-blue hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed"
													: plan.id === "basic"
													? "bg-blue-700 text-white shadow-neu-blue hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed"
													: "bg-gray-200 text-blue-900 shadow-neu-light hover:shadow-neu-light-hover active:shadow-neu-light-pressed"
											}`}
											onClick={() => changeSubscription(plan.id)}
											disabled={plan.id === subscriptionStatus}
										>
											{plan.id === subscriptionStatus
												? "Current Plan"
												: plan.buttonText}
										</button>
									</div>
								))}
							</div>

							<div
								className={`mt-8 p-6 ${
									darkMode ? " bg-blue-900 bg-opacity-20" : "bg-blue-50"
								} rounded-lg`}
							>
								<h3
									className={`text-lg font-semibold mb-2 ${
										darkMode ? "text-blue-300" : "text-blue-900"
									} `}
								>
									Subscription Benefits
								</h3>
								<p
									className={`${
										darkMode ? "text-gray-300" : "text-gray-700"
									} mb-4`}
								>
									All subscriptions include:
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-start">
										<div
											className={`flex-shrink-0 w-8 h-8 ${
												darkMode ? "bg-blue-900" : "bg-blue-100"
											}  rounded-full flex items-center justify-center mr-3`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className={`h-4 w-4 ${
													darkMode ? "text-blue-300" : "text-blue-900"
												} `}
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
										<div>
											<h4
												className={`font-medium ${
													darkMode ? "text-blue-300" : "text-blue-900"
												}`}
											>
												Cancel Anytime
											</h4>
											<p
												className={`text-sm ${
													darkMode ? "text-blue-400" : "text-blue-600"
												}`}
											>
												No long-term commitments
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<div
											className={`flex-shrink-0 w-8 h-8 ${
												darkMode ? "bg-blue-900" : "bg-blue-100"
											}  rounded-full flex items-center justify-center mr-3`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className={`h-4 w-4 ${
													darkMode ? "text-blue-300" : "text-blue-900"
												}`}
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
												/>
											</svg>
										</div>
										<div>
											<h4
												className={`font-medium ${
													darkMode ? "text-blue-300" : "text-blue-900"
												}`}
											>
												Secure Payments
											</h4>
											<p
												className={`text-sm${
													darkMode ? "text-blue-400" : "text-blue-600"
												}`}
											>
												Your data is always protected
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<div
											className={`flex-shrink-0 w-8 h-8 ${
												darkMode ? "bg-blue-900" : "bg-blue-100"
											}  rounded-full flex items-center justify-center mr-3`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className={`h-4 w-4 ${
													darkMode ? "text-blue-300" : "text-blue-900"
												}`}
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
												/>
											</svg>
										</div>
										<div>
											<h4
												className={`font-medium ${
													darkMode ? "text-blue-300" : "text-blue-900"
												}`}
											>
												Cloud Sync
											</h4>
											<p
												className={`text-sm ${
													darkMode ? "text-blue-400" : "text-blue-600"
												}`}
											>
												Access your content anywhere
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<div
											className={`flex-shrink-0 w-8 h-8 ${
												darkMode ? "bg-blue-900" : "bg-blue-100"
											} rounded-full flex items-center justify-center mr-3`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className={`h-4 w-4 ${
													darkMode ? "text-blue-300" : "text-blue-900"
												}`}
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
												/>
											</svg>
										</div>
										<div>
											<h4
												className={`font-medium ${
													darkMode ? "text-blue-300" : "text-blue-900"
												}`}
											>
												Premium Support
											</h4>
											<p
												className={`text-sm ${
													darkMode ? "text-blue-400" : "text-blue-600"
												}`}
											>
												Priority customer service
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{}
				{isDownloadModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-sm animate-fadeIn">
						<div
							className={`${
								darkMode ? "bg-gray-800" : "bg-white"
							} rounded-xl p-6 md:p-8 w-full max-w-md shadow-neu-float animate-scaleIn`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2
									className={`text-2xl font-bold ${
										darkMode ? "text-blue-400" : "text-blue-900"
									}`}
								>
									Download Magazine
								</h2>
								<button
									className={`${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-600 hover:text-gray-800"
									} cursor-pointer transition-colors duration-300`}
									onClick={toggleDownloadModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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
								</button>
							</div>

							<p
								className={`${
									darkMode ? "text-gray-300" : "text-gray-700"
								} mb-6`}
							>
								Choose a format to download the magazine:
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<button
									className={`flex flex-col items-center justify-center p-4 ${
										darkMode
											? "bg-gray-700 hover:bg-gray-600"
											: "bg-white hover:bg-gray-100"
									} rounded-xl border ${
										darkMode ? "border-gray-600" : "border-gray-300"
									} transition duration-300 cursor-pointer transform hover:scale-105`}
									onClick={() => downloadMagazine("PDF")}
								>
									<div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<span
										className={`font-semibold ${
											darkMode ? "text-white" : "text-gray-800"
										}`}
									>
										PDF
									</span>
									<span className="text-xs text-gray-500 mt-1">
										Universal format for all devices
									</span>
								</button>
								<button
									className={`flex flex-col items-center justify-center p-4 ${
										darkMode
											? "bg-gray-700 hover:bg-gray-600"
											: "bg-white hover:bg-gray-100"
									} rounded-xl border ${
										darkMode ? "border-gray-600" : "border-gray-300"
									} transition duration-300 cursor-pointer transform hover:scale-105`}
									onClick={() => downloadMagazine("EPUB")}
								>
									<div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
									<span
										className={`font-semibold ${
											darkMode ? "text-white" : "text-gray-800"
										}`}
									>
										EPUB
									</span>
									<span className="text-xs text-gray-500 mt-1">
										Best for e-readers
									</span>
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<button
									className={`flex flex-col items-center justify-center p-4 ${
										darkMode
											? "bg-gray-700 hover:bg-gray-600"
											: "bg-white hover:bg-gray-100"
									} rounded-xl border ${
										darkMode ? "border-gray-600" : "border-gray-300"
									} transition duration-300 cursor-pointer transform hover:scale-105`}
									onClick={() => downloadMagazine("MOBI")}
								>
									<div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
									</div>
									<span
										className={`font-semibold text-sm ${
											darkMode ? "text-white" : "text-gray-800"
										}`}
									>
										MOBI
									</span>
									<span className="text-xs text-gray-500">For Kindle</span>
								</button>
								<button
									className={`flex flex-col items-center justify-center p-4 ${
										darkMode
											? "bg-gray-700 hover:bg-gray-600"
											: "bg-white hover:bg-gray-100"
									} rounded-xl border ${
										darkMode ? "border-gray-600" : "border-gray-300"
									} transition duration-300 cursor-pointer transform hover:scale-105`}
									onClick={() => downloadMagazine("HTML")}
								>
									<div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
											/>
										</svg>
									</div>
									<span
										className={`font-semibold text-sm ${
											darkMode ? "text-white" : "text-gray-800"
										}`}
									>
										HTML
									</span>
									<span className="text-xs text-gray-500">
										For web browsers
									</span>
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				{bookmarksModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-sm animate-fadeIn overflow-y-auto">
						<div
							className={`${
								darkMode ? "bg-gray-800" : "bg-white"
							} rounded-xl p-6 md:p-8 w-full max-w-2xl shadow-neu-float animate-scaleIn my-8`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2
									className={`text-2xl font-bold ${
										darkMode ? "text-blue-400" : "text-blue-900"
									}`}
								>
									My Bookmarks
								</h2>
								<button
									className={`${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-600 hover:text-gray-800"
									} cursor-pointer transition-colors duration-300`}
									onClick={toggleBookmarksModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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
								</button>
							</div>

							{bookmarks.length === 0 ? (
								<div className="text-center py-12">
									<div className="w-20 h-20 mx-auto mb-6 text-gray-300">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-full w-full"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1}
												d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
											/>
										</svg>
									</div>
									<h3
										className={`text-xl font-semibold mb-2 ${
											darkMode ? "text-gray-200" : "text-gray-800"
										}`}
									>
										No bookmarks yet
									</h3>
									<p className="text-gray-500 mb-6">
										You haven't saved any bookmarks. Start reading and bookmark
										your favorite sections.
									</p>
									<button
										className="px-4 py-2 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover transition-all duration-300"
										onClick={() => {
											toggleBookmarksModal();
											navigateTo("issues");
										}}
									>
										Browse Issues
									</button>
								</div>
							) : (
								<>
									<div className="mb-4 flex justify-between items-center">
										<p className="text-gray-500">
											{bookmarks.length} saved{" "}
											{bookmarks.length === 1 ? "bookmark" : "bookmarks"}
										</p>
										<button
											className="text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
											onClick={() => {
												setBookmarks([]);
												notify("All bookmarks removed");
											}}
										>
											Clear All
										</button>
									</div>

									<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
										{bookmarks.map((bookmark, index) => {
											const magazine = magazines.find(
												(m) => m.id === bookmark.magazineId
											);

											return (
												<div
													key={`${bookmark.magazineId}-${bookmark.sectionId}-${index}`}
													className={`${
														darkMode
															? "bg-gray-700 hover:bg-gray-600"
															: "bg-gray-50 hover:bg-gray-100"
													} rounded-xl p-4 transition-colors duration-300 cursor-pointer group animate-fadeInDelayed relative`}
													style={{ animationDelay: `${index * 0.05}s` }}
													onClick={() => {
														const magazine = magazines.find(
															(m) => m.id === bookmark.magazineId
														);
														if (magazine) {
															navigateTo("article", magazine.id);
															setActiveSection(bookmark.sectionId);
															toggleBookmarksModal();

															setTimeout(() => {
																scrollToSection(bookmark.sectionId);
															}, 300);
														}
													}}
												>
													<div className="flex items-center">
														<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
															<img
																src={
																	magazine?.coverImage ||
																	"https://via.placeholder.com/50"
																}
																alt={bookmark.magazineTitle}
																className="w-full h-full object-cover"
															/>
														</div>
														<div className="ml-3 flex-grow">
															<h3
																className={`font-semibold ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																{bookmark.magazineTitle}
															</h3>
															<p className="text-xs text-gray-500">
																{bookmark.date} • Section:{" "}
																{bookmark.sectionTitle}
															</p>
														</div>
														<button
															className="text-gray-400 hover:text-red-500 transition-colors duration-300 transform hover:scale-110 p-1"
															onClick={(e) => {
																e.stopPropagation();
																const newBookmarks = bookmarks.filter(
																	(b, i) => i !== index
																);
																setBookmarks(newBookmarks);
																notify("Bookmark removed");
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-5 w-5"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																/>
															</svg>
														</button>
													</div>

													<div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
														<span className="text-xs text-blue-600 flex items-center">
															Read
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4 ml-1"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M14 5l7 7m0 0l-7 7m7-7H3"
																/>
															</svg>
														</span>
													</div>
												</div>
											);
										})}
									</div>
								</>
							)}
						</div>
					</div>
				)}

				{}
				{isSearchModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-sm animate-fadeIn overflow-y-auto">
						<div
							className={`${
								darkMode ? "bg-gray-800" : "bg-white"
							} rounded-xl p-6 md:p-8 w-full max-w-4xl shadow-neu-float animate-scaleIn my-8`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2
									className={`text-2xl font-bold ${
										darkMode ? "text-blue-400" : "text-blue-900"
									}`}
								>
									Search
								</h2>
								<button
									className={`${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-600 hover:text-gray-800"
									} cursor-pointer transition-colors duration-300`}
									onClick={toggleSearchModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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
								</button>
							</div>

							<form onSubmit={handleSearch} className="mb-8">
								<div className="relative">
									<input
										type="text"
										placeholder="Search for magazines, articles, topics..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className={`w-full px-4 py-3 pl-12 rounded-xl border ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
												: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
										} focus:outline-none focus:ring-2 focus:ring-blue-500`}
									/>
									<div
										className={`absolute inset-y-0 left-0 flex items-center pl-4 ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									</div>
									<button
										type="submit"
										className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed transition-all duration-300"
									>
										Search
									</button>
								</div>
							</form>

							{searchResults.length > 0 ? (
								<div>
									<h3
										className={`font-semibold mb-4 ${
											darkMode ? "text-gray-200" : "text-gray-800"
										}`}
									>
										{searchResults.length} results for "{searchTerm}"
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
										{searchResults.map((magazine, index) => (
											<div
												key={`search-${magazine.id}-${index}`}
												className={`${
													darkMode
														? "bg-gray-700 hover:bg-gray-600"
														: "bg-gray-50 hover:bg-gray-100"
												} rounded-xl p-4 transition-colors duration-300 cursor-pointer group animate-fadeInDelayed border-l-4 border-blue-600`}
												style={{ animationDelay: `${index * 0.05}s` }}
												onClick={() => {
													navigateTo("article", magazine.id);
													toggleSearchModal();
												}}
											>
												<div className="flex">
													<div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
														<img
															src={magazine.coverImage}
															alt={magazine.title}
															className="w-full h-full object-cover"
														/>
													</div>
													<div className="ml-4 flex-grow">
														<div className="flex justify-between">
															<h3
																className={`font-semibold ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																{magazine.title}
															</h3>
															{magazine.isExclusive && (
																<span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded">
																	PREMIUM
																</span>
															)}
														</div>
														<p className="text-xs text-gray-500 mb-1">
															{magazine.date} • {magazine.issue} •{" "}
															{magazine.category}
														</p>
														<p
															className={`text-sm line-clamp-2 ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															{magazine.description}
														</p>
													</div>
												</div>
												<div className="mt-2 flex justify-between items-center">
													<div className="flex items-center text-xs text-blue-600">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-3 w-3 mr-1"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														{magazine.readTime}
													</div>
													<button
														className={`text-xs ${
															darkMode ? "text-blue-400" : "text-blue-700"
														} font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
													>
														Read Article
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-3 w-3 ml-1"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M14 5l7 7m0 0l-7 7m7-7H3"
															/>
														</svg>
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							) : searchTerm !== "" ? (
								<div className="text-center py-12">
									<div className="w-20 h-20 mx-auto mb-6 text-gray-300">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-full w-full"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1}
												d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<h3
										className={`text-xl font-semibold mb-2 ${
											darkMode ? "text-gray-200" : "text-gray-800"
										}`}
									>
										No results found
									</h3>
									<p className="text-gray-500 mb-6">
										We couldn't find any matches for "{searchTerm}". Please try
										different keywords.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div
										className={`p-4 rounded-xl ${
											darkMode ? "bg-gray-700" : "bg-gray-50"
										}`}
									>
										<h3
											className={`font-semibold mb-2 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Popular Categories
										</h3>
										<div className="flex flex-wrap gap-2">
											{categories
												.filter((c) => c.id !== "all")
												.map((category) => (
													<button
														key={`search-cat-${category.id}`}
														className={`px-3 py-1 text-xs rounded-full ${
															darkMode
																? "bg-gray-600 text-gray-300"
																: "bg-gray-200 text-gray-700"
														} hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300`}
														onClick={() => {
															setCategoryFilter(category.id);
															navigateTo("issues");
															toggleSearchModal();
														}}
													>
														{category.name}
													</button>
												))}
										</div>
									</div>

									<div
										className={`p-4 rounded-xl ${
											darkMode ? "bg-gray-700" : "bg-gray-50"
										}`}
									>
										<h3
											className={`font-semibold mb-2 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Trending Topics
										</h3>
										<div className="space-y-2">
											<button
												className={`block text-left ${
													darkMode ? "text-blue-400" : "text-blue-700"
												} hover:underline`}
												onClick={() => {
													setSearchTerm("artificial intelligence");
													setTimeout(
														() =>
															handleSearch({
																preventDefault: () => {},
															} as React.FormEvent),
														100
													);
												}}
											>
												Artificial Intelligence
											</button>
											<button
												className={`block text-left ${
													darkMode ? "text-blue-400" : "text-blue-700"
												} hover:underline`}
												onClick={() => {
													setSearchTerm("sustainability");
													setTimeout(
														() =>
															handleSearch({
																preventDefault: () => {},
															} as React.FormEvent),
														100
													);
												}}
											>
												Sustainability
											</button>
											<button
												className={`block text-left ${
													darkMode ? "text-blue-400" : "text-blue-700"
												} hover:underline`}
												onClick={() => {
													setSearchTerm("mental health");
													setTimeout(
														() =>
															handleSearch({
																preventDefault: () => {},
															} as React.FormEvent),
														100
													);
												}}
											>
												Mental Health
											</button>
										</div>
									</div>

									<div
										className={`p-4 rounded-xl ${
											darkMode ? "bg-gray-700" : "bg-gray-50"
										}`}
									>
										<h3
											className={`font-semibold mb-2 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Recent Issues
										</h3>
										<div className="space-y-2">
											{magazines.slice(0, 3).map((magazine) => (
												<button
													key={`search-recent-${magazine.id}`}
													className={`block text-left ${
														darkMode ? "text-blue-400" : "text-blue-700"
													} hover:underline`}
													onClick={() => {
														navigateTo("article", magazine.id);
														toggleSearchModal();
													}}
												>
													{magazine.title}
												</button>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{}
				{isProfileModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-sm animate-fadeIn overflow-y-auto">
						<div
							className={`${
								darkMode ? "bg-gray-800" : "bg-white"
							} rounded-xl p-6 md:p-8 w-full max-w-2xl shadow-neu-float animate-scaleIn my-8`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2
									className={`text-2xl font-bold ${
										darkMode ? "text-blue-400" : "text-blue-900"
									}`}
								>
									My Profile
								</h2>
								<button
									className={`${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-600 hover:text-gray-800"
									} cursor-pointer transition-colors duration-300`}
									onClick={toggleProfileModal}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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
								</button>
							</div>

							<div className="flex flex-col md:flex-row">
								<div className="md:w-1/3 text-center mb-6 md:mb-0">
									<div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500">
										<img
											src={userProfile.avatar}
											alt="Profile"
											className="w-full h-full object-cover"
										/>
									</div>
									<h3
										className={`text-xl font-bold ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										{userProfile.name}
									</h3>
									<p className="text-gray-500 text-sm mb-4">
										Joined {userProfile.joinedDate}
									</p>
									<button
										className="px-4 py-2 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover transition-all duration-300 text-sm"
										onClick={() => notify("Profile photo update coming soon")}
									>
										Change Photo
									</button>
								</div>

								<div className="md:w-2/3 md:pl-8 md:border-l md:border-gray-300">
									<div className="mb-6">
										<h3
											className={`text-lg font-semibold mb-4 ${
												darkMode ? "text-blue-400" : "text-blue-900"
											}`}
										>
											Account Information
										</h3>
										<div className="space-y-4">
											<div>
												<label className="block text-sm text-gray-500 mb-1">
													Email
												</label>
												<div
													className={`p-3 rounded-lg ${
														darkMode ? "bg-gray-700" : "bg-gray-100"
													}`}
												>
													{userProfile.email || "No email set"}
												</div>
											</div>
											<div>
												<label className="block text-sm text-gray-500 mb-1">
													Subscription Plan
												</label>
												<div
													className={`p-3 rounded-lg ${
														darkMode ? "bg-gray-700" : "bg-gray-100"
													} flex justify-between items-center`}
												>
													<span className="capitalize">
														{subscriptionStatus} Plan
													</span>
													<button
														className={`text-sm ${
															darkMode ? "text-blue-400" : "text-blue-700"
														} hover:underline`}
														onClick={() => {
															toggleProfileModal();
															toggleSubscriptionModal();
														}}
													>
														Manage
													</button>
												</div>
											</div>
										</div>
									</div>

									<div>
										<h3
											className={`text-lg font-semibold mb-4 ${
												darkMode ? "text-blue-400" : "text-blue-900"
											}`}
										>
											Preferences
										</h3>
										<div className="space-y-4">
											

											<div className="flex items-center justify-between">
												<div>
													<label className="block text-sm text-gray-500 mb-1">
														Email Notifications
													</label>
													<p
														className={`text-xs ${
															darkMode ? "text-gray-400" : "text-gray-600"
														}`}
													>
														Receive updates about new issues
													</p>
												</div>
												<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
													<input
														type="checkbox"
														name="toggle"
														id="toggle-notifications"
														className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
														checked={
															userProfile.preferences.notificationsEnabled
														}
														onChange={() => {
															setUserProfile({
																...userProfile,
																preferences: {
																	...userProfile.preferences,
																	notificationsEnabled:
																		!userProfile.preferences
																			.notificationsEnabled,
																},
															});
															notify(
																`Notifications ${
																	!userProfile.preferences.notificationsEnabled
																		? "enabled"
																		: "disabled"
																}`
															);
														}}
													/>
													<label
														htmlFor="toggle-notifications"
														className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
															userProfile.preferences.notificationsEnabled
																? "bg-blue-600"
																: "bg-gray-300"
														}`}
													></label>
												</div>
											</div>

											<div>
												<label className="block text-sm text-gray-500 mb-1">
													Default Font Size
												</label>
												<div className="flex items-center">
													<button
														className={`p-2 ${
															darkMode ? "bg-gray-700" : "bg-gray-200"
														} rounded-l-lg`}
														onClick={() => {
															const newSize = Math.max(12, fontSize - 2);
															setFontSize(newSize);
															setUserProfile({
																...userProfile,
																preferences: {
																	...userProfile.preferences,
																	defaultFontSize: newSize,
																},
															});
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M20 12H4"
															/>
														</svg>
													</button>
													<div
														className={`px-4 py-2 ${
															darkMode ? "bg-gray-600" : "bg-gray-100"
														}`}
													>
														{fontSize}px
													</div>
													<button
														className={`p-2 ${
															darkMode ? "bg-gray-700" : "bg-gray-200"
														} rounded-r-lg`}
														onClick={() => {
															const newSize = Math.min(24, fontSize + 2);
															setFontSize(newSize);
															setUserProfile({
																...userProfile,
																preferences: {
																	...userProfile.preferences,
																	defaultFontSize: newSize,
																},
															});
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 6v6m0 0v6m0-6h6m-6 0H6"
															/>
														</svg>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-8 pt-6 border-t border-gray-300 flex justify-between">
								<button
									className="text-red-500 hover:text-red-700 transition-colors duration-300"
									onClick={() => {
										handleLogout();
										toggleProfileModal();
									}}
								>
									<span className="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
											/>
										</svg>
										Logout
									</span>
								</button>

								<button
									className="px-4 py-2 bg-blue-900 text-white rounded-lg shadow-neu-blue hover:shadow-neu-blue-hover active:shadow-neu-blue-pressed transition-all duration-300"
									onClick={() => {
										notify("Profile settings saved");
										toggleProfileModal();
									}}
								>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				<ToastContainer />

				{}
				<style jsx global>{`
					@keyframes fadeIn {
						from {
							opacity: 0;
						}
						to {
							opacity: 1;
						}
					}

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

					@keyframes fadeInDown {
						from {
							opacity: 0;
							transform: translateY(-20px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					@keyframes scaleIn {
						from {
							opacity: 0;
							transform: scale(0.9);
						}
						to {
							opacity: 1;
							transform: scale(1);
						}
					}
					button,
					a {
						cursor: pointer;
					}
					.animate-fadeIn {
						animation: fadeIn 0.5s ease-out;
					}

					.animate-fadeInUp {
						animation: fadeInUp 0.5s ease-out;
					}

					.animate-fadeInDown {
						animation: fadeInDown 0.3s ease-out;
					}

					.animate-scaleIn {
						animation: scaleIn 0.4s ease-out;
					}

					.animate-fadeInDelayed {
						opacity: 0;
						animation: fadeIn 0.5s ease-out forwards;
					}

					.perspective {
						perspective: 1000px;
					}

					.shadow-neu-light {
						box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.05),
							-5px -5px 15px rgba(255, 255, 255, 0.8);
					}

					.shadow-neu-light-hover {
						box-shadow: 7px 7px 20px rgba(0, 0, 0, 0.07),
							-7px -7px 20px rgba(255, 255, 255, 0.9);
					}

					.shadow-neu-light-pressed {
						box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05),
							inset -2px -2px 5px rgba(255, 255, 255, 0.7);
					}

					.shadow-neu-light-glow {
						box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.05),
							-5px -5px 15px rgba(255, 255, 255, 0.8),
							0 0 15px rgba(255, 255, 255, 0.8);
					}

					.shadow-neu-blue {
						box-shadow: 5px 5px 15px rgba(30, 58, 138, 0.2),
							-2px -2px 10px rgba(255, 255, 255, 0.1);
					}

					.shadow-neu-blue-hover {
						box-shadow: 7px 7px 20px rgba(30, 58, 138, 0.3),
							-3px -3px 15px rgba(255, 255, 255, 0.15);
					}

					.shadow-neu-blue-pressed {
						box-shadow: inset 2px 2px 5px rgba(30, 58, 138, 0.5),
							inset -1px -1px 3px rgba(255, 255, 255, 0.2);
					}

					.shadow-neu-float {
						box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1),
							0 5px 15px -5px rgba(0, 0, 0, 0.05);
						transition: box-shadow 0.3s ease, transform 0.3s ease;
					}

					.shadow-neu-float-hover {
						box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.2),
							0 10px 20px -5px rgba(0, 0, 0, 0.1);
					}

					.shadow-neu-red {
						box-shadow: 5px 5px 15px rgba(220, 38, 38, 0.2),
							-2px -2px 10px rgba(255, 255, 255, 0.1);
					}

					.toggle-checkbox:checked {
						transform: translateX(100%);
						border-color: #3b82f6;
					}

					.toggle-checkbox:not(:checked) {
						transform: translateX(0);
						border-color: #d1d5db;
					}

					.toggle-label {
						transition: background-color 0.2s ease;
					}

					.line-clamp-2 {
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
					}

					.reading-mode {
						max-width: 768px;
						margin: 0 auto;
						padding: 2rem;
					}

					.active-section {
						position: relative;
					}

					.active-section::before {
						content: "";
						position: absolute;
						left: -20px;
						top: 0;
						bottom: 0;
						width: 3px;
						background-color: #1e3a8a;
						border-radius: 3px;
					}

					.bookmark-pulse {
						animation: bookmark-pulse 0.7s cubic-bezier(0, 0, 0.2, 1);
					}

					.like-pulse {
						animation: like-pulse 0.7s cubic-bezier(0, 0, 0.2, 1);
					}

					@keyframes bookmark-pulse {
						0% {
							transform: scale(1);
						}
						50% {
							transform: scale(1.3);
						}
						100% {
							transform: scale(1);
						}
					}

					@keyframes like-pulse {
						0% {
							transform: scale(1);
						}
						50% {
							transform: scale(1.3);
						}
						100% {
							transform: scale(1);
						}
					}

					.article-content a {
						color: #2563eb;
						text-decoration: underline;
						text-decoration-thickness: 1px;
						text-underline-offset: 2px;
					}

					.article-content blockquote {
						border-left: 3px solid #3b82f6;
						padding-left: 1rem;
						margin: 1.5rem 0;
						font-style: italic;
						color: #4b5563;
					}

					.article-content h2 {
						font-size: 1.5rem;
						font-weight: 700;
						margin: 1.5rem 0 1rem;
						color: #1e3a8a;
					}

					.article-content h3 {
						font-size: 1.25rem;
						font-weight: 600;
						margin: 1.25rem 0 0.75rem;
						color: #1e3a8a;
					}

					.dark .article-content blockquote {
						color: #9ca3af;
					}

					.dark .article-content h2,
					.dark .article-content h3 {
						color: #60a5fa;
					}
				`}</style>
			</div>
		</ThemeContext.Provider>
	);
};

export default MagazinePortal;
