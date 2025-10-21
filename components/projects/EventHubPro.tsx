"use client";
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
	FormEvent,
	Fragment,
} from "react";
import {
	FaCalendarAlt,
	FaMapMarkerAlt,
	FaUsers,
	FaComments,
	FaStar,
	FaVideo,
	FaWifi,
	FaClock,
	FaChevronDown,
	FaChevronRight,
	FaCompass,
	FaMobileAlt,
	FaDesktop,
	FaPaperPlane,
	FaThumbsUp,
	FaEye,
	FaCog,
	FaBars,
	FaTimes,
	FaHome,
	FaGlobe,
	FaRegStar,
	FaBuilding,
	FaInfoCircle,
	FaLink,
	FaDoorOpen,
	FaCheckCircle,
	FaBell,
	FaExclamationCircle,
	FaExclamationTriangle,
	FaEnvelope,
	FaQuestion,
	FaArrowLeft,
	FaTwitter,
	FaLinkedin,
	FaInstagram,
	FaYoutube,
	FaFacebook,
} from "react-icons/fa";
import {
	MdOutlineRateReview,
	MdMeetingRoom,
	MdAccessTime,
	MdPerson,
	MdNotifications,
	MdNotificationsActive,
	MdClose,
	MdWarning,
	MdInfo,
	MdDownload,
	MdCheck,
	MdSettings,
	MdLogout,
} from "react-icons/md";
import {
	BsChat,
	BsChatFill,
	BsPersonCircle,
	BsStarFill,
	BsStarHalf,
	BsThreeDotsVertical,
	BsBellFill,
	BsXCircleFill,
	BsCheckCircleFill,
	BsCalendarCheck,
	BsCalendarEvent,
} from "react-icons/bs";
import { IoIosNotifications, IoMdSend, IoIosCloseCircle } from "react-icons/io";
import { Transition } from "@headlessui/react";

interface Session {
	id: string;
	title: string;
	speaker: string;
	time: string;
	duration: string;
	room: string;
	type: "keynote" | "workshop" | "panel" | "networking";
	isVirtual: boolean;
	attendees: number;
	rating: number;
	description: string;
	speakerImage?: string;
	speakerBio?: string;
	materials?: { name: string; url: string }[];
	startTime?: string;
	endTime?: string;
	date?: string;
	tags?: string[];
}

interface Message {
	id: string;
	user: string;
	content: string;
	timestamp: string;
	channel: string;
	userAvatar?: string;
	isCurrentUser?: boolean;
}

