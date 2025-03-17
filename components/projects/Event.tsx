'use client'
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";

// TypeScript Interfaces
interface Task {
	id: string;
	title: string;
	description: string;
	date: string;
	time: string;
	priority: "low" | "medium" | "high";
	tag: "work" | "personal" | "event" | "project" | "family";
	completed: boolean;
	createdAt: string;
}

interface User {
	name: string;
	email: string;
	avatar: string;
}

// Main App Component
const TaskMaster: React.FC = () => {
	// State hooks
	const [currentPage, setCurrentPage] = useState<string>("auth");
	const [authPage, setAuthPage] = useState<string>("landing");
	const [tasks, setTasks] = useState<Task[]>([]);
	const [currentFilter, setCurrentFilter] = useState<string>("all");
	const [currentCategory, setCurrentCategory] = useState<string>("all");
	const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
	const [currentCalendarView, setCurrentCalendarView] =
		useState<string>("daily");
	const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(
		new Date()
	);
	const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
	const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
	const [user, setUser] = useState<User | null>(null);
	const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [toastMessage, setToastMessage] = useState<string>("");
	const [toastType, setToastType] = useState<string>("success");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [enableNotifications, setEnableNotifications] = useState<boolean>(true);
	const [viewMode, setViewMode] = useState<"list" | "grid">("list");

	// Form state
	const [taskForm, setTaskForm] = useState<{
		id: string;
		title: string;
		description: string;
		date: string;
		time: string;
		priority: string;
		tag: string;
		notification: boolean;
		notificationTime: string;
	}>({
		id: "",
		title: "",
		description: "",
		date: "",
		time: "09:00",
		priority: "medium",
		tag: "personal",
		notification: false,
		notificationTime: "0",
	});

	// Refs
	const toastTimeoutRef = useRef<number | null>(null);
	const dragTaskRef = useRef<string | null>(null);

	// Audio Effects
	// const audioEffects = {
	// 	complete: new Audio(
	// 		"https://assets.mixkit.co/active_storage/sfx/2865/2865-preview.mp3"
	// 	),
	// 	click: new Audio(
	// 		"https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3"
	// 	),
	// 	success: new Audio(
	// 		"https://assets.mixkit.co/active_storage/sfx/956/956-preview.mp3"
	// 	),
	// 	delete: new Audio(
	// 		"https://assets.mixkit.co/active_storage/sfx/703/703-preview.mp3"
	// 	),
	// };

	const toggleViewMode = () => {
		setViewMode(viewMode === "list" ? "grid" : "list");
	};

	// Load data on mount
	useEffect(() => {
		loadTasks();
		loadTheme();
		loadSoundSettings();
	}, []);

	// Update stats when tasks change
	useEffect(() => {
		updateProgress();
	}, [tasks]);

	// Toast animation control
	useEffect(() => {
		if (showToast && toastTimeoutRef.current === null) {
			toastTimeoutRef.current = window.setTimeout(() => {
				setShowToast(false);
				toastTimeoutRef.current = null;
			}, 3000);
		}

		return () => {
			if (toastTimeoutRef.current !== null) {
				clearTimeout(toastTimeoutRef.current);
				toastTimeoutRef.current = null;
			}
		};
	}, [showToast]);

	// Utility Functions
	const generateId = (): string => {
		return Date.now().toString() + Math.random().toString(36).substr(2, 9);
	};

	const formatDate = (date: Date): string => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const formatDateDisplay = (dateStr: string, includeYear = false): string => {
		if (!dateStr) return "";

		const date = new Date(dateStr);
		if (includeYear) {
			return date.toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			});
		}
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	const formatTimeDisplay = (timeStr: string): string => {
		if (!timeStr) return "";

		const [hours, minutes] = timeStr.split(":");
		const hour = parseInt(hours, 10);
		const period = hour >= 12 ? "PM" : "AM";
		const formattedHour = hour % 12 || 12;

		return `${formattedHour}:${minutes} ${period}`;
	};

	const isToday = (dateStr: string): boolean => {
		if (!dateStr) return false;

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const taskDate = new Date(dateStr);
		taskDate.setHours(0, 0, 0, 0);

		return today.getTime() === taskDate.getTime();
	};

	const isSameDay = (date1: Date, date2: Date): boolean => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	const isOverdueTask = (task: Task): boolean => {
		if (!task.date || task.completed) return false;

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const taskDate = new Date(task.date);
		taskDate.setHours(0, 0, 0, 0);

		return taskDate < today;
	};

	const capitalizeFirstLetter = (string: string): string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	const getTagClass = (tag: string): string => {
		switch (tag) {
			case "work":
				return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
			case "personal":
				return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
			case "event":
				return "bg-green-500/20 text-green-400 border border-green-500/30";
			case "project":
				return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
			case "family":
				return "bg-pink-500/20 text-pink-400 border border-pink-500/30";
			default:
				return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
		}
	};

	const getPriorityClass = (priority: string): string => {
		switch (priority) {
			case "high":
				return "bg-red-500/20 text-red-400 border border-red-500/30";
			case "medium":
				return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
			case "low":
				return "bg-green-500/20 text-green-400 border border-green-500/30";
			default:
				return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
		}
	};

	const getPriorityBorderClass = (priority: string): string => {
		switch (priority) {
			case "high":
				return "border-red-500";
			case "medium":
				return "border-yellow-500";
			case "low":
				return "border-green-500";
			default:
				return "border-slate-500";
		}
	};

	const getPriorityDotClass = (priority: string): string => {
		switch (priority) {
			case "high":
				return "bg-red-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-green-500";
			default:
				return "bg-slate-500";
		}
	};

	// Load tasks from localStorage
	const loadTasks = (): void => {
		const storedTasks = localStorage.getItem("tasks");
		const loadedTasks = storedTasks ? JSON.parse(storedTasks) : [];

		// Set default tasks if none exist
		if (loadedTasks.length === 0) {
			// Get today's date
			const today = new Date();

			// Create yesterday's date for overdue tasks
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);

			// Create tomorrow's date for upcoming tasks
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);

			const defaultTasks: Task[] = [
				{
					id: generateId(),
					title: "Welcome to AAA",
					description:
						"This is your new productivity app. Swipe tasks to edit or delete them.",
					date: formatDate(today),
					time: "09:00",
					priority: "low",
					tag: "event",
					completed: false,
					createdAt: new Date().toISOString(),
				},
				{
					id: generateId(),
					title: "Complete project proposal",
					description: "Finish the draft and send to the team for review.",
					date: formatDate(yesterday),
					time: "14:00",
					priority: "high",
					tag: "work",
					completed: false,
					createdAt: new Date(yesterday).toISOString(),
				},
				{
					id: generateId(),
					title: "Call dentist",
					description: "Schedule a check-up appointment.",
					date: formatDate(today),
					time: "11:30",
					priority: "high",
					tag: "personal",
					completed: true,
					createdAt: new Date(yesterday).toISOString(),
				},
				{
					id: generateId(),
					title: "Team meeting",
					description: "Weekly status update with the development team.",
					date: formatDate(tomorrow),
					time: "10:00",
					priority: "high",
					tag: "work",
					completed: false,
					createdAt: new Date(yesterday).toISOString(),
				},
				{
					id: generateId(),
					title: "Buy groceries",
					description: "Milk, eggs, bread, and fruits.",
					date: formatDate(today),
					time: "18:00",
					priority: "low",
					tag: "family",
					completed: false,
					createdAt: new Date(yesterday).toISOString(),
				},
			];

			setTasks(defaultTasks);
			saveTasks(defaultTasks);
		} else {
			setTasks(loadedTasks);
		}
	};

	// Save tasks to localStorage
	const saveTasks = (taskList: Task[]): void => {
		localStorage.setItem("tasks", JSON.stringify(taskList));
	};

	// Theme management
	const loadTheme = (): void => {
		const savedTheme = localStorage.getItem("theme") || "dark";
		setIsDarkMode(savedTheme === "dark");
		applyTheme(savedTheme === "dark");
	};

	const toggleTheme = (): void => {
		const newMode = !isDarkMode;
		setIsDarkMode(newMode);
		applyTheme(newMode);
		localStorage.setItem("theme", newMode ? "dark" : "light");
		displayToast(
			newMode ? "Dark mode enabled" : "Light mode enabled",
			"success"
		);
		playSound("click");
	};

	const applyTheme = (dark: boolean): void => {
		if (dark) {
			document.documentElement.classList.add("dark");
			document.body.classList.add("dark");
			document.body.style.background =
				"linear-gradient(to bottom right, #0f172a, #1e293b)";
			document.body.style.color = "white";
		} else {
			document.documentElement.classList.remove("dark");
			document.body.classList.remove("dark");
			document.body.style.background =
				"linear-gradient(to bottom right, #f8fafc, #e2e8f0)";
			document.body.style.color = "#334155";
		}
	};

	// Sound settings
	const loadSoundSettings = (): void => {
		const sound = localStorage.getItem("sound") === "enabled";
		setSoundEnabled(sound);
	};

	const toggleSound = (): void => {
		const newSoundEnabled = !soundEnabled;
		setSoundEnabled(newSoundEnabled);
		localStorage.setItem("sound", newSoundEnabled ? "enabled" : "disabled");

		displayToast(
			newSoundEnabled ? "Sound effects enabled" : "Sound effects disabled",
			"success"
		);

		if (newSoundEnabled) {
			playSound("click");
		}
	};

	const toggleNotifications = (): void => {
		const newValue = !enableNotifications;
		setEnableNotifications(newValue);
		localStorage.setItem("notifications", newValue ? "enabled" : "disabled");

		displayToast(
			newValue ? "Notifications enabled" : "Notifications disabled",
			"success"
		);

		playSound("click");
	};

	// Play sound effect
	const playSound = (sound: string): void => {
		if (!soundEnabled) return;

		const audio = audioEffects[sound as keyof typeof audioEffects];
		if (audio) {
			audio.currentTime = 0;
			audio.volume = 0.5;
			audio.play().catch((e) => console.log("Audio play error:", e));
		}
	};

	// Update progress and stats
	const updateProgress = (): void => {
		// This would update UI elements with progress information
		// In React we're using state, so this mainly updates derived values
	};

	// Task management
	const addTask = (): void => {
		const newTask: Task = {
			id: taskForm.id || generateId(),
			title: taskForm.title,
			description: taskForm.description,
			date: taskForm.date,
			time: taskForm.time,
			priority: taskForm.priority as "low" | "medium" | "high",
			tag: taskForm.tag as "work" | "personal" | "event" | "project" | "family",
			completed: false,
			createdAt: new Date().toISOString(),
		};

		const newTasks = [...tasks, newTask];
		setTasks(newTasks);
		saveTasks(newTasks);

		closeTaskModal();
		displayToast("Task created successfully", "success");
		playSound("success");
	};

	const updateTask = (): void => {
		const updatedTasks = tasks.map((task) =>
			task.id === taskForm.id
				? {
						...task,
						title: taskForm.title,
						description: taskForm.description,
						date: taskForm.date,
						time: taskForm.time,
						priority: taskForm.priority as "low" | "medium" | "high",
						tag: taskForm.tag as
							| "work"
							| "personal"
							| "event"
							| "project"
							| "family",
				  }
				: task
		);

		setTasks(updatedTasks);
		saveTasks(updatedTasks);

		closeTaskModal();
		displayToast("Task updated successfully", "success");
		playSound("success");
	};

	const deleteTask = (): void => {
		if (!activeTaskId) return;

		const updatedTasks = tasks.filter((task) => task.id !== activeTaskId);
		setTasks(updatedTasks);
		saveTasks(updatedTasks);

		setShowDeleteModal(false);
		setActiveTaskId(null);

		displayToast("Task deleted successfully", "success");
		playSound("delete");
	};

	const toggleTaskCompletion = (taskId: string): void => {
		const updatedTasks = tasks.map((task) =>
			task.id === taskId ? { ...task, completed: !task.completed } : task
		);

		setTasks(updatedTasks);
		saveTasks(updatedTasks);

		const task = updatedTasks.find((t) => t.id === taskId);
		if (task) {
			if (task.completed) {
				displayToast("Task completed! 🎉", "success");
				playSound("complete");
			} else {
				displayToast("Task marked as active", "info");
				playSound("click");
			}
		}
	};

	// Filter tasks
	const filterTasks = (taskList: Task[], filter: string): Task[] => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		switch (filter) {
			case "active":
				return taskList.filter((task) => !task.completed);
			case "completed":
				return taskList.filter((task) => task.completed);
			case "today":
				return taskList.filter((task) => {
					if (!task.date) return false;
					const taskDate = new Date(task.date);
					taskDate.setHours(0, 0, 0, 0);
					return taskDate.getTime() === today.getTime();
				});
			case "upcoming":
				return taskList.filter((task) => {
					if (!task.date) return false;
					const taskDate = new Date(task.date);
					taskDate.setHours(0, 0, 0, 0);
					return taskDate.getTime() >= tomorrow.getTime();
				});
			case "high":
				return taskList.filter((task) => task.priority === "high");
			default:
				return taskList;
		}
	};

	// Modal management
	const openCreateTaskModal = (): void => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		setTaskForm({
			id: "",
			title: "",
			description: "",
			date: formatDate(tomorrow),
			time: "09:00",
			priority: "medium",
			tag: "personal",
			notification: false,
			notificationTime: "0",
		});

		setShowTaskModal(true);
		playSound("click");
	};

	const openEditTaskModal = (taskId: string): void => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		setTaskForm({
			id: task.id,
			title: task.title,
			description: task.description,
			date: task.date,
			time: task.time,
			priority: task.priority,
			tag: task.tag,
			notification: false, // You could extend this with actual notification data
			notificationTime: "0",
		});

		setShowTaskModal(true);
		playSound("click");
	};

	const closeTaskModal = (): void => {
		setShowTaskModal(false);
	};

	const openDeleteModal = (taskId: string): void => {
		setActiveTaskId(taskId);
		setShowDeleteModal(true);
		playSound("click");
	};

	const closeDeleteModal = (): void => {
		setShowDeleteModal(false);
		setActiveTaskId(null);
	};

	const openTaskDetails = (taskId: string): void => {
		setActiveTaskId(taskId);
		setShowDetailsModal(true);
		playSound("click");
	};

	const closeTaskDetails = (): void => {
		setShowDetailsModal(false);
		setActiveTaskId(null);
	};

	// Toast notification
	const displayToast = (message: string, type: string = "success"): void => {
		setToastMessage(message);
		setToastType(type);
		setShowToast(true);
	};

	// Page navigation
	const changePage = (page: string): void => {
		setCurrentPage(page);
		playSound("click");
	};

	// Authentication
	const handleLogin = (e: React.FormEvent): void => {
		e.preventDefault();

		// Get form data
		const emailInput = document.getElementById(
			"login-email"
		) as HTMLInputElement;
		const email = emailInput?.value || "";
		const username = email.split("@")[0]; // Extract username from email

		// Set user info
		setUser({
			name: username,
			email: email,
			avatar: `https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
		});

		// Show app
		setCurrentPage("home");

		displayToast("Login successful! Welcome back.", "success");
		playSound("success");
	};

	const handleSignup = (e: React.FormEvent): void => {
		e.preventDefault();

		// Get form data
		const nameInput = document.getElementById(
			"signup-name"
		) as HTMLInputElement;
		const emailInput = document.getElementById(
			"signup-email"
		) as HTMLInputElement;
		const name = nameInput?.value || "";
		const email = emailInput?.value || "";

		// Set user info
		setUser({
			name: name,
			email: email,
			avatar: `https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
		});

		// Show app
		setCurrentPage("home");

		displayToast(
			"Account created successfully! Welcome to TaskMaster.",
			"success"
		);
		playSound("success");
	};

	const demoLogin = (): void => {
		setUser({
			name: "Demo User",
			email: "demo@example.com",
			avatar: `https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
		});

		setCurrentPage("home");

		displayToast("Welcome to TaskMaster! This is a demo account.", "success");
		playSound("success");
	};

	const logout = (): void => {
		{
			setUser(null);
			setCurrentPage("auth");
			setAuthPage("landing");
			playSound("click");
		}
	};

	// Calendar navigation
	const changeCalendarView = (view: string): void => {
		setCurrentCalendarView(view);
		playSound("click");
	};

	const navigateCalendarPrev = (): void => {
		const newDate = new Date(currentCalendarDate);

		switch (currentCalendarView) {
			case "daily":
				newDate.setDate(newDate.getDate() - 1);
				break;
			case "weekly":
				newDate.setDate(newDate.getDate() - 7);
				break;
			case "monthly":
				newDate.setMonth(newDate.getMonth() - 1);
				break;
		}

		setCurrentCalendarDate(newDate);
		playSound("click");
	};

	const navigateCalendarNext = (): void => {
		const newDate = new Date(currentCalendarDate);

		switch (currentCalendarView) {
			case "daily":
				newDate.setDate(newDate.getDate() + 1);
				break;
			case "weekly":
				newDate.setDate(newDate.getDate() + 7);
				break;
			case "monthly":
				newDate.setMonth(newDate.getMonth() + 1);
				break;
		}

		setCurrentCalendarDate(newDate);
		playSound("click");
	};

	// Format calendar date display
	const formatCalendarDateDisplay = (): string => {
		switch (currentCalendarView) {
			case "daily":
				return currentCalendarDate.toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				});
			case "weekly":
				const weekStart = new Date(currentCalendarDate);
				weekStart.setDate(
					currentCalendarDate.getDate() - currentCalendarDate.getDay()
				);

				const weekEnd = new Date(weekStart);
				weekEnd.setDate(weekStart.getDate() + 6);

				const startMonth = weekStart.toLocaleDateString("en-US", {
					month: "short",
				});
				const endMonth = weekEnd.toLocaleDateString("en-US", {
					month: "short",
				});

				return `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
			case "monthly":
				return currentCalendarDate.toLocaleDateString("en-US", {
					month: "long",
					year: "numeric",
				});
			default:
				return "";
		}
	};

	// Get filtered and sorted tasks
	const getDisplayTasks = (): Task[] => {
		// Filter by current filter and category
		let filteredTasks = filterTasks(tasks, currentFilter);

		// Apply category filter if not "all"
		if (currentCategory !== "all") {
			filteredTasks = filteredTasks.filter(
				(task) => task.tag === currentCategory
			);
		}

		// Apply search if needed
		if (searchQuery.trim() !== "") {
			filteredTasks = filteredTasks.filter(
				(task) =>
					task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					task.description.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Sort tasks - uncompleted first, then by date
		filteredTasks.sort((a, b) => {
			if (a.completed !== b.completed) {
				return a.completed ? 1 : -1;
			}

			// If both have dates, sort by date
			if (a.date && b.date) {
				const dateA = new Date(`${a.date} ${a.time || "00:00"}`);
				const dateB = new Date(`${b.date} ${b.time || "00:00"}`);
				return dateA.getTime() - dateB.getTime();
			}

			// If only one has a date, prioritize it
			if (a.date && !b.date) return -1;
			if (!a.date && b.date) return 1;

			// If neither has a date, sort by creation time
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});

		return filteredTasks;
	};

	// Determine current active task for details view
	const getActiveTask = (): Task | undefined => {
		return tasks.find((task) => task.id === activeTaskId);
	};

	// Calendar data for different views
	const getDailyCalendarTasks = (): Task[] => {
		return tasks
			.filter((task) => {
				if (!task.date) return false;
				const taskDate = new Date(task.date);
				return isSameDay(taskDate, currentCalendarDate);
			})
			.sort((a, b) => {
				if (a.time && b.time) {
					return a.time.localeCompare(b.time);
				}
				if (a.time) return -1;
				if (b.time) return 1;
				return 0;
			});
	};

	const getWeeklyCalendarData = () => {
		// Get start of week
		const weekStart = new Date(currentCalendarDate);
		weekStart.setDate(
			currentCalendarDate.getDate() - currentCalendarDate.getDay()
		);

		const weekDays = [];
		for (let i = 0; i < 7; i++) {
			const day = new Date(weekStart);
			day.setDate(weekStart.getDate() + i);

			const dayTasks = tasks.filter((task) => {
				if (!task.date) return false;
				const taskDate = new Date(task.date);
				return isSameDay(taskDate, day);
			});

			weekDays.push({
				date: day,
				tasks: dayTasks,
			});
		}

		return weekDays;
	};

	const getMonthlyCalendarData = () => {
		const month = currentCalendarDate.getMonth();
		const year = currentCalendarDate.getFullYear();

		// Get first day of month
		const firstDay = new Date(year, month, 1);
		const startingDay = firstDay.getDay(); // 0 = Sunday

		// Get number of days in month
		const lastDay = new Date(year, month + 1, 0);
		const totalDays = lastDay.getDate();

		const monthDays = [];

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < startingDay; i++) {
			monthDays.push(null);
		}

		// Add cells for each day of the month
		for (let i = 1; i <= totalDays; i++) {
			const currentDay = new Date(year, month, i);

			const dayTasks = tasks.filter((task) => {
				if (!task.date) return false;
				const taskDate = new Date(task.date);
				return isSameDay(taskDate, currentDay);
			});

			monthDays.push({
				date: currentDay,
				tasks: dayTasks,
			});
		}

		// Add empty cells for days after the last day of the month
		const endingDay = lastDay.getDay();
		for (let i = endingDay; i < 6; i++) {
			monthDays.push(null);
		}

		return monthDays;
	};

	// Stats calculations
	const getTaskStats = () => {
		const totalTasks = tasks.length;
		const completedTasks = tasks.filter((task) => task.completed).length;
		const pendingTasks = totalTasks - completedTasks;
		const overdueTasks = tasks.filter(
			(task) => !task.completed && isOverdueTask(task)
		).length;
		const completionPercentage =
			totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

		return {
			total: totalTasks,
			completed: completedTasks,
			active: pendingTasks,
			overdue: overdueTasks,
			percentage: completionPercentage,
		};
	};

	// Render Authentication Pages
	const renderAuthPages = () => {
		switch (authPage) {
			case "landing":
				return (
					<div className="page flex flex-col items-center justify-center min-h-screen">
						<div className="relative mb-8">
							<div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-30"></div>
							<div className="relative">
								<svg
									className="w-24 h-24 text-purple-500"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M9 14L11 16L15 12"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>
						<h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
							TaskMaster
						</h1>
						<p className="text-gray-400 mb-10 text-center text-lg">
							Your ultimate productivity companion
						</p>

						<div className="flex flex-col w-full gap-4 px-6">
							<button
								onClick={() => setAuthPage("login")}
								className="w-full py-4 px-6 rounded-xl flex justify-center items-center space-x-3 hover:bg-gray-800 transition duration-300 border border-gray-700"
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
										strokeWidth="2"
										d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
									/>
								</svg>
								<span className="font-medium">Login to Your Account</span>
							</button>
							<button
								onClick={() => setAuthPage("signup")}
								className="w-full py-4 px-6 rounded-xl flex justify-center items-center space-x-3 hover:bg-gray-800 transition duration-300 border border-gray-700"
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
										strokeWidth="2"
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
								<span className="font-medium">Create New Account</span>
							</button>
							<div className="mt-6 text-center">
								<button
									onClick={demoLogin}
									className="text-purple-500 hover:text-purple-400 transition-colors font-medium flex mx-auto items-center"
								>
									<span>Continue without account</span>
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
											strokeWidth="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</div>

						<div className="mt-16 text-center text-gray-500 text-sm">
							<p>© 2025 TaskMaster. All rights reserved.</p>
						</div>
					</div>
				);

			case "login":
				return (
					<div className="page">
						<div className="flex justify-center mb-8">
							<div className="relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-30"></div>
								<svg
									className="w-20 h-20 text-purple-500 relative"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M9 14L11 16L15 12"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>

						<h1 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
							Login to Your Account
						</h1>

						<form onSubmit={handleLogin} className="space-y-5">
							<div>
								<label
									htmlFor="login-email"
									className="block text-sm font-medium mb-2 text-gray-300"
								>
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
											/>
										</svg>
									</div>
									<input
										type="email"
										id="login-email"
										required
										className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="login-password"
									className="block text-sm font-medium mb-2 text-gray-300"
								>
									Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
									</div>
									<input
										type="password"
										id="login-password"
										required
										className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										id="remember-me"
										type="checkbox"
										className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
									/>
									<label
										htmlFor="remember-me"
										className="ml-2 block text-sm text-gray-400"
									>
										Remember me
									</label>
								</div>
								<div className="text-sm">
									<a
										href="#"
										className="text-purple-400 hover:text-purple-300 transition-colors"
									>
										Forgot password?
									</a>
								</div>
							</div>

							<button
								type="submit"
								className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-purple-500 hover:to-blue-400 transition-all duration-300 font-medium shadow-lg shadow-purple-500/30"
							>
								Sign In
							</button>
						</form>

						<div className="mt-8 text-center">
							<p className="text-gray-400">
								Don't have an account?
								<button
									onClick={() => setAuthPage("signup")}
									className="text-purple-400 hover:text-purple-300 transition-colors font-medium ml-1"
								>
									Create account
								</button>
							</p>
						</div>

						<button
							onClick={() => setAuthPage("landing")}
							className="mt-8 text-gray-400 hover:text-white flex items-center justify-center w-full transition-colors"
						>
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
									strokeWidth="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back to home
						</button>
					</div>
				);

			case "signup":
				return (
					<div className="page">
						<div className="flex justify-center mb-8">
							<div className="relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-30"></div>
								<svg
									className="w-20 h-20 text-purple-500 relative"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M9 14L11 16L15 12"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>

						<h1 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
							Create Your Account
						</h1>

						<form onSubmit={handleSignup} className="space-y-5">
							<div>
								<label
									htmlFor="signup-name"
									className="block text-sm font-medium mb-2 text-gray-300"
								>
									Full Name
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
									<input
										type="text"
										id="signup-name"
										required
										className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="signup-email"
									className="block text-sm font-medium mb-2 text-gray-300"
								>
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
											/>
										</svg>
									</div>
									<input
										type="email"
										id="signup-email"
										required
										className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="signup-password"
									className="block text-sm font-medium mb-2 text-gray-300"
								>
									Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
									</div>
									<input
										type="password"
										id="signup-password"
										required
										className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="signup-confirm-password"
									className="block text-sm font-medium mb-2 text-gray-300"
								>
									Confirm Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
									</div>
									<input
										type="password"
										id="signup-confirm-password"
										required
										className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
								</div>
							</div>

							<div className="flex items-center">
								<input
									id="terms"
									type="checkbox"
									required
									className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
								/>
								<label
									htmlFor="terms"
									className="ml-2 block text-sm text-gray-400"
								>
									I agree to the
									<a
										href="#"
										className="text-purple-400 hover:text-purple-300 transition-colors mx-1"
									>
										Terms of Service
									</a>
									and
									<a
										href="#"
										className="text-purple-400 hover:text-purple-300 transition-colors ml-1"
									>
										Privacy Policy
									</a>
								</label>
							</div>

							<button
								type="submit"
								className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-purple-500 hover:to-blue-400 transition-all duration-300 font-medium shadow-lg shadow-purple-500/30"
							>
								Create Account
							</button>
						</form>

						<div className="mt-8 text-center">
							<p className="text-gray-400">
								Already have an account?
								<button
									onClick={() => setAuthPage("login")}
									className="text-purple-400 hover:text-purple-300 transition-colors font-medium ml-1"
								>
									Sign in
								</button>
							</p>
						</div>

						<button
							onClick={() => setAuthPage("landing")}
							className="mt-8 text-gray-400 hover:text-white flex items-center justify-center w-full transition-colors"
						>
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
									strokeWidth="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back to home
						</button>
					</div>
				);

			default:
				return null;
		}
	};

	// Render Home Page
	const renderHomePage = () => {
		const stats = getTaskStats();
		const displayTasks = getDisplayTasks();

		return (
			<div className="container mx-auto px-4 pb-24 pt-6 max-w-2xl md:max-w-3xl lg:max-w-4xl">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-2xl font-bold">
							Welcome back,
							<span className="text-purple-400 ml-1">
								{user?.name || "User"}
							</span>
						</h1>
						<p className="text-gray-400">
							Let's organize your tasks for the day
						</p>
					</div>
					<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
						<img
							src={
								user?.avatar ||
								"https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							}
							alt="User"
							className="w-full h-full object-cover"
						/>
					</div>
				</div>

				{/* Search Field */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="relative flex-grow">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							type="text"
							className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 glassmorphism"
							placeholder="Search tasks..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="px-4 py-3 rounded-xl flex items-center sm:w-auto w-full justify-center glassmorphism">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-purple-400 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="text-sm font-medium">
							{new Date().toLocaleDateString("en-US", {
								month: "long",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</div>
				</div>

				{/* Progress Circle */}
				<div className="glassmorphism rounded-xl p-6 mb-8 animate-fade-in">
					<div className="flex flex-col md:flex-row items-center gap-6">
						<div className="relative w-20 h-20">
							<svg viewBox="0 0 100 100" className="w-full h-full">
								<circle
									cx="50"
									cy="50"
									r="40"
									fill="none"
									stroke="#4338ca30"
									strokeWidth="10"
								/>
								<circle
									cx="50"
									cy="50"
									r="40"
									fill="none"
									stroke="#6366f1"
									strokeWidth="10"
									strokeDasharray="251.2"
									strokeDashoffset={251.2 - (stats.percentage / 100) * 251.2}
									transform="rotate(-90 50 50)"
								/>
							</svg>
							<div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
								{stats.percentage}%
							</div>
						</div>

						<div className="flex-grow">
							<h3 className="text-lg font-semibold mb-1">Your progress</h3>
							<p className="text-gray-800 text-sm mb-2">
								Complete your daily goals
							</p>
							<div className="flex gap-4">
								<div className="flex flex-col">
									<span className="text-xl font-bold">{stats.completed}</span>
									<span className="text-xs text-gray-800">Completed</span>
								</div>
								<div className="w-px bg-gray-700"></div>
								<div className="flex flex-col">
									<span className="text-xl font-bold">{stats.active}</span>
									<span className="text-xs text-gray-800">Active</span>
								</div>
								<div className="w-px bg-gray-700"></div>
								<div className="flex flex-col">
									<span className="text-xl font-bold">{stats.total}</span>
									<span className="text-xs text-gray-800">Total</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Filters */}
				<div className="mb-6">
					<h3 className="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3">
						Filter Tasks
					</h3>
					<div className="flex justify-between items-center">
						<div className="flex gap-2 overflow-x-auto">
							<button
								onClick={() => setCurrentFilter("all")}
								className={`whitespace-nowrap px-4 py-2 rounded-full ${
									currentFilter === "all"
										? "bg-purple-500 text-white"
										: "bg-gray-800/50 text-gray-200"
								} text-sm font-medium transition duration-300`}
							>
								All
							</button>
							<button
								onClick={() => setCurrentFilter("active")}
								className={`whitespace-nowrap px-4 py-2 rounded-full ${
									currentFilter === "active"
										? "bg-purple-500 text-white"
										: "bg-gray-800/50 text-gray-200"
								} text-sm font-medium transition duration-300`}
							>
								Active
							</button>
							<button
								onClick={() => setCurrentFilter("completed")}
								className={`whitespace-nowrap px-4 py-2 rounded-full ${
									currentFilter === "completed"
										? "bg-purple-500 text-white"
										: "bg-gray-800/50 text-gray-200"
								} text-sm font-medium transition duration-300`}
							>
								Completed
							</button>
							{/* <button
        onClick={() => setCurrentFilter('today')}
        className={`whitespace-nowrap px-4 py-2 rounded-full ${
          currentFilter === 'today'
            ? 'bg-purple-500 text-white'
            : 'bg-gray-800/50 text-gray-200'
        } text-sm font-medium transition duration-300`}
      >
        Due Today
      </button> */}
						</div>

						<div className="flex items-center bg-gray-800/50 rounded-lg p-1 ml-auto">
							<button
								onClick={() => setViewMode("list")}
								className={`p-2 rounded-md transition-colors ${
									viewMode === "list"
										? "bg-purple-500 text-white"
										: "text-gray-400"
								}`}
								title="List View"
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
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
							<button
								onClick={() => setViewMode("grid")}
								className={`p-2 rounded-md transition-colors ${
									viewMode === "grid"
										? "bg-purple-500 text-white"
										: "text-gray-400"
								}`}
								title="Grid View"
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
										strokeWidth="2"
										d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Tasks */}
				<div
					className={
						viewMode === "list"
							? "space-y-4"
							: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
					}
				>
					{displayTasks.length === 0 ? (
						<div className="text-center py-10">
							<div className="w-20 h-20 mx-auto mb-4 text-gray-600">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-full h-full"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h3 className="text-gray-400 text-lg font-medium mb-2">
								No tasks found
							</h3>
							<p className="text-gray-500 text-sm mb-4">
								Create a new task to get started
							</p>
							<button
								onClick={openCreateTaskModal}
								className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition duration-300 font-medium shadow-md shadow-purple-500/20 flex items-center mx-auto"
							>
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
										strokeWidth="2"
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Add New Task
							</button>
						</div>
					) : (
						displayTasks.map((task) => (
							<div
								key={task.id}
								className={`task-card rounded-xl p-4 relative overflow-hidden animate-fade-in ${
									task.completed ? "opacity-60" : ""
								} ${viewMode === "grid" ? "h-64 flex flex-col" : ""}`}
								onClick={() => openTaskDetails(task.id)}
							>
								<div
									className={`priority-indicator ${
										task.priority === "high" ? "bg-red-500" : "bg-green-500"
									}`}
								></div>
								<div className="flex items-start mb-3 gap-3">
									<div
										className="mt-1"
										onClick={(e) => {
											e.stopPropagation();
											toggleTaskCompletion(task.id);
										}}
									>
										<input
											type="checkbox"
											checked={task.completed}
											onChange={(e) => {
												e.stopPropagation();
												toggleTaskCompletion(task.id);
											}}
											className="h-5 w-5 rounded-md"
										/>
									</div>
									<div className="flex-grow">
										<h3
											className={`text-lg font-medium mb-1 ${
												task.completed ? "line-through text-gray-500" : ""
											}`}
										>
											{task.title}
										</h3>
										{task.description && (
											<p
												className={`text-gray-400 text-sm ${
													task.completed ? "line-through" : ""
												} ${viewMode === "grid" ? "line-clamp-2" : ""}`}
											>
												{task.description}
											</p>
										)}
									</div>
								</div>
								<div
									className={`flex flex-wrap gap-2 items-center ${
										viewMode === "grid" ? "mt-auto" : ""
									}`}
								>
									<span
										className="text-xs px-2 py-1 rounded-full"
										style={{
											backgroundColor:
												task.priority === "high"
													? "rgba(239, 68, 68, 0.2)"
													: task.priority === "medium"
													? "rgba(245, 158, 11, 0.2)"
													: "rgba(16, 185, 129, 0.2)",
											color:
												task.priority === "high"
													? "rgb(239, 68, 68)"
													: task.priority === "medium"
													? "rgb(245, 158, 11)"
													: "rgb(16, 185, 129)",
											border:
												task.priority === "high"
													? "1px solid rgba(239, 68, 68, 0.3)"
													: task.priority === "medium"
													? "1px solid rgba(245, 158, 11, 0.3)"
													: "1px solid rgba(16, 185, 129, 0.3)",
										}}
									>
										{capitalizeFirstLetter(task.priority)}
									</span>
									<span
										className="text-xs px-2 py-1 rounded-full"
										style={{
											backgroundColor:
												task.tag === "work"
													? "rgba(59, 130, 246, 0.2)"
													: task.tag === "personal"
													? "rgba(168, 85, 247, 0.2)"
													: task.tag === "event"
													? "rgba(16, 185, 129, 0.2)"
													: task.tag === "project"
													? "rgba(245, 158, 11, 0.2)"
													: "rgba(236, 72, 153, 0.2)",
											color:
												task.tag === "work"
													? "rgb(59, 130, 246)"
													: task.tag === "personal"
													? "rgb(168, 85, 247)"
													: task.tag === "event"
													? "rgb(16, 185, 129)"
													: task.tag === "project"
													? "rgb(245, 158, 11)"
													: "rgb(236, 72, 153)",
											border:
												task.tag === "work"
													? "1px solid rgba(59, 130, 246, 0.3)"
													: task.tag === "personal"
													? "1px solid rgba(168, 85, 247, 0.3)"
													: task.tag === "event"
													? "1px solid rgba(16, 185, 129, 0.3)"
													: task.tag === "project"
													? "1px solid rgba(245, 158, 11, 0.3)"
													: "1px solid rgba(236, 72, 153, 0.3)",
										}}
									>
										{capitalizeFirstLetter(task.tag)}
									</span>
									{task.date && (
										<div
											className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
											style={{
												backgroundColor: isOverdueTask(task)
													? "rgba(239, 68, 68, 0.2)"
													: isToday(task.date)
													? "rgba(245, 158, 11, 0.2)"
													: "rgba(99, 102, 241, 0.15)",
												color: isOverdueTask(task)
													? "rgb(239, 68, 68)"
													: isToday(task.date)
													? "rgb(245, 158, 11)"
													: "rgb(99, 102, 241)",
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											{formatDateDisplay(task.date)}
											{task.time && ` at ${formatTimeDisplay(task.time)}`}
										</div>
									)}
								</div>
								<div className="absolute right-2 top-2 flex space-x-1">
									<button
										className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700/30"
										onClick={(e) => {
											e.stopPropagation();
											openEditTaskModal(task.id);
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
												strokeWidth="2"
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
									</button>
									<button
										className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-gray-700/30"
										onClick={(e) => {
											e.stopPropagation();
											openDeleteModal(task.id);
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
												strokeWidth="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							</div>
						))
					)}
				</div>

				{/* Floating Action Button */}
				<button
					onClick={openCreateTaskModal}
					className="fixed right-6 bottom-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-full shadow-lg transition duration-300 hover:from-purple-500 hover:to-blue-400"
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
							strokeWidth="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>
		);
	};

	// Task Modal Form
	const renderTaskModal = () => {
		if (!showTaskModal) return null;

		return (
			<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
				<div className="bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-xl">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold">
							{taskForm.id ? "Edit Task" : "Create New Task"}
						</h2>
						<button
							onClick={closeTaskModal}
							className="text-gray-400 hover:text-white transition-colors"
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
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (taskForm.id) {
								updateTask();
							} else {
								addTask();
							}
						}}
						className="space-y-4"
					>
						{/* Title */}
						<div>
							<label
								htmlFor="task-title"
								className="block text-sm font-medium mb-1 text-gray-300"
							>
								Title *
							</label>
							<input
								type="text"
								id="task-title"
								value={taskForm.title}
								onChange={(e) =>
									setTaskForm({ ...taskForm, title: e.target.value })
								}
								required
								className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white"
							/>
						</div>

						{/* Description */}
						<div>
							<label
								htmlFor="task-description"
								className="block text-sm font-medium mb-1 text-gray-300"
							>
								Description
							</label>
							<textarea
								id="task-description"
								value={taskForm.description}
								onChange={(e) =>
									setTaskForm({ ...taskForm, description: e.target.value })
								}
								rows={3}
								className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white"
							/>
						</div>

						{/* Due Date & Time */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="task-date"
									className="block text-sm font-medium mb-1 text-gray-300"
								>
									Due Date
								</label>
								<input
									type="date"
									id="task-date"
									value={taskForm.date}
									onChange={(e) =>
										setTaskForm({ ...taskForm, date: e.target.value })
									}
									className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white"
								/>
							</div>
							<div>
								<label
									htmlFor="task-time"
									className="block text-sm font-medium mb-1 text-gray-300"
								>
									Time
								</label>
								<input
									type="time"
									id="task-time"
									value={taskForm.time}
									onChange={(e) =>
										setTaskForm({ ...taskForm, time: e.target.value })
									}
									className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white"
								/>
							</div>
						</div>

						{/* Priority & Tag */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="task-priority"
									className="block text-sm font-medium mb-1 text-gray-300"
								>
									Priority
								</label>
								<select
									id="task-priority"
									value={taskForm.priority}
									onChange={(e) =>
										setTaskForm({ ...taskForm, priority: e.target.value })
									}
									className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white"
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>
							<div>
								<label
									htmlFor="task-tag"
									className="block text-sm font-medium mb-1 text-gray-300"
								>
									Category
								</label>
								<select
									id="task-tag"
									value={taskForm.tag}
									onChange={(e) =>
										setTaskForm({ ...taskForm, tag: e.target.value })
									}
									className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white"
								>
									<option value="work">Work</option>
									<option value="personal">Personal</option>
									<option value="event">Event</option>
									<option value="project">Project</option>
									<option value="family">Family</option>
								</select>
							</div>
						</div>

						{/* Buttons */}
						<div className="flex justify-end gap-3 pt-2">
							<button
								type="button"
								onClick={closeTaskModal}
								className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition duration-300"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300"
							>
								{taskForm.id ? "Update Task" : "Save Task"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Delete Confirmation Modal
	const renderDeleteModal = () => {
		if (!showDeleteModal) return null;

		return (
			<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
				<div className="bg-gray-800 rounded-xl w-full max-w-sm p-6 shadow-xl">
					<div className="text-center mb-4">
						<div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-100 text-red-500 mb-4">
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
									strokeWidth="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-bold mb-2">Delete Task</h2>
						<p className="mb-6 text-gray-300">
							Are you sure you want to delete this task? This action cannot be
							undone.
						</p>
					</div>

					<div className="flex justify-center gap-4">
						<button
							onClick={closeDeleteModal}
							className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition duration-300"
						>
							Cancel
						</button>
						<button
							onClick={deleteTask}
							className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		);
	};

	// Task Details Modal
	const renderTaskDetailsModal = () => {
		const task = getActiveTask();
		if (!showDetailsModal || !task) return null;

		return (
			<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
				<div className="bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-xl">
					<div className="flex justify-between items-start">
						<div>
							<div className="flex gap-2 mb-1">
								<span
									className="text-xs px-2 py-1 rounded-full"
									style={{
										backgroundColor:
											task.priority === "high"
												? "rgba(239, 68, 68, 0.2)"
												: task.priority === "medium"
												? "rgba(245, 158, 11, 0.2)"
												: "rgba(16, 185, 129, 0.2)",
										color:
											task.priority === "high"
												? "rgb(239, 68, 68)"
												: task.priority === "medium"
												? "rgb(245, 158, 11)"
												: "rgb(16, 185, 129)",
									}}
								>
									{capitalizeFirstLetter(task.priority)}
								</span>
								<span
									className="text-xs px-2 py-1 rounded-full"
									style={{
										backgroundColor:
											task.tag === "work"
												? "rgba(59, 130, 246, 0.2)"
												: task.tag === "personal"
												? "rgba(168, 85, 247, 0.2)"
												: task.tag === "event"
												? "rgba(16, 185, 129, 0.2)"
												: task.tag === "project"
												? "rgba(245, 158, 11, 0.2)"
												: "rgba(236, 72, 153, 0.2)",
										color:
											task.tag === "work"
												? "rgb(59, 130, 246)"
												: task.tag === "personal"
												? "rgb(168, 85, 247)"
												: task.tag === "event"
												? "rgb(16, 185, 129)"
												: task.tag === "project"
												? "rgb(245, 158, 11)"
												: "rgb(236, 72, 153)",
									}}
								>
									{capitalizeFirstLetter(task.tag)}
								</span>
							</div>
							<h2 className="text-xl font-bold mb-3">{task.title}</h2>
						</div>
						<button
							onClick={closeTaskDetails}
							className="text-gray-400 hover:text-white transition-colors p-1"
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
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<div className="mb-4 pb-4 border-b border-gray-700/50">
						<div className="flex items-center text-sm text-gray-400 mb-3">
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
									strokeWidth="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span>
								{task.date
									? `${formatDateDisplay(task.date)}${
											task.time ? ` at ${formatTimeDisplay(task.time)}` : ""
									  }`
									: "No due date"}
							</span>
						</div>
						<p className="text-gray-300">
							{task.description || "No description provided."}
						</p>
					</div>

					<div className="flex justify-between items-center">
						<div className="flex items-center">
							<input
								id="task-complete"
								type="checkbox"
								checked={task.completed}
								onChange={() => toggleTaskCompletion(task.id)}
								className="h-5 w-5 rounded-md"
							/>
							<label
								htmlFor="task-complete"
								className="text-sm font-medium ml-2"
							>
								Mark as completed
							</label>
						</div>
						<div>
							<button
								onClick={() => {
									closeTaskDetails();
									openEditTaskModal(task.id);
								}}
								className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
							>
								Edit
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// Toast Notification
	const renderToast = () => {
		if (!showToast) return null;

		return (
			<div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg bg-gray-800 min-w-[300px] max-w-sm z-50">
				<div className="flex items-center">
					<div
						className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3"
						style={{
							backgroundColor:
								toastType === "success"
									? "rgba(99, 102, 241, 0.2)"
									: toastType === "error"
									? "rgba(239, 68, 68, 0.2)"
									: toastType === "warning"
									? "rgba(245, 158, 11, 0.2)"
									: "rgba(59, 130, 246, 0.2)",
						}}
					>
						{toastType === "success" && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-purple-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						)}
						{toastType === "error" && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-red-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						)}
						{toastType === "warning" && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-yellow-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						)}
						{toastType === "info" && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-blue-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
					</div>
					<div>
						<p className="font-medium text-white">{toastMessage}</p>
					</div>
				</div>
				<div className="w-full h-1 bg-gray-700 mt-3 rounded-full overflow-hidden">
					<div
						className="h-full rounded-full"
						style={{
							backgroundColor:
								toastType === "success"
									? "rgb(99, 102, 241)"
									: toastType === "error"
									? "rgb(239, 68, 68)"
									: toastType === "warning"
									? "rgb(245, 158, 11)"
									: "rgb(59, 130, 246)",
							width: "100%",
							animation: "toast-progress 3s linear forwards",
						}}
					></div>
				</div>
			</div>
		);
	};

	// Bottom Navigation
	const renderBottomNav = () => {
		return (
			<nav className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-md py-4 px-6 z-40">
				<div className="container mx-auto max-w-xl">
					<div className="flex justify-around items-center">
						{/* Home Nav Item */}
						<button
							onClick={() => changePage("home")}
							className={`flex flex-col items-center transition-colors ${
								currentPage === "home"
									? "text-purple-500"
									: "text-gray-400 hover:text-white"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mb-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span className="text-xs font-medium">Home</span>
						</button>

						{/* Calendar Nav Item */}
						<button
							onClick={() => changePage("calendar")}
							className={`flex flex-col items-center transition-colors ${
								currentPage === "calendar"
									? "text-purple-500"
									: "text-gray-400 hover:text-white"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mb-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span className="text-xs font-medium">Calendar</span>
						</button>

						{/* Profile Nav Item */}
						<button
							onClick={() => changePage("profile")}
							className={`flex flex-col items-center transition-colors ${
								currentPage === "profile"
									? "text-purple-500"
									: "text-gray-400 hover:text-white"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mb-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							<span className="text-xs font-medium">Profile</span>
						</button>
					</div>
				</div>
			</nav>
		);
	};

	// Calendar Page
	const renderCalendarPage = () => {
		return (
			<div className="container mx-auto px-4 pb-24 pt-6 max-w-2xl md:max-w-3xl lg:max-w-4xl">
				<h1 className="text-2xl font-bold mb-6">Calendar</h1>

				{/* Calendar Views Toggle */}
				<div className="flex gap-3 mb-6">
					<button
						onClick={() => changeCalendarView("daily")}
						className={`px-4 py-2 rounded-lg ${
							currentCalendarView === "daily"
								? "bg-purple-500 text-white"
								: "bg-gray-800/50 text-white"
						} text-sm font-medium transition duration-300`}
					>
						Daily
					</button>
					<button
						onClick={() => changeCalendarView("weekly")}
						className={`px-4 py-2 rounded-lg ${
							currentCalendarView === "weekly"
								? "bg-purple-500 text-white"
								: "bg-gray-800/50 text-white"
						} text-sm font-medium transition duration-300`}
					>
						Weekly
					</button>
					<button
						onClick={() => changeCalendarView("monthly")}
						className={`px-4 py-2 rounded-lg ${
							currentCalendarView === "monthly"
								? "bg-purple-500 text-white"
								: "bg-gray-800/50 text-white"
						} text-sm font-medium transition duration-300`}
					>
						Monthly
					</button>
				</div>

				{/* Calendar Navigation */}
				<div className="flex justify-between items-center mb-6">
					<button
						onClick={navigateCalendarPrev}
						className="p-3 rounded-xl hover:bg-slate-700/50 transition-colors glassmorphism"
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
								strokeWidth="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<span className="text-xl font-medium px-4 py-2 rounded-xl glassmorphism">
						{formatCalendarDateDisplay()}
					</span>
					<button
						onClick={navigateCalendarNext}
						className="p-3 rounded-xl hover:bg-slate-700/50 transition-colors glassmorphism"
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
								strokeWidth="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>

				{/* Calendar Content */}
				<div className="rounded-xl p-5 animate-fade-in dark:text-white glassmorphism">
					{currentCalendarView === "daily" && (
						<div>
							{getDailyCalendarTasks().length === 0 ? (
								<div className="text-center py-8">
									<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-gray-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<p className="text-gray-400 text-lg font-medium mb-2">
										No tasks for today
									</p>
									<p className="text-gray-500 text-sm">
										{formatDateDisplay(formatDate(currentCalendarDate))}
									</p>
								</div>
							) : (
								<>
									<div className="mb-4 pb-2 border-b border-gray-700/30">
										<div className="flex items-center text-purple-400 font-medium">
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
													strokeWidth="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											<span>
												{formatDateDisplay(
													formatDate(currentCalendarDate),
													true
												)}
											</span>
										</div>
									</div>
									<div className="space-y-3">
										{getDailyCalendarTasks().map((task) => (
											<div
												key={task.id}
												className="calendar-task p-4 rounded-lg border-l-4 border-success-500 animate-fade-in"
												style={{
													borderColor:
														task.priority === "high"
															? "rgb(239, 68, 68)"
															: task.priority === "medium"
															? "rgb(245, 158, 11)"
															: "rgb(16, 185, 129)",
												}}
												onClick={() => openTaskDetails(task.id)}
											>
												<div className="flex justify-between items-start mb-2">
													<div className="flex items-center">
														<div
															className="mr-2"
															onClick={(e) => {
																e.stopPropagation();
																toggleTaskCompletion(task.id);
															}}
														>
															<input
																type="checkbox"
																checked={task.completed}
																onChange={(e) => {
																	e.stopPropagation();
																	toggleTaskCompletion(task.id);
																}}
																className="h-5 w-5 rounded-md"
															/>
														</div>
														<h3
															className={`font-medium text-lg ${
																task.completed
																	? "line-through text-gray-500"
																	: ""
															}`}
														>
															{task.title}
														</h3>
													</div>
													<span
														className="text-xs px-2 py-1 rounded-full"
														style={{
															backgroundColor:
																task.priority === "high"
																	? "rgba(239, 68, 68, 0.2)"
																	: task.priority === "medium"
																	? "rgba(245, 158, 11, 0.2)"
																	: "rgba(16, 185, 129, 0.2)",
															color:
																task.priority === "high"
																	? "rgb(239, 68, 68)"
																	: task.priority === "medium"
																	? "rgb(245, 158, 11)"
																	: "rgb(16, 185, 129)",
														}}
													>
														{capitalizeFirstLetter(task.priority)}
													</span>
												</div>
												{task.description && (
													<p
														className={`text-gray-400 text-sm ml-8 mb-3 ${
															task.completed ? "line-through" : ""
														}`}
													>
														{task.description}
													</p>
												)}
												<div className="flex justify-between items-center">
													<span
														className="text-xs px-2 py-1 rounded-full"
														style={{
															backgroundColor:
																task.tag === "work"
																	? "rgba(59, 130, 246, 0.2)"
																	: task.tag === "personal"
																	? "rgba(168, 85, 247, 0.2)"
																	: task.tag === "event"
																	? "rgba(16, 185, 129, 0.2)"
																	: task.tag === "project"
																	? "rgba(245, 158, 11, 0.2)"
																	: "rgba(236, 72, 153, 0.2)",
															color:
																task.tag === "work"
																	? "rgb(59, 130, 246)"
																	: task.tag === "personal"
																	? "rgb(168, 85, 247)"
																	: task.tag === "event"
																	? "rgb(16, 185, 129)"
																	: task.tag === "project"
																	? "rgb(245, 158, 11)"
																	: "rgb(236, 72, 153)",
														}}
													>
														{capitalizeFirstLetter(task.tag)}
													</span>
													<div className="flex items-center">
														{task.time && (
															<div className="text-sm text-gray-400 mr-3">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-4 w-4 mr-1 inline-block"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
																	/>
																</svg>
																{formatTimeDisplay(task.time)}
															</div>
														)}
														<button
															className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
															onClick={(e) => {
																e.stopPropagation();
																openTaskDetails(task.id);
															}}
														>
															View Details
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								</>
							)}
						</div>
					)}

					{currentCalendarView === "weekly" && (
						<div>
							<div className="grid grid-cols-7 gap-2 mb-4 text-center">
								{getWeeklyCalendarData().map((day, i) => (
									<div
										key={i}
										className={`text-sm font-medium ${
											isSameDay(day.date, new Date())
												? "text-purple-400"
												: "text-gray-400"
										}`}
									>
										{day.date.toLocaleDateString("en-US", { weekday: "short" })}
									</div>
								))}
							</div>

							<div className="grid grid-cols-7 gap-2">
								{getWeeklyCalendarData().map((day, i) => {
									const isToday = isSameDay(day.date, new Date());
									const formattedDay = day.date.getDate();

									return (
										<div key={i} className="mb-2">
											<div
												className={`p-2 ${
													isToday
														? "bg-purple-500/20 rounded-t-lg"
														: "bg-gray-700/30 rounded-t-lg"
												} text-center`}
											>
												<p
													className={`text-lg font-medium ${
														isToday ? "text-purple-400" : ""
													}`}
												>
													{formattedDay}
												</p>
											</div>
											<div className="p-3 bg-gray-700/20 rounded-b-lg">
												{day.tasks.length === 0 ? (
													<p className="text-xs text-gray-500 text-center">
														No tasks
													</p>
												) : (
													<>
														<div className="flex flex-wrap justify-center gap-1 mb-1">
															{day.tasks.slice(0, 5).map((task: Task) => (
																<div
																	key={task.id}
																	className="w-3 h-3 rounded-full cursor-pointer"
																	style={{
																		backgroundColor:
																			task.priority === "high"
																				? "rgb(239, 68, 68)"
																				: task.priority === "medium"
																				? "rgb(245, 158, 11)"
																				: "rgb(16, 185, 129)",
																	}}
																	title={task.title}
																	onClick={() => openTaskDetails(task.id)}
																/>
															))}
														</div>
														{day.tasks.length > 5 && (
															<p className="text-xs text-purple-400 text-center mt-1">
																+{day.tasks.length - 5} more
															</p>
														)}
													</>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{currentCalendarView === "monthly" && (
						<div>
							<div className="grid grid-cols-7 gap-1 mb-4">
								{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
									<div
										key={i}
										className="text-center text-sm font-medium text-gray-400 p-1"
									>
										{day}
									</div>
								))}
							</div>

							<div className="grid grid-cols-7 gap-1">
								{getMonthlyCalendarData().map((dayData, i) => {
									if (!dayData) {
										return (
											<div
												key={`empty-${i}`}
												className="p-1 h-20 text-center opacity-30 text-sm"
											></div>
										);
									}

									const isToday = isSameDay(dayData.date, new Date());

									return (
										<div
											key={`day-${i}`}
											className={`p-2 h-20 ${
												isToday ? "bg-purple-500/20 rounded-md" : ""
											} bg-gray-800/50 hover:bg-gray-700/50 transition-colors cursor-pointer rounded-md`}
											onClick={() => {
												setCurrentCalendarDate(dayData.date);
												changeCalendarView("daily");
											}}
										>
											<div className="flex flex-col h-full">
												<span
													className={`text-sm ${
														isToday ? "text-purple-400 font-bold" : ""
													}`}
												>
													{dayData.date.getDate()}
												</span>
												{dayData.tasks.length > 0 && (
													<div className="mt-auto">
														<div className="flex flex-wrap gap-1">
															{dayData.tasks.slice(0, 3).map((task: Task) => (
																<div
																	key={task.id}
																	className="w-2 h-2 rounded-full"
																	style={{
																		backgroundColor:
																			task.priority === "high"
																				? "rgb(239, 68, 68)"
																				: task.priority === "medium"
																				? "rgb(245, 158, 11)"
																				: "rgb(16, 185, 129)",
																	}}
																/>
															))}
														</div>
														{dayData.tasks.length > 3 && (
															<span className="text-xs text-purple-400">
																+{dayData.tasks.length - 3}
															</span>
														)}
													</div>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	// Profile Page
	const renderProfilePage = () => {
		const stats = getTaskStats();

		return (
			<div className="container mx-auto px-4 pb-24 pt-6 max-w-2xl md:max-w-3xl lg:max-w-4xl">
				<h1 className="text-2xl font-bold mb-6">Profile</h1>

				{/* Profile Info */}
				<div className="bg-gray-800/50 rounded-xl p-6 mb-8">
					<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
						<div className="relative">
							<div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-20"></div>
							<div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500/30 relative">
								<img
									src={
										user?.avatar || "https://avatar.iran.liara.run/public/boy"
									}
									alt="User"
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
						<div className="text-center sm:text-left">
							<h2 className="text-xl font-bold">{user?.name || "User Name"}</h2>
							<p className="text-gray-400">
								{user?.email || "user@example.com"}
							</p>
							<button className="mt-3 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center justify-center sm:justify-start">
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
										strokeWidth="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									/>
								</svg>
								Edit Profile
							</button>
						</div>
					</div>

					{/* Settings */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold mb-4">Settings</h3>

						{/* User Stats */}
						<div className="mt-8 pt-2">
							<h3 className="text-lg font-semibold mb-4">Your Stats</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="bg-gray-700/50 p-4 rounded-xl">
									<div className="flex items-center mb-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-purple-400 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
											/>
										</svg>
										<p className="font-medium">Total Tasks</p>
									</div>
									<p className="text-3xl font-bold">{stats.total}</p>
								</div>
								<div className="bg-gray-700/50 p-4 rounded-xl">
									<div className="flex items-center mb-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-green-400 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<p className="font-medium">Completed</p>
									</div>
									<p className="text-3xl font-bold">{stats.completed}</p>
								</div>
								<div className="bg-gray-700/50 p-4 rounded-xl">
									<div className="flex items-center mb-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-yellow-400 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<p className="font-medium">Pending</p>
									</div>
									<p className="text-3xl font-bold">{stats.active}</p>
								</div>
								<div className="bg-gray-700/50 p-4 rounded-xl">
									<div className="flex items-center mb-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-red-400 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<p className="font-medium">Overdue</p>
									</div>
									<p className="text-3xl font-bold">{stats.overdue}</p>
								</div>
							</div>
						</div>

						{/* Logout Button */}
						<button
							onClick={logout}
							className="w-full mt-8 bg-gray-700/80 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-600/80 transition duration-300"
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
									strokeWidth="2"
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

	// Main render function
	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Add keyframes for animations */}
			<Helmet>
				{" "}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>{" "}
			</Helmet>

			<style
				dangerouslySetInnerHTML={{
					__html: `
          @keyframes toast-progress {
            0% { width: 100%; }
            100% { width: 0%; }
          }

          .font-display {
            font-family: 'Balsamiq Sans', 'Comic Sans MS', cursive;
          }
          
          .toggle-bg {
            transition: background-color 0.3s ease;
          }
          
          .toggle-dot {
            top: 0.125rem;
            left: 0.125rem;
            transition: transform 0.3s ease;
          }

          /* Refined scrollbar styling */
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .dark ::-webkit-scrollbar-track {
                background: rgba(30, 41, 59, 0.5);
                border-radius: 3px;
            }

            .dark ::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.5);
                border-radius: 3px;
            }

            .dark ::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.7);
            }

            html:not(.dark) ::-webkit-scrollbar-track {
                background: rgba(241, 245, 249, 0.8);
                border-radius: 3px;
            }

            html:not(.dark) ::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.3);
                border-radius: 3px;
            }

            html:not(.dark) ::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.5);
            }

            /* Light mode adjustments */
            html:not(.dark) .filter-btn {
                color: #334155;
                /* Slate-700 for better contrast on light bg */
            }

            html:not(.dark) .filter-btn.active {
                color: white;
                /* Keep white text for active state */
            }

            html:not(.dark) .glassmorphism {
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 0, 0, 0.05);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
                color: #334155;
            }

            html:not(.dark) .calendar-task {
                background: rgba(255, 255, 255, 0.7);
                color: #334155;
            }

            html:not(.dark) .calendar-day,
            html:not(.dark) .week-day {
                background: rgba(255, 255, 255, 0.5);
                color: #334155;
            }

            html:not(.dark) .day-tasks {
                background: rgba(255, 255, 255, 0.3) !important;
            }

            /* Dark/light mode text colors */
            html.dark {
                color-scheme: dark;
            }

            html:not(.dark) {
                color-scheme: light;
            }

            html:not(.dark) .dark-text-only {
                color: #334155;
            }

            /* Enhanced glassmorphism effect */
            .glassmorphism {
                background: rgba(15, 23, 42, 0.7);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            }

            .glassmorphism-light {
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 0, 0, 0.05);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
                color: #334155 !important;
            }

            /* For hover effects */
            .glassmorphism:hover {
                background: rgba(15, 23, 42, 0.75);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
                transform: translateY(-2px);
                transition: all 0.3s ease;
            }

            .glassmorphism-light:hover {
                background: rgba(255, 255, 255, 0.75);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
                transform: translateY(-2px);
                transition: all 0.3s ease;
            }

            /* Task card hover effect */
            .task-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
            }

            .task-card:hover {
                transform: translateY(-2px);
            }

            /* Task card action buttons */
            .task-actions {
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                display: flex;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            /* Animations */
            .auth-animation {
                animation: fadeIn 0.5s ease-in-out, slideUp 0.5s ease-in-out;
            }

            @keyframes fadeIn {
                from {
                opacity: 0;
                }

                to {
                opacity: 1;
                }
            }

            @keyframes slideUp {
                from {
                transform: translateY(20px);
                opacity: 0;
                }

                to {
                transform: translateY(0);
                opacity: 1;
                }
            }

            /* Logo animation */
            .pulse-animation {
                animation: pulseSoft 3s infinite;
            }

            @keyframes pulseSoft {
                0%,
                100% {
                transform: scale(1);
                opacity: 1;
                }

                50% {
                transform: scale(1.05);
                opacity: 0.8;
                }
            }

            /* Button hover effects */
            .btn-hover-effect {
                transition: all 0.3s ease;
            }

            .btn-hover-effect:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            }

            /* Custom checkbox styling */
            .custom-checkbox {
                appearance: none;
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 6px;
                margin-right: 10px;
                cursor: pointer;
                position: relative;
                transition: all 0.3s ease;
            }

            .dark .custom-checkbox {
                background: rgba(30, 41, 59, 0.8);
                border: 2px solid rgba(99, 102, 241, 0.5);
            }

            .dark .custom-checkbox:checked {
                background: #6366f1;
                border-color: #6366f1;
            }

            html:not(.dark) .custom-checkbox {
                background: rgba(255, 255, 255, 0.8);
                border: 2px solid rgba(99, 102, 241, 0.3);
            }

            html:not(.dark) .custom-checkbox:checked {
                background: #6366f1;
                border-color: #6366f1;
            }

            .custom-checkbox:checked::after {
                content: "";
                position: absolute;
                left: 6px;
                top: 2px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            /* Make sure checkbox is clickable */
            .task-checkbox-wrapper {
                position: relative;
                display: inline-block;
            }

            .task-checkbox-wrapper input[type="checkbox"] {
                opacity: 0;
                position: absolute;
                width: 100%;
                height: 100%;
                cursor: pointer;
                z-index: 2;
            }

            .checkbox-display {
                position: relative;
                display: inline-block;
                width: 20px;
                height: 20px;
                border-radius: 6px;
                transition: all 0.3s ease;
            }

            .dark .checkbox-display {
                background: rgba(30, 41, 59, 0.8);
                border: 2px solid rgba(99, 102, 241, 0.5);
            }

            html:not(.dark) .checkbox-display {
                background: rgba(255, 255, 255, 0.8);
                border: 2px solid rgba(99, 102, 241, 0.3);
            }

            .task-checkbox-wrapper
                input[type="checkbox"]:checked
                + .checkbox-display {
                background: #6366f1;
                border-color: #6366f1;
            }

            .task-checkbox-wrapper
                input[type="checkbox"]:checked
                + .checkbox-display::after {
                content: "";
                position: absolute;
                left: 6px;
                top: 2px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            /* Page transitions */
            .page-transition {
                transition: all 0.3s ease-in-out;
            }

            .page-transition.hidden {
                opacity: 0;
                transform: translateY(10px);
            }

            /* Task priority indicators */
            .priority-indicator {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                border-radius: 4px 0 0 4px;
            }

            /* Custom toggle switch */
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(30, 41, 59, 0.5);
                transition: 0.4s;
                border-radius: 24px;
            }

            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.4s;
                border-radius: 50%;
            }

            input:checked + .toggle-slider {
                background-color: #6366f1;
            }

            input:checked + .toggle-slider:before {
                transform: translateX(24px);
            }

            /* Task date badges */
            .date-badge {
                background: rgba(99, 102, 241, 0.15);
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 0.75rem;
                color: #6366f1;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .dark .date-badge {
                background: rgba(99, 102, 241, 0.2);
            }

            /* Progress circle */
            .progress-circle {
                position: relative;
                width: 80px;
                height: 80px;
            }

            .progress-circle svg {
                transform: rotate(-90deg);
            }

            .progress-circle circle {
                fill: none;
                stroke-width: 6;
                stroke-linecap: round;
            }

            .progress-background {
                stroke: rgba(99, 102, 241, 0.1);
            }

            .progress-value {
                stroke: #6366f1;
                transition: all 0.5s ease;
            }

            .progress-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.25rem;
                font-weight: 600;
            }

            /* Category pills */
            .category-pill {
                transition: all 0.3s ease;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 500;
                padding: 0.25rem 0.75rem;
            }

            .category-pill:hover {
                transform: translateY(-1px);
            }

            /* Light theme form elements */
            html:not(.dark) input:not([type="checkbox"]):not([type="radio"]),
            html:not(.dark) textarea,
            html:not(.dark) select {
                background-color: rgba(255, 255, 255, 0.8);
                color: #1e293b;
                border-color: rgba(203, 213, 225, 0.7);
            }

            html:not(.dark) .nav-btn.active {
                color: #4f46e5 !important; /* Primary-600 color */
                font-weight: 600;
            }

            html:not(.dark) ::-webkit-calendar-picker-indicator {
                filter: invert(0.5);
            }

            html:not(.dark) ::placeholder {
                color: #94a3b8;
            }

            html:not(.dark) select option {
                background-color: white;
                color: #1e293b;
            }

            /* Make form labels more visible in light mode */
            html:not(.dark) label {
                color: #475569 !important; /* slate-600 */
                font-weight: 500;
            }

            /* Ensure modals have proper text color in light mode */
            html:not(.dark) .glassmorphism-light h2,
            html:not(.dark) .glassmorphism-light .font-bold,
            html:not(.dark) .glassmorphism-light .font-medium {
                color: #1e293b !important;
            }
        `,
				}}
			/>

			{/* Authentication Pages */}
			{currentPage === "auth" && (
				<div className="container mx-auto px-4 py-10 max-w-md">
					{renderAuthPages()}
				</div>
			)}

			{/* App Pages */}
			{currentPage !== "auth" && (
				<div className="pb-24 font-display">
					{currentPage === "home" && renderHomePage()}
					{currentPage === "calendar" && renderCalendarPage()}
					{currentPage === "profile" && renderProfilePage()}

					{/* Modals */}
					{renderTaskModal()}
					{renderDeleteModal()}
					{renderTaskDetailsModal()}
					{renderToast()}

					{/* Bottom Navigation */}
					{renderBottomNav()}
				</div>
			)}
		</div>
	);
};



export default TaskMaster;
