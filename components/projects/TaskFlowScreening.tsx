"use client";
import { useState, useRef, useEffect } from "react";

interface Task {
	id: string;
	title: string;
	description: string;
	status: "todo" | "inProgress" | "done";
	createdAt: Date;
	dueDate: Date | null;
	priority: "low" | "medium" | "high";
	assignee: string;
}

interface EditModalProps {
	task: Task | null;
	onSave: (task: Task) => void;
	onClose: () => void;
}

interface ToastProps {
	message: string;
	type: "info" | "success" | "warning" | "error";
	onClose: () => void;
}

interface DeleteModalProps {
	taskId: string | null;
	taskTitle: string;
	onConfirm: (taskId: string) => void;
	onCancel: () => void;
}

interface DatePickerProps {
	id: string;
	value: string;
	onChange: (value: string) => void;
	label?: string;
	darkMode: boolean;
}

export default function TaskFlowScreeningExport() {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: "1",
			title: "Research user needs",
			description: "Conduct user interviews and analyze survey data",
			status: "todo",
			createdAt: new Date(),
			dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			priority: "high",
			assignee: "Emma Thompson",
		},
		{
			id: "2",
			title: "Create wireframes",
			description: "Design low-fidelity wireframes for main user flows",
			status: "todo",
			createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
			dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
			priority: "medium",
			assignee: "Jason Miller",
		},
		{
			id: "3",
			title: "Design mockups",
			description: "Create high-fidelity mockups based on approved wireframes",
			status: "todo",
			createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
			dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
			priority: "medium",
			assignee: "Sophie Chen",
		},
		{
			id: "4",
			title: "Develop frontend components",
			description: "Implement React components according to design system",
			status: "inProgress",
			createdAt: new Date(),
			dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
			priority: "high",
			assignee: "Michael Johnson",
		},
		{
			id: "5",
			title: "Implement API integration",
			description: "Connect frontend to backend services via REST API",
			status: "inProgress",
			createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
			dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
			priority: "high",
			assignee: "David Wilson",
		},
		{
			id: "6",
			title: "Write user documentation",
			description: "Create comprehensive user guide and help documentation",
			status: "done",
			createdAt: new Date(),
			dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
			priority: "low",
			assignee: "Olivia Martinez",
		},
		{
			id: "7",
			title: "Complete QA testing",
			description: "Perform comprehensive testing and fix identified issues",
			status: "done",
			createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
			dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
			priority: "medium",
			assignee: "Noah Brown",
		},
	]);

	const [showAddTask, setShowAddTask] = useState(false);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskDescription, setNewTaskDescription] = useState("");
	const [newTaskDueDate, setNewTaskDueDate] = useState("");
	const [newTaskPriority, setNewTaskPriority] = useState<
		"low" | "medium" | "high"
	>("medium");
	const [newTaskAssignee, setNewTaskAssignee] = useState("");

	const [editTask, setEditTask] = useState<Task | null>(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterPriority, setFilterPriority] = useState<
		"all" | "low" | "medium" | "high"
	>("all");
	const [filterAssignee, setFilterAssignee] = useState("all");

	const [darkMode, setDarkMode] = useState(false);

	const [toast, setToast] = useState<{
		visible: boolean;
		message: string;
		type: "info" | "success" | "warning" | "error";
	}>({
		visible: false,
		message: "",
		type: "info",
	});

	const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
	const [deleteTaskTitle, setDeleteTaskTitle] = useState("");

	// Add state for mobile sidebar
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("dashboard");

	const dragTask = useRef<Task | null>(null);
	const dragOverColumn = useRef<"todo" | "inProgress" | "done" | null>(null);

	const [showDatePicker, setShowDatePicker] = useState<string | null>(null);

	useEffect(() => {
		const root = document.documentElement;
		if (darkMode) {
			root.style.setProperty("--bg-color", "#1a1a1a");
			root.style.setProperty("--text-color", "#f1f1f1");
			root.style.setProperty("--card-bg", "#2d2d2d");
			root.style.setProperty("--header-bg", "#242424");
			root.style.setProperty("--footer-bg", "#242424");
			root.style.setProperty("--border-color", "#444");
			root.style.setProperty("--hover-color", "#383838");
		} else {
			root.style.setProperty("--bg-color", "#f9fafb");
			root.style.setProperty("--text-color", "#374151");
			root.style.setProperty("--card-bg", "#ffffff");
			root.style.setProperty("--header-bg", "#ffffff");
			root.style.setProperty("--footer-bg", "#f3f4f6");
			root.style.setProperty("--border-color", "#e5e7eb");
			root.style.setProperty("--hover-color", "#f3f4f6");
		}
	}, [darkMode]);

	const showToast = (
		message: string,
		type: "info" | "success" | "warning" | "error" = "info"
	) => {
		setToast({
			visible: true,
			message,
			type,
		});

		setTimeout(() => {
			setToast((prev) => ({ ...prev, visible: false }));
		}, 3000);
	};

	const handleUnimplementedFeature = (
		e: React.MouseEvent,
		_featureName: string
	) => {
		e.preventDefault();
		showToast("This feature is available in our pro version", "info");
	};

	const addTask = () => {
		if (newTaskTitle.trim() === "") return;

		const newTask: Task = {
			id: Date.now().toString(),
			title: newTaskTitle,
			description: newTaskDescription,
			status: "todo",
			createdAt: new Date(),
			dueDate: newTaskDueDate ? new Date(newTaskDueDate) : null,
			priority: newTaskPriority,
			assignee: newTaskAssignee,
		};

		setTasks([...tasks, newTask]);
		resetNewTaskForm();
		showToast("Task added successfully", "success");
	};

	const resetNewTaskForm = () => {
		setNewTaskTitle("");
		setNewTaskDescription("");
		setNewTaskDueDate("");
		setNewTaskPriority("medium");
		setNewTaskAssignee("");
		setShowAddTask(false);
	};

	const updateTaskStatus = (
		taskId: string,
		newStatus: "todo" | "inProgress" | "done"
	) => {
		setTasks(
			tasks.map((task) => {
				if (task.id === taskId) {
					return { ...task, status: newStatus };
				}
				return task;
			})
		);
		showToast("Task status updated", "success");
	};

	const moveTaskLeft = (taskId: string) => {
		setTasks(
			tasks.map((task) => {
				if (task.id === taskId) {
					if (task.status === "inProgress") return { ...task, status: "todo" };
					if (task.status === "done") return { ...task, status: "inProgress" };
				}
				return task;
			})
		);
	};

	const moveTaskRight = (taskId: string) => {
		setTasks(
			tasks.map((task) => {
				if (task.id === taskId) {
					if (task.status === "todo") return { ...task, status: "inProgress" };
					if (task.status === "inProgress") return { ...task, status: "done" };
				}
				return task;
			})
		);
	};

	const saveEditedTask = (editedTask: Task) => {
		setTasks(
			tasks.map((task) => (task.id === editedTask.id ? editedTask : task))
		);
		setEditTask(null);
		showToast("Task updated successfully", "success");
	};

	const deleteTask = (taskId: string) => {
		const taskToDelete = tasks.find((task) => task.id === taskId);
		if (taskToDelete) {
			setDeleteTaskId(taskId);
			setDeleteTaskTitle(taskToDelete.title);
		}
	};

	const confirmDeleteTask = (taskId: string) => {
		setTasks(tasks.filter((task) => task.id !== taskId));
		setDeleteTaskId(null);
		showToast("Task deleted", "warning");
	};

	const duplicateTask = (task: Task) => {
		const duplicatedTask = {
			...task,
			id: Date.now().toString(),
			title: `${task.title} (Copy)`,
			createdAt: new Date(),
		};
		setTasks([...tasks, duplicatedTask]);
		showToast("Task duplicated", "success");
	};

	const handleDragStart = (task: Task) => {
		dragTask.current = task;
	};

	const handleDragOver = (
		e: React.DragEvent,
		status: "todo" | "inProgress" | "done"
	) => {
		e.preventDefault();
		dragOverColumn.current = status;
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (dragTask.current && dragOverColumn.current) {
			updateTaskStatus(dragTask.current.id, dragOverColumn.current);
			dragTask.current = null;
			dragOverColumn.current = null;
		}
	};

	const uniqueAssignees = [
		"all",
		...new Set(tasks.map((task) => task.assignee)),
	];

	const filteredTasks = tasks.filter((task) => {
		const matchesSearch =
			task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesPriority =
			filterPriority === "all" || task.priority === filterPriority;
		const matchesAssignee =
			filterAssignee === "all" || task.assignee === filterAssignee;

		return matchesSearch && matchesPriority && matchesAssignee;
	});

	const todoTasks = filteredTasks.filter((task) => task.status === "todo");
	const inProgressTasks = filteredTasks.filter(
		(task) => task.status === "inProgress"
	);
	const doneTasks = filteredTasks.filter((task) => task.status === "done");

	const formatDate = (date: Date) => {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSec = Math.round(diffMs / 1000);
		const diffMin = Math.round(diffSec / 60);
		const diffHour = Math.round(diffMin / 60);
		const diffDay = Math.round(diffHour / 24);

		if (diffSec < 60) return "just now";
		if (diffMin < 60) return `${diffMin}m ago`;
		if (diffHour < 24) return `${diffHour}h ago`;
		if (diffDay === 1) return "yesterday";
		if (diffDay < 30) return `${diffDay}d ago`;

		return date.toLocaleDateString();
	};

	const formatDueDate = (date: Date | null) => {
		if (!date) return null;

		const now = new Date();
		const diffMs = date.getTime() - now.getTime();
		const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

		let color = "";
		if (diffDays < 0) {
			color = "#ef4444";
		} else if (diffDays <= 2) {
			color = "#f59e0b";
		} else {
			color = "#10b981";
		}

		return {
			text: date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
			color,
		};
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			addTask();
		}
	};

	const styles = {
		app: {
			fontFamily:
				'"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
			color: "var(--text-color)",
			backgroundColor: "var(--bg-color)",
			minHeight: "100vh",
			display: "flex",
			flexDirection: "column" as const,
		},
		header: {
			padding: "16px 40px",
			backgroundColor: "var(--header-bg)",
			boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			position: "sticky" as const,
			top: 0,
			zIndex: 100,
		},
		logo: {
			display: "flex",
			alignItems: "center",
			gap: "12px",
			color: darkMode ? "#f1f1f1" : "#111827",
			fontWeight: 700,
			fontSize: "24px",
			textDecoration: "none",
		},
		logoIcon: {
			color: "#4f46e5",
			fontSize: "28px",
		},
		nav: {
			display: "flex",
			gap: "32px",
		},
		navItem: {
			color: darkMode ? "#d1d5db" : "#4b5563",
			textDecoration: "none",
			fontSize: "14px",
			fontWeight: 500,
			transition: "color 0.2s",
			padding: "8px 0",
			position: "relative" as const,
			cursor: "pointer",
		},
		activeNavItem: {
			color: "#4f46e5",
		},
		activeNavIndicator: {
			position: "absolute" as const,
			bottom: 0,
			left: 0,
			right: 0,
			height: "2px",
			backgroundColor: "#4f46e5",
			borderRadius: "2px",
		},
		headerActions: {
			display: "flex",
			alignItems: "center",
			gap: "16px",
		},
		themeToggle: {
			background: "none",
			border: "none",
			color: darkMode ? "#d1d5db" : "#4b5563",
			fontSize: "20px",
			cursor: "pointer",
			padding: "8px",
			borderRadius: "50%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			transition: "background-color 0.2s",
		},
		avatar: {
			width: "32px",
			height: "32px",
			borderRadius: "50%",
			backgroundColor: "#4f46e5",
			color: "white",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontWeight: 600,
			fontSize: "14px",
			cursor: "pointer",
		},
		main: {
			flex: 1,
			padding: "40px 24px",
			maxWidth: "1400px",
			margin: "0 auto",
			width: "100%",
		},
		pageHeader: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "32px",
		},
		pageTitle: {
			fontSize: "28px",
			fontWeight: "700",
			margin: "0",
			color: darkMode ? "#f1f1f1" : "#111827",
			letterSpacing: "-0.025em",
		},
		actionButton: {
			backgroundColor: "#4f46e5",
			color: "white",
			border: "none",
			borderRadius: "8px",
			padding: "10px 18px",
			fontSize: "14px",
			fontWeight: "500",
			cursor: "pointer",
			transition: "all 0.2s ease",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
		},
		toolbar: {
			display: "flex",
			justifyContent: "space-between",
			marginBottom: "24px",
			gap: "16px",
			flexWrap: "wrap" as const,
			backgroundColor: "var(--card-bg)",
			padding: "16px 20px",
			borderRadius: "10px",
			boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
		},
		filters: {
			display: "flex",
			gap: "16px",
			alignItems: "center",
			flexWrap: "wrap" as const,
		},
		filterLabel: {
			fontSize: "14px",
			fontWeight: "500",
			color: darkMode ? "#d1d5db" : "#6b7280",
		},
		select: {
			padding: "8px 12px",
			borderRadius: "8px",
			border: "1px solid var(--border-color)",
			backgroundColor: "var(--card-bg)",
			color: "var(--text-color)",
			fontSize: "14px",
			fontFamily: "inherit",
			cursor: "pointer",
			transition: "border-color 0.2s, box-shadow 0.2s",
			boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
			appearance: "none" as const,
			backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
				darkMode ? "%23aaa" : "%23666"
			}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "right 8px center",
			backgroundSize: "16px",
			paddingRight: "32px",
		},
		searchInput: {
			padding: "10px 14px",
			borderRadius: "8px",
			border: "1px solid var(--border-color)",
			backgroundColor: "var(--card-bg)",
			color: "var(--text-color)",
			fontSize: "14px",
			width: "250px",
			fontFamily: "inherit",
			transition: "border-color 0.2s, box-shadow 0.2s",
			boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
		},
		addTaskContainer: {
			backgroundColor: "var(--card-bg)",
			padding: "24px",
			borderRadius: "12px",
			boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
			marginBottom: "32px",
			border: "1px solid var(--border-color)",
		},
		formTitle: {
			fontSize: "18px",
			fontWeight: "600",
			margin: "0 0 20px 0",
			color: darkMode ? "#f1f1f1" : "#111827",
		},
		formGroup: {
			marginBottom: "16px",
		},
		formRow: {
			display: "flex",
			gap: "16px",
			marginBottom: "16px",
		},
		formRowItem: {
			flex: 1,
		},
		label: {
			display: "block",
			marginBottom: "6px",
			fontSize: "14px",
			color: darkMode ? "#d1d5db" : "#4b5563",
			fontWeight: "500",
		},
		input: {
			width: "100%",
			padding: "10px 14px",
			borderRadius: "6px",
			border: "1px solid var(--border-color)",
			backgroundColor: "var(--card-bg)",
			color: "var(--text-color)",
			fontSize: "14px",
			fontFamily: "inherit",
		},
		textarea: {
			width: "100%",
			padding: "10px 14px",
			borderRadius: "6px",
			border: "1px solid var(--border-color)",
			backgroundColor: "var(--card-bg)",
			color: "var(--text-color)",
			fontSize: "14px",
			fontFamily: "inherit",
			resize: "vertical" as const,
			minHeight: "80px",
		},
		formActions: {
			display: "flex",
			justifyContent: "flex-end",
			gap: "12px",
			marginTop: "20px",
		},
		cancelButton: {
			padding: "10px 18px",
			borderRadius: "6px",
			backgroundColor: "transparent",
			color: darkMode ? "#d1d5db" : "#4b5563",
			border: "1px solid var(--border-color)",
			fontSize: "14px",
			fontWeight: "500",
			cursor: "pointer",
			transition: "all 0.2s",
		},
		submitButton: {
			padding: "10px 18px",
			borderRadius: "6px",
			backgroundColor: "#4f46e5",
			color: "white",
			border: "none",
			fontSize: "14px",
			fontWeight: "500",
			cursor: "pointer",
			transition: "all 0.2s",
		},
		columnsContainer: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "24px",
			minHeight: "500px",
		},
		column: {
			backgroundColor: "var(--card-bg)",
			borderRadius: "12px",
			padding: "0",
			boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
			height: "fit-content",
			minHeight: "400px",
			maxHeight: "calc(100vh - 300px)",
			overflowY: "auto" as const,
			border: "1px solid var(--border-color)",
			position: "relative" as const,
		},
		columnHeader: {
			fontSize: "16px",
			fontWeight: "600",
			marginBottom: "0",
			paddingBottom: "16px",
			borderBottom: "2px solid var(--border-color)",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			position: "sticky" as const,
			top: "0",
			backgroundColor: "var(--card-bg)",
			zIndex: "10",
			width: "100%",
			padding: "20px 20px 16px 20px",
			borderTopLeftRadius: "12px",
			borderTopRightRadius: "12px",
		},
		columnContent: {
			padding: "0 20px 20px 20px",
		},
		todoColumn: {
			borderTop: "4px solid #3b82f6",
		},
		inProgressColumn: {
			borderTop: "4px solid #f59e0b",
		},
		doneColumn: {
			borderTop: "4px solid #10b981",
		},
		taskCard: {
			backgroundColor: "var(--card-bg)",
			borderRadius: "8px",
			padding: "16px",
			marginBottom: "16px",
			boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
			border: "1px solid var(--border-color)",
			transition: "all 0.2s ease",
			cursor: "grab",
		},
		taskTitle: {
			margin: "0 0 8px 0",
			fontSize: "15px",
			fontWeight: "600",
			color: darkMode ? "#f1f1f1" : "#1f2937",
			wordBreak: "break-word" as const,
		},
		taskDescription: {
			margin: "0 0 16px 0",
			fontSize: "14px",
			color: darkMode ? "#d1d5db" : "#4b5563",
			wordBreak: "break-word" as const,
			lineHeight: "1.5",
		},
		taskMeta: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "12px",
			fontSize: "12px",
			color: darkMode ? "#9ca3af" : "#6b7280",
		},
		taskTags: {
			display: "flex",
			flexWrap: "wrap" as const,
			gap: "8px",
			marginBottom: "16px",
		},
		priorityTag: {
			padding: "4px 8px",
			borderRadius: "4px",
			fontSize: "12px",
			fontWeight: "500",
			display: "inline-flex",
			alignItems: "center",
			gap: "4px",
			backgroundColor: "transparent",
			color: "inherit",
		},
		dueDateTag: {
			padding: "4px 8px",
			borderRadius: "4px",
			fontSize: "12px",
			fontWeight: "500",
			backgroundColor: darkMode ? "#374151" : "#f3f4f6",
			color: "inherit",
			display: "inline-flex",
			alignItems: "center",
			gap: "4px",
		},
		assigneeTag: {
			padding: "4px 8px",
			borderRadius: "4px",
			fontSize: "12px",
			fontWeight: "500",
			backgroundColor: darkMode ? "#374151" : "#f3f4f6",
			color: "inherit",
			display: "inline-flex",
			alignItems: "center",
			gap: "4px",
		},
		taskActions: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			borderTop: "1px solid var(--border-color)",
			marginTop: "12px",
			paddingTop: "12px",
		},
		taskActionButtons: {
			display: "flex",
			gap: "8px",
		},
		iconButton: {
			backgroundColor: darkMode ? "#374151" : "#f3f4f6",
			border: "none",
			borderRadius: "6px",
			padding: "6px",
			cursor: "pointer",
			transition: "all 0.2s ease",
			fontSize: "13px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: darkMode ? "#d1d5db" : "#4b5563",
			width: "28px",
			height: "28px",
		},
		moveButtons: {
			display: "flex",
			gap: "8px",
		},
		disabledButton: {
			backgroundColor: darkMode ? "#2d2d2d" : "#f9fafb",
			border: "none",
			borderRadius: "6px",
			padding: "6px",
			color: darkMode ? "#4b5563" : "#d1d5db",
			cursor: "not-allowed",
			fontSize: "13px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			width: "28px",
			height: "28px",
		},
		emptyState: {
			textAlign: "center" as const,
			color: darkMode ? "#9ca3af" : "#9ca3af",
			padding: "24px 16px",
			fontSize: "14px",
			backgroundColor: darkMode ? "#2d2d2d" : "#f9fafb",
			borderRadius: "8px",
			border: "1px dashed var(--border-color)",
		},
		statusIndicator: {
			display: "inline-block",
			width: "8px",
			height: "8px",
			borderRadius: "50%",
			marginRight: "8px",
		},
		todoIndicator: {
			backgroundColor: "#3b82f6",
		},
		inProgressIndicator: {
			backgroundColor: "#f59e0b",
		},
		doneIndicator: {
			backgroundColor: "#10b981",
		},
		taskCount: {
			backgroundColor: darkMode ? "#374151" : "#e5e7eb",
			color: darkMode ? "#d1d5db" : "#4b5563",
			fontSize: "13px",
			fontWeight: "500",
			padding: "2px 8px",
			borderRadius: "9999px",
			marginLeft: "auto",
		},
		modal: {
			position: "fixed" as const,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 1000,
		},
		modalContent: {
			backgroundColor: "var(--card-bg)",
			borderRadius: "12px",
			padding: "24px",
			boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
			maxWidth: "600px",
			width: "90%",
			maxHeight: "90vh",
			overflowY: "auto" as const,
		},
		modalHeader: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "20px",
		},
		modalTitle: {
			margin: 0,
			fontSize: "20px",
			fontWeight: "600",
			color: darkMode ? "#f1f1f1" : "#111827",
		},
		closeButton: {
			background: "none",
			border: "none",
			color: darkMode ? "#9ca3af" : "#6b7280",
			fontSize: "24px",
			cursor: "pointer",
			padding: "4px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
		footer: {
			backgroundColor: "var(--footer-bg)",
			padding: "32px 40px",
			borderTop: "1px solid var(--border-color)",
		},
		footerContent: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			maxWidth: "1400px",
			margin: "0 auto",
			flexWrap: "wrap" as const,
			gap: "20px",
		},
		footerLinks: {
			display: "flex",
			gap: "24px",
		},
		footerLink: {
			color: darkMode ? "#9ca3af" : "#6b7280",
			textDecoration: "none",
			fontSize: "14px",
			transition: "color 0.2s",
			cursor: "pointer",
		},
		copyright: {
			color: darkMode ? "#9ca3af" : "#6b7280",
			fontSize: "14px",
		},
		toast: {
			position: "fixed" as const,
			bottom: "24px",
			right: "24px",
			padding: "12px 20px",
			borderRadius: "8px",
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
			display: "flex",
			alignItems: "center",
			gap: "12px",
			maxWidth: "400px",
			zIndex: 1000,
			transition: "transform 0.3s ease, opacity 0.3s ease",
			opacity: toast.visible ? 1 : 0,
			transform: toast.visible ? "translateY(0)" : "translateY(20px)",
			pointerEvents: (toast.visible
				? "all"
				: "none") as React.CSSProperties["pointerEvents"],
		},
		toastInfo: {
			backgroundColor: darkMode ? "#1e3a8a" : "#dbeafe",
			color: darkMode ? "#dbeafe" : "#1e3a8a",
			borderLeft: "4px solid #3b82f6",
		},
		toastSuccess: {
			backgroundColor: darkMode ? "#065f46" : "#d1fae5",
			color: darkMode ? "#d1fae5" : "#065f46",
			borderLeft: "4px solid #10b981",
		},
		toastWarning: {
			backgroundColor: darkMode ? "#92400e" : "#fef3c7",
			color: darkMode ? "#fef3c7" : "#92400e",
			borderLeft: "4px solid #f59e0b",
		},
		toastError: {
			backgroundColor: darkMode ? "#7f1d1d" : "#fee2e2",
			color: darkMode ? "#fee2e2" : "#7f1d1d",
			borderLeft: "4px solid #ef4444",
		},
		toastMessage: {
			flex: 1,
			fontSize: "14px",
			fontWeight: 500,
		},
		toastCloseButton: {
			background: "none",
			border: "none",
			cursor: "pointer",
			fontSize: "18px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "inherit",
			opacity: 0.7,
			transition: "opacity 0.2s",
		},
		deleteModal: {
			position: "fixed" as const,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 1000,
		},
		deleteModalContent: {
			backgroundColor: "var(--card-bg)",
			borderRadius: "12px",
			padding: "24px",
			boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
			maxWidth: "500px",
			width: "90%",
		},
		deleteModalHeader: {
			marginBottom: "16px",
		},
		deleteModalTitle: {
			margin: 0,
			fontSize: "20px",
			fontWeight: "600",
			color: darkMode ? "#f1f1f1" : "#111827",
		},
		deleteModalMessage: {
			fontSize: "15px",
			marginBottom: "24px",
			color: darkMode ? "#d1d5db" : "#4b5563",
			lineHeight: "1.5",
		},
		deleteModalTaskTitle: {
			fontSize: "16px",
			fontWeight: "500",
			color: darkMode ? "#f1f1f1" : "#111827",
			padding: "12px",
			margin: "12px 0",
			backgroundColor: darkMode ? "#1a1a1a" : "#f3f4f6",
			borderRadius: "6px",
			borderLeft: "3px solid #ef4444",
		},
		deleteModalActions: {
			display: "flex",
			justifyContent: "flex-end",
			gap: "12px",
			marginTop: "20px",
		},
		cancelDeleteButton: {
			padding: "10px 18px",
			borderRadius: "6px",
			backgroundColor: "transparent",
			color: darkMode ? "#d1d5db" : "#4b5563",
			border: "1px solid var(--border-color)",
			fontSize: "14px",
			fontWeight: "500",
			cursor: "pointer",
			transition: "all 0.2s",
		},
		confirmDeleteButton: {
			padding: "10px 18px",
			borderRadius: "6px",
			backgroundColor: "#ef4444",
			color: "white",
			border: "none",
			fontSize: "14px",
			fontWeight: "500",
			cursor: "pointer",
			transition: "all 0.2s",
			display: "flex",
			alignItems: "center",
			gap: "8px",
		},

		// Add mobile menu button styles
		hamburgerButton: {
			background: "none",
			border: "none",
			color: darkMode ? "#d1d5db" : "#4b5563",
			fontSize: "24px",
			cursor: "pointer",
			padding: "8px",
			borderRadius: "50%",
			display: "none", // Hidden by default, shown in media query
			alignItems: "center",
			justifyContent: "center",
			transition: "background-color 0.2s",
			marginRight: "8px",
		},

		// Add sidebar styles
		sidebar: {
			position: "fixed" as const,
			top: 0,
			left: 0,
			height: "100vh",
			width: "280px",
			backgroundColor: darkMode ? "#242424" : "#ffffff",
			boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
			zIndex: 1000,
			transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
			transition: "transform 0.3s ease",
			display: "flex",
			flexDirection: "column" as const,
			padding: "16px",
		},

		sidebarHeader: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "24px",
			paddingBottom: "16px",
			borderBottom: "1px solid var(--border-color)",
		},

		sidebarLogo: {
			display: "flex",
			alignItems: "center",
			gap: "12px",
			color: darkMode ? "#f1f1f1" : "#111827",
			fontWeight: 700,
			fontSize: "22px",
		},

		sidebarClose: {
			background: "none",
			border: "none",
			color: darkMode ? "#d1d5db" : "#4b5563",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},

		sidebarNav: {
			display: "flex",
			flexDirection: "column" as const,
			gap: "16px",
		},

		sidebarNavItem: {
			color: darkMode ? "#d1d5db" : "#4b5563",
			textDecoration: "none",
			fontSize: "16px",
			fontWeight: 500,
			padding: "12px 16px",
			borderRadius: "8px",
			transition: "all 0.2s",
			cursor: "pointer",
		},

		sidebarNavItemActive: {
			backgroundColor: darkMode ? "#374151" : "#f3f4f6",
			color: "#4f46e5",
		},

		sidebarOverlay: {
			position: "fixed" as const,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			zIndex: 999,
			opacity: sidebarOpen ? 1 : 0,
			visibility: sidebarOpen ? "visible" : "hidden",
			transition: "opacity 0.3s ease, visibility 0.3s ease",
		},

		// Section styles for different views
		sectionContainer: {
			flex: 1,
			width: "100%",
		},

		placeholderSection: {
			display: "flex",
			flexDirection: "column" as const,
			alignItems: "center",
			justifyContent: "center",
			padding: "60px 24px",
			textAlign: "center" as const,
		},

		placeholderIcon: {
			fontSize: "48px",
			color: darkMode ? "#4b5563" : "#d1d5db",
			marginBottom: "24px",
		},

		placeholderTitle: {
			fontSize: "24px",
			fontWeight: 600,
			marginBottom: "16px",
			color: darkMode ? "#f1f1f1" : "#111827",
		},

		placeholderText: {
			fontSize: "16px",
			lineHeight: "1.5",
			maxWidth: "500px",
			color: darkMode ? "#9ca3af" : "#6b7280",
			marginBottom: "24px",
		},
	};

	const renderPriorityTag = (priority: "low" | "medium" | "high") => {
		let style = { ...styles.priorityTag };

		switch (priority) {
			case "low":
				style = {
					...style,
					backgroundColor: darkMode ? "#065f46" : "#d1fae5",
					color: darkMode ? "#d1fae5" : "#065f46",
				};
				break;
			case "medium":
				style = {
					...style,
					backgroundColor: darkMode ? "#92400e" : "#fef3c7",
					color: darkMode ? "#fef3c7" : "#92400e",
				};
				break;
			case "high":
				style = {
					...style,
					backgroundColor: darkMode ? "#7f1d1d" : "#fee2e2",
					color: darkMode ? "#fee2e2" : "#7f1d1d",
				};
				break;
		}

		return (
			<div style={style}>
				{priority === "low" && "●"}
				{priority === "medium" && "●●"}
				{priority === "high" && "●●●"}{" "}
				{priority.charAt(0).toUpperCase() + priority.slice(1)}
			</div>
		);
	};

	// Toast component
	const Toast = ({ message, type, onClose }: ToastProps) => {
		let toastStyle = { ...styles.toast };

		switch (type) {
			case "info":
				toastStyle = { ...toastStyle, ...styles.toastInfo };
				break;
			case "success":
				toastStyle = { ...toastStyle, ...styles.toastSuccess };
				break;
			case "warning":
				toastStyle = { ...toastStyle, ...styles.toastWarning };
				break;
			case "error":
				toastStyle = { ...toastStyle, ...styles.toastError };
				break;
		}

		return (
			<div style={toastStyle}>
				<div style={styles.toastMessage}>{message}</div>
				<button style={styles.toastCloseButton} onClick={onClose}>
					×
				</button>
			</div>
		);
	};

	const DatePicker = ({ id, value, onChange, darkMode }: DatePickerProps) => {
		const [month, setMonth] = useState(() => {
			if (value) {
				const date = new Date(value);
				return new Date(date.getFullYear(), date.getMonth(), 1);
			}
			return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		});

		const datePickerRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					datePickerRef.current &&
					!datePickerRef.current.contains(event.target as Node)
				) {
					setShowDatePicker(null);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, []);

		const formattedValue = value
			? new Date(value).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
			  })
			: "";

		const getDaysInMonth = (year: number, month: number) => {
			return new Date(year, month + 1, 0).getDate();
		};

		const getFirstDayOfMonth = (year: number, month: number) => {
			return new Date(year, month, 1).getDay();
		};

		const generateDates = () => {
			const year = month.getFullYear();
			const monthIndex = month.getMonth();
			const daysInMonth = getDaysInMonth(year, monthIndex);
			const firstDay = getFirstDayOfMonth(year, monthIndex);

			const dates = [];

			for (let i = 0; i < firstDay; i++) {
				dates.push(null);
			}

			for (let i = 1; i <= daysInMonth; i++) {
				dates.push(new Date(year, monthIndex, i));
			}

			return dates;
		};

		const goToPreviousMonth = () => {
			setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
		};

		const goToNextMonth = () => {
			setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
		};

		const isCurrentDate = (date: Date) => {
			const today = new Date();
			return (
				date.getDate() === today.getDate() &&
				date.getMonth() === today.getMonth() &&
				date.getFullYear() === today.getFullYear()
			);
		};

		const isSelectedDate = (date: Date) => {
			if (!value) return false;
			const selectedDate = new Date(value);
			return (
				date.getDate() === selectedDate.getDate() &&
				date.getMonth() === selectedDate.getMonth() &&
				date.getFullYear() === selectedDate.getFullYear()
			);
		};

		const handleDateSelect = (date: Date) => {
			const formattedDate = date.toISOString().split("T")[0];
			onChange(formattedDate);
			setShowDatePicker(null);
		};

		const datePickerStyles = {
			wrapper: {
				position: "relative" as const,
				width: "100%",
			},
			input: {
				...styles.input,
				cursor: "pointer",
			},
			calendar: {
				position: "absolute" as const,
				top: "100%",
				left: 0,
				zIndex: 20,
				backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
				border: `1px solid ${darkMode ? "#444" : "#e5e7eb"}`,
				borderRadius: "8px",
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
				width: "300px",
				marginTop: "8px",
				padding: "16px",
				animation: "fadeIn 0.2s ease",
			},
			calendarHeader: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				marginBottom: "16px",
			},
			monthTitle: {
				fontSize: "16px",
				fontWeight: 600,
				color: darkMode ? "#f1f1f1" : "#111827",
			},
			navButton: {
				background: "none",
				border: "none",
				color: darkMode ? "#d1d5db" : "#6b7280",
				cursor: "pointer",
				fontSize: "18px",
				padding: "4px 8px",
				borderRadius: "4px",
				transition: "background-color 0.2s",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			},
			weekdays: {
				display: "grid",
				gridTemplateColumns: "repeat(7, 1fr)",
				gap: "4px",
				marginBottom: "8px",
			},
			weekday: {
				fontSize: "12px",
				fontWeight: 500,
				color: darkMode ? "#9ca3af" : "#6b7280",
				textAlign: "center" as const,
				padding: "4px 0",
			},
			datesGrid: {
				display: "grid",
				gridTemplateColumns: "repeat(7, 1fr)",
				gap: "4px",
			},
			dateCell: {
				width: "100%",
				aspectRatio: "1",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: "14px",
				borderRadius: "50%",
				cursor: "pointer",
				transition: "background-color 0.2s",
			},
			emptyCell: {
				width: "100%",
				aspectRatio: "1",
			},
			currentDate: {
				border: `1px solid ${darkMode ? "#9ca3af" : "#9ca3af"}`,
			},
			selectedDate: {
				backgroundColor: "#4f46e5",
				color: "white",
			},
			dateButton: {
				backgroundColor: "transparent",
				border: "none",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "50%",
				cursor: "pointer",
				color: darkMode ? "#d1d5db" : "#374151",
				transition: "background-color 0.2s",
				"&:hover": {
					backgroundColor: darkMode ? "#374151" : "#f3f4f6",
				},
			},
		};

		return (
			<div style={datePickerStyles.wrapper}>
				<input
					id={id}
					style={datePickerStyles.input}
					type="text"
					value={formattedValue}
					placeholder="Select date"
					readOnly
					onClick={() => setShowDatePicker(id)}
				/>

				{showDatePicker === id && (
					<div style={datePickerStyles.calendar} ref={datePickerRef}>
						<div style={datePickerStyles.calendarHeader}>
							<button
								style={datePickerStyles.navButton}
								onClick={goToPreviousMonth}
								aria-label="Previous month"
							>
								<LeftArrowIcon />
							</button>
							<div style={datePickerStyles.monthTitle}>
								{month.toLocaleDateString("en-US", {
									month: "long",
									year: "numeric",
								})}
							</div>
							<button
								style={datePickerStyles.navButton}
								onClick={goToNextMonth}
								aria-label="Next month"
							>
								<RightArrowIcon />
							</button>
						</div>

						<div style={datePickerStyles.weekdays}>
							{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
								<div key={day} style={datePickerStyles.weekday}>
									{day}
								</div>
							))}
						</div>

						<div style={datePickerStyles.datesGrid}>
							{generateDates().map((date, index) =>
								date ? (
									<div
										key={index}
										style={{
											...datePickerStyles.dateCell,
											...(isCurrentDate(date)
												? datePickerStyles.currentDate
												: {}),
											...(isSelectedDate(date)
												? datePickerStyles.selectedDate
												: {}),
										}}
										onClick={() => handleDateSelect(date)}
									>
										{date.getDate()}
									</div>
								) : (
									<div key={index} style={datePickerStyles.emptyCell}></div>
								)
							)}
						</div>
					</div>
				)}
			</div>
		);
	};

	const EditTaskModal = ({ task, onSave, onClose }: EditModalProps) => {
		// Initialize state, potentially with defaults if task is null initially
		const [title, setTitle] = useState(task ? task.title : "");
		const [description, setDescription] = useState(
			task ? task.description : ""
		);
		const [dueDate, setDueDate] = useState(
			task && task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
		);
		const [priority, setPriority] = useState(task ? task.priority : "medium");
		const [assignee, setAssignee] = useState(task ? task.assignee : "");
		const [status, setStatus] = useState(task ? task.status : "todo");

		// Effect to update state when the task prop changes
		useEffect(() => {
			if (task) {
				setTitle(task.title);
				setDescription(task.description);
				setDueDate(
					task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
				);
				setPriority(task.priority);
				setAssignee(task.assignee);
				setStatus(task.status);
			}
		}, [task]);

		// Early return *after* all hooks have been called
		if (!task) {
			return null; // Or a loading indicator
		}

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			onSave({
				...task,
				title,
				description,
				dueDate: dueDate ? new Date(dueDate) : null,
				priority,
				assignee,
				status,
			});
		};

		return (
			<div style={styles.modal} onClick={onClose}>
				<div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
					<div style={styles.modalHeader}>
						<h3 style={styles.modalTitle}>Edit Task</h3>
						<button style={styles.closeButton} onClick={onClose}>
							×
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<div style={styles.formGroup}>
							<label style={styles.label} htmlFor="edit-title">
								Title
							</label>
							<input
								id="edit-title"
								style={styles.input}
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>

						<div style={styles.formGroup}>
							<label style={styles.label} htmlFor="edit-description">
								Description
							</label>
							<textarea
								id="edit-description"
								style={styles.textarea}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>

						<div style={styles.formRow}>
							<div style={styles.formRowItem}>
								<label style={styles.label} htmlFor="edit-status">
									Status
								</label>
								<select
									id="edit-status"
									style={styles.select}
									value={status}
									onChange={(e) =>
										setStatus(e.target.value as "todo" | "inProgress" | "done")
									}
								>
									<option value="todo">To Do</option>
									<option value="inProgress">In Progress</option>
									<option value="done">Done</option>
								</select>
							</div>

							<div style={styles.formRowItem}>
								<label style={styles.label} htmlFor="edit-priority">
									Priority
								</label>
								<select
									id="edit-priority"
									style={styles.select}
									value={priority}
									onChange={(e) =>
										setPriority(e.target.value as "low" | "medium" | "high")
									}
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>
						</div>

						<div style={styles.formRow}>
							<div style={styles.formRowItem}>
								<label style={styles.label} htmlFor="edit-due-date">
									Due Date
								</label>
								<DatePicker
									id="edit-due-date"
									value={dueDate}
									onChange={setDueDate}
									darkMode={darkMode}
								/>
							</div>

							<div style={styles.formRowItem}>
								<label style={styles.label} htmlFor="edit-assignee">
									Assignee
								</label>
								<input
									id="edit-assignee"
									style={styles.input}
									type="text"
									value={assignee}
									onChange={(e) => setAssignee(e.target.value)}
								/>
							</div>
						</div>

						<div style={styles.formActions}>
							<button
								type="button"
								style={styles.cancelButton}
								onClick={onClose}
							>
								Cancel
							</button>
							<button type="submit" style={styles.submitButton}>
								Save Changes
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	const DeleteTaskModal = ({
		taskId,
		taskTitle,
		onConfirm,
		onCancel,
	}: DeleteModalProps) => {
		if (!taskId) return null;

		return (
			<div style={styles.deleteModal} onClick={onCancel}>
				<div
					style={styles.deleteModalContent}
					onClick={(e) => e.stopPropagation()}
				>
					<div style={styles.deleteModalHeader}>
						<h3 style={styles.deleteModalTitle}>Delete Task</h3>
					</div>

					<div style={styles.deleteModalMessage}>
						Are you sure you want to delete this task? This action cannot be
						undone.
					</div>

					<div style={styles.deleteModalActions}>
						<button
							type="button"
							style={styles.cancelDeleteButton}
							onClick={onCancel}
						>
							Cancel
						</button>
						<button
							type="button"
							style={styles.confirmDeleteButton}
							onClick={() => onConfirm(taskId)}
						>
							<TrashIcon /> Delete Task
						</button>
					</div>
				</div>
			</div>
		);
	};

	const PlusIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8 3.33334V12.6667"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M3.33331 8H12.6666"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const LeftArrowIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10.6668 3.33334L6.00016 8.00001L10.6668 12.6667"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const RightArrowIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.33317 12.6667L9.99984 8.00001L5.33317 3.33334"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const EditIcon = () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const TrashIcon = () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3 6H5H21"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const CopyIcon = () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const MoonIcon = () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41102 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.589 3.25391 13.9205C2.88188 12.252 2.99274 10.5121 3.57346 8.9043C4.15418 7.29651 5.18078 5.88737 6.53321 4.84175C7.88564 3.79614 9.5078 3.15731 11.21 3C10.2134 4.34827 9.73387 6.00945 9.85852 7.68141C9.98318 9.35338 10.7038 10.9251 11.8894 12.1106C13.0749 13.2962 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6517 13.7866 21 12.79Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const SunIcon = () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 1V3"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 21V23"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.22 4.22L5.64 5.64"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.36 18.36L19.78 19.78"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M1 12H3"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M21 12H23"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.22 19.78L5.64 18.36"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.36 5.64L19.78 4.22"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const ClockIcon = () => (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 6V12L16 14"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const UserIcon = () => (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const InfoIcon = () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 16V12"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 8H12.01"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	// Add hamburger menu icon component
	const HamburgerIcon = () => (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3 12H21"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M3 6H21"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M3 18H21"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	// Add close icon component
	const CloseIcon = () => (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M18 6L6 18"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6 6L18 18"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	// MobileSidebar component
	const MobileSidebar = () => {
		return (
			<>
				{/* Overlay */}
				<div
					style={styles.sidebarOverlay}
					onClick={() => setSidebarOpen(false)}
				/>

				{/* Sidebar */}
				<div style={styles.sidebar}>
					<div style={styles.sidebarHeader}>
						<div style={styles.sidebarLogo}>
							<span style={styles.logoIcon}>◆</span>
							TaskBoard
						</div>
						<button
							style={styles.sidebarClose}
							onClick={() => setSidebarOpen(false)}
						>
							<CloseIcon />
						</button>
					</div>

					<div style={styles.sidebarNav}>
						<a
							href="#"
							style={{
								...styles.sidebarNavItem,
								...(activeSection === "dashboard"
									? styles.sidebarNavItemActive
									: {}),
							}}
							onClick={(e) => {
								e.preventDefault();
								setActiveSection("dashboard");
								setSidebarOpen(false);
							}}
						>
							Dashboard
						</a>
						<a
							href="#"
							style={{
								...styles.sidebarNavItem,
								...(activeSection === "projects"
									? styles.sidebarNavItemActive
									: {}),
							}}
							onClick={(e) => {
								e.preventDefault();
								setActiveSection("projects");
								setSidebarOpen(false);
							}}
						>
							Projects
						</a>
						<a
							href="#"
							style={{
								...styles.sidebarNavItem,
								...(activeSection === "team"
									? styles.sidebarNavItemActive
									: {}),
							}}
							onClick={(e) => {
								e.preventDefault();
								setActiveSection("team");
								setSidebarOpen(false);
							}}
						>
							Team
						</a>
						<a
							href="#"
							style={{
								...styles.sidebarNavItem,
								...(activeSection === "calendar"
									? styles.sidebarNavItemActive
									: {}),
							}}
							onClick={(e) => {
								e.preventDefault();
								setActiveSection("calendar");
								setSidebarOpen(false);
							}}
						>
							Calendar
						</a>
						<a
							href="#"
							style={{
								...styles.sidebarNavItem,
								...(activeSection === "reports"
									? styles.sidebarNavItemActive
									: {}),
							}}
							onClick={(e) => {
								e.preventDefault();
								setActiveSection("reports");
								setSidebarOpen(false);
							}}
						>
							Reports
						</a>
					</div>
				</div>
			</>
		);
	};

	// PlaceholderSection component
	const PlaceholderSection = ({
		title,
		icon,
		description,
	}: {
		title: string;
		icon: string;
		description: string;
	}) => {
		return (
			<div style={styles.placeholderSection}>
				<div style={styles.placeholderIcon}>{icon}</div>
				<h2 style={styles.placeholderTitle}>{title}</h2>
				<p style={styles.placeholderText}>{description}</p>
				<button
					style={styles.actionButton}
					onClick={() => setActiveSection("dashboard")}
				>
					Return to Dashboard
				</button>
			</div>
		);
	};

	return (
		<div style={styles.app}>
			{/* Mobile Sidebar */}
			<MobileSidebar />

			{/* Header */}
			<header style={styles.header}>
				<div style={{ display: "flex", alignItems: "center" }}>
					{/* Hamburger Menu Button (visible on mobile) */}
					<button
						style={styles.hamburgerButton}
						onClick={() => setSidebarOpen(true)}
						className="mobile-menu-button"
					>
						<HamburgerIcon />
					</button>

					<a
						href="#"
						style={styles.logo}
						onClick={(e) => handleUnimplementedFeature(e, "Logo")}
					>
						<span style={styles.logoIcon}>◆</span>
						TaskBoard
					</a>
				</div>

				<nav style={styles.nav}>
					<a
						href="#"
						style={{
							...styles.navItem,
							...(activeSection === "dashboard" ? styles.activeNavItem : {}),
						}}
						onClick={(e) => {
							e.preventDefault();
							setActiveSection("dashboard");
						}}
					>
						Dashboard
						{activeSection === "dashboard" && (
							<span style={styles.activeNavIndicator}></span>
						)}
					</a>
					<a
						href="#"
						style={{
							...styles.navItem,
							...(activeSection === "projects" ? styles.activeNavItem : {}),
						}}
						onClick={(e) => {
							e.preventDefault();
							setActiveSection("projects");
						}}
					>
						Projects
						{activeSection === "projects" && (
							<span style={styles.activeNavIndicator}></span>
						)}
					</a>
					<a
						href="#"
						style={{
							...styles.navItem,
							...(activeSection === "team" ? styles.activeNavItem : {}),
						}}
						onClick={(e) => {
							e.preventDefault();
							setActiveSection("team");
						}}
					>
						Team
						{activeSection === "team" && (
							<span style={styles.activeNavIndicator}></span>
						)}
					</a>
					<a
						href="#"
						style={{
							...styles.navItem,
							...(activeSection === "calendar" ? styles.activeNavItem : {}),
						}}
						onClick={(e) => {
							e.preventDefault();
							setActiveSection("calendar");
						}}
					>
						Calendar
						{activeSection === "calendar" && (
							<span style={styles.activeNavIndicator}></span>
						)}
					</a>
					<a
						href="#"
						style={{
							...styles.navItem,
							...(activeSection === "reports" ? styles.activeNavItem : {}),
						}}
						onClick={(e) => {
							e.preventDefault();
							setActiveSection("reports");
						}}
					>
						Reports
						{activeSection === "reports" && (
							<span style={styles.activeNavIndicator}></span>
						)}
					</a>
				</nav>

				<div style={styles.headerActions}>
					<button
						style={styles.themeToggle}
						onClick={() => setDarkMode(!darkMode)}
						title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
					>
						{darkMode ? <SunIcon /> : <MoonIcon />}
					</button>

					<div
						style={styles.avatar}
						title="User Profile"
						onClick={(e) => handleUnimplementedFeature(e, "User Profile")}
					>
						JS
					</div>
				</div>
			</header>

			<main style={styles.main}>
				{/* Render different sections based on activeSection state */}
				{activeSection === "dashboard" && (
					<>
						{/* Page Header */}
						<div style={styles.pageHeader}>
							<h1 style={styles.pageTitle}>Project Dashboard</h1>

							<button
								style={{
									...styles.actionButton,
									backgroundColor: showAddTask ? "#dc2626" : "#4f46e5",
								}}
								onClick={() => setShowAddTask(!showAddTask)}
							>
								{showAddTask ? (
									<>
										<span style={{ fontSize: "18px", lineHeight: "0" }}>×</span>{" "}
										Cancel
									</>
								) : (
									<>
										<PlusIcon /> Add Task
									</>
								)}
							</button>
						</div>

						{/* Toolbar with search and filters */}
						<div style={styles.toolbar}>
							<div style={styles.filters}>
								<span style={styles.filterLabel}>Filter:</span>

								<select
									style={styles.select}
									value={filterPriority}
									onChange={(e) =>
										setFilterPriority(
											e.target.value as "all" | "low" | "medium" | "high"
										)
									}
								>
									<option value="all">All Priorities</option>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>

								<select
									style={styles.select}
									value={filterAssignee}
									onChange={(e) => setFilterAssignee(e.target.value)}
								>
									<option value="all">All Assignees</option>
									{uniqueAssignees
										.filter((a) => a !== "all")
										.map((assignee) => (
											<option key={assignee} value={assignee}>
												{assignee}
											</option>
										))}
								</select>
							</div>

							<input
								style={styles.searchInput}
								type="text"
								placeholder="Search tasks..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						{/* Add Task Form */}
						{showAddTask && (
							<div style={styles.addTaskContainer}>
								<h2 style={styles.formTitle}>Create New Task</h2>

								<div style={styles.formGroup}>
									<label style={styles.label} htmlFor="task-title">
										Title *
									</label>
									<input
										id="task-title"
										style={styles.input}
										type="text"
										value={newTaskTitle}
										onChange={(e) => setNewTaskTitle(e.target.value)}
										placeholder="Enter task title"
										required
									/>
								</div>

								<div style={styles.formGroup}>
									<label style={styles.label} htmlFor="task-description">
										Description
									</label>
									<textarea
										id="task-description"
										style={styles.textarea}
										value={newTaskDescription}
										onChange={(e) => setNewTaskDescription(e.target.value)}
										placeholder="Enter task description"
										onKeyPress={(e) => {
											if (e.key === "Enter" && e.shiftKey) {
												// Allow shift+enter for new lines
												return;
											}
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault(); // Prevent default form submission or new line in text area
												if (newTaskTitle.trim() !== "") {
													addTask();
												}
											}
										}}
									/>
								</div>

								<div style={styles.formRow}>
									<div style={styles.formRowItem}>
										<label style={styles.label} htmlFor="task-due-date">
											Due Date
										</label>
										<DatePicker
											id="task-due-date"
											value={newTaskDueDate}
											onChange={setNewTaskDueDate}
											darkMode={darkMode}
										/>
									</div>

									<div style={styles.formRowItem}>
										<label style={styles.label} htmlFor="task-priority">
											Priority
										</label>
										<select
											id="task-priority"
											style={styles.select}
											value={newTaskPriority}
											onChange={(e) =>
												setNewTaskPriority(
													e.target.value as "low" | "medium" | "high"
												)
											}
										>
											<option value="low">Low</option>
											<option value="medium">Medium</option>
											<option value="high">High</option>
										</select>
									</div>

									<div style={styles.formRowItem}>
										<label style={styles.label} htmlFor="task-assignee">
											Assignee
										</label>
										<input
											id="task-assignee"
											style={styles.input}
											type="text"
											value={newTaskAssignee}
											onChange={(e) => setNewTaskAssignee(e.target.value)}
											placeholder="Enter assignee name"
										/>
									</div>
								</div>

								<div style={styles.formActions}>
									<button
										style={styles.cancelButton}
										type="button"
										onClick={resetNewTaskForm}
									>
										Cancel
									</button>
									<button
										style={styles.submitButton}
										type="button"
										onClick={addTask}
										disabled={newTaskTitle.trim() === ""}
									>
										Add Task
									</button>
								</div>
							</div>
						)}

						{/* Columns */}
						<div
							style={styles.columnsContainer}
							data-testid="columns-container"
						>
							{/* To Do Column */}
							<div
								style={{ ...styles.column, ...styles.todoColumn }}
								onDragOver={(e) => handleDragOver(e, "todo")}
								onDrop={handleDrop}
							>
								<h2 style={styles.columnHeader}>
									<span
										style={{
											...styles.statusIndicator,
											...styles.todoIndicator,
										}}
									></span>
									To Do
									<span style={styles.taskCount}>{todoTasks.length}</span>
								</h2>

								<div style={styles.columnContent}>
									{todoTasks.length === 0 && (
										<div style={styles.emptyState}>No tasks yet</div>
									)}

									{todoTasks.map((task) => (
										<div
											key={task.id}
											style={styles.taskCard}
											draggable
											onDragStart={() => handleDragStart(task)}
										>
											<h3 style={styles.taskTitle}>{task.title}</h3>

											{task.description && (
												<p style={styles.taskDescription}>{task.description}</p>
											)}

											<div style={styles.taskTags}>
												{renderPriorityTag(task.priority)}

												{task.dueDate && (
													<div
														style={{
															...styles.dueDateTag,
															color: formatDueDate(task.dueDate)?.color,
														}}
													>
														<ClockIcon /> {formatDueDate(task.dueDate)?.text}
													</div>
												)}

												{task.assignee && (
													<div style={styles.assigneeTag}>
														<UserIcon /> {task.assignee}
													</div>
												)}
											</div>

											<div style={styles.taskMeta}>
												<span>Created {formatDate(task.createdAt)}</span>
											</div>

											<div style={styles.taskActions}>
												<div style={styles.taskActionButtons}>
													<button
														style={styles.iconButton}
														onClick={() => setEditTask(task)}
														title="Edit task"
													>
														<EditIcon />
													</button>

													<button
														style={styles.iconButton}
														onClick={() => duplicateTask(task)}
														title="Duplicate task"
													>
														<CopyIcon />
													</button>

													<button
														style={styles.iconButton}
														onClick={() => deleteTask(task.id)}
														title="Delete task"
													>
														<TrashIcon />
													</button>
												</div>

												<div style={styles.moveButtons}>
													<button
														style={styles.disabledButton}
														disabled
														title="Move left (not available)"
													>
														<LeftArrowIcon />
													</button>

													<button
														style={styles.iconButton}
														onClick={() => moveTaskRight(task.id)}
														title="Move to In Progress"
													>
														<RightArrowIcon />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div
								style={{ ...styles.column, ...styles.inProgressColumn }}
								onDragOver={(e) => handleDragOver(e, "inProgress")}
								onDrop={handleDrop}
							>
								<h2 style={styles.columnHeader}>
									<span
										style={{
											...styles.statusIndicator,
											...styles.inProgressIndicator,
										}}
									></span>
									In Progress
									<span style={styles.taskCount}>{inProgressTasks.length}</span>
								</h2>

								<div style={styles.columnContent}>
									{inProgressTasks.length === 0 && (
										<div style={styles.emptyState}>No tasks in progress</div>
									)}

									{inProgressTasks.map((task) => (
										<div
											key={task.id}
											style={styles.taskCard}
											draggable
											onDragStart={() => handleDragStart(task)}
										>
											<h3 style={styles.taskTitle}>{task.title}</h3>

											{task.description && (
												<p style={styles.taskDescription}>{task.description}</p>
											)}

											<div style={styles.taskTags}>
												{renderPriorityTag(task.priority)}

												{task.dueDate && (
													<div
														style={{
															...styles.dueDateTag,
															color: formatDueDate(task.dueDate)?.color,
														}}
													>
														<ClockIcon /> {formatDueDate(task.dueDate)?.text}
													</div>
												)}

												{task.assignee && (
													<div style={styles.assigneeTag}>
														<UserIcon /> {task.assignee}
													</div>
												)}
											</div>

											<div style={styles.taskMeta}>
												<span>Created {formatDate(task.createdAt)}</span>
											</div>

											<div style={styles.taskActions}>
												<div style={styles.taskActionButtons}>
													<button
														style={styles.iconButton}
														onClick={() => setEditTask(task)}
														title="Edit task"
													>
														<EditIcon />
													</button>

													<button
														style={styles.iconButton}
														onClick={() => duplicateTask(task)}
														title="Duplicate task"
													>
														<CopyIcon />
													</button>

													<button
														style={styles.iconButton}
														onClick={() => deleteTask(task.id)}
														title="Delete task"
													>
														<TrashIcon />
													</button>
												</div>

												<div style={styles.moveButtons}>
													<button
														style={styles.iconButton}
														onClick={() => moveTaskLeft(task.id)}
														title="Move to To Do"
													>
														<LeftArrowIcon />
													</button>

													<button
														style={styles.iconButton}
														onClick={() => moveTaskRight(task.id)}
														title="Move to Done"
													>
														<RightArrowIcon />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Done Column */}
							<div
								style={{ ...styles.column, ...styles.doneColumn }}
								onDragOver={(e) => handleDragOver(e, "done")}
								onDrop={handleDrop}
							>
								<h2 style={styles.columnHeader}>
									<span
										style={{
											...styles.statusIndicator,
											...styles.doneIndicator,
										}}
									></span>
									Done
									<span style={styles.taskCount}>{doneTasks.length}</span>
								</h2>

								<div style={styles.columnContent}>
									{doneTasks.length === 0 && (
										<div style={styles.emptyState}>No completed tasks</div>
									)}

									{doneTasks.map((task) => (
										<div
											key={task.id}
											style={styles.taskCard}
											draggable
											onDragStart={() => handleDragStart(task)}
										>
											<h3 style={styles.taskTitle}>{task.title}</h3>

											{task.description && (
												<p style={styles.taskDescription}>{task.description}</p>
											)}

											<div style={styles.taskTags}>
												{renderPriorityTag(task.priority)}

												{task.dueDate && (
													<div
														style={{
															...styles.dueDateTag,
															color: formatDueDate(task.dueDate)?.color,
														}}
													>
														<ClockIcon /> {formatDueDate(task.dueDate)?.text}
													</div>
												)}

												{task.assignee && (
													<div style={styles.assigneeTag}>
														<UserIcon /> {task.assignee}
													</div>
												)}
											</div>

											<div style={styles.taskMeta}>
												<span>Created {formatDate(task.createdAt)}</span>
											</div>

											<div style={styles.taskActions}>
												<div style={styles.taskActionButtons}>
													<button
														style={styles.iconButton}
														onClick={() => setEditTask(task)}
														title="Edit task"
													>
														<EditIcon />
													</button>

													<button
														style={styles.iconButton}
														onClick={() => duplicateTask(task)}
														title="Duplicate task"
													>
														<CopyIcon />
													</button>

													<button
														style={styles.iconButton}
														onClick={() => deleteTask(task.id)}
														title="Delete task"
													>
														<TrashIcon />
													</button>
												</div>

												<div style={styles.moveButtons}>
													<button
														style={styles.iconButton}
														onClick={() => moveTaskLeft(task.id)}
														title="Move to In Progress"
													>
														<LeftArrowIcon />
													</button>

													<button
														style={styles.disabledButton}
														disabled
														title="Move right (not available)"
													>
														<RightArrowIcon />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</>
				)}

				{/* Projects Section */}
				{activeSection === "projects" && (
					<PlaceholderSection
						title="Projects"
						icon="📁"
						description="This is where you would manage all your team projects. Create new projects, assign team members, and track progress all in one place."
					/>
				)}

				{/* Team Section */}
				{activeSection === "team" && (
					<PlaceholderSection
						title="Team Management"
						icon="👥"
						description="Manage your team members, assign roles, and track individual contributions to projects and tasks."
					/>
				)}

				{/* Calendar Section */}
				{activeSection === "calendar" && (
					<PlaceholderSection
						title="Calendar View"
						icon="📅"
						description="View all your tasks and deadlines in a calendar format. Plan your work and see upcoming deadlines at a glance."
					/>
				)}

				{/* Reports Section */}
				{activeSection === "reports" && (
					<PlaceholderSection
						title="Reports & Analytics"
						icon="📊"
						description="Generate reports and view analytics about project progress, team performance, and task completion rates."
					/>
				)}
			</main>

			{/* Footer */}
			<footer style={styles.footer}>
				<div style={styles.footerContent}>
					<div style={styles.footerLinks}>
						<a
							href="#"
							style={styles.footerLink}
							onClick={(e) => handleUnimplementedFeature(e, "About")}
						>
							About
						</a>
						<a
							href="#"
							style={styles.footerLink}
							onClick={(e) => handleUnimplementedFeature(e, "Help")}
						>
							Help
						</a>
						<a
							href="#"
							style={styles.footerLink}
							onClick={(e) => handleUnimplementedFeature(e, "Terms")}
						>
							Terms
						</a>
						<a
							href="#"
							style={styles.footerLink}
							onClick={(e) => handleUnimplementedFeature(e, "Privacy")}
						>
							Privacy
						</a>
						<a
							href="#"
							style={styles.footerLink}
							onClick={(e) => handleUnimplementedFeature(e, "Contact")}
						>
							Contact
						</a>
					</div>

					<div style={styles.copyright}>
						© {new Date().getFullYear()} TaskBoard. All rights reserved.
					</div>
				</div>
			</footer>

			{/* Edit Task Modal */}
			{editTask && (
				<EditTaskModal
					task={editTask}
					onSave={saveEditedTask}
					onClose={() => setEditTask(null)}
				/>
			)}

			{/* Delete Task Modal */}
			{deleteTaskId && (
				<DeleteTaskModal
					taskId={deleteTaskId}
					taskTitle={deleteTaskTitle}
					onConfirm={confirmDeleteTask}
					onCancel={() => setDeleteTaskId(null)}
				/>
			)}

			{/* Toast Notification */}
			{toast.visible && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
				/>
			)}

			<style
				dangerouslySetInnerHTML={{
					__html: `
          :root {
            --bg-color: ${darkMode ? "#1a1a1a" : "#f9fafb"};
            --text-color: ${darkMode ? "#f1f1f1" : "#374151"};
            --card-bg: ${darkMode ? "#2d2d2d" : "#ffffff"};
            --header-bg: ${darkMode ? "#242424" : "#ffffff"};
            --footer-bg: ${darkMode ? "#242424" : "#f3f4f6"};
            --border-color: ${darkMode ? "#444" : "#e5e7eb"};
            --hover-color: ${darkMode ? "#383838" : "#f3f4f6"};
          }
          
          body {
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }
          
          * {
            box-sizing: border-box;
          }
          
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${darkMode ? "#2d2d2d" : "#f1f1f1"};
            border-radius: 8px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${darkMode ? "#555" : "#c1c1c1"};
            border-radius: 8px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${darkMode ? "#777" : "#a1a1a1"};
          }
          
          /* For drag and drop visual feedback */
          [draggable=true] {
            cursor: grab;
          }
          
          [draggable=true]:active {
            cursor: grabbing;
          }
          
          @keyframes slideInUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
          
          /* Column and header styling */
          .task-column {
            display: flex;
            flex-direction: column;
            height: 100%;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .column-header {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: var(--card-bg);
            margin: 0;
            width: 100%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          
          /* Make the headers take up full width */
          .column-header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: inherit;
            z-index: -1;
          }
          
          /* Select and input styling for modern appearance */
          select, input[type="text"], input[type="search"] {
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          
          select:hover, input[type="text"]:hover, input[type="search"]:hover {
            border-color: #4f46e5;
          }
          
          select:focus, input[type="text"]:focus, input[type="search"]:focus {
            border-color: #4f46e5;
            outline: none;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          }

          select {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
							darkMode ? "%23aaa" : "%23666"
						}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 16px;
            padding-right: 32px;
            transition: all 0.2s ease;
          }
          
          select:hover {
            border-color: #4f46e5;
            background-color: ${darkMode ? "#333" : "#f9fafb"};
          }
          
          select:focus {
            border-color: #4f46e5;
            outline: none;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
          }
          
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .modal-content {
            animation: modalFadeIn 0.3s ease forwards;
          }
        
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .date-cell:hover {
            background-color: ${darkMode ? "#374151" : "#f3f4f6"};
          }
          
          .date-cell.selected {
            background-color: #4f46e5;
            color: white;
          }
          
          .date-cell.today {
            border: 1px solid ${darkMode ? "#9ca3af" : "#9ca3af"};
          }

          /* Responsive Styles */
          /* Note: These selectors are general due to the inline style approach */
          @media (max-width: 1200px) {
            header nav {
               gap: 24px !important; /* Reduce gap between nav items */
            }
            header {
                padding: 16px 24px !important; /* Reduce header padding */
            }
          }

          @media (max-width: 1024px) {
            /* Stack columns vertically */
            div[data-testid="columns-container"] {
              grid-template-columns: 1fr !important;
              gap: 32px !important; 
            }
            /* Allow columns to grow */
            div[style*="max-height: calc(100vh - 300px)"] {
              max-height: none !important; 
              min-height: auto !important;
            }
            /* Stack toolbar items */
            div[style*="justify-content: space-between"][style*="flexWrap: wrap"] {
                flex-direction: column !important; 
                align-items: stretch !important;
            }
            /* Space out filters */
            div[style*="gap: 16px"][style*="flexWrap: wrap"] {
                justify-content: space-between !important; 
            }
            /* Make search input full width */
            input[type="text"][placeholder="Search tasks..."] {
                width: 100% !important;
            }
            /* Stack form row items */
            div[style*="gap: 16px"][style*="marginBottom: 16px"] {
              flex-direction: column !important; 
              gap: 16px !important;
            }
            /* Hide regular nav on smaller screens */
            header nav {
                display: none !important; 
            }
            /* Show hamburger menu on smaller screens */
            .mobile-menu-button {
                display: flex !important;
            }
            /* Adjust header padding */
            header {
                padding: 12px 16px !important;
            }
            /* Adjust page title size */
            h1[style*="font-size: 28px"] {
                font-size: 24px !important;
            }
            /* Adjust action button style */
            button[style*="padding: 10px 18px"] {
                padding: 8px 14px !important;
                font-size: 13px !important;
            }
            /* Adjust modal content width/padding */
            div[style*="max-width: 600px"], div[style*="max-width: 500px"] {
                width: 95% !important;
                padding: 20px !important;
            }
            /* Stack footer items */
            footer > div {
                flex-direction: column !important; 
                align-items: center !important;
                text-align: center !important;
            }
          }

          @media (max-width: 768px) {
            /* Further reduce header padding */
            header {
                padding: 12px 16px !important;
            }
            /* Adjust logo size */
            a[style*="font-size: 24px"] {
                font-size: 20px !important;
            }
            span[style*="font-size: 28px"] {
                font-size: 24px !important;
            }
            /* Adjust avatar size */
            div[style*="width: 32px"] {
                width: 28px !important;
                height: 28px !important;
                font-size: 12px !important;
            }
            /* Reduce main padding */
            main {
                padding: 24px 16px !important; 
            }
            /* Adjust page header margin */
            div[style*="margin-bottom: 32px"] {
                margin-bottom: 24px !important;
            }
            /* Adjust page title size */
            h1[style*="font-size: 28px"] {
                font-size: 22px !important;
            }
            /* Adjust add task container padding */
            div[style*="padding: 24px"][style*="border-radius: 12px"] {
                padding: 16px !important;
            }
            /* Adjust form title style */
            h2[style*="font-size: 18px"] {
                font-size: 16px !important;
                margin-bottom: 16px !important;
            }
            /* Adjust task card padding */
            div[style*="padding: 16px"][style*="margin-bottom: 16px"] {
                padding: 12px !important;
            }
            /* Adjust task title size */
            h3[style*="font-size: 15px"] {
                font-size: 14px !important;
            }
            /* Adjust task description size */
            p[style*="font-size: 14px"][style*="line-height: 1.5"] {
                font-size: 13px !important;
            }
            /* Adjust toast position/width */
            div[style*="position: fixed"][style*="bottom: 24px"] {
                bottom: 16px !important;
                right: 16px !important;
                left: 16px !important; 
                width: auto !important;
                max-width: none !important;
            }
          }

          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .modal-content {
            animation: modalFadeIn 0.3s ease forwards;
          }
        
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .date-cell:hover {
            background-color: ${darkMode ? "#374151" : "#f3f4f6"};
          }
          
          .date-cell.selected {
            background-color: #4f46e5;
            color: white;
          }
          
          .date-cell.today {
            border: 1px solid ${darkMode ? "#9ca3af" : "#9ca3af"};
          }
        `,
				}}
			/>
		</div>
	);
}
