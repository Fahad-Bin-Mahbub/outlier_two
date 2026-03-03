"use client";

import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "react";
import {
	FaTruck,
	FaMap,
	FaThLarge,
	FaChartBar,
	FaSearch,
	FaSun,
	FaMoon,
	FaArrowRight,
	FaTimes,
	FaChartLine,
	FaBox,
	FaClock,
	FaMapMarkerAlt,
	FaChartArea,
	FaFilter,
	FaSync,
	FaBolt,
	FaBullseye,
	FaCalendarAlt,
	FaCompass,
	FaEye,
	FaStar,
	FaLayerGroup,
	FaChevronRight,
	FaPlayCircle,
	FaCheckCircle,
	FaExclamationTriangle,
	FaLaptop,
	FaCouch,
	FaUtensils,
	FaCog,
	FaLandmark,
	FaBuilding,
	FaUmbrella,
	FaMountain,
	FaChevronDown,
	FaSortUp,
	FaSortDown,
	FaSort,
} from "react-icons/fa";
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface Shipment {
	id: string;
	origin: { lat: number; lng: number; name: string };
	destination: { lat: number; lng: number; name: string };
	status: "in-transit" | "delivered" | "delayed" | "pending";
	cargo: string;
	weight: number;
	eta: string;
	driver: string;
	progress: number;
}

interface PerformanceData {
	date: string;
	delivered: number;
	delayed: number;
	inTransit: number;
}

interface SortConfig {
	key: string;
	direction: "asc" | "desc";
}

const generateShipments = (): Shipment[] => {
	const statuses: Shipment["status"][] = [
		"in-transit",
		"delivered",
		"delayed",
		"pending",
	];
	const cargos = [
		"Electronics",
		"Furniture",
		"Food & Beverages",
		"Textiles",
		"Machinery",
	];
	const cities = [
		{ name: "New York", lat: 40.7128, lng: -74.006 },
		{ name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
		{ name: "Chicago", lat: 41.8781, lng: -87.6298 },
		{ name: "Houston", lat: 29.7604, lng: -95.3698 },
		{ name: "Phoenix", lat: 33.4484, lng: -112.074 },
		{ name: "Miami", lat: 25.7617, lng: -80.1918 },
		{ name: "Seattle", lat: 47.6062, lng: -122.3321 },
		{ name: "Denver", lat: 39.7392, lng: -104.9903 },
	];

	return Array.from({ length: 15 }, (_, i) => {
		const origin = cities[Math.floor(Math.random() * cities.length)];
		const destination = cities.filter((c) => c.name !== origin.name)[
			Math.floor(Math.random() * (cities.length - 1))
		];

		return {
			id: `TRK-${String(1000 + i).padStart(4, "0")}`,
			origin,
			destination,
			status: statuses[Math.floor(Math.random() * statuses.length)],
			cargo: cargos[Math.floor(Math.random() * cargos.length)],
			weight: Math.floor(Math.random() * 5000) + 100,
			eta: new Date(
				Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
			).toISOString(),
			driver: `Driver ${Math.floor(Math.random() * 20) + 1}`,
			progress: Math.floor(Math.random() * 100),
		};
	});
};

const generatePerformanceData = (): PerformanceData[] => {
	return Array.from({ length: 7 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (6 - i));
		return {
			date: date.toLocaleDateString("en", { weekday: "short" }),
			delivered: Math.floor(Math.random() * 50) + 20,
			delayed: Math.floor(Math.random() * 10) + 2,
			inTransit: Math.floor(Math.random() * 30) + 10,
		};
	});
};

