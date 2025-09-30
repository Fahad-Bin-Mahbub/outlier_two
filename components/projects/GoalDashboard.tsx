"use client";

import { useState, useEffect } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

interface ProgressData {
	day: string;
	progress: number;
}

interface GoalComparison {
	goal: string;
	value: number;
}

interface PieData {
	name: string;
	value: number;
}

interface Goal {
	name: string;
	progress: number;
	category: string;
	dueDate: string;
}

export default function GoalDashboardExport() {
	const [filter, setFilter] = useState<"all" | "completed" | "inprogress">(
		"all"
	);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1200);
		return () => clearTimeout(timer);
	}, []);

	const progressData: ProgressData[] = [
		{ day: "Mon", progress: 20 },
		{ day: "Tue", progress: 40 },
		{ day: "Wed", progress: 55 },
		{ day: "Thu", progress: 70 },
		{ day: "Fri", progress: 85 },
		{ day: "Sat", progress: 90 },
		{ day: "Sun", progress: 100 },
	];

	const goalComparison: GoalComparison[] = [
		{ goal: "Fitness", value: 80 },
		{ goal: "Reading", value: 60 },
		{ goal: "Learning", value: 90 },
		{ goal: "Diet", value: 70 },
	];

	const pieData: PieData[] = [
		{ name: "Completed", value: 75 },
		{ name: "Remaining", value: 25 },
	];

	const goals: Goal[] = [
		{
			name: "Run 5K",
			progress: 100,
			category: "Fitness",
			dueDate: "Completed",
		},
		{
			name: "Read 10 books",
			progress: 70,
			category: "Reading",
			dueDate: "Dec 15",
		},
		{
			name: "Learn React",
			progress: 90,
			category: "Learning",
			dueDate: "Nov 30",
		},
		{ name: "Eat Healthy", progress: 40, category: "Diet", dueDate: "Ongoing" },
	];

	const COLORS = ["#10B981", "#F97316"];

	const filteredGoals = goals.filter((goal) => {
		if (filter === "completed") return goal.progress === 100;
		if (filter === "inprogress") return goal.progress < 100;
		return true;
	});

	const handleAddGoalClick = () => {
		toast.success("Add Goal feature coming soon!");
	};

	const handleButtonClick = (buttonName: string) => {
		toast(`${buttonName} clicked`, {
			icon: "👆",
			style: {
				borderRadius: "10px",
				background: "#333",
				color: "#fff",
			},
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-t-4 border-teal-500 border-solid rounded-full animate-spin mx-auto"></div>
					<p className="text-teal-400 mt-4 text-base sm:text-xl font-semibold">
						Loading your dashboard...
					</p>
				</div>
			</div>
		);
	}

	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-2 sm:p-4 md:p-8 flex flex-col gap-4 sm:gap-6 lg:gap-12 relative overflow-x-hidden"
		>
			<Toaster position="top-right" />

			<header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md p-2 sm:p-4 rounded-xl flex justify-between items-center shadow-lg">
				<motion.h1
					initial={{ x: -50 }}
					animate={{ x: 0 }}
					className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent"
				>
					GoalTracker Pro
				</motion.h1>

				<div className="hidden md:flex gap-6 items-center">
					<button
						onClick={() => handleButtonClick("Dashboard")}
						className="hover:text-teal-300 transition cursor-pointer relative group py-2 px-1"
					>
						Dashboard
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
					</button>
					<button
						onClick={() => handleButtonClick("Goals")}
						className="hover:text-teal-300 transition cursor-pointer relative group py-2 px-1"
					>
						Goals
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
					</button>
					<button
						onClick={() => handleButtonClick("Analytics")}
						className="hover:text-teal-300 transition cursor-pointer relative group py-2 px-1"
					>
						Analytics
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
					</button>
					<div className="relative group cursor-pointer">
						<img
							src="https://randomuser.me/api/portraits/men/32.jpg"
							alt="Profile"
							className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-teal-400 transition-all duration-300"
							onClick={() => handleButtonClick("Profile")}
						/>
						<div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
					</div>
				</div>

				<button
					className="md:hidden text-white focus:outline-none cursor-pointer"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						{isMenuOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</button>

				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="absolute top-full mt-2 right-0 bg-gray-800 shadow-xl rounded-xl p-3 sm:p-4 w-36 sm:w-48 z-50"
					>
						<div className="flex flex-col gap-2 sm:gap-3">
							<button
								onClick={() => {
									handleButtonClick("Dashboard");
									setIsMenuOpen(false);
								}}
								className="hover:text-teal-300 transition cursor-pointer py-1.5 sm:py-2 flex items-center gap-2 text-sm sm:text-base"
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
								Dashboard
							</button>
							<button
								onClick={() => {
									handleButtonClick("Goals");
									setIsMenuOpen(false);
								}}
								className="hover:text-teal-300 transition cursor-pointer py-1.5 sm:py-2 flex items-center gap-2 text-sm sm:text-base"
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								Goals
							</button>
							<button
								onClick={() => {
									handleButtonClick("Analytics");
									setIsMenuOpen(false);
								}}
								className="hover:text-teal-300 transition cursor-pointer py-1.5 sm:py-2 flex items-center gap-2 text-sm sm:text-base"
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
								Analytics
							</button>
							<button
								onClick={() => {
									handleButtonClick("Profile");
									setIsMenuOpen(false);
								}}
								className="hover:text-teal-300 transition cursor-pointer py-1.5 sm:py-2 flex items-center gap-2 text-sm sm:text-base"
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
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
						</div>
					</motion.div>
				)}
			</header>

			<motion.section
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-3 sm:p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 hover:shadow-2xl transition-all border border-gray-700 relative overflow-hidden"
			>
				<div className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
				<div className="z-10">
					<h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
						Welcome back, Alex!
					</h2>
					<p className="text-sm text-gray-300">
						Here's your progress snapshot this week:
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleAddGoalClick}
						className="mt-3 sm:mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-teal-500/20 transition-all text-sm"
					>
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Add New Goal
					</motion.button>
				</div>
				<div className="flex gap-2 sm:gap-6 mt-3 md:mt-0 z-10">
					<motion.div
						whileHover={{ y: -5 }}
						className="flex flex-col items-center bg-gray-700/50 px-3 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-600"
					>
						<span className="text-teal-400 text-xl sm:text-2xl md:text-3xl font-bold">
							{goals.length}
						</span>
						<span className="text-gray-300 text-xs sm:text-sm">
							Total Goals
						</span>
					</motion.div>
					<motion.div
						whileHover={{ y: -5 }}
						className="flex flex-col items-center bg-gray-700/50 px-3 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-600"
					>
						<span className="text-teal-400 text-xl sm:text-2xl md:text-3xl font-bold">
							{goals.filter((g) => g.progress < 100).length}
						</span>
						<span className="text-gray-300 text-xs sm:text-sm">
							Active Goals
						</span>
					</motion.div>
					<motion.div
						whileHover={{ y: -5 }}
						className="flex flex-col items-center bg-gray-700/50 px-3 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-600"
					>
						<span className="text-teal-400 text-xl sm:text-2xl md:text-3xl font-bold">
							{goals.filter((g) => g.progress === 100).length}
						</span>
						<span className="text-gray-300 text-xs sm:text-sm">Completed</span>
					</motion.div>
				</div>
			</motion.section>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="flex justify-center gap-2 sm:gap-3 md:gap-6 flex-wrap"
			>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setFilter("all")}
					className={`px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm ${
						filter === "all"
							? "bg-gradient-to-r from-teal-500 to-emerald-600"
							: "bg-gray-700 hover:bg-gray-600"
					} transition cursor-pointer shadow-md hover:shadow-lg`}
				>
					All Goals
				</motion.button>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setFilter("completed")}
					className={`px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm ${
						filter === "completed"
							? "bg-gradient-to-r from-teal-500 to-emerald-600"
							: "bg-gray-700 hover:bg-gray-600"
					} transition cursor-pointer shadow-md hover:shadow-lg`}
				>
					Completed
				</motion.button>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setFilter("inprogress")}
					className={`px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm ${
						filter === "inprogress"
							? "bg-gradient-to-r from-teal-500 to-emerald-600"
							: "bg-gray-700 hover:bg-gray-600"
					} transition cursor-pointer shadow-md hover:shadow-lg`}
				>
					In Progress
				</motion.button>
			</motion.div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
				{filteredGoals.map((goal, idx) => (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4 + idx * 0.1 }}
						key={idx}
						className="bg-gradient-to-b from-gray-800 to-gray-700 p-3 sm:p-6 rounded-2xl flex flex-col items-center gap-2 sm:gap-4 hover:scale-105 transition-all shadow-lg hover:shadow-xl border border-gray-700 group cursor-pointer"
						onClick={() => handleButtonClick(goal.name)}
					>
						<div className="bg-gray-700/50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs text-teal-300 border border-teal-500/30">
							{goal.category}
						</div>
						<h3 className="font-bold text-base sm:text-lg text-center group-hover:text-teal-300 transition-colors">
							{goal.name}
						</h3>
						<div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 group-hover:scale-110 transition-transform">
							<svg
								className="absolute inset-0 transform rotate-[-90deg]"
								viewBox="0 0 36 36"
							>
								<path
									className="text-gray-600"
									stroke="currentColor"
									strokeWidth="3"
									fill="none"
									d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
								/>
								<path
									className={`${
										goal.progress >= 80
											? "text-emerald-400"
											: goal.progress >= 50
											? "text-teal-400"
											: "text-amber-400"
									}`}
									stroke="currentColor"
									strokeWidth="3"
									fill="none"
									strokeDasharray={`${goal.progress}, 100`}
									d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
								/>
							</svg>
							<div className="absolute inset-0 flex items-center justify-center text-sm sm:text-base md:text-xl font-bold">
								{goal.progress}%
							</div>
						</div>
						<p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
							Due: {goal.dueDate}
						</p>
					</motion.div>
				))}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-700 relative group"
				>
					<div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors"></div>
					<button
						onClick={() => handleButtonClick("Export Progress")}
						className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-teal-400 transition-colors cursor-pointer z-10"
					>
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</button>
					<h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-6 text-gradient-to-r from-teal-300 to-emerald-400 relative z-10 flex items-center gap-2">
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
							/>
						</svg>
						Progress Over Time
					</h2>
					<ResponsiveContainer
						width="100%"
						height={180}
						className="sm:h-64 md:h-64"
					>
						<LineChart data={progressData}>
							<XAxis
								dataKey="day"
								stroke="#9CA3AF"
								fontSize={10}
								tickMargin={5}
							/>
							<YAxis stroke="#9CA3AF" fontSize={10} tickMargin={5} />
							<Tooltip
								contentStyle={{
									backgroundColor: "#1F2937",
									border: "1px solid #374151",
									borderRadius: "0.5rem",
									color: "#F9FAFB",
									fontSize: "12px",
								}}
							/>
							<Line
								type="monotone"
								dataKey="progress"
								stroke="#10B981"
								strokeWidth={2}
								dot={{
									fill: "#10B981",
									strokeWidth: 2,
									r: 4,
									strokeDasharray: "",
								}}
								activeDot={{
									fill: "#F9FAFB",
									stroke: "#10B981",
									strokeWidth: 2,
									r: 6,
								}}
							/>
						</LineChart>
					</ResponsiveContainer>
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.7 }}
					className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-700 relative group"
				>
					<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors"></div>
					<button
						onClick={() => handleButtonClick("Export Comparison")}
						className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-teal-400 transition-colors cursor-pointer z-10"
					>
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</button>
					<h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-6 text-gradient-to-r from-teal-300 to-emerald-400 relative z-10 flex items-center gap-2">
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
						Goals Comparison
					</h2>
					<ResponsiveContainer
						width="100%"
						height={180}
						className="sm:h-64 md:h-64"
					>
						<BarChart data={goalComparison}>
							<XAxis
								dataKey="goal"
								stroke="#9CA3AF"
								fontSize={10}
								tickMargin={5}
							/>
							<YAxis stroke="#9CA3AF" fontSize={10} tickMargin={5} />
							<Tooltip
								contentStyle={{
									backgroundColor: "#1F2937",
									border: "1px solid #374151",
									borderRadius: "0.5rem",
									color: "#F9FAFB",
									fontSize: "12px",
								}}
								formatter={(value) => [`${value}%`, "Value"]}
								labelStyle={{ color: "#F9FAFB" }}
								itemStyle={{ color: "#F9FAFB" }}
							/>
							<Bar dataKey="value" radius={[4, 4, 0, 0]}>
								{goalComparison.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={index % 2 === 0 ? "#10B981" : "#0D9488"}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.8 }}
					className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-700 flex flex-col items-center relative group"
				>
					<div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors"></div>
					<button
						onClick={() => handleButtonClick("Export Completion")}
						className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-teal-400 transition-colors cursor-pointer z-10"
					>
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</button>
					<h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-6 text-gradient-to-r from-teal-300 to-emerald-400 relative z-10 flex items-center gap-2">
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
							/>
						</svg>
						Overall Completion
					</h2>
					<ResponsiveContainer
						width="100%"
						height={180}
						className="sm:h-64 md:h-64"
					>
						<PieChart>
							<Pie
								data={pieData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={60}
								innerRadius={40}
								fill="#8884d8"
								paddingAngle={2}
								label={({ name, percent }) =>
									`${name} ${(percent * 100).toFixed(0)}%`
								}
								labelLine={false}
							>
								{pieData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
										stroke="transparent"
									/>
								))}
							</Pie>
							<Legend
								verticalAlign="bottom"
								height={24}
								iconType="circle"
								iconSize={8}
								formatter={(value) => (
									<span className="text-gray-300 text-xs sm:text-sm">
										{value}
									</span>
								)}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#1F2937",
									border: "1px solid #374151",
									borderRadius: "0.5rem",
									color: "#F9FAFB",
									fontSize: "12px",
								}}
								labelStyle={{ color: "#F9FAFB" }}
								itemStyle={{ color: "#F9FAFB" }}
							/>
						</PieChart>
					</ResponsiveContainer>
				</motion.div>
			</div>

			<footer className="mt-auto pt-4 text-center text-gray-400 text-xs">
				<p>© 2025 GoalTracker Pro. All rights reserved.</p>
				<div className="flex justify-center gap-3 mt-1">
					<button
						onClick={() => handleButtonClick("Terms")}
						className="hover:text-teal-300 transition cursor-pointer text-xs"
					>
						Terms
					</button>
					<button
						onClick={() => handleButtonClick("Privacy")}
						className="hover:text-teal-300 transition cursor-pointer text-xs"
					>
						Privacy
					</button>
					<button
						onClick={() => handleButtonClick("Contact")}
						className="hover:text-teal-300 transition cursor-pointer text-xs"
					>
						Contact
					</button>
				</div>
			</footer>
		</motion.main>
	);
}
