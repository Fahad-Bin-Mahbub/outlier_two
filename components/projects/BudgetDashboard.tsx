"use client";
import React, { useState, useEffect } from "react";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	BarChart,
	Bar,
	AreaChart,
	Area,
} from "recharts";
import {
	ArrowUpIcon,
	ArrowDownIcon,
	DollarSign,
	Info,
	TrendingUp,
	MoonIcon,
	SunIcon,
	CreditCard,
	BarChart2,
	PieChart as PieChartIcon,
	Home,
	ShoppingBag,
	Coffee,
	Film,
	Car,
	Trash2,
	Plus,
	Lightbulb,
} from "lucide-react";

interface Expense {
	id: number;
	category: string;
	amount: number;
	limit: number;
	color: string;
	icon: React.ReactNode;
}

interface MetricCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
	type: "income" | "positive" | "negative";
	change?: number;
}

const getTrendData = () => {
	const months = [
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
	return months.map((month, index) => {
		const base = 800 + Math.random() * 400;
		const target = base * (1 + Math.sin(index / 2) * 0.3);

		return {
			name: month,
			actual: Math.round(base),
			target: Math.round(target),
			savings: Math.round(base * 0.2 + Math.random() * 100),
		};
	});
};

const BudgetDashboard = () => {
	const [income, setIncome] = useState(3000);
	const [expenses, setExpenses] = useState<Expense[]>([
		{
			id: 1,
			category: "Housing",
			amount: 1200,
			limit: 1300,
			color: "#007AFF",
			icon: <Home size={18} />,
		},
		{
			id: 2,
			category: "Food",
			amount: 450,
			limit: 500,
			color: "#34C759",
			icon: <Coffee size={18} />,
		},
		{
			id: 3,
			category: "Entertainment",
			amount: 600,
			limit: 300,
			color: "#AF52DE",
			icon: <Film size={18} />,
		},
		{
			id: 4,
			category: "Transport",
			amount: 200,
			limit: 250,
			color: "#FF9500",
			icon: <Car size={18} />,
		},
		{
			id: 5,
			category: "Shopping",
			amount: 350,
			limit: 300,
			color: "#FF2D55",
			icon: <ShoppingBag size={18} />,
		},
	]);
	const [selectedTimeFrame, setSelectedTimeFrame] = useState("monthly");
	const [hoveredItem, setHoveredItem] = useState<number | null>(null);
	const [theme, setTheme] = useState("light");
	const [showTooltip, setShowTooltip] = useState(false);
	const [tooltipContent, setTooltipContent] = useState({
		title: "",
		message: "",
	});
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const totalLimit = expenses.reduce((sum, exp) => sum + exp.limit, 0);
	const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
	const budgetPercentage = Math.round((totalSpending / totalLimit) * 100);
	const remainingBalance = income - totalSpending;

	const trendData = getTrendData();

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
		localStorage.setItem("theme", newTheme);
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") || "light";
		setTheme(savedTheme);
		document.documentElement.setAttribute("data-theme", savedTheme);
	}, []);

	const updateAmount = (id: number, newAmount: number) => {
		if (newAmount < 0) return;
		setExpenses(
			expenses.map((exp) =>
				exp.id === id ? { ...exp, amount: Number(newAmount) } : exp
			)
		);
	};

	const updateLimit = (id: number, newLimit: number) => {
		if (newLimit < 0) return;
		setExpenses(
			expenses.map((exp) =>
				exp.id === id ? { ...exp, limit: Number(newLimit) } : exp
			)
		);
	};

	const updateIncome = (newIncome: number) => {
		if (newIncome < 0) return;
		setIncome(Number(newIncome));
	};

	const chartData = expenses.map((exp) => ({
		name: exp.category,
		value: exp.amount,
		percentage: Math.round((exp.amount / totalSpending) * 100),
		color: exp.color,
	}));

	const barData = expenses.map((exp) => ({
		name: exp.category,
		spending: exp.amount,
		limit: exp.limit,
		overBudget: Math.max(0, exp.amount - exp.limit),
	}));

	const recentTransactions = [
		{
			id: 1,
			title: "Groceries",
			amount: 78.52,
			date: "Today",
			category: "Food",
			icon: <ShoppingBag size={16} color="#30D158" />,
		},
		{
			id: 2,
			title: "Netflix",
			amount: 13.99,
			date: "Yesterday",
			category: "Entertainment",
			icon: <Film size={16} color="#BF5AF2" />,
		},
		{
			id: 3,
			title: "Uber",
			amount: 24.3,
			date: "2 days ago",
			category: "Transport",
			icon: <Car size={16} color="#FF9F0A" />,
		},
		{
			id: 4,
			title: "Amazon",
			amount: 45.99,
			date: "3 days ago",
			category: "Shopping",
			icon: <ShoppingBag size={16} color="#FF375F" />,
		},
	];

	const insights = [
		{
			title: "Spending Trend",
			text: "Your entertainment spending is 50% higher than last month.",
			icon: <TrendingUp className="w-5 h-5 text-chart-purple" />,
			color: "bg-purple-500/30 text-chart-purple",
		},
		{
			title: "Budget Alert",
			text: "You've exceeded your entertainment budget by $300.",
			icon: <Info className="w-5 h-5 text-chart-pink" />,
			color: "bg-pink-500/30 text-chart-pink",
		},
		{
			title: "Savings Potential",
			text: "Reducing food expenses by 10% could save you $45 monthly.",
			icon: <DollarSign className="w-5 h-5 text-chart-green" />,
			color: "bg-green-500/30 text-chart-green",
		},
	];

	const COLORS = expenses.map((exp) => exp.color);

	const renderColorfulLegendText = (value: string, entry: any) => {
		const { color } = entry;
		return <span style={{ color }}>{value}</span>;
	};

	const formatNumber = (num: number): string => {
		return num.toLocaleString("en-US");
	};

	const getSuggestion = (
		category: string,
		amount: number,
		limit: number
	): string => {
		const diff = amount - limit;
		const percentage = Math.round((diff / limit) * 100);

		if (diff > 0) {
			switch (category) {
				case "Housing":
					return `Your housing costs are ${percentage}% over budget. Maybe it's time to consider a nice cardboard box under a bridge? Just kidding, but maybe negotiate that rent!`;
				case "Food":
					return `${percentage}% over your food budget! Are you eating gold-plated avocado toast? Time to embrace the ramen lifestyle... at least until payday.`;
				case "Entertainment":
					return `Entertainment is ${percentage}% over budget. Netflix and actually chill (with the AC off to save money) might be your new weekend plan.`;
				case "Transport":
					return `Somehow you're ${percentage}% over your transport budget. Have you considered the ancient transportation technique known as "walking"?`;
				case "Shopping":
					return `Shopping is ${percentage}% over budget. Your future self called and would like some money left for retirement, please.`;
				default:
					return `You're ${percentage}% over budget for ${category}. That money isn't going to save itself!`;
			}
		}

		const underPercentage = Math.abs(percentage);
		switch (category) {
			case "Housing":
				return `You're ${underPercentage}% under housing budget! Either you're an amazing negotiator or your place has "rustic features" (aka problems).`;
			case "Food":
				return `${underPercentage}% under food budget! Either you're a meal prep master or you've discovered photosynthesis.`;
			case "Entertainment":
				return `${underPercentage}% under entertainment budget. Who knew watching paint dry could be so fulfilling?`;
			case "Transport":
				return `Transport budget ${underPercentage}% under! Your car must run on hopes and dreams instead of gas.`;
			case "Shopping":
				return `Shopping ${underPercentage}% under budget. Your self-control is stronger than mine at a clearance sale!`;
			default:
				return `Impressive! You're ${underPercentage}% under budget for ${category}. Teach me your ways, O Wise One.`;
		}
	};

	const handleTooltip = (
		title: string,
		message: string,
		event: React.MouseEvent
	) => {
		setTooltipContent({ title, message });
		setTooltipPosition({ x: event.clientX, y: event.clientY });
		setShowTooltip(true);
	};

	return (
		<div
			className="min-h-screen pb-8 bg-[rgb(var(--bg-color))] transition-colors duration-300"
			data-theme={theme}
		>
			<header className="border-b border-[rgb(var(--border-color))]/30 py-4 md:py-6 px-4 md:px-6 mb-4 md:mb-6 bg-[rgb(var(--card-bg-rgb))]/50 backdrop-blur-sm sticky top-0 z-10 transition-all duration-300">
				<div className="flex justify-between items-center">
					<div className="flex items-center">
						<div className="w-8 h-8 md:w-10 md:h-10 bg-[rgb(var(--primary-color))]/20 rounded-lg flex items-center justify-center mr-2 md:mr-3 transition-all duration-300">
							<BarChart2 className="text-[rgb(var(--primary-color))] w-5 h-5 md:w-6 md:h-6" />
						</div>
						<div>
							<h1 className="text-xl md:text-3xl font-bold text-[rgb(var(--text-primary))] transition-colors duration-300">
								Budget Analytics
							</h1>
							<p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] transition-colors duration-300">
								Track your spending with ease
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{remainingBalance > 0 ? (
							<span className="hidden md:inline-flex px-3 py-1 text-xs font-medium bg-green-500/20 text-green-500 rounded-full">
								${formatNumber(remainingBalance)} left this month
							</span>
						) : (
							<span className="hidden md:inline-flex px-3 py-1 text-xs font-medium bg-red-500/20 text-red-500 rounded-full">
								${formatNumber(Math.abs(remainingBalance))} over budget
							</span>
						)}
						<button
							onClick={toggleTheme}
							className="p-2 md:p-3 rounded-full hover:bg-[rgb(var(--border-color))]/30 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-color))]/50"
							aria-label={
								theme === "dark"
									? "Switch to light mode"
									: "Switch to dark mode"
							}
						>
							{theme === "dark" ? (
								<SunIcon className="w-5 h-5 text-[rgb(var(--text-primary))]" />
							) : (
								<MoonIcon className="w-5 h-5 text-[rgb(var(--text-primary))]" />
							)}
						</button>
					</div>
				</div>
			</header>

			<div className="px-4 md:px-6 max-w-7xl mx-auto">
				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
					<MetricCard
						title="Total Income"
						value={`$${formatNumber(income)}`}
						icon={
							<DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
						}
						type="income"
					/>
					<MetricCard
						title="Total Expenses"
						value={`$${formatNumber(totalSpending)}`}
						icon={<CreditCard className="w-5 h-5 md:w-6 md:h-6" />}
						type={totalSpending > totalLimit ? "negative" : "positive"}
						change={Math.round(
							((totalSpending - totalLimit) / totalLimit) * 100
						)}
					/>
					<MetricCard
						title="Budget Status"
						value={`${budgetPercentage}%`}
						icon={<BarChart2 className="w-5 h-5 md:w-6 md:h-6" />}
						type={budgetPercentage > 100 ? "negative" : "positive"}
					/>
					<MetricCard
						title={totalSpending > totalLimit ? "Over Budget" : "Remaining"}
						value={`$${formatNumber(Math.abs(totalLimit - totalSpending))}`}
						icon={<PieChartIcon className="w-5 h-5 md:w-6 md:h-6" />}
						type={totalSpending > totalLimit ? "negative" : "positive"}
					/>
				</div>

				<div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6">
					<div className="mb-3 sm:mb-0 w-full sm:w-auto">
						<div className="relative group">
							<div className="flex flex-col w-full">
								<div className="relative">
									<input
										type="number"
										value={income}
										onChange={(e) => updateIncome(Number(e.target.value))}
										className="px-3 py-2 pl-10 md:px-4 md:py-3 md:pl-12 bg-[rgb(var(--card-bg-rgb))] border-2 border-[rgb(var(--border-color))]/40 rounded-lg text-[rgb(var(--text-primary))] w-full sm:w-52 md:w-60 text-base font-medium focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-color))]/60 focus:border-[rgb(var(--primary-color))] shadow-sm hover:shadow transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										placeholder="0"
										aria-label="Monthly Income"
									/>
									<div className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-[rgb(var(--primary-color))]/10 group-hover:bg-[rgb(var(--primary-color))]/15 transition-colors duration-200">
										<DollarSign className="w-4 h-4 md:w-5 md:h-5 text-[rgb(var(--primary-color))]" />
									</div>
								</div>
								<label className="text-xs md:text-sm font-medium text-[rgb(var(--text-secondary))] mt-2 ml-1">
									Monthly Income
								</label>
							</div>
						</div>
					</div>
					{/* <div
						className="inline-flex rounded-lg shadow-sm bg-[rgb(var(--card-hover-bg-rgb))] p-0.5 transition-all duration-300"
						role="group"
					>
						{["weekly", "monthly", "yearly"].map((period) => (
							<button
								key={period}
								type="button"
								onClick={() => setSelectedTimeFrame(period)}
								className={`px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
									selectedTimeFrame === period
										? "bg-[rgb(var(--card-bg-rgb))] text-[rgb(var(--text-primary))] shadow-sm"
										: "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--card-bg-rgb))]/50"
								}`}
							>
								{period.charAt(0).toUpperCase() + period.slice(1)}
							</button>
						))}
					</div> */}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
					<div className="chart-card p-4 md:p-6 bg-[rgb(var(--card-bg-rgb))] rounded-xl border border-[rgb(var(--border-color))]/20 shadow-sm hover:shadow-md transition-all duration-300">
						<div className="flex justify-between items-start mb-3 md:mb-4">
							<div>
								<h2 className="text-base md:text-lg font-semibold text-[rgb(var(--text-primary))] transition-colors duration-300">
									Monthly Spending Trends
								</h2>
								<p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] transition-colors duration-300">
									Tracking your spending patterns over time
								</p>
							</div>
							<span className="px-2 py-1 text-xs font-medium bg-[rgb(var(--primary-color))]/20 text-[rgb(var(--primary-color))] rounded-full">
								YTD
							</span>
						</div>
						<div className="h-56 md:h-64 lg:h-80">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={trendData}
									margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
								>
									<defs>
										<linearGradient
											id="colorSpending"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop offset="5%" stopColor="#64D2FF" stopOpacity={0.8} />
											<stop offset="95%" stopColor="#64D2FF" stopOpacity={0} />
										</linearGradient>
										<linearGradient
											id="colorTarget"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop offset="5%" stopColor="#BF5AF2" stopOpacity={0.8} />
											<stop offset="95%" stopColor="#BF5AF2" stopOpacity={0} />
										</linearGradient>
									</defs>
									<XAxis
										dataKey="name"
										stroke="var(--chart-axis-color)"
										fontSize={10}
										tickLine={false}
										axisLine={{ stroke: "var(--chart-axis-color)" }}
									/>
									<YAxis
										stroke="var(--chart-axis-color)"
										fontSize={10}
										tickLine={false}
										axisLine={{ stroke: "var(--chart-axis-color)" }}
										tickFormatter={(value) => `$${value}`}
									/>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="var(--chart-grid-color)"
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "var(--tooltip-bg)",
											borderColor: "var(--tooltip-border)",
											borderRadius: "6px",
											boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
										}}
										labelStyle={{ color: "var(--tooltip-text)" }}
										itemStyle={{ color: "var(--tooltip-text)" }}
									/>
									<Area
										type="monotone"
										dataKey="actual"
										stroke="#64D2FF"
										fillOpacity={1}
										fill="url(#colorSpending)"
										name="Actual Spending"
										animationDuration={1500}
									/>
									<Area
										type="monotone"
										dataKey="target"
										stroke="#BF5AF2"
										fillOpacity={1}
										fill="url(#colorTarget)"
										strokeDasharray="3 3"
										name="Budget Target"
										animationDuration={1500}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="chart-card p-4 md:p-6 bg-[rgb(var(--card-bg-rgb))] rounded-xl border border-[rgb(var(--border-color))]/20 shadow-sm hover:shadow-md transition-all duration-300">
						<div className="flex justify-between items-start mb-3 md:mb-4">
							<div>
								<h2 className="text-base md:text-lg font-semibold text-[rgb(var(--text-primary))] transition-colors duration-300">
									Spending by Category
								</h2>
								<p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] transition-colors duration-300">
									How your money is distributed
								</p>
							</div>
							<span className="px-2 py-1 text-xs font-medium bg-[rgb(var(--secondary-color))]/20 text-[rgb(var(--secondary-color))] rounded-full">
								Current Month
							</span>
						</div>
						<div className="h-42 md:h-64 lg:h-80">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={chartData}
										cx="50%"
										cy="50%"
										labelLine={false}
										outerRadius={100}
										fill="#8884d8"
										dataKey="value"
										label={({ name, percent }) =>
											`${name}: ${(percent * 100).toFixed(0)}%`
										}
										animationDuration={1000}
										animationBegin={200}
									>
										{chartData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index]}
												className="hover:opacity-80 transition-opacity duration-300"
											/>
										))}
									</Pie>
									{/* <Legend
										formatter={renderColorfulLegendText}
										layout="vertical"
										verticalAlign="middle"
										align="right"
										iconType="circle"
										wrapperStyle={{ fontSize: "11px", paddingLeft: "10px" }}
									/> */}
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
					<div className="chart-card lg:col-span-2 p-4 md:p-6 bg-[rgb(var(--card-bg-rgb))] rounded-xl border border-[rgb(var(--border-color))]/20 shadow-sm hover:shadow-md transition-all duration-300">
						<h2 className="text-base md:text-lg font-semibold text-[rgb(var(--text-primary))] mb-1 transition-colors duration-300">
							Budget vs. Actual Spending
						</h2>
						<p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] mb-3 md:mb-4 transition-colors duration-300">
							See how your spending compares to your budget limits
						</p>
						<div className="h-64 md:h-80 lg:h-96">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={barData}
									margin={{
										top: 20,
										right: 30,
										left: 20,
										bottom: 20,
									}}
									barGap={0}
									barCategoryGap={30}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="var(--chart-grid-color)"
									/>
									<XAxis
										dataKey="name"
										stroke="var(--chart-axis-color)"
										fontSize={10}
										tickLine={false}
										axisLine={{ stroke: "var(--chart-axis-color)" }}
										dy={10}
									/>
									<YAxis
										stroke="var(--chart-axis-color)"
										fontSize={10}
										tickLine={false}
										axisLine={{ stroke: "var(--chart-axis-color)" }}
										tickFormatter={(value) => `$${value}`}
										dx={-10}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "var(--tooltip-bg)",
											borderColor: "var(--tooltip-border)",
											borderRadius: "6px",
											boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
											padding: "8px 12px",
										}}
										labelStyle={{
											color: "var(--tooltip-text)",
											fontWeight: 600,
											marginBottom: "4px",
										}}
										itemStyle={{ color: "var(--tooltip-text-secondary)" }}
									/>
									<Legend
										verticalAlign="top"
										height={36}
										iconType="circle"
										iconSize={8}
										wrapperStyle={{
											paddingBottom: "20px",
											fontSize: "11px",
										}}
									/>
									<Bar
										dataKey="limit"
										fill="#64D2FF"
										name="Budget Limit"
										barSize={40}
										radius={[4, 4, 0, 0]}
										animationDuration={1500}
									/>
									<Bar
										dataKey="spending"
										fill="#30D158"
										name="Actual Spending"
										barSize={40}
										radius={[4, 4, 0, 0]}
										animationDuration={1500}
										animationBegin={300}
									/>
									<Bar
										dataKey="overBudget"
										fill="#FF375F"
										name="Over Budget"
										barSize={40}
										radius={[4, 4, 0, 0]}
										stackId="a"
										animationDuration={1500}
										animationBegin={600}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="chart-card overflow-hidden p-4 md:p-6 bg-[rgb(var(--card-bg-rgb))] rounded-xl border border-[rgb(var(--border-color))]/20 shadow-sm hover:shadow-md transition-all duration-300">
						<h2 className="text-base md:text-lg font-semibold text-[rgb(var(--text-primary))] mb-1 transition-colors duration-300">
							Recent Transactions
						</h2>
						<p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] mb-3 md:mb-4 transition-colors duration-300">
							Your latest expenses
						</p>
						<div className="mt-2 space-y-3 max-h-[240px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
							{recentTransactions.map((transaction, index) => (
								<div
									key={transaction.id}
									className="flex items-center p-3 md:p-4 rounded-lg bg-[rgb(var(--card-hover-bg-rgb))] hover:bg-[rgb(var(--card-bg-rgb))] transition-all duration-200 border border-[rgb(var(--border-color))]/20 transform hover:translate-y-[-2px] hover:shadow-md animate-fadeIn"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									<div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[rgb(var(--card-bg-rgb))] rounded-full mr-2 md:mr-3 border border-[rgb(var(--border-color))]/20 shadow-sm">
										{transaction.icon}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm md:text-base text-[rgb(var(--text-primary))] font-medium truncate transition-colors duration-300">
											{transaction.title}
										</p>
										<p className="text-xs text-[rgb(var(--text-tertiary))] truncate transition-colors duration-300">
											{transaction.category} • {transaction.date}
										</p>
									</div>
									<div className="text-sm md:text-base text-[rgb(var(--text-primary))] font-medium transition-colors duration-300 ml-2">
										${transaction.amount}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="mb-4 md:mb-6">
					<h2 className="text-base md:text-lg font-semibold text-[rgb(var(--text-primary))] mb-3 md:mb-4 transition-colors duration-300">
						Budget Insights
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
						{insights.map((insight, index) => (
							<div
								key={index}
								className="p-4 md:p-5 rounded-xl bg-[rgb(var(--card-bg-rgb))] hover:bg-[rgb(var(--card-hover-bg-rgb))] transition-all duration-300 border border-[rgb(var(--border-color))]/20 shadow-sm hover:shadow-md transform hover:translate-y-[-2px] cursor-pointer animate-fadeIn"
								style={{ animationDelay: `${index * 150}ms` }}
							>
								<div
									className={`p-2 md:p-3 rounded-lg inline-flex ${
										insight.color.split(" ")[0]
									} mb-2 md:mb-3 shadow-sm`}
								>
									{insight.icon}
								</div>
								<h3 className="text-sm md:text-base font-semibold text-[rgb(var(--text-primary))] mb-1 md:mb-2 transition-colors duration-300">
									{insight.title}
								</h3>
								<p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] transition-colors duration-300">
									{insight.text}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="chart-card p-4 md:p-6 bg-[rgb(var(--card-bg-rgb))] rounded-xl border border-[rgb(var(--border-color))]/20 shadow-md mb-4 md:mb-6 transition-all duration-300">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 md:mb-4">
						<div>
							<h2 className="text-base md:text-lg font-semibold text-[rgb(var(--text-primary))] mb-1 transition-colors duration-300">
								Expense Management
							</h2>
							<p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] transition-colors duration-300">
								Manage and track your budget allocations
							</p>
						</div>
						<div className="mt-2 md:mt-0 px-3 py-1.5 md:px-4 md:py-2 bg-[rgb(var(--card-hover-bg-rgb))] rounded-lg shadow-sm transition-all duration-300">
							<span className="text-xs font-medium text-[rgb(var(--text-tertiary))] transition-colors duration-300">
								Total Budget:{" "}
							</span>
							<span className="text-sm font-semibold text-[rgb(var(--text-primary))] transition-colors duration-300">
								${formatNumber(totalLimit)}
							</span>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
						{expenses.map((expense, index) => (
							<div
								key={expense.id}
								className="p-4 md:p-5 rounded-xl border border-[rgb(var(--border-color))]/30 bg-[rgb(var(--card-hover-bg-rgb))]/40 hover:bg-[rgb(var(--card-hover-bg-rgb))]/70 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md transform hover:translate-y-[-2px] animate-fadeIn"
								style={{ animationDelay: `${index * 100}ms` }}
								onMouseEnter={() => setHoveredItem(expense.id)}
								onMouseLeave={() => setHoveredItem(null)}
							>
								<div
									className="absolute top-0 left-0 h-full w-1.5 rounded-l-lg"
									style={{ backgroundColor: expense.color }}
								></div>

								<div className="flex justify-between items-center mb-3 md:mb-4 pl-3">
									<div className="flex items-center">
										<div
											className="w-8 h-8 md:w-10 md:h-10 rounded-lg mr-2 md:mr-3 flex items-center justify-center shadow-sm"
											style={{ backgroundColor: expense.color,
												color: "white"
											 }}
										>
											{expense.icon}
										</div>
										<h3 className="text-sm md:text-base font-medium text-[rgb(var(--text-primary))] transition-colors duration-300">
											{expense.category}
										</h3>
									</div>
									<div
										className={`text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-full font-medium ${
											expense.amount > expense.limit
												? "bg-red-500/20 text-red-500"
												: "bg-green-500/20 text-green-500"
										} ${
											theme === "dark" && expense.amount > expense.limit
												? "bg-red-900/20 text-red-400"
												: ""
										} 
									${
										theme === "dark" && expense.amount <= expense.limit
											? "bg-green-900/20 text-green-400"
											: ""
									} shadow-sm`}
									>
										{expense.amount > expense.limit
											? `${Math.round(
													((expense.amount - expense.limit) / expense.limit) *
														100
											  )}% Over`
											: `${Math.round(
													((expense.limit - expense.amount) / expense.limit) *
														100
											  )}% Under`}
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pl-3 mb-3 md:mb-4">
									<div>
										<div className="flex justify-between items-center mb-1">
											<span className="text-xs text-[rgb(var(--text-tertiary))] transition-colors duration-300">
												Current Spending
											</span>
											<span
												className={`text-xs md:text-sm font-medium ${
													expense.amount > expense.limit
														? "text-red-500"
														: "text-green-500"
												} ${
													theme === "dark" && expense.amount > expense.limit
														? "text-red-400"
														: ""
												}
											${
												theme === "dark" && expense.amount <= expense.limit
													? "text-green-400"
													: ""
											} transition-colors duration-300`}
											>
												${expense.amount}
											</span>
										</div>
										<div className="relative">
											<input
												type="number"
												value={expense.amount}
												onChange={(e) =>
													updateAmount(expense.id, Number(e.target.value))
												}
												className="w-full bg-[rgb(var(--card-bg-rgb))] border border-[rgb(var(--border-color))]/40 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-color))]/50 focus:border-[rgb(var(--primary-color))] transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
											/>
											<DollarSign className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-[rgb(var(--text-tertiary))]" />
										</div>
									</div>

									<div>
										<div className="flex justify-between items-center mb-1">
											<span className="text-xs text-[rgb(var(--text-tertiary))] transition-colors duration-300">
												Budget Limit
											</span>
											<span className="text-xs md:text-sm font-medium text-[rgb(var(--primary-color))] transition-colors duration-300">
												${expense.limit}
											</span>
										</div>
										<div className="relative">
											<input
												type="number"
												value={expense.limit}
												onChange={(e) =>
													updateLimit(expense.id, Number(e.target.value))
												}
												className="w-full bg-[rgb(var(--card-bg-rgb))] border border-[rgb(var(--border-color))]/40 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-color))]/50 focus:border-[rgb(var(--primary-color))] transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
											/>
											<DollarSign className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-[rgb(var(--text-tertiary))]" />
										</div>
									</div>
								</div>

								<div className="pl-3">
									<div className="flex justify-between items-center text-xs text-[rgb(var(--text-tertiary))] mb-1 transition-colors duration-300">
										<span>Progress</span>
										<span>
											{Math.round((expense.amount / expense.limit) * 100)}%
										</span>
									</div>
									<div className="w-full bg-[rgb(var(--border-color))]/20 rounded-full h-2 md:h-2.5 mb-1 overflow-hidden shadow-inner">
										<div
											className={`h-2 md:h-2.5 rounded-full transition-all duration-1000 ease-in-out ${
												expense.amount > expense.limit
													? "bg-red-500"
													: "bg-[rgb(var(--primary-color))]"
											} ${
												theme === "dark" && expense.amount > expense.limit
													? "bg-red-600"
													: ""
											}`}
											style={{
												width: `${Math.min(
													(expense.amount / expense.limit) * 100,
													100
												)}%`,
											}}
										>
											{expense.amount > expense.limit && (
												<div
													className="h-2 md:h-2.5 rounded-r-full bg-[rgb(var(--primary-color))]"
													style={{
														width: `${(expense.limit / expense.amount) * 100}%`,
													}}
												></div>
											)}
										</div>
									</div>
								</div>

								{hoveredItem === expense.id && (
									<div className="mt-3 md:mt-4 overflow-hidden transition-all duration-300 ease-in-out opacity-100 animate-fadeIn">
										<div className="p-3 md:p-4 rounded-lg text-xs md:text-sm text-[rgb(var(--text-secondary))] bg-[rgb(var(--card-bg-rgb))]/95 backdrop-blur-sm shadow-md border border-[rgb(var(--border-color))]/30 transform translate-y-0">
											<div className="flex items-start">
												<div className="mr-2 md:mr-3 mt-0.5">
													{expense.amount > expense.limit ? (
														<Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-[rgb(var(--primary-color))]" />
													) : (
														<span
															role="img"
															aria-label="thumbs up"
															className="text-base md:text-lg"
														>
															👍
														</span>
													)}
												</div>
												<div>
													<p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] leading-relaxed transition-colors duration-300">
														{getSuggestion(
															expense.category,
															expense.amount,
															expense.limit
														)}
													</p>
													{expense.amount > expense.limit && (
														<div className="mt-2 md:mt-3 text-xs text-[rgb(var(--text-tertiary))] flex items-center transition-colors duration-300">
															<span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
															<span>
																Try to reduce your{" "}
																{expense.category.toLowerCase()} expenses by $
																{(expense.amount - expense.limit).toFixed(2)}{" "}
																this month
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{}
				<div className="fixed bottom-24 right-4 md:hidden z-10">
					<button
						className="w-12 h-12 rounded-full bg-[rgb(var(--primary-color))] text-white flex items-center justify-center shadow-lg hover:bg-[rgb(var(--primary-color))]/90 transition-all focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-color))]/50 active:scale-95"
						aria-label="Add new expense"
					>
						<Plus className="w-5 h-5" />
					</button>
				</div>

				{}
				<div className="fixed bottom-0 left-0 right-0 bg-[rgb(var(--card-bg-rgb))] border-t border-[rgb(var(--border-color))]/30 p-3 flex justify-around md:hidden z-10">
					<button className="flex flex-col items-center space-y-1 text-[rgb(var(--primary-color))]">
						<Home className="w-5 h-5" />
						<span className="text-xs">Dashboard</span>
					</button>
					<button className="flex flex-col items-center space-y-1 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]">
						<BarChart2 className="w-5 h-5" />
						<span className="text-xs">Reports</span>
					</button>
					<button className="flex flex-col items-center space-y-1 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]">
						<CreditCard className="w-5 h-5" />
						<span className="text-xs">Expenses</span>
					</button>
					<button className="flex flex-col items-center space-y-1 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]">
						<PieChartIcon className="w-5 h-5" />
						<span className="text-xs">Budgets</span>
					</button>
				</div>
			</div>

			{}
			{showTooltip && (
				<div
					className="fixed bg-[rgb(var(--card-bg-rgb))] border border-[rgb(var(--border-color))]/40 p-3 rounded-lg shadow-lg z-50 max-w-xs animate-fadeIn"
					style={{
						left: `${tooltipPosition.x + 10}px`,
						top: `${tooltipPosition.y - 10}px`,
					}}
				>
					<h3 className="font-medium text-[rgb(var(--text-primary))]">
						{tooltipContent.title}
					</h3>
					<p className="text-sm text-[rgb(var(--text-secondary))]">
						{tooltipContent.message}
					</p>
				</div>
			)}

			<footer className="mt-6 md:mt-12 text-center text-[rgb(var(--text-tertiary))] text-xs py-4 md:py-6 border-t border-[rgb(var(--border-color))]/20 pb-20 md:pb-6">
				<div className="max-w-7xl mx-auto px-4 md:px-6">
					<p className="mb-2">
						© 2025 Budget Analytics Dashboard | All Rights Reserved
					</p>
					<div className="flex justify-center space-x-4 mt-2 md:mt-3">
						<a
							href="#"
							className="hover:text-[rgb(var(--primary-color))] transition-colors duration-200 cursor-pointer"
						>
							Terms
						</a>
						<a
							href="#"
							className="hover:text-[rgb(var(--primary-color))] transition-colors duration-200 cursor-pointer"
						>
							Privacy
						</a>
						<a
							href="#"
							className="hover:text-[rgb(var(--primary-color))] transition-colors duration-200 cursor-pointer"
						>
							Help
						</a>
					</div>
				</div>
			</footer>

			<style jsx global>{`
				:root {
					--bg-color: 18, 18, 20;
					--card-bg-rgb: 28, 28, 30;
					--card-hover-bg-rgb: 44, 44, 46;
					--border-color: 86, 86, 92;
					--text-primary: 255, 255, 255;
					--text-secondary: 220, 220, 225;
					--text-tertiary: 170, 170, 175;
					--primary-color: 10, 132, 255;
					--secondary-color: 191, 90, 242;
					--positive-color: 52, 199, 89;
					--negative-color: 255, 69, 58;
					--chart-grid-color: rgba(100, 100, 105, 0.4);
					--chart-axis-color: rgba(180, 180, 190, 0.9);
					--tooltip-bg: rgb(44, 44, 46);
					--tooltip-border: rgb(64, 64, 68);
					--tooltip-text: rgb(250, 250, 255);
					--tooltip-text-secondary: rgb(200, 200, 210);
				}

				[data-theme="light"] {
					--bg-color: 242, 242, 247;
					--card-bg-rgb: 255, 255, 255;
					--card-hover-bg-rgb: 248, 248, 253;
					--border-color: 218, 218, 223;
					--text-primary: 0, 0, 0;
					--text-secondary: 60, 60, 67;
					--text-tertiary: 110, 110, 115;
					--primary-color: 0, 122, 255;
					--secondary-color: 175, 82, 222;
					--positive-color: 52, 199, 89;
					--negative-color: 255, 59, 48;
					--chart-grid-color: rgba(210, 210, 215, 0.8);
					--chart-axis-color: rgba(100, 100, 105, 0.9);
					--tooltip-bg: rgb(255, 255, 255);
					--tooltip-border: rgb(230, 230, 235);
					--tooltip-text: rgb(0, 0, 0);
					--tooltip-text-secondary: rgb(60, 60, 67);
				}

				body {
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
						Helvetica, Arial, sans-serif;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}

				button {
					transition: all 0.2s ease;
					transform-origin: center;
				}

				button:active {
					transform: scale(0.97);
				}

				button:focus-visible,
				input:focus-visible {
					outline: 2px solid rgb(var(--primary-color));
					outline-offset: 2px;
				}

				.badge {
					@apply inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium rounded-full;
				}

				.badge-primary {
					@apply bg-[rgb(var(--primary-color))]/20 text-[rgb(var(--primary-color))];
				}

				.badge-secondary {
					@apply bg-[rgb(var(--secondary-color))]/20 text-[rgb(var(--secondary-color))];
				}

				.text-chart-purple {
					color: #bf5af2;
				}

				.text-chart-pink {
					color: #ff375f;
				}

				.text-chart-green {
					color: #30d158;
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 4px;
				}

				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(var(--card-hover-bg-rgb), 0.1);
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(var(--border-color), 0.4);
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(var(--border-color), 0.6);
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(5px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out forwards;
				}

				button,
				input,
				a {
					cursor: pointer;
				}

				.recharts-tooltip-item {
					color: var(--tooltip-text-secondary) !important;
				}

				.recharts-default-tooltip {
					background-color: var(--tooltip-bg) !important;
					border-color: var(--tooltip-border) !important;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
				}

				.recharts-tooltip-label {
					color: var(--tooltip-text) !important;
				}

				.recharts-layer.recharts-cartesian-axis-tick-value tspan {
					fill: var(--chart-axis-color);
				}

				@keyframes pulsate {
					0% {
						opacity: 0.7;
					}
					50% {
						opacity: 1;
					}
					100% {
						opacity: 0.7;
					}
				}

				.pulse-warning {
					animation: pulsate 2s ease-in-out infinite;
				}

				@keyframes shimmer {
					0% {
						background-position: -100% 0;
					}
					100% {
						background-position: 100% 0;
					}
				}

				.shimmer {
					background: linear-gradient(
						90deg,
						rgba(var(--card-bg-rgb), 0) 0%,
						rgba(var(--card-hover-bg-rgb), 0.5) 50%,
						rgba(var(--card-bg-rgb), 0) 100%
					);
					background-size: 200% 100%;
					animation: shimmer 3s infinite;
				}

				.recharts-pie-sector:hover {
					opacity: 0.8;
					transform: scale(1.02);
					transition: transform 0.2s ease-out;
					cursor: pointer;
				}

				.recharts-bar-rectangle:hover {
					opacity: 0.85;
					transition: opacity 0.2s ease-out;
					cursor: pointer;
				}

				.high-contrast-text {
					text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
				}

				[data-theme="dark"] .high-contrast-text {
					text-shadow: 0 0 1px rgba(0, 0, 0, 0.8);
				}
			`}</style>
		</div>
	);
};

const MetricCard = ({ title, value, icon, type, change }: MetricCardProps) => {
	const [theme, setTheme] = useState<string>("");

	useEffect(() => {
		const updateTheme = () => {
			const dataTheme =
				document.documentElement.getAttribute("data-theme") || "light";
			setTheme(dataTheme);
		};

		updateTheme();

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "data-theme"
				) {
					updateTheme();
				}
			});
		});

		observer.observe(document.documentElement, { attributes: true });

		return () => observer.disconnect();
	}, []);

	const iconWithColor = React.cloneElement(icon as React.ReactElement, {
		className: `w-5 h-5 md:w-6 md:h-6 text-white`,
	});

	const getTypeColorClass = () => {
		if (type === "income") {
			return theme === "dark" ? "text-green-400" : "text-green-600";
		}
		if (type === "negative") {
			return theme === "dark" ? "text-red-400" : "text-red-600";
		}
		return theme === "dark" ? "text-blue-400" : "text-blue-600";
	};

	const getBackgroundColorClass = () => {
		if (type === "income") {
			return "bg-green-500";
		}
		if (type === "negative") {
			return "bg-red-500";
		}
		return "bg-blue-500";
	};

	return (
		<div className="p-3 md:p-5 bg-[rgb(var(--card-bg-rgb))] rounded-xl border border-[rgb(var(--border-color))]/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px]">
			<p className="text-[rgb(var(--text-tertiary))] text-xs md:text-sm mb-1 md:mb-2 transition-colors duration-300">
				{title}
			</p>
			<div className="flex items-center justify-between">
				<span
					className={`text-base md:text-xl font-bold ${getTypeColorClass()} transition-colors duration-300 high-contrast-text`}
				>
					{value}
				</span>
				<div
					className={`p-1.5 md:p-2 rounded-lg ${getBackgroundColorClass()} shadow-md`}
				>
					{iconWithColor}
				</div>
			</div>
			{change && (
				<div
					className={`flex items-center text-xs md:text-sm mt-2 md:mt-3 ${
						type === "negative"
							? theme === "dark"
								? "text-red-400"
								: "text-red-600"
							: theme === "dark"
							? "text-green-400"
							: "text-green-600"
					} transition-colors duration-300 ${
						type === "negative" ? "pulse-warning" : ""
					}`}
				>
					{type === "negative" ? (
						<ArrowUpIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
					) : (
						<ArrowDownIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
					)}
					{Math.abs(change)}%{" "}
					{type === "negative" ? "over budget" : "under budget"}
				</div>
			)}
		</div>
	);
};

export default BudgetDashboard;
