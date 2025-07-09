"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
	FiHome,
	FiClock,
	FiSettings,
	FiUser,
	FiBook,
	FiCheckCircle,
	FiXCircle,
	FiMenu,
	FiX,
	FiChevronLeft,
	FiChevronRight,
	FiAward,
	FiTrendingUp,
	FiGlobe,
	FiHelpCircle,
	FiAlertTriangle,
	FiRefreshCw,
	FiCheck,
	FiGrid,
	FiPause,
	FiPlay,
	FiShare2,
	FiStar,
	FiHeadphones,
	FiGift,
	FiLogOut,
	FiTwitter,
	FiInstagram,
	FiLinkedin,
	FiYoutube,
	FiMail,
	FiMessageSquare,
	FiHeart,
	FiLink,
	FiArrowDown,
} from "react-icons/fi";

type VocabularyItem = {
	id: string;
	foreignWord: string;
	translation: string;
	pronunciation?: string;
	example?: string;
};

type Category = {
	id: string;
	name: string;
	description: string;
	level: "beginner" | "intermediate" | "advanced";
	language: string;
	icon: JSX.Element;
	items: VocabularyItem[];
};

type UserProgress = {
	attempts: number;
	correctMatches: number;
	completedAt: string[];
	bestTime: number | null;
};

type MatchState = {
	foreignId: string;
	translationId: string;
	isCorrect: boolean;
};

