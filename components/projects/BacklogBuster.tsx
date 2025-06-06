"use client";
// This is a complete, self-contained Next.js + TypeScript page component for the Backlog Buster application.
// It includes all original features plus a new Statistics Dashboard with visual charts for completion rates and gaming habits.
// Uses Chart.js via CDN for charts. All code is self-contained.
// Note: In a real Next.js project, ensure @dnd-kit and Tailwind CSS are installed and configured.

import { useState, useMemo, useEffect, useRef } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Define TypeScript interfaces for type safety
interface Game {
	id: string;
	title: string;
	tags: string[];
	status: string; // e.g., 'wantToPlay', 'currentlyPlaying', 'completed'
	playTime?: number; // Accumulated play time in minutes
}

interface ScheduledSession {
	gameId: string;
	day: string; // e.g., 'Monday'
}

interface ColumnProps {
	id: string;
	title: string;
	games: Game[];
	onAddTag: (gameId: string, tag: string) => void;
	onStartTimer: (game: Game) => void;
}

interface GameCardProps {
	game: Game;
	onAddTag: (gameId: string, tag: string) => void;
	onStartTimer: (game: Game) => void;
}

interface GanttChartProps {
	scheduledSessions: ScheduledSession[];
	games: Game[];
	onRemoveSession: (gameId: string, day: string) => void;
}

interface PomodoroTimerProps {
	game: Game;
	onClose: () => void;
	onUpdatePlayTime: (gameId: string, additionalTime: number) => void;
}

interface StatisticsDashboardProps {
	games: Game[];
}

// Simple theme map for game-specific customization
const getGameTheme = (game: Game) => {
	if (game.tags.includes("sandbox"))
		return {
			bgColor: "bg-green-100",
			textColor: "text-green-800",
			buttonColor: "bg-green-500",
		};
	if (game.tags.includes("adventure"))
		return {
			bgColor: "bg-blue-100",
			textColor: "text-blue-800",
			buttonColor: "bg-blue-500",
		};
	return {
		bgColor: "bg-gray-100",
		textColor: "text-gray-800",
		buttonColor: "bg-gray-500",
	}; // Default
};

// Sample initial data
const initialGames: Game[] = [
	{
		id: "1",
		title: "The Legend of Zelda",
		tags: ["adventure"],
		status: "wantToPlay",
		playTime: 0,
	},
	{
		id: "2",
		title: "Super Mario Bros",
		tags: ["platformer", "short games"],
		status: "wantToPlay",
		playTime: 0,
	},
	{
		id: "3",
		title: "Among Us",
		tags: ["co-op"],
		status: "currentlyPlaying",
		playTime: 0,
	},
	{
		id: "4",
		title: "Minecraft",
		tags: ["sandbox"],
		status: "completed",
		playTime: 0,
	},
];

// Predefined statuses and days
const statuses = [
	{ id: "wantToPlay", title: "Want to Play" },
	{ id: "currentlyPlaying", title: "Currently Playing" },
	{ id: "completed", title: "Completed" },
];

const daysOfWeek = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