interface Room {
	id: string;
	name: string;
	capacity: number;
	currentSession?: string;
	amenities: string[];
	floor: number;
	image?: string;
	description?: string;
	location?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

interface Notification {
	id: string;
	title: string;
	message: string;
	time: string;
	type: "info" | "alert" | "reminder" | "update";
	read: boolean;
	link?: string;
}

interface FeedbackFormData {
	rating: number;
	comment: string;
	improvement?: string;
	wouldRecommend?: boolean;
}

const SESSIONS: Session[] = [
	{
		id: "1",
		title: "Opening Keynote: Future of Hybrid Events",
		speaker: "Dr. Sarah Chen",
		time: "09:00",
		duration: "60 min",
		room: "Main Auditorium",
		type: "keynote",
		isVirtual: false,
		attendees: 324,
		rating: 4.8,
		description:
			"Exploring the evolution of event technology and attendee engagement strategies for the post-pandemic era. Dr. Chen will share insights on combining physical and digital experiences.",
		speakerImage: "https://randomuser.me/api/portraits/women/44.jpg",
		speakerBio:
			"Dr. Sarah Chen is the Director of Digital Innovation at EventTech Global and has over 15 years of experience in designing engaging experiences across physical and digital spaces. Her research focuses on human-centered design for collaborative environments.",
		materials: [
			{ name: "Presentation Slides", url: "#slides" },
			{ name: "Research Paper", url: "#paper" },
		],
		startTime: "09:00",
		endTime: "10:00",
		date: "June 08, 2025",
		tags: ["innovation", "digital", "engagement"],
	},
	{
		id: "2",
		title: "Interactive Workshop: Digital Transformation",
		speaker: "Mark Rodriguez",
		time: "10:30",
		duration: "90 min",
		room: "Workshop Room A",
		type: "workshop",
		isVirtual: true,
		attendees: 45,
		rating: 4.6,
		description:
			"Hands-on session covering modern digital transformation methodologies. Bring your laptop and be ready to participate in real-time collaboration exercises.",
		speakerImage: "https://randomuser.me/api/portraits/men/32.jpg",
		speakerBio:
			"Mark Rodriguez leads digital transformation initiatives at TechForward Consulting. He specializes in helping organizations navigate complex technological transitions while maintaining team cohesion and productivity.",
		materials: [
			{ name: "Workshop Materials", url: "#materials" },
			{ name: "Case Studies", url: "#cases" },
		],
		startTime: "10:30",
		endTime: "12:00",
		date: "June 08, 2025",
		tags: ["workshop", "interactive", "digital transformation"],
	},
	{
		id: "3",
		title: "Panel: Innovation in Remote Collaboration",
		speaker: "Multiple Speakers",
		time: "13:00",
		duration: "45 min",
		room: "Conference Room B",
		type: "panel",
		isVirtual: false,
		attendees: 78,
		rating: 4.5,
		description:
			"Industry experts discuss the latest trends in remote work technologies and strategies for maintaining team cohesion in distributed environments.",
		speakerImage: "https://randomuser.me/api/portraits/women/68.jpg",
		speakerBio:
			"This panel features leaders from top collaboration software companies and remote-first organizations, including CTO of WorkTogether, Head of Product at RemoteTeams, and Director of People Operations at DistributedInc.",
		materials: [
			{ name: "Panel Recording", url: "#recording" },
			{ name: "Discussion Points", url: "#points" },
		],
		startTime: "13:00",
		endTime: "13:45",
		date: "June 08, 2025",
		tags: ["panel", "remote work", "collaboration"],
	},
	{
		id: "4",
		title: "Networking Break",
		speaker: "All Attendees",
		time: "14:30",
		duration: "30 min",
		room: "Lobby",
		type: "networking",
		isVirtual: false,
		attendees: 156,
		rating: 4.2,
		description:
			"Connect with fellow attendees and speakers in our interactive networking space. Refreshments will be provided for in-person attendees.",
		speakerImage: "https://randomuser.me/api/portraits/lego/5.jpg",
		startTime: "14:30",
		endTime: "15:00",
		date: "June 08, 2025",
		tags: ["networking", "refreshments", "connecting"],
	},
];

const ROOMS: Room[] = [
	{
		id: "1",
		name: "Main Auditorium",
		capacity: 500,
		currentSession: "1",
		amenities: [
			"AV Equipment",
			"Live Streaming",
			"Wheelchair Access",
			"Stage Lighting",
		],
		floor: 1,
		image:
			"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		description:
			"Our largest venue space featuring stadium seating, professional audio/video equipment, and a spacious stage for keynote presentations and large sessions.",
		location: {
			x: 100,
			y: 100,
			width: 250,
			height: 150,
		},
	},
	{
		id: "2",
		name: "Workshop Room A",
		capacity: 50,
		currentSession: "2",
		amenities: [
			"Whiteboards",
			"Breakout Tables",
			"Video Conferencing",
			"Power Outlets",
		],
		floor: 2,
		image:
			"https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		description:
			"A flexible workshop space with movable tables and chairs, perfect for interactive sessions and group activities. Features multiple displays and collaborative tools.",
		location: {
			x: 450,
			y: 100,
			width: 250,
			height: 150,
		},
	},
	{
		id: "3",
		name: "Conference Room B",
		capacity: 100,
		currentSession: "3",
		amenities: [
			"Panel Setup",
			"Recording Equipment",
			"Q&A System",
			"Surround Sound",
		],
		floor: 2,
		image:
			"https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		description:
			"A mid-sized conference room optimized for panel discussions with excellent acoustics and audience participation systems. Features a moderated Q&A system.",
		location: {
			x: 450,
			y: 300,
			width: 250,
			height: 150,
		},
	},
	{
		id: "4",
		name: "Lobby",
		capacity: 200,
		currentSession: "4",
		amenities: [
			"Refreshments",
			"Seating Areas",
			"Charging Stations",
			"Information Desk",
		],
		floor: 1,
		image:
			"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		description:
			"The central gathering space connecting all venue areas. Features comfortable seating, refreshment stations, and dedicated areas for casual networking.",
		location: {
			x: 100,
			y: 300,
			width: 250,
			height: 150,
		},
	},
];

const INITIAL_MESSAGES: Message[] = [
	{
		id: "1",
		user: "Alex Johnson",
		content: "Great opening keynote! Looking forward to the workshop.",
		timestamp: "09:45",
		channel: "Main Auditorium",
		userAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
	},
	{
		id: "2",
		user: "Maria Santos",
		content: "Can someone share the link to the presentation slides?",
		timestamp: "10:15",
		channel: "Virtual Track 2",
		userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
	},
	{
		id: "3",
		user: "David Kim",
		content: "The workshop is starting in 15 minutes. Join us in Room A!",
		timestamp: "10:15",
		channel: "Workshop Room A",
		userAvatar: "https://randomuser.me/api/portraits/men/74.jpg",
	},
	{
		id: "4",
		user: "Elena Torres",
		content: "Is anyone else having trouble connecting to the virtual session?",
		timestamp: "10:22",
		channel: "Virtual Track 1",
		userAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
	},
	{
		id: "5",
		user: "James Wilson",
		content: "Just arrived at the venue. Where can I pick up my badge?",
		timestamp: "10:30",
		channel: "Lobby",
		userAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
	},
];

const INITIAL_NOTIFICATIONS: Notification[] = [
	{
		id: "1",
		title: "Session Starting Soon",
		message:
			"Digital Transformation Workshop begins in 15 minutes in Workshop Room A.",
		time: "10:15",
		type: "reminder",
		read: false,
		link: "#session2",
	},
	{
		id: "2",
		title: "Schedule Update",
		message:
			"The panel discussion has been moved to Conference Room B at 13:00.",
		time: "09:30",
		type: "update",
		read: false,
		link: "#session3",
	},
	{
		id: "3",
		title: "New Messages",
		message: "You have 3 unread messages in the Main Auditorium chat.",
		time: "09:55",
		type: "info",
		read: true,
		link: "#chat",
	},
	{
		id: "4",
		title: "WiFi Information",
		message: "Connect to 'EventHub-Guest' with password 'event2025'",
		time: "08:45",
		type: "info",
		read: true,
	},
	{
		id: "5",
		title: "Lunch Available",
		message: "Lunch is now being served in the Dining Area on Floor 1.",
		time: "12:00",
		type: "alert",
		read: false,
	},
];

function EventHubPro() {
	const [mode, setMode] = useState<"physical" | "virtual">("physical");
	const [selectedSession, setSelectedSession] = useState<string | null>(null);
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<
		"schedule" | "venue" | "chat" | "feedback"
	>("schedule");
	const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
	const [newMessage, setNewMessage] = useState("");
	const [canSend, setCanSend] = useState(true);
	const [selectedChannel, setSelectedChannel] = useState("Main Auditorium");
	const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
		new Set()
	);
	const [ratings, setRatings] = useState<{ [key: string]: number }>({});
	const [isMobile, setIsMobile] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isJoining, setIsJoining] = useState(false);
	const [detailedFeedback, setDetailedFeedback] = useState<{
		[key: string]: string;
	}>({});
	const [improvementFeedback, setImprovementFeedback] = useState<{
		[key: string]: string;
	}>({});
	const [wouldRecommend, setWouldRecommend] = useState<{
		[key: string]: boolean;
	}>({});
	const [notificationCount, setNotificationCount] = useState(3);
	const [chatHeight, setChatHeight] = useState(300);
	const [activePopout, setActivePopout] = useState<string | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [detailSession, setDetailSession] = useState<Session | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>(
		INITIAL_NOTIFICATIONS
	);
	const [showNotificationPanel, setShowNotificationPanel] = useState(false);
	const [submittedFeedback, setSubmittedFeedback] = useState<Set<string>>(
		new Set()
	);
	const [feedbackErrors, setFeedbackErrors] = useState<{
		[key: string]: string;
	}>({});
	const [showRoomDetailPopup, setShowRoomDetailPopup] = useState(false);
	const [roomDetailId, setRoomDetailId] = useState<string | null>(null);
	const [chatInputFocused, setChatInputFocused] = useState(false);
	const [windowPositions, setWindowPositions] = useState<{
		[key: string]: { x: number; y: number };
	}>({});
	const [isDragging, setIsDragging] = useState(false);
	const [popoutMinimized, setPopoutMinimized] = useState<{
		[key: string]: boolean;
	}>({});

	const chatContainerRef = useRef<HTMLDivElement>(null);
	const messageEndRef = useRef<HTMLDivElement>(null);
	const chatInputRef = useRef<HTMLInputElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	const notificationRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{
		key: string;
		startX: number;
		startY: number;
	} | null>(null);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, selectedChannel]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				setShowDetailModal(false);
			}

			if (
				notificationRef.current &&
				!notificationRef.current.contains(event.target as Node) &&
				!(event.target as Element).closest("[data-notification-toggle]")
			) {
				setShowNotificationPanel(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				if (showDetailModal) {
					setShowDetailModal(false);
				} else if (showNotificationPanel) {
					setShowNotificationPanel(false);
				} else if (activePopout) {
					setActivePopout(null);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [showDetailModal, showNotificationPanel, activePopout]);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (dragRef.current && isDragging) {
				const { key, startX, startY } = dragRef.current;
				const deltaX = e.clientX - startX;
				const deltaY = e.clientY - startY;

				setWindowPositions((prev) => {
					const position = prev[key] || { x: 0, y: 0 };
					return {
						...prev,
						[key]: {
							x: position.x + deltaX,
							y: position.y + deltaY,
						},
					};
				});

				dragRef.current = {
					key,
					startX: e.clientX,
					startY: e.clientY,
				};
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			dragRef.current = null;
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	const channels = useMemo(
		() => [
			...new Set([
				...ROOMS.map((r) => r.name),
				"Virtual Track 1",
				"Virtual Track 2",
				"General",
			]),
		],
		[]
	);
	const handleInputChange = useCallback(
		(
			setter: React.Dispatch<React.SetStateAction<any>>,
			field: string,
			value: any
		) => {
			setter((prev: any) => ({
				...prev,
				[field]: value,
			}));
		},
		[]
	);

	const toggleSessionExpansion = (sessionId: string) => {
		const newExpanded = new Set(expandedSessions);
		if (newExpanded.has(sessionId)) {
			newExpanded.delete(sessionId);
		} else {
			newExpanded.add(sessionId);
		}
		setExpandedSessions(newExpanded);
	};

	const sendMessage = () => {
		if (!newMessage.trim()) return;

		const message: Message = {
			id: Date.now().toString(),
			user: "You",
			content: newMessage,
			timestamp: new Date().toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
			channel: selectedChannel,
			userAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
			isCurrentUser: true,
		};

		setMessages((prevMessages) => [...prevMessages, message]);
		setNewMessage("");
		setCanSend(false);

		if (chatInputRef.current) {
			chatInputRef.current.focus();
		}

		if (Math.random() > 0.6) {
			setTimeout(() => {
				const responses = [
					"Thanks for sharing! That's really helpful.",
					"I completely agree with your point.",
					"Could you elaborate more on that?",
					"That's an interesting perspective!",
					"Thanks for the update!",
				];

				const responseMessage: Message = {
					id: Date.now().toString(),
					user: ["Alex Johnson", "Maria Santos", "David Kim", "Elena Torres"][
						Math.floor(Math.random() * 4)
					],
					content: responses[Math.floor(Math.random() * responses.length)],
					timestamp: new Date().toLocaleTimeString("en-US", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					}),
					channel: selectedChannel,
					userAvatar: `https://randomuser.me/api/portraits/${
						Math.random() > 0.5 ? "women" : "men"
					}/${Math.floor(Math.random() * 99)}.jpg`,
					isCurrentUser: false,
				};

				setMessages((prev) => [...prev, responseMessage]);
			}, 2000 + Math.random() * 3000);
		}
	};

	const rateSession = (sessionId: string, rating: number) => {
		setRatings((prev) => ({ ...prev, [sessionId]: rating }));

		setFeedbackErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[sessionId];
			return newErrors;
		});

		const element = document.getElementById(`session-${sessionId}`);
		if (element) {
			element.classList.add("rating-pulse");
			setTimeout(() => {
				element?.classList.remove("rating-pulse");
			}, 300);
		}
	};

	const joinVirtualSession = async (sessionId: string) => {
		setIsJoining(true);

		const zoomLinks: Record<string, string> = {
			"1": "https://zoom.us/j/1234567890",
			"2": "https://zoom.us/j/2345678901",
			"3": "https://zoom.us/j/3456789012",
			"4": "https://zoom.us/j/4567890123",
		};

		const zoomLink = zoomLinks[sessionId] || "https://zoom.us/test";

		await new Promise((resolve) => setTimeout(resolve, 800));

		const width = Math.min(1200, window.innerWidth * 0.7);
		const height = Math.min(800, window.innerHeight * 0.7);
		const left = (window.innerWidth - width) / 2;
		const top = (window.innerHeight - height) / 2;

		window.open(
			zoomLink,
			`virtual_session_${sessionId}`,
			`width=${width},height=${height},left=${left},top=${top},location=yes,menubar=no,toolbar=no`
		);

		setIsJoining(false);

		if (!isMobile) {
			setActivePopout(sessionId);

			if (!windowPositions[sessionId]) {
				setWindowPositions((prev) => ({
					...prev,
					[sessionId]: { x: 20, y: 20 },
				}));
			}
		}
	};

	const handleRoomHover = (roomId: string | null) => {
		if (roomId) {
			setRoomDetailId(roomId);
			setShowRoomDetailPopup(true);
		} else {
			setTimeout(() => {
				if (!roomDetailId) {
					setShowRoomDetailPopup(false);
				}
			}, 100);
		}
	};

	const closeRoomDetail = () => {
		setShowRoomDetailPopup(false);
		setRoomDetailId(null);
	};

	const handleFeedbackSubmit = (sessionId: string) => {
		const rating = ratings[sessionId] || 0;
		const comment = detailedFeedback[sessionId] || "";

		let hasError = false;
		const errors: { [key: string]: string } = {};

		if (rating === 0) {
			errors[sessionId] = "Please provide a rating";
			hasError = true;
		}

		if (hasError) {
			setFeedbackErrors(errors);
			return;
		}

		setSubmittedFeedback((prev) => new Set(prev).add(sessionId));

		setTimeout(() => {}, 2000);
	};

	const openSessionDetail = (session: Session) => {
		setDetailSession(session);
		setShowDetailModal(true);
	};

	const toggleNotificationPanel = () => {
		setShowNotificationPanel((prev) => !prev);

		if (!showNotificationPanel) {
			setNotifications((prev) =>
				prev.map((notif) => ({ ...notif, read: true }))
			);
			setNotificationCount(0);
		}
	};

	const startDrag = (e: React.MouseEvent, key: string) => {
		e.preventDefault();
		setIsDragging(true);
		dragRef.current = {
			key,
			startX: e.clientX,
			startY: e.clientY,
		};
	};

	const toggleMinimize = (sessionId: string) => {
		setPopoutMinimized((prev) => ({
			...prev,
			[sessionId]: !prev[sessionId],
		}));
	};

	const SessionCard = ({
		session,
		isExpanded,
	}: {
		session: Session;
		isExpanded: boolean;
	}) => (
		<div
			id={`session-${session.id}`}
			className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
		>
			<div
				className={`p-5 cursor-pointer transition-all ${
					isExpanded ? "pb-2" : ""
				}`}
				onClick={() => isMobile && toggleSessionExpansion(session.id)}
			>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<span
								className={`px-3 py-1 rounded-full text-xs font-semibold ${
									session.type === "keynote"
										? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
										: session.type === "workshop"
										? "bg-gradient-to-r from-green-500 to-green-600 text-white"
										: session.type === "panel"
										? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
										: "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
								}`}
							>
								{session.type.charAt(0).toUpperCase() + session.type.slice(1)}
							</span>
							{session.isVirtual && (
								<div className="flex items-center gap-1 text-blue-600">
									<FaGlobe className="w-3 h-3" />
									<span className="text-xs font-medium">Virtual</span>
								</div>
							)}

							{}
							{session.tags && session.tags.length > 0 && (
								<div className="hidden md:flex items-center gap-1 flex-wrap">
									{session.tags.slice(0, 2).map((tag) => (
										<span
											key={tag}
											className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>

						<h3 className="text-lg font-bold text-gray-900 mb-2">
							{session.title}
						</h3>

						<div className="flex items-center gap-2 mb-3">
							{session.speakerImage && (
								<img
									src={session.speakerImage}
									alt={session.speaker}
									className="w-6 h-6 rounded-full object-cover border border-gray-200"
								/>
							)}
							<p className="text-gray-600">{session.speaker}</p>
						</div>

						<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
							<div className="flex items-center gap-1">
								<FaClock className="w-3 h-3" />
								<span>
									{session.time} ({session.duration})
								</span>
							</div>
							<div className="flex items-center gap-1">
								<FaMapMarkerAlt className="w-3 h-3" />
								<span>{session.room}</span>
							</div>
							<div className="flex items-center gap-1">
								<FaUsers className="w-3 h-3" />
								<span>{session.attendees}</span>
							</div>
						</div>
					</div>

					{isMobile && (
						<FaChevronDown
							className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
								isExpanded ? "rotate-180" : ""
							}`}
						/>
					)}
				</div>

				{(isExpanded || !isMobile) && (
					<div className="mt-4 pt-4 border-t border-gray-100">
						<p className="text-gray-700 mb-4">{session.description}</p>

						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-gray-700">Rate:</span>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											onClick={(e) => {
												e.stopPropagation();
												rateSession(session.id, star);
											}}
											className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1"
											aria-label={`Rate ${star} stars`}
										>
											{(ratings[session.id] || 0) >= star ? (
												<BsStarFill className="w-5 h-5 text-yellow-400" />
											) : (
												<FaRegStar className="w-5 h-5 text-gray-300" />
											)}
										</button>
									))}
								</div>
								<span className="text-sm text-blue-600 font-semibold">
									{session.rating.toFixed(1)}
								</span>
							</div>

							<div className="flex gap-2">
								<button
									className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200 shadow-sm"
									onClick={(e) => {
										e.stopPropagation();
										openSessionDetail(session);
									}}
								>
									<FaInfoCircle className="w-4 h-4" />
									<span>Details</span>
								</button>

								{mode === "virtual" && session.isVirtual && (
									<button
										className={`flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg ${
											isJoining ? "opacity-75 cursor-not-allowed" : ""
										}`}
										onClick={(e) => {
											e.stopPropagation();
											joinVirtualSession(session.id);
										}}
										disabled={isJoining}
									>
										<FaVideo className="w-4 h-4" />
										<span>{isJoining ? "Joining..." : "Join Now"}</span>
									</button>
								)}

								{mode === "physical" && !session.isVirtual && (
									<button
										className={`flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg`}
										onClick={(e) => {
											e.stopPropagation();
											setSelectedRoom(
												ROOMS.find((r) => r.name === session.room)?.id || null
											);
											setActiveTab("venue");
										}}
									>
										<FaMapMarkerAlt className="w-4 h-4" />
										<span>Find Room</span>
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);

	const SessionDetailModal = () => {
		if (!detailSession) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300">
				<div
					ref={modalRef}
					className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn"
				>
					<div className="sticky top-0 z-10 bg-white border-b border-gray-100 rounded-t-xl">
						<div className="flex justify-between items-center p-6 pb-4">
							<div className="flex gap-3 items-center">
								<span
									className={`px-3 py-1 rounded-full text-xs font-semibold ${
										detailSession.type === "keynote"
											? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
											: detailSession.type === "workshop"
											? "bg-gradient-to-r from-green-500 to-green-600 text-white"
											: detailSession.type === "panel"
											? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
											: "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
									}`}
								>
									{detailSession.type.charAt(0).toUpperCase() +
										detailSession.type.slice(1)}
								</span>
								{detailSession.isVirtual && (
									<div className="flex items-center gap-1 text-blue-600">
										<FaGlobe className="w-3 h-3" />
										<span className="text-xs font-medium">Virtual</span>
									</div>
								)}
							</div>
							<button
								onClick={() => setShowDetailModal(false)}
								className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
								aria-label="Close modal"
							>
								<MdClose className="w-5 h-5" />
							</button>
						</div>
						<h2 className="text-2xl font-bold text-gray-900 px-6 pb-4">
							{detailSession.title}
						</h2>
					</div>

					<div className="p-6 pt-4">
						<div className="flex flex-col md:flex-row gap-6 mb-6">
							<div className="md:w-2/3">
								<p className="text-gray-700 mb-6 leading-relaxed">
									{detailSession.description}
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									<div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
										<h4 className="font-medium text-gray-900 flex items-center gap-2">
											<FaClock className="text-blue-500" />
											Time & Location
										</h4>
										<div className="flex flex-col gap-1 text-sm">
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Date:</span>
												<span className="font-medium">
													{detailSession.date || "June 08, 2025"}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Start Time:</span>
												<span className="font-medium">
													{detailSession.startTime || detailSession.time}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">End Time:</span>
												<span className="font-medium">
													{detailSession.endTime || "-"}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Duration:</span>
												<span className="font-medium">
													{detailSession.duration}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Location:</span>
												<span className="font-medium">
													{detailSession.room}
												</span>
											</div>
										</div>
									</div>

									<div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
										<h4 className="font-medium text-gray-900 flex items-center gap-2">
											<FaUsers className="text-blue-500" />
											Attendance
										</h4>
										<div className="flex flex-col gap-1 text-sm">
											<div className="flex items-center justify-between">
												<span className="text-gray-600">
													Current Attendees:
												</span>
												<span className="font-medium">
													{detailSession.attendees}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Session Rating:</span>
												<span className="flex items-center gap-1">
													<BsStarFill className="text-yellow-400 w-4 h-4" />
													<span className="font-medium">
														{detailSession.rating.toFixed(1)}
													</span>
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Session Type:</span>
												<span className="font-medium capitalize">
													{detailSession.type}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Format:</span>
												<span className="font-medium">
													{detailSession.isVirtual
														? "Virtual & In-Person"
														: "In-Person Only"}
												</span>
											</div>
										</div>
									</div>
								</div>

								{detailSession.materials &&
									detailSession.materials.length > 0 && (
										<div className="mb-6">
											<h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
												<MdDownload className="text-blue-500" />
												Session Materials
											</h4>
											<div className="flex flex-wrap gap-2">
												{detailSession.materials.map((material, index) => (
													<a
														key={index}
														href={material.url}
														className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
														target="_blank"
														rel="noopener noreferrer"
													>
														<FaLink className="w-3 h-3" />
														<span className="text-sm">{material.name}</span>
													</a>
												))}
											</div>
										</div>
									)}

								{detailSession.tags && detailSession.tags.length > 0 && (
									<div className="mb-6">
										<h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
											<FaTag className="text-blue-500" />
											Topics
										</h4>
										<div className="flex flex-wrap gap-2">
											{detailSession.tags.map((tag) => (
												<span
													key={tag}
													className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								)}
							</div>

							<div className="md:w-1/3">
								<div className="sticky top-24">
									<div className="bg-gray-50 rounded-xl p-5 mb-4">
										<h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
											<MdPerson className="text-blue-500" />
											Speaker
										</h4>
										<div className="flex flex-col items-center text-center mb-4">
											{detailSession.speakerImage && (
												<img
													src={detailSession.speakerImage}
													alt={detailSession.speaker}
													className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md mb-3"
												/>
											)}
											<h5 className="font-bold text-gray-900">
												{detailSession.speaker}
											</h5>
										</div>

										{detailSession.speakerBio && (
											<p className="text-sm text-gray-600 mb-4">
												{detailSession.speakerBio}
											</p>
										)}
									</div>

									<div className="flex flex-col gap-3">
										{detailSession.isVirtual && (
											<button
												className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
												onClick={() => {
													setShowDetailModal(false);
													joinVirtualSession(detailSession.id);
												}}
											>
												<FaVideo className="w-4 h-4" />
												Join Virtual Session
											</button>
										)}

										<button
											className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
											onClick={() => {
												setShowDetailModal(false);
												setActiveTab("feedback");

												setTimeout(() => {
													const element = document.getElementById(
														`feedback-${detailSession.id}`
													);
													if (element) {
														element.scrollIntoView({ behavior: "smooth" });
													}
												}, 100);
											}}
										>
											<MdOutlineRateReview className="w-4 h-4" />
											Rate This Session
										</button>

										{mode === "physical" && !detailSession.isVirtual && (
											<button
												className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
												onClick={() => {
													setShowDetailModal(false);
													const room = ROOMS.find(
														(r) => r.name === detailSession.room
													);
													if (room) {
														setSelectedRoom(room.id);
														setActiveTab("venue");
													}
												}}
											>
												<FaMapMarkerAlt className="w-4 h-4" />
												Navigate to Room
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const VenueMap = () => {
		return (
			<div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
				<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
					<FaBuilding className="text-blue-600" />
					Interactive Venue Map
				</h3>
				<div className="relative bg-gray-50 rounded-lg p-4 min-h-[500px] overflow-hidden">
					{}
					<div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
						<svg
							viewBox="0 0 800 600"
							className="w-full h-full"
							xmlns="http://www.w3.org/2000/svg"
						>
							{}
							<rect
								x="50"
								y="50"
								width="700"
								height="500"
								fill="white"
								stroke="#4b5563"
								strokeWidth="2"
								rx="20"
							/>

							{}
							<text
								x="75"
								y="80"
								fill="#1e40af"
								fontSize="14"
								fontWeight="bold"
							>
								Floor 1
							</text>
							<text
								x="75"
								y="280"
								fill="#1e40af"
								fontSize="14"
								fontWeight="bold"
							>
								Floor 2
							</text>

							{}
							{ROOMS.map((room) => {
								const isHovered = roomDetailId === room.id;
								const isSelected = selectedRoom === room.id;

								if (!room.location) return null;

								return (
									<g
										key={room.id}
										onMouseEnter={() => handleRoomHover(room.id)}
										onMouseLeave={() => handleRoomHover(null)}
										className="cursor-pointer"
										onClick={() =>
											setSelectedRoom(selectedRoom === room.id ? null : room.id)
										}
									>
										<rect
											x={room.location.x}
											y={room.location.y}
											width={room.location.width}
											height={room.location.height}
											fill={isHovered || isSelected ? "#dbeafe" : "#e5e7eb"}
											stroke={isHovered || isSelected ? "#3b82f6" : "#9ca3af"}
											strokeWidth={isHovered || isSelected ? "2" : "1"}
											rx="5"
											className="transition-all duration-200"
										/>
										<text
											x={room.location.x + room.location.width / 2}
											y={room.location.y + room.location.height / 2}
											textAnchor="middle"
											fill={isHovered || isSelected ? "#1e40af" : "#4b5563"}
											fontSize="14"
											className="transition-all duration-200"
										>
											{room.name}
										</text>
									</g>
								);
							})}

							{}
							<rect
								x="350"
								y="100"
								width="100"
								height="350"
								fill="#f3f4f6"
								stroke="#d1d5db"
								strokeWidth="1"
							/>

							{}
							<rect
								x="350"
								y="450"
								width="100"
								height="50"
								fill="#d1fae5"
								stroke="#6ee7b7"
								strokeWidth="1"
							/>
							<text
								x="400"
								y="480"
								textAnchor="middle"
								fill="#065f46"
								fontSize="12"
							>
								Main Entrance
							</text>

							{}
							<rect
								x="700"
								y="450"
								width="50"
								height="100"
								fill="#fef3c7"
								stroke="#f59e0b"
								strokeWidth="1"
							/>
							<text
								x="725"
								y="500"
								textAnchor="middle"
								fill="#92400e"
								fontSize="12"
							>
								Stairs
							</text>

							{}
							<rect
								x="50"
								y="450"
								width="50"
								height="100"
								fill="#dbeafe"
								stroke="#60a5fa"
								strokeWidth="1"
							/>
							<text
								x="75"
								y="500"
								textAnchor="middle"
								fill="#1e40af"
								fontSize="12"
							>
								Restrooms
							</text>

							{}
							{ROOMS.filter((r) => r.currentSession).map((room) => {
								const coords = {
									"Main Auditorium": { x: 225, y: 130 },
									Lobby: { x: 225, y: 330 },
									"Workshop Room A": { x: 575, y: 130 },
									"Conference Room B": { x: 575, y: 330 },
								};
								return (
									<g key={room.id}>
										<circle
											cx={coords[room.name as keyof typeof coords].x}
											cy={coords[room.name as keyof typeof coords].y}
											r="8"
											fill="#10b981"
											className="animate-pulse"
										/>
										<text
											x={coords[room.name as keyof typeof coords].x}
											y={coords[room.name as keyof typeof coords].y - 15}
											textAnchor="middle"
											fill="#065f46"
											fontSize="10"
										>
											Active
										</text>
									</g>
								);
							})}

							{}
							{selectedRoom &&
								(() => {
									const room = ROOMS.find((r) => r.id === selectedRoom);
									const coords = {
										"Main Auditorium": { x: 225, y: 180 },
										Lobby: { x: 225, y: 380 },
										"Workshop Room A": { x: 575, y: 180 },
										"Conference Room B": { x: 575, y: 380 },
									};

									if (room && coords[room.name as keyof typeof coords]) {
										return (
											<g>
												<circle
													cx={coords[room.name as keyof typeof coords].x}
													cy={coords[room.name as keyof typeof coords].y + 30}
													r="10"
													fill="#ef4444"
													className="animate-ping"
													style={{ animationDuration: "3s" }}
												/>
												<circle
													cx={coords[room.name as keyof typeof coords].x}
													cy={coords[room.name as keyof typeof coords].y + 30}
													r="6"
													fill="#ef4444"
												/>
												<text
													x={coords[room.name as keyof typeof coords].x}
													y={coords[room.name as keyof typeof coords].y + 50}
													textAnchor="middle"
													fill="#b91c1c"
													fontSize="12"
													fontWeight="bold"
												>
													You are here
												</text>
											</g>
										);
									}
									return null;
								})()}
						</svg>
					</div>

					{}
					<Transition
						show={showRoomDetailPopup && !!roomDetailId}
						enter="transition duration-200 ease-out"
						enterFrom="opacity-0 transform scale-95"
						enterTo="opacity-100 transform scale-100"
						leave="transition duration-150 ease-in"
						leaveFrom="opacity-100 transform scale-100"
						leaveTo="opacity-0 transform scale-95"
						className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 border border-blue-100"
					>
						{roomDetailId &&
							(() => {
								const room = ROOMS.find((r) => r.id === roomDetailId);
								return room ? (
									<div>
										<div className="flex justify-between items-start">
											<div>
												<h4 className="font-bold text-gray-900 mb-2 text-lg flex items-center gap-2">
													<MdMeetingRoom className="text-blue-600" />
													{room.name}
												</h4>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<div className="flex items-center gap-1">
														<FaUsers className="text-blue-500" />
														<span className="text-sm font-medium text-gray-700">
															Capacity:
														</span>
														<span className="ml-1 text-sm text-gray-900">
															{room.capacity}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<FaBuilding className="text-blue-500" />
														<span className="text-sm font-medium text-gray-700">
															Floor:
														</span>
														<span className="ml-1 text-sm text-gray-900">
															{room.floor}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<FaClock className="text-blue-500" />
														<span className="text-sm font-medium text-gray-700">
															Status:
														</span>
														<span
															className={`ml-1 text-sm ${
																room.currentSession
																	? "text-green-600 font-semibold"
																	: "text-gray-500"
															}`}
														>
															{room.currentSession ? "Active" : "Available"}
														</span>
													</div>
												</div>
											</div>

											<div className="flex items-start gap-2">
												{room.image && (
													<div className="hidden md:block">
														<img
															src={room.image}
															alt={room.name}
															className="w-20 h-20 object-cover rounded-lg shadow-sm"
														/>
													</div>
												)}

												<button
													onClick={closeRoomDetail}
													className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
													aria-label="Close room details"
												>
													<MdClose className="w-5 h-5" />
												</button>
											</div>
										</div>

										{room.description && (
											<p className="text-sm text-gray-600 mt-2 mb-3">
												{room.description}
											</p>
										)}

										<div className="mt-3">
											<span className="text-sm font-medium text-gray-700 flex items-center gap-1">
												<FaInfoCircle className="text-blue-500" />
												Amenities:
											</span>
											<div className="flex flex-wrap gap-1 mt-1">
												{room.amenities.map((amenity) => (
													<span
														key={amenity}
														className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
													>
														{amenity}
													</span>
												))}
											</div>
										</div>

										{room.currentSession && (
											<div className="mt-3 pt-3 border-t border-gray-100">
												<div className="flex items-center gap-1 text-sm font-medium text-gray-700">
													<MdMeetingRoom className="text-green-600" />
													<span>Current Session:</span>
												</div>
												<div className="mt-1 text-sm text-gray-900">
													{(() => {
														const session = SESSIONS.find(
															(s) => s.id === room.currentSession
														);
														return session ? (
															<div className="flex flex-col">
																<span className="font-semibold">
																	{session.title}
																</span>
																<span className="text-gray-600">
																	{session.speaker}
																</span>
																<span className="text-xs text-gray-500">
																	{session.time} ({session.duration})
																</span>
															</div>
														) : (
															"No active session"
														);
													})()}
												</div>
											</div>
										)}

										{}
										<div className="mt-3 flex justify-end">
											<button
												className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
												onClick={(e) => {
													e.stopPropagation();

													setSelectedRoom(room.id);
												}}
											>
												<FaCompass className="w-3 h-3" />
												Navigate to Room
											</button>
										</div>
									</div>
								) : null;
							})()}
					</Transition>
				</div>
			</div>
		);
	};

	const RoomList = () => (
		<div className="space-y-4">
			{ROOMS.map((room) => (
				<div
					key={room.id}
					className={`bg-white rounded-xl shadow-lg p-4 border transition-all duration-200 ${
						selectedRoom === room.id
							? "border-blue-300 shadow-blue-100"
							: "border-gray-200"
					}`}
					onClick={() =>
						setSelectedRoom(selectedRoom === room.id ? null : room.id)
					}
				>
					<div className="flex items-start justify-between mb-3">
						<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
							<MdMeetingRoom
								className={
									room.currentSession ? "text-green-600" : "text-gray-400"
								}
							/>
							{room.name}
						</h3>
						<span
							className={`px-2 py-1 rounded-full text-xs font-semibold ${
								room.currentSession
									? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
									: "bg-gray-100 text-gray-600"
							}`}
						>
							{room.currentSession ? "Active" : "Available"}
						</span>
					</div>

					<div className="grid grid-cols-2 gap-4 mb-3">
						<div className="flex items-center gap-1">
							<FaUsers className="text-blue-500 w-3 h-3" />
							<span className="text-sm font-medium text-gray-700">
								Capacity:
							</span>
							<span className="ml-1 text-sm text-gray-900">
								{room.capacity}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<FaBuilding className="text-blue-500 w-3 h-3" />
							<span className="text-sm font-medium text-gray-700">Floor:</span>
							<span className="ml-1 text-sm text-gray-900">{room.floor}</span>
						</div>
					</div>

					{room.description && (
						<p className="text-sm text-gray-600 mb-3">{room.description}</p>
					)}

					<div>
						<span className="text-sm font-medium text-gray-700 flex items-center gap-1">
							<FaInfoCircle className="text-blue-500 w-3 h-3" />
							Amenities:
						</span>
						<div className="flex flex-wrap gap-1 mt-1">
							{room.amenities.map((amenity) => (
								<span
									key={amenity}
									className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
								>
									{amenity}
								</span>
							))}
						</div>
					</div>

					{room.currentSession && (
						<div className="mt-3 pt-3 border-t border-gray-100">
							<div className="flex items-center gap-1 text-sm font-medium text-gray-700">
								<FaCalendarAlt className="text-green-600 w-3 h-3" />
								<span>Current Session:</span>
							</div>
							<div className="mt-1 text-sm text-gray-900">
								{(() => {
									const session = SESSIONS.find(
										(s) => s.id === room.currentSession
									);
									return session ? (
										<div className="flex flex-col">
											<span className="font-semibold">{session.title}</span>
											<span className="text-gray-600">{session.speaker}</span>
											<span className="text-xs text-gray-500">
												{session.time} ({session.duration})
											</span>
										</div>
									) : (
										"No active session"
									);
								})()}
							</div>
						</div>
					)}

					{room.image && (
						<div className="mt-3">
							<img
								src={room.image}
								alt={room.name}
								className="w-full h-32 object-cover rounded-lg shadow-sm mt-2"
							/>
						</div>
					)}

					<div className="mt-3 flex justify-end">
						<button
							className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
							onClick={(e) => {
								e.stopPropagation();

								setSelectedRoom(room.id);
							}}
						>
							<FaCompass className="w-3 h-3" />
							Navigate to Room
						</button>
					</div>
				</div>
			))}
		</div>
	);

	const ChatSystem = () => {
		const chatMessagesRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			if (chatMessagesRef.current) {
				chatMessagesRef.current.scrollTop =
					chatMessagesRef.current.scrollHeight;
			}
		}, [messages, selectedChannel]);

		const handleChannelChange = (newChannel: string) => {
			setSelectedChannel(newChannel);

			const isFirstTimeInChannel = !messages.some(
				(m) => m.channel === newChannel
			);
			if (isFirstTimeInChannel) {
				const welcomeMessage: Message = {
					id: Date.now().toString(),
					user: "EventHub Bot",
					content: `Welcome to the ${newChannel} channel! This is where attendees and speakers can discuss topics related to this area.`,
					timestamp: new Date().toLocaleTimeString("en-US", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					}),
					channel: newChannel,
					userAvatar: "https://randomuser.me/api/portraits/lego/2.jpg",
					isCurrentUser: false,
				};
				setMessages((prev) => [...prev, welcomeMessage]);
			}
		};

		const handleResizeChat = (newHeight: number) => {
			setChatHeight((prev) => Math.max(200, Math.min(800, prev + newHeight)));
		};

		return (
			<div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300">
				<div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
					<h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
						<BsChatFill className="text-blue-600" />
						Event Chat
					</h3>
					<select
						value={selectedChannel}
						onChange={(e) => handleChannelChange(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
						aria-label="Select chat channel"
					>
						{channels.map((channel) => (
							<option key={channel} value={channel}>
								{channel}
							</option>
						))}
					</select>
				</div>

				<div className="relative">
					{}
					<div
						className="absolute top-0 left-0 right-0 h-2 bg-gray-200 cursor-ns-resize flex justify-center items-center hover:bg-blue-200 transition-colors"
						onMouseDown={(e) => {
							e.preventDefault();
							const startY = e.clientY;
							const startHeight = chatHeight;

							const handleMouseMove = (moveEvent: MouseEvent) => {
								const deltaY = startY - moveEvent.clientY;
								handleResizeChat(deltaY);
							};

							const handleMouseUp = () => {
								document.removeEventListener("mousemove", handleMouseMove);
								document.removeEventListener("mouseup", handleMouseUp);
							};

							document.addEventListener("mousemove", handleMouseMove);
							document.addEventListener("mouseup", handleMouseUp);
						}}
					>
						<div className="w-10 h-1 bg-gray-400 rounded-full"></div>
					</div>

					<div
						ref={chatMessagesRef}
						className="overflow-y-auto p-4 space-y-3 transition-all duration-300"
						style={{ height: `${chatHeight}px` }}
					>
						{messages
							.filter((msg) => msg.channel === selectedChannel)
							.map((message) => (
								<div
									key={message.id}
									className={`flex gap-3 ${
										message.isCurrentUser ? "justify-end" : ""
									}`}
								>
									{!message.isCurrentUser && (
										<div className="flex-shrink-0">
											<div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden">
												{message.userAvatar ? (
													<img
														src={message.userAvatar}
														alt={message.user}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full bg-blue-500 flex items-center justify-center">
														{message.user[0]}
													</div>
												)}
											</div>
										</div>
									)}

									<div
										className={`${
											message.isCurrentUser ? "order-first mr-2" : ""
										}`}
										style={{ maxWidth: message.isCurrentUser ? "80%" : "80%" }}
									>
										<div
											className={`flex items-center gap-2 mb-1 ${
												message.isCurrentUser ? "justify-end" : ""
											}`}
										>
											<span className="text-xs text-gray-500">
												{message.timestamp}
											</span>
											<span
												className={`font-medium ${
													message.isCurrentUser
														? "text-blue-600"
														: "text-gray-900"
												}`}
											>
												{message.user}
											</span>
										</div>
										<div
											className={`p-3 rounded-lg ${
												message.isCurrentUser
													? "bg-blue-600 text-white ml-auto"
													: "bg-gray-100 text-gray-700"
											}`}
											style={{
												maxWidth: "100%",
												width: "fit-content",
												marginLeft: message.isCurrentUser ? "auto" : "0",
											}}
										>
											<p className="text-sm whitespace-pre-wrap break-words">
												{message.content}
											</p>
										</div>
									</div>
								</div>
							))}
						<div ref={messageEndRef} />
					</div>
				</div>

				<div className="p-4 border-t border-gray-200 bg-white">
					<form
						className="flex gap-2"
						onSubmit={(e) => {
							e.preventDefault();
							sendMessage();
						}}
					>
						<input
							type="text"
							ref={chatInputRef}
							value={newMessage}
							onChange={(e) => {
								e.preventDefault();
								setNewMessage(e.target.value);
								setCanSend(!!e.target.value.trim());
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey && newMessage.trim()) {
									e.preventDefault();
									sendMessage();
								}
							}}
							onFocus={() => setChatInputFocused(true)}
							onBlur={() => setChatInputFocused(false)}
							placeholder="Type your message..."
							className={`flex-1 p-2 border rounded-lg transition-all focus:outline-none ${
								chatInputFocused
									? "border-blue-500 ring-2 ring-blue-200"
									: "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							}`}
							aria-label="Chat message"
						/>
						<button
							type="submit"
							disabled={!newMessage.trim()}
							className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
								!newMessage.trim()
									? "opacity-50 cursor-not-allowed"
									: "hover:from-blue-600 hover:to-indigo-700"
							}`}
							aria-label="Send message"
						>
							<IoMdSend className="w-4 h-4" />
						</button>
					</form>

					<div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
						<FaInfoCircle className="w-3 h-3" />
						<span>Messages are visible to all attendees in this channel</span>
					</div>
				</div>
			</div>
		);
	};

	const VirtualSessionPopout = ({ sessionId }: { sessionId: string }) => {
		const session = SESSIONS.find((s) => s.id === sessionId);
		if (!session) return null;

		const position = windowPositions[sessionId] || { x: 0, y: 0 };
		const isMinimized = popoutMinimized[sessionId] || false;

		return (
			<div
				className="fixed z-50 transition-all duration-200"
				style={{
					bottom: isMinimized ? "4rem" : "4rem",
					right: isMinimized ? "4rem" : "4rem",
					transform: `translate(${position.x}px, ${position.y}px)`,
					width: isMinimized ? "240px" : "320px",
				}}
			>
				<div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
					<div
						className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 flex justify-between items-center cursor-move"
						onMouseDown={(e) => {
							e.preventDefault();
							startDrag(e, sessionId);
						}}
					>
						<h3 className="font-bold text-sm truncate">{session.title}</h3>
						<div className="flex items-center gap-1">
							<button
								onClick={() => toggleMinimize(sessionId)}
								className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
								aria-label={isMinimized ? "Expand" : "Minimize"}
							>
								{isMinimized ? (
									<FaChevronDown className="w-3 h-3" />
								) : (
									<FaChevronDown className="w-3 h-3 transform rotate-180" />
								)}
							</button>
							<button
								onClick={() => setActivePopout(null)}
								className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
								aria-label="Close"
							>
								<FaTimes className="w-3 h-3" />
							</button>
						</div>
					</div>

					<Transition
						show={!isMinimized}
						enter="transition-all duration-200 ease-out"
						enterFrom="opacity-0 max-h-0"
						enterTo="opacity-100 max-h-[400px]"
						leave="transition-all duration-200 ease-in"
						leaveFrom="opacity-100 max-h-[400px]"
						leaveTo="opacity-0 max-h-0"
						className="overflow-hidden"
					>
						<div className="p-4">
							<div className="mb-3">
								<div className="flex items-center gap-2 mb-2">
									{session.speakerImage && (
										<img
											src={session.speakerImage}
											alt={session.speaker}
											className="w-8 h-8 rounded-full object-cover border border-gray-200"
										/>
									)}
									<span className="font-medium">{session.speaker}</span>
								</div>
								<p className="text-sm text-gray-600 mb-2">
									{session.description}
								</p>
							</div>

							<div className="space-y-2">
								<button className="w-full py-2 bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-2 hover:bg-blue-200 transition-colors">
									<FaLink className="w-3 h-3" />
									<span className="text-sm">Session Materials</span>
								</button>

								<button className="w-full py-2 bg-green-100 text-green-700 rounded flex items-center justify-center gap-2 hover:bg-green-200 transition-colors">
									<FaUsers className="w-3 h-3" />
									<span className="text-sm">
										Participants ({session.attendees})
									</span>
								</button>

								<button
									className="w-full py-2 bg-red-100 text-red-700 rounded flex items-center justify-center gap-2 hover:bg-red-200 transition-colors"
									onClick={() => setActivePopout(null)}
								>
									<FaDoorOpen className="w-3 h-3" />
									<span className="text-sm">Close Window</span>
								</button>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		);
	};

	const NotificationPanel = () => {
		return (
			<div
				ref={notificationRef}
				className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-fadeIn"
			>
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 flex justify-between items-center">
					<h3 className="font-bold">Notifications</h3>
					<button
						className="text-white hover:bg-white/20 rounded-full p-1"
						onClick={() => setShowNotificationPanel(false)}
					>
						<MdClose className="w-4 h-4" />
					</button>
				</div>

				<div className="max-h-96 overflow-y-auto">
					{notifications.length === 0 ? (
						<div className="p-4 text-center text-gray-500">
							<BsCheckCircleFill className="w-8 h-8 mx-auto mb-2 text-green-500" />
							<p>You're all caught up!</p>
						</div>
					) : (
						<div className="divide-y divide-gray-100">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`p-3 hover:bg-gray-50 transition-colors ${
										notification.read ? "bg-white" : "bg-blue-50"
									}`}
								>
									<div className="flex items-start gap-3">
										<div className="mt-1">
											{notification.type === "reminder" && (
												<BsCalendarCheck className="w-5 h-5 text-blue-500" />
											)}
											{notification.type === "alert" && (
												<FaExclamationCircle className="w-5 h-5 text-red-500" />
											)}
											{notification.type === "info" && (
												<FaInfoCircle className="w-5 h-5 text-green-500" />
											)}
											{notification.type === "update" && (
												<MdWarning className="w-5 h-5 text-amber-500" />
											)}
										</div>
										<div className="flex-1">
											<div className="flex justify-between items-start">
												<h4 className="font-medium text-gray-900">
													{notification.title}
												</h4>
												<span className="text-xs text-gray-500">
													{notification.time}
												</span>
											</div>
											<p className="text-sm text-gray-600 mt-1">
												{notification.message}
											</p>

											{notification.link && (
												<a
													href={notification.link}
													className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
												>
													View details
												</a>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="p-2 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
					<button
						className="text-xs text-blue-600 hover:text-blue-800 p-1"
						onClick={() => {
							setNotifications(
								notifications.map((n) => ({ ...n, read: true }))
							);
							setNotificationCount(0);
						}}
					>
						Mark all as read
					</button>
					<button
						className="text-xs text-gray-600 hover:text-gray-800 p-1"
						onClick={() => {
							setNotifications([]);
							setNotificationCount(0);
						}}
					>
						Clear all
					</button>
				</div>
			</div>
		);
	};

	const FeedbackForm = () => (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
				<MdOutlineRateReview className="text-blue-600" />
				Session Feedback
			</h2>
			<div className="grid gap-6 lg:grid-cols-2">
				{SESSIONS.map((session) => (
					<div
						key={session.id}
						id={`feedback-${session.id}`}
						className={`bg-white rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${
							submittedFeedback.has(session.id)
								? "border-green-200"
								: feedbackErrors[session.id]
								? "border-red-200"
								: "border-gray-100"
						}`}
					>
						<div className="flex items-start gap-3 mb-4">
							{session.speakerImage && (
								<img
									src={session.speakerImage}
									alt={session.speaker}
									className="w-12 h-12 rounded-full object-cover border border-gray-200"
								/>
							)}
							<div>
								<h3 className="text-lg font-bold text-gray-900 mb-1">
									{session.title}
								</h3>
								<p className="text-gray-600">{session.speaker}</p>
							</div>
						</div>

						{submittedFeedback.has(session.id) ? (
							<div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4 flex items-center gap-3">
								<div className="bg-green-100 rounded-full p-2">
									<BsCheckCircleFill className="w-6 h-6 text-green-600" />
								</div>
								<div>
									<h4 className="font-medium text-green-800">
										Thank you for your feedback!
									</h4>
									<p className="text-sm text-green-700">
										Your input helps us improve future sessions.
									</p>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
										<BsStarFill className="text-yellow-400" />
										Rate this session: <span className="text-red-500">*</span>
									</label>
									<div className="flex gap-1">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												onClick={() => rateSession(session.id, star)}
												className="p-1 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full"
												aria-label={`Rate ${star} stars`}
											>
												{(ratings[session.id] || 0) >= star ? (
													<BsStarFill className="w-6 h-6 text-yellow-400" />
												) : (
													<FaRegStar className="w-6 h-6 text-gray-300" />
												)}
											</button>
										))}
										{ratings[session.id] ? (
											<span className="ml-2 text-blue-600 font-semibold flex items-center">
												{ratings[session.id]}/5
											</span>
										) : null}
									</div>
									{feedbackErrors[session.id] && (
										<p className="text-sm text-red-500 mt-1">
											{feedbackErrors[session.id]}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
										<FaComments className="text-blue-500" />
										Comments:
									</label>
									<textarea
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
										rows={3}
										placeholder="Share your thoughts about this session..."
										value={detailedFeedback[session.id] || ""}
										onChange={(e) => {
											e.preventDefault();
											const newValue = e.target.value;

											setDetailedFeedback((prev) => ({
												...prev,
												[session.id]: newValue,
											}));
										}}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
										<MdSettings className="text-blue-500" />
										What could be improved?
									</label>
									<textarea
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
										rows={2}
										placeholder="Any suggestions for improvement?"
										value={improvementFeedback[session.id] || ""}
										onChange={(e) => {
											e.preventDefault();
											const newValue = e.target.value;
											setImprovementFeedback((prev) => ({
												...prev,
												[session.id]: newValue,
											}));
										}}
									/>
								</div>

								<div className="flex items-center">
									<input
										type="checkbox"
										id={`recommend-${session.id}`}
										className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										checked={wouldRecommend[session.id] || false}
										onChange={(e) =>
											setWouldRecommend({
												...wouldRecommend,
												[session.id]: e.target.checked,
											})
										}
									/>
									<label
										htmlFor={`recommend-${session.id}`}
										className="ml-2 text-sm text-gray-700"
									>
										I would recommend this session to others
									</label>
								</div>

								<button
									className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
									onClick={() => handleFeedbackSubmit(session.id)}
								>
									<FaPaperPlane className="w-4 h-4" />
									Submit Feedback
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);

	const VirtualRooms = () => (
		<div className="grid gap-6 md:grid-cols-2">
			<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						<FaVideo className="text-blue-600" />
						Virtual Track 1
					</h3>
					<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						Live
					</span>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
						<span className="text-gray-700 flex items-center gap-1">
							<FaCalendarAlt className="text-blue-500 w-4 h-4" />
							Active Sessions
						</span>
						<span className="text-blue-600 font-semibold">2</span>
					</div>
					<div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
						<span className="text-gray-700 flex items-center gap-1">
							<FaUsers className="text-blue-500 w-4 h-4" />
							Participants
						</span>
						<span className="text-blue-600 font-semibold">156</span>
					</div>

					<div className="mt-3 bg-gray-50 p-3 rounded-lg">
						<h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
							<MdMeetingRoom className="text-blue-500" />
							Current Session
						</h4>
						<p className="text-sm font-semibold">
							Opening Keynote: Future of Hybrid Events
						</p>
						<p className="text-xs text-gray-600">Dr. Sarah Chen</p>
					</div>

					<button
						className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
						onClick={() => joinVirtualSession("1")}
					>
						<FaVideo className="w-4 h-4" />
						Join Virtual Track 1
					</button>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						<FaVideo className="text-blue-600" />
						Virtual Track 2
					</h3>
					<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						Live
					</span>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
						<span className="text-gray-700 flex items-center gap-1">
							<FaCalendarAlt className="text-blue-500 w-4 h-4" />
							Active Sessions
						</span>
						<span className="text-blue-600 font-semibold">1</span>
					</div>
					<div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
						<span className="text-gray-700 flex items-center gap-1">
							<FaUsers className="text-blue-500 w-4 h-4" />
							Participants
						</span>
						<span className="text-blue-600 font-semibold">89</span>
					</div>

					<div className="mt-3 bg-gray-50 p-3 rounded-lg">
						<h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
							<MdMeetingRoom className="text-blue-500" />
							Current Session
						</h4>
						<p className="text-sm font-semibold">
							Interactive Workshop: Digital Transformation
						</p>
						<p className="text-xs text-gray-600">Mark Rodriguez</p>
					</div>

					<button
						className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
						onClick={() => joinVirtualSession("2")}
					>
						<FaVideo className="w-4 h-4" />
						Join Virtual Track 2
					</button>
				</div>
			</div>
		</div>
	);

	const Toast = ({
		message,
		type = "success",
		duration = 3000,
	}: {
		message: string;
		type?: "success" | "error" | "info" | "warning";
		duration?: number;
	}) => {
		const [visible, setVisible] = useState(true);

		useEffect(() => {
			const timer = setTimeout(() => {
				setVisible(false);
			}, duration);

			return () => clearTimeout(timer);
		}, [duration]);

		const bgColor = {
			success: "bg-green-500",
			error: "bg-red-500",
			info: "bg-blue-500",
			warning: "bg-amber-500",
		}[type];

		const icon = {
			success: <BsCheckCircleFill className="w-5 h-5" />,
			error: <BsXCircleFill className="w-5 h-5" />,
			info: <FaInfoCircle className="w-5 h-5" />,
			warning: <FaExclamationTriangle className="w-5 h-5" />,
		}[type];

		return (
			<Transition
				show={visible}
				enter="transition ease-out duration-300"
				enterFrom="transform opacity-0 translate-y-4"
				enterTo="transform opacity-100 translate-y-0"
				leave="transition ease-in duration-200"
				leaveFrom="transform opacity-100 translate-y-0"
				leaveTo="transform opacity-0 translate-y-4"
				className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50`}
			>
				{icon}
				<span>{message}</span>
			</Transition>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			{}
			<header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
									<FaCalendarAlt className="w-5 h-5 text-white" />
								</div>
								<h1 className="text-xl hidden md:block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
									EventHubPro
								</h1>
							</div>

							{!isMobile && (
								<nav className="hidden md:flex space-x-1">
									{[
										{ id: "schedule", label: "Schedule", icon: FaCalendarAlt },
										{ id: "venue", label: "Venue", icon: FaMapMarkerAlt },
										{ id: "chat", label: "Chat", icon: BsChatFill },
										{
											id: "feedback",
											label: "Feedback",
											icon: MdOutlineRateReview,
										},
									].map((tab) => (
										<button
											key={tab.id}
											onClick={() => setActiveTab(tab.id as any)}
											className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
												activeTab === tab.id
													? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
													: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
											}`}
											aria-label={`Go to ${tab.label}`}
										>
											<tab.icon className="w-4 h-4" />
											<span>{tab.label}</span>
										</button>
									))}
								</nav>
							)}
						</div>

						<div className="flex items-center gap-4">
							{}
							<div className="relative">
								<button
									className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
									onClick={toggleNotificationPanel}
									data-notification-toggle="true"
									aria-label="Notifications"
								>
									<MdNotificationsActive className="w-5 h-5" />
									{notificationCount > 0 && (
										<span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
											{notificationCount}
										</span>
									)}
								</button>

								{}
								{showNotificationPanel && <NotificationPanel />}
							</div>

							{}
							<div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
								<button
									onClick={() => setMode("physical")}
									className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
										mode === "physical"
											? "bg-white text-blue-700 shadow-sm font-medium"
											: "text-gray-600 hover:text-gray-900"
									}`}
									aria-label="Switch to physical mode"
								>
									<FaMapMarkerAlt className="w-4 h-4" />
									<span className="hidden sm:inline">Physical</span>
								</button>
								<button
									onClick={() => setMode("virtual")}
									className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
										mode === "virtual"
											? "bg-white text-blue-700 shadow-sm font-medium"
											: "text-gray-600 hover:text-gray-900"
									}`}
									aria-label="Switch to virtual mode"
								>
									<FaGlobe className="w-4 h-4" />
									<span className="hidden sm:inline">Virtual</span>
								</button>
							</div>

							{}
							<div className="hidden sm:flex items-center gap-2 border-l pl-4 border-gray-200">
								<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
									<BsPersonCircle className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium">J. Smith</span>
							</div>

							{isMobile && (
								<button
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
									className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
									aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
								>
									{mobileMenuOpen ? (
										<FaTimes className="w-5 h-5" />
									) : (
										<FaBars className="w-5 h-5" />
									)}
								</button>
							)}
						</div>
					</div>
				</div>

				{}
				<Transition
					show={isMobile && mobileMenuOpen}
					enter="transition duration-200 ease-out"
					enterFrom="opacity-0 transform -translate-y-2"
					enterTo="opacity-100 transform translate-y-0"
					leave="transition duration-150 ease-in"
					leaveFrom="opacity-100 transform translate-y-0"
					leaveTo="opacity-0 transform -translate-y-2"
					className="border-t border-gray-200 bg-white shadow-lg"
				>
					<div className="px-4 py-2 space-y-1">
						{[
							{ id: "schedule", label: "Schedule", icon: FaCalendarAlt },
							{ id: "venue", label: "Venue", icon: FaMapMarkerAlt },
							{ id: "chat", label: "Chat", icon: BsChatFill },
							{
								id: "feedback",
								label: "Feedback",
								icon: MdOutlineRateReview,
							},
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => {
									setActiveTab(tab.id as any);
									setMobileMenuOpen(false);
								}}
								className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors duration-200 ${
									activeTab === tab.id
										? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
								}`}
							>
								<tab.icon className="w-5 h-5" />
								<span>{tab.label}</span>
							</button>
						))}

						{}
						<div className="flex items-center gap-3 px-3 py-3 border-t border-gray-100 mt-2">
							<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
								<BsPersonCircle className="w-5 h-5" />
							</div>
							<div>
								<span className="text-sm font-medium">J. Smith</span>
								<span className="text-xs block text-gray-500">Attendee</span>
							</div>
						</div>
					</div>
				</Transition>
			</header>

			{}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{activeTab === "schedule" && (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
								<FaCalendarAlt className="text-blue-600" />
								Event Schedule
							</h2>
							<div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
								<FaClock className="w-4 h-4 text-blue-500" />
								<span>Updated live</span>
							</div>
						</div>

						{isMobile ? (
							<div className="space-y-4">
								{SESSIONS.map((session) => (
									<SessionCard
										key={session.id}
										session={session}
										isExpanded={expandedSessions.has(session.id)}
									/>
								))}
							</div>
						) : (
							<div className="grid gap-6 lg:grid-cols-2">
								{SESSIONS.map((session) => (
									<SessionCard
										key={session.id}
										session={session}
										isExpanded={true}
									/>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "venue" && (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
							{mode === "physical" ? (
								<>
									<FaBuilding className="text-blue-600" />
									Venue Layout
								</>
							) : (
								<>
									<FaGlobe className="text-blue-600" />
									Virtual Rooms
								</>
							)}
						</h2>

						{mode === "physical" ? (
							isMobile ? (
								<RoomList />
							) : (
								<VenueMap />
							)
						) : (
							<VirtualRooms />
						)}
					</div>
				)}

				{activeTab === "chat" && (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
							<BsChatFill className="text-blue-600" />
							Event Communication
						</h2>
						<ChatSystem />
					</div>
				)}

				{activeTab === "feedback" && <FeedbackForm />}
			</main>

			{}
			<footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 py-12 mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div className="md:col-span-1">
							<div className="flex items-center gap-2 mb-3">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
									<FaCalendarAlt className="w-5 h-5 text-white" />
								</div>
								<h2 className="text-xl font-bold text-white">EventHubPro</h2>
							</div>
							<p className="text-sm text-gray-400 mb-4">
								The complete solution for hybrid events that seamlessly connects
								in-person and virtual attendees.
							</p>
							<div className="flex gap-3">
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
									aria-label="Twitter"
								>
									<FaTwitter className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
									aria-label="LinkedIn"
								>
									<FaLinkedin className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
									aria-label="Instagram"
								>
									<FaInstagram className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
									aria-label="YouTube"
								>
									<FaYoutube className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
									aria-label="Facebook"
								>
									<FaFacebook className="w-5 h-5" />
								</a>
							</div>
						</div>

						<div>
							<h3 className="font-semibold text-white mb-4 text-lg">
								Quick Links
							</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaHome className="w-3 h-3" />
										<span>Home</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaCalendarAlt className="w-3 h-3" />
										<span>Schedule</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaUsers className="w-3 h-3" />
										<span>Speakers</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaMapMarkerAlt className="w-3 h-3" />
										<span>Venue</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaQuestion className="w-3 h-3" />
										<span>FAQ</span>
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold text-white mb-4 text-lg">
								Resources
							</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaDownload className="w-3 h-3" />
										<span>App Download</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaBook className="w-3 h-3" />
										<span>Documentation</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaVideo className="w-3 h-3" />
										<span>Tutorials</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaBlog className="w-3 h-3" />
										<span>Blog</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
									>
										<FaNewspaper className="w-3 h-3" />
										<span>Press Kit</span>
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold text-white mb-4 text-lg">
								Contact Us
							</h3>
							<ul className="space-y-2 text-sm">
								<li className="flex items-start gap-2 text-gray-400">
									<FaMapMarkerAlt className="w-4 h-4 mt-0.5 text-blue-400" />
									<span>123 Event Street, Conference City, EC 12345</span>
								</li>
								<li className="flex items-center gap-2 text-gray-400">
									<FaEnvelope className="w-4 h-4 text-blue-400" />
									<a
										href="mailto:info@eventhubpro.com"
										className="hover:text-white transition-colors"
									>
										info@eventhubpro.com
									</a>
								</li>
								<li className="flex items-center gap-2 text-gray-400">
									<FaPhone className="w-4 h-4 text-blue-400" />
									<a
										href="tel:+11234567890"
										className="hover:text-white transition-colors"
									>
										+1 (123) 456-7890
									</a>
								</li>
							</ul>

							<div className="mt-4 pt-4 border-t border-gray-700">
								<form className="flex gap-2">
									<input
										type="email"
										placeholder="Subscribe to updates"
										className="flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
										aria-label="Email for newsletter"
									/>
									<button
										type="submit"
										className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
										aria-label="Subscribe"
									>
										<FaPaperPlane className="w-4 h-4" />
									</button>
								</form>
							</div>
						</div>
					</div>

					<div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="text-sm text-gray-400">
							 2025 EventHubPro. All in one.
						</div>
						<div className="flex gap-4 text-sm text-gray-400">
							<a href="#" className="hover:text-white transition-colors">
								Privacy Policy
							</a>
							<a href="#" className="hover:text-white transition-colors">
								Terms of Service
							</a>
							<a href="#" className="hover:text-white transition-colors">
								Cookie Policy
							</a>
							<a href="#" className="hover:text-white transition-colors">
								Accessibility
							</a>
						</div>
					</div>
				</div>
			</footer>

			{}
			{activePopout && <VirtualSessionPopout sessionId={activePopout} />}

			{}
			{showDetailModal && <SessionDetailModal />}

			{}
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out forwards;
				}

				.rating-pulse {
					animation: pulse 0.3s ease-out;
				}

				@keyframes pulse {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.05);
					}
					100% {
						transform: scale(1);
					}
				}

				.animate-ping {
					animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
				}

				@keyframes ping {
					75%,
					100% {
						transform: scale(1.5);
						opacity: 0;
					}
				}

				@media (max-width: 768px) {
					input,
					textarea {
						font-size: 16px;
					}
				}
				input,
				textarea {
					font-size: 16px;
					-webkit-appearance: none;
					transform: translateZ(0);
				}

				.typing {
					backface-visibility: hidden;
					will-change: transform;
				}

				input:focus,
				textarea:focus {
					transition: none !important;
				}
			`}</style>
		</div>
	);
}

const FaPhone = (props: any) => <svg {...props} />;
const FaBook = (props: any) => <svg {...props} />;
const FaBlog = (props: any) => <svg {...props} />;
const FaNewspaper = (props: any) => <svg {...props} />;
const FaDownload = (props: any) => <svg {...props} />;
const FaTag = (props: any) => <svg {...props} />;

export default EventHubPro;
