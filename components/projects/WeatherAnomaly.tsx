"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Brush,
	ReferenceLine,
	Cell,
} from "recharts";
import {
	MdDownload,
	MdLightbulb,
	MdOutlineWaterDrop,
	MdTimeToLeave,
} from "react-icons/md";
import {
	IoTrendingUp,
	IoTrendingDown,
	IoDownload,
	IoCalendarClear,
	IoInformationCircle,
} from "react-icons/io5";
import {
	FaCalendarAlt,
	FaThermometerHalf,
	FaChartBar,
	FaFilter,
	FaGripLines,
	FaHandPointer,
} from "react-icons/fa";
import { BsCalendarRange, BsArrowsExpand, BsHandIndex } from "react-icons/bs";

interface WeatherDataPoint {
	date: string;
	city: string;
	temperature: number;
	historicalAvg: number;
	anomaly: number;
	month: number;
	year: number;
	season: "Spring" | "Summer" | "Fall" | "Winter";
	timestamp: number;
}

interface ProcessedDataPoint extends WeatherDataPoint {
	index: number;
	formattedDate: string;
	monthYear: string;
	color?: string;
	trendIntensity?: number;
}

interface RangeStats {
	count: number;
	avgTemp: number;
	minTemp: number;
	maxTemp: number;
	avgAnomaly: number;
	startDate: string;
	endDate: string;
	seasonalBreakdown: Record<string, number>;
}

interface BrushRange {
	startIndex?: number;
	endIndex?: number;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: ProcessedDataPoint;
		value: number;
		dataKey: string;
	}>;
	label?: string;
}

interface AppState {
	data: WeatherDataPoint[];
	selectedCity: string;
	chartType: "line" | "bar";
	selectedRange: BrushRange | null;
	brushRange: BrushRange | null;
	viewMode: "temperature" | "anomaly" | "seasonal" | "multi-city";
	isExporting: boolean;
	exportStatus: string;
	downloadCount: number;
	isLoading: boolean;
	isBrushTouched: boolean;
}

const COLOR_PALETTES = {
	diverging: [
		"#b71c1c",
		"#e53935",
		"#f44336",
		"#ff8a80",
		"#ffebee",
		"#e3f2fd",
		"#90caf9",
		"#2196f3",
		"#1565c0",
		"#0d47a1",
	],

	sequential: [
		"#e3f2fd",
		"#bbdefb",
		"#90caf9",
		"#64b5f6",
		"#42a5f5",
		"#2196f3",
		"#1e88e5",
		"#1976d2",
		"#1565c0",
		"#0d47a1",
	],

	categorical: [
		"#1565c0",
		"#0277bd",
		"#01579b",
		"#006064",
		"#004d40",
		"#2e7d32",
		"#558b2f",
		"#f57f17",
	],

	seasonal: {
		Spring: "#66bb6a",
		Summer: "#ffb74d",
		Fall: "#f57c00",
		Winter: "#42a5f5",
	},
};

const generateWeatherData = (): WeatherDataPoint[] => {
	const cities = ["New York", "London", "Tokyo", "Sydney"];
	const data: WeatherDataPoint[] = [];
	const startYear = 2020;
	const endYear = 2024;

	for (let year = startYear; year <= endYear; year++) {
		for (let month = 1; month <= 12; month++) {
			const daysInMonth = new Date(year, month, 0).getDate();
			for (let day = 1; day <= daysInMonth; day++) {
				const date = new Date(year, month - 1, day);
				const dayOfYear = Math.floor(
					(date.getTime() - new Date(year, 0, 0).getTime()) /
						(1000 * 60 * 60 * 24)
				);

				cities.forEach((city) => {
					const baseTemp =
						20 + 15 * Math.sin(((dayOfYear - 80) * 2 * Math.PI) / 365);

					const cityAdjustments: Record<string, number> = {
						"New York": 0,
						London: -5,
						Tokyo: 5,
						Sydney: 10 - 20 * Math.sin(((dayOfYear - 80) * 2 * Math.PI) / 365),
					};

					const randomVariation = (Math.random() - 0.5) * 10;
					const anomalyChance = Math.random();
					const anomaly = anomalyChance < 0.05 ? (Math.random() - 0.5) * 30 : 0;

					const temperature =
						Math.round(
							(baseTemp + cityAdjustments[city] + randomVariation + anomaly) *
								10
						) / 10;

					const historicalAvg = baseTemp + cityAdjustments[city];
					const anomalyValue = temperature - historicalAvg;

					const season: "Spring" | "Summer" | "Fall" | "Winter" =
						month >= 3 && month <= 5
							? "Spring"
							: month >= 6 && month <= 8
							? "Summer"
							: month >= 9 && month <= 11
							? "Fall"
							: "Winter";

					data.push({
						date: date.toISOString().split("T")[0],
						city,
						temperature,
						historicalAvg: Math.round(historicalAvg * 10) / 10,
						anomaly: Math.round(anomalyValue * 10) / 10,
						month: month,
						year: year,
						season,
						timestamp: date.getTime(),
					});
				});
			}
		}
	}

	return data.sort((a, b) => a.timestamp - b.timestamp);
};

const CustomBrush = (props: any) => {
	return (
		<g>
			<Brush {...props} />
			<text
				x={props.x + props.width / 2}
				y={props.y + props.height + 15}
				textAnchor="middle"
				fontSize="10"
				fill="#666"
			>
				Drag handles to select date range
			</text>
			<BsHandIndex
				x={props.x + props.width - 30}
				y={props.y - 15}
				fontSize="14"
				fill="#1976d2"
			/>
		</g>
	);
};

