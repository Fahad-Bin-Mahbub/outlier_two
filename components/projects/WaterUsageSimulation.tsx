"use client";
import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	ReactNode,
	useRef,
} from "react";
import {
	Sun,
	Moon,
	ArrowRight,
	ArrowDown,
	Plus,
	Minus,
	Check,
	RefreshCw,
	Save,
	Download,
	Droplet,
	Home,
	Mail,
	Phone,
	Info,
	ExternalLink,
	Twitter,
	Facebook,
	Instagram,
	Linkedin,
	Award,
	Coffee,
	Users,
	Briefcase,
	ChevronDown,
	ChevronUp,
	ThumbsUp,
	Zap,
	Heart,
	Star,
	X,
	AlertTriangle,
} from "lucide-react";

type ThemeContextType = {
	isDarkMode: boolean;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	isDarkMode: false,
	toggleTheme: () => {},
});

const useTheme = () => {
	return useContext(ThemeContext);
};

type HouseholdData = {
	residents: number;
	bathrooms: number;
	hasGarden: boolean;
	hasDishwasher: boolean;
	washingFrequency: number;
	showerDuration: number;
};

type UsageProjection = {
	daily: number;
	weekly: number;
	monthly: number;
	yearly: number;
	byCategory: {
		shower: number;
		toilet: number;
		washing: number;
		dishes: number;
		drinking: number;
		garden: number;
	};
};

type SavedTip = {
	id: string;
	text: string;
	category?: string;
	saved: boolean;
};

const WATER_USAGE = {
	SHOWER_PER_MINUTE: 10,
	TOILET_FLUSH: 6,
	WASHING_MACHINE: 45,
	DISHWASHER: 15,
	HANDWASHING_DISHES: 30,
	DRINKING_PER_PERSON: 2,
	GARDEN_WATERING: 20,
	AVERAGE_TOILET_USES_PER_DAY: 5,
};

const COMMUNITY_AVERAGES = {
	DAILY_PER_PERSON: 150,
	SHOWER_DURATION: 8,
	WASHING_FREQUENCY: 3,
};

const calculateWaterUsage = (data: HouseholdData): UsageProjection => {
	const showerUsage =
		data.showerDuration * WATER_USAGE.SHOWER_PER_MINUTE * data.residents;
	const toiletUsage =
		WATER_USAGE.TOILET_FLUSH *
		WATER_USAGE.AVERAGE_TOILET_USES_PER_DAY *
		data.residents;
	const washingUsage =
		(data.washingFrequency * WATER_USAGE.WASHING_MACHINE) / 7;
	const dishesUsage = data.hasDishwasher
		? WATER_USAGE.DISHWASHER
		: WATER_USAGE.HANDWASHING_DISHES;
	const drinkingUsage = WATER_USAGE.DRINKING_PER_PERSON * data.residents;
	const gardenUsage = data.hasGarden ? WATER_USAGE.GARDEN_WATERING : 0;

	const dailyTotal =
		showerUsage +
		toiletUsage +
		washingUsage +
		dishesUsage +
		drinkingUsage +
		gardenUsage;

	return {
		daily: dailyTotal,
		weekly: dailyTotal * 7,
		monthly: dailyTotal * 30,
		yearly: dailyTotal * 365,
		byCategory: {
			shower: showerUsage,
			toilet: toiletUsage,
			washing: washingUsage,
			dishes: dishesUsage,
			drinking: drinkingUsage,
			garden: gardenUsage,
		},
	};
};

const generateRecommendations = (
	data: HouseholdData,
	usage: UsageProjection
): string[] => {
	const recommendations: string[] = [];

	if (data.showerDuration > COMMUNITY_AVERAGES.SHOWER_DURATION) {
		recommendations.push(
			`Reducing shower time from ${data.showerDuration} to ${
				COMMUNITY_AVERAGES.SHOWER_DURATION
			} minutes could save ${
				(data.showerDuration - COMMUNITY_AVERAGES.SHOWER_DURATION) *
				WATER_USAGE.SHOWER_PER_MINUTE *
				data.residents *
				30
			} liters per month.`
		);
	}

	if (!data.hasDishwasher) {
		recommendations.push(
			`Using a dishwasher instead of hand washing could save up to ${
				(WATER_USAGE.HANDWASHING_DISHES - WATER_USAGE.DISHWASHER) * 30
			} liters per month.`
		);
	}

	if (data.washingFrequency > COMMUNITY_AVERAGES.WASHING_FREQUENCY) {
		recommendations.push(
			`Reducing laundry frequency could save ${
				(data.washingFrequency - COMMUNITY_AVERAGES.WASHING_FREQUENCY) *
				WATER_USAGE.WASHING_MACHINE *
				4
			} liters per month.`
		);
	}

	if (data.hasGarden) {
		recommendations.push(
			"Installing a rain barrel could save up to 1,000 liters of water monthly during rainy seasons."
		);
		recommendations.push(
			"Using drought-resistant plants in your garden can reduce water needs by up to 50%."
		);
	}

	recommendations.push(
		"Installing low-flow showerheads can reduce shower water usage by up to 40%."
	);

	return recommendations;
};

const formatNumber = (num: number): string => {
	return num.toFixed(1).replace(/\.0$/, "");
};

const Toast = ({
	message,
	type = "success",
	onClose,
}: {
	message: string;
	type?: "success" | "info" | "warning" | "error";
	onClose: () => void;
}) => {
	const { isDarkMode } = useTheme();

	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	const bgColors = {
		success: isDarkMode ? "bg-green-800" : "bg-green-100",
		info: isDarkMode ? "bg-blue-800" : "bg-blue-100",
		warning: isDarkMode ? "bg-yellow-800" : "bg-yellow-100",
		error: isDarkMode ? "bg-red-800" : "bg-red-100",
	};

	const textColors = {
		success: isDarkMode ? "text-green-200" : "text-green-800",
		info: isDarkMode ? "text-blue-200" : "text-blue-800",
		warning: isDarkMode ? "text-yellow-200" : "text-yellow-800",
		error: isDarkMode ? "text-red-200" : "text-red-800",
	};

	const icons = {
		success: <Check className="h-5 w-5" />,
		info: <Info className="h-5 w-5" />,
		warning: <AlertTriangle className="h-5 w-5" />,
		error: <X className="h-5 w-5" />,
	};

	return (
		<div
			className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${bgColors[type]} max-w-xs animate-fade-in-up`}
		>
			<div className={`mr-3 ${textColors[type]}`}>{icons[type]}</div>
			<div className={`${textColors[type]} text-sm font-medium mr-3`}>
				{message}
			</div>
			<button
				onClick={onClose}
				className={`ml-auto -mx-1.5 -my-1.5 ${textColors[type]} hover:${textColors[type]} rounded-lg p-1.5 focus:outline-none`}
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
};

const Card = ({
	children,
	className = "",
	hoverEffect = false,
	onClick,
}: {
	children: ReactNode;
	className?: string;
	hoverEffect?: boolean;
	onClick?: () => void;
}) => {
	const { isDarkMode } = useTheme();

	return (
		<div
			onClick={onClick}
			className={`rounded-xl p-6 transition-all duration-300 ${
				hoverEffect
					? isDarkMode
						? "hover:shadow-lg hover:shadow-blue-900/20 hover:translate-y-[-4px]"
						: "hover:shadow-xl hover:shadow-blue-900/15 hover:translate-y-[-4px]"
					: ""
			} ${
				isDarkMode
					? "bg-gray-800 shadow-lg shadow-gray-900/30 border border-gray-700"
					: "bg-white shadow-lg shadow-blue-900/10"
			} ${className} ${onClick ? "cursor-pointer" : ""}`}
			style={
				isDarkMode
					? {
							boxShadow:
								"inset 3px 3px 5px rgba(0, 0, 0, 0.2), inset -3px -3px 5px rgba(255, 255, 255, 0.05)",
					  }
					: {
							boxShadow:
								"8px 8px 16px rgba(174, 174, 192, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.6)",
					  }
			}
		>
			{children}
		</div>
	);
};

const Button = ({
	children,
	onClick,
	variant = "primary",
	className = "",
	icon,
	fullWidth = false,
	disabled = false,
}: {
	children: ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary" | "outline" | "tertiary" | "success";
	className?: string;
	icon?: ReactNode;
	fullWidth?: boolean;
	disabled?: boolean;
}) => {
	const { isDarkMode } = useTheme();

	const baseClasses = `${
		fullWidth ? "w-full" : ""
	} flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
		disabled ? "opacity-50 cursor-not-allowed" : ""
	}`;

	const neumorphicStyles = {
		primary: isDarkMode
			? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-inner"
			: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg",
		secondary: isDarkMode
			? "bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800 shadow-inner"
			: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 shadow-md",
		outline: isDarkMode
			? "border-2 border-blue-500 bg-transparent text-blue-400 hover:bg-blue-900/20"
			: "border-2 border-blue-500 bg-transparent text-blue-600 hover:bg-blue-50",
		tertiary: isDarkMode
			? "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"
			: "bg-purple-500 text-white hover:bg-purple-600 active:bg-purple-700 shadow-md hover:shadow-lg",
		success: isDarkMode
			? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
			: "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-md hover:shadow-lg",
	};

	return (
		<button
			onClick={disabled ? undefined : onClick}
			className={`${baseClasses} ${neumorphicStyles[variant]} ${className}`}
			style={
				variant === "primary" && !isDarkMode
					? {
							boxShadow:
								"3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.7)",
					  }
					: {}
			}
			disabled={disabled}
		>
			{icon && <span className="flex items-center">{icon}</span>}
			{children}
		</button>
	);
};

const NeumorphicSlider = ({
	value,
	onChange,
	min,
	max,
	step = 1,
	label,
	unit = "",
}: {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step?: number;
	label: string;
	unit?: string;
}) => {
	const { isDarkMode } = useTheme();

	return (
		<div className="mb-4">
			<div className="flex items-center justify-between mb-3">
				<label className="text-sm font-medium">{label}</label>
				<div
					className={`px-3 py-1 text-sm font-bold rounded-lg ${
						isDarkMode ? "bg-gray-700" : "bg-blue-50"
					}`}
				>
					{value}
					{unit && unit}
				</div>
			</div>
			<div className="relative flex items-center">
				<button
					onClick={() => value > min && onChange(value - step)}
					className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
						isDarkMode
							? "bg-gray-700 text-gray-300 hover:bg-gray-600"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200"
					}`}
					style={
						!isDarkMode
							? {
									boxShadow:
										"3px 3px 5px rgba(174, 174, 192, 0.2), -3px -3px 5px rgba(255, 255, 255, 0.7)",
							  }
							: {}
					}
				>
					<Minus size={16} />
				</button>
				<div
					className={`relative w-full h-2 rounded-lg overflow-hidden ${
						isDarkMode ? "bg-gray-700" : "bg-gray-200"
					}`}
					style={
						!isDarkMode
							? {
									boxShadow:
										"inset 2px 2px 4px rgba(174, 174, 192, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.7)",
							  }
							: {}
					}
				>
					<input
						type="range"
						min={min}
						max={max}
						step={step}
						value={value}
						onChange={(e) => onChange(parseFloat(e.target.value))}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					/>
					<div
						className={`h-full ${isDarkMode ? "bg-blue-600" : "bg-blue-500"}`}
						style={{ width: `${((value - min) / (max - min)) * 100}%` }}
					/>
					<div
						className={`absolute top-1/2 h-4 w-4 -mt-2 rounded-full ${
							isDarkMode ? "bg-blue-400" : "bg-blue-600"
						}`}
						style={{
							left: `calc(${((value - min) / (max - min)) * 100}% - 8px)`,
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
							transition: "left 0.1s ease-out",
						}}
					/>
				</div>
				<button
					onClick={() => value < max && onChange(value + step)}
					className={`ml-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
						isDarkMode
							? "bg-gray-700 text-gray-300 hover:bg-gray-600"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200"
					}`}
					style={
						!isDarkMode
							? {
									boxShadow:
										"3px 3px 5px rgba(174, 174, 192, 0.2), -3px -3px 5px rgba(255, 255, 255, 0.7)",
							  }
							: {}
					}
				>
					<Plus size={16} />
				</button>
			</div>
		</div>
	);
};

