"use client";
import React, {
	useState,
	useMemo,
	FC,
	ChangeEvent,
	FormEvent,
	createContext,
	useContext,
	useCallback,
} from "react";
import {
	FiChevronLeft,
	FiFolder,
	FiBarChart,
	FiGrid,
	FiFlag,
	FiCheckCircle,
	FiXCircle,
	FiThumbsUp,
	FiThumbsDown,
	FiStar,
	FiPlus,
	FiAlertTriangle,
	FiX,
	FiInfo,
} from "react-icons/fi";

type Status = "To Do" | "In Progress" | "Done";
type Priority = "Low" | "Medium" | "High";
type ToastType = "success" | "error" | "warning" | "info";

interface Comment {
	id: string;
	author: string;
	text: string;
	timestamp: string;
}

interface Blocker {
	id: string;
	title: string;
	resolved: boolean;
	comments: Comment[];
}

interface TimelineEvent {
	id: string;
	description: string;
	date: string;
}

interface Task {
	id: string;
	content: string;
	isCompleted: boolean;
	feedback?: "positive" | "negative";
	rating?: number;
}

interface Goal {
	id: string;
	title: string;
	description: string;
	status: Status;
	priority: Priority;
	tasks: Task[];
	blockers: Blocker[];
	timeline: TimelineEvent[];
}

interface Project {
	id: string;
	name: string;
	owner: string;
	goals: Goal[];
}

interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
}

interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};

const currentUser = "Current User";

const initialProjects: Project[] = [
	{
		id: "proj-1",
		name: "Website Redesign",
		owner: "Alice Johnson",
		goals: [
			{
				id: "goal-1",
				title: "Develop New Homepage",
				description: "Create a modern and responsive homepage.",
				status: "In Progress",
				priority: "High",
				tasks: [
					{
						id: "task-1-1",
						content: "Design wireframes",
						isCompleted: true,
						feedback: "positive",
						rating: 5,
					},
					{
						id: "task-1-2",
						content: "Develop UI components",
						isCompleted: true,
						feedback: "positive",
						rating: 4,
					},
					{ id: "task-1-3", content: "Integrate with CMS", isCompleted: false },
					{
						id: "task-1-4",
						content: "Perform usability testing",
						isCompleted: false,
					},
				],
				blockers: [
					{
						id: "blocker-1",
						title: "CMS API is not ready",
						resolved: false,
						comments: [
							{
								id: "c-1",
								author: "Bob",
								text: "Waiting on backend team. ETA is next Friday.",
								timestamp: "2023-10-26T10:00:00Z",
							},
						],
					},
				],
				timeline: [
					{
						id: "event-1",
						description: "Kick-off meeting",
						date: "2023-10-01",
					},
					{
						id: "event-2",
						description: "Wireframes approved",
						date: "2023-10-10",
					},
				],
			},
			{
				id: "goal-2",
				title: "Implement User Authentication",
				description: "Set up secure login and registration.",
				status: "To Do",
				priority: "High",
				tasks: [
					{
						id: "task-2-1",
						content: "Choose OAuth provider",
						isCompleted: false,
					},
					{
						id: "task-2-2",
						content: "Build registration form",
						isCompleted: false,
					},
					{
						id: "task-2-3",
						content: "Set up password recovery",
						isCompleted: false,
					},
				],
				blockers: [],
				timeline: [],
			},
			{
				id: "goal-3",
				title: "Setup Blog Section",
				description: "Create a fully functional blog with categories and tags.",
				status: "Done",
				priority: "Medium",
				tasks: [
					{
						id: "task-3-1",
						content: "Design blog layout",
						isCompleted: true,
						feedback: "positive",
						rating: 5,
					},
					{
						id: "task-3-2",
						content: "Develop post template",
						isCompleted: true,
						feedback: "positive",
						rating: 5,
					},
					{
						id: "task-3-3",
						content: "Implement comment system",
						isCompleted: true,
						feedback: "negative",
						rating: 3,
					},
				],
				blockers: [],
				timeline: [
					{
						id: "event-3",
						description: "Project completed",
						date: "2023-09-15",
					},
				],
			},
		],
	},
	{
		id: "proj-2",
		name: "Mobile App Launch",
		owner: "Charles Davis",
		goals: [
			{
				id: "goal-4",
				title: "Finalize App Store Creatives",
				description:
					"Screenshots, videos, and descriptions for both App Store and Google Play.",
				status: "In Progress",
				priority: "Medium",
				tasks: [
					{
						id: "task-4-1",
						content: "Create iPhone screenshots",
						isCompleted: true,
						feedback: "positive",
						rating: 4,
					},
					{
						id: "task-4-2",
						content: "Create Android screenshots",
						isCompleted: false,
					},
					{ id: "task-4-3", content: "Record promo video", isCompleted: false },
				],
				blockers: [],
				timeline: [],
			},
			{
				id: "goal-5",
				title: "Beta Testing Phase 2",
				description: "Roll out beta to a wider audience and collect feedback.",
				status: "To Do",
				priority: "High",
				tasks: [
					{
						id: "task-5-1",
						content: "Identify beta testers",
						isCompleted: false,
					},
					{ id: "task-5-2", content: "Deploy beta build", isCompleted: false },
				],
				blockers: [],
				timeline: [],
			},
		],
	},
];

const STATUS_COLORS: { [key in Status]: string } = {
	"To Do": "bg-[#F2F0EF] text-[#733E24] border-[#BBBDBC]/60",
	"In Progress":
		"bg-gradient-to-r from-[#245F73] to-[#245F73]/90 text-white border-[#245F73]",
	Done: "bg-gradient-to-r from-[#733E24] to-[#733E24]/90 text-white border-[#733E24]",
};

const PRIORITY_COLORS: { [key in Priority]: string } = {
	Low: "bg-[#F2F0EF] text-[#733E24]",
	Medium: "bg-gradient-to-r from-[#245F73] to-[#245F73]/90 text-white",
	High: "bg-gradient-to-r from-[#733E24] to-[#733E24]/90 text-white",
};

