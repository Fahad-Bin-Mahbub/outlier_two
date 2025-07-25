"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface CandlestickData {
	date: Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	timestamp: number;
}

interface StockData {
	symbol: string;
	name: string;
	data: CandlestickData[];
	currentPrice: number;
	change: number;
	changePercent: number;
	marketCap: number;
	volume24h: number;
}

interface TechnicalPattern {
	name: string;
	description: string;
	educationalContent: string;
	identificationPoints: string[];
	bullishBearish: "bullish" | "bearish" | "neutral";
	reliability: "high" | "medium" | "low";
	demoData: number[][];
}

interface TrendLine {
	start: { x: number; y: number; timestamp: number };
	end: { x: number; y: number; timestamp: number };
	id: string;
}

interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info" | "warning";
}

interface ChartDimensions {
	width: number;
	height: number;
	leftMargin: number;
	rightMargin: number;
	topMargin: number;
	bottomMargin: number;
}

const ProfessionalStockChart: React.FC = () => {
	const [stockData, setStockData] = useState<StockData | null>(null);
	const [timeFrame, setTimeFrame] = useState<"1d" | "1w" | "1m" | "3m" | "1y">(
		"1m"
	);
	const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [trendLines, setTrendLines] = useState<TrendLine[]>([]);
	const [drawingMode, setDrawingMode] = useState<boolean>(false);
	const [currentDrawing, setCurrentDrawing] = useState<TrendLine | null>(null);
	const [detectedPattern, setDetectedPattern] =
		useState<TechnicalPattern | null>(null);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [chartDimensions, setChartDimensions] = useState<ChartDimensions>({
		width: 0,
		height: 0,
		leftMargin: 50,
		rightMargin: 20,
		topMargin: 20,
		bottomMargin: 40,
	});
	const [scrollOffset, setScrollOffset] = useState<number>(0);
	const [candleWidth, setCandleWidth] = useState<number>(8);
	const [showVolumeOverlay, setShowVolumeOverlay] = useState<boolean>(true);
	const [touchStartPoint, setTouchStartPoint] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg">("lg");

	const chartRef = useRef<HTMLDivElement>(null);
	const chartContainerRef = useRef<HTMLDivElement>(null);

	const colors = {
		primary: {
			50: "#EFF6FF",
			100: "#DBEAFE",
			200: "#BFDBFE",
			300: "#93C5FD",
			400: "#60A5FA",
			500: "#3B82F6",
			600: "#2563EB",
			700: "#1D4ED8",
			800: "#1E40AF",
			900: "#1E3A8A",
		},
		success: {
			50: "#ECFDF5",
			100: "#D1FAE5",
			200: "#A7F3D0",
			300: "#6EE7B7",
			400: "#34D399",
			500: "#10B981",
			600: "#059669",
			700: "#047857",
			800: "#065F46",
			900: "#064E3B",
		},
		danger: {
			50: "#FEF2F2",
			100: "#FEE2E2",
			200: "#FECACA",
			300: "#FCA5A5",
			400: "#F87171",
			500: "#EF4444",
			600: "#DC2626",
			700: "#B91C1C",
			800: "#991B1B",
			900: "#7F1D1D",
		},
		purple: {
			50: "#FAF5FF",
			100: "#F3E8FF",
			200: "#E9D5FF",
			300: "#D8B4FE",
			400: "#C084FC",
			500: "#A855F7",
			600: "#9333EA",
			700: "#7C3AED",
			800: "#6B46C1",
			900: "#581C87",
		},
		gray: {
			50: "#F9FAFB",
			100: "#F3F4F6",
			200: "#E5E7EB",
			300: "#D1D5DB",
			400: "#9CA3AF",
			500: "#6B7280",
			600: "#4B5563",
			700: "#374151",
			800: "#1F2937",
			900: "#111827",
		},
	};

	const stockSymbols = [
		{
			symbol: "AAPL",
			name: "Apple Inc.",
			basePrice: 175.43,
			sector: "Technology",
		},
		{
			symbol: "GOOGL",
			name: "Alphabet Inc.",
			basePrice: 129.87,
			sector: "Technology",
		},
		{
			symbol: "MSFT",
			name: "Microsoft Corp.",
			basePrice: 378.85,
			sector: "Technology",
		},
		{
			symbol: "TSLA",
			name: "Tesla Inc.",
			basePrice: 248.42,
			sector: "Automotive",
		},
		{
			symbol: "AMZN",
			name: "Amazon.com Inc.",
			basePrice: 155.89,
			sector: "E-commerce",
		},
		{
			symbol: "NVDA",
			name: "NVIDIA Corp.",
			basePrice: 875.3,
			sector: "Semiconductors",
		},
		{
			symbol: "META",
			name: "Meta Platforms Inc.",
			basePrice: 486.91,
			sector: "Social Media",
		},
		{
			symbol: "NFLX",
			name: "Netflix Inc.",
			basePrice: 641.34,
			sector: "Streaming",
		},
	];

	const technicalPatterns: TechnicalPattern[] = [
		{
			name: "Head and Shoulders",
			description:
				"A bearish reversal pattern forming three peaks with the middle peak highest.",
			educationalContent:
				"The head and shoulders pattern signals potential trend reversal from bullish to bearish. Volume typically decreases from left shoulder to head to right shoulder, confirming the pattern's validity.",
			identificationPoints: [
				"Three distinct peaks with middle peak (head) highest",
				"Two shoulders approximately equal in height",
				"Neckline connects troughs between peaks",
				"Breakdown below neckline confirms pattern",
				"Volume decreases through pattern formation",
			],
			bullishBearish: "bearish",
			reliability: "high",
			demoData: [
				[100, 105, 98, 104],
				[104, 108, 102, 106],
				[106, 112, 105, 110],
				[110, 115, 108, 113],
				[113, 116, 110, 112],
				[112, 114, 107, 109],
				[109, 111, 105, 107],
				[107, 109, 103, 105],
				[105, 106, 100, 102],
			],
		},
		{
			name: "Double Bottom",
			description:
				"A bullish reversal pattern showing two troughs at similar price levels.",
			educationalContent:
				"Double bottom patterns indicate strong support and potential trend reversal. The pattern is confirmed when price breaks above the resistance level between the two bottoms.",
			identificationPoints: [
				"Two troughs at approximately same price level",
				"Significant peak between the two bottoms",
				"Confirmation on break above resistance",
				"Volume increases on second bottom and breakout",
				"Time separation between bottoms important",
			],
			bullishBearish: "bullish",
			reliability: "high",
			demoData: [
				[110, 112, 105, 107],
				[107, 108, 102, 103],
				[103, 108, 102, 106],
				[106, 112, 105, 110],
				[110, 111, 107, 108],
				[108, 109, 103, 104],
				[104, 109, 103, 107],
				[107, 113, 106, 111],
				[111, 118, 110, 116],
			],
		},
		{
			name: "Ascending Triangle",
			description:
				"A bullish continuation pattern with horizontal resistance and rising support.",
			educationalContent:
				"Ascending triangles show increasing buying pressure as buyers step in at higher levels while sellers remain consistent at resistance.",
			identificationPoints: [
				"Horizontal resistance line at consistent level",
				"Rising support line from higher lows",
				"At least two touches on each line",
				"Volume typically decreases during formation",
				"Breakout above resistance confirms pattern",
			],
			bullishBearish: "bullish",
			reliability: "medium",
			demoData: [
				[100, 108, 99, 105],
				[105, 108, 103, 106],
				[106, 108, 105, 107],
				[107, 108, 106, 107],
				[107, 108, 107, 108],
				[108, 112, 107, 111],
				[111, 115, 110, 114],
			],
		},
		{
			name: "Cup and Handle",
			description:
				"A bullish continuation pattern resembling a cup with a handle.",
			educationalContent:
				"The cup and handle pattern shows a period of consolidation followed by a brief pullback before continuation of the uptrend.",
			identificationPoints: [
				"U-shaped cup formation over several weeks/months",
				"Handle forms as small downward drift",
				"Handle should not retrace more than 1/3 of cup",
				"Volume decreases during cup and handle formation",
				"Breakout above handle resistance confirms pattern",
			],
			bullishBearish: "bullish",
			reliability: "medium",
			demoData: [
				[120, 122, 118, 119],
				[119, 120, 115, 116],
				[116, 117, 112, 113],
				[113, 115, 112, 114],
				[114, 118, 113, 117],
				[117, 119, 116, 118],
				[118, 119, 116, 117],
				[117, 121, 116, 120],
			],
		},
	];

	const generateProfessionalData = (
		days: number,
		basePrice: number
	): CandlestickData[] => {
		const data: CandlestickData[] = [];
		let currentPrice = basePrice;
		const now = new Date();

		for (let i = 0; i < days; i++) {
			const date = new Date(now);

			if (timeFrame === "1d") {
				date.setHours(now.getHours() - (days - i), 0, 0, 0);
			} else {
				date.setDate(now.getDate() - (days - i));
			}

			const marketTrend = Math.sin(i / 20) * 0.015;
			const dailyVolatility = (Math.random() - 0.5) * 0.04;
			const weekendGap = date.getDay() === 1 ? (Math.random() - 0.5) * 0.02 : 0;

			const priceChange = marketTrend + dailyVolatility + weekendGap;
			const open = currentPrice;
			const close = open * (1 + priceChange);

			const intraday = Math.random() * 0.025;
			const high = Math.max(open, close) * (1 + intraday);
			const low = Math.min(open, close) * (1 - intraday);

			const baseVolume = 1000000 + Math.random() * 2000000;
			const volumeMultiplier = 1 + Math.abs(priceChange) * 10;
			const volume = Math.floor(baseVolume * volumeMultiplier);

			data.push({
				date,
				open,
				high,
				low,
				close,
				volume,
				timestamp: date.getTime(),
			});

			currentPrice = close;
		}

		return data;
	};

	const addToast = useCallback(
		(message: string, type: Toast["type"] = "info") => {
			const id = Date.now().toString();
			const toast: Toast = { id, message, type };
			setToasts((prev) => [...prev, toast]);

			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 4000);
		},
		[]
	);

	const loadStockData = useCallback(
		(symbol: string) => {
			setIsLoading(true);
			const symbolData = stockSymbols.find((s) => s.symbol === symbol);

			const dataPoints = {
				"1d": 24,
				"1w": 7,
				"1m": 30,
				"3m": 90,
				"1y": 252,
			};

			setTimeout(() => {
				const mockData: StockData = {
					symbol,
					name: symbolData?.name || "Unknown Company",
					data: generateProfessionalData(
						dataPoints[timeFrame],
						symbolData?.basePrice || 100
					),
					currentPrice: symbolData?.basePrice || 100,
					change: (Math.random() - 0.5) * 8,
					changePercent: (Math.random() - 0.5) * 3,
					marketCap:
						(symbolData?.basePrice || 100) *
						1000000000 *
						(15 + Math.random() * 20),
					volume24h: 25000000 + Math.random() * 75000000,
				};

				setStockData(mockData);
				setIsLoading(false);
				setScrollOffset(0);
			}, 500);
		},
		[timeFrame]
	);

	useEffect(() => {
		const updateScreenSize = () => {
			const width = window.innerWidth;
			if (width < 768) {
				setScreenSize("sm");
			} else if (width < 1024) {
				setScreenSize("md");
			} else {
				setScreenSize("lg");
			}
		};

		updateScreenSize();
		window.addEventListener("resize", updateScreenSize);
		return () => window.removeEventListener("resize", updateScreenSize);
	}, []);

	useEffect(() => {
		const updateDimensions = () => {
			if (chartRef.current) {
				const rect = chartRef.current.getBoundingClientRect();
				const leftMargin =
					screenSize === "sm" ? 35 : screenSize === "md" ? 45 : 50;
				const bottomMargin = screenSize === "sm" ? 30 : 40;

				setChartDimensions({
					width: rect.width,
					height: rect.height,
					leftMargin,
					rightMargin: 20,
					topMargin: 20,
					bottomMargin,
				});
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, [screenSize]);

	useEffect(() => {
		loadStockData(selectedSymbol);
	}, [selectedSymbol, timeFrame, loadStockData]);

	const getFilteredData = (): CandlestickData[] => {
		if (!stockData) return [];
		return stockData.data;
	};

	const handlePointerStart = useCallback(
		(e: React.PointerEvent) => {
			e.preventDefault();

			if (drawingMode) {
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				setCurrentDrawing({
					start: { x, y, timestamp: Date.now() },
					end: { x, y, timestamp: Date.now() },
					id: `line-${Date.now()}`,
				});
			} else {
				const rect = e.currentTarget.getBoundingClientRect();
				setTouchStartPoint({
					x: e.clientX - rect.left,
					y: e.clientY - rect.top,
				});
			}
		},
		[drawingMode]
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			e.preventDefault();

			if (drawingMode && currentDrawing) {
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				setCurrentDrawing((prev) =>
					prev
						? {
								...prev,
								end: { x, y, timestamp: Date.now() },
						  }
						: null
				);
			}
		},
		[drawingMode, currentDrawing]
	);

	const handlePointerEnd = useCallback(
		(e: React.PointerEvent) => {
			e.preventDefault();

			if (drawingMode && currentDrawing) {
				setTrendLines((prev) => [...prev, currentDrawing]);
				setCurrentDrawing(null);
				addToast("Trend line added", "success");
			} else if (touchStartPoint) {
				const randomPattern =
					technicalPatterns[
						Math.floor(Math.random() * technicalPatterns.length)
					];
				setDetectedPattern(randomPattern);
				setTouchStartPoint(null);
			}
		},
		[drawingMode, currentDrawing, touchStartPoint, addToast, technicalPatterns]
	);

	const renderProfessionalChart = () => {
		if (!stockData || isLoading) {
			return (
				<div className="flex items-center justify-center h-full">
					<div className="relative">
						<div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
						</div>
					</div>
				</div>
			);
		}

		const filteredData = getFilteredData();
		if (filteredData.length === 0) return null;

		const { width, height, leftMargin, rightMargin, topMargin, bottomMargin } =
			chartDimensions;
		const chartWidth = width - leftMargin - rightMargin;
		const chartHeight = height - topMargin - bottomMargin;

		const prices = filteredData.flatMap((d) => [d.high, d.low]);
		const minPrice = Math.min(...prices);
		const maxPrice = Math.max(...prices);
		const priceRange = maxPrice - minPrice;
		const paddedMin = minPrice - priceRange * 0.05;
		const paddedMax = maxPrice + priceRange * 0.05;
		const paddedRange = paddedMax - paddedMin;

		const maxVolume = Math.max(...filteredData.map((d) => d.volume));
		const volumeHeight = chartHeight * 0.2;
		const priceHeight = chartHeight - volumeHeight;

		const totalCandles = filteredData.length;
		const availableWidth = chartWidth;
		const candleSpacing = screenSize === "sm" ? 1 : 2;
		const minCandleWidth = screenSize === "sm" ? 1.5 : 2;
		const maxCandleWidth = screenSize === "sm" ? 8 : 12;

		const calculatedCandleWidth = Math.max(
			minCandleWidth,
			Math.min(maxCandleWidth, availableWidth / totalCandles - candleSpacing)
		);

		const totalContentWidth =
			(calculatedCandleWidth + candleSpacing) * totalCandles;
		const maxScrollOffset = Math.max(0, totalContentWidth - availableWidth);

		const priceToY = (price: number) =>
			topMargin + ((paddedMax - price) / paddedRange) * priceHeight;
		const volumeToHeight = (volume: number) =>
			(volume / maxVolume) * volumeHeight;
		const indexToX = (index: number) =>
			leftMargin +
			index * (calculatedCandleWidth + candleSpacing) -
			scrollOffset;

		const formatDateForTimeframe = (date: Date) => {
			switch (timeFrame) {
				case "1d":
					return screenSize === "sm"
						? date.toLocaleTimeString("en-US", { hour: "2-digit" })
						: date.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
						  });
				case "1w":
					return screenSize === "sm"
						? date.toLocaleDateString("en-US", { weekday: "narrow" })
						: date.toLocaleDateString("en-US", { weekday: "short" });
				case "1m":
				case "3m":
					return screenSize === "sm"
						? date.getDate().toString()
						: date.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
						  });
				case "1y":
					return screenSize === "sm"
						? date.toLocaleDateString("en-US", { month: "numeric" })
						: date.toLocaleDateString("en-US", {
								month: "short",
								year: "2-digit",
						  });
				default:
					return date.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					});
			}
		};

		const getLabelSpacing = () => {
			const baseSpacing = Math.ceil(
				filteredData.length /
					(screenSize === "sm" ? 4 : screenSize === "md" ? 5 : 6)
			);
			return Math.max(1, baseSpacing);
		};

		const labelSpacing = getLabelSpacing();

		return (
			<div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl">
				<svg
					width={width}
					height={height}
					onPointerDown={handlePointerStart}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerEnd}
					className="cursor-crosshair select-none"
					style={{ touchAction: "none" }}
				>
					<defs>
						<pattern
							id="grid"
							width="40"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 40 0 L 0 0 0 20"
								fill="none"
								stroke="rgba(255, 255, 255, 0.1)"
								strokeWidth="0.5"
							/>
						</pattern>
						<linearGradient
							id="chartGradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop
								offset="0%"
								style={{ stopColor: "#1E3A8A", stopOpacity: 0.1 }}
							/>
							<stop
								offset="100%"
								style={{ stopColor: "#7C3AED", stopOpacity: 0.1 }}
							/>
						</linearGradient>
					</defs>
					<rect width={width} height={height} fill="url(#chartGradient)" />
					<rect width={width} height={height} fill="url(#grid)" />

					{[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
						const price = paddedMin + paddedRange * (1 - ratio);
						const y = topMargin + ratio * priceHeight;
						return (
							<g key={`price-${ratio}`}>
								<line
									x1={leftMargin}
									y1={y}
									x2={width - rightMargin}
									y2={y}
									stroke="rgba(255, 255, 255, 0.15)"
									strokeWidth="0.5"
								/>
								<text
									x={leftMargin - 6}
									y={y + 3}
									fontSize={screenSize === "sm" ? "9" : "10"}
									textAnchor="end"
									fill={colors.gray[300]}
									fontFamily="ui-monospace, monospace"
									fontWeight="500"
								>
									${price.toFixed(screenSize === "sm" ? 0 : 2)}
								</text>
							</g>
						);
					})}

					{filteredData.map((d, i) => {
						if (i % labelSpacing !== 0) return null;
						const x = indexToX(i) + calculatedCandleWidth / 2;
						if (x < leftMargin || x > width - rightMargin) return null;

						return (
							<g key={`date-${i}`}>
								<line
									x1={x}
									y1={topMargin + priceHeight}
									x2={x}
									y2={height - bottomMargin}
									stroke="rgba(255, 255, 255, 0.15)"
									strokeWidth="0.5"
								/>
								<text
									x={x}
									y={height - bottomMargin + 14}
									fontSize={screenSize === "sm" ? "8" : "9"}
									textAnchor="middle"
									fill={colors.gray[400]}
									fontFamily="ui-sans, sans-serif"
									fontWeight="500"
								>
									{formatDateForTimeframe(d.date)}
								</text>
							</g>
						);
					})}

					{filteredData.map((candle, i) => {
						const x = indexToX(i);
						if (
							x + calculatedCandleWidth < leftMargin ||
							x > width - rightMargin
						)
							return null;

						const openY = priceToY(candle.open);
						const closeY = priceToY(candle.close);
						const highY = priceToY(candle.high);
						const lowY = priceToY(candle.low);
						const isGreen = candle.close >= candle.open;

						return (
							<g key={`candle-${i}`}>
								<line
									x1={x + calculatedCandleWidth / 2}
									y1={highY}
									x2={x + calculatedCandleWidth / 2}
									y2={lowY}
									stroke={isGreen ? colors.success[400] : colors.danger[400]}
									strokeWidth={Math.max(1, calculatedCandleWidth * 0.1)}
									filter="drop-shadow(0 0 2px rgba(0,0,0,0.3))"
								/>

								<rect
									x={x}
									y={isGreen ? closeY : openY}
									width={calculatedCandleWidth}
									height={Math.max(1, Math.abs(closeY - openY))}
									fill={
										isGreen
											? `url(#greenGradient-${i})`
											: `url(#redGradient-${i})`
									}
									stroke={isGreen ? colors.success[600] : colors.danger[600]}
									strokeWidth="0.5"
									filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
								/>

								<defs>
									<linearGradient
										id={`greenGradient-${i}`}
										x1="0%"
										y1="0%"
										x2="0%"
										y2="100%"
									>
										<stop
											offset="0%"
											style={{ stopColor: colors.success[300] }}
										/>
										<stop
											offset="100%"
											style={{ stopColor: colors.success[500] }}
										/>
									</linearGradient>
									<linearGradient
										id={`redGradient-${i}`}
										x1="0%"
										y1="0%"
										x2="0%"
										y2="100%"
									>
										<stop
											offset="0%"
											style={{ stopColor: colors.danger[300] }}
										/>
										<stop
											offset="100%"
											style={{ stopColor: colors.danger[500] }}
										/>
									</linearGradient>
								</defs>

								{showVolumeOverlay && (
									<rect
										x={x}
										y={topMargin + priceHeight}
										width={calculatedCandleWidth}
										height={volumeToHeight(candle.volume)}
										fill={isGreen ? colors.success[500] : colors.danger[500]}
										opacity="0.4"
									/>
								)}
							</g>
						);
					})}

					{trendLines.map((line) => (
						<line
							key={line.id}
							x1={line.start.x}
							y1={line.start.y}
							x2={line.end.x}
							y2={line.end.y}
							stroke={colors.primary[400]}
							strokeWidth="2"
							strokeDasharray="8,4"
							opacity="0.9"
							filter="drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))"
						/>
					))}

					{currentDrawing && (
						<line
							x1={currentDrawing.start.x}
							y1={currentDrawing.start.y}
							x2={currentDrawing.end.x}
							y2={currentDrawing.end.y}
							stroke={colors.purple[400]}
							strokeWidth="2"
							strokeDasharray="8,4"
							opacity="0.8"
							filter="drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))"
						/>
					)}
				</svg>

				{totalContentWidth > availableWidth && (
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent backdrop-blur-sm p-2">
						<input
							type="range"
							min="0"
							max={maxScrollOffset}
							value={scrollOffset}
							onChange={(e) => setScrollOffset(Number(e.target.value))}
							className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer enhanced-slider"
						/>
					</div>
				)}
			</div>
		);
	};

	const neumorphicStyle = {
		background: `linear-gradient(145deg, #f0f1f8, #e1e2e9)`,
		borderRadius: "24px",
		boxShadow: `
			-12px -12px 24px rgba(255, 255, 255, 0.8),
			12px 12px 24px rgba(163, 177, 198, 0.4),
			inset 0 0 0 1px rgba(255, 255, 255, 0.2)
		`,
	};

	const neumorphicInset = {
		background: `linear-gradient(145deg, #e1e2e9, #f0f1f8)`,
		borderRadius: "20px",
		boxShadow: `
			inset -6px -6px 12px rgba(255, 255, 255, 0.8),
			inset 6px 6px 12px rgba(163, 177, 198, 0.4)
		`,
	};

	const neumorphicButton = (active: boolean = false) => ({
		background: active
			? `linear-gradient(145deg, #d1d2d9, #f0f1f8)`
			: `linear-gradient(145deg, #f0f1f8, #d1d2d9)`,
		borderRadius: "18px",
		boxShadow: active
			? `inset -6px -6px 12px rgba(255, 255, 255, 0.8),
				 inset 6px 6px 12px rgba(163, 177, 198, 0.4)`
			: `-6px -6px 12px rgba(255, 255, 255, 0.8),
				 6px 6px 12px rgba(163, 177, 198, 0.4)`,
		border: "none",
		transition: "all 0.2s ease-in-out",
	});

	const formatNumber = (num: number): string => {
		if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
		if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
		if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
		if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
		return num.toFixed(2);
	};

	const handleSymbolChange = (symbol: string) => {
		setSelectedSymbol(symbol);
		setTrendLines([]);
		setCurrentDrawing(null);
		setScrollOffset(0);
	};

	const toggleDrawingMode = () => {
		setDrawingMode(!drawingMode);
		setCurrentDrawing(null);
		addToast(drawingMode ? "Drawing disabled" : "Drawing enabled", "info");
	};

	const clearTrendLines = () => {
		setTrendLines([]);
		setCurrentDrawing(null);
		addToast("Trend lines cleared", "success");
	};

	const showPatternDemo = (pattern: TechnicalPattern) => {
		setDetectedPattern(pattern);
		addToast(`Showing ${pattern.name} pattern`, "info");
	};

	const renderProfessionalFooter = () => (
		<footer className="mt-8 pb-6">
			<div style={neumorphicStyle} className="p-6 mb-4">
				<div
					className={`grid ${
						screenSize === "sm" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
					} gap-6`}
				>
					<div className={screenSize === "sm" ? "col-span-1" : "md:col-span-1"}>
						<h4 className="font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							StockChart Pro
						</h4>
						<p className="text-sm text-gray-600 mb-3">
							Professional trading platform providing real-time market data and
							advanced charting tools.
						</p>
						<div className="flex space-x-3">
							{["🐦", "💼", "💬"].map((icon, idx) => (
								<button
									key={idx}
									style={neumorphicButton()}
									className="p-2 text-gray-600 hover:text-blue-600 transition-colors text-lg"
									onClick={() => addToast(`Social media ${idx + 1}`, "info")}
								>
									{icon}
								</button>
							))}
						</div>
					</div>

					{screenSize !== "sm" && (
						<>
							<div>
								<h4 className="font-semibold text-gray-800 mb-3">Platform</h4>
								<ul className="space-y-2">
									{[
										"Live Trading",
										"Market Analysis",
										"Portfolio Manager",
										"Price Alerts",
									].map((link, index) => (
										<li key={index}>
											<button
												onClick={() =>
													addToast(`${link} - Coming Soon`, "info")
												}
												className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
											>
												{link}
											</button>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="font-semibold text-gray-800 mb-3">Support</h4>
								<ul className="space-y-2">
									{[
										"Help Center",
										"Trading Guide",
										"Contact Us",
										"System Status",
									].map((link, index) => (
										<li key={index}>
											<button
												onClick={() =>
													addToast(`${link} - Coming Soon`, "info")
												}
												className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
											>
												{link}
											</button>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="font-semibold text-gray-800 mb-3">Legal</h4>
								<ul className="space-y-2">
									{[
										"Privacy Policy",
										"Terms of Service",
										"Risk Disclosure",
										"Regulatory Info",
									].map((link, index) => (
										<li key={index}>
											<button
												onClick={() =>
													addToast(`${link} - Coming Soon`, "info")
												}
												className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
											>
												{link}
											</button>
										</li>
									))}
								</ul>
							</div>
						</>
					)}
				</div>
			</div>

			<div style={neumorphicInset} className="p-4 mb-4">
				<div className="flex items-start space-x-3">
					<div className="text-yellow-500 text-xl">⚠️</div>
					<div>
						<h5 className="font-semibold text-gray-800 mb-1">Risk Warning</h5>
						<p
							className={`${
								screenSize === "sm" ? "text-xs" : "text-sm"
							} text-gray-600 leading-relaxed`}
						>
							Trading involves substantial risk. Past performance doesn't
							guarantee future results.
							{screenSize !== "sm" &&
								" Please consult with a qualified financial advisor before making investment decisions."}
						</p>
					</div>
				</div>
			</div>

			<div style={neumorphicInset} className="p-4">
				<div
					className={`flex ${
						screenSize === "sm"
							? "flex-col space-y-2"
							: "flex-row justify-between items-center"
					}`}
				>
					<div className={screenSize === "sm" ? "text-center" : "text-left"}>
						<p className="text-xs text-gray-600">
							© 2025 StockChart Pro. All rights reserved.
						</p>
					</div>

					<div
						className={`flex items-center ${
							screenSize === "sm" ? "justify-center space-x-2" : "space-x-4"
						} text-xs text-gray-500`}
					>
						<span>🔒 Secure</span>
						<span>📱 Mobile</span>
						{screenSize !== "sm" && (
							<>
								<span>⚡ Real-time</span>
								<span>🌐 Global</span>
							</>
						)}
					</div>
				</div>
			</div>
		</footer>
	);

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-blue-50"
			style={{ backgroundColor: "#e6e7ee" }}
		>
			<header className="p-4" style={neumorphicStyle}>
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
							StockChart Pro
						</h1>
						<p className="text-sm text-gray-600">
							Professional Trading Platform
						</p>
					</div>
					<div className="flex items-center space-x-3">
						<button
							style={neumorphicButton()}
							className="p-3 text-gray-700 hover:text-blue-600 transition-colors"
							onClick={() => addToast("Notifications - Coming Soon", "info")}
						>
							🔔
						</button>
						<button
							style={neumorphicButton()}
							className="p-3 text-gray-700 hover:text-blue-600 transition-colors"
							onClick={() => addToast("Settings - Coming Soon", "info")}
						>
							⚙️
						</button>
					</div>
				</div>

				<div
					className={`grid ${
						screenSize === "sm" ? "grid-cols-2" : "grid-cols-4"
					} gap-2`}
				>
					{stockSymbols.slice(0, screenSize === "sm" ? 4 : 8).map((stock) => (
						<button
							key={stock.symbol}
							onClick={() => handleSymbolChange(stock.symbol)}
							style={neumorphicButton(selectedSymbol === stock.symbol)}
							className={`p-3 text-center transition-all ${
								selectedSymbol === stock.symbol
									? "text-blue-600"
									: "text-gray-700"
							}`}
						>
							<div className="font-semibold text-sm">{stock.symbol}</div>
							<div className="text-xs opacity-70">${stock.basePrice}</div>
						</button>
					))}
				</div>
			</header>

			<main className="p-4 space-y-6">
				<div style={neumorphicStyle} className="p-6">
					{stockData && (
						<>
							<div className="flex items-center justify-between mb-4">
								<div>
									<h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
										{stockData.symbol}
									</h2>
									<p className="text-gray-600">{stockData.name}</p>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold text-gray-800">
										${stockData.currentPrice.toFixed(2)}
									</div>
									<div
										className={`text-sm font-semibold ${
											stockData.change >= 0 ? "text-green-600" : "text-red-600"
										}`}
									>
										{stockData.change >= 0 ? "+" : ""}$
										{stockData.change.toFixed(2)} (
										{stockData.changePercent.toFixed(2)}%)
									</div>
								</div>
							</div>

							<div
								className={`grid ${
									screenSize === "sm" ? "grid-cols-1" : "grid-cols-2"
								} gap-4`}
							>
								<div style={neumorphicInset} className="p-4 text-center">
									<div className="text-xs text-gray-500 mb-1">Market Cap</div>
									<div className="font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
										${formatNumber(stockData.marketCap)}
									</div>
								</div>
								<div style={neumorphicInset} className="p-4 text-center">
									<div className="text-xs text-gray-500 mb-1">Volume</div>
									<div className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
										{formatNumber(stockData.volume24h)}
									</div>
								</div>
							</div>
						</>
					)}
				</div>

				<div style={neumorphicStyle} className="p-4">
					<div className="flex space-x-2">
						{(["1d", "1w", "1m", "3m", "1y"] as const).map((frame) => (
							<button
								key={frame}
								onClick={() => setTimeFrame(frame)}
								style={neumorphicButton(timeFrame === frame)}
								className={`flex-1 py-3 text-sm font-semibold transition-all ${
									timeFrame === frame ? "text-blue-500" : "text-gray-700"
								}`}
							>
								{frame.toUpperCase()}
							</button>
						))}
					</div>
				</div>

				<div style={neumorphicStyle} className="p-4">
					<div className="flex flex-wrap gap-3">
						<button
							onClick={toggleDrawingMode}
							style={neumorphicButton(drawingMode)}
							className={`flex items-center justify-center p-3 transition-all ${
								drawingMode ? "text-blue-600" : "text-gray-700"
							}`}
						>
							<span className="text-lg mr-2">📏</span>
							<span className="text-sm font-medium">Draw</span>
						</button>

						<button
							onClick={clearTrendLines}
							style={neumorphicButton()}
							className="flex items-center justify-center p-3 text-gray-700 transition-all"
						>
							<span className="text-lg mr-2">🗑️</span>
							<span className="text-sm font-medium">Clear</span>
						</button>

						<button
							onClick={() => setShowVolumeOverlay(!showVolumeOverlay)}
							style={neumorphicButton(showVolumeOverlay)}
							className={`flex items-center justify-center p-3 transition-all ${
								showVolumeOverlay ? "text-green-600" : "text-gray-700"
							}`}
						>
							<span className="text-lg mr-2">📊</span>
							<span className="text-sm font-medium">Volume</span>
						</button>
					</div>
				</div>

				<div style={neumorphicStyle} className="p-4">
					<div
						ref={chartRef}
						className={`${screenSize === "sm" ? "h-80" : "h-96"} relative`}
					>
						{renderProfessionalChart()}
					</div>
					<div className="mt-4 text-center">
						<p
							className={`${
								screenSize === "sm" ? "text-xs" : "text-sm"
							} text-gray-600`}
						>
							💡 <strong>Tip:</strong>{" "}
							{screenSize === "sm"
								? "Touch to draw • Tap for patterns"
								: "Touch and drag to draw trend lines • Tap to identify patterns • Scroll horizontally on mobile"}
						</p>
					</div>
				</div>

				<div style={neumorphicStyle} className="p-4">
					<h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-4">
						📚 Pattern Recognition
					</h3>
					<div
						className={`grid ${
							screenSize === "sm" ? "grid-cols-1" : "grid-cols-2"
						} gap-3`}
					>
						{technicalPatterns.map((pattern, index) => (
							<button
								key={index}
								onClick={() => showPatternDemo(pattern)}
								style={neumorphicButton()}
								className="p-4 text-left transition-all hover:scale-105"
							>
								<div className="font-semibold text-gray-800 text-sm mb-1">
									{pattern.name}
								</div>
								<div
									className={`text-xs px-2 py-1 rounded-full inline-block ${
										pattern.bullishBearish === "bullish"
											? "bg-green-100 text-green-700"
											: pattern.bullishBearish === "bearish"
											? "bg-red-100 text-red-700"
											: "bg-gray-100 text-gray-700"
									}`}
								>
									{pattern.bullishBearish}
								</div>
							</button>
						))}
					</div>
				</div>

				<div
					className={`grid ${
						screenSize === "sm" ? "grid-cols-1" : "grid-cols-2"
					} gap-4`}
				>
					<div style={neumorphicStyle} className="p-6 text-center">
						<div className="text-3xl mb-3">⭐</div>
						<h4 className="font-semibold text-gray-800 mb-2">
							Add to Watchlist
						</h4>
						<p className="text-sm text-gray-600 mb-4">
							Track this stock in your portfolio
						</p>
						<button
							style={neumorphicButton()}
							className="w-full py-2 text-sm font-medium text-gray-700"
							onClick={() => addToast("Added to watchlist", "success")}
						>
							Add Stock
						</button>
					</div>

					<div style={neumorphicStyle} className="p-6 text-center">
						<div className="text-3xl mb-3">🚨</div>
						<h4 className="font-semibold text-gray-800 mb-2">
							Set Price Alert
						</h4>
						<p className="text-sm text-gray-600 mb-4">
							Get notified of price changes
						</p>
						<button
							style={neumorphicButton()}
							className="w-full py-2 text-sm font-medium text-gray-700"
							onClick={() => addToast("Price alert set", "success")}
						>
							Create Alert
						</button>
					</div>
				</div>

				{renderProfessionalFooter()}
			</main>

			{detectedPattern && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div
						style={neumorphicStyle}
						className="max-w-md w-full max-h-screen overflow-y-auto p-6"
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
								{detectedPattern.name}
							</h3>
							<div
								className={`px-3 py-1 rounded-full text-xs font-medium ${
									detectedPattern.bullishBearish === "bullish"
										? "bg-green-100 text-green-700"
										: detectedPattern.bullishBearish === "bearish"
										? "bg-red-100 text-red-700"
										: "bg-gray-100 text-gray-700"
								}`}
							>
								{detectedPattern.bullishBearish}
							</div>
						</div>

						<p className="text-gray-700 mb-4">{detectedPattern.description}</p>

						<div style={neumorphicInset} className="p-4 mb-4">
							<h4 className="font-semibold text-gray-800 mb-2">
								📖 Educational Content:
							</h4>
							<p className="text-sm text-gray-600 leading-relaxed">
								{detectedPattern.educationalContent}
							</p>
						</div>

						<div className="mb-4">
							<h4 className="font-semibold text-gray-800 mb-2">
								🔍 Identification Points:
							</h4>
							<ul className="space-y-2">
								{detectedPattern.identificationPoints.map((point, i) => (
									<li
										key={i}
										className="flex items-start space-x-2 text-sm text-gray-600"
									>
										<span className="text-blue-500 mt-1">•</span>
										<span>{point}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="flex items-center justify-between mb-6">
							<div className="text-sm text-gray-600">
								Reliability:{" "}
								<span
									className={`font-semibold ${
										detectedPattern.reliability === "high"
											? "text-green-600"
											: detectedPattern.reliability === "medium"
											? "text-yellow-600"
											: "text-red-600"
									}`}
								>
									{detectedPattern.reliability}
								</span>
							</div>
						</div>

						<button
							onClick={() => setDetectedPattern(null)}
							style={neumorphicButton()}
							className="w-full py-3 font-semibold text-gray-800 transition-all"
						>
							Got it!
						</button>
					</div>
				</div>
			)}

			<div className="fixed top-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						style={{
							...neumorphicStyle,
							transform: "translateX(0)",
							animation: "slideIn 0.3s ease-out",
						}}
						className={`px-4 py-3 text-sm font-medium max-w-xs ${
							toast.type === "success"
								? "text-green-700"
								: toast.type === "error"
								? "text-red-700"
								: toast.type === "warning"
								? "text-yellow-700"
								: "text-blue-700"
						}`}
					>
						<div className="flex items-center space-x-2">
							<span className="text-lg">
								{toast.type === "success"
									? "✅"
									: toast.type === "error"
									? "❌"
									: toast.type === "warning"
									? "⚠️"
									: "ℹ️"}
							</span>
							<span>{toast.message}</span>
						</div>
					</div>
				))}
			</div>

			<style jsx>{`
				@keyframes slideIn {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}

				.enhanced-slider {
					-webkit-appearance: none;
					appearance: none;
					background: linear-gradient(
						to right,
						${colors.primary[500]} 0%,
						${colors.primary[500]} var(--thumb-position, 0%),
						${colors.gray[600]} var(--thumb-position, 0%),
						${colors.gray[600]} 100%
					);
					cursor: pointer;
					border-radius: 8px;
				}

				.enhanced-slider::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					height: 20px;
					width: 20px;
					border-radius: 50%;
					background: linear-gradient(
						145deg,
						${colors.primary[400]},
						${colors.primary[600]}
					);
					box-shadow: -4px -4px 8px rgba(255, 255, 255, 0.8),
						4px 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 2px ${colors.primary[300]};
					cursor: pointer;
					transition: all 0.2s ease;
				}

				.enhanced-slider::-webkit-slider-thumb:hover {
					transform: scale(1.1);
					box-shadow: -6px -6px 12px rgba(255, 255, 255, 0.9),
						6px 6px 12px rgba(0, 0, 0, 0.3), 0 0 0 3px ${colors.primary[400]},
						0 0 20px rgba(59, 130, 246, 0.3);
				}

				.enhanced-slider::-moz-range-thumb {
					height: 20px;
					width: 20px;
					border-radius: 50%;
					background: linear-gradient(
						145deg,
						${colors.primary[400]},
						${colors.primary[600]}
					);
					box-shadow: -4px -4px 8px rgba(255, 255, 255, 0.8),
						4px 4px 8px rgba(0, 0, 0, 0.2);
					cursor: pointer;
					border: 2px solid ${colors.primary[300]};
					transition: all 0.2s ease;
				}

				.enhanced-slider::-moz-range-thumb:hover {
					transform: scale(1.1);
					box-shadow: -6px -6px 12px rgba(255, 255, 255, 0.9),
						6px 6px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.3);
				}

				@media (max-width: 320px) {
					.text-3xl {
						font-size: 1.5rem;
					}
					.text-2xl {
						font-size: 1.25rem;
					}
					.text-lg {
						font-size: 1rem;
					}
				}
			`}</style>
		</div>
	);
};

export default ProfessionalStockChart;