const NeumorphicToggle = ({
	label,
	value,
	onChange,
}: {
	label: string;
	value: boolean;
	onChange: (value: boolean) => void;
}) => {
	const { isDarkMode } = useTheme();

	return (
		<div className="flex items-center justify-between mb-5">
			<span className="text-sm font-medium">{label}</span>
			<button
				onClick={() => onChange(!value)}
				className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
					value
						? isDarkMode
							? "bg-blue-600"
							: "bg-blue-500"
						: isDarkMode
						? "bg-gray-700"
						: "bg-gray-300"
				}`}
				style={
					!isDarkMode
						? {
								boxShadow:
									"inset 2px 2px 3px rgba(0, 0, 0, 0.1), inset -2px -2px 3px rgba(255, 255, 255, 0.5)",
						  }
						: {}
				}
			>
				<span
					className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
						value ? "translate-x-8" : "translate-x-0.5"
					}`}
					style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }}
				>
					{value && (
						<Check size={14} className="text-blue-500 absolute top-1 left-1" />
					)}
				</span>
			</button>
		</div>
	);
};

const AnimatedWaves = ({ percentage = 50 }: { percentage?: number }) => {
	const { isDarkMode } = useTheme();

	const waterLevel = Math.min(100, Math.max(0, percentage));

	return (
		<div className="relative h-48 w-48 mx-auto overflow-hidden rounded-full">
			{}
			<div
				className="absolute inset-0 rounded-full"
				style={
					!isDarkMode
						? {
								boxShadow:
									"inset 6px 6px 12px rgba(174, 174, 192, 0.4), inset -6px -6px 12px rgba(255, 255, 255, 0.8)",
						  }
						: {
								boxShadow:
									"inset 6px 6px 12px rgba(0, 0, 0, 0.3), inset -6px -6px 12px rgba(255, 255, 255, 0.05)",
						  }
				}
			/>

			{}
			<div
				className={`absolute inset-0 ${
					isDarkMode ? "bg-gray-900" : "bg-gray-100"
				}`}
			></div>

			{}
			<div
				className="absolute w-full bottom-0 left-0 right-0"
				style={{
					height: `${waterLevel}%`,
					transition: "height 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
					background: isDarkMode
						? "linear-gradient(to bottom, #1e40af, #3b82f6)"
						: "linear-gradient(to bottom, #3b82f6, #60a5fa)",
					boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
				}}
			>
				{}
				<div className="absolute inset-0 opacity-50">
					<div className="relative h-full w-full">
						<div className="wave-effect wave1"></div>
					</div>
				</div>

				{}
				<div className="absolute inset-0 opacity-30">
					<div className="relative h-full w-full">
						<div className="wave-effect wave2"></div>
					</div>
				</div>
			</div>

			{}
			<div className="absolute inset-0 flex items-center justify-center">
				<div
					className="text-2xl font-bold"
					style={{
						textShadow: isDarkMode
							? "0 0 5px rgba(0,0,0,0.7)"
							: "0 0 5px rgba(255,255,255,0.7)",
						color:
							waterLevel > 50 ? (isDarkMode ? "white" : "#1e40af") : "white",
					}}
				>
					{percentage}%
				</div>
			</div>

			{}
			{[...Array(5)].map((_, i) => (
				<div
					key={i}
					className="droplet"
					style={{
						left: `${20 + i * 15}%`,
						animationDelay: `${i * 0.7}s`,
						opacity: waterLevel < 90 ? 0 : 0.6,
					}}
				></div>
			))}
		</div>
	);
};

const WaterFlowAnimation = () => {
	const { isDarkMode } = useTheme();

	return (
		<div className="h-48 w-full relative overflow-hidden rounded-xl my-4">
			<div
				className={`absolute inset-0 ${
					isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
				}`}
			></div>

			{}
			<div className="absolute top-0 left-1/2 w-8 h-12 -mt-2 -ml-4 bg-gray-400 rounded-b-lg z-10"></div>

			{}
			<div className="absolute top-0 left-1/2 w-2 -ml-1 h-full">
				<div
					className={`water-flow ${
						isDarkMode ? "water-flow-dark" : "water-flow-light"
					}`}
				></div>
			</div>

			{}
			<div className="absolute bottom-0 left-1/2 -ml-16 w-32 h-20 rounded-t-lg bg-gray-300"></div>

			<div className="absolute bottom-0 left-1/2 -ml-16 water-fill overflow-hidden w-32 h-16 rounded-t-lg">
				<div
					className={`h-full w-full ${
						isDarkMode ? "bg-blue-600" : "bg-blue-400"
					}`}
				></div>
			</div>
		</div>
	);
};

const ProgressCircle = ({
	percentage,
	size = 120,
	strokeWidth = 8,
	title = "",
	subtitle = "",
	color = "blue",
}: {
	percentage: number;
	size?: number;
	strokeWidth?: number;
	title?: string;
	subtitle?: string;
	color?: "blue" | "green" | "orange" | "purple" | "red";
}) => {
	const { isDarkMode } = useTheme();
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const progress = circumference - (percentage / 100) * circumference;

	const colorClasses = {
		blue: isDarkMode ? "#3b82f6" : "#3b82f6",
		green: isDarkMode ? "#10b981" : "#10b981",
		orange: isDarkMode ? "#f59e0b" : "#f59e0b",
		purple: isDarkMode ? "#8b5cf6" : "#8b5cf6",
		red: isDarkMode ? "#ef4444" : "#ef4444",
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<div
				className="relative flex items-center justify-center"
				style={{ width: size, height: size }}
			>
				{}
				<svg width={size} height={size} className="transform -rotate-90">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={isDarkMode ? "#374151" : "#e5e7eb"}
						strokeWidth={strokeWidth}
						strokeLinecap="round"
					/>
					{}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={colorClasses[color]}
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={progress}
						style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
					/>
				</svg>

				{}
				<div className="absolute flex flex-col items-center justify-center text-center">
					<div className="text-2xl font-bold">{percentage}%</div>
					{subtitle && (
						<div className="text-xs mt-1 opacity-70">{subtitle}</div>
					)}
				</div>
			</div>
			{title && <div className="mt-2 text-sm font-medium">{title}</div>}
		</div>
	);
};

const ProgressBar = ({
	percentage,
	label,
	color = "blue",
	showLabel = true,
	height = 2,
	animated = false,
}: {
	percentage: number;
	label: string;
	color?: "blue" | "green" | "orange" | "purple" | "red";
	showLabel?: boolean;
	height?: number;
	animated?: boolean;
}) => {
	const { isDarkMode } = useTheme();

	const colorClasses = {
		blue: isDarkMode ? "bg-blue-600" : "bg-blue-500",
		green: isDarkMode ? "bg-green-600" : "bg-green-500",
		orange: isDarkMode ? "bg-orange-600" : "bg-orange-500",
		purple: isDarkMode ? "bg-purple-600" : "bg-purple-500",
		red: isDarkMode ? "bg-red-600" : "bg-red-500",
	};

	return (
		<div className="mb-3">
			{showLabel && (
				<div className="flex justify-between items-center mb-1">
					<span className="text-sm font-medium">{label}</span>
					<span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
				</div>
			)}
			<div
				className={`w-full rounded-full overflow-hidden ${
					isDarkMode ? "bg-gray-700" : "bg-gray-200"
				}`}
				style={{
					height: `${height}rem`,
					boxShadow: isDarkMode
						? "inset 1px 1px 2px rgba(0, 0, 0, 0.3), inset -1px -1px 2px rgba(255, 255, 255, 0.05)"
						: "inset 1px 1px 2px rgba(174, 174, 192, 0.3), inset -1px -1px 2px rgba(255, 255, 255, 0.5)",
				}}
			>
				<div
					className={`h-full rounded-full ${colorClasses[color]} ${
						animated ? "progress-bar-animated" : ""
					}`}
					style={{
						width: `${Math.min(100, Math.max(0, percentage))}%`,
						transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
					}}
				/>
			</div>
		</div>
	);
};

