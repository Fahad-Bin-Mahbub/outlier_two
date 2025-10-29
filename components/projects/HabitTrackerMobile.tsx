"use client";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
	format,
	addDays,
	subDays,
	startOfWeek,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameDay,
	differenceInDays,
	isToday,
	parseISO,
} from "date-fns";
import Hammer from "hammerjs";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	BarChart,
	ResponsiveContainer,
	ReferenceLine,
	Bar,
} from "recharts";

interface Habit {
	id: string;
	name: string;
	icon: string;
	target: number;
	unit: string;
	color: string;
	currentStreak: number;
	longestStreak: number;
	progress: number;
	history: {
		date: string;
		value: number;
		completed: boolean;
	}[];
	badges: Badge[];
}

interface Badge {
	id: string;
	name: string;
	description: string;
	icon: string;
	unlocked: boolean;
	unlockedAt?: string;
}

const HabitTrackerApp: React.FC = () => {
	const initialHabits: Habit[] = [
		{
			id: "1",
			name: "Hydration",
			icon: "💧",
			target: 8,
			unit: "glasses",
			color: "bg-gradient-to-r from-blue-500 to-cyan-400",
			currentStreak: 5,
			longestStreak: 14,
			progress: 0.75,
			history: Array.from({ length: 30 }, (_, i) => ({
				date: format(subDays(new Date(), i), "yyyy-MM-dd"),
				value: Math.floor(Math.random() * 9),
				completed: Math.random() > 0.3,
			})),
			badges: [
				{
					id: "h1",
					name: "Hydration Rookie",
					description: "Complete your hydration goal 5 days in a row",
					icon: "🥉",
					unlocked: true,
					unlockedAt: "2025-05-20",
				},
				{
					id: "h2",
					name: "Hydration Expert",
					description: "Complete your hydration goal 14 days in a row",
					icon: "🥈",
					unlocked: false,
				},
				{
					id: "h3",
					name: "Hydration Master",
					description: "Complete your hydration goal 30 days in a row",
					icon: "🥇",
					unlocked: false,
				},
			],
		},
		{
			id: "2",
			name: "Meditation",
			icon: "🧘",
			target: 20,
			unit: "minutes",
			color: "bg-gradient-to-r from-violet-500 to-purple-500",
			currentStreak: 8,
			longestStreak: 12,
			progress: 0.6,
			history: Array.from({ length: 30 }, (_, i) => ({
				date: format(subDays(new Date(), i), "yyyy-MM-dd"),
				value: Math.floor(Math.random() * 25),
				completed: Math.random() > 0.25,
			})),
			badges: [
				{
					id: "m1",
					name: "Meditation Beginner",
					description: "Meditate for 7 days in a row",
					icon: "🥉",
					unlocked: true,
					unlockedAt: "2025-05-23",
				},
				{
					id: "m2",
					name: "Meditation Adept",
					description: "Meditate for 14 days in a row",
					icon: "🥈",
					unlocked: false,
				},
				{
					id: "m3",
					name: "Meditation Guru",
					description: "Meditate for 30 days in a row",
					icon: "🥇",
					unlocked: false,
				},
			],
		},
		{
			id: "3",
			name: "Exercise",
			icon: "🏃",
			target: 30,
			unit: "minutes",
			color: "bg-gradient-to-r from-red-500 to-orange-500",
			currentStreak: 3,
			longestStreak: 10,
			progress: 0.4,
			history: Array.from({ length: 30 }, (_, i) => ({
				date: format(subDays(new Date(), i), "yyyy-MM-dd"),
				value: Math.floor(Math.random() * 45),
				completed: Math.random() > 0.4,
			})),
			badges: [
				{
					id: "e1",
					name: "Exercise Starter",
					description: "Exercise for 5 days in a row",
					icon: "🥉",
					unlocked: false,
				},
				{
					id: "e2",
					name: "Exercise Pro",
					description: "Exercise for 10 days in a row",
					icon: "🥈",
					unlocked: false,
				},
				{
					id: "e3",
					name: "Exercise Champion",
					description: "Exercise for 30 days in a row",
					icon: "🥇",
					unlocked: false,
				},
			],
		},
		{
			id: "4",
			name: "Reading",
			icon: "📚",
			target: 20,
			unit: "pages",
			color: "bg-gradient-to-r from-emerald-500 to-green-500",
			currentStreak: 7,
			longestStreak: 15,
			progress: 0.85,
			history: Array.from({ length: 30 }, (_, i) => ({
				date: format(subDays(new Date(), i), "yyyy-MM-dd"),
				value: Math.floor(Math.random() * 35),
				completed: Math.random() > 0.2,
			})),
			badges: [
				{
					id: "r1",
					name: "Book Worm",
					description: "Read for 7 days in a row",
					icon: "🥉",
					unlocked: true,
					unlockedAt: "2025-05-22",
				},
				{
					id: "r2",
					name: "Literature Lover",
					description: "Read for 15 days in a row",
					icon: "🥈",
					unlocked: false,
				},
				{
					id: "r3",
					name: "Knowledge Seeker",
					description: "Read for 30 days in a row",
					icon: "🥇",
					unlocked: false,
				},
			],
		},
	];

	const [habits, setHabits] = useState<Habit[]>(initialHabits);
	const [activeHabitIndex, setActiveHabitIndex] = useState(0);
	const [activeView, setActiveView] = useState<
		"today" | "calendar" | "achievements" | "stats"
	>("today");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [showAddHabitModal, setShowAddHabitModal] = useState(false);
	const [showEditHabitModal, setShowEditHabitModal] = useState(false);
	const [newHabit, setNewHabit] = useState<Partial<Habit>>({
		name: "",
		target: 1,
		unit: "",
		color: "bg-gradient-to-r from-blue-500 to-cyan-400",
	});
	const [dateRangeView, setDateRangeView] = useState<"week" | "month">("week");
	const [isAddingProgress, setIsAddingProgress] = useState(false);
	const [progressAmount, setProgressAmount] = useState(1);
	const [showConfetti, setShowConfetti] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const [selectedTimeRange, setSelectedTimeRange] = useState<
		"week" | "month" | "year"
	>("week");
	const [isDarkMode, setIsDarkMode] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const habitContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 1024);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const triggerHapticFeedback = (intensity: "light" | "medium" | "heavy") => {
		if ("vibrate" in navigator) {
			switch (intensity) {
				case "light":
					navigator.vibrate(10);
					break;
				case "medium":
					navigator.vibrate(20);
					break;
				case "heavy":
					navigator.vibrate([30, 50, 30]);
					break;
			}
		}
	};

	useEffect(() => {
		if (!habitContentRef.current || isDesktop) return;

		const hammer = new Hammer(habitContentRef.current);
		hammer.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });

		hammer.on("swipeleft", () => {
			triggerHapticFeedback("light");
			setActiveHabitIndex((prev) =>
				prev < habits.length - 1 ? prev + 1 : prev
			);
		});

		hammer.on("swiperight", () => {
			triggerHapticFeedback("light");
			setActiveHabitIndex((prev) => (prev > 0 ? prev - 1 : prev));
		});

		return () => {
			hammer.destroy();
		};
	}, [habits.length, isDesktop]);

	const activeHabit = habits[activeHabitIndex];

	useEffect(() => {
		if (!activeHabit) return;

		const updatedHabits = [...habits];
		let hasNewBadge = false;

		updatedHabits[activeHabitIndex].badges = activeHabit.badges.map((badge) => {
			if (badge.unlocked) return badge;

			let shouldUnlock = false;

			if (
				badge.id === `${activeHabit.id.charAt(0)}1` &&
				activeHabit.currentStreak >= 5
			) {
				shouldUnlock = true;
			} else if (
				badge.id === `${activeHabit.id.charAt(0)}2` &&
				activeHabit.currentStreak >= 14
			) {
				shouldUnlock = true;
			} else if (
				badge.id === `${activeHabit.id.charAt(0)}3` &&
				activeHabit.currentStreak >= 30
			) {
				shouldUnlock = true;
			}

			if (shouldUnlock && !badge.unlocked) {
				hasNewBadge = true;
				setToastMessage(`🎉 New badge unlocked: ${badge.name}!`);
				setShowToast(true);
				setTimeout(() => setShowToast(false), 3000);

				return {
					...badge,
					unlocked: true,
					unlockedAt: format(new Date(), "yyyy-MM-dd"),
				};
			}

			return badge;
		});

		if (hasNewBadge) {
			setHabits(updatedHabits);
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 3000);
			triggerHapticFeedback("heavy");
		}
	}, [habits, activeHabitIndex]);

	const handleAddProgress = () => {
		if (!activeHabit) return;

		triggerHapticFeedback("medium");

		const todayFormatted = format(new Date(), "yyyy-MM-dd");
		const updatedHabits = [...habits];
		const habitIndex = updatedHabits.findIndex((h) => h.id === activeHabit.id);

		if (habitIndex === -1) return;

		const todayEntryIndex = updatedHabits[habitIndex].history.findIndex(
			(entry) => entry.date === todayFormatted
		);

		if (todayEntryIndex >= 0) {
			const newValue =
				updatedHabits[habitIndex].history[todayEntryIndex].value +
				progressAmount;
			updatedHabits[habitIndex].history[todayEntryIndex].value = newValue;
			updatedHabits[habitIndex].history[todayEntryIndex].completed =
				newValue >= activeHabit.target;
		} else {
			updatedHabits[habitIndex].history.unshift({
				date: todayFormatted,
				value: progressAmount,
				completed: progressAmount >= activeHabit.target,
			});
		}

		const todayEntry = updatedHabits[habitIndex].history.find(
			(entry) => entry.date === todayFormatted
		);
		if (todayEntry) {
			updatedHabits[habitIndex].progress = Math.min(
				todayEntry.value / activeHabit.target,
				1
			);
		}

		let streak = 0;
		let dayToCheck = new Date();
		let continueChecking = true;

		while (continueChecking) {
			const formattedDate = format(dayToCheck, "yyyy-MM-dd");
			const entry = updatedHabits[habitIndex].history.find(
				(e) => e.date === formattedDate
			);

			if (entry && entry.completed) {
				streak++;
				dayToCheck = subDays(dayToCheck, 1);
			} else {
				continueChecking = false;
			}
		}

		updatedHabits[habitIndex].currentStreak = streak;

		if (streak > updatedHabits[habitIndex].longestStreak) {
			updatedHabits[habitIndex].longestStreak = streak;
		}

		const justCompleted =
			todayEntryIndex >= 0 &&
			!updatedHabits[habitIndex].history[todayEntryIndex].completed &&
			updatedHabits[habitIndex].progress >= 1;

		if (justCompleted) {
			triggerHapticFeedback("heavy");
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 3000);
			setToastMessage(
				`🎉 Great job! You've completed your ${activeHabit.name} goal today!`
			);
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		}

		setHabits(updatedHabits);
		setIsAddingProgress(false);
		setProgressAmount(1);
	};

	const handleEditHabit = () => {
		if (!activeHabit) return;

		setNewHabit({
			name: activeHabit.name,
			target: activeHabit.target,
			unit: activeHabit.unit,
			color: activeHabit.color,
		});

		setShowEditHabitModal(true);
	};

	const handleUpdateHabit = () => {
		if (!activeHabit || !newHabit.name || !newHabit.unit) return;

		const updatedHabits = [...habits];
		const habitIndex = updatedHabits.findIndex((h) => h.id === activeHabit.id);

		if (habitIndex === -1) return;

		updatedHabits[habitIndex] = {
			...updatedHabits[habitIndex],
			name: newHabit.name || updatedHabits[habitIndex].name,
			target: newHabit.target || updatedHabits[habitIndex].target,
			unit: newHabit.unit || updatedHabits[habitIndex].unit,
			color: newHabit.color || updatedHabits[habitIndex].color,
		};

		setHabits(updatedHabits);
		setShowEditHabitModal(false);

		triggerHapticFeedback("medium");
		setToastMessage(
			`✅ Habit "${updatedHabits[habitIndex].name}" updated successfully!`
		);
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	const handleAddHabit = () => {
		if (!newHabit.name || !newHabit.unit) return;

		const icons = [
			"💧",
			"🧘",
			"🏃",
			"📚",
			"🍎",
			"💤",
			"💪",
			"🧠",
			"🎯",
			"🎨",
			"🎸",
			"📝",
		];
		const randomIcon = icons[Math.floor(Math.random() * icons.length)];

		const newHabitObj: Habit = {
			id: (habits.length + 1).toString(),
			name: newHabit.name || "",
			icon: randomIcon,
			target: newHabit.target || 1,
			unit: newHabit.unit || "",
			color: newHabit.color || "bg-gradient-to-r from-blue-500 to-cyan-400",
			currentStreak: 0,
			longestStreak: 0,
			progress: 0,
			history: [],
			badges: [
				{
					id: `custom1-${habits.length + 1}`,
					name: `${newHabit.name} Beginner`,
					description: `Complete your ${newHabit.name} goal 5 days in a row`,
					icon: "🥉",
					unlocked: false,
				},
				{
					id: `custom2-${habits.length + 1}`,
					name: `${newHabit.name} Adept`,
					description: `Complete your ${newHabit.name} goal 14 days in a row`,
					icon: "🥈",
					unlocked: false,
				},
				{
					id: `custom3-${habits.length + 1}`,
					name: `${newHabit.name} Master`,
					description: `Complete your ${newHabit.name} goal 30 days in a row`,
					icon: "🥇",
					unlocked: false,
				},
			],
		};

		setHabits([...habits, newHabitObj]);
		setShowAddHabitModal(false);
		setNewHabit({
			name: "",
			target: 1,
			unit: "",
			color: "bg-gradient-to-r from-blue-500 to-cyan-400",
		});

		triggerHapticFeedback("medium");
		setToastMessage(`✨ New habit "${newHabitObj.name}" added successfully!`);
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);

		setActiveHabitIndex(habits.length);
	};

	const handleDeleteHabit = () => {
		if (!activeHabit) return;

		const habitName = activeHabit.name;
		const updatedHabits = habits.filter((h) => h.id !== activeHabit.id);

		setHabits(updatedHabits);
		setActiveHabitIndex(0);

		triggerHapticFeedback("heavy");
		setToastMessage(`❌ Habit "${habitName}" deleted successfully.`);
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);

		setShowEditHabitModal(false);
	};

	const getDaysForView = () => {
		if (dateRangeView === "week") {
			const weekStart = startOfWeek(selectedDate);
			return eachDayOfInterval({
				start: weekStart,
				end: addDays(weekStart, 6),
			});
		} else {
			const monthStart = startOfMonth(selectedDate);
			const monthEnd = endOfMonth(selectedDate);
			return eachDayOfInterval({
				start: monthStart,
				end: monthEnd,
			});
		}
	};

	const calendarDays = getDaysForView();

	const getStreakData = (habit: Habit, days: number = 7) => {
		const data = [];
		for (let i = 0; i < days; i++) {
			const date = subDays(new Date(), i);
			const formattedDate = format(date, "yyyy-MM-dd");
			const entry = habit.history.find((e) => e.date === formattedDate);

			data.unshift({
				date: formattedDate,
				label: format(date, "EEE"),
				value: entry ? entry.value : 0,
				completed: entry ? entry.completed : false,
			});
		}
		return data;
	};

	const getCompletionRate = (habit: Habit, days: number = 30) => {
		const recentHistory = habit.history.filter((entry) => {
			const entryDate = parseISO(entry.date);
			const daysAgo = differenceInDays(new Date(), entryDate);
			return daysAgo < days;
		});

		if (recentHistory.length === 0) return 0;

		const completedDays = recentHistory.filter(
			(entry) => entry.completed
		).length;
		return Math.round(
			(completedDays / Math.min(days, recentHistory.length)) * 100
		);
	};

	const renderFlame = (streak: number) => {
		if (streak < 3) return null;

		return (
			<span
				className="ml-2 text-base sm:text-lg animate-flame-pulse"
				style={{
					filter: "drop-shadow(0 0 4px rgba(255, 165, 0, 0.6))",
					display: "inline-block",
				}}
			>
				🔥
			</span>
		);
	};

	const renderProgressRing = (habit: Habit, size: number = 160) => {
		const radius = size / 2;
		const strokeWidth = size / 16;
		const normalizedRadius = radius - strokeWidth / 2;
		const circumference = normalizedRadius * 2 * Math.PI;
		const strokeDashoffset = circumference - habit.progress * circumference;

		const getGradientColors = () => {
			if (habit.color.includes("blue")) return ["#3b82f6", "#22d3ee"];
			if (habit.color.includes("purple")) return ["#8b5cf6", "#a855f7"];
			if (habit.color.includes("red")) return ["#ef4444", "#f97316"];
			if (habit.color.includes("green")) return ["#10b981", "#22c55e"];
			if (habit.color.includes("pink")) return ["#ec4899", "#f43f5e"];
			if (habit.color.includes("yellow")) return ["#f59e0b", "#fbbf24"];
			if (habit.color.includes("indigo")) return ["#6366f1", "#3b82f6"];
			if (habit.color.includes("teal")) return ["#14b8a6", "#10b981"];
			return ["#3b82f6", "#22d3ee"];
		};

		const [startColor, endColor] = getGradientColors();

		return (
			<div
				className="relative flex items-center justify-center"
				style={{ width: size, height: size }}
			>
				{}
				<div
					className="absolute rounded-full"
					style={{
						width: size,
						height: size,
						background: `radial-gradient(circle, rgba(255,255,255,0) 60%, rgba(0,0,0,0.06) 100%)`,
						filter: "blur(2px)",
					}}
				/>

				<svg height={size} width={size} className="transform -rotate-90">
					{}
					<circle
						stroke="#e6e6e6"
						fill="transparent"
						strokeWidth={strokeWidth}
						r={normalizedRadius}
						cx={radius}
						cy={radius}
						className="opacity-50"
					/>

					{}
					<circle
						stroke={`url(#gradient-${habit.id})`}
						fill="transparent"
						strokeWidth={strokeWidth}
						strokeDasharray={circumference + " " + circumference}
						style={{ strokeDashoffset }}
						strokeLinecap="round"
						r={normalizedRadius}
						cx={radius}
						cy={radius}
						className="transition-all duration-500 ease-in-out"
						filter="drop-shadow(0 0 2px rgba(0, 0, 0, 0.1))"
					/>

					{}
					<defs>
						<linearGradient
							id={`gradient-${habit.id}`}
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop offset="0%" stopColor={startColor} />
							<stop offset="100%" stopColor={endColor} />
						</linearGradient>
					</defs>
				</svg>

				{}
				<div className="absolute inset-0 flex items-center justify-center flex-col">
					<span className="text-3xl font-bold text-gray-800 transition-all">
						{Math.round(habit.progress * 100)}%
					</span>
					<span className="text-sm text-gray-500 mt-1 font-medium">
						{habit.name}
					</span>
				</div>
			</div>
		);
	};

	const renderSmallProgressRing = (habit: Habit, size: number = 80) => {
		const radius = size / 2;
		const strokeWidth = size / 12;
		const normalizedRadius = radius - strokeWidth / 2;
		const circumference = normalizedRadius * 2 * Math.PI;
		const strokeDashoffset = circumference - habit.progress * circumference;

		const getGradientColors = () => {
			if (habit.color.includes("blue")) return ["#3b82f6", "#22d3ee"];
			if (habit.color.includes("purple")) return ["#8b5cf6", "#a855f7"];
			if (habit.color.includes("red")) return ["#ef4444", "#f97316"];
			if (habit.color.includes("green")) return ["#10b981", "#22c55e"];
			if (habit.color.includes("pink")) return ["#ec4899", "#f43f5e"];
			if (habit.color.includes("yellow")) return ["#f59e0b", "#fbbf24"];
			if (habit.color.includes("indigo")) return ["#6366f1", "#3b82f6"];
			if (habit.color.includes("teal")) return ["#14b8a6", "#10b981"];
			return ["#3b82f6", "#22d3ee"];
		};

		const [startColor, endColor] = getGradientColors();

		return (
			<div
				className="relative flex items-center justify-center"
				style={{ width: size, height: size }}
			>
				<svg height={size} width={size} className="transform -rotate-90">
					{}
					<circle
						stroke="#e6e6e6"
						fill="transparent"
						strokeWidth={strokeWidth}
						r={normalizedRadius}
						cx={radius}
						cy={radius}
						className="opacity-50"
					/>

					{}
					<circle
						stroke={`url(#gradient-small-${habit.id})`}
						fill="transparent"
						strokeWidth={strokeWidth}
						strokeDasharray={circumference + " " + circumference}
						style={{ strokeDashoffset }}
						strokeLinecap="round"
						r={normalizedRadius}
						cx={radius}
						cy={radius}
						className="transition-all duration-500 ease-in-out"
					/>

					{}
					<defs>
						<linearGradient
							id={`gradient-small-${habit.id}`}
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop offset="0%" stopColor={startColor} />
							<stop offset="100%" stopColor={endColor} />
						</linearGradient>
					</defs>
				</svg>

				{}
				<div className="absolute inset-0 flex items-center justify-center">
					<span
						className="font-bold text-gray-800"
						style={{ fontSize: Math.max(size / 5, 12) + "px" }}
					>
						{Math.round(habit.progress * 100)}
					</span>
				</div>
			</div>
		);
	};

	const renderConfetti = () => {
		if (!showConfetti) return null;

		const confettiElements = [];
		const confettiColors = [
			"#ff6b6b",
			"#5eead4",
			"#fcd34d",
			"#a78bfa",
			"#60a5fa",
			"#c084fc",
			"#fdba74",
			"#86efac",
			"#f472b6",
		];

		for (let i = 0; i < 150; i++) {
			const left = Math.random() * 100;
			const width = Math.random() * 10 + 3;
			const height = Math.random() * 10 + 3;
			const color =
				confettiColors[Math.floor(Math.random() * confettiColors.length)];
			const delay = Math.random() * 0.5;
			const duration = Math.random() * 3 + 2;
			const rotation = Math.random() * 360;
			const shape = Math.random() > 0.7 ? "circle" : "square";

			confettiElements.push(
				<div
					key={i}
					className={`absolute ${
						shape === "circle" ? "rounded-full" : "rounded-sm"
					}`}
					style={{
						left: `${left}%`,
						width,
						height: shape === "circle" ? width : height,
						top: -20,
						transform: `rotate(${rotation}deg)`,
						animation: `confetti ${duration}s ease-out ${delay}s forwards`,
						backgroundColor: color,
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						zIndex: 9999,
					}}
				/>
			);
		}

		return (
			<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
				{confettiElements}
			</div>
		);
	};

	const renderHabitTabs = () => {
		return (
			<div
				className="flex items-center space-x-2 mb-4 sm:mb-6 px-2 pb-1 overflow-x-auto hide-scrollbar"
				style={{ scrollbarWidth: "none" }}
			>
				{habits.map((habit, index) => {
					const getGradientColors = () => {
						if (habit.color.includes("blue")) return ["#3b82f6", "#22d3ee"];
						if (habit.color.includes("purple")) return ["#8b5cf6", "#a855f7"];
						if (habit.color.includes("red")) return ["#ef4444", "#f97316"];
						if (habit.color.includes("green")) return ["#10b981", "#22c55e"];
						if (habit.color.includes("pink")) return ["#ec4899", "#f43f5e"];
						if (habit.color.includes("yellow")) return ["#f59e0b", "#fbbf24"];
						if (habit.color.includes("indigo")) return ["#6366f1", "#3b82f6"];
						if (habit.color.includes("teal")) return ["#14b8a6", "#10b981"];
						return ["#3b82f6", "#22d3ee"];
					};

					const [startColor, endColor] = getGradientColors();

					return (
						<button
							key={habit.id}
							className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
								activeHabitIndex === index
									? "text-white shadow-md transform scale-105"
									: "bg-white  text-gray-700  shadow-sm hover:shadow"
							}`}
							style={
								activeHabitIndex === index
									? {
											background: `linear-gradient(to right, ${startColor}, ${endColor})`,
											boxShadow: `0 4px 6px -1px rgba(${
												startColor
													.replace("#", "")
													.match(/.{1,2}/g)
													?.map((hex) => parseInt(hex, 16))
													.join(", ") || "0,0,0"
											}, 0.1)`,
									  }
									: {}
							}
							onClick={() => {
								setActiveHabitIndex(index);
								triggerHapticFeedback("light");
							}}
						>
							<span className="mr-1">{habit.icon}</span>
							<span>{habit.name}</span>
						</button>
					);
				})}
				<button
					className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white  text-gray-700  flex items-center shadow-sm hover:shadow whitespace-nowrap"
					onClick={() => {
						setShowAddHabitModal(true);
						triggerHapticFeedback("light");
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
							clipRule="evenodd"
						/>
					</svg>
					<span>Add Habit</span>
				</button>
			</div>
		);
	};

	const renderNavTabs = () => {
		return (
			<div className="flex items-center justify-around mb-4 sm:mb-6 border-b border-gray-200  relative">
				{(["today", "calendar", "achievements", "stats"] as const).map(
					(view) => (
						<button
							key={view}
							className={`px-2 py-2.5 text-xs sm:text-sm font-medium transition-colors duration-200 relative ${
								activeView === view
									? "text-blue-600 "
									: "text-gray-500  hover:text-gray-800 "
							}`}
							onClick={() => {
								setActiveView(view);
								triggerHapticFeedback("light");
							}}
						>
							{view.charAt(0).toUpperCase() + view.slice(1)}
							{activeView === view && (
								<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600  rounded-t-full transition-all duration-300"></span>
							)}
						</button>
					)
				)}
			</div>
		);
	};

	const renderTodayView = () => {
		if (!activeHabit) return null;

		const todayEntry = activeHabit.history.find(
			(entry) => entry.date === format(new Date(), "yyyy-MM-dd")
		);

		const getGradientColors = () => {
			if (activeHabit.color.includes("blue")) return ["#3b82f6", "#22d3ee"];
			if (activeHabit.color.includes("purple")) return ["#8b5cf6", "#a855f7"];
			if (activeHabit.color.includes("red")) return ["#ef4444", "#f97316"];
			if (activeHabit.color.includes("green")) return ["#10b981", "#22c55e"];
			if (activeHabit.color.includes("pink")) return ["#ec4899", "#f43f5e"];
			if (activeHabit.color.includes("yellow")) return ["#f59e0b", "#fbbf24"];
			if (activeHabit.color.includes("indigo")) return ["#6366f1", "#3b82f6"];
			if (activeHabit.color.includes("teal")) return ["#14b8a6", "#10b981"];
			return ["#3b82f6", "#22d3ee"];
		};

		const [startColor, endColor] = getGradientColors();

		return (
			<div className="space-y-5">
				<div className="flex flex-col items-center">
					<div className="text-5xl mb-3">{activeHabit.icon}</div>
					<h2 className="text-xl sm:text-2xl font-bold text-gray-800  mb-1">
						{activeHabit.name}
					</h2>
					<p className="text-sm text-gray-600 ">
						Daily Goal: {activeHabit.target} {activeHabit.unit}
					</p>
				</div>

				<div className="flex justify-center relative">
					{renderProgressRing(activeHabit)}
				</div>

				<div className="grid grid-cols-2 gap-3 sm:gap-4 mt-5">
					<div className="bg-white  rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
						<p className="text-xs sm:text-sm text-gray-500 ">Current Streak</p>

						<div className="flex items-center">
							<p className="text-xl sm:text-2xl font-bold text-gray-800 ">
								{activeHabit.currentStreak}
							</p>
							<p className="text-xs sm:text-sm text-gray-600  ml-1">days</p>
							{activeHabit.currentStreak >= 3 &&
								renderFlame(activeHabit.currentStreak)}
						</div>
					</div>
					<div className="bg-white  rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
						<p className="text-xs sm:text-sm text-gray-500 ">Longest Streak</p>
						<div className="flex items-center">
							<p className="text-xl sm:text-2xl font-bold text-gray-800 ">
								{activeHabit.longestStreak}
							</p>
							<p className="text-xs sm:text-sm text-gray-600  ml-1">days</p>
						</div>
					</div>
				</div>

				<div className="bg-white  rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
					<p className="text-xs sm:text-sm font-medium text-gray-700  mb-3">
						Today's Progress
					</p>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xl sm:text-2xl font-semibold text-gray-800 ">
								{todayEntry ? todayEntry.value : 0}
								<span className="text-sm sm:text-lg font-normal text-gray-500 ">
									{" "}
									/ {activeHabit.target} {activeHabit.unit}
								</span>
							</p>
							{todayEntry && todayEntry.completed && (
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800   mt-1">
									✓ Completed today
								</span>
							)}
						</div>
						<button
							className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium text-white shadow-md transition transform hover:scale-105 active:scale-95"
							style={{
								background: `linear-gradient(to right, ${startColor}, ${endColor})`,
							}}
							onClick={() => {
								setIsAddingProgress(true);
								triggerHapticFeedback("light");
							}}
						>
							Add Progress
						</button>
					</div>
				</div>

				<div className="flex justify-end mt-3">
					<button
						className="flex items-center text-xs sm:text-sm text-gray-500  hover:text-gray-700  transition-colors py-1 px-2 rounded-md hover:bg-gray-100 "
						onClick={handleEditHabit}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
						</svg>
						Edit Habit
					</button>
				</div>
			</div>
		);
	};

	const renderCalendarView = () => {
		if (!activeHabit) return null;

		const getGradientColors = () => {
			if (activeHabit.color.includes("blue")) return ["#3b82f6", "#22d3ee"];
			if (activeHabit.color.includes("purple")) return ["#8b5cf6", "#a855f7"];
			if (activeHabit.color.includes("red")) return ["#ef4444", "#f97316"];
			if (activeHabit.color.includes("green")) return ["#10b981", "#22c55e"];
			return ["#3b82f6", "#22d3ee"];
		};

		const [startColor, endColor] = getGradientColors();

		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between mb-4 sm:mb-6">
					<h3 className="text-lg sm:text-xl font-semibold text-gray-800 ">
						{format(selectedDate, "MMMM yyyy")}
					</h3>
					<div className="flex items-center space-x-1 sm:space-x-2">
						<button
							className="p-1.5 sm:p-2 rounded-full bg-gray-100  text-gray-600  hover:bg-gray-200  transition-colors"
							onClick={() => {
								setSelectedDate(
									subDays(selectedDate, dateRangeView === "week" ? 7 : 30)
								);
								triggerHapticFeedback("light");
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 sm:h-5 sm:w-5"
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
						<button
							className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
								dateRangeView === "week"
									? "bg-blue-100  text-blue-600 "
									: "bg-gray-100  text-gray-600  hover:bg-gray-200 "
							}`}
							onClick={() => {
								setDateRangeView("week");
								triggerHapticFeedback("light");
							}}
						>
							Week
						</button>
						<button
							className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
								dateRangeView === "month"
									? "bg-blue-100  text-blue-600 "
									: "bg-gray-100  text-gray-600  hover:bg-gray-200 "
							}`}
							onClick={() => {
								setDateRangeView("month");
								triggerHapticFeedback("light");
							}}
						>
							Month
						</button>
						<button
							className="p-1.5 sm:p-2 rounded-full bg-gray-100  text-gray-600  hover:bg-gray-200  transition-colors"
							onClick={() => {
								setSelectedDate(
									addDays(selectedDate, dateRangeView === "week" ? 7 : 30)
								);
								triggerHapticFeedback("light");
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 sm:h-5 sm:w-5"
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

				<div className="grid grid-cols-7 gap-1 text-center mb-2 sm:mb-3">
					{["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
						<div
							key={i}
							className="text-xs sm:text-sm font-medium text-gray-500 "
						>
							{day}
						</div>
					))}
				</div>

				<div
					className={`grid grid-cols-7 gap-1 ${
						dateRangeView === "month" ? "sm:gap-2" : ""
					}`}
				>
					{calendarDays.map((day) => {
						const formattedDate = format(day, "yyyy-MM-dd");
						const entry = activeHabit.history.find(
							(e) => e.date === formattedDate
						);
						const isCompleted = entry && entry.completed;
						const isPartial = entry && !entry.completed && entry.value > 0;
						const dayIsToday = isToday(day);

						return (
							<div
								key={formattedDate}
								className={`relative aspect-square flex flex-col items-center justify-center rounded-lg p-1 transition-all ${
									dayIsToday ? "bg-blue-50 /30 border border-blue-200 " : ""
								}`}
							>
								<span
									className={`text-xs ${
										dayIsToday ? "font-bold text-blue-600 " : "text-gray-700 "
									}`}
								>
									{format(day, "d")}
								</span>
								{isCompleted && (
									<div
										className="w-5 h-5 sm:w-6 sm:h-6 mt-1 rounded-full flex items-center justify-center shadow-sm"
										style={{
											background: `linear-gradient(to right, ${startColor}, ${endColor})`,
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-3 w-3 sm:h-4 sm:w-4 text-white"
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
								{isPartial && (
									<div
										className="w-5 h-5 sm:w-6 sm:h-6 mt-1 rounded-full flex items-center justify-center"
										style={{
											border: `2px solid ${startColor}`,
											background: `linear-gradient(to right, ${startColor}33, ${endColor}33)`,
										}}
									>
										<span className="text-[10px] sm:text-xs font-medium text-gray-700 ">
											{Math.round(
												((entry?.value || 0) / activeHabit.target) * 100
											)}
										</span>
									</div>
								)}
							</div>
						);
					})}
				</div>

				<div className="mt-6 sm:mt-8 bg-white  rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
					<h4 className="text-sm sm:text-base font-semibold text-gray-800  mb-4">
						Monthly Statistics
					</h4>
					<div className="grid grid-cols-2 gap-4 sm:gap-6">
						<div>
							<p className="text-xs sm:text-sm text-gray-500  mb-1">
								Completion Rate
							</p>
							<div className="flex items-baseline">
								<p className="text-lg sm:text-2xl font-bold text-gray-800 ">
									{Math.round(
										(activeHabit.history.filter((e) => {
											const date = new Date(e.date);
											const month = date.getMonth();
											const year = date.getFullYear();
											const selectedMonth = selectedDate.getMonth();
											const selectedYear = selectedDate.getFullYear();
											return (
												month === selectedMonth &&
												year === selectedYear &&
												e.completed
											);
										}).length /
											Math.min(new Date().getDate(), calendarDays.length)) *
											100
									)}
									%
								</p>
								<span className="ml-1 text-xs sm:text-sm text-gray-500 ">
									of days
								</span>
							</div>
						</div>
						<div>
							<p className="text-xs sm:text-sm text-gray-500  mb-1">Best Day</p>
							<p className="text-lg sm:text-xl font-bold text-gray-800 ">
								{(() => {
									const monthEntries = activeHabit.history.filter((e) => {
										const date = new Date(e.date);
										const month = date.getMonth();
										const year = date.getFullYear();
										const selectedMonth = selectedDate.getMonth();
										const selectedYear = selectedDate.getFullYear();
										return month === selectedMonth && year === selectedYear;
									});

									if (monthEntries.length === 0) return "N/A";

									const bestEntry = monthEntries.reduce(
										(best, current) =>
											current.value > best.value ? current : best,
										monthEntries[0]
									);

									return (
										<>
											<span>{format(new Date(bestEntry.date), "d")}</span>
											<span className="text-sm sm:text-base font-normal text-gray-600  ml-1">
												({bestEntry.value} {activeHabit.unit})
											</span>
										</>
									);
								})()}
							</p>
						</div>
					</div>

					<div className="mt-5 sm:mt-6">
						<p className="text-xs sm:text-sm text-gray-500  mb-3">
							Daily Progress
						</p>
						<div className="h-48 sm:h-56 w-full">
							{(() => {
								const data = getStreakData(activeHabit, 7);

								const chartData = data.map((item) => ({
									name: item.label,
									value: item.value,
									target: activeHabit.target,
									completed: item.completed,
								}));

								return (
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={chartData}
											margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
										>
											<CartesianGrid
												strokeDasharray="3 3"
												vertical={false}
												stroke="#e5e7eb"
											/>
											<XAxis
												dataKey="name"
												tick={{ fontSize: 12 }}
												tickLine={false}
												axisLine={{ stroke: "#e5e7eb" }}
											/>
											<YAxis
												tick={{ fontSize: 12 }}
												tickLine={false}
												axisLine={{ stroke: "#e5e7eb" }}
												width={25}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "white",
													borderRadius: "8px",
													border: "none",
													boxShadow:
														"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
													color: "#1f2937",
												}}
												formatter={(value) => [
													`${value} ${activeHabit.unit}`,
													"Progress",
												]}
												labelFormatter={(label) => `${label}`}
											/>
											<ReferenceLine
												y={activeHabit.target}
												stroke="#9333ea"
												strokeDasharray="3 3"
											></ReferenceLine>
											<Bar
												dataKey="value"
												fill={startColor}
												radius={[4, 4, 0, 0]}
												barSize={24}
												name="Progress"
											/>
										</BarChart>
									</ResponsiveContainer>
								);
							})()}
						</div>

						<div className="mt-3 border-t border-gray-100  pt-3 flex justify-between text-[10px] sm:text-xs text-gray-500 ">
							<span>
								Target: {activeHabit.target} {activeHabit.unit}
							</span>
							<span>Last 7 days</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderAchievementsView = () => {
		if (!activeHabit) return null;

		const getGradientColors = () => {
			if (activeHabit.color.includes("blue")) return ["#3b82f6", "#22d3ee"];
			if (activeHabit.color.includes("purple")) return ["#8b5cf6", "#a855f7"];
			if (activeHabit.color.includes("red")) return ["#ef4444", "#f97316"];
			if (activeHabit.color.includes("green")) return ["#10b981", "#22c55e"];
			if (activeHabit.color.includes("pink")) return ["#ec4899", "#f43f5e"];
			if (activeHabit.color.includes("yellow")) return ["#f59e0b", "#fbbf24"];
			if (activeHabit.color.includes("indigo")) return ["#6366f1", "#3b82f6"];
			if (activeHabit.color.includes("teal")) return ["#14b8a6", "#10b981"];
			return ["#3b82f6", "#22d3ee"];
		};

		const [startColor, endColor] = getGradientColors();

		return (
			<div className="space-y-5">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-lg sm:text-xl font-semibold text-gray-800 ">
						Achievements
					</h3>
					<span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-100 /50 text-blue-600  text-xs sm:text-sm font-medium">
						{activeHabit.badges.filter((b) => b.unlocked).length} /{" "}
						{activeHabit.badges.length}
					</span>
				</div>

				<div className="grid gap-3 sm:gap-4">
					{activeHabit.badges.map((badge) => {
						const isUnlocked = badge.unlocked;

						return (
							<div
								key={badge.id}
								className={`bg-white  rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all ${
									isUnlocked
										? "border-l-4 border-green-500 "
										: "opacity-70 border-l-4 border-gray-200 "
								}`}
							>
								<div className="flex items-center space-x-3 sm:space-x-4">
									<div
										className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full ${
											isUnlocked ? "bg-green-100 " : "bg-gray-100 "
										}`}
									>
										<span className="text-xl sm:text-2xl">
											{isUnlocked ? badge.icon : "🔒"}
										</span>
									</div>
									<div className="flex-1">
										<h4 className="text-sm sm:text-base font-semibold text-gray-800 ">
											{badge.name}
										</h4>
										<p className="text-xs sm:text-sm text-gray-600 ">
											{badge.description}
										</p>
										{isUnlocked && badge.unlockedAt && (
											<p className="text-[10px] sm:text-xs text-green-600  mt-1 font-medium">
												Unlocked on{" "}
												{format(new Date(badge.unlockedAt), "MMMM d, yyyy")}
											</p>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="bg-white  rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 mt-5 sm:mt-6">
					<h4 className="text-sm sm:text-base font-semibold text-gray-800  mb-4">
						Achievement Progress
					</h4>
					<div className="space-y-4 sm:space-y-5">
						<div>
							<div className="flex justify-between items-center mb-1">
								<p className="text-xs sm:text-sm text-gray-600 ">
									5-Day Streak
								</p>
								<p className="text-xs sm:text-sm font-medium text-gray-700 ">
									{Math.min(activeHabit.currentStreak, 5)} / 5
								</p>
							</div>
							<div className="w-full h-2 sm:h-2.5 bg-gray-100  rounded-full overflow-hidden">
								<div
									className="h-full transition-all duration-500 rounded-full"
									style={{
										width: `${Math.min(
											(activeHabit.currentStreak / 5) * 100,
											100
										)}%`,
										background: `linear-gradient(to right, ${startColor}, ${endColor})`,
									}}
								/>
							</div>
						</div>

						<div>
							<div className="flex justify-between items-center mb-1">
								<p className="text-xs sm:text-sm text-gray-600 ">
									14-Day Streak
								</p>
								<p className="text-xs sm:text-sm font-medium text-gray-700 ">
									{Math.min(activeHabit.currentStreak, 14)} / 14
								</p>
							</div>
							<div className="w-full h-2 sm:h-2.5 bg-gray-100  rounded-full overflow-hidden">
								<div
									className="h-full transition-all duration-500 rounded-full"
									style={{
										width: `${Math.min(
											(activeHabit.currentStreak / 14) * 100,
											100
										)}%`,
										background: `linear-gradient(to right, ${startColor}, ${endColor})`,
									}}
								/>
							</div>
						</div>

						<div>
							<div className="flex justify-between items-center mb-1">
								<p className="text-xs sm:text-sm text-gray-600 ">
									30-Day Streak
								</p>
								<p className="text-xs sm:text-sm font-medium text-gray-700 ">
									{Math.min(activeHabit.currentStreak, 30)} / 30
								</p>
							</div>
							<div className="w-full h-2 sm:h-2.5 bg-gray-100  rounded-full overflow-hidden">
								<div
									className="h-full transition-all duration-500 rounded-full"
									style={{
										width: `${Math.min(
											(activeHabit.currentStreak / 30) * 100,
											100
										)}%`,
										background: `linear-gradient(to right, ${startColor}, ${endColor})`,
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				<div
					className="rounded-xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden"
					style={{
						background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
						boxShadow: `0 10px 15px -3px rgba(${
							startColor
								.replace("#", "")
								.match(/.{1,2}/g)
								?.map((hex) => parseInt(hex, 16) / 2)
								.join(", ") || "0,0,0"
						}, 0.2)`,
					}}
				>
					{}
					<div className="absolute inset-0 opacity-10">
						<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<pattern
									id="smallGrid"
									width="20"
									height="20"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 20 0 L 0 0 0 20"
										fill="none"
										stroke="currentColor"
										strokeWidth="0.5"
									/>
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#smallGrid)" />
						</svg>
					</div>

					<div className="flex items-center justify-between mb-3 relative z-10">
						<h4 className="font-semibold text-sm sm:text-base">
							Achievement Tips
						</h4>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 sm:h-5 sm:w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<p className="text-xs sm:text-sm text-white/90 relative z-10">
						Stay consistent with your {activeHabit.name.toLowerCase()} habit to
						unlock all badges. Track your progress daily and don't break your
						streak!
					</p>
				</div>
			</div>
		);
	};

	const renderStatsView = () => {
		if (!activeHabit) return null;

		const weeklyCompletion = getCompletionRate(activeHabit, 7);
		const monthlyCompletion = getCompletionRate(activeHabit, 30);
		const yearlyCompletion = getCompletionRate(activeHabit, 365);

		const calculateAverage = (days: number) => {
			const recentHistory = activeHabit.history.filter((entry) => {
				const entryDate = parseISO(entry.date);
				const daysAgo = differenceInDays(new Date(), entryDate);
				return daysAgo < days;
			});

			if (recentHistory.length === 0) return 0;

			const sum = recentHistory.reduce(
				(total, entry) => total + entry.value,
				0
			);
			return Math.round((sum / recentHistory.length) * 10) / 10;
		};

		const weeklyAvg = calculateAverage(7);
		const monthlyAvg = calculateAverage(30);

		const getGradientColors = () => {
			if (activeHabit.color.includes("blue")) return ["#3b82f6", "#22d3ee"];
			if (activeHabit.color.includes("purple")) return ["#8b5cf6", "#a855f7"];
			if (activeHabit.color.includes("red")) return ["#ef4444", "#f97316"];
			if (activeHabit.color.includes("green")) return ["#10b981", "#22c55e"];
			return ["#3b82f6", "#22d3ee"];
		};

		const [startColor, endColor] = getGradientColors();

		return (
			<div className="space-y-5">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-lg sm:text-xl font-semibold text-gray-800 ">
						{activeHabit.name} Statistics
					</h3>
					<div className="flex space-x-1">
						{(["week", "month", "year"] as const).map((range) => (
							<button
								key={range}
								className={`px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full transition-colors ${
									selectedTimeRange === range
										? "bg-blue-100 /50 text-blue-600 "
										: "bg-gray-100  text-gray-600 "
								}`}
								onClick={() => setSelectedTimeRange(range)}
							>
								{range.charAt(0).toUpperCase() + range.slice(1)}
							</button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3 sm:gap-4">
					<div className="bg-white  rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
						<p className="text-xs text-gray-500  mb-1">Completion Rate</p>
						<p className="text-lg sm:text-2xl font-bold text-gray-800 ">
							{selectedTimeRange === "week"
								? weeklyCompletion
								: selectedTimeRange === "month"
								? monthlyCompletion
								: yearlyCompletion}
							%
						</p>
					</div>
					<div className="bg-white  rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
						<p className="text-xs text-gray-500  mb-1">Current Streak</p>

						<div className="flex items-center">
							<p className="text-xl sm:text-2xl font-bold text-gray-800 ">
								{activeHabit.currentStreak}
							</p>
							<p className="text-xs sm:text-sm text-gray-600  ml-1">days</p>
							{activeHabit.currentStreak >= 3 &&
								renderFlame(activeHabit.currentStreak)}
						</div>
					</div>
				</div>

				<div className="bg-white  rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
					<h4 className="text-sm sm:text-base font-semibold text-gray-800  mb-4">
						Daily Average
					</h4>
					<div className="flex items-center justify-center py-3 sm:py-4">
						<div className="text-center mr-8 sm:mr-10">
							<p className="text-xs sm:text-sm text-gray-500  mb-1">Week</p>
							<p className="text-lg sm:text-2xl font-bold text-gray-800 ">
								{weeklyAvg}
							</p>
							<p className="text-[10px] sm:text-xs text-gray-500 ">
								{activeHabit.unit}/day
							</p>
						</div>
						<div className="text-center">
							<p className="text-xs sm:text-sm text-gray-500  mb-1">Month</p>
							<p className="text-lg sm:text-2xl font-bold text-gray-800 ">
								{monthlyAvg}
							</p>
							<p className="text-[10px] sm:text-xs text-gray-500 ">
								{activeHabit.unit}/day
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white  rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
					<h4 className="text-sm sm:text-base font-semibold text-gray-800  mb-4">
						Progress Chart
					</h4>
					<div className="h-32 sm:h-40">
						{(() => {
							const days =
								selectedTimeRange === "week"
									? 7
									: selectedTimeRange === "month"
									? 30
									: 90;

							const data = getStreakData(activeHabit, days);
							const chartData = data.slice(Math.max(0, data.length - days));

							const formattedData = chartData.map((item) => ({
								date: format(new Date(item.date), "MM/dd"),
								value: item.value,
								target: activeHabit.target,
								completed: item.completed ? 1 : 0,
							}));
							return (
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={formattedData}
										margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											vertical={false}
											stroke="#e5e7eb"
										/>
										<XAxis
											dataKey="date"
											tick={{ fontSize: 10 }}
											tickLine={false}
											axisLine={{ stroke: "#e5e7eb" }}
											interval={
												formattedData.length > 14
													? Math.floor(formattedData.length / 7)
													: 0
											}
										/>
										<YAxis
											tick={{ fontSize: 10 }}
											tickLine={false}
											axisLine={{ stroke: "#e5e7eb" }}
											width={25}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: "white",
												borderRadius: "8px",
												border: "none",
												boxShadow:
													"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
												color: "#1f2937",
											}}
											formatter={(value, name) => {
												if (name === "Progress")
													return [`${value} ${activeHabit.unit}`, name];
												if (name === "Completed")
													return [value === 1 ? "Yes" : "No", name];
												return [value, name];
											}}
											labelFormatter={(label) => `Date: ${label}`}
										/>
										<ReferenceLine
											y={activeHabit.target}
											stroke="#9333ea"
											strokeDasharray="3 3"
										></ReferenceLine>
										<Legend
											iconType="circle"
											iconSize={8}
											wrapperStyle={{ fontSize: "12px", marginTop: "10px" }}
										/>
										<Bar
											dataKey="value"
											fill={startColor}
											name="Progress"
											radius={[4, 4, 0, 0]}
											barSize={
												formattedData.length > 30
													? 2
													: formattedData.length > 14
													? 6
													: 12
											}
										/>
									</BarChart>
								</ResponsiveContainer>
							);
						})()}
					</div>

					<div className="mt-3 flex justify-between text-[10px] sm:text-xs text-gray-500 ">
						<span>
							Target: {activeHabit.target} {activeHabit.unit}
						</span>
						<span>
							{selectedTimeRange === "week"
								? "Last 7 days"
								: selectedTimeRange === "month"
								? "Last 30 days"
								: "Last 90 days"}
						</span>
					</div>
				</div>

				<div className="bg-white  rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
					<h4 className="text-sm sm:text-base font-semibold text-gray-800  mb-4">
						Insights
					</h4>
					<div className="space-y-3 sm:space-y-4">
						<div className="flex items-start">
							<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 /30 flex items-center justify-center text-blue-600  mr-3 mt-0.5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5 sm:h-4 sm:w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
									/>
								</svg>
							</div>
							<div>
								<p className="text-xs sm:text-sm font-medium text-gray-800 ">
									{weeklyCompletion > 50
										? "Great consistency this week!"
										: "Keep working on consistency"}
								</p>
								<p className="text-[10px] sm:text-xs text-gray-500 ">
									{weeklyCompletion > 50
										? `You've completed your ${activeHabit.name} goal ${weeklyCompletion}% of days this week.`
										: `Try to complete your ${activeHabit.name} goal more consistently.`}
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100  flex items-center justify-center text-green-600  mr-3 mt-0.5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
							</div>
							<div>
								<p className="text-xs sm:text-sm font-medium text-gray-800 ">
									{activeHabit.currentStreak > 0
										? `You're on a ${activeHabit.currentStreak} day streak!`
										: "Start your streak today!"}
								</p>
								<p className="text-[10px] sm:text-xs text-gray-500 ">
									{activeHabit.currentStreak > 0
										? `Keep going to reach your next badge at ${
												activeHabit.currentStreak < 5
													? "5"
													: activeHabit.currentStreak < 14
													? "14"
													: "30"
										  } days.`
										: `Complete your ${activeHabit.name} goal today to start a streak.`}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderDesktopSidebar = () => {
		return (
			<div className="w-64 bg-white  border-r border-gray-200  h-screen p-4 fixed left-0 top-0 overflow-y-auto">
				<div className="flex items-center mb-8">
					<div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
						H
					</div>
					<h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
						HabitFlow
					</h1>
				</div>

				<div className="mb-8">
					<h2 className="text-xs font-semibold text-gray-500  uppercase tracking-wider mb-3">
						Navigation
					</h2>
					<nav className="space-y-1">
						{(["today", "calendar", "achievements", "stats"] as const).map(
							(view) => (
								<button
									key={view}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
										activeView === view
											? "bg-blue-50 /20 text-blue-600 "
											: "text-gray-600  hover:bg-gray-50 /70"
									}`}
									onClick={() => {
										setActiveView(view);
										triggerHapticFeedback("light");
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										{view === "today" && (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
											/>
										)}
										{view === "calendar" && (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										)}
										{view === "achievements" && (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										)}
										{view === "stats" && (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
											/>
										)}
									</svg>
									{view.charAt(0).toUpperCase() + view.slice(1)}
								</button>
							)
						)}
					</nav>
				</div>

				<div className="mb-8">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-xs font-semibold text-gray-500  uppercase tracking-wider">
							My Habits
						</h2>
						<button
							className="text-blue-600  hover:text-blue-800  text-sm font-medium"
							onClick={() => {
								setShowAddHabitModal(true);
								triggerHapticFeedback("light");
							}}
						>
							Add
						</button>
					</div>
					<div className="space-y-2">
						{habits.map((habit, index) => {
							const getGradientColors = () => {
								if (habit.color.includes("blue")) return ["#3b82f6", "#22d3ee"];
								if (habit.color.includes("purple"))
									return ["#8b5cf6", "#a855f7"];
								if (habit.color.includes("red")) return ["#ef4444", "#f97316"];
								if (habit.color.includes("green"))
									return ["#10b981", "#22c55e"];
								if (habit.color.includes("pink")) return ["#ec4899", "#f43f5e"];
								if (habit.color.includes("yellow"))
									return ["#f59e0b", "#fbbf24"];
								if (habit.color.includes("indigo"))
									return ["#6366f1", "#3b82f6"];
								if (habit.color.includes("teal")) return ["#14b8a6", "#10b981"];
								return ["#3b82f6", "#22d3ee"];
							};

							const [startColor, endColor] = getGradientColors();

							return (
								<button
									key={habit.id}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
										activeHabitIndex === index
											? "text-white shadow-md"
											: "bg-gray-50 /50 text-gray-700  hover:bg-gray-100 "
									}`}
									style={
										activeHabitIndex === index
											? {
													background: `linear-gradient(to right, ${startColor}, ${endColor})`,
											  }
											: {}
									}
									onClick={() => {
										setActiveHabitIndex(index);
										triggerHapticFeedback("light");
									}}
								>
									<span className="mr-2">{habit.icon}</span>
									<span className="flex-1 text-left">{habit.name}</span>
									<div className="relative">
										{renderSmallProgressRing(habit, 24)}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 ">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-md">
								MR
							</div>
							<div className="ml-2">
								<p className="text-xs font-medium text-gray-800 ">
									Max Reynolds
								</p>
								<p className="text-xs text-gray-500 ">Premium</p>
							</div>
						</div>
						<button className="text-gray-500  hover:text-gray-700  transition-colors">
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
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderMobileHeader = () => {
		return (
			<header className="bg-white  shadow-sm px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
				<div>
					<h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
						HabitFlow
					</h1>
					<p className="text-[10px] sm:text-xs text-gray-500 ">
						Tuesday, May 27, 2025
					</p>
				</div>
				<div className="flex items-center space-x-2 sm:space-x-3">
					<button
						className="relative"
						onClick={() => {
							triggerHapticFeedback("light");
						}}
					>
						<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100  flex items-center justify-center transition-colors hover:bg-gray-200 ">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 "
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
							</svg>
						</div>
						<span className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 border-2 border-white "></span>
					</button>
					<button
						onClick={() => {
							setIsMenuOpen(!isMenuOpen);
							triggerHapticFeedback("light");
						}}
					>
						<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-xs sm:text-sm shadow-md">
							MR
						</div>
					</button>
				</div>
			</header>
		);
	};

	const renderMobileMenu = () => {
		if (!isMenuOpen) return null;

		return (
			<div
				className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
				onClick={() => setIsMenuOpen(false)}
			>
				<div
					className="absolute right-0 top-0 h-screen w-64 bg-white  shadow-lg p-4"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-md">
								MR
							</div>
							<div className="ml-3">
								<p className="font-medium text-gray-800 ">Max Reynolds</p>
								<p className="text-xs text-gray-500 ">Premium Member</p>
							</div>
						</div>
						<button
							onClick={() => setIsMenuOpen(false)}
							className="p-1 rounded-full hover:bg-gray-100  transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-gray-500 "
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

					<div className="space-y-1 mb-6">
						<button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700  hover:bg-gray-100  transition-colors">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-3 text-gray-500 "
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
							Profile
						</button>
						<button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700  hover:bg-gray-100  transition-colors">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-3 text-gray-500 "
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Settings
						</button>
					</div>

					<div className="border-t border-gray-200  pt-5 space-y-1">
						<button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700  hover:bg-gray-100  transition-colors">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-3 text-gray-500 "
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
							Help & Support
						</button>
						<button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700  hover:bg-gray-100  transition-colors">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-3 text-gray-500 "
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
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderBottomNav = () => {
		return (
			<div className="fixed bottom-0 left-0 right-0 bg-white  border-t border-gray-200  py-1.5 sm:py-2 z-10 px-4 sm:px-6 shadow-lg">
				<div className="flex justify-around items-center">
					<button
						className={`flex flex-col items-center px-2 sm:px-3 py-1 ${
							activeView === "today" ? "text-blue-600 " : "text-gray-500 "
						}`}
						onClick={() => {
							setActiveView("today");
							triggerHapticFeedback("light");
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 sm:h-6 sm:w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
							/>
						</svg>
						<span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Today</span>
					</button>
					<button
						className={`flex flex-col items-center px-2 sm:px-3 py-1 ${
							activeView === "calendar" ? "text-blue-600 " : "text-gray-500 "
						}`}
						onClick={() => {
							setActiveView("calendar");
							triggerHapticFeedback("light");
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 sm:h-6 sm:w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">
							Calendar
						</span>
					</button>
					<div className="relative">
						<button
							className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg absolute -top-6 sm:-top-7 left-1/2 transform -translate-x-1/2 transition-transform hover:scale-105 active:scale-95"
							onClick={() => {
								setIsAddingProgress(true);
								triggerHapticFeedback("medium");
							}}
							style={{
								boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 sm:h-7 sm:w-7"
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
					<button
						className={`flex flex-col items-center px-2 sm:px-3 py-1 ${
							activeView === "achievements"
								? "text-blue-600 "
								: "text-gray-500 "
						}`}
						onClick={() => {
							setActiveView("achievements");
							triggerHapticFeedback("light");
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 sm:h-6 sm:w-6"
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
						<span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">
							Badges
						</span>
					</button>
					<button
						className={`flex flex-col items-center px-2 sm:px-3 py-1 ${
							activeView === "stats" ? "text-blue-600 " : "text-gray-500 "
						}`}
						onClick={() => {
							setActiveView("stats");
							triggerHapticFeedback("light");
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 sm:h-6 sm:w-6"
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
						<span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Stats</span>
					</button>
				</div>
			</div>
		);
	};

	const renderModals = () => {
		return (
			<>
				{}
				{showAddHabitModal && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
						onClick={() => setShowAddHabitModal(false)}
					>
						<div
							className="bg-white  rounded-xl w-full max-w-md p-5 sm:p-6 shadow-xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-5">
								<h3 className="text-lg sm:text-xl font-bold text-gray-800 ">
									Add New Habit
								</h3>
								<button
									className="text-gray-500  hover:text-gray-700  p-1 rounded-full hover:bg-gray-100  transition-colors"
									onClick={() => setShowAddHabitModal(false)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 sm:h-6 sm:w-6"
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

							<div className="space-y-4 sm:space-y-5">
								<div>
									<label className="block text-xs sm:text-sm font-medium text-gray-700  mb-1">
										Habit Name
									</label>
									<input
										type="text"
										className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent"
										placeholder="e.g., Drinking Water"
										value={newHabit.name}
										onChange={(e) =>
											setNewHabit({ ...newHabit, name: e.target.value })
										}
									/>
								</div>

								<div className="grid grid-cols-2 gap-3 sm:gap-4">
									<div>
										<label className="block text-xs sm:text-sm font-medium text-gray-700  mb-1">
											Daily Target
										</label>
										<input
											type="number"
											min="1"
											className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent"
											value={newHabit.target}
											onChange={(e) =>
												setNewHabit({
													...newHabit,
													target: parseInt(e.target.value) || 1,
												})
											}
										/>
									</div>
									<div>
										<label className="block text-xs sm:text-sm font-medium text-gray-700  mb-1">
											Unit
										</label>
										<input
											type="text"
											className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent"
											placeholder="e.g., glasses"
											value={newHabit.unit}
											onChange={(e) =>
												setNewHabit({ ...newHabit, unit: e.target.value })
											}
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs sm:text-sm font-medium text-gray-700  mb-2">
										Color Theme
									</label>
									<div className="grid grid-cols-4 gap-2 sm:gap-3">
										{[
											"bg-gradient-to-r from-blue-500 to-cyan-400",
											"bg-gradient-to-r from-violet-500 to-purple-500",
											"bg-gradient-to-r from-red-500 to-orange-500",
											"bg-gradient-to-r from-emerald-500 to-green-500",
											"bg-gradient-to-r from-pink-500 to-rose-400",
											"bg-gradient-to-r from-yellow-400 to-amber-500",
											"bg-gradient-to-r from-indigo-500 to-blue-500",
											"bg-gradient-to-r from-teal-500 to-emerald-400",
										].map((color) => (
											<button
												key={color}
												className={`w-full aspect-square rounded-full ${color} flex items-center justify-center transition-transform ${
													newHabit.color === color
														? "ring-2 ring-gray-800  ring-offset-2 ring-offset-white  scale-110"
														: "hover:scale-105"
												}`}
												onClick={() => setNewHabit({ ...newHabit, color })}
											>
												{newHabit.color === color && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4 sm:h-5 sm:w-5 text-white"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"
														/>
													</svg>
												)}
											</button>
										))}
									</div>
								</div>
							</div>

							<div className="flex justify-end space-x-3 mt-6 sm:mt-8">
								<button
									className="px-3 sm:px-4 py-2 rounded-lg bg-gray-200  text-gray-800  text-sm font-medium transition-colors hover:bg-gray-300 "
									onClick={() => {
										setShowAddHabitModal(false);
										setNewHabit({
											name: "",
											target: 1,
											unit: "",
											color: "bg-gradient-to-r from-blue-500 to-cyan-400",
										});
									}}
								>
									Cancel
								</button>
								<button
									className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
									onClick={handleAddHabit}
									disabled={!newHabit.name || !newHabit.unit}
								>
									Create Habit
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				{showEditHabitModal && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
						onClick={() => setShowEditHabitModal(false)}
					>
						<div
							className="bg-white  rounded-xl w-full max-w-md p-5 sm:p-6 shadow-xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-5">
								<h3 className="text-lg sm:text-xl font-bold text-gray-800 ">
									Edit Habit
								</h3>
								<button
									className="text-gray-500  hover:text-gray-700  p-1 rounded-full hover:bg-gray-100  transition-colors"
									onClick={() => setShowEditHabitModal(false)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 sm:h-6 sm:w-6"
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

							<div className="space-y-4 sm:space-y-5">
								<div>
									<label className="block text-xs sm:text-sm font-medium text-gray-700  mb-1">
										Habit Name
									</label>
									<input
										type="text"
										className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent"
										placeholder="e.g., Drinking Water"
										value={newHabit.name}
										onChange={(e) =>
											setNewHabit({ ...newHabit, name: e.target.value })
										}
									/>
								</div>

								<div className="grid grid-cols-2 gap-3 sm:gap-4">
									<div>
										<label className="block text-xs sm:text-sm font-medium text-gray-700  mb-1">
											Daily Target
										</label>
										<input
											type="number"
											min="1"
											className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent"
											value={newHabit.target}
											onChange={(e) =>
												setNewHabit({
													...newHabit,
													target: parseInt(e.target.value) || 1,
												})
											}
										/>
									</div>
									<div>
										<label className="block text-xs sm:text-sm font-medium text-gray-700  mb-1">
											Unit
										</label>
										<input
											type="text"
											className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent"
											placeholder="e.g., glasses"
											value={newHabit.unit}
											onChange={(e) =>
												setNewHabit({ ...newHabit, unit: e.target.value })
											}
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs sm:text-sm font-medium text-gray-700  mb-2">
										Color Theme
									</label>
									<div className="grid grid-cols-4 gap-2 sm:gap-3">
										{[
											"bg-gradient-to-r from-blue-500 to-cyan-400",
											"bg-gradient-to-r from-violet-500 to-purple-500",
											"bg-gradient-to-r from-red-500 to-orange-500",
											"bg-gradient-to-r from-emerald-500 to-green-500",
											"bg-gradient-to-r from-pink-500 to-rose-400",
											"bg-gradient-to-r from-yellow-400 to-amber-500",
											"bg-gradient-to-r from-indigo-500 to-blue-500",
											"bg-gradient-to-r from-teal-500 to-emerald-400",
										].map((color) => (
											<button
												key={color}
												className={`w-full aspect-square rounded-full ${color} flex items-center justify-center transition-transform ${
													newHabit.color === color
														? "ring-2 ring-gray-800  ring-offset-2 ring-offset-whitescale-110"
														: "hover:scale-105"
												}`}
												onClick={() => setNewHabit({ ...newHabit, color })}
											>
												{newHabit.color === color && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4 sm:h-5 sm:w-5 text-white"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"
														/>
													</svg>
												)}
											</button>
										))}
									</div>
								</div>
							</div>

							<div className="flex justify-between mt-6 sm:mt-8">
								<button
									className="px-3 sm:px-4 py-2 rounded-lg bg-red-100 text-red-600  text-sm font-medium hover:bg-red-200  transition-colors"
									onClick={handleDeleteHabit}
								>
									Delete Habit
								</button>

								<div className="flex space-x-3">
									<button
										className="px-3 sm:px-4 py-2 rounded-lg bg-gray-200  text-gray-800  text-sm font-medium transition-colors hover:bg-gray-300 "
										onClick={() => setShowEditHabitModal(false)}
									>
										Cancel
									</button>
									<button
										className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
										onClick={handleUpdateHabit}
										disabled={!newHabit.name || !newHabit.unit}
									>
										Update
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{}
				{isAddingProgress && activeHabit && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
						onClick={() => setIsAddingProgress(false)}
					>
						<div
							className="bg-white  rounded-xl w-full max-w-md p-5 sm:p-6 shadow-xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-5">
								<h3 className="text-lg sm:text-xl font-bold text-gray-800 ">
									Add Progress to {activeHabit.name}
								</h3>
								<button
									className="text-gray-500  hover:text-gray-700  p-1 rounded-full hover:bg-gray-100  transition-colors"
									onClick={() => setIsAddingProgress(false)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 sm:h-6 sm:w-6"
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

							<div className="flex items-center justify-center space-x-6 my-6 sm:my-8">
								{}
								{(() => {
									const getGradientColors = () => {
										if (activeHabit.color.includes("blue"))
											return ["#3b82f6", "#22d3ee"];
										if (activeHabit.color.includes("purple"))
											return ["#8b5cf6", "#a855f7"];
										if (activeHabit.color.includes("red"))
											return ["#ef4444", "#f97316"];
										if (activeHabit.color.includes("green"))
											return ["#10b981", "#22c55e"];
										if (activeHabit.color.includes("pink"))
											return ["#ec4899", "#f43f5e"];
										if (activeHabit.color.includes("yellow"))
											return ["#f59e0b", "#fbbf24"];
										if (activeHabit.color.includes("indigo"))
											return ["#6366f1", "#3b82f6"];
										if (activeHabit.color.includes("teal"))
											return ["#14b8a6", "#10b981"];
										return ["#3b82f6", "#22d3ee"];
									};

									const [startColor, endColor] = getGradientColors();

									return (
										<>
											<button
												className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-md transition transform hover:scale-110 active:scale-95"
												style={{
													background: `linear-gradient(to right, ${startColor}, ${endColor})`,
												}}
												onClick={() =>
													setProgressAmount((prev) => Math.max(prev - 1, 1))
												}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 sm:h-6 sm:w-6"
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
											<div className="text-center">
												<div className="text-3xl sm:text-4xl font-bold text-gray-800 ">
													{progressAmount}
												</div>
												<div className="text-xs sm:text-sm text-gray-500  mt-1">
													{activeHabit.unit}
												</div>
											</div>
											<button
												className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-md transition transform hover:scale-110 active:scale-95"
												style={{
													background: `linear-gradient(to right, ${startColor}, ${endColor})`,
												}}
												onClick={() => setProgressAmount((prev) => prev + 1)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 sm:h-6 sm:w-6"
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
										</>
									);
								})()}
							</div>

							<div className="bg-gray-50 /50 rounded-lg p-3 sm:p-4 mb-5 sm:mb-6">
								<p className="text-xs sm:text-sm text-gray-600  mb-2">
									Current Progress Today
								</p>
								<div className="flex items-center justify-between">
									<p className="text-lg sm:text-xl font-semibold text-gray-800 ">
										{(() => {
											const todayEntry = activeHabit.history.find(
												(entry) =>
													entry.date === format(new Date(), "yyyy-MM-dd")
											);
											return todayEntry ? todayEntry.value : 0;
										})()}
										<span className="text-sm sm:text-base font-normal text-gray-500 ">
											{" "}
											/ {activeHabit.target}
										</span>
									</p>
									<div className="relative h-2 sm:h-2.5 w-20 sm:w-24 bg-gray-200  rounded-full overflow-hidden">
										{}
										{(() => {
											const getGradientColors = () => {
												if (activeHabit.color.includes("blue"))
													return ["#3b82f6", "#22d3ee"];
												if (activeHabit.color.includes("purple"))
													return ["#8b5cf6", "#a855f7"];
												if (activeHabit.color.includes("red"))
													return ["#ef4444", "#f97316"];
												if (activeHabit.color.includes("green"))
													return ["#10b981", "#22c55e"];
												return ["#3b82f6", "#22d3ee"];
											};

											const [startColor, endColor] = getGradientColors();
											const todayEntry = activeHabit.history.find(
												(entry) =>
													entry.date === format(new Date(), "yyyy-MM-dd")
											);
											const value = todayEntry ? todayEntry.value : 0;
											const width = Math.min(
												(value / activeHabit.target) * 100,
												100
											);

											return (
												<div
													className="absolute top-0 left-0 h-full"
													style={{
														width: `${width}%`,
														background: `linear-gradient(to right, ${startColor}, ${endColor})`,
													}}
												/>
											);
										})()}
									</div>
								</div>
							</div>

							<div className="flex justify-end space-x-3">
								<button
									className="px-3 sm:px-4 py-2 rounded-lg bg-gray-200  text-gray-800  text-sm font-medium transition-colors hover:bg-gray-300 "
									onClick={() => {
										setIsAddingProgress(false);
										setProgressAmount(1);
									}}
								>
									Cancel
								</button>
								{}
								{(() => {
									const getGradientColors = () => {
										if (activeHabit.color.includes("blue"))
											return ["#3b82f6", "#22d3ee"];
										if (activeHabit.color.includes("purple"))
											return ["#8b5cf6", "#a855f7"];
										if (activeHabit.color.includes("red"))
											return ["#ef4444", "#f97316"];
										if (activeHabit.color.includes("green"))
											return ["#10b981", "#22c55e"];
										return ["#3b82f6", "#22d3ee"];
									};

									const [startColor, endColor] = getGradientColors();

									return (
										<button
											className="px-3 sm:px-4 py-2 rounded-lg font-medium text-white transition-transform hover:scale-105 active:scale-95"
											style={{
												background: `linear-gradient(to right, ${startColor}, ${endColor})`,
											}}
											onClick={handleAddProgress}
										>
											Add Progress
										</button>
									);
								})()}
							</div>
						</div>
					</div>
				)}
			</>
		);
	};

	const renderToast = () => {
		if (!showToast) return null;

		return (
			<div
				className="fixed bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800  text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow-lg text-xs sm:text-sm z-50 animate-fade-in-up"
				style={{
					animation: "fade-in-up 0.3s ease-out forwards",
					maxWidth: "90%",
					boxShadow:
						"0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
				}}
			>
				{toastMessage}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900" ref={containerRef}>
			{}
			{renderConfetti()}
			{}
			{renderToast()}
			{}
			{renderMobileMenu()}
			{}
			{renderModals()}
			{isDesktop ? (
				<div className="flex min-h-screen">
					{}
					{renderDesktopSidebar()}

					{}
					<div className="ml-64 flex-1 py-6 sm:py-8 px-6 sm:px-8">
						<div className="max-w-4xl mx-auto">
							<div className="flex items-center justify-between mb-6 sm:mb-8">
								<h1 className="text-xl sm:text-2xl font-bold text-gray-800 ">
									{activeView === "today"
										? "Today's Habits"
										: activeView === "calendar"
										? "Calendar View"
										: activeView === "achievements"
										? "Achievements"
										: "Statistics"}
								</h1>
								<div className="flex items-center space-x-2">
									<span className="text-xs sm:text-sm text-gray-500 ">
										{format(new Date(), "EEEE, MMMM d, yyyy")}
									</span>
									<button className="ml-3 relative">
										<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100  flex items-center justify-center transition-colors hover:bg-gray-200 ">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 "
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
												/>
											</svg>
										</div>
										<span className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 border-2 border-white "></span>
									</button>
								</div>
							</div>

							{}
							{renderHabitTabs()}

							{}
							<div ref={habitContentRef}>
								{activeView === "today" && renderTodayView()}
								{activeView === "calendar" && renderCalendarView()}
								{activeView === "achievements" && renderAchievementsView()}
								{activeView === "stats" && renderStatsView()}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-col min-h-screen">
					{}
					{renderMobileHeader()}

					{}
					{renderNavTabs()}

					{}
					{renderHabitTabs()}

					{}
					<div
						className="flex-1 overflow-y-auto px-3 sm:px-4 pb-20 sm:pb-24"
						ref={habitContentRef}
					>
						{activeView === "today" && renderTodayView()}
						{activeView === "calendar" && renderCalendarView()}
						{activeView === "achievements" && renderAchievementsView()}
						{activeView === "stats" && renderStatsView()}
					</div>

					{}
					{renderBottomNav()}
				</div>
			)}
			{}

			<style jsx global>{`
				@keyframes flame-pulse {
					0%,
					100% {
						transform: scale(1) rotate(-1deg);
						filter: drop-shadow(0 0 4px rgba(255, 165, 0, 0.6)) brightness(1);
					}
					25% {
						transform: scale(1.1) rotate(1deg);
						filter: drop-shadow(0 0 6px rgba(255, 165, 0, 0.8)) brightness(1.2);
					}
					50% {
						transform: scale(1.05) rotate(-0.5deg);
						filter: drop-shadow(0 0 5px rgba(255, 165, 0, 0.7)) brightness(1.1);
					}
					75% {
						transform: scale(1.15) rotate(0.5deg);
						filter: drop-shadow(0 0 7px rgba(255, 165, 0, 0.9)) brightness(1.3);
					}
				}

				.animate-flame-pulse {
					animation: flame-pulse 1.5s ease-in-out infinite;
				}

				@keyframes confetti {
					0% {
						transform: translateY(0) rotate(0deg);
						opacity: 1;
					}
					100% {
						transform: translateY(1000px) rotate(720deg);
						opacity: 0;
					}
				}

				@keyframes fade-in-up {
					0% {
						opacity: 0;
						transform: translate(-50%, 20px);
					}
					100% {
						opacity: 1;
						transform: translate(-50%, 0);
					}
				}

				.hide-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}

				body {
					font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, Helvetica, Arial, sans-serif;
					-webkit-tap-highlight-color: transparent;
					margin: 0;
					padding: 0;
					overflow-x: hidden;
				}

				.dark {
					color-scheme: dark;
				}

				@media screen and (max-width: 360px) {
					.text-xs {
						font-size: 0.65rem;
					}
					.text-sm {
						font-size: 0.75rem;
					}
					.h-5,
					.w-5 {
						height: 1.1rem;
						width: 1.1rem;
					}
					.px-3 {
						padding-left: 0.6rem;
						padding-right: 0.6rem;
					}
				}
			`}</style>
		</div>
	);
};

const AppWithSSR = () => {
	useEffect(() => {
		document.documentElement.dataset.serverRendered = "true";

		const meta = document.createElement("meta");
		meta.name = "viewport";
		meta.content =
			"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
		document.head.appendChild(meta);

		const themeColor = document.createElement("meta");
		themeColor.name = "theme-color";
		themeColor.content = "#3b82f6";
		document.head.appendChild(themeColor);

		document.title = "HabitFlow | Track Your Daily Habits";

		const fontPreload = document.createElement("link");
		fontPreload.rel = "stylesheet";
		fontPreload.href =
			"https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
		document.head.appendChild(fontPreload);

		const preloadLink = document.createElement("link");
		preloadLink.rel = "preload";
		preloadLink.as = "image";
		preloadLink.href =
			"https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
		document.head.appendChild(preloadLink);
	}, []);

	return <HabitTrackerApp />;
};

const rootElement =
	document.getElementById("root") || document.createElement("div");
if (!rootElement.parentElement) {
	rootElement.id = "root";
	document.body.appendChild(rootElement);
}

createRoot(rootElement).render(<AppWithSSR />);

export default HabitTrackerApp;
