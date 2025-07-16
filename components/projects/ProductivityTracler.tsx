"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
	format,
	addDays,
	isToday,
	isSameDay,
	parseISO,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	getDay,
	startOfWeek,
	endOfWeek,
} from "date-fns";
import {
	FiEdit2,
	FiTrash2,
	FiCalendar,
	FiClipboard,
	FiFilter,
	FiMenu,
	FiX,
} from "react-icons/fi";
import {
	FaPlus,
	FaProjectDiagram,
	FaSearch,
	FaRegLightbulb,
} from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

type Event = {
	id: string;
	title: string;
	description: string;
	date: string;
	projectId: string;
};

type Project = {
	id: string;
	name: string;
	status: "ongoing" | "upcoming" | "completed";
	notes: string;
	color: string;
};

const fadeIn = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.3 } },
};

const slideIn = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ProductivityTracker = () => {
	const initialProjects: Project[] = [
		{
			id: "1",
			name: "Website Redesign",
			status: "ongoing",
			notes: "Need to finalize the color scheme and typography.",
			color: "bg-indigo-500",
		},
		{
			id: "2",
			name: "Mobile App Launch",
			status: "upcoming",
			notes: "Scheduled for QA testing next week.",
			color: "bg-emerald-500",
		},
		{
			id: "3",
			name: "Marketing Campaign",
			status: "completed",
			notes: "Successfully reached all KPIs.",
			color: "bg-violet-500",
		},
	];

	const initialEvents: Event[] = [
		{
			id: "1",
			title: "Team Meeting",
			description: "Weekly sprint planning",
			date: new Date().toISOString(),
			projectId: "1",
		},
		{
			id: "2",
			title: "Client Demo",
			description: "Show new features to client",
			date: addDays(new Date(), 2).toISOString(),
			projectId: "2",
		},
	];

	const [projects, setProjects] = useState<Project[]>(initialProjects);
	const [events, setEvents] = useState<Event[]>(initialEvents);
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString()
	);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
		title: "",
		description: "",
		date: new Date().toISOString(),
		projectId: "",
	});
	const [newProject, setNewProject] = useState<Omit<Project, "id">>({
		name: "",
		status: "ongoing",
		notes: "",
		color: "bg-indigo-500",
	});
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [activeTab, setActiveTab] = useState<"calendar" | "projects">(
		"calendar"
	);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const calendarData = useMemo(() => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(currentMonth);
		const calendarStart = startOfWeek(monthStart);
		const calendarEnd = endOfWeek(monthEnd);

		const days = eachDayOfInterval({
			start: calendarStart,
			end: calendarEnd,
		});

		const startDay = getDay(monthStart);

		return {
			monthStart,
			monthEnd,
			days,
			startDay,
		};
	}, [currentMonth]);

	const selectedDateEvents = useMemo(() => {
		return events.filter((event) =>
			isSameDay(parseISO(event.date), parseISO(selectedDate))
		);
	}, [events, selectedDate]);

	const filteredProjects = useMemo(() => {
		if (activeFilter === "all") return projects;
		return projects.filter((project) => project.status === activeFilter);
	}, [projects, activeFilter]);

	const handleDateClick = useCallback((date: Date) => {
		setSelectedDate(date.toISOString());
	}, []);

	const handlePrevMonth = useCallback(() => {
		setCurrentMonth((prev) => {
			const prevMonth = new Date(prev);
			prevMonth.setMonth(prevMonth.getMonth() - 1);
			return prevMonth;
		});
	}, []);

	const handleNextMonth = useCallback(() => {
		setCurrentMonth((prev) => {
			const nextMonth = new Date(prev);
			nextMonth.setMonth(nextMonth.getMonth() + 1);
			return nextMonth;
		});
	}, []);

	const closeEventModal = useCallback(() => {
		setIsEventModalOpen(false);
		setEditingEvent(null);
		setNewEvent({
			title: "",
			description: "",
			date: selectedDate,
			projectId: projects[0]?.id || "",
		});
	}, [selectedDate, projects]);

	const closeProjectModal = useCallback(() => {
		setIsProjectModalOpen(false);
		setEditingProject(null);
		setNewProject({
			name: "",
			status: "ongoing",
			notes: "",
			color: "bg-indigo-500",
		});
	}, []);

	const handleAddEvent = useCallback(() => {
		if (!newEvent.title.trim()) {
			toast.error("Event title is required");
			return;
		}

		if (editingEvent) {
			setEvents((prev) =>
				prev.map((ev) =>
					ev.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } : ev
				)
			);
			toast.success("Event updated successfully");
		} else {
			const newId = Math.random().toString(36).substring(2, 9);
			setEvents((prev) => [...prev, { ...newEvent, id: newId }]);
			toast.success("Event added successfully");
		}
		closeEventModal();
	}, [newEvent, editingEvent, closeEventModal]);

	const handleAddProject = useCallback(() => {
		if (!newProject.name.trim()) {
			toast.error("Project name is required");
			return;
		}

		if (editingProject) {
			setProjects((prev) =>
				prev.map((proj) =>
					proj.id === editingProject.id
						? { ...newProject, id: editingProject.id }
						: proj
				)
			);
			toast.success("Project updated successfully");
		} else {
			const newId = Math.random().toString(36).substring(2, 9);
			setProjects((prev) => [...prev, { ...newProject, id: newId }]);
			toast.success("Project added successfully");
		}
		closeProjectModal();
	}, [newProject, editingProject, closeProjectModal]);

	const handleEditEvent = useCallback((event: Event) => {
		setEditingEvent(event);
		setNewEvent({
			title: event.title,
			description: event.description,
			date: event.date,
			projectId: event.projectId,
		});
		setIsEventModalOpen(true);
	}, []);

	const handleEditProject = useCallback((project: Project) => {
		setEditingProject(project);
		setNewProject({
			name: project.name,
			status: project.status,
			notes: project.notes,
			color: project.color,
		});
		setIsProjectModalOpen(true);
	}, []);

	const handleDeleteEvent = useCallback((id: string) => {
		setEvents((prev) => prev.filter((event) => event.id !== id));
		toast.success("Event deleted successfully");
	}, []);

	const handleDeleteProject = useCallback((id: string) => {
		setProjects((prev) => prev.filter((project) => project.id !== id));
		setEvents((prev) => prev.filter((event) => event.projectId !== id));
		toast.success("Project and related events deleted successfully");
	}, []);

	const getEventsForDay = useCallback(
		(day: Date) => {
			return events.filter((event) => isSameDay(parseISO(event.date), day));
		},
		[events]
	);

	const handleFilterClick = () => {
		setIsFilterModalOpen(true);
	};

	const colorOptions = [
		"bg-indigo-500",
		"bg-emerald-500",
		"bg-violet-500",
		"bg-rose-500",
		"bg-amber-500",
		"bg-cyan-500",
		"bg-fuchsia-500",
		"bg-teal-500",
	];

	const getProjectById = useCallback(
		(id: string) => {
			return projects.find((p) => p.id === id);
		},
		[projects]
	);

	const toggleMobileMenu = () => {
		setMobileMenuOpen((prev) => !prev);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{}
			<header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
								ProductivityPro
							</span>
						</div>

						{}
						<nav className="hidden sm:flex space-x-1">
							<button
								className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
									activeTab === "calendar"
										? "bg-indigo-50 text-indigo-700"
										: "text-gray-700 hover:bg-gray-100"
								} transition duration-150 ease-in-out`}
								onClick={() => setActiveTab("calendar")}
							>
								<FiCalendar className="inline mr-1" />
								Calendar
							</button>
							<button
								className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
									activeTab === "projects"
										? "bg-indigo-50 text-indigo-700"
										: "text-gray-700 hover:bg-gray-100"
								} transition duration-150 ease-in-out`}
								onClick={() => setActiveTab("projects")}
							>
								<FaProjectDiagram className="inline mr-1" />
								Projects
							</button>
						</nav>

						{}
						<div className="sm:hidden">
							<button
								type="button"
								className="bg-white p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none cursor-pointer"
								onClick={toggleMobileMenu}
							>
								{mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
							</button>
						</div>
					</div>
				</div>
			</header>

			{}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						className="sm:hidden absolute z-10 w-full bg-white shadow-lg"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
					>
						<div className="px-2 pt-2 pb-3 space-y-1">
							<button
								className={`w-full text-left px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
									activeTab === "calendar"
										? "bg-indigo-50 text-indigo-700"
										: "text-gray-700 hover:bg-gray-100"
								} transition duration-150 ease-in-out`}
								onClick={() => {
									setActiveTab("calendar");
									setMobileMenuOpen(false);
								}}
							>
								<FiCalendar className="inline mr-2" />
								Calendar
							</button>
							<button
								className={`w-full text-left px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
									activeTab === "projects"
										? "bg-indigo-50 text-indigo-700"
										: "text-gray-700 hover:bg-gray-100"
								} transition duration-150 ease-in-out`}
								onClick={() => {
									setActiveTab("projects");
									setMobileMenuOpen(false);
								}}
							>
								<FaProjectDiagram className="inline mr-2" />
								Projects
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 3000,
						style: {
							background: "#FFFFFF",
							color: "#374151",
							boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
							borderRadius: "0.5rem",
							padding: "0.75rem 1rem",
						},
					}}
				/>

				<AnimatePresence mode="wait">
					{activeTab === "calendar" ? (
						<motion.div
							key="calendar"
							variants={fadeIn}
							initial="hidden"
							animate="visible"
							exit="hidden"
							className="space-y-6"
						>
							{}
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
								<div>
									<h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
										{format(currentMonth, "MMMM yyyy")}
									</h2>
									<p className="text-sm text-gray-500">
										{selectedDateEvents.length} events on{" "}
										{format(parseISO(selectedDate), "MMMM d, yyyy")}
									</p>
								</div>
								<div className="flex flex-wrap gap-2">
									<div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
										<button
											onClick={handlePrevMonth}
											className="p-2 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
											aria-label="Previous month"
										>
											<HiOutlineChevronLeft size={16} />
										</button>
										<button
											onClick={() => setCurrentMonth(new Date())}
											className="px-3 py-1 text-xs sm:text-sm border-x border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
										>
											Today
										</button>
										<button
											onClick={handleNextMonth}
											className="p-2 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
											aria-label="Next month"
										>
											<HiOutlineChevronRight size={16} />
										</button>
									</div>
									<button
										onClick={() => {
											setNewEvent((prev) => ({
												...prev,
												date: selectedDate,
												projectId: projects[0]?.id || "",
											}));
											setIsEventModalOpen(true);
											setEditingEvent(null);
										}}
										className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
									>
										<FaPlus size={12} />
										<span>Add Event</span>
									</button>
								</div>
							</div>

							{}
							<div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
								{}
								<div className="grid grid-cols-7 text-center bg-gray-50 border-b border-gray-200 w-full">
									{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
										(day) => (
											<div
												key={day}
												className="py-1.5 text-xs sm:text-sm font-medium text-gray-600"
											>
												{day}
											</div>
										)
									)}
								</div>

								{}
								<div className="grid grid-cols-7 auto-rows-fr border-b border-gray-200">
									{calendarData.days.map((day, i) => {
										const isCurrentMonth =
											day.getMonth() === currentMonth.getMonth();
										const dayEvents = getEventsForDay(day);
										const isSelected = isSameDay(day, parseISO(selectedDate));

										return (
											<div
												key={i}
												onClick={() => handleDateClick(day)}
												className={`min-h-[60px] sm:min-h-[90px] p-1 sm:p-2 border-r border-b border-gray-100 transition-colors ${
													!isCurrentMonth ? "bg-gray-50" : "bg-white"
												} ${
													isSelected ? "ring-2 ring-inset ring-indigo-500" : ""
												} 
                          hover:bg-indigo-50 cursor-pointer relative`}
											>
												<div className="flex justify-end">
													<span
														className={`inline-flex items-center justify-center h-5 w-5 text-xs rounded-full
                              ${
																isToday(day)
																	? "bg-indigo-600 text-white"
																	: "text-gray-700"
															} 
                              ${!isCurrentMonth ? "text-gray-400" : ""}`}
													>
														{format(day, "d")}
													</span>
												</div>

												<div className="mt-1 space-y-1 overflow-hidden">
													{dayEvents.slice(0, 2).map((event) => {
														const project = getProjectById(event.projectId);
														return (
															<div
																key={event.id}
																className={`${
																	project?.color || "bg-gray-300"
																} text-white text-xs p-0.5 rounded truncate`}
															>
																{event.title}
															</div>
														);
													})}
													{dayEvents.length > 2 && (
														<div className="text-xs text-indigo-500 truncate text-center">
															+{dayEvents.length - 2} more
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>

							{}
							<motion.div
								variants={slideIn}
								initial="hidden"
								animate="visible"
								className="bg-white rounded-lg shadow-md p-4 sm:p-6"
							>
								<h3 className="font-medium text-lg sm:text-xl mb-4 text-gray-800 flex items-center">
									<FiClipboard className="mr-2 text-indigo-500" />
									Events for {format(parseISO(selectedDate), "MMMM d, yyyy")}
								</h3>

								{selectedDateEvents.length > 0 ? (
									<div className="space-y-3">
										{selectedDateEvents.map((event) => {
											const project = getProjectById(event.projectId);
											return (
												<motion.div
													key={event.id}
													layout
													initial={{ opacity: 0, y: 5 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.2 }}
													className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex justify-between items-start"
												>
													<div className="flex-1 min-w-0">
														<div className="flex items-start">
															<div
																className={`h-2 w-2 mt-1.5 rounded-full ${
																	project?.color || "bg-gray-400"
																} mr-2 flex-shrink-0`}
															></div>
															<div>
																<h4 className="font-semibold text-gray-800 truncate">
																	{event.title}
																</h4>
																<p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
																	{event.description}
																</p>
																{project && (
																	<span
																		className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${project.color} text-white`}
																	>
																		{project.name}
																	</span>
																)}
															</div>
														</div>
													</div>
													<div className="flex space-x-1 ml-2">
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleEditEvent(event);
															}}
															className="p-1 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer"
															aria-label="Edit event"
														>
															<FiEdit2 size={16} />
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleDeleteEvent(event.id);
															}}
															className="p-1 text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
															aria-label="Delete event"
														>
															<FiTrash2 size={16} />
														</button>
													</div>
												</motion.div>
											);
										})}
									</div>
								) : (
									<div className="bg-gray-50 rounded-lg p-6 text-center">
										<FaRegLightbulb className="mx-auto text-gray-400 text-2xl mb-2" />
										<p className="text-gray-500 text-sm">
											No events for this day. Click the "Add Event" button to
											create one.
										</p>
									</div>
								)}
							</motion.div>
						</motion.div>
					) : (
						<motion.div
							key="projects"
							variants={fadeIn}
							initial="hidden"
							animate="visible"
							exit="hidden"
							className="space-y-6"
						>
							{}
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
								<div>
									<h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
										Projects
									</h2>
									<p className="text-sm text-gray-500">
										{filteredProjects.length} projects{" "}
										{activeFilter !== "all" ? `(${activeFilter})` : ""}
									</p>
								</div>
								<div className="flex flex-wrap gap-2">
									<button
										onClick={handleFilterClick}
										className="flex items-center space-x-1 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
									>
										<FiFilter size={12} />
										<span>Filter</span>
									</button>
									<button
										onClick={() => {
											setIsProjectModalOpen(true);
											setEditingProject(null);
										}}
										className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
									>
										<FaPlus size={12} />
										<span>Add Project</span>
									</button>
								</div>
							</div>

							{}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
								{filteredProjects.map((project) => {
									const projectEvents = events.filter(
										(e) => e.projectId === project.id
									);
									return (
										<motion.div
											key={project.id}
											layout
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
											className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
										>
											<div className={`h-1.5 ${project.color}`}></div>
											<div className="p-4">
												<div className="flex justify-between items-center mb-3">
													<h3 className="font-semibold text-base sm:text-lg text-gray-800 truncate max-w-[70%]">
														{project.name}
													</h3>
													<span
														className={`px-2 py-0.5 rounded-full text-xs font-medium ${
															project.status === "ongoing"
																? "bg-amber-100 text-amber-700"
																: project.status === "upcoming"
																? "bg-indigo-100 text-indigo-700"
																: "bg-emerald-100 text-emerald-700"
														}`}
													>
														{project.status.charAt(0).toUpperCase() +
															project.status.slice(1)}
													</span>
												</div>
												<p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
													{project.notes}
												</p>

												{}
												<div className="mb-3">
													<h4 className="text-xs font-medium text-gray-500 mb-2">
														Related Events
													</h4>
													<div className="space-y-1">
														{projectEvents.slice(0, 2).map((event) => (
															<div
																key={event.id}
																className="text-xs sm:text-sm text-gray-600 flex items-center"
															>
																<span
																	className={`h-1.5 w-1.5 rounded-full ${project.color} mr-2`}
																></span>
																<span className="truncate">{event.title}</span>
																<span className="text-gray-400 text-xs ml-2 flex-shrink-0">
																	{format(parseISO(event.date), "MMM d")}
																</span>
															</div>
														))}
														{projectEvents.length === 0 && (
															<div className="text-xs text-gray-400 italic">
																No events scheduled
															</div>
														)}
														{projectEvents.length > 2 && (
															<div className="text-xs text-indigo-500 hover:underline cursor-pointer">
																View all {projectEvents.length} events
															</div>
														)}
													</div>
												</div>

												<div className="flex justify-end space-x-1 mt-2">
													<button
														onClick={() => handleEditProject(project)}
														className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer"
														aria-label="Edit project"
													>
														<FiEdit2 size={14} />
													</button>
													<button
														onClick={() => handleDeleteProject(project.id)}
														className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
														aria-label="Delete project"
													>
														<FiTrash2 size={14} />
													</button>
												</div>
											</div>
										</motion.div>
									);
								})}

								{filteredProjects.length === 0 && (
									<div className="col-span-full bg-gray-50 rounded-lg p-6 text-center">
										<FaRegLightbulb className="mx-auto text-gray-400 text-2xl mb-2" />
										<p className="text-gray-500 text-sm">
											No projects found. Click the "Add Project" button to
											create one.
										</p>
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</main>

			{}
			<AnimatePresence>
				{isEventModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
					>
						<motion.div
							className="bg-white p-5 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
							initial={{ scale: 0.95, y: 10 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.95, y: 10 }}
							transition={{ type: "spring", damping: 30 }}
						>
							<h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
								{editingEvent ? "Edit Event" : "Add New Event"}
							</h2>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Title
									</label>
									<input
										type="text"
										placeholder="Event title"
										value={newEvent.title}
										onChange={(e) =>
											setNewEvent({ ...newEvent, title: e.target.value })
										}
										className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Description
									</label>
									<textarea
										placeholder="Event description"
										value={newEvent.description}
										onChange={(e) =>
											setNewEvent({
												...newEvent,
												description: e.target.value,
											})
										}
										className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm min-h-[80px]"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Project
									</label>
									<select
										value={newEvent.projectId}
										onChange={(e) =>
											setNewEvent({ ...newEvent, projectId: e.target.value })
										}
										className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
									>
										{projects.map((project) => (
											<option key={project.id} value={project.id}>
												{project.name}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="flex justify-end space-x-3 mt-6">
								<button
									onClick={closeEventModal}
									className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
								>
									Cancel
								</button>
								<button
									onClick={handleAddEvent}
									className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-colors cursor-pointer"
								>
									{editingEvent ? "Update Event" : "Add Event"}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{isProjectModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
					>
						<motion.div
							className="bg-white p-5 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
							initial={{ scale: 0.95, y: 10 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.95, y: 10 }}
							transition={{ type: "spring", damping: 30 }}
						>
							<h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
								{editingProject ? "Edit Project" : "Add New Project"}
							</h2>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Name
									</label>
									<input
										type="text"
										placeholder="Project name"
										value={newProject.name}
										onChange={(e) =>
											setNewProject({ ...newProject, name: e.target.value })
										}
										className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Status
									</label>
									<select
										value={newProject.status}
										onChange={(e) =>
											setNewProject({
												...newProject,
												status: e.target.value as Project["status"],
											})
										}
										className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
									>
										<option value="ongoing">Ongoing</option>
										<option value="upcoming">Upcoming</option>
										<option value="completed">Completed</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Notes
									</label>
									<textarea
										placeholder="Project notes"
										value={newProject.notes}
										onChange={(e) =>
											setNewProject({ ...newProject, notes: e.target.value })
										}
										className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm min-h-[80px]"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Color
									</label>
									<div className="grid grid-cols-8 gap-2 mt-2">
										{colorOptions.map((color) => (
											<div
												key={color}
												onClick={() => setNewProject({ ...newProject, color })}
												className={`${color} w-full h-6 rounded cursor-pointer transition-all duration-300 ${
													newProject.color === color
														? "ring-2 ring-gray-600 ring-offset-2"
														: "hover:scale-110"
												}`}
											></div>
										))}
									</div>
								</div>
							</div>

							<div className="flex justify-end space-x-3 mt-6">
								<button
									onClick={closeProjectModal}
									className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
								>
									Cancel
								</button>
								<button
									onClick={handleAddProject}
									className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-colors cursor-pointer"
								>
									{editingProject ? "Update Project" : "Add Project"}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{isFilterModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
					>
						<motion.div
							className="bg-white p-5 sm:p-6 rounded-lg w-full max-w-xs"
							initial={{ scale: 0.95, y: 10 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.95, y: 10 }}
							transition={{ type: "spring", damping: 30 }}
						>
							<h2 className="text-lg font-bold text-gray-800 mb-4">
								Filter Projects
							</h2>

							<div className="space-y-2">
								{["all", "ongoing", "upcoming", "completed"].map((filter) => (
									<div
										key={filter}
										onClick={() => {
											setActiveFilter(filter);
											setIsFilterModalOpen(false);
											toast.success(
												`Filtered to ${
													filter === "all"
														? "all projects"
														: filter + " projects"
												}`
											);
										}}
										className={`p-2 rounded-md cursor-pointer transition-colors ${
											activeFilter === filter
												? "bg-indigo-50 text-indigo-700"
												: "hover:bg-gray-50"
										}`}
									>
										<span className="capitalize">{filter}</span>
										{filter !== "all" && (
											<span className="ml-2 text-xs text-gray-500">
												({projects.filter((p) => p.status === filter).length})
											</span>
										)}
									</div>
								))}
							</div>

							<div className="flex justify-end mt-4">
								<button
									onClick={() => setIsFilterModalOpen(false)}
									className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
								>
									Close
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<footer className="bg-white border-t border-gray-200 mt-auto">
				<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
					<p className="text-center text-xs text-gray-500">
						ProductivityPro &copy; {new Date().getFullYear()} - Your
						Productivity Partner
					</p>
				</div>
			</footer>
		</div>
	);
};

export default ProductivityTracker;
