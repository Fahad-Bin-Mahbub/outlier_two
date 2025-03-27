"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	Plus,
	Check,
	X,
	Calendar,
	TrendingUp,
	Award,
	Target,
	ChevronLeft,
	ChevronRight,
	BarChart3,
	Trash2,
	Edit2,
	Trophy,
	Zap,
	Star,
	Settings,
	Home,
	Users,
	Shield,
	Smartphone,
	Cloud,
	Brain,
	ChevronDown,
	Menu,
	ArrowRight,
	Activity,
	Flame,
	Sparkles,
	Clock,
	Quote,
} from "lucide-react";

type Goal = {
	id: string;
	text: string;
	completed: boolean;
	createdAt: Date;
	completedAt?: Date;
};

type DayData = {
	date: string;
	goals: Goal[];
};

type WeeklyDayData = {
	date: string;
	dayName: string;
	completionRate: number;
	totalGoals: number;
	completedGoals: number;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MOTIVATIONAL_QUOTES = [
	"Small steps daily lead to big changes",
	"Progress over perfection",
	"You're doing great!",
	"Keep pushing forward",
	"Every goal matters",
];

const TESTIMONIALS = [
	{
		name: "Sarah Chen",
		role: "Product Manager",
		content:
			"This app transformed my productivity. I've maintained a 45-day streak and my goal completion rate went from 40% to 85%!",
		rating: 5,
	},
	{
		name: "Marcus Johnson",
		role: "Entrepreneur",
		content:
			"The analytics dashboard gives me insights I never had before. I can see patterns in my productivity and adjust accordingly.",
		rating: 5,
	},
	{
		name: "Emily Rodriguez",
		role: "Software Developer",
		content:
			"Simple, intuitive, and powerful. The swipe gestures make it so easy to manage tasks on the go. Best goal tracker I've used!",
		rating: 5,
	},
	{
		name: "David Kim",
		role: "Designer",
		content:
			"The glassmorphism design is beautiful! It's not just functional but also a pleasure to use every single day.",
		rating: 5,
	},
	{
		name: "Lisa Wang",
		role: "Student",
		content:
			"Helped me build consistent study habits. My grades improved significantly after just one month of using this app!",
		rating: 5,
	},
];

const FEATURES = [
	{
		icon: Brain,
		title: "Smart Analytics",
		description:
			"Advanced insights into your productivity patterns with AI-powered recommendations",
	},
	{
		icon: Cloud,
		title: "Cloud Sync",
		description:
			"Seamlessly sync your goals across all devices with real-time updates",
	},
	{
		icon: Shield,
		title: "Privacy First",
		description:
			"Your data is encrypted and secure. We never share your personal information",
	},
	{
		icon: Smartphone,
		title: "Mobile Optimized",
		description: "Designed for one-handed use with intuitive swipe gestures",
	},
];

const MAX_GOAL_LENGTH = 30;

const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<div className="relative inline-flex items-center justify-center">
			<svg width={size} height={size} className="transform -rotate-90">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="rgba(255,255,255,0.1)"
					strokeWidth={strokeWidth}
					fill="none"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="url(#progressGradient)"
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					className="transition-all duration-500 ease-out filter drop-shadow-lg"
				/>
				<defs>
					<linearGradient
						id="progressGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#84cc16" />
						<stop offset="100%" stopColor="#65a30d" />
					</linearGradient>
				</defs>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-3xl font-bold text-white">
					{Math.round(percentage)}%
				</span>
				<span className="text-xs text-gray-300">Complete</span>
			</div>
		</div>
	);
};

