'use client'
import React, { useState, useEffect, useRef } from "react";
import {
	Calendar,
	Clock,
	MapPin,
	Users,
	Tag,
	Search,
	ChevronLeft,
	ChevronRight,
	Plus,
	Share2,
	Edit,
	TicketX,
	SquarePlus,
	X,
	Badge,
	Check,
	ChevronDown,
	Info,
	Home,
	Heart,
	Activity,
	Mail,
	Phone,
	User,
	Coffee,
	Briefcase,
	ArrowLeft,
	ArrowRight,
	Bell,
	Bookmark,
	Star,
	Zap,
	Award,
	Send,
	Gift,
	Book,
	Music,
	Film,
	Globe,
	Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Event = {
	id: number;
	title: string;
	date: string;
	time: string;
	type: string;
	description: string;
	location: string;
	rsvpCount: number;
	organizer: string;
	tags: string[];
	featured?: boolean;
};

type Resource = {
	name: string;
	address: string;
	phone: string;
	hours: string;
};

type Committee = {
	name: string;
	lead: string;
	email: string;
	members: number;
};

type Leader = {
	name: string;
	role: string;
	since: number;
};

type DayActivity = {
	day: string;
	activities: string[];
};

type CommunityInfoType = {
	name: string;
	description: string;
	mission: string;
	foundedYear: number;
	population: number;
	location: string;
	website: string;
	email: string;
	phone: string;
	socialMedia: {
		facebook: string;
		twitter: string;
		instagram: string;
	};
	upcomingHighlights: string[];
	weeklyActivities: DayActivity[];
	resources: Resource[];
	committees: Committee[];
	leaders: Leader[];
};

type EventTypeOption = {
	value: string;
	label: string;
	icon: React.ReactNode;
};

type EventColor = {
	bg: string;
	light: string;
	text: string;
	border: string;
	gradient: string;
};

type ToastProps = {
	open: boolean;
	message: string;
	type?: "success" | "error" | "info";
};
type Notification = {
	id: string;
	title: string;
	message: string;
	time: string;
	read: boolean;
	type: "event" | "rsvp" | "community" | "announcement";
	actionUrl?: string;
};

const communityInfo: CommunityInfoType = {
	name: "THIS Community",
	description:
		"THIS is a vibrant community dedicated to fostering connections, supporting local initiatives, and creating a welcoming environment for all residents.",
	mission:
		"Our mission is to build a thriving community where residents feel connected, supported, and empowered to contribute to our shared prosperity and well-being.",
	foundedYear: 1985,
	population: 12500,
	location: "THIS, NZ",
	website: "www.this-community.org",
	email: "info@this-community.org",
	phone: "(27) 123-4567",
	socialMedia: {
		facebook: "facebook.com/this-community",
		twitter: "@this-comm",
		instagram: "@this-community",
	},
	upcomingHighlights: [
		"Annual Community Festival - June 15-17",
		"Neighborhood Cleanup Day - May 20",
		"Local Business Showcase - April 25",
	],
	weeklyActivities: [
		{
			day: "Monday",
			activities: ["Senior Yoga (10AM)", "Youth Basketball (4PM)"],
		},
		{
			day: "Wednesday",
			activities: ["Community Garden (9AM)", "Book Club (7PM)"],
		},
		{
			day: "Friday",
			activities: ["Farmers Market (3PM-7PM)", "Movie Night (8PM)"],
		},
		{
			day: "Saturday",
			activities: ["Skills Workshop (11AM)", "Community Potluck (6PM)"],
		},
	],
	resources: [
		{
			name: "Community Center",
			address: "12 ScaleAI Street",
			phone: "(27) 234-5678",
			hours: "Mon-Sat: 8AM-9PM",
		},
		{
			name: "Public Library",
			address: "456 Maple Avenue",
			phone: "(27) 345-6789",
			hours: "Mon-Fri: 9AM-8PM, Sat: 10AM-5PM",
		},
		{
			name: "Recreation Center",
			address: "789 Pine Boulevard",
			phone: "(27) 456-7890",
			hours: "Daily: 6AM-10PM",
		},
		{
			name: "Health Clinic",
			address: "321 Birch Lane",
			phone: "(27) 567-8901",
			hours: "Mon-Fri: 8AM-6PM",
		},
	],
	committees: [
		{
			name: "Events Committee",
			lead: "Sarah Johnson",
			email: "events@this-community.org",
			members: 14,
		},
		{
			name: "Beautification Committee",
			lead: "Michael Chen",
			email: "beautify@this-community.org",
			members: 8,
		},
		{
			name: "Outreach Committee",
			lead: "Aisha Patel",
			email: "outreach@this-community.org",
			members: 12,
		},
		{
			name: "Safety Committee",
			lead: "Robert Williams",
			email: "safety@this-community.org",
			members: 10,
		},
	],
	leaders: [
		{
			name: "Elena Rodriguez",
			role: "Community Council President",
			since: 2021,
		},
		{ name: "David Kim", role: "Community Manager", since: 2018 },
		{ name: "Jamila Washington", role: "Volunteer Coordinator", since: 2020 },
	],
};

const generateSampleEvents = (): Event[] => {
	const now = new Date();

	const pastDate1 = new Date(now);
	pastDate1.setDate(now.getDate() - 15);

	const pastDate2 = new Date(now);
	pastDate2.setDate(now.getDate() - 8);

	const currentDate1 = new Date(now);
	currentDate1.setDate(now.getDate());

	const currentDate2 = new Date(now);
	currentDate2.setDate(now.getDate() + 1);

	const futureDate1 = new Date(now);
	futureDate1.setDate(now.getDate() + 7);

	const futureDate2 = new Date(now);
	futureDate2.setDate(now.getDate() + 14);

	const futureDate3 = new Date(now);
	futureDate3.setDate(now.getDate() + 21);

	const formatDateString = (date: Date): string => {
		return date.toISOString().split("T")[0];
	};

	return [
		{
			id: 1,
			title: "Tech Workshop: Frontend Frameworks",
			date: formatDateString(pastDate1),
			time: "14:00",
			type: "workshop",
			description: "Learn modern web development with React, Vue, and Angular",
			location: "Community Center",
			rsvpCount: 12,
			organizer: "Tech Club",
			tags: ["tech", "coding", "beginners welcome"],
		},
		{
			id: 2,
			title: "Community Coffee Meetup",
			date: formatDateString(pastDate2),
			time: "10:00",
			type: "social",
			description:
				"Casual networking over coffee with your neighbors. A great opportunity to meet new community members and strengthen connections.",
			location: "Brew & Bean Café",
			rsvpCount: 8,
			organizer: "Neighborhood Network",
			tags: ["networking", "casual"],
		},

		{
			id: 3,
			title: "Project Planning Session",
			date: formatDateString(currentDate1),
			time: "16:00",
			type: "meeting",
			description:
				"Strategic planning for Q1 community projects. Help shape our neighborhood initiatives for the coming months.",
			location: "Innovation Hub",
			rsvpCount: 6,
			organizer: "Community Council",
			tags: ["planning", "strategy"],
			featured: true,
		},
		{
			id: 4,
			title: "Weekend Art Exhibition",
			date: formatDateString(currentDate2),
			time: "12:00",
			type: "social",
			description:
				"Featuring works from our local artists. Light refreshments provided.",
			location: "Oakridge Gallery",
			rsvpCount: 14,
			organizer: "Arts Committee",
			tags: ["art", "culture", "family-friendly"],
			featured: true,
		},

		{
			id: 5,
			title: "Neighborhood Cleanup",
			date: formatDateString(futureDate1),
			time: "09:00",
			type: "volunteer",
			description:
				"Join us for our monthly cleanup effort to keep Oakridge beautiful. Supplies will be provided. Wear comfortable clothes.",
			location: "Oakridge Park",
			rsvpCount: 15,
			organizer: "Beautification Committee",
			tags: ["environment", "volunteer", "family-friendly"],
		},
		{
			id: 6,
			title: "Book Club: Monthly Meeting",
			date: formatDateString(futureDate2),
			time: "19:00",
			type: "social",
			description:
				"Discussing 'The Community Builder's Handbook' this month. Newcomers welcome!",
			location: "Oakridge Public Library",
			rsvpCount: 10,
			organizer: "Oakridge Readers",
			tags: ["books", "discussion", "culture"],
		},
		{
			id: 7,
			title: "Community Music Festival",
			date: formatDateString(futureDate3),
			time: "14:00",
			type: "social",
			description:
				"Join us for a day of live music, food, and fun. Local bands and artists will perform. All proceeds go to community projects.",
			location: "Community Center Park",
			rsvpCount: 45,
			organizer: "Arts Committee",
			tags: ["music", "festival", "family-friendly"],
			featured: true,
		},
		{
			id: 8,
			title: "Tech Career Fair",
			date: formatDateString(futureDate1),
			time: "13:00",
			type: "workshop",
			description:
				"Meet with local tech companies and learn about career opportunities in the industry. Resume review services will be available.",
			location: "Innovation Hub",
			rsvpCount: 28,
			organizer: "Tech Club",
			tags: ["career", "networking", "tech"],
		},
	];
};

const eventTypes: EventTypeOption[] = [
	{ value: "all", label: "All Event Types", icon: <Calendar size={16} /> },
	{ value: "workshop", label: "Workshop", icon: <Briefcase size={16} /> },
	{ value: "social", label: "Social", icon: <Coffee size={16} /> },
	{ value: "meeting", label: "Meeting", icon: <Users size={16} /> },
	{ value: "volunteer", label: "Volunteer", icon: <Heart size={16} /> },
	{ value: "other", label: "Other", icon: <Tag size={16} /> },
];

const formatTime = (timeStr: string): string => {
	const [hour, minute] = timeStr.split(":");
	const hourNum = parseInt(hour);
	const ampm = hourNum >= 12 ? "PM" : "AM";
	const hour12 = hourNum % 12 || 12;
	return `${hour12}:${minute} ${ampm}`;
};

const formatDate = (dateStr: string): string => {
	const options: Intl.DateTimeFormatOptions = {
		weekday: "short",
		month: "short",
		day: "numeric",
	};
	return new Date(dateStr).toLocaleDateString("en-US", options);
};

const formatLongDate = (dateStr: string): string => {
	const options: Intl.DateTimeFormatOptions = {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	};
	return new Date(dateStr).toLocaleDateString("en-US", options);
};

const getEventColor = (type: string): EventColor => {
	switch (type) {
		case "workshop":
			return {
				bg: "bg-violet-500",
				light: "bg-violet-100",
				text: "text-violet-800",
				border: "border-violet-300",
				gradient: "from-violet-500 to-purple-600",
			};
		case "social":
			return {
				bg: "bg-emerald-500",
				light: "bg-emerald-100",
				text: "text-emerald-800",
				border: "border-emerald-300",
				gradient: "from-emerald-400 to-teal-600",
			};
		case "meeting":
			return {
				bg: "bg-amber-500",
				light: "bg-amber-100",
				text: "text-amber-800",
				border: "border-amber-300",
				gradient: "from-amber-400 to-orange-600",
			};
		case "volunteer":
			return {
				bg: "bg-blue-500",
				light: "bg-blue-100",
				text: "text-blue-800",
				border: "border-blue-300",
				gradient: "from-blue-400 to-indigo-600",
			};
		default:
			return {
				bg: "bg-indigo-500",
				light: "bg-indigo-100",
				text: "text-indigo-800",
				border: "border-indigo-300",
				gradient: "from-indigo-400 to-purple-600",
			};
	}
};

const getEventTypeIcon = (type: string): React.ReactNode => {
	switch (type) {
		case "workshop":
			return <Briefcase size={18} />;
		case "social":
			return <Coffee size={18} />;
		case "meeting":
			return <Users size={18} />;
		case "volunteer":
			return <Heart size={18} />;
		default:
			return <Calendar size={18} />;
	}
};

const getDaysBetween = (startDate: string, endDate: string): number => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const diffTime = Math.abs(end.getTime() - start.getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const CommunityLogo: React.FC = () => {
	return (
		<motion.div
			className="flex items-center"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
				<Home size={24} />
			</div>
			<div className="ml-3">
				<h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
					THIS Connect
				</h1>
				<p className="text-xs text-gray-500">
					Building community together since {communityInfo.foundedYear}
				</p>
			</div>
		</motion.div>
	);
};

const EventCard: React.FC<{
	event: Event;
	onClick: () => void;
	onRsvp: (id: number) => void;
	isRsvped: boolean;
	isPast?: boolean;
}> = ({ event, onClick, onRsvp, isRsvped, isPast = false }) => {
	const colors = getEventColor(event.type);

	return (
		<motion.div
			className={`p-3 sm:p-4 rounded-xl border ${colors.border} hover:shadow-lg transition-all cursor-pointer mb-4 h-auto flex flex-col bg-white/90 backdrop-blur-sm`}
			onClick={onClick}
			whileHover={{
				scale: 1.02,
				boxShadow:
					"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
			}}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{event.featured && !isPast && (
				<div className="mb-2 flex items-center">
					<span className="text-xs font-semibold px-2 py-0.5 rounded-full text-yellow-700 bg-yellow-100 flex items-center">
						<Star size={12} className="mr-1 text-yellow-600" />
						Featured
					</span>
				</div>
			)}

			<div className="flex justify-between items-start">
				<h3 className="font-semibold text-base sm:text-lg mb-1 text-indigo-600 line-clamp-1">
					{event.title}
				</h3>
				<span
					className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full ${colors.light} ${colors.text} flex items-center ml-1 flex-shrink-0`}
				>
					{getEventTypeIcon(event.type)}
					<span className="ml-1 hidden xs:inline">{event.type}</span>
				</span>
			</div>

			<div className="flex items-center text-xs sm:text-sm text-gray-600 mt-2">
				<Calendar size={14} className="mr-1 text-indigo-600 flex-shrink-0" />
				<span>{formatDate(event.date)}</span>
				<span className="mx-1">•</span>
				<Clock size={14} className="mr-1 text-indigo-600 flex-shrink-0" />
				<span>{formatTime(event.time)}</span>
			</div>

			<div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1">
				<MapPin size={14} className="mr-1 text-indigo-600 flex-shrink-0" />
				<span className="truncate">{event.location}</span>
			</div>

			<p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
				{event.description}
			</p>

			<div className="mt-auto flex justify-between items-center pt-3">
				<div className="text-xs sm:text-sm text-gray-600">
					<span className="font-medium text-indigo-600">{event.rsvpCount}</span>
					attending
				</div>

				<div className="flex gap-1">
					{!isPast && (
						<motion.button
							onClick={(e) => {
								e.stopPropagation();
								onRsvp(event.id);
							}}
							className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-white font-medium text-xs sm:text-sm ${
								isRsvped ? "bg-green-500" : colors.bg
							} transition-all`}
							disabled={isRsvped}
							aria-label={isRsvped ? "Already RSVPed" : "RSVP to this event"}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							{isRsvped ? (
								<span className="flex items-center">
									<Check size={12} className="mr-1" /> RSVPed
								</span>
							) : (
								"RSVP"
							)}
						</motion.button>
					)}

					<motion.button
						onClick={(e) => {
							e.stopPropagation();
							shareEvent(event);
						}}
						className="px-2 py-1 sm:py-1.5 rounded-lg text-white font-medium text-xs sm:text-sm bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Share2 size={12} />
					</motion.button>
				</div>
			</div>

			{event.tags?.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-1 max-h-6 overflow-hidden">
					{event.tags.slice(0, 2).map((tag, idx) => (
						<span
							key={idx}
							className="text-xs px-2 py-0.5 rounded-full bg-gray-100/70 text-gray-700 whitespace-nowrap"
						>
							#{tag}
						</span>
					))}
					{event.tags.length > 2 && (
						<span className="text-xs px-2 py-0.5 rounded-full bg-gray-100/70 text-gray-700">
							+{event.tags.length - 2}
						</span>
					)}
				</div>
			)}
		</motion.div>
	);
};

