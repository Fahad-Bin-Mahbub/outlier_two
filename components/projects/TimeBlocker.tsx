"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

import {
	FaPlus,
	FaChartBar,
	FaClock,
	FaFire,
	FaExclamationTriangle,
	FaCheck,
	FaTimes,
	FaCog,
	FaTrash,
	FaEdit,
	FaSave,
	FaBars,
	FaChevronLeft,
	FaChevronRight,
	FaCalendarAlt,
	FaUsers,
	FaFileExport,
	FaUserCircle,
	FaBell,
	FaLink,
	FaTasks,
	FaLock,
	FaTachometerAlt,
	FaClipboardList,
	FaRegStar,
	FaStar,
	FaTags,
	FaComments,
	FaBuilding,
	FaSearch,
	FaEllipsisH,
	FaUserPlus,
	FaRegClock,
	FaSyncAlt,
	FaHistory,
	FaCloudUploadAlt,
	FaSlack,
	FaHeadset,
	FaDownload,
	FaBriefcase,
	FaFilter,
	FaQuestion,
	FaMoon,
	FaSun,
	FaAngleDoubleUp,
	FaAngleDoubleDown,
	FaCoffee,
	FaCode,
	FaLaptop,
	FaShieldAlt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Priority = "low" | "medium" | "high" | "urgent";
type Category =
	| "work"
	| "personal"
	| "meeting"
	| "focus"
	| "planning"
	| "other";
type View = "day" | "week" | "month";
type TeamMemberRole = "admin" | "manager" | "member" | "viewer";
type ThemeMode = "light" | "dark";

interface TeamMember {
	id: string;
	name: string;
	avatar: string;
	role: TeamMemberRole;
	department: string;
	online: boolean;
}

interface TimeBlock {
	id: string;
	title: string;
	description: string;
	startTime: Date;
	endTime: Date;
	priority: Priority;
	category: Category;
	completed: boolean;
	color: string;
	assignedTo?: string[];
	teamVisible: boolean;
	recurringType?: "daily" | "weekly" | "monthly" | "none";
	location?: string;
	links?: string[];
	attachments?: string[];
	tags?: string[];
	notes?: string;
}

interface TimeDebt {
	minutes: number;
	date: string;
	category?: Category;
}

interface DailyStreak {
	count: number;
	lastCompletedDate: string;
}

interface Project {
	id: string;
	name: string;
	color: string;
	progress: number;
	deadline: Date;
}

interface Department {
	id: string;
	name: string;
	color: string;
}

interface Notification {
	id: string;
	type: "reminder" | "alert" | "message" | "update";
	message: string;
	time: Date;
	read: boolean;
}

interface Integration {
	id: string;
	name: string;
	icon: React.ReactNode;
	connected: boolean;
	lastSync?: Date;
}

const TimeBlockingPlannerEnterprise: React.FC = () => {
	const [blocks, setBlocks] = useState<TimeBlock[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [showAddModal, setShowAddModal] = useState<boolean>(false);
	const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
	const [showTeam, setShowTeam] = useState<boolean>(false);
	const [showSettings, setShowSettings] = useState<boolean>(false);
	const [showExport, setShowExport] = useState<boolean>(false);
	const [showProjects, setShowProjects] = useState<boolean>(false);
	const [showUserProfile, setShowUserProfile] = useState<boolean>(false);
	const [showNotifications, setShowNotifications] = useState<boolean>(false);
	const [showIntegrations, setShowIntegrations] = useState<boolean>(false);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [showViewModal, setShowViewModal] = useState<boolean>(false);
	const [viewingBlock, setViewingBlock] = useState<TimeBlock | null>(null);
	const [actionPerformed, setActionPerformed] = useState<boolean>(false);
	const initialStartTimeRef = useRef<Date | null>(null);
	const initialEndTimeRef = useRef<Date | null>(null);
	const justDraggedOrResizedRef = useRef(false);
	const [newBlock, setNewBlock] = useState<Partial<TimeBlock>>({
		title: "",
		description: "",
		startTime: new Date(new Date().setHours(9, 0, 0, 0)),
		endTime: new Date(new Date().setHours(10, 0, 0, 0)),
		priority: "medium",
		category: "work",
		completed: false,
		color: "#6366F1",
		teamVisible: false,
		recurringType: "none",
		tags: [],
	});
	const [timeDebt, setTimeDebt] = useState<TimeDebt[]>([]);
	const [streak, setStreak] = useState<DailyStreak>({
		count: 8,
		lastCompletedDate: new Date().toISOString().split("T")[0],
	});
	const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
	const [resizingBlock, setResizingBlock] = useState<string | null>(null);
	const [resizeStartY, setResizeStartY] = useState<number>(0);
	const [activeView, setActiveView] = useState<View>("day");
	const [editingBlock, setEditingBlock] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [timeRangeView, setTimeRangeView] = useState<"standard" | "all-day">(
		"standard"
	);
	const [themeMode, setThemeMode] = useState<ThemeMode>("light");
	const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
		{
			id: "1",
			name: "John Smith",
			avatar: "https://randomuser.me/api/portraits/men/1.jpg",
			role: "admin",
			department: "Executive",
			online: true,
		},
		{
			id: "2",
			name: "Emily Chen",
			avatar: "https://randomuser.me/api/portraits/women/2.jpg",
			role: "manager",
			department: "Marketing",
			online: true,
		},
		{
			id: "3",
			name: "Michael Johnson",
			avatar: "https://randomuser.me/api/portraits/men/3.jpg",
			role: "member",
			department: "Engineering",
			online: false,
		},
		{
			id: "4",
			name: "Jessica Williams",
			avatar: "https://randomuser.me/api/portraits/women/4.jpg",
			role: "member",
			department: "Design",
			online: true,
		},
		{
			id: "5",
			name: "Robert Davis",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
			role: "viewer",
			department: "Sales",
			online: false,
		},
	]);
	const [projects, setProjects] = useState<Project[]>([
		{
			id: "p1",
			name: "Website Redesign",
			color: "#4F46E5",
			progress: 68,
			deadline: new Date(new Date().setDate(new Date().getDate() + 14)),
		},
		{
			id: "p2",
			name: "Q3 Marketing Campaign",
			color: "#0EA5E9",
			progress: 42,
			deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
		},
		{
			id: "p3",
			name: "Product Launch",
			color: "#10B981",
			progress: 23,
			deadline: new Date(new Date().setDate(new Date().getDate() + 45)),
		},
	]);
	const [departments, setDepartments] = useState<Department[]>([
		{ id: "d1", name: "Executive", color: "#818CF8" },
		{ id: "d2", name: "Marketing", color: "#34D399" },
		{ id: "d3", name: "Engineering", color: "#F472B6" },
		{ id: "d4", name: "Design", color: "#FBBF24" },
		{ id: "d5", name: "Sales", color: "#60A5FA" },
	]);
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: "n1",
			type: "reminder",
			message: "Team meeting in 30 minutes",
			time: new Date(new Date().setHours(new Date().getHours() - 1)),
			read: false,
		},
		{
			id: "n2",
			type: "update",
			message: "Emily Chen completed 'Finalize budget report'",
			time: new Date(new Date().setHours(new Date().getHours() - 3)),
			read: false,
		},
		{
			id: "n3",
			type: "message",
			message: "Michael Johnson commented on 'Product roadmap'",
			time: new Date(new Date().setHours(new Date().getHours() - 5)),
			read: true,
		},
	]);
	const [integrations, setIntegrations] = useState<Integration[]>([
		{
			id: "i1",
			name: "Google Calendar",
			icon: <FaCalendarAlt />,
			connected: true,
			lastSync: new Date(),
		},
		{
			id: "i2",
			name: "Slack",
			icon: <FaSlack />,
			connected: true,
			lastSync: new Date(),
		},
		{ id: "i3", name: "Microsoft Teams", icon: <FaUsers />, connected: false },
		{ id: "i4", name: "Jira", icon: <FaTasks />, connected: false },
		{ id: "i5", name: "Asana", icon: <FaClipboardList />, connected: false },
	]);
	const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(
		null
	);
	const [newTag, setNewTag] = useState<string>("");
	const [filterOptions, setFilterOptions] = useState({
		categories: [] as Category[],
		priorities: [] as Priority[],
		tags: [] as string[],
		completed: null as boolean | null,
	});
	const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);

	const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

	const timeGridRef = useRef<HTMLDivElement>(null);
	const mainContainerRef = useRef<HTMLDivElement>(null);

	const categoryColors = {
		work: {
			bg: "#6366F1",
			gradient: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
			light: "#EEF2FF",
			text: "#FFFFFF",
		},
		personal: {
			bg: "#F43F5E",
			gradient: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
			light: "#FFF1F2",
			text: "#FFFFFF",
		},
		meeting: {
			bg: "#0EA5E9",
			gradient: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
			light: "#F0F9FF",
			text: "#FFFFFF",
		},
		focus: {
			bg: "#10B981",
			gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
			light: "#ECFDF5",
			text: "#FFFFFF",
		},
		planning: {
			bg: "#8B5CF6",
			gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
			light: "#F5F3FF",
			text: "#FFFFFF",
		},
		other: {
			bg: "#6B7280",
			gradient: "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
			light: "#F8FAFC",
			text: "#FFFFFF",
		},
	};

	const priorityColors = {
		low: {
			bg: "#22C55E",
			gradient: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
			light: "#DCFCE7",
			text: "#FFFFFF",
			border: "#16A34A",
		},
		medium: {
			bg: "#3B82F6",
			gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
			light: "#DBEAFE",
			text: "#FFFFFF",
			border: "#2563EB",
		},
		high: {
			bg: "#F97316",
			gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
			light: "#FFF7ED",
			text: "#FFFFFF",
			border: "#EA580C",
		},
		urgent: {
			bg: "#EF4444",
			gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
			light: "#FEE2E2",
			text: "#FFFFFF",
			border: "#DC2626",
		},
	};

	const totalTimeDebt = timeDebt.reduce(
		(total, debt) => total + debt.minutes,
		0
	);

	const formatTimeDebt = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const checkCollisions = (
		block: Partial<TimeBlock>,
		excludeId?: string
	): boolean => {
		if (!block.startTime || !block.endTime) return false;

		return blocks.some((existingBlock) => {
			if (excludeId && existingBlock.id === excludeId) return false;

			const sameDay =
				new Date(existingBlock.startTime).toDateString() ===
				new Date(block.startTime).toDateString();

			if (!sameDay) return false;

			return (
				block.startTime < existingBlock.endTime &&
				block.endTime > existingBlock.startTime
			);
		});
	};

	useEffect(() => {
		if (blocks.length === 0) {
			const today = new Date();

			const initialBlocks: TimeBlock[] = [
				{
					id: "1",
					title: "Team Status Meeting",
					description:
						"Weekly team sync to discuss project progress and roadblocks",
					startTime: new Date(new Date().setHours(9, 0, 0, 0)),
					endTime: new Date(new Date().setHours(10, 0, 0, 0)),
					priority: "medium",
					category: "meeting",
					completed: false,
					color: categoryColors.meeting.bg,
					teamVisible: true,
					assignedTo: ["1", "2", "3", "4"],
					location: "Conference Room A",
					tags: ["weekly", "team"],
					recurringType: "weekly",
				},
				{
					id: "2",
					title: "Marketing Strategy",
					description: "Define Q3 marketing plan and campaign timeline",
					startTime: new Date(new Date().setHours(11, 0, 0, 0)),
					endTime: new Date(new Date().setHours(12, 30, 0, 0)),
					priority: "high",
					category: "work",
					completed: false,
					color: categoryColors.work.bg,
					teamVisible: true,
					assignedTo: ["1", "2"],
					tags: ["marketing", "planning"],
				},
				{
					id: "3",
					title: "Deep Work: Bug Fixes",
					description: "Focus time to address critical bugs in release v2.4",
					startTime: new Date(new Date().setHours(14, 0, 0, 0)),
					endTime: new Date(new Date().setHours(16, 0, 0, 0)),
					priority: "urgent",
					category: "focus",
					completed: false,
					color: categoryColors.focus.bg,
					teamVisible: false,
					tags: ["development", "critical"],
				},
				{
					id: "4",
					title: "Design Review",
					description: "Review new dashboard wireframes with design team",
					startTime: new Date(new Date().setHours(16, 30, 0, 0)),
					endTime: new Date(new Date().setHours(17, 30, 0, 0)),
					priority: "medium",
					category: "meeting",
					completed: true,
					color: categoryColors.meeting.bg,
					teamVisible: true,
					assignedTo: ["1", "4"],
					tags: ["design", "feedback"],
				},
				{
					id: "5",
					title: "Late Night Coding",
					description: "Finish implementing new feature before tomorrow's demo",
					startTime: new Date(new Date().setHours(22, 0, 0, 0)),
					endTime: new Date(new Date().setHours(23, 30, 0, 0)),
					priority: "high",
					category: "focus",
					completed: false,
					color: categoryColors.focus.bg,
					teamVisible: false,
					tags: ["coding", "feature"],
				},
				{
					id: "6",
					title: "Early Breakfast Meeting",
					description: "Meet with investors to discuss funding round",
					startTime: new Date(new Date().setHours(6, 30, 0, 0)),
					endTime: new Date(new Date().setHours(7, 45, 0, 0)),
					priority: "urgent",
					category: "meeting",
					completed: false,
					color: categoryColors.meeting.bg,
					teamVisible: true,
					assignedTo: ["1"],
					tags: ["investors", "important"],
				},
			];

			setBlocks(initialBlocks);

			setTimeDebt([
				{
					minutes: 45,
					date: new Date().toISOString().split("T")[0],
					category: "work",
				},
				{
					minutes: 30,
					date: new Date(new Date().setDate(new Date().getDate() - 1))
						.toISOString()
						.split("T")[0],
					category: "meeting",
				},
			]);
		}
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (mainContainerRef.current) {
				setShowScrollToTop(mainContainerRef.current.scrollTop > 300);
			}
		};

		const currentRef = mainContainerRef.current;
		if (currentRef) {
			currentRef.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (currentRef) {
				currentRef.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	useEffect(() => {
		document.body.className = themeMode === "dark" ? "dark" : "";
	}, [themeMode]);

	const generateTimeSlots = () => {
		const slots = [];

		const startHour = 0;
		const endHour = 24;

		for (let hour = startHour; hour < endHour; hour++) {
			const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
			const amPm = hour >= 12 ? "PM" : "AM";
			slots.push({
				time: `${displayHour}:00 ${amPm}`,
				hour,
				minute: 0,
			});
		}
		return slots;
	};

	const addTimeBlock = () => {
		if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (newBlock.startTime >= newBlock.endTime) {
			toast.error("End time must be after start time");
			return;
		}

		const hasCollision = checkCollisions(newBlock);

		if (hasCollision) {
			toast.warning("This block overlaps with existing blocks", {
				autoClose: 3000,
			});
		}

		const block: TimeBlock = {
			id: Date.now().toString(),
			title: newBlock.title || "",
			description: newBlock.description || "",
			startTime: newBlock.startTime as Date,
			endTime: newBlock.endTime as Date,
			priority: newBlock.priority as Priority,
			category: newBlock.category as Category,
			completed: false,
			color: categoryColors[newBlock.category as Category].bg,
			teamVisible: newBlock.teamVisible || false,
			assignedTo: newBlock.assignedTo || [],
			recurringType: newBlock.recurringType || "none",
			location: newBlock.location,
			tags: newBlock.tags || [],
			links: newBlock.links,
			attachments: newBlock.attachments,
			notes: newBlock.notes,
		};

		setBlocks((prev) => [...prev, block]);
		setShowAddModal(false);
		setNewBlock({
			title: "",
			description: "",
			startTime: new Date(new Date().setHours(9, 0, 0, 0)),
			endTime: new Date(new Date().setHours(10, 0, 0, 0)),
			priority: "medium",
			category: "work",
			completed: false,
			teamVisible: false,
			recurringType: "none",
			tags: [],
		});

		toast.success("Time block added successfully");
	};

	const saveEditedBlock = () => {
		if (!editingBlock) return;

		if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (newBlock.startTime >= newBlock.endTime) {
			toast.error("End time must be after start time");
			return;
		}

		const hasCollision = checkCollisions(newBlock, editingBlock);

		if (hasCollision) {
			toast.warning("This block overlaps with existing blocks", {
				autoClose: 3000,
			});
		}

		setBlocks((prev) =>
			prev.map((block) =>
				block.id === editingBlock
					? {
							...block,
							title: newBlock.title || block.title,
							description: newBlock.description || block.description,
							startTime: newBlock.startTime as Date,
							endTime: newBlock.endTime as Date,
							priority: newBlock.priority as Priority,
							category: newBlock.category as Category,
							color: categoryColors[newBlock.category as Category].bg,
							teamVisible: newBlock.teamVisible ?? block.teamVisible,
							assignedTo: newBlock.assignedTo || block.assignedTo,
							recurringType: newBlock.recurringType || block.recurringType,
							location: newBlock.location || block.location,
							tags: newBlock.tags || block.tags,
							links: newBlock.links || block.links,
							attachments: newBlock.attachments || block.attachments,
							notes: newBlock.notes || block.notes,
					  }
					: block
			)
		);

		setEditingBlock(null);
		setShowAddModal(false);

		toast.success("Time block updated successfully");
	};

	const deleteTimeBlock = (id: string) => {
		setBlocks((prev) => prev.filter((block) => block.id !== id));
		toast.info("Time block deleted");
	};

	const toggleBlockCompletion = (id: string) => {
		setBlocks((prev) =>
			prev.map((block) =>
				block.id === id ? { ...block, completed: !block.completed } : block
			)
		);

		const updatedBlock = blocks.find((block) => block.id === id);
		if (updatedBlock && !updatedBlock.completed) {
			const today = new Date().toISOString().split("T")[0];
			if (streak.lastCompletedDate !== today) {
				setStreak({
					count: streak.count + 1,
					lastCompletedDate: today,
				});

				if ((streak.count + 1) % 5 === 0) {
					toast.success(
						`🔥 Amazing! You've reached a ${streak.count + 1} day streak!`,
						{
							icon: "🎉",
							autoClose: 5000,
						}
					);
				}
			}
		}
	};

	const handleDragStart = (
		id: string,
		e: React.MouseEvent | React.TouchEvent
	) => {
		e.preventDefault();
		setDraggedBlock(id);
		const block = blocks.find((b) => b.id === id);
		if (block) {
			initialStartTimeRef.current = new Date(block.startTime);
			initialEndTimeRef.current = new Date(block.endTime);
		}
		setActionPerformed(true);

		if ("touches" in e) {
			const touch = e.touches[0];
			setResizeStartY(touch.clientY);
		}
	};

	const handleResizeStart = (
		id: string,
		e: React.MouseEvent | React.TouchEvent
	) => {
		e.preventDefault();
		e.stopPropagation();
		setResizingBlock(id);
		const block = blocks.find((b) => b.id === id);
		if (block) {
			initialStartTimeRef.current = new Date(block.startTime);
			initialEndTimeRef.current = new Date(block.endTime);
		}
		setActionPerformed(true);

		if ("touches" in e) {
			const touch = e.touches[0];
			setResizeStartY(touch.clientY);
		} else {
			setResizeStartY(e.clientY);
		}
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!timeGridRef.current) return;

			const gridRect = timeGridRef.current.getBoundingClientRect();
			const totalHours = 24;
			const hourHeight = gridRect.height / totalHours;
			const startHour = 0;

			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

			if (draggedBlock) {
				const mouseY = clientY - gridRect.top;
				const hour = Math.floor(mouseY / hourHeight) + startHour;
				const minute =
					Math.round((((mouseY % hourHeight) / hourHeight) * 60) / 15) * 15;

				setBlocks((prev) => {
					return prev.map((block) => {
						if (block.id === draggedBlock) {
							const duration =
								(block.endTime.getTime() - block.startTime.getTime()) / 60000;

							const newStartTime = new Date(selectedDate);
							newStartTime.setHours(hour, minute, 0, 0);

							const newEndTime = new Date(newStartTime);
							newEndTime.setMinutes(newEndTime.getMinutes() + duration);

							return {
								...block,
								startTime: newStartTime,
								endTime: newEndTime,
							};
						}
						return block;
					});
				});
			}

			if (resizingBlock) {
				const mouseY = clientY;
				const deltaY = mouseY - resizeStartY;
				const deltaMinutes = Math.round(((deltaY / hourHeight) * 60) / 15) * 15;

				setResizeStartY(mouseY);

				setBlocks((prev) => {
					return prev.map((block) => {
						if (block.id === resizingBlock) {
							const newEndTime = new Date(block.endTime);
							newEndTime.setMinutes(newEndTime.getMinutes() + deltaMinutes);

							if (newEndTime <= block.startTime) {
								newEndTime.setMinutes(block.startTime.getMinutes() + 15);
							}

							return {
								...block,
								endTime: newEndTime,
							};
						}
						return block;
					});
				});
			}
		},
		[draggedBlock, resizingBlock, resizeStartY, selectedDate, timeRangeView]
	);

	const handleMouseUp = useCallback(() => {
		if (draggedBlock || resizingBlock) {
			const blockId = draggedBlock || resizingBlock;
			const block = blocks.find((b) => b.id === blockId);
			if (block && initialStartTimeRef.current && initialEndTimeRef.current) {
				const hasChanged =
					block.startTime.getTime() !== initialStartTimeRef.current.getTime() ||
					block.endTime.getTime() !== initialEndTimeRef.current.getTime();
				if (hasChanged) {
					justDraggedOrResizedRef.current = true;
				}
			}
			setBlocks((prev) => {
				const updatedBlocks = [...prev];
				const blockIndex = updatedBlocks.findIndex(
					(b) => b.id === (draggedBlock || resizingBlock)
				);

				if (blockIndex !== -1) {
					const block = updatedBlocks[blockIndex];
					const hasCollision = checkCollisions(block, block.id);

					if (hasCollision) {
						toast.warning("This block now overlaps with other blocks", {
							autoClose: 3000,
						});
					}
				}

				return updatedBlocks;
			});
		}

		setDraggedBlock(null);
		setResizingBlock(null);
		setActionPerformed(false);
		initialStartTimeRef.current = null;
		initialEndTimeRef.current = null;
	}, [draggedBlock, resizingBlock, blocks]);

	const handleTouchEnd = useCallback(() => {
		handleMouseUp();
	}, [handleMouseUp]);

	useEffect(() => {
		const calculateTimeDebt = () => {
			const today = new Date().toISOString().split("T")[0];
			const overrunMinutes = blocks
				.filter(
					(block) =>
						!block.completed &&
						new Date(block.endTime) < new Date() &&
						new Date(block.startTime).toISOString().split("T")[0] === today
				)
				.reduce((total, block) => {
					const duration =
						(block.endTime.getTime() - block.startTime.getTime()) / 60000;
					return total + duration;
				}, 0);

			if (overrunMinutes > 0) {
				setTimeDebt((prev) => {
					const existingDebt = prev.find((debt) => debt.date === today);
					if (existingDebt) {
						return prev.map((debt) =>
							debt.date === today ? { ...debt, minutes: overrunMinutes } : debt
						);
					} else {
						return [...prev, { minutes: overrunMinutes, date: today }];
					}
				});
			}
		};

		calculateTimeDebt();
	}, [blocks]);

	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchmove", handleMouseMove, { passive: false });
		document.addEventListener("touchend", handleTouchEnd);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleMouseMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [handleMouseMove, handleMouseUp, handleTouchEnd]);

	const editBlock = (id: string) => {
		const blockToEdit = blocks.find((block) => block.id === id);
		if (!blockToEdit) return;

		setNewBlock({
			title: blockToEdit.title,
			description: blockToEdit.description,
			startTime: blockToEdit.startTime,
			endTime: blockToEdit.endTime,
			priority: blockToEdit.priority,
			category: blockToEdit.category,
			completed: blockToEdit.completed,
			color: blockToEdit.color,
			teamVisible: blockToEdit.teamVisible,
			assignedTo: blockToEdit.assignedTo,
			recurringType: blockToEdit.recurringType,
			location: blockToEdit.location,
			tags: blockToEdit.tags,
			links: blockToEdit.links,
			attachments: blockToEdit.attachments,
			notes: blockToEdit.notes,
		});

		setEditingBlock(id);
		setShowAddModal(true);
	};

	const generateAnalyticsData = () => {
		const timeByPriority = {
			low: 0,
			medium: 0,
			high: 0,
			urgent: 0,
		};

		const timeByCategory = {
			work: 0,
			personal: 0,
			meeting: 0,
			focus: 0,
			planning: 0,
			other: 0,
		};

		blocks.forEach((block) => {
			const duration =
				(block.endTime.getTime() - block.startTime.getTime()) / 60000;
			timeByPriority[block.priority] += duration;
			timeByCategory[block.category] += duration;
		});

		const completedBlocks = blocks.filter((block) => block.completed).length;
		const completionRate =
			blocks.length > 0 ? (completedBlocks / blocks.length) * 100 : 0;

		const focusByHour = Array(24).fill(0);

		blocks.forEach((block) => {
			const startHour = block.startTime.getHours();
			const endHour = block.endTime.getHours();

			for (let hour = startHour; hour <= endHour; hour++) {
				if (hour < 24) {
					focusByHour[hour] += 60;
				}
			}
		});

		const weeklyProductivity = [65, 75, 90, 60, 80, 85, 70];

		const efficiencyMetrics = {
			plannedVsActual: 82,
			timeBlockUtilization: 76,
			focusScore: 88,
			meetingEfficiency: 64,
		};

		return {
			timeByPriority,
			timeByCategory,
			completionRate,
			focusByHour,
			weeklyProductivity,
			efficiencyMetrics,
		};
	};

	const calculateBlockStyle = (block: TimeBlock) => {
		if (!timeGridRef.current) return {};

		const startHour =
			block.startTime.getHours() + block.startTime.getMinutes() / 60;
		const endHour = block.endTime.getHours() + block.endTime.getMinutes() / 60;

		const totalHours = 24;
		const startOffset = 0;

		const gridHeight = timeGridRef.current.clientHeight;
		const hourHeight = gridHeight / totalHours;

		const top = (startHour - startOffset) * hourHeight;
		const height = (endHour - startHour) * hourHeight;

		return {
			top: `${top}px`,
			height: `${height}px`,
		};
	};

	const navigateNext = () => {
		const next = new Date(selectedDate);
		if (activeView === "day") {
			next.setDate(next.getDate() + 1);
		} else if (activeView === "week") {
			next.setDate(next.getDate() + 7);
		} else if (activeView === "month") {
			next.setMonth(next.getMonth() + 1);
		}
		setSelectedDate(next);
	};

	const navigatePrev = () => {
		const prev = new Date(selectedDate);
		if (activeView === "day") {
			prev.setDate(prev.getDate() - 1);
		} else if (activeView === "week") {
			prev.setDate(prev.getDate() - 7);
		} else if (activeView === "month") {
			prev.setMonth(prev.getMonth() - 1);
		}
		setSelectedDate(prev);
	};

	const goToToday = () => {
		setSelectedDate(new Date());
	};

	const scrollToCurrentTime = () => {
		if (timeGridRef.current) {
			const now = new Date();
			const currentHour = now.getHours() + now.getMinutes() / 60;
			const startOffset = 0;
			const totalHours = 24;

			const gridHeight = timeGridRef.current.clientHeight;
			const hourHeight = gridHeight / totalHours;

			const scrollTop = (currentHour - startOffset) * hourHeight - 100;

			timeGridRef.current.parentElement?.scrollTo({
				top: Math.max(0, scrollTop),
				behavior: "smooth",
			});
		}
	};

	const scrollToTop = () => {
		mainContainerRef.current?.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const toggleThemeMode = () => {
		setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
	};

	const markNotificationRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification
			)
		);
	};

	const markAllNotificationsAsRead = () => {
		setNotifications((prev) =>
			prev.map((notification) => ({ ...notification, read: true }))
		);
		toast.success("All notifications marked as read");
	};

	const toggleIntegration = (id: string) => {
		setIntegrations((prev) =>
			prev.map((integration) =>
				integration.id === id
					? {
							...integration,
							connected: !integration.connected,
							lastSync: integration.connected ? undefined : new Date(),
					  }
					: integration
			)
		);

		const integration = integrations.find((i) => i.id === id);
		if (integration) {
			if (integration.connected) {
				toast.info(`Disconnected from ${integration.name}`);
			} else {
				toast.success(`Connected to ${integration.name}`);
			}
		}
	};

	const filterBlocks = () => {
		let filtered = blocks.filter(
			(block) =>
				new Date(block.startTime).toDateString() === selectedDate.toDateString()
		);

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(block) =>
					block.title.toLowerCase().includes(query) ||
					block.description.toLowerCase().includes(query) ||
					(block.tags &&
						block.tags.some((tag) => tag.toLowerCase().includes(query)))
			);
		}

		if (filterOptions.categories.length > 0) {
			filtered = filtered.filter((block) =>
				filterOptions.categories.includes(block.category)
			);
		}

		if (filterOptions.priorities.length > 0) {
			filtered = filtered.filter((block) =>
				filterOptions.priorities.includes(block.priority)
			);
		}

		if (filterOptions.tags.length > 0) {
			filtered = filtered.filter(
				(block) =>
					block.tags &&
					filterOptions.tags.some((tag) => block.tags?.includes(tag))
			);
		}

		if (filterOptions.completed !== null) {
			filtered = filtered.filter(
				(block) => block.completed === filterOptions.completed
			);
		}

		return filtered;
	};

	const addTag = () => {
		if (!newTag || newTag.trim() === "") return;

		setNewBlock((prev) => ({
			...prev,
			tags: [...(prev.tags || []), newTag.trim()],
		}));

		setNewTag("");
	};

	const removeTag = (tagToRemove: string) => {
		setNewBlock((prev) => ({
			...prev,
			tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
		}));
	};

	const toggleCategoryFilter = (category: Category) => {
		setFilterOptions((prev) => ({
			...prev,
			categories: prev.categories.includes(category)
				? prev.categories.filter((c) => c !== category)
				: [...prev.categories, category],
		}));
	};

	const togglePriorityFilter = (priority: Priority) => {
		setFilterOptions((prev) => ({
			...prev,
			priorities: prev.priorities.includes(priority)
				? prev.priorities.filter((p) => p !== priority)
				: [...prev.priorities, priority],
		}));
	};

	const toggleCompletionFilter = (status: boolean | null) => {
		setFilterOptions((prev) => ({
			...prev,
			completed: prev.completed === status ? null : status,
		}));
	};

	const addTagFilter = (tag: string) => {
		if (!filterOptions.tags.includes(tag)) {
			setFilterOptions((prev) => ({
				...prev,
				tags: [...prev.tags, tag],
			}));
		}
	};

	const removeTagFilter = (tag: string) => {
		setFilterOptions((prev) => ({
			...prev,
			tags: prev.tags.filter((t) => t !== tag),
		}));
	};

	const resetFilters = () => {
		setFilterOptions({
			categories: [],
			priorities: [],
			tags: [],
			completed: null,
		});
		setSearchQuery("");
		toast.info("All filters reset");
	};

	const showComingSoon = (feature: string) => {
		toast.info(`${feature} feature coming soon!`, {
			position: "bottom-center",
			autoClose: 2000,
		});
	};

	const filteredBlocks = filterBlocks();
	const timeSlots = generateTimeSlots();
	const analytics = generateAnalyticsData();

	const allTags = [...new Set(blocks.flatMap((block) => block.tags || []))];

	const isFilterActive =
		searchQuery.trim() !== "" ||
		filterOptions.categories.length > 0 ||
		filterOptions.priorities.length > 0 ||
		filterOptions.tags.length > 0 ||
		filterOptions.completed !== null;

	const getThemeClasses = (lightClass: string, darkClass: string) => {
		return themeMode === "dark" ? darkClass : lightClass;
	};

	return (
		<div
			ref={mainContainerRef}
			className={`font-sans min-h-screen transition-colors duration-300 ${getThemeClasses(
				"bg-slate-50 text-slate-900",
				"bg-slate-900 text-white"
			)}`}
		>
			<header
				className={`${getThemeClasses(
					"bg-white shadow-lg",
					"bg-slate-800 shadow-slate-700/30"
				)} sticky top-0 z-40 transition-colors duration-300`}
			>
				<div className="container mx-auto p-4">
					<div className="flex justify-between items-center">
						<div className="flex items-center">
							<div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg mr-3 shadow-md">
								<FaClock className="text-2xl" />
							</div>
							<h1
								className={`text-xl md:text-2xl font-bold ${getThemeClasses(
									"text-slate-800",
									"text-white"
								)}`}
							>
								TimeBlock Pro{" "}
								<span className="text-indigo-500 font-extrabold">
									Enterprise
								</span>
							</h1>
						</div>

						<div className="hidden md:flex items-center space-x-2">
							<button
								onClick={toggleThemeMode}
								className={`flex items-center justify-center w-10 h-10 rounded-full ${getThemeClasses(
									"hover:bg-slate-100",
									"hover:bg-slate-700"
								)} transition-colors`}
								aria-label="Toggle theme"
							>
								{themeMode === "light" ? (
									<FaMoon className="text-slate-600" />
								) : (
									<FaSun className="text-yellow-400" />
								)}
							</button>

							<div className="relative">
								<button
									onClick={() => setShowNotifications(!showNotifications)}
									className={`flex items-center justify-center w-10 h-10 rounded-full ${getThemeClasses(
										"hover:bg-slate-100",
										"hover:bg-slate-700"
									)} transition-colors relative`}
									aria-label="Notifications"
								>
									<FaBell
										className={getThemeClasses(
											"text-slate-600",
											"text-slate-300"
										)}
									/>
									{unreadNotificationsCount > 0 && (
										<span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
											{unreadNotificationsCount}
										</span>
									)}
								</button>

								{showNotifications && (
									<div
										className={`absolute top-12 right-0 w-80 ${getThemeClasses(
											"bg-white",
											"bg-slate-800"
										)} rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300`}
									>
										<div
											className={`flex justify-between items-center p-3 ${getThemeClasses(
												"border-b border-slate-200",
												"border-b border-slate-700"
											)}`}
										>
											<h3 className="font-semibold">Notifications</h3>
											<button
												className={`text-xs ${getThemeClasses(
													"text-indigo-600 hover:text-indigo-800",
													"text-indigo-400 hover:text-indigo-300"
												)}`}
												onClick={markAllNotificationsAsRead}
											>
												Mark all as read
											</button>
										</div>
										<div className="max-h-96 overflow-y-auto">
											{notifications.length === 0 ? (
												<div
													className={`p-4 text-center ${getThemeClasses(
														"text-slate-500",
														"text-slate-400"
													)}`}
												>
													No notifications
												</div>
											) : (
												notifications.map((notification) => (
													<div
														key={notification.id}
														className={`p-3 ${getThemeClasses(
															`border-b border-slate-200 hover:bg-slate-50 cursor-pointer ${
																notification.read
																	? "opacity-70"
																	: "bg-indigo-50/30"
															}`,
															`border-b border-slate-700 hover:bg-slate-700 cursor-pointer ${
																notification.read
																	? "opacity-70"
																	: "bg-indigo-900/30"
															}`
														)}`}
														onClick={() =>
															markNotificationRead(notification.id)
														}
													>
														<div className="flex items-start">
															<div
																className={`
																	mt-1 mr-3 rounded-full p-2 flex-shrink-0
																	${
																		notification.type === "reminder"
																			? "bg-blue-100 text-blue-500"
																			: notification.type === "alert"
																			? "bg-red-100 text-red-500"
																			: notification.type === "message"
																			? "bg-green-100 text-green-500"
																			: "bg-purple-100 text-purple-500"
																	}
																`}
															>
																{notification.type === "reminder" ? (
																	<FaClock className="text-xs" />
																) : notification.type === "alert" ? (
																	<FaExclamationTriangle className="text-xs" />
																) : notification.type === "message" ? (
																	<FaComments className="text-xs" />
																) : (
																	<FaSyncAlt className="text-xs" />
																)}
															</div>
															<div className="flex-1">
																<p className="text-sm">
																	{notification.message}
																</p>
																<p
																	className={`text-xs ${getThemeClasses(
																		"text-slate-500",
																		"text-slate-400"
																	)} mt-1`}
																>
																	{notification.time.toLocaleTimeString([], {
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
																</p>
															</div>
															{!notification.read && (
																<div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
															)}
														</div>
													</div>
												))
											)}
										</div>
										<div
											className={`p-3 ${getThemeClasses(
												"border-t border-slate-200",
												"border-t border-slate-700"
											)} text-center`}
										>
											<button
												className={`text-sm ${getThemeClasses(
													"text-indigo-600 hover:text-indigo-800",
													"text-indigo-400 hover:text-indigo-300"
												)}`}
												onClick={() => showComingSoon("View all notifications")}
											>
												View all notifications
											</button>
										</div>
									</div>
								)}
							</div>

							<button
								onClick={() => setShowIntegrations(!showIntegrations)}
								className={`flex items-center justify-center w-10 h-10 rounded-full ${getThemeClasses(
									"hover:bg-slate-100",
									"hover:bg-slate-700"
								)} transition-colors`}
								aria-label="Integrations"
							>
								<FaLink
									className={getThemeClasses(
										"text-slate-600",
										"text-slate-300"
									)}
								/>
							</button>

							<button
								onClick={() => setShowAnalytics(!showAnalytics)}
								className="flex items-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3 py-2 rounded-lg transition-all duration-300 shadow hover:shadow-md"
							>
								<FaChartBar className="mr-2" /> Analytics
							</button>

							<button
								onClick={() => setShowTeam(!showTeam)}
								className={`flex items-center ${getThemeClasses(
									"bg-indigo-100 hover:bg-indigo-200 text-indigo-800",
									"bg-indigo-900 hover:bg-indigo-800 text-indigo-200"
								)} px-3 py-2 rounded-lg transition-all duration-200`}
							>
								<FaUsers className="mr-2" /> Team
							</button>

							<div className="flex items-center bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 rounded-lg shadow-sm">
								<FaFire className="text-white mr-2" />
								<span className="font-medium text-white">
									Streak: {streak.count} days
								</span>
							</div>

							<div className="flex items-center bg-gradient-to-r from-red-400 to-red-500 px-3 py-2 rounded-lg shadow-sm">
								<FaClock className="text-white mr-2" />
								<span className="font-medium text-white">
									Time Debt: {formatTimeDebt(totalTimeDebt)}
								</span>
							</div>

							<div className="relative">
								<button
									onClick={() => setShowUserProfile(!showUserProfile)}
									className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all ml-2 shadow-md"
								>
									<FaUserCircle className="text-xl" />
								</button>

								{showUserProfile && (
									<div
										className={`absolute top-12 right-0 w-64 ${getThemeClasses(
											"bg-white",
											"bg-slate-800"
										)} rounded-lg shadow-xl z-50 overflow-hidden`}
									>
										<div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
											<div className="flex items-center">
												<div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
													<FaUserCircle className="text-indigo-700 text-3xl" />
												</div>
												<div className="ml-3">
													<h4 className="font-semibold">John Smith</h4>
													<p className="text-xs opacity-80">
														john.smith@company.com
													</p>
												</div>
											</div>
										</div>
										<div className="p-2">
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"hover:bg-slate-100",
													"hover:bg-slate-700"
												)} rounded transition-colors flex items-center`}
												onClick={() => showComingSoon("Profile settings")}
											>
												<FaUserCircle
													className={`mr-2 ${getThemeClasses(
														"text-slate-600",
														"text-slate-400"
													)}`}
												/>{" "}
												Profile Settings
											</button>
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"hover:bg-slate-100",
													"hover:bg-slate-700"
												)} rounded transition-colors flex items-center`}
												onClick={() => setShowSettings(true)}
											>
												<FaCog
													className={`mr-2 ${getThemeClasses(
														"text-slate-600",
														"text-slate-400"
													)}`}
												/>{" "}
												App Settings
											</button>
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"hover:bg-slate-100",
													"hover:bg-slate-700"
												)} rounded transition-colors flex items-center`}
												onClick={() =>
													showComingSoon("Switch to personal account")
												}
											>
												<FaBuilding
													className={`mr-2 ${getThemeClasses(
														"text-slate-600",
														"text-slate-400"
													)}`}
												/>{" "}
												Switch to Personal
											</button>
											<div
												className={getThemeClasses(
													"border-t border-slate-200 my-1",
													"border-t border-slate-700 my-1"
												)}
											></div>
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"hover:bg-slate-100 text-red-600",
													"hover:bg-slate-700 text-red-400"
												)} rounded transition-colors flex items-center`}
												onClick={() => showComingSoon("Logout")}
											>
												<FaLock className="mr-2" /> Logout
											</button>
										</div>
									</div>
								)}
							</div>
						</div>

						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className={`md:hidden text-2xl ${getThemeClasses(
								"text-slate-700",
								"text-white"
							)}`}
							aria-label="Menu"
						>
							<FaBars />
						</button>
					</div>
				</div>
			</header>

			{isMenuOpen && (
				<div
					className={`md:hidden ${getThemeClasses(
						"bg-white shadow-lg",
						"bg-slate-800 shadow-slate-700/30"
					)} p-4 animate-fadeIn transition-colors duration-300`}
				>
					<div className="flex flex-col space-y-3">
						<div className="flex items-center justify-between">
							<h3
								className={`font-semibold ${getThemeClasses(
									"text-slate-800",
									"text-white"
								)}`}
							>
								Menu
							</h3>
							<button
								onClick={() => setIsMenuOpen(false)}
								className={getThemeClasses("text-slate-500", "text-slate-400")}
							>
								<FaTimes />
							</button>
						</div>

						<div className="flex items-center justify-between">
							<span
								className={getThemeClasses("text-slate-700", "text-slate-300")}
							>
								Theme
							</span>
							<button
								onClick={toggleThemeMode}
								className={`flex items-center ${getThemeClasses(
									"bg-slate-100 text-slate-700",
									"bg-slate-700 text-white"
								)} px-3 py-2 rounded-lg`}
							>
								{themeMode === "light" ? (
									<>
										<FaMoon className="mr-2" /> Dark Mode
									</>
								) : (
									<>
										<FaSun className="mr-2" /> Light Mode
									</>
								)}
							</button>
						</div>

						<button
							onClick={() => {
								setShowAnalytics(!showAnalytics);
								setIsMenuOpen(false);
							}}
							className="flex items-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3 py-2 rounded-lg transition-all"
						>
							<FaChartBar className="mr-2" /> Analytics
						</button>

						<button
							onClick={() => {
								setShowTeam(!showTeam);
								setIsMenuOpen(false);
							}}
							className={`flex items-center ${getThemeClasses(
								"bg-indigo-100 hover:bg-indigo-200 text-indigo-800",
								"bg-indigo-900 hover:bg-indigo-800 text-indigo-200"
							)} px-3 py-2 rounded-lg transition-all duration-200`}
						>
							<FaUsers className="mr-2" /> Team
						</button>

						<button
							onClick={() => {
								setShowNotifications(!showNotifications);
								setIsMenuOpen(false);
							}}
							className={`flex items-center ${getThemeClasses(
								"bg-white border border-slate-300 hover:bg-slate-100 text-slate-800",
								"bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white"
							)} px-3 py-2 rounded-lg transition-all`}
						>
							<FaBell className="mr-2" />
							Notifications
							{unreadNotificationsCount > 0 && (
								<span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
									{unreadNotificationsCount}
								</span>
							)}
						</button>

						<button
							onClick={() => {
								setShowIntegrations(!showIntegrations);
								setIsMenuOpen(false);
							}}
							className={`flex items-center ${getThemeClasses(
								"bg-white border border-slate-300 hover:bg-slate-100 text-slate-800",
								"bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white"
							)} px-3 py-2 rounded-lg transition-all`}
						>
							<FaLink className="mr-2" /> Integrations
						</button>

						<button
							onClick={() => {
								setShowSettings(true);
								setIsMenuOpen(false);
							}}
							className={`flex items-center ${getThemeClasses(
								"bg-white border border-slate-300 hover:bg-slate-100 text-slate-800",
								"bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white"
							)} px-3 py-2 rounded-lg transition-all`}
						>
							<FaCog className="mr-2" /> Settings
						</button>

						<div className="flex items-center bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 rounded-lg shadow-sm">
							<FaFire className="text-white mr-2" />
							<span className="font-medium text-white">
								Streak: {streak.count} days
							</span>
						</div>

						<div className="flex items-center bg-gradient-to-r from-red-400 to-red-500 px-3 py-2 rounded-lg shadow-sm">
							<FaClock className="text-white mr-2" />
							<span className="font-medium text-white">
								Time Debt: {formatTimeDebt(totalTimeDebt)}
							</span>
						</div>
					</div>
				</div>
			)}

			<div className="container mx-auto p-4">
				<div className="flex flex-wrap justify-between items-center mb-6">
					<div className="flex items-center mb-2 sm:mb-0">
						<button
							onClick={navigatePrev}
							className={`flex items-center justify-center w-10 h-10 ${getThemeClasses(
								"bg-white shadow hover:bg-gray-100",
								"bg-slate-800 shadow-slate-700/30 hover:bg-slate-700"
							)} rounded-full transition-colors`}
							aria-label="Previous day"
						>
							<FaChevronLeft
								className={getThemeClasses("text-slate-600", "text-slate-300")}
							/>
						</button>

						<div className="flex flex-col items-center mx-4">
							<h2
								className={`text-xl font-semibold ${getThemeClasses(
									"text-slate-800",
									"text-white"
								)}`}
							>
								{activeView === "day" &&
									selectedDate.toLocaleDateString("en-US", {
										weekday: "long",
										month: "long",
										day: "numeric",
									})}
								{activeView === "week" &&
									`Week of ${selectedDate.toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
									})}`}
								{activeView === "month" &&
									selectedDate.toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}
							</h2>
						</div>

						<button
							onClick={navigateNext}
							className={`flex items-center justify-center w-10 h-10 ${getThemeClasses(
								"bg-white shadow hover:bg-gray-100",
								"bg-slate-800 shadow-slate-700/30 hover:bg-slate-700"
							)} rounded-full transition-colors`}
							aria-label="Next day"
						>
							<FaChevronRight
								className={getThemeClasses("text-slate-600", "text-slate-300")}
							/>
						</button>
					</div>

					<div className="flex flex-wrap items-center space-x-2">
						<button
							onClick={goToToday}
							className={`text-sm ${getThemeClasses(
								"bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
								"bg-indigo-900 text-indigo-200 hover:bg-indigo-800"
							)} px-3 py-1 rounded hover:shadow transition-colors`}
						>
							Today
						</button>

						<div
							className={`flex ${getThemeClasses(
								"bg-white",
								"bg-slate-800"
							)} rounded-lg shadow-sm`}
						>
							<button
								onClick={() => setActiveView("day")}
								className={`text-sm px-4 py-2 rounded-l-lg transition-colors ${
									activeView === "day"
										? "bg-indigo-600 text-white"
										: getThemeClasses(
												"bg-white text-slate-700 hover:bg-gray-100",
												"bg-slate-800 text-slate-200 hover:bg-slate-700"
										  )
								}`}
							>
								Day
							</button>
							<button
								onClick={() => {
									setActiveView("week");
									showComingSoon("Week view");
								}}
								className={`text-sm px-4 py-2 transition-colors ${
									activeView === "week"
										? "bg-indigo-600 text-white"
										: getThemeClasses(
												"bg-white text-slate-700 hover:bg-gray-100",
												"bg-slate-800 text-slate-200 hover:bg-slate-700"
										  )
								}`}
							>
								Week
							</button>
							<button
								onClick={() => {
									setActiveView("month");
									showComingSoon("Month view");
								}}
								className={`text-sm px-4 py-2 rounded-r-lg transition-colors ${
									activeView === "month"
										? "bg-indigo-600 text-white"
										: getThemeClasses(
												"bg-white text-slate-700 hover:bg-gray-100",
												"bg-slate-800 text-slate-200 hover:bg-slate-700"
										  )
								}`}
							>
								Month
							</button>
						</div>

						<button
							onClick={scrollToCurrentTime}
							className={`flex items-center ${getThemeClasses(
								"bg-green-100 text-green-700 hover:bg-green-200",
								"bg-green-900/50 text-green-200 hover:bg-green-800/60"
							)} px-3 py-1 rounded hover:shadow transition-colors`}
						>
							<FaClock className="mr-1" /> Now
						</button>
					</div>
				</div>

				<div
					className={`${getThemeClasses(
						"bg-white",
						"bg-slate-800"
					)} rounded-xl shadow-md mb-4 p-4 transition-colors duration-300`}
				>
					<div className="flex flex-wrap gap-3 items-center">
						<div className="relative flex-grow max-w-md">
							<input
								type="text"
								className={`w-full pl-10 pr-4 py-2 ${getThemeClasses(
									"border border-slate-300 focus:border-indigo-500 bg-white text-slate-900",
									"border border-slate-600 focus:border-indigo-400 bg-slate-700 text-white"
								)} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors duration-300`}
								placeholder="Search blocks..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<FaSearch
								className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getThemeClasses(
									"text-slate-400",
									"text-slate-500"
								)}`}
							/>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<button
								onClick={() => setShowProjects(!showProjects)}
								className={`flex items-center ${getThemeClasses(
									"bg-white border border-slate-300 hover:bg-slate-100 text-slate-700",
									"bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200"
								)} px-3 py-2 rounded-lg transition-colors shadow-sm hover:shadow`}
							>
								<FaBriefcase
									className={`mr-2 ${getThemeClasses(
										"text-indigo-600",
										"text-indigo-400"
									)}`}
								/>{" "}
								Projects
							</button>

							<button
								onClick={() => setShowFilterPanel(!showFilterPanel)}
								className={`flex items-center ${getThemeClasses(
									`bg-white border hover:bg-slate-100 text-slate-700 ${
										isFilterActive ? "border-indigo-500" : "border-slate-300"
									}`,
									`bg-slate-800 border hover:bg-slate-700 text-slate-200 ${
										isFilterActive ? "border-indigo-400" : "border-slate-600"
									}`
								)} px-3 py-2 rounded-lg transition-colors shadow-sm hover:shadow relative`}
							>
								<FaFilter
									className={`mr-2 ${getThemeClasses(
										isFilterActive ? "text-indigo-600" : "text-indigo-600",
										isFilterActive ? "text-indigo-400" : "text-indigo-400"
									)}`}
								/>{" "}
								Filter
								{isFilterActive && (
									<span className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">
										!
									</span>
								)}
							</button>

							<button
								onClick={() => showComingSoon("Calendar view")}
								className={`flex items-center ${getThemeClasses(
									"bg-white border border-slate-300 hover:bg-slate-100 text-slate-700",
									"bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200"
								)} px-3 py-2 rounded-lg transition-colors shadow-sm hover:shadow`}
							>
								<FaCalendarAlt
									className={`mr-2 ${getThemeClasses(
										"text-indigo-600",
										"text-indigo-400"
									)}`}
								/>{" "}
								Calendar
							</button>

							<button
								onClick={() => setShowExport(!showExport)}
								className={`flex items-center ${getThemeClasses(
									"bg-white border border-slate-300 hover:bg-slate-100 text-slate-700",
									"bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200"
								)} px-3 py-2 rounded-lg transition-colors shadow-sm hover:shadow`}
							>
								<FaFileExport
									className={`mr-2 ${getThemeClasses(
										"text-indigo-600",
										"text-indigo-400"
									)}`}
								/>{" "}
								Export
							</button>
						</div>
					</div>

					{showFilterPanel && (
						<div
							className={`mt-4 p-4 ${getThemeClasses(
								"bg-slate-50 border border-slate-200",
								"bg-slate-700 border border-slate-600"
							)} rounded-lg animate-slideDown`}
						>
							<div className="flex justify-between items-center mb-3">
								<h3 className="font-medium">Filters</h3>
								<button
									onClick={resetFilters}
									className={`text-xs ${getThemeClasses(
										"text-indigo-600 hover:text-indigo-800",
										"text-indigo-400 hover:text-indigo-300"
									)} transition-colors`}
								>
									Reset all filters
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<h4
										className={`text-sm font-medium mb-2 ${getThemeClasses(
											"text-slate-700",
											"text-slate-300"
										)}`}
									>
										Categories
									</h4>
									<div className="flex flex-wrap gap-2">
										{Object.keys(categoryColors).map((category) => (
											<button
												key={category}
												className={`text-xs px-2 py-1 rounded-full transition-all ${
													filterOptions.categories.includes(
														category as Category
													)
														? "bg-opacity-100 border-2 shadow-sm"
														: "bg-opacity-30 border border-transparent"
												}`}
												style={{
													backgroundColor: filterOptions.categories.includes(
														category as Category
													)
														? categoryColors[category as Category].bg
														: `${categoryColors[category as Category].light}`,
													color: filterOptions.categories.includes(
														category as Category
													)
														? "#FFFFFF"
														: categoryColors[category as Category].bg,
												}}
												onClick={() =>
													toggleCategoryFilter(category as Category)
												}
											>
												{category}
											</button>
										))}
									</div>
								</div>

								<div>
									<h4
										className={`text-sm font-medium mb-2 ${getThemeClasses(
											"text-slate-700",
											"text-slate-300"
										)}`}
									>
										Priority
									</h4>
									<div className="flex flex-wrap gap-2">
										{Object.keys(priorityColors).map((priority) => (
											<button
												key={priority}
												className={`text-xs px-2 py-1 rounded-full transition-all ${
													filterOptions.priorities.includes(
														priority as Priority
													)
														? "bg-opacity-100 border-2 shadow-sm"
														: "bg-opacity-30 border border-transparent"
												}`}
												style={{
													backgroundColor: filterOptions.priorities.includes(
														priority as Priority
													)
														? priorityColors[priority as Priority].bg
														: priorityColors[priority as Priority].light,
													color: filterOptions.priorities.includes(
														priority as Priority
													)
														? "#FFFFFF"
														: priorityColors[priority as Priority].bg,
													borderColor: filterOptions.priorities.includes(
														priority as Priority
													)
														? priorityColors[priority as Priority].border
														: "transparent",
												}}
												onClick={() =>
													togglePriorityFilter(priority as Priority)
												}
											>
												{priority}
											</button>
										))}
									</div>
								</div>

								<div>
									<h4
										className={`text-sm font-medium mb-2 ${getThemeClasses(
											"text-slate-700",
											"text-slate-300"
										)}`}
									>
										Status
									</h4>
									<div className="flex gap-2">
										<button
											className={`text-xs px-2 py-1 rounded-full transition-all ${
												filterOptions.completed === true
													? "bg-green-500 text-white border-2 border-green-600 shadow-sm"
													: getThemeClasses(
															"bg-green-100 text-green-700 border border-transparent",
															"bg-green-900/30 text-green-400 border border-transparent"
													  )
											}`}
											onClick={() => toggleCompletionFilter(true)}
										>
											Completed
										</button>
										<button
											className={`text-xs px-2 py-1 rounded-full transition-all ${
												filterOptions.completed === false
													? "bg-amber-500 text-white border-2 border-amber-600 shadow-sm"
													: getThemeClasses(
															"bg-amber-100 text-amber-700 border border-transparent",
															"bg-amber-900/30 text-amber-400 border border-transparent"
													  )
											}`}
											onClick={() => toggleCompletionFilter(false)}
										>
											In Progress
										</button>
									</div>
								</div>
							</div>

							{allTags.length > 0 && (
								<div className="mt-4">
									<h4
										className={`text-sm font-medium mb-2 ${getThemeClasses(
											"text-slate-700",
											"text-slate-300"
										)}`}
									>
										Tags
									</h4>
									<div className="flex flex-wrap gap-2">
										{allTags.map((tag) => (
											<button
												key={tag}
												className={`text-xs px-2 py-1 rounded-full transition-all ${
													filterOptions.tags.includes(tag)
														? "bg-indigo-500 text-white border-2 border-indigo-600 shadow-sm"
														: getThemeClasses(
																"bg-indigo-100 text-indigo-700 border border-transparent",
																"bg-indigo-900/30 text-indigo-400 border border-transparent"
														  )
												}`}
												onClick={() =>
													filterOptions.tags.includes(tag)
														? removeTagFilter(tag)
														: addTagFilter(tag)
												}
											>
												{tag}
											</button>
										))}
									</div>
								</div>
							)}

							{isFilterActive && (
								<div
									className={`mt-4 text-sm ${getThemeClasses(
										"text-slate-500",
										"text-slate-400"
									)}`}
								>
									<span className="font-medium">Active filters:</span>{" "}
									{filterOptions.categories.length > 0 && (
										<span className="mr-2">
											Categories: {filterOptions.categories.length}
										</span>
									)}
									{filterOptions.priorities.length > 0 && (
										<span className="mr-2">
											Priorities: {filterOptions.priorities.length}
										</span>
									)}
									{filterOptions.tags.length > 0 && (
										<span className="mr-2">
											Tags: {filterOptions.tags.length}
										</span>
									)}
									{filterOptions.completed !== null && (
										<span>
											Status:{" "}
											{filterOptions.completed ? "Completed" : "In Progress"}
										</span>
									)}
									{searchQuery && (
										<span className="mr-2">Search: "{searchQuery}"</span>
									)}
								</div>
							)}
						</div>
					)}
				</div>

				<div className="flex flex-col lg:flex-row gap-6">
					{showProjects && (
						<div
							className={`${getThemeClasses(
								"bg-white",
								"bg-slate-800"
							)} rounded-xl shadow-xl p-4 lg:w-1/4 animate-slideInLeft transition-colors duration-300`}
						>
							<div className="flex justify-between items-center mb-4">
								<h3
									className={`text-lg font-semibold ${getThemeClasses(
										"text-slate-800",
										"text-white"
									)}`}
								>
									Projects
								</h3>
								<button
									onClick={() => setShowProjects(false)}
									className={getThemeClasses(
										"text-slate-500 hover:text-slate-700",
										"text-slate-400 hover:text-slate-200"
									)}
								>
									<FaTimes />
								</button>
							</div>

							<div className="mb-4">
								<button
									onClick={() => showComingSoon("Add new project")}
									className={`w-full flex items-center justify-center ${getThemeClasses(
										"bg-indigo-100 hover:bg-indigo-200 text-indigo-700",
										"bg-indigo-900/50 hover:bg-indigo-800/60 text-indigo-300"
									)} p-2 rounded-lg transition-colors`}
								>
									<FaPlus className="mr-2" /> Add New Project
								</button>
							</div>

							<div className="space-y-3">
								{projects.map((project) => (
									<div
										key={project.id}
										className={`p-4 ${getThemeClasses(
											"bg-white border border-slate-200",
											"bg-slate-700 border border-slate-600"
										)} rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
									>
										<div className="flex justify-between items-center">
											<div className="flex items-center">
												<div
													className="w-3 h-3 rounded-full mr-2"
													style={{ backgroundColor: project.color }}
												></div>
												<h4
													className={`font-medium ${getThemeClasses(
														"text-slate-800",
														"text-white"
													)}`}
												>
													{project.name}
												</h4>
											</div>
											<button
												className={getThemeClasses(
													"text-slate-400 hover:text-slate-600",
													"text-slate-400 hover:text-slate-200"
												)}
											>
												<FaEllipsisH />
											</button>
										</div>

										<div className="mt-3">
											<div className="flex justify-between text-xs text-slate-500 mb-1">
												<span>Progress</span>
												<span>{project.progress}%</span>
											</div>
											<div
												className={`w-full h-2 ${getThemeClasses(
													"bg-slate-200",
													"bg-slate-600"
												)} rounded-full overflow-hidden`}
											>
												<div
													className="h-full rounded-full"
													style={{
														width: `${project.progress}%`,
														backgroundColor: project.color,
													}}
												></div>
											</div>
										</div>

										<div className="mt-3 flex justify-between items-center">
											<div className="flex -space-x-2">
												{[1, 2, 3].map((i) => (
													<div
														key={i}
														className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
														style={{ zIndex: 10 - i }}
													>
														<img
															src={`https://randomuser.me/api/portraits/${
																i % 2 === 0 ? "women" : "men"
															}/${i}.jpg`}
															alt="Team member"
															className="w-full h-full object-cover"
														/>
													</div>
												))}
												<div
													className={`w-6 h-6 rounded-full border-2 ${getThemeClasses(
														"border-white bg-indigo-100 text-indigo-600",
														"border-slate-700 bg-indigo-900 text-indigo-300"
													)} flex items-center justify-center text-xs font-medium`}
													style={{ zIndex: 7 }}
												>
													+2
												</div>
											</div>

											<div
												className={`text-xs ${getThemeClasses(
													"text-slate-500",
													"text-slate-400"
												)}`}
											>
												Due{" "}
												{project.deadline.toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
												})}
											</div>
										</div>
									</div>
								))}
							</div>

							<div
								className={`mt-4 pt-4 ${getThemeClasses(
									"border-t border-slate-200",
									"border-t border-slate-700"
								)}`}
							>
								<button
									onClick={() => showComingSoon("View all projects")}
									className={`w-full text-sm ${getThemeClasses(
										"text-indigo-600 hover:text-indigo-800",
										"text-indigo-400 hover:text-indigo-300"
									)}`}
								>
									View all projects →
								</button>
							</div>
						</div>
					)}

					<div
						className={`${getThemeClasses(
							"bg-white",
							"bg-slate-800"
						)} rounded-xl shadow-xl p-4 flex-grow ${
							showAnalytics || showTeam
								? "lg:w-1/2"
								: showProjects
								? "lg:w-3/4"
								: "w-full"
						} transition-colors duration-300`}
					>
						<div className="flex justify-between items-center mb-4">
							<h3
								className={`text-lg font-semibold ${getThemeClasses(
									"text-slate-800",
									"text-white"
								)}`}
							>
								Time Blocks
							</h3>
							<button
								onClick={() => setShowAddModal(true)}
								className="flex items-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3 py-2 rounded-lg transition-all duration-300 shadow hover:shadow-md"
							>
								<FaPlus className="mr-2" /> Add Block
							</button>
						</div>

						<div className="overflow-y-auto max-h-[650px] pr-2 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-slate-200">
							<div
								className={`relative h-[960px] ${getThemeClasses(
									"border-slate-300",
									"border-slate-600"
								)}`}
								ref={timeGridRef}
							>
								{timeSlots.map((slot, index) => (
									<div
										key={index}
										className={`absolute left-11 flex items-center h-[${40}px] text-xs ${getThemeClasses(
											"text-slate-500",
											"text-slate-400"
										)}`}
										style={{
											top: `${index * 40}px`,
										}}
									>
										<span className="inline-block w-12 text-right pr-2 -translate-x-[calc(100%+4px)]">
											{slot.time}
										</span>
										<div
											className={`w-full border-t ${getThemeClasses(
												"border-slate-200",
												"border-slate-700"
											)} -ml-[1px]`}
										></div>
									</div>
								))}

								<div
									className="absolute left-14 right-0 border-t-2 border-red-500 z-10"
									style={{
										top: `${
											(new Date().getHours() -
												0 +
												new Date().getMinutes() / 60) *
											40
										}px`,
									}}
								>
									<div className="absolute -left-3 -top-2 w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
								</div>

								{filteredBlocks.map((block) => {
									const blockStyle = calculateBlockStyle(block);
									const isBeingDragged = draggedBlock === block.id;
									const isBeingResized = resizingBlock === block.id;

									return (
										<div
											key={block.id}
											className={`absolute left-10 right-0 px-2 rounded-lg shadow-md transition-all duration-200 ${
												block.completed ? "opacity-60" : "opacity-100"
											} ${
												isBeingDragged || isBeingResized
													? "z-10 shadow-lg scale-[1.01]"
													: "z-0"
											} cursor-grab overflow-hidden`}
											style={{
												...blockStyle,
												background: categoryColors[block.category].gradient,
											}}
											onMouseDown={(e) => handleDragStart(block.id, e)}
											onTouchStart={(e) => handleDragStart(block.id, e)}
											onClick={(e) => {
												if (justDraggedOrResizedRef.current) {
													justDraggedOrResizedRef.current = false;
													return;
												}
												e.stopPropagation();
												setViewingBlock(block);
												setShowViewModal(true);
											}}
										>
											<div className="flex justify-between items-start p-2 text-white">
												<div className="overflow-hidden flex-1">
													<div className="flex items-center">
														{block.priority === "urgent" && (
															<FaExclamationTriangle className="mr-1 text-xs animate-pulse" />
														)}
														<h4 className="font-semibold truncate">
															{block.title}
														</h4>

														{parseInt(blockStyle.height?.toString() || "0") <=
															50 && (
															<FaQuestion
																className="ml-2 text-xs opacity-60"
																title="Click for details"
															/>
														)}
													</div>
													<div className="text-xs flex items-center gap-1">
														<span>
															{block.startTime.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}{" "}
															-
															{block.endTime.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}
														</span>
														{block.recurringType !== "none" && (
															<FaRegClock className="text-xs opacity-80" />
														)}
													</div>
												</div>
												<div className="flex space-x-1">
													<button
														onClick={(e) => {
															e.stopPropagation();
															toggleBlockCompletion(block.id);
														}}
														className="text-white hover:text-green-200 transition-colors p-1 rounded-full hover:bg-white/20"
														aria-label={
															block.completed
																? "Mark as incomplete"
																: "Mark as complete"
														}
													>
														{block.completed ? <FaCheck /> : <FaClock />}
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															editBlock(block.id);
														}}
														className="text-white hover:text-blue-200 transition-colors p-1 rounded-full hover:bg-white/20"
														aria-label="Edit block"
													>
														<FaEdit />
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															deleteTimeBlock(block.id);
														}}
														className="text-white hover:text-red-200 transition-colors p-1 rounded-full hover:bg-white/20"
														aria-label="Delete block"
													>
														<FaTrash />
													</button>
												</div>
											</div>

											{parseInt(blockStyle.height?.toString() || "0") > 50 &&
												block.description && (
													<div className="px-2 pb-2 text-xs text-white opacity-90 truncate">
														{block.description}
													</div>
												)}

											{block.tags &&
												block.tags.length > 0 &&
												parseInt(blockStyle.height?.toString() || "0") > 70 && (
													<div className="px-2 pb-2 flex flex-wrap gap-1">
														{block.tags.slice(0, 2).map((tag) => (
															<span
																key={tag}
																className="text-xs bg-white bg-opacity-30 px-2 py-0.5 rounded-full"
															>
																{tag}
															</span>
														))}
														{block.tags.length > 2 && (
															<span className="text-xs bg-white bg-opacity-30 px-2 py-0.5 rounded-full">
																+{block.tags.length - 2}
															</span>
														)}
													</div>
												)}

											{block.assignedTo &&
												block.assignedTo.length > 0 &&
												parseInt(blockStyle.height?.toString() || "0") > 90 && (
													<div className="absolute bottom-2 right-2 flex -space-x-2">
														{block.assignedTo.slice(0, 3).map((memberId) => {
															const member = teamMembers.find(
																(m) => m.id === memberId
															);
															return (
																<div
																	key={memberId}
																	className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
																>
																	{member && (
																		<img
																			src={member.avatar}
																			alt={member.name}
																			className="w-full h-full object-cover"
																		/>
																	)}
																</div>
															);
														})}
														{block.assignedTo.length > 3 && (
															<div className="w-6 h-6 rounded-full border-2 border-white bg-white bg-opacity-30 flex items-center justify-center text-xs font-medium text-white">
																+{block.assignedTo.length - 3}
															</div>
														)}
													</div>
												)}

											{block.location &&
												parseInt(blockStyle.height?.toString() || "0") > 60 && (
													<div className="absolute bottom-2 left-2 text-xs text-white/90 flex items-center">
														<FaBuilding className="mr-1" />
														<span className="truncate max-w-[100px]">
															{block.location}
														</span>
													</div>
												)}

											<div
												className="absolute bottom-0 left-0 right-0 h-2 bg-black bg-opacity-20 cursor-ns-resize"
												onMouseDown={(e) => handleResizeStart(block.id, e)}
												onTouchStart={(e) => handleResizeStart(block.id, e)}
											></div>
										</div>
									);
								})}
							</div>
						</div>

						{filteredBlocks.length === 0 && (
							<div
								className={`flex flex-col items-center justify-center py-10 ${getThemeClasses(
									"text-slate-500",
									"text-slate-400"
								)}`}
							>
								<FaCalendarAlt className="text-5xl mb-3 opacity-50" />
								<h3 className="text-lg font-medium mb-1">
									No time blocks found
								</h3>
								<p className="text-sm max-w-sm text-center mb-4">
									{isFilterActive
										? "Try adjusting your filters or search criteria."
										: "Add your first time block to get started with your day."}
								</p>
								{isFilterActive ? (
									<button
										onClick={resetFilters}
										className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
									>
										Reset Filters
									</button>
								) : (
									<button
										onClick={() => setShowAddModal(true)}
										className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
									>
										<FaPlus className="mr-2" /> Add Time Block
									</button>
								)}
							</div>
						)}
					</div>

					{showViewModal &&
						viewingBlock &&
						(() => {
							const currentBlock = blocks.find((b) => b.id === viewingBlock.id);
							if (!currentBlock) return null;

							return (
								<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
									<div
										className={`${getThemeClasses(
											"bg-white",
											"bg-slate-800"
										)} rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transition-colors duration-300`}
									>
										<div
											className="flex justify-between items-center text-white p-4"
											style={{
												background:
													categoryColors[currentBlock.category].gradient,
											}}
										>
											<div className="flex items-center">
												{currentBlock.priority === "urgent" && (
													<FaExclamationTriangle className="mr-2 animate-pulse" />
												)}
												<h3 className="text-lg font-semibold">
													{currentBlock.title}
												</h3>
												{currentBlock.completed && (
													<FaCheck className="ml-2 text-green-300" />
												)}
											</div>
											<button
												onClick={() => {
													setShowViewModal(false);
													setViewingBlock(null);
												}}
												className="text-white hover:text-indigo-200 transition-colors"
											>
												<FaTimes />
											</button>
										</div>

										<div className="p-6 max-h-[70vh] overflow-y-auto">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-4">
													<div>
														<h4
															className={`text-sm font-medium ${getThemeClasses(
																"text-slate-700",
																"text-slate-300"
															)} mb-2`}
														>
															Time & Duration
														</h4>
														<div
															className={`${getThemeClasses(
																"bg-slate-50",
																"bg-slate-700"
															)} rounded-lg p-3`}
														>
															<div className="flex items-center justify-between mb-2">
																<span
																	className={getThemeClasses(
																		"text-slate-600",
																		"text-slate-400"
																	)}
																>
																	Start:
																</span>
																<span
																	className={getThemeClasses(
																		"font-medium",
																		"font-medium text-white"
																	)}
																>
																	{currentBlock.startTime.toLocaleString([], {
																		weekday: "short",
																		month: "short",
																		day: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
																</span>
															</div>
															<div className="flex items-center justify-between mb-2">
																<span
																	className={getThemeClasses(
																		"text-slate-600",
																		"text-slate-400"
																	)}
																>
																	End:
																</span>
																<span
																	className={getThemeClasses(
																		"font-medium",
																		"font-medium text-white"
																	)}
																>
																	{currentBlock.endTime.toLocaleString([], {
																		weekday: "short",
																		month: "short",
																		day: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
																</span>
															</div>
															<div className="flex items-center justify-between">
																<span
																	className={getThemeClasses(
																		"text-slate-600",
																		"text-slate-400"
																	)}
																>
																	Duration:
																</span>
																<span
																	className={getThemeClasses(
																		"font-medium",
																		"font-medium text-white"
																	)}
																>
																	{Math.round(
																		(currentBlock.endTime.getTime() -
																			currentBlock.startTime.getTime()) /
																			60000
																	)}{" "}
																	minutes
																</span>
															</div>
														</div>
													</div>

													<div>
														<h4
															className={`text-sm font-medium ${getThemeClasses(
																"text-slate-700",
																"text-slate-300"
															)} mb-2`}
														>
															Status
														</h4>
														<div className="flex items-center">
															{currentBlock.completed ? (
																<>
																	<FaCheck className="mr-2 text-green-500" />
																	<span
																		className={`text-sm font-medium text-green-600 dark:text-green-400`}
																	>
																		Completed
																	</span>
																</>
															) : (
																<>
																	<FaClock className="mr-2 text-amber-500" />
																	<span
																		className={`text-sm font-medium text-amber-600 dark:text-amber-400`}
																	>
																		In Progress
																	</span>
																</>
															)}
														</div>
													</div>

													<div>
														<h4
															className={`text-sm font-medium ${getThemeClasses(
																"text-slate-700",
																"text-slate-300"
															)} mb-2`}
														>
															Category & Priority
														</h4>
														<div className="flex gap-3">
															<div
																className="px-3 py-1 rounded-full text-sm font-medium"
																style={{
																	backgroundColor:
																		categoryColors[currentBlock.category].light,
																	color:
																		categoryColors[currentBlock.category].bg,
																}}
															>
																{currentBlock.category.charAt(0).toUpperCase() +
																	currentBlock.category.slice(1)}
															</div>
															<div
																className="px-3 py-1 rounded-full text-sm font-medium"
																style={{
																	backgroundColor:
																		priorityColors[currentBlock.priority].light,
																	color:
																		priorityColors[currentBlock.priority].bg,
																}}
															>
																{currentBlock.priority.charAt(0).toUpperCase() +
																	currentBlock.priority.slice(1)}
															</div>
														</div>
													</div>

													{currentBlock.description && (
														<div>
															<h4
																className={`text-sm font-medium ${getThemeClasses(
																	"text-slate-700",
																	"text-slate-300"
																)} mb-2`}
															>
																Description
															</h4>
															<p
																className={`${getThemeClasses(
																	"text-slate-600",
																	"text-slate-400"
																)} text-sm leading-relaxed`}
															>
																{currentBlock.description}
															</p>
														</div>
													)}

													{currentBlock.location && (
														<div>
															<h4
																className={`text-sm font-medium ${getThemeClasses(
																	"text-slate-700",
																	"text-slate-300"
																)} mb-2`}
															>
																Location
															</h4>
															<div className="flex items-center">
																<FaBuilding
																	className={`mr-2 ${getThemeClasses(
																		"text-slate-500",
																		"text-slate-400"
																	)}`}
																/>
																<span
																	className={getThemeClasses(
																		"text-slate-600",
																		"text-slate-400"
																	)}
																>
																	{currentBlock.location}
																</span>
															</div>
														</div>
													)}
												</div>

												<div className="space-y-4">
													{currentBlock.tags &&
														currentBlock.tags.length > 0 && (
															<div>
																<h4
																	className={`text-sm font-medium ${getThemeClasses(
																		"text-slate-700",
																		"text-slate-300"
																	)} mb-2`}
																>
																	Tags
																</h4>
																<div className="flex flex-wrap gap-2">
																	{currentBlock.tags.map((tag) => (
																		<span
																			key={tag}
																			className={`px-2 py-1 rounded-full text-xs ${getThemeClasses(
																				"bg-indigo-100 text-indigo-800",
																				"bg-indigo-900/40 text-indigo-300"
																			)}`}
																		>
																			<FaTags className="inline mr-1" />
																			{tag}
																		</span>
																	))}
																</div>
															</div>
														)}

													{currentBlock.recurringType &&
														currentBlock.recurringType !== "none" && (
															<div>
																<h4
																	className={`text-sm font-medium ${getThemeClasses(
																		"text-slate-700",
																		"text-slate-300"
																	)} mb-2`}
																>
																	Recurring
																</h4>
																<div className="flex items-center">
																	<FaSyncAlt
																		className={`mr-2 ${getThemeClasses(
																			"text-slate-500",
																			"text-slate-400"
																		)}`}
																	/>
																	<span
																		className={getThemeClasses(
																			"text-slate-600",
																			"text-slate-400"
																		)}
																	>
																		{currentBlock.recurringType
																			.charAt(0)
																			.toUpperCase() +
																			currentBlock.recurringType.slice(1)}
																	</span>
																</div>
															</div>
														)}

													{currentBlock.assignedTo &&
														currentBlock.assignedTo.length > 0 && (
															<div>
																<h4
																	className={`text-sm font-medium ${getThemeClasses(
																		"text-slate-700",
																		"text-slate-300"
																	)} mb-2`}
																>
																	Assigned Team Members
																</h4>
																<div className="space-y-2">
																	{currentBlock.assignedTo.map((memberId) => {
																		const member = teamMembers.find(
																			(m) => m.id === memberId
																		);
																		return member ? (
																			<div
																				key={memberId}
																				className="flex items-center"
																			>
																				<img
																					src={member.avatar}
																					alt={member.name}
																					className="w-8 h-8 rounded-full mr-3"
																				/>
																				<div>
																					<div
																						className={`font-medium text-sm ${getThemeClasses(
																							"text-slate-800",
																							"text-white"
																						)}`}
																					>
																						{member.name}
																					</div>
																					<div
																						className={`text-xs ${getThemeClasses(
																							"text-slate-500",
																							"text-slate-400"
																						)}`}
																					>
																						{member.department} • {member.role}
																					</div>
																				</div>
																				<div
																					className={`ml-auto w-2 h-2 rounded-full ${
																						member.online
																							? "bg-green-500"
																							: "bg-slate-400"
																					}`}
																				></div>
																			</div>
																		) : null;
																	})}
																</div>
															</div>
														)}

													{currentBlock.notes && (
														<div>
															<h4
																className={`text-sm font-medium ${getThemeClasses(
																	"text-slate-700",
																	"text-slate-300"
																)} mb-2`}
															>
																Notes
															</h4>
															<div
																className={`${getThemeClasses(
																	"bg-slate-50",
																	"bg-slate-700"
																)} rounded-lg p-3`}
															>
																<p
																	className={`text-sm ${getThemeClasses(
																		"text-slate-600",
																		"text-slate-400"
																	)} leading-relaxed`}
																>
																	{currentBlock.notes}
																</p>
															</div>
														</div>
													)}

													<div>
														<h4
															className={`text-sm font-medium ${getThemeClasses(
																"text-slate-700",
																"text-slate-300"
															)} mb-2`}
														>
															Visibility
														</h4>
														<div className="flex items-center">
															{currentBlock.teamVisible ? (
																<>
																	<FaUsers className={`mr-2 text-green-500`} />
																	<span
																		className={`text-sm ${getThemeClasses(
																			"text-slate-600",
																			"text-slate-400"
																		)}`}
																	>
																		Visible to team
																	</span>
																</>
															) : (
																<>
																	<FaLock className={`mr-2 text-slate-400`} />
																	<span
																		className={`text-sm ${getThemeClasses(
																			"text-slate-600",
																			"text-slate-400"
																		)}`}
																	>
																		Private
																	</span>
																</>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>

										<div
											className={`${getThemeClasses(
												"bg-slate-50",
												"bg-slate-700"
											)} p-4 flex justify-between transition-colors duration-300`}
										>
											<div className="flex gap-2">
												<button
													onClick={() => {
														setShowViewModal(false);
														setViewingBlock(null);
														editBlock(currentBlock.id);
													}}
													className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow hover:shadow-md flex items-center"
												>
													<FaEdit className="mr-2" />
													Edit Block
												</button>
												<button
													onClick={() => {
														toggleBlockCompletion(currentBlock.id);

														toast.success(
															currentBlock.completed
																? "Block marked as incomplete"
																: "Block marked as complete"
														);
													}}
													className={`px-4 py-2 rounded-lg transition-colors shadow hover:shadow-md flex items-center ${
														currentBlock.completed
															? getThemeClasses(
																	"bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
																	"bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50"
															  )
															: getThemeClasses(
																	"bg-green-100 text-green-700 hover:bg-green-200",
																	"bg-green-900/30 text-green-400 hover:bg-green-900/50"
															  )
													}`}
												>
													{currentBlock.completed ? (
														<>
															<FaTimes className="mr-2" />
															Mark Incomplete
														</>
													) : (
														<>
															<FaCheck className="mr-2" />
															Mark Complete
														</>
													)}
												</button>
											</div>

											<button
												onClick={() => {
													setShowViewModal(false);
													setViewingBlock(null);
												}}
												className={`px-4 py-2 ${getThemeClasses(
													"border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-200",
													"border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600"
												)} transition-colors`}
											>
												Close
											</button>
										</div>
									</div>
								</div>
							);
						})()}
					{showTeam && (
						<div
							className={`${getThemeClasses(
								"bg-white",
								"bg-slate-800"
							)} rounded-xl shadow-xl p-4 lg:w-1/2 animate-slideInRight transition-colors duration-300`}
						>
							<div className="flex justify-between items-center mb-4">
								<h3
									className={`text-lg font-semibold ${getThemeClasses(
										"text-slate-800",
										"text-white"
									)}`}
								>
									Team Members
								</h3>
								<button
									onClick={() => setShowTeam(false)}
									className={getThemeClasses(
										"text-slate-500 hover:text-slate-700",
										"text-slate-400 hover:text-slate-200"
									)}
								>
									<FaTimes />
								</button>
							</div>

							<div className="mb-4">
								<button
									onClick={() => showComingSoon("Invite new team member")}
									className="flex items-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3 py-2 rounded-lg transition-all shadow hover:shadow-md"
								>
									<FaUserPlus className="mr-2" /> Invite Member
								</button>
							</div>

							<div className="space-y-2">
								{teamMembers.map((member) => (
									<div
										key={member.id}
										className={`p-4 rounded-lg transition-all ${
											selectedTeamMember === member.id
												? getThemeClasses(
														"border-indigo-500 bg-indigo-50",
														"border-indigo-500 bg-indigo-900/30"
												  )
												: getThemeClasses(
														"border border-slate-200 hover:border-indigo-300",
														"border border-slate-700 hover:border-indigo-600"
												  )
										}`}
										onClick={() =>
											setSelectedTeamMember(
												selectedTeamMember === member.id ? null : member.id
											)
										}
									>
										<div className="flex items-center">
											<div className="relative">
												<img
													src={member.avatar}
													alt={member.name}
													className="w-12 h-12 rounded-full object-cover shadow-md"
												/>
												<div
													className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${getThemeClasses(
														"border-white",
														"border-slate-800"
													)} ${
														member.online
															? "bg-green-500"
															: getThemeClasses("bg-slate-400", "bg-slate-500")
													}`}
												></div>
											</div>
											<div className="ml-3">
												<h4
													className={`font-medium ${getThemeClasses(
														"text-slate-800",
														"text-white"
													)}`}
												>
													{member.name}
												</h4>
												<div className="flex items-center mt-1">
													<span
														className={`text-xs px-2 py-0.5 rounded ${
															member.role === "admin"
																? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300"
																: member.role === "manager"
																? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
																: member.role === "member"
																? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300"
																: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
														}`}
													>
														{member.role.charAt(0).toUpperCase() +
															member.role.slice(1)}
													</span>
													<span
														className={`text-xs ${getThemeClasses(
															"text-slate-500",
															"text-slate-400"
														)} ml-2`}
													>
														{member.department}
													</span>
												</div>
											</div>
											<div className="ml-auto flex space-x-2">
												<button
													className={`${getThemeClasses(
														"text-slate-400 hover:text-indigo-600",
														"text-slate-500 hover:text-indigo-400"
													)} transition-colors`}
													onClick={(e) => {
														e.stopPropagation();
														showComingSoon("View schedule");
													}}
													aria-label="View schedule"
												>
													<FaCalendarAlt />
												</button>
												<button
													className={`${getThemeClasses(
														"text-slate-400 hover:text-indigo-600",
														"text-slate-500 hover:text-indigo-400"
													)} transition-colors`}
													onClick={(e) => {
														e.stopPropagation();
														showComingSoon("Send message");
													}}
													aria-label="Send message"
												>
													<FaComments />
												</button>
											</div>
										</div>

										{selectedTeamMember === member.id && (
											<div
												className={`mt-4 pt-3 ${getThemeClasses(
													"border-t border-slate-200",
													"border-t border-slate-700"
												)} animate-fadeIn`}
											>
												<div className="grid grid-cols-2 gap-3 mb-3">
													<div
														className={getThemeClasses(
															"bg-indigo-50 rounded p-3",
															"bg-indigo-900/30 rounded p-3"
														)}
													>
														<div
															className={`text-xs ${getThemeClasses(
																"text-slate-500",
																"text-slate-400"
															)}`}
														>
															Current Task
														</div>
														<div
															className={`text-sm font-medium ${getThemeClasses(
																"text-slate-800",
																"text-white"
															)}`}
														>
															Marketing Strategy
														</div>
													</div>
													<div
														className={getThemeClasses(
															"bg-indigo-50 rounded p-3",
															"bg-indigo-900/30 rounded p-3"
														)}
													>
														<div
															className={`text-xs ${getThemeClasses(
																"text-slate-500",
																"text-slate-400"
															)}`}
														>
															Completion Rate
														</div>
														<div
															className={`text-sm font-medium ${getThemeClasses(
																"text-slate-800",
																"text-white"
															)}`}
														>
															87%
														</div>
													</div>
												</div>

												<div className="flex flex-wrap gap-2">
													<button
														className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition-colors shadow-sm"
														onClick={() => showComingSoon("Assign task")}
													>
														Assign Task
													</button>
													<button
														className={`text-xs ${getThemeClasses(
															"bg-white border border-slate-300 hover:bg-slate-50 text-slate-700",
															"bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200"
														)} px-3 py-1.5 rounded transition-colors`}
														onClick={() => showComingSoon("View schedule")}
													>
														View Schedule
													</button>
													<button
														className={`text-xs ${getThemeClasses(
															"bg-white border border-slate-300 hover:bg-slate-50 text-slate-700",
															"bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200"
														)} px-3 py-1.5 rounded transition-colors`}
														onClick={() => showComingSoon("Performance")}
													>
														Performance
													</button>
												</div>
											</div>
										)}
									</div>
								))}
							</div>

							<div
								className={`mt-5 pt-4 ${getThemeClasses(
									"border-t border-slate-200",
									"border-t border-slate-700"
								)}`}
							>
								<h4
									className={`font-medium ${getThemeClasses(
										"text-slate-700",
										"text-slate-300"
									)} mb-2`}
								>
									Quick Filters
								</h4>
								<div className="flex flex-wrap gap-2">
									{departments.map((dept) => (
										<button
											key={dept.id}
											className={`text-xs px-3 py-1.5 rounded-full ${getThemeClasses(
												"border border-slate-200 hover:border-indigo-300",
												"border border-slate-700 hover:border-indigo-500"
											)} transition-colors`}
											style={{
												backgroundColor: getThemeClasses(
													`${dept.color}20`,
													`${dept.color}10`
												),
												color: getThemeClasses(
													dept.color,
													dept.color.replace("F8", "F0")
												),
											}}
											onClick={() => showComingSoon("Filter by department")}
										>
											{dept.name}
										</button>
									))}
								</div>
							</div>
						</div>
					)}

					{showAnalytics && (
						<div
							className={`${getThemeClasses(
								"bg-white",
								"bg-slate-800"
							)} rounded-xl shadow-xl p-4 lg:w-1/2 animate-slideInRight transition-colors duration-300 overflow-scroll h-screen`}
						>
							<div className="flex justify-between items-center mb-4">
								<h3
									className={`text-lg font-semibold ${getThemeClasses(
										"text-slate-800",
										"text-white"
									)}`}
								>
									Productivity Analytics
								</h3>
								<div className="flex gap-2">
									<button
										className={`text-sm ${getThemeClasses(
											"bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
											"bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60"
										)} px-3 py-1 rounded transition-colors`}
										onClick={() => showComingSoon("Generate report")}
									>
										<FaFileExport className="inline mr-1" /> Export
									</button>
									<button
										onClick={() => setShowAnalytics(false)}
										className={getThemeClasses(
											"text-slate-500 hover:text-slate-700",
											"text-slate-400 hover:text-slate-200"
										)}
									>
										<FaTimes />
									</button>
								</div>
							</div>

							<div className="space-y-6">
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div
										className={getThemeClasses(
											"bg-indigo-50 rounded-lg p-3",
											"bg-indigo-900/30 rounded-lg p-3"
										)}
									>
										<div
											className={`text-xs ${getThemeClasses(
												"text-slate-500",
												"text-slate-400"
											)} mb-1`}
										>
											Completion Rate
										</div>
										<div
											className={`text-xl font-bold ${getThemeClasses(
												"text-indigo-700",
												"text-indigo-300"
											)}`}
										>
											{analytics.completionRate.toFixed(0)}%
										</div>
										<div className="text-xs text-green-600 dark:text-green-400 mt-1">
											<span className="inline-block mr-1">↑</span>
											4% from last week
										</div>
									</div>

									<div
										className={getThemeClasses(
											"bg-green-50 rounded-lg p-3",
											"bg-green-900/30 rounded-lg p-3"
										)}
									>
										<div
											className={`text-xs ${getThemeClasses(
												"text-slate-500",
												"text-slate-400"
											)} mb-1`}
										>
											Focus Hours
										</div>
										<div
											className={`text-xl font-bold ${getThemeClasses(
												"text-green-700",
												"text-green-300"
											)}`}
										>
											{(analytics.timeByCategory.focus / 60).toFixed(1)}h
										</div>
										<div className="text-xs text-green-600 dark:text-green-400 mt-1">
											<span className="inline-block mr-1">↑</span>
											1.2h from last week
										</div>
									</div>

									<div
										className={getThemeClasses(
											"bg-blue-50 rounded-lg p-3",
											"bg-blue-900/30 rounded-lg p-3"
										)}
									>
										<div
											className={`text-xs ${getThemeClasses(
												"text-slate-500",
												"text-slate-400"
											)} mb-1`}
										>
											Meeting Time
										</div>
										<div
											className={`text-xl font-bold ${getThemeClasses(
												"text-blue-700",
												"text-blue-300"
											)}`}
										>
											{(analytics.timeByCategory.meeting / 60).toFixed(1)}h
										</div>
										<div className="text-xs text-red-600 dark:text-red-400 mt-1">
											<span className="inline-block mr-1">↑</span>
											0.5h from last week
										</div>
									</div>

									<div
										className={getThemeClasses(
											"bg-orange-50 rounded-lg p-3",
											"bg-orange-900/30 rounded-lg p-3"
										)}
									>
										<div
											className={`text-xs ${getThemeClasses(
												"text-slate-500",
												"text-slate-400"
											)} mb-1`}
										>
											Time Debt
										</div>
										<div
											className={`text-xl font-bold ${getThemeClasses(
												"text-orange-700",
												"text-orange-300"
											)}`}
										>
											{formatTimeDebt(totalTimeDebt)}
										</div>
										<div className="text-xs text-green-600 dark:text-green-400 mt-1">
											<span className="inline-block mr-1">↓</span>
											30m from last week
										</div>
									</div>
								</div>

								<div
									className={getThemeClasses(
										"bg-slate-50 rounded-lg p-4",
										"bg-slate-700 rounded-lg p-4"
									)}
								>
									<h4
										className={`text-md font-medium ${getThemeClasses(
											"text-slate-700",
											"text-slate-200"
										)} mb-2`}
									>
										Task Completion Rate
									</h4>
									<div className="relative h-8 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
										<div
											className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
											style={{ width: `${analytics.completionRate}%` }}
										></div>
										<div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
											{analytics.completionRate.toFixed(0)}% Complete
										</div>
									</div>
								</div>

								<div
									className={getThemeClasses(
										"bg-slate-50 rounded-lg p-4",
										"bg-slate-700 rounded-lg p-4"
									)}
								>
									<div className="flex justify-between items-center mb-2">
										<h4
											className={`text-md font-medium ${getThemeClasses(
												"text-slate-700",
												"text-slate-200"
											)}`}
										>
											Weekly Productivity
										</h4>
										<button
											className={`text-xs ${getThemeClasses(
												"text-indigo-600",
												"text-indigo-400"
											)}`}
											onClick={() =>
												showComingSoon("View detailed weekly report")
											}
										>
											View Details
										</button>
									</div>
									<div className="h-40 flex items-end justify-between">
										{analytics.weeklyProductivity.map((value, index) => {
											const day = new Date();
											day.setDate(day.getDate() - (6 - index));
											const dayName = day.toLocaleDateString("en-US", {
												weekday: "short",
											});

											return (
												<div
													key={index}
													className="flex flex-col items-center flex-1"
												>
													<div
														className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t flex gap-1 transition-all duration-500"
														style={{ height: `${value}px` }}
													></div>
													<div
														className={`text-xs ${getThemeClasses(
															"text-slate-500",
															"text-slate-400"
														)} mt-1`}
													>
														{dayName}
													</div>
												</div>
											);
										})}
									</div>
								</div>

								<div
									className={getThemeClasses(
										"bg-slate-50 rounded-lg p-4",
										"bg-slate-700 rounded-lg p-4"
									)}
								>
									<h4
										className={`text-md font-medium ${getThemeClasses(
											"text-slate-700",
											"text-slate-200"
										)} mb-3`}
									>
										Time by Category
									</h4>
									<div className="space-y-3">
										{Object.entries(analytics.timeByCategory).map(
											([category, minutes]) => (
												<div key={category} className="flex items-center">
													<div
														className="w-3 h-3 rounded-full mr-2"
														style={{
															backgroundColor:
																categoryColors[category as Category].bg,
														}}
													></div>
													<div
														className={`text-sm capitalize ${getThemeClasses(
															"text-slate-700",
															"text-slate-300"
														)}`}
													>
														{category}
													</div>
													<div
														className={`ml-auto text-sm font-medium ${getThemeClasses(
															"text-slate-800",
															"text-white"
														)} flex items-center`}
													>
														{Math.floor(minutes / 60)}h {minutes % 60}m
														<div
															className={`w-16 h-2 ${getThemeClasses(
																"bg-slate-200",
																"bg-slate-600"
															)} rounded-full ml-2 overflow-hidden`}
														>
															<div
																className="h-full rounded-full"
																style={{
																	width: `${
																		(minutes /
																			Object.values(
																				analytics.timeByCategory
																			).reduce((a, b) => a + b, 0)) *
																		100
																	}%`,
																	backgroundColor:
																		categoryColors[category as Category].bg,
																}}
															></div>
														</div>
													</div>
												</div>
											)
										)}
									</div>
								</div>

								<div
									className={getThemeClasses(
										"bg-slate-50 rounded-lg p-4",
										"bg-slate-700 rounded-lg p-4"
									)}
								>
									<h4
										className={`text-md font-medium ${getThemeClasses(
											"text-slate-700",
											"text-slate-200"
										)} mb-3`}
									>
										Efficiency Metrics
									</h4>
									<div className="grid grid-cols-2 gap-4">
										{Object.entries(analytics.efficiencyMetrics).map(
											([metric, value]) => {
												const formattedMetric = metric
													.replace(/([A-Z])/g, " $1")
													.replace(/^./, (str) => str.toUpperCase());

												return (
													<div
														key={metric}
														className={`${getThemeClasses(
															"bg-white rounded-lg p-3 border border-slate-200",
															"bg-slate-800 rounded-lg p-3 border border-slate-600"
														)}`}
													>
														<div
															className={`text-xs ${getThemeClasses(
																"text-slate-500",
																"text-slate-400"
															)} mb-1`}
														>
															{formattedMetric}
														</div>
														<div className="flex items-center justify-between">
															<div
																className={`text-lg font-bold ${getThemeClasses(
																	"text-slate-800",
																	"text-white"
																)}`}
															>
																{value}%
															</div>
															<div
																className={`text-xs px-2 py-0.5 rounded-full ${
																	value >= 80
																		? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300"
																		: value >= 60
																		? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300"
																		: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300"
																}`}
															>
																{value >= 80
																	? "Great"
																	: value >= 60
																	? "Good"
																	: "Needs Improvement"}
															</div>
														</div>
													</div>
												);
											}
										)}
									</div>
								</div>

								<div
									className={getThemeClasses(
										"bg-slate-50 rounded-lg p-4",
										"bg-slate-700 rounded-lg p-4"
									)}
								>
									<h4
										className={`text-md font-medium ${getThemeClasses(
											"text-slate-700",
											"text-slate-200"
										)} mb-2`}
									>
										Time Debt Trend
									</h4>
									<div className="text-center py-6">
										<div
											className={`text-2xl font-bold ${getThemeClasses(
												"text-red-500",
												"text-red-400"
											)}`}
										>
											{formatTimeDebt(totalTimeDebt)}
										</div>
										<div
											className={`text-sm ${getThemeClasses(
												"text-slate-500",
												"text-slate-400"
											)} mt-1`}
										>
											Total accumulated time debt
										</div>
									</div>
									<button
										onClick={() =>
											showComingSoon("Detailed time debt analysis")
										}
										className={`w-full ${getThemeClasses(
											"bg-slate-200 hover:bg-slate-300 text-slate-700",
											"bg-slate-600 hover:bg-slate-500 text-white"
										)} py-2 rounded-lg transition-colors mt-2`}
									>
										View Detailed Analysis
									</button>
								</div>
							</div>
						</div>
					)}

					{showExport && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
							<div
								className={`${getThemeClasses(
									"bg-white",
									"bg-slate-800"
								)} rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-300`}
							>
								<div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
									<h3 className="text-lg font-semibold">Export Options</h3>
									<button
										onClick={() => setShowExport(false)}
										className="text-white hover:text-indigo-200 transition-colors"
									>
										<FaTimes />
									</button>
								</div>

								<div className="p-4 space-y-4">
									<div>
										<label
											className={`block text-sm font-medium ${getThemeClasses(
												"text-slate-700",
												"text-slate-300"
											)} mb-1`}
										>
											Date Range
										</label>
										<select
											className={`w-full p-2 ${getThemeClasses(
												"border border-slate-300 bg-white text-slate-900",
												"border border-slate-600 bg-slate-700 text-white"
											)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
										>
											<option>Today</option>
											<option>This Week</option>
											<option>This Month</option>
											<option>Custom Range</option>
										</select>
									</div>

									<div>
										<label
											className={`block text-sm font-medium ${getThemeClasses(
												"text-slate-700",
												"text-slate-300"
											)} mb-1`}
										>
											Export Format
										</label>
										<div className="grid grid-cols-3 gap-2">
											<button
												className={`p-2 rounded-lg border-2 ${getThemeClasses(
													"border-indigo-600 bg-indigo-50 text-indigo-700",
													"border-indigo-500 bg-indigo-900/30 text-indigo-300"
												)} font-medium transition-colors`}
											>
												<FaFileExport className="mx-auto mb-1" />
												<span className="text-xs">PDF</span>
											</button>
											<button
												className={`p-2 rounded-lg ${getThemeClasses(
													"border border-slate-300 hover:border-slate-400 text-slate-700",
													"border border-slate-600 hover:border-slate-500 text-slate-300"
												)} transition-colors`}
											>
												<FaFileExport className="mx-auto mb-1" />
												<span className="text-xs">Excel</span>
											</button>
											<button
												className={`p-2 rounded-lg ${getThemeClasses(
													"border border-slate-300 hover:border-slate-400 text-slate-700",
													"border border-slate-600 hover:border-slate-500 text-slate-300"
												)} transition-colors`}
											>
												<FaFileExport className="mx-auto mb-1" />
												<span className="text-xs">CSV</span>
											</button>
										</div>
									</div>

									<div>
										<label
											className={`block text-sm font-medium ${getThemeClasses(
												"text-slate-700",
												"text-slate-300"
											)} mb-1`}
										>
											Content to Include
										</label>
										<div className="space-y-2">
											<label className="flex items-center">
												<input
													type="checkbox"
													checked
													className="mr-2 text-indigo-600 focus:ring-indigo-500"
													readOnly
												/>
												<span
													className={getThemeClasses(
														"text-sm text-slate-700",
														"text-sm text-slate-300"
													)}
												>
													Time blocks
												</span>
											</label>
											<label className="flex items-center">
												<input
													type="checkbox"
													checked
													className="mr-2 text-indigo-600 focus:ring-indigo-500"
													readOnly
												/>
												<span
													className={getThemeClasses(
														"text-sm text-slate-700",
														"text-sm text-slate-300"
													)}
												>
													Analytics summary
												</span>
											</label>
											<label className="flex items-center">
												<input
													type="checkbox"
													checked
													className="mr-2 text-indigo-600 focus:ring-indigo-500"
													readOnly
												/>
												<span
													className={getThemeClasses(
														"text-sm text-slate-700",
														"text-sm text-slate-300"
													)}
												>
													Time debt report
												</span>
											</label>
											<label className="flex items-center">
												<input
													type="checkbox"
													className="mr-2 text-indigo-600 focus:ring-indigo-500"
													readOnly
												/>
												<span
													className={getThemeClasses(
														"text-sm text-slate-700",
														"text-sm text-slate-300"
													)}
												>
													Team performance
												</span>
											</label>
										</div>
									</div>
								</div>

								<div
									className={`${getThemeClasses(
										"bg-slate-50",
										"bg-slate-700"
									)} p-4 flex justify-end space-x-2 transition-colors duration-300`}
								>
									<button
										onClick={() => setShowExport(false)}
										className={`px-4 py-2 ${getThemeClasses(
											"border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-200",
											"border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600"
										)} transition-colors`}
									>
										Cancel
									</button>
									<button
										onClick={() => {
											setShowExport(false);
											showComingSoon("Export functionality");
										}}
										className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-colors shadow hover:shadow-md flex items-center"
									>
										<FaDownload className="mr-2" />
										Export Report
									</button>
								</div>
							</div>
						</div>
					)}

					{showSettings && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
							<div
								className={`${getThemeClasses(
									"bg-white",
									"bg-slate-800"
								)} rounded-xl shadow-2xl w-full max-w-2xl h-3/4 flex flex-col overflow-hidden transition-colors duration-300`}
							>
								<div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
									<h3 className="text-lg font-semibold">App Settings</h3>
									<button
										onClick={() => setShowSettings(false)}
										className="text-white hover:text-indigo-200 transition-colors"
									>
										<FaTimes />
									</button>
								</div>

								<div className="flex flex-col md:flex-row flex-1 overflow-hidden">
									<div
										className={`w-full md:w-48 ${getThemeClasses(
											"bg-slate-50 md:border-r border-slate-200",
											"bg-slate-700 md:border-r border-slate-600"
										)} p-4 transition-colors duration-300`}
									>
										<nav className="space-y-1">
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"bg-indigo-100 text-indigo-700",
													"bg-indigo-900/50 text-indigo-300"
												)} rounded transition-colors`}
											>
												General
											</button>
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"text-slate-700 hover:bg-slate-100",
													"text-slate-300 hover:bg-slate-600"
												)} rounded transition-colors`}
												onClick={() => showComingSoon("Notifications settings")}
											>
												Notifications
											</button>
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"text-slate-700 hover:bg-slate-100",
													"text-slate-300 hover:bg-slate-600"
												)} rounded transition-colors`}
												onClick={() => showComingSoon("Appearance settings")}
											>
												Appearance
											</button>
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"text-slate-700 hover:bg-slate-100",
													"text-slate-300 hover:bg-slate-600"
												)} rounded transition-colors`}
												onClick={() => showComingSoon("Integrations settings")}
											>
												Integrations
											</button>
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"text-slate-700 hover:bg-slate-100",
													"text-slate-300 hover:bg-slate-600"
												)} rounded transition-colors`}
												onClick={() => showComingSoon("Team settings")}
											>
												Team
											</button>
											<button
												className={`w-full text-left px-3 py-2 text-sm ${getThemeClasses(
													"text-slate-700 hover:bg-slate-100",
													"text-slate-300 hover:bg-slate-600"
												)} rounded transition-colors`}
												onClick={() => showComingSoon("Billing settings")}
											>
												Billing
											</button>
										</nav>
									</div>

									<div className="flex-1 p-6 overflow-y-auto">
										<h4
											className={`text-lg font-medium ${getThemeClasses(
												"text-slate-800",
												"text-white"
											)} mb-4`}
										>
											General Settings
										</h4>

										<div className="space-y-6">
											<div>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-2`}
												>
													Theme
												</h5>
												<div className="flex space-x-4">
													<label className="flex items-center">
														<input
															type="radio"
															name="theme"
															checked={themeMode === "light"}
															onChange={() => setThemeMode("light")}
															className="mr-2 text-indigo-600 focus:ring-indigo-500"
														/>
														<span
															className={getThemeClasses("text-sm", "text-sm")}
														>
															Light
														</span>
													</label>
													<label className="flex items-center">
														<input
															type="radio"
															name="theme"
															checked={themeMode === "dark"}
															onChange={() => setThemeMode("dark")}
															className="mr-2 text-indigo-600 focus:ring-indigo-500"
														/>
														<span
															className={getThemeClasses("text-sm", "text-sm")}
														>
															Dark
														</span>
													</label>
												</div>
											</div>

											<div>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-2`}
												>
													Time Format
												</h5>
												<div className="flex space-x-4">
													<label className="flex items-center">
														<input
															type="radio"
															name="timeFormat"
															checked
															className="mr-2 text-indigo-600 focus:ring-indigo-500"
															readOnly
														/>
														<span
															className={getThemeClasses("text-sm", "text-sm")}
														>
															12-hour
														</span>
													</label>
													<label className="flex items-center">
														<input
															type="radio"
															name="timeFormat"
															className="mr-2 text-indigo-600 focus:ring-indigo-500"
															readOnly
														/>
														<span
															className={getThemeClasses("text-sm", "text-sm")}
														>
															24-hour
														</span>
													</label>
												</div>
											</div>

											<div>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-2`}
												>
													Week Starts On
												</h5>
												<select
													className={`w-full max-w-xs p-2 ${getThemeClasses(
														"border border-slate-300 bg-white text-slate-900",
														"border border-slate-600 bg-slate-700 text-white"
													)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
												>
													<option>Sunday</option>
													<option>Monday</option>
												</select>
											</div>

											<div>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-2`}
												>
													Working Hours
												</h5>
												<div className="flex items-center space-x-2">
													<select
														className={`p-2 ${getThemeClasses(
															"border border-slate-300 bg-white text-slate-900",
															"border border-slate-600 bg-slate-700 text-white"
														)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
													>
														<option>6:00 AM</option>
														<option>7:00 AM</option>
														<option>8:00 AM</option>
														<option>9:00 AM</option>
														<option>10:00 AM</option>
													</select>
													<span>to</span>
													<select
														className={`p-2 ${getThemeClasses(
															"border border-slate-300 bg-white text-slate-900",
															"border border-slate-600 bg-slate-700 text-white"
														)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
													>
														<option>4:00 PM</option>
														<option>5:00 PM</option>
														<option>6:00 PM</option>
														<option>7:00 PM</option>
														<option>8:00 PM</option>
														<option>9:00 PM</option>
														<option>10:00 PM</option>
													</select>
												</div>
											</div>

											<div>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-2`}
												>
													Default View
												</h5>
												<div className="flex space-x-4">
													<label className="flex items-center">
														<input
															type="radio"
															name="defaultView"
															checked
															className="mr-2 text-indigo-600 focus:ring-indigo-500"
															readOnly
														/>
														<span
															className={getThemeClasses("text-sm", "text-sm")}
														>
															Day
														</span>
													</label>
													<label className="flex items-center">
														<input
															type="radio"
															name="defaultView"
															className="mr-2 text-indigo-600 focus:ring-indigo-500"
															readOnly
														/>
														<span
															className={getThemeClasses("text-sm", "text-sm")}
														>
															Week
														</span>
													</label>
													<label className="flex items-center">
														<input
															type="radio"
															name="defaultView"
															className="mr-2 text-indigo-600 focus:ring-indigo-500"
															readOnly
														/>
														<span
															className={getThemeClasses("text-sm", "text-sm")}
														>
															Month
														</span>
													</label>
												</div>
											</div>

											<div>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-2`}
												>
													Default Event Duration
												</h5>
												<select
													className={`w-full max-w-xs p-2 ${getThemeClasses(
														"border border-slate-300 bg-white text-slate-900",
														"border border-slate-600 bg-slate-700 text-white"
													)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
												>
													<option>15 minutes</option>
													<option>30 minutes</option>
													<option selected>60 minutes</option>
													<option>90 minutes</option>
													<option>120 minutes</option>
												</select>
											</div>

											<div
												className={`flex items-center justify-between pt-2 ${getThemeClasses(
													"border-t border-slate-200",
													"border-t border-slate-700"
												)}`}
											>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)}`}
												>
													Enable Notifications
												</h5>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														className="sr-only peer"
														checked
														readOnly
													/>
													<div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
												</label>
											</div>

											<div
												className={`flex items-center justify-between pt-2 ${getThemeClasses(
													"border-t border-slate-200",
													"border-t border-slate-700"
												)}`}
											>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)}`}
												>
													Enable Sound Effects
												</h5>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														className="sr-only peer"
														readOnly
													/>
													<div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
												</label>
											</div>

											<div
												className={`flex items-center justify-between pt-2 ${getThemeClasses(
													"border-t border-slate-200",
													"border-t border-slate-700"
												)}`}
											>
												<h5
													className={`text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)}`}
												>
													Auto-sync with External Calendars
												</h5>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														className="sr-only peer"
														checked
														readOnly
													/>
													<div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
												</label>
											</div>
										</div>
									</div>
								</div>

								<div
									className={`${getThemeClasses(
										"bg-slate-50",
										"bg-slate-700"
									)} p-4 ${getThemeClasses(
										"border-t border-slate-200",
										"border-t border-slate-600"
									)} flex justify-end space-x-2 transition-colors duration-300`}
								>
									<button
										onClick={() => setShowSettings(false)}
										className={`px-4 py-2 ${getThemeClasses(
											"border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-200",
											"border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600"
										)} transition-colors`}
									>
										Cancel
									</button>
									<button
										onClick={() => {
											setShowSettings(false);
											toast.success("Settings saved successfully");
										}}
										className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-colors shadow hover:shadow-md flex items-center"
									>
										<FaSave className="mr-2" />
										Save Settings
									</button>
								</div>
							</div>
						</div>
					)}

					{showIntegrations && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
							<div
								className={`${getThemeClasses(
									"bg-white",
									"bg-slate-800"
								)} rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transition-colors duration-300`}
							>
								<div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
									<h3 className="text-lg font-semibold">Integrations</h3>
									<button
										onClick={() => setShowIntegrations(false)}
										className="text-white hover:text-indigo-200 transition-colors"
									>
										<FaTimes />
									</button>
								</div>

								<div className="p-4 max-h-96 overflow-y-auto">
									<p
										className={`text-sm ${getThemeClasses(
											"text-slate-600",
											"text-slate-300"
										)} mb-4`}
									>
										Connect TimeBlock Pro with your favorite apps and services
										to enhance productivity.
									</p>

									<div className="space-y-3">
										{integrations.map((integration) => (
											<div
												key={integration.id}
												className={`p-4 rounded-lg flex justify-between items-center ${getThemeClasses(
													"border border-slate-200 hover:border-indigo-200",
													"border border-slate-700 hover:border-indigo-500"
												)} transition-all duration-300`}
											>
												<div className="flex items-center">
													<div
														className={`w-10 h-10 rounded-lg ${getThemeClasses(
															"bg-indigo-100 text-indigo-600",
															"bg-indigo-900/60 text-indigo-300"
														)} flex items-center justify-center mr-3`}
													>
														{integration.icon}
													</div>
													<div>
														<h4
															className={`font-medium ${getThemeClasses(
																"text-slate-800",
																"text-white"
															)}`}
														>
															{integration.name}
														</h4>
														<p
															className={`text-xs ${getThemeClasses(
																"text-slate-500",
																"text-slate-400"
															)}`}
														>
															{integration.connected
																? `Connected${
																		integration.lastSync
																			? ` · Last synced ${integration.lastSync.toLocaleTimeString(
																					[],
																					{ hour: "2-digit", minute: "2-digit" }
																			  )}`
																			: ""
																  }`
																: "Not connected"}
														</p>
													</div>
												</div>

												<button
													onClick={() => toggleIntegration(integration.id)}
													className={`px-3 py-1 rounded-lg text-sm ${
														integration.connected
															? getThemeClasses(
																	"bg-red-100 text-red-700 hover:bg-red-200",
																	"bg-red-900/30 text-red-400 hover:bg-red-900/50"
															  )
															: getThemeClasses(
																	"bg-green-100 text-green-700 hover:bg-green-200",
																	"bg-green-900/30 text-green-400 hover:bg-green-900/50"
															  )
													} transition-colors`}
												>
													{integration.connected ? "Disconnect" : "Connect"}
												</button>
											</div>
										))}
									</div>

									<div
										className={`mt-6 pt-4 ${getThemeClasses(
											"border-t border-slate-200",
											"border-t border-slate-700"
										)}`}
									>
										<button
											onClick={() =>
												showComingSoon("Browse integration marketplace")
											}
											className={`w-full py-3 ${getThemeClasses(
												"border border-dashed border-slate-300 rounded-lg text-indigo-600 hover:bg-indigo-50",
												"border border-dashed border-slate-600 rounded-lg text-indigo-400 hover:bg-indigo-900/20"
											)} transition-colors text-sm flex items-center justify-center`}
										>
											<FaPlus className="mr-2" /> Browse more integrations
										</button>
									</div>
								</div>

								<div
									className={`${getThemeClasses(
										"bg-slate-50",
										"bg-slate-700"
									)} p-4 ${getThemeClasses(
										"border-t border-slate-200",
										"border-t border-slate-600"
									)} flex justify-between transition-colors duration-300`}
								>
									<button
										onClick={() => showComingSoon("Integration settings")}
										className={`text-sm ${getThemeClasses(
											"text-indigo-600 hover:text-indigo-800",
											"text-indigo-400 hover:text-indigo-300"
										)}`}
									>
										Advanced Settings
									</button>

									<button
										onClick={() => setShowIntegrations(false)}
										className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-colors shadow hover:shadow-md"
									>
										Done
									</button>
								</div>
							</div>
						</div>
					)}

					{showAddModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
							<div
								className={`${getThemeClasses(
									"bg-white",
									"bg-slate-800"
								)} rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transition-colors duration-300`}
							>
								<div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
									<h3 className="text-lg font-semibold">
										{editingBlock ? "Edit Time Block" : "Add New Time Block"}
									</h3>
									<button
										onClick={() => {
											setShowAddModal(false);
											setEditingBlock(null);
										}}
										className="text-white hover:text-indigo-200 transition-colors"
									>
										<FaTimes />
									</button>
								</div>

								<div className="p-4 max-h-[70vh] overflow-y-auto">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-4">
											<div>
												<label
													className={`block text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-1`}
												>
													Title*
												</label>
												<input
													type="text"
													className={`w-full p-2 ${getThemeClasses(
														"border border-slate-300 bg-white text-slate-900",
														"border border-slate-600 bg-slate-700 text-white"
													)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
													value={newBlock.title || ""}
													onChange={(e) =>
														setNewBlock({ ...newBlock, title: e.target.value })
													}
													placeholder="Block title"
												/>
											</div>

											<div>
												<label
													className={`block text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-1`}
												>
													Description
												</label>
												<textarea
													className={`w-full p-2 ${getThemeClasses(
														"border border-slate-300 bg-white text-slate-900",
														"border border-slate-600 bg-slate-700 text-white"
													)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-colors duration-300`}
													value={newBlock.description || ""}
													onChange={(e) =>
														setNewBlock({
															...newBlock,
															description: e.target.value,
														})
													}
													placeholder="Block description"
													rows={3}
												/>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div>
													<label
														className={`block text-sm font-medium ${getThemeClasses(
															"text-slate-700",
															"text-slate-300"
														)} mb-1`}
													>
														Start Time*
													</label>
													<input
														type="time"
														className={`w-full p-2 ${getThemeClasses(
															"border border-slate-300 bg-white text-slate-900",
															"border border-slate-600 bg-slate-700 text-white"
														)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
														value={
															newBlock.startTime
																? `${newBlock.startTime
																		.getHours()
																		.toString()
																		.padStart(2, "0")}:${newBlock.startTime
																		.getMinutes()
																		.toString()
																		.padStart(2, "0")}`
																: ""
														}
														onChange={(e) => {
															const [hours, minutes] = e.target.value
																.split(":")
																.map(Number);
															const newStartTime = new Date(selectedDate);
															newStartTime.setHours(hours, minutes, 0, 0);
															setNewBlock({
																...newBlock,
																startTime: newStartTime,
															});
														}}
													/>
												</div>

												<div>
													<label
														className={`block text-sm font-medium ${getThemeClasses(
															"text-slate-700",
															"text-slate-300"
														)} mb-1`}
													>
														End Time*
													</label>
													<input
														type="time"
														className={`w-full p-2 ${getThemeClasses(
															"border border-slate-300 bg-white text-slate-900",
															"border border-slate-600 bg-slate-700 text-white"
														)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
														value={
															newBlock.endTime
																? `${newBlock.endTime
																		.getHours()
																		.toString()
																		.padStart(2, "0")}:${newBlock.endTime
																		.getMinutes()
																		.toString()
																		.padStart(2, "0")}`
																: ""
														}
														onChange={(e) => {
															const [hours, minutes] = e.target.value
																.split(":")
																.map(Number);
															const newEndTime = new Date(selectedDate);
															newEndTime.setHours(hours, minutes, 0, 0);
															setNewBlock({ ...newBlock, endTime: newEndTime });
														}}
													/>
												</div>
											</div>

											<div>
												<label
													className={`block text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-1`}
												>
													Location
												</label>
												<input
													type="text"
													className={`w-full p-2 ${getThemeClasses(
														"border border-slate-300 bg-white text-slate-900",
														"border border-slate-600 bg-slate-700 text-white"
													)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
													value={newBlock.location || ""}
													onChange={(e) =>
														setNewBlock({
															...newBlock,
															location: e.target.value,
														})
													}
													placeholder="Location (optional)"
												/>
											</div>

											<div>
												<label
													className={`block text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-1`}
												>
													Category*
												</label>
												<div className="grid grid-cols-3 gap-2">
													{Object.keys(categoryColors).map((category) => (
														<button
															key={category}
															className={`p-2 rounded-lg text-sm capitalize transition-all ${
																newBlock.category === category
																	? "border-2 font-medium shadow-sm"
																	: getThemeClasses(
																			"border border-slate-300 hover:border-slate-400",
																			"border border-slate-600 hover:border-slate-500"
																	  )
															}`}
															style={{
																backgroundColor:
																	newBlock.category === category
																		? getThemeClasses(
																				`${
																					categoryColors[category as Category]
																						.light
																				}`,
																				`${
																					categoryColors[category as Category]
																						.bg
																				}20`
																		  )
																		: getThemeClasses("white", "#1e293b"),
																color: categoryColors[category as Category].bg,
																borderColor:
																	newBlock.category === category
																		? categoryColors[category as Category].bg
																		: "",
															}}
															onClick={() =>
																setNewBlock({
																	...newBlock,
																	category: category as Category,
																	color:
																		categoryColors[category as Category].bg,
																})
															}
														>
															{category}
														</button>
													))}
												</div>
											</div>

											<div>
												<label
													className={`block text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-1`}
												>
													Priority*
												</label>
												<div className="grid grid-cols-4 gap-2">
													{Object.keys(priorityColors).map((priority) => (
														<button
															key={priority}
															className={`p-2 rounded-lg text-sm capitalize transition-all ${
																newBlock.priority === priority
																	? "border-2 font-medium shadow-sm"
																	: getThemeClasses(
																			"border border-slate-300 hover:border-slate-400",
																			"border border-slate-600 hover:border-slate-500"
																	  )
															}`}
															style={{
																backgroundColor:
																	newBlock.priority === priority
																		? getThemeClasses(
																				priorityColors[priority as Priority]
																					.light,
																				`${
																					priorityColors[priority as Priority]
																						.bg
																				}20`
																		  )
																		: getThemeClasses("white", "#1e293b"),
																color: priorityColors[priority as Priority].bg,
																borderColor:
																	newBlock.priority === priority
																		? priorityColors[priority as Priority]
																				.border
																		: "",
															}}
															onClick={() =>
																setNewBlock({
																	...newBlock,
																	priority: priority as Priority,
																})
															}
														>
															{priority}
														</button>
													))}
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<div>
												<label
													className={`block text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-1`}
												>
													Tags
												</label>
												<div className="flex items-center">
													<input
														type="text"
														className={`flex-grow p-2 ${getThemeClasses(
															"border border-slate-300 bg-white text-slate-900",
															"border border-slate-600 bg-slate-700 text-white"
														)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
														value={newTag}
														onChange={(e) => setNewTag(e.target.value)}
														placeholder="Add tag"
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																addTag();
															}
														}}
													/>
													<button
														onClick={addTag}
														className="ml-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow hover:shadow-sm"
														aria-label="Add tag"
													>
														<FaPlus />
													</button>
												</div>

												<div className="flex flex-wrap gap-2 mt-2">
													{(newBlock.tags || []).map((tag, index) => (
														<div
															key={index}
															className={`flex items-center ${getThemeClasses(
																"bg-indigo-100 text-indigo-800",
																"bg-indigo-900/40 text-indigo-300"
															)} px-2 py-1 rounded-full text-sm`}
														>
															<span>{tag}</span>
															<button
																onClick={() => removeTag(tag)}
																className={`ml-1 ${getThemeClasses(
																	"text-indigo-600 hover:text-indigo-800",
																	"text-indigo-400 hover:text-indigo-200"
																)}`}
																aria-label="Remove tag"
															>
																<FaTimes className="text-xs" />
															</button>
														</div>
													))}
												</div>
											</div>

											<div>
												<label
													className={`block text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-1`}
												>
													Recurring
												</label>
												<select
													className={`w-full p-2 ${getThemeClasses(
														"border border-slate-300 bg-white text-slate-900",
														"border border-slate-600 bg-slate-700 text-white"
													)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300`}
													value={newBlock.recurringType || "none"}
													onChange={(e) =>
														setNewBlock({
															...newBlock,
															recurringType: e.target.value as
																| "none"
																| "daily"
																| "weekly"
																| "monthly",
														})
													}
												>
													<option value="none">None</option>
													<option value="daily">Daily</option>
													<option value="weekly">Weekly</option>
													<option value="monthly">Monthly</option>
												</select>
											</div>

											<div>
												<div className="flex items-center justify-between">
													<label
														className={`text-sm font-medium ${getThemeClasses(
															"text-slate-700",
															"text-slate-300"
														)}`}
													>
														Team Visibility
													</label>
													<label className="relative inline-flex items-center cursor-pointer">
														<input
															type="checkbox"
															className="sr-only peer"
															checked={newBlock.teamVisible}
															onChange={(e) =>
																setNewBlock({
																	...newBlock,
																	teamVisible: e.target.checked,
																})
															}
														/>
														<div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
													</label>
												</div>

												{newBlock.teamVisible && (
													<div className="mt-2">
														<label
															className={`block text-sm font-medium ${getThemeClasses(
																"text-slate-700",
																"text-slate-300"
															)} mb-1`}
														>
															Assign To
														</label>
														<div
															className={`max-h-32 overflow-y-auto ${getThemeClasses(
																"border border-slate-300",
																"border border-slate-600"
															)} rounded-lg p-2`}
														>
															{teamMembers.map((member) => (
																<label
																	key={member.id}
																	className={`flex items-center p-1 ${getThemeClasses(
																		"hover:bg-slate-50",
																		"hover:bg-slate-700"
																	)} rounded cursor-pointer`}
																>
																	<input
																		type="checkbox"
																		className="mr-2 text-indigo-600 focus:ring-indigo-500 rounded"
																		checked={(
																			newBlock.assignedTo || []
																		).includes(member.id)}
																		onChange={(e) => {
																			if (e.target.checked) {
																				setNewBlock({
																					...newBlock,
																					assignedTo: [
																						...(newBlock.assignedTo || []),
																						member.id,
																					],
																				});
																			} else {
																				setNewBlock({
																					...newBlock,
																					assignedTo: (
																						newBlock.assignedTo || []
																					).filter((id) => id !== member.id),
																				});
																			}
																		}}
																	/>
																	<div className="flex items-center">
																		<img
																			src={member.avatar}
																			alt={member.name}
																			className="w-6 h-6 rounded-full mr-2"
																		/>
																		<span className="text-sm">
																			{member.name}
																		</span>
																	</div>
																</label>
															))}
														</div>
													</div>
												)}
											</div>

											<div>
												<label
													className={`block text-sm font-medium ${getThemeClasses(
														"text-slate-700",
														"text-slate-300"
													)} mb-1`}
												>
													Notes
												</label>
												<textarea
													className={`w-full p-2 ${getThemeClasses(
														"border border-slate-300 bg-white text-slate-900",
														"border border-slate-600 bg-slate-700 text-white"
													)} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-colors duration-300`}
													value={newBlock.notes || ""}
													onChange={(e) =>
														setNewBlock({ ...newBlock, notes: e.target.value })
													}
													placeholder="Additional notes (private)"
													rows={2}
												/>
											</div>
										</div>
									</div>
								</div>

								<div
									className={`${getThemeClasses(
										"bg-slate-50",
										"bg-slate-700"
									)} p-4 ${getThemeClasses(
										"border-t border-slate-200",
										"border-t border-slate-600"
									)} flex justify-between transition-colors duration-300`}
								>
									<button
										onClick={() => {
											setShowAddModal(false);
											setEditingBlock(null);
										}}
										className={`px-4 py-2 ${getThemeClasses(
											"border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-200",
											"border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600"
										)} transition-colors`}
									>
										Cancel
									</button>

									<div className="flex gap-2">
										{editingBlock && (
											<button
												onClick={() => {
													deleteTimeBlock(editingBlock);
													setShowAddModal(false);
													setEditingBlock(null);
												}}
												className={`px-4 py-2 ${getThemeClasses(
													"bg-red-100 text-red-700 hover:bg-red-200",
													"bg-red-900/30 text-red-400 hover:bg-red-900/50"
												)} rounded-lg transition-colors flex items-center shadow hover:shadow-md`}
											>
												<FaTrash className="mr-2" />
												Delete
											</button>
										)}

										<button
											onClick={editingBlock ? saveEditedBlock : addTimeBlock}
											className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-colors shadow hover:shadow-md flex items-center"
										>
											<FaSave className="mr-2" />
											{editingBlock ? "Save Changes" : "Add Block"}
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{showScrollToTop && (
				<button
					onClick={scrollToTop}
					className="fixed bottom-6 right-6 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all hover:shadow-xl z-30 animate-fadeIn"
					aria-label="Scroll to top"
				>
					<FaAngleDoubleUp />
				</button>
			)}

			<footer
				className={`${getThemeClasses(
					"bg-gradient-to-r from-indigo-800 to-purple-900 text-white border-t border-indigo-900",
					"bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-t border-slate-800"
				)} mt-8 py-6 shadow-inner transition-colors duration-300`}
			>
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap -mx-4">
						<div className="w-full md:w-4/12 px-4 mb-6 md:mb-0">
							<div className="flex items-center mb-4">
								<div className="bg-white p-2 rounded-lg mr-3 shadow-md">
									<FaClock className="text-xl text-indigo-700" />
								</div>
								<div>
									<h3 className="text-xl font-bold text-white">
										TimeBlock Pro{" "}
										<span className="text-indigo-300 font-extrabold">
											Enterprise
										</span>
									</h3>
									<p className="text-indigo-200 text-sm">Version 2.5.0</p>
								</div>
							</div>

							<p className="text-indigo-200 mb-4 text-sm">
								Maximize your productivity with our powerful and intuitive time
								management solution.
							</p>

							<div className="flex space-x-4">
								<a
									href="#"
									className="text-white hover:text-indigo-300 transition-colors"
									aria-label="Twitter"
								>
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
									</svg>
								</a>
								<a
									href="#"
									className="text-white hover:text-indigo-300 transition-colors"
									aria-label="LinkedIn"
								>
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
									</svg>
								</a>
								<a
									href="#"
									className="text-white hover:text-indigo-300 transition-colors"
									aria-label="GitHub"
								>
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
											clipRule="evenodd"
										></path>
									</svg>
								</a>
							</div>
						</div>

						<div className="w-full md:w-2/12 px-4 mb-6 md:mb-0">
							<h4 className="text-lg font-semibold text-white mb-4">Company</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										About Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										Careers
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										Press
									</a>
								</li>
							</ul>
						</div>

						<div className="w-full md:w-2/12 px-4 mb-6 md:mb-0">
							<h4 className="text-lg font-semibold text-white mb-4">
								Resources
							</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										onClick={() => showComingSoon("Help Center")}
										className="text-indigo-200 hover:text-white transition-colors text-sm flex items-center"
									>
										<FaHeadset className="mr-1 text-xs" /> Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										onClick={() => showComingSoon("Documentation")}
										className="text-indigo-200 hover:text-white transition-colors text-sm flex items-center"
									>
										<FaClipboardList className="mr-1 text-xs" /> Documentation
									</a>
								</li>
								<li>
									<a
										href="#"
										onClick={() => showComingSoon("Webinars")}
										className="text-indigo-200 hover:text-white transition-colors text-sm flex items-center"
									>
										<FaLaptop className="mr-1 text-xs" /> Webinars
									</a>
								</li>
								<li>
									<a
										href="#"
										onClick={() => showComingSoon("API")}
										className="text-indigo-200 hover:text-white transition-colors text-sm flex items-center"
									>
										<FaCode className="mr-1 text-xs" /> API
									</a>
								</li>
							</ul>
						</div>

						<div className="w-full md:w-2/12 px-4 mb-6 md:mb-0">
							<h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										onClick={() => showComingSoon("Terms of Service")}
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href="#"
										onClick={() => showComingSoon("Privacy Policy")}
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										onClick={() => showComingSoon("Security")}
										className="text-indigo-200 hover:text-white transition-colors text-sm flex items-center"
									>
										<FaShieldAlt className="mr-1 text-xs" /> Security
									</a>
								</li>
								<li>
									<a
										href="#"
										onClick={() => showComingSoon("GDPR")}
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										GDPR
									</a>
								</li>
							</ul>
						</div>

						<div className="w-full md:w-2/12 px-4">
							<h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="mailto:support@timeblockpro.com"
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										support@timeblockpro.com
									</a>
								</li>
								<li>
									<a
										href="tel:+18005551234"
										className="text-indigo-200 hover:text-white transition-colors text-sm"
									>
										+1 (800) 555-1234
									</a>
								</li>
								<li className="text-indigo-200 text-sm">
									123 Productivity Ave
									<br />
									San Francisco, CA 94107
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-indigo-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
						<p className="text-indigo-300 text-sm mb-4 md:mb-0">
							&copy; 2025 TimeBlock Pro. All rights reserved.
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								onClick={() => showComingSoon("System Status")}
								className="text-indigo-300 hover:text-white text-sm transition-colors flex items-center"
							>
								<FaTachometerAlt className="mr-1 text-xs" /> System Status
							</a>
							<a
								href="#"
								onClick={() => toggleThemeMode()}
								className="text-indigo-300 hover:text-white text-sm transition-colors flex items-center"
							>
								{themeMode === "light" ? (
									<>
										<FaMoon className="mr-1 text-xs" /> Dark Mode
									</>
								) : (
									<>
										<FaSun className="mr-1 text-xs" /> Light Mode
									</>
								)}
							</a>
							<a
								href="#"
								onClick={() => showComingSoon("Accessibility")}
								className="text-indigo-300 hover:text-white text-sm transition-colors flex items-center"
							>
								Accessibility
							</a>
						</div>
					</div>
				</div>
			</footer>

			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme={themeMode}
				toastClassName="shadow-lg rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
				progressClassName="bg-indigo-600"
			/>

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-in-out;
				}

				@keyframes slideInRight {
					from {
						transform: translateX(30px);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
				.animate-slideInRight {
					animation: slideInRight 0.3s ease-in-out;
				}

				@keyframes slideInLeft {
					from {
						transform: translateX(-30px);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
				.animate-slideInLeft {
					animation: slideInLeft 0.3s ease-in-out;
				}

				@keyframes slideDown {
					from {
						transform: translateY(-10px);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}
				.animate-slideDown {
					animation: slideDown 0.3s ease-in-out;
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
				.animate-pulse {
					animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
				}

				.dark {
					color-scheme: dark;
				}

				.scrollbar-thin::-webkit-scrollbar {
					width: 6px;
				}

				.scrollbar-thin::-webkit-scrollbar-track {
					background: rgba(148, 163, 184, 0.1);
					border-radius: 10px;
				}

				.scrollbar-thin::-webkit-scrollbar-thumb {
					background: rgba(99, 102, 241, 0.5);
					border-radius: 10px;
				}

				.scrollbar-thin::-webkit-scrollbar-thumb:hover {
					background: rgba(99, 102, 241, 0.7);
				}

				.dark .scrollbar-thin::-webkit-scrollbar-track {
					background: rgba(51, 65, 85, 0.3);
				}

				.dark .scrollbar-thin::-webkit-scrollbar-thumb {
					background: rgba(99, 102, 241, 0.6);
				}

				.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
					background: rgba(99, 102, 241, 0.8);
				}
			`}</style>
		</div>
	);
};

export default TimeBlockingPlannerEnterprise;
