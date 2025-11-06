"use client";
import React, { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	RadialBarChart,
	RadialBar,
} from "recharts";
import { PenTool, ChevronRight, FileText } from "lucide-react";
import {
	ChevronDown,
	ChevronUp,
	Bell,
	Settings,
	LogOut,
	Search,
	Calendar,
	Clock,
	CheckCircle,
	Award,
	Activity,
	User,
	Users,
	BarChart2,
	ArrowUp,
	ArrowDown,
	Plus,
	X,
	Zap,
	Target,
	Bookmark,
	TrendingUp,
	Coffee,
	Code,
	AlertTriangle,
	Info,
	HelpCircle,
} from "lucide-react";

type Employee = {
	id: number;
	name: string;
	avatar: string;
	role: string;
	department: string;
	completedTasks: number;
	pendingTasks: number;
	productivity: number;
	efficiency: number;
	consistency: number;
	timeLogged: number;
	lastActive: string;
	habits: Habit[];
	timeLogs: TimeLog[];
};

type Habit = {
	id: number;
	name: string;
	frequency: string;
	target: number;
	current: number;
	streak: number;
	color: string;
};

type TimeLog = {
	id: number;
	project: string;
	task: string;
	startTime: string;
	endTime: string;
	duration: number;
	date: string;
};

type Project = {
	id: number;
	name: string;
	progress: number;
	tasks: number;
	color: string;
};

type ChartData = {
	name: string;
	value: number;
	color?: string;
};

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
	id: number;
	message: string;
	type: ToastType;
};

type Modal = {
	isOpen: boolean;
	title: string;
	message: string;
	type: ToastType;
	onClose: () => void;
};

const generateRandomData = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateTimeSeries = (days: number): ChartData[] => {
	const data: ChartData[] = [];
	const today = new Date();

	for (let i = days - 1; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		const day = date.toLocaleDateString("en-US", { weekday: "short" });
		data.push({
			name: day,
			value: generateRandomData(20, 100),
		});
	}

	return data;
};

const generateWeeklyData = (): ChartData[] => {
	return [
		{ name: "Mon", value: generateRandomData(30, 90) },
		{ name: "Tue", value: generateRandomData(40, 95) },
		{ name: "Wed", value: generateRandomData(35, 85) },
		{ name: "Thu", value: generateRandomData(50, 100) },
		{ name: "Fri", value: generateRandomData(45, 90) },
		{ name: "Sat", value: generateRandomData(20, 60) },
		{ name: "Sun", value: generateRandomData(10, 40) },
	];
};

const generateMonthlyData = (): ChartData[] => {
	const data: ChartData[] = [];
	const currentMonth = new Date().getMonth();
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	for (let i = 0; i < 12; i++) {
		const month = (currentMonth - 11 + i + 12) % 12;
		data.push({
			name: monthNames[month],
			value: generateRandomData(40, 95),
		});
	}

	return data;
};

const generateTimeDistribution = (): ChartData[] => {
	return [
		{ name: "Development", value: 35, color: "#0284c7" },
		{ name: "Meetings", value: 20, color: "#e11d48" },
		{ name: "Planning", value: 15, color: "#16a34a" },
		{ name: "Research", value: 15, color: "#7c3aed" },
		{ name: "Admin", value: 10, color: "#eab308" },
		{ name: "Other", value: 5, color: "#475569" },
	];
};

const generateTimeLogsForEmployee = (employeeId: number): TimeLog[] => {
	const projects = [
		"Website Redesign",
		"Mobile App",
		"API Integration",
		"Bug Fixes",
		"Feature Development",
	];
	const tasks = ["Coding", "Testing", "Documentation", "Review", "Meeting"];
	const logs: TimeLog[] = [];

	for (let i = 0; i < 7; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split("T")[0];

		const logsPerDay = generateRandomData(1, 4);
		for (let j = 0; j < logsPerDay; j++) {
			const duration = generateRandomData(30, 240);
			const startHour = generateRandomData(9, 16);
			const startTime = `${startHour}:${generateRandomData(0, 5) * 10}`;
			const endHour = Math.min(startHour + Math.floor(duration / 60), 18);
			const endMinute =
				(startHour * 60 + generateRandomData(0, 5) * 10 + duration) % 60;
			const endTime = `${endHour}:${
				endMinute < 10 ? "0" + endMinute : endMinute
			}`;

			logs.push({
				id: employeeId * 100 + logs.length,
				project: projects[generateRandomData(0, projects.length - 1)],
				task: tasks[generateRandomData(0, tasks.length - 1)],
				startTime,
				endTime,
				duration,
				date: dateStr,
			});
		}
	}

	return logs;
};

const generateHabitsForEmployee = (employeeId: number): Habit[] => {
	const habitNames = [
		"Daily Standup",
		"Code Review",
		"Documentation",
		"Testing",
		"Learning",
	];
	const frequencies = ["Daily", "Weekly", "Daily", "Daily", "Weekly"];
	const colors = ["#0284c7", "#e11d48", "#16a34a", "#7c3aed", "#eab308"];
	const habits: Habit[] = [];

	for (let i = 0; i < habitNames.length; i++) {
		const target = generateRandomData(5, 20);
		const current = generateRandomData(0, target);

		habits.push({
			id: employeeId * 100 + i,
			name: habitNames[i],
			frequency: frequencies[i],
			target,
			current,
			streak: generateRandomData(0, 30),
			color: colors[i % colors.length],
		});
	}

	return habits;
};

