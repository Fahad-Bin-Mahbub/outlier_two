"use client";
import React, { useState, useEffect } from "react";
import {
	FiSearch,
	FiPlus,
	FiX,
	FiCheck,
	FiFilter,
	FiArrowLeft,
	FiArrowRight,
	FiChevronDown,
	FiSettings,
	FiEdit,
	FiArrowUp,
	FiArrowDown,
	FiSave,
	FiEye,
	FiTrash2,
	FiClock,
	FiCalendar,
	FiAlertCircle,
	FiInfo,
	FiCheckCircle,
} from "react-icons/fi";
import {
	AiOutlineFileText,
	AiOutlineHome,
	AiOutlineTeam,
	AiOutlineProject,
	AiOutlineSetting,
	AiOutlineLogout,
	AiOutlineBarChart,
	AiOutlineGlobal,
} from "react-icons/ai";
import {
	FaBook,
	FaClipboardList,
	FaRulerCombined,
	FaChalkboardTeacher,
	FaFolderOpen,
} from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import {
	MdDashboard,
	MdOutlineAnalytics,
	MdLightMode,
	MdDarkMode,
} from "react-icons/md";
import {
	BsCalendarDate,
	BsFillCircleFill,
	BsLightningCharge,
	BsBookmark,
} from "react-icons/bs";
import { BiSort, BiLinkExternal } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiDocumentText, HiOutlineDocumentDuplicate } from "react-icons/hi";

interface Project {
	id: number;
	name: string;
	documentCount: number;
	icon: React.ReactNode;
}

interface User {
	id: number;
	name: string;
	avatar: string;
	role: string;
	email: string;
}

interface DocStatus {
	type: "draft" | "review" | "published";
	label: string;
	color: string;
	bgColor: string;
	icon: React.ReactNode;
}

interface DocPage {
	id: number;
	title: string;
	projectId: number;
	status: DocStatus["type"];
	author: User;
	lastModified: Date;
	created: Date;
	tags: string[];
	description: string;
	path: string;
	viewCount?: number;
	priority?: "low" | "medium" | "high";
}

interface Toast {
	id: number;
	message: string;
	type: "success" | "error" | "info";
	icon: React.ReactNode;
}

const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	}).format(date);
};