const VocabularyMatchingGame: React.FC = () => {
	const vocabularyCategories: Category[] = [
		{
			id: "basics",
			name: "Basic Phrases",
			description: "Essential phrases for everyday conversations",
			level: "beginner",
			language: "Spanish",
			icon: <FiGlobe className="w-6 h-6" />,
			items: [
				{
					id: "b1",
					foreignWord: "Hola",
					translation: "Hello",
					pronunciation: "OH-lah",
					example: "¡Hola! ¿Cómo estás?",
				},
				{
					id: "b2",
					foreignWord: "Adiós",
					translation: "Goodbye",
					pronunciation: "ah-DYOHS",
					example: "Adiós, hasta mañana.",
				},
				{
					id: "b3",
					foreignWord: "Gracias",
					translation: "Thank you",
					pronunciation: "GRAH-syahs",
					example: "Muchas gracias por tu ayuda.",
				},
				{
					id: "b4",
					foreignWord: "Por favor",
					translation: "Please",
					pronunciation: "pohr fah-VOHR",
					example: "Por favor, pásame el agua.",
				},
				{
					id: "b5",
					foreignWord: "Buenos días",
					translation: "Good morning",
					pronunciation: "BWEH-nohs DEE-ahs",
					example: "¡Buenos días! ¿Cómo dormiste?",
				},
				{
					id: "b6",
					foreignWord: "Buenas noches",
					translation: "Good night",
					pronunciation: "BWEH-nahs NOH-chehs",
					example: "Buenas noches, que descanses.",
				},
			],
		},
		{
			id: "food",
			name: "Food & Dining",
			description: "Words related to food, drinks, and dining out",
			level: "beginner",
			language: "Spanish",
			icon: <FiGift className="w-6 h-6" />,
			items: [
				{
					id: "f1",
					foreignWord: "Pan",
					translation: "Bread",
					pronunciation: "pahn",
					example: "Me gusta el pan recién horneado.",
				},
				{
					id: "f2",
					foreignWord: "Agua",
					translation: "Water",
					pronunciation: "AH-gwah",
					example: "Necesito un vaso de agua, por favor.",
				},
				{
					id: "f3",
					foreignWord: "Café",
					translation: "Coffee",
					pronunciation: "kah-FEH",
					example: "Tomo café todas las mañanas.",
				},
				{
					id: "f4",
					foreignWord: "Manzana",
					translation: "Apple",
					pronunciation: "mahn-SAH-nah",
					example: "Mi postre favorito es tarta de manzana.",
				},
				{
					id: "f5",
					foreignWord: "Queso",
					translation: "Cheese",
					pronunciation: "KEH-soh",
					example: "Este sándwich lleva queso y jamón.",
				},
				{
					id: "f6",
					foreignWord: "Vino",
					translation: "Wine",
					pronunciation: "BEE-noh",
					example: "Prefiero vino tinto con la cena.",
				},
			],
		},
		{
			id: "travel",
			name: "Travel & Transportation",
			description: "Essential vocabulary for traveling & transportation",
			level: "intermediate",
			language: "Spanish",
			icon: <FiHeadphones className="w-6 h-6" />,
			items: [
				{
					id: "t1",
					foreignWord: "Aeropuerto",
					translation: "Airport",
					pronunciation: "ah-eh-roh-PWEHR-toh",
					example: "El aeropuerto está a 30 minutos de aquí.",
				},
				{
					id: "t2",
					foreignWord: "Hotel",
					translation: "Hotel",
					pronunciation: "oh-TEHL",
					example: "Reservamos una habitación en el hotel.",
				},
				{
					id: "t3",
					foreignWord: "Pasaporte",
					translation: "Passport",
					pronunciation: "pah-sah-POHR-teh",
					example: "Necesitas tu pasaporte para viajar.",
				},
				{
					id: "t4",
					foreignWord: "Playa",
					translation: "Beach",
					pronunciation: "PLAH-yah",
					example: "Vamos a la playa este fin de semana.",
				},
				{
					id: "t5",
					foreignWord: "Tren",
					translation: "Train",
					pronunciation: "trehn",
					example: "El tren sale a las ocho en punto.",
				},
				{
					id: "t6",
					foreignWord: "Boleto",
					translation: "Ticket",
					pronunciation: "boh-LEH-toh",
					example: "Compré boletos para el concierto.",
				},
			],
		},
		{
			id: "business",
			name: "Business & Work",
			description: "Professional vocabulary for the workplace",
			level: "advanced",
			language: "Spanish",
			icon: <FiTrendingUp className="w-6 h-6" />,
			items: [
				{
					id: "biz1",
					foreignWord: "Reunión",
					translation: "Meeting",
					pronunciation: "reh-oo-NYOHN",
					example: "Tenemos una reunión importante a las diez.",
				},
				{
					id: "biz2",
					foreignWord: "Informe",
					translation: "Report",
					pronunciation: "in-FOHR-meh",
					example: "El informe anual estará listo mañana.",
				},
				{
					id: "biz3",
					foreignWord: "Contrato",
					translation: "Contract",
					pronunciation: "kon-TRAH-toh",
					example: "Necesito revisar el contrato antes de firmarlo.",
				},
				{
					id: "biz4",
					foreignWord: "Proyecto",
					translation: "Project",
					pronunciation: "proh-YEHK-toh",
					example: "Este proyecto se completará en tres meses.",
				},
				{
					id: "biz5",
					foreignWord: "Empleado",
					translation: "Employee",
					pronunciation: "ehm-pleh-AH-doh",
					example: "Somos diez empleados en el departamento.",
				},
				{
					id: "biz6",
					foreignWord: "Salario",
					translation: "Salary",
					pronunciation: "sah-LAH-ryoh",
					example: "El salario se paga el último día del mes.",
				},
			],
		},
	];

	const [loading, setLoading] = useState(true);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [currentView, setCurrentView] = useState<
		"home" | "game" | "stats" | "settings" | "landing"
	>("landing");
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);
	const [foreignWords, setForeignWords] = useState<VocabularyItem[]>([]);
	const [translations, setTranslations] = useState<VocabularyItem[]>([]);
	const [matches, setMatches] = useState<Record<string, string>>({});
	const [matchStates, setMatchStates] = useState<MatchState[]>([]);
	const [currentDrag, setCurrentDrag] = useState<string | null>(null);
	const [score, setScore] = useState(0);
	const [gameCompleted, setGameCompleted] = useState(false);
	const [timeLeft, setTimeLeft] = useState<number | null>(null);
	const [timedMode, setTimedMode] = useState(false);
	const [gamePaused, setGamePaused] = useState(false);
	const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
		"medium"
	);
	const [showInstructions, setShowInstructions] = useState(false);
	const [progress, setProgress] = useState<Record<string, UserProgress>>({});
	const [showWordDetail, setShowWordDetail] = useState<VocabularyItem | null>(
		null
	);
	const [streak, setStreak] = useState(0);
	const [animation, setAnimation] = useState<"correct" | "incorrect" | null>(
		null
	);
	const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
	const [reviewMode, setReviewMode] = useState(false);
	const [isHoveringCard, setIsHoveringCard] = useState<string | null>(null);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [emailSuccess, setEmailSuccess] = useState(false);
	const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
	const dragRef = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLElement>(null);

	const timeLimits = {
		easy: 120,
		medium: 90,
		hard: 60,
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2500);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		try {
			const savedProgress = localStorage.getItem("vocaMatchProgress");
			if (savedProgress) {
				setProgress(JSON.parse(savedProgress));
			}
		} catch (error) {
			console.error("Error loading progress:", error);
		}

		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setTheme(prefersDark ? "system" : "light");
	}, []);

	useEffect(() => {
		const root = document.documentElement;
		if (
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			root.classList.add("dark-theme");
		} else {
			root.classList.remove("dark-theme");
		}
	}, [theme]);

	useEffect(() => {
		try {
			localStorage.setItem("vocaMatchProgress", JSON.stringify(progress));
		} catch (error) {
			console.error("Error saving progress:", error);
		}
	}, [progress]);

	useEffect(() => {
		if (selectedCategory) {
			resetGame();
		}
	}, [selectedCategory]);

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		if (
			timedMode &&
			timeLeft !== null &&
			timeLeft > 0 &&
			!gameCompleted &&
			!gamePaused
		) {
			timer = setTimeout(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);
		} else if (timedMode && timeLeft === 0 && !gameCompleted) {
			endGame(false);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [timedMode, timeLeft, gameCompleted, gamePaused]);

	useEffect(() => {
		const handleTouchMove = (e: TouchEvent) => {
			if (!currentDrag || !dragRef.current) return;

			const touch = e.touches[0];
			if (dragRef.current) {
				dragRef.current.style.left = `${touch.clientX - 50}px`;
				dragRef.current.style.top = `${touch.clientY - 25}px`;
			}
		};

		window.addEventListener("touchmove", handleTouchMove);

		return () => {
			window.removeEventListener("touchmove", handleTouchMove);
		};
	}, [currentDrag]);

	useEffect(() => {
		if (mainRef.current) {
			mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentView]);

	const validateEmail = (email: string) => {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(String(email).toLowerCase());
	};

	const handleEmailSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			setEmailError("Email address is required");
			setEmailSuccess(false);
			return;
		}

		if (!validateEmail(email)) {
			setEmailError("Please enter a valid email address");
			setEmailSuccess(false);
			return;
		}

		setEmailSuccess(true);
		setEmailError("");
		setTimeout(() => {
			setEmail("");
			setEmailSuccess(false);
		}, 3000);
	};

	const shuffleArray = <T,>(array: T[]): T[] => {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	const resetGame = () => {
		if (!selectedCategory) return;

		const items = [...selectedCategory.items];
		setForeignWords(items);
		setTranslations(shuffleArray(items));

		setMatches({});
		setMatchStates([]);
		setScore(0);
		setGameCompleted(false);
		setGamePaused(false);
		setReviewMode(false);

		if (timedMode) {
			setTimeLeft(timeLimits[difficulty]);
		} else {
			setTimeLeft(null);
		}
	};

	const startGame = (category: Category) => {
		setSelectedCategory(category);
		setShowInstructions(false);
		setCurrentView("game");

		if (!progress[category.id]) {
			setProgress((prev) => ({
				...prev,
				[category.id]: {
					attempts: 0,
					correctMatches: 0,
					completedAt: [],
					bestTime: null,
				},
			}));
		}
	};

	const togglePause = () => {
		setGamePaused(!gamePaused);
	};

	const handleDragStart = (id: string, event?: React.DragEvent) => {
		if (gameCompleted || gamePaused) return;

		const matchedTranslationId = matches[id];

		if (matchedTranslationId) {
			const matchState = matchStates.find((m) => m.foreignId === id);
			if (matchState?.isCorrect) return;
		}

		setCurrentDrag(id);

		if (event) {
			event.dataTransfer.setData("text/plain", id);
			event.dataTransfer.effectAllowed = "move";
		}
	};

	const handleDragOver = (event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (foreignId: string, translationId: string) => {
		if (gameCompleted || gamePaused) return;

		const existingMatch = matchStates.find(
			(m) => m.foreignId === foreignId && m.isCorrect
		);
		if (existingMatch) return;

		const translationCorrectlyMatched = matchStates.find(
			(m) => m.translationId === translationId && m.isCorrect
		);
		if (translationCorrectlyMatched) return;

		const newMatches = { ...matches, [foreignId]: translationId };
		setMatches(newMatches);

		const foreignItem = foreignWords.find((w) => w.id === foreignId);
		const translationItem = translations.find((t) => t.id === translationId);

		if (foreignItem && translationItem) {
			const isCorrect = foreignItem.id === translationItem.id;

			const newMatchStates = [
				...matchStates.filter(
					(m) => m.foreignId !== foreignId && m.translationId !== translationId
				),
				{
					foreignId,
					translationId,
					isCorrect,
				},
			];

			setMatchStates(newMatchStates);

			setAnimation(isCorrect ? "correct" : "incorrect");
			setTimeout(() => setAnimation(null), 500);

			if (isCorrect) {
				setScore((prev) => prev + 1);
				setStreak((prev) => prev + 1);

				if (score + 1 === foreignWords.length) {
					setTimeout(() => endGame(true), 500);
				}
			} else {
				setStreak(0);
			}
		}

		setCurrentDrag(null);
	};

	const endGame = (success: boolean) => {
		setGameCompleted(true);

		if (selectedCategory) {
			const correctMatches = matchStates.filter((m) => m.isCorrect).length;

			const completionPercentage = Math.round(
				(correctMatches / selectedCategory.items.length) * 100
			);
			const isFullyCompleted = completionPercentage === 100;

			const currentDate = new Date().toISOString();
			const currentTimeLeft = timeLeft || 0;
			const timeTaken = timedMode
				? timeLimits[difficulty] - currentTimeLeft
				: null;

			setProgress((prev) => {
				const categoryProgress = prev[selectedCategory.id] || {
					attempts: 0,
					correctMatches: 0,
					completedAt: [],
					bestTime: null,
				};

				const bestTime =
					isFullyCompleted && timedMode
						? categoryProgress.bestTime === null ||
						  timeTaken < categoryProgress.bestTime
							? timeTaken
							: categoryProgress.bestTime
						: categoryProgress.bestTime;

				return {
					...prev,
					[selectedCategory.id]: {
						attempts: categoryProgress.attempts + 1,
						correctMatches: categoryProgress.correctMatches + correctMatches,
						completedAt: isFullyCompleted
							? [...categoryProgress.completedAt, currentDate]
							: categoryProgress.completedAt,
						bestTime,
					},
				};
			});
		}

		if (success && score === foreignWords.length) {
			triggerConfetti();
		}
	};

	const triggerConfetti = () => {
		const canvas = confettiCanvasRef.current;
		if (canvas) {
			const myConfetti = confetti.create(canvas, {
				resize: true,
				useWorker: true,
			});

			const duration = 3 * 1000;
			const end = Date.now() + duration;

			const colors = ["#5B21B6", "#4F46E5", "#2563EB", "#0EA5E9", "#06B6D4"];

			(function frame() {
				myConfetti({
					particleCount: 2,
					angle: 60,
					spread: 55,
					origin: { x: 0 },
					colors: colors,
				});

				myConfetti({
					particleCount: 2,
					angle: 120,
					spread: 55,
					origin: { x: 1 },
					colors: colors,
				});

				if (Date.now() < end) {
					requestAnimationFrame(frame);
				}
			})();

			setTimeout(() => {
				myConfetti({
					particleCount: 150,
					spread: 100,
					origin: { y: 0.6 },
					colors: colors,
				});
			}, 1000);
		}
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const getCategoryProgress = (categoryId: string): number => {
		if (!progress[categoryId]) return 0;

		const category = vocabularyCategories.find((c) => c.id === categoryId);
		if (!category) return 0;

		const maxPossible = category.items.length * progress[categoryId].attempts;
		if (maxPossible === 0) return 0;

		return Math.round(
			(progress[categoryId].correctMatches / maxPossible) * 100
		);
	};

	const getCategoryCompletions = (categoryId: string): number => {
		if (!progress[categoryId]) return 0;
		return progress[categoryId].completedAt.length;
	};

	const enterReviewMode = () => {
		setReviewMode(true);
	};

	const Header = () => (
		<header className="bg-white border-b border-gray-100 sticky top-0 z-40 transition-all duration-300 shadow-sm hover:shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						<button
							onClick={() => {
								setCurrentView("home");
								setSelectedCategory(null);
							}}
							className="flex items-center gap-2 text-indigo-600 font-bold text-xl transition-transform duration-300 hover:scale-105"
						>
							<FiBook className="h-6 w-6" />
							<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								VocaMatch
							</span>
						</button>
					</div>

					<nav className="hidden md:flex items-center gap-8">
						<button
							onClick={() => {
								setCurrentView("home");
								setSelectedCategory(null);
							}}
							className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
								currentView === "home"
									? "text-indigo-600"
									: "text-gray-600 hover:text-indigo-500"
							}`}
						>
							<FiHome className="h-4 w-4" />
							<span>Home</span>
						</button>
						<button
							onClick={() => setCurrentView("stats")}
							className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
								currentView === "stats"
									? "text-indigo-600"
									: "text-gray-600 hover:text-indigo-500"
							}`}
						>
							<FiTrendingUp className="h-4 w-4" />
							<span>Statistics</span>
						</button>
						<button
							onClick={() => setCurrentView("settings")}
							className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
								currentView === "settings"
									? "text-indigo-600"
									: "text-gray-600 hover:text-indigo-500"
							}`}
						>
							<FiSettings className="h-4 w-4" />
							<span>Settings</span>
						</button>
					</nav>

					<div className="md:hidden">
						<button
							onClick={() => setMobileNavOpen((prev) => !prev)}
							className="text-gray-500 hover:text-indigo-500 focus:outline-none transition-transform duration-300 hover:scale-110"
						>
							{mobileNavOpen ? (
								<FiX className="h-6 w-6" />
							) : (
								<FiMenu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{mobileNavOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="md:hidden bg-white border-t border-gray-100"
					>
						<div className="px-4 py-3 space-y-1">
							<button
								onClick={() => {
									setCurrentView("home");
									setSelectedCategory(null);
									setMobileNavOpen(false);
								}}
								className={`flex w-full items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
									currentView === "home"
										? "bg-indigo-50 text-indigo-600"
										: "text-gray-600 hover:bg-gray-50"
								}`}
							>
								<FiHome className="h-5 w-5" />
								<span>Home</span>
							</button>
							<button
								onClick={() => {
									setCurrentView("stats");
									setMobileNavOpen(false);
								}}
								className={`flex w-full items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
									currentView === "stats"
										? "bg-indigo-50 text-indigo-600"
										: "text-gray-600 hover:bg-gray-50"
								}`}
							>
								<FiTrendingUp className="h-5 w-5" />
								<span>Statistics</span>
							</button>
							<button
								onClick={() => {
									setCurrentView("settings");
									setMobileNavOpen(false);
								}}
								className={`flex w-full items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
									currentView === "settings"
										? "bg-indigo-50 text-indigo-600"
										: "text-gray-600 hover:bg-gray-50"
								}`}
							>
								<FiSettings className="h-5 w-5" />
								<span>Settings</span>
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);

	const Footer = () => (
		<footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white pt-12 pb-6 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					<div>
						<h3 className="text-xl font-bold mb-4 flex items-center">
							<FiBook className="h-5 w-5 mr-2" />
							<span>VocaMatch</span>
						</h3>
						<p className="text-indigo-200 mb-4">
							Improve your language skills with our engaging vocabulary matching
							games. Learn at your own pace or challenge yourself with timed
							exercises.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<button
									onClick={() => {
										setCurrentView("home");
										setSelectedCategory(null);
									}}
									className="text-indigo-200 hover:text-white transition-colors duration-300 flex items-center"
								>
									<FiChevronRight className="h-4 w-4 mr-1" /> Home
								</button>
							</li>
							<li>
								<button
									onClick={() => setCurrentView("stats")}
									className="text-indigo-200 hover:text-white transition-colors duration-300 flex items-center"
								>
									<FiChevronRight className="h-4 w-4 mr-1" /> Statistics
								</button>
							</li>
							<li>
								<button
									onClick={() => setCurrentView("settings")}
									className="text-indigo-200 hover:text-white transition-colors duration-300 flex items-center"
								>
									<FiChevronRight className="h-4 w-4 mr-1" /> Settings
								</button>
							</li>
							<li>
								<button
									onClick={() => setShowInstructions(true)}
									className="text-indigo-200 hover:text-white transition-colors duration-300 flex items-center"
								>
									<FiChevronRight className="h-4 w-4 mr-1" /> How to Play
								</button>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
						<p className="text-indigo-200 mb-4">
							Subscribe to our newsletter for the latest vocabulary lists and
							learning tips.
						</p>
						<form onSubmit={handleEmailSubmit} className="space-y-2">
							<div className="flex flex-col space-y-2">
								<div className="flex">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Your email"
										className="px-4 py-2 rounded-l-lg bg-white text-indigo-800 border border-indigo-700 focus:outline-none focus:border-white flex-grow"
									/>
									<button
										type="submit"
										className="bg-white text-indigo-900 px-4 py-2 rounded-r-lg font-medium hover:bg-indigo-100 transition-colors duration-300 flex items-center justify-center"
									>
										{emailSuccess ? (
											<FiCheck className="h-5 w-5" />
										) : (
											<FiMail className="h-5 w-5" />
										)}
									</button>
								</div>
								{emailError && (
									<p className="text-red-300 text-sm">{emailError}</p>
								)}
								{emailSuccess && (
									<p className="text-green-300 text-sm">
										Successfully subscribed!
									</p>
								)}
							</div>
						</form>
					</div>
				</div>

				<div className="pt-8 mt-8 border-t border-indigo-800 flex flex-col md:flex-row md:justify-between md:items-center">
					<p className="text-center md:text-left text-indigo-300 text-sm">
						© 2025 VocaMatch. Practice in your hand.
					</p>
				</div>
			</div>
		</footer>
	);

	const LoadingScreen = () => (
		<div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center z-50">
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="text-white text-center"
			>
				<div className="flex items-center justify-center mb-8">
					<motion.div
						animate={{
							rotate: 360,
							scale: [1, 1.2, 1],
						}}
						transition={{
							rotate: { repeat: Infinity, duration: 2, ease: "linear" },
							scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
						}}
						className="relative w-20 h-20 mb-4"
					>
						<div className="absolute inset-0 rounded-full border-4 border-indigo-300 border-opacity-25"></div>
						<div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.5 }}
							className="absolute inset-0 flex items-center justify-center"
						>
							<FiBook className="h-8 w-8 text-white" />
						</motion.div>
					</motion.div>
				</div>
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="text-3xl font-bold mb-2"
				>
					VocaMatch
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.5 }}
					className="text-indigo-200 mb-8"
				>
					Loading your language learning experience...
				</motion.p>
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: "100%" }}
					transition={{ duration: 2, ease: "easeInOut" }}
					className="h-1 bg-white rounded-full max-w-xs mx-auto overflow-hidden"
				></motion.div>
			</motion.div>
		</div>
	);

	const LandingPage = () => (
		<div className="min-h-screen flex flex-col">
			{}
			<div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className="space-y-6"
						>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
								Master vocabulary the{" "}
								<span className="text-yellow-300">interactive way</span>
							</h1>
							<p className="text-xl text-indigo-100 max-w-lg">
								VocaMatch makes language learning fun and effective through
								engaging matching exercises tailored to your skill level.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 pt-4">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setCurrentView("home")}
									className="px-8 py-4 bg-white text-indigo-900 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
								>
									Get Started <FiChevronRight />
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowInstructions(true)}
									className="px-8 py-4 bg-transparent border border-white text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
								>
									How It Works <FiHelpCircle />
								</motion.button>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative"
						>
							<div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl blur-xl opacity-50 animate-pulse"></div>
							<div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
								<div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2"></div>
								<div className="p-6">
									<div className="grid grid-cols-2 gap-4">
										{[
											{ word: "Hola", translation: "Hello" },
											{ word: "Gracias", translation: "Thank you" },
											{ word: "Por favor", translation: "Please" },
											{ word: "Adiós", translation: "Goodbye" },
										].map((item, idx) => (
											<motion.div
												key={idx}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
												className={`p-4 rounded-lg ${
													idx % 2 === 0
														? "bg-indigo-50 border border-indigo-100"
														: "bg-white border border-gray-200"
												}`}
											>
												<p
													className={`text-lg font-medium ${
														idx % 2 === 0 ? "text-indigo-700" : "text-gray-700"
													}`}
												>
													{idx % 2 === 0 ? item.word : item.translation}
												</p>
											</motion.div>
										))}
									</div>
									<div className="mt-6 flex justify-between items-center">
										<div className="flex items-center gap-2">
											<div className="h-2 w-2 rounded-full bg-green-500"></div>
											<span className="text-sm text-gray-500">
												Match words to translations
											</span>
										</div>
										<span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
											Spanish
										</span>
									</div>
								</div>
							</div>

							{}
							<div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-300 rounded-full opacity-20"></div>
							<div className="absolute -left-6 top-1/2 w-12 h-12 bg-indigo-300 rounded-full opacity-20"></div>
						</motion.div>
					</div>
				</div>

				{}
				<motion.div
					className="flex justify-center pb-8"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.2, duration: 0.5 }}
				>
					<motion.div
						animate={{ y: [0, 10, 0] }}
						transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
						className="text-white/70 cursor-pointer"
						onClick={() => {
							const featuresSection = document.getElementById("features");
							if (featuresSection) {
								featuresSection.scrollIntoView({ behavior: "smooth" });
							}
						}}
					>
						<FiArrowDown className="h-6 w-6" />
					</motion.div>
				</motion.div>
			</div>

			{}
			<div id="features" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="text-center mb-16">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
						>
							Why Language Learners Love VocaMatch
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-xl text-gray-600 max-w-3xl mx-auto"
						>
							Our interactive approach to vocabulary building makes learning
							effective and enjoyable
						</motion.p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								icon: <FiGrid className="h-6 w-6" />,
								title: "Interactive Learning",
								description:
									"Engage actively with words through our intuitive drag-and-drop interface",
							},
							{
								icon: <FiClock className="h-6 w-6" />,
								title: "Adaptive Difficulty",
								description:
									"Choose between timed challenges or relaxed practice sessions",
							},
							{
								icon: <FiTrendingUp className="h-6 w-6" />,
								title: "Progress Tracking",
								description:
									"Monitor your improvement with detailed statistics and analytics",
							},
							{
								icon: <FiGlobe className="h-6 w-6" />,
								title: "Multiple Languages",
								description:
									"Expand your vocabulary across different languages and topics",
							},
							{
								icon: <FiAward className="h-6 w-6" />,
								title: "Achievement System",
								description:
									"Stay motivated with celebratory animations and progress badges",
							},
							{
								icon: <FiBook className="h-6 w-6" />,
								title: "Structured Categories",
								description:
									"Learn vocabulary organized by theme and difficulty level",
							},
						].map((feature, idx) => (
							<motion.div
								key={idx}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.1 * idx }}
								whileHover={{
									y: -5,
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
								}}
								className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
							>
								<div className="p-6">
									<div className="p-3 bg-indigo-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4 text-indigo-600">
										{feature.icon}
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600">{feature.description}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{}
			<div className="bg-white py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl overflow-hidden shadow-xl"
					>
						<div className="px-6 py-12 md:p-12 text-center text-white">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Ready to enhance your vocabulary?
							</h2>
							<p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
								Start matching words and building your language skills today. No
								registration required!
							</p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setCurrentView("home")}
								className="px-8 py-4 bg-white text-indigo-900 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
							>
								Start Learning Now
							</motion.button>
						</div>
					</motion.div>
				</div>
			</div>

			<Footer />
		</div>
	);

	const renderHomePage = () => (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
			<div className="text-center mb-12">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-4xl md:text-5xl font-bold mb-4"
				>
					Master vocabulary through{" "}
					<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						interactive learning
					</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="text-xl text-gray-600 max-w-3xl mx-auto"
				>
					Improve your language skills with our engaging vocabulary matching
					games. Learn at your own pace or challenge yourself with timed
					exercises.
				</motion.p>
			</div>

			<div className="mb-16">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900 flex items-center">
						<span className="inline-block mr-2 w-6 h-1 bg-indigo-600 rounded-full"></span>
						Featured Categories
					</h2>
					<button
						onClick={() => setShowInstructions(true)}
						className="flex items-center gap-1 text-indigo-600 text-sm font-medium transition-all duration-300 hover:scale-105"
					>
						<FiHelpCircle className="h-4 w-4" />
						<span>How to Play</span>
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{vocabularyCategories.map((category) => (
						<motion.div
							key={category.id}
							whileHover={{
								scale: 1.03,
								boxShadow:
									"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
							}}
							transition={{ duration: 0.3 }}
							onClick={() => startGame(category)}
							onMouseEnter={() => setIsHoveringCard(category.id)}
							onMouseLeave={() => setIsHoveringCard(null)}
							className="bg-white rounded-xl overflow-hidden cursor-pointer group relative"
							style={{
								boxShadow:
									"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
								transition: "all 0.3s ease",
							}}
						>
							<div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 transform transition-transform duration-300 group-hover:rotate-12">
										{category.icon}
									</div>
									<span
										className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors duration-300 ${
											category.level === "beginner"
												? "bg-green-100 text-green-800 group-hover:bg-green-200"
												: category.level === "intermediate"
												? "bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200"
												: "bg-red-100 text-red-800 group-hover:bg-red-200"
										}`}
									>
										{category.level.charAt(0).toUpperCase() +
											category.level.slice(1)}
									</span>
								</div>

								<h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">
									{category.name}
								</h3>
								<p className="text-sm text-gray-500 mb-4 line-clamp-2">
									{category.description}
								</p>

								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-500 flex items-center">
										<FiBook className="mr-1 h-3 w-3" />
										{category.items.length} words
									</span>
									<span className="text-gray-500 flex items-center">
										<FiGlobe className="mr-1 h-3 w-3" />
										{category.language}
									</span>
								</div>

								<div className="mt-4">
									<div className="flex justify-between text-xs text-gray-500 mb-1">
										<span>Progress</span>
										<span>
											{progress[category.id]
												? getCategoryProgress(category.id)
												: 0}
											%
										</span>
									</div>
									<div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{
												width: `${
													progress[category.id]
														? getCategoryProgress(category.id)
														: 0
												}%`,
											}}
											transition={{ duration: 0.8, ease: "easeOut" }}
											className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full"
										></motion.div>
									</div>
								</div>
							</div>

							<div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
								<div className="flex items-center text-sm text-gray-500">
									<FiAward className="h-4 w-4 mr-1" />
									<span>{getCategoryCompletions(category.id)} completions</span>
								</div>
								<span className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center transition-all duration-300 group-hover:translate-x-1">
									Start Learning
									<FiChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
								</span>
							</div>

							{isHoveringCard === category.id && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="absolute inset-0 border-2 border-indigo-500 rounded-xl pointer-events-none"
									style={{ zIndex: 1 }}
								></motion.div>
							)}
						</motion.div>
					))}
				</div>
			</div>

			<div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-16 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>

				<h2 className="text-2xl font-bold text-gray-900 mb-8 text-center relative z-10">
					Why VocaMatch Works
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
					<motion.div
						whileHover={{ y: -5 }}
						transition={{ duration: 0.3 }}
						className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300"
					>
						<div className="p-3 bg-indigo-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4 text-indigo-600">
							<FiGrid className="h-6 w-6" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Interactive Learning
						</h3>
						<p className="text-gray-600">
							Engage with words through our drag-and-drop interface, making
							vocabulary learning more active and memorable.
						</p>
					</motion.div>

					<motion.div
						whileHover={{ y: -5 }}
						transition={{ duration: 0.3 }}
						className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300"
					>
						<div className="p-3 bg-indigo-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4 text-indigo-600">
							<FiClock className="h-6 w-6" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Adaptive Difficulty
						</h3>
						<p className="text-gray-600">
							Challenge yourself with timed exercises or practice at your own
							pace to build vocabulary skills progressively.
						</p>
					</motion.div>

					<motion.div
						whileHover={{ y: -5 }}
						transition={{ duration: 0.3 }}
						className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300"
					>
						<div className="p-3 bg-indigo-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4 text-indigo-600">
							<FiTrendingUp className="h-6 w-6" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Progress Tracking
						</h3>
						<p className="text-gray-600">
							Monitor your improvement over time with detailed statistics and
							track your mastery of different vocabulary categories.
						</p>
					</motion.div>
				</div>
			</div>

			<div className="relative p-10 md:p-12 rounded-xl overflow-hidden my-12">
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-700/90 z-0"></div>

				<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
					<div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
					<div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
					<div className="absolute top-1/2 left-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
					<svg
						className="absolute right-0 top-0 h-16 w-16 text-purple-300/20"
						viewBox="0 0 100 100"
						fill="none"
					>
						<path
							d="M20,50 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0"
							stroke="currentColor"
							strokeWidth="10"
							strokeLinecap="round"
						></path>
					</svg>
					<svg
						className="absolute left-10 bottom-10 h-20 w-20 text-indigo-300/20"
						viewBox="0 0 100 100"
						fill="none"
					>
						<path
							d="M10,10 L90,10 L90,90 L10,90 Z"
							stroke="currentColor"
							strokeWidth="10"
							strokeLinecap="round"
						></path>
					</svg>
				</div>

				<div className="relative z-10 text-center max-w-3xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
					>
						<span className="inline-block text-indigo-100 bg-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
							Boost Your Language Skills
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
							Ready to expand your vocabulary{" "}
							<span className="text-yellow-300">the fun way</span>?
						</h2>
						<p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
							Choose a category and start mastering new words through
							interactive matching. Perfect for language learners at any level.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => startGame(vocabularyCategories[0])}
								className="inline-flex items-center px-8 py-4 text-base font-medium rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center"
							>
								Start with Basic Phrases
								<FiChevronRight className="ml-2 h-5 w-5" />
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setShowInstructions(true)}
								className="inline-flex items-center px-6 py-4 text-base font-medium rounded-xl text-white border border-white/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto justify-center"
							>
								<FiHelpCircle className="mr-2 h-5 w-5" />
								How It Works
							</motion.button>
						</div>

						<div className="mt-8 flex items-center justify-center text-indigo-100">
							<div className="flex -space-x-2">
								<div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-medium text-white">
									JD
								</div>
								<div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-xs font-medium text-white">
									MR
								</div>
								<div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-xs font-medium text-white">
									KS
								</div>
							</div>
							<p className="ml-3 text-sm">
								Join <span className="font-medium">2,500+</span> language
								learners today
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);

	const renderInstructionsModal = () => (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.3 }}
				className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
			>
				<div className="p-6">
					<div className="flex justify-between items-start mb-6">
						<h2 className="text-2xl font-bold text-gray-900 flex items-center">
							<FiHelpCircle className="text-indigo-600 mr-2 h-6 w-6" />
							How to Play VocaMatch
						</h2>
						<button
							onClick={() => setShowInstructions(false)}
							className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
						>
							<FiX className="h-6 w-6" />
						</button>
					</div>

					<div className="space-y-6">
						<div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
							<h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
								<FiStar className="text-indigo-600 mr-2 h-5 w-5" />
								Game Objective
							</h3>
							<p className="text-gray-600">
								Match each foreign word with its correct English translation by
								dragging and dropping. The faster and more accurately you match,
								the higher your score!
							</p>
						</div>

						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
								<FiCheck className="text-indigo-600 mr-2 h-5 w-5" />
								How to Play
							</h3>
							<ol className="space-y-3 text-gray-600 list-none">
								{[
									"Select a vocabulary category that you want to practice",
									"Choose between regular mode or timed challenge",
									"Drag each foreign word from the left column",
									"Drop it onto its matching translation in the right column",
									"Correct matches will be indicated with green highlighting",
									"Incorrect matches will be highlighted in red",
									"Complete all matches to finish the game",
								].map((step, index) => (
									<li key={index} className="flex items-start">
										<span className="flex-shrink-0 flex items-center justify-center bg-indigo-100 text-indigo-800 h-6 w-6 rounded-full mr-3 text-sm font-medium">
											{index + 1}
										</span>
										<span>{step}</span>
									</li>
								))}
							</ol>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
								<h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
									<FiBook className="text-indigo-600 mr-2 h-4 w-4" />
									Practice Mode
								</h3>
								<p className="text-sm text-gray-600">
									No time limit, focus on learning at your own pace
								</p>
							</div>

							<div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
								<h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
									<FiClock className="text-indigo-600 mr-2 h-4 w-4" />
									Timed Mode
								</h3>
								<p className="text-sm text-gray-600">
									Challenge yourself to complete matches before time runs out
								</p>
							</div>

							<div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
								<h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
									<FiRefreshCw className="text-indigo-600 mr-2 h-4 w-4" />
									Review Mode
								</h3>
								<p className="text-sm text-gray-600">
									See all correct matches after completing a game
								</p>
							</div>
						</div>

						<div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
							<h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
								<FiAward className="text-indigo-600 mr-2 h-5 w-5" />
								Scoring
							</h3>
							<p className="text-gray-600">
								Points are awarded for each correct match. In timed mode,
								completing matches faster earns you a better score. Perfect
								scores trigger a special celebration!
							</p>
						</div>
					</div>

					<div className="mt-8 flex justify-end">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowInstructions(false)}
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
						>
							Got it!
						</motion.button>
					</div>
				</div>
			</motion.div>
		</div>
	);

	const renderGameBoard = () => (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<div className="flex items-center">
					<button
						onClick={() => {
							setCurrentView("home");
							setSelectedCategory(null);
						}}
						className="mr-3 text-gray-500 hover:text-indigo-600 transition-all duration-300 hover:scale-110"
					>
						<FiChevronLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 flex items-center">
							<span className="inline-block mr-2 w-4 h-1 bg-indigo-600 rounded-full"></span>
							{selectedCategory?.name}
						</h1>
						<p className="text-gray-500">{selectedCategory?.description}</p>
					</div>
				</div>

				<div className="flex items-center space-x-4 mt-4 md:mt-0">
					{timedMode && timeLeft !== null && (
						<div
							className={`flex items-center px-4 py-2 rounded-lg ${
								timeLeft < 10
									? "bg-red-100 text-red-800"
									: "bg-indigo-100 text-indigo-800"
							} transition-all duration-300 ${
								timeLeft < 10 ? "animate-pulse" : ""
							}`}
						>
							<FiClock className="h-4 w-4 mr-2" />
							<span className="font-mono font-medium">
								{formatTime(timeLeft)}
							</span>

							{!gameCompleted && (
								<button
									onClick={togglePause}
									className="ml-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300"
								>
									{gamePaused ? (
										<FiPlay className="h-4 w-4" />
									) : (
										<FiPause className="h-4 w-4" />
									)}
								</button>
							)}
						</div>
					)}

					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-lg shadow-sm"
					>
						<FiCheckCircle className="h-4 w-4 mr-2" />
						<span className="font-medium">
							{score}/{foreignWords.length}
						</span>
					</motion.div>

					{!gameCompleted && (
						<motion.button
							whileHover={{ rotate: 180 }}
							transition={{ duration: 0.5 }}
							onClick={resetGame}
							className="p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300"
							title="Reset Game"
						>
							<FiRefreshCw className="h-5 w-5" />
						</motion.button>
					)}
				</div>
			</div>

			{gamePaused && !gameCompleted && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-40">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
						className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
					>
						<div className="text-center mb-6">
							<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<FiPause className="h-8 w-8 text-indigo-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Game Paused
							</h2>
							<p className="text-gray-600">
								Take a break and resume when you're ready.
							</p>
						</div>
						<div className="flex justify-center">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={togglePause}
								className="inline-flex items-center px-4 py-2 text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
							>
								<FiPlay className="h-5 w-5 mr-2" />
								Resume Game
							</motion.button>
						</div>
					</motion.div>
				</div>
			)}

			{showWordDetail && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="bg-white rounded-xl shadow-xl max-w-md w-full"
					>
						<div className="p-6">
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-bold text-gray-900 flex items-center">
									<span className="inline-block mr-2 w-3 h-3 bg-indigo-600 rounded-full"></span>
									{showWordDetail.foreignWord}
								</h3>
								<button
									onClick={() => setShowWordDetail(null)}
									className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
								>
									<FiX className="h-6 w-6" />
								</button>
							</div>

							<div className="space-y-4">
								<div className="bg-gray-50 p-3 rounded-lg">
									<p className="text-sm text-gray-500 mb-1">Translation</p>
									<p className="text-lg font-medium text-gray-900">
										{showWordDetail.translation}
									</p>
								</div>

								{showWordDetail.pronunciation && (
									<div className="bg-gray-50 p-3 rounded-lg">
										<p className="text-sm text-gray-500 mb-1">Pronunciation</p>
										<p className="text-gray-900 flex items-center">
											<span className="mr-2">
												/{showWordDetail.pronunciation}/
											</span>
											<button className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
												<FiHeadphones className="h-4 w-4" />
											</button>
										</p>
									</div>
								)}

								{showWordDetail.example && (
									<div className="bg-gray-50 p-3 rounded-lg">
										<p className="text-sm text-gray-500 mb-1">Example</p>
										<p className="text-gray-900 italic border-l-2 border-indigo-300 pl-3">
											{showWordDetail.example}
										</p>
									</div>
								)}
							</div>

							<div className="mt-6 flex justify-end">
								<button
									onClick={() => setShowWordDetail(null)}
									className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
								>
									Close
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			)}

			<div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg">
				{gameCompleted && !reviewMode ? (
					<div className="p-8 text-center">
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="mb-6"
						>
							{score === foreignWords.length ? (
								<div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-4">
									<FiAward className="h-8 w-8" />
								</div>
							) : (
								<div className="inline-flex items-center justify-center p-4 bg-yellow-100 text-yellow-600 rounded-full mb-4">
									<FiStar className="h-8 w-8" />
								</div>
							)}

							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								{score === foreignWords.length
									? "Perfect! You matched all words correctly!"
									: `You matched ${score} out of ${foreignWords.length} words correctly.`}
							</h2>

							<p className="text-gray-600 mb-6">
								{timedMode && timeLeft !== null
									? `Time remaining: ${formatTime(timeLeft)}`
									: "Keep practicing to improve your vocabulary!"}
							</p>
						</motion.div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
							<motion.div
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.3, delay: 0.2 }}
								className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 text-center shadow-sm"
							>
								<p className="text-sm text-gray-500 mb-1">Accuracy</p>
								<p className="text-2xl font-bold text-indigo-600">
									{Math.round((score / foreignWords.length) * 100)}%
								</p>
							</motion.div>

							{timedMode && timeLeft !== null && (
								<motion.div
									initial={{ x: 20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.2 }}
									className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center shadow-sm"
								>
									<p className="text-sm text-gray-500 mb-1">Time Used</p>
									<p className="text-2xl font-bold text-purple-600">
										{formatTime(timeLimits[difficulty] - timeLeft)}
									</p>
								</motion.div>
							)}
						</div>

						<div className="flex flex-wrap justify-center gap-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={resetGame}
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
							>
								<FiRefreshCw className="h-4 w-4 mr-2" />
								Play Again
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={enterReviewMode}
								className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300"
							>
								<FiBook className="h-4 w-4 mr-2" />
								Review Words
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => {
									setCurrentView("home");
									setSelectedCategory(null);
								}}
								className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300"
							>
								<FiGrid className="h-4 w-4 mr-2" />
								Choose Another Category
							</motion.button>
						</div>
					</div>
				) : reviewMode ? (
					<div className="p-6">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-bold text-gray-900 flex items-center">
								<FiBook className="mr-2 text-indigo-600 h-5 w-5" />
								Review Mode
							</h3>
							<button
								onClick={() => setReviewMode(false)}
								className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-all duration-300 hover:translate-x-1"
							>
								Exit Review
								<FiChevronRight className="inline-block ml-1 h-4 w-4" />
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
							{foreignWords.map((item) => {
								const matchState = matchStates.find(
									(m) => m.foreignId === item.id
								);
								return (
									<motion.div
										key={item.id}
										whileHover={{ scale: 1.02 }}
										transition={{ duration: 0.2 }}
										className={`p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
											matchState?.isCorrect
												? "border-green-200 bg-green-50"
												: matchState?.isCorrect === false
												? "border-red-200 bg-red-50"
												: "border-gray-200 bg-white"
										}`}
										onClick={() => setShowWordDetail(item)}
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="text-lg font-medium text-gray-900">
													{item.foreignWord}
												</p>
												<p className="text-gray-600">{item.translation}</p>
												{item.pronunciation && (
													<p className="text-sm text-gray-500 mt-1 flex items-center">
														/{item.pronunciation}/
														<FiHeadphones className="ml-1 h-3 w-3 text-indigo-400 cursor-pointer hover:text-indigo-600" />
													</p>
												)}
											</div>

											{matchState && (
												<div
													className={`p-1 rounded-full ${
														matchState.isCorrect
															? "bg-green-100 text-green-600"
															: "bg-red-100 text-red-600"
													}`}
												>
													{matchState.isCorrect ? (
														<FiCheckCircle className="h-5 w-5" />
													) : (
														<FiXCircle className="h-5 w-5" />
													)}
												</div>
											)}
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				) : (
					<div className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
									<FiGlobe className="h-5 w-5 mr-2 text-indigo-500" />
									<span>{selectedCategory?.language} Words</span>
								</h3>

								<AnimatePresence>
									<div className="space-y-3">
										{foreignWords.map((item) => {
											const matchState = matchStates.find(
												(m) => m.foreignId === item.id
											);
											return (
												<motion.div
													key={item.id}
													draggable={!matchState?.isCorrect}
													onDragStart={(e) => handleDragStart(item.id, e)}
													animate={
														animation === "correct" && matches[item.id]
															? {
																	scale: [1, 1.05, 1],
																	backgroundColor: ["#fff", "#ecfdf5", "#fff"],
																	boxShadow: [
																		"0 1px 2px 0 rgba(0, 0, 0, 0.05)",
																		"0 0 0 3px rgba(16, 185, 129, 0.2)",
																		"0 1px 2px 0 rgba(0, 0, 0, 0.05)",
																	],
															  }
															: animation === "incorrect" && matches[item.id]
															? {
																	scale: [1, 1.05, 1],
																	backgroundColor: ["#fff", "#fef2f2", "#fff"],
																	boxShadow: [
																		"0 1px 2px 0 rgba(0, 0, 0, 0.05)",
																		"0 0 0 3px rgba(220, 38, 38, 0.2)",
																		"0 1px 2px 0 rgba(0, 0, 0, 0.05)",
																	],
															  }
															: {}
													}
													transition={{ duration: 0.5 }}
													className={`p-4 rounded-lg border ${
														matchState?.isCorrect
															? "bg-green-50 border-green-200 cursor-default shadow-md"
															: matchState?.isCorrect === false
															? "bg-red-50 border-red-200 cursor-grab active:cursor-grabbing shadow-md"
															: "bg-white border-gray-200 cursor-grab active:cursor-grabbing hover:bg-gray-50 hover:shadow-md transition-all duration-300"
													}`}
													onTouchStart={() => handleDragStart(item.id)}
													whileHover={
														!matchState?.isCorrect ? { scale: 1.02, y: -2 } : {}
													}
													whileTap={
														!matchState?.isCorrect ? { scale: 0.98 } : {}
													}
												>
													<div className="flex justify-between items-center">
														<div>
															<span className="text-lg font-medium">
																{item.foreignWord}
															</span>
															{item.pronunciation && (
																<span className="ml-2 text-xs text-gray-500">
																	/{item.pronunciation}/
																</span>
															)}
														</div>

														{matchState?.isCorrect && (
															<FiCheckCircle className="h-5 w-5 text-green-500" />
														)}

														{matchState?.isCorrect === false && (
															<FiXCircle className="h-5 w-5 text-red-500" />
														)}
													</div>
												</motion.div>
											);
										})}
									</div>
								</AnimatePresence>
							</div>

							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
									<FiBook className="h-5 w-5 mr-2 text-indigo-500" />
									<span>English Translations</span>
								</h3>

								<div className="space-y-3">
									{translations.map((item) => {
										const isMatched = Object.values(matches).includes(item.id);
										const matchState = matchStates.find(
											(m) => m.translationId === item.id
										);

										return (
											<motion.div
												key={item.id}
												onDragOver={handleDragOver}
												onDrop={(e) => {
													e.preventDefault();
													const foreignId =
														e.dataTransfer.getData("text/plain") || currentDrag;
													if (foreignId) handleDrop(foreignId, item.id);
												}}
												onTouchEnd={() =>
													currentDrag && handleDrop(currentDrag, item.id)
												}
												whileHover={
													!matchState?.isCorrect ? { scale: 1.02, y: -2 } : {}
												}
												className={`p-4 rounded-lg border ${
													matchState?.isCorrect
														? "bg-green-50 border-green-200 shadow-md"
														: matchState?.isCorrect === false
														? "bg-red-50 border-red-200 shadow-md"
														: "bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
												} ${
													currentDrag && !isMatched
														? "border-dashed border-indigo-400 bg-indigo-50"
														: ""
												}`}
											>
												<div className="flex justify-between items-center">
													<span className="text-lg font-medium">
														{item.translation}
													</span>

													{matchState?.isCorrect && (
														<FiCheckCircle className="h-5 w-5 text-green-500" />
													)}

													{matchState?.isCorrect === false && (
														<FiXCircle className="h-5 w-5 text-red-500" />
													)}
												</div>
											</motion.div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{!gameCompleted && !reviewMode && (
				<div className="flex justify-between items-center">
					<motion.button
						whileHover={{ x: -3 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							setCurrentView("home");
							setSelectedCategory(null);
						}}
						className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-300"
					>
						<FiChevronLeft className="h-4 w-4 mr-1" />
						Back to Categories
					</motion.button>

					<div className="flex items-center">
						{streak > 2 && (
							<motion.div
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.3 }}
								className="mr-4 flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm shadow-sm"
							>
								<FiTrendingUp className="h-4 w-4 mr-1" />
								<span>{streak} streak!</span>
								<span className="ml-1 text-yellow-500">🔥</span>
							</motion.div>
						)}

						<motion.button
							whileHover={{ rotate: 180 }}
							transition={{ duration: 0.5 }}
							onClick={resetGame}
							className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-300"
						>
							<FiRefreshCw className="h-4 w-4 mr-1" />
							Reset
						</motion.button>
					</div>
				</div>
			)}

			{currentDrag && (
				<div
					ref={dragRef}
					className="fixed z-50 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 px-4 py-2 rounded-lg text-indigo-800 shadow-lg pointer-events-none flex items-center justify-center"
					style={{
						left: "-100px",
						top: "-100px",
						minWidth: "100px",
						minHeight: "40px",
					}}
				>
					{foreignWords.find((w) => w.id === currentDrag)?.foreignWord || ""}
				</div>
			)}
		</div>
	);

	const renderStatisticsView = () => (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-3xl font-bold text-gray-900 mb-8 flex items-center"
			>
				<span className="inline-block mr-3 w-6 h-1 bg-indigo-600 rounded-full"></span>
				Your Progress Statistics
			</motion.h1>

			{Object.keys(progress).length === 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center"
				>
					<div className="inline-flex items-center justify-center p-6 bg-indigo-50 text-indigo-600 rounded-full mb-6">
						<FiAlertTriangle className="h-10 w-10" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-3">
						No statistics yet
					</h2>
					<p className="text-gray-600 mb-8 max-w-md mx-auto">
						Start practicing vocabulary to see your progress here. Track your
						improvement over time and compete with yourself!
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setCurrentView("home")}
						className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
					>
						Start Learning
						<FiChevronRight className="ml-2 h-5 w-5" />
					</motion.button>
				</motion.div>
			) : (
				<div className="space-y-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
					>
						<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
							<FiTrendingUp className="text-indigo-600 mr-2 h-5 w-5" />
							Overall Performance
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							<motion.div
								whileHover={{ y: -5 }}
								transition={{ duration: 0.3 }}
								className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
							>
								<p className="text-sm text-gray-500 mb-1">Total Categories</p>
								<p className="text-2xl font-bold text-indigo-600">
									{Object.keys(progress).length}
								</p>
							</motion.div>

							<motion.div
								whileHover={{ y: -5 }}
								transition={{ duration: 0.3 }}
								className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
							>
								<p className="text-sm text-gray-500 mb-1">Total Attempts</p>
								<p className="text-2xl font-bold text-purple-600">
									{Object.values(progress).reduce(
										(sum, cat) => sum + cat.attempts,
										0
									)}
								</p>
							</motion.div>

							<motion.div
								whileHover={{ y: -5 }}
								transition={{ duration: 0.3 }}
								className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
							>
								<p className="text-sm text-gray-500 mb-1">Correct Matches</p>
								<p className="text-2xl font-bold text-indigo-600">
									{Object.values(progress).reduce(
										(sum, cat) => sum + cat.correctMatches,
										0
									)}
								</p>
							</motion.div>

							<motion.div
								whileHover={{ y: -5 }}
								transition={{ duration: 0.3 }}
								className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
							>
								<p className="text-sm text-gray-500 mb-1">
									Categories Completed
								</p>
								<p className="text-2xl font-bold text-purple-600">
									{
										Object.values(progress).filter(
											(cat) => cat.completedAt.length > 0
										).length
									}
								</p>
							</motion.div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
					>
						<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
							<FiBook className="text-indigo-600 mr-2 h-5 w-5" />
							Category Progress
						</h2>

						<div className="space-y-8">
							{vocabularyCategories
								.filter((cat) => progress[cat.id])
								.map((category, index) => {
									const categoryProgress = progress[category.id];
									const progressPercentage = getCategoryProgress(category.id);
									const totalWords = category.items.length;
									const possibleMatches =
										totalWords * categoryProgress.attempts;
									const accuracy =
										possibleMatches > 0
											? Math.round(
													(categoryProgress.correctMatches / possibleMatches) *
														100
											  )
											: 0;

									const stars = Math.min(5, Math.ceil(accuracy / 20));
									const isCompleted = categoryProgress.completedAt.length > 0;

									return (
										<motion.div
											key={category.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.4, delay: 0.1 * index }}
											whileHover={{
												y: -5,
												boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.15)",
											}}
											className="border border-gray-200 pb-6 last:pb-0 rounded-xl overflow-hidden transition-all duration-300 relative bg-white"
										>
											{}
											<div className="absolute top-0 right-0">
												<div
													className={`px-3 py-1 rounded-bl-lg ${
														isCompleted
															? "bg-indigo-600 text-white"
															: "bg-gray-100 text-gray-500"
													}`}
												>
													{isCompleted ? "Completed" : "In Progress"}
												</div>
											</div>

											{}
											<div
												className={`h-1.5 w-full ${
													category.level === "beginner"
														? "bg-gradient-to-r from-green-400 to-green-500"
														: category.level === "intermediate"
														? "bg-gradient-to-r from-yellow-400 to-yellow-500"
														: "bg-gradient-to-r from-red-400 to-red-500"
												}`}
											></div>

											<div className="p-5">
												<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
													<div className="flex items-center mb-4 md:mb-0">
														<div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 mr-4 transition-transform duration-300 hover:rotate-12 shadow-sm">
															{category.icon}
														</div>
														<div>
															<h3 className="text-lg font-semibold text-gray-900 mb-1">
																{category.name}
															</h3>
															<div className="flex items-center flex-wrap gap-2">
																<span className="text-sm text-gray-500 flex items-center">
																	<FiGlobe className="mr-1 h-3 w-3" />
																	{category.language}
																</span>
																<span className="mx-2 text-gray-300 hidden md:inline">
																	•
																</span>
																<span
																	className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
																		category.level === "beginner"
																			? "bg-green-100 text-green-800"
																			: category.level === "intermediate"
																			? "bg-yellow-100 text-yellow-800"
																			: "bg-red-100 text-red-800"
																	}`}
																>
																	{category.level.charAt(0).toUpperCase() +
																		category.level.slice(1)}
																</span>
															</div>
														</div>
													</div>

													<div className="flex flex-wrap items-center gap-2">
														<div className="flex items-center text-sm">
															<span className="text-gray-500 flex items-center">
																<FiBook className="mr-1 h-3 w-3" />
																{totalWords} words
															</span>
														</div>

														<span className="mx-2 text-gray-300 hidden md:inline">
															•
														</span>

														<div className="flex items-center text-sm">
															<span className="text-gray-500 flex items-center">
																<FiAward className="mr-1 h-3 w-3" />
																{categoryProgress.completedAt.length}{" "}
																{categoryProgress.completedAt.length === 1
																	? "completion"
																	: "completions"}
															</span>
														</div>
													</div>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
													<motion.div
														whileHover={{ scale: 1.03 }}
														className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 shadow-sm relative overflow-hidden"
													>
														{}
														<div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-indigo-200 opacity-30"></div>

														<p className="text-sm text-gray-700 font-medium mb-1 flex items-center">
															<span className="bg-indigo-200 w-2 h-2 rounded-full mr-2"></span>
															Progress
														</p>

														<div className="flex justify-between items-end">
															<p className="text-2xl font-bold text-indigo-700">
																{progressPercentage}%
															</p>
															<div className="text-xs text-indigo-600 font-medium bg-white px-2 py-1 rounded-md shadow-sm">
																{Math.round(progressPercentage / 10)}/10
															</div>
														</div>

														<div className="mt-3 w-full bg-white rounded-full h-2.5 overflow-hidden">
															<motion.div
																initial={{ width: 0 }}
																animate={{ width: `${progressPercentage}%` }}
																transition={{ duration: 0.8, ease: "easeOut" }}
																className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full"
															></motion.div>
														</div>
													</motion.div>

													<motion.div
														whileHover={{ scale: 1.03 }}
														className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm relative overflow-hidden"
													>
														{}
														<div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-purple-200 opacity-30"></div>

														<p className="text-sm text-gray-700 font-medium mb-1 flex items-center">
															<span className="bg-purple-300 w-2 h-2 rounded-full mr-2"></span>
															Accuracy
														</p>

														<div className="flex justify-between items-end">
															<p className="text-2xl font-bold text-purple-700">
																{accuracy}%
															</p>
															<div className="flex items-center">
																{[...Array(5)].map((_, i) => (
																	<span
																		key={i}
																		className={`text-xs ${
																			i < stars
																				? "text-yellow-400"
																				: "text-gray-300"
																		}`}
																	>
																		★
																	</span>
																))}
															</div>
														</div>

														<div className="mt-3 w-full bg-white rounded-full h-2.5 overflow-hidden">
															<motion.div
																initial={{ width: 0 }}
																animate={{ width: `${accuracy}%` }}
																transition={{ duration: 0.8, ease: "easeOut" }}
																className={`h-2.5 rounded-full ${
																	accuracy >= 80
																		? "bg-gradient-to-r from-green-400 to-green-500"
																		: accuracy >= 50
																		? "bg-gradient-to-r from-yellow-400 to-yellow-500"
																		: "bg-gradient-to-r from-red-400 to-red-500"
																}`}
															></motion.div>
														</div>
													</motion.div>

													<motion.div
														whileHover={{ scale: 1.03 }}
														className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm relative overflow-hidden"
													>
														{}
														<div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-blue-200 opacity-30"></div>

														<p className="text-sm text-gray-700 font-medium mb-1 flex items-center">
															<span className="bg-blue-300 w-2 h-2 rounded-full mr-2"></span>
															Best Time
														</p>

														<div className="flex flex-col">
															<p className="text-2xl font-bold text-blue-700 flex items-center">
																{categoryProgress.bestTime
																	? formatTime(categoryProgress.bestTime)
																	: "N/A"}
																{categoryProgress.bestTime && (
																	<FiClock className="ml-2 h-4 w-4 text-blue-500" />
																)}
															</p>

															{categoryProgress.bestTime && (
																<div className="text-xs text-blue-600 mt-1 flex items-center">
																	<FiTrendingUp className="mr-1 h-3 w-3" />
																	Avg:{" "}
																	{formatTime(
																		Math.round(categoryProgress.bestTime * 1.2)
																	)}
																</div>
															)}
														</div>

														{}
														{categoryProgress.bestTime && (
															<div className="mt-2 flex space-x-1">
																{[...Array(5)].map((_, i) => (
																	<div
																		key={i}
																		className={`h-3 flex-1 rounded-sm ${
																			i < 3
																				? "bg-blue-300"
																				: "bg-blue-200 bg-opacity-50"
																		}`}
																	></div>
																))}
															</div>
														)}
													</motion.div>
												</div>

												<div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-gray-100">
													<div>
														<div className="text-xs text-gray-500">
															Last practiced:{" "}
															{categoryProgress.completedAt.length > 0
																? new Date(
																		categoryProgress.completedAt[
																			categoryProgress.completedAt.length - 1
																		]
																  ).toLocaleDateString()
																: "Never"}
														</div>
													</div>

													<motion.button
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														onClick={() => startGame(category)}
														className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center text-sm font-medium"
													>
														Practice Again
														<FiChevronRight className="ml-1 h-4 w-4" />
													</motion.button>
												</div>
											</div>
										</motion.div>
									);
								})}
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);

	const renderSettingsView = () => (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-3xl font-bold text-gray-900 mb-8 flex items-center"
			>
				<span className="inline-block mr-3 w-6 h-1 bg-indigo-600 rounded-full"></span>
				Settings
			</motion.h1>

			<div className="space-y-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
				>
					<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
						<FiSettings className="text-indigo-600 mr-2 h-5 w-5" />
						Game Preferences
					</h2>

					<div className="space-y-8">
						<div className="bg-gray-50 p-5 rounded-lg">
							<h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
								<FiClock className="text-indigo-600 mr-2 h-5 w-5" />
								Game Mode
							</h3>
							<div className="flex items-center">
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={timedMode}
										onChange={() => setTimedMode(!timedMode)}
										className="sr-only peer"
									/>
									<div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition-colors duration-300">
										<span
											className={`absolute top-[2px] left-[2px] bg-white rounded-full transition-transform duration-300 w-5 h-5 shadow-md ${
												timedMode ? "translate-x-5" : "translate-x-0"
											}`}
										></span>
									</div>
									<span className="ml-3 text-gray-700">
										Timed Practice Mode
									</span>
								</label>
							</div>

							{timedMode && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
									className="mt-4 pl-6 border-l-2 border-indigo-100 pt-2"
								>
									<h4 className="text-sm font-medium text-gray-700 mb-3">
										Difficulty Level
									</h4>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
										{(["easy", "medium", "hard"] as const).map((level) => (
											<div
												key={level}
												onClick={() => setDifficulty(level)}
												className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
													difficulty === level
														? "bg-indigo-100 border border-indigo-200 shadow-sm"
														: "bg-white border border-gray-200 hover:border-indigo-200"
												}`}
											>
												<input
													type="radio"
													name="difficulty"
													checked={difficulty === level}
													onChange={() => setDifficulty(level)}
													className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
												/>
												<div className="ml-3">
													<span className="text-sm font-medium capitalize block">
														{level}
													</span>
													<span className="text-xs text-gray-500">
														{timeLimits[level]} seconds
													</span>
												</div>
											</div>
										))}
									</div>
								</motion.div>
							)}
						</div>

						<div className="bg-gray-50 p-5 rounded-lg">
							<h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
								<FiGrid className="text-indigo-600 mr-2 h-5 w-5" />
								Display
							</h3>
							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium text-gray-700 mb-3 block">
										Theme
									</label>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
										{(["light", "dark", "system"] as const).map(
											(themeOption) => (
												<div
													key={themeOption}
													onClick={() => setTheme(themeOption)}
													className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
														theme === themeOption
															? "bg-indigo-100 border border-indigo-200 shadow-sm"
															: "bg-white border border-gray-200 hover:border-indigo-200"
													}`}
												>
													<input
														type="radio"
														name="theme"
														checked={theme === themeOption}
														onChange={() => setTheme(themeOption)}
														className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
													/>
													<span className="ml-2 capitalize text-sm font-medium">
														{themeOption}
													</span>
												</div>
											)
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
				>
					<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
						<FiAlertTriangle className="text-indigo-600 mr-2 h-5 w-5" />
						Data Management
					</h2>

					<div className="space-y-4">
						<div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500 mb-4">
							<p className="text-gray-700">
								Your progress is automatically saved in your browser. You can
								reset your progress data below if needed.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => {
									if (
										window.confirm(
											"Are you sure you want to reset all progress data? This action cannot be undone."
										)
									) {
										setProgress({});
									}
								}}
								className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md bg-white text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all duration-300"
							>
								<FiAlertTriangle className="h-4 w-4 mr-2" />
								Reset All Progress
							</motion.button>

							<p className="text-xs text-gray-500 flex items-center">
								<FiRefreshCw className="h-3 w-3 mr-1 text-indigo-400" />
								Last saved: {new Date().toLocaleString()}
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
				>
					<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
						<FiHelpCircle className="text-indigo-600 mr-2 h-5 w-5" />
						About VocaMatch
					</h2>

					<div className="space-y-4">
						<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-lg">
							<p className="text-gray-700">
								VocaMatch is an interactive vocabulary learning application
								designed to help you master new words through engaging matching
								exercises. Perfect for language learners of all levels.
							</p>
						</div>

						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500 flex items-center">
								<FiLink className="h-4 w-4 mr-1" /> Version 1.2.0
							</span>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300 flex items-center"
							>
								Check for Updates
								<FiChevronRight className="ml-1 h-4 w-4" />
							</motion.button>
						</div>

						<div className="pt-4 mt-4 border-t border-gray-100 flex justify-center gap-4">
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
							>
								<FiMessageSquare className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
							>
								<FiHeart className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
							>
								<FiShare2 className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
							>
								<FiMail className="h-5 w-5" />
							</a>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{loading ? (
				<LoadingScreen />
			) : (
				<>
					{currentView !== "landing" && <Header />}

					<main ref={mainRef} className="flex-grow">
						{showInstructions && renderInstructionsModal()}

						{currentView === "landing" && <LandingPage />}
						{currentView === "home" && renderHomePage()}
						{currentView === "game" && selectedCategory && renderGameBoard()}
						{currentView === "stats" && renderStatisticsView()}
						{currentView === "settings" && renderSettingsView()}
					</main>

					{currentView !== "landing" && <Footer />}

					{}
					<canvas
						ref={confettiCanvasRef}
						className="fixed pointer-events-none inset-0 z-50"
						style={{ width: "100vw", height: "100vh" }}
					/>

					<style jsx global>
						{`
							:root {
								--primary: #4f46e5;
								--primary-hover: #4338ca;
								--primary-light: #e0e7ff;
								--primary-dark: #3730a3;
								--secondary: #8b5cf6;
								--accent: #d946ef;
							}

							html {
								scroll-behavior: smooth;
							}

							body {
								font-family: "Poppins",
									"Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
									"Helvetica Neue", sans-serif;
							}

							.dark-theme {
								--bg-primary: #111827;
								--bg-secondary: #1f2937;
								--text-primary: #f9fafb;
								--text-secondary: #e5e7eb;
							}

							button,
							a {
								cursor: pointer;
							}
						`}
					</style>
				</>
			)}
		</div>
	);
};

export default function VocavularyAppExport() {
	return (
		<main className="min-h-screen">
			<VocabularyMatchingGame />
		</main>
	);
}
