"use client";

// Import necessary React hooks and components.
import React, { useState, useEffect, useRef } from "react";

// Import icons from the 'react-icons' library for UI elements.
import {
	FaRegBookmark,
	FaBell,
	FaSearch,
	FaCheckCircle,
	FaPlus,
	FaMinus,
} from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { FiBriefcase, FiHome } from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { IoIosSettings } from "react-icons/io";
import { PiPiggyBank } from "react-icons/pi";
import { AiOutlineStock } from "react-icons/ai";

import { TbBriefcaseOff, TbNewsOff } from "react-icons/tb";
import { MdSearchOff } from "react-icons/md";

// Import charting components from 'recharts' library for stock price charts.
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Brush,
	CartesianGrid,
	Cell,
} from "recharts";

// Import the Drawer component from 'vaul' for stock information bottom panel.
import { Drawer } from "vaul";

//================================================================
// 1. TYPE DEFINITIONS
//================================================================
// This section defines all the custom TypeScript types used throughout the application for strong typing.

/** Defines the possible views for the main navigation. */
type CurrentView = "home" | "watchlist" | "portfolio" | "news";

/** Defines the possible transaction types. */
type ActionType = "BUY" | "SELL";

/** A union type representing any stock that can be selected to open the detail sheet. */
type SelectableStock = Stock | HoldingStock | PositionStock;

/** Defines the structure for watchlists, mapping a watchlist name to an array of stock IDs. */
type WState = Record<string, string[]>;

/** Props for the HomePage component. */
interface HomePageProps {
	onStockSelect: (stock: SelectableStock) => void;
	allStocks: Stock[];
}

/** Interface for a general stock, typically shown in the main watchlist. */
interface Stock {
	id: string;
	name: string;
	exchange: string;
	currentPrice: number;
	previousDayPrice: number;
}

/** Interface for a stock held in the user's portfolio (long-term investment). */
interface HoldingStock {
	id: string;
	name: string;
	exchange: string;
	quantity: number;
	avgBuyPrice: number;
	currentMarketPrice: number;
}

/** Interface for a stock in an intraday position. */
interface PositionStock {
	id: string;
	name: string;
	exchange: string;
	quantity: number;
	entryPrice: number;
	currentMarketPrice: number;
	type: "BUY" | "SELL";
}

/** Interface for a news article. */
interface NewsArticle {
	id: string;
	imageUrl: string;
	title: string;
	description: string;
	stockSymbol: string;
	category: string;
}

type StatBoxProps = {
	icon: React.ReactNode;
	bgColor: string;
	title: string;
	amount: number;
	iconColor: string;
};

/** Interface for a user-created price alert. */
interface PriceAlert {
	id: number;
	stockId: string;
	stockName: string;
	targetPrice: number;
	direction: "up" | "down";
	triggered: boolean;
}

// Props definitions for React components below.

/** Props for the StockChart component. */
interface StockChartProps {
	chartType: "Line" | "Candle";
	activeTimeline: keyof typeof CHART_DATA_SETS;
}

/** Props for the CustomNotification component. */
interface CustomNotificationProps {
	visible: boolean;
	message: string;
	description: string;
	type: string;
}

/** Props for the EmptyState component, displays component when the list is empty. */
interface EmptyStateProps {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
}

/** Props for the ConfirmationDialog component, used for buy/sell actions. */
interface ConfirmationDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (
		quantity: number,
		transactionType?: "holding" | "position"
	) => void;
	stock: SelectableStock | null;
	action: ActionType;
	ownedQuantity?: number;
}

/** Props for the AlertCreationDialog component. */
interface AlertCreationDialogProps {
	isOpen: boolean;
	onClose: () => void;
	stock: SelectableStock | null;
	onSetAlert: (price: number) => void;
}

/** Props for the StockDetailSheet component, which shows detailed stock info. */
interface StockDetailSheetProps {
	stock: SelectableStock | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSetAlert: (stock: SelectableStock, price: number) => void;
	onBuy: (
		stock: SelectableStock,
		quantity: number,
		transactionType: "holding" | "position"
	) => void;
	onSell: (
		stock: SelectableStock,
		quantity: number,
		assetType: "holding" | "position"
	) => void;
}

/** Props for the StockItem component, representing a single row in the watchlist. */
interface StockItemProps {
	stock: Stock;
	onStockClick: (stock: Stock) => void;
	isAdded: boolean;
	isEditActive: boolean;
	onAdd: () => void;
	onRemove: () => void;
}

/** Props for the HoldingStockItem component. */
interface HoldingStockItemProps {
	stock: HoldingStock;
	onStockClick: (stock: HoldingStock) => void;
}

/** Props for the PositionStockItem component. */
interface PositionStockItemProps {
	stock: PositionStock;
	onStockClick: (stock: PositionStock) => void;
}

/** Props for the NewsItem component. */
interface NewsItemProps {
	article: NewsArticle;
}

/** Props for the SummaryCard component in the portfolio. */
interface SummaryCardProps {
	investedAmount: number;
	currentAmount: number;
	profit: number;
	profitPercentage?: number;
	showPercentagePL: boolean;
}

/** Props for the BottomNavBar component. */
interface BottomNavBarProps {
	onNavClick: (view: CurrentView) => void;
	currentView: CurrentView;
}

/** Props for the WatchlistPage component. */
interface WatchlistPageProps {
	onStockSelect: (stock: SelectableStock) => void;
	allStocks: Stock[];
	watchList: Record<string, string[]>;
	onAddStock: (stockId: string, watchListName: string) => void;
	onRemoveStock: (stockId: string, watchListName: string) => void;
}

/** Props for the PortfolioPage component. */
interface PortfolioPageProps {
	onStockSelect: (stock: SelectableStock) => void;
	holdings: HoldingStock[];
	positions: PositionStock[];
}

//================================================================
// 2. DUMMY DATA & HAPTICS HELPER
//================================================================

/**
 * Generates sample Open-High-Low-Close (OHLC) data for charts.
 * @param numPoints - The number of data points to generate.
 * @param period - The time period between points ('hour' or 'day').
 * @param basePrice - The starting price for the data generation.
 * @param volatility - A factor determining the size of price fluctuations.
 * @returns An array of chart data.
 */
const generateOHLCData = (
	numPoints: number,
	period: "hour" | "day",
	basePrice: number,
	volatility: number
) => {
	const data = [];
	let lastClose = basePrice;

	for (let i = 0; i < numPoints; i++) {
		const date = new Date();
		if (period === "hour")
			date.setHours(new Date().getHours() - (numPoints - 1 - i));
		if (period === "day")
			date.setDate(new Date().getDate() - (numPoints - 1 - i));

		const open = lastClose;
		const close = open + (Math.random() - 0.5) * volatility;
		const high = Math.max(open, close) + Math.random() * (volatility / 2);
		const low = Math.min(open, close) - Math.random() * (volatility / 2);

		data.push({
			date: date.toISOString(),
			body: [open, close],
			ohlc: {
				open: open.toFixed(2),
				high: high.toFixed(2),
				low: low.toFixed(2),
				close: close.toFixed(2),
			},
		});
		lastClose = close;
	}
	return data;
};

/** A collection of pre-generated chart data sets for different timelines. */
const CHART_DATA_SETS = {
	"6H": generateOHLCData(6, "hour", 175, 1.5),
	"1D": generateOHLCData(24, "hour", 178, 2),
	"5D": generateOHLCData(5, "day", 180, 5),
	"1M": generateOHLCData(30, "day", 185, 8),
	"6M": generateOHLCData(180, "day", 300, 15),
	"1Y": generateOHLCData(365, "day", 220, 25),
	All: generateOHLCData(500, "day", 150, 30),
};

/** Initial list of all available stocks for searching and adding to watchlists. */
const DUMMY_STOCKS: Stock[] = [
	{
		id: "1",
		name: "SHR1",
		exchange: "COMPANY",
		currentPrice: 175.5,
		previousDayPrice: 174.0,
	},
	{
		id: "2",
		name: "SHR2",
		exchange: "COMPANY",
		currentPrice: 420.1,
		previousDayPrice: 425.0,
	},
	{
		id: "3",
		name: "SHR3",
		exchange: "COMPANY",
		currentPrice: 155.2,
		previousDayPrice: 153.5,
	},
	{
		id: "4",
		name: "SHR4",
		exchange: "COMPANY",
		currentPrice: 185.0,
		previousDayPrice: 186.2,
	},
	{
		id: "5",
		name: "SHR5",
		exchange: "COMPANY",
		currentPrice: 170.8,
		previousDayPrice: 168.0,
	},
	{
		id: "6",
		name: "SHR6",
		exchange: "CPNY",
		currentPrice: 2900.5,
		previousDayPrice: 2880.0,
	},
	{
		id: "8",
		name: "SHR8",
		exchange: "CPNY",
		currentPrice: 3800.0,
		previousDayPrice: 3810.0,
	},
	{
		id: "9",
		name: "SHR9",
		exchange: "CPNY",
		currentPrice: 242.22,
		previousDayPrice: 235.3,
	},
	{
		id: "10",
		name: "SHR10",
		exchange: "CPNY",
		currentPrice: 112.8,
		previousDayPrice: 111.0,
	},
	{
		id: "11",
		name: "SHR11",
		exchange: "COMPANY",
		currentPrice: 121.5,
		previousDayPrice: 120.9,
	},
	{
		id: "12",
		name: "SHR12",
		exchange: "COMPANY",
		currentPrice: 475.2,
		previousDayPrice: 478.0,
	},
	{
		id: "13",
		name: "SHR13",
		exchange: "CPNY",
		currentPrice: 195.8,
		previousDayPrice: 196.1,
	},
	{
		id: "14",
		name: "SHR14",
		exchange: "CPNY",
		currentPrice: 278.4,
		previousDayPrice: 275.9,
	},
	{
		id: "15",
		name: "SHR15",
		exchange: "CPNY",
		currentPrice: 148.1,
		previousDayPrice: 148.5,
	},
	{
		id: "16",
		name: "SHR16",
		exchange: "CPNY",
		currentPrice: 1450.75,
		previousDayPrice: 1460.0,
	},
	{
		id: "17",
		name: "SHR17",
		exchange: "CPNY",
		currentPrice: 1530.5,
		previousDayPrice: 1525.0,
	},
	{
		id: "18",
		name: "SHR18",
		exchange: "CPNY",
		currentPrice: 835.2,
		previousDayPrice: 830.0,
	},
	{
		id: "19",
		name: "SHR19",
		exchange: "CPNY",
		currentPrice: 970.0,
		previousDayPrice: 975.5,
	},
	{
		id: "20",
		name: "SHR20",
		exchange: "CPNY",
		currentPrice: 1120.8,
		previousDayPrice: 1125.0,
	},
];

/** Initial data for the user's holdings. */
const DUMMY_HOLDINGS: HoldingStock[] = [
	{
		id: "h1",
		name: "SHR99",
		exchange: "CPNY",
		quantity: 10,
		avgBuyPrice: 2800.0,
		currentMarketPrice: 2900.5,
	},
	{
		id: "h2",
		name: "SHR98",
		exchange: "CPNY",
		quantity: 5,
		avgBuyPrice: 3850.0,
		currentMarketPrice: 3800.0,
	},
	{
		id: "h3",
		name: "SHR97",
		exchange: "CPNY",
		quantity: 2,
		avgBuyPrice: 170.0,
		currentMarketPrice: 175.5,
	},
];