const SwipeableGoalItem = ({ goal, onComplete, onDelete, onEdit }) => {
	const [startX, setStartX] = useState(0);
	const [currentX, setCurrentX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [swipeOffset, setSwipeOffset] = useState(0);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null
	);
	const itemRef = useRef<HTMLDivElement>(null);

	const SWIPE_THRESHOLD = 80;
	const MAX_SWIPE = 120;

	const handleStart = (clientX: number) => {
		setStartX(clientX);
		setCurrentX(clientX);
		setIsDragging(true);
	};

	const handleMove = (clientX: number) => {
		if (!isDragging) return;

		const diff = clientX - startX;
		const clampedDiff = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, diff));

		setCurrentX(clientX);
		setSwipeOffset(clampedDiff);

		if (Math.abs(clampedDiff) > 30) {
			setSwipeDirection(clampedDiff > 0 ? "right" : "left");
		} else {
			setSwipeDirection(null);
		}
	};

	const handleEnd = () => {
		if (!isDragging) return;

		const diff = currentX - startX;

		if (Math.abs(diff) > SWIPE_THRESHOLD) {
			if (diff > 0) {
				onEdit(goal);
			} else {
				onDelete(goal.id);
			}
		}

		setIsDragging(false);
		setSwipeOffset(0);
		setSwipeDirection(null);
		setStartX(0);
		setCurrentX(0);
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		handleStart(e.touches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		handleMove(e.touches[0].clientX);
	};

	const handleTouchEnd = () => {
		handleEnd();
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		handleStart(e.clientX);
	};

	const handleMouseMove = (e: MouseEvent) => {
		handleMove(e.clientX);
	};

	const handleMouseUp = () => {
		handleEnd();
	};

	React.useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isDragging, currentX, startX]);

	return (
		<div
			ref={itemRef}
			className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
				isDragging ? "scale-98" : ""
			} ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onMouseDown={handleMouseDown}
		>
			<div
				className={`absolute inset-0 flex items-center ${
					swipeDirection === "left"
						? "justify-end bg-red-500/30"
						: "justify-start bg-blue-500/30"
				} ${
					swipeDirection ? "opacity-100" : "opacity-0"
				} transition-opacity px-6`}
			>
				{swipeDirection === "left" ? (
					<div className="flex items-center gap-2">
						<Trash2 className="h-6 w-6 text-red-400" />
						<span className="text-sm font-medium text-red-400">Delete</span>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<Edit2 className="h-6 w-6 text-blue-400" />
						<span className="text-sm font-medium text-blue-400">Edit</span>
					</div>
				)}
			</div>

			<div
				className={`relative flex items-center gap-4 p-4 backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl transition-all hover:bg-white/[0.12] ${
					goal.completed ? "opacity-75" : ""
				}`}
				style={{
					transform: `translateX(${swipeOffset}px)`,
					transition: isDragging ? "none" : "transform 0.3s ease-out",
				}}
			>
				<button
					onClick={() => onComplete(goal.id)}
					className={`flex-shrink-0 h-8 w-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
						goal.completed
							? "bg-gradient-to-br from-lime-400 to-lime-600 border-lime-400 shadow-lg shadow-lime-400/30"
							: "border-gray-400/50 hover:border-lime-400/50 bg-white/[0.05]"
					}`}
				>
					{goal.completed && <Check className="h-4 w-4 text-black" />}
				</button>

				<span
					className={`flex-1 text-sm transition-all ${
						goal.completed ? "line-through text-gray-400" : "text-white"
					}`}
				>
					{goal.text}
				</span>

				{goal.completed && (
					<div className="flex items-center gap-1">
						<Trophy className="h-4 w-4 text-yellow-400 drop-shadow-lg" />
						<span className="text-xs text-gray-400">Done!</span>
					</div>
				)}
			</div>
		</div>
	);
};

const TestimonialCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (isAutoPlaying) {
			intervalRef.current = setInterval(() => {
				setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
			}, 4000);
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isAutoPlaying]);

	const handleDotClick = (index) => {
		setCurrentIndex(index);
		setIsAutoPlaying(false);
	};

	return (
		<div className="relative max-w-4xl mx-auto px-4">
			<div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.05] border border-white/[0.15] rounded-3xl p-8 sm:p-12 shadow-2xl">
				<Quote className="h-12 w-12 text-lime-400/30 mb-6" />

				<div className="relative overflow-hidden">
					<div
						className="flex transition-transform duration-700 ease-out"
						style={{ transform: `translateX(-${currentIndex * 100}%)` }}
					>
						{TESTIMONIALS.map((testimonial, index) => (
							<div key={index} className="w-full flex-shrink-0">
								<div className="text-center max-w-2xl mx-auto">
									<div className="flex justify-center gap-1 mb-6">
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star
												key={i}
												className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
											/>
										))}
									</div>
									<p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed italic">
										"{testimonial.content}"
									</p>
									<div>
										<p className="font-semibold text-white text-lg">
											{testimonial.name}
										</p>
										<p className="text-sm text-gray-400">{testimonial.role}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="flex justify-center gap-2 mt-8">
					{TESTIMONIALS.map((_, index) => (
						<button
							key={index}
							onClick={() => handleDotClick(index)}
							className={`h-2 rounded-full transition-all duration-300 ${
								currentIndex === index
									? "w-8 bg-gradient-to-r from-lime-400 to-lime-600"
									: "w-2 bg-gray-500 hover:bg-gray-400"
							}`}
						/>
					))}
				</div>
			</div>

			<button
				onClick={() => {
					setCurrentIndex(
						(prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
					);
					setIsAutoPlaying(false);
				}}
				className="absolute left-0 top-1/2 -translate-y-1/2 p-3 backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-full hover:bg-white/[0.12] transition-all group"
			>
				<ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
			</button>

			<button
				onClick={() => {
					setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
					setIsAutoPlaying(false);
				}}
				className="absolute right-0 top-1/2 -translate-y-1/2 p-3 backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-full hover:bg-white/[0.12] transition-all group"
			>
				<ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
			</button>
		</div>
	);
};

