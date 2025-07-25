"use client";
import React, { useState, useEffect } from "react";
import {
	LineChart,
	BarChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Line,
	Bar,
	ResponsiveContainer,
} from "recharts";
import {
	Droplet,
	Dumbbell,
	BookOpen,
	Yoga,
	Moon,
	Sun,
	Plus,
	AlertCircle,
	CheckCircle,
	InfoIcon,
	ChevronLeft,
	ChevronRight,
	Calendar,
	BarChart2,
	Home,
	Flame,
	X,
	Edit2,
	Save,
	Trash2,
	Award,
	TrendingUp,
	Settings,
	User,
	Search,
	HelpCircle,
	Bell,
	Share2,
	Download,
	Coffee,
	Bike,
	PieChart,
	Heart,
	Brain,
	Music,
	Utensils,
} from "lucide-react";

interface Habit {
	id: string;
	name: string;
	icon: string;
	color: string;
	target: number;
	unit: string;
}

interface HabitLog {
	habitId: string;
	date: string;
	completed: boolean;
	value: number;
}

interface ToastMessage {
	id: string;
	message: string;
	type: "success" | "error" | "info";
}

interface IconMap {
	[key: string]: React.ReactNode;
}

const iconMap: IconMap = {
	"💧": <Droplet size={20} />,
	"🏃": <Dumbbell size={20} />,
	"📚": <BookOpen size={20} />,
	"🧘": <Yoga size={20} />,
	"😴": <Moon size={20} />,
	"☕": <Coffee size={20} />,
	"🚴": <Bike size={20} />,
	"🍽️": <Utensils size={20} />,
	"❤️": <Heart size={20} />,
	"🧠": <Brain size={20} />,
	"🎵": <Music size={20} />,
};

const iconOptions = [
	{ value: "💧", label: "Water", component: <Droplet size={20} /> },
	{ value: "🏃", label: "Exercise", component: <Dumbbell size={20} /> },
	{ value: "📚", label: "Reading", component: <BookOpen size={20} /> },
	{ value: "🧘", label: "Meditation", component: <Yoga size={20} /> },
	{ value: "😴", label: "Sleep", component: <Moon size={20} /> },
	{ value: "☕", label: "Coffee", component: <Coffee size={20} /> },
	{ value: "🚴", label: "Cycling", component: <Bike size={20} /> },
	{ value: "🍽️", label: "Nutrition", component: <Utensils size={20} /> },
	{ value: "❤️", label: "Health", component: <Heart size={20} /> },
	{ value: "🧠", label: "Mental Health", component: <Brain size={20} /> },
	{ value: "🎵", label: "Music", component: <Music size={20} /> },
];

const colorOptions = [
	{ value: "#3B82F6", label: "Blue" },
	{ value: "#EF4444", label: "Red" },
	{ value: "#10B981", label: "Green" },
	{ value: "#8B5CF6", label: "Purple" },
	{ value: "#6366F1", label: "Indigo" },
	{ value: "#F59E0B", label: "Amber" },
	{ value: "#EC4899", label: "Pink" },
	{ value: "#14B8A6", label: "Teal" },
	{ value: "#F97316", label: "Orange" },
	{ value: "#84CC16", label: "Lime" },
];

const initialHabits: Habit[] = [
	{
		id: "1",
		name: "Drink Water",
		icon: "💧",
		color: "#3B82F6",
		target: 8,
		unit: "glasses",
	},
	{
		id: "2",
		name: "Exercise",
		icon: "🏃",
		color: "#EF4444",
		target: 30,
		unit: "minutes",
	},
	{
		id: "3",
		name: "Read",
		icon: "📚",
		color: "#10B981",
		target: 20,
		unit: "pages",
	},
	{
		id: "4",
		name: "Meditate",
		icon: "🧘",
		color: "#8B5CF6",
		target: 10,
		unit: "minutes",
	},
	{
		id: "5",
		name: "Sleep",
		icon: "😴",
		color: "#6366F1",
		target: 8,
		unit: "hours",
	},
];

const generateSampleLogs = (): HabitLog[] => {
	const logs: HabitLog[] = [];
	const today = new Date();

	for (let i = 0; i < 30; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		const dateStr = date.toISOString().split("T")[0];

		initialHabits.forEach((habit) => {
			const completed = Math.random() > 0.3;
			const value = completed
				? Math.floor(habit.target * (0.7 + Math.random() * 0.6))
				: Math.floor(habit.target * Math.random() * 0.7);

			logs.push({
				habitId: habit.id,
				date: dateStr,
				completed,
				value,
			});
		});
	}

	return logs;
};