const generateEmployees = (count: number): Employee[] => {
	const names = [
		"Alex Johnson",
		"Taylor Smith",
		"Jordan Williams",
		"Casey Brown",
		"Morgan Davis",
		"Riley Wilson",
		"Jamie Moore",
		"Avery Thompson",
		"Charlie Miller",
		"Quinn Anderson",
	];

	const roles = [
		"Frontend Developer",
		"Backend Developer",
		"UI/UX Designer",
		"Project Manager",
		"QA Engineer",
	];

	const departments = [
		"Engineering",
		"Design",
		"Product",
		"Marketing",
		"Operations",
	];

	const unsplashIds = [
		"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=2417&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3161&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://plus.unsplash.com/premium_photo-1669879825881-6d4e4bde67d5?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://plus.unsplash.com/premium_photo-1691784781482-9af9bce05096?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://plus.unsplash.com/premium_photo-1664536392779-049ba8fde933?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	];

	const employees: Employee[] = [];

	for (let i = 0; i < count; i++) {
		const completedTasks = generateRandomData(20, 100);
		const pendingTasks = generateRandomData(5, 30);
		const productivity = generateRandomData(70, 95);
		const efficiency = generateRandomData(60, 95);
		const consistency = generateRandomData(65, 95);
		const timeLogged = generateRandomData(20, 40);

		const hours = generateRandomData(0, 5);
		const minutes = generateRandomData(0, 59);
		const lastActive = `${hours}h ${minutes}m ago`;

		employees.push({
			id: i + 1,
			name: names[i % names.length],
			avatar: `${unsplashIds[i % unsplashIds.length]}`,
			role: roles[i % roles.length],
			department: departments[i % departments.length],
			completedTasks,
			pendingTasks,
			productivity,
			efficiency,
			consistency,
			timeLogged,
			lastActive,
			habits: generateHabitsForEmployee(i + 1),
			timeLogs: generateTimeLogsForEmployee(i + 1),
		});
	}

	return employees.sort((a, b) => b.completedTasks - a.completedTasks);
};

const generateProjects = (count: number): Project[] => {
	const projectNames = [
		"Website Redesign",
		"Mobile App Development",
		"API Integration",
		"Analytics Dashboard",
		"E-commerce Platform",
		"CRM Implementation",
		"Marketing Campaign",
		"Customer Portal",
		"Inventory System",
	];

	const colors = [
		"#0284c7",
		"#e11d48",
		"#16a34a",
		"#7c3aed",
		"#eab308",
		"#475569",
		"#f97316",
		"#06b6d4",
		"#ec4899",
	];

	const projects: Project[] = [];

	for (let i = 0; i < count; i++) {
		projects.push({
			id: i + 1,
			name: projectNames[i % projectNames.length],
			progress: generateRandomData(10, 100),
			tasks: generateRandomData(10, 50),
			color: colors[i % colors.length],
		});
	}

	return projects;
};

const AppLogo: React.FC = () => {
	return (
		<div className="flex items-center relative h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
			<svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
				<defs>
					<linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
						<stop offset="100%" stopColor="#fff" stopOpacity="0" />
					</linearGradient>
				</defs>
				<rect x="10" y="16" width="20" height="8" rx="2" fill="white" />
				<circle cx="20" cy="13" r="2" fill="white" />
				<circle cx="20" cy="27" r="2" fill="white" />
				<path d="M26 16 L30 13 L30 27 L26 24" fill="white" opacity="0.7" />
				<path d="M14 16 L10 13 L10 27 L14 24" fill="white" opacity="0.7" />
				<rect x="0" y="0" width="40" height="40" fill="url(#logoGradient)" />
			</svg>
		</div>
	);
};

const ProductivityTracker: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">(
		"daily"
	);
	const [viewMode, setViewMode] = useState<
		"productivity" | "habits" | "time" | "leaderboard"
	>("productivity");
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	);
	const [dailyData, setDailyData] = useState<ChartData[]>([]);
	const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
	const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
	const [timeDistribution, setTimeDistribution] = useState<ChartData[]>([]);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [selectedProject, setSelectedProject] = useState<string>("");
	const [selectedTask, setSelectedTask] = useState<string>("");
	const [startTime, setStartTime] = useState<string>("");
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [toastId, setToastId] = useState<number>(1);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] =
		useState<boolean>(false);
	const [isNotificationPanelOpen, setIsNotificationPanelOpen] =
		useState<boolean>(false);
	const [showHabitForm, setShowHabitForm] = useState<boolean>(false);
	const [newHabitName, setNewHabitName] = useState<string>("");
	const [newHabitFrequency, setNewHabitFrequency] = useState<string>("Daily");
	const [newHabitTarget, setNewHabitTarget] = useState<number>(5);
	const [hoverCard, setHoverCard] = useState<number | null>(null);
	const [modal, setModal] = useState<Modal>({
		isOpen: false,
		title: "",
		message: "",
		type: "info",
		onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
	});

	useEffect(() => {
		setEmployees(generateEmployees(10));
		setProjects(generateProjects(6));
		setDailyData(generateTimeSeries(7));
		setWeeklyData(generateWeeklyData());
		setMonthlyData(generateMonthlyData());
		setTimeDistribution(generateTimeDistribution());
	}, []);

	useEffect(() => {
		if (employees.length > 0 && !selectedEmployee) {
			setSelectedEmployee(employees[0]);
		}
	}, [employees, selectedEmployee]);

	const showToast = (message: string, type: ToastType = "info") => {
		const newToast = {
			id: toastId,
			message,
			type,
		};

		setToasts((prev) => [...prev, newToast]);
		setToastId((prev) => prev + 1);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
		}, 3000);
	};

	const showModal = (
		title: string,
		message: string,
		type: ToastType = "info"
	) => {
		setModal({
			isOpen: true,
			title,
			message,
			type,
			onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
		});
	};

	const removeToast = (id: number) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	const startTimeRecording = () => {
		if (!selectedProject || !selectedTask) {
			showToast("Please select a project and task first", "warning");
			return;
		}

		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		setStartTime(`${hours}:${minutes < 10 ? "0" + minutes : minutes}`);
		setIsRecording(true);
		showToast("Time tracking started", "success");
	};

	const stopTimeRecording = () => {
		if (!isRecording) return;

		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const endTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

		const [startHour, startMinute] = startTime.split(":").map(Number);
		const startTotalMinutes = startHour * 60 + startMinute;
		const endTotalMinutes = hours * 60 + minutes;
		const durationMinutes = endTotalMinutes - startTotalMinutes;

		if (selectedEmployee && durationMinutes > 0) {
			const newTimeLog: TimeLog = {
				id: Date.now(),
				project: selectedProject,
				task: selectedTask,
				startTime,
				endTime,
				duration: durationMinutes,
				date: new Date().toISOString().split("T")[0],
			};

			const updatedEmployee = {
				...selectedEmployee,
				timeLogs: [newTimeLog, ...selectedEmployee.timeLogs],
				timeLogged: selectedEmployee.timeLogged + durationMinutes / 60,
			};

			setEmployees((prev) =>
				prev.map((emp) =>
					emp.id === selectedEmployee.id ? updatedEmployee : emp
				)
			);
			setSelectedEmployee(updatedEmployee);
			showToast("Time log saved successfully", "success");
		}

		setIsRecording(false);
		setStartTime("");
		setSelectedProject("");
		setSelectedTask("");
	};

	const updateHabitProgress = (habitId: number, increment: boolean) => {
		if (!selectedEmployee) return;

		const updatedHabits = selectedEmployee.habits.map((habit) => {
			if (habit.id === habitId) {
				const newCurrent = increment
					? Math.min(habit.current + 1, habit.target)
					: Math.max(habit.current - 1, 0);

				let newStreak = habit.streak;

				if (increment) {
					if (newCurrent === habit.target) {
						newStreak = habit.streak + 1;
					}
				} else {
					if (habit.current === habit.target && newCurrent < habit.target) {
						newStreak = 0;
					}
				}

				return {
					...habit,
					current: newCurrent,
					streak: newStreak,
				};
			}
			return habit;
		});

		const updatedEmployee = {
			...selectedEmployee,
			habits: updatedHabits,
			consistency: calculateConsistency(updatedHabits),
		};

		setEmployees((prev) =>
			prev.map((emp) =>
				emp.id === selectedEmployee.id ? updatedEmployee : emp
			)
		);
		setSelectedEmployee(updatedEmployee);

		if (increment) {
			showToast("Habit progress updated", "success");
		}
	};

	const addNewHabit = () => {
		if (!selectedEmployee || !newHabitName || newHabitTarget <= 0) {
			showToast("Please fill in all habit details", "warning");
			return;
		}

		const colors = ["#0284c7", "#e11d48", "#16a34a", "#7c3aed", "#eab308"];
		const randomColor = colors[Math.floor(Math.random() * colors.length)];

		const newHabit: Habit = {
			id: Date.now(),
			name: newHabitName,
			frequency: newHabitFrequency,
			target: newHabitTarget,
			current: 0,
			streak: 0,
			color: randomColor,
		};

		const updatedHabits = [...selectedEmployee.habits, newHabit];

		const updatedEmployee = {
			...selectedEmployee,
			habits: updatedHabits,
		};

		setEmployees((prev) =>
			prev.map((emp) =>
				emp.id === selectedEmployee.id ? updatedEmployee : emp
			)
		);
		setSelectedEmployee(updatedEmployee);

		setNewHabitName("");
		setNewHabitFrequency("Daily");
		setNewHabitTarget(5);
		setShowHabitForm(false);

		showToast("New habit added successfully", "success");
	};

	const calculateConsistency = (habits: Habit[]): number => {
		if (habits.length === 0) return 0;

		const totalProgress = habits.reduce(
			(acc, habit) => acc + habit.current / habit.target,
			0
		);
		return Math.round((totalProgress / habits.length) * 100);
	};

	const filteredEmployees = employees.filter(
		(emp) =>
			emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
			emp.department.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const formatTimeDisplay = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const COLORS = {
		primary: "#0284c7",
		secondary: "#0ea5e9",
		accent: "#0891b2",
		danger: "#ef4444",
		warning: "#f59e0b",
		success: "#10b981",
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans relative overflow-x-hidden">
			<header className="bg-white bg-opacity-90 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-blue-100">
				<div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
					<div className="flex items-center">
						<div className="flex items-center mr-1 sm:mr-2">
							<AppLogo />
							<h1 className="text-lg sm:text-xl font-bold ml-1 sm:ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 hidden md:block">
								ProductivityTracker
							</h1>
						</div>
						<div className="h-10 w-px bg-gradient-to-b from-blue-100 to-indigo-100 mx-4 hidden md:block"></div>
						<nav className="hidden md:flex">
							<button
								onClick={() => {
									setViewMode("productivity");
									showToast("Switched to Productivity Dashboard", "info");
								}}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 mx-1 rounded-md hover:bg-blue-100 transition-colors duration-200 flex items-center text-xs sm:text-sm cursor-pointer ${
									viewMode === "productivity"
										? "text-blue-700 font-medium bg-blue-50"
										: "text-gray-700"
								}`}
							>
								<BarChart2 size={14} className="mr-1" />
								Dashboard
							</button>
							<button
								onClick={() => {
									setViewMode("habits");
									showToast("Switched to Habit Tracker", "info");
								}}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 mx-1 rounded-md hover:bg-blue-100 transition-colors duration-200 flex items-center text-xs sm:text-sm cursor-pointer ${
									viewMode === "habits"
										? "text-blue-700 font-medium bg-blue-50"
										: "text-gray-700"
								}`}
							>
								<Target size={14} className="mr-1" />
								Habits
							</button>
							<button
								onClick={() => {
									setViewMode("time");
									showToast("Switched to Time Logs", "info");
								}}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 mx-1 rounded-md hover:bg-blue-100 transition-colors duration-200 flex items-center text-xs sm:text-sm cursor-pointer ${
									viewMode === "time"
										? "text-blue-700 font-medium bg-blue-50"
										: "text-gray-700"
								}`}
							>
								<Clock size={14} className="mr-1" />
								Time
							</button>
							<button
								onClick={() => {
									setViewMode("leaderboard");
									showToast("Switched to Leaderboard", "info");
								}}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 mx-1 rounded-md hover:bg-blue-100 transition-colors duration-200 flex items-center text-xs sm:text-sm cursor-pointer ${
									viewMode === "leaderboard"
										? "text-blue-700 font-medium bg-blue-50"
										: "text-gray-700"
								}`}
							>
								<Award size={14} className="mr-1" />
								Leaderboard
							</button>
						</nav>
					</div>

					<div className="flex items-center">
						<div className="relative mr-1 sm:mr-2">
							<div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
								<Search size={14} className="text-blue-500" />
							</div>
							<input
								type="text"
								placeholder="Search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-24 sm:w-40 md:w-64 pl-7 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 rounded-full bg-white bg-opacity-90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm backdrop-blur-sm"
							/>
						</div>

						<button
							onClick={() =>
								setIsNotificationPanelOpen(!isNotificationPanelOpen)
							}
							className="relative p-1.5 sm:p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 cursor-pointer ml-0.5 sm:ml-1"
						>
							<Bell size={16} className="text-blue-700" />
							<span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
						</button>

						<div className="relative ml-0.5 sm:ml-2">
							<button
								onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
								className="flex items-center space-x-1 cursor-pointer"
							>
								<div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 transform rotate-45"></div>
									<User size={14} />
								</div>
								<ChevronDown
									size={12}
									className="text-blue-700 hidden md:block"
								/>
							</button>

							{isProfileDropdownOpen && (
								<div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg py-1 z-10 bg-opacity-90 backdrop-blur-md border border-blue-100 text-xs sm:text-sm">
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											showModal(
												"Profile",
												"Your profile settings page is currently under development. Check back soon!",
												"info"
											);
											setIsProfileDropdownOpen(false);
										}}
										className="block px-4 py-2 text-gray-700 hover:bg-blue-50 cursor-pointer"
									>
										Profile
									</a>
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											showModal(
												"Settings",
												"System settings are currently being configured. This feature will be available in the next update.",
												"info"
											);
											setIsProfileDropdownOpen(false);
										}}
										className="block px-4 py-2 text-gray-700 hover:bg-blue-50 cursor-pointer"
									>
										Settings
									</a>
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											showToast("Logged out successfully", "success");
											setIsProfileDropdownOpen(false);
										}}
										className="block px-4 py-2 text-gray-700 hover:bg-blue-50 cursor-pointer"
									>
										Logout
									</a>
								</div>
							)}
						</div>

						<button
							className="ml-1 sm:ml-2 p-1.5 sm:p-2 rounded-md md:hidden cursor-pointer hover:bg-blue-50"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? (
								<X size={18} className="text-blue-700" />
							) : (
								<div className="space-y-1">
									<div className="w-4 h-0.5 bg-blue-700"></div>
									<div className="w-4 h-0.5 bg-blue-700"></div>
									<div className="w-4 h-0.5 bg-blue-700"></div>
								</div>
							)}
						</button>
					</div>
				</div>

				{isMobileMenuOpen && (
					<div className="md:hidden bg-white bg-opacity-95 backdrop-blur-lg border-b border-blue-100">
						<div className="px-2 pt-2 pb-3 space-y-1">
							<button
								onClick={() => {
									setViewMode("productivity");
									setIsMobileMenuOpen(false);
									showToast("Switched to Productivity Dashboard", "info");
								}}
								className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
									viewMode === "productivity"
										? "bg-blue-100 text-blue-700"
										: "text-gray-700 hover:bg-blue-50"
								}`}
							>
								<BarChart2 size={16} className="mr-2" />
								Dashboard
							</button>
							<button
								onClick={() => {
									setViewMode("habits");
									setIsMobileMenuOpen(false);
									showToast("Switched to Habit Tracker", "info");
								}}
								className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
									viewMode === "habits"
										? "bg-blue-100 text-blue-700"
										: "text-gray-700 hover:bg-blue-50"
								}`}
							>
								<Target size={16} className="mr-2" />
								Habits
							</button>
							<button
								onClick={() => {
									setViewMode("time");
									setIsMobileMenuOpen(false);
									showToast("Switched to Time Logs", "info");
								}}
								className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
									viewMode === "time"
										? "bg-blue-100 text-blue-700"
										: "text-gray-700 hover:bg-blue-50"
								}`}
							>
								<Clock size={16} className="mr-2" />
								Time
							</button>
							<button
								onClick={() => {
									setViewMode("leaderboard");
									setIsMobileMenuOpen(false);
									showToast("Switched to Leaderboard", "info");
								}}
								className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
									viewMode === "leaderboard"
										? "bg-blue-100 text-blue-700"
										: "text-gray-700 hover:bg-blue-50"
								}`}
							>
								<Award size={16} className="mr-2" />
								Leaderboard
							</button>
						</div>
					</div>
				)}

				{isNotificationPanelOpen && (
					<div className="absolute right-2 sm:right-4 md:right-48 top-12 sm:top-16 w-64 sm:w-80 bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg z-50 border border-blue-200 text-xs sm:text-sm">
						<div className="px-4 py-3 border-b border-blue-100">
							<h3 className="font-semibold text-gray-800">Notifications</h3>
						</div>
						<div className="divide-y divide-blue-100 max-h-60 sm:max-h-80 overflow-y-auto">
							<div className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors">
								<p className="font-medium text-gray-800">New task assigned</p>
								<p className="text-gray-600 mt-1">
									API Integration for the mobile app
								</p>
								<p className="text-blue-600 mt-2">2 minutes ago</p>
							</div>
							<div className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors">
								<p className="font-medium text-gray-800">
									Weekly report available
								</p>
								<p className="text-gray-600 mt-1">
									Your productivity is up by 12% this week
								</p>
								<p className="text-blue-600 mt-2">1 hour ago</p>
							</div>
							<div className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors">
								<p className="font-medium text-gray-800">
									Team meeting reminder
								</p>
								<p className="text-gray-600 mt-1">Project kickoff at 2:00 PM</p>
								<p className="text-blue-600 mt-2">3 hours ago</p>
							</div>
						</div>
						<div className="px-4 py-2 border-t border-blue-100 text-center">
							<button
								onClick={() => {
									showModal(
										"Notifications",
										"The full notifications center is currently being developed. You'll be able to customize your notification preferences and view all notifications here soon.",
										"info"
									);
									setIsNotificationPanelOpen(false);
								}}
								className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
							>
								View all notifications
							</button>
						</div>
					</div>
				)}
			</header>

			<main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6">
					<div className="w-full md:w-auto mb-3 md:mb-0">
						<h2 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-1 sm:mb-2">
							Employee Performance
						</h2>
						<div className="relative inline-block w-full md:w-auto">
							<select
								value={selectedEmployee?.id || ""}
								onChange={(e) => {
									const empId = Number(e.target.value);
									const emp = employees.find((e) => e.id === empId);
									if (emp) {
										setSelectedEmployee(emp);
										showToast(`Selected ${emp.name}`, "info");
									}
								}}
								className="w-full md:w-56 lg:w-64 appearance-none block px-3 sm:px-4 py-2 sm:py-2.5 border border-blue-300 rounded-md shadow-sm bg-white bg-opacity-90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-xs sm:text-sm"
							>
								{employees.map((emp) => (
									<option key={emp.id} value={emp.id}>
										{emp.name} - {emp.role}
									</option>
								))}
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
								<ChevronDown size={14} className="text-blue-600" />
							</div>
						</div>
					</div>
				</div>

				{selectedEmployee && (
					<div className="mb-4 sm:mb-6 bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition-all duration-300">
						<div className="flex flex-col md:flex-row">
							<div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-600 p-3 sm:p-6 text-white relative overflow-hidden">
								<div className="relative z-10">
									<div className="flex items-center mb-3 sm:mb-4">
										<div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white p-1 mr-3 sm:mr-4 shadow-lg ring-2 ring-white ring-opacity-30">
											<img
												src={selectedEmployee.avatar}
												alt={selectedEmployee.name}
												className="h-full w-full object-cover rounded-full"
											/>
											<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-transparent opacity-0 hover:opacity-20 transition-opacity"></div>
										</div>
										<div>
											<h3 className="text-base sm:text-xl font-bold">
												{selectedEmployee.name}
											</h3>
											<p className="text-xs sm:text-sm text-blue-100">
												{selectedEmployee.role}
											</p>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4 relative z-10">
									<div className="backdrop-blur-sm bg-white p-2 sm:p-3 rounded-lg">
										<p className="font-semibold text-s text-indigo-800">
											Department
										</p>
										<p className="font-medium text-xs sm:text-sm text-indigo-600">
											{selectedEmployee.department}
										</p>
									</div>
									<div className="backdrop-blur-sm bg-white p-2 sm:p-3 rounded-lg">
										<p className="font-semibold text-s text-indigo-800">
											Last Active
										</p>
										<p className="font-medium text-xs sm:text-sm text-indigo-600">
											{selectedEmployee.lastActive}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2 sm:gap-4 relative z-10">
									<div className="backdrop-blur-sm bg-white p-2 sm:p-3 rounded-lg">
										<p className="font-semibold text-s text-indigo-800">
											Completed Tasks
										</p>
										<p className="font-bold text-xs sm:text-lg flex items-center text-indigo-600">
											<CheckCircle size={14} className="mr-1" />
											{selectedEmployee.completedTasks}
										</p>
									</div>
									<div className="backdrop-blur-sm bg-white p-2 sm:p-3 rounded-lg">
										<p className="font-semibold text-s text-indigo-800">
											Pending Tasks
										</p>
										<p className="font-bold text-xs sm:text-lg flex items-center text-indigo-600">
											<Clock size={14} className="mr-1" />
											{selectedEmployee.pendingTasks}
										</p>
									</div>
								</div>
							</div>

							<div className="md:w-2/3 p-3 sm:p-6">
								<h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-4 flex items-center">
									<Activity size={14} className="mr-1 text-blue-600" />
									Performance Metrics
								</h4>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
									<div>
										<div className="flex items-center justify-between mb-1">
											<p className="text-xs text-gray-700 flex items-center">
												<Zap size={12} className="mr-1 text-blue-600" />
												Productivity
											</p>
											<p className="text-xs font-medium text-gray-800">
												{selectedEmployee.productivity}%
											</p>
										</div>
										<div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
												style={{ width: `${selectedEmployee.productivity}%` }}
											></div>
										</div>
									</div>

									<div>
										<div className="flex items-center justify-between mb-1">
											<p className="text-xs text-gray-700 flex items-center">
												<TrendingUp size={12} className="mr-1 text-green-600" />
												Efficiency
											</p>
											<p className="text-xs font-medium text-gray-800">
												{selectedEmployee.efficiency}%
											</p>
										</div>
										<div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
												style={{ width: `${selectedEmployee.efficiency}%` }}
											></div>
										</div>
									</div>

									<div>
										<div className="flex items-center justify-between mb-1">
											<p className="text-xs text-gray-700 flex items-center">
												<Target size={12} className="mr-1 text-indigo-600" />
												Consistency
											</p>
											<p className="text-xs font-medium text-gray-800">
												{selectedEmployee.consistency}%
											</p>
										</div>
										<div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 ease-out"
												style={{ width: `${selectedEmployee.consistency}%` }}
											></div>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6 mt-3 sm:mt-6">
									<div className="col-span-1 sm:col-span-2 flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 sm:p-4 shadow-sm border border-blue-100">
										<div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md relative overflow-hidden">
											<Clock size={16} />
										</div>
										<div>
											<p className="text-xs text-gray-600">Time Logged</p>
											<p className="text-sm sm:text-lg font-semibold text-gray-800">
												{selectedEmployee.timeLogged} hours
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 sm:p-4 shadow-sm border border-indigo-100">
										<div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md relative overflow-hidden">
											<CheckCircle size={16} />
										</div>
										<div>
											<p className="text-xs text-gray-600">Task Rate</p>
											<p className="text-sm sm:text-lg font-semibold text-gray-800">
												{Math.round(
													(selectedEmployee.completedTasks /
														(selectedEmployee.timeLogged || 1)) *
														10
												) / 10}
												/hr
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-2 sm:p-4 shadow-sm border border-rose-100">
										<div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md relative overflow-hidden">
											<Award size={16} />
										</div>
										<div>
											<p className="text-xs text-gray-600">Rank</p>
											<p className="text-sm sm:text-lg font-semibold text-gray-800">
												#
												{employees.findIndex(
													(e) => e.id === selectedEmployee.id
												) + 1}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{viewMode === "productivity" && (
					<div className="space-y-4 sm:space-y-6">
						<div className="flex justify-center mb-3 sm:mb-6">
							<div className="inline-flex bg-white bg-opacity-90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-blue-200">
								<button
									onClick={() => setActiveTab("daily")}
									className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
										activeTab === "daily"
											? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
											: "text-gray-700 hover:bg-blue-50"
									}`}
								>
									Daily
								</button>
								<button
									onClick={() => setActiveTab("weekly")}
									className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
										activeTab === "weekly"
											? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
											: "text-gray-700 hover:bg-blue-50"
									}`}
								>
									Weekly
								</button>
								<button
									onClick={() => setActiveTab("monthly")}
									className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
										activeTab === "monthly"
											? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
											: "text-gray-700 hover:bg-blue-50"
									}`}
								>
									Monthly
								</button>
							</div>
						</div>

						<div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl">
							<div className="flex justify-between items-center mb-3 sm:mb-4">
								<h3 className="text-sm sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
									Activity Summary
								</h3>
								<div className="flex space-x-1">
									<span className="inline-block h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-blue-500"></span>
									<span className="inline-block h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-indigo-500"></span>
									<span className="inline-block h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-purple-500"></span>
								</div>
							</div>
							<div className="h-48 sm:h-64 w-full">
								<ResponsiveContainer width="100%" height="100%">
									{activeTab === "daily" && (
										<AreaChart
											data={dailyData}
											margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
										>
											<defs>
												<linearGradient
													id="colorActivity"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#3b82f6"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#3b82f6"
														stopOpacity={0}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="3 3"
												vertical={false}
												stroke="#e5e7eb"
											/>
											<XAxis
												dataKey="name"
												tick={{ fontSize: 10, fill: "#4b5563" }}
												tickLine={false}
												axisLine={false}
											/>
											<YAxis
												tick={{ fontSize: 10, fill: "#4b5563" }}
												tickLine={false}
												axisLine={false}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													borderRadius: "8px",
													border: "none",
													boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
													backdropFilter: "blur(10px)",
													fontSize: "12px",
													color: "#1f2937",
												}}
											/>
											<Area
												type="monotone"
												dataKey="value"
												stroke="#3b82f6"
												fillOpacity={1}
												fill="url(#colorActivity)"
												strokeWidth={2}
												activeDot={{ r: 5 }}
											/>
										</AreaChart>
									)}

									{activeTab === "weekly" && (
										<BarChart
											data={weeklyData}
											margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
										>
											<defs>
												<linearGradient
													id="barGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="0%"
														stopColor="#3b82f6"
														stopOpacity={1}
													/>
													<stop
														offset="100%"
														stopColor="#4f46e5"
														stopOpacity={0.8}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="3 3"
												vertical={false}
												stroke="#e5e7eb"
											/>
											<XAxis
												dataKey="name"
												tick={{ fontSize: 10, fill: "#4b5563" }}
												tickLine={false}
												axisLine={false}
											/>
											<YAxis
												tick={{ fontSize: 10, fill: "#4b5563" }}
												tickLine={false}
												axisLine={false}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													borderRadius: "8px",
													border: "none",
													boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
													backdropFilter: "blur(10px)",
													fontSize: "12px",
													color: "#1f2937",
												}}
											/>
											<Bar
												dataKey="value"
												fill="url(#barGradient)"
												radius={[4, 4, 0, 0]}
												barSize={20}
											/>
										</BarChart>
									)}

									{activeTab === "monthly" && (
										<LineChart
											data={monthlyData}
											margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
										>
											<CartesianGrid
												strokeDasharray="3 3"
												vertical={false}
												stroke="#e5e7eb"
											/>
											<XAxis
												dataKey="name"
												tick={{ fontSize: 10, fill: "#4b5563" }}
												tickLine={false}
												axisLine={false}
											/>
											<YAxis
												tick={{ fontSize: 10, fill: "#4b5563" }}
												tickLine={false}
												axisLine={false}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													borderRadius: "8px",
													border: "none",
													boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
													backdropFilter: "blur(10px)",
													fontSize: "12px",
													color: "#1f2937",
												}}
											/>
											<defs>
												<linearGradient
													id="lineGradient"
													x1="0"
													y1="0"
													x2="1"
													y2="0"
												>
													<stop
														offset="0%"
														stopColor="#3b82f6"
														stopOpacity={1}
													/>
													<stop
														offset="100%"
														stopColor="#4f46e5"
														stopOpacity={1}
													/>
												</linearGradient>
											</defs>
											<Line
												type="monotone"
												dataKey="value"
												stroke="url(#lineGradient)"
												strokeWidth={2}
												dot={{
													r: 4,
													fill: "#3b82f6",
													strokeWidth: 1,
													stroke: "white",
												}}
												activeDot={{
													r: 5,
													fill: "#3b82f6",
													strokeWidth: 1,
													stroke: "white",
												}}
											/>
										</LineChart>
									)}
								</ResponsiveContainer>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
							<div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl relative">
								<div className="absolute top-0 right-0 h-16 sm:h-24 w-16 sm:w-24 rounded-bl-3xl bg-gradient-to-br from-blue-50 to-indigo-50 -z-10"></div>
								<div className="absolute bottom-0 left-0 h-10 sm:h-16 w-10 sm:w-16 rounded-tr-3xl bg-gradient-to-br from-blue-50 to-indigo-50 -z-10"></div>

								<h3 className="text-sm sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-2 sm:mb-4">
									Time Distribution
								</h3>
								<div className="h-48 sm:h-64 w-full">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<defs>
												{timeDistribution.map((entry, index) => (
													<filter
														key={`filter-${index}`}
														id={`drop-shadow-${index}`}
														filterUnits="userSpaceOnUse"
														width="200%"
														height="200%"
													>
														<feDropShadow
															dx="0"
															dy="0"
															stdDeviation="2"
															floodColor={entry.color}
															floodOpacity="0.3"
														/>
													</filter>
												))}
											</defs>
											<Pie
												data={timeDistribution}
												cx="50%"
												cy="50%"
												innerRadius={30}
												outerRadius={50}
												paddingAngle={4}
												dataKey="value"
											>
												{timeDistribution.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
														filter={`url(#drop-shadow-${index})`}
													/>
												))}
											</Pie>
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													borderRadius: "8px",
													border: "none",
													boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
													backdropFilter: "blur(10px)",
													fontSize: "12px",
													color: "#1f2937",
												}}
												formatter={(value: number) => [
													`${value}%`,
													"Time Spent",
												]}
											/>
											<Legend
												layout="vertical"
												verticalAlign="middle"
												align="right"
												wrapperStyle={{ fontSize: "10px", color: "#4b5563" }}
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl relative">
								<div className="absolute top-0 left-0 h-10 sm:h-16 w-10 sm:w-16 rounded-br-3xl bg-gradient-to-br from-blue-50 to-indigo-50 -z-10"></div>
								<div className="absolute bottom-0 right-0 h-16 sm:h-24 w-16 sm:w-24 rounded-tl-3xl bg-gradient-to-br from-blue-50 to-indigo-50 -z-10"></div>

								<div className="flex items-center justify-between mb-2 sm:mb-4">
									<h3 className="text-sm sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
										Projects
									</h3>
									<button
										onClick={() =>
											showModal(
												"Projects",
												"The full projects dashboard is currently under development. You'll soon be able to view detailed project analytics, manage tasks, and track progress across all your projects.",
												"info"
											)
										}
										className="text-xs sm:text-sm text-blue-700 hover:text-blue-800 font-medium cursor-pointer flex items-center"
									>
										View all
										<ChevronRight size={14} className="ml-1" />
									</button>
								</div>

								<div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 overflow-y-auto pr-2 custom-scrollbar">
									{projects.slice(0, 5).map((project) => (
										<div
											key={project.id}
											className="p-2 sm:p-3 border border-gray-100 rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-blue-50 transition-all cursor-pointer shadow-sm hover:shadow-md group"
											onMouseEnter={() => setHoverCard(project.id)}
											onMouseLeave={() => setHoverCard(null)}
										>
											<div className="flex items-center justify-between mb-1 sm:mb-2">
												<h4 className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
													{project.name}
												</h4>
												<span
													className="text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-white shadow-sm"
													style={{ backgroundColor: project.color }}
												>
													{project.progress}%
												</span>
											</div>
											<div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
												<div
													className="h-full transition-all duration-500 ease-out"
													style={{
														width: `${project.progress}%`,
														background: `linear-gradient(to right, ${project.color}, ${project.color}CC)`,
													}}
												></div>
											</div>
											<div className="flex items-center justify-between mt-1 sm:mt-2 text-xs text-gray-600">
												<span className="flex items-center">
													<Bookmark size={10} className="mr-1" />
													{project.tasks} tasks
												</span>
												<span className="flex items-center">
													{project.progress < 100 ? (
														<>
															<Clock size={10} className="mr-1" />
															In Progress
														</>
													) : (
														<>
															<CheckCircle
																size={10}
																className="mr-1 text-green-600"
															/>
															Completed
														</>
													)}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

				{viewMode === "habits" && selectedEmployee && (
					<div className="space-y-4 sm:space-y-6">
						<div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-6 gap-2">
								<h3 className="text-sm sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
									Habit Tracker
								</h3>
								<button
									onClick={() => setShowHabitForm(!showHabitForm)}
									className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:shadow-md transition-all duration-200 cursor-pointer text-xs sm:text-sm"
								>
									<Plus size={14} />
									<span className="font-medium">New Habit</span>
								</button>
							</div>

							{showHabitForm && (
								<div className="mb-3 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-200 shadow-inner">
									<h4 className="text-xs sm:text-sm font-medium text-blue-700 mb-2 sm:mb-3">
										Add New Habit
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
										<div>
											<label className="block text-xs text-blue-700 mb-1">
												Habit Name
											</label>
											<input
												type="text"
												placeholder="e.g. Code Review"
												value={newHabitName}
												onChange={(e) => setNewHabitName(e.target.value)}
												className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 text-xs sm:text-sm"
											/>
										</div>
										<div>
											<label className="block text-xs text-blue-700 mb-1">
												Frequency
											</label>
											<select
												value={newHabitFrequency}
												onChange={(e) => setNewHabitFrequency(e.target.value)}
												className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 text-xs sm:text-sm"
											>
												<option value="Daily">Daily</option>
												<option value="Weekly">Weekly</option>
												<option value="Monthly">Monthly</option>
											</select>
										</div>
										<div>
											<label className="block text-xs text-blue-700 mb-1">
												Target (times)
											</label>
											<input
												type="number"
												min="1"
												value={newHabitTarget}
												onChange={(e) =>
													setNewHabitTarget(parseInt(e.target.value) || 1)
												}
												className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 text-xs sm:text-sm"
											/>
										</div>
									</div>
									<div className="flex justify-end mt-3 sm:mt-4">
										<button
											onClick={() => setShowHabitForm(false)}
											className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-blue-700 hover:bg-blue-50 rounded-md mr-2 cursor-pointer"
										>
											Cancel
										</button>
										<button
											onClick={addNewHabit}
											className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md rounded-md transition-all cursor-pointer"
										>
											Add Habit
										</button>
									</div>
								</div>
							)}

							<div className="space-y-3 sm:space-y-4">
								{selectedEmployee.habits.length === 0 ? (
									<div className="text-center py-6 sm:py-10">
										<div className="flex justify-center mb-3 sm:mb-4">
											<div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600">
												<CheckCircle size={24} />
											</div>
										</div>
										<h4 className="text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">
											No habits yet
										</h4>
										<p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
											Track progress by creating your first habit
										</p>
										<button
											onClick={() => setShowHabitForm(true)}
											className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:shadow-md transition-all cursor-pointer text-xs sm:text-sm"
										>
											Create Habit
										</button>
									</div>
								) : (
									selectedEmployee.habits.map((habit) => (
										<div
											key={habit.id}
											className="bg-gradient-to-r from-white to-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
										>
											<div className="flex items-center justify-between mb-2 sm:mb-3">
												<div className="flex items-center">
													<div
														className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-white mr-2 sm:mr-3 shadow-md relative overflow-hidden"
														style={{ backgroundColor: habit.color }}
													>
														<CheckCircle size={16} />
													</div>
													<div>
														<h4 className="text-xs sm:text-sm font-medium text-gray-800">
															{habit.name}
														</h4>
														<p className="text-xs text-gray-600 flex items-center">
															<Calendar size={10} className="mr-1" />
															{habit.frequency} habit ·
															<span className="text-blue-700 ml-1 font-medium">
																{habit.streak} day streak
															</span>
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-1 sm:space-x-2">
													<button
														onClick={() => updateHabitProgress(habit.id, false)}
														className="p-1 rounded-md hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
														disabled={habit.current <= 0}
													>
														<ChevronDown size={14} className="text-gray-700" />
													</button>
													<button
														onClick={() => updateHabitProgress(habit.id, true)}
														className="p-1 rounded-md hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
														disabled={habit.current >= habit.target}
													>
														<ChevronUp size={14} className="text-gray-700" />
													</button>
												</div>
											</div>

											<div className="flex items-center space-x-2 sm:space-x-4">
												<div className="flex-1">
													<div className="flex items-center justify-between mb-1">
														<p className="text-xs text-gray-600">Progress</p>
														<p className="text-xs font-medium text-gray-800">
															{habit.current}/{habit.target}
														</p>
													</div>
													<div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
														<div
															className="h-full transition-all duration-500 ease-out"
															style={{
																width: `${
																	(habit.current / habit.target) * 100
																}%`,
																background: `linear-gradient(to right, ${habit.color}, ${habit.color}CC)`,
															}}
														></div>
													</div>
												</div>

												<div className="flex space-x-1">
													{[...Array(Math.min(habit.target, 5))].map(
														(_, index) => (
															<div
																key={index}
																className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center transition-all duration-300`}
																style={{
																	backgroundColor:
																		index < habit.current
																			? habit.color
																			: "#f1f5f9",
																	color:
																		index < habit.current ? "white" : "#94a3b8",
																	transform:
																		index < habit.current
																			? "scale(1.05)"
																			: "scale(1)",
																}}
															>
																<CheckCircle size={12} />
															</div>
														)
													)}
													{habit.target > 5 && (
														<div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 text-xs">
															+{habit.target - 5}
														</div>
													)}
												</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				)}

				{viewMode === "time" && selectedEmployee && (
					<div className="space-y-4 sm:space-y-6">
						<div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl relative">
							<div className="absolute top-0 right-0 h-20 sm:h-32 w-20 sm:w-32 rounded-bl-full bg-gradient-to-br from-blue-50 to-indigo-50 -z-10"></div>

							<h3 className="text-sm sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-2 sm:mb-4">
								Time Logger
							</h3>

							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
								<div>
									<label className="block text-xs text-blue-700 mb-1">
										Project
									</label>
									<select
										value={selectedProject}
										onChange={(e) => setSelectedProject(e.target.value)}
										disabled={isRecording}
										className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:opacity-70 bg-white bg-opacity-90 text-xs sm:text-sm"
									>
										<option value="">Select Project</option>
										{projects.map((project) => (
											<option key={project.id} value={project.name}>
												{project.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-xs text-blue-700 mb-1">
										Task
									</label>
									<select
										value={selectedTask}
										onChange={(e) => setSelectedTask(e.target.value)}
										disabled={isRecording}
										className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:opacity-70 bg-white bg-opacity-90 text-xs sm:text-sm"
									>
										<option value="">Select Task</option>
										<option value="Development">Development</option>
										<option value="Design">Design</option>
										<option value="Testing">Testing</option>
										<option value="Documentation">Documentation</option>
										<option value="Meeting">Meeting</option>
									</select>
								</div>

								<div className="col-span-1 sm:col-span-2 flex items-end">
									{isRecording ? (
										<button
											onClick={stopTimeRecording}
											className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:shadow-md transition-all cursor-pointer text-xs sm:text-sm"
										>
											<Clock size={14} />
											<span className="font-medium">
												Stop Time ({startTime} - Now)
											</span>
										</button>
									) : (
										<button
											onClick={startTimeRecording}
											className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:shadow-md transition-all cursor-pointer text-xs sm:text-sm"
										>
											<Clock size={14} />
											<span className="font-medium">Start Time</span>
										</button>
									)}
								</div>
							</div>

							{isRecording && (
								<div className="mt-3 sm:mt-4 bg-red-50 p-2 sm:p-4 rounded-md border border-red-200 animate-pulse">
									<div className="flex items-center">
										<div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-600 mr-2"></div>
										<p className="text-xs sm:text-sm text-red-700 font-medium">
											Recording time for {selectedProject} - {selectedTask}
										</p>
									</div>
								</div>
							)}
						</div>

						<div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl">
							<h3 className="text-sm sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-2 sm:mb-4">
								Recent Time Logs
							</h3>

							{selectedEmployee.timeLogs.length === 0 ? (
								<div className="text-center py-6 sm:py-8">
									<div className="flex justify-center mb-3 sm:mb-4">
										<div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600">
											<Clock size={24} />
										</div>
									</div>
									<h4 className="text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">
										No time logs yet
									</h4>
									<p className="text-xs sm:text-sm text-gray-600">
										Start tracking your time to see logs here
									</p>
								</div>
							) : (
								<div className="overflow-x-auto custom-scrollbar -mx-3 px-3">
									<table className="min-w-full divide-y divide-blue-100 text-xs sm:text-sm">
										<thead>
											<tr className="bg-blue-50">
												<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider rounded-tl-lg">
													Date
												</th>
												<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
													Project
												</th>
												<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
													Task
												</th>
												<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
													Time
												</th>
												<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider rounded-tr-lg">
													Duration
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-blue-50">
											{selectedEmployee.timeLogs.slice(0, 10).map((log) => (
												<tr
													key={log.id}
													className="hover:bg-blue-50 transition-colors"
												>
													<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap text-gray-800">
														{log.date}
													</td>
													<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap text-gray-800">
														{log.project}
													</td>
													<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap text-gray-800">
														<span className="flex items-center">
															{log.task === "Development" ? (
																<Code
																	size={12}
																	className="mr-1 text-blue-600"
																/>
															) : log.task === "Design" ? (
																<PenTool
																	size={12}
																	className="mr-1 text-pink-600"
																/>
															) : log.task === "Testing" ? (
																<Activity
																	size={12}
																	className="mr-1 text-amber-600"
																/>
															) : log.task === "Documentation" ? (
																<FileText
																	size={12}
																	className="mr-1 text-indigo-600"
																/>
															) : log.task === "Meeting" ? (
																<Users
																	size={12}
																	className="mr-1 text-purple-600"
																/>
															) : (
																<Coffee
																	size={12}
																	className="mr-1 text-gray-600"
																/>
															)}
															{log.task}
														</span>
													</td>
													<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap text-gray-700">
														{log.startTime} - {log.endTime}
													</td>
													<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap text-gray-700">
														{formatTimeDisplay(log.duration)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}

							{selectedEmployee.timeLogs.length > 10 && (
								<div className="flex justify-center mt-3 sm:mt-4">
									<button
										onClick={() =>
											showModal(
												"Time Logs",
												"You'll be able to view all time logs and generate detailed reports in the next update. Stay tuned for more productivity insights!",
												"info"
											)
										}
										className="text-xs sm:text-sm text-blue-700 hover:text-blue-800 font-medium cursor-pointer"
									>
										View all time logs
									</button>
								</div>
							)}
						</div>
					</div>
				)}

				{viewMode === "leaderboard" && (
					<div className="space-y-4 sm:space-y-6">
						<div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl">
							<h3 className="text-sm sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-3 sm:mb-6">
								Team Leaderboard
							</h3>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
								{filteredEmployees.slice(0, 3).map((emp, index) => (
									<div
										key={emp.id}
										className={`flex flex-col items-center p-3 sm:p-6 rounded-xl transition-all duration-300 transform hover:scale-105 relative cursor-pointer
                      ${
												index === 0
													? "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-md"
													: index === 1
													? "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm"
													: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm"
											}`}
										onClick={() => {
											setSelectedEmployee(emp);
											setViewMode("productivity");
											showToast(`Selected ${emp.name}`, "info");
										}}
									>
										<div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-white opacity-30"></div>
										<div className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-white opacity-30"></div>
										<div className="absolute top-1/4 -right-2 h-4 w-1 rounded-l-full bg-white opacity-40"></div>
										<div className="absolute bottom-1/4 -left-2 h-4 w-1 rounded-r-full bg-white opacity-40"></div>

										<div
											className={`h-10 w-10 sm:h-16 sm:w-16 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold mb-2 sm:mb-3 shadow-lg relative overflow-hidden ${
												index === 0
													? "bg-gradient-to-br from-amber-500 to-amber-600"
													: index === 1
													? "bg-gradient-to-br from-gray-500 to-gray-600"
													: "bg-gradient-to-br from-orange-500 to-orange-600"
											}`}
										>
											{index + 1}
										</div>
										<div className="relative mb-1 sm:mb-2">
											<div className="h-10 w-10 sm:h-16 sm:w-16 rounded-full overflow-hidden border-2 border-white shadow-md">
												<img
													src={emp.avatar}
													alt={emp.name}
													className="h-full w-full object-cover"
												/>
											</div>
											{index === 0 && (
												<div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center bg-amber-500 text-white shadow-md">
													<Award size={12} />
												</div>
											)}
										</div>
										<h4 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 text-center text-xs sm:text-sm">
											{emp.name}
										</h4>
										<p className="text-xs text-gray-600 mb-2 sm:mb-3">
											{emp.role}
										</p>
										<div className="flex items-center space-x-1 sm:space-x-2">
											<div className="flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
												<CheckCircle
													size={10}
													className="mr-1 text-green-600"
												/>
												{emp.completedTasks}
											</div>
											<div className="flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
												<Activity size={10} className="mr-1 text-blue-600" />
												{emp.productivity}%
											</div>
										</div>
									</div>
								))}
							</div>

							<div className="overflow-x-auto custom-scrollbar -mx-3 px-3">
								<table className="min-w-full divide-y divide-blue-100 text-xs sm:text-sm">
									<thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
										<tr>
											<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider rounded-tl-lg w-10">
												Rank
											</th>
											<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
												Employee
											</th>
											<th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
												Department
											</th>
											<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
												Tasks
											</th>
											<th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider rounded-tr-lg sm:rounded-none">
												Productivity
											</th>
											<th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider rounded-tr-lg">
												Consistency
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-blue-50">
										{filteredEmployees.slice(3).map((emp, index) => (
											<tr
												key={emp.id}
												className="hover:bg-blue-50 transition-colors cursor-pointer group"
												onClick={() => {
													setSelectedEmployee(emp);
													setViewMode("productivity");
													showToast(`Selected ${emp.name}`, "info");
												}}
											>
												<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap">
													<div className="flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-xs font-medium text-blue-700 shadow-sm">
														{index + 4}
													</div>
												</td>
												<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full overflow-hidden mr-2 sm:mr-3 ring-2 ring-white shadow-sm group-hover:shadow-md transition-all">
															<img
																src={emp.avatar}
																alt={emp.name}
																className="h-full w-full object-cover"
															/>
														</div>
														<div>
															<p className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
																{emp.name}
															</p>
															<p className="text-xs text-gray-600">
																{emp.role}
															</p>
														</div>
													</div>
												</td>
												<td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">
													{emp.department}
												</td>
												<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 mr-1 sm:mr-2"></div>
														<p className="text-xs sm:text-sm text-gray-800">
															{emp.completedTasks}
														</p>
													</div>
												</td>
												<td className="px-2 sm:px-3 py-2 sm:py-4 whitespace-nowrap">
													<div className="w-full h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
														<div
															className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
															style={{ width: `${emp.productivity}%` }}
														></div>
													</div>
													<p className="text-xs text-gray-700 mt-0.5 sm:mt-1">
														{emp.productivity}%
													</p>
												</td>
												<td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap">
													<div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
														<div
															className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
															style={{ width: `${emp.consistency}%` }}
														></div>
													</div>
													<p className="text-xs text-gray-700 mt-1">
														{emp.consistency}%
													</p>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
			</main>

			<footer className="bg-white bg-opacity-95 backdrop-blur-lg border-t border-blue-100 mt-6 sm:mt-8">
				<div className="container mx-auto px-4 py-8 sm:py-12">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="space-y-4">
							<div className="flex items-center">
								<AppLogo />
								<h3 className="text-lg font-bold text-gray-800 ml-3">
									ProductivityTracker
								</h3>
							</div>
							<p className="text-sm text-gray-600 mt-2 leading-relaxed">
								Boost your team's productivity with our powerful tracking tools.
								Monitor performance, manage habits, and optimize time management
								all in one place.
							</p>
							<div className="flex space-x-4 mt-4">
								<a
									href="#"
									className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors cursor-pointer"
								>
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
									</svg>
								</a>
								<a
									href="#"
									className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors cursor-pointer"
								>
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
									</svg>
								</a>
								<a
									href="#"
									className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors cursor-pointer"
								>
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
									</svg>
								</a>
								<a
									href="#"
									className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white hover:from-purple-700 hover:to-orange-500 transition-colors cursor-pointer"
								>
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
									</svg>
								</a>
							</div>
						</div>

						<div>
							<h4 className="text-md font-semibold text-gray-800 mb-4 border-b border-blue-100 pb-2">
								Quick Links
							</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										Dashboard
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										Habit Tracker
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										Time Management
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										Team Leaderboard
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										Reports & Analytics
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										Integrations
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-md font-semibold text-gray-800 mb-4 border-b border-blue-100 pb-2">
								Resources
							</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											showModal(
												"Help & Support",
												"Our customer support team is available 24/7 to assist you with any questions or issues. In the next update, you'll be able to access our comprehensive knowledge base, tutorials, and live chat support directly from this page.",
												"info"
											);
										}}
										className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										Help & Support
									</a>
								</li>
								<li>
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											showModal(
												"Knowledge Base",
												"Our knowledge base contains detailed articles, guides, and tutorials on how to use ProductivityTracker effectively. We'll be adding more resources regularly.",
												"info"
											);
										}}
										className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										Knowledge Base
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										Case Studies
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors"
									>
										API Documentation
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-md font-semibold text-gray-800 mb-4 border-b border-blue-100 pb-2">
								Stay Updated
							</h4>
							<p className="text-sm text-gray-600 mb-3">
								Subscribe to our newsletter for tips, updates, and productivity
								insights.
							</p>
							<div className="flex">
								<input
									type="email"
									placeholder="Your email"
									className="px-3 py-2 bg-white text-gray-800 border border-blue-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-grow"
								/>
								<button
									onClick={() =>
										showToast("Thanks for subscribing!", "success")
									}
									className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-r-md hover:shadow-md transition-all text-sm"
								>
									Subscribe
								</button>
							</div>
							<p className="text-xs text-gray-500 mt-2">
								We respect your privacy. Unsubscribe at any time.
							</p>
						</div>
					</div>
				</div>

				<div className="bg-gray-50 py-4 border-t border-blue-100">
					<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
						<p className="text-xs text-gray-600 mb-2 md:mb-0">
							&copy; 2025 ProductivityTracker. All rights reserved.
						</p>
						<div className="flex space-x-4 text-xs">
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									showModal(
										"Privacy Policy",
										"We take your privacy seriously. Your data is encrypted and securely stored. We do not sell or share your personal information with third parties. For detailed information about how we handle your data, please visit our website.",
										"info"
									);
								}}
								className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									showModal(
										"Terms of Service",
										"By using ProductivityTracker, you agree to our terms of service. These terms outline your rights and responsibilities as a user, as well as our obligations to you. For the complete terms of service, please visit our website.",
										"info"
									);
								}}
								className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-blue-600 transition-colors"
							>
								Cookies
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-blue-600 transition-colors"
							>
								Sitemap
							</a>
						</div>
					</div>
				</div>
			</footer>

			<div className="fixed bottom-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`flex items-center justify-between p-2 sm:p-4 rounded-lg shadow-lg max-w-xs bg-white bg-opacity-95 backdrop-blur-md border transform transition-all duration-300 ease-out animate-slideIn ${
							toast.type === "success"
								? "border-green-300"
								: toast.type === "error"
								? "border-red-300"
								: toast.type === "warning"
								? "border-amber-300"
								: "border-blue-300"
						}`}
					>
						<div className="flex items-center">
							<div
								className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
									toast.type === "success"
										? "bg-green-100 text-green-600"
										: toast.type === "error"
										? "bg-red-100 text-red-600"
										: toast.type === "warning"
										? "bg-amber-100 text-amber-600"
										: "bg-blue-100 text-blue-600"
								}`}
							>
								{toast.type === "success" ? (
									<CheckCircle size={14} />
								) : toast.type === "error" ? (
									<X size={14} />
								) : toast.type === "warning" ? (
									<AlertTriangle size={14} />
								) : (
									<Info size={14} />
								)}
							</div>
							<p className="text-xs sm:text-sm text-gray-800">
								{toast.message}
							</p>
						</div>
						<button
							onClick={() => removeToast(toast.id)}
							className="ml-2 sm:ml-4 text-gray-500 hover:text-gray-700 cursor-pointer"
						>
							<X size={14} />
						</button>
					</div>
				))}
			</div>

			{modal.isOpen && (
				<div
					className="fixed inset-0 z-50 overflow-y-auto"
					aria-labelledby="modal-title"
					role="dialog"
					aria-modal="true"
				>
					<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
							aria-hidden="true"
							onClick={modal.onClose}
						></div>

						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>

						<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div className="sm:flex sm:items-start">
									<div
										className={`mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full sm:mx-0 sm:mr-4 ${
											modal.type === "success"
												? "bg-green-100"
												: modal.type === "error"
												? "bg-red-100"
												: modal.type === "warning"
												? "bg-amber-100"
												: "bg-blue-100"
										}`}
									>
										{modal.type === "success" ? (
											<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
										) : modal.type === "error" ? (
											<X className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
										) : modal.type === "warning" ? (
											<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
										) : (
											<Info className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
										)}
									</div>
									<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3
											className="text-sm sm:text-lg font-medium text-gray-900"
											id="modal-title"
										>
											{modal.title}
										</h3>
										<div className="mt-2">
											<p className="text-xs sm:text-sm text-gray-600">
												{modal.message}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-medium text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
									onClick={modal.onClose}
								>
									Got it
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<style jsx global>{`
				@keyframes pulse-slow {
					0%,
					100% {
						opacity: 0.3;
					}
					50% {
						opacity: 0.8;
					}
				}

				@keyframes slideIn {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}

				.animate-pulse-slow {
					animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
				}

				.animate-slideIn {
					animation: slideIn 0.3s ease-out forwards;
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 4px;
					height: 4px;
				}

				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(237, 242, 247, 0.5);
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(59, 130, 246, 0.4);
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(59, 130, 246, 0.6);
				}

				@media (max-width: 320px) {
					.custom-scrollbar::-webkit-scrollbar {
						width: 3px;
						height: 3px;
					}

					.container {
						padding-left: 0.5rem;
						padding-right: 0.5rem;
					}

					h3 {
						font-size: 0.875rem !important;
					}
					button,
					a {
						cursor: pointer;
					}

					p,
					button,
					select,
					input {
						font-size: 0.75rem !important;
					}
				}
			`}</style>
		</div>
	);
};

export default ProductivityTracker;