const generateMockData = () => {
	const data: Record<string, DayData> = {};
	const today = new Date();

	for (let i = 13; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		const dateKey = date.toISOString().split("T")[0];

		const goals: Goal[] = [];
		const numGoals = Math.floor(Math.random() * 8) + 1;

		for (let j = 0; j < numGoals; j++) {
			const goalTexts = [
				"Read for 30 minutes",
				"Exercise for 45 minutes",
				"Meditate for 10 minutes",
				"Write in journal",
				"Call a friend",
				"Drink 8 glasses of water",
				"Complete work project",
				"Practice guitar",
				"Cook healthy meal",
				"Take a walk outside",
				"Learn something new",
				"Organize workspace",
				"Do laundry",
				"Clean room",
				"Study for 2 hours",
				"Go grocery shopping",
				"Reply to emails",
				"Stretch for 15 minutes",
				"Plan tomorrow",
				"Take vitamins",
				"Water plants",
				"Practice coding",
				"Listen to podcast",
				"Call family",
			];

			const goal: Goal = {
				id: `${dateKey}-${j}`,
				text: goalTexts[Math.floor(Math.random() * goalTexts.length)],
				completed: Math.random() > 0.25,
				createdAt: new Date(date.getTime() + j * 1000),
			};

			if (goal.completed) {
				goal.completedAt = new Date(date.getTime() + j * 1000 + 3600000);
			}

			goals.push(goal);
		}

		data[dateKey] = { date: dateKey, goals };
	}

	return data;
};

