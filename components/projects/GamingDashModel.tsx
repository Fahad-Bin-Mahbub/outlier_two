"use client";
import { useState, useEffect } from "react";
import {
	LineChart,
	XAxis,
	YAxis,
	Line,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
} from "recharts";
import {
	Trophy,
	Users,
	Activity,
	Award,
	Zap,
	TrendingUp,
	Clock,
	Calendar,
	Star,
	ChevronDown,
	Search,
	Filter,
	Shield,
	Heart,
	
	LayoutDashboard,
} from "lucide-react";

// Define interfaces for TypeScript types
interface PlayerStats {
	id: number;
	rank: number;
	name: string;
	avatar: string;
	level: number;
	score: number;
	wins: number;
	gamesPlayed: number;
	winRate: number;
	kills: number;
	deaths: number;
	kdRatio: number;
	damageDealt: number;
	damageTaken: number;
	healingDone: number;
	soloKills: number;
	teamKills: number;
	timePlayed: number;
	lastMatch: string;
	trend: "up" | "down" | "same";
	trendValue: number;
	badges: string[];
	lastWeekScore: number;
	favoriteGames: string[];
	joinDate: string;
	status: "online" | "offline" | "in-game";
}

interface ChartDataPoint {
	name: string;
	score: number;
	playerId: number;
}

interface ChartData {
	[key: string]: ChartDataPoint[];
}

// Mock data generator with additional fields
const generateMockPlayers = (count: number): PlayerStats[] => {
	const games = [
		"Fortnite",
		"Apex Legends",
		"Call of Duty",
		"League of Legends",
		"Valorant",
		"Overwatch",
		"Minecraft",
		"Genshin Impact",
	];

	return Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		rank: i + 1,
		name: `Player ${i + 1}`,
		avatar: `https://robohash.org/${i + 1}`,
		level: Math.floor(Math.random() * 100) + 1,
		score: Math.floor(Math.random() * 100000) + 1000,
		wins: Math.floor(Math.random() * 1000),
		gamesPlayed: Math.floor(Math.random() * 5000) + 100,
		winRate: Math.round((Math.random() * 70 + 30) * 100) / 100,
		kills: Math.floor(Math.random() * 10000),
		deaths: Math.floor(Math.random() * 8000) + 2000,
		kdRatio: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
		damageDealt: Math.floor(Math.random() * 1000000) + 10000,
		damageTaken: Math.floor(Math.random() * 800000) + 20000,
		healingDone: Math.floor(Math.random() * 300000) + 10000,
		soloKills: Math.floor(Math.random() * 2000),
		teamKills: Math.floor(Math.random() * 5000),
		timePlayed: Math.floor(Math.random() * 1000) + 100,
		lastMatch: new Date(
			Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
		).toISOString(),
		trend: (["up", "down", "same"] as const)[Math.floor(Math.random() * 3)],
		trendValue: Math.floor(Math.random() * 20),
		badges: Array.from(
			{ length: Math.floor(Math.random() * 3) + 1 },
			() =>
				[
					"VIP",
					"Speedrunner",
					"Veteran",
					"Team Leader",
					"Tactician",
					"Rising Star",
				][Math.floor(Math.random() * 6)]
		),
		lastWeekScore: Math.floor(Math.random() * 50000) + 1000,
		favoriteGames: Array.from(
			{ length: Math.floor(Math.random() * 3) + 1 },
			() => games[Math.floor(Math.random() * games.length)]
		),
		joinDate: new Date(
			Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
		).toISOString(),
		status: (["online", "offline", "in-game"] as const)[
			Math.floor(Math.random() * 3)
		],
	}));
};

// Mock chart data generator
const generateMockChartData = (players: PlayerStats[]): ChartData => {
	const data: ChartData = {};

	players.forEach((player) => {
		const playerData: ChartDataPoint[] = [];
		const baseScore = player.score;

		for (let i = 6; i >= 0; i--) {
			const day = new Date();
			day.setDate(day.getDate() - i);
			const scoreFluctuation = Math.floor(Math.random() * 200) - 100;
			playerData.push({
				name: day.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				score: baseScore + scoreFluctuation,
				playerId: player.id,
			});
		}

		data[player.id] = playerData;
	});

	return data;
};

