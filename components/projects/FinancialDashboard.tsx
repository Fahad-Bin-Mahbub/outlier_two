"use client";

import { useState, useEffect } from "react";
import { LineChart, PieChart } from "@mui/x-charts";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

import { Roboto } from "next/font/google";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-roboto",
});

interface StockData {
	id: number;
	symbol: string;
	name: string;
	sector: string;
	price: string;
	change: string;
	changePercent: string;
	volume: number;
	marketCap: string;
	holdings: number;
	value: string;
}

interface PortfolioData {
	id: string;
	sector: string;
	allocation: number;
	value: string;
}

interface HistoricalData {
	month: string;
	value: number;
}

interface DailyPriceData {
	day: string;
	price: number;
}

const theme = {
	light: {
		primary: "#6366F1",
		secondary: "#EC4899",
		success: "#10B981",
		error: "#EF4444",
		warning: "#F59E0B",
		info: "#3B82F6",
		background: {
			main: "#F9FAFB",
			card: "#FFFFFF",
			elevated: "#FFFFFF",
		},
		text: {
			primary: "#111827",
			secondary: "#6B7280",
			muted: "#9CA3AF",
		},
		border: "#E5E7EB",
		divider: "#F3F4F6",
		fonts: {
			base: roboto.variable,
		},
		chart: {
			text: "#111827",
			axis: "#E5E7EB",
			grid: "#F3F4F6",
		},
	},
	dark: {
		primary: "#818CF8",
		secondary: "#F472B6",
		success: "#34D399",
		error: "#F87171",
		warning: "#FBBF24",
		info: "#60A5FA",
		background: {
			main: "#111827",
			card: "#1F2937",
			elevated: "#374151",
		},
		text: {
			primary: "#F9FAFB",
			secondary: "#D1D5DB",
			muted: "#9CA3AF",
		},
		border: "#374151",
		divider: "#1F2937",
		fonts: {
			base: roboto.variable,
		},
		chart: {
			text: "#D1D5DB",
			axis: "#4B5563",
			grid: "#374151",
		},
	},
};

