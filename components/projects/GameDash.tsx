"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	AreaChart,
	Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
	Users,
	Trophy,
	Activity,
	Star,
	Award,
	BarChart2,
	PieChart,
	Clock,
	Target,
	Zap,
	Flame,
	Shield,
	ChevronRight,
	Search,
	Bell,
	User,
	LogOut,
	Settings,
	Home,
	Menu,
	X,
	ShieldAlert,
	AlertTriangle,
	CheckCircle2,
	Info,
} from "lucide-react";

type Player = {
	id: number;
	name: string;
	rank: number;
	score: number;
	wins: number;
	losses: number;
	winRate: number;
	avatar: string;
	level: number;
	achievements: {
		total: number;
		completed: number;
		progress: number;
	};
	recentGames: {
		id: number;
		date: string;
		result: "win" | "loss";
		score: number;
	}[];
	stats: {
		kills: number;
		deaths: number;
		assists: number;
		kdRatio: number;
		accuracy: number;
		headshots: number;
		playtime: number;
	};
	performanceData: {
		month: string;
		kills: number;
		deaths: number;
		kdRatio: number;
	}[];
	accuracyData: {
		week: string;
		accuracy: number;
	}[];
	gameModeData: {
		name: string;
		matches: number;
		winRate: number;
	}[];
	achievementCategories: {
		name: string;
		completed: number;
		total: number;
		progress: number;
	}[];
	recentAchievements: {
		id: number;
		name: string;
		description: string;
		date: string;
		rarity: string;
		icon: string;
		color: string;
	}[];
};

type NotificationType = "info" | "success" | "warning" | "error";

type Notification = {
	id: string;
	type: NotificationType;
	message: string;
	title: string;
	dismissed?: boolean;
	timestamp: number;
};

type TimeRange = "7d" | "30d" | "90d" | "all";
type StatCategory = "overview" | "combat" | "achievements";

