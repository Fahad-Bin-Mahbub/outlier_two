"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LineChart,
	Line,
	Area,
	AreaChart,
} from "recharts";
import {
	Calendar,
	AlertTriangle,
	CheckCircle,
	Home,
	Briefcase,
	Settings,
	Bell,
	User,
	LogOut,
	Menu,
	X,
	ChevronLeft,
	ChevronRight,
	Info,
	BarChart2,
	PieChartIcon,
	Layers,
	Download,
	UploadCloud,
	Coffee,
	Award,
	ArrowUpRight,
	Cpu,
	HelpCircle,
	Globe,
	Zap,
	MessageSquare,
	Activity,
} from "lucide-react";

type AttendanceType = "office" | "wfh" | "leave" | "holiday" | "weekend";
type AlertType = "warning" | "danger" | "success" | "info";
type ActiveTabType = "calendar" | "analytics" | "settings" | "dashboard";
type AnalyticsViewType = "monthly" | "yearly" | "trends";
type ThemeMode = "light" | "dark";

interface DayAttendance {
	date: Date;
	type: AttendanceType;
	notes?: string;
}

interface Holiday {
	date: Date;
	name: string;
}

interface AttendanceAlert {
	id: string;
	type: AlertType;
	message: string;
	date: Date;
}

interface MonthSummary {
	totalDays: number;
	workingDays: number;
	officeDays: number;
	wfhDays: number;
	leaveDays: number;
	holidayDays: number;
	weekendDays: number;
	officePercentage: number;
}

interface UserProfile {
	id: number;
	name: string;
	role: string;
	avatar: string;
	department?: string;
	joinDate?: Date;
	email?: string;
}

interface TeamMember {
	id: number;
	name: string;
	avatar: string;
	role: string;
	status: "office" | "wfh" | "leave" | "holiday";
}

interface Activity {
	id: string;
	user: string;
	action: string;
	date: Date;
	icon: React.ReactNode;
}

const isWeekend = (date: Date): boolean => {
	const day = date.getDay();
	return day === 0 || day === 6;
};

const isHoliday = (date: Date, holidays: Holiday[]): Holiday | undefined => {
	return holidays.find(
		(holiday) =>
			holiday.date.getDate() === date.getDate() &&
			holiday.date.getMonth() === date.getMonth() &&
			holiday.date.getFullYear() === date.getFullYear()
	);
};

const isSameDay = (date1: Date, date2: Date): boolean => {
	return (
		date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear()
	);
};

const getDaysInMonth = (year: number, month: number): Date[] => {
	const days: Date[] = [];
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	for (let i = 1; i <= daysInMonth; i++) {
		days.push(new Date(year, month, i));
	}

	return days;
};

const getWorkingDaysInMonth = (
	year: number,
	month: number,
	holidays: Holiday[]
): Date[] => {
	const days = getDaysInMonth(year, month);
	return days.filter((date) => !isWeekend(date) && !isHoliday(date, holidays));
};

const sumBy = <T extends object>(array: T[], key: keyof T): number => {
	return array.reduce((sum, item) => {
		const value = item[key];
		return sum + (typeof value === "number" ? value : 0);
	}, 0);
};

const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
};

const formatMonth = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(date);
};

const formatShortDay = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
};

const formatTime = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(date);
};

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#6b7280"];

const AttendanceTypeIndicator = ({ type }) => {
	const colors = {
		office: "bg-emerald-500",
		wfh: "bg-blue-500",
		leave: "bg-amber-500",
		holiday: "bg-purple-500",
		weekend: "bg-gray-400",
	};

	return <div className={`h-3 w-3 rounded-full ${colors[type]}`} />;
};

const ProgressBar = ({ percentage, height = "h-2.5" }) => {
	const color =
		percentage >= 40
			? "bg-emerald-500"
			: percentage >= 20
			? "bg-amber-500"
			: "bg-red-500";

	return (
		<div
			className={`w-full ${
				height === "h-2.5" ? "bg-gray-200" : "bg-gray-700"
			} rounded-full ${height} mt-2`}
		>
			<div
				className={`${height} rounded-full ${color} transition-all duration-500 ease-in-out`}
				style={{ width: `${Math.min(percentage, 100)}%` }}
			/>
		</div>
	);
};

const Notification = ({ alert, onClose, isDarkMode }) => {
	const getStyles = (type) => {
		const styles = {
			warning: {
				bg: "bg-amber-50 border-amber-200 text-amber-800",
				darkBg: "bg-amber-900 border-amber-800 text-amber-200",
				icon: "text-amber-500",
			},
			danger: {
				bg: "bg-red-50 border-red-200 text-red-800",
				darkBg: "bg-red-900 border-red-800 text-red-200",
				icon: "text-red-500",
			},
			success: {
				bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
				darkBg: "bg-emerald-900 border-emerald-800 text-emerald-200",
				icon: "text-emerald-500",
			},
			info: {
				bg: "bg-blue-50 border-blue-200 text-blue-800",
				darkBg: "bg-blue-900 border-blue-800 text-blue-200",
				icon: "text-blue-500",
			},
		};
		return styles[type];
	};

	const styles = getStyles(alert.type);
	const bgColor = isDarkMode ? styles.darkBg : styles.bg; // Use prop instead of document

	const IconComponent =
		alert.type === "success"
			? CheckCircle
			: alert.type === "info"
			? Info
			: AlertTriangle;

	return (
		<div
			className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-fade-in-down transform transition-transform duration-300 ${bgColor} border`}
		>
			<div className="flex items-start">
				<IconComponent
					className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`}
				/>
				<div className="flex-1">
					<p className="text-sm font-medium">{alert.message}</p>
				</div>
				<button
					onClick={onClose}
					className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500 cursor-pointer"
				>
					<X className="h-5 w-5" />
				</button>
			</div>
		</div>
	);
};

const LoadingSpinner = ({ isDarkMode }) => {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			<p
				className={`ml-3 text-lg font-medium ${
					isDarkMode ? "text-gray-300" : "text-gray-700"
				}`}
			>
				Loading...
			</p>
		</div>
	);
};

const Logo = ({ isDarkMode }) => {
	return (
		<div className="flex items-center">
			<div className="relative">
				<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
					<Calendar className="h-5 w-5 text-white" />
				</div>
				<div
					className={`absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 ${
						isDarkMode ? "border-gray-900" : "border-white"
					}`}
				></div>
			</div>
			<h1
				className={`ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
					isDarkMode
						? "from-blue-400 to-purple-400"
						: "from-blue-600 to-purple-600"
				}`}
			>
				WorkPulse
			</h1>
		</div>
	);
};

