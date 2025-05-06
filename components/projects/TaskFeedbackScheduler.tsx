"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	FaCalendarCheck,
	FaPlus,
	FaBars,
	FaTimes,
	FaChevronLeft,
	FaChevronRight,
	FaSearch,
	FaEdit,
	FaSyncAlt,
	FaShareAlt,
	FaBell,
	FaLink,
	FaFacebook,
	FaTwitter,
	FaLinkedin,
	FaWhatsapp,
	FaCheckCircle,
	FaExclamationCircle,
	FaExclamationTriangle,
	FaInfoCircle,
	FaCalendarAlt,
	FaListAlt,
} from "react-icons/fa";
import {
	format,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameDay,
	isSameMonth,
	parseISO,
	addHours,
	isWithinInterval,
	startOfDay,
	endOfDay,
} from "date-fns";

interface Event {
	id: string;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	priority: "low" | "medium" | "high";
	recurrence?: { type: "daily" | "weekly" | "monthly" };
	createdAt: string;
	updatedAt: string;
}

interface Feedback {
	id: string;
	date: string;
	rating: "good" | "average" | "bad";
	note: string;
	createdAt: string;
	updatedAt: string;
}

interface Notification {
	id: string;
	title: string;
	message: string;
	type: "success" | "error" | "warning" | "info";
	priority?: "low" | "medium" | "high";
	eventStart?: string;
	createdAt: string;
	displayUntil?: string;
}

interface EventInstance extends Event {
	isOccurrence?: boolean;
	masterEventId?: string;
}

interface Theme {
	colors: {
		primary: string;
		secondary: string;
		accent: string;
		background: string;
		card: string;
		text: string;
		success: string;
		warning: string;
		error: string;
	};
	typography: {
		fontFamily: string;
		fontSize: {
			base: string;
			lg: string;
			xl: string;
			"2xl": string;
			"3xl": string;
		};
	};
	fontWeight: {
		normal: number;
		medium: number;
		semibold: number;
		bold: number;
	};
	spacing: {
		xs: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
	};
}