// Component for displaying stats cards
const StatsCard = ({
	title,
	value,
	icon,
	trend,
	trendValue,
	description,
	secondaryValue,
}: {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	trend?: "up" | "down" | "same";
	trendValue?: number;
	description?: string;
	secondaryValue?: string;
}) => {
	return (
		<div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-xl border border-slate-700/70 shadow-lg">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-sm font-medium text-slate-400">{title}</h3>
				<div
					className={`text-xs px-2 py-0.5 rounded-full ${
						trend === "up"
							? "bg-emerald-900/40 text-emerald-400"
							: trend === "down"
							? "bg-red-900/40 text-red-400"
							: "bg-slate-700/40 text-slate-400"
					}`}
				>
					{trend === "up" ? "+" : trend === "down" ? "-" : ""}
					{trendValue}%
				</div>
			</div>
			<div className="flex items-baseline gap-3">
				<div className="text-2xl font-bold text-white">{value}</div>
				{secondaryValue && (
					<div className="text-sm font-medium text-slate-400">
						{secondaryValue}
					</div>
				)}
				<div
					className={`ml-auto ${
						trend === "up"
							? "text-emerald-500"
							: trend === "down"
							? "text-red-500"
							: "text-slate-500"
					}`}
				>
					{icon}
				</div>
			</div>
			{description && (
				<div className="mt-1 text-xs text-slate-500">{description}</div>
			)}
		</div>
	);
};

// Badge component
const Badge = ({
	children,
	variant = "default",
}: {
	children: React.ReactNode;
	variant?: string;
}) => {
	const colors = {
		default: "bg-blue-900/40 text-blue-400 border border-blue-700/50",
		success: "bg-emerald-900/40 text-emerald-400 border border-emerald-700/50",
		warning: "bg-amber-900/40 text-amber-400 border border-amber-700/50",
		danger: "bg-red-900/40 text-red-400 border border-red-700/50",
		info: "bg-purple-900/40 text-purple-400 border border-purple-700/50",
	};

	return (
		<span
			className={`text-xs px-2 py-0.5 rounded-full ${
				colors[variant as keyof typeof colors] || colors.default
			}`}
		>
			{children}
		</span>
	);
};

// Tooltip component
const Tooltip = ({
	children,
	content,
	delay = 200,
}: {
	children: React.ReactNode;
	content: React.ReactNode;
	delay?: number;
}) => {
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	let timer: NodeJS.Timeout;

	const handleMouseEnter = (e: React.MouseEvent) => {
		timer = setTimeout(() => {
			const rect = e.currentTarget.getBoundingClientRect();
			setPosition({
				x: rect.left + rect.width / 2,
				y: rect.top - 10,
			});
			setVisible(true);
		}, delay);
	};

	const handleMouseLeave = () => {
		clearTimeout(timer);
		setVisible(false);
	};

	return (
		<div
			className="relative"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}
			{visible && (
				<div
					className="fixed z-50 px-3 py-2 bg-slate-900/90 text-white text-xs rounded-md shadow-lg backdrop-blur-md border border-slate-700/80 pointer-events-none"
					style={{
						left: `${position.x}px`,
						top: `${position.y - 42}px`,
						transform: "translateX(-50%)",
					}}
				>
					{content}
				</div>
			)}
		</div>
	);
};

