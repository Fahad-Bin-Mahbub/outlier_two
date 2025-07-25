"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ThemeContextType = {
	theme: "light" | "dark";
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: "light",
	toggleTheme: () => {},
});

type ToastType = "success" | "error" | "info" | "warning";
type Toast = {
	id: number;
	message: string;
	type: ToastType;
};

type ToastContextType = {
	toasts: Toast[];
	showToast: (message: string, type?: ToastType) => void;
	removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextType>({
	toasts: [],
	showToast: () => {},
	removeToast: () => {},
});

type StockCategory = "Tech" | "Finance" | "Auto" | "Healthcare" | "Energy";
type TimePeriod = "1D" | "1W" | "1M" | "3M" | "1Y";
type SortKey = "name" | "price" | "pct" | "volume" | "marketCap";

interface Stock {
	id: number;
	name: string;
	ticker: string;
	cat: StockCategory;
	price: number;
	pct: number;
	volume: number;
	marketCap: number;
	inWatchlist: boolean;
}

const stocksData: Stock[] = [
	{
		id: 1,
		name: "Apple Inc.",
		ticker: "AAPL",
		cat: "Tech",
		price: 150.25,
		pct: 2.5,
		volume: 82.5,
		marketCap: 2590,
		inWatchlist: false,
	},
	{
		id: 2,
		name: "JPMorgan Chase",
		ticker: "JPM",
		cat: "Finance",
		price: 120.75,
		pct: -1.2,
		volume: 15.2,
		marketCap: 412,
		inWatchlist: false,
	},
	{
		id: 3,
		name: "Tesla Inc.",
		ticker: "TSLA",
		cat: "Auto",
		price: 700.32,
		pct: 5.0,
		volume: 45.8,
		marketCap: 685,
		inWatchlist: false,
	},
	{
		id: 4,
		name: "Amazon.com Inc.",
		ticker: "AMZN",
		cat: "Tech",
		price: 3200.5,
		pct: 0.8,
		volume: 30.1,
		marketCap: 1640,
		inWatchlist: false,
	},
	{
		id: 5,
		name: "Johnson & Johnson",
		ticker: "JNJ",
		cat: "Healthcare",
		price: 165.42,
		pct: -0.3,
		volume: 12.3,
		marketCap: 430,
		inWatchlist: false,
	},
	{
		id: 6,
		name: "Exxon Mobil Corp",
		ticker: "XOM",
		cat: "Energy",
		price: 58.94,
		pct: 1.6,
		volume: 24.7,
		marketCap: 250,
		inWatchlist: false,
	},
	{
		id: 7,
		name: "Microsoft Corp",
		ticker: "MSFT",
		cat: "Tech",
		price: 290.17,
		pct: 1.2,
		volume: 32.6,
		marketCap: 2180,
		inWatchlist: false,
	},
	{
		id: 8,
		name: "Bank of America",
		ticker: "BAC",
		cat: "Finance",
		price: 38.75,
		pct: -0.5,
		volume: 48.9,
		marketCap: 320,
		inWatchlist: false,
	},
];

const newsData = [
	{
		id: 1,
		title: "Tech stocks surge as inflation fears ease",
		source: "Financial Times",
		time: "2h ago",
	},
	{
		id: 2,
		title: "Central bank maintains interest rates",
		source: "Bloomberg",
		time: "4h ago",
	},
	{
		id: 3,
		title: "Earnings season exceeds expectations",
		source: "CNBC",
		time: "5h ago",
	},
	{
		id: 4,
		title: "Oil prices stabilize amid global tensions",
		source: "Reuters",
		time: "6h ago",
	},
];

const indicesData = [
	{ id: 1, name: "S&P 500", value: "4,532.12", change: "+0.82%" },
	{ id: 2, name: "NASDAQ", value: "14,897.34", change: "+1.24%" },
	{ id: 3, name: "DOW JONES", value: "35,456.91", change: "+0.68%" },
	{ id: 4, name: "RUSSELL 2000", value: "2,287.55", change: "-0.12%" },
];

const makeHistory = (base: number, period: TimePeriod): number[] => {
	const dataPoints =
		period === "1D"
			? 24
			: period === "1W"
			? 7
			: period === "1M"
			? 30
			: period === "3M"
			? 90
			: 365;

	const volatility =
		period === "1D"
			? 0.2
			: period === "1W"
			? 0.5
			: period === "1M"
			? 1
			: period === "3M"
			? 2
			: 5;

	const data: number[] = [];
	let p = base;

	for (let i = 0; i < dataPoints; i++) {
		p += (Math.random() - 0.48) * volatility;
		data.push(parseFloat(p.toFixed(2)));
	}

	return data;
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = (message: string, type: ToastType = "info") => {
		const id = Date.now();
		setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

		setTimeout(() => {
			removeToast(id);
		}, 3000);
	};

	const removeToast = (id: number) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{ toasts, showToast, removeToast }}>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	);
};

