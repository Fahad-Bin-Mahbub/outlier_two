"use client";
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";

import {
	FaVolumeUp,
	FaCheck,
	FaClock,
	FaTimes,
	FaExclamationTriangle,
	FaArrowRight,
	FaArrowLeft,
	FaAdjust,
	FaUser,
	FaBars,
	FaTrophy,
	FaGraduationCap,
	FaHome,
	FaBookOpen,
	FaChartLine,
	FaCog,
	FaGlobe,
	FaSignOutAlt,
	FaCalendarCheck,
	FaDownload,
	FaChartBar,
	FaBookmark,
	FaStar,
	FaStarHalfAlt,
	FaLightbulb,
	FaQuestionCircle,
	FaPlayCircle,
	FaMicrophone,
	FaExchangeAlt,
	FaLayerGroup,
	FaSmile,
	FaSadTear,
	FaListUl,
	FaSearch,
	FaEllipsisH,
	FaCheckCircle,
	FaCircle,
	FaAngleDown,
} from "react-icons/fa";

interface WordData {
	id: number;
	word: string;
	translation: string;
	imageUrl: string;
	pronunciation: string;
	example: string;
	difficulty: "beginner" | "intermediate" | "advanced";
	category: string;
	synonyms?: string[];
	contextSentences?: string[];
	usageNotes?: string;
	commonMistakes?: string;
	progressLevel?: number;
}

interface UserProgress {
	known: number[];
	learning: number[];
	new: number[];
	streakDays: number;
	lastPractice: string;
	completedExercises: number;
	totalTimeSpent: number;
	proficiencyScore: number;
	masteredCategories: string[];
	learningGoals: {
		wordsPerDay: number;
		minutesPerDay: number;
		currentGoalStreak: number;
	};
	completedLessons: number[];
	achievements: Achievement[];
}

interface Achievement {
	id: number;
	name: string;
	description: string;
	icon: any;
	dateEarned: string;
	progress?: {
		current: number;
		total: number;
	};
	isCompleted: boolean;
}

interface Lesson {
	id: number;
	title: string;
	description: string;
	wordIds: number[];
	exercises: Exercise[];
	difficulty: "beginner" | "intermediate" | "advanced";
	estimatedTime: number;
	category: string;
	completionRate?: number;
}

interface Exercise {
	id: number;
	type: ExerciseType;
	wordIds: number[];
	instructions: string;
	points: number;
}

interface Language {
	id: string;
	name: string;
	flag: string;
	isAvailable: boolean;
	vocabularyCount: number;
}

interface Theme {
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	textColor: string;
	backgroundColor: string;
	cardColor: string;
}

interface StudyStats {
	date: string;
	wordsLearned: number;
	timeSpent: number;
	exercisesCompleted: number;
}

interface UserSettings {
	dailyGoal: number;
	reminderTime: string;
	emailNotifications: boolean;
	audioEnabled: boolean;
	animationsEnabled: boolean;
	theme: "default" | "light" | "blue" | "green";
	fontSize: "small" | "medium" | "large";
}

type ExerciseType =
	| "flashcard"
	| "matching"
	| "fillInBlanks"
	| "multipleChoice"
	| "listening"
	| "speaking"
	| "sentence"
	| "quiz";

const languageData: WordData[] = [
	{
		id: 1,
		word: "Bonjour",
		translation: "Hello",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1661644923181-d962fcdce882?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		pronunciation: "bon-zhoor",
		example: "Bonjour, comment allez-vous?",
		difficulty: "beginner",
		category: "greetings",
		synonyms: ["Salut", "Coucou", "Allô"],
		contextSentences: [
			"Bonjour tout le monde!",
			"Bonjour, je m'appelle Marie.",
		],
		usageNotes: "Formal greeting used during the day until evening.",
		progressLevel: 0,
	},
	{
		id: 2,
		word: "Merci",
		translation: "Thank you",
		imageUrl:
			"https://images.unsplash.com/photo-1586769506823-483a8228a6eb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		pronunciation: "mer-see",
		example: "Merci beaucoup pour votre aide.",
		difficulty: "beginner",
		category: "greetings",
		synonyms: ["Je vous remercie"],
		contextSentences: ["Merci de votre patience.", "Merci pour tout."],
		usageNotes: "Can be used in both formal and informal contexts.",
		progressLevel: 0,
	},
	{
		id: 3,
		word: "Livre",
		translation: "Book",
		imageUrl:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "lee-vruh",
		example: "J'ai lu un livre intéressant.",
		difficulty: "beginner",
		category: "objects",
		synonyms: ["Bouquin", "Ouvrage"],
		contextSentences: [
			"Ce livre est fascinant.",
			"Peux-tu me prêter ce livre?",
		],
		usageNotes: "Also means 'pound' (unit of weight) in certain contexts.",
		progressLevel: 0,
	},
	{
		id: 4,
		word: "Maison",
		translation: "House",
		imageUrl:
			"https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "may-zon",
		example: "Ma maison est près de la plage.",
		difficulty: "beginner",
		category: "places",
		synonyms: ["Demeure", "Habitation", "Foyer"],
		contextSentences: [
			"Bienvenue dans ma maison.",
			"Cette maison est ancienne.",
		],
		usageNotes: "Also used in 'à la maison' (at home).",
		progressLevel: 0,
	},
	{
		id: 5,
		word: "Boulangerie",
		translation: "Bakery",
		imageUrl:
			"https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "boo-lahn-zhuh-ree",
		example: "La boulangerie vend du pain frais.",
		difficulty: "intermediate",
		category: "places",
		synonyms: ["Pâtisserie"],
		contextSentences: [
			"Allons à la boulangerie.",
			"Cette boulangerie fait de délicieux croissants.",
		],
		usageNotes:
			"Specifically a place that sells bread, while 'pâtisserie' sells pastries.",
		progressLevel: 0,
	},
	{
		id: 6,
		word: "Appétit",
		translation: "Appetite",
		imageUrl:
			"https://images.unsplash.com/photo-1547573854-74d2a71d0826?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "ah-pey-tee",
		example: "Bon appétit!",
		difficulty: "intermediate",
		category: "food",
		synonyms: ["Faim"],
		contextSentences: [
			"J'ai un bon appétit aujourd'hui.",
			"Tu as perdu l'appétit?",
		],
		usageNotes: "Common in the phrase 'Bon appétit' before eating.",
		progressLevel: 0,
	},
	{
		id: 7,
		word: "Félicitations",
		translation: "Congratulations",
		imageUrl:
			"https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "fey-lee-see-tah-see-ohn",
		example: "Félicitations pour votre réussite!",
		difficulty: "advanced",
		category: "expressions",
		synonyms: ["Bravo", "Tous mes compliments"],
		contextSentences: [
			"Félicitations pour votre mariage!",
			"Je vous adresse mes félicitations.",
		],
		usageNotes: "Used to congratulate someone on achievements or life events.",
		progressLevel: 0,
	},
	{
		id: 8,
		word: "Environnement",
		translation: "Environment",
		imageUrl:
			"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "ahn-vee-ron-nuh-mahn",
		example: "Nous devons protéger l'environnement.",
		difficulty: "advanced",
		category: "nature",
		synonyms: ["Milieu", "Écosystème"],
		contextSentences: [
			"L'environnement est notre responsabilité collective.",
			"Comment pouvons-nous améliorer notre environnement?",
		],
		usageNotes: "Often used in contexts of ecological conservation.",
		progressLevel: 0,
	},
	{
		id: 9,
		word: "Voyage",
		translation: "Journey/Travel",
		imageUrl:
			"https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "voy-ahzh",
		example: "J'adore faire des voyage à l'étranger.",
		difficulty: "beginner",
		category: "travel",
		synonyms: ["Périple", "Déplacement", "Excursion"],
		contextSentences: ["Bon voyage!", "Le voyage a duré trois heures."],
		usageNotes:
			"Can refer to both the act of traveling and the journey itself.",
		progressLevel: 0,
	},
	{
		id: 10,
		word: "Rendez-vous",
		translation: "Appointment/Date",
		imageUrl:
			"https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "rahn-day-voo",
		example: "J'ai un rendez-vous chez le médecin demain.",
		difficulty: "intermediate",
		category: "expressions",
		synonyms: ["Entrevue", "Réunion"],
		contextSentences: [
			"Pouvons-nous fixer un rendez-vous?",
			"Elle a manqué son rendez-vous.",
		],
		usageNotes:
			"Can refer to a business appointment, medical appointment, or romantic date.",
		progressLevel: 0,
	},
	{
		id: 11,
		word: "Développement",
		translation: "Development",
		imageUrl:
			"https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "day-vel-op-mahn",
		example: "Le développement durable est important.",
		difficulty: "advanced",
		category: "business",
		synonyms: ["Évolution", "Croissance", "Progrès"],
		contextSentences: [
			"Le développement de cette technologie prendra du temps.",
			"Nous sommes en phase de développement.",
		],
		usageNotes:
			"Used in various contexts such as business, personal growth, and sustainability.",
		progressLevel: 0,
	},
	{
		id: 12,
		word: "Parapluie",
		translation: "Umbrella",
		imageUrl:
			"https://images.unsplash.com/photo-1538038329441-4d2b0620499a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		pronunciation: "par-ah-ploo-ee",
		example: "N'oubliez pas votre parapluie, il va pleuvoir.",
		difficulty: "intermediate",
		category: "objects",
		synonyms: ["Pépin", "Riflard"],
		contextSentences: ["Ce parapluie est cassé.", "J'ai oublié mon parapluie."],
		usageNotes: "Combines 'parer' (to protect) and 'pluie' (rain).",
		progressLevel: 0,
	},
];

const lessonsData: Lesson[] = [
	{
		id: 1,
		title: "Basic Greetings",
		description:
			"Learn the essential French greetings to start conversations confidently.",
		wordIds: [1, 2],
		exercises: [
			{
				id: 1,
				type: "flashcard",
				wordIds: [1, 2],
				instructions: "Review these greeting words using flashcards",
				points: 10,
			},
			{
				id: 2,
				type: "matching",
				wordIds: [1, 2],
				instructions:
					"Match the French greetings with their English translations",
				points: 15,
			},
		],
		difficulty: "beginner",
		estimatedTime: 10,
		category: "greetings",
		completionRate: 0,
	},
	{
		id: 2,
		title: "Everyday Objects",
		description: "Learn common objects you'll encounter in daily life.",
		wordIds: [3, 12],
		exercises: [
			{
				id: 3,
				type: "flashcard",
				wordIds: [3, 12],
				instructions: "Review these everyday objects using flashcards",
				points: 10,
			},
			{
				id: 4,
				type: "fillInBlanks",
				wordIds: [3, 12],
				instructions: "Complete sentences with the correct object names",
				points: 20,
			},
		],
		difficulty: "beginner",
		estimatedTime: 15,
		category: "objects",
		completionRate: 0,
	},
	{
		id: 3,
		title: "Places Around Town",
		description: "Learn the names of common places in a French city or town.",
		wordIds: [4, 5],
		exercises: [
			{
				id: 5,
				type: "flashcard",
				wordIds: [4, 5],
				instructions: "Review these place names using flashcards",
				points: 10,
			},
			{
				id: 6,
				type: "multipleChoice",
				wordIds: [4, 5],
				instructions: "Choose the correct place name for each description",
				points: 15,
			},
		],
		difficulty: "intermediate",
		estimatedTime: 20,
		category: "places",
		completionRate: 0,
	},
	{
		id: 4,
		title: "Advanced Expressions",
		description:
			"Master sophisticated French expressions for fluent conversation.",
		wordIds: [7, 10],
		exercises: [
			{
				id: 7,
				type: "flashcard",
				wordIds: [7, 10],
				instructions: "Review these expressions using flashcards",
				points: 10,
			},
			{
				id: 8,
				type: "sentence",
				wordIds: [7, 10],
				instructions: "Create sentences using these advanced expressions",
				points: 25,
			},
		],
		difficulty: "advanced",
		estimatedTime: 30,
		category: "expressions",
		completionRate: 0,
	},
];

const availableLanguages: Language[] = [
	{
		id: "fr",
		name: "French",
		flag: "🇫🇷",
		isAvailable: true,
		vocabularyCount: 5000,
	},
	{
		id: "es",
		name: "Spanish",
		flag: "🇪🇸",
		isAvailable: true,
		vocabularyCount: 4500,
	},
	{
		id: "de",
		name: "German",
		flag: "🇩🇪",
		isAvailable: true,
		vocabularyCount: 4000,
	},
	{
		id: "it",
		name: "Italian",
		flag: "🇮🇹",
		isAvailable: true,
		vocabularyCount: 3800,
	},
	{
		id: "pt",
		name: "Portuguese",
		flag: "🇵🇹",
		isAvailable: false,
		vocabularyCount: 3200,
	},
	{
		id: "ja",
		name: "Japanese",
		flag: "🇯🇵",
		isAvailable: false,
		vocabularyCount: 2800,
	},
	{
		id: "zh",
		name: "Chinese",
		flag: "🇨🇳",
		isAvailable: false,
		vocabularyCount: 3000,
	},
	{
		id: "ru",
		name: "Russian",
		flag: "🇷🇺",
		isAvailable: false,
		vocabularyCount: 3500,
	},
];

const themeConfigs: Record<string, Theme> = {
	default: {
		primaryColor: "from-indigo-600 to-blue-500",
		secondaryColor: "indigo-600",
		accentColor: "indigo-100",
		textColor: "indigo-600",
		backgroundColor: "from-indigo-50 via-white to-blue-50",
		cardColor: "white",
	},
	light: {
		primaryColor: "from-sky-600 to-cyan-500",
		secondaryColor: "sky-600",
		accentColor: "sky-100",
		textColor: "sky-600",
		backgroundColor: "from-sky-50 via-white to-cyan-50",
		cardColor: "white",
	},
	blue: {
		primaryColor: "from-blue-600 to-indigo-500",
		secondaryColor: "blue-600",
		accentColor: "blue-100",
		textColor: "blue-600",
		backgroundColor: "from-blue-50 via-white to-indigo-50",
		cardColor: "white",
	},
	green: {
		primaryColor: "from-emerald-600 to-teal-500",
		secondaryColor: "emerald-600",
		accentColor: "emerald-100",
		textColor: "emerald-600",
		backgroundColor: "from-emerald-50 via-white to-teal-50",
		cardColor: "white",
	},
};

const initialUserProgress: UserProgress = {
	known: [1, 2],
	learning: [3, 4, 5],
	new: [6, 7, 8, 9, 10, 11, 12],
	streakDays: 3,
	lastPractice: new Date().toISOString().split("T")[0],
	completedExercises: 28,
	totalTimeSpent: 320,
	proficiencyScore: 42,
	masteredCategories: ["greetings"],
	learningGoals: {
		wordsPerDay: 5,
		minutesPerDay: 15,
		currentGoalStreak: 3,
	},
	completedLessons: [1],
	achievements: [
		{
			id: 1,
			name: "First Steps",
			description: "Complete your first lesson",
			icon: FaCheckCircle,
			dateEarned: "2025-05-20",
			isCompleted: true,
		},
		{
			id: 2,
			name: "Word Collector",
			description: "Learn 10 new words",
			icon: FaBookmark,
			progress: {
				current: 5,
				total: 10,
			},
			dateEarned: "",
			isCompleted: false,
		},
		{
			id: 3,
			name: "Consistent Learner",
			description: "Maintain a 7-day streak",
			icon: FaCalendarCheck,
			progress: {
				current: 3,
				total: 7,
			},
			dateEarned: "",
			isCompleted: false,
		},
	],
};