const FeaturedEventCard: React.FC<{
	event: Event;
	onClick: () => void;
	onRsvp: (id: number) => void;
	isRsvped: boolean;
}> = ({ event, onClick, onRsvp, isRsvped }) => {
	const colors = getEventColor(event.type);

	return (
		<motion.div
			className={`p-4 sm:p-6 rounded-xl border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer mb-6 bg-gradient-to-br ${colors.gradient} text-white`}
			onClick={onClick}
			whileHover={{
				scale: 1.02,
				boxShadow:
					"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
			}}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="flex justify-between items-start">
				<div className="flex items-center">
					<Star size={18} className="mr-2 text-yellow-300" />
					<h3 className="font-bold text-base sm:text-xl">Featured Event</h3>
				</div>
				<span className="capitalize text-xs font-semibold px-2 py-1 rounded-full bg-white/20 flex items-center backdrop-blur-sm">
					{getEventTypeIcon(event.type)}
					<span className="ml-1 hidden sm:inline">{event.type}</span>
				</span>
			</div>

			<h2 className="text-xl sm:text-2xl font-bold mt-3">{event.title}</h2>

			<div className="flex flex-wrap gap-2 sm:gap-4 mt-4">
				<div className="flex items-center">
					<Calendar size={16} className="mr-1 sm:mr-2" />
					<span className="text-sm sm:text-base">{formatDate(event.date)}</span>
				</div>
				<div className="flex items-center">
					<Clock size={16} className="mr-1 sm:mr-2" />
					<span className="text-sm sm:text-base">{formatTime(event.time)}</span>
				</div>
				<div className="flex items-center">
					<MapPin size={16} className="mr-1 sm:mr-2" />
					<span className="text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
						{event.location}
					</span>
				</div>
			</div>

			<p className="mt-4 text-white/90 text-sm sm:text-base line-clamp-2 sm:line-clamp-none">
				{event.description}
			</p>

			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-2 sm:gap-0">
				<div className="flex items-center">
					<Users size={16} className="mr-2" />
					<span className="font-semibold text-sm sm:text-base">
						{event.rsvpCount} attending
					</span>
				</div>

				<div className="flex flex-wrap gap-2 sm:gap-3">
					<motion.button
						onClick={(e) => {
							e.stopPropagation();
							shareEvent(event);
						}}
						className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-medium flex items-center text-sm"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Share2 size={16} className="mr-1 sm:mr-2" />
						Share
					</motion.button>

					<motion.button
						onClick={(e) => {
							e.stopPropagation();
							onRsvp(event.id);
						}}
						className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium flex items-center text-sm ${
							isRsvped ? "bg-green-500 text-white" : "bg-white text-indigo-700"
						}`}
						disabled={isRsvped}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						{isRsvped ? (
							<>
								<Check size={16} className="mr-1 sm:mr-2" />
								RSVPed
							</>
						) : (
							<>
								<Zap size={16} className="mr-1 sm:mr-2" />
								RSVP Now
							</>
						)}
					</motion.button>
				</div>
			</div>

			{event.tags?.length > 0 && (
				<div className="mt-4 flex flex-wrap gap-2">
					{event.tags.slice(0, 3).map((tag, idx) => (
						<span
							key={idx}
							className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm"
						>
							#{tag}
						</span>
					))}
					{event.tags.length > 3 && (
						<span className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
							+{event.tags.length - 3} more
						</span>
					)}
				</div>
			)}
		</motion.div>
	);
};

const ThreeColumnEventView: React.FC<{
	events: Event[];
	onEventClick: (event: Event) => void;
	onRsvp: (id: number) => void;
	rsvps: number[];
}> = ({ events, onEventClick, onRsvp, rsvps }) => {
	const now = new Date();
	const today = now.toISOString().split("T")[0];
	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1);
	const tomorrowStr = tomorrow.toISOString().split("T")[0];

	const pastEvents = events.filter((event) => event.date < today);
	const ongoingEvents = events.filter(
		(event) => event.date === today || event.date === tomorrowStr
	);
	const upcomingEvents = events.filter((event) => event.date > tomorrowStr);

	const featuredEvents = events.filter(
		(event) => event.featured && event.date >= today
	);

	return (
		<div>
			{featuredEvents.length > 0 && (
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center">
						<Award className="mr-2 text-indigo-500" size={24} />
						Featured Events
					</h2>
					{featuredEvents.map((event) => (
						<FeaturedEventCard
							key={event.id}
							event={event}
							onClick={() => onEventClick(event)}
							onRsvp={onRsvp}
							isRsvped={rsvps.includes(event.id)}
						/>
					))}
				</motion.div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<motion.div
					className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center mb-4">
						<TicketX className="text-red-600 mr-2" size={20} />
						<h2 className="text-lg font-bold text-gray-500">Past Events</h2>
					</div>
					<div className="overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
						{pastEvents.length === 0 ? (
							<div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-gray-200">
								<Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
								<p>No past events</p>
							</div>
						) : (
							pastEvents.map((event) => (
								<EventCard
									key={event.id}
									event={event}
									onClick={() => onEventClick(event)}
									onRsvp={onRsvp}
									isRsvped={true}
									isPast={true}
								/>
							))
						)}
					</div>
				</motion.div>

				<motion.div
					className="bg-white p-6 rounded-xl shadow-md border-2 border-indigo-200 relative overflow-hidden"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 z-0 opacity-70"></div>
					<div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-full -ml-12 -mb-12 z-0 opacity-70"></div>

					<div className="relative z-10">
						<div className="flex items-center mb-4">
							<Activity className="text-indigo-600 mr-2" size={20} />
							<h2 className="text-lg font-bold text-indigo-600">
								Happening Now
							</h2>
						</div>
						<div className="overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
							{ongoingEvents.length === 0 ? (
								<div className="text-center py-8 text-gray-400 bg-indigo-50 rounded-lg border border-indigo-100">
									<Activity className="w-10 h-10 mx-auto mb-2 opacity-60 text-indigo-300" />
									<p>No current events</p>
								</div>
							) : (
								ongoingEvents.map((event) => (
									<EventCard
										key={event.id}
										event={event}
										onClick={() => onEventClick(event)}
										onRsvp={onRsvp}
										isRsvped={rsvps.includes(event.id)}
									/>
								))
							)}
						</div>
					</div>
				</motion.div>

				<motion.div
					className="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative overflow-hidden"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0"></div>

					<div className="relative z-10">
						<div className="flex items-center mb-4">
							<SquarePlus className="text-green-600 mr-2" size={20} />
							<h2 className="text-lg font-bold text-indigo-500">
								Upcoming Events
							</h2>
						</div>
						<div className="overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
							{upcomingEvents.length === 0 ? (
								<div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-gray-200">
									<Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
									<p>No upcoming events</p>
								</div>
							) : (
								upcomingEvents.map((event) => (
									<EventCard
										key={event.id}
										event={event}
										onClick={() => onEventClick(event)}
										onRsvp={onRsvp}
										isRsvped={rsvps.includes(event.id)}
									/>
								))
							)}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

const EventForm: React.FC<{
	event: Partial<Event>;
	setEvent: React.Dispatch<React.SetStateAction<any>>;
	onSubmit: () => void;
	onCancel: () => void;
	onDelete?: () => void;
}> = ({ event, setEvent, onSubmit, onCancel, onDelete }) => {
	const [tagInput, setTagInput] = useState("");

	const addTag = () => {
		if (
			tagInput.trim() &&
			(!event.tags || !event.tags.includes(tagInput.trim()))
		) {
			setEvent((prev: any) => ({
				...prev,
				tags: [...(prev.tags || []), tagInput.trim()],
			}));
			setTagInput("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setEvent((prev: any) => ({
			...prev,
			tags: prev.tags?.filter((tag: string) => tag !== tagToRemove) || [],
		}));
	};

	const handleFeaturedToggle = () => {
		setEvent((prev: any) => ({
			...prev,
			featured: !prev.featured,
		}));
	};

	return (
		<motion.div
			className="space-y-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div>
				<label
					className="block text-sm font-medium mb-1 text-gray-700"
					htmlFor="event-title"
				>
					Title <span className="text-red-500">*</span>
				</label>
				<input
					id="event-title"
					type="text"
					placeholder="Event title"
					className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none border-gray-300 transition-all"
					value={event.title || ""}
					onChange={(e) =>
						setEvent((prev: any) => ({ ...prev, title: e.target.value }))
					}
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label
						className="block text-sm font-medium mb-1 flex items-center text-gray-700"
						htmlFor="event-date"
					>
						<Calendar size={14} className="mr-1 text-indigo-500" />
						Date <span className="text-red-500 ml-1">*</span>
					</label>
					<input
						id="event-date"
						type="date"
						className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none border-gray-300 transition-all"
						value={event.date || ""}
						onChange={(e) =>
							setEvent((prev: any) => ({ ...prev, date: e.target.value }))
						}
					/>
				</div>

				<div>
					<label
						className="block text-sm font-medium mb-1 flex items-center text-gray-700"
						htmlFor="event-time"
					>
						<Clock size={14} className="mr-1 text-indigo-500" />
						Time <span className="text-red-500 ml-1">*</span>
					</label>
					<input
						id="event-time"
						type="time"
						className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none border-gray-300 transition-all"
						value={event.time || ""}
						onChange={(e) =>
							setEvent((prev: any) => ({ ...prev, time: e.target.value }))
						}
					/>
				</div>
			</div>

			<div>
				<label
					className="block text-sm font-medium mb-1 text-gray-700 flex items-center"
					id="event-type-label"
				>
					<Tag size={14} className="mr-1 text-indigo-500" />
					Event Type <span className="text-red-500 ml-1">*</span>
				</label>
				<select
					className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none border-gray-300 transition-all bg-white"
					value={event.type || ""}
					onChange={(e) =>
						setEvent((prev: any) => ({ ...prev, type: e.target.value }))
					}
					aria-labelledby="event-type-label"
				>
					<option value="" disabled>
						Select Event Type
					</option>
					{eventTypes.slice(1).map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
			</div>

			<div>
				<label
					className="block text-sm font-medium mb-1 flex items-center text-gray-700"
					htmlFor="event-organizer"
				>
					<User size={14} className="mr-1 text-indigo-500" />
					Organizer
				</label>
				<input
					id="event-organizer"
					type="text"
					placeholder="Who is organizing this event?"
					className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none border-gray-300 transition-all"
					value={event.organizer || ""}
					onChange={(e) =>
						setEvent((prev: any) => ({ ...prev, organizer: e.target.value }))
					}
				/>
			</div>

			<div>
				<label
					className="block text-sm font-medium mb-1 flex items-center text-gray-700"
					htmlFor="event-location"
				>
					<MapPin size={14} className="mr-1 text-indigo-500" />
					Location
				</label>
				<input
					id="event-location"
					type="text"
					placeholder="Event location"
					className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none border-gray-300 transition-all"
					value={event.location || ""}
					onChange={(e) =>
						setEvent((prev: any) => ({ ...prev, location: e.target.value }))
					}
				/>
			</div>

			<div>
				<label
					className="block text-sm font-medium mb-1 flex items-center text-gray-700"
					htmlFor="event-description"
				>
					<Info size={14} className="mr-1 text-indigo-500" />
					Description
				</label>
				<textarea
					id="event-description"
					placeholder="Event description"
					className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none border-gray-300 transition-all"
					value={event.description || ""}
					onChange={(e) =>
						setEvent((prev: any) => ({ ...prev, description: e.target.value }))
					}
					rows={3}
				></textarea>
			</div>

			<div>
				<label
					className="block text-sm font-medium mb-1 flex items-center text-gray-700"
					htmlFor="event-tag"
				>
					<Tag size={14} className="mr-1 text-indigo-500" />
					Tags
				</label>
				<div className="flex">
					<input
						id="event-tag"
						type="text"
						placeholder="Add a tag"
						className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-indigo-400 outline-none border-gray-300 transition-all"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addTag();
							}
						}}
					/>
					<motion.button
						type="button"
						onClick={addTag}
						className="px-4 py-3 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 flex items-center transition-all"
						aria-label="Add tag"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Plus size={16} className="mr-1" />
						Add
					</motion.button>
				</div>

				{event.tags && event.tags.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-3">
						{event.tags.map((tag, idx) => (
							<div
								key={idx}
								className="flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 animate-fade-in"
							>
								<span className="mr-1">#{tag}</span>
								<button
									type="button"
									onClick={() => removeTag(tag)}
									className="text-sm hover:text-red-500 transition-colors"
									aria-label={`Remove tag ${tag}`}
								>
									<X size={12} />
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="mt-4 flex items-center">
				<input
					type="checkbox"
					id="event-featured"
					className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
					checked={event.featured || false}
					onChange={handleFeaturedToggle}
				/>
				<label
					htmlFor="event-featured"
					className="ml-2 text-sm text-gray-700 flex items-center"
				>
					<Star size={14} className="mr-1 text-yellow-500" />
					Mark as featured event
				</label>
			</div>

			<div className="flex gap-3 justify-end pt-4">
				<motion.button
					onClick={onCancel}
					className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center transition-all"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<X size={16} className="mr-2" />
					Cancel
				</motion.button>

				<motion.button
					onClick={onSubmit}
					className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center transition-all"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Check size={16} className="mr-2" />
					{event.id ? "Update" : "Add"} Event
				</motion.button>
			</div>

			{event.id && onDelete && (
				<motion.button
					onClick={onDelete}
					className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full flex items-center justify-center transition-all"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<Trash2 size={16} className="mr-2" />
					Delete Event
				</motion.button>
			)}
		</motion.div>
	);
};

const CalendarCell: React.FC<{
	day: number;
	dateStr: string;
	events: Event[];
	isSelected: boolean;
	isToday: boolean;
	onClick: (dateStr: string) => void;
}> = ({ day, dateStr, events, isSelected, isToday, onClick }) => {
	const dayEvents = events.filter((event) => event.date === dateStr);
	const hasFeaturedEvent = dayEvents.some((event) => event.featured);

	return (
		<motion.div
			onClick={() => onClick(dateStr)}
			className={`min-h-16 sm:min-h-24 border p-1 relative cursor-pointer transition-all 
      ${
				isSelected
					? "border-indigo-500 bg-indigo-50 shadow-sm"
					: isToday
					? "border-indigo-400 bg-indigo-50/50"
					: hasFeaturedEvent
					? "border-yellow-300 bg-yellow-50/30"
					: dayEvents.length > 0
					? "border-indigo-200 bg-indigo-50/20"
					: "border-gray-200 bg-white"
			}`}
			whileHover={{
				scale: 1.02,
				zIndex: 10,
				boxShadow:
					"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
			}}
			animate={{ scale: isSelected ? 1.02 : 1 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex items-center justify-between m-1 sm:m-2">
				<div
					className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full
          ${isToday ? "bg-indigo-500" : isSelected ? "bg-indigo-200" : ""}`}
				>
					<span
						className={`text-sm sm:text-base font-medium
            ${isSelected && !isToday ? "text-indigo-700" : ""}
            ${isToday ? "text-white" : ""}`}
					>
						{day}
					</span>
				</div>
				{dayEvents.length > 0 && (
					<span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500 text-white font-semibold flex items-center">
						{dayEvents.length}
					</span>
				)}
				{hasFeaturedEvent && (
					<span className="absolute top-1 right-1 text-yellow-500">
						<Star size={12} fill="currentColor" />
					</span>
				)}
			</div>

			<div className="mt-1 space-y-1 overflow-hidden max-h-8 sm:max-h-16 hidden sm:block">
				{dayEvents.slice(0, 2).map((event, idx) => {
					const colors = getEventColor(event.type);
					return (
						<div
							key={idx}
							className={`text-xs truncate rounded px-1 py-0.5 ${
								event.featured ? "border-l-2 border-yellow-400" : ""
							} ${colors.light} ${colors.text} flex items-center`}
						>
							<span className="w-2 h-2 rounded-full mr-1 bg-indigo-500"></span>
							<span className="truncate">{event.title}</span>
						</div>
					);
				})}
				{dayEvents.length > 2 && (
					<div className="text-xs text-indigo-600 font-medium">
						+{dayEvents.length - 2} more
					</div>
				)}
			</div>
		</motion.div>
	);
};

