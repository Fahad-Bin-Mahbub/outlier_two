"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
	Bell,
	Calendar,
	CheckCircle,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	Edit,
	Home,
	LogOut,
	Menu,
	MoreHorizontal,
	Plus,
	Search,
	Settings,
	Trash2,
	User,
	X,
} from "lucide-react";

interface Task {
	id: string;
	title: string;
	description: string;
	dueDate: Date;
	priority: "low" | "medium" | "high";
	completed: boolean;
	projectId: string;
	assignedTo?: string;
}

interface Project {
	id: string;
	name: string;
	description: string;
	color: string;
}

interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
}

interface Reminder {
	id: string;
	taskId: string;
	time: Date;
	triggered: boolean;
}

const sampleUsers: User[] = [
	{
		id: "user1",
		name: "Alex Johnson",
		email: "alex@example.com",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
	},
	{
		id: "user2",
		name: "Jamie Smith",
		email: "jamie@example.com",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
	},
	{
		id: "user3",
		name: "Taylor Wong",
		email: "taylor@example.com",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
	},
];

const sampleProjects: Project[] = [
	{
		id: "project1",
		name: "Website Redesign",
		description: "Redesigning the company website with modern UI",
		color: "#3B82F6",
	},
	{
		id: "project2",
		name: "Marketing Campaign",
		description: "Q2 marketing campaign for new product line",
		color: "#10B981",
	},
	{
		id: "project3",
		name: "Product Launch",
		description: "Launch preparation for new flagship product",
		color: "#F97316",
	},
];

const sampleTasks: Task[] = [
	{
		id: "task1",
		title: "Design new homepage",
		description: "Create wireframes and mockups for the new homepage",
		dueDate: new Date(2025, 4, 12),
		priority: "high",
		completed: false,
		projectId: "project1",
		assignedTo: "user1",
	},
	{
		id: "task2",
		title: "Develop navigation component",
		description: "Implement responsive navigation bar with dropdown menus",
		dueDate: new Date(2025, 4, 15),
		priority: "medium",
		completed: false,
		projectId: "project1",
		assignedTo: "user2",
	},
	{
		id: "task3",
		title: "Create social media content",
		description: "Design and schedule posts for Instagram and LinkedIn",
		dueDate: new Date(2025, 4, 10),
		priority: "medium",
		completed: true,
		projectId: "project2",
		assignedTo: "user3",
	},
	{
		id: "task4",
		title: "Prepare press release",
		description: "Write and review press release for product launch",
		dueDate: new Date(2025, 4, 20),
		priority: "high",
		completed: false,
		projectId: "project3",
		assignedTo: "user1",
	},
	{
		id: "task5",
		title: "User testing",
		description: "Conduct user testing sessions for new features",
		dueDate: new Date(2025, 4, 9),
		priority: "low",
		completed: false,
		projectId: "project1",
		assignedTo: "user3",
	},
];

const sampleReminders: Reminder[] = [
	{
		id: "reminder1",
		taskId: "task1",
		time: new Date(2025, 4, 11, 10, 0),
		triggered: false,
	},
	{
		id: "reminder2",
		taskId: "task4",
		time: new Date(2025, 4, 19, 14, 0),
		triggered: false,
	},
];

