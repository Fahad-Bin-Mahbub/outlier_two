'use client'
import React, { useState, useEffect, useRef } from "react";
import {
	Bell,
	BookOpen,
	Calendar,
	ChevronDown,
	Clock,
	FileText,
	Home,
	LogOut,
	Menu,
	MessageSquare,
	Moon,
	Search,
	Settings,
	Star,
	Sun,
	User,
	X,
	Book,
	BarChart2,
	Award,
	CheckCircle,
	Play,
	PauseCircle,
	ChevronRight,
	Database,
	Bookmark,
	Heart,
	Share2,
	ArrowUp,
	ArrowRight,
	Zap,
	Download,
	ThumbsUp,
	Edit3,
	Trash2,
	Gift,
	Coffee,
} from "lucide-react";

// Types
type Module = {
	id: string;
	title: string;
	description: string;
	progress: number;
	duration: string;
	category: string;
	image: string;
	level: "Beginner" | "Intermediate" | "Advanced";
	instructor: string;
	enrolled: number;
	ratings: number;
	quiz: Quiz;
	lessons: Lesson[];
	completed: boolean;
};

type Quiz = {
	id: string;
	title: string;
	questions: Question[];
};

type Question = {
	id: string;
	text: string;
	options: string[];
	correctAnswer: number;
};

type Lesson = {
	id: string;
	title: string;
	duration: string;
	completed: boolean;
};

type Resource = {
	id: string;
	title: string;
	type: "PDF" | "Video" | "Article" | "Case Study";
	description: string;
	image: string;
	popular: boolean;
	category: string;
	downloads: number;
};

type User = {
	id: string;
	name: string;
	email: string;
	avatar: string;
	role: string;
	enrolledModules: string[];
	completedModules: string[];
	interests: string[];
	achievements: Achievement[];
	notifications: Notification[];
	joined: string;
	streak: number;
	lastActive: string;
	totalPoints: number;
	level: number;
	theme: "light" | "dark";
};

type Achievement = {
	id: string;
	title: string;
	description: string;
	icon: string;
	completed: boolean;
	progress: number;
	total: number;
};

type Notification = {
	id: string;
	title: string;
	description: string;
	time: string;
	read: boolean;
	type: "achievement" | "message" | "system" | "module";
};

// Demo data
const demoModules: Module[] = [
	{
		id: "m1",
		title: "Introduction to Machine Learning",
		description:
			"Learn the fundamentals of machine learning algorithms and applications.",
		progress: 75,
		duration: "8 hours",
		category: "Data Science",
		image:
			"https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		level: "Beginner",
		instructor: "Dr. Alex Johnson",
		enrolled: 3450,
		ratings: 4.8,
		completed: false,
		lessons: [
			{
				id: "l1",
				title: "Introduction to ML Concepts",
				duration: "45 min",
				completed: true,
			},
			{
				id: "l2",
				title: "Supervised Learning Algorithms",
				duration: "1 hour",
				completed: true,
			},
			{
				id: "l3",
				title: "Unsupervised Learning Fundamentals",
				duration: "50 min",
				completed: true,
			},
			{
				id: "l4",
				title: "Neural Networks Basics",
				duration: "1 hour 15 min",
				completed: false,
			},
			{
				id: "l5",
				title: "ML Project Implementation",
				duration: "2 hours",
				completed: false,
			},
		],
		quiz: {
			id: "q1",
			title: "Machine Learning Fundamentals Quiz",
			questions: [
				{
					id: "q1-1",
					text: "Which of the following is NOT a type of machine learning?",
					options: [
						"Supervised Learning",
						"Unsupervised Learning",
						"Determined Learning",
						"Reinforcement Learning",
					],
					correctAnswer: 2,
				},
				{
					id: "q1-2",
					text: "What algorithm is commonly used for classification problems?",
					options: [
						"Linear Regression",
						"K-Means",
						"Random Forest",
						"Principal Component Analysis",
					],
					correctAnswer: 2,
				},
				{
					id: "q1-3",
					text: 'What does the "gradient" refer to in gradient descent?',
					options: [
						"A color scheme",
						"The slope of the error function",
						"The learning rate",
						"The activation function",
					],
					correctAnswer: 1,
				},
			],
		},
	},
	{
		id: "m2",
		title: "Advanced Web Development",
		description:
			"Master modern web technologies including React, Node.js, and GraphQL.",
		progress: 30,
		duration: "12 hours",
		category: "Programming",
		image:
			"https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		level: "Advanced",
		instructor: "Sarah Williams",
		enrolled: 2180,
		ratings: 4.7,
		completed: false,
		lessons: [
			{
				id: "l1",
				title: "Modern JavaScript Concepts",
				duration: "1 hour",
				completed: true,
			},
			{
				id: "l2",
				title: "React Hooks & Context API",
				duration: "1.5 hours",
				completed: true,
			},
			{
				id: "l3",
				title: "Server-side Rendering with Next.js",
				duration: "1 hour",
				completed: false,
			},
			{
				id: "l4",
				title: "GraphQL API Development",
				duration: "2 hours",
				completed: false,
			},
			{
				id: "l5",
				title: "Performance Optimization",
				duration: "1.5 hours",
				completed: false,
			},
		],
		quiz: {
			id: "q2",
			title: "Advanced Web Development Quiz",
			questions: [
				{
					id: "q2-1",
					text: "Which hook would you use to perform side effects in a React component?",
					options: ["useState", "useEffect", "useContext", "useReducer"],
					correctAnswer: 1,
				},
				{
					id: "q2-2",
					text: "What is the main advantage of GraphQL over REST?",
					options: [
						"It always performs faster",
						"Clients can request exactly what they need",
						"It requires less server resources",
						"It uses JSON format",
					],
					correctAnswer: 1,
				},
				{
					id: "q2-3",
					text: "Which of these is NOT a feature of Next.js?",
					options: [
						"Server-side rendering",
						"Static site generation",
						"Automatic WebSocket support",
						"File-system based routing",
					],
					correctAnswer: 2,
				},
			],
		},
	},
	{
		id: "m3",
		title: "Business Leadership & Management",
		description:
			"Develop essential leadership skills for the modern business environment.",
		progress: 90,
		duration: "10 hours",
		category: "Business",
		image:
			"https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		level: "Intermediate",
		instructor: "Michael Chen",
		enrolled: 4120,
		ratings: 4.9,
		completed: false,
		lessons: [
			{
				id: "l1",
				title: "Leadership Fundamentals",
				duration: "1 hour",
				completed: true,
			},
			{
				id: "l2",
				title: "Effective Communication Strategies",
				duration: "1.5 hours",
				completed: true,
			},
			{
				id: "l3",
				title: "Team Building & Motivation",
				duration: "1 hour",
				completed: true,
			},
			{
				id: "l4",
				title: "Decision Making & Problem Solving",
				duration: "2 hours",
				completed: true,
			},
			{
				id: "l5",
				title: "Strategic Planning",
				duration: "1.5 hours",
				completed: false,
			},
		],
		quiz: {
			id: "q3",
			title: "Business Leadership Quiz",
			questions: [
				{
					id: "q3-1",
					text: "Which leadership style is characterized by involving team members in decision-making?",
					options: [
						"Autocratic",
						"Democratic",
						"Laissez-faire",
						"Transactional",
					],
					correctAnswer: 1,
				},
				{
					id: "q3-2",
					text: "What is the primary purpose of a SWOT analysis?",
					options: [
						"Financial forecasting",
						"Market research",
						"Strategic planning",
						"Performance evaluation",
					],
					correctAnswer: 2,
				},
				{
					id: "q3-3",
					text: "Which of the following is NOT one of the five conflict resolution styles?",
					options: ["Compromising", "Collaborating", "Dictating", "Avoiding"],
					correctAnswer: 2,
				},
			],
		},
	},
	{
		id: "m4",
		title: "UX/UI Design Fundamentals",
		description:
			"Learn the principles of effective user experience and interface design.",
		progress: 10,
		duration: "8 hours",
		category: "Design",
		image:
			"https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		level: "Beginner",
		instructor: "Emma Rodriguez",
		enrolled: 2850,
		ratings: 4.6,
		completed: false,
		lessons: [
			{
				id: "l1",
				title: "UX Research Methods",
				duration: "1 hour",
				completed: true,
			},
			{
				id: "l2",
				title: "User-Centered Design Principles",
				duration: "1 hour",
				completed: false,
			},
			{
				id: "l3",
				title: "Wireframing & Prototyping",
				duration: "1.5 hours",
				completed: false,
			},
			{
				id: "l4",
				title: "Usability Testing",
				duration: "1 hour",
				completed: false,
			},
			{
				id: "l5",
				title: "Visual Design Elements",
				duration: "1.5 hours",
				completed: false,
			},
		],
		quiz: {
			id: "q4",
			title: "UX/UI Design Quiz",
			questions: [
				{
					id: "q4-1",
					text: "What is the purpose of a user persona?",
					options: [
						"To document technical requirements",
						"To represent typical users of your product",
						"To track user analytics",
						"To create marketing materials",
					],
					correctAnswer: 1,
				},
				{
					id: "q4-2",
					text: "Which of these is NOT a common UX research method?",
					options: [
						"Usability testing",
						"A/B testing",
						"Code debugging",
						"User interviews",
					],
					correctAnswer: 2,
				},
				{
					id: "q4-3",
					text: 'What does the term "affordance" refer to in UI design?',
					options: [
						"The cost of implementing a feature",
						"The visual quality of an interface",
						"How an object suggests its own use",
						"The time it takes to develop",
					],
					correctAnswer: 2,
				},
			],
		},
	},
];