const ToastNotification: React.FC<{
	toast: ToastProps;
	onClose: () => void;
}> = ({ toast, onClose }) => {
	const { open, message, type = "success" } = toast;

	const getBgColor = () => {
		switch (type) {
			case "success":
				return "bg-green-500";
			case "error":
				return "bg-red-500";
			case "info":
				return "bg-blue-500";
			default:
				return "bg-green-500";
		}
	};

	const getIcon = () => {
		switch (type) {
			case "success":
				return <Check className="w-5 h-5 mr-2" />;
			case "error":
				return <X className="w-5 h-5 mr-2" />;
			case "info":
				return <Info className="w-5 h-5 mr-2" />;
			default:
				return <Check className="w-5 h-5 mr-2" />;
		}
	};

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className={`fixed top-4 right-4 z-50 ${getBgColor()} text-white p-3 rounded-lg shadow-lg flex items-center`}
					initial={{ opacity: 0, y: -20, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -20, scale: 0.8 }}
					transition={{ duration: 0.3 }}
				>
					{getIcon()}
					<div className="flex-1">{message}</div>
					<button
						onClick={onClose}
						className="ml-3 text-white/80 hover:text-white"
						aria-label="Close notification"
					>
						<X size={16} />
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
const NotificationsPanel: React.FC<{
	notifications: Notification[];
	isOpen: boolean;
	onClose: () => void;
	onMarkAllRead: () => void;
	onNotificationClick: (notification: Notification) => void;
}> = ({
	notifications,
	isOpen,
	onClose,
	onMarkAllRead,
	onNotificationClick,
}) => {
	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="absolute right-0 top-0 w-full h-full max-w-full sm:max-w-md sm:right-4 sm:top-16 sm:h-auto bg-white rounded-xl shadow-xl overflow-hidden"
						initial={{ opacity: 0, x: 300 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 300 }}
						transition={{ duration: 0.2 }}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-bold flex items-center">
									<Bell size={18} className="mr-2" />
									Notifications
									{unreadCount > 0 && (
										<span className="ml-2 px-2 py-0.5 bg-white text-indigo-600 text-xs font-bold rounded-full">
											{unreadCount}
										</span>
									)}
								</h2>
								<button
									onClick={onClose}
									className="p-1 rounded-full hover:bg-white/20 transition-colors"
									aria-label="Close notifications"
								>
									<X size={18} />
								</button>
							</div>
						</div>

						<div className="divide-y max-h-[70vh] sm:max-h-96 overflow-y-auto custom-scrollbar">
							{notifications.length === 0 ? (
								<div className="p-6 text-center text-gray-500">
									<Bell size={32} className="mx-auto mb-2 text-gray-300" />
									<p>No notifications yet</p>
								</div>
							) : (
								<>
									{notifications.map((notification) => (
										<NotificationItem
											key={notification.id}
											notification={notification}
											onClick={onNotificationClick}
										/>
									))}
								</>
							)}
						</div>

						{notifications.length > 0 && (
							<div className="p-3 border-t border-gray-100 flex justify-between items-center bg-gray-50 sticky bottom-0">
								<button
									onClick={onMarkAllRead}
									className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
								>
									Mark all as read
								</button>
								<button className="text-sm text-gray-500 hover:text-gray-700">
									View all
								</button>
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
	return (
		<motion.div
			className="absolute -top-1 -right-1 z-10"
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: "spring", stiffness: 500, damping: 15 }}
		>
			<motion.div
				className="absolute w-full h-full rounded-full bg-red-400 opacity-40"
				animate={{
					scale: [1, 1.5, 1],
				}}
				transition={{
					repeat: Infinity,
					duration: 2,
					ease: "easeInOut",
				}}
			/>
			<div className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
				{count > 9 ? "9+" : count}
			</div>
		</motion.div>
	);
};
const getNotificationIcon = (type: string) => {
	switch (type) {
		case "event":
			return <Calendar size={16} className="text-indigo-500" />;
		case "rsvp":
			return <Check size={16} className="text-green-500" />;
		case "community":
			return <Users size={16} className="text-blue-500" />;
		case "announcement":
			return <Bell size={16} className="text-yellow-500" />;
		default:
			return <Info size={16} className="text-indigo-500" />;
	}
};
const NotificationPopup: React.FC<{
	notification: Notification | null;
	onClose: () => void;
}> = ({ notification, onClose }) => {
	if (!notification) return null;

	const getIconBackground = (type: string) => {
		switch (type) {
			case "event":
				return "bg-indigo-100";
			case "rsvp":
				return "bg-green-100";
			case "community":
				return "bg-blue-100";
			case "announcement":
				return "bg-yellow-100";
			default:
				return "bg-indigo-100";
		}
	};

	const getIcon = (type: string) => {
		const icon = getNotificationIcon(type);
		return React.cloneElement(icon, {
			size: 18,
			className: icon.props.className.replace("16", "18"),
		});
	};

	return (
		<motion.div
			className="fixed top-4 right-4 max-w-xs sm:max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 flex items-start"
			initial={{ opacity: 0, y: -50, x: 20 }}
			animate={{ opacity: 1, y: 0, x: 0 }}
			exit={{ opacity: 0, y: -50, x: 20 }}
			transition={{ type: "spring", damping: 15 }}
		>
			<div
				className={`${getIconBackground(
					notification.type
				)} p-2 rounded-full mr-3 flex-shrink-0`}
			>
				{getIcon(notification.type)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex justify-between items-start">
					<h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate pr-2">
						{notification.title}
					</h3>
					<button
						onClick={onClose}
						className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
					>
						<X size={16} />
					</button>
				</div>
				<p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
					{notification.message}
				</p>
				<div className="text-xs text-gray-500 mt-1">{notification.time}</div>
			</div>
		</motion.div>
	);
};
const NotificationItem: React.FC<{
	notification: Notification;
	onClick: (notification: Notification) => void;
}> = ({ notification, onClick }) => {
	const getBackgroundColor = (type: string, read: boolean) => {
		if (read) return "bg-white hover:bg-indigo-50";

		switch (type) {
			case "event":
				return "bg-indigo-50/80 hover:bg-indigo-100/80";
			case "rsvp":
				return "bg-green-50/80 hover:bg-green-100/80";
			case "community":
				return "bg-blue-50/80 hover:bg-blue-100/80";
			case "announcement":
				return "bg-yellow-50/80 hover:bg-yellow-100/80";
			default:
				return "bg-indigo-50/80 hover:bg-indigo-100/80";
		}
	};

	const getBorderColor = (type: string) => {
		switch (type) {
			case "event":
				return "border-l-indigo-500";
			case "rsvp":
				return "border-l-green-500";
			case "community":
				return "border-l-blue-500";
			case "announcement":
				return "border-l-yellow-500";
			default:
				return "border-l-indigo-500";
		}
	};

	return (
		<motion.div
			className={`p-3 sm:p-4 cursor-pointer transition-all ${getBackgroundColor(
				notification.type,
				notification.read
			)} border-l-4 ${getBorderColor(notification.type)}`}
			onClick={() => onClick(notification)}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ x: 5 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex">
				<div className="mr-3 mt-0.5">
					<div className={`p-1.5 sm:p-2 rounded-full bg-white shadow-sm`}>
						{getNotificationIcon(notification.type)}
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
						<span className="truncate">{notification.title}</span>
						{!notification.read && (
							<span className="ml-2 w-2 h-2 flex-shrink-0 rounded-full bg-indigo-500"></span>
						)}
					</h3>
					<p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
						{notification.message}
					</p>
					<div className="text-xs text-gray-500 mt-2 flex items-center">
						<Clock size={12} className="mr-1 flex-shrink-0" />
						{notification.time}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

const generateSampleNotifications = (): Notification[] => {
	return [
		{
			id: "1",
			title: "New Event: Community Festival",
			message: "The Annual Community Festival has been added to the calendar.",
			time: "2 hours ago",
			read: false,
			type: "event",
		},
		{
			id: "2",
			title: "RSVP Confirmed",
			message:
				'Your RSVP for "Tech Workshop: Frontend Frameworks" is confirmed.',
			time: "1 day ago",
			read: true,
			type: "rsvp",
		},
		{
			id: "3",
			title: "Volunteer Opportunity",
			message:
				"We need volunteers for the upcoming Neighborhood Cleanup event.",
			time: "2 days ago",
			read: false,
			type: "announcement",
		},
		{
			id: "4",
			title: "Committee Meeting Changed",
			message:
				"The Events Committee meeting has been moved to Thursday at 7 PM.",
			time: "3 days ago",
			read: true,
			type: "community",
		},
		{
			id: "5",
			title: "New Members Joined",
			message: "5 new members joined our community this week!",
			time: "4 days ago",
			read: true,
			type: "community",
		},
	];
};
const AboutCommunity: React.FC = () => {
	const [resourcesOpen, setResourcesOpen] = useState(false);
	const [committeesOpen, setCommitteesOpen] = useState(false);
	const [activitiesOpen, setActivitiesOpen] = useState(false);
	const [leadersOpen, setLeadersOpen] = useState(false);

	return (
		<motion.div
			className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-indigo-700">
					About {communityInfo.name}
				</h2>
				<div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
					<Home size={22} />
				</div>
			</div>

			<div className="mb-6">
				<p className="text-gray-700 leading-relaxed">
					{communityInfo.description}
				</p>
				<motion.div
					className="text-gray-700 leading-relaxed mt-4 italic border-l-4 border-indigo-300 pl-4 py-2 bg-indigo-50/50 rounded-r-lg"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					{communityInfo.mission}
				</motion.div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
					<motion.div
						className="flex items-center text-sm text-gray-600 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
						whileHover={{
							scale: 1.02,
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
						}}
					>
						<Calendar size={18} className="mr-2 text-indigo-600" />
						<span>
							Founded: <strong>{communityInfo.foundedYear}</strong>
						</span>
					</motion.div>
					<motion.div
						className="flex items-center text-sm text-gray-600 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
						whileHover={{
							scale: 1.02,
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
						}}
					>
						<Users size={18} className="mr-2 text-indigo-600" />
						<span>
							Population:
							<strong>{communityInfo.population.toLocaleString()}</strong>
						</span>
					</motion.div>
					<motion.div
						className="flex items-center text-sm text-gray-600 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
						whileHover={{
							scale: 1.02,
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
						}}
					>
						<MapPin size={18} className="mr-2 text-indigo-600" />
						<span>
							<strong>{communityInfo.location}</strong>
						</span>
					</motion.div>
					<motion.div
						className="flex items-center text-sm text-gray-600 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
						whileHover={{
							scale: 1.02,
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
						}}
					>
						<Globe size={18} className="mr-2 text-indigo-600" />
						<span>
							<strong>{communityInfo.website}</strong>
						</span>
					</motion.div>
				</div>
			</div>

			<div className="mb-8">
				<h3 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center">
					<Zap size={18} className="mr-2" />
					Upcoming Highlights
				</h3>
				<div className="space-y-3">
					{communityInfo.upcomingHighlights.map((item, idx) => (
						<motion.div
							key={idx}
							className="flex items-start p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: idx * 0.1 }}
							whileHover={{ scale: 1.02, x: 5 }}
						>
							<Activity size={18} className="mr-3 text-indigo-600 mt-0.5" />
							<span className="text-gray-700">{item}</span>
						</motion.div>
					))}
				</div>
			</div>

			<div className="space-y-4">
				<motion.div
					className="border border-indigo-100 rounded-xl overflow-hidden bg-white shadow-sm"
					whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
				>
					<button
						className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all"
						onClick={() => setActivitiesOpen(!activitiesOpen)}
					>
						<h3 className="text-lg font-semibold text-indigo-600 flex items-center">
							<Activity size={18} className="mr-2" />
							Weekly Activities
						</h3>
						<motion.div
							animate={{ rotate: activitiesOpen ? 180 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<ChevronDown size={18} className="text-indigo-600" />
						</motion.div>
					</button>
					<AnimatePresence>
						{activitiesOpen && (
							<motion.div
								className="p-4"
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="space-y-4 mt-2">
									{communityInfo.weeklyActivities.map((day, idx) => (
										<motion.div
											key={idx}
											className="border-l-2 border-indigo-300 pl-4 py-2"
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: idx * 0.1 }}
										>
											<h4 className="font-medium text-indigo-600">{day.day}</h4>
											<ul className="mt-2 space-y-2">
												{day.activities.map((activity, activityIdx) => (
													<li
														key={activityIdx}
														className="text-sm text-gray-600 flex items-center"
													>
														<Activity
															size={14}
															className="mr-2 text-indigo-500"
														/>
														<span>{activity}</span>
													</li>
												))}
											</ul>
										</motion.div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				<motion.div
					className="border border-indigo-100 rounded-xl overflow-hidden bg-white shadow-sm"
					whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
				>
					<button
						className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all"
						onClick={() => setResourcesOpen(!resourcesOpen)}
					>
						<h3 className="text-lg font-semibold text-indigo-600 flex items-center">
							<Book size={18} className="mr-2" />
							Community Resources
						</h3>
						<motion.div
							animate={{ rotate: resourcesOpen ? 180 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<ChevronDown size={18} className="text-indigo-600" />
						</motion.div>
					</button>
					<AnimatePresence>
						{resourcesOpen && (
							<motion.div
								className="p-4"
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
									{communityInfo.resources.map((resource, idx) => (
										<motion.div
											key={idx}
											className="border border-indigo-100 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: idx * 0.1 }}
											whileHover={{ scale: 1.02 }}
										>
											<h4 className="font-medium text-indigo-600 mb-2">
												{resource.name}
											</h4>
											<div className="text-sm text-gray-600">
												<div className="flex items-center mt-2">
													<MapPin size={14} className="mr-1 text-indigo-500" />
													<span>{resource.address}</span>
												</div>
												<div className="flex items-center mt-2">
													<Phone size={14} className="mr-1 text-indigo-500" />
													<span>{resource.phone}</span>
												</div>
												<div className="flex items-center mt-2">
													<Clock size={14} className="mr-1 text-indigo-500" />
													<span>{resource.hours}</span>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				<motion.div
					className="border border-indigo-100 rounded-xl overflow-hidden bg-white shadow-sm"
					whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
				>
					<button
						className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all"
						onClick={() => setCommitteesOpen(!committeesOpen)}
					>
						<h3 className="text-lg font-semibold text-indigo-600 flex items-center">
							<Users size={18} className="mr-2" />
							Community Committees
						</h3>
						<motion.div
							animate={{ rotate: committeesOpen ? 180 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<ChevronDown size={18} className="text-indigo-600" />
						</motion.div>
					</button>
					<AnimatePresence>
						{committeesOpen && (
							<motion.div
								className="p-4"
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
									{communityInfo.committees.map((committee, idx) => (
										<motion.div
											key={idx}
											className="border border-indigo-100 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: idx * 0.1 }}
											whileHover={{ scale: 1.02 }}
										>
											<h4 className="font-medium text-indigo-600 mb-2">
												{committee.name}
											</h4>
											<div className="text-sm text-gray-600">
												<div className="flex items-center mt-2">
													<User size={14} className="mr-1 text-indigo-500" />
													<span>Lead: {committee.lead}</span>
												</div>
												<div className="flex items-center mt-2">
													<Mail size={14} className="mr-1 text-indigo-500" />
													<span>{committee.email}</span>
												</div>
												<div className="flex items-center mt-2">
													<Users size={14} className="mr-1 text-indigo-500" />
													<span>{committee.members} members</span>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				<motion.div
					className="border border-indigo-100 rounded-xl overflow-hidden bg-white shadow-sm"
					whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
				>
					<button
						className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all"
						onClick={() => setLeadersOpen(!leadersOpen)}
					>
						<h3 className="text-lg font-semibold text-indigo-600 flex items-center">
							<Award size={18} className="mr-2" />
							Community Leadership
						</h3>
						<motion.div
							animate={{ rotate: leadersOpen ? 180 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<ChevronDown size={18} className="text-indigo-600" />
						</motion.div>
					</button>
					<AnimatePresence>
						{leadersOpen && (
							<motion.div
								className="p-4"
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
									{communityInfo.leaders.map((leader, idx) => (
										<motion.div
											key={idx}
											className="border border-indigo-100 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: idx * 0.1 }}
											whileHover={{ scale: 1.02 }}
										>
											<h4 className="font-medium text-indigo-600 mb-2">
												{leader.name}
											</h4>
											<div className="text-sm text-gray-600">
												<div className="flex items-center mt-2">
													<Briefcase
														size={14}
														className="mr-1 text-indigo-500"
													/>
													<span>{leader.role}</span>
												</div>
												<div className="flex items-center mt-2">
													<Calendar
														size={14}
														className="mr-1 text-indigo-500"
													/>
													<span>Since {leader.since}</span>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</motion.div>
	);
};

const shareEvent = (event: Event) => {
	const eventText = `${event.title} - ${formatDate(event.date)} ${formatTime(
		event.time
	)} @ ${event.location}`;

	try {
		if (navigator.share) {
			navigator
				.share({
					title: event.title,
					text: `Join us for: ${eventText}`,
					url: window.location.href,
				})
				.then(() => {
					return true;
				})
				.catch((error) => {
					if (error.name === "AbortError") {
						console.log("Share cancelled by user");
						return true;
					}

					console.error("Error sharing event:", error);
					return false;
				});

			return true;
		} else {
			navigator.clipboard.writeText(eventText);
			return true;
		}
	} catch (error) {
		console.error("Error sharing event:", error);
		return false;
	}
};

const RemindersSection: React.FC<{
	events: Event[];
	onEventClick: (event: Event) => void;
}> = ({ events, onEventClick }) => {
	const today = new Date();
	const upcomingEvents = events
		.filter((event) => new Date(event.date) > today)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 3);

	if (upcomingEvents.length === 0) return null;

	return (
		<motion.div
			className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 border border-indigo-100"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex items-center mb-3">
				<Bell className="text-indigo-500 mr-2 flex-shrink-0" size={18} />
				<h2 className="text-base sm:text-lg font-bold text-indigo-700">
					Upcoming Reminders
				</h2>
			</div>
			<div className="space-y-2 sm:space-y-3">
				{upcomingEvents.map((event) => {
					const daysUntil = getDaysBetween(
						today.toISOString().split("T")[0],
						event.date
					);
					const colors = getEventColor(event.type);

					return (
						<motion.div
							key={event.id}
							className="flex items-center p-2 sm:p-3 rounded-lg border border-gray-100 hover:border-indigo-200 bg-gray-50 hover:bg-white cursor-pointer transition-all"
							onClick={() => onEventClick(event)}
							whileHover={{ scale: 1.02, x: 5 }}
						>
							<div
								className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${colors.bg} text-white mr-2 sm:mr-3 flex-shrink-0`}
							>
								{getEventTypeIcon(event.type)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="font-medium text-gray-800 text-sm sm:text-base truncate">
									{event.title}
								</div>
								<div className="text-xs sm:text-sm text-gray-500 flex items-center">
									<Calendar size={12} className="mr-1 flex-shrink-0" />
									<span className="truncate">
										{formatDate(event.date)} at {formatTime(event.time)}
									</span>
								</div>
							</div>
							<div className="text-right ml-2 flex-shrink-0">
								<div
									className={`text-xs sm:text-sm font-semibold ${
										daysUntil <= 3 ? "text-red-500" : "text-indigo-500"
									}`}
								>
									{daysUntil === 0
										? "Today"
										: daysUntil === 1
										? "Tomorrow"
										: `In ${daysUntil} days`}
								</div>
								<div className="text-xs text-gray-500 hidden xs:block truncate max-w-[100px]">
									{event.location}
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
};

const CommunityConnectHub: React.FC = () => {
	const today = new Date();
	const todayStr = today.toISOString().split("T")[0];
	const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
	const rsvpSoundRef = useRef<HTMLAudioElement | null>(null);
	const [events, setEvents] = useState<Event[]>(generateSampleEvents());
	const [timelineFilter, setTimelineFilter] = useState<
		"past" | "today" | "future" | "all"
	>("all");
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [filterType, setFilterType] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [rsvps, setRsvps] = useState<number[]>([]);
	const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
	const [newEvent, setNewEvent] = useState<Partial<Event>>({
		title: "",
		date: new Date().toISOString().split("T")[0],
		time: "",
		type: "",
		description: "",
		location: "",
		organizer: "",
		tags: [],
	});
	const [editEvent, setEditEvent] = useState<Event | null>(null);
	const [selectedDate, setSelectedDate] = useState<string>(todayStr);
	const [calendarMonth, setCalendarMonth] = useState<Date>(today);
	const [toast, setToast] = useState<ToastProps>({ open: false, message: "" });
	const [activeTab, setActiveTab] = useState<string>("list");
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [notifications, setNotifications] = useState<Notification[]>(
		generateSampleNotifications()
	);
	const [newNotificationPopup, setNewNotificationPopup] =
		useState<Notification | null>(null);

	const [isNotificationsOpen, setIsNotificationsOpen] =
		useState<boolean>(false);
	const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

	const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
		calendarMonth
	);
	const currentYear = calendarMonth.getFullYear();
	const currentMonth = calendarMonth.getMonth();
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

	const prevMonth = () =>
		setCalendarMonth(new Date(currentYear, currentMonth - 1));
	const nextMonth = () =>
		setCalendarMonth(new Date(currentYear, currentMonth + 1));
	const goToToday = () => {
		const today = new Date();
		setCalendarMonth(today);
		const todayStr = today.toISOString().split("T")[0];
		setSelectedDate(todayStr);
	};
	const handleNotificationClick = (notification: Notification) => {
		setNotifications(
			notifications.map((n) =>
				n.id === notification.id ? { ...n, read: true } : n
			)
		);

		if (notification.type === "event") {
			const eventId = parseInt(notification.id);
			const event = events.find((e) => e.id === eventId);
			if (event) {
				setSelectedEvent(event);
			}
		}

		setIsNotificationsOpen(false);
	};

	const handleMarkAllNotificationsAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
	};

	const addNotification = (
		title: string,
		message: string,
		type: "event" | "rsvp" | "community" | "announcement"
	) => {
		const newNotification: Notification = {
			id: Date.now().toString(),
			title,
			message,
			time: "just now",
			read: false,
			type,
		};

		setNotifications([newNotification, ...notifications]);

		setNewNotificationPopup(newNotification);

		setTimeout(() => {
			setNewNotificationPopup(null);
		}, 5000);
	};
	const handleRSVP = (eventId: number) => {
		if (!rsvps.includes(eventId)) {
			setRsvps([...rsvps, eventId]);
			setEvents(
				events.map((event) =>
					event.id === eventId
						? { ...event, rsvpCount: event.rsvpCount + 1 }
						: event
				)
			);

			const event = events.find((e) => e.id === eventId);
			if (event) {
				addNotification(
					"RSVP Confirmed",
					`You are now attending "${event.title}"`,
					"rsvp"
				);
			}

			showToast("RSVP confirmed! You're all set.");
		}
	};

	const handleShareEvent = (event: Event) => {
		const result = shareEvent(event);

		if (result && !navigator.share) {
			showToast("Event details copied to clipboard!");
		} else if (!result) {
			showToast("Couldn't share event. Please try again.", "error");
		}
	};

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "success"
	) => {
		setToast({ open: true, message, type });
		setTimeout(() => setToast({ open: false, message: "" }), 3000);
	};

	const addEvent = () => {
		if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.type) {
			showToast("Please fill all required fields", "error");
			return;
		}

		const eventToAdd: Event = {
			...(newEvent as Event),
			id: Date.now(),
			rsvpCount: 0,
			description: newEvent.description || "",
			location: newEvent.location || "",
			tags: newEvent.tags || [],
			organizer: newEvent.organizer || "Community Member",
		};

		setEvents([...events, eventToAdd]);
		setIsAddingEvent(false);
		setNewEvent();

		addNotification(
			"New Event Added",
			`"${eventToAdd.title}" has been added to the calendar`,
			"event"
		);

		showToast("Event added successfully");
	};

	const updateEvent = () => {
		if (!editEvent) return;
		if (
			!editEvent.title ||
			!editEvent.date ||
			!editEvent.time ||
			!editEvent.type
		) {
			showToast("Please fill all required fields", "error");
			return;
		}

		setEvents(events.map((e) => (e.id === editEvent.id ? editEvent : e)));
		setEditEvent(null);

		addNotification(
			"Event Updated",
			`"${editEvent.title}" has been updated`,
			"event"
		);

		showToast("Event updated successfully");
	};

	const deleteEvent = (id: number) => {
		if (window.confirm("Are you sure you want to delete this event?")) {
			setEvents(events.filter((e) => e.id !== id));
			setEditEvent(null);
			showToast("Event deleted successfully");
		}
	};

	const filteredEvents = events.filter((event) => {
		const now = new Date();
		const today = now.toISOString().split("T")[0];
		const tomorrow = new Date(now);
		tomorrow.setDate(now.getDate() + 1);
		const tomorrowStr = tomorrow.toISOString().split("T")[0];

		const timelineMatch =
			timelineFilter === "past"
				? event.date < today
				: timelineFilter === "today"
				? event.date === today || event.date === tomorrowStr
				: timelineFilter === "future"
				? event.date > tomorrowStr
				: true;

		const typeMatch =
			filterType && filterType !== "all" ? event.type === filterType : true;

		const searchMatch = searchTerm
			? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			  event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			  (event.tags?.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
			  ) ??
					false)
			: true;

		return timelineMatch && typeMatch && searchMatch;
	});

	const selectedDateEvents = selectedDate
		? events.filter((event) => event.date === selectedDate)
		: [];

	const isToday = (dateStr: string) => {
		const today = new Date();
		return dateStr === today.toISOString().split("T")[0];
	};

	const renderCalendarDays = () => {
		const days = [];

		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(
				<div
					key={`empty-${i}`}
					className="min-h-16 sm:min-h-24 border border-gray-200 p-1 bg-gray-50/70"
				></div>
			);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
				2,
				"0"
			)}-${String(day).padStart(2, "0")}`;

			days.push(
				<CalendarCell
					key={day}
					day={day}
					dateStr={dateStr}
					events={events}
					isSelected={dateStr === selectedDate}
					isToday={isToday(dateStr)}
					onClick={setSelectedDate}
				/>
			);
		}

		return days;
	};

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		setIsMenuOpen(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-900 overflow-x-hidden">
			<div className="p-4 md:p-8 max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<CommunityLogo />
					<div className="flex items-center gap-3">
						<div className="hidden md:flex items-center gap-3">
							<motion.button
								onClick={() => setActiveTab("list")}
								className={`px-4 py-2 rounded-lg transition-all ${
									activeTab === "list"
										? "bg-indigo-600 text-white shadow-md"
										: "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Activity size={18} className="inline-block mr-2" />
								Timeline
							</motion.button>
							<motion.button
								onClick={() => setActiveTab("calendar")}
								className={`px-4 py-2 rounded-lg transition-all ${
									activeTab === "calendar"
										? "bg-indigo-600 text-white shadow-md"
										: "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Calendar size={18} className="inline-block mr-2" />
								Calendar
							</motion.button>
							<motion.button
								onClick={() => setActiveTab("about")}
								className={`px-4 py-2 rounded-lg transition-all ${
									activeTab === "about"
										? "bg-indigo-600 text-white shadow-md"
										: "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Info size={18} className="inline-block mr-2" />
								About
							</motion.button>
						</div>

						<motion.div className="relative">
							<motion.button
								onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
								className="p-3 rounded-full bg-white text-indigo-600 border border-indigo-200 shadow-sm relative"
								aria-label="Notifications"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<motion.div
									animate={isNotificationsOpen ? "shake" : "rest"}
									variants={{
										rest: { rotate: 0 },
										shake: { rotate: [0, -15, 15, -5, 5, 0] },
									}}
									transition={{ duration: 0.5, type: "tween" }}
								>
									<Bell size={20} />
								</motion.div>
								{unreadNotificationsCount > 0 && (
									<NotificationBadge count={unreadNotificationsCount} />
								)}
							</motion.button>
						</motion.div>

						<motion.button
							onClick={() => setIsAddingEvent(true)}
							className="p-3 rounded-full bg-indigo-600 text-white shadow-md"
							aria-label="Add event"
							whileHover={{ scale: 1.1, backgroundColor: "#4338ca" }}
							whileTap={{ scale: 0.9 }}
						>
							<Plus size={20} />
						</motion.button>

						<button
							className="md:hidden p-3 rounded-full bg-white text-indigo-600 border border-indigo-200 shadow-sm"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<ChevronDown size={20} />
						</button>
					</div>
				</div>

				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							className="md:hidden bg-white rounded-lg shadow-lg p-2 mb-4"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.2 }}
						>
							<div className="flex flex-col gap-2">
								<button
									onClick={() => handleTabChange("list")}
									className={`px-4 py-3 rounded-lg flex items-center ${
										activeTab === "list"
											? "bg-indigo-100 text-indigo-700"
											: "hover:bg-gray-100"
									}`}
								>
									<Activity size={18} className="mr-2" />
									Timeline
								</button>
								<button
									onClick={() => handleTabChange("calendar")}
									className={`px-4 py-3 rounded-lg flex items-center ${
										activeTab === "calendar"
											? "bg-indigo-100 text-indigo-700"
											: "hover:bg-gray-100"
									}`}
								>
									<Calendar size={18} className="mr-2" />
									Calendar
								</button>
								<button
									onClick={() => handleTabChange("about")}
									className={`px-4 py-3 rounded-lg flex items-center ${
										activeTab === "about"
											? "bg-indigo-100 text-indigo-700"
											: "hover:bg-gray-100"
									}`}
								>
									<Info size={18} className="mr-2" />
									About
								</button>

								<button
									onClick={() => {
										setIsNotificationsOpen(true);
										setIsMenuOpen(false);
									}}
									className="px-4 py-3 rounded-lg flex items-center hover:bg-gray-100 relative"
								>
									<Bell size={18} className="mr-2" />
									Notifications
									{unreadNotificationsCount > 0 && (
										<span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
											{unreadNotificationsCount}
										</span>
									)}
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{activeTab !== "about" && (
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 mt-3"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search size={16} className="text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search events..."
								className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								aria-label="Search events"
							/>
						</div>

						<select
							className="w-full p-3 px-4 border rounded-lg flex justify-between items-center bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
							value={filterType}
							onChange={(e) => setFilterType(e.target.value)}
							aria-label="Filter by event type"
						>
							{eventTypes.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</motion.div>
				)}

				{activeTab !== "about" && (
					<RemindersSection events={events} onEventClick={setSelectedEvent} />
				)}

				<div className="mt-4">
					{activeTab === "calendar" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
						>
							<div className="lg:grid lg:grid-cols-3 gap-6">
								<div className="lg:col-span-2 mb-6 lg:mb-0">
									<motion.div
										className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-200"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4 }}
									>
										<div className="flex justify-between items-center p-4 border-b border-gray-200 bg-indigo-50">
											<div className="flex items-center">
												<motion.button
													onClick={prevMonth}
													className="p-2 rounded-full hover:bg-white/50 transition-all"
													aria-label="Previous month"
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													<ChevronLeft size={20} className="text-indigo-600" />
												</motion.button>
												<motion.button
													onClick={nextMonth}
													className="p-2 rounded-full hover:bg-white/50 transition-all ml-1"
													aria-label="Next month"
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													<ChevronRight size={20} className="text-indigo-600" />
												</motion.button>
											</div>

											<h2 className="text-xl font-semibold text-indigo-700">
												{monthName} {currentYear}
											</h2>

											<motion.button
												onClick={goToToday}
												className="text-sm p-5 bg-indigo-600 text-white rounded-lg shadow-sm"
												whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
												whileTap={{ scale: 0.95 }}
											>
												Today
											</motion.button>
										</div>

										<div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 bg-indigo-50/50">
											{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
												(day) => (
													<div
														key={day}
														className="font-medium text-indigo-700"
													>
														{day}
													</div>
												)
											)}
										</div>

										<div className="grid grid-cols-7">
											{renderCalendarDays()}
										</div>
									</motion.div>
								</div>

								<div className="lg:col-span-1">
									<motion.div
										className="rounded-xl shadow-lg p-5 bg-white border border-gray-200"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: 0.2 }}
									>
										<h2 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
											<Calendar size={20} className="mr-2 text-indigo-500" />
											{selectedDate
												? `Events for ${new Date(
														selectedDate
												  ).toLocaleDateString("en-US", {
														weekday: "long",
														month: "short",
														day: "numeric",
												  })}`
												: "All Events"}
											{selectedDateEvents.length > 0 && (
												<span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
													{selectedDateEvents.length}
												</span>
											)}
										</h2>

										{selectedDateEvents.length === 0 ? (
											<motion.div
												className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.3 }}
											>
												<Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
												<p className="text-lg">No events found</p>
												<motion.button
													onClick={() => setIsAddingEvent(true)}
													className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center mx-auto"
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<Plus size={16} className="mr-2" />
													Add Event
												</motion.button>
											</motion.div>
										) : (
											<motion.div
												className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.3 }}
											>
												{selectedDateEvents.map((event) => (
													<EventCard
														key={event.id}
														event={event}
														onClick={() => setSelectedEvent(event)}
														onRsvp={handleRSVP}
														isRsvped={rsvps.includes(event.id)}
													/>
												))}
											</motion.div>
										)}
									</motion.div>
								</div>
							</div>
						</motion.div>
					)}

					{activeTab === "list" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
							className="mb-4"
						>
							<h2 className="text-xl font-semibold mb-4 text-indigo-700 text-center flex items-center justify-center">
								<Activity size={24} className="mr-2 text-indigo-600" />
								Events Timeline
								<span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
									{filteredEvents.length}
								</span>
							</h2>

							{filteredEvents.length === 0 ? (
								<motion.div
									className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md border border-gray-100"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									<Calendar className="w-16 h-16 mx-auto mb-3 text-gray-300" />
									<p className="text-xl mb-2">No events found</p>
									<p className="text-gray-400 mb-4">
										Try changing your filters or add a new event
									</p>
									<motion.button
										onClick={() => setIsAddingEvent(true)}
										className="px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center mx-auto"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Plus size={16} className="mr-2" />
										Add New Event
									</motion.button>
								</motion.div>
							) : (
								<>
									<ThreeColumnEventView
										events={filteredEvents}
										onEventClick={setSelectedEvent}
										onRsvp={handleRSVP}
										rsvps={rsvps}
									/>
								</>
							)}
						</motion.div>
					)}

					{activeTab === "about" && <AboutCommunity />}
				</div>
			</div>

			<AnimatePresence>
				{selectedEvent && (
					<motion.div
						className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setSelectedEvent(null)}
					>
						<motion.div
							className="bg-white rounded-xl max-w-lg w-full mx-auto shadow-xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ type: "spring", damping: 25 }}
							onClick={(e) => e.stopPropagation()}
						>
							{selectedEvent &&
								(() => {
									const colors = getEventColor(selectedEvent.type);
									return (
										<>
											<div
												className={`relative p-4 sm:p-6 bg-gradient-to-r ${colors.gradient} text-white pb-8 sm:pb-10`}
											>
												<div className="flex items-center justify-between">
													<span
														className={`capitalize text-xs font-semibold px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm flex items-center`}
													>
														{getEventTypeIcon(selectedEvent.type)}
														<span className="ml-1">{selectedEvent.type}</span>
													</span>

													<button
														onClick={() => setSelectedEvent(null)}
														className="rounded-full p-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
														aria-label="Close"
													>
														<X size={18} />
													</button>
												</div>

												<h2 className="text-xl sm:text-2xl font-bold mt-3 mb-1">
													{selectedEvent.title}
												</h2>
												<p className="text-white/80 text-xs sm:text-sm">
													Organized by
													{selectedEvent.organizer || "Community Member"}
												</p>
											</div>

											<div className="flex justify-center -mt-6 mb-4 relative z-10">
												<div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
													{getEventTypeIcon(selectedEvent.type)}
												</div>
											</div>

											<div className="px-4 sm:px-6 pb-6">
												<div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-6 text-center">
													<div className="flex flex-col items-center">
														<div className="p-2 bg-indigo-100 rounded-full mb-2">
															<Calendar size={18} className="text-indigo-600" />
														</div>
														<span className="text-xs sm:text-sm font-medium">
															{formatLongDate(selectedEvent.date)}
														</span>
													</div>

													<div className="flex flex-col items-center">
														<div className="p-2 bg-indigo-100 rounded-full mb-2">
															<Clock size={18} className="text-indigo-600" />
														</div>
														<span className="text-xs sm:text-sm font-medium">
															{formatTime(selectedEvent.time)}
														</span>
													</div>

													<div className="flex flex-col items-center">
														<div className="p-2 bg-indigo-100 rounded-full mb-2">
															<Users size={18} className="text-indigo-600" />
														</div>
														<span className="text-xs sm:text-sm font-medium">
															{selectedEvent.rsvpCount} attending
														</span>
													</div>
												</div>

												<div className="mb-4">
													<div className="flex items-center mb-2">
														<MapPin
															size={16}
															className="mr-2 text-indigo-600"
														/>
														<h3 className="font-semibold text-gray-700 text-sm sm:text-base">
															Location
														</h3>
													</div>
													<p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
														{selectedEvent.location}
													</p>
												</div>

												<div className="mb-6">
													<div className="flex items-center mb-2">
														<Info size={16} className="mr-2 text-indigo-600" />
														<h3 className="font-semibold text-gray-700 text-sm sm:text-base">
															Description
														</h3>
													</div>
													<p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
														{selectedEvent.description}
													</p>
												</div>

												{selectedEvent.tags &&
													selectedEvent.tags.length > 0 && (
														<div className="mb-6">
															<div className="flex items-center mb-2">
																<Tag
																	size={16}
																	className="mr-2 text-indigo-600"
																/>
																<h3 className="font-semibold text-gray-700 text-sm sm:text-base">
																	Tags
																</h3>
															</div>
															<div className="flex flex-wrap gap-2">
																{selectedEvent.tags.map((tag, idx) => (
																	<span
																		key={idx}
																		className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700"
																	>
																		#{tag}
																	</span>
																))}
															</div>
														</div>
													)}

												<div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
													<motion.button
														onClick={() => handleShareEvent(selectedEvent)}
														className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center text-xs sm:text-sm"
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
													>
														<Share2 size={14} className="mr-1 sm:mr-2" />
														Share
													</motion.button>

													{new Date(selectedEvent.date) >= new Date() && (
														<motion.button
															onClick={() => handleRSVP(selectedEvent.id)}
															className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white flex items-center text-xs sm:text-sm ${
																rsvps.includes(selectedEvent.id)
																	? "bg-green-500"
																	: colors.bg
															}`}
															disabled={rsvps.includes(selectedEvent.id)}
															whileHover={{ scale: 1.05 }}
															whileTap={{ scale: 0.95 }}
														>
															{rsvps.includes(selectedEvent.id) ? (
																<>
																	<Check size={14} className="mr-1 sm:mr-2" />
																	Confirmed
																</>
															) : (
																<>
																	<Bookmark
																		size={14}
																		className="mr-1 sm:mr-2"
																	/>
																	RSVP Now
																</>
															)}
														</motion.button>
													)}

													<motion.button
														onClick={() => {
															setEditEvent(selectedEvent);
															setSelectedEvent(null);
														}}
														className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center text-xs sm:text-sm"
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
													>
														<Edit size={14} className="mr-1 sm:mr-2" />
														Edit
													</motion.button>
												</div>
											</div>
										</>
									);
								})()}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{(isAddingEvent || editEvent) && (
					<motion.div
						className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => {
							setIsAddingEvent(false);
							setEditEvent(null);
						}}
					>
						<motion.div
							className="bg-white rounded-xl max-w-lg w-full mx-auto shadow-xl overflow-hidden"
							initial={{ scale: 0.9, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.9, opacity: 0, y: 20 }}
							transition={{ type: "spring", damping: 25 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
								<h2 className="text-2xl font-bold">
									{editEvent ? "Edit Event" : "Add New Event"}
								</h2>
								<p className="text-white/80 text-sm mt-1">
									{editEvent
										? "Update the details of your event"
										: "Fill in the details to create a new community event"}
								</p>
								<button
									onClick={() => {
										setIsAddingEvent(false);
										setEditEvent(null);
									}}
									className="absolute top-4 right-4 rounded-full p-1 bg-white/20 hover:bg-white/30"
									aria-label="Close"
								>
									<X size={18} />
								</button>
							</div>

							<div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
								<EventForm
									event={editEvent || newEvent}
									setEvent={editEvent ? setEditEvent : setNewEvent}
									onSubmit={editEvent ? updateEvent : addEvent}
									onCancel={() => {
										setIsAddingEvent(false);
										setEditEvent(null);
									}}
									onDelete={() => editEvent && deleteEvent(editEvent.id)}
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<ToastNotification
				toast={toast}
				onClose={() => setToast({ ...toast, open: false })}
			/>

			<motion.button
				className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-lg md:hidden z-30"
				onClick={() => setIsAddingEvent(true)}
				whileHover={{ scale: 1.1, backgroundColor: "#4338ca" }}
				whileTap={{ scale: 0.9 }}
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					type: "spring",
					stiffness: 260,
					damping: 20,
				}}
			>
				<Plus size={24} />
			</motion.button>
			<NotificationsPanel
				notifications={notifications}
				isOpen={isNotificationsOpen}
				onClose={() => setIsNotificationsOpen(false)}
				onMarkAllRead={handleMarkAllNotificationsAsRead}
				onNotificationClick={handleNotificationClick}
			/>
			<AnimatePresence>
				{newNotificationPopup && (
					<NotificationPopup
						notification={newNotificationPopup}
						onClose={() => setNewNotificationPopup(null)}
					/>
				)}
			</AnimatePresence>
			<audio
				ref={notificationSoundRef}
				src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=notification-sound-7062.mp3"
				preload="auto"
			/>
			<audio
				ref={rsvpSoundRef}
				src="https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bbc7aa.mp3?filename=success-1-6297.mp3"
				preload="auto"
			/>
		</div>
	);
};

const GlobalStyles = () => {
	useEffect(() => {
		const style = document.createElement("style");
		style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #c7d2fe;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #818cf8;
      }
      
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
      }
      
      
      .neu-shadow {
        box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
      }
      
      .neu-button {
        box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
        transition: all 0.2s ease;
      }
      
      .neu-button:active {
        box-shadow: inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff;
      }
      
      .neu-inset {
        box-shadow: inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff;
      }
    `;
		document.head.appendChild(style);

		return () => {
			document.head.removeChild(style);
		};
	}, []);

	return null;
};

const CommunityCalendarApp = () => {
	return (
		<>
			<GlobalStyles />
			<CommunityConnectHub />
		</>
	);
};

export default CommunityCalendarApp;