const TaskFlow: React.FC = () => {
	const [currentUser, setCurrentUser] = useState<User>(sampleUsers[0]);
	const [projects, setProjects] = useState<Project[]>(sampleProjects);
	const [tasks, setTasks] = useState<Task[]>(sampleTasks);
	const [reminders, setReminders] = useState<Reminder[]>(sampleReminders);
	const [users] = useState<User[]>(sampleUsers);

	const [activeView, setActiveView] = useState<
		"dashboard" | "calendar" | "projects" | "settings"
	>("dashboard");
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [showNewTaskModal, setShowNewTaskModal] = useState(false);
	const [showNewProjectModal, setShowNewProjectModal] = useState(false);
	const [showTaskDetailModal, setShowTaskDetailModal] = useState<string | null>(
		null
	);
	const [showToast, setShowToast] = useState<{
		message: string;
		type: "success" | "error" | "info";
	} | null>(null);
	const [calendarDate, setCalendarDate] = useState(new Date());
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [newTask, setNewTask] = useState<Partial<Task>>({
		title: "",
		description: "",
		dueDate: new Date(),
		priority: "medium",
		completed: false,
		projectId: sampleProjects[0]?.id || "",
	});
	const [newProject, setNewProject] = useState<Partial<Project>>({
		name: "",
		description: "",
		color: "#3B82F6",
	});
	const [searchQuery, setSearchQuery] = useState("");

	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen((prev) => !prev);
	}, []);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(e.target.value);
		},
		[]
	);

	const handleNewTaskChange = useCallback((field: string, value: any) => {
		setNewTask((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleNewProjectChange = useCallback((field: string, value: any) => {
		setNewProject((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleEditingTaskChange = useCallback((field: string, value: any) => {
		setEditingTask((prev) => (prev ? { ...prev, [field]: value } : null));
	}, []);

	const addTask = useCallback(() => {
		if (!newTask.title) {
			setShowToast({
				message: "Please enter a task title",
				type: "error",
			});
			return;
		}

		const task: Task = {
			id: `task${tasks.length + 1}`,
			title: newTask.title,
			description: newTask.description || "",
			dueDate: newTask.dueDate || new Date(),
			priority: newTask.priority as "low" | "medium" | "high",
			completed: false,
			projectId: newTask.projectId || projects[0].id,
			assignedTo: newTask.assignedTo,
		};

		setTasks((prevTasks) => [...prevTasks, task]);
		setShowNewTaskModal(false);
		setNewTask({
			title: "",
			description: "",
			dueDate: new Date(),
			priority: "medium",
			completed: false,
			projectId: projects[0].id,
		});

		setShowToast({
			message: "Task added successfully",
			type: "success",
		});
	}, [newTask, projects, tasks.length]);

	const updateTask = useCallback((task: Task) => {
		setTasks((prevTasks) =>
			prevTasks.map((t) => (t.id === task.id ? task : t))
		);

		setShowTaskDetailModal(null);
		setEditingTask(null);

		setShowToast({
			message: "Task updated successfully",
			type: "success",
		});
	}, []);

	const deleteTask = useCallback((taskId: string) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
		setShowTaskDetailModal(null);
		setEditingTask(null);

		setReminders((prevReminders) =>
			prevReminders.filter((reminder) => reminder.taskId !== taskId)
		);

		setShowToast({
			message: "Task deleted successfully",
			type: "success",
		});
	}, []);

	const toggleTaskCompletion = useCallback(
		(taskId: string, e?: React.MouseEvent) => {
			if (e) {
				e.stopPropagation();
			}

			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, completed: !task.completed } : task
				)
			);
		},
		[]
	);

	const addProject = useCallback(() => {
		if (!newProject.name) {
			setShowToast({
				message: "Please enter a project name",
				type: "error",
			});
			return;
		}

		const project: Project = {
			id: `project${projects.length + 1}`,
			name: newProject.name,
			description: newProject.description || "",
			color: newProject.color || "#3B82F6",
		};

		setProjects((prevProjects) => [...prevProjects, project]);
		setShowNewProjectModal(false);
		setNewProject({
			name: "",
			description: "",
			color: "#3B82F6",
		});

		setShowToast({
			message: "Project added successfully",
			type: "success",
		});
	}, [newProject, projects.length]);

	const deleteProject = useCallback(
		(projectId: string) => {
			setProjects((prevProjects) =>
				prevProjects.filter((project) => project.id !== projectId)
			);

			const tasksToDelete = tasks.filter(
				(task) => task.projectId === projectId
			);
			setTasks((prevTasks) =>
				prevTasks.filter((task) => task.projectId !== projectId)
			);

			const taskIds = tasksToDelete.map((task) => task.id);
			setReminders((prevReminders) =>
				prevReminders.filter((reminder) => !taskIds.includes(reminder.taskId))
			);

			setSelectedProject(null);

			setShowToast({
				message: "Project deleted successfully",
				type: "success",
			});
		},
		[tasks]
	);

	const prevMonth = useCallback(() => {
		setCalendarDate(
			(prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
		);
	}, []);

	const nextMonth = useCallback(() => {
		setCalendarDate(
			(prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
		);
	}, []);

	const addReminder = useCallback(
		(taskId: string, time: Date) => {
			const newReminder: Reminder = {
				id: `reminder${reminders.length + 1}`,
				taskId,
				time,
				triggered: false,
			};

			setReminders((prev) => [...prev, newReminder]);

			setShowToast({
				message: "Reminder set successfully",
				type: "success",
			});
		},
		[reminders.length]
	);

	const deleteReminder = useCallback((reminderId: string) => {
		setReminders((prevReminders) =>
			prevReminders.filter((reminder) => reminder.id !== reminderId)
		);

		setShowToast({
			message: "Reminder deleted successfully",
			type: "success",
		});
	}, []);

	const setView = useCallback(
		(
			view: "dashboard" | "calendar" | "projects" | "settings",
			projectId?: string
		) => {
			setActiveView(view);
			setSelectedProject(projectId || null);
		},
		[]
	);

	const openTaskDetailModal = useCallback(
		(taskId: string, e?: React.MouseEvent) => {
			if (e) {
				e.stopPropagation();
			}
			setShowTaskDetailModal(taskId);
		},
		[]
	);

	const closeTaskDetailModal = useCallback(() => {
		setShowTaskDetailModal(null);
		setEditingTask(null);
	}, []);

	useEffect(() => {
		const checkReminders = () => {
			const now = new Date();
			const overdueReminders = reminders.filter(
				(reminder) => !reminder.triggered && new Date(reminder.time) <= now
			);

			if (overdueReminders.length > 0) {
				const reminderTasks = overdueReminders.map((reminder) => {
					const task = tasks.find((t) => t.id === reminder.taskId);
					return task?.title || "Unknown task";
				});

				setShowToast({
					message: `Reminder: ${reminderTasks.join(", ")} ${
						reminderTasks.length > 1 ? "are" : "is"
					} due soon!`,
					type: "info",
				});

				setReminders((prevReminders) =>
					prevReminders.map((reminder) =>
						overdueReminders.some((r) => r.id === reminder.id)
							? { ...reminder, triggered: true }
							: reminder
					)
				);
			}
		};

		checkReminders();

		const interval = setInterval(checkReminders, 60000);

		return () => clearInterval(interval);
	}, [reminders, tasks]);

	const formatDate = useCallback((date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}, []);

	const getPriorityColor = useCallback(
		(priority: "low" | "medium" | "high") => {
			switch (priority) {
				case "low":
					return "bg-blue-100 text-blue-800";
				case "medium":
					return "bg-yellow-100 text-yellow-800";
				case "high":
					return "bg-red-100 text-red-800";
				default:
					return "bg-gray-100 text-gray-800";
			}
		},
		[]
	);

	const getProjectById = useCallback(
		(id: string) => {
			return projects.find((project) => project.id === id);
		},
		[projects]
	);

	const getUserById = useCallback(
		(id?: string) => {
			if (!id) return null;
			return users.find((user) => user.id === id);
		},
		[users]
	);

	const isTaskOverdue = useCallback((dueDate: Date) => {
		return (
			new Date(dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
		);
	}, []);

	const getFilteredTasks = useCallback(() => {
		let filtered = [...tasks];

		if (selectedProject) {
			filtered = filtered.filter((task) => task.projectId === selectedProject);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(task) =>
					task.title.toLowerCase().includes(query) ||
					task.description.toLowerCase().includes(query)
			);
		}

		return filtered;
	}, [tasks, selectedProject, searchQuery]);

	const getDaysInMonth = useCallback((year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate();
	}, []);

	const getMonthName = useCallback((date: Date) => {
		return date.toLocaleString("default", { month: "long" });
	}, []);

	const getTasksForDate = useCallback(
		(date: Date) => {
			const day = date.getDate();
			const month = date.getMonth();
			const year = date.getFullYear();

			return tasks.filter((task) => {
				const taskDate = new Date(task.dueDate);
				return (
					taskDate.getDate() === day &&
					taskDate.getMonth() === month &&
					taskDate.getFullYear() === year
				);
			});
		},
		[tasks]
	);

	const Toast = useMemo(() => {
		if (!showToast) return null;

		const bgColor =
			showToast.type === "success"
				? "bg-green-100 border-green-500 text-green-800"
				: showToast.type === "error"
				? "bg-red-100 border-red-500 text-red-800"
				: "bg-blue-100 border-blue-500 text-blue-800";

		return (
			<div
				className={`fixed bottom-4 right-4 p-4 rounded shadow-lg border-l-4 ${bgColor} max-w-md z-50 animate-fade-in-up`}
			>
				<div className="flex justify-between items-center">
					<p>{showToast.message}</p>
					<button
						className="ml-4 text-gray-600 hover:text-gray-800 focus:outline-none"
						onClick={() => setShowToast(null)}
					>
						<X size={16} />
					</button>
				</div>
			</div>
		);
	}, [showToast]);

	const Header = useMemo(() => {
		return (
			<header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
				<div className="flex items-center">
					<button
						className="mr-4 lg:hidden focus:outline-none"
						onClick={toggleSidebar}
					>
						<Menu size={24} />
					</button>
					<div className="flex items-center">
						<div className="mr-2 h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
							<CheckCircle className="text-white" size={18} />
						</div>
						<h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
					</div>
				</div>

				<div className="relative w-full max-w-md hidden md:block mx-8">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search size={18} className="text-gray-400" />
					</div>
					<input
						type="text"
						placeholder="Search tasks..."
						className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</div>

				<div className="flex items-center">
					<button
						className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 mx-1 cursor-pointer focus:outline-none"
						onClick={() => {
							setShowToast({
								message: "Notifications feature coming soon!",
								type: "info",
							});
						}}
					>
						<Bell size={20} />
					</button>

					<div className="relative ml-3">
						<div className="flex items-center">
							<img
								src={currentUser.avatar}
								alt={currentUser.name}
								className="h-8 w-8 rounded-full object-cover"
							/>
							<span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
								{currentUser.name}
							</span>
						</div>
					</div>
				</div>
			</header>
		);
	}, [currentUser, searchQuery, toggleSidebar, handleSearchChange]);

	const Sidebar = useMemo(() => {
		return (
			<aside
				className={`bg-indigo-900 text-white w-64 fixed top-0 bottom-0 left-0 overflow-y-auto transition-transform duration-300 ease-in-out z-30 transform ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} lg:translate-x-0`}
			>
				<div className="p-6">
					<div className="flex items-center mb-8">
						<div className="mr-2 h-8 w-8 bg-white rounded-lg flex items-center justify-center">
							<CheckCircle className="text-indigo-600" size={18} />
						</div>
						<h2 className="text-xl font-bold">TaskFlow</h2>
					</div>

					<nav className="space-y-1">
						<button
							className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
								activeView === "dashboard"
									? "bg-indigo-800"
									: "hover:bg-indigo-800"
							}`}
							onClick={() => setView("dashboard")}
						>
							<Home size={20} className="mr-3" />
							<span>Dashboard</span>
						</button>

						<button
							className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
								activeView === "calendar"
									? "bg-indigo-800"
									: "hover:bg-indigo-800"
							}`}
							onClick={() => setView("calendar")}
						>
							<Calendar size={20} className="mr-3" />
							<span>Calendar</span>
						</button>

						<div className="pt-4 mt-4 border-t border-indigo-800">
							<div className="flex items-center justify-between px-4 mb-2">
								<h3 className="text-sm font-medium text-indigo-300">
									PROJECTS
								</h3>
								<button
									className="p-1 rounded-full hover:bg-indigo-800 focus:outline-none cursor-pointer"
									onClick={() => setShowNewProjectModal(true)}
								>
									<Plus size={16} className="text-indigo-300" />
								</button>
							</div>

							<div className="space-y-1">
								{projects.map((project) => (
									<button
										key={project.id}
										className={`flex items-center w-full px-4 py-2 rounded-lg text-left transition-colors ${
											activeView === "projects" &&
											selectedProject === project.id
												? "bg-indigo-800"
												: "hover:bg-indigo-800"
										}`}
										onClick={() => setView("projects", project.id)}
									>
										<div
											className="w-3 h-3 rounded-full mr-3"
											style={{ backgroundColor: project.color }}
										></div>
										<span className="truncate">{project.name}</span>
									</button>
								))}
							</div>
						</div>

						<div className="pt-4 mt-4 border-t border-indigo-800">
							<button
								className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
									activeView === "settings"
										? "bg-indigo-800"
										: "hover:bg-indigo-800"
								}`}
								onClick={() => setView("settings")}
							>
								<Settings size={20} className="mr-3" />
								<span>Settings</span>
							</button>

							<button
								className="flex items-center w-full px-4 py-3 rounded-lg text-left text-indigo-300 hover:bg-indigo-800 transition-colors mt-2"
								onClick={() => {
									setShowToast({
										message: "Logout functionality coming soon!",
										type: "info",
									});
								}}
							>
								<LogOut size={20} className="mr-3" />
								<span>Logout</span>
							</button>
						</div>
					</nav>
				</div>

				<div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-700 rounded-full opacity-20"></div>
				<div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-500 rounded-full opacity-20"></div>
			</aside>
		);
	}, [isSidebarOpen, activeView, selectedProject, projects, setView]);

	const Dashboard = useMemo(() => {
		const today = new Date();
		const upcomingTasks = tasks
			.filter((task) => !task.completed && new Date(task.dueDate) >= today)
			.sort(
				(a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
			)
			.slice(0, 5);

		const overdueTasks = tasks
			.filter((task) => !task.completed && isTaskOverdue(task.dueDate))
			.sort(
				(a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
			);

		const completedToday = tasks.filter(
			(task) =>
				task.completed &&
				new Date(task.dueDate).toDateString() === today.toDateString()
		).length;

		const totalActive = tasks.filter((task) => !task.completed).length;

		return (
			<div className="p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
						<p className="text-gray-600">Welcome back, {currentUser.name}!</p>
					</div>

					<button
						className="mt-4 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
						onClick={() => setShowNewTaskModal(true)}
					>
						<Plus size={20} className="mr-2" />
						New Task
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded-xl shadow p-6 border border-gray-100">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-medium text-gray-900">
								Tasks Due Today
							</h3>
							<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
								<Calendar size={20} className="text-blue-600" />
							</div>
						</div>
						<p className="text-3xl font-bold text-gray-900">
							{
								tasks.filter(
									(task) =>
										new Date(task.dueDate).toDateString() ===
										today.toDateString()
								).length
							}
						</p>
					</div>

					<div className="bg-white rounded-xl shadow p-6 border border-gray-100">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-medium text-gray-900">
								Completed Today
							</h3>
							<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle size={20} className="text-green-600" />
							</div>
						</div>
						<p className="text-3xl font-bold text-gray-900">{completedToday}</p>
					</div>

					<div className="bg-white rounded-xl shadow p-6 border border-gray-100">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-medium text-gray-900">
								Active Tasks
							</h3>
							<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
								<Clock size={20} className="text-purple-600" />
							</div>
						</div>
						<p className="text-3xl font-bold text-gray-900">{totalActive}</p>
					</div>
				</div>

				{overdueTasks.length > 0 && (
					<div className="mb-8">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Overdue Tasks
						</h3>
						<div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
							{overdueTasks.map((task) => (
								<div
									key={task.id}
									className="p-4 border-b border-red-200 last:border-0 hover:bg-red-100 transition-colors flex items-center cursor-pointer"
									onClick={() => openTaskDetailModal(task.id)}
								>
									<div
										className="w-3 h-3 rounded-full mr-3"
										style={{
											backgroundColor: getProjectById(task.projectId)?.color,
										}}
									></div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{task.title}
										</p>
										<p className="text-xs text-gray-600 truncate">
											{getProjectById(task.projectId)?.name} • Due{" "}
											{formatDate(task.dueDate)}
										</p>
									</div>
									<div className="flex items-center">
										<span
											className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
												task.priority
											)}`}
										>
											{task.priority}
										</span>
										{task.assignedTo && (
											<img
												src={getUserById(task.assignedTo)?.avatar}
												alt={getUserById(task.assignedTo)?.name}
												className="w-6 h-6 rounded-full ml-2 border border-white"
											/>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Upcoming Tasks
					</h3>
					<div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow">
						{upcomingTasks.length > 0 ? (
							upcomingTasks.map((task) => (
								<div
									key={task.id}
									className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
									onClick={() => openTaskDetailModal(task.id)}
								>
									<div className="mr-3">
										<button
											className={`w-6 h-6 rounded-full border ${
												task.completed
													? "bg-green-500 border-green-500"
													: "border-gray-400"
											} flex items-center justify-center focus:outline-none`}
											onClick={(e) => toggleTaskCompletion(task.id, e)}
										>
											{task.completed && (
												<CheckCircle size={14} className="text-white" />
											)}
										</button>
									</div>
									<div className="flex-1 min-w-0">
										<p
											className={`text-sm font-medium ${
												task.completed
													? "text-gray-500 line-through"
													: "text-gray-900"
											} truncate`}
										>
											{task.title}
										</p>
										<p className="text-xs text-gray-600 truncate">
											{getProjectById(task.projectId)?.name} • Due{" "}
											{formatDate(task.dueDate)}
										</p>
									</div>
									<div className="flex items-center">
										<span
											className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
												task.priority
											)}`}
										>
											{task.priority}
										</span>
										{task.assignedTo && (
											<img
												src={getUserById(task.assignedTo)?.avatar}
												alt={getUserById(task.assignedTo)?.name}
												className="w-6 h-6 rounded-full ml-2 border border-white"
											/>
										)}
									</div>
								</div>
							))
						) : (
							<div className="p-4 text-center text-gray-500">
								No upcoming tasks. Click "New Task" to add one!
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}, [
		tasks,
		currentUser.name,
		getProjectById,
		getUserById,
		formatDate,
		getPriorityColor,
		isTaskOverdue,
		openTaskDetailModal,
		toggleTaskCompletion,
	]);

	const ProjectView = useMemo(() => {
		const project = projects.find((p) => p.id === selectedProject);
		if (!project) return null;

		const projectTasks = tasks.filter((task) => task.projectId === project.id);
		const completedTasks = projectTasks.filter((task) => task.completed);
		const progress =
			projectTasks.length > 0
				? Math.round((completedTasks.length / projectTasks.length) * 100)
				: 0;

		const filteredTasks = projectTasks.filter((task) => {
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				return (
					task.title.toLowerCase().includes(query) ||
					task.description.toLowerCase().includes(query)
				);
			}
			return true;
		});

		return (
			<div className="p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
					<div className="flex items-center">
						<div
							className="w-4 h-4 rounded-full mr-3"
							style={{ backgroundColor: project.color }}
						></div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{project.name}
							</h2>
							<p className="text-gray-600">{project.description}</p>
						</div>
					</div>

					<div className="flex mt-4 md:mt-0">
						<button
							className="bg-red-100 text-red-600 px-3 py-1 rounded-lg mr-2 hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer text-sm"
							onClick={() => deleteProject(project.id)}
						>
							Delete Project
						</button>
						<button
							className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
							onClick={() => setShowNewTaskModal(true)}
						>
							<Plus size={20} className="mr-2" />
							Add Task
						</button>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-8">
					<h3 className="text-lg font-medium text-gray-900 mb-3">Progress</h3>
					<div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
						<div
							className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<div className="flex justify-between text-sm text-gray-600">
						<p>
							{completedTasks.length} of {projectTasks.length} tasks completed
						</p>
						<p>{progress}%</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Active Tasks
						</h3>
						<div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow">
							{filteredTasks.filter((task) => !task.completed).length > 0 ? (
								filteredTasks
									.filter((task) => !task.completed)
									.sort(
										(a, b) =>
											new Date(a.dueDate).getTime() -
											new Date(b.dueDate).getTime()
									)
									.map((task) => (
										<div
											key={task.id}
											className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
											onClick={() => openTaskDetailModal(task.id)}
										>
											<div className="mr-3">
												<button
													className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center focus:outline-none cursor-pointer"
													onClick={(e) => toggleTaskCompletion(task.id, e)}
												>
													{task.completed && (
														<CheckCircle size={14} className="text-green-500" />
													)}
												</button>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 truncate">
													{task.title}
												</p>
												<p className="text-xs text-gray-600 truncate">
													Due {formatDate(task.dueDate)}
												</p>
											</div>
											<div className="flex items-center">
												<span
													className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
														task.priority
													)}`}
												>
													{task.priority}
												</span>
												{task.assignedTo && (
													<img
														src={getUserById(task.assignedTo)?.avatar}
														alt={getUserById(task.assignedTo)?.name}
														className="w-6 h-6 rounded-full ml-2 border border-white"
													/>
												)}
											</div>
										</div>
									))
							) : (
								<div className="p-4 text-center text-gray-500">
									No active tasks. Click "Add Task" to add one!
								</div>
							)}
						</div>
					</div>

					<div>
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Completed Tasks
						</h3>
						<div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow">
							{filteredTasks.filter((task) => task.completed).length > 0 ? (
								filteredTasks
									.filter((task) => task.completed)
									.map((task) => (
										<div
											key={task.id}
											className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
											onClick={() => openTaskDetailModal(task.id)}
										>
											<div className="mr-3">
												<button
													className="w-6 h-6 rounded-full bg-green-500 border border-green-500 flex items-center justify-center focus:outline-none cursor-pointer"
													onClick={(e) => toggleTaskCompletion(task.id, e)}
												>
													<CheckCircle size={14} className="text-white" />
												</button>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-500 line-through truncate">
													{task.title}
												</p>
												<p className="text-xs text-gray-600 truncate">
													Completed
												</p>
											</div>
											<div className="flex items-center">
												<span
													className={`text-xs px-2 py-1 rounded-full opacity-50 ${getPriorityColor(
														task.priority
													)}`}
												>
													{task.priority}
												</span>
												{task.assignedTo && (
													<img
														src={getUserById(task.assignedTo)?.avatar}
														alt={getUserById(task.assignedTo)?.name}
														className="w-6 h-6 rounded-full ml-2 border border-white opacity-50"
													/>
												)}
											</div>
										</div>
									))
							) : (
								<div className="p-4 text-center text-gray-500">
									No completed tasks yet.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}, [
		projects,
		selectedProject,
		tasks,
		searchQuery,
		formatDate,
		getPriorityColor,
		getUserById,
		deleteProject,
		openTaskDetailModal,
		toggleTaskCompletion,
	]);

	const CalendarView = useMemo(() => {
		const year = calendarDate.getFullYear();
		const month = calendarDate.getMonth();
		const daysInMonth = getDaysInMonth(year, month);
		const firstDay = new Date(year, month, 1).getDay();

		const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

		const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

		const days = [];
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}

		const calendarDays = Array(adjustedFirstDay).fill(null).concat(days);

		const today = new Date();

		return (
			<div className="p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
						<p className="text-gray-600">Manage your schedule</p>
					</div>

					<button
						className="mt-4 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
						onClick={() => setShowNewTaskModal(true)}
					>
						<Plus size={20} className="mr-2" />
						New Task
					</button>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
					<div className="flex items-center justify-between p-4 border-b border-gray-200">
						<button
							className="p-2 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
							onClick={prevMonth}
						>
							<ChevronLeft size={20} />
						</button>

						<h3 className="text-lg font-medium">
							{getMonthName(calendarDate)} {calendarDate.getFullYear()}
						</h3>

						<button
							className="p-2 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
							onClick={nextMonth}
						>
							<ChevronRight size={20} />
						</button>
					</div>

					<div className="grid grid-cols-7 gap-0">
						{dayNames.map((day) => (
							<div
								key={day}
								className="p-2 text-center text-sm font-medium text-gray-700 border-b border-gray-200"
							>
								{day}
							</div>
						))}

						{calendarDays.map((day, index) => {
							const isToday =
								day !== null &&
								today.getDate() === day &&
								today.getMonth() === month &&
								today.getFullYear() === year;

							const tasksForDay =
								day !== null ? getTasksForDate(new Date(year, month, day)) : [];

							const activeTasks = tasksForDay.filter(
								(task) => !task.completed
							).length;
							const completedTasks = tasksForDay.filter(
								(task) => task.completed
							).length;

							return (
								<div
									key={`day-${index}`}
									className={`min-h-24 p-1 border-b border-r border-gray-200 ${
										day !== null
											? "bg-white hover:bg-gray-50 cursor-pointer"
											: "bg-gray-50"
									} transition-colors`}
									onClick={() => {
										if (day !== null) {
											const date = new Date(year, month, day);
											setShowToast({
												message: `Selected ${formatDate(date)}`,
												type: "info",
											});
										}
									}}
								>
									{day !== null && (
										<>
											<div className="flex justify-between items-center">
												<span
													className={`text-sm font-medium ${
														isToday
															? "bg-indigo-600 text-white h-6 w-6 rounded-full flex items-center justify-center"
															: "text-gray-700"
													}`}
												>
													{day}
												</span>

												{tasksForDay.length > 0 && (
													<div className="flex">
														{activeTasks > 0 && (
															<span className="bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded">
																{activeTasks}
															</span>
														)}
														{completedTasks > 0 && (
															<span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded ml-1">
																{completedTasks}
															</span>
														)}
													</div>
												)}
											</div>

											<div className="mt-1 space-y-1">
												{tasksForDay.slice(0, 2).map((task) => (
													<div
														key={task.id}
														className={`text-xs truncate px-1.5 py-0.5 rounded ${
															task.completed
																? "bg-green-100 text-green-800 line-through"
																: "bg-indigo-100 text-indigo-800"
														}`}
														onClick={(e) => {
															e.stopPropagation();
															openTaskDetailModal(task.id, e);
														}}
													>
														{task.title}
													</div>
												))}

												{tasksForDay.length > 2 && (
													<div className="text-xs text-gray-500 px-1.5">
														+{tasksForDay.length - 2} more
													</div>
												)}
											</div>
										</>
									)}
								</div>
							);
						})}
					</div>
				</div>

				<div className="mt-8">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Upcoming Tasks
					</h3>
					<div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow">
						{tasks
							.filter(
								(task) =>
									!task.completed && new Date(task.dueDate) >= new Date()
							)
							.sort(
								(a, b) =>
									new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
							)
							.slice(0, 5)
							.map((task) => (
								<div
									key={task.id}
									className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
									onClick={() => openTaskDetailModal(task.id)}
								>
									<div className="mr-3">
										<button
											className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center focus:outline-none cursor-pointer"
											onClick={(e) => toggleTaskCompletion(task.id, e)}
										>
											{task.completed && (
												<CheckCircle size={14} className="text-green-500" />
											)}
										</button>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{task.title}
										</p>
										<p className="text-xs text-gray-600 truncate">
											{getProjectById(task.projectId)?.name} • Due{" "}
											{formatDate(task.dueDate)}
										</p>
									</div>
									<div className="flex items-center">
										<span
											className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
												task.priority
											)}`}
										>
											{task.priority}
										</span>
										{task.assignedTo && (
											<img
												src={getUserById(task.assignedTo)?.avatar}
												alt={getUserById(task.assignedTo)?.name}
												className="w-6 h-6 rounded-full ml-2 border border-white"
											/>
										)}
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		);
	}, [
		calendarDate,
		getDaysInMonth,
		getMonthName,
		getTasksForDate,
		tasks,
		formatDate,
		getPriorityColor,
		getProjectById,
		getUserById,
		openTaskDetailModal,
		toggleTaskCompletion,
		prevMonth,
		nextMonth,
	]);

	const Setting = useMemo(() => {
		return (
			<div className="p-6">
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-1">Settings</h2>
					<p className="text-gray-600">Manage your account and preferences</p>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden mb-8">
					<div className="p-6 border-b border-gray-200">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Account Settings
						</h3>

						<div className="flex items-center mb-6">
							<img
								src={currentUser.avatar}
								alt={currentUser.name}
								className="h-16 w-16 rounded-full object-cover mr-4"
							/>
							<div>
								<p className="text-sm font-medium text-gray-900">
									{currentUser.name}
								</p>
								<p className="text-sm text-gray-600">{currentUser.email}</p>
								<button
									className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
									onClick={() => {
										setShowToast({
											message: "Profile update feature coming soon!",
											type: "info",
										});
									}}
								>
									Change profile picture
								</button>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Name
								</label>
								<input
									type="text"
									id="name"
									className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									value={currentUser.name}
									readOnly
								/>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									value={currentUser.email}
									readOnly
								/>
							</div>

							<button
								className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
								onClick={() => {
									setShowToast({
										message: "Account updated successfully!",
										type: "success",
									});
								}}
							>
								Save Changes
							</button>
						</div>
					</div>

					<div className="p-4 sm:p-6 border-b border-gray-200">
						<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
							Notification Preferences
						</h3>

						<div className="space-y-5 sm:space-y-6">
							<div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
								<div className="flex-grow pr-2">
									<p className="text-sm font-medium text-gray-900">
										Email Notifications
									</p>
									<p className="text-xs text-gray-600 mt-0.5 pr-1">
										Receive email notifications for task reminders
									</p>
								</div>
								<div className="self-start xs:self-center relative inline-flex h-6 w-11 flex-shrink-0 ml-auto xs:ml-0">
									<input
										type="checkbox"
										id="toggle-email"
										className="peer sr-only"
										defaultChecked
									/>
									<label
										htmlFor="toggle-email"
										className="absolute cursor-pointer inset-0 rounded-full bg-gray-300 transition-colors duration-300 ease-in-out peer-checked:bg-indigo-600"
										onClick={() => {
											setShowToast({
												message: "Email notification settings updated!",
												type: "success",
											});
										}}
										aria-label="Toggle email notifications"
									/>
									<span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
								</div>
							</div>

							<div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
								<div className="flex-grow pr-2">
									<p className="text-sm font-medium text-gray-900">
										Push Notifications
									</p>
									<p className="text-xs text-gray-600 mt-0.5 pr-1">
										Receive push notifications on your device
									</p>
								</div>
								<div className="self-start xs:self-center relative inline-flex h-6 w-11 flex-shrink-0 ml-auto xs:ml-0">
									<input
										type="checkbox"
										id="toggle-push"
										className="peer sr-only"
										defaultChecked
									/>
									<label
										htmlFor="toggle-push"
										className="absolute cursor-pointer inset-0 rounded-full bg-gray-300 transition-colors duration-300 ease-in-out peer-checked:bg-indigo-600"
										onClick={() => {
											setShowToast({
												message: "Push notification settings updated!",
												type: "success",
											});
										}}
										aria-label="Toggle push notifications"
									/>
									<span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
								</div>
							</div>

							<div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
								<div className="flex-grow pr-2">
									<p className="text-sm font-medium text-gray-900">
										Daily Digest
									</p>
									<p className="text-xs text-gray-600 mt-0.5 pr-1">
										Receive a daily summary of your tasks
									</p>
								</div>
								<div className="self-start xs:self-center relative inline-flex h-6 w-11 flex-shrink-0 ml-auto xs:ml-0">
									<input
										type="checkbox"
										id="toggle-digest"
										className="peer sr-only"
									/>
									<label
										htmlFor="toggle-digest"
										className="absolute cursor-pointer inset-0 rounded-full bg-gray-300 transition-colors duration-300 ease-in-out peer-checked:bg-indigo-600"
										onClick={() => {
											setShowToast({
												message: "Daily digest settings updated!",
												type: "success",
											});
										}}
										aria-label="Toggle daily digest"
									/>
									<span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
								</div>
							</div>
						</div>
					</div>

					<div className="p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Theme Settings
						</h3>

						<div className="space-y-4">
							<div>
								<p className="block text-sm font-medium text-gray-700 mb-2">
									Theme
								</p>
								<div className="flex space-x-4">
									<button
										className="h-10 w-10 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center cursor-pointer"
										onClick={() => {
											setShowToast({
												message: "Light theme applied!",
												type: "success",
											});
										}}
									>
										<div className="h-6 w-6 rounded-full bg-white border border-gray-300"></div>
									</button>

									<button
										className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center cursor-pointer"
										onClick={() => {
											setShowToast({
												message: "Dark theme coming soon!",
												type: "info",
											});
										}}
									>
										<div className="h-6 w-6 rounded-full bg-gray-800"></div>
									</button>

									<button
										className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center cursor-pointer"
										onClick={() => {
											setShowToast({
												message: "System theme coming soon!",
												type: "info",
											});
										}}
									>
										<div className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-800 to-white"></div>
									</button>
								</div>
							</div>

							<div>
								<p className="block text-sm font-medium text-gray-700 mb-2">
									Accent Color
								</p>
								<div className="flex space-x-4">
									<button
										className="h-10 w-10 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center cursor-pointer"
										onClick={() => {
											setShowToast({
												message: "Indigo accent color applied!",
												type: "success",
											});
										}}
									>
										<div className="h-6 w-6 rounded-full bg-indigo-500"></div>
									</button>

									<button
										className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center cursor-pointer"
										onClick={() => {
											setShowToast({
												message: "Purple accent color coming soon!",
												type: "info",
											});
										}}
									>
										<div className="h-6 w-6 rounded-full bg-purple-500"></div>
									</button>

									<button
										className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center cursor-pointer"
										onClick={() => {
											setShowToast({
												message: "Teal accent color coming soon!",
												type: "info",
											});
										}}
									>
										<div className="h-6 w-6 rounded-full bg-teal-500"></div>
									</button>

									<button
										className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center cursor-pointer"
										onClick={() => {
											setShowToast({
												message: "Amber accent color coming soon!",
												type: "info",
											});
										}}
									>
										<div className="h-6 w-6 rounded-full bg-yellow-500"></div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
					<div className="p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Danger Zone
						</h3>

						<div className="flex gap-3">
							<button
								className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
								onClick={() => {
									setShowToast({
										message: "Clear all data feature coming soon!",
										type: "info",
									});
								}}
							>
								Clear All Data
							</button>

							<button
								className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
								onClick={() => {
									setShowToast({
										message: "Delete account feature coming soon!",
										type: "info",
									});
								}}
							>
								Delete Account
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}, [currentUser]);

	const NewTaskModal = useMemo(() => {
		if (!showNewTaskModal) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
				<div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4 animate-slide-up">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-bold text-gray-900">New Task</h3>
						<button
							className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
							onClick={() => setShowNewTaskModal(false)}
						>
							<X size={20} />
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<label
								htmlFor="task-title"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Title *
							</label>
							<input
								type="text"
								id="task-title"
								className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								placeholder="Enter task title"
								value={newTask.title || ""}
								onChange={(e) => handleNewTaskChange("title", e.target.value)}
							/>
						</div>

						<div>
							<label
								htmlFor="task-description"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Description
							</label>
							<textarea
								id="task-description"
								className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
								placeholder="Enter task description"
								value={newTask.description || ""}
								onChange={(e) =>
									handleNewTaskChange("description", e.target.value)
								}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="task-project"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Project
								</label>
								<select
									id="task-project"
									className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									value={newTask.projectId || ""}
									onChange={(e) =>
										handleNewTaskChange("projectId", e.target.value)
									}
								>
									{projects.map((project) => (
										<option key={project.id} value={project.id}>
											{project.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label
									htmlFor="task-priority"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Priority
								</label>
								<select
									id="task-priority"
									className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									value={newTask.priority || "medium"}
									onChange={(e) =>
										handleNewTaskChange(
											"priority",
											e.target.value as "low" | "medium" | "high"
										)
									}
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="task-due-date"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Due Date
								</label>
								<input
									type="date"
									id="task-due-date"
									className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									value={
										newTask.dueDate
											? new Date(newTask.dueDate).toISOString().split("T")[0]
											: new Date().toISOString().split("T")[0]
									}
									onChange={(e) =>
										handleNewTaskChange("dueDate", new Date(e.target.value))
									}
								/>
							</div>

							<div>
								<label
									htmlFor="task-assigned-to"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Assign To
								</label>
								<select
									id="task-assigned-to"
									className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									value={newTask.assignedTo || ""}
									onChange={(e) =>
										handleNewTaskChange(
											"assignedTo",
											e.target.value || undefined
										)
									}
								>
									<option value="">Unassigned</option>
									{users.map((user) => (
										<option key={user.id} value={user.id}>
											{user.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
							<button
								className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
								onClick={() => setShowNewTaskModal(false)}
							>
								Cancel
							</button>

							<button
								className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
									newTask.title
										? "bg-indigo-600 hover:bg-indigo-700"
										: "bg-indigo-400 cursor-not-allowed"
								}`}
								onClick={addTask}
								disabled={!newTask.title}
							>
								Create Task
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}, [
		showNewTaskModal,
		newTask,
		projects,
		users,
		addTask,
		handleNewTaskChange,
	]);

	const NewProjectModal = useMemo(() => {
		if (!showNewProjectModal) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
				<div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4 animate-slide-up">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-bold text-gray-900">New Project</h3>
						<button
							className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
							onClick={() => setShowNewProjectModal(false)}
						>
							<X size={20} />
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<label
								htmlFor="project-name"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Name *
							</label>
							<input
								type="text"
								id="project-name"
								className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								placeholder="Enter project name"
								value={newProject.name || ""}
								onChange={(e) => handleNewProjectChange("name", e.target.value)}
							/>
						</div>

						<div>
							<label
								htmlFor="project-description"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Description
							</label>
							<textarea
								id="project-description"
								className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
								placeholder="Enter project description"
								value={newProject.description || ""}
								onChange={(e) =>
									handleNewProjectChange("description", e.target.value)
								}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Color
							</label>
							<div className="flex space-x-2">
								{[
									"#3B82F6",
									"#10B981",
									"#F97316",
									"#EC4899",
									"#8B5CF6",
									"#EF4444",
									"#F59E0B",
								].map((color) => (
									<button
										key={color}
										className={`w-8 h-8 rounded-full border-2 ${
											newProject.color === color
												? "border-gray-900"
												: "border-transparent"
										} cursor-pointer focus:outline-none`}
										style={{ backgroundColor: color }}
										onClick={() => handleNewProjectChange("color", color)}
									/>
								))}
							</div>
						</div>

						<div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
							<button
								className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
								onClick={() => setShowNewProjectModal(false)}
							>
								Cancel
							</button>

							<button
								className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
									newProject.name
										? "bg-indigo-600 hover:bg-indigo-700"
										: "bg-indigo-400 cursor-not-allowed"
								}`}
								onClick={addProject}
								disabled={!newProject.name}
							>
								Create Project
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}, [showNewProjectModal, newProject, addProject, handleNewProjectChange]);

	const TaskDetailModal = useMemo(() => {
		if (!showTaskDetailModal) return null;

		const task = tasks.find((t) => t.id === showTaskDetailModal);
		if (!task) return null;

		const taskReminders = reminders.filter((r) => r.taskId === task.id);

		if (editingTask) {
			return (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
					<div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4 animate-slide-up">
						<div className="flex justify-between items-center mb-4">
							<div className="flex items-center">
								<div
									className="w-3 h-3 rounded-full mr-2"
									style={{
										backgroundColor: getProjectById(editingTask.projectId)
											?.color,
									}}
								></div>
								<h3 className="text-lg font-bold text-gray-900">Edit Task</h3>
							</div>
							<button
								className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
								onClick={closeTaskDetailModal}
							>
								<X size={20} />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="edit-task-title"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Title *
								</label>
								<input
									type="text"
									id="edit-task-title"
									className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									value={editingTask.title}
									onChange={(e) =>
										handleEditingTaskChange("title", e.target.value)
									}
								/>
							</div>

							<div>
								<label
									htmlFor="edit-task-description"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Description
								</label>
								<textarea
									id="edit-task-description"
									className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
									value={editingTask.description}
									onChange={(e) =>
										handleEditingTaskChange("description", e.target.value)
									}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="edit-task-project"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Project
									</label>
									<select
										id="edit-task-project"
										className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
										value={editingTask.projectId}
										onChange={(e) =>
											handleEditingTaskChange("projectId", e.target.value)
										}
									>
										{projects.map((project) => (
											<option key={project.id} value={project.id}>
												{project.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label
										htmlFor="edit-task-priority"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Priority
									</label>
									<select
										id="edit-task-priority"
										className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
										value={editingTask.priority}
										onChange={(e) =>
											handleEditingTaskChange(
												"priority",
												e.target.value as "low" | "medium" | "high"
											)
										}
									>
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="edit-task-due-date"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Due Date
									</label>
									<input
										type="date"
										id="edit-task-due-date"
										className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
										value={
											new Date(editingTask.dueDate).toISOString().split("T")[0]
										}
										onChange={(e) =>
											handleEditingTaskChange(
												"dueDate",
												new Date(e.target.value)
											)
										}
									/>
								</div>

								<div>
									<label
										htmlFor="edit-task-assigned-to"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Assign To
									</label>
									<select
										id="edit-task-assigned-to"
										className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
										value={editingTask.assignedTo || ""}
										onChange={(e) =>
											handleEditingTaskChange(
												"assignedTo",
												e.target.value || undefined
											)
										}
									>
										<option value="">Unassigned</option>
										{users.map((user) => (
											<option key={user.id} value={user.id}>
												{user.name}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
								<button
									className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
									onClick={() => setEditingTask(null)}
								>
									Cancel
								</button>

								<button
									className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
										editingTask.title
											? "bg-indigo-600 hover:bg-indigo-700"
											: "bg-indigo-400 cursor-not-allowed"
									}`}
									onClick={() => updateTask(editingTask)}
									disabled={!editingTask.title}
								>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
				<div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4 animate-slide-up">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center">
							<div
								className="w-3 h-3 rounded-full mr-2"
								style={{
									backgroundColor: getProjectById(task.projectId)?.color,
								}}
							></div>
							<h3 className="text-lg font-bold text-gray-900">Task Details</h3>
						</div>
						<button
							className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
							onClick={closeTaskDetailModal}
						>
							<X size={20} />
						</button>
					</div>

					<div className="space-y-6">
						<div>
							<h4 className="font-medium text-gray-900 text-lg">
								{task.title}
							</h4>
							<p className="text-gray-600 mt-1">
								{task.description || "No description provided."}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-gray-500">Project</p>
								<div className="flex items-center mt-1">
									<div
										className="w-3 h-3 rounded-full mr-2"
										style={{
											backgroundColor: getProjectById(task.projectId)?.color,
										}}
									></div>
									<p className="text-gray-900 font-medium">
										{getProjectById(task.projectId)?.name}
									</p>
								</div>
							</div>

							<div>
								<p className="text-gray-500">Priority</p>
								<span
									className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getPriorityColor(
										task.priority
									)}`}
								>
									{task.priority}
								</span>
							</div>

							<div>
								<p className="text-gray-500">Due Date</p>
								<p
									className={`font-medium mt-1 ${
										isTaskOverdue(task.dueDate) && !task.completed
											? "text-red-600"
											: "text-gray-900"
									}`}
								>
									{formatDate(task.dueDate)}
								</p>
							</div>

							<div>
								<p className="text-gray-500">Status</p>
								<span
									className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
										task.completed
											? "bg-green-100 text-green-800"
											: isTaskOverdue(task.dueDate)
											? "bg-red-100 text-red-800"
											: "bg-blue-100 text-blue-800"
									}`}
								>
									{task.completed
										? "Completed"
										: isTaskOverdue(task.dueDate)
										? "Overdue"
										: "Active"}
								</span>
							</div>

							<div>
								<p className="text-gray-500">Assigned To</p>
								{task.assignedTo ? (
									<div className="flex items-center mt-1">
										<img
											src={getUserById(task.assignedTo)?.avatar}
											alt={getUserById(task.assignedTo)?.name}
											className="w-6 h-6 rounded-full mr-2 border border-white"
										/>
										<p className="text-gray-900 font-medium">
											{getUserById(task.assignedTo)?.name}
										</p>
									</div>
								) : (
									<p className="text-gray-900 font-medium mt-1">Unassigned</p>
								)}
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between mb-2">
								<p className="text-gray-500 text-sm">Reminders</p>
								<button
									className="text-indigo-600 text-sm hover:text-indigo-800 focus:outline-none cursor-pointer"
									onClick={() => {
										const dueDate = new Date(task.dueDate);
										const reminderDate = new Date(dueDate);
										reminderDate.setDate(reminderDate.getDate() - 1);
										reminderDate.setHours(9, 0, 0, 0);

										addReminder(task.id, reminderDate);
									}}
								>
									Add Reminder
								</button>
							</div>

							{taskReminders.length > 0 ? (
								<div className="bg-gray-50 rounded-lg p-2 space-y-2">
									{taskReminders.map((reminder) => (
										<div
											key={reminder.id}
											className="flex items-center justify-between text-sm"
										>
											<div className="flex items-center">
												<Clock size={14} className="text-gray-500 mr-2" />
												<p className="text-gray-900">
													{new Date(reminder.time).toLocaleString()}
												</p>
											</div>
											<button
												className="text-red-600 hover:text-red-800 focus:outline-none cursor-pointer"
												onClick={() => deleteReminder(reminder.id)}
											>
												<Trash2 size={14} />
											</button>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-sm bg-gray-50 rounded-lg p-2">
									No reminders set.
								</p>
							)}
						</div>
					</div>

					<div className="pt-4 mt-6 border-t border-gray-200 flex justify-between">
						<div>
							<button
								className="flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
								onClick={() => deleteTask(task.id)}
							>
								<Trash2 size={18} className="mr-1" />
								Delete
							</button>
						</div>

						<div className="flex space-x-3">
							<button
								className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer flex items-center"
								onClick={() => setEditingTask({ ...task })}
							>
								<Edit size={18} className="mr-1" />
								Edit
							</button>

							<button
								className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
									task.completed
										? "bg-gray-600 hover:bg-gray-700"
										: "bg-green-600 hover:bg-green-700"
								}`}
								onClick={() => {
									toggleTaskCompletion(task.id);
									setShowTaskDetailModal(null);
								}}
							>
								{task.completed ? "Mark as Incomplete" : "Mark as Complete"}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}, [
		showTaskDetailModal,
		tasks,
		reminders,
		editingTask,
		getProjectById,
		getUserById,
		formatDate,
		getPriorityColor,
		isTaskOverdue,
		deleteTask,
		closeTaskDetailModal,
		toggleTaskCompletion,
		updateTask,
		addReminder,
		deleteReminder,
		handleEditingTaskChange,
	]);

	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			{Header}

			<div className="flex flex-1 overflow-hidden">
				{Sidebar}

				<main
					className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
						isSidebarOpen ? "lg:ml-64" : ""
					}`}
				>
					{activeView === "dashboard" && Dashboard}
					{activeView === "calendar" && CalendarView}
					{activeView === "projects" && selectedProject && ProjectView}
					{activeView === "settings" && Setting}
				</main>
			</div>

			{NewTaskModal}
			{NewProjectModal}
			{TaskDetailModal}
			{Toast}

			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
					onClick={toggleSidebar}
				></div>
			)}
			<style jsx global>{`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes slide-up {
					from {
						transform: translateY(20px);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}

				@keyframes fade-in-up {
					from {
						transform: translateY(10px);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}

				.animate-fade-in {
					animation: fade-in 0.3s ease-out;
				}

				.animate-slide-up {
					animation: slide-up 0.3s ease-out;
				}

				.animate-fade-in-up {
					animation: fade-in-up 0.3s ease-out;
				}
			`}</style>
		</div>
	);
};

export default TaskFlow;