const Sidebar: FC<{
	projects: Project[];
	activeProjectId: string;
	onSelectProject: (id: string) => void;
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
	onAddProject: () => void;
}> = ({
	projects,
	activeProjectId,
	onSelectProject,
	isCollapsed,
	setIsCollapsed,
	onAddProject,
}) => {
	const truncateText = (text: string, maxLength: number) => {
		return text.length > maxLength
			? text.substring(0, maxLength) + "..."
			: text;
	};
	return (
		<div
			className={`flex flex-col bg-white/98 backdrop-blur-xl border-r border-[#BBBDBC]/60 shadow-2xl transition-all duration-300 ease-in-out ${
				isCollapsed ? "w-20" : "w-80"
			}`}
		>
			<div
				className={`flex items-center h-24 px-6 border-b border-[#BBBDBC]/40 bg-gradient-to-r from-[#245F73] to-[#245F73]/90 ${
					isCollapsed ? "justify-center" : "justify-between"
				}`}
			>
				{!isCollapsed && (
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
							<FiFolder className="w-5 h-5 text-white" />
						</div>
						<span className="text-2xl font-bold text-white font-primary tracking-tight">
							Projects
						</span>
					</div>
				)}
				{isCollapsed && (
					<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center opacity-0 absolute">
						<FiFolder className="w-5 h-5 text-white" />
					</div>
				)}
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="p-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 hover:shadow-lg"
				>
					<FiChevronLeft
						className={`w-5 h-5 text-white transition-transform duration-300 ${
							isCollapsed ? "rotate-180" : "rotate-0"
						}`}
					/>
				</button>
			</div>
			{!isCollapsed && (
				<>
					<nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar min-h-0">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xs font-bold text-[#245F73] uppercase tracking-widest font-secondary">
								Active Projects
							</h3>
							<button
								onClick={onAddProject}
								className="p-2 rounded-xl hover:bg-[#245F73]/10 transition-all duration-200 group"
								title="Add new project"
							>
								<FiPlus className="w-4 h-4 text-[#245F73] group-hover:scale-110 transition-transform duration-200" />
							</button>
						</div>
						{projects.map((project) => (
							<button
								key={project.id}
								onClick={() => onSelectProject(project.id)}
								className={`w-full flex items-center p-4 rounded-2xl text-sm font-medium transition-all duration-200 font-secondary ${
									activeProjectId === project.id
										? "bg-gradient-to-r from-[#245F73] to-[#245F73]/90 text-white shadow-xl shadow-[#245F73]/20"
										: "hover:bg-[#F2F0EF] text-[#245F73] hover:text-[#245F73] hover:shadow-lg border border-transparent hover:border-[#BBBDBC]/60"
								}`}
							>
								<FiFolder
									className={`w-5 h-5 ${
										activeProjectId === project.id
											? "text-white"
											: "text-[#245F73]"
									}`}
								/>
								<div className="ml-4 text-left min-w-0 flex-1">
									<div className="font-bold text-base" title={project.name}>
										{truncateText(project.name, 20)}
									</div>
									<div className="text-xs font-medium opacity-75 font-small mt-1">
										{project.owner === currentUser ? "You" : project.owner}
									</div>
								</div>
							</button>
						))}
					</nav>
					<div className="p-6 border-t border-[#BBBDBC]/40 flex-shrink-0">
						<div className="bg-[#F2F0EF]/80 rounded-2xl p-4">
							<h4 className="text-sm font-bold text-[#245F73] font-secondary mb-3 tracking-wide">
								Quick Stats
							</h4>
							<div className="space-y-2 text-xs font-medium text-[#733E24] font-small">
								<div className="flex justify-between">
									<span>Total Goals:</span>
									<span className="font-bold">
										{projects.reduce((acc, p) => acc + p.goals.length, 0)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>In Progress:</span>
									<span className="font-bold">
										{projects.reduce(
											(acc, p) =>
												acc +
												p.goals.filter((g) => g.status === "In Progress")
													.length,
											0
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

const ProgressCircle: FC<{ percentage: number }> = ({ percentage }) => {
	const radius = 20;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<div className="relative w-12 h-12">
			<svg className="w-full h-full" viewBox="0 0 50 50">
				<circle
					className="text-[#F2F0EF]"
					strokeWidth="5"
					stroke="currentColor"
					fill="transparent"
					r={radius}
					cx="25"
					cy="25"
				/>
				<circle
					className="text-[#245F73]"
					strokeWidth="5"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					stroke="currentColor"
					fill="transparent"
					r={radius}
					cx="25"
					cy="25"
					transform="rotate(-90 25 25)"
				/>
			</svg>
			<span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#245F73]">
				{Math.round(percentage)}%
			</span>
		</div>
	);
};

const CustomCheckbox: FC<{
	checked: boolean;
	onChange: () => void;
	className?: string;
}> = ({ checked, onChange, className = "" }) => {
	return (
		<button
			onClick={onChange}
			className={`relative w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center group ${
				checked
					? "bg-gradient-to-r from-[#245F73] to-[#245F73]/90 border-[#245F73] shadow-lg shadow-[#245F73]/20"
					: "bg-white/90 border-[#BBBDBC]/60 hover:border-[#245F73]/60 hover:bg-[#F2F0EF]/90 hover:shadow-md"
			} ${className}`}
		>
			{checked && (
				<svg
					className="w-3 h-3 text-white transform scale-100 transition-all duration-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="3"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			)}
			<div
				className={`absolute inset-0 rounded-lg transition-all duration-300 ${
					checked
						? "bg-gradient-to-r from-[#245F73]/10 to-transparent"
						: "group-hover:bg-[#245F73]/5"
				}`}
			/>
		</button>
	);
};

const TaskItem: FC<{
	task: Task;
	onToggle: (taskId: string) => void;
	onRate: (taskId: string, rating: number) => void;
	onFeedback: (taskId: string, feedback: "positive" | "negative") => void;
	isOwner: boolean;
}> = ({ task, onToggle, onRate, onFeedback, isOwner }) => {
	const { addToast } = useToast();

	const handleRateClick = (star: number) => {
		if (isOwner) {
			onRate(task.id, star);
		} else {
			addToast({
				type: "warning",
				title: "Rating Restricted",
				message: "Only project owners can rate tasks.",
				duration: 3000,
			});
		}
	};

	const handleFeedbackClick = (feedback: "positive" | "negative") => {
		if (isOwner) {
			onFeedback(task.id, feedback);
		} else {
			addToast({
				type: "warning",
				title: "Feedback Restricted",
				message: "Only project owners can provide task feedback.",
				duration: 3000,
			});
		}
	};

	return (
		<div className="flex items-center justify-between py-3 px-3 rounded-xl group hover:bg-[#F2F0EF]/80 transition-all duration-200">
			<div className="flex items-center flex-1">
				<CustomCheckbox
					checked={task.isCompleted}
					onChange={() => onToggle(task.id)}
					className="flex-shrink-0"
				/>
				<span
					className={`ml-3 text-sm font-medium font-small flex-1 ${
						task.isCompleted ? "line-through text-[#BBBDBC]" : "text-[#245F73]"
					}`}
				>
					{task.content}
				</span>
			</div>
			{task.isCompleted && (
				<div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
					<div className="flex">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								onClick={() => handleRateClick(star)}
								className={`hover:scale-110 transition-transform duration-150 ${
									isOwner ? "cursor-pointer" : "cursor-default"
								}`}
							>
								<FiStar
									className={`w-4 h-4 ${
										task.rating && star <= task.rating
											? "text-[#733E24]"
											: "text-[#BBBDBC] hover:text-[#733E24]"
									}`}
								/>
							</button>
						))}
					</div>
					<button
						onClick={() => handleFeedbackClick("positive")}
						className={`hover:scale-110 transition-transform duration-150 ${
							isOwner ? "cursor-pointer" : "cursor-default"
						}`}
					>
						<FiThumbsUp
							className={`w-4 h-4 ${
								task.feedback === "positive"
									? "text-[#733E24]"
									: "text-[#BBBDBC] hover:text-[#733E24]"
							}`}
						/>
					</button>
					<button
						onClick={() => handleFeedbackClick("negative")}
						className={`hover:scale-110 transition-transform duration-150 ${
							isOwner ? "cursor-pointer" : "cursor-default"
						}`}
					>
						<FiThumbsDown
							className={`w-4 h-4 ${
								task.feedback === "negative"
									? "text-[#733E24]"
									: "text-[#BBBDBC] hover:text-[#733E24]"
							}`}
						/>
					</button>
				</div>
			)}
		</div>
	);
};

const TaskItemCard: FC<{
	task: Task;
	onToggle: (taskId: string) => void;
	onRate: (taskId: string, rating: number) => void;
	onFeedback: (taskId: string, feedback: "positive" | "negative") => void;
	isOwner: boolean;
}> = ({ task, onToggle, onRate, onFeedback, isOwner }) => {
	const { addToast } = useToast();

	const truncateText = (text: string, maxLength: number) => {
		return text.length > maxLength
			? text.substring(0, maxLength) + "..."
			: text;
	};

	const handleRateClick = (star: number) => {
		if (isOwner) {
			onRate(task.id, star);
		} else {
			addToast({
				type: "warning",
				title: "Rating Restricted",
				message: "Only project owners can rate tasks.",
				duration: 3000,
			});
		}
	};

	const handleFeedbackClick = (feedback: "positive" | "negative") => {
		if (isOwner) {
			onFeedback(task.id, feedback);
		} else {
			addToast({
				type: "warning",
				title: "Feedback Restricted",
				message: "Only project owners can provide task feedback.",
				duration: 3000,
			});
		}
	};

	return (
		<div className="flex items-center justify-between py-2 px-2 rounded-lg group hover:bg-[#F2F0EF]/60 transition-all duration-200">
			<div className="flex items-center flex-1 min-w-0">
				<CustomCheckbox
					checked={task.isCompleted}
					onChange={() => onToggle(task.id)}
					className="flex-shrink-0"
				/>
				<span
					className={`ml-2 text-xs font-medium font-small flex-1 min-w-0 ${
						task.isCompleted ? "line-through text-[#BBBDBC]" : "text-[#245F73]"
					}`}
					title={task.content}
				>
					{truncateText(task.content, 25)}
				</span>
			</div>
			{task.isCompleted && (
				<div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
					<div className="flex">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								onClick={() => handleRateClick(star)}
								className={`hover:scale-110 transition-transform duration-150 ${
									isOwner ? "cursor-pointer" : "cursor-default"
								}`}
							>
								<FiStar
									className={`w-3 h-3 ${
										task.rating && star <= task.rating
											? "text-[#733E24]"
											: "text-[#BBBDBC] hover:text-[#733E24]"
									}`}
								/>
							</button>
						))}
					</div>
					<button
						onClick={() => handleFeedbackClick("positive")}
						className={`hover:scale-110 transition-transform duration-150 ${
							isOwner ? "cursor-pointer" : "cursor-default"
						}`}
					>
						<FiThumbsUp
							className={`w-3 h-3 ${
								task.feedback === "positive"
									? "text-[#733E24]"
									: "text-[#BBBDBC] hover:text-[#733E24]"
							}`}
						/>
					</button>
					<button
						onClick={() => handleFeedbackClick("negative")}
						className={`hover:scale-110 transition-transform duration-150 ${
							isOwner ? "cursor-pointer" : "cursor-default"
						}`}
					>
						<FiThumbsDown
							className={`w-3 h-3 ${
								task.feedback === "negative"
									? "text-[#733E24]"
									: "text-[#BBBDBC] hover:text-[#733E24]"
							}`}
						/>
					</button>
				</div>
			)}
		</div>
	);
};

const GoalCard: FC<{
	goal: Goal;
	onUpdateGoal: (updatedGoal: Goal) => void;
	onOpenModal: (goal: Goal) => void;
	isOwner: boolean;
}> = ({ goal, onUpdateGoal, onOpenModal, isOwner }) => {
	const { addToast } = useToast();
	const [isAddingTask, setIsAddingTask] = useState(false);
	const [newTaskContent, setNewTaskContent] = useState("");

	const completionPercentage = useMemo(() => {
		if (goal.tasks.length === 0) return 0;
		const completedTasks = goal.tasks.filter((t) => t.isCompleted).length;
		return (completedTasks / goal.tasks.length) * 100;
	}, [goal.tasks]);

	const handleToggleTask = (taskId: string) => {
		const updatedTasks = goal.tasks.map((task) =>
			task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
		);
		const task = goal.tasks.find((t) => t.id === taskId);
		const isCompleted = !task?.isCompleted;

		let updatedTimeline = [...goal.timeline];
		if (isCompleted && task) {
			const newTimelineEvent: TimelineEvent = {
				id: `event-${Date.now()}`,
				description: `Task completed: ${task.content}`,
				date: new Date().toISOString().split("T")[0],
			};
			updatedTimeline = [...goal.timeline, newTimelineEvent];
		}

		onUpdateGoal({ ...goal, tasks: updatedTasks, timeline: updatedTimeline });

		addToast({
			type: isCompleted ? "success" : "info",
			title: isCompleted
				? `Task "${task?.content}" completed`
				: `Task "${task?.content}" reopened`,
			duration: 2500,
		});
	};

	const handleRateTask = (taskId: string, rating: number) => {
		const updatedTasks = goal.tasks.map((task) =>
			task.id === taskId ? { ...task, rating } : task
		);
		const task = goal.tasks.find((t) => t.id === taskId);

		onUpdateGoal({ ...goal, tasks: updatedTasks });

		addToast({
			type: "success",
			title: `Task rated ${rating} star${rating > 1 ? "s" : ""}`,
			duration: 2500,
		});
	};

	const handleFeedback = (
		taskId: string,
		feedback: "positive" | "negative"
	) => {
		const updatedTasks = goal.tasks.map((task) =>
			task.id === taskId ? { ...task, feedback } : task
		);
		const task = goal.tasks.find((t) => t.id === taskId);

		onUpdateGoal({ ...goal, tasks: updatedTasks });

		addToast({
			type: feedback === "positive" ? "success" : "warning",
			title:
				feedback === "positive"
					? "Positive feedback recorded"
					: "Feedback recorded",
			duration: 2500,
		});
	};

	const handleAddTask = (e: FormEvent) => {
		e.preventDefault();
		if (!newTaskContent.trim()) return;

		const newTask: Task = {
			id: `task-${Date.now()}`,
			content: newTaskContent.trim(),
			isCompleted: false,
		};

		const updatedGoal = { ...goal, tasks: [...goal.tasks, newTask] };
		onUpdateGoal(updatedGoal);
		setNewTaskContent("");
		setIsAddingTask(false);

		addToast({
			type: "success",
			title: `Task "${newTaskContent.trim()}" added`,
			duration: 2500,
		});
	};

	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("text/plain", goal.id);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragEnd = (e: React.DragEvent) => {
		e.dataTransfer.clearData();
	};

	const truncateText = (text: string, maxLength: number) => {
		return text.length > maxLength
			? text.substring(0, maxLength) + "..."
			: text;
	};

	return (
		<div
			className="bg-white rounded-2xl shadow-lg border border-[#BBBDBC]/60 p-6 space-y-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
			onClick={() => onOpenModal(goal)}
			draggable={isOwner}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="flex justify-between items-start">
				<div className="flex-1 min-w-0">
					<h3
						className="font-bold text-[#245F73] font-primary text-xl leading-tight mb-3"
						title={goal.title}
					>
						{truncateText(goal.title, 40)}
					</h3>
					<p
						className="text-sm font-medium text-[#733E24] font-small leading-relaxed"
						title={goal.description}
					>
						{truncateText(goal.description, 120)}
					</p>
				</div>
				<div className="flex items-center space-x-2 ml-4 flex-shrink-0">
					{goal.blockers.some((b) => !b.resolved) && (
						<div className="relative">
							<FiAlertTriangle
								className="w-5 h-5 text-[#733E24]"
								title="Active blockers"
							/>
							<div className="absolute -top-1 -right-1 w-2 h-2 bg-[#733E24] rounded-full"></div>
						</div>
					)}
					<div
						className={`px-3 py-1.5 rounded-full text-xs font-bold font-secondary ${
							PRIORITY_COLORS[goal.priority]
						}`}
					>
						{goal.priority}
					</div>
				</div>
			</div>

			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<span
						className={`px-4 py-2 text-xs font-bold rounded-full ${
							STATUS_COLORS[goal.status]
						} font-secondary shadow-sm`}
					>
						{goal.status}
					</span>
				</div>
				<ProgressCircle percentage={completionPercentage} />
			</div>

			<div className="border-t border-[#BBBDBC]/40 pt-4">
				<div className="flex items-center justify-between mb-3">
					<h4 className="text-sm font-bold text-[#245F73] font-secondary">
						Tasks
					</h4>
					<div className="flex items-center space-x-2">
						<span className="text-xs font-bold text-[#733E24] font-small">
							{goal.tasks.filter((t) => t.isCompleted).length}/
							{goal.tasks.length} completed
						</span>
						{isOwner && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									setIsAddingTask(!isAddingTask);
								}}
								className="p-1.5 rounded-lg hover:bg-[#245F73]/10 transition-all duration-200 group-hover:opacity-100 opacity-0"
								title="Add task"
							>
								<FiPlus className="w-4 h-4 text-[#245F73]" />
							</button>
						)}
					</div>
				</div>

				{isAddingTask && (
					<form
						onSubmit={handleAddTask}
						className="mb-4 p-3 bg-[#F2F0EF]/60 rounded-xl border border-[#BBBDBC]/40"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center flex-wrap gap-2">
							<input
								type="text"
								placeholder="Enter task..."
								value={newTaskContent}
								onChange={(e) => setNewTaskContent(e.target.value)}
								className="flex-1 bg-white/80 border border-[#BBBDBC]/40 rounded-lg px-3 py-2 text-sm font-medium font-small text-[#245F73] placeholder-[#733E24]/50 focus:outline-none focus:border-[#245F73] focus:bg-white"
								autoFocus
							/>
							<button
								type="submit"
								className="px-3 py-2 bg-gradient-to-r from-[#245F73] to-[#245F73]/90 text-white rounded-lg text-xs font-bold font-secondary hover:shadow-lg transition-all duration-200"
							>
								Add
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									setIsAddingTask(false);
									setNewTaskContent("");
								}}
								className="px-3 py-2 bg-white/80 text-[#733E24] rounded-lg text-xs font-bold font-secondary border border-[#BBBDBC]/40 hover:bg-white transition-all duration-200"
							>
								Cancel
							</button>
						</div>
					</form>
				)}

				<div className="space-y-1">
					{goal.tasks.slice(0, 3).map((task) => (
						<div key={task.id} onClick={(e) => e.stopPropagation()}>
							<TaskItemCard
								task={task}
								onToggle={handleToggleTask}
								onRate={handleRateTask}
								onFeedback={handleFeedback}
								isOwner={isOwner}
							/>
						</div>
					))}
					{goal.tasks.length > 3 && (
						<div className="text-xs font-bold text-[#733E24] font-small text-center py-2">
							+{goal.tasks.length - 3} more tasks
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const KanbanColumn: FC<{
	title: Status;
	goals: Goal[];
	onUpdateGoal: (updatedGoal: Goal) => void;
	onOpenModal: (goal: Goal) => void;
	isOwner: boolean;
	onDragOver: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent, status: Status) => void;
}> = ({
	title,
	goals,
	onUpdateGoal,
	onOpenModal,
	isOwner,
	onDragOver,
	onDrop,
}) => {
	const getStatusColor = (status: Status) => {
		switch (status) {
			case "To Do":
				return "bg-[#F2F0EF] border-[#BBBDBC]/60 text-[#733E24]";
			case "In Progress":
				return "bg-gradient-to-r from-[#245F73] to-[#245F73]/90 border-[#245F73] text-white";
			case "Done":
				return "bg-gradient-to-r from-[#733E24] to-[#733E24]/90 border-[#733E24] text-white";
		}
	};

	return (
		<div
			className="flex-1 min-w-80 bg-white/98 backdrop-blur-xl rounded-3xl shadow-xl border border-[#BBBDBC]/60 flex flex-col"
			onDragOver={onDragOver}
			onDrop={(e) => onDrop(e, title)}
		>
			<div
				className={`p-6 border-b border-[#BBBDBC]/40 ${getStatusColor(
					title
				)} rounded-t-3xl`}
			>
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold font-primary tracking-tight">
						{title}
					</h2>
					<div className="flex items-center space-x-2">
						<span className="text-lg font-bold font-secondary">
							{goals.length}
						</span>
						<div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
					</div>
				</div>
			</div>
			<div className="flex-1 p-6 space-y-4 overflow-y-auto">
				{goals.length === 0 ? (
					<div className="text-center py-8">
						<div className="w-16 h-16 bg-[#F2F0EF]/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<FiFolder className="w-8 h-8 text-[#BBBDBC]" />
						</div>
						<p className="text-sm font-medium text-[#733E24] font-small">
							No goals in this status
						</p>
					</div>
				) : (
					goals.map((goal) => (
						<GoalCard
							key={goal.id}
							goal={goal}
							onUpdateGoal={onUpdateGoal}
							onOpenModal={onOpenModal}
							isOwner={isOwner}
						/>
					))
				)}
			</div>
		</div>
	);
};

const Filters: FC<{
	statusFilter: Status | "All";
	priorityFilter: Priority | "All";
	onStatusChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	onPriorityChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}> = ({ statusFilter, priorityFilter, onStatusChange, onPriorityChange }) => {
	return (
		<div className="flex items-center space-x-6 mb-8">
			<div>
				<label
					htmlFor="status"
					className="text-sm font-semibold text-[#D4DE95] mr-3 font-secondary"
				>
					Status:
				</label>
				<select
					id="status"
					value={statusFilter}
					onChange={onStatusChange}
					className="rounded-xl border-[#636B2F] shadow-lg focus:border-[#D4DE95] focus:ring-[#D4DE95] text-sm font-tertiary px-4 py-2 bg-[#3D4127]/80 backdrop-blur-sm text-[#D4DE95] border-[#636B2F]/50"
				>
					<option value="All">All</option>
					<option value="To Do">To Do</option>
					<option value="In Progress">In Progress</option>
					<option value="Done">Done</option>
				</select>
			</div>
			<div>
				<label
					htmlFor="priority"
					className="text-sm font-semibold text-[#D4DE95] mr-3 font-secondary"
				>
					Priority:
				</label>
				<select
					id="priority"
					value={priorityFilter}
					onChange={onPriorityChange}
					className="rounded-xl border-[#636B2F] shadow-lg focus:border-[#D4DE95] focus:ring-[#D4DE95] text-sm font-tertiary px-4 py-2 bg-[#3D4127]/80 backdrop-blur-sm text-[#D4DE95] border-[#636B2F]/50"
				>
					<option value="All">All</option>
					<option value="Low">Low</option>
					<option value="Medium">Medium</option>
					<option value="High">High</option>
				</select>
			</div>
		</div>
	);
};

const KanbanBoard: FC<{
	project: Project;
	onUpdateProject: (updatedProject: Project) => void;
	onOpenModal: (goal: Goal) => void;
	isOwner: boolean;
}> = ({ project, onUpdateProject, onOpenModal, isOwner }) => {
	const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
	const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
	const { addToast } = useToast();

	const filteredGoals = useMemo(() => {
		return project.goals.filter((goal) => {
			const statusMatch =
				statusFilter === "All" || goal.status === statusFilter;
			const priorityMatch =
				priorityFilter === "All" || goal.priority === priorityFilter;
			return statusMatch && priorityMatch;
		});
	}, [project.goals, statusFilter, priorityFilter]);

	const handleUpdateGoal = (updatedGoal: Goal) => {
		const updatedGoals = project.goals.map((g) =>
			g.id === updatedGoal.id ? updatedGoal : g
		);
		onUpdateProject({ ...project, goals: updatedGoals });
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (e: React.DragEvent, newStatus: Status) => {
		e.preventDefault();
		const goalId = e.dataTransfer.getData("text/plain");
		if (goalId) {
			const goal = project.goals.find((g) => g.id === goalId);
			if (goal && goal.status !== newStatus) {
				const updatedGoal = { ...goal, status: newStatus };
				const updatedGoals = project.goals.map((g) =>
					g.id === goalId ? updatedGoal : g
				);
				onUpdateProject({ ...project, goals: updatedGoals });

				addToast({
					type: "success",
					title: `Goal moved to ${newStatus}`,
					duration: 2500,
				});
			}
		}
		e.dataTransfer.clearData();
	};

	const columns: Status[] = ["To Do", "In Progress", "Done"];

	return (
		<div className="flex flex-col h-full">
			{}
			<div className="bg-white/90 backdrop-blur-sm border-b border-[#BBBDBC]/60 px-8 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-6">
						<div>
							<label
								htmlFor="status"
								className="text-sm font-bold text-[#245F73] mr-3 font-secondary"
							>
								Status:
							</label>
							<select
								id="status"
								value={statusFilter}
								onChange={(e) =>
									setStatusFilter(e.target.value as Status | "All")
								}
								className="rounded-xl border-[#BBBDBC]/60 shadow-sm focus:border-[#245F73] focus:ring-[#245F73] text-sm font-medium font-small px-4 py-2 bg-white text-[#245F73]"
							>
								<option value="All">All Statuses</option>
								<option value="To Do">To Do</option>
								<option value="In Progress">In Progress</option>
								<option value="Done">Done</option>
							</select>
						</div>
						<div>
							<label
								htmlFor="priority"
								className="text-sm font-bold text-[#245F73] mr-3 font-secondary"
							>
								Priority:
							</label>
							<select
								id="priority"
								value={priorityFilter}
								onChange={(e) =>
									setPriorityFilter(e.target.value as Priority | "All")
								}
								className="rounded-xl border-[#BBBDBC]/60 shadow-sm focus:border-[#245F73] focus:ring-[#245F73] text-sm font-medium font-small px-4 py-2 bg-white text-[#245F73]"
							>
								<option value="All">All Priorities</option>
								<option value="Low">Low</option>
								<option value="Medium">Medium</option>
								<option value="High">High</option>
							</select>
						</div>
					</div>
					<div className="text-sm font-medium text-[#733E24] font-small">
						Showing {filteredGoals.length} of {project.goals.length} goals
					</div>
				</div>
			</div>

			{}
			<div className="flex-1 flex gap-6 p-8 overflow-x-auto">
				{columns.map((status) => (
					<KanbanColumn
						key={status}
						title={status}
						goals={filteredGoals.filter((g) => g.status === status)}
						onUpdateGoal={handleUpdateGoal}
						onOpenModal={onOpenModal}
						isOwner={isOwner}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					/>
				))}
			</div>
		</div>
	);
};

const ChartView: FC<{ project: Project }> = ({ project }) => {
	const [chartType, setChartType] = useState<"goals" | "tasks" | "completion">(
		"goals"
	);
	const { addToast } = useToast();

	const chartData = useMemo(() => {
		if (chartType === "goals") {
			const statuses: Status[] = ["To Do", "In Progress", "Done"];
			const data = statuses.map((status) => ({
				name: status,
				count: project.goals.filter((g) => g.status === status).length,
				goals: project.goals.filter((g) => g.status === status),
			}));
			const maxCount = Math.max(...data.map((d) => d.count), 1);
			return { data, maxCount, type: "goals" };
		} else if (chartType === "tasks") {
			const statuses: Status[] = ["To Do", "In Progress", "Done"];
			const data = statuses.map((status) => ({
				name: status,
				count: project.goals.reduce((acc, goal) => {
					if (goal.status === status) {
						return acc + goal.tasks.length;
					}
					return acc;
				}, 0),
				goals: project.goals.filter((g) => g.status === status),
			}));
			const maxCount = Math.max(...data.map((d) => d.count), 1);
			return { data, maxCount, type: "tasks" };
		} else {
			const days = 7;
			const data = Array.from({ length: days }, (_, i) => {
				const date = new Date();
				date.setDate(date.getDate() - (days - 1 - i));
				const dateStr = date.toISOString().split("T")[0];

				const completedTasks = project.goals.reduce((acc, goal) => {
					return (
						acc +
						goal.timeline.filter(
							(event) =>
								event.date === dateStr &&
								event.description.startsWith("Task completed:")
						).length
					);
				}, 0);

				return {
					name: date.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					}),
					count: completedTasks,
					date: dateStr,
				};
			});
			const maxCount = Math.max(...data.map((d) => d.count), 1);
			return { data, maxCount, type: "completion" };
		}
	}, [project, chartType]);

	const projectStats = useMemo(() => {
		const totalGoals = project.goals.length;
		const completedGoals = project.goals.filter(
			(g) => g.status === "Done"
		).length;
		const inProgressGoals = project.goals.filter(
			(g) => g.status === "In Progress"
		).length;
		const totalTasks = project.goals.reduce(
			(acc, g) => acc + g.tasks.length,
			0
		);
		const completedTasks = project.goals.reduce(
			(acc, g) => acc + g.tasks.filter((t) => t.isCompleted).length,
			0
		);

		return {
			totalGoals,
			completedGoals,
			inProgressGoals,
			totalTasks,
			completedTasks,
			completionRate:
				totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
			taskCompletionRate:
				totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
		};
	}, [project]);

	const barColor = (status: Status) => {
		switch (status) {
			case "To Do":
				return "bg-gradient-to-t from-[#F2F0EF] to-[#BBBDBC]";
			case "In Progress":
				return "bg-gradient-to-t from-[#245F73] to-[#245F73]/80";
			case "Done":
				return "bg-gradient-to-t from-[#733E24] to-[#733E24]/80";
		}
	};

	const getStatusIcon = (status: Status) => {
		switch (status) {
			case "To Do":
				return <FiFlag className="w-5 h-5" />;
			case "In Progress":
				return <FiBarChart className="w-5 h-5" />;
			case "Done":
				return <FiCheckCircle className="w-5 h-5" />;
		}
	};

	const handleBarClick = (item: any) => {
		if (chartType === "goals" && item.goals) {
			const goalNames = item.goals.map((g: Goal) => g.title).join(", ");
			addToast({
				type: "info",
				title: `${item.name} Goals`,
				message: goalNames || "No goals in this status",
				duration: 4000,
			});
		} else if (chartType === "tasks" && item.goals) {
			const taskCount = item.goals.reduce(
				(acc: number, g: Goal) => acc + g.tasks.length,
				0
			);
			addToast({
				type: "info",
				title: `${item.name} Tasks`,
				message: `${taskCount} total tasks across ${item.goals.length} goals`,
				duration: 4000,
			});
		} else if (chartType === "completion") {
			addToast({
				type: "success",
				title: `Tasks Completed on ${item.name}`,
				message: `${item.count} task${item.count !== 1 ? "s" : ""} completed`,
				duration: 3000,
			});
		}
	};

	const getChartTitle = () => {
		switch (chartType) {
			case "goals":
				return "Goal Distribution";
			case "tasks":
				return "Task Distribution";
			case "completion":
				return "Daily Task Completion";
		}
	};

	const getChartDescription = () => {
		switch (chartType) {
			case "goals":
				return "Visual breakdown by status";
			case "tasks":
				return "Tasks across different goal statuses";
			case "completion":
				return "Tasks completed over the last 7 days";
		}
	};

	return (
		<div className="h-full overflow-y-auto p-8 space-y-8 pb-8">
			{}
			<div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-xl border border-[#BBBDBC]/60 p-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 bg-gradient-to-r from-[#245F73] to-[#245F73]/90 rounded-2xl flex items-center justify-center shadow-lg">
							<FiBarChart className="w-6 h-6 text-white" />
						</div>
						<div>
							<h2 className="text-3xl font-bold text-[#245F73] font-primary tracking-tight">
								Project Analytics
							</h2>
							<p className="text-lg font-medium text-[#733E24] font-small mt-1">
								Comprehensive insights and metrics
							</p>
						</div>
					</div>
				</div>

				{}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-gradient-to-br from-[#F2F0EF] to-[#BBBDBC]/40 rounded-2xl p-6 border border-[#BBBDBC]/30">
						<div className="flex items-center justify-between mb-3">
							<div className="w-10 h-10 bg-[#245F73]/10 rounded-xl flex items-center justify-center">
								<FiFlag className="w-5 h-5 text-[#245F73]" />
							</div>
							<span className="text-2xl font-bold text-[#245F73] font-primary">
								{projectStats.totalGoals}
							</span>
						</div>
						<h3 className="text-sm font-bold text-[#245F73] font-secondary mb-1">
							Total Goals
						</h3>
						<p className="text-xs font-medium text-[#733E24] font-small">
							All project objectives
						</p>
					</div>

					<div className="bg-gradient-to-br from-[#245F73]/10 to-[#245F73]/5 rounded-2xl p-6 border border-[#245F73]/20">
						<div className="flex items-center justify-between mb-3">
							<div className="w-10 h-10 bg-[#245F73]/20 rounded-xl flex items-center justify-center">
								<FiBarChart className="w-5 h-5 text-[#245F73]" />
							</div>
							<span className="text-2xl font-bold text-[#245F73] font-primary">
								{projectStats.inProgressGoals}
							</span>
						</div>
						<h3 className="text-sm font-bold text-[#245F73] font-secondary mb-1">
							In Progress
						</h3>
						<p className="text-xs font-medium text-[#733E24] font-small">
							Active development
						</p>
					</div>

					<div className="bg-gradient-to-br from-[#733E24]/10 to-[#733E24]/5 rounded-2xl p-6 border border-[#733E24]/20">
						<div className="flex items-center justify-between mb-3">
							<div className="w-10 h-10 bg-[#733E24]/20 rounded-xl flex items-center justify-center">
								<FiCheckCircle className="w-5 h-5 text-[#733E24]" />
							</div>
							<span className="text-2xl font-bold text-[#733E24] font-primary">
								{projectStats.completedGoals}
							</span>
						</div>
						<h3 className="text-sm font-bold text-[#733E24] font-secondary mb-1">
							Completed
						</h3>
						<p className="text-xs font-medium text-[#733E24] font-small">
							Finished objectives
						</p>
					</div>

					<div className="bg-gradient-to-br from-[#BBBDBC]/20 to-[#BBBDBC]/10 rounded-2xl p-6 border border-[#BBBDBC]/30">
						<div className="flex items-center justify-between mb-3">
							<div className="w-10 h-10 bg-[#BBBDBC]/30 rounded-xl flex items-center justify-center">
								<FiCheckCircle className="w-5 h-5 text-[#733E24]" />
							</div>
							<span className="text-2xl font-bold text-[#733E24] font-primary">
								{projectStats.completionRate}%
							</span>
						</div>
						<h3 className="text-sm font-bold text-[#733E24] font-secondary mb-1">
							Completion Rate
						</h3>
						<p className="text-xs font-medium text-[#733E24] font-small">
							Overall progress
						</p>
					</div>
				</div>
			</div>

			{}
			<div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-xl border border-[#BBBDBC]/60 p-8">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h3 className="text-2xl font-bold text-[#245F73] font-primary tracking-tight mb-2">
							{getChartTitle()}
						</h3>
						<p className="text-base font-medium text-[#733E24] font-small">
							{getChartDescription()}
						</p>
					</div>

					{}
					<div className="flex items-center space-x-4">
						{}
						{chartType !== "completion" && (
							<div className="flex items-center space-x-6">
								{chartData.data.map((item) => (
									<div key={item.name} className="flex items-center space-x-2">
										<div
											className={`w-4 h-4 rounded-full ${barColor(
												item.name as Status
											)}`}
										></div>
										<span className="text-sm font-bold text-[#733E24] font-secondary">
											{item.name}
										</span>
									</div>
								))}
							</div>
						)}

						{}
						<div className="flex items-center space-x-1 p-1.5 bg-[#F2F0EF]/80 rounded-2xl shadow-lg border border-[#BBBDBC]/60">
							<button
								onClick={() => setChartType("goals")}
								className={`px-4 py-2 text-sm font-bold rounded-xl font-secondary transition-all duration-200 ${
									chartType === "goals"
										? "bg-white text-[#245F73] shadow-md"
										: "text-[#733E24] hover:text-[#245F73] hover:bg-white/80"
								}`}
							>
								Goals
							</button>
							<button
								onClick={() => setChartType("tasks")}
								className={`px-4 py-2 text-sm font-bold rounded-xl font-secondary transition-all duration-200 ${
									chartType === "tasks"
										? "bg-white text-[#245F73] shadow-md"
										: "text-[#733E24] hover:text-[#245F73] hover:bg-white/80"
								}`}
							>
								Tasks
							</button>
							<button
								onClick={() => setChartType("completion")}
								className={`px-4 py-2 text-sm font-bold rounded-xl font-secondary transition-all duration-200 ${
									chartType === "completion"
										? "bg-white text-[#245F73] shadow-md"
										: "text-[#733E24] hover:text-[#245F73] hover:bg-white/80"
								}`}
							>
								Progress
							</button>
						</div>
					</div>
				</div>

				<div className="relative">
					{}
					<div className="flex items-end justify-center min-h-[320px] space-x-12 px-8">
						{chartData.data.map((item) => (
							<div
								key={item.name}
								className="flex flex-col items-center flex-1"
							>
								{}
								<div className="relative w-full flex items-end justify-center mb-4">
									<button
										onClick={() => handleBarClick(item)}
										className={`w-16 rounded-t-2xl transition-all duration-700 ease-out shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer ${
											chartType === "completion"
												? "bg-gradient-to-t from-[#245F73] to-[#245F73]/80"
												: barColor(item.name as Status)
										} min-h-[20px]`}
										style={{
											height: `${Math.max(
												(item.count / chartData.maxCount) * 280,
												20
											)}px`,
											minHeight: "20px",
										}}
									/>
								</div>

								{}
								<div className="text-center">
									<div className="text-lg font-bold text-[#245F73] font-secondary mb-1">
										{item.name}
									</div>
									<div className="text-sm font-medium text-[#733E24] font-small">
										{item.count}{" "}
										{chartType === "goals"
											? "goal"
											: chartType === "tasks"
											? "task"
											: "task"}
										{item.count !== 1 ? "s" : ""}
									</div>
								</div>
							</div>
						))}
					</div>

					{}
					<div className="absolute inset-0 pointer-events-none">
						{[0, 1, 2, 3, 4, 5].map((line) => (
							<div
								key={line}
								className="absolute w-full border-t border-[#BBBDBC]/20"
								style={{ bottom: `${(line / 5) * 100}%` }}
							></div>
						))}
					</div>
				</div>
			</div>

			{}
			<div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-xl border border-[#BBBDBC]/60 p-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<div className="w-10 h-10 bg-gradient-to-r from-[#245F73] to-[#245F73]/90 rounded-xl flex items-center justify-center shadow-lg">
							<FiCheckCircle className="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 className="text-2xl font-bold text-[#245F73] font-primary tracking-tight">
								Task Analytics
							</h3>
							<p className="text-base font-medium text-[#733E24] font-small">
								Individual task progress
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-[#F2F0EF]/60 rounded-2xl p-6 border border-[#BBBDBC]/30">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-bold text-[#245F73] font-secondary">
								Total Tasks
							</span>
							<span className="text-2xl font-bold text-[#245F73] font-primary">
								{projectStats.totalTasks}
							</span>
						</div>
						<div className="w-full bg-[#BBBDBC]/40 rounded-full h-2">
							<div
								className="bg-[#245F73] h-2 rounded-full"
								style={{ width: "100%" }}
							></div>
						</div>
					</div>

					<div className="bg-[#245F73]/10 rounded-2xl p-6 border border-[#245F73]/20">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-bold text-[#245F73] font-secondary">
								Completed
							</span>
							<span className="text-2xl font-bold text-[#245F73] font-primary">
								{projectStats.completedTasks}
							</span>
						</div>
						<div className="w-full bg-[#245F73]/20 rounded-full h-2">
							<div
								className="bg-[#245F73] h-2 rounded-full transition-all duration-500"
								style={{ width: `${projectStats.taskCompletionRate}%` }}
							></div>
						</div>
					</div>

					<div className="bg-[#733E24]/10 rounded-2xl p-6 border border-[#733E24]/20">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-bold text-[#733E24] font-secondary">
								Completion Rate
							</span>
							<span className="text-2xl font-bold text-[#733E24] font-primary">
								{projectStats.taskCompletionRate}%
							</span>
						</div>
						<div className="w-full bg-[#733E24]/20 rounded-full h-2">
							<div
								className="bg-[#733E24] h-2 rounded-full transition-all duration-500"
								style={{ width: `${projectStats.taskCompletionRate}%` }}
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const GoalDetailModal: FC<{
	goal: Goal | null;
	onClose: () => void;
	onUpdateGoal: (updatedGoal: Goal) => void;
	isOwner: boolean;
}> = ({ goal, onClose, onUpdateGoal, isOwner }) => {
	const { addToast } = useToast();
	const [newBlockerTitle, setNewBlockerTitle] = useState("");
	const [newCommentText, setNewCommentText] = useState<{
		[key: string]: string;
	}>({});
	const [newTaskContent, setNewTaskContent] = useState("");

	if (!goal) return null;

	const handleStatusChange = (newStatus: Status) => {
		if (goal.status !== newStatus) {
			const updatedGoal = { ...goal, status: newStatus };
			onUpdateGoal(updatedGoal);

			addToast({
				type: "success",
				title: `Goal status changed to ${newStatus}`,
				duration: 2500,
			});
		}
	};

	const handleAddBlocker = (e: FormEvent) => {
		e.preventDefault();
		if (!newBlockerTitle.trim()) return;

		const newBlocker: Blocker = {
			id: `blocker-${Date.now()}`,
			title: newBlockerTitle,
			resolved: false,
			comments: [],
		};
		const updatedGoal = { ...goal, blockers: [...goal.blockers, newBlocker] };
		onUpdateGoal(updatedGoal);
		setNewBlockerTitle("");

		addToast({
			type: "warning",
			title: `Blocker "${newBlockerTitle}" added`,
			duration: 2500,
		});
	};

	const handleAddTask = (e: FormEvent) => {
		e.preventDefault();
		if (!newTaskContent.trim()) return;

		const newTask: Task = {
			id: `task-${Date.now()}`,
			content: newTaskContent.trim(),
			isCompleted: false,
		};

		const updatedGoal = { ...goal, tasks: [...goal.tasks, newTask] };
		onUpdateGoal(updatedGoal);
		setNewTaskContent("");

		addToast({
			type: "success",
			title: `Task "${newTaskContent.trim()}" added`,
			duration: 2500,
		});
	};

	const handleAddComment = (e: FormEvent, blockerId: string) => {
		e.preventDefault();
		const text = newCommentText[blockerId];
		if (!text || !text.trim()) return;

		const newComment: Comment = {
			id: `comment-${Date.now()}`,
			author: "You",
			text,
			timestamp: new Date().toISOString(),
		};

		const updatedBlockers = goal.blockers.map((b) => {
			if (b.id === blockerId) {
				return { ...b, comments: [...b.comments, newComment] };
			}
			return b;
		});

		const updatedGoal = { ...goal, blockers: updatedBlockers };
		onUpdateGoal(updatedGoal);
		setNewCommentText((prev) => ({ ...prev, [blockerId]: "" }));

		addToast({
			type: "info",
			title: "Comment added to blocker",
			duration: 2500,
		});
	};

	const handleToggleBlocker = (blockerId: string) => {
		const blocker = goal.blockers.find((b) => b.id === blockerId);
		const updatedBlockers = goal.blockers.map((b) =>
			b.id === blockerId ? { ...b, resolved: !b.resolved } : b
		);

		let updatedTimeline = [...goal.timeline];
		if (blocker) {
			if (!blocker.resolved) {
				const newTimelineEvent: TimelineEvent = {
					id: `blocker-resolved-${blockerId}`,
					description: `Blocker Resolved: ${blocker.title}`,
					date: new Date().toISOString().split("T")[0],
				};
				updatedTimeline = [...goal.timeline, newTimelineEvent];
			} else {
				updatedTimeline = goal.timeline.filter(
					(event) => event.id !== `blocker-resolved-${blockerId}`
				);
			}
		}

		onUpdateGoal({
			...goal,
			blockers: updatedBlockers,
			timeline: updatedTimeline,
		});

		if (blocker) {
			addToast({
				type: !blocker.resolved ? "success" : "info",
				title: !blocker.resolved
					? `Blocker "${blocker.title}" resolved`
					: `Blocker "${blocker.title}" reopened`,
				duration: 2500,
			});
		}
	};

	const handleToggleTask = (taskId: string) => {
		const updatedTasks = goal.tasks.map((task) =>
			task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
		);
		const task = goal.tasks.find((t) => t.id === taskId);
		const isCompleted = !task?.isCompleted;

		let updatedTimeline = [...goal.timeline];
		if (isCompleted && task) {
			const newTimelineEvent: TimelineEvent = {
				id: `event-${Date.now()}`,
				description: `Task completed: ${task.content}`,
				date: new Date().toISOString().split("T")[0],
			};
			updatedTimeline = [...goal.timeline, newTimelineEvent];
		}

		onUpdateGoal({ ...goal, tasks: updatedTasks, timeline: updatedTimeline });

		addToast({
			type: isCompleted ? "success" : "info",
			title: isCompleted
				? `Task "${task?.content}" completed`
				: `Task "${task?.content}" reopened`,
			duration: 2500,
		});
	};

	const handleRateTask = (taskId: string, rating: number) => {
		const updatedTasks = goal.tasks.map((task) =>
			task.id === taskId ? { ...task, rating } : task
		);
		const task = goal.tasks.find((t) => t.id === taskId);

		onUpdateGoal({ ...goal, tasks: updatedTasks });

		addToast({
			type: "success",
			title: `Task rated ${rating} star${rating > 1 ? "s" : ""}`,
			duration: 2500,
		});
	};

	const handleFeedback = (
		taskId: string,
		feedback: "positive" | "negative"
	) => {
		const updatedTasks = goal.tasks.map((task) =>
			task.id === taskId ? { ...task, feedback } : task
		);
		const task = goal.tasks.find((t) => t.id === taskId);

		onUpdateGoal({ ...goal, tasks: updatedTasks });

		addToast({
			type: feedback === "positive" ? "success" : "warning",
			title:
				feedback === "positive"
					? "Positive feedback recorded"
					: "Feedback recorded",
			duration: 2500,
		});
	};

	return (
		<div
			className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
			onClick={onClose}
		>
			<div
				className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20"
				onClick={(e) => e.stopPropagation()}
			>
				{}
				<header className="relative p-8 border-b border-[#BBBDBC]/20 bg-gradient-to-r from-[#245F73] via-[#245F73]/95 to-[#245F73]/90">
					<div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
					<div className="relative flex justify-between items-start">
						<div className="flex-1">
							<h2 className="text-3xl font-bold text-white font-primary tracking-tight mb-3">
								{goal.title}
							</h2>
							<p className="text-lg font-medium text-white/90 font-small leading-relaxed max-w-2xl">
								{goal.description}
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<div className="relative group">
								<select
									value={goal.status}
									onChange={(e) => handleStatusChange(e.target.value as Status)}
									className="appearance-none bg-white/30 backdrop-blur-md border-2 border-white/60 rounded-3xl px-10 py-4 text-base font-bold font-secondary text-white focus:outline-none focus:border-white focus:ring-4 focus:ring-white/20 transition-all duration-300 pr-14 cursor-pointer hover:bg-white/40 hover:border-white/80 hover:shadow-2xl hover:shadow-white/10 shadow-xl"
									style={{
										backgroundImage: "none",
									}}
								>
									<option
										value="To Do"
										style={{
											backgroundColor: "#245F73",
											color: "white",
											padding: "12px 16px",
											margin: "8px",
											borderRadius: "8px",
											fontWeight: "bold",
										}}
									>
										To Do
									</option>
									<option
										value="In Progress"
										style={{
											backgroundColor: "#245F73",
											color: "white",
											padding: "12px 16px",
											margin: "8px",
											borderRadius: "8px",
											fontWeight: "bold",
										}}
									>
										In Progress
									</option>
									<option
										value="Done"
										style={{
											backgroundColor: "#245F73",
											color: "white",
											padding: "12px 16px",
											margin: "8px",
											borderRadius: "8px",
											fontWeight: "bold",
										}}
									>
										Done
									</option>
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
									<div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
										<svg
											className="w-3 h-3 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={3}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</div>
								</div>
							</div>
							<button
								onClick={onClose}
								className="p-3 rounded-2xl hover:bg-white/20 transition-all duration-200 hover:shadow-lg group"
							>
								<FiX className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
							</button>
						</div>
					</div>
				</header>

				{}
				<main className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-[#F2F0EF]/10 custom-scrollbar">
					<div className="p-8 space-y-12">
						{}
						<section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#BBBDBC]/10">
							<div className="flex items-center justify-between mb-8">
								<div className="flex items-center space-x-4">
									<div className="w-10 h-10 bg-gradient-to-br from-[#245F73] to-[#245F73]/90 rounded-2xl flex items-center justify-center shadow-lg">
										<FiCheckCircle className="w-5 h-5 text-white" />
									</div>
									<div>
										<h3 className="text-2xl font-bold text-[#245F73] font-primary tracking-tight">
											Tasks
										</h3>
										<p className="text-sm font-medium text-[#733E24] font-small mt-1">
											Manage and track task completion
										</p>
									</div>
								</div>
								<div className="text-sm font-bold text-[#733E24] font-small bg-[#F2F0EF]/80 px-4 py-2 rounded-2xl shadow-sm border border-[#BBBDBC]/20">
									{goal.tasks.filter((t) => t.isCompleted).length}/
									{goal.tasks.length} completed
								</div>
							</div>

							<div className="space-y-3 mb-8">
								{goal.tasks.map((task) => (
									<TaskItem
										key={task.id}
										task={task}
										onToggle={handleToggleTask}
										onRate={handleRateTask}
										onFeedback={handleFeedback}
										isOwner={isOwner}
									/>
								))}
							</div>

							<form
								onSubmit={handleAddTask}
								className="bg-gradient-to-r from-[#F2F0EF]/60 to-[#F2F0EF]/40 rounded-2xl p-6 shadow-lg border border-[#BBBDBC]/20"
							>
								<h4 className="text-lg font-bold text-[#245F73] font-secondary mb-4">
									Add New Task
								</h4>
								<div className="flex items-center space-x-4">
									<CustomInput
										placeholder="Enter task description..."
										value={newTaskContent}
										onChange={(e) => setNewTaskContent(e.target.value)}
										className="flex-grow"
									/>
									<CustomButton type="submit">
										<FiPlus className="w-4 h-4 mr-2" />
										Add Task
									</CustomButton>
								</div>
							</form>
						</section>

						{}
						<section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#BBBDBC]/10">
							<div className="flex items-center space-x-4 mb-8">
								<div className="w-10 h-10 bg-gradient-to-br from-[#733E24] to-[#733E24]/90 rounded-2xl flex items-center justify-center shadow-lg">
									<FiFlag className="w-5 h-5 text-white" />
								</div>
								<div>
									<h3 className="text-2xl font-bold text-[#245F73] font-primary tracking-tight">
										Achievement Timeline
									</h3>
									<p className="text-sm font-medium text-[#733E24] font-small mt-1">
										Track progress and milestones
									</p>
								</div>
							</div>

							{goal.timeline.length > 0 ? (
								<div className="relative border-l-2 border-gradient-to-b from-[#245F73] to-[#245F73]/60 ml-6">
									{goal.timeline.map((event, index) => (
										<div key={event.id} className="mb-8 ml-8">
											<div className="absolute flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#245F73] to-[#245F73]/90 rounded-full -left-5 ring-4 ring-white shadow-xl">
												<FiFlag className="w-4 h-4 text-white" />
											</div>
											<div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#BBBDBC]/20">
												<h4 className="text-lg font-bold text-[#245F73] font-secondary mb-2">
													{event.description}
												</h4>
												<time className="text-sm font-medium text-[#733E24] font-small">
													{new Date(event.date).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
													})}
												</time>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<div className="w-20 h-20 bg-gradient-to-br from-[#F2F0EF] to-[#BBBDBC]/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-[#BBBDBC]/20">
										<FiFlag className="w-10 h-10 text-[#BBBDBC]" />
									</div>
									<p className="text-lg font-medium text-[#733E24] font-small">
										No timeline events yet
									</p>
									<p className="text-sm font-medium text-[#733E24]/60 font-small mt-2">
										Complete tasks to see your progress
									</p>
								</div>
							)}
						</section>

						{}
						<section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#BBBDBC]/10">
							<div className="flex items-center justify-between mb-8">
								<div className="flex items-center space-x-4">
									<div className="w-10 h-10 bg-gradient-to-br from-[#733E24] to-[#733E24]/90 rounded-2xl flex items-center justify-center shadow-lg">
										<FiAlertTriangle className="w-5 h-5 text-white" />
									</div>
									<div>
										<h3 className="text-2xl font-bold text-[#245F73] font-primary tracking-tight">
											Blockers & Issues
										</h3>
										<p className="text-sm font-medium text-[#733E24] font-small mt-1">
											Identify and resolve obstacles
										</p>
									</div>
								</div>
								<div className="text-sm font-bold text-[#733E24] font-small bg-[#F2F0EF]/80 px-4 py-2 rounded-2xl shadow-sm border border-[#BBBDBC]/20">
									{goal.blockers.length} blocker
									{goal.blockers.length !== 1 ? "s" : ""}
								</div>
							</div>

							<div className="space-y-6">
								{goal.blockers.map((blocker) => (
									<div
										key={blocker.id}
										className={`rounded-2xl shadow-lg border transition-all duration-300 ${
											blocker.resolved
												? "bg-gradient-to-r from-[#F2F0EF]/80 to-[#F2F0EF]/60 border-[#BBBDBC]/30"
												: "bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm border-[#733E24]/20 hover:shadow-xl"
										}`}
									>
										<div className="p-6">
											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center space-x-4">
													<CustomCheckbox
														checked={blocker.resolved}
														onChange={() => handleToggleBlocker(blocker.id)}
													/>
													<h4
														className={`text-lg font-bold font-secondary ${
															blocker.resolved
																? "line-through text-[#BBBDBC]"
																: "text-[#245F73]"
														}`}
													>
														{blocker.title}
													</h4>
												</div>
												<div
													className={`px-4 py-2 rounded-2xl text-sm font-bold font-secondary shadow-sm ${
														blocker.resolved
															? "bg-[#BBBDBC]/60 text-[#733E24]"
															: "bg-[#733E24]/10 text-[#733E24]"
													}`}
												>
													{blocker.resolved ? "Resolved" : "Active"}
												</div>
											</div>

											{blocker.comments.length > 0 && (
												<div className="ml-12 space-y-4">
													<h5 className="text-base font-bold text-[#245F73] font-secondary mb-3">
														Comments
													</h5>
													{blocker.comments.map((comment) => (
														<div
															key={comment.id}
															className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#BBBDBC]/20 shadow-sm"
														>
															<div className="flex items-center justify-between mb-2">
																<span className="font-bold font-secondary text-[#245F73] text-sm">
																	{comment.author}
																</span>
																<time className="text-xs font-medium text-[#733E24] font-small">
																	{new Date(
																		comment.timestamp
																	).toLocaleDateString()}
																</time>
															</div>
															<p className="text-[#733E24] font-small leading-relaxed text-sm">
																{comment.text}
															</p>
														</div>
													))}
												</div>
											)}

											<form
												onSubmit={(e) => handleAddComment(e, blocker.id)}
												className="ml-12 mt-4 flex items-center space-x-4"
											>
												<CustomInput
													placeholder="Add a comment to this blocker..."
													value={newCommentText[blocker.id] || ""}
													onChange={(e) =>
														setNewCommentText((prev) => ({
															...prev,
															[blocker.id]: e.target.value,
														}))
													}
													className="flex-grow"
												/>
												<CustomButton type="submit">Comment</CustomButton>
											</form>
										</div>
									</div>
								))}
							</div>

							<form
								onSubmit={handleAddBlocker}
								className="mt-8 bg-gradient-to-r from-[#F2F0EF]/60 to-[#F2F0EF]/40 rounded-2xl p-6 shadow-lg border border-[#BBBDBC]/20"
							>
								<h4 className="text-lg font-bold text-[#245F73] font-secondary mb-4">
									Add New Blocker
								</h4>
								<div className="flex items-center space-x-4">
									<CustomInput
										placeholder="Describe the blocker or issue..."
										value={newBlockerTitle}
										onChange={(e) => setNewBlockerTitle(e.target.value)}
										className="flex-grow"
									/>
									<CustomButton type="submit">
										<FiPlus className="w-4 h-4 mr-2" />
										Add Blocker
									</CustomButton>
								</div>
							</form>
						</section>
					</div>
				</main>
			</div>
		</div>
	);
};

const ProjectView: FC<{
	project: Project;
	onUpdateProject: (project: Project) => void;
	onOpenModal: (goal: Goal) => void;
	isOwner: boolean;
	onAddGoal: () => void;
}> = ({ project, onUpdateProject, onOpenModal, isOwner, onAddGoal }) => {
	const [currentView, setCurrentView] = useState<"kanban" | "chart">("kanban");

	React.useEffect(() => {
		setCurrentView("kanban");
	}, [project.id]);

	const truncateText = (text: string, maxLength: number) => {
		return text.length > maxLength
			? text.substring(0, maxLength) + "..."
			: text;
	};

	const projectStats = useMemo(() => {
		const totalGoals = project.goals.length;
		const completedGoals = project.goals.filter(
			(g) => g.status === "Done"
		).length;
		const inProgressGoals = project.goals.filter(
			(g) => g.status === "In Progress"
		).length;
		const totalTasks = project.goals.reduce(
			(acc, g) => acc + g.tasks.length,
			0
		);
		const completedTasks = project.goals.reduce(
			(acc, g) => acc + g.tasks.filter((t) => t.isCompleted).length,
			0
		);

		return {
			totalGoals,
			completedGoals,
			inProgressGoals,
			totalTasks,
			completedTasks,
			completionRate:
				totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
			taskCompletionRate:
				totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
		};
	}, [project]);

	return (
		<div className="flex-1 flex flex-col bg-[#F2F0EF]/30 overflow-hidden">
			{}
			<header className="bg-white/98 backdrop-blur-xl border-b border-[#BBBDBC]/60 shadow-lg">
				<div className="px-8 py-6">
					<div className="flex justify-between items-start">
						<div className="flex-1">
							<div className="flex items-center space-x-4 mb-2">
								<div className="w-12 h-12 bg-gradient-to-r from-[#245F73] to-[#245F73]/90 rounded-2xl flex items-center justify-center shadow-lg">
									<FiFolder className="w-6 h-6 text-white" />
								</div>
								<div className="min-w-0 flex-1">
									<h1
										className="text-4xl font-bold text-[#245F73] font-primary tracking-tight"
										title={project.name}
									>
										{truncateText(project.name, 30)}
									</h1>
									<p className="text-lg font-medium text-[#733E24] font-small">
										Owned by{" "}
										{project.owner === currentUser ? "You" : project.owner}
									</p>
								</div>
							</div>

							{}
							<div className="flex items-center space-x-8 mt-8">
								<div className="flex items-center space-x-2">
									<div className="w-3 h-3 bg-[#245F73] rounded-full"></div>
									<span className="text-sm font-bold text-[#245F73] font-secondary">
										{projectStats.totalGoals} Goals
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-3 h-3 bg-[#733E24] rounded-full"></div>
									<span className="text-sm font-bold text-[#733E24] font-secondary">
										{projectStats.completedGoals} Completed
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-3 h-3 bg-[#BBBDBC] rounded-full"></div>
									<span className="text-sm font-bold text-[#733E24] font-secondary">
										{projectStats.totalTasks} Tasks
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-3 h-3 bg-[#245F73] rounded-full"></div>
									<span className="text-sm font-bold text-[#245F73] font-secondary">
										{projectStats.completionRate}% Complete
									</span>
								</div>
							</div>
						</div>

						{}
						<div className="flex items-center space-x-4">
							{isOwner && (
								<button
									onClick={onAddGoal}
									className="px-6 py-3 bg-gradient-to-r from-[#245F73] to-[#245F73]/90 text-white rounded-2xl font-bold font-secondary text-sm hover:shadow-xl hover:shadow-[#245F73]/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-2"
								>
									<FiPlus className="w-4 h-4" />
									<span>Add Goal</span>
								</button>
							)}

							{}
							<div className="flex items-center space-x-1 p-1.5 bg-[#F2F0EF]/80 rounded-2xl shadow-lg border border-[#BBBDBC]/60">
								<button
									onClick={() => setCurrentView("kanban")}
									className={`px-6 py-3 text-sm font-bold rounded-xl flex items-center space-x-3 font-secondary transition-all duration-200 ${
										currentView === "kanban"
											? "bg-white text-[#245F73] shadow-md"
											: "text-[#733E24] hover:text-[#245F73] hover:bg-white/80"
									}`}
								>
									<FiGrid className="w-5 h-5" />
									<span>Board</span>
								</button>
								<button
									onClick={() => setCurrentView("chart")}
									className={`px-6 py-3 text-sm font-bold rounded-xl flex items-center space-x-3 font-secondary transition-all duration-200 ${
										currentView === "chart"
											? "bg-white text-[#245F73] shadow-md"
											: "text-[#733E24] hover:text-[#245F73] hover:bg-white/80"
									}`}
								>
									<FiBarChart className="w-5 h-5" />
									<span>Analytics</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</header>

			{}
			<main className="flex-1 overflow-hidden">
				{currentView === "kanban" && (
					<KanbanBoard
						project={project}
						onUpdateProject={onUpdateProject}
						onOpenModal={onOpenModal}
						isOwner={isOwner}
					/>
				)}
				{currentView === "chart" && <ChartView project={project} />}
			</main>
		</div>
	);
};

const ToastContainer: FC<{
	toasts: Toast[];
	onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
			))}
		</div>
	);
};

const ToastItem: FC<{ toast: Toast; onRemove: (id: string) => void }> = ({
	toast,
	onRemove,
}) => {
	const [isVisible, setIsVisible] = useState(true);

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onRemove(toast.id), 300);
		}, toast.duration || 5000);

		return () => clearTimeout(timer);
	}, [toast.id, toast.duration, onRemove]);

	const getToastStyles = () => {
		switch (toast.type) {
			case "success":
				return "bg-[#245F73]/95 border-[#245F73] text-white";
			case "error":
				return "bg-red-900/95 border-red-300 text-red-100";
			case "warning":
				return "bg-[#733E24]/95 border-[#733E24] text-white";
			case "info":
				return "bg-[#245F73]/95 border-[#245F73] text-white";
			default:
				return "bg-[#245F73]/95 border-[#245F73] text-white";
		}
	};

	const getIcon = () => {
		switch (toast.type) {
			case "success":
				return <FiCheckCircle className="w-5 h-5 text-white" />;
			case "error":
				return <FiXCircle className="w-5 h-5 text-red-100" />;
			case "warning":
				return <FiAlertTriangle className="w-5 h-5 text-white" />;
			case "info":
				return <FiInfo className="w-5 h-5 text-white" />;
			default:
				return <FiInfo className="w-5 h-5 text-white" />;
		}
	};

	return (
		<div
			className={`max-w-sm w-full bg-white/98 backdrop-blur-xl shadow-2xl rounded-2xl pointer-events-auto border-l-4 ${getToastStyles()} transform transition-all duration-300 ease-in-out ${
				isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
			}`}
		>
			<div className="p-5">
				<div className="flex items-start">
					<div className="flex-shrink-0">{getIcon()}</div>
					<div className="ml-4 flex-1">
						<p className="text-sm font-bold font-secondary">{toast.title}</p>
						{toast.message && (
							<p className="mt-2 text-sm font-medium opacity-90 font-small leading-relaxed">
								{toast.message}
							</p>
						)}
					</div>
					<div className="ml-4 flex-shrink-0 flex">
						<button
							onClick={() => {
								setIsVisible(false);
								setTimeout(() => onRemove(toast.id), 300);
							}}
							className="inline-flex text-white hover:text-white/80 focus:outline-none focus:text-white/80 p-1 rounded-lg hover:bg-white/20 transition-all duration-200"
						>
							<FiX className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const ToastProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((toast: Omit<Toast, "id">) => {
		const id = `toast-${Date.now()}-${Math.random()}`;
		setToasts((prev) => [...prev, { ...toast, id }]);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
};

const ProjectManagementAppContent: FC = () => {
	const [projects, setProjects] = useState<Project[]>(initialProjects);
	const [activeProjectId, setActiveProjectId] = useState<string>("proj-1");
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
	const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
	const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
		useState<boolean>(false);
	const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] =
		useState<boolean>(false);
	const { addToast } = useToast();

	const activeProject = useMemo(() => {
		return projects.find((p) => p.id === activeProjectId)!;
	}, [projects, activeProjectId]);

	const isProjectOwner = activeProject?.owner === currentUser;

	const handleUpdateProject = (updatedProject: Project) => {
		setProjects(
			projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
		);
	};

	const handleUpdateGoalInModal = (updatedGoal: Goal) => {
		const updatedProject = {
			...activeProject,
			goals: activeProject.goals.map((g) =>
				g.id === updatedGoal.id ? updatedGoal : g
			),
		};
		handleUpdateProject(updatedProject);
		setSelectedGoal(updatedGoal);
	};

	const handleCreateProject = (name: string) => {
		const isDuplicate = projects.some(
			(project) => project.name.toLowerCase() === name.toLowerCase()
		);
		if (isDuplicate) {
			addToast({
				type: "error",
				title: "Project name already exists",
				message: "Please choose a different project name.",
				duration: 4000,
			});
			return;
		}

		const newProject: Project = {
			id: `proj-${Date.now()}`,
			name,
			owner: currentUser,
			goals: [],
		};
		setProjects([...projects, newProject]);
		setActiveProjectId(newProject.id);

		addToast({
			type: "success",
			title: `Project "${name}" created successfully`,
			duration: 3000,
		});
	};

	const handleCreateGoal = (
		title: string,
		description: string,
		priority: Priority
	) => {
		const isDuplicate = activeProject.goals.some(
			(goal) => goal.title.toLowerCase() === title.toLowerCase()
		);
		if (isDuplicate) {
			addToast({
				type: "error",
				title: "Goal name already exists in this project",
				message: "Please choose a different goal name for this project.",
				duration: 4000,
			});
			return;
		}

		if (title.trim().length > 50) {
			addToast({
				type: "error",
				title: "Goal name too long",
				message: "Goal name must be 50 characters or less.",
				duration: 4000,
			});
			return;
		}

		const newGoal: Goal = {
			id: `goal-${Date.now()}`,
			title,
			description,
			status: "To Do",
			priority,
			tasks: [],
			blockers: [],
			timeline: [],
		};

		const updatedProject = {
			...activeProject,
			goals: [...activeProject.goals, newGoal],
		};
		handleUpdateProject(updatedProject);

		addToast({
			type: "success",
			title: `Goal "${title}" added to project`,
			duration: 3000,
		});
	};

	return (
		<div className="h-screen w-screen bg-gradient-to-br from-[#F2F0EF] via-white to-[#F2F0EF] flex flex-col font-primary">
			<div className="flex flex-1 min-h-0">
				<Sidebar
					projects={projects}
					activeProjectId={activeProjectId}
					onSelectProject={setActiveProjectId}
					isCollapsed={isSidebarCollapsed}
					setIsCollapsed={setIsSidebarCollapsed}
					onAddProject={() => setIsCreateProjectModalOpen(true)}
				/>
				<div className="flex-1 flex flex-col min-w-0">
					{activeProject && (
						<ProjectView
							project={activeProject}
							onUpdateProject={handleUpdateProject}
							onOpenModal={setSelectedGoal}
							isOwner={isProjectOwner}
							onAddGoal={() => setIsCreateGoalModalOpen(true)}
						/>
					)}
				</div>
			</div>

			{}
			<footer className="bg-white/98 backdrop-blur-xl border-t border-[#BBBDBC]/60 shadow-lg">
				<div className="px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-6">
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-gradient-to-r from-[#245F73] to-[#245F73]/90 rounded-lg flex items-center justify-center shadow-lg">
									<FiFolder className="w-4 h-4 text-white" />
								</div>
								<span className="text-lg font-bold text-[#245F73] font-primary tracking-tight">
									Project Manager
								</span>
							</div>
							<div className="text-sm font-medium text-[#733E24] font-small">
								Professional project management made simple
							</div>
						</div>
						<div className="flex items-center space-x-6">
							<div className="text-sm font-medium text-[#733E24] font-small">
								© 2024 Project Manager
							</div>
							<div className="flex items-center space-x-4">
								<div className="w-2 h-2 bg-[#245F73] rounded-full"></div>
								<div className="w-2 h-2 bg-[#733E24] rounded-full"></div>
								<div className="w-2 h-2 bg-[#BBBDBC] rounded-full"></div>
							</div>
						</div>
					</div>
				</div>
			</footer>

			<GoalDetailModal
				goal={selectedGoal}
				onClose={() => setSelectedGoal(null)}
				onUpdateGoal={handleUpdateGoalInModal}
				isOwner={isProjectOwner}
			/>
			<CreateProjectModal
				isOpen={isCreateProjectModalOpen}
				onClose={() => setIsCreateProjectModalOpen(false)}
				onCreateProject={handleCreateProject}
				projects={projects}
			/>
			<CreateGoalModal
				isOpen={isCreateGoalModalOpen}
				onClose={() => setIsCreateGoalModalOpen(false)}
				onCreateGoal={handleCreateGoal}
				activeProject={activeProject}
			/>
		</div>
	);
};

export default function ProjectManagerExport() {
	return (
		<>
			<style>
				{`
          
          @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600;700&display=swap');
          
          html {
            font-family: 'Rubik';
          }
          
          body {
            margin: 0;
            font-family: 'Rubik';
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          button,a{
          cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(36, 95, 115, 0.3);
            border-radius: 4px;
            transition: background 0.3s ease;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(36, 95, 115, 0.5);
          }
          
          
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(36, 95, 115, 0.3) transparent;
          }
        `}
			</style>
			<ToastProvider>
				<ProjectManagementAppContent />
			</ToastProvider>
		</>
	);
}

const CustomInput: FC<{
	placeholder: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	id?: string;
}> = ({ placeholder, value, onChange, className = "", id }) => {
	return (
		<div className={`relative ${className}`}>
			<input
				id={id}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className="w-full bg-white/80 backdrop-blur-sm border border-[#BBBDBC]/40 rounded-2xl px-6 py-4 text-base font-medium font-small text-[#245F73] placeholder-[#733E24]/50 focus:outline-none focus:border-[#245F73] focus:bg-white focus:shadow-lg focus:shadow-[#245F73]/10 transition-all duration-300"
			/>
			<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
		</div>
	);
};

const CustomButton: FC<{
	children: React.ReactNode;
	onClick?: () => void;
	type?: "button" | "submit";
	variant?: "primary" | "secondary";
	className?: string;
}> = ({
	children,
	onClick,
	type = "button",
	variant = "primary",
	className = "",
}) => {
	const baseClasses =
		"px-8 py-4 rounded-2xl font-bold font-secondary text-base transition-all duration-300 flex items-center justify-center";
	const variantClasses =
		variant === "primary"
			? "bg-gradient-to-r from-[#245F73] to-[#245F73]/90 text-white hover:shadow-xl hover:shadow-[#245F73]/20 hover:scale-105 active:scale-95"
			: "bg-white/90 text-[#245F73] border border-[#BBBDBC]/40 hover:bg-white hover:shadow-lg hover:border-[#245F73]/60";

	return (
		<button
			type={type}
			onClick={onClick}
			className={`${baseClasses} ${variantClasses} ${className}`}
		>
			{children}
		</button>
	);
};

const CreateProjectModal: FC<{
	isOpen: boolean;
	onClose: () => void;
	onCreateProject: (name: string) => void;
	projects: Project[];
}> = ({ isOpen, onClose, onCreateProject, projects }) => {
	const [projectName, setProjectName] = useState("");
	const [error, setError] = useState("");

	React.useEffect(() => {
		if (!isOpen) {
			setProjectName("");
			setError("");
		}
	}, [isOpen]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		setError("");

		if (!projectName.trim()) {
			setError("Project name is required.");
			return;
		}

		const isDuplicate = projects.some(
			(project) =>
				project.name.toLowerCase() === projectName.trim().toLowerCase()
		);
		if (isDuplicate) {
			setError(
				"A project with this name already exists. Please choose a different name."
			);
			return;
		}

		if (projectName.trim().length > 40) {
			setError("Project name must be 40 characters or less.");
			return;
		}

		onCreateProject(projectName.trim());
		setProjectName("");
		setError("");
		onClose();
	};

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setProjectName(name);

		if (error) {
			setError("");
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4"
			onClick={onClose}
		>
			<div
				className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col border border-[#BBBDBC]/30 overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<header className="p-6 border-b border-[#BBBDBC]/30 bg-gradient-to-r from-[#245F73] to-[#245F73]/90">
					<div className="flex items-center space-x-4">
						<div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
							<FiPlus className="w-6 h-6 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white font-primary tracking-tight">
							Create New Project
						</h2>
					</div>
				</header>
				<main className="p-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<div className="flex items-center justify-between mb-2">
								<label
									htmlFor="projectName"
									className="block text-sm font-bold text-[#245F73] font-secondary"
								>
									Project Name
								</label>
								<p
									className={`text-xs font-medium font-small ${
										projectName.length > 35
											? "text-red-500"
											: "text-[#733E24]/60"
									}`}
								>
									{projectName.length}/40
								</p>
							</div>
							<CustomInput
								id="projectName"
								placeholder="Enter project name..."
								value={projectName}
								onChange={handleNameChange}
								className="w-full"
							/>
							{error && (
								<div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
									<FiAlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
									<p className="text-sm font-medium text-red-700 font-small">
										{error}
									</p>
								</div>
							)}
						</div>
						<div className="flex items-center space-x-3 pt-4">
							<CustomButton type="submit" className="flex-1">
								<FiPlus className="w-4 h-4 mr-2" />
								Create Project
							</CustomButton>
							<CustomButton type="button" variant="secondary" onClick={onClose}>
								Cancel
							</CustomButton>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

const CreateGoalModal: FC<{
	isOpen: boolean;
	onClose: () => void;
	onCreateGoal: (
		title: string,
		description: string,
		priority: Priority
	) => void;
	activeProject: Project;
}> = ({ isOpen, onClose, onCreateGoal, activeProject }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<Priority>("Medium");
	const [titleError, setTitleError] = useState("");
	const [descriptionError, setDescriptionError] = useState("");

	React.useEffect(() => {
		if (!isOpen) {
			setTitle("");
			setDescription("");
			setPriority("Medium");
			setTitleError("");
			setDescriptionError("");
		}
	}, [isOpen]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		setTitleError("");
		setDescriptionError("");

		if (!title.trim()) {
			setTitleError("Goal title is required.");
			return;
		}

		if (!description.trim()) {
			setDescriptionError("Goal description is required.");
			return;
		}

		const isDuplicate = activeProject.goals.some(
			(goal) => goal.title.toLowerCase() === title.trim().toLowerCase()
		);
		if (isDuplicate) {
			setTitleError(
				"A goal with this name already exists in this project. Please choose a different name."
			);
			return;
		}

		if (title.trim().length > 50) {
			setTitleError("Goal name must be 50 characters or less.");
			return;
		}

		if (description.trim().length > 250) {
			setDescriptionError("Description must be 250 characters or less.");
			return;
		}

		onCreateGoal(title.trim(), description.trim(), priority);
		setTitle("");
		setDescription("");
		setPriority("Medium");
		setTitleError("");
		setDescriptionError("");
		onClose();
	};

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value;
		setTitle(newTitle);

		if (titleError) {
			setTitleError("");
		}
	};

	const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const newDescription = e.target.value;
		setDescription(newDescription);

		if (descriptionError) {
			setDescriptionError("");
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4"
			onClick={onClose}
		>
			<div
				className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col border border-[#BBBDBC]/30 overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<header className="p-6 border-b border-[#BBBDBC]/30 bg-gradient-to-r from-[#245F73] to-[#245F73]/90">
					<div className="flex items-center space-x-4">
						<div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
							<FiFlag className="w-6 h-6 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white font-primary tracking-tight">
							Create New Goal
						</h2>
					</div>
				</header>
				<main className="p-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<div className="flex items-center justify-between mb-2">
								<label
									htmlFor="goalTitle"
									className="block text-sm font-bold text-[#245F73] font-secondary"
								>
									Goal Title
								</label>
								<p
									className={`text-xs font-medium font-small ${
										title.length > 45 ? "text-red-500" : "text-[#733E24]/60"
									}`}
								>
									{title.length}/50
								</p>
							</div>
							<CustomInput
								id="goalTitle"
								placeholder="Enter goal title..."
								value={title}
								onChange={handleTitleChange}
								className="w-full"
							/>
							{titleError && (
								<div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
									<FiAlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
									<p className="text-sm font-medium text-red-700 font-small">
										{titleError}
									</p>
								</div>
							)}
						</div>
						<div>
							<div className="flex items-center justify-between mb-2">
								<label
									htmlFor="goalDescription"
									className="block text-sm font-bold text-[#245F73] font-secondary"
								>
									Description
								</label>
								<p
									className={`text-xs font-medium font-small ${
										description.length > 200
											? "text-red-500"
											: "text-[#733E24]/60"
									}`}
								>
									{description.length}/250
								</p>
							</div>
							<textarea
								id="goalDescription"
								placeholder="Describe the goal..."
								value={description}
								onChange={handleDescriptionChange}
								className="w-full bg-white/80 backdrop-blur-sm border border-[#BBBDBC]/40 rounded-2xl px-6 py-4 text-base font-medium font-small text-[#245F73] placeholder-[#733E24]/50 focus:outline-none focus:border-[#245F73] focus:bg-white focus:shadow-lg focus:shadow-[#245F73]/10 transition-all duration-300 resize-none"
								rows={3}
							/>
							{descriptionError && (
								<div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
									<FiAlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
									<p className="text-sm font-medium text-red-700 font-small">
										{descriptionError}
									</p>
								</div>
							)}
						</div>
						<div>
							<label
								htmlFor="priority"
								className="block text-sm font-bold text-[#245F73] font-secondary mb-2"
							>
								Priority
							</label>
							<select
								id="priority"
								value={priority}
								onChange={(e) => setPriority(e.target.value as Priority)}
								className="w-full bg-white/80 backdrop-blur-sm border border-[#BBBDBC]/40 rounded-2xl px-6 py-4 text-base font-medium font-small text-[#245F73] focus:outline-none focus:border-[#245F73] focus:bg-white focus:shadow-lg focus:shadow-[#245F73]/10 transition-all duration-300"
							>
								<option value="Low">Low</option>
								<option value="Medium">Medium</option>
								<option value="High">High</option>
							</select>
						</div>
						<div className="flex items-center space-x-3 pt-4">
							<CustomButton type="submit" className="flex-1">
								<FiFlag className="w-4 h-4 mr-2" />
								Create Goal
							</CustomButton>
							<CustomButton type="button" variant="secondary" onClick={onClose}>
								Cancel
							</CustomButton>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};
