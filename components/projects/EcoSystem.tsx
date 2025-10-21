"use client";
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import {
	FaPlay,
	FaPause,
	FaRedo,
	FaExclamationTriangle,
	FaMoon,
	FaSun,
	FaChevronUp,
	FaChevronDown,
	FaCheck,
	FaTimes,
	FaInfoCircle,
	FaGithub,
	FaTwitter,
	FaSearchPlus,
	FaSearchMinus,
	FaExpand,
	FaCog,
	FaLock,
} from "react-icons/fa";
import { FiActivity, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
export function AnimatedNumber({ value, style = {}, ...rest }) {
	const ref = useRef();
	const prevValue = useRef(value);

	useEffect(() => {
		if (prevValue.current !== value && ref.current) {
			ref.current.style.animation = "none";
			void ref.current.offsetWidth;
			ref.current.style.animation =
				"numberCounter 0.4s cubic-bezier(.5,1.5,.5,1)";
		}
		prevValue.current = value;
	}, [value]);

	return (
		<span ref={ref} style={style} {...rest}>
			{value}
		</span>
	);
}
const Toast = React.memo(({ toast, onClose, darkMode }) => {
	const toastStyles = useMemo(() => {
		const base = {
			padding: "12px 16px",
			borderRadius: "8px",
			marginBottom: "8px",
			fontSize: "14px",
			fontWeight: "500",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
			cursor: "pointer",
			touchAction: "manipulation",
			userSelect: "none",
			animation:
				"toastSlideIn 0.3s ease forwards, toastSlideOut 0.3s ease 2.7s forwards",
		};

		const types = {
			success: {
				backgroundColor: darkMode ? "#065f46" : "#dcfce7",
				color: darkMode ? "#6ee7b7" : "#166534",
			},
			error: {
				backgroundColor: darkMode ? "#7f1d1d" : "#fef2f2",
				color: darkMode ? "#fca5a5" : "#dc2626",
			},
			warning: {
				backgroundColor: darkMode ? "#92400e" : "#fffbeb",
				color: darkMode ? "#fbbf24" : "#d97706",
			},
			info: {
				backgroundColor: darkMode ? "#1e3a8a" : "#eff6ff",
				color: darkMode ? "#93c5fd" : "#2563eb",
			},
		};

		return { ...base, ...types[toast.type] };
	}, [toast.type, darkMode]);

	const icon = useMemo(() => {
		const icons = {
			success: <FaCheck size={16} />,
			error: <FaTimes size={16} />,
			warning: <FaExclamationTriangle size={16} />,
			info: <FaInfoCircle size={16} />,
		};
		return icons[toast.type];
	}, [toast.type]);

	const handleClick = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			onClose();
		},
		[onClose]
	);

	return (
		<div style={toastStyles} onTouchStart={handleClick} onClick={handleClick}>
			{icon}
			{toast.message}
		</div>
	);
});

const ParameterSlider = React.memo(
	({
		label,
		value,
		onChange,
		min,
		max,
		step,
		icon,
		description,
		disabled,
		darkMode,
		cardStyle,
	}) => {
		const [isDragging, setIsDragging] = useState(false);
		const sliderRef = useRef(null);

		const handlePointerDown = useCallback(
			(e) => {
				if (disabled) return;
				setIsDragging(true);
				if (sliderRef.current) {
					sliderRef.current.setPointerCapture(e.pointerId);
				}
			},
			[disabled]
		);

		const handlePointerUp = useCallback(
			(e) => {
				if (disabled) return;
				setIsDragging(false);
				if (sliderRef.current) {
					sliderRef.current.releasePointerCapture(e.pointerId);
				}
			},
			[disabled]
		);

		const sliderContainerStyle = useMemo(
			() => ({
				...cardStyle,
				padding: "16px",
				marginBottom: "12px",
				transform: isDragging ? "scale(1.02)" : "scale(1)",
				transition: "transform 0.2s ease",
				opacity: disabled ? 0.6 : 1,
				position: "relative",
			}),
			[cardStyle, isDragging, disabled]
		);

		const iconStyle = useMemo(
			() => ({
				width: "40px",
				height: "40px",
				borderRadius: "8px",
				background: disabled
					? "#9ca3af"
					: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: "18px",
				animation: disabled ? "none" : "float 6s ease-in-out infinite",
			}),
			[disabled]
		);

		const valueDisplayStyle = useMemo(
			() => ({
				fontSize: "12px",
				fontWeight: "bold",
				color: disabled ? "#9ca3af" : "#3b82f6",
				backgroundColor: disabled
					? darkMode
						? "#374151"
						: "#f3f4f6"
					: darkMode
					? "#1e3a8a"
					: "#dbeafe",
				padding: "6px 10px",
				borderRadius: "8px",
				transition: "all 0.2s ease",
				transform: isDragging ? "scale(1.1)" : "scale(1)",
			}),
			[disabled, darkMode, isDragging]
		);

		const lockIconStyle = useMemo(
			() => ({
				position: "absolute",
				top: "8px",
				right: "8px",
				backgroundColor: darkMode ? "#374151" : "#f3f4f6",
				borderRadius: "6px",
				padding: "4px",
				display: "flex",
				alignItems: "center",
				gap: "4px",
				fontSize: "10px",
				color: darkMode ? "#9ca3af" : "#6b7280",
			}),
			[darkMode]
		);

		const sliderStyle = useMemo(
			() => ({
				width: "100%",
				height: "24px",
				borderRadius: "12px",
				backgroundColor: darkMode ? "#4b5563" : "#e5e7eb",
				outline: "none",
				appearance: "none",
				cursor: disabled ? "not-allowed" : "pointer",
				WebkitAppearance: "none",
				touchAction: "manipulation",
				transition: "all 0.2s ease",
				opacity: disabled ? 0.5 : 1,
			}),
			[disabled, darkMode]
		);

		return (
			<div style={sliderContainerStyle}>
				{disabled && (
					<div style={lockIconStyle}>
						<FaLock size={10} />
						<span>Locked</span>
					</div>
				)}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: "12px",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<div style={iconStyle}>{icon}</div>
						<div>
							<div
								style={{
									fontSize: "14px",
									fontWeight: "600",
									color: darkMode ? "#f3f4f6" : "#374151",
								}}
							>
								{label}
							</div>
							<div
								style={{
									fontSize: "12px",
									color: darkMode ? "#9ca3af" : "#6b7280",
								}}
							>
								{disabled ? "Locked during simulation" : description}
							</div>
						</div>
					</div>
					<div style={valueDisplayStyle}>{value.toFixed(3)}</div>
				</div>
				<div style={{ padding: "8px 0" }}>
					<input
						ref={sliderRef}
						type="range"
						min={min}
						max={max}
						step={step}
						value={value}
						onChange={(e) => !disabled && onChange(parseFloat(e.target.value))}
						onPointerDown={handlePointerDown}
						onPointerUp={handlePointerUp}
						disabled={disabled}
						style={sliderStyle}
					/>
				</div>
			</div>
		);
	}
);