export default function DailyGoalTrackerAppExport() {
	const [dayData, setDayData] = useState<Record<string, DayData>>(
		generateMockData()
	);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [newGoalText, setNewGoalText] = useState("");
	const [showAddGoal, setShowAddGoal] = useState(false);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
	const [activeSection, setActiveSection] = useState("home");
	const [showWeeklyStats, setShowWeeklyStats] = useState(false);

	const homeRef = useRef<HTMLDivElement>(null);
	const dashboardRef = useRef<HTMLDivElement>(null);

	const motivationalQuote =
		MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

	const dateKey = currentDate.toISOString().split("T")[0];
	const todayData = dayData[dateKey] || { date: dateKey, goals: [] };
	const completedGoals = todayData.goals.filter((g) => g.completed).length;
	const completionRate =
		todayData.goals.length > 0
			? (completedGoals / todayData.goals.length) * 100
			: 0;

	const calculateWeeklyStats = () => {
		const today = new Date();
		const weekData: WeeklyDayData[] = [];

		for (let i = 6; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			const key = date.toISOString().split("T")[0];
			const data = dayData[key];

			if (data && data.goals.length > 0) {
				const completed = data.goals.filter((g) => g.completed).length;
				const rate = (completed / data.goals.length) * 100;
				weekData.push({
					date: key,
					dayName: DAYS[date.getDay()],
					completionRate: rate,
					totalGoals: data.goals.length,
					completedGoals: completed,
				});
			}
		}

		const avgCompletionRate =
			weekData.length > 0
				? weekData.reduce((sum, day) => sum + day.completionRate, 0) /
				  weekData.length
				: 0;

		const bestDay = weekData.reduce(
			(best, day) => (day.completionRate > best.completionRate ? day : best),
			{ completionRate: 0, dayName: "None" }
		);

		return {
			weekData,
			avgCompletionRate,
			bestDay: bestDay.dayName,
			totalDaysTracked: weekData.length,
		};
	};

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100;
			const dashboardPosition = dashboardRef.current?.offsetTop || 0;

			if (scrollPosition >= dashboardPosition) {
				setActiveSection("dashboard");
			} else {
				setActiveSection("home");
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (section) => {
		const element = section === "home" ? homeRef.current : dashboardRef.current;
		element?.scrollIntoView({ behavior: "smooth" });
	};

	const addGoal = () => {
		if (!newGoalText.trim() || todayData.goals.length >= 10) return;

		const newGoal: Goal = {
			id: Date.now().toString(),
			text: newGoalText.trim(),
			completed: false,
			createdAt: new Date(),
		};

		setDayData((prev) => ({
			...prev,
			[dateKey]: {
				date: dateKey,
				goals: [...(prev[dateKey]?.goals || []), newGoal],
			},
		}));

		setNewGoalText("");
		setShowAddGoal(false);
	};

	const updateGoal = () => {
		if (!editingGoal || !editingGoal.text.trim()) return;

		setDayData((prev) => ({
			...prev,
			[dateKey]: {
				...prev[dateKey],
				goals: prev[dateKey].goals.map((g) =>
					g.id === editingGoal.id ? { ...g, text: editingGoal.text.trim() } : g
				),
			},
		}));

		setEditingGoal(null);
	};

	const toggleGoalComplete = (goalId: string) => {
		setDayData((prev) => ({
			...prev,
			[dateKey]: {
				...prev[dateKey],
				goals: prev[dateKey].goals.map((g) =>
					g.id === goalId
						? {
								...g,
								completed: !g.completed,
								completedAt: !g.completed ? new Date() : undefined,
						  }
						: g
				),
			},
		}));
	};

	const deleteGoal = (goalId: string) => {
		setDayData((prev) => ({
			...prev,
			[dateKey]: {
				...prev[dateKey],
				goals: prev[dateKey].goals.filter((g) => g.id !== goalId),
			},
		}));
	};

	const navigateDate = (direction: number) => {
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + direction);
		setCurrentDate(newDate);
	};

	const isToday = dateKey === new Date().toISOString().split("T")[0];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-96 h-96 bg-lime-400/20 rounded-full blur-[128px]" />
				<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lime-600/20 rounded-full blur-[128px]" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[128px]" />
			</div>

			<nav className="hidden sm:fixed sm:top-0 sm:left-0 sm:right-0 sm:z-40 sm:flex sm:justify-center sm:p-4">
				<div className="backdrop-blur-2xl bg-white/[0.08] border border-white/[0.15] rounded-full px-6 py-3 shadow-xl">
					<div className="flex items-center gap-6">
						<button
							onClick={() => scrollToSection("home")}
							className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
								activeSection === "home"
									? "bg-gradient-to-r from-lime-400 to-lime-600 text-black shadow-lg"
									: "text-gray-300 hover:text-white"
							}`}
						>
							<Home className="h-4 w-4" />
							<span>Home</span>
						</button>
						<button
							onClick={() => scrollToSection("dashboard")}
							className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
								activeSection === "dashboard"
									? "bg-gradient-to-r from-lime-400 to-lime-600 text-black shadow-lg"
									: "text-gray-300 hover:text-white"
							}`}
						>
							<BarChart3 className="h-4 w-4" />
							<span>Dashboard</span>
						</button>
					</div>
				</div>
			</nav>

			<div ref={homeRef} id="home">
				<header className="relative p-4 sm:p-6 lg:p-8 backdrop-blur-2xl bg-white/[0.02] border-b border-white/[0.1]">
					<nav className="flex items-center justify-between max-w-7xl mx-auto">
						<div className="flex items-center gap-2">
							<div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center shadow-lg shadow-lime-400/30">
								<Target className="h-5 w-5 text-black" />
							</div>
							<span className="text-xl font-bold">GoalTracker Pro</span>
						</div>
					</nav>
				</header>

				<main className="relative">
					<section className="px-4 py-12 sm:py-20 text-center max-w-6xl mx-auto">
						<div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.15] rounded-3xl p-8 sm:p-16 shadow-2xl">
							<div className="flex items-center justify-center gap-2 mb-6">
								<Sparkles className="h-5 w-5 text-lime-400" />
								<span className="text-sm font-medium text-lime-400 backdrop-blur-xl bg-white/[0.08] px-3 py-1 rounded-full border border-lime-400/30">
									Trusted by 50,000+ users
								</span>
							</div>

							<h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
								Transform Your Daily Goals
							</h1>
							<p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
								Achieve more with intelligent goal tracking, powerful analytics,
								and seamless device sync. Join thousands who've revolutionized
								their productivity.
							</p>

							<div className="mb-12 relative rounded-2xl overflow-hidden shadow-2xl">
								<div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10" />
								<img
									src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop"
									alt="Dashboard Preview"
									className="w-full"
								/>
							</div>

							<div className="flex md:flex-row flex-col gap-2 sm:gap-4 max-w-lg mx-auto">
								<div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-2 sm:p-4">
									<p className="text-xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-lime-400 to-lime-600 bg-clip-text">
										95%
									</p>
									<p className="text-xs sm:text-sm text-gray-400">
										Completion Rate
									</p>
								</div>
								<div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-2 sm:p-4">
									<p className="text-xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-lime-400 to-lime-600 bg-clip-text">
										50K+
									</p>
									<p className="text-xs sm:text-sm text-gray-400">
										Active Users
									</p>
								</div>
								<div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-2 sm:p-4">
									<p className="text-xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-lime-400 to-lime-600 bg-clip-text">
										4.9★
									</p>
									<p className="text-xs sm:text-sm text-gray-400">App Rating</p>
								</div>
							</div>
						</div>
					</section>

					<section id="features" className="px-4 py-16 sm:py-24">
						<div className="max-w-7xl mx-auto">
							<div className="text-center mb-12">
								<h2 className="text-3xl sm:text-4xl font-bold mb-4">
									Everything You Need to Succeed
								</h2>
								<p className="text-gray-400 max-w-2xl mx-auto">
									Powerful features designed to help you build better habits and
									achieve your goals faster
								</p>
							</div>
							<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
								{FEATURES.map((feature, index) => (
									<div key={index} className="group">
										<div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-6 hover:bg-white/[0.12] transition-all hover:scale-105 hover:shadow-xl h-full text-center sm:text-left">
											<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-400/20 to-lime-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
												<feature.icon className="h-6 w-6 text-lime-400" />
											</div>
											<h3 className="text-xl font-semibold mb-2">
												{feature.title}
											</h3>
											<p className="text-gray-400 text-sm">
												{feature.description}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>

					<section id="testimonials" className="px-4 py-16 sm:py-24">
						<div className="max-w-7xl mx-auto">
							<div className="text-center mb-12">
								<h2 className="text-3xl sm:text-4xl font-bold mb-4">
									Loved by Thousands
								</h2>
								<p className="text-gray-400">
									See what our users have to say about their experience
								</p>
							</div>
							<TestimonialCarousel />
						</div>
					</section>
				</main>
			</div>

			<div ref={dashboardRef} id="dashboard" className="min-h-screen relative">
				<div className="backdrop-blur-2xl bg-white/[0.02] border-b border-white/[0.1] mb-8">
					<div className="p-4">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center shadow-lg shadow-lime-400/30">
									<Target className="h-5 w-5 text-black" />
								</div>
								<div>
									<h1 className="text-lg font-bold">Daily Goals</h1>
									<p className="text-xs text-gray-400">{motivationalQuote}</p>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between mt-4">
							<button
								onClick={() => navigateDate(-1)}
								className="p-2 rounded-xl backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12] transition-all"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>

							<div className="text-center">
								<p className="text-xs text-gray-400">
									{currentDate.toLocaleDateString("en-US", { weekday: "long" })}
								</p>
								<p className="text-lg font-semibold">
									{currentDate.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</p>
							</div>

							<button
								onClick={() => navigateDate(1)}
								disabled={isToday}
								className={`p-2 rounded-xl transition-all ${
									isToday
										? "opacity-50 cursor-not-allowed backdrop-blur bg-white/[0.02]"
										: "backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12]"
								}`}
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>

				<main className="relative p-4 max-w-lg mx-auto pb-20 sm:pb-8">
					<div className="mb-8 text-center backdrop-blur-2xl bg-white/[0.08] border border-white/[0.15] rounded-3xl p-6 shadow-xl">
						<CircularProgress percentage={completionRate} />
						<div className="mt-4 flex items-center justify-center gap-4">
							<div className="text-center">
								<p className="text-2xl font-bold">{completedGoals}</p>
								<p className="text-xs text-gray-400">Completed</p>
							</div>
							<div className="h-8 w-px bg-white/20" />
							<div className="text-center">
								<p className="text-2xl font-bold">{todayData.goals.length}</p>
								<p className="text-xs text-gray-400">Total Goals</p>
							</div>
						</div>
					</div>

					<div className="space-y-3 mb-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Today's Goals</h2>
							<span className="text-sm text-gray-400 backdrop-blur bg-white/[0.05] px-3 py-1 rounded-full">
								{todayData.goals.length}/10
							</span>
						</div>

						{todayData.goals.length === 0 ? (
							<div className="text-center py-12 backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl">
								<Zap className="h-12 w-12 text-gray-500 mx-auto mb-3" />
								<p className="text-gray-400">No goals yet</p>
								<p className="text-sm text-gray-500">
									Add your first goal below
								</p>
							</div>
						) : (
							<div className="space-y-2">
								{todayData.goals.map((goal) => (
									<SwipeableGoalItem
										key={goal.id}
										goal={goal}
										onComplete={toggleGoalComplete}
										onDelete={deleteGoal}
										onEdit={setEditingGoal}
									/>
								))}
							</div>
						)}

						{todayData.goals.length < 10 && (
							<button
								onClick={() => setShowAddGoal(true)}
								className="w-full py-3 rounded-xl backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12] transition-all flex items-center justify-center gap-2 text-gray-300 hover:text-white"
							>
								<Plus className="h-5 w-5" />
								Add New Goal
							</button>
						)}
					</div>

					{completionRate === 100 && todayData.goals.length > 0 && (
						<div className="mb-6 p-4 backdrop-blur-xl bg-gradient-to-r from-yellow-400/[0.15] to-orange-400/[0.15] rounded-2xl border border-yellow-400/30 text-center shadow-xl">
							<Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2 drop-shadow-lg" />
							<p className="text-sm font-semibold">Perfect Day!</p>
							<p className="text-xs text-gray-300">
								You completed all your goals!
							</p>
						</div>
					)}

					<button
						onClick={() => setShowWeeklyStats(true)}
						className="w-full py-3 rounded-xl backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12] transition-all flex items-center justify-center gap-2 text-gray-300 hover:text-white mb-6"
					>
						<BarChart3 className="h-5 w-5" />
						Weekly Statistics
					</button>
				</main>
			</div>

			<div className="fixed bottom-0 left-0 right-0 backdrop-blur-2xl bg-white/[0.02] border-t border-white/[0.1] z-30 sm:hidden">
				<nav className="flex items-center justify-around py-2">
					<button
						onClick={() => scrollToSection("home")}
						className={`flex flex-col items-center p-2 transition-all ${
							activeSection === "home" ? "text-lime-400" : "text-gray-400"
						}`}
					>
						<Home className="h-5 w-5" />
						<span className="text-xs mt-1">Home</span>
					</button>
					<button
						onClick={() => scrollToSection("dashboard")}
						className={`flex flex-col items-center p-2 transition-all ${
							activeSection === "dashboard" ? "text-lime-400" : "text-gray-400"
						}`}
					>
						<BarChart3 className="h-5 w-5" />
						<span className="text-xs mt-1">Dashboard</span>
					</button>
				</nav>
			</div>

			{showWeeklyStats && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => setShowWeeklyStats(false)}
					/>
					<div className="relative w-full max-w-md backdrop-blur-2xl bg-gray-800/90 border border-white/20 rounded-3xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-semibold">Weekly Statistics</h3>
							<button
								onClick={() => setShowWeeklyStats(false)}
								className="p-2 rounded-xl backdrop-blur bg-white/[0.08] hover:bg-white/[0.12] transition-all"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{(() => {
							const stats = calculateWeeklyStats();
							return (
								<div className="space-y-6">
									<div className="flex justify-center gap-4">
										<div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-4 text-center">
											<p className="text-2xl font-bold text-lime-400">
												{Math.round(stats.avgCompletionRate)}%
											</p>
											<p className="text-xs text-gray-400">Avg Completion</p>
										</div>
										<div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-4 text-center">
											<p className="text-2xl font-bold text-blue-400">
												{stats.bestDay}
											</p>
											<p className="text-xs text-gray-400">Best Day</p>
										</div>
									</div>

									<div>
										<h4 className="text-sm font-medium mb-3 text-gray-300">
											Last 7 Days
										</h4>
										<div className="space-y-2">
											{stats.weekData.map((day, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-3 backdrop-blur-xl bg-white/[0.05] rounded-xl"
												>
													<div className="flex items-center gap-3">
														<span className="text-sm font-medium w-8">
															{day.dayName}
														</span>
														<span className="text-xs text-gray-400">
															{day.completedGoals}/{day.totalGoals}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
															<div
																className="h-full bg-gradient-to-r from-lime-400 to-lime-600 rounded-full transition-all"
																style={{ width: `${day.completionRate}%` }}
															/>
														</div>
														<span className="text-xs text-gray-300 w-10 text-right">
															{Math.round(day.completionRate)}%
														</span>
													</div>
												</div>
											))}
										</div>
									</div>

									<div className="text-center text-xs text-gray-400">
										Tracking {stats.totalDaysTracked} days this week
									</div>
								</div>
							);
						})()}
					</div>
				</div>
			)}

			{showAddGoal && (
				<div className="fixed inset-0 z-50 flex items-end justify-center">
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => setShowAddGoal(false)}
					/>
					<div className="relative w-full max-w-lg backdrop-blur-2xl bg-gray-800/90 border-t border-white/20 rounded-t-3xl p-6 animate-slide-up">
						<div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-4">Add New Goal</h3>
						<div className="relative">
							<input
								type="text"
								value={newGoalText}
								onChange={(e) => {
									if (e.target.value.length <= MAX_GOAL_LENGTH) {
										setNewGoalText(e.target.value);
									}
								}}
								placeholder="What do you want to accomplish?"
								maxLength={MAX_GOAL_LENGTH}
								className="w-full p-3 rounded-xl backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50 mb-1"
								autoFocus
							/>
							<div className="text-xs text-right text-gray-400 mb-3">
								{newGoalText.length}/{MAX_GOAL_LENGTH}
							</div>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setShowAddGoal(false)}
								className="flex-1 py-3 rounded-xl backdrop-blur bg-white/[0.08] hover:bg-white/[0.12] transition-all"
							>
								Cancel
							</button>
							<button
								onClick={addGoal}
								disabled={!newGoalText.trim()}
								className={`flex-1 py-3 rounded-xl font-medium transition-all ${
									newGoalText.trim()
										? "bg-gradient-to-r from-lime-400 to-lime-600 text-black hover:shadow-lg hover:shadow-lime-400/30"
										: "bg-gray-700 text-gray-500 cursor-not-allowed"
								}`}
							>
								Add Goal
							</button>
						</div>
					</div>
				</div>
			)}

			{editingGoal && (
				<div className="fixed inset-0 z-50 flex items-end justify-center">
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => setEditingGoal(null)}
					/>
					<div className="relative w-full max-w-lg backdrop-blur-2xl bg-gray-800/90 border-t border-white/20 rounded-t-3xl p-6 animate-slide-up">
						<div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-4">Edit Goal</h3>
						<div className="relative">
							<input
								type="text"
								value={editingGoal.text}
								onChange={(e) => {
									if (e.target.value.length <= MAX_GOAL_LENGTH) {
										setEditingGoal({ ...editingGoal, text: e.target.value });
									}
								}}
								maxLength={MAX_GOAL_LENGTH}
								className="w-full p-3 rounded-xl backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50 mb-1"
								autoFocus
							/>
							<div className="text-xs text-right text-gray-400 mb-3">
								{editingGoal.text.length}/{MAX_GOAL_LENGTH}
							</div>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setEditingGoal(null)}
								className="flex-1 py-3 rounded-xl backdrop-blur bg-white/[0.08] hover:bg-white/[0.12] transition-all"
							>
								Cancel
							</button>
							<button
								onClick={updateGoal}
								disabled={!editingGoal.text.trim()}
								className={`flex-1 py-3 rounded-xl font-medium transition-all ${
									editingGoal.text.trim()
										? "bg-gradient-to-r from-lime-400 to-lime-600 text-black hover:shadow-lg hover:shadow-lime-400/30"
										: "bg-gray-700 text-gray-500 cursor-not-allowed"
								}`}
							>
								Save Changes
							</button>
						</div>
					</div>
				</div>
			)}

			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        button,a{
        cursor: pointer;
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .scale-98 { 
          transform: scale(0.98);
        }
      `}</style>
		</div>
	);
}
