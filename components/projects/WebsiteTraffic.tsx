"use client";
import { useState, useEffect } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	AreaChart,
	Area,
	PieChart,
	Pie,
	Cell,
	Legend,
	BarChart,
	Bar,
	TooltipProps,
} from "recharts";

interface DataPoint {
	name: string;
	visitors: number;
	pageViews: number;
	newUsers: number;
	avgTime: number;
}

interface TrafficSource {
	name: string;
	value: number;
}

interface DeviceData {
	name: string;
	users: number;
}

type MetricKey = "visitors" | "pageViews" | "newUsers" | "avgTime";
type TimeRange = "Today" | "This Week" | "This Month";

const dataToday: DataPoint[] = [
	{ name: "00:00", visitors: 120, pageViews: 180, newUsers: 65, avgTime: 2.4 },
	{ name: "03:00", visitors: 180, pageViews: 230, newUsers: 95, avgTime: 1.9 },
	{ name: "06:00", visitors: 300, pageViews: 450, newUsers: 140, avgTime: 3.2 },
	{ name: "09:00", visitors: 380, pageViews: 520, newUsers: 165, avgTime: 2.8 },
	{ name: "12:00", visitors: 450, pageViews: 670, newUsers: 210, avgTime: 3.5 },
	{ name: "15:00", visitors: 400, pageViews: 590, newUsers: 185, avgTime: 2.9 },
	{ name: "18:00", visitors: 320, pageViews: 480, newUsers: 150, avgTime: 2.6 },
	{ name: "21:00", visitors: 390, pageViews: 540, newUsers: 175, avgTime: 3.1 },
	{ name: "24:00", visitors: 500, pageViews: 750, newUsers: 230, avgTime: 3.8 },
];

const dataWeek: DataPoint[] = [
	{ name: "Mon", visitors: 800, pageViews: 1200, newUsers: 340, avgTime: 2.7 },
	{ name: "Tue", visitors: 950, pageViews: 1430, newUsers: 410, avgTime: 3.1 },
	{ name: "Wed", visitors: 700, pageViews: 1050, newUsers: 320, avgTime: 2.5 },
	{ name: "Thu", visitors: 1100, pageViews: 1650, newUsers: 480, avgTime: 3.4 },
	{ name: "Fri", visitors: 900, pageViews: 1350, newUsers: 390, avgTime: 2.9 },
	{ name: "Sat", visitors: 600, pageViews: 900, newUsers: 260, avgTime: 2.3 },
	{ name: "Sun", visitors: 750, pageViews: 1125, newUsers: 320, avgTime: 2.6 },
];

const dataMonth: DataPoint[] = [
	{
		name: "Week 1",
		visitors: 2800,
		pageViews: 4200,
		newUsers: 1200,
		avgTime: 2.8,
	},
	{
		name: "Week 2",
		visitors: 3200,
		pageViews: 4800,
		newUsers: 1400,
		avgTime: 3.0,
	},
	{
		name: "Week 3",
		visitors: 2900,
		pageViews: 4350,
		newUsers: 1250,
		avgTime: 2.7,
	},
	{
		name: "Week 4",
		visitors: 3100,
		pageViews: 4650,
		newUsers: 1350,
		avgTime: 2.9,
	},
];

const trafficSourceData: TrafficSource[] = [
	{ name: "Organic Search", value: 42 },
	{ name: "Direct", value: 28 },
	{ name: "Social Media", value: 18 },
	{ name: "Referral", value: 12 },
];

const deviceData: DeviceData[] = [
	{ name: "Mobile", users: 58 },
	{ name: "Desktop", users: 34 },
	{ name: "Tablet", users: 8 },
];

const COLORS: string[] = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const CHART_LINE_COLORS: Record<MetricKey, string> = {
	visitors: "#0088FE",
	pageViews: "#00C49F",
	newUsers: "#FFBB28",
	avgTime: "#FF8042",
};