const PopulationCard = React.memo(
	({
		type,
		population,
		trend,
		icon,
		color,
		isDesktop,
		darkMode,
		cardStyle,
	}) => {
		const containerStyle = useMemo(
			() => ({
				...cardStyle,
				padding: isDesktop ? "24px" : "16px",
				cursor: "default",
				animation: "slideInUp 0.6s ease",
				minHeight: isDesktop ? "160px" : "120px",
				position: "relative",
			}),
			[cardStyle, isDesktop]
		);

		const iconContainerStyle = useMemo(
			() => ({
				width: isDesktop ? "48px" : "32px",
				height: isDesktop ? "48px" : "32px",
				borderRadius: isDesktop ? "12px" : "8px",
				background: `linear-gradient(135deg, ${color}, ${color}dd)`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: isDesktop ? "24px" : "16px",
				animation: "float 4s ease-in-out infinite",
			}),
			[isDesktop, color]
		);

		const populationStyle = useMemo(
			() => ({
				fontSize: isDesktop ? "40px" : "24px",
				fontWeight: "bold",
				color,
				margin: "0 0 8px 0",
				fontVariantNumeric: "tabular-nums",
			}),
			[isDesktop, color]
		);

		const trendStyle = useMemo(
			() => ({
				fontSize: isDesktop ? "14px" : "12px",
				color: darkMode ? "#9ca3af" : "#6b7280",
				margin: "0",
			}),
			[isDesktop, darkMode]
		);

		const bigIconStyle = useMemo(
			() => ({
				fontSize: isDesktop ? "64px" : "32px",
				opacity: "0.8",
				animation: population <= 0 ? "shake 0.5s ease-in-out" : "none",
				position: "absolute",
				right: isDesktop ? "24px" : "16px",
				top: "50%",
				transform: "translateY(-50%)",
			}),
			[isDesktop, population]
		);

		const trendIcon = useMemo(() => {
			if (trend > (type === "Prey" ? 1 : 0.5)) {
				return <FiTrendingUp size={12} style={{ color: "#10b981" }} />;
			} else if (trend < (type === "Prey" ? -1 : -0.5)) {
				return <FiTrendingDown size={12} style={{ color: "#ef4444" }} />;
			} else {
				return <FiActivity size={12} style={{ color: "#9ca3af" }} />;
			}
		}, [trend, type]);

		const displayIcon = useMemo(() => {
			if (population <= 0) return "💀";
			return type === "Prey" ? "🌱" : "⚡";
		}, [population, type]);

		const displayPopulation = useMemo(() => {
			return population <= 0 ? "0" : Math.round(population).toLocaleString();
		}, [population]);

		const displayTrend = useMemo(() => {
			return `Rate: ${trend > 0 ? "+" : ""}${trend.toFixed(1)}/step`;
		}, [trend]);

		return (
			<div style={containerStyle}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div style={{ flex: 1 }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "12px",
								marginBottom: isDesktop ? "12px" : "8px",
							}}
						>
							<div style={iconContainerStyle}>{icon}</div>
							<div>
								<div
									style={{
										fontSize: "14px",
										color: darkMode ? "#9ca3af" : "#6b7280",
										fontWeight: "500",
									}}
								>
									{type} Population
								</div>
								<div>{trendIcon}</div>
							</div>
						</div>
						<p style={populationStyle}>
							<AnimatedNumber value={displayPopulation} />
						</p>
						<p style={trendStyle}>{displayTrend}</p>
					</div>
					<div style={bigIconStyle}>{displayIcon}</div>
				</div>
			</div>
		);
	}
);

const OptimizedChart = React.memo(
	({
		data,
		darkMode,
		isDesktop,
		chartZoom,
		chartPan,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
	}) => {
		const visibleData = useMemo(() => {
			if (!data.length) return [];
			const dataLength = data.length;
			const visibleLength = Math.floor(dataLength / chartZoom);
			const startIndex = Math.max(
				0,
				Math.min(dataLength - visibleLength, Math.floor(chartPan))
			);
			return data.slice(startIndex, startIndex + visibleLength);
		}, [data, chartZoom, chartPan]);

		const containerStyle = useMemo(
			() => ({
				height: isDesktop ? "100%" : "256px",
				backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
				borderRadius: "8px",
				border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
				touchAction: "none",
				transition: "all 0.3s ease",
			}),
			[isDesktop, darkMode]
		);

		const margin = useMemo(
			() => ({
				top: isDesktop ? 20 : 10,
				right: isDesktop ? 20 : 10,
				left: isDesktop ? 20 : 10,
				bottom: isDesktop ? 20 : 10,
			}),
			[isDesktop]
		);

		const axisTickStyle = useMemo(
			() => ({
				fontSize: isDesktop ? 12 : 11,
				fill: darkMode ? "#9ca3af" : "#6b7280",
			}),
			[isDesktop, darkMode]
		);

		const axisLineStyle = useMemo(
			() => ({
				stroke: darkMode ? "#4b5563" : "#d1d5db",
			}),
			[darkMode]
		);

		const tooltipStyle = useMemo(
			() => ({
				backgroundColor: darkMode ? "#1f2937" : "white",
				border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
				borderRadius: isDesktop ? "12px" : "8px",
				fontSize: isDesktop ? "14px" : "12px",
				color: darkMode ? "#f3f4f6" : "#374151",
			}),
			[darkMode, isDesktop]
		);

		const strokeWidth = useMemo(() => (isDesktop ? 3 : 2), [isDesktop]);

		return (
			<div
				style={containerStyle}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={visibleData} margin={margin}>
						<XAxis
							dataKey="time"
							tick={axisTickStyle}
							axisLine={axisLineStyle}
							tickLine={axisLineStyle}
						/>
						<YAxis
							tick={axisTickStyle}
							axisLine={axisLineStyle}
							tickLine={axisLineStyle}
						/>
						<Tooltip
							contentStyle={tooltipStyle}
							labelFormatter={(value) => `Time: ${value}s`}
							formatter={(value, name) => [
								value.toLocaleString(),
								name === "prey" ? "🦌 Prey" : "🐺 Predators",
							]}
						/>
						<Line
							type="monotone"
							dataKey="prey"
							stroke="#10b981"
							strokeWidth={strokeWidth}
							dot={false}
							name="prey"
						/>
						<Line
							type="monotone"
							dataKey="predator"
							stroke="#ef4444"
							strokeWidth={strokeWidth}
							dot={false}
							name="predator"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		);
	}
);

