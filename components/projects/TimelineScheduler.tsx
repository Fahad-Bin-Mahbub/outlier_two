"use client";
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
	JSX,
} from "react";

interface Task {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	assignee: string;
	description: string;
	color: string;
	milestoneEmoji?: string;
	priority: "low" | "medium" | "high" | "critical";
	status: "not-started" | "in-progress" | "completed" | "blocked" | "on-hold";
	sprint?: string;
	dependencies?: string[];
	progress?: number;
	tags?: string[];
}

interface AppTask extends Omit<Task, "startDate" | "endDate"> {
	startDate: Date;
	endDate: Date;
	isNew?: boolean;
}

interface ZoomLevel {
	name: string;
	pixelsPerDay: number;
	timeHeaderFormat: "day" | "week" | "month";
}

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 8px;
    box-shadow: inset 2px 2px 4px rgba(0,0,0,0.05);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(145deg, #e2e8f0, #cbd5e1);
    border-radius: 8px;
    box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(145deg, #cbd5e1, #94a3b8);
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 #f8fafc;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.4);
    opacity: 0.8;
    transition: opacity 0.2s;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown-animate {
    animation: slideDown 0.2s ease-out;
  }
  
  .neumorphic {
    background: linear-gradient(145deg, #ffffff, #f1f5f9);
    box-shadow: 
      inset 1px 1px 2px rgba(255,255,255,0.9),
      inset -1px -1px 2px rgba(0,0,0,0.05),
      4px 4px 12px rgba(0,0,0,0.08);
    border: 1px solid rgba(226, 232, 240, 0.6);
  }
  
  .neumorphic-inset {
    background: linear-gradient(145deg, #f8fafc, #ffffff);
    box-shadow: 
      inset 2px 2px 4px rgba(0,0,0,0.08),
      inset -2px -2px 4px rgba(255,255,255,0.9);
    border: 1px solid rgba(226, 232, 240, 0.7);
  }
  
  .neumorphic-button {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    box-shadow: 
      3px 3px 8px rgba(0,0,0,0.1),
      -2px -2px 6px rgba(255,255,255,0.9);
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.2s ease;
  }
  
  .neumorphic-button:hover {
    box-shadow: 
      2px 2px 6px rgba(0,0,0,0.12),
      -1px -1px 4px rgba(255,255,255,0.95);
    transform: translateY(-1px);
    background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  }
  
  .neumorphic-button:active {
    box-shadow: 
      inset 2px 2px 4px rgba(0,0,0,0.1),
      inset -2px -2px 4px rgba(255,255,255,0.9);
    transform: translateY(0);
  }
  
  .task-selected {
    box-shadow: 
      0 0 0 3px rgba(59, 130, 246, 0.4),
      6px 6px 16px rgba(0,0,0,0.15);
    transform: scale(1.02);
    border-radius: 12px;
  }
  
  .primary-gradient {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  }
  
  .secondary-gradient {
    background: linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%);
  }

  .blue-glass {
    background: rgba(59, 130, 246, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  .light-glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  :root {
    --task-height: clamp(36px, 3.5vw, 44px);
    --task-padding: clamp(8px, 1vw, 12px);
    --row-height: calc(var(--task-height) + var(--task-padding));
    --header-height: clamp(80px, 8vw, 100px);
    --sidebar-width: clamp(240px, 22vw, 340px);
  }
  
  .responsive-text-xs { font-size: clamp(0.7rem, 1.5vw, 0.75rem); }
  .responsive-text-sm { font-size: clamp(0.8rem, 1.8vw, 0.875rem); }
  .responsive-text-base { font-size: clamp(0.9rem, 2vw, 1rem); }
  .responsive-text-lg { font-size: clamp(1rem, 2.2vw, 1.125rem); }
  .responsive-text-xl { font-size: clamp(1.1rem, 2.5vw, 1.25rem); }
  .responsive-text-2xl { font-size: clamp(1.3rem, 3vw, 1.5rem); }
  .responsive-text-3xl { font-size: clamp(1.6rem, 4vw, 1.875rem); }
  .responsive-text-4xl { font-size: clamp(2rem, 5vw, 2.25rem); }

  
  @media (max-width: 640px) {
    .task-row-mobile {
      flex-direction: column;
      padding: 8px;
    }
    
    .chart-container-mobile {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    
    .mobile-menu-button {
      display: block !important;
    }
    
    .mobile-sidebar {
      position: fixed;
      z-index: 50;
      top: 0;
      left: 0;
      height: 100vh;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
    }
    
    .mobile-sidebar.open {
      transform: translateX(0);
    }
    
    .task-name-mobile {
      width: 100%;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }
  }

  
  @media (pointer: coarse) {
    .task-drag-handle {
      padding: 12px;
    }
    
    .touch-target {
      min-height: 44px;
      min-width: 44px;
    }
  }
`;

const parseDate = (dateString: string): Date => {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(Date.UTC(year, month - 1, day));
};

const formatDate = (date: Date): string => {
	return date.toISOString().split("T")[0];
};

const addDays = (date: Date, days: number): Date => {
	const result = new Date(date);
	result.setUTCDate(result.getUTCDate() + days);
	return result;
};

const daysBetween = (start: Date, end: Date): number => {
	return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

const getWeekNumber = (date: Date): number => {
	const d = new Date(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
	);
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const getMonthName = (monthIndex: number): string => {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return months[monthIndex];
};

const getShortMonthName = (monthIndex: number): string => {
	const months = [
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
	return months[monthIndex];
};

const MOCK_TASKS: Task[] = [
	{
		id: "1",
		name: "Project Phoenix Kickoff",
		startDate: "2025-04-14",
		endDate: "2025-04-14",
		assignee: "Sarah Chen",
		description:
			"Official project kickoff meeting with all stakeholders to align on goals, scope, and deliverables.",
		color: "#8b5cf6",
		milestoneEmoji: "🎯",
		priority: "critical",
		status: "completed",
		sprint: "Sprint 25.1",
		progress: 100,
		tags: ["planning", "milestone", "leadership"],
	},
	{
		id: "2",
		name: "User Research & Persona Development",
		startDate: "2025-04-15",
		endDate: "2025-04-28",
		assignee: "Maria Rodriguez",
		description:
			"Conduct comprehensive user interviews, surveys, and data analysis to create detailed user personas.",
		color: "#10b981",
		priority: "high",
		status: "completed",
		sprint: "Sprint 25.1",
		dependencies: ["1"],
		progress: 100,
		tags: ["ux", "research", "user-centered"],
	},
	{
		id: "3",
		name: "Technical Architecture Planning",
		startDate: "2025-04-20",
		endDate: "2025-05-05",
		assignee: "David Kim",
		description:
			"Design system architecture, select technology stack, and set up development infrastructure.",
		color: "#f59e0b",
		priority: "critical",
		status: "completed",
		sprint: "Sprint 25.2",
		dependencies: ["1"],
		progress: 100,
		tags: ["infrastructure", "backend", "architecture"],
	},
	{
		id: "4",
		name: "Design System Creation",
		startDate: "2025-04-25",
		endDate: "2025-05-12",
		assignee: "Emily Watson",
		description:
			"Create comprehensive design system including components, style guide, and interaction patterns.",
		color: "#ec4899",
		priority: "high",
		status: "completed",
		sprint: "Sprint 25.2",
		dependencies: ["2"],
		progress: 100,
		tags: ["design", "ui", "components"],
	},
	{
		id: "5",
		name: "Frontend Framework Setup",
		startDate: "2025-05-08",
		endDate: "2025-05-20",
		assignee: "Alex Thompson",
		description:
			"Set up React application structure, routing, state management, and build process.",
		color: "#06b6d4",
		priority: "high",
		status: "completed",
		sprint: "Sprint 25.3",
		dependencies: ["3", "4"],
		progress: 100,
		tags: ["frontend", "react", "setup"],
	},

	{
		id: "6",
		name: "User Authentication System",
		startDate: "2025-05-21",
		endDate: "2025-06-15",
		assignee: "Marcus Johnson",
		description:
			"Implement secure user authentication with JWT tokens, password reset, and session management.",
		color: "#8b5cf6",
		priority: "critical",
		status: "in-progress",
		sprint: "Sprint 26.1",
		dependencies: ["3"],
		progress: 75,
		tags: ["backend", "security", "auth"],
	},
	{
		id: "7",
		name: "Dashboard Implementation",
		startDate: "2025-05-28",
		endDate: "2025-06-18",
		assignee: "Lisa Park",
		description:
			"Build main dashboard with navigation, data visualization, and responsive layout.",
		color: "#10b981",
		priority: "high",
		status: "in-progress",
		sprint: "Sprint 26.1",
		dependencies: ["5"],
		progress: 60,
		tags: ["frontend", "dashboard", "ui"],
	},
	{
		id: "8",
		name: "API Gateway Configuration",
		startDate: "2025-06-03",
		endDate: "2025-06-22",
		assignee: "DevOps Team",
		description:
			"Configure API Gateway with rate limiting, caching, and microservice routing.",
		color: "#f59e0b",
		priority: "high",
		status: "in-progress",
		sprint: "Sprint 26.2",
		dependencies: ["3"],
		progress: 40,
		tags: ["infrastructure", "api", "devops"],
	},
	{
		id: "9",
		name: "Mobile App Wireframes",
		startDate: "2025-06-05",
		endDate: "2025-06-15",
		assignee: "Sofia Martinez",
		description:
			"Create mobile app wireframes and user flow diagrams for iOS and Android.",
		color: "#ec4899",
		priority: "medium",
		status: "in-progress",
		sprint: "Sprint 26.2",
		dependencies: ["2"],
		progress: 25,
		tags: ["mobile", "ux", "wireframes"],
	},
	{
		id: "10",
		name: "Database Optimization",
		startDate: "2025-06-10",
		endDate: "2025-06-20",
		assignee: "Robert Chen",
		description:
			"Optimize database queries, implement indexing, and set up monitoring.",
		color: "#7c3aed",
		priority: "medium",
		status: "in-progress",
		sprint: "Sprint 26.2",
		dependencies: ["3"],
		progress: 15,
		tags: ["database", "performance", "backend"],
	},

	{
		id: "11",
		name: "Alpha Release",
		startDate: "2025-06-16",
		endDate: "2025-06-16",
		assignee: "Sarah Chen",
		description:
			"Internal alpha release for stakeholder review and feedback collection.",
		color: "#8b5cf6",
		milestoneEmoji: "🧪",
		priority: "critical",
		status: "not-started",
		sprint: "Sprint 26.2",
		dependencies: ["6", "7"],
		progress: 0,
		tags: ["release", "milestone", "testing"],
	},
	{
		id: "12",
		name: "User Profile Management",
		startDate: "2025-06-17",
		endDate: "2025-06-30",
		assignee: "Emma Wilson",
		description:
			"Build user profile pages with settings, preferences, and account management.",
		color: "#06b6d4",
		priority: "high",
		status: "not-started",
		sprint: "Sprint 26.3",
		dependencies: ["6"],
		progress: 0,
		tags: ["frontend", "user-profile"],
	},
	{
		id: "13",
		name: "Payment Integration",
		startDate: "2025-06-20",
		endDate: "2025-07-05",
		assignee: "James Liu",
		description:
			"Integrate Stripe payment processing with subscription management and billing.",
		color: "#f59e0b",
		priority: "high",
		status: "not-started",
		sprint: "Sprint 26.3",
		dependencies: ["6"],
		progress: 0,
		tags: ["backend", "payments", "billing"],
	},
	{
		id: "14",
		name: "Mobile App Development",
		startDate: "2025-06-23",
		endDate: "2025-08-15",
		assignee: "Mobile Team",
		description:
			"Develop React Native mobile application for iOS and Android platforms.",
		color: "#ec4899",
		priority: "high",
		status: "not-started",
		sprint: "Sprint 27.1",
		dependencies: ["9"],
		progress: 0,
		tags: ["mobile", "react-native", "development"],
	},
	{
		id: "15",
		name: "Analytics Implementation",
		startDate: "2025-07-01",
		endDate: "2025-07-15",
		assignee: "Data Team",
		description:
			"Implement analytics tracking, dashboards, and reporting for business metrics.",
		color: "#10b981",
		priority: "medium",
		status: "not-started",
		sprint: "Sprint 27.1",
		dependencies: ["7"],
		progress: 0,
		tags: ["analytics", "data", "reporting"],
	},
	{
		id: "16",
		name: "Security Audit",
		startDate: "2025-07-10",
		endDate: "2025-07-20",
		assignee: "Security Team",
		description:
			"Comprehensive security audit including penetration testing and vulnerability assessment.",
		color: "#ef4444",
		priority: "critical",
		status: "not-started",
		sprint: "Sprint 27.2",
		dependencies: ["6", "8"],
		progress: 0,
		tags: ["security", "audit", "compliance"],
	},
	{
		id: "17",
		name: "Performance Testing",
		startDate: "2025-07-15",
		endDate: "2025-07-25",
		assignee: "QA Team",
		description:
			"Load testing, stress testing, and performance optimization across all systems.",
		color: "#7c3aed",
		priority: "high",
		status: "not-started",
		sprint: "Sprint 27.2",
		dependencies: ["8", "10"],
		progress: 0,
		tags: ["testing", "performance", "qa"],
	},
	{
		id: "18",
		name: "Beta Release",
		startDate: "2025-07-28",
		endDate: "2025-07-28",
		assignee: "Sarah Chen",
		description:
			"Public beta release with limited user access and feedback collection system.",
		color: "#8b5cf6",
		milestoneEmoji: "🚀",
		priority: "critical",
		status: "not-started",
		sprint: "Sprint 27.2",
		dependencies: ["16", "17"],
		progress: 0,
		tags: ["release", "milestone", "beta"],
	},
	{
		id: "19",
		name: "Customer Support Portal",
		startDate: "2025-08-01",
		endDate: "2025-08-20",
		assignee: "Support Team",
		description:
			"Build customer support portal with ticketing system and knowledge base.",
		color: "#06b6d4",
		priority: "medium",
		status: "not-started",
		sprint: "Sprint 28.1",
		dependencies: ["12"],
		progress: 0,
		tags: ["support", "customer-service"],
	},
	{
		id: "20",
		name: "Marketing Website",
		startDate: "2025-08-05",
		endDate: "2025-08-25",
		assignee: "Marketing Team",
		description:
			"Create marketing website with SEO optimization and conversion tracking.",
		color: "#ec4899",
		priority: "medium",
		status: "not-started",
		sprint: "Sprint 28.1",
		progress: 0,
		tags: ["marketing", "website", "seo"],
	},
];

const convertToAppTask = (task: Task): AppTask => ({
	...task,
	startDate: parseDate(task.startDate),
	endDate: parseDate(task.endDate),
});

const CustomDropdown: React.FC<{
	options: { value: string; label: string; icon?: string; color?: string }[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}> = ({ options, value, onChange, placeholder = "Select..." }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<div ref={dropdownRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-3 py-3 neumorphic-inset border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between responsive-text-sm"
			>
				<span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
					{selectedOption ? (
						<span className="flex items-center gap-2">
							{selectedOption.icon && <span>{selectedOption.icon}</span>}
							{selectedOption.label}
						</span>
					) : (
						placeholder
					)}
				</span>
				<svg
					className={`w-4 h-4 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute z-50 w-full mt-2 neumorphic border border-gray-300 rounded-xl shadow-xl overflow-hidden dropdown-animate">
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onChange(option.value);
								setIsOpen(false);
							}}
							className={`w-full px-3 py-3 text-left hover:bg-gray-200 transition-all flex items-center gap-2 responsive-text-sm ${
								option.value === value
									? "bg-gray-200 text-gray-900 font-medium"
									: "text-gray-700"
							}`}
						>
							{option.icon && <span>{option.icon}</span>}
							<span>{option.label}</span>
							{option.color && (
								<div
									className="w-3 h-3 rounded-full ml-auto"
									style={{ backgroundColor: option.color }}
								/>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

const LoadingSpinner = () => (
	<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
		<div className="text-center">
			<div className="relative w-16 h-16 mx-auto mb-6 neumorphic rounded-full p-2">
				<div className="absolute inset-2 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
				<div className="absolute inset-3 rounded-full border-2 border-blue-400 border-b-transparent animate-spin animation-delay-150"></div>
			</div>
			<h3 className="responsive-text-xl font-semibold text-gray-800 mb-2">
				Loading Timeline
			</h3>
			<p className="text-gray-600 responsive-text-base">
				Preparing your project dashboard...
			</p>
		</div>
	</div>
);

const StatusBadge = ({ status }: { status: Task["status"] }) => {
	const configs = {
		"not-started": {
			bg: "bg-gray-100",
			text: "text-gray-700",
			label: "Not Started",
			dot: "bg-gray-400",
		},
		"in-progress": {
			bg: "bg-blue-100",
			text: "text-blue-700",
			label: "In Progress",
			dot: "bg-blue-500",
		},
		completed: {
			bg: "bg-green-100",
			text: "text-green-700",
			label: "Completed",
			dot: "bg-green-500",
		},
		blocked: {
			bg: "bg-red-100",
			text: "text-red-700",
			label: "Blocked",
			dot: "bg-red-500",
		},
		"on-hold": {
			bg: "bg-orange-100",
			text: "text-orange-700",
			label: "On Hold",
			dot: "bg-orange-500",
		},
	};

	const config = configs[status];

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full responsive-text-xs font-medium ${config.bg} ${config.text} shadow-sm`}
		>
			<div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
			{config.label}
		</span>
	);
};

const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
	const configs = {
		low: { bg: "bg-gray-100", text: "text-gray-600", label: "Low", icon: "●" },
		medium: {
			bg: "bg-yellow-100",
			text: "text-yellow-700",
			label: "Medium",
			icon: "●●",
		},
		high: {
			bg: "bg-orange-100",
			text: "text-orange-700",
			label: "High",
			icon: "●●●",
		},
		critical: {
			bg: "bg-red-100",
			text: "text-red-700",
			label: "Critical",
			icon: "🔥",
		},
	};

	const config = configs[priority];

	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-1 rounded responsive-text-xs font-medium ${config.bg} ${config.text} shadow-sm`}
		>
			<span className="responsive-text-xs">{config.icon}</span>
			{config.label}
		</span>
	);
};

const TaskDetailsForm: React.FC<{
	task: AppTask | null;
	onSaveTask: (task: AppTask) => void;
	onClearSelection: () => void;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
}> = ({
	task,
	onSaveTask,
	onClearSelection,
	isCollapsed,
	onToggleCollapse,
}) => {
	const [formData, setFormData] = useState<Partial<AppTask>>({});
	const [isEditing, setIsEditing] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const formRef = useRef<HTMLDivElement>(null);

	const duration = useMemo(() => {
		if (!formData.startDate || !formData.endDate) return 0;
		const start =
			formData.startDate instanceof Date
				? formData.startDate
				: parseDate(formData.startDate as string);
		const end =
			formData.endDate instanceof Date
				? formData.endDate
				: parseDate(formData.endDate as string);
		return daysBetween(start, end) + 1;
	}, [formData.startDate, formData.endDate]);

	useEffect(() => {
		if (task) {
			if (task.isNew) {
				setFormData({
					id: task.id,
					color: task.color,
					priority: undefined,
					status: undefined,
					progress: 0,
				});
				setIsEditing(true);
			} else {
				setFormData(task);
				setIsEditing(false);
			}
			setErrors({});
		} else {
			setFormData({});
			setIsEditing(false);
			setErrors({});
		}
	}, [task]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target;
		if (type === "date" && value) {
			setFormData((prev) => ({ ...prev, [name]: parseDate(value) }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleDropdownChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!formData.name?.trim()) {
			newErrors.name = "Task name is required";
		}
		if (!formData.assignee?.trim()) {
			newErrors.assignee = "Assignee is required";
		}
		if (!formData.startDate) {
			newErrors.startDate = "Start date is required";
		}
		if (!formData.endDate) {
			newErrors.endDate = "End date is required";
		}
		if (!formData.priority) {
			newErrors.priority = "Priority is required";
		}
		if (!formData.status) {
			newErrors.status = "Status is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (!validateForm()) {
			return;
		}

		if (task && formData.startDate && formData.endDate && formData.name) {
			onSaveTask({ ...task, ...formData } as AppTask);
			if (!task.isNew) {
				setIsEditing(false);
			}
		}
	};

	const priorityOptions = [
		{ value: "low", label: "Low", icon: "●" },
		{ value: "medium", label: "Medium", icon: "●●" },
		{ value: "high", label: "High", icon: "●●●" },
		{ value: "critical", label: "Critical", icon: "🔥" },
	];

	const statusOptions = [
		{ value: "not-started", label: "Not Started", color: "#94a3b8" },
		{ value: "in-progress", label: "In Progress", color: "#3b82f6" },
		{ value: "completed", label: "Completed", color: "#10b981" },
		{ value: "blocked", label: "Blocked", color: "#ef4444" },
		{ value: "on-hold", label: "On Hold", color: "#f97316" },
	];

	if (isCollapsed) {
		return (
			<div className="neumorphic rounded-3xl border border-gray-300 h-full">
				<button
					onClick={onToggleCollapse}
					className="w-full h-full flex flex-col items-center justify-center text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-3xl p-8 hover:bg-gray-50 transition-all min-h-[300px]"
				>
					<div className="w-16 h-16 neumorphic rounded-full flex items-center justify-center mb-6">
						<svg
							className="w-8 h-8 text-gray-700"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
					<h3 className="responsive-text-xl font-bold text-gray-800 mb-4 leading-tight">
						Expand Panel
					</h3>
					<p className="text-gray-600 responsive-text-base leading-relaxed">
						View task details
					</p>
				</button>
			</div>
		);
	}

	if (!task) {
		return (
			<div className="neumorphic rounded-3xl border border-gray-300 p-6 h-full sticky top-8">
				<div className="flex items-center justify-between mb-6">
					<h3 className="responsive-text-lg font-bold text-gray-800">
						Task Details
					</h3>
					<button
						onClick={onToggleCollapse}
						className="p-2 text-gray-600 hover:text-gray-800 neumorphic-button rounded-xl"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				</div>
				<div className="flex flex-col items-center justify-center h-full text-center py-8">
					<div className="w-20 h-20 neumorphic rounded-full flex items-center justify-center mb-6">
						<svg
							className="w-10 h-10 text-gray-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
							/>
						</svg>
					</div>
					<h3 className="responsive-text-xl font-bold text-gray-800 mb-3">
						Project Dashboard
					</h3>
					<p className="text-gray-600 responsive-text-base mb-8">
						Select a task to see its details, or click "Add New Task" to get
						started.
					</p>

					<div className="w-full mt-auto">
						<div className="neumorphic-inset rounded-xl p-4 border border-gray-300 mb-4">
							<h4 className="font-semibold text-gray-800 mb-2 responsive-text-sm">
								Quick Tips
							</h4>
							<ul className="text-left space-y-2">
								<li className="flex items-start gap-2 responsive-text-xs text-gray-700">
									<svg
										className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										/>
									</svg>
									<span>Drag tasks in the timeline to reschedule</span>
								</li>
								<li className="flex items-start gap-2 responsive-text-xs text-gray-700">
									<svg
										className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										/>
									</svg>
									<span>Reorder tasks by dragging in the sidebar</span>
								</li>
								<li className="flex items-start gap-2 responsive-text-xs text-gray-700">
									<svg
										className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										/>
									</svg>
									<span>Use zoom controls to adjust timeline view</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<style>{scrollbarStyles}</style>
			<div
				ref={formRef}
				className="neumorphic rounded-3xl border border-gray-300 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar sticky top-8"
			>
				<div className="flex items-center justify-between mb-6">
					<h3 className="responsive-text-xl font-bold text-gray-800">
						{task.isNew ? "Create New Task" : "Task Details"}
					</h3>
					<div className="flex items-center gap-2">
						<button
							onClick={onToggleCollapse}
							className="p-2 text-gray-600 hover:text-gray-800 neumorphic-button rounded-xl"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
						{!task.isNew && (
							<button
								onClick={() => setIsEditing(!isEditing)}
								className="p-2 text-gray-600 hover:text-gray-800 neumorphic-button rounded-xl"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</button>
						)}
						<button
							onClick={onClearSelection}
							className="p-2 text-gray-600 hover:text-gray-800 neumorphic-button rounded-xl"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
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
				</div>

				{!isEditing ? (
					<div className="space-y-6">
						<div>
							<h4 className="responsive-text-lg font-semibold text-gray-900 mb-2">
								{task.name}
							</h4>
							<p className="text-gray-700 responsive-text-sm">
								{task.description}
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div>
								<label className="block responsive-text-sm font-medium text-gray-700 mb-2">
									Assignee
								</label>
								<div className="neumorphic-inset rounded-xl p-3 border border-gray-300">
									<span className="text-gray-900 font-medium responsive-text-sm">
										{task.assignee}
									</span>
								</div>
							</div>
							<div>
								<label className="block responsive-text-sm font-medium text-gray-700 mb-2">
									Sprint
								</label>
								<div className="neumorphic-inset rounded-xl p-3 border border-gray-300">
									<span className="text-gray-900 font-medium responsive-text-sm">
										{task.sprint || "Unassigned"}
									</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div>
								<label className="block responsive-text-sm font-medium text-gray-700 mb-2">
									Start Date
								</label>
								<div className="neumorphic-inset rounded-xl p-3 border border-gray-300">
									<span className="text-gray-900 font-medium responsive-text-sm">
										{formatDate(task.startDate)}
									</span>
								</div>
							</div>
							<div>
								<label className="block responsive-text-sm font-medium text-gray-700 mb-2">
									End Date
								</label>
								<div className="neumorphic-inset rounded-xl p-3 border border-gray-300">
									<span className="text-gray-900 font-medium responsive-text-sm">
										{formatDate(task.endDate)}
									</span>
								</div>
							</div>
						</div>

						<div className="neumorphic rounded-xl p-4 border border-gray-300">
							<div className="flex justify-between items-center">
								<span className="text-gray-700 font-medium responsive-text-sm">
									Duration
								</span>
								<span className="responsive-text-xl font-bold text-gray-900">
									{daysBetween(task.startDate, task.endDate) + 1} days
								</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-3">
							<StatusBadge status={task.status} />
							<PriorityBadge priority={task.priority} />
						</div>

						{task.progress !== undefined && task.progress > 0 && (
							<div>
								<label className="block responsive-text-sm font-medium text-gray-700 mb-2">
									Progress
								</label>
								<div className="neumorphic-inset rounded-xl p-4 border border-gray-300">
									<div className="flex justify-between items-center mb-2">
										<span className="text-gray-700 responsive-text-sm">
											Completion
										</span>
										<span className="text-gray-900 font-bold responsive-text-sm">
											{task.progress}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3 neumorphic-inset">
										<div
											className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500"
											style={{ width: `${task.progress}%` }}
										></div>
									</div>
								</div>
							</div>
						)}

						{task.tags && task.tags.length > 0 && (
							<div>
								<label className="block responsive-text-sm font-medium text-gray-700 mb-2">
									Tags
								</label>
								<div className="flex flex-wrap gap-2">
									{task.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 neumorphic text-gray-800 rounded-full responsive-text-xs border border-gray-300"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}

						<div className="pt-4">
							<button
								onClick={() => setIsEditing(true)}
								className="w-full py-3 neumorphic-button border border-gray-300 text-gray-900 rounded-xl font-medium transition-all responsive-text-sm flex items-center justify-center gap-2"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									/>
								</svg>
								Edit Task
							</button>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div>
							<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
								Task Name *
							</label>
							<input
								name="name"
								value={formData.name || ""}
								onChange={handleChange}
								className={`w-full px-4 py-3 neumorphic-inset border ${
									errors.name ? "border-red-400" : "border-gray-300"
								} rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all responsive-text-sm`}
								placeholder="Enter task name"
							/>
							{errors.name && (
								<p className="text-red-600 responsive-text-xs mt-1">
									{errors.name}
								</p>
							)}
						</div>

						<div>
							<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
								Assignee *
							</label>
							<input
								name="assignee"
								value={formData.assignee || ""}
								onChange={handleChange}
								className={`w-full px-4 py-3 neumorphic-inset border ${
									errors.assignee ? "border-red-400" : "border-gray-300"
								} rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all responsive-text-sm`}
								placeholder="Enter assignee name"
							/>
							{errors.assignee && (
								<p className="text-red-600 responsive-text-xs mt-1">
									{errors.assignee}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
							<div>
								<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
									Start Date *
								</label>
								<input
									type="date"
									name="startDate"
									value={
										formData.startDate
											? formatDate(
													formData.startDate instanceof Date
														? formData.startDate
														: parseDate(formData.startDate as string)
											  )
											: ""
									}
									onChange={handleChange}
									className={`w-full px-4 py-3 neumorphic-inset border ${
										errors.startDate ? "border-red-400" : "border-gray-300"
									} rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all responsive-text-sm`}
								/>
								{errors.startDate && (
									<p className="text-red-600 responsive-text-xs mt-1">
										{errors.startDate}
									</p>
								)}
							</div>
							<div>
								<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
									End Date *
								</label>
								<input
									type="date"
									name="endDate"
									value={
										formData.endDate
											? formatDate(
													formData.endDate instanceof Date
														? formData.endDate
														: parseDate(formData.endDate as string)
											  )
											: ""
									}
									onChange={handleChange}
									className={`w-full px-4 py-3 neumorphic-inset border ${
										errors.endDate ? "border-red-400" : "border-gray-300"
									} rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all responsive-text-sm`}
								/>
								{errors.endDate && (
									<p className="text-red-600 responsive-text-xs mt-1">
										{errors.endDate}
									</p>
								)}
							</div>
						</div>

						<div className="neumorphic rounded-xl p-4 border border-gray-300">
							<div className="flex justify-between items-center">
								<span className="text-gray-700 font-medium responsive-text-sm">
									Duration
								</span>
								<span className="responsive-text-lg font-bold text-gray-900">
									{duration} days
								</span>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
							<div>
								<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
									Priority *
								</label>
								<CustomDropdown
									options={priorityOptions}
									value={formData.priority || ""}
									onChange={(value) => handleDropdownChange("priority", value)}
									placeholder="Select priority"
								/>
								{errors.priority && (
									<p className="text-red-600 responsive-text-xs mt-1">
										{errors.priority}
									</p>
								)}
							</div>
							<div>
								<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
									Status *
								</label>
								<CustomDropdown
									options={statusOptions}
									value={formData.status || ""}
									onChange={(value) => handleDropdownChange("status", value)}
									placeholder="Select status"
								/>
								{errors.status && (
									<p className="text-red-600 responsive-text-xs mt-1">
										{errors.status}
									</p>
								)}
							</div>
						</div>

						<div>
							<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
								Sprint
							</label>
							<input
								name="sprint"
								value={formData.sprint || ""}
								onChange={handleChange}
								className="w-full px-4 py-3 neumorphic-inset border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all responsive-text-sm"
								placeholder="e.g., Sprint 27.1"
							/>
						</div>

						{formData.status === "in-progress" && (
							<div>
								<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
									Progress
								</label>
								<div className="flex items-center gap-3">
									<input
										type="range"
										name="progress"
										min="0"
										max="100"
										value={formData.progress || 0}
										onChange={handleChange}
										className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
									/>
									<span className="text-gray-900 font-bold w-12 text-right responsive-text-sm">
										{formData.progress || 0}%
									</span>
								</div>
							</div>
						)}

						<div>
							<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
								Description
							</label>
							<textarea
								name="description"
								value={formData.description || ""}
								onChange={handleChange}
								rows={3}
								className="w-full px-4 py-3 neumorphic-inset border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none responsive-text-sm"
								placeholder="Enter task description"
							/>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
							<div>
								<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
									Color
								</label>
								<input
									type="color"
									name="color"
									value={formData.color || "#8b5cf6"}
									onChange={handleChange}
									className="w-full h-12 neumorphic-inset border border-gray-300 rounded-xl cursor-pointer"
								/>
							</div>
							<div>
								<label className="block responsive-text-sm font-medium text-gray-800 mb-2">
									Milestone Emoji
								</label>
								<input
									name="milestoneEmoji"
									value={formData.milestoneEmoji || ""}
									onChange={handleChange}
									className="w-full px-4 py-3 neumorphic-inset border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all responsive-text-sm"
									placeholder="e.g., 🚀"
								/>
							</div>
						</div>

						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={() =>
									task.isNew ? onClearSelection() : setIsEditing(false)
								}
								className="flex-1 px-6 py-3 neumorphic-button border border-gray-300 text-gray-900 rounded-xl font-medium transition-all responsive-text-sm"
							>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className="flex-1 px-6 py-3 primary-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all shadow-md responsive-text-sm"
							>
								{task.isNew ? "Create Task" : "Save Changes"}
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

const GanttChart: React.FC<{
	tasks: AppTask[];
	selectedTask: AppTask | null;
	onTaskSelect: (task: AppTask) => void;
	onTaskUpdate: (task: AppTask) => void;
	onTasksReorder: (sourceId: string, targetIndex: number) => void;
	zoomLevel: ZoomLevel;
	startDate: Date;
	endDate: Date;
}> = ({
	tasks,
	selectedTask,
	onTaskSelect,
	onTaskUpdate,
	onTasksReorder,
	zoomLevel,
	startDate,
	endDate,
}) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [draggingTask, setDraggingTask] = useState<AppTask | null>(null);
	const [dragOffset, setDragOffset] = useState(0);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	const taskHeight = Math.max(36, Math.min(44, window.innerWidth * 0.035));
	const taskPadding = Math.max(8, Math.min(12, window.innerWidth * 0.01));
	const rowHeight = taskHeight + taskPadding;
	const headerHeight = Math.max(80, Math.min(100, window.innerWidth * 0.08));
	const sidebarWidth = Math.max(240, Math.min(340, window.innerWidth * 0.22));

	const totalDays = daysBetween(startDate, endDate) + 1;
	const totalWidth = totalDays * zoomLevel.pixelsPerDay;

	useEffect(() => {
		const checkTouchDevice = () => {
			setIsTouchDevice(
				"ontouchstart" in window || navigator.maxTouchPoints > 0
			);
		};

		checkTouchDevice();
		window.addEventListener("resize", checkTouchDevice);

		return () => {
			window.removeEventListener("resize", checkTouchDevice);
		};
	}, []);

	const handleDragStart = (e: React.DragEvent, task: AppTask) => {
		const rect = (
			e.currentTarget.parentElement as HTMLElement
		).getBoundingClientRect();
		const taskStart =
			daysBetween(startDate, task.startDate) * zoomLevel.pixelsPerDay;
		const mouseX = e.clientX - rect.left;
		setDragOffset(mouseX - taskStart);
		setDraggingTask(task);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (!draggingTask || !scrollRef.current) return;

		const rect = scrollRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left + scrollRef.current.scrollLeft - dragOffset;
		const dayIndex = Math.round(x / zoomLevel.pixelsPerDay);
		const newStartDate = addDays(startDate, Math.max(0, dayIndex));
		const duration = daysBetween(draggingTask.startDate, draggingTask.endDate);
		const newEndDate = addDays(newStartDate, duration);

		onTaskUpdate({
			...draggingTask,
			startDate: newStartDate,
			endDate: newEndDate,
		});

		setDraggingTask(null);
	};

	const handleTouchMove = (e: React.TouchEvent, task: AppTask) => {
		if (isTouchDevice && scrollRef.current) {
			e.stopPropagation();
			const touch = e.touches[0];
			const rect = scrollRef.current.getBoundingClientRect();
			const x = touch.clientX - rect.left + scrollRef.current.scrollLeft;
			const dayIndex = Math.round(x / zoomLevel.pixelsPerDay);
		}
	};

	const handleTouchEnd = (e: React.TouchEvent, task: AppTask) => {
		if (isTouchDevice && scrollRef.current) {
			const touch = e.changedTouches[0];
			const rect = scrollRef.current.getBoundingClientRect();
			const x = touch.clientX - rect.left + scrollRef.current.scrollLeft;
			const dayIndex = Math.round(x / zoomLevel.pixelsPerDay);
			const newStartDate = addDays(startDate, Math.max(0, dayIndex));
			const duration = daysBetween(task.startDate, task.endDate);
			const newEndDate = addDays(newStartDate, duration);

			onTaskUpdate({
				...task,
				startDate: newStartDate,
				endDate: newEndDate,
			});
		}
	};

	const handleSidebarDragStart = (e: React.DragEvent, taskId: string) => {
		e.dataTransfer.setData("taskId", taskId);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleSidebarDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		setDragOverIndex(index);
	};

	const handleSidebarDrop = (e: React.DragEvent, targetIndex: number) => {
		e.preventDefault();
		const sourceTaskId = e.dataTransfer.getData("taskId");
		if (sourceTaskId && sourceTaskId !== tasks[targetIndex].id) {
			onTasksReorder(sourceTaskId, targetIndex);
		}
		setDragOverIndex(null);
	};

	const handleSidebarDragLeave = () => {
		setDragOverIndex(null);
	};

	const renderTimeHeaders = () => {
		const monthHeaders: JSX.Element[] = [];
		const dayHeaders: JSX.Element[] = [];

		const monthSpans: {
			start: number;
			end: number;
			month: number;
			year: number;
		}[] = [];
		let currentMonth = -1;
		let monthStart = 0;

		for (let i = 0; i <= totalDays; i++) {
			const date = addDays(startDate, i);
			const month = date.getUTCMonth();
			const year = date.getUTCFullYear();

			if (month !== currentMonth) {
				if (currentMonth !== -1) {
					monthSpans.push({
						start: monthStart,
						end: i - 1,
						month: currentMonth,
						year: addDays(startDate, monthStart).getUTCFullYear(),
					});
				}
				currentMonth = month;
				monthStart = i;
			}
		}

		if (currentMonth !== -1) {
			monthSpans.push({
				start: monthStart,
				end: totalDays - 1,
				month: currentMonth,
				year: addDays(startDate, monthStart).getUTCFullYear(),
			});
		}

		monthSpans.forEach((span, index) => {
			const monthWidth = (span.end - span.start + 1) * zoomLevel.pixelsPerDay;
			if (monthWidth >= 60) {
				monthHeaders.push(
					<div
						key={`month-${index}`}
						className="absolute neumorphic border-r border-gray-300 flex items-center justify-center font-semibold text-gray-800 responsive-text-sm"
						style={{
							left: `${span.start * zoomLevel.pixelsPerDay}px`,
							width: `${monthWidth}px`,
							height: "50px",
						}}
					>
						{getMonthName(span.month)} {span.year}
					</div>
				);
			}
		});

		for (let i = 0; i < totalDays; i++) {
			const date = addDays(startDate, i);
			const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;

			if (
				zoomLevel.timeHeaderFormat === "day" &&
				zoomLevel.pixelsPerDay >= 30
			) {
				dayHeaders.push(
					<div
						key={`day-${i}`}
						className={`absolute border-r border-gray-300 flex flex-col items-center justify-center responsive-text-sm font-medium transition-all ${
							isWeekend
								? "neumorphic-inset text-gray-600"
								: "neumorphic text-gray-800 hover:bg-gray-200"
						}`}
						style={{
							left: `${i * zoomLevel.pixelsPerDay}px`,
							width: `${zoomLevel.pixelsPerDay}px`,
							height: "50px",
						}}
					>
						<span className="responsive-text-xs text-gray-600">
							{date.toLocaleDateString("en-US", { weekday: "short" })}
						</span>
						<span className="responsive-text-base font-bold">
							{date.getUTCDate()}
						</span>
					</div>
				);
			} else if (
				zoomLevel.timeHeaderFormat === "week" ||
				(zoomLevel.timeHeaderFormat === "day" && zoomLevel.pixelsPerDay < 30)
			) {
				if (date.getUTCDay() === 1 || i === 0) {
					const weekWidth = Math.min(
						7 * zoomLevel.pixelsPerDay,
						totalWidth - i * zoomLevel.pixelsPerDay
					);
					if (weekWidth >= 40) {
						dayHeaders.push(
							<div
								key={`week-${i}`}
								className="absolute neumorphic border-r border-gray-300 flex items-center justify-center responsive-text-sm font-medium text-gray-800"
								style={{
									left: `${i * zoomLevel.pixelsPerDay}px`,
									width: `${weekWidth}px`,
									height: "50px",
								}}
							>
								Week {getWeekNumber(date)}
							</div>
						);
					}
				}
			}
		}

		return (
			<>
				<div className="relative h-12 border-b border-gray-300">
					{monthHeaders}
				</div>
				<div className="relative h-12 border-b border-gray-400">
					{dayHeaders}
				</div>
			</>
		);
	};

	const renderGridLines = () => {
		const lines: JSX.Element[] = [];

		for (let i = 0; i <= totalDays; i++) {
			const date = addDays(startDate, i);
			const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
			const isMonday = date.getUTCDay() === 1;

			lines.push(
				<div
					key={`vline-${i}`}
					className={`absolute top-0 h-full ${
						isMonday ? "border-l border-gray-400" : "border-l border-gray-200"
					}`}
					style={{ left: `${i * zoomLevel.pixelsPerDay}px` }}
				/>
			);

			if (isWeekend && zoomLevel.pixelsPerDay >= 20) {
				lines.push(
					<div
						key={`weekend-${i}`}
						className="absolute top-0 h-full bg-gray-100 opacity-50"
						style={{
							left: `${i * zoomLevel.pixelsPerDay}px`,
							width: `${zoomLevel.pixelsPerDay}px`,
						}}
					/>
				);
			}
		}

		tasks.forEach((_, index) => {
			lines.push(
				<div
					key={`hline-${index}`}
					className="absolute left-0 w-full h-px bg-gray-200"
					style={{ top: `${(index + 1) * rowHeight - taskPadding / 2}px` }}
				/>
			);
		});

		return lines;
	};

	const renderTodayLine = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (today >= startDate && today <= endDate) {
			const offset = daysBetween(startDate, today) * zoomLevel.pixelsPerDay;
			return (
				<div
					className="absolute top-0 h-full w-0.5 bg-red-500 z-30 pointer-events-none"
					style={{ left: `${offset}px` }}
				>
					<div className="absolute -top-8 left-1 bg-red-500 text-white responsive-text-xs px-2 py-1 rounded-lg shadow-lg font-medium">
						Today
					</div>
				</div>
			);
		}
		return null;
	};

	const mobileSidebarClass = isMobileMenuOpen
		? "mobile-sidebar open"
		: "mobile-sidebar";

	return (
		<>
			<style>{scrollbarStyles}</style>
			<div className="neumorphic rounded-3xl border border-gray-300 h-full flex flex-col overflow-hidden">
				{}
				<button
					className="mobile-menu-button hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					{isMobileMenuOpen ? (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					) : (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					)}
				</button>

				<div className="flex flex-1 min-w-0">
					<div
						className={`flex-shrink-0 border-r border-gray-300 neumorphic-inset sm:static ${mobileSidebarClass}`}
						style={{ width: sidebarWidth }}
						onDragLeave={handleSidebarDragLeave}
					>
						<div
							className="neumorphic border-b border-gray-400 flex items-center px-6"
							style={{ height: headerHeight }}
						>
							<h3 className="font-bold text-gray-800 responsive-text-lg flex items-center gap-2">
								<svg
									className="w-5 h-5 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
									/>
								</svg>
								Tasks
							</h3>
						</div>
						<div
							className="overflow-y-auto custom-scrollbar"
							style={{ height: `calc(100% - ${headerHeight}px)` }}
						>
							{tasks.map((task, index) => (
								<div
									key={task.id}
									draggable={!isTouchDevice}
									onDragStart={(e) => handleSidebarDragStart(e, task.id)}
									onDragOver={(e) => handleSidebarDragOver(e, index)}
									onDrop={(e) => handleSidebarDrop(e, index)}
									onClick={() => onTaskSelect(task)}
									className={`relative px-6 py-4 cursor-grab border-b border-gray-200 transition-all duration-200 group hover:bg-gray-100 ${
										selectedTask?.id === task.id
											? "bg-blue-100 border-blue-300"
											: ""
									} ${dragOverIndex === index ? "bg-blue-200" : ""}`}
									style={{ height: `${rowHeight}px` }}
								>
									{dragOverIndex === index && (
										<div className="absolute top-0 left-0 h-1 w-full bg-blue-500" />
									)}
									<div className="flex items-center justify-between h-full task-row-mobile">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											{task.milestoneEmoji && (
												<span className="responsive-text-lg flex-shrink-0">
													{task.milestoneEmoji}
												</span>
											)}
											<div className="min-w-0 flex-1">
												<p className="text-gray-900 font-semibold truncate group-hover:text-gray-900 transition-colors responsive-text-sm task-name-mobile">
													{task.name}
												</p>
												<p className="text-gray-600 responsive-text-xs truncate">
													{task.assignee}
												</p>
											</div>
										</div>
										<div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
											<StatusBadge status={task.status} />
											{task.progress !== undefined &&
												task.progress > 0 &&
												task.status === "in-progress" && (
													<span className="responsive-text-xs text-gray-700 font-medium">
														{task.progress}%
													</span>
												)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex-1 flex flex-col min-w-0 overflow-hidden chart-container-mobile">
						<div
							ref={scrollRef}
							className="flex-1 overflow-auto relative bg-gradient-to-br from-gray-50 to-gray-100 custom-scrollbar"
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						>
							<div
								className="relative"
								style={{
									width: totalWidth,
									height: tasks.length * rowHeight + headerHeight,
								}}
							>
								{}
								<div
									className="sticky top-0 z-40 bg-gray-100 light-glass"
									style={{ height: headerHeight }}
								>
									<div className="relative h-12 border-b border-gray-300">
										{renderTimeHeaders().props.children[0].props.children}
									</div>
									<div className="relative h-12 border-b border-gray-400">
										{renderTimeHeaders().props.children[1].props.children}
									</div>
								</div>

								{}
								<div style={{ paddingTop: "0px" }}>
									{renderGridLines()}
									{renderTodayLine()}

									{}
									{tasks.map((task, index) => {
										const taskStart =
											daysBetween(startDate, task.startDate) *
											zoomLevel.pixelsPerDay;
										const taskDuration =
											daysBetween(task.startDate, task.endDate) + 1;
										const taskWidth = taskDuration * zoomLevel.pixelsPerDay;
										const isMilestone = !!task.milestoneEmoji;
										const isSelected = selectedTask?.id === task.id;

										return (
											<div
												key={task.id}
												draggable={!isTouchDevice}
												onDragStart={(e) => handleDragStart(e, task)}
												onClick={() => onTaskSelect(task)}
												onTouchMove={(e) => handleTouchMove(e, task)}
												onTouchEnd={(e) => handleTouchEnd(e, task)}
												className={`absolute cursor-move z-20 transition-all duration-300 group task-drag-handle ${
													isMilestone ? "z-30" : ""
												} ${isSelected ? "task-selected" : "hover:scale-105"} ${
													draggingTask?.id === task.id
														? "opacity-50 scale-110"
														: ""
												}`}
												style={{
													left: `${taskStart}px`,
													top: `${index * rowHeight + taskPadding / 2}px`,
													width: isMilestone
														? `${taskHeight}px`
														: `${Math.max(taskWidth, 60)}px`,
													height: `${taskHeight}px`,
												}}
											>
												{isMilestone ? (
													<div
														className="w-full h-full rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white/40 group-hover:border-white/70 transition-all neumorphic touch-target"
														style={{ backgroundColor: task.color }}
													>
														<span className="responsive-text-lg">
															{task.milestoneEmoji}
														</span>
													</div>
												) : (
													<div
														className="w-full h-full rounded-xl shadow-lg relative overflow-hidden border border-white/30 group-hover:border-white/50 transition-all neumorphic"
														style={{ backgroundColor: task.color }}
													>
														<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
														<div className="px-3 h-full flex items-center justify-center relative z-10">
															<div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
																<span className="text-gray-900 font-semibold responsive-text-xs truncate text-center drop-shadow-sm">
																	{task.name}
																</span>
																{task.status === "completed" && (
																	<svg
																		className="w-4 h-4 text-gray-900 flex-shrink-0 drop-shadow-sm"
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path
																			fillRule="evenodd"
																			d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																			clipRule="evenodd"
																		/>
																	</svg>
																)}
																{task.status === "blocked" && (
																	<svg
																		className="w-4 h-4 text-gray-900 flex-shrink-0 drop-shadow-sm"
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path
																			fillRule="evenodd"
																			d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
																			clipRule="evenodd"
																		/>
																	</svg>
																)}
																{task.progress !== undefined &&
																	task.progress > 0 &&
																	task.status === "in-progress" && (
																		<span className="text-gray-900 font-bold responsive-text-xs flex-shrink-0 ml-2 drop-shadow-sm">
																			{task.progress}%
																		</span>
																	)}
															</div>
														</div>

														{task.progress !== undefined &&
															task.progress > 0 &&
															task.status === "in-progress" && (
																<div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20 rounded-b-xl overflow-hidden">
																	<div
																		className="h-full bg-gradient-to-r from-green-400 to-green-300 transition-all duration-500"
																		style={{ width: `${task.progress}%` }}
																	/>
																</div>
															)}

														{task.priority === "critical" && (
															<div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const ProjectStats: React.FC<{
	stats: {
		completed: number;
		inProgress: number;
		blocked: number;
		total: number;
		milestones: number;
	};
}> = ({ stats }) => {
	return (
		<div className="neumorphic rounded-3xl border border-gray-300 p-6">
			<h3 className="font-bold text-gray-800 responsive-text-lg mb-4 flex items-center gap-2">
				<svg
					className="w-5 h-5 text-blue-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
				Project Progress
			</h3>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="neumorphic-inset rounded-xl p-4 border border-gray-300">
					<div className="flex flex-col items-center text-center">
						<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
							<svg
								className="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<span className="responsive-text-lg font-bold text-gray-900">
							{stats.completed}
						</span>
						<span className="responsive-text-xs text-gray-700">Completed</span>
					</div>
				</div>

				<div className="neumorphic-inset rounded-xl p-4 border border-gray-300">
					<div className="flex flex-col items-center text-center">
						<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
							<svg
								className="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<span className="responsive-text-lg font-bold text-gray-900">
							{stats.inProgress}
						</span>
						<span className="responsive-text-xs text-gray-700">
							In Progress
						</span>
					</div>
				</div>

				<div className="neumorphic-inset rounded-xl p-4 border border-gray-300">
					<div className="flex flex-col items-center text-center">
						<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
							<svg
								className="w-6 h-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<span className="responsive-text-lg font-bold text-gray-900">
							{stats.blocked}
						</span>
						<span className="responsive-text-xs text-gray-700">Blocked</span>
					</div>
				</div>

				<div className="neumorphic-inset rounded-xl p-4 border border-gray-300">
					<div className="flex flex-col items-center text-center">
						<div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
							<svg
								className="w-6 h-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
								/>
							</svg>
						</div>
						<span className="responsive-text-lg font-bold text-gray-900">
							{stats.milestones}
						</span>
						<span className="responsive-text-xs text-gray-700">Milestones</span>
					</div>
				</div>
			</div>

			<div className="mt-6 neumorphic-inset rounded-xl p-4 border border-gray-300">
				<div className="flex justify-between items-center mb-2">
					<span className="text-gray-700 responsive-text-sm font-medium">
						Overall Completion
					</span>
					<span className="text-gray-900 font-bold responsive-text-sm">
						{Math.round((stats.completed / stats.total) * 100)}%
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3 neumorphic-inset">
					<div
						className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
						style={{ width: `${(stats.completed / stats.total) * 100}%` }}
					></div>
				</div>
			</div>
		</div>
	);
};

const Header: React.FC<{
	onAddTask: () => void;
	onScrollToToday: () => void;
	onZoom: (direction: "in" | "out") => void;
	zoomLevel: ZoomLevel;
	stats: {
		completed: number;
		inProgress: number;
		blocked: number;
		total: number;
		milestones: number;
	};
}> = ({ onAddTask, onScrollToToday, onZoom, zoomLevel, stats }) => {
	return (
		<header className="flex-shrink-0 light-glass border-b border-gray-300 px-4 sm:px-8 py-6 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
					<div className="flex-shrink-0">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div>
								<h1 className="responsive-text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
									Timeline Pro
								</h1>
								<p className="text-gray-700 responsive-text-sm mt-1 font-medium">
									Enterprise Project Management Platform
								</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row items-center gap-4">
						<div className="hidden md:flex items-center gap-2 ml-auto">
							<div className="inline-flex blue-glass rounded-xl p-1.5 border border-blue-300">
								<div className="flex items-center justify-center gap-1.5 px-3 py-1.5 responsive-text-xs font-medium text-blue-800">
									<span className="hidden sm:inline">Last updated:</span>
									<span className="font-semibold">
										{new Date().toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</span>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							<button
								onClick={onAddTask}
								className="px-5 py-2.5 primary-gradient text-white rounded-xl font-semibold hover:shadow-lg transition-all shadow-md flex items-center gap-2 responsive-text-sm"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
								<span className="hidden sm:inline">Add New Task</span>
								<span className="sm:hidden">Add Task</span>
							</button>

							<button
								onClick={onScrollToToday}
								className="px-4 py-2.5 neumorphic-button border border-gray-300 rounded-xl text-gray-800 font-medium responsive-text-sm"
							>
								Today
							</button>

							<div className="flex items-center gap-1 neumorphic rounded-xl p-1 border border-gray-300">
								<button
									onClick={() => onZoom("out")}
									className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-700"
									title="Zoom Out"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
										/>
									</svg>
								</button>
								<span className="px-4 py-2 responsive-text-sm font-semibold text-gray-900 min-w-[80px] text-center">
									{zoomLevel.name}
								</span>
								<button
									onClick={() => onZoom("in")}
									className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-700"
									title="Zoom In"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

const Footer = () => (
	<footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8 px-4 sm:px-8">
		<div className="max-w-7xl mx-auto">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				<div>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
							<svg
								className="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-bold">Timeline Pro</h3>
					</div>
					<p className="text-gray-400 mb-4 text-sm">
						Enterprise-grade project management platform with advanced
						scheduling capabilities.
					</p>
					<div className="flex space-x-4">
						<a
							href="#"
							className="text-gray-400 hover:text-white transition-colors"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
							</svg>
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-white transition-colors"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-white transition-colors"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
							</svg>
						</a>
					</div>
				</div>

				<div>
					<h4 className="text-lg font-semibold mb-4">Solutions</h4>
					<ul className="space-y-2 text-gray-400 text-sm">
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Enterprise
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Teams
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Startups
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Nonprofit
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Educational
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="text-lg font-semibold mb-4">Resources</h4>
					<ul className="space-y-2 text-gray-400 text-sm">
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Documentation
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								API Reference
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Tutorials
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Blog
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Community
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="text-lg font-semibold mb-4">Company</h4>
					<ul className="space-y-2 text-gray-400 text-sm">
						<li>
							<a href="#" className="hover:text-white transition-colors">
								About Us
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Careers
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Privacy Policy
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Terms of Service
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-white transition-colors">
								Contact
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
				<p className="text-gray-400 text-sm mb-4 md:mb-0">
					2025 Timeline Pro. All in one.
				</p>
				<div className="flex items-center gap-4">
					<span className="text-gray-400 text-sm">v3.5.2</span>
					<span className="text-gray-600">•</span>
					<span className="text-gray-400 text-sm">Enterprise Edition</span>
					<a
						href="#"
						className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
					>
						Upgrade Plan
					</a>
				</div>
			</div>
		</div>
	</footer>
);

const ZOOM_LEVELS: ZoomLevel[] = [
	{ name: "Day", pixelsPerDay: 60, timeHeaderFormat: "day" },
	{ name: "Week", pixelsPerDay: 25, timeHeaderFormat: "week" },
	{ name: "Month", pixelsPerDay: 8, timeHeaderFormat: "month" },
];

const TimelineScheduler: React.FC = () => {
	const [tasks, setTasks] = useState<AppTask[]>([]);
	const [selectedTask, setSelectedTask] = useState<AppTask | null>(null);
	const [zoomIndex, setZoomIndex] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
	const [showStatsPanel, setShowStatsPanel] = useState(true);
	const ganttRef = useRef<HTMLDivElement>(null);

	const zoomLevel = ZOOM_LEVELS[zoomIndex];

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 1500));
				setTasks(MOCK_TASKS.map(convertToAppTask));
			} catch (error) {
				console.error("Failed to fetch tasks:", error);
				setTasks(MOCK_TASKS.map(convertToAppTask));
			} finally {
				setIsLoading(false);
			}
		};

		fetchTasks();
	}, []);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setIsPanelCollapsed(true);
				setShowStatsPanel(false);
			} else if (window.innerWidth < 1280) {
				setIsPanelCollapsed(true);
				setShowStatsPanel(true);
			} else if (window.innerWidth > 1400) {
				setIsPanelCollapsed(false);
				setShowStatsPanel(true);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const timelineBounds = useMemo(() => {
		if (tasks.length === 0) {
			const today = new Date();
			return {
				start: addDays(today, -30),
				end: addDays(today, 90),
			};
		}

		const dates = tasks.flatMap((t) => [t.startDate, t.endDate]);
		const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
		const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

		return {
			start: addDays(minDate, -21),
			end: addDays(maxDate, 21),
		};
	}, [tasks]);

	const handleZoom = useCallback(
		(direction: "in" | "out") => {
			const container = ganttRef.current?.querySelector(
				".overflow-auto"
			) as HTMLElement;
			if (!container) return;

			const scrollLeft = container.scrollLeft;
			const clientWidth = container.clientWidth;
			const scrollCenter = scrollLeft + clientWidth / 2;
			const oldPixelsPerDay = zoomLevel.pixelsPerDay;

			const newIndex =
				direction === "in"
					? Math.max(0, zoomIndex - 1)
					: Math.min(ZOOM_LEVELS.length - 1, zoomIndex + 1);

			if (newIndex !== zoomIndex) {
				setZoomIndex(newIndex);
				requestAnimationFrame(() => {
					const newPixelsPerDay = ZOOM_LEVELS[newIndex].pixelsPerDay;
					const scaleFactor = newPixelsPerDay / oldPixelsPerDay;
					const newScrollCenter = scrollCenter * scaleFactor;
					container.scrollLeft = newScrollCenter - clientWidth / 2;
				});
			}
		},
		[zoomIndex, zoomLevel]
	);

	const scrollToToday = useCallback(() => {
		const container = ganttRef.current?.querySelector(
			".overflow-auto"
		) as HTMLElement;
		if (!container) return;

		const today = new Date();
		const offset =
			daysBetween(timelineBounds.start, today) * zoomLevel.pixelsPerDay;
		container.scrollTo({
			left: Math.max(0, offset - container.clientWidth / 2),
			behavior: "smooth",
		});
	}, [timelineBounds.start, zoomLevel]);

	const handleInitiateAddTask = () => {
		const today = new Date();
		const startDate = new Date(
			Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
		);
		const endDate = addDays(startDate, 7);

		const newTaskTemplate: AppTask = {
			id: crypto.randomUUID(),
			name: "",
			description: "",
			assignee: "",
			startDate,
			endDate,
			color: `#${Math.floor(Math.random() * 16777215)
				.toString(16)
				.padEnd(6, "0")}`,
			priority: "medium",
			status: "not-started",
			progress: 0,
			isNew: true,
		};

		setSelectedTask(newTaskTemplate);

		if (window.innerWidth < 768) {
			setIsPanelCollapsed(false);
		}
	};

	const handleSaveTask = (taskToSave: AppTask) => {
		const { isNew, ...restOfTask } = taskToSave;
		if (isNew) {
			setTasks((prev) => [...prev, restOfTask]);
		} else {
			setTasks((prev) =>
				prev.map((t) => (t.id === restOfTask.id ? restOfTask : t))
			);
		}
		setSelectedTask(restOfTask);
	};

	const handleReorderTasks = (sourceTaskId: string, targetIndex: number) => {
		setTasks((currentTasks) => {
			const sourceIndex = currentTasks.findIndex((t) => t.id === sourceTaskId);
			if (sourceIndex === -1 || sourceIndex === targetIndex) {
				return currentTasks;
			}

			const reorderedTasks = [...currentTasks];
			const [removed] = reorderedTasks.splice(sourceIndex, 1);
			const adjustedTargetIndex =
				sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
			reorderedTasks.splice(adjustedTargetIndex, 0, removed);

			return reorderedTasks;
		});
	};

	const getTaskStats = () => {
		const completed = tasks.filter((t) => t.status === "completed").length;
		const inProgress = tasks.filter((t) => t.status === "in-progress").length;
		const blocked = tasks.filter((t) => t.status === "blocked").length;
		const total = tasks.length;
		const milestones = tasks.filter((t) => t.milestoneEmoji).length;
		return { completed, inProgress, blocked, total, milestones };
	};

	const stats = getTaskStats();

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<>
			<style>{scrollbarStyles}</style>
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex flex-col custom-scrollbar">
				<Header
					onAddTask={handleInitiateAddTask}
					onScrollToToday={scrollToToday}
					onZoom={handleZoom}
					zoomLevel={zoomLevel}
					stats={stats}
				/>

				{showStatsPanel && (
					<div className="px-4 sm:px-8 pt-6">
						<ProjectStats stats={stats} />
					</div>
				)}

				<div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-8 p-4 sm:p-8 min-h-0">
					<div
						className={`lg:flex-shrink-0 transition-all duration-300 ${
							isPanelCollapsed ? "lg:w-16 xl:w-20" : "lg:w-80 xl:w-96"
						}`}
					>
						<TaskDetailsForm
							task={selectedTask}
							onSaveTask={handleSaveTask}
							onClearSelection={() => setSelectedTask(null)}
							isCollapsed={isPanelCollapsed}
							onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
						/>
					</div>

					<div ref={ganttRef} className="flex-1 min-w-0">
						<GanttChart
							tasks={tasks}
							selectedTask={selectedTask}
							onTaskSelect={setSelectedTask}
							onTaskUpdate={handleSaveTask}
							onTasksReorder={handleReorderTasks}
							zoomLevel={zoomLevel}
							startDate={timelineBounds.start}
							endDate={timelineBounds.end}
						/>
					</div>
				</div>

				<div className="mt-8">
					<Footer />
				</div>
			</div>
		</>
	);
};

export default TimelineScheduler;