// Main Next.js page component
export default function BacklogBusterExport() {
	const [games, setGames] = useState<Game[]>(initialGames);
	const [scheduledSessions, setScheduledSessions] = useState<
		ScheduledSession[]
	>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGameForTimer, setSelectedGameForTimer] = useState<Game | null>(
		null
	);
	const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);

	// Sensors for drag-and-drop
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	// Filtered games and grouping
	const filteredGames = useMemo(() => {
		const lowerQuery = searchQuery.toLowerCase();
		return games.filter(
			(game) =>
				game.title.toLowerCase().includes(lowerQuery) ||
				game.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
		);
	}, [games, searchQuery]);

	const gamesByStatus = useMemo(() => {
		return statuses.reduce((acc, status) => {
			acc[status.id] = filteredGames.filter(
				(game) => game.status === status.id
			);
			return acc;
		}, {} as Record<string, Game[]>);
	}, [filteredGames]);

	// Handle drag end
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;
		const activeGame = games.find((g) => g.id === active.id);
		if (!activeGame) return;
		const sourceColumn = activeGame.status;
		const overId = over.id as string;
		if (overId.startsWith("timeline-")) {
			const day = overId.replace("timeline-", "");
			if (
				!scheduledSessions.some((s) => s.gameId === active.id && s.day === day)
			) {
				setScheduledSessions((prev) => [...prev, { gameId: active.id, day }]);
			}
			return;
		}
		const destColumn = over.data.current?.columnId || sourceColumn;
		setGames((prevGames) => {
			if (sourceColumn === destColumn && overId !== active.id) {
				const columnGames = prevGames.filter((g) => g.status === sourceColumn);
				const oldIndex = columnGames.findIndex((g) => g.id === active.id);
				const newIndex = columnGames.findIndex((g) => g.id === overId);
				if (oldIndex === newIndex) return prevGames;
				const newColumnGames = arrayMove(columnGames, oldIndex, newIndex);
				return prevGames.map((g) =>
					g.status === sourceColumn ? newColumnGames.shift()! : g
				);
			} else if (sourceColumn !== destColumn) {
				return prevGames.map((g) =>
					g.id === active.id ? { ...g, status: destColumn } : g
				);
			}
			return prevGames;
		});
	};

	// Handle adding tags
	const handleAddTag = (gameId: string, tag: string) => {
		if (!tag.trim()) return;
		setGames((prevGames) =>
			prevGames.map((g) =>
				g.id === gameId ? { ...g, tags: [...new Set([...g.tags, tag])] } : g
			)
		);
	};

	// Handle removing scheduled sessions
	const handleRemoveSession = (gameId: string, day: string) => {
		setScheduledSessions((prev) =>
			prev.filter((s) => !(s.gameId === gameId && s.day === day))
		);
	};

	// Handle starting the timer for a game
	const handleStartTimer = (game: Game) => {
		setSelectedGameForTimer(game);
		setIsTimerModalOpen(true);
	};

	// Handle updating play time after a session
	const handleUpdatePlayTime = (gameId: string, additionalTime: number) => {
		setGames((prevGames) =>
			prevGames.map((g) =>
				g.id === gameId
					? { ...g, playTime: (g.playTime || 0) + additionalTime }
					: g
			)
		);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-4 font-sans">
			<h1 className="text-3xl font-bold text-center mb-6">Backlog Buster</h1>
			<input
				type="text"
				placeholder="Search by game title or tag..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					{statuses.map((status) => (
						<Column
							key={status.id}
							id={status.id}
							title={status.title}
							games={gamesByStatus[status.id] || []}
							onAddTag={handleAddTag}
							onStartTimer={handleStartTimer}
						/>
					))}
				</div>
				<h2 className="text-2xl font-bold text-center mb-4">
					Weekly Gaming Schedule
				</h2>
				<p className="text-center mb-4 text-gray-600">
					Drag games from above to schedule on the timeline.
				</p>
				<GanttChart
					scheduledSessions={scheduledSessions}
					games={filteredGames}
					onRemoveSession={handleRemoveSession}
				/>
			</DndContext>

			{/* New: Statistics Dashboard Section */}
			<h2 className="text-2xl font-bold text-center my-8">
				Statistics Dashboard
			</h2>
			<StatisticsDashboard games={filteredGames} />

			{/* Timer Modal */}
			{isTimerModalOpen && selectedGameForTimer && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
						<button
							onClick={() => setIsTimerModalOpen(false)}
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
						>
							×
						</button>
						<PomodoroTimer
							game={selectedGameForTimer}
							onClose={() => setIsTimerModalOpen(false)}
							onUpdatePlayTime={handleUpdatePlayTime}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

// Column component
function Column({ id, title, games, onAddTag, onStartTimer }: ColumnProps) {
	return (
		<div className="bg-white p-4 rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">{title}</h2>
			<SortableContext
				items={games.map((g) => g.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="space-y-4 min-h-[200px]">
					{games.map((game) => (
						<GameCard
							key={game.id}
							game={game}
							onAddTag={onAddTag}
							onStartTimer={onStartTimer}
						/>
					))}
				</div>
			</SortableContext>
		</div>
	);
}

// GameCard component
function GameCard({ game, onAddTag, onStartTimer }: GameCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: game.id });
	const style = { transform: CSS.Transform.toString(transform), transition };

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="bg-gray-50 p-4 rounded-lg shadow cursor-grab active:cursor-grabbing touch-none"
		>
			<h3 className="text-lg font-medium">{game.title}</h3>
			<p className="text-sm text-gray-600">
				Play Time: {game.playTime || 0} min
			</p>
			<div className="flex flex-wrap gap-2 mt-2">
				{game.tags.map((tag) => (
					<span
						key={tag}
						className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm"
					>
						{tag}
					</span>
				))}
			</div>
			<div className="mt-2">
				<input
					type="text"
					placeholder="Add tag..."
					onKeyDown={(e) => {
						if (e.key === "Enter") onAddTag(game.id, e.currentTarget.value);
					}}
					className="w-full p-1 border border-gray-300 rounded text-sm mb-2"
				/>
				<button
					onClick={() => onStartTimer(game)}
					className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
				>
					Start Session
				</button>
			</div>
		</div>
	);
}