const Header = () => {
	const { isDarkMode, toggleTheme } = useTheme();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [visible, setVisible] = useState(true);
	const [scrolled, setScrolled] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState<
		"success" | "info" | "warning" | "error"
	>("info");

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const showToast = (
		message: string,
		type: "success" | "info" | "warning" | "error" = "success"
	) => {
		setToastMessage(message);
		setToastType(type);
		setToastVisible(true);
	};

	const handleLogin = () => {
		showToast("Logged In", "success");
	};

	const handleSignup = () => {
		showToast("Signed Up", "success");
	};

	return (
		<>
			{visible && (
				<div
					className={`py-2 px-4 text-center text-sm font-medium transition-colors duration-300 ${
						isDarkMode ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-800"
					}`}
				>
					<div className="container mx-auto flex items-center justify-center">
						<span className="text-xs sm:text-sm">
							🌊 Join our water conservation challenge and save 20% on your
							water bill!
						</span>
						<button
							className="ml-2 sm:ml-4 text-xs underline hover:no-underline focus:outline-none"
							onClick={() =>
								showToast("Water conservation challenge coming soon!", "info")
							}
						>
							Learn more
						</button>
						<button
							className="ml-auto text-xs opacity-70 hover:opacity-100 focus:outline-none"
							onClick={() => setVisible(false)}
						>
							✕
						</button>
					</div>
				</div>
			)}

			<header
				className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
					scrolled
						? isDarkMode
							? "bg-gray-900/90 backdrop-blur-md"
							: "bg-white/90 backdrop-blur-md shadow-md"
						: isDarkMode
						? "bg-gray-900"
						: "bg-white"
				}`}
			>
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<div className="flex items-center">
						<div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
							<div className="absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white opacity-70 animate-ping" />
							<Droplet className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
						</div>
						<h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
							Aqua
							<span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
								Save
							</span>
						</h1>
					</div>

					<div className="flex items-center">
						<nav className="hidden lg:flex space-x-8">
							{[
								{ name: "Home", href: "#top" },
								{ name: "Calculator", href: "#calculator" },
								{ name: "Insights", href: "#insights" },
								{ name: "Tips", href: "#tips" },
								{ name: "Testimonials", href: "#testimonials" },
								{ name: "Contact", href: "#contact" },
							].map((item) => (
								<a
									key={item.name}
									href={item.href}
									className={`font-medium transition-colors duration-300 border-b-2 ${
										isDarkMode
											? "border-transparent hover:text-blue-400 hover:border-blue-400"
											: "border-transparent hover:text-blue-600 hover:border-blue-600"
									}`}
								>
									{item.name}
								</a>
							))}
						</nav>

						<div className="hidden md:flex items-center ml-4 sm:ml-8 space-x-2 sm:space-x-3">
							<Button
								variant="outline"
								onClick={handleLogin}
								className="text-xs sm:text-sm py-1 px-2 sm:py-1.5 sm:px-4"
							>
								Log in
							</Button>
							<Button
								onClick={handleSignup}
								className="text-xs sm:text-sm py-1 px-2 sm:py-1.5 sm:px-4"
							>
								Sign up
							</Button>
						</div>

						<button
							onClick={toggleTheme}
							className={`p-1 sm:p-2 ml-3 sm:ml-6 rounded-full transition-colors focus:outline-none ${
								isDarkMode
									? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
									: "bg-gray-100 text-blue-900 hover:bg-gray-200"
							}`}
							aria-label="Toggle theme"
							style={
								!isDarkMode
									? {
											boxShadow:
												"3px 3px 5px rgba(174, 174, 192, 0.2), -3px -3px 5px rgba(255, 255, 255, 0.7)",
									  }
									: {}
							}
						>
							{isDarkMode ? (
								<Sun size={16} className="sm:w-5 sm:h-5" />
							) : (
								<Moon size={16} className="sm:w-5 sm:h-5" />
							)}
						</button>

						{}
						<button
							className="ml-3 sm:ml-4 lg:hidden p-1 sm:p-2 rounded-md focus:outline-none"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<div className="w-5 sm:w-6 flex flex-col gap-1 sm:gap-1.5">
								<span
									className={`block h-0.5 rounded transition-all duration-300 ${
										isDarkMode ? "bg-white" : "bg-gray-800"
									} ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
								></span>
								<span
									className={`block h-0.5 rounded transition-all duration-300 ${
										isDarkMode ? "bg-white" : "bg-gray-800"
									} ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
								></span>
								<span
									className={`block h-0.5 rounded transition-all duration-300 ${
										isDarkMode ? "bg-white" : "bg-gray-800"
									} ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
								></span>
							</div>
						</button>
					</div>
				</div>

				{}
				<div
					className={`lg:hidden transition-all duration-300 overflow-hidden ${
						isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<div
						className={`px-4 pb-4 pt-1 ${
							isDarkMode ? "bg-gray-800" : "bg-gray-50"
						}`}
					>
						<nav className="flex flex-col space-y-3">
							{[
								{ name: "Home", href: "#top" },
								{ name: "Calculator", href: "#calculator" },
								{ name: "Insights", href: "#insights" },
								{ name: "Tips", href: "#tips" },
								{ name: "Testimonials", href: "#testimonials" },
								{ name: "Contact", href: "#contact" },
							].map((item) => (
								<a
									key={item.name}
									href={item.href}
									className={`px-4 py-2 font-medium rounded-lg ${
										isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
									}`}
									onClick={() => setIsMenuOpen(false)}
								>
									{item.name}
								</a>
							))}
						</nav>
						<div className="flex mt-4 pt-3 border-t border-opacity-20 border-gray-500">
							<Button
								variant="outline"
								onClick={handleLogin}
								className="text-xs sm:text-sm py-1.5 flex-1 mr-2"
							>
								Log in
							</Button>
							<Button
								onClick={handleSignup}
								className="text-xs sm:text-sm py-1.5 flex-1"
							>
								Sign up
							</Button>
						</div>
					</div>
				</div>
			</header>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type={toastType}
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const Hero = () => {
	const { isDarkMode } = useTheme();
	const [fadeIn, setFadeIn] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => setFadeIn(true), 300);
		return () => clearTimeout(timer);
	}, []);

	const showToast = (message: string) => {
		setToastMessage(message);
		setToastVisible(true);
	};

	return (
		<section
			id="top"
			className={`pt-16 pb-16 md:pt-24 md:pb-20 overflow-hidden transition-colors duration-500 ${
				isDarkMode
					? "bg-gray-900 text-white"
					: "bg-gradient-to-b from-blue-50 to-white text-gray-900"
			}`}
		>
			<div className="container mx-auto px-4 relative">
				{}
				{!isDarkMode && (
					<>
						<div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
						<div className="hidden md:block absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full opacity-30 blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>
					</>
				)}

				<div
					className={`flex flex-col lg:flex-row items-center ${
						fadeIn ? "opacity-100" : "opacity-0"
					} transition-opacity duration-1000`}
				>
					<div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12">
						<div
							className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
							style={{
								background: isDarkMode
									? "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
									: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
								boxShadow: isDarkMode
									? "0 4px 10px rgba(59, 130, 246, 0.3)"
									: "0 4px 10px rgba(0, 74, 178, 0.15)",
							}}
						>
							🌍 Every Drop Counts
						</div>

						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
							Understand & Reduce Your{" "}
							<span className="relative">
								<span
									className={`${
										isDarkMode ? "text-blue-400" : "text-blue-600"
									}`}
								>
									Water Footprint
								</span>
								<span className="absolute bottom-1 left-0 w-full h-1 rounded opacity-30 bg-blue-400"></span>
							</span>
						</h1>

						<p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed">
							Our interactive simulator helps you visualize your household water
							usage and discover personalized ways to conserve this precious
							resource.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
							<Button
								onClick={() =>
									document
										.getElementById("calculator")
										?.scrollIntoView({ behavior: "smooth" })
								}
								icon={
									<ArrowDown
										size={16}
										className="sm:w-4 sm:h-4 md:w-5 md:h-5"
									/>
								}
								className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base shadow-lg"
							>
								Start Simulation
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									document
										.getElementById("tips")
										?.scrollIntoView({ behavior: "smooth" })
								}
								icon={
									<ArrowRight
										size={16}
										className="sm:w-4 sm:h-4 md:w-5 md:h-5"
									/>
								}
								className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
							>
								Water Saving Tips
							</Button>
						</div>

						<div className="mt-6 sm:mt-8 flex items-center space-x-2">
							<div className="flex -space-x-2">
								{[...Array(4)].map((_, i) => (
									<div
										key={i}
										className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs text-white font-bold"
										style={{
											backgroundColor: [
												"#3b82f6",
												"#10b981",
												"#f59e0b",
												"#8b5cf6",
											][i],
										}}
									>
										{["JD", "PS", "AM", "TK"][i]}
									</div>
								))}
							</div>
							<div className="text-xs sm:text-sm opacity-80">
								Join 10,000+ people saving water daily
							</div>
						</div>
					</div>

					<div className="lg:w-1/2 relative">
						<div
							className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${
								isDarkMode ? "bg-blue-800" : "bg-blue-400"
							}`}
						></div>

						<div
							className="relative z-10 rounded-xl overflow-hidden shadow-2xl transform transition-transform hover:scale-102 duration-700"
							style={{
								boxShadow: isDarkMode
									? "0 20px 50px rgba(0, 0, 0, 0.4)"
									: "0 20px 50px rgba(59, 130, 246, 0.2)",
							}}
						>
							<div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent z-10"></div>
							<img
								src="https://images.unsplash.com/photo-1621112904887-419379ce6824?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80"
								alt="Water conservation illustration"
								className="object-cover w-full h-64 sm:h-80 lg:h-96 transform transition-transform duration-10000 hover:scale-110"
							/>

							{}
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent p-4 sm:p-6 z-20">
								<div className="flex justify-between text-white">
									<div className="text-center">
										<div className="text-lg sm:text-2xl font-bold">47%</div>
										<div className="text-xs">Average Savings</div>
									</div>
									<div className="text-center">
										<div className="text-lg sm:text-2xl font-bold">10K+</div>
										<div className="text-xs">Active Users</div>
									</div>
									<div className="text-center">
										<div className="text-lg sm:text-2xl font-bold">19M</div>
										<div className="text-xs">Liters Saved</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
					{[
						{
							icon: <Zap size={20} className="sm:w-6 sm:h-6" />,
							title: "Instant Analysis",
							description:
								"Get immediate insights into your water usage patterns.",
						},
						{
							icon: <ThumbsUp size={20} className="sm:w-6 sm:h-6" />,
							title: "Smart Recommendations",
							description:
								"Receive personalized water-saving tips tailored to your household.",
						},
						{
							icon: <Award size={20} className="sm:w-6 sm:h-6" />,
							title: "Track Your Impact",
							description:
								"See how your conservation efforts compare to community averages.",
						},
					].map((feature, index) => (
						<Card
							key={index}
							className="p-4 sm:p-5 transform transition-all duration-300 hover:-translate-y-1"
							hoverEffect={true}
						>
							<div
								className={`p-2 sm:p-3 rounded-lg inline-block mb-2 sm:mb-3 ${
									isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
								}`}
							>
								<div className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
									{feature.icon}
								</div>
							</div>
							<h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">
								{feature.title}
							</h3>
							<p className="text-xs sm:text-sm opacity-80">
								{feature.description}
							</p>
						</Card>
					))}
				</div>
			</div>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type="info"
					onClose={() => setToastVisible(false)}
				/>
			)}
		</section>
	);
};