const initialUserSettings: UserSettings = {
	dailyGoal: 5,
	reminderTime: "18:00",
	emailNotifications: true,
	audioEnabled: true,
	animationsEnabled: true,
	theme: "default",
	fontSize: "medium",
};

const studyStats: StudyStats[] = [
	{ date: "2025-05-21", wordsLearned: 3, timeSpent: 12, exercisesCompleted: 5 },
	{ date: "2025-05-22", wordsLearned: 5, timeSpent: 18, exercisesCompleted: 7 },
	{ date: "2025-05-23", wordsLearned: 2, timeSpent: 10, exercisesCompleted: 4 },
	{ date: "2025-05-24", wordsLearned: 4, timeSpent: 15, exercisesCompleted: 6 },
	{ date: "2025-05-25", wordsLearned: 0, timeSpent: 0, exercisesCompleted: 0 },
	{ date: "2025-05-26", wordsLearned: 6, timeSpent: 22, exercisesCompleted: 8 },
	{ date: "2025-05-27", wordsLearned: 4, timeSpent: 16, exercisesCompleted: 6 },
];

const Toast: React.FC<{
	message: string;
	type: "success" | "error" | "info" | "warning";
	isVisible: boolean;
	onClose: () => void;
}> = ({ message, type, isVisible, onClose }) => {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				onClose();
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [isVisible, onClose]);

	if (!isVisible) return null;

	const getToastStyles = () => {
		switch (type) {
			case "success":
				return {
					bg: "bg-emerald-500",
					icon: FaCheck,
					shadow: "shadow-emerald-200",
				};
			case "error":
				return {
					bg: "bg-red-500",
					icon: FaTimes,
					shadow: "shadow-red-200",
				};
			case "warning":
				return {
					bg: "bg-amber-500",
					icon: FaExclamationTriangle,
					shadow: "shadow-amber-200",
				};
			default:
				return {
					bg: "bg-blue-500",
					icon: FaVolumeUp,
					shadow: "shadow-blue-200",
				};
		}
	};

	const styles = getToastStyles();

	return (
		<div
			className={`fixed bottom-4 right-4 ${styles.bg} text-white px-5 py-3 rounded-lg ${styles.shadow} shadow-lg flex items-center z-50 transform transition-all duration-300 ease-in-out translate-y-0 opacity-100`}
			role="alert"
		>
			<p className="font-medium">{message}</p>
			<button
				onClick={onClose}
				className="ml-4 text-white hover:text-gray-200 transition-colors focus:outline-none"
				aria-label="Close notification"
			>
				<FaTimes />
			</button>
		</div>
	);
};

const Modal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
}> = ({ isOpen, onClose, title, children, size = "md" }) => {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
	};

	return (
		<div
			className="fixed inset-0 z-50 overflow-y-auto"
			aria-labelledby={title}
			role="dialog"
			aria-modal="true"
		>
			<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div
					className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
					aria-hidden="true"
					onClick={onClose}
				></div>

				<span
					className="hidden sm:inline-block sm:align-middle sm:h-screen"
					aria-hidden="true"
				>
					&#8203;
				</span>

				<div
					className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full sm:p-6 p-4`}
				>
					<div className="absolute top-0 right-0 pt-4 pr-4">
						<button
							type="button"
							className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
							onClick={onClose}
							aria-label="Close"
						>
							<span className="sr-only">Close</span>
							<FaTimes className="h-6 w-6" />
						</button>
					</div>

					<div className="sm:flex sm:items-start">
						<div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
							<h3
								className="text-lg leading-6 font-medium text-gray-900 mb-4"
								id="modal-title"
							>
								{title}
							</h3>
							<div className="mt-2">{children}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const AchievementCard: React.FC<{ achievement: Achievement }> = ({
	achievement,
}) => {
	return (
		<div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
			<div className="flex items-start space-x-4">
				<div
					className={`w-12 h-12 rounded-full flex items-center justify-center ${
						achievement.isCompleted
							? "bg-emerald-100 text-emerald-600"
							: "bg-gray-100 text-gray-400"
					}`}
				>
					<achievement.icon className="text-xl" />
				</div>
				<div className="flex-1">
					<h3 className="font-medium text-gray-900">{achievement.name}</h3>
					<p className="text-sm text-gray-500">{achievement.description}</p>

					{achievement.progress && (
						<div className="mt-2">
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
									style={{
										width: `${
											(achievement.progress.current /
												achievement.progress.total) *
											100
										}%`,
									}}
								></div>
							</div>
							<p className="text-xs text-gray-500 mt-1">
								{achievement.progress.current} / {achievement.progress.total}
							</p>
						</div>
					)}

					{achievement.isCompleted && (
						<p className="text-xs text-emerald-600 mt-1 flex items-center">
							<FaCheckCircle className="mr-1" />
							Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

const LessonCard: React.FC<{
	lesson: Lesson;
	onStart: (lessonId: number) => void;
	isCompleted: boolean;
	currentTheme: Theme;
}> = ({ lesson, onStart, isCompleted, currentTheme }) => {
	return (
		<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-transform transform hover:scale-102 hover:shadow-md">
			<div
				className={`h-2 ${
					lesson.difficulty === "beginner"
						? "bg-green-500"
						: lesson.difficulty === "intermediate"
						? "bg-yellow-500"
						: "bg-red-500"
				}`}
			></div>
			<div className="p-5">
				<div className="flex justify-between items-start">
					<h3 className="font-semibold text-lg text-gray-900">
						{lesson.title}
					</h3>
					{isCompleted && (
						<span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
							Completed
						</span>
					)}
				</div>
				<p className="text-gray-600 text-sm mt-1">{lesson.description}</p>

				<div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
					<div className="flex items-center">
						<FaBookOpen className="mr-1" />
						<span>{lesson.wordIds.length} words</span>
					</div>
					<div className="flex items-center">
						<FaLayerGroup className="mr-1" />
						<span>{lesson.exercises.length} exercises</span>
					</div>
					<div className="flex items-center">
						<FaClock className="mr-1" />
						<span>{lesson.estimatedTime} min</span>
					</div>
				</div>

				<button
					onClick={() => onStart(lesson.id)}
					className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors ${
						isCompleted
							? "bg-gray-100 text-gray-700 hover:bg-gray-200"
							: `bg-gradient-to-r ${currentTheme.primaryColor} text-white hover:from-indigo-700 hover:to-blue-600`
					}`}
				>
					{isCompleted ? "Review Again" : "Start Lesson"}
				</button>
			</div>
		</div>
	);
};

