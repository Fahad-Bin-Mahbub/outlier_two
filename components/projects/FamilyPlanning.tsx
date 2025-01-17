"use client";
import React, { useState, useEffect } from "react";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Plus,
	Users,
	FileText,
	Check,
	Trash2,
	X,
	List,
	Search,
	Tag,
	MapPin,
	Clock,
} from "lucide-react";
import { Helmet } from "react-helmet";

interface Member {
	id: string;
	name: string;
	color: string;
}
interface Attachment {
	id: string;
	file: File;
	uploadedAt: Date;
	uploadedBy: string;
}
interface Task {
	id: string;
	description: string;
	assignedTo: string;
	completed: boolean;
}
interface Note {
	id: string;
	content: string;
	createdAt: Date;
}
interface FamilyEvent {
	id: string;
	title: string;
	startDate: Date;
	endDate: Date;
	description: string;
	location: string;
	color: string;
	tasks: Task[];
	notes: Note[];
	attachments: Attachment[];
}

const COLORS = {
	primary: "#4f46e5",
	secondary: "#7c3aed",
	accent: "#10b981",
	neutral: "#6b7280",
	background: "#f9fafb",
	red: "#ef4444",
	orange: "#f97316",
	yellow: "#eab308",
	teal: "#14b8a6",
	blue: "#3b82f6",
};

const generateDemoData = () => {
	const today = new Date();
	const demoMembers: Member[] = [
		{ id: "1", name: "Mom", color: COLORS.primary },
		{ id: "2", name: "Dad", color: COLORS.secondary },
		{ id: "3", name: "Emma", color: COLORS.accent },
		{ id: "4", name: "Ethan", color: COLORS.red },
		{ id: "5", name: "Grandma", color: COLORS.teal },
	];

	const demoEvents: FamilyEvent[] = [
		{
			id: "1",
			title: "Family Picnic",
			startDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 3,
				11,
				0
			),
			endDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 3,
				16,
				0
			),
			description: "Annual family picnic at the park with games and BBQ",
			location: "Central Park",
			color: COLORS.primary,
			tasks: [
				{
					id: "101",
					description: "Prepare sandwiches",
					assignedTo: "2",
					completed: true,
				},
				{
					id: "102",
					description: "Buy drinks",
					assignedTo: "1",
					completed: false,
				},
				{
					id: "103",
					description: "Pack sports equipment",
					assignedTo: "4",
					completed: false,
				},
			],
			notes: [
				{
					id: "201",
					content: "Remember to bring sunscreen!",
					createdAt: new Date(
						today.getFullYear(),
						today.getMonth(),
						today.getDate() - 1
					),
				},
			],
			attachments: [],
		},
		{
			id: "2",
			title: "Emma's Soccer Game",
			startDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 1,
				15,
				0
			),
			endDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 1,
				17,
				0
			),
			description: "Season finale game",
			location: "Main Street Field",
			color: COLORS.accent,
			tasks: [
				{
					id: "104",
					description: "Clean soccer uniform",
					assignedTo: "1",
					completed: true,
				},
				{
					id: "105",
					description: "Charge camera",
					assignedTo: "2",
					completed: false,
				},
			],
			notes: [],
			attachments: [],
		},
		{
			id: "3",
			title: "Grandma's Birthday",
			startDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 5,
				18,
				0
			),
			endDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 5,
				21,
				0
			),
			description: "Dinner at Grandma's favorite restaurant",
			location: "Luigi's Italian",
			color: COLORS.teal,
			tasks: [
				{
					id: "106",
					description: "Order cake",
					assignedTo: "1",
					completed: false,
				},
				{
					id: "107",
					description: "Buy gift",
					assignedTo: "3",
					completed: false,
				},
				{
					id: "108",
					description: "Make reservation",
					assignedTo: "2",
					completed: true,
				},
			],
			notes: [
				{
					id: "202",
					content: "Grandma wants chocolate cake with strawberries",
					createdAt: new Date(
						today.getFullYear(),
						today.getMonth(),
						today.getDate() - 3
					),
				},
			],
			attachments: [],
		},
		{
			id: "4",
			title: "Dentist Appointment",
			startDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1,
				14,
				30
			),
			endDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1,
				15,
				30
			),
			description: "Regular check-up for the kids",
			location: "Smile Dental Clinic",
			color: COLORS.blue,
			tasks: [
				{
					id: "109",
					description: "Bring insurance cards",
					assignedTo: "2",
					completed: true,
				},
			],
			notes: [],
			attachments: [],
		},
		{
			id: "5",
			title: "Family Movie Night",
			startDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				19,
				0
			),
			endDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				22,
				0
			),
			description: "Watch the new animation movie together",
			location: "Home",
			color: COLORS.orange,
			tasks: [
				{
					id: "110",
					description: "Buy popcorn and snacks",
					assignedTo: "1",
					completed: false,
				},
				{
					id: "111",
					description: "Set up the projector",
					assignedTo: "2",
					completed: false,
				},
			],
			notes: [
				{
					id: "203",
					content: "Emma wants to watch Encanto again",
					createdAt: new Date(
						today.getFullYear(),
						today.getMonth(),
						today.getDate() - 1
					),
				},
			],
			attachments: [],
		},
	];

	return { demoMembers, demoEvents };
};