const demoResources: Resource[] = [
	{
		id: "r1",
		title: "Machine Learning Algorithms Cheat Sheet",
		type: "PDF",
		description:
			"A comprehensive guide to common machine learning algorithms and their applications.",
		image:
			"https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		popular: true,
		category: "Data Science",
		downloads: 3452,
	},
	{
		id: "r2",
		title: "React Performance Optimization Techniques",
		type: "Article",
		description:
			"Learn how to optimize your React applications for better performance and user experience.",
		image:
			"https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		popular: true,
		category: "Programming",
		downloads: 2180,
	},
	{
		id: "r3",
		title: "Effective Leadership in Crisis Situations",
		type: "Case Study",
		description:
			"A detailed analysis of leadership strategies during organizational crises.",
		image:
			"https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		popular: false,
		category: "Business",
		downloads: 1670,
	},
	{
		id: "r4",
		title: "UX Research Methods Explained",
		type: "Video",
		description:
			"A comprehensive guide to various user research methods and when to use them.",
		image:
			"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		popular: true,
		category: "Design",
		downloads: 2345,
	},
	{
		id: "r5",
		title: "Introduction to Cloud Computing",
		type: "PDF",
		description:
			"Learn the fundamentals of cloud computing and its implementation in modern IT infrastructure.",
		image:
			"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		popular: false,
		category: "IT Infrastructure",
		downloads: 1890,
	},
	{
		id: "r6",
		title: "Digital Marketing Strategy Framework",
		type: "Article",
		description:
			"A comprehensive framework for developing effective digital marketing strategies.",
		image:
			"https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		popular: true,
		category: "Marketing",
		downloads: 2760,
	},
];

const demoUser: User = {
	id: "u1",
	name: "Jamie Smith",
	email: "jamie.smith@example.com",
	avatar:
		"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
	role: "Software Developer",
	enrolledModules: ["m1", "m2", "m3", "m4"],
	completedModules: [],
	interests: ["Programming", "Data Science", "Design"],
	achievements: [
		{
			id: "a1",
			title: "First Module Completed",
			description: "Complete your first learning module",
			icon: "🏆",
			completed: false,
			progress: 0,
			total: 1,
		},
		{
			id: "a2",
			title: "Knowledge Seeker",
			description: "Enroll in 5 different modules",
			icon: "📚",
			completed: false,
			progress: 4,
			total: 5,
		},
		{
			id: "a3",
			title: "Perfect Score",
			description: "Score 100% on any quiz",
			icon: "🎯",
			completed: false,
			progress: 0,
			total: 1,
		},
		{
			id: "a4",
			title: "7-Day Streak",
			description: "Log in for 7 consecutive days",
			icon: "🔥",
			completed: false,
			progress: 5,
			total: 7,
		},
	],
	notifications: [
		{
			id: "n1",
			title: "New Module Available",
			description: 'Check out the new "Cybersecurity Fundamentals" module!',
			time: "2 hours ago",
			read: false,
			type: "module",
		},
		{
			id: "n2",
			title: "Quiz Reminder",
			description: 'You have an incomplete quiz in "Machine Learning" module.',
			time: "1 day ago",
			read: true,
			type: "system",
		},
		{
			id: "n3",
			title: "Achievement Progress",
			description: 'You\'re close to earning the "Knowledge Seeker" badge!',
			time: "3 days ago",
			read: true,
			type: "achievement",
		},
	],
	joined: "March 2025",
	streak: 5,
	lastActive: "Today",
	totalPoints: 1250,
	level: 4,
	theme: "light",
};

