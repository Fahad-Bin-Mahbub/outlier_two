"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Toaster, toast } from "react-hot-toast";

interface Flashcard {
	id: string;
	question: string;
	answer: string;
	lastReviewed?: Date;
	difficulty?: "easy" | "medium" | "hard";
}

interface QuizQuestion {
	id: string;
	question: string;
	options: string[];
	correctAnswer: string;
}

interface StudySet {
	id: string;
	title: string;
	description: string;
	category: string;
	flashcards: Flashcard[];
	quizQuestions: QuizQuestion[];
	createdAt: Date;
	updatedAt: Date;
	coverImage?: string;
}

interface User {
	id: string;
	name: string;
	email: string;
	progress: {
		[studySetId: string]: {
			flashcardsProgress: number;
			quizProgress: number;
		};
	};
	settings: {
		theme: "light" | "dark";
		notifications: boolean;
	};
}

interface AppContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	studySets: StudySet[];
	setStudySets: (sets: StudySet[]) => void;
	isDarkMode: boolean;
	toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};

const sampleStudySets: StudySet[] = [
	{
		id: "set1",
		title: "JavaScript Fundamentals",
		description: "Core concepts of JavaScript programming language",
		category: "Programming",
		flashcards: [
			{
				id: "card1",
				question: "What is a closure in JavaScript?",
				answer:
					"A closure is the combination of a function bundled together with references to its surrounding state.",
				difficulty: "medium",
			},
			{
				id: "card2",
				question: "Explain hoisting in JavaScript",
				answer:
					"Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope.",
				difficulty: "medium",
			},
			{
				id: "card3",
				question: "What is the difference between let and var?",
				answer:
					"let is block-scoped while var is function-scoped. let was introduced in ES6.",
				difficulty: "easy",
			},
		],
		quizQuestions: [
			{
				id: "quiz1",
				question:
					"Which keyword is used to declare a variable with block scope?",
				options: ["var", "let", "const", "function"],
				correctAnswer: "let",
			},
			{
				id: "quiz2",
				question: "What does the === operator check for?",
				options: [
					"Value equality",
					"Value and type equality",
					"Reference equality",
					"None of the above",
				],
				correctAnswer: "Value and type equality",
			},
		],
		createdAt: new Date("2023-01-01"),
		updatedAt: new Date("2023-01-10"),
		coverImage:
			"https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1470&auto=format&fit=crop",
	},
	{
		id: "set2",
		title: "Spanish Vocabulary: Basics",
		description: "Essential Spanish words for beginners",
		category: "Languages",
		flashcards: [
			{
				id: "card1",
				question: 'How do you say "hello" in Spanish?',
				answer: "Hola",
				difficulty: "easy",
			},
			{
				id: "card2",
				question: 'How do you say "thank you" in Spanish?',
				answer: "Gracias",
				difficulty: "easy",
			},
			{
				id: "card3",
				question: 'How do you say "goodbye" in Spanish?',
				answer: "Adiós",
				difficulty: "easy",
			},
		],
		quizQuestions: [
			{
				id: "quiz1",
				question: 'What is "hello" in Spanish?',
				options: ["Bonjour", "Hola", "Ciao", "Hallo"],
				correctAnswer: "Hola",
			},
			{
				id: "quiz2",
				question: 'What is "goodbye" in Spanish?',
				options: ["Adiós", "Au revoir", "Arrivederci", "Auf Wiedersehen"],
				correctAnswer: "Adiós",
			},
		],
		createdAt: new Date("2023-02-01"),
		updatedAt: new Date("2023-02-15"),
		coverImage:
			"https://images.unsplash.com/photo-1551972873-b7e8754e8e26?q=80&w=1374&auto=format&fit=crop",
	},
	{
		id: "set3",
		title: "World Geography",
		description: "Countries, capitals, and landmarks",
		category: "Geography",
		flashcards: [
			{
				id: "card1",
				question: "What is the capital of France?",
				answer: "Paris",
				difficulty: "easy",
			},
			{
				id: "card2",
				question: "What is the largest ocean on Earth?",
				answer: "Pacific Ocean",
				difficulty: "easy",
			},
			{
				id: "card3",
				question: "Which continent is Egypt located in?",
				answer: "Africa",
				difficulty: "easy",
			},
		],
		quizQuestions: [
			{
				id: "quiz1",
				question: "What is the capital of Japan?",
				options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
				correctAnswer: "Tokyo",
			},
			{
				id: "quiz2",
				question: "Which mountain range separates Europe from Asia?",
				options: ["Alps", "Andes", "Himalayas", "Ural Mountains"],
				correctAnswer: "Ural Mountains",
			},
		],
		createdAt: new Date("2023-03-01"),
		updatedAt: new Date("2023-03-20"),
		coverImage:
			"https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1376&auto=format&fit=crop",
	},
];