const WeatherAnomalyTool: React.FC = () => {
	const [state, setState] = useState<AppState>({
		data: [],
		selectedCity: "New York",
		chartType: "line",
		selectedRange: null,
		brushRange: null,
		viewMode: "temperature",
		isExporting: false,
		exportStatus: "",
		downloadCount: 0,
		isLoading: true,
		isBrushTouched: false,
	});

	const cities = ["New York", "London", "Tokyo", "Sydney"];

	useEffect(() => {
		const initializeData = async () => {
			setState((prev) => ({ ...prev, isLoading: true }));

			await new Promise((resolve) => setTimeout(resolve, 800));

			const weatherData = generateWeatherData();

			setState((prev) => ({
				...prev,
				data: weatherData,
				isLoading: false,
			}));
		};

		initializeData();
	}, []);

	useEffect(() => {
		if (!state.isLoading && !state.isBrushTouched) {
			const timer = setTimeout(() => {
				const brushTooltip = document.getElementById("brush-tooltip");
				if (brushTooltip) {
					brushTooltip.style.opacity = "1";

					setTimeout(() => {
						if (brushTooltip) {
							brushTooltip.style.opacity = "0";
						}
					}, 5000);
				}
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [state.isLoading, state.isBrushTouched]);

	const getAnomalyColor = (anomaly: number): string => {
		const absAnomaly = Math.abs(anomaly);
		let colorIndex: number;

		if (absAnomaly < 1) colorIndex = 4;
		else if (absAnomaly < 3) colorIndex = anomaly > 0 ? 3 : 5;
		else if (absAnomaly < 6) colorIndex = anomaly > 0 ? 2 : 6;
		else if (absAnomaly < 10) colorIndex = anomaly > 0 ? 1 : 7;
		else colorIndex = anomaly > 0 ? 0 : 8;

		return COLOR_PALETTES.diverging[colorIndex];
	};

	const getTrendColor = (intensity: number): string => {
		const index = Math.min(
			Math.floor(intensity * COLOR_PALETTES.sequential.length),
			COLOR_PALETTES.sequential.length - 1
		);
		return COLOR_PALETTES.sequential[index];
	};

	const getCityColor = (city: string): string => {
		const cityIndex = cities.indexOf(city);
		return (
			COLOR_PALETTES.categorical[cityIndex] || COLOR_PALETTES.categorical[0]
		);
	};

	const getSeasonColor = (season: string): string => {
		return (
			COLOR_PALETTES.seasonal[season as keyof typeof COLOR_PALETTES.seasonal] ||
			"#9e9e9e"
		);
	};

	const processedData = useMemo((): ProcessedDataPoint[] => {
		if (state.isLoading || state.data.length === 0) {
			return [];
		}

		const rawData =
			state.viewMode === "multi-city"
				? state.data
				: state.data.filter((d) => d.city === state.selectedCity);

		return rawData.map((d, index) => {
			const tempRange =
				Math.max(...state.data.map((p) => p.temperature)) -
				Math.min(...state.data.map((p) => p.temperature));
			const trendIntensity =
				Math.abs(d.temperature - d.historicalAvg) / (tempRange * 0.5);

			return {
				...d,
				index,
				formattedDate: new Date(d.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				monthYear: new Date(d.date).toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				}),
				color:
					state.viewMode === "anomaly"
						? getAnomalyColor(d.anomaly)
						: state.viewMode === "seasonal"
						? getSeasonColor(d.season)
						: state.viewMode === "multi-city"
						? getCityColor(d.city)
						: COLOR_PALETTES.categorical[0],
				trendIntensity: Math.min(trendIntensity, 1),
			};
		});
	}, [state.data, state.selectedCity, state.viewMode, state.isLoading]);

	const multiCityData = useMemo(() => {
		if (state.viewMode !== "multi-city") return [];

		const cityData: Record<string, ProcessedDataPoint[]> = {};

		cities.forEach((city) => {
			cityData[city] = processedData.filter((d) => d.city === city);
		});

		return cityData;
	}, [processedData, state.viewMode]);

	const exportChart = async (): Promise<void> => {
		if (state.isExporting) return;

		setState((prev) => ({
			...prev,
			isExporting: true,
			exportStatus: "Preparing export...",
			downloadCount: prev.downloadCount + 1,
		}));

		try {
			await new Promise((resolve) => setTimeout(resolve, 300));

			const svgElement = document.querySelector(
				".recharts-wrapper svg"
			) as SVGElement;
			if (!svgElement) {
				throw new Error("Chart not found");
			}

			setState((prev) => ({ ...prev, exportStatus: "Processing chart..." }));

			const clonedSvg = svgElement.cloneNode(true) as SVGElement;
			const rect = svgElement.getBoundingClientRect();
			const width = rect.width || 800;
			const height = rect.height || 600;

			clonedSvg.setAttribute("width", width.toString());
			clonedSvg.setAttribute("height", height.toString());
			clonedSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

			const bgRect = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"rect"
			);
			bgRect.setAttribute("width", "100%");
			bgRect.setAttribute("height", "100%");
			bgRect.setAttribute("fill", "white");
			clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

			clonedSvg.removeAttribute("aria-labelledby");
			clonedSvg.removeAttribute("aria-describedby");

			setState((prev) => ({ ...prev, exportStatus: "Generating file..." }));

			const serializer = new XMLSerializer();
			let svgString = serializer.serializeToString(clonedSvg);
			svgString = svgString.replace(/&nbsp;/g, " ");
			svgString = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-
${svgString}`;

			const timestamp = new Date()
				.toISOString()
				.slice(0, 19)
				.replace(/:/g, "-");
			const filename = `weather-${state.selectedCity
				.toLowerCase()
				.replace(/\s+/g, "-")}-${state.viewMode}-${timestamp}-${
				state.downloadCount
			}.svg`;

			const isMobile =
				/Android|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
					navigator.userAgent
				) ||
				(navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
			const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

			setState((prev) => ({ ...prev, exportStatus: "Initiating download..." }));

			const blob = new Blob([svgString], {
				type: "image/svg+xml;charset=utf-8",
			});

			if (isMobile) {
				if (isIOS) {
					try {
						const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
							svgString
						)}`;
						const a = document.createElement("a");
						a.href = dataUrl;
						a.download = filename;
						a.style.position = "fixed";
						a.style.left = "-9999px";
						a.style.visibility = "hidden";
						document.body.appendChild(a);

						const clickEvent = new MouseEvent("click", {
							bubbles: true,
							cancelable: true,
							view: window,
						});
						a.dispatchEvent(clickEvent);

						setTimeout(() => {
							if (document.body.contains(a)) {
								document.body.removeChild(a);
							}
						}, 100);

						setState((prev) => ({
							...prev,
							exportStatus: "Download started!",
						}));
					} catch (e) {
						const newWindow = window.open("", "_blank");
						if (newWindow) {
							newWindow.document.write(`
                <html>
                  <head>
                    <title>Weather Chart - Save Image</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                  </head>
                  <body style="margin:0;padding:20px;font-family:'Inter', system-ui, -apple-system, sans-serif;">
                    <h3>Long press the chart below and select "Save Image" or "Save to Photos"</h3>
                    <div style="border:1px solid #ccc;padding:10px;margin:10px 0;">
                      ${svgString}
                    </div>
                    <p><small>Filename: ${filename}</small></p>
                  </body>
                </html>
              `);
							newWindow.document.close();
							setState((prev) => ({
								...prev,
								exportStatus:
									"Opened in new window - long press chart to save!",
							}));
						} else {
							throw new Error("Please allow popups to export");
						}
					}
				} else {
					try {
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = filename;
						a.style.position = "fixed";
						a.style.left = "-9999px";
						a.style.top = "-9999px";
						a.style.opacity = "0";
						a.style.visibility = "hidden";

						document.body.appendChild(a);

						setTimeout(() => {
							a.focus();
							const clickEvent = new MouseEvent("click", {
								bubbles: true,
								cancelable: true,
								view: window,
							});
							a.dispatchEvent(clickEvent);

							setTimeout(() => {
								if (document.body.contains(a)) {
									document.body.removeChild(a);
								}
								URL.revokeObjectURL(url);
							}, 1000);
						}, 100);

						setState((prev) => ({
							...prev,
							exportStatus: "Download started!",
						}));
					} catch (e) {
						const url = URL.createObjectURL(blob);
						const newWindow = window.open("", "_blank");
						if (newWindow) {
							newWindow.document.write(`
                <html>
                  <head>
                    <title>Weather Chart Export</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                  </head>
                  <body style="margin:0;padding:20px;font-family:'Inter', system-ui, -apple-system, sans-serif;background:#f5f5f5;">
                    <div style="max-width:800px;margin:0 auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                      <h2 style="color:#333;margin-top:0;">Weather Chart Export</h2>
                      <p style="color:#666;margin-bottom:20px;">Your chart is ready! Use the download button or browser menu to save:</p>
                      <div style="border:2px solid #ddd;padding:15px;margin:15px 0;border-radius:8px;background:#fafafa;">
                        <div style="margin-bottom:10px;">
                          <a href="${url}" download="${filename}" style="display:inline-flex;align-items:center;gap:8px;background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;font-weight:bold;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                            </svg>
                            Download Chart
                          </a>
                        </div>
                        <div style="overflow:auto;">
                          ${svgString}
                        </div>
                      </div>
                      <p style="font-size:12px;color:#888;">Filename: ${filename}</p>
                      <p style="font-size:12px;color:#888;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="display:inline;margin-right:4px;">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17L12,11L14,13L15.4,11.6L12,8.2L8.6,11.6L10,13L12,11V17Z" />
                        </svg>
                        Tip: On mobile, use the download button above or long press the chart and select "Save Image".
                      </p>
                    </div>
                    <script>
                      setTimeout(() => {
                        URL.revokeObjectURL('${url}');
                      }, 30000);
                    </script>
                  </body>
                </html>
              `);
							newWindow.document.close();
							setState((prev) => ({
								...prev,
								exportStatus: "Opened in new tab - use download button!",
							}));
						} else {
							throw new Error("Please allow popups to export");
						}
					}
				}
			} else {
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = filename;
				a.style.display = "none";
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);

				setTimeout(() => URL.revokeObjectURL(url), 1000);
				setState((prev) => ({ ...prev, exportStatus: "Export successful!" }));
			}

			setTimeout(
				() => setState((prev) => ({ ...prev, exportStatus: "" })),
				3000
			);
		} catch (error) {
			console.error("Export failed:", error);
			setState((prev) => ({
				...prev,
				exportStatus: `Export failed: ${(error as Error).message}`,
			}));
			setTimeout(
				() => setState((prev) => ({ ...prev, exportStatus: "" })),
				4000
			);
		} finally {
			setState((prev) => ({ ...prev, isExporting: false }));
		}
	};

	const rangeStats = useMemo((): RangeStats | null => {
		if (!state.selectedRange || !state.brushRange) return null;

		const startIndex = state.brushRange.startIndex || 0;
		const endIndex = state.brushRange.endIndex || processedData.length - 1;
		const rangeData = processedData.slice(startIndex, endIndex + 1);

		if (rangeData.length === 0) return null;

		const temps = rangeData.map((d) => d.temperature);
		const anomalies = rangeData.map((d) => d.anomaly);

		return {
			count: rangeData.length,
			avgTemp:
				Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
			minTemp: Math.min(...temps),
			maxTemp: Math.max(...temps),
			avgAnomaly:
				Math.round(
					(anomalies.reduce((a, b) => a + b, 0) / anomalies.length) * 10
				) / 10,
			startDate: rangeData[0].date,
			endDate: rangeData[rangeData.length - 1].date,
			seasonalBreakdown: rangeData.reduce((acc, d) => {
				acc[d.season] = (acc[d.season] || 0) + 1;
				return acc;
			}, {} as Record<string, number>),
		};
	}, [state.selectedRange, state.brushRange, processedData]);

	const CustomTooltip: React.FC<CustomTooltipProps> = ({
		active,
		payload,
		label,
	}) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="custom-tooltip z-20 bg-white/95 backdrop-blur-sm text-gray-800 p-4 rounded-lg shadow-xl border border-gray-200"
					style={{
						boxShadow:
							"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
					}}
				>
					<p className="font-bold text-sm mb-2 border-b border-gray-100 pb-2">
						{new Date(data.date).toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<div className="space-y-2 text-sm">
						{state.viewMode === "multi-city" && (
							<p className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-full"
									style={{ backgroundColor: getCityColor(data.city) }}
								></div>
								<span className="font-medium">City:</span>{" "}
								<span>{data.city}</span>
							</p>
						)}
						<p className="flex items-center gap-2">
							<FaThermometerHalf className="w-3 h-3 text-orange-500" />
							<span className="font-medium">Temperature:</span>{" "}
							<span className="font-semibold">{data.temperature}°C</span>
						</p>
						<p className="flex items-center gap-2 pl-5">
							<span className="font-medium">Historical Avg:</span>{" "}
							<span>{data.historicalAvg}°C</span>
						</p>
						<p
							className={`flex items-center gap-2 ${
								data.anomaly >= 0 ? "text-red-600" : "text-blue-600"
							}`}
						>
							<IoTrendingUp
								className={`w-3 h-3 ${
									data.anomaly < 0 ? "transform rotate-180" : ""
								}`}
							/>
							<span className="font-medium">Anomaly:</span>{" "}
							<span className="font-semibold">
								{data.anomaly > 0 ? "+" : ""}
								{data.anomaly}°C
							</span>
						</p>
						<p className="flex items-center gap-2">
							<div
								className="w-3 h-3 rounded-full"
								style={{ backgroundColor: getSeasonColor(data.season) }}
							></div>
							<span className="font-medium">Season:</span>{" "}
							<span>{data.season}</span>
						</p>
						{state.viewMode === "seasonal" && (
							<p className="flex items-center gap-2">
								<span className="font-medium">Trend Intensity:</span>
								<span>{Math.round((data.trendIntensity || 0) * 100)}%</span>
							</p>
						)}
					</div>
				</motion.div>
			);
		}
		return null;
	};

	const chartData = useMemo(() => {
		if (state.viewMode === "multi-city") {
			return processedData;
		}
		return state.chartType === "bar"
			? processedData.filter((_, i) => i % 7 === 0)
			: processedData;
	}, [processedData, state.chartType, state.viewMode]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
			{state.isLoading ? (
				<div className="min-h-screen flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-12 text-center max-w-md mx-4"
						style={{
							boxShadow:
								"0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
						}}
					>
						<motion.div
							animate={{
								rotate: 360,
								scale: [1, 1.1, 1],
							}}
							transition={{
								rotate: { duration: 2, repeat: Infinity, ease: "linear" },
								scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
							}}
							className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
							style={{
								boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
							}}
						>
							<IoTrendingUp className="w-10 h-10 text-white" />
						</motion.div>

						<motion.h2
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
						>
							Weather Data Analysis
						</motion.h2>

						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-slate-600 mb-8 text-lg"
						>
							Generating comprehensive climate insights...
						</motion.p>

						<motion.div
							className="flex justify-center space-x-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							{[0, 1, 2, 3, 4].map((i) => (
								<motion.div
									key={i}
									className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
									animate={{
										scale: [1, 1.5, 1],
										opacity: [0.5, 1, 0.5],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										delay: i * 0.2,
										ease: "easeInOut",
									}}
								/>
							))}
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="mt-8 text-sm text-slate-500 border-t border-slate-100 pt-6"
						>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-left">
									<p className="font-medium text-slate-700">Cities</p>
									<p>{cities.length} global locations</p>
								</div>
								<div className="text-left">
									<p className="font-medium text-slate-700">Time Range</p>
									<p>5 years of data</p>
								</div>
								<div className="text-left">
									<p className="font-medium text-slate-700">Data Points</p>
									<p>{(5 * 365 * cities.length).toLocaleString()}</p>
								</div>
								<div className="text-left">
									<p className="font-medium text-slate-700">Analysis Types</p>
									<p>4 visualization modes</p>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</div>
			) : (
				<>
					{}
					<motion.header
						initial={{ y: -50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg"
						style={{
							boxShadow: "0 4px 15px -2px rgba(0, 0, 0, 0.2)",
						}}
					>
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="flex items-center gap-4">
									<motion.div
										whileHover={{ rotate: 360 }}
										transition={{ duration: 0.5 }}
										className="p-3 bg-white rounded-lg shadow-md"
										style={{
											boxShadow: "0 10px 15px -3px rgba(255, 255, 255, 0.2)",
										}}
									>
										<IoTrendingUp className="w-7 h-7 text-indigo-600" />
									</motion.div>
									<div>
										<h1 className="text-md sm:text-3xl font-bold text-white">
											Weather Anomaly Analysis
										</h1>
										<p className="text-blue-100 text-sm sm:text-base">
											Visualizing Climate Patterns & Anomalies (2020-2024)
										</p>
									</div>
								</div>

								<div className="flex flex-col items-center justify-center md:items-end gap-2">
									<motion.button
										whileHover={{ scale: state.isExporting ? 1 : 1.05 }}
										whileTap={{ scale: state.isExporting ? 1 : 0.95 }}
										onClick={exportChart}
										disabled={state.isExporting}
										className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-200 font-semibold text-sm sm:text-base ${
											state.isExporting
												? "bg-gray-400 cursor-not-allowed text-white"
												: "bg-white text-indigo-700 hover:shadow-lg"
										}`}
										style={{
											boxShadow: state.isExporting
												? "none"
												: "0 4px 10px -1px rgba(0, 0, 0, 0.1)",
										}}
									>
										<IoDownload
											className={`w-4 h-4 sm:w-5 sm:h-5 ${
												state.isExporting ? "animate-bounce" : ""
											}`}
										/>
										{state.isExporting ? "Exporting..." : "Export Chart"}
									</motion.button>
									{state.exportStatus && (
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="text-xs text-blue-100 bg-blue-900/30 px-3 py-1 rounded-full"
										>
											{state.exportStatus}
										</motion.p>
									)}
								</div>
							</div>
						</div>
					</motion.header>

					{}
					<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10">
						<div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
							{}
							<motion.div
								initial={{ x: -50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="order-2 lg:order-1 lg:col-span-1"
							>
								<div
									className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-5 sm:p-6 space-y-6 sticky top-20"
									style={{
										boxShadow:
											"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
										maxHeight: "calc(100vh - 120px)",
										overflowY: "auto",
										overflowX: "hidden",
									}}
								>
									{}
									<div className="border-b border-gray-100 pb-4 mb-2">
										<h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
											<FaFilter className="text-indigo-500" />
											Data Controls
										</h2>
										<p className="text-sm text-gray-500">
											Configure visualization options
										</p>
									</div>

									{}
									{state.viewMode !== "multi-city" && (
										<div>
											<label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
												<MdOutlineWaterDrop className="text-blue-500" />
												City Selection
											</label>
											<div className="grid grid-cols-2 gap-2">
												{cities.map((city) => (
													<motion.button
														key={city}
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														onClick={() =>
															setState((prev) => ({
																...prev,
																selectedCity: city,
															}))
														}
														className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
															state.selectedCity === city
																? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
																: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
														}`}
														style={{
															borderLeft:
																state.selectedCity === city
																	? `5px solid ${getCityColor(city)}`
																	: undefined,
															boxShadow:
																state.selectedCity === city
																	? "0 10px 15px -3px rgba(59, 130, 246, 0.2)"
																	: "none",
														}}
													>
														{city}
													</motion.button>
												))}
											</div>
										</div>
									)}

									{}
									{state.viewMode === "multi-city" && (
										<div>
											<label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
												<MdOutlineWaterDrop className="text-blue-500" />
												Cities
											</label>
											<div className="grid grid-cols-2 gap-3">
												{cities.map((city) => (
													<div
														key={city}
														className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100"
													>
														<div
															className="w-4 h-4 rounded-full shadow-sm"
															style={{
																backgroundColor: getCityColor(city),
																boxShadow: `0 0 0 2px rgba(255,255,255,0.8), 0 0 0 4px ${getCityColor(
																	city
																)}30`,
															}}
														></div>
														<span className="text-gray-800 font-medium">
															{city}
														</span>
													</div>
												))}
											</div>
										</div>
									)}

									{}
									<div>
										<label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
											<FaChartBar className="text-indigo-500" />
											Chart Type
										</label>
										<div className="flex gap-2">
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() =>
													setState((prev) => ({ ...prev, chartType: "line" }))
												}
												className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
													state.chartType === "line"
														? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
														: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
												}`}
												style={{
													boxShadow:
														state.chartType === "line"
															? "0 10px 15px -3px rgba(168, 85, 247, 0.2)"
															: "none",
												}}
											>
												<IoTrendingDown className="w-4 h-4" />
												Line
											</motion.button>
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() =>
													setState((prev) => ({ ...prev, chartType: "bar" }))
												}
												className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
													state.chartType === "bar"
														? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
														: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
												}`}
												style={{
													boxShadow:
														state.chartType === "bar"
															? "0 10px 15px -3px rgba(168, 85, 247, 0.2)"
															: "none",
												}}
											>
												<FaChartBar className="w-4 h-4" />
												Bar
											</motion.button>
										</div>
									</div>

									{}
									<div>
										<label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
											<FaFilter className="text-indigo-500" />
											View Mode
										</label>
										<div className="grid grid-cols-2 gap-3">
											{[
												{
													key: "temperature" as const,
													label: "Temperature",
													icon: FaThermometerHalf,
													color: "from-blue-500 to-blue-600",
													shadow: "rgba(59, 130, 246, 0.2)",
												},
												{
													key: "anomaly" as const,
													label: "Anomalies",
													icon: IoTrendingUp,
													color: "from-red-500 to-red-600",
													shadow: "rgba(239, 68, 68, 0.2)",
												},
												{
													key: "seasonal" as const,
													label: "Seasonal",
													icon: FaCalendarAlt,
													color: "from-green-500 to-green-600",
													shadow: "rgba(16, 185, 129, 0.2)",
												},
												{
													key: "multi-city" as const,
													label: "Multi-City",
													icon: MdTimeToLeave,
													color: "from-amber-500 to-amber-600",
													shadow: "rgba(245, 158, 11, 0.2)",
												},
											].map(({ key, label, icon: Icon, color, shadow }) => (
												<motion.button
													key={key}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													onClick={() =>
														setState((prev) => ({ ...prev, viewMode: key }))
													}
													className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
														state.viewMode === key
															? `bg-gradient-to-r ${color} text-white`
															: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
													}`}
													style={{
														boxShadow:
															state.viewMode === key
																? `0 10px 15px -3px ${shadow}`
																: "none",
													}}
												>
													<Icon className="w-4 h-4" />
													<span>{label}</span>
												</motion.button>
											))}
										</div>
									</div>

									{}
									<div className="pt-4 border-t border-slate-200">
										<h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
											<IoInformationCircle className="text-indigo-500" />
											Color Legend
										</h3>
										{state.viewMode === "anomaly" && (
											<div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
												<p className="text-sm font-medium text-slate-700 mb-2">
													Temperature Anomaly (°C)
												</p>
												<div className="h-6 rounded-md overflow-hidden flex mb-2">
													{COLOR_PALETTES.diverging.map((color, i) => (
														<div
															key={i}
															className="flex-1 h-full"
															style={{ backgroundColor: color }}
															title={
																i < 5 ? `Hot +${5 - i}°C` : `Cold -${i - 4}°C`
															}
														></div>
													))}
												</div>
												<div className="flex justify-between text-xs text-slate-600 font-medium">
													<span>Cold</span>
													<span>Normal</span>
													<span>Hot</span>
												</div>
											</div>
										)}
										{state.viewMode === "seasonal" && (
											<div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
												<p className="text-sm font-medium text-slate-700 mb-2">
													Seasonal Colors
												</p>
												<div className="grid grid-cols-2 gap-2">
													{Object.entries(COLOR_PALETTES.seasonal).map(
														([season, color]) => (
															<div
																key={season}
																className="flex items-center gap-2 p-1"
															>
																<div
																	className="w-4 h-4 rounded-full"
																	style={{ backgroundColor: color }}
																></div>
																<span className="text-sm text-slate-700">
																	{season}
																</span>
															</div>
														)
													)}
												</div>
											</div>
										)}
										{state.viewMode === "temperature" && (
											<div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
												<p className="text-sm font-medium text-slate-700 mb-2">
													Temperature Scale
												</p>
												<div className="flex items-center gap-3">
													<div className="w-4 h-4 rounded-full bg-blue-500"></div>
													<span className="text-sm text-slate-700">
														Actual Temperature
													</span>
												</div>
												<div className="flex items-center gap-3 mt-2">
													<div className="w-4 h-4 rounded-full bg-slate-400"></div>
													<span className="text-sm text-slate-700">
														Historical Average
													</span>
												</div>
											</div>
										)}
										{state.viewMode === "multi-city" && (
											<div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
												<p className="text-sm font-medium text-slate-700 mb-2">
													City Colors
												</p>
												<div className="grid grid-cols-2 gap-2">
													{cities.map((city) => (
														<div
															key={city}
															className="flex items-center gap-2 p-1"
														>
															<div
																className="w-4 h-4 rounded-full"
																style={{ backgroundColor: getCityColor(city) }}
															></div>
															<span className="text-sm text-slate-700">
																{city}
															</span>
														</div>
													))}
												</div>
											</div>
										)}
									</div>

									{}
									<div className="pt-4 border-t border-slate-200">
										<h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
											<IoTrendingUp className="text-indigo-500" />
											Quick Stats
										</h3>
										<div className="grid grid-cols-2 gap-3">
											<div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
												<p className="text-xs text-slate-500">Total Records</p>
												<p className="font-bold text-lg text-slate-800">
													{processedData.length.toLocaleString()}
												</p>
											</div>
											<div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
												<p className="text-xs text-slate-500">Date Range</p>
												<p className="font-bold text-lg text-slate-800">
													2020-2024
												</p>
											</div>
											<div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
												<p className="text-xs text-slate-500">
													Avg Temperature
												</p>
												<p className="font-bold text-lg text-blue-600">
													{Math.round(
														(processedData.reduce(
															(a, b) => a + b.temperature,
															0
														) /
															processedData.length) *
															10
													) / 10}
													°C
												</p>
											</div>
											<div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
												<p className="text-xs text-slate-500">Exports</p>
												<p className="font-bold text-lg text-slate-800">
													{state.downloadCount}
												</p>
											</div>
										</div>
									</div>
								</div>
							</motion.div>

							{}
							<motion.div
								initial={{ y: 50, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="order-1 lg:order-2 lg:col-span-3"
							>
								<div
									className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-4 sm:p-6"
									style={{
										boxShadow:
											"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
									}}
								>
									{}
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
										<div>
											<h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
												{state.viewMode === "temperature" && (
													<FaThermometerHalf className="text-blue-500" />
												)}
												{state.viewMode === "anomaly" && (
													<IoTrendingUp className="text-red-500" />
												)}
												{state.viewMode === "seasonal" && (
													<FaCalendarAlt className="text-green-500" />
												)}
												{state.viewMode === "multi-city" && (
													<MdTimeToLeave className="text-amber-500" />
												)}
												{state.viewMode === "multi-city"
													? "Multi-City Comparison"
													: `${state.selectedCity} ${
															state.viewMode.charAt(0).toUpperCase() +
															state.viewMode.slice(1)
													  } Analysis`}
											</h2>
											<p className="text-sm text-slate-500">
												{state.viewMode === "temperature" &&
													"Visualizing historical vs. actual temperatures"}
												{state.viewMode === "anomaly" &&
													"Highlighting deviations from historical averages"}
												{state.viewMode === "seasonal" &&
													"Analyzing seasonal temperature patterns"}
												{state.viewMode === "multi-city" &&
													"Comparing temperatures across different cities"}
											</p>
										</div>

										{}
										<div className="flex items-center bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-100">
											<BsCalendarRange className="w-4 h-4 text-blue-500 mr-2" />
											<span className="text-xs font-medium">
												Drag handles below chart to select date range
											</span>
										</div>
									</div>

									{}
									<div className="relative">
										<div className="h-[350px] sm:h-[400px] lg:h-[450px] mb-6">
											<ResponsiveContainer width="100%" height="100%">
												{state.chartType === "line" ? (
													<LineChart
														data={chartData}
														margin={{
															top: 20,
															right: 20,
															left: 10,
															bottom: 20,
														}}
														onMouseDown={() => {
															setState((prev) => ({
																...prev,
																isBrushTouched: true,
															}));
															const brushTooltip =
																document.getElementById("brush-tooltip");
															if (brushTooltip) {
																brushTooltip.style.opacity = "0";
															}
														}}
													>
														<CartesianGrid
															strokeDasharray="3 3"
															className="opacity-30"
														/>
														<XAxis
															dataKey="formattedDate"
															tick={{ fontSize: 10, fill: "#64748b" }}
															interval="preserveStartEnd"
															axisLine={{ stroke: "#cbd5e1" }}
															tickLine={false}
															padding={{ left: 10, right: 10 }}
														/>
														<YAxis
															tick={{ fontSize: 10, fill: "#64748b" }}
															axisLine={{ stroke: "#cbd5e1" }}
															tickLine={false}
															width={40}
														/>
														<Tooltip content={<CustomTooltip />} />

														{state.viewMode === "multi-city" ? (
															cities.map((city) => (
																<Line
																	key={city}
																	type="monotone"
																	dataKey="temperature"
																	data={multiCityData[city]}
																	name={city}
																	stroke={getCityColor(city)}
																	strokeWidth={2}
																	dot={false}
																	activeDot={{
																		r: 6,
																		fill: getCityColor(city),
																		stroke: "white",
																		strokeWidth: 2,
																	}}
																	isAnimationActive={true}
																/>
															))
														) : state.viewMode === "temperature" ? (
															<>
																<Line
																	type="monotone"
																	dataKey="temperature"
																	stroke="#3b82f6"
																	strokeWidth={3}
																	dot={false}
																	activeDot={{
																		r: 6,
																		fill: "#3b82f6",
																		stroke: "white",
																		strokeWidth: 2,
																	}}
																	isAnimationActive={true}
																/>
																<Line
																	type="monotone"
																	dataKey="historicalAvg"
																	stroke="#94a3b8"
																	strokeWidth={2}
																	strokeDasharray="5 5"
																	dot={false}
																	isAnimationActive={true}
																/>
															</>
														) : state.viewMode === "anomaly" ? (
															<Line
																type="monotone"
																dataKey="anomaly"
																stroke="#ef4444"
																strokeWidth={3}
																dot={{
																	r: 4,
																	stroke: "white",
																	strokeWidth: 1,
																	fill: "#ef4444",

																	fillOpacity: 1,
																}}
																activeDot={{
																	r: 6,
																	stroke: "white",
																	strokeWidth: 2,
																	fill: "#ef4444",
																	fillOpacity: 1,
																}}
																isAnimationActive={true}
															/>
														) : (
															<Line
																type="monotone"
																dataKey="temperature"
																stroke="#10b981"
																strokeWidth={3}
																dot={{
																	r: 4,
																	stroke: "white",
																	strokeWidth: 1,
																	fill: "#10b981",
																	fillOpacity: 1,
																}}
																activeDot={{
																	r: 6,
																	stroke: "white",
																	strokeWidth: 2,
																	fill: "#10b981",
																	fillOpacity: 1,
																}}
																isAnimationActive={true}
															/>
														)}

														{state.viewMode === "anomaly" && (
															<ReferenceLine
																y={0}
																stroke="#64748b"
																strokeDasharray="2 2"
															/>
														)}

														{}
														<Brush
															className="date-range-brush"
															dataKey="formattedDate"
															height={40}
															stroke="#3b82f6"
															fill="rgba(59, 130, 246, 0.1)"
															startIndex={0}
															endIndex={Math.min(365, processedData.length - 1)}
															tickFormatter={(value) => {
																if (typeof value === "string") {
																	return value;
																}
																return "";
															}}
															onChange={(range: any) => {
																setState((prev) => ({
																	...prev,
																	brushRange: range,
																	selectedRange: range,
																	isBrushTouched: true,
																}));

																const brushTooltip =
																	document.getElementById("brush-tooltip");
																if (brushTooltip) {
																	brushTooltip.style.opacity = "0";
																}
															}}
														/>
													</LineChart>
												) : (
													<BarChart
														data={chartData}
														margin={{
															top: 20,
															right: 20,
															left: 10,
															bottom: 20,
														}}
														onMouseDown={() => {
															setState((prev) => ({
																...prev,
																isBrushTouched: true,
															}));
															const brushTooltip =
																document.getElementById("brush-tooltip");
															if (brushTooltip) {
																brushTooltip.style.opacity = "0";
															}
														}}
													>
														<CartesianGrid
															strokeDasharray="3 3"
															className="opacity-30"
														/>
														<XAxis
															dataKey={
																state.viewMode === "multi-city"
																	? "formattedDate"
																	: "monthYear"
															}
															tick={{ fontSize: 10, fill: "#64748b" }}
															interval="preserveStartEnd"
															axisLine={{ stroke: "#cbd5e1" }}
															tickLine={false}
															padding={{ left: 10, right: 10 }}
														/>
														<YAxis
															tick={{ fontSize: 10, fill: "#64748b" }}
															axisLine={{ stroke: "#cbd5e1" }}
															tickLine={false}
															width={40}
														/>
														<Tooltip content={<CustomTooltip />} />

														{state.viewMode === "temperature" && (
															<Bar
																dataKey="temperature"
																radius={[4, 4, 0, 0]}
																isAnimationActive={true}
															>
																{chartData.map((entry, index) => (
																	<Cell key={`cell-${index}`} fill="#3b82f6" />
																))}
															</Bar>
														)}

														{state.viewMode === "anomaly" && (
															<Bar
																dataKey="anomaly"
																radius={[4, 4, 0, 0]}
																isAnimationActive={true}
															>
																{chartData.map((entry, index) => (
																	<Cell
																		key={`cell-${index}`}
																		fill={getAnomalyColor(entry.anomaly)}
																	/>
																))}
															</Bar>
														)}

														{state.viewMode === "seasonal" && (
															<Bar
																dataKey="temperature"
																radius={[4, 4, 0, 0]}
																isAnimationActive={true}
															>
																{chartData.map((entry, index) => (
																	<Cell
																		key={`cell-${index}`}
																		fill={getSeasonColor(entry.season)}
																	/>
																))}
															</Bar>
														)}

														{state.viewMode === "multi-city" && (
															<Bar
																dataKey="temperature"
																radius={[4, 4, 0, 0]}
																isAnimationActive={true}
															>
																{chartData.map((entry, index) => (
																	<Cell
																		key={`cell-${index}`}
																		fill={getCityColor(entry.city)}
																	/>
																))}
															</Bar>
														)}

														{state.viewMode === "anomaly" && (
															<ReferenceLine
																y={0}
																stroke="#64748b"
																strokeDasharray="2 2"
															/>
														)}

														{}
														<Brush
															className="date-range-brush"
															dataKey={
																state.viewMode === "multi-city"
																	? "formattedDate"
																	: "monthYear"
															}
															height={40}
															stroke="#3b82f6"
															fill="rgba(59, 130, 246, 0.1)"
															startIndex={0}
															endIndex={Math.min(30, chartData.length - 1)}
															onChange={(range: any) => {
																setState((prev) => ({
																	...prev,
																	brushRange: range,
																	selectedRange: range,
																	isBrushTouched: true,
																}));

																const brushTooltip =
																	document.getElementById("brush-tooltip");
																if (brushTooltip) {
																	brushTooltip.style.opacity = "0";
																}
															}}
														/>
													</BarChart>
												)}
											</ResponsiveContainer>

											{}
											<motion.div
												id="brush-tooltip"
												className="absolute z-50 bottom-16 left-1/2 transform -translate-x-1/2 bg-indigo-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 pointer-events-none transition-opacity duration-500"
												style={{
													opacity: 0,
													boxShadow: "0 10px 25px rgba(79, 70, 229, 0.2)",

													position: "fixed",

													bottom: "30%",

													zIndex: 9999,
												}}
												initial={{ opacity: 0, y: 10 }}
												animate={{
													opacity: state.isBrushTouched ? 0 : 1,
													y: 0,
												}}
												transition={{ delay: 2 }}
											>
												<BsHandIndex className="text-indigo-200" />
												<span className="text-sm font-medium">
													Drag the handles below to select a date range
												</span>
											</motion.div>
										</div>

										{}
										<AnimatePresence>
											{rangeStats && (
												<motion.div
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 20 }}
													className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 border border-blue-100 shadow-md mb-4"
												>
													<div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-100">
														<BsCalendarRange className="w-5 h-5 text-indigo-600" />
														<h3 className="font-bold text-indigo-900 text-lg">
															Selected Range Analysis
														</h3>
													</div>

													<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
														<div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-blue-100 shadow-sm">
															<p className="text-slate-500 text-xs font-medium mb-1">
																Time Period
															</p>
															<p className="font-semibold text-indigo-900">
																{new Date(
																	rangeStats.startDate
																).toLocaleDateString("en-US", {
																	month: "short",
																	day: "numeric",
																})}{" "}
																-{" "}
																{new Date(
																	rangeStats.endDate
																).toLocaleDateString("en-US", {
																	month: "short",
																	day: "numeric",
																})}
															</p>
															<p className="text-xs text-indigo-500 font-medium mt-1">
																{rangeStats.count} days selected
															</p>
														</div>

														<div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-blue-100 shadow-sm">
															<p className="text-slate-500 text-xs font-medium mb-1">
																Avg Temperature
															</p>
															<p className="font-bold text-blue-600 text-xl">
																{rangeStats.avgTemp}°C
															</p>
															<div className="flex items-center mt-1">
																<FaThermometerHalf className="text-blue-400 w-3 h-3 mr-1" />
																<p className="text-xs text-blue-500">
																	Mean temperature
																</p>
															</div>
														</div>

														<div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-blue-100 shadow-sm">
															<p className="text-slate-500 text-xs font-medium mb-1">
																Temperature Range
															</p>
															<p className="font-bold text-orange-600 text-lg">
																{rangeStats.minTemp}° - {rangeStats.maxTemp}°
															</p>
															<div className="flex items-center mt-1">
																<BsArrowsExpand className="text-orange-400 w-3 h-3 mr-1" />
																<p className="text-xs text-orange-500">
																	Min-max spread
																</p>
															</div>
														</div>

														<div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-blue-100 shadow-sm">
															<p className="text-slate-500 text-xs font-medium mb-1">
																Avg Anomaly
															</p>
															<p
																className={`font-bold text-xl ${
																	rangeStats.avgAnomaly >= 0
																		? "text-red-600"
																		: "text-blue-600"
																}`}
															>
																{rangeStats.avgAnomaly > 0 ? "+" : ""}
																{rangeStats.avgAnomaly}°C
															</p>
															<div className="flex items-center mt-1">
																<IoTrendingUp
																	className={`w-3 h-3 mr-1 ${
																		rangeStats.avgAnomaly >= 0
																			? "text-red-400"
																			: "text-blue-400"
																	}`}
																/>
																<p
																	className={`text-xs ${
																		rangeStats.avgAnomaly >= 0
																			? "text-red-500"
																			: "text-blue-500"
																	}`}
																>
																	{rangeStats.avgAnomaly >= 0
																		? "Above"
																		: "Below"}{" "}
																	historical avg
																</p>
															</div>
														</div>
													</div>

													<div className="mt-4 pt-4 border-t border-blue-100">
														<p className="text-sm font-semibold text-indigo-900 mb-3">
															Seasonal Distribution:
														</p>
														<div className="flex flex-wrap gap-2">
															{Object.entries(rangeStats.seasonalBreakdown).map(
																([season, count]) => (
																	<div
																		key={season}
																		className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-100 shadow-sm"
																	>
																		<div
																			className="w-3 h-3 rounded-full"
																			style={{
																				backgroundColor: getSeasonColor(season),
																			}}
																		></div>
																		<span className="text-sm font-medium text-slate-700">
																			{season}:{" "}
																			<span className="font-bold text-indigo-600">
																				{count}
																			</span>{" "}
																			days
																		</span>
																	</div>
																)
															)}
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</div>
							</motion.div>
						</div>
					</div>

					{}
					<motion.footer
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className="bg-white/40 backdrop-blur-sm border-t border-indigo-100 py-4 mt-8"
					>
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="flex items-center gap-2">
									<IoTrendingUp className="w-4 h-4 text-indigo-600" />
									<p className="text-sm text-slate-600">
										Weather Anomaly Analysis Tool
									</p>
								</div>
								<p className="text-xs text-slate-500">
									5 Years of Historical Data • 4 Cities •{" "}
									{(5 * 365 * cities.length).toLocaleString()} Data Points
								</p>
							</div>
						</div>
					</motion.footer>
				</>
			)}
			<style jsx global>{`
				.recharts-brush-texts {
					z-index: 9999 !important;
					position: relative;
				}
				@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

				* {
					font-family: "Poppins", sans-serif;
				}
				.recharts-brush-slide text {
					fill: #1e40af !important;
					font-weight: bold !important;
					font-size: 12px !important;
					filter: drop-shadow(0px 0px 2px white) !important;
					background-color: white !important;
				}

				.recharts-layer.recharts-brush-traveller {
					z-index: 999 !important;
				}

				.recharts-brush {
					z-index: 900 !important;
				}
			`}</style>
		</div>
	);
};

export default WeatherAnomalyTool;