const HealthHabitTracker: React.FC = () => {
	const [habits, setHabits] = useState<Habit[]>(initialHabits);
	const [logs, setLogs] = useState<HabitLog[]>(generateSampleLogs());
	const [activeView, setActiveView] = useState<
		"dashboard" | "calendar" | "progress" | "streaks"
	>("dashboard");
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
	const [dateRange, setDateRange] = useState<"week" | "month">("week");
	const [toasts, setToasts] = useState<ToastMessage[]>([]);
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [showAddHabitModal, setShowAddHabitModal] = useState<boolean>(false);
	const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
	const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
	const [newHabit, setNewHabit] = useState<{
		name: string;
		icon: string;
		color: string;
		target: number;
		unit: string;
	}>({
		name: "",
		icon: "💧",
		color: "#3B82F6",
		target: 1,
		unit: "",
	});

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { id, message, type }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 3000);
	};

	const getDates = (): Date[] => {
		const dates: Date[] = [];
		const startDate = new Date(currentDate);

		if (dateRange === "week") {
			const day = startDate.getDay();
			startDate.setDate(startDate.getDate() - day);

			for (let i = 0; i < 7; i++) {
				const date = new Date(startDate);
				date.setDate(startDate.getDate() + i);
				dates.push(date);
			}
		} else {
			startDate.setDate(1);

			const month = startDate.getMonth();
			const year = startDate.getFullYear();
			let day = 1;

			while (new Date(year, month, day).getMonth() === month) {
				dates.push(new Date(year, month, day));
				day++;
			}
		}

		return dates;
	};

	const getLogForDate = (date: Date, habitId: string): HabitLog | undefined => {
		const dateStr = date.toISOString().split("T")[0];
		return logs.find((log) => log.habitId === habitId && log.date === dateStr);
	};

	const toggleHabitCompletion = (date: Date, habitId: string) => {
		const dateStr = date.toISOString().split("T")[0];
		const habit = habits.find((h) => h.id === habitId);

		if (!habit) return;

		setLogs((prev) => {
			const existingLogIndex = prev.findIndex(
				(log) => log.habitId === habitId && log.date === dateStr
			);

			if (existingLogIndex >= 0) {
				const updatedLogs = [...prev];
				const existingLog = updatedLogs[existingLogIndex];
				updatedLogs[existingLogIndex] = {
					...existingLog,
					completed: !existingLog.completed,
					value: !existingLog.completed ? habit.target : 0,
				};
				return updatedLogs;
			} else {
				return [
					...prev,
					{
						habitId,
						date: dateStr,
						completed: true,
						value: habit.target,
					},
				];
			}
		});

		showToast(
			`${habit.name} marked as ${
				getLogForDate(date, habitId)?.completed ? "incomplete" : "complete"
			}!`,
			"success"
		);
	};

	const calculateStreak = (habitId: string): number => {
		let streak = 0;
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		for (let i = 0; i < 100; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			const dateStr = date.toISOString().split("T")[0];

			const log = logs.find(
				(log) => log.habitId === habitId && log.date === dateStr
			);

			if (log?.completed) {
				streak++;
			} else {
				break;
			}
		}

		return streak;
	};

	const getCompletionPercentage = (habitId: string): number => {
		const dates = getDates();
		let completed = 0;

		dates.forEach((date) => {
			const log = getLogForDate(date, habitId);
			if (log?.completed) {
				completed++;
			}
		});

		return Math.round((completed / dates.length) * 100);
	};

	const getChartData = () => {
		const dates = getDates();
		return dates.map((date) => {
			const dateStr = date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
			const data: any = { date: dateStr };

			habits.forEach((habit) => {
				const log = getLogForDate(date, habit.id);
				data[habit.name] = log?.value || 0;
			});

			return data;
		});
	};

	const navigatePeriod = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);

		if (dateRange === "week") {
			newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
		} else {
			newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
		}

		setCurrentDate(newDate);
	};

	const updateHabitValue = (date: Date, habitId: string, value: number) => {
		const dateStr = date.toISOString().split("T")[0];
		const habit = habits.find((h) => h.id === habitId);

		if (!habit) return;

		setLogs((prev) => {
			const existingLogIndex = prev.findIndex(
				(log) => log.habitId === habitId && log.date === dateStr
			);

			if (existingLogIndex >= 0) {
				const updatedLogs = [...prev];
				updatedLogs[existingLogIndex] = {
					...updatedLogs[existingLogIndex],
					value,
					completed: value >= habit.target,
				};
				return updatedLogs;
			} else {
				return [
					...prev,
					{
						habitId,
						date: dateStr,
						value,
						completed: value >= habit.target,
					},
				];
			}
		});
	};

	const addNewHabit = () => {
		if (!newHabit.name.trim() || !newHabit.unit.trim()) {
			showToast("Please fill in all fields", "error");
			return;
		}

		const newId = (
			Math.max(...habits.map((h) => parseInt(h.id))) + 1
		).toString();

		const habit: Habit = {
			id: newId,
			name: newHabit.name.trim(),
			icon: newHabit.icon,
			color: newHabit.color,
			target: newHabit.target,
			unit: newHabit.unit.trim(),
		};

		setHabits((prev) => [...prev, habit]);

		// Generate logs for the new habit
		const today = new Date();
		const newLogs: HabitLog[] = [];
		for (let i = 0; i < 30; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			const dateStr = date.toISOString().split("T")[0];

			// 50% chance of completion for past dates
			const completed = i === 0 ? false : Math.random() > 0.5;
			const value = completed
				? Math.floor(habit.target * (0.7 + Math.random() * 0.6))
				: Math.floor(habit.target * Math.random() * 0.7);

			newLogs.push({
				habitId: habit.id,
				date: dateStr,
				completed,
				value,
			});
		}

		setLogs((prev) => [...prev, ...newLogs]);

		setNewHabit({
			name: "",
			icon: "💧",
			color: "#3B82F6",
			target: 1,
			unit: "",
		});

		setShowAddHabitModal(false);
		showToast(`Habit "${habit.name}" added successfully!`, "success");
	};

	const updateHabit = () => {
		if (
			!editingHabit ||
			!editingHabit.name.trim() ||
			!editingHabit.unit.trim()
		) {
			showToast("Please fill in all fields", "error");
			return;
		}

		setHabits((prev) =>
			prev.map((h) => (h.id === editingHabit.id ? editingHabit : h))
		);

		setEditingHabit(null);
		showToast(`Habit "${editingHabit.name}" updated successfully!`, "success");
	};

	const deleteHabit = () => {
		if (!editingHabit) return;

		setHabits((prev) => prev.filter((h) => h.id !== editingHabit.id));
		setLogs((prev) => prev.filter((log) => log.habitId !== editingHabit.id));

		setEditingHabit(null);
		setShowDeleteConfirm(false);
		showToast(`Habit deleted successfully!`, "success");
	};

	const getTotalCompletionRate = (): number => {
		const dates = getDates();
		let totalPossible = dates.length * habits.length;
		let totalCompleted = 0;

		dates.forEach((date) => {
			habits.forEach((habit) => {
				const log = getLogForDate(date, habit.id);
				if (log?.completed) {
					totalCompleted++;
				}
			});
		});

		return totalPossible > 0
			? Math.round((totalCompleted / totalPossible) * 100)
			: 0;
	};

	const getBestHabit = (): Habit | null => {
		if (habits.length === 0) return null;

		let bestHabitId = habits[0].id;
		let bestPercentage = getCompletionPercentage(habits[0].id);

		habits.forEach((habit) => {
			const percentage = getCompletionPercentage(habit.id);
			if (percentage > bestPercentage) {
				bestPercentage = percentage;
				bestHabitId = habit.id;
			}
		});

		return habits.find((h) => h.id === bestHabitId) || null;
	};

	const getWorstHabit = (): Habit | null => {
		if (habits.length === 0) return null;

		let worstHabitId = habits[0].id;
		let worstPercentage = getCompletionPercentage(habits[0].id);

		habits.forEach((habit) => {
			const percentage = getCompletionPercentage(habit.id);
			if (percentage < worstPercentage) {
				worstPercentage = percentage;
				worstHabitId = habit.id;
			}
		});

		return habits.find((h) => h.id === worstHabitId) || null;
	};

	const getLongestStreak = (): { habit: Habit; streak: number } | null => {
		if (habits.length === 0) return null;

		let longestStreak = 0;
		let habitWithLongestStreak = habits[0];

		habits.forEach((habit) => {
			const streak = calculateStreak(habit.id);
			if (streak > longestStreak) {
				longestStreak = streak;
				habitWithLongestStreak = habit;
			}
		});

		return { habit: habitWithLongestStreak, streak: longestStreak };
	};

	const Header = () => (
		<header
			className={`p-4 ${
				darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
			} shadow-md flex justify-between items-center sticky top-0 z-10`}
		>
			<h1 className="text-2xl font-bold flex items-center gap-2">
				<Heart
					size={28}
					className={darkMode ? "text-blue-400" : "text-blue-500"}
				/>
				<span className="hidden sm:inline">Health & Habit Tracker</span>
				<span className="sm:hidden">Habits</span>
			</h1>
			<div className="flex items-center gap-4">
				<button
					className={`p-2 rounded-full ${
						darkMode
							? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200"
					} flex items-center justify-center transition-colors`}
					onClick={() => setDarkMode(!darkMode)}
					aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
				>
					{darkMode ? <Sun size={20} /> : <Moon size={20} />}
				</button>

				<button
					className={`p-2 rounded-full ${
						darkMode
							? "bg-gray-800 hover:bg-gray-700"
							: "bg-gray-100 hover:bg-gray-200"
					} flex items-center justify-center transition-colors`}
					onClick={() => setShowSettingsModal(true)}
					aria-label="Settings"
				>
					<Settings
						size={20}
						className={darkMode ? "text-gray-300" : "text-gray-600"}
					/>
				</button>

				<button
					className={`px-3 py-2 rounded-md ${
						darkMode
							? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
							: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
					} text-white font-medium flex items-center gap-1 transition-all shadow-md hover:shadow-lg`}
					onClick={() => setShowAddHabitModal(true)}
				>
					<Plus size={18} />
					<span className="hidden sm:inline">Add Habit</span>
					<span className="sm:hidden">Add</span>
				</button>
			</div>
		</header>
	);

	const Navigation = () => (
		<nav
			className={`${
				darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
			} sm:p-0 lg:py-2 sticky top-16 z-10`}
		>
			<div className="flex justify-between max-w-5xl mx-auto">
				<div className="hidden sm:flex lg:justify-center w-full">
					{[
						{ view: "dashboard", icon: <Home size={18} /> },
						{ view: "calendar", icon: <Calendar size={18} /> },
						{ view: "progress", icon: <BarChart2 size={18} /> },
						{ view: "streaks", icon: <Flame size={18} /> },
					].map(({ view, icon }) => (
						<button
							key={view}
							className={`px-6 py-3 capitalize cursor-pointer transition-colors flex items-center gap-2 ${
								activeView === view
									? darkMode
										? "bg-blue-600 text-white border-b-2 border-blue-400"
										: "bg-white text-blue-600 border-b-2 border-blue-500 shadow-sm"
									: darkMode
									? "hover:bg-gray-700"
									: "hover:bg-gray-200"
							}`}
							onClick={() => setActiveView(view as any)}
						>
							{icon}
							<span className="font-medium">{view}</span>
						</button>
					))}
				</div>

				{/* Mobile Navigation */}
				<div className="sm:hidden flex w-full">
					{[
						{ view: "dashboard", icon: <Home size={20} /> },
						{ view: "calendar", icon: <Calendar size={20} /> },
						{ view: "progress", icon: <BarChart2 size={20} /> },
						{ view: "streaks", icon: <Flame size={20} /> },
					].map(({ view, icon }) => (
						<button
							key={view}
							className={`flex-1 py-3 capitalize cursor-pointer transition-colors flex flex-col items-center ${
								activeView === view
									? darkMode
										? "bg-blue-600 text-white"
										: "bg-white text-blue-600 shadow-sm"
									: darkMode
									? "hover:bg-gray-700"
									: "hover:bg-gray-200"
							}`}
							onClick={() => setActiveView(view as any)}
						>
							{icon}
							<span className="text-xs mt-1">{view}</span>
						</button>
					))}
				</div>
			</div>
		</nav>
	);

	const DateSelector = () => {
		const formatDate = () => {
			if (dateRange === "week") {
				const dates = getDates();
				const startDate = dates[0].toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});
				const endDate = dates[dates.length - 1].toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});
				return `${startDate} - ${endDate}`;
			} else {
				return currentDate.toLocaleDateString("en-US", {
					month: "long",
					year: "numeric",
				});
			}
		};

		return (
			<div
				className={`${
					darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
				} p-4 flex justify-between items-center mb-4 rounded-lg shadow-sm`}
			>
				<button
					className={`${
						darkMode
							? "bg-gray-700 hover:bg-gray-600"
							: "bg-gray-100 hover:bg-gray-200"
					} p-2 rounded-lg cursor-pointer transition-colors`}
					onClick={() => navigatePeriod("prev")}
				>
					<ChevronLeft size={20} />
				</button>
				<div className="flex items-center gap-4">
					<h2 className="text-lg font-semibold">{formatDate()}</h2>
					<div className="flex rounded-lg overflow-hidden shadow-sm">
						<button
							className={`px-3 py-1 ${
								dateRange === "week"
									? darkMode
										? "bg-blue-600 text-white"
										: "bg-blue-500 text-white"
									: darkMode
									? "bg-gray-700 text-gray-300"
									: "bg-gray-200 text-gray-700"
							} cursor-pointer transition-colors`}
							onClick={() => setDateRange("week")}
						>
							Week
						</button>
						<button
							className={`px-3 py-1 ${
								dateRange === "month"
									? darkMode
										? "bg-blue-600 text-white"
										: "bg-blue-500 text-white"
									: darkMode
									? "bg-gray-700 text-gray-300"
									: "bg-gray-200 text-gray-700"
							} cursor-pointer transition-colors`}
							onClick={() => setDateRange("month")}
						>
							Month
						</button>
					</div>
				</div>
				<button
					className={`${
						darkMode
							? "bg-gray-700 hover:bg-gray-600"
							: "bg-gray-100 hover:bg-gray-200"
					} p-2 rounded-lg cursor-pointer transition-colors`}
					onClick={() => navigatePeriod("next")}
				>
					<ChevronRight size={20} />
				</button>
			</div>
		);
	};

	const HabitList = () => (
		<div className="flex gap-2 mb-6 overflow-x-auto p-2 scrollbar-thin">
			<button
				className={`shrink-0 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
					selectedHabit === null
						? darkMode
							? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
							: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
						: darkMode
						? "bg-gray-700 text-white"
						: "bg-gray-200 text-gray-800"
				}`}
				onClick={() => setSelectedHabit(null)}
			>
				All Habits
			</button>
			{habits.map((habit) => (
				<button
					key={habit.id}
					className={`shrink-0 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
						selectedHabit === habit.id
							? "text-white shadow-md"
							: darkMode
							? "bg-gray-700 text-white hover:bg-gray-600"
							: "bg-gray-200 text-gray-800 hover:bg-gray-300"
					}`}
					style={{
						backgroundColor: selectedHabit === habit.id ? habit.color : "",
					}}
					onClick={() => setSelectedHabit(habit.id)}
				>
					<span className="flex items-center justify-center">
						{iconMap[habit.icon] || habit.icon}
					</span>
					<span>{habit.name}</span>
				</button>
			))}
		</div>
	);

	const SummaryCards = () => {
		const totalCompletion = getTotalCompletionRate();
		const bestHabit = getBestHabit();
		const worstHabit = getWorstHabit();
		const longestStreakInfo = getLongestStreak();

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<div
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} rounded-lg shadow-md p-4`}
				>
					<div className="flex items-start justify-between">
						<div>
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Overall Completion
							</p>
							<h3
								className={`text-2xl font-bold mt-1 ${
									darkMode ? "text-white" : "text-gray-800"
								}`}
							>
								{totalCompletion}%
							</h3>
						</div>
						<div
							className={`p-3 rounded-full ${
								totalCompletion >= 80
									? "bg-green-100 text-green-600"
									: totalCompletion >= 50
									? "bg-yellow-100 text-yellow-600"
									: "bg-red-100 text-red-600"
							}`}
						>
							<PieChart size={24} />
						</div>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 mt-4">
						<div
							className={`h-2 rounded-full ${
								totalCompletion >= 80
									? "bg-green-500"
									: totalCompletion >= 50
									? "bg-yellow-500"
									: "bg-red-500"
							}`}
							style={{ width: `${totalCompletion}%` }}
						></div>
					</div>
				</div>

				<div
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} rounded-lg shadow-md p-4`}
				>
					<div className="flex items-start justify-between">
						<div>
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Best Habit
							</p>
							<h3
								className={`text-lg font-bold mt-1 ${
									darkMode ? "text-white" : "text-gray-800"
								}`}
							>
								{bestHabit ? bestHabit.name : "None"}
							</h3>
							{bestHabit && (
								<p
									className={`text-sm ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} mt-1`}
								>
									{getCompletionPercentage(bestHabit.id)}% completion
								</p>
							)}
						</div>
						<div className="p-3 rounded-full bg-green-100 text-green-600">
							<Award size={24} />
						</div>
					</div>
				</div>

				<div
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} rounded-lg shadow-md p-4`}
				>
					<div className="flex items-start justify-between">
						<div>
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Needs Improvement
							</p>
							<h3
								className={`text-lg font-bold mt-1 ${
									darkMode ? "text-white" : "text-gray-800"
								}`}
							>
								{worstHabit ? worstHabit.name : "None"}
							</h3>
							{worstHabit && (
								<p
									className={`text-sm ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} mt-1`}
								>
									{getCompletionPercentage(worstHabit.id)}% completion
								</p>
							)}
						</div>
						<div className="p-3 rounded-full bg-red-100 text-red-600">
							<TrendingUp size={24} />
						</div>
					</div>
				</div>

				<div
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} rounded-lg shadow-md p-4`}
				>
					<div className="flex items-start justify-between">
						<div>
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Longest Streak
							</p>
							<h3
								className={`text-lg font-bold mt-1 ${
									darkMode ? "text-white" : "text-gray-800"
								}`}
							>
								{longestStreakInfo ? longestStreakInfo.habit.name : "None"}
							</h3>
							{longestStreakInfo && (
								<p
									className={`text-sm ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} mt-1`}
								>
									{longestStreakInfo.streak} days in a row
								</p>
							)}
						</div>
						<div className="p-3 rounded-full bg-orange-100 text-orange-600">
							<Flame size={24} />
						</div>
					</div>
				</div>
			</div>
		);
	};

	const Dashboard = () => {
		const filteredHabits = selectedHabit
			? habits.filter((h) => h.id === selectedHabit)
			: habits;

		return (
			<div>
				<SummaryCards />

				<h2
					className={`text-xl font-bold mb-4 ${
						darkMode ? "text-white" : "text-gray-800"
					}`}
				>
					Habit Overview
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredHabits.map((habit) => {
						const completion = getCompletionPercentage(habit.id);
						const streak = calculateStreak(habit.id);

						return (
							<div
								key={habit.id}
								className={`${
									darkMode ? "bg-gray-800" : "bg-white"
								} p-5 rounded-lg shadow-md transition-transform hover:shadow-lg duration-300 hover:-translate-y-1`}
							>
								<div className="flex justify-between items-center mb-3">
									<div className="flex items-center gap-3">
										<span
											className="p-3 rounded-full flex items-center justify-center"
											style={{ backgroundColor: `${habit.color}20` }}
										>
											{iconMap[habit.icon] || habit.icon}
										</span>
										<h3
											className={`font-semibold ${
												darkMode ? "text-white" : "text-gray-800"
											}`}
										>
											{habit.name}
										</h3>
									</div>
									<div className="flex gap-2">
										<button
											className={`p-1.5 rounded-full ${
												darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
											} transition-colors`}
											onClick={() => {
												setEditingHabit(habit);
												setShowAddHabitModal(true);
											}}
											aria-label="Edit habit"
										>
											<Edit2
												size={16}
												className={darkMode ? "text-gray-300" : "text-gray-500"}
											/>
										</button>
										<span
											className={`text-sm px-2 py-1 rounded font-medium ${
												completion >= 80
													? "bg-green-100 text-green-800"
													: completion >= 50
													? "bg-yellow-100 text-yellow-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{completion}%
										</span>
									</div>
								</div>

								<div className="flex justify-between mb-2">
									<span
										className={`text-sm ${
											darkMode ? "text-gray-300" : "text-gray-600"
										}`}
									>
										Progress
									</span>
									<span
										className={`text-sm ${
											darkMode ? "text-gray-300" : "text-gray-600"
										}`}
									>
										{completion}%
									</span>
								</div>

								<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
									<div
										className="h-2 rounded-full transition-all duration-300"
										style={{
											width: `${completion}%`,
											backgroundColor: habit.color,
										}}
									></div>
								</div>

								<div className="flex justify-between">
									<div>
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-600"
											}`}
										>
											Target
										</span>
										<p
											className={`font-medium ${
												darkMode ? "text-white" : "text-gray-800"
											}`}
										>
											{habit.target} {habit.unit}/day
										</p>
									</div>
									<div>
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-600"
											}`}
										>
											Current Streak
										</span>
										<p
											className={`font-medium ${
												darkMode ? "text-white" : "text-gray-800"
											} flex items-center gap-1`}
										>
											<Flame
												size={16}
												className={
													streak > 0
														? "text-orange-500"
														: darkMode
														? "text-gray-500"
														: "text-gray-400"
												}
											/>
											{streak} days
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	const Calendar = () => {
		const dates = getDates();
		const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const filteredHabits = selectedHabit
			? habits.filter((h) => h.id === selectedHabit)
			: habits;

		return (
			<div>
				<h2
					className={`text-xl font-bold mb-4 ${
						darkMode ? "text-white" : "text-gray-800"
					}`}
				>
					Calendar View
				</h2>

				{dateRange === "week" ? (
					<div
						className={`grid grid-cols-7 gap-3 ${
							darkMode ? "text-white" : "text-gray-800"
						}`}
					>
						{daysOfWeek.map((day, index) => (
							<div key={day} className="text-center font-medium py-2">
								{day}
							</div>
						))}

						{dates.map((date, dateIndex) => (
							<div
								key={dateIndex}
								className={`p-3 rounded-lg ${
									darkMode ? "bg-gray-800" : "bg-white"
								} shadow-sm ${
									date.toDateString() === new Date().toDateString()
										? darkMode
											? "ring-2 ring-blue-500"
											: "ring-2 ring-blue-400"
										: ""
								}`}
							>
								<div className="text-center mb-2">
									<span
										className={`text-sm font-medium px-2 py-1 rounded-full ${
											date.toDateString() === new Date().toDateString()
												? darkMode
													? "bg-blue-600 text-white"
													: "bg-blue-500 text-white"
												: darkMode
												? "text-gray-300"
												: "text-gray-600"
										}`}
									>
										{date.getDate()}
									</span>
								</div>

								<div className="space-y-2">
									{filteredHabits.map((habit) => {
										const log = getLogForDate(date, habit.id);
										const isCompleted = log?.completed || false;

										return (
											<button
												key={habit.id}
												className={`w-full p-2 rounded-lg text-white flex items-center justify-between cursor-pointer transition-all duration-200 ${
													isCompleted
														? "shadow-sm"
														: darkMode
														? "bg-gray-700 text-gray-300 hover:bg-gray-600"
														: "bg-gray-200 text-gray-600 hover:bg-gray-300"
												}`}
												style={{
													backgroundColor: isCompleted ? habit.color : "",
												}}
												onClick={() => toggleHabitCompletion(date, habit.id)}
											>
												<span className="flex items-center">
													{iconMap[habit.icon] || habit.icon}
												</span>
												<div className="flex items-center gap-1">
													<span className="text-xs font-medium">
														{log?.value || 0}/{habit.target}
													</span>
													{isCompleted && <CheckCircle size={14} />}
												</div>
											</button>
										);
									})}
								</div>
							</div>
						))}
					</div>
				) : (
					<div
						className={`grid grid-cols-7 gap-2 ${
							darkMode ? "text-white" : "text-gray-800"
						}`}
					>
						{daysOfWeek.map((day) => (
							<div key={day} className="text-center font-medium py-2">
								{day}
							</div>
						))}

						{/* Empty cells for the start of the month */}
						{Array.from({ length: dates[0].getDay() }).map((_, i) => (
							<div key={`empty-start-${i}`} className="p-2"></div>
						))}

						{dates.map((date, dateIndex) => (
							<div
								key={dateIndex}
								className={`p-2 rounded-lg ${
									darkMode ? "bg-gray-800" : "bg-white"
								} shadow-sm ${
									date.toDateString() === new Date().toDateString()
										? darkMode
											? "ring-2 ring-blue-500"
											: "ring-2 ring-blue-400"
										: ""
								}`}
							>
								<div className="text-center mb-1">
									<span
										className={`text-sm ${
											date.toDateString() === new Date().toDateString()
												? darkMode
													? "text-blue-400 font-medium"
													: "text-blue-600 font-medium"
												: darkMode
												? "text-gray-300"
												: "text-gray-600"
										}`}
									>
										{date.getDate()}
									</span>
								</div>

								<div className="flex flex-wrap gap-1 justify-center">
									{filteredHabits.map((habit) => {
										const log = getLogForDate(date, habit.id);
										const isCompleted = log?.completed || false;

										return (
											<button
												key={habit.id}
												className={`w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors ${
													isCompleted
														? "text-white shadow-sm"
														: darkMode
														? "bg-gray-700 text-gray-400 hover:bg-gray-600"
														: "bg-gray-200 text-gray-600 hover:bg-gray-300"
												}`}
												style={{
													backgroundColor: isCompleted ? habit.color : "",
												}}
												onClick={() => toggleHabitCompletion(date, habit.id)}
												title={`${habit.name}: ${log?.value || 0}/${
													habit.target
												} ${habit.unit}`}
											>
												{iconMap[habit.icon]
													? React.cloneElement(
															iconMap[habit.icon] as React.ReactElement,
															{ size: 14 }
													  )
													: habit.icon}
											</button>
										);
									})}
								</div>
							</div>
						))}

						{/* Empty cells for the end of the month */}
						{Array.from({ length: 6 - dates[dates.length - 1].getDay() }).map(
							(_, i) => (
								<div key={`empty-end-${i}`} className="p-2"></div>
							)
						)}
					</div>
				)}
			</div>
		);
	};

	const ProgressChart = () => {
		const chartData = getChartData();
		const filteredHabits = selectedHabit
			? habits.filter((h) => h.id === selectedHabit)
			: habits;

		return (
			<div>
				<h2
					className={`text-xl font-bold mb-4 ${
						darkMode ? "text-white" : "text-gray-800"
					}`}
				>
					Progress Analysis
				</h2>

				<div
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} p-5 rounded-lg shadow-md mb-6`}
				>
					<h3
						className={`font-semibold mb-4 flex items-center gap-2 ${
							darkMode ? "text-white" : "text-gray-800"
						}`}
					>
						<TrendingUp
							size={18}
							className={darkMode ? "text-blue-400" : "text-blue-500"}
						/>
						Daily Completion Trends
					</h3>
					<div className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke={darkMode ? "#374151" : "#e5e7eb"}
								/>
								<XAxis
									dataKey="date"
									stroke={darkMode ? "#9CA3AF" : "#6B7280"}
								/>
								<YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
								<Tooltip
									contentStyle={{
										backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
										borderColor: darkMode ? "#374151" : "#E5E7EB",
										color: darkMode ? "#F9FAFB" : "#111827",
									}}
								/>
								<Legend />
								{filteredHabits.map((habit) => (
									<Line
										key={habit.id}
										type="monotone"
										dataKey={habit.name}
										stroke={habit.color}
										strokeWidth={2}
										dot={{ fill: habit.color, r: 4 }}
										activeDot={{ r: 6, stroke: habit.color, strokeWidth: 2 }}
									/>
								))}
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} p-5 rounded-lg shadow-md`}
				>
					<h3
						className={`font-semibold mb-4 flex items-center gap-2 ${
							darkMode ? "text-white" : "text-gray-800"
						}`}
					>
						<BarChart2
							size={18}
							className={darkMode ? "text-blue-400" : "text-blue-500"}
						/>
						Completion Success Rate
					</h3>
					<div className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={filteredHabits.map((habit) => ({
									name: habit.name,
									percentage: getCompletionPercentage(habit.id),
									color: habit.color,
								}))}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke={darkMode ? "#374151" : "#e5e7eb"}
								/>
								<XAxis
									dataKey="name"
									stroke={darkMode ? "#9CA3AF" : "#6B7280"}
								/>
								<YAxis
									stroke={darkMode ? "#9CA3AF" : "#6B7280"}
									domain={[0, 100]}
									label={{
										value: "Completion %",
										angle: -90,
										position: "insideLeft",
										style: {
											textAnchor: "middle",
											fill: darkMode ? "#9CA3AF" : "#6B7280",
										},
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
										borderColor: darkMode ? "#374151" : "#E5E7EB",
										color: darkMode ? "#F9FAFB" : "#111827",
									}}
									formatter={(value) => [`${value}%`, "Completion Rate"]}
								/>
								<Bar
									dataKey="percentage"
									name="Completion Rate"
									radius={[4, 4, 0, 0]}
								>
									{filteredHabits.map((habit) => (
										<cell key={`cell-${habit.id}`} fill={habit.color} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		);
	};

	const Streaks = () => {
		const filteredHabits = selectedHabit
			? habits.filter((h) => h.id === selectedHabit)
			: habits;

		return (
			<div>
				<h2
					className={`text-xl font-bold mb-4 ${
						darkMode ? "text-white" : "text-gray-800"
					}`}
				>
					Streaks & Milestones
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					{filteredHabits.map((habit) => {
						const streak = calculateStreak(habit.id);
						const nextMilestone = Math.ceil(streak / 7) * 7;
						const progress = (streak / nextMilestone) * 100;

						return (
							<div
								key={habit.id}
								className={`${
									darkMode ? "bg-gray-800" : "bg-white"
								} p-5 rounded-lg shadow-md transition-transform hover:shadow-lg duration-300 hover:-translate-y-1`}
							>
								<div className="flex items-center gap-3 mb-4">
									<span
										className="p-3 rounded-full flex items-center justify-center"
										style={{ backgroundColor: `${habit.color}20` }}
									>
										{iconMap[habit.icon] || habit.icon}
									</span>
									<div>
										<h3
											className={`font-semibold ${
												darkMode ? "text-white" : "text-gray-800"
											}`}
										>
											{habit.name}
										</h3>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-600"
											} flex items-center gap-1`}
										>
											<Flame
												size={14}
												className={
													streak > 0
														? "text-orange-500"
														: darkMode
														? "text-gray-500"
														: "text-gray-400"
												}
											/>
											Current streak:{" "}
											<span className="font-bold">{streak} days</span>
										</p>
									</div>
								</div>

								<div className="mb-2 flex justify-between">
									<span
										className={`text-sm ${
											darkMode ? "text-gray-300" : "text-gray-600"
										}`}
									>
										Progress to {nextMilestone} days
									</span>
									<span
										className={`text-sm ${
											darkMode ? "text-gray-300" : "text-gray-600"
										}`}
									>
										{streak}/{nextMilestone}
									</span>
								</div>

								<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
									<div
										className="h-2 rounded-full transition-all duration-300"
										style={{
											width: `${progress}%`,
											backgroundColor: habit.color,
										}}
									></div>
								</div>

								<div className="flex flex-wrap gap-2">
									{[7, 30, 60, 90, 180, 365].map((milestone) => (
										<div
											key={milestone}
											className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
												streak >= milestone
													? "bg-green-100 text-green-800"
													: darkMode
													? "bg-gray-700 text-gray-400"
													: "bg-gray-200 text-gray-600"
											}`}
										>
											{milestone} {milestone === 1 ? "day" : "days"}{" "}
											{streak >= milestone ? "✓" : ""}
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>

				<div
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} p-5 rounded-lg shadow-md`}
				>
					<h3
						className={`font-semibold mb-4 flex items-center gap-2 ${
							darkMode ? "text-white" : "text-gray-800"
						}`}
					>
						<Award
							size={18}
							className={darkMode ? "text-blue-400" : "text-blue-500"}
						/>
						Streak Comparison
					</h3>
					<div className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={filteredHabits.map((habit) => ({
									name: habit.name,
									streak: calculateStreak(habit.id),
									color: habit.color,
								}))}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke={darkMode ? "#374151" : "#e5e7eb"}
								/>
								<XAxis
									dataKey="name"
									stroke={darkMode ? "#9CA3AF" : "#6B7280"}
								/>
								<YAxis
									stroke={darkMode ? "#9CA3AF" : "#6B7280"}
									label={{
										value: "Days",
										angle: -90,
										position: "insideLeft",
										style: {
											textAnchor: "middle",
											fill: darkMode ? "#9CA3AF" : "#6B7280",
										},
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
										borderColor: darkMode ? "#374151" : "#E5E7EB",
										color: darkMode ? "#F9FAFB" : "#111827",
									}}
									formatter={(value) => [`${value} days`, "Current Streak"]}
								/>
								<Bar
									dataKey="streak"
									name="Current Streak"
									radius={[4, 4, 0, 0]}
								>
									{filteredHabits.map((habit) => (
										<cell key={`cell-${habit.id}`} fill={habit.color} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		);
	};

	const AddHabitModal = () => {
		if (!showAddHabitModal && !editingHabit) return null;

		const handleChange = (
			e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
		) => {
			const { name, value } = e.target;

			if (editingHabit) {
				setEditingHabit({
					...editingHabit,
					[name]: name === "target" ? parseInt(value) || 1 : value,
				});
			} else {
				setNewHabit({
					...newHabit,
					[name]: name === "target" ? parseInt(value) || 1 : value,
				});
			}
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div
					className={`${
						darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
					} rounded-lg shadow-lg w-full max-w-md mx-auto`}
				>
					<div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
						<h3 className="text-lg font-semibold">
							{editingHabit ? "Edit Habit" : "Add New Habit"}
						</h3>
						<button
							className={`p-1 rounded-full ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
							} transition-colors`}
							onClick={() => {
								setShowAddHabitModal(false);
								setEditingHabit(null);
							}}
						>
							<X size={20} />
						</button>
					</div>

					<div className="p-4">
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Habit Name
							</label>
							<input
								type="text"
								name="name"
								value={editingHabit ? editingHabit.name : newHabit.name}
								onChange={handleChange}
								placeholder="e.g., Drink Water"
								className={`w-full px-3 py-2 rounded-md border ${
									darkMode
										? "bg-gray-700 border-gray-600 text-white"
										: "bg-white border-gray-300 text-gray-700"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block text-sm font-medium mb-1">Icon</label>
								<select
									name="icon"
									value={editingHabit ? editingHabit.icon : newHabit.icon}
									onChange={handleChange}
									className={`w-full px-3 py-2 rounded-md border ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-700"
									} focus:outline-none focus:ring-2 focus:ring-blue-500`}
								>
									{iconOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.value} {option.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Color</label>
								<div className="flex items-center">
									<select
										name="color"
										value={editingHabit ? editingHabit.color : newHabit.color}
										onChange={handleChange}
										className={`w-full px-3 py-2 rounded-md border ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "bg-white border-gray-300 text-gray-700"
										} focus:outline-none focus:ring-2 focus:ring-blue-500`}
									>
										{colorOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<div
										className="w-6 h-6 rounded-full ml-2"
										style={{
											backgroundColor: editingHabit
												? editingHabit.color
												: newHabit.color,
										}}
									></div>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Daily Target
								</label>
								<input
									type="number"
									min="1"
									name="target"
									value={editingHabit ? editingHabit.target : newHabit.target}
									onChange={handleChange}
									className={`w-full px-3 py-2 rounded-md border ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-700"
									} focus:outline-none focus:ring-2 focus:ring-blue-500`}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Unit</label>
								<input
									type="text"
									name="unit"
									value={editingHabit ? editingHabit.unit : newHabit.unit}
									onChange={handleChange}
									placeholder="e.g., glasses, minutes"
									className={`w-full px-3 py-2 rounded-md border ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-700"
									} focus:outline-none focus:ring-2 focus:ring-blue-500`}
								/>
							</div>
						</div>

						<div className="flex items-center justify-between mt-6">
							{editingHabit ? (
								<>
									<button
										className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
										onClick={() => setShowDeleteConfirm(true)}
									>
										Delete
									</button>

									<button
										className={`px-4 py-2 rounded-md ${
											darkMode
												? "bg-blue-600 hover:bg-blue-700"
												: "bg-blue-500 hover:bg-blue-600"
										} text-white transition-colors flex items-center gap-1`}
										onClick={updateHabit}
									>
										<Save size={18} />
										Update Habit
									</button>
								</>
							) : (
								<>
									<button
										className={`px-4 py-2 rounded-md ${
											darkMode
												? "bg-gray-700 hover:bg-gray-600"
												: "bg-gray-200 hover:bg-gray-300"
										} transition-colors`}
										onClick={() => setShowAddHabitModal(false)}
									>
										Cancel
									</button>

									<button
										className={`px-4 py-2 rounded-md ${
											darkMode
												? "bg-blue-600 hover:bg-blue-700"
												: "bg-blue-500 hover:bg-blue-600"
										} text-white transition-colors flex items-center gap-1`}
										onClick={addNewHabit}
									>
										<Plus size={18} />
										Add Habit
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const DeleteConfirmModal = () => {
		if (!showDeleteConfirm || !editingHabit) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div
					className={`${
						darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
					} rounded-lg shadow-lg w-full max-w-md mx-auto p-6`}
				>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-full bg-red-100 text-red-600">
							<AlertCircle size={24} />
						</div>
						<h3 className="text-lg font-semibold">Confirm Deletion</h3>
					</div>

					<p className={darkMode ? "text-gray-300" : "text-gray-600"}>
						Are you sure you want to delete the habit "{editingHabit.name}"?
						This action cannot be undone, and all tracking data will be lost.
					</p>

					<div className="flex items-center justify-end gap-3 mt-6">
						<button
							className={`px-4 py-2 rounded-md ${
								darkMode
									? "bg-gray-700 hover:bg-gray-600"
									: "bg-gray-200 hover:bg-gray-300"
							} transition-colors`}
							onClick={() => setShowDeleteConfirm(false)}
						>
							Cancel
						</button>

						<button
							className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1"
							onClick={deleteHabit}
						>
							<Trash2 size={18} />
							Delete Habit
						</button>
					</div>
				</div>
			</div>
		);
	};

	const SettingsModal = () => {
		if (!showSettingsModal) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div
					className={`${
						darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
					} rounded-lg shadow-lg w-full max-w-md mx-auto`}
				>
					<div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Settings size={18} /> Settings
						</h3>
						<button
							className={`p-1 rounded-full ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
							} transition-colors`}
							onClick={() => setShowSettingsModal(false)}
						>
							<X size={20} />
						</button>
					</div>

					<div className="p-4">
						<div className="mb-4">
							<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-full ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										{darkMode ? <Moon size={18} /> : <Sun size={18} />}
									</div>
									<span className="font-medium">Theme</span>
								</div>
								<button
									className={`px-3 py-1 rounded-full ${
										darkMode
											? "bg-gray-700 text-yellow-400"
											: "bg-gray-100 text-gray-600"
									} flex items-center gap-1 cursor-pointer transition-colors`}
									onClick={() => setDarkMode(!darkMode)}
								>
									{darkMode ? <Moon size={16} /> : <Sun size={16} />}
									{darkMode ? "Dark" : "Light"}
								</button>
							</div>

							<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-full ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Bell size={18} />
									</div>
									<span className="font-medium">Notifications</span>
								</div>
								<div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full shadow-sm">
									<input
										type="checkbox"
										className="absolute w-6 h-6 rounded-full bg-white right-0 curson-pointer checked:right-0 transition-all duration-200"
										id="notificationToggle"
									/>
									<label
										htmlFor="notificationToggle"
										className={`flex h-full rounded-full cursor-pointer ${
											darkMode ? "bg-gray-700" : "bg-gray-200"
										}`}
									>
										<span
											className={`relative top-0 w-6 h-6 rounded-full transition-all duration-200 ease-in-out bg-white shadow-md transform translate-x-0`}
										></span>
									</label>
								</div>
							</div>

							<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-full ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Download size={18} />
									</div>
									<span className="font-medium">Export Data</span>
								</div>
								<button
									className={`px-3 py-1 rounded-md ${
										darkMode
											? "bg-gray-700 hover:bg-gray-600"
											: "bg-gray-100 hover:bg-gray-200"
									} transition-colors`}
									onClick={() => showToast("Data export coming soon!", "info")}
								>
									Export
								</button>
							</div>

							<div className="flex items-center justify-between py-3">
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-full ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Share2 size={18} />
									</div>
									<span className="font-medium">Share Progress</span>
								</div>
								<button
									className={`px-3 py-1 rounded-md ${
										darkMode
											? "bg-gray-700 hover:bg-gray-600"
											: "bg-gray-100 hover:bg-gray-200"
									} transition-colors`}
									onClick={() =>
										showToast("Sharing feature coming soon!", "info")
									}
								>
									Share
								</button>
							</div>
						</div>

						<div className="mt-6">
							<button
								className={`w-full py-2 rounded-md ${
									darkMode
										? "bg-blue-600 hover:bg-blue-700"
										: "bg-blue-500 hover:bg-blue-600"
								} text-white transition-colors`}
								onClick={() => setShowSettingsModal(false)}
							>
								Save Settings
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const Toast = ({ toast }: { toast: ToastMessage }) => {
		const bgColor =
			toast.type === "success"
				? darkMode
					? "bg-green-800"
					: "bg-green-100"
				: toast.type === "error"
				? darkMode
					? "bg-red-800"
					: "bg-red-100"
				: darkMode
				? "bg-blue-800"
				: "bg-blue-100";

		const textColor =
			toast.type === "success"
				? darkMode
					? "text-green-200"
					: "text-green-800"
				: toast.type === "error"
				? darkMode
					? "text-red-200"
					: "text-red-800"
				: darkMode
				? "text-blue-200"
				: "text-blue-800";

		const Icon =
			toast.type === "success"
				? CheckCircle
				: toast.type === "error"
				? AlertCircle
				: InfoIcon;

		return (
			<div
				className={`${bgColor} ${textColor} p-3 rounded-lg shadow-lg flex items-center gap-2 max-w-xs animate-slideIn`}
			>
				<Icon size={18} />
				<p>{toast.message}</p>
			</div>
		);
	};

	return (
		<div
			className={`min-h-screen ${
				darkMode ? "bg-gray-900" : "bg-gray-50"
			} transition-colors duration-200`}
		>
			<Header />
			<Navigation />

			<main className="max-w-5xl mx-auto p-4">
				<DateSelector />
				<HabitList />

				{activeView === "dashboard" && <Dashboard />}
				{activeView === "calendar" && <Calendar />}
				{activeView === "progress" && <ProgressChart />}
				{activeView === "streaks" && <Streaks />}
			</main>

			{/* Toast container */}
			<div className="fixed bottom-4 right-4 space-y-2 z-50">
				{toasts.map((toast) => (
					<Toast key={toast.id} toast={toast} />
				))}
			</div>

			{/* Modals */}
			<AddHabitModal />
			<DeleteConfirmModal />
			<SettingsModal />

			<style jsx global>{`
				@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateX(100%);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}
				.animate-slideIn {
					animation: slideIn 0.3s ease-out forwards;
				}
				.scrollbar-thin::-webkit-scrollbar {
					height: 8px;
				}
				.scrollbar-thin::-webkit-scrollbar-track {
					background: ${darkMode ? "#1F2937" : "#F3F4F6"};
					border-radius: 4px;
				}
				.scrollbar-thin::-webkit-scrollbar-thumb {
					background: ${darkMode ? "#4B5563" : "#D1D5DB"};
					border-radius: 4px;
				}
				.scrollbar-thin::-webkit-scrollbar-thumb:hover {
					background: ${darkMode ? "#6B7280" : "#9CA3AF"};
				}
			`}</style>
		</div>
	);
};

export default HealthHabitTracker;