const Header = ({
	currentUser,
	activeTab,
	setActiveTab,
	mobileMenuOpen,
	setMobileMenuOpen,
	isDarkMode,
	toggleDarkMode,
	createAlert,
}) => {
	const handleNotImplemented = () => {
		createAlert("This feature is coming soon!", "info");
	};

	const getTabStyle = (tab) => {
		const baseStyle =
			"px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out flex items-center space-x-1.5 cursor-pointer";

		if (activeTab === tab) {
			return `${baseStyle} ${
				isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-700"
			}`;
		}

		return `${baseStyle} ${
			isDarkMode
				? "text-gray-300 hover:bg-gray-800"
				: "text-gray-600 hover:bg-gray-100"
		}`;
	};

	return (
		<header
			className={`${
				isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
			} border-b shadow-sm sticky top-0 z-10`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Logo isDarkMode={isDarkMode} />
					</div>

					{}
					<nav className="hidden md:flex space-x-6">
						<button
							onClick={() => setActiveTab("dashboard")}
							className={getTabStyle("dashboard")}
						>
							<Layers className="h-4 w-4 text-indigo-500" />
							<span>Dashboard</span>
						</button>

						<button
							onClick={() => setActiveTab("calendar")}
							className={getTabStyle("calendar")}
						>
							<Calendar className="h-4 w-4 text-green-500" />
							<span>Calendar</span>
						</button>

						<button
							onClick={() => setActiveTab("analytics")}
							className={getTabStyle("analytics")}
						>
							<BarChart2 className="h-4 w-4 text-blue-500" />
							<span>Analytics</span>
						</button>

						<button
							onClick={() => setActiveTab("settings")}
							className={getTabStyle("settings")}
						>
							<Settings className="h-4 w-4 text-purple-500" />
							<span>Settings</span>
						</button>
					</nav>

					{}
					<div className="flex items-center space-x-4">
						<button
							onClick={toggleDarkMode}
							className={`p-1.5 rounded-full ${
								isDarkMode
									? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
									: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
							} cursor-pointer`}
						>
							{isDarkMode ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
									/>
								</svg>
							)}
						</button>

						<div className="relative">
							<button
								className={`p-1.5 rounded-full ${
									isDarkMode
										? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
										: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
								} relative cursor-pointer`}
								onClick={handleNotImplemented}
							>
								<Bell className="h-5 w-5 text-orange-500" />
								<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
							</button>
						</div>

						<div className="relative">
							<button
								className={`flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 border ${
									isDarkMode ? "border-gray-700" : "border-gray-200"
								} cursor-pointer`}
								aria-label="User menu"
								onClick={handleNotImplemented}
							>
								<img
									className="h-8 w-8 rounded-full"
									src={currentUser.avatar}
									alt={currentUser.name}
								/>
								<span
									className={`hidden md:block font-medium pr-2 ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									{currentUser.name}
								</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="hidden md:block h-4 w-4 text-gray-400 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						</div>

						<div className="ml-2 md:hidden">
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className={`inline-flex items-center justify-center p-2 rounded-md ${
									isDarkMode
										? "text-gray-400 hover:text-white hover:bg-gray-800"
										: "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
								} focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
							>
								{mobileMenuOpen ? (
									<X className="h-6 w-6" />
								) : (
									<Menu className="h-6 w-6" />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

const MobileMenu = ({
	activeTab,
	setActiveTab,
	currentUser,
	setMobileMenuOpen,
	isDarkMode,
	createAlert,
}) => {
	const handleNotImplemented = () => {
		createAlert("This feature is coming soon!", "info");
	};

	const getTabStyle = (tab) => {
		const baseStyle =
			"block w-full text-left px-3 py-2 rounded-md text-base font-medium cursor-pointer";

		if (activeTab === tab) {
			return `${baseStyle} ${
				isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-700"
			}`;
		}

		return `${baseStyle} ${
			isDarkMode
				? "text-gray-300 hover:bg-gray-800"
				: "text-gray-700 hover:bg-gray-100"
		}`;
	};

	return (
		<div
			className={`md:hidden ${
				isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
			} shadow-lg border-b`}
		>
			<div className="px-2 pt-2 pb-3 space-y-1">
				<button
					onClick={() => {
						setActiveTab("dashboard");
						setMobileMenuOpen(false);
					}}
					className={getTabStyle("dashboard")}
				>
					<div className="flex items-center space-x-2">
						<Layers className="h-5 w-5 text-indigo-500" />
						<span>Dashboard</span>
					</div>
				</button>

				<button
					onClick={() => {
						setActiveTab("calendar");
						setMobileMenuOpen(false);
					}}
					className={getTabStyle("calendar")}
				>
					<div className="flex items-center space-x-2">
						<Calendar className="h-5 w-5 text-green-500" />
						<span>Calendar</span>
					</div>
				</button>

				<button
					onClick={() => {
						setActiveTab("analytics");
						setMobileMenuOpen(false);
					}}
					className={getTabStyle("analytics")}
				>
					<div className="flex items-center space-x-2">
						<BarChart2 className="h-5 w-5 text-blue-500" />
						<span>Analytics</span>
					</div>
				</button>

				<button
					onClick={() => {
						setActiveTab("settings");
						setMobileMenuOpen(false);
					}}
					className={getTabStyle("settings")}
				>
					<div className="flex items-center space-x-2">
						<Settings className="h-5 w-5 text-purple-500" />
						<span>Settings</span>
					</div>
				</button>
			</div>

			<div
				className={`pt-4 pb-3 border-t ${
					isDarkMode ? "border-gray-800" : "border-gray-200"
				}`}
			>
				<div className="px-4 flex items-center">
					<div className="flex-shrink-0">
						<img
							className="h-10 w-10 rounded-full"
							src={currentUser.avatar}
							alt={currentUser.name}
						/>
					</div>
					<div className="ml-3">
						<div
							className={`text-base font-medium ${
								isDarkMode ? "text-gray-200" : "text-gray-800"
							}`}
						>
							{currentUser.name}
						</div>
						<div
							className={`text-sm font-medium ${
								isDarkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							{currentUser.role}
						</div>
					</div>
					<button
						className={`ml-auto flex-shrink-0 p-1 rounded-full ${
							isDarkMode
								? "text-gray-300 hover:text-gray-200"
								: "text-gray-400 hover:text-gray-500"
						} cursor-pointer`}
						onClick={handleNotImplemented}
					>
						<Bell className="h-6 w-6 text-orange-500" />
					</button>
				</div>
				<div className="mt-3 px-2 space-y-1">
					<button
						className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
							isDarkMode
								? "text-gray-300 hover:bg-gray-800"
								: "text-gray-700 hover:bg-gray-100"
						} cursor-pointer`}
						onClick={handleNotImplemented}
					>
						<div className="flex items-center space-x-2">
							<User className="h-5 w-5 text-teal-500" />
							<span>Your Profile</span>
						</div>
					</button>
					<button
						className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
							isDarkMode
								? "text-gray-300 hover:bg-gray-800"
								: "text-gray-700 hover:bg-gray-100"
						} cursor-pointer`}
						onClick={handleNotImplemented}
					>
						<div className="flex items-center space-x-2">
							<Settings className="h-5 w-5 text-purple-500" />
							<span>Settings</span>
						</div>
					</button>
					<button
						className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
							isDarkMode
								? "text-gray-300 hover:bg-gray-800"
								: "text-gray-700 hover:bg-gray-100"
						} cursor-pointer`}
						onClick={handleNotImplemented}
					>
						<div className="flex items-center space-x-2">
							<LogOut className="h-5 w-5 text-red-500" />
							<span>Sign out</span>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

const DashboardView = ({
	currentUser,
	currentMonthSummary,
	yearlyChartData,
	teamMembers,
	activities,
	selectedDay,
	setSelectedDay,
	updateAttendance,
	attendance,
	today,
	setActiveTab,
	isDarkMode,
	createAlert,
}) => {
	const todayStatus =
		attendance.find((a) => isSameDay(a.date, today))?.type || "wfh";
	const formattedDate = formatDate(today);

	const handleNotImplemented = () => {
		createAlert("This feature is coming soon!", "info");
	};

	const trendData = useMemo(() => {
		return Array.from({ length: 7 }).map((_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - (6 - i));
			const record = attendance.find((a) => isSameDay(a.date, date));
			return {
				name: date.toLocaleDateString("en-US", { weekday: "short" }),
				efficiency: Math.round(80 + Math.random() * 20),
				type: record?.type || (isWeekend(date) ? "weekend" : "wfh"),
			};
		});
	}, [attendance]);

	const getStatusStyle = (status) => {
		if (status === "office") {
			return isDarkMode
				? "bg-emerald-900 text-emerald-200"
				: "bg-emerald-100 text-emerald-800";
		} else if (status === "wfh") {
			return isDarkMode
				? "bg-blue-900 text-blue-200"
				: "bg-blue-100 text-blue-800";
		} else {
			return isDarkMode
				? "bg-amber-900 text-amber-200"
				: "bg-amber-100 text-amber-800";
		}
	};

	const getCardBgStyle = () => {
		return isDarkMode
			? "bg-gray-800 border-gray-700"
			: "bg-white border-gray-200";
	};

	return (
		<div className="space-y-6">
			{}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{}
				<div
					className={`lg:col-span-2 ${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
				>
					<div className="p-6 flex flex-col h-full">
						<div className="flex items-start justify-between">
							<div>
								<div className="flex items-center space-x-2">
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										{formattedDate}
									</span>
									<span
										className={`px-2 py-0.5 text-xs rounded-full ${getStatusStyle(
											todayStatus
										)}`}
									>
										{todayStatus === "office"
											? "In Office"
											: todayStatus === "wfh"
											? "Working Remotely"
											: todayStatus === "leave"
											? "On Leave"
											: "Weekend"}
									</span>
								</div>
								<h2
									className={`mt-1 text-2xl font-bold ${
										isDarkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Welcome back, {currentUser.name.split(" ")[0]}
								</h2>
								<p
									className={`mt-2 text-sm ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									You've worked {currentMonthSummary.officeDays} days in the
									office this month, which is{" "}
									{currentMonthSummary.officePercentage >= 40
										? "meeting"
										: "below"}{" "}
									your 40% office target.
								</p>
							</div>
							<div
								className={`hidden sm:flex items-center justify-center h-16 w-16 rounded-full ${
									isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
								}  `}
							>
								<Calendar className="h-8 w-8 text-blue-600 " />
							</div>
						</div>

						<div className="mt-6 flex items-center justify-between">
							<div>
								<div className="flex items-center space-x-1">
									<span
										className={`text-xl font-bold ${
											isDarkMode ? "text-white" : "text-gray-800"
										}`}
									>
										{currentMonthSummary.officePercentage.toFixed(1)}%
									</span>
									<span
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										office attendance
									</span>
									<ArrowUpRight
										className={`h-4 w-4 ml-1 ${
											currentMonthSummary.officePercentage >= 40
												? "text-emerald-500"
												: "text-red-500"
										}`}
									/>
								</div>
								<ProgressBar
									percentage={currentMonthSummary.officePercentage}
								/>
								<p
									className={`mt-1 text-xs ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									{currentMonthSummary.officeDays} of{" "}
									{currentMonthSummary.workingDays} working days
								</p>
							</div>

							<div className="flex space-x-2">
								<button
									onClick={() => {
										setSelectedDay(today);
										updateAttendance("office");
									}}
									className="flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer"
								>
									<Briefcase className="h-4 w-4 mr-1" />
									<span className="text-sm font-medium">Office</span>
								</button>
								<button
									onClick={() => {
										setSelectedDay(today);
										updateAttendance("wfh");
									}}
									className="flex items-center px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
								>
									<Home className="h-4 w-4 mr-1" />
									<span className="text-sm font-medium">WFH</span>
								</button>
								<button
									onClick={() => {
										setSelectedDay(today);
										updateAttendance("leave");
									}}
									className="flex items-center px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm cursor-pointer"
								>
									<Coffee className="h-4 w-4 mr-1" />
									<span className="text-sm font-medium">Leave</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
					{}
					<div
						className={`${getCardBgStyle()} rounded-xl shadow-sm border p-5`}
					>
						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<span
									className={`text-sm font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Office Streak
								</span>
								<span
									className={`mt-1 text-2xl font-bold ${
										isDarkMode ? "text-white" : "text-gray-900"
									}`}
								>
									5 days
								</span>
							</div>
							<div
								className={`h-12 w-12 rounded-full ${
									isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100"
								} flex items-center justify-center`}
							>
								<Award
									className={`h-6 w-6 ${
										isDarkMode ? "text-yellow-400" : "text-yellow-600"
									}`}
								/>
							</div>
						</div>
						<p
							className={`mt-2 text-xs ${
								isDarkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							Your longest streak this month! Keep it up.
						</p>
					</div>

					{}
					<div
						className={`${getCardBgStyle()} rounded-xl shadow-sm border p-5`}
					>
						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<span
									className={`text-sm font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									This Week
								</span>
								<span
									className={`mt-1 text-2xl font-bold ${
										isDarkMode ? "text-white" : "text-gray-900"
									}`}
								>
									3/5 days
								</span>
							</div>
							<div
								className={`h-12 w-12 rounded-full ${
									isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
								} flex items-center justify-center`}
							>
								<Activity
									className={`h-6 w-6 ${
										isDarkMode ? "text-blue-400" : "text-blue-600"
									}`}
								/>
							</div>
						</div>
						<p
							className={`mt-2 text-xs ${
								isDarkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							You've been in the office 3 out of 5 working days this week
						</p>
					</div>
				</div>
			</div>

			{}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{}
				<div
					className={`lg:col-span-2 ${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
				>
					<div
						className={`p-5 border-b ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<div className="flex items-center justify-between">
							<h3
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Productivity Trend
							</h3>
							<div className="flex items-center space-x-2">
								<select
									className={`text-sm rounded-md border ${
										isDarkMode
											? "border-gray-600 bg-gray-700 text-gray-200"
											: "border-gray-300 bg-white text-gray-700"
									} px-2 py-1 cursor-pointer`}
								>
									<option>Last 7 days</option>
									<option>Last 14 days</option>
									<option>Last 30 days</option>
								</select>
								<button
									className={`p-1 rounded-md ${
										isDarkMode
											? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
											: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
									} cursor-pointer`}
									onClick={handleNotImplemented}
								>
									<Download className="h-4 w-4 text-purple-500" />
								</button>
							</div>
						</div>
					</div>
					<div className="p-5">
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={trendData}
									margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
								>
									<defs>
										<linearGradient
											id="colorEfficiency"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
											<stop
												offset="95%"
												stopColor="#3b82f6"
												stopOpacity={0.1}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke={isDarkMode ? "#374151" : "#e5e7eb"}
									/>
									<XAxis
										dataKey="name"
										tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
									/>
									<YAxis
										domain={[0, 100]}
										tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
									/>
									<Tooltip
										formatter={(value, name) => [`${value}%`, "Productivity"]}
										labelFormatter={(label) => `${label}`}
										contentStyle={{
											backgroundColor: isDarkMode ? "#1f2937" : "white",
											borderRadius: "0.5rem",
											boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
											color: isDarkMode ? "white" : "black",
										}}
									/>
									<Area
										type="monotone"
										dataKey="efficiency"
										stroke="#3b82f6"
										fillOpacity={1}
										fill="url(#colorEfficiency)"
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
						<div className="mt-4 flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-1">
									<div className="h-3 w-3 rounded-full bg-emerald-500"></div>
									<span
										className={`text-xs ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Office
									</span>
								</div>
								<div className="flex items-center space-x-1">
									<div className="h-3 w-3 rounded-full bg-blue-500"></div>
									<span
										className={`text-xs ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										WFH
									</span>
								</div>
								<div className="flex items-center space-x-1">
									<div className="h-3 w-3 rounded-full bg-purple-500"></div>
									<span
										className={`text-xs ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Hybrid
									</span>
								</div>
							</div>
							<button
								onClick={() => setActiveTab("analytics")}
								className={`text-sm ${
									isDarkMode
										? "text-blue-400 hover:text-blue-300"
										: "text-blue-600 hover:text-blue-800"
								} font-medium cursor-pointer`}
							>
								View detailed analytics →
							</button>
						</div>
					</div>
				</div>

				{}
				<div
					className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
				>
					<div
						className={`p-5 border-b ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<div className="flex items-center justify-between">
							<h3
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Team Status
							</h3>
							<button
								className={`text-sm ${
									isDarkMode
										? "text-blue-400 hover:text-blue-300"
										: "text-blue-600 hover:text-blue-800"
								} font-medium cursor-pointer`}
								onClick={handleNotImplemented}
							>
								View all
							</button>
						</div>
					</div>
					<div className="p-5">
						<div className="space-y-4">
							{teamMembers.slice(0, 5).map((member) => (
								<div
									key={member.id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center space-x-3">
										<img
											src={member.avatar}
											alt={member.name}
											className="h-10 w-10 rounded-full"
										/>
										<div>
											<p
												className={`text-sm font-medium ${
													isDarkMode ? "text-white" : "text-gray-900"
												}`}
											>
												{member.name}
											</p>
											<p
												className={`text-xs ${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												{member.role}
											</p>
										</div>
									</div>
									<span
										className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(
											member.status
										)}`}
									>
										{member.status === "office"
											? "Office"
											: member.status === "wfh"
											? "WFH"
											: member.status === "leave"
											? "Leave"
											: "Holiday"}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{}
				<div
					className={`lg:col-span-2 ${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
				>
					<div
						className={`p-5 border-b ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<h3
							className={`text-lg font-semibold ${
								isDarkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Recent Activity
						</h3>
					</div>
					<div className="p-5">
						<div className="relative">
							<div
								className={`absolute left-4 top-0 h-full w-0.5 ${
									isDarkMode ? "bg-gray-700" : "bg-gray-200"
								}`}
							></div>
							<ul className="space-y-4">
								{activities.map((activity) => (
									<li key={activity.id} className="relative pl-10">
										<div
											className={`absolute left-0 top-1 h-8 w-8 flex items-center justify-center rounded-full ${
												isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
											} z-10`}
										>
											{activity.icon}
										</div>
										<div
											className={`${
												isDarkMode ? "bg-gray-900/50" : "bg-gray-50"
											} rounded-lg p-3`}
										>
											<p
												className={`text-sm ${
													isDarkMode ? "text-gray-200" : "text-gray-800"
												}`}
											>
												{activity.action}
											</p>
											<div
												className={`mt-1 flex items-center text-xs ${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												<span>{activity.user}</span>
												<span className="mx-1">•</span>
												<span>{formatTime(activity.date)}</span>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{}
				<div className="space-y-6">
					{}
					<div
						className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
					>
						<div
							className={`p-5 border-b ${
								isDarkMode ? "border-gray-700" : "border-gray-200"
							}`}
						>
							<h3
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Quick Links
							</h3>
						</div>
						<div className="p-5">
							<div className="grid grid-cols-2 gap-3">
								<button
									className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
										isDarkMode
											? "border-gray-700 hover:bg-gray-700"
											: "border-gray-200 hover:bg-gray-50"
									} transition-colors cursor-pointer`}
									onClick={handleNotImplemented}
								>
									<UploadCloud className="h-6 w-6 text-pink-500 mb-2" />
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-200" : "text-gray-800"
										}`}
									>
										Request Leave
									</span>
								</button>
								<button
									onClick={() => setActiveTab("calendar")}
									className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
										isDarkMode
											? "border-gray-700 hover:bg-gray-700"
											: "border-gray-200 hover:bg-gray-50"
									} transition-colors cursor-pointer`}
								>
									<Calendar className="h-6 w-6 text-purple-500 mb-2" />
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-200" : "text-gray-800"
										}`}
									>
										View Calendar
									</span>
								</button>
								<button
									className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
										isDarkMode
											? "border-gray-700 hover:bg-gray-700"
											: "border-gray-200 hover:bg-gray-50"
									} transition-colors cursor-pointer`}
									onClick={handleNotImplemented}
								>
									<MessageSquare className="h-6 w-6 text-emerald-500 mb-2" />
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-200" : "text-gray-800"
										}`}
									>
										Team Chat
									</span>
								</button>
								<button
									onClick={() => setActiveTab("settings")}
									className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
										isDarkMode
											? "border-gray-700 hover:bg-gray-700"
											: "border-gray-200 hover:bg-gray-50"
									} transition-colors cursor-pointer`}
								>
									<Settings className="h-6 w-6 text-gray-500 mb-2" />
									<span
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-200" : "text-gray-800"
										}`}
									>
										Settings
									</span>
								</button>
							</div>
						</div>
					</div>

					{}
					<div
						className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
					>
						<div
							className={`p-5 border-b ${
								isDarkMode ? "border-gray-700" : "border-gray-200"
							}`}
						>
							<h3
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Reminders
							</h3>
						</div>
						<div className="p-5">
							<div className="space-y-3">
								<div
									className={`flex items-start p-3 ${
										isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50"
									} rounded-lg`}
								>
									<AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
									<div>
										<p
											className={`text-sm font-medium ${
												isDarkMode ? "text-gray-200" : "text-gray-800"
											}`}
										>
											Weekly team meeting
										</p>
										<p
											className={`text-xs ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											} mt-1`}
										>
											Tomorrow at 10:00 AM
										</p>
									</div>
								</div>
								<div
									className={`flex items-start p-3 ${
										isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
									} rounded-lg`}
								>
									<Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
									<div>
										<p
											className={`text-sm font-medium ${
												isDarkMode ? "text-gray-200" : "text-gray-800"
											}`}
										>
											Company Town Hall
										</p>
										<p
											className={`text-xs ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											} mt-1`}
										>
											Friday at 2:00 PM
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Footer = ({ isDarkMode, createAlert }) => {
	const handleNotImplemented = () => {
		createAlert("This feature is coming soon!", "info");
	};

	const currentYear = new Date().getFullYear();

	return (
		<footer
			className={`${
				isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"
			} pt-12 pb-8`}
		>
			{}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{}
					<div className="col-span-1 md:col-span-2 lg:col-span-1">
						<div className="flex items-center mb-4">
							<div className="relative">
								<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
									<Calendar className="h-6 w-6 text-white" />
								</div>
								<div
									className={`absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 ${
										isDarkMode ? "border-gray-900" : "border-white"
									}`}
								></div>
							</div>
							<h3
								className={`ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
									isDarkMode
										? "from-blue-400 to-purple-400"
										: "from-blue-600 to-purple-600"
								}`}
							>
								WorkPulse
							</h3>
						</div>
						<p className="text-sm mb-4 max-w-xs">
							Simplify your hybrid work scheduling with our intelligent
							attendance management platform.
						</p>
						<div className="flex space-x-4 mb-6">
							<a
								href="#"
								className={`transition-colors p-2 rounded-full ${
									isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
								} cursor-pointer`}
								onClick={(e) => {
									e.preventDefault();
									handleNotImplemented();
								}}
								aria-label="Twitter"
							>
								<svg
									className="h-5 w-5 text-blue-500"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
								</svg>
							</a>
							<a
								href="#"
								className={`transition-colors p-2 rounded-full ${
									isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
								} cursor-pointer`}
								onClick={(e) => {
									e.preventDefault();
									handleNotImplemented();
								}}
								aria-label="LinkedIn"
							>
								<svg
									className="h-5 w-5 text-blue-700"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</a>
							<a
								href="#"
								className={`transition-colors p-2 rounded-full ${
									isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
								} cursor-pointer`}
								onClick={(e) => {
									e.preventDefault();
									handleNotImplemented();
								}}
								aria-label="GitHub"
							>
								<svg
									className="h-5 w-5 text-gray-500"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
								</svg>
							</a>
							<a
								href="#"
								className={`transition-colors p-2 rounded-full ${
									isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
								} cursor-pointer`}
								onClick={(e) => {
									e.preventDefault();
									handleNotImplemented();
								}}
								aria-label="Facebook"
							>
								<svg
									className="h-5 w-5 text-blue-600"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</a>
						</div>
					</div>

					{}
					<div>
						<h4
							className={`text-sm uppercase font-bold mb-4 ${
								isDarkMode ? "text-gray-100" : "text-gray-900"
							}`}
						>
							Platform
						</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Integrations
								</a>
							</li>
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Enterprise
								</a>
							</li>
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Security
								</a>
							</li>
						</ul>
					</div>

					{}
					<div>
						<h4
							className={`text-sm uppercase font-bold mb-4 ${
								isDarkMode ? "text-gray-100" : "text-gray-900"
							}`}
						>
							Support
						</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Help Center
								</a>
							</li>
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Documentation
								</a>
							</li>
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Guides
								</a>
							</li>
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									API Status
								</a>
							</li>
							<li>
								<a
									href="#"
									className={`hover:underline cursor-pointer ${
										isDarkMode ? "hover:text-white" : "hover:text-black"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleNotImplemented();
									}}
								>
									Contact Us
								</a>
							</li>
						</ul>
					</div>

					{}
					<div>
						<h4
							className={`text-sm uppercase font-bold mb-4 ${
								isDarkMode ? "text-gray-100" : "text-gray-900"
							}`}
						>
							Subscribe
						</h4>
						<p className="text-sm mb-4">
							Get the latest updates and product news directly to your inbox.
						</p>
						<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
							<input
								type="email"
								placeholder="Enter your email"
								className={`px-4 py-2 text-sm rounded-md ${
									isDarkMode
										? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
										: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
								} border focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-0 flex-1`}
							/>
							<button
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer whitespace-nowrap"
								onClick={handleNotImplemented}
							>
								Subscribe
							</button>
						</div>
						<p className="text-xs mt-2 text-gray-500">
							We respect your privacy. Unsubscribe at any time.
						</p>
					</div>
				</div>
			</div>

			{}
			<div
				className={`mt-12 pt-8 border-t ${
					isDarkMode ? "border-gray-800" : "border-gray-200"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
					<div className="mb-4 sm:mb-0 text-center sm:text-left">
						<p className="text-sm">
							© {currentYear} WorkPulse. All rights reserved.
						</p>
					</div>
					<div className="flex flex-wrap justify-center gap-4 text-sm">
						<a
							href="#"
							className={`hover:underline cursor-pointer ${
								isDarkMode ? "hover:text-white" : "hover:text-black"
							}`}
							onClick={(e) => {
								e.preventDefault();
								handleNotImplemented();
							}}
						>
							Privacy Policy
						</a>
						<a
							href="#"
							className={`hover:underline cursor-pointer ${
								isDarkMode ? "hover:text-white" : "hover:text-black"
							}`}
							onClick={(e) => {
								e.preventDefault();
								handleNotImplemented();
							}}
						>
							Terms of Service
						</a>
						<a
							href="#"
							className={`hover:underline cursor-pointer ${
								isDarkMode ? "hover:text-white" : "hover:text-black"
							}`}
							onClick={(e) => {
								e.preventDefault();
								handleNotImplemented();
							}}
						>
							Cookie Policy
						</a>
						<a
							href="#"
							className={`hover:underline cursor-pointer ${
								isDarkMode ? "hover:text-white" : "hover:text-black"
							}`}
							onClick={(e) => {
								e.preventDefault();
								handleNotImplemented();
							}}
						>
							Accessibility
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

const DayModal = ({
	selectedDay,
	setSelectedDay,
	formatDate,
	isWeekend,
	isSettingHoliday,
	setIsSettingHoliday,
	holidayName,
	setHolidayName,
	noteText,
	setNoteText,
	updateAttendance,
	handleHolidayUpdate,
	isHoliday,
	holidays,
	deleteHoliday,
	isDarkMode,
	attendance,
}) => {
	if (!selectedDay) return null;

	const selectedDayAttendance = attendance.find((a) =>
		isSameDay(a.date, selectedDay)
	);
	const currentType =
		selectedDayAttendance?.type ||
		(isHoliday(selectedDay, holidays)
			? "holiday"
			: isWeekend(selectedDay)
			? "weekend"
			: "wfh");

	const getButtonStyle = (type) => {
		const baseStyle =
			"flex flex-col items-center justify-center px-3 py-3 border text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer";

		const activeStyles = {
			office: isDarkMode
				? "border-emerald-500 bg-emerald-900/40 text-emerald-300 ring-2 ring-emerald-500"
				: "border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500",
			wfh: isDarkMode
				? "border-blue-500 bg-blue-900/40 text-blue-300 ring-2 ring-blue-500"
				: "border-blue-500 bg-blue-100 text-blue-800 ring-2 ring-blue-500",
			leave: isDarkMode
				? "border-amber-500 bg-amber-900/40 text-amber-300 ring-2 ring-amber-500"
				: "border-amber-500 bg-amber-100 text-amber-800 ring-2 ring-amber-500",
			holiday: "",
			weekend: "",
		};

		const inactiveStyles = {
			office: isDarkMode
				? "border-emerald-800 bg-emerald-900/20 text-emerald-300 hover:bg-emerald-900/40"
				: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
			wfh: isDarkMode
				? "border-blue-800 bg-blue-900/20 text-blue-300 hover:bg-blue-900/40"
				: "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100",
			leave: isDarkMode
				? "border-amber-800 bg-amber-900/20 text-amber-300 hover:bg-amber-900/40"
				: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100",
			holiday: "",
			weekend: "",
		};

		return `${baseStyle} ${
			currentType === type ? activeStyles[type] : inactiveStyles[type]
		}`;
	};

	const getModalBgStyle = () => {
		return isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
	};

	return (
		<div
			className="fixed inset-0 z-50 overflow-y-auto"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div
					className={`fixed inset-0  ${
						isDarkMode
							? "bg-gray-900 bg-opacity-75"
							: "bg-gray-500 bg-opacity-75"
					} transition-opacity`}
					aria-hidden="true"
					onClick={() => setSelectedDay(null)}
				></div>

				<span
					className="hidden sm:inline-block sm:align-middle sm:h-screen"
					aria-hidden="true"
				>
					&#8203;
				</span>

				<div
					className={`inline-block align-bottom ${getModalBgStyle()} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="sm:flex sm:items-start">
							<div
								className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
									isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
								} sm:mx-0 sm:h-10 sm:w-10`}
							>
								<Calendar
									className={`h-6 w-6 ${
										isDarkMode ? "text-blue-400" : "text-blue-600"
									}`}
								/>
							</div>
							<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
								<h3
									className={`text-lg leading-6 font-medium ${
										isDarkMode ? "text-white" : "text-gray-900"
									}`}
									id="modal-title"
								>
									{formatDate(selectedDay)}
								</h3>

								{}
								{!isWeekend(selectedDay) &&
									!isSettingHoliday &&
									!isHoliday(selectedDay, holidays) && (
										<div className="mt-2">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													isDarkMode
														? "bg-gray-700 text-gray-200"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												Current status:{" "}
												{currentType === "office"
													? "In Office"
													: currentType === "wfh"
													? "Working From Home"
													: currentType === "leave"
													? "On Leave"
													: "Not Set"}
											</span>
										</div>
									)}

								{isWeekend(selectedDay) ? (
									<div className="mt-4">
										<div
											className={`flex items-center justify-center p-4 ${
												isDarkMode ? "bg-gray-700" : "bg-gray-50"
											} rounded-lg`}
										>
											<p
												className={`text-sm ${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												This is a weekend day and cannot be edited.
											</p>
										</div>
									</div>
								) : isSettingHoliday ? (
									<div className="mt-4">
										<div className="mb-4">
											<label
												htmlFor="holidayName"
												className={`block text-sm font-medium ${
													isDarkMode ? "text-gray-300" : "text-gray-700"
												} mb-1`}
											>
												Holiday Name
											</label>
											<input
												type="text"
												id="holidayName"
												value={holidayName}
												onChange={(e) => setHolidayName(e.target.value)}
												className={`mt-1 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm ${
													isDarkMode
														? "border-gray-600 bg-gray-700 text-white"
														: "border-gray-300 text-gray-900"
												} rounded-md p-2`}
												placeholder="E.g., Independence Day"
											/>
										</div>
									</div>
								) : (
									<div className="mt-4 space-y-4">
										<div>
											<label
												className={`block text-sm font-medium ${
													isDarkMode ? "text-gray-300" : "text-gray-700"
												} mb-2`}
											>
												Attendance Type
											</label>
											<div className="grid grid-cols-3 gap-3">
												<button
													onClick={() => updateAttendance("office")}
													className={getButtonStyle("office")}
												>
													<Briefcase className="h-6 w-6 mb-1" />
													Office
												</button>
												<button
													onClick={() => updateAttendance("wfh")}
													className={getButtonStyle("wfh")}
												>
													<Home className="h-6 w-6 mb-1" />
													WFH
												</button>
												<button
													onClick={() => updateAttendance("leave")}
													className={getButtonStyle("leave")}
												>
													<Coffee className="h-6 w-6 mb-1" />
													Leave
												</button>
											</div>
										</div>

										<div>
											<label
												htmlFor="notes"
												className={`block text-sm font-medium ${
													isDarkMode ? "text-gray-300" : "text-gray-700"
												} mb-2`}
											>
												Notes
											</label>
											<textarea
												id="notes"
												rows={3}
												value={noteText}
												onChange={(e) => setNoteText(e.target.value)}
												className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${
													isDarkMode
														? "border-gray-600 bg-gray-700 text-white"
														: "border-gray-300 text-gray-900"
												} rounded-md p-2`}
												placeholder="Add any notes for this day..."
											/>
										</div>

										<div>
											<button
												onClick={() => {
													setIsSettingHoliday(true);
													setHolidayName("");
												}}
												className={`text-sm ${
													isDarkMode
														? "text-purple-400 hover:text-purple-300"
														: "text-purple-600 hover:text-purple-800"
												} cursor-pointer`}
											>
												Mark as holiday instead
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div
						className={`${
							isDarkMode ? "bg-gray-700" : "bg-gray-50"
						} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}
					>
						{isWeekend(selectedDay) ? (
							<button
								type="button"
								className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150 cursor-pointer"
								onClick={() => setSelectedDay(null)}
							>
								Close
							</button>
						) : isSettingHoliday ? (
							<>
								<button
									type="button"
									className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150 cursor-pointer"
									onClick={handleHolidayUpdate}
								>
									{isHoliday(selectedDay, holidays)
										? "Update Holiday"
										: "Set Holiday"}
								</button>

								{isHoliday(selectedDay, holidays) && (
									<button
										type="button"
										className={`mt-3 w-full inline-flex justify-center rounded-lg border ${
											isDarkMode
												? "border-gray-600 bg-gray-800 text-red-400 hover:bg-gray-700"
												: "border-gray-300 bg-white text-red-700 hover:bg-gray-50"
										} shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150 cursor-pointer`}
										onClick={deleteHoliday}
									>
										Delete Holiday
									</button>
								)}

								<button
									type="button"
									className={`mt-3 w-full inline-flex justify-center rounded-lg border ${
										isDarkMode
											? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
											: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
									} shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150 cursor-pointer`}
									onClick={() => {
										setIsSettingHoliday(false);
										setHolidayName("");
									}}
								>
									Cancel
								</button>
							</>
						) : (
							<>
								<button
									type="button"
									className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150 cursor-pointer"
									onClick={() => setSelectedDay(null)}
								>
									Save & Close
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const AttendanceTracker = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [currentUser, setCurrentUser] = useState({
		id: 1,
		name: "Sarah Johnson",
		role: "Product Manager",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
		department: "Product",
		email: "sarah.johnson@company.com",
	});
	const [today] = useState(new Date());
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
	const [attendance, setAttendance] = useState([]);
	const [holidays, setHolidays] = useState([
		{ date: new Date(2025, 4, 1), name: "Labor Day" },
		{ date: new Date(2025, 4, 26), name: "Memorial Day" },
		{ date: new Date(2025, 6, 4), name: "Independence Day" },
		{ date: new Date(2025, 8, 1), name: "Labor Day" },
		{ date: new Date(2025, 10, 11), name: "Veterans Day" },
		{ date: new Date(2025, 10, 27), name: "Thanksgiving" },
		{ date: new Date(2025, 11, 25), name: "Christmas" },
	]);
	const [alerts, setAlerts] = useState([]);
	const [activeTab, setActiveTab] = useState("dashboard");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [noteText, setNoteText] = useState("");
	const [selectedDay, setSelectedDay] = useState(null);
	const [showNotification, setShowNotification] = useState(false);
	const [activeAnalyticsView, setActiveAnalyticsView] = useState("monthly");
	const [dataLoading, setDataLoading] = useState(true);
	const [isSettingHoliday, setIsSettingHoliday] = useState(false);
	const [holidayName, setHolidayName] = useState("");
	const [alertSent, setAlertSent] = useState(false);

	const initialTeamMembers = [
		{
			id: 1,
			name: "Sarah Johnson",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
			role: "Product Manager",
			status: "office",
		},
		{
			id: 2,
			name: "Michael Chen",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
			role: "Software Engineer",
			status: "wfh",
		},
		{
			id: 3,
			name: "Emily Rodriguez",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
			role: "UI/UX Designer",
			status: "office",
		},
		{
			id: 4,
			name: "David Kim",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
			role: "Frontend Developer",
			status: "wfh",
		},
		{
			id: 5,
			name: "Alex Morgan",
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
			role: "Data Scientist",
			status: "leave",
		},
	];

	const initialActivities = [
		{
			id: "activity-1",
			user: "Sarah Johnson",
			action: "Updated attendance to 'Office' for today.",
			date: new Date(2025, 4, 10, 9, 15),
			icon: <Briefcase className="h-4 w-4 text-emerald-500" />,
		},
		{
			id: "activity-2",
			user: "System",
			action:
				"Reminder: You have reached 60% of your monthly office attendance target.",
			date: new Date(2025, 4, 9, 16, 30),
			icon: <Bell className="h-4 w-4 text-amber-500" />,
		},
		{
			id: "activity-3",
			user: "Emily Rodriguez",
			action: "Requested your approval for leave next Friday.",
			date: new Date(2025, 4, 9, 11, 45),
			icon: <Calendar className="h-4 w-4 text-purple-500" />,
		},
		{
			id: "activity-4",
			user: "System",
			action: "Monthly attendance report for April is now available.",
			date: new Date(2025, 4, 8, 8, 0),
			icon: <BarChart2 className="h-4 w-4 text-blue-500" />,
		},
	];

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
		if (!isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	useEffect(() => {
		const prefersDarkMode = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setIsDarkMode(prefersDarkMode);
		if (prefersDarkMode) {
			document.documentElement.classList.add("dark");
		}
	}, []);

	useEffect(() => {
		const initialAttendance = [];
		const today = new Date();

		for (let month = 1; month >= 0; month--) {
			const monthToPopulate = today.getMonth() - month;
			const yearToPopulate = today.getFullYear();

			const adjustedMonth =
				monthToPopulate < 0 ? 12 + monthToPopulate : monthToPopulate;

			const adjustedYear =
				monthToPopulate < 0 ? yearToPopulate - 1 : yearToPopulate;

			const monthDays = getDaysInMonth(adjustedYear, adjustedMonth);

			monthDays.forEach((date) => {
				if (
					date.getTime() <= today.getTime() &&
					!isWeekend(date) &&
					!isHoliday(date, holidays)
				) {
					const rand = Math.random();
					initialAttendance.push({
						date: new Date(date),
						type: rand > 0.6 ? "office" : rand > 0.3 ? "wfh" : "leave",
						notes:
							rand > 0.8 ? "Important meeting" : rand > 0.6 ? "Team sync" : "",
					});
				}
			});
		}

		setAttendance(initialAttendance);
		setDataLoading(false);
	}, []);

	const createAlert = (message, type) => {
		const newAlert = {
			id: `alert-${Date.now()}`,
			type,
			message,
			date: new Date(),
		};

		setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
		setShowNotification(true);

		setTimeout(() => {
			setShowNotification(false);
		}, 3000);
	};

	const calculateMonthlySummary = useCallback(
		(year, month) => {
			const days = getDaysInMonth(year, month);
			let officeDays = 0;
			let wfhDays = 0;
			let leaveDays = 0;
			let holidayDays = 0;
			let weekendDays = 0;

			days.forEach((date) => {
				const type = getAttendanceType(date, attendance, holidays);

				switch (type) {
					case "office":
						officeDays++;
						break;
					case "wfh":
						wfhDays++;
						break;
					case "leave":
						leaveDays++;
						break;
					case "holiday":
						holidayDays++;
						break;
					case "weekend":
						weekendDays++;
						break;
				}
			});

			const totalDays = days.length;
			const workingDays = totalDays - weekendDays - holidayDays;
			const officePercentage =
				workingDays > 0 ? (officeDays / workingDays) * 100 : 0;

			return {
				totalDays,
				workingDays,
				officeDays,
				wfhDays,
				leaveDays,
				holidayDays,
				weekendDays,
				officePercentage,
			};
		},
		[attendance, holidays]
	);

	useEffect(() => {
		if (dataLoading) return;

		const currentSummary = calculateMonthlySummary(selectedYear, selectedMonth);
		const { officePercentage, workingDays, officeDays } = currentSummary;

		const today = new Date();
		if (
			selectedYear === today.getFullYear() &&
			selectedMonth === today.getMonth()
		) {
			const requiredOfficePercentage = 40;

			if (officePercentage < requiredOfficePercentage && !alertSent) {
				const requiredOfficeDays = Math.ceil(
					workingDays * (requiredOfficePercentage / 100)
				);
				const remainingOfficeDays = requiredOfficeDays - officeDays;

				if (remainingOfficeDays > 0) {
					createAlert(
						`You need ${remainingOfficeDays} more office day${
							remainingOfficeDays > 1 ? "s" : ""
						} to meet the 40% requirement this month.`,
						remainingOfficeDays > 2 ? "warning" : "danger"
					);
					setAlertSent(true);
				}
			} else if (
				officePercentage >= requiredOfficePercentage &&
				alerts.length === 0
			) {
				createAlert(
					`Great job! You've met the 40% office attendance requirement for this month.`,
					"success"
				);
			}
		}
	}, [
		dataLoading,
		calculateMonthlySummary,
		selectedYear,
		selectedMonth,
		alerts,
		alertSent,
	]);

	const calendarDays = useMemo(() => {
		const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
		const startingDayOfWeek = firstDayOfMonth.getDay();
		const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();

		const prevMonthDays = Array.from(
			{ length: startingDayOfWeek },
			(_, index) => {
				const day = daysInPrevMonth - startingDayOfWeek + index + 1;
				return new Date(
					selectedYear,
					selectedMonth - 1 < 0 ? 11 : selectedMonth - 1,
					day
				);
			}
		);

		const currentMonthDays = getDaysInMonth(selectedYear, selectedMonth);

		const totalCells = 42;
		const nextMonthDaysCount =
			totalCells - prevMonthDays.length - currentMonthDays.length;
		const nextMonthDays = Array.from(
			{ length: nextMonthDaysCount },
			(_, index) => {
				return new Date(
					selectedYear,
					selectedMonth + 1 > 11 ? 0 : selectedMonth + 1,
					index + 1
				);
			}
		);

		return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
	}, [selectedYear, selectedMonth]);

	const goToPreviousMonth = () => {
		if (selectedMonth === 0) {
			setSelectedMonth(11);
			setSelectedYear(selectedYear - 1);
		} else {
			setSelectedMonth(selectedMonth - 1);
		}
		setSelectedDay(null);
	};

	const goToNextMonth = () => {
		if (selectedMonth === 11) {
			setSelectedMonth(0);
			setSelectedYear(selectedYear + 1);
		} else {
			setSelectedMonth(selectedMonth + 1);
		}
		setSelectedDay(null);
	};

	const handleDayClick = (day) => {
		setSelectedDay(day);

		const existingRecord = attendance.find((a) => isSameDay(a.date, day));
		setNoteText(existingRecord?.notes || "");
		setIsSettingHoliday(!!isHoliday(day, holidays));

		const holiday = isHoliday(day, holidays);
		if (holiday) {
			setHolidayName(holiday.name);
		} else {
			setHolidayName("");
		}
	};

	const getAttendanceType = (date, attendance, holidays) => {
		const record = attendance.find((a) => isSameDay(a.date, date));
		if (record) {
			return record.type;
		}

		if (isWeekend(date)) {
			return "weekend";
		}

		if (isHoliday(date, holidays)) {
			return "holiday";
		}

		return "wfh";
	};

	const updateAttendance = (type) => {
		if (!selectedDay) return;

		const updatedAttendance = attendance.filter(
			(a) => !isSameDay(a.date, selectedDay)
		);

		if (type !== "weekend" && type !== "holiday") {
			updatedAttendance.push({
				date: new Date(selectedDay),
				type,
				notes: noteText,
			});
		}

		setAttendance(updatedAttendance);

		createAlert(
			`Day marked as ${
				type === "office"
					? "Office"
					: type === "wfh"
					? "Working From Home"
					: "Leave"
			}`,
			"success"
		);

		setAlertSent(false);
	};

	const handleHolidayUpdate = () => {
		if (!selectedDay || !holidayName.trim()) return;

		if (isSettingHoliday) {
			const existingHoliday = holidays.find((h) =>
				isSameDay(h.date, selectedDay)
			);

			if (!existingHoliday) {
				setHolidays([
					...holidays,
					{ date: new Date(selectedDay), name: holidayName },
				]);
			} else {
				const updatedHolidays = holidays.map((h) =>
					isSameDay(h.date, selectedDay) ? { ...h, name: holidayName } : h
				);
				setHolidays(updatedHolidays);
			}

			setAttendance(attendance.filter((a) => !isSameDay(a.date, selectedDay)));

			createAlert(`Holiday "${holidayName}" set successfully`, "success");
		} else {
			setHolidays(holidays.filter((h) => !isSameDay(h.date, selectedDay)));
		}

		setSelectedDay(null);
		setHolidayName("");
		setIsSettingHoliday(false);

		setAlertSent(false);
	};

	const deleteHoliday = () => {
		if (!selectedDay) return;

		setHolidays(holidays.filter((h) => !isSameDay(h.date, selectedDay)));

		createAlert("Holiday removed successfully", "success");

		setSelectedDay(null);
		setHolidayName("");
		setIsSettingHoliday(false);

		setAlertSent(false);
	};

	const monthlyChartData = useMemo(() => {
		if (dataLoading) return [];

		const summary = calculateMonthlySummary(selectedYear, selectedMonth);

		return [
			{ name: "Office", value: summary.officeDays },
			{ name: "WFH", value: summary.wfhDays },
			{ name: "Leave", value: summary.leaveDays },
		];
	}, [dataLoading, calculateMonthlySummary, selectedYear, selectedMonth]);

	const yearlyChartData = useMemo(() => {
		if (dataLoading) return [];

		const months = [];

		for (let month = 0; month < 12; month++) {
			const summary = calculateMonthlySummary(selectedYear, month);
			months.push({
				name: new Date(selectedYear, month, 1).toLocaleString("default", {
					month: "short",
				}),
				office: summary.officeDays,
				wfh: summary.wfhDays,
				leave: summary.leaveDays,
				officePercentage: summary.officePercentage,
			});
		}

		return months;
	}, [dataLoading, calculateMonthlySummary, selectedYear]);

	const getDayStyle = (day) => {
		const isCurrentMonth = day.getMonth() === selectedMonth;
		const isToday = isSameDay(day, new Date());
		const dayHoliday = isHoliday(day, holidays);
		const isDaySelected = selectedDay && isSameDay(day, selectedDay);
		const attendanceType = getAttendanceType(day, attendance, holidays);

		let bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
		let textColor = isDarkMode ? "text-white" : "text-gray-900";
		let borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

		if (!isCurrentMonth) {
			textColor = isDarkMode ? "text-gray-600" : "text-gray-400";
			bgColor = isDarkMode ? "bg-gray-800/50" : "bg-gray-50";
		}

		if (isToday) {
			borderColor = isDarkMode ? "border-blue-400" : "border-blue-500";
		}

		if (isDaySelected) {
			bgColor = isDarkMode ? "bg-blue-900/30" : "bg-blue-50";
			borderColor = isDarkMode ? "border-blue-400" : "border-blue-500";
		}

		if (isWeekend(day)) {
			bgColor = isDarkMode ? "bg-gray-800/80" : "bg-gray-100";
			textColor = isDarkMode ? "text-gray-400" : "text-gray-500";
		}

		if (dayHoliday) {
			bgColor = isDarkMode ? "bg-purple-900/20" : "bg-purple-50";
			textColor = isDarkMode ? "text-purple-300" : "text-purple-700";
		}

		const typeStyles = {
			office: isDarkMode
				? "bg-emerald-900/30 text-emerald-300"
				: "bg-emerald-100 text-emerald-800",
			wfh: isDarkMode
				? "bg-blue-900/30 text-blue-300"
				: "bg-blue-100 text-blue-800",
			leave: isDarkMode
				? "bg-amber-900/30 text-amber-300"
				: "bg-amber-100 text-amber-800",
			holiday: isDarkMode
				? "bg-purple-900/30 text-purple-300"
				: "bg-purple-100 text-purple-800",
			weekend: isDarkMode
				? "bg-gray-800/80 text-gray-400"
				: "bg-gray-100 text-gray-500",
		};

		if (!isWeekend(day) && !dayHoliday && isCurrentMonth) {
			bgColor = typeStyles[attendanceType] || bgColor;
		}

		return {
			cell: `relative h-14 sm:h-24 p-1 border ${borderColor} ${bgColor} transition-colors duration-200 hover:bg-opacity-80 cursor-pointer`,
			text: `text-sm ${textColor} ${isToday ? "font-bold" : ""}`,
			badge: {
				office: isDarkMode ? "bg-emerald-500" : "bg-emerald-500",
				wfh: isDarkMode ? "bg-blue-500" : "bg-blue-500",
				leave: isDarkMode ? "bg-amber-500" : "bg-amber-500",
				holiday: isDarkMode ? "bg-purple-500" : "bg-purple-500",
				weekend: isDarkMode ? "bg-gray-400" : "bg-gray-400",
			}[attendanceType],
		};
	};

	const currentMonthSummary = useMemo(() => {
		return calculateMonthlySummary(selectedYear, selectedMonth);
	}, [calculateMonthlySummary, selectedYear, selectedMonth]);

	if (dataLoading) {
		return <LoadingSpinner isDarkMode={isDarkMode} />; // Pass the prop
	}

	return (
		<div
			className={`min-h-screen ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
			} flex flex-col`}
		>
			{}
			<Header
				currentUser={currentUser}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				mobileMenuOpen={mobileMenuOpen}
				setMobileMenuOpen={setMobileMenuOpen}
				isDarkMode={isDarkMode}
				toggleDarkMode={toggleDarkMode}
				createAlert={createAlert}
			/>

			{}
			{mobileMenuOpen && (
				<MobileMenu
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					currentUser={currentUser}
					setMobileMenuOpen={setMobileMenuOpen}
					isDarkMode={isDarkMode}
					createAlert={createAlert}
				/>
			)}

			{}
			<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
				{}
				{showNotification && alerts.length > 0 && (
					<Notification
						alert={alerts[0]}
						onClose={() => setShowNotification(false)}
						isDarkMode={isDarkMode} // Pass the prop
					/>
				)}

				{}
				{activeTab === "dashboard" && (
					<DashboardView
						currentUser={currentUser}
						currentMonthSummary={currentMonthSummary}
						yearlyChartData={yearlyChartData}
						teamMembers={initialTeamMembers}
						activities={initialActivities}
						selectedDay={selectedDay}
						setSelectedDay={setSelectedDay}
						updateAttendance={updateAttendance}
						attendance={attendance}
						today={today}
						setActiveTab={setActiveTab}
						isDarkMode={isDarkMode}
						createAlert={createAlert}
					/>
				)}

				{}
				{activeTab === "calendar" && (
					<CalendarView
						selectedYear={selectedYear}
						selectedMonth={selectedMonth}
						goToPreviousMonth={goToPreviousMonth}
						goToNextMonth={goToNextMonth}
						calendarDays={calendarDays}
						handleDayClick={handleDayClick}
						getDayStyle={getDayStyle}
						currentMonthSummary={currentMonthSummary}
						formatShortDay={formatShortDay}
						isHoliday={isHoliday}
						holidays={holidays}
						isWeekend={isWeekend}
						updateAttendance={updateAttendance}
						selectedDay={selectedDay}
						setSelectedDay={setSelectedDay}
						savedAttendance={attendance}
						today={today}
						isDarkMode={isDarkMode}
						createAlert={createAlert}
					/>
				)}

				{}
				{activeTab === "analytics" && (
					<AnalyticsView
						activeAnalyticsView={activeAnalyticsView}
						setActiveAnalyticsView={setActiveAnalyticsView}
						monthlyChartData={monthlyChartData}
						yearlyChartData={yearlyChartData}
						selectedYear={selectedYear}
						isDarkMode={isDarkMode}
						createAlert={createAlert}
					/>
				)}

				{}
				{activeTab === "settings" && (
					<SettingsView
						holidays={holidays}
						selectedDay={selectedDay}
						setSelectedDay={setSelectedDay}
						formatDate={formatDate}
						holidayName={holidayName}
						setHolidayName={setHolidayName}
						isSettingHoliday={isSettingHoliday}
						setIsSettingHoliday={setIsSettingHoliday}
						handleHolidayUpdate={handleHolidayUpdate}
						deleteHoliday={deleteHoliday}
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
						selectedYear={selectedYear}
						selectedMonth={selectedMonth}
						createAlert={createAlert}
						isDarkMode={isDarkMode}
						toggleDarkMode={toggleDarkMode}
					/>
				)}
			</main>

			{}
			<DayModal
				selectedDay={selectedDay}
				setSelectedDay={setSelectedDay}
				formatDate={formatDate}
				isWeekend={isWeekend}
				isSettingHoliday={isSettingHoliday}
				setIsSettingHoliday={setIsSettingHoliday}
				holidayName={holidayName}
				setHolidayName={setHolidayName}
				noteText={noteText}
				setNoteText={setNoteText}
				updateAttendance={updateAttendance}
				handleHolidayUpdate={handleHolidayUpdate}
				isHoliday={isHoliday}
				holidays={holidays}
				deleteHoliday={deleteHoliday}
				isDarkMode={isDarkMode}
				attendance={attendance}
			/>

			{}
			<Footer isDarkMode={isDarkMode} createAlert={createAlert} />

			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

				:root {
					--font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
						"Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
						"Helvetica Neue", sans-serif;
				}

				* {
					box-sizing: border-box;
					font-family: var(--font-family);
				}

				html {
					height: 100%;
				}

				body {
					margin: 0;
					padding: 0;
					height: 100%;
				}

				.dark {
					color-scheme: dark;
				}

				@keyframes fade-in-down {
					0% {
						opacity: 0;
						transform: translateY(-10px);
					}
					100% {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in-down {
					animation: fade-in-down 0.3s ease-out forwards;
				}

				::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}

				::-webkit-scrollbar-track {
					background: transparent;
				}

				::-webkit-scrollbar-thumb {
					background: #cbd5e1;
					border-radius: 4px;
				}

				.dark ::-webkit-scrollbar-thumb {
					background: #475569;
				}

				::-webkit-scrollbar-thumb:hover {
					background: #94a3b8;
				}

				.dark ::-webkit-scrollbar-thumb:hover {
					background: #64748b;
				}
			`}</style>
		</div>
	);
};

const CalendarView = ({
	selectedYear,
	selectedMonth,
	goToPreviousMonth,
	goToNextMonth,
	calendarDays,
	handleDayClick,
	getDayStyle,
	currentMonthSummary,
	formatShortDay,
	isHoliday,
	holidays,
	isWeekend,
	updateAttendance,
	selectedDay,
	setSelectedDay,
	savedAttendance,
	today,
	isDarkMode,
	createAlert,
}) => {
	const todayAttendance = savedAttendance.find((a) => isSameDay(a.date, today));
	const todayType = todayAttendance ? todayAttendance.type : "wfh";

	const handleNotImplemented = () => {
		createAlert("This feature is coming soon!", "info");
	};

	const getCardBgStyle = () => {
		return isDarkMode
			? "bg-gray-800 border-gray-700"
			: "bg-white border-gray-200";
	};

	const getStatusStyle = (status) => {
		if (status === "office") {
			return isDarkMode
				? "bg-emerald-900 text-emerald-200"
				: "bg-emerald-100 text-emerald-800";
		} else if (status === "wfh") {
			return isDarkMode
				? "bg-blue-900 text-blue-200"
				: "bg-blue-100 text-blue-800";
		} else if (status === "leave") {
			return isDarkMode
				? "bg-amber-900 text-amber-200"
				: "bg-amber-100 text-amber-800";
		} else {
			return isDarkMode
				? "bg-purple-900 text-purple-200"
				: "bg-purple-100 text-purple-800";
		}
	};

	return (
		<div className="space-y-6">
			{}
			<div
				className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
			>
				<div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
					<div className="flex items-center">
						<h2
							className={`text-xl md:text-2xl font-bold ${
								isDarkMode ? "text-white" : "text-gray-900"
							}`}
						>
							{formatMonth(new Date(selectedYear, selectedMonth))}
						</h2>
						<div className="ml-4 flex space-x-2">
							<button
								onClick={goToPreviousMonth}
								className={`p-1.5 rounded-full ${
									isDarkMode
										? "text-gray-300 hover:bg-gray-700"
										: "text-gray-600 hover:bg-gray-100"
								} transition-colors duration-150 cursor-pointer`}
							>
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								onClick={goToNextMonth}
								className={`p-1.5 rounded-full ${
									isDarkMode
										? "text-gray-300 hover:bg-gray-700"
										: "text-gray-600 hover:bg-gray-100"
								} transition-colors duration-150 cursor-pointer`}
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
						<div className="flex items-center">
							<div className="h-3 w-3 bg-emerald-500 rounded-full mr-2"></div>
							<span
								className={`text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-600"
								}`}
							>
								Office
							</span>
						</div>
						<div className="flex items-center">
							<div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
							<span
								className={`text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-600"
								}`}
							>
								WFH
							</span>
						</div>
						<div className="flex items-center">
							<div className="h-3 w-3 bg-amber-500 rounded-full mr-2"></div>
							<span
								className={`text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-600"
								}`}
							>
								Leave
							</span>
						</div>
						<div className="flex items-center">
							<div className="h-3 w-3 bg-purple-500 rounded-full mr-2"></div>
							<span
								className={`text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-600"
								}`}
							>
								Holiday
							</span>
						</div>
					</div>
				</div>

				{}
				<div
					className={`grid grid-cols-7 gap-px ${
						isDarkMode ? "bg-gray-700" : "bg-gray-200"
					} border-t border-b ${
						isDarkMode ? "border-gray-700" : "border-gray-200"
					}`}
				>
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
						(day, index) => (
							<div
								key={day}
								className={`${
									isDarkMode ? "bg-gray-800" : "bg-gray-50"
								} py-2 text-center text-sm font-medium ${
									index === 0 || index === 6
										? "text-red-500 "
										: isDarkMode
										? "text-gray-400"
										: "text-gray-500"
								}`}
							>
								{day}
							</div>
						)
					)}
				</div>

				{}
				<div
					className={`grid grid-cols-7 gap-px ${
						isDarkMode ? "bg-gray-700" : "bg-gray-200"
					}`}
				>
					{calendarDays.map((day, index) => {
						const dayStyles = getDayStyle(day);
						const isCurrentMonth = day.getMonth() === selectedMonth;
						const isWeekendDay = isWeekend(day);
						const dayHoliday = isHoliday(day, holidays);
						const isTodayDate = isSameDay(day, today);

						return (
							<div
								key={`day-${index}`}
								className={`${dayStyles.cell} ${
									isTodayDate ? "ring-2 ring-blue-500" : ""
								}`}
								onClick={() => handleDayClick(day)}
							>
								<div className="flex justify-between">
									<span className={dayStyles.text}>{formatShortDay(day)}</span>
									{isCurrentMonth && !isWeekendDay && !dayHoliday && (
										<span
											className={`h-2 w-2 rounded-full ${dayStyles.badge} transition-all duration-200`}
										></span>
									)}
								</div>

								{}
								{dayHoliday && (
									<div
										className={`mt-1 text-xs ${
											isDarkMode ? "text-purple-400" : "text-purple-700"
										} font-medium truncate`}
									>
										{dayHoliday.name}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{}
				<div
					className={`md:col-span-2 ${getCardBgStyle()} rounded-xl shadow-sm border p-5`}
				>
					<div className="flex items-center justify-between mb-4">
						<h3
							className={`text-lg font-semibold ${
								isDarkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Office Attendance Progress
						</h3>
						<div
							className={`p-1.5 rounded-full ${
								isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
							}`}
						>
							<Briefcase
								className={`h-5 w-5 ${
									isDarkMode ? "text-blue-400" : "text-blue-600"
								}`}
							/>
						</div>
					</div>

					<p
						className={`text-sm ${
							isDarkMode ? "text-gray-400" : "text-gray-600"
						} mb-4`}
					>
						You need to spend at least 40% of working days in the office
					</p>

					<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 space-y-3 sm:space-y-0">
						<div>
							<span
								className={`text-3xl font-bold ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								{currentMonthSummary.officePercentage.toFixed(1)}%
							</span>
							<span
								className={`ml-2 text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								({currentMonthSummary.officeDays} of{" "}
								{currentMonthSummary.workingDays} days)
							</span>
						</div>
						<div className="text-right">
							<span
								className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
									currentMonthSummary.officePercentage >= 40
										? isDarkMode
											? "bg-emerald-900 text-emerald-200"
											: "bg-emerald-100 text-emerald-800"
										: isDarkMode
										? "bg-amber-900 text-amber-200"
										: "bg-amber-100 text-amber-800"
								}`}
							>
								{currentMonthSummary.officePercentage >= 40
									? "Target met"
									: "Target not met yet"}
							</span>
						</div>
					</div>

					<ProgressBar percentage={currentMonthSummary.officePercentage} />

					{}
					<div className="mt-6 grid grid-cols-3 gap-3">
						<div
							className={`${
								isDarkMode ? "bg-gray-900/50" : "bg-gray-50"
							} rounded-lg p-3 text-center`}
						>
							<p
								className={`text-xs ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Office Days
							</p>
							<p
								className={`mt-1 text-xl font-bold ${
									isDarkMode ? "text-emerald-400" : "text-emerald-600"
								}`}
							>
								{currentMonthSummary.officeDays}
							</p>
						</div>
						<div
							className={`${
								isDarkMode ? "bg-gray-900/50" : "bg-gray-50"
							} rounded-lg p-3 text-center`}
						>
							<p
								className={`text-xs ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								WFH Days
							</p>
							<p
								className={`mt-1 text-xl font-bold ${
									isDarkMode ? "text-blue-400" : "text-blue-600"
								}`}
							>
								{currentMonthSummary.wfhDays}
							</p>
						</div>
						<div
							className={`${
								isDarkMode ? "bg-gray-900/50" : "bg-gray-50"
							} rounded-lg p-3 text-center`}
						>
							<p
								className={`text-xs ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Leave Days
							</p>
							<p
								className={`mt-1 text-xl font-bold ${
									isDarkMode ? "text-amber-400" : "text-amber-600"
								}`}
							>
								{currentMonthSummary.leaveDays}
							</p>
						</div>
					</div>

					{}
					{currentMonthSummary.officePercentage < 40 && (
						<div
							className={`mt-4 p-3 ${
								isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
							} rounded-lg`}
						>
							<div className="flex items-start">
								<Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
								<p
									className={`text-sm ${
										isDarkMode ? "text-blue-200" : "text-blue-800"
									}`}
								>
									You need{" "}
									{Math.ceil(currentMonthSummary.workingDays * 0.4) -
										currentMonthSummary.officeDays}{" "}
									more office day
									{Math.ceil(currentMonthSummary.workingDays * 0.4) -
										currentMonthSummary.officeDays >
									1
										? "s"
										: ""}{" "}
									to reach your 40% target this month.
								</p>
							</div>
						</div>
					)}
				</div>

				{}
				<div className={`${getCardBgStyle()} rounded-xl shadow-sm border p-5`}>
					<h3
						className={`text-lg font-semibold ${
							isDarkMode ? "text-white" : "text-gray-900"
						} mb-4`}
					>
						Quick Actions
					</h3>

					<div className="space-y-4">
						<p
							className={`text-sm ${
								isDarkMode ? "text-gray-400" : "text-gray-600"
							}`}
						>
							Your status today is:
							<span
								className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
									todayType
								)}`}
							>
								{todayType === "office"
									? "In Office"
									: todayType === "wfh"
									? "Working Remotely"
									: "On Leave"}
							</span>
						</p>

						<div
							className={`border-t ${
								isDarkMode ? "border-gray-700" : "border-gray-200"
							} pt-4`}
						>
							<p
								className={`text-sm font-medium ${
									isDarkMode ? "text-gray-300" : "text-gray-700"
								} mb-3`}
							>
								Update today's status:
							</p>
							<div className="grid grid-cols-1 gap-3">
								<button
									onClick={() => {
										setSelectedDay(today);
										updateAttendance("office");
									}}
									className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150 ${
										isDarkMode ? "focus:ring-offset-gray-900" : ""
									} cursor-pointer`}
								>
									<Briefcase className="h-4 w-4 mr-2" />
									Mark as Office
								</button>

								<button
									onClick={() => {
										setSelectedDay(today);
										updateAttendance("wfh");
									}}
									className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${
										isDarkMode ? "focus:ring-offset-gray-900" : ""
									} cursor-pointer`}
								>
									<Home className="h-4 w-4 mr-2" />
									Mark as WFH
								</button>

								<button
									onClick={() => {
										setSelectedDay(today);
										updateAttendance("leave");
									}}
									className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-150 ${
										isDarkMode ? "focus:ring-offset-gray-900" : ""
									} cursor-pointer`}
								>
									<Coffee className="h-4 w-4 mr-2" />
									Mark as Leave
								</button>
							</div>
						</div>

						<div
							className={`border-t ${
								isDarkMode ? "border-gray-700" : "border-gray-200"
							} pt-4`}
						>
							<p
								className={`text-sm font-medium ${
									isDarkMode ? "text-gray-300" : "text-gray-700"
								} mb-2`}
							>
								Looking ahead:
							</p>
							<div className="grid grid-cols-2 gap-2">
								<button
									className={`flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg ${
										isDarkMode
											? "text-gray-200 bg-gray-700 hover:bg-gray-600"
											: "text-gray-700 bg-gray-100 hover:bg-gray-200"
									} transition-colors duration-150 cursor-pointer`}
									onClick={handleNotImplemented}
								>
									Request Leave
								</button>
								<button
									className={`flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg ${
										isDarkMode
											? "text-gray-200 bg-gray-700 hover:bg-gray-600"
											: "text-gray-700 bg-gray-100 hover:bg-gray-200"
									} transition-colors duration-150 cursor-pointer`}
									onClick={handleNotImplemented}
								>
									View Holidays
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{}
			<div
				className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
			>
				<div
					className={`p-5 border-b ${
						isDarkMode ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<h3
						className={`text-lg font-semibold ${
							isDarkMode ? "text-white" : "text-gray-900"
						}`}
					>
						Monthly Breakdown
					</h3>
				</div>
				<div className="p-5">
					<div className="overflow-x-auto">
						<table
							className={`min-w-full divide-y ${
								isDarkMode ? "divide-gray-700" : "divide-gray-200"
							}  `}
						>
							<thead>
								<tr>
									<th
										className={`px-6 py-3 text-left text-xs font-medium ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										} uppercase tracking-wider`}
									>
										Week
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										} uppercase tracking-wider`}
									>
										Office Days
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										} uppercase tracking-wider`}
									>
										WFH Days
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										} uppercase tracking-wider`}
									>
										Leave Days
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										} uppercase tracking-wider`}
									>
										Office %
									</th>
								</tr>
							</thead>
							<tbody
								className={`divide-y ${
									isDarkMode ? "divide-gray-700" : "divide-gray-200"
								}`}
							>
								{[1, 2, 3, 4, 5].map((week) => (
									<tr
										key={week}
										className={`${
											isDarkMode ? "hover:bg-gray-900/50" : "hover:bg-gray-50"
										} transition-colors`}
									>
										<td
											className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
												isDarkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Week {week}
										</td>
										<td
											className={`px-6 py-4 whitespace-nowrap text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{Math.floor(Math.random() * 5)}
										</td>
										<td
											className={`px-6 py-4 whitespace-nowrap text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{Math.floor(Math.random() * 5)}
										</td>
										<td
											className={`px-6 py-4 whitespace-nowrap text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{Math.floor(Math.random() * 2)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													Math.random() > 0.5
														? isDarkMode
															? "bg-emerald-900 text-emerald-200"
															: "bg-emerald-100 text-emerald-800"
														: isDarkMode
														? "bg-amber-900 text-amber-200"
														: "bg-amber-100 text-amber-800"
												}`}
											>
												{(Math.random() * 100).toFixed(1)}%
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

const AnalyticsView = ({
	activeAnalyticsView,
	setActiveAnalyticsView,
	monthlyChartData,
	yearlyChartData,
	selectedYear,
	isDarkMode,
	createAlert,
}) => {
	const trendsData = useMemo(() => {
		const trendMonths = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		return trendMonths.map((month, index) => {
			const basePercentage = 35 + Math.random() * 20;
			return {
				name: month,
				officePercentage: basePercentage,
				teamAverage: basePercentage - 5 + Math.random() * 10,
				companyAverage: basePercentage - 10 + Math.random() * 15,
			};
		});
	}, []);

	const handleNotImplemented = () => {
		createAlert("This feature is coming soon!", "info");
	};

	const getCardBgStyle = () => {
		return isDarkMode
			? "bg-gray-800 border-gray-700"
			: "bg-white border-gray-200";
	};

	return (
		<div className="space-y-6">
			<div
				className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
			>
				<div
					className={`p-5 border-b ${
						isDarkMode ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
						<h2
							className={`text-xl font-bold ${
								isDarkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Attendance Analytics
						</h2>

						<div
							className={`flex space-x-2 ${
								isDarkMode ? "bg-gray-700" : "bg-gray-100"
							} p-1 rounded-lg`}
						>
							<button
								onClick={() => setActiveAnalyticsView("monthly")}
								className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 cursor-pointer ${
									activeAnalyticsView === "monthly"
										? isDarkMode
											? "bg-gray-600 text-blue-400"
											: "bg-white text-blue-600 shadow-sm"
										: isDarkMode
										? "text-gray-300 hover:text-white"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								Monthly View
							</button>
							<button
								onClick={() => setActiveAnalyticsView("yearly")}
								className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 cursor-pointer ${
									activeAnalyticsView === "yearly"
										? isDarkMode
											? "bg-gray-600 text-blue-400"
											: "bg-white text-blue-600 shadow-sm"
										: isDarkMode
										? "text-gray-300 hover:text-white"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								Yearly View
							</button>
							<button
								onClick={() => setActiveAnalyticsView("trends")}
								className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 cursor-pointer ${
									activeAnalyticsView === "trends"
										? isDarkMode
											? "bg-gray-600 text-blue-400"
											: "bg-white text-blue-600 shadow-sm"
										: isDarkMode
										? "text-gray-300 hover:text-white"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								Trends
							</button>
						</div>
					</div>
				</div>

				{activeAnalyticsView === "monthly" ? (
					<div className="p-5">
						<div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
							<div className="lg:w-1/2">
								<div className="flex items-center justify-between mb-4">
									<h3
										className={`text-lg font-semibold ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Monthly Attendance Summary
									</h3>
									<div className="flex space-x-2">
										<button
											className={`p-1.5 rounded-md ${
												isDarkMode
													? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
											} cursor-pointer`}
											onClick={handleNotImplemented}
										>
											<Download className="h-4 w-4 text-purple-500" />
										</button>
									</div>
								</div>
								<div className="h-72">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={monthlyChartData}
												cx="50%"
												cy="50%"
												labelLine={false}
												outerRadius={110}
												innerRadius={60}
												fill="#8884d8"
												dataKey="value"
												label={({ name, percent }) =>
													`${name}: ${(percent * 100).toFixed(0)}%`
												}
											>
												{monthlyChartData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<Tooltip
												formatter={(value) => [`${value} days`, ""]}
												contentStyle={{
													backgroundColor: isDarkMode ? "#1f2937" : "white",
													borderRadius: "0.5rem",
													border: isDarkMode
														? "1px solid #374151"
														: "1px solid #e5e7eb",
													color: isDarkMode ? "white" : "black",
												}}
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div className="lg:w-1/2">
								<h3
									className={`text-lg font-semibold ${
										isDarkMode ? "text-white" : "text-gray-900"
									} mb-4`}
								>
									Summary Statistics
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<StatCard
										title="Working Days"
										value={sumBy(monthlyChartData, "value").toString()}
										color={isDarkMode ? "text-white" : "text-gray-900"}
										bgColor={isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}
										icon={
											<Calendar
												className={`h-5 w-5 ${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											/>
										}
									/>
									<StatCard
										title="Office Days"
										value={monthlyChartData[0]?.value.toString() || "0"}
										color={isDarkMode ? "text-emerald-400" : "text-emerald-600"}
										bgColor={isDarkMode ? "bg-emerald-900/20" : "bg-emerald-50"}
										icon={
											<Briefcase
												className={`h-5 w-5 ${
													isDarkMode ? "text-emerald-400" : "text-emerald-500"
												}`}
											/>
										}
									/>
									<StatCard
										title="WFH Days"
										value={monthlyChartData[1]?.value.toString() || "0"}
										color={isDarkMode ? "text-blue-400" : "text-blue-600"}
										bgColor={isDarkMode ? "bg-blue-900/20" : "bg-blue-50"}
										icon={
											<Home
												className={`h-5 w-5 ${
													isDarkMode ? "text-blue-400" : "text-blue-500"
												}`}
											/>
										}
									/>
									<StatCard
										title="Leave Days"
										value={monthlyChartData[2]?.value.toString() || "0"}
										color={isDarkMode ? "text-amber-400" : "text-amber-600"}
										bgColor={isDarkMode ? "bg-amber-900/20" : "bg-amber-50"}
										icon={
											<Coffee
												className={`h-5 w-5 ${
													isDarkMode ? "text-amber-400" : "text-amber-500"
												}`}
											/>
										}
									/>
								</div>

								<div className="mt-6">
									<h4
										className={`text-sm font-medium ${
											isDarkMode ? "text-gray-300" : "text-gray-700"
										} mb-2`}
									>
										Office Attendance:{" "}
										{(
											(parseInt(monthlyChartData[0]?.value.toString() || "0") /
												sumBy(monthlyChartData, "value")) *
											100
										).toFixed(1)}
										%
									</h4>
									<ProgressBar
										percentage={
											(parseInt(monthlyChartData[0]?.value.toString() || "0") /
												sumBy(monthlyChartData, "value")) *
											100
										}
									/>
									<p
										className={`mt-2 text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										{(parseInt(monthlyChartData[0]?.value.toString() || "0") /
											sumBy(monthlyChartData, "value")) *
											100 >=
										40
											? "You have met the minimum 40% office attendance requirement."
											: `You need ${
													Math.ceil(sumBy(monthlyChartData, "value") * 0.4) -
													parseInt(monthlyChartData[0]?.value.toString() || "0")
											  } more days in office to meet the 40% requirement.`}
									</p>
								</div>

								<div
									className={`mt-6 p-4 ${
										isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
									} rounded-lg`}
								>
									<div className="flex items-start">
										<Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
										<div>
											<p
												className={`text-sm font-medium ${
													isDarkMode ? "text-blue-200" : "text-blue-800"
												}`}
											>
												Attendance Insights
											</p>
											<p
												className={`mt-1 text-sm ${
													isDarkMode ? "text-blue-300" : "text-blue-600"
												}`}
											>
												Your office attendance is{" "}
												{(
													(parseInt(
														monthlyChartData[0]?.value.toString() || "0"
													) /
														sumBy(monthlyChartData, "value")) *
													100
												).toFixed(1)}
												%, which is {Math.random() > 0.5 ? "above" : "below"}{" "}
												your team's average of{" "}
												{(35 + Math.random() * 10).toFixed(1)}%.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : activeAnalyticsView === "yearly" ? (
					<div className="p-5">
						<div className="flex flex-col space-y-6">
							<div>
								<div className="flex items-center justify-between mb-4">
									<h3
										className={`text-lg font-semibold ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Yearly Attendance by Month
									</h3>
									<select
										className={`text-sm rounded-md border ${
											isDarkMode
												? "border-gray-600 bg-gray-700 text-gray-300"
												: "border-gray-300 bg-white text-gray-700"
										} px-3 py-1.5 cursor-pointer`}
									>
										<option>2025</option>
										<option>2024</option>
										<option>2023</option>
									</select>
								</div>
								<div className="h-72">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={yearlyChartData}>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke={isDarkMode ? "#374151" : "#e5e7eb"}
											/>
											<XAxis
												dataKey="name"
												tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
											/>
											<YAxis
												tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: isDarkMode ? "#1f2937" : "white",
													borderRadius: "0.5rem",
													border: isDarkMode
														? "1px solid #374151"
														: "1px solid #e5e7eb",
													color: isDarkMode ? "white" : "black",
												}}
											/>
											<Legend />
											<Bar
												dataKey="office"
												name="Office"
												fill="#10b981"
												radius={[4, 4, 0, 0]}
											/>
											<Bar
												dataKey="wfh"
												name="WFH"
												fill="#3b82f6"
												radius={[4, 4, 0, 0]}
											/>
											<Bar
												dataKey="leave"
												name="Leave"
												fill="#f59e0b"
												radius={[4, 4, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between mb-4">
									<h3
										className={`text-lg font-semibold ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Office Attendance Percentage by Month
									</h3>
									<div className="flex items-center space-x-2">
										<span
											className={`text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Target: 40%
										</span>
										<button
											className={`p-1.5 rounded-md ${
												isDarkMode
													? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
											} cursor-pointer`}
											onClick={handleNotImplemented}
										>
											<Download className="h-4 w-4 text-orange-500" />
										</button>
									</div>
								</div>
								<div className="h-72">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={yearlyChartData}>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke={isDarkMode ? "#374151" : "#e5e7eb"}
												horizontal={true}
												vertical={false}
											/>
											<XAxis
												dataKey="name"
												tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
											/>
											<YAxis
												domain={[0, 100]}
												tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
												tickFormatter={(value) => `${value}%`}
											/>
											<Tooltip
												formatter={(value) => [
													`${Number(value).toFixed(1)}%`,
													"Office %",
												]}
												contentStyle={{
													backgroundColor: isDarkMode ? "#1f2937" : "white",
													borderRadius: "0.5rem",
													border: isDarkMode
														? "1px solid #374151"
														: "1px solid #e5e7eb",
													color: isDarkMode ? "white" : "black",
												}}
											/>
											<Bar
												dataKey="officePercentage"
												name="Office %"
												radius={[4, 4, 0, 0]}
												shape={(props) => {
													const { x, y, width, height } = props;
													const percentage = props.payload.officePercentage;
													const color =
														percentage >= 40 ? "#10b981" : "#ef4444";

													return (
														<rect
															x={x}
															y={y}
															width={width}
															height={height}
															fill={color}
															radius={[4, 4, 0, 0]}
														/>
													);
												}}
											/>
											{}
											<CartesianGrid
												horizontal={true}
												vertical={false}
												strokeDasharray="3 3"
												horizontalPoints={[40]}
												stroke="#8b5cf6"
												strokeWidth={2}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="p-5">
						<div className="space-y-6">
							<div>
								<div className="flex items-center justify-between mb-4">
									<h3
										className={`text-lg font-semibold ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Office Attendance Trends
									</h3>
									<div className="flex items-center space-x-2">
										<span
											className={`text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Target: 40%
										</span>
										<button
											className={`p-1.5 rounded-md ${
												isDarkMode
													? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
											} cursor-pointer`}
											onClick={handleNotImplemented}
										>
											<Download className="h-4 w-4 text-teal-500" />
										</button>
									</div>
								</div>
								<div className="h-72">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={trendsData}>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke={isDarkMode ? "#374151" : "#e5e7eb"}
											/>
											<XAxis
												dataKey="name"
												tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
											/>
											<YAxis
												domain={[0, 100]}
												tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
												tickFormatter={(value) => `${value}%`}
											/>
											<Tooltip
												formatter={(value) => [
													`${Number(value).toFixed(1)}%`,
													"",
												]}
												contentStyle={{
													backgroundColor: isDarkMode ? "#1f2937" : "white",
													borderRadius: "0.5rem",
													border: isDarkMode
														? "1px solid #374151"
														: "1px solid #e5e7eb",
													color: isDarkMode ? "white" : "black",
												}}
											/>
											<Legend />
											{}
											<CartesianGrid
												horizontal={true}
												vertical={false}
												strokeDasharray="3 3"
												horizontalPoints={[40]}
												stroke="#8b5cf6"
												strokeWidth={1}
											/>
											<Line
												type="monotone"
												dataKey="officePercentage"
												name="Your Attendance"
												stroke="#10b981"
												strokeWidth={3}
												dot={{ r: 4, fill: "#10b981" }}
												activeDot={{ r: 6 }}
											/>
											<Line
												type="monotone"
												dataKey="teamAverage"
												name="Team Average"
												stroke="#3b82f6"
												strokeWidth={2}
												dot={{ r: 3, fill: "#3b82f6" }}
											/>
											<Line
												type="monotone"
												dataKey="companyAverage"
												name="Company Average"
												stroke="#9ca3af"
												strokeWidth={2}
												dot={{ r: 3, fill: "#9ca3af" }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div
									className={`${
										isDarkMode ? "bg-emerald-900/20" : "bg-emerald-50"
									} rounded-lg p-4`}
								>
									<div className="flex items-center justify-between mb-2">
										<h4
											className={`text-sm font-medium ${
												isDarkMode ? "text-emerald-200" : "text-emerald-800"
											}`}
										>
											Your Attendance
										</h4>
										<span
											className={`flex items-center ${
												isDarkMode ? "text-emerald-400" : "text-emerald-600"
											} text-sm`}
										>
											<ArrowUpRight className="h-4 w-4 mr-1" />
											+5.2%
										</span>
									</div>
									<p
										className={`text-2xl font-bold ${
											isDarkMode ? "text-emerald-300" : "text-emerald-700"
										}`}
									>
										42.3%
									</p>
									<p
										className={`mt-1 text-xs ${
											isDarkMode ? "text-emerald-400" : "text-emerald-600"
										}`}
									>
										Above target (40%) for the last 3 months
									</p>
								</div>

								<div
									className={`${
										isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
									} rounded-lg p-4`}
								>
									<div className="flex items-center justify-between mb-2">
										<h4
											className={`text-sm font-medium ${
												isDarkMode ? "text-blue-200" : "text-blue-800"
											}`}
										>
											Team Average
										</h4>
										<span
											className={`flex items-center ${
												isDarkMode ? "text-blue-400" : "text-blue-600"
											} text-sm`}
										>
											<ArrowUpRight className="h-4 w-4 mr-1" />
											+2.8%
										</span>
									</div>
									<p
										className={`text-2xl font-bold ${
											isDarkMode ? "text-blue-300" : "text-blue-700"
										}`}
									>
										38.7%
									</p>
									<p
										className={`mt-1 text-xs ${
											isDarkMode ? "text-blue-400" : "text-blue-600"
										}`}
									>
										Slightly below target, improving trend
									</p>
								</div>

								<div
									className={`${
										isDarkMode ? "bg-gray-900/30" : "bg-gray-50"
									} rounded-lg p-4`}
								>
									<div className="flex items-center justify-between mb-2">
										<h4
											className={`text-sm font-medium ${
												isDarkMode ? "text-gray-200" : "text-gray-800"
											}`}
										>
											Company Average
										</h4>
										<span
											className={`flex items-center ${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											} text-sm`}
										>
											<ArrowUpRight className="h-4 w-4 mr-1" />
											+1.5%
										</span>
									</div>
									<p
										className={`text-2xl font-bold ${
											isDarkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										36.2%
									</p>
									<p
										className={`mt-1 text-xs ${
											isDarkMode ? "text-gray-400" : "text-gray-600"
										}`}
									>
										Company-wide average attendance rate
									</p>
								</div>
							</div>

							<div
								className={`${
									isDarkMode ? "bg-gray-800" : "bg-white"
								} rounded-lg border ${
									isDarkMode ? "border-gray-700" : "border-gray-200"
								} p-4`}
							>
								<h4
									className={`text-sm font-medium ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									} mb-3`}
								>
									Observations
								</h4>
								<ul className="space-y-2">
									<li className="flex items-start">
										<CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
										<p
											className={`text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Your attendance is consistently above the company average
											by 6.1%
										</p>
									</li>
									<li className="flex items-start">
										<CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
										<p
											className={`text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Q2 showed the highest attendance rates across all metrics
										</p>
									</li>
									<li className="flex items-start">
										<CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
										<p
											className={`text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Your department maintains the highest in-office attendance
											company-wide
										</p>
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>

			{}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatisticCard
					title="Year to Date"
					value={`${sumBy(yearlyChartData, "office")} days`}
					description={`Total office days in ${selectedYear}`}
					icon={<Calendar className="h-5 w-5 text-green-600" />}
					percentage={(
						(sumBy(yearlyChartData, "office") /
							(sumBy(yearlyChartData, "office") +
								sumBy(yearlyChartData, "wfh") +
								sumBy(yearlyChartData, "leave"))) *
						100
					).toFixed(1)}
					progressColor="bg-emerald-500"
					isDarkMode={isDarkMode}
				/>

				<StatisticCard
					title="Policy Compliance"
					value={`${
						yearlyChartData.filter((month) => month.officePercentage >= 40)
							.length
					} / 12`}
					description={`Months meeting 40% requirement`}
					icon={<Info className="h-5 w-5 text-indigo-500" />}
					percentage={(
						(yearlyChartData.filter((month) => month.officePercentage >= 40)
							.length /
							12) *
						100
					).toFixed(0)}
					progressColor={
						yearlyChartData.filter((month) => month.officePercentage >= 40)
							.length /
							12 >=
						0.75
							? "bg-emerald-500"
							: "bg-amber-500"
					}
					isDarkMode={isDarkMode}
				/>

				<StatisticCard
					title="Leave Utilization"
					value={`${sumBy(yearlyChartData, "leave")} days`}
					description={`Total leave taken in ${selectedYear}`}
					icon={<Home className="h-5 w-5 text-pink-500" />}
					percentage={((sumBy(yearlyChartData, "leave") / 30) * 100).toFixed(0)}
					progressColor="bg-amber-500"
					isDarkMode={isDarkMode}
				/>
			</div>

			{}
			<div
				className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
			>
				<div
					className={`p-5 border-b ${
						isDarkMode ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<h3
						className={`text-lg font-semibold ${
							isDarkMode ? "text-white" : "text-gray-900"
						}`}
					>
						Department Comparison
					</h3>
				</div>
				<div className="overflow-x-auto">
					<table
						className={`min-w-full divide-y ${
							isDarkMode ? "divide-gray-700" : "divide-gray-200"
						}`}
					>
						<thead
							className={`${isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}`}
						>
							<tr>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									Department
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									Average Attendance
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									WFH Ratio
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									Leave Utilization
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									Compliance
								</th>
							</tr>
						</thead>
						<tbody
							className={`${isDarkMode ? "bg-gray-800" : "bg-white"} divide-y ${
								isDarkMode ? "divide-gray-700" : "divide-gray-200"
							}`}
						>
							{["Engineering", "Marketing", "Product", "Design", "Finance"].map(
								(dept, i) => (
									<tr
										key={dept}
										className={`${
											isDarkMode ? "hover:bg-gray-900/50" : "hover:bg-gray-50"
										} transition-colors`}
									>
										<td
											className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
												isDarkMode ? "text-white" : "text-gray-900"
											}`}
										>
											{dept}
										</td>
										<td
											className={`px-6 py-4 whitespace-nowrap text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{(35 + Math.random() * 15).toFixed(1)}%
										</td>
										<td
											className={`px-6 py-4 whitespace-nowrap text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{(40 + Math.random() * 20).toFixed(1)}%
										</td>
										<td
											className={`px-6 py-4 whitespace-nowrap text-sm ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{Math.floor(5 + Math.random() * 7)} days
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													i % 3 === 0
														? isDarkMode
															? "bg-emerald-900 text-emerald-200"
															: "bg-emerald-100 text-emerald-800"
														: i % 3 === 1
														? isDarkMode
															? "bg-amber-900 text-amber-200"
															: "bg-amber-100 text-amber-800"
														: isDarkMode
														? "bg-red-900 text-red-200"
														: "bg-red-100 text-red-800"
												}`}
											>
												{i % 3 === 0
													? "Compliant"
													: i % 3 === 1
													? "At Risk"
													: "Non-Compliant"}
											</span>
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

const StatCard = ({ title, value, color, bgColor, icon }) => {
	return (
		<div className={`${bgColor} rounded-lg p-4 flex items-center`}>
			<div className="flex-1">
				<p className="text-sm text-gray-500">{title}</p>
				<p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
			</div>
			<div className="ml-4">{icon}</div>
		</div>
	);
};

const StatisticCard = ({
	title,
	value,
	description,
	icon,
	percentage,
	progressColor,
	isDarkMode,
}) => {
	return (
		<div
			className={`${
				isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
			} rounded-xl shadow-sm border p-5`}
		>
			<div className="flex items-center justify-between mb-4">
				<h3
					className={`text-base font-medium ${
						isDarkMode ? "text-white" : "text-gray-900"
					}`}
				>
					{title}
				</h3>
				<div
					className={`p-2 rounded-full ${
						isDarkMode ? "bg-gray-700" : "bg-gray-100"
					}`}
				>
					{icon}
				</div>
			</div>

			<p
				className={`text-2xl font-bold ${
					isDarkMode ? "text-white" : "text-gray-900"
				} mb-1`}
			>
				{value}
			</p>
			<p
				className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
			>
				{description}
			</p>

			<div className="mt-4">
				<div className="flex items-center justify-between mb-1">
					<span
						className={`text-sm ${
							isDarkMode ? "text-gray-400" : "text-gray-500"
						}`}
					>
						Progress
					</span>
					<span
						className={`text-sm font-medium ${
							isDarkMode ? "text-gray-300" : "text-gray-700"
						}`}
					>
						{percentage}%
					</span>
				</div>
				<div
					className={`w-full ${
						isDarkMode ? "bg-gray-700" : "bg-gray-200"
					} rounded-full h-2.5`}
				>
					<div
						className={`h-2.5 rounded-full ${progressColor} transition-all duration-500 ease-in-out`}
						style={{
							width: `${
								parseInt(percentage) > 100 ? 100 : parseInt(percentage)
							}%`,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

const SettingsView = ({
	holidays,
	selectedDay,
	setSelectedDay,
	formatDate,
	holidayName,
	setHolidayName,
	isSettingHoliday,
	setIsSettingHoliday,
	handleHolidayUpdate,
	deleteHoliday,
	currentUser,
	setCurrentUser,
	selectedYear,
	selectedMonth,
	createAlert,
	isDarkMode,
	toggleDarkMode,
}) => {
	const exportSettings = () => {
		const dataStr = JSON.stringify({
			holidays,
			user: currentUser,
			darkMode: isDarkMode,
		});
		const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
			dataStr
		)}`;

		const exportFileDefaultName = "workpulse-settings.json";

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();

		createAlert("Settings exported successfully", "success");
	};

	const handleNotImplemented = () => {
		createAlert("This feature is coming soon!", "info");
	};

	const getCardBgStyle = () => {
		return isDarkMode
			? "bg-gray-800 border-gray-700"
			: "bg-white border-gray-200";
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{}
				<div
					className={`lg:col-span-2 ${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
				>
					<div
						className={`p-5 border-b ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<h2
							className={`text-lg font-semibold ${
								isDarkMode ? "text-white" : "text-gray-900"
							} flex items-center`}
						>
							<User className="h-5 w-5 mr-2 text-blue-500" />
							Profile Settings
						</h2>
					</div>

					<div className="p-5">
						<div className="flex flex-col md:flex-row md:space-x-6">
							<div className="md:w-1/3 flex flex-col items-center space-y-4 mb-6 md:mb-0">
								<div className="relative">
									<img
										src={currentUser.avatar}
										alt={currentUser.name}
										className={`h-24 w-24 rounded-full object-cover border-4 ${
											isDarkMode ? "border-gray-800" : "border-white"
										} shadow-md`}
									/>
									<button
										className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-md hover:bg-blue-600 transition-colors cursor-pointer"
										onClick={handleNotImplemented}
									>
										<UploadCloud className="h-4 w-4" />
									</button>
								</div>
								<div className="text-center">
									<h3
										className={`text-lg font-medium ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										{currentUser.name}
									</h3>
									<p
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										{currentUser.role}
									</p>
								</div>
							</div>

							<div className="md:w-2/3">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											className={`block text-sm font-medium ${
												isDarkMode ? "text-gray-300" : "text-gray-700"
											} mb-1`}
										>
											Full Name
										</label>
										<input
											type="text"
											value={currentUser.name}
											onChange={(e) =>
												setCurrentUser({ ...currentUser, name: e.target.value })
											}
											className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${
												isDarkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 text-gray-900"
											} rounded-md p-2`}
										/>
									</div>

									<div>
										<label
											className={`block text-sm font-medium ${
												isDarkMode ? "text-gray-300" : "text-gray-700"
											} mb-1`}
										>
											Job Title
										</label>
										<input
											type="text"
											value={currentUser.role}
											onChange={(e) =>
												setCurrentUser({ ...currentUser, role: e.target.value })
											}
											className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${
												isDarkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 text-gray-900"
											} rounded-md p-2`}
										/>
									</div>

									<div>
										<label
											className={`block text-sm font-medium ${
												isDarkMode ? "text-gray-300" : "text-gray-700"
											} mb-1`}
										>
											Email Address
										</label>
										<input
											type="email"
											value={currentUser.email || "user@company.com"}
											onChange={(e) =>
												setCurrentUser({
													...currentUser,
													email: e.target.value,
												})
											}
											className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${
												isDarkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 text-gray-900"
											} rounded-md p-2`}
										/>
									</div>

									<div>
										<label
											className={`block text-sm font-medium ${
												isDarkMode ? "text-gray-300" : "text-gray-700"
											} mb-1`}
										>
											Department
										</label>
										<select
											value={currentUser.department || "Engineering"}
											onChange={(e) =>
												setCurrentUser({
													...currentUser,
													department: e.target.value,
												})
											}
											className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${
												isDarkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 text-gray-900"
											} rounded-md p-2 cursor-pointer`}
										>
											<option>Engineering</option>
											<option>Product</option>
											<option>Design</option>
											<option>Marketing</option>
											<option>Finance</option>
											<option>HR</option>
										</select>
									</div>
								</div>

								<div className="mt-6">
									<button
										onClick={() =>
											createAlert("Profile updated successfully", "success")
										}
										className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${
											isDarkMode ? "focus:ring-offset-gray-900" : ""
										} cursor-pointer`}
									>
										Save Changes
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{}
				<div
					className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
				>
					<div
						className={`p-5 border-b ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<h2
							className={`text-lg font-semibold ${
								isDarkMode ? "text-white" : "text-gray-900"
							} flex items-center`}
						>
							<Settings className="h-5 w-5 mr-2 text-blue-500" />
							Appearance
						</h2>
					</div>

					<div className="p-5">
						<div className="space-y-6">
							<div>
								<label
									className={`block text-sm font-medium ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									} mb-3`}
								>
									Theme
								</label>
								<div className="grid grid-cols-2 gap-3">
									<button
										onClick={() => {
											if (isDarkMode) toggleDarkMode();
										}}
										className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
											!isDarkMode
												? isDarkMode
													? "border-blue-500 bg-blue-900/20"
													: "border-blue-500 bg-blue-50"
												: isDarkMode
												? "border-gray-700 hover:bg-gray-700"
												: "border-gray-200 hover:bg-gray-50"
										}   transition-colors cursor-pointer`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-yellow-500 mb-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
											/>
										</svg>
										<span
											className={`text-sm font-medium ${
												isDarkMode ? "text-gray-200" : "text-gray-800"
											}`}
										>
											Light Mode
										</span>
									</button>

									<button
										onClick={() => {
											if (!isDarkMode) toggleDarkMode();
										}}
										className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
											isDarkMode
												? isDarkMode
													? "border-blue-500 bg-blue-900/20"
													: "border-blue-500 bg-blue-50"
												: isDarkMode
												? "border-gray-700 hover:bg-gray-700"
												: "border-gray-200 hover:bg-gray-50"
										}   transition-colors cursor-pointer`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-purple-500 mb-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
											/>
										</svg>
										<span
											className={`text-sm font-medium ${
												isDarkMode ? "text-gray-200" : "text-gray-800"
											}`}
										>
											Dark Mode
										</span>
									</button>
								</div>
							</div>

							<div>
								<label
									className={`block text-sm font-medium ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									} mb-3`}
								>
									Theme Color
								</label>
								<div className="flex space-x-3">
									{["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"].map(
										(color) => (
											<button
												key={color}
												className={`h-8 w-8 rounded-full border-2 ${
													isDarkMode ? "border-gray-800" : "border-white"
												} shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
													isDarkMode ? "focus:ring-offset-gray-900" : ""
												} cursor-pointer`}
												style={{ backgroundColor: color }}
												onClick={handleNotImplemented}
											/>
										)
									)}
								</div>
							</div>

							<div>
								<label
									className={`block text-sm font-medium ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									} mb-3`}
								>
									Calendar Display
								</label>
								<div className="space-y-2">
									<div className="flex items-center">
										<input
											id="calendar-weekly"
											name="calendar-view"
											type="radio"
											defaultChecked
											className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${
												isDarkMode
													? "border-gray-600 bg-gray-700"
													: "border-gray-300"
											} cursor-pointer`}
											onClick={handleNotImplemented}
										/>
										<label
											htmlFor="calendar-weekly"
											className={`ml-2 block text-sm ${
												isDarkMode ? "text-gray-300" : "text-gray-700"
											} cursor-pointer`}
										>
											Monthly (Default)
										</label>
									</div>
									<div className="flex items-center">
										<input
											id="calendar-monthly"
											name="calendar-view"
											type="radio"
											className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${
												isDarkMode
													? "border-gray-600 bg-gray-700"
													: "border-gray-300"
											} cursor-pointer`}
											onClick={handleNotImplemented}
										/>
										<label
											htmlFor="calendar-monthly"
											className={`ml-2 block text-sm ${
												isDarkMode ? "text-gray-300" : "text-gray-700"
											} cursor-pointer`}
										>
											Weekly View
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{}
				<div
					className={`lg:col-span-2 ${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
				>
					<div
						className={`p-5 border-b ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<div className="flex items-center justify-between">
							<h2
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								} flex items-center`}
							>
								<Calendar className="h-5 w-5 mr-2 text-purple-500" />
								Holiday Management
							</h2>
							<button
								onClick={() => {
									setSelectedDay(new Date(selectedYear, selectedMonth, 15));
									setHolidayName("");
									setIsSettingHoliday(true);
								}}
								className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150 ${
									isDarkMode ? "focus:ring-offset-gray-900" : ""
								} cursor-pointer`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-1.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
								Add Holiday
							</button>
						</div>
					</div>

					<div className="p-5">
						<div
							className={`overflow-hidden shadow ring-1 ${
								isDarkMode
									? "ring-white ring-opacity-10"
									: "ring-black ring-opacity-5"
							} rounded-lg mb-6`}
						>
							<table
								className={`min-w-full divide-y ${
									isDarkMode ? "divide-gray-700" : "divide-gray-300"
								}`}
							>
								<thead
									className={`${isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}`}
								>
									<tr>
										<th
											scope="col"
											className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${
												isDarkMode ? "text-white" : "text-gray-900"
											} sm:pl-6`}
										>
											Holiday
										</th>
										<th
											scope="col"
											className={`px-3 py-3.5 text-left text-sm font-semibold ${
												isDarkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Date
										</th>
										<th
											scope="col"
											className="relative py-3.5 pl-3 pr-4 sm:pr-6"
										>
											<span className="sr-only">Actions</span>
										</th>
									</tr>
								</thead>
								<tbody
									className={`divide-y ${
										isDarkMode
											? "divide-gray-700 bg-gray-800"
											: "divide-gray-200 bg-white"
									}`}
								>
									{holidays.length > 0 ? (
										holidays
											.sort((a, b) => a.date.getTime() - b.date.getTime())
											.map((holiday, index) => (
												<tr
													key={index}
													className={`${
														isDarkMode
															? "hover:bg-gray-900/50"
															: "hover:bg-gray-50"
													} transition-colors duration-150`}
												>
													<td
														className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium ${
															isDarkMode ? "text-white" : "text-gray-900"
														} sm:pl-6`}
													>
														{holiday.name}
													</td>
													<td
														className={`whitespace-nowrap px-3 py-4 text-sm ${
															isDarkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														{formatDate(holiday.date)}
													</td>
													<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
														<button
															onClick={() => {
																setSelectedDay(holiday.date);
																setHolidayName(holiday.name);
																setIsSettingHoliday(true);
															}}
															className={`${
																isDarkMode
																	? "text-blue-400 hover:text-blue-300"
																	: "text-blue-600 hover:text-blue-900"
															} mr-4 cursor-pointer`}
														>
															Edit
														</button>
														<button
															onClick={() => {
																setSelectedDay(holiday.date);
																setHolidayName(holiday.name);
																setIsSettingHoliday(true);
																deleteHoliday();
															}}
															className={`${
																isDarkMode
																	? "text-red-400 hover:text-red-300"
																	: "text-red-600 hover:text-red-900"
															} cursor-pointer`}
														>
															Delete
														</button>
													</td>
												</tr>
											))
									) : (
										<tr>
											<td
												colSpan={3}
												className={`px-6 py-4 text-sm ${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												} text-center`}
											>
												No holidays configured yet
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<div
							className={`${
								isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
							} rounded-lg p-4`}
						>
							<div className="flex">
								<Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
								<div>
									<p
										className={`text-sm ${
											isDarkMode ? "text-blue-200" : "text-blue-800"
										} font-medium`}
									>
										About Holidays
									</p>
									<p
										className={`mt-1 text-sm ${
											isDarkMode ? "text-blue-300" : "text-blue-600"
										}`}
									>
										Holidays are automatically excluded from office attendance
										calculations. Configure company-wide holidays and personal
										days off here.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="space-y-6">
					<div
						className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
					>
						<div
							className={`p-5 border-b ${
								isDarkMode ? "border-gray-700" : "border-gray-200"
							}`}
						>
							<h2
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								} flex items-center`}
							>
								<Bell className="h-5 w-5 mr-2 text-amber-500" />
								Notification Settings
							</h2>
						</div>

						<div className="p-5">
							<div className="space-y-4">
								<NotificationSetting
									title="Email Notifications"
									description="Receive attendance policy alerts via email"
									defaultChecked={true}
									isDarkMode={isDarkMode}
								/>
								<NotificationSetting
									title="Browser Notifications"
									description="Show browser notifications for attendance reminders"
									defaultChecked={true}
									isDarkMode={isDarkMode}
								/>
								<NotificationSetting
									title="Weekly Summary"
									description="Receive weekly attendance summary reports"
									defaultChecked={false}
									isDarkMode={isDarkMode}
								/>
							</div>
						</div>
					</div>

					<div
						className={`${getCardBgStyle()} rounded-xl shadow-sm border overflow-hidden`}
					>
						<div
							className={`p-5 border-b ${
								isDarkMode ? "border-gray-700" : "border-gray-200"
							}`}
						>
							<h2
								className={`text-lg font-semibold ${
									isDarkMode ? "text-white" : "text-gray-900"
								} flex items-center`}
							>
								<Download className="h-5 w-5 mr-2 text-emerald-500" />
								Data & Backup
							</h2>
						</div>

						<div className="p-5">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<div>
										<p
											className={`text-sm font-medium ${
												isDarkMode ? "text-gray-200" : "text-gray-800"
											}`}
										>
											Export Settings
										</p>
										<p
											className={`text-xs ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Download your settings as a JSON file
										</p>
									</div>
									<button
										onClick={exportSettings}
										className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
											isDarkMode
												? "border-gray-600 text-gray-300 hover:bg-gray-700"
												: "border-gray-300 text-gray-700 hover:bg-gray-50"
										} transition-colors cursor-pointer`}
									>
										Export
									</button>
								</div>

								<div className="flex justify-between items-center">
									<div>
										<p
											className={`text-sm font-medium ${
												isDarkMode ? "text-gray-200" : "text-gray-800"
											}`}
										>
											Import Settings
										</p>
										<p
											className={`text-xs ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Restore settings from a backup file
										</p>
									</div>
									<button
										className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
											isDarkMode
												? "border-gray-600 text-gray-300 hover:bg-gray-700"
												: "border-gray-300 text-gray-700 hover:bg-gray-50"
										} transition-colors cursor-pointer`}
										onClick={handleNotImplemented}
									>
										Import
									</button>
								</div>

								<div className="flex justify-between items-center">
									<div>
										<p
											className={`text-sm font-medium ${
												isDarkMode ? "text-gray-200" : "text-gray-800"
											}`}
										>
											Reset Data
										</p>
										<p
											className={`text-xs ${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Clear all attendance data and settings
										</p>
									</div>
									<button
										className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
											isDarkMode
												? "bg-red-900/30 text-red-300 hover:bg-red-900/50"
												: "bg-red-100 text-red-700 hover:bg-red-200"
										} transition-colors cursor-pointer`}
										onClick={handleNotImplemented}
									>
										Reset
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const NotificationSetting = ({
	title,
	description,
	defaultChecked,
	isDarkMode,
}) => {
	const [checked, setChecked] = useState(defaultChecked);

	return (
		<div className="flex items-center justify-between">
			<div>
				<p
					className={`text-sm font-medium ${
						isDarkMode ? "text-gray-200" : "text-gray-800"
					}`}
				>
					{title}
				</p>
				<p
					className={`text-xs ${
						isDarkMode ? "text-gray-400" : "text-gray-500"
					}`}
				>
					{description}
				</p>
			</div>
			<label className="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					className="sr-only peer"
					checked={checked}
					onChange={() => setChecked(!checked)}
				/>
				<div
					className={`relative w-11 h-6 ${
						isDarkMode ? "bg-gray-700" : "bg-gray-200"
					} rounded-full 
          peer-focus:outline-none peer-focus:ring-4
          peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
          peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
          after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:h-5 after:w-5 after:transition-all ${
						isDarkMode
							? "border-gray-600 peer-focus:ring-blue-800 "
							: "peer-focus:ring-blue-300"
					} 
          peer-checked:bg-blue-600`}
				></div>
			</label>
		</div>
	);
};

export default AttendanceTracker;