// Main component
const LearningPortal: React.FC = () => {
	const [user, setUser] = useState<User>(demoUser);
	const [modules, setModules] = useState<Module[]>(demoModules);
	const [resources, setResources] = useState<Resource[]>(demoResources);
	const [activeSection, setActiveSection] = useState<string>("home");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
	const [activeModule, setActiveModule] = useState<Module | null>(null);
	const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[key: string]: number;
	}>({});
	const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
	const [quizScore, setQuizScore] = useState<number>(0);
	const [showNotifications, setShowNotifications] = useState<boolean>(false);
	const [editingProfile, setEditingProfile] = useState<boolean>(false);
	const [editedUser, setEditedUser] = useState<User>(demoUser);
	const [activeResourceType, setActiveResourceType] = useState<string>("All");
	const [showResourceDetail, setShowResourceDetail] = useState<string | null>(
		null
	);
	const [filteredModules, setFilteredModules] = useState<Module[]>(modules);
	const [activeModuleCategory, setActiveModuleCategory] =
		useState<string>("All");
	const [activeModuleLevel, setActiveModuleLevel] = useState<string>("All");
	const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
	const [theme, setTheme] = useState<"light" | "dark">(user.theme);
	const [aiSearchResults, setAiSearchResults] = useState<(Module | Resource)[]>(
		[]
	);
	const [showAiSearchResults, setShowAiSearchResults] =
		useState<boolean>(false);
	const profileMenuRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [downloadingResource, setDownloadingResource] = useState<string | null>(
		null
	);
	const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
	const [likedModules, setLikedModules] = useState<string[]>([]);
	const [searchFocused, setSearchFocused] = useState<boolean>(false);

	// Update filtered modules when filters change
	useEffect(() => {
		let filtered = [...modules];

		if (activeModuleCategory !== "All") {
			filtered = filtered.filter(
				(module) => module.category === activeModuleCategory
			);
		}

		if (activeModuleLevel !== "All") {
			filtered = filtered.filter(
				(module) => module.level === activeModuleLevel
			);
		}

		setFilteredModules(filtered);
	}, [modules, activeModuleCategory, activeModuleLevel]);

	// AI search recommendation logic
	useEffect(() => {
		if (searchQuery.length > 2) {
			// Simulate AI search results based on query and user interests
			const moduleResults = modules.filter(
				(module) =>
					module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					module.description
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					module.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
					user.interests.some((interest) =>
						module.category.toLowerCase().includes(interest.toLowerCase())
					)
			);

			const resourceResults = resources.filter(
				(resource) =>
					resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					resource.description
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
					user.interests.some((interest) =>
						resource.category.toLowerCase().includes(interest.toLowerCase())
					)
			);

			// Combine and sort by relevance (simulated)
			const combinedResults = [...moduleResults, ...resourceResults];
			setAiSearchResults(combinedResults.slice(0, 5)); // Limit to top 5 results
			setShowAiSearchResults(combinedResults.length > 0);
		} else {
			setShowAiSearchResults(false);
		}
	}, [searchQuery, modules, resources, user.interests]);

	// Close dropdown menus when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target as Node)
			) {
				setShowProfileMenu(false);
			}

			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target as Node)
			) {
				setShowNotifications(false);
			}

			if (
				searchInputRef.current &&
				!searchInputRef.current.contains(event.target as Node)
			) {
				setShowAiSearchResults(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Handle module enrollment
	const handleEnrollModule = (moduleId: string) => {
		setUser((prev) => ({
			...prev,
			enrolledModules: [...prev.enrolledModules, moduleId],
		}));

		// Update achievement progress
		updateAchievementProgress("a2", 1);

		// Add notification
		addNotification({
			id: `n${Date.now()}`,
			title: "Successfully Enrolled",
			description: `You've enrolled in a new module. Start learning now!`,
			time: "Just now",
			read: false,
			type: "module",
		});
	};

	// Update achievement progress
	const updateAchievementProgress = (
		achievementId: string,
		increment: number
	) => {
		setUser((prev) => ({
			...prev,
			achievements: prev.achievements.map((achievement) => {
				if (achievement.id === achievementId) {
					const newProgress = Math.min(
						achievement.progress + increment,
						achievement.total
					);
					const completed = newProgress >= achievement.total;

					if (completed && !achievement.completed) {
						// Add notification for completed achievement
						addNotification({
							id: `n${Date.now()}`,
							title: "Achievement Unlocked!",
							description: `You've earned the "${achievement.title}" badge!`,
							time: "Just now",
							read: false,
							type: "achievement",
						});
					}

					return {
						...achievement,
						progress: newProgress,
						completed: completed,
					};
				}
				return achievement;
			}),
		}));
	};

	// Add notification
	const addNotification = (notification: Notification) => {
		setUser((prev) => ({
			...prev,
			notifications: [notification, ...prev.notifications],
		}));
	};

	// Handle lesson completion
	const handleCompleteLesson = (moduleId: string, lessonId: string) => {
		setModules((prev) =>
			prev.map((module) => {
				if (module.id === moduleId) {
					const updatedLessons = module.lessons.map((lesson) =>
						lesson.id === lessonId ? { ...lesson, completed: true } : lesson
					);

					// Calculate new progress percentage
					const completedCount = updatedLessons.filter(
						(l) => l.completed
					).length;
					const newProgress = Math.round(
						(completedCount / updatedLessons.length) * 100
					);

					// Check if all lessons are completed
					const allCompleted = updatedLessons.every((l) => l.completed);

					return {
						...module,
						lessons: updatedLessons,
						progress: newProgress,
						completed: allCompleted,
					};
				}
				return module;
			})
		);

		// If all lessons in module are completed, add to user's completed modules
		const updatedModule = modules.find((m) => m.id === moduleId);
		if (updatedModule) {
			const allLessonsCompleted = updatedModule.lessons.every((l) =>
				l.id === lessonId ? true : l.completed
			);

			if (allLessonsCompleted) {
				setUser((prev) => ({
					...prev,
					completedModules: [...prev.completedModules, moduleId],
				}));

				// Update achievement progress
				updateAchievementProgress("a1", 1);
			}
		}
	};

	// Handle quiz answer selection
	const handleSelectAnswer = (questionId: string, optionIndex: number) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionId]: optionIndex,
		}));
	};

	// Handle quiz submission
	const handleSubmitQuiz = () => {
		if (!activeQuiz) return;

		// Calculate score
		let correctAnswers = 0;
		activeQuiz.questions.forEach((question) => {
			if (selectedAnswers[question.id] === question.correctAnswer) {
				correctAnswers++;
			}
		});

		const score = Math.round(
			(correctAnswers / activeQuiz.questions.length) * 100
		);
		setQuizScore(score);
		setQuizCompleted(true);

		// If perfect score, update achievement
		if (score === 100) {
			updateAchievementProgress("a3", 1);
		}

		// Add points to user
		setUser((prev) => ({
			...prev,
			totalPoints: prev.totalPoints + score,
		}));
	};

	// Handle user profile update
	const handleUpdateProfile = () => {
		setUser(editedUser);
		setEditingProfile(false);

		// Add notification
		addNotification({
			id: `n${Date.now()}`,
			title: "Profile Updated",
			description: "Your profile information has been successfully updated.",
			time: "Just now",
			read: false,
			type: "system",
		});
	};

	// Handle theme toggle
	const handleToggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		setUser((prev) => ({
			...prev,
			theme: newTheme,
		}));
	};

	// Handle resource bookmark toggle
	const handleToggleBookmark = (resourceId: string) => {
		if (bookmarkedResources.includes(resourceId)) {
			setBookmarkedResources((prev) => prev.filter((id) => id !== resourceId));
		} else {
			setBookmarkedResources((prev) => [...prev, resourceId]);

			// Add notification
			addNotification({
				id: `n${Date.now()}`,
				title: "Resource Bookmarked",
				description: "You can access bookmarked resources in your profile.",
				time: "Just now",
				read: false,
				type: "system",
			});
		}
	};

	// Handle module like toggle
	const handleToggleLike = (moduleId: string) => {
		if (likedModules.includes(moduleId)) {
			setLikedModules((prev) => prev.filter((id) => id !== moduleId));
		} else {
			setLikedModules((prev) => [...prev, moduleId]);
		}
	};

	// Handle mark notifications as read
	const handleMarkAllNotificationsRead = () => {
		setUser((prev) => ({
			...prev,
			notifications: prev.notifications.map((notification) => ({
				...notification,
				read: true,
			})),
		}));
	};

	// Handle resource download
	const handleDownloadResource = (resourceId: string) => {
		setDownloadingResource(resourceId);

		// Simulate download delay
		setTimeout(() => {
			setDownloadingResource(null);

			// Update resource download count
			setResources((prev) =>
				prev.map((resource) =>
					resource.id === resourceId
						? { ...resource, downloads: resource.downloads + 1 }
						: resource
				)
			);

			// Add notification
			addNotification({
				id: `n${Date.now()}`,
				title: "Download Complete",
				description: "Your resource has been successfully downloaded.",
				time: "Just now",
				read: false,
				type: "system",
			});
		}, 1500);
	};

	// Generate color classes based on theme
	const getThemeClasses = () => {
		return theme === "light"
			? {
					bg: "bg-gray-50",
					text: "text-gray-900",
					card: "bg-white/80 backdrop-blur-md border border-gray-200/50",
					input: "bg-white/90 border-gray-200/70",
					button: "bg-blue-600 hover:bg-blue-700 text-white",
					buttonSecondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
					nav: "bg-white/90 backdrop-blur-md border-gray-200/50",
					accent: "bg-blue-600",
					accentHover: "hover:bg-blue-700",
					glass: "bg-white/30 backdrop-blur-lg border border-white/30",
					highlight: "bg-blue-50",
			  }
			: {
					bg: "bg-gray-900",
					text: "text-gray-50",
					card: "bg-gray-800/80 backdrop-blur-md border border-gray-700/50",
					input: "bg-gray-800/90 border-gray-700/70",
					button: "bg-blue-600 hover:bg-blue-700 text-white",
					buttonSecondary: "bg-gray-700 hover:bg-gray-600 text-gray-100",
					nav: "bg-gray-800/90 backdrop-blur-md border-gray-700/50",
					accent: "bg-blue-600",
					accentHover: "hover:bg-blue-700",
					glass: "bg-gray-800/30 backdrop-blur-lg border border-gray-600/30",
					highlight: "bg-gray-700/50",
			  };
	};

	const themeClasses = getThemeClasses();

	return (
		<div
			className={`min-h-screen w-full ${themeClasses.bg} ${themeClasses.text} transition-colors duration-300`}
		>
			{/* Header Navigation */}
			<header
				className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.nav} border-b`}
			>
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center space-x-1">
						<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center">
							<BookOpen className="text-white" size={20} />
						</div>
						<h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
							LearnHub
						</h1>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<button
							onClick={() => setActiveSection("home")}
							className={`flex items-center space-x-1 py-2 border-b-2 transition-colors ${
								activeSection === "home"
									? "border-blue-600 text-blue-600"
									: "border-transparent hover:text-blue-600"
							}`}
						>
							<Home size={18} />
							<span>Home</span>
						</button>
						<button
							onClick={() => setActiveSection("modules")}
							className={`flex items-center space-x-1 py-2 border-b-2 transition-colors ${
								activeSection === "modules"
									? "border-blue-600 text-blue-600"
									: "border-transparent hover:text-blue-600"
							}`}
						>
							<Book size={18} />
							<span>Modules</span>
						</button>
						<button
							onClick={() => setActiveSection("resources")}
							className={`flex items-center space-x-1 py-2 border-b-2 transition-colors ${
								activeSection === "resources"
									? "border-blue-600 text-blue-600"
									: "border-transparent hover:text-blue-600"
							}`}
						>
							<Database size={18} />
							<span>Resources</span>
						</button>
						<button
							onClick={() => setActiveSection("profile")}
							className={`flex items-center space-x-1 py-2 border-b-2 transition-colors ${
								activeSection === "profile"
									? "border-blue-600 text-blue-600"
									: "border-transparent hover:text-blue-600"
							}`}
						>
							<User size={18} />
							<span>Profile</span>
						</button>
					</nav>

					{/* Right side items */}
					<div className="flex items-center space-x-4">
						{/* Search */}
						<div className="relative hidden sm:block">
							<div
								className={`flex items-center ${
									themeClasses.input
								} rounded-lg pr-3 transition-all duration-300 ${
									searchFocused ? "w-64" : "w-48"
								}`}
							>
								<input
									ref={searchInputRef}
									type="text"
									placeholder="Search..."
									className="bg-transparent border-none w-full py-2 px-3 focus:outline-none"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onFocus={() => setSearchFocused(true)}
									onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
								/>
								<Search size={18} className="text-gray-500" />
							</div>

							{/* AI Search Results */}
							{showAiSearchResults && searchQuery.length > 2 && (
								<div
									className={`absolute top-full left-0 mt-2 w-72 ${themeClasses.card} rounded-lg shadow-lg p-2 z-50 animate-fadeIn`}
								>
									<div className="flex items-center mb-2 px-2">
										<Zap size={14} className="text-blue-500 mr-1" />
										<p className="text-xs font-semibold text-blue-600">
											AI Recommendations
										</p>
									</div>
									{aiSearchResults.map((item, index) => (
										<button
											key={index}
											className={`w-full text-left p-2 rounded-md transition-colors flex items-center space-x-2 ${themeClasses.highlight} hover:bg-blue-500/10`}
											onClick={() => {
												if ("lessons" in item) {
													// It's a module
													setActiveModule(item);
													setActiveSection("moduleDetail");
												} else {
													// It's a resource
													setShowResourceDetail(item.id);
													setActiveSection("resources");
												}
												setShowAiSearchResults(false);
												setSearchQuery("");
											}}
										>
											{"lessons" in item ? (
												<>
													<Book size={16} className="text-blue-500" />
													<div>
														<p className="font-medium line-clamp-1">
															{item.title}
														</p>
														<p className="text-xs opacity-70">
															Module • {item.category}
														</p>
													</div>
												</>
											) : (
												<>
													<FileText size={16} className="text-blue-500" />
													<div>
														<p className="font-medium line-clamp-1">
															{item.title}
														</p>
														<p className="text-xs opacity-70">
															{item.type} • {item.category}
														</p>
													</div>
												</>
											)}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Notifications */}
						<div className="relative" ref={notificationsRef}>
							<button
								className="relative p-2 rounded-full hover:bg-gray-200/50 transition-colors"
								onClick={() => setShowNotifications(!showNotifications)}
							>
								<Bell size={20} />
								{user.notifications.some((n) => !n.read) && (
									<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
								)}
							</button>

							{showNotifications && (
								<div
									className={`absolute top-full right-0 mt-2 w-80 ${themeClasses.card} rounded-lg shadow-lg p-3 z-50 animate-fadeIn`}
								>
									<div className="flex items-center justify-between mb-2">
										<h3 className="font-bold">Notifications</h3>
										<button
											className="text-xs text-blue-600 hover:text-blue-700"
											onClick={handleMarkAllNotificationsRead}
										>
											Mark all as read
										</button>
									</div>

									<div className="max-h-80 overflow-y-auto">
										{user.notifications.length > 0 ? (
											user.notifications.map((notification) => (
												<div
													key={notification.id}
													className={`p-2 mb-2 rounded-lg transition-colors ${
														!notification.read
															? `${themeClasses.highlight}`
															: ""
													}`}
												>
													<div className="flex items-start">
														<div className="mt-1 mr-2">
															{notification.type === "achievement" ? (
																<Award size={16} className="text-yellow-500" />
															) : notification.type === "module" ? (
																<Book size={16} className="text-blue-500" />
															) : notification.type === "message" ? (
																<MessageSquare
																	size={16}
																	className="text-green-500"
																/>
															) : (
																<Bell size={16} className="text-gray-500" />
															)}
														</div>
														<div className="flex-1">
															<p className="font-medium text-sm">
																{notification.title}
															</p>
															<p className="text-xs opacity-70">
																{notification.description}
															</p>
															<p className="text-xs opacity-50 mt-1">
																{notification.time}
															</p>
														</div>
													</div>
												</div>
											))
										) : (
											<p className="text-center text-sm opacity-70 py-4">
												No notifications
											</p>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Theme Toggle */}
						<button
							className="p-2 rounded-full hover:bg-gray-200/50 transition-colors hidden sm:block"
							onClick={handleToggleTheme}
						>
							{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
						</button>

						{/* User Profile */}
						<div className="relative" ref={profileMenuRef}>
							<button
								className="flex items-center space-x-2"
								onClick={() => setShowProfileMenu(!showProfileMenu)}
							>
								<img
									src={user.avatar}
									alt="Profile"
									className="w-8 h-8 rounded-full border-2 border-blue-500"
								/>
								<span className="hidden md:block font-medium">
									{user.name.split(" ")[0]}
								</span>
								<ChevronDown size={16} className="hidden md:block" />
							</button>

							{showProfileMenu && (
								<div
									className={`absolute top-full right-0 mt-2 w-60 ${themeClasses.card} rounded-lg shadow-lg py-2 z-50 animate-fadeIn`}
								>
									<div className="px-4 py-2 border-b border-gray-200/20">
										<p className="font-medium">{user.name}</p>
										<p className="text-xs opacity-70">{user.email}</p>
									</div>

									<button
										className="w-full text-left px-4 py-2 hover:bg-blue-500/10 transition-colors flex items-center space-x-2"
										onClick={() => {
											setActiveSection("profile");
											setShowProfileMenu(false);
										}}
									>
										<User size={16} />
										<span>Profile</span>
									</button>

									<button
										className="w-full text-left px-4 py-2 hover:bg-blue-500/10 transition-colors flex items-center space-x-2"
										onClick={handleToggleTheme}
									>
										{theme === "light" ? (
											<>
												<Moon size={16} />
												<span>Dark Mode</span>
											</>
										) : (
											<>
												<Sun size={16} />
												<span>Light Mode</span>
											</>
										)}
									</button>

									<button className="w-full text-left px-4 py-2 hover:bg-blue-500/10 transition-colors flex items-center space-x-2">
										<Settings size={16} />
										<span>Settings</span>
									</button>

									<div className="border-t border-gray-200/20 mt-1 pt-1">
										<button className="w-full text-left px-4 py-2 hover:bg-blue-500/10 transition-colors flex items-center space-x-2 text-red-500">
											<LogOut size={16} />
											<span>Logout</span>
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Mobile Menu Button */}
						<button
							className="p-2 rounded-full hover:bg-gray-200/50 transition-colors md:hidden"
							onClick={() => setShowMobileMenu(!showMobileMenu)}
						>
							{showMobileMenu ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{showMobileMenu && (
					<div
						className={`md:hidden ${themeClasses.nav} border-t border-gray-200/20 py-2 px-4 animate-fadeIn`}
					>
						<div className="flex items-center border-b border-gray-200/20 pb-2 mb-2">
							<Search size={18} className="text-gray-500 mr-2" />
							<input
								type="text"
								placeholder="Search..."
								className="bg-transparent border-none w-full py-1 focus:outline-none"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<nav className="flex flex-col space-y-1">
							<button
								onClick={() => {
									setActiveSection("home");
									setShowMobileMenu(false);
								}}
								className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
									activeSection === "home"
										? "bg-blue-500/10 text-blue-600"
										: "hover:bg-gray-200/50"
								}`}
							>
								<Home size={18} />
								<span>Home</span>
							</button>
							<button
								onClick={() => {
									setActiveSection("modules");
									setShowMobileMenu(false);
								}}
								className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
									activeSection === "modules"
										? "bg-blue-500/10 text-blue-600"
										: "hover:bg-gray-200/50"
								}`}
							>
								<Book size={18} />
								<span>Modules</span>
							</button>
							<button
								onClick={() => {
									setActiveSection("resources");
									setShowMobileMenu(false);
								}}
								className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
									activeSection === "resources"
										? "bg-blue-500/10 text-blue-600"
										: "hover:bg-gray-200/50"
								}`}
							>
								<Database size={18} />
								<span>Resources</span>
							</button>
							<button
								onClick={() => {
									setActiveSection("profile");
									setShowMobileMenu(false);
								}}
								className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
									activeSection === "profile"
										? "bg-blue-500/10 text-blue-600"
										: "hover:bg-gray-200/50"
								}`}
							>
								<User size={18} />
								<span>Profile</span>
							</button>
							<button
								onClick={handleToggleTheme}
								className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200/50 transition-colors"
							>
								{theme === "light" ? (
									<>
										<Moon size={18} />
										<span>Dark Mode</span>
									</>
								) : (
									<>
										<Sun size={18} />
										<span>Light Mode</span>
									</>
								)}
							</button>
						</nav>
					</div>
				)}
			</header>

			{/* Main Content */}
			<main className="pt-16 pb-20">
				{/* Home Section */}
				{activeSection === "home" && (
					<div className="container mx-auto px-4 py-8">
						{/* Hero Section */}
						<div
							className={`relative overflow-hidden rounded-2xl ${themeClasses.glass} p-8 mb-8`}
						>
							<div className="relative z-10 max-w-2xl">
								<h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
									Expand Your Knowledge with LearnHub
								</h1>
								<p className="text-lg mb-6 opacity-80">
									Access cutting-edge courses and resources that help you grow
									professionally and personally.
								</p>
								<div className="flex flex-wrap gap-3">
									<button
										onClick={() => setActiveSection("modules")}
										className={`${themeClasses.button} px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105`}
									>
										<Book size={18} />
										<span>Browse Modules</span>
									</button>
									<button
										onClick={() => {
											// Show a featured module
											const featuredModule = modules.find((m) => m.id === "m1");
											if (featuredModule) {
												setActiveModule(featuredModule);
												setActiveSection("moduleDetail");
											}
										}}
										className={`${themeClasses.buttonSecondary} px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105`}
									>
										<Play size={18} />
										<span>Start Learning</span>
									</button>
								</div>
							</div>

							{/* Background Elements */}
							<div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
							<div className="absolute bottom-0 left-20 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-20 translate-y-1/2"></div>
						</div>

						{/* User Progress Section */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold">Your Learning Progress</h2>
								<button
									onClick={() => setActiveSection("profile")}
									className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
								>
									<span>View all</span>
									<ChevronRight size={16} />
								</button>
							</div>

							{user.enrolledModules.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{modules
										.filter((module) =>
											user.enrolledModules.includes(module.id)
										)
										.slice(0, 3)
										.map((module) => (
											<button
												key={module.id}
												onClick={() => {
													setActiveModule(module);
													setActiveSection("moduleDetail");
												}}
												className={`${themeClasses.card} rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-102 text-left`}
											>
												<div className="flex items-center space-x-3 mb-3">
													<div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
														<Book size={18} className="text-white" />
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-base truncate pr-4">
															{module.title}
														</h3>
														<p className="text-xs opacity-70">
															{module.category} • {module.level}
														</p>
													</div>
												</div>
												<div className="mb-2">
													<div className="flex items-center justify-between mb-1">
														<span className="text-xs opacity-70">
															{module.progress}% complete
														</span>
														<span className="text-xs opacity-70">
															{module.lessons.filter((l) => l.completed).length}
															/{module.lessons.length} lessons
														</span>
													</div>
													<div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
														<div
															className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
															style={{ width: `${module.progress}%` }}
														></div>
													</div>
												</div>
												<div className="flex items-center justify-between text-xs mt-3">
													<span className="flex items-center opacity-70">
														<Clock size={12} className="mr-1" />
														{module.duration}
													</span>
													{module.completed ? (
														<span className="flex items-center text-green-500">
															<CheckCircle size={12} className="mr-1" />
															Completed
														</span>
													) : (
														<span className="flex items-center text-blue-600">
															<Play size={12} className="mr-1" />
															Continue
														</span>
													)}
												</div>
											</button>
										))}
								</div>
							) : (
								<div
									className={`${themeClasses.card} rounded-xl p-6 text-center`}
								>
									<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
										<Book size={24} className="text-blue-600" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										No modules enrolled yet
									</h3>
									<p className="text-sm opacity-70 mb-4">
										Start your learning journey by enrolling in a module.
									</p>
									<button
										onClick={() => setActiveSection("modules")}
										className={`${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium`}
									>
										Browse Modules
									</button>
								</div>
							)}
						</div>

						{/* Featured Modules */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold">Recommended For You</h2>
								<button
									onClick={() => setActiveSection("modules")}
									className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
								>
									<span>Browse all</span>
									<ChevronRight size={16} />
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{modules
									.filter(
										(module) =>
											!user.enrolledModules.includes(module.id) &&
											user.interests.some((interest) =>
												module.category.includes(interest)
											)
									)
									.slice(0, 3)
									.map((module) => (
										<div
											key={module.id}
											className={`${themeClasses.card} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-102 group`}
										>
											<div className="h-36 overflow-hidden relative">
												<img
													src={module.image}
													alt={module.title}
													className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
												/>
												<div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">
													{module.level}
												</div>
											</div>
											<div className="p-4">
												<h3 className="font-semibold mb-1 line-clamp-1">
													{module.title}
												</h3>
												<p className="text-xs mb-3 opacity-70">
													{module.category} • {module.duration}
												</p>
												<p className="text-sm mb-4 line-clamp-2 opacity-80">
													{module.description}
												</p>
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-1">
														<span className="flex items-center text-yellow-500">
															<Star size={14} className="fill-current" />
														</span>
														<span className="text-sm font-medium">
															{module.ratings}
														</span>
														<span className="text-xs opacity-70">
															({module.enrolled})
														</span>
													</div>
													<button
														onClick={() => {
															setActiveModule(module);
															setActiveSection("moduleDetail");
														}}
														className={`${themeClasses.button} px-3 py-1.5 rounded-lg text-xs font-medium`}
													>
														View Module
													</button>
												</div>
											</div>
										</div>
									))}
							</div>
						</div>

						{/* Popular Resources */}
						<div>
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold">Popular Resources</h2>
								<button
									onClick={() => setActiveSection("resources")}
									className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
								>
									<span>View all</span>
									<ChevronRight size={16} />
								</button>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								{resources
									.filter((resource) => resource.popular)
									.slice(0, 4)
									.map((resource) => (
										<button
											key={resource.id}
											onClick={() => {
												setShowResourceDetail(resource.id);
												setActiveSection("resources");
											}}
											className={`${themeClasses.card} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-102 text-left`}
										>
											<div className="h-28 overflow-hidden relative">
												<img
													src={resource.image}
													alt={resource.title}
													className="w-full h-full object-cover"
												/>
												<div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">
													{resource.type}
												</div>
											</div>
											<div className="p-3">
												<h3 className="font-medium text-sm mb-1 line-clamp-1">
													{resource.title}
												</h3>
												<p className="text-xs opacity-70 mb-2">
													{resource.category}
												</p>
												<div className="flex items-center text-xs opacity-70">
													<Download size={12} className="mr-1" />
													<span>
														{resource.downloads.toLocaleString()} downloads
													</span>
												</div>
											</div>
										</button>
									))}
							</div>
						</div>
					</div>
				)}

				{/* Modules Section */}
				{activeSection === "modules" && (
					<div className="container mx-auto px-4 py-8">
						<h1 className="text-2xl font-bold mb-6">Learning Modules</h1>

						{/* Filters */}
						<div className={`${themeClasses.card} rounded-xl p-4 mb-6`}>
							<div className="flex flex-wrap gap-4">
								<div className="flex-1 min-w-[200px]">
									<label className="block text-sm font-medium mb-1 opacity-70">
										Category
									</label>
									<select
										className={`w-full ${themeClasses.input} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
										value={activeModuleCategory}
										onChange={(e) => setActiveModuleCategory(e.target.value)}
									>
										<option value="All">All Categories</option>
										{Array.from(
											new Set(modules.map((module) => module.category))
										).map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>
								</div>
								<div className="flex-1 min-w-[200px]">
									<label className="block text-sm font-medium mb-1 opacity-70">
										Level
									</label>
									<select
										className={`w-full ${themeClasses.input} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
										value={activeModuleLevel}
										onChange={(e) => setActiveModuleLevel(e.target.value)}
									>
										<option value="All">All Levels</option>
										<option value="Beginner">Beginner</option>
										<option value="Intermediate">Intermediate</option>
										<option value="Advanced">Advanced</option>
									</select>
								</div>
								<div className="flex-1 min-w-[200px]">
									<label className="block text-sm font-medium mb-1 opacity-70">
										Sort By
									</label>
									<select
										className={`w-full ${themeClasses.input} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
									>
										<option value="popular">Most Popular</option>
										<option value="newest">Newest</option>
										<option value="rating">Highest Rated</option>
										<option value="duration-asc">
											Duration (Shortest First)
										</option>
										<option value="duration-desc">
											Duration (Longest First)
										</option>
									</select>
								</div>
							</div>
						</div>

						{/* Module Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredModules.map((module) => (
								<div
									key={module.id}
									className={`${themeClasses.card} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group`}
								>
									<div className="h-48 overflow-hidden relative">
										<img
											src={module.image}
											alt={module.title}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
										<div className="absolute bottom-3 left-3 right-3">
											<h3 className="text-white font-bold mb-1">
												{module.title}
											</h3>
											<div className="flex items-center space-x-2 text-white/90 text-sm">
												<span>{module.category}</span>
												<span>•</span>
												<span>{module.level}</span>
											</div>
										</div>
										<div className="absolute top-3 right-3 flex space-x-2">
											<span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
												<Clock size={12} className="mr-1" />
												{module.duration}
											</span>
										</div>
									</div>
									<div className="p-4">
										<p className="text-sm mb-4 line-clamp-2 opacity-80">
											{module.description}
										</p>
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center space-x-2">
												<div className="flex items-center space-x-1">
													<Star
														size={16}
														className="text-yellow-500 fill-current"
													/>
													<span className="font-medium">{module.ratings}</span>
												</div>
												<span className="text-xs opacity-70">
													({module.enrolled} enrolled)
												</span>
											</div>
											<button
												className="flex items-center space-x-1 text-sm"
												onClick={() => handleToggleLike(module.id)}
											>
												<Heart
													size={16}
													className={
														likedModules.includes(module.id)
															? "text-red-500 fill-current"
															: "text-gray-400"
													}
												/>
											</button>
										</div>
										<div className="flex flex-wrap gap-2">
											{user.enrolledModules.includes(module.id) ? (
												<button
													onClick={() => {
														setActiveModule(module);
														setActiveSection("moduleDetail");
													}}
													className={`flex-1 ${themeClasses.button} px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2`}
												>
													<Play size={18} />
													<span>Continue</span>
												</button>
											) : (
												<button
													onClick={() => handleEnrollModule(module.id)}
													className={`flex-1 ${themeClasses.buttonSecondary} px-4 py-2 rounded-lg font-medium`}
												>
													Enroll
												</button>
											)}
											<button
												onClick={() => {
													setActiveModule(module);
													setActiveSection("moduleDetail");
												}}
												className={`flex-1 ${themeClasses.button} px-4 py-2 rounded-lg font-medium`}
											>
												View Details
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* No modules found */}
						{filteredModules.length === 0 && (
							<div
								className={`${themeClasses.card} rounded-xl p-8 text-center`}
							>
								<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
									<Book size={24} className="text-blue-600" />
								</div>
								<h3 className="text-lg font-semibold mb-2">No modules found</h3>
								<p className="text-sm opacity-70 mb-4">
									Try changing your filter criteria.
								</p>
								<button
									onClick={() => {
										setActiveModuleCategory("All");
										setActiveModuleLevel("All");
									}}
									className={`${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium`}
								>
									Reset Filters
								</button>
							</div>
						)}
					</div>
				)}

				{/* Module Detail Section */}
				{activeSection === "moduleDetail" && activeModule && (
					<div className="container mx-auto px-4 py-6">
						{/* Module Header */}
						<div
							className={`${themeClasses.card} rounded-xl overflow-hidden mb-6`}
						>
							<div className="h-48 sm:h-64 relative">
								<img
									src={activeModule.image}
									alt={activeModule.title}
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
								<button
									className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
									onClick={() => setActiveSection("modules")}
								>
									<ArrowRight size={20} className="transform rotate-180" />
								</button>
								<div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
									<div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
										<span>{activeModule.category}</span>
										<span>•</span>
										<span>{activeModule.level}</span>
										<span>•</span>
										<span className="flex items-center">
											<Clock size={14} className="mr-1" />
											{activeModule.duration}
										</span>
									</div>
									<h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
										{activeModule.title}
									</h1>
									<div className="flex flex-wrap items-center gap-y-2">
										<div className="flex items-center space-x-3 text-white/90 pr-4">
											<div className="flex items-center">
												<Star
													size={18}
													className="text-yellow-500 fill-current mr-1"
												/>
												<span className="font-medium">
													{activeModule.ratings}
												</span>
											</div>
											<span>•</span>
											<span>{activeModule.enrolled} enrolled</span>
										</div>
										<div className="flex items-center space-x-2">
											<button
												className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 hover:bg-white/30 transition-colors"
												onClick={() => handleToggleLike(activeModule.id)}
											>
												<Heart
													size={16}
													className={
														likedModules.includes(activeModule.id)
															? "text-red-500 fill-current"
															: ""
													}
												/>
												<span>
													{likedModules.includes(activeModule.id)
														? "Liked"
														: "Like"}
												</span>
											</button>
											<button className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 hover:bg-white/30 transition-colors">
												<Share2 size={16} />
												<span>Share</span>
											</button>
										</div>
									</div>
								</div>
							</div>

							<div className="p-6">
								<div className="flex flex-wrap justify-between gap-6 mb-6">
									<div className="flex-1 min-w-[300px]">
										<h2 className="text-xl font-bold mb-3">
											About This Module
										</h2>
										<p className="text-sm opacity-80 mb-4">
											{activeModule.description}
										</p>
										<div className="flex items-center space-x-3 mb-2">
											<div className="flex items-center space-x-2">
												<User size={16} className="opacity-70" />
												<span className="text-sm font-medium">Instructor:</span>
											</div>
											<span className="text-sm">{activeModule.instructor}</span>
										</div>

										{/* Module Progress */}
										{user.enrolledModules.includes(activeModule.id) && (
											<div className="mt-4">
												<div className="flex items-center justify-between mb-1">
													<span className="text-sm font-medium">
														Your Progress
													</span>
													<span className="text-sm">
														{activeModule.progress}%
													</span>
												</div>
												<div className="w-full h-2.5 bg-gray-200/50 rounded-full overflow-hidden">
													<div
														className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
														style={{ width: `${activeModule.progress}%` }}
													></div>
												</div>
											</div>
										)}
									</div>

									<div className="sm:max-w-[250px] w-full">
										<div
											className={`${themeClasses.card} rounded-xl p-4 border-2 border-blue-500/20`}
										>
											<h3 className="font-bold text-lg mb-3 text-center">
												Module Highlights
											</h3>
											<div className="space-y-3 mb-4">
												<div className="flex items-start space-x-3">
													<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
														<Book size={16} className="text-blue-600" />
													</div>
													<div>
														<p className="font-medium text-sm">
															{activeModule.lessons.length} Lessons
														</p>
														<p className="text-xs opacity-70">
															Comprehensive curriculum
														</p>
													</div>
												</div>
												<div className="flex items-start space-x-3">
													<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
														<Award size={16} className="text-green-600" />
													</div>
													<div>
														<p className="font-medium text-sm">Certificate</p>
														<p className="text-xs opacity-70">
															Upon completion
														</p>
													</div>
												</div>
												<div className="flex items-start space-x-3">
													<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
														<MessageSquare
															size={16}
															className="text-purple-600"
														/>
													</div>
													<div>
														<p className="font-medium text-sm">Support</p>
														<p className="text-xs opacity-70">
															Instructor assistance
														</p>
													</div>
												</div>
											</div>

											{user.enrolledModules.includes(activeModule.id) ? (
												<button
													className={`w-full ${themeClasses.button} px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2`}
													onClick={() => {
														// Get next incomplete lesson
														const nextLesson = activeModule.lessons.find(
															(l) => !l.completed
														);
														if (nextLesson) {
															// Simulate starting the lesson by marking it complete
															handleCompleteLesson(
																activeModule.id,
																nextLesson.id
															);
														}
													}}
												>
													<Play size={18} />
													<span>Continue Learning</span>
												</button>
											) : (
												<button
													className={`w-full ${themeClasses.button} px-4 py-3 rounded-lg font-medium`}
													onClick={() => handleEnrollModule(activeModule.id)}
												>
													Enroll Now
												</button>
											)}
										</div>
									</div>
								</div>

								{/* Module Content */}
								<div className="mb-6">
									<h2 className="text-xl font-bold mb-4">Module Content</h2>
									<div
										className={`${themeClasses.card} rounded-xl overflow-hidden border border-gray-200/20`}
									>
										{activeModule.lessons.map((lesson, index) => (
											<div
												key={lesson.id}
												className={`p-4 ${
													index !== activeModule.lessons.length - 1
														? "border-b border-gray-200/20"
														: ""
												}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-3">
														<div
															className={`w-8 h-8 rounded-full flex items-center justify-center ${
																lesson.completed
																	? "bg-green-100"
																	: "bg-gray-100"
															}`}
														>
															{lesson.completed ? (
																<CheckCircle
																	size={16}
																	className="text-green-600"
																/>
															) : (
																<span className="text-sm font-medium">
																	{index + 1}
																</span>
															)}
														</div>
														<div>
															<h3 className="font-medium">{lesson.title}</h3>
															<p className="text-xs opacity-70">
																{lesson.duration}
															</p>
														</div>
													</div>

													{user.enrolledModules.includes(activeModule.id) &&
														(lesson.completed ? (
															<button
																className="text-sm text-green-600 font-medium flex items-center space-x-1"
																onClick={() =>
																	handleCompleteLesson(
																		activeModule.id,
																		lesson.id
																	)
																}
															>
																<CheckCircle size={16} />
																<span>Completed</span>
															</button>
														) : (
															<button
																className={`${themeClasses.button} px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1`}
																onClick={() =>
																	handleCompleteLesson(
																		activeModule.id,
																		lesson.id
																	)
																}
															>
																<Play size={14} />
																<span>Start</span>
															</button>
														))}
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Quiz Section */}
								{activeModule.quiz &&
									user.enrolledModules.includes(activeModule.id) && (
										<div>
											<h2 className="text-xl font-bold mb-4">Module Quiz</h2>
											<div
												className={`${themeClasses.card} rounded-xl p-6 border border-blue-500/20`}
											>
												<div className="flex items-center justify-between mb-4">
													<h3 className="font-bold text-lg">
														{activeModule.quiz.title}
													</h3>
													<div className="flex items-center space-x-1 text-sm opacity-70">
														<span>
															{activeModule.quiz.questions.length} questions
														</span>
														<span>•</span>
														<span>10 minutes</span>
													</div>
												</div>

												{quizCompleted ? (
													<div className="text-center py-4">
														<div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center relative">
															<svg
																className="w-full h-full"
																viewBox="0 0 100 100"
															>
																<circle
																	className="text-gray-200 stroke-current"
																	strokeWidth="10"
																	cx="50"
																	cy="50"
																	r="40"
																	fill="none"
																></circle>
																<circle
																	className="text-blue-600 progress-ring stroke-current"
																	strokeWidth="10"
																	strokeLinecap="round"
																	cx="50"
																	cy="50"
																	r="40"
																	fill="none"
																	strokeDasharray="251.2"
																	strokeDashoffset={
																		251.2 - (251.2 * quizScore) / 100
																	}
																></circle>
															</svg>
															<div className="absolute inset-0 flex items-center justify-center">
																<span className="text-2xl font-bold">
																	{quizScore}%
																</span>
															</div>
														</div>

														<h3 className="text-xl font-bold mb-2">
															{quizScore >= 70
																? "Congratulations!"
																: "Keep Learning!"}
														</h3>
														<p className="text-sm opacity-80 mb-4">
															{quizScore >= 70
																? "You have successfully passed the quiz."
																: "You did not pass the quiz. Review the material and try again."}
														</p>

														<div className="flex flex-wrap justify-center gap-3">
															<button
																className={`${themeClasses.buttonSecondary} px-4 py-2 rounded-lg text-sm font-medium`}
																onClick={() => {
																	setQuizCompleted(false);
																	setSelectedAnswers({});
																	setCurrentQuestionIndex(0);
																}}
															>
																Try Again
															</button>
															<button
																className={`${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium`}
																onClick={() => {
																	// Go back to module detail view
																	setQuizCompleted(false);
																	setSelectedAnswers({});
																	setCurrentQuestionIndex(0);
																	setActiveQuiz(null);
																}}
															>
																Back to Module
															</button>
														</div>
													</div>
												) : activeQuiz ? (
													<div>
														{/* Question Navigation */}
														<div className="flex items-center space-x-2 mb-4 overflow-x-auto py-2">
															{activeQuiz.questions.map((question, index) => (
																<button
																	key={question.id}
																	className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
																		currentQuestionIndex === index
																			? "bg-blue-600 text-white"
																			: selectedAnswers[question.id] !==
																			  undefined
																			? "bg-blue-100 text-blue-600"
																			: "bg-gray-100 text-gray-800"
																	}`}
																	onClick={() => setCurrentQuestionIndex(index)}
																>
																	{index + 1}
																</button>
															))}
														</div>

														{/* Current Question */}
														<div className="mb-6">
															<h4 className="font-medium mb-4">
																{currentQuestionIndex + 1}.{" "}
																{
																	activeQuiz.questions[currentQuestionIndex]
																		.text
																}
															</h4>

															<div className="space-y-3">
																{activeQuiz.questions[
																	currentQuestionIndex
																].options.map((option, optIndex) => (
																	<button
																		key={optIndex}
																		className={`w-full text-left p-3 rounded-lg border transition-colors ${
																			selectedAnswers[
																				activeQuiz.questions[
																					currentQuestionIndex
																				].id
																			] === optIndex
																				? "border-blue-500 bg-blue-50 text-blue-700"
																				: "border-gray-200 hover:border-blue-300"
																		}`}
																		onClick={() =>
																			handleSelectAnswer(
																				activeQuiz.questions[
																					currentQuestionIndex
																				].id,
																				optIndex
																			)
																		}
																	>
																		<div className="flex items-center space-x-3">
																			<div
																				className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center ${
																					selectedAnswers[
																						activeQuiz.questions[
																							currentQuestionIndex
																						].id
																					] === optIndex
																						? "border-blue-500 bg-blue-500 text-white"
																						: "border-gray-300"
																				}`}
																			>
																				{selectedAnswers[
																					activeQuiz.questions[
																						currentQuestionIndex
																					].id
																				] === optIndex && (
																					<CheckCircle size={14} />
																				)}
																			</div>
																			<span>{option}</span>
																		</div>
																	</button>
																))}
															</div>
														</div>

														{/* Navigation Buttons */}
														<div className="flex justify-between">
															<button
																className={`${themeClasses.buttonSecondary} px-4 py-2 rounded-lg text-sm font-medium`}
																disabled={currentQuestionIndex === 0}
																onClick={() =>
																	setCurrentQuestionIndex((prev) =>
																		Math.max(0, prev - 1)
																	)
																}
															>
																Previous
															</button>

															{currentQuestionIndex <
															activeQuiz.questions.length - 1 ? (
																<button
																	className={`${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium`}
																	onClick={() =>
																		setCurrentQuestionIndex((prev) =>
																			Math.min(
																				activeQuiz.questions.length - 1,
																				prev + 1
																			)
																		)
																	}
																>
																	Next
																</button>
															) : (
																<button
																	className={`${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium`}
																	onClick={handleSubmitQuiz}
																	disabled={activeQuiz.questions.some(
																		(q) => selectedAnswers[q.id] === undefined
																	)}
																>
																	Submit Quiz
																</button>
															)}
														</div>
													</div>
												) : (
													<div className="text-center py-8">
														<Award
															size={48}
															className="mx-auto mb-4 text-blue-600"
														/>
														<h3 className="text-xl font-bold mb-2">
															Test Your Knowledge
														</h3>
														<p className="text-sm opacity-80 mb-6 max-w-md mx-auto">
															Complete this quiz to test your understanding of
															the module content and earn your certificate.
														</p>
														<button
															className={`${themeClasses.button} px-6 py-3 rounded-lg font-medium`}
															onClick={() => {
																setActiveQuiz(activeModule.quiz);
																setCurrentQuestionIndex(0);
																setSelectedAnswers({});
																setQuizCompleted(false);
															}}
														>
															Start Quiz
														</button>
													</div>
												)}
											</div>
										</div>
									)}
							</div>
						</div>
					</div>
				)}

				{/* Resources Section */}
				{activeSection === "resources" && (
					<div className="container mx-auto px-4 py-8">
						<h1 className="text-2xl font-bold mb-6">Learning Resources</h1>

						{/* Resource Filters */}
						<div className={`${themeClasses.card} rounded-xl p-4 mb-6`}>
							<div className="flex items-center space-x-2 overflow-x-auto py-1 hide-scrollbar">
								<button
									className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
										activeResourceType === "All"
											? "bg-blue-600 text-white"
											: "bg-gray-200/50 hover:bg-gray-200"
									}`}
									onClick={() => setActiveResourceType("All")}
								>
									All Resources
								</button>
								{Array.from(
									new Set(resources.map((resource) => resource.type))
								).map((type) => (
									<button
										key={type}
										className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
											activeResourceType === type
												? "bg-blue-600 text-white"
												: "bg-gray-200/50 hover:bg-gray-200"
										}`}
										onClick={() => setActiveResourceType(type)}
									>
										{type}s
									</button>
								))}
								{Array.from(
									new Set(resources.map((resource) => resource.category))
								).map((category) => (
									<button
										key={category}
										className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
											activeResourceType === category
												? "bg-blue-600 text-white"
												: "bg-gray-200/50 hover:bg-gray-200"
										}`}
										onClick={() => setActiveResourceType(category)}
									>
										{category}
									</button>
								))}
							</div>
						</div>

						{/* Resource List */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{resources
								.filter(
									(resource) =>
										activeResourceType === "All" ||
										resource.type === activeResourceType ||
										resource.category === activeResourceType
								)
								.map((resource) => (
									<div
										key={resource.id}
										className={`${
											themeClasses.card
										} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${
											showResourceDetail === resource.id
												? "ring-2 ring-blue-500"
												: ""
										}`}
									>
										<div className="h-40 overflow-hidden relative">
											<img
												src={resource.image}
												alt={resource.title}
												className="w-full h-full object-cover"
											/>
											<div className="absolute top-0 left-0 right-0 p-3 flex justify-between">
												<span
													className={`text-xs font-medium px-2 py-1 rounded-full ${
														resource.type === "PDF"
															? "bg-red-500/90 text-white"
															: resource.type === "Video"
															? "bg-blue-500/90 text-white"
															: resource.type === "Article"
															? "bg-green-500/90 text-white"
															: "bg-purple-500/90 text-white"
													}`}
												>
													{resource.type}
												</span>
												<button
													className="bg-white/90 text-gray-800 p-1.5 rounded-full hover:bg-white transition-colors"
													onClick={(e) => {
														e.stopPropagation();
														handleToggleBookmark(resource.id);
													}}
												>
													<Bookmark
														size={16}
														className={
															bookmarkedResources.includes(resource.id)
																? "text-yellow-500 fill-current"
																: ""
														}
													/>
												</button>
											</div>
										</div>

										<div className="p-4">
											<h3 className="font-semibold mb-1 line-clamp-1">
												{resource.title}
											</h3>
											<p className="text-xs opacity-70 mb-2">
												{resource.category}
											</p>

											{showResourceDetail === resource.id ? (
												<div className="animate-fadeIn">
													<p className="text-sm mb-4 opacity-80">
														{resource.description}
													</p>
													<div className="flex justify-between items-center mb-2">
														<div className="flex items-center text-xs opacity-70">
															<Download size={12} className="mr-1" />
															<span>
																{resource.downloads.toLocaleString()} downloads
															</span>
														</div>
														<button
															className="text-xs text-blue-600"
															onClick={() => setShowResourceDetail(null)}
														>
															Show less
														</button>
													</div>
													<div className="flex flex-wrap gap-2">
														<button
															className={`flex-1 ${
																themeClasses.button
															} px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 ${
																downloadingResource === resource.id
																	? "opacity-70 cursor-not-allowed"
																	: ""
															}`}
															disabled={downloadingResource === resource.id}
															onClick={() =>
																handleDownloadResource(resource.id)
															}
														>
															{downloadingResource === resource.id ? (
																<>
																	<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
																	<span>Downloading...</span>
																</>
															) : (
																<>
																	<Download size={18} />
																	<span>Download</span>
																</>
															)}
														</button>
														<button
															className={`${themeClasses.buttonSecondary} px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2`}
														>
															<Share2 size={18} />
															<span>Share</span>
														</button>
													</div>
												</div>
											) : (
												<div>
													<p className="text-sm mb-4 opacity-80 line-clamp-2">
														{resource.description}
													</p>
													<div className="flex justify-between">
														<div className="flex items-center text-xs opacity-70">
															<Download size={12} className="mr-1" />
															<span>
																{resource.downloads.toLocaleString()} downloads
															</span>
														</div>
														<button
															className="text-xs text-blue-600"
															onClick={() => setShowResourceDetail(resource.id)}
														>
															Show more
														</button>
													</div>
												</div>
											)}
										</div>
									</div>
								))}
						</div>

						{/* No resources found */}
						{resources.filter(
							(resource) =>
								activeResourceType === "All" ||
								resource.type === activeResourceType ||
								resource.category === activeResourceType
						).length === 0 && (
							<div
								className={`${themeClasses.card} rounded-xl p-8 text-center`}
							>
								<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
									<Database size={24} className="text-blue-600" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									No resources found
								</h3>
								<p className="text-sm opacity-70 mb-4">
									Try selecting a different category or type.
								</p>
								<button
									onClick={() => setActiveResourceType("All")}
									className={`${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium`}
								>
									View All Resources
								</button>
							</div>
						)}
					</div>
				)}

				{/* User Profile Section */}
				{activeSection === "profile" && (
					<div className="container mx-auto px-4 py-8">
						{/* Profile Header */}
						<div
							className={`${themeClasses.card} rounded-xl overflow-hidden mb-6`}
						>
							<div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
								{/* Edit Profile Button */}
								{!editingProfile && (
									<button
										className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg text-sm font-medium flex items-center space-x-1 hover:bg-white/30 transition-colors"
										onClick={() => {
											setEditingProfile(true);
											setEditedUser({ ...user });
										}}
									>
										<Edit3 size={16} />
										<span>Edit Profile</span>
									</button>
								)}

								{/* Profile Avatar */}
								<div className="absolute -bottom-16 left-6 sm:left-8">
									<div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
										<img
											src={user.avatar}
											alt="Profile"
											className="w-full h-full object-cover"
										/>
									</div>
								</div>
							</div>

							<div className="pt-20 pb-6 px-6 sm:px-8">
								{editingProfile ? (
									<div className="animate-fadeIn">
										<h2 className="text-xl font-bold mb-4">Edit Profile</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
											<div>
												<label className="block text-sm font-medium mb-1 opacity-70">
													Full Name
												</label>
												<input
													type="text"
													className={`w-full ${themeClasses.input} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
													value={editedUser.name}
													onChange={(e) =>
														setEditedUser({
															...editedUser,
															name: e.target.value,
														})
													}
												/>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1 opacity-70">
													Email
												</label>
												<input
													type="email"
													className={`w-full ${themeClasses.input} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
													value={editedUser.email}
													onChange={(e) =>
														setEditedUser({
															...editedUser,
															email: e.target.value,
														})
													}
												/>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1 opacity-70">
													Role/Title
												</label>
												<input
													type="text"
													className={`w-full ${themeClasses.input} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
													value={editedUser.role}
													onChange={(e) =>
														setEditedUser({
															...editedUser,
															role: e.target.value,
														})
													}
												/>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1 opacity-70">
													Interests
												</label>
												<div className="flex flex-wrap gap-2">
													{Array.from(
														new Set(modules.map((module) => module.category))
													).map((category) => (
														<button
															key={category}
															className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
																editedUser.interests.includes(category)
																	? "bg-blue-600 text-white"
																	: "bg-gray-200/50 hover:bg-gray-200"
															}`}
															onClick={() => {
																if (editedUser.interests.includes(category)) {
																	setEditedUser({
																		...editedUser,
																		interests: editedUser.interests.filter(
																			(i) => i !== category
																		),
																	});
																} else {
																	setEditedUser({
																		...editedUser,
																		interests: [
																			...editedUser.interests,
																			category,
																		],
																	});
																}
															}}
														>
															{category}
														</button>
													))}
												</div>
											</div>
										</div>
										<div className="flex flex-wrap gap-3">
											<button
												className={`${themeClasses.button} px-4 py-2 rounded-lg font-medium`}
												onClick={handleUpdateProfile}
											>
												Save Changes
											</button>
											<button
												className={`${themeClasses.buttonSecondary} px-4 py-2 rounded-lg font-medium`}
												onClick={() => setEditingProfile(false)}
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<div>
										<div className="flex flex-wrap items-center gap-y-2 mb-4">
											<div className="flex-1">
												<h1 className="text-2xl font-bold">{user.name}</h1>
												<p className="opacity-70">{user.role}</p>
											</div>
											<div className="flex items-center space-x-1 text-sm opacity-70">
												<Calendar size={16} className="mr-1" />
												<span>Joined {user.joined}</span>
											</div>
										</div>
										<div className="flex flex-wrap gap-2 mb-4">
											{user.interests.map((interest) => (
												<span
													key={interest}
													className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
												>
													{interest}
												</span>
											))}
										</div>
										<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
											<div
												className={`${themeClasses.card} rounded-lg p-3 text-center`}
											>
												<p className="text-sm font-medium opacity-70">Level</p>
												<p className="text-xl font-bold">{user.level}</p>
											</div>
											<div
												className={`${themeClasses.card} rounded-lg p-3 text-center`}
											>
												<p className="text-sm font-medium opacity-70">Points</p>
												<p className="text-xl font-bold">{user.totalPoints}</p>
											</div>
											<div
												className={`${themeClasses.card} rounded-lg p-3 text-center`}
											>
												<p className="text-sm font-medium opacity-70">
													Modules
												</p>
												<p className="text-xl font-bold">
													{user.enrolledModules.length}
												</p>
											</div>
											<div
												className={`${themeClasses.card} rounded-lg p-3 text-center`}
											>
												<p className="text-sm font-medium opacity-70">Streak</p>
												<div className="flex items-center justify-center">
													<p className="text-xl font-bold mr-1">
														{user.streak}
													</p>
													<span className="text-yellow-500">🔥</span>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Profile Content Tabs */}
						{!editingProfile && (
							<div className="mb-6">
								<div className="flex items-center space-x-1 overflow-x-auto hide-scrollbar border-b border-gray-200/20 mb-6">
									<button className="px-4 py-3 font-medium border-b-2 border-blue-600 text-blue-600">
										My Learning
									</button>
									<button className="px-4 py-3 font-medium border-b-2 border-transparent hover:text-blue-600">
										Achievements
									</button>
									<button className="px-4 py-3 font-medium border-b-2 border-transparent hover:text-blue-600">
										Bookmarks
									</button>
									<button className="px-4 py-3 font-medium border-b-2 border-transparent hover:text-blue-600">
										Settings
									</button>
								</div>

								{/* My Learning Content */}
								<div>
									<h2 className="text-xl font-bold mb-4">My Modules</h2>

									{/* Progress Overview */}
									<div className={`${themeClasses.card} rounded-xl p-5 mb-6`}>
										<div className="flex flex-wrap justify-between items-center gap-4 mb-4">
											<h3 className="text-lg font-bold">Learning Progress</h3>
											<div className="flex items-center space-x-3">
												<div className="flex items-center space-x-1">
													<div className="w-3 h-3 rounded-full bg-blue-600"></div>
													<span className="text-sm opacity-70">
														In Progress
													</span>
												</div>
												<div className="flex items-center space-x-1">
													<div className="w-3 h-3 rounded-full bg-green-600"></div>
													<span className="text-sm opacity-70">Completed</span>
												</div>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<div className="mb-4">
													<div className="flex justify-between items-center mb-1">
														<span className="font-medium text-sm">
															Overall Completion
														</span>
														<span className="text-sm">
															{user.enrolledModules.length > 0
																? Math.round(
																		(user.completedModules.length /
																			user.enrolledModules.length) *
																			100
																  )
																: 0}
															%
														</span>
													</div>
													<div className="w-full h-3 bg-gray-200/50 rounded-full overflow-hidden">
														<div
															className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
															style={{
																width: `${
																	user.enrolledModules.length > 0
																		? Math.round(
																				(user.completedModules.length /
																					user.enrolledModules.length) *
																					100
																		  )
																		: 0
																}%`,
															}}
														></div>
													</div>
												</div>

												<div className="flex flex-col space-y-2">
													{modules
														.filter((module) =>
															user.enrolledModules.includes(module.id)
														)
														.slice(0, 3)
														.map((module) => (
															<div
																key={module.id}
																className="flex items-center"
															>
																<div className="w-8 flex-shrink-0">
																	{module.completed ? (
																		<CheckCircle
																			size={18}
																			className="text-green-600"
																		/>
																	) : (
																		<div className="w-4 h-4 rounded-full bg-blue-600"></div>
																	)}
																</div>
																<div className="flex-1">
																	<div className="flex justify-between items-center mb-1">
																		<p className="text-sm font-medium">
																			{module.title}
																		</p>
																		<p className="text-xs opacity-70">
																			{module.progress}%
																		</p>
																	</div>
																	<div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
																		<div
																			className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
																			style={{ width: `${module.progress}%` }}
																		></div>
																	</div>
																</div>
															</div>
														))}

													{user.enrolledModules.length > 3 && (
														<button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
															View all modules ({user.enrolledModules.length})
														</button>
													)}

													{user.enrolledModules.length === 0 && (
														<div className="text-center py-4">
															<p className="text-sm opacity-70 mb-2">
																You haven't enrolled in any modules yet.
															</p>
															<button
																onClick={() => setActiveSection("modules")}
																className={`${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium`}
															>
																Browse Modules
															</button>
														</div>
													)}
												</div>
											</div>

											<div>
												<div className="relative">
													<div className="mb-2 flex justify-between">
														<span className="font-medium text-sm">
															Category Distribution
														</span>
													</div>
													{user.enrolledModules.length > 0 ? (
														<div className="flex h-40 items-center">
															<div className="relative w-40 h-40 mx-auto">
																<svg
																	className="w-full h-full"
																	viewBox="0 0 100 100"
																>
																	{/* Example pie chart segments - these would be dynamically generated */}
																	<circle
																		className="text-gray-200 stroke-current"
																		strokeWidth="10"
																		cx="50"
																		cy="50"
																		r="40"
																		fill="none"
																	></circle>

																	{/* Programming segment (40%) */}
																	<circle
																		className="text-blue-600 stroke-current"
																		strokeWidth="10"
																		strokeDasharray="251.2"
																		strokeDashoffset="150.72" // 251.2 * 0.6
																		transform="rotate(-90 50 50)"
																		cx="50"
																		cy="50"
																		r="40"
																		fill="none"
																	></circle>

																	{/* Data Science segment (25%) */}
																	<circle
																		className="text-green-500 stroke-current"
																		strokeWidth="10"
																		strokeDasharray="251.2"
																		strokeDashoffset="188.4" // 251.2 * 0.75
																		transform="rotate(-90 50 50)"
																		cx="50"
																		cy="50"
																		r="40"
																		fill="none"
																		strokeDashoffset="25"
																	></circle>

																	{/* Business segment (20%) */}
																	<circle
																		className="text-yellow-500 stroke-current"
																		strokeWidth="10"
																		strokeDasharray="251.2"
																		strokeDashoffset="200.96" // 251.2 * 0.8
																		transform="rotate(0 50 50)"
																		cx="50"
																		cy="50"
																		r="40"
																		fill="none"
																		strokeDashoffset="50"
																	></circle>
																</svg>
																<div className="absolute inset-0 flex items-center justify-center">
																	<div className="text-center">
																		<p className="text-lg font-bold">
																			{user.enrolledModules.length}
																		</p>
																		<p className="text-xs opacity-70">
																			Modules
																		</p>
																	</div>
																</div>
															</div>

															<div className="flex flex-col space-y-2">
																<div className="flex items-center space-x-2">
																	<div className="w-3 h-3 rounded-full bg-blue-600"></div>
																	<span className="text-sm">Programming</span>
																</div>
																<div className="flex items-center space-x-2">
																	<div className="w-3 h-3 rounded-full bg-green-500"></div>
																	<span className="text-sm">Data Science</span>
																</div>
																<div className="flex items-center space-x-2">
																	<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
																	<span className="text-sm">Business</span>
																</div>
																<div className="flex items-center space-x-2">
																	<div className="w-3 h-3 rounded-full bg-purple-500"></div>
																	<span className="text-sm">Design</span>
																</div>
															</div>
														</div>
													) : (
														<div className="h-40 flex items-center justify-center">
															<p className="text-sm opacity-70">
																No data available
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>

									{/* Enrolled Modules */}
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{modules
											.filter((module) =>
												user.enrolledModules.includes(module.id)
											)
											.map((module) => (
												<div
													key={module.id}
													className={`${themeClasses.card} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group`}
												>
													<div className="h-32 overflow-hidden relative">
														<img
															src={module.image}
															alt={module.title}
															className="w-full h-full object-cover"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
														<div className="absolute bottom-3 left-3 right-3">
															<h3 className="text-white font-bold line-clamp-1">
																{module.title}
															</h3>
															<div className="flex items-center space-x-2 text-white/80 text-xs">
																<span>{module.category}</span>
																<span>•</span>
																<span>{module.level}</span>
															</div>
														</div>
													</div>

													<div className="p-3">
														<div className="mb-2">
															<div className="flex items-center justify-between mb-1">
																<span className="text-xs opacity-70">
																	{module.progress}% complete
																</span>
																<span className="text-xs opacity-70">
																	{
																		module.lessons.filter((l) => l.completed)
																			.length
																	}
																	/{module.lessons.length} lessons
																</span>
															</div>
															<div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
																<div
																	className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
																	style={{ width: `${module.progress}%` }}
																></div>
															</div>
														</div>

														<div className="flex justify-between">
															<button
																className={`${themeClasses.button} px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1`}
																onClick={() => {
																	setActiveModule(module);
																	setActiveSection("moduleDetail");
																}}
															>
																<Play size={14} />
																<span>Continue</span>
															</button>

															<button
																className={`${themeClasses.buttonSecondary} px-2 py-1.5 rounded-lg text-xs font-medium`}
																onClick={() => {
																	if (activeModule?.quiz) {
																		setActiveModule(module);
																		setActiveSection("moduleDetail");
																		setActiveQuiz(module.quiz);
																	}
																}}
															>
																Quiz
															</button>
														</div>
													</div>
												</div>
											))}
									</div>

									{/* Achievements Section */}
									<h2 className="text-xl font-bold mt-8 mb-4">Achievements</h2>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
										{user.achievements.map((achievement) => (
											<div
												key={achievement.id}
												className={`${
													themeClasses.card
												} rounded-xl p-4 text-center ${
													achievement.completed
														? "border border-yellow-500/50"
														: ""
												}`}
											>
												<div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl">
													{achievement.icon}
												</div>
												<h3 className="font-bold mb-1">{achievement.title}</h3>
												<p className="text-xs opacity-70 mb-2">
													{achievement.description}
												</p>

												{achievement.completed ? (
													<div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
														<CheckCircle size={12} className="mr-1" />
														<span>Completed</span>
													</div>
												) : (
													<div>
														<div className="flex items-center justify-between mb-1">
															<span className="text-xs opacity-70">
																{achievement.progress}/{achievement.total}
															</span>
															<span className="text-xs opacity-70">
																{Math.round(
																	(achievement.progress / achievement.total) *
																		100
																)}
																%
															</span>
														</div>
														<div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
															<div
																className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"
																style={{
																	width: `${
																		(achievement.progress / achievement.total) *
																		100
																	}%`,
																}}
															></div>
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</main>

			{/* Mobile Bottom Navigation */}
			<nav
				className={`fixed bottom-0 left-0 right-0 ${themeClasses.nav} border-t md:hidden z-40`}
			>
				<div className="flex items-center justify-around">
					<button
						onClick={() => setActiveSection("home")}
						className={`flex flex-col items-center py-2 px-4 ${
							activeSection === "home" ? "text-blue-600" : ""
						}`}
					>
						<Home size={20} />
						<span className="text-xs mt-1">Home</span>
					</button>
					<button
						onClick={() => setActiveSection("modules")}
						className={`flex flex-col items-center py-2 px-4 ${
							activeSection === "modules" || activeSection === "moduleDetail"
								? "text-blue-600"
								: ""
						}`}
					>
						<Book size={20} />
						<span className="text-xs mt-1">Modules</span>
					</button>
					<button
						onClick={() => setActiveSection("resources")}
						className={`flex flex-col items-center py-2 px-4 ${
							activeSection === "resources" ? "text-blue-600" : ""
						}`}
					>
						<Database size={20} />
						<span className="text-xs mt-1">Resources</span>
					</button>
					<button
						onClick={() => setActiveSection("profile")}
						className={`flex flex-col items-center py-2 px-4 ${
							activeSection === "profile" ? "text-blue-600" : ""
						}`}
					>
						<User size={20} />
						<span className="text-xs mt-1">Profile</span>
					</button>
				</div>
			</nav>

			{/* Back to top button */}
			<button
				className={`fixed bottom-20 right-4 p-3 rounded-full bg-blue-600 text-white shadow-lg md:hidden opacity-80 transition-opacity z-40`}
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			>
				<ArrowUp size={20} />
			</button>

			{/* Global Styles */}
			<style jsx global>{`
				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.hide-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-in-out;
				}
				.hover:scale-102:hover {
					transform: scale(1.02);
				}
				.progress-ring {
					transition: stroke-dashoffset 0.5s ease-in-out;
				}
				.line-clamp-1 {
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}
				.line-clamp-2 {
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}
			`}</style>
		</div>
	);
};

export default LearningPortal;