const ProfileSummary: React.FC<{
	userProgress: UserProgress;
	onClose: () => void;
}> = ({ userProgress, onClose }) => {
	return (
		<div className="bg-white rounded-xl shadow-md p-6">
			<div className="flex justify-between items-start mb-6">
				<div className="flex items-center">
					<div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl">
						<FaUser />
					</div>
					<div className="ml-4">
						<h2 className="text-xl font-bold">Your Profile</h2>
						<p className="text-gray-600">French learner</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="bg-indigo-50 rounded-lg p-4 text-center">
					<div className="text-2xl font-bold text-indigo-600">
						{userProgress.streakDays}
					</div>
					<p className="text-gray-600 text-sm">Day Streak</p>
				</div>
				<div className="bg-blue-50 rounded-lg p-4 text-center">
					<div className="text-2xl font-bold text-blue-600">
						{userProgress.known.length}
					</div>
					<p className="text-gray-600 text-sm">Words Mastered</p>
				</div>
				<div className="bg-purple-50 rounded-lg p-4 text-center">
					<div className="text-2xl font-bold text-purple-600">
						{userProgress.completedExercises}
					</div>
					<p className="text-gray-600 text-sm">Exercises Done</p>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="font-medium mb-2">Proficiency Score</h3>
				<div className="w-full bg-gray-200 rounded-full h-4">
					<div
						className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full relative"
						style={{ width: `${userProgress.proficiencyScore}%` }}
					>
						<span className="absolute -right-4 top-6 text-sm font-medium">
							{userProgress.proficiencyScore}/100
						</span>
					</div>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="font-medium mb-2">Learning Goals</h3>
				<div className="flex flex-wrap text-sm gap-2">
					<span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
						{userProgress.learningGoals.wordsPerDay} words/day
					</span>
					<span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
						{userProgress.learningGoals.minutesPerDay} min/day
					</span>
					<span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
						{userProgress.learningGoals.currentGoalStreak} day goal streak
					</span>
				</div>
			</div>

			<div>
				<h3 className="font-medium mb-2">Achievements</h3>
				<div className="space-y-2">
					{userProgress.achievements.map((achievement) => (
						<div
							key={achievement.id}
							className={`flex items-center space-x-2 p-2 rounded-lg ${
								achievement.isCompleted
									? "bg-emerald-50 text-emerald-800"
									: "bg-gray-50 text-gray-600"
							}`}
						>
							<achievement.icon
								className={
									achievement.isCompleted ? "text-emerald-600" : "text-gray-400"
								}
							/>
							<span>{achievement.name}</span>
							{achievement.progress && !achievement.isCompleted && (
								<span className="text-xs">
									{achievement.progress.current}/{achievement.progress.total}
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
const Footer: React.FC<{
	currentTheme: Theme;
	onLanguageSelect: () => void;
	onSettingsOpen: () => void;
}> = ({ currentTheme, onLanguageSelect, onSettingsOpen }) => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-white border-t border-gray-200 mt-12">
			<div className="container mx-auto px-4 py-8">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="md:col-span-1">
						<div className="flex items-center space-x-2 mb-4">
							<div
								className={`bg-gradient-to-r ${currentTheme.primaryColor} text-white p-2 rounded-lg`}
							>
								<FaGraduationCap className="text-xl" />
							</div>
							<h3
								className={`text-xl font-bold bg-gradient-to-r ${currentTheme.primaryColor} bg-clip-text text-transparent`}
							>
								LinguaLearn Pro
							</h3>
						</div>
						<p className="text-gray-600 text-sm mb-4">
							Master new languages with interactive lessons, personalized
							practice, and AI-powered feedback.
						</p>
						<div className="flex space-x-3">
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors"
								aria-label="Facebook"
							>
								<FaGlobe className="text-lg" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors"
								aria-label="Twitter"
							>
								<FaGlobe className="text-lg" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors"
								aria-label="Instagram"
							>
								<FaGlobe className="text-lg" />
							</a>
						</div>
					</div>

					{/* Learning Resources */}
					<div>
						<h4 className="font-semibold text-gray-800 mb-4">Learning</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									All Languages
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Beginner Courses
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Grammar Guide
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Pronunciation Tips
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Study Plans
								</a>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className="font-semibold text-gray-800 mb-4">Support</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Help Center
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Contact Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Community Forum
								</a>
							</li>
							<li>
								<button
									onClick={onSettingsOpen}
									className="text-gray-600 hover:text-indigo-600 transition-colors text-left"
								>
									Settings
								</button>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Feedback
								</a>
							</li>
						</ul>
					</div>

					{/* Company */}
					<div>
						<h4 className="font-semibold text-gray-800 mb-4">Company</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Careers
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors"
								>
									Cookie Policy
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Language Selection Bar */}
				<div className="border-t border-gray-200 mt-8 pt-6">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<div className="flex items-center space-x-4">
							<span className="text-sm font-medium text-gray-700">
								Choose your language:
							</span>
							<button
								onClick={onLanguageSelect}
								className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
							>
								<span className="text-lg">🇫🇷</span>
								<span className="text-sm">Français</span>
								<FaAngleDown className="text-gray-400" />
							</button>
						</div>

						<div className="flex items-center space-x-6 text-sm text-gray-600">
							<div className="flex items-center space-x-1">
								<FaBookOpen className="text-indigo-600" />
								<span>Learn anywhere, anytime</span>
							</div>
							<div className="flex items-center space-x-1">
								<FaTrophy className="text-yellow-500" />
								<span>Track your progress</span>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-200 mt-6 pt-6">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<div className="text-sm text-gray-600">
							<p>© {currentYear} LinguaLearn Pro. All rights reserved.</p>
						</div>

						<div className="flex items-center space-x-6 text-sm">
							<a
								href="#"
								className="text-gray-600 hover:text-indigo-600 transition-colors"
							>
								Status
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-indigo-600 transition-colors"
							>
								Blog
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-indigo-600 transition-colors"
							>
								API
							</a>
							<div className="flex items-center space-x-1 text-gray-500">
								<span>Made with</span>
								<span className="text-red-500">❤️</span>
								<span>for language learners</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

const SettingsPanel: React.FC<{
	settings: UserSettings;
	onUpdateSettings: (settings: UserSettings) => void;
	onClose: () => void;
}> = ({ settings, onUpdateSettings, onClose }) => {
	const [updatedSettings, setUpdatedSettings] =
		useState<UserSettings>(settings);

	const handleChange = (key: keyof UserSettings, value: any) => {
		setUpdatedSettings((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = () => {
		onUpdateSettings(updatedSettings);
		onClose();
	};

	return (
		<div className="bg-white rounded-xl shadow-md p-6">
			<div className="flex items-center justify-center mb-6">
				<h2 className="text-xl font-bold">Settings</h2>
			</div>

			<div className="space-y-6">
				<div>
					<h3 className="font-medium mb-4">Learning Preferences</h3>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Daily Word Goal
							</label>
							<select
								value={updatedSettings.dailyGoal}
								onChange={(e) =>
									handleChange("dailyGoal", parseInt(e.target.value))
								}
								className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							>
								{[3, 5, 7, 10, 15].map((num) => (
									<option key={num} value={num}>
										{num} words
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Daily Reminder Time
							</label>
							<input
								type="time"
								value={updatedSettings.reminderTime}
								onChange={(e) => handleChange("reminderTime", e.target.value)}
								className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
						</div>
					</div>
				</div>

				<div>
					<h3 className="font-medium mb-4">Appearance</h3>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Theme
							</label>
							<div className="flex flex-wrap gap-2">
								{Object.keys(themeConfigs).map((theme) => (
									<button
										key={theme}
										className={`p-3 rounded-lg border ${
											updatedSettings.theme === theme
												? `border-${themeConfigs[theme].secondaryColor} bg-${themeConfigs[theme].accentColor}`
												: "border-gray-300"
										}`}
										onClick={() => handleChange("theme", theme)}
									>
										<div
											className={`h-6 w-full rounded-md bg-gradient-to-r ${themeConfigs[theme].primaryColor}`}
										></div>
										<span className="text-xs mt-1 block capitalize">
											{theme}
										</span>
									</button>
								))}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Font Size
							</label>
							<div className="flex space-x-2">
								{["small", "medium", "large"].map((size) => (
									<button
										key={size}
										className={`flex-1 py-2 px-3 rounded-lg border ${
											updatedSettings.fontSize === size
												? "border-indigo-500 bg-indigo-50 text-indigo-700"
												: "border-gray-300 text-gray-600"
										}`}
										onClick={() => handleChange("fontSize", size)}
									>
										<span
											className={`
                      ${
												size === "small"
													? "text-sm"
													: size === "medium"
													? "text-base"
													: "text-lg"
											}
                      capitalize
                    `}
										>
											{size}
										</span>
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				<div>
					<h3 className="font-medium mb-4">Notifications & Audio</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-700">Email Notifications</span>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={updatedSettings.emailNotifications}
									onChange={(e) =>
										handleChange("emailNotifications", e.target.checked)
									}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
							</label>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-700">Audio Enabled</span>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={updatedSettings.audioEnabled}
									onChange={(e) =>
										handleChange("audioEnabled", e.target.checked)
									}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
							</label>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-700">Animations Enabled</span>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={updatedSettings.animationsEnabled}
									onChange={(e) =>
										handleChange("animationsEnabled", e.target.checked)
									}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
							</label>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 flex justify-end space-x-3">
				<button
					onClick={onClose}
					className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
				>
					Cancel
				</button>
				<button
					onClick={handleSave}
					className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
				>
					Save Changes
				</button>
			</div>
		</div>
	);
};

const ActivityChart: React.FC<{
	stats: StudyStats[];
	currentTheme: Theme;
}> = ({ stats, currentTheme }) => {
	const maxWords = Math.max(...stats.map((day) => day.wordsLearned));

	return (
		<div className="bg-white rounded-xl shadow-sm p-4">
			<h3 className="text-lg font-medium text-gray-800 mb-4">
				Weekly Activity
			</h3>
			<div className="flex items-end h-40 space-x-2">
				{stats.map((day, index) => {
					const height =
						day.wordsLearned > 0 ? (day.wordsLearned / maxWords) * 100 : 0;

					const today = new Date().toISOString().split("T")[0];
					const isToday = day.date === today;

					return (
						<div key={index} className="flex-1 flex flex-col items-center">
							<div className="w-full flex justify-center mb-1">
								<div
									className={`w-full rounded-t-lg ${
										isToday
											? `bg-${currentTheme.secondaryColor}`
											: day.wordsLearned > 0
											? `bg-${currentTheme.secondaryColor}`
											: "bg-gray-200"
									}`}
									style={{ height: `${height}px` }}
								>
									{day.wordsLearned > 0 && (
										<div className="text-xs text-white text-center font-medium">
											{day.wordsLearned}
										</div>
									)}
								</div>
							</div>
							<div className="text-xs text-gray-500">
								{new Date(day.date).toLocaleDateString("en-US", {
									weekday: "short",
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const PronunciationFeedback: React.FC<{
	word: string;
	accuracy: number;
	onClose: () => void;
}> = ({ word, accuracy, onClose }) => {
	return (
		<div className="text-center">
			<div className="mb-4">
				<div className="inline-block rounded-full p-3 bg-indigo-100">
					<FaMicrophone className="text-indigo-600 text-xl" />
				</div>
			</div>

			<h3 className="text-lg font-medium mb-3">Pronunciation Feedback</h3>
			<p className="text-gray-600 mb-4">
				Here's how you did pronouncing: <strong>{word}</strong>
			</p>

			<div className="w-full bg-gray-200 rounded-full h-3 mb-4">
				<div
					className={`h-3 rounded-full ${
						accuracy >= 80
							? "bg-green-500"
							: accuracy >= 50
							? "bg-yellow-500"
							: "bg-red-500"
					}`}
					style={{ width: `${accuracy}%` }}
				></div>
			</div>

			<div className="text-lg font-medium mb-4">
				{accuracy >= 80 ? (
					<div className="text-green-600 flex items-center justify-center">
						<FaSmile className="mr-2" />
						Excellent!
					</div>
				) : accuracy >= 50 ? (
					<div className="text-yellow-600 flex items-center justify-center">
						<FaAdjust className="mr-2" />
						Getting There
					</div>
				) : (
					<div className="text-red-600 flex items-center justify-center">
						<FaSadTear className="mr-2" />
						Needs Work
					</div>
				)}
			</div>

			<div className="mt-6">
				<button
					className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
					onClick={onClose}
				>
					Continue
				</button>
			</div>
		</div>
	);
};

const Certificate: React.FC<{
	lessonTitle: string;
	completionDate: string;
	onClose: () => void;
}> = ({ lessonTitle, completionDate, onClose }) => {
	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-lg border-4 border-indigo-100">
			<div className="text-center">
				<div className="font-script text-3xl text-indigo-600 mb-3">
					Certificate of Completion
				</div>

				<div className="flex justify-center mb-4">
					<div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
						<FaTrophy className="text-indigo-600 text-2xl" />
					</div>
				</div>

				<p className="text-gray-600 mb-2">This certifies that</p>
				<p className="text-xl font-medium mb-3">Student Name</p>
				<p className="text-gray-600 mb-2">has successfully completed</p>
				<p className="text-xl font-medium mb-3">{lessonTitle}</p>
				<p className="text-gray-600 mb-2">on</p>
				<p className="text-lg mb-6">
					{new Date(completionDate).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>

				<div className="flex justify-center space-x-4 mt-6">
					<button
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
						onClick={onClose}
					>
						<FaDownload className="mr-2" />
						Download
					</button>
					<button
						className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

const LanguageSelector: React.FC<{
	languages: Language[];
	currentLanguage: string;
	onSelectLanguage: (languageId: string) => void;
	onClose: () => void;
}> = ({ languages, currentLanguage, onSelectLanguage, onClose }) => {
	return (
		<div className="space-y-4">
			<div className="flex justify-center items-center mb-4">
				<h3 className="text-lg font-medium">Choose a Language</h3>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{languages.map((language) => (
					<button
						key={language.id}
						className={`p-4 rounded-lg border text-left flex items-center ${
							language.id === currentLanguage
								? "border-indigo-500 bg-indigo-50"
								: "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
						} ${!language.isAvailable ? "opacity-60 cursor-not-allowed" : ""}`}
						onClick={() =>
							language.isAvailable && onSelectLanguage(language.id)
						}
						disabled={!language.isAvailable}
					>
						<span className="text-2xl mr-3">{language.flag}</span>
						<div className="flex-1">
							<div className="font-medium">{language.name}</div>
							<div className="text-xs text-gray-500">
								{language.vocabularyCount} words
							</div>
						</div>
						{!language.isAvailable && (
							<span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
								Coming Soon
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	);
};

const DashboardView: React.FC<{
	userProgress: UserProgress;
	studyStats: StudyStats[];
	lessons: Lesson[];
	currentTheme: Theme;
	onStartLesson: (lessonId: number) => void;
}> = ({ userProgress, studyStats, lessons, onStartLesson, currentTheme }) => {
	return (
		<div className="space-y-6">
			<div
				className={`bg-gradient-to-r ${currentTheme.primaryColor} rounded-xl p-6 text-white`}
			>
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
						<p className="opacity-90">
							Continue your language learning journey
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-center">
							<div className="text-2xl font-bold">
								{userProgress.streakDays}
							</div>
							<div className="text-xs">Day Streak</div>
						</div>
						<div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-center">
							<div className="text-2xl font-bold">
								{userProgress.completedExercises}
							</div>
							<div className="text-xs">Exercises</div>
						</div>
						<div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-center">
							<div className="text-2xl font-bold">
								{userProgress.known.length}
							</div>
							<div className="text-xs">Words Known</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm p-6">
				<h3 className="text-lg font-medium mb-4">Continue Learning</h3>

				{lessons
					.filter(
						(lesson) => !userProgress.completedLessons.includes(lesson.id)
					)
					.slice(0, 1)
					.map((lesson) => (
						<div
							key={lesson.id}
							className="border border-gray-200 rounded-xl p-4"
						>
							<div className="flex flex-col md:flex-row justify-between">
								<div>
									<div className="text-indigo-600 mb-1">Continue with</div>
									<h4 className="text-xl font-medium mb-2">{lesson.title}</h4>
									<p className="text-gray-600 text-sm mb-4">
										{lesson.description}
									</p>
									<div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
										<div className="flex items-center">
											<FaBookOpen className="mr-1" />
											<span>{lesson.wordIds.length} words</span>
										</div>
										<div className="flex items-center">
											<FaClock className="mr-1" />
											<span>{lesson.estimatedTime} min</span>
										</div>
									</div>
								</div>

								<div className="mt-4 md:mt-0 md:ml-6 flex md:flex-col items-center justify-center gap-2">
									<div className="mb-2 w-16 h-16 rounded-full flex items-center justify-center bg-indigo-100">
										<FaPlayCircle
											className={`text-${currentTheme.secondaryColor} text-xl`}
										/>
									</div>
									<button
										onClick={() => onStartLesson(lesson.id)}
										className={`bg-${currentTheme.secondaryColor} text-white px-4 py-2 rounded-lg transition-colors`}
									>
										Continue
									</button>
								</div>
							</div>
						</div>
					))}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<ActivityChart stats={studyStats} currentTheme={currentTheme} />

				<div className="bg-white rounded-xl shadow-sm p-4">
					<h3 className="text-lg font-medium text-gray-800 mb-4">
						Recent Achievements
					</h3>
					<div className="space-y-3">
						{userProgress.achievements.map((achievement) => (
							<div
								key={achievement.id}
								className={`p-3 rounded-lg border flex items-center space-x-3 ${
									achievement.isCompleted
										? "border-indigo-100 bg-indigo-50"
										: "border-gray-200"
								}`}
							>
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center ${
										achievement.isCompleted
											? `bg-indigo-100 text-${currentTheme.secondaryColor} `
											: "bg-gray-100 text-gray-400"
									}`}
								>
									<achievement.icon />
								</div>
								<div className="flex-1">
									<h4 className="font-medium">{achievement.name}</h4>
									<p className="text-xs text-gray-500">
										{achievement.description}
									</p>
								</div>
								{achievement.progress && !achievement.isCompleted && (
									<div className="text-xs text-gray-500">
										{achievement.progress.current}/{achievement.progress.total}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm p-6">
				<h3 className="text-lg font-medium mb-4">Recommended Lessons</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{lessons
						.filter(
							(lesson) => !userProgress.completedLessons.includes(lesson.id)
						)
						.slice(0, 3)
						.map((lesson) => (
							<LessonCard
								key={lesson.id}
								lesson={lesson}
								onStart={onStartLesson}
								isCompleted={userProgress.completedLessons.includes(lesson.id)}
								currentTheme={currentTheme}
							/>
						))}
				</div>
			</div>
		</div>
	);
};

const ProgressView: React.FC<{
	userProgress: UserProgress;
	studyStats: StudyStats[];
	words: WordData[];
	currentTheme: Theme;
}> = ({ userProgress, studyStats, words, currentTheme }) => {
	const totalWords = words.length;
	const knownWords = userProgress.known.length;
	const learningWords = userProgress.learning.length;
	const newWords = userProgress.new.length;

	const knownPercentage = (knownWords / totalWords) * 100;
	const learningPercentage = (learningWords / totalWords) * 100;
	const newPercentage = (newWords / totalWords) * 100;

	const totalHours = userProgress.totalTimeSpent / 60;

	const wordsByCategory = words.reduce((acc, word) => {
		if (!acc[word.category]) {
			acc[word.category] = [];
		}
		acc[word.category].push(word);
		return acc;
	}, {} as Record<string, WordData[]>);

	const categoryMastery = Object.entries(wordsByCategory)
		.map(([category, categoryWords]) => {
			const knownInCategory = categoryWords.filter((word) =>
				userProgress.known.includes(word.id)
			).length;

			return {
				category,
				totalWords: categoryWords.length,
				knownWords: knownInCategory,
				percentage: (knownInCategory / categoryWords.length) * 100,
			};
		})
		.sort((a, b) => b.percentage - a.percentage);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white rounded-xl shadow-sm p-4">
					<h3 className="text-sm font-medium text-gray-500 mb-1">
						Words Mastered
					</h3>
					<div className="text-3xl font-bold text-indigo-600">
						{knownWords}{" "}
						<span className="text-lg text-gray-400">/ {totalWords}</span>
					</div>
					<div className="mt-2 w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-indigo-600 h-2 rounded-full"
							style={{ width: `${knownPercentage}%` }}
						></div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-4">
					<h3 className="text-sm font-medium text-gray-500 mb-1">
						Learning Progress
					</h3>
					<div className="text-3xl font-bold text-yellow-500">
						{learningWords} <span className="text-lg text-gray-400">words</span>
					</div>
					<div className="mt-2 w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-yellow-500 h-2 rounded-full"
							style={{ width: `${learningPercentage}%` }}
						></div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-4">
					<h3 className="text-sm font-medium text-gray-500 mb-1">
						Time Invested
					</h3>
					<div className="text-3xl font-bold text-emerald-600">
						{totalHours.toFixed(1)}{" "}
						<span className="text-lg text-gray-400">hours</span>
					</div>
					<div className="mt-2 text-xs text-gray-500">
						Over {studyStats.filter((day) => day.timeSpent > 0).length} active
						days
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-4">
					<h3 className="text-sm font-medium text-gray-500 mb-1">Streak</h3>
					<div className="text-3xl font-bold text-purple-600">
						{userProgress.streakDays}{" "}
						<span className="text-lg text-gray-400">days</span>
					</div>
					<div className="mt-2 text-xs text-gray-500">
						Last practice:{" "}
						{new Date(userProgress.lastPractice).toLocaleDateString()}
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm p-6">
				<h3 className="text-lg font-medium mb-4">Proficiency by Category</h3>

				<div className="space-y-4">
					{categoryMastery.map((cat) => (
						<div key={cat.category} className="mb-3">
							<div className="flex justify-between items-center mb-1">
								<span className="text-sm font-medium capitalize">
									{cat.category}
								</span>
								<span className="text-sm text-gray-500">
									{cat.knownWords}/{cat.totalWords} words (
									{cat.percentage.toFixed(0)}%)
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5">
								<div
									className={`h-2.5 rounded-full ${
										cat.percentage >= 80
											? "bg-emerald-500"
											: cat.percentage >= 50
											? "bg-yellow-500"
											: "bg-red-500"
									}`}
									style={{ width: `${cat.percentage}%` }}
								></div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm p-6">
				<h3 className="text-lg font-medium mb-4">Learning Activity</h3>

				<ActivityChart stats={studyStats} currentTheme={currentTheme} />

				<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-indigo-50 rounded-lg p-4 text-center">
						<div className="text-indigo-600 text-sm font-medium mb-1">
							Total Words Learned
						</div>
						<div className="text-2xl font-bold">
							{studyStats.reduce((sum, day) => sum + day.wordsLearned, 0)}
						</div>
					</div>

					<div className="bg-blue-50 rounded-lg p-4 text-center">
						<div className="text-blue-600 text-sm font-medium mb-1">
							Average Daily Words
						</div>
						<div className="text-2xl font-bold">
							{(
								studyStats.reduce((sum, day) => sum + day.wordsLearned, 0) /
								studyStats.filter((day) => day.wordsLearned > 0).length
							).toFixed(1)}
						</div>
					</div>

					<div className="bg-purple-50 rounded-lg p-4 text-center">
						<div className="text-purple-600 text-sm font-medium mb-1">
							Total Exercises
						</div>
						<div className="text-2xl font-bold">
							{studyStats.reduce((sum, day) => sum + day.exercisesCompleted, 0)}
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm p-6">
				<h3 className="text-lg font-medium mb-4">Vocabulary Status</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<h4 className="text-sm font-medium text-emerald-600 flex items-center mb-3">
							<FaCheckCircle className="mr-2" />
							Mastered Words
						</h4>
						<div className="max-h-60 overflow-y-auto pr-2 space-y-2">
							{words
								.filter((word) => userProgress.known.includes(word.id))
								.map((word) => (
									<div
										key={word.id}
										className="p-2 bg-emerald-50 rounded-lg flex items-center"
									>
										<span className="font-medium">{word.word}</span>
										<span className="text-gray-500 text-xs ml-2">
											({word.translation})
										</span>
									</div>
								))}
						</div>
					</div>

					<div>
						<h4 className="text-sm font-medium text-yellow-600 flex items-center mb-3">
							<FaAdjust className="mr-2" />
							Learning Words
						</h4>
						<div className="max-h-60 overflow-y-auto pr-2 space-y-2">
							{words
								.filter((word) => userProgress.learning.includes(word.id))
								.map((word) => (
									<div
										key={word.id}
										className="p-2 bg-yellow-50 rounded-lg flex items-center"
									>
										<span className="font-medium">{word.word}</span>
										<span className="text-gray-500 text-xs ml-2">
											({word.translation})
										</span>
									</div>
								))}
						</div>
					</div>

					<div>
						<h4 className="text-sm font-medium text-gray-600 flex items-center mb-3">
							<FaCircle className="mr-2" />
							New Words
						</h4>
						<div className="max-h-60 overflow-y-auto pr-2 space-y-2">
							{words
								.filter((word) => userProgress.new.includes(word.id))
								.slice(0, 10)
								.map((word) => (
									<div
										key={word.id}
										className="p-2 bg-gray-50 rounded-lg flex items-center"
									>
										<span className="font-medium">{word.word}</span>
										<span className="text-gray-500 text-xs ml-2">
											({word.translation})
										</span>
									</div>
								))}
							{userProgress.new.length > 10 && (
								<div className="text-center text-sm text-gray-500 p-2">
									+{userProgress.new.length - 10} more words
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const LessonsView: React.FC<{
	lessons: Lesson[];
	userProgress: UserProgress;
	onStartLesson: (lessonId: number) => void;
	currentTheme: Theme;
}> = ({ lessons, userProgress, onStartLesson, currentTheme }) => {
	const [filter, setFilter] = useState<
		"all" | "beginner" | "intermediate" | "advanced"
	>("all");
	const [searchTerm, setSearchTerm] = useState("");

	const filteredLessons = useMemo(() => {
		return lessons.filter((lesson) => {
			const matchesDifficulty =
				filter === "all" || lesson.difficulty === filter;
			const matchesSearch =
				lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				lesson.category.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesDifficulty && matchesSearch;
		});
	}, [lessons, filter, searchTerm]);

	const lessonsByCategory = useMemo(() => {
		return filteredLessons.reduce((acc, lesson) => {
			if (!acc[lesson.category]) {
				acc[lesson.category] = [];
			}
			acc[lesson.category].push(lesson);
			return acc;
		}, {} as Record<string, Lesson[]>);
	}, [filteredLessons]);

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-xl shadow-sm p-4">
				<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
					<div className="flex items-center space-x-2">
						<span className="text-sm font-medium text-gray-700">Filter:</span>
						<div className="flex flex-wrap rounded-md shadow-sm" role="group">
							<button
								onClick={() => setFilter("all")}
								className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
									filter === "all"
										? "bg-indigo-600 text-white border-indigo-600"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								All
							</button>
							<button
								onClick={() => setFilter("beginner")}
								className={`px-4 py-2 text-sm font-medium border-t border-b ${
									filter === "beginner"
										? "bg-green-600 text-white border-green-600"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								Beginner
							</button>
							<button
								onClick={() => setFilter("intermediate")}
								className={`px-4 py-2 text-sm font-medium border-t border-b ${
									filter === "intermediate"
										? "bg-yellow-500 text-white border-yellow-500"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								Intermediate
							</button>
							<button
								onClick={() => setFilter("advanced")}
								className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
									filter === "advanced"
										? "bg-red-500 text-white border-red-500"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								Advanced
							</button>
						</div>
					</div>

					<div className="relative w-full md:w-64">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FaSearch className="text-gray-400" />
						</div>
						<input
							type="text"
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							placeholder="Search lessons..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{Object.entries(lessonsByCategory).length > 0 ? (
				Object.entries(lessonsByCategory).map(([category, categoryLessons]) => (
					<div key={category} className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-medium mb-4 capitalize">{category}</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{categoryLessons.map((lesson) => (
								<LessonCard
									key={lesson.id}
									lesson={lesson}
									onStart={onStartLesson}
									isCompleted={userProgress.completedLessons.includes(
										lesson.id
									)}
									currentTheme={currentTheme}
								/>
							))}
						</div>
					</div>
				))
			) : (
				<div className="bg-white rounded-xl shadow-sm p-8 text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
						<FaSearch className="text-gray-400 text-xl" />
					</div>
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						No lessons found
					</h3>
					<p className="text-gray-600">
						Try adjusting your filters or search terms
					</p>
				</div>
			)}
		</div>
	);
};

const ExploreView: React.FC<{
	words: WordData[];
	userProgress: UserProgress;
	onWordClick: (wordId: number) => void;
	currentTheme: Theme;
}> = ({ words, userProgress, onWordClick, currentTheme }) => {
	const [filter, setFilter] = useState<"all" | "known" | "learning" | "new">(
		"all"
	);
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");

	const categories = useMemo(() => {
		return ["all", ...new Set(words.map((word) => word.category))];
	}, [words]);

	const filteredWords = useMemo(() => {
		return words.filter((word) => {
			let statusMatch = true;
			if (filter === "known") {
				statusMatch = userProgress.known.includes(word.id);
			} else if (filter === "learning") {
				statusMatch = userProgress.learning.includes(word.id);
			} else if (filter === "new") {
				statusMatch = userProgress.new.includes(word.id);
			}

			const categoryMatch =
				categoryFilter === "all" || word.category === categoryFilter;

			const searchMatch =
				word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
				word.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
				word.category.toLowerCase().includes(searchTerm.toLowerCase());

			return statusMatch && categoryMatch && searchMatch;
		});
	}, [words, filter, categoryFilter, searchTerm, userProgress]);

	const wordsByLetter = useMemo(() => {
		return filteredWords.reduce((acc, word) => {
			const firstLetter = word.word.charAt(0).toUpperCase();
			if (!acc[firstLetter]) {
				acc[firstLetter] = [];
			}
			acc[firstLetter].push(word);
			return acc;
		}, {} as Record<string, WordData[]>);
	}, [filteredWords]);

	const sortedLetters = useMemo(() => {
		return Object.keys(wordsByLetter).sort();
	}, [wordsByLetter]);

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-xl shadow-sm p-4">
				<div className="flex flex-col space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-gray-700 mr-2">
							Status:
						</span>
						<div
							className="inline-flex rounded-md shadow-sm overflow-x-scroll"
							role="group"
						>
							<button
								onClick={() => setFilter("all")}
								className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
									filter === "all"
										? "bg-indigo-600 text-white border-indigo-600"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								All Words
							</button>
							<button
								onClick={() => setFilter("known")}
								className={`px-4 py-2 text-sm font-medium border-t border-b ${
									filter === "known"
										? "bg-emerald-600 text-white border-emerald-600"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								Mastered
							</button>
							<button
								onClick={() => setFilter("learning")}
								className={`px-4 py-2 text-sm font-medium border-t border-b ${
									filter === "learning"
										? "bg-yellow-500 text-white border-yellow-500"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								Learning
							</button>
							<button
								onClick={() => setFilter("new")}
								className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
									filter === "new"
										? "bg-gray-600 text-white border-gray-600"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								New
							</button>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-gray-700 mr-2">
							Category:
						</span>
						<div className="flex flex-wrap gap-2">
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => setCategoryFilter(category)}
									className={`px-3 py-1 text-sm font-medium rounded-full ${
										categoryFilter === category
											? "bg-indigo-100 text-indigo-800"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									{category === "all"
										? "All Categories"
										: category.charAt(0).toUpperCase() + category.slice(1)}
								</button>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FaSearch className="text-gray-400" />
						</div>
						<input
							type="text"
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							placeholder="Search words..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{sortedLetters.length > 0 ? (
				<div className="bg-white rounded-xl shadow-sm p-6">
					<div className="flex flex-wrap justify-center mb-6">
						{sortedLetters.map((letter) => (
							<a
								key={letter}
								href={`#letter-${letter}`}
								className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 text-${currentTheme.secondaryColor} font-medium`}
							>
								{letter}
							</a>
						))}
					</div>

					<div className="space-y-6">
						{sortedLetters.map((letter) => (
							<div
								key={letter}
								id={`letter-${letter}`}
								className="scroll-mt-20"
							>
								<h3
									className={`text-2xl font-bold text-${currentTheme.secondaryColor} mb-3`}
								>
									{letter}
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
									{wordsByLetter[letter].map((word) => (
										<div
											key={word.id}
											className="border border-gray-200 rounded-lg p-3 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer"
											onClick={() => onWordClick(word.id)}
										>
											<div className="flex justify-between items-start">
												<div>
													<h4 className="font-medium">{word.word}</h4>
													<p className="text-sm text-gray-600">
														{word.translation}
													</p>
												</div>
												<div>
													{userProgress.known.includes(word.id) && (
														<span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
															Mastered
														</span>
													)}
													{userProgress.learning.includes(word.id) && (
														<span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
															Learning
														</span>
													)}
												</div>
											</div>
											<div className="mt-2 flex items-center text-xs text-gray-500">
												<span className="capitalize mr-3">{word.category}</span>
												<span className="capitalize">{word.difficulty}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="bg-white rounded-xl shadow-sm p-8 text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
						<FaSearch className="text-gray-400 text-xl" />
					</div>
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						No words found
					</h3>
					<p className="text-gray-600">
						Try adjusting your filters or search terms
					</p>
				</div>
			)}
		</div>
	);
};

const LanguageLearningApp: React.FC = () => {
	const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [currentExercise, setCurrentExercise] =
		useState<ExerciseType>("flashcard");
	const [currentView, setCurrentView] = useState<
		"dashboard" | "lessons" | "practice" | "explore" | "progress"
	>("dashboard");
	const [userProgress, setUserProgress] =
		useState<UserProgress>(initialUserProgress);
	const [userSettings, setUserSettings] =
		useState<UserSettings>(initialUserSettings);
	const [selectedDifficulty, setSelectedDifficulty] = useState<
		"beginner" | "intermediate" | "advanced"
	>("beginner");
	const [filteredWords, setFilteredWords] = useState<WordData[]>([]);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
	const [isActiveLesson, setIsActiveLesson] = useState<boolean>(false);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
	const [activeLessonProgress, setActiveLessonProgress] = useState<number>(0);
	const [currentLanguage, setCurrentLanguage] = useState<string>("fr");

	const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
	const [isSettingsModalOpen, setIsSettingsModalOpen] =
		useState<boolean>(false);
	const [isLanguageModalOpen, setIsLanguageModalOpen] =
		useState<boolean>(false);
	const [isWordDetailModalOpen, setIsWordDetailModalOpen] =
		useState<boolean>(false);
	const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
	const [isPronunciationModalOpen, setIsPronunciationModalOpen] =
		useState<boolean>(false);
	const [pronunciationAccuracy, setPronunciationAccuracy] = useState<number>(0);
	const [isCertificateModalOpen, setIsCertificateModalOpen] =
		useState<boolean>(false);
	const [completedLessonId, setCompletedLessonId] = useState<number | null>(
		null
	);

	const [toastConfig, setToastConfig] = useState<{
		message: string;
		type: "success" | "error" | "info" | "warning";
		isVisible: boolean;
	}>({
		message: "",
		type: "info",
		isVisible: false,
	});

	const [matchingItems, setMatchingItems] = useState<{
		words: string[];
		translations: string[];
		selected: { word: string | null; translation: string | null };
		matches: { [key: string]: string };
	}>({
		words: [],
		translations: [],
		selected: { word: null, translation: null },
		matches: {},
	});

	const [blankExercise, setBlankExercise] = useState<{
		sentence: string;
		answer: string;
		userInput: string;
		isCorrect: boolean | null;
	}>({
		sentence: "",
		answer: "",
		userInput: "",
		isCorrect: null,
	});

	const [multipleChoiceExercise, setMultipleChoiceExercise] = useState<{
		question: string;
		options: string[];
		correctAnswer: string;
		selectedOption: string | null;
		isCorrect: boolean | null;
	}>({
		question: "",
		options: [],
		correctAnswer: "",
		selectedOption: null,
		isCorrect: null,
	});

	const [speakingExercise, setSpeakingExercise] = useState<{
		word: string;
		translation: string;
		isRecording: boolean;
		hasTried: boolean;
	}>({
		word: "",
		translation: "",
		isRecording: false,
		hasTried: false,
	});

	const swipeRef = useRef<HTMLDivElement>(null);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const [timeSpent, setTimeSpent] = useState<number>(0);

	const currentTheme = themeConfigs[userSettings.theme];

	useEffect(() => {
		const filtered = languageData.filter(
			(word) => word.difficulty === selectedDifficulty
		);
		setFilteredWords(filtered);
		setCurrentWordIndex(0);

		prepareMatchingExercise(filtered);

		prepareFillInBlanksExercise(filtered);

		prepareMultipleChoiceExercise(filtered);

		prepareSpeakingExercise(filtered);
	}, [selectedDifficulty]);

	useEffect(() => {
		if (isActiveLesson) {
			timerRef.current = setInterval(() => {
				setTimeSpent((prev) => prev + 1);
			}, 60000);
		} else {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isActiveLesson]);

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		if (userProgress.lastPractice !== today) {
			setUserProgress((prev) => ({
				...prev,
				lastPractice: today,
				streakDays: prev.streakDays + 1,
			}));
		}
	}, []);

	useEffect(() => {
		if (currentLesson && activeLessonProgress >= 100) {
			handleLessonComplete(currentLesson.id);
		}
	}, [activeLessonProgress, currentLesson]);

	const prepareMatchingExercise = useCallback((words: WordData[]) => {
		const shuffledWords = [...words]
			.sort(() => Math.random() - 0.5)
			.slice(0, 4);
		const wordsList = shuffledWords.map((w) => w.word);
		const translationsList = [...shuffledWords]
			.sort(() => Math.random() - 0.5)
			.map((w) => w.translation);

		setMatchingItems({
			words: wordsList,
			translations: translationsList,
			selected: { word: null, translation: null },
			matches: {},
		});
	}, []);

	// Helper function to escape special characters for regex
	const escapeRegExp = (string: any) =>
		string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	// Function to prepare the fill-in-the-blanks exercise
	const prepareFillInBlanksExercise = useCallback((words: any) => {
		// Pick a random word object from the array
		const randomWord = words[Math.floor(Math.random() * words.length)];
		console.log(randomWord);
		console.log("Selected word:", randomWord.word);
		console.log("Original sentence:", randomWord.example);

		// Escape special characters in the word and create a regex
		const escapedWord = escapeRegExp(randomWord.word);
		const regex = new RegExp(`\\b${escapedWord}\\b`, "i");

		// Replace the word with a blank
		const sentence = randomWord.example.replace(regex, "________");
		console.log("Sentence after replacement:", sentence);

		// Check if the replacement worked
		if (!sentence.includes("________")) {
			console.error(
				"Word not found:",
				randomWord.word,
				"in sentence:",
				randomWord.example
			);
		}

		// Update the exercise state
		setBlankExercise({
			sentence: sentence,
			answer: randomWord.word,
			userInput: "",
			isCorrect: null,
		});
	}, []);
	const prepareMultipleChoiceExercise = useCallback((words: WordData[]) => {
		const correctWord = words[Math.floor(Math.random() * words.length)];

		const incorrectOptions = words
			.filter((w) => w.id !== correctWord.id)
			.sort(() => Math.random() - 0.5)
			.slice(0, 3)
			.map((w) => w.translation);

		const allOptions = [...incorrectOptions, correctWord.translation].sort(
			() => Math.random() - 0.5
		);

		setMultipleChoiceExercise({
			question: correctWord.word,
			options: allOptions,
			correctAnswer: correctWord.translation,
			selectedOption: null,
			isCorrect: null,
		});
	}, []);

	const prepareSpeakingExercise = useCallback((words: WordData[]) => {
		const randomWord = words[Math.floor(Math.random() * words.length)];

		setSpeakingExercise({
			word: randomWord.word,
			translation: randomWord.translation,
			isRecording: false,
			hasTried: false,
		});
	}, []);

	const handleSpeakingSubmit = useCallback(() => {
		const accuracy = Math.floor(Math.random() * 101);

		setSpeakingExercise((prev) => ({
			...prev,
			isRecording: false,
			hasTried: true,
		}));

		setPronunciationAccuracy(accuracy);
		setIsPronunciationModalOpen(true);

		if (accuracy >= 70) {
			setUserProgress((prev) => ({
				...prev,
				completedExercises: prev.completedExercises + 1,
			}));
		}
	}, []);
	const showToast = useCallback(
		(message: string, type: "success" | "error" | "info" | "warning") => {
			setToastConfig({
				message,
				type,
				isVisible: true,
			});
		},
		[]
	);
	const pronounceWord = useCallback(
		(word: string) => {
			console.log("Attempting to pronounce:", word);

			// Check browser support
			if (!window.speechSynthesis) {
				console.error("Speech synthesis not supported");
				showToast(
					"Speech synthesis is not supported in your browser.",
					"error"
				);
				return;
			}

			// Respect user settings
			if (!userSettings.audioEnabled) {
				console.log("Audio is disabled in settings");
				showToast(
					"Audio is disabled in settings. Enable it to hear pronunciations.",
					"info"
				);
				return;
			}

			try {
				const utterance = new SpeechSynthesisUtterance(word);
				utterance.lang = "fr-FR";

				// Get available voices
				const availableVoices = window.speechSynthesis.getVoices();
				console.log(
					"Available voices:",
					availableVoices.map((v) => `${v.name} (${v.lang})`)
				);

				// Find a French voice
				const frenchVoice = availableVoices.find((voice) =>
					voice.lang.startsWith("fr")
				);
				if (frenchVoice) {
					utterance.voice = frenchVoice;
					console.log("Using French voice:", frenchVoice.name);
				} else {
					console.warn("No French voice found, using default voice");
					showToast("No French voice available, using default voice.", "info");
				}

				// Event handlers for debugging
				utterance.onstart = () => {
					console.log("Speech started");
					showToast(`Pronouncing "${word}"`, "info");
				};
				utterance.onend = () => console.log("Speech ended");
				utterance.onerror = (e) => {
					console.error("Speech error:", e);
					showToast("An error occurred while pronouncing the word.", "error");
				};

				window.speechSynthesis.speak(utterance);
				console.log("Speech synthesis called");
			} catch (error) {
				console.error("Error in pronounceWord:", error);
				showToast("Failed to pronounce the word due to an error.", "error");
			}
		},
		[userSettings.audioEnabled, showToast] // Dependencies
	);

	const hideToast = useCallback(() => {
		setToastConfig((prev) => ({
			...prev,
			isVisible: false,
		}));
	}, []);

	const handleNextWord = useCallback(() => {
		if (currentWordIndex < filteredWords.length - 1) {
			setCurrentWordIndex((prevIndex) => prevIndex + 1);
			setIsFlipped(false);
		} else {
			setCurrentWordIndex(0);
			setIsFlipped(false);
			showToast("You completed this set! Starting over.", "success");
		}
	}, [currentWordIndex, filteredWords.length, showToast]);

	const handlePrevWord = useCallback(() => {
		if (currentWordIndex > 0) {
			setCurrentWordIndex((prevIndex) => prevIndex - 1);
			setIsFlipped(false);
		} else {
			setCurrentWordIndex(filteredWords.length - 1);
			setIsFlipped(false);
			showToast("Going to the last card in this set.", "info");
		}
	}, [currentWordIndex, filteredWords.length, showToast]);

	const handleDifficultyChange = useCallback(
		(difficulty: "beginner" | "intermediate" | "advanced") => {
			setSelectedDifficulty(difficulty);
			showToast(`Changed difficulty to ${difficulty}`, "info");
		},
		[showToast]
	);

	const handleCardFlip = useCallback(() => {
		setIsFlipped(!isFlipped);
	}, [isFlipped]);

	const handleExerciseChange = useCallback(
		(type: ExerciseType) => {
			setCurrentExercise(type);

			if (type === "matching") {
				prepareMatchingExercise(filteredWords);
			} else if (type === "fillInBlanks") {
				prepareFillInBlanksExercise(filteredWords);
			} else if (type === "multipleChoice") {
				prepareMultipleChoiceExercise(filteredWords);
			} else if (type === "speaking") {
				prepareSpeakingExercise(filteredWords);
			}
		},
		[
			filteredWords,
			prepareMatchingExercise,
			prepareFillInBlanksExercise,
			prepareMultipleChoiceExercise,
			prepareSpeakingExercise,
		]
	);

	const markAsKnown = useCallback(
		(wordId: number) => {
			setUserProgress((prev) => {
				const newKnown = [...prev.known];
				const newLearning = prev.learning.filter((id) => id !== wordId);
				const newNew = prev.new.filter((id) => id !== wordId);

				if (!newKnown.includes(wordId)) {
					newKnown.push(wordId);
				}

				return {
					...prev,
					known: newKnown,
					learning: newLearning,
					new: newNew,
					completedExercises: prev.completedExercises + 1,
				};
			});

			showToast("Word marked as known!", "success");
			handleNextWord();
		},
		[handleNextWord, showToast]
	);

	const markAsLearning = useCallback(
		(wordId: number) => {
			setUserProgress((prev) => {
				const newLearning = [...prev.learning];
				const newKnown = prev.known.filter((id) => id !== wordId);
				const newNew = prev.new.filter((id) => id !== wordId);

				if (!newLearning.includes(wordId)) {
					newLearning.push(wordId);
				}

				return {
					...prev,
					known: newKnown,
					learning: newLearning,
					new: newNew,
				};
			});

			showToast("Word marked for review later.", "info");
			handleNextWord();
		},
		[handleNextWord, showToast]
	);

	const handleMatchingSelection = useCallback(
		(item: string, type: "word" | "translation") => {
			const newSelected = { ...matchingItems.selected };
			const newMatches = { ...matchingItems.matches };

			if (type === "word") {
				newSelected.word = item;
			} else {
				newSelected.translation = item;
			}

			setMatchingItems((prev) => ({
				...prev,
				selected: newSelected,
			}));

			if (newSelected.word && newSelected.translation) {
				const selectedWordObj = filteredWords.find(
					(w) => w.word === newSelected.word
				);

				if (
					selectedWordObj &&
					selectedWordObj.translation === newSelected.translation
				) {
					newMatches[newSelected.word] = newSelected.translation;

					setMatchingItems((prev) => ({
						...prev,
						matches: newMatches,
						selected: { word: null, translation: null },
					}));

					showToast("Correct match!", "success");

					if (Object.keys(newMatches).length === matchingItems.words.length) {
						showToast("You completed the matching exercise!", "success");
						setTimeout(() => {
							prepareMatchingExercise(filteredWords);
							setUserProgress((prev) => ({
								...prev,
								completedExercises: prev.completedExercises + 1,
							}));

							if (isActiveLesson) {
								setActiveLessonProgress((prev) => Math.min(prev + 25, 100));
							}
						}, 1500);
					}
				} else {
					showToast("Incorrect match, try again.", "error");
					setMatchingItems((prev) => ({
						...prev,
						selected: { word: null, translation: null },
					}));
				}
			}
		},
		[
			filteredWords,
			matchingItems.words.length,
			matchingItems.selected,
			prepareMatchingExercise,
			showToast,
			isActiveLesson,
		]
	);

	const handleBlankSubmit = useCallback(() => {
		const isCorrect =
			blankExercise.userInput.toLowerCase() ===
			blankExercise.answer.toLowerCase();

		setBlankExercise((prev) => ({
			...prev,
			isCorrect,
		}));

		if (isCorrect) {
			showToast("Correct answer!", "success");
			setTimeout(() => {
				prepareFillInBlanksExercise(filteredWords);
				setUserProgress((prev) => ({
					...prev,
					completedExercises: prev.completedExercises + 1,
				}));

				if (isActiveLesson) {
					setActiveLessonProgress((prev) => Math.min(prev + 25, 100));
				}
			}, 1500);
		} else {
			showToast("Incorrect, try again!", "error");
		}
	}, [
		blankExercise.userInput,
		blankExercise.answer,
		prepareFillInBlanksExercise,
		filteredWords,
		showToast,
		isActiveLesson,
	]);

	const handleMultipleChoiceSubmit = useCallback(() => {
		if (!multipleChoiceExercise.selectedOption) {
			showToast("Please select an option", "warning");
			return;
		}

		const isCorrect =
			multipleChoiceExercise.selectedOption ===
			multipleChoiceExercise.correctAnswer;

		setMultipleChoiceExercise((prev) => ({
			...prev,
			isCorrect,
		}));

		if (isCorrect) {
			showToast("Correct answer!", "success");
			setTimeout(() => {
				prepareMultipleChoiceExercise(filteredWords);
				setUserProgress((prev) => ({
					...prev,
					completedExercises: prev.completedExercises + 1,
				}));

				if (isActiveLesson) {
					setActiveLessonProgress((prev) => Math.min(prev + 25, 100));
				}
			}, 1500);
		} else {
			showToast("Incorrect, try again!", "error");
		}
	}, [
		multipleChoiceExercise.selectedOption,
		multipleChoiceExercise.correctAnswer,
		prepareMultipleChoiceExercise,
		filteredWords,
		showToast,
		isActiveLesson,
	]);

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	}, []);

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	}, []);

	const handleTouchEnd = useCallback(() => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > 50;
		const isRightSwipe = distance < -50;

		if (isLeftSwipe) {
			handleNextWord();
		}

		if (isRightSwipe) {
			handlePrevWord();
		}
	}, [touchStart, touchEnd, handleNextWord, handlePrevWord]);

	const calculateProgress = useCallback(() => {
		const totalWords = languageData.length;
		const knownPercentage = (userProgress.known.length / totalWords) * 100;
		return knownPercentage;
	}, [userProgress.known.length]);

	const currentWord = useMemo(
		() => filteredWords[currentWordIndex] || languageData[0],
		[filteredWords, currentWordIndex]
	);

	const handleStartLesson = useCallback(
		(lessonId: number) => {
			const lesson = lessonsData.find((l) => l.id === lessonId);
			if (lesson) {
				setCurrentLesson(lesson);
				setIsActiveLesson(true);
				setCurrentView("practice");

				const firstExercise = lesson.exercises[0];
				setCurrentExerciseIndex(0);
				setCurrentExercise(firstExercise.type);

				const lessonWords = languageData.filter((word) =>
					lesson.wordIds.includes(word.id)
				);
				setFilteredWords(lessonWords);

				if (firstExercise.type === "matching") {
					prepareMatchingExercise(lessonWords);
				} else if (firstExercise.type === "fillInBlanks") {
					prepareFillInBlanksExercise(lessonWords);
				} else if (firstExercise.type === "multipleChoice") {
					prepareMultipleChoiceExercise(lessonWords);
				} else if (firstExercise.type === "speaking") {
					prepareSpeakingExercise(lessonWords);
				}

				setActiveLessonProgress(0);
				setTimeSpent(0);

				showToast(`Starting lesson: ${lesson.title}`, "info");
			}
		},
		[
			prepareMatchingExercise,
			prepareFillInBlanksExercise,
			prepareMultipleChoiceExercise,
			prepareSpeakingExercise,
			showToast,
		]
	);

	const handleNextExercise = useCallback(() => {
		if (!currentLesson) return;

		const nextIndex = currentExerciseIndex + 1;

		if (nextIndex < currentLesson.exercises.length) {
			setCurrentExerciseIndex(nextIndex);
			const nextExercise = currentLesson.exercises[nextIndex];
			setCurrentExercise(nextExercise.type);

			const exerciseWords = languageData.filter((word) =>
				nextExercise.wordIds.includes(word.id)
			);
			setFilteredWords(exerciseWords);

			if (nextExercise.type === "matching") {
				prepareMatchingExercise(exerciseWords);
			} else if (nextExercise.type === "fillInBlanks") {
				prepareFillInBlanksExercise(exerciseWords);
			} else if (nextExercise.type === "multipleChoice") {
				prepareMultipleChoiceExercise(exerciseWords);
			} else if (nextExercise.type === "speaking") {
				prepareSpeakingExercise(exerciseWords);
			}

			showToast(`Moving to next exercise: ${nextExercise.type}`, "info");
		} else {
			handleLessonComplete(currentLesson.id);
		}
	}, [
		currentLesson,
		currentExerciseIndex,
		prepareMatchingExercise,
		prepareFillInBlanksExercise,
		prepareMultipleChoiceExercise,
		prepareSpeakingExercise,
		showToast,
	]);

	const handleLessonComplete = useCallback(
		(lessonId: number) => {
			setUserProgress((prev) => {
				const completedLessons = [...prev.completedLessons];
				if (!completedLessons.includes(lessonId)) {
					completedLessons.push(lessonId);
				}

				return {
					...prev,
					completedLessons,
					totalTimeSpent: prev.totalTimeSpent + timeSpent,
					proficiencyScore: Math.min(prev.proficiencyScore + 5, 100),
				};
			});

			setIsActiveLesson(false);
			setCurrentLesson(null);
			setCompletedLessonId(lessonId);
			setIsCertificateModalOpen(true);

			checkAchievements();

			showToast("Congratulations! You completed the lesson!", "success");
		},
		[timeSpent, showToast]
	);

	const checkAchievements = useCallback(() => {
		setUserProgress((prev) => {
			const updatedAchievements = [...prev.achievements];

			const wordCollectorAchievement = updatedAchievements.find(
				(a) => a.id === 2
			);
			if (wordCollectorAchievement && !wordCollectorAchievement.isCompleted) {
				if (prev.known.length >= 10) {
					wordCollectorAchievement.isCompleted = true;
					wordCollectorAchievement.dateEarned = new Date()
						.toISOString()
						.split("T")[0];
					showToast("New achievement unlocked: Word Collector!", "success");
				} else if (wordCollectorAchievement.progress) {
					wordCollectorAchievement.progress.current = prev.known.length;
				}
			}

			const consistentLearnerAchievement = updatedAchievements.find(
				(a) => a.id === 3
			);
			if (
				consistentLearnerAchievement &&
				!consistentLearnerAchievement.isCompleted
			) {
				if (prev.streakDays >= 7) {
					consistentLearnerAchievement.isCompleted = true;
					consistentLearnerAchievement.dateEarned = new Date()
						.toISOString()
						.split("T")[0];
					showToast("New achievement unlocked: Consistent Learner!", "success");
				} else if (consistentLearnerAchievement.progress) {
					consistentLearnerAchievement.progress.current = prev.streakDays;
				}
			}

			return {
				...prev,
				achievements: updatedAchievements,
			};
		});
	}, [showToast]);

	const handleLanguageChange = useCallback(
		(languageId: string) => {
			setCurrentLanguage(languageId);
			setIsLanguageModalOpen(false);
			showToast(
				`Language changed to ${
					availableLanguages.find((l) => l.id === languageId)?.name
				}`,
				"info"
			);
		},
		[showToast]
	);

	const handleWordClick = useCallback((wordId: number) => {
		setSelectedWordId(wordId);
		setIsWordDetailModalOpen(true);
	}, []);

	const selectedWord = useMemo(
		() =>
			selectedWordId ? languageData.find((w) => w.id === selectedWordId) : null,
		[selectedWordId]
	);

	const completedLesson = useMemo(
		() =>
			completedLessonId
				? lessonsData.find((l) => l.id === completedLessonId)
				: null,
		[completedLessonId]
	);

	return (
		<div
			className={`font-sans antialiased text-gray-800 min-h-screen bg-gradient-to-br ${currentTheme.backgroundColor}`}
		>
			<header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
				<div className="container mx-auto px-4 py-3 flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<div
							className={`bg-gradient-to-r ${currentTheme.primaryColor} text-white p-2 rounded-lg`}
						>
							<FaGraduationCap className="text-xl" />
						</div>
						<h1
							className={`text-xl font-bold bg-gradient-to-r ${currentTheme.primaryColor} bg-clip-text text-transparent`}
						>
							LinguaLearn Pro
						</h1>
					</div>

					<button
						onClick={() => setIsLanguageModalOpen(true)}
						className="md:flex items-center space-x-2 hidden"
					>
						<span className="text-xl">
							{availableLanguages.find((l) => l.id === currentLanguage)?.flag}
						</span>
						<span className="text-sm font-medium text-gray-700">
							{availableLanguages.find((l) => l.id === currentLanguage)?.name}
						</span>
						<FaAngleDown className="text-gray-400" />
					</button>

					<nav className="hidden md:flex items-center space-x-8">
						<button
							onClick={() => setCurrentView("dashboard")}
							className={`font-medium ${
								currentView === "dashboard"
									? `text-${currentTheme.secondaryColor} border-b-2 border-${currentTheme.secondaryColor} pb-1`
									: "text-gray-600 hover:text-gray-800"
							} flex items-center space-x-1`}
						>
							<FaHome />
							<span>Dashboard</span>
						</button>

						<button
							onClick={() => setCurrentView("lessons")}
							className={`font-medium ${
								currentView === "lessons"
									? `text-${currentTheme.secondaryColor} border-b-2 border-${currentTheme.secondaryColor} pb-1`
									: "text-gray-600 hover:text-gray-800"
							} flex items-center space-x-1`}
						>
							<FaBookOpen />
							<span>Lessons</span>
						</button>

						<button
							onClick={() => {
								setCurrentView("practice");
								setIsActiveLesson(false);
								setCurrentLesson(null);

								setSelectedDifficulty("beginner");
								setCurrentExercise("flashcard");

								const beginnerWords = languageData.filter(
									(word) => word.difficulty === "beginner"
								);
								setFilteredWords(beginnerWords);
							}}
							className={`font-medium ${
								currentView === "practice"
									? `text-${currentTheme.secondaryColor} border-b-2 border-${currentTheme.secondaryColor} pb-1`
									: "text-gray-600 hover:text-gray-800"
							} flex items-center space-x-1`}
						>
							<FaGraduationCap />
							<span>Practice</span>
						</button>

						<button
							onClick={() => setCurrentView("explore")}
							className={`font-medium ${
								currentView === "explore"
									? `text-${currentTheme.secondaryColor} border-b-2 border-${currentTheme.secondaryColor} pb-1`
									: "text-gray-600 hover:text-gray-800"
							} flex items-center space-x-1`}
						>
							<FaGlobe />
							<span>Explore</span>
						</button>

						<button
							onClick={() => setCurrentView("progress")}
							className={`font-medium ${
								currentView === "progress"
									? `text-${currentTheme.secondaryColor} border-b-2 border-${currentTheme.secondaryColor} pb-1`
									: "text-gray-600 hover:text-gray-800"
							} flex items-center space-x-1`}
						>
							<FaChartLine />
							<span>Progress</span>
						</button>
					</nav>

					<div className="flex items-center space-x-4">
						<button
							onClick={() => setIsProfileModalOpen(true)}
							className="hidden md:flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
						>
							<div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
								<FaUser />
							</div>
							<span className="font-medium">Profile</span>
						</button>

						<button
							onClick={() => setIsSettingsModalOpen(true)}
							className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
						>
							<FaCog className="text-gray-600" />
						</button>

						<button
							className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle mobile menu"
						>
							<FaBars className="text-xl" />
						</button>
					</div>
				</div>

				{isMobileMenuOpen && (
					<div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-50 border-t border-gray-100 animate-fadeIn">
						<div className="px-4 py-3 space-y-3">
							<button
								onClick={() => {
									setCurrentView("dashboard");
									setIsMobileMenuOpen(false);
								}}
								className={`block w-full text-left font-medium ${
									currentView === "dashboard"
										? `text-${currentTheme.secondaryColor}`
										: "text-gray-600"
								} py-2 flex items-center space-x-3`}
							>
								<FaHome />
								<span>Dashboard</span>
							</button>

							<button
								onClick={() => {
									setCurrentView("lessons");
									setIsMobileMenuOpen(false);
								}}
								className={`block w-full text-left font-medium ${
									currentView === "lessons"
										? `text-${currentTheme.secondaryColor}`
										: "text-gray-600"
								} py-2 flex items-center space-x-3`}
							>
								<FaBookOpen />
								<span>Lessons</span>
							</button>

							<button
								onClick={() => {
									setCurrentView("practice");
									setIsMobileMenuOpen(false);
									setIsActiveLesson(false);
									setCurrentLesson(null);

									setSelectedDifficulty("beginner");
									setCurrentExercise("flashcard");

									const beginnerWords = languageData.filter(
										(word) => word.difficulty === "beginner"
									);
									setFilteredWords(beginnerWords);
								}}
								className={`block w-full text-left font-medium ${
									currentView === "practice"
										? `text-${currentTheme.secondaryColor}`
										: "text-gray-600"
								} py-2 flex items-center space-x-3`}
							>
								<FaGraduationCap />
								<span>Practice</span>
							</button>

							<button
								onClick={() => {
									setCurrentView("explore");
									setIsMobileMenuOpen(false);
								}}
								className={`block w-full text-left font-medium ${
									currentView === "explore"
										? `text-${currentTheme.secondaryColor}`
										: "text-gray-600"
								} py-2 flex items-center space-x-3`}
							>
								<FaGlobe />
								<span>Explore</span>
							</button>

							<button
								onClick={() => {
									setCurrentView("progress");
									setIsMobileMenuOpen(false);
								}}
								className={`block w-full text-left font-medium ${
									currentView === "progress"
										? `text-${currentTheme.secondaryColor}`
										: "text-gray-600"
								} py-2 flex items-center space-x-3`}
							>
								<FaChartLine />
								<span>Progress</span>
							</button>

							<div className="pt-2 border-t border-gray-100">
								<button
									onClick={() => {
										setIsProfileModalOpen(true);
										setIsMobileMenuOpen(false);
									}}
									className="w-full text-left py-2 flex items-center space-x-3 text-gray-600"
								>
									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
										<FaUser />
									</div>
									<span className="font-medium">Profile</span>
								</button>

								<button
									onClick={() => {
										setIsLanguageModalOpen(true);
										setIsMobileMenuOpen(false);
									}}
									className="w-full text-left py-2 flex items-center space-x-3 text-gray-600"
								>
									<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
										<span className="text-lg">
											{
												availableLanguages.find((l) => l.id === currentLanguage)
													?.flag
											}
										</span>
									</div>
									<span className="font-medium">Change Language</span>
								</button>

								<button
									onClick={() => {
										setIsSettingsModalOpen(true);
										setIsMobileMenuOpen(false);
									}}
									className="block w-full text-left py-2 flex items-center space-x-3 text-gray-600"
								>
									<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
										<FaCog />
									</div>
									<span className="font-medium">Settings</span>
								</button>
							</div>
						</div>
					</div>
				)}
			</header>

			<div className="container mx-auto px-4 py-6">
				{currentView === "dashboard" && (
					<DashboardView
						userProgress={userProgress}
						studyStats={studyStats}
						lessons={lessonsData}
						onStartLesson={handleStartLesson}
						currentTheme={currentTheme}
					/>
				)}

				{currentView === "lessons" && (
					<LessonsView
						lessons={lessonsData}
						userProgress={userProgress}
						onStartLesson={handleStartLesson}
						currentTheme={currentTheme}
					/>
				)}

				{currentView === "explore" && (
					<ExploreView
						words={languageData}
						userProgress={userProgress}
						onWordClick={handleWordClick}
						currentTheme={currentTheme}
					/>
				)}

				{currentView === "progress" && (
					<ProgressView
						userProgress={userProgress}
						studyStats={studyStats}
						words={languageData}
						currentTheme={currentTheme}
					/>
				)}

				{currentView === "practice" && (
					<div className="space-y-6">
						{isActiveLesson && currentLesson && (
							<div className="bg-white rounded-xl shadow-sm p-4">
								<div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
									<div>
										<h2 className="text-lg font-medium">
											{currentLesson.title}
										</h2>
										<p className="text-sm text-gray-600">
											{
												currentLesson.exercises[currentExerciseIndex]
													.instructions
											}
										</p>
									</div>

									<div className="flex items-center space-x-4 w-full md:w-auto">
										<div className="flex-1 md:flex-initial">
											<div className="flex justify-between text-xs text-gray-600 mb-1">
												<span>Progress</span>
												<span>{activeLessonProgress}%</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2.5">
												<div
													className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full"
													style={{ width: `${activeLessonProgress}%` }}
												></div>
											</div>
										</div>

										<button
											onClick={() => {
												setIsActiveLesson(false);
												setCurrentLesson(null);
												showToast("Lesson exited", "info");
											}}
											className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
										>
											Exit
										</button>
									</div>
								</div>
							</div>
						)}

						{!isActiveLesson && (
							<div>
								<div className="flex flex-wrap justify-center gap-2 mb-6">
									<button
										onClick={() => handleDifficultyChange("beginner")}
										className={`px-4 py-2 rounded-full transition-all transform hover:scale-105 ${
											selectedDifficulty === "beginner"
												? `bg-gradient-to-r ${currentTheme.primaryColor} text-white shadow-lg`
												: "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
										}`}
									>
										Beginner
									</button>
									<button
										onClick={() => handleDifficultyChange("intermediate")}
										className={`px-4 py-2 rounded-full transition-all transform hover:scale-105 ${
											selectedDifficulty === "intermediate"
												? `bg-gradient-to-r ${currentTheme.primaryColor} text-white shadow-lg`
												: "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
										}`}
									>
										Intermediate
									</button>
									<button
										onClick={() => handleDifficultyChange("advanced")}
										className={`px-4 py-2 rounded-full transition-all transform hover:scale-105 ${
											selectedDifficulty === "advanced"
												? `bg-gradient-to-r ${currentTheme.primaryColor} text-white shadow-lg`
												: "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
										}`}
									>
										Advanced
									</button>
								</div>
							</div>
						)}

						<div>
							<div className="bg-white rounded-xl shadow-sm p-3 mb-6 flex justify-center">
								<div
									className="inline-flex rounded-md shadow-sm overflow-x-auto"
									role="group"
								>
									<button
										onClick={() => handleExerciseChange("flashcard")}
										className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-l-lg ${
											currentExercise === "flashcard"
												? `bg-${currentTheme.secondaryColor} text-white`
												: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
										}`}
									>
										Flashcards
									</button>
									<button
										onClick={() => handleExerciseChange("matching")}
										className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
											currentExercise === "matching"
												? `bg-${currentTheme.secondaryColor} text-white`
												: "bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300"
										}`}
									>
										Matching
									</button>
									<button
										onClick={() => handleExerciseChange("fillInBlanks")}
										className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
											currentExercise === "fillInBlanks"
												? `bg-${currentTheme.secondaryColor} text-white`
												: "bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300"
										}`}
									>
										Fill in Blanks
									</button>
									<button
										onClick={() => handleExerciseChange("multipleChoice")}
										className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
											currentExercise === "multipleChoice"
												? `bg-${currentTheme.secondaryColor} text-white`
												: "bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300"
										}`}
									>
										Multiple Choice
									</button>
									<button
										onClick={() => handleExerciseChange("speaking")}
										className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-r-lg ${
											currentExercise === "speaking"
												? `bg-${currentTheme.secondaryColor} text-white`
												: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
										}`}
									>
										Speaking
									</button>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{currentExercise === "flashcard" && (
								<div
									ref={swipeRef}
									onTouchStart={handleTouchStart}
									onTouchMove={handleTouchMove}
									onTouchEnd={handleTouchEnd}
									className="md:col-span-1 relative"
								>
									<div className="relative w-full perspective-1000">
										<div
											className={`relative w-full h-96 rounded-xl bg-white shadow-lg transform transition-all duration-500 ease-out preserve-3d cursor-pointer ${
												isFlipped ? "rotate-y-180" : ""
											} ${
												userSettings.animationsEnabled ? "" : "transition-none"
											}`}
											onClick={handleCardFlip}
										>
											<div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden flex flex-col">
												<div className="relative h-2/3 overflow-hidden">
													<img
														src={currentWord.imageUrl}
														alt={currentWord.word}
														className="w-full h-full object-cover"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
													<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
														<span
															className={`bg-${currentTheme.secondaryColor} text-xs px-2 py-1 rounded-full uppercase`}
														>
															{currentWord.category}
														</span>
													</div>
												</div>
												<div className="p-4 flex-1 flex flex-col justify-between">
													<div>
														<h2 className="text-2xl font-bold">
															{currentWord.word}
														</h2>
														<p className="text-gray-500 text-sm">
															{currentWord.pronunciation}
														</p>
													</div>
													<div className="flex justify-between items-center mt-4">
														<button
															onClick={(e) => {
																e.stopPropagation();
																pronounceWord(currentWord.word);
															}}
															className={`bg-${currentTheme.accentColor} hover:bg-indigo-100 text-${currentTheme.textColor} p-2 rounded-full transition-colors`}
															aria-label="Pronounce word"
														>
															<FaVolumeUp />
														</button>
														<p className="text-sm text-gray-500">Tap to flip</p>
													</div>
												</div>
											</div>

											<div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden flex flex-col bg-white rotate-y-180">
												<div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
													<h3 className="text-xl text-gray-500 mb-2">
														Translation
													</h3>
													<h2 className="text-3xl font-bold mb-6">
														{currentWord.translation}
													</h2>

													<h3 className="text-xl text-gray-500 mb-2">
														Example
													</h3>
													<p className="text-lg mb-8 px-4">
														{currentWord.example}
													</p>

													<div className="flex space-x-4 mt-auto">
														<button
															onClick={(e) => {
																e.stopPropagation();
																markAsKnown(currentWord.id);
															}}
															className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors"
														>
															I know this
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																markAsLearning(currentWord.id);
															}}
															className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg transition-colors"
														>
															Review later
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="flex justify-between mt-4">
										<button
											onClick={handlePrevWord}
											className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
										>
											<FaArrowLeft />
											<span>Previous</span>
										</button>
										<button
											onClick={handleNextWord}
											className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
										>
											<span>Next</span>
											<FaArrowRight />
										</button>
									</div>
								</div>
							)}

							{currentExercise === "matching" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6">
										<h2 className="text-xl font-semibold mb-4">
											Match Words with Translations
										</h2>
										<p className="text-gray-600 mb-6">
											Click on a word and its corresponding translation to make
											a match.
										</p>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-3">
												<h3 className="font-medium text-gray-700 mb-2">
													Words
												</h3>
												{matchingItems.words.map((word, index) => (
													<button
														key={`word-${index}`}
														onClick={() =>
															handleMatchingSelection(word, "word")
														}
														disabled={!!matchingItems.matches[word]}
														className={`w-full p-3 rounded-lg text-left transition-all ${
															matchingItems.matches[word]
																? "bg-green-100 text-green-800 opacity-70"
																: matchingItems.selected.word === word
																? `bg-${currentTheme.accentColor} border-2 border-${currentTheme.secondaryColor} text-${currentTheme.textColor}`
																: "bg-gray-100 hover:bg-gray-200 text-gray-800"
														}`}
													>
														{word}
														{matchingItems.matches[word] && (
															<FaCheck className="float-right text-green-600" />
														)}
													</button>
												))}
											</div>

											<div className="space-y-3">
												<h3 className="font-medium text-gray-700 mb-2">
													Translations
												</h3>
												{matchingItems.translations.map(
													(translation, index) => (
														<button
															key={`translation-${index}`}
															onClick={() =>
																handleMatchingSelection(
																	translation,
																	"translation"
																)
															}
															disabled={Object.values(
																matchingItems.matches
															).includes(translation)}
															className={`w-full p-3 rounded-lg text-left transition-all ${
																Object.values(matchingItems.matches).includes(
																	translation
																)
																	? "bg-green-100 text-green-800 opacity-70"
																	: matchingItems.selected.translation ===
																	  translation
																	? `bg-${currentTheme.accentColor} border-2 border-${currentTheme.secondaryColor} text-${currentTheme.textColor}`
																	: "bg-gray-100 hover:bg-gray-200 text-gray-800"
															}`}
														>
															{translation}
															{Object.values(matchingItems.matches).includes(
																translation
															) && (
																<FaCheck className="float-right text-green-600" />
															)}
														</button>
													)
												)}
											</div>
										</div>

										<div className="mt-6 flex justify-between">
											<button
												onClick={() => prepareMatchingExercise(filteredWords)}
												className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors"
											>
												New matching set
											</button>

											{isActiveLesson && (
												<button
													onClick={handleNextExercise}
													className={`bg-gradient-to-r ${currentTheme.primaryColor} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
												>
													Next Exercise
												</button>
											)}
										</div>
									</div>
								</div>
							)}

							{currentExercise === "fillInBlanks" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6">
										<h2 className="text-xl font-semibold mb-4">
											Fill in the Blank
										</h2>
										<p className="text-gray-600 mb-6">
											Complete the sentence with the correct word.
										</p>

										<div className="p-4 bg-gray-50 rounded-lg mb-6">
											<p className="text-lg">{blankExercise.sentence}</p>
										</div>

										<div className="mb-6">
											<label
												htmlFor="answer"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Your answer:
											</label>
											<input
												type="text"
												id="answer"
												value={blankExercise.userInput}
												onChange={(e) =>
													setBlankExercise((prev) => ({
														...prev,
														userInput: e.target.value,
													}))
												}
												className={`w-full border ${
													blankExercise.isCorrect === null
														? `border-gray-300 focus:ring-${currentTheme.secondaryColor} focus:border-${currentTheme.secondaryColor}`
														: blankExercise.isCorrect
														? "border-green-500 focus:ring-green-500 focus:border-green-500"
														: "border-red-500 focus:ring-red-500 focus:border-red-500"
												} rounded-lg p-3 focus:ring-2 focus:outline-none transition-all`}
												placeholder="Type the missing word"
											/>

											{blankExercise.isCorrect !== null && (
												<p
													className={`mt-2 text-sm ${
														blankExercise.isCorrect
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{blankExercise.isCorrect
														? "Correct! Well done."
														: `Incorrect. The correct answer is "${blankExercise.answer}".`}
												</p>
											)}
										</div>

										<div className="flex space-x-3">
											<button
												onClick={handleBlankSubmit}
												className={`flex-1 bg-${currentTheme.secondaryColor} hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors`}
											>
												Check Answer
											</button>
											<button
												onClick={() =>
													prepareFillInBlanksExercise(filteredWords)
												}
												className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
											>
												New Sentence
											</button>
										</div>

										{isActiveLesson && blankExercise.isCorrect && (
											<button
												onClick={handleNextExercise}
												className={`mt-4 w-full bg-gradient-to-r ${currentTheme.primaryColor} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
											>
												Next Exercise
											</button>
										)}

										<div className="mt-6 pt-4 border-t border-gray-100">
											<h3 className="font-medium text-gray-700 mb-2">
												Need a hint?
											</h3>
											<button
												onClick={() => {
													showToast(
														`The word starts with "${blankExercise.answer.charAt(
															0
														)}" and has ${
															blankExercise.answer.length
														} letters.`,
														"info"
													);
												}}
												className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
											>
												Get hint
											</button>
										</div>
									</div>
								</div>
							)}

							{currentExercise === "multipleChoice" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6">
										<h2 className="text-xl font-semibold mb-4">
											Multiple Choice
										</h2>
										<p className="text-gray-600 mb-6">
											Select the correct translation for the word.
										</p>

										<div className="p-4 bg-gray-50 rounded-lg mb-6 text-center">
											<h3 className="text-lg text-gray-500 mb-2">Translate</h3>
											<p className="text-2xl font-bold">
												{multipleChoiceExercise.question}
											</p>
										</div>

										<div className="space-y-3 mb-6">
											{multipleChoiceExercise.options.map((option, index) => (
												<button
													key={index}
													onClick={() =>
														setMultipleChoiceExercise((prev) => ({
															...prev,
															selectedOption: option,
														}))
													}
													className={`w-full p-3 rounded-lg text-left transition-all ${
														multipleChoiceExercise.isCorrect !== null
															? option === multipleChoiceExercise.correctAnswer
																? "bg-green-100 text-green-800 border-2 border-green-500"
																: option ===
																  multipleChoiceExercise.selectedOption
																? "bg-red-100 text-red-800 border-2 border-red-500"
																: "bg-gray-100 text-gray-800"
															: multipleChoiceExercise.selectedOption === option
															? `bg-${currentTheme.accentColor} border-2 border-${currentTheme.secondaryColor} text-${currentTheme.textColor}`
															: "bg-gray-100 hover:bg-gray-200 text-gray-800"
													}`}
												>
													{option}
													{multipleChoiceExercise.isCorrect !== null &&
														option === multipleChoiceExercise.correctAnswer && (
															<FaCheck className="float-right text-green-600" />
														)}
													{multipleChoiceExercise.isCorrect === false &&
														option ===
															multipleChoiceExercise.selectedOption && (
															<FaTimes className="float-right text-red-600" />
														)}
												</button>
											))}
										</div>

										<div className="flex space-x-3">
											<button
												onClick={handleMultipleChoiceSubmit}
												className={`flex-1 bg-${currentTheme.secondaryColor} hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors`}
												disabled={multipleChoiceExercise.isCorrect !== null}
											>
												Check Answer
											</button>
											<button
												onClick={() =>
													prepareMultipleChoiceExercise(filteredWords)
												}
												className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
											>
												New Question
											</button>
										</div>

										{isActiveLesson && multipleChoiceExercise.isCorrect && (
											<button
												onClick={handleNextExercise}
												className={`mt-4 w-full bg-gradient-to-r ${currentTheme.primaryColor} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
											>
												Next Exercise
											</button>
										)}
									</div>
								</div>
							)}

							{currentExercise === "speaking" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6">
										<h2 className="text-xl font-semibold mb-4">
											Pronunciation Practice
										</h2>
										<p className="text-gray-600 mb-6">
											Try to pronounce the word correctly. Click the speaker
											icon to hear it first.
										</p>

										<div className="p-6 bg-gray-50 rounded-lg mb-6 text-center">
											<h3 className="text-lg text-gray-500 mb-2">Pronounce</h3>
											<p className="text-3xl font-bold mb-4">
												{speakingExercise.word}
											</p>
											<p className="text-gray-600 text-sm mb-4">
												{speakingExercise.translation}
											</p>

											<button
												onClick={() => pronounceWord(speakingExercise.word)}
												className={`bg-${currentTheme.accentColor} text-${currentTheme.textColor} p-4 rounded-full transition-colors mb-4`}
												aria-label="Play pronunciation"
											>
												<FaVolumeUp className="text-xl" />
											</button>
										</div>

										<div className="flex flex-col items-center space-y-4">
											<div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-gray-200">
												<button
													onClick={() => {
														setSpeakingExercise((prev) => ({
															...prev,
															isRecording: !prev.isRecording,
														}));

														if (!speakingExercise.isRecording) {
															showToast("Recording started...", "info");

															setTimeout(() => {
																handleSpeakingSubmit();
															}, 3000);
														} else {
															handleSpeakingSubmit();
														}
													}}
													className={`w-20 h-20 rounded-full ${
														speakingExercise.isRecording
															? "bg-red-600 text-white animate-pulse"
															: "bg-indigo-600 text-white"
													} flex items-center justify-center transition-all`}
												>
													{speakingExercise.isRecording ? (
														<FaTimes className="text-xl" />
													) : (
														<FaMicrophone className="text-xl" />
													)}
												</button>
											</div>

											<p className="text-sm text-gray-600">
												{speakingExercise.isRecording
													? "Tap to stop recording"
													: "Tap to start recording"}
											</p>
										</div>

										<div className="mt-6 flex justify-between">
											<button
												onClick={() => prepareSpeakingExercise(filteredWords)}
												className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors"
											>
												New Word
											</button>

											{isActiveLesson && speakingExercise.hasTried && (
												<button
													onClick={handleNextExercise}
													className={`bg-gradient-to-r ${currentTheme.primaryColor} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
												>
													Next Exercise
												</button>
											)}
										</div>
									</div>
								</div>
							)}

							{currentExercise === "flashcard" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6 h-full">
										<h2 className="text-xl font-semibold mb-4">Word Details</h2>
										<div className="space-y-4">
											<div>
												<h3 className="text-sm font-medium text-gray-500">
													Difficulty
												</h3>
												<p className="font-medium">
													{currentWord.difficulty.charAt(0).toUpperCase() +
														currentWord.difficulty.slice(1)}
												</p>
											</div>

											<div>
												<h3 className="text-sm font-medium text-gray-500">
													Category
												</h3>
												<p className="font-medium capitalize">
													{currentWord.category}
												</p>
											</div>

											{currentWord.synonyms &&
												currentWord.synonyms.length > 0 && (
													<div>
														<h3 className="text-sm font-medium text-gray-500">
															Synonyms
														</h3>
														<p className="font-medium">
															{currentWord.synonyms.join(", ")}
														</p>
													</div>
												)}

											{currentWord.usageNotes && (
												<div>
													<h3 className="text-sm font-medium text-gray-500">
														Usage Notes
													</h3>
													<p className="text-sm text-gray-700">
														{currentWord.usageNotes}
													</p>
												</div>
											)}

											<div className="pt-4 border-t border-gray-100">
												<h3 className="text-sm font-medium text-gray-500 mb-2">
													Similar Words
												</h3>
												<div className="flex flex-wrap gap-2">
													{filteredWords
														.filter(
															(word) =>
																word.category === currentWord.category &&
																word.id !== currentWord.id
														)
														.slice(0, 3)
														.map((word) => (
															<div
																key={word.id}
																className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm cursor-pointer transition-colors"
																onClick={() => {
																	setCurrentWordIndex(
																		filteredWords.findIndex(
																			(w) => w.id === word.id
																		)
																	);
																	setIsFlipped(false);
																}}
															>
																{word.word}
															</div>
														))}
												</div>
											</div>

											{currentWord.contextSentences &&
												currentWord.contextSentences.length > 0 && (
													<div className="pt-4 border-t border-gray-100">
														<h3 className="text-sm font-medium text-gray-500 mb-2">
															More Example Sentences
														</h3>
														<ul className="space-y-2 text-sm text-gray-700">
															{currentWord.contextSentences.map(
																(sentence, index) => (
																	<li
																		key={index}
																		className="bg-gray-50 p-2 rounded"
																	>
																		{sentence}
																	</li>
																)
															)}
														</ul>
													</div>
												)}

											<div className="pt-4 border-t border-gray-100">
												<h3 className="text-lg font-medium mb-2">
													Practice with this word
												</h3>
												<p className="text-gray-600 mb-4">
													Try to use this word in a sentence of your own.
												</p>
												<textarea
													className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${currentTheme.secondaryColor} focus:border-${currentTheme.secondaryColor} focus:outline-none transition-all`}
													placeholder={`Write a sentence using "${currentWord.word}"...`}
													rows={3}
												></textarea>
												<button
													className={`mt-2 bg-${currentTheme.secondaryColor} hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors`}
												>
													Check my sentence
												</button>
											</div>
										</div>
									</div>
								</div>
							)}

							{currentExercise === "matching" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6 h-full">
										<h2 className="text-xl font-semibold mb-4">
											Matching Tips
										</h2>

										<div className="space-y-6">
											<div>
												<h3 className="text-lg font-medium mb-2">
													How This Exercise Works
												</h3>
												<p className="text-gray-600">
													The matching exercise helps you associate French words
													with their English translations. Click a word on the
													left and then its matching translation on the right.
												</p>
											</div>

											<div>
												<h3 className="font-medium text-gray-700 mb-2">
													Learning Strategy
												</h3>
												<div className="bg-indigo-50 rounded-lg p-4">
													<p className="text-gray-700 mb-3">
														Try to match the words without guessing randomly.
														First attempt to recall the meaning of each word
														before selecting a match.
													</p>
													<p className="text-gray-700">
														This strengthens your ability to remember vocabulary
														in real-world situations where you don't have
														multiple choices.
													</p>
												</div>
											</div>

											<div className="border-t border-gray-100 pt-4">
												<h3 className="font-medium text-gray-700 mb-2">
													Progress
												</h3>
												<div className="flex items-center space-x-2">
													<div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
														<div
															className="bg-indigo-600 h-full rounded-full"
															style={{
																width: `${
																	(Object.keys(matchingItems.matches).length /
																		matchingItems.words.length) *
																	100
																}%`,
															}}
														></div>
													</div>
													<span className="text-sm text-gray-600">
														{Object.keys(matchingItems.matches).length}/
														{matchingItems.words.length} matched
													</span>
												</div>
											</div>

											<div className="border-t border-gray-100 pt-4">
												<h3 className="font-medium text-gray-700 mb-3">
													Matched Words
												</h3>
												<div className="space-y-2">
													{Object.entries(matchingItems.matches).length > 0 ? (
														Object.entries(matchingItems.matches).map(
															([word, translation], index) => (
																<div
																	key={index}
																	className="flex justify-between items-center bg-green-50 p-3 rounded-lg"
																>
																	<span className="font-medium">{word}</span>
																	<FaArrowRight className="text-gray-400 mx-2" />
																	<span>{translation}</span>
																</div>
															)
														)
													) : (
														<p className="text-gray-500 text-sm italic">
															No matches yet. Start pairing words!
														</p>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{currentExercise === "fillInBlanks" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6 h-full">
										<h2 className="text-xl font-semibold mb-4">
											Fill-in-Blanks Tips
										</h2>

										<div className="space-y-6">
											<div>
												<h3 className="text-lg font-medium mb-2">
													About This Exercise
												</h3>
												<p className="text-gray-600">
													Fill-in-the-blanks exercises improve your recall
													ability and help you understand words in context.
													Complete the sentence by typing the missing French
													word.
												</p>
											</div>

											<div>
												<h3 className="font-medium text-gray-700 mb-2">
													Tips for Success
												</h3>
												<ul className="space-y-2 text-gray-700">
													<li className="flex items-start">
														<div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
															<span className="text-indigo-600 text-xs">1</span>
														</div>
														<p>
															Pay attention to context clues in the sentence.
														</p>
													</li>
													<li className="flex items-start">
														<div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
															<span className="text-indigo-600 text-xs">2</span>
														</div>
														<p>
															Remember to use the correct spelling, including
															accents.
														</p>
													</li>
													<li className="flex items-start">
														<div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
															<span className="text-indigo-600 text-xs">3</span>
														</div>
														<p>
															If you're stuck, use the hint button for a clue.
														</p>
													</li>
												</ul>
											</div>

											<div className="border-t border-gray-100 pt-4">
												<h3 className="font-medium text-gray-700 mb-2">
													Remember
												</h3>
												<div className="bg-yellow-50 rounded-lg p-4">
													<p className="text-gray-700">
														French words often have specific articles (le, la,
														les, un, une) and may require accents. The answer
														should only be the missing word itself, not
														including any articles.
													</p>
												</div>
											</div>

											<div className="border-t border-gray-100 pt-4">
												<h3 className="font-medium text-gray-700 mb-2">
													Need Character Accents?
												</h3>
												<div className="flex flex-wrap gap-2">
													{[
														"é",
														"è",
														"ê",
														"ë",
														"à",
														"â",
														"ù",
														"û",
														"ç",
														"ô",
														"œ",
														"ï",
														"î",
													].map((accent) => (
														<button
															key={accent}
															onClick={() => {
																setBlankExercise((prev) => ({
																	...prev,
																	userInput: prev.userInput + accent,
																}));
															}}
															className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-800"
														>
															{accent}
														</button>
													))}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{currentExercise === "multipleChoice" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6 h-full">
										<h2 className="text-xl font-semibold mb-4">
											Multiple Choice Tips
										</h2>

										<div className="space-y-6">
											<div>
												<h3 className="text-lg font-medium mb-2">
													About This Exercise
												</h3>
												<p className="text-gray-600">
													Multiple choice exercises test your recognition of
													French vocabulary. Select the correct English
													translation for each French word presented.
												</p>
											</div>

											<div>
												<h3 className="font-medium text-gray-700 mb-2">
													Strategy
												</h3>
												<div className="bg-indigo-50 rounded-lg p-4">
													<p className="text-gray-700 mb-3">
														Before selecting an answer, try to recall the
														meaning of the word without looking at the options.
														This helps strengthen your recall.
													</p>
													<p className="text-gray-700">
														If you're unsure, eliminate options that you know
														are incorrect to improve your chances of selecting
														the right answer.
													</p>
												</div>
											</div>

											<div className="border-t border-gray-100 pt-4">
												<h3 className="font-medium text-gray-700 mb-2">Tips</h3>
												<ul className="space-y-2 text-gray-700">
													<li className="flex items-start">
														<div className="flex-shrink-0 text-indigo-600 mr-2">
															<FaLightbulb />
														</div>
														<p>
															Pay attention to similar-looking words that might
															have different meanings.
														</p>
													</li>
													<li className="flex items-start">
														<div className="flex-shrink-0 text-indigo-600 mr-2">
															<FaLightbulb />
														</div>
														<p>
															Try to visualize the word in a context you're
															familiar with.
														</p>
													</li>
													<li className="flex items-start">
														<div className="flex-shrink-0 text-indigo-600 mr-2">
															<FaLightbulb />
														</div>
														<p>
															If you're not sure, make an educated guess and
															learn from the feedback.
														</p>
													</li>
												</ul>
											</div>

											<div className="border-t border-gray-100 pt-4">
												<h3 className="font-medium text-gray-700 mb-2">
													Pronunciation Help
												</h3>
												<button
													onClick={() =>
														pronounceWord(multipleChoiceExercise.question)
													}
													className={`w-full bg-${currentTheme.accentColor} hover:bg-indigo-100 text-${currentTheme.textColor} py-2 px-4 rounded-lg transition-colors flex items-center justify-center`}
												>
													<FaVolumeUp className="mr-2" />
													Hear the word
												</button>
											</div>
										</div>
									</div>
								</div>
							)}

							{currentExercise === "speaking" && (
								<div className="md:col-span-1">
									<div className="bg-white rounded-xl shadow-lg p-6 h-full">
										<h2 className="text-xl font-semibold mb-4">
											Pronunciation Tips
										</h2>

										<div className="space-y-6">
											<div>
												<h3 className="text-lg font-medium mb-2">
													About This Exercise
												</h3>
												<p className="text-gray-600">
													Speaking exercises help you develop proper French
													pronunciation. Listen carefully to the audio example,
													then record yourself saying the word.
												</p>
											</div>

											<div>
												<h3 className="font-medium text-gray-700 mb-2">
													French Pronunciation Tips
												</h3>
												<div className="bg-indigo-50 rounded-lg p-4 space-y-3">
													<p className="text-gray-700">
														<span className="font-medium">Nasal sounds:</span>{" "}
														Many French vowels are nasalized (pronounced through
														the nose), especially when followed by "n" or "m".
													</p>
													<p className="text-gray-700">
														<span className="font-medium">Silent letters:</span>{" "}
														French often has silent letters at the end of words,
														especially consonants like "s", "t", and "d".
													</p>
													<p className="text-gray-700">
														<span className="font-medium">R sound:</span> The
														French "r" is pronounced in the back of the throat,
														unlike the English "r".
													</p>
												</div>
											</div>

											<div className="border-t border-gray-100 pt-4">
												<h3 className="font-medium text-gray-700 mb-2">
													Current Word
												</h3>
												<div className="bg-gray-50 rounded-lg p-4">
													<p className="mb-1">
														<span className="font-medium">Word:</span>{" "}
														{speakingExercise.word}
													</p>
													<p className="mb-1">
														<span className="font-medium">Translation:</span>{" "}
														{speakingExercise.translation}
													</p>
													<p>
														<span className="font-medium">Phonetic:</span>{" "}
														{languageData.find(
															(w) => w.word === speakingExercise.word
														)?.pronunciation || ""}
													</p>
												</div>
											</div>

											<div className="border-t border-gray-100 pt-4">
												<h3 className="font-medium text-gray-700 mb-2">
													How to Improve
												</h3>
												<ul className="space-y-2 text-gray-700">
													<li className="flex items-start">
														<div className="flex-shrink-0 text-indigo-600 mr-2">
															<FaVolumeUp />
														</div>
														<p>
															Listen to the word multiple times before
															attempting to pronounce it.
														</p>
													</li>
													<li className="flex items-start">
														<div className="flex-shrink-0 text-indigo-600 mr-2">
															<FaMicrophone />
														</div>
														<p>
															Practice saying the word slowly, then gradually
															speed up to normal pace.
														</p>
													</li>
													<li className="flex items-start">
														<div className="flex-shrink-0 text-indigo-600 mr-2">
															<FaExchangeAlt />
														</div>
														<p>
															Record yourself and compare to the original
															pronunciation.
														</p>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			<Footer
				currentTheme={currentTheme}
				onLanguageSelect={() => setIsLanguageModalOpen(true)}
				onSettingsOpen={() => setIsSettingsModalOpen(true)}
			/>
			<Toast
				message={toastConfig.message}
				type={toastConfig.type}
				isVisible={toastConfig.isVisible}
				onClose={hideToast}
			/>

			<Modal
				isOpen={isProfileModalOpen}
				onClose={() => setIsProfileModalOpen(false)}
				title=""
				size="lg"
			>
				<ProfileSummary
					userProgress={userProgress}
					onClose={() => setIsProfileModalOpen(false)}
				/>
			</Modal>

			<Modal
				isOpen={isSettingsModalOpen}
				onClose={() => setIsSettingsModalOpen(false)}
				title=""
				size="lg"
			>
				<SettingsPanel
					settings={userSettings}
					onUpdateSettings={setUserSettings}
					onClose={() => setIsSettingsModalOpen(false)}
				/>
			</Modal>

			<Modal
				isOpen={isLanguageModalOpen}
				onClose={() => setIsLanguageModalOpen(false)}
				title=""
				size="md"
			>
				<LanguageSelector
					languages={availableLanguages}
					currentLanguage={currentLanguage}
					onSelectLanguage={handleLanguageChange}
					onClose={() => setIsLanguageModalOpen(false)}
				/>
			</Modal>

			<Modal
				isOpen={isWordDetailModalOpen}
				onClose={() => setIsWordDetailModalOpen(false)}
				title={selectedWord?.word || "Word Details"}
				size="md"
			>
				{selectedWord && (
					<div className="space-y-6">
						<div className="flex items-center">
							<div className="flex-1">
								<h2 className="text-2xl font-bold">{selectedWord.word}</h2>
								<p className="text-gray-600">{selectedWord.translation}</p>
								<p className="text-sm text-gray-500">
									{selectedWord.pronunciation}
								</p>
							</div>
							<button
								onClick={() => pronounceWord(selectedWord.word)}
								className={`bg-${currentTheme.accentColor} hover:bg-indigo-100 text-${currentTheme.textColor} p-3 rounded-full transition-colors`}
								aria-label="Pronounce word"
							>
								<FaVolumeUp />
							</button>
						</div>

						<div className="flex flex-wrap gap-2">
							<span
								className={`bg-${
									selectedWord.difficulty === "beginner"
										? "green-100 text-green-800"
										: selectedWord.difficulty === "intermediate"
										? "yellow-100 text-yellow-800"
										: "red-100 text-red-800"
								} px-2 py-1 rounded-full text-xs`}
							>
								{selectedWord.difficulty.charAt(0).toUpperCase() +
									selectedWord.difficulty.slice(1)}
							</span>
							<span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs capitalize">
								{selectedWord.category}
							</span>
							{userProgress.known.includes(selectedWord.id) && (
								<span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
									Mastered
								</span>
							)}
							{userProgress.learning.includes(selectedWord.id) && (
								<span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
									Learning
								</span>
							)}
						</div>

						<div className="border-t border-gray-100 pt-4">
							<h3 className="font-medium text-gray-700 mb-2">Example</h3>
							<p className="bg-gray-50 p-3 rounded-lg">
								{selectedWord.example}
							</p>
						</div>

						{selectedWord.contextSentences &&
							selectedWord.contextSentences.length > 0 && (
								<div className="border-t border-gray-100 pt-4">
									<h3 className="font-medium text-gray-700 mb-2">
										More Examples
									</h3>
									<div className="space-y-2">
										{selectedWord.contextSentences.map((sentence, index) => (
											<p key={index} className="bg-gray-50 p-2 rounded-lg">
												{sentence}
											</p>
										))}
									</div>
								</div>
							)}

						{selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
							<div className="border-t border-gray-100 pt-4">
								<h3 className="font-medium text-gray-700 mb-2">Synonyms</h3>
								<div className="flex flex-wrap gap-2">
									{selectedWord.synonyms.map((synonym, index) => (
										<span
											key={index}
											className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
										>
											{synonym}
										</span>
									))}
								</div>
							</div>
						)}

						{selectedWord.usageNotes && (
							<div className="border-t border-gray-100 pt-4">
								<h3 className="font-medium text-gray-700 mb-2">Usage Notes</h3>
								<p className="text-gray-600">{selectedWord.usageNotes}</p>
							</div>
						)}

						<div className="flex space-x-3 pt-4 border-t border-gray-100">
							<button
								onClick={() => {
									if (userProgress.known.includes(selectedWord.id)) {
										showToast("Word already marked as known", "info");
									} else {
										markAsKnown(selectedWord.id);
									}
									setIsWordDetailModalOpen(false);
								}}
								className={`flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ${
									userProgress.known.includes(selectedWord.id)
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
								disabled={userProgress.known.includes(selectedWord.id)}
							>
								{userProgress.known.includes(selectedWord.id)
									? "Already Known"
									: "Mark as Known"}
							</button>
							<button
								onClick={() => {
									if (userProgress.learning.includes(selectedWord.id)) {
										showToast("Word already marked for learning", "info");
									} else {
										markAsLearning(selectedWord.id);
									}
									setIsWordDetailModalOpen(false);
								}}
								className={`flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors ${
									userProgress.learning.includes(selectedWord.id)
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
								disabled={userProgress.learning.includes(selectedWord.id)}
							>
								{userProgress.learning.includes(selectedWord.id)
									? "Already Learning"
									: "Need to Practice"}
							</button>
						</div>
					</div>
				)}
			</Modal>

			<Modal
				isOpen={isPronunciationModalOpen}
				onClose={() => setIsPronunciationModalOpen(false)}
				title="Pronunciation Feedback"
				size="sm"
			>
				<PronunciationFeedback
					word={speakingExercise.word}
					accuracy={pronunciationAccuracy}
					onClose={() => setIsPronunciationModalOpen(false)}
				/>
			</Modal>

			<Modal
				isOpen={isCertificateModalOpen}
				onClose={() => setIsCertificateModalOpen(false)}
				title="Lesson Completed"
				size="md"
			>
				{completedLesson && (
					<Certificate
						lessonTitle={completedLesson.title}
						completionDate={new Date().toISOString()}
						onClose={() => setIsCertificateModalOpen(false)}
					/>
				)}
			</Modal>

			<style jsx>{`
				.perspective-1000 {
					perspective: 1000px;
				}

				.preserve-3d {
					transform-style: preserve-3d;
				}

				.backface-hidden {
					backface-visibility: hidden;
				}

				.rotate-y-180 {
					transform: rotateY(180deg);
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-in-out;
				}

				.animate-pulse {
					animation: pulse 1.5s infinite;
				}

				.hover\:scale-105:hover {
					transform: scale(1.05);
				}

				.scale-102 {
					transform: scale(1.02);
				}

				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.7;
					}
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.scroll-mt-20 {
					scroll-margin-top: 5rem;
				}

				@media (max-width: 640px) {
					.h-96 {
						height: 80vw;
					}
				}

				.text-size-small {
					font-size: 0.875rem;
				}

				.text-size-medium {
					font-size: 1rem;
				}

				.text-size-large {
					font-size: 1.125rem;
				}

				@font-face {
					font-family: "Script";
					src: url("https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap");
				}

				.font-script {
					font-family: "Script", cursive;
				}
			`}</style>
		</div>
	);
};

export default LanguageLearningApp;
