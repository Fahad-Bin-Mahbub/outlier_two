"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserRoundPlus, Bell } from "lucide-react";

interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	role: string;
	status: "online" | "away" | "offline";
	lastSeen?: string;
}

interface FileVersion {
	id: string;
	version: string;
	date: string;
	author: string;
	size: string;
	changes: string;
	downloadUrl: string;
	thumbnail: string;
}

interface Comment {
	id: string;
	author: User;
	message: string;
	timestamp: string;
	replies?: Comment[];
}

interface FileItem {
	id: string;
	name: string;
	type: "pdf" | "figma" | "sketch" | "image" | "video" | "document";
	size: string;
	lastModified: string;
	thumbnail: string;
	previewUrl: string;
	downloadUrl: string;
	versions: FileVersion[];
	downloadPermission: "view" | "download" | "edit";
	syncStatus: "synced" | "syncing" | "offline" | "error";
	watermarkEnabled: boolean;
	tags: string[];
	comments: Comment[];
	sharedWith: User[];
	uploadedBy: User;
}

interface WorkflowStep {
	id: string;
	name: string;
	status: "completed" | "pending" | "in-progress" | "overdue";
	assignee: User;
	dueDate: string;
	description: string;
	completedAt?: string;
}

interface Project {
	id: string;
	name: string;
	description: string;
	coverImage: string;
	progress: number;
	files: FileItem[];
	workflow: WorkflowStep[];
	collaborators: User[];
	lastActivity: string;
	color: string;
	priority: "low" | "medium" | "high" | "urgent";
	dueDate: string;
	status: "active" | "completed" | "on-hold" | "archived";
}

interface Notification {
	id: string;
	type: "approval" | "comment" | "upload" | "share" | "mention" | "deadline";
	title: string;
	message: string;
	time: string;
	read: boolean;
	projectId: string;
	actionRequired: boolean;
	avatar?: string;
}

