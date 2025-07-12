"use client";
import React, { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	TooltipProps,
	AreaChart,
	Area,
} from "recharts";
import {
	Activity,
	Moon,
	Flame,
	ChevronDown,
	Calendar,
	User,
	Settings,
	ChevronLeft,
	ChevronRight,
	CheckCircle,
	Circle,
	Sun,
	Info,
	Download,
	Award,
	TrendingUp,
	HelpCircle,
	Bell,
	Droplets,
	Heart,
} from "lucide-react";
import {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

interface HealthData {
	date: string;
	formattedDate: string;
	shortDate: string;
	steps: number;
	calories: number;
	sleep: number;
	heartRate: number;
	water: number;
}

interface SleepQualityData {
	name: string;
	value: number;
}

type TimeRangeType = "day" | "week" | "month";

const generateMockData = (days = 7): HealthData[] => {
	const data: HealthData[] = [];
	const today = new Date();

	for (let i = 0; i < days; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);

		data.unshift({
			date: date.toISOString().split("T")[0],
			formattedDate: date.toLocaleDateString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
			}),
			shortDate: date.toLocaleDateString("en-US", { weekday: "short" }),
			steps: Math.floor(Math.random() * 5000) + 5000,
			calories: Math.floor(Math.random() * 400) + 1800,
			sleep: Math.round((Math.random() * 3 + 5) * 10) / 10,
			heartRate: Math.floor(Math.random() * 15) + 65,
			water: Math.floor(Math.random() * 4) + 4,
		});
	}

	return data;
};

const calculateAverage = <T extends Record<K, number>, K extends keyof T>(
	data: T[],
	key: K
): number => {
	if (!data || data.length === 0) return 0;
	const sum = data.reduce((acc, item) => acc + item[key], 0);
	return Math.round((sum / data.length) * 10) / 10;
};

const formatNumber = (num: number): string => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface ProgressCircleProps {
	value: number;
	max: number;
	color: string;
	icon: React.FC<{ size?: number | string; color?: string }>;
	title: string;
	unit: string;
	darkMode: boolean;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
	value,
	max,
	color,
	icon,
	title,
	unit,
	darkMode,
}) => {
	const percentage = Math.min(100, Math.round((value / max) * 100));
	const radius = 40;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	const getColorForMode = (lightModeColor: string) => {
		if (!darkMode) return lightModeColor;

		switch (lightModeColor) {
			case "#6366f1":
				return "#a5b4fc";
			case "#ef4444":
				return "#fca5a5";
			case "#8b5cf6":
				return "#c4b5fd";
			default:
				return lightModeColor;
		}
	};

	const displayColor = getColorForMode(color);
	const Icon = icon;

	return (
		<div
			className={`flex flex-col items-center p-4 ${
				darkMode ? "bg-gray-800" : "bg-white"
			} rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 overflow-hidden relative`}
		>
			<div
				className="absolute inset-0 opacity-10 bg-gradient-to-br"
				style={{
					background: darkMode
						? `linear-gradient(135deg, ${displayColor}30 0%, transparent 80%)`
						: `linear-gradient(135deg, ${displayColor}30 0%, transparent 80%)`,
				}}
			></div>
			<div className="relative w-24 h-24 mb-2">
				<svg className="w-full h-full" viewBox="0 0 100 100">
					<circle
						cx="50"
						cy="50"
						r={radius}
						fill="none"
						stroke={darkMode ? "#374151" : "#f1f5f9"}
						strokeWidth="8"
					/>
					<circle
						cx="50"
						cy="50"
						r={radius}
						fill="none"
						stroke={displayColor}
						strokeWidth="8"
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
						style={{
							transform: "rotate(-90deg)",
							transformOrigin: "center",
							transition: "stroke-dashoffset 1s ease-in-out",
						}}
					/>
					<foreignObject x="25" y="25" width="50" height="50">
						<div className="flex items-center justify-center w-full h-full">
							<Icon size={24} color={displayColor} />
						</div>
					</foreignObject>
				</svg>
			</div>
			<div className="flex items-center gap-1">
				<h3
					className={`text-xl font-bold ${
						darkMode ? "text-gray-100" : "text-gray-800"
					} transition-colors duration-300`}
				>
					{formatNumber(value)}
				</h3>
				<span
					className={`text-sm font-normal ${
						darkMode ? "text-gray-300" : "text-gray-500"
					} transition-colors duration-300`}
				>
					{unit}
				</span>
			</div>
			<p
				className={`text-sm ${
					darkMode ? "text-gray-300" : "text-gray-500"
				} transition-colors duration-300`}
			>
				{title}
			</p>
			<div
				className={`h-1 w-16 mt-2 rounded-full`}
				style={{
					backgroundColor: displayColor,
					opacity: 0.7,
				}}
			></div>
		</div>
	);
};