const generateMockStockData = (): StockData[] => {
	const stocks = [
		{ id: 1, symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
		{ id: 2, symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology" },
		{ id: 3, symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
		{
			id: 4,
			symbol: "AMZN",
			name: "Amazon.com Inc.",
			sector: "Consumer Cyclical",
		},
		{ id: 5, symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
		{
			id: 6,
			symbol: "META",
			name: "Meta Platforms Inc.",
			sector: "Technology",
		},
		{ id: 7, symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology" },
		{ id: 8, symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial" },
		{
			id: 9,
			symbol: "BRK.B",
			name: "Berkshire Hathaway Inc.",
			sector: "Financial",
		},
		{ id: 10, symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
	];

	return stocks.map((stock) => {
		const basePrice = Math.random() * 1000 + 50;
		const priceChange = (Math.random() - 0.5) * 20;
		const priceChangePercent = (priceChange / basePrice) * 100;

		return {
			...stock,
			price: basePrice.toFixed(2),
			change: priceChange.toFixed(2),
			changePercent: priceChangePercent.toFixed(2),
			volume: Math.floor(Math.random() * 10000000),
			marketCap: (
				basePrice *
				(Math.random() * 1000000000 + 1000000000)
			).toFixed(0),
			holdings: Math.floor(Math.random() * 1000),
			value: (basePrice * Math.floor(Math.random() * 1000)).toFixed(2),
		};
	});
};

const generateMockPortfolioData = (): PortfolioData[] => {
	const sectors = [
		"Technology",
		"Financial",
		"Healthcare",
		"Consumer Cyclical",
		"Communication",
		"Industrial",
		"Energy",
		"Utilities",
		"Real Estate",
		"Materials",
	];

	return sectors.map((sector) => {
		const allocation = Math.random();
		return {
			id: sector,
			sector,
			allocation,
			value: (allocation * 100000).toFixed(2),
		};
	});
};

const generateHistoricalPriceData = (): HistoricalData[] => {
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
	let baseValue = 10000;

	return months.map((month, index) => {
		const change = (Math.random() - 0.4) * 800;
		baseValue += change;

		return {
			month,
			value: baseValue,
		};
	});
};

const generateDailyPriceData = (): DailyPriceData[] => {
	const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
	let baseValue = 100;

	return days.map((day) => {
		const change = (Math.random() - 0.5) * 5;
		baseValue += change;

		return {
			day,
			price: baseValue,
		};
	});
};

export default function FinancialDashboardExport() {
	const [stockData, setStockData] = useState<StockData[]>([]);
	const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
	const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
	const [dailyPriceData, setDailyPriceData] = useState<DailyPriceData[]>([]);
	const [darkMode, setDarkMode] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [loadingRefresh, setLoadingRefresh] = useState(false);
	const [activeStockIndex, setActiveStockIndex] = useState<number | null>(null);
	const itemsPerPage = 5;

	useEffect(() => {
		refreshData();

		if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			setDarkMode(true);
		}

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", (e) => {
				setDarkMode(e.matches);
			});
	}, []);

	const refreshData = () => {
		setLoadingRefresh(true);

		setTimeout(() => {
			setStockData(generateMockStockData());
			setPortfolioData(generateMockPortfolioData());
			setHistoricalData(generateHistoricalPriceData());
			setDailyPriceData(generateDailyPriceData());
			enqueueSnackbar("Dashboard data refreshed", { variant: "success" });
			setLoadingRefresh(false);
		}, 800);
	};

	const totalPages = Math.ceil(stockData.length / itemsPerPage);
	const paginatedStockData = stockData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const portfolioValue = stockData.reduce(
		(sum, stock) => sum + Number(stock.value),
		0
	);
	const portfolioGain = stockData.reduce(
		(sum, stock) => sum + Number(stock.change) * stock.holdings,
		0
	);
	const portfolioGainPercent =
		portfolioValue > 0 ? (portfolioGain / portfolioValue) * 100 : 0;

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			notation: "compact",
			maximumFractionDigits: 2,
		}).format(value);
	};

	const colors = darkMode ? theme.dark : theme.light;

	return (
		<div
			className={`min-h-screen ${darkMode ? "bg-[#111827]" : "bg-[#F9FAFB]"} ${
				roboto.variable
			} font-roboto transition-colors duration-300`}
		>
			<SnackbarProvider
				maxSnack={3}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">
					{}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
						<div className="flex items-center gap-3">
							<div
								className={`p-2 rounded-xl bg-gradient-to-br ${
									darkMode
										? "from-indigo-500 to-purple-600"
										: "from-indigo-600 to-purple-700"
								} shadow-lg transform transition-all duration-300 hover:scale-105`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7 text-white"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
									<path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
								</svg>
							</div>
							<div>
								<h1
									className={`text-2xl font-medium tracking-tight ${
										darkMode ? "text-white" : "text-gray-900"
									} font-roboto`}
								>
									Financial Dashboard
								</h1>
								<p
									className={`text-sm ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} font-roboto`}
								>
									Real-time market insights
								</p>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<button
								onClick={refreshData}
								disabled={loadingRefresh}
								className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 font-roboto cursor-pointer ${
									darkMode
										? "bg-gray-800 hover:bg-gray-700 text-gray-200"
										: "bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow"
								} ${loadingRefresh ? "opacity-70" : ""}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={`h-4 w-4 ${loadingRefresh ? "animate-spin" : ""}`}
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
										clipRule="evenodd"
									/>
								</svg>
								{loadingRefresh ? "Updating..." : "Refresh"}
							</button>

							<button
								onClick={() => setDarkMode(!darkMode)}
								className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
									darkMode
										? "bg-gray-800 hover:bg-gray-700 text-gray-200"
										: "bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow"
								}`}
							>
								{darkMode ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
									</svg>
								)}
							</button>
						</div>
					</div>

					{}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<div
							className={`rounded-2xl p-6 transition-all duration-300 transform hover:translate-y-[-5px] ${
								darkMode
									? "bg-gray-800 border border-gray-700"
									: "bg-white shadow-sm hover:shadow-md"
							}`}
						>
							<div className="flex items-center justify-between mb-4">
								<p
									className={`text-sm font-medium ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} font-roboto`}
								>
									Total Portfolio Value
								</p>
								<div
									className={`p-2 rounded-lg ${
										darkMode ? "bg-gray-700" : "bg-indigo-50"
									}`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`h-5 w-5 ${
											darkMode ? "text-indigo-400" : "text-indigo-600"
										}`}
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>
							<p
								className={`text-2xl font-medium tracking-tight mb-1 ${
									darkMode ? "text-white" : "text-gray-900"
								} font-roboto`}
							>
								{formatCurrency(portfolioValue)}
							</p>
							<div
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-600"
								} font-roboto`}
							>
								Updated just now
							</div>
						</div>

						<div
							className={`rounded-2xl p-6 transition-all duration-300 transform hover:translate-y-[-5px] ${
								darkMode
									? "bg-gray-800 border border-gray-700"
									: "bg-white shadow-sm hover:shadow-md"
							}`}
						>
							<div className="flex items-center justify-between mb-4">
								<p
									className={`text-sm font-medium ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} font-roboto`}
								>
									Today's Gain/Loss
								</p>
								<div
									className={`p-2 rounded-lg ${
										portfolioGain >= 0
											? darkMode
												? "bg-green-900/30"
												: "bg-green-50"
											: darkMode
											? "bg-red-900/30"
											: "bg-red-50"
									}`}
								>
									{portfolioGain >= 0 ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className={`h-5 w-5 ${
												darkMode ? "text-green-400" : "text-green-600"
											}`}
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className={`h-5 w-5 ${
												darkMode ? "text-red-400" : "text-red-600"
											}`}
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586 20.293 5.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0L13 9.414 8.707 13.707A1 1 0 018 14H12z"
												clipRule="evenodd"
											/>
										</svg>
									)}
								</div>
							</div>
							<p
								className={`text-2xl font-medium mb-1 ${
									portfolioGain >= 0
										? darkMode
											? "text-green-400"
											: "text-green-600"
										: darkMode
										? "text-red-400"
										: "text-red-600"
								} font-roboto`}
							>
								{portfolioGain >= 0 ? "+" : ""}
								{formatCurrency(portfolioGain)}
							</p>
							<div
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-600"
								} font-roboto`}
							>
								vs. previous day
							</div>
						</div>

						<div
							className={`rounded-2xl p-6 transition-all duration-300 transform hover:translate-y-[-5px] ${
								darkMode
									? "bg-gray-800 border border-gray-700"
									: "bg-white shadow-sm hover:shadow-md"
							}`}
						>
							<div className="flex items-center justify-between mb-4">
								<p
									className={`text-sm font-medium ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} font-roboto`}
								>
									Percent Change
								</p>
								<div
									className={`p-2 rounded-lg ${
										portfolioGainPercent >= 0
											? darkMode
												? "bg-green-900/30"
												: "bg-green-50"
											: darkMode
											? "bg-red-900/30"
											: "bg-red-50"
									}`}
								>
									{portfolioGainPercent >= 0 ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className={`h-5 w-5 ${
												darkMode ? "text-green-400" : "text-green-600"
											}`}
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className={`h-5 w-5 ${
												darkMode ? "text-red-400" : "text-red-600"
											}`}
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586 20.293 5.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0L13 9.414 8.707 13.707A1 1 0 018 14H12z"
												clipRule="evenodd"
											/>
										</svg>
									)}
								</div>
							</div>
							<p
								className={`text-2xl font-medium mb-1 ${
									portfolioGainPercent >= 0
										? darkMode
											? "text-green-400"
											: "text-green-600"
										: darkMode
										? "text-red-400"
										: "text-red-600"
								} font-roboto`}
							>
								{portfolioGainPercent >= 0 ? "+" : ""}
								{portfolioGainPercent.toFixed(2)}%
							</p>
							<div
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-600"
								} font-roboto`}
							>
								vs. previous day
							</div>
						</div>

						<div
							className={`rounded-2xl p-6 transition-all duration-300 transform hover:translate-y-[-5px] ${
								darkMode
									? "bg-gray-800 border border-gray-700"
									: "bg-white shadow-sm hover:shadow-md"
							}`}
						>
							<div className="flex items-center justify-between mb-4">
								<p
									className={`text-sm font-medium ${
										darkMode ? "text-gray-300" : "text-gray-600"
									} font-roboto`}
								>
									Total Positions
								</p>
								<div
									className={`p-2 rounded-lg ${
										darkMode ? "bg-purple-900/30" : "bg-purple-50"
									}`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`h-5 w-5 ${
											darkMode ? "text-purple-400" : "text-purple-600"
										}`}
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
									</svg>
								</div>
							</div>
							<p
								className={`text-2xl font-medium mb-1 ${
									darkMode ? "text-white" : "text-gray-900"
								} font-roboto`}
							>
								{stockData.length}
							</p>
							<div
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-600"
								} font-roboto`}
							>
								Active investments
							</div>
						</div>
					</div>

					{}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
						{}
						<div
							className={`lg:col-span-8 rounded-2xl transition-all duration-300 ${
								darkMode
									? "bg-gray-800 border border-gray-700"
									: "bg-white shadow-sm hover:shadow-md"
							}`}
						>
							<div className="p-6">
								<div className="flex items-center justify-between mb-6">
									<div>
										<h2
											className={`text-lg font-medium tracking-tight ${
												darkMode ? "text-white" : "text-gray-900"
											} font-roboto`}
										>
											Portfolio Performance
										</h2>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-600"
											} font-roboto`}
										>
											12-month value trend
										</p>
									</div>
									<div
										className={`px-3 py-1 rounded-lg text-sm ${
											darkMode
												? "bg-gray-700 text-gray-300"
												: "bg-gray-100 text-gray-600"
										} font-roboto`}
									>
										Last 12 months
									</div>
								</div>
								<div className="h-[300px]">
									{historicalData.length > 0 && (
										<LineChart
											series={[
												{
													data: historicalData.map((item) => item.value),
													label: "Portfolio Value",
													color: colors.primary,
													showMark: false,
													area: true,
												},
											]}
											xAxis={[
												{
													data: historicalData.map((item) => item.month),
													scaleType: "band",
													tickLabelStyle: {
														fill: colors.chart.text,
														fontFamily: "var(--font-roboto)",
													},
												},
											]}
											yAxis={[
												{
													tickLabelStyle: {
														fill: colors.chart.text,
														fontFamily: "var(--font-roboto)",
													},
												},
											]}
											height={300}
											margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
											sx={{
												".MuiChartsAxis-line": { stroke: colors.chart.axis },
												".MuiChartsAxis-tick": { stroke: colors.chart.axis },
												".MuiChartsAxis-tickLabel": {
													fill: colors.chart.text,
													fontFamily: "var(--font-roboto)",
												},
												".MuiChartsAxis-grid": { stroke: colors.chart.grid },
												".MuiChartsLegend-label": {
													fill: colors.chart.text,
													fontFamily: "var(--font-roboto)",
												},
											}}
										/>
									)}
								</div>
							</div>
						</div>

						{}
						<div
							className={`lg:col-span-4 rounded-2xl transition-all duration-300 ${
								darkMode
									? "bg-gray-800 border border-gray-700"
									: "bg-white shadow-sm hover:shadow-md"
							}`}
						>
							<div className="p-6">
								<div className="flex items-center justify-between mb-6">
									<div>
										<h2
											className={`text-lg font-medium tracking-tight ${
												darkMode ? "text-white" : "text-gray-900"
											} font-roboto`}
										>
											Sector Allocation
										</h2>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-600"
											} font-roboto`}
										>
											Portfolio distribution
										</p>
									</div>
								</div>
								<div className="h-[300px] flex justify-center">
									{portfolioData.length > 0 && (
										<PieChart
											series={[
												{
													data: portfolioData
														.sort((a, b) => b.allocation - a.allocation)
														.slice(0, 5)
														.map((item) => ({
															id: item.sector,
															value: parseFloat(item.value),
															label: item.sector,
														})),
													innerRadius: 60,
													outerRadius: 120,
													paddingAngle: 2,
													cornerRadius: 4,
													highlightScope: {
														faded: "global",
														highlighted: "item",
													},
													highlighted: {
														additionalRadius: 10,
													},
												},
											]}
											height={300}
											slotProps={{
												legend: { hidden: true } as any,
											}}
											sx={{
												".MuiChartsLegend-label": {
													fill: darkMode ? "#D1D5DB" : "#4B5563",
												},
											}}
										/>
									)}
								</div>
							</div>
						</div>

						{}
						<div
							className={`lg:col-span-12 rounded-2xl overflow-hidden transition-all duration-300 ${
								darkMode
									? "bg-gray-800 border border-gray-700"
									: "bg-white shadow-sm hover:shadow-md"
							}`}
						>
							<div className="p-6">
								<div className="flex items-center justify-between mb-6">
									<div>
										<h2
											className={`text-lg font-medium tracking-tight ${
												darkMode ? "text-white" : "text-gray-900"
											} font-roboto`}
										>
											Stock Holdings
										</h2>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-600"
											} font-roboto`}
										>
											Detailed portfolio positions
										</p>
									</div>
								</div>
								<div className="overflow-x-auto">
									<table
										className={`min-w-full divide-y ${
											darkMode ? "divide-gray-700" : "divide-gray-200"
										}`}
									>
										<thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
											<tr>
												<th
													scope="col"
													className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
														darkMode ? "text-gray-300" : "text-gray-500"
													}`}
												>
													Symbol
												</th>
												<th
													scope="col"
													className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
														darkMode ? "text-gray-300" : "text-gray-500"
													}`}
												>
													Name
												</th>
												<th
													scope="col"
													className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
														darkMode ? "text-gray-300" : "text-gray-500"
													}`}
												>
													Price ($)
												</th>
												<th
													scope="col"
													className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
														darkMode ? "text-gray-300" : "text-gray-500"
													}`}
												>
													Change ($)
												</th>
												<th
													scope="col"
													className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
														darkMode ? "text-gray-300" : "text-gray-500"
													}`}
												>
													Change (%)
												</th>
												<th
													scope="col"
													className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
														darkMode ? "text-gray-300" : "text-gray-500"
													}`}
												>
													Sector
												</th>
												<th
													scope="col"
													className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
														darkMode ? "text-gray-300" : "text-gray-500"
													}`}
												>
													Holdings
												</th>
												<th
													scope="col"
													className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
														darkMode ? "text-gray-300" : "text-gray-500"
													}`}
												>
													Value ($)
												</th>
											</tr>
										</thead>
										<tbody
											className={`divide-y ${
												darkMode ? "divide-gray-700" : "divide-gray-200"
											}`}
										>
											{paginatedStockData.map((stock, index) => (
												<tr
													key={stock.id}
													onMouseEnter={() => setActiveStockIndex(index)}
													onMouseLeave={() => setActiveStockIndex(null)}
													className={`transition-colors duration-150 cursor-pointer ${
														activeStockIndex === index
															? darkMode
																? "bg-gray-700"
																: "bg-gray-50"
															: darkMode
															? "bg-gray-800"
															: "bg-white"
													}`}
												>
													<td
														className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
															darkMode ? "text-white" : "text-gray-900"
														}`}
													>
														{stock.symbol}
													</td>
													<td
														className={`px-6 py-4 whitespace-nowrap text-sm ${
															darkMode ? "text-gray-300" : "text-gray-500"
														}`}
													>
														{stock.name}
													</td>
													<td
														className={`px-6 py-4 whitespace-nowrap text-sm ${
															darkMode ? "text-gray-300" : "text-gray-500"
														}`}
													>
														{stock.price}
													</td>
													<td
														className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
															Number(stock.change) >= 0
																? "text-green-500"
																: "text-red-500"
														}`}
													>
														{Number(stock.change) >= 0 ? "+" : ""}
														{stock.change}
													</td>
													<td
														className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
															Number(stock.changePercent) >= 0
																? "text-green-500"
																: "text-red-500"
														}`}
													>
														{Number(stock.changePercent) >= 0 ? "+" : ""}
														{stock.changePercent}%
													</td>
													<td
														className={`px-6 py-4 whitespace-nowrap text-sm ${
															darkMode ? "text-gray-300" : "text-gray-500"
														}`}
													>
														{stock.sector}
													</td>
													<td
														className={`px-6 py-4 whitespace-nowrap text-sm ${
															darkMode ? "text-gray-300" : "text-gray-500"
														}`}
													>
														{stock.holdings}
													</td>
													<td
														className={`px-6 py-4 whitespace-nowrap text-sm ${
															darkMode ? "text-gray-300" : "text-gray-500"
														}`}
													>
														{stock.value}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{}
								<div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4">
									<div className="flex justify-between items-center w-full">
										<div
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
											{Math.min(currentPage * itemsPerPage, stockData.length)}{" "}
											of {stockData.length} results
										</div>
										<div className="flex space-x-2">
											<button
												onClick={() =>
													setCurrentPage((prev) => Math.max(prev - 1, 1))
												}
												disabled={currentPage === 1}
												className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
													currentPage === 1
														? `${
																darkMode
																	? "bg-gray-700 text-gray-500"
																	: "bg-gray-100 text-gray-400"
														  }`
														: darkMode
														? "bg-gray-700 text-gray-300 hover:bg-gray-600"
														: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
												}`}
											>
												Previous
											</button>
											<button
												onClick={() =>
													setCurrentPage((prev) =>
														Math.min(prev + 1, totalPages)
													)
												}
												disabled={currentPage === totalPages}
												className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
													currentPage === totalPages
														? `${
																darkMode
																	? "bg-gray-700 text-gray-500"
																	: "bg-gray-100 text-gray-400"
														  }`
														: darkMode
														? "bg-gray-700 text-gray-300 hover:bg-gray-600"
														: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
												}`}
											>
												Next
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{}
					<div
						className={`text-center p-4 text-sm ${
							darkMode ? "text-gray-400" : "text-gray-600"
						} font-roboto`}
					>
						<p>
							© {new Date().getFullYear()} Financial Dashboard • All data is
							simulated for demonstration
						</p>
					</div>
				</div>
			</SnackbarProvider>
		</div>
	);
}