// Gaming Dashboard Component
export default function GamingDashModelExport() {
	// State for player data
	const [players, setPlayers] = useState<PlayerStats[]>([]);
	const [chartData, setChartData] = useState<ChartData>({});
	const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [timeFormat, setTimeFormat] = useState<"hours" | "minutes">("hours");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState<
		"all" | "online" | "offline" | "in-game"
	>("all");
	const [activeTab, setActiveTab] = useState<
		"overview" | "stats" | "matches" | "achievements"
	>("overview");

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);

			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 800));

				const mockPlayers = generateMockPlayers(10);
				setPlayers(mockPlayers);
				setChartData(generateMockChartData(mockPlayers));

				if (mockPlayers.length > 0) {
					setSelectedPlayer(mockPlayers[0]);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Real-time updates
	useEffect(() => {
		const interval = setInterval(() => {
			if (!isLoading && players.length > 0) {
				const updatedPlayers = [...players];

				updatedPlayers.forEach((player) => {
					// Randomly update player status
					if (Math.random() < 0.1) {
						player.status = (["online", "offline", "in-game"] as const)[
							Math.floor(Math.random() * 3)
						];
					}

					// Randomly update score
					if (Math.random() < 0.05) {
						player.score += Math.floor(Math.random() * 100) - 50;

						// Update trend based on score change
						if (player.score > player.lastWeekScore) {
							player.trend = "up";
							player.trendValue = Math.floor(
								((player.score - player.lastWeekScore) / player.lastWeekScore) *
									100
							);
						} else if (player.score < player.lastWeekScore) {
							player.trend = "down";
							player.trendValue = Math.floor(
								((player.lastWeekScore - player.score) / player.lastWeekScore) *
									100
							);
						} else {
							player.trend = "same";
							player.trendValue = 0;
						}
					}

					// Randomly update other stats
					if (Math.random() < 0.03) {
						player.wins += Math.floor(Math.random() * 2);
						player.gamesPlayed += Math.floor(Math.random() * 5);
						player.kills += Math.floor(Math.random() * 10);
						player.damageDealt += Math.floor(Math.random() * 1000);
						player.damageTaken += Math.floor(Math.random() * 800);
					}
				});

				setPlayers(updatedPlayers);

				if (selectedPlayer) {
					const updatedSelectedPlayer = updatedPlayers.find(
						(p) => p.id === selectedPlayer.id
					);
					if (updatedSelectedPlayer) {
						setSelectedPlayer(updatedSelectedPlayer);
					}
				}
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [players, selectedPlayer, isLoading]);

	// Filter players based on search and status
	const filteredPlayers = players.filter((player) => {
		const matchesSearch = player.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesFilter = filterType === "all" || player.status === filterType;
		return matchesSearch && matchesFilter;
	});

	const formatTime = (minutes: number) => {
		if (timeFormat === "hours") {
			const hours = Math.floor(minutes / 60);
			const mins = minutes % 60;
			return `${hours}h ${mins}m`;
		}
		return `${minutes} minutes`;
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat().format(num);
	};

	const calculateScoreChange = (player: PlayerStats) => {
		const change = player.score - player.lastWeekScore;
		const percent = (change / player.lastWeekScore) * 100;
		return {
			value: change,
			percent: Math.round(percent * 100) / 100,
			positive: change >= 0,
		};
	};

	const handleToggleTimeFormat = () => {
		setTimeFormat(timeFormat === "hours" ? "minutes" : "hours");
	};

	const handleTabChange = (
		tab: "overview" | "stats" | "matches" | "achievements"
	) => {
		setActiveTab(tab);
	};

	// Custom chart tooltip
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-md shadow-lg border border-slate-700/80">
					<p className="text-slate-400 text-sm font-medium">{label}</p>
					<p className="text-white font-bold">
						{formatNumber(payload[0].value)}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
			{/* Header */}
			<header className="border-b border-slate-800/70 backdrop-blur-md bg-slate-900/30 sticky top-0 z-40">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg">
								<LayoutDashboard className="h-5 w-5 text-white" />
							</div>
							<h1 className="text-xl font-bold tracking-tight">
								Gaming Dashboard
							</h1>
							<span className="text-xs px-2 py-0.5 bg-slate-800/70 rounded-full text-slate-400">
								Live
							</span>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1 text-sm text-emerald-400">
								<div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
								<span>Updated now</span>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
					{/* Leaderboard Section */}
					<div className="lg:col-span-2">
						<div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-lg overflow-hidden">
							<div className="p-4 border-b border-slate-700/70 flex justify-between items-center">
								<h2 className="text-lg font-semibold flex items-center gap-2">
									<Trophy className="h-5 w-5 text-amber-400" />
									Leaderboard
								</h2>
								<span className="text-xs px-2 py-0.5 bg-slate-700/70 rounded-full text-slate-400">
									{filteredPlayers.length} players
								</span>
							</div>

							{/* Filters */}
							<div className="p-4 border-b border-slate-700/70 flex flex-col gap-2">
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Search className="h-4 w-4 text-slate-400" />
									</div>
									<input
										type="text"
										placeholder="Search players..."
										className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/70 rounded-lg text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent focus:outline-none"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
								<div className="grid grid-cols-4 gap-1">
									<button
										onClick={() => setFilterType("all")}
										className={`text-xs px-2 py-1 rounded-md transition-colors ${
											filterType === "all"
												? "bg-indigo-600 text-white"
												: "bg-slate-700/70 text-slate-300 hover:bg-slate-700"
										}`}
									>
										All
									</button>
									<button
										onClick={() => setFilterType("online")}
										className={`text-xs px-2 py-1 rounded-md transition-colors ${
											filterType === "online"
												? "bg-emerald-600 text-white"
												: "bg-slate-700/70 text-slate-300 hover:bg-slate-700"
										}`}
									>
										Online
									</button>
									<button
										onClick={() => setFilterType("offline")}
										className={`text-xs px-2 py-1 rounded-md transition-colors ${
											filterType === "offline"
												? "bg-red-600 text-white"
												: "bg-slate-700/70 text-slate-300 hover:bg-slate-700"
										}`}
									>
										Offline
									</button>
									<button
										onClick={() => setFilterType("in-game")}
										className={`text-xs px-2 py-1 rounded-md transition-colors ${
											filterType === "in-game"
												? "bg-blue-600 text-white"
												: "bg-slate-700/70 text-slate-300 hover:bg-slate-700"
										}`}
									>
										In-Game
									</button>
								</div>
							</div>

							{/* Players List */}
							<div className="max-h-[calc(100vh-300px)] overflow-y-auto">
								{isLoading ? (
									<div className="p-6 flex justify-center items-center">
										<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
									</div>
								) : filteredPlayers.length === 0 ? (
									<div className="p-6 flex flex-col items-center justify-center gap-2 text-slate-400">
										<Users className="h-8 w-8" />
										<p>No players found</p>
									</div>
								) : (
									<div className="divide-y divide-slate-700/50">
										{filteredPlayers.map((player) => {
											const scoreChange = calculateScoreChange(player);
											return (
												<div
													key={player.id}
													className={`p-3 cursor-pointer transition-colors hover:bg-slate-700/30 ${
														selectedPlayer?.id === player.id
															? "bg-indigo-900/30 border-l-4 border-indigo-500"
															: ""
													}`}
													onClick={() => setSelectedPlayer(player)}
												>
													<div className="flex items-center gap-3">
														<div className="relative">
															<img
																src={player.avatar}
																alt={player.name}
																className="h-10 w-10 rounded-full border border-slate-700/70"
															/>
															<span
																className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 ${
																	player.status === "online"
																		? "bg-emerald-500"
																		: player.status === "in-game"
																		? "bg-blue-500"
																		: "bg-slate-500"
																}`}
															></span>
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex justify-between items-center">
																<h3 className="font-medium truncate">
																	{player.name}
																</h3>
																<div className="flex items-center gap-1">
																	<span className="text-xs font-medium text-slate-400">
																		#{player.rank}
																	</span>
																	{player.trend !== "same" && (
																		<Tooltip
																			content={`${
																				player.trend === "up"
																					? "Increased"
																					: "Decreased"
																			} by ${player.trendValue}%`}
																			delay={500}
																		>
																			<div
																				className={`text-xs px-1.5 py-0.5 rounded-full ${
																					player.trend === "up"
																						? "bg-emerald-900/60 text-emerald-400"
																						: "bg-red-900/60 text-red-400"
																				}`}
																			>
																				{player.trend === "up" ? "+" : "-"}
																				{player.trendValue}%
																			</div>
																		</Tooltip>
																	)}
																</div>
															</div>
															<div className="flex justify-between items-center mt-1">
																<div className="flex gap-1">
																	<Badge
																		variant={
																			scoreChange.positive
																				? "success"
																				: "danger"
																		}
																	>
																		{scoreChange.positive ? "+" : ""}
																		{formatNumber(scoreChange.value)} (
																		{scoreChange.percent}%)
																	</Badge>
																</div>
																<div className="text-xs text-slate-400 font-medium">
																	{formatNumber(player.score)} pts
																</div>
															</div>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Player Details Section */}
					<div className="lg:col-span-5">
						{isLoading || !selectedPlayer ? (
							<div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-lg p-6 h-full flex items-center justify-center">
								<div className="text-center">
									<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
									<p className="text-slate-400">Loading player details...</p>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-6">
								{/* Player Profile Card */}
								<div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-lg overflow-hidden">
									<div className="bg-gradient-to-r from-indigo-900/30 to-violet-900/30 p-6">
										<div className="flex flex-col md:flex-row items-center md:items-start gap-4">
											<div className="relative">
												<img
													src={selectedPlayer.avatar}
													alt={selectedPlayer.name}
													className="h-20 w-20 rounded-xl border-2 border-indigo-600/70 shadow-lg"
												/>
												<span
													className={`absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-2 border-slate-800 ${
														selectedPlayer.status === "online"
															? "bg-emerald-500"
															: selectedPlayer.status === "in-game"
															? "bg-blue-500"
															: "bg-slate-500"
													}`}
												></span>
											</div>
											<div className="flex-1">
												<div className="flex justify-between items-start">
													<div>
														<div className="flex items-center gap-2">
															<h2 className="text-2xl font-bold">
																{selectedPlayer.name}
															</h2>
															<span className="text-xs px-2 py-0.5 bg-slate-700/70 rounded-full text-slate-300 border border-slate-600/50">
																Level {selectedPlayer.level}
															</span>
														</div>
														<div className="flex items-center gap-2 mt-1">
															<Badge variant="info">
																ID: {selectedPlayer.id}
															</Badge>
															<Badge
																variant={
																	selectedPlayer.status === "online"
																		? "success"
																		: selectedPlayer.status === "in-game"
																		? "info"
																		: "danger"
																}
															>
																{selectedPlayer.status === "online"
																	? "Online"
																	: selectedPlayer.status === "in-game"
																	? "In Game"
																	: "Offline"}
															</Badge>
															{selectedPlayer.badges.map((badge, index) => (
																<Tooltip
																	key={index}
																	content={badge}
																	delay={500}
																>
																	<Badge variant="default">{badge}</Badge>
																</Tooltip>
															))}
														</div>
													</div>
													<div className="text-right">
														<div className="text-2xl font-bold text-indigo-400">
															{formatNumber(selectedPlayer.score)} pts
														</div>
														<div className="text-sm text-slate-400">
															Rank #{selectedPlayer.rank}
														</div>
													</div>
												</div>

												<div className="flex flex-wrap gap-4 mt-4 text-sm">
													<div className="flex items-center gap-1">
														<Calendar className="h-4 w-4 text-slate-400" />
														<span className="text-slate-300">
															Joined{" "}
															{new Date(
																selectedPlayer.joinDate
															).toLocaleDateString()}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<Clock className="h-4 w-4 text-slate-400" />
														<span className="text-slate-300">
															Last match{" "}
															{new Date(
																selectedPlayer.lastMatch
															).toLocaleDateString()}
														</span>
													</div>
												</div>

												<div className="mt-4 flex flex-wrap gap-2">
													{selectedPlayer.favoriteGames.map((game, index) => (
														<span
															key={index}
															className="text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-slate-300 border border-slate-600/50"
														>
															{game}
														</span>
													))}
												</div>
											</div>
										</div>
									</div>

									{/* Player Tabs */}
									<div className="border-b border-slate-700/70 flex">
										<button
											onClick={() => handleTabChange("overview")}
											className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
												activeTab === "overview"
													? "text-indigo-400 border-b-2 border-indigo-500 bg-slate-700/30"
													: "text-slate-400 hover:text-slate-300 hover:bg-slate-700/20"
											}`}
										>
											<LayoutDashboard className="h-4 w-4" />
											Overview
										</button>
										<button
											onClick={() => handleTabChange("stats")}
											className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
												activeTab === "stats"
													? "text-indigo-400 border-b-2 border-indigo-500 bg-slate-700/30"
													: "text-slate-400 hover:text-slate-300 hover:bg-slate-700/20"
											}`}
										>
											<Activity className="h-4 w-4" />
											Statistics
										</button>
										<button
											onClick={() => handleTabChange("matches")}
											className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
												activeTab === "matches"
													? "text-indigo-400 border-b-2 border-indigo-500 bg-slate-700/30"
													: "text-slate-400 hover:text-slate-300 hover:bg-slate-700/20"
											}`}
										>
											<Award className="h-4 w-4" />
											Recent Matches
										</button>
										<button
											onClick={() => handleTabChange("achievements")}
											className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
												activeTab === "achievements"
													? "text-indigo-400 border-b-2 border-indigo-500 bg-slate-700/30"
													: "text-slate-400 hover:text-slate-300 hover:bg-slate-700/20"
											}`}
										>
											<Trophy className="h-4 w-4" />
											Achievements
										</button>
									</div>

									{/* Tab Content */}
									<div className="p-6">
										{activeTab === "overview" && (
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												<div className="space-y-4">
													<h3 className="text-sm font-medium text-slate-400">
														Performance
													</h3>
													<StatsCard
														title="Win Rate"
														value={`${selectedPlayer.winRate}%`}
														icon={<Trophy className="h-5 w-5 text-amber-400" />}
														trend="up"
														trendValue={12}
														description="Better than 75% of players"
													/>
													<StatsCard
														title="Matches"
														value={formatNumber(selectedPlayer.gamesPlayed)}
														icon={<Zap className="h-5 w-5 text-indigo-400" />}
														trend="up"
														trendValue={8}
													/>
													<StatsCard
														title="K/D Ratio"
														value={selectedPlayer.kdRatio}
														icon={
															<Activity className="h-5 w-5 text-blue-400" />
														}
														trend="same"
														trendValue={0}
													/>
												</div>

												<div className="space-y-4">
													<h3 className="text-sm font-medium text-slate-400">
														Combat Stats
													</h3>
													<StatsCard
														title="Kills"
														value={formatNumber(selectedPlayer.kills)}
														icon={<Star className="h-5 w-5 text-emerald-400" />}
														trend="up"
														trendValue={15}
													/>
													<StatsCard
														title="Solo Kills"
														value={formatNumber(selectedPlayer.soloKills)}
														icon={<Users className="h-5 w-5 text-purple-400" />}
														trend="up"
														trendValue={10}
													/>
													<StatsCard
														title="Team Kills"
														value={formatNumber(selectedPlayer.teamKills)}
														icon={<Users className="h-5 w-5 text-violet-400" />}
														trend="up"
														trendValue={12}
													/>
												</div>

												<div className="space-y-4">
													<h3 className="text-sm font-medium text-slate-400">
														Damage Stats
													</h3>
													<StatsCard
														title="Damage Dealt"
														value={`${formatNumber(
															selectedPlayer.damageDealt
														)} dmg`}
														icon={<Zap className="h-5 w-5 text-red-400" />}
														trend="up"
														trendValue={18}
													/>
													<StatsCard
														title="Damage Taken"
														value={`${formatNumber(
															selectedPlayer.damageTaken
														)} dmg`}
														icon={<Shield className="h-5 w-5 text-blue-400" />}
														trend="down"
														trendValue={5}
													/>
													<StatsCard
														title="Healing Done"
														value={`${formatNumber(
															selectedPlayer.healingDone
														)} hp`}
														icon={<Heart className="h-5 w-5 text-pink-400" />}
														trend="up"
														trendValue={20}
													/>
												</div>
											</div>
										)}

										{activeTab === "stats" && (
											<div className="space-y-6">
												<div className="grid grid-cols-2 gap-4">
													<StatsCard
														title="Total Wins"
														value={formatNumber(selectedPlayer.wins)}
														icon={<Trophy className="h-5 w-5 text-amber-400" />}
														trend="up"
														trendValue={8}
													/>
													<StatsCard
														title="Games Played"
														value={formatNumber(selectedPlayer.gamesPlayed)}
														icon={<Zap className="h-5 w-5 text-indigo-400" />}
														trend="up"
														trendValue={12}
													/>
													<StatsCard
														title="Total Kills"
														value={formatNumber(selectedPlayer.kills)}
														icon={<Star className="h-5 w-5 text-emerald-400" />}
														trend="up"
														trendValue={15}
													/>
													<StatsCard
														title="Deaths"
														value={formatNumber(selectedPlayer.deaths)}
														icon={<Activity className="h-5 w-5 text-red-400" />}
														trend="down"
														trendValue={5}
													/>
												</div>
												<div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-xl border border-slate-700/70">
													<h3 className="text-sm font-medium text-slate-400 mb-3">
														Damage Distribution
													</h3>
													<div className="space-y-3">
														<div>
															<div className="flex justify-between text-sm mb-1">
																<span className="text-slate-400">
																	Damage Dealt
																</span>
																<span className="text-slate-300">
																	{formatNumber(selectedPlayer.damageDealt)}
																</span>
															</div>
															<div className="w-full bg-slate-700/50 rounded-full h-2">
																<div
																	className="bg-red-500 h-2 rounded-full"
																	style={{ width: "70%" }}
																></div>
															</div>
														</div>
														<div>
															<div className="flex justify-between text-sm mb-1">
																<span className="text-slate-400">
																	Damage Taken
																</span>
																<span className="text-slate-300">
																	{formatNumber(selectedPlayer.damageTaken)}
																</span>
															</div>
															<div className="w-full bg-slate-700/50 rounded-full h-2">
																<div
																	className="bg-blue-500 h-2 rounded-full"
																	style={{ width: "50%" }}
																></div>
															</div>
														</div>
														<div>
															<div className="flex justify-between text-sm mb-1">
																<span className="text-slate-400">
																	Healing Done
																</span>
																<span className="text-slate-300">
																	{formatNumber(selectedPlayer.healingDone)}
																</span>
															</div>
															<div className="w-full bg-slate-700/50 rounded-full h-2">
																<div
																	className="bg-pink-500 h-2 rounded-full"
																	style={{ width: "40%" }}
																></div>
															</div>
														</div>
													</div>
												</div>
											</div>
										)}

										{activeTab === "matches" && (
											<div className="space-y-6">
												<div className="flex items-center justify-between mb-4">
													<h3 className="text-lg font-medium">
														Recent Matches
													</h3>
													<button className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														Filter by Date
													</button>
												</div>

												<div className="space-y-4">
													{[1, 2, 3].map((match, index) => (
														<div
															key={index}
															className="bg-slate-800/60 backdrop-blur-md p-4 rounded-xl border border-slate-700/70 hover:border-slate-600/70 transition-colors"
														>
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-3">
																	<div
																		className={`p-2 rounded-lg ${
																			match % 2 === 0
																				? "bg-emerald-900/50"
																				: "bg-red-900/50"
																		}`}
																	>
																		{match % 2 === 0 ? (
																			<Trophy className="h-5 w-5 text-emerald-400" />
																		) : (
																			<Activity className="h-5 w-5 text-red-400" />
																		)}
																	</div>
																	<div>
																		<div className="font-medium">
																			{match % 2 === 0 ? "Victory" : "Defeat"} -
																			Battle Royale #{match}
																		</div>
																		<div className="text-sm text-slate-400">
																			{new Date(
																				Date.now() -
																					Math.floor(
																						Math.random() *
																							7 *
																							24 *
																							60 *
																							60 *
																							1000
																					)
																			).toLocaleDateString()}
																		</div>
																	</div>
																</div>
																<div className="text-right">
																	<div
																		className={`font-bold ${
																			match % 2 === 0
																				? "text-emerald-400"
																				: "text-red-400"
																		}`}
																	>
																		{match % 2 === 0 ? "+" : "-"}1,450 pts
																	</div>
																	<div className="text-sm text-slate-400">
																		{Math.floor(Math.random() * 30) + 1} kills
																	</div>
																</div>
															</div>

															<div className="mt-3 pt-3 border-t border-slate-700/50 grid grid-cols-3 gap-2 text-sm">
																<div className="text-center">
																	<div className="text-slate-400">
																		K/D Ratio
																	</div>
																	<div className="font-medium">
																		{(Math.random() * 5 + 0.5).toFixed(2)}
																	</div>
																</div>
																<div className="text-center">
																	<div className="text-slate-400">Damage</div>
																	<div className="font-medium">
																		{Math.floor(Math.random() * 10000)}
																	</div>
																</div>
																<div className="text-center">
																	<div className="text-slate-400">
																		Time Played
																	</div>
																	<div className="font-medium">
																		{Math.floor(Math.random() * 60)}m{" "}
																		{Math.floor(Math.random() * 60)}s
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>

												<div className="flex justify-center mt-6">
													<button className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-sm transition-colors flex items-center gap-2">
														<ChevronDown className="h-4 w-4" />
														Load More Matches
													</button>
												</div>
											</div>
										)}

										{activeTab === "achievements" && (
											<div className="space-y-6">
												<div className="grid grid-cols-2 gap-4">
													<div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-xl border border-slate-700/70">
														<h3 className="text-sm font-medium text-slate-400 mb-3">
															Badges Earned
														</h3>
														<div className="flex flex-wrap gap-2">
															{selectedPlayer.badges.map((badge, index) => (
																<Tooltip
																	key={index}
																	content={badge}
																	delay={500}
																>
																	<Badge variant="default">{badge}</Badge>
																</Tooltip>
															))}
														</div>
													</div>
													<div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-xl border border-slate-700/70">
														<h3 className="text-sm font-medium text-slate-400 mb-3">
															Achievement Progress
														</h3>
														<div className="space-y-3">
															{[1, 2, 3].map((progress, index) => (
																<div key={index}>
																	<div className="flex justify-between text-sm mb-1">
																		<span className="text-slate-300">
																			Battle Royale Master
																		</span>
																		<span className="text-slate-400">
																			{Math.floor(Math.random() * 100)}%
																		</span>
																	</div>
																	<div className="w-full bg-slate-700/50 rounded-full h-2">
																		<div
																			className="bg-indigo-500 h-2 rounded-full"
																			style={{
																				width: `${Math.floor(
																					Math.random() * 100
																				)}%`,
																			}}
																		></div>
																	</div>
																</div>
															))}
														</div>
													</div>
												</div>

												<div className="space-y-4">
													<h3 className="text-lg font-medium">
														Recent Achievements
													</h3>
													{[1, 2, 3].map((achievement, index) => (
														<div
															key={index}
															className="bg-slate-800/60 backdrop-blur-md p-4 rounded-xl border border-slate-700/70 flex items-center gap-3"
														>
															<div
																className={`p-2 rounded-lg ${
																	[
																		"bg-emerald-900/50",
																		"bg-blue-900/50",
																		"bg-amber-900/50",
																	][index]
																}`}
															>
																<Trophy
																	className={`h-5 w-5 ${
																		[
																			"text-emerald-400",
																			"text-blue-400",
																			"text-amber-400",
																		][index]
																	}`}
																/>
															</div>
															<div>
																<div className="font-medium">
																	{
																		[
																			"First Victory",
																			"1000 Kills",
																			"Battle Royale Legend",
																		][index]
																	}
																</div>
																<div className="text-sm text-slate-400">
																	{new Date(
																		Date.now() -
																			Math.floor(
																				Math.random() * 30 * 24 * 60 * 60 * 1000
																			)
																	).toLocaleDateString()}
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Performance Chart */}
								<div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-lg p-6">
									<div className="flex justify-between items-center mb-6">
										<h2 className="text-lg font-semibold">Performance Trend</h2>
										<div className="flex items-center gap-2">
											<span className="text-xs text-slate-400">View:</span>
											<button
												onClick={handleToggleTimeFormat}
												className="text-xs px-3 py-1.5 bg-slate-700/70 hover:bg-slate-700/90 rounded-md transition-colors flex items-center gap-1"
											>
												{timeFormat === "hours" ? "Hours" : "Minutes"}
											</button>
										</div>
									</div>

									<div className="h-64">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={chartData[selectedPlayer.id]}
												margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
											>
												<CartesianGrid
													strokeDasharray="3 3"
													vertical={false}
													stroke="rgba(51, 65, 85, 0.5)"
												/>
												<XAxis
													dataKey="name"
													axisLine={false}
													tickLine={false}
													tick={{ fill: "#94a3b8" }}
													tickMargin={10}
													height={40}
												/>
												<YAxis
													axisLine={false}
													tickLine={false}
													tick={{ fill: "#94a3b8" }}
													width={60}
													domain={["dataMin - 500", "dataMax + 500"]}
												/>
												<RechartsTooltip
													content={<CustomTooltip />}
													cursor={{
														stroke: "rgba(148, 163, 184, 0.3)",
														strokeWidth: 1,
													}}
												/>
												<Line
													type="monotone"
													dataKey="score"
													stroke="url(#colorGradient)"
													strokeWidth={3}
													dot={false}
													activeDot={{
														r: 6,
														fill: "#818cf8",
														stroke: "white",
														strokeWidth: 2,
													}}
												/>
												<defs>
													<linearGradient
														id="colorGradient"
														x1="0"
														y1="0"
														x2="1"
														y2="0"
													>
														<stop
															offset="5%"
															stopColor="#818cf8"
															stopOpacity={1}
														/>
														<stop
															offset="95%"
															stopColor="#c084fc"
															stopOpacity={1}
														/>
													</linearGradient>
												</defs>
											</LineChart>
										</ResponsiveContainer>
									</div>
								</div>

								{/* Stats Grid */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-lg p-6">
										<h2 className="text-lg font-semibold mb-4">
											Weekly Statistics
										</h2>
										<div className="space-y-4">
											<div className="flex justify-between items-center">
												<span className="text-slate-400">Matches Won</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">142</span>
													<span className="text-emerald-500 text-xs">+12%</span>
												</div>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-slate-400">Matches Lost</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">78</span>
													<span className="text-red-500 text-xs">-5%</span>
												</div>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-slate-400">K/D Ratio</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">2.45</span>
													<span className="text-emerald-500 text-xs">+8%</span>
												</div>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-slate-400">Avg. Damage</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">1,450</span>
													<span className="text-emerald-500 text-xs">+15%</span>
												</div>
											</div>
										</div>
									</div>

									<div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-lg p-6">
										<h2 className="text-lg font-semibold mb-4">Game Modes</h2>
										<div className="space-y-4">
											<div>
												<div className="flex justify-between mb-1">
													<span className="text-sm text-slate-400">
														Battle Royale
													</span>
													<span className="text-sm font-medium">68%</span>
												</div>
												<div className="w-full bg-slate-700/50 rounded-full h-2">
													<div
														className="bg-indigo-500 h-2 rounded-full"
														style={{ width: "68%" }}
													></div>
												</div>
											</div>
											<div>
												<div className="flex justify-between mb-1">
													<span className="text-sm text-slate-400">
														Team Deathmatch
													</span>
													<span className="text-sm font-medium">22%</span>
												</div>
												<div className="w-full bg-slate-700/50 rounded-full h-2">
													<div
														className="bg-blue-500 h-2 rounded-full"
														style={{ width: "22%" }}
													></div>
												</div>
											</div>
											<div>
												<div className="flex justify-between mb-1">
													<span className="text-sm text-slate-400">
														Capture the Flag
													</span>
													<span className="text-sm font-medium">10%</span>
												</div>
												<div className="w-full bg-slate-700/50 rounded-full h-2">
													<div
														className="bg-emerald-500 h-2 rounded-full"
														style={{ width: "10%" }}
													></div>
												</div>
											</div>
										</div>
									</div>

									<div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-lg p-6">
										<h2 className="text-lg font-semibold mb-4">
											Game Time Distribution
										</h2>
										<div className="flex items-center justify-center h-48">
											<div className="relative w-40 h-40">
												<svg className="w-full h-full" viewBox="0 0 100 100">
													<circle
														cx="50"
														cy="50"
														r="40"
														fill="rgba(51, 65, 85, 0.3)"
													/>
													<circle
														cx="50"
														cy="50"
														r="40"
														fill="rgba(99, 102, 241, 0.3)"
														stroke="rgba(99, 102, 241, 0.8)"
														strokeWidth="10"
														strokeDasharray="75 175"
													/>
													<circle
														cx="50"
														cy="50"
														r="40"
														fill="rgba(96, 165, 250, 0.3)"
														stroke="rgba(96, 165, 250, 0.8)"
														strokeWidth="10"
														strokeDasharray="50 200"
														strokeDashoffset="75"
													/>
													<circle
														cx="50"
														cy="50"
														r="40"
														fill="rgba(167, 139, 250, 0.3)"
														stroke="rgba(167, 139, 250, 0.8)"
														strokeWidth="10"
														strokeDasharray="25 225"
														strokeDashoffset="125"
													/>
													<text
														x="50"
														y="50"
														textAnchor="middle"
														fill="white"
														fontSize="16"
														fontWeight="bold"
													>
														48h
													</text>
													<text
														x="50"
														y="65"
														textAnchor="middle"
														fill="#94a3b8"
														fontSize="10"
													>
														Total Time
													</text>
												</svg>
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="text-center">
														<div className="text-white font-bold">48h</div>
														<div className="text-slate-400 text-xs">
															Total Time
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="grid grid-cols-3 gap-2 mt-2 text-sm">
											<div className="flex items-center gap-1">
												<div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
												<span>Fortnite (45%)</span>
											</div>
											<div className="flex items-center gap-1">
												<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
												<span>Apex (30%)</span>
											</div>
											<div className="flex items-center gap-1">
												<div className="w-3 h-3 bg-purple-500 rounded-full"></div>
												<span>Others (25%)</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
