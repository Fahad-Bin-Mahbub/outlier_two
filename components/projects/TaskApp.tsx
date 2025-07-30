"use client";
import { useState, useEffect, useRef } from "react";
import {
	Plus,
	Calendar,
	ListTodo,
	Clock,
	CheckSquare,
	Trash2,
	Search,
	Tag,
	Flag,
	AlertTriangle,
	Sun,
	Moon,
	X,
	Check,
	Info,
	ArrowUp,
	ArrowDown,
	Edit,
	Filter,
	SlidersHorizontal,
	ChevronDown,
	BarChart2,
	PieChart,
	CheckCircle,
	Clock3,
	AlertCircle,
	Loader2,
	Save,
	Download,
	Upload,
	Settings,
	Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
	id: string;
	title: string;
	dueDate: string;
	completed: boolean;
	isNew?: boolean;
	category?: string;
	priority?: "low" | "medium" | "high";
	notes?: string;
}

interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info";
}

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
	transition: { duration: 0.3 },
};

const scaleInOut = {
	initial: { scale: 0.95, opacity: 0 },
	animate: { scale: 1, opacity: 1 },
	exit: { scale: 0.95, opacity: 0 },
	transition: { type: "spring", stiffness: 300, damping: 25 },
};

const listItemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: (custom: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: custom * 0.05 },
	}),
};

const CATEGORIES = [
	{ name: "Work", color: "#4F46E5" },
	{ name: "Personal", color: "#10B981" },
	{ name: "Shopping", color: "#F59E0B" },
	{ name: "Health", color: "#EF4444" },
	{ name: "Finance", color: "#6366F1" },
	{ name: "Other", color: "#71717A" },
];

const PRIORITIES = {
	low: { color: "#10B981", icon: <Flag size={14} />, text: "Low" },
	medium: { color: "#F59E0B", icon: <Flag size={14} />, text: "Medium" },
	high: { color: "#EF4444", icon: <Flag size={14} />, text: "High" },
};

const DEMO_TASKS: Task[] = [
	{
		id: "demo-1",
		title: "Quarterly Report Review",
		dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		completed: false,
		category: "Work",
		priority: "high",
		notes: "Need to review Q2 performance metrics before the board meeting",
	},
	{
		id: "demo-2",
		title: "Gym Session",
		dueDate: new Date().toISOString().split("T")[0],
		completed: false,
		category: "Health",
		priority: "medium",
		notes: "30 min cardio + strength training",
	},
	{
		id: "demo-3",
		title: "Buy Groceries",
		dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		completed: true,
		category: "Shopping",
		priority: "low",
		notes: "Milk, eggs, bread, fruits, and vegetables",
	},
	{
		id: "demo-4",
		title: "Pay Monthly Bills",
		dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		completed: false,
		category: "Finance",
		priority: "high",
		notes: "Electricity, water, internet, and rent",
	},
	{
		id: "demo-5",
		title: "Call Mom",
		dueDate: new Date().toISOString().split("T")[0],
		completed: true,
		category: "Personal",
		priority: "medium",
		notes: "Check how she's doing and discuss weekend plans",
	},
	{
		id: "demo-6",
		title: "Update Portfolio Website",
		dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		completed: false,
		category: "Work",
		priority: "low",
		notes: "Add recent projects and update skills section",
	},
];

