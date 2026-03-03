"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
	FiChevronLeft,
	FiChevronRight,
	FiPlay,
	FiCheckCircle,
	FiClock,
	FiStar,
	FiBarChart2,
	FiSearch,
	FiX,
	FiCalendar,
	FiEdit,
	FiDownload,
	FiChevronDown,
	FiLogOut,
	FiLayers,
	FiMessageCircle,
	FiMail,
	FiDollarSign,
	FiBell,
	FiTrendingUp,
	FiHeart,
	FiFilter,
	FiPlus,
	FiCheckSquare,
	FiTag,
	FiBriefcase,
	FiPieChart,
	FiTool,
	FiMonitor,
	FiDatabase,
	FiSmartphone,
	FiServer,
} from "react-icons/fi";

import { Book, Award, Home, User, Users, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Course = {
	id: string;
	title: string;
	instructor: string;
	instructorAvatar: string;
	thumbnail: string;
	videoPreview: string;
	progress: number;
	category: string;
	duration: string;
	rating: number;
	students: number;
	level: "Beginner" | "Intermediate" | "Advanced";
	price?: number;
	originalPrice?: number;
	bestSeller?: boolean;
	new?: boolean;
	description?: string;
	tags?: string[];
	nextLesson?: string;
	lastUpdated?: string;
	totalLessons?: number;
	completedLessons?: number;
};

type Lesson = {
	id: string;
	title: string;
	duration: string;
	completed: boolean;
	locked: boolean;
	preview?: boolean;
	courseId?: string;
	resources?: Resource[];
	description?: string;
};

type Resource = {
	id: string;
	title: string;
	type: "PDF" | "Video" | "Code" | "Exercise";
	size?: string;
	url: string;
};

type Testimonial = {
	id: string;
	name: string;
	role: string;
	avatar: string;
	content: string;
	rating: number;
	date?: string;
};

type Category = {
	id: string;
	name: string;
	icon: JSX.Element;
	courses: number;
};

type Notification = {
	id: string;
	type: "course" | "message" | "system" | "achievement";
	title: string;
	message: string;
	time: string;
	read: boolean;
	actionUrl?: string;
};

type LearningPath = {
	id: string;
	title: string;
	description: string;
	courses: number;
	duration: string;
	level: "Beginner" | "Intermediate" | "Advanced";
	progress: number;
	thumbnail: string;
};

type UserStats = {
	streakDays: number;
	hoursLearned: number;
	coursesCompleted: number;
	certificatesEarned: number;
	quizAverage: number;
};

type LiveSession = {
	id: string;
	title: string;
	instructor: string;
	date: string;
	time: string;
	duration: string;
	thumbnail: string;
	participants: number;
	category: string;
	registered: boolean;
};

type Coupon = {
	id: string;
	code: string;
	discount: number;
	expiryDate: string;
};

const mockCourses: Course[] = [
	{
		id: "1",
		title: "Advanced React Patterns with TypeScript",
		instructor: "Sarah Johnson",
		instructorAvatar: "https://i.pravatar.cc/150?img=44",
		thumbnail: "https://source.unsplash.com/random/600x400/?react,programming",
		videoPreview:
			"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		progress: 65,
		category: "Frontend Development",
		duration: "12 hours",
		rating: 4.8,
		students: 1245,
		level: "Advanced",
		price: 89.99,
		originalPrice: 129.99,
		bestSeller: true,
		new: false,
		description:
			"Master advanced React patterns to build scalable and maintainable applications using TypeScript. Learn higher-order components, render props, context API, custom hooks, and more.",
		tags: ["React", "TypeScript", "Hooks", "Frontend"],
		nextLesson: "Performance Optimization Techniques",
		lastUpdated: "March 15, 2023",
		totalLessons: 24,
		completedLessons: 16,
	},
	{
		id: "2",
		title: "TypeScript Masterclass 2023",
		instructor: "Michael Chen",
		instructorAvatar: "https://i.pravatar.cc/150?img=32",
		thumbnail: "https://source.unsplash.com/random/600x400/?typescript,code",
		videoPreview:
			"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		progress: 30,
		category: "Programming",
		duration: "8 hours",
		rating: 4.9,
		students: 2876,
		level: "Intermediate",
		price: 74.99,
		originalPrice: 99.99,
		bestSeller: true,
		new: true,
		description:
			"Comprehensive TypeScript course covering everything from basic types to advanced concepts. Learn about generics, decorators, namespaces, and how to configure TypeScript for your projects.",
		tags: ["TypeScript", "JavaScript", "Programming", "Web Development"],
		nextLesson: "Advanced Generic Types",
		lastUpdated: "April 2, 2023",
		totalLessons: 18,
		completedLessons: 6,
	},
	{
		id: "3",
		title: "UI/UX Design Principles for Developers",
		instructor: "Emma Rodriguez",
		instructorAvatar: "https://i.pravatar.cc/150?img=68",
		thumbnail: "https://source.unsplash.com/random/600x400/?design,ui",
		videoPreview:
			"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		progress: 0,
		category: "Design",
		duration: "6 hours",
		rating: 4.7,
		students: 892,
		level: "Beginner",
		price: 59.99,
		originalPrice: 79.99,
		bestSeller: false,
		new: true,
		description:
			"Learn fundamental UI/UX design principles tailored for developers. This course bridges the gap between development and design, helping you create more intuitive and appealing interfaces.",
		tags: ["UI/UX", "Design", "Frontend", "User Experience"],
		nextLesson: "Design Systems and Component Libraries",
		lastUpdated: "May 10, 2023",
		totalLessons: 15,
		completedLessons: 0,
	},
	{
		id: "4",
		title: "Node.js Backend Development",
		instructor: "David Wilson",
		instructorAvatar: "https://i.pravatar.cc/150?img=75",
		thumbnail: "https://source.unsplash.com/random/600x400/?nodejs,server",
		videoPreview:
			"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		progress: 10,
		category: "Backend Development",
		duration: "10 hours",
		rating: 4.6,
		students: 1532,
		level: "Intermediate",
		price: 84.99,
		originalPrice: 109.99,
		bestSeller: false,
		new: false,
		description:
			"Build scalable and efficient backend applications with Node.js. Learn about RESTful APIs, authentication, databases, and how to deploy your applications to production.",
		tags: ["Node.js", "Express", "Backend", "JavaScript"],
		nextLesson: "Authentication with JWT",
		lastUpdated: "February 22, 2023",
		totalLessons: 20,
		completedLessons: 2,
	},
	{
		id: "5",
		title: "Complete Python Bootcamp 2023",
		instructor: "Priya Patel",
		instructorAvatar: "https://i.pravatar.cc/150?img=63",
		thumbnail: "https://source.unsplash.com/random/600x400/?python,coding",
		videoPreview:
			"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		progress: 0,
		category: "Programming",
		duration: "15 hours",
		rating: 4.8,
		students: 3567,
		level: "Beginner",
		price: 69.99,
		originalPrice: 89.99,
		bestSeller: true,
		new: false,
		description:
			"Comprehensive Python course for beginners. Start from the basics and progress to advanced topics like web scraping, data analysis, and building applications with frameworks like Flask and Django.",
		tags: ["Python", "Programming", "Data Science", "Web Development"],
		nextLesson: "Introduction to Python Syntax",
		lastUpdated: "January 5, 2023",
		totalLessons: 30,
		completedLessons: 0,
	},
	{
		id: "6",
		title: "Data Science with Python: Machine Learning",
		instructor: "Alex Thompson",
		instructorAvatar: "https://i.pravatar.cc/150?img=12",
		thumbnail: "https://source.unsplash.com/random/600x400/?data,science",
		videoPreview:
			"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		progress: 22,
		category: "Data Science",
		duration: "20 hours",
		rating: 4.9,
		students: 2145,
		level: "Intermediate",
		price: 94.99,
		originalPrice: 119.99,
		bestSeller: true,
		new: false,
		description:
			"Learn practical machine learning techniques with Python. This course covers data preprocessing, model selection, evaluation, and deployment using libraries like scikit-learn, TensorFlow, and PyTorch.",
		tags: ["Python", "Machine Learning", "Data Science", "AI"],
		nextLesson: "Supervised Learning Algorithms",
		lastUpdated: "March 28, 2023",
		totalLessons: 26,
		completedLessons: 6,
	},
	{
		id: "7",
		title: "Flutter Mobile App Development",
		instructor: "Jamal Williams",
		instructorAvatar: "https://i.pravatar.cc/150?img=53",
		thumbnail: "https://source.unsplash.com/random/600x400/?mobile,app",
		videoPreview:
			"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		progress: 45,
		category: "Mobile Development",
		duration: "14 hours",
		rating: 4.7,
		students: 1876,
		level: "Intermediate",
		price: 79.99,
		originalPrice: 99.99,
		bestSeller: false,
		new: true,
		description:
			"Build cross-platform mobile applications with Flutter and Dart. Learn to create beautiful UIs, manage state, integrate with backend services, and deploy to both iOS and Android platforms.",
		tags: ["Flutter", "Dart", "Mobile Development", "iOS", "Android"],
		nextLesson: "State Management with Provider",
		lastUpdated: "June 12, 2023",
		totalLessons: 22,
		completedLessons: 10,
	},
	{
		id: "8",
		title: "AWS Cloud Practitioner Certification",
		instructor: "Robert Garcia",
		instructorAvatar: "https://i.pravatar.cc/150?img=59",
		thumbnail: "https://source.unsplash.com/random/600x400/?cloud,aws",
		videoPreview:
			"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		progress: 78,
		category: "Cloud Computing",
		duration: "10 hours",
		rating: 4.8,
		students: 2430,
		level: "Beginner",
		price: 69.99,
		originalPrice: 89.99,
		bestSeller: false,
		new: false,
		description:
			"Prepare for the AWS Certified Cloud Practitioner exam. Learn the fundamentals of AWS cloud services, security, architecture, pricing, and support to pass the certification exam.",
		tags: ["AWS", "Cloud", "Certification", "DevOps"],
		nextLesson: "Identity and Access Management (IAM)",
		lastUpdated: "April 5, 2023",
		totalLessons: 18,
		completedLessons: 14,
	},
];

const courseLessons: Record<string, Lesson[]> = {
	"1": [
		{
			id: "1-1",
			title: "Introduction to React Hooks",
			duration: "15 min",
			completed: true,
			locked: false,
			preview: true,
			courseId: "1",
			description:
				"An overview of React Hooks and why they revolutionized React development.",
			resources: [
				{
					id: "r1-1",
					title: "Hooks Cheatsheet",
					type: "PDF",
					size: "2.4 MB",
					url: "#",
				},
				{
					id: "r1-2",
					title: "Hooks API Reference",
					type: "PDF",
					size: "1.8 MB",
					url: "#",
				},
			],
		},
		{
			id: "1-2",
			title: "Building Custom Hooks",
			duration: "22 min",
			completed: true,
			locked: false,
			courseId: "1",
			description:
				"Learn how to extract component logic into reusable functions.",
			resources: [
				{
					id: "r1-3",
					title: "Custom Hooks Examples",
					type: "Code",
					url: "#",
				},
			],
		},
		{
			id: "1-3",
			title: "Context API Deep Dive",
			duration: "18 min",
			completed: false,
			locked: false,
			preview: true,
			courseId: "1",
			description:
				"Understand how to use Context for state management across components.",
			resources: [
				{
					id: "r1-4",
					title: "Context API Exercise",
					type: "Exercise",
					url: "#",
				},
			],
		},
		{
			id: "1-4",
			title: "Performance Optimization Techniques",
			duration: "25 min",
			completed: false,
			locked: false,
			courseId: "1",
			description:
				"Learn techniques to optimize your React applications for better performance.",
			resources: [
				{
					id: "r1-5",
					title: "Performance Tools Guide",
					type: "PDF",
					size: "3.2 MB",
					url: "#",
				},
			],
		},
		{
			id: "1-5",
			title: "Advanced State Management",
			duration: "30 min",
			completed: false,
			locked: true,
			courseId: "1",
			description:
				"Explore advanced patterns for managing complex state in large applications.",
			resources: [],
		},
	],
	"2": [
		{
			id: "2-1",
			title: "TypeScript Fundamentals",
			duration: "20 min",
			completed: true,
			locked: false,
			preview: true,
			courseId: "2",
			description: "Introduction to TypeScript and its core concepts.",
			resources: [
				{
					id: "r2-1",
					title: "TypeScript Setup Guide",
					type: "PDF",
					size: "1.5 MB",
					url: "#",
				},
			],
		},
		{
			id: "2-2",
			title: "Types and Interfaces",
			duration: "25 min",
			completed: true,
			locked: false,
			courseId: "2",
			description: "Understanding type declarations and interface definitions.",
			resources: [
				{
					id: "r2-2",
					title: "Type Examples",
					type: "Code",
					url: "#",
				},
			],
		},
		{
			id: "2-3",
			title: "Functions and Generics",
			duration: "22 min",
			completed: false,
			locked: false,
			courseId: "2",
			description:
				"Working with function types and generic types in TypeScript.",
			resources: [],
		},
		{
			id: "2-4",
			title: "Advanced Generic Types",
			duration: "28 min",
			completed: false,
			locked: false,
			courseId: "2",
			description: "Deep dive into advanced generic patterns and applications.",
			resources: [
				{
					id: "r2-3",
					title: "Generics Exercise",
					type: "Exercise",
					url: "#",
				},
			],
		},
		{
			id: "2-5",
			title: "Decorators",
			duration: "18 min",
			completed: false,
			locked: true,
			courseId: "2",
			description: "Learn about TypeScript decorators and their applications.",
			resources: [],
		},
	],
};

const mockTestimonials: Testimonial[] = [
	{
		id: "1",
		name: "Alex Turner",
		role: "Frontend Developer at TechCorp",
		avatar: "https://i.pravatar.cc/150?img=46",
		content:
			"This platform transformed my career. The React course gave me the skills to get promoted to senior developer within 6 months! The instructors are incredibly knowledgeable and the course materials are comprehensive.",
		rating: 5,
		date: "March 15, 2023",
	},
	{
		id: "2",
		name: "Maria Garcia",
		role: "UX Designer",
		avatar: "https://i.pravatar.cc/150?img=65",
		content:
			"The design courses are incredibly practical. I was able to apply concepts immediately to my work projects. LearnHub Pro offers the perfect balance of theory and practice that helped me improve my design skills rapidly.",
		rating: 5,
		date: "April 2, 2023",
	},
	{
		id: "3",
		name: "James Wilson",
		role: "Fullstack Developer",
		avatar: "https://i.pravatar.cc/150?img=22",
		content:
			"Best investment in my education. The instructors are industry experts who explain complex topics clearly. I've tried several online learning platforms, but LearnHub Pro stands out with its quality content and supportive community.",
		rating: 4,
		date: "February 18, 2023",
	},
	{
		id: "4",
		name: "Sophia Chen",
		role: "Data Scientist",
		avatar: "https://i.pravatar.cc/150?img=47",
		content:
			"The data science courses here are exceptional. The hands-on projects really helped cement my understanding of complex algorithms. I landed my dream job thanks to the portfolio I built while taking these courses!",
		rating: 5,
		date: "May 7, 2023",
	},
	{
		id: "5",
		name: "Daniel Brown",
		role: "DevOps Engineer",
		avatar: "https://i.pravatar.cc/150?img=51",
		content:
			"I completed the AWS certification course and passed the exam on my first try. The practice tests and real-world scenarios prepared me perfectly for what to expect. Highly recommend for anyone in cloud computing!",
		rating: 5,
		date: "January 30, 2023",
	},
];

const FiCode = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<polyline points="16 18 22 12 16 6"></polyline>
		<polyline points="8 6 2 12 8 18"></polyline>
	</svg>
);

const FiShield = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
	</svg>
);

const categories: Category[] = [
	{ id: "1", name: "Web Development", icon: <FiMonitor />, courses: 124 },
	{ id: "2", name: "Data Science", icon: <FiBarChart2 />, courses: 87 },
	{ id: "3", name: "Mobile Development", icon: <FiSmartphone />, courses: 56 },
	{ id: "4", name: "Programming", icon: <FiCode />, courses: 203 },
	{ id: "5", name: "Design", icon: <FiEdit />, courses: 92 },
	{ id: "6", name: "Business", icon: <FiBriefcase />, courses: 145 },
	{ id: "7", name: "Cloud Computing", icon: <FiServer />, courses: 78 },
	{ id: "8", name: "DevOps", icon: <FiTool />, courses: 63 },
	{ id: "9", name: "Databases", icon: <FiDatabase />, courses: 51 },
	{ id: "10", name: "Cybersecurity", icon: <FiShield />, courses: 42 },
];

const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "course",
		title: "New lesson available",
		message:
			"A new lesson 'Advanced State Management' has been added to your React course",
		time: "2 hours ago",
		read: false,
		actionUrl: "#",
	},
	{
		id: "2",
		type: "message",
		title: "Message from instructor",
		message: "Sarah Johnson replied to your question about React Context API",
		time: "1 day ago",
		read: true,
		actionUrl: "#",
	},
	{
		id: "3",
		type: "system",
		title: "Upcoming maintenance",
		message:
			"LearnHub Pro will be undergoing scheduled maintenance on Sunday at 2 AM UTC",
		time: "2 days ago",
		read: false,
	},
	{
		id: "4",
		type: "achievement",
		title: "Achievement unlocked",
		message: "Congratulations! You earned the '7-Day Streak' achievement",
		time: "3 days ago",
		read: true,
		actionUrl: "#",
	},
	{
		id: "5",
		type: "course",
		title: "Course on sale",
		message: "TypeScript Masterclass is now 35% off for the next 48 hours",
		time: "4 days ago",
		read: true,
		actionUrl: "#",
	},
];

const learningPaths: LearningPath[] = [
	{
		id: "1",
		title: "Full Stack JavaScript Developer",
		description:
			"Master frontend and backend development with JavaScript and related technologies",
		courses: 5,
		duration: "45 hours",
		level: "Intermediate",
		progress: 65,
		thumbnail: "https://source.unsplash.com/random/600x400/?javascript,coding",
	},
	{
		id: "2",
		title: "Data Scientist Career Path",
		description:
			"Learn Python, statistics, machine learning and visualization to become a data scientist",
		courses: 7,
		duration: "72 hours",
		level: "Advanced",
		progress: 30,
		thumbnail: "https://source.unsplash.com/random/600x400/?data,science",
	},
	{
		id: "3",
		title: "UX/UI Design Professional",
		description:
			"Comprehensive path to learn user experience and interface design principles",
		courses: 4,
		duration: "38 hours",
		level: "Beginner",
		progress: 10,
		thumbnail: "https://source.unsplash.com/random/600x400/?ui,design",
	},
];

const userStats: UserStats = {
	streakDays: 12,
	hoursLearned: 87,
	coursesCompleted: 4,
	certificatesEarned: 3,
	quizAverage: 92,
};

const liveSessions: LiveSession[] = [
	{
		id: "1",
		title: "Q&A: Advanced React Patterns",
		instructor: "Sarah Johnson",
		date: "April 10, 2023",
		time: "2:00 PM EST",
		duration: "1 hour",
		thumbnail: "https://source.unsplash.com/random/600x400/?webinar,conference",
		participants: 156,
		category: "Frontend Development",
		registered: true,
	},
	{
		id: "2",
		title: "Introduction to Data Visualization with D3.js",
		instructor: "Michael Chen",
		date: "April 12, 2023",
		time: "11:00 AM EST",
		duration: "1.5 hours",
		thumbnail: "https://source.unsplash.com/random/600x400/?data,chart",
		participants: 89,
		category: "Data Visualization",
		registered: false,
	},
	{
		id: "3",
		title: "Building RESTful APIs with Node.js",
		instructor: "David Wilson",
		date: "April 15, 2023",
		time: "3:30 PM EST",
		duration: "1 hour",
		thumbnail: "https://source.unsplash.com/random/600x400/?api,server",
		participants: 112,
		category: "Backend Development",
		registered: false,
	},
];

const coupons: Coupon[] = [
	{
		id: "1",
		code: "SPRING25",
		discount: 25,
		expiryDate: "April 30, 2023",
	},
	{
		id: "2",
		code: "NEWUSER10",
		discount: 10,
		expiryDate: "December 31, 2023",
	},
];