const FilePortalApp: React.FC = () => {
	const [currentUser] = useState<User>({
		id: "1",
		name: "Sarah Johnson",
		email: "sarah@company.com",
		avatar:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=2417&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		role: "Creative Director",
		status: "online",
	});

	const [projects, setProjects] = useState<Project[]>([
		{
			id: "1",
			name: "Brand Identity 2024",
			description:
				"Complete brand overhaul for Q2 launch with new visual identity",
			coverImage:
				"https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&h=350&fit=crop",
			progress: 78,
			color: "from-violet-600 via-purple-600 to-indigo-600",
			lastActivity: "12 minutes ago",
			priority: "high",
			dueDate: "June 15, 2024",
			status: "active",
			collaborators: [
				{
					id: "2",
					name: "Marcus Chen",
					email: "marcus@company.com",
					avatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					role: "Senior Designer",
					status: "online",
				},
				{
					id: "3",
					name: "Elena Rodriguez",
					email: "elena@company.com",
					avatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					role: "Brand Strategist",
					status: "away",
				},
				{
					id: "4",
					name: "David Kim",
					email: "david@company.com",
					avatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					role: "Art Director",
					status: "online",
				},
			],
			files: [
				{
					id: "1",
					name: "Brand_Guidelines_Final_v4.2.pdf",
					type: "pdf",
					size: "3.8 MB",
					lastModified: "12 minutes ago",
					thumbnail:
						"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop",
					previewUrl:
						"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
					downloadUrl: "#download-1",
					downloadPermission: "download",
					syncStatus: "synced",
					watermarkEnabled: true,
					tags: ["guidelines", "final", "approved"],
					comments: [],
					sharedWith: [],
					uploadedBy: {
						id: "2",
						name: "Marcus Chen",
						email: "marcus@company.com",
						avatar:
							"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
						role: "Senior Designer",
						status: "online",
					},
					versions: [
						{
							id: "1a",
							version: "4.2",
							date: "12 minutes ago",
							author: "Marcus Chen",
							size: "3.8 MB",
							changes: "Final color adjustments and typography refinements",
							downloadUrl: "#v4.2",
							thumbnail:
								"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=150&fit=crop",
						},
						{
							id: "1b",
							version: "4.1",
							date: "2 hours ago",
							author: "Elena Rodriguez",
							size: "3.6 MB",
							changes: "Updated brand messaging and tone guidelines",
							downloadUrl: "#v4.1",
							thumbnail:
								"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=150&fit=crop",
						},
						{
							id: "1c",
							version: "4.0",
							date: "1 day ago",
							author: "Sarah Johnson",
							size: "3.4 MB",
							changes: "Major revision with new logo concepts",
							downloadUrl: "#v4.0",
							thumbnail:
								"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=150&fit=crop",
						},
					],
				},
				{
					id: "2",
					name: "Logo_Concepts_Collection.figma",
					type: "figma",
					size: "1.2 MB",
					lastModified: "1 hour ago",
					thumbnail:
						"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
					previewUrl:
						"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
					downloadUrl: "#download-2",
					downloadPermission: "edit",
					syncStatus: "syncing",
					watermarkEnabled: false,
					tags: ["logo", "concepts", "figma"],
					comments: [],
					sharedWith: [],
					uploadedBy: {
						id: "2",
						name: "Marcus Chen",
						email: "marcus@company.com",
						avatar:
							"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
						role: "Senior Designer",
						status: "online",
					},
					versions: [
						{
							id: "2a",
							version: "3.1",
							date: "1 hour ago",
							author: "Marcus Chen",
							size: "1.2 MB",
							changes: "Added 5 new logo variations with gradient treatments",
							downloadUrl: "#v3.1",
							thumbnail:
								"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=150&fit=crop",
						},
					],
				},
				{
					id: "3",
					name: "Brand_Photography_Pack.zip",
					type: "image",
					size: "45.6 MB",
					lastModified: "3 hours ago",
					thumbnail:
						"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop",
					previewUrl:
						"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
					downloadUrl: "#download-3",
					downloadPermission: "view",
					syncStatus: "offline",
					watermarkEnabled: true,
					tags: ["photography", "brand", "assets"],
					comments: [],
					sharedWith: [],
					uploadedBy: {
						id: "4",
						name: "David Kim",
						email: "david@company.com",
						avatar:
							"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
						role: "Art Director",
						status: "online",
					},
					versions: [
						{
							id: "3a",
							version: "1.0",
							date: "3 hours ago",
							author: "David Kim",
							size: "45.6 MB",
							changes: "Initial upload with 50+ brand photography assets",
							downloadUrl: "#v1.0",
							thumbnail:
								"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=150&fit=crop",
						},
					],
				},
			],
			workflow: [
				{
					id: "1",
					name: "Initial Concepts",
					status: "completed",
					assignee: {
						id: "2",
						name: "Marcus Chen",
						email: "marcus@company.com",
						avatar:
							"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
						role: "Senior Designer",
						status: "online",
					},
					dueDate: "May 15",
					description: "Create initial brand concepts and mood boards",
					completedAt: "May 12",
				},
				{
					id: "2",
					name: "Stakeholder Review",
					status: "completed",
					assignee: currentUser,
					dueDate: "May 22",
					description: "Present concepts to stakeholders for feedback",
					completedAt: "May 20",
				},
				{
					id: "3",
					name: "Design Refinement",
					status: "in-progress",
					assignee: {
						id: "2",
						name: "Marcus Chen",
						email: "marcus@company.com",
						avatar:
							"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
						role: "Senior Designer",
						status: "online",
					},
					dueDate: "May 28",
					description: "Refine selected concepts based on feedback",
				},
				{
					id: "4",
					name: "Final Implementation",
					status: "pending",
					assignee: {
						id: "4",
						name: "David Kim",
						email: "david@company.com",
						avatar:
							"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
						role: "Art Director",
						status: "online",
					},
					dueDate: "June 5",
					description: "Implement final brand across all touchpoints",
				},
			],
		},
		{
			id: "2",
			name: "Mobile App UX Redesign",
			description: "Complete mobile application user experience overhaul",
			coverImage:
				"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=350&fit=crop",
			progress: 45,
			color: "from-emerald-500 via-teal-500 to-cyan-500",
			lastActivity: "2 days ago",
			priority: "medium",
			dueDate: "July 20, 2024",
			status: "active",
			collaborators: [
				{
					id: "5",
					name: "Zoe Martinez",
					email: "zoe@company.com",
					avatar:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
					role: "UX Designer",
					status: "online",
				},
				{
					id: "6",
					name: "Ryan Foster",
					email: "ryan@company.com",
					avatar:
						"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
					role: "Product Manager",
					status: "away",
				},
			],
			files: [
				{
					id: "4",
					name: "User_Research_Insights.pdf",
					type: "pdf",
					size: "2.4 MB",
					lastModified: "2 days ago",
					thumbnail:
						"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop",
					previewUrl:
						"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
					downloadUrl: "#download-4",
					downloadPermission: "download",
					syncStatus: "synced",
					watermarkEnabled: false,
					tags: ["research", "insights", "ux"],
					comments: [],
					sharedWith: [],
					uploadedBy: {
						id: "5",
						name: "Zoe Martinez",
						email: "zoe@company.com",
						avatar:
							"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
						role: "UX Designer",
						status: "online",
					},
					versions: [
						{
							id: "4a",
							version: "2.0",
							date: "2 days ago",
							author: "Zoe Martinez",
							size: "2.4 MB",
							changes: "Added user journey maps and pain point analysis",
							downloadUrl: "#v2.0",
							thumbnail:
								"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=150&fit=crop",
						},
					],
				},
			],
			workflow: [
				{
					id: "5",
					name: "User Research",
					status: "completed",
					assignee: {
						id: "5",
						name: "Zoe Martinez",
						email: "zoe@company.com",
						avatar:
							"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
						role: "UX Designer",
						status: "online",
					},
					dueDate: "May 10",
					description: "Conduct user interviews and usability testing",
					completedAt: "May 8",
				},
				{
					id: "6",
					name: "Wireframe Creation",
					status: "in-progress",
					assignee: {
						id: "5",
						name: "Zoe Martinez",
						email: "zoe@company.com",
						avatar:
							"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
						role: "UX Designer",
						status: "online",
					},
					dueDate: "June 1",
					description: "Create low and high-fidelity wireframes",
				},
				{
					id: "7",
					name: "Prototype Testing",
					status: "pending",
					assignee: {
						id: "6",
						name: "Ryan Foster",
						email: "ryan@company.com",
						avatar:
							"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
						role: "Product Manager",
						status: "away",
					},
					dueDate: "June 15",
					description: "Test interactive prototypes with users",
				},
			],
		},
		{
			id: "3",
			name: "Marketing Campaign Assets",
			description: "Q3 digital marketing campaign creative development",
			coverImage:
				"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=350&fit=crop",
			progress: 92,
			color: "from-rose-500 via-pink-500 to-purple-500",
			lastActivity: "5 hours ago",
			priority: "urgent",
			dueDate: "May 30, 2024",
			status: "active",
			collaborators: [
				{
					id: "7",
					name: "Alex Thompson",
					email: "alex@company.com",
					avatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					role: "Creative Lead",
					status: "online",
				},
			],
			files: [],
			workflow: [
				{
					id: "8",
					name: "Campaign Strategy",
					status: "completed",
					assignee: {
						id: "7",
						name: "Alex Thompson",
						email: "alex@company.com",
						avatar:
							"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
						role: "Creative Lead",
						status: "online",
					},
					dueDate: "May 20",
					description: "Develop campaign strategy and messaging",
					completedAt: "May 18",
				},
			],
		},
	]);

	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: "1",
			type: "approval",
			title: "Approval Required",
			message: "Brand Guidelines v4.2 needs your final approval",
			time: "12 minutes ago",
			read: false,
			projectId: "1",
			actionRequired: true,
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		},
		{
			id: "2",
			type: "comment",
			title: "New Comment",
			message:
				'Marcus commented on Logo Concepts: "Love the gradient approach!"',
			time: "1 hour ago",
			read: false,
			projectId: "1",
			actionRequired: false,
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		},
		{
			id: "3",
			type: "upload",
			title: "File Updated",
			message: "Brand Photography Pack uploaded by David Kim",
			time: "3 hours ago",
			read: false,
			projectId: "1",
			actionRequired: false,
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		{
			id: "4",
			type: "deadline",
			title: "Deadline Reminder",
			message: "Marketing Campaign Assets due in 3 days",
			time: "5 hours ago",
			read: true,
			projectId: "3",
			actionRequired: true,
		},
		{
			id: "5",
			type: "mention",
			title: "You were mentioned",
			message: "Elena mentioned you in Brand Identity workflow",
			time: "1 day ago",
			read: true,
			projectId: "1",
			actionRequired: false,
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
		},
	]);

	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
	const [showVersionComparison, setShowVersionComparison] = useState(false);
	const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showCollaborators, setShowCollaborators] = useState(false);
	const [showFileUpload, setShowFileUpload] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
	const [isOfflineMode, setIsOfflineMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<{
		files: FileItem[];
		projects: Project[];
	}>({ files: [], projects: [] });
	const [showSettings, setShowSettings] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
	const [filterType, setFilterType] = useState<
		"all" | "pdf" | "figma" | "image"
	>("all");
	const [loading, setLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [connectionStatus, setConnectionStatus] = useState<
		"online" | "offline" | "slow"
	>("online");
	const [activeTab, setActiveTab] = useState<
		"home" | "files" | "teams" | "profile"
	>("home");
	const [showComingSoon, setShowComingSoon] = useState(false);
	const [comingSoonFeature, setComingSoonFeature] = useState("");

	const cardRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [dragOffset, setDragOffset] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);

	useEffect(() => {
		if (searchQuery.trim()) {
			const allFiles = projects.flatMap((p) => p.files);
			const filteredFiles = allFiles.filter(
				(file) =>
					file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					file.tags.some((tag) =>
						tag.toLowerCase().includes(searchQuery.toLowerCase())
					)
			);
			const filteredProjects = projects.filter(
				(project) =>
					project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					project.description.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setSearchResults({ files: filteredFiles, projects: filteredProjects });
		} else {
			setSearchResults({ files: [], projects: [] });
		}
	}, [searchQuery, projects]);

	useEffect(() => {
		const interval = setInterval(() => {
			const statuses: ("online" | "offline" | "slow")[] = [
				"online",
				"online",
				"online",
				"slow",
				"online",
			];
			setConnectionStatus(
				statuses[Math.floor(Math.random() * statuses.length)]
			);
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		setIsDragging(true);
		setStartX(e.touches[0].clientX);
		setDragOffset(0);
	}, []);

	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!isDragging) return;
			const currentX = e.touches[0].clientX;
			const diff = currentX - startX;
			setDragOffset(diff);

			if (cardRef.current) {
				cardRef.current.style.transform = `translateX(${diff}px) scale(${
					1 - Math.abs(diff) * 0.0005
				})`;
				cardRef.current.style.opacity = `${1 - Math.abs(diff) * 0.001}`;
			}
		},
		[isDragging, startX]
	);

	const handleTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			if (!isDragging) return;
			setIsDragging(false);

			const diff = dragOffset;
			const threshold = 100;

			if (Math.abs(diff) > threshold) {
				if (diff > 0 && currentProjectIndex > 0) {
					setCurrentProjectIndex((prev) => prev - 1);
				} else if (diff < 0 && currentProjectIndex < projects.length - 1) {
					setCurrentProjectIndex((prev) => prev + 1);
				}
			}

			if (cardRef.current) {
				cardRef.current.style.transform = "translateX(0) scale(1)";
				cardRef.current.style.opacity = "1";
			}
			setDragOffset(0);
		},
		[isDragging, dragOffset, currentProjectIndex, projects.length]
	);

	const toggleWatermark = useCallback(
		(fileId: string) => {
			setProjects((prev) => {
				const newProjects = prev.map((project) => ({
					...project,
					files: project.files.map((file) =>
						file.id === fileId
							? { ...file, watermarkEnabled: !file.watermarkEnabled }
							: file
					),
				}));

				if (selectedFile && selectedFile.id === fileId) {
					const updatedProject = newProjects.find((project) =>
						project.files.some((file) => file.id === fileId)
					);

					if (updatedProject) {
						const updatedFile = updatedProject.files.find(
							(file) => file.id === fileId
						);
						if (updatedFile) {
							setSelectedFile(updatedFile);
						}
					}
				}

				return newProjects;
			});

			setTimeout(() => {}, 100);
		},
		[selectedFile]
	);

	const updateDownloadPermission = useCallback(
		(fileId: string, permission: "view" | "download" | "edit") => {
			setProjects((prev) =>
				prev.map((project) => ({
					...project,
					files: project.files.map((file) =>
						file.id === fileId
							? { ...file, downloadPermission: permission }
							: file
					),
				}))
			);
		},
		[]
	);

	const markNotificationAsRead = useCallback((notificationId: string) => {
		setNotifications((prev) =>
			prev.map((notif) =>
				notif.id === notificationId ? { ...notif, read: true } : notif
			)
		);
	}, []);

	const markAllNotificationsAsRead = useCallback(() => {
		setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
	}, []);

	const handleFileUpload = useCallback(
		(files: FileList | null) => {
			if (!files || !selectedProject || files.length === 0) return;

			if (loading) return;

			setLoading(true);
			setUploadProgress(0);

			let intervalId: NodeJS.Timeout;

			let fileAdded = false;

			intervalId = setInterval(() => {
				setUploadProgress((prev) => {
					const newProgress = prev + Math.random() * 15;

					if (newProgress >= 100 && !fileAdded) {
						fileAdded = true;

						clearInterval(intervalId);

						const fileName = files[0].name;
						const fileExtension =
							fileName.split(".").pop()?.toLowerCase() || "";
						let fileType:
							| "pdf"
							| "figma"
							| "sketch"
							| "image"
							| "video"
							| "document" = "document";

						if (fileExtension === "pdf") fileType = "pdf";
						else if (fileExtension === "fig") fileType = "figma";
						else if (fileExtension === "sketch") fileType = "sketch";
						else if (
							["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)
						)
							fileType = "image";
						else if (["mp4", "mov", "avi", "webm"].includes(fileExtension))
							fileType = "video";

						const fileId = `file-${Date.now()}-${Math.random()
							.toString(36)
							.substring(2, 9)}`;

						const newFile: FileItem = {
							id: fileId,
							name: fileName,
							type: fileType,
							size: `${(files[0].size / 1024 / 1024).toFixed(1)} MB`,
							lastModified: "Just now",
							thumbnail:
								"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop",
							previewUrl:
								"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
							downloadUrl: `#download-${fileId}`,
							downloadPermission: "download",
							syncStatus: "synced",
							watermarkEnabled: false,
							tags: ["new"],
							comments: [],
							sharedWith: [],
							uploadedBy: currentUser,
							versions: [
								{
									id: `v-${fileId}`,
									version: "1.0",
									date: "Just now",
									author: currentUser.name,
									size: `${(files[0].size / 1024 / 1024).toFixed(1)} MB`,
									changes: "Initial upload",
									downloadUrl: `#download-${fileId}`,
									thumbnail:
										"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=150&fit=crop",
								},
							],
						};

						const projectIndex = projects.findIndex(
							(p) => p.id === selectedProject.id
						);

						if (projectIndex !== -1) {
							const newProjects = [...projects];
							newProjects[projectIndex] = {
								...newProjects[projectIndex],
								files: [...newProjects[projectIndex].files, newFile],
							};

							setProjects(newProjects);

							setSelectedProject(newProjects[projectIndex]);
						}

						setLoading(false);
						setShowFileUpload(false);

						return 100;
					}

					return newProgress < 100 ? newProgress : 100;
				});
			}, 200);

			return () => {
				if (intervalId) clearInterval(intervalId);
			};
		},
		[selectedProject, currentUser, projects, loading]
	);

	const downloadFile = useCallback((file: FileItem) => {
		if (file.downloadPermission === "view") return;

		setLoading(true);

		setTimeout(() => {
			const fileContent = `This is a placeholder for ${file.name}
----------------------------------------------
File Information:
Name: ${file.name}
Size: ${file.size}
Type: ${file.type}
Last Modified: ${file.lastModified}
Uploaded By: ${file.uploadedBy.name}
----------------------------------------------
This is a demo file download from the File Portal App.
In a production environment, this would be the actual file content.
`;

			const blob = new Blob([fileContent], { type: "text/plain" });

			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = file.name;
			document.body.appendChild(a);

			a.click();

			setTimeout(() => {
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
				setLoading(false);
			}, 100);
		}, 1000);
	}, []);

	const shareFile = useCallback((file: FileItem) => {
		navigator
			.share?.({
				title: file.name,
				text: `Check out this file: ${file.name}`,
				url: file.downloadUrl,
			})
			.catch(() => {
				navigator.clipboard?.writeText(file.downloadUrl);
			});
	}, []);

	const handleTabChange = useCallback(
		(tab: "home" | "files" | "teams" | "profile") => {
			if (tab === "home") {
				setActiveTab(tab);
				setSelectedProject(null);
				setSelectedFile(null);
			} else if (tab === "profile") {
				setActiveTab(tab);
				setShowProfile(true);
			} else {
				setComingSoonFeature(
					tab === "files" ? "File Explorer" : "Team Collaboration"
				);
				setShowComingSoon(true);
			}
		},
		[]
	);

	const unreadNotifications = notifications.filter((n) => !n.read).length;
	const urgentNotifications = notifications.filter(
		(n) => !n.read && n.actionRequired
	).length;
	const totalFiles = projects.reduce(
		(acc, project) => acc + project.files.length,
		0
	);
	const completedProjects = projects.filter(
		(p) => p.status === "completed"
	).length;

	const getSyncStatusIcon = (status: string) => {
		switch (status) {
			case "synced":
				return { icon: "✓", color: "text-green-500", bg: "bg-green-100" };
			case "syncing":
				return { icon: "↻", color: "text-blue-500", bg: "bg-blue-100" };
			case "offline":
				return { icon: "⚡", color: "text-orange-500", bg: "bg-orange-100" };
			case "error":
				return { icon: "⚠", color: "text-red-500", bg: "bg-red-100" };
			default:
				return { icon: "?", color: "text-gray-500", bg: "bg-gray-100" };
		}
	};

	const getFileTypeIcon = (type: string) => {
		switch (type) {
			case "pdf":
				return { icon: "📄", color: "text-red-500" };
			case "figma":
				return { icon: "🎨", color: "text-purple-500" };
			case "sketch":
				return { icon: "✏️", color: "text-orange-500" };
			case "image":
				return { icon: "🖼️", color: "text-green-500" };
			case "video":
				return { icon: "🎬", color: "text-blue-500" };
			default:
				return { icon: "📁", color: "text-gray-500" };
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent":
				return "bg-red-500";
			case "high":
				return "bg-orange-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "text-green-600 bg-green-100";
			case "in-progress":
				return "text-blue-600 bg-blue-100";
			case "overdue":
				return "text-red-600 bg-red-100";
			case "pending":
				return "text-gray-600 bg-gray-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	if (selectedFile) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
				{}
				<div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
					<div className="px-3 py-3 sm:px-4 sm:py-4">
						<div className="flex items-center justify-between">
							<button
								onClick={() => setSelectedFile(null)}
								className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
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

							<div className="flex-1 mx-2 sm:mx-4 text-center">
								<h1 className="text-xs sm:text-lg font-bold text-gray-900 truncate">
									{selectedFile.name}
								</h1>
								<p className="text-xs sm:text-sm text-gray-600">
									{selectedFile.size} • {selectedFile.lastModified}
								</p>
							</div>

							<div className="flex items-center space-x-1 sm:space-x-2">
								<button
									onClick={() => setShowVersionComparison(true)}
									className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									<svg
										className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
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
								</button>
								<button
									onClick={() => shareFile(selectedFile)}
									className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									<svg
										className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="px-3 py-4 sm:px-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
					{}
					<div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
						<div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
							<img
								src={selectedFile.previewUrl}
								alt={selectedFile.name}
								className={`w-full h-48 sm:h-64 object-cover transition-all duration-500 ${
									selectedFile.watermarkEnabled ? "blur-sm" : ""
								}`}
							/>
							{selectedFile.watermarkEnabled && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
									<div className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg font-semibold text-xs sm:text-sm">
										🔒 CONFIDENTIAL WATERMARK
									</div>
								</div>
							)}
							<div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center space-x-1 sm:space-x-2">
								<div
									className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
										getSyncStatusIcon(selectedFile.syncStatus).bg
									} ${getSyncStatusIcon(selectedFile.syncStatus).color}`}
								>
									{getSyncStatusIcon(selectedFile.syncStatus).icon}{" "}
									{selectedFile.syncStatus}
								</div>
								<div
									className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
										getFileTypeIcon(selectedFile.type).color
									} bg-white/90`}
								>
									{getFileTypeIcon(selectedFile.type).icon}{" "}
									{selectedFile.type.toUpperCase()}
								</div>
							</div>
						</div>
					</div>

					{}
					<div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
						<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
							File Settings
						</h3>

						<div className="space-y-3 sm:space-y-4">
							<div className="flex items-center justify-between p-3 sm:p-4 bg-white/50 rounded-xl sm:rounded-2xl">
								<div className="flex items-center space-x-2 sm:space-x-3">
									<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
										🔒
									</div>
									<div>
										<h4 className="font-semibold text-gray-900 text-sm sm:text-base">
											Watermark Protection
										</h4>
										<p className="text-xs sm:text-sm text-gray-600">
											Add confidential watermark to preview
										</p>
									</div>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={selectedFile.watermarkEnabled}
										onChange={() => toggleWatermark(selectedFile.id)}
										className="sr-only peer"
									/>
									<div className="w-10 h-6 sm:w-14 sm:h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-1 after:left-[2px] sm:after:left-1 after:bg-white after:rounded-full after:h-5 sm:after:h-6 after:w-5 sm:after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 shadow-lg"></div>
								</label>
							</div>

							<div className="p-3 sm:p-4 bg-white/50 rounded-xl sm:rounded-2xl">
								<div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
									<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
										👥
									</div>
									<div>
										<h4 className="font-semibold text-gray-900 text-sm sm:text-base">
											Download Permissions
										</h4>
										<p className="text-xs sm:text-sm text-gray-600">
											Control how others can access this file
										</p>
									</div>
								</div>
								<select
									value={selectedFile.downloadPermission}
									onChange={(e) =>
										updateDownloadPermission(
											selectedFile.id,
											e.target.value as "view" | "download" | "edit"
										)
									}
									className="w-full p-2 sm:p-3 bg-white/80 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
								>
									<option value="view">
										👁️ View Only - Preview without download
									</option>
									<option value="download">
										⬇️ Download - Can save to device
									</option>
									<option value="edit">
										✏️ Edit - Full access and modifications
									</option>
								</select>
							</div>
						</div>
					</div>

					{}
					<div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
						<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
							File Details
						</h3>

						<div className="grid grid-cols-2 gap-3 sm:gap-4">
							<div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl">
								<div className="text-xl sm:text-2xl font-bold text-blue-600">
									{selectedFile.size}
								</div>
								<div className="text-xs sm:text-sm text-gray-600">
									File Size
								</div>
							</div>
							<div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl">
								<div className="text-xl sm:text-2xl font-bold text-purple-600">
									{selectedFile.versions.length}
								</div>
								<div className="text-xs sm:text-sm text-gray-600">Versions</div>
							</div>
						</div>

						<div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
							<div className="flex justify-between items-center p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
								<span className="text-xs sm:text-sm font-medium text-gray-700">
									Uploaded by
								</span>
								<div className="flex items-center space-x-2">
									<img
										src={selectedFile.uploadedBy.avatar}
										alt={selectedFile.uploadedBy.name}
										className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
									/>
									<span className="text-xs sm:text-sm font-semibold text-gray-900">
										{selectedFile.uploadedBy.name}
									</span>
								</div>
							</div>
							<div className="flex justify-between items-center p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
								<span className="text-xs sm:text-sm font-medium text-gray-700">
									Last Modified
								</span>
								<span className="text-xs sm:text-sm font-semibold text-gray-900">
									{selectedFile.lastModified}
								</span>
							</div>
							<div className="flex justify-between items-center p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
								<span className="text-xs sm:text-sm font-medium text-gray-700">
									File Type
								</span>
								<span className="text-xs sm:text-sm font-semibold text-gray-900">
									{selectedFile.type.toUpperCase()}
								</span>
							</div>
						</div>

						{selectedFile.tags.length > 0 && (
							<div className="mt-3 sm:mt-4">
								<div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
									Tags
								</div>
								<div className="flex flex-wrap gap-1 sm:gap-2">
									{selectedFile.tags.map((tag, index) => (
										<span
											key={index}
											className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full"
										>
											#{tag}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{}
					{selectedFile.versions.length > 0 && (
						<div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
							<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
								Version History
							</h3>

							<div className="space-y-2 sm:space-y-3">
								{selectedFile.versions.map((version, index) => (
									<div
										key={version.id}
										className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/50 rounded-xl sm:rounded-2xl hover:bg-white/70 transition-all duration-200"
									>
										<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
											v{version.version}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<h4 className="text-xs sm:text-sm font-semibold text-gray-900">
													Version {version.version}
												</h4>
												<span className="text-xs text-gray-500">
													{version.date}
												</span>
											</div>
											<p className="text-xs sm:text-sm text-gray-700 mb-2">
												{version.changes}
											</p>
											<div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500">
												<span>by {version.author}</span>
												<span>•</span>
												<span>{version.size}</span>
											</div>
										</div>
										<button
											onClick={() =>
												downloadFile({
													...selectedFile,
													downloadUrl: version.downloadUrl,
												})
											}
											className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 hover:scale-105"
										>
											⬇️
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{}
					<div className="grid grid-cols-2 gap-3 sm:gap-4">
						<button
							onClick={() => downloadFile(selectedFile)}
							disabled={selectedFile.downloadPermission === "view" || loading}
							className={`relative overflow-hidden py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
								selectedFile.downloadPermission === "view" || loading
									? "bg-gray-400 cursor-not-allowed"
									: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
							}`}
						>
							{loading ? (
								<div className="flex items-center justify-center space-x-1 sm:space-x-2">
									<div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Downloading...</span>
								</div>
							) : (
								<>
									{selectedFile.downloadPermission === "view"
										? "👁️ View Only"
										: "⬇️ Download"}
								</>
							)}
						</button>

						<button
							onClick={() => shareFile(selectedFile)}
							className="py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold bg-white/80 hover:bg-white text-gray-700 text-xs sm:text-sm border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
						>
							📤 Share
						</button>
					</div>
				</div>

				{}
				{showVersionComparison && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-end animate-fade-in">
						<div className="w-full bg-white rounded-t-2xl sm:rounded-t-3xl max-h-[85vh] overflow-y-auto transform animate-slide-up">
							<div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-gray-200">
								<div className="flex items-center justify-between">
									<h3 className="text-xl sm:text-2xl font-bold text-gray-900">
										Version Comparison
									</h3>
									<button
										onClick={() => setShowVersionComparison(false)}
										className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
									>
										<svg
											className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
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

							<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
								<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
									<label className="text-base sm:text-lg font-semibold text-gray-900 block mb-3 sm:mb-4">
										Compare Versions
									</label>
									<input
										type="range"
										min="0"
										max={Math.max(0, selectedFile.versions.length - 1)}
										value={currentVersionIndex}
										onChange={(e) =>
											setCurrentVersionIndex(parseInt(e.target.value))
										}
										className="w-full h-2 sm:h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
										style={{
											background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${
												(currentVersionIndex /
													Math.max(1, selectedFile.versions.length - 1)) *
												100
											}%, #e5e7eb ${
												(currentVersionIndex /
													Math.max(1, selectedFile.versions.length - 1)) *
												100
											}%, #e5e7eb 100%)`,
										}}
									/>
									<div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
										<span>
											v
											{selectedFile.versions[selectedFile.versions.length - 1]
												?.version || "1.0"}{" "}
											(Oldest)
										</span>
										<span>
											v{selectedFile.versions[0]?.version || "1.0"} (Latest)
										</span>
									</div>
								</div>

								{selectedFile.versions[currentVersionIndex] && (
									<div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
										<div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
											<div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-base">
												v{selectedFile.versions[currentVersionIndex].version}
											</div>
											<div>
												<h4 className="text-base sm:text-xl font-bold text-gray-900">
													Version{" "}
													{selectedFile.versions[currentVersionIndex].version}
												</h4>
												<p className="text-xs sm:text-sm text-gray-600">
													{selectedFile.versions[currentVersionIndex].date}
												</p>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
											<div className="p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
												<div className="text-xs sm:text-sm text-gray-600">
													Author
												</div>
												<div className="text-xs sm:text-sm font-semibold text-gray-900">
													{selectedFile.versions[currentVersionIndex].author}
												</div>
											</div>
											<div className="p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
												<div className="text-xs sm:text-sm text-gray-600">
													File Size
												</div>
												<div className="text-xs sm:text-sm font-semibold text-gray-900">
													{selectedFile.versions[currentVersionIndex].size}
												</div>
											</div>
										</div>

										<div className="p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
											<div className="text-xs sm:text-sm font-medium text-blue-800 mb-1 sm:mb-2">
												Changes Made
											</div>
											<p className="text-xs sm:text-sm text-blue-700">
												{selectedFile.versions[currentVersionIndex].changes}
											</p>
										</div>

										<div className="mt-3 sm:mt-4 flex space-x-2 sm:space-x-3">
											<button
												onClick={() =>
													downloadFile({
														...selectedFile,
														downloadUrl:
															selectedFile.versions[currentVersionIndex]
																.downloadUrl,
													})
												}
												className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
											>
												⬇️ Download This Version
											</button>
											<button className="px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105">
												👁️ Preview
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	if (selectedProject && !selectedFile) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
				{}
				<div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
					<div className="px-3 py-3 sm:px-4 sm:py-4">
						<div className="flex items-center justify-between">
							<button
								onClick={() => setSelectedProject(null)}
								className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
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

							<div className="flex-1 mx-2 sm:mx-4 text-center">
								<h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
									{selectedProject.name}
								</h1>
								<div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
									<div
										className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getPriorityColor(
											selectedProject.priority
										)}`}
									></div>
									<span className="text-xs sm:text-sm text-gray-600">
										{selectedProject.priority} priority
									</span>
								</div>
							</div>

							<div className="flex items-center space-x-1 sm:space-x-2">
								<button
									onClick={() => setShowCollaborators(true)}
									className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									<UserRoundPlus className="text-black" size={20} />
								</button>
								<button
									onClick={() => setShowFileUpload(true)}
									className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									<svg
										className="w-4 h-4 sm:w-5 sm:h-5"
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
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="px-3 py-4 sm:px-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
					{}
					<div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
						<div className="relative mb-4 sm:mb-6">
							<img
								src={selectedProject.coverImage}
								alt={selectedProject.name}
								className="w-full h-32 sm:h-48 rounded-xl sm:rounded-2xl object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl sm:rounded-2xl"></div>
							<div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
								<div
									className={`inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-semibold bg-gradient-to-r ${selectedProject.color} shadow-lg`}
								>
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1 sm:mr-2 animate-pulse"></div>
									{selectedProject.progress}% Complete
								</div>
							</div>
						</div>

						<div className="space-y-3 sm:space-y-4">
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
									{selectedProject.name}
								</h2>
								<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
									{selectedProject.description}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-2 sm:gap-4">
								<div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl">
									<div className="text-lg sm:text-2xl font-bold text-blue-600">
										{selectedProject.files.length}
									</div>
									<div className="text-xs sm:text-sm text-gray-600">Files</div>
								</div>
								<div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl">
									<div className="text-lg sm:text-2xl font-bold text-purple-600">
										{selectedProject.collaborators.length}
									</div>
									<div className="text-xs sm:text-sm text-gray-600">
										Team Members
									</div>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4 space-y-1 sm:space-y-0">
								<div className="text-xs sm:text-sm text-gray-600">
									<span className="font-medium">Due:</span>{" "}
									{selectedProject.dueDate}
								</div>
								<div className="text-xs sm:text-sm text-gray-600">
									<span className="font-medium">Last activity:</span>{" "}
									{selectedProject.lastActivity}
								</div>
							</div>

							<div className="space-y-1 sm:space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-xs sm:text-sm font-semibold text-gray-700">
										Project Progress
									</span>
									<span className="text-xs sm:text-sm font-bold text-gray-900">
										{selectedProject.progress}%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
									<div
										className={`h-2 sm:h-3 rounded-full bg-gradient-to-r ${selectedProject.color} transition-all duration-1000 ease-out shadow-sm`}
										style={{ width: `${selectedProject.progress}%` }}
									/>
								</div>
							</div>

							<div className="flex items-center justify-between pt-2">
								<div className="flex items-center space-x-0.5 sm:space-x-2">
									{selectedProject.collaborators
										.slice(0, 3)
										.map((collaborator, index) => (
											<div key={collaborator.id} className="relative">
												<img
													src={collaborator.avatar}
													alt={collaborator.name}
													className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-lg"
													style={{
														marginLeft: index > 0 ? "-6px" : "0",
														zIndex: 3 - index,
													}}
												/>
												<div
													className={`absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
														collaborator.status === "online"
															? "bg-green-400"
															: collaborator.status === "away"
															? "bg-yellow-400"
															: "bg-gray-400"
													}`}
												></div>
											</div>
										))}
									{selectedProject.collaborators.length > 3 && (
										<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border-2 border-white shadow-lg -ml-1.5 sm:-ml-2">
											+{selectedProject.collaborators.length - 3}
										</div>
									)}
								</div>
								<div
									className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${
										selectedProject.status === "active"
											? "bg-green-100 text-green-700"
											: selectedProject.status === "completed"
											? "bg-blue-100 text-blue-700"
											: selectedProject.status === "on-hold"
											? "bg-yellow-100 text-yellow-700"
											: "bg-gray-100 text-gray-700"
									}`}
								>
									{selectedProject.status.toUpperCase()}
								</div>
							</div>
						</div>
					</div>

					{}
					<div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
						<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
							Workflow Progress
						</h3>
						<div className="space-y-2 sm:space-y-4">
							{selectedProject.workflow.map((step, index) => (
								<div key={step.id} className="relative">
									<div className="flex items-start space-x-2 sm:space-x-4">
										<div className="relative">
											<div
												className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg ${
													step.status === "completed"
														? "bg-gradient-to-br from-green-400 to-green-600 text-white"
														: step.status === "in-progress"
														? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
														: step.status === "overdue"
														? "bg-gradient-to-br from-red-400 to-red-600 text-white"
														: "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
												}`}
											>
												{step.status === "completed"
													? "✓"
													: step.status === "in-progress"
													? "⏳"
													: step.status === "overdue"
													? "⚠"
													: index + 1}
											</div>
											{index < selectedProject.workflow.length - 1 && (
												<div
													className={`absolute top-9 sm:top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6 sm:h-8 ${
														step.status === "completed"
															? "bg-green-300"
															: "bg-gray-300"
													}`}
												></div>
											)}
										</div>

										<div className="flex-1 min-w-0 pb-6 sm:pb-8">
											<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1 sm:mb-2">
												<h4 className="text-base sm:text-lg font-semibold text-gray-900">
													{step.name}
												</h4>
												<div className="flex flex-row sm:flex-col items-center sm:items-end mt-1 sm:mt-0 space-x-2 sm:space-x-0">
													<span
														className={`text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full ${getStatusColor(
															step.status
														)}`}
													>
														{step.status.replace("-", " ").toUpperCase()}
													</span>
													<span className="text-xs text-gray-500 sm:mt-1">
														Due: {step.dueDate}
													</span>
												</div>
											</div>

											<p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
												{step.description}
											</p>

											<div className="flex items-center space-x-2 sm:space-x-3">
												<img
													src={step.assignee.avatar}
													alt={step.assignee.name}
													className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-sm"
												/>
												<div>
													<div className="text-xs sm:text-sm font-semibold text-gray-900">
														{step.assignee.name}
													</div>
													<div className="text-xs text-gray-500">
														{step.assignee.role}
													</div>
												</div>
												{step.completedAt && (
													<div className="ml-auto text-xs text-green-600 font-medium">
														Completed {step.completedAt}
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{}
					<div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
						<div className="flex items-center justify-between mb-4 sm:mb-6">
							<h3 className="text-lg sm:text-xl font-bold text-gray-900">
								Project Files
							</h3>
							<div className="flex items-center space-x-1 sm:space-x-2">
								<button
									onClick={() =>
										setViewMode(viewMode === "grid" ? "list" : "grid")
									}
									className="p-1.5 sm:p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-200 text-xs sm:text-base"
								>
									{viewMode === "grid" ? "☰" : "⊞"}
								</button>
								<select
									value={sortBy}
									onChange={(e) =>
										setSortBy(e.target.value as "name" | "date" | "size")
									}
									className="text-xs sm:text-sm bg-white/50 border border-gray-200 rounded-lg px-2 py-1 sm:px-3 sm:py-1"
								>
									<option value="date">Sort by Date</option>
									<option value="name">Sort by Name</option>
									<option value="size">Sort by Size</option>
								</select>
							</div>
						</div>

						{selectedProject.files.length === 0 ? (
							<div className="text-center py-8 sm:py-12">
								<div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
									📁
								</div>
								<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
									No files yet
								</h4>
								<p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
									Upload your first file to get started
								</p>
								<button
									onClick={() => setShowFileUpload(true)}
									className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
								>
									📤 Upload File
								</button>
							</div>
						) : (
							<div
								className={
									viewMode === "grid"
										? "grid grid-cols-1 gap-3 sm:gap-4"
										: "space-y-2 sm:space-y-3"
								}
							>
								{selectedProject.files.map((file) => (
									<div
										key={file.id}
										onClick={() => setSelectedFile(file)}
										className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
											viewMode === "grid"
												? "bg-white/50 hover:bg-white/70 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl"
												: "flex items-center space-x-2 sm:space-x-4 p-2 sm:p-3 bg-white/50 hover:bg-white/70 rounded-lg sm:rounded-xl border border-white/30 hover:border-white/50"
										}`}
									>
										{viewMode === "grid" ? (
											<>
												<div className="relative mb-3 sm:mb-4">
													<img
														src={file.thumbnail}
														alt={file.name}
														className="w-full h-24 sm:h-32 object-cover rounded-lg sm:rounded-xl"
													/>
													<div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex items-center space-x-1">
														<div
															className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${
																getSyncStatusIcon(file.syncStatus).bg
															} ${getSyncStatusIcon(file.syncStatus).color}`}
														>
															{getSyncStatusIcon(file.syncStatus).icon}
														</div>
														{file.watermarkEnabled && (
															<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center">
																<span className="text-blue-600 text-xs">
																	🔒
																</span>
															</div>
														)}
													</div>
													<div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
														<div
															className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-xs font-medium ${
																getFileTypeIcon(file.type).color
															} bg-white/90 backdrop-blur-sm`}
														>
															{getFileTypeIcon(file.type).icon}
														</div>
													</div>
												</div>

												<div className="space-y-1 sm:space-y-2">
													<h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">
														{file.name}
													</h4>
													<div className="flex items-center justify-between text-xs text-gray-500">
														<span>{file.size}</span>
														<span>{file.lastModified}</span>
													</div>
													<div className="flex items-center space-x-1 sm:space-x-2">
														<img
															src={file.uploadedBy.avatar}
															alt={file.uploadedBy.name}
															className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
														/>
														<span className="text-xs text-gray-600">
															{file.uploadedBy.name}
														</span>
													</div>
													{file.tags.length > 0 && (
														<div className="flex flex-wrap gap-1">
															{file.tags.slice(0, 2).map((tag, index) => (
																<span
																	key={index}
																	className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full"
																>
																	#{tag}
																</span>
															))}
															{file.tags.length > 2 && (
																<span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
																	+{file.tags.length - 2}
																</span>
															)}
														</div>
													)}
												</div>
											</>
										) : (
											<>
												<div className="relative">
													<img
														src={file.thumbnail}
														alt={file.name}
														className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
													/>
													<div className="absolute -top-1 -right-1">
														<div
															className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-xs ${
																getSyncStatusIcon(file.syncStatus).bg
															} ${getSyncStatusIcon(file.syncStatus).color}`}
														>
															{getSyncStatusIcon(file.syncStatus).icon}
														</div>
													</div>
												</div>

												<div className="flex-1 min-w-0">
													<h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">
														{file.name}
													</h4>
													<div className="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500 mt-0.5 sm:mt-1">
														<span>{file.size}</span>
														<span>•</span>
														<span>{file.lastModified}</span>
														<span className="hidden sm:inline">•</span>
														<span className="hidden sm:inline">
															{file.uploadedBy.name}
														</span>
													</div>
												</div>

												<div className="flex items-center space-x-1 sm:space-x-2">
													{file.downloadPermission === "download" && (
														<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center">
															<span className="text-green-600 text-xs">⬇️</span>
														</div>
													)}
													{file.watermarkEnabled && (
														<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center">
															<span className="text-blue-600 text-xs">🔒</span>
														</div>
													)}
													<div
														className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-xs font-medium ${
															getFileTypeIcon(file.type).color
														} bg-gray-100`}
													>
														{getFileTypeIcon(file.type).icon}
													</div>
												</div>
											</>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{}
				{showCollaborators && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-end animate-fade-in">
						<div className="w-full bg-white rounded-t-2xl sm:rounded-t-3xl max-h-[85vh] overflow-y-auto transform animate-slide-up">
							<div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-gray-200">
								<div className="flex items-center justify-between">
									<h3 className="text-xl sm:text-2xl font-bold text-gray-900">
										Team Collaboration
									</h3>
									<button
										onClick={() => setShowCollaborators(false)}
										className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
									>
										<svg
											className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
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

							<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
								<div>
									<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
										Current Team Members
									</h4>
									<div className="space-y-2 sm:space-y-3">
										{selectedProject.collaborators.map((collaborator) => (
											<div
												key={collaborator.id}
												className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-200"
											>
												<div className="relative">
													<img
														src={collaborator.avatar}
														alt={collaborator.name}
														className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-sm"
													/>
													<div
														className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
															collaborator.status === "online"
																? "bg-green-400"
																: collaborator.status === "away"
																? "bg-yellow-400"
																: "bg-gray-400"
														}`}
													></div>
												</div>
												<div className="flex-1">
													<h5 className="font-semibold text-gray-900 text-sm sm:text-base">
														{collaborator.name}
													</h5>
													<p className="text-xs sm:text-sm text-gray-600">
														{collaborator.role}
													</p>
													<p className="text-xs text-gray-500 capitalize">
														{collaborator.status}
													</p>
												</div>
												<div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
													<button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:bg-blue-200 transition-colors">
														💬 Message
													</button>
													<button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-600 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:bg-green-200 transition-colors">
														📞 Call
													</button>
												</div>
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
										Suggested Collaborators
									</h4>
									<div className="space-y-2 sm:space-y-3">
										{[
											{
												id: "8",
												name: "Emma Wilson",
												role: "Product Designer",
												avatar:
													"https://images.unsplash.com/photo-1494790108755-2616b056-5009?w=150&h=150&fit=crop&crop=face",
												collaborations: 12,
											},
											{
												id: "9",
												name: "James Carter",
												role: "Frontend Developer",
												avatar:
													"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
												collaborations: 8,
											},
											{
												id: "10",
												name: "Lisa Anderson",
												role: "Content Strategist",
												avatar:
													"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
												collaborations: 15,
											},
										].map((person) => (
											<div
												key={person.id}
												className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-2xl"
											>
												<img
													src={person.avatar}
													alt={person.name}
													className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-sm"
												/>
												<div className="flex-1 min-w-0">
													<h5 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
														{person.name}
													</h5>
													<p className="text-xs sm:text-sm text-gray-600 truncate">
														{person.role}
													</p>
													<p className="text-xs text-blue-600 font-medium">
														{person.collaborations} past collaborations
													</p>
												</div>
												<button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg whitespace-nowrap">
													➕ Add
												</button>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{showFileUpload && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
						<div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 transform animate-scale-up">
							<div className="text-center mb-4 sm:mb-6">
								<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
									Upload Files
								</h3>
								<p className="text-xs sm:text-sm text-gray-600">
									Add files to {selectedProject.name}
								</p>
							</div>

							<div
								className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
								onClick={() => fileInputRef.current?.click()}
							>
								<div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
									📤
								</div>
								<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
									Drop files here
								</h4>
								<p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
									or click to browse
								</p>
								<input
									ref={fileInputRef}
									type="file"
									multiple
									onChange={(e) => handleFileUpload(e.target.files)}
									className="hidden"
									accept=".pdf,.fig,.sketch,.jpg,.jpeg,.png,.gif,.mp4,.mov,.doc,.docx,.ppt,.pptx"
								/>
								{loading && (
									<div className="mt-3 sm:mt-4">
										<div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-1 sm:mb-2">
											<div
												className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
												style={{ width: `${uploadProgress}%` }}
											/>
										</div>
										<p className="text-xs sm:text-sm text-gray-600">
											Uploading... {Math.round(uploadProgress)}%
										</p>
									</div>
								)}
							</div>

							<div className="flex space-x-3 mt-4 sm:mt-6">
								<button
									onClick={() => setShowFileUpload(false)}
									disabled={loading}
									className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
								>
									Cancel
								</button>
								<button
									onClick={() => fileInputRef.current?.click()}
									disabled={loading}
									className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50"
								>
									Choose Files
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			{}
			<div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
				<div className="px-3 py-3 sm:px-4 sm:py-4">
					<div className="flex items-center justify-between mb-3 sm:mb-4">
						<div className="flex items-center space-x-2 sm:space-x-3">
							<div className="relative">
								<img
									src={currentUser.avatar}
									alt={currentUser.name}
									className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-3 border-white shadow-lg"
								/>
								<div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
							</div>
							<div>
								<h2 className="text-base sm:text-lg font-bold text-gray-900">
									Welcome back, {currentUser.name.split(" ")[0]}! 👋
								</h2>
								<p className="text-xs sm:text-sm text-gray-600">
									{currentUser.role} •{" "}
									{connectionStatus === "online"
										? "🟢 Online"
										: connectionStatus === "slow"
										? "🟡 Slow Connection"
										: "🔴 Offline"}
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-1 sm:space-x-2">
							<button
								onClick={() => setShowSearch(true)}
								className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
							<button
								onClick={() => setShowNotifications(true)}
								className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
							>
								<Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
								{unreadNotifications > 0 && (
									<div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
										{unreadNotifications > 9 ? "9+" : unreadNotifications}
									</div>
								)}
								{urgentNotifications > 0 && (
									<div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full animate-ping"></div>
								)}
							</button>
							<button
								onClick={() => setShowProfile(true)}
								className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
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
							</button>
						</div>
					</div>

					{}
					<div className="relative">
						<input
							type="text"
							placeholder="Search projects, files, or team members..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/80 transition-all duration-300 shadow-lg"
						/>
						<div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
							<svg
								className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								<svg
									className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
						)}
					</div>
				</div>
			</div>

			{}
			{searchQuery &&
				(searchResults.files.length > 0 ||
					searchResults.projects.length > 0) && (
					<div className="absolute top-full left-0 right-0 z-20 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-xl">
						<div className="px-3 py-3 sm:px-4 sm:py-4 max-h-72 sm:max-h-96 overflow-y-auto">
							<div className="space-y-3 sm:space-y-4">
								{searchResults.projects.length > 0 && (
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
											Projects
										</h4>
										<div className="space-y-1.5 sm:space-y-2">
											{searchResults.projects.map((project) => (
												<button
													key={project.id}
													onClick={() => {
														setSelectedProject(project);
														setSearchQuery("");
													}}
													className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-200 text-left"
												>
													<img
														src={project.coverImage}
														alt={project.name}
														className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
													/>
													<div className="flex-1 min-w-0">
														<h5 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
															{project.name}
														</h5>
														<p className="text-xs text-gray-600 truncate">
															{project.description}
														</p>
													</div>
													<div
														className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getPriorityColor(
															project.priority
														)}`}
													></div>
												</button>
											))}
										</div>
									</div>
								)}

								{searchResults.files.length > 0 && (
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
											Files
										</h4>
										<div className="space-y-1.5 sm:space-y-2">
											{searchResults.files.map((file) => (
												<button
													key={file.id}
													onClick={() => {
														setSelectedFile(file);
														setSearchQuery("");
													}}
													className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-200 text-left"
												>
													<img
														src={file.thumbnail}
														alt={file.name}
														className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
													/>
													<div className="flex-1 min-w-0">
														<h5 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
															{file.name}
														</h5>
														<div className="flex items-center space-x-2 text-xs text-gray-600">
															<span>{file.size}</span>
															<span>•</span>
															<span>{file.lastModified}</span>
														</div>
													</div>
													<div
														className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-xs ${
															getFileTypeIcon(file.type).color
														} bg-gray-100`}
													>
														{getFileTypeIcon(file.type).icon}
													</div>
												</button>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

			{}
			<div className="px-3 py-4 sm:px-4 sm:py-6 pb-24">
				{}
				<div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
					<div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-xl">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									{projects.length}
								</div>
								<div className="text-xs sm:text-sm font-medium text-gray-600">
									Active Projects
								</div>
								<div className="text-xs text-green-600 mt-0.5 sm:mt-1">
									↗ 2 new this week
								</div>
							</div>
							<div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
								📊
							</div>
						</div>
					</div>

					<div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-xl">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
									{urgentNotifications}
								</div>
								<div className="text-xs sm:text-sm font-medium text-gray-600">
									Urgent Tasks
								</div>
								<div className="text-xs text-orange-600 mt-0.5 sm:mt-1">
									⚡ Needs attention
								</div>
							</div>
							<div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
								⚠️
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
					<div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-xl">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
									{totalFiles}
								</div>
								<div className="text-xs sm:text-sm font-medium text-gray-600">
									Total Files
								</div>
								<div className="text-xs text-blue-600 mt-0.5 sm:mt-1">
									☁️ All synced
								</div>
							</div>
							<div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
								📁
							</div>
						</div>
					</div>

					<div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-xl">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
									{Math.round(
										projects.reduce((acc, p) => acc + p.progress, 0) /
											projects.length
									)}
									%
								</div>
								<div className="text-xs sm:text-sm font-medium text-gray-600">
									Avg Progress
								</div>
								<div className="text-xs text-purple-600 mt-0.5 sm:mt-1">
									📈 On track
								</div>
							</div>
							<div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
								🎯
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="space-y-4 sm:space-y-6">
					<div className="flex items-center justify-between">
						<h3 className="text-xl sm:text-2xl font-bold text-gray-900">
							Your Projects
						</h3>
						<div className="flex items-center space-x-2 sm:space-x-3">
							<div className="flex space-x-0.5 sm:space-x-1">
								{projects.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentProjectIndex(index)}
										className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
											index === currentProjectIndex
												? "bg-gradient-to-r from-blue-500 to-purple-500 w-6 sm:w-8"
												: "bg-gray-300 hover:bg-gray-400"
										}`}
									/>
								))}
							</div>
							<button className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
								View All →
							</button>
						</div>
					</div>

					<div className="relative overflow-hidden">
						<div
							ref={cardRef}
							className="flex transition-transform duration-500 ease-out"
							style={{
								transform: `translateX(-${currentProjectIndex * 100}%)`,
							}}
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
						>
							{projects.map((project) => (
								<div
									key={project.id}
									className="w-full flex-shrink-0 pr-3 sm:pr-4"
								>
									<div
										onClick={() => setSelectedProject(project)}
										className="group bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:bg-white/80 hover:scale-[1.02]"
									>
										<div className="relative mb-4 sm:mb-6 overflow-hidden rounded-lg sm:rounded-2xl">
											<img
												src={project.coverImage}
												alt={project.name}
												className="w-full h-40 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

											{}
											<div className="absolute top-2 sm:top-4 left-2 sm:left-4">
												<div
													className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-white ${
														project.priority === "urgent"
															? "bg-red-500 animate-pulse"
															: project.priority === "high"
															? "bg-orange-500"
															: project.priority === "medium"
															? "bg-yellow-500"
															: "bg-green-500"
													} shadow-lg`}
												>
													{project.priority === "urgent"
														? "🔥 URGENT"
														: project.priority === "high"
														? "⚡ HIGH"
														: project.priority === "medium"
														? "📊 MEDIUM"
														: "🌱 LOW"}
												</div>
											</div>

											{}
											<div className="absolute top-2 sm:top-4 right-2 sm:right-4">
												<div
													className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r ${project.color} shadow-lg backdrop-blur-sm`}
												>
													{project.progress}% Complete
												</div>
											</div>

											{}
											<div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
												<div
													className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${
														project.status === "active"
															? "bg-green-100 text-green-700"
															: project.status === "completed"
															? "bg-blue-100 text-blue-700"
															: project.status === "on-hold"
															? "bg-yellow-100 text-yellow-700"
															: "bg-gray-100 text-gray-700"
													} backdrop-blur-sm shadow-lg`}
												>
													{project.status.toUpperCase().replace("-", " ")}
												</div>
											</div>

											{}
											<div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
												<div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium text-white bg-black/40 backdrop-blur-sm">
													Due: {project.dueDate.split(",")[0]}
												</div>
											</div>
										</div>

										<div className="space-y-3 sm:space-y-4">
											<div>
												<h4 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
													{project.name}
												</h4>
												<p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
													{project.description}
												</p>
											</div>

											{}
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-0.5 sm:space-x-2">
													{project.collaborators
														.slice(0, 3)
														.map((collaborator, index) => (
															<div key={collaborator.id} className="relative">
																<img
																	src={collaborator.avatar}
																	alt={collaborator.name}
																	className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-lg transition-transform duration-300 hover:scale-110"
																	style={{
																		marginLeft: index > 0 ? "-6px" : "0",
																		zIndex: 3 - index,
																	}}
																/>
																<div
																	className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
																		collaborator.status === "online"
																			? "bg-green-400"
																			: collaborator.status === "away"
																			? "bg-yellow-400"
																			: "bg-gray-400"
																	}`}
																></div>
															</div>
														))}
													{project.collaborators.length > 3 && (
														<div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border-2 border-white shadow-lg -ml-1.5 sm:-ml-2">
															+{project.collaborators.length - 3}
														</div>
													)}
												</div>
												<div className="text-right">
													<div className="text-xs text-gray-500">
														Last activity
													</div>
													<div className="text-xs sm:text-sm font-semibold text-gray-900">
														{project.lastActivity}
													</div>
												</div>
											</div>

											{}
											<div className="space-y-1 sm:space-y-2">
												<div className="flex justify-between items-center">
													<span className="text-xs sm:text-sm font-semibold text-gray-700">
														Progress
													</span>
													<span className="text-xs sm:text-sm font-bold text-gray-900">
														{project.progress}%
													</span>
												</div>
												<div className="relative">
													<div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-4 overflow-hidden">
														<div
															className={`h-2.5 sm:h-4 rounded-full bg-gradient-to-r ${project.color} transition-all duration-1000 ease-out shadow-sm relative overflow-hidden`}
															style={{ width: `${project.progress}%` }}
														>
															<div className="absolute inset-0 bg-white/20 animate-pulse"></div>
														</div>
													</div>
													<div className="absolute inset-0 rounded-full border border-white/30"></div>
												</div>
											</div>

											{}
											<div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-gray-200">
												<div className="text-center">
													<div className="text-base sm:text-lg font-bold text-gray-900">
														{project.files.length}
													</div>
													<div className="text-xs text-gray-600">Files</div>
												</div>
												<div className="text-center">
													<div className="text-base sm:text-lg font-bold text-gray-900">
														{
															project.workflow.filter(
																(w) => w.status === "completed"
															).length
														}
													</div>
													<div className="text-xs text-gray-600">
														Tasks Done
													</div>
												</div>
												<div className="text-center">
													<div className="text-base sm:text-lg font-bold text-gray-900">
														{
															project.workflow.filter(
																(w) => w.status === "pending"
															).length
														}
													</div>
													<div className="text-xs text-gray-600">Pending</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{}
				<div className="mt-6 sm:mt-8">
					<div className="flex items-center justify-between mb-4 sm:mb-6">
						<h3 className="text-xl sm:text-2xl font-bold text-gray-900">
							Recent Activity
						</h3>
						<button
							onClick={() => setShowNotifications(true)}
							className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
						>
							View All →
						</button>
					</div>

					<div className="space-y-3 sm:space-y-4">
						{notifications.slice(0, 3).map((notification) => (
							<div
								key={notification.id}
								onClick={() => markNotificationAsRead(notification.id)}
								className={`group bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-white/80 ${
									!notification.read
										? "ring-2 ring-blue-200 hover:ring-blue-300"
										: ""
								}`}
							>
								<div className="flex items-start space-x-3 sm:space-x-4">
									<div className="relative">
										{notification.avatar ? (
											<img
												src={notification.avatar}
												alt="User"
												className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg"
											/>
										) : (
											<div
												className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg shadow-lg ${
													notification.type === "approval"
														? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
														: notification.type === "comment"
														? "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
														: notification.type === "upload"
														? "bg-gradient-to-br from-green-400 to-teal-500 text-white"
														: notification.type === "deadline"
														? "bg-gradient-to-br from-red-400 to-pink-500 text-white"
														: "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
												}`}
											>
												{notification.type === "approval"
													? "⚠️"
													: notification.type === "comment"
													? "💬"
													: notification.type === "upload"
													? "📤"
													: notification.type === "deadline"
													? "⏰"
													: "📢"}
											</div>
										)}
										{notification.actionRequired && (
											<div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
												<span className="text-white text-xs font-bold">!</span>
											</div>
										)}
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between mb-0.5 sm:mb-1">
											<h4 className="font-semibold text-gray-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
												{notification.title}
											</h4>
											<div className="flex items-center space-x-1 sm:space-x-2">
												<span className="text-xs text-gray-500">
													{notification.time}
												</span>
												{!notification.read && (
													<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
												)}
											</div>
										</div>
										<p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
											{notification.message}
										</p>
										{notification.actionRequired && (
											<div className="mt-1.5 sm:mt-2">
												<button className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all duration-200">
													Take Action →
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{}
			{showNotifications && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-end animate-fade-in">
					<div className="w-full bg-white rounded-t-2xl sm:rounded-t-3xl max-h-[85vh] overflow-y-auto transform animate-slide-up">
						<div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-gray-200">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-xl sm:text-2xl font-bold text-gray-900">
										Notifications
									</h3>
									<p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
										{unreadNotifications} unread • {urgentNotifications} urgent
									</p>
								</div>
								<div className="flex items-center space-x-2">
									{unreadNotifications > 0 && (
										<button
											onClick={markAllNotificationsAsRead}
											className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
										>
											Mark All Read
										</button>
									)}
									<button
										onClick={() => setShowNotifications(false)}
										className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
									>
										<svg
											className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
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
						</div>

						<div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									onClick={() => markNotificationAsRead(notification.id)}
									className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
										notification.read
											? "bg-gray-50 hover:bg-gray-100"
											: "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 hover:from-blue-100 hover:to-purple-100"
									}`}
								>
									<div className="flex items-start space-x-3 sm:space-x-4">
										<div className="relative">
											{notification.avatar ? (
												<img
													src={notification.avatar}
													alt="User"
													className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg"
												/>
											) : (
												<div
													className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg shadow-lg ${
														notification.type === "approval"
															? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
															: notification.type === "comment"
															? "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
															: notification.type === "upload"
															? "bg-gradient-to-br from-green-400 to-teal-500 text-white"
															: notification.type === "deadline"
															? "bg-gradient-to-br from-red-400 to-pink-500 text-white"
															: "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
													}`}
												>
													{notification.type === "approval"
														? "⚠️"
														: notification.type === "comment"
														? "💬"
														: notification.type === "upload"
														? "📤"
														: notification.type === "deadline"
														? "⏰"
														: "📢"}
												</div>
											)}
											{notification.actionRequired && !notification.read && (
												<div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
													<span className="text-white text-xs font-bold">
														!
													</span>
												</div>
											)}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1 sm:mb-2">
												<h4 className="font-bold text-gray-900 text-sm sm:text-base">
													{notification.title}
												</h4>
												<div className="flex items-center space-x-2 mt-0.5 sm:mt-0">
													<span className="text-xs text-gray-500">
														{notification.time}
													</span>
													{!notification.read && (
														<div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
													)}
												</div>
											</div>
											<p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2 sm:mb-3">
												{notification.message}
											</p>
											{notification.actionRequired && (
												<div className="flex space-x-2">
													<button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg">
														Take Action
													</button>
													<button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200">
														Dismiss
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{}
			{showSearch && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-start pt-16 sm:pt-20 animate-fade-in">
					<div className="w-full max-w-xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 mx-3 sm:mx-4 transform animate-scale-up">
						<div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
							<div className="flex-1 relative">
								<input
									ref={searchInputRef}
									type="text"
									placeholder="Search everything..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-9 sm:pl-12 pr-3 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-sm sm:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
									autoFocus
								/>
								<div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
									<svg
										className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
							</div>
							<button
								onClick={() => setShowSearch(false)}
								className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
							>
								<svg
									className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
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

						{searchQuery && (
							<div className="space-y-4 sm:space-y-6">
								{searchResults.projects.length > 0 && (
									<div>
										<h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
											Projects
										</h4>
										<div className="space-y-2 sm:space-y-3">
											{searchResults.projects.map((project) => (
												<button
													key={project.id}
													onClick={() => {
														setSelectedProject(project);
														setShowSearch(false);
														setSearchQuery("");
													}}
													className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 text-left"
												>
													<img
														src={project.coverImage}
														alt={project.name}
														className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover"
													/>
													<div className="flex-1 min-w-0">
														<h5 className="font-bold text-gray-900 text-sm sm:text-base truncate">
															{project.name}
														</h5>
														<p className="text-xs sm:text-sm text-gray-600 truncate">
															{project.description}
														</p>
														<div className="flex items-center space-x-2 mt-1">
															<div
																className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getPriorityColor(
																	project.priority
																)}`}
															></div>
															<span className="text-xs text-gray-500">
																{project.priority} priority
															</span>
														</div>
													</div>
													<div className="text-right">
														<div className="text-xs sm:text-sm font-semibold text-gray-900">
															{project.progress}%
														</div>
														<div className="text-xs text-gray-500">
															complete
														</div>
													</div>
												</button>
											))}
										</div>
									</div>
								)}

								{searchResults.files.length > 0 && (
									<div>
										<h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
											Files
										</h4>
										<div className="space-y-2 sm:space-y-3">
											{searchResults.files.map((file) => (
												<button
													key={file.id}
													onClick={() => {
														setSelectedFile(file);
														setShowSearch(false);
														setSearchQuery("");
													}}
													className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 text-left"
												>
													<img
														src={file.thumbnail}
														alt={file.name}
														className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover"
													/>
													<div className="flex-1 min-w-0">
														<h5 className="font-bold text-gray-900 text-sm sm:text-base truncate">
															{file.name}
														</h5>
														<div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600 mt-1">
															<span>{file.size}</span>
															<span>•</span>
															<span>{file.lastModified}</span>
															<span className="hidden sm:inline">•</span>
															<span className="hidden sm:inline">
																{file.uploadedBy.name}
															</span>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<div
															className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs font-medium ${
																getFileTypeIcon(file.type).color
															} bg-gray-200`}
														>
															{getFileTypeIcon(file.type).icon}{" "}
															{file.type.toUpperCase()}
														</div>
													</div>
												</button>
											))}
										</div>
									</div>
								)}

								{searchResults.projects.length === 0 &&
									searchResults.files.length === 0 && (
										<div className="text-center py-8 sm:py-12">
											<div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
												🔍
											</div>
											<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
												No results found
											</h4>
											<p className="text-xs sm:text-sm text-gray-600">
												Try searching for projects, files, or team members
											</p>
										</div>
									)}
							</div>
						)}
					</div>
				</div>
			)}

			{}
			{showProfile && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-end animate-fade-in">
					<div className="w-full bg-white rounded-t-2xl sm:rounded-t-3xl max-h-[85vh] overflow-y-auto transform animate-slide-up">
						<div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-gray-200">
							<div className="flex items-center justify-between">
								<h3 className="text-xl sm:text-2xl font-bold text-gray-900">
									Profile & Settings
								</h3>
								<button
									onClick={() => setShowProfile(false)}
									className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
								>
									<svg
										className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
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

						<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
							{}
							<div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-3xl">
								<div className="relative">
									<img
										src={currentUser.avatar}
										alt={currentUser.name}
										className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-white shadow-lg"
									/>
									<div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 sm:border-3 border-white"></div>
								</div>
								<div className="flex-1">
									<h4 className="text-xl sm:text-2xl font-bold text-gray-900">
										{currentUser.name}
									</h4>
									<p className="text-sm sm:text-base text-gray-600">
										{currentUser.role}
									</p>
									<p className="text-xs sm:text-sm text-gray-500">
										{currentUser.email}
									</p>
								</div>
								<button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg">
									Edit Profile
								</button>
							</div>

							{}
							<div className="space-y-3 sm:space-y-4">
								<h4 className="text-base sm:text-lg font-bold text-gray-900">
									Preferences
								</h4>

								<div className="space-y-3 sm:space-y-4">
									<div className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl">
										<div className="flex items-center space-x-2 sm:space-x-3">
											<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
												🌐
											</div>
											<div>
												<h5 className="font-semibold text-gray-900 text-sm sm:text-base">
													Offline Mode
												</h5>
												<p className="text-xs sm:text-sm text-gray-600">
													Download files for offline access
												</p>
											</div>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={isOfflineMode}
												onChange={(e) => setIsOfflineMode(e.target.checked)}
												className="sr-only peer"
											/>
											<div className="w-10 h-6 sm:w-14 sm:h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-1 after:left-[2px] sm:after:left-1 after:bg-white after:rounded-full after:h-5 sm:after:h-6 after:w-5 sm:after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 shadow-lg"></div>
										</label>
									</div>

									<div className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl">
										<div className="flex items-center space-x-2 sm:space-x-3">
											<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
												🔄
											</div>
											<div>
												<h5 className="font-semibold text-gray-900 text-sm sm:text-base">
													Auto-sync
												</h5>
												<p className="text-xs sm:text-sm text-gray-600">
													Automatically sync changes
												</p>
											</div>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												defaultChecked
												className="sr-only peer"
											/>
											<div className="w-10 h-6 sm:w-14 sm:h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-1 after:left-[2px] sm:after:left-1 after:bg-white after:rounded-full after:h-5 sm:after:h-6 after:w-5 sm:after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 shadow-lg"></div>
										</label>
									</div>

									<div className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl">
										<div className="flex items-center space-x-2 sm:space-x-3">
											<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center">
												🔔
											</div>
											<div>
												<h5 className="font-semibold text-gray-900 text-sm sm:text-base">
													Push Notifications
												</h5>
												<p className="text-xs sm:text-sm text-gray-600">
													Get notified of updates
												</p>
											</div>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												defaultChecked
												className="sr-only peer"
											/>
											<div className="w-10 h-6 sm:w-14 sm:h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-1 after:left-[2px] sm:after:left-1 after:bg-white after:rounded-full after:h-5 sm:after:h-6 after:w-5 sm:after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 shadow-lg"></div>
										</label>
									</div>
								</div>
							</div>

							{}
							<div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
								<button className="w-full flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200">
									<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
										📊
									</div>
									<div className="flex-1 text-left">
										<h5 className="font-semibold text-gray-900 text-sm sm:text-base">
											Usage Analytics
										</h5>
										<p className="text-xs sm:text-sm text-gray-600">
											View your activity statistics
										</p>
									</div>
									<svg
										className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
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
								</button>

								<button className="w-full flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200">
									<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
										💾
									</div>
									<div className="flex-1 text-left">
										<h5 className="font-semibold text-gray-900 text-sm sm:text-base">
											Export Data
										</h5>
										<p className="text-xs sm:text-sm text-gray-600">
											Download your projects and files
										</p>
									</div>
									<svg
										className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
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
								</button>

								<button className="w-full flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl hover:bg-red-100 transition-all duration-200 text-red-600">
									<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center">
										🚪
									</div>
									<div className="flex-1 text-left">
										<h5 className="font-semibold text-sm sm:text-base">
											Sign Out
										</h5>
										<p className="text-xs sm:text-sm text-red-500">
											Log out of your account
										</p>
									</div>
									<svg
										className="w-4 h-4 sm:w-5 sm:h-5 text-red-400"
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
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{}
			{showComingSoon && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
					<div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center transform animate-scale-up">
						<div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl sm:text-3xl">
							🚀
						</div>
						<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
							Coming Soon!
						</h3>
						<p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
							The {comingSoonFeature} feature is currently under development and
							will be available in the next update. We're working hard to bring
							you an amazing experience!
						</p>
						<button
							onClick={() => setShowComingSoon(false)}
							className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
						>
							Return to Dashboard
						</button>
					</div>
				</div>
			)}

			{}
			<div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-white/20 shadow-2xl z-40 md:hidden">
				<div className="px-3 py-2 sm:px-4 sm:py-3">
					<div className="flex items-center justify-around">
						<button
							onClick={() => handleTabChange("home")}
							className={`flex flex-col items-center space-y-0.5 sm:space-y-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
								activeTab === "home"
									? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
									: "text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-105"
							}`}
						>
							<svg
								className="w-5 h-5 sm:w-6 sm:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span className="text-xs font-medium">Home</span>
						</button>

						<button
							onClick={() => handleTabChange("files")}
							className={`flex flex-col items-center space-y-0.5 sm:space-y-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
								activeTab === "files"
									? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
									: "text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-105"
							}`}
						>
							<svg
								className="w-5 h-5 sm:w-6 sm:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
								/>
							</svg>
							<span className="text-xs font-medium">Files</span>
						</button>

						<button
							onClick={() => handleTabChange("teams")}
							className={`flex flex-col items-center space-y-0.5 sm:space-y-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
								activeTab === "teams"
									? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
									: "text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-105"
							}`}
						>
							<svg
								className="w-5 h-5 sm:w-6 sm:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
								/>
							</svg>
							<span className="text-xs font-medium">Teams</span>
						</button>

						<button
							onClick={() => handleTabChange("profile")}
							className={`flex flex-col items-center space-y-0.5 sm:space-y-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
								activeTab === "profile"
									? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
									: "text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-105"
							}`}
						>
							<svg
								className="w-5 h-5 sm:w-6 sm:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							<span className="text-xs font-medium">Profile</span>
						</button>
					</div>
				</div>
			</div>

			{}
			{loading && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
						<div className="flex items-center space-x-3 sm:space-x-4">
							<div className="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
							<span className="text-base sm:text-lg font-semibold text-gray-900">
								Processing...
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const styles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  @keyframes scale-up {
    from { transform: scale(0.95) translateY(10px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .animate-slide-up {
    animation: slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .animate-scale-up {
    animation: scale-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  }
  
  @media (min-width: 640px) {
    .slider::-webkit-slider-thumb {
      height: 20px;
      width: 20px;
    }
  }
  
  .slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  }
  
  @media (min-width: 640px) {
    .slider::-moz-range-thumb {
      height: 20px;
      width: 20px;
    }
  }
`;

if (typeof document !== "undefined") {
	const styleSheet = document.createElement("style");
	styleSheet.innerText = styles;
	document.head.appendChild(styleSheet);
}

export default FilePortalApp;