interface StatCardProps {
	title: string;
	value: number | string;
	change: number;
	unit: string;
	color: string;
	darkMode: boolean;
	icon: React.FC<{ size?: number | string; color?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	change,
	unit,
	darkMode,
	icon: Icon,
	color,
}) => {
	const isPositive = change >= 0;

	return (
		<div
			className={`p-4 ${
				darkMode ? "bg-gray-800" : "bg-white"
			} rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 relative overflow-hidden`}
		>
			<div
				className="absolute inset-0 opacity-5 bg-gradient-to-br"
				style={{
					background: darkMode
						? `linear-gradient(135deg, ${color}30 0%, transparent 80%)`
						: `linear-gradient(135deg, ${color}30 0%, transparent 80%)`,
				}}
			></div>
			<div className="flex items-center gap-3 mb-2">
				<div
					className={`p-2 rounded-lg ${
						darkMode ? "bg-gray-700" : "bg-gray-100"
					} transition-colors duration-300`}
					style={{ color: darkMode ? "#a5b4fc" : color }}
				>
					<Icon size={16} />
				</div>
				<p
					className={`text-sm ${
						darkMode ? "text-gray-300" : "text-gray-600"
					} transition-colors duration-300 font-medium`}
				>
					{title}
				</p>
			</div>
			<div className="flex items-baseline">
				<h3
					className={`text-2xl font-bold ${
						darkMode ? "text-gray-100" : "text-gray-800"
					} transition-colors duration-300`}
				>
					{value}
					<span
						className={`text-sm font-normal ${
							darkMode ? "text-gray-300" : "text-gray-500"
						} ml-1 transition-colors duration-300`}
					>
						{unit}
					</span>
				</h3>
				<span
					className={`ml-2 text-xs font-medium flex items-center gap-1 ${
						isPositive ? "text-emerald-500" : "text-rose-500"
					}`}
				>
					{isPositive ? (
						<TrendingUp size={14} />
					) : (
						<TrendingUp size={14} className="transform rotate-180" />
					)}
					{isPositive ? "+" : ""}
					{change}%
				</span>
			</div>
		</div>
	);
};