const generateId = (): string =>
	`item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const formatDateForInput = (date: Date | string): string => {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "yyyy-MM-dd'T'HH:mm");
};

const getOccurrences = (
	event: Event,
	rangeStart: Date,
	rangeEnd: Date
): EventInstance[] => {
	const occurrences: EventInstance[] = [];
	const masterStart = parseISO(event.startDate);
	const masterEnd = parseISO(event.endDate);
	const duration = masterEnd.getTime() - masterStart.getTime();
	const masterDay = new Date(masterStart).setHours(0, 0, 0, 0);

	if (masterDay >= rangeStart.getTime() && masterDay <= rangeEnd.getTime()) {
		occurrences.push({ ...event });
	}

	if (event.recurrence?.type && event.recurrence.type !== "none") {
		let currentStart = new Date(masterStart);
		const maxIter =
			event.recurrence.type === "daily"
				? 1100
				: event.recurrence.type === "weekly"
				? 160
				: 40;
		let iterations = 0;

		while (iterations < maxIter) {
			iterations++;
			let nextDate = new Date(currentStart);
			switch (event.recurrence.type) {
				case "daily":
					nextDate.setDate(nextDate.getDate() + 1);
					break;
				case "weekly":
					nextDate.setDate(nextDate.getDate() + 7);
					break;
				case "monthly":
					const d = nextDate.getDate();
					nextDate.setMonth(nextDate.getMonth() + 1);
					if (nextDate.getDate() !== d) nextDate.setDate(0);
					break;
				default:
					iterations = maxIter;
					continue;
			}
			currentStart = nextDate;
			const occurrenceDay = new Date(currentStart).setHours(0, 0, 0, 0);
			if (occurrenceDay > rangeEnd.getTime()) break;
			if (occurrenceDay >= rangeStart.getTime()) {
				occurrences.push({
					...event,
					id: `${event.id}-occ-${format(currentStart, "yyyy-MM-dd")}`,
					startDate: currentStart.toISOString(),
					endDate: new Date(currentStart.getTime() + duration).toISOString(),
					isOccurrence: true,
					masterEventId: event.id,
				});
			}
		}
	}
	return occurrences;
};

const theme: Theme = {
	colors: {
		primary: "#4F46E5",
		secondary: "#FFFFFF",
		accent: "#F97316",
		background: "#F9FAFB",
		card: "#FFFFFF",
		text: "#1F2937",
		success: "#10B981",
		warning: "#F59E0B",
		error: "#EF4444",
	},
	spacing: {
		xs: "0.5rem",
		sm: "1rem",
		md: "1.5rem",
		lg: "2rem",
		xl: "3rem",
	},
	typography: {
		fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
		fontSize: {
			base: "14px",
			lg: "16px",
			xl: "18px",
			"2xl": "20px",
			"3xl": "24px",
		},
	},
	fontWeight: {
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
	},
};

const TaskFeedbackScheduler: React.FC = () => {
	const [selectedPriority, setSelectedPriority] = useState<
		"all" | "low" | "medium" | "high"
	>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [currentView, setCurrentView] = useState<"calendar" | "list">(
		"calendar"
	);
	const [modalType, setModalType] = useState<"event" | "feedback" | null>(null);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
	const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
	const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
	const [events, setEvents] = useState<Event[]>([]);
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [viewingDate, setViewingDate] = useState<Date | null>(null);
	const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
	const [clickTimeout, setClickTimeout] = useState<number | null>(null);
	const [isDoubleTap, setIsDoubleTap] = useState<boolean>(false);
	const lastTapTime = useRef<number>(0);

	const [formData, setFormData] = useState<{
		id: string;
		title: string;
		description: string;
		startDate: string;
		endDate: string;
		priority: "low" | "medium" | "high";
		recurrence: "none" | "daily" | "weekly" | "monthly";
	}>({
		id: "",
		title: "",
		description: "",
		startDate: formatDateForInput(new Date()),
		endDate: formatDateForInput(addHours(new Date(), 1)),
		priority: "high",
		recurrence: "none",
	});

	const [feedbackForm, setFeedbackForm] = useState<{
		id: string;
		date: string;
		rating: "good" | "average" | "bad";
		note: string;
	}>({
		id: "",
		date: format(new Date(), "yyyy-MM-dd"),
		rating: "good",
		note: "",
	});

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const [showNotificationList, setShowNotificationList] =
		useState<boolean>(false);
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
	const modalRef = useRef<HTMLDivElement>(null);
	const notificationRef = useRef<HTMLDivElement>(null);
	const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
	const userDropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		try {
			const storedEvents = localStorage.getItem("events_v3");
			if (storedEvents) {
				const parsedEvents: Event[] = JSON.parse(storedEvents).map(
					(event: Event) => ({
						...event,
						title: event.title || "Untitled Event",
						description: event.description || "",
						startDate: event.startDate,
						endDate:
							event.endDate ||
							new Date(
								new Date(event.startDate).getTime() + 3600000
							).toISOString(),
						createdAt: event.createdAt || new Date().toISOString(),
						updatedAt: event.updatedAt || new Date().toISOString(),
					})
				);
				setEvents(parsedEvents);
			} else {
				const defaultEvents: Event[] = [
					{
						id: generateId(),
						title: "Morning Routine",
						description: "Daily workout and meditation.",
						startDate: new Date("2025-04-26T07:00:00").toISOString(),
						endDate: new Date("2025-04-26T08:00:00").toISOString(),
						priority: "high",
						recurrence: { type: "daily" },
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
					{
						id: generateId(),
						title: "Weekly Planning",
						description: "Set goals and prioritize tasks for the week.",
						startDate: new Date("2025-04-27T09:00:00").toISOString(),
						endDate: new Date("2025-04-27T10:00:00").toISOString(),
						priority: "medium",
						recurrence: { type: "weekly" },
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
					{
						id: generateId(),
						title: "Team Meeting",
						description: "Monthly progress review with team.",
						startDate: new Date("2025-04-30T14:00:00").toISOString(),
						endDate: new Date("2025-04-30T15:30:00").toISOString(),
						priority: "high",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
				];
				setEvents(defaultEvents);
				localStorage.setItem("events_v3", JSON.stringify(defaultEvents));
			}

			const storedFeedbacks = localStorage.getItem("feedbacks_v3");
			if (storedFeedbacks) {
				setFeedbacks(JSON.parse(storedFeedbacks));
			} else {
				const defaultFeedbacks: Feedback[] = [
					{
						id: generateId(),
						date: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
						rating: "good",
						note: "Productive day with good energy levels. Completed all planned tasks.",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
				];
				setFeedbacks(defaultFeedbacks);
				localStorage.setItem("feedbacks_v3", JSON.stringify(defaultFeedbacks));
			}

			const storedNotifications = sessionStorage.getItem("notifications");
			if (storedNotifications) {
				setNotifications(JSON.parse(storedNotifications));
			}

			setIsDataLoaded(true);
		} catch (error) {
			console.error("Error loading data:", error);
			setNotifications((prev) => [
				...prev,
				{
					id: generateId(),
					title: "Error",
					message: "Failed to load data.",
					type: "error",
					createdAt: new Date().toISOString(),
					displayUntil: new Date(Date.now() + 5000).toISOString(),
				},
			]);
		}
	}, []);

	useEffect(() => {
		if (typeof window === "undefined" || !isDataLoaded) return;
		try {
			localStorage.setItem("events_v3", JSON.stringify(events));
		} catch (error) {
			console.error("Error saving events:", error);
		}
	}, [events, isDataLoaded]);

	useEffect(() => {
		if (typeof window === "undefined" || !isDataLoaded) return;
		try {
			localStorage.setItem("feedbacks_v3", JSON.stringify(feedbacks));
		} catch (error) {
			console.error("Error saving feedbacks:", error);
		}
	}, [feedbacks, isDataLoaded]);
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				userDropdownRef.current &&
				!userDropdownRef.current.contains(e.target as Node)
			) {
				setUserDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			sessionStorage.setItem("notifications", JSON.stringify(notifications));
		} catch (error) {
			console.error("Error saving notifications:", error);
		}
	}, [notifications]);

	useEffect(() => {
		if (!isDataLoaded) return;

		const now = new Date();
		const rangeStart = startOfDay(now);
		const rangeEnd = endOfDay(now);

		const todayEvents = events
			.flatMap((event) => getOccurrences(event, rangeStart, rangeEnd))
			.filter((event) =>
				isWithinInterval(parseISO(event.startDate), {
					start: rangeStart,
					end: rangeEnd,
				})
			)
			.sort(
				(a, b) =>
					parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
			);

		const todayFeedback = feedbacks.find((fb) =>
			isSameDay(parseISO(fb.date), now)
		);

		setNotifications((prev) =>
			prev.filter((n) => !n.title.startsWith("Today's"))
		);

		const newNotifications: Notification[] = [];
		if (todayEvents.length === 0 && !todayFeedback) {
			newNotifications.push({
				id: generateId(),
				title: "Today's Schedule",
				message: "No events or feedback for today.",
				type: "info",
				createdAt: now.toISOString(),
				displayUntil: new Date(now.getTime() + 5000).toISOString(),
			});
		} else {
			todayEvents.forEach((event) => {
				newNotifications.push({
					id: generateId(),
					title: `Today's Event: ${event.title}`,
					message: `Scheduled at ${format(
						parseISO(event.startDate),
						"h:mm a"
					)}`,
					type: "info",
					priority: event.priority,
					eventStart: event.startDate,
					createdAt: now.toISOString(),
					displayUntil: new Date(now.getTime() + 5000).toISOString(),
				});
			});
			if (todayFeedback) {
				newNotifications.push({
					id: generateId(),
					title: "Today's Feedback",
					message: `Rated as ${
						todayFeedback.rating.charAt(0).toUpperCase() +
						todayFeedback.rating.slice(1)
					}`,
					type: "info",
					createdAt: now.toISOString(),
					displayUntil: new Date(now.getTime() + 5000).toISOString(),
				});
			}
		}

		setNotifications((prev) => [...prev, ...newNotifications]);
	}, [isDataLoaded, events, feedbacks]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key === "Escape" &&
				(modalType || viewModalOpen || shareModalOpen)
			) {
				if (modalType) closeModalHandler();
				else if (viewModalOpen) setViewModalOpen(false);
				else setShareModalOpen(false);
			}
			if (modalType && modalRef.current) {
				const focusable = modalRef.current.querySelectorAll(
					"input, textarea, select, button"
				);
				const first = focusable[0] as HTMLElement;
				const last = focusable[focusable.length - 1] as HTMLElement;
				if (e.key === "Tab") {
					if (e.shiftKey && document.activeElement === first) {
						e.preventDefault();
						last.focus();
					} else if (!e.shiftKey && document.activeElement === last) {
						e.preventDefault();
						first.focus();
					}
				}
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [modalType, viewModalOpen, shareModalOpen]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				notificationRef.current &&
				!notificationRef.current.contains(e.target as Node)
			) {
				setShowNotificationList(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		return () => {
			if (clickTimeout !== null) {
				window.clearTimeout(clickTimeout);
			}
		};
	}, [clickTimeout]);

	const closeModalHandler = () => {
		setModalType(null);
		setEditingEvent(null);
		setEditingFeedback(null);
		setFormData({
			id: "",
			title: "",
			description: "",
			startDate: formatDateForInput(new Date()),
			endDate: formatDateForInput(addHours(new Date(), 1)),
			priority: "high",
			recurrence: "none",
		});
		setFeedbackForm({
			id: "",
			date: format(new Date(), "yyyy-MM-dd"),
			rating: "good",
			note: "",
		});
	};

	const saveEventHandler = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.title) {
			setNotifications((prev) => [
				...prev,
				{
					id: generateId(),
					title: "Error",
					message: "Title is required.",
					type: "error",
					createdAt: new Date().toISOString(),
					displayUntil: new Date(Date.now() + 5000).toISOString(),
				},
			]);
			return;
		}

		const start = parseISO(formData.startDate);
		const end = parseISO(formData.endDate);
		if (end <= start) {
			setNotifications((prev) => [
				...prev,
				{
					id: generateId(),
					title: "Error",
					message: "End date must be after start date.",
					type: "error",
					createdAt: new Date().toISOString(),
					displayUntil: new Date(Date.now() + 5000).toISOString(),
				},
			]);
			return;
		}

		const newEvent: Event = {
			id: formData.id || generateId(),
			title: formData.title,
			description: formData.description,
			startDate: formData.startDate,
			endDate: formData.endDate,
			priority: formData.priority,
			recurrence:
				formData.recurrence !== "none"
					? { type: formData.recurrence }
					: undefined,
			createdAt: editingEvent
				? editingEvent.createdAt
				: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		setEvents((prev) =>
			editingEvent
				? prev.map((ev) => (ev.id === newEvent.id ? newEvent : ev))
				: [...prev, newEvent]
		);
		setNotifications((prev) => [
			...prev,
			{
				id: generateId(),
				title: "Success",
				message: editingEvent ? "Event updated." : "Event created.",
				type: "success",
				createdAt: new Date().toISOString(),
				displayUntil: new Date(Date.now() + 5000).toISOString(),
			},
		]);
		closeModalHandler();
	};

	const handleSaveFeedback = (e: React.FormEvent) => {
		e.preventDefault();
		const newFeedback: Feedback = {
			id: feedbackForm.id || generateId(),
			date: feedbackForm.date,
			rating: feedbackForm.rating,
			note: feedbackForm.note,
			createdAt: editingFeedback
				? editingFeedback.createdAt
				: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const existingFeedbackIndex = feedbacks.findIndex(
			(fb) => fb.date === newFeedback.date && fb.id !== newFeedback.id
		);

		if (existingFeedbackIndex !== -1 && !editingFeedback) {
			setNotifications((prev) => [
				...prev,
				{
					id: generateId(),
					title: "Warning",
					message: "Feedback already exists for this day. It will be replaced.",
					type: "warning",
					createdAt: new Date().toISOString(),
					displayUntil: new Date(Date.now() + 5000).toISOString(),
				},
			]);

			const updatedFeedbacks = [...feedbacks];
			updatedFeedbacks.splice(existingFeedbackIndex, 1);
			setFeedbacks([...updatedFeedbacks, newFeedback]);
		} else {
			setFeedbacks((prev) =>
				editingFeedback
					? prev.map((fb) => (fb.id === newFeedback.id ? newFeedback : fb))
					: [...prev, newFeedback]
			);
		}

		setNotifications((prev) => [
			...prev,
			{
				id: generateId(),
				title: "Success",
				message: editingFeedback ? "Feedback updated." : "Feedback submitted.",
				type: "success",
				createdAt: new Date().toISOString(),
				displayUntil: new Date(Date.now() + 5000).toISOString(),
			},
		]);
		closeModalHandler();
	};

	const handleDeleteEvent = () => {
		if (editingEvent && confirm("Delete this event?")) {
			setEvents((prev) => prev.filter((ev) => ev.id !== editingEvent.id));
			setNotifications((prev) => [
				...prev,
				{
					id: generateId(),
					title: "Success",
					message: "Event deleted.",
					type: "success",
					createdAt: new Date().toISOString(),
					displayUntil: new Date(Date.now() + 5000).toISOString(),
				},
			]);
			closeModalHandler();
		}
	};

	const handleDeleteFeedback = () => {
		if (editingFeedback && confirm("Delete this feedback?")) {
			setFeedbacks((prev) => prev.filter((fb) => fb.id !== editingFeedback.id));
			setNotifications((prev) => [
				...prev,
				{
					id: generateId(),
					title: "Success",
					message: "Feedback deleted.",
					type: "success",
					createdAt: new Date().toISOString(),
					displayUntil: new Date(Date.now() + 5000).toISOString(),
				},
			]);
			closeModalHandler();
		}
	};

	const handleShareEvent = (event: Event) => {
		setViewingEvent(event);
		setShareModalOpen(true);
	};

	const handleShareToSocial = (platform: string, event: Event) => {
		const text = `${event.title} on ${format(
			parseISO(event.startDate),
			"PPPp"
		)} - ${event.description}`;
		const url = typeof window !== "undefined" ? window.location.href : "";
		let shareUrl = "";
		switch (platform) {
			case "facebook":
				shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					url
				)}&e=${encodeURIComponent(text)}`;
				break;
			case "twitter":
				shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
					text
				)}&url=${encodeURIComponent(url)}`;
				break;
			case "linkedin":
				shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
					url
				)}&title=${encodeURIComponent(
					event.title
				)}&summary=${encodeURIComponent(text)}`;
				break;
			case "whatsapp":
				shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
					text + " " + url
				)}`;
				break;
			default:
				showToast(
					"info",
					"Info",
					`Sharing via ${platform} is not implemented yet.`
				);
				return;
		}

		showToast("success", "Share", `Sharing to ${platform}...`);

		if (typeof window !== "undefined") {
			window.open(shareUrl, "_blank");
		}
	};

	const handleCopyLink = (event: Event) => {
		if (typeof window === "undefined") return;

		const text = `${event.title} on ${format(
			parseISO(event.startDate),
			"PPPp"
		)} - ${event.description} ${window.location.href}`;
		navigator.clipboard
			.writeText(text)
			.then(() => {
				showToast("success", "Success", "Event details copied to clipboard.");
			})
			.catch(() => {
				showToast("error", "Error", "Failed to copy event details.");
			});
	};

	const showToast = (
		type: "success" | "error" | "warning" | "info",
		title: string,
		message: string
	) => {
		setNotifications((prev) => [
			...prev,
			{
				id: generateId(),
				title,
				message,
				type,
				createdAt: new Date().toISOString(),
				displayUntil: new Date(Date.now() + 5000).toISOString(),
			},
		]);
	};

	const navigateCalendar = (direction: "prev" | "next" | "today") => {
		setCurrentDate((prev) => {
			if (direction === "prev") return subMonths(prev, 1);
			if (direction === "next") return addMonths(prev, 1);
			return new Date();
		});
	};

	const handleDayClick = (day: Date) => {
		const now = Date.now();
		const DOUBLE_TAP_DELAY = 300;

		if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
			setIsDoubleTap(true);
			lastTapTime.current = 0;

			if (clickTimeout !== null) {
				window.clearTimeout(clickTimeout);
				setClickTimeout(null);
			}

			handleDayDoubleClick(day);
			return;
		}

		lastTapTime.current = now;

		if (clickTimeout !== null) {
			window.clearTimeout(clickTimeout);
		}

		const timeout = window.setTimeout(() => {
			if (!isDoubleTap) {
				setViewingDate(day);
				setViewModalOpen(true);
			}
			setIsDoubleTap(false);
		}, DOUBLE_TAP_DELAY);

		setClickTimeout(timeout);
	};

	const handleDayDoubleClick = (day: Date) => {
		if (clickTimeout !== null) {
			window.clearTimeout(clickTimeout);
			setClickTimeout(null);
		}

		setFormData({
			...formData,
			startDate: formatDateForInput(day),
			endDate: formatDateForInput(addHours(day, 1)),
		});
		setFeedbackForm({
			...feedbackForm,
			date: format(day, "yyyy-MM-dd"),
		});

		setModalType("event");
	};

	const renderCalendar = useCallback(() => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
		const days = eachDayOfInterval({ start: startDate, end: endDate });

		const rangeStart = startDate;
		const rangeEnd = endDate;
		const instances = events
			.flatMap((event) => getOccurrences(event, rangeStart, rangeEnd))
			.filter((inst) => {
				const prioOk =
					selectedPriority === "all" || inst.priority === selectedPriority;
				const searchOk =
					!searchQuery ||
					inst.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					inst.description.toLowerCase().includes(searchQuery.toLowerCase());
				return prioOk && searchOk;
			});

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return (
			<div className="grid grid-cols-7 gap-px bg-gray-200 flex-1 rounded-lg overflow-hidden">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div
						key={day}
						className="bg-gray-50 p-1 text-center font-semibold text-gray-500 text-xs sm:p-2"
						style={{ fontWeight: theme.fontWeight.semibold }}
					>
						{day}
					</div>
				))}
				{days.map((day) => {
					const dayEvents = instances.filter((inst) =>
						isSameDay(parseISO(inst.startDate), day)
					);
					const dayFeedback = feedbacks.find((fb) =>
						isSameDay(parseISO(fb.date), day)
					);
					const isCurrentMonth = isSameMonth(day, monthStart);
					const isToday = isSameDay(day, today);

					return (
						<div
							key={day.toISOString()}
							className={`calendar-day p-1 sm:p-2 flex flex-col items-start justify-start ${
								isCurrentMonth ? "bg-white" : "bg-gray-50"
							} ${
								isToday ? "ring-2 ring-[var(--primary)]" : ""
							} hover:bg-gray-50 touch-action-manipulation cursor-pointer transition duration-150`}
							onClick={() => handleDayClick(day)}
							onDoubleClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleDayDoubleClick(day);
							}}
						>
							<div
								className={`day-number text-xs font-medium mb-1 ${
									isToday
										? "bg-[var(--primary)] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
										: "text-gray-700"
								}`}
								style={{ fontWeight: theme.fontWeight.medium }}
							>
								{format(day, "d")}
							</div>

							<div className="day-content flex flex-col items-start gap-1 w-full">
								{dayFeedback && (
									<div className="feedback-indicator w-full flex justify-center">
										<span
											className="text-xs border rounded-full px-1 bg-opacity-20 text-center"
											style={{
												backgroundColor:
													dayFeedback.rating === "good"
														? "rgba(16, 185, 129, 0.2)"
														: dayFeedback.rating === "average"
														? "rgba(245, 158, 11, 0.2)"
														: "rgba(239, 68, 68, 0.2)",
												color:
													dayFeedback.rating === "good"
														? "rgb(16, 185, 129)"
														: dayFeedback.rating === "average"
														? "rgb(245, 158, 11)"
														: "rgb(239, 68, 68)",
											}}
										>
											{dayFeedback.rating === "good"
												? "😊"
												: dayFeedback.rating === "average"
												? "😐"
												: "😞"}
										</span>
									</div>
								)}

								<div className="mobile-view sm:hidden flex items-center justify-center w-full">
									{dayEvents.length > 0 && (
										<span
											className={`text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center text-white ${
												dayEvents.some((e) => e.priority === "high")
													? "bg-[var(--error)]"
													: dayEvents.some((e) => e.priority === "medium")
													? "bg-[var(--warning)]"
													: "bg-[var(--primary)]"
											}`}
										>
											{dayEvents.length}
										</span>
									)}
								</div>

								<div className="desktop-view hidden sm:block space-y-1 overflow-y-auto w-full max-h-16">
									{dayEvents.slice(0, 2).map((event) => (
										<div
											key={event.id}
											className={`day-event truncate rounded text-white py-1 px-1.5 text-xs cursor-pointer hover:opacity-90 ${
												event.priority === "high"
													? "bg-[var(--error)]"
													: event.priority === "medium"
													? "bg-[var(--warning)]"
													: "bg-[var(--primary)]"
											}`}
											onClick={(e) => {
												e.stopPropagation();
												setViewingEvent(
													events.find(
														(ev) => ev.id === (event.masterEventId || event.id)
													) || null
												);
												setViewModalOpen(true);
											}}
										>
											{event.recurrence || event.isOccurrence ? (
												<FaSyncAlt className="inline mr-1 text-[8px]" />
											) : null}
											{format(parseISO(event.startDate), "h:mm a")}{" "}
											{event.title}
										</div>
									))}
									{dayEvents.length > 2 && (
										<div className="text-xs text-gray-500 text-center">
											+{dayEvents.length - 2} more
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}, [
		currentDate,
		events,
		feedbacks,
		selectedPriority,
		searchQuery,
		formData,
		feedbackForm,
	]);

	const renderEventList = useCallback(() => {
		const rangeStart = new Date();
		const rangeEnd = addMonths(new Date(), 12);
		const instances = events
			.flatMap((event) => getOccurrences(event, rangeStart, rangeEnd))
			.filter((inst) => {
				const prioOk =
					selectedPriority === "all" || inst.priority === selectedPriority;
				const searchOk =
					!searchQuery ||
					inst.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					inst.description.toLowerCase().includes(searchQuery.toLowerCase());
				return prioOk && searchOk;
			})
			.sort(
				(a, b) =>
					new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
			);

		const feedbackFiltered = feedbacks
			.filter((fb) =>
				searchQuery
					? fb.note.toLowerCase().includes(searchQuery.toLowerCase())
					: true
			)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return (
			<div className="space-y-3">
				{instances.map((event) => (
					<div
						key={event.id}
						className={`card p-3 sm:p-4 border-l-4 ${
							event.priority === "high"
								? "border-[var(--error)]"
								: event.priority === "medium"
								? "border-[var(--warning)]"
								: "border-[var(--primary)]"
						} cursor-pointer hover:shadow-md transition-all`}
						onClick={() => {
							setViewingEvent(
								events.find(
									(ev) => ev.id === (event.masterEventId || event.id)
								) || null
							);
							setViewModalOpen(true);
						}}
					>
						<div className="flex justify-between items-start mb-1.5">
							<h3
								className="text-base sm:text-lg font-semibold text-[var(--primary)] truncate pr-2"
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								{event.title}
							</h3>
							<div className="text-xs whitespace-nowrap text-gray-500">
								{format(parseISO(event.startDate), "MMM d, h:mm a")}
							</div>
						</div>
						<p className="text-xs sm:text-sm text-[var(--text)] line-clamp-2">
							{event.description || "No description"}
						</p>
						<div className="flex gap-2 mt-2">
							<button
								className="text-[var(--primary)] hover:text-[var(--primary)]/80 p-1 rounded-full hover:bg-gray-100"
								onClick={(e) => {
									e.stopPropagation();
									const originalEvent = events.find(
										(ev) => ev.id === (event.masterEventId || event.id)
									);
									if (originalEvent) {
										setEditingEvent(originalEvent);
										setFormData({
											id: originalEvent.id,
											title: originalEvent.title,
											description: originalEvent.description,
											startDate: originalEvent.startDate,
											endDate: originalEvent.endDate,
											priority: originalEvent.priority,
											recurrence: originalEvent.recurrence?.type || "none",
										});
										setModalType("event");
									}
								}}
							>
								<FaEdit className="text-sm" />
							</button>
							<button
								className="text-[var(--primary)] hover:text-[var(--primary)]/80 p-1 rounded-full hover:bg-gray-100"
								onClick={(e) => {
									e.stopPropagation();
									handleShareEvent(event);
								}}
							>
								<FaShareAlt className="text-sm" />
							</button>
						</div>
					</div>
				))}

				{feedbackFiltered.map((fb) => (
					<div
						key={fb.id}
						className="card p-3 sm:p-4 border-l-4 border-[var(--accent)] cursor-pointer hover:shadow-md transition-all"
						onClick={() => {
							setViewingDate(parseISO(fb.date));
							setViewModalOpen(true);
						}}
					>
						<div className="flex justify-between items-start mb-1.5">
							<h3
								className="text-base sm:text-lg font-semibold text-[var(--accent)]"
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								Feedback for {format(parseISO(fb.date), "MMM d, yyyy")}
							</h3>
							<div className="flex items-center text-xs text-gray-500">
								{fb.rating === "good"
									? "😊"
									: fb.rating === "average"
									? "😐"
									: "😞"}
								<span className="ml-1">
									{fb.rating.charAt(0).toUpperCase() + fb.rating.slice(1)}
								</span>
							</div>
						</div>
						<p className="text-xs sm:text-sm text-[var(--text)] line-clamp-2">
							{fb.note || "No note"}
						</p>
						<div className="flex gap-2 mt-2">
							<button
								className="text-[var(--accent)] hover:text-[var(--accent)]/80 p-1 rounded-full hover:bg-gray-100"
								onClick={(e) => {
									e.stopPropagation();
									setEditingFeedback(fb);
									setFeedbackForm({
										id: fb.id,
										date: fb.date,
										rating: fb.rating,
										note: fb.note,
									});
									setModalType("feedback");
								}}
							>
								<FaEdit className="text-sm" />
							</button>
						</div>
					</div>
				))}

				{instances.length === 0 && feedbackFiltered.length === 0 && (
					<div className="text-center text-gray-500 py-8 sm:py-12">
						<FaCalendarCheck className="mx-auto text-3xl sm:text-4xl text-gray-400 mb-4" />
						<span className="text-sm sm:text-base">
							No events or feedback match the current filters.
						</span>
					</div>
				)}
			</div>
		);
	}, [events, feedbacks, selectedPriority, searchQuery]);

	return (
		<>
			{}
			<style>{`
        :root {
          --background: ${theme.colors.background};
          --card: ${theme.colors.card};
          --text: ${theme.colors.text};
          --primary: ${theme.colors.primary};
          --secondary: ${theme.colors.secondary};
          --accent: ${theme.colors.accent};
          --success: ${theme.colors.success};
          --warning: ${theme.colors.warning};
          --error: ${theme.colors.error};
          --font-family: ${theme.typography.fontFamily};
          --font-size-base: ${theme.typography.fontSize.base};
          --font-size-lg: ${theme.typography.fontSize.lg};
          --font-size-xl: ${theme.typography.fontSize.xl};
          --font-size-2xl: ${theme.typography.fontSize["2xl"]};
          --font-size-3xl: ${theme.typography.fontSize["3xl"]};
        }

        body {
          background-color: var(--background);
          color: var(--text);
          font-family: var(--font-family);
          font-size: var(--font-size-base);
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        button {
          transition: all 0.2s ease;
        }

        button:hover {
          transform: translateY(-1px);
        }

        .card {
          background-color: var(--card);
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        .touch-action-manipulation {
          touch-action: manipulation;
        }

        .calendar-day {
          min-height: 70px;
          transition: background-color 0.2s ease;
        }

        .day-event {
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        @media (max-width: 640px) {
          .calendar-day {
            min-height: 50px;
            font-size: 12px;
          }
        }
        
        .modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
        
        .modal-content {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

			<div
				className="min-h-screen"
				style={{ fontFamily: theme.typography.fontFamily }}
			>
				{}
				<header className="card glass-effect text-[var(--text)] fixed top-0 left-0 right-0 z-[100] shadow-md flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
					<div className="flex items-center">
						<h1
							className="text-xl sm:text-2xl font-semibold flex items-center text-[var(--primary)]"
							style={{ fontWeight: theme.fontWeight.semibold }}
						>
							<FaCalendarCheck className="mr-2 text-lg sm:text-2xl" />
							<span className="hidden sm:inline">
								Task & Feedback Scheduler
							</span>
							<span className="sm:hidden">Scheduler</span>
						</h1>
					</div>

					<div className="flex items-center gap-2 sm:gap-4">
						<div className="hidden sm:flex gap-1 bg-gray-100 rounded-lg p-1">
							<button
								className={`rounded-md px-3 py-1.5 font-semibold text-xs sm:text-sm flex items-center ${
									currentView === "calendar"
										? "bg-[var(--primary)] text-[var(--secondary)] shadow"
										: "text-[var(--text)] hover:bg-gray-200"
								}`}
								onClick={() => setCurrentView("calendar")}
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								<FaCalendarAlt className="mr-1" /> Calendar
							</button>
							<button
								className={`rounded-md px-3 py-1.5 font-semibold text-xs sm:text-sm flex items-center ${
									currentView === "list"
										? "bg-[var(--primary)] text-[var(--secondary)] shadow"
										: "text-[var(--text)] hover:bg-gray-200"
								}`}
								onClick={() => setCurrentView("list")}
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								<FaListAlt className="mr-1" /> List
							</button>
						</div>

						<div className="relative" ref={notificationRef}>
							<button
								className="bg-gray-100 hover:bg-gray-200 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center relative transition-colors"
								onClick={() => setShowNotificationList(!showNotificationList)}
								aria-label="Toggle Notifications"
							>
								<FaBell className="text-base sm:text-lg text-[var(--text)]" />
								{notifications.length > 0 && (
									<span
										className={`absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 text-white text-[10px] rounded-full flex items-center justify-center ${
											notifications.some((n) => n.priority === "high")
												? "bg-[var(--error)]"
												: notifications.some((n) => n.priority === "medium")
												? "bg-[var(--warning)]"
												: "bg-[var(--primary)]"
										}`}
									>
										{notifications.length > 9 ? "9+" : notifications.length}
									</span>
								)}
							</button>

							{showNotificationList && (
								<div className="absolute -right-12 mt-2 w-64 sm:w-80 card rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-[1200]">
									<div className="p-3 sm:p-4 border-b border-gray-200">
										<h3
											className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--primary)]"
											style={{ fontWeight: theme.fontWeight.semibold }}
										>
											Notifications
										</h3>
									</div>

									{notifications.length > 0 ? (
										notifications
											.sort(
												(a, b) =>
													parseISO(b.createdAt).getTime() -
													parseISO(a.createdAt).getTime()
											)
											.map((notification) => (
												<div
													key={notification.id}
													className={`p-3 sm:p-4 border-b border-gray-200 flex items-start gap-2 sm:gap-3 ${
														notification.type === "success"
															? "bg-[var(--success)]/10 text-[var(--success)]"
															: notification.type === "error"
															? "bg-[var(--error)]/10 text-[var(--error)]"
															: notification.type === "warning"
															? "bg-[var(--warning)]/10 text-[var(--warning)]"
															: "bg-[var(--primary)]/10 text-[var(--primary)]"
													}`}
												>
													<div className="flex-shrink-0">
														{notification.type === "success" && (
															<FaCheckCircle className="text-base" />
														)}
														{notification.type === "error" && (
															<FaExclamationCircle className="text-base" />
														)}
														{notification.type === "warning" && (
															<FaExclamationTriangle className="text-base" />
														)}
														{notification.type === "info" && (
															<FaInfoCircle className="text-base" />
														)}
													</div>
													<div className="flex-1">
														<div className="font-semibold text-xs sm:text-sm">
															{notification.title}
														</div>
														<div className="text-xs sm:text-sm">
															{notification.message}
														</div>
														<div className="text-[10px] sm:text-xs text-gray-500 mt-1">
															{format(parseISO(notification.createdAt), "Pp")}
														</div>
													</div>
													<button
														className="text-gray-500 hover:text-gray-700"
														onClick={() =>
															setNotifications((prev) =>
																prev.filter((n) => n.id !== notification.id)
															)
														}
													>
														<FaTimes className="text-sm" />
													</button>
												</div>
											))
									) : (
										<div className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm">
											No notifications available.
										</div>
									)}

									{notifications.length > 0 && (
										<div className="p-3 border-t border-gray-200">
											<button
												className="w-full text-xs text-center text-[var(--primary)] hover:text-[var(--primary)]/80"
												onClick={() => setNotifications([])}
											>
												Clear all
											</button>
										</div>
									)}
								</div>
							)}
						</div>
						<div className="relative" ref={userDropdownRef}>
							<button
								className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
								onClick={() => setUserDropdownOpen(!userDropdownOpen)}
								aria-label="User Profile"
							>
								<img
									className="w-8 h-8 sm:w-10 sm:h-10 rounded-full "
									src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
								/>
							</button>

							{userDropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 card rounded-lg shadow-xl border border-gray-200 z-[1200] overflow-hidden">
									<div className="p-3 border-b border-gray-200 bg-[var(--primary)]/10">
										<h3 className="text-sm font-semibold text-[var(--primary)]">
											User Settings
										</h3>
									</div>

									<div className="py-1">
										<button
											className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
											onClick={() => {
												setUserDropdownOpen(false);
												setNotifications((prev) => [
													...prev,
													{
														id: generateId(),
														title: "Profile",
														message: "Profile view is not implemented yet",
														type: "info",
														createdAt: new Date().toISOString(),
														displayUntil: new Date(
															Date.now() + 5000
														).toISOString(),
													},
												]);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
											Profile
										</button>

										<button
											className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
											onClick={() => {
												setUserDropdownOpen(false);
												setNotifications((prev) => [
													...prev,
													{
														id: generateId(),
														title: "My Schedule",
														message: "Schedule overview is not implemented yet",
														type: "info",
														createdAt: new Date().toISOString(),
														displayUntil: new Date(
															Date.now() + 5000
														).toISOString(),
													},
												]);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											My Schedule
										</button>
									</div>

									<div className="py-1 border-t border-gray-200">
										<button
											className="w-full px-4 py-2.5 text-left text-sm text-[var(--error)] hover:bg-[var(--error)]/10 flex items-center gap-2"
											onClick={() => {
												setUserDropdownOpen(false);
												setNotifications((prev) => [
													...prev,
													{
														id: generateId(),
														title: "Logout",
														message: "You have been logged out",
														type: "warning",
														createdAt: new Date().toISOString(),
														displayUntil: new Date(
															Date.now() + 5000
														).toISOString(),
													},
												]);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
												/>
											</svg>
											Logout
										</button>
									</div>
								</div>
							)}
						</div>
						<button
							className="sm:hidden bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
							onClick={() => setSidebarOpen(!sidebarOpen)}
							aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
						>
							{sidebarOpen ? (
								<FaTimes className="text-base" />
							) : (
								<FaBars className="text-base" />
							)}
						</button>
					</div>
				</header>

				{}
				<div className="flex flex-col md:flex-row pt-16 sm:pt-20 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)]">
					{}
					<aside
						className={`fixed top-16 sm:top-20 left-0 w-full md:w-64 card shadow-lg flex flex-col gap-4 transition-all duration-300 z-50 md:z-auto md:h-[calc(100vh-80px)] ${
							sidebarOpen ? "translate-x-0" : "-translate-x-full"
						} md:translate-x-0 p-4 sm:p-5`}
					>
						{}
						<div className="flex gap-1 bg-gray-100 rounded-lg p-1 sm:hidden mb-2">
							<button
								className={`rounded-md px-3 py-1.5 font-semibold text-xs flex items-center flex-1 justify-center ${
									currentView === "calendar"
										? "bg-[var(--primary)] text-[var(--secondary)] shadow"
										: "text-[var(--text)] hover:bg-gray-200"
								}`}
								onClick={() => {
									setCurrentView("calendar");
									setSidebarOpen(false);
								}}
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								<FaCalendarAlt className="mr-1" /> Calendar
							</button>
							<button
								className={`rounded-md px-3 py-1.5 font-semibold text-xs flex items-center flex-1 justify-center ${
									currentView === "list"
										? "bg-[var(--primary)] text-[var(--secondary)] shadow"
										: "text-[var(--text)] hover:bg-gray-200"
								}`}
								onClick={() => {
									setCurrentView("list");
									setSidebarOpen(false);
								}}
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								<FaListAlt className="mr-1" /> List
							</button>
						</div>

						<div className="space-y-2">
							<button
								className="w-full bg-[var(--primary)] text-[var(--secondary)] rounded-lg font-semibold flex items-center justify-center gap-1 hover:bg-[var(--primary)]/90 py-2.5 px-4"
								onClick={() => {
									setFormData({
										...formData,
										startDate: formatDateForInput(new Date()),
										endDate: formatDateForInput(addHours(new Date(), 1)),
									});
									setModalType("event");
									setSidebarOpen(false);
								}}
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								<FaPlus className="text-sm" /> New Event
							</button>
							<button
								className="w-full bg-[var(--accent)] text-[var(--secondary)] rounded-lg font-semibold flex items-center justify-center gap-1 hover:bg-[var(--accent)]/90 py-2.5 px-4"
								onClick={() => {
									setFeedbackForm({
										...feedbackForm,
										date: format(new Date(), "yyyy-MM-dd"),
									});
									setModalType("feedback");
									setSidebarOpen(false);
								}}
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								<FaPlus className="text-sm" /> Add Feedback
							</button>
						</div>

						<div>
							<h3
								className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2"
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								Search
							</h3>
							<div className="relative">
								<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
								<input
									type="text"
									placeholder="Search events or feedback..."
									className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<h3
								className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2"
								style={{ fontWeight: theme.fontWeight.semibold }}
							>
								Filter by Priority
							</h3>
							<div className="flex flex-col gap-1.5">
								{["all", "high", "medium", "low"].map((prio) => (
									<button
										key={prio}
										className={`text-left rounded-lg px-3 py-2 flex items-center gap-2 text-sm ${
											selectedPriority === prio
												? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
												: "hover:bg-gray-100 text-[var(--text)]"
										}`}
										onClick={() => {
											setSelectedPriority(prio as any);
											setSidebarOpen(false);
										}}
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										<span
											className={`w-3 h-3 rounded-full ${
												prio === "high"
													? "bg-[var(--error)]"
													: prio === "medium"
													? "bg-[var(--warning)]"
													: prio === "low"
													? "bg-[var(--primary)]"
													: "bg-gray-400"
											}`}
										></span>
										{prio.charAt(0).toUpperCase() + prio.slice(1)}
									</button>
								))}
							</div>
						</div>

						<div className="mt-auto pt-4 border-t border-gray-200">
							<div className="text-xs text-gray-500 text-center">
								<p>Click once to view details</p>
								<p>Double click to add event</p>
							</div>
						</div>
					</aside>

					{}
					<main className="flex-1 p-3 sm:p-4 md:p-6 md:ml-64 flex flex-col h-full">
						{}
						<div className="card rounded-xl shadow-md p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
							{currentView === "calendar" ? (
								<div className="calendar-view flex-1 flex flex-col">
									<div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-5">
										<h2
											className="text-xl sm:text-2xl text-[var(--primary)] font-semibold"
											style={{ fontWeight: theme.fontWeight.semibold }}
										>
											{format(currentDate, "MMMM yyyy")}
										</h2>
										<div className="flex gap-2 mt-2 sm:mt-0">
											<button
												className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-center transition-colors"
												onClick={() => navigateCalendar("prev")}
												aria-label="Previous Month"
											>
												<FaChevronLeft className="text-sm text-gray-700" />
											</button>
											<button
												className="bg-[var(--primary)] text-[var(--secondary)] rounded-lg px-3 py-2 hover:bg-[var(--primary)]/90 text-sm font-medium"
												onClick={() => navigateCalendar("today")}
												style={{ fontWeight: theme.fontWeight.medium }}
											>
												Today
											</button>
											<button
												className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-center transition-colors"
												onClick={() => navigateCalendar("next")}
												aria-label="Next Month"
											>
												<FaChevronRight className="text-sm text-gray-700" />
											</button>
										</div>
									</div>
									{renderCalendar()}
								</div>
							) : (
								<div className="list-view flex-1 overflow-y-auto">
									<div className="flex justify-between items-center mb-4 sm:mb-5">
										<h2
											className="text-xl sm:text-2xl text-[var(--primary)] font-semibold"
											style={{ fontWeight: theme.fontWeight.semibold }}
										>
											Upcoming Events & Feedback
										</h2>
									</div>
									{renderEventList()}
								</div>
							)}
						</div>
					</main>
				</div>

				{}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-gray-900/30 z-40 md:hidden"
						onClick={() => setSidebarOpen(false)}
					></div>
				)}

				{}
				{modalType === "event" && (
					<div
						className="fixed inset-0 bg-gray-900/60 z-[1000] flex items-center justify-center p-4 modal-overlay"
						ref={modalRef}
					>
						<div className="card rounded-xl shadow-2xl w-full max-w-md modal-content flex flex-col">
							<div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
								<h2
									className="text-lg sm:text-xl text-[var(--primary)] font-semibold"
									style={{ fontWeight: theme.fontWeight.semibold }}
								>
									{editingEvent ? "Edit Event" : "Create New Event"}
								</h2>
								<button
									className="text-gray-500 hover:text-[var(--error)] p-1 rounded-full hover:bg-gray-100"
									onClick={closeModalHandler}
								>
									<FaTimes className="text-lg" />
								</button>
							</div>

							<form
								id="eventForm"
								className="p-4 sm:p-6 space-y-4 overflow-y-auto"
								onSubmit={saveEventHandler}
							>
								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-1"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Event Title <span className="text-[var(--error)]">*</span>
									</label>
									<input
										type="text"
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
										placeholder="Add a title for your event"
										required
									/>
								</div>

								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-1"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Description
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
										rows={3}
										placeholder="Add details about your event"
									/>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label
											className="text-sm font-medium text-gray-700 block mb-1"
											style={{ fontWeight: theme.fontWeight.medium }}
										>
											Start Date & Time{" "}
											<span className="text-[var(--error)]">*</span>
										</label>
										<input
											type="datetime-local"
											value={formData.startDate}
											onChange={(e) =>
												setFormData({ ...formData, startDate: e.target.value })
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
											required
										/>
									</div>

									<div>
										<label
											className="text-sm font-medium text-gray-700 block mb-1"
											style={{ fontWeight: theme.fontWeight.medium }}
										>
											End Date & Time{" "}
											<span className="text-[var(--error)]">*</span>
										</label>
										<input
											type="datetime-local"
											value={formData.endDate}
											onChange={(e) =>
												setFormData({ ...formData, endDate: e.target.value })
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
											required
										/>
									</div>
								</div>

								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-1"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Priority Level
									</label>
									<div className="flex gap-2">
										{["low", "medium", "high"].map((prio) => (
											<button
												key={prio}
												type="button"
												className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm ${
													formData.priority === prio
														? prio === "high"
															? "bg-[var(--error)] text-white border-transparent"
															: prio === "medium"
															? "bg-[var(--warning)] text-white border-transparent"
															: "bg-[var(--primary)] text-white border-transparent"
														: "bg-white border-gray-300 hover:bg-gray-50"
												}`}
												onClick={() =>
													setFormData({ ...formData, priority: prio as any })
												}
												style={{ fontWeight: theme.fontWeight.medium }}
											>
												<span
													className={`w-2.5 h-2.5 rounded-full ${
														prio === "high"
															? formData.priority === prio
																? "bg-white"
																: "bg-[var(--error)]"
															: prio === "medium"
															? formData.priority === prio
																? "bg-white"
																: "bg-[var(--warning)]"
															: formData.priority === prio
															? "bg-white"
															: "bg-[var(--primary)]"
													}`}
												></span>
												{prio.charAt(0).toUpperCase() + prio.slice(1)}
											</button>
										))}
									</div>
								</div>

								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-1"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Recurrence
									</label>
									<select
										value={formData.recurrence}
										onChange={(e) =>
											setFormData({
												...formData,
												recurrence: e.target.value as any,
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
									>
										<option value="none">Does not repeat</option>
										<option value="daily">Daily</option>
										<option value="weekly">Weekly</option>
										<option value="monthly">Monthly</option>
									</select>
								</div>
							</form>

							<div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row-reverse gap-2 sm:gap-3">
								<button
									type="submit"
									form="eventForm"
									className="bg-[var(--primary)] text-[var(--secondary)] font-medium rounded-lg py-2 px-4 hover:bg-[var(--primary)]/90"
									style={{ fontWeight: theme.fontWeight.medium }}
								>
									{editingEvent ? "Update Event" : "Create Event"}
								</button>

								<button
									className="bg-gray-100 text-[var(--text)] font-medium rounded-lg py-2 px-4 hover:bg-gray-200"
									onClick={closeModalHandler}
									style={{ fontWeight: theme.fontWeight.medium }}
								>
									Cancel
								</button>

								{editingEvent && (
									<button
										className="bg-[var(--error)]/10 text-[var(--error)] font-medium rounded-lg py-2 px-4 hover:bg-[var(--error)]/20 sm:mr-auto"
										onClick={handleDeleteEvent}
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Delete
									</button>
								)}
							</div>
						</div>
					</div>
				)}

				{}
				{modalType === "feedback" && (
					<div
						className="fixed inset-0 bg-gray-900/60 z-[1000] flex items-center justify-center p-4 modal-overlay"
						ref={modalRef}
					>
						<div className="card rounded-xl shadow-2xl w-full max-w-md modal-content flex flex-col">
							<div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
								<h2
									className="text-lg sm:text-xl text-[var(--accent)] font-semibold"
									style={{ fontWeight: theme.fontWeight.semibold }}
								>
									{editingFeedback ? "Edit Feedback" : "Add Feedback"}
								</h2>
								<button
									className="text-gray-500 hover:text-[var(--error)] p-1 rounded-full hover:bg-gray-100"
									onClick={closeModalHandler}
								>
									<FaTimes className="text-lg" />
								</button>
							</div>

							<form
								id="feedbackForm"
								className="p-4 sm:p-6 space-y-4 overflow-y-auto"
								onSubmit={handleSaveFeedback}
							>
								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-1"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Date
									</label>
									<input
										type="date"
										value={feedbackForm.date}
										onChange={(e) =>
											setFeedbackForm({ ...feedbackForm, date: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
										required
									/>
								</div>

								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-1"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										How was your day?
									</label>
									<div className="flex gap-2">
										{["good", "average", "bad"].map((rating) => (
											<button
												key={rating}
												type="button"
												className={`flex-1 flex items-center justify-center gap-1 px-3 py-3 border rounded-lg text-sm transition-all ${
													feedbackForm.rating === rating
														? rating === "good"
															? "bg-[var(--success)] text-white border-transparent"
															: rating === "average"
															? "bg-[var(--warning)] text-white border-transparent"
															: "bg-[var(--error)] text-white border-transparent"
														: "bg-white border-gray-300 hover:bg-gray-50"
												} ${feedbackForm.rating === rating ? "scale-105" : ""}`}
												onClick={() =>
													setFeedbackForm({
														...feedbackForm,
														rating: rating as any,
													})
												}
												style={{ fontWeight: theme.fontWeight.medium }}
											>
												<span className="text-lg mr-1">
													{rating === "good"
														? "😊"
														: rating === "average"
														? "😐"
														: "😞"}
												</span>
												{rating.charAt(0).toUpperCase() + rating.slice(1)}
											</button>
										))}
									</div>
								</div>

								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-1"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Notes (optional)
									</label>
									<textarea
										value={feedbackForm.note}
										onChange={(e) =>
											setFeedbackForm({ ...feedbackForm, note: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
										rows={4}
										placeholder="What made your day good/bad? Any highlights or challenges?"
									/>
								</div>
							</form>

							<div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row-reverse gap-2 sm:gap-3">
								<button
									type="submit"
									form="feedbackForm"
									className="bg-[var(--accent)] text-[var(--secondary)] font-medium rounded-lg py-2 px-4 hover:bg-[var(--accent)]/90"
									style={{ fontWeight: theme.fontWeight.medium }}
								>
									{editingFeedback ? "Update Feedback" : "Save Feedback"}
								</button>

								<button
									className="bg-gray-100 text-[var(--text)] font-medium rounded-lg py-2 px-4 hover:bg-gray-200"
									onClick={closeModalHandler}
									style={{ fontWeight: theme.fontWeight.medium }}
								>
									Cancel
								</button>

								{editingFeedback && (
									<button
										className="bg-[var(--error)]/10 text-[var(--error)] font-medium rounded-lg py-2 px-4 hover:bg-[var(--error)]/20 sm:mr-auto"
										onClick={handleDeleteFeedback}
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Delete
									</button>
								)}
							</div>
						</div>
					</div>
				)}

				{}
				{viewModalOpen && viewingDate && (
					<div className="fixed inset-0 bg-gray-900/60 z-[1000] flex items-center justify-center p-4 modal-overlay">
						<div className="card rounded-xl shadow-2xl w-full max-w-lg modal-content flex flex-col">
							<div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
								<h2
									className="text-lg sm:text-xl text-[var(--primary)] font-semibold"
									style={{ fontWeight: theme.fontWeight.semibold }}
								>
									{format(viewingDate, "EEEE, MMMM d, yyyy")}
								</h2>
								<button
									className="text-gray-500 hover:text-[var(--error)] p-1 rounded-full hover:bg-gray-100"
									onClick={() => setViewModalOpen(false)}
								>
									<FaTimes className="text-lg" />
								</button>
							</div>

							<div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[60vh]">
								<div>
									<h3
										className="text-base sm:text-lg font-semibold text-[var(--primary)] mb-3 flex items-center"
										style={{ fontWeight: theme.fontWeight.semibold }}
									>
										<FaCalendarAlt className="mr-2" /> Events
									</h3>

									{events
										.flatMap((event) =>
											getOccurrences(event, viewingDate, viewingDate)
										)
										.filter((event) =>
											isSameDay(parseISO(event.startDate), viewingDate)
										)
										.sort(
											(a, b) =>
												parseISO(a.startDate).getTime() -
												parseISO(b.startDate).getTime()
										)
										.map((event) => (
											<div
												key={event.id}
												className={`card p-3 sm:p-4 mb-3 border-l-4 hover:shadow-md transition-all ${
													event.priority === "high"
														? "border-[var(--error)]"
														: event.priority === "medium"
														? "border-[var(--warning)]"
														: "border-[var(--primary)]"
												}`}
											>
												<div className="flex justify-between items-start mb-1.5">
													<h4
														className="text-sm sm:text-base font-semibold text-[var(--text)]"
														style={{ fontWeight: theme.fontWeight.semibold }}
													>
														{event.title}
													</h4>
													<div className="text-xs text-gray-500 flex items-center">
														{event.recurrence || event.isOccurrence ? (
															<FaSyncAlt className="inline mr-1 text-[10px]" />
														) : null}
														{format(parseISO(event.startDate), "h:mm a")} -{" "}
														{format(parseISO(event.endDate), "h:mm a")}
													</div>
												</div>

												<p className="text-xs sm:text-sm text-[var(--text)] mb-2">
													{event.description || "No description"}
												</p>

												<div className="flex gap-2">
													<button
														className="text-[var(--primary)] hover:text-[var(--primary)]/80 p-1 rounded-full hover:bg-gray-100"
														onClick={() => {
															setEditingEvent(
																events.find(
																	(ev) =>
																		ev.id === (event.masterEventId || event.id)
																) || null
															);
															const originalEvent = events.find(
																(ev) =>
																	ev.id === (event.masterEventId || event.id)
															);
															if (originalEvent) {
																setFormData({
																	id: originalEvent.id,
																	title: originalEvent.title,
																	description: originalEvent.description,
																	startDate: originalEvent.startDate,
																	endDate: originalEvent.endDate,
																	priority: originalEvent.priority,
																	recurrence:
																		originalEvent.recurrence?.type || "none",
																});
																setViewModalOpen(false);
																setModalType("event");
															}
														}}
													>
														<FaEdit className="text-sm" />
													</button>
													<button
														className="text-[var(--primary)] hover:text-[var(--primary)]/80 p-1 rounded-full hover:bg-gray-100"
														onClick={() => {
															setViewingEvent(
																events.find(
																	(ev) =>
																		ev.id === (event.masterEventId || event.id)
																) || null
															);
															handleShareEvent(event);
															setViewModalOpen(false);
														}}
													>
														<FaShareAlt className="text-sm" />
													</button>
												</div>
											</div>
										))}

									{events
										.flatMap((event) =>
											getOccurrences(event, viewingDate, viewingDate)
										)
										.filter((event) =>
											isSameDay(parseISO(event.startDate), viewingDate)
										).length === 0 && (
										<p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
											No events for this day.
										</p>
									)}
								</div>

								<div>
									<h3
										className="text-base sm:text-lg font-semibold text-[var(--accent)] mb-3 flex items-center"
										style={{ fontWeight: theme.fontWeight.semibold }}
									>
										<FaCalendarCheck className="mr-2" /> Feedback
									</h3>

									{feedbacks
										.filter((fb) => isSameDay(parseISO(fb.date), viewingDate))
										.map((fb) => (
											<div
												key={fb.id}
												className="card p-3 sm:p-4 mb-3 border-l-4 border-[var(--accent)] hover:shadow-md transition-all"
											>
												<div className="flex justify-between items-start mb-1.5">
													<h4
														className="text-sm sm:text-base font-semibold text-[var(--accent)] flex items-center"
														style={{ fontWeight: theme.fontWeight.semibold }}
													>
														{fb.rating === "good" ? (
															<>😊 Good Day</>
														) : fb.rating === "average" ? (
															<>😐 Average Day</>
														) : (
															<>😞 Bad Day</>
														)}
													</h4>
													<div className="text-xs text-gray-500">
														{format(parseISO(fb.createdAt), "h:mm a")}
													</div>
												</div>

												<p className="text-xs sm:text-sm text-[var(--text)] mb-2">
													{fb.note || "No notes added"}
												</p>

												<div className="flex gap-2">
													<button
														className="text-[var(--accent)] hover:text-[var(--accent)]/80 p-1 rounded-full hover:bg-gray-100"
														onClick={() => {
															setEditingFeedback(fb);
															setFeedbackForm({
																id: fb.id,
																date: fb.date,
																rating: fb.rating,
																note: fb.note,
															});
															setViewModalOpen(false);
															setModalType("feedback");
														}}
													>
														<FaEdit className="text-sm" />
													</button>
												</div>
											</div>
										))}

									{feedbacks.filter((fb) =>
										isSameDay(parseISO(fb.date), viewingDate)
									).length === 0 && (
										<p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
											No feedback for this day.
										</p>
									)}
								</div>
							</div>

							<div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
								<button
									className="bg-[var(--primary)] text-[var(--secondary)] font-medium rounded-lg py-2 px-4 hover:bg-[var(--primary)]/90 order-2 sm:order-1"
									onClick={() => {
										setFormData({
											...formData,
											startDate: formatDateForInput(viewingDate),
											endDate: formatDateForInput(addHours(viewingDate, 1)),
										});
										setViewModalOpen(false);
										setModalType("event");
									}}
									style={{ fontWeight: theme.fontWeight.medium }}
								>
									<FaPlus className="inline mr-1" /> Add Event
								</button>

								<button
									className="bg-[var(--accent)] text-[var(--secondary)] font-medium rounded-lg py-2 px-4 hover:bg-[var(--accent)]/90 order-1 sm:order-2"
									onClick={() => {
										setFeedbackForm({
											...feedbackForm,
											date: format(viewingDate, "yyyy-MM-dd"),
										});
										setViewModalOpen(false);
										setModalType("feedback");
									}}
									style={{ fontWeight: theme.fontWeight.medium }}
								>
									<FaPlus className="inline mr-1" /> Add Feedback
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				{shareModalOpen && viewingEvent && (
					<div className="fixed inset-0 bg-gray-900/60 z-[1000] flex items-center justify-center p-4 modal-overlay">
						<div className="card rounded-xl shadow-2xl w-full max-w-md modal-content">
							<div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
								<h2
									className="text-lg sm:text-xl text-[var(--primary)] font-semibold"
									style={{ fontWeight: theme.fontWeight.semibold }}
								>
									Share Event
								</h2>
								<button
									className="text-gray-500 hover:text-[var(--error)] p-1 rounded-full hover:bg-gray-100"
									onClick={() => setShareModalOpen(false)}
								>
									<FaTimes className="text-lg" />
								</button>
							</div>

							<div className="p-4 sm:p-6 space-y-4">
								<div className="mb-3">
									<h3 className="text-sm font-medium text-gray-700 mb-2">
										Event Details
									</h3>
									<div className="bg-gray-50 rounded-lg p-3 text-sm">
										<p className="font-medium text-[var(--primary)]">
											{viewingEvent.title}
										</p>
										<p>{format(parseISO(viewingEvent.startDate), "PPpp")}</p>
										<p className="text-gray-600 mt-1">
											{viewingEvent.description || "No description"}
										</p>
									</div>
								</div>

								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-2"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Copy Link
									</label>
									<div className="flex items-center gap-2">
										<input
											type="text"
											value={`${viewingEvent.title} on ${format(
												parseISO(viewingEvent.startDate),
												"PPp"
											)} - ${viewingEvent.description || "No description"} ${
												typeof window !== "undefined"
													? window.location.href
													: ""
											}`}
											readOnly
											className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none text-xs sm:text-sm"
										/>
										<button
											className="bg-[var(--primary)] text-[var(--secondary)] p-2 rounded-lg hover:bg-[var(--primary)]/90"
											onClick={() => handleCopyLink(viewingEvent)}
										>
											<FaLink className="text-sm" />
										</button>
									</div>
								</div>

								<div>
									<label
										className="text-sm font-medium text-gray-700 block mb-2"
										style={{ fontWeight: theme.fontWeight.medium }}
									>
										Share on Social Media
									</label>
									<div className="flex flex-wrap gap-3 justify-center">
										<button
											className="p-3 rounded-lg bg-[#1877F2] text-white hover:bg-[#1877F2]/90 flex flex-col items-center gap-1"
											onClick={() =>
												handleShareToSocial("facebook", viewingEvent)
											}
											aria-label="Share on Facebook"
										>
											<FaFacebook size={20} />
											<span className="text-xs">Facebook</span>
										</button>
										<button
											className="p-3 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 flex flex-col items-center gap-1"
											onClick={() =>
												handleShareToSocial("twitter", viewingEvent)
											}
											aria-label="Share on Twitter"
										>
											<FaTwitter size={20} />
											<span className="text-xs">Twitter</span>
										</button>
										<button
											className="p-3 rounded-lg bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 flex flex-col items-center gap-1"
											onClick={() =>
												handleShareToSocial("linkedin", viewingEvent)
											}
											aria-label="Share on LinkedIn"
										>
											<FaLinkedin size={20} />
											<span className="text-xs">LinkedIn</span>
										</button>
										<button
											className="p-3 rounded-lg bg-[#25D366] text-white hover:bg-[#25D366]/90 flex flex-col items-center gap-1"
											onClick={() =>
												handleShareToSocial("whatsapp", viewingEvent)
											}
											aria-label="Share on WhatsApp"
										>
											<FaWhatsapp size={20} />
											<span className="text-xs">WhatsApp</span>
										</button>
									</div>
								</div>
							</div>

							<div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end">
								<button
									className="bg-gray-100 text-[var(--text)] font-medium rounded-lg py-2 px-4 hover:bg-gray-200"
									onClick={() => setShareModalOpen(false)}
									style={{ fontWeight: theme.fontWeight.medium }}
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				<div className="fixed bottom-4 right-4 z-[1100] flex flex-col gap-2 w-full max-w-xs">
					{notifications
						.filter((notification) => {
							if (!notification.displayUntil) return false;
							try {
								return parseISO(notification.displayUntil) > new Date();
							} catch {
								return false;
							}
						})
						.slice(0, 3)
						.map((notification) => (
							<div
								key={notification.id}
								className={`card glass-effect rounded-lg shadow-lg p-3 flex items-start gap-2 border-l-4 animate-[slideIn_0.3s_ease-out] ${
									notification.type === "success"
										? "bg-[var(--success)]/10 border-[var(--success)] text-[var(--success)]"
										: notification.type === "error"
										? "bg-[var(--error)]/10 border-[var(--error)] text-[var(--error)]"
										: notification.type === "warning"
										? "bg-[var(--warning)]/10 border-[var(--warning)] text-[var(--warning)]"
										: "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]"
								}`}
								style={{
									animation:
										"slideIn 0.3s ease-out, fadeOut 0.3s ease-in forwards",
									animationDelay: "0s, 4.7s",
								}}
							>
								<div className="flex-shrink-0">
									{notification.type === "success" && (
										<FaCheckCircle className="text-base" />
									)}
									{notification.type === "error" && (
										<FaExclamationCircle className="text-base" />
									)}
									{notification.type === "warning" && (
										<FaExclamationTriangle className="text-base" />
									)}
									{notification.type === "info" && (
										<FaInfoCircle className="text-base" />
									)}
								</div>
								<div className="flex-1">
									<div
										className="font-semibold text-sm"
										style={{ fontWeight: theme.fontWeight.semibold }}
									>
										{notification.title}
									</div>
									<div className="text-xs">{notification.message}</div>
								</div>
								<button
									className="text-current opacity-70 hover:opacity-100"
									onClick={() =>
										setNotifications((prev) =>
											prev.map((n) =>
												n.id === notification.id
													? { ...n, displayUntil: undefined }
													: n
											)
										)
									}
								>
									<FaTimes className="text-sm" />
								</button>
							</div>
						))}
				</div>

				{}
				<style jsx>{`
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

					@keyframes fadeOut {
						from {
							opacity: 1;
						}
						to {
							opacity: 0;
						}
					}
				`}</style>
			</div>
		</>
	);
};

export default TaskFeedbackScheduler;