interface AnimatedCounterProps {
	value: number | string;
	duration?: number;
	prefix?: string;
	suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
	value,
	duration = 1000,
	prefix = "",
	suffix = "",
}) => {
	const [count, setCount] = useState<number>(0);

	useEffect(() => {
		let start = 0;
		const end = parseInt(value.toString());
		if (start === end) return;

		const incrementTime = (duration / end) * 1.1;
		let timer = setInterval(() => {
			start += 1;
			setCount(start);
			if (start >= end) clearInterval(timer);
		}, incrementTime);

		return () => {
			clearInterval(timer);
		};
	}, [value, duration]);

	return (
		<span>
			{prefix}
			{count.toLocaleString()}
			{suffix}
		</span>
	);
};

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number;
		color: string;
		dataKey?: string;
		payload: any;
	}>;
	label?: string;
	darkMode: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
	active,
	payload,
	label,
	darkMode,
}) => {
	if (active && payload && payload.length) {
		return (
			<div
				className={`${
					darkMode ? "bg-gray-800" : "bg-white"
				} p-4 rounded-lg shadow-lg border ${
					darkMode ? "border-gray-600" : "border-gray-200"
				} custom-tooltip`}
			>
				<p
					className={`font-semibold ${
						darkMode ? "text-gray-300" : "text-gray-700"
					}`}
				>
					{label}
				</p>
				{payload.map((entry, index) => (
					<p
						key={index}
						className={`text-sm ${
							darkMode ? "text-gray-300" : "text-gray-700"
						}`}
						style={{ color: entry.color }}
					>
						{entry.dataKey || entry.name}: {entry.value.toLocaleString()}
					</p>
				))}
			</div>
		);
	}
	return null;
};