const sampleUser: User = {
	id: "user1",
	name: "John Doe",
	email: "john@example.com",
	progress: {
		set1: {
			flashcardsProgress: 30,
			quizProgress: 50,
		},
		set2: {
			flashcardsProgress: 60,
			quizProgress: 0,
		},
	},
	settings: {
		theme: "light",
		notifications: true,
	},
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const formatDate = (date: Date) => {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const Navbar = () => {
	const { user, isDarkMode, toggleTheme } = useAppContext();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
			} shadow-md transition-all duration-300 ease-in-out`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<motion.div
							className="flex-shrink-0 flex items-center"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="text-xl font-bold">
								Rapid<span className="text-indigo-600">Learn</span>
							</span>
						</motion.div>
						<div className="hidden md:ml-6 md:flex md:space-x-8">
							<NavLink href="#dashboard">Dashboard</NavLink>
							<NavLink href="#explore">Explore</NavLink>
							<NavLink href="#create">Create</NavLink>
						</div>
					</div>
					<div className="flex items-center">
						<button
							onClick={toggleTheme}
							className={`p-2 rounded-full cursor-pointer ${
								isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
							} transition-colors duration-200`}
							aria-label="Toggle dark mode"
						>
							{isDarkMode ? (
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
								</svg>
							) : (
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
								</svg>
							)}
						</button>
						<div className="ml-3 relative">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<button
									onClick={() => setIsMenuOpen(!isMenuOpen)}
									className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									id="user-menu"
									aria-expanded="false"
									aria-haspopup="true"
								>
									<span className="sr-only">Open user menu</span>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center ${
											isDarkMode ? "bg-gray-700" : "bg-indigo-100"
										}`}
									>
										<span className="text-sm font-medium">
											{user?.name.charAt(0).toUpperCase() || "G"}
										</span>
									</div>
								</button>
							</motion.div>
							<AnimatePresence>
								{isMenuOpen && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95, y: -10 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.95, y: -10 }}
										transition={{ duration: 0.1 }}
										className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
											isDarkMode ? "bg-gray-800" : "bg-white"
										} ring-1 ring-black ring-opacity-5 focus:outline-none`}
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="user-menu"
									>
										<a
											href="#profile"
											className={`block px-4 py-2 text-sm ${
												isDarkMode
													? "text-gray-300 hover:bg-gray-700"
													: "text-gray-700 hover:bg-gray-100"
											} cursor-pointer`}
											role="menuitem"
										>
											Your Profile
										</a>
										<a
											href="#settings"
											className={`block px-4 py-2 text-sm ${
												isDarkMode
													? "text-gray-300 hover:bg-gray-700"
													: "text-gray-700 hover:bg-gray-100"
											} cursor-pointer`}
											role="menuitem"
										>
											Settings
										</a>
										<a
											href="#signout"
											className={`block px-4 py-2 text-sm ${
												isDarkMode
													? "text-gray-300 hover:bg-gray-700"
													: "text-gray-700 hover:bg-gray-100"
											} cursor-pointer`}
											role="menuitem"
										>
											Sign out
										</a>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						<div className="ml-4 md:hidden flex items-center">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className={`inline-flex items-center justify-center p-2 rounded-md ${
									isDarkMode
										? "text-gray-400 hover:text-white hover:bg-gray-700"
										: "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
								} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
								aria-expanded="false"
							>
								<span className="sr-only">Open main menu</span>
								<svg
									className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
								<svg
									className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden"
						id="mobile-menu"
					>
						<div
							className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
								isDarkMode ? "bg-gray-900" : "bg-white"
							}`}
						>
							<a
								href="#dashboard"
								className={`block px-3 py-2 rounded-md text-base font-medium ${
									isDarkMode
										? "text-white bg-gray-800"
										: "text-gray-800 bg-gray-100"
								} cursor-pointer`}
							>
								Dashboard
							</a>
							<a
								href="#explore"
								className={`block px-3 py-2 rounded-md text-base font-medium ${
									isDarkMode
										? "text-gray-300 hover:bg-gray-700 hover:text-white"
										: "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
								} cursor-pointer`}
							>
								Explore
							</a>
							<a
								href="#create"
								className={`block px-3 py-2 rounded-md text-base font-medium ${
									isDarkMode
										? "text-gray-300 hover:bg-gray-700 hover:text-white"
										: "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
								} cursor-pointer`}
							>
								Create
							</a>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

const NavLink = ({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) => {
	const { isDarkMode } = useAppContext();
	return (
		<a
			href={href}
			className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
				isDarkMode
					? "text-gray-300 border-transparent hover:border-gray-300 hover:text-white"
					: "text-gray-500 border-transparent hover:border-gray-300 hover:text-gray-700"
			} cursor-pointer h-full transition-colors duration-200`}
		>
			{children}
		</a>
	);
};

const Hero = () => {
	const { isDarkMode } = useAppContext();

	return (
		<div
			className={`py-12 px-4 sm:px-6 lg:px-8 ${
				isDarkMode
					? "bg-gray-900 text-white"
					: "bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-800"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="grid md:grid-cols-2 gap-8 items-center">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
							Learn Faster,{" "}
							<span className="text-indigo-600">Remember Longer</span>
						</h1>
						<p
							className={`text-lg sm:text-xl mb-6 ${
								isDarkMode ? "text-gray-300" : "text-gray-600"
							}`}
						>
							Master any subject with personalized learning tools. Create custom
							flashcards, take quizzes, and track your progress.
						</p>
						<div className="flex flex-wrap gap-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-6 py-3 text-base font-medium rounded-md shadow bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
							>
								Get Started
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className={`px-6 py-3 text-base font-medium rounded-md ${
									isDarkMode
										? "bg-gray-800 text-white hover:bg-gray-700"
										: "bg-white text-indigo-600 hover:bg-gray-50"
								} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer`}
							>
								Explore Sets
							</motion.button>
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="relative h-64 sm:h-72 md:h-80 lg:h-96"
					>
						<div className="absolute inset-0 rounded-lg overflow-hidden shadow-xl">
							<img
								src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop"
								alt="Student studying with flashcards"
								className="w-full h-full object-cover"
							/>
						</div>
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.5 }}
							className={`absolute -bottom-6 -right-6 p-4 rounded-lg shadow-lg ${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} max-w-xs`}
						>
							<div className="flex items-center space-x-2">
								<div className="flex-shrink-0">
									<div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
										<svg
											className="h-5 w-5 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium">
										90% of users improve test scores by 20% or more
									</p>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

const Statistics = () => {
	const { isDarkMode } = useAppContext();
	const stats = [
		{ id: 1, name: "Active users", value: "1M+" },
		{ id: 2, name: "Study sets", value: "5M+" },
		{ id: 3, name: "Flashcards reviewed", value: "1B+" },
		{ id: 4, name: "Countries", value: "150+" },
	];

	return (
		<div
			className={`py-12 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-800" : "bg-indigo-700"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
					{stats.map((stat) => (
						<motion.div
							key={stat.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: stat.id * 0.1 }}
							viewport={{ once: true }}
							className={`px-4 py-6 rounded-lg ${
								isDarkMode ? "bg-gray-700" : "bg-indigo-800"
							} shadow-md`}
						>
							<dt className="text-sm font-medium text-gray-200">{stat.name}</dt>
							<dd className="mt-2 text-3xl font-extrabold text-white">
								{stat.value}
							</dd>
						</motion.div>
					))}
				</dl>
			</div>
		</div>
	);
};