const generateMockData = (): Player[] => {
	const baseNames = [
		"ShadowSniper",
		"BlazeFury",
		"NightStalker",
		"VortexQueen",
		"PhantomX",
		"ThunderStrike",
		"FrostBite",
		"NeonBlade",
		"CrimsonHawk",
		"OmegaWolf",
		"TitanSlayer",
		"CosmicRift",
		"DriftQueen",
		"NovaGuardian",
		"PaladinEcho",
	];

	return baseNames.slice(0, 10).map((name, index) => {
		const rank = index + 1;
		const score = 10000 - rank * (Math.random() * 300 + 100);
		const wins = Math.floor(200 - rank * (Math.random() * 5 + 2));
		const losses = Math.floor(40 + rank * (Math.random() * 4 + 3));
		const winRate = parseFloat(((wins / (wins + losses)) * 100).toFixed(1));

		const kills = Math.floor(4000 - rank * (Math.random() * 200 + 100));
		const deaths = Math.floor(1200 + rank * (Math.random() * 50 + 25));
		const kdRatio = parseFloat((kills / deaths).toFixed(2));

		const recentGames = Array(5)
			.fill(null)
			.map((_, i) => {
				const day = Math.floor(i / 2);
				const date = new Date();
				date.setDate(date.getDate() - day);

				const hours = Math.floor(Math.random() * 24);
				const minutes = Math.floor(Math.random() * 60);
				date.setHours(hours, minutes);

				const dateStr = `${date.toISOString().split("T")[0]} ${hours
					.toString()
					.padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

				const isWin = Math.random() > 0.3 + rank / 30;
				return {
					id: i + 1,
					date: dateStr,
					result: isWin ? "win" : "loss",
					score: isWin
						? Math.floor(300 + Math.random() * 200)
						: Math.floor(150 + Math.random() * 150),
				};
			});

		const performanceData = Array(7)
			.fill(null)
			.map((_, i) => {
				const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
				const monthKills = Math.floor(300 + Math.random() * 200 - rank * 10);
				const monthDeaths = Math.floor(120 + Math.random() * 50 + rank * 2);
				return {
					month: months[i],
					kills: monthKills,
					deaths: monthDeaths,
					kdRatio: parseFloat((monthKills / monthDeaths).toFixed(2)),
				};
			});

		const baseAccuracy = 75 - rank * 3;
		const accuracyData = Array(7)
			.fill(null)
			.map((_, i) => {
				return {
					week: `Week ${i + 1}`,
					accuracy: Math.min(
						90,
						Math.max(40, baseAccuracy + Math.floor(Math.random() * 10 - 5))
					),
				};
			});

		const gameModeData = [
			{
				name: "Deathmatch",
				matches: Math.floor(150 - rank * 5),
				winRate: Math.floor(80 - rank * 2),
			},
			{
				name: "Capture Flag",
				matches: Math.floor(120 - rank * 4),
				winRate: Math.floor(75 - rank * 2),
			},
			{
				name: "Control",
				matches: Math.floor(100 - rank * 3),
				winRate: Math.floor(70 - rank * 2),
			},
			{
				name: "Team Battle",
				matches: Math.floor(130 - rank * 4),
				winRate: Math.floor(85 - rank * 2),
			},
			{
				name: "Boss Hunt",
				matches: Math.floor(80 - rank * 3),
				winRate: Math.floor(60 - rank * 1.5),
			},
		];

		const achievementTotal = 50;
		const achievementCompleted = Math.floor(45 - rank * 3);
		const achievementProgress = Math.floor(
			(achievementCompleted / achievementTotal) * 100
		);

		const achievementCategories = [
			{
				name: "Combat Master",
				completed: Math.floor(15 - rank * 0.5),
				total: 15,
				progress: Math.floor(100 - rank * 3.3),
			},
			{
				name: "Explorer",
				completed: Math.floor(10 - rank * 0.4),
				total: 10,
				progress: Math.floor(100 - rank * 4),
			},
			{
				name: "Strategist",
				completed: Math.floor(8 - rank * 0.3),
				total: 8,
				progress: Math.floor(100 - rank * 5),
			},
			{
				name: "Collector",
				completed: Math.floor(12 - rank * 0.5),
				total: 12,
				progress: Math.floor(100 - rank * 3.5),
			},
			{
				name: "Social",
				completed: Math.floor(10 - rank * 0.4),
				total: 10,
				progress: Math.floor(100 - rank * 4),
			},
		];

		const achievementDates = [
			"1 day ago",
			"3 days ago",
			"1 week ago",
			"2 weeks ago",
		];
		const recentAchievements = [
			{
				id: 1,
				name: "Flawless Victory",
				description: "Win a match without dying",
				date: achievementDates[Math.floor(Math.random() * 4)],
				rarity: "Rare",
				icon: "Trophy",
				color: "blue",
			},
			{
				id: 2,
				name: "Sharpshooter",
				description: "Achieve 90% accuracy in a single match",
				date: achievementDates[Math.floor(Math.random() * 4)],
				rarity: "Epic",
				icon: "Target",
				color: "purple",
			},
			{
				id: 3,
				name: "Team Player",
				description: "Get 15 assists in one match",
				date: achievementDates[Math.floor(Math.random() * 4)],
				rarity: "Uncommon",
				icon: "Users",
				color: "green",
			},
			{
				id: 4,
				name: "Marathon Runner",
				description: "Play for 24 hours total",
				date: achievementDates[Math.floor(Math.random() * 4)],
				rarity: "Common",
				icon: "Clock",
				color: "gray",
			},
		];

		recentAchievements.sort((a, b) => {
			const dateOrder = {
				"1 day ago": 0,
				"3 days ago": 1,
				"1 week ago": 2,
				"2 weeks ago": 3,
			};
			return dateOrder[a.date] - dateOrder[b.date];
		});
		const avatarUrls = [
			"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
			"https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg",
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuWfsxXJE-q6tDJ2hvRHJcL3HsD--WPYJuNg&s",
			"https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg?semt=ais_hybrid&w=740",
			"https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
			"https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg",
			"https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740",
			"https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg?semt=ais_items_boosted&w=740",
			"https://img.freepik.com/premium-vector/avatar-portrait-young-caucasian-woman-round-frame-vector-cartoon-flat-illustration_551425-22.jpg?semt=ais_items_boosted&w=740",
			"https://img.freepik.com/premium-vector/drawing-boy-with-brown-hair-style_1230457-40937.jpg?semt=ais_hybrid&w=740",
		];

		return {
			id: index + 1,
			name,
			rank,
			score,
			wins,
			losses,
			winRate,
			avatar: avatarUrls[index] || avatarUrls[0],
			level: Math.floor(80 - rank * (Math.random() * 2 + 1)),
			achievements: {
				total: achievementTotal,
				completed: achievementCompleted,
				progress: achievementProgress,
			},
			recentGames,
			stats: {
				kills,
				deaths,
				assists: Math.floor(2000 - rank * (Math.random() * 100 + 50)),
				kdRatio,
				accuracy: Math.floor(70 - rank * (Math.random() * 1.5 + 0.5)),
				headshots: Math.floor(1300 - rank * (Math.random() * 80 + 40)),
				playtime: Math.floor(300 - rank * (Math.random() * 10 + 5)),
			},
			performanceData,
			accuracyData,
			gameModeData,
			achievementCategories,
			recentAchievements,
		};
	});
};

const initialMockPlayers = generateMockData();

const updatePlayerStats = (player: Player): Player => {
	const scoreChange = Math.floor(Math.random() * 20) - 5;
	const winOrLoss = Math.random() > 0.7;

	const updatedPlayer = { ...player };

	updatedPlayer.score = Math.max(5000, player.score + scoreChange);

	if (winOrLoss) {
		updatedPlayer.wins += 1;
	} else {
		updatedPlayer.losses += 1;
	}

	updatedPlayer.winRate = parseFloat(
		(
			(updatedPlayer.wins / (updatedPlayer.wins + updatedPlayer.losses)) *
			100
		).toFixed(1)
	);

	const killsChange = Math.floor(Math.random() * 10) - 2;
	const deathsChange = Math.floor(Math.random() * 5) - 1;

	updatedPlayer.stats.kills = Math.max(0, player.stats.kills + killsChange);
	updatedPlayer.stats.deaths = Math.max(0, player.stats.deaths + deathsChange);
	updatedPlayer.stats.kdRatio = parseFloat(
		(updatedPlayer.stats.kills / updatedPlayer.stats.deaths).toFixed(2)
	);

	const accuracyChange = Math.random() * 2 - 1;
	updatedPlayer.stats.accuracy = Math.min(
		100,
		Math.max(30, player.stats.accuracy + accuracyChange)
	);

	if (Math.random() > 0.995) {
		const newDate = new Date();
		const hours = Math.floor(Math.random() * 24);
		const minutes = Math.floor(Math.random() * 60);
		newDate.setHours(hours, minutes);

		const dateStr = `${newDate.toISOString().split("T")[0]} ${hours
			.toString()
			.padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

		const newGame = {
			id: player.recentGames.length + 1,
			date: dateStr,
			result: winOrLoss ? "win" : "loss",
			score: winOrLoss
				? Math.floor(300 + Math.random() * 200)
				: Math.floor(150 + Math.random() * 150),
		};
		updatedPlayer.recentGames = [newGame, ...player.recentGames.slice(0, 4)];
	}

	if (Math.random() > 0.85) {
		const latestMonth =
			updatedPlayer.performanceData[updatedPlayer.performanceData.length - 1];
		latestMonth.kills += killsChange;
		latestMonth.deaths += deathsChange;
		latestMonth.kdRatio = parseFloat(
			(latestMonth.kills / latestMonth.deaths).toFixed(2)
		);
	}

	if (Math.random() > 0.85) {
		const latestWeek =
			updatedPlayer.accuracyData[updatedPlayer.accuracyData.length - 1];
		latestWeek.accuracy = Math.min(
			100,
			Math.max(30, latestWeek.accuracy + accuracyChange)
		);
	}

	if (Math.random() > 0.92) {
		const randomCategory = Math.floor(
			Math.random() * updatedPlayer.achievementCategories.length
		);
		const category = updatedPlayer.achievementCategories[randomCategory];

		if (category.completed < category.total) {
			category.completed += 1;
			category.progress = Math.floor(
				(category.completed / category.total) * 100
			);

			updatedPlayer.achievements.completed += 1;
			updatedPlayer.achievements.progress = Math.floor(
				(updatedPlayer.achievements.completed /
					updatedPlayer.achievements.total) *
					100
			);
		}
	}

	return updatedPlayer;
};

const generateNotification = (
	player: Player,
	prevPlayer: Player
): Notification | null => {
	if (
		player.recentGames[0]?.result === "win" &&
		player.recentGames[1]?.result === "win" &&
		prevPlayer.recentGames[0]?.id !== player.recentGames[0]?.id
	) {
		return {
			id: `win-streak-${player.id}-${Date.now()}`,
			type: "success",
			title: "Win Streak!",
			message: `${player.name} is on a winning streak!`,
			timestamp: Date.now(),
			dismissed: false,
		};
	}

	if (player.level > prevPlayer.level) {
		return {
			id: `level-up-${player.id}-${Date.now()}`,
			type: "success",
			title: "Level Up!",
			message: `${player.name} reached level ${player.level}!`,
			timestamp: Date.now(),
			dismissed: false,
		};
	}

	if (player.achievements.completed > prevPlayer.achievements.completed) {
		return {
			id: `achievement-${player.id}-${Date.now()}`,
			type: "info",
			title: "Achievement Unlocked!",
			message: `${player.name} unlocked a new achievement!`,
			timestamp: Date.now(),
			dismissed: false,
		};
	}

	if (player.rank < prevPlayer.rank) {
		return {
			id: `rank-up-${player.id}-${Date.now()}`,
			type: "success",
			title: "Rank Improved!",
			message: `${player.name} moved up to rank ${player.rank}!`,
			timestamp: Date.now(),
			dismissed: false,
		};
	}

	if (
		player.stats.kdRatio < prevPlayer.stats.kdRatio &&
		player.stats.kdRatio < 1.0
	) {
		return {
			id: `low-kd-${player.id}-${Date.now()}`,
			type: "warning",
			title: "Performance Alert",
			message: `${player.name}'s K/D ratio has dropped to ${player.stats.kdRatio}`,
			timestamp: Date.now(),
			dismissed: false,
		};
	}

	if (player.score - prevPlayer.score > 15) {
		return {
			id: `high-score-${player.id}-${Date.now()}`,
			type: "info",
			title: "Score Jump",
			message: `${player.name} gained ${(
				player.score - prevPlayer.score
			).toFixed(0)} points!`,
			timestamp: Date.now(),
			dismissed: false,
		};
	}

	if (Math.random() > 0.97) {
		const serverEvents = [
			{
				type: "info",
				title: "Server Maintenance",
				message: "Scheduled maintenance in 30 minutes",
			},
			{
				type: "warning",
				title: "High Server Load",
				message: "Some players may experience lag",
			},
			{
				type: "error",
				title: "Match Server Down",
				message: "Team is investigating connection issues",
			},
			{
				type: "success",
				title: "New Season",
				message: "Season 8 has officially begun!",
			},
		];

		const event = serverEvents[Math.floor(Math.random() * serverEvents.length)];
		return {
			id: `server-${Date.now()}`,
			type: event.type as NotificationType,
			title: event.title,
			message: event.message,
			timestamp: Date.now(),
			dismissed: false,
		};
	}

	return null;
};

interface StatsCardProps {
	title: string;
	value: string | number;
	change: string | number;
	icon: React.ReactNode;
	color:
		| "cyan"
		| "rose"
		| "fuchsia"
		| "amber"
		| "green"
		| "blue"
		| "red"
		| "purple"
		| "emerald";
	timeRange?: string;
}

interface ChartCardProps {
	title: string;
	icon: React.ReactNode;
	iconColor: string;
	children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
	title,
	icon,
	iconColor,
	children,
}) => {
	return (
		<div className="bg-slate-800/80 rounded-xl p-4 md:p-5 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 relative overflow-hidden group">
			<div className="absolute inset-0 bg-gradient-to-br from-slate-700/0 to-slate-700/0 group-hover:from-slate-700/10 group-hover:to-slate-700/5 transition-all duration-300"></div>

			<div className="flex items-center justify-between mb-4 md:mb-5 relative z-10">
				<h3 className="text-sm md:text-lg font-bold text-white flex items-center">
					<span className={`h-4 w-4 md:h-5 md:w-5 mr-2 ${iconColor}`}>
						{icon}
					</span>
					{title}
				</h3>
			</div>
			<div className="relative z-10">{children}</div>
		</div>
	);
};

interface PlayerCardProps {
	player: Player;
	isSelected: boolean;
	onClick: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
	player,
	isSelected,
	onClick,
}) => {
	const getRankStyles = (rank: any) => {
		if (rank === 1) {
			return {
				borderColor: "border-amber-400",
				badgeBg: "bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400",
				glow: "shadow-lg shadow-amber-500/30",
				textColor: "text-amber-300",
			};
		} else if (rank === 2) {
			return {
				borderColor: "border-slate-300",
				badgeBg: "bg-gradient-to-r from-zinc-400 via-slate-300 to-gray-200",
				glow: "shadow-lg shadow-slate-400/30",
				textColor: "text-slate-200",
			};
		} else if (rank === 3) {
			return {
				borderColor: "border-amber-700",
				badgeBg: "bg-gradient-to-r from-amber-800 via-amber-700 to-orange-600",
				glow: "shadow-lg shadow-amber-700/30",
				textColor: "text-amber-600",
			};
		} else {
			return {
				borderColor: "border-slate-700 group-hover:border-cyan-700/60",
				badgeBg: "bg-slate-700",
				glow: "",
				textColor: "text-slate-400",
			};
		}
	};

	const getWinRateGradient = (winRate: any) => {
		if (winRate > 70) {
			return "bg-gradient-to-r from-teal-500 via-emerald-600 to-emerald-500";
		} else if (winRate > 50) {
			return "bg-gradient-to-r from-orange-600 via-amber-400 to-orange-400";
		} else {
			return "bg-gradient-to-r from-rose-600 via-pink-500 to-rose-500";
		}
	};

	const rankStyles = getRankStyles(player.rank);

	return (
		<motion.div
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -5 }}
			transition={{ duration: 0.2 }}
			onClick={onClick}
			className={`p-3 md:p-5 cursor-pointer relative group overflow-hidden transition-all duration-300 ${
				isSelected
					? "bg-gradient-to-r from-slate-900/95 to-slate-900/80"
					: "bg-slate-900 hover:bg-gradient-to-r hover:from-slate-900/90 hover:to-slate-800/80"
			}`}
		>
			<div className="absolute inset-0 opacity-20 bg-noise pointer-events-none"></div>

			{isSelected && (
				<motion.div
					initial={{ height: 0 }}
					animate={{ height: "100%" }}
					className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-cyan-500 to-blue-600"
				></motion.div>
			)}

			{!isSelected && (
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 transition-all duration-300"></div>
			)}

			<div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none"></div>

			<div className="flex items-center justify-between relative z-10">
				<div className="flex items-center space-x-2 md:space-x-4">
					<div
						className={`flex-shrink-0 w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-lg font-bold transition-all duration-200 ${
							player.rank <= 3
								? `bg-gradient-to-br from-slate-900 to-slate-800 text-white border ${rankStyles.borderColor} ${rankStyles.glow}`
								: "bg-slate-900 text-slate-400 border border-slate-700/70 group-hover:border-slate-600/70"
						}`}
					>
						<span
							className={`text-xs md:text-base ${
								player.rank <= 3 ? rankStyles.textColor : ""
							}`}
						>
							{player.rank}
						</span>
					</div>

					<div className="flex items-center space-x-2 md:space-x-3">
						<div className="relative">
							<div
								className={`absolute -inset-0.5 rounded-lg opacity-50 blur-sm ${
									player.rank <= 3
										? rankStyles.badgeBg
										: "bg-slate-700/0 group-hover:bg-cyan-800/30"
								} transition-all duration-300`}
							></div>
							<img
								src={player.avatar}
								alt={player.name}
								className={`h-8 w-8 md:h-12 md:w-12 rounded-full border-2 transition-all duration-300 relative z-10 ${rankStyles.borderColor}`}
							/>

							{player.rank <= 3 && (
								<div
									className={`absolute -top-2 -right-2 p-1 md:p-1.5 rounded-md ${rankStyles.badgeBg} ${rankStyles.glow} z-20`}
								>
									<Trophy className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-white drop-shadow" />
								</div>
							)}
						</div>

						<div>
							<div className="font-semibold text-white tracking-tight text-xs md:text-base">
								{player.name}
							</div>
							<div className="text-xs text-slate-300 flex items-center space-x-2 mt-0.5 md:mt-1">
								<span className="bg-slate-900 px-1.5 py-0.5 rounded-md text-cyan-300 text-[10px] md:text-xs font-medium border border-slate-700/50 transition-colors duration-200 group-hover:border-cyan-900/30 group-hover:bg-slate-800/90">
									Lvl {player.level}
								</span>
								<span className="text-slate-500 hidden md:inline">•</span>
								<span className="text-slate-300 text-[10px] md:text-xs hidden md:inline">
									{player.wins} Wins
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="text-right">
					<div className="font-bold text-white text-sm md:text-lg">
						{player.score.toLocaleString(undefined, {
							maximumFractionDigits: 0,
						})}
					</div>
					<div className="text-[10px] md:text-xs flex items-center justify-end mt-0.5 md:mt-1">
						<span
							className={`px-1.5 md:px-2 py-0.5 rounded-md font-medium ${
								player.winRate > 70
									? "bg-teal-900/40 text-teal-300"
									: player.winRate > 50
									? "bg-amber-900/40 text-amber-300"
									: "bg-fuchsia-900/40 text-pink-300"
							}`}
						>
							{player.winRate}% WR
						</span>
					</div>
				</div>
			</div>

			<div className="mt-3 md:mt-4 h-1.5 md:h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/70">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${player.winRate}%` }}
					transition={{ duration: 0.7, ease: "easeOut" }}
					className={`h-full rounded-full relative overflow-hidden ${getWinRateGradient(
						player.winRate
					)}`}
				>
					<div className="absolute inset-0 w-full h-full shimmer-effect"></div>
					<div className="absolute inset-0 w-full h-1/2 bg-white/20"></div>
				</motion.div>
			</div>

			<div className="mt-1.5 md:mt-2 flex justify-between text-[10px] md:text-xs text-slate-500">
				<div className="flex items-center space-x-1">
					<div
						className={`w-1.5 h-1.5 rounded-full ${
							player.winRate > 50 ? "bg-cyan-500" : "bg-slate-600"
						}`}
					></div>
					<span>K/D: {player.stats.kdRatio}</span>
				</div>
				<div className="flex items-center space-x-1">
					<div
						className={`w-1.5 h-1.5 rounded-full ${
							player.stats.accuracy > 60 ? "bg-cyan-500" : "bg-slate-600"
						}`}
					></div>
					<span>Accuracy: {player.stats.accuracy.toFixed(1)}%</span>
				</div>
			</div>
		</motion.div>
	);
};

interface AchievementCardProps {
	achievement: {
		id: number;
		name: string;
		description: string;
		date: string;
		rarity: string;
		icon: string;
		color: string;
	};
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
	const getIconComponent = () => {
		switch (achievement.icon) {
			case "Trophy":
				return <Trophy className="h-4 w-4 md:h-6 md:w-6" />;
			case "Target":
				return <Target className="h-4 w-4 md:h-6 md:w-6" />;
			case "Users":
				return <Users className="h-4 w-4 md:h-6 md:w-6" />;
			case "Clock":
				return <Clock className="h-4 w-4 md:h-6 md:w-6" />;
			default:
				return <Award className="h-4 w-4 md:h-6 md:w-6" />;
		}
	};

	const getColorClasses = () => {
		switch (achievement.color) {
			case "blue":
				return "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-500/30";
			case "purple":
				return "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:border-purple-500/30";
			case "green":
				return "bg-green-500/10 text-green-400 group-hover:bg-green-500/20 group-hover:border-green-500/30";
			case "gray":
				return "bg-slate-500/10 text-slate-400 group-hover:bg-slate-500/20 group-hover:border-slate-500/30";
			default:
				return "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/30";
		}
	};

	const rarityColorClass = () => {
		switch (achievement.rarity) {
			case "Common":
				return "bg-slate-600/50 text-slate-300";
			case "Uncommon":
				return "bg-green-500/20 text-green-400";
			case "Rare":
				return "bg-blue-500/20 text-blue-400";
			case "Epic":
				return "bg-purple-500/20 text-purple-400";
			default:
				return "bg-amber-500/20 text-amber-400";
		}
	};

	return (
		<motion.div
			initial={{ x: -10, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.3 }}
			className="flex items-center p-3 md:p-4 bg-slate-800/80 rounded-lg border border-slate-700/50 hover:border-slate-600/70 transition-all duration-200 group relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-gradient-to-r from-slate-700/0 to-slate-700/0 group-hover:from-slate-700/15 group-hover:to-slate-700/5 transition-all duration-300"></div>

			<div
				className={`h-8 w-8 md:h-12 md:w-12 rounded-md flex items-center justify-center mr-3 md:mr-4 transition-all duration-200 ${getColorClasses()}`}
			>
				{getIconComponent()}
			</div>
			<div className="flex-1 relative z-10">
				<div className="flex items-center flex-wrap">
					<h4 className="font-semibold text-white text-sm md:text-base">
						{achievement.name}
					</h4>
					<span
						className={`ml-2 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-md transition-colors duration-200 ${rarityColorClass()}`}
					>
						{achievement.rarity}
					</span>
				</div>
				<p className="text-xs md:text-sm text-slate-400 mt-0.5 md:mt-1">
					{achievement.description}
				</p>
			</div>
			<div className="text-[10px] md:text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-md group-hover:bg-slate-700/70 transition-all duration-200 whitespace-nowrap">
				{achievement.date}
			</div>
		</motion.div>
	);
};

interface ToastProps {
	notification: Notification;
	onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
	const { id, type, title, message } = notification;

	useEffect(() => {
		const timer = setTimeout(() => {
			onClose(id);
		}, 5000);

		return () => clearTimeout(timer);
	}, [id, onClose]);

	const getIcon = () => {
		switch (type) {
			case "success":
				return <CheckCircle2 className="h-5 w-5 text-green-400" />;
			case "warning":
				return <AlertTriangle className="h-5 w-5 text-amber-400" />;
			case "error":
				return <ShieldAlert className="h-5 w-5 text-rose-400" />;
			default:
				return <Info className="h-5 w-5 text-blue-400" />;
		}
	};

	const getContainerStyles = () => {
		switch (type) {
			case "success":
				return "border-l-4 border-green-500 bg-green-500/10";
			case "warning":
				return "border-l-4 border-amber-500 bg-amber-500/10";
			case "error":
				return "border-l-4 border-rose-500 bg-rose-500/10";
			default:
				return "border-l-4 border-blue-500 bg-blue-500/10";
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50, x: 50 }}
			animate={{ opacity: 1, y: 0, x: 0 }}
			exit={{ opacity: 0, y: 20, x: 20 }}
			className={`p-4 rounded-r-lg shadow-lg backdrop-blur-sm ${getContainerStyles()} mb-3 max-w-xs`}
		>
			<div className="flex">
				<div className="flex-shrink-0">{getIcon()}</div>
				<div className="ml-3 flex-1">
					<p className="text-sm font-medium text-white">{title}</p>
					<p className="mt-1 text-xs text-slate-300">{message}</p>
				</div>
				<div className="ml-2">
					<button
						onClick={() => onClose(id)}
						className="inline-flex text-slate-400 hover:text-white focus:outline-none"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			</div>
		</motion.div>
	);
};

const GamingDashboard: React.FC = () => {
	const [players, setPlayers] = useState<Player[]>(initialMockPlayers);
	const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
	const [timeRange, setTimeRange] = useState<TimeRange>("30d");
	const [statCategory, setStatCategory] = useState<StatCategory>("overview");
	const [sortBy, setSortBy] = useState<"rank" | "score" | "winRate">("rank");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [displayedNotifications, setDisplayedNotifications] = useState<
		Notification[]
	>([]);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [notificationCount, setNotificationCount] = useState(0);
	const [isOnline, setIsOnline] = useState(true);
	const [serverLoad, setServerLoad] = useState(
		Math.floor(Math.random() * 30) + 60
	);
	const [activePlayers, setActivePlayers] = useState(
		Math.floor(Math.random() * 5000) + 15000
	);

	const prevPlayersRef = useRef<Player[]>(initialMockPlayers);
	const notificationsRef = useRef<Notification[]>([]);
	const allNotificationsRef = useRef<Notification[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			setPlayers((prevPlayers) => {
				prevPlayersRef.current = [...prevPlayers];

				const updatedPlayers = prevPlayers.map((player) =>
					updatePlayerStats(player)
				);

				const sortedPlayers = [...updatedPlayers].sort(
					(a, b) => b.score - a.score
				);

				sortedPlayers.forEach((player, index) => {
					player.rank = index + 1;
				});

				if (selectedPlayer) {
					const updatedSelectedPlayer = sortedPlayers.find(
						(p) => p.id === selectedPlayer.id
					);
					if (updatedSelectedPlayer) {
						setSelectedPlayer(updatedSelectedPlayer);
					}
				}

				return sortedPlayers;
			});

			setServerLoad((prev) =>
				Math.max(50, Math.min(98, prev + (Math.random() * 10 - 5)))
			);
			setActivePlayers((prev) =>
				Math.max(
					10000,
					Math.min(25000, prev + Math.floor(Math.random() * 500 - 250))
				)
			);

			if (Math.random() > 0.99) {
				setIsOnline((prev) => !prev);
				if (isOnline) {
					const offlineNotif: Notification = {
						id: `server-offline-${Date.now()}`,
						type: "error",
						title: "Server Connection Lost",
						message: "Attempting to reconnect...",
						timestamp: Date.now(),
						dismissed: false,
					};
					addNotification(offlineNotif);
				} else {
					const onlineNotif: Notification = {
						id: `server-online-${Date.now()}`,
						type: "success",
						title: "Server Connected",
						message: "We're back online!",
						timestamp: Date.now(),
						dismissed: false,
					};
					addNotification(onlineNotif);
				}
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [selectedPlayer, isOnline]);

	const addNotification = (notification: Notification) => {
		setNotifications((prev) => [notification, ...prev]);
		notificationsRef.current = [notification, ...notificationsRef.current];
		allNotificationsRef.current = [
			notification,
			...allNotificationsRef.current,
		];
		setNotificationCount((prev) => prev + 1);

		setDisplayedNotifications((prev) => {
			const newDisplay = [notification, ...prev].slice(0, 3);
			return newDisplay;
		});
	};

	useEffect(() => {
		if (prevPlayersRef.current.length === 0) return;

		const newNotifications: Notification[] = [];

		players.forEach((player) => {
			const prevPlayer = prevPlayersRef.current.find((p) => p.id === player.id);
			if (!prevPlayer) return;

			const notification = generateNotification(player, prevPlayer);
			if (notification) {
				newNotifications.push(notification);
			}
		});

		if (newNotifications.length > 0) {
			newNotifications.forEach((notification) => {
				addNotification(notification);
			});
		}
	}, [players]);

	useEffect(() => {
		if (players.length > 0 && !selectedPlayer) {
			setSelectedPlayer(players[0]);
		}
	}, [players, selectedPlayer]);
	const handleCloseToast = useCallback((id: string) => {
		setDisplayedNotifications((prev) => prev.filter((n) => n.id !== id));
	}, []);

	const handleCloseNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n))
		);

		setDisplayedNotifications((prev) => prev.filter((n) => n.id !== id));

		notificationsRef.current = notificationsRef.current.map((n) =>
			n.id === id ? { ...n, dismissed: true } : n
		);

		setNotificationCount((prev) => Math.max(0, prev - 1));
	}, []);

	const resetNotificationCount = useCallback(() => {
		setNotificationCount(0);
	}, []);

	const clearAllNotifications = useCallback(() => {
		setNotifications((prev) => prev.map((n) => ({ ...n, dismissed: true })));
		setDisplayedNotifications([]);
		notificationsRef.current = notificationsRef.current.map((n) => ({
			...n,
			dismissed: true,
		}));
		setNotificationCount(0);
	}, []);

	const filteredPlayers = players
		.filter((player) =>
			player.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === "rank") return a.rank - b.rank;
			if (sortBy === "score") return b.score - a.score;
			return b.winRate - a.winRate;
		});

	const formatMatchDate = (dateString: string) => {
		const [datePart, timePart] = dateString.split(" ");

		return `${datePart} at ${timePart}`;
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 font-inter antialiased">
			<div className="h-1 w-full bg-gradient-to-r from-slate-800 via-cyan-700/30 to-slate-800"></div>

			<div className="fixed inset-0 bg-noise opacity-5 pointer-events-none"></div>

			<nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
				<div className="container mx-auto px-4 md:px-6">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-3">
							<div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
								<Trophy className="h-5 w-5 md:h-6 md:w-6 text-cyan-400" />
							</div>
							<div className="font-bold text-lg md:text-2xl text-white tracking-tight">
								GameDash
							</div>

							<div
								className={`hidden md:flex items-center ml-4 px-3 py-1 rounded-full ${
									isOnline
										? "bg-green-500/10 text-green-400"
										: "bg-rose-500/10 text-rose-400"
								} text-xs border border-slate-700`}
							>
								<div
									className={`w-2 h-2 rounded-full mr-2 ${
										isOnline ? "bg-green-500 animate-pulse" : "bg-rose-500"
									}`}
								></div>
								{isOnline ? "Online" : "Connection Issues"}
							</div>
						</div>

						{}
						<div className="hidden md:flex items-center space-x-4 text-xs">
							<div className="flex items-center">
								<div className="text-slate-400 mr-2">Load:</div>
								<div
									className={`w-24 h-2 bg-slate-700 rounded-full overflow-hidden`}
								>
									<div
										className={`h-full ${
											serverLoad > 90
												? "bg-rose-500"
												: serverLoad > 75
												? "bg-amber-500"
												: "bg-green-500"
										}`}
										style={{ width: `${serverLoad}%` }}
									></div>
								</div>
								<div className="ml-2 text-slate-300">
									{serverLoad.toFixed(1)}%
								</div>
							</div>
							<div className="flex items-center text-slate-300">
								<Users className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
								{activePlayers.toLocaleString()} players
							</div>

							{}
							<div className="flex items-center space-x-1 md:space-x-4">
								<div className="relative">
									<button
										onClick={() => {
											setIsNotificationsOpen(!isNotificationsOpen);
											if (!isNotificationsOpen) resetNotificationCount();
										}}
										className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors relative"
									>
										<Bell className="h-5 w-5" />
										{notificationCount > 0 && (
											<span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
												{notificationCount > 9 ? "9+" : notificationCount}
											</span>
										)}
									</button>

									{isNotificationsOpen && (
										<div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-slate-900 rounded-lg shadow-xl border border-slate-700 z-50">
											<div className="p-3 border-b border-slate-800 text-sm font-medium flex justify-between items-center">
												<span>Notifications</span>
												<button
													className="text-slate-400 hover:text-white"
													onClick={clearAllNotifications}
												>
													Clear All
												</button>
											</div>
											<div className="space-y-2 p-2">
												{notifications.filter((n) => !n.dismissed).length ===
												0 ? (
													<div className="p-4 text-center text-slate-400 text-sm">
														No new notifications
													</div>
												) : (
													notifications
														.filter((n) => !n.dismissed)
														.map((notification) => (
															<div
																key={notification.id}
																className={`p-3 rounded border-l-2 text-xs ${
																	notification.type === "success"
																		? "border-green-500 bg-green-500/10"
																		: notification.type === "warning"
																		? "border-amber-500 bg-amber-500/10"
																		: notification.type === "error"
																		? "border-rose-500 bg-rose-500/10"
																		: "border-blue-500 bg-blue-500/10"
																}`}
															>
																<div className="flex justify-between items-start">
																	<div className="flex-1">
																		<div className="font-medium text-white">
																			{notification.title}
																		</div>
																		<div className="text-slate-300 mt-1">
																			{notification.message}
																		</div>
																	</div>
																	<button
																		onClick={() =>
																			handleCloseNotification(notification.id)
																		}
																		className="ml-2 text-slate-400 hover:text-white"
																	>
																		<X className="h-3 w-3" />
																	</button>
																</div>
															</div>
														))
												)}
											</div>
										</div>
									)}
								</div>

								<button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
									<User className="h-5 w-5" />
								</button>
							</div>
						</div>

						{}
						<div className="md:hidden flex items-center space-x-2">
							{}
							<div className="relative">
								<button
									onClick={() => {
										setIsNotificationsOpen(!isNotificationsOpen);
										if (!isNotificationsOpen) resetNotificationCount();
									}}
									className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors relative"
								>
									<Bell className="h-5 w-5" />
									{notificationCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
											{notificationCount > 9 ? "9+" : notificationCount}
										</span>
									)}
								</button>

								{isNotificationsOpen && (
									<div className="absolute right-[-30px] mt-2 w-72 max-h-80 overflow-y-auto bg-slate-900 rounded-lg shadow-xl border border-slate-700 z-50">
										<div className="p-3 border-b border-slate-800 text-sm font-medium flex justify-between items-center">
											<span>Notifications</span>
											<button
												className="text-slate-400 hover:text-white"
												onClick={() => {
													clearAllNotifications();
													setIsNotificationsOpen(false);
												}}
											>
												Clear All
											</button>
										</div>
										<div className="space-y-2 p-2">
											{notifications.filter((n) => !n.dismissed).length ===
											0 ? (
												<div className="p-4 text-center text-slate-400 text-sm">
													No new notifications
												</div>
											) : (
												notifications
													.filter((n) => !n.dismissed)
													.slice(0, 5)
													.map((notification) => (
														<div
															key={notification.id}
															className={`p-3 rounded border-l-2 text-xs ${
																notification.type === "success"
																	? "border-green-500 bg-green-500/10"
																	: notification.type === "warning"
																	? "border-amber-500 bg-amber-500/10"
																	: notification.type === "error"
																	? "border-rose-500 bg-rose-500/10"
																	: "border-blue-500 bg-blue-500/10"
															}`}
														>
															<div className="flex justify-between items-start">
																<div className="flex-1">
																	<div className="font-medium text-white text-sm">
																		{notification.title}
																	</div>
																	<div className="text-slate-300 mt-1 text-xs">
																		{notification.message}
																	</div>
																</div>
																<button
																	onClick={() =>
																		handleCloseNotification(notification.id)
																	}
																	className="ml-2 text-slate-400 hover:text-white"
																>
																	<X className="h-3 w-3" />
																</button>
															</div>
														</div>
													))
											)}
										</div>
									</div>
								)}
							</div>

							{}
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
							>
								{isMenuOpen ? (
									<X className="h-5 w-5" />
								) : (
									<Menu className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{}
					{isMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
							className="md:hidden py-3 border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm"
						>
							<div className="flex flex-col space-y-1">
								{}
								<div className="px-4 py-2 mb-2">
									<div className="flex items-center justify-between text-xs">
										<div
											className={`flex items-center px-2 py-1 rounded-full ${
												isOnline
													? "bg-green-500/10 text-green-400"
													: "bg-rose-500/10 text-rose-400"
											} border border-slate-700`}
										>
											<div
												className={`w-2 h-2 rounded-full mr-2 ${
													isOnline
														? "bg-green-500 animate-pulse"
														: "bg-rose-500"
												}`}
											></div>
											{isOnline ? "Online" : "Offline"}
										</div>
										<div className="flex items-center text-slate-300">
											<Users className="h-3 w-3 mr-1 text-cyan-400" />
											{activePlayers.toLocaleString()}
										</div>
									</div>
									<div className="flex items-center mt-2 text-xs">
										<span className="text-slate-400 mr-2">Server Load:</span>
										<div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden mr-2">
											<div
												className={`h-full ${
													serverLoad > 90
														? "bg-rose-500"
														: serverLoad > 75
														? "bg-amber-500"
														: "bg-green-500"
												}`}
												style={{ width: `${serverLoad}%` }}
											></div>
										</div>
										<span className="text-slate-300">
											{serverLoad.toFixed(1)}%
										</span>
									</div>
								</div>

								{}
								<a
									href="#"
									className="px-4 py-3 text-white hover:bg-slate-800 rounded-md flex items-center transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									<Home className="h-4 w-4 mr-3" />
									Dashboard
								</a>
								<a
									href="#"
									className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md flex items-center transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									<Trophy className="h-4 w-4 mr-3" />
									Tournaments
								</a>
								<a
									href="#"
									className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md flex items-center transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									<Users className="h-4 w-4 mr-3" />
									Teams
								</a>
								<a
									href="#"
									className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md flex items-center transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									<BarChart2 className="h-4 w-4 mr-3" />
									Analytics
								</a>
								<a
									href="#"
									className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md flex items-center transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									<Settings className="h-4 w-4 mr-3" />
									Settings
								</a>
								<a
									href="#"
									className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md flex items-center transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									<User className="h-4 w-4 mr-3" />
									Profile
								</a>
								<div className="border-t border-slate-800 mt-2 pt-2">
									<a
										href="#"
										className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md flex items-center transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										<LogOut className="h-4 w-4 mr-3" />
										Logout
									</a>
								</div>
							</div>
						</motion.div>
					)}
				</div>
			</nav>

			<div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
					<div className="lg:col-span-1 h-full flex flex-col">
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4 }}
							className="bg-black rounded-xl shadow-xl overflow-hidden border border-slate-800/50 hover:border-cyan-500/50 transition-all duration-300 flex flex-col h-full relative group"
						>
							<div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-xl pointer-events-none"></div>
							<div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/20 rounded-br-xl pointer-events-none"></div>

							<div className="absolute inset-0 bg-gradient-to-r from-slate-700/0 to-slate-700/0 group-hover:from-cyan-600/10 group-hover:to-cyan-600/5 transition-all duration-300"></div>
							<div className="absolute -inset-1 bg-cyan-500/0 group-hover:bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
							<div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>

							<div className="p-4 md:p-6 bg-slate-800/70 backdrop-blur-sm border-b border-slate-700/50 relative z-10">
								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
											<Users className="h-4 w-4 md:h-5 md:w-5" />
										</div>
										<h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
											Players Leaderboard
										</h2>
									</div>
									<div className="flex items-center space-x-2">
										<div className="relative">
											<select
												value={sortBy}
												onChange={(e) =>
													setSortBy(
														e.target.value as "rank" | "score" | "winRate"
													)
												}
												className="appearance-none bg-slate-800 text-slate-200 text-xs md:text-sm rounded-lg py-1.5 pl-2 pr-7 md:py-2 md:pl-3 md:pr-8 border border-slate-700/70 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-600/30 transition-all duration-200 hover:border-slate-600"
											>
												<option value="rank">Rank</option>
												<option value="score">Score</option>
												<option value="winRate">Win Rate</option>
											</select>
											<div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fillRule="evenodd"
														d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-4 md:mt-5 relative group">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300">
										<Search className="h-4 w-4 md:h-5 md:w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-200" />
									</div>
									<input
										type="text"
										placeholder="Search players..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full bg-slate-800/90 text-slate-200 placeholder-slate-500 border border-slate-700/70 rounded-lg py-2 pl-9 pr-4 md:py-3 md:pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-500/50 transition-all duration-200 hover:border-slate-600 text-sm"
									/>

									<div className="absolute inset-0 rounded-lg pointer-events-none ring-0 group-focus-within:ring-2 ring-cyan-500/20 group-focus-within:ring-opacity-60 transition-all duration-300"></div>
								</div>

								<div className="mt-3 md:mt-4 flex justify-between text-[10px] md:text-xs text-slate-400">
									<span>Showing {filteredPlayers.length} players</span>
									<span className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-cyan-500 mr-1.5 animate-pulse"></div>
										Live Rankings
									</span>
								</div>
							</div>

							<div className="flex-1 overflow-hidden relative max-h-[calc(100vh-16rem)] md:max-h-full">
								<div className="absolute inset-0 overflow-y-auto modern-scrollbar pb-2">
									<AnimatePresence>
										{filteredPlayers.length === 0 ? (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className="flex flex-col items-center justify-center h-56 p-4 text-slate-400"
											>
												<div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-3">
													<Search className="h-6 w-6 md:h-8 md:w-8 text-slate-500" />
												</div>
												<p className="text-center text-sm md:text-base">
													No players found matching your search
												</p>
												<button
													onClick={() => setSearchQuery("")}
													className="mt-3 px-3 py-1.5 text-xs md:text-sm bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-md transition-colors border border-slate-700/50"
												>
													Clear Search
												</button>
											</motion.div>
										) : (
											filteredPlayers.map((player, index) => (
												<motion.div
													key={player.id}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{
														duration: 0.2,
														delay: index * 0.03,
													}}
												>
													<PlayerCard
														player={player}
														isSelected={selectedPlayer?.id === player.id}
														onClick={() => setSelectedPlayer(player)}
													/>

													{index < filteredPlayers.length - 1 && (
														<div className="h-px bg-gradient-to-r from-slate-800/0 via-slate-700/30 to-slate-800/0 mx-4"></div>
													)}
												</motion.div>
											))
										)}
									</AnimatePresence>
								</div>

								<div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-slate-800/90 to-transparent pointer-events-none z-10 opacity-70"></div>
								<div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-slate-800/90 to-transparent pointer-events-none z-10 opacity-70"></div>
							</div>
						</motion.div>
					</div>

					<div className="lg:col-span-2 space-y-4 md:space-y-8">
						{selectedPlayer && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4 }}
								className="bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-800/80 hover:border-slate-700/50 transition-all duration-300 group"
							>
								<div className="p-4 md:p-6 border-b border-slate-800/80 relative overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-br from-slate-800/0 to-slate-800/0 group-hover:from-slate-800/50 group-hover:to-slate-800/20 transition-all duration-300"></div>

									<div className="flex flex-col sm:flex-row justify-between z-10 relative">
										<div className="flex items-center space-x-4">
											<div className="relative">
												<img
													src={selectedPlayer.avatar}
													alt={selectedPlayer.name}
													className="h-10 w-10 md:h-14 md:w-14 rounded-full border border-slate-700/70 group-hover:border-cyan-600/30 transition-all duration-300"
												/>
												{selectedPlayer.rank <= 3 && (
													<div
														className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 p-0.5 md:p-1 rounded-sm ${
															selectedPlayer.rank === 1
																? "bg-amber-500"
																: selectedPlayer.rank === 2
																? "bg-slate-400"
																: "bg-amber-700"
														}`}
													>
														<Trophy className="h-2.5 w-2.5 md:h-3 md:w-3 text-slate-900" />
													</div>
												)}
											</div>
											<div>
												<h2 className="text-xl md:text-2xl font-bold text-white">
													{selectedPlayer.name}
												</h2>
												<div className="flex items-center flex-wrap gap-2 text-slate-400 mt-1">
													<span className="bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded text-xs md:text-sm border border-slate-700/30 group-hover:border-slate-700/50 transition-all duration-200">
														Rank #{selectedPlayer.rank}
													</span>
													<span className="bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded text-xs md:text-sm border border-slate-700/30 group-hover:border-slate-700/50 transition-all duration-200">
														Level {selectedPlayer.level}
													</span>
													<span className="bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded text-xs md:text-sm border border-slate-700/30 group-hover:border-slate-700/50 transition-all duration-200">
														{selectedPlayer.score.toLocaleString(undefined, {
															maximumFractionDigits: 0,
														})}{" "}
														pts
													</span>
												</div>
											</div>
										</div>

										<div className="mt-4 sm:mt-0 flex gap-2 flex-wrap">
											<button
												onClick={() => setStatCategory("overview")}
												className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-150 ${
													statCategory === "overview"
														? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30"
														: "bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/70"
												}`}
											>
												Overview
											</button>
											<button
												onClick={() => setStatCategory("combat")}
												className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-150 ${
													statCategory === "combat"
														? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30"
														: "bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/70"
												}`}
											>
												Combat
											</button>
											<button
												onClick={() => setStatCategory("achievements")}
												className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-150 ${
													statCategory === "achievements"
														? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30"
														: "bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/70"
												}`}
											>
												Achievements
											</button>
										</div>
									</div>
								</div>

								<div className="p-3 md:p-6">
									<AnimatePresence mode="wait">
										{statCategory === "overview" && (
											<motion.div
												key="overview"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.2 }}
											>
												<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
													<div className="bg-slate-800/80 rounded-2xl p-3 md:p-5 flex flex-col relative overflow-hidden group border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
														<div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 to-cyan-600/0 group-hover:from-cyan-600/10 group-hover:to-cyan-600/5 transition-all duration-300"></div>
														<div className="absolute -inset-1 bg-cyan-500/0 group-hover:bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>

														<div className="flex items-center justify-between mb-2 md:mb-3">
															<div className="text-slate-400 text-xs md:text-sm font-medium">
																Wins
															</div>
															<div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-green-500/20 text-green-400">
																<Trophy className="h-4 w-4 md:h-5 md:w-5" />
															</div>
														</div>
														<div className="text-xl md:text-3xl font-bold text-white">
															{selectedPlayer.wins}
														</div>
														<div className="mt-1 md:mt-2 text-[10px] md:text-xs text-slate-400 flex flex-wrap items-center space-x-1">
															<span className="text-green-400 flex items-center">
																<ChevronRight className="h-3 w-3 rotate-90 fill-green-400" />
																+4.5%
															</span>
														</div>
													</div>

													<div className="bg-slate-800/80 rounded-2xl p-3 md:p-5 flex flex-col relative overflow-hidden group border border-slate-700/50 hover:border-rose-500/50 transition-all duration-300">
														<div className="absolute inset-0 bg-gradient-to-r from-rose-600/0 to-rose-600/0 group-hover:from-rose-600/10 group-hover:to-rose-600/5 transition-all duration-300"></div>
														<div className="absolute -inset-1 bg-rose-500/0 group-hover:bg-rose-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>

														<div className="flex items-center justify-between mb-2 md:mb-3">
															<div className="text-slate-400 text-xs md:text-sm font-medium">
																Losses
															</div>
															<div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
																<Activity className="h-4 w-4 md:h-5 md:w-5" />
															</div>
														</div>
														<div className="text-xl md:text-3xl font-bold text-white">
															{selectedPlayer.losses}
														</div>
														<div className="mt-1 md:mt-2 text-[10px] md:text-xs text-slate-400 flex items-center space-x-1">
															<span className="text-rose-400 flex items-center">
																<ChevronRight className="h-3 w-3 rotate-90 fill-rose-400" />
																+1.2%
															</span>
														</div>
													</div>

													<div className="bg-slate-800/80 rounded-2xl p-3 md:p-5 flex flex-col relative overflow-hidden group border border-slate-700/50 hover:border-fuchsia-500/50 transition-all duration-300">
														<div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/0 to-fuchsia-600/0 group-hover:from-fuchsia-600/10 group-hover:to-fuchsia-600/5 transition-all duration-300"></div>
														<div className="absolute -inset-1 bg-fuchsia-500/0 group-hover:bg-fuchsia-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>

														<div className="flex items-center justify-between mb-2 md:mb-3">
															<div className="text-slate-400 text-xs md:text-sm font-medium">
																Win Rate
															</div>
															<div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-400">
																<BarChart2 className="h-4 w-4 md:h-5 md:w-5" />
															</div>
														</div>
														<div className="text-xl md:text-3xl font-bold text-white">
															{selectedPlayer.winRate}%
														</div>
														<div className="mt-1 md:mt-2 text-[10px] md:text-xs text-slate-400 flex items-center space-x-1">
															<span className="text-green-400 flex items-center">
																<ChevronRight className="h-3 w-3 rotate-90 fill-green-400" />
																+2.3%
															</span>
														</div>
													</div>

													<div className="bg-slate-800/80 rounded-2xl p-3 md:p-5 flex flex-col relative overflow-hidden group border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300">
														<div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 to-amber-600/0 group-hover:from-amber-600/10 group-hover:to-amber-600/5 transition-all duration-300"></div>
														<div className="absolute -inset-1 bg-amber-500/0 group-hover:bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>

														<div className="flex items-center justify-between mb-2 md:mb-3">
															<div className="text-slate-400 text-xs md:text-sm font-medium">
																K/D Ratio
															</div>
															<div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
																<Target className="h-4 w-4 md:h-5 md:w-5" />
															</div>
														</div>
														<div className="text-xl md:text-3xl font-bold text-white">
															{selectedPlayer.stats.kdRatio}
														</div>
														<div className="mt-1 md:mt-2 text-[10px] md:text-xs text-slate-400 flex items-center space-x-1">
															<span className="text-green-400 flex items-center">
																<ChevronRight className="h-3 w-3 rotate-90 fill-green-400" />
																+0.3
															</span>
														</div>
													</div>
												</div>

												<ChartCard
													title="Performance Over Time"
													icon={<Activity />}
													iconColor="text-cyan-400"
												>
													<div className="h-64 md:h-80">
														<ResponsiveContainer width="100%" height="100%">
															<LineChart data={selectedPlayer.performanceData}>
																<CartesianGrid
																	strokeDasharray="3 3"
																	stroke="#3f3f46"
																	vertical={false}
																/>
																<XAxis
																	dataKey="month"
																	stroke="#a1a1aa"
																	tick={{ fontSize: 11 }}
																/>
																<YAxis
																	stroke="#a1a1aa"
																	tick={{ fontSize: 11 }}
																/>
																<Tooltip
																	contentStyle={{
																		backgroundColor: "#18181b",
																		borderColor: "#27272a",
																		borderRadius: "0.375rem",
																		boxShadow:
																			"0 10px 15px -3px rgba(0, 0, 0, 0.3)",
																		color: "#f4f4f5",
																	}}
																	cursor={{
																		stroke: "#52525b",
																		strokeWidth: 1,
																		strokeDasharray: "5 5",
																	}}
																/>
																<Legend
																	wrapperStyle={{
																		paddingTop: "20px",
																		fontSize: 12,
																	}}
																/>
																<Line
																	type="monotone"
																	dataKey="kills"
																	stroke="#22d3ee"
																	strokeWidth={2}
																	dot={{ r: 3, strokeWidth: 2 }}
																	activeDot={{ r: 5 }}
																/>
																<Line
																	type="monotone"
																	dataKey="deaths"
																	stroke="#ef4444"
																	strokeWidth={2}
																	dot={{ r: 3, strokeWidth: 2 }}
																	activeDot={{ r: 5 }}
																/>
																<Line
																	type="monotone"
																	dataKey="kdRatio"
																	stroke="#f59e0b"
																	strokeWidth={2}
																	dot={{ r: 3, strokeWidth: 2 }}
																	activeDot={{ r: 5 }}
																/>
															</LineChart>
														</ResponsiveContainer>
													</div>
												</ChartCard>

												<div className="mt-4 md:mt-8">
													<ChartCard
														title="Game Mode Statistics"
														icon={<BarChart2 />}
														iconColor="text-fuchsia-400"
													>
														<div className="h-60 md:h-72">
															<ResponsiveContainer width="100%" height="100%">
																<BarChart data={selectedPlayer.gameModeData}>
																	<defs>
																		<linearGradient
																			id="matchesGradient"
																			x1="0"
																			y1="0"
																			x2="0"
																			y2="1"
																		>
																			<stop
																				offset="5%"
																				stopColor="#0ea5e9"
																				stopOpacity={0.8}
																			/>
																			<stop
																				offset="95%"
																				stopColor="#22d3ee"
																				stopOpacity={0.6}
																			/>
																		</linearGradient>

																		<linearGradient
																			id="winRateGradient"
																			x1="0"
																			y1="0"
																			x2="0"
																			y2="1"
																		>
																			<stop
																				offset="5%"
																				stopColor="#8b5cf6"
																				stopOpacity={0.8}
																			/>
																			<stop
																				offset="95%"
																				stopColor="#c084fc"
																				stopOpacity={0.6}
																			/>
																		</linearGradient>

																		<pattern
																			id="pattern-circles"
																			x="0"
																			y="0"
																			width="10"
																			height="10"
																			patternUnits="userSpaceOnUse"
																			patternContentUnits="userSpaceOnUse"
																		>
																			<circle
																				cx="5"
																				cy="5"
																				r="1"
																				fill="rgba(255, 255, 255, 0.05)"
																			/>
																		</pattern>

																		<linearGradient
																			id="tooltipGradient"
																			x1="0"
																			y1="0"
																			x2="1"
																			y2="1"
																		>
																			<stop
																				offset="0%"
																				stopColor="rgba(15, 23, 42, 0.95)"
																			/>
																			<stop
																				offset="100%"
																				stopColor="rgba(30, 41, 59, 0.95)"
																			/>
																		</linearGradient>
																	</defs>

																	<CartesianGrid
																		strokeDasharray="3 3"
																		stroke="rgba(148, 163, 184, 0.15)"
																		vertical={false}
																	/>
																	<XAxis
																		dataKey="name"
																		stroke="#94a3b8"
																		tick={{ fill: "#cbd5e1", fontSize: 11 }}
																		axisLine={{
																			stroke: "rgba(148, 163, 184, 0.3)",
																		}}
																	/>
																	<YAxis
																		stroke="#94a3b8"
																		tick={{ fill: "#cbd5e1", fontSize: 11 }}
																		axisLine={{
																			stroke: "rgba(148, 163, 184, 0.3)",
																		}}
																	/>
																	<Tooltip
																		contentStyle={{
																			background: "url(#tooltipGradient)",
																			backgroundColor: "transparent",
																			borderColor: "rgba(100, 116, 139, 0.3)",
																			borderRadius: "0.75rem",
																			boxShadow:
																				"0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
																			color: "#f8fafc",
																			padding: "16px",
																			fontWeight: "500",
																			backdropFilter: "blur(12px)",
																			border:
																				"1px solid rgba(148, 163, 184, 0.15)",
																			minWidth: "180px",
																		}}
																		cursor={{
																			fill: "rgba(100, 116, 139, 0.1)",
																		}}
																		formatter={(value, name) => {
																			const color =
																				name === "matches"
																					? "#22d3ee"
																					: "#a855f7";
																			return [
																				<span
																					style={{
																						color: "#f8fafc",
																						fontSize: "1rem",
																						fontWeight: "600",
																						textShadow:
																							"0 1px 2px rgba(0, 0, 0, 0.2)",
																					}}
																				>
																					{value}
																					{name === "winRate" && "%"}
																				</span>,
																				<span
																					style={{
																						display: "flex",
																						alignItems: "center",
																						color: "#cbd5e1",
																						fontSize: "0.875rem",
																						fontWeight: "500",
																					}}
																				>
																					<span
																						style={{
																							display: "inline-block",
																							width: "8px",
																							height: "8px",
																							borderRadius: "50%",
																							backgroundColor: color,
																							marginRight: "6px",
																							boxShadow: `0 0 6px ${color}`,
																						}}
																					></span>
																					{name === "matches"
																						? "Matches Played"
																						: "Win Rate"}
																				</span>,
																			];
																		}}
																		labelFormatter={(label) => {
																			return label + " (Game Mode)";
																		}}
																		wrapperStyle={{
																			outline: "none",
																			filter:
																				"drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))",
																		}}
																	/>
																	<Legend
																		wrapperStyle={{ paddingTop: "20px" }}
																		formatter={(value) => (
																			<span
																				style={{
																					color: "#e2e8f0",
																					fontSize: "0.875rem",
																				}}
																			>
																				{value}
																			</span>
																		)}
																	/>
																	<Bar
																		dataKey="matches"
																		name="matches"
																		fill="url(#matchesGradient)"
																		fillOpacity="0.9"
																		stroke="#0ea5e9"
																		strokeWidth={1}
																		radius={[6, 6, 0, 0]}
																		barSize={20}
																	>
																		<rect
																			x="0"
																			y="0"
																			width="100%"
																			height="100%"
																			fill="url(#pattern-circles)"
																		/>
																	</Bar>
																	<Bar
																		dataKey="winRate"
																		name="winRate"
																		fill="url(#winRateGradient)"
																		fillOpacity="0.9"
																		stroke="#8b5cf6"
																		strokeWidth={1}
																		radius={[6, 6, 0, 0]}
																		barSize={20}
																	>
																		<rect
																			x="0"
																			y="0"
																			width="100%"
																			height="100%"
																			fill="url(#pattern-circles)"
																		/>
																	</Bar>
																</BarChart>
															</ResponsiveContainer>
														</div>
													</ChartCard>
												</div>
											</motion.div>
										)}

										{statCategory === "combat" && (
											<motion.div
												key="combat"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.2 }}
											>
												<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
													<div className="bg-slate-800/80 rounded-2xl p-3 md:p-5 flex flex-col relative overflow-hidden group border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
														<div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 to-cyan-600/0 group-hover:from-cyan-600/10 group-hover:to-cyan-600/5 transition-all duration-300"></div>
														<div className="absolute -inset-1 bg-cyan-500/0 group-hover:bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>

														<div className="flex items-center justify-between mb-2 md:mb-3">
															<div className="text-slate-400 text-xs md:text-sm font-medium">
																Kills
															</div>
															<div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-green-500/20 text-green-400">
																<Target className="h-4 w-4 md:h-5 md:w-5" />
															</div>
														</div>
														<div className="text-xl md:text-3xl font-bold text-white">
															{selectedPlayer.stats.kills.toLocaleString()}
														</div>
														<div className="mt-1 md:mt-2 text-[10px] md:text-xs text-slate-400 flex items-center space-x-1">
															<span className="text-green-400 flex items-center">
																<ChevronRight className="h-3 w-3 rotate-90 fill-green-400" />
																+8.2%
															</span>
														</div>
													</div>

													<div className="bg-slate-800/80 rounded-2xl p-3 md:p-5 flex flex-col relative overflow-hidden group border border-slate-700/50 hover:border-rose-500/50 transition-all duration-300">
														<div className="absolute inset-0 bg-gradient-to-r from-rose-600/0 to-rose-600/0 group-hover:from-rose-600/10 group-hover:to-rose-600/5 transition-all duration-300"></div>
														<div className="absolute -inset-1 bg-rose-500/0 group-hover:bg-rose-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>

														<div className="flex items-center justify-between mb-2 md:mb-3">
															<div className="text-slate-400 text-xs md:text-sm font-medium">
																Deaths
															</div>
															<div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
																<Activity className="h-4 w-4 md:h-5 md:w-5" />
															</div>
														</div>
														<div className="text-xl md:text-3xl font-bold text-white">
															{selectedPlayer.stats.deaths.toLocaleString()}
														</div>
														<div className="mt-1 md:mt-2 text-[10px] md:text-xs text-slate-400 flex items-center space-x-1">
															<span className="text-rose-400 flex items-center">
																<ChevronRight className="h-3 w-3 rotate-90 fill-rose-400" />
																+3.7%
															</span>
														</div>
													</div>

													<div className="bg-slate-800/80 rounded-2xl p-3 md:p-5 flex flex-col relative overflow-hidden group border border-slate-700/50 hover:border-fuchsia-500/50 transition-all duration-300">
														<div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/0 to-fuchsia-600/0 group-hover:from-fuchsia-600/10 group-hover:to-fuchsia-600/5 transition-all duration-300"></div>
														<div className="absolute -inset-1 bg-fuchsia-500/0 group-hover:bg-fuchsia-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>

														<div className="flex items-center justify-between mb-2 md:mb-3">
															<div className="text-slate-400 text-xs md:text-sm font-medium">
																Headshots
															</div>
															<div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-400">
																<Zap className="h-4 w-4 md:h-5 md:w-5" />
															</div>
														</div>
														<div className="text-xl md:text-3xl font-bold text-white">
															{selectedPlayer.stats.headshots.toLocaleString()}
														</div>
														<div className="mt-1 md:mt-2 text-[10px] md:text-xs text-slate-400 flex items-center space-x-1">
															<span className="text-green-400 flex items-center">
																<ChevronRight className="h-3 w-3 rotate-90 fill-green-400" />
																+2.3%
															</span>
														</div>
													</div>

													<div className="bg-slate-800/80 rounded-2xl p-3 md:p-5 flex flex-col relative overflow-hidden group border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300">
														<div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 to-amber-600/0 group-hover:from-amber-600/10 group-hover:to-amber-600/5 transition-all duration-300"></div>
														<div className="absolute -inset-1 bg-amber-500/0 group-hover:bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>

														<div className="flex items-center justify-between mb-2 md:mb-3">
															<div className="text-slate-400 text-xs md:text-sm font-medium">
																Accuracy
															</div>
															<div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
																<PieChart className="h-4 w-4 md:h-5 md:w-5" />
															</div>
														</div>
														<div className="text-xl md:text-3xl font-bold text-white">
															{selectedPlayer.stats.accuracy.toFixed(1)}%
														</div>
														<div className="mt-1 md:mt-2 text-[10px] md:text-xs text-slate-400 flex items-center space-x-1">
															<span className="text-green-400 flex items-center">
																<ChevronRight className="h-3 w-3 rotate-90 fill-green-400" />
																+0.3
															</span>
														</div>
													</div>
												</div>

												<ChartCard
													title="Recent Matches Performance"
													icon={<Flame />}
													iconColor="text-red-500"
												>
													<div className="flex items-center justify-between mb-4">
														<div className="flex items-center space-x-4 text-xs">
															<div className="flex items-center space-x-1.5">
																<div className="w-3 h-3 rounded-sm bg-gradient-to-r from-green-500 to-green-400"></div>
																<span className="text-slate-300">Victory</span>
															</div>
															<div className="flex items-center space-x-1.5">
																<div className="w-3 h-3 rounded-sm bg-red-600"></div>
																<span className="text-slate-300">Defeat</span>
															</div>
														</div>
														<div className="text-xs text-slate-400">
															Score by Match Result
														</div>
													</div>
													<div className="h-60 md:h-72">
														<ResponsiveContainer width="100%" height="100%">
															<BarChart data={selectedPlayer.recentGames}>
																<defs>
																	<linearGradient
																		id="scoreGradient"
																		x1="0"
																		y1="0"
																		x2="0"
																		y2="1"
																	>
																		<stop
																			offset="5%"
																			stopColor="#0ea5e9"
																			stopOpacity={0.8}
																		/>
																		<stop
																			offset="95%"
																			stopColor="#22d3ee"
																			stopOpacity={0.6}
																		/>
																	</linearGradient>

																	<linearGradient
																		id="winGradient"
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
																			stopColor="#34d399"
																			stopOpacity={0.6}
																		/>
																	</linearGradient>

																	<linearGradient
																		id="lossGradient"
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
																			stopColor="#f87171"
																			stopOpacity={0.6}
																		/>
																	</linearGradient>

																	<pattern
																		id="patternScore"
																		x="0"
																		y="0"
																		width="10"
																		height="10"
																		patternUnits="userSpaceOnUse"
																		patternContentUnits="userSpaceOnUse"
																	>
																		<circle
																			cx="5"
																			cy="5"
																			r="1"
																			fill="rgba(255, 255, 255, 0.05)"
																		/>
																	</pattern>

																	<linearGradient
																		id="tooltipGradientCombat"
																		x1="0"
																		y1="0"
																		x2="1"
																		y2="1"
																	>
																		<stop
																			offset="0%"
																			stopColor="rgba(15, 23, 42, 0.95)"
																		/>
																		<stop
																			offset="100%"
																			stopColor="rgba(30, 41, 59, 0.95)"
																		/>
																	</linearGradient>
																</defs>

																<CartesianGrid
																	strokeDasharray="3 3"
																	stroke="rgba(148, 163, 184, 0.15)"
																	vertical={false}
																/>
																<XAxis
																	dataKey="date"
																	stroke="#94a3b8"
																	tick={{ fill: "#cbd5e1", fontSize: 11 }}
																	axisLine={{
																		stroke: "rgba(148, 163, 184, 0.3)",
																	}}
																	tickFormatter={formatMatchDate}
																/>
																<YAxis
																	stroke="#94a3b8"
																	tick={{ fill: "#cbd5e1", fontSize: 11 }}
																	axisLine={{
																		stroke: "rgba(148, 163, 184, 0.3)",
																	}}
																/>
																<Tooltip
																	contentStyle={{
																		background: "url(#tooltipGradientCombat)",
																		backgroundColor: "transparent",
																		borderColor: "rgba(100, 116, 139, 0.3)",
																		borderRadius: "0.75rem",
																		boxShadow:
																			"0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
																		color: "#f8fafc",
																		padding: "16px",
																		fontWeight: "500",
																		backdropFilter: "blur(12px)",
																		border:
																			"1px solid rgba(148, 163, 184, 0.15)",
																		minWidth: "180px",
																	}}
																	cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
																	formatter={(value, name, props) => {
																		const result = props.payload.result;
																		return [
																			<span
																				style={{
																					color: "#f8fafc",
																					fontSize: "1rem",
																					fontWeight: "600",
																					textShadow:
																						"0 1px 2px rgba(0, 0, 0, 0.2)",
																				}}
																			>
																				{value} points
																			</span>,
																			<span
																				style={{
																					display: "flex",
																					alignItems: "center",
																					color: "#cbd5e1",
																					fontSize: "0.875rem",
																					fontWeight: "500",
																				}}
																			>
																				<span
																					style={{
																						display: "inline-block",
																						width: "8px",
																						height: "8px",
																						borderRadius: "50%",
																						backgroundColor:
																							result === "win"
																								? "#10b981"
																								: "#ef4444",
																						marginRight: "6px",
																						boxShadow: `0 0 6px ${
																							result === "win"
																								? "#10b981"
																								: "#ef4444"
																						}`,
																					}}
																				></span>
																				{result === "win"
																					? "Victory"
																					: "Defeat"}{" "}
																				- Score
																			</span>,
																		];
																	}}
																	labelFormatter={(label) =>
																		`Date: ${formatMatchDate(label)}`
																	}
																	wrapperStyle={{
																		outline: "none",
																		filter:
																			"drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))",
																	}}
																/>
																<Legend
																	wrapperStyle={{
																		paddingTop: "20px",
																		fontSize: 12,
																	}}
																	formatter={(value) => (
																		<span
																			style={{
																				color: "#e2e8f0",
																				fontSize: "0.875rem",
																				fontWeight: "500",
																			}}
																		>
																			{value === "result"
																				? "Match Result"
																				: value}
																		</span>
																	)}
																/>
																<Bar
																	dataKey="score"
																	name="Performance"
																	radius={[6, 6, 0, 0]}
																	barSize={40}
																>
																	{selectedPlayer.recentGames.map(
																		(entry, index) => (
																			<Cell
																				key={`cell-${index}`}
																				fill={
																					entry.result === "win"
																						? "url(#winGradient)"
																						: "url(#lossGradient)"
																				}
																				stroke={
																					entry.result === "win"
																						? "#10b981"
																						: "#ef4444"
																				}
																				strokeWidth={1}
																			/>
																		)
																	)}
																</Bar>
															</BarChart>
														</ResponsiveContainer>
													</div>
												</ChartCard>

												<div className="mt-4 md:mt-8">
													<ChartCard
														title="Accuracy Trend"
														icon={<Target />}
														iconColor="text-blue-500"
													>
														<div className="h-60 md:h-72">
															<ResponsiveContainer width="100%" height="100%">
																<LineChart data={selectedPlayer.accuracyData}>
																	<defs>
																		<linearGradient
																			id="accuracyGradient"
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
																				stopColor="#22d3ee"
																				stopOpacity={0.3}
																			/>
																		</linearGradient>

																		<linearGradient
																			id="accuracyAreaGradient"
																			x1="0"
																			y1="0"
																			x2="0"
																			y2="1"
																		>
																			<stop
																				offset="5%"
																				stopColor="#3b82f6"
																				stopOpacity={0.3}
																			/>
																			<stop
																				offset="95%"
																				stopColor="#22d3ee"
																				stopOpacity={0.05}
																			/>
																		</linearGradient>

																		<linearGradient
																			id="tooltipGradientAccuracy"
																			x1="0"
																			y1="0"
																			x2="1"
																			y2="1"
																		>
																			<stop
																				offset="0%"
																				stopColor="rgba(15, 23, 42, 0.95)"
																			/>
																			<stop
																				offset="100%"
																				stopColor="rgba(30, 41, 59, 0.95)"
																			/>
																		</linearGradient>

																		<filter
																			id="glow"
																			x="-50%"
																			y="-50%"
																			width="200%"
																			height="200%"
																		>
																			<feGaussianBlur
																				stdDeviation="2"
																				result="blur"
																			/>
																			<feComposite
																				in="SourceGraphic"
																				in2="blur"
																				operator="over"
																			/>
																		</filter>
																	</defs>

																	<CartesianGrid
																		strokeDasharray="3 3"
																		stroke="rgba(148, 163, 184, 0.15)"
																		vertical={false}
																	/>
																	<XAxis
																		dataKey="week"
																		stroke="#94a3b8"
																		tick={{ fill: "#cbd5e1", fontSize: 11 }}
																		axisLine={{
																			stroke: "rgba(148, 163, 184, 0.3)",
																		}}
																	/>
																	<YAxis
																		domain={[40, 80]}
																		stroke="#94a3b8"
																		tick={{ fill: "#cbd5e1", fontSize: 11 }}
																		axisLine={{
																			stroke: "rgba(148, 163, 184, 0.3)",
																		}}
																	/>
																	<Tooltip
																		contentStyle={{
																			background:
																				"url(#tooltipGradientAccuracy)",
																			backgroundColor: "transparent",
																			borderColor: "rgba(100, 116, 139, 0.3)",
																			borderRadius: "0.75rem",
																			boxShadow:
																				"0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
																			color: "#f8fafc",
																			padding: "16px",
																			fontWeight: "500",
																			backdropFilter: "blur(12px)",
																			border:
																				"1px solid rgba(148, 163, 184, 0.15)",
																			minWidth: "180px",
																		}}
																		cursor={{
																			stroke: "#94a3b8",
																			strokeWidth: 1,
																			strokeDasharray: "5 5",
																		}}
																		formatter={(value) => [
																			<span
																				style={{
																					color: "#f8fafc",
																					fontSize: "1rem",
																					fontWeight: "600",
																					textShadow:
																						"0 1px 2px rgba(0, 0, 0, 0.2)",
																				}}
																			>
																				{value}%
																			</span>,
																			<span
																				style={{
																					display: "flex",
																					alignItems: "center",
																					color: "#cbd5e1",
																					fontSize: "0.875rem",
																					fontWeight: "500",
																				}}
																			>
																				<span
																					style={{
																						display: "inline-block",
																						width: "8px",
																						height: "8px",
																						borderRadius: "50%",
																						backgroundColor: "#3b82f6",
																						marginRight: "6px",
																						boxShadow: "0 0 6px #3b82f6",
																					}}
																				></span>
																				Accuracy
																			</span>,
																		]}
																		labelFormatter={(label) => {
																			return `${label} (Time Period)`;
																		}}
																		wrapperStyle={{
																			outline: "none",
																			filter:
																				"drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))",
																		}}
																	/>
																	<Legend
																		wrapperStyle={{ paddingTop: "20px" }}
																		formatter={(value) => (
																			<span
																				style={{
																					color: "#e2e8f0",
																					fontSize: "0.875rem",
																					fontWeight: "500",
																				}}
																			>
																				{value}
																			</span>
																		)}
																	/>

																	<defs>
																		<clipPath id="clipPath">
																			<rect
																				x="0"
																				y="0"
																				width="100%"
																				height="100%"
																			/>
																		</clipPath>
																	</defs>
																	<g clipPath="url(#clipPath)">
																		<path
																			d={`M0,${80} 
           L0,${50} 
           ${selectedPlayer.accuracyData
							.map(
								(entry, index) =>
									`L${
										index * (100 / (selectedPlayer.accuracyData.length - 1))
									}%,${80 - (entry.accuracy - 40) * (100 / 40)}%`
							)
							.join(" ")}
           L100%,${50} 
           L100%,${80} Z`}
																			fill="url(#accuracyAreaGradient)"
																			stroke="none"
																		/>
																	</g>

																	<Line
																		type="monotone"
																		dataKey="accuracy"
																		name="Accuracy %"
																		stroke="url(#accuracyGradient)"
																		strokeWidth={3}
																		dot={{
																			r: 4,
																			fill: "#3b82f6",
																			strokeWidth: 2,
																			stroke: "#1d4ed8",
																			filter: "url(#glow)",
																		}}
																		activeDot={{
																			r: 6,
																			fill: "#60a5fa",
																			stroke: "#2563eb",
																			strokeWidth: 2,
																		}}
																	/>
																</LineChart>
															</ResponsiveContainer>
														</div>
													</ChartCard>
												</div>
											</motion.div>
										)}

										{statCategory === "achievements" && (
											<motion.div
												key="achievements"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.2 }}
											>
												<ChartCard
													title="Achievement Progress"
													icon={<Trophy />}
													iconColor="text-amber-500"
												>
													<div className="mb-4 md:mb-6 flex justify-between items-center">
														<div></div>
														<div className="flex items-center space-x-2 bg-slate-700/50 py-1 md:py-1.5 px-2 md:px-3 rounded-md border border-slate-600/30">
															<Award className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500" />
															<span className="text-xs md:text-sm font-medium text-slate-200">
																{selectedPlayer.achievements.completed}/
																{selectedPlayer.achievements.total} Completed
															</span>
														</div>
													</div>

													<div className="mb-6 md:mb-10">
														<div className="flex justify-between text-xs md:text-sm mb-2">
															<span className="text-slate-400 font-medium">
																Overall Completion
															</span>
															<span className="text-slate-200 font-semibold">
																{selectedPlayer.achievements.progress}%
															</span>
														</div>
														<div className="h-2 md:h-3 w-full bg-slate-700 rounded-md overflow-hidden">
															<motion.div
																initial={{ width: 0 }}
																animate={{
																	width: `${selectedPlayer.achievements.progress}%`,
																}}
																transition={{ duration: 0.8 }}
																className="h-full rounded-md bg-gradient-to-r from-orange-500 to-orange-400 relative overflow-hidden"
															>
																<div className="absolute inset-0 w-full h-full shimmer-effect"></div>
															</motion.div>
														</div>
													</div>

													<div className="space-y-4 md:space-y-6">
														{selectedPlayer.achievementCategories.map(
															(category, index) => (
																<div key={category.name} className="relative">
																	<div className="flex justify-between items-center mb-2 md:mb-3">
																		<div className="flex items-center space-x-2 md:space-x-3">
																			<div className="h-7 w-7 md:h-9 md:w-9 rounded-md bg-slate-700/70 flex items-center justify-center border border-slate-600/30">
																				<Award className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
																			</div>
																			<span className="font-medium text-white text-sm md:text-base">
																				{category.name}
																			</span>
																		</div>
																		<div className="text-xs md:text-sm bg-slate-700/70 px-2 py-1 rounded-md border border-slate-600/30">
																			<span className="text-amber-500">
																				{category.completed}
																			</span>
																			<span className="text-slate-400">
																				/{category.total}
																			</span>
																		</div>
																	</div>

																	<div className="flex items-center space-x-2 md:space-x-4">
																		<div className="w-full h-1.5 md:h-2 bg-slate-700 rounded-md overflow-hidden">
																			<motion.div
																				initial={{ width: 0 }}
																				animate={{
																					width: `${category.progress}%`,
																				}}
																				transition={{
																					duration: 0.8,
																					delay: 0.1 + index * 0.1,
																				}}
																				className="h-full rounded-md bg-gradient-to-r from-orange-500 to-orange-400 relative overflow-hidden"
																			>
																				<div className="absolute inset-0 w-full h-full shimmer-effect"></div>
																			</motion.div>
																		</div>
																		<div className="text-xs md:text-sm font-bold w-12 md:w-14 text-right text-slate-200">
																			{category.progress}%
																		</div>
																	</div>
																</div>
															)
														)}
													</div>
												</ChartCard>

												<div className="mt-4 md:mt-8">
													<ChartCard
														title="Recent Achievements"
														icon={<Award />}
														iconColor="text-amber-500"
													>
														<div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
															{selectedPlayer.recentAchievements.map(
																(achievement) => (
																	<AchievementCard
																		key={achievement.id}
																		achievement={achievement}
																	/>
																)
															)}
														</div>
													</ChartCard>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</motion.div>
						)}
					</div>
				</div>
			</div>
			<footer className="bg-slate-900 border-t border-slate-800/80 mt-8 py-8">
				<div className="container mx-auto px-4 md:px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
									<Trophy className="h-5 w-5 text-cyan-400" />
								</div>
								<span className="font-bold text-xl text-white tracking-tight">
									GameDash
								</span>
							</div>
							<p className="text-sm text-slate-400 mt-2">
								The ultimate real-time gaming statistics platform. Track your
								performance, compete with friends, and rise through the ranks.
							</p>
							<div className="flex space-x-4 pt-2">
								<a
									href="#"
									className="text-slate-500 hover:text-cyan-400 transition-colors"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-slate-500 hover:text-cyan-400 transition-colors"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</a>
								<a
									href="#"
									className="text-slate-500 hover:text-cyan-400 transition-colors"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-slate-500 hover:text-cyan-400 transition-colors"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-slate-500 hover:text-cyan-400 transition-colors"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
								Quick Links
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Home
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Tournaments
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Leaderboard
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Game Stats
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Premium Features
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
								Resources
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										API Documentation
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Game Guides
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Community Forums
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
									>
										Status Page
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
								Stay Updated
							</h3>
							<p className="text-sm text-slate-400 mb-4">
								Subscribe to our newsletter for the latest updates on features
								and tournaments.
							</p>
							<div className="flex">
								<input
									type="email"
									placeholder="Your email"
									className="w-full px-3 py-2 text-sm bg-slate-800/90 text-slate-200 placeholder-slate-500 border border-slate-700/70 rounded-l-md focus:outline-none focus:ring-1 focus:ring-cyan-600/30 focus:border-cyan-500/50"
								/>
								<button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-r-md transition-colors">
									Subscribe
								</button>
							</div>
						</div>
					</div>

					<div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
						<div className="text-slate-500 text-sm">
							 2025 GameDash. Everything you need to monitor.
						</div>
						<div className="mt-4 md:mt-0 flex space-x-6 text-sm">
							<a
								href="#"
								className="text-slate-400 hover:text-cyan-400 transition-colors"
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-slate-400 hover:text-cyan-400 transition-colors"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-slate-400 hover:text-cyan-400 transition-colors"
							>
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</footer>

			<div className="fixed bottom-4 right-4 z-50 hidden md:flex flex-col items-end">
				<AnimatePresence>
					{displayedNotifications.map((notification) => (
						<Toast
							key={notification.id}
							notification={notification}
							onClose={handleCloseToast}
						/>
					))}
				</AnimatePresence>
			</div>

			<style jsx global>{`
				.modern-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.modern-scrollbar::-webkit-scrollbar-track {
					background: #1e293b;
					border-radius: 3px;
				}

				.modern-scrollbar::-webkit-scrollbar-thumb {
					background: #475569;
					border-radius: 3px;
				}

				.modern-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #64748b;
				}

				.bg-noise {
					background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
				}

				button,
				a {
					cursor: pointer;
				}

				.shimmer-effect {
					background: linear-gradient(
						to right,
						rgba(255, 255, 255, 0) 0%,
						rgba(255, 255, 255, 0.2) 50%,
						rgba(255, 255, 255, 0) 100%
					);
					animation: shimmer 2s infinite;
					background-size: 200% 100%;
				}

				@keyframes shimmer {
					0% {
						background-position: -200% 0;
					}
					100% {
						background-position: 200% 0;
					}
				}

				@media (max-width: 768px) {
					.recharts-text {
						font-size: 10px;
					}

					nav {
						position: relative;
						z-index: 1000;
					}

					.notification-panel-mobile {
						position: fixed;
						top: 64px;
						right: 16px;
						left: 16px;
						max-width: none;
						z-index: 999;
					}
				}

				@media (max-width: 640px) {
					.notification-dropdown {
						position: fixed !important;
						top: 64px !important;
						right: 8px !important;
						left: 8px !important;
						width: auto !important;
						max-width: none !important;
					}
				}

				@font-face {
					font-family: "Inter";
					font-style: normal;
					font-weight: 100 900;
					font-display: swap;
					src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2)
						format("woff2");
				}

				body {
					font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
						sans-serif;
				}

				body.menu-open {
					overflow: hidden;
				}
			`}</style>
		</div>
	);
};

export default GamingDashboard;