const FamilyEventPlanner: React.FC = () => {
	const { demoMembers, demoEvents } = generateDemoData();
	const [events, setEvents] = useState<FamilyEvent[]>(demoEvents);
	const [members, setMembers] = useState<Member[]>(demoMembers);
	const [selectedEvent, setSelectedEvent] = useState<FamilyEvent | null>(null);
	const [currentView, setCurrentView] = useState<
		"calendar" | "event" | "createEvent" | "members" | "events"
	>("calendar");
	const [currentDate, setCurrentDate] = useState(new Date());
	const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
	const [newEvent, setNewEvent] = useState<Partial<FamilyEvent>>({
		color: COLORS.primary,
		startDate: new Date(new Date().setHours(9, 0, 0, 0)),
		endDate: new Date(new Date().setHours(10, 0, 0, 0)),
	});
	const [newTask, setNewTask] = useState<Partial<Task>>({});
	const [newNote, setNewNote] = useState("");
	const [newMember, setNewMember] = useState<Partial<Member>>({
		color: COLORS.primary,
	});
	const [expandedSections, setExpandedSections] = useState<
		Record<string, boolean>
	>({
		tasks: true,
		notes: true,
		attachments: false,
	});
	const [deleteConfirm, setDeleteConfirm] = useState<{
		type: string;
		id: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTimeframe, setSelectedTimeframe] = useState<
		"all" | "upcoming" | "past" | "today"
	>("upcoming");

	useEffect(() => {
		setTimeout(() => setIsLoading(false), 1000);
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const days: Date[] = [];
		for (let i = 0; i < firstDay.getDay(); i++) {
			const prevDate = new Date(year, month, -i);
			days.push(prevDate);
		}
		days.reverse();
		for (let i = 1; i <= lastDay.getDate(); i++)
			days.push(new Date(year, month, i));

		const remainingDays = 42 - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			days.push(new Date(year, month + 1, i));
		}

		setDaysInMonth(days);
	}, [currentDate]);

	const handleViewChange = (view: typeof currentView) => {
		setIsLoading(true);
		setTimeout(() => {
			setCurrentView(view);
			setIsLoading(false);
		}, 200);
	};

	const formatDateForInput = (date: Date): string => {
		return date.toISOString().slice(0, 16);
	};

	const handleAddEvent = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) return;
		const event: FamilyEvent = {
			id: Date.now().toString(),
			title: newEvent.title,
			startDate: newEvent.startDate!,
			endDate: newEvent.endDate!,
			description: newEvent.description || "",
			location: newEvent.location || "",
			color: newEvent.color || COLORS.primary,
			tasks: [],
			notes: [],
			attachments: [],
		};
		setEvents([...events, event]);
		handleViewChange("calendar");
		setNewEvent({
			color: COLORS.primary,
			startDate: new Date(new Date().setHours(9, 0, 0, 0)),
			endDate: new Date(new Date().setHours(10, 0, 0, 0)),
		});
	};

	const handleAddTask = (eventId: string) => {
		if (!newTask.description || !newTask.assignedTo) return;

		const updatedEvents = events.map((event) =>
			event.id === eventId
				? {
						...event,
						tasks: [
							...event.tasks,
							{
								id: Date.now().toString(),
								...newTask,
								completed: false,
							} as Task,
						],
				  }
				: event
		);

		setEvents(updatedEvents);

		const updatedEvent = updatedEvents.find((event) => event.id === eventId);
		if (updatedEvent) {
			setSelectedEvent(updatedEvent);
		}

		setNewTask({});
	};

	const handleAddNote = (eventId: string) => {
		if (!newNote.trim()) return;

		const updatedEvents = events.map((event) =>
			event.id === eventId
				? {
						...event,
						notes: [
							...event.notes,
							{
								id: Date.now().toString(),
								content: newNote,
								createdAt: new Date(),
							},
						],
				  }
				: event
		);

		setEvents(updatedEvents);

		const updatedEvent = updatedEvents.find((event) => event.id === eventId);
		if (updatedEvent) {
			setSelectedEvent(updatedEvent);
		}

		setNewNote("");
	};

	const handleDelete = (type: string, id: string) => {
		if (type === "event") {
			setEvents(events.filter((event) => event.id !== id));
			if (selectedEvent?.id === id) {
				handleViewChange("events");
			}
		} else if (type === "note" && selectedEvent) {
			const updatedEvents = events.map((event) =>
				event.id === selectedEvent.id
					? { ...event, notes: event.notes.filter((note) => note.id !== id) }
					: event
			);
			setEvents(updatedEvents);

			setSelectedEvent({
				...selectedEvent,
				notes: selectedEvent.notes.filter((note) => note.id !== id),
			});
		} else if (type === "task" && selectedEvent) {
			const updatedEvents = events.map((event) =>
				event.id === selectedEvent.id
					? { ...event, tasks: event.tasks.filter((task) => task.id !== id) }
					: event
			);
			setEvents(updatedEvents);

			setSelectedEvent({
				...selectedEvent,
				tasks: selectedEvent.tasks.filter((task) => task.id !== id),
			});
		} else if (type === "attachment" && selectedEvent) {
			const updatedEvents = events.map((event) =>
				event.id === selectedEvent.id
					? {
							...event,
							attachments: event.attachments.filter((att) => att.id !== id),
					  }
					: event
			);
			setEvents(updatedEvents);

			setSelectedEvent({
				...selectedEvent,
				attachments: selectedEvent.attachments.filter((att) => att.id !== id),
			});
		}
		setDeleteConfirm(null);
	};
	const handleAddMember = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMember.name) return;
		setMembers([
			...members,
			{ id: Date.now().toString(), ...newMember } as Member,
		]);
		setNewMember({ color: COLORS.primary });
	};

	const filteredEvents = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		let filtered = events;

		if (selectedTimeframe === "upcoming") {
			filtered = filtered.filter((event) => new Date(event.startDate) >= today);
		} else if (selectedTimeframe === "past") {
			filtered = filtered.filter((event) => new Date(event.endDate) < today);
		} else if (selectedTimeframe === "today") {
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			filtered = filtered.filter(
				(event) =>
					new Date(event.startDate) >= today &&
					new Date(event.startDate) < tomorrow
			);
		}

		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(event) =>
					event.title.toLowerCase().includes(term) ||
					event.description.toLowerCase().includes(term) ||
					event.location.toLowerCase().includes(term)
			);
		}

		return filtered.sort(
			(a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
		);
	};

	const renderEventsListView = () => (
		<div className="p-4 md:p-6 font-sans">
			<h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-700 tracking-tight leading-tight mb-6">
				Events
			</h2>

			<div className="mb-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
				<div className="relative flex-grow">
					<Search
						size={18}
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						className="pl-10 p-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
						placeholder="Search events..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				<div className="flex gap-2 self-start">
					<button
						className={`px-3 py-2 text-sm rounded-lg transition-all ${
							selectedTimeframe === "all"
								? "bg-indigo-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						onClick={() => setSelectedTimeframe("all")}
					>
						All
					</button>
					<button
						className={`px-3 py-2 text-sm rounded-lg transition-all ${
							selectedTimeframe === "upcoming"
								? "bg-indigo-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						onClick={() => setSelectedTimeframe("upcoming")}
					>
						Upcoming
					</button>
					<button
						className={`px-3 py-2 text-sm rounded-lg transition-all ${
							selectedTimeframe === "today"
								? "bg-indigo-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						onClick={() => setSelectedTimeframe("today")}
					>
						Today
					</button>
					<button
						className={`px-3 py-2 text-sm rounded-lg transition-all ${
							selectedTimeframe === "past"
								? "bg-indigo-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						onClick={() => setSelectedTimeframe("past")}
					>
						Past
					</button>
				</div>
			</div>

			{filteredEvents().length === 0 ? (
				<div className="text-center p-8 bg-white rounded-lg shadow-sm">
					<div className="text-gray-500 mb-2">No events found</div>
					<button
						onClick={() => handleViewChange("createEvent")}
						className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
					>
						Create a new event
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredEvents().map((event) => {
						const isPast = new Date(event.endDate) < new Date();
						const isToday =
							new Date(event.startDate).toDateString() ===
								new Date().toDateString() ||
							(new Date() >= new Date(event.startDate) &&
								new Date() <= new Date(event.endDate));

						return (
							<div
								key={event.id}
								className={`rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden border-t-4`}
								style={{ borderColor: event.color }}
							>
								<div className="p-4">
									<div className="flex justify-between items-start mb-2">
										<h3 className="font-medium text-gray-800 text-xl truncate">
											{event.title}
										</h3>
										<div className="flex">
											{isPast && (
												<span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full ml-2">
													Past
												</span>
											)}
											{isToday && (
												<span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full ml-2">
													Today
												</span>
											)}
										</div>
									</div>

									<div className="flex flex-col text-sm text-gray-600 mb-3 space-y-1">
										<div className="flex items-center">
											<Clock size={14} className="mr-1.5 flex-shrink-0" />
											<span>
												{new Date(event.startDate).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
												{event.startDate.toDateString() !==
												event.endDate.toDateString() ? (
													<>
														{" "}
														-{" "}
														{new Date(event.endDate).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															}
														)}
													</>
												) : (
													<>
														{" "}
														-{" "}
														{new Date(event.endDate).toLocaleTimeString(
															"en-US",
															{
																hour: "2-digit",
																minute: "2-digit",
															}
														)}
													</>
												)}
											</span>
										</div>

										{event.location && (
											<div className="flex items-center">
												<MapPin size={14} className="mr-1.5 flex-shrink-0" />
												<span className="truncate">{event.location}</span>
											</div>
										)}

										<div className="flex items-center">
											<Tag size={14} className="mr-1.5 flex-shrink-0" />
											<span>
												{event.tasks.length} task
												{event.tasks.length !== 1 ? "s" : ""} (
												{event.tasks.filter((t) => t.completed).length}{" "}
												complete)
											</span>
										</div>
									</div>

									<div className="flex justify-between mt-3">
										<button
											className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
											onClick={() => {
												setSelectedEvent(event);
												handleViewChange("event");
											}}
										>
											View Details
										</button>
										<button
											className="text-red-500 hover:text-red-700 transition-colors"
											onClick={() =>
												setDeleteConfirm({ type: "event", id: event.id })
											}
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);

	const renderCalendarView = () => (
		<div className="p-4 md:p-6 font-sans">
			<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
				<h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-700 tracking-tight leading-tight">
					{currentDate.toLocaleDateString("default", {
						month: "long",
						year: "numeric",
					})}
				</h2>
				<div className="flex gap-2">
					<button
						className="p-2 rounded-full hover:bg-gray-200 transform hover:scale-105 transition-all"
						onClick={() =>
							setCurrentDate(
								new Date(currentDate.setMonth(currentDate.getMonth() - 1))
							)
						}
					>
						<ChevronLeft size={20} color={COLORS.neutral} />
					</button>
					<button
						className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-all"
						onClick={() => setCurrentDate(new Date())}
					>
						Today
					</button>
					<button
						className="p-2 rounded-full hover:bg-gray-200 transform hover:scale-105 transition-all"
						onClick={() =>
							setCurrentDate(
								new Date(currentDate.setMonth(currentDate.getMonth() + 1))
							)
						}
					>
						<ChevronRight size={20} color={COLORS.neutral} />
					</button>
				</div>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-7 gap-2">
					{Array(35)
						.fill(0)
						.map((_, i) => (
							<div
								key={i}
								className="h-24 bg-gray-200 rounded-lg animate-pulse"
							/>
						))}
				</div>
			) : (
				<div className="grid grid-cols-7 gap-2">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
						<div
							key={day}
							className="text-center font-medium p-2 text-sm text-gray-700 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm"
						>
							{day}
						</div>
					))}
					{daysInMonth.map((day) => {
						const isToday = day.toDateString() === new Date().toDateString();
						const isCurrentMonth = day.getMonth() === currentDate.getMonth();
						const dayEvents = events.filter((e) => {
							const eventStart = new Date(e.startDate);
							const eventEnd = new Date(e.endDate);
							const dayStart = new Date(day);
							dayStart.setHours(0, 0, 0, 0);
							const dayEnd = new Date(day);
							dayEnd.setHours(23, 59, 59, 999);

							return (
								(eventStart >= dayStart && eventStart <= dayEnd) ||
								(eventEnd >= dayStart && eventEnd <= dayEnd) ||
								(eventStart <= dayStart && eventEnd >= dayEnd)
							);
						});

						return (
							<div
								key={day.toString()}
								className={`p-2 min-h-[80px] md:min-h-[100px] border ${
									isToday ? "border-indigo-600 border-2" : "border-gray-200"
								} 
                  ${
										!isCurrentMonth
											? "bg-gray-50 opacity-60"
											: "bg-gradient-to-br from-white to-gray-50"
									} 
                  rounded-lg shadow-sm hover:shadow-md transition-shadow`}
							>
								<span
									className={`text-sm ${
										isCurrentMonth ? "text-gray-700" : "text-gray-400"
									} ${isToday ? "font-bold" : ""}`}
								>
									{day.getDate()}
								</span>
								<div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto scrollbar-thin">
									{dayEvents.map((event) => (
										<div
											key={event.id}
											className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate flex items-center"
											style={{
												backgroundColor: `${event.color}20`,
												borderLeft: `3px solid ${event.color}`,
											}}
											onClick={() => {
												setSelectedEvent(event);
												handleViewChange("event");
											}}
										>
											<span
												className="w-2 h-2 rounded-full mr-1 flex-shrink-0"
												style={{ backgroundColor: event.color }}
											></span>
											<span className="truncate">{event.title}</span>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}

			<button
				className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all z-10"
				onClick={() => handleViewChange("createEvent")}
			>
				<Plus size={24} />
			</button>
		</div>
	);

	const renderEventView = () =>
		selectedEvent && (
			<div className="p-4 md:p-6 font-sans flex flex-col gap-6">
				<div className="flex justify-between items-center mb-2">
					<button
						className="flex items-center text-indigo-600 hover:text-indigo-800 transform hover:scale-105 transition-all"
						onClick={() =>
							handleViewChange(
								currentView === "calendar" ? "calendar" : "events"
							)
						}
					>
						<ChevronLeft size={20} /> Back
					</button>
					<button
						className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 transition-all"
						onClick={() =>
							setDeleteConfirm({ type: "event", id: selectedEvent.id })
						}
					>
						<Trash2 size={20} />
					</button>
				</div>

				<div
					className="bg-white rounded-lg shadow-md overflow-hidden border-t-4"
					style={{ borderColor: selectedEvent.color }}
				>
					<div className="p-4 md:p-6">
						<h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-800 tracking-tight leading-tight mb-4">
							{selectedEvent.title}
						</h2>

						<div className="flex flex-col md:flex-row md:items-center gap-3 text-gray-600 mb-6">
							<div className="flex items-center">
								<Clock size={18} className="mr-2 text-gray-500" />
								<span>
									{new Date(selectedEvent.startDate).toLocaleDateString(
										"en-US",
										{
											weekday: "short",
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										}
									)}
									{" - "}
									{selectedEvent.startDate.toDateString() !==
									selectedEvent.endDate.toDateString()
										? new Date(selectedEvent.endDate).toLocaleDateString(
												"en-US",
												{
													weekday: "short",
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												}
										  )
										: new Date(selectedEvent.endDate).toLocaleTimeString(
												"en-US",
												{
													hour: "2-digit",
													minute: "2-digit",
												}
										  )}
								</span>
							</div>

							{selectedEvent.location && (
								<div className="flex items-center">
									<MapPin size={18} className="mr-2 text-gray-500" />
									<span>{selectedEvent.location}</span>
								</div>
							)}
						</div>

						{selectedEvent.description && (
							<div className="bg-gray-50 rounded-lg p-4 mb-6 text-gray-700">
								{selectedEvent.description}
							</div>
						)}
					</div>
				</div>

				<div className="space-y-4">
					{}
					<div className="rounded-lg shadow-sm bg-white p-4">
						<button
							className="flex items-center w-full px-2 py-1 hover:bg-gray-50 rounded transition-all"
							onClick={() =>
								setExpandedSections((prev) => ({ ...prev, tasks: !prev.tasks }))
							}
						>
							<h3 className="font-medium text-gray-800 text-lg">Tasks</h3>
							<ChevronRight
								size={20}
								className={`ml-auto transition-transform duration-200 ${
									expandedSections.tasks ? "rotate-90" : ""
								}`}
							/>
						</button>

						{expandedSections.tasks && (
							<div className="mt-4 flex flex-col gap-4 animate-fade-in">
								{selectedEvent.tasks.length === 0 ? (
									<p className="text-gray-500 text-sm">
										No tasks yet. Add one below!
									</p>
								) : (
									<div className="space-y-3">
										{selectedEvent.tasks.map((task) => {
											const member = members.find(
												(m) => m.id === task.assignedTo
											);
											return (
												<div
													key={task.id}
													className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg group"
												>
													<button
														className="p-1 rounded-full hover:bg-gray-200 transition-all"
														onClick={() => {
															const updatedEvents = events.map((e) =>
																e.id === selectedEvent.id
																	? {
																			...e,
																			tasks: e.tasks.map((t) =>
																				t.id === task.id
																					? { ...t, completed: !t.completed }
																					: t
																			),
																	  }
																	: e
															);

															setEvents(updatedEvents);

															const updatedTasks = selectedEvent.tasks.map(
																(t) =>
																	t.id === task.id
																		? { ...t, completed: !t.completed }
																		: t
															);

															setSelectedEvent({
																...selectedEvent,
																tasks: updatedTasks,
															});
														}}
													>
														<div
															className={`w-5 h-5 rounded-full border flex items-center justify-center ${
																task.completed
																	? "bg-emerald-500 border-emerald-500"
																	: "border-gray-400"
															}`}
														>
															{task.completed && (
																<Check size={12} className="text-white" />
															)}
														</div>
													</button>

													<span
														className={`${
															task.completed
																? "line-through text-gray-500"
																: "text-gray-700"
														} flex-grow`}
													>
														{task.description}
													</span>

													{member && (
														<span
															className="px-2 py-1 rounded text-white text-xs flex-shrink-0"
															style={{ backgroundColor: member.color }}
														>
															{member.name}
														</span>
													)}

													<button
														className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-all"
														onClick={() =>
															setDeleteConfirm({ type: "task", id: task.id })
														}
													>
														<Trash2 size={16} />
													</button>
												</div>
											);
										})}
									</div>
								)}

								<div className="mt-2 p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50">
									<h4 className="text-sm font-medium text-gray-700 mb-2">
										Add New Task
									</h4>
									<div className="flex flex-col gap-3">
										<input
											className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
											placeholder="Task description"
											value={newTask.description || ""}
											onChange={(e) =>
												setNewTask({ ...newTask, description: e.target.value })
											}
										/>

										<select
											className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
											value={newTask.assignedTo || ""}
											onChange={(e) =>
												setNewTask({ ...newTask, assignedTo: e.target.value })
											}
										>
											<option value="">Assign to...</option>
											{members.map((member) => (
												<option key={member.id} value={member.id}>
													{member.name}
												</option>
											))}
										</select>

										<button
											className={`px-4 py-2 rounded transition-all ${
												!newTask.description || !newTask.assignedTo
													? "bg-gray-300 text-gray-500 cursor-not-allowed"
													: "bg-indigo-600 text-white hover:bg-indigo-700"
											}`}
											onClick={() => handleAddTask(selectedEvent.id)}
											disabled={!newTask.description || !newTask.assignedTo}
										>
											Add Task
										</button>
									</div>
								</div>
							</div>
						)}
					</div>

					{}
					<div className="rounded-lg shadow-sm bg-white p-4">
						<button
							className="flex items-center w-full px-2 py-1 hover:bg-gray-50 rounded transition-all"
							onClick={() =>
								setExpandedSections((prev) => ({ ...prev, notes: !prev.notes }))
							}
						>
							<h3 className="font-medium text-gray-800 text-lg">Notes</h3>
							<ChevronRight
								size={20}
								className={`ml-auto transition-transform duration-200 ${
									expandedSections.notes ? "rotate-90" : ""
								}`}
							/>
						</button>

						{expandedSections.notes && (
							<div className="mt-4 flex flex-col gap-4 animate-fade-in">
								{selectedEvent.notes.length === 0 ? (
									<p className="text-gray-500 text-sm">
										No notes yet. Add one below!
									</p>
								) : (
									<div className="space-y-3">
										{selectedEvent.notes.map((note) => (
											<div
												key={note.id}
												className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg group"
											>
												<div className="flex justify-between items-start">
													<span className="text-gray-700 whitespace-pre-wrap">
														{note.content}
													</span>
													<button
														className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-all flex-shrink-0 ml-2"
														onClick={() =>
															setDeleteConfirm({ type: "note", id: note.id })
														}
													>
														<Trash2 size={16} />
													</button>
												</div>
												<span className="text-xs text-gray-500">
													{note.createdAt.toLocaleString()}
												</span>
											</div>
										))}
									</div>
								)}

								<div className="mt-2">
									<textarea
										className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
										placeholder="Add a note..."
										rows={3}
										value={newNote}
										onChange={(e) => setNewNote(e.target.value)}
									/>
									<button
										className={`mt-2 px-4 py-2 rounded transition-all ${
											!newNote.trim()
												? "bg-gray-300 text-gray-500 cursor-not-allowed"
												: "bg-indigo-600 text-white hover:bg-indigo-700"
										}`}
										onClick={() => handleAddNote(selectedEvent.id)}
										disabled={!newNote.trim()}
									>
										Add Note
									</button>
								</div>
							</div>
						)}
					</div>

					{}
					<div className="rounded-lg shadow-sm bg-white p-4">
						<button
							className="flex items-center w-full px-2 py-1 hover:bg-gray-50 rounded transition-all"
							onClick={() =>
								setExpandedSections((prev) => ({
									...prev,
									attachments: !prev.attachments,
								}))
							}
						>
							<h3 className="font-medium text-gray-800 text-lg">Attachments</h3>
							<ChevronRight
								size={20}
								className={`ml-auto transition-transform duration-200 ${
									expandedSections.attachments ? "rotate-90" : ""
								}`}
							/>
						</button>

						{expandedSections.attachments && (
							<div className="mt-4 flex flex-col gap-4 animate-fade-in">
								<input
									type="file"
									multiple
									className="text-gray-700"
									onChange={(e) => {
										const newAttachments = Array.from(e.target.files || []).map(
											(file) => ({
												id: Date.now().toString(),
												file,
												uploadedAt: new Date(),
												uploadedBy: "Current User",
											})
										);

										const updatedEvents = events.map((event) =>
											event.id === selectedEvent.id
												? {
														...event,
														attachments: [
															...event.attachments,
															...newAttachments,
														],
												  }
												: event
										);

										setEvents(updatedEvents);

										setSelectedEvent({
											...selectedEvent,
											attachments: [
												...selectedEvent.attachments,
												...newAttachments,
											],
										});

										e.target.value = "";
									}}
								/>

								{selectedEvent.attachments.length === 0 ? (
									<p className="text-gray-500 text-sm">No attachments yet.</p>
								) : (
									<div className="space-y-2 mt-2">
										{selectedEvent.attachments.map((att) => {
											const fileUrl = URL.createObjectURL(att.file);

											const isImage = att.file.type.startsWith("image/");

											return (
												<div
													key={att.id}
													className="flex flex-col gap-2 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg"
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															<FileText size={16} className="text-gray-500" />
															<span className="truncate">{att.file.name}</span>
														</div>
														<div className="flex items-center gap-2">
															<span className="text-xs text-gray-500">
																{att.uploadedAt.toLocaleDateString()}
															</span>
															<button
																className="text-red-500 hover:text-red-700 transition-colors"
																onClick={() =>
																	setDeleteConfirm({
																		type: "attachment",
																		id: att.id,
																	})
																}
															>
																<Trash2 size={16} />
															</button>
														</div>
													</div>

													{}
													{isImage && (
														<div className="mt-2">
															<img
																src={fileUrl}
																alt={att.file.name}
																className="max-h-40 rounded border border-gray-200 object-contain bg-white p-1"
															/>
														</div>
													)}

													<div className="flex justify-end mt-1">
														<a
															href={fileUrl}
															download={att.file.name}
															className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1 rounded text-xs transition-colors"
															target="_blank"
															rel="noopener noreferrer"
														>
															{isImage ? "View Full Size" : "Download"}
														</a>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		);

	const renderCreateEventView = () => (
		<div className="p-4 md:p-6 font-sans flex flex-col gap-6">
			<button
				className="flex items-center mb-2 text-indigo-600 hover:text-indigo-800 transform hover:scale-105 transition-all self-start"
				onClick={() => handleViewChange("calendar")}
			>
				<ChevronLeft size={20} /> Back
			</button>

			<h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-700 tracking-tight leading-tight">
				Create New Event
			</h2>

			<form
				onSubmit={handleAddEvent}
				className="flex flex-col gap-5 rounded-lg shadow-md bg-white p-6"
			>
				<div className="space-y-1">
					<label className="text-sm font-medium text-gray-700">
						Event Title *
					</label>
					<input
						className={`p-2 border rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 ${
							newEvent.title === "" ? "border-red-500" : ""
						}`}
						placeholder="Enter event title"
						value={newEvent.title || ""}
						onChange={(e) =>
							setNewEvent({ ...newEvent, title: e.target.value })
						}
						required
					/>
				</div>

				<div className="space-y-1">
					<label className="text-sm font-medium text-gray-700">
						Start Date & Time *
					</label>
					<input
						className="p-2 border rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
						type="datetime-local"
						value={
							newEvent.startDate ? formatDateForInput(newEvent.startDate) : ""
						}
						onChange={(e) =>
							setNewEvent({ ...newEvent, startDate: new Date(e.target.value) })
						}
						required
					/>
				</div>

				<div className="space-y-1">
					<label className="text-sm font-medium text-gray-700">
						End Date & Time *
					</label>
					<input
						className="p-2 border rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
						type="datetime-local"
						value={newEvent.endDate ? formatDateForInput(newEvent.endDate) : ""}
						onChange={(e) =>
							setNewEvent({ ...newEvent, endDate: new Date(e.target.value) })
						}
						required
					/>
				</div>

				<div className="space-y-1">
					<label className="text-sm font-medium text-gray-700">Location</label>
					<input
						className="p-2 border rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
						placeholder="Enter location (optional)"
						value={newEvent.location || ""}
						onChange={(e) =>
							setNewEvent({ ...newEvent, location: e.target.value })
						}
					/>
				</div>

				<div className="space-y-1">
					<label className="text-sm font-medium text-gray-700">
						Event Color
					</label>
					<div className="flex flex-wrap gap-3 mt-2">
						{Object.values(COLORS).map((color) => (
							<button
								key={color}
								type="button"
								className={`w-8 h-8 rounded-full ${
									newEvent.color === color
										? "ring-2 ring-offset-2 ring-indigo-500"
										: ""
								} transform hover:scale-105 transition-all`}
								style={{ backgroundColor: color }}
								onClick={() => setNewEvent({ ...newEvent, color })}
							/>
						))}
					</div>
				</div>

				<div className="space-y-1">
					<label className="text-sm font-medium text-gray-700">
						Description
					</label>
					<textarea
						className="p-2 border rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
						placeholder="Enter event description (optional)"
						rows={4}
						value={newEvent.description || ""}
						onChange={(e) =>
							setNewEvent({ ...newEvent, description: e.target.value })
						}
					/>
				</div>

				<button
					type="submit"
					className={`mt-2 px-4 py-3 rounded transition-all font-medium ${
						!newEvent.title || !newEvent.startDate || !newEvent.endDate
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-indigo-600 text-white hover:bg-indigo-700"
					}`}
					disabled={!newEvent.title || !newEvent.startDate || !newEvent.endDate}
				>
					Create Event
				</button>
			</form>
		</div>
	);

	const renderMembersView = () => (
		<div className="p-4 md:p-6 font-sans flex flex-col gap-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-700 tracking-tight leading-tight">
					Family Members
				</h2>
				<button
					className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transform hover:scale-105 transition-all"
					onClick={() => handleViewChange("calendar")}
				>
					<Calendar size={16} /> Calendar
				</button>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6">
				<h3 className="text-lg font-medium text-gray-800 mb-4">
					Add New Member
				</h3>
				<form
					onSubmit={handleAddMember}
					className="flex flex-col md:flex-row gap-4 mb-6"
				>
					<input
						className="p-2 border rounded flex-grow focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
						placeholder="Member name"
						value={newMember.name || ""}
						onChange={(e) =>
							setNewMember({ ...newMember, name: e.target.value })
						}
						required
					/>

					<div className="flex gap-2 flex-wrap">
						{Object.values(COLORS).map((color) => (
							<button
								key={color}
								type="button"
								className={`w-8 h-8 rounded-full ${
									newMember.color === color
										? "ring-2 ring-offset-2 ring-indigo-500"
										: ""
								} transform hover:scale-105 transition-all`}
								style={{ backgroundColor: color }}
								onClick={() => setNewMember({ ...newMember, color })}
							/>
						))}
					</div>

					<button
						type="submit"
						className={`px-4 py-2 rounded whitespace-nowrap transition-all ${
							!newMember.name
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-indigo-600 text-white hover:bg-indigo-700"
						}`}
						disabled={!newMember.name}
					>
						Add Member
					</button>
				</form>

				<div className="border-t pt-6">
					<h3 className="text-lg font-medium text-gray-800 mb-4">
						Current Members
					</h3>
					{members.length === 0 ? (
						<p className="text-gray-500">No members yet. Add one above!</p>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{members.map((member) => (
								<div
									key={member.id}
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:shadow-sm transition-shadow"
								>
									<span
										className="w-8 h-8 rounded-full flex-shrink-0"
										style={{ backgroundColor: member.color }}
									/>
									<span className="font-medium text-gray-800">
										{member.name}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);

	return (
		<div
			className="min-h-screen bg-gray-50 font-sans"
			style={{
				backgroundImage:
					"url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='17' cy='17' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
			}}
		>
			<Helmet>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<title>Family Event Planner</title>
			</Helmet>

			<header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-20">
				<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Calendar size={24} />
						<span className="font-serif font-bold text-xl tracking-tight">
							Family Events
						</span>
					</div>

					<nav className="flex flex-wrap justify-center gap-2">
						<button
							className={`flex items-center gap-1 px-3 py-2 rounded transition-all ${
								currentView === "calendar"
									? "bg-indigo-700"
									: "hover:bg-indigo-700"
							}`}
							onClick={() => handleViewChange("calendar")}
						>
							<Calendar size={18} /> Calendar
						</button>
						<button
							className={`flex items-center gap-1 px-3 py-2 rounded transition-all ${
								currentView === "events"
									? "bg-indigo-700"
									: "hover:bg-indigo-700"
							}`}
							onClick={() => handleViewChange("events")}
						>
							<List size={18} /> Events
						</button>
						<button
							className={`flex items-center gap-1 px-3 py-2 rounded transition-all ${
								currentView === "createEvent"
									? "bg-indigo-700"
									: "hover:bg-indigo-700"
							}`}
							onClick={() => handleViewChange("createEvent")}
						>
							<Plus size={18} /> New Event
						</button>
						<button
							className={`flex items-center gap-1 px-3 py-2 rounded transition-all ${
								currentView === "members"
									? "bg-indigo-700"
									: "hover:bg-indigo-700"
							}`}
							onClick={() => handleViewChange("members")}
						>
							<Users size={18} /> Members
						</button>
					</nav>
				</div>
			</header>

			<main className="max-w-7xl mx-auto pb-12">
				<div
					className={`transition-opacity duration-200 ${
						isLoading ? "opacity-0" : "opacity-100"
					}`}
				>
					{currentView === "calendar" && renderCalendarView()}
					{currentView === "event" && renderEventView()}
					{currentView === "createEvent" && renderCreateEventView()}
					{currentView === "members" && renderMembersView()}
					{currentView === "events" && renderEventsListView()}
				</div>
			</main>

			{deleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
					<div className="bg-white p-6 rounded-lg shadow-lg m-4 max-w-sm w-full animate-fade-in">
						<p className="text-gray-700 mb-4">
							Are you sure you want to delete this {deleteConfirm.type}?
							{deleteConfirm.type === "event" &&
								" This action cannot be undone."}
						</p>
						<div className="flex gap-4 justify-end">
							<button
								className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
								onClick={() => setDeleteConfirm(null)}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
								onClick={() =>
									handleDelete(deleteConfirm.type, deleteConfirm.id)
								}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			<style jsx global>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in {
					animation: fadeIn 0.3s ease-out;
				}

				.scrollbar-thin::-webkit-scrollbar {
					width: 4px;
					height: 4px;
				}
				.scrollbar-thin::-webkit-scrollbar-track {
					background: #f1f1f1;
				}
				.scrollbar-thin::-webkit-scrollbar-thumb {
					background-color: #d1d5db;
					border-radius: 4px;
				}
				.scrollbar-thin::-webkit-scrollbar-thumb:hover {
					background-color: #9ca3af;
				}
			`}</style>
		</div>
	);
};

export default FamilyEventPlanner;