// GanttChart component
function GanttChart({
	scheduledSessions,
	games,
	onRemoveSession,
}: GanttChartProps) {
	return (
		<div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md mb-8">
			<div className="grid grid-cols-7 gap-2 min-w-[700px]">
				{daysOfWeek.map((day) => (
					<div
						key={day}
						id={`timeline-${day}`}
						className="border border-gray-300 p-2 rounded min-h-[300px] bg-gray-50"
					>
						<h3 className="text-center font-semibold mb-2">{day}</h3>
						<div className="space-y-2">
							{scheduledSessions
								.filter((session) => session.day === day)
								.map((session) => {
									const game = games.find((g) => g.id === session.gameId);
									if (!game) return null;
									return (
										<div
											key={`${session.gameId}-${day}`}
											className="bg-green-200 p-2 rounded flex justify-between items-center text-sm"
										>
											<span>{game.title}</span>
											<button
												onClick={() => onRemoveSession(session.gameId, day)}
												className="text-red-500 hover:text-red-700"
											>
												Remove
											</button>
										</div>
									);
								})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// PomodoroTimer component
function PomodoroTimer({
	game,
	onClose,
	onUpdatePlayTime,
}: PomodoroTimerProps) {
	const [focusTime, setFocusTime] = useState(25);
	const [breakTime, setBreakTime] = useState(5);
	const [timeLeft, setTimeLeft] = useState(focusTime * 60);
	const [isActive, setIsActive] = useState(false);
	const [isBreak, setIsBreak] = useState(false);
	const theme = getGameTheme(game);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (isActive) {
			interval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(interval!);
						const audio = new Audio(
							"https://www.soundjay.com/button/beep-07.mp3"
						);
						audio.play().catch(() => {});
						if (!isBreak) {
							onUpdatePlayTime(game.id, focusTime);
							setIsBreak(true);
							setTimeLeft(breakTime * 60);
						} else {
							setIsBreak(false);
							setTimeLeft(focusTime * 60);
						}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(interval!);
	}, [isActive, isBreak, focusTime, breakTime, game.id, onUpdatePlayTime]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	const handleStartPause = () => setIsActive(!isActive);
	const handleReset = () => {
		setIsActive(false);
		setIsBreak(false);
		setTimeLeft(focusTime * 60);
	};

	return (
		<div className={`p-4 rounded-lg ${theme.bgColor}`}>
			<h2 className={`text-xl font-bold mb-4 ${theme.textColor}`}>
				{game.title} Focus Timer
			</h2>
			<p className={`text-lg font-semibold mb-2 ${theme.textColor}`}>
				{isBreak ? "Break Time" : "Focus Session"}: {formatTime(timeLeft)}
			</p>
			<div className="flex gap-2 mb-4">
				<input
					type="number"
					value={focusTime}
					onChange={(e) => setFocusTime(Math.max(1, Number(e.target.value)))}
					className="w-20 p-1 border rounded"
					placeholder="Focus (min)"
					disabled={isActive}
				/>
				<input
					type="number"
					value={breakTime}
					onChange={(e) => setBreakTime(Math.max(1, Number(e.target.value)))}
					className="w-20 p-1 border rounded"
					placeholder="Break (min)"
					disabled={isActive}
				/>
			</div>
			<div className="flex gap-2">
				<button
					onClick={handleStartPause}
					className={`${theme.buttonColor} text-white py-2 px-4 rounded hover:opacity-90`}
				>
					{isActive ? "Pause" : "Start"}
				</button>
				<button
					onClick={handleReset}
					className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
				>
					Reset
				</button>
				<button
					onClick={onClose}
					className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
				>
					Close
				</button>
			</div>
			<p className={`text-sm mt-4 ${theme.textColor}`}>
				Theme inspired by {game.title}'s style. Complete sessions to track play
				time!
			</p>
		</div>
	);
}

// New: StatisticsDashboard component with visual charts
function StatisticsDashboard({ games }: StatisticsDashboardProps) {
	const pieChartRef = useRef<HTMLCanvasElement>(null);
	const barChartRef = useRef<HTMLCanvasElement>(null);
	const [chartLoaded, setChartLoaded] = useState(false);

	// Load Chart.js via CDN
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/chart.js";
		script.onload = () => setChartLoaded(true);
		document.head.appendChild(script);
		return () => {
			document.head.removeChild(script);
		};
	}, []);

	// Compute statistics
	const stats = useMemo(() => {
		const totalGames = games.length;
		const completedGames = games.filter((g) => g.status === "completed").length;
		const completionRate =
			totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;
		const totalPlayTime = games.reduce((sum, g) => sum + (g.playTime || 0), 0);
		const averagePlayTime =
			totalGames > 0 ? Math.round(totalPlayTime / totalGames) : 0;

		// Status distribution for pie chart
		const statusCounts = {
			wantToPlay: games.filter((g) => g.status === "wantToPlay").length,
			currentlyPlaying: games.filter((g) => g.status === "currentlyPlaying")
				.length,
			completed: completedGames,
		};

		// Play time per game for bar chart
		const playTimeData = games.map((g) => ({
			title: g.title,
			playTime: g.playTime || 0,
		}));

		// Tag breakdown
		const tagCounts: Record<string, number> = {};
		games.forEach((g) => {
			g.tags.forEach((tag) => {
				tagCounts[tag] = (tagCounts[tag] || 0) + 1;
			});
		});

		return {
			totalGames,
			completionRate,
			totalPlayTime,
			averagePlayTime,
			statusCounts,
			playTimeData,
			tagCounts,
		};
	}, [games]);

	// Initialize charts when Chart.js is loaded
	useEffect(() => {
		if (!chartLoaded || !pieChartRef.current || !barChartRef.current) return;

		// Pie Chart: Status Distribution
		const pieCtx = pieChartRef.current.getContext("2d");
		if (pieCtx) {
			new (window as any).Chart(pieCtx, {
				type: "pie",
				data: {
					labels: ["Want to Play", "Currently Playing", "Completed"],
					datasets: [
						{
							data: [
								stats.statusCounts.wantToPlay,
								stats.statusCounts.currentlyPlaying,
								stats.statusCounts.completed,
							],
							backgroundColor: ["#FFCE56", "#36A2EB", "#4CAF50"],
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: { position: "bottom" },
						title: { display: true, text: "Game Status Distribution" },
					},
				},
			});
		}

		// Bar Chart: Play Time per Game
		const barCtx = barChartRef.current.getContext("2d");
		if (barCtx) {
			new (window as any).Chart(barCtx, {
				type: "bar",
				data: {
					labels: stats.playTimeData.map((item) => item.title),
					datasets: [
						{
							label: "Play Time (minutes)",
							data: stats.playTimeData.map((item) => item.playTime),
							backgroundColor: "#4CAF50",
						},
					],
				},
				options: {
					responsive: true,
					scales: { y: { beginAtZero: true } },
					plugins: {
						legend: { position: "bottom" },
						title: { display: true, text: "Play Time per Game" },
					},
				},
			});
		}
	}, [chartLoaded, stats]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Key Metrics */}
				<div className="bg-blue-50 p-4 rounded-lg">
					<h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-2xl font-bold">{stats.totalGames}</p>
							<p className="text-sm text-gray-600">Total Games</p>
						</div>
						<div>
							<p className="text-2xl font-bold">{stats.completionRate}%</p>
							<p className="text-sm text-gray-600">Completion Rate</p>
						</div>
						<div>
							<p className="text-2xl font-bold">
								{Math.round(stats.totalPlayTime / 60)}
							</p>
							<p className="text-sm text-gray-600">Total Hours Played</p>
						</div>
						<div>
							<p className="text-2xl font-bold">{stats.averagePlayTime}</p>
							<p className="text-sm text-gray-600">Avg. Minutes per Game</p>
						</div>
					</div>
				</div>

				{/* Pie Chart: Status Distribution */}
				<div className="bg-white p-4 rounded-lg shadow">
					<canvas ref={pieChartRef} height="200"></canvas>
					{!chartLoaded && <p className="text-center">Loading chart...</p>}
				</div>

				{/* Bar Chart: Play Time per Game */}
				<div className="bg-white p-4 rounded-lg shadow md:col-span-2 lg:col-span-1">
					<canvas ref={barChartRef} height="200"></canvas>
					{!chartLoaded && <p className="text-center">Loading chart...</p>}
				</div>
			</div>

			{/* Tag Breakdown */}
			<div className="mt-6">
				<h3 className="text-lg font-semibold mb-2">Game Tags Breakdown</h3>
				<div className="flex flex-wrap gap-2">
					{Object.entries(stats.tagCounts).map(([tag, count]) => (
						<div
							key={tag}
							className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
						>
							{tag}: {count}
						</div>
					))}
					{Object.keys(stats.tagCounts).length === 0 && (
						<p className="text-gray-500">No tags added yet</p>
					)}
				</div>
			</div>
		</div>
	);
}