/** Initial data for the user's intraday positions. */
const DUMMY_POSITIONS: PositionStock[] = [
	{
		id: "p1",
		name: "SHR89",
		exchange: "CPNY",
		quantity: 20,
		entryPrice: 1500.0,
		currentMarketPrice: 1450.75,
		type: "BUY",
	},
	{
		id: "p2",
		name: "SHR88",
		exchange: "CPNY",
		quantity: 15,
		entryPrice: 1470.0,
		currentMarketPrice: 1530.5,
		type: "SELL",
	},
];

/** A list of available categories for the news page. */
const DUMMY_NEWS_CATEGORIES: string[] = [
	"All",
	"New",
	"Discover",
	"Following",
	"Hot",
	"Breaking",
	"Market Analysis",
	"Tech",
];

/** A list of dummy news articles. */
const DUMMY_NEWS_ARTICLES: NewsArticle[] = [
	{
		id: "n1",
		imageUrl:
			"https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "SHR1 hits record high after iPhone sales surge",
		description:
			"SHR1 shares surged today following unexpectedly strong iPhone sales figures.",
		stockSymbol: "SHR1",
		category: "Hot",
	},
	{
		id: "n2",
		imageUrl:
			"https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "RBI rate hike expected next quarter",
		description:
			"Analysts predict a 25 basis point hike by the Reserve Bank of India.",
		stockSymbol: "SHR2",
		category: "Market Analysis",
	},
	{
		id: "n3",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "SHR3 acquires AI startup for $500M",
		description:
			"SHR3 continues its aggressive push into AI with this new acquisition.",
		stockSymbol: "SHR3",
		category: "New",
	},
	{
		id: "n4",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1676637656166-cb7b3a43b81a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "SHR4 Secures Major AI Contract in Europe",
		description:
			"Indian tech giant SHR4 has announced a multi-year deal to provide AI and cloud services to a leading European retailer.",
		stockSymbol: "SHR4",
		category: "New",
	},
	{
		id: "n5",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1683120793196-0797cec08a7d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "SHR5 Unveils New Battery Tech, Promises Longer Range",
		description:
			"At its annual investor day, SHR5 showcased a new battery architecture that could significantly boost the range of its electric vehicles.",
		stockSymbol: "SHR5",
		category: "Tech",
	},
	{
		id: "n6",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1664476845274-27c2dabdd7f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "SHR6 Proposes T+0 Settlement Cycle by End of Year",
		description:
			"The Securities and Exchange Board of India is planning to introduce a same-day settlement cycle to improve market efficiency and liquidity.",
		stockSymbol: "SHR6",
		category: "Breaking",
	},
	{
		id: "n7",
		imageUrl:
			"https://images.unsplash.com/photo-1613665641266-7bb90dd86a8b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "SHR7 Industries to Invest ₹15,000 Crore in Green Hydrogen",
		description:
			"As part of its ambitious green energy push, SHR7 has earmarked a significant investment for building new hydrogen production facilities.",
		stockSymbol: "SHR7",
		category: "Following",
	},
	{
		id: "n8",
		imageUrl:
			"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "Auto Sector Soars as SHR8 Reports Record EV Sales",
		description:
			"SHR8 posted a 70% year-on-year increase in electric vehicle sales, driving a rally in auto stocks on the NSE.",
		stockSymbol: "SHR8",
		category: "Hot",
	},
	{
		id: "n9",
		imageUrl:
			"https://images.unsplash.com/photo-1682068548081-50aa8b92c8c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "SHR9 Stock Jumps on Strong Earnings and AI Chip Demand",
		description:
			"SHR9 surpassed analyst expectations with a stellar quarterly report, citing unprecedented demand for its AI hardware.",
		stockSymbol: "SHR9",
		category: "Hot",
	},
];

const profitGraphPaths = [
	"M0 25 C 10 20, 20 10, 30 15 S 50 0, 60 5",
	"M0 20 C 15 25, 25 5, 35 10 S 50 15, 60 0",
	"M0 30 C 10 15, 20 25, 30 5 S 50 10, 60 2",
	"M0 15 C 20 20, 30 0, 40 5 S 55 10, 60 8",
];

const lossGraphPaths = [
	"M0 5 C 10 10, 20 20, 30 15 S 50 30, 60 25",
	"M0 10 C 15 5, 25 25, 35 20 S 50 15, 60 30",
	"M0 0 C 10 15, 20 5, 30 25 S 50 20, 60 28",
	"M0 15 C 20 10, 30 30, 40 25 S 55 20, 60 22",
];

/**
 * Triggers haptic feedback with different patterns if the device supports it.
 * @param intensity The desired feedback pattern ('light', 'medium', 'heavy', etc.).
 */
const triggerHapticFeedback = (intensity = "light") => {
	// First, check if the browser supports the Vibration API.
	if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
		let pattern;
		// Select a vibration pattern based on the desired intensity.
		switch (intensity) {
			case "light":
				pattern = 20;
				break;
			case "medium":
				pattern = 40;
				break;
			case "heavy":
				pattern = [100, 50, 100];
				break;
			case "success":
				pattern = [25, 50, 25, 50, 25];
				break;
			case "warning":
				pattern = [50, 75, 100];
				break;
			case "error":
				pattern = [200, 75, 150];
				break;
			default:
				pattern = 20;
				break;
		}
		// Trigger the vibration.
		navigator.vibrate(pattern);
	}
};

//================================================================
// 3. REUSABLE & CHILD COMPONENTS
//================================================================

/**
 * A component to display stock price charts using the Recharts library.
 * It can render either a Line or a Candlestick (Bar) chart.
 */
const StockChart: React.FC<StockChartProps> = ({
	chartType,
	activeTimeline,
}) => {
	// Get the appropriate data set based on the active timeline.
	const data = CHART_DATA_SETS[activeTimeline];
	const isHourly = activeTimeline === "6H" || activeTimeline === "1D";

	/** Formats the date string for the X-axis based on the timeline. */
	const formatXAxis = (isoString: string) => {
		const date = new Date(isoString);
		if (isHourly) {
			return date.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
		} else {
			return date.toLocaleDateString("en-IN", {
				month: "short",
				day: "numeric",
			});
		}
	};

	return (
		<div style={{ width: "100%", height: "clamp(250px, 35vh, 400px)" }}>
			<ResponsiveContainer width="100%" height="100%">
				{chartType === "Line" ? (
					// Renders a Line Chart if chartType is 'Line'.
					<LineChart
						data={data}
						margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#e0e0e0"
							opacity={0.6}
						/>
						<XAxis
							dataKey="date"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							stroke="#5c5e62"
							tickFormatter={formatXAxis}
						/>
						<YAxis
							dataKey="ohlc.close"
							domain={["dataMin - 5", "dataMax + 5"]}
							fontSize={12}
							tickLine={false}
							axisLine={false}
							stroke="#5c5e62"
							tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
								border: "1px solid #e0e0e0",
								borderRadius: "8px",
								fontSize: "14px",
								color: "#5c5e62",
							}}
							labelStyle={{ color: "#5d93e3", fontWeight: "bold" }}
							cursor={{ stroke: "#5d93e3", strokeDasharray: "3 3" }}
						/>
						<Line
							type="monotone"
							dataKey="ohlc.close"
							name="Price"
							stroke="#5d93e3"
							strokeWidth={2}
							dot={false}
						/>
						<Brush
							dataKey="date"
							height={20}
							stroke="#5d93e3"
							fill="rgba(93, 147, 227, 0.1)"
							travellerWidth={10}
							tickFormatter={formatXAxis}
						/>
					</LineChart>
				) : (
					// Renders a Bar Chart to simulate candlesticks if chartType is 'Candle'.
					<BarChart
						data={data}
						margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#e0e0e0"
							opacity={0.6}
						/>
						<XAxis
							dataKey="date"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							stroke="#5c5e62"
							tickFormatter={formatXAxis}
						/>
						<YAxis
							domain={["dataMin - 2", "dataMax + 2"]}
							fontSize={12}
							tickLine={false}
							axisLine={false}
							stroke="#5c5e62"
							tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
								border: "1px solid #e0e0e0",
								borderRadius: "8px",
								fontSize: "14px",
								color: "#5c5e62",
							}}
							labelStyle={{ color: "#5d93e3", fontWeight: "bold" }}
							cursor={{ stroke: "#5d93e3", strokeDasharray: "3 3" }}
						/>
						<Bar dataKey="body" name="Price OHLC">
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										entry.ohlc.close >= entry.ohlc.open ? "#22c55e" : "#ef4444"
									}
								/>
							))}
						</Bar>
						<Brush
							dataKey="date"
							height={20}
							stroke="#5d93e3"
							fill="rgba(93, 147, 227, 0.1)"
							travellerWidth={10}
							tickFormatter={formatXAxis}
						/>
					</BarChart>
				)}
			</ResponsiveContainer>
		</div>
	);
};

/**
 * A custom notification component that appears at the bottom of the screen.
 * Also triggers a native browser notification for price alerts.
 */