const ToastContainer: React.FC = () => {
	const { toasts, removeToast } = useContext(ToastContext);

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
			<AnimatePresence>
				{toasts.map((toast) => (
					<motion.div
						key={toast.id}
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 100 }}
						className={`rounded-lg shadow-lg p-4 flex items-center justify-between min-w-[280px] ${
							toast.type === "success"
								? "bg-green-500 text-white"
								: toast.type === "error"
								? "bg-red-500 text-white"
								: toast.type === "warning"
								? "bg-yellow-500 text-white"
								: toast.type === "info"
								? "bg-blue-500 text-white"
								: ""
						}`}
					>
						<p>{toast.message}</p>
						<button
							onClick={() => removeToast(toast.id)}
							className="ml-2 text-white hover:text-gray-200"
							aria-label="Close toast"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

const SearchIcon = () => (
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
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
);

const BellIcon = () => (
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
			d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
		/>
	</svg>
);

const UserIcon = () => (
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
			d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
		/>
	</svg>
);

const MoonIcon = () => (
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
			d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
		/>
	</svg>
);

const SunIcon = () => (
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
			d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
		/>
	</svg>
);

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill={filled ? "currentColor" : "none"}
		stroke="currentColor"
	>
		<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
	</svg>
);

const MenuIcon = () => (
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
			d="M4 6h16M4 12h16M4 18h16"
		/>
	</svg>
);

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

export default function StockMarketExport() {
	const useToast = () => useContext(ToastContext);
	const useTheme = () => useContext(ThemeContext);

	const [search, setSearch] = useState("");
	const [cat, setCat] = useState("All");
	const [time, setTime] = useState<TimePeriod>("1W");
	const [sort, setSort] = useState<SortKey>("name");
	const [dir, setDir] = useState(1);
	const [data, setData] = useState<Stock[]>(stocksData);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const chart = useRef<HTMLCanvasElement>(null);
	const chartObj = useRef<any>(null);

	return (
		<ThemeProvider>
			<ToastProvider>
				<StockDashboardContent />
			</ToastProvider>
		</ThemeProvider>
	);

	function StockDashboardContent() {
		const { showToast } = useToast();
		const { theme, toggleTheme } = useTheme();

		useEffect(() => {
			const id = setInterval(() => {
				setData((d) =>
					d.map((s) => ({
						...s,
						price: parseFloat(
							(s.price + (Math.random() - 0.48) * 3).toFixed(2)
						),
						pct: parseFloat((Math.random() * 6 - 2.5).toFixed(2)),
						volume: parseFloat(
							(s.volume + (Math.random() - 0.5) * 2).toFixed(1)
						),
					}))
				);
			}, 5000);
			return () => clearInterval(id);
		}, []);

		const toggleWatchlist = (id: number) => {
			setData((prevData) =>
				prevData.map((stock) =>
					stock.id === id
						? { ...stock, inWatchlist: !stock.inWatchlist }
						: stock
				)
			);

			const stock = data.find((s) => s.id === id);
			if (stock) {
				showToast(
					`${stock.name} ${
						stock.inWatchlist ? "removed from" : "added to"
					} watchlist`,
					"success"
				);
			}
		};

		const openStockDetails = (stock: Stock) => {
			setSelectedStock(stock);
			setModalOpen(true);
		};

		useEffect(() => {
			if (!chart.current) return;
			const ctx = chart.current.getContext("2d");
			if (!ctx) return;

			const gridColor =
				theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
			const textColor = theme === "light" ? "#333" : "#ccc";

			const getLabels = () => {
				switch (time) {
					case "1D":
						return Array.from({ length: 24 }, (_, i) => `${i}:00`);
					case "1W":
						return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
					case "1M":
						return Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
					case "3M":
						return Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);
					case "1Y":
						return [
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
					default:
						return Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
				}
			};

			if (chartObj.current) chartObj.current.destroy();

			const getColorForCategory = (category: StockCategory) => {
				if (theme === "light") {
					return category === "Tech"
						? "#60A5FA"
						: category === "Finance"
						? "#34D399"
						: category === "Auto"
						? "#F87171"
						: category === "Healthcare"
						? "#A78BFA"
						: "#F59E0B";
				} else {
					return category === "Tech"
						? "#3B82F6"
						: category === "Finance"
						? "#10B981"
						: category === "Auto"
						? "#EF4444"
						: category === "Healthcare"
						? "#8B5CF6"
						: "#F59E0B";
				}
			};

			chartObj.current = new (window as any).Chart(ctx, {
				type: "line",
				data: {
					labels: getLabels(),
					datasets: filtered.map((s) => ({
						label: s.name,
						data: makeHistory(s.price, time),
						borderColor: getColorForCategory(s.cat),
						backgroundColor: `${getColorForCategory(s.cat)}20`,
						fill: true,
						tension: 0.1,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 4,
					})),
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						tooltip: {
							mode: "index",
							intersect: false,
							backgroundColor:
								theme === "light"
									? "rgba(255, 255, 255, 0.9)"
									: "rgba(30, 41, 59, 0.9)",
							titleColor: theme === "light" ? "#333" : "#fff",
							bodyColor: theme === "light" ? "#666" : "#ccc",
							borderColor:
								theme === "light"
									? "rgba(0, 0, 0, 0.1)"
									: "rgba(255, 255, 255, 0.1)",
							borderWidth: 1,
							padding: 12,
							cornerRadius: 8,
							displayColors: true,
							boxWidth: 10,
							boxHeight: 10,
							boxPadding: 3,
							usePointStyle: true,
						},
						legend: {
							position: "top",
							labels: {
								color: textColor,
								font: {
									family: "'Inter', sans-serif",
									size: 12,
								},
								padding: 20,
								usePointStyle: true,
								boxWidth: 8,
							},
						},
					},
					scales: {
						x: {
							display: true,
							grid: {
								color: gridColor,
								borderColor: gridColor,
								tickColor: gridColor,
							},
							ticks: {
								color: textColor,
							},
						},
						y: {
							display: true,
							beginAtZero: false,
							grid: {
								color: gridColor,
								borderColor: gridColor,
								tickColor: gridColor,
							},
							ticks: {
								color: textColor,
								callback: function (value) {
									return "$" + value;
								},
							},
						},
					},
					interaction: {
						mode: "index",
						intersect: false,
					},
					hover: {
						mode: "index",
						intersect: false,
					},
				},
			});

			return () => {
				if (chartObj.current) chartObj.current.destroy();
			};
		}, [search, cat, time, data, theme]);

		const doSort = (key: SortKey) => {
			if (sort === key) setDir(-dir);
			else {
				setSort(key);
				setDir(1);
			}
		};

		const filtered = data
			.filter(
				(s) =>
					(s.name.toLowerCase().includes(search.toLowerCase()) ||
						s.ticker.toLowerCase().includes(search.toLowerCase())) &&
					(cat === "All" || s.cat === cat)
			)
			.sort((a, b) => {
				const valA = a[sort];
				const valB = b[sort];
				return (valA > valB ? 1 : -1) * dir;
			});

		const watchlistStocks = data.filter((s) => s.inWatchlist);

		const showAlertDemo = () => {
			showToast("This feature is not implemented in the demo", "info");
		};

		const baseStyles = {
			bg: theme === "light" ? "bg-gray-50" : "bg-slate-900",
			headerBg: theme === "light" ? "bg-white" : "bg-slate-800",
			cardBg: theme === "light" ? "bg-white" : "bg-slate-800",
			text: theme === "light" ? "text-gray-800" : "text-gray-100",
			textSecondary: theme === "light" ? "text-gray-600" : "text-gray-300",
			textMuted: theme === "light" ? "text-gray-500" : "text-gray-400",
			border: theme === "light" ? "border-gray-200" : "border-gray-700",
			highlight: theme === "light" ? "bg-blue-50" : "bg-blue-900/30",
			highlightText: theme === "light" ? "text-blue-600" : "text-blue-300",
			hoverBg: theme === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700",
		};

		return (
			<div
				className={`min-h-screen font-sans ${baseStyles.bg} ${baseStyles.text}`}
			>
				{}
				<nav className={`sticky top-0 z-40 ${baseStyles.headerBg} shadow-md`}>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between h-16">
							<div className="flex-shrink-0 flex items-center">
								<svg
									className="h-8 w-8 text-blue-500"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M5 3v16h16v2H3V3h2zm15.293 3.293l1.414 1.414L16 13.414l-3-3-4.293 4.293 1.414 1.414L13 13.243l3 3 6.707-6.707z" />
								</svg>
								<span className="ml-2 text-xl font-bold">TradePro</span>
							</div>
							<div className="flex items-center justify-center">
								<div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center justify-center">
									<a
										href="#"
										className={`border-b-2 border-blue-500 ${baseStyles.highlightText} px-1 pt-1 text-sm font-medium`}
									>
										Dashboard
									</a>
									<a
										href="#"
										onClick={() => showAlertDemo()}
										className={`${baseStyles.textMuted} hover:${baseStyles.textSecondary} px-1 pt-1 text-sm font-medium cursor-pointer`}
									>
										Markets
									</a>
									<a
										href="#"
										onClick={() => showAlertDemo()}
										className={`${baseStyles.textMuted} hover:${baseStyles.textSecondary} px-1 pt-1 text-sm font-medium cursor-pointer`}
									>
										News
									</a>
									<a
										href="#"
										onClick={() => showAlertDemo()}
										className={`${baseStyles.textMuted} hover:${baseStyles.textSecondary} px-1 pt-1 text-sm font-medium cursor-pointer`}
									>
										Portfolios
									</a>
								</div>
							</div>
							<div className="hidden sm:flex sm:items-center space-x-4 ml-6">
								<button
									onClick={toggleTheme}
									className={`p-2 rounded-full ${baseStyles.textMuted} hover:${baseStyles.textSecondary} focus:outline-none cursor-pointer`}
									aria-label="Toggle dark mode"
								>
									{theme === "light" ? <MoonIcon /> : <SunIcon />}
								</button>
								<button
									onClick={() => showAlertDemo()}
									className={`p-2 rounded-full ${baseStyles.textMuted} hover:${baseStyles.textSecondary} focus:outline-none cursor-pointer`}
									aria-label="View notifications"
								>
									<BellIcon />
								</button>
								<button
									onClick={() => showAlertDemo()}
									className={`p-2 rounded-full ${baseStyles.textMuted} hover:${baseStyles.textSecondary} focus:outline-none cursor-pointer`}
									aria-label="View profile"
								>
									<UserIcon />
								</button>
							</div>
							<div className="flex items-center justify-center sm:hidden">
								<button
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
									className={`p-2 rounded-md ${baseStyles.textMuted} hover:${baseStyles.textSecondary} focus:outline-none`}
									aria-label="Toggle mobile menu"
								>
									{mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
								</button>
							</div>
						</div>
					</div>

					{}
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							className={`sm:hidden ${baseStyles.headerBg}`}
						>
							<div className="pt-2 pb-3 space-y-1 text-center">
								<a
									href="#"
									className={`block pl-3 pr-4 py-2 ${baseStyles.highlight} ${baseStyles.highlightText} text-base font-medium`}
								>
									Dashboard
								</a>
								<a
									href="#"
									onClick={() => showAlertDemo()}
									className={`block pl-3 pr-4 py-2 ${baseStyles.textMuted} hover:${baseStyles.textSecondary} text-base font-medium cursor-pointer`}
								>
									Markets
								</a>
								<a
									href="#"
									onClick={() => showAlertDemo()}
									className={`block pl-3 pr-4 py-2 ${baseStyles.textMuted} hover:${baseStyles.textSecondary} text-base font-medium cursor-pointer`}
								>
									News
								</a>
								<a
									href="#"
									onClick={() => showAlertDemo()}
									className={`block pl-3 pr-4 py-2 ${baseStyles.textMuted} hover:${baseStyles.textSecondary} text-base font-medium cursor-pointer`}
								>
									Portfolios
								</a>
							</div>
							<div className="pt-4 pb-3 border-t border-gray-200 flex justify-center">
								<button
									onClick={toggleTheme}
									className={`p-2 rounded-full ${baseStyles.textMuted} hover:${baseStyles.textSecondary} focus:outline-none cursor-pointer mx-2`}
									aria-label="Toggle dark mode"
								>
									{theme === "light" ? <MoonIcon /> : <SunIcon />}
								</button>
								<button
									onClick={() => showAlertDemo()}
									className={`p-2 rounded-full ${baseStyles.textMuted} hover:${baseStyles.textSecondary} focus:outline-none cursor-pointer mx-2`}
									aria-label="View notifications"
								>
									<BellIcon />
								</button>
								<button
									onClick={() => showAlertDemo()}
									className={`p-2 rounded-full ${baseStyles.textMuted} hover:${baseStyles.textSecondary} focus:outline-none cursor-pointer mx-2`}
									aria-label="View profile"
								>
									<UserIcon />
								</button>
							</div>
						</motion.div>
					)}
				</nav>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<header className="mb-8">
						<h1 className="text-3xl font-bold text-blue-600">
							Market Dashboard
						</h1>
						<p className={`text-sm ${baseStyles.textMuted} mt-1`}>
							Real-time market data and analysis
						</p>
					</header>

					{}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
					>
						{indicesData.map((index) => (
							<div
								key={index.id}
								className={`${baseStyles.cardBg} rounded-lg shadow-md p-4 transition-all hover:shadow-lg`}
							>
								<h3 className={`text-sm ${baseStyles.textMuted} font-medium`}>
									{index.name}
								</h3>
								<p className="text-2xl font-bold mt-1">{index.value}</p>
								<p
									className={`${
										parseFloat(index.change) >= 0
											? "text-green-500"
											: "text-red-500"
									} text-sm font-medium mt-1`}
								>
									{index.change}
								</p>
							</div>
						))}
					</motion.div>

					{}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col sm:flex-row gap-4 mb-6"
					>
						<div className={`relative flex-grow`}>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<SearchIcon />
							</div>
							<input
								type="text"
								placeholder="Search stocks by name or ticker..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className={`pl-10 p-3 border ${baseStyles.border} rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${baseStyles.cardBg} ${baseStyles.text}`}
								aria-label="Search stocks by name or ticker"
							/>
						</div>
						<select
							value={cat}
							onChange={(e) => setCat(e.target.value)}
							className={`p-3 border ${baseStyles.border} rounded-lg w-full sm:w-48 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${baseStyles.cardBg} ${baseStyles.text}`}
							aria-label="Filter by category"
						>
							<option>All</option>
							<option>Tech</option>
							<option>Finance</option>
							<option>Auto</option>
							<option>Healthcare</option>
							<option>Energy</option>
						</select>
						<div className="flex gap-2 overflow-x-auto pb-1">
							{["1D", "1W", "1M", "3M", "1Y"].map((p) => (
								<button
									key={p}
									onClick={() => setTime(p as TimePeriod)}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
										time === p
											? "bg-blue-500 text-white"
											: `${baseStyles.cardBg} ${baseStyles.border} hover:bg-blue-400 border`
									}`}
									aria-label={`Show ${p} data`}
								>
									{p}
								</button>
							))}
						</div>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className={`${baseStyles.cardBg} rounded-lg shadow-lg p-6 col-span-1 lg:col-span-2`}
						>
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-semibold text-blue-600">
									Price Trends
								</h2>
								<button
									onClick={() => showAlertDemo()}
									className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
								>
									More options
								</button>
							</div>
							{filtered.length > 0 ? (
								<div className="h-80">
									<canvas
										ref={chart}
										className="w-full h-full"
										aria-label="Stock price trend chart"
									/>
								</div>
							) : (
								<p className={`${baseStyles.textMuted} text-center py-8`}>
									No stocks match your criteria
								</p>
							)}
						</motion.div>

						{}
						<div className="space-y-6">
							{}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className={`${baseStyles.cardBg} rounded-lg shadow-lg p-6`}
							>
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-semibold text-blue-600">
										My Watchlist
									</h2>
									<button
										onClick={() => showAlertDemo()}
										className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
									>
										Manage
									</button>
								</div>
								{watchlistStocks.length > 0 ? (
									<div className="space-y-3">
										{watchlistStocks.map((stock) => (
											<div
												key={stock.id}
												className={`flex justify-between items-center p-3 rounded-lg ${baseStyles.highlight}`}
											>
												<div>
													<p className="font-medium">{stock.ticker}</p>
													<p className={`text-xs ${baseStyles.textMuted}`}>
														{stock.name}
													</p>
												</div>
												<div className="text-right">
													<p className="font-medium">
														${stock.price.toFixed(2)}
													</p>
													<p
														className={`text-xs ${
															stock.pct >= 0 ? "text-green-600" : "text-red-600"
														}`}
													>
														{stock.pct >= 0 ? "+" : ""}
														{stock.pct}%
													</p>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className={`text-center py-6 ${baseStyles.textMuted}`}>
										<p>No stocks in your watchlist</p>
										<p className="text-sm mt-2">
											Click the star icon to add stocks
										</p>
									</div>
								)}
							</motion.div>

							{}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className={`${baseStyles.cardBg} rounded-lg shadow-lg p-6`}
							>
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-semibold text-blue-600">
										Latest News
									</h2>
									<button
										onClick={() => showAlertDemo()}
										className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
									>
										View all
									</button>
								</div>
								<div className="space-y-4">
									{newsData.map((news) => (
										<div
											key={news.id}
											className={`cursor-pointer ${baseStyles.hoverBg} p-3 rounded-lg transition-colors`}
											onClick={() => showAlertDemo()}
										>
											<h3 className="font-medium">{news.title}</h3>
											<div className="flex justify-between mt-1">
												<span className={`text-xs ${baseStyles.textMuted}`}>
													{news.source}
												</span>
												<span className={`text-xs ${baseStyles.textMuted}`}>
													{news.time}
												</span>
											</div>
										</div>
									))}
								</div>
							</motion.div>
						</div>
					</div>

					{}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className={`${baseStyles.cardBg} rounded-lg shadow-lg p-6 mt-6`}
					>
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-semibold text-blue-600">
								Stock List
							</h2>
							<div className="flex gap-2">
								<button
									onClick={() => showAlertDemo()}
									className={`px-3 py-1 text-sm border ${baseStyles.border} rounded-md ${baseStyles.hoverBg} cursor-pointer`}
								>
									Export
								</button>
								<button
									onClick={() => showAlertDemo()}
									className={`px-3 py-1 text-sm border ${baseStyles.border} rounded-md ${baseStyles.hoverBg} cursor-pointer`}
								>
									Settings
								</button>
							</div>
						</div>
						{filtered.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full text-left text-sm">
									<thead>
										<tr className={`border-b ${baseStyles.border}`}>
											<th className="p-3"></th>
											<th
												className="p-3 cursor-pointer"
												onClick={() => doSort("name")}
												aria-label="Sort by name"
											>
												Name {sort === "name" && (dir === 1 ? "↑" : "↓")}
											</th>
											<th
												className="p-3 cursor-pointer"
												onClick={() => doSort("price")}
												aria-label="Sort by price"
											>
												Price {sort === "price" && (dir === 1 ? "↑" : "↓")}
											</th>
											<th
												className="p-3 cursor-pointer"
												onClick={() => doSort("pct")}
												aria-label="Sort by change"
											>
												Change % {sort === "pct" && (dir === 1 ? "↑" : "↓")}
											</th>
											<th
												className="p-3 cursor-pointer"
												onClick={() => doSort("volume")}
												aria-label="Sort by volume"
											>
												Volume (M){" "}
												{sort === "volume" && (dir === 1 ? "↑" : "↓")}
											</th>
											<th
												className="p-3 cursor-pointer"
												onClick={() => doSort("marketCap")}
												aria-label="Sort by market cap"
											>
												Market Cap (B){" "}
												{sort === "marketCap" && (dir === 1 ? "↑" : "↓")}
											</th>
											<th className="p-3">Category</th>
											<th className="p-3"></th>
										</tr>
									</thead>
									<tbody>
										{filtered.map((stock) => (
											<tr
												key={stock.id}
												className={`border-b ${baseStyles.border} ${baseStyles.hoverBg}`}
											>
												<td className="p-3">
													<button
														onClick={() => toggleWatchlist(stock.id)}
														className={`text-yellow-500 hover:text-yellow-600 cursor-pointer focus:outline-none`}
														aria-label={
															stock.inWatchlist
																? "Remove from watchlist"
																: "Add to watchlist"
														}
													>
														<StarIcon filled={stock.inWatchlist} />
													</button>
												</td>
												<td className="p-3">
													<div>
														<div className="font-medium">{stock.name}</div>
														<div className={`text-xs ${baseStyles.textMuted}`}>
															{stock.ticker}
														</div>
													</div>
												</td>
												<td className="p-3 font-medium">
													${stock.price.toFixed(2)}
												</td>
												<td
													className={`p-3 font-medium ${
														stock.pct >= 0 ? "text-green-600" : "text-red-600"
													}`}
												>
													{stock.pct >= 0 ? "+" : ""}
													{stock.pct}%
												</td>
												<td className="p-3">{stock.volume}</td>
												<td className="p-3">${stock.marketCap}</td>
												<td className="p-3">
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium
                            ${
															stock.cat === "Tech"
																? "bg-blue-100 text-blue-800"
																: stock.cat === "Finance"
																? "bg-green-100 text-green-800"
																: stock.cat === "Auto"
																? "bg-red-100 text-red-800"
																: stock.cat === "Healthcare"
																? "bg-purple-100 text-purple-800"
																: "bg-yellow-100 text-yellow-800"
														}`}
													>
														{stock.cat}
													</span>
												</td>
												<td className="p-3">
													<button
														onClick={() => openStockDetails(stock)}
														className="text-blue-500 hover:text-blue-700 cursor-pointer"
														aria-label={`View details for ${stock.name}`}
													>
														Details
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className={`${baseStyles.textMuted} text-center py-8`}>
								No stocks match your filters
							</p>
						)}
					</motion.div>

					{}
					<footer className="mt-12 pt-8 border-t border-gray-200">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							<div>
								<h3 className="text-lg font-semibold mb-4">TradePro</h3>
								<p className={`text-sm ${baseStyles.textMuted}`}>
									Advanced stock market analytics and trading tools for
									professionals.
								</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">Products</h3>
								<ul className="space-y-2">
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Dashboard
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Analytics
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Trading
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Premium
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">Resources</h3>
								<ul className="space-y-2">
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Documentation
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											API
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Community
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Support
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">Company</h3>
								<ul className="space-y-2">
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											About
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Careers
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Privacy
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={() => showAlertDemo()}
											className={`text-sm ${baseStyles.textMuted} hover:${baseStyles.textSecondary} cursor-pointer`}
										>
											Terms
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div
							className={`mt-8 pt-8 border-t ${baseStyles.border} text-center ${baseStyles.textMuted} text-sm`}
						>
							<p>
								© 2025 TradePro. All rights reserved. Demo version for
								presentation purposes only.
							</p>
							<p className="mt-2">
								This is a demonstration with simulated data. Not intended for
								financial decisions.
							</p>
						</div>
					</footer>
				</div>

				{}
				<AnimatePresence>
					{modalOpen && selectedStock && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 flex items-center justify-center p-4"
						>
							<div
								className="absolute inset-0 bg-black bg-opacity-50"
								onClick={() => setModalOpen(false)}
							></div>
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								className={`relative ${baseStyles.cardBg} rounded-lg shadow-xl max-w-lg w-full mx-auto p-6`}
							>
								<button
									onClick={() => setModalOpen(false)}
									className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 cursor-pointer"
									aria-label="Close modal"
								>
									<CloseIcon />
								</button>

								<div className="flex items-center mb-6">
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center ${
											selectedStock.cat === "Tech"
												? "bg-blue-100 text-blue-600"
												: selectedStock.cat === "Finance"
												? "bg-green-100 text-green-600"
												: selectedStock.cat === "Auto"
												? "bg-red-100 text-red-600"
												: selectedStock.cat === "Healthcare"
												? "bg-purple-100 text-purple-600"
												: "bg-yellow-100 text-yellow-600"
										}`}
									>
										{selectedStock.ticker.charAt(0)}
									</div>
									<div className="ml-4">
										<h3 className="text-xl font-bold">{selectedStock.name}</h3>
										<p className={`${baseStyles.textMuted} flex items-center`}>
											<span className="font-medium">
												{selectedStock.ticker}
											</span>
											<span className="mx-2">•</span>
											<span>{selectedStock.cat}</span>
										</p>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 mb-6">
									<div className={`p-4 rounded-lg ${baseStyles.highlight}`}>
										<p className={`text-xs ${baseStyles.textMuted}`}>
											Current Price
										</p>
										<p className="text-2xl font-bold">
											${selectedStock.price.toFixed(2)}
										</p>
										<p
											className={`text-sm font-medium ${
												selectedStock.pct >= 0
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{selectedStock.pct >= 0 ? "+" : ""}
											{selectedStock.pct}%
										</p>
									</div>
									<div className={`p-4 rounded-lg ${baseStyles.highlight}`}>
										<p className={`text-xs ${baseStyles.textMuted}`}>
											Market Cap
										</p>
										<p className="text-2xl font-bold">
											${selectedStock.marketCap}B
										</p>
										<p className={`text-sm ${baseStyles.textMuted}`}>
											Volume: {selectedStock.volume}M
										</p>
									</div>
								</div>

								<div className="space-y-4 mb-6">
									<div>
										<h4 className="font-medium mb-2">
											About {selectedStock.name}
										</h4>
										<p className={`text-sm ${baseStyles.textMuted}`}>
											{selectedStock.name} is a leading company in the{" "}
											{selectedStock.cat} sector, known for innovation and
											market leadership. The company has shown consistent growth
											over the past quarters.
										</p>
									</div>
									<div>
										<h4 className="font-medium mb-2">Key Statistics</h4>
										<div className="grid grid-cols-2 gap-2 text-sm">
											<div className="flex justify-between">
												<span className={baseStyles.textMuted}>Open</span>
												<span className="font-medium">
													$
													{(selectedStock.price - Math.random() * 2).toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className={baseStyles.textMuted}>High</span>
												<span className="font-medium">
													$
													{(selectedStock.price + Math.random() * 3).toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className={baseStyles.textMuted}>Low</span>
												<span className="font-medium">
													$
													{(selectedStock.price - Math.random() * 3).toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className={baseStyles.textMuted}>52w High</span>
												<span className="font-medium">
													${(selectedStock.price * 1.2).toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className={baseStyles.textMuted}>52w Low</span>
												<span className="font-medium">
													${(selectedStock.price * 0.8).toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className={baseStyles.textMuted}>P/E Ratio</span>
												<span className="font-medium">
													{(15 + Math.random() * 10).toFixed(2)}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="flex space-x-3 mt-6">
									<button
										onClick={() => {
											toggleWatchlist(selectedStock.id);
											setModalOpen(false);
										}}
										className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border ${baseStyles.border} ${baseStyles.hoverBg}`}
									>
										{selectedStock.inWatchlist
											? "Remove from Watchlist"
											: "Add to Watchlist"}
									</button>
									<button
										onClick={() => {
											showAlertDemo();
											setModalOpen(false);
										}}
										className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600`}
									>
										Trade Now
									</button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{}
				<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
			</div>
		);
	}
}