const WaterCalculatorForm = ({
	data,
	onChange,
}: {
	data: HouseholdData;
	onChange: (data: HouseholdData) => void;
}) => {
	const { isDarkMode } = useTheme();
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const handleResetForm = () => {
		onChange({
			residents: 2,
			bathrooms: 1,
			hasGarden: false,
			hasDishwasher: false,
			washingFrequency: 3,
			showerDuration: 8,
		});
		setToastMessage("Form has been reset to default values");
		setToastVisible(true);
	};

	return (
		<>
			<Card className="h-full transform transition-transform hover:scale-[1.01] duration-500">
				<div className="flex justify-between items-center mb-4 sm:mb-6">
					<div>
						<h3 className="text-lg sm:text-xl font-bold">
							Household Information
						</h3>
						<p className="text-xs sm:text-sm opacity-70 mt-1">
							Customize your water usage profile
						</p>
					</div>
					<Button
						variant="outline"
						onClick={handleResetForm}
						icon={<RefreshCw size={16} />}
						className="text-xs sm:text-sm py-1 px-2 sm:px-3"
					>
						Reset
					</Button>
				</div>

				<div className="space-y-4 sm:space-y-5">
					<NeumorphicSlider
						label="Number of residents"
						value={data.residents}
						onChange={(value) => onChange({ ...data, residents: value })}
						min={1}
						max={10}
					/>

					<NeumorphicSlider
						label="Number of bathrooms"
						value={data.bathrooms}
						onChange={(value) => onChange({ ...data, bathrooms: value })}
						min={1}
						max={5}
					/>

					<NeumorphicSlider
						label="Average shower duration"
						value={data.showerDuration}
						onChange={(value) => onChange({ ...data, showerDuration: value })}
						min={1}
						max={20}
						unit=" min"
					/>

					<NeumorphicSlider
						label="Laundry loads per week"
						value={data.washingFrequency}
						onChange={(value) => onChange({ ...data, washingFrequency: value })}
						min={0}
						max={10}
					/>

					<NeumorphicToggle
						label="Do you have a garden?"
						value={data.hasGarden}
						onChange={(value) => onChange({ ...data, hasGarden: value })}
					/>

					<NeumorphicToggle
						label="Do you use a dishwasher?"
						value={data.hasDishwasher}
						onChange={(value) => onChange({ ...data, hasDishwasher: value })}
					/>
				</div>

				<div
					className={`mt-5 sm:mt-6 p-3 sm:p-4 rounded-lg ${
						isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
					}`}
				>
					<div className="flex items-start">
						<Info
							size={16}
							className={`mt-0.5 mr-2 ${
								isDarkMode ? "text-blue-400" : "text-blue-600"
							}`}
						/>
						<p className="text-xs sm:text-sm">
							Adjust these parameters to see how changes in your household
							habits can affect your water consumption.
						</p>
					</div>
				</div>
			</Card>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type="success"
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const WaterUsageVisualizer = ({ usage }: { usage: UsageProjection }) => {
	const { isDarkMode } = useTheme();
	const [activeTab, setActiveTab] = useState<"daily" | "monthly" | "yearly">(
		"daily"
	);
	const [animationKey, setAnimationKey] = useState(0);

	useEffect(() => {
		setAnimationKey((prev) => prev + 1);
	}, [activeTab]);

	const getTimeframeMultiplier = () => {
		switch (activeTab) {
			case "daily":
				return 1;
			case "monthly":
				return 30;
			case "yearly":
				return 365;
			default:
				return 1;
		}
	};

	const categories = [
		{
			name: "Shower",
			value: usage.byCategory.shower * getTimeframeMultiplier(),
			color: "blue",
			icon: "🚿",
		},
		{
			name: "Toilet",
			value: usage.byCategory.toilet * getTimeframeMultiplier(),
			color: "purple",
			icon: "🚽",
		},
		{
			name: "Washing",
			value: usage.byCategory.washing * getTimeframeMultiplier(),
			color: "green",
			icon: "👕",
		},
		{
			name: "Dishes",
			value: usage.byCategory.dishes * getTimeframeMultiplier(),
			color: "orange",
			icon: "🍽️",
		},
		{
			name: "Drinking",
			value: usage.byCategory.drinking * getTimeframeMultiplier(),
			color: "red",
			icon: "🥤",
		},
		{
			name: "Garden",
			value: usage.byCategory.garden * getTimeframeMultiplier(),
			color: "blue",
			icon: "🌱",
		},
	];

	const filteredCategories = categories
		.filter((cat) => cat.value > 0)
		.sort((a, b) => b.value - a.value);

	const total = filteredCategories.reduce((sum, cat) => sum + cat.value, 0);

	const getUsageByTimeframe = () => {
		switch (activeTab) {
			case "daily":
				return usage.daily;
			case "monthly":
				return usage.monthly;
			case "yearly":
				return usage.yearly;
			default:
				return usage.daily;
		}
	};

	const formatWaterVolume = (liters: number): string => {
		if (liters >= 1000) {
			return `${(liters / 1000).toFixed(1)} m³`;
		}
		return `${formatNumber(liters)} L`;
	};

	const getPercentageOfCommunityAverage = () => {
		const average = COMMUNITY_AVERAGES.DAILY_PER_PERSON;
		const current = usage.daily / 2;
		return Math.min(100, Math.round((current / average) * 100));
	};

	return (
		<Card className="h-full transform transition-transform hover:scale-[1.01] duration-500">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
				<div className="mb-3 sm:mb-0">
					<h3 className="text-lg sm:text-xl font-bold">Your Water Usage</h3>
					<p className="text-xs sm:text-sm opacity-70 mt-1">
						Visualized consumption data
					</p>
				</div>

				<div
					className={`inline-flex rounded-lg p-1 w-full sm:w-auto ${
						isDarkMode ? "bg-gray-800" : "bg-gray-100"
					}`}
					style={
						!isDarkMode
							? {
									boxShadow:
										"inset 3px 3px 5px rgba(174, 174, 192, 0.2), inset -3px -3px 5px rgba(255, 255, 255, 0.7)",
							  }
							: {}
					}
				>
					{["daily", "monthly", "yearly"].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab as any)}
							className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
								activeTab === tab
									? isDarkMode
										? "bg-blue-600 text-white"
										: "bg-blue-500 text-white"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>
			</div>

			<div
				className="flex flex-col items-center mb-4 sm:mb-6"
				key={animationKey}
			>
				{}
				<div className="mb-4 sm:mb-6">
					<AnimatedWaves percentage={getPercentageOfCommunityAverage()} />
				</div>

				<div
					className={`text-3xl sm:text-5xl font-bold mb-1 sm:mb-2 ${
						isDarkMode ? "text-blue-400" : "text-blue-600"
					}`}
				>
					{formatWaterVolume(getUsageByTimeframe())}
				</div>
				<div className="text-xs sm:text-sm opacity-70">Total water usage</div>
			</div>

			<div className="space-y-4 sm:space-y-5">
				<h4 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">
					Usage Breakdown
				</h4>

				<div className="space-y-3 sm:space-y-4">
					{filteredCategories.map((category, index) => (
						<div key={category.name} className="flex items-center mb-1 sm:mb-2">
							<div
								className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full mr-2 sm:mr-3 ${
									isDarkMode ? "bg-gray-700" : "bg-gray-100"
								}`}
							>
								<span>{category.icon}</span>
							</div>
							<div className="flex-1">
								<div className="flex justify-between text-xs sm:text-sm mb-1">
									<span className="font-medium">{category.name}</span>
									<span>
										{formatWaterVolume(category.value)} (
										{((category.value / total) * 100).toFixed(1)}%)
									</span>
								</div>
								<ProgressBar
									percentage={(category.value / total) * 100}
									label=""
									color={category.color as any}
									showLabel={false}
									height={0.75}
									animated={true}
								/>
							</div>
						</div>
					))}
				</div>

				{}
				<div
					className={`mt-4 sm:mt-5 p-3 sm:p-4 rounded-lg grid grid-cols-2 gap-3 sm:gap-4 ${
						isDarkMode ? "bg-gray-800" : "bg-gray-100"
					}`}
				>
					<div className="text-center">
						<div className="text-xs sm:text-sm opacity-70">Community avg.</div>
						<div className="text-sm sm:text-base font-bold">
							{COMMUNITY_AVERAGES.DAILY_PER_PERSON * 2} L/day
						</div>
					</div>
					<div className="text-center">
						<div className="text-xs sm:text-sm opacity-70">Your usage</div>
						<div
							className={`text-sm sm:text-base font-bold ${
								usage.daily < COMMUNITY_AVERAGES.DAILY_PER_PERSON * 2
									? isDarkMode
										? "text-green-400"
										: "text-green-600"
									: isDarkMode
									? "text-red-400"
									: "text-red-600"
							}`}
						>
							{formatNumber(usage.daily)} L/day
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
};

const RecommendationsSection = ({
	recommendations,
	savedTips,
	onSaveTip,
}: {
	recommendations: string[];
	savedTips: SavedTip[];
	onSaveTip: (tip: string) => void;
}) => {
	const [expanded, setExpanded] = useState(false);
	const { isDarkMode } = useTheme();
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const isTipSaved = (tip: string) => {
		return savedTips.some((savedTip) => savedTip.text === tip);
	};

	const handleSaveTip = (tip: string) => {
		onSaveTip(tip);
		setToastMessage("Tip has been saved successfully!");
		setToastVisible(true);
	};

	return (
		<>
			<Card>
				<div className="flex justify-between items-center mb-4 sm:mb-6">
					<div>
						<h3 className="text-lg sm:text-xl font-bold">
							Personalized Recommendations
						</h3>
						<p className="text-xs sm:text-sm opacity-70 mt-1">
							Custom tips based on your usage patterns
						</p>
					</div>
				</div>

				<div className="space-y-3 sm:space-y-4">
					{recommendations
						.slice(0, expanded ? recommendations.length : 3)
						.map((rec, index) => (
							<div
								key={index}
								className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg transition-all duration-300 transform hover:translate-x-1 ${
									isDarkMode ? "bg-gray-800" : "bg-blue-50"
								}`}
							>
								<div
									className={`mt-0.5 flex-shrink-0 rounded-full p-2 ${
										isDarkMode ? "bg-green-900" : "bg-green-100"
									}`}
								>
									<Check size={16} className="text-green-600" />
								</div>
								<div>
									<p className="text-xs sm:text-sm">{rec}</p>
									<div className="mt-2 flex justify-between items-center">
										<div className="flex items-center text-xs sm:text-sm">
											<ThumbsUp size={12} className="mr-1 opacity-70" />
											<span className="opacity-70">Helpful</span>
										</div>
										{isTipSaved(rec) ? (
											<div className="text-xs sm:text-sm font-medium text-green-500 flex items-center">
												<Check size={14} className="mr-1" /> Saved
											</div>
										) : (
											<Button
												variant="outline"
												className="text-xs py-1 px-2"
												onClick={() => handleSaveTip(rec)}
											>
												Save tip
											</Button>
										)}
									</div>
								</div>
							</div>
						))}
				</div>

				{!expanded && recommendations.length > 3 && (
					<Button
						variant="outline"
						onClick={() => setExpanded(true)}
						className="w-full mt-4 py-2"
						icon={<ChevronDown size={16} />}
					>
						Show {recommendations.length - 3} more recommendations
					</Button>
				)}
			</Card>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type="success"
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const ComparisonSection = ({
	usage,
	residents,
}: {
	usage: UsageProjection;
	residents: number;
}) => {
	const { isDarkMode } = useTheme();
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const averagePersonDaily = COMMUNITY_AVERAGES.DAILY_PER_PERSON;
	const yourUsagePerPerson = usage.daily / residents;
	const percentDifference =
		((yourUsagePerPerson - averagePersonDaily) / averagePersonDaily) * 100;

	const getComparisonMessage = () => {
		if (percentDifference <= -20) {
			return "Excellent! You're using significantly less water than average.";
		} else if (percentDifference <= -5) {
			return "Good job! You're using less water than average.";
		} else if (percentDifference < 5) {
			return "Your usage is about average for your community.";
		} else if (percentDifference < 20) {
			return "Your water usage is somewhat higher than average.";
		} else {
			return "Your water usage is significantly higher than average.";
		}
	};

	const getStatusColor = () => {
		if (percentDifference <= -10)
			return isDarkMode ? "text-green-400" : "text-green-600";
		if (percentDifference < 10) return "";
		return isDarkMode ? "text-red-400" : "text-red-600";
	};

	const showTipsToast = () => {
		setToastMessage("Water saving tips section opened");
		setToastVisible(true);
	};

	return (
		<>
			<Card>
				<h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
					Community Comparison
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
					<div>
						{}
						<div className="flex justify-center mb-4 sm:mb-6">
							<ProgressCircle
								percentage={Math.min(100, Math.max(0, 100 - percentDifference))}
								title="Efficiency Rating"
								subtitle="vs. community average"
								color={
									percentDifference <= 0
										? "green"
										: percentDifference < 20
										? "orange"
										: "red"
								}
							/>
						</div>

						<div className="space-y-2 sm:space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-xs sm:text-sm opacity-70 flex items-center">
									<Users size={12} className="mr-2" />
									Average daily usage per person
								</span>
								<span className="text-xs sm:text-sm font-medium">
									{averagePersonDaily} L
								</span>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-xs sm:text-sm opacity-70 flex items-center">
									<Droplet size={12} className="mr-2" />
									Your daily usage per person
								</span>
								<span
									className={`text-xs sm:text-sm font-medium ${getStatusColor()}`}
								>
									{formatNumber(yourUsagePerPerson)} L
								</span>
							</div>
						</div>

						<div
							className={`mt-3 sm:mt-4 text-center p-2 sm:p-3 rounded-lg ${
								isDarkMode ? "bg-gray-800" : "bg-gray-100"
							}`}
						>
							<p className={`text-xs sm:text-sm ${getStatusColor()}`}>
								{percentDifference > 0 ? "+" : ""}
								{formatNumber(percentDifference)}%{" "}
								{percentDifference > 0 ? "higher" : "lower"} than average
							</p>
						</div>
					</div>

					<div>
						<div
							className={`p-4 sm:p-5 rounded-lg border h-full ${
								isDarkMode
									? "border-gray-700 bg-gray-800/50"
									: "border-gray-200 bg-gray-50"
							}`}
						>
							<h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 flex items-center">
								<Award
									size={16}
									className={`mr-2 ${
										isDarkMode ? "text-blue-400" : "text-blue-600"
									}`}
								/>
								Analysis & Recommendations
							</h4>
							<p className="text-xs sm:text-sm mb-3 sm:mb-4">
								{getComparisonMessage()}
							</p>

							{percentDifference > 5 ? (
								<div className="space-y-2 sm:space-y-3">
									<p className="text-xs sm:text-sm">
										Top ways to reduce your usage:
									</p>
									<ul className="space-y-1 sm:space-y-2">
										<li className="flex items-start">
											<div className="mr-2 mt-0.5 text-xs sm:text-sm">1.</div>
											<div className="text-xs sm:text-sm">
												Reduce shower time by 2 minutes (saves 20L/day)
											</div>
										</li>
										<li className="flex items-start">
											<div className="mr-2 mt-0.5 text-xs sm:text-sm">2.</div>
											<div className="text-xs sm:text-sm">
												Install a low-flow showerhead (saves up to 40%)
											</div>
										</li>
										<li className="flex items-start">
											<div className="mr-2 mt-0.5 text-xs sm:text-sm">3.</div>
											<div className="text-xs sm:text-sm">
												Check for leaks (can save 140L/week)
											</div>
										</li>
									</ul>
									<Button
										variant="outline"
										onClick={() => {
											document
												.getElementById("tips")
												?.scrollIntoView({ behavior: "smooth" });
											showTipsToast();
										}}
										className="w-full mt-2 text-xs sm:text-sm"
										icon={<ArrowRight size={14} />}
									>
										See all water saving tips
									</Button>
								</div>
							) : (
								<div>
									<p className="text-xs sm:text-sm mb-3 sm:mb-4">
										You're doing great! Your water usage is already efficient
										compared to the average household.
									</p>
									<div className="flex items-center justify-center bg-green-100 rounded-lg p-2 sm:p-3 dark:bg-green-900/30">
										<div className="mr-2 p-1 bg-green-200 rounded-full dark:bg-green-800">
											<Star
												size={14}
												className="text-green-600 dark:text-green-400"
											/>
										</div>
										<span className="text-xs sm:text-sm text-green-800 font-medium dark:text-green-400">
											Water Conservation Leader
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</Card>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type="info"
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const SavedTipsSection = ({
	savedTips,
	onRemoveTip,
}: {
	savedTips: SavedTip[];
	onRemoveTip: (id: string) => void;
}) => {
	const { isDarkMode } = useTheme();
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const handleRemoveTip = (id: string) => {
		onRemoveTip(id);
		setToastMessage("Tip has been removed");
		setToastVisible(true);
	};

	if (savedTips.length === 0) {
		return null;
	}

	return (
		<>
			<Card className="mb-8">
				<div className="flex justify-between items-center mb-4 sm:mb-6">
					<div>
						<h3 className="text-lg sm:text-xl font-bold">Your Saved Tips</h3>
						<p className="text-xs sm:text-sm opacity-70 mt-1">
							Water conservation tips you've saved for later
						</p>
					</div>
					<div className="bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-medium px-2 py-1 rounded-md">
						{savedTips.length} Saved
					</div>
				</div>

				<div className="space-y-3 sm:space-y-4">
					{savedTips.map((tip) => (
						<div
							key={tip.id}
							className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg ${
								isDarkMode ? "bg-gray-800" : "bg-blue-50"
							}`}
						>
							<div
								className={`mt-0.5 flex-shrink-0 rounded-full p-1 sm:p-2 ${
									isDarkMode ? "bg-blue-900" : "bg-blue-100"
								}`}
							>
								<Droplet
									size={14}
									className={`${
										isDarkMode ? "text-blue-400" : "text-blue-600"
									}`}
								/>
							</div>
							<div className="flex-1">
								<p className="text-xs sm:text-sm">{tip.text}</p>
								<div className="mt-2 flex justify-end">
									<Button
										variant="outline"
										className="text-xs py-1 px-2"
										onClick={() => handleRemoveTip(tip.id)}
										icon={<X size={14} />}
									>
										Remove
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</Card>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type="info"
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const WaterSavingTips = ({
	onSaveTip,
	savedTips,
}: {
	onSaveTip: (tip: string) => void;
	savedTips: SavedTip[];
}) => {
	const [activeTip, setActiveTip] = useState(0);
	const { isDarkMode } = useTheme();
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const tips = [
		{
			title: "Install Water-Efficient Fixtures",
			content:
				"Low-flow showerheads, faucet aerators, and WaterSense labeled toilets can reduce water usage by 20-60% without sacrificing performance.",
			icon: "🚿",
			color: "blue",
		},
		{
			title: "Fix Leaks Promptly",
			content:
				"A dripping faucet can waste up to 3,000 gallons per year. Check for leaks regularly and repair them immediately.",
			icon: "🔧",
			color: "orange",
		},
		{
			title: "Collect and Reuse Water",
			content:
				"Capture shower warm-up water and reuse it for plants. Use a rain barrel to collect rainwater for garden irrigation.",
			icon: "🪣",
			color: "green",
		},
		{
			title: "Optimize Laundry Loads",
			content:
				"Always run full loads of laundry, and consider upgrading to a high-efficiency washing machine that uses 25-40% less water.",
			icon: "👕",
			color: "purple",
		},
		{
			title: "Efficient Garden Watering",
			content:
				"Water plants in the early morning or evening to reduce evaporation. Use drip irrigation systems and mulch to retain moisture.",
			icon: "🌱",
			color: "green",
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveTip((prev) => (prev + 1) % tips.length);
		}, 8000);

		return () => clearInterval(interval);
	}, [tips.length]);

	const isTipSaved = (tipContent: string) => {
		return savedTips.some((savedTip) => savedTip.text === tipContent);
	};

	const handleSaveTip = (tip: string) => {
		onSaveTip(tip);
		setToastMessage(`Tip "${tips[activeTip].title}" has been saved!`);
		setToastVisible(true);
	};

	return (
		<>
			<Card>
				<h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
					Water Conservation Tips
				</h3>

				<div className="relative overflow-hidden rounded-lg">
					{tips.map((tip, index) => (
						<div
							key={index}
							className={`transition-all duration-500 ${
								index === activeTip
									? "opacity-100 translate-x-0"
									: "opacity-0 absolute inset-0 translate-x-8"
							}`}
						>
							<div
								className={`p-4 sm:p-6 rounded-lg ${
									isDarkMode ? `bg-${tip.color}-900/20` : `bg-${tip.color}-50`
								}`}
								style={{
									background: isDarkMode
										? `rgba(${
												tip.color === "blue"
													? "30, 64, 175"
													: tip.color === "green"
													? "6, 78, 59"
													: tip.color === "orange"
													? "154, 52, 18"
													: "107, 33, 168"
										  }, 0.2)`
										: `rgba(${
												tip.color === "blue"
													? "239, 246, 255"
													: tip.color === "green"
													? "240, 253, 244"
													: tip.color === "orange"
													? "255, 247, 237"
													: "250, 245, 255"
										  }, 1)`,
								}}
							>
								<div className="flex flex-col sm:flex-row sm:items-start">
									<div className="text-3xl sm:text-4xl mb-3 sm:mb-0 sm:mr-4">
										{tip.icon}
									</div>
									<div>
										<h4 className="text-base sm:text-lg font-bold mb-2">
											{tip.title}
										</h4>
										<p className="text-xs sm:text-sm">{tip.content}</p>

										{isTipSaved(tip.content) ? (
											<div className="mt-3 sm:mt-4 inline-flex items-center text-xs sm:text-sm font-medium text-green-500">
												<Check size={14} className="mr-1" /> Tip saved
											</div>
										) : (
											<Button
												variant="outline"
												className="mt-3 sm:mt-4 text-xs"
												onClick={() => handleSaveTip(tip.content)}
												icon={<Save size={14} />}
											>
												Save this tip
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="flex justify-center mt-4">
					{tips.map((_, index) => (
						<button
							key={index}
							onClick={() => setActiveTip(index)}
							className={`w-2 h-2 mx-1 rounded-full transition-all ${
								index === activeTip
									? isDarkMode
										? "bg-blue-500 w-5 sm:w-6"
										: "bg-blue-500 w-5 sm:w-6"
									: isDarkMode
									? "bg-gray-700"
									: "bg-gray-300"
							}`}
							aria-label={`View tip ${index + 1}`}
						/>
					))}
				</div>
			</Card>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type="success"
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const SavingsCalculator = () => {
	const { isDarkMode } = useTheme();
	const [percentReduction, setPercentReduction] = useState(20);
	const [waterCost, setWaterCost] = useState(0.002);
	const [timeframe, setTimeframe] = useState("monthly");

	const monthlyUsage = 12000;

	const calculatedSavings =
		((monthlyUsage * percentReduction) / 100) * waterCost;
	const waterSaved = (monthlyUsage * percentReduction) / 100;

	const getAnnualSavings = calculatedSavings * 12;
	const get5YearSavings = getAnnualSavings * 5;
	const get10YearSavings = getAnnualSavings * 10;

	const getTimeframeSavings = () => {
		switch (timeframe) {
			case "monthly":
				return calculatedSavings;
			case "annual":
				return getAnnualSavings;
			case "5year":
				return get5YearSavings;
			case "10year":
				return get10YearSavings;
			default:
				return calculatedSavings;
		}
	};

	const getWaterSavedByTimeframe = () => {
		switch (timeframe) {
			case "monthly":
				return waterSaved;
			case "annual":
				return waterSaved * 12;
			case "5year":
				return waterSaved * 12 * 5;
			case "10year":
				return waterSaved * 12 * 10;
			default:
				return waterSaved;
		}
	};

	return (
		<Card>
			<div className="flex justify-between items-center mb-4 sm:mb-6">
				<div>
					<h3 className="text-lg sm:text-xl font-bold">Savings Calculator</h3>
					<p className="text-xs sm:text-sm opacity-70 mt-1">
						See how much you can save
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
				<div>
					<NeumorphicSlider
						label="Target reduction percentage"
						value={percentReduction}
						onChange={setPercentReduction}
						min={5}
						max={50}
						unit="%"
					/>

					<NeumorphicSlider
						label="Water cost per liter (USD)"
						value={waterCost}
						onChange={setWaterCost}
						min={0.001}
						max={0.01}
						step={0.0005}
						unit=" $"
					/>

					<div className="mb-4">
						<label className="text-xs sm:text-sm font-medium mb-2 block">
							Timeframe
						</label>
						<div
							className={`inline-flex rounded-lg p-1 w-full ${
								isDarkMode ? "bg-gray-800" : "bg-gray-100"
							}`}
						>
							{[
								{ value: "monthly", label: "Monthly" },
								{ value: "annual", label: "Annual" },
								{ value: "5year", label: "5 Years" },
								{ value: "10year", label: "10 Years" },
							].map((option) => (
								<button
									key={option.value}
									onClick={() => setTimeframe(option.value)}
									className={`flex-1 px-1 sm:px-2 py-2 text-xs font-medium rounded-md transition-colors ${
										timeframe === option.value
											? isDarkMode
												? "bg-blue-600 text-white"
												: "bg-blue-500 text-white"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>

					<div
						className={`p-3 sm:p-4 mt-3 sm:mt-4 rounded-lg ${
							isDarkMode ? "bg-gray-800" : "bg-gray-100"
						}`}
					>
						<p className="text-xs sm:text-sm">
							Reducing your water usage not only helps the environment but can
							also lead to substantial financial savings over time.
						</p>
					</div>
				</div>

				<div
					className={`p-4 sm:p-6 rounded-lg ${
						isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
					}`}
				>
					<h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
						Potential {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}{" "}
						Savings
					</h4>

					<div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
						<div className="flex items-center">
							<div
								className={`p-2 sm:p-3 rounded-full ${
									isDarkMode ? "bg-blue-900/30" : "bg-white"
								}`}
							>
								<Droplet
									size={16}
									className={isDarkMode ? "text-blue-400" : "text-blue-600"}
								/>
							</div>
							<div className="ml-3 sm:ml-4">
								<p className="text-xs sm:text-sm opacity-70">Water saved</p>
								<p className="text-lg sm:text-2xl font-bold">
									{getWaterSavedByTimeframe() < 1000
										? `${formatNumber(getWaterSavedByTimeframe())} L`
										: `${formatNumber(getWaterSavedByTimeframe() / 1000)} m³`}
								</p>
							</div>
						</div>

						<div className="flex items-center">
							<div
								className={`p-2 sm:p-3 rounded-full ${
									isDarkMode ? "bg-green-900/30" : "bg-white"
								}`}
							>
								<Dollar
									size={16}
									className={isDarkMode ? "text-green-400" : "text-green-600"}
								/>
							</div>
							<div className="ml-3 sm:ml-4">
								<p className="text-xs sm:text-sm opacity-70">
									Financial savings
								</p>
								<p className="text-lg sm:text-2xl font-bold">
									${getTimeframeSavings().toFixed(2)}
								</p>
							</div>
						</div>

						<div>
							<div
								className={`p-3 sm:p-4 rounded-lg ${
									isDarkMode ? "bg-blue-800/20" : "bg-blue-100"
								}`}
							>
								<p className="text-xs sm:text-sm font-medium">
									By reducing your water usage by {percentReduction}%, you could
									save ${getTimeframeSavings().toFixed(2)} and{" "}
									{getWaterSavedByTimeframe() < 1000
										? `${formatNumber(getWaterSavedByTimeframe())} liters`
										: `${formatNumber(
												getWaterSavedByTimeframe() / 1000
										  )} cubic meters`}{" "}
									of water.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
};

const ResourcesSection = () => {
	const { isDarkMode } = useTheme();
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const resources = [
		{
			title: "EPA WaterSense",
			description:
				"Official water conservation program that helps consumers identify water-efficient products and practices.",
			link: "#",
			icon: <Award size={20} className="sm:w-6 sm:h-6" />,
		},
		{
			title: "Water Footprint Calculator",
			description:
				"Comprehensive tool to calculate your complete water footprint including virtual water in products.",
			link: "#",
			icon: <Briefcase size={20} className="sm:w-6 sm:h-6" />,
		},
		{
			title: "Alliance for Water Efficiency",
			description:
				"Non-profit organization dedicated to the efficient and sustainable use of water.",
			link: "#",
			icon: <Users size={20} className="sm:w-6 sm:h-6" />,
		},
	];

	const handleResourceClick = (resourceTitle: string) => {
		setToastMessage(`Opening "${resourceTitle}" resource`);
		setToastVisible(true);
	};

	return (
		<>
			<Card>
				<h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
					Additional Resources
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
					{resources.map((resource, index) => (
						<div
							key={index}
							className={`p-4 sm:p-6 rounded-lg border transition-all duration-300 hover:-translate-y-2 ${
								isDarkMode
									? "border-gray-700 hover:border-blue-700 bg-gray-800/50"
									: "border-gray-200 hover:border-blue-300 bg-white"
							}`}
							style={{
								boxShadow: isDarkMode
									? "0 4px 20px rgba(0, 0, 0, 0.2)"
									: "0 4px 20px rgba(0, 0, 0, 0.05)",
							}}
						>
							<div
								className={`p-2 sm:p-3 inline-block rounded-lg mb-3 sm:mb-4 ${
									isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
								}`}
							>
								<div className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
									{resource.icon}
								</div>
							</div>
							<h4 className="text-base sm:text-lg font-bold mb-2">
								{resource.title}
							</h4>
							<p className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-80">
								{resource.description}
							</p>
							<a
								href={resource.link}
								className={`text-xs sm:text-sm font-medium inline-flex items-center ${
									isDarkMode
										? "text-blue-400 hover:text-blue-300"
										: "text-blue-600 hover:text-blue-700"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handleResourceClick(resource.title);
								}}
							>
								Learn more <ExternalLink size={14} className="ml-1" />
							</a>
						</div>
					))}
				</div>
			</Card>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type="info"
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const TestimonialsSection = () => {
	const { isDarkMode } = useTheme();
	const [activeTestimonial, setActiveTestimonial] = useState(0);

	const testimonials = [
		{
			name: "Sarah J.",
			role: "Homeowner",
			text: "AquaSave has completely changed how our family thinks about water usage. We've reduced our bill by 32% in just three months!",
			image: "https://api.dicebear.com/7.x/micah/svg?seed=Sarah",
			rating: 5,
		},
		{
			name: "Miguel R.",
			role: "Apartment Resident",
			text: "Even in my small apartment, I was able to find ways to conserve water. The personalized recommendations were spot on!",
			image: "https://api.dicebear.com/7.x/micah/svg?seed=Miguel",
			rating: 5,
		},
		{
			name: "Emma T.",
			role: "Garden Enthusiast",
			text: "As someone with a large garden, I was worried about conservation. AquaSave helped me implement strategies that kept my plants happy while reducing water waste.",
			image: "https://api.dicebear.com/7.x/micah/svg?seed=Emma",
			rating: 4,
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
		}, 10000);

		return () => clearInterval(interval);
	}, [testimonials.length]);

	return (
		<section
			id="testimonials"
			className={`py-12 sm:py-16 transition-colors duration-300 ${
				isDarkMode ? "bg-gray-900" : "bg-blue-50"
			}`}
		>
			<div className="container mx-auto px-4">
				<div className="text-center mb-8 sm:mb-12">
					<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
						What Our Users Say
					</h2>
					<p className="max-w-2xl mx-auto text-sm sm:text-base opacity-80">
						Join thousands of satisfied users who are making a difference in
						their water consumption.
					</p>
				</div>

				<div className="relative max-w-4xl mx-auto">
					{}
					<div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 md:-translate-x-12 z-10 hidden sm:block">
						<button
							onClick={() =>
								setActiveTestimonial(
									(prev) =>
										(prev - 1 + testimonials.length) % testimonials.length
								)
							}
							className={`p-2 sm:p-3 rounded-full ${
								isDarkMode
									? "bg-gray-800 hover:bg-gray-700"
									: "bg-white hover:bg-gray-100"
							} shadow-lg`}
						>
							<ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
						</button>
					</div>

					<div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-2 md:translate-x-12 z-10 hidden sm:block">
						<button
							onClick={() =>
								setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
							}
							className={`p-2 sm:p-3 rounded-full ${
								isDarkMode
									? "bg-gray-800 hover:bg-gray-700"
									: "bg-white hover:bg-gray-100"
							} shadow-lg`}
						>
							<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
						</button>
					</div>

					{}
					<div className="relative overflow-hidden rounded-xl">
						<div
							className="transition-transform duration-500 ease-in-out flex"
							style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
						>
							{testimonials.map((testimonial, index) => (
								<div key={index} className="w-full flex-shrink-0">
									<Card className="p-6 sm:p-8 md:p-12">
										<div className="flex flex-col items-center text-center">
											<div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
												<img
													src={testimonial.image}
													alt={testimonial.name}
													className="w-full h-full object-cover"
												/>
											</div>

											<div className="mb-4 sm:mb-6 flex">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														size={18}
														fill={
															i < testimonial.rating
																? isDarkMode
																	? "#FBBF24"
																	: "#F59E0B"
																: "none"
														}
														stroke={isDarkMode ? "#FBBF24" : "#F59E0B"}
														className="mx-0.5"
													/>
												))}
											</div>

											<p className="text-sm sm:text-lg mb-4 sm:mb-6 italic">
												"{testimonial.text}"
											</p>

											<div>
												<h4 className="font-bold text-base sm:text-lg">
													{testimonial.name}
												</h4>
												<p className="text-sm opacity-70">{testimonial.role}</p>
											</div>
										</div>
									</Card>
								</div>
							))}
						</div>
					</div>

					{}
					<div className="flex justify-center mt-4 sm:mt-6">
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => setActiveTestimonial(index)}
								className={`w-2 h-2 rounded-full mx-1 transition-all ${
									index === activeTestimonial
										? isDarkMode
											? "bg-blue-500 w-5 sm:w-8"
											: "bg-blue-500 w-5 sm:w-8"
										: isDarkMode
										? "bg-gray-700"
										: "bg-gray-300"
								}`}
								aria-label={`View testimonial ${index + 1}`}
							/>
						))}
					</div>

					{}
					<div className="flex justify-between mt-4 sm:hidden">
						<button
							onClick={() =>
								setActiveTestimonial(
									(prev) =>
										(prev - 1 + testimonials.length) % testimonials.length
								)
							}
							className={`p-2 rounded-full ${
								isDarkMode
									? "bg-gray-800 hover:bg-gray-700"
									: "bg-white hover:bg-gray-100"
							} shadow-lg`}
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							onClick={() =>
								setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
							}
							className={`p-2 rounded-full ${
								isDarkMode
									? "bg-gray-800 hover:bg-gray-700"
									: "bg-white hover:bg-gray-100"
							} shadow-lg`}
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

const ContactSection = () => {
	const { isDarkMode } = useTheme();
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState<
		"success" | "info" | "warning" | "error"
	>("success");

	const handleSubmit = () => {
		setToastType("success");
		setToastMessage("Your message has been sent! We'll get back to you soon.");
		setToastVisible(true);
	};

	const handleSubscribe = () => {
		setToastType("success");
		setToastMessage("Thank you for subscribing to our newsletter!");
		setToastVisible(true);
	};

	return (
		<>
			<section
				id="contact"
				className={`py-12 sm:py-16 transition-colors duration-300 ${
					isDarkMode ? "bg-gray-800" : "bg-white"
				}`}
			>
				<div className="container mx-auto px-4">
					<div className="text-center mb-8 sm:mb-12">
						<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
							Get in Touch
						</h2>
						<p className="max-w-2xl mx-auto text-sm sm:text-base opacity-80">
							Have questions about water conservation or need help with the app?
							Our team is here to assist you.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto">
						<Card>
							<h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center">
								<Mail className="mr-2" size={18} />
								Send us a Message
							</h3>

							<div className="space-y-3 sm:space-y-4">
								<div>
									<label className="block text-xs sm:text-sm font-medium mb-1">
										Your Name
									</label>
									<input
										type="text"
										className={`w-full px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
											isDarkMode
												? "bg-gray-700 border border-gray-600 focus:border-blue-500"
												: "bg-gray-100 border border-gray-200 focus:border-blue-500"
										}`}
										placeholder="John Doe"
									/>
								</div>

								<div>
									<label className="block text-xs sm:text-sm font-medium mb-1">
										Email Address
									</label>
									<input
										type="email"
										className={`w-full px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
											isDarkMode
												? "bg-gray-700 border border-gray-600 focus:border-blue-500"
												: "bg-gray-100 border border-gray-200 focus:border-blue-500"
										}`}
										placeholder="your@email.com"
									/>
								</div>

								<div>
									<label className="block text-xs sm:text-sm font-medium mb-1">
										Message
									</label>
									<textarea
										className={`w-full px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
											isDarkMode
												? "bg-gray-700 border border-gray-600 focus:border-blue-500"
												: "bg-gray-100 border border-gray-200 focus:border-blue-500"
										}`}
										rows={4}
										placeholder="How can we help you?"
									></textarea>
								</div>

								<Button
									variant="primary"
									fullWidth
									className="py-2 sm:py-3 text-sm"
									onClick={handleSubmit}
								>
									Send Message
								</Button>
							</div>
						</Card>

						<div className="space-y-4 sm:space-y-6">
							<Card>
								<h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
									Connect With Us
								</h3>

								<div className="space-y-3 sm:space-y-4">
									<div className="flex items-start">
										<div
											className={`p-2 sm:p-3 rounded-lg ${
												isDarkMode ? "bg-gray-700" : "bg-blue-50"
											}`}
										>
											<Mail size={18} />
										</div>
										<div className="ml-3 sm:ml-4">
											<h4 className="text-sm sm:text-base font-medium">
												Email
											</h4>
											<p className="text-xs sm:text-sm opacity-80">
												support@aquasave.com
											</p>
											<a
												href="mailto:support@aquasave.com"
												className={`text-xs sm:text-sm font-medium underline ${
													isDarkMode ? "text-blue-400" : "text-blue-600"
												}`}
											>
												Send an email
											</a>
										</div>
									</div>

									<div className="flex items-start">
										<div
											className={`p-2 sm:p-3 rounded-lg ${
												isDarkMode ? "bg-gray-700" : "bg-blue-50"
											}`}
										>
											<Phone size={18} />
										</div>
										<div className="ml-3 sm:ml-4">
											<h4 className="text-sm sm:text-base font-medium">
												Phone
											</h4>
											<p className="text-xs sm:text-sm opacity-80">
												+1 (555) 123-4567
											</p>
											<p className="text-xs opacity-70">Mon-Fri, 9am-5pm EST</p>
										</div>
									</div>

									<div className="flex items-start">
										<div
											className={`p-2 sm:p-3 rounded-lg ${
												isDarkMode ? "bg-gray-700" : "bg-blue-50"
											}`}
										>
											<Home size={18} />
										</div>
										<div className="ml-3 sm:ml-4">
											<h4 className="text-sm sm:text-base font-medium">
												Office
											</h4>
											<p className="text-xs sm:text-sm opacity-80">
												123 Water Conservation Way
												<br />
												Eco City, EC 12345
												<br />
												United States
											</p>
										</div>
									</div>
								</div>
							</Card>

							<Card>
								<h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
									Follow Us
								</h3>
								<p className="mb-3 sm:mb-4 text-xs sm:text-sm opacity-80">
									Stay updated on water conservation tips and app features.
								</p>

								<div className="flex space-x-2 sm:space-x-3">
									{[
										{ icon: <Facebook size={18} />, name: "Facebook" },
										{ icon: <Twitter size={18} />, name: "Twitter" },
										{ icon: <Instagram size={18} />, name: "Instagram" },
										{ icon: <Linkedin size={18} />, name: "LinkedIn" },
									].map((social, idx) => (
										<a
											href="#"
											key={idx}
											className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
												isDarkMode
													? "bg-gray-700 hover:bg-blue-900/50 text-white"
													: "bg-gray-100 hover:bg-blue-100 text-gray-700"
											}`}
											aria-label={`Follow us on ${social.name}`}
										>
											{social.icon}
										</a>
									))}
								</div>
							</Card>
						</div>
					</div>

					{}
					<div className="max-w-3xl mx-auto mt-10 sm:mt-16">
						<Card
							className={`
							${
								isDarkMode
									? "bg-gradient-to-r from-blue-900/40 to-purple-900/40"
									: "bg-gradient-to-r from-blue-50 to-indigo-50"
							}
						`}
						>
							<div className="flex flex-col md:flex-row items-center">
								<div className="flex-1 mb-4 md:mb-0 md:mr-6 sm:mr-8">
									<h3 className="text-lg sm:text-xl font-bold mb-2">
										Subscribe to Our Newsletter
									</h3>
									<p className="text-xs sm:text-sm opacity-80">
										Get the latest water conservation tips, updates, and
										exclusive offers.
									</p>
								</div>

								<div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
									<input
										type="email"
										placeholder="Your email address"
										className={`px-3 sm:px-4 py-2 text-sm rounded-lg transition-colors w-full sm:w-auto ${
											isDarkMode
												? "bg-gray-700 border border-gray-600"
												: "bg-white border border-gray-200"
										}`}
									/>
									<Button onClick={handleSubscribe} className="text-sm">
										Subscribe
									</Button>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type={toastType}
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const Footer = () => {
	const { isDarkMode } = useTheme();
	const currentYear = new Date().getFullYear();

	return (
		<footer
			className={`py-8 sm:py-12 transition-colors duration-300 ${
				isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
			}`}
		>
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
					<div className="col-span-2 sm:col-span-1">
						<div className="flex items-center mb-4">
							<div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
								<Droplet className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
							</div>
							<h2 className="text-base sm:text-xl font-bold">
								Aqua
								<span
									className={isDarkMode ? "text-blue-400" : "text-blue-600"}
								>
									Save
								</span>
							</h2>
						</div>

						<p className="text-xs sm:text-sm mb-4 opacity-70">
							Our mission is to help individuals and communities conserve water
							through education, technology, and practical solutions.
						</p>

						<div className="flex space-x-2 sm:space-x-3">
							{[
								{ icon: <Facebook size={16} /> },
								{ icon: <Twitter size={16} /> },
								{ icon: <Instagram size={16} /> },
								{ icon: <Linkedin size={16} /> },
							].map((social, idx) => (
								<a
									href="#"
									key={idx}
									className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
										isDarkMode
											? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
											: "bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800"
									}`}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					<div>
						<h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4">
							Quick Links
						</h3>
						<ul className="space-y-1 sm:space-y-2">
							{[
								{ text: "Home", href: "#top" },
								{ text: "About Us", href: "#about" },
								{ text: "Water Calculator", href: "#calculator" },
								{ text: "Conservation Tips", href: "#tips" },
								{ text: "Blog", href: "#" },
								{ text: "Contact Us", href: "#contact" },
							].map((link, idx) => (
								<li key={idx}>
									<a
										href={link.href}
										className={`text-xs sm:text-sm hover:underline ${
											isDarkMode
												? "text-gray-400 hover:text-white"
												: "text-gray-600 hover:text-gray-900"
										}`}
									>
										{link.text}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4">
							Resources
						</h3>
						<ul className="space-y-1 sm:space-y-2">
							{[
								{ text: "Water Saving Guide", href: "#" },
								{ text: "FAQ", href: "#" },
								{ text: "User Manual", href: "#" },
								{ text: "API Documentation", href: "#" },
								{ text: "Partner Program", href: "#" },
								{ text: "Press Kit", href: "#" },
							].map((link, idx) => (
								<li key={idx}>
									<a
										href={link.href}
										className={`text-xs sm:text-sm hover:underline ${
											isDarkMode
												? "text-gray-400 hover:text-white"
												: "text-gray-600 hover:text-gray-900"
										}`}
									>
										{link.text}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4">
							Contact
						</h3>
						<ul className="space-y-2 sm:space-y-3">
							<li className="flex items-start">
								<Mail size={14} className="mt-0.5 mr-2 opacity-70" />
								<span className="text-xs sm:text-sm">support@aquasave.com</span>
							</li>
							<li className="flex items-start">
								<Phone size={14} className="mt-0.5 mr-2 opacity-70" />
								<span className="text-xs sm:text-sm">+1 (555) 123-4567</span>
							</li>
							<li className="flex items-start">
								<Home size={14} className="mt-0.5 mr-2 opacity-70" />
								<span className="text-xs sm:text-sm">
									123 Water Conservation Way
									<br />
									Eco City, EC 12345
								</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-700 border-opacity-20">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-xs sm:text-sm opacity-70 mb-3 md:mb-0">
							© {currentYear} AquaSave. All rights reserved.
						</p>

						<div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2">
							<a href="#" className="text-xs sm:text-sm hover:underline">
								Privacy Policy
							</a>
							<a href="#" className="text-xs sm:text-sm hover:underline">
								Terms of Service
							</a>
							<a href="#" className="text-xs sm:text-sm hover:underline">
								Cookie Policy
							</a>
							<a href="#" className="text-xs sm:text-sm hover:underline">
								Sitemap
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

const ScrollToTopButton = () => {
	const { isDarkMode } = useTheme();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.pageYOffset > 500) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			onClick={scrollToTop}
			className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 p-2 sm:p-3 rounded-full shadow-lg z-50 transition-all duration-300 ${
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-10 pointer-events-none"
			} ${
				isDarkMode
					? "bg-blue-600 text-white hover:bg-blue-700"
					: "bg-blue-500 text-white hover:bg-blue-600"
			}`}
			aria-label="Scroll to top"
		>
			<ChevronUp size={20} />
		</button>
	);
};

const DataExportButtons = () => {
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const handleSaveData = () => {
		setToastMessage(
			"Your simulation data has been saved. You can access it later from your account."
		);
		setToastVisible(true);
	};

	const handleDownloadPDF = () => {
		setToastMessage("Generating PDF report of your water usage simulation...");
		setToastVisible(true);
	};

	return (
		<>
			<div className="flex flex-col sm:flex-row gap-2">
				<Button
					variant="outline"
					onClick={handleSaveData}
					icon={<Save size={14} className="sm:w-4 sm:h-4" />}
					className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
				>
					Save Results
				</Button>

				<Button
					variant="outline"
					onClick={handleDownloadPDF}
					icon={<Download size={14} className="sm:w-4 sm:h-4" />}
					className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
				>
					Download PDF
				</Button>
			</div>

			{toastVisible && (
				<Toast
					message={toastMessage}
					type="success"
					onClose={() => setToastVisible(false)}
				/>
			)}
		</>
	);
};

const Dollar = ({ className }: { className?: string }) => {
	return (
		<svg
			className={className}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="12" y1="1" x2="12" y2="23"></line>
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
		</svg>
	);
};

const ChevronLeft = ({ className }: { className?: string }) => {
	return (
		<svg
			className={className}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="15 18 9 12 15 6"></polyline>
		</svg>
	);
};

const ChevronRight = ({ className }: { className?: string }) => {
	return (
		<svg
			className={className}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="9 18 15 12 9 6"></polyline>
		</svg>
	);
};

const WaterUsageSimulator = () => {
	const [householdData, setHouseholdData] = useState<HouseholdData>({
		residents: 2,
		bathrooms: 1,
		hasGarden: false,
		hasDishwasher: false,
		washingFrequency: 3,
		showerDuration: 8,
	});

	const [savedTips, setSavedTips] = useState<SavedTip[]>([]);

	const waterUsage = calculateWaterUsage(householdData);

	const recommendations = generateRecommendations(householdData, waterUsage);

	const { isDarkMode } = useTheme();

	const handleSaveTip = (tipText: string) => {
		if (!savedTips.some((tip) => tip.text === tipText)) {
			setSavedTips([
				...savedTips,
				{
					id: `tip-${Date.now()}`,
					text: tipText,
					saved: true,
				},
			]);
		}
	};

	const handleRemoveTip = (id: string) => {
		setSavedTips(savedTips.filter((tip) => tip.id !== id));
	};

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${
				isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
			}`}
		>
			<Header />
			<main>
				<Hero />

				<section id="calculator" className="py-10 sm:py-16">
					<div className="container mx-auto px-4">
						<div className="text-center mb-8 sm:mb-12">
							<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
								Water Usage{" "}
								<span
									className={isDarkMode ? "text-blue-400" : "text-blue-600"}
								>
									Simulator
								</span>
							</h2>
							<p className="text-sm sm:text-base max-w-2xl mx-auto opacity-80">
								Adjust your household parameters to see real-time changes in
								your water consumption.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
							<WaterCalculatorForm
								data={householdData}
								onChange={setHouseholdData}
							/>
							<WaterUsageVisualizer usage={waterUsage} />
						</div>

						{}
						{savedTips.length > 0 && (
							<SavedTipsSection
								savedTips={savedTips}
								onRemoveTip={handleRemoveTip}
							/>
						)}

						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
							<div className="mb-3 sm:mb-0">
								<h2 className="text-xl sm:text-2xl font-bold">
									Analysis & Recommendations
								</h2>
								<p className="text-xs sm:text-sm opacity-70 mt-1">
									Personalized insights based on your data
								</p>
							</div>
							<DataExportButtons />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
							<RecommendationsSection
								recommendations={recommendations}
								savedTips={savedTips}
								onSaveTip={handleSaveTip}
							/>
							<ComparisonSection
								usage={waterUsage}
								residents={householdData.residents}
							/>
						</div>
					</div>
				</section>

				<section
					id="insights"
					className={`py-10 sm:py-16 transition-colors duration-300 ${
						isDarkMode ? "bg-gray-800" : "bg-blue-50"
					}`}
				>
					<div className="container mx-auto px-4">
						<div className="text-center mb-8 sm:mb-12">
							<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
								Water{" "}
								<span
									className={isDarkMode ? "text-blue-400" : "text-blue-600"}
								>
									Insights
								</span>
							</h2>
							<p className="text-sm sm:text-base max-w-2xl mx-auto opacity-80">
								Discover how small changes can lead to significant water and
								financial savings.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
							<SavingsCalculator />
							<div className="space-y-6 sm:space-y-8">
								<WaterSavingTips
									onSaveTip={handleSaveTip}
									savedTips={savedTips}
								/>
								<ResourcesSection />
							</div>
						</div>
					</div>
				</section>

				<section id="tips" className="py-10 sm:py-16">
					<div className="container mx-auto px-4">
						<div className="text-center mb-8 sm:mb-12">
							<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
								Water Saving{" "}
								<span
									className={isDarkMode ? "text-blue-400" : "text-blue-600"}
								>
									Tips
								</span>
							</h2>
							<p className="text-sm sm:text-base max-w-2xl mx-auto opacity-80">
								Practical strategies to reduce your water consumption in every
								area of your home.
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
							{[
								{
									title: "In the Bathroom",
									tips: [
										"Take shorter showers - aim for 5 minutes or less",
										"Install a low-flow showerhead to reduce water usage by up to 40%",
										"Turn off the faucet while brushing teeth or shaving",
										"Check for toilet leaks by adding food coloring to the tank",
										"Install a dual-flush toilet or place a water displacement device in the tank",
									],
									icon: "🚿",
									color: "blue",
								},
								{
									title: "In the Kitchen",
									tips: [
										"Only run the dishwasher when full",
										"Scrape plates instead of rinsing before loading the dishwasher",
										"Keep a pitcher of drinking water in the refrigerator",
										"Thaw food in the refrigerator, not under running water",
										"Use a basin for washing produce rather than running water",
									],
									icon: "🍽️",
									color: "orange",
								},
								{
									title: "Outdoors",
									tips: [
										"Water plants in the early morning or evening to reduce evaporation",
										"Use a rain barrel to collect water for garden irrigation",
										"Choose native, drought-resistant plants for your garden",
										"Use a broom instead of a hose to clean driveways and sidewalks",
										"Check sprinkler systems for leaks and adjust to avoid watering pavement",
									],
									icon: "🌱",
									color: "green",
								},
							].map((category, index) => (
								<Card
									key={index}
									className="transform transition-all duration-300 hover:-translate-y-2"
									hoverEffect={true}
								>
									<div className="flex items-center mb-3 sm:mb-4">
										<div
											className={`p-2 sm:p-3 rounded-lg ${
												isDarkMode
													? `bg-${category.color}-900/30`
													: `bg-${category.color}-50`
											}`}
											style={{
												background: isDarkMode
													? `rgba(${
															category.color === "blue"
																? "30, 64, 175"
																: category.color === "green"
																? "6, 78, 59"
																: "154, 52, 18"
													  }, 0.2)`
													: `rgba(${
															category.color === "blue"
																? "239, 246, 255"
																: category.color === "green"
																? "240, 253, 244"
																: "255, 247, 237"
													  }, 1)`,
											}}
										>
											<span className="text-2xl sm:text-3xl mr-3">
												{category.icon}
											</span>
										</div>
										<h3 className="text-base sm:text-xl font-bold">
											{category.title}
										</h3>
									</div>

									<ul className="space-y-2 sm:space-y-3">
										{category.tips.map((tip, tipIndex) => (
											<li key={tipIndex} className="flex items-start">
												<span
													className={`mr-2 mt-1 inline-block rounded-full p-1 ${
														isDarkMode
															? `bg-${category.color}-900/30 text-${category.color}-400`
															: `bg-${category.color}-100 text-${category.color}-700`
													}`}
													style={{
														background: isDarkMode
															? `rgba(${
																	category.color === "blue"
																		? "30, 64, 175"
																		: category.color === "green"
																		? "6, 78, 59"
																		: "154, 52, 18"
															  }, 0.3)`
															: `rgba(${
																	category.color === "blue"
																		? "219, 234, 254"
																		: category.color === "green"
																		? "220, 252, 231"
																		: "255, 237, 213"
															  }, 1)`,
														color: isDarkMode
															? `rgba(${
																	category.color === "blue"
																		? "96, 165, 250"
																		: category.color === "green"
																		? "34, 197, 94"
																		: "249, 115, 22"
															  }, 1)`
															: `rgba(${
																	category.color === "blue"
																		? "29, 78, 216"
																		: category.color === "green"
																		? "16, 122, 87"
																		: "194, 65, 12"
															  }, 1)`,
													}}
												>
													<Check size={12} />
												</span>
												<span className="text-xs sm:text-sm">{tip}</span>
											</li>
										))}
									</ul>

									<Button
										variant="outline"
										className="w-full mt-3 sm:mt-4 text-xs sm:text-sm py-1 sm:py-2"
										onClick={() => {
											const tipToSave =
												category.tips[
													Math.floor(Math.random() * category.tips.length)
												];
											handleSaveTip(tipToSave);
										}}
										icon={<Heart size={14} />}
									>
										Save these tips
									</Button>
								</Card>
							))}
						</div>
					</div>
				</section>

				<TestimonialsSection />

				<ContactSection />
			</main>

			<Footer />
			<ScrollToTopButton />
		</div>
	);
};

const WaterAnimations = () => {
	return (
		<style jsx global>{`
			.wave-effect {
				position: absolute;
				top: -50%;
				left: -100%;
				width: 300%;
				height: 300%;
				background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23ffffff30'/%3E%3C/svg%3E");
				background-size: 800px 88.7px;
				background-repeat: repeat-x;
				animation: wave 10s linear infinite;
			}

			.wave1 {
				z-index: 3;
				opacity: 0.7;
				animation-duration: 8s;
			}

			.wave2 {
				z-index: 2;
				opacity: 0.3;
				background-position: 120px 0;
				animation-duration: 13s;
			}

			@keyframes wave {
				0% {
					transform: translate(-200px, 0);
				}
				100% {
					transform: translate(0, 0);
				}
			}

			.droplet {
				position: absolute;
				width: 12px;
				height: 12px;
				background: rgba(255, 255, 255, 0.6);
				border-radius: 100% 0 100% 100%;
				transform: rotate(45deg);
				top: 0;
				animation: droplet-fall 2.5s ease-in infinite;
			}

			@keyframes droplet-fall {
				0% {
					transform: rotate(45deg) translateY(-10px);
					opacity: 0;
				}
				30% {
					opacity: 0.6;
				}
				80% {
					opacity: 0.8;
				}
				100% {
					transform: rotate(45deg) translateY(120px);
					opacity: 0;
				}
			}

			.water-flow {
				position: absolute;
				width: 2px;
				top: 0;
				bottom: 0;
				left: 0;
				background: linear-gradient(
					to bottom,
					rgba(0, 0, 0, 0) 0%,
					#3b82f6 100%
				);
				animation: water-flow 2s ease-in-out infinite;
			}

			.water-flow-dark {
				background: linear-gradient(
					to bottom,
					rgba(0, 0, 0, 0) 0%,
					#3b82f6 100%
				);
			}

			.water-flow-light {
				background: linear-gradient(
					to bottom,
					rgba(0, 0, 0, 0) 0%,
					#60a5fa 100%
				);
			}

			@keyframes water-flow {
				0% {
					height: 0%;
				}
				100% {
					height: 100%;
				}
			}

			.water-fill {
				animation: water-fill 4s ease-in-out infinite alternate;
			}

			@keyframes water-fill {
				0% {
					height: 5px;
				}
				100% {
					height: 16px;
				}
			}

			.progress-bar-animated {
				position: relative;
				overflow: hidden;
			}

			.progress-bar-animated:after {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				background-image: linear-gradient(
					-45deg,
					rgba(255, 255, 255, 0.2) 25%,
					transparent 25%,
					transparent 50%,
					rgba(255, 255, 255, 0.2) 50%,
					rgba(255, 255, 255, 0.2) 75%,
					transparent 75%,
					transparent
				);
				z-index: 1;
				background-size: 50px 50px;
				animation: move 2s linear infinite;
				overflow: hidden;
			}

			@keyframes move {
				0% {
					background-position: 0 0;
				}
				100% {
					background-position: 50px 50px;
				}
			}

			.animate-fade-in-up {
				animation: fade-in-up 0.3s ease-out;
			}

			@keyframes fade-in-up {
				0% {
					opacity: 0;
					transform: translateY(10px);
				}
				100% {
					opacity: 1;
					transform: translateY(0);
				}
			}
			button,a{
			cursor: pointer;
			}
		`}</style>
	);
};

const App = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setIsDarkMode(prefersDark);
	}, []);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	const themeContextValue = { isDarkMode, toggleTheme };

	return (
		<ThemeContext.Provider value={themeContextValue}>
			<WaterUsageSimulator />
			<WaterAnimations />
		</ThemeContext.Provider>
	);
};

export default App;