const EcosystemSimulator = () => {
	const [isRunning, setIsRunning] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [chartZoom, setChartZoom] = useState(1);
	const [chartPan, setChartPan] = useState(0);

	const [displayValues, setDisplayValues] = useState({
		time: 0,
		preyPop: 100,
		predatorPop: 20,
		preyTrend: 0,
		predatorTrend: 0,
		ecosystemHealth: "stable",
	});

	const [params, setParams] = useState({
		preyBirthRate: 1.0,
		predationRate: 0.02,
		predationEfficiency: 0.01,
		predatorDeathRate: 0.5,
	});

	const [toasts, setToasts] = useState([]);
	const [allData, setAllData] = useState([]);

	const simulationRef = useRef({
		time: 0,
		preyPop: 100,
		predatorPop: 20,
		preyTrend: 0,
		predatorTrend: 0,
		ecosystemHealth: "stable",
	});

	const animationFrameRef = useRef();
	const lastTimeRef = useRef(0);
	const dataPointsRef = useRef([]);
	const toastIdRef = useRef(0);
	const displayUpdateCounterRef = useRef(0);
	const lastNotificationRef = useRef({ type: "", time: 0 });

	const [chartTouchState, setChartTouchState] = useState({
		isZooming: false,
		isPanning: false,
		startDistance: 0,
		lastCenter: { x: 0, y: 0 },
		startPan: 0,
		startX: 0,
	});

	const presets = useMemo(
		() => [
			{
				name: "🌱 Balanced Ecosystem",
				description: "Stable predator-prey cycles",
				params: {
					preyBirthRate: 1.0,
					predationRate: 0.02,
					predationEfficiency: 0.01,
					predatorDeathRate: 0.5,
					preyPop: 100,
					predatorPop: 20,
				},
			},
			{
				name: "🐺 Predator Dominance",
				description: "High predation pressure",
				params: {
					preyBirthRate: 0.8,
					predationRate: 0.035,
					predationEfficiency: 0.015,
					predatorDeathRate: 0.3,
					preyPop: 80,
					predatorPop: 40,
				},
			},
			{
				name: "🦌 Prey Explosion",
				description: "Low predation, high birth rate",
				params: {
					preyBirthRate: 1.5,
					predationRate: 0.01,
					predationEfficiency: 0.005,
					predatorDeathRate: 0.7,
					preyPop: 150,
					predatorPop: 10,
				},
			},
			{
				name: "💀 Extinction Risk",
				description: "Critical population levels",
				params: {
					preyBirthRate: 0.6,
					predationRate: 0.04,
					predationEfficiency: 0.008,
					predatorDeathRate: 0.8,
					preyPop: 25,
					predatorPop: 15,
				},
			},
		],
		[]
	);

	const cardStyle = useMemo(
		() => ({
			backgroundColor: darkMode
				? "rgba(55, 65, 81, 0.8)"
				: "rgba(255, 255, 255, 0.8)",
			backdropFilter: "blur(20px)",
			borderRadius: "16px",
			border: `1px solid ${darkMode ? "#4b5563" : "#e5e7eb"}`,
			boxShadow: darkMode
				? "0 8px 32px rgba(0,0,0,0.3)"
				: "0 8px 32px rgba(0,0,0,0.1)",
			transition: "all 0.3s ease",
		}),
		[darkMode]
	);

	const getTouchDistance = useCallback((touches) => {
		if (touches.length < 2) return 0;
		const touch1 = touches[0];
		const touch2 = touches[1];
		return Math.sqrt(
			Math.pow(touch2.clientX - touch1.clientX, 2) +
				Math.pow(touch2.clientY - touch1.clientY, 2)
		);
	}, []);

	const getTouchCenter = useCallback((touches) => {
		if (touches.length < 2) return { x: 0, y: 0 };
		const touch1 = touches[0];
		const touch2 = touches[1];
		return {
			x: (touch1.clientX + touch2.clientX) / 2,
			y: (touch1.clientY + touch2.clientY) / 2,
		};
	}, []);

	const calculateEcosystemHealth = useCallback((prey, predator) => {
		if (prey <= 0 && predator <= 0) return "extinct";
		if (prey < 10 || predator < 1) return "critical";
		if (prey > 400 || predator > 150) return "overpopulation";
		if (prey < 50 || predator < 5) return "unstable";
		if (prey > 200 && predator > 50) return "thriving";
		return "stable";
	}, []);

	const addToast = useCallback((message, type = "info", duration = 3000) => {
		const now = Date.now();
		const key = `${type}-${message}`;

		if (
			lastNotificationRef.current.type === key &&
			now - lastNotificationRef.current.time < 2000
		) {
			return;
		}

		lastNotificationRef.current = { type: key, time: now };

		const id = toastIdRef.current++;
		const toast = { id, message, type, duration };
		setToasts((prev) => [...prev, toast]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, duration);
	}, []);

	const simulateStep = useCallback(() => {
		const dt = 0.05;
		const current = simulationRef.current;

		const dPrey =
			(params.preyBirthRate * current.preyPop -
				params.predationRate * current.preyPop * current.predatorPop) *
			dt;
		const dPredator =
			(params.predationEfficiency * current.preyPop * current.predatorPop -
				params.predatorDeathRate * current.predatorPop) *
			dt;

		const newPrey = Math.max(0, current.preyPop + dPrey);
		const newPredator = Math.max(0, current.predatorPop + dPredator);
		const newHealth = calculateEcosystemHealth(newPrey, newPredator);

		simulationRef.current = {
			time: current.time + 0.05,
			preyPop: newPrey,
			predatorPop: newPredator,
			preyTrend: dPrey,
			predatorTrend: dPredator,
			ecosystemHealth: newHealth,
		};

		if (
			newPrey <= 0 &&
			newPredator <= 0 &&
			current.ecosystemHealth !== "extinct"
		) {
			setAlertMessage("💀 EXTINCTION: Both species have died out!");
			setShowAlert(true);
			setIsRunning(false);
			addToast("💀 Ecosystem collapse!", "error", 5000);
		} else if (
			newPrey < 5 &&
			newPredator > 0 &&
			current.ecosystemHealth !== "critical"
		) {
			setAlertMessage("🚨 CRITICAL: Prey population collapse imminent!");
			setShowAlert(true);
			addToast("🚨 Critical situation!", "warning");
		} else if (
			newPredator < 1 &&
			newPrey > 200 &&
			current.ecosystemHealth !== "critical"
		) {
			setAlertMessage("⚠️ WARNING: Predator extinction! Prey explosion!");
			setShowAlert(true);
		} else if (
			current.ecosystemHealth === "critical" &&
			newHealth !== "critical"
		) {
			setShowAlert(false);
		}

		const newPoint = {
			time: parseFloat(simulationRef.current.time.toFixed(2)),
			prey: Math.round(newPrey),
			predator: Math.round(newPredator),
		};

		dataPointsRef.current = [...dataPointsRef.current, newPoint];

		if (dataPointsRef.current.length > 1000) {
			dataPointsRef.current = dataPointsRef.current.slice(-800);
		}
	}, [params, calculateEcosystemHealth, addToast]);

	const animateSimulation = useCallback(
		(currentTime) => {
			if (!lastTimeRef.current) lastTimeRef.current = currentTime;
			const deltaTime = currentTime - lastTimeRef.current;

			if (deltaTime >= 50) {
				simulateStep();
				lastTimeRef.current = currentTime;

				displayUpdateCounterRef.current++;
				if (displayUpdateCounterRef.current >= 5) {
					displayUpdateCounterRef.current = 0;
					const current = simulationRef.current;
					setDisplayValues({
						time: current.time,
						preyPop: current.preyPop,
						predatorPop: current.predatorPop,
						preyTrend: current.preyTrend,
						predatorTrend: current.predatorTrend,
						ecosystemHealth: current.ecosystemHealth,
					});
					setAllData([...dataPointsRef.current]);
				}
			}

			if (
				isRunning &&
				(simulationRef.current.preyPop > 0 ||
					simulationRef.current.predatorPop > 0)
			) {
				animationFrameRef.current = requestAnimationFrame(animateSimulation);
			}
		},
		[isRunning, simulateStep]
	);

	const visibleData = useMemo(() => {
		if (!allData.length) return [];
		const dataLength = allData.length;
		const visibleLength = Math.floor(dataLength / chartZoom);
		const startIndex = Math.max(
			0,
			Math.min(dataLength - visibleLength, Math.floor(chartPan))
		);
		return allData.slice(startIndex, startIndex + visibleLength);
	}, [allData, chartZoom, chartPan]);

	useEffect(() => {
		const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
		const savedDarkMode = window.localStorage?.getItem("darkMode");

		if (savedDarkMode !== null) {
			setDarkMode(JSON.parse(savedDarkMode));
		} else {
			setDarkMode(
				window.matchMedia?.("(prefers-color-scheme: dark)").matches || false
			);
		}

		checkIsDesktop();
		window.addEventListener("resize", checkIsDesktop);
		return () => window.removeEventListener("resize", checkIsDesktop);
	}, []);

	useEffect(() => {
		document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
		document.body.style.backgroundColor = darkMode ? "#0f172a" : "#f8fafc";
		if (window.localStorage) {
			window.localStorage.setItem("darkMode", JSON.stringify(darkMode));
		}
	}, [darkMode]);

	useEffect(() => {
		if (
			isRunning &&
			(simulationRef.current.preyPop > 0 ||
				simulationRef.current.predatorPop > 0)
		) {
			lastTimeRef.current = 0;
			displayUpdateCounterRef.current = 0;
			animationFrameRef.current = requestAnimationFrame(animateSimulation);
		} else {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isRunning, animateSimulation]);

	const handleChartTouchStart = useCallback(
		(e) => {
			e.stopPropagation();

			if (e.touches.length === 2) {
				const distance = getTouchDistance(e.touches);
				const center = getTouchCenter(e.touches);
				setChartTouchState({
					isZooming: true,
					isPanning: false,
					startDistance: distance,
					lastCenter: center,
					startPan: chartPan,
					startX: 0,
				});
			} else if (e.touches.length === 1 && chartZoom > 1) {
				setChartTouchState({
					isZooming: false,
					isPanning: true,
					startDistance: 0,
					lastCenter: { x: 0, y: 0 },
					startPan: chartPan,
					startX: e.touches[0].clientX,
				});
			}
		},
		[chartZoom, chartPan, getTouchDistance, getTouchCenter]
	);

	const handleChartTouchMove = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();

			if (chartTouchState.isZooming && e.touches.length === 2) {
				const currentDistance = getTouchDistance(e.touches);
				const currentCenter = getTouchCenter(e.touches);

				if (chartTouchState.startDistance > 0) {
					const scale = currentDistance / chartTouchState.startDistance;
					const newZoom = Math.max(0.5, Math.min(5, chartZoom * scale));
					setChartZoom(newZoom);
					setChartTouchState((prev) => ({
						...prev,
						startDistance: currentDistance,
					}));
				}

				const deltaX = currentCenter.x - chartTouchState.lastCenter.x;
				const newPan = chartPan + deltaX * 0.1;
				setChartPan(newPan);
				setChartTouchState((prev) => ({ ...prev, lastCenter: currentCenter }));
			} else if (chartTouchState.isPanning && e.touches.length === 1) {
				const deltaX = e.touches[0].clientX - chartTouchState.startX;
				const sensitivity = 0.5 / chartZoom;
				const newPan = chartTouchState.startPan - deltaX * sensitivity;
				setChartPan(newPan);
			}
		},
		[chartTouchState, chartZoom, chartPan, getTouchDistance, getTouchCenter]
	);

	const handleChartTouchEnd = useCallback((e) => {
		e.stopPropagation();

		if (e.touches.length === 0) {
			setChartTouchState({
				isZooming: false,
				isPanning: false,
				startDistance: 0,
				lastCenter: { x: 0, y: 0 },
				startPan: 0,
				startX: 0,
			});
		}
	}, []);

	const handleButtonTouch = useCallback((e, callback) => {
		e.preventDefault();
		e.stopPropagation();

		const button = e.currentTarget;
		button.style.transform = "scale(0.95)";

		setTimeout(() => {
			button.style.transform = "scale(1)";
			callback();
		}, 100);
	}, []);

	const toggleSimulation = useCallback(() => {
		const canStart =
			simulationRef.current.preyPop > 0 ||
			simulationRef.current.predatorPop > 0;
		if (canStart) {
			setIsRunning(!isRunning);
		}
	}, [isRunning]);

	const resetSimulation = useCallback(() => {
		setIsRunning(false);
		simulationRef.current = {
			time: 0,
			preyPop: 100,
			predatorPop: 20,
			preyTrend: 0,
			predatorTrend: 0,
			ecosystemHealth: "stable",
		};
		setDisplayValues({
			time: 0,
			preyPop: 100,
			predatorPop: 20,
			preyTrend: 0,
			predatorTrend: 0,
			ecosystemHealth: "stable",
		});
		setAllData([]);
		dataPointsRef.current = [];
		setShowAlert(false);
		setChartZoom(1);
		setChartPan(0);
		addToast("🔄 Reset complete", "info");
	}, [addToast]);

	const applyPreset = useCallback((preset) => {
		setIsRunning(false);
		simulationRef.current = {
			time: 0,
			preyPop: preset.params.preyPop,
			predatorPop: preset.params.predatorPop,
			preyTrend: 0,
			predatorTrend: 0,
			ecosystemHealth: "stable",
		};
		setDisplayValues({
			time: 0,
			preyPop: preset.params.preyPop,
			predatorPop: preset.params.predatorPop,
			preyTrend: 0,
			predatorTrend: 0,
			ecosystemHealth: "stable",
		});
		setParams({
			preyBirthRate: preset.params.preyBirthRate,
			predationRate: preset.params.predationRate,
			predationEfficiency: preset.params.predationEfficiency,
			predatorDeathRate: preset.params.predatorDeathRate,
		});
		setAllData([]);
		dataPointsRef.current = [];
		setShowAlert(false);
		setChartZoom(1);
		setChartPan(0);
	});

	const zoomIn = useCallback(
		() => setChartZoom((prev) => Math.min(5, prev * 1.2)),
		[]
	);
	const zoomOut = useCallback(
		() => setChartZoom((prev) => Math.max(0.5, prev / 1.2)),
		[]
	);
	const resetZoom = useCallback(() => {
		setChartZoom(1);
		setChartPan(0);
	}, []);

	const handlePreyBirthRateChange = useCallback(
		(val) => {
			setParams((prev) => ({ ...prev, preyBirthRate: val }));
			if (isRunning) {
			}
		},
		[isRunning, addToast]
	);

	const handlePredationRateChange = useCallback(
		(val) => {
			setParams((prev) => ({ ...prev, predationRate: val }));
			if (isRunning) {
			}
		},
		[isRunning, addToast]
	);

	const handlePredationEfficiencyChange = useCallback(
		(val) => {
			setParams((prev) => ({ ...prev, predationEfficiency: val }));
			if (isRunning) {
			}
		},
		[isRunning, addToast]
	);

	const handlePredatorDeathRateChange = useCallback(
		(val) => {
			setParams((prev) => ({ ...prev, predatorDeathRate: val }));
			if (isRunning) {
			}
		},
		[isRunning, addToast]
	);

	const getEcosystemStyles = useCallback(() => {
		const styles = {
			extinct: {
				bg: darkMode ? "#374151" : "#f3f4f6",
				text: darkMode ? "#d1d5db" : "#6b7280",
				icon: "💀",
				status: "Extinct",
			},
			critical: {
				bg: darkMode ? "#7f1d1d" : "#fef2f2",
				text: darkMode ? "#fca5a5" : "#dc2626",
				icon: "🆘",
				status: "Critical",
			},
			unstable: {
				bg: darkMode ? "#92400e" : "#fffbeb",
				text: darkMode ? "#fbbf24" : "#d97706",
				icon: "⚠️",
				status: "Unstable",
			},
			overpopulation: {
				bg: darkMode ? "#581c87" : "#faf5ff",
				text: darkMode ? "#c084fc" : "#9333ea",
				icon: "📈",
				status: "Overpopulation",
			},
			thriving: {
				bg: darkMode ? "#065f46" : "#ecfdf5",
				text: darkMode ? "#6ee7b7" : "#059669",
				icon: "🌟",
				status: "Thriving",
			},
			stable: {
				bg: darkMode ? "#1e3a8a" : "#eff6ff",
				text: darkMode ? "#93c5fd" : "#2563eb",
				icon: "✅",
				status: "Stable",
			},
		};
		return styles[displayValues.ecosystemHealth] || styles.stable;
	}, [displayValues.ecosystemHealth, darkMode]);

	const ecosystemStyles = getEcosystemStyles();
	const canStart =
		simulationRef.current.preyPop > 0 || simulationRef.current.predatorPop > 0;

	const handleToastClose = useCallback((toastId) => {
		setToasts((prev) => prev.filter((t) => t.id !== toastId));
	}, []);

	const renderContent = () => {
		if (!isDesktop) {
			return (
				<div
					style={{
						minHeight: "100vh",
						background: darkMode
							? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
							: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
						paddingBottom: "80px",
					}}
				>
					{/* Mobile Header */}
					<div
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							backgroundColor: darkMode
								? "rgba(15, 23, 42, 0.9)"
								: "rgba(255, 255, 255, 0.9)",
							backdropFilter: "blur(10px)",
							padding: "16px",
							borderBottom: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
							zIndex: 10,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<div>
								<h1
									style={{
										fontSize: "24px",
										fontWeight: "bold",
										background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										margin: "0",
									}}
								>
									🌿 Ecosystem Dynamics
								</h1>
								<p
									style={{
										fontSize: "14px",
										color: darkMode ? "#9ca3af" : "#6b7280",
										margin: "4px 0 0 0",
									}}
								>
									Predator-Prey Population Simulation
								</p>
							</div>
							<div
								style={{ display: "flex", alignItems: "center", gap: "12px" }}
							>
								<button
									onTouchStart={(e) =>
										handleButtonTouch(e, () => setDarkMode(!darkMode))
									}
									onClick={() => setDarkMode(!darkMode)}
									style={{
										padding: "8px",
										borderRadius: "8px",
										backgroundColor: darkMode ? "#374151" : "#f3f4f6",
										border: "none",
										cursor: "pointer",
										touchAction: "manipulation",
										transition: "all 0.2s ease",
									}}
								>
									{darkMode ? (
										<FaSun size={20} style={{ color: "#fbbf24" }} />
									) : (
										<FaMoon size={20} style={{ color: "#6b7280" }} />
									)}
								</button>
								<div
									style={{
										padding: "8px",
										borderRadius: "8px",
										backgroundColor: ecosystemStyles.bg,
										textAlign: "center",
										transition: "all 0.3s ease",
										boxShadow: darkMode
											? "0 2px 8px rgba(0,0,0,0.2)"
											: "0 2px 8px rgba(0,0,0,0.1)",
									}}
								>
									<div style={{ fontSize: "20px" }}>{ecosystemStyles.icon}</div>
								</div>
							</div>
						</div>
					</div>

					{/* Mobile Alert */}
					{showAlert && (
						<div
							style={{
								margin: "80px 16px 16px 16px",
								padding: "16px",
								backgroundColor: darkMode ? "#7f1d1d" : "#fef2f2",
								border: `1px solid ${darkMode ? "#dc2626" : "#fecaca"}`,
								borderRadius: "12px",
								animation: "slideInUp 0.3s ease",
							}}
						>
							<div
								style={{ display: "flex", alignItems: "center", gap: "12px" }}
							>
								<FaExclamationTriangle size={24} style={{ color: "#ef4444" }} />
								<p
									style={{
										fontSize: "14px",
										color: darkMode ? "#fca5a5" : "#dc2626",
										fontWeight: "500",
										margin: "0",
									}}
								>
									{alertMessage}
								</p>
							</div>
						</div>
					)}

					{/* Mobile Content */}
					<div
						style={{ padding: "16px", marginTop: showAlert ? "0" : "120px" }}
					>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px",
								marginBottom: "16px",
							}}
						>
							<PopulationCard
								type="Prey"
								population={displayValues.preyPop}
								trend={displayValues.preyTrend}
								icon="🦌"
								color="#10b981"
								isDesktop={isDesktop}
								darkMode={darkMode}
								cardStyle={cardStyle}
							/>
							<PopulationCard
								type="Predator"
								population={displayValues.predatorPop}
								trend={displayValues.predatorTrend}
								icon="🐺"
								color="#ef4444"
								isDesktop={isDesktop}
								darkMode={darkMode}
								cardStyle={cardStyle}
							/>
						</div>

						{/* Mobile Chart */}
						<div style={{ ...cardStyle, padding: "16px" }}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									marginBottom: "12px",
								}}
							>
								<h2
									style={{
										fontSize: "18px",
										fontWeight: "600",
										color: darkMode ? "#f3f4f6" : "#374151",
										margin: "0",
									}}
								>
									Population Dynamics
								</h2>
								<div
									style={{ display: "flex", alignItems: "center", gap: "8px" }}
								>
									<button
										onTouchStart={(e) => handleButtonTouch(e, zoomOut)}
										onClick={zoomOut}
										style={{
											padding: "6px",
											borderRadius: "6px",
											backgroundColor: darkMode ? "#374151" : "#f3f4f6",
											border: "none",
											cursor: "pointer",
											color: darkMode ? "#9ca3af" : "#6b7280",
											touchAction: "manipulation",
											transition: "all 0.2s ease",
										}}
									>
										<FaSearchMinus size={12} />
									</button>
									<span
										style={{
											color: darkMode ? "#9ca3af" : "#6b7280",
											fontSize: "10px",
										}}
									>
										{chartZoom.toFixed(1)}x
									</span>
									<button
										onTouchStart={(e) => handleButtonTouch(e, zoomIn)}
										onClick={zoomIn}
										style={{
											padding: "6px",
											borderRadius: "6px",
											backgroundColor: darkMode ? "#374151" : "#f3f4f6",
											border: "none",
											cursor: "pointer",
											color: darkMode ? "#9ca3af" : "#6b7280",
											touchAction: "manipulation",
											transition: "all 0.2s ease",
										}}
									>
										<FaSearchPlus size={12} />
									</button>
									<button
										onTouchStart={(e) => handleButtonTouch(e, resetZoom)}
										onClick={resetZoom}
										style={{
											padding: "6px",
											borderRadius: "6px",
											backgroundColor: darkMode ? "#374151" : "#f3f4f6",
											border: "none",
											cursor: "pointer",
											color: darkMode ? "#9ca3af" : "#6b7280",
											touchAction: "manipulation",
											transition: "all 0.2s ease",
										}}
									>
										<FaRedo size={12} />
									</button>
								</div>
							</div>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "12px",
									fontSize: "12px",
									marginBottom: "12px",
								}}
							>
								<div
									style={{ display: "flex", alignItems: "center", gap: "4px" }}
								>
									<div
										style={{
											width: "12px",
											height: "12px",
											backgroundColor: "#10b981",
											borderRadius: "50%",
										}}
									></div>
									<span style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
										Prey
									</span>
								</div>
								<div
									style={{ display: "flex", alignItems: "center", gap: "4px" }}
								>
									<div
										style={{
											width: "12px",
											height: "12px",
											backgroundColor: "#ef4444",
											borderRadius: "50%",
										}}
									></div>
									<span style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
										Predators
									</span>
								</div>
							</div>

							<OptimizedChart
								data={allData}
								darkMode={darkMode}
								isDesktop={isDesktop}
								chartZoom={chartZoom}
								chartPan={chartPan}
								onTouchStart={handleChartTouchStart}
								onTouchMove={handleChartTouchMove}
								onTouchEnd={handleChartTouchEnd}
							/>

							<div
								style={{
									marginTop: "12px",
									textAlign: "center",
									fontSize: "12px",
									color: darkMode ? "#9ca3af" : "#6b7280",
									backgroundColor: darkMode ? "#374151" : "#f3f4f6",
									borderRadius: "6px",
									padding: "8px",
								}}
							>
								Time: {displayValues.time.toFixed(1)}s • Zoom:{" "}
								{chartZoom.toFixed(1)}x •
								{chartZoom > 1 ? " Drag to pan" : " Pinch to zoom"}
							</div>
						</div>
					</div>

					{/* Mobile fotter */}

					<footer
						style={{
							backgroundColor: darkMode
								? "rgba(15, 23, 42, 0.9)"
								: "rgba(255, 255, 255, 0.9)",
							backdropFilter: "blur(20px)",
							borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
							padding: "24px 16px",
							marginTop: "24px",
							marginBottom: "20px", // Add space for fixed bottom controls
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "24px",
							}}
						>
							{/* Main Description Section */}
							<div>
								<h3
									style={{
										fontSize: "18px",
										fontWeight: "bold",
										background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										margin: "0 0 12px 0",
									}}
								>
									🌿 Ecosystem Dynamics
								</h3>
								<p
									style={{
										color: darkMode ? "#9ca3af" : "#6b7280",
										lineHeight: "1.6",
										margin: "0 0 16px 0",
										fontSize: "14px",
									}}
								>
									An interactive simulation demonstrating predator-prey
									population dynamics using the Lotka-Volterra equations.
									Explore how different parameters affect ecosystem stability
									and evolution.
								</p>
							</div>

							{/* Two Column Layout for Mobile */}
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "24px",
								}}
							>
								{/* Features Column */}
								<div>
									<h4
										style={{
											fontSize: "14px",
											fontWeight: "600",
											color: darkMode ? "#f3f4f6" : "#374151",
											margin: "0 0 12px 0",
										}}
									>
										Features
									</h4>
									<ul
										style={{
											listStyle: "none",
											padding: 0,
											margin: 0,
											color: darkMode ? "#9ca3af" : "#6b7280",
											fontSize: "12px",
										}}
									>
										<li style={{ marginBottom: "6px" }}>
											• Real-time simulation
										</li>
										<li style={{ marginBottom: "6px" }}>
											• Live parameter editing
										</li>
										<li style={{ marginBottom: "6px" }}>
											• Pinch-to-zoom charts
										</li>
										<li style={{ marginBottom: "6px" }}>
											• Predefined scenarios
										</li>
										<li style={{ marginBottom: "6px" }}>• Dark/Light themes</li>
										<li style={{ marginBottom: "6px" }}>• Mobile optimized</li>
									</ul>
								</div>

								{/* Learn More Column */}
								<div>
									<h4
										style={{
											fontSize: "14px",
											fontWeight: "600",
											color: darkMode ? "#f3f4f6" : "#374151",
											margin: "0 0 12px 0",
										}}
									>
										Learn More
									</h4>
									<ul
										style={{
											listStyle: "none",
											padding: 0,
											margin: 0,
											color: darkMode ? "#9ca3af" : "#6b7280",
											fontSize: "12px",
										}}
									>
										<li style={{ marginBottom: "6px" }}>
											• Lotka-Volterra equations
										</li>
										<li style={{ marginBottom: "6px" }}>
											• Population dynamics
										</li>
										<li style={{ marginBottom: "6px" }}>
											• Ecological modeling
										</li>
										<li style={{ marginBottom: "6px" }}>• System stability</li>
										<li style={{ marginBottom: "6px" }}>
											• Mathematical biology
										</li>
									</ul>
								</div>
							</div>

							{/* Bottom Copyright Section */}
							<div
								style={{
									borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
									paddingTop: "16px",
									textAlign: "center",
									color: darkMode ? "#9ca3af" : "#6b7280",
									fontSize: "11px",
								}}
							>
								<p style={{ margin: "0" }}>
									2025 Ecosystem Dynamics Simulator.
								</p>
								<p style={{ margin: "6px 0 0 0" }}>
									Educational tool for understanding predator-prey relationships
									in nature.
								</p>
							</div>
						</div>
					</footer>

					{/* Mobile Drawer */}
					<>
						{drawerOpen && (
							<div
								style={{
									position: "fixed",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: "rgba(0, 0, 0, 0.5)",
									zIndex: 40,
									animation: "fadeIn 0.3s ease",
								}}
								onClick={() => setDrawerOpen(false)}
							/>
						)}

						<button
							onClick={() => setDrawerOpen(!drawerOpen)}
							style={{
								position: "fixed",
								bottom: "90px",
								right: "20px",
								width: "56px",
								height: "56px",
								borderRadius: "28px",
								backgroundColor: "#3b82f6",
								border: "none",
								color: "white",
								cursor: "pointer",
								zIndex: 60,
								boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								transform: drawerOpen ? "rotate(180deg)" : "rotate(0deg)",
								animation: drawerOpen ? "none" : "bounce 2s infinite",
							}}
						>
							<FaCog
								size={20}
								style={{
									transform: drawerOpen ? "rotate(180deg)" : "rotate(0deg)",
									transition: "transform 0.3s ease",
								}}
							/>
						</button>

						<div
							style={{
								position: "fixed",
								bottom: "80px",
								left: 0,
								right: 0,
								height: drawerOpen ? "65vh" : "0",
								backgroundColor: darkMode
									? "rgba(15, 23, 42, 0.98)"
									: "rgba(255, 255, 255, 0.98)",
								backdropFilter: "blur(20px)",
								borderTopLeftRadius: "20px",
								borderTopRightRadius: "20px",
								borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
								zIndex: 50,
								transition:
									"height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
								overflow: "hidden",
								opacity: drawerOpen ? 1 : 0,
							}}
						>
							<div
								style={{
									padding: "24px 16px",
									height: "100%",
									display: "flex",
									flexDirection: "column",
									overflowY: "auto",
								}}
							>
								<div
									style={{
										textAlign: "center",
										fontSize: "14px",
										color: darkMode ? "#9ca3af" : "#6b7280",
										backgroundColor: darkMode ? "#374151" : "#f3f4f6",
										borderRadius: "8px",
										padding: "12px",
										marginBottom: "24px",
										userSelect: "none",
									}}
								>
									Status:{" "}
									<span
										style={{
											fontWeight: "600",
											color: isRunning
												? "#10b981"
												: !canStart
												? "#ef4444"
												: darkMode
												? "#9ca3af"
												: "#6b7280",
											animation: isRunning ? "pulse 2s infinite" : "none",
										}}
									>
										{!canStart
											? "💀 Extinct"
											: isRunning
											? "🟢 Running"
											: "⏸️ Paused"}
									</span>
								</div>

								<div
									style={{
										flex: 1,
										overflowY: "auto",
										paddingRight: "4px",
									}}
								>
									<div style={{ marginBottom: "24px" }}>
										<h3
											style={{
												fontSize: "16px",
												fontWeight: "600",
												color: darkMode ? "#f3f4f6" : "#374151",
												marginBottom: "16px",
												display: "flex",
												alignItems: "center",
												gap: "8px",
												userSelect: "none",
											}}
										>
											⚙️ Parameters{" "}
											{isRunning && (
												<span style={{ fontSize: "12px", color: "#10b981" }}>
													(🔓 Real-time editing enabled!)
												</span>
											)}
										</h3>
										<ParameterSlider
											label="Prey Birth Rate"
											description="How quickly prey reproduce"
											value={params.preyBirthRate}
											onChange={handlePreyBirthRateChange}
											min={0.1}
											max={2.0}
											step={0.01}
											icon="🐰"
											disabled={false}
											darkMode={darkMode}
											cardStyle={cardStyle}
										/>
										<ParameterSlider
											label="Predation Rate"
											description="Hunting efficiency"
											value={params.predationRate}
											onChange={handlePredationRateChange}
											min={0.001}
											max={0.05}
											step={0.001}
											icon="🎯"
											disabled={false}
											darkMode={darkMode}
											cardStyle={cardStyle}
										/>
										<ParameterSlider
											label="Predation Efficiency"
											description="Predator reproduction rate"
											value={params.predationEfficiency}
											onChange={handlePredationEfficiencyChange}
											min={0.001}
											max={0.02}
											step={0.001}
											icon="⚡"
											disabled={false}
											darkMode={darkMode}
											cardStyle={cardStyle}
										/>
										<ParameterSlider
											label="Predator Death Rate"
											description="Natural mortality rate"
											value={params.predatorDeathRate}
											onChange={handlePredatorDeathRateChange}
											min={0.1}
											max={1.0}
											step={0.01}
											icon="💀"
											disabled={false}
											darkMode={darkMode}
											cardStyle={cardStyle}
										/>
									</div>

									<div>
										<h3
											style={{
												fontSize: "16px",
												fontWeight: "600",
												color: darkMode ? "#f3f4f6" : "#374151",
												marginBottom: "16px",
												display: "flex",
												alignItems: "center",
												gap: "8px",
												userSelect: "none",
											}}
										>
											🎯 Scenario Presets
										</h3>
										{presets.map((preset, index) => (
											<button
												key={`preset-mobile-${index}`}
												onTouchStart={(e) =>
													handleButtonTouch(e, () => applyPreset(preset))
												}
												onClick={() => applyPreset(preset)}
												disabled={isRunning}
												style={{
													width: "100%",
													textAlign: "left",
													padding: "16px",
													marginBottom: "12px",
													borderRadius: "12px",
													...cardStyle,
													cursor: isRunning ? "not-allowed" : "pointer",
													border: "none",
													touchAction: "manipulation",
													userSelect: "none",
													opacity: isRunning ? 0.5 : 1,
												}}
											>
												<div
													style={{
														fontWeight: "600",
														color: darkMode ? "#f3f4f6" : "#374151",
														marginBottom: "4px",
													}}
												>
													{preset.name}
												</div>
												<div
													style={{
														fontSize: "12px",
														color: darkMode ? "#9ca3af" : "#6b7280",
													}}
												>
													{preset.description}
												</div>
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
					</>

					{/* Mobile Controls */}
					<div
						style={{
							position: "fixed",
							bottom: 0,
							left: 0,
							right: 0,
							backgroundColor: darkMode
								? "rgba(15, 23, 42, 0.95)"
								: "rgba(255, 255, 255, 0.95)",
							backdropFilter: "blur(20px)",
							borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
							padding: "16px",
							zIndex: 30,
							display: "flex",
							gap: "12px",
						}}
					>
						<button
							onTouchStart={(e) => handleButtonTouch(e, toggleSimulation)}
							onClick={toggleSimulation}
							disabled={!canStart}
							style={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
								padding: "16px",
								borderRadius: "12px",
								fontWeight: "600",
								fontSize: "14px",
								color: "white",
								border: "none",
								cursor: canStart ? "pointer" : "not-allowed",
								background: !canStart
									? "#9ca3af"
									: isRunning
									? "linear-gradient(135deg, #ef4444, #dc2626)"
									: "linear-gradient(135deg, #10b981, #059669)",
								boxShadow: canStart ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
								touchAction: "manipulation",
								userSelect: "none",
								transition: "all 0.2s ease",
							}}
						>
							{isRunning ? <FaPause size={16} /> : <FaPlay size={16} />}
							{!canStart ? "Extinct" : isRunning ? "Pause" : "Start"}
						</button>

						<button
							onTouchStart={(e) => handleButtonTouch(e, resetSimulation)}
							onClick={resetSimulation}
							style={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
								padding: "16px",
								borderRadius: "12px",
								fontWeight: "600",
								fontSize: "14px",
								color: darkMode ? "#f3f4f6" : "#374151",
								border: "none",
								cursor: "pointer",
								background: darkMode
									? "linear-gradient(135deg, #374151, #4b5563)"
									: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
								boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
								touchAction: "manipulation",
								userSelect: "none",
								transition: "all 0.2s ease",
							}}
						>
							<FaRedo size={16} />
							Reset
						</button>
					</div>
				</div>
			);
		}

		// Desktop Layout
		return (
			<div
				style={{
					minHeight: "100vh",
					background: darkMode
						? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
						: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<div style={{ display: "flex", flex: 1 }}>
					<div
						style={{
							flex: 1,
							padding: "24px",
							display: "flex",
							flexDirection: "column",
						}}
					>
						{/* Desktop Header */}
						<div
							style={{
								...cardStyle,
								padding: "24px",
								marginBottom: "24px",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<div>
									<h1
										style={{
											fontSize: "32px",
											fontWeight: "bold",
											background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
											margin: "0 0 8px 0",
										}}
									>
										🌿 Ecosystem Dynamics
									</h1>
									<p
										style={{
											color: darkMode ? "#9ca3af" : "#6b7280",
											margin: "0",
										}}
									>
										Interactive Predator-Prey Population Simulation
									</p>
								</div>
								<div
									style={{ display: "flex", alignItems: "center", gap: "16px" }}
								>
									<button
										onClick={() => setDarkMode(!darkMode)}
										style={{
											padding: "12px",
											borderRadius: "12px",
											backgroundColor: darkMode ? "#374151" : "#f3f4f6",
											border: "none",
											cursor: "pointer",
											boxShadow: darkMode
												? "0 4px 12px rgba(0,0,0,0.3)"
												: "0 4px 12px rgba(0,0,0,0.1)",
											transition: "all 0.2s ease",
										}}
									>
										{darkMode ? (
											<FaSun size={24} style={{ color: "#fbbf24" }} />
										) : (
											<FaMoon size={24} style={{ color: "#6b7280" }} />
										)}
									</button>
									<div
										style={{
											padding: "12px",
											borderRadius: "12px",
											backgroundColor: ecosystemStyles.bg,
											textAlign: "center",
											boxShadow: darkMode
												? "0 4px 12px rgba(0,0,0,0.3)"
												: "0 4px 12px rgba(0,0,0,0.1)",
											transition: "all 0.3s ease",
											minWidth: "100px",
										}}
									>
										<div style={{ fontSize: "24px" }}>
											{ecosystemStyles.icon}
										</div>
										<div
											style={{
												fontSize: "14px",
												fontWeight: "bold",
												color: ecosystemStyles.text,
												marginTop: "4px",
											}}
										>
											{ecosystemStyles.status}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Desktop Alert */}
						{showAlert && (
							<div
								style={{
									marginBottom: "24px",
									padding: "16px",
									backgroundColor: darkMode ? "#7f1d1d" : "#fef2f2",
									border: `1px solid ${darkMode ? "#dc2626" : "#fecaca"}`,
									borderRadius: "12px",
									animation: "slideInUp 0.3s ease",
								}}
							>
								<div
									style={{ display: "flex", alignItems: "center", gap: "12px" }}
								>
									<FaExclamationTriangle
										size={24}
										style={{ color: "#ef4444" }}
									/>
									<p
										style={{
											color: darkMode ? "#fca5a5" : "#dc2626",
											fontWeight: "500",
											margin: "0",
										}}
									>
										{alertMessage}
									</p>
								</div>
							</div>
						)}

						{/* Desktop Population Cards */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "24px",
								marginBottom: "24px",
							}}
						>
							<PopulationCard
								type="Prey"
								population={displayValues.preyPop}
								trend={displayValues.preyTrend}
								icon="🦌"
								color="#10b981"
								isDesktop={isDesktop}
								darkMode={darkMode}
								cardStyle={cardStyle}
							/>
							<PopulationCard
								type="Predator"
								population={displayValues.predatorPop}
								trend={displayValues.predatorTrend}
								icon="🐺"
								color="#ef4444"
								isDesktop={isDesktop}
								darkMode={darkMode}
								cardStyle={cardStyle}
							/>
						</div>

						{/* Desktop Chart */}
						<div
							style={{
								...cardStyle,
								padding: "24px",
								flex: 1,
								display: "flex",
								flexDirection: "column",
								minHeight: 0,
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									marginBottom: "24px",
								}}
							>
								<h2
									style={{
										fontSize: "20px",
										fontWeight: "600",
										color: darkMode ? "#f3f4f6" : "#374151",
										margin: "0",
									}}
								>
									Population Dynamics
								</h2>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "16px",
										fontSize: "14px",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										<div
											style={{
												width: "16px",
												height: "16px",
												backgroundColor: "#10b981",
												borderRadius: "50%",
											}}
										></div>
										<span style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
											Prey
										</span>
									</div>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										<div
											style={{
												width: "16px",
												height: "16px",
												backgroundColor: "#ef4444",
												borderRadius: "50%",
											}}
										></div>
										<span style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
											Predators
										</span>
									</div>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										<button
											onClick={zoomOut}
											style={{
												padding: "8px",
												borderRadius: "8px",
												backgroundColor: darkMode ? "#374151" : "#f3f4f6",
												border: "none",
												cursor: "pointer",
												color: darkMode ? "#9ca3af" : "#6b7280",
												transition: "all 0.2s ease",
											}}
										>
											<FaSearchMinus size={14} />
										</button>
										<span
											style={{
												color: darkMode ? "#9ca3af" : "#6b7280",
												fontSize: "12px",
											}}
										>
											{chartZoom.toFixed(1)}x
										</span>
										<button
											onClick={zoomIn}
											style={{
												padding: "8px",
												borderRadius: "8px",
												backgroundColor: darkMode ? "#374151" : "#f3f4f6",
												border: "none",
												cursor: "pointer",
												color: darkMode ? "#9ca3af" : "#6b7280",
												transition: "all 0.2s ease",
											}}
										>
											<FaSearchPlus size={14} />
										</button>
										<button
											onClick={resetZoom}
											style={{
												padding: "8px",
												borderRadius: "8px",
												backgroundColor: darkMode ? "#374151" : "#f3f4f6",
												border: "none",
												cursor: "pointer",
												color: darkMode ? "#9ca3af" : "#6b7280",
												transition: "all 0.2s ease",
											}}
										>
											<FaRedo size={14} />
										</button>
									</div>
								</div>
							</div>

							<div
								style={{
									flex: 1,
									minHeight: 0,
									display: "flex",
									flexDirection: "column",
								}}
							>
								<OptimizedChart
									data={allData}
									darkMode={darkMode}
									isDesktop={isDesktop}
									chartZoom={chartZoom}
									chartPan={chartPan}
									onTouchStart={handleChartTouchStart}
									onTouchMove={handleChartTouchMove}
									onTouchEnd={handleChartTouchEnd}
								/>
							</div>

							<div
								style={{
									marginTop: "16px",
									textAlign: "center",
									fontSize: "14px",
									color: darkMode ? "#9ca3af" : "#6b7280",
									backgroundColor: darkMode ? "#374151" : "#f3f4f6",
									borderRadius: "8px",
									padding: "12px",
								}}
							>
								Time: {displayValues.time.toFixed(1)}s
							</div>
						</div>
					</div>

					{/* Desktop Sidebar */}
					<div
						style={{
							width: "384px",
							height: "100vh",
							position: "sticky",
							top: 0,
							backgroundColor: darkMode
								? "rgba(15, 23, 42, 0.8)"
								: "rgba(255, 255, 255, 0.8)",
							backdropFilter: "blur(20px)",
							borderLeft: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
							boxShadow: darkMode
								? "-8px 0 32px rgba(0,0,0,0.3)"
								: "-8px 0 32px rgba(0,0,0,0.1)",
							display: "flex",
							flexDirection: "column",
							overflowY: "auto",
						}}
					>
						<div style={{ padding: "24px" }}>
							<div style={{ marginBottom: "32px" }}>
								<h3
									style={{
										fontSize: "18px",
										fontWeight: "600",
										color: darkMode ? "#f3f4f6" : "#374151",
										marginBottom: "16px",
									}}
								>
									Simulation Controls
								</h3>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "12px",
									}}
								>
									<button
										onClick={toggleSimulation}
										disabled={!canStart}
										style={{
											width: "100%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											gap: "12px",
											padding: "16px 24px",
											borderRadius: "12px",
											fontWeight: "600",
											color: "white",
											border: "none",
											cursor: canStart ? "pointer" : "not-allowed",
											background: !canStart
												? "#9ca3af"
												: isRunning
												? "linear-gradient(135deg, #ef4444, #dc2626)"
												: "linear-gradient(135deg, #10b981, #059669)",
											boxShadow: canStart
												? "0 4px 12px rgba(0,0,0,0.2)"
												: "none",
											transition: "all 0.2s ease",
										}}
									>
										{isRunning ? <FaPause size={20} /> : <FaPlay size={20} />}
										{!canStart
											? "Extinct"
											: isRunning
											? "Pause Simulation"
											: "Start Simulation"}
									</button>

									<button
										onClick={resetSimulation}
										style={{
											width: "100%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											gap: "12px",
											padding: "16px 24px",
											borderRadius: "12px",
											fontWeight: "600",
											color: darkMode ? "#f3f4f6" : "#374151",
											border: "none",
											cursor: "pointer",
											background: darkMode
												? "linear-gradient(135deg, #374151, #4b5563)"
												: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
											boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
											transition: "all 0.2s ease",
										}}
									>
										<FaRedo size={20} />
										Reset Simulation
									</button>
								</div>

								<div
									style={{
										marginTop: "16px",
										textAlign: "center",
										fontSize: "14px",
										color: darkMode ? "#9ca3af" : "#6b7280",
										backgroundColor: darkMode ? "#374151" : "#f3f4f6",
										borderRadius: "12px",
										padding: "16px",
									}}
								>
									Status:{" "}
									<span
										style={{
											fontWeight: "600",
											color: isRunning
												? "#10b981"
												: !canStart
												? "#ef4444"
												: darkMode
												? "#9ca3af"
												: "#6b7280",
											animation: isRunning ? "pulse 2s infinite" : "none",
										}}
									>
										{!canStart
											? "💀 Extinct"
											: isRunning
											? "🟢 Running"
											: "⏸️ Paused"}
									</span>
								</div>
							</div>

							<div style={{ marginBottom: "32px" }}>
								<h3
									style={{
										fontSize: "18px",
										fontWeight: "600",
										color: darkMode ? "#f3f4f6" : "#374151",
										marginBottom: "16px",
									}}
								>
									Parameters{" "}
									{isRunning && (
										<span style={{ fontSize: "14px", color: "#10b981" }}>
											(🔓 Real-time!)
										</span>
									)}
								</h3>
								<ParameterSlider
									label="Prey Birth Rate"
									description="How quickly prey reproduce"
									value={params.preyBirthRate}
									onChange={handlePreyBirthRateChange}
									min={0.1}
									max={2.0}
									step={0.01}
									icon="🐰"
									disabled={false}
									darkMode={darkMode}
									cardStyle={cardStyle}
								/>
								<ParameterSlider
									label="Predation Rate"
									description="Hunting efficiency"
									value={params.predationRate}
									onChange={handlePredationRateChange}
									min={0.001}
									max={0.05}
									step={0.001}
									icon="🎯"
									disabled={false}
									darkMode={darkMode}
									cardStyle={cardStyle}
								/>
								<ParameterSlider
									label="Predation Efficiency"
									description="Predator reproduction rate"
									value={params.predationEfficiency}
									onChange={handlePredationEfficiencyChange}
									min={0.001}
									max={0.02}
									step={0.001}
									icon="⚡"
									disabled={false}
									darkMode={darkMode}
									cardStyle={cardStyle}
								/>
								<ParameterSlider
									label="Predator Death Rate"
									description="Natural mortality rate"
									value={params.predatorDeathRate}
									onChange={handlePredatorDeathRateChange}
									min={0.1}
									max={1.0}
									step={0.01}
									icon="💀"
									disabled={false}
									darkMode={darkMode}
									cardStyle={cardStyle}
								/>
							</div>

							<div>
								<h3
									style={{
										fontSize: "18px",
										fontWeight: "600",
										color: darkMode ? "#f3f4f6" : "#374151",
										marginBottom: "16px",
									}}
								>
									Scenario Presets
								</h3>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "12px",
									}}
								>
									{presets.map((preset, index) => (
										<button
											key={`preset-desktop-${index}`}
											onClick={() => applyPreset(preset)}
											disabled={false}
											style={{
												width: "100%",
												textAlign: "left",
												padding: "16px",
												borderRadius: "12px",
												...cardStyle,
												cursor: "pointer",
												border: "none",
												transition: "all 0.2s ease",
												opacity: 1,
											}}
										>
											<div
												style={{
													fontWeight: "600",
													color: darkMode ? "#f3f4f6" : "#374151",
													marginBottom: "4px",
												}}
											>
												{preset.name}
											</div>
											<div
												style={{
													fontSize: "12px",
													color: darkMode ? "#9ca3af" : "#6b7280",
												}}
											>
												{preset.description}
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<footer
					style={{
						backgroundColor: darkMode
							? "rgba(15, 23, 42, 0.9)"
							: "rgba(255, 255, 255, 0.9)",
						backdropFilter: "blur(20px)",
						borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
						padding: "32px 24px",
						marginTop: "24px",
					}}
				>
					<div
						style={{
							maxWidth: "1200px",
							margin: "0 auto",
							display: "grid",
							gridTemplateColumns: "2fr 1fr 1fr",
							gap: "48px",
						}}
					>
						<div>
							<h3
								style={{
									fontSize: "20px",
									fontWeight: "bold",
									background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									margin: "0 0 16px 0",
								}}
							>
								🌿 Ecosystem Dynamics
							</h3>
							<p
								style={{
									color: darkMode ? "#9ca3af" : "#6b7280",
									lineHeight: "1.6",
									margin: "0 0 16px 0",
									fontSize: "14px",
								}}
							>
								An interactive simulation demonstrating predator-prey population
								dynamics using the Lotka-Volterra equations. Explore how
								different parameters affect ecosystem stability and evolution.
							</p>
						</div>

						<div>
							<h4
								style={{
									fontSize: "16px",
									fontWeight: "600",
									color: darkMode ? "#f3f4f6" : "#374151",
									margin: "0 0 16px 0",
								}}
							>
								Features
							</h4>
							<ul
								style={{
									listStyle: "none",
									padding: 0,
									margin: 0,
									color: darkMode ? "#9ca3af" : "#6b7280",
									fontSize: "14px",
								}}
							>
								<li style={{ marginBottom: "8px" }}>• Real-time simulation</li>
								<li style={{ marginBottom: "8px" }}>
									• Live parameter editing
								</li>
								<li style={{ marginBottom: "8px" }}>• Pinch-to-zoom charts</li>
								<li style={{ marginBottom: "8px" }}>• Predefined scenarios</li>
								<li style={{ marginBottom: "8px" }}>• Dark/Light themes</li>
								<li style={{ marginBottom: "8px" }}>• Mobile optimized</li>
							</ul>
						</div>

						<div>
							<h4
								style={{
									fontSize: "16px",
									fontWeight: "600",
									color: darkMode ? "#f3f4f6" : "#374151",
									margin: "0 0 16px 0",
								}}
							>
								Learn More
							</h4>
							<ul
								style={{
									listStyle: "none",
									padding: 0,
									margin: 0,
									color: darkMode ? "#9ca3af" : "#6b7280",
									fontSize: "14px",
								}}
							>
								<li style={{ marginBottom: "8px" }}>
									• Lotka-Volterra equations
								</li>
								<li style={{ marginBottom: "8px" }}>• Population dynamics</li>
								<li style={{ marginBottom: "8px" }}>• Ecological modeling</li>
								<li style={{ marginBottom: "8px" }}>• System stability</li>
								<li style={{ marginBottom: "8px" }}>• Mathematical biology</li>
							</ul>
						</div>
					</div>

					<div
						style={{
							borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
							marginTop: "24px",
							paddingTop: "24px",
							textAlign: "center",
							color: darkMode ? "#9ca3af" : "#6b7280",
							fontSize: "12px",
						}}
					>
						<p style={{ margin: "0" }}>2025 Ecosystem Dynamics Simulator.</p>
						<p style={{ margin: "8px 0 0 0" }}>
							Educational tool for understanding predator-prey relationships in
							nature.
						</p>
					</div>
				</footer>
			</div>
		);
	};

	return (
		<div>
			<style>
				{`
          @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Pontano+Sans:wght@300..700&display=swap');
          body { 
            font-family: "Pontano Sans", sans-serif; 
            overscroll-behavior-y: contain;
          }
          h1, h2, h3, h4, h5, h6 { font-family: "Marcellus", serif; }
          
          input[type="range"] {
            background: transparent;
          }
          
          input[type="range"]::-webkit-slider-track {
            width: 100%;
            height: ${isDesktop ? "8px" : "12px"};
            cursor: pointer;
            background: ${darkMode ? "#4b5563" : "#e5e7eb"};
            border-radius: ${isDesktop ? "4px" : "6px"};
          }
          
          input[type="range"]::-webkit-slider-thumb {
            height: ${isDesktop ? "20px" : "24px"};
            width: ${isDesktop ? "20px" : "24px"};
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            cursor: pointer;
            -webkit-appearance: none;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            margin-top: ${isDesktop ? "0" : "-6px"};
          }
          
          input[type="range"]::-webkit-slider-thumb:active {
            transform: scale(1.2);
          }
          
          input[type="range"]:disabled::-webkit-slider-thumb {
            background: #9ca3af;
            cursor: not-allowed;
          }
          
          input[type="range"]::-moz-range-track {
            width: 100%;
            height: ${isDesktop ? "8px" : "12px"};
            cursor: pointer;
            background: ${darkMode ? "#4b5563" : "#e5e7eb"};
            border-radius: ${isDesktop ? "4px" : "6px"};
            border: none;
          }
          
          input[type="range"]::-moz-range-thumb {
            height: ${isDesktop ? "20px" : "24px"};
            width: ${isDesktop ? "20px" : "24px"};
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }

          @keyframes toastSlideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes toastSlideOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
            40%, 43% { transform: translateY(-8px); }
            70% { transform: translateY(-4px); }
            90% { transform: translateY(-2px); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes numberCounter {
            from { transform: scale(1.1); }
            to { transform: scale(1); }
          }
        `}
			</style>

			{/* Toast Container */}
			<div
				style={{
					position: "fixed",
					top: "20px",
					right: "20px",
					zIndex: 1000,
					maxWidth: "300px",
					pointerEvents: "none",
				}}
			>
				{toasts.map((toast) => (
					<div key={toast.id} style={{ pointerEvents: "auto" }}>
						<Toast
							toast={toast}
							onClose={() => handleToastClose(toast.id)}
							darkMode={darkMode}
						/>
					</div>
				))}
			</div>

			{renderContent()}
		</div>
	);
};

export default EcosystemSimulator;