const TaskDashboard = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [title, setTitle] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
	const [isMobile, setIsMobile] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [storageError, setStorageError] = useState<string | null>(null);
	const newTaskRef = useRef<HTMLLIElement>(null);
	const [dateError, setDateError] = useState<string | null>(null);
	const [category, setCategory] = useState<string>("");
	const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("");
	const [notes, setNotes] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
		null
	);
	const [editingTask, setEditingTask] = useState<string | null>(null);
	const [showAdvancedFilters, setShowAdvancedFilters] =
		useState<boolean>(false);
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const [priorityFilter, setPriorityFilter] = useState<
		"low" | "medium" | "high" | ""
	>("");
	const [sortOption, setSortOption] = useState<
		"dueDate" | "priority" | "alphabetical" | ""
	>("");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [loading, setLoading] = useState(true);
	const [showSettings, setShowSettings] = useState(false);
	const [showStatsView, setShowStatsView] = useState(true);
	const [showTaskReminders, setShowTaskReminders] = useState(true);
	const [accentColor, setAccentColor] = useState("#1B5DA8");
	const [taskView, setTaskView] = useState<"list" | "calendar" | "board">(
		"list"
	);
	const [showNotifications, setShowNotifications] = useState(false);

	const [notifications, setNotifications] = useState([
		{
			id: "1",
			message: "Task 'Quarterly Report Review' is due tomorrow",
			read: false,
		},
		{ id: "2", message: "You've completed 2 tasks today!", read: true },
		{ id: "3", message: "3 tasks are overdue", read: false },
	]);

	useEffect(() => {
		const checkWidth = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkWidth();
		window.addEventListener("resize", checkWidth);
		return () => {
			window.removeEventListener("resize", checkWidth);
		};
	}, []);

	useEffect(() => {
		try {
			setTimeout(() => {
				const savedTasks = localStorage.getItem("tasks");
				if (savedTasks && JSON.parse(savedTasks).length > 0) {
					setTasks(JSON.parse(savedTasks));
				} else {
					setTasks(DEMO_TASKS);
				}

				const savedTheme = localStorage.getItem("darkMode");
				if (savedTheme) {
					setDarkMode(JSON.parse(savedTheme));
				} else {
					const prefersDarkMode =
						window.matchMedia &&
						window.matchMedia("(prefers-color-scheme: dark)").matches;
					setDarkMode(prefersDarkMode);
				}

				const savedAccentColor = localStorage.getItem("accentColor");
				if (savedAccentColor) {
					setAccentColor(savedAccentColor);
				}

				setLoading(false);
			}, 1000);
		} catch (error) {
			console.error("Failed to load data from localStorage:", error);
			setStorageError("Failed to load your tasks. Please refresh the page.");
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem("darkMode", JSON.stringify(darkMode));
		} catch (error) {
			console.error("Failed to save theme preference:", error);
		}
	}, [darkMode]);

	useEffect(() => {
		try {
			localStorage.setItem("accentColor", accentColor);
		} catch (error) {
			console.error("Failed to save accent color:", error);
		}
	}, [accentColor]);

	useEffect(() => {
		try {
			localStorage.setItem(
				"tasks",
				JSON.stringify(
					tasks.map((task) => {
						const { isNew, ...rest } = task;
						return rest;
					})
				)
			);
		} catch (error) {
			console.error("Failed to save tasks to localStorage:", error);
			setStorageError(
				"Failed to save your tasks. Please check your browser settings."
			);
		}
	}, [tasks]);

	useEffect(() => {
		if (newTaskRef.current) {
			newTaskRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [tasks]);

	useEffect(() => {
		if (toasts.length > 0) {
			const timer = setTimeout(() => {
				setToasts((prevToasts) => prevToasts.slice(1));
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [toasts]);

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		const newToast = {
			id: Date.now().toString(),
			message,
			type,
		};
		setToasts((prevToasts) => [...prevToasts, newToast]);
	};

	const validateDate = (date: string): string | null => {
		if (!date) return null;
		const parsed = new Date(date);
		if (parsed.toString() === "Invalid Date") {
			return "Please enter a valid date.";
		}
		return null;
	};

	const addTask = () => {
		if (title.trim() === "") return;
		const dateValidation = validateDate(dueDate);
		if (dateValidation) {
			setDateError(dateValidation);
			return;
		}
		setDateError(null);
		const newTask: Task = {
			id: Date.now().toString(),
			title: title.trim(),
			dueDate: dueDate,
			completed: false,
			isNew: true,
			category: category || undefined,
			priority: priority as "low" | "medium" | "high" | undefined,
			notes: notes.trim() || undefined,
		};
		setTasks([...tasks, newTask]);
		showToast(`Task "${title.trim()}" added successfully!`, "success");

		setTitle("");
		setDueDate("");
		setCategory("");
		setPriority("");
		setNotes("");

		setShowForm(false);
	};

	const updateTask = () => {
		if (!editingTask || title.trim() === "") return;

		const dateValidation = validateDate(dueDate);
		if (dateValidation) {
			setDateError(dateValidation);
			return;
		}

		setDateError(null);
		setTasks(
			tasks.map((task) =>
				task.id === editingTask
					? {
							...task,
							title: title.trim(),
							dueDate,
							category: category || undefined,
							priority: priority as "low" | "medium" | "high" | undefined,
							notes: notes.trim() || undefined,
					  }
					: task
			)
		);

		showToast(`Task "${title.trim()}" updated successfully!`, "success");

		setTitle("");
		setDueDate("");
		setCategory("");
		setPriority("");
		setNotes("");
		setEditingTask(null);

		setShowForm(false);
	};

	const startEditingTask = (id: string) => {
		const taskToEdit = tasks.find((task) => task.id === id);
		if (taskToEdit) {
			setTitle(taskToEdit.title);
			setDueDate(taskToEdit.dueDate || "");
			setCategory(taskToEdit.category || "");
			setPriority(taskToEdit.priority || "");
			setNotes(taskToEdit.notes || "");
			setEditingTask(id);
			setShowForm(true);
		}
	};

	const cancelEditing = () => {
		setTitle("");
		setDueDate("");
		setCategory("");
		setPriority("");
		setNotes("");
		setEditingTask(null);
		setShowForm(false);
	};

	const toggleTaskCompletion = (id: string) => {
		const updatedTasks = tasks.map((task) => {
			if (task.id === id) {
				const newStatus = !task.completed;

				showToast(
					newStatus
						? `Task "${task.title}" marked as complete!`
						: `Task "${task.title}" marked as active!`,
					"success"
				);
				return { ...task, completed: newStatus };
			}
			return task;
		});

		setTasks(updatedTasks);
	};

	const deleteTask = (id: string) => {
		const taskToDelete = tasks.find((task) => task.id === id);
		if (taskToDelete) {
			setTasks(tasks.filter((task) => task.id !== id));
			showToast(`Task "${taskToDelete.title}" deleted!`, "info");
		}
		setDeleteConfirmation(null);
	};

	const confirmDelete = (id: string) => {
		setDeleteConfirmation(id);
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		showToast(`Switched to ${!darkMode ? "dark" : "light"} mode!`, "info");
	};

	const exportTasks = () => {
		try {
			const dataStr = JSON.stringify(tasks, null, 2);
			const dataUri =
				"data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

			const exportFileDefaultName = `taskmaster-export-${
				new Date().toISOString().split("T")[0]
			}.json`;

			const linkElement = document.createElement("a");
			linkElement.setAttribute("href", dataUri);
			linkElement.setAttribute("download", exportFileDefaultName);
			linkElement.click();

			showToast("Tasks exported successfully!", "success");
		} catch (error) {
			console.error("Export failed:", error);
			showToast("Failed to export tasks", "error");
		}
	};

	const importTasks = () => {
		showToast("Import feature would open a file picker here", "info");
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const isTaskOverdue = (dueDate: string) => {
		if (!dueDate) return false;
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const taskDate = new Date(dueDate);
		return taskDate < today && taskDate.toString() !== "Invalid Date";
	};

	const getTaskStats = () => {
		const total = tasks.length;
		const completed = tasks.filter((task) => task.completed).length;
		const active = total - completed;
		const overdue = tasks.filter(
			(task) => !task.completed && isTaskOverdue(task.dueDate)
		).length;
		const dueToday = tasks.filter((task) => {
			if (!task.dueDate || task.completed) return false;
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const taskDate = new Date(task.dueDate);
			taskDate.setHours(0, 0, 0, 0);
			return taskDate.getTime() === today.getTime();
		}).length;

		const dueSoon = tasks.filter((task) => {
			if (!task.dueDate || task.completed) return false;
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			const dayAfterTomorrow = new Date(today);
			dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
			const taskDate = new Date(task.dueDate);
			return taskDate >= tomorrow && taskDate <= dayAfterTomorrow;
		}).length;

		const categoryCount: Record<string, number> = {};
		tasks.forEach((task) => {
			const category = task.category || "Uncategorized";
			categoryCount[category] = (categoryCount[category] || 0) + 1;
		});

		const priorityCount = {
			high: tasks.filter((task) => task.priority === "high").length,
			medium: tasks.filter((task) => task.priority === "medium").length,
			low: tasks.filter((task) => task.priority === "low").length,
			none: tasks.filter((task) => !task.priority).length,
		};

		return {
			total,
			completed,
			active,
			overdue,
			dueToday,
			dueSoon,
			categoryCount,
			priorityCount,
			completionRate: total ? Math.round((completed / total) * 100) : 0,
		};
	};

	const getFilteredAndSortedTasks = () => {
		let filtered = tasks.filter((task) => {
			if (filter === "active" && task.completed) return false;
			if (filter === "completed" && !task.completed) return false;

			if (
				searchQuery &&
				!task.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
				return false;

			if (categoryFilter && task.category !== categoryFilter) return false;

			if (priorityFilter && task.priority !== priorityFilter) return false;

			return true;
		});

		if (sortOption) {
			filtered = [...filtered].sort((a, b) => {
				if (sortOption === "dueDate") {
					if (!a.dueDate) return sortDirection === "asc" ? 1 : -1;
					if (!b.dueDate) return sortDirection === "asc" ? -1 : 1;
					return sortDirection === "asc"
						? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
						: new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
				} else if (sortOption === "priority") {
					const priorityValues = { high: 3, medium: 2, low: 1, undefined: 0 };
					const aValue = a.priority ? priorityValues[a.priority] : 0;
					const bValue = b.priority ? priorityValues[b.priority] : 0;
					return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
				} else if (sortOption === "alphabetical") {
					return sortDirection === "asc"
						? a.title.localeCompare(b.title)
						: b.title.localeCompare(a.title);
				}
				return 0;
			});
		}

		return filtered;
	};

	const filteredTasks = getFilteredAndSortedTasks();
	const taskStats = getTaskStats();

	const getCategoryColor = (categoryName?: string) => {
		if (!categoryName) return "#71717A";
		const category = CATEGORIES.find((cat) => cat.name === categoryName);
		return category ? category.color : "#71717A";
	};

	const getPriorityInfo = (priorityLevel?: "low" | "medium" | "high") => {
		if (!priorityLevel) return { color: "#71717A", icon: null, text: "" };
		return PRIORITIES[priorityLevel];
	};

	const getTaskCardClasses = (task: Task) => {
		const baseClasses = `relative border-l-4 transition-all ${
			darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
		}`;

		if (task.completed) {
			return `${baseClasses} border-l-green-600 ${
				darkMode ? "bg-green-900/20" : "bg-green-50"
			}`;
		}

		if (isTaskOverdue(task.dueDate)) {
			return `${baseClasses} border-l-red-600 ${
				darkMode ? "bg-red-900/20" : "bg-red-50"
			}`;
		}

		if (task.priority === "high") {
			return `${baseClasses} border-l-red-500`;
		}

		if (task.priority === "medium") {
			return `${baseClasses} border-l-amber-500`;
		}

		if (task.priority === "low") {
			return `${baseClasses} border-l-emerald-500`;
		}

		return `${baseClasses} border-l-gray-400`;
	};

	const themeClasses = {
		appBg: darkMode
			? "bg-gray-900"
			: `bg-gradient-to-b from-[${accentColor.replace(
					"#",
					""
			  )}30] to-[${accentColor.replace("#", "")}70]`,
		cardBg: darkMode
			? "bg-gray-800 border-gray-700"
			: "bg-white border-gray-200",
		text: darkMode ? "text-gray-200" : "text-gray-900",
		mutedText: darkMode ? "text-gray-400" : "text-gray-500",
		primaryBtn: darkMode
			? "bg-indigo-600 hover:bg-indigo-700"
			: `bg-[${accentColor}] hover:bg-[${accentColor.replace("#", "")}dd]`,
		secondaryBtn: darkMode
			? "bg-gray-700 hover:bg-gray-600"
			: "bg-gray-200 hover:bg-gray-300",
		actionBtn: darkMode
			? "bg-indigo-600 hover:bg-indigo-700"
			: `bg-[${accentColor}] hover:bg-[${accentColor.replace("#", "")}dd]`,
		dangerBtn: "bg-red-600 hover:bg-red-700",
		inputBg: darkMode
			? "bg-gray-700 border-gray-600"
			: "bg-white border-gray-300",
		heading: darkMode ? "text-white" : "text-gray-800",
		statCardBg: darkMode ? "bg-gray-800" : "bg-white",
		highlightText: darkMode ? "text-[#78CFFF]" : `text-[${accentColor}]`,
		priorityHighBg: darkMode ? "bg-red-900/30" : "bg-red-100",
		priorityMediumBg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
		priorityLowBg: darkMode ? "bg-green-900/30" : "bg-green-100",
		accentColorLight: `${accentColor}20`,
		formOverlay: darkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50",
	};

	const handleAddTaskSubmit = (e: React.MouseEvent) => {
		e.preventDefault();
		if (editingTask) {
			updateTask();
		} else {
			addTask();
		}
	};

	const markAllNotificationsAsRead = () => {
		setNotifications(
			notifications.map((notification) => ({
				...notification,
				read: true,
			}))
		);
		showToast("All notifications marked as read", "success");
	};

	if (loading) {
		return (
			<div
				className={`min-h-screen ${
					darkMode
						? "bg-gray-900"
						: `bg-gradient-to-b from-[#0a2a52] to-[#104975]`
				} flex items-center justify-center`}
			>
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-white mb-2">
						Loading TaskMaster
					</h2>
					<p className="text-white text-opacity-80">
						Please wait while we prepare your dashboard...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen ${
				darkMode
					? "bg-gray-900"
					: `bg-gradient-to-b from-[#0a2a52] to-[#104975]`
			} py-8 px-2 sm:px-4 lg:px-8 transition-colors duration-300`}
		>
			<div className="max-w-6xl mx-auto">
				<div className="fixed top-4 right-4 z-50 flex space-x-2">
					<motion.button
						onClick={() => setShowNotifications(!showNotifications)}
						className={`p-2 rounded-full ${
							darkMode ? "bg-gray-700" : "bg-white"
						} shadow-lg cursor-pointer relative`}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						aria-label="Notifications"
					>
						<Bell
							size={20}
							className={darkMode ? "text-white" : "text-gray-700"}
						/>
						{notifications.filter((n) => !n.read).length > 0 && (
							<span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
								{notifications.filter((n) => !n.read).length}
							</span>
						)}
					</motion.button>

					<motion.button
						onClick={() => setShowSettings(!showSettings)}
						className={`p-2 rounded-full ${
							darkMode ? "bg-gray-700" : "bg-white"
						} shadow-lg cursor-pointer`}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						aria-label="Settings"
					>
						<Settings
							size={20}
							className={darkMode ? "text-white" : "text-gray-700"}
						/>
					</motion.button>

					<motion.button
						onClick={toggleDarkMode}
						className={`p-2 rounded-full ${
							darkMode ? "bg-gray-700" : "bg-white"
						} shadow-lg cursor-pointer`}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						aria-label={
							darkMode ? "Switch to light mode" : "Switch to dark mode"
						}
					>
						{darkMode ? (
							<Sun size={20} className="text-yellow-300" />
						) : (
							<Moon size={20} className="text-gray-700" />
						)}
					</motion.button>
				</div>

				<AnimatePresence>
					{showSettings && (
						<motion.div
							className="fixed inset-0 z-50 flex items-center justify-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<div
								className={themeClasses.formOverlay}
								onClick={() => setShowSettings(false)}
							></div>
							<motion.div
								className={`${themeClasses.cardBg} rounded-lg shadow-lg p-6 max-w-md w-full mx-4 z-10`}
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
							>
								<div className="flex justify-between items-center mb-4">
									<h2
										className={`text-xl font-semibold ${themeClasses.heading}`}
									>
										Settings
									</h2>
									<button
										onClick={() => setShowSettings(false)}
										className={`p-1 rounded-full ${themeClasses.mutedText} hover:${themeClasses.text}`}
									>
										<X size={20} />
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<h3
											className={`text-lg font-medium ${themeClasses.text} mb-3`}
										>
											Appearance
										</h3>
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<span className={themeClasses.text}>Dark Mode</span>
												<button
													onClick={toggleDarkMode}
													className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
														darkMode
															? "bg-indigo-600 justify-end"
															: "bg-gray-300 justify-start"
													}`}
												>
													<span className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 block mx-0.5"></span>
												</button>
											</div>

											<div>
												<label className={`block ${themeClasses.text} mb-2`}>
													Accent Color
												</label>
												<div className="flex space-x-2">
													{[
														"#1B5DA8",
														"#10B981",
														"#F59E0B",
														"#EF4444",
														"#6366F1",
														"#EC4899",
													].map((color) => (
														<button
															key={color}
															onClick={() => setAccentColor(color)}
															className={`w-8 h-8 rounded-full border-2 ${
																accentColor === color
																	? "border-white"
																	: "border-transparent"
															}`}
															style={{ backgroundColor: color }}
															aria-label={`Set accent color to ${color}`}
														></button>
													))}
												</div>
											</div>
										</div>
									</div>

									<div>
										<h3
											className={`text-lg font-medium ${themeClasses.text} mb-3`}
										>
											Display Options
										</h3>
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<span className={themeClasses.text}>
													Show Statistics
												</span>
												<button
													onClick={() => setShowStatsView(!showStatsView)}
													className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
														showStatsView
															? "bg-indigo-600 justify-end"
															: "bg-gray-300 justify-start"
													}`}
												>
													<span className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 block mx-0.5"></span>
												</button>
											</div>

											<div className="flex items-center justify-between">
												<span className={themeClasses.text}>
													Task Reminders
												</span>
												<button
													onClick={() =>
														setShowTaskReminders(!showTaskReminders)
													}
													className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
														showTaskReminders
															? "bg-indigo-600 justify-end"
															: "bg-gray-300 justify-start"
													}`}
												>
													<span className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 block mx-0.5"></span>
												</button>
											</div>

											<div>
												<label className={`block ${themeClasses.text} mb-2`}>
													Task View
												</label>
												<div className="grid grid-cols-3 gap-2">
													<button
														onClick={() => setTaskView("list")}
														className={`py-2 px-3 rounded-md text-sm ${
															taskView === "list"
																? "bg-indigo-600 text-white"
																: darkMode
																? "bg-gray-700 text-gray-300"
																: "bg-gray-200 text-gray-700"
														}`}
													>
														List
													</button>
													<button
														onClick={() => {
															setTaskView("calendar");
															showToast(
																"Calendar view would be implemented here",
																"info"
															);
														}}
														className={`py-2 px-3 rounded-md text-sm ${
															taskView === "calendar"
																? "bg-indigo-600 text-white"
																: darkMode
																? "bg-gray-700 text-gray-300"
																: "bg-gray-200 text-gray-700"
														}`}
													>
														Calendar
													</button>
													<button
														onClick={() => {
															setTaskView("board");
															showToast(
																"Kanban board view would be implemented here",
																"info"
															);
														}}
														className={`py-2 px-3 rounded-md text-sm ${
															taskView === "board"
																? "bg-indigo-600 text-white"
																: darkMode
																? "bg-gray-700 text-gray-300"
																: "bg-gray-200 text-gray-700"
														}`}
													>
														Board
													</button>
												</div>
											</div>
										</div>
									</div>

									<div>
										<h3
											className={`text-lg font-medium ${themeClasses.text} mb-3`}
										>
											Data Management
										</h3>
										<div className="grid grid-cols-2 gap-3">
											<button
												onClick={exportTasks}
												className={`flex items-center justify-center space-x-2 py-2 px-4 ${
													darkMode
														? "bg-indigo-600 hover:bg-indigo-700"
														: "bg-[#1B5DA8] hover:bg-[#114277]"
												} text-white rounded-md cursor-pointer`}
											>
												<Download size={16} />
												<span>Export Tasks</span>
											</button>
											<button
												onClick={importTasks}
												className={`flex items-center justify-center space-x-2 py-2 px-4 ${themeClasses.secondaryBtn} rounded-md cursor-pointer`}
											>
												<Upload size={16} />
												<span>Import Tasks</span>
											</button>
										</div>
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showNotifications && (
						<motion.div
							className="fixed right-4 top-16 z-50 w-80 max-h-96 overflow-auto"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
						>
							<div className={`${themeClasses.cardBg} rounded-lg shadow-lg`}>
								<div className="p-3 border-b flex items-center justify-between">
									<h3 className={`font-medium ${themeClasses.heading}`}>
										Notifications
									</h3>
									<div className="flex space-x-2">
										<button
											onClick={markAllNotificationsAsRead}
											className="text-xs text-blue-500 hover:underline"
											disabled={!notifications.some((n) => !n.read)}
										>
											Mark all as read
										</button>
										<button
											onClick={() => setShowNotifications(false)}
											className={themeClasses.mutedText}
										>
											<X size={16} />
										</button>
									</div>
								</div>

								<div className="divide-y">
									{notifications.length === 0 ? (
										<div className="p-4 text-center">
											<p className={themeClasses.mutedText}>No notifications</p>
										</div>
									) : (
										notifications.map((notification) => (
											<div
												key={notification.id}
												className={`p-3 ${
													notification.read
														? themeClasses.mutedText
														: themeClasses.text
												} ${
													!notification.read
														? darkMode
															? "bg-gray-700"
															: "bg-blue-50"
														: ""
												}`}
											>
												<div className="flex justify-between">
													<p className="text-sm">{notification.message}</p>
													{!notification.read && (
														<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
													)}
												</div>
											</div>
										))
									)}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.header
					className="text-center mb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						className="inline-block mb-4"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<div
							className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
								darkMode ? "bg-indigo-600" : `bg-[${accentColor}]`
							}`}
						>
							<ListTodo size={32} className="text-white" />
						</div>
					</motion.div>
					<motion.h1
						className={`text-4xl font-bold text-white mb-3 heading font-sans tracking-tight`}
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20,
							delay: 0.2,
						}}
					>
						Task
						<span
							className={darkMode ? "text-[#78CFFF]" : `text-[${accentColor}]`}
						>
							Master
						</span>
					</motion.h1>
					<motion.p
						className="text-white text-opacity-90 text-lg"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						Your personal productivity dashboard
					</motion.p>
				</motion.header>

				<div className="fixed top-4 right-4 z-50 space-y-2">
					<AnimatePresence>
						{toasts.map((toast) => (
							<motion.div
								key={toast.id}
								className={`rounded-md p-3 shadow-lg min-w-64 flex items-center justify-between ${
									toast.type === "success"
										? "bg-green-600"
										: toast.type === "error"
										? "bg-red-600"
										: "bg-blue-600"
								} text-white`}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.3 }}
							>
								<div className="flex items-center">
									{toast.type === "success" && (
										<Check size={18} className="mr-2" />
									)}
									{toast.type === "error" && (
										<AlertTriangle size={18} className="mr-2" />
									)}
									{toast.type === "info" && <Info size={18} className="mr-2" />}
									<p>{toast.message}</p>
								</div>
								<button
									onClick={() =>
										setToasts(toasts.filter((t) => t.id !== toast.id))
									}
									className="ml-2 text-white hover:text-gray-200 cursor-pointer"
								>
									<X size={18} />
								</button>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				<AnimatePresence>
					{storageError && (
						<motion.div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative"
							role="alert"
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 10 }}
							transition={{ duration: 0.3 }}
						>
							<strong className="font-bold">Error: </strong>
							<span className="block sm:inline">{storageError}</span>
							<button
								className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
								onClick={() => setStorageError(null)}
								aria-label="Close error message"
							>
								<span className="sr-only">Close</span>
								&times;
							</button>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{dateError && (
						<motion.div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4"
							role="alert"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
						>
							<span className="font-bold">Date Error: </span>
							{dateError}
							<button
								className="ml-2 text-red-700 font-bold cursor-pointer"
								onClick={() => setDateError(null)}
								aria-label="Close date error"
							>
								×
							</button>
						</motion.div>
					)}
				</AnimatePresence>

				{showStatsView && (
					<motion.div
						className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<motion.div
							className={`${themeClasses.statCardBg} rounded-lg shadow-md p-5 border-l-4 border-blue-500`}
							whileHover={{
								y: -5,
								boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
							}}
						>
							<div className="flex justify-between items-center">
								<div>
									<p
										className={`${themeClasses.mutedText} text-sm uppercase font-semibold`}
									>
										Total Tasks
									</p>
									<h3
										className={`${themeClasses.heading} text-3xl font-bold mt-1`}
									>
										{taskStats.total}
									</h3>
								</div>
								<div
									className={`${
										darkMode ? "bg-blue-900/30" : "bg-blue-100"
									} p-2 rounded-lg`}
								>
									<ListTodo
										size={28}
										className={darkMode ? "text-blue-400" : "text-blue-500"}
									/>
								</div>
							</div>
							<div className="mt-4 flex items-center space-x-2">
								<div
									className={`w-full ${
										darkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-full h-2.5 overflow-hidden`}
									aria-label="Task completion progress"
								>
									<div
										className="bg-blue-500 h-2.5 rounded-full"
										style={{ width: `${taskStats.completionRate}%` }}
									></div>
								</div>
								<span className={`text-sm ${themeClasses.mutedText}`}>
									{taskStats.completionRate}%
								</span>
							</div>
						</motion.div>

						<motion.div
							className={`${themeClasses.statCardBg} rounded-lg shadow-md p-5 border-l-4 border-green-500`}
							whileHover={{
								y: -5,
								boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
							}}
						>
							<div className="flex justify-between items-center">
								<div>
									<p
										className={`${themeClasses.mutedText} text-sm uppercase font-semibold`}
									>
										Completed
									</p>
									<h3
										className={`${themeClasses.heading} text-3xl font-bold mt-1`}
									>
										{taskStats.completed}
									</h3>
								</div>
								<div
									className={`${
										darkMode ? "bg-green-900/30" : "bg-green-100"
									} p-2 rounded-lg`}
								>
									<CheckCircle
										size={28}
										className={darkMode ? "text-green-400" : "text-green-500"}
									/>
								</div>
							</div>
							<p className={`mt-4 text-sm ${themeClasses.mutedText}`}>
								{taskStats.active > 0
									? `${taskStats.completed} of ${taskStats.total} tasks completed`
									: "All tasks completed!"}
							</p>
						</motion.div>

						<motion.div
							className={`${themeClasses.statCardBg} rounded-lg shadow-md p-5 border-l-4 border-amber-500`}
							whileHover={{
								y: -5,
								boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
							}}
						>
							<div className="flex justify-between items-center">
								<div>
									<p
										className={`${themeClasses.mutedText} text-sm uppercase font-semibold`}
									>
										Due Today
									</p>
									<h3
										className={`${themeClasses.heading} text-3xl font-bold mt-1`}
									>
										{taskStats.dueToday}
									</h3>
								</div>
								<div
									className={`${
										darkMode ? "bg-amber-900/30" : "bg-amber-100"
									} p-2 rounded-lg`}
								>
									<Clock3
										size={28}
										className={darkMode ? "text-amber-400" : "text-amber-500"}
									/>
								</div>
							</div>
							<p className={`mt-4 text-sm ${themeClasses.mutedText}`}>
								{taskStats.dueSoon > 0
									? `+${taskStats.dueSoon} tasks due soon`
									: "No upcoming tasks"}
							</p>
						</motion.div>

						<motion.div
							className={`${themeClasses.statCardBg} rounded-lg shadow-md p-5 border-l-4 border-red-500`}
							whileHover={{
								y: -5,
								boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
							}}
						>
							<div className="flex justify-between items-center">
								<div>
									<p
										className={`${themeClasses.mutedText} text-sm uppercase font-semibold`}
									>
										Overdue
									</p>
									<h3
										className={`${themeClasses.heading} text-3xl font-bold mt-1`}
									>
										{taskStats.overdue}
									</h3>
								</div>
								<div
									className={`${
										darkMode ? "bg-red-900/30" : "bg-red-100"
									} p-2 rounded-lg`}
								>
									<AlertCircle
										size={28}
										className={darkMode ? "text-red-400" : "text-red-500"}
									/>
								</div>
							</div>
							<p className={`mt-4 text-sm ${themeClasses.mutedText}`}>
								{taskStats.overdue > 0
									? "Needs immediate attention"
									: "No overdue tasks!"}
							</p>
						</motion.div>
					</motion.div>
				)}

				{showStatsView && (
					<motion.div
						className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<motion.div
							className={`${themeClasses.cardBg} rounded-lg shadow-md p-5`}
							whileHover={{
								y: -5,
								boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
							}}
						>
							<h3
								className={`${themeClasses.heading} text-lg font-semibold mb-4 flex items-center`}
							>
								<Tag size={18} className="mr-2" />
								Task Categories
							</h3>
							<div className="space-y-3">
								{Object.entries(taskStats.categoryCount).map(
									([category, count]) => (
										<div key={category} className="flex items-center">
											<div
												className="w-4 h-4 rounded-full mr-3"
												style={{
													backgroundColor: getCategoryColor(
														category !== "Uncategorized" ? category : undefined
													),
												}}
											></div>
											<div className="flex-grow">
												<div className="flex justify-between mb-1">
													<span
														className={`text-sm font-medium ${themeClasses.text}`}
													>
														{category}
													</span>
													<span className={`text-sm ${themeClasses.mutedText}`}>
														{count}
													</span>
												</div>
												<div
													className={`w-full ${
														darkMode ? "bg-gray-700" : "bg-gray-200"
													} rounded-full h-1.5`}
												>
													<div
														className="h-1.5 rounded-full"
														style={{
															width: `${(count / taskStats.total) * 100}%`,
															backgroundColor: getCategoryColor(
																category !== "Uncategorized"
																	? category
																	: undefined
															),
														}}
													></div>
												</div>
											</div>
										</div>
									)
								)}
							</div>
						</motion.div>

						<motion.div
							className={`${themeClasses.cardBg} rounded-lg shadow-md p-5`}
							whileHover={{
								y: -5,
								boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
							}}
						>
							<h3
								className={`${themeClasses.heading} text-lg font-semibold mb-4 flex items-center`}
							>
								<Flag size={18} className="mr-2" />
								Task Priorities
							</h3>
							<div className="space-y-3">
								{Object.entries(taskStats.priorityCount)
									.filter(
										([priority]) =>
											priority !== "none" || taskStats.priorityCount.none > 0
									)
									.map(([priority, count]) => {
										const label =
											priority === "none"
												? "No Priority"
												: priority.charAt(0).toUpperCase() + priority.slice(1);
										const color =
											priority === "none"
												? "#71717A"
												: priority === "high"
												? "#EF4444"
												: priority === "medium"
												? "#F59E0B"
												: "#10B981";

										return (
											<div key={priority} className="flex items-center">
												<div
													className="w-4 h-4 rounded-full mr-3"
													style={{ backgroundColor: color }}
												></div>
												<div className="flex-grow">
													<div className="flex justify-between mb-1">
														<span
															className={`text-sm font-medium ${themeClasses.text}`}
														>
															{label}
														</span>
														<span
															className={`text-sm ${themeClasses.mutedText}`}
														>
															{count}
														</span>
													</div>
													<div
														className={`w-full ${
															darkMode ? "bg-gray-700" : "bg-gray-200"
														} rounded-full h-1.5`}
													>
														<div
															className="h-1.5 rounded-full"
															style={{
																width: `${(count / taskStats.total) * 100}%`,
																backgroundColor: color,
															}}
														></div>
													</div>
												</div>
											</div>
										);
									})}
							</div>
						</motion.div>
					</motion.div>
				)}

				<motion.div
					className="mb-8 flex flex-col md:flex-row gap-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<div
						className={`flex-grow ${themeClasses.cardBg} rounded-lg shadow-md p-4 overflow-hidden`}
					>
						<div className="relative">
							<Search
								className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.mutedText}`}
								size={18}
								aria-hidden="true"
							/>
							<input
								type="text"
								placeholder="Search tasks..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className={`w-full pl-10 pr-4 py-3 rounded-md shadow-sm ${
									darkMode
										? "bg-gray-700 border-gray-600"
										: "bg-white border-gray-300"
								} focus:ring-indigo-500 focus:border-indigo-500 ${
									themeClasses.text
								}`}
								aria-label="Search tasks"
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery("")}
									className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.mutedText} hover:text-gray-700 cursor-pointer`}
									aria-label="Clear search"
								>
									<X size={18} />
								</button>
							)}
						</div>
					</div>

					<motion.button
						onClick={() => {
							setEditingTask(null);
							setTitle("");
							setDueDate("");
							setCategory("");
							setPriority("");
							setNotes("");
							setShowForm(true);
						}}
						className={`flex items-center justify-center space-x-2 px-6 py-3 ${
							darkMode
								? "bg-indigo-600 hover:bg-indigo-700"
								: `bg-[${accentColor}] hover:bg-[${accentColor.replace(
										"#",
										""
								  )}dd]`
						} text-white rounded-lg shadow-md cursor-pointer`}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						aria-label="Add new task"
					>
						<Plus size={20} />
						<span className="font-medium">Add Task</span>
					</motion.button>

					<motion.button
						onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
						className={`flex items-center justify-center space-x-2 px-6 py-3 text-white ${
							showAdvancedFilters
								? darkMode
									? "bg-indigo-700"
									: "bg-[#0f3c65]"
								: themeClasses.secondaryBtn
						} ${
							showAdvancedFilters ? "text-white" : ""
						} rounded-lg shadow-md cursor-pointer`}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						aria-label="Toggle advanced filters"
					>
						<Filter size={20} />
						<span className="font-medium">Filters</span>
					</motion.button>
				</motion.div>

				<AnimatePresence>
					{showAdvancedFilters && (
						<motion.div
							className={`mb-8 ${themeClasses.cardBg} rounded-lg shadow-md p-6`}
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
						>
							<h3
								className={`${themeClasses.heading} text-lg font-semibold mb-4 flex items-center`}
							>
								<SlidersHorizontal size={18} className="mr-2" />
								Advanced Filters
							</h3>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div>
									<label
										className={`block text-sm font-medium ${themeClasses.text} mb-1`}
									>
										Filter by Category
									</label>
									<select
										value={categoryFilter}
										onChange={(e) => setCategoryFilter(e.target.value)}
										className={`w-full p-2 rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600"
												: "bg-white border-gray-300"
										} cursor-pointer ${themeClasses.text}`}
									>
										<option value="">All Categories</option>
										{CATEGORIES.map((cat) => (
											<option key={cat.name} value={cat.name}>
												{cat.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label
										className={`block text-sm font-medium ${themeClasses.text} mb-1`}
									>
										Filter by Priority
									</label>
									<select
										value={priorityFilter}
										onChange={(e) => setPriorityFilter(e.target.value as any)}
										className={`w-full p-2 rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600"
												: "bg-white border-gray-300"
										} cursor-pointer ${themeClasses.text}`}
									>
										<option value="">All Priorities</option>
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
									</select>
								</div>

								<div>
									<label
										className={`block text-sm font-medium ${themeClasses.text} mb-1`}
									>
										Sort By
									</label>
									<div className="flex space-x-2">
										<select
											value={sortOption}
											onChange={(e) => setSortOption(e.target.value as any)}
											className={`flex-grow p-2 rounded-md ${
												darkMode
													? "bg-gray-700 border-gray-600"
													: "bg-white border-gray-300"
											} cursor-pointer ${themeClasses.text}`}
										>
											<option value="">Default</option>
											<option value="dueDate">Due Date</option>
											<option value="priority">Priority</option>
											<option value="alphabetical">Alphabetical</option>
										</select>
										{sortOption && (
											<motion.button
												onClick={() =>
													setSortDirection(
														sortDirection === "asc" ? "desc" : "asc"
													)
												}
												className={`p-2 rounded-md ${themeClasses.secondaryBtn} cursor-pointer`}
												whileTap={{ scale: 0.95 }}
												aria-label={
													sortDirection === "asc"
														? "Sort descending"
														: "Sort ascending"
												}
											>
												{sortDirection === "asc" ? (
													<ArrowUp size={18} />
												) : (
													<ArrowDown size={18} />
												)}
											</motion.button>
										)}
									</div>
								</div>
							</div>

							{(categoryFilter || priorityFilter || sortOption) && (
								<button
									onClick={() => {
										setCategoryFilter("");
										setPriorityFilter("");
										setSortOption("");
										setSortDirection("asc");
									}}
									className={`mt-4 text-sm inline-flex items-center ${themeClasses.mutedText} hover:underline cursor-pointer`}
								>
									<X size={14} className="mr-1" />
									Reset all filters
								</button>
							)}
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showForm && (
						<motion.div
							className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								className={`${themeClasses.cardBg} rounded-lg shadow-lg overflow-hidden max-w-2xl w-full`}
								variants={scaleInOut}
								initial="initial"
								animate="animate"
								exit="exit"
							>
								<div
									className={`flex justify-between items-center p-6 border-b ${
										darkMode ? "border-gray-700" : "border-gray-200"
									}`}
								>
									<h2
										className={`text-xl font-semibold ${themeClasses.heading} font-sans tracking-tight`}
									>
										{editingTask ? "Edit Task" : "Add New Task"}
									</h2>
									<motion.button
										onClick={() => {
											setShowForm(false);
											if (editingTask) cancelEditing();
										}}
										className={`${themeClasses.mutedText} hover:${themeClasses.text} cursor-pointer`}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
									>
										<X size={20} />
									</motion.button>
								</div>

								<div className="p-6 space-y-4">
									<div>
										<label
											htmlFor="title"
											className={`block text-sm font-medium ${themeClasses.text} mb-2`}
										>
											Task Title
										</label>
										<input
											type="text"
											id="title"
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											className={`w-full px-4 py-3 rounded-md shadow-sm ${
												darkMode
													? "bg-gray-700 border-gray-600"
													: "bg-white border-gray-300"
											} focus:ring-indigo-500 focus:border-indigo-500 ${
												themeClasses.text
											}`}
											placeholder="Enter task title"
											required
											aria-required="true"
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="dueDate"
												className={`block text-sm font-medium ${themeClasses.text} mb-2`}
											>
												Due Date
											</label>
											<div className="relative">
												<Calendar
													className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.mutedText}`}
													size={18}
													aria-hidden="true"
												/>
												<input
													type="date"
													id="dueDate"
													value={dueDate}
													onChange={(e) => setDueDate(e.target.value)}
													className={`w-full pl-10 pr-4 py-3 rounded-md shadow-sm ${
														darkMode
															? "bg-gray-700 border-gray-600"
															: "bg-white border-gray-300"
													} focus:ring-indigo-500 focus:border-indigo-500 ${
														themeClasses.text
													}`}
													style={{ colorScheme: darkMode ? "dark" : "light" }}
													aria-label="Task due date"
												/>
											</div>
										</div>

										<div>
											<label
												htmlFor="category"
												className={`block text-sm font-medium ${themeClasses.text} mb-2`}
											>
												Category
											</label>
											<div className="relative">
												<Tag
													className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.mutedText}`}
													size={18}
													aria-hidden="true"
												/>
												<select
													id="category"
													value={category}
													onChange={(e) => setCategory(e.target.value)}
													className={`w-full pl-10 pr-4 py-3 rounded-md shadow-sm ${
														darkMode
															? "bg-gray-700 border-gray-600"
															: "bg-white border-gray-300"
													} focus:ring-indigo-500 focus:border-indigo-500 ${
														themeClasses.text
													} cursor-pointer`}
													aria-label="Task category"
												>
													<option value="">Select Category</option>
													{CATEGORIES.map((cat) => (
														<option key={cat.name} value={cat.name}>
															{cat.name}
														</option>
													))}
												</select>
											</div>
										</div>
									</div>

									<div>
										<label
											htmlFor="priority"
											className={`block text-sm font-medium ${themeClasses.text} mb-2`}
										>
											Priority
										</label>
										<div className="flex space-x-4">
											{["low", "medium", "high"].map((level) => (
												<motion.button
													type="button"
													key={level}
													onClick={() => setPriority(level as any)}
													className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-2 cursor-pointer border ${
														priority === level
															? `border-${
																	level === "low"
																		? "green"
																		: level === "medium"
																		? "yellow"
																		: "red"
															  }-500 ${
																	darkMode
																		? `bg-${
																				level === "low"
																					? "green"
																					: level === "medium"
																					? "yellow"
																					: "red"
																		  }-900/20`
																		: `bg-${
																				level === "low"
																					? "green"
																					: level === "medium"
																					? "yellow"
																					: "red"
																		  }-100`
															  }`
															: darkMode
															? "border-gray-700"
															: "border-gray-300"
													}`}
													aria-pressed={priority === level}
													whileHover={{ scale: 1.03 }}
													whileTap={{ scale: 0.97 }}
												>
													<Flag
														size={16}
														color={
															PRIORITIES[level as keyof typeof PRIORITIES].color
														}
													/>
													<span
														className={`text-sm font-medium ${
															priority === level
																? `text-${
																		level === "low"
																			? "green"
																			: level === "medium"
																			? "yellow"
																			: "red"
																  }-${darkMode ? "400" : "700"}`
																: themeClasses.mutedText
														}`}
													>
														{level.charAt(0).toUpperCase() + level.slice(1)}
													</span>
												</motion.button>
											))}
										</div>
									</div>

									<div>
										<label
											htmlFor="notes"
											className={`block text-sm font-medium ${themeClasses.text} mb-2`}
										>
											Notes (Optional)
										</label>
										<textarea
											id="notes"
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
											className={`w-full px-4 py-3 rounded-md shadow-sm ${
												darkMode
													? "bg-gray-700 border-gray-600"
													: "bg-white border-gray-300"
											} focus:ring-indigo-500 focus:border-indigo-500 ${
												themeClasses.text
											}`}
											placeholder="Add details about this task..."
											rows={3}
										/>
									</div>

									<div className="flex space-x-3 pt-4">
										<motion.button
											onClick={handleAddTaskSubmit}
											className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 ${
												darkMode
													? "bg-indigo-600 hover:bg-indigo-700"
													: `bg-[${accentColor}] hover:bg-[${accentColor.replace(
															"#",
															""
													  )}dd]`
											} text-white rounded-md shadow-md cursor-pointer`}
											aria-label={editingTask ? "Update task" : "Add new task"}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											{editingTask ? (
												<>
													<Save size={20} aria-hidden="true" />
													<span>Update Task</span>
												</>
											) : (
												<>
													<Plus size={20} aria-hidden="true" />
													<span>Add Task</span>
												</>
											)}
										</motion.button>

										<motion.button
											onClick={() => {
												setShowForm(false);
												if (editingTask) cancelEditing();
											}}
											className={`flex items-center justify-center space-x-2 py-3 px-4 ${
												themeClasses.secondaryBtn
											} ${
												darkMode ? "text-gray-200" : "text-gray-700"
											} rounded-md shadow-md cursor-pointer`}
											aria-label="Cancel"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<X size={20} aria-hidden="true" />
											<span>Cancel</span>
										</motion.button>
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.div
					className="flex justify-center mb-6 space-x-3"
					role="tablist"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
				>
					<motion.button
						onClick={() => setFilter("all")}
						className={`px-5 py-3 rounded-md flex items-center space-x-2 shadow-md font-semibold text-base cursor-pointer ${
							filter === "all"
								? `${
										darkMode
											? "bg-indigo-600 text-white"
											: "bg-white text-[#1B5DA8]"
								  }`
								: `${darkMode ? "bg-gray-800" : "bg-[#114277]"} text-white`
						}`}
						aria-selected={filter === "all"}
						role="tab"
						aria-controls="all-tasks-panel"
						whileHover={{ y: -3, boxShadow: "0 5px 10px rgba(0,0,0,0.2)" }}
						whileTap={{ y: 0, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
					>
						<ListTodo size={18} aria-hidden="true" />
						<span>All</span>
					</motion.button>
					<motion.button
						onClick={() => setFilter("active")}
						className={`px-5 py-3 rounded-md flex items-center space-x-2 shadow-md font-semibold text-base cursor-pointer ${
							filter === "active"
								? `${
										darkMode
											? "bg-indigo-600 text-white"
											: "bg-white text-[#1B5DA8]"
								  }`
								: `${darkMode ? "bg-gray-800" : "bg-[#114277]"} text-white`
						}`}
						aria-selected={filter === "active"}
						role="tab"
						aria-controls="active-tasks-panel"
						whileHover={{ y: -3, boxShadow: "0 5px 10px rgba(0,0,0,0.2)" }}
						whileTap={{ y: 0, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
					>
						<Clock size={18} aria-hidden="true" />
						<span>Active</span>
					</motion.button>
					<motion.button
						onClick={() => setFilter("completed")}
						className={`px-5 py-3 rounded-md flex items-center space-x-2 shadow-md font-semibold text-base cursor-pointer ${
							filter === "completed"
								? `${
										darkMode
											? "bg-indigo-600 text-white"
											: "bg-white text-[#1B5DA8]"
								  }`
								: `${darkMode ? "bg-gray-800" : "bg-[#114277]"} text-white`
						}`}
						aria-selected={filter === "completed"}
						role="tab"
						aria-controls="completed-tasks-panel"
						whileHover={{ y: -3, boxShadow: "0 5px 10px rgba(0,0,0,0.2)" }}
						whileTap={{ y: 0, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
					>
						<CheckSquare size={18} aria-hidden="true" />
						<span>Completed</span>
					</motion.button>
				</motion.div>

				<AnimatePresence>
					{deleteConfirmation && (
						<motion.div
							className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								className={`${themeClasses.cardBg} rounded-lg p-6 max-w-sm w-full`}
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
							>
								<h3
									className={`text-lg font-semibold ${themeClasses.heading} mb-3`}
								>
									Confirm Deletion
								</h3>
								<p className={`${themeClasses.text} mb-6`}>
									Are you sure you want to delete this task? This action cannot
									be undone.
								</p>
								<div className="flex space-x-3">
									<motion.button
										onClick={() => deleteTask(deleteConfirmation)}
										className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Delete
									</motion.button>
									<motion.button
										onClick={() => setDeleteConfirmation(null)}
										className={`flex-1 py-2 ${themeClasses.secondaryBtn} rounded-md cursor-pointer`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Cancel
									</motion.button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.div
					className={`${themeClasses.cardBg} rounded-lg shadow-lg overflow-hidden p-6 sm:p-8`}
					role="tabpanel"
					id={`${filter}-tasks-panel`}
					aria-labelledby={`${filter}-tab`}
					variants={fadeInUp}
					initial="initial"
					animate="animate"
					transition={{ duration: 0.5 }}
				>
					<motion.div
						className="flex justify-between items-center mb-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
					>
						<div className="flex items-center">
							<h2
								className={`text-xl font-semibold ${themeClasses.heading} font-sans tracking-tight mr-3`}
							>
								{filter === "all"
									? "All Tasks"
									: filter === "active"
									? "Active Tasks"
									: "Completed Tasks"}
							</h2>
							<motion.span
								className={`${
									darkMode
										? "bg-indigo-900/30 text-indigo-300"
										: "bg-[#1B5DA815] text-[#1B5DA8]"
								} px-2 py-1 rounded-full text-sm`}
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 15,
									delay: 0.6,
								}}
							>
								{filteredTasks.length}
							</motion.span>
						</div>

						{filter === "completed" && tasks.some((task) => task.completed) && (
							<motion.button
								onClick={() => {
									setTasks(tasks.filter((task) => !task.completed));
									showToast("Completed tasks cleared!", "info");
								}}
								className={`text-sm ${themeClasses.mutedText} hover:text-red-500 flex items-center cursor-pointer`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Trash2 size={16} className="mr-1" />
								Clear completed
							</motion.button>
						)}
					</motion.div>

					{filteredTasks.length === 0 ? (
						<motion.div
							className="text-center py-10"
							aria-live="polite"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
						>
							<motion.div
								className={`${themeClasses.mutedText} mb-4`}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.7 }}
							>
								<svg
									className="mx-auto h-16 w-16"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.5"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							</motion.div>
							<motion.p
								className={`${themeClasses.mutedText} text-lg mb-6`}
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.8 }}
							>
								{searchQuery
									? "No tasks match your search."
									: filter === "active"
									? "No active tasks found."
									: filter === "completed"
									? "No completed tasks yet."
									: "No tasks found. Add a new task to get started!"}
							</motion.p>

							{searchQuery && (
								<motion.button
									onClick={() => setSearchQuery("")}
									className={`px-4 py-2 ${
										darkMode
											? "bg-indigo-600 hover:bg-indigo-700"
											: "bg-[#1B5DA8] hover:bg-[#114277]"
									} text-white rounded-md shadow-md cursor-pointer`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Clear Search
								</motion.button>
							)}
						</motion.div>
					) : (
						<motion.ul
							className="space-y-4"
							aria-label={`${filter} tasks list`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							<AnimatePresence>
								{filteredTasks.map((task, index) => (
									<motion.li
										key={task.id}
										ref={task.isNew ? newTaskRef : null}
										className={`rounded-lg shadow-sm hover:shadow-md ${getTaskCardClasses(
											task
										)}`}
										variants={listItemVariants}
										initial="hidden"
										animate="visible"
										exit={{ opacity: 0, x: -100 }}
										custom={index}
										layout
										whileHover={{
											scale: 1.01,
											boxShadow: "0 5px 10px rgba(0,0,0,0.08)",
										}}
									>
										<div className="p-5">
											<div className="flex items-start justify-between">
												<div className="flex items-start space-x-4 flex-grow">
													<div className="flex-shrink-0 pt-1">
														<motion.button
															onClick={() => toggleTaskCompletion(task.id)}
															className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${
																task.completed
																	? "bg-green-600 border-green-600"
																	: `${
																			darkMode
																				? "border-gray-600 bg-gray-700 hover:bg-gray-600"
																				: "border-gray-300 bg-white hover:bg-gray-100"
																	  }`
															}`}
															aria-label={
																task.completed
																	? "Mark as incomplete"
																	: "Mark as complete"
															}
															aria-pressed={task.completed}
															whileHover={{ scale: 1.1 }}
															whileTap={{ scale: 0.9 }}
															transition={{
																type: "spring",
																stiffness: 400,
																damping: 17,
															}}
														>
															{task.completed && (
																<motion.svg
																	className="w-4 h-4 text-white"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																	aria-hidden="true"
																	initial={{ pathLength: 0 }}
																	animate={{ pathLength: 1 }}
																	transition={{ duration: 0.3 }}
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M5 13l4 4L19 7"
																	/>
																</motion.svg>
															)}
														</motion.button>
													</div>
													<div className="flex-grow">
														<div className="flex flex-wrap items-center gap-2 mb-1">
															{task.category && (
																<span
																	className="text-xs font-medium px-2 py-1 rounded-full"
																	style={{
																		backgroundColor: darkMode
																			? `${getCategoryColor(task.category)}30`
																			: `${getCategoryColor(task.category)}20`,
																		color: getCategoryColor(task.category),
																	}}
																>
																	{task.category}
																</span>
															)}

															{task.priority && (
																<span
																	className="text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1"
																	style={{
																		backgroundColor: darkMode
																			? `${
																					getPriorityInfo(task.priority).color
																			  }30`
																			: `${
																					getPriorityInfo(task.priority).color
																			  }20`,
																		color: getPriorityInfo(task.priority).color,
																	}}
																>
																	{getPriorityInfo(task.priority).icon}
																	<span>
																		{getPriorityInfo(task.priority).text}
																	</span>
																</span>
															)}
														</div>

														<p
															className={`${
																themeClasses.text
															} font-medium text-lg mb-1 ${
																task.completed && "line-through opacity-60"
															}`}
														>
															{task.title}
														</p>

														{task.notes && (
															<p
																className={`${
																	themeClasses.mutedText
																} text-sm mt-1 mb-2 ${
																	task.completed && "line-through opacity-60"
																}`}
															>
																{task.notes}
															</p>
														)}

														{task.dueDate && (
															<div className="flex items-center mt-2">
																<Calendar
																	size={14}
																	aria-hidden="true"
																	className={`mr-2 ${
																		task.completed
																			? themeClasses.mutedText
																			: isTaskOverdue(task.dueDate)
																			? "text-red-600"
																			: themeClasses.mutedText
																	}`}
																/>
																<p
																	className={`text-sm ${
																		task.completed
																			? themeClasses.mutedText
																			: isTaskOverdue(task.dueDate)
																			? "text-red-600 font-medium"
																			: themeClasses.mutedText
																	}`}
																>
																	{formatDate(task.dueDate)}
																	{isTaskOverdue(task.dueDate) &&
																		!task.completed && (
																			<span
																				className={`ml-2 text-xs ${
																					darkMode
																						? "bg-red-900/30"
																						: "bg-red-100"
																				} text-red-600 px-2 py-0.5 rounded-full`}
																			>
																				Overdue
																			</span>
																		)}
																</p>
															</div>
														)}
													</div>
												</div>
												<div className="flex space-x-2">
													<motion.button
														onClick={() => startEditingTask(task.id)}
														className={`text-white bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer`}
														aria-label={`Edit task: ${task.title}`}
														whileHover={{
															scale: 1.1,
															backgroundColor: "#4F46E5",
														}}
														whileTap={{ scale: 0.9 }}
													>
														<Edit size={18} aria-hidden="true" />
													</motion.button>
													<motion.button
														onClick={() => confirmDelete(task.id)}
														className={`text-white bg-red-600 hover:bg-red-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer`}
														aria-label={`Delete task: ${task.title}`}
														whileHover={{
															scale: 1.1,
															backgroundColor: "#DC2626",
														}}
														whileTap={{ scale: 0.9 }}
													>
														<Trash2 size={18} aria-hidden="true" />
													</motion.button>
												</div>
											</div>
										</div>
									</motion.li>
								))}
							</AnimatePresence>
						</motion.ul>
					)}
				</motion.div>

				<AnimatePresence>
					{isMobile && !showForm && (
						<motion.button
							onClick={() => {
								setEditingTask(null);
								setTitle("");
								setDueDate("");
								setCategory("");
								setPriority("");
								setNotes("");
								setShowForm(true);
							}}
							className={`fixed bottom-6 right-6 w-16 h-16 rounded-full ${
								darkMode ? "bg-indigo-600" : `bg-[${accentColor}]`
							} text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 ring-offset-2 ring-[#1B5DA8] cursor-pointer z-30`}
							aria-label="Add new task"
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0, opacity: 0 }}
							whileHover={{
								scale: 1.1,
								boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
							}}
							whileTap={{ scale: 0.9 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							<Plus size={32} aria-hidden="true" />
						</motion.button>
					)}
				</AnimatePresence>

				<motion.footer
					className="mt-12 text-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
				>
					<div className="h-px bg-white/20 w-32 mx-auto mb-6"></div>
					<p className="text-white text-opacity-80 text-sm mb-2">
						&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
					</p>
					<div className="flex justify-center space-x-4 mb-8">
						{["About", "Privacy", "Terms", "Help"].map((link) => (
							<button
								key={link}
								className="text-white/70 text-xs hover:text-white cursor-pointer"
								onClick={() =>
									showToast(`${link} page would open here`, "info")
								}
							>
								{link}
							</button>
						))}
					</div>
				</motion.footer>
			</div>

			<style jsx global>{`
				body {
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
						"Helvetica Neue", Arial, sans-serif;
					transition: background-color 0.3s, color 0.3s;
				}
				.heading {
					font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont,
						"Segoe UI", Roboto, sans-serif;
				}
				.cursor-pointer {
					cursor: pointer;
				}

				::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}
				::-webkit-scrollbar-track {
					background: rgba(0, 0, 0, 0.05);
					border-radius: 10px;
				}
				::-webkit-scrollbar-thumb {
					background: rgba(0, 0, 0, 0.2);
					border-radius: 10px;
				}
			`}</style>
		</div>
	);
};

export default TaskDashboard;