const HealthDashboard: React.FC = () => {
	const [timeRange, setTimeRange] = useState<TimeRangeType>("week");
	const [data, setData] = useState<HealthData[]>([]);
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
	const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
	const [acknowledgedRecommendations, setAcknowledgedRecommendations] =
		useState<Record<string, boolean>>({});
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const savedDarkMode = localStorage.getItem("darkMode") === "true";
		setDarkMode(savedDarkMode);

		if (savedDarkMode) {
			document.documentElement.classList.add("dark-mode");
		}

		setTimeout(() => {
			setIsLoading(false);
		}, 800);
	}, []);

	const toggleDarkMode = (): void => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem("darkMode", newDarkMode.toString());

		if (newDarkMode) {
			document.documentElement.classList.add("dark-mode");
		} else {
			document.documentElement.classList.remove("dark-mode");
		}
	};

	const toggleSettingsMenu = (): void => {
		setShowSettingsMenu(!showSettingsMenu);
		setShowProfileMenu(false);
	};

	const toggleProfileMenu = (): void => {
		setShowProfileMenu(!showProfileMenu);
		setShowSettingsMenu(false);
	};

	const acknowledgeRecommendation = (id: string): void => {
		setAcknowledgedRecommendations((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				!target.closest(".settings-menu") &&
				!target.closest(".settings-trigger")
			) {
				setShowSettingsMenu(false);
			}
			if (
				!target.closest(".profile-menu") &&
				!target.closest(".profile-trigger")
			) {
				setShowProfileMenu(false);
			}
			if (
				!target.closest(".date-dropdown") &&
				!target.closest(".date-trigger")
			) {
				setShowDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		setIsLoading(true);

		const timer = setTimeout(() => {
			let newData: HealthData[] = [];

			if (timeRange === "day") {
				newData = generateMockData(1);
			} else if (timeRange === "week") {
				newData = generateMockData(7);
			} else if (timeRange === "month") {
				newData = generateMockData(30);

				newData = newData.map((item) => {
					const date = new Date(item.date);
					return {
						...item,
						shortDate: date.toLocaleDateString("en-US", {
							day: "numeric",
							month: "short",
						}),
					};
				});
			}

			setData(newData);
			setIsLoading(false);
		}, 600);

		return () => clearTimeout(timer);
	}, [timeRange, selectedDate]);

	const handleTimeRangeChange = (range: TimeRangeType): void => {
		setTimeRange(range);
		setShowDropdown(false);
	};

	const navigate = (direction: number): void => {
		const newDate = new Date(selectedDate);
		if (timeRange === "day") {
			newDate.setDate(newDate.getDate() + direction);
		} else if (timeRange === "week") {
			newDate.setDate(newDate.getDate() + direction * 7);
		} else if (timeRange === "month") {
			newDate.setMonth(newDate.getMonth() + direction);
		}
		setSelectedDate(newDate);
	};

	const stepCountFromGoal = (): number => {
		const lastDaySteps = data.length > 0 ? data[data.length - 1].steps : 0;
		return Math.max(0, 10000 - lastDaySteps);
	};

	const getFormattedDateRange = (): string => {
		const options: Intl.DateTimeFormatOptions = {
			month: "short",
			day: "numeric",
		};

		if (timeRange === "day") {
			return selectedDate.toLocaleDateString("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
			});
		} else if (timeRange === "week") {
			const endDate = new Date(selectedDate);
			const startDate = new Date(endDate);
			startDate.setDate(endDate.getDate() - 6);
			return `${startDate.toLocaleDateString(
				"en-US",
				options
			)} - ${endDate.toLocaleDateString("en-US", options)}`;
		} else {
			return selectedDate.toLocaleDateString("en-US", {
				month: "long",
				year: "numeric",
			});
		}
	};

	const todayData = data[data.length - 1] || {
		steps: 0,
		calories: 0,
		sleep: 0,
		heartRate: 0,
		water: 0,
	};

	const avgSteps = calculateAverage(data, "steps");
	const avgCalories = calculateAverage(data, "calories");
	const avgSleep = calculateAverage(data, "sleep");

	const sleepQualityData: SleepQualityData[] = [
		{ name: "Deep", value: 32 },
		{ name: "Light", value: 45 },
		{ name: "REM", value: 23 },
	];

	const COLORS = ["#6366f1", "#a5b4fc", "#c4b5fd"];
	const DARK_MODE_COLORS = ["#93c5fd", "#c084fc", "#f9a8d4"];

	const getChartTitle = (): string => {
		if (timeRange === "day") return "Daily Overview";
		if (timeRange === "week") return "Weekly Overview";
		return "Monthly Overview";
	};

	const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
		active,
		payload,
		label,
	}) => {
		if (active && payload && payload.length) {
			return (
				<div
					className={`${
						darkMode ? "bg-gray-800 border-sky-500" : "bg-white border-gray-200"
					} p-3 border rounded-lg shadow-lg transition-all duration-300`}
				>
					<p
						className={`text-sm font-medium ${
							darkMode ? "text-sky-300" : "text-gray-800"
						} transition-colors duration-300 mb-1`}
					>
						{payload[0].payload.formattedDate}
					</p>
					{payload.map((entry, index) => {
						// Determine the color based on entry name and dark mode
						let displayColor = entry.color as string;
						if (darkMode) {
							if (entry.name === "Steps") displayColor = "#38bdf8"; // sky-400
							else if (entry.name === "Calories")
								displayColor = "#fb7185"; // rose-400
							else if (entry.name === "Sleep") displayColor = "#c4b5fd"; // violet-300
						}

						return (
							<p
								key={`tooltip-${index}`}
								className="text-sm flex items-center gap-2"
								style={{ color: displayColor }}
							>
								<span
									className="w-2 h-2 rounded-full inline-block"
									style={{ backgroundColor: displayColor }}
								></span>
								{`${entry.name}: ${entry.value}`}
							</p>
						);
					})}
				</div>
			);
		}
		return null;
	};

	const LoadingPlaceholder = () => (
		<div className="flex items-center justify-center h-full w-full">
			<div
				className={`animate-pulse ${
					darkMode ? "text-sky-300" : "text-indigo-600"
				}`}
			>
				<svg
					className="w-10 h-10"
					viewBox="0 0 38 38"
					xmlns="http://www.w3.org/2000/svg"
					stroke="currentColor"
				>
					<g fill="none" fillRule="evenodd">
						<g transform="translate(1 1)" strokeWidth="2">
							<circle strokeOpacity=".5" cx="18" cy="18" r="18" />
							<path d="M36 18c0-9.94-8.06-18-18-18">
								<animateTransform
									attributeName="transform"
									type="rotate"
									from="0 18 18"
									to="360 18 18"
									dur="1s"
									repeatCount="indefinite"
								/>
							</path>
						</g>
					</g>
				</svg>
			</div>
		</div>
	);

	return (
		<div
			className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-indigo-50"} ${
				plusJakarta.className
			} ${
				darkMode ? "text-gray-100" : "text-gray-900"
			} transition-colors duration-300 pb-8`}
		>
			<header
				className={`sticky top-0 z-50 ${
					darkMode
						? "bg-gray-800 backdrop-blur-lg"
						: "bg-white backdrop-blur-lg"
				} shadow-md transition-all duration-300`}
			>
				<div className="w-full max-w-full mx-auto px-4 sm:px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div
								className={`p-1 rounded-lg ${
									darkMode ? "bg-indigo-600" : "bg-indigo-600"
								}`}
							>
								<Activity
									className="text-white transition-colors duration-300"
									size={24}
								/>
							</div>
							<h1
								className={`text-2xl font-bold ${
									darkMode ? "text-gray-100" : "text-gray-800"
								} tracking-tight transition-colors duration-300`}
							>
								PulseTrack
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<button
								onClick={toggleDarkMode}
								className={`p-2 rounded-full ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600"
										: "bg-indigo-100 hover:bg-indigo-200"
								} transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
									darkMode ? "focus:ring-sky-300" : "focus:ring-indigo-600"
								} focus:ring-offset-gray-800 transform hover:scale-105`}
								aria-label={
									darkMode ? "Switch to light mode" : "Switch to dark mode"
								}
							>
								{darkMode ? (
									<Sun size={20} className="text-yellow-300" />
								) : (
									<Moon size={20} className="text-indigo-600" />
								)}
							</button>

							<div className="relative">
								<button
									onClick={toggleSettingsMenu}
									className={`p-2 rounded-full ${
										darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
									} transition-all duration-300 settings-trigger cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
										darkMode ? "focus:ring-sky-300" : "focus:ring-indigo-600"
									} ${
										darkMode
											? "focus:ring-offset-gray-800"
											: "focus:ring-offset-white"
									} transform hover:scale-105`}
									aria-label="Settings"
								>
									<Settings
										size={20}
										className={darkMode ? "text-gray-300" : "text-gray-600"}
									/>
								</button>

								{showSettingsMenu && (
									<div
										className={`absolute right-0 mt-2 w-56 ${
											darkMode ? "bg-gray-800" : "bg-white"
										} rounded-lg shadow-xl z-10 settings-menu transition-all duration-300 border ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
									>
										<div className="py-1">
											<button
												className={`block w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-indigo-50"
												} transition-colors duration-300 cursor-pointer`}
											>
												<div className="flex items-center gap-3">
													<Bell size={16} />
													<span>Notifications</span>
												</div>
											</button>
											<button
												className={`block w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-indigo-50"
												} transition-colors duration-300 cursor-pointer`}
											>
												<div className="flex items-center gap-3">
													<Award size={16} />
													<span>Goals & Achievements</span>
												</div>
											</button>
											<button
												className={`block w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-indigo-50"
												} transition-colors duration-300 cursor-pointer`}
											>
												<div className="flex items-center gap-3">
													<Download size={16} />
													<span>Export Data</span>
												</div>
											</button>
											<button
												className={`block w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-indigo-50"
												} transition-colors duration-300 cursor-pointer`}
											>
												<div className="flex items-center gap-3">
													<HelpCircle size={16} />
													<span>Help & Support</span>
												</div>
											</button>
										</div>
									</div>
								)}
							</div>

							<div className="relative">
								<button
									onClick={toggleProfileMenu}
									className="h-9 w-9 rounded-full shadow-md bg-indigo-600 text-white flex items-center justify-center profile-trigger cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
									aria-label="User profile"
								>
									<User size={16} />
								</button>

								{showProfileMenu && (
									<div
										className={`absolute right-0 mt-2 w-56 ${
											darkMode ? "bg-gray-800" : "bg-white"
										} rounded-lg shadow-xl z-10 profile-menu transition-all duration-300 border ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
									>
										<div
											className={`p-3 ${
												darkMode ? "border-gray-700" : "border-gray-200"
											} border-b transition-colors duration-300`}
										>
											<p
												className={`font-medium ${
													darkMode ? "text-gray-100" : "text-gray-800"
												} transition-colors duration-300`}
											>
												Alex Johnson
											</p>
											<p
												className={`text-sm ${
													darkMode ? "text-gray-300" : "text-gray-500"
												} transition-colors duration-300`}
											>
												alex@example.com
											</p>
										</div>
										<div className="py-1">
											<button
												className={`block w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-indigo-50"
												} transition-colors duration-300 cursor-pointer`}
											>
												<div className="flex items-center gap-3">
													<User size={16} />
													<span>My Profile</span>
												</div>
											</button>
											<button
												className={`block w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-indigo-50"
												} transition-colors duration-300 cursor-pointer`}
											>
												<div className="flex items-center gap-3">
													<Award size={16} />
													<span>Goals & Achievements</span>
												</div>
											</button>
											<button
												className={`block w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-indigo-50"
												} transition-colors duration-300 cursor-pointer`}
											>
												<div className="flex items-center gap-3">
													<Settings size={16} />
													<span>Account Settings</span>
												</div>
											</button>
											<button
												className={`block w-full text-left px-4 py-2 text-sm ${
													darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-indigo-50"
												} transition-colors duration-300 cursor-pointer`}
											>
												<div className="flex items-center gap-3">
													<Download size={16} />
													<span>Export Data</span>
												</div>
											</button>
											<div
												className={`${
													darkMode ? "border-gray-700" : "border-gray-200"
												} border-t my-1 transition-colors duration-300`}
											></div>
											<button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
												Logout
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
				<div
					className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
						darkMode ? "bg-gray-800" : "bg-white"
					} p-4 rounded-2xl shadow-md transition-all duration-300 border ${
						darkMode ? "border-gray-700" : "border-indigo-100"
					}`}
				>
					<div className="flex items-center gap-3">
						<button
							onClick={() => navigate(-1)}
							className={`p-2 rounded-full ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
							} transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 ${
								darkMode ? "focus:ring-sky-300" : "focus:ring-indigo-600"
							} focus:ring-offset-2 ${
								darkMode
									? "focus:ring-offset-gray-800"
									: "focus:ring-offset-white"
							} transform hover:scale-105`}
							aria-label="Previous period"
						>
							<ChevronLeft
								size={20}
								className={darkMode ? "text-gray-300" : "text-gray-600"}
							/>
						</button>
						<h2
							className={`text-lg font-semibold ${
								darkMode ? "text-gray-100" : "text-gray-800"
							} transition-colors duration-300`}
						>
							{getFormattedDateRange()}
						</h2>
						<button
							onClick={() => navigate(1)}
							className={`p-2 rounded-full ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
							} transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 ${
								darkMode ? "focus:ring-sky-300" : "focus:ring-indigo-600"
							} focus:ring-offset-2 ${
								darkMode
									? "focus:ring-offset-gray-800"
									: "focus:ring-offset-white"
							} transform hover:scale-105`}
							aria-label="Next period"
						>
							<ChevronRight
								size={20}
								className={darkMode ? "text-gray-300" : "text-gray-600"}
							/>
						</button>
					</div>

					<div className="relative">
						<button
							onClick={() => setShowDropdown(!showDropdown)}
							className={`flex items-center gap-2 px-4 py-2 ${
								darkMode
									? "bg-gray-700 text-gray-100"
									: "bg-indigo-100 text-indigo-800"
							} rounded-lg ${
								darkMode ? "hover:bg-gray-600" : "hover:bg-indigo-200"
							} transition-all duration-300 date-trigger cursor-pointer focus:outline-none focus:ring-2 ${
								darkMode ? "focus:ring-sky-300" : "focus:ring-indigo-600"
							} focus:ring-offset-2 ${
								darkMode
									? "focus:ring-offset-gray-800"
									: "focus:ring-offset-white"
							} shadow-sm`}
							aria-expanded={showDropdown}
							aria-haspopup="true"
						>
							<Calendar size={16} />
							<span className={`capitalize ${darkMode ? "text-sky-300" : ""}`}>
								{timeRange}
							</span>
							<ChevronDown size={16} />
						</button>

						{showDropdown && (
							<div
								className={`absolute right-0 mt-2 w-36 ${
									darkMode ? "bg-gray-800" : "bg-white"
								} rounded-lg shadow-xl z-10 date-dropdown transition-all duration-300 border ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<ul
									className="py-1"
									role="menu"
									aria-orientation="vertical"
									aria-labelledby="time-range-button"
								>
									{(["day", "week", "month"] as const).map((range) => (
										<li key={range}>
											<button
												onClick={() => handleTimeRangeChange(range)}
												className={`block w-full text-left px-4 py-2 text-sm ${
													timeRange === range
														? darkMode
															? "bg-gray-700 text-sky-300"
															: "bg-indigo-100 text-indigo-800"
														: darkMode
														? "text-gray-300 hover:bg-gray-700"
														: "text-gray-700 hover:bg-gray-100"
												} transition-colors duration-300 cursor-pointer`}
												role="menuitem"
											>
												{range.charAt(0).toUpperCase() + range.slice(1)}
											</button>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
					{isLoading ? (
						<>
							{[1, 2, 3].map((index) => (
								<div
									key={index}
									className={`h-60 ${
										darkMode ? "bg-gray-800" : "bg-white"
									} rounded-2xl shadow-md animate-pulse`}
								/>
							))}
						</>
					) : (
						<>
							<ProgressCircle
								value={todayData.steps}
								max={10000}
								color="#6366f1"
								icon={Activity}
								title="Daily Steps"
								unit="steps"
								darkMode={darkMode}
							/>
							<ProgressCircle
								value={todayData.calories}
								max={2500}
								color="#ef4444"
								icon={Flame}
								title="Calories Burned"
								unit="cal"
								darkMode={darkMode}
							/>
							<ProgressCircle
								value={todayData.sleep}
								max={9}
								color="#8b5cf6"
								icon={Moon}
								title="Hours Slept"
								unit="hrs"
								darkMode={darkMode}
							/>
						</>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div
						className={`${
							darkMode ? "bg-gray-800" : "bg-white"
						} p-6 rounded-2xl shadow-md lg:col-span-2 transition-all duration-300 border ${
							darkMode
								? "border-gray-700 hover:border-sky-300"
								: "border-indigo-100 hover:border-indigo-300"
						} hover:shadow-lg`}
					>
						<div className="flex justify-between items-center mb-6">
							<h3
								className={`text-lg font-semibold ${
									darkMode ? "text-gray-100" : "text-gray-800"
								} transition-colors duration-300 flex items-center gap-2`}
							>
								<Activity
									size={18}
									className={darkMode ? "text-sky-300" : "text-indigo-600"}
								/>
								{getChartTitle()}
							</h3>
							<div className="flex gap-2">
								<span
									className="inline-block w-3 h-3 rounded-full"
									style={{ backgroundColor: darkMode ? "#93c5fd" : "#6366f1" }}
								></span>
								<span
									className={`text-sm ${
										darkMode ? "text-gray-300" : "text-gray-500"
									} transition-colors duration-300`}
								>
									Steps (thousands)
								</span>
							</div>
						</div>
						<div className="h-72">
							{isLoading ? (
								<LoadingPlaceholder />
							) : (
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={data}>
										<CartesianGrid
											strokeDasharray="3 3"
											vertical={false}
											stroke={darkMode ? "#374151" : "#f1f5f9"}
										/>
										<XAxis
											dataKey="shortDate"
											axisLine={false}
											tickLine={false}
											tick={{
												fill: darkMode ? "#9ca3af" : "#64748b",
												fontSize: 12,
											}}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											tick={{
												fill: darkMode ? "#9ca3af" : "#64748b",
												fontSize: 12,
											}}
											tickFormatter={(value) => `${value / 1000}k`}
										/>
										<Tooltip content={<CustomTooltip />} />
										<Bar
											dataKey="steps"
											name="Steps"
											fill={darkMode ? "#38bdf8" : "#6366f1"}
											radius={[8, 8, 0, 0]}
											barSize={timeRange === "month" ? 12 : 30}
										/>
									</BarChart>
								</ResponsiveContainer>
							)}
						</div>
					</div>

					<div
						className={`${
							darkMode ? "bg-gray-800" : "bg-white"
						} p-6 rounded-2xl shadow-md transition-all duration-300 border ${
							darkMode ? "border-gray-700" : "border-indigo-100"
						} hover:shadow-lg`}
					>
						<h3
							className={`text-lg font-semibold ${
								darkMode ? "text-gray-100" : "text-gray-800"
							} mb-6 transition-colors duration-300 flex items-center gap-2`}
						>
							<Moon
								size={18}
								className={darkMode ? "text-purple-300" : "text-purple-600"}
							/>
							Sleep Quality
						</h3>
						<div className="h-48 flex justify-center">
							{isLoading ? (
								<LoadingPlaceholder />
							) : (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={sleepQualityData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{sleepQualityData.map((entry, index) => {
												const fillColor = darkMode
													? DARK_MODE_COLORS[index % DARK_MODE_COLORS.length]
													: COLORS[index % COLORS.length];
												return (
													<Cell
														key={`cell-${index}`}
														fill={fillColor}
														strokeWidth={2}
														stroke={darkMode ? "#1f2937" : "#ffffff"}
													/>
												);
											})}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							)}
						</div>
						<div className="flex justify-center gap-6 mt-4">
							{sleepQualityData.map((entry, index) => {
								const bgColor = darkMode
									? DARK_MODE_COLORS[index % DARK_MODE_COLORS.length]
									: COLORS[index % COLORS.length];
								return (
									<div
										key={`legend-${index}`}
										className="flex items-center gap-2"
									>
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: bgColor }}
										></div>
										<span
											className={`text-sm ${
												darkMode ? "text-gray-100" : "text-gray-500"
											} transition-colors duration-300`}
										>
											{entry.name}: {entry.value}%
										</span>
									</div>
								);
							})}
						</div>
						<div className="mt-3 flex justify-center">
							<button
								className={`flex items-center justify-center text-sm mt-4 gap-1 px-4 py-2 rounded-lg ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600 text-sky-300"
										: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
								} transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 ${
									darkMode ? "focus:ring-sky-300" : "focus:ring-indigo-600"
								} shadow-sm`}
							>
								<Info size={16} />
								<span>Sleep Analysis</span>
							</button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{isLoading ? (
						<>
							{[1, 2, 3, 4].map((index) => (
								<div
									key={index}
									className={`h-24 ${
										darkMode ? "bg-gray-800" : "bg-white"
									} rounded-2xl shadow-md animate-pulse`}
								/>
							))}
						</>
					) : (
						<>
							<StatCard
								title="Avg. Daily Steps"
								value={formatNumber(avgSteps)}
								change={5}
								unit="steps"
								icon={Activity}
								color="#6366f1"
								darkMode={darkMode}
							/>
							<StatCard
								title="Avg. Calories Burned"
								value={formatNumber(Math.round(avgCalories))}
								change={-2}
								unit="cal"
								icon={Flame}
								color="#ef4444"
								darkMode={darkMode}
							/>
							<StatCard
								title="Avg. Sleep Duration"
								value={avgSleep}
								change={12}
								unit="hrs"
								icon={Moon}
								color="#8b5cf6"
								darkMode={darkMode}
							/>
							<StatCard
								title="Resting Heart Rate"
								value={todayData.heartRate}
								change={-3}
								unit="bpm"
								icon={Heart}
								color="#ef4444"
								darkMode={darkMode}
							/>
						</>
					)}
				</div>

				<div
					className={`${
						darkMode ? "bg-gray-800" : "bg-white"
					} p-6 rounded-2xl shadow-md max-w-8xl mx-auto transition-colors duration-300`}
				>
					<div className="flex justify-between items-center mb-6">
						<h3
							className={`text-lg font-semibold ${
								darkMode ? "text-gray-100" : "text-gray-800"
							} transition-colors duration-300`}
						>
							Activity Trends
						</h3>
						<div className="flex gap-4">
							<div className="flex items-center gap-2">
								<span
									className="inline-block w-3 h-3 rounded-full"
									style={{ backgroundColor: darkMode ? "#93c5fd" : "#6366f1" }}
								></span>
								<span
									className={`text-sm ${
										darkMode ? "text-gray-300" : "text-gray-500"
									} transition-colors duration-300`}
								>
									Steps
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span
									className="inline-block w-3 h-3 rounded-full"
									style={{ backgroundColor: darkMode ? "#fb7185" : "#ef4444" }}
								></span>
								<span
									className={`text-sm ${
										darkMode ? "text-gray-300" : "text-gray-500"
									} transition-colors duration-300`}
								>
									Calories
								</span>
							</div>
						</div>
					</div>
					<div className="h-72">
						{isLoading ? (
							<LoadingPlaceholder />
						) : (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={data}>
									<CartesianGrid
										strokeDasharray="3 3"
										vertical={false}
										stroke={darkMode ? "#374151" : "#f1f5f9"}
									/>
									<XAxis
										dataKey="shortDate"
										axisLine={false}
										tickLine={false}
										tick={{
											fill: darkMode ? "#9ca3af" : "#64748b",
											fontSize: 12,
										}}
									/>
									<YAxis
										yAxisId="left"
										axisLine={false}
										tickLine={false}
										tick={{
											fill: darkMode ? "#9ca3af" : "#64748b",
											fontSize: 12,
										}}
										tickFormatter={(value) => `${value / 1000}k`}
									/>
									<YAxis
										yAxisId="right"
										orientation="right"
										axisLine={false}
										tickLine={false}
										tick={{
											fill: darkMode ? "#9ca3af" : "#64748b",
											fontSize: 12,
										}}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Line
										yAxisId="left"
										type="monotone"
										dataKey="steps"
										name="Steps"
										stroke={darkMode ? "#93c5fd" : "#6366f1"}
										strokeWidth={2}
										dot={{ r: 4, fill: darkMode ? "#93c5fd" : "#6366f1" }}
										activeDot={{ r: 6, fill: darkMode ? "#93c5fd" : "#6366f1" }}
									/>
									<Line
										yAxisId="right"
										type="monotone"
										dataKey="calories"
										name="Calories"
										stroke={darkMode ? "#fb7185" : "#ef4444"}
										strokeWidth={2}
										dot={{ r: 4, fill: darkMode ? "#fb7185" : "#ef4444" }}
										activeDot={{ r: 6, fill: darkMode ? "#fb7185" : "#ef4444" }}
									/>
								</LineChart>
							</ResponsiveContainer>
						)}
					</div>
					<div className="flex justify-end mt-4">
						<button
							className={`flex items-center justify-center text-sm gap-1 px-4 py-2 rounded-lg ${
								darkMode
									? "bg-gray-700 hover:bg-gray-600 text-sky-300"
									: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
							} transition-colors cursor-pointer focus:outline-none focus:ring-2 ${
								darkMode ? "focus:ring-sky-300" : "focus:ring-indigo-600"
							}`}
						>
							<Download size={16} />
							<span>Export Data</span>
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div
						className={`${
							darkMode ? "bg-gray-800" : "bg-white"
						} p-6 rounded-2xl shadow-md transition-all duration-300 border ${
							darkMode ? "border-gray-700" : "border-indigo-100"
						} hover:shadow-lg flex flex-col`}
					>
						<h3
							className={`text-lg font-semibold ${
								darkMode ? "text-gray-100" : "text-gray-800"
							} mb-4 transition-colors duration-300 flex items-center gap-2`}
						>
							<Droplets
								size={18}
								className={darkMode ? "text-sky-400" : "text-sky-500"}
							/>
							Daily Hydration
						</h3>

						<div className="flex-1 flex items-center justify-center">
							<div className="relative w-32 h-32">
								<svg className="w-full h-full" viewBox="0 0 100 100">
									<circle
										cx="50"
										cy="50"
										r="45"
										fill="none"
										stroke={darkMode ? "#374151" : "#f1f5f9"}
										strokeWidth="10"
									/>
									<circle
										cx="50"
										cy="50"
										r="45"
										fill="none"
										stroke={darkMode ? "#0ea5e9" : "#0ea5e9"}
										strokeWidth="10"
										strokeDasharray={2 * Math.PI * 45}
										strokeDashoffset={
											2 * Math.PI * 45 * (1 - todayData.water / 8)
										}
										strokeLinecap="round"
										style={{
											transform: "rotate(-90deg)",
											transformOrigin: "center",
										}}
									/>
									<text
										x="50"
										y="45"
										textAnchor="middle"
										fill={darkMode ? "#ffffff" : "#1f2937"}
										fontSize="18"
										fontWeight="bold"
									>
										{todayData.water}
									</text>
									<text
										x="50"
										y="65"
										textAnchor="middle"
										fill={darkMode ? "#9ca3af" : "#6b7280"}
										fontSize="12"
									>
										of 8 glasses
									</text>
								</svg>
							</div>
						</div>

						<div className="mt-4 grid grid-cols-8 gap-1">
							{[...Array(8)].map((_, i) => (
								<div
									key={i}
									className={`h-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
										i < todayData.water
											? darkMode
												? "bg-sky-500"
												: "bg-sky-500"
											: darkMode
											? "bg-gray-700"
											: "bg-gray-100"
									}`}
								>
									{i < todayData.water && (
										<Droplets size={12} className="text-white" />
									)}
								</div>
							))}
						</div>

						<button
							className={`mt-4 w-full py-3 px-4 rounded-xl transition-all duration-300 ${
								darkMode
									? "bg-sky-600 hover:bg-sky-700 text-white"
									: "bg-sky-500 hover:bg-sky-600 text-white"
							} font-medium flex items-center justify-center gap-2`}
						>
							<Droplets size={16} />
							<span>Add Water</span>
						</button>
					</div>

					<div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg text-white border border-indigo-500/30">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-bold flex items-center gap-2">
								<Award className="text-indigo-200" size={24} />
								Today's Recommendations
							</h3>
							<div className="bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-100">
								3 items
							</div>
						</div>

						<div className="space-y-5">
							<div className="bg-white/10 p-4 rounded-xl hover:bg-white/15 transition-all duration-300 backdrop-blur-sm border border-white/5 shadow-lg">
								<div className="flex items-center gap-4">
									<div className="bg-indigo-500/30 p-3 rounded-xl">
										<Activity size={24} className="text-indigo-100" />
									</div>
									<div className="flex-1">
										<p className="font-medium">Increase your daily steps</p>
										<div className="mt-1 flex items-center gap-2">
											<div className="h-1.5 bg-indigo-300/30 rounded-full w-full overflow-hidden">
												<div
													className="h-full bg-indigo-300 rounded-full"
													style={{ width: "70%" }}
												></div>
											</div>
											<p className="text-indigo-200 text-xs whitespace-nowrap">
												{stepCountFromGoal().toLocaleString()} to go
											</p>
										</div>
									</div>
									<button
										onClick={() => acknowledgeRecommendation("steps")}
										className="p-2 hover:bg-indigo-500/30 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
										aria-label="Acknowledge steps recommendation"
									>
										{acknowledgedRecommendations["steps"] ? (
											<CheckCircle
												size={22}
												className="text-green-300 transition-all duration-300"
											/>
										) : (
											<Circle
												size={22}
												className="text-white transition-all duration-300"
											/>
										)}
									</button>
								</div>
							</div>

							<div className="bg-white/10 p-4 rounded-xl hover:bg-white/15 transition-all duration-300 backdrop-blur-sm border border-white/5 shadow-lg">
								<div className="flex items-center gap-4">
									<div className="bg-indigo-500/30 p-3 rounded-xl">
										<Moon size={24} className="text-indigo-100" />
									</div>
									<div className="flex-1">
										<p className="font-medium">Improve sleep consistency</p>
										<div className="flex mt-1 text-indigo-200 text-xs items-center gap-1">
											<TrendingUp size={14} />
											<p>Consistency is key for quality rest</p>
										</div>
									</div>
									<button
										onClick={() => acknowledgeRecommendation("sleep")}
										className="p-2 hover:bg-indigo-500/30 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
										aria-label="Acknowledge sleep recommendation"
									>
										{acknowledgedRecommendations["sleep"] ? (
											<CheckCircle
												size={22}
												className="text-green-300 transition-all duration-300"
											/>
										) : (
											<Circle
												size={22}
												className="text-white transition-all duration-300"
											/>
										)}
									</button>
								</div>
							</div>

							<div className="bg-white/10 p-4 rounded-xl hover:bg-white/15 transition-all duration-300 backdrop-blur-sm border border-white/5 shadow-lg">
								<div className="flex items-center gap-4">
									<div className="bg-indigo-500/30 p-3 rounded-xl">
										<Flame size={24} className="text-indigo-100" />
									</div>
									<div className="flex-1">
										<p className="font-medium">Reach your calorie goal</p>
										<div className="flex mt-1 text-indigo-200 text-xs items-center gap-1">
											<TrendingUp size={14} />
											<p>30-min workout suggestion</p>
										</div>
									</div>
									<button
										onClick={() => acknowledgeRecommendation("calories")}
										className="p-2 hover:bg-indigo-500/30 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
										aria-label="Acknowledge calories recommendation"
									>
										{acknowledgedRecommendations["calories"] ? (
											<CheckCircle
												size={22}
												className="text-green-300 transition-all duration-300"
											/>
										) : (
											<Circle
												size={22}
												className="text-white transition-all duration-300"
											/>
										)}
									</button>
								</div>
							</div>
						</div>

						<div className="mt-6">
							<button className="w-full bg-white text-indigo-700 font-semibold px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 flex items-center justify-center gap-2 shadow-lg">
								View All Recommendations
								<ChevronRight size={18} />
							</button>
						</div>
					</div>
				</div>

				<footer
					className={`${
						darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
					} p-6 rounded-2xl shadow-md mt-8 transition-all duration-300 border ${
						darkMode ? "border-gray-700" : "border-indigo-100"
					}`}
				>
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-2">
							<div
								className={`p-1 rounded-lg ${
									darkMode ? "bg-indigo-600" : "bg-indigo-600"
								}`}
							>
								<Activity
									className="text-white transition-colors duration-300"
									size={18}
								/>
							</div>
							<span className="font-semibold">PulseTrack</span>
							<span className="text-sm">© 2025</span>
						</div>
						<div className="flex gap-6">
							<button
								className={`text-sm hover:${
									darkMode ? "text-sky-300" : "text-indigo-600"
								} transition-colors duration-300 cursor-pointer`}
							>
								Privacy Policy
							</button>
							<button
								className={`text-sm hover:${
									darkMode ? "text-sky-300" : "text-indigo-600"
								} transition-colors duration-300 cursor-pointer`}
							>
								Terms of Use
							</button>
							<button
								className={`text-sm hover:${
									darkMode ? "text-sky-300" : "text-indigo-600"
								} transition-colors duration-300 cursor-pointer`}
							>
								Contact Support
							</button>
						</div>
					</div>
				</footer>
			</main>

			<style jsx global>{`
				.dark-mode {
					background-color: #111827;
					color: #f3f4f6;
				}
			`}</style>
		</div>
	);
};

export default HealthDashboard;