const CustomNotification: React.FC<CustomNotificationProps> = ({
	visible,
	message,
	description,
	type,
}) => {
	const isSuccess = type === "success";
	const IconComponent = isSuccess ? FaCheckCircle : FaBell;
	const iconColorClass = "text-[#286a61]";

	// Effect to handle native browser notifications.
	useEffect(() => {
		if (typeof window === "undefined" || !("Notification" in window)) {
			return;
		}
		// Only show native notification for alert types, not for simple success messages.
		if (visible && !isSuccess) {
			if (Notification.permission === "granted") {
				new Notification(message, {
					body: description,
					icon: "https://plus.unsplash.com/premium_vector-1731740566836-bb12e5b8711d?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				});
			}
		}
	}, [isSuccess, visible, type, message, description]);

	return (
		// The main container for the animated notification pop-up.
		<div
			className={`
        fixed bottom-[25%] left-1/2 -translate-x-1/2 z-[100]
        transition-all duration-300 ease-in-out
        ${
					visible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-5 pointer-events-none"
				}
      `}
		>
			<div className="flex w-80 items-center rounded-2xl border border-gray-300 bg-[#fefeff] p-4 shadow-lg">
				<div className="flex-shrink-0">
					<IconComponent className={`h-6 w-6 ${iconColorClass}`} />
				</div>
				<div className="ml-4 flex-grow">
					<p className="text-md font-bold text-[#5c5e62]">{message}</p>
					<p className="mt-0.5 text-sm text-gray-500">{description}</p>
				</div>
			</div>
		</div>
	);
};

/**
 * A component to display when a list (e.g., watchlist, portfolio) is empty.
 */
const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
	return (
		<div className="px-5 py-[15vh] text-center text-[#5c5e62]">
			<div className="mb-4 flex justify-center">{icon}</div>
			<h3 className="text-xl font-bold">{title}</h3>
			<p className="mt-2 text-md">{subtitle}</p>
		</div>
	);
};

/**
 * A full-screen dialog for confirming buy or sell transactions.
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
	isOpen,
	onClose,
	onConfirm,
	stock,
	action,
	ownedQuantity = 0,
}) => {
	// State for the quantity input field.
	const [quantity, setQuantity] = useState("");
	// State for displaying validation errors.
	const [error, setError] = useState("");
	// State to determine if a buy action is for a 'holding' or 'position'.
	const [transactionType, setTransactionType] = useState<
		"holding" | "position"
	>("holding");

	// Effect to reset the dialog's state when it is opened.
	useEffect(() => {
		if (isOpen) {
			setQuantity("");
			setError("");
			setTransactionType("holding");
		}
	}, [isOpen]);

	// Effect for real-time validation of the quantity input.
	useEffect(() => {
		const numVal = parseInt(quantity, 10);
		if (!quantity) {
			setError("");
			return;
		}

		if (isNaN(numVal) || numVal <= 0) {
			setError("Please enter a valid, positive quantity.");
		} else if (action === "SELL" && numVal > ownedQuantity) {
			setError(`You can only sell up to ${ownedQuantity} shares.`);
		} else {
			setError("");
		}
	}, [quantity, ownedQuantity, action]);

	/** Handles changes to the quantity input field. */
	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuantity(e.target.value);
	};

	/** Handles the final confirmation click. */
	const handleConfirmClick = () => {
		// Haptic: Heavy feedback for a major confirmation action.
		triggerHapticFeedback("heavy");
		if (!error && quantity) {
			onConfirm(
				parseInt(quantity, 10),
				action === "BUY" ? transactionType : undefined
			);
		}
	};

	/** Handles closing the dialog. */
	const handleClose = () => {
		// Haptic: Light feedback for closing a dialog.
		triggerHapticFeedback("light");
		onClose();
	};

	/** Handles switching between 'holding' and 'position' transaction types. */
	const handleTransactionTypeChange = (type: "holding" | "position") => {
		// Haptic: Light feedback for changing selection.
		triggerHapticFeedback("light");
		setTransactionType(type);
	};

	if (!isOpen || !stock) {
		return null;
	}

	// Helper to get the current price from any stock type.
	const getCurrentPrice = (s: SelectableStock): number =>
		"currentMarketPrice" in s ? s.currentMarketPrice : s.currentPrice;
	const currentPrice = getCurrentPrice(stock);
	const numericQuantity = parseInt(quantity, 10) || 0;
	const totalPrice = currentPrice * numericQuantity;
	// Determine if the confirm button should be disabled.
	const isButtonDisabled = !!error || !quantity;
	// Dynamically set button color based on action type.
	const actionButtonClass =
		action === "BUY"
			? "bg-[#286a61] hover:bg-blue-600"
			: "bg-[#ff4d4d] hover:bg-red-600";

	/** A simple close icon component. */
	const CloseIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	);

	return (
		<Drawer.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 z-[60] bg-black/40" />
				<Drawer.Content className="fixed inset-0 z-[70] flex flex-col bg-[#ecf2f7] p-6 text-[#5c5e62] outline-none">
					<div
						className="flex h-full w-full flex-col"
						onClick={(e) => e.stopPropagation()}
					>
						<header className="flex-shrink-0">
							<div className="flex items-start justify-between">
								<div>
									<Drawer.Title className="text-4xl font-bold tracking-tight text-[#060a1e]">
										{action} {stock.name}
									</Drawer.Title>
									<Drawer.Description className="text-lg text-gray-500">
										{stock.exchange}
									</Drawer.Description>
								</div>
								<button
									onClick={handleClose}
									className="-mr-2 p-2 text-gray-500 transition-colors hover:text-gray-700"
								>
									<CloseIcon />
								</button>
							</div>
							<div className="mt-6">
								<p className="text-sm text-gray-500">Current Market Price</p>
								<p className="text-5xl font-bold text-[#5c5e62]">
									$
									{currentPrice.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</p>
							</div>
						</header>

						<main className="flex flex-grow flex-col items-center justify-center py-10">
							<label htmlFor="quantity" className="text-lg text-gray-600">
								Quantity
							</label>
							<input
								id="quantity"
								type="number"
								value={quantity}
								onChange={handleQuantityChange}
								placeholder="0"
								className="mt-2 w-full bg-transparent text-center text-7xl font-bold text-[#5c5e62] placeholder:text-gray-400 focus:outline-none"
								autoFocus
							/>
							{error && (
								<p className="-translate-y-4 mt-4 text-sm text-[#ff4d4d]">
									{error}
								</p>
							)}

							{action === "BUY" && (
								<div className="mt-6 flex items-center justify-center rounded-2xl bg-white p-1 shadow-sm">
									<button
										onClick={() => handleTransactionTypeChange("holding")}
										className={`px-6 py-2 text-sm font-bold rounded-2xl transition-colors ${
											transactionType === "holding"
												? "bg-[#286a61] text-white shadow-sm"
												: "text-gray-600"
										}`}
									>
										Holding
									</button>
									<button
										onClick={() => handleTransactionTypeChange("position")}
										className={`px-6 py-2 text-sm font-bold rounded-2xl transition-colors ${
											transactionType === "position"
												? "bg-[#286a61] text-white shadow-sm"
												: "text-gray-600"
										}`}
									>
										Position
									</button>
								</div>
							)}
						</main>

						<footer className="flex-shrink-0 space-y-4">
							<div className="flex items-center justify-between text-lg">
								<span className="text-gray-600">Total Estimated Price</span>
								<span className="text-2xl font-bold text-[#5c5e62]">
									$
									{totalPrice.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
							</div>
							<button
								onClick={handleConfirmClick}
								disabled={isButtonDisabled}
								className={`w-full rounded-2xl p-4 text-lg font-bold text-white transition-colors ${actionButtonClass} disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500`}
							>
								Confirm {action}
							</button>
						</footer>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
};

/**
 * A full-screen dialog for creating a new price alert.
 */
const AlertCreationDialog: React.FC<AlertCreationDialogProps> = ({
	isOpen,
	onClose,
	stock,
	onSetAlert,
}) => {
	// State for the target price input.
	const [price, setPrice] = useState("");

	// Reset the price input when the dialog opens.
	useEffect(() => {
		if (isOpen) {
			setPrice("");
		}
	}, [isOpen]);

	/** Handles the final confirmation to set the alert. */
	const handleSetAlertClick = async () => {
		// Haptic: Success feedback for setting an alert.
		triggerHapticFeedback("success");
		const priceValue = parseFloat(price);
		if (isNaN(priceValue) || priceValue <= 0) {
			console.error("Invalid price entered for the alert.");
			return;
		}

		// Request permission for native notifications if not already granted.
		if ("Notification" in window && Notification.permission === "default") {
			await Notification.requestPermission();
		}
		onSetAlert(priceValue);
	};

	/** Handles closing the dialog. */
	const handleClose = () => {
		// Haptic: Light feedback for closing a dialog.
		triggerHapticFeedback("light");
		onClose();
	};

	if (!stock) return null;

	/** A simple close icon component. */
	const CloseIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	);

	const getCurrentPrice = (s: SelectableStock): number =>
		"currentMarketPrice" in s ? s.currentMarketPrice : s.currentPrice;
	const currentPrice = getCurrentPrice(stock);

	return (
		<Drawer.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
				<Drawer.Content className="fixed inset-0 z-[70] flex flex-col p-6 bg-[#ecf2f7] text-[#5c5e62] outline-none">
					<div
						className="w-full h-full flex flex-col"
						onClick={(e) => e.stopPropagation()}
					>
						<header className="flex-shrink-0">
							<div className="flex justify-between items-start">
								<div>
									<Drawer.Title className="text-4xl font-bold tracking-tight text-[#060a1e]">
										{stock.name}
									</Drawer.Title>
									<Drawer.Description className="text-lg text-gray-500">
										{stock.exchange}
									</Drawer.Description>
								</div>
								<button
									onClick={handleClose}
									className="p-2 -mr-2 text-gray-500 hover:text-gray-700 transition-colors"
								>
									<CloseIcon />
								</button>
							</div>
							<div className="mt-6">
								<p className="text-sm text-gray-500">Current Price</p>
								<p className="text-5xl font-bold text-[#5c5e62]">
									$
									{currentPrice.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</p>
							</div>
						</header>

						<main className="flex-grow flex flex-col justify-center items-center py-10">
							<label htmlFor="alert-price" className="text-lg text-gray-600">
								Alert me when price is above:
							</label>
							<input
								id="alert-price"
								type="number"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								placeholder={currentPrice.toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
								className="bg-transparent text-[#5c5e62] placeholder:text-gray-400 text-7xl font-bold text-center w-full focus:outline-none mt-2"
								autoFocus
							/>
						</main>

						<footer className="flex-shrink-0">
							<button
								onClick={handleSetAlertClick}
								disabled={!price}
								className="w-full bg-[#286a61] text-white font-bold text-lg p-4 rounded-2xl transition-colors hover:bg-[#233f3c] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
							>
								Set Alert
							</button>
						</footer>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
};

/**
 * A bottom sheet component that displays detailed information about a selected stock.
 */
const StockDetailSheet: React.FC<StockDetailSheetProps> = ({
	stock,
	open,
	onOpenChange,
	onSetAlert,
	onBuy,
	onSell,
}) => {
	// State for the active chart timeline (e.g., '1D', '1M').
	const [activeTimeline, setActiveTimeline] =
		useState<keyof typeof CHART_DATA_SETS>("1D");
	// State for the chart type ('Line' or 'Candle').
	const [chartType, setChartType] = useState<"Line" | "Candle">("Line");
	// State to control the visibility of the alert creation dialog.
	const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
	// State to control the visibility of the transaction confirmation dialog.
	const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
	// State to determine the action type ('BUY' or 'SELL').
	const [actionType, setActionType] = useState<ActionType>("BUY");

	if (!stock) return null;

	/**
	 * Calculates and returns profit/loss details for the given stock.
	 * This function now correctly prioritizes Today's P&L for watchlist items.
	 */
	const getProfitLossDetails = (s: SelectableStock) => {
		let change = 0,
			percentage = 0,
			label = "Today",
			isTotalProfit = false;
		const currentPrice =
			"currentMarketPrice" in s ? s.currentMarketPrice : s.currentPrice;

		// By checking for 'previousDayPrice' first, we correctly identify that the
		// origin of the click was the watchlist. In this case, we always show
		// "Today's P&L", even if the user also owns the stock (and 'avgBuyPrice' exists).
		if ("previousDayPrice" in s && s.previousDayPrice) {
			label = "Today's P&L";
			change = currentPrice - s.previousDayPrice;
			percentage =
				s.previousDayPrice > 0 ? (change / s.previousDayPrice) * 100 : 0;
			isTotalProfit = false; // Ensures the value is displayed as a daily change, not a total sum.
		}
		// If the stock object doesn't come from the watchlist (no 'previousDayPrice'),
		// then we check if it's a holding from the portfolio.
		else if ("avgBuyPrice" in s) {
			// It's a Holding
			label = "Total P&L";
			isTotalProfit = true;
			const investedValue = s.avgBuyPrice * s.quantity;
			change = s.currentMarketPrice * s.quantity - investedValue;
			percentage = investedValue > 0 ? (change / investedValue) * 100 : 0;
		}
		// Finally, check if it's a position from the portfolio.
		else if ("entryPrice" in s) {
			// It's a Position
			label = "Position P&L";
			isTotalProfit = true;
			const entryValue = s.entryPrice * s.quantity;
			if (s.type === "SELL") {
				change = (s.entryPrice - s.currentMarketPrice) * s.quantity;
			} else {
				change = (s.currentMarketPrice - s.entryPrice) * s.quantity;
			}
			percentage = entryValue > 0 ? (Math.abs(change) / entryValue) * 100 : 0;
		}

		const colorClass = change >= 0 ? "text-green-600" : "text-[#ff4d4d]";
		const sign = change >= 0 ? "+" : "";
		return { change, percentage, colorClass, sign, label, isTotalProfit };
	};

	const { change, percentage, colorClass, sign, label, isTotalProfit } =
		getProfitLossDetails(stock);
	const timelines = Object.keys(CHART_DATA_SETS) as Array<
		keyof typeof CHART_DATA_SETS
	>;

	/** Wrapper function to handle setting an alert and closing the dialog. */
	const handleSetAlert = (price: number) => {
		onSetAlert(stock, price);
		setAlertDialogOpen(false);
	};

	/** Initiates a buy or sell action flow. */
	const handleActionClick = (type: ActionType) => {
		// Haptic: Medium feedback for initiating a transaction flow.
		triggerHapticFeedback("medium");
		setActionType(type);
		setConfirmDialogOpen(true);
	};

	/** Handles changing the chart timeline. */
	const handleTimelineChange = (time: keyof typeof CHART_DATA_SETS) => {
		// Haptic: Light feedback for changing tabs/timeline.
		triggerHapticFeedback("light");
		setActiveTimeline(time);
	};

	/** Opens the alert creation dialog. */
	const handleOpenAlert = () => {
		// Haptic: Medium feedback for opening a new dialog.
		triggerHapticFeedback("medium");
		setAlertDialogOpen(true);
	};

	const isOwned = stock && "quantity" in stock;

	/** Confirms the transaction from the confirmation dialog. */
	const handleConfirmAction = (
		quantity: number,
		transactionType?: "holding" | "position"
	) => {
		if (actionType === "BUY" && transactionType) {
			onBuy(stock, quantity, transactionType);
		} else if (actionType === "SELL") {
			const assetTypeToSell = "avgBuyPrice" in stock ? "holding" : "position";
			onSell(stock, quantity, assetTypeToSell);
		}
		setConfirmDialogOpen(false);
	};

	/** Gets the quantity of the owned stock. */
	const getOwnedQuantity = () =>
		isOwned ? (stock as HoldingStock | PositionStock).quantity : 0;

	return (
		<Drawer.Root open={open} onOpenChange={onOpenChange}>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
				<Drawer.Content className="bg-white flex flex-col rounded-t-2xl h-[75%] fixed bottom-0 left-0 right-0 z-50 text-[#214843] shadow-lg outline-none">
					<div className="p-3 bg-white rounded-t-2xl flex-shrink-0">
						<div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-2xl bg-gray-300" />
					</div>
					<div className="flex flex-col px-5 pb-4 border-b border-gray-300 flex-shrink-0 bg-white">
						<Drawer.Title className="font-bold text-3xl text-[#214843]">
							{stock.name}
						</Drawer.Title>
						<div className="flex items-center text-sm mt-1">
							<Drawer.Description className="text-lg text-gray-500">
								{stock.exchange}
							</Drawer.Description>
							<span className={`ml-3 font-semibold ${colorClass}`}>
								{sign}
								{isTotalProfit
									? `$${Math.abs(change).toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
									  })}`
									: change.toFixed(2)}{" "}
								({sign}
								{percentage.toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
								%) {label}
							</span>
						</div>
					</div>
					<div className="flex-grow px-5 py-4 bg-white">
						<div className="grid grid-cols-2 gap-3 mb-5">
							<button
								onClick={() => handleActionClick("BUY")}
								className="w-full bg-[#286a61] text-white font-bold py-3 rounded-full hover:bg-[#233f3c] transition-colors"
							>
								Buy
							</button>
							<button
								onClick={() => handleActionClick("SELL")}
								disabled={!isOwned}
								className="w-full bg-red-500 text-white font-bold py-3 rounded-full hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								Sell
							</button>
						</div>

						<div className="flex justify-between items-center mb-4">
							<button
								onClick={handleOpenAlert}
								className="flex items-center text-blue-600 font-semibold text-sm p-2 rounded-2xl hover:bg-blue-50 transition-colors"
							>
								<FaBell className="mr-2" /> Set Alert
							</button>
							<select
								value={chartType}
								onChange={(e) =>
									setChartType(e.target.value as "Line" | "Candle")
								}
								className={`bg-white text-[#5c5e62] text-sm font-semibold focus:outline-none`}
							>
								<option value="Line">Line Chart</option>
								<option value="Candle">Candle Chart</option>
							</select>
						</div>
						<StockChart chartType={chartType} activeTimeline={activeTimeline} />

						<div className="mt-4 whitespace-nowrap overflow-x-scroll z-10 no-scrollbar">
							{timelines.map((time) => (
								<button
									key={time}
									className={`
            inline-block px-3 py-1.5 mr-1.5 rounded-full
            font-bold text-sm tracking-wide transition-colors duration-300 ease-in-out
                 ${
										activeTimeline === time
											? "bg-[#286a61] text-white shadow-md"
											: "bg-[#EBEAEB] text-[#214843] hover:bg-gray-200"
									}
                 `}
									onClick={() => handleTimelineChange(time)}
								>
									{time}
								</button>
							))}
						</div>
					</div>

					<AlertCreationDialog
						isOpen={isAlertDialogOpen}
						onClose={() => setAlertDialogOpen(false)}
						stock={stock}
						onSetAlert={handleSetAlert}
					/>
					<ConfirmationDialog
						isOpen={isConfirmDialogOpen}
						onClose={() => setConfirmDialogOpen(false)}
						onConfirm={handleConfirmAction}
						stock={stock}
						action={actionType}
						ownedQuantity={getOwnedQuantity()}
					/>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
};

/**
 * A component representing a single stock item in a list.
 */
const StockItem: React.FC<StockItemProps> = ({
	stock,
	onStockClick,
	isAdded,
	isEditActive,
	onAdd,
	onRemove,
}) => {
	// Calculate profit/loss for display.
	const profit = stock.currentPrice - stock.previousDayPrice;
	const profitPercentage = (profit / stock.previousDayPrice) * 100;
	const profitColorClass = profit >= 0 ? "text-green-600" : "text-[#ff4d4d]";
	const profitSign = profit >= 0 ? "+" : "";

	/** Handles the add button click. */
	const handleAdd = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent the parent div's click event.
		// Haptic: Light feedback for adding to watchlist.
		triggerHapticFeedback("light");
		onAdd();
	};

	/** Handles the remove button click. */
	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation();
		// Haptic: Warning feedback for a removal action.
		triggerHapticFeedback("warning");
		onRemove();
	};

	/** Renders either the add or remove button. */
	const renderActionButton = () => (
		<button
			onClick={isAdded ? handleRemove : handleAdd}
			className={`p-3 rounded-2xl transition-colors ${
				isAdded
					? "bg-red-100 text-red-600 hover:bg-red-200"
					: "bg-blue-100 text-[#4dbafe] hover:bg-blue-200"
			}`}
			aria-label={isAdded ? "Remove from watchlist" : "Add to watchlist"}
		>
			{isAdded ? <FaMinus size={12} /> : <FaPlus size={12} />}
		</button>
	);

	return (
		<div
			className="mt-2.5 p-5 flex justify-between items-center last:border-b-0 rounded-2xl bg-white shadow-md hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
			onClick={() => onStockClick(stock)}
		>
			<div className="flex flex-col justify-between">
				<span className="font-semibold text-sm md:text-lg text-[#060a1e]">
					{stock.name}
				</span>
				<span className="text-gray-500 text-sm block">{stock.exchange}</span>
			</div>
			<div className="text-right flex flex-col justify-between">
				{isEditActive ? (
					renderActionButton()
				) : (
					<>
						<span className="text-sm md:text-md font-bold text-[#060a1e]">
							$
							{stock.currentPrice.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</span>
						<span className={`${profitColorClass} text-sm block`}>
							{profitSign}
							{profit.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}{" "}
							({profitSign}
							{profitPercentage.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
							%)
						</span>
					</>
				)}
			</div>
		</div>
	);
};

/**
 * A component representing a single holding in the portfolio.
 */
const HoldingStockItem: React.FC<HoldingStockItemProps> = ({
	stock,
	onStockClick,
}) => {
	// Calculate P&L for the holding.
	const holdingValue = stock.quantity * stock.currentMarketPrice;
	const investedValue = stock.quantity * stock.avgBuyPrice;
	const profit = holdingValue - investedValue;
	const profitPercentage =
		investedValue > 0 ? (profit / investedValue) * 100 : 0;
	const profitColorClass = profit >= 0 ? "text-green-600" : "text-[#ff4d4d]";
	const profitSign = profit >= 0 ? "+" : "";

	return (
		<div
			className="mt-2.5 p-5 flex justify-between items-center last:border-b-0 rounded-2xl bg-white shadow-md hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
			onClick={() => onStockClick(stock)}
		>
			<div className="flex flex-col justify-between">
				<span className="font-semibold text-sm md:text-lg text-[#060a1e]">
					{stock.name}
				</span>
				<span className="text-sm block text-gray-500">
					{stock.exchange} | {stock.quantity} Qty
				</span>
			</div>
			<div className="text-right flex flex-col justify-between">
				<span className="text-sm md:text-xl font-bold text-[#060a1e]">
					$
					{holdingValue.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</span>
				<span className={`${profitColorClass} text-xs md:text-sm block`}>
					{profitSign}
					{profit.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}{" "}
					({profitSign}
					{profitPercentage.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
					%)
				</span>
			</div>
		</div>
	);
};

/**
 * A component representing a single intraday position.
 */
const PositionStockItem: React.FC<PositionStockItemProps> = ({
	stock,
	onStockClick,
}) => {
	// Calculate P&L for the position, accounting for BUY vs SELL types.
	let positionPL;
	if (stock.type === "SELL") {
		positionPL = (stock.entryPrice - stock.currentMarketPrice) * stock.quantity;
	} else {
		positionPL = (stock.currentMarketPrice - stock.entryPrice) * stock.quantity;
	}
	const currTotalValue = stock.currentMarketPrice * stock.quantity;
	const investedValue = stock.entryPrice * stock.quantity;
	const percentagePL =
		investedValue > 0 ? (positionPL / investedValue) * 100 : 0;
	const profitColorClass =
		positionPL >= 0 ? "text-green-600" : "text-[#ff4d4d]";
	const profitSign = positionPL >= 0 ? "+" : "";
	const typeColorClass =
		stock.type === "BUY" ? "text-green-500" : "text-[#ff4d4d]";

	return (
		<div
			className="mt-2.5 p-5 flex justify-between items-center rounded-2xl bg-white shadow-md hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
			onClick={() => onStockClick(stock)}
		>
			<div className="flex flex-col justify-between">
				<span className="font-semibold text-sm md:text-lg text-[#060a1e]">
					{stock.name}
				</span>
				<span className="text-gray-500 text-sm block">
					{stock.exchange} | {stock.quantity} Qty |{" "}
					<span className={typeColorClass}>{stock.type}</span>
				</span>
			</div>
			<div className="text-right flex flex-col justify-between">
				<span className="text-sm md:text-xl font-bold text-[#060a1e]">
					$
					{currTotalValue.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</span>
				<span className={`${profitColorClass} text-xs md:text-sm block`}>
					{profitSign}
					{positionPL.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}{" "}
					({profitSign}
					{percentagePL.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
					%)
				</span>
			</div>
		</div>
	);
};

/**
 * A component for displaying a single news article card.
 */
const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
	return (
		<div className="flex flex-col bg-white rounded-2xl shadow-sm p-4 mb-2.5 hover:bg-gray-100 text-[#5c5e62]">
			<img
				src={article.imageUrl}
				alt={article.title}
				className="w-full h-auto aspect-video object-cover rounded-2xl mb-3"
			/>
			<h3 className="font-semibold text-lg text-[#060a1e] mt-1 leading-tight mb-1">
				{article.title}
			</h3>
			<p className="text-sm mt-0 line-clamp-2 mb-2">{article.description}</p>
			<div className="flex justify-end">
				<div className="text-right text-[#5d93e3] font-medium text-sm">
					{article.stockSymbol}
				</div>
			</div>
		</div>
	);
};

/**
 * A simple card to display a message about the market's status.
 */
const Balance: React.FC<{
	totalAssetValue: number;
	totalProfitPercentage: number;
}> = ({ totalAssetValue, totalProfitPercentage }) => {
	const isProfit = totalProfitPercentage >= 0;
	const sign = isProfit ? "+" : "";
	const netProfit = (totalProfitPercentage * totalAssetValue) / 100;
	const formattedValue = totalAssetValue.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const formatedNetProfit = netProfit.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const parts = formattedValue.split(".");
	const integerPart = parts[0];
	const decimalPart = parts[1];
	const circularLinesPattern = `
    repeating-radial-gradient(
      circle at -10% -10%,
      rgba(7, 17, 31, 0.04) 0,
      rgba(7, 17, 31, 0.04) 1px,
      transparent 1px,
      transparent 30px
    )
  `;

	return (
		<div
			className={`
        relative mx-3 rounded-2xl shadow-md bg-[#f1de4c] text-[#214843]
        z-10 flex flex-col justify-center items-center p-6 px-5 overflow-hidden roboto
      `}
			style={{ backgroundImage: circularLinesPattern }}
		>
			<p className="text-sm">Total Asset Value</p>
			<p className="mt-2">
				<span className="roboto-med text-2xl md:text-5xl">${integerPart}</span>
				<span className="text-xl md:text-4xl">.{decimalPart}</span>
			</p>
			<p className="text-sm md:text-md font-normal mt-1">
				<span>$ {formatedNetProfit}</span>
				<span className="ml-2">
					({sign}
					{totalProfitPercentage.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
					%)
				</span>
			</p>
		</div>
	);
};

/**
 * A component to display a horizontally scrollable list of stocks.
 */

const HorizontalStockList: React.FC<{
	stocks: Stock[];
	onStockClick: (stock: Stock) => void;
}> = ({ stocks, onStockClick }) => {
	// FIX: The SmallStockCard now accepts a graphPath prop and no longer chooses one itself.
	const SmallStockCard: React.FC<{
		stock: Stock;
		onClick: () => void;
		graphPath: string;
	}> = ({ stock, onClick, graphPath }) => {
		const profit = stock.currentPrice - stock.previousDayPrice;
		const isProfit = profit >= 0;
		const profitPercentage = (profit / stock.previousDayPrice) * 100;
		const profitColorClass = isProfit ? "text-green-600" : "text-[#ff4d4d]";
		const profitSign = isProfit ? "+" : "";
		const ArrowIcon = isProfit ? FaArrowTrendUp : FaArrowTrendDown;
		const arrowColorClass = isProfit ? "text-green-500" : "text-red-500";

		return (
			<div
				onClick={onClick}
				className="relative bg-[#F3F2F2] flex flex-col justify-between w-40 flex-shrink-0 rounded-2xl shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-150 aspect-square overflow-hidden"
			>
				<svg
					className="absolute bottom-0 right-4 w-14 h-16 opacity-50"
					viewBox="0 0 60 30"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d={graphPath}
						stroke={isProfit ? "#22c55e" : "#ff4d4d"}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>

				{/* Card content */}
				<div className="relative z-10">
					<h4 className="font-bold text-sm md:text-md text-[#060a1e] truncate">
						{stock.name}
					</h4>
					<p className="text-xs text-gray-500">{stock.exchange}</p>
				</div>
				<div className="absolute top-4 right-4 z-10">
					<ArrowIcon className={`text-xl ${arrowColorClass}`} />
				</div>
				<div className="relative z-10">
					<p className="text-sm md:text-md font-bold text-[#060a1e]">
						$
						{stock.currentPrice.toLocaleString("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</p>
					<p className={`text-xs font-semibold ${profitColorClass}`}>
						{profitSign}
						{profitPercentage.toLocaleString("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
						%
					</p>
				</div>
			</div>
		);
	};

	return (
		<div className="flex gap-4 overflow-x-scroll no-scrollbar px-4 pb-4">
			{/* FIX: The mapping logic now determines the graph path */}
			{stocks.map((stock, index) => {
				const isProfit = stock.currentPrice - stock.previousDayPrice >= 0;
				const graphs = isProfit ? profitGraphPaths : lossGraphPaths;
				// Use the modulo operator to cycle through the available graphs
				const graphPath = graphs[index % graphs.length];

				return (
					<SmallStockCard
						key={stock.id}
						stock={stock}
						onClick={() => onStockClick(stock)}
						graphPath={graphPath} // Pass the determined path as a prop
					/>
				);
			})}
		</div>
	);
};

/**
 * A card component that summarizes portfolio values (invested, current, P&L).
 */
const SummaryCard: React.FC<SummaryCardProps> = ({
	investedAmount,
	currentAmount,
	profit,
	profitPercentage,
	showPercentagePL,
}) => {
	const profitColorClass = profit >= 0 ? "text-green-600" : "text-[#ff4d4d]";
	const profitSign = profit >= 0 ? "+" : "";
	const circularLinesPattern = `
    repeating-radial-gradient(
      circle at -10% -10%,
      rgba(7, 17, 31, 0.04) 0,
      rgba(7, 17, 31, 0.04) 1px,
      transparent 1px,
      transparent 30px
    )
  `;

	const investAmt = investedAmount.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const investInt = investAmt.split(".")[0];
	const investDec = investAmt.split(".")[1];
	const currAmt = currentAmount.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const currInt = currAmt.split(".")[0];
	const currDec = currAmt.split(".")[1];

	return (
		<div
			className={`
        relative mx-3 rounded-2xl shadow-md bg-[#f1de4c] text-[#214843]
        z-10 flex flex-col p-6 px-5 overflow-hidden roboto
      `}
			style={{ backgroundImage: circularLinesPattern }}
		>
			<div className="flex justify-between text-md md:text-lg">
				<span>Invested</span>
				<span>Current</span>
			</div>
			<div className="flex justify-between mt-1 text-2xl font-medium">
				<div>
					<span className="roboto-med text-lg md:text-3xl">${investInt}</span>
					<span className="text-sm md:text-2xl">.{investDec}</span>
				</div>
				<div>
					<span className="roboto-med text-lg md:text-3xl">${currInt}</span>
					<span className="text-sm md:text-2xl">.{currDec}</span>
				</div>
			</div>
			<div className="border-t border-[#e1c914] mt-4 pt-4 flex justify-between items-center">
				<span className="font-semibold">P&L</span>
				<div className="flex items-center space-x-2">
					<span className={`text-md md:text-xl font-bold ${profitColorClass}`}>
						{profitSign}
						{profit.toLocaleString("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
					{showPercentagePL && profitPercentage !== undefined && (
						<span className={`text-lg font-medium ${profitColorClass}`}>
							({profitSign}
							{profitPercentage.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
							%)
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

/**
 * The main bottom navigation bar for switching between views.
 */
function BottomNavBar({ onNavClick, currentView }: BottomNavBarProps) {
	/** Handles navigation clicks and triggers haptic feedback. */
	const handleNav = (view: CurrentView) => {
		triggerHapticFeedback("light");
		onNavClick(view);
	};

	// Helper function to generate class names, keeping the JSX clean.
	const getItemClasses = (view: CurrentView) => {
		const isActive = currentView === view;
		// Define widths for each item to fit the text perfectly
		const widths: { [key in CurrentView]: string } = {
			home: "w-24",
			watchlist: "w-28",
			portfolio: "w-28",
			news: "w-24",
		};
		return `flex flex-shrink-0 items-center justify-center h-12 rounded-full cursor-pointer transition-all duration-350 ease-in-out ${
			isActive
				? `${widths[view]} bg-[#f1de4c] text-[#214843] repeating-radial-gradient(
        circle at -10% -10%,
        rgba(7, 17, 31, 0.04) 0,
        rgba(7, 17, 31, 0.04) 1px,
        transparent 1px,
        transparent 30px
      )`
				: "w-14 text-black hover:bg-gray-200"
		}`;
	};

	const getTextClasses = (view: CurrentView) => {
		const isActive = currentView === view;
		// Animate max-width and opacity for a smooth reveal
		return `whitespace-nowrap text-xs md:text-sm font-semibold overflow-hidden transition-all duration-300 ease-in-out ${
			isActive ? "max-w-[100px] opacity-100 ml-2" : "max-w-0 opacity-0"
		}`;
	};

	return (
		<nav className="fixed bottom-4 left-1/2 w-[300px] -translate-x-1/2 bg-white flex items-center gap-x-1 p-2 rounded-full shadow-lg z-50">
			{/* Home */}
			<div className={getItemClasses("home")} onClick={() => handleNav("home")}>
				<FiHome className="text-md md:text-xl flex-shrink-0 scale-110" />
				<span className={getTextClasses("home")}>Home</span>
			</div>

			{/* Watchlist */}
			<div
				className={getItemClasses("watchlist")}
				onClick={() => handleNav("watchlist")}
			>
				<FaRegBookmark className="text-md md:text-xl flex-shrink-0" />
				<span className={getTextClasses("watchlist")}>Watchlist</span>
			</div>

			{/* Portfolio */}
			<div
				className={getItemClasses("portfolio")}
				onClick={() => handleNav("portfolio")}
			>
				<FiBriefcase className="text-md md:text-xl flex-shrink-0 scale-110" />
				<span className={getTextClasses("portfolio")}>Portfolio</span>
			</div>

			{/* News */}
			<div className={getItemClasses("news")} onClick={() => handleNav("news")}>
				<HiOutlineNewspaper className="text-xl flex-shrink-0 scale-125" />
				<span className={getTextClasses("news")}>News</span>
			</div>
		</nav>
	);
}

//================================================================
// 4. PAGE COMPONENTS
//================================================================

/**
 * Props for the HomePage component.
 */
interface HomePageProps {
	onStockSelect: (stock: SelectableStock) => void;
	allStocks: Stock[];
	holdings: HoldingStock[];
	positions: PositionStock[];
}

const StatBox: React.FC<StatBoxProps> = ({
	icon,
	bgColor,
	iconColor,
	title,
	amount,
}) => {
	return (
		<div
			className={`w-1/2 h-1/2 rounded-2xl text-[#1D3F3F] ${bgColor} m-0 shadow-lg flex flex-col p-4`}
		>
			{/* Icon with its own background */}
			<div
				className={`w-12 h-10 md:w-16 md:h-14 rounded-xl flex items-center ${iconColor} justify-center`}
			>
				{icon}
			</div>

			{/* Text Content */}
			<div className="flex flex-col mt-4">
				<p className="text-sm md:text-md font-sm">{title}</p>
				<p className="text-sm md:text-2xl font-bold roboto">
					$
					{amount.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</p>
			</div>
		</div>
	);
};

/**
 * The Home page component, which gives a market overview.
 */
const HomePage: React.FC<HomePageProps> = ({
	onStockSelect,
	allStocks,
	holdings,
	positions,
}) => {
	const trendingStocks = allStocks.filter((s) =>
		["SHR1", "SHR2", "SHR3", "SHR4", "SHR5", "SHR6"].includes(s.name)
	);

	const topGainers = [...allStocks]
		.filter((stock) => stock.name.length <= 7)
		.sort((a, b) => {
			const gainA = (a.currentPrice - a.previousDayPrice) / a.previousDayPrice;
			const gainB = (b.currentPrice - b.previousDayPrice) / b.previousDayPrice;
			return gainB - gainA; // Sort descending
		})
		.slice(0, 5);

	// Logic to find top 5 losers
	const topLosers = [...allStocks]
		.filter((stock) => stock.name.length <= 7)
		.sort((a, b) => {
			const gainA = (a.currentPrice - a.previousDayPrice) / a.previousDayPrice;
			const gainB = (b.currentPrice - b.previousDayPrice) / b.previousDayPrice;
			return gainA - gainB; // Sort ascending
		})
		.slice(0, 5);

	const totalHoldingsValue = holdings.reduce(
		(sum, h) => sum + h.quantity * h.currentMarketPrice,
		0
	);
	const totalPositionsValue = positions.reduce((sum, p) => {
		const multiplier = p.type === "SELL" ? -1 : 1;
		return sum + p.quantity * p.entryPrice * multiplier;
	}, 0);
	const totalAssetValue = totalHoldingsValue + totalPositionsValue;

	// Calculate overall invested and current values to get a combined P&L
	const totalInvestedHoldings = holdings.reduce(
		(sum, h) => sum + h.quantity * h.avgBuyPrice,
		0
	);
	const totalCurrentHoldings = holdings.reduce(
		(sum, h) => sum + h.quantity * h.currentMarketPrice,
		0
	);

	const totalInvestedPositions = positions.reduce((sum, p) => {
		// For positions, 'invested' value depends on BUY/SELL type for accurate P&L calculation
		const multiplier = p.type === "BUY" ? 1 : -1; // Invested in BUY position, capital blocked in SELL position
		return sum + p.quantity * p.entryPrice * multiplier;
	}, 0);
	const totalCurrentPositions = positions.reduce((sum, p) => {
		const multiplier = p.type === "BUY" ? 1 : -1;
		return sum + p.quantity * p.currentMarketPrice * multiplier;
	}, 0);

	// Sum up combined invested and current values
	const combinedInvestedCapital =
		totalInvestedHoldings + totalInvestedPositions;
	const combinedCurrentCapital = totalCurrentHoldings + totalCurrentPositions;

	const combinedProfitLoss = combinedCurrentCapital - combinedInvestedCapital;

	// Calculate percentage based on the initial invested capital. Avoid division by zero.
	const totalProfitPercentage =
		combinedInvestedCapital !== 0
			? (combinedProfitLoss / combinedInvestedCapital) * 100
			: 0;

	return (
		<div className="flex flex-col bg-[#214843] text-white min-h-screen">
			{/* Sticky Header */}
			<div className="sticky top-0 z-30 bg-[#214843] py-3">
				<h1 className="text-4xl font-bold py-3 pl-6 text-white">Stock Market App</h1>
			</div>

			{/* Market Summary Card - Positioned for half overlap */}
			<div className="relative z-20 w-full">
				<Balance
					totalAssetValue={totalAssetValue}
					totalProfitPercentage={totalProfitPercentage}
				/>
			</div>
			{/* Content Area - Starts from the center of the Market Summary Card */}
			<div className="flex-grow rounded-t-2xl bg-white shadow-inner -mt-20 z-10 overflow-y-auto no-scrollbar">
				<div className="w-full flex items-center justify-center gap-4 p-4 mt-20">
					<StatBox
						icon={<PiPiggyBank size={24} color="#1D3F3F" />}
						bgColor="bg-[#FEFBDA]"
						iconColor="bg-[#FEF29A]"
						title="Invested"
						amount={combinedInvestedCapital}
					/>
					<StatBox
						icon={<AiOutlineStock size={28} color="#1D3F3F" />}
						bgColor="bg-[#F3F2F2]"
						iconColor="bg-[#EAEBEA]"
						title="Revenue"
						amount={combinedProfitLoss}
					/>
				</div>
				{/* Todays Stock Section */}
				{/* Centering Wrapper for Desktop */}
				<div className="w-full lg:flex lg:flex-col lg:items-center">
					<div className="lg:w-max overflow-scroll no-scrollbar">
						{" "}
						{/* This container ensures the content doesn't stretch full-width on desktop */}
						<h2 className="text-xl font-bold text-gray-800 mt-4 mb-2 px-5 lg:px-0">
							Trending
						</h2>
						<HorizontalStockList
							stocks={trendingStocks}
							onStockClick={onStockSelect}
						/>
					</div>
					<div className="lg:w-max overflow-scroll no-scrollbar">
						{" "}
						{/* This container ensures the content doesn't stretch full-width on desktop */}
						<h2 className="text-xl font-bold text-gray-800 mt-4 mb-2 px-5 lg:px-0">
							Top Gainers
						</h2>
						<HorizontalStockList
							stocks={topGainers}
							onStockClick={onStockSelect}
						/>
					</div>

					<div className="lg:w-max overflow-scroll no-scrollbar">
						{" "}
						{/* This container ensures the content doesn't stretch full-width on desktop */}
						<h2 className="text-xl font-bold text-gray-800 mt-4 mb-2 px-5 lg:px-0">
							Top Losers
						</h2>
						<HorizontalStockList
							stocks={topLosers}
							onStockClick={onStockSelect}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * The Watchlist page component, which displays lists of stocks and allows users to search.
 */
const WatchlistPage: React.FC<WatchlistPageProps> = ({
	onStockSelect,
	allStocks,
	watchList,
	onAddStock,
	onRemoveStock,
}) => {
	// State for the currently selected watchlist tab.
	const [selectedWatchlist, setSelectedWatchlist] = useState<string>(
		Object.keys(watchList)[0] || ""
	);
	// State for the search input query.
	const [searchQuery, setSearchQuery] = useState<string>("");
	// State to toggle edit mode for the watchlist.
	const [isEditMode, setIsEditMode] = useState(false);

	const watchListNames = Object.keys(watchList);
	const isSearchActive = searchQuery.length > 0;
	const showActionButtons = isEditMode || isSearchActive;

	// Determine which stocks to display based on whether a search is active.
	const stocksToDisplay = isSearchActive
		? allStocks.filter(
				(stock) =>
					stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					stock.exchange.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: (watchList[selectedWatchlist] || [])
				.map((stockId) => allStocks.find((stock) => stock.id === stockId))
				.filter((stock): stock is Stock => stock !== undefined);

	/** Handles changing the active watchlist tab. */
	const handleWatchlistChange = (name: string) => {
		// Haptic: Light feedback for switching tabs.
		triggerHapticFeedback("light");
		setSelectedWatchlist(name);
	};

	const handleDoneClick = () => {
		triggerHapticFeedback("medium");
		setSearchQuery("");
		setIsEditMode(false);
	};

	/** Toggles the edit mode on or off. */
	const handleEditClick = () => {
		// Haptic: Medium feedback for entering/exiting an edit mode.
		triggerHapticFeedback("medium");
		setIsEditMode((prev) => !prev);
	};

	/** Renders the action button, which can be an 'Edit' or 'Done' button. */
	const renderActionButton = () => {
		if (isEditMode || isSearchActive) {
			return (
				<button
					onClick={handleDoneClick}
					className="inline-flex self-stretch items-center rounded-full bg-[#5296c1] px-4 text-white shadow-sm transition-colors"
					aria-label="Done editing"
				>
					<FaCheckCircle className="scale-125" />
				</button>
			);
		}
		return (
			<button
				onClick={handleEditClick}
				className="inline-flex self-stretch items-center rounded-full bg-white px-4 text-[#5c5e62] shadow-sm transition-colors hover:bg-gray-100"
				aria-label="Edit watchlist"
			>
				<IoIosSettings className="scale-150" />
			</button>
		);
	};

	return (
		<div className="flex flex-col bg-[#214843] min-h-screen">
			{/* Sticky Header */}
			<div className="sticky top-0 z-30 bg-[#214843] py-3">
				<h1 className="text-4xl font-bold py-3 pl-6 text-white">Watchlist</h1>
				{/* Watchlist names moved here, similar to Balance card's positioning */}
			</div>

			{/* Content Area - Starts from the center of the Watchlist Names (similar to Balance Card) */}
			<div className="flex items-center gap-3 my-3 px-3 z-10">
				<div className="relative flex-grow flex items-center w-full rounded-full shadow-md bg-white">
					<span className="absolute left-3">
						<FaSearch size={20} color="#5c5e62" />
					</span>
					<input
						type="text"
						placeholder="Search & Add Stocks"
						className="w-full pl-12 py-3 bg-white text-[#5c5e62] placeholder:text-gray-400 rounded-full focus:outline-none"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				{renderActionButton()}
			</div>

			<div className="px-3 mt-2 whitespace-nowrap overflow-x-scroll z-10 no-scrollbar">
				{watchListNames.map((watchListName) => (
					<button
						key={watchListName}
						className={`
            inline-block px-6 py-2.5 mr-2 rounded-full
            font-bold text-sm tracking-wide transition-colors duration-300 ease-in-out
                 ${
										selectedWatchlist === watchListName
											? "bg-[#286a61] text-white shadow-md"
											: "bg-[#EBEAEB] text-[#214843] hover:bg-gray-200"
									}
                 `}
						onClick={() => handleWatchlistChange(watchListName)}
					>
						{watchListName}
					</button>
				))}
			</div>
			<div className="flex-grow rounded-t-2xl bg-white shadow-inner -mt-20 z-0">
				<div className="pt-20 p-3 text-[#5c5e62]">
					{stocksToDisplay.length > 0 ? (
						stocksToDisplay.map((stock) => {
							const isAdded = (watchList[selectedWatchlist] || []).includes(
								stock.id
							);
							return (
								<StockItem
									key={stock.id}
									stock={stock}
									onStockClick={onStockSelect}
									isAdded={isAdded}
									isEditActive={showActionButtons}
									onAdd={() => onAddStock(stock.id, selectedWatchlist)}
									onRemove={() => onRemoveStock(stock.id, selectedWatchlist)}
								/>
							);
						})
					) : (
						<div className="text-center mt-10 pb-10">
							{isSearchActive ? (
								<EmptyState
									icon={<MdSearchOff size={80} />}
									title="No stocks found"
									subtitle="Try searching something different"
								/>
							) : (
								<EmptyState
									icon={<TbBriefcaseOff size={80} />}
									title="This watchlist is empty"
									subtitle="Try adding new stocks to the watchlist"
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

/**
 * The Portfolio page component, which shows user's holdings and positions.
 */
const PortfolioPage: React.FC<PortfolioPageProps> = ({
	onStockSelect,
	holdings,
	positions,
}) => {
	// State for the active tab ('holdings' or 'positions').
	const [activeTab, setActiveTab] = useState<"holdings" | "positions">(
		"holdings"
	);

	/** Handles changing the active portfolio tab. */
	const handleTabChange = (tab: "holdings" | "positions") => {
		// Haptic: Light feedback for switching tabs.
		triggerHapticFeedback("light");
		setActiveTab(tab);
	};

	// Calculate total values for holdings.
	const totalInvestedHoldings = holdings.reduce(
		(sum, s) => sum + s.quantity * s.avgBuyPrice,
		0
	);
	const totalCurrentHoldings = holdings.reduce(
		(sum, s) => sum + s.quantity * s.currentMarketPrice,
		0
	);
	const holdingsPL = totalCurrentHoldings - totalInvestedHoldings;
	const holdingsPLPercentage =
		totalInvestedHoldings > 0 ? (holdingsPL / totalInvestedHoldings) * 100 : 0;

	const absoluteInvestedCapital = positions.reduce(
		(sum, s) => sum + s.quantity * s.entryPrice,
		0
	);
	const totalInvestedPositions = positions.reduce((sum, s) => {
		const multiplier = s.type === "SELL" ? -1 : 1;
		return sum + s.quantity * s.entryPrice * multiplier;
	}, 0);
	const totalCurrentPositions = positions.reduce((sum, s) => {
		const multiplier = s.type === "SELL" ? -1 : 1;
		return sum + s.quantity * s.currentMarketPrice * multiplier;
	}, 0);
	const positionsPL = totalCurrentPositions - totalInvestedPositions;

	// Calculate percentage P&L against the absolute capital invested for a more meaningful metric.
	const positionsPLPercentage =
		absoluteInvestedCapital > 0
			? (positionsPL / absoluteInvestedCapital) * 100
			: 0;

	return (
		<div className="flex flex-col bg-white text-white">
			{/* Sticky Header */}
			<div className="sticky top-0 z-30 bg-[#214843] py-3">
				<h1 className="text-4xl font-bold py-3 pl-6 text-white">Portfolio</h1>
			</div>
			{/* Content Area */}
			<div className="flex flex-col bg-[#214843] text-[#5c5e62]">
				{activeTab === "holdings" ? (
					<SummaryCard
						investedAmount={totalInvestedHoldings}
						currentAmount={totalCurrentHoldings}
						profit={holdingsPL}
						profitPercentage={holdingsPLPercentage}
						showPercentagePL={true}
					/>
				) : (
					<SummaryCard
						investedAmount={totalInvestedPositions}
						currentAmount={totalCurrentPositions}
						profit={positionsPL}
						profitPercentage={positionsPLPercentage}
						showPercentagePL={true}
					/>
				)}
				{/* A container to pad the component */}
				<div className="w-full px-3 pt-4 z-20">
					{/* Flex container to hold the two buttons with a gap */}
					<div className="flex w-full gap-3">
						{/* Holdings Tab */}
						<button
							className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-colors duration-300 ease-in-out
        ${
					activeTab === "holdings"
						? "bg-[#286a61] text-white"
						: "bg-[#EBEAEB] text-[#214843] hover:bg-gray-200"
				}
            `}
							onClick={() => handleTabChange("holdings")}
						>
							<span>Holdings</span>
						</button>

						{/* Positions Tab */}
						<button
							className={`
        flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full
        font-bold text-sm tracking-wide transition-colors duration-300 ease-in-out
        ${
					activeTab === "positions"
						? "bg-[#286a61] text-white shadow-md"
						: "bg-[#EBEAEB] text-[#214843] hover:bg-gray-200"
				}
      `}
							onClick={() => handleTabChange("positions")}
						>
							<span>Positions</span>
						</button>
					</div>
				</div>
				{activeTab === "holdings" ? (
					<>
						<div className="px-3 py-24 flex-grow rounded-t-2xl bg-white -mt-36 z-0 pt-32">
							<div className="pt-5">
								{holdings.length > 0 ? (
									holdings.map((stock) => (
										<HoldingStockItem
											key={stock.id}
											stock={stock}
											onStockClick={onStockSelect}
										/>
									))
								) : (
									<EmptyState
										icon={<TbBriefcaseOff size={80} />}
										title="No Holdings"
										subtitle="Place an order from your watchlist"
									/>
								)}
							</div>
						</div>
					</>
				) : (
					<>
						<div className="px-3 py-24 flex-grow rounded-t-2xl bg-white shadow-inner -mt-36 z-0 pt-32">
							<div className="pt-5">
								{positions.length > 0 ? (
									positions.map((stock) => (
										<PositionStockItem
											key={stock.id}
											stock={stock}
											onStockClick={onStockSelect}
										/>
									))
								) : (
									<EmptyState
										icon={<TbBriefcaseOff size={80} />}
										title="No Positions"
										subtitle="Place an order from your watchlist"
									/>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

/**
 * The News page component, displaying articles filtered by category.
 */
const NewsPage: React.FC = () => {
	// State for the selected news category.
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	// Filter news articles based on the selected category.
	const filteredNews =
		selectedCategory === "All"
			? DUMMY_NEWS_ARTICLES
			: DUMMY_NEWS_ARTICLES.filter((a) => a.category === selectedCategory);

	/** Handles changing the active news category. */
	const handleCategoryChange = (category: string) => {
		// Haptic: Light feedback for switching tabs.
		triggerHapticFeedback("light");
		setSelectedCategory(category);
	};

	return (
		<div className="flex flex-col bg-[#214843] min-h-screen">
			{/* Sticky Header */}
			<div className="sticky top-0 z-30 bg-[#214843] py-3">
				<h1 className="text-4xl font-bold py-3 pl-6 text-white">News</h1>
			</div>

			{/* Content Area */}
			<div className="flex-grow rounded-t-2xl bg-white relative z-10">
				<div className="py-3 whitespace-nowrap overflow-x-scroll no-scrollbar">
					<div className="px-3 mt-2 whitespace-nowrap overflow-x-scroll z-10 no-scrollbar">
						{DUMMY_NEWS_CATEGORIES.map((category) => (
							<button
								key={category}
								className={`
                inline-block px-3 py-2.5 mr-2 rounded-full
                font-bold text-sm tracking-wide transition-colors duration-300 ease-in-out
                 ${
										selectedCategory === category
											? "bg-[#286a61] text-white shadow-md"
											: "bg-[#EBEAEB] text-[#214843] hover:bg-gray-200"
									}
                 `}
								onClick={() => handleCategoryChange(category)}
							>
								{category}
							</button>
						))}
					</div>
				</div>
				<div className="px-3 py-2 pt-2">
					{filteredNews.length > 0 ? (
						filteredNews.map((article) => (
							<NewsItem key={article.id} article={article} />
						))
					) : (
						<div className="text-center mt-10 pb-10">
							<EmptyState
								icon={<TbNewsOff size={80} />}
								title="No News Available"
								subtitle="There are no articles in this category right now"
							/>
						</div>
					)}
					{/* <div className="h-10" /> */}
				</div>
			</div>
		</div>
	);
};

//================================================================
// 5. MAIN PARENT COMPONENT
//================================================================

/**
 * The main component of the application that manages all state and renders different pages.
 */
export default function StockMarketAppExport() {
	// State for the current active view (page).
	const [currentView, setCurrentView] = useState<CurrentView>("home");
	// State for the currently selected stock to show in the detail sheet.
	const [selectedStock, setSelectedStock] = useState<SelectableStock | null>(
		null
	);
	// State to control the visibility of the stock detail sheet.
	const [isSheetOpen, setSheetOpen] = useState(false);

	// --- Data State ---
	// State for the master list of all stocks.
	const [stocks, setStocks] = useState<Stock[]>(DUMMY_STOCKS);
	// State for the user's watchlists.
	const [watchList, setwatchList] = useState<WState>({
		"My Stocks": ["1", "6", "8"],
		"Tech Giants": ["1", "2", "3", "4", "5"],
		"Green Energy": ["10"],
		"Value Picks": ["6"],
		"Growth Stocks": ["5"],
		ETFs: [],
	});
	// State for the user's portfolio holdings.
	const [holdings, setHoldings] = useState<HoldingStock[]>(DUMMY_HOLDINGS);
	// State for the user's intraday positions.
	const [positions, setPositions] = useState<PositionStock[]>(DUMMY_POSITIONS);
	// State for all created price alerts.
	const [alerts, setAlerts] = useState<PriceAlert[]>([]);

	// --- UI State ---
	// State for the custom notification pop-up.
	const [notification, setNotification] = useState({
		visible: false,
		message: "",
		description: "",
		type: "",
	});
	// Ref to manage the timeout for hiding notifications.
	const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	/**
	 * Displays a notification pop-up.
	 * @param message The main title of the notification.
	 * @param description The body text of the notification.
	 * @param type The type of notification ('success' or 'alert').
	 */
	const showNotification = (
		message: string,
		description: string,
		type: "success" | "alert" = "success"
	) => {
		// Haptic: Trigger success or error feedback along with the notification.
		triggerHapticFeedback(type === "alert" ? "error" : "success");
		if (notificationTimeoutRef.current) {
			clearTimeout(notificationTimeoutRef.current);
		}
		setNotification({ visible: true, message, description, type });

		notificationTimeoutRef.current = setTimeout(() => {
			setNotification((prev) => ({ ...prev, visible: false }));
		}, 3000);
	};

	/** Adds a stock to a specific watchlist. */
	const handleAddStockToWatchlist = (
		stockId: string,
		watchListName: string
	) => {
		const stockToFind = DUMMY_STOCKS.find((stock) => stock.id === stockId);
		const stockName = stockToFind?.name;
		setwatchList((prev) => {
			const currentList = prev[watchListName] || [];
			if (!currentList.includes(stockId)) {
				return {
					...prev,
					[watchListName]: [...currentList, stockId],
				};
			}
			return prev;
		});
		showNotification("Stock Added", `Added ${stockName} to ${watchListName}`);
	};

	/** Removes a stock from a specific watchlist. */
	const handleRemoveStockFromWatchlist = (
		stockId: string,
		watchListName: string
	) => {
		const stockToFind = DUMMY_STOCKS.find((stock) => stock.id === stockId);
		const stockName = stockToFind?.name;
		setwatchList((prev) => ({
			...prev,
			[watchListName]: (prev[watchListName] || []).filter(
				(id: string) => id !== stockId
			),
		}));
		showNotification(
			"Stock Removed",
			`Removed ${stockName} from ${watchListName}`
		);
	};

	// Effect to simulate real-time price fluctuations every 3 seconds.
	useEffect(() => {
		const interval = setInterval(() => {
			const updatePrice = (price: number) =>
				Math.max(0, price + (Math.random() - 0.5) * 0.5);

			setStocks((prevStocks) =>
				prevStocks.map((s) => ({
					...s,
					currentPrice: updatePrice(s.currentPrice),
				}))
			);
			setHoldings((prevHoldings) =>
				prevHoldings.map((h) => ({
					...h,
					currentMarketPrice: updatePrice(h.currentMarketPrice),
				}))
			);
			setPositions((prevPositions) =>
				prevPositions.map((p) => ({
					...p,
					currentMarketPrice: updatePrice(p.currentMarketPrice),
				}))
			);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	// Effect to check for triggered price alerts whenever prices or alerts change.
	useEffect(() => {
		const priceMap = new Map<string, number>();
		stocks.forEach((s) => priceMap.set(s.id, s.currentPrice));
		holdings.forEach((h) => priceMap.set(h.id, h.currentMarketPrice));
		positions.forEach((p) => priceMap.set(p.id, p.currentMarketPrice));

		const triggeredAlertIds = new Set<number>();

		alerts.forEach((alert) => {
			if (!alert.triggered && priceMap.has(alert.stockId)) {
				const currentPrice = priceMap.get(alert.stockId)!;
				const hasTriggered =
					(alert.direction === "up" && currentPrice >= alert.targetPrice) ||
					(alert.direction === "down" && currentPrice <= alert.targetPrice);

				if (hasTriggered) {
					const movement =
						alert.direction === "up" ? "crossed above" : "dropped below";
					showNotification(
						`Price Alert!`,
						`${
							alert.stockName
						} has ${movement} $${alert.targetPrice.toLocaleString("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}`,
						"alert"
					);
					triggeredAlertIds.add(alert.id);
				}
			}
		});

		// Mark triggered alerts to prevent re-triggering.
		if (triggeredAlertIds.size > 0) {
			setAlerts((prevAlerts) =>
				prevAlerts.map((a) =>
					triggeredAlertIds.has(a.id) ? { ...a, triggered: true } : a
				)
			);
		}
	}, [stocks, holdings, positions, alerts]);

	/** Handles selecting a stock from any list to open the detail sheet. */
	const handleStockSelect = (clickedStock: SelectableStock) => {
		// Haptic: Medium feedback for a primary action like opening a detail sheet.
		triggerHapticFeedback("medium");
		let stockForSheet: SelectableStock = clickedStock;
		// Check if the selected stock is already in holdings or positions to show owned quantity.
		if (!("quantity" in clickedStock)) {
			const holdingInfo = holdings.find((h) => h.name === clickedStock.name);
			const positionInfo = positions.find((p) => p.name === clickedStock.name);
			if (holdingInfo) {
				stockForSheet = {
					...clickedStock,
					id: holdingInfo.id,
					quantity: holdingInfo.quantity,
					avgBuyPrice: holdingInfo.avgBuyPrice,
					currentMarketPrice: holdingInfo.currentMarketPrice,
				};
			} else if (positionInfo) {
				stockForSheet = {
					...clickedStock,
					id: positionInfo.id,
					quantity: positionInfo.quantity,
					type: positionInfo.type,
					entryPrice: positionInfo.entryPrice,
					currentMarketPrice: positionInfo.currentMarketPrice,
				};
			}
		}
		setSelectedStock(stockForSheet);
		setSheetOpen(true);
	};

	/** Handles the opening and closing of the detail sheet. */
	const handleSheetOpenChange = (open: boolean) => {
		setSheetOpen(open);
		if (!open) {
			// Delay clearing the selected stock to allow for the closing animation.
			setTimeout(() => setSelectedStock(null), 300);
		}
	};

	/** Creates a new price alert. */
	const handleSetAlert = (stock: SelectableStock, targetPrice: number) => {
		const currentPrice =
			"currentMarketPrice" in stock
				? stock.currentMarketPrice
				: stock.currentPrice;
		const newAlert: PriceAlert = {
			id: Date.now(),
			stockId: stock.id,
			stockName: stock.name,
			targetPrice: targetPrice,
			direction: targetPrice > currentPrice ? "up" : "down",
			triggered: false,
		};
		setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
		const directionText =
			newAlert.direction === "up" ? "goes above" : "drops below";
		showNotification(
			"Alert Set!",
			`We'll notify you if ${
				stock.name
			} ${directionText} $${targetPrice.toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`,
			"success"
		);
	};

	/** Handles the logic for buying a stock. */
	const handleBuy = (
		stockToBuy: SelectableStock,
		quantity: number,
		transactionType: "holding" | "position"
	) => {
		const currentPrice =
			"currentMarketPrice" in stockToBuy
				? stockToBuy.currentMarketPrice
				: stockToBuy.currentPrice;

		if (transactionType === "holding") {
			setHoldings((prevHoldings) => {
				const existingHoldingIndex = prevHoldings.findIndex(
					(h) => h.name === stockToBuy.name
				);
				if (existingHoldingIndex > -1) {
					// If holding exists, update quantity and average price.
					const updatedHoldings = [...prevHoldings];
					const existingHolding = updatedHoldings[existingHoldingIndex];
					const totalExistingValue =
						existingHolding.avgBuyPrice * existingHolding.quantity;
					const newPurchaseValue = currentPrice * quantity;
					const newTotalQuantity = existingHolding.quantity + quantity;
					updatedHoldings[existingHoldingIndex] = {
						...existingHolding,
						quantity: newTotalQuantity,
						avgBuyPrice:
							(totalExistingValue + newPurchaseValue) / newTotalQuantity,
					};
					return updatedHoldings;
				} else {
					// If not, create a new holding.
					const newHolding: HoldingStock = {
						id: `h-${Date.now()}`,
						name: stockToBuy.name,
						exchange: stockToBuy.exchange,
						quantity: quantity,
						avgBuyPrice: currentPrice,
						currentMarketPrice: currentPrice,
					};
					return [...prevHoldings, newHolding];
				}
			});
		} else {
			// transactionType === 'position'
			setPositions((prevPositions) => {
				const existingPositionIndex = prevPositions.findIndex(
					(p) => p.name === stockToBuy.name && p.type === "BUY"
				);
				if (existingPositionIndex > -1) {
					// If position exists, update quantity and average entry price.
					const updatedPositions = [...prevPositions];
					const existingPosition = updatedPositions[existingPositionIndex];
					const totalExistingValue =
						existingPosition.entryPrice * existingPosition.quantity;
					const newPurchaseValue = currentPrice * quantity;
					const newTotalQuantity = existingPosition.quantity + quantity;
					updatedPositions[existingPositionIndex] = {
						...existingPosition,
						quantity: newTotalQuantity,
						entryPrice:
							(totalExistingValue + newPurchaseValue) / newTotalQuantity,
						currentMarketPrice: currentPrice,
					};
					return updatedPositions;
				} else {
					// If not, create a new position.
					const newPosition: PositionStock = {
						id: `p-${Date.now()}`,
						name: stockToBuy.name,
						exchange: stockToBuy.exchange,
						quantity: quantity,
						entryPrice: currentPrice,
						currentMarketPrice: currentPrice,
						type: "BUY",
					};
					return [...prevPositions, newPosition];
				}
			});
		}
		setSheetOpen(false);
		showNotification(
			"Transaction Complete",
			`${quantity} ${stockToBuy.name} shares added to your ${transactionType}s`
		);
	};

	/** Handles the logic for selling a stock. */
	const handleSell = (
		stockToSell: SelectableStock,
		quantity: number,
		assetType: "holding" | "position"
	) => {
		if (assetType === "holding") {
			setHoldings((prevHoldings) => {
				const holdingIndex = prevHoldings.findIndex(
					(h) => h.id === stockToSell.id
				);
				if (
					holdingIndex === -1 ||
					prevHoldings[holdingIndex].quantity < quantity
				)
					return prevHoldings;

				if (prevHoldings[holdingIndex].quantity === quantity) {
					// If selling all shares, remove the holding.
					return prevHoldings.filter((h) => h.id !== stockToSell.id);
				} else {
					// Otherwise, just decrease the quantity.
					const updatedHoldings = [...prevHoldings];
					updatedHoldings[holdingIndex] = {
						...updatedHoldings[holdingIndex],
						quantity: updatedHoldings[holdingIndex].quantity - quantity,
					};
					return updatedHoldings;
				}
			});
		} else {
			// assetType === 'position'
			setPositions((prevPositions) => {
				const positionIndex = prevPositions.findIndex(
					(p) => p.id === stockToSell.id
				);
				if (
					positionIndex === -1 ||
					prevPositions[positionIndex].quantity < quantity
				)
					return prevPositions;

				if (prevPositions[positionIndex].quantity === quantity) {
					// If closing the whole position, remove it.
					return prevPositions.filter((p) => p.id !== stockToSell.id);
				} else {
					// Otherwise, decrease the quantity.
					const updatedPositions = [...prevPositions];
					updatedPositions[positionIndex] = {
						...updatedPositions[positionIndex],
						quantity: updatedPositions[positionIndex].quantity - quantity,
					};
					return updatedPositions;
				}
			});
		}
		setSheetOpen(false);
		showNotification(
			"Transaction Complete",
			`You sold ${quantity} shares of ${stockToSell.name}`
		);
	};

	/** Import all the required fonts */
	const FontStyles = () => (
		<style jsx global>{`
			@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap");
			@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@557&display=swap");
			@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

			.quicksand {
				font-family: "Quicksand", sans-serif;
			}

			.manrope {
				font-family: "Manrope", sans-serif;
				font-optical-sizing: auto;
				letter-spacing: 0.6px;
				font-style: normal;
			}

			.manrope-med {
				font-family: "Manrope", sans-serif;
				font-optical-sizing: auto;
				font-weight: 500;
				letter-spacing: 0.6px;
				font-style: normal;
			}
			.roboto-med {
				font-family: "Roboto", sans-serif;
				font-optical-sizing: auto;
				font-weight: 500;
				font-style: normal;
				font-variation-settings: "wdth" 100;
			}
			.roboto {
				font-family: "Roboto", sans-serif;
				font-optical-sizing: auto;
				font-style: normal;
				font-variation-settings: "wdth" 100;
			}
			.no-scrollbar::-webkit-scrollbar {
				display: none;
			}

			.no-scrollbar {
				-ms-overflow-style: none; /* IE and Edge */
				scrollbar-width: none; /* Firefox */
			}
		`}</style>
	);

	/** Renders the current page based on the 'currentView' state. */
	const renderCurrentView = () => {
		switch (currentView) {
			case "home":
				return (
					<HomePage
						onStockSelect={handleStockSelect}
						allStocks={stocks}
						holdings={holdings}
						positions={positions}
					/>
				);

			case "watchlist":
				return (
					<WatchlistPage
						onStockSelect={handleStockSelect}
						allStocks={stocks}
						watchList={watchList}
						onAddStock={handleAddStockToWatchlist}
						onRemoveStock={handleRemoveStockFromWatchlist}
					/>
				);
			case "portfolio":
				return (
					<PortfolioPage
						onStockSelect={handleStockSelect}
						holdings={holdings}
						positions={positions}
					/>
				);
			case "news":
				return <NewsPage />;
			default:
				return (
					<HomePage
						onStockSelect={handleStockSelect}
						allStocks={stocks}
						holdings={holdings}
						positions={positions}
					/>
				);
		}
	};

	return (
		<>
			<FontStyles />
			<div className={`pb-[100px] min-h-screen flex flex-col bg-white manrope`}>
				<main className="flex-grow">{renderCurrentView()}</main>

				<BottomNavBar onNavClick={setCurrentView} currentView={currentView} />

				<StockDetailSheet
					open={isSheetOpen}
					onOpenChange={handleSheetOpenChange}
					stock={selectedStock}
					onSetAlert={handleSetAlert}
					onBuy={handleBuy}
					onSell={handleSell}
				/>
				<CustomNotification
					visible={notification.visible}
					message={notification.message}
					description={notification.description}
					type={notification.type}
				/>
			</div>
		</>
	);
}