export default function WebsiteTrafficExport(): JSX.Element {
	const [selectedPeriod, setSelectedPeriod] = useState<TimeRange>("Today");
	const [activeMetric, setActiveMetric] = useState<MetricKey>("visitors");
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const getData = (): DataPoint[] => {
		if (selectedPeriod === "Today") return dataToday;
		if (selectedPeriod === "This Week") return dataWeek;
		return dataMonth;
	};

	const getTotal = (metric: MetricKey): number => {
		return getData().reduce((sum, d) => sum + d[metric], 0);
	};

	const getAverage = (metric: MetricKey): string => {
		return (
			getData().reduce((sum, d) => sum + d[metric], 0) / getData().length
		).toFixed(1);
	};

	const getBounceRate = (): string => {
		if (selectedPeriod === "Today") return "34%";
		if (selectedPeriod === "This Week") return "29%";
		return "31%";
	};

	const getConversionRate = (): string => {
		if (selectedPeriod === "Today") return "3.8%";
		if (selectedPeriod === "This Week") return "4.2%";
		return "4.0%";
	};

	const toggleMetric = (metric: MetricKey): void => {
		setActiveMetric(metric);
	};

	const toggleDarkMode = (): void => {
		setDarkMode(!darkMode);
	};

	return (
		<main
			className={`min-h-screen flex flex-col ${
				darkMode
					? "bg-gray-900 text-white"
					: "bg-gradient-to-br from-gray-100 via-blue-50 to-white text-gray-800"
			} transition-colors duration-300`}
		>
			<header
				className={`w-full py-3 px-6 flex justify-between items-center ${
					darkMode ? "bg-gray-800" : "bg-white"
				} shadow-md`}
			>
				<div className="flex items-center">
					<div className="text-2xl font-bold mr-2">
						<span className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}>
							Data
						</span>
						<span className={`${darkMode ? "text-teal-400" : "text-teal-500"}`}>
							Pulse
						</span>
					</div>
					<div className="hidden md:block text-sm font-light text-gray-500">
						Analytics Dashboard
					</div>
				</div>

				<div className="flex items-center space-x-4">
					<button
						onClick={toggleDarkMode}
						className={`p-2 rounded-full cursor-pointer transition-colors ${
							darkMode
								? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						{darkMode ? "☀️" : "🌙"}
					</button>

					<div className="relative">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="flex items-center space-x-2 cursor-pointer"
						>
							<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
								AK
							</div>
							<span className="hidden md:inline">Admin User</span>
						</button>

						{isMenuOpen && (
							<div
								className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
									darkMode ? "bg-gray-800" : "bg-white"
								} ring-1 ring-black ring-opacity-5 z-10`}
							>
								<a
									href="#"
									className={`block px-4 py-2 text-sm ${
										darkMode
											? "text-gray-300 hover:bg-gray-700"
											: "text-gray-700 hover:bg-gray-100"
									} cursor-pointer`}
								>
									Your Profile
								</a>
								<a
									href="#"
									className={`block px-4 py-2 text-sm ${
										darkMode
											? "text-gray-300 hover:bg-gray-700"
											: "text-gray-700 hover:bg-gray-100"
									} cursor-pointer`}
								>
									Settings
								</a>
								<a
									href="#"
									className={`block px-4 py-2 text-sm ${
										darkMode
											? "text-gray-300 hover:bg-gray-700"
											: "text-gray-700 hover:bg-gray-100"
									} cursor-pointer`}
								>
									Logout
								</a>
							</div>
						)}
					</div>
				</div>
			</header>

			<div className="flex-1 p-6">
				<div
					className={`w-full max-w-7xl mx-auto ${
						darkMode ? "bg-gray-800/70" : "bg-white/70"
					} backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-10`}
				>
					<div className="flex flex-col md:flex-row justify-between items-center mb-8">
						<h1
							className={`text-3xl md:text-4xl font-bold ${
								darkMode ? "text-blue-400" : "text-blue-900"
							} mb-4 md:mb-0 tracking-wide`}
						>
							Website Analytics Dashboard
						</h1>

						<div className="flex items-center space-x-3">
							<span
								className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
							>
								Time period:
							</span>
							<select
								value={selectedPeriod}
								onChange={(e) => setSelectedPeriod(e.target.value as TimeRange)}
								className={`${
									darkMode
										? "bg-gray-700 hover:bg-gray-600 text-white"
										: "bg-teal-500 hover:bg-teal-600 text-white"
								} 
                  font-semibold py-2 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out focus:outline-none cursor-pointer`}
							>
								<option>Today</option>
								<option>This Week</option>
								<option>This Month</option>
							</select>

							<button
								className={`${
									darkMode
										? "bg-blue-600 hover:bg-blue-700"
										: "bg-blue-500 hover:bg-blue-600"
								} 
                text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-300 ease-in-out focus:outline-none cursor-pointer`}
							>
								Export Data
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
						<div
							className={`${
								darkMode
									? "bg-gray-700 hover:bg-gray-600"
									: "bg-white hover:bg-blue-50"
							} 
              rounded-2xl p-6 shadow transition-all duration-300 transform hover:scale-102 cursor-pointer border-l-4 border-blue-500`}
						>
							<div className="flex justify-between items-center">
								<h2
									className={`text-lg font-semibold ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} mb-2`}
								>
									Total Visitors
								</h2>
								<div
									className={`p-2 rounded-full ${
										darkMode
											? "bg-blue-900/30 text-blue-400"
											: "bg-blue-100 text-blue-600"
									}`}
								>
									👥
								</div>
							</div>
							<p
								className={`text-3xl font-bold ${
									darkMode ? "text-blue-400" : "text-blue-600"
								}`}
							>
								<AnimatedCounter value={getTotal("visitors")} />
							</p>
							<p
								className={`text-sm mt-2 ${
									darkMode ? "text-green-400" : "text-green-600"
								}`}
							>
								+14% from last period
							</p>
						</div>

						<div
							className={`${
								darkMode
									? "bg-gray-700 hover:bg-gray-600"
									: "bg-white hover:bg-teal-50"
							} 
              rounded-2xl p-6 shadow transition-all duration-300 transform hover:scale-102 cursor-pointer border-l-4 border-teal-500`}
						>
							<div className="flex justify-between items-center">
								<h2
									className={`text-lg font-semibold ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} mb-2`}
								>
									Page Views
								</h2>
								<div
									className={`p-2 rounded-full ${
										darkMode
											? "bg-teal-900/30 text-teal-400"
											: "bg-teal-100 text-teal-600"
									}`}
								>
									📄
								</div>
							</div>
							<p
								className={`text-3xl font-bold ${
									darkMode ? "text-teal-400" : "text-teal-600"
								}`}
							>
								<AnimatedCounter value={getTotal("pageViews")} />
							</p>
							<p
								className={`text-sm mt-2 ${
									darkMode ? "text-green-400" : "text-green-600"
								}`}
							>
								+8% from last period
							</p>
						</div>

						<div
							className={`${
								darkMode
									? "bg-gray-700 hover:bg-gray-600"
									: "bg-white hover:bg-rose-50"
							} 
              rounded-2xl p-6 shadow transition-all duration-300 transform hover:scale-102 cursor-pointer border-l-4 border-rose-500`}
						>
							<div className="flex justify-between items-center">
								<h2
									className={`text-lg font-semibold ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} mb-2`}
								>
									Bounce Rate
								</h2>
								<div
									className={`p-2 rounded-full ${
										darkMode
											? "bg-rose-900/30 text-rose-400"
											: "bg-rose-100 text-rose-600"
									}`}
								>
									↩️
								</div>
							</div>
							<p
								className={`text-3xl font-bold ${
									darkMode ? "text-rose-400" : "text-rose-600"
								}`}
							>
								{getBounceRate()}
							</p>
							<p
								className={`text-sm mt-2 ${
									darkMode ? "text-green-400" : "text-green-600"
								}`}
							>
								-2% from last period
							</p>
						</div>

						<div
							className={`${
								darkMode
									? "bg-gray-700 hover:bg-gray-600"
									: "bg-white hover:bg-purple-50"
							} 
              rounded-2xl p-6 shadow transition-all duration-300 transform hover:scale-102 cursor-pointer border-l-4 border-purple-500`}
						>
							<div className="flex justify-between items-center">
								<h2
									className={`text-lg font-semibold ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} mb-2`}
								>
									Conversion Rate
								</h2>
								<div
									className={`p-2 rounded-full ${
										darkMode
											? "bg-purple-900/30 text-purple-400"
											: "bg-purple-100 text-purple-600"
									}`}
								>
									🎯
								</div>
							</div>
							<p
								className={`text-3xl font-bold ${
									darkMode ? "text-purple-400" : "text-purple-600"
								}`}
							>
								{getConversionRate()}
							</p>
							<p
								className={`text-sm mt-2 ${
									darkMode ? "text-green-400" : "text-green-600"
								}`}
							>
								+0.5% from last period
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
						<div
							className={`lg:col-span-2 ${
								darkMode ? "bg-gray-700" : "bg-white"
							} rounded-2xl p-6 shadow-md`}
						>
							<div className="flex justify-between items-center mb-4">
								<h2
									className={`text-xl font-semibold ${
										darkMode ? "text-gray-200" : "text-gray-700"
									}`}
								>
									Visitor Analytics
								</h2>

								<div className="flex space-x-2">
									<button
										onClick={() => toggleMetric("visitors")}
										className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer
                      ${
												activeMetric === "visitors"
													? darkMode
														? "bg-blue-700 text-white"
														: "bg-blue-500 text-white"
													: darkMode
													? "text-gray-300 hover:bg-gray-600"
													: "text-gray-600 hover:bg-gray-200"
											}`}
									>
										Visitors
									</button>
									<button
										onClick={() => toggleMetric("pageViews")}
										className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer
                      ${
												activeMetric === "pageViews"
													? darkMode
														? "bg-teal-700 text-white"
														: "bg-teal-500 text-white"
													: darkMode
													? "text-gray-300 hover:bg-gray-600"
													: "text-gray-600 hover:bg-gray-200"
											}`}
									>
										Page Views
									</button>
									<button
										onClick={() => toggleMetric("newUsers")}
										className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer
                      ${
												activeMetric === "newUsers"
													? darkMode
														? "bg-yellow-700 text-white"
														: "bg-yellow-500 text-white"
													: darkMode
													? "text-gray-300 hover:bg-gray-600"
													: "text-gray-600 hover:bg-gray-200"
											}`}
									>
										New Users
									</button>
								</div>
							</div>

							<div className="w-full h-72">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart
										data={getData()}
										margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
									>
										<defs>
											<linearGradient
												id="colorMetric"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor={CHART_LINE_COLORS[activeMetric]}
													stopOpacity={0.8}
												/>
												<stop
													offset="95%"
													stopColor={CHART_LINE_COLORS[activeMetric]}
													stopOpacity={0.1}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke={darkMode ? "#555" : "#ccc"}
										/>
										<XAxis dataKey="name" stroke={darkMode ? "#aaa" : "#666"} />
										<YAxis stroke={darkMode ? "#aaa" : "#666"} />
										<Tooltip content={<CustomTooltip darkMode={darkMode} />} />
										<Area
											type="monotone"
											dataKey={activeMetric}
											stroke={CHART_LINE_COLORS[activeMetric]}
											fillOpacity={1}
											fill={`url(#colorMetric)`}
											strokeWidth={3}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div
							className={`${
								darkMode ? "bg-gray-700" : "bg-white"
							} rounded-2xl p-6 shadow-md`}
						>
							<h2
								className={`text-xl font-semibold mb-4 ${
									darkMode ? "text-gray-200" : "text-gray-700"
								}`}
							>
								Traffic Sources
							</h2>

							<div className="w-full h-72 flex items-center justify-center">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={trafficSourceData}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={80}
											fill="#8884d8"
											dataKey="value"
											label={({ name, percent }) =>
												`${name}: ${(percent * 100).toFixed(0)}%`
											}
										>
											{trafficSourceData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip content={<CustomTooltip darkMode={darkMode} />} />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div
							className={`${
								darkMode ? "bg-gray-700" : "bg-white"
							} rounded-2xl p-6 shadow-md`}
						>
							<h2
								className={`text-xl font-semibold mb-4 ${
									darkMode ? "text-gray-200" : "text-gray-700"
								}`}
							>
								Device Usage
							</h2>

							<div className="w-full h-60">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={deviceData}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke={darkMode ? "#555" : "#ccc"}
										/>
										<XAxis dataKey="name" stroke={darkMode ? "#aaa" : "#666"} />
										<YAxis stroke={darkMode ? "#aaa" : "#666"} />
										<Tooltip
											content={<CustomTooltip darkMode={darkMode} />}
											itemStyle={{
												backgroundColor: darkMode ? "#374151" : "#ffffff",
											}}
											contentStyle={{
												backgroundColor: darkMode ? "#374151" : "#ffffff",
												border: darkMode
													? "1px solid #4B5563"
													: "1px solid #E5E7EB",
											}}
											labelStyle={{ color: darkMode ? "#D1D5DB" : "#374151" }}
										/>
										<Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]}>
											{deviceData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div
							className={`${
								darkMode ? "bg-gray-700" : "bg-white"
							} rounded-2xl p-6 shadow-md`}
						>
							<h2
								className={`text-xl font-semibold mb-4 ${
									darkMode ? "text-gray-200" : "text-gray-700"
								}`}
							>
								Top Pages
							</h2>

							<div className="overflow-x-auto">
								<table className="min-w-full">
									<thead>
										<tr
											className={`${
												darkMode ? "border-gray-600" : "border-gray-200"
											} border-b`}
										>
											<th
												className={`px-4 py-3 text-left ${
													darkMode ? "text-gray-300" : "text-gray-600"
												}`}
											>
												Page
											</th>
											<th
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-600"
												}`}
											>
												Views
											</th>
											<th
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-600"
												}`}
											>
												Avg. Time
											</th>
										</tr>
									</thead>
									<tbody>
										<tr
											className={`${
												darkMode
													? "border-gray-600 hover:bg-gray-600"
													: "border-gray-200 hover:bg-gray-100"
											} border-b cursor-pointer transition-colors`}
										>
											<td
												className={`px-4 py-3 ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												/home
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												1,234
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												2.5m
											</td>
										</tr>
										<tr
											className={`${
												darkMode
													? "border-gray-600 hover:bg-gray-600"
													: "border-gray-200 hover:bg-gray-100"
											} border-b cursor-pointer transition-colors`}
										>
											<td
												className={`px-4 py-3 ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												/products
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												987
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												1.8m
											</td>
										</tr>
										<tr
											className={`${
												darkMode
													? "border-gray-600 hover:bg-gray-600"
													: "border-gray-200 hover:bg-gray-100"
											} border-b cursor-pointer transition-colors`}
										>
											<td
												className={`px-4 py-3 ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												/about
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												765
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												3.1m
											</td>
										</tr>
										<tr
											className={`${
												darkMode
													? "border-gray-600 hover:bg-gray-600"
													: "border-gray-200 hover:bg-gray-100"
											} border-b cursor-pointer transition-colors`}
										>
											<td
												className={`px-4 py-3 ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												/blog
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												543
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												4.2m
											</td>
										</tr>
										<tr
											className={`${
												darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
											} cursor-pointer transition-colors`}
										>
											<td
												className={`px-4 py-3 ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												/contact
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												321
											</td>
											<td
												className={`px-4 py-3 text-right ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												1.5m
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							<div className="mt-4 text-center">
								<button
									className={`${
										darkMode
											? "bg-blue-600 hover:bg-blue-700"
											: "bg-blue-500 hover:bg-blue-600"
									} 
                  text-white font-medium py-2 px-4 rounded-lg text-sm cursor-pointer transition-colors`}
								>
									View All Pages
								</button>
							</div>
						</div>
					</div>

					<div
						className={`mt-8 pt-4 border-t ${
							darkMode
								? "border-gray-600 text-gray-400"
								: "border-gray-200 text-gray-500"
						} text-sm flex justify-between items-center`}
					>
						<div>Last updated: Today at 15:42</div>
						<div className="flex space-x-4">
							<button className="cursor-pointer hover:underline">
								Refresh Data
							</button>
							<button className="cursor-pointer hover:underline">
								Dashboard Settings
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