const getTimeAgo = (date: Date): string => {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} seconds ago`;
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 30) {
		return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
};

const currentUser: User = {
	id: 1,
	name: "Alex Morgan",
	avatar: "AM",
	role: "Technical Writer",
	email: "alex.morgan@example.com",
};

const statusMap: Record<DocStatus["type"], DocStatus> = {
	draft: {
		type: "draft",
		label: "Draft",
		color: "text-amber-600",
		bgColor: "bg-amber-100",
		icon: <FiClock className="mr-1" />,
	},
	review: {
		type: "review",
		label: "In Review",
		color: "text-blue-600",
		bgColor: "bg-blue-100",
		icon: <FiAlertCircle className="mr-1" />,
	},
	published: {
		type: "published",
		label: "Published",
		color: "text-emerald-600",
		bgColor: "bg-emerald-100",
		icon: <FiCheckCircle className="mr-1" />,
	},
};

const generateProjects = (): Project[] => {
	return [
		{
			id: 1,
			name: "API Documentation",
			documentCount: 24,
			icon: <FaBook className="h-5 w-5 text-blue-500" />,
		},
		{
			id: 2,
			name: "User Guides",
			documentCount: 18,
			icon: <MdLibraryBooks className="h-5 w-5 text-green-500" />,
		},
		{
			id: 3,
			name: "Release Notes",
			documentCount: 12,
			icon: <FaClipboardList className="h-5 w-5 text-yellow-500" />,
		},
		{
			id: 4,
			name: "Technical Specifications",
			documentCount: 8,
			icon: <FaRulerCombined className="h-5 w-5 text-purple-500" />,
		},
		{
			id: 5,
			name: "Developer Tutorials",
			documentCount: 15,
			icon: <FaChalkboardTeacher className="h-5 w-5 text-red-500" />,
		},
	];
};

const generateDocPages = (): DocPage[] => {
	const statuses: DocStatus["type"][] = ["draft", "review", "published"];
	const titles = [
		"Authentication API Reference",
		"Getting Started Guide",
		"User Management",
		"Data Models",
		"Webhooks Integration",
		"Deployment Instructions",
		"Configuration Options",
		"Error Handling",
		"Performance Optimization",
		"Security Guidelines",
		"API Endpoints",
		"Database Schema",
		"Frontend Architecture",
		"Testing Framework",
		"Containerization Guide",
	];

	const tags = [
		"api",
		"frontend",
		"backend",
		"database",
		"security",
		"performance",
		"architecture",
		"devops",
		"testing",
		"tutorial",
	];

	const priorities = ["low", "medium", "high"] as const;

	return Array.from({ length: 30 }, (_, i) => {
		const randomDate = (daysAgo: number) => {
			const date = new Date();
			date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
			return date;
		};

		const created = randomDate(60);

		return {
			id: i + 1,
			title: titles[i % titles.length],
			projectId: Math.floor(Math.random() * 5) + 1,
			status: statuses[Math.floor(Math.random() * statuses.length)],
			author: currentUser,
			lastModified: randomDate(30),
			created,
			tags: Array.from(
				{ length: Math.floor(Math.random() * 3) + 1 },
				() => tags[Math.floor(Math.random() * tags.length)]
			),
			description: `Technical documentation for ${titles[i % titles.length]}`,
			path: `/docs/${i + 1}`,
			viewCount: Math.floor(Math.random() * 1000),
			priority: priorities[Math.floor(Math.random() * priorities.length)],
		};
	});
};

function TechnicalWritingDashboard() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [docPages, setDocPages] = useState<DocPage[]>([]);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editingDoc, setEditingDoc] = useState<DocPage | null>(null);
	const [docToDelete, setDocToDelete] = useState<DocPage | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortField, setSortField] = useState<keyof DocPage>("lastModified");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const [statusFilter, setStatusFilter] = useState<DocStatus["type"] | "all">(
		"all"
	);
	const [priorityFilter, setPriorityFilter] = useState<
		DocPage["priority"] | "all"
	>("all");
	const [tagFilter, setTagFilter] = useState<string | "all">("all");
	const [activeTab, setActiveTab] = useState("dashboard");
	const [showNotifications, setShowNotifications] = useState(false);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [darkMode, setDarkMode] = useState(false);
	const [newDocData, setNewDocData] = useState({
		title: "",
		description: "",
		tags: "",
		status: "draft" as DocStatus["type"],
		priority: "medium" as DocPage["priority"],
	});
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		const loadedProjects = generateProjects();
		const loadedDocPages = generateDocPages();

		setProjects(loadedProjects);
		setDocPages(loadedDocPages);
		setSelectedProject(loadedProjects[0]);
	}, []);

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "success"
	) => {
		const icons = {
			success: <FiCheck className="h-5 w-5" />,
			error: <FiX className="h-5 w-5" />,
			info: <FiInfo className="h-5 w-5" />,
		};

		const id = Date.now();
		const newToast = {
			id,
			message,
			type,
			icon: icons[type],
		};

		setToasts((prevToasts) => [...prevToasts, newToast]);

		setTimeout(() => {
			setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
		}, 3000);
	};

	const filteredDocPages = docPages
		.filter(
			(doc) =>
				(selectedProject === null || doc.projectId === selectedProject.id) &&
				(statusFilter === "all" || doc.status === statusFilter) &&
				(priorityFilter === "all" || doc.priority === priorityFilter) &&
				(tagFilter === "all" || doc.tags.includes(tagFilter)) &&
				(searchQuery === "" ||
					doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					doc.tags.some((tag) =>
						tag.toLowerCase().includes(searchQuery.toLowerCase())
					))
		)
		.sort((a, b) => {
			if (sortField === "lastModified" || sortField === "created") {
				const dateA = new Date(a[sortField]).getTime();
				const dateB = new Date(b[sortField]).getTime();
				return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
			} else if (sortField === "viewCount") {
				const numA = a[sortField] || 0;
				const numB = b[sortField] || 0;
				return sortDirection === "asc" ? numA - numB : numB - numA;
			} else {
				const valueA = String(a[sortField]).toLowerCase();
				const valueB = String(b[sortField]).toLowerCase();
				return sortDirection === "asc"
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			}
		});

	const allTags = Array.from(
		new Set(docPages.flatMap((doc) => doc.tags))
	).sort();

	const paginatedDocs = filteredDocPages.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const pageCount = Math.ceil(filteredDocPages.length / itemsPerPage);

	const handleSort = (field: keyof DocPage) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const handleStatusFilterChange = (status: DocStatus["type"] | "all") => {
		setStatusFilter(status);
		setCurrentPage(1);
	};

	const handlePriorityFilterChange = (
		priority: DocPage["priority"] | "all"
	) => {
		setPriorityFilter(priority);
		setCurrentPage(1);
	};

	const handleTagFilterChange = (tag: string | "all") => {
		setTagFilter(tag);
		setCurrentPage(1);
	};

	const handleEditDoc = (doc: DocPage) => {
		setEditingDoc(doc);
		setIsEditModalOpen(true);
	};

	const handleDeletePrompt = (doc: DocPage) => {
		setDocToDelete(doc);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteDoc = () => {
		if (docToDelete) {
			setDocPages((docs) => docs.filter((doc) => doc.id !== docToDelete.id));
			setIsDeleteModalOpen(false);
			setDocToDelete(null);
			showToast(`"${docToDelete.title}" has been deleted`, "success");
		}
	};

	const handleSaveEdit = () => {
		if (editingDoc) {
			setDocPages((docs) =>
				docs.map((doc) => (doc.id === editingDoc.id ? editingDoc : doc))
			);
			setIsEditModalOpen(false);
			showToast(`"${editingDoc.title}" has been updated`, "success");
			setEditingDoc(null);
		}
	};

	const handleCreateDoc = () => {
		if (!newDocData.title) {
			showToast("Title is required", "error");
			return;
		}

		const newDoc: DocPage = {
			id: docPages.length + 1,
			title: newDocData.title,
			projectId: selectedProject?.id || 1,
			status: newDocData.status,
			author: currentUser,
			lastModified: new Date(),
			created: new Date(),
			tags: newDocData.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag),
			description: newDocData.description,
			path: `/docs/${docPages.length + 1}`,
			viewCount: 0,
			priority: newDocData.priority,
		};

		setDocPages([...docPages, newDoc]);
		showToast(`"${newDoc.title}" has been created`, "success");
		setNewDocData({
			title: "",
			description: "",
			tags: "",
			status: "draft",
			priority: "medium",
		});
		setIsCreateModalOpen(false);
	};

	const handleDuplicateDoc = (doc: DocPage) => {
		const duplicatedDoc: DocPage = {
			...doc,
			id: docPages.length + 1,
			title: `${doc.title} (Copy)`,
			created: new Date(),
			lastModified: new Date(),
			status: "draft",
			viewCount: 0,
		};

		setDocPages([...docPages, duplicatedDoc]);
		showToast(`"${doc.title}" has been duplicated`, "success");
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle("dark");
	};

	return (
		<div
			className={`flex flex-col min-h-screen transition-colors duration-200 ${
				darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
			}`}
		>
			{}
			<header
				className={`${
					darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
				} border-b shadow-sm sticky top-0 z-20`}
			>
				<div className="flex items-center justify-between px-6 py-3">
					<div className="flex items-center">
						<div className="text-blue-600 text-2xl font-bold mr-2 flex items-center">
							<MdDashboard className="inline-block mr-2" />
							<span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
								DocCraft
							</span>
						</div>
						<nav className="hidden md:flex ml-10">
							{projects.map((project) => (
								<button
									key={project.id}
									className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg 
                                    ${
																			activeTab === `${project.name}`
																				? "text-blue-600 border-blue-600"
																				: `${
																						darkMode
																							? "text-gray-300 border-transparent hover:text-blue-400"
																							: "text-gray-500 border-transparent hover:text-blue-600"
																				  }`
																		}  flex items-center justify-between transition-colors`}
									onClick={() => {
										setActiveTab(`${project.name}`);
										setSelectedProject(project);
										setIsProjectDropdownOpen(false);
									}}
								>
									<span className="flex items-center">
										<span className="mr-2">{project.icon}</span>
										<span className="truncate">{project.name}</span>
									</span>
								</button>
							))}
						</nav>
					</div>
					<div className="flex items-center space-x-4">
						<button
							onClick={toggleDarkMode}
							className={`p-2 rounded-full transition-colors ${
								darkMode
									? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							{darkMode ? (
								<MdLightMode className="h-5 w-5" />
							) : (
								<MdDarkMode className="h-5 w-5" />
							)}
						</button>

						<div className="relative">
							<button
								onClick={() => setShowNotifications(!showNotifications)}
								className={`p-2 rounded-full transition-colors ${
									darkMode
										? "bg-gray-700 text-gray-200 hover:bg-gray-600"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								<IoMdNotificationsOutline className="h-5 w-5" />
								<span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
							</button>

							{showNotifications && (
								<div
									className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg ${
										darkMode
											? "bg-gray-800 ring-gray-700"
											: "bg-white ring-black"
									} ring-1 ring-opacity-5 z-50`}
								>
									<div
										className={`py-2 px-4 border-b ${
											darkMode ? "border-gray-700" : "border-gray-200"
										} font-medium`}
									>
										Notifications
									</div>
									<div className="max-h-96 overflow-y-auto">
										<div
											className={`px-4 py-3 ${
												darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
											} cursor-pointer`}
										>
											<div className="flex items-start">
												<div
													className={`h-8 w-8 rounded-full ${
														darkMode ? "bg-blue-800" : "bg-blue-100"
													} text-blue-500 flex items-center justify-center mr-3`}
												>
													<FiInfo className="h-4 w-4" />
												</div>
												<div className="flex-1">
													<p
														className={`text-sm font-medium ${
															darkMode ? "text-gray-200" : "text-gray-900"
														}`}
													>
														Document approved
													</p>
													<p
														className={`text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														Your document "API Authentication" has been approved
														and published.
													</p>
													<p className="text-xs text-gray-400 mt-1">
														2 hours ago
													</p>
												</div>
											</div>
										</div>
										<div
											className={`px-4 py-3 ${
												darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
											} cursor-pointer`}
										>
											<div className="flex items-start">
												<div
													className={`h-8 w-8 rounded-full ${
														darkMode ? "bg-yellow-800" : "bg-yellow-100"
													} text-yellow-500 flex items-center justify-center mr-3`}
												>
													<FiAlertCircle className="h-4 w-4" />
												</div>
												<div className="flex-1">
													<p
														className={`text-sm font-medium ${
															darkMode ? "text-gray-200" : "text-gray-900"
														}`}
													>
														Review requested
													</p>
													<p
														className={`text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														Sarah Johnson has requested your review on "Error
														Handling".
													</p>
													<p className="text-xs text-gray-400 mt-1">
														Yesterday
													</p>
												</div>
											</div>
										</div>
										<div
											className={`px-4 py-3 ${
												darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
											} cursor-pointer`}
										>
											<div className="flex items-start">
												<div
													className={`h-8 w-8 rounded-full ${
														darkMode ? "bg-green-800" : "bg-green-100"
													} text-green-500 flex items-center justify-center mr-3`}
												>
													<FiCheck className="h-4 w-4" />
												</div>
												<div className="flex-1">
													<p
														className={`text-sm font-medium ${
															darkMode ? "text-gray-200" : "text-gray-900"
														}`}
													>
														Project completed
													</p>
													<p
														className={`text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														"User Guide" project has been completed. All
														documents published.
													</p>
													<p className="text-xs text-gray-400 mt-1">
														3 days ago
													</p>
												</div>
											</div>
										</div>
									</div>
									<div
										className={`py-2 px-4 text-center border-t ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
									>
										<button
											className={`text-sm text-blue-500 ${
												darkMode ? "hover:text-blue-400" : "hover:text-blue-700"
											}`}
										>
											View all notifications
										</button>
									</div>
								</div>
							)}
						</div>

						<div className="flex items-center">
							<div
								className={`w-9 h-9 rounded-full ${
									darkMode
										? "bg-blue-800 text-blue-200"
										: "bg-blue-100 text-blue-600"
								} flex items-center justify-center font-medium`}
							>
								{currentUser.avatar}
							</div>
							<div className="ml-3 hidden md:block">
								<div
									className={`text-sm font-medium ${
										darkMode ? "text-gray-200" : "text-gray-900"
									}`}
								>
									{currentUser.name}
								</div>
								<div className="text-xs text-gray-500">{currentUser.role}</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="flex-1 px-6 py-8">
				{}
				<div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-1">
						<div
							className={`relative ${
								darkMode ? "bg-gray-800" : "bg-white"
							} rounded-lg shadow-sm p-4`}
						>
							<h2
								className={`text-lg font-semibold mb-4 ${
									darkMode ? "text-gray-100" : "text-gray-800"
								}`}
							>
								<AiOutlineProject className="inline-block mr-2 text-blue-500" />
								Project
							</h2>

							<div className="relative inline-block text-left w-full">
								<button
									type="button"
									className={`inline-flex justify-between items-center w-full rounded-md ${
										darkMode
											? "bg-gray-700 border-gray-600 hover:bg-gray-600"
											: "bg-white border-gray-300 hover:bg-gray-50"
									} border shadow-sm px-4 py-2 text-sm font-medium ${
										darkMode ? "text-gray-200" : "text-gray-700"
									} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
									onClick={() =>
										setIsProjectDropdownOpen(!isProjectDropdownOpen)
									}
								>
									<span className="flex items-center truncate">
										<span className="mr-2">
											{selectedProject ? (
												selectedProject.icon
											) : (
												<FaFolderOpen className="h-5 w-5 text-gray-500" />
											)}
										</span>
										{selectedProject?.name || "All Projects"}
									</span>
									<FiChevronDown
										className={`h-5 w-5 ${
											darkMode ? "text-gray-400" : "text-gray-500"
										} transition-transform duration-200 ${
											isProjectDropdownOpen ? "transform rotate-180" : ""
										}`}
									/>
								</button>

								{isProjectDropdownOpen && (
									<div
										className={`origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg ${
											darkMode
												? "bg-gray-700 ring-gray-700"
												: "bg-white ring-black"
										} ring-1 ring-opacity-5 z-10 transition-all duration-200 ease-in-out`}
									>
										<div
											className="py-1 max-h-60 overflow-y-auto"
											role="menu"
											aria-orientation="vertical"
											aria-labelledby="options-menu"
										>
											<button
												className={`w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-200 hover:bg-gray-600"
														: "text-gray-700 hover:bg-gray-100"
												} flex items-center transition-colors`}
												onClick={() => {
													setSelectedProject(null);
													setIsProjectDropdownOpen(false);
												}}
											>
												<span className="mr-2">
													<FaFolderOpen className="h-5 w-5 text-gray-500" />
												</span>
												All Projects
											</button>
											{projects.map((project) => (
												<button
													key={project.id}
													className={`w-full text-left px-4 py-2 text-sm ${
														darkMode
															? "text-gray-200 hover:bg-gray-600"
															: "text-gray-700 hover:bg-gray-100"
													}  flex items-center justify-between transition-colors`}
													onClick={() => {
														setSelectedProject(project);
														setIsProjectDropdownOpen(false);
													}}
												>
													<span className="flex items-center">
														<span className="mr-2">{project.icon}</span>
														<span className="truncate">{project.name}</span>
													</span>
												</button>
											))}
										</div>
									</div>
								)}
							</div>

							{selectedProject && (
								<div className="mt-4">
									<div className="flex mt-4 justify-between">
										<div
											className={`text-center px-2 py-2 rounded-lg ${
												darkMode ? "bg-gray-700" : "bg-gray-50"
											}`}
										>
											<div className="text-lg font-semibold text-amber-500">
												{
													docPages.filter(
														(doc) =>
															doc.projectId === selectedProject.id &&
															doc.status === "draft"
													).length
												}
											</div>
											<div
												className={`text-xs ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Drafts
											</div>
										</div>
										<div
											className={`text-center px-2 py-2 rounded-lg ${
												darkMode ? "bg-gray-700" : "bg-gray-50"
											}`}
										>
											<div className="text-lg font-semibold text-blue-500">
												{
													docPages.filter(
														(doc) =>
															doc.projectId === selectedProject.id &&
															doc.status === "review"
													).length
												}
											</div>
											<div
												className={`text-xs ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												In Review
											</div>
										</div>
										<div
											className={`text-center px-2 py-2 rounded-lg ${
												darkMode ? "bg-gray-700" : "bg-gray-50"
											}`}
										>
											<div className="text-lg font-semibold text-emerald-500">
												{
													docPages.filter(
														(doc) =>
															doc.projectId === selectedProject.id &&
															doc.status === "published"
													).length
												}
											</div>
											<div
												className={`text-xs ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Published
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="lg:col-span-3">
						<div className="flex flex-col md:flex-row gap-4">
							<div
								className={`flex-1 ${
									darkMode ? "bg-gray-800" : "bg-white"
								} rounded-lg shadow-sm p-4`}
							>
								<div className="flex items-center">
									<div
										className={`p-3 rounded-full mr-4 ${
											darkMode ? "bg-blue-900" : "bg-blue-100"
										}`}
									>
										<HiDocumentText className="h-6 w-6 text-blue-500" />
									</div>
									<div>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Total Documents
										</p>
										<h3
											className={`text-2xl font-bold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											{selectedProject
												? docPages.filter(
														(doc) => doc.projectId === selectedProject.id
												  ).length
												: docPages.length}
										</h3>
									</div>
								</div>
								<div
									className={`mt-4 h-2  ${
										darkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-full overflow-hidden`}
								>
									{" "}
									<div
										className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
										style={{ width: "75%" }}
									></div>
								</div>
								<p className="text-xs text-gray-500 mt-2">75% of target</p>
							</div>

							<div
								className={`flex-1 ${
									darkMode ? "bg-gray-800" : "bg-white"
								} rounded-lg shadow-sm p-4`}
							>
								<div className="flex items-center">
									<div
										className={`p-3 rounded-full mr-4 ${
											darkMode ? "bg-emerald-900" : "bg-emerald-100"
										}`}
									>
										<FiCheckCircle className="h-6 w-6 text-emerald-500" />
									</div>
									<div>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Completed This Month
										</p>
										<h3
											className={`text-2xl font-bold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											{
												docPages.filter(
													(doc) =>
														doc.status === "published" &&
														new Date(doc.lastModified).getMonth() ===
															new Date().getMonth()
												).length
											}
										</h3>
									</div>
								</div>
								<div
									className={`mt-4 h-2  ${
										darkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-full overflow-hidden`}
								>
									<div
										className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
										style={{ width: "60%" }}
									></div>
								</div>
								<p className="text-xs text-gray-500 mt-2">
									60% increase from last month
								</p>
							</div>

							<div
								className={`flex-1 ${
									darkMode ? "bg-gray-800" : "bg-white"
								} rounded-lg shadow-sm p-4`}
							>
								<div className="flex items-center">
									<div
										className={`p-3 rounded-full mr-4 ${
											darkMode ? "bg-amber-900" : "bg-amber-100"
										}`}
									>
										<FiClock className="h-6 w-6 text-amber-500" />
									</div>
									<div>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Pending Review
										</p>
										<h3
											className={`text-2xl font-bold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											{docPages.filter((doc) => doc.status === "review").length}
										</h3>
									</div>
								</div>
								<div
									className={`mt-4 h-2  ${
										darkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-full overflow-hidden`}
								>
									<div
										className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
										style={{ width: "40%" }}
									></div>
								</div>
								<p className="text-xs text-gray-500 mt-2">
									40% of all documents
								</p>
							</div>
						</div>
					</div>
				</div>

				{}
				<div
					className={`mb-6 ${
						darkMode ? "bg-gray-800" : "bg-white"
					} rounded-lg shadow-sm p-4`}
				>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div className="relative rounded-md shadow-sm w-full md:w-auto">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiSearch
									className={`h-5 w-5 ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								/>
							</div>
							<input
								type="text"
								className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 sm:text-sm ${
									darkMode
										? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
										: "border-gray-300 text-gray-900 placeholder-gray-400"
								} rounded-md transition-colors`}
								placeholder="Search documents..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
							/>
						</div>

						<div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
							<div className="relative inline-block text-left">
								<select
									className={`block ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-700"
									} border rounded-md shadow-sm pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors`}
									value={statusFilter}
									onChange={(e) =>
										handleStatusFilterChange(
											e.target.value as DocStatus["type"] | "all"
										)
									}
								>
									<option value="all">All Statuses</option>
									<option value="draft">Draft</option>
									<option value="review">In Review</option>
									<option value="published">Published</option>
								</select>
							</div>

							<div className="relative inline-block text-left">
								<select
									className={`block ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-700"
									} border rounded-md shadow-sm pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors`}
									value={priorityFilter}
									onChange={(e) =>
										handlePriorityFilterChange(
											e.target.value as DocPage["priority"] | "all"
										)
									}
								>
									<option value="all">All Priorities</option>
									<option value="high">High</option>
									<option value="medium">Medium</option>
									<option value="low">Low</option>
								</select>
							</div>

							<div className="relative inline-block text-left">
								<select
									className={`block ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-700"
									} border rounded-md shadow-sm pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors`}
									value={tagFilter}
									onChange={(e) => handleTagFilterChange(e.target.value)}
								>
									<option value="all">All Tags</option>
									{allTags.map((tag) => (
										<option key={tag} value={tag}>
											{tag}
										</option>
									))}
								</select>
							</div>

							<div className="relative inline-block text-left">
								<select
									className={`block ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-700"
									} border rounded-md shadow-sm pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors`}
									value={sortField}
									onChange={(e) => {
										setSortField(e.target.value as keyof DocPage);
										setSortDirection("desc");
									}}
								>
									<option value="title">Sort by Title</option>
									<option value="lastModified">Sort by Last Modified</option>

									<option value="viewCount">Sort by Views</option>
								</select>
							</div>

							<button
								onClick={() =>
									setSortDirection(sortDirection === "asc" ? "desc" : "asc")
								}
								className={`p-2 rounded-md ${
									darkMode
										? "bg-gray-700 text-gray-200 hover:bg-gray-600"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								} transition-colors`}
							>
								{sortDirection === "asc" ? (
									<FiArrowUp className="h-5 w-5" />
								) : (
									<FiArrowDown className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{}
					{(statusFilter !== "all" ||
						priorityFilter !== "all" ||
						tagFilter !== "all" ||
						searchQuery) && (
						<div className="mt-4 flex flex-wrap items-center gap-2">
							<span
								className={`text-xs ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Applied filters:
							</span>

							{searchQuery && (
								<span
									className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
										darkMode
											? "bg-gray-700 text-gray-200"
											: "bg-gray-100 text-gray-800"
									}`}
								>
									Search: {searchQuery}
									<button
										onClick={() => setSearchQuery("")}
										className="ml-1 text-gray-500 hover:text-gray-700"
									>
										<FiX className="h-3 w-3" />
									</button>
								</span>
							)}

							{statusFilter !== "all" && (
								<span
									className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
										darkMode ? "bg-gray-700" : "bg-gray-100"
									} ${statusMap[statusFilter as DocStatus["type"]].color}`}
								>
									Status: {statusMap[statusFilter as DocStatus["type"]].label}
									<button
										onClick={() => setStatusFilter("all")}
										className="ml-1 text-gray-500 hover:text-gray-700"
									>
										<FiX className="h-3 w-3" />
									</button>
								</span>
							)}

							{priorityFilter !== "all" && (
								<span
									className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
										darkMode
											? "bg-gray-700 text-gray-200"
											: "bg-gray-100 text-gray-800"
									}`}
								>
									Priority: {priorityFilter}
									<button
										onClick={() => setPriorityFilter("all")}
										className="ml-1 text-gray-500 hover:text-gray-700"
									>
										<FiX className="h-3 w-3" />
									</button>
								</span>
							)}

							{tagFilter !== "all" && (
								<span
									className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
										darkMode
											? "bg-blue-900 text-blue-200"
											: "bg-blue-100 text-blue-800"
									}`}
								>
									Tag: {tagFilter}
									<button
										onClick={() => setTagFilter("all")}
										className="ml-1 text-blue-500 hover:text-blue-700"
									>
										<FiX className="h-3 w-3" />
									</button>
								</span>
							)}

							<button
								onClick={() => {
									setSearchQuery("");
									setStatusFilter("all");
									setPriorityFilter("all");
									setTagFilter("all");
									setCurrentPage(1);
								}}
								className="text-xs text-blue-500 hover:text-blue-700 ml-2"
							>
								Clear all
							</button>
						</div>
					)}
				</div>

				{}
				<div
					className={`${
						darkMode
							? "bg-gray-800 border-gray-700"
							: "bg-white border-gray-200"
					} shadow overflow-hidden sm:rounded-lg border`}
				>
					{paginatedDocs.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12">
							<div
								className={`p-4 rounded-full ${
									darkMode ? "bg-gray-700" : "bg-gray-100"
								} mb-4`}
							>
								<HiOutlineDocumentDuplicate className="h-8 w-8 text-gray-400" />
							</div>
							<h3
								className={`text-lg font-medium ${
									darkMode ? "text-gray-200" : "text-gray-900"
								}`}
							>
								No documents found
							</h3>
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								} max-w-sm text-center mt-2`}
							>
								Try adjusting your search or filter criteria, or create a new
								document to get started.
							</p>
							<button
								onClick={() => setIsCreateModalOpen(true)}
								className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								<FiPlus className="mr-2 h-4 w-4" />
								Create Document
							</button>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table
								className={`min-w-full divide-y  ${
									darkMode ? "divide-gray-700" : "divide-gray-200"
								}`}
							>
								<thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
									<tr>
										<th
											scope="col"
											className={`px-6 py-3 text-left text-xs font-medium ${
												darkMode ? "text-gray-300" : "text-gray-500"
											} uppercase tracking-wider cursor-pointer`}
											onClick={() => handleSort("title")}
										>
											<div className="flex items-center">
												Title
												{sortField === "title" &&
													(sortDirection === "asc" ? (
														<FiArrowUp className="ml-1 h-4 w-4" />
													) : (
														<FiArrowDown className="ml-1 h-4 w-4" />
													))}
											</div>
										</th>
										<th
											scope="col"
											className={`px-6 py-3 text-left text-xs font-medium ${
												darkMode ? "text-gray-300" : "text-gray-500"
											} uppercase tracking-wider`}
										>
											<div className="flex items-center">Status</div>
										</th>
										<th
											scope="col"
											className={`px-6 py-3 text-left text-xs font-medium ${
												darkMode ? "text-gray-300" : "text-gray-500"
											} uppercase tracking-wider cursor-pointer`}
											onClick={() => handleSort("lastModified")}
										>
											<div className="flex items-center">
												Last Modified
												{sortField === "lastModified" &&
													(sortDirection === "asc" ? (
														<FiArrowUp className="ml-1 h-4 w-4" />
													) : (
														<FiArrowDown className="ml-1 h-4 w-4" />
													))}
											</div>
										</th>
										<th
											scope="col"
											className={`px-6 py-3 text-left text-xs font-medium ${
												darkMode ? "text-gray-300" : "text-gray-500"
											} uppercase tracking-wider`}
										>
											Tags
										</th>
										<th
											scope="col"
											className={`px-6 py-3 text-right text-xs font-medium ${
												darkMode ? "text-gray-300" : "text-gray-500"
											} uppercase tracking-wider`}
										>
											Actions
										</th>
									</tr>
								</thead>
								<tbody
									className={`${
										darkMode
											? "bg-gray-800 divide-gray-700"
											: "bg-white divide-gray-200"
									}`}
								>
									{paginatedDocs.map((doc) => (
										<tr
											key={doc.id}
											className={`group ${
												darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
											} transition-colors`}
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div
														className={`flex-shrink-0 h-8 w-8 rounded-md ${
															darkMode ? "bg-gray-700" : "bg-blue-50"
														} flex items-center justify-center`}
													>
														<HiDocumentText
															className={`h-5 w-5 ${
																doc.priority === "high"
																	? "text-red-500"
																	: doc.priority === "medium"
																	? "text-blue-500"
																	: "text-gray-400"
															}`}
														/>
													</div>
													<div className="ml-4">
														<div
															className={`text-sm font-medium ${
																darkMode ? "text-gray-200" : "text-gray-900"
															}`}
														>
															{doc.title}
														</div>
														<div
															className={`text-xs ${
																darkMode ? "text-gray-400" : "text-gray-500"
															} max-w-xs truncate`}
														>
															{doc.description}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
														statusMap[doc.status].bgColor
													} ${statusMap[doc.status].color} items-center`}
												>
													{statusMap[doc.status].icon}
													{statusMap[doc.status].label}
												</span>
												{doc.priority === "high" && (
													<span className="ml-2 px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">
														Priority
													</span>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div
													className={`text-sm ${
														darkMode ? "text-gray-300" : "text-gray-900"
													}`}
												>
													{formatDate(doc.lastModified)}
												</div>
												<div className="text-xs text-gray-500">
													{getTimeAgo(doc.lastModified)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex flex-wrap gap-1">
													{doc.tags.map((tag, index) => (
														<span
															key={index}
															className={`${
																darkMode
																	? "bg-blue-900 text-blue-200"
																	: "bg-blue-100 text-blue-800"
															} text-xs px-2 py-0.5 rounded-full`}
														>
															{tag}
														</span>
													))}
													{doc.tags.length === 0 && (
														<span className="text-xs text-gray-400">
															No tags
														</span>
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<button
														onClick={() => handleEditDoc(doc)}
														className={`${
															darkMode
																? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
																: "text-blue-600 hover:text-blue-900 hover:bg-blue-50"
														} p-1.5 rounded-full   transition-colors`}
														title="Edit"
													>
														<FiEdit className="h-4 w-4" />
													</button>
													<button
														onClick={() => handleDuplicateDoc(doc)}
														className={`${
															darkMode
																? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
																: "text-purple-600 hover:text-purple-900 hover:bg-purple-50"
														} p-1.5 rounded-full  transition-colors`}
														title="Duplicate"
													>
														<HiOutlineDocumentDuplicate className="h-4 w-4" />
													</button>
													<button
														onClick={() => handleDeletePrompt(doc)}
														className={`${
															darkMode
																? "text-red-400 hover:text-red-300 hover:bg-red-900/30"
																: "text-red-600 hover:text-red-900 hover:bg-red-50"
														} p-1.5 rounded-full transition-colors`}
														title="Delete"
													>
														<FiTrash2 className="h-4 w-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{}
					{filteredDocPages.length > itemsPerPage && (
						<div
							className={`${
								darkMode
									? "bg-gray-800 border-t border-gray-700"
									: "bg-white border-t border-gray-200"
							} px-4 py-3 flex items-center justify-between`}
						>
							<div
								className={`hidden sm:flex-1 sm:flex sm:items-center sm:justify-between`}
							>
								<div>
									<p
										className={`text-sm ${
											darkMode ? "text-gray-400" : "text-gray-700"
										}`}
									>
										Showing{" "}
										<span className="font-medium">
											{Math.min(
												(currentPage - 1) * itemsPerPage + 1,
												filteredDocPages.length
											)}
										</span>{" "}
										to{" "}
										<span className="font-medium">
											{Math.min(
												currentPage * itemsPerPage,
												filteredDocPages.length
											)}
										</span>{" "}
										of{" "}
										<span className="font-medium">
											{filteredDocPages.length}
										</span>{" "}
										results
									</p>
								</div>
								<div>
									<nav
										className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
										aria-label="Pagination"
									>
										<button
											onClick={() =>
												setCurrentPage(Math.max(1, currentPage - 1))
											}
											disabled={currentPage === 1}
											className={`relative inline-flex items-center px-2 py-2 rounded-l-md ${
												darkMode
													? "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:text-gray-600 disabled:hover:bg-gray-800"
													: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-white"
											} border text-sm font-medium`}
										>
											<span className="sr-only">Previous</span>
											<FiArrowLeft className="h-5 w-5" />
										</button>

										{Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
											const pageNum =
												currentPage <= 3
													? i + 1
													: currentPage >= pageCount - 2
													? pageCount - 4 + i
													: currentPage - 2 + i;

											if (pageNum <= pageCount) {
												return (
													<button
														key={pageNum}
														onClick={() => setCurrentPage(pageNum)}
														className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
															currentPage === pageNum
																? darkMode
																	? "z-10 border-blue-600 bg-blue-900 text-blue-200"
																	: "z-10 border-blue-500 bg-blue-50 text-blue-600"
																: darkMode
																? "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
																: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
														}`}
													>
														{pageNum}
													</button>
												);
											}
											return null;
										})}

										{pageCount > 5 && currentPage < pageCount - 2 && (
											<>
												<span
													className={`relative inline-flex items-center px-4 py-2 border ${
														darkMode
															? "border-gray-700 bg-gray-800 text-gray-400"
															: "border-gray-300 bg-white text-gray-700"
													}`}
												>
													...
												</span>
												<button
													onClick={() => setCurrentPage(pageCount)}
													className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
														darkMode
															? "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
															: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
													}`}
												>
													{pageCount}
												</button>
											</>
										)}

										<button
											onClick={() =>
												setCurrentPage(Math.min(pageCount, currentPage + 1))
											}
											disabled={currentPage === pageCount}
											className={`relative inline-flex items-center px-2 py-2 rounded-r-md ${
												darkMode
													? "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:text-gray-600 disabled:hover:bg-gray-800"
													: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-white"
											} border text-sm font-medium`}
										>
											<span className="sr-only">Next</span>
											<FiArrowRight className="h-5 w-5" />
										</button>
									</nav>
								</div>
							</div>
						</div>
					)}
				</div>

				{}
				<button
					className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-40 transform hover:scale-110"
					onClick={() => setIsCreateModalOpen(true)}
				>
					<FiPlus className="h-6 w-6" />
				</button>
			</main>

			{}
			<footer
				className={`${
					darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
				} border-t py-6`}
			>
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div className="mb-6 md:mb-0">
							<div className="flex items-center">
								<MdDashboard className="text-blue-600 h-6 w-6 mr-2" />
								<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
									DocCraft
								</span>
							</div>
							<p
								className={`mt-2 text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								The professional technical documentation platform
							</p>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-3 gap-8">
							<div>
								<h3
									className={`text-sm font-semibold uppercase tracking-wider ${
										darkMode ? "text-gray-300" : "text-gray-900"
									}`}
								>
									Product
								</h3>
								<ul className="mt-4 space-y-2">
									<li>
										<a
											href="#"
											className={`text-sm ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											Features
										</a>
									</li>
									<li>
										<a
											href="#"
											className={`text-sm ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											Pricing
										</a>
									</li>
									<li>
										<a
											href="#"
											className={`text-sm ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											API
										</a>
									</li>
									<li>
										<a
											href="#"
											className={`text-sm ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											Integrations
										</a>
									</li>
								</ul>
							</div>

							<div>
								<h3
									className={`text-sm font-semibold uppercase tracking-wider ${
										darkMode ? "text-gray-300" : "text-gray-900"
									}`}
								>
									Resources
								</h3>
								<ul className="mt-4 space-y-2">
									<li>
										<a
											href="#"
											className={`text-sm ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											Documentation
										</a>
									</li>
									<li>
										<a
											href="#"
											className={`text-sm ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											Tutorials
										</a>
									</li>
									<li>
										<a
											href="#"
											className={`text-sm ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											Blog
										</a>
									</li>
									<li>
										<a
											href="#"
											className={`text-sm ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											Support
										</a>
									</li>
								</ul>
							</div>

							<div className="col-span-2 md:col-span-1">
								<h3
									className={`text-sm font-semibold uppercase tracking-wider ${
										darkMode ? "text-gray-300" : "text-gray-900"
									}`}
								>
									Connect
								</h3>
								<ul className="mt-4 space-y-2">
									<li>
										<a
											href="#"
											className={`text-sm flex items-center ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											<AiOutlineGlobal className="h-4 w-4 mr-2" />
											Website
										</a>
									</li>
									<li>
										<a
											href="#"
											className={`text-sm flex items-center ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											<AiOutlineTeam className="h-4 w-4 mr-2" />
											Community
										</a>
									</li>
									<li>
										<a
											href="#"
											className={`text-sm flex items-center ${
												darkMode
													? "text-gray-400 hover:text-gray-200"
													: "text-gray-500 hover:text-gray-900"
											}`}
										>
											<BiLinkExternal className="h-4 w-4 mr-2" />
											Contact Us
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div
						className={`mt-8 pt-8 ${
							darkMode ? "border-t border-gray-700" : "border-t border-gray-200"
						}`}
					>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between">
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								© 2025 DocCraft. Documentation in hand.
							</p>
							<div className="mt-4 md:mt-0 flex space-x-6">
								<a
									href="#"
									className={`text-sm ${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-500 hover:text-gray-900"
									}`}
								>
									Privacy Policy
								</a>
								<a
									href="#"
									className={`text-sm ${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-500 hover:text-gray-900"
									}`}
								>
									Terms of Service
								</a>
								<a
									href="#"
									className={`text-sm ${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-500 hover:text-gray-900"
									}`}
								>
									Cookie Policy
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>

			{}
			<div className="fixed bottom-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`max-w-md rounded-lg shadow-lg p-4 flex items-center space-x-3 transform transition-all duration-300 ease-out translate-y-0 opacity-100 ${
							toast.type === "success"
								? `bg-green-50 text-green-800 ${
										darkMode ? "bg-green-900 text-green-200" : ""
								  }`
								: toast.type === "error"
								? `bg-red-50 text-red-800 ${
										darkMode ? "bg-red-900 text-red-200" : ""
								  }`
								: `bg-blue-50 text-blue-800 ${
										darkMode ? "bg-blue-900 text-blue-200" : ""
								  }`
						}`}
					>
						<div
							className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
								toast.type === "success"
									? `bg-green-100 text-green-500 ${
											darkMode ? "bg-green-800 text-green-300" : ""
									  }`
									: toast.type === "error"
									? `bg-red-100 text-red-500 ${
											darkMode ? "bg-red-800 text-red-300" : ""
									  }`
									: `bg-blue-100 text-blue-500 ${
											darkMode ? "bg-blue-800 text-blue-300" : ""
									  }`
							}`}
						>
							{toast.icon}
						</div>
						<div className="flex-1 ml-2">
							<p className="text-sm font-medium">{toast.message}</p>
						</div>
						<button
							onClick={() => setToasts(toasts.filter((t) => t.id !== toast.id))}
							className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500"
						>
							<FiX className="h-4 w-4" />
						</button>
					</div>
				))}
			</div>

			{}
			{isCreateModalOpen && (
				<div
					className="fixed inset-0 z-50 overflow-y-auto"
					aria-labelledby="modal-title"
					role="dialog"
					aria-modal="true"
				>
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
							aria-hidden="true"
						></div>
						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<div
							className={`inline-block align-bottom ${
								darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
							} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
						>
							<div
								className={`flex items-center justify-between p-4 border-b ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								{" "}
								<h3 className="text-lg font-medium" id="modal-title">
									Create New Document
								</h3>
								<button
									onClick={() => setIsCreateModalOpen(false)}
									className={`rounded-md ${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-400 hover:text-gray-500"
									} focus:outline-none`}
								>
									<FiX className="h-5 w-5" />
								</button>
							</div>
							<div className="p-6 space-y-6">
								<div>
									<label
										htmlFor="title"
										className={`block text-sm font-medium ${
											darkMode ? "text-gray-200" : "text-gray-700"
										}`}
									>
										Title <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="title"
										id="title"
										className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
												: "border-gray-300 text-gray-900 placeholder-gray-400"
										}`}
										value={newDocData.title}
										onChange={(e) =>
											setNewDocData({
												...newDocData,
												title: e.target.value,
											})
										}
										placeholder="Enter document title"
									/>
								</div>

								<div>
									<label
										htmlFor="description"
										className={`block text-sm font-medium ${
											darkMode ? "text-gray-200" : "text-gray-700"
										}`}
									>
										Description
									</label>
									<textarea
										name="description"
										id="description"
										rows={3}
										className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
												: "border-gray-300 text-gray-900 placeholder-gray-400"
										}`}
										value={newDocData.description}
										onChange={(e) =>
											setNewDocData({
												...newDocData,
												description: e.target.value,
											})
										}
										placeholder="Enter document description"
									></textarea>
								</div>

								<div>
									<label
										htmlFor="tags"
										className={`block text-sm font-medium ${
											darkMode ? "text-gray-200" : "text-gray-700"
										}`}
									>
										Tags (comma separated)
									</label>
									<input
										type="text"
										name="tags"
										id="tags"
										className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
												: "border-gray-300 text-gray-900 placeholder-gray-400"
										}`}
										value={newDocData.tags}
										onChange={(e) =>
											setNewDocData({
												...newDocData,
												tags: e.target.value,
											})
										}
										placeholder="api, frontend, tutorial"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="status"
											className={`block text-sm font-medium ${
												darkMode ? "text-gray-200" : "text-gray-700"
											}`}
										>
											Status
										</label>
										<select
											id="status"
											name="status"
											className={`mt-1 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white"
													: "border-gray-300 text-gray-900"
											} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
											value={newDocData.status}
											onChange={(e) =>
												setNewDocData({
													...newDocData,
													status: e.target.value as DocStatus["type"],
												})
											}
										>
											<option value="draft">Draft</option>
											<option value="review">In Review</option>
											<option value="published">Published</option>
										</select>
									</div>

									<div>
										<label
											htmlFor="priority"
											className={`block text-sm font-medium ${
												darkMode ? "text-gray-200" : "text-gray-700"
											}`}
										>
											Priority
										</label>
										<select
											id="priority"
											name="priority"
											className={`mt-1 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white"
													: "border-gray-300 text-gray-900"
											} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
											value={newDocData.priority}
											onChange={(e) =>
												setNewDocData({
													...newDocData,
													priority: e.target.value as DocPage["priority"],
												})
											}
										>
											<option value="low">Low</option>
											<option value="medium">Medium</option>
											<option value="high">High</option>
										</select>
									</div>
								</div>
							</div>

							<div
								className={`px-4 py-3 ${
									darkMode ? "bg-gray-700" : "bg-gray-50"
								} sm:px-6 sm:flex sm:flex-row-reverse`}
							>
								<button
									type="button"
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
									onClick={handleCreateDoc}
								>
									Create
								</button>
								<button
									type="button"
									className={`mt-3 w-full inline-flex justify-center rounded-md border ${
										darkMode
											? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
											: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
									} shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
									onClick={() => setIsCreateModalOpen(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{}
			{isEditModalOpen && editingDoc && (
				<div
					className="fixed inset-0 z-50 overflow-y-auto"
					aria-labelledby="modal-title"
					role="dialog"
					aria-modal="true"
				>
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
							aria-hidden="true"
						></div>
						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<div
							className={`inline-block align-bottom ${
								darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
							} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
						>
							<div
								className={`flex items-center justify-between p-4 border-b ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								{" "}
								<h3 className="text-lg font-medium" id="modal-title">
									Edit Document
								</h3>
								<button
									onClick={() => {
										setIsEditModalOpen(false);
										setEditingDoc(null);
									}}
									className={`rounded-md ${
										darkMode
											? "text-gray-400 hover:text-gray-200"
											: "text-gray-400 hover:text-gray-500"
									} focus:outline-none`}
								>
									<FiX className="h-5 w-5" />
								</button>
							</div>

							<div className="p-6 space-y-6">
								<div>
									<label
										htmlFor="edit-title"
										className={`block text-sm font-medium ${
											darkMode ? "text-gray-200" : "text-gray-700"
										}`}
									>
										Title
									</label>
									<input
										type="text"
										name="edit-title"
										id="edit-title"
										className={`mt-1 focus:ring-blue-500 p-2 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "border-gray-300 text-gray-900"
										}`}
										value={editingDoc.title}
										onChange={(e) =>
											setEditingDoc({
												...editingDoc,
												title: e.target.value,
											})
										}
									/>
								</div>

								<div>
									<label
										htmlFor="edit-description"
										className={`block text-sm font-medium ${
											darkMode ? "text-gray-200" : "text-gray-700"
										}`}
									>
										Description
									</label>
									<textarea
										name="edit-description"
										id="edit-description"
										rows={3}
										className={`mt-1 focus:ring-blue-500 p-2 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "border-gray-300 text-gray-900"
										}`}
										value={editingDoc.description}
										onChange={(e) =>
											setEditingDoc({
												...editingDoc,
												description: e.target.value,
											})
										}
									></textarea>
								</div>

								<div>
									<label
										htmlFor="edit-tags"
										className={`block text-sm font-medium ${
											darkMode ? "text-gray-200" : "text-gray-700"
										}`}
									>
										Tags (comma separated)
									</label>
									<input
										type="text"
										name="edit-tags"
										id="edit-tags"
										className={`mt-1 focus:ring-blue-500 p-2 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "border-gray-300 text-gray-900"
										}`}
										value={editingDoc.tags.join(", ")}
										onChange={(e) =>
											setEditingDoc({
												...editingDoc,
												tags: e.target.value
													.split(",")
													.map((tag) => tag.trim())
													.filter((tag) => tag),
											})
										}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="edit-status"
											className={`block text-sm font-medium ${
												darkMode ? "text-gray-200" : "text-gray-700"
											}`}
										>
											Status
										</label>
										<select
											id="edit-status"
											name="edit-status"
											className={`mt-1 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white"
													: "border-gray-300 text-gray-900"
											} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
											value={editingDoc.status}
											onChange={(e) =>
												setEditingDoc({
													...editingDoc,
													status: e.target.value as DocStatus["type"],
												})
											}
										>
											<option value="draft">Draft</option>
											<option value="review">In Review</option>
											<option value="published">Published</option>
										</select>
									</div>

									<div>
										<label
											htmlFor="edit-priority"
											className={`block text-sm font-medium ${
												darkMode ? "text-gray-200" : "text-gray-700"
											}`}
										>
											Priority
										</label>
										<select
											id="edit-priority"
											name="edit-priority"
											className={`mt-1 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white"
													: "border-gray-300 text-gray-900"
											} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
											value={editingDoc.priority || "medium"}
											onChange={(e) =>
												setEditingDoc({
													...editingDoc,
													priority: e.target.value as DocPage["priority"],
												})
											}
										>
											<option value="low">Low</option>
											<option value="medium">Medium</option>
											<option value="high">High</option>
										</select>
									</div>
								</div>

								<div
									className={`pt-4 ${
										darkMode
											? "border-t border-gray-700"
											: "border-t border-gray-200"
									}`}
								>
									<div className="flex items-center text-sm text-gray-500">
										<FiClock className="mr-1" />
										Last modified: {formatDate(editingDoc.lastModified)}
									</div>
									<div className="flex items-center text-sm text-gray-500 mt-1">
										<FiCalendar className="mr-1" />
										Created: {formatDate(editingDoc.created)}
									</div>
								</div>
							</div>

							<div
								className={`px-4 py-3 ${
									darkMode ? "bg-gray-700" : "bg-gray-50"
								} sm:px-6 sm:flex sm:flex-row-reverse`}
							>
								<button
									type="button"
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
									onClick={handleSaveEdit}
								>
									<FiSave className="mr-2 h-4 w-4" />
									Save
								</button>
								<button
									type="button"
									className={`mt-3 w-full inline-flex justify-center rounded-md border ${
										darkMode
											? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
											: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
									} shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
									onClick={() => {
										setIsEditModalOpen(false);
										setEditingDoc(null);
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{}
			{isDeleteModalOpen && docToDelete && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
							aria-hidden="true"
						></div>
						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<div
							className={`inline-block align-bottom ${
								darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
							} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full`}
						>
							<div
								className={`${
									darkMode ? "bg-gray-800" : "bg-white"
								} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}
							>
								<div className="sm:flex sm:items-start">
									<div
										className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
											darkMode ? "bg-red-900" : "bg-red-100"
										} sm:mx-0 sm:h-10 sm:w-10`}
									>
										<FiTrash2 className="h-6 w-6 text-red-600" />
									</div>
									<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3
											className={`text-lg leading-6 font-medium ${
												darkMode ? "text-gray-100" : "text-gray-900"
											}`}
											id="modal-title"
										>
											Delete Document
										</h3>
										<div className="mt-2">
											<p
												className={`text-sm ${
													darkMode ? "text-gray-300" : "text-gray-500"
												}`}
											>
												Are you sure you want to delete "{docToDelete.title}"?
												This action cannot be undone.
											</p>
										</div>
									</div>
								</div>
							</div>
							<div
								className={`${
									darkMode ? "bg-gray-700" : "bg-gray-50"
								} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}
							>
								<button
									type="button"
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
									onClick={handleDeleteDoc}
								>
									Delete
								</button>
								<button
									type="button"
									className={`mt-3 w-full inline-flex justify-center rounded-md border ${
										darkMode
											? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
											: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
									} shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
									onClick={() => {
										setIsDeleteModalOpen(false);
										setDocToDelete(null);
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<style jsx global>
				{`
					@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

					* {
						font-family: "Poppins", sans-serif;
					}
					button,
					a {
						cursor: pointer;
					}
				`}
			</style>
		</div>
	);
}

export default TechnicalWritingDashboard;