const LearningPaths = ({
	showToast,
}: {
	showToast: (message: string, type?: "success" | "error") => void;
}) => {
	return (
		<>
			<div className="mb-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800">Learning Paths</h2>
					<div className="flex items-center">
						<div className="relative">
							<select className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option>All Levels</option>
								<option>Beginner</option>
								<option>Intermediate</option>
								<option>Advanced</option>
							</select>
							<FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{learningPaths.map((path) => (
						<motion.div
							key={path.id}
							whileHover={{ y: -5 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
						>
							<div className="relative h-40">
								<img
									src={path.thumbnail}
									alt={path.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
									}}
								/>
								<div
									className={`absolute bottom-0 left-0 right-0 h-2 ${
										path.progress > 0 ? "bg-gray-200" : "bg-transparent"
									}`}
								>
									{path.progress > 0 && (
										<div
											className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
											style={{ width: `${path.progress}%` }}
										></div>
									)}
								</div>
							</div>
							<div className="p-5">
								<div className="flex justify-between mb-2">
									<span
										className={`text-xs px-2 py-1 rounded-full ${
											path.level === "Beginner"
												? "bg-green-100 text-green-800"
												: path.level === "Intermediate"
												? "bg-blue-100 text-blue-800"
												: "bg-purple-100 text-purple-800"
										}`}
									>
										{path.level}
									</span>
									{path.progress > 0 && (
										<span className="text-xs text-blue-600 font-medium">
											{path.progress}% complete
										</span>
									)}
								</div>

								<h4 className="font-bold text-lg text-gray-800 mb-2">
									{path.title}
								</h4>
								<p className="text-sm text-gray-600 mb-4 line-clamp-2">
									{path.description}
								</p>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<FiLayers className="mr-1" />
										<span>{path.courses} courses</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<FiClock className="mr-1" />
										<span>{path.duration}</span>
									</div>
								</div>

								<button
									className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									onClick={() =>
										showToast(`Learning path: ${path.title} - Coming soon!`)
									}
								>
									{path.progress > 0 ? "Continue Path" : "Start Path"}
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6 mb-8">
				<h3 className="text-xl font-bold text-gray-800 mb-4">
					Featured Learning Path
				</h3>

				<div className="flex flex-col md:flex-row">
					<div className="md:w-1/3 pr-0 md:pr-6 mb-6 md:mb-0">
						<div className="relative rounded-xl overflow-hidden h-48 md:h-full">
							<img
								src="https://source.unsplash.com/random/600x400/?coding,development"
								alt="Full Stack Developer Path"
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).src =
										"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
								<span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2 w-fit">
									Trending
								</span>
								<h4 className="text-white font-bold text-lg">
									Full Stack Developer Path
								</h4>
							</div>
						</div>
					</div>
					<div className="md:w-2/3">
						<h4 className="text-xl font-bold text-gray-800 mb-2">
							Full Stack Developer Career Path
						</h4>
						<p className="text-gray-600 mb-4">
							Master the complete web development stack from frontend to
							backend. This comprehensive learning path will take you from a
							beginner to a professional full stack developer ready for the
							modern job market.
						</p>

						<div className="grid grid-cols-2 gap-4 mb-6">
							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
									<FiLayers />
								</div>
								<div>
									<h5 className="font-medium text-gray-800">8 Courses</h5>
									<p className="text-xs text-gray-500">Carefully curated</p>
								</div>
							</div>
							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
									<FiClock />
								</div>
								<div>
									<h5 className="font-medium text-gray-800">80+ Hours</h5>
									<p className="text-xs text-gray-500">Total content</p>
								</div>
							</div>
							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
									<Award />
								</div>
								<div>
									<h5 className="font-medium text-gray-800">Certificate</h5>
									<p className="text-xs text-gray-500">Upon completion</p>
								</div>
							</div>
							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
									<User />
								</div>
								<div>
									<h5 className="font-medium text-gray-800">2,500+ Students</h5>
									<p className="text-xs text-gray-500">Enrolled</p>
								</div>
							</div>
						</div>

						<div className="space-y-3 mb-6">
							<h5 className="font-medium text-gray-800">Path Progress</h5>
							<div className="w-full bg-gray-200 rounded-full h-2.5">
								<div
									className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full"
									style={{ width: "25%" }}
								></div>
							</div>
							<div className="flex justify-between text-sm text-gray-600">
								<span>2/8 courses completed</span>
								<span>25% complete</span>
							</div>
						</div>

						<button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
							Continue Learning Path
						</button>
					</div>
				</div>
			</div>

			<div className="mb-8">
				<h3 className="text-2xl font-bold text-gray-800 mb-6">
					How Learning Paths Work
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
							<FiMap className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Follow a Clear Roadmap
						</h4>
						<p className="text-gray-600">
							Each learning path provides a structured curriculum designed by
							industry experts to help you achieve specific career goals.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
							<BookOpen className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Learn at Your Own Pace
						</h4>
						<p className="text-gray-600">
							Take courses in sequence with the flexibility to pause, review,
							and practice at your own pace as you progress through the path.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
							<Award className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Earn Path Certificates
						</h4>
						<p className="text-gray-600">
							Receive a comprehensive path certificate when you complete all
							courses, showcasing your new skill set to employers.
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
				<div className="max-w-3xl mx-auto text-center">
					<h3 className="text-2xl md:text-3xl font-bold mb-4">
						Create Your Custom Learning Path
					</h3>
					<p className="text-lg mb-6 opacity-90">
						Need a more personalized approach? Our AI-powered recommendation
						system can create a custom learning path tailored to your specific
						career goals and current skill level.
					</p>
					<button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors">
						Get Custom Recommendations
					</button>
				</div>
			</div>
		</>
	);
};

const Certificates = ({
	showToast,
	handleViewCourse,
}: {
	showToast: (message: string, type?: "success" | "error") => void;
	handleViewCourse: (course: Course) => void;
}) => {
	const certificates = [
		{
			id: "1",
			title: "React Advanced Patterns",
			issueDate: "March 15, 2023",
			instructor: "Sarah Johnson",
			credentialId: "CERT-RAP-2023-7281",
			image: "https://source.unsplash.com/random/600x400/?certificate,react",
		},
		{
			id: "2",
			title: "Frontend Web Development",
			issueDate: "January 10, 2023",
			instructor: "Michael Chen",
			credentialId: "CERT-FWD-2023-4912",
			image: "https://source.unsplash.com/random/600x400/?certificate,web",
		},
		{
			id: "3",
			title: "TypeScript Masterclass",
			issueDate: "April 28, 2023",
			instructor: "David Wilson",
			credentialId: "CERT-TSM-2023-3650",
			image:
				"https://source.unsplash.com/random/600x400/?certificate,typescript",
		},
	];

	return (
		<>
			<div className="mb-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800">
						Your Certificates
					</h2>
					<div className="flex items-center space-x-3">
						<div className="relative">
							<select className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option>All Certificates</option>
								<option>Completed</option>
								<option>In Progress</option>
							</select>
							<FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
						</div>
						<button className="p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 transition-colors">
							<FiDownload className="text-lg" />
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{certificates.map((certificate) => (
						<motion.div
							key={certificate.id}
							whileHover={{ y: -5 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
						>
							<div className="relative h-48">
								<img
									src={certificate.image}
									alt={certificate.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
									}}
								/>
								<div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-colors flex items-center justify-center">
									<div className="opacity-0 hover:opacity-100 transition-opacity">
										<button
											className="bg-white p-3 rounded-full text-blue-600 hover:text-blue-800 transition-colors"
											onClick={() =>
												showToast("Viewing certificate details...")
											}
										>
											<FiEye className="text-xl" />
										</button>
									</div>
								</div>
							</div>
							<div className="p-5">
								<h4 className="font-bold text-lg text-gray-800 mb-2">
									{certificate.title}
								</h4>
								<p className="text-sm text-gray-600 mb-4">
									Instructor: {certificate.instructor}
								</p>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<FiCalendar className="mr-1" />
										<span>{certificate.issueDate}</span>
									</div>
								</div>

								<div className="text-xs text-gray-500 mb-4">
									Credential ID: {certificate.credentialId}
								</div>

								<div className="flex space-x-2">
									<button
										className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all"
										onClick={() => showToast("Downloading certificate...")}
									>
										<FiDownload className="inline mr-1" /> Download
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6 mb-8">
				<h3 className="text-xl font-bold text-gray-800 mb-6">
					Certificates in Progress
				</h3>

				<div className="space-y-4">
					{mockCourses
						.filter((course) => course.progress > 0 && course.progress < 100)
						.slice(0, 3)
						.map((course) => (
							<div
								key={course.id}
								className="flex flex-col md:flex-row border border-gray-200 rounded-lg p-4"
							>
								<div className="md:w-16 w-full mb-4 md:mb-0 md:mr-4">
									<div className="relative md:w-16 md:h-16 h-24 mb-2 md:mb-0 rounded-lg overflow-hidden">
										<img
											src={course.thumbnail}
											alt={course.title}
											className="w-full h-full object-cover"
											onError={(e) => {
												(e.target as HTMLImageElement).src =
													"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
											}}
										/>
									</div>
								</div>
								<div className="flex-1">
									<h4 className="font-medium text-gray-800 mb-1">
										{course.title}
									</h4>
									<p className="text-sm text-gray-600 mb-2">
										{course.progress}% completed
									</p>
									<div className="w-full bg-gray-200 rounded-full h-2 mb-2">
										<div
											className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
											style={{ width: `${course.progress}%` }}
										></div>
									</div>
									<p className="text-xs text-gray-500">
										Complete this course to earn your certificate
									</p>
								</div>
								<div className="md:ml-4 mt-4 md:mt-0 flex md:flex-col justify-end md:justify-center items-center md:items-end space-x-2 md:space-x-0 md:space-y-2">
									<span className="text-sm text-gray-600 md:text-right">
										{course.completedLessons}/{course.totalLessons} lessons
									</span>
									<button
										className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
										onClick={() => handleViewCourse(course)}
									>
										Continue
									</button>
								</div>
							</div>
						))}
				</div>
			</div>

			<div className="mb-8">
				<h3 className="text-2xl font-bold text-gray-800 mb-6">
					Certificate Benefits
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
							<FiBriefcase className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Career Advancement
						</h4>
						<p className="text-gray-600">
							Showcase your skills to potential employers and stand out in job
							applications.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
							<FiCheckCircle className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Skill Verification
						</h4>
						<p className="text-gray-600">
							Provide proof of your expertise with certificates verified by
							industry professionals.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
							<FiLink className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							LinkedIn Integration
						</h4>
						<p className="text-gray-600">
							Add certificates directly to your LinkedIn profile to enhance your
							professional presence.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
							<FiTrendingUp className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Continuous Growth
						</h4>
						<p className="text-gray-600">
							Track your learning progress and motivate yourself to keep
							developing new skills.
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
				<div className="max-w-3xl mx-auto text-center">
					<h3 className="text-2xl md:text-3xl font-bold mb-4">
						Ready to Earn More Certificates?
					</h3>
					<p className="text-lg mb-6 opacity-90">
						Explore our catalog of courses and start working toward your next
						professional certificate today.
					</p>
					<button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors">
						Explore Courses
					</button>
				</div>
			</div>
		</>
	);
};

const FiVideo = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon points="23 7 16 12 23 17 23 7"></polygon>
		<rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
	</svg>
);

const LiveSessions = ({
	showToast,
}: {
	showToast: (message: string, type?: "success" | "error") => void;
}) => {
	const upcomingSessions = [
		{
			id: "4",
			title: "Mastering React Performance Optimization",
			instructor: "Sarah Johnson",
			date: "April 20, 2023",
			time: "1:00 PM EST",
			duration: "1.5 hours",
			thumbnail:
				"https://source.unsplash.com/random/600x400/?conference,coding",
			participants: 178,
			category: "Frontend Development",
			registered: false,
			description:
				"Learn advanced techniques to dramatically improve your React application's performance. We'll cover code splitting, memoization, virtualization, and more.",
		},
		{
			id: "5",
			title: "Building Scalable APIs with Node.js",
			instructor: "David Wilson",
			date: "April 22, 2023",
			time: "11:00 AM EST",
			duration: "2 hours",
			thumbnail: "https://source.unsplash.com/random/600x400/?server,coding",
			participants: 145,
			category: "Backend Development",
			registered: true,
			description:
				"This session covers best practices for creating robust and scalable APIs using Node.js, Express, and MongoDB. Perfect for intermediate developers looking to level up.",
		},
		{
			id: "6",
			title: "Introduction to AI and Machine Learning",
			instructor: "Priya Patel",
			date: "April 25, 2023",
			time: "3:00 PM EST",
			duration: "1 hour",
			thumbnail:
				"https://source.unsplash.com/random/600x400/?artificial,intelligence",
			participants: 232,
			category: "Data Science",
			registered: false,
			description:
				"Get started with the fundamentals of AI and machine learning. This beginner-friendly session will introduce key concepts and practical applications.",
		},
	];

	const pastSessions = [
		{
			id: "7",
			title: "Web Accessibility: Best Practices",
			instructor: "Emma Rodriguez",
			date: "April 5, 2023",
			time: "2:00 PM EST",
			duration: "1 hour",
			thumbnail:
				"https://source.unsplash.com/random/600x400/?accessibility,web",
			participants: 132,
			category: "Web Development",
			recording: true,
		},
		{
			id: "8",
			title: "Git & GitHub for Team Collaboration",
			instructor: "Alex Thompson",
			date: "March 28, 2023",
			time: "11:30 AM EST",
			duration: "1.5 hours",
			thumbnail:
				"https://source.unsplash.com/random/600x400/?github,collaboration",
			participants: 201,
			category: "DevOps",
			recording: true,
		},
	];

	return (
		<>
			<div className="mb-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800">Live Sessions</h2>
					<div className="flex items-center space-x-3">
						<div className="relative">
							<select className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option>All Categories</option>
								<option>Frontend Development</option>
								<option>Backend Development</option>
								<option>Data Science</option>
								<option>DevOps</option>
							</select>
							<FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
						</div>
						<div className="relative">
							<select className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option>Upcoming</option>
								<option>Registered</option>
								<option>Past Sessions</option>
							</select>
							<FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6 mb-8">
					<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
						<FiCalendar className="text-blue-600 mr-2" /> Featured Session
					</h3>

					<div className="flex flex-col md:flex-row">
						<div className="md:w-2/5 pr-0 md:pr-6 mb-6 md:mb-0">
							<div className="relative rounded-xl overflow-hidden h-64">
								<img
									src="https://source.unsplash.com/random/600x400/?webinar,tech"
									alt="Featured Session"
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
									}}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
							</div>
						</div>
						<div className="md:w-3/5">
							<div className="mb-2">
								<span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
									Web Development
								</span>
							</div>
							<h4 className="text-xl font-bold text-gray-800 mb-2">
								Modern Frontend Frameworks: Comparing React, Vue, and Angular
							</h4>
							<p className="text-gray-600 mb-4">
								Join our panel of expert instructors as they break down the pros
								and cons of today's most popular frontend frameworks. Perfect
								for developers looking to choose their next technology stack.
							</p>

							<div className="grid grid-cols-2 gap-y-4 mb-6">
								<div className="flex items-center">
									<User className="text-gray-500 mr-2" />
									<div>
										<h5 className="text-sm font-medium text-gray-800">
											Instructor
										</h5>
										<p className="text-sm text-gray-600">Multiple Experts</p>
									</div>
								</div>
								<div className="flex items-center">
									<FiCalendar className="text-gray-500 mr-2" />
									<div>
										<h5 className="text-sm font-medium text-gray-800">Date</h5>
										<p className="text-sm text-gray-600">April 18, 2023</p>
									</div>
								</div>
								<div className="flex items-center">
									<FiClock className="text-gray-500 mr-2" />
									<div>
										<h5 className="text-sm font-medium text-gray-800">Time</h5>
										<p className="text-sm text-gray-600">2:00 PM EST</p>
									</div>
								</div>
								<div className="flex items-center">
									<Users className="text-gray-500 mr-2" />
									<div>
										<h5 className="text-sm font-medium text-gray-800">
											Participants
										</h5>
										<p className="text-sm text-gray-600">325 enrolled</p>
									</div>
								</div>
							</div>

							<div className="flex space-x-3">
								<button
									className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all"
									onClick={() =>
										showToast("Successfully registered for the session!")
									}
								>
									Register Now
								</button>
								<button
									className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
									onClick={() => showToast("Added to calendar!")}
								>
									Add to Calendar
								</button>
							</div>
						</div>
					</div>
				</div>

				<h3 className="text-xl font-bold text-gray-800 mb-4">
					Upcoming Sessions
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{upcomingSessions.map((session) => (
						<motion.div
							key={session.id}
							whileHover={{ y: -5 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
						>
							<div className="relative h-40">
								<img
									src={session.thumbnail}
									alt={session.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
									}}
								/>
								{session.registered && (
									<div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
										Registered
									</div>
								)}
							</div>
							<div className="p-5">
								<div className="mb-2">
									<span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
										{session.category}
									</span>
								</div>

								<h4 className="font-bold text-lg text-gray-800 mb-2">
									{session.title}
								</h4>
								<p className="text-sm text-gray-600 mb-2">
									Instructor: {session.instructor}
								</p>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<FiCalendar className="mr-1" />
										<span>{session.date}</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<FiClock className="mr-1" />
										<span>{session.time}</span>
									</div>
								</div>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<FiClock className="mr-1" />
										<span>{session.duration}</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<Users className="mr-1" />
										<span>{session.participants} enrolled</span>
									</div>
								</div>

								<button
									className={`w-full py-2 ${
										session.registered
											? "bg-gray-100 text-gray-800"
											: "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
									} font-medium rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
									onClick={() => {
										if (!session.registered) {
											showToast(`Registered for ${session.title}`);
										} else {
											showToast("Session details");
										}
									}}
								>
									{session.registered ? "View Details" : "Register Now"}
								</button>
							</div>
						</motion.div>
					))}
				</div>

				<h3 className="text-xl font-bold text-gray-800 mb-4">Past Sessions</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{pastSessions.map((session) => (
						<motion.div
							key={session.id}
							whileHover={{ y: -5 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
						>
							<div className="relative h-40">
								<img
									src={session.thumbnail}
									alt={session.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
									}}
								/>
								<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
									<div className="bg-white bg-opacity-90 rounded-full p-3">
										<FiPlay className="text-blue-600 text-xl" />
									</div>
								</div>
								{session.recording && (
									<div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
										Recording Available
									</div>
								)}
							</div>
							<div className="p-5">
								<div className="mb-2">
									<span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
										{session.category}
									</span>
								</div>

								<h4 className="font-bold text-lg text-gray-800 mb-2">
									{session.title}
								</h4>
								<p className="text-sm text-gray-600 mb-2">
									Instructor: {session.instructor}
								</p>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<FiCalendar className="mr-1" />
										<span>{session.date}</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<FiClock className="mr-1" />
										<span>{session.time}</span>
									</div>
								</div>

								<button
									className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									onClick={() => showToast("Watching recording...")}
								>
									Watch Recording
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<div className="mb-8">
				<h3 className="text-2xl font-bold text-gray-800 mb-6">
					How Live Sessions Work
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
							<UserPlus className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">Register</h4>
						<p className="text-gray-600">
							Choose and register for sessions that interest you from our
							extensive catalog.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
							<FiBell className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Get Reminded
						</h4>
						<p className="text-gray-600">
							Receive email and in-app notifications before the session begins.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
							<FiVideo className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">Join Live</h4>
						<p className="text-gray-600">
							Participate in the interactive session with real-time Q&A and
							discussions.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
							<FiPlayCircle className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Watch Later
						</h4>
						<p className="text-gray-600">
							Access recordings of past sessions at your convenience.
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
				<div className="max-w-3xl mx-auto text-center">
					<h3 className="text-2xl md:text-3xl font-bold mb-4">
						Host Your Own Live Session
					</h3>
					<p className="text-lg mb-6 opacity-90">
						Are you an expert in your field? Apply to become an instructor and
						share your knowledge with our community.
					</p>
					<button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors">
						Apply as Instructor
					</button>
				</div>
			</div>
		</>
	);
};

const FiShare2 = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="18" cy="5" r="3"></circle>
		<circle cx="6" cy="12" r="3"></circle>
		<circle cx="18" cy="19" r="3"></circle>
		<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
		<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
	</svg>
);

const FiEye = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
		<circle cx="12" cy="12" r="3"></circle>
	</svg>
);

const FiLink = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
		<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
	</svg>
);

const FiMap = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
		<line x1="8" y1="2" x2="8" y2="18"></line>
		<line x1="16" y1="6" x2="16" y2="22"></line>
	</svg>
);

const BookOpen = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
		<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
	</svg>
);

const UserPlus = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
		<circle cx="8.5" cy="7" r="4"></circle>
		<line x1="20" y1="8" x2="20" y2="14"></line>
		<line x1="23" y1="11" x2="17" y2="11"></line>
	</svg>
);

const FiPlayCircle = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="12" cy="12" r="10"></circle>
		<polygon points="10 8 16 12 10 16 10 8"></polygon>
	</svg>
);

const Instructors = ({
	showToast,
}: {
	showToast: (message: string, type?: "success" | "error") => void;
}) => {
	const instructors = [
		{
			id: "1",
			name: "Sarah Johnson",
			role: "Senior Frontend Developer",
			bio: "Sarah is a frontend expert with 10+ years of experience building modern web applications. She specializes in React, TypeScript, and accessibility.",
			avatar: "https://i.pravatar.cc/150?img=44",
			courses: 12,
			students: 8750,
			rating: 4.8,
			social: {
				twitter: "#",
				linkedin: "#",
				github: "#",
			},
			expertise: [
				"React",
				"TypeScript",
				"Frontend Architecture",
				"Performance Optimization",
			],
		},
		{
			id: "2",
			name: "Michael Chen",
			role: "Full Stack Developer",
			bio: "Michael is a full stack developer who loves teaching complex concepts in simple ways. He has worked with startups and large enterprises across various industries.",
			avatar: "https://i.pravatar.cc/150?img=32",
			courses: 8,
			students: 6420,
			rating: 4.9,
			social: {
				twitter: "#",
				linkedin: "#",
				github: "#",
			},
			expertise: ["JavaScript", "TypeScript", "Node.js", "MongoDB", "Express"],
		},
		{
			id: "3",
			name: "Emma Rodriguez",
			role: "UX/UI Designer",
			bio: "Emma bridges the gap between design and development. With a background in both fields, she teaches how to create beautiful and functional user interfaces.",
			avatar: "https://i.pravatar.cc/150?img=68",
			courses: 6,
			students: 4580,
			rating: 4.7,
			social: {
				twitter: "#",
				linkedin: "#",
				github: "#",
			},
			expertise: [
				"UI Design",
				"Design Systems",
				"User Research",
				"Figma",
				"Adobe XD",
			],
		},
		{
			id: "4",
			name: "David Wilson",
			role: "Backend Developer",
			bio: "David specializes in scalable backend architecture. He has built systems that handle millions of requests daily and loves sharing his knowledge on best practices.",
			avatar: "https://i.pravatar.cc/150?img=75",
			courses: 10,
			students: 7320,
			rating: 4.6,
			social: {
				twitter: "#",
				linkedin: "#",
				github: "#",
			},
			expertise: [
				"Node.js",
				"Python",
				"RESTful APIs",
				"GraphQL",
				"Database Design",
			],
		},
		{
			id: "5",
			name: "Priya Patel",
			role: "Data Scientist",
			bio: "Priya has a Ph.D. in Computer Science with a focus on machine learning. She makes complex data science concepts accessible to everyone.",
			avatar: "https://i.pravatar.cc/150?img=63",
			courses: 5,
			students: 3950,
			rating: 4.8,
			social: {
				twitter: "#",
				linkedin: "#",
				github: "#",
			},
			expertise: [
				"Python",
				"Machine Learning",
				"Data Analysis",
				"Statistics",
				"TensorFlow",
			],
		},
		{
			id: "6",
			name: "Alex Thompson",
			role: "DevOps Engineer",
			bio: "Alex has helped hundreds of companies improve their deployment processes. He specializes in containerization, CI/CD pipelines, and cloud infrastructure.",
			avatar: "https://i.pravatar.cc/150?img=12",
			courses: 7,
			students: 5280,
			rating: 4.9,
			social: {
				twitter: "#",
				linkedin: "#",
				github: "#",
			},
			expertise: [
				"Docker",
				"Kubernetes",
				"AWS",
				"CI/CD",
				"Infrastructure as Code",
			],
		},
	];

	return (
		<>
			<div className="mb-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800">
						Our Expert Instructors
					</h2>
					<div className="flex items-center">
						<div className="relative">
							<select className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option>All Expertise</option>
								<option>Frontend</option>
								<option>Backend</option>
								<option>Data Science</option>
								<option>DevOps</option>
								<option>Design</option>
							</select>
							<FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{instructors.map((instructor) => (
						<motion.div
							key={instructor.id}
							whileHover={{ y: -5 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
						>
							<div className="p-6">
								<div className="flex items-center mb-4">
									<img
										src={instructor.avatar}
										alt={instructor.name}
										className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-100"
									/>
									<div>
										<h3 className="font-bold text-lg text-gray-800">
											{instructor.name}
										</h3>
										<p className="text-blue-600">{instructor.role}</p>
									</div>
								</div>

								<p className="text-gray-600 mb-4 line-clamp-3">
									{instructor.bio}
								</p>

								<div className="flex flex-wrap gap-1 mb-4">
									{instructor.expertise.slice(0, 3).map((skill, index) => (
										<span
											key={index}
											className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
										>
											{skill}
										</span>
									))}
									{instructor.expertise.length > 3 && (
										<span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
											+{instructor.expertise.length - 3} more
										</span>
									)}
								</div>

								<div className="flex justify-between items-center mb-4">
									<div className="flex items-center">
										<FiStar className="text-yellow-500 fill-current mr-1" />
										<span className="font-medium">{instructor.rating}</span>
										<span className="text-gray-500 ml-1">
											({instructor.students} students)
										</span>
									</div>
									<div className="text-gray-600 text-sm">
										{instructor.courses} courses
									</div>
								</div>

								<div className="flex justify-between">
									<div className="flex space-x-2">
										<a
											href={instructor.social.twitter}
											className="text-gray-500 hover:text-blue-500 transition-colors"
											aria-label={`${instructor.name}'s Twitter`}
											onClick={(e) => {
												e.preventDefault();
												showToast("Twitter profile");
											}}
										>
											<FiTwitter />
										</a>
										<a
											href={instructor.social.linkedin}
											className="text-gray-500 hover:text-blue-700 transition-colors"
											aria-label={`${instructor.name}'s LinkedIn`}
											onClick={(e) => {
												e.preventDefault();
												showToast("LinkedIn profile");
											}}
										>
											<FiLinkedin />
										</a>
										<a
											href={instructor.social.github}
											className="text-gray-500 hover:text-gray-800 transition-colors"
											aria-label={`${instructor.name}'s GitHub`}
											onClick={(e) => {
												e.preventDefault();
												showToast("GitHub profile");
											}}
										>
											<FiGithub />
										</a>
									</div>
									<button
										className="text-blue-600 hover:text-blue-800 font-medium text-sm"
										onClick={() =>
											showToast(`Viewing ${instructor.name}'s profile`)
										}
									>
										View Profile
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6 mb-8">
				<h3 className="text-xl font-bold text-gray-800 mb-6">
					Featured Instructor
				</h3>

				<div className="flex flex-col md:flex-row">
					<div className="md:w-1/3 pr-0 md:pr-8 mb-6 md:mb-0">
						<div className="rounded-xl overflow-hidden">
							<img
								src="https://i.pravatar.cc/400?img=50"
								alt="Featured Instructor"
								className="w-full aspect-square object-cover"
							/>
						</div>
					</div>
					<div className="md:w-2/3">
						<div className="flex justify-between items-start mb-2">
							<div>
								<h3 className="text-2xl font-bold text-gray-800">
									Dr. Robert Garcia
								</h3>
								<p className="text-blue-600 font-medium">
									Cloud Computing & AWS Expert
								</p>
							</div>
							<div className="flex items-center">
								<FiStar className="text-yellow-500 fill-current mr-1" />
								<span className="font-medium">4.9</span>
								<span className="text-gray-500 ml-1">(9,240 students)</span>
							</div>
						</div>

						<p className="text-gray-600 mb-4">
							Dr. Garcia has over 15 years of experience in cloud architecture
							and has been teaching online for the past 8 years. Before becoming
							an instructor, he worked as a Cloud Architect at AWS and led major
							infrastructure transformations for Fortune 500 companies. His
							teaching approach combines theoretical knowledge with practical,
							hands-on projects that prepare you for real-world challenges.
						</p>

						<h4 className="font-bold text-gray-800 mb-2">Expertise</h4>
						<div className="flex flex-wrap gap-2 mb-4">
							<span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
								AWS
							</span>
							<span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
								Cloud Architecture
							</span>
							<span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
								DevOps
							</span>
							<span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
								Security
							</span>
							<span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
								Serverless
							</span>
						</div>

						<h4 className="font-bold text-gray-800 mb-2">Popular Courses</h4>
						<div className="space-y-3 mb-6">
							<div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
									<img
										src="https://source.unsplash.com/random/100x100/?cloud,aws"
										alt="AWS Course"
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex-1">
									<h5 className="font-medium text-gray-800">
										AWS Cloud Practitioner Certification
									</h5>
									<div className="flex items-center text-xs">
										<div className="flex items-center text-yellow-500">
											<FiStar className="fill-current" />
											<FiStar className="fill-current" />
											<FiStar className="fill-current" />
											<FiStar className="fill-current" />
											<FiStar className="fill-current" />
										</div>
										<span className="text-gray-500 ml-1">(2,430 reviews)</span>
									</div>
								</div>
								<button className="text-blue-600 hover:text-blue-800">
									View
								</button>
							</div>

							<div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
									<img
										src="https://source.unsplash.com/random/100x100/?serverless"
										alt="Serverless Course"
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex-1">
									<h5 className="font-medium text-gray-800">
										Serverless Architecture with AWS Lambda
									</h5>
									<div className="flex items-center text-xs">
										<div className="flex items-center text-yellow-500">
											<FiStar className="fill-current" />
											<FiStar className="fill-current" />
											<FiStar className="fill-current" />
											<FiStar className="fill-current" />
											<FiStar className="fill-current" />
										</div>
										<span className="text-gray-500 ml-1">(1,876 reviews)</span>
									</div>
								</div>
								<button className="text-blue-600 hover:text-blue-800">
									View
								</button>
							</div>
						</div>

						<div className="flex space-x-3">
							<button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all">
								View All Courses
							</button>
							<button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
								Follow Instructor
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-8">
				<h3 className="text-2xl font-bold text-gray-800 mb-6">
					Join Our Instructor Team
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
							<FiDollarSign className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Earn Income
						</h4>
						<p className="text-gray-600">
							Share your knowledge and expertise while earning competitive
							compensation for your courses.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
							<Users className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Reach Students
						</h4>
						<p className="text-gray-600">
							Connect with thousands of motivated learners eager to master your
							area of expertise.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
							<FiTool className="text-2xl" />
						</div>
						<h4 className="text-lg font-bold text-gray-800 mb-2">
							Get Support
						</h4>
						<p className="text-gray-600">
							Our team helps with course creation, marketing, and technical
							assistance for success.
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
				<div className="max-w-3xl mx-auto text-center">
					<h3 className="text-2xl md:text-3xl font-bold mb-4">
						Become an Instructor Today
					</h3>
					<p className="text-lg mb-6 opacity-90">
						Share your expertise with our global community. Apply now to join
						our team of professional educators.
					</p>
					<button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors">
						Apply to Teach
					</button>
				</div>
			</div>
		</>
	);
};

const Profile = ({
	userName,
	setUserName,
	userEmail,
	setUserEmail,
	userAvatar,
	showToast,
	userStats,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: userName,
		email: userEmail,
		profession: "Software Developer",
		location: "New York, USA",
		bio: "Passionate about learning new technologies and building innovative solutions.",
		github: "",
		linkedin: "",
		website: "",
	});

	const [socialProfiles, setSocialProfiles] = useState({
		github: "github-username",
		linkedin: "linkedin-profile",
		website: "yourwebsite.com",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		setUserName(formData.name);
		setUserEmail(formData.email);

		showToast("Profile updated successfully!");
		setIsEditing(false);
	};

	const toggleEditMode = () => {
		if (isEditing) {
			setFormData({
				name: userName,
				email: userEmail,
				profession: formData.profession,
				location: formData.location,
				bio: formData.bio,
				github: socialProfiles.github,
				linkedin: socialProfiles.linkedin,
				website: socialProfiles.website,
			});
		}
		setIsEditing(!isEditing);
	};

	return (
		<div className="mb-8">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
				<button
					className={`px-4 py-2 ${
						isEditing ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"
					} font-medium rounded-lg transition-colors`}
					onClick={toggleEditMode}
				>
					{isEditing ? "Cancel" : "Edit Profile"}
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-md overflow-hidden">
				<div className="p-6">
					<div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
						<div className="relative">
							<img
								src={userAvatar}
								alt="User avatar"
								className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
							/>
							{isEditing && (
								<button
									className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
									onClick={() => showToast("Photo upload feature enabled!")}
								>
									<FiEdit className="text-sm" />
								</button>
							)}
						</div>

						<div>
							<h3 className="text-2xl font-bold text-gray-800 mb-1">
								{isEditing ? formData.name : userName}
							</h3>
							<p className="text-gray-600 mb-3">
								{isEditing ? formData.email : userEmail}
							</p>
							<div className="flex flex-wrap gap-2">
								<span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
									Pro Member
								</span>
								<span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
									{userStats.coursesCompleted} Courses Completed
								</span>
								<span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
									{userStats.streakDays} Day Streak
								</span>
							</div>
						</div>
					</div>

					{isEditing ? (
						<form onSubmit={handleSubmit}>
							<div className="mb-8">
								<h4 className="text-lg font-bold text-gray-800 mb-4">
									Account Details
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Full Name*
										</label>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email Address*
										</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Profession
										</label>
										<input
											type="text"
											name="profession"
											value={formData.profession}
											onChange={handleChange}
											placeholder="e.g. Software Developer"
											className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Location
										</label>
										<input
											type="text"
											name="location"
											value={formData.location}
											onChange={handleChange}
											placeholder="e.g. New York, USA"
											className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								</div>
							</div>

							<div className="mb-8">
								<h4 className="text-lg font-bold text-gray-800 mb-4">Bio</h4>
								<textarea
									name="bio"
									value={formData.bio}
									onChange={handleChange}
									placeholder="Tell us a bit about yourself..."
									className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
								></textarea>
							</div>

							<div className="mb-8">
								<h4 className="text-lg font-bold text-gray-800 mb-4">
									Social Profiles
								</h4>
								<div className="space-y-4">
									<div className="flex items-center">
										<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mr-3">
											<FiGithub />
										</div>
										<div className="flex-1">
											<input
												type="text"
												name="github"
												value={formData.github}
												onChange={handleChange}
												placeholder="GitHub Username"
												className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
									</div>
									<div className="flex items-center">
										<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mr-3">
											<FiLinkedin />
										</div>
										<div className="flex-1">
											<input
												type="text"
												name="linkedin"
												value={formData.linkedin}
												onChange={handleChange}
												placeholder="LinkedIn Profile URL"
												className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
									</div>
									<div className="flex items-center">
										<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mr-3">
											<FiGlobe />
										</div>
										<div className="flex-1">
											<input
												type="text"
												name="website"
												value={formData.website}
												onChange={handleChange}
												placeholder="Personal Website URL"
												className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="flex justify-end">
								<button
									type="submit"
									className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									Save Changes
								</button>
							</div>
						</form>
					) : (
						<>
							<div className="mb-8">
								<h4 className="text-lg font-bold text-gray-800 mb-4">
									About Me
								</h4>
								<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
									<p className="text-gray-700">
										{formData.bio || "No bio provided yet."}
									</p>
								</div>
							</div>

							<div className="mb-8">
								<h4 className="text-lg font-bold text-gray-800 mb-4">
									Personal Information
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
										<h5 className="font-medium text-gray-700 mb-1">
											Profession
										</h5>
										<p className="text-gray-900">
											{formData.profession || "Not specified"}
										</p>
									</div>
									<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
										<h5 className="font-medium text-gray-700 mb-1">Location</h5>
										<p className="text-gray-900">
											{formData.location || "Not specified"}
										</p>
									</div>
								</div>
							</div>

							<div className="mb-8">
								<h4 className="text-lg font-bold text-gray-800 mb-4">
									Learning Statistics
								</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="bg-blue-50 rounded-lg p-4 border border-blue-100 text-center">
										<div className="text-2xl font-bold text-blue-800 mb-1">
											{userStats.streakDays}
										</div>
										<p className="text-sm text-blue-600">Day Streak</p>
									</div>
									<div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
										<div className="text-2xl font-bold text-green-800 mb-1">
											{userStats.hoursLearned}
										</div>
										<p className="text-sm text-green-600">Hours Learned</p>
									</div>
									<div className="bg-purple-50 rounded-lg p-4 border border-purple-100 text-center">
										<div className="text-2xl font-bold text-purple-800 mb-1">
											{userStats.coursesCompleted}
										</div>
										<p className="text-sm text-purple-600">Courses Completed</p>
									</div>
									<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 text-center">
										<div className="text-2xl font-bold text-yellow-800 mb-1">
											{userStats.certificatesEarned}
										</div>
										<p className="text-sm text-yellow-600">
											Certificates Earned
										</p>
									</div>
								</div>
							</div>

							<div className="mb-8">
								<h4 className="text-lg font-bold text-gray-800 mb-4">
									Social Profiles
								</h4>
								<div className="flex flex-wrap gap-3">
									{socialProfiles.github && (
										<a
											href={`https://github.com/${socialProfiles.github}`}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-800 hover:bg-gray-200 transition-colors"
										>
											<FiGithub className="mr-2" /> GitHub
										</a>
									)}
									{socialProfiles.linkedin && (
										<a
											href={`https://linkedin.com/in/${socialProfiles.linkedin}`}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-800 hover:bg-gray-200 transition-colors"
										>
											<FiLinkedin className="mr-2" /> LinkedIn
										</a>
									)}
									{socialProfiles.website && (
										<a
											href={`https://${socialProfiles.website}`}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-800 hover:bg-gray-200 transition-colors"
										>
											<FiGlobe className="mr-2" /> Website
										</a>
									)}
									{!socialProfiles.github &&
										!socialProfiles.linkedin &&
										!socialProfiles.website && (
											<p className="text-gray-500 italic">
												No social profiles added yet.
											</p>
										)}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const BrowseCourses = ({
	filteredCourses,
	categories,
	courseFilters,
	handleFilterChange,
	resetFilters,
	searchQuery,
	setSearchQuery,
	handleViewCourse,
	handleAddToWishlist,
	handleAddToCart,
	wishlist,
	cart,
}) => {
	const [sortOption, setSortOption] = useState("popular");

	const sortedCourses = useMemo(() => {
		let sorted = [...filteredCourses];

		switch (sortOption) {
			case "popular":
				return sorted.sort((a, b) => b.students - a.students);
			case "newest":
				return sorted.sort((a, b) => (b.new ? -1 : a.new ? 1 : 0));
			case "price-low":
				return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
			case "price-high":
				return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
			case "rating":
				return sorted.sort((a, b) => b.rating - a.rating);
			default:
				return sorted;
		}
	}, [filteredCourses, sortOption]);

	return (
		<div className="mb-8">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">
					{searchQuery ? `Search Results: "${searchQuery}"` : "Browse Courses"}
				</h2>
				<div className="flex items-center space-x-4">
					<div className="relative">
						<select
							className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							value={sortOption}
							onChange={(e) => setSortOption(e.target.value)}
						>
							<option value="popular">Most Popular</option>
							<option value="newest">Newest</option>
							<option value="rating">Highest Rated</option>
							<option value="price-low">Price: Low to High</option>
							<option value="price-high">Price: High to Low</option>
						</select>
						<FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
					</div>
					<button
						className="p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
						onClick={() =>
							document
								.getElementById("filterSection")
								.classList.toggle("hidden")
						}
					>
						<FiFilter className="text-lg" />
					</button>
				</div>
			</div>

			<div id="filterSection" className="mb-6 hidden">
				<div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-bold text-gray-800">Filters</h3>
						{(courseFilters.categories.length > 0 ||
							courseFilters.level.length > 0 ||
							courseFilters.rating > 0 ||
							courseFilters.price.min > 0 ||
							courseFilters.price.max < 200) && (
							<button
								onClick={resetFilters}
								className="text-blue-600 text-sm hover:underline"
							>
								Clear All
							</button>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div>
							<h4 className="font-medium text-gray-800 mb-2">Categories</h4>
							<div className="space-y-1 max-h-40 overflow-y-auto pr-2">
								{categories.map((category) => (
									<div key={category.id} className="flex items-center">
										<input
											type="checkbox"
											id={`browse-category-${category.id}`}
											className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
											checked={courseFilters.categories.includes(category.name)}
											onChange={() =>
												handleFilterChange("categories", category.name)
											}
										/>
										<label
											htmlFor={`browse-category-${category.id}`}
											className="ml-2 text-sm text-gray-700 cursor-pointer"
										>
											{category.name}
										</label>
									</div>
								))}
							</div>
						</div>

						<div>
							<h4 className="font-medium text-gray-800 mb-2">Level</h4>
							<div className="space-y-1">
								{["Beginner", "Intermediate", "Advanced"].map((level) => (
									<div key={level} className="flex items-center">
										<input
											type="checkbox"
											id={`browse-level-${level}`}
											className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
											checked={courseFilters.level.includes(level)}
											onChange={() => handleFilterChange("level", level)}
										/>
										<label
											htmlFor={`browse-level-${level}`}
											className="ml-2 text-sm text-gray-700 cursor-pointer"
										>
											{level}
										</label>
									</div>
								))}
							</div>
						</div>

						<div>
							<h4 className="font-medium text-gray-800 mb-2">Rating</h4>
							<div className="space-y-1">
								{[4.5, 4, 3.5, 3].map((rating) => (
									<div key={rating} className="flex items-center">
										<input
											type="radio"
											id={`browse-rating-${rating}`}
											name="rating-filter"
											className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
											checked={courseFilters.rating === rating}
											onChange={() => handleFilterChange("rating", rating)}
										/>
										<label
											htmlFor={`browse-rating-${rating}`}
											className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center"
										>
											{rating}+{" "}
											<FiStar className="text-yellow-500 fill-current ml-1" />
										</label>
									</div>
								))}
								<div className="flex items-center">
									<input
										type="radio"
										id="browse-rating-any"
										name="rating-filter"
										className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
										checked={courseFilters.rating === 0}
										onChange={() => handleFilterChange("rating", 0)}
									/>
									<label
										htmlFor="browse-rating-any"
										className="ml-2 text-sm text-gray-700 cursor-pointer"
									>
										Any Rating
									</label>
								</div>
							</div>
						</div>

						<div>
							<h4 className="font-medium text-gray-800 mb-2">Price</h4>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">
										Range: ${courseFilters.price.min} - $
										{courseFilters.price.max}
									</span>
								</div>
								<div className="flex items-center space-x-4">
									<div className="relative">
										<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
											$
										</span>
										<input
											type="number"
											placeholder="Min"
											min="0"
											max={courseFilters.price.max}
											value={courseFilters.price.min}
											onChange={(e) =>
												handleFilterChange("price", {
													min: parseInt(e.target.value) || 0,
												})
											}
											className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
										/>
									</div>
									<span className="text-gray-500">-</span>
									<div className="relative">
										<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
											$
										</span>
										<input
											type="number"
											placeholder="Max"
											min={courseFilters.price.min}
											value={courseFilters.price.max}
											onChange={(e) =>
												handleFilterChange("price", {
													max: parseInt(e.target.value) || 200,
												})
											}
											className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{searchQuery && (
				<div className="mb-4 flex justify-between items-center">
					<div className="text-gray-600">
						Found {filteredCourses.length} courses for "{searchQuery}"
					</div>
					<button
						onClick={() => setSearchQuery("")}
						className="text-blue-600 hover:underline text-sm flex items-center"
					>
						<FiX className="mr-1" /> Clear Search
					</button>
				</div>
			)}

			{filteredCourses.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
					<FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
					<h3 className="text-xl font-bold text-gray-800 mb-2">
						No courses found
					</h3>
					<p className="text-gray-600 mb-6">
						We couldn't find any courses matching your criteria. Try adjusting
						your filters or search terms.
					</p>
					<button
						className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all"
						onClick={resetFilters}
					>
						Clear Filters
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{sortedCourses.map((course) => (
						<motion.div
							key={course.id}
							whileHover={{ y: -5 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
						>
							<div className="relative h-48">
								<img
									src={course.thumbnail}
									alt={course.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.target.src =
											"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
									}}
								/>
								{course.bestSeller && (
									<div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
										Bestseller
									</div>
								)}
								{course.new && (
									<div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
										New
									</div>
								)}
								<div className="absolute bottom-3 right-3 flex space-x-2">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleViewCourse(course);
										}}
										className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center hover:bg-opacity-90 transition-colors"
									>
										<FiPlay className="mr-1" /> Preview
									</button>
								</div>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleAddToWishlist(course.id);
									}}
									className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-sm"
									aria-label={`${
										wishlist.includes(course.id) ? "Remove from" : "Add to"
									} wishlist`}
								>
									<FiHeart
										className={`${
											wishlist.includes(course.id)
												? "text-red-500 fill-current"
												: "text-gray-600"
										}`}
									/>
								</button>
							</div>
							<div className="p-5">
								<div className="flex justify-between items-center mb-2">
									<span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
										{course.category}
									</span>
									<span
										className={`text-xs px-2 py-1 rounded-full ${
											course.level === "Beginner"
												? "bg-green-100 text-green-800"
												: course.level === "Intermediate"
												? "bg-blue-100 text-blue-800"
												: "bg-purple-100 text-purple-800"
										}`}
									>
										{course.level}
									</span>
								</div>

								<h4
									className="font-bold text-lg text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
									onClick={() => handleViewCourse(course)}
								>
									{course.title}
								</h4>
								<p className="text-sm text-gray-600 mb-3 flex items-center">
									<img
										src={course.instructorAvatar}
										alt={course.instructor}
										className="w-5 h-5 rounded-full mr-2"
									/>
									{course.instructor}
								</p>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center">
										<FiStar className="fill-current text-yellow-500 mr-1" />
										<span className="text-sm font-medium">{course.rating}</span>
										<span className="text-xs text-gray-500 ml-1">
											({course.students})
										</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<FiClock className="mr-1" />
										<span>{course.duration}</span>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div>
										{course.price && (
											<span className="text-lg font-bold text-gray-800">
												${course.price.toFixed(2)}
											</span>
										)}
										{course.originalPrice && (
											<span className="text-sm text-gray-500 line-through ml-2">
												${course.originalPrice.toFixed(2)}
											</span>
										)}
									</div>
									<div className="flex space-x-2">
										<button
											className="text-blue-600 hover:text-blue-800 font-medium text-sm"
											onClick={() => handleViewCourse(course)}
										>
											View Details
										</button>
										<button
											className="text-blue-600 hover:text-blue-800 font-medium text-sm"
											onClick={() => handleAddToCart(course.id)}
										>
											{cart.includes(course.id) ? "Remove" : "Enroll Now"}
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			)}

			<div className="mt-8 flex justify-center">
				<nav className="flex items-center space-x-2">
					<button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
						<FiChevronLeft />
					</button>
					{[1, 2, 3, 4, 5].map((page) => (
						<button
							key={page}
							className={`px-3 py-1 rounded-md ${
								page === 1
									? "bg-blue-600 text-white font-medium"
									: "border border-gray-300 text-gray-700 hover:bg-gray-50"
							} transition-colors`}
						>
							{page}
						</button>
					))}
					<button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
						<FiChevronRight />
					</button>
				</nav>
			</div>
		</div>
	);
};

const LearningPortal: React.FC = () => {
	const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isMobileView, setIsMobileView] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [courseFilters, setCourseFilters] = useState({
		categories: [],
		level: [],
		rating: 0,
		price: { min: 0, max: 200 },
	});
	const [activeCategory, setActiveCategory] = useState("all");
	const [currentTestimonial, setCurrentTestimonial] = useState(0);
	const [playingVideo, setPlayingVideo] = useState<string | null>(null);
	const [visiblePage, setVisiblePage] = useState<string>("dashboard");
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [notifications, setNotifications] = useState(mockNotifications);
	const [unreadCount, setUnreadCount] = useState(
		mockNotifications.filter((n) => !n.read).length
	);
	const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
	const [currentLessons, setCurrentLessons] = useState<Lesson[]>([]);
	const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
	const [isWishlistOpen, setIsWishlistOpen] = useState(false);
	const [wishlist, setWishlist] = useState<string[]>([]);
	const [cart, setCart] = useState<string[]>([]);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const [advancedSearchFilters, setAdvancedSearchFilters] = useState({
		categories: [] as string[],
		level: [] as string[],
		rating: 0,
		price: { min: 0, max: 200 },
	});
	const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
	const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
	const [selectedResource, setSelectedResource] = useState<Resource | null>(
		null
	);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [isLiveSessionModalOpen, setIsLiveSessionModalOpen] = useState(false);
	const [selectedLiveSession, setSelectedLiveSession] =
		useState<LiveSession | null>(null);
	const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
	const [currentUserRating, setCurrentUserRating] = useState(0);
	const [feedbackText, setFeedbackText] = useState("");
	const [activeFeedbackCourse, setActiveFeedbackCourse] = useState<
		string | null
	>(null);
	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [activeDiscussionTab, setActiveDiscussionTab] = useState("questions");
	const [sidebarPages, setSidebarPages] = useState({
		dashboard: true,
		myCourses: false,
		achievements: false,
		profile: false,
		settings: false,
		learningPaths: false,
		certificates: false,
		liveSessions: false,
		instructors: false,
	});
	const [progressPercentage, setProgressPercentage] = useState(0);
	const [userName, setUserName] = useState("Alex");
	const [userAvatar, setUserAvatar] = useState(
		"https://i.pravatar.cc/150?img=32"
	);
	const [userEmail, setUserEmail] = useState("alex.smith@example.com");
	const [currentTab, setCurrentTab] = useState("overview");

	const notificationsRef = useRef<HTMLDivElement>(null);
	const cartRef = useRef<HTMLDivElement>(null);
	const wishlistRef = useRef<HTMLDivElement>(null);
	const profileRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const allLessons = Object.values(courseLessons).flat();
		const completedLessonsCount = allLessons.filter((l) => l.completed).length;
		const totalLessonsCount = allLessons.length;
		setProgressPercentage(
			Math.round((completedLessonsCount / totalLessonsCount) * 100)
		);
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1024);
			if (window.innerWidth >= 1024) setIsMenuOpen(false);
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTestimonial((prev) => (prev + 1) % mockTestimonials.length);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target as Node) &&
				isNotificationsOpen
			) {
				setIsNotificationsOpen(false);
			}

			if (
				cartRef.current &&
				!cartRef.current.contains(event.target as Node) &&
				isCartOpen
			) {
				setIsCartOpen(false);
			}

			if (
				wishlistRef.current &&
				!wishlistRef.current.contains(event.target as Node) &&
				isWishlistOpen
			) {
				setIsWishlistOpen(false);
			}

			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node) &&
				isProfileOpen
			) {
				setIsProfileOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isNotificationsOpen, isCartOpen, isWishlistOpen, isProfileOpen]);

	const handlePrevCourse = () => {
		setCurrentCourseIndex((prev) =>
			prev === 0 ? filteredCourses.length - 1 : prev - 1
		);
	};

	const handleNextCourse = () => {
		setCurrentCourseIndex((prev) => (prev + 1) % filteredCourses.length);
	};

	const handlePlayVideo = (videoUrl: string) => {
		setPlayingVideo(videoUrl);
	};

	const handleMarkNotificationAsRead = (id: string) => {
		setNotifications((prevNotifications) =>
			prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
		);
		setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
	};

	const handleMarkAllNotificationsAsRead = () => {
		setNotifications((prevNotifications) =>
			prevNotifications.map((n) => ({ ...n, read: true }))
		);
		setUnreadCount(0);
	};

	const handlePageChange = (page) => {
		setVisiblePage(page);

		if (page === "browse" && visiblePage !== "browse") {
			if (!searchQuery) {
				resetFilters();
			}
		}

		const newSidebarPages = Object.fromEntries(
			Object.keys(sidebarPages).map((key) => [key, key === page])
		);
		setSidebarPages(newSidebarPages);

		if (isMobileView) {
			setIsMenuOpen(false);
		}
	};

	const handleViewCourse = (course: Course) => {
		setCurrentCourse(course);
		setVisiblePage("courseDetail");

		const lessons = courseLessons[course.id] || [];
		setCurrentLessons(lessons);
	};

	const handleViewLesson = (lesson: Lesson) => {
		setSelectedLesson(lesson);
		setIsLessonModalOpen(true);
	};

	const handleViewResource = (resource: Resource) => {
		setSelectedResource(resource);
		setIsResourceModalOpen(true);
	};

	const handleAddToWishlist = (courseId: string) => {
		if (wishlist.includes(courseId)) {
			setWishlist((prev) => prev.filter((id) => id !== courseId));
			showToast("Course removed from wishlist");
		} else {
			setWishlist((prev) => [...prev, courseId]);
			showToast("Course added to wishlist");
		}
	};

	const handleAddToCart = (courseId: string) => {
		if (cart.includes(courseId)) {
			setCart((prev) => prev.filter((id) => id !== courseId));
			showToast("Course removed from cart");
		} else {
			setCart((prev) => [...prev, courseId]);
			showToast("Course added to cart");
		}
	};

	const handleRemoveFromCart = (courseId: string) => {
		setCart((prev) => prev.filter((id) => id !== courseId));
		showToast("Course removed from cart");
	};

	const handleCheckout = () => {
		showToast("Proceeding to checkout...");
	};

	const handleRegisterForLiveSession = (session: LiveSession) => {
		showToast(`Registered for ${session.title}`);
	};

	const handleSubmitFeedback = () => {
		if (activeFeedbackCourse && currentUserRating > 0) {
			showToast("Thank you for your feedback!");
			setIsFeedbackModalOpen(false);
			setCurrentUserRating(0);
			setFeedbackText("");
			setActiveFeedbackCourse(null);
		} else {
			showToast("Please provide a rating", "error");
		}
	};

	const handleContinueLearning = () => {
		const inProgressCourse = mockCourses.find((course) => course.progress > 0);
		if (inProgressCourse) {
			handleViewCourse(inProgressCourse);
		}
	};

	const handleLessonCompletion = (lessonId: string, completed: boolean) => {
		const updatedLessons = currentLessons.map((lesson) =>
			lesson.id === lessonId ? { ...lesson, completed } : lesson
		);
		setCurrentLessons(updatedLessons);
	};

	const handleApplyCoupon = (code: string) => {
		const coupon = coupons.find((c) => c.code === code);
		if (coupon) {
			showToast(`Coupon applied! ${coupon.discount}% discount`);
			setIsCouponModalOpen(false);
		} else {
			showToast("Invalid coupon code", "error");
		}
	};
	const handleSearchInputChange = (e) => {
		setSearchQuery(e.target.value);
	};
	const handleFilterChange = (filterType, value) => {
		setCourseFilters((prevFilters) => {
			if (Array.isArray(prevFilters[filterType])) {
				if (prevFilters[filterType].includes(value)) {
					return {
						...prevFilters,
						[filterType]: prevFilters[filterType].filter(
							(item) => item !== value
						),
					};
				} else {
					return {
						...prevFilters,
						[filterType]: [...prevFilters[filterType], value],
					};
				}
			} else if (filterType === "price") {
				return {
					...prevFilters,
					price: { ...prevFilters.price, ...value },
				};
			} else {
				return {
					...prevFilters,
					[filterType]: value,
				};
			}
		});
	};

	const resetFilters = () => {
		setSearchQuery("");
		setCourseFilters({
			categories: [],
			level: [],
			rating: 0,
			price: { min: 0, max: 200 },
		});
	};

	const handleSearchSubmit = (e) => {
		if (e) e.preventDefault();
		setIsSearchModalOpen(false);

		if (visiblePage !== "browse") {
			handlePageChange("browse");
		}

		showToast(`Showing results for "${searchQuery}"`);
	};

	const handleLiveSessionClick = (session: LiveSession) => {
		setSelectedLiveSession(session);
		setIsLiveSessionModalOpen(true);
	};

	const handleTabChange = (tab: string) => {
		setCurrentTab(tab);
	};

	const showToast = (
		message: string,
		type: "success" | "error" = "success"
	) => {
		setToastMessage(message);
		setShowSuccessToast(true);
		setTimeout(() => setShowSuccessToast(false), 3000);
	};

	const activeProgressCourse = mockCourses.find(
		(c) => c.progress > 0 && c.progress < 100
	);

	const filteredCourses = useMemo(() => {
		return mockCourses.filter((course) => {
			const searchMatch =
				searchQuery === "" ||
				course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

			const categoryMatch =
				courseFilters.categories.length === 0 ||
				courseFilters.categories.includes(course.category);

			const levelMatch =
				courseFilters.level.length === 0 ||
				courseFilters.level.includes(course.level);

			const ratingMatch = course.rating >= courseFilters.rating;

			const priceMatch =
				(!course.price || course.price >= courseFilters.price.min) &&
				(!course.price || course.price <= courseFilters.price.max);

			return (
				searchMatch && categoryMatch && levelMatch && ratingMatch && priceMatch
			);
		});
	}, [mockCourses, searchQuery, courseFilters]);

	const cartTotal = cart.reduce((total, courseId) => {
		const course = mockCourses.find((c) => c.id === courseId);
		return total + (course?.price || 0);
	}, 0);

	const totalHoursOfContent = mockCourses.reduce((total, course) => {
		const hours = parseInt(course.duration.split(" ")[0]);
		return total + hours;
	}, 0);

	const Navbar = () => (
		<header className="bg-white shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center">
				<div className="flex w-full sm:w-auto justify-between items-center mb-3 sm:mb-0">
					<button
						className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle navigation menu"
						aria-expanded={isMenuOpen}
					>
						<div className="w-6 flex flex-col space-y-1">
							<span className="h-0.5 w-full bg-gray-800"></span>
							<span className="h-0.5 w-full bg-gray-800"></span>
							<span className="h-0.5 w-full bg-gray-800"></span>
						</div>
					</button>
					<div
						className="flex items-center cursor-pointer"
						onClick={() => handlePageChange("dashboard")}
					>
						<svg
							className="w-8 h-8 text-blue-600"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 6.253C13.184 5.476 14.598 5 16 5C19 5 21 7.5 21 10.5C21 13.5 19 16 16 16C14.598 16 13.184 15.524 12 14.747C10.816 15.524 9.402 16 8 16C5 16 3 13.5 3 10.5C3 7.5 5 5 8 5C9.402 5 10.816 5.476 12 6.253Z"
								fill="currentColor"
							/>
						</svg>
						<h1 className="text-xl sm:text-2xl font-bold text-blue-600 ml-2">
							LearnHub Pro
						</h1>
					</div>

					<div className="flex items-center space-x-2 sm:hidden">
						<button
							className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
							onClick={() => setIsSearchModalOpen(true)}
							aria-label="Search"
						>
							<FiSearch className="text-xl" />
						</button>
						<div className="relative">
							<button
								className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
								onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
								aria-label="Notifications"
							>
								<FiBell className="text-xl" />
								{unreadCount > 0 && (
									<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
										{unreadCount}
									</span>
								)}
							</button>
						</div>
					</div>
				</div>

				<div className="w-full sm:flex-1 sm:max-w-md mx-0 sm:mx-4 lg:mx-8 mb-3 sm:mb-0">
					<div className="relative w-full">
						<input
							type="text"
							placeholder="Search courses..."
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onClick={() => setIsSearchModalOpen(true)}
						/>
						<FiSearch className="absolute left-3 top-3 text-gray-400" />
					</div>
				</div>

				<div className="flex items-center space-x-3 sm:space-x-4">
					<button
						className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
						onClick={() => handlePageChange("myCourses")}
					>
						<Book className="text-xl" />
						<span className="font-medium">My Learning</span>
					</button>

					<div className="relative" ref={wishlistRef}>
						<button
							className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
							onClick={() => setIsWishlistOpen(!isWishlistOpen)}
							aria-label="Wishlist"
						>
							<FiHeart className="text-xl" />
							{wishlist.length > 0 && (
								<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
									{wishlist.length}
								</span>
							)}
						</button>
						{isWishlistOpen && (
							<div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
								<div className="p-3 border-b border-gray-100">
									<h3 className="font-semibold text-gray-800">Wishlist</h3>
								</div>
								{wishlist.length === 0 ? (
									<div className="p-4 text-center text-gray-500">
										Your wishlist is empty
									</div>
								) : (
									<div className="max-h-80 overflow-y-auto">
										{wishlist.map((courseId) => {
											const course = mockCourses.find((c) => c.id === courseId);
											if (!course) return null;
											return (
												<div
													key={course.id}
													className="p-3 border-b border-gray-100 flex items-start"
												>
													<img
														src={course.thumbnail}
														alt={course.title}
														className="w-16 h-12 object-cover rounded mr-3"
														onError={(e) => {
															(e.target as HTMLImageElement).src =
																"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
														}}
													/>
													<div className="flex-1">
														<h4 className="text-sm font-medium text-gray-800 mb-1">
															{course.title}
														</h4>
														<div className="flex items-center justify-between">
															<span className="text-sm font-bold text-blue-600">
																${course.price?.toFixed(2)}
															</span>
															<div className="flex space-x-1">
																<button
																	onClick={() => handleAddToCart(course.id)}
																	className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
																>
																	Add to Cart
																</button>
																<button
																	onClick={() => handleAddToWishlist(course.id)}
																	className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
																>
																	Remove
																</button>
															</div>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
								<div className="p-3 border-t border-gray-100">
									<button
										className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
										onClick={() => handlePageChange("wishlist")}
									>
										View Wishlist
									</button>
								</div>
							</div>
						)}
					</div>

					<div className="relative" ref={cartRef}>
						<button
							className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
							onClick={() => setIsCartOpen(!isCartOpen)}
							aria-label="Shopping cart"
						>
							<FiShoppingCart className="text-xl" />
							{cart.length > 0 && (
								<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
									{cart.length}
								</span>
							)}
						</button>
						{isCartOpen && (
							<div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
								<div className="p-3 border-b border-gray-100">
									<h3 className="font-semibold text-gray-800">Shopping Cart</h3>
								</div>
								{cart.length === 0 ? (
									<div className="p-4 text-center text-gray-500">
										Your cart is empty
									</div>
								) : (
									<div className="max-h-80 overflow-y-auto">
										{cart.map((courseId) => {
											const course = mockCourses.find((c) => c.id === courseId);
											if (!course) return null;
											return (
												<div
													key={course.id}
													className="p-3 border-b border-gray-100 flex items-start"
												>
													<img
														src={course.thumbnail}
														alt={course.title}
														className="w-16 h-12 object-cover rounded mr-3"
														onError={(e) => {
															(e.target as HTMLImageElement).src =
																"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
														}}
													/>
													<div className="flex-1">
														<h4 className="text-sm font-medium text-gray-800 mb-1">
															{course.title}
														</h4>
														<div className="flex items-center justify-between">
															<span className="text-sm font-bold text-blue-600">
																${course.price?.toFixed(2)}
															</span>
															<button
																onClick={() => handleRemoveFromCart(course.id)}
																className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
															>
																Remove
															</button>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
								{cart.length > 0 && (
									<div>
										<div className="p-3 border-t border-gray-100 flex justify-between">
											<span className="font-medium text-gray-800">Total:</span>
											<span className="font-bold text-blue-600">
												${cartTotal.toFixed(2)}
											</span>
										</div>
										<div className="p-3 pt-0 flex space-x-2">
											<button
												className="flex-1 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
												onClick={() => setIsCouponModalOpen(true)}
											>
												Apply Coupon
											</button>
											<button
												className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
												onClick={handleCheckout}
											>
												Checkout
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					<div className="relative" ref={notificationsRef}>
						<button
							className="relative p-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full"
							onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
							aria-label="Notifications"
						>
							{unreadCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
									{unreadCount}
								</span>
							)}
							<FiBell className="w-6 h-6 text-gray-600" />
						</button>

						{isNotificationsOpen && (
							<div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
								<div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
									<h3 className="font-semibold text-gray-800">Notifications</h3>
									{unreadCount > 0 && (
										<button
											className="text-xs text-blue-600 hover:text-blue-800"
											onClick={handleMarkAllNotificationsAsRead}
										>
											Mark all as read
										</button>
									)}
								</div>
								<div className="max-h-96 overflow-y-auto">
									{notifications.length === 0 ? (
										<div className="p-4 text-center text-gray-500">
											No notifications
										</div>
									) : (
										notifications.map((notification) => (
											<div
												key={notification.id}
												className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
													!notification.read ? "bg-blue-50" : ""
												}`}
												onClick={() =>
													handleMarkNotificationAsRead(notification.id)
												}
											>
												<div className="flex items-start">
													<div
														className={`p-2 rounded-full mr-3 ${
															notification.type === "course"
																? "bg-blue-100 text-blue-600"
																: notification.type === "message"
																? "bg-green-100 text-green-600"
																: notification.type === "achievement"
																? "bg-yellow-100 text-yellow-600"
																: "bg-gray-100 text-gray-600"
														}`}
													>
														{notification.type === "course" ? (
															<Book />
														) : notification.type === "message" ? (
															<FiMessageCircle />
														) : notification.type === "achievement" ? (
															<Award />
														) : (
															<FiBell />
														)}
													</div>
													<div className="flex-1">
														<h4
															className={`text-sm font-medium ${
																!notification.read
																	? "text-blue-800"
																	: "text-gray-800"
															}`}
														>
															{notification.title}
														</h4>
														<p className="text-xs text-gray-600 mt-1">
															{notification.message}
														</p>
														<p className="text-xs text-gray-400 mt-1">
															{notification.time}
														</p>
													</div>
													{!notification.read && (
														<div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
													)}
												</div>
											</div>
										))
									)}
								</div>
								<div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
									<button
										className="text-sm text-blue-600 hover:text-blue-800"
										onClick={() => handlePageChange("notifications")}
									>
										View All Notifications
									</button>
								</div>
							</div>
						)}
					</div>

					<div className="relative group" ref={profileRef}>
						<div
							className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
							onClick={() => setIsProfileOpen(!isProfileOpen)}
						>
							<img
								src={userAvatar}
								alt="User profile"
								className="w-full h-full object-cover"
							/>
						</div>
						{isProfileOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
								<div className="px-4 py-3 border-b border-gray-100">
									<p className="text-sm font-semibold text-gray-800">
										{userName}
									</p>
									<p className="text-xs text-gray-500 truncate">{userEmail}</p>
								</div>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									onClick={(e) => {
										e.preventDefault();
										handlePageChange("profile");
										setIsProfileOpen(false);
									}}
								>
									<div className="flex items-center">
										<User className="mr-2" />
										Profile
									</div>
								</a>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									onClick={(e) => {
										e.preventDefault();
										handlePageChange("settings");
										setIsProfileOpen(false);
									}}
								>
									<div className="flex items-center">
										<Settings className="mr-2" />
										Settings
									</div>
								</a>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									onClick={(e) => {
										e.preventDefault();
										setIsLoginModalOpen(true);
										setIsProfileOpen(false);
									}}
								>
									<div className="flex items-center">
										<FiLogOut className="mr-2" />
										Sign out
									</div>
								</a>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);

	const FiShoppingCart = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="9" cy="21" r="1"></circle>
			<circle cx="20" cy="21" r="1"></circle>
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
		</svg>
	);

	const Sidebar = () => (
		<aside
			className={`${
				isMenuOpen
					? "translate-x-0 mt-[152px] mb-[65px] overflow-auto "
					: "-translate-x-full"
			} lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-72 bg-white shadow-md lg:shadow-none z-40 transition-transform duration-300 ease-in-out overflow-y-auto`}
		>
			<div className="h-full flex flex-col p-6">
				<nav className="flex-1">
					<ul className="space-y-3">
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg ${
									sidebarPages.dashboard
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("dashboard");
								}}
							>
								<Home className="mr-3 text-lg" />
								<span className="font-medium">Dashboard</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg ${
									sidebarPages.myCourses
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("myCourses");
								}}
							>
								<Book className="mr-3 text-lg" />
								<span className="font-medium">My Courses</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg ${
									visiblePage === "browse"
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("browse");
								}}
							>
								<FiSearch className="mr-3 text-lg" />
								<span className="font-medium">Browse Courses</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg ${
									sidebarPages.learningPaths
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("learningPaths");
								}}
							>
								<FiLayers className="mr-3 text-lg" />
								<span className="font-medium">Learning Paths</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg ${
									sidebarPages.achievements
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("achievements");
								}}
							>
								<Award className="mr-3 text-lg" />
								<span className="font-medium">Achievements</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg ${
									sidebarPages.certificates
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("certificates");
								}}
							>
								<FiCheckSquare className="mr-3 text-lg" />
								<span className="font-medium">Certificates</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg gap-3 ${
									sidebarPages.liveSessions
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("liveSessions");
								}}
							>
								<FiVideo />
								<span className="font-medium">Live Sessions</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg gap-3 ${
									sidebarPages.instructors
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("instructors");
								}}
							>
								<Users />
								<span className="font-medium ">Instructors</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg ${
									sidebarPages.profile
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("profile");
								}}
							>
								<User className="mr-3 text-lg" />
								<span className="font-medium">Profile</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className={`flex items-center p-3 rounded-lg ${
									sidebarPages.settings
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 transition-colors"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handlePageChange("settings");
								}}
							>
								<Settings className="mr-3 text-lg" />
								<span className="font-medium">Settings</span>
							</a>
						</li>
					</ul>
				</nav>

				<div className="pt-6 border-t border-gray-200">
					<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
						Learning Progress
					</h3>
					<div className="mb-2 flex justify-between items-center">
						<span className="text-sm font-medium text-gray-700">
							Overall Completion
						</span>
						<span className="text-sm font-bold text-blue-600">
							{progressPercentage}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
						<div
							className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
							style={{ width: `${progressPercentage}%` }}
						></div>
					</div>

					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">Learning Streak</span>
							<span className="text-sm font-medium">
								{userStats.streakDays} days
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">Hours Learned</span>
							<span className="text-sm font-medium">
								{userStats.hoursLearned} hrs
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">Active Courses</span>
							<span className="text-sm font-medium">
								{
									mockCourses.filter((c) => c.progress > 0 && c.progress < 100)
										.length
								}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">Completed Courses</span>
							<span className="text-sm font-medium">
								{userStats.coursesCompleted}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
					<h4 className="text-sm font-semibold text-blue-800 mb-2">
						Premium Membership
					</h4>
					<p className="text-xs text-blue-600 mb-3">
						Unlock all courses and features with our Pro plan
					</p>
					<button
						className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-md shadow-sm hover:from-blue-700 hover:to-blue-600 transition-all"
						onClick={() => showToast("Upgrade feature coming soon!")}
					>
						Upgrade Now
					</button>
				</div>
			</div>
		</aside>
	);

	const Dashboard = () => (
		<>
			<section className="mb-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg"
				>
					<div className="max-w-2xl">
						<h2 className="text-3xl md:text-4xl font-bold mb-3">
							Welcome back, {userName}!
						</h2>
						<p className="text-lg md:text-xl mb-6 opacity-90">
							Continue your learning journey where you left off. You're making
							great progress!
						</p>
						<div className="flex flex-wrap gap-4">
							<button
								className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
								onClick={handleContinueLearning}
							>
								Continue Learning
							</button>
							<button
								className="px-6 py-3 bg-blue-600 bg-opacity-20 text-white font-medium rounded-lg hover:bg-opacity-30 transition-colors border border-white border-opacity-30"
								onClick={() => handlePageChange("browse")}
							>
								Explore New Courses
							</button>
						</div>
					</div>
				</motion.div>
			</section>

			<section className="mb-12">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-bold text-gray-800">
						Continue Learning
					</h3>
					<a
						href="#"
						className="text-blue-600 font-medium hover:underline flex items-center"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange("myCourses");
						}}
					>
						View all <FiChevronRight className="ml-1" />
					</a>
				</div>

				<motion.div
					whileHover={{ scale: isMobileView ? 1 : 1.01 }}
					className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
				>
					{activeProgressCourse ? (
						<>
							<div className="w-full md:w-2/5 relative h-48 md:h-auto">
								{playingVideo === activeProgressCourse.videoPreview ? (
									<div className="w-full h-full bg-black flex items-center justify-center">
										<video
											src={activeProgressCourse.videoPreview}
											controls
											autoPlay
											className="w-full h-full object-contain"
											onEnded={() => setPlayingVideo(null)}
										/>
									</div>
								) : (
									<>
										<img
											src={activeProgressCourse.thumbnail}
											alt={activeProgressCourse.title}
											className="w-full h-full object-cover"
											onError={(e) => {
												(e.target as HTMLImageElement).src =
													"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
											}}
										/>
										<button
											onClick={() =>
												handlePlayVideo(activeProgressCourse.videoPreview)
											}
											className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105 transition-transform"
											aria-label="Preview course video"
										>
											<FiPlay className="text-blue-600 text-xl" />
										</button>
									</>
								)}
								{activeProgressCourse.bestSeller && (
									<div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
										Bestseller
									</div>
								)}
								{activeProgressCourse.new && (
									<div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
										New
									</div>
								)}
							</div>

							<div className="p-6 w-full md:w-3/5">
								<div className="flex justify-between items-start mb-2">
									<span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
										{activeProgressCourse.category}
									</span>
									<div className="flex items-center text-sm text-gray-500">
										<FiClock className="mr-1" />
										<span>{activeProgressCourse.duration}</span>
									</div>
								</div>

								<h4 className="text-xl font-bold text-gray-800 mb-2">
									{activeProgressCourse.title}
								</h4>

								<div className="flex items-center mb-4">
									<div className="flex items-center mr-4">
										<div className="flex -space-x-1 mr-2">
											<img
												src={activeProgressCourse.instructorAvatar}
												alt={activeProgressCourse.instructor}
												className="w-6 h-6 rounded-full border-2 border-white"
											/>
										</div>
										<span className="text-sm text-gray-600">
											By {activeProgressCourse.instructor}
										</span>
									</div>
									<div className="flex items-center text-sm text-yellow-600">
										<FiStar className="fill-current mr-1" />
										<span>{activeProgressCourse.rating}</span>
										<span className="text-gray-500 ml-1">
											({activeProgressCourse.students})
										</span>
									</div>
								</div>

								<div className="mb-4">
									<div className="flex justify-between text-sm mb-1">
										<span className="font-medium text-gray-700">Progress</span>
										<span className="font-bold text-blue-600">
											{activeProgressCourse.progress}% complete
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
											style={{ width: `${activeProgressCourse.progress}%` }}
										></div>
									</div>
								</div>

								{activeProgressCourse.nextLesson && (
									<div className="mb-4">
										<p className="text-sm text-gray-600">Next Lesson:</p>
										<p className="text-sm font-medium text-gray-800">
											{activeProgressCourse.nextLesson}
										</p>
									</div>
								)}

								<div className="flex flex-wrap gap-3">
									<button
										className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
										onClick={() => handleViewCourse(activeProgressCourse)}
									>
										Continue Lesson
									</button>
									<button
										className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
										onClick={() => {
											setActiveFeedbackCourse(activeProgressCourse.id);
											setIsFeedbackModalOpen(true);
										}}
									>
										Leave Feedback
									</button>
								</div>
							</div>
						</>
					) : (
						<div className="p-8 w-full text-center">
							<Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<h4 className="text-xl font-bold text-gray-800 mb-2">
								No courses in progress
							</h4>
							<p className="text-gray-600 mb-6">
								Start learning today by enrolling in one of our popular courses.
							</p>
							<button
								className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								onClick={() => handlePageChange("browse")}
							>
								Browse Courses
							</button>
						</div>
					)}
				</motion.div>
			</section>

			<section className="mb-12">
				<h3 className="text-2xl font-bold text-gray-800 mb-6">
					Browse Categories
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{categories.slice(0, 10).map((category) => (
						<motion.div
							key={category.id}
							whileHover={{ y: -5 }}
							className={`bg-white p-4 rounded-xl shadow-sm border ${
								activeCategory === category.name.toLowerCase()
									? "border-blue-400 bg-blue-50"
									: "border-gray-100 hover:border-blue-200"
							} transition-all text-center cursor-pointer`}
							onClick={() => {
								handleFilterChange("categories", category.name);
								handlePageChange("browse");
							}}
						>
							<div
								className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${
									activeCategory === category.name.toLowerCase()
										? "bg-blue-500 text-white"
										: "bg-blue-100 text-blue-600"
								}`}
							>
								{category.icon}
							</div>
							<h4 className="font-medium text-gray-800 mb-1">
								{category.name}
							</h4>
							<p className="text-xs text-gray-500">
								{category.courses} courses
							</p>
						</motion.div>
					))}
				</div>
			</section>

			<section className="mb-12">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-bold text-gray-800">Learning Paths</h3>
					<a
						href="#"
						className="text-blue-600 font-medium hover:underline flex items-center"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange("learningPaths");
						}}
					>
						View all <FiChevronRight className="ml-1" />
					</a>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{learningPaths.map((path, index) => (
						<motion.div
							key={path.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							whileHover={{ y: -5 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
						>
							<div className="relative h-40">
								<img
									src={path.thumbnail}
									alt={path.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
									}}
								/>
								<div
									className={`absolute bottom-0 left-0 right-0 h-2 ${
										path.progress > 0 ? "bg-gray-200" : "bg-transparent"
									}`}
								>
									{path.progress > 0 && (
										<div
											className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
											style={{ width: `${path.progress}%` }}
										></div>
									)}
								</div>
							</div>
							<div className="p-5">
								<div className="flex justify-between mb-2">
									<span
										className={`text-xs px-2 py-1 rounded-full ${
											path.level === "Beginner"
												? "bg-green-100 text-green-800"
												: path.level === "Intermediate"
												? "bg-blue-100 text-blue-800"
												: "bg-purple-100 text-purple-800"
										}`}
									>
										{path.level}
									</span>
									{path.progress > 0 && (
										<span className="text-xs text-blue-600 font-medium">
											{path.progress}% complete
										</span>
									)}
								</div>

								<h4 className="font-bold text-lg text-gray-800 mb-2">
									{path.title}
								</h4>
								<p className="text-sm text-gray-600 mb-4 line-clamp-2">
									{path.description}
								</p>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<FiLayers className="mr-1" />
										<span>{path.courses} courses</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<FiClock className="mr-1" />
										<span>{path.duration}</span>
									</div>
								</div>

								<button
									className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									onClick={() =>
										showToast(`Learning path: ${path.title} - Coming soon!`)
									}
								>
									{path.progress > 0 ? "Continue Path" : "Start Path"}
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			<section className="mb-12">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-bold text-gray-800">
						Upcoming Live Sessions
					</h3>
					<a
						href="#"
						className="text-blue-600 font-medium hover:underline flex items-center"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange("liveSessions");
						}}
					>
						View all <FiChevronRight className="ml-1" />
					</a>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{liveSessions.map((session) => (
						<motion.div
							key={session.id}
							whileHover={{ y: -5 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
							onClick={() => handleLiveSessionClick(session)}
						>
							<div className="relative h-40">
								<img
									src={session.thumbnail}
									alt={session.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
									}}
								/>
								{session.registered && (
									<div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
										Registered
									</div>
								)}
							</div>
							<div className="p-5">
								<div className="mb-2">
									<span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
										{session.category}
									</span>
								</div>

								<h4 className="font-bold text-lg text-gray-800 mb-2">
									{session.title}
								</h4>
								<p className="text-sm text-gray-600 mb-2">
									Instructor: {session.instructor}
								</p>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<FiCalendar className="mr-1" />
										<span>{session.date}</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<FiClock className="mr-1" />
										<span>{session.time}</span>
									</div>
								</div>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<FiClock className="mr-1" />
										<span>{session.duration}</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<Users className="mr-1" />
										<span>{session.participants} enrolled</span>
									</div>
								</div>

								<button
									className={`w-full py-2 ${
										session.registered
											? "bg-gray-100 text-gray-800"
											: "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
									} font-medium rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
									onClick={(e) => {
										e.stopPropagation();
										if (!session.registered) {
											handleRegisterForLiveSession(session);
										}
									}}
								>
									{session.registered ? "View Details" : "Register Now"}
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			<section className="mb-12">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-bold text-gray-800">Popular Courses</h3>
					<div className="flex items-center space-x-4">
						<a
							href="#"
							className="text-blue-600 font-medium hover:underline"
							onClick={(e) => {
								e.preventDefault();
								handlePageChange("browse");
							}}
						>
							View all
						</a>
						<div className="flex space-x-2">
							<button
								onClick={handlePrevCourse}
								className="w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
								aria-label="Previous course"
							>
								<FiChevronLeft className="text-gray-600" />
							</button>
							<button
								onClick={handleNextCourse}
								className="w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
								aria-label="Next course"
							>
								<FiChevronRight className="text-gray-600" />
							</button>
						</div>
					</div>
				</div>

				<div className="relative">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredCourses.slice(0, 6).map((course, index) => (
							<motion.div
								key={course.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								whileHover={{ y: -5 }}
								className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all ${
									index === currentCourseIndex ? "ring-2 ring-blue-500" : ""
								}`}
							>
								<div className="relative h-48">
									<img
										src={course.thumbnail}
										alt={course.title}
										className="w-full h-full object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).src =
												"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
										}}
									/>
									{course.bestSeller && (
										<div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
											Bestseller
										</div>
									)}
									{course.new && (
										<div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
											New
										</div>
									)}
									<div className="absolute bottom-3 right-3 flex space-x-2">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handlePlayVideo(course.videoPreview);
											}}
											className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center hover:bg-opacity-90 transition-colors"
										>
											<FiPlay className="mr-1" /> Preview
										</button>
									</div>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleAddToWishlist(course.id);
										}}
										className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-sm"
										aria-label={`${
											wishlist.includes(course.id) ? "Remove from" : "Add to"
										} wishlist`}
									>
										<FiHeart
											className={`${
												wishlist.includes(course.id)
													? "text-red-500 fill-current"
													: "text-gray-600"
											}`}
										/>
									</button>
								</div>
								<div className="p-5">
									<div className="flex justify-between items-center mb-2">
										<span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
											{course.category}
										</span>
										<span
											className={`text-xs px-2 py-1 rounded-full ${
												course.level === "Beginner"
													? "bg-green-100 text-green-800"
													: course.level === "Intermediate"
													? "bg-blue-100 text-blue-800"
													: "bg-purple-100 text-purple-800"
											}`}
										>
											{course.level}
										</span>
									</div>

									<h4
										className="font-bold text-lg text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
										onClick={() => handleViewCourse(course)}
									>
										{course.title}
									</h4>
									<p className="text-sm text-gray-600 mb-3 flex items-center">
										<img
											src={course.instructorAvatar}
											alt={course.instructor}
											className="w-5 h-5 rounded-full mr-2"
										/>
										{course.instructor}
									</p>

									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center">
											<FiStar className="fill-current text-yellow-500 mr-1" />
											<span className="text-sm font-medium">
												{course.rating}
											</span>
											<span className="text-xs text-gray-500 ml-1">
												({course.students})
											</span>
										</div>
										<div className="flex items-center text-sm text-gray-600">
											<FiClock className="mr-1" />
											<span>{course.duration}</span>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div>
											{course.price && (
												<span className="text-lg font-bold text-gray-800">
													${course.price.toFixed(2)}
												</span>
											)}
											{course.originalPrice && (
												<span className="text-sm text-gray-500 line-through ml-2">
													${course.originalPrice.toFixed(2)}
												</span>
											)}
										</div>
										<div className="flex space-x-2">
											<button
												className="text-blue-600 hover:text-blue-800 font-medium text-sm"
												onClick={() => handleViewCourse(course)}
											>
												View Details
											</button>
											<button
												className="text-blue-600 hover:text-blue-800 font-medium text-sm"
												onClick={() => handleAddToCart(course.id)}
											>
												{cart.includes(course.id) ? "Remove" : "Enroll Now"}
											</button>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section className="mb-12">
				<h3 className="text-2xl font-bold text-gray-800 mb-6">
					What Our Students Say
				</h3>

				<div className="relative bg-white rounded-xl shadow-sm p-8 border border-gray-100">
					<AnimatePresence mode="wait">
						<motion.div
							key={mockTestimonials[currentTestimonial].id}
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.5 }}
						>
							<div className="flex flex-col md:flex-row items-center">
								<div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
									<div className="relative">
										<img
											src={mockTestimonials[currentTestimonial].avatar}
											alt={mockTestimonials[currentTestimonial].name}
											className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
										/>
										<div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1">
											<FiCheck className="text-white" />
										</div>
									</div>
								</div>
								<div className="md:w-3/4 md:pl-8">
									<div className="flex mb-2">
										{[...Array(5)].map((_, i) => (
											<FiStar
												key={i}
												className={`text-xl ${
													i < mockTestimonials[currentTestimonial].rating
														? "text-yellow-500 fill-current"
														: "text-gray-300"
												}`}
											/>
										))}
									</div>
									<p className="text-lg text-gray-700 mb-4 italic">
										"{mockTestimonials[currentTestimonial].content}"
									</p>
									<div>
										<h4 className="font-bold text-gray-800">
											{mockTestimonials[currentTestimonial].name}
										</h4>
										<p className="text-sm text-gray-500">
											{mockTestimonials[currentTestimonial].role}
										</p>
										<p className="text-xs text-gray-400 mt-1">
											{mockTestimonials[currentTestimonial].date}
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>

					<div className="flex justify-center mt-6 space-x-2">
						{mockTestimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentTestimonial(index)}
								className={`w-3 h-3 rounded-full ${
									currentTestimonial === index ? "bg-blue-600" : "bg-gray-300"
								}`}
								aria-label={`View testimonial ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</section>

			<section className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
				<div className="max-w-3xl mx-auto text-center">
					<h3 className="text-2xl md:text-3xl font-bold mb-4">
						Start Learning Today
					</h3>
					<p className="text-lg mb-6 opacity-90">
						Join thousands of students advancing their careers with our courses
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
							onClick={() => handlePageChange("browse")}
						>
							Browse Courses
						</button>
						<button
							className="px-8 py-3 bg-blue-600 bg-opacity-20 text-white font-medium rounded-lg hover:bg-opacity-30 transition-colors border border-white border-opacity-30"
							onClick={() =>
								showToast(
									"Free trial activated! Enjoy 7 days of premium access."
								)
							}
						>
							Free Trial
						</button>
					</div>
				</div>
			</section>
		</>
	);

	const FiCheck = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	);

	const CourseDetail = () => {
		if (!currentCourse) return null;

		return (
			<div className="bg-white rounded-xl shadow-md overflow-hidden">
				<div className="relative h-48 sm:h-64 md:h-80">
					<img
						src={currentCourse.thumbnail}
						alt={currentCourse.title}
						className="w-full h-full object-cover"
						onError={(e) => {
							(e.target as HTMLImageElement).src =
								"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
					<button
						onClick={() => handlePlayVideo(currentCourse.videoPreview)}
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 sm:p-4 hover:bg-opacity-100 transition-all"
						aria-label="Play course preview"
					>
						<FiPlay className="text-blue-600 text-xl sm:text-2xl" />
					</button>
					<div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
						<div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
							<span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-blue-600 bg-opacity-80 rounded-full">
								{currentCourse.category}
							</span>
							<span
								className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold rounded-full ${
									currentCourse.level === "Beginner"
										? "bg-green-600 bg-opacity-80"
										: currentCourse.level === "Intermediate"
										? "bg-blue-600 bg-opacity-80"
										: "bg-purple-600 bg-opacity-80"
								}`}
							>
								{currentCourse.level}
							</span>
							{currentCourse.bestSeller && (
								<span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-yellow-600 bg-opacity-80 rounded-full">
									Bestseller
								</span>
							)}
							{currentCourse.new && (
								<span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-green-600 bg-opacity-80 rounded-full">
									New
								</span>
							)}
						</div>
						<h1 className="text-xl sm:text-2xl md:text-3xl font-bold line-clamp-2">
							{currentCourse.title}
						</h1>
					</div>
				</div>

				<div className="p-4 sm:p-6">
					<div className="flex flex-wrap gap-3 sm:gap-4 items-center border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
						<div className="flex items-center">
							<img
								src={currentCourse.instructorAvatar}
								alt={currentCourse.instructor}
								className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3"
							/>
							<div>
								<p className="font-medium text-gray-900 text-sm sm:text-base">
									{currentCourse.instructor}
								</p>
								<p className="text-xs sm:text-sm text-gray-500">Instructor</p>
							</div>
						</div>
						<div className="flex items-center">
							<FiStar className="text-yellow-500 fill-current mr-1" />
							<span className="font-medium text-gray-900 text-sm sm:text-base">
								{currentCourse.rating}
							</span>
							<span className="text-gray-500 ml-1 text-xs sm:text-sm">
								({currentCourse.students} students)
							</span>
						</div>
						<div className="flex items-center">
							<FiClock className="text-gray-600 mr-1" />
							<span className="text-gray-700 text-sm sm:text-base">
								{currentCourse.duration}
							</span>
						</div>
						<div className="flex items-center">
							<FiCalendar className="text-gray-600 mr-1" />
							<span className="text-gray-700 text-sm sm:text-base">
								Last updated: {currentCourse.lastUpdated || "Recently"}
							</span>
						</div>
					</div>

					<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
						<div className="lg:w-2/3">
							<div className="flex overflow-x-auto justify-start mb-6 border-b border-gray-200 pb-0 -mx-4 sm:-mx-0 px-4 sm:px-0">
								<button
									className={`pb-3 px-3 sm:px-4 whitespace-nowrap ${
										currentTab === "overview"
											? "border-b-2 border-blue-600 text-blue-600 font-medium"
											: "text-gray-600 hover:text-gray-900"
									}`}
									onClick={() => handleTabChange("overview")}
								>
									Overview
								</button>
								<button
									className={`pb-3 px-3 sm:px-4 whitespace-nowrap ${
										currentTab === "curriculum"
											? "border-b-2 border-blue-600 text-blue-600 font-medium"
											: "text-gray-600 hover:text-gray-900"
									}`}
									onClick={() => handleTabChange("curriculum")}
								>
									Curriculum
								</button>
								<button
									className={`pb-3 px-3 sm:px-4 whitespace-nowrap ${
										currentTab === "instructor"
											? "border-b-2 border-blue-600 text-blue-600 font-medium"
											: "text-gray-600 hover:text-gray-900"
									}`}
									onClick={() => handleTabChange("instructor")}
								>
									Instructor
								</button>
								<button
									className={`pb-3 px-3 sm:px-4 whitespace-nowrap ${
										currentTab === "reviews"
											? "border-b-2 border-blue-600 text-blue-600 font-medium"
											: "text-gray-600 hover:text-gray-900"
									}`}
									onClick={() => handleTabChange("reviews")}
								>
									Reviews
								</button>
							</div>

							<div className="overflow-x-hidden">
								{currentTab === "overview" && (
									<div>
										<h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
											About This Course
										</h3>
										<p className="text-gray-700 mb-6 text-sm sm:text-base">
											{currentCourse.description}
										</p>

										{currentCourse.tags && currentCourse.tags.length > 0 && (
											<div className="mb-6">
												<h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
													Topics Covered
												</h4>
												<div className="flex flex-wrap gap-2">
													{currentCourse.tags.map((tag, index) => (
														<span
															key={index}
															className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 text-xs sm:text-sm rounded-full"
														>
															{tag}
														</span>
													))}
												</div>
											</div>
										)}

										<div className="mb-6">
											<h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
												What You'll Learn
											</h4>
											<ul className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
												{[1, 2, 3, 4, 5, 6].map((item) => (
													<li key={item} className="flex items-start">
														<FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
														<span className="text-gray-700 text-sm sm:text-base">
															{item === 1
																? "Build professional web applications with React and TypeScript"
																: item === 2
																? "Implement advanced design patterns and best practices"
																: item === 3
																? "Create reusable and maintainable component architecture"
																: item === 4
																? "Optimize performance for large-scale applications"
																: item === 5
																? "Write clean, type-safe code with advanced TypeScript features"
																: "Deploy and maintain React applications in production"}
														</span>
													</li>
												))}
											</ul>
										</div>

										<div className="mb-6">
											<h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
												Requirements
											</h4>
											<ul className="space-y-2">
												<li className="flex items-start">
													<FiChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
													<span className="text-gray-700 text-sm sm:text-base">
														Basic knowledge of JavaScript and HTML/CSS
													</span>
												</li>
												<li className="flex items-start">
													<FiChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
													<span className="text-gray-700 text-sm sm:text-base">
														Familiarity with React fundamentals
													</span>
												</li>
												<li className="flex items-start">
													<FiChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
													<span className="text-gray-700 text-sm sm:text-base">
														A code editor and modern web browser
													</span>
												</li>
											</ul>
										</div>

										<div>
											<h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
												Target Audience
											</h4>
											<ul className="space-y-2">
												<li className="flex items-start">
													<FiChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
													<span className="text-gray-700 text-sm sm:text-base">
														Web developers looking to advance their React skills
													</span>
												</li>
												<li className="flex items-start">
													<FiChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
													<span className="text-gray-700 text-sm sm:text-base">
														JavaScript developers transitioning to TypeScript
													</span>
												</li>
												<li className="flex items-start">
													<FiChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
													<span className="text-gray-700 text-sm sm:text-base">
														Frontend engineers seeking to build more
														maintainable applications
													</span>
												</li>
											</ul>
										</div>
									</div>
								)}

								{currentTab === "curriculum" && (
									<div>
										<div className="flex justify-between items-center mb-4">
											<h3 className="text-lg sm:text-xl font-bold text-gray-800">
												Course Curriculum
											</h3>
											<div className="text-xs sm:text-sm text-gray-600">
												{currentCourse.completedLessons || 0}/
												{currentCourse.totalLessons || currentLessons.length}{" "}
												lessons • {currentCourse.duration}
											</div>
										</div>

										<div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
											<div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-800 text-sm sm:text-base">
												Section 1: Getting Started
											</div>
											{currentLessons.map((lesson) => (
												<div
													key={lesson.id}
													className={`border-b border-gray-200 last:border-b-0 ${
														lesson.locked ? "opacity-60" : ""
													}`}
												>
													<div
														className="p-3 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
														onClick={() => {
															if (!lesson.locked) {
																handleViewLesson(lesson);
															} else {
																showToast("This lesson is locked", "error");
															}
														}}
													>
														<div className="flex items-center flex-1 min-w-0">
															<div className="mr-3 sm:mr-4 flex-shrink-0">
																{lesson.completed ? (
																	<div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center text-green-500">
																		<FiCheckCircle className="text-sm sm:text-base fill-current" />
																	</div>
																) : lesson.locked ? (
																	<div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
																		<FiLock className="text-sm sm:text-base" />
																	</div>
																) : (
																	<div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 rounded-full"></div>
																)}
															</div>
															<div className="flex-1 min-w-0">
																<h4 className="font-medium text-gray-800 text-sm sm:text-base flex items-center flex-wrap">
																	<span className="truncate mr-1">
																		{lesson.title}
																	</span>
																	{lesson.preview && (
																		<span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded whitespace-nowrap">
																			Preview
																		</span>
																	)}
																</h4>
																{lesson.description && (
																	<p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
																		{lesson.description}
																	</p>
																)}
															</div>
														</div>
														<div className="flex items-center ml-2 sm:ml-4 flex-shrink-0">
															<span className="text-xs sm:text-sm text-gray-600 mr-2 sm:mr-3 whitespace-nowrap">
																{lesson.duration}
															</span>
															{lesson.resources &&
																lesson.resources.length > 0 && (
																	<div className="relative group">
																		<button className="text-gray-500 hover:text-blue-600 transition-colors">
																			<FiPaperclip />
																		</button>
																		<div className="absolute right-0 top-6 w-52 sm:w-60 bg-white shadow-lg rounded-md border border-gray-200 p-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-10">
																			<h5 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">
																				Lesson Resources
																			</h5>
																			<ul className="space-y-1">
																				{lesson.resources.map((resource) => (
																					<li
																						key={resource.id}
																						className="text-xs sm:text-sm"
																					>
																						<button
																							className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
																							onClick={(e) => {
																								e.stopPropagation();
																								handleViewResource(resource);
																							}}
																						>
																							{resource.type === "PDF" && (
																								<FiFileText className="mr-1 flex-shrink-0" />
																							)}
																							{resource.type === "Video" && (
																								<FiVideo className="mr-1 flex-shrink-0" />
																							)}
																							{resource.type === "Code" && (
																								<FiCode className="mr-1 flex-shrink-0" />
																							)}
																							{resource.type === "Exercise" && (
																								<FiCheckSquare className="mr-1 flex-shrink-0" />
																							)}
																							<span className="truncate">
																								{resource.title}
																							</span>
																							{resource.size && (
																								<span className="ml-1 text-xs text-gray-500">
																									({resource.size})
																								</span>
																							)}
																						</button>
																					</li>
																				))}
																			</ul>
																		</div>
																	</div>
																)}
														</div>
													</div>
												</div>
											))}
										</div>

										<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
											<div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-800 text-sm sm:text-base">
												Section 2: Advanced Concepts
											</div>
											<div className="p-4 sm:p-6 text-center text-gray-600">
												<FiLock className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 text-gray-400" />
												<p className="font-medium mb-1 text-sm sm:text-base">
													Locked Content
												</p>
												<p className="text-xs sm:text-sm mb-4">
													Complete the previous lessons to unlock this section
												</p>
												<button
													className="px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
													onClick={() => handleContinueLearning()}
												>
													Continue Learning
												</button>
											</div>
										</div>
									</div>
								)}
								{currentTab === "instructor" && (
									<div>
										<div className="flex items-start mb-6 flex-col sm:flex-row">
											<img
												src={currentCourse.instructorAvatar}
												alt={currentCourse.instructor}
												className="w-16 h-16 rounded-full mr-0 sm:mr-4 mb-4 sm:mb-0"
											/>
											<div>
												<h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
													{currentCourse.instructor}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600 mb-2">
													Senior Developer & Educational Content Creator
												</p>
												<div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 mb-4 gap-2 sm:gap-4">
													<div className="flex items-center">
														<FiStar className="text-yellow-500 fill-current mr-1" />
														<span>4.8 Instructor Rating</span>
													</div>
													<div className="flex items-center">
														<Users className="mr-1" />
														<span>8,500+ Students</span>
													</div>
													<div className="flex items-center">
														<Book className="mr-1" />
														<span>12 Courses</span>
													</div>
												</div>
											</div>
										</div>

										<div className="mb-6">
											<h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
												About the Instructor
											</h4>
											<p className="text-gray-700 mb-4 text-sm sm:text-base">
												{currentCourse.instructor} is a seasoned developer with
												over 10 years of experience in web development and
												software engineering. Specializing in frontend
												technologies, they have worked with numerous Fortune 500
												companies and startups alike.
											</p>
											<p className="text-gray-700 text-sm sm:text-base">
												As an educator, they are passionate about breaking down
												complex concepts into understandable chunks and has
												helped thousands of students advance their careers
												through practical, job-focused training.
											</p>
										</div>

										<div>
											<button
												className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm sm:text-base"
												onClick={() =>
													showToast(
														"Feature coming soon: View Instructor Profile"
													)
												}
											>
												View Full Profile <FiChevronRight className="ml-1" />
											</button>
										</div>
									</div>
								)}

								{currentTab === "reviews" && (
									<div>
										<div className="mb-6">
											<h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
												Student Feedback
											</h3>
											<div className="flex flex-col md:flex-row items-center gap-6 mb-6">
												<div className="text-center">
													<div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
														{currentCourse.rating}
													</div>
													<div className="flex justify-center mb-1">
														{[...Array(5)].map((_, i) => (
															<FiStar
																key={i}
																className={`text-lg sm:text-xl ${
																	i < Math.floor(currentCourse.rating)
																		? "text-yellow-500 fill-current"
																		: "text-gray-300"
																}`}
															/>
														))}
													</div>
													<p className="text-xs sm:text-sm text-gray-600">
														Course Rating
													</p>
												</div>

												<div className="flex-1 w-full">
													{[5, 4, 3, 2, 1].map((rating) => {
														const percentage =
															rating === 5
																? 78
																: rating === 4
																? 16
																: rating === 3
																? 4
																: rating === 2
																? 1
																: 1;

														return (
															<div
																key={rating}
																className="flex items-center mb-1"
															>
																<div className="flex items-center mr-2 w-12 sm:w-16 flex-shrink-0">
																	<span className="text-xs sm:text-sm text-gray-700 mr-1">
																		{rating}
																	</span>
																	<FiStar className="text-yellow-500 fill-current text-xs sm:text-sm" />
																</div>
																<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
																	<div
																		className="h-full bg-yellow-500"
																		style={{ width: `${percentage}%` }}
																	></div>
																</div>
																<span className="ml-2 text-xs sm:text-sm text-gray-600 w-10 sm:w-12 text-right flex-shrink-0">
																	{percentage}%
																</span>
															</div>
														);
													})}
												</div>
											</div>
										</div>

										<div className="mb-6">
											<div className="flex justify-between items-center flex-wrap mb-4 gap-2">
												<h4 className="text-base sm:text-lg font-semibold text-gray-800">
													Reviews
												</h4>
												<div className="relative">
													<select className="appearance-none bg-white border border-gray-300 py-1 sm:py-2 pl-3 pr-8 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
														<option>Most Relevant</option>
														<option>Most Recent</option>
														<option>Highest Rated</option>
														<option>Lowest Rated</option>
													</select>
													<FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
												</div>
											</div>

											<div className="space-y-6">
												{mockTestimonials.slice(0, 3).map((testimonial) => (
													<div
														key={testimonial.id}
														className="border-b border-gray-200 pb-6 last:border-b-0"
													>
														<div className="flex flex-wrap sm:flex-nowrap justify-between gap-2 mb-2">
															<div className="flex items-center">
																<img
																	src={testimonial.avatar}
																	alt={testimonial.name}
																	className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3"
																/>
																<div>
																	<h5 className="font-medium text-gray-800 text-sm sm:text-base">
																		{testimonial.name}
																	</h5>
																	<p className="text-xs text-gray-500">
																		{testimonial.date}
																	</p>
																</div>
															</div>
															<div className="flex">
																{[...Array(testimonial.rating)].map((_, i) => (
																	<FiStar
																		key={i}
																		className="text-yellow-500 fill-current"
																	/>
																))}
															</div>
														</div>
														<p className="text-gray-700 text-xs sm:text-sm">
															{testimonial.content}
														</p>
													</div>
												))}
											</div>

											<div className="mt-6 text-center">
												<button
													className="px-4 py-2 bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
													onClick={() => showToast("Loading more reviews...")}
												>
													Load More Reviews
												</button>
											</div>
										</div>

										<div>
											<h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
												Leave a Review
											</h4>
											<div className="bg-gray-50 rounded-lg p-4 mb-4">
												<div className="mb-3">
													<p className="text-xs sm:text-sm text-gray-700 mb-2">
														Rate this course:
													</p>
													<div className="flex">
														{[1, 2, 3, 4, 5].map((rating) => (
															<button
																key={rating}
																className={`text-xl sm:text-2xl ${
																	currentUserRating >= rating
																		? "text-yellow-500"
																		: "text-gray-300"
																}`}
																onClick={() => setCurrentUserRating(rating)}
															>
																★
															</button>
														))}
													</div>
												</div>
												<textarea
													placeholder="Write your review here..."
													className="w-full border border-gray-300 rounded-md p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 sm:h-24"
													value={feedbackText}
													onChange={(e) => setFeedbackText(e.target.value)}
												></textarea>
												<div className="flex justify-end mt-2 sm:mt-3">
													<button
														className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
														onClick={() => {
															setActiveFeedbackCourse(currentCourse.id);
															handleSubmitFeedback();
														}}
													>
														Submit Review
													</button>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="lg:w-1/3">
							<div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-24">
								<div className="p-4 sm:p-5">
									{currentCourse.progress > 0 ? (
										<div className="mb-4">
											<div className="flex justify-between text-sm mb-1">
												<span className="font-medium text-gray-700">
													Your Progress
												</span>
												<span className="font-bold text-blue-600">
													{currentCourse.progress}% complete
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
													style={{ width: `${currentCourse.progress}%` }}
												></div>
											</div>
										</div>
									) : (
										<div className="mb-4">
											<div className="flex items-center justify-between flex-wrap gap-y-2">
												{currentCourse.price && (
													<div>
														<span className="text-xl sm:text-2xl font-bold text-gray-800">
															${currentCourse.price.toFixed(2)}
														</span>
														{currentCourse.originalPrice && (
															<span className="text-base sm:text-lg text-gray-500 line-through ml-2">
																${currentCourse.originalPrice.toFixed(2)}
															</span>
														)}
													</div>
												)}
												{currentCourse.originalPrice && currentCourse.price && (
													<span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
														{Math.round(
															100 -
																(currentCourse.price /
																	currentCourse.originalPrice) *
																	100
														)}
														% off
													</span>
												)}
											</div>
											<p className="text-xs sm:text-sm text-gray-500 mt-1">
												Limited time offer
											</p>
										</div>
									)}

									<div className="space-y-3 mb-6">
										<div className="flex items-start">
											<FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
											<div>
												<p className="text-xs sm:text-sm font-medium text-gray-700">
													Full Lifetime Access
												</p>
												<p className="text-xs text-gray-500">
													Learn at your own pace
												</p>
											</div>
										</div>
										<div className="flex items-start">
											<Award className="text-green-500 mt-1 mr-3 flex-shrink-0" />
											<div>
												<p className="text-xs sm:text-sm font-medium text-gray-700">
													Certificate of Completion
												</p>
												<p className="text-xs text-gray-500">
													Earn a certificate when you finish
												</p>
											</div>
										</div>
										<div className="flex items-start">
											<FiMonitor className="text-green-500 mt-1 mr-3 flex-shrink-0" />
											<div>
												<p className="text-xs sm:text-sm font-medium text-gray-700">
													Access on All Devices
												</p>
												<p className="text-xs text-gray-500">
													Desktop, mobile, and tablet
												</p>
											</div>
										</div>
										<div className="flex items-start">
											<FiMessageCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
											<div>
												<p className="text-xs sm:text-sm font-medium text-gray-700">
													Q&A Support
												</p>
												<p className="text-xs text-gray-500">
													Get answers to your questions
												</p>
											</div>
										</div>
									</div>

									{currentCourse.progress > 0 ? (
										<button
											className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all mb-3"
											onClick={() => {
												if (currentLessons.length > 0) {
													const nextUncompletedLesson = currentLessons.find(
														(l) => !l.completed && !l.locked
													);
													if (nextUncompletedLesson) {
														handleViewLesson(nextUncompletedLesson);
													} else {
														showToast("All available lessons completed!");
													}
												}
											}}
										>
											Continue Learning
										</button>
									) : (
										<button
											className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all mb-3"
											onClick={() => {
												handleAddToCart(currentCourse.id);
												showToast(
													cart.includes(currentCourse.id)
														? "Already in cart!"
														: "Course added to cart!"
												);
											}}
										>
											{cart.includes(currentCourse.id)
												? "Already In Cart"
												: "Enroll Now"}
										</button>
									)}

									<button
										className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
										onClick={() => handleAddToWishlist(currentCourse.id)}
									>
										<FiHeart
											className={`mr-2 ${
												wishlist.includes(currentCourse.id)
													? "text-red-500 fill-current"
													: ""
											}`}
										/>
										{wishlist.includes(currentCourse.id)
											? "Saved to Wishlist"
											: "Add to Wishlist"}
									</button>
								</div>

								<div className="border-t border-gray-200 p-4 sm:p-5">
									<h4 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
										This course includes:
									</h4>
									<ul className="space-y-2">
										<li className="flex items-center text-xs sm:text-sm text-gray-700">
											<FiVideo className="text-gray-500 mr-2 flex-shrink-0" />
											{currentCourse.totalLessons || currentLessons.length}{" "}
											on-demand video lessons
										</li>
										<li className="flex items-center text-xs sm:text-sm text-gray-700">
											<FiFileText className="text-gray-500 mr-2 flex-shrink-0" />
											15 downloadable resources
										</li>
										<li className="flex items-center text-xs sm:text-sm text-gray-700">
											<FiCheckSquare className="text-gray-500 mr-2 flex-shrink-0" />
											12 coding exercises
										</li>
										<li className="flex items-center text-xs sm:text-sm text-gray-700">
											<FiMessageCircle className="text-gray-500 mr-2 flex-shrink-0" />
											Forum access and Q&A
										</li>
										<li className="flex items-center text-xs sm:text-sm text-gray-700">
											<Award className="text-gray-500 mr-2 flex-shrink-0" />
											Certificate of completion
										</li>
									</ul>
								</div>

								<div className="border-t border-gray-200 p-4 sm:p-5">
									<button
										className="w-full text-xs sm:text-sm text-center text-blue-600 hover:text-blue-800 transition-colors"
										onClick={() => showToast("Gift feature coming soon!")}
									>
										Gift this course
									</button>
									<button
										className="w-full text-xs sm:text-sm text-center text-blue-600 hover:text-blue-800 transition-colors mt-2"
										onClick={() => showToast("Coupon applied to cart!")}
									>
										Apply Coupon
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const FiFileText = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
			<polyline points="14 2 14 8 20 8"></polyline>
			<line x1="16" y1="13" x2="8" y2="13"></line>
			<line x1="16" y1="17" x2="8" y2="17"></line>
			<polyline points="10 9 9 9 8 9"></polyline>
		</svg>
	);

	const FiPaperclip = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
		</svg>
	);

	const FiLock = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
			<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
		</svg>
	);

	const MyCourses = () => {
		const enrolledCourses = mockCourses.filter((course) => course.progress > 0);

		return (
			<>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800">
						My Enrolled Courses
					</h2>
				</div>

				<div className="mb-8">
					{enrolledCourses.length === 0 ? (
						<div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
							<Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								No courses yet
							</h3>
							<p className="text-gray-600 mb-6">
								You haven't enrolled in any courses yet. Browse our catalog to
								find courses that interest you.
							</p>
							<button
								className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								onClick={() => handlePageChange("browse")}
							>
								Browse Courses
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{enrolledCourses.map((course) => (
								<motion.div
									key={course.id}
									whileHover={{ y: -5 }}
									className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
								>
									<div className="relative h-40">
										<img
											src={course.thumbnail}
											alt={course.title}
											className="w-full h-full object-cover"
											onError={(e) => {
												e.target.src =
													"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
											}}
										/>
										<div className="absolute inset-0 bg-black bg-opacity-20"></div>
										<button
											onClick={() => handlePlayVideo(course.videoPreview)}
											className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition-all"
										>
											<FiPlay className="text-blue-600 text-xl" />
										</button>
									</div>

									<div className="p-5">
										<h3
											className="font-bold text-lg text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
											onClick={() => handleViewCourse(course)}
										>
											{course.title}
										</h3>
										<p className="text-sm text-gray-600 mb-4 flex items-center">
											<img
												src={course.instructorAvatar}
												alt={course.instructor}
												className="w-5 h-5 rounded-full mr-2"
											/>
											{course.instructor}
										</p>

										<div className="mb-4">
											<div className="flex justify-between text-sm mb-1">
												<span className="font-medium text-gray-700">
													Progress
												</span>
												<span className="font-bold text-blue-600">
													{course.progress}% complete
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
													style={{ width: `${course.progress}%` }}
												></div>
											</div>
										</div>

										<div className="flex items-center justify-between text-sm text-gray-600 mb-4">
											<div className="flex items-center">
												<FiClock className="mr-1" />
												<span>{course.duration}</span>
											</div>
											{course.completedLessons && course.totalLessons && (
												<div>
													{course.completedLessons}/{course.totalLessons}{" "}
													lessons
												</div>
											)}
										</div>

										<button
											className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
											onClick={() => handleViewCourse(course)}
										>
											Continue Learning
										</button>
									</div>
								</motion.div>
							))}
						</div>
					)}
				</div>

				<div className="mb-12">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">
							Recommended For You
						</h2>
						<a
							href="#"
							className="text-blue-600 font-medium hover:underline flex items-center"
							onClick={(e) => {
								e.preventDefault();
								handlePageChange("browse");
							}}
						>
							View all <FiChevronRight className="ml-1" />
						</a>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{mockCourses
							.filter((course) => course.progress === 0)
							.slice(0, 4)
							.map((course) => (
								<motion.div
									key={course.id}
									whileHover={{ y: -5 }}
									className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
								>
									<div className="relative h-40">
										<img
											src={course.thumbnail}
											alt={course.title}
											className="w-full h-full object-cover"
											onError={(e) => {
												e.target.src =
													"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
											}}
										/>
										{course.bestSeller && (
											<div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
												Bestseller
											</div>
										)}
										{course.new && (
											<div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
												New
											</div>
										)}
									</div>

									<div className="p-4">
										<span
											className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${
												course.level === "Beginner"
													? "bg-green-100 text-green-800"
													: course.level === "Intermediate"
													? "bg-blue-100 text-blue-800"
													: "bg-purple-100 text-purple-800"
											}`}
										>
											{course.level}
										</span>

										<h3
											className="font-bold text-base text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
											onClick={() => handleViewCourse(course)}
										>
											{course.title}
										</h3>

										<div className="flex items-center text-sm text-yellow-600 mb-3">
											<FiStar className="fill-current mr-1" />
											<span>{course.rating}</span>
											<span className="text-gray-500 ml-1">
												({course.students})
											</span>
										</div>

										<div className="flex items-center justify-between mt-auto">
											<div>
												{course.price && (
													<span className="font-bold text-gray-800">
														${course.price.toFixed(2)}
													</span>
												)}
											</div>
											<button
												className="text-blue-600 hover:text-blue-800 text-sm font-medium"
												onClick={() => handleAddToCart(course.id)}
											>
												{cart.includes(course.id) ? "In Cart" : "Enroll"}
											</button>
										</div>
									</div>
								</motion.div>
							))}
					</div>
				</div>
			</>
		);
	};

	const Achievements = () => (
		<>
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">
					Your Achievements
				</h2>

				<div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
					<div className="p-6 md:p-8">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
							<div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
								<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">
									<FiClock />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-1">
									{userStats.streakDays}
								</h3>
								<p className="text-sm text-gray-600">Day Streak</p>
							</div>

							<div className="bg-green-50 rounded-lg p-4 border border-green-100">
								<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3">
									<Book />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-1">
									{userStats.coursesCompleted}
								</h3>
								<p className="text-sm text-gray-600">Courses Completed</p>
							</div>

							<div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
								<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-3">
									<Award />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-1">
									{userStats.certificatesEarned}
								</h3>
								<p className="text-sm text-gray-600">Certificates Earned</p>
							</div>

							<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
								<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-3">
									<FiBarChart2 />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-1">
									{userStats.quizAverage}%
								</h3>
								<p className="text-sm text-gray-600">Quiz Average</p>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
						<div className="p-6">
							<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
								<Award className="text-blue-500 mr-2" /> Recent Achievements
							</h3>

							<div className="space-y-4">
								<div className="flex items-start">
									<div className="bg-green-100 rounded-full p-2 text-green-600 mr-3">
										<FiCheckCircle />
									</div>
									<div>
										<h4 className="font-medium text-gray-800">7-Day Streak</h4>
										<p className="text-sm text-gray-600">
											Learned for 7 consecutive days
										</p>
										<p className="text-xs text-gray-500 mt-1">3 days ago</p>
									</div>
								</div>

								<div className="flex items-start">
									<div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3">
										<FiStar />
									</div>
									<div>
										<h4 className="font-medium text-gray-800">
											First Certificate
										</h4>
										<p className="text-sm text-gray-600">
											Completed your first course
										</p>
										<p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
									</div>
								</div>

								<div className="flex items-start">
									<div className="bg-purple-100 rounded-full p-2 text-purple-600 mr-3">
										<FiThumbsUp />
									</div>
									<div>
										<h4 className="font-medium text-gray-800">Perfect Score</h4>
										<p className="text-sm text-gray-600">
											Scored 100% on a quiz
										</p>
										<p className="text-xs text-gray-500 mt-1">1 month ago</p>
									</div>
								</div>
							</div>

							<button
								className="w-full mt-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
								onClick={() => showToast("Loading more achievements...")}
							>
								View All
							</button>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
						<div className="p-6">
							<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
								<FiTrendingUp className="text-green-500 mr-2" /> Weekly Progress
							</h3>

							<div className="space-y-3 mb-4">
								<div>
									<div className="flex justify-between text-sm mb-1">
										<span className="text-gray-600">Learning Goal</span>
										<span className="font-medium text-gray-800">
											5 hrs / week
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
											style={{ width: "65%" }}
										></div>
									</div>
									<div className="flex justify-between text-xs text-gray-500 mt-1">
										<span>3.25 hrs completed</span>
										<span>65%</span>
									</div>
								</div>

								<div className="bg-gray-50 rounded-lg p-3">
									<h4 className="font-medium text-gray-800 mb-2">
										Daily Activity
									</h4>
									<div className="flex justify-between">
										{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
											<div key={index} className="flex flex-col items-center">
												<div
													className={`w-8 ${
														[0, 1, 2, 4].includes(index)
															? "bg-green-500"
															: "bg-gray-200"
													} rounded-t-sm`}
													style={{
														height: `${
															[0, 1, 2, 4].includes(index)
																? index === 2
																	? "60px"
																	: "40px"
																: "15px"
														}`,
													}}
												></div>
												<span className="text-xs text-gray-600 mt-1">
													{day}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>

							<button
								className="w-full mt-2 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
								onClick={() =>
									showToast("View detailed analytics feature coming soon!")
								}
							>
								Detailed Analytics
							</button>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
						<div className="p-6">
							<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
								<FiTarget className="text-red-500 mr-2" /> Upcoming Goals
							</h3>

							<div className="space-y-4">
								<div className="flex items-start">
									<div className="bg-yellow-100 rounded-full p-2 text-yellow-600 mr-3">
										<FiClock />
									</div>
									<div>
										<h4 className="font-medium text-gray-800">30-Day Streak</h4>
										<div className="w-full bg-gray-200 rounded-full h-2 mt-2 mb-1">
											<div
												className="bg-yellow-500 h-2 rounded-full"
												style={{ width: "40%" }}
											></div>
										</div>
										<p className="text-xs text-gray-500">12/30 days</p>
									</div>
								</div>

								<div className="flex items-start">
									<div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3">
										<Book />
									</div>
									<div>
										<h4 className="font-medium text-gray-800">
											Complete 5 Courses
										</h4>
										<div className="w-full bg-gray-200 rounded-full h-2 mt-2 mb-1">
											<div
												className="bg-blue-500 h-2 rounded-full"
												style={{ width: "60%" }}
											></div>
										</div>
										<p className="text-xs text-gray-500">3/5 courses</p>
									</div>
								</div>

								<div className="flex items-start">
									<div className="bg-green-100 rounded-full p-2 text-green-600 mr-3">
										<Award />
									</div>
									<div>
										<h4 className="font-medium text-gray-800">
											Earn Advanced Certificate
										</h4>
										<div className="w-full bg-gray-200 rounded-full h-2 mt-2 mb-1">
											<div
												className="bg-green-500 h-2 rounded-full"
												style={{ width: "20%" }}
											></div>
										</div>
										<p className="text-xs text-gray-500">In progress</p>
									</div>
								</div>
							</div>

							<button
								className="w-full mt-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
								onClick={() =>
									showToast("Setting new goals feature coming soon!")
								}
							>
								Set New Goal
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">
					Achievement Badges
				</h2>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
					{[
						{
							name: "Quick Starter",
							icon: <FiZap />,
							earned: true,
							date: "Jan 15, 2023",
						},
						{
							name: "Coding Ninja",
							icon: <FiCode />,
							earned: true,
							date: "Feb 22, 2023",
						},
						{
							name: "Quiz Master",
							icon: <Award />,
							earned: true,
							date: "Mar 10, 2023",
						},
						{
							name: "Social Learner",
							icon: <FiMessageCircle />,
							earned: false,
						},
						{ name: "Night Owl", icon: <FiMoon />, earned: false },
						{ name: "Weekend Warrior", icon: <FiSun />, earned: false },
						{ name: "Full Stack Pro", icon: <FiLayers />, earned: false },
						{ name: "Data Scientist", icon: <FiPieChart />, earned: false },
						{ name: "Design Expert", icon: <FiEdit />, earned: false },
						{ name: "AI Explorer", icon: <FiBrain />, earned: false },
						{ name: "Cloud Master", icon: <FiCloud />, earned: false },
						{ name: "Mobile Developer", icon: <FiSmartphone />, earned: false },
					].map((badge, index) => (
						<div
							key={index}
							className={`bg-white rounded-xl p-4 border ${
								badge.earned
									? "border-blue-200 shadow-md"
									: "border-gray-200 opacity-60"
							} flex flex-col items-center text-center transition-all hover:shadow-md ${
								badge.earned ? "hover:border-blue-300" : "hover:border-gray-300"
							}`}
						>
							<div
								className={`w-16 h-16 rounded-full ${
									badge.earned
										? "bg-blue-100 text-blue-600"
										: "bg-gray-100 text-gray-400"
								} flex items-center justify-center text-2xl mb-3`}
							>
								{badge.icon}
							</div>
							<h3
								className={`font-medium ${
									badge.earned ? "text-gray-800" : "text-gray-600"
								} mb-1`}
							>
								{badge.name}
							</h3>
							{badge.earned ? (
								<p className="text-xs text-blue-600">Earned {badge.date}</p>
							) : (
								<p className="text-xs text-gray-500">Not earned yet</p>
							)}
						</div>
					))}
				</div>
			</div>
		</>
	);

	const FiZap = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
		</svg>
	);

	const FiThumbsUp = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
		</svg>
	);

	const FiTarget = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="10"></circle>
			<circle cx="12" cy="12" r="6"></circle>
			<circle cx="12" cy="12" r="2"></circle>
		</svg>
	);

	const FiMoon = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	);

	const FiSun = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="5"></circle>
			<line x1="12" y1="1" x2="12" y2="3"></line>
			<line x1="12" y1="21" x2="12" y2="23"></line>
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
			<line x1="1" y1="12" x2="3" y2="12"></line>
			<line x1="21" y1="12" x2="23" y2="12"></line>
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
		</svg>
	);

	const FiBrain = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 0 19.5v-15A2.5 2.5 0 0 1 2.5 2h7Z"></path>
			<path d="M14.5 22A2.5 2.5 0 0 0 12 19.5v-15A2.5 2.5 0 0 1 14.5 2h7A2.5 2.5 0 0 1 24 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-7Z"></path>
			<path d="M6 12h4"></path>
			<path d="M14 12h4"></path>
		</svg>
	);

	const FiCloud = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
		</svg>
	);

	const LessonModal = () => {
		if (!selectedLesson) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
					<div className="p-4 border-b border-gray-200 flex justify-between items-center">
						<h3 className="text-xl font-bold text-gray-800">
							{selectedLesson.title}
						</h3>
						<button
							onClick={() => setIsLessonModalOpen(false)}
							className="text-gray-500 hover:text-gray-700 transition-colors"
						>
							<FiX className="text-xl" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6">
						<div className="aspect-video bg-gray-900 mb-6 rounded-lg flex items-center justify-center">
							<div className="text-center">
								<FiPlay className="text-white text-4xl mx-auto mb-4" />
								<p className="text-white">Lesson video would play here</p>
							</div>
						</div>

						<div className="mb-6">
							<h4 className="text-lg font-bold text-gray-800 mb-3">
								Lesson Description
							</h4>
							<p className="text-gray-700">
								{selectedLesson.description ||
									"No description available for this lesson."}
							</p>
						</div>

						{selectedLesson.resources &&
							selectedLesson.resources.length > 0 && (
								<div className="mb-6">
									<h4 className="text-lg font-bold text-gray-800 mb-3">
										Resources
									</h4>
									<div className="space-y-2">
										{selectedLesson.resources.map((resource) => (
											<div
												key={resource.id}
												className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
											>
												<div
													className={`p-2 rounded-full mr-3 ${
														resource.type === "PDF"
															? "bg-red-100 text-red-600"
															: resource.type === "Video"
															? "bg-blue-100 text-blue-600"
															: resource.type === "Code"
															? "bg-purple-100 text-purple-600"
															: "bg-green-100 text-green-600"
													}`}
												>
													{resource.type === "PDF" && <FiFileText />}
													{resource.type === "Video" && <FiVideo />}
													{resource.type === "Code" && <FiCode />}
													{resource.type === "Exercise" && <FiCheckSquare />}
												</div>
												<div className="flex-1">
													<h5 className="font-medium text-gray-800">
														{resource.title}
													</h5>
													<p className="text-xs text-gray-500">
														{resource.type}{" "}
														{resource.size ? `(${resource.size})` : ""}
													</p>
												</div>
												<button
													className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded hover:bg-blue-200 transition-colors"
													onClick={() => handleViewResource(resource)}
												>
													Download
												</button>
											</div>
										))}
									</div>
								</div>
							)}

						<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
							<h4 className="font-bold text-gray-800 mb-3">Discussion</h4>

							<div className="mb-4 border-b border-gray-200">
								<div className="flex space-x-4">
									<button
										className={`pb-2 px-3 ${
											activeDiscussionTab === "questions"
												? "border-b-2 border-blue-600 text-blue-600 font-medium"
												: "text-gray-600"
										}`}
										onClick={() => setActiveDiscussionTab("questions")}
									>
										Questions
									</button>
									<button
										className={`pb-2 px-3 ${
											activeDiscussionTab === "notes"
												? "border-b-2 border-blue-600 text-blue-600 font-medium"
												: "text-gray-600"
										}`}
										onClick={() => setActiveDiscussionTab("notes")}
									>
										Notes
									</button>
									<button
										className={`pb-2 px-3 ${
											activeDiscussionTab === "announcements"
												? "border-b-2 border-blue-600 text-blue-600 font-medium"
												: "text-gray-600"
										}`}
										onClick={() => setActiveDiscussionTab("announcements")}
									>
										Announcements
									</button>
								</div>
							</div>

							{activeDiscussionTab === "questions" && (
								<div>
									<div className="flex space-y-4 flex-col">
										<div className="flex p-3 bg-white rounded-lg border border-gray-200">
											<img
												src="https://i.pravatar.cc/150?img=46"
												alt="User"
												className="w-8 h-8 rounded-full mr-3"
											/>
											<div>
												<div className="flex items-center mb-1">
													<h5 className="font-medium text-gray-800 mr-2">
														Alex Turner
													</h5>
													<span className="text-xs text-gray-500">
														2 days ago
													</span>
												</div>
												<p className="text-sm text-gray-700 mb-2">
													How would we handle error boundaries in this context?
												</p>
												<div className="flex items-center text-xs text-gray-500">
													<button className="flex items-center hover:text-blue-600 transition-colors mr-4">
														<FiThumbsUp className="mr-1" /> 3 Likes
													</button>
													<button className="flex items-center hover:text-blue-600 transition-colors">
														<FiMessageCircle className="mr-1" /> 2 Replies
													</button>
												</div>
											</div>
										</div>

										<div className="flex p-3 bg-white rounded-lg border border-gray-200">
											<img
												src="https://i.pravatar.cc/150?img=65"
												alt="User"
												className="w-8 h-8 rounded-full mr-3"
											/>
											<div>
												<div className="flex items-center mb-1">
													<h5 className="font-medium text-gray-800 mr-2">
														Maria Garcia
													</h5>
													<span className="text-xs text-gray-500">
														1 week ago
													</span>
												</div>
												<p className="text-sm text-gray-700 mb-2">
													Is there a performance difference between using
													Context API and Redux?
												</p>
												<div className="flex items-center text-xs text-gray-500">
													<button className="flex items-center hover:text-blue-600 transition-colors mr-4">
														<FiThumbsUp className="mr-1" /> 5 Likes
													</button>
													<button className="flex items-center hover:text-blue-600 transition-colors">
														<FiMessageCircle className="mr-1" /> 4 Replies
													</button>
												</div>
											</div>
										</div>
									</div>

									<div className="mt-4">
										<div className="flex">
											<img
												src={userAvatar}
												alt="Your profile"
												className="w-8 h-8 rounded-full mr-3"
											/>
											<div className="flex-1">
												<textarea
													placeholder="Ask a question..."
													className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
												></textarea>
												<div className="flex justify-end mt-2">
													<button
														className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
														onClick={() => showToast("Question submitted!")}
													>
														Post Question
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{activeDiscussionTab === "notes" && (
								<div className="text-center p-4">
									<FiEdit className="w-12 h-12 text-gray-300 mx-auto mb-2" />
									<p className="text-gray-600 mb-4">
										You haven't taken any notes for this lesson yet.
									</p>
									<button
										className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
										onClick={() =>
											showToast("Note taking feature coming soon!")
										}
									>
										Add a Note
									</button>
								</div>
							)}

							{activeDiscussionTab === "announcements" && (
								<div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
									<div className="flex items-start">
										<div className="bg-yellow-100 rounded-full p-2 text-yellow-600 mr-3">
											<FiBell />
										</div>
										<div>
											<div className="flex items-center mb-1">
												<h5 className="font-medium text-gray-800 mr-2">
													Course Update
												</h5>
												<span className="text-xs text-gray-500">
													3 days ago
												</span>
											</div>
											<p className="text-sm text-gray-700">
												New lessons have been added to the Advanced React
												Patterns section. Check them out!
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="p-4 border-t border-gray-200 flex justify-between items-center">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="lessonCompleted"
								className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								checked={selectedLesson.completed}
								onChange={() =>
									handleLessonCompletion(
										selectedLesson.id,
										!selectedLesson.completed
									)
								}
							/>
							<label
								htmlFor="lessonCompleted"
								className="ml-2 text-sm text-gray-700"
							>
								Mark as completed
							</label>
						</div>

						<div className="flex space-x-2">
							<button
								className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
								onClick={() => setIsLessonModalOpen(false)}
							>
								Close
							</button>
							<button
								className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
								onClick={() => {
									const currentIndex = currentLessons.findIndex(
										(l) => l.id === selectedLesson.id
									);
									const nextLesson = currentLessons[currentIndex + 1];

									if (nextLesson && !nextLesson.locked) {
										setSelectedLesson(nextLesson);
										handleLessonCompletion(selectedLesson.id, true);
									} else {
										showToast("No more lessons available!");
									}
								}}
							>
								Next Lesson
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const ResourceModal = () => {
		if (!selectedResource) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
					<div className="p-4 border-b border-gray-200 flex justify-between items-center">
						<h3 className="text-xl font-bold text-gray-800">
							{selectedResource.title}
						</h3>
						<button
							onClick={() => setIsResourceModalOpen(false)}
							className="text-gray-500 hover:text-gray-700 transition-colors"
						>
							<FiX className="text-xl" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6">
						<div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg mb-6">
							{selectedResource.type === "PDF" && (
								<div className="text-center">
									<FiFileText className="text-red-500 text-5xl mx-auto mb-3" />
									<h4 className="font-medium text-gray-800">
										{selectedResource.title}
									</h4>
									<p className="text-sm text-gray-600">
										{selectedResource.size || "PDF Document"}
									</p>
								</div>
							)}

							{selectedResource.type === "Video" && (
								<div className="text-center">
									<FiVideo className="text-blue-500 text-5xl mx-auto mb-3" />
									<h4 className="font-medium text-gray-800">
										{selectedResource.title}
									</h4>
									<p className="text-sm text-gray-600">Video Resource</p>
								</div>
							)}

							{selectedResource.type === "Code" && (
								<div className="w-full h-full p-4 bg-gray-900 rounded-lg text-gray-200 font-mono text-sm overflow-auto">
									<pre>{`
import React, { useState, useEffect } from 'react';

function ExampleComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="example-component">
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <ul>
        {data.items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExampleComponent;`}</pre>
								</div>
							)}

							{selectedResource.type === "Exercise" && (
								<div className="text-center">
									<FiCheckSquare className="text-green-500 text-5xl mx-auto mb-3" />
									<h4 className="font-medium text-gray-800">
										{selectedResource.title}
									</h4>
									<p className="text-sm text-gray-600">Interactive Exercise</p>
								</div>
							)}
						</div>

						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
							<h4 className="font-medium text-blue-800 mb-2 flex items-center">
								<FiInfo className="mr-2" /> About this resource
							</h4>
							<p className="text-sm text-blue-700">
								This {selectedResource.type.toLowerCase()}{" "}
								{selectedResource.type === "Exercise" ? "provides" : "contains"}{" "}
								additional information and examples to help you better
								understand the concepts covered in this lesson.
								{selectedResource.type === "Exercise" &&
									" Complete the exercises to test your knowledge and reinforce your learning."}
							</p>
						</div>

						{selectedResource.type === "Exercise" && (
							<div className="space-y-4">
								<div className="border border-gray-200 rounded-lg p-4">
									<h4 className="font-medium text-gray-800 mb-2">Exercise 1</h4>
									<p className="text-sm text-gray-700 mb-3">
										Create a custom hook that fetches data from an API and
										handles loading and error states.
									</p>
									<textarea
										className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 font-mono"
										placeholder="Write your code here"
									></textarea>
								</div>

								<div className="border border-gray-200 rounded-lg p-4">
									<h4 className="font-medium text-gray-800 mb-2">Exercise 2</h4>
									<p className="text-sm text-gray-700 mb-3">
										Implement a context provider for theme switching (light/dark
										mode).
									</p>
									<textarea
										className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 font-mono"
										placeholder="Write your code here"
									></textarea>
								</div>
							</div>
						)}
					</div>

					<div className="p-4 border-t border-gray-200 flex justify-end">
						{selectedResource.type === "Exercise" ? (
							<div className="flex space-x-2">
								<button
									className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
									onClick={() => setIsResourceModalOpen(false)}
								>
									Save & Close
								</button>
								<button
									className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
									onClick={() => {
										showToast("Answers submitted successfully!");
										setIsResourceModalOpen(false);
									}}
								>
									Submit Answers
								</button>
							</div>
						) : (
							<div className="flex space-x-2">
								<button
									className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
									onClick={() => setIsResourceModalOpen(false)}
								>
									Close
								</button>
								<button
									className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
									onClick={() => {
										showToast(
											`${selectedResource.type} downloaded successfully!`
										);
									}}
								>
									Download
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};

	const FiInfo = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="10"></circle>
			<line x1="12" y1="16" x2="12" y2="12"></line>
			<line x1="12" y1="8" x2="12.01" y2="8"></line>
		</svg>
	);

	const LoginModal = () => (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
				<div className="p-6">
					<div className="text-center mb-6">
						<div className="flex items-center justify-center mb-4">
							<svg
								className="w-12 h-12 text-blue-600"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 6.253C13.184 5.476 14.598 5 16 5C19 5 21 7.5 21 10.5C21 13.5 19 16 16 16C14.598 16 13.184 15.524 12 14.747C10.816 15.524 9.402 16 8 16C5 16 3 13.5 3 10.5C3 7.5 5 5 8 5C9.402 5 10.816 5.476 12 6.253Z"
									fill="currentColor"
								/>
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-gray-800 mb-1">Sign Out</h2>
						<p className="text-gray-600">Are you sure you want to sign out?</p>
					</div>

					<div className="flex space-x-3">
						<button
							className="flex-1 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
							onClick={() => setIsLoginModalOpen(false)}
						>
							Cancel
						</button>
						<button
							className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
							onClick={() => {
								setIsLoginModalOpen(false);
								showToast("You have been signed out successfully!");
							}}
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const LiveSessionModal = () => {
		if (!selectedLiveSession) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
					<div className="p-4 border-b border-gray-200 flex justify-between items-center">
						<h3 className="text-xl font-bold text-gray-800">
							{selectedLiveSession.title}
						</h3>
						<button
							onClick={() => setIsLiveSessionModalOpen(false)}
							className="text-gray-500 hover:text-gray-700 transition-colors"
						>
							<FiX className="text-xl" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6">
						<div className="aspect-video bg-gray-900 mb-6 rounded-lg overflow-hidden">
							<img
								src={selectedLiveSession.thumbnail}
								alt={selectedLiveSession.title}
								className="w-full h-full object-cover opacity-60"
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								{selectedLiveSession.registered ? (
									<div className="text-center">
										<FiCalendar className="text-white text-4xl mx-auto mb-2" />
										<p className="text-white text-xl font-bold mb-2">
											Session Scheduled
										</p>
										<p className="text-white">
											Join on {selectedLiveSession.date} at{" "}
											{selectedLiveSession.time}
										</p>
									</div>
								) : (
									<div className="text-center">
										<FiVideo className="text-white text-4xl mx-auto mb-2" />
										<p className="text-white text-xl font-bold mb-2">
											Register to Attend
										</p>
										<p className="text-white">
											Live session with {selectedLiveSession.instructor}
										</p>
									</div>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<div className="flex items-center text-gray-700 mb-2">
									<FiCalendar className="mr-2" />
									<span className="font-medium">Date & Time</span>
								</div>
								<p className="text-gray-800">{selectedLiveSession.date}</p>
								<p className="text-gray-800">
									{selectedLiveSession.time} ({selectedLiveSession.duration})
								</p>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<div className="flex items-center text-gray-700 mb-2">
									<User className="mr-2" />
									<span className="font-medium">Instructor</span>
								</div>
								<p className="text-gray-800">
									{selectedLiveSession.instructor}
								</p>
								<p className="text-gray-600 text-sm">Senior Developer</p>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<div className="flex items-center text-gray-700 mb-2">
									<Users className="mr-2" />
									<span className="font-medium">Participants</span>
								</div>
								<p className="text-gray-800">
									{selectedLiveSession.participants} enrolled
								</p>
								<p className="text-gray-600 text-sm">Limited spots available</p>
							</div>
						</div>

						<div className="mb-6">
							<h4 className="text-lg font-bold text-gray-800 mb-3">
								About This Session
							</h4>
							<p className="text-gray-700 mb-4">
								Join {selectedLiveSession.instructor} for a live interactive
								session on {selectedLiveSession.title.toLowerCase()}. This
								session will include a presentation, demonstrations, and a Q&A
								portion where you can get your questions answered in real-time.
							</p>
							<p className="text-gray-700">
								Whether you're just starting out or looking to deepen your
								understanding, this session will provide valuable insights and
								practical tips you can apply immediately to your projects.
							</p>
						</div>

						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
							<h4 className="font-medium text-blue-800 mb-2 flex items-center">
								<FiInfo className="mr-2" /> What You'll Learn
							</h4>
							<ul className="space-y-2 text-blue-700 text-sm">
								<li className="flex items-start">
									<FiCheckCircle className="mt-1 mr-2 text-blue-600" />
									<span>Advanced techniques and best practices</span>
								</li>
								<li className="flex items-start">
									<FiCheckCircle className="mt-1 mr-2 text-blue-600" />
									<span>Real-world examples and use cases</span>
								</li>
								<li className="flex items-start">
									<FiCheckCircle className="mt-1 mr-2 text-blue-600" />
									<span>Common pitfalls and how to avoid them</span>
								</li>
								<li className="flex items-start">
									<FiCheckCircle className="mt-1 mr-2 text-blue-600" />
									<span>Answers to your specific questions</span>
								</li>
							</ul>
						</div>

						<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
							<h4 className="font-medium text-gray-800 mb-3">Requirements</h4>
							<ul className="space-y-2 text-gray-700 text-sm">
								<li className="flex items-start">
									<FiChevronRight className="mt-1 mr-2 text-gray-600" />
									<span>
										Basic understanding of {selectedLiveSession.category}
									</span>
								</li>
								<li className="flex items-start">
									<FiChevronRight className="mt-1 mr-2 text-gray-600" />
									<span>A reliable internet connection</span>
								</li>
								<li className="flex items-start">
									<FiChevronRight className="mt-1 mr-2 text-gray-600" />
									<span>Webcam and microphone (optional for Q&A)</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="p-4 border-t border-gray-200 flex justify-end">
						<div className="flex space-x-2">
							<button
								className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
								onClick={() => setIsLiveSessionModalOpen(false)}
							>
								Close
							</button>
							<button
								className={`px-4 py-2 ${
									selectedLiveSession.registered
										? "bg-gray-600 hover:bg-gray-700"
										: "bg-blue-600 hover:bg-blue-700"
								} text-white font-medium rounded-md transition-colors`}
								onClick={() => {
									if (!selectedLiveSession.registered) {
										handleRegisterForLiveSession(selectedLiveSession);
									}
									setIsLiveSessionModalOpen(false);
								}}
							>
								{selectedLiveSession.registered
									? "Already Registered"
									: "Register Now"}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const CouponModal = () => (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
				<div className="p-4 border-b border-gray-200 flex justify-between items-center">
					<h3 className="text-xl font-bold text-gray-800">Apply Coupon</h3>
					<button
						onClick={() => setIsCouponModalOpen(false)}
						className="text-gray-500 hover:text-gray-700 transition-colors"
					>
						<FiX className="text-xl" />
					</button>
				</div>

				<div className="p-6">
					<div className="mb-6">
						<label
							htmlFor="couponCode"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Enter Coupon Code
						</label>
						<input
							type="text"
							id="couponCode"
							className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="e.g. SUMMER25"
						/>
					</div>

					<div className="mb-6">
						<h4 className="font-medium text-gray-800 mb-3">
							Available Coupons
						</h4>
						<div className="space-y-3">
							{coupons.map((coupon) => (
								<div
									key={coupon.id}
									className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
								>
									<div>
										<h5 className="font-medium text-gray-800">{coupon.code}</h5>
										<p className="text-sm text-gray-600">
											{coupon.discount}% off • Expires {coupon.expiryDate}
										</p>
									</div>
									<button
										className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded hover:bg-blue-200 transition-colors"
										onClick={() => handleApplyCoupon(coupon.code)}
									>
										Apply
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="flex space-x-3">
						<button
							className="flex-1 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
							onClick={() => setIsCouponModalOpen(false)}
						>
							Cancel
						</button>
						<button
							className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
							onClick={() => handleApplyCoupon("CUSTOM")}
						>
							Apply Coupon
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const FeedbackModal = () => (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
				<div className="p-4 border-b border-gray-200 flex justify-between items-center">
					<h3 className="text-xl font-bold text-gray-800">Leave Feedback</h3>
					<button
						onClick={() => setIsFeedbackModalOpen(false)}
						className="text-gray-500 hover:text-gray-700 transition-colors"
					>
						<FiX className="text-xl" />
					</button>
				</div>

				<div className="p-6">
					<div className="text-center mb-6">
						<h4 className="font-medium text-gray-800 mb-2">
							How would you rate this course?
						</h4>
						<div className="flex justify-center mb-2">
							{[1, 2, 3, 4, 5].map((rating) => (
								<button
									key={rating}
									className={`text-3xl ${
										currentUserRating >= rating
											? "text-yellow-500"
											: "text-gray-300"
									}`}
									onClick={() => setCurrentUserRating(rating)}
								>
									★
								</button>
							))}
						</div>
						<p className="text-sm text-gray-600">
							{currentUserRating === 5
								? "Excellent!"
								: currentUserRating === 4
								? "Very Good"
								: currentUserRating === 3
								? "Good"
								: currentUserRating === 2
								? "Fair"
								: currentUserRating === 1
								? "Poor"
								: "Select a rating"}
						</p>
					</div>

					<div className="mb-6">
						<label
							htmlFor="feedbackText"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Share your thoughts (optional)
						</label>
						<textarea
							id="feedbackText"
							className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
							placeholder="What did you like or dislike about this course?"
							value={feedbackText}
							onChange={(e) => setFeedbackText(e.target.value)}
						></textarea>
					</div>

					<div className="flex space-x-3">
						<button
							className="flex-1 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
							onClick={() => setIsFeedbackModalOpen(false)}
						>
							Cancel
						</button>
						<button
							className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
							onClick={handleSubmitFeedback}
							disabled={currentUserRating === 0}
						>
							Submit Feedback
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const SearchModal = () => (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
				<div className="p-4 border-b border-gray-200 flex justify-between items-center">
					<h3 className="text-xl font-bold text-gray-800">Search Courses</h3>
					<button
						onClick={() => setIsSearchModalOpen(false)}
						className="text-gray-500 hover:text-gray-700 transition-colors"
					>
						<FiX className="text-xl" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					<div className="relative w-full mb-6">
						<input
							type="text"
							placeholder="Search for courses, instructors, or topics..."
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
							value={searchQuery}
							onChange={handleSearchInputChange}
							autoFocus
						/>
						<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<div>
							<h4 className="font-medium text-gray-800 mb-3 flex items-center">
								<FiTag className="mr-2" /> Categories
							</h4>
							<div className="grid grid-cols-2 gap-2">
								{categories.slice(0, 8).map((category) => (
									<div key={category.id} className="flex items-center">
										<input
											type="checkbox"
											id={`category-${category.id}`}
											className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
											checked={courseFilters.categories.includes(category.name)}
											onChange={() =>
												handleFilterChange("categories", category.name)
											}
										/>
										<label
											htmlFor={`category-${category.id}`}
											className="ml-2 text-sm text-gray-700"
										>
											{category.name}
										</label>
									</div>
								))}
							</div>
						</div>

						<div>
							<h4 className="font-medium text-gray-800 mb-3 flex items-center">
								<FiBarChart2 className="mr-2" /> Levels
							</h4>
							<div className="space-y-2">
								{["Beginner", "Intermediate", "Advanced"].map((level) => (
									<div key={level} className="flex items-center">
										<input
											type="checkbox"
											id={`level-${level}`}
											className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
											checked={courseFilters.level.includes(level)}
											onChange={() => handleFilterChange("level", level)}
										/>
										<label
											htmlFor={`level-${level}`}
											className="ml-2 text-sm text-gray-700"
										>
											{level}
										</label>
									</div>
								))}
							</div>

							<h4 className="font-medium text-gray-800 mt-4 mb-3 flex items-center">
								<FiStar className="mr-2" /> Rating
							</h4>
							<div className="flex items-center">
								<input
									type="range"
									min="0"
									max="5"
									step="0.5"
									value={courseFilters.rating}
									onChange={(e) =>
										handleFilterChange("rating", parseFloat(e.target.value))
									}
									className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
								/>
								<span className="ml-2 text-sm font-medium text-gray-700">
									{courseFilters.rating}+
								</span>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h4 className="font-medium text-gray-800 mb-3 flex items-center">
							<FiDollarSign className="mr-2" /> Price Range
						</h4>
						<div className="flex items-center space-x-4">
							<div className="relative">
								<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
									$
								</span>
								<input
									type="number"
									placeholder="Min"
									min="0"
									max={courseFilters.price.max}
									value={courseFilters.price.min}
									onChange={(e) =>
										handleFilterChange("price", {
											min: parseInt(e.target.value) || 0,
										})
									}
									className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
								/>
							</div>
							<span className="text-gray-500">-</span>
							<div className="relative">
								<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
									$
								</span>
								<input
									type="number"
									placeholder="Max"
									min={courseFilters.price.min}
									value={courseFilters.price.max}
									onChange={(e) =>
										handleFilterChange("price", {
											max: parseInt(e.target.value) || 200,
										})
									}
									className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
								/>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h4 className="font-medium text-gray-800 mb-3 flex justify-between items-center">
							<span>Search Results ({filteredCourses.length})</span>
							{(searchQuery ||
								courseFilters.categories.length > 0 ||
								courseFilters.level.length > 0 ||
								courseFilters.rating > 0 ||
								courseFilters.price.min > 0 ||
								courseFilters.price.max < 200) && (
								<button
									onClick={resetFilters}
									className="text-blue-600 text-sm hover:underline"
								>
									Clear All Filters
								</button>
							)}
						</h4>

						<div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-200">
							{filteredCourses.length === 0 ? (
								<div className="p-4 text-center text-gray-500">
									No courses match your search criteria
								</div>
							) : (
								filteredCourses.slice(0, 5).map((course) => (
									<div
										key={course.id}
										className="p-3 hover:bg-gray-50 cursor-pointer flex items-start"
										onClick={() => {
											handleViewCourse(course);
											setIsSearchModalOpen(false);
										}}
									>
										<img
											src={course.thumbnail}
											alt={course.title}
											className="w-16 h-12 object-cover rounded mr-3"
											onError={(e) => {
												e.target.src =
													"https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
											}}
										/>
										<div>
											<h5 className="font-medium text-gray-800">
												{course.title}
											</h5>
											<div className="flex items-center text-sm text-gray-500">
												<span>{course.instructor}</span>
												<span className="mx-2">•</span>
												<span className="flex items-center">
													<FiStar className="text-yellow-500 fill-current mr-1" />
													{course.rating}
												</span>
												<span className="mx-2">•</span>
												<span>{course.level}</span>
											</div>
										</div>
									</div>
								))
							)}

							{filteredCourses.length > 5 && (
								<div className="p-3 text-center text-blue-600 font-medium hover:bg-gray-50 cursor-pointer">
									+ {filteredCourses.length - 5} more results
								</div>
							)}
						</div>
					</div>

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
							onClick={() => setIsSearchModalOpen(false)}
						>
							Cancel
						</button>
						<button
							type="button"
							className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
							onClick={() => {
								handlePageChange("browse");
								setIsSearchModalOpen(false);
							}}
						>
							Browse All Results
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const Toast = () => (
		<div
			className={`fixed bottom-4 right-4 px-4 py-3 bg-white rounded-lg shadow-lg border-l-4 ${
				toastMessage.includes("error") ? "border-red-500" : "border-green-500"
			} transition-opacity duration-300 flex items-center ${
				showSuccessToast ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			<div
				className={`mr-3 ${
					toastMessage.includes("error") ? "text-red-500" : "text-green-500"
				}`}
			>
				{toastMessage.includes("error") ? (
					<FiAlertCircle className="text-xl" />
				) : (
					<FiCheckCircle className="text-xl" />
				)}
			</div>
			<p className="text-gray-800">{toastMessage}</p>
		</div>
	);

	const FiAlertCircle = () => (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="10"></circle>
			<line x1="12" y1="8" x2="12" y2="12"></line>
			<line x1="12" y1="16" x2="12.01" y2="16"></line>
		</svg>
	);

	return (
		<div className="flex flex-col min-h-screen bg-gray-50 font-sans">
			<Navbar />

			<div className="flex flex-1 max-w-7xl mx-auto w-full">
				<Sidebar />

				<main className="flex-1 p-6 lg:p-8">
					{visiblePage === "dashboard" && <Dashboard />}
					{visiblePage === "myCourses" && <MyCourses />}
					{visiblePage === "browse" && (
						<BrowseCourses
							filteredCourses={filteredCourses}
							categories={categories}
							courseFilters={courseFilters}
							handleFilterChange={handleFilterChange}
							resetFilters={resetFilters}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							handleViewCourse={handleViewCourse}
							handleAddToWishlist={handleAddToWishlist}
							handleAddToCart={handleAddToCart}
							wishlist={wishlist}
							cart={cart}
						/>
					)}
					{visiblePage === "courseDetail" && <CourseDetail />}
					{visiblePage === "achievements" && <Achievements />}
					{visiblePage === "learningPaths" && (
						<LearningPaths showToast={showToast} />
					)}{" "}
					{visiblePage === "certificates" && (
						<Certificates
							showToast={showToast}
							handleViewCourse={handleViewCourse}
						/>
					)}{" "}
					{visiblePage === "liveSessions" && (
						<LiveSessions showToast={showToast} />
					)}
					{visiblePage === "instructors" && (
						<Instructors showToast={showToast} />
					)}
					{visiblePage === "profile" && (
						<Profile
							userName={userName}
							setUserName={setUserName}
							userEmail={userEmail}
							setUserEmail={setUserEmail}
							userAvatar={userAvatar}
							showToast={showToast}
							userStats={userStats}
						/>
					)}
					{visiblePage === "settings" && (
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-gray-800 mb-6">
								Account Settings
							</h2>

							<div className="bg-white rounded-xl shadow-md overflow-hidden">
								<div className="p-6">
									<div className="mb-8">
										<h4 className="text-lg font-bold text-gray-800 mb-4">
											Notification Preferences
										</h4>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<div>
													<h5 className="font-medium text-gray-800">
														Email Notifications
													</h5>
													<p className="text-sm text-gray-600">
														Receive course updates and announcements
													</p>
												</div>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														className="sr-only peer"
														defaultChecked
													/>
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
												</label>
											</div>

											<div className="flex items-center justify-between">
												<div>
													<h5 className="font-medium text-gray-800">
														Course Reminders
													</h5>
													<p className="text-sm text-gray-600">
														Get reminded about courses you haven't completed
													</p>
												</div>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														className="sr-only peer"
														defaultChecked
													/>
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
												</label>
											</div>

											<div className="flex items-center justify-between">
												<div>
													<h5 className="font-medium text-gray-800">
														Promotional Emails
													</h5>
													<p className="text-sm text-gray-600">
														Receive offers, discounts, and new course
														announcements
													</p>
												</div>
												<label className="relative inline-flex items-center cursor-pointer">
													<input type="checkbox" className="sr-only peer" />
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
												</label>
											</div>

											<div className="flex items-center justify-between">
												<div>
													<h5 className="font-medium text-gray-800">
														Live Session Alerts
													</h5>
													<p className="text-sm text-gray-600">
														Get notified before live sessions begin
													</p>
												</div>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														className="sr-only peer"
														defaultChecked
													/>
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
												</label>
											</div>
										</div>
									</div>

									<div className="mb-8">
										<h4 className="text-lg font-bold text-gray-800 mb-4">
											Account Security
										</h4>

										<div className="mb-6">
											<h5 className="font-medium text-gray-800 mb-3">
												Change Password
											</h5>
											<div className="space-y-3">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Current Password
													</label>
													<input
														type="password"
														className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														New Password
													</label>
													<input
														type="password"
														className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Confirm New Password
													</label>
													<input
														type="password"
														className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													/>
												</div>
												<div>
													<button
														className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
														onClick={() =>
															showToast("Password updated successfully!")
														}
													>
														Update Password
													</button>
												</div>
											</div>
										</div>

										<div>
											<h5 className="font-medium text-gray-800 mb-3">
												Two-Factor Authentication
											</h5>
											<div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
												<div>
													<p className="text-gray-700 mb-1">
														Enhance your account security
													</p>
													<p className="text-sm text-gray-600">
														Add an extra layer of security to your account by
														enabling two-factor authentication
													</p>
												</div>
												<button
													className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
													onClick={() => showToast("2FA setup coming soon!")}
												>
													Enable
												</button>
											</div>
										</div>
									</div>

									<div className="mb-8">
										<h4 className="text-lg font-bold text-gray-800 mb-4">
											Payment Information
										</h4>

										<div className="mb-4 flex items-center">
											<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
												<FiCreditCard className="text-2xl" />
											</div>
											<div>
												<h5 className="font-medium text-gray-800">
													Visa ending in 4242
												</h5>
												<p className="text-sm text-gray-600">Expires 12/25</p>
											</div>
											<button
												className="ml-auto text-blue-600 hover:text-blue-800 transition-colors"
												onClick={() =>
													showToast("Payment method edit coming soon!")
												}
											>
												Edit
											</button>
										</div>

										<button
											className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
											onClick={() =>
												showToast("Add payment method coming soon!")
											}
										>
											<FiPlus className="mr-1" /> Add Payment Method
										</button>
									</div>

									<div>
										<h4 className="text-lg font-bold text-gray-800 mb-4">
											Danger Zone
										</h4>

										<div className="bg-red-50 border border-red-200 rounded-lg p-4">
											<h5 className="font-medium text-red-800 mb-2">
												Delete Account
											</h5>
											<p className="text-sm text-red-700 mb-3">
												Once you delete your account, all your data will be
												permanently removed. This action cannot be undone.
											</p>
											<button
												className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
												onClick={() => setIsLoginModalOpen(true)}
											>
												Delete Account
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>

			{isMobileView && (
				<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-3 z-50 border-t border-gray-200">
					<a
						href="#"
						className="flex flex-col items-center text-blue-600"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange("dashboard");
						}}
					>
						<Home className="text-xl mb-1" />
						<span className="text-xs">Home</span>
					</a>
					<a
						href="#"
						className="flex flex-col items-center text-gray-500"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange("myCourses");
						}}
					>
						<Book className="text-xl mb-1" />
						<span className="text-xs">Courses</span>
					</a>
					<a
						href="#"
						className="flex flex-col items-center text-gray-500"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange("achievements");
						}}
					>
						<Award className="text-xl mb-1" />
						<span className="text-xs">Achievements</span>
					</a>
					<a
						href="#"
						className="flex flex-col items-center text-gray-500"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange("profile");
						}}
					>
						<User className="text-xl mb-1" />
						<span className="text-xs">Profile</span>
					</a>
				</nav>
			)}

			<footer className="bg-gray-800 text-white py-12">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h4 className="text-lg font-bold mb-4">LearnHub Pro</h4>
							<p className="text-gray-400 text-sm">
								The best online learning platform for advancing your career and
								skills.
							</p>
						</div>
						<div>
							<h5 className="font-semibold mb-4">Company</h5>
							<ul className="space-y-2 text-sm text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("About Us page coming soon!");
										}}
									>
										About Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Careers page coming soon!");
										}}
									>
										Careers
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Blog page coming soon!");
										}}
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Contact page coming soon!");
										}}
									>
										Contact
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h5 className="font-semibold mb-4">Resources</h5>
							<ul className="space-y-2 text-sm text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Help Center page coming soon!");
										}}
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Tutorials page coming soon!");
										}}
									>
										Tutorials
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Community page coming soon!");
										}}
									>
										Community
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Webinars page coming soon!");
										}}
									>
										Webinars
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h5 className="font-semibold mb-4">Legal</h5>
							<ul className="space-y-2 text-sm text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Terms page coming soon!");
										}}
									>
										Terms
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Privacy page coming soon!");
										}}
									>
										Privacy
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Cookies page coming soon!");
										}}
									>
										Cookies
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
										onClick={(e) => {
											e.preventDefault();
											showToast("Licenses page coming soon!");
										}}
									>
										Licenses
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400">
						<div className="flex flex-col md:flex-row justify-between items-center">
							<p>© 2023 LearnHub Pro. All rights reserved.</p>
							<div className="flex space-x-4 mt-4 md:mt-0">
								<a href="#" className="hover:text-white transition-colors">
									<FiFacebook />
								</a>
								<a href="#" className="hover:text-white transition-colors">
									<FiTwitter />
								</a>
								<a href="#" className="hover:text-white transition-colors">
									<FiInstagram />
								</a>
								<a href="#" className="hover:text-white transition-colors">
									<FiLinkedin />
								</a>
								<a href="#" className="hover:text-white transition-colors">
									<FiYoutube />
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>

			{playingVideo && (
				<div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
					<div className="relative w-full max-w-4xl">
						<button
							onClick={() => setPlayingVideo(null)}
							className="absolute -top-10 right-0 text-white hover:text-gray-300"
							aria-label="Close video"
						>
							<FiX className="w-8 h-8" />
						</button>
						<video
							src={playingVideo}
							controls
							autoPlay
							className="w-full h-full rounded-lg"
							onEnded={() => setPlayingVideo(null)}
						/>
					</div>
				</div>
			)}

			{isLessonModalOpen && <LessonModal />}
			{isResourceModalOpen && <ResourceModal />}
			{isLoginModalOpen && <LoginModal />}
			{isLiveSessionModalOpen && <LiveSessionModal />}
			{isCouponModalOpen && <CouponModal />}
			{isFeedbackModalOpen && <FeedbackModal />}
			{isSearchModalOpen && <SearchModal />}

			<Toast />
		</div>
	);
};

const FiFacebook = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
	</svg>
);

const FiTwitter = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
	</svg>
);

const FiInstagram = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
		<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
	</svg>
);

const FiLinkedin = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
		<rect x="2" y="9" width="4" height="12"></rect>
		<circle cx="4" cy="4" r="2"></circle>
	</svg>
);

const FiYoutube = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
		<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
	</svg>
);

const FiGithub = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
	</svg>
);

const FiGlobe = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="12" cy="12" r="10"></circle>
		<line x1="2" y1="12" x2="22" y2="12"></line>
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
	</svg>
);

const FiCreditCard = () => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
		<line x1="1" y1="10" x2="23" y2="10"></line>
	</svg>
);

export default LearningPortal;