const StudySetCard = ({ studySet }: { studySet: StudySet }) => {
	const { isDarkMode, user } = useAppContext();
	const progress = user?.progress[studySet.id];

	return (
		<motion.div
			whileHover={{
				y: -5,
				boxShadow:
					"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
			}}
			transition={{ duration: 0.2 }}
			className={`rounded-xl overflow-hidden shadow-md ${
				isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
			} cursor-pointer`}
		>
			<div className="h-40 relative">
				<img
					src={
						studySet.coverImage ||
						"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1373&auto=format&fit=crop"
					}
					alt={studySet.title}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
				<div className="absolute bottom-3 left-3 right-3">
					<span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-indigo-600 text-white mb-2">
						{studySet.category}
					</span>
					<h3 className="text-xl font-bold text-white">{studySet.title}</h3>
				</div>
			</div>
			<div className="p-4">
				<p
					className={`text-sm mb-4 ${
						isDarkMode ? "text-gray-300" : "text-gray-600"
					}`}
				>
					{studySet.description}
				</p>
				<div className="flex items-center justify-between">
					<div>
						<div className="flex items-center space-x-1 text-sm">
							<span className="font-medium">{studySet.flashcards.length}</span>
							<span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
								Cards
							</span>
						</div>
						<div className="flex items-center space-x-1 text-sm mt-1">
							<span className="font-medium">
								{studySet.quizQuestions.length}
							</span>
							<span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
								Quiz Questions
							</span>
						</div>
					</div>
					{progress && (
						<div className="text-right">
							<div className="text-sm font-medium">Progress</div>
							<div className="mt-1 h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-green-500"
									style={{
										width: `${
											(progress.flashcardsProgress + progress.quizProgress) / 2
										}%`,
									}}
								></div>
							</div>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

const StudySetList = () => {
	const { studySets, isDarkMode } = useAppContext();
	const [filter, setFilter] = useState("all");
	const categories = [
		"all",
		...Array.from(new Set(studySets.map((set) => set.category.toLowerCase()))),
	];

	const filteredSets =
		filter === "all"
			? studySets
			: studySets.filter((set) => set.category.toLowerCase() === filter);

	return (
		<div
			className={`py-12 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-wrap items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">Study Sets</h2>
					<div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setFilter(category)}
								className={`px-3 py-1 text-sm rounded-full cursor-pointer ${
									filter === category
										? isDarkMode
											? "bg-indigo-600 text-white"
											: "bg-indigo-600 text-white"
										: isDarkMode
										? "bg-gray-800 text-gray-300 hover:bg-gray-700"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								} transition-colors duration-200`}
							>
								{category.charAt(0).toUpperCase() + category.slice(1)}
							</button>
						))}
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredSets.map((studySet) => (
						<StudySetCard key={studySet.id} studySet={studySet} />
					))}
				</div>
			</div>
		</div>
	);
};

const FlashcardSection = () => {
	const { studySets, isDarkMode } = useAppContext();
	const [currentSetIndex, setCurrentSetIndex] = useState(0);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [studyMode, setStudyMode] = useState<"review" | "quiz">("review");

	const currentSet = studySets[currentSetIndex];
	const currentCard = currentSet?.flashcards[currentCardIndex];

	const handleNext = () => {
		setIsFlipped(false);
		setTimeout(() => {
			if (currentCardIndex < currentSet.flashcards.length - 1) {
				setCurrentCardIndex(currentCardIndex + 1);
			} else {
				toast.success("Completed flashcard set!");

				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 },
				});
				setCurrentCardIndex(0);
			}
		}, 300);
	};

	const handlePrev = () => {
		setIsFlipped(false);
		setTimeout(() => {
			if (currentCardIndex > 0) {
				setCurrentCardIndex(currentCardIndex - 1);
			}
		}, 300);
	};

	const handleSetChange = (index: number) => {
		setCurrentSetIndex(index);
		setCurrentCardIndex(0);
		setIsFlipped(false);
	};

	return (
		<div
			className={`py-12 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-4">Study Flashcards</h2>
					<div className="flex flex-wrap gap-2 mb-6">
						{studySets.map((set, index) => (
							<button
								key={set.id}
								onClick={() => handleSetChange(index)}
								className={`px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
									currentSetIndex === index
										? "bg-indigo-600 text-white"
										: isDarkMode
										? "bg-gray-800 text-gray-300 hover:bg-gray-700"
										: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
								}`}
							>
								{set.title}
							</button>
						))}
					</div>
					<div className="flex gap-4 mb-6">
						<button
							onClick={() => setStudyMode("review")}
							className={`px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
								studyMode === "review"
									? "bg-indigo-600 text-white"
									: isDarkMode
									? "bg-gray-800 text-gray-300 hover:bg-gray-700"
									: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
							}`}
						>
							Review Flashcards
						</button>
						<button
							onClick={() => setStudyMode("quiz")}
							className={`px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
								studyMode === "quiz"
									? "bg-indigo-600 text-white"
									: isDarkMode
									? "bg-gray-800 text-gray-300 hover:bg-gray-700"
									: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
							}`}
						>
							Take Quiz
						</button>
					</div>
				</div>

				{studyMode === "review" && currentCard && (
					<div>
						<div className="flex justify-center">
							<motion.div
								className={`w-full max-w-2xl h-64 sm:h-80 ${
									isDarkMode ? "bg-gray-800" : "bg-white"
								} rounded-xl shadow-lg cursor-pointer perspective-1000`}
								onClick={() => setIsFlipped(!isFlipped)}
								animate={{ rotateY: isFlipped ? 180 : 0 }}
								transition={{ duration: 0.6 }}
							>
								<div className="relative w-full h-full">
									<div
										className={`absolute inset-0 backface-hidden p-8 flex items-center justify-center rounded-xl ${
											isDarkMode ? "bg-gray-800" : "bg-white"
										} ${isFlipped ? "opacity-0" : "opacity-100"}`}
									>
										<div className="text-center">
											<span className="block text-sm font-medium mb-2 text-indigo-600">
												Question
											</span>
											<h3
												className={`text-xl sm:text-2xl font-bold ${
													isDarkMode ? "text-white" : "text-gray-800"
												}`}
											>
												{currentCard.question}
											</h3>
											<div
												className={`mt-4 text-sm ${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Click to reveal answer
											</div>
										</div>
									</div>
									<div
										className={`absolute inset-0 backface-hidden p-8 flex items-center justify-center rounded-xl ${
											isDarkMode ? "bg-gray-800" : "bg-white"
										} ${isFlipped ? "opacity-100" : "opacity-0"}`}
										style={{ transform: "rotateY(180deg)" }}
									>
										<div className="text-center">
											<span className="block text-sm font-medium mb-2 text-green-600">
												Answer
											</span>
											<p
												className={`text-xl sm:text-2xl font-bold ${
													isDarkMode ? "text-white" : "text-gray-800"
												}`}
											>
												{currentCard.answer}
											</p>
											<div
												className={`mt-4 text-sm ${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Click to see question
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
						<div className="mt-8 flex justify-center gap-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handlePrev}
								disabled={currentCardIndex === 0}
								className={`px-6 py-2 rounded-md ${
									currentCardIndex === 0
										? isDarkMode
											? "bg-gray-700 text-gray-500 cursor-not-allowed"
											: "bg-gray-200 text-gray-400 cursor-not-allowed"
										: isDarkMode
										? "bg-gray-700 text-white hover:bg-gray-600"
										: "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
								} cursor-pointer shadow-sm`}
							>
								Previous
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleNext}
								className={`px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-sm`}
							>
								{currentCardIndex === currentSet.flashcards.length - 1
									? "Finish"
									: "Next"}
							</motion.button>
						</div>
						<div className="mt-4 flex justify-center">
							<div className="text-sm">
								Card {currentCardIndex + 1} of {currentSet.flashcards.length}
							</div>
						</div>
					</div>
				)}

				{studyMode === "quiz" && currentSet.quizQuestions.length > 0 && (
					<QuizComponent studySet={currentSet} />
				)}
			</div>
		</div>
	);
};

const QuizComponent = ({ studySet }: { studySet: StudySet }) => {
	const { isDarkMode } = useAppContext();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isAnswered, setIsAnswered] = useState(false);
	const [score, setScore] = useState(0);
	const [quizCompleted, setQuizCompleted] = useState(false);

	const currentQuestion = studySet.quizQuestions[currentQuestionIndex];

	const handleAnswerSelect = (answer: string) => {
		if (isAnswered) return;

		setSelectedAnswer(answer);
		setIsAnswered(true);

		if (answer === currentQuestion.correctAnswer) {
			setScore(score + 1);

			confetti({
				particleCount: 30,
				spread: 50,
				origin: { y: 0.7 },
			});
		}
	};

	const handleNext = () => {
		if (currentQuestionIndex < studySet.quizQuestions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
			setSelectedAnswer(null);
			setIsAnswered(false);
		} else {
			setQuizCompleted(true);

			confetti({
				particleCount: 200,
				spread: 90,
				origin: { y: 0.6 },
			});
		}
	};

	const handleRestart = () => {
		setCurrentQuestionIndex(0);
		setSelectedAnswer(null);
		setIsAnswered(false);
		setScore(0);
		setQuizCompleted(false);
	};

	if (quizCompleted) {
		const percentage = Math.round(
			(score / studySet.quizQuestions.length) * 100
		);

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className={`max-w-2xl mx-auto p-8 rounded-xl shadow-lg ${
					isDarkMode ? "bg-gray-800" : "bg-white"
				}`}
			>
				<h3 className="text-2xl font-bold text-center mb-6">Quiz Results</h3>
				<div className="flex justify-center mb-8">
					<div className="relative w-40 h-40">
						<svg viewBox="0 0 100 100" className="w-full h-full">
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke={isDarkMode ? "#374151" : "#e5e7eb"}
								strokeWidth="8"
							/>
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke={
									percentage >= 70
										? "#10B981"
										: percentage >= 40
										? "#F59E0B"
										: "#EF4444"
								}
								strokeWidth="8"
								strokeDasharray={`${percentage * 2.83}, 283`}
								strokeLinecap="round"
								transform="rotate(-90 50 50)"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-3xl font-bold">{percentage}%</span>
						</div>
					</div>
				</div>
				<p className="text-center text-lg mb-4">
					You scored {score} out of {studySet.quizQuestions.length}
				</p>
				<p
					className={`text-center mb-8 ${
						percentage >= 70
							? "text-green-500"
							: percentage >= 40
							? "text-yellow-500"
							: "text-red-500"
					}`}
				>
					{percentage >= 90
						? "Excellent! You've mastered this content!"
						: percentage >= 70
						? "Great job! You're doing well!"
						: percentage >= 40
						? "Good effort! Keep practicing to improve."
						: "You might need to review this material more."}
				</p>
				<div className="flex justify-center gap-4">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleRestart}
						className="px-6 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
					>
						Try Again
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {}}
						className={`px-6 py-3 rounded-md ${
							isDarkMode
								? "bg-gray-700 text-white hover:bg-gray-600"
								: "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
						} cursor-pointer`}
					>
						Review Flashcards
					</motion.button>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto">
			<div
				className={`p-6 rounded-xl shadow-lg ${
					isDarkMode ? "bg-gray-800" : "bg-white"
				}`}
			>
				<div className="flex justify-between items-center mb-6">
					<span
						className={`text-sm font-medium ${
							isDarkMode ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Question {currentQuestionIndex + 1} of{" "}
						{studySet.quizQuestions.length}
					</span>
					<span
						className={`text-sm font-medium ${
							isDarkMode ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
					</span>
				</div>
				<h3 className="text-xl font-bold mb-6">{currentQuestion.question}</h3>
				<div className="space-y-3">
					{currentQuestion.options.map((option, index) => (
						<motion.button
							key={index}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => handleAnswerSelect(option)}
							className={`w-full p-4 text-left rounded-lg cursor-pointer transition-all duration-200 ${
								!isAnswered
									? isDarkMode
										? "bg-gray-700 hover:bg-gray-600"
										: "bg-gray-100 hover:bg-gray-200"
									: option === currentQuestion.correctAnswer
									? "bg-green-500 text-white"
									: option === selectedAnswer
									? "bg-red-500 text-white"
									: isDarkMode
									? "bg-gray-700"
									: "bg-gray-100"
							}`}
						>
							<div className="flex items-center">
								<span className="w-8 h-8 flex items-center justify-center rounded-full mr-3 bg-indigo-100 text-indigo-800 font-medium">
									{String.fromCharCode(65 + index)}
								</span>
								<span>{option}</span>
								{isAnswered && option === currentQuestion.correctAnswer && (
									<svg
										className="ml-auto w-6 h-6 text-white"
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
								)}
								{isAnswered &&
									option === selectedAnswer &&
									option !== currentQuestion.correctAnswer && (
										<svg
											className="ml-auto w-6 h-6 text-white"
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
									)}
							</div>
						</motion.button>
					))}
				</div>
				{isAnswered && (
					<div className="mt-6 flex justify-end">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleNext}
							className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
						>
							{currentQuestionIndex === studySet.quizQuestions.length - 1
								? "Finish Quiz"
								: "Next Question"}
						</motion.button>
					</div>
				)}
			</div>
			<div className="mt-6 relative pt-1">
				<div className="flex mb-2 items-center justify-between">
					<div>
						<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-800">
							Quiz Progress
						</span>
					</div>
				</div>
				<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
					<div
						style={{
							width: `${
								((currentQuestionIndex + (isAnswered ? 1 : 0)) /
									studySet.quizQuestions.length) *
								100
							}%`,
						}}
						className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
					></div>
				</div>
			</div>
		</div>
	);
};

const CreateSetForm = () => {
	const { isDarkMode, studySets, setStudySets } = useAppContext();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [flashcards, setFlashcards] = useState<Omit<Flashcard, "id">[]>([
		{ question: "", answer: "" },
	]);
	const [quizQuestions, setQuizQuestions] = useState<
		Omit<QuizQuestion, "id">[]
	>([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
	const [coverImage, setCoverImage] = useState(
		"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1373&auto=format&fit=crop"
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddFlashcard = () => {
		setFlashcards([...flashcards, { question: "", answer: "" }]);
	};

	const handleRemoveFlashcard = (index: number) => {
		if (flashcards.length > 1) {
			const newFlashcards = [...flashcards];
			newFlashcards.splice(index, 1);
			setFlashcards(newFlashcards);
		}
	};

	const handleFlashcardChange = (
		index: number,
		field: "question" | "answer",
		value: string
	) => {
		const newFlashcards = [...flashcards];
		newFlashcards[index][field] = value;
		setFlashcards(newFlashcards);
	};

	const handleAddQuizQuestion = () => {
		setQuizQuestions([
			...quizQuestions,
			{ question: "", options: ["", "", "", ""], correctAnswer: "" },
		]);
	};

	const handleRemoveQuizQuestion = (index: number) => {
		if (quizQuestions.length > 1) {
			const newQuizQuestions = [...quizQuestions];
			newQuizQuestions.splice(index, 1);
			setQuizQuestions(newQuizQuestions);
		}
	};

	const handleQuizQuestionChange = (
		index: number,
		field: "question",
		value: string
	) => {
		const newQuizQuestions = [...quizQuestions];
		newQuizQuestions[index][field] = value;
		setQuizQuestions(newQuizQuestions);
	};

	const handleOptionChange = (
		questionIndex: number,
		optionIndex: number,
		value: string
	) => {
		const newQuizQuestions = [...quizQuestions];
		newQuizQuestions[questionIndex].options[optionIndex] = value;
		setQuizQuestions(newQuizQuestions);
	};

	const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
		const newQuizQuestions = [...quizQuestions];
		newQuizQuestions[questionIndex].correctAnswer = value;
		setQuizQuestions(newQuizQuestions);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !description || !category) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (flashcards.some((card) => !card.question || !card.answer)) {
			toast.error("Please complete all flashcards");
			return;
		}

		if (
			quizQuestions.some(
				(q) => !q.question || q.options.some((opt) => !opt) || !q.correctAnswer
			)
		) {
			toast.error("Please complete all quiz questions");
			return;
		}

		setIsSubmitting(true);

		const newStudySet: StudySet = {
			id: generateId(),
			title,
			description,
			category,
			flashcards: flashcards.map((card) => ({ id: generateId(), ...card })),
			quizQuestions: quizQuestions.map((q) => ({ id: generateId(), ...q })),
			createdAt: new Date(),
			updatedAt: new Date(),
			coverImage,
		};

		setTimeout(() => {
			setStudySets([...studySets, newStudySet]);
			setIsSubmitting(false);

			setTitle("");
			setDescription("");
			setCategory("");
			setFlashcards([{ question: "", answer: "" }]);
			setQuizQuestions([
				{ question: "", options: ["", "", "", ""], correctAnswer: "" },
			]);

			toast.success("Study set created successfully!");
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		}, 1500);
	};

	const coverImages = [
		"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1373&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1503428593586-e225b39bddfe?q=80&w=1470&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1528&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop",
	];

	return (
		<div
			className={`py-12 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
			}`}
		>
			<div className="max-w-4xl mx-auto">
				<h2 className="text-2xl font-bold mb-6">Create New Study Set</h2>
				<form onSubmit={handleSubmit}>
					<div
						className={`p-6 rounded-xl shadow-lg mb-8 ${
							isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
						}`}
					>
						<h3 className="text-xl font-medium mb-4">Basic Information</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Title</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className={`w-full px-4 py-2 rounded-md border ${
										isDarkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
									placeholder="e.g., Spanish Vocabulary"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Description
								</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className={`w-full px-4 py-2 rounded-md border ${
										isDarkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
									placeholder="Brief description of your study set"
									rows={3}
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Category
								</label>
								<input
									type="text"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className={`w-full px-4 py-2 rounded-md border ${
										isDarkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
									placeholder="e.g., Languages, Programming, Science"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">
									Cover Image
								</label>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
									{coverImages.map((image, index) => (
										<div
											key={index}
											className={`relative rounded-lg overflow-hidden cursor-pointer h-20 ${
												coverImage === image ? "ring-2 ring-indigo-500" : ""
											}`}
											onClick={() => setCoverImage(image)}
										>
											<img
												src={image}
												alt={`Cover option ${index + 1}`}
												className="w-full h-full object-cover"
											/>
											{coverImage === image && (
												<div className="absolute inset-0 bg-indigo-500 bg-opacity-40 flex items-center justify-center">
													<svg
														className="w-6 h-6 text-white"
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
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div
						className={`p-6 rounded-xl shadow-lg mb-8 ${
							isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
						}`}
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-medium">Flashcards</h3>
							<motion.button
								type="button"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleAddFlashcard}
								className={`px-3 py-1 rounded-md text-sm ${
									isDarkMode
										? "bg-gray-700 hover:bg-gray-600 text-white"
										: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
								} cursor-pointer`}
							>
								+ Add Card
							</motion.button>
						</div>
						<div className="space-y-6">
							{flashcards.map((card, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className={`p-4 rounded-lg ${
										isDarkMode ? "bg-gray-700" : "bg-gray-50"
									} relative`}
								>
									<div className="absolute -top-2 -right-2">
										<button
											type="button"
											onClick={() => handleRemoveFlashcard(index)}
											className={`w-6 h-6 rounded-full flex items-center justify-center ${
												isDarkMode
													? "bg-gray-600 hover:bg-gray-500 text-white"
													: "bg-gray-200 hover:bg-gray-300 text-gray-700"
											} cursor-pointer`}
											disabled={flashcards.length === 1}
										>
											<svg
												className="w-4 h-4"
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
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium mb-1">
												Question
											</label>
											<textarea
												value={card.question}
												onChange={(e) =>
													handleFlashcardChange(
														index,
														"question",
														e.target.value
													)
												}
												className={`w-full px-4 py-2 rounded-md border ${
													isDarkMode
														? "bg-gray-600 border-gray-500 text-white"
														: "bg-white border-gray-300 text-gray-900"
												} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
												placeholder="Enter your question"
												rows={3}
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium mb-1">
												Answer
											</label>
											<textarea
												value={card.answer}
												onChange={(e) =>
													handleFlashcardChange(index, "answer", e.target.value)
												}
												className={`w-full px-4 py-2 rounded-md border ${
													isDarkMode
														? "bg-gray-600 border-gray-500 text-white"
														: "bg-white border-gray-300 text-gray-900"
												} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
												placeholder="Enter your answer"
												rows={3}
												required
											/>
										</div>
									</div>
									<div className="mt-2 text-right">
										<span
											className={`text-xs ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Card {index + 1} of {flashcards.length}
										</span>
									</div>
								</motion.div>
							))}
						</div>
					</div>

					<div
						className={`p-6 rounded-xl shadow-lg mb-8 ${
							isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
						}`}
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-medium">Quiz Questions</h3>
							<motion.button
								type="button"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleAddQuizQuestion}
								className={`px-3 py-1 rounded-md text-sm ${
									isDarkMode
										? "bg-gray-700 hover:bg-gray-600 text-white"
										: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
								} cursor-pointer`}
							>
								+ Add Question
							</motion.button>
						</div>
						<div className="space-y-8">
							{quizQuestions.map((quizQuestion, qIndex) => (
								<motion.div
									key={qIndex}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className={`p-4 rounded-lg ${
										isDarkMode ? "bg-gray-700" : "bg-gray-50"
									} relative`}
								>
									<div className="absolute -top-2 -right-2">
										<button
											type="button"
											onClick={() => handleRemoveQuizQuestion(qIndex)}
											className={`w-6 h-6 rounded-full flex items-center justify-center ${
												isDarkMode
													? "bg-gray-600 hover:bg-gray-500 text-white"
													: "bg-gray-200 hover:bg-gray-300 text-gray-700"
											} cursor-pointer`}
											disabled={quizQuestions.length === 1}
										>
											<svg
												className="w-4 h-4"
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
									<div className="mb-4">
										<label className="block text-sm font-medium mb-1">
											Question
										</label>
										<textarea
											value={quizQuestion.question}
											onChange={(e) =>
												handleQuizQuestionChange(
													qIndex,
													"question",
													e.target.value
												)
											}
											className={`w-full px-4 py-2 rounded-md border ${
												isDarkMode
													? "bg-gray-600 border-gray-500 text-white"
													: "bg-white border-gray-300 text-gray-900"
											} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
											placeholder="Enter your question"
											rows={2}
											required
										/>
									</div>
									<div className="mb-4">
										<label className="block text-sm font-medium mb-2">
											Options
										</label>
										<div className="space-y-2">
											{quizQuestion.options.map((option, oIndex) => (
												<div key={oIndex} className="flex items-center">
													<span className="w-8 h-8 flex items-center justify-center rounded-full mr-2 bg-indigo-100 text-indigo-800 font-medium">
														{String.fromCharCode(65 + oIndex)}
													</span>
													<input
														type="text"
														value={option}
														onChange={(e) =>
															handleOptionChange(qIndex, oIndex, e.target.value)
														}
														className={`flex-1 px-4 py-2 rounded-md border ${
															isDarkMode
																? "bg-gray-600 border-gray-500 text-white"
																: "bg-white border-gray-300 text-gray-900"
														} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
														placeholder={`Option ${String.fromCharCode(
															65 + oIndex
														)}`}
														required
													/>
												</div>
											))}
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1">
											Correct Answer
										</label>
										<select
											value={quizQuestion.correctAnswer}
											onChange={(e) =>
												handleCorrectAnswerChange(qIndex, e.target.value)
											}
											className={`w-full px-4 py-2 rounded-md border ${
												isDarkMode
													? "bg-gray-600 border-gray-500 text-white"
													: "bg-white border-gray-300 text-gray-900"
											} focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer`}
											required
										>
											<option value="">Select correct answer</option>
											{quizQuestion.options.map(
												(option, oIndex) =>
													option && (
														<option key={oIndex} value={option}>
															{option}
														</option>
													)
											)}
										</select>
									</div>
									<div className="mt-2 text-right">
										<span
											className={`text-xs ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Question {qIndex + 1} of {quizQuestions.length}
										</span>
									</div>
								</motion.div>
							))}
						</div>
					</div>

					<div className="flex justify-end">
						<motion.button
							type="submit"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							disabled={isSubmitting}
							className={`px-6 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
								isSubmitting ? "opacity-70 cursor-not-allowed" : ""
							}`}
						>
							{isSubmitting ? (
								<div className="flex items-center">
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									<span>Creating...</span>
								</div>
							) : (
								"Create Study Set"
							)}
						</motion.button>
					</div>
				</form>
			</div>
		</div>
	);
};

const Features = () => {
	const { isDarkMode } = useAppContext();
	const features = [
		{
			name: "Customizable Study Sets",
			description:
				"Create your own study sets with flashcards and quizzes to match your learning style.",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
			),
		},
		{
			name: "Interactive Flashcards",
			description:
				"Flip through digital flashcards that help you memorize concepts and terms effectively.",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
			),
		},
		{
			name: "Adaptive Quizzes",
			description:
				"Test your knowledge with quizzes that adapt to your learning progress and identify gaps.",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
		},
		{
			name: "Progress Tracking",
			description:
				"Monitor your learning journey with detailed progress tracking and analytics.",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
			),
		},
	];

	return (
		<div
			className={`py-16 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-extrabold sm:text-4xl">
						Features that make learning easier
					</h2>
					<p
						className={`mt-4 text-lg ${
							isDarkMode ? "text-gray-300" : "text-gray-600"
						} max-w-3xl mx-auto`}
					>
						Our platform is designed to help you learn and retain information
						more effectively with these powerful features.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							className={`p-6 rounded-xl ${
								isDarkMode ? "bg-gray-700" : "bg-white"
							} shadow-md`}
						>
							<div
								className={`w-12 h-12 rounded-md ${
									isDarkMode ? "bg-indigo-500" : "bg-indigo-100"
								} flex items-center justify-center mb-4`}
							>
								<span className={isDarkMode ? "text-white" : "text-indigo-600"}>
									{feature.icon}
								</span>
							</div>
							<h3 className="text-xl font-bold mb-2">{feature.name}</h3>
							<p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

const Testimonials = () => {
	const { isDarkMode } = useAppContext();
	const testimonials = [
		{
			content:
				"RapidLearn transformed the way I study for medical school. The interactive flashcards and quizzes have made memorizing complex terms so much easier!",
			author: "Dr. Sarah Johnson",
			role: "Medical Student",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
		},
		{
			content:
				"As a language teacher, I recommend RapidLearn to all my students. Creating custom study sets has helped them master vocabulary much faster.",
			author: "Miguel Cervantes",
			role: "Spanish Teacher",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
		},
		{
			content:
				"The tracking features help me identify what I need to focus on. My test scores have improved by 30% since I started using this platform!",
			author: "Emily Zhang",
			role: "College Student",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop",
		},
	];

	return (
		<div
			className={`py-16 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-extrabold sm:text-4xl">
						What our users say
					</h2>
					<p
						className={`mt-4 text-lg ${
							isDarkMode ? "text-gray-300" : "text-gray-600"
						} max-w-3xl mx-auto`}
					>
						Join thousands of students and educators who have transformed their
						learning experience.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							className={`p-6 rounded-xl ${
								isDarkMode ? "bg-gray-800" : "bg-gray-50"
							} shadow-md`}
						>
							<div className="mb-4">
								<svg
									className={`h-8 w-8 ${
										isDarkMode ? "text-indigo-400" : "text-indigo-500"
									}`}
									fill="currentColor"
									viewBox="0 0 32 32"
								>
									<path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
								</svg>
							</div>
							<p
								className={`mb-6 text-lg ${
									isDarkMode ? "text-gray-300" : "text-gray-600"
								}`}
							>
								{testimonial.content}
							</p>
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<img
										className="h-10 w-10 rounded-full object-cover"
										src={testimonial.avatar}
										alt={testimonial.author}
									/>
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium">{testimonial.author}</p>
									<p
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										{testimonial.role}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

const Footer = () => {
	const { isDarkMode } = useAppContext();

	return (
		<footer
			className={`py-12 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1 md:col-span-1">
						<div className="flex items-center">
							<span className="text-xl font-bold">
								Rapid<span className="text-indigo-600">Learn</span>
							</span>
						</div>
						<p className="mt-2 text-sm">
							The modern way to learn and retain information. Create custom
							flashcards, take quizzes, and track your progress.
						</p>
						<div className="mt-4 flex space-x-4">
							<a
								href="#"
								className={`text-gray-400 hover:text-gray-300 cursor-pointer`}
							>
								<svg
									className="h-6 w-6"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
								</svg>
							</a>
							<a
								href="#"
								className={`text-gray-400 hover:text-gray-300 cursor-pointer`}
							>
								<svg
									className="h-6 w-6"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
								</svg>
							</a>
							<a
								href="#"
								className={`text-gray-400 hover:text-gray-300 cursor-pointer`}
							>
								<svg
									className="h-6 w-6"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
								</svg>
							</a>
						</div>
					</div>
					<div>
						<h3
							className={`text-sm font-semibold ${
								isDarkMode ? "text-white" : "text-gray-900"
							} tracking-wider uppercase`}
						>
							Product
						</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									FAQ
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									For Educators
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3
							className={`text-sm font-semibold ${
								isDarkMode ? "text-white" : "text-gray-900"
							} tracking-wider uppercase`}
						>
							Company
						</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									About
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									Careers
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									Blog
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>
					component
					<div>
						<h3
							className={`text-sm font-semibold ${
								isDarkMode ? "text-white" : "text-gray-900"
							} tracking-wider uppercase`}
						>
							Legal
						</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									Cookie Policy
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm hover:text-indigo-500 cursor-pointer"
								>
									GDPR
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-8 pt-8 border-t border-gray-700">
					<p className="text-sm text-center">
						&copy; {new Date().getFullYear()} RapidLearn. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

const Newsletter = () => {
	const { isDarkMode } = useAppContext();
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setIsSubmitting(true);

		setTimeout(() => {
			setIsSubmitting(false);
			setIsSubscribed(true);
			setEmail("");
			toast.success("Successfully subscribed to newsletter!");
		}, 1500);
	};

	return (
		<div
			className={`py-12 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-800 text-white" : "bg-indigo-50 text-gray-800"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="text-center">
					<h2 className="text-3xl font-extrabold sm:text-4xl mb-4">
						Stay updated with our latest features
					</h2>
					<p
						className={`text-lg ${
							isDarkMode ? "text-gray-300" : "text-gray-600"
						} max-w-2xl mx-auto mb-8`}
					>
						Join our newsletter to receive tips, study techniques, and be the
						first to know about new learning tools.
					</p>
					{!isSubscribed ? (
						<form onSubmit={handleSubmit} className="max-w-md mx-auto">
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className={`flex-1 px-4 py-3 rounded-md border ${
										isDarkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
									required
								/>
								<motion.button
									type="submit"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									disabled={isSubmitting}
									className={`px-6 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
										isSubmitting ? "opacity-70 cursor-not-allowed" : ""
									}`}
								>
									{isSubmitting ? (
										<div className="flex items-center">
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											<span>Subscribing...</span>
										</div>
									) : (
										"Subscribe"
									)}
								</motion.button>
							</div>
						</form>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className={`max-w-md mx-auto p-4 rounded-md ${
								isDarkMode ? "bg-gray-700" : "bg-white"
							} shadow-md`}
						>
							<div className="flex items-center text-green-500 mb-2">
								<svg
									className="w-6 h-6 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="text-lg font-medium">
									Thank you for subscribing!
								</span>
							</div>
							<p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
								You'll now receive our latest updates and learning resources
								directly to your inbox.
							</p>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

const FAQ = () => {
	const { isDarkMode } = useAppContext();
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const faqs = [
		{
			question: "How do I create my own study set?",
			answer:
				"Click on the 'Create' tab in the navigation menu. Fill in the details about your study set, add flashcards with questions and answers, and create quiz questions. Once finished, click 'Create Study Set' to save it to your account.",
		},
		{
			question: "Can I share my study sets with others?",
			answer:
				"Yes! Each study set has a share button that generates a unique link. You can send this link to friends, classmates, or anyone you want to share your study materials with.",
		},
		{
			question: "Is there a limit to how many flashcards I can create?",
			answer:
				"The free plan allows up to 50 flashcards per study set and 10 study sets total. Premium accounts have unlimited flashcards and study sets.",
		},
		{
			question: "How does the progress tracking work?",
			answer:
				"Our system tracks how many times you've reviewed each flashcard and your performance in quizzes. It uses this data to calculate your mastery level for each study set and suggests which areas need more practice.",
		},
		{
			question: "Can I use this on my mobile device?",
			answer:
				"Absolutely! Our platform is fully responsive and works on all devices including smartphones and tablets. We also offer dedicated mobile apps for iOS and Android for an optimized mobile experience.",
		},
	];

	const toggleFAQ = (index: number) => {
		if (activeIndex === index) {
			setActiveIndex(null);
		} else {
			setActiveIndex(index);
		}
	};

	return (
		<div
			className={`py-12 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
			}`}
		>
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-extrabold sm:text-4xl">
						Frequently Asked Questions
					</h2>
					<p
						className={`mt-4 text-lg ${
							isDarkMode ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Can't find the answer you're looking for? Contact our support team.
					</p>
				</div>
				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<div
							key={index}
							className={`rounded-lg shadow-md overflow-hidden ${
								isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
							}`}
						>
							<button
								onClick={() => toggleFAQ(index)}
								className={`w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none cursor-pointer`}
							>
								<span className="text-lg font-medium">{faq.question}</span>
								<svg
									className={`w-5 h-5 transform transition-transform duration-200 ${
										activeIndex === index ? "rotate-180" : ""
									}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<motion.div
								initial={false}
								animate={{
									height: activeIndex === index ? "auto" : 0,
									opacity: activeIndex === index ? 1 : 0,
								}}
								transition={{ duration: 0.3 }}
								className="overflow-hidden"
							>
								<div
									className={`px-6 pb-4 ${
										activeIndex === index ? "block" : "hidden"
									}`}
								>
									<p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
										{faq.answer}
									</p>
								</div>
							</motion.div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const CTA = () => {
	const { isDarkMode } = useAppContext();

	return (
		<div
			className={`py-16 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-indigo-900" : "bg-indigo-700"
			} text-white`}
		>
			<div className="max-w-5xl mx-auto text-center">
				<h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
					Ready to transform your learning experience?
				</h2>
				<p className="text-xl mb-8 max-w-2xl mx-auto">
					Join thousands of students who have already improved their study
					habits and test scores with RapidLearn.
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="px-8 py-4 text-lg font-medium rounded-md shadow-lg bg-white text-indigo-700 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Get Started for Free
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="px-8 py-4 text-lg font-medium rounded-md shadow-lg bg-indigo-800 text-white hover:bg-indigo-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						View Demo
					</motion.button>
				</div>
			</div>
		</div>
	);
};

const App = () => {
	const [user, setUser] = useState<User | null>(sampleUser);
	const [studySets, setStudySets] = useState<StudySet[]>(sampleStudySets);
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark") {
			setIsDarkMode(true);
			document.documentElement.classList.add("dark");
		}
	}, []);

	useEffect(() => {
		if (isDarkMode) {
			localStorage.setItem("theme", "dark");
			document.documentElement.classList.add("dark");
		} else {
			localStorage.setItem("theme", "light");
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<AppContext.Provider
			value={{
				user,
				setUser,
				studySets,
				setStudySets,
				isDarkMode,
				toggleTheme,
			}}
		>
			<div
				className={`min-h-screen transition-colors duration-300 ${
					isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
				}`}
			>
				<Navbar />
				<div className="pt-16">
					{" "}
					{}
					<Hero />
					<Statistics />
					<StudySetList />
					<Features />
					<FlashcardSection />
					<Testimonials />
					<CreateSetForm />
					<FAQ />
					<Newsletter />
					<CTA />
					<Footer />
				</div>
				<Toaster
					position="bottom-right"
					toastOptions={{
						style: {
							background: isDarkMode ? "#374151" : "#ffffff",
							color: isDarkMode ? "#ffffff" : "#1f2937",
						},
					}}
				/>
			</div>
		</AppContext.Provider>
	);
};

export default App;