export default function LogisticTrackerExport() {
	const [shipments, setShipments] = useState<Shipment[]>([]);
	const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
	const [selectedCargoType, setSelectedCargoType] = useState<string | null>(
		null
	);
	const [selectedStatus, setSelectedStatus] = useState<
		Shipment["status"] | "all"
	>("all");
	const [activeView, setActiveView] = useState<"map" | "grid" | "charts">(
		"map"
	);

	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [hoveredShipment, setHoveredShipment] = useState<string | null>(null);
	const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
	const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
	const [highlightedItems, setHighlightedItems] = useState<Set<string>>(
		new Set()
	);
	const [animationTrigger, setAnimationTrigger] = useState(0);

	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "id",
		direction: "asc",
	});

	useEffect(() => {
		const fetchData = async () => {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setShipments(generateShipments());
			setIsLoading(false);
		};
		fetchData();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setShipments((prev) =>
				prev.map((shipment) => ({
					...shipment,
					progress:
						shipment.status === "in-transit"
							? Math.min(shipment.progress + Math.random() * 3, 100)
							: shipment.progress,
				}))
			);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	const generateSearchSuggestions = useMemo(() => {
		if (!searchTerm || searchTerm.length < 2) return [];

		const term = searchTerm.toLowerCase();
		const suggestions = new Set<string>();

		shipments.forEach((shipment) => {
			if (shipment.id.toLowerCase().includes(term)) {
				suggestions.add(shipment.id);
			}

			if (shipment.cargo.toLowerCase().includes(term)) {
				suggestions.add(shipment.cargo);
			}

			if (shipment.driver.toLowerCase().includes(term)) {
				suggestions.add(shipment.driver);
			}

			if (shipment.origin.name.toLowerCase().includes(term)) {
				suggestions.add(shipment.origin.name);
			}
			if (shipment.destination.name.toLowerCase().includes(term)) {
				suggestions.add(shipment.destination.name);
			}
		});

		return Array.from(suggestions).slice(0, 8);
	}, [shipments, searchTerm]);

	useEffect(() => {
		setSearchSuggestions(generateSearchSuggestions);
		setShowSearchSuggestions(
			searchTerm.length >= 2 && generateSearchSuggestions.length > 0
		);
	}, [generateSearchSuggestions, searchTerm]);

	const handleItemSelection = useCallback(
		(
			shipmentId: string | null,
			type: "shipment" | "cargo" | "status" = "shipment"
		) => {
			setSelectedShipment(shipmentId);
			setAnimationTrigger((prev) => prev + 1);

			if (shipmentId) {
				const shipment = shipments.find((s) => s.id === shipmentId);
				if (shipment) {
					const relatedItems = new Set<string>();

					relatedItems.add(shipmentId);

					shipments
						.filter((s) => s.cargo === shipment.cargo)
						.forEach((s) => relatedItems.add(s.id));

					shipments
						.filter((s) => s.status === shipment.status)
						.forEach((s) => relatedItems.add(s.id));

					shipments
						.filter(
							(s) =>
								s.origin.name === shipment.origin.name ||
								s.destination.name === shipment.destination.name
						)
						.forEach((s) => relatedItems.add(s.id));

					setHighlightedItems(relatedItems);
				}
			} else {
				setHighlightedItems(new Set());
			}
		},
		[shipments]
	);

	const handleCargoFilter = useCallback(
		(cargo: string | null) => {
			setSelectedCargoType(cargo);
			if (cargo) {
				const relatedShipments = shipments.filter((s) => s.cargo === cargo);
				setHighlightedItems(new Set(relatedShipments.map((s) => s.id)));
			} else {
				setHighlightedItems(new Set());
			}
		},
		[shipments]
	);

	const handleStatusFilter = useCallback(
		(status: Shipment["status"] | "all") => {
			setSelectedStatus(status);
			if (status !== "all") {
				const relatedShipments = shipments.filter((s) => s.status === status);
				setHighlightedItems(new Set(relatedShipments.map((s) => s.id)));
			} else {
				setHighlightedItems(new Set());
			}
		},
		[shipments]
	);

	const handleSort = useCallback((key: string) => {
		setSortConfig((prevConfig) => {
			if (prevConfig.key === key) {
				return {
					key,
					direction: prevConfig.direction === "asc" ? "desc" : "asc",
				};
			}
			return { key, direction: "asc" };
		});
	}, []);

	const SortIcon = ({ column }: { column: string }) => {
		if (sortConfig.key !== column)
			return <FaSort className="w-3 h-3 ml-1 text-gray-400" />;
		return sortConfig.direction === "asc" ? (
			<FaSortUp className="w-3 h-3 ml-1 text-blue-500" />
		) : (
			<FaSortDown className="w-3 h-3 ml-1 text-blue-500" />
		);
	};
	const filteredShipments = useMemo(() => {
		let result = [...shipments];

		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			result = result.filter(
				(s) =>
					s.id.toLowerCase().includes(term) ||
					s.cargo.toLowerCase().includes(term) ||
					s.driver.toLowerCase().includes(term) ||
					s.origin.name.toLowerCase().includes(term) ||
					s.destination.name.toLowerCase().includes(term)
			);
		}

		if (selectedStatus !== "all") {
			result = result.filter((s) => s.status === selectedStatus);
		}

		if (selectedCargoType) {
			result = result.filter((s) => s.cargo === selectedCargoType);
		}

		return result;
	}, [shipments, searchTerm, selectedStatus, selectedCargoType]);

	const sortedFilteredShipments = useMemo(() => {
		let result = [...filteredShipments];

		if (sortConfig.key) {
			result.sort((a: any, b: any) => {
				const getNestedValue = (obj: any, path: string) => {
					const keys = path.split(".");
					return keys.reduce(
						(o, key) => (o && o[key] !== undefined ? o[key] : null),
						obj
					);
				};

				let aValue = getNestedValue(a, sortConfig.key);
				let bValue = getNestedValue(b, sortConfig.key);

				if (typeof aValue === "string" && typeof bValue === "string") {
					aValue = aValue.toLowerCase();
					bValue = bValue.toLowerCase();
				}

				if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
				if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}

		return result;
	}, [filteredShipments, sortConfig]);

	const handleRefresh = useCallback(() => {
		setIsLoading(true);
		setTimeout(() => {
			setShipments(generateShipments());
			setAnimationTrigger((prev) => prev + 1);
			setIsLoading(false);
		}, 500);
	}, []);

	const getStatusConfig = (status: Shipment["status"]) => {
		const configs = {
			delivered: {
				bg: "bg-emerald-50",
				text: "text-emerald-700",
				border: "border-emerald-200",
				dot: "bg-emerald-500",
			},
			"in-transit": {
				bg: "bg-blue-50",
				text: "text-blue-700",
				border: "border-blue-200",
				dot: "bg-blue-500",
			},
			delayed: {
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-200",
				dot: "bg-red-500",
			},
			pending: {
				bg: "bg-amber-50",
				text: "text-amber-700",
				border: "border-amber-200",
				dot: "bg-amber-500",
			},
		};
		return configs[status];
	};

	const stats = useMemo(() => {
		const relevantShipments =
			highlightedItems.size > 0
				? shipments.filter((s) => highlightedItems.has(s.id))
				: filteredShipments;

		const total = relevantShipments.length;
		const delivered = relevantShipments.filter(
			(s) => s.status === "delivered"
		).length;
		const inTransit = relevantShipments.filter(
			(s) => s.status === "in-transit"
		).length;
		const delayed = relevantShipments.filter(
			(s) => s.status === "delayed"
		).length;
		const pending = relevantShipments.filter(
			(s) => s.status === "pending"
		).length;
		const onTimeRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

		return { total, delivered, inTransit, delayed, pending, onTimeRate };
	}, [shipments, filteredShipments, highlightedItems]);

	const dynamicPerformanceData = useMemo(() => {
		const relevantShipments =
			highlightedItems.size > 0
				? shipments.filter((s) => highlightedItems.has(s.id))
				: filteredShipments;

		if (relevantShipments.length === 0) {
			return generatePerformanceData().map((day) => ({
				...day,
				delivered: 0,
				inTransit: 0,
				delayed: 0,
			}));
		}

		const statusCounts = {
			delivered: relevantShipments.filter((s) => s.status === "delivered")
				.length,
			inTransit: relevantShipments.filter((s) => s.status === "in-transit")
				.length,
			delayed: relevantShipments.filter((s) => s.status === "delayed").length,
			pending: relevantShipments.filter((s) => s.status === "pending").length,
		};

		const baseData = generatePerformanceData();
		return baseData.map((day, index) => {
			const dayMultiplier = 0.8 + 0.4 * Math.sin((index + 2) * 0.7);
			const scaledTotal = Math.max(
				1,
				Math.round((relevantShipments.length * dayMultiplier) / 7)
			);

			const total = relevantShipments.length;
			let delivered = 0,
				inTransit = 0,
				delayed = 0;

			if (statusCounts.delivered > 0) {
				delivered = Math.max(
					1,
					Math.round(scaledTotal * (statusCounts.delivered / total))
				);
			}
			if (statusCounts.inTransit > 0) {
				inTransit = Math.max(
					1,
					Math.round(scaledTotal * (statusCounts.inTransit / total))
				);
			}
			if (statusCounts.delayed > 0) {
				delayed = Math.max(
					1,
					Math.round(scaledTotal * (statusCounts.delayed / total))
				);
			}

			const currentTotal = delivered + inTransit + delayed;
			if (currentTotal > scaledTotal && scaledTotal > 0) {
				const factor = scaledTotal / currentTotal;
				delivered = Math.floor(delivered * factor);
				inTransit = Math.floor(inTransit * factor);
				delayed = Math.floor(delayed * factor);

				if (statusCounts.delivered > 0 && delivered === 0) delivered = 1;
				if (statusCounts.inTransit > 0 && inTransit === 0) inTransit = 1;
				if (statusCounts.delayed > 0 && delayed === 0) delayed = 1;
			}

			return {
				...day,
				delivered,
				inTransit,
				delayed,
			};
		});
	}, [shipments, filteredShipments, highlightedItems]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center">
				<div className="text-center text-white">
					<div className="relative mb-8">
						<div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
						<FaTruck className="absolute inset-0 m-auto w-8 h-8 text-white" />
					</div>
					<h1 className="text-4xl font-bold mb-2">LogiFlow</h1>
					<p className="text-white/80 text-lg">
						Initializing your logistics dashboard...
					</p>
					<div className="mt-8 w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
						<div
							className="h-full bg-white rounded-full animate-pulse"
							style={{ width: "60%" }}
						></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen bg-slate-50 antialiased transition-all duration-500 ease-out"
			style={{
				fontFamily:
					"'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			}}
		>
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

				html {
					font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
						"Segoe UI", Roboto, sans-serif !important;
				}

				body {
					font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
						"Segoe UI", Roboto, sans-serif !important;
				}

				* {
					font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
						"Segoe UI", Roboto, sans-serif !important;
				}

				button,
				a {
					cursor: pointer;
				}
				h1,
				h2,
				h3,
				h4,
				h5,
				h6,
				p,
				span,
				div,
				button,
				input,
				select,
				textarea {
					font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
						"Segoe UI", Roboto, sans-serif !important;
				}

				:root {
					--color-primary-50: #f0f9ff;
					--color-primary-100: #e0f2fe;
					--color-primary-200: #bae6fd;
					--color-primary-300: #7dd3fc;
					--color-primary-400: #38bdf8;
					--color-primary-500: #0ea5e9;
					--color-primary-600: #0284c7;
					--color-primary-700: #0369a1;
					--color-primary-800: #075985;
					--color-primary-900: #0c4a6e;

					--color-accent-50: #fdf4ff;
					--color-accent-100: #fae8ff;
					--color-accent-200: #f5d0fe;
					--color-accent-300: #f0abfc;
					--color-accent-400: #e879f9;
					--color-accent-500: #d946ef;
					--color-accent-600: #c026d3;
					--color-accent-700: #a21caf;
					--color-accent-800: #86198f;
					--color-accent-900: #701a75;

					--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					--gradient-ocean: linear-gradient(
						135deg,
						#0ea5e9 0%,
						#3b82f6 50%,
						#8b5cf6 100%
					);
					--gradient-sunset: linear-gradient(
						135deg,
						#f97316 0%,
						#ec4899 50%,
						#8b5cf6 100%
					);
					--gradient-emerald: linear-gradient(135deg, #10b981 0%, #059669 100%);
					--gradient-ruby: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);

					--shadow-soft: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
						0 1px 2px 0 rgba(0, 0, 0, 0.06);
					--shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
						0 2px 4px -1px rgba(0, 0, 0, 0.06);
					--shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
						0 4px 6px -2px rgba(0, 0, 0, 0.05);
					--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
						0 10px 10px -5px rgba(0, 0, 0, 0.04);
				}

				.modern-card {
					background: rgba(255, 255, 255, 0.95);
					backdrop-filter: blur(20px);
					border: 1px solid rgba(203, 213, 225, 0.3);
					box-shadow: var(--shadow-large);
					transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.modern-card:hover {
					transform: translateY(-2px);
					box-shadow: var(--shadow-xl);
				}

				.glass-premium {
					background: rgba(255, 255, 255, 0.85);
					backdrop-filter: blur(25px) saturate(200%);
					border: 1px solid rgba(255, 255, 255, 0.25);
					box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
				}

				.neo-brutalism {
					background: #ffffff;
					border: 2px solid #000000;
					box-shadow: 4px 4px 0px #000000;
					transition: all 0.15s ease;
				}

				.neo-brutalism:hover {
					transform: translate(-2px, -2px);
					box-shadow: 6px 6px 0px #000000;
				}

				.gradient-border {
					position: relative;
					background: var(--gradient-ocean);
					background-size: 200% 200%;
					animation: gradientFlow 4s ease infinite;
				}

				@keyframes gradientFlow {
					0%,
					100% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
				}

				.floating-animation {
					animation: float 6s ease-in-out infinite;
				}

				@keyframes float {
					0%,
					100% {
						transform: translateY(0px) rotate(0deg);
					}
					33% {
						transform: translateY(-10px) rotate(1deg);
					}
					66% {
						transform: translateY(-5px) rotate(-1deg);
					}
				}

				.pulse-glow {
					animation: pulseGlow 2s ease-in-out infinite alternate;
				}

				@keyframes pulseGlow {
					from {
						box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
					}
					to {
						box-shadow: 0 0 30px rgba(59, 130, 246, 0.8),
							0 0 40px rgba(139, 92, 246, 0.3);
					}
				}

				.morphing-card {
					transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
					transform-style: preserve-3d;
				}

				.morphing-card:hover {
					transform: rotateY(5deg) rotateX(5deg);
				}

				.highlight-flash {
					animation: highlightFlash 1s ease-in-out;
				}

				@keyframes highlightFlash {
					0% {
						background-color: rgba(59, 130, 246, 0.1);
					}
					50% {
						background-color: rgba(59, 130, 246, 0.3);
					}
					100% {
						background-color: transparent;
					}
				}

				.micro-interaction {
					transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.micro-interaction:hover {
					transform: scale(1.02);
				}

				.micro-interaction:active {
					transform: scale(0.98);
				}

				.route-animate {
					stroke-dasharray: 1000;
					stroke-dashoffset: 1000;
					animation: drawRoute 3s ease-in-out infinite;
				}

				@keyframes drawRoute {
					0% {
						stroke-dashoffset: 1000;
					}
					50% {
						stroke-dashoffset: 0;
					}
					100% {
						stroke-dashoffset: -1000;
					}
				}

				.status-indicator {
					position: relative;
					overflow: hidden;
				}

				.status-indicator::before {
					content: "";
					position: absolute;
					top: 0;
					left: -100%;
					width: 100%;
					height: 100%;
					background: linear-gradient(
						90deg,
						transparent,
						rgba(255, 255, 255, 0.6),
						transparent
					);
					animation: shimmer 2s infinite;
				}

				@keyframes shimmer {
					0% {
						left: -100%;
					}
					100% {
						left: 100%;
					}
				}

				@media (max-width: 750px) and (min-width: 635px) {
					.nav-container {
						flex-direction: column;
						align-items: flex-start;
					}

					.nav-buttons {
						width: 100%;
						overflow-x: auto;
						padding-bottom: 0.5rem;
					}

					.nav-controls {
						width: 100%;
						justify-content: space-between;
						margin-top: 0.5rem;
					}
				}

				@media (max-width: 480px) {
					.chart-container {
						height: 250px !important;
					}

					.stat-card {
						padding: 0.75rem !important;
					}

					.stat-value {
						font-size: 1.25rem !important;
					}

					.chart-legend text {
						font-size: 10px !important;
					}

					.footer-section {
						padding: 1.5rem !important;
					}

					.footer-section h4 {
						margin-bottom: 1rem !important;
					}

					.system-health-section {
						margin-top: 1.5rem !important;
					}
				}

				@media (max-width: 360px) {
					.header-logo {
						display: none;
					}

					.search-bar {
						width: 100% !important;
					}

					.stat-card {
						padding: 0.5rem !important;
					}

					.header-title {
						font-size: 1rem !important;
					}

					.chart-container {
						height: 200px !important;
					}
				}

				.shipment-card {
					border-radius: 1rem !important;
					overflow: hidden;
				}
			`}</style>

			{}
			<header className="sticky top-0 z-50 glass-premium border-b border-slate-200/50 backdrop-blur-xl">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
						<div className="flex items-center space-x-3 sm:space-x-6">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl header-logo">
									<FaTruck className="w-5 h-5 text-white" />
								</div>
							</div>
							<div className="block">
								<h1 className="text-xl font-bold text-slate-900 tracking-tight header-title">
									LogiFlow
								</h1>
								<p className="text-xs text-slate-500 font-medium">
									Smart Logistics Platform
								</p>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
							<div className="flex items-center space-x-4 w-full sm:w-auto">
								<div className="relative flex-1 sm:flex-none">
									<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-sm opacity-20 animate-pulse"></div>
									<div className="relative">
										<FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
										<input
											type="text"
											placeholder="Search shipments, cargo, routes..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											onFocus={() =>
												setShowSearchSuggestions(
													searchTerm.length >= 2 && searchSuggestions.length > 0
												)
											}
											onBlur={() =>
												setTimeout(() => setShowSearchSuggestions(false), 200)
											}
											className="pl-12 pr-12 py-2 sm:py-3 w-full sm:w-80 lg:w-96 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 placeholder-slate-400 text-sm font-medium shadow-sm search-bar"
										/>
										{searchTerm && (
											<button
												onClick={() => {
													setSearchTerm("");
													setShowSearchSuggestions(false);
													setHighlightedItems(new Set());
												}}
												className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors micro-interaction"
											>
												<FaTimes className="w-4 h-4" />
											</button>
										)}
									</div>
								</div>

								<div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-400 to-green-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg status-indicator">
									<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
									<span className="text-xs sm:text-sm font-bold text-white">
										LIVE
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			{}
			<nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between py-4 nav-container">
						<div className="flex flex-wrap gap-2 sm:gap-0 sm:flex-row sm:space-y-0 sm:space-x-2 nav-buttons overflow-x-auto pb-2 sm:pb-0">
							{[
								{
									id: "map",
									label: "Live Tracking",
									icon: FaMap,
									gradient: "from-blue-500 to-cyan-500",
								},
								{
									id: "grid",
									label: "Shipments",
									icon: FaThLarge,
									gradient: "from-purple-500 to-pink-500",
								},
								{
									id: "charts",
									label: "Analytics",
									icon: FaChartBar,
									gradient: "from-orange-500 to-red-500",
								},
							].map(({ id, label, icon: Icon, gradient }) => (
								<button
									key={id}
									onClick={() => {
										setActiveView(id as any);
										setAnimationTrigger((prev) => prev + 1);
									}}
									className={`relative group flex ml-1 items-center space-x-2 sm:space-x-3 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 ${
										activeView === id
											? "bg-white shadow-xl text-slate-900 scale-105"
											: "text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:scale-102"
									}`}
								>
									{activeView === id && (
										<div
											className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl sm:rounded-2xl opacity-10 animate-pulse`}
										></div>
									)}
									<div className="relative z-10 w-4 h-4 sm:w-5 sm:h-5">
										<Icon
											className={`w-4 h-4 sm:w-5 sm:h-5 ${
												activeView === id ? "text-blue-600" : ""
											}`}
										/>
									</div>
									<span className="relative z-10 text-sm sm:text-base">
										{label}
									</span>
									{activeView === id && (
										<div
											className={`absolute -bottom-1 left-3 sm:left-6 right-3 sm:right-6 h-0.5 bg-gradient-to-r ${gradient} rounded-full`}
										></div>
									)}
								</button>
							))}
						</div>

						<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-4 nav-controls">
							<div className="text-sm text-slate-500 text-center sm:text-left">
								<span className="font-medium">{filteredShipments.length}</span>{" "}
								of <span className="font-medium">{shipments.length}</span>{" "}
								shipments
							</div>
							<div className="hidden sm:block w-px h-6 bg-slate-200"></div>
							<button
								onClick={handleRefresh}
								className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors micro-interaction"
							>
								<FaSync className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
								<span className="text-xs sm:text-sm font-medium text-slate-600">
									Refresh
								</span>
							</button>
						</div>
					</div>
				</div>
			</nav>

			{}
			<main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
				{}
				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
					{[
						{
							title: "Total Shipments",
							value: stats.total,
							change: "+12%",
							trend: "up",
							icon: FaBox,
							gradient: "from-blue-500 to-purple-600",
							bgGradient: "from-blue-50 to-purple-50",
							description: "from last week",
						},
						{
							title: "In Transit",
							value: stats.inTransit,
							change: "Live",
							trend: "neutral",
							icon: FaTruck,
							gradient: "from-cyan-500 to-blue-500",
							bgGradient: "from-cyan-50 to-blue-50",
							description: "active routes",
						},
						{
							title: "Delivered",
							value: stats.delivered,
							change: `${stats.onTimeRate}%`,
							trend: "up",
							icon: FaBullseye,
							gradient: "from-emerald-500 to-green-600",
							bgGradient: "from-emerald-50 to-green-50",
							description: "on-time rate",
						},
						{
							title: "Delayed",
							value: stats.delayed,
							change: "Priority",
							trend: "down",
							icon: FaClock,
							gradient: "from-orange-500 to-red-500",
							bgGradient: "from-orange-50 to-red-50",
							description: "needs attention",
						},
					].map((stat, index) => (
						<div
							key={stat.title}
							className="modern-card rounded-3xl p-4 sm:p-6 morphing-card stat-card"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
										{stat.title}
									</p>
									<p className="text-xl sm:text-3xl font-bold text-slate-900 mt-2 font-inter stat-value">
										{stat.value}
									</p>
								</div>
								<div
									className={`w-10 h-10 mt-1 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl floating-animation`}
								>
									<stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div
									className={`flex items-center space-x-2 px-2 sm:px-3 py-1 bg-gradient-to-r ${stat.bgGradient} rounded-full`}
								>
									{stat.trend === "up" && (
										<FaChartLine className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-600" />
									)}
									{stat.trend === "down" && (
										<FaChartArea className="w-2 h-2 sm:w-3 sm:h-3 text-orange-600" />
									)}
									{stat.trend === "neutral" && (
										<FaPlayCircle className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600" />
									)}
									<span
										className={`text-xs font-bold ${
											stat.trend === "up"
												? "text-emerald-700"
												: stat.trend === "down"
												? "text-orange-700"
												: "text-blue-700"
										}`}
									>
										{stat.change}
									</span>
								</div>
								<span className="text-xs hidden md:block text-slate-500 font-medium">
									{stat.description}
								</span>
							</div>
						</div>
					))}
				</div>

				{}
				<div className="modern-card rounded-3xl p-4 sm:p-6">
					<div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:items-center lg:justify-between lg:gap-6">
						<div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-6">
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center">
									<FaFilter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
								</div>
								<div>
									<h3 className="text-base sm:text-lg font-bold text-slate-900">
										Smart Filters
									</h3>
									<p className="text-xs sm:text-sm text-slate-500">
										Real-time cross-filtering
									</p>
								</div>
							</div>

							<div className="hidden sm:block h-8 w-px bg-slate-200"></div>

							<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:flex-wrap sm:items-center sm:gap-4">
								<div className="relative">
									<select
										value={selectedStatus}
										onChange={(e) =>
											handleStatusFilter(
												e.target.value as Shipment["status"] | "all"
											)
										}
										className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
									>
										<option value="all">All Status</option>
										<option value="in-transit">In Transit</option>
										<option value="delivered">Delivered</option>
										<option value="delayed">Delayed</option>
										<option value="pending">Pending</option>
									</select>
								</div>

								<div className="relative">
									<select
										value={selectedCargoType || ""}
										onChange={(e) => handleCargoFilter(e.target.value || null)}
										className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
									>
										<option value="">All Cargo Types</option>
										<option value="Electronics">Electronics</option>
										<option value="Furniture">Furniture</option>
										<option value="Food & Beverages">Food & Beverages</option>
										<option value="Textiles">Textiles</option>
										<option value="Machinery">Machinery</option>
									</select>
								</div>

								{(selectedStatus !== "all" ||
									selectedCargoType ||
									searchTerm) && (
									<button
										onClick={() => {
											setSelectedStatus("all");
											setSelectedCargoType(null);
											setSearchTerm("");
											setHighlightedItems(new Set());
										}}
										className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl sm:rounded-2xl transition-colors micro-interaction"
									>
										<FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
										<span className="text-xs sm:text-sm font-medium">
											Clear All
										</span>
									</button>
								)}
							</div>
						</div>

						<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-4">
							<div className="flex items-center space-x-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 rounded-xl sm:rounded-2xl">
								<FaLayerGroup className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
								<span className="text-xs sm:text-sm font-bold text-slate-900">
									{filteredShipments.length}
								</span>
								<span className="text-xs sm:text-sm text-slate-500">
									of {shipments.length}
								</span>
							</div>

							{highlightedItems.size > 0 && (
								<div className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-xl sm:rounded-2xl pulse-glow">
									<FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
									<span className="text-xs sm:text-sm font-medium text-blue-700">
										{highlightedItems.size} highlighted
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{}
				{activeView === "map" && (
					<div className="space-y-6 lg:space-y-8">
						{}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
							{}
							<div className="modern-card rounded-3xl overflow-hidden h-fit">
								<div className="p-4 sm:p-6 border-b border-slate-200/50">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
												<FaMap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
											</div>
											<div>
												<h2 className="text-lg sm:text-2xl font-bold text-slate-900">
													Live Tracking Center
												</h2>
												<p className="text-xs sm:text-sm text-slate-500 font-medium">
													Real-time shipment visualization
												</p>
											</div>
										</div>

										<div className="flex flex-wrap items-center gap-1 sm:gap-3">
											{[
												{
													status: "delivered",
													color: "emerald",
													label: "Delivered",
													count: stats.delivered,
												},
												{
													status: "in-transit",
													color: "blue",
													label: "In Transit",
													count: stats.inTransit,
												},
												{
													status: "delayed",
													color: "red",
													label: "Delayed",
													count: stats.delayed,
												},
												{
													status: "pending",
													color: "amber",
													label: "Pending",
													count: stats.pending,
												},
											].map((item) => (
												<button
													key={item.status}
													onClick={() => handleStatusFilter(item.status as any)}
													className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl transition-all duration-300 micro-interaction ${
														selectedStatus === item.status
															? `bg-${item.color}-100 ring-2 ring-${item.color}-500/30`
															: "bg-slate-50 hover:bg-slate-100"
													}`}
												>
													<div
														className={`w-2 h-2 sm:w-3 sm:h-3 bg-${
															item.color
														}-500 rounded-full ${
															item.status === "in-transit"
																? "animate-pulse"
																: ""
														}`}
													></div>
													<span
														className={`text-xs font-semibold ${
															selectedStatus === item.status
																? `text-${item.color}-700`
																: "text-slate-600"
														}`}
													>
														{item.count}
													</span>
												</button>
											))}
										</div>
									</div>
								</div>

								<div className="p-4 sm:p-8">
									<div className="relative">
										<div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl border border-slate-200 overflow-hidden relative shadow-2xl">
											{}
											<svg
												className="absolute inset-0 w-full h-full"
												viewBox="150 150 700 300"
												preserveAspectRatio="xMidYMid meet"
											>
												{}
												<path
													d="M 200 200 L 800 200 L 820 250 L 850 300 L 800 350 L 600 370 L 400 360 L 200 340 L 180 300 L 200 200 Z"
													fill="none"
													stroke="#3b82f6"
													strokeWidth="2"
													strokeDasharray="5,5"
													className="opacity-30"
												/>

												{}
												<g
													stroke="#6366f1"
													strokeWidth="1"
													opacity="0.2"
													fill="none"
												>
													<line x1="300" y1="200" x2="320" y2="370" />
													<line x1="400" y1="200" x2="400" y2="360" />
													<line x1="500" y1="200" x2="520" y2="370" />
													<line x1="600" y1="200" x2="620" y2="370" />
													<line x1="700" y1="200" x2="720" y2="350" />
													<line x1="200" y1="250" x2="800" y2="270" />
													<line x1="200" y1="300" x2="800" y2="320" />
												</g>

												{}
												{[
													{ name: "NYC", x: 750, y: 230, size: 8 },
													{ name: "LA", x: 250, y: 320, size: 8 },
													{ name: "Chicago", x: 550, y: 240, size: 6 },
													{ name: "Houston", x: 480, y: 340, size: 6 },
													{ name: "Phoenix", x: 350, y: 320, size: 5 },
													{ name: "Miami", x: 720, y: 360, size: 5 },
													{ name: "Seattle", x: 280, y: 180, size: 5 },
													{ name: "Denver", x: 450, y: 270, size: 5 },
												].map((city, i) => (
													<g key={i}>
														<circle
															cx={city.x}
															cy={city.y}
															r={city.size}
															fill="#6366f1"
															className="opacity-60"
														/>
														<text
															x={city.x}
															y={city.y - city.size - 5}
															fontSize="10"
															fill="#4f46e5"
															textAnchor="middle"
															className="font-medium"
														>
															{city.name}
														</text>
													</g>
												))}

												{}
												{filteredShipments.map((shipment, index) => {
													const cityPositions = [
														{ x: 750, y: 230 },
														{ x: 250, y: 320 },
														{ x: 550, y: 240 },
														{ x: 480, y: 340 },
														{ x: 350, y: 320 },
														{ x: 720, y: 360 },
														{ x: 280, y: 180 },
														{ x: 450, y: 270 },
													];

													const origin = cityPositions[index % 8];
													const dest = cityPositions[(index + 2) % 8];

													const statusColors = {
														delivered: "#10b981",
														"in-transit": "#3b82f6",
														delayed: "#ef4444",
														pending: "#f59e0b",
													};

													return (
														<g key={shipment.id}>
															{}
															<line
																x1={origin.x}
																y1={origin.y}
																x2={dest.x}
																y2={dest.y}
																stroke={statusColors[shipment.status]}
																strokeWidth={
																	selectedShipment === shipment.id ? "4" : "2"
																}
																strokeDasharray={
																	shipment.status === "in-transit"
																		? "8,4"
																		: "none"
																}
																className={`transition-all duration-300 ${
																	shipment.status === "in-transit"
																		? "route-line"
																		: ""
																} ${
																	selectedShipment === shipment.id ||
																	hoveredShipment === shipment.id
																		? "opacity-100"
																		: "opacity-70"
																}`}
																style={{
																	cursor: "pointer",
																	filter:
																		selectedShipment === shipment.id
																			? "drop-shadow(0 0 6px currentColor)"
																			: "none",
																}}
																onClick={() =>
																	setSelectedShipment(
																		selectedShipment === shipment.id
																			? null
																			: shipment.id
																	)
																}
																onMouseEnter={() =>
																	setHoveredShipment(shipment.id)
																}
																onMouseLeave={() => setHoveredShipment(null)}
															/>

															{}
															{shipment.status === "in-transit" && (
																<circle
																	cx={
																		origin.x +
																		(dest.x - origin.x) *
																			(shipment.progress / 100)
																	}
																	cy={
																		origin.y +
																		(dest.y - origin.y) *
																			(shipment.progress / 100)
																	}
																	r="4"
																	fill="#3b82f6"
																	className="map-vehicle"
																	style={{
																		filter: "drop-shadow(0 0 4px #3b82f6)",
																	}}
																/>
															)}

															{}
															{selectedShipment === shipment.id && (
																<circle
																	cx={origin.x}
																	cy={origin.y}
																	r="12"
																	fill="none"
																	stroke={statusColors[shipment.status]}
																	strokeWidth="2"
																	className="animate-ping opacity-50"
																/>
															)}
														</g>
													);
												})}
											</svg>

											{}
											<div className="absolute inset-0 pointer-events-none">
												{}
												<div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
													<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
													<span className="text-xs sm:text-sm font-semibold text-gray-700">
														LIVE TRACKING
													</span>
												</div>

												{}
												<div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200">
													<h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
														Shipment Status
													</h4>
													<div className="space-y-1 sm:space-y-2 text-xs">
														<div className="flex items-center space-x-3">
															<div className="w-4 h-1 bg-green-500 rounded"></div>
															<span className="text-gray-700 font-medium">
																Delivered (
																{
																	shipments.filter(
																		(s) => s.status === "delivered"
																	).length
																}
																)
															</span>
														</div>
														<div className="flex items-center space-x-3">
															<div className="w-4 h-1 bg-blue-500 rounded animate-pulse"></div>
															<span className="text-gray-700 font-medium">
																In Transit (
																{
																	shipments.filter(
																		(s) => s.status === "in-transit"
																	).length
																}
																)
															</span>
														</div>
														<div className="flex items-center space-x-3">
															<div className="w-4 h-1 bg-red-500 rounded"></div>
															<span className="text-gray-700 font-medium">
																Delayed (
																{
																	shipments.filter(
																		(s) => s.status === "delayed"
																	).length
																}
																)
															</span>
														</div>
														<div className="flex items-center space-x-3">
															<div className="w-4 h-1 bg-yellow-500 rounded"></div>
															<span className="text-gray-700 font-medium">
																Pending (
																{
																	shipments.filter(
																		(s) => s.status === "pending"
																	).length
																}
																)
															</span>
														</div>
													</div>
												</div>

												{}
												<div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
													<div className="text-xs text-gray-600 mb-1">
														Active Routes
													</div>
													<div className="text-lg sm:text-2xl font-bold text-gray-900">
														{filteredShipments.length}
													</div>
													<div className="text-xs text-emerald-600 font-medium mt-1">
														{Math.round(
															(shipments.filter((s) => s.status === "delivered")
																.length /
																shipments.length) *
																100
														)}
														% Complete
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{}
							<div className="modern-card rounded-3xl overflow-hidden h-fit">
								<div className="p-4 sm:p-6 border-b border-slate-200/50">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
												<FaChartArea className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
											</div>
											<div>
												<h3 className="text-lg sm:text-xl font-bold text-slate-900">
													Active Shipments
												</h3>
												<p className="text-xs sm:text-sm text-slate-500 mt-1">
													Click to highlight on map
												</p>
											</div>
										</div>
										<div className="flex items-center space-x-2 px-2 sm:px-3 py-1 bg-blue-50 rounded-full">
											<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
											<span className="text-xs font-medium text-blue-700">
												{filteredShipments.length} Active
											</span>
										</div>
									</div>
								</div>
								<div className="h-[350px] sm:h-[566px] overflow-y-auto px-3 sm:px-5">
									{filteredShipments.slice(0, 8).map((shipment) => (
										<div
											key={shipment.id}
											className={`p-3 sm:p-5 border-b border-slate-100 last:border-b-0 cursor-pointer transition-all duration-300 hover:bg-slate-50 ${
												selectedShipment === shipment.id
													? "bg-blue-50 border-l-4 border-l-blue-500 shadow-lg"
													: highlightedItems.has(shipment.id)
													? "bg-purple-50 border-l-4 border-l-purple-400"
													: ""
											} micro-interaction shipment-card rounded-xl mb-2`}
											onClick={() => handleItemSelection(shipment.id)}
											onMouseEnter={() => setHoveredShipment(shipment.id)}
											onMouseLeave={() => setHoveredShipment(null)}
										>
											<div className="flex items-center justify-between mb-2 sm:mb-3">
												<div className="flex items-center space-x-2 sm:space-x-3">
													<div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center">
														<FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
													</div>
													<span className="font-bold text-slate-900 text-xs sm:text-sm">
														{shipment.id}
													</span>
												</div>
												<span
													className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold status-indicator ${
														getStatusConfig(shipment.status).bg
													} ${getStatusConfig(shipment.status).text} ${
														getStatusConfig(shipment.status).border
													} border`}
												>
													{shipment.status}
												</span>
											</div>

											<div className="space-y-2 text-xs sm:text-sm">
												<div className="flex items-center text-slate-700">
													<FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-slate-500" />
													<span className="font-medium">
														{shipment.origin.name}
													</span>
													<FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mx-2 text-slate-400" />
													<span className="font-medium">
														{shipment.destination.name}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<div className="flex items-center text-slate-600">
														<FaBox className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-slate-500" />
														<span>{shipment.cargo}</span>
													</div>
													<span className="text-xs text-slate-500 font-medium">
														{shipment.weight} kg
													</span>
												</div>

												{shipment.status === "in-transit" && (
													<div className="mt-3 p-2 sm:p-3 bg-blue-50 rounded-xl">
														<div className="flex justify-between items-center mb-1 sm:mb-2">
															<span className="text-xs text-slate-600 font-medium">
																Progress
															</span>
															<span className="text-xs font-bold text-blue-600">
																{Math.round(shipment.progress)}%
															</span>
														</div>
														<div className="w-full bg-blue-200 rounded-full h-1.5 sm:h-2">
															<div
																className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 shadow-sm"
																style={{ width: `${shipment.progress}%` }}
															></div>
														</div>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{}
						{selectedShipment && (
							<div className="modern-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-xl">
								<div className="p-4 sm:p-6 border-b border-slate-200/50">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
												<FaEye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
											</div>
											<div>
												<h3 className="text-lg sm:text-xl font-bold text-slate-900">
													Shipment Details
												</h3>
												<p className="text-xs sm:text-sm text-slate-500 mt-1">
													Complete tracking information for selected shipment
												</p>
											</div>
										</div>
										<button
											onClick={() => setSelectedShipment(null)}
											className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors duration-200 micro-interaction"
										>
											<FaTimes className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
										</button>
									</div>
								</div>
								{(() => {
									const shipment = shipments.find(
										(s) => s.id === selectedShipment
									);
									if (!shipment) return null;

									return (
										<div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
											<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
												<div className="space-y-1">
													<p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
														Shipment ID
													</p>
													<p className="font-bold text-slate-900 text-base sm:text-lg">
														{shipment.id}
													</p>
												</div>
												<div className="space-y-1">
													<p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
														Status
													</p>
													<span
														className={`inline-flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-bold ${
															getStatusConfig(shipment.status).bg
														} ${getStatusConfig(shipment.status).text} ${
															getStatusConfig(shipment.status).border
														} border-2`}
													>
														<div
															className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${
																getStatusConfig(shipment.status).dot
															} rounded-full`}
														></div>
														<span>{shipment.status}</span>
													</span>
												</div>
												<div className="space-y-1">
													<p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
														Cargo Type
													</p>
													<p className="font-bold text-slate-900 text-sm sm:text-base">
														{shipment.cargo}
													</p>
												</div>
												<div className="space-y-1">
													<p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
														Weight
													</p>
													<p className="font-bold text-slate-900 text-sm sm:text-base">
														{shipment.weight} kg
													</p>
												</div>
												<div className="space-y-1">
													<p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
														Driver
													</p>
													<p className="font-bold text-slate-900 text-sm sm:text-base">
														{shipment.driver}
													</p>
												</div>
												<div className="space-y-1">
													<p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
														ETA
													</p>
													<p className="font-bold text-slate-900 text-sm sm:text-base">
														{new Date(shipment.eta).toLocaleDateString()}
													</p>
												</div>
											</div>

											<div className="p-4 sm:p-6 bg-slate-50 rounded-2xl">
												<div className="flex items-center space-x-2 mb-4 sm:mb-6">
													<FaCompass className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
													<p className="text-sm sm:text-base font-bold text-slate-900">
														Route Information
													</p>
												</div>
												<div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
													<div className="flex items-center space-x-4 sm:space-x-6 w-full">
														<div className="flex flex-col items-center space-y-2">
															<div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full"></div>
															<span className="font-bold text-slate-900 text-xs sm:text-sm text-center">
																{shipment.origin.name}
															</span>
															<span className="text-xs text-slate-500">
																Origin
															</span>
														</div>
														<div className="flex-1 flex items-center justify-center">
															<div className="flex-1 h-px bg-slate-300"></div>
															<FaArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400 mx-2 sm:mx-4" />
															<div className="flex-1 h-px bg-slate-300"></div>
														</div>
														<div className="flex flex-col items-center space-y-2">
															<div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full"></div>
															<span className="font-bold text-slate-900 text-xs sm:text-sm text-center">
																{shipment.destination.name}
															</span>
															<span className="text-xs text-slate-500">
																Destination
															</span>
														</div>
													</div>
												</div>
											</div>

											{shipment.status === "in-transit" && (
												<div className="p-4 sm:p-6 bg-blue-50 rounded-2xl">
													<div className="flex items-center space-x-2 mb-3 sm:mb-4">
														<FaChartArea className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
														<p className="text-sm sm:text-base font-bold text-blue-900">
															Live Progress
														</p>
													</div>
													<div className="flex justify-between items-center mb-3 sm:mb-4">
														<span className="text-xs sm:text-sm text-slate-600 font-medium">
															Current Progress
														</span>
														<span className="text-xl sm:text-2xl font-bold text-blue-600">
															{Math.round(shipment.progress)}%
														</span>
													</div>
													<div className="w-full bg-blue-200 rounded-full h-3 sm:h-4">
														<div
															className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 sm:h-4 rounded-full transition-all duration-500 shadow-sm"
															style={{ width: `${shipment.progress}%` }}
														></div>
													</div>
													<div className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-700 font-medium">
														Estimated completion:{" "}
														{new Date(shipment.eta).toLocaleDateString()}
													</div>
												</div>
											)}
										</div>
									);
								})()}
							</div>
						)}
					</div>
				)}

				{}
				{activeView === "grid" && (
					<div className="glass-card rounded-2xl">
						<div className="p-4 sm:p-6 border-b border-white/20">
							<div className="flex items-center justify-between">
								<h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
									<FaThLarge className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
									Shipment Details
								</h2>
								<div className="text-xs sm:text-sm text-gray-600">
									{filteredShipments.length} shipments
								</div>
							</div>
						</div>

						<div className="overflow-x-auto">
							{}
							<div className="hidden sm:block">
								<table className="w-full">
									<thead>
										<tr className="bg-white/10">
											<th
												className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
												onClick={() => handleSort("id")}
											>
												<div className="flex items-center">
													Shipment ID
													<SortIcon column="id" />
												</div>
											</th>
											<th
												className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
												onClick={() => handleSort("status")}
											>
												<div className="flex items-center">
													Status
													<SortIcon column="status" />
												</div>
											</th>
											<th
												className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
												onClick={() => handleSort("cargo")}
											>
												<div className="flex items-center">
													Cargo
													<SortIcon column="cargo" />
												</div>
											</th>
											<th
												className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
												onClick={() => handleSort("origin.name")}
											>
												<div className="flex items-center">
													Route
													<SortIcon column="origin.name" />
												</div>
											</th>
											<th
												className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
												onClick={() => handleSort("progress")}
											>
												<div className="flex items-center">
													Progress
													<SortIcon column="progress" />
												</div>
											</th>
											<th
												className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
												onClick={() => handleSort("eta")}
											>
												<div className="flex items-center">
													ETA
													<SortIcon column="eta" />
												</div>
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-white/10">
										{sortedFilteredShipments.map((shipment) => (
											<tr
												key={shipment.id}
												className={`hover:bg-white/10 cursor-pointer transition-all duration-200 ${
													selectedShipment === shipment.id
														? "bg-indigo-100/70"
														: ""
												} ${
													hoveredShipment === shipment.id
														? "ring-2 ring-indigo-500 ring-opacity-50"
														: ""
												}`}
												onClick={() =>
													setSelectedShipment(
														selectedShipment === shipment.id
															? null
															: shipment.id
													)
												}
												onMouseEnter={() => setHoveredShipment(shipment.id)}
												onMouseLeave={() => setHoveredShipment(null)}
											>
												<td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
															<FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
														</div>
														<div className="ml-3">
															<div className="text-xs sm:text-sm font-medium text-gray-900">
																{shipment.id}
															</div>
															<div className="text-xs text-gray-500">
																{shipment.driver}
															</div>
														</div>
													</div>
												</td>
												<td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
													<span
														className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
															getStatusConfig(shipment.status).bg
														} ${getStatusConfig(shipment.status).text} ${
															getStatusConfig(shipment.status).border
														} border`}
													>
														<div
															className={`w-1.5 h-1.5 ${
																getStatusConfig(shipment.status).dot
															} rounded-full mr-2 mt-0.5`}
														></div>
														{shipment.status}
													</span>
												</td>
												<td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
													<div className="text-xs sm:text-sm text-gray-900 font-medium">
														{shipment.cargo}
													</div>
													<div className="text-xs text-gray-500">
														{shipment.weight} kg
													</div>
												</td>
												<td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
													<div className="flex items-center text-xs sm:text-sm">
														<FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" />
														<span className="text-gray-900">
															{shipment.origin.name}
														</span>
														<FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mx-2 text-gray-400" />
														<FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-500" />
														<span className="text-gray-900">
															{shipment.destination.name}
														</span>
													</div>
												</td>
												<td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="w-16 sm:w-24 bg-gray-200/50 rounded-full h-1.5 sm:h-2 mr-3">
															<div
																className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
																	shipment.status === "delivered"
																		? "bg-emerald-500"
																		: shipment.status === "in-transit"
																		? "bg-blue-500"
																		: shipment.status === "delayed"
																		? "bg-red-500"
																		: "bg-amber-500"
																}`}
																style={{ width: `${shipment.progress}%` }}
															></div>
														</div>
														<span className="text-xs sm:text-sm text-gray-500">
															{Math.round(shipment.progress)}%
														</span>
													</div>
												</td>
												<td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
													<div className="text-xs sm:text-sm text-gray-900">
														{new Date(shipment.eta).toLocaleDateString()}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{}
							<div className="sm:hidden space-y-4 p-3">
								{sortedFilteredShipments.map((shipment) => (
									<div
										key={shipment.id}
										className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 shipment-card"
									>
										<div
											className="p-3 sm:p-4 cursor-pointer"
											onClick={() =>
												setSelectedShipment(
													selectedShipment === shipment.id ? null : shipment.id
												)
											}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-2 sm:space-x-3">
													<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
														<FaTruck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
													</div>
													<div>
														<div className="font-medium text-gray-900 text-xs sm:text-sm">
															{shipment.id}
														</div>
														<div className="text-xs text-gray-500">
															{shipment.driver}
														</div>
													</div>
												</div>
												<FaChevronDown
													className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${
														selectedShipment === shipment.id
															? "transform rotate-180"
															: ""
													}`}
												/>
											</div>
											<div className="mt-3 flex items-center justify-between">
												<span
													className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
														getStatusConfig(shipment.status).bg
													} ${getStatusConfig(shipment.status).text} ${
														getStatusConfig(shipment.status).border
													} border`}
												>
													<div
														className={`w-1.5 h-1.5 ${
															getStatusConfig(shipment.status).dot
														} rounded-full mr-2 mt-0.5`}
													></div>
													{shipment.status}
												</span>
												<div className="text-xs text-gray-500">
													{new Date(shipment.eta).toLocaleDateString()}
												</div>
											</div>
										</div>

										{}
										{selectedShipment === shipment.id && (
											<div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4 border-t border-slate-100">
												<div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4">
													<div>
														<div className="text-xs text-gray-500 font-medium mb-1">
															Cargo Type
														</div>
														<div className="text-xs sm:text-sm font-medium text-gray-900">
															{shipment.cargo}
														</div>
													</div>
													<div>
														<div className="text-xs text-gray-500 font-medium mb-1">
															Weight
														</div>
														<div className="text-xs sm:text-sm font-medium text-gray-900">
															{shipment.weight} kg
														</div>
													</div>
												</div>

												<div>
													<div className="text-xs text-gray-500 font-medium mb-2">
														Route
													</div>
													<div className="flex items-center space-x-2 text-xs sm:text-sm">
														<div className="flex items-center">
															<FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
															<span className="text-gray-900">
																{shipment.origin.name}
															</span>
														</div>
														<FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
														<div className="flex items-center">
															<FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1" />
															<span className="text-gray-900">
																{shipment.destination.name}
															</span>
														</div>
													</div>
												</div>

												<div>
													<div className="text-xs text-gray-500 font-medium mb-1 sm:mb-2">
														Progress
													</div>
													<div className="flex items-center space-x-3">
														<div className="flex-1 bg-gray-200/50 rounded-full h-1.5 sm:h-2">
															<div
																className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
																	shipment.status === "delivered"
																		? "bg-emerald-500"
																		: shipment.status === "in-transit"
																		? "bg-blue-500"
																		: shipment.status === "delayed"
																		? "bg-red-500"
																		: "bg-amber-500"
																}`}
																style={{ width: `${shipment.progress}%` }}
															></div>
														</div>
														<span className="text-xs font-medium text-gray-900">
															{Math.round(shipment.progress)}%
														</span>
													</div>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{}
				{activeView === "charts" && (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
						{}
						<div className="modern-card rounded-3xl overflow-hidden">
							<div className="p-4 sm:p-6 border-b border-slate-200/50">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3 sm:space-x-4">
										<div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
											<FaChartBar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
										</div>
										<div>
											<h2 className="text-base sm:text-xl font-bold text-slate-900">
												Daily Performance
											</h2>
											<p className="text-xs sm:text-sm text-slate-500 mt-1">
												Last 7 days delivery metrics
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-2 px-2 sm:px-3 py-1 bg-blue-50 rounded-full">
										<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
										<span className="text-xs font-medium text-blue-700">
											{highlightedItems.size > 0
												? `${highlightedItems.size} Selected`
												: "Live Data"}
										</span>
									</div>
								</div>
							</div>
							<div className="p-3 sm:p-6">
								<div className="chart-container" style={{ height: "320px" }}>
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={dynamicPerformanceData}
											margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
										>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#e2e8f0"
												opacity={0.5}
											/>
											<XAxis
												dataKey="date"
												tick={{
													fill: "#64748b",
													fontSize: 11,
													fontWeight: 500,
												}}
												axisLine={{ stroke: "#cbd5e1" }}
												tickLine={{ stroke: "#cbd5e1" }}
											/>
											<YAxis
												tick={{
													fill: "#64748b",
													fontSize: 11,
													fontWeight: 500,
												}}
												axisLine={{ stroke: "#cbd5e1" }}
												tickLine={{ stroke: "#cbd5e1" }}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.98)",
													backdropFilter: "blur(20px)",
													border: "1px solid #e2e8f0",
													borderRadius: "16px",
													boxShadow:
														"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
													padding: "12px",
												}}
											/>
											<Legend
												wrapperStyle={{ paddingTop: "10px" }}
												iconType="circle"
												iconSize={8}
												formatter={(value) => (
													<span className="text-xs">{value}</span>
												)}
											/>
											<Bar
												dataKey="delivered"
												fill="url(#deliveredGradient)"
												name="Delivered"
												radius={[4, 4, 0, 0]}
												stroke="#10b981"
												strokeWidth={1}
											/>
											<Bar
												dataKey="inTransit"
												fill="url(#inTransitGradient)"
												name="In Transit"
												radius={[4, 4, 0, 0]}
												stroke="#3b82f6"
												strokeWidth={1}
											/>
											<Bar
												dataKey="delayed"
												fill="url(#delayedGradient)"
												name="Delayed"
												radius={[4, 4, 0, 0]}
												stroke="#ef4444"
												strokeWidth={1}
											/>
											<defs>
												<linearGradient
													id="deliveredGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#10b981"
														stopOpacity={0.9}
													/>
													<stop
														offset="95%"
														stopColor="#10b981"
														stopOpacity={0.7}
													/>
												</linearGradient>
												<linearGradient
													id="inTransitGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#3b82f6"
														stopOpacity={0.9}
													/>
													<stop
														offset="95%"
														stopColor="#3b82f6"
														stopOpacity={0.7}
													/>
												</linearGradient>
												<linearGradient
													id="delayedGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#ef4444"
														stopOpacity={0.9}
													/>
													<stop
														offset="95%"
														stopColor="#ef4444"
														stopOpacity={0.7}
													/>
												</linearGradient>
											</defs>
										</BarChart>
									</ResponsiveContainer>
								</div>

								{}
								<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
									<div className="grid grid-cols-3 gap-2 sm:gap-4">
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-emerald-600">
												{dynamicPerformanceData.reduce(
													(acc, day) => acc + day.delivered,
													0
												)}
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Total Delivered
											</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-blue-600">
												{dynamicPerformanceData.reduce(
													(acc, day) => acc + day.inTransit,
													0
												)}
											</div>
											<div className="text-xs text-slate-500 font-medium">
												In Progress
											</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-red-600">
												{dynamicPerformanceData.reduce(
													(acc, day) => acc + day.delayed,
													0
												)}
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Total Delayed
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{}
						<div className="modern-card rounded-3xl overflow-hidden">
							<div className="p-4 sm:p-6 border-b border-slate-200/50">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3 sm:space-x-4">
										<div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
											<FaChartLine className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
										</div>
										<div>
											<h2 className="text-base sm:text-xl font-bold text-slate-900">
												Delivery Trends
											</h2>
											<p className="text-xs sm:text-sm text-slate-500 mt-1">
												Weekly performance trends
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-2 px-2 sm:px-3 py-1 bg-emerald-50 rounded-full">
										<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
										<span className="text-xs font-medium text-emerald-700">
											{highlightedItems.size > 0
												? `${highlightedItems.size} Selected`
												: "Trending Up"}
										</span>
									</div>
								</div>
							</div>
							<div className="p-3 sm:p-6">
								<div className="chart-container" style={{ height: "320px" }}>
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart
											data={dynamicPerformanceData}
											margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
										>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#e2e8f0"
												opacity={0.5}
											/>
											<XAxis
												dataKey="date"
												tick={{
													fill: "#64748b",
													fontSize: 11,
													fontWeight: 500,
												}}
												axisLine={{ stroke: "#cbd5e1" }}
												tickLine={{ stroke: "#cbd5e1" }}
											/>
											<YAxis
												tick={{
													fill: "#64748b",
													fontSize: 11,
													fontWeight: 500,
												}}
												axisLine={{ stroke: "#cbd5e1" }}
												tickLine={{ stroke: "#cbd5e1" }}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.98)",
													backdropFilter: "blur(20px)",
													border: "1px solid #e2e8f0",
													borderRadius: "16px",
													boxShadow:
														"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
													padding: "12px",
												}}
											/>
											<Area
												type="monotone"
												dataKey="delivered"
												stackId="1"
												stroke="#10b981"
												strokeWidth={2}
												fill="url(#areaDeliveredGradient)"
												name="Delivered"
											/>
											<Area
												type="monotone"
												dataKey="inTransit"
												stackId="1"
												stroke="#3b82f6"
												strokeWidth={2}
												fill="url(#areaInTransitGradient)"
												name="In Transit"
											/>
											<Area
												type="monotone"
												dataKey="delayed"
												stackId="1"
												stroke="#ef4444"
												strokeWidth={2}
												fill="url(#areaDelayedGradient)"
												name="Delayed"
											/>
											<Legend
												wrapperStyle={{ paddingTop: "10px" }}
												iconType="circle"
												iconSize={8}
												formatter={(value) => (
													<span className="text-xs">{value}</span>
												)}
											/>
											<defs>
												<linearGradient
													id="areaDeliveredGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#10b981"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#10b981"
														stopOpacity={0.1}
													/>
												</linearGradient>
												<linearGradient
													id="areaInTransitGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#3b82f6"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#3b82f6"
														stopOpacity={0.1}
													/>
												</linearGradient>
												<linearGradient
													id="areaDelayedGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#ef4444"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#ef4444"
														stopOpacity={0.1}
													/>
												</linearGradient>
											</defs>
										</AreaChart>
									</ResponsiveContainer>
								</div>

								{}
								<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
									<div className="grid grid-cols-3 gap-2 sm:gap-4">
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-emerald-600">
												+
												{Math.round(
													(((dynamicPerformanceData[
														dynamicPerformanceData.length - 1
													]?.delivered || 0) -
														(dynamicPerformanceData[0]?.delivered || 0)) /
														(dynamicPerformanceData[0]?.delivered || 1)) *
														100
												)}
												%
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Delivery Growth
											</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-blue-600">
												{Math.round(
													dynamicPerformanceData.reduce(
														(acc, day) => acc + day.inTransit,
														0
													) / dynamicPerformanceData.length
												)}
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Daily Avg
											</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-orange-600">
												{Math.round(
													(dynamicPerformanceData.reduce(
														(acc, day) => acc + day.delayed,
														0
													) /
														dynamicPerformanceData.reduce(
															(acc, day) =>
																acc +
																day.delivered +
																day.inTransit +
																day.delayed,
															0
														)) *
														100
												)}
												%
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Delay Rate
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{}
						<div className="modern-card rounded-3xl overflow-hidden">
							<div className="p-4 sm:p-6 border-b border-slate-200/50">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3 sm:space-x-4">
										<div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
											<FaChartArea className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
										</div>
										<div>
											<h2 className="text-base sm:text-xl font-bold text-slate-900">
												Status Distribution
											</h2>
											<p className="text-xs sm:text-sm text-slate-500 mt-1">
												Current shipment status breakdown
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-2 px-2 sm:px-3 py-1 bg-purple-50 rounded-full">
										<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse"></div>
										<span className="text-xs font-medium text-purple-700">
											{highlightedItems.size > 0
												? `${highlightedItems.size} Selected`
												: "Live Status"}
										</span>
									</div>
								</div>
							</div>
							<div className="p-3 sm:p-6">
								<div
									className="chart-container"
									style={{
										height: "320px",
										width: "100%",
										overflow: "visible",
									}}
								>
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={[
													{
														name: "Delivered",
														value: stats.delivered,
														color: "#10b981",
													},
													{
														name: "In Transit",
														value: stats.inTransit,
														color: "#3b82f6",
													},
													{
														name: "Delayed",
														value: stats.delayed,
														color: "#ef4444",
													},
													{
														name: "Pending",
														value: stats.pending,
														color: "#f59e0b",
													},
												]}
												cx="50%"
												cy="52%"
												innerRadius={55}
												outerRadius={85}
												paddingAngle={3}
												dataKey="value"
												stroke="#ffffff"
												strokeWidth={2}
											>
												{[
													{
														name: "Delivered",
														value: stats.delivered,
														color: "#10b981",
													},
													{
														name: "In Transit",
														value: stats.inTransit,
														color: "#3b82f6",
													},
													{
														name: "Delayed",
														value: stats.delayed,
														color: "#ef4444",
													},
													{
														name: "Pending",
														value: stats.pending,
														color: "#f59e0b",
													},
												].map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.98)",
													backdropFilter: "blur(20px)",
													border: "1px solid #e2e8f0",
													borderRadius: "16px",
													boxShadow:
														"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
													padding: "12px",
												}}
												formatter={(value, name) => [
													<div key="tooltip" className="space-y-1">
														<div className="font-semibold text-slate-900">
															{name}
														</div>
														<div className="text-xl sm:text-2xl font-bold text-blue-600">
															{value}
														</div>
														<div className="text-xs sm:text-sm text-slate-500">
															{Math.round(
																(value / Math.max(1, stats.total)) * 100
															)}
															% of total
														</div>
													</div>,
													"",
												]}
												labelFormatter={() => ""}
											/>
											<Legend
												verticalAlign="bottom"
												height={36}
												iconType="circle"
												iconSize={8}
												formatter={(value) => (
													<span className="text-xs">{value}</span>
												)}
												wrapperStyle={{ paddingTop: "10px" }}
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>

								{}
								<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
									<div className="grid grid-cols-2 gap-2 sm:gap-4">
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-emerald-600">
												{Math.round(
													(stats.delivered / Math.max(1, stats.total)) * 100
												)}
												%
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Success Rate
											</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-blue-600">
												{stats.inTransit}
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Active Now
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{}
						<div className="modern-card rounded-3xl overflow-hidden">
							<div className="p-4 sm:p-6 border-b border-slate-200/50">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-base sm:text-xl font-bold text-slate-900">
											Route Efficiency
										</h2>
										<p className="text-xs sm:text-sm text-slate-500 mt-1">
											Popular shipping routes and efficiency
										</p>
									</div>
									<div className="flex items-center space-x-2 px-2 sm:px-3 py-1 bg-purple-50 rounded-full">
										<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse"></div>
										<span className="text-xs font-medium text-purple-700">
											Route Analytics
										</span>
									</div>
								</div>
							</div>
							<div className="p-3 sm:p-6">
								{}
								<div className="grid grid-cols-1 gap-3 sm:gap-4">
									{[
										{
											route: "New York → Los Angeles",
											shipments: 8,
											efficiency: 92,
											time: "3.2 days",
											icon: <FaLandmark className="w-3 h-3 sm:w-4 sm:h-4" />,
										},
										{
											route: "Chicago → Houston",
											shipments: 6,
											efficiency: 88,
											time: "2.1 days",
											icon: <FaBuilding className="w-3 h-3 sm:w-4 sm:h-4" />,
										},
										{
											route: "Miami → Seattle",
											shipments: 5,
											efficiency: 85,
											time: "4.5 days",
											icon: <FaUmbrella className="w-3 h-3 sm:w-4 sm:h-4" />,
										},
										{
											route: "Phoenix → Denver",
											shipments: 4,
											efficiency: 90,
											time: "1.8 days",
											icon: <FaMountain className="w-3 h-3 sm:w-4 sm:h-4" />,
										},
									].map((route, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl sm:rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-300 micro-interaction"
										>
											<div className="flex items-center space-x-3 sm:space-x-4">
												<div className="text-lg sm:text-2xl">{route.icon}</div>
												<div>
													<div className="font-semibold text-slate-900 text-xs sm:text-sm">
														{route.route}
													</div>
													<div className="text-xs text-slate-500">
														{route.shipments} shipments • {route.time} avg
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-lg sm:text-2xl font-bold text-purple-600">
													{route.efficiency}%
												</div>
												<div className="text-xs text-slate-500">efficiency</div>
											</div>
										</div>
									))}
								</div>

								{}
								<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
									<div className="grid grid-cols-3 gap-2 sm:gap-4">
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-blue-600">
												{Math.round((filteredShipments.length / 4) * 10) / 10}
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Avg Route Load
											</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-purple-600">
												2.9
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Days Avg
											</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-bold text-emerald-600">
												89%
											</div>
											<div className="text-xs text-slate-500 font-medium">
												Route Efficiency
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>

			{}
			<footer className="modern-card mx-4 sm:mx-6 lg:mx-8 rounded-3xl mt-8 sm:mt-12 mb-4 sm:mb-8 overflow-hidden">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
						<div className="space-y-4 sm:space-y-6">
							<div className="flex items-center space-x-3 sm:space-x-4">
								<div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl floating-animation">
									<FaTruck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
								</div>
								<div>
									<h3 className="text-lg sm:text-2xl font-bold text-slate-900">
										LogiFlow
									</h3>
									<p className="text-xs sm:text-sm text-slate-500 font-medium">
										Smart Logistics Platform
									</p>
								</div>
							</div>
							<p className="text-sm text-slate-600 leading-relaxed">
								Real-time logistics tracking and analytics platform for modern
								supply chain management. Empowering businesses with intelligent
								insights and seamless operations.
							</p>
						</div>

						<div className="space-y-4 footer-section">
							<h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-6">
								Platform Features
							</h4>
							<div className="space-y-3 sm:space-y-4">
								<div className="flex items-center space-x-3 micro-interaction">
									<div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
										<FaChartArea className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
									</div>
									<div>
										<span className="font-semibold text-slate-900 text-sm">
											Real-time Tracking
										</span>
										<p className="text-xs text-slate-500">
											Live shipment monitoring
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-3 micro-interaction">
									<div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center">
										<FaChartBar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
									</div>
									<div>
										<span className="font-semibold text-slate-900 text-sm">
											Analytics Dashboard
										</span>
										<p className="text-xs text-slate-500">
											Advanced insights & reporting
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-3 micro-interaction">
									<div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center">
										<FaMap className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
									</div>
									<div>
										<span className="font-semibold text-slate-900 text-sm">
											Interactive Maps
										</span>
										<p className="text-xs text-slate-500">
											Visual route optimization
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-4 h-full footer-section">
							<h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-6">
								Performance Metrics
							</h4>
							<div className="grid grid-cols-1 gap-3 sm:gap-4 h-full">
								<div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl h-16 sm:h-20 flex items-center">
									<div className="flex justify-between items-center w-full">
										<span className="text-xs sm:text-sm font-medium text-slate-600">
											Total Shipments
										</span>
										<span className="text-lg sm:text-2xl font-bold text-blue-600">
											{stats.total}
										</span>
									</div>
								</div>
								<div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl h-16 sm:h-20 flex items-center">
									<div className="flex justify-between items-center w-full">
										<span className="text-xs sm:text-sm font-medium text-slate-600">
											On-time Rate
										</span>
										<span className="text-lg sm:text-2xl font-bold text-emerald-600">
											{stats.onTimeRate}%
										</span>
									</div>
								</div>
								<div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl h-16 sm:h-20 flex items-center">
									<div className="flex justify-between items-center w-full">
										<span className="text-xs sm:text-sm font-medium text-slate-600">
											Active Routes
										</span>
										<span className="text-lg sm:text-2xl font-bold text-purple-600">
											{stats.inTransit}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-4 h-full footer-section system-health-section mt-4 sm:mt-0">
							<h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-6">
								System Health
							</h4>
							<div className="grid grid-cols-1 gap-3 sm:gap-4 h-full">
								<div className="flex items-center justify-between p-3 sm:p-4 bg-emerald-50 rounded-xl sm:rounded-2xl h-16 sm:h-20">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
										<span className="text-xs sm:text-sm font-semibold text-slate-900">
											Live Updates
										</span>
									</div>
									<div className="px-2 sm:px-3 py-1 bg-emerald-100 rounded-full">
										<span className="text-xs text-emerald-700 font-bold">
											ACTIVE
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-2xl h-16 sm:h-20">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
										<span className="text-xs sm:text-sm font-semibold text-slate-900">
											Data Sync
										</span>
									</div>
									<div className="px-2 sm:px-3 py-1 bg-blue-100 rounded-full">
										<span className="text-xs text-blue-700 font-bold">
											ONLINE
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-xl sm:rounded-2xl h-16 sm:h-20">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
										<span className="text-xs sm:text-sm font-semibold text-slate-900">
											API Status
										</span>
									</div>
									<div className="px-2 sm:px-3 py-1 bg-purple-100 rounded-full">
										<span className="text-xs text-purple-700 font-bold">
											CONNECTED
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="border-t border-slate-200 mt-6 sm:mt-12 pt-4 sm:pt-8">
						<div className="flex flex-col lg:flex-row justify-between items-center space-y-3 sm:space-y-4 lg:space-y-0">
							<div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-slate-500">
								<span className="text-xs sm:text-sm font-medium">
									2025 LogiFlow.
								</span>
								<div className="flex items-center space-x-2">
									<div className="w-1 h-1 bg-slate-400 rounded-full"></div>
									<span className="text-xs sm:text-sm">
										Last updated: {new Date().toLocaleTimeString()}
									</span>
								</div>
							</div>
							<div className="flex items-center space-x-4 sm:space-x-6">
								<div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 rounded-xl micro-interaction">
									<FaSync className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
									<span className="text-xs sm:text-sm font-medium text-slate-600">
										Auto-refresh: 2s
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
