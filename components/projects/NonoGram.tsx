"use client";

import React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
	FaCheck,
	FaUndo,
	FaPuzzlePiece,
	FaBolt,
	FaBullseye,
	FaRocket,
	FaBook,
	FaEye,
	FaEyeSlash,
	FaPlay,
	FaPause,
} from "react-icons/fa";

type CellState = 0 | 1 | 2;
type Grid = CellState[][];
type Clues = { rowClues: number[][]; colClues: number[][] };
type HoveredCell = { row: number; col: number } | null;
type ValidationResult = {
	correct: [number, number][];
	incorrect: [number, number][];
} | null;

const cn = (...classes: (string | undefined | boolean)[]): string => {
	return classes.filter(Boolean).join(" ");
};

const CELL_STATE = {
	EMPTY: 0 as const,
	FILLED: 1 as const,
	MARKED: 2 as const,
};

const RULES_CONTENT = [
	"Each number tells you how many filled squares are in that row or column.",
	"If there's more than one number, there must be at least one empty square between each group.",
	"The order of the numbers matches the order of the filled groups.",
	"Every square must be either filled or left blank.",
];

const HOW_TO_CONTENT = [
	"• Left click: Fill cell | Right click: Mark with X",
	"• Ctrl+Z / Cmd+Z: Undo your last move",
	"• Validate: Check if your current solution is correct",
	"• Show Solution: Reveal the answer (only use if you're stuck!)",
	"• Score decreases over time - solve quickly for higher scores!",
];

const Modal = React.memo(
	({
		open,
		onClose,
		title,
		children,
	}: {
		open: boolean;
		onClose: () => void;
		title: string;
		children: React.ReactNode;
	}) => {
		if (!open) return null;

		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
				<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full relative border border-gray-600/50 backdrop-blur-xl animate-in fade-in duration-300 scale-in-95">
					<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl"></div>
					<button
						onClick={onClose}
						className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none transition-all duration-200 hover:scale-110 hover:rotate-90"
						aria-label="Close"
					>
						×
					</button>
					<h2 className="text-2xl font-bold mb-4 text-cyan-300 text-center drop-shadow-lg relative z-10">
						{title}
					</h2>
					<div className="text-gray-200 text-base space-y-2 relative z-10">
						{children}
					</div>
				</div>
			</div>
		);
	}
);

const useModal = () => {
	const [showRules, setShowRules] = useState(false);
	const [showHowTo, setShowHowTo] = useState(false);

	const openRules = useCallback(() => setShowRules(true), []);
	const closeRules = useCallback(() => setShowRules(false), []);
	const openHowTo = useCallback(() => setShowHowTo(true), []);
	const closeHowTo = useCallback(() => setShowHowTo(false), []);

	return {
		showRules,
		showHowTo,
		openRules,
		closeRules,
		openHowTo,
		closeHowTo,
	};
};

const getDifficultyColor = (size: number): string => {
	if (size <= 7) return "text-emerald-400";
	if (size <= 10) return "text-blue-400";
	if (size <= 12) return "text-purple-400";
	return "text-red-400";
};

const getDensity = (size: number): number => {
	return 0.3 + (size - 5) * 0.02;
};

const createSolutionGrid = (size: number, density = 0.4): Grid => {
	return Array.from({ length: size }, () =>
		Array.from({ length: size }, () =>
			Math.random() < density ? CELL_STATE.FILLED : CELL_STATE.EMPTY
		)
	);
};

const createEmptyGrid = (size: number): Grid =>
	Array.from({ length: size }, () => Array(size).fill(CELL_STATE.EMPTY));

const generateClues = (grid: Grid): Clues => {
	if (!grid || !grid.length || !grid[0]) {
		return { rowClues: [[0]], colClues: [[0]] };
	}

	const size = grid.length;
	const getLineClues = (line: CellState[]): number[] => {
		if (!line || !line.length) return [0];

		const clues: number[] = [];
		let count = 0;
		for (const cell of line) {
			if (cell === CELL_STATE.FILLED) count++;
			else if (count) {
				clues.push(count);
				count = 0;
			}
		}
		if (count) clues.push(count);
		return clues.length ? clues : [0];
	};

	const rowClues = grid.map(getLineClues);
	const colClues = Array.from({ length: size }, (_, colIdx) => {
		const column = grid.map((row) =>
			row && row[colIdx] !== undefined ? row[colIdx] : CELL_STATE.EMPTY
		);
		return getLineClues(column);
	});

	return { rowClues, colClues };
};

const getFilledGroups = (line: CellState[]): number[] => {
	const groups: number[] = [];
	let count = 0;
	for (const cell of line) {
		if (cell === CELL_STATE.FILLED) count++;
		else if (count) {
			groups.push(count);
			count = 0;
		}
	}
	if (count) groups.push(count);
	return groups.length ? groups : [0];
};

const isClueGroupSolved = (
	line: CellState[],
	clue: number[],
	clueIdx: number
): boolean => {
	const groups = getFilledGroups(line);
	for (let i = 0; i <= clueIdx; i++) {
		if (groups[i] !== clue[i]) return false;
	}
	return true;
};

interface LandingPageProps {
	onStartGame: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartGame }) => {
	const modalState = useModal();

	const rulesContent = useMemo(
		() => RULES_CONTENT.map((rule, index) => <div key={index}>{rule}</div>),
		[]
	);

	useEffect(() => {
		const fontLink = document.createElement("link");
		fontLink.href =
			"https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap";
		fontLink.rel = "stylesheet";
		if (!document.querySelector(`link[href*="fonts.googleapis.com"]`)) {
			document.head.appendChild(fontLink);
		}

		const styleElement = document.createElement("style");
		styleElement.textContent = `
			::-webkit-scrollbar {
				width: 8px;
				height: 8px;
			}
			
			::-webkit-scrollbar-track {
				background: rgba(31, 41, 55, 0.3);
				border-radius: 10px;
				backdrop-filter: blur(10px);
			}
			
			::-webkit-scrollbar-thumb {
				background: linear-gradient(135deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.6));
				border-radius: 10px;
				border: 1px solid rgba(75, 85, 99, 0.3);
				transition: all 0.3s ease;
			}
			
			::-webkit-scrollbar-thumb:hover {
				background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(59, 130, 246, 0.8));
				box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
			}
			
			::-webkit-scrollbar-corner {
				background: rgba(31, 41, 55, 0.3);
			}
			
			* {
				scrollbar-width: thin;
				scrollbar-color: rgba(34, 197, 94, 0.6) rgba(31, 41, 55, 0.3);
			}
		`;

		if (!document.querySelector("style[data-custom-scrollbar]")) {
			styleElement.setAttribute("data-custom-scrollbar", "true");
			document.head.appendChild(styleElement);
		}
	}, []);

	return (
		<div
			className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col font-sans overflow-hidden relative"
			style={{
				fontFamily:
					'Outfit, Montserrat, "Ubuntu Sans", Raleway, Roboto, Ubuntu, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
			}}
		>
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/20 rounded-full animate-pulse"></div>
				<div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping"></div>
				<div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400/25 rounded-full animate-bounce"></div>
				<div className="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-400/20 rounded-full animate-pulse"></div>
				<div className="absolute top-2/3 left-1/6 w-1 h-1 bg-pink-400/25 rounded-full animate-ping"></div>
				<div className="absolute top-1/6 right-2/3 w-1.5 h-1.5 bg-amber-400/20 rounded-full animate-bounce"></div>
			</div>

			<Modal
				open={modalState.showRules}
				onClose={modalState.closeRules}
				title="Game Rules"
			>
				{rulesContent}
			</Modal>

			<div className="flex-1 flex items-center justify-center px-6 py-8">
				<div className="max-w-4xl w-full text-center">
					<div className="mb-8">
						<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl animate-pulse">
							NONOGRAM
						</h1>
						<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 drop-shadow-xl">
							GENIUS
						</h2>
						<p className="text-xl md:text-2xl text-gray-300/90 mb-8 max-w-2xl mx-auto leading-relaxed">
							Master the Art of Logic & Pattern Recognition
						</p>
						<p className="text-lg text-gray-400/80 mb-12 max-w-3xl mx-auto">
							Challenge your mind with beautifully crafted nonogram puzzles. Use
							logic and deduction to reveal hidden pictures by filling in the
							correct squares based on numerical clues.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
						<div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/30 hover:scale-105">
							<div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
								<FaPuzzlePiece className="text-2xl text-white" />
							</div>
							<h3 className="text-xl font-bold text-cyan-300 mb-2">
								Multiple Sizes
							</h3>
							<p className="text-gray-400 text-sm">
								From 5×5 beginner puzzles to 15×15 expert challenges
							</p>
						</div>

						<div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-500/30 hover:scale-105">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
								<FaBolt className="text-2xl text-white" />
							</div>
							<h3 className="text-xl font-bold text-purple-300 mb-2">
								Smart Scoring
							</h3>
							<p className="text-gray-400 text-sm">
								Time-based scoring system rewards quick thinking
							</p>
						</div>

						<div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-emerald-500/30 hover:scale-105">
							<div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
								<FaBullseye className="text-2xl text-white" />
							</div>
							<h3 className="text-xl font-bold text-emerald-300 mb-2">
								Progress Tracking
							</h3>
							<p className="text-gray-400 text-sm">
								Visual progress indicators and move tracking
							</p>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-6">
						<button
							onClick={onStartGame}
							className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-emerald-500/40 transform hover:scale-110 relative overflow-hidden group"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
							<FaRocket className="text-xl relative z-10" />
							<span className="relative z-10">Start Playing</span>
						</button>

						<button
							onClick={modalState.openRules}
							className="px-8 py-4 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-cyan-500/30 transform hover:scale-105 border border-cyan-500/30 backdrop-blur-sm"
						>
							<FaBook className="text-lg" />
							<span>Learn Rules</span>
						</button>
					</div>

					<div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
						<div className="flex items-center gap-2">
							<span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
							<span>5×5 to 15×15 Grids</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
							<span>Unlimited Puzzles</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
							<span>Progressive Difficulty</span>
						</div>
					</div>
				</div>
			</div>

			<footer className="py-4 px-6 text-center border-t border-gray-700/30 backdrop-blur-sm">
				<p className="text-gray-400 text-sm">
					<span className="text-cyan-400 font-semibold">NONOGRAM GENIUS</span> —
					Challenge Your Mind, One Puzzle at a Time
				</p>
			</footer>
			<style jsx global>{`
				button,
				a {
					cursor: pointer;
				}
			`}</style>
		</div>
	);
};

const NonogramGame: React.FC = () => {
	const [showLanding, setShowLanding] = useState(true);
	const modalState = useModal();

	const [size, setSize] = useState<number>(10);
	const [validationResult, setValidationResult] =
		useState<ValidationResult>(null);
	const [hoveredCell, setHoveredCell] = useState<HoveredCell>(null);
	const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
	const [gameComplete, setGameComplete] = useState<boolean>(false);
	const [score, setScore] = useState<number>(0);
	const [finalTimedScore, setFinalTimedScore] = useState<number>(0);
	const [moveCount, setMoveCount] = useState<number>(0);
	const [finalTime, setFinalTime] = useState<string>("");
	const [showingSolution, setShowingSolution] = useState<boolean>(false);

	const [isPaused, setIsPaused] = useState<boolean>(false);
	const [totalPausedTime, setTotalPausedTime] = useState<number>(0);
	const [pauseStartTime, setPauseStartTime] = useState<number>(0);
	const [currentTime, setCurrentTime] = useState<number>(Date.now());

	const timeRef = useRef<number>(Date.now());
	const pausedTimeRef = useRef<number>(0);

	const currentDifficultyColor = getDifficultyColor(size);

	const createInitialGameState = useCallback((size: number) => {
		const initialSolution = createSolutionGrid(size, getDensity(size));
		return {
			solution: initialSolution,
			grid: createEmptyGrid(size),
			clues: generateClues(initialSolution),
		};
	}, []);

	const initialGameState = useMemo(
		() => createInitialGameState(10),
		[createInitialGameState]
	);
	const [solution, setSolution] = useState<Grid>(initialGameState.solution);
	const [grid, setGrid] = useState<Grid>(initialGameState.grid);
	const [history, setHistory] = useState<Grid[]>([]);
	const [clues, setClues] = useState<Clues>(initialGameState.clues);

	const rulesContent = useMemo(
		() => RULES_CONTENT.map((rule, index) => <div key={index}>{rule}</div>),
		[]
	);

	const howToContent = useMemo(
		() =>
			HOW_TO_CONTENT.map((instruction, index) => (
				<div key={index}>{instruction}</div>
			)),
		[]
	);

	const handlePause = useCallback(() => {
		if (gameComplete || showingSolution) return;

		if (isPaused) {
			const pauseDuration = Date.now() - pauseStartTime;
			setTotalPausedTime((prev) => prev + pauseDuration);
			setIsPaused(false);
			setPauseStartTime(0);
		} else {
			setIsPaused(true);
			setPauseStartTime(Date.now());
		}
	}, [isPaused, pauseStartTime, gameComplete, showingSolution]);

	const getElapsedTime = useCallback((): string => {
		let actualElapsed;
		if (isPaused) {
			actualElapsed = pauseStartTime - gameStartTime - totalPausedTime;
		} else {
			actualElapsed = currentTime - gameStartTime - totalPausedTime;
		}

		const seconds = Math.max(0, Math.floor(actualElapsed / 1000));
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return mins + ":" + secs.toString().padStart(2, "0");
	}, [currentTime, gameStartTime, totalPausedTime, isPaused, pauseStartTime]);

	const calculateActualElapsedSeconds = useCallback((): number => {
		let actualElapsed;
		if (isPaused) {
			actualElapsed = pauseStartTime - gameStartTime - totalPausedTime;
		} else {
			actualElapsed = currentTime - gameStartTime - totalPausedTime;
		}
		return Math.max(0, Math.floor(actualElapsed / 1000));
	}, [currentTime, gameStartTime, totalPausedTime, isPaused, pauseStartTime]);

	useEffect(() => {
		const fontLink = document.createElement("link");
		fontLink.href =
			"https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap";
		fontLink.rel = "stylesheet";
		if (!document.querySelector(`link[href*="fonts.googleapis.com"]`)) {
			document.head.appendChild(fontLink);
		}

		const styleElement = document.createElement("style");
		styleElement.textContent = `
			::-webkit-scrollbar {
				width: 8px;
				height: 8px;
			}
			
			::-webkit-scrollbar-track {
				background: rgba(31, 41, 55, 0.3);
				border-radius: 10px;
				backdrop-filter: blur(10px);
			}
			
			::-webkit-scrollbar-thumb {
				background: linear-gradient(135deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.6));
				border-radius: 10px;
				border: 1px solid rgba(75, 85, 99, 0.3);
				transition: all 0.3s ease;
			}
			
			::-webkit-scrollbar-thumb:hover {
				background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(59, 130, 246, 0.8));
				box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
			}
			
			::-webkit-scrollbar-corner {
				background: rgba(31, 41, 55, 0.3);
			}
			
			* {
				scrollbar-width: thin;
				scrollbar-color: rgba(34, 197, 94, 0.6) rgba(31, 41, 55, 0.3);
			}
			
			.custom-scrollbar::-webkit-scrollbar {
				width: 6px;
			}
			
			.custom-scrollbar::-webkit-scrollbar-thumb {
				background: linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(236, 72, 153, 0.6));
				border-radius: 6px;
			}
			
			.custom-scrollbar::-webkit-scrollbar-thumb:hover {
				background: linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8));
				box-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
			}
		`;

		if (!document.querySelector("style[data-custom-scrollbar]")) {
			styleElement.setAttribute("data-custom-scrollbar", "true");
			document.head.appendChild(styleElement);
		}
	}, []);

	useEffect(() => {
		try {
			const density = getDensity(size);
			const newSolution = createSolutionGrid(size, density);
			const newGrid = createEmptyGrid(size);
			const newClues = generateClues(newSolution);

			if (
				newSolution.length === size &&
				newGrid.length === size &&
				newClues.rowClues.length === size &&
				newClues.colClues.length === size
			) {
				setSolution(newSolution);
				setGrid(newGrid);
				setClues(newClues);
				setHistory([]);
				setValidationResult(null);
				setGameStartTime(Date.now());
				setGameComplete(false);
				setScore(0);
				setMoveCount(0);
				setShowingSolution(false);
				setIsPaused(false);
				setTotalPausedTime(0);
				setPauseStartTime(0);
			}
		} catch (error) {
			console.error("Error updating game state:", error);
		}
	}, [size]);

	const calculateBaseScore = useCallback(
		(currentGrid: Grid): number => {
			if (
				!currentGrid ||
				!solution ||
				currentGrid.length !== size ||
				solution.length !== size
			) {
				return 0;
			}

			let correctFilledCells = 0;
			let totalFilledCellsInSolution = 0;

			for (let i = 0; i < size; i++) {
				if (
					!currentGrid[i] ||
					!solution[i] ||
					currentGrid[i].length !== size ||
					solution[i].length !== size
				) {
					continue;
				}
				for (let j = 0; j < size; j++) {
					const gridCell = currentGrid[i][j] ?? CELL_STATE.EMPTY;
					const solutionCell = solution[i][j] ?? CELL_STATE.EMPTY;

					if (solutionCell === CELL_STATE.FILLED) {
						totalFilledCellsInSolution++;
						if (gridCell === CELL_STATE.FILLED) {
							correctFilledCells++;
						}
					}
				}
			}

			const basePoints = size * size * 100;
			const accuracy =
				totalFilledCellsInSolution > 0
					? correctFilledCells / totalFilledCellsInSolution
					: 0;
			return Math.floor(basePoints * accuracy);
		},
		[solution, size]
	);

	const calculateTimedScore = useCallback(
		(baseScore: number, timeElapsed: number): number => {
			const fourHoursInSeconds = 4 * 60 * 60;

			if (timeElapsed >= fourHoursInSeconds) {
				return 0;
			}

			const timeMultiplier = Math.max(
				0,
				(fourHoursInSeconds - timeElapsed) / fourHoursInSeconds
			);
			return Math.floor(baseScore * timeMultiplier);
		},
		[]
	);

	const updateCell = useCallback(
		(row: number, col: number, button: number) => {
			if (gameComplete || showingSolution || isPaused) return;

			setValidationResult(null);
			setHistory((prev) => [...prev, grid.map((r) => (r ? [...r] : []))]);
			setGrid((prev) => {
				const newGrid = prev.map((r) => (r ? [...r] : []));

				if (
					!newGrid[row] ||
					!Array.isArray(newGrid[row]) ||
					col >= newGrid[row].length
				) {
					return prev;
				}

				if (button === 0) {
					const currentState = newGrid?.[row]?.[col] ?? CELL_STATE.EMPTY;
					newGrid[row][col] =
						currentState === CELL_STATE.FILLED
							? CELL_STATE.EMPTY
							: CELL_STATE.FILLED;
				} else if (button === 2) {
					const currentState = newGrid?.[row]?.[col] ?? CELL_STATE.EMPTY;
					newGrid[row][col] =
						currentState === CELL_STATE.MARKED
							? CELL_STATE.EMPTY
							: CELL_STATE.MARKED;
				}

				setMoveCount((prev) => prev + 1);

				const newScore = calculateBaseScore(newGrid);
				setScore(newScore);

				return newGrid;
			});
		},
		[grid, gameComplete, calculateBaseScore, showingSolution, isPaused]
	);

	const handleUndo = useCallback(() => {
		if (gameComplete || showingSolution || isPaused) return;

		setValidationResult(null);
		setHistory((prev) => {
			if (prev.length === 0) return prev;
			const prevGrid = prev[prev.length - 1];
			setGrid(prevGrid);
			const newMoveCount = Math.max(0, moveCount - 1);
			setMoveCount(newMoveCount);

			if (newMoveCount > 0) {
				const newScore = calculateBaseScore(prevGrid);
				setScore(newScore);
			} else {
				setScore(0);
			}
			return prev.slice(0, -1);
		});
	}, [gameComplete, calculateBaseScore, moveCount, showingSolution, isPaused]);

	useEffect(() => {
		if (gameComplete && moveCount > 0) {
			const newScore = calculateBaseScore(grid);
			setScore(newScore);
		}
	}, [grid, gameComplete, calculateBaseScore, moveCount]);

	useEffect(() => {
		if (gameComplete || isPaused) return;

		const timer = setInterval(() => {
			setCurrentTime(Date.now());
		}, 1000);

		return () => clearInterval(timer);
	}, [gameComplete, isPaused]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (
				(e.ctrlKey || e.metaKey) &&
				e.key.toLowerCase() === "z" &&
				!e.shiftKey
			) {
				e.preventDefault();
				e.stopPropagation();
				handleUndo();
			}

			if (e.code === "Space" && !gameComplete) {
				e.preventDefault();
				e.stopPropagation();
				handlePause();
			}
		};

		document.addEventListener("keydown", handleKey, true);
		return () => document.removeEventListener("keydown", handleKey, true);
	}, [handleUndo, handlePause, gameComplete]);

	const safeGetColumnClue = useCallback(
		(colIdx: number): number[] => {
			if (!clues?.colClues?.[colIdx]) return [0];
			return clues.colClues[colIdx];
		},
		[clues]
	);

	const safeGetRowClue = useCallback(
		(rowIdx: number): number[] => {
			if (!clues?.rowClues?.[rowIdx]) return [0];
			return clues.rowClues[rowIdx];
		},
		[clues]
	);

	const safeGetGridRow = useCallback(
		(rowIdx: number): CellState[] => {
			if (!grid?.[rowIdx]) return Array(size).fill(CELL_STATE.EMPTY);
			return grid[rowIdx];
		},
		[grid, size]
	);

	const safeGetGridCell = useCallback(
		(rowIdx: number, colIdx: number): CellState => {
			if (showingSolution) {
				return solution?.[rowIdx]?.[colIdx] ?? CELL_STATE.EMPTY;
			}
			if (!grid?.[rowIdx]?.[colIdx] && grid?.[rowIdx]?.[colIdx] !== 0)
				return CELL_STATE.EMPTY;
			return grid?.[rowIdx]?.[colIdx] ?? CELL_STATE.EMPTY;
		},
		[grid, solution, showingSolution]
	);

	const [cellSize, setCellSize] = useState<number>(32);
	useEffect(() => {
		const updateCellSize = () => {
			if (typeof window !== "undefined") {
				const availableWidth = window.innerWidth - 400;
				const availableHeight = window.innerHeight - 200;

				const maxCellWidth = Math.floor((availableWidth - 100) / (size + 3));
				const maxCellHeight = Math.floor((availableHeight - 100) / (size + 3));

				const optimalSize = Math.min(maxCellWidth, maxCellHeight, 40);
				const finalSize = Math.max(optimalSize, 16);

				setCellSize(finalSize);
			}
		};

		updateCellSize();
		window.addEventListener("resize", updateCellSize);
		return () => window.removeEventListener("resize", updateCellSize);
	}, [size]);

	const elementsToRender = Math.min(
		size,
		grid?.length || 0,
		clues?.rowClues?.length || 0
	);
	const maxRowClueCount =
		elementsToRender > 0
			? Math.max(
					...Array.from(
						{ length: elementsToRender },
						(_, rowIdx) => clues?.rowClues?.[rowIdx]?.length || 1
					)
			  )
			: 1;
	const rowClueWidth = Math.max(
		cellSize * 2.5,
		maxRowClueCount * cellSize * 0.9 + 16
	);

	const renderColumnClues = useCallback((): React.ReactElement[] => {
		const elementsToRender = Math.min(size, clues?.colClues?.length || 0);
		if (elementsToRender === 0) return [];

		const maxClueCount = Math.max(
			...Array.from(
				{ length: elementsToRender },
				(_, colIdx) => safeGetColumnClue(colIdx).length
			)
		);

		const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
		const clueContainerStyle = isMobile
			? {
					width: `${cellSize}px`,
					height: `${Math.max(40, maxClueCount * (cellSize * 0.8) + 32)}px`,
					padding: size <= 10 ? "2px" : "1px",
					overflowY: "auto" as const,
					maxHeight: `${cellSize * 6}px`,
			  }
			: {
					width: `${cellSize}px`,
					height: `${Math.max(40, maxClueCount * (cellSize * 0.55) + 10)}px`,
					padding: size <= 10 ? "2px" : "1px",
			  };

		return Array.from({ length: elementsToRender }, (_, colIdx) => {
			const columnClues = safeGetColumnClue(colIdx);
			const tooltipText = `Column ${colIdx + 1}: ${columnClues.join(", ")}`;
			const column = Array.from({ length: size }, (_, rowIdx) =>
				safeGetGridCell(rowIdx, colIdx)
			);

			return (
				<div
					key={`col-clue-${colIdx}`}
					className="flex flex-col justify-end items-center"
					title={tooltipText}
					style={clueContainerStyle}
				>
					{columnClues.map((clue, idx) => {
						const fontSize =
							size <= 7
								? "10px"
								: size <= 10
								? "9px"
								: size <= 12
								? "8px"
								: "7px";
						const lineHeight =
							size <= 7
								? "12px"
								: size <= 10
								? "11px"
								: size <= 12
								? "10px"
								: "9px";
						const padding = size <= 10 ? "px-1 py-0.5" : "px-0.5 py-0.5";
						const solved = isClueGroupSolved(column, columnClues, idx);

						return (
							<div
								key={`col-${colIdx}-clue-${idx}`}
								className={cn(
									`text-xs font-mono mb-1 ${padding} rounded text-center whitespace-nowrap`,
									solved
										? "bg-green-500/30 text-green-300"
										: "bg-blue-500/20 text-blue-300"
								)}
								style={{ fontSize, lineHeight, minWidth: "16px" }}
							>
								{clue}
							</div>
						);
					})}
				</div>
			);
		});
	}, [size, clues, safeGetColumnClue, safeGetGridCell, cellSize]);

	const renderGridRows = useCallback((): React.ReactElement[] => {
		return Array.from({ length: elementsToRender }, (_, rowIdx) => {
			const rowClues = safeGetRowClue(rowIdx);
			const gridRow = safeGetGridRow(rowIdx);
			const tooltipText = `Row ${rowIdx + 1}: ${rowClues.join(", ")}`;

			return (
				<div key={`row-${rowIdx}`} className="flex items-center">
					<div
						className="flex justify-end items-center pr-2 flex-shrink-0 overflow-hidden"
						title={tooltipText}
						style={{
							width: `${rowClueWidth}px`,
							minWidth: `${rowClueWidth}px`,
							maxWidth: `${rowClueWidth}px`,
							height: `${cellSize}px`,
							minHeight: `${cellSize}px`,
							whiteSpace: "nowrap" as const,
							textOverflow: "ellipsis",
							overflow: "hidden",
						}}
					>
						{rowClues.map((clue, idx) => {
							const fontSize =
								size <= 7
									? "10px"
									: size <= 10
									? "9px"
									: size <= 12
									? "8px"
									: "7px";
							const lineHeight =
								size <= 7
									? "12px"
									: size <= 10
									? "11px"
									: size <= 12
									? "10px"
									: "9px";
							const padding = size <= 10 ? "px-1 py-0.5" : "px-0.5 py-0.5";
							const margin = size <= 10 ? "mr-1" : "mr-0.5";
							const solved = isClueGroupSolved(gridRow, rowClues, idx);

							return (
								<div
									key={`row-${rowIdx}-clue-${idx}`}
									className={cn(
										`text-xs font-mono ${margin} ${padding} rounded text-center whitespace-nowrap`,
										solved
											? "bg-green-500/30 text-green-300"
											: "bg-blue-500/20 text-blue-300"
									)}
									style={{ fontSize, lineHeight, minWidth: "14px" }}
								>
									{clue}
								</div>
							);
						})}
					</div>
					<div className="flex">
						{Array.from(
							{ length: Math.min(size, gridRow.length) },
							(_, colIdx) => {
								const cellState = safeGetGridCell(rowIdx, colIdx);
								const isHovered =
									hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
								const isRowHighlighted = hoveredCell?.row === rowIdx;
								const isColHighlighted = hoveredCell?.col === colIdx;

								const isCorrect =
									validationResult?.correct.some(
										([r, c]) => r === rowIdx && c === colIdx
									) || false;
								const isIncorrect =
									validationResult?.incorrect.some(
										([r, c]) => r === rowIdx && c === colIdx
									) || false;

								return (
									<div
										key={`cell-${rowIdx}-${colIdx}`}
										className={cn(
											"w-8 h-8 border border-gray-600 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold",
											cellState === CELL_STATE.FILLED &&
												!showingSolution &&
												!isCorrect &&
												!isIncorrect &&
												"bg-blue-500 text-white",
											cellState === CELL_STATE.MARKED &&
												!showingSolution &&
												"bg-red-500/50 text-red-200",
											cellState === CELL_STATE.EMPTY &&
												!showingSolution &&
												"bg-gray-800 hover:bg-gray-700",
											isCorrect && "bg-green-500 text-white",
											isIncorrect && "bg-red-600 text-white",
											showingSolution &&
												cellState === CELL_STATE.FILLED &&
												"bg-purple-500 text-white",
											isHovered &&
												!showingSolution &&
												!gameComplete &&
												!isPaused &&
												"ring-2 ring-cyan-400",
											!isHovered &&
												!showingSolution &&
												!gameComplete &&
												!isPaused &&
												(isRowHighlighted || isColHighlighted) &&
												cellState === CELL_STATE.EMPTY &&
												"bg-gray-700/50",
											isPaused && "opacity-50 cursor-not-allowed"
										)}
										style={{
											width: `${cellSize}px`,
											height: `${cellSize}px`,
											minWidth: `${cellSize}px`,
											minHeight: `${cellSize}px`,
											fontSize: cellSize <= 18 ? "8px" : "10px",
										}}
										onMouseDown={(e: React.MouseEvent) => {
											e.preventDefault();
											e.stopPropagation();
											if (!showingSolution && !gameComplete && !isPaused) {
												updateCell(rowIdx, colIdx, e.button);
											}
										}}
										onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
										onMouseEnter={() =>
											!showingSolution &&
											!gameComplete &&
											!isPaused &&
											setHoveredCell({ row: rowIdx, col: colIdx })
										}
										onMouseLeave={() =>
											!showingSolution &&
											!gameComplete &&
											!isPaused &&
											setHoveredCell(null)
										}
									>
										{cellState === CELL_STATE.MARKED && !showingSolution
											? "×"
											: ""}
										{isIncorrect && !showingSolution ? "✗" : ""}
									</div>
								);
							}
						)}
					</div>
				</div>
			);
		});
	}, [
		elementsToRender,
		safeGetRowClue,
		safeGetGridRow,
		rowClueWidth,
		cellSize,
		size,
		safeGetGridCell,
		hoveredCell,
		validationResult,
		showingSolution,
		gameComplete,
		isPaused,
		updateCell,
	]);

	const isLineSolved = useCallback(
		(line: CellState[], clue: number[]): boolean => {
			const getClue = (l: CellState[]): number[] => {
				const res: number[] = [];
				let count = 0;
				for (const c of l) {
					if (c === CELL_STATE.FILLED) count++;
					else if (count) {
						res.push(count);
						count = 0;
					}
				}
				if (count) res.push(count);
				return res.length ? res : [0];
			};
			return JSON.stringify(getClue(line)) === JSON.stringify(clue);
		},
		[]
	);

	const hasWon = useCallback((): boolean => {
		if (
			!grid ||
			!solution ||
			grid.length !== size ||
			solution.length !== size
		) {
			return false;
		}

		for (let i = 0; i < size; i++) {
			if (
				!grid[i] ||
				!solution[i] ||
				grid[i].length !== size ||
				solution[i].length !== size
			) {
				return false;
			}
			for (let j = 0; j < size; j++) {
				const gridCell = grid[i][j] ?? CELL_STATE.EMPTY;
				const solutionCell = solution[i][j] ?? CELL_STATE.EMPTY;
				if (
					(gridCell === CELL_STATE.FILLED &&
						solutionCell !== CELL_STATE.FILLED) ||
					(gridCell !== CELL_STATE.FILLED && solutionCell === CELL_STATE.FILLED)
				) {
					return false;
				}
			}
		}
		return true;
	}, [grid, solution, size]);

	useEffect(() => {
		if (hasWon() && !gameComplete) {
			const finalSeconds = calculateActualElapsedSeconds();
			const finalMins = Math.floor(finalSeconds / 60);
			const finalSecs = finalSeconds % 60;
			const finalTimeString =
				finalMins + ":" + finalSecs.toString().padStart(2, "0");
			setFinalTime(finalTimeString);

			const currentBaseScore = calculateBaseScore(grid);
			const timedScore = calculateTimedScore(currentBaseScore, finalSeconds);
			setFinalTimedScore(timedScore);

			setGameComplete(true);
		}
	}, [
		grid,
		gameComplete,
		calculateBaseScore,
		calculateTimedScore,
		hasWon,
		calculateActualElapsedSeconds,
	]);

	const handleValidate = useCallback((): void => {
		if (
			!grid ||
			!solution ||
			grid.length !== size ||
			solution.length !== size ||
			isPaused
		) {
			return;
		}

		const correct: [number, number][] = [];
		const incorrect: [number, number][] = [];

		for (let i = 0; i < size; i++) {
			if (
				!grid[i] ||
				!solution[i] ||
				grid[i].length !== size ||
				solution[i].length !== size
			) {
				continue;
			}
			for (let j = 0; j < size; j++) {
				const solutionCell = solution[i][j] ?? CELL_STATE.EMPTY;
				const gridCell = grid[i][j] ?? CELL_STATE.EMPTY;

				if (gridCell === CELL_STATE.FILLED) {
					if (solutionCell === CELL_STATE.FILLED) {
						correct.push([i, j]);
					} else {
						incorrect.push([i, j]);
					}
				}
			}
		}

		setValidationResult({ correct, incorrect });

		if (incorrect.length > 0 && moveCount > 0) {
			setScore((prev) => Math.max(0, prev - incorrect.length * 10));
		}
	}, [grid, solution, size, moveCount, isPaused]);

	const handleShowSolution = useCallback((): void => {
		if (isPaused) return;
		setShowingSolution(true);
		setValidationResult(null);
	}, [isPaused]);

	const handleHideSolution = useCallback((): void => {
		if (isPaused) return;
		setShowingSolution(false);
	}, [isPaused]);

	const getProgressPercentage = useCallback((): number => {
		if (
			!grid ||
			!solution ||
			grid.length !== size ||
			solution.length !== size
		) {
			return 0;
		}

		let correctCells = 0;
		let totalFilledCells = 0;

		for (let i = 0; i < size; i++) {
			if (
				!grid[i] ||
				!solution[i] ||
				grid[i].length !== size ||
				solution[i].length !== size
			) {
				continue;
			}
			for (let j = 0; j < size; j++) {
				const solutionCell = solution[i][j] ?? CELL_STATE.EMPTY;
				const gridCell = grid[i][j] ?? CELL_STATE.EMPTY;
				if (solutionCell === CELL_STATE.FILLED) {
					totalFilledCells++;
					if (gridCell === CELL_STATE.FILLED) {
						correctCells++;
					}
				}
			}
		}

		return totalFilledCells > 0
			? Math.round((correctCells / totalFilledCells) * 100)
			: 0;
	}, [grid, solution, size]);

	const handleDifficultyChange = useCallback((newSize: number) => {
		try {
			if (newSize >= 5 && newSize <= 15) {
				setSize(newSize);
			}
		} catch (error) {
			console.error("Error changing difficulty:", error);
		}
	}, []);

	const newGame = useCallback(() => {
		try {
			const density = getDensity(size);
			const newSolution = createSolutionGrid(size, density);
			const newGrid = createEmptyGrid(size);
			const newClues = generateClues(newSolution);

			if (
				newSolution.length === size &&
				newGrid.length === size &&
				newClues.rowClues.length === size &&
				newClues.colClues.length === size
			) {
				setSolution(newSolution);
				setGrid(newGrid);
				setClues(newClues);
				setHistory([]);
				setValidationResult(null);
				setGameStartTime(Date.now());
				setGameComplete(false);
				setScore(0);
				setMoveCount(0);
				setFinalTimedScore(0);
				setShowingSolution(false);
				setIsPaused(false);
				setTotalPausedTime(0);
				setPauseStartTime(0);
			}
		} catch (error) {
			console.error("Error creating new game:", error);
		}
	}, [size]);

	const isDataConsistent = useCallback(() => {
		if (!grid || !solution || !clues) return false;
		if (grid.length !== size || solution.length !== size) return false;
		if (!clues.rowClues || !clues.colClues) return false;
		if (clues.rowClues.length !== size || clues.colClues.length !== size)
			return false;

		for (let i = 0; i < size; i++) {
			if (
				!grid[i] ||
				!solution[i] ||
				grid[i].length !== size ||
				solution[i].length !== size
			) {
				return false;
			}
		}

		return true;
	}, [grid, solution, clues, size]);

	const handleStartGame = useCallback(() => {
		setShowLanding(false);

		const density = getDensity(size);
		const newSolution = createSolutionGrid(size, density);
		const newGrid = createEmptyGrid(size);
		const newClues = generateClues(newSolution);

		setSolution(newSolution);
		setGrid(newGrid);
		setClues(newClues);
		setHistory([]);
		setValidationResult(null);
		setGameStartTime(Date.now());
		setGameComplete(false);
		setScore(0);
		setMoveCount(0);
		setFinalTimedScore(0);
		setShowingSolution(false);
		setIsPaused(false);
		setTotalPausedTime(0);
		setPauseStartTime(0);
	}, [size]);

	const handleShowLanding = useCallback(() => setShowLanding(true), []);

	const memoizedColumnClues = useMemo(
		() => renderColumnClues(),
		[renderColumnClues]
	);
	const memoizedGridRows = useMemo(() => renderGridRows(), [renderGridRows]);

	if (showLanding) {
		return <LandingPage onStartGame={handleStartGame} />;
	}

	if (!isDataConsistent()) {
		return (
			<div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col font-sans overflow-hidden relative">
				<div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl animate-pulse">
						<div className="flex flex-col items-center gap-4">
							<div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
							<div className="text-xl font-semibold text-cyan-300 animate-pulse">
								Generating New Puzzle...
							</div>
							<div className="flex gap-2">
								<div
									className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
									style={{ animationDelay: "0ms" }}
								></div>
								<div
									className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
									style={{ animationDelay: "150ms" }}
								></div>
								<div
									className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
									style={{ animationDelay: "300ms" }}
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col font-sans overflow-hidden relative custom-scrollbar"
			style={{
				fontFamily:
					'Outfit, Montserrat, "Ubuntu Sans", Raleway, Roboto, Ubuntu, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
			}}
		>
			{}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/20 rounded-full animate-pulse"></div>
				<div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping"></div>
				<div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400/25 rounded-full animate-bounce"></div>
				<div className="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-400/20 rounded-full animate-pulse"></div>
			</div>

			{}
			{isPaused && !gameComplete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
					<div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl text-center">
						<div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-red-500/10 rounded-2xl animate-pulse"></div>
						<FaPause className="text-6xl text-orange-400 mb-4 mx-auto animate-pulse relative z-10" />
						<h2 className="text-3xl font-bold text-orange-400 mb-4 relative z-10">
							GAME PAUSED
						</h2>
						<p className="text-gray-300 mb-6 text-lg relative z-10">
							Your progress is saved. Click resume or press spacebar to
							continue.
						</p>
						<button
							onClick={handlePause}
							className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto shadow-lg hover:shadow-orange-500/40 transform hover:scale-105 relative z-10"
						>
							<FaPlay className="text-lg" />
							<span>Resume Game</span>
						</button>
						<p className="text-gray-500 text-sm mt-4 relative z-10">
							Press Spacebar to resume
						</p>
					</div>
				</div>
			)}

			{}
			<Modal
				open={modalState.showRules}
				onClose={modalState.closeRules}
				title="Rules"
			>
				{rulesContent}
			</Modal>
			<Modal
				open={modalState.showHowTo}
				onClose={modalState.closeHowTo}
				title="How to Play"
			>
				{howToContent}
			</Modal>

			{}
			{gameComplete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
					<div className="relative z-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in duration-500 scale-in-95">
						<div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-cyan-400/10 rounded-2xl animate-pulse"></div>
						<h2 className="text-3xl font-bold text-emerald-400 mb-4 drop-shadow-lg animate-bounce relative z-10">
							PUZZLE MASTERED!
						</h2>
						<div className="space-y-3 text-gray-200 mb-6 relative z-10">
							<p className="text-lg">
								Base Score:{" "}
								<span className="text-blue-400 font-bold text-xl drop-shadow-lg">
									{score.toLocaleString()}
								</span>{" "}
								points
							</p>
							<p className="text-lg">
								Final Score:{" "}
								<span className="text-amber-400 font-bold text-xl drop-shadow-lg animate-pulse">
									{finalTimedScore.toLocaleString()}
								</span>{" "}
								points
							</p>
							<p className="text-sm text-gray-400">
								Time Multiplier:{" "}
								<span className="text-cyan-400 font-semibold">
									{score > 0
										? `${((finalTimedScore / score) * 100).toFixed(1)}%`
										: "0%"}
								</span>
							</p>
							<p className="text-lg">
								Moves:{" "}
								<span className="text-orange-400 font-bold">{moveCount}</span> |
								Time:{" "}
								<span className="text-cyan-400 font-bold">{finalTime}</span>
							</p>
							<p className="text-sm text-gray-400">{`Grid Size: ${size}x${size}`}</p>
						</div>
						<button
							onClick={newGame}
							className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto shadow-lg hover:shadow-emerald-500/40 mb-3 transform hover:scale-105 relative z-10"
						>
							Start New Game
						</button>
						<button
							onClick={() => {
								setGrid(createEmptyGrid(size));
								setHistory([]);
								setValidationResult(null);
								setGameStartTime(Date.now());
								setGameComplete(false);
								setScore(0);
								setMoveCount(0);
								setFinalTimedScore(0);
								setShowingSolution(false);
								setIsPaused(false);
								setTotalPausedTime(0);
								setPauseStartTime(0);
							}}
							className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-orange-500/40 transform hover:scale-105 relative z-10"
						>
							Retry Puzzle
						</button>
					</div>
				</div>
			)}

			{}
			{showingSolution && !gameComplete && (
				<div className="fixed top-20 left-0 right-0 z-50 flex justify-center">
					<div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl shadow-lg border border-purple-500/50 backdrop-blur-lg animate-pulse">
						<div className="flex items-center gap-3">
							<span className="text-white font-bold">Showing Solution</span>
							<button
								onClick={handleHideSolution}
								className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-all duration-200 flex items-center gap-1"
							>
								<FaEyeSlash className="text-sm" />
								<span>Hide Solution</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{}
			<header className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl sticky top-0 z-40 relative">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
				<div className="py-4 px-6 flex items-center justify-between relative z-10">
					<div className="text-left">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 drop-shadow-lg animate-pulse">
							NONOGRAM GENIUS
						</h1>
						<p className="text-lg text-gray-300/90">
							Master the Art of Logic & Pattern Recognition
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={modalState.openRules}
							className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
						>
							Rules
						</button>
						<button
							onClick={modalState.openHowTo}
							className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
						>
							How to Play
						</button>
						<button
							onClick={handleShowLanding}
							className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-105"
						>
							Home
						</button>
					</div>
				</div>
			</header>

			{}
			<div className="flex flex-1 overflow-hidden">
				{}
				<div className="w-80 bg-gray-900/90 backdrop-blur-xl border-r border-gray-700/50 flex flex-col shadow-2xl custom-scrollbar">
					<div className="p-4 space-y-4 overflow-y-auto flex-1">
						{}
						<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/30">
							<h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
								<span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3 animate-pulse shadow-lg shadow-cyan-400/50" />
								Grid Settings
							</h3>
							<div className="flex items-center gap-4 mb-3">
								<label className="font-medium text-gray-300">Grid Size:</label>
								<span
									className={`text-xl font-bold ${currentDifficultyColor} drop-shadow-lg animate-pulse`}
								>{`${size}×${size}`}</span>
							</div>
							<input
								type="range"
								min="5"
								max="15"
								value={size}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleDifficultyChange(Number(e.target.value))
								}
								disabled={isPaused}
								className="w-full h-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg appearance-none cursor-pointer hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
							/>
							<div className="flex justify-between text-xs text-gray-400 mt-2">
								<span className="hover:text-emerald-400 transition-colors duration-200">
									Beginner
								</span>
								<span className="hover:text-blue-400 transition-colors duration-200">
									Expert
								</span>
								<span className="hover:text-purple-400 transition-colors duration-200">
									Master
								</span>
								<span className="hover:text-red-400 transition-colors duration-200">
									Genius
								</span>
							</div>
						</div>

						{}
						<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-emerald-500/30">
							<h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
								<span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mr-3 animate-pulse shadow-lg shadow-emerald-400/50" />
								Game Controls
							</h3>
							<div className="grid grid-cols-1 gap-3">
								<button
									onClick={newGame}
									className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105"
								>
									New Game
								</button>

								<button
									onClick={handlePause}
									disabled={gameComplete || showingSolution}
									className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed ${
										isPaused
											? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 hover:shadow-orange-500/30"
											: "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 hover:shadow-yellow-500/30"
									}`}
								>
									{isPaused ? (
										<>
											<FaPlay className="text-sm" />
											Resume (Space)
										</>
									) : (
										<>
											<FaPause className="text-sm" />
											Pause (Space)
										</>
									)}
								</button>

								<button
									onClick={handleValidate}
									disabled={showingSolution || isPaused}
									className="px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/30 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
								>
									<FaCheck className="text-sm" />
									Validate
								</button>

								<button
									onClick={
										showingSolution ? handleHideSolution : handleShowSolution
									}
									disabled={isPaused}
									className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed ${
										showingSolution
											? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/30"
											: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/30"
									}`}
								>
									{showingSolution ? (
										<>
											<FaEyeSlash className="text-sm" />
											Hide Solution
										</>
									) : (
										<>
											<FaEye className="text-sm" />
											Show Solution
										</>
									)}
								</button>

								<button
									onClick={handleUndo}
									disabled={history.length === 0 || showingSolution || isPaused}
									className="px-4 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-slate-500/30 transform hover:scale-105 disabled:transform-none"
								>
									<FaUndo className="text-sm" />
									Undo (Ctrl+Z)
								</button>
							</div>
						</div>

						{}
						<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-500/30">
							<h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
								<span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3 animate-pulse shadow-lg shadow-purple-400/50" />
								Game Stats
							</h3>
							<div className="space-y-2">
								<div className="flex justify-between items-center py-1 hover:bg-gray-700/30 rounded-lg px-2 transition-all duration-200">
									<span className="text-gray-400">Time</span>
									<span
										className={`text-lg font-bold drop-shadow-lg ${
											isPaused
												? "text-orange-400 animate-pulse"
												: "text-cyan-400"
										}`}
									>
										{gameComplete ? finalTime : getElapsedTime()}
										{isPaused && " (PAUSED)"}
									</span>
								</div>
								<div className="border-t border-gray-700/50" />
								<div className="flex justify-between items-center py-1 hover:bg-gray-700/30 rounded-lg px-2 transition-all duration-200">
									<span className="text-gray-400">Score</span>
									<span className="text-lg font-bold text-amber-400 drop-shadow-lg">
										{score.toLocaleString()}
									</span>
								</div>
								<div className="border-t border-gray-700/50" />
								<div className="flex justify-between items-center py-1 hover:bg-gray-700/30 rounded-lg px-2 transition-all duration-200">
									<span className="text-gray-400">Moves</span>
									<span className="text-lg font-bold text-orange-400 drop-shadow-lg">
										{moveCount.toLocaleString()}
									</span>
								</div>
								<div className="border-t border-gray-700/50" />
								<div className="flex justify-between items-center py-1 hover:bg-gray-700/30 rounded-lg px-2 transition-all duration-200">
									<span className="text-gray-400">Progress</span>
									<span className="text-lg font-bold text-purple-400 drop-shadow-lg">{`${getProgressPercentage()}%`}</span>
								</div>
							</div>
						</div>

						{}
						<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-500/30">
							<h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
								<span className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 animate-pulse shadow-lg shadow-green-400/50" />
								Current Progress
							</h3>

							{}
							<div className="bg-gray-900/60 rounded-lg p-3 mb-4 border border-gray-600/30">
								<div className="flex flex-col items-center">
									<div
										className="grid gap-0.5"
										style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
									>
										{Array.from({ length: size }, (_, rowIdx) =>
											Array.from({ length: size }, (_, colIdx) => {
												const cellState = safeGetGridCell(rowIdx, colIdx);
												const isCorrect = validationResult?.correct.some(
													([r, c]) => r === rowIdx && c === colIdx
												);
												const isIncorrect = validationResult?.incorrect.some(
													([r, c]) => r === rowIdx && c === colIdx
												);

												return (
													<div
														key={`mini-${rowIdx}-${colIdx}`}
														className={cn(
															"w-3 h-3 border border-gray-600/50 transition-all duration-200",
															cellState === CELL_STATE.FILLED &&
																!showingSolution &&
																!isCorrect &&
																!isIncorrect &&
																"bg-blue-500",
															cellState === CELL_STATE.MARKED &&
																!showingSolution &&
																"bg-red-500/70",
															cellState === CELL_STATE.EMPTY &&
																!showingSolution &&
																!isCorrect &&
																!isIncorrect &&
																"bg-gray-800",
															isCorrect && "bg-green-500",
															isIncorrect && "bg-red-600",
															showingSolution &&
																cellState === CELL_STATE.FILLED &&
																"bg-purple-500",
															isPaused && "opacity-50"
														)}
														style={{
															fontSize: "6px",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
														}}
													>
														{cellState === CELL_STATE.MARKED &&
															!showingSolution && (
																<span className="text-red-200 font-bold leading-none">
																	×
																</span>
															)}
														{isIncorrect && !showingSolution && (
															<span className="text-white font-bold leading-none">
																✗
															</span>
														)}
													</div>
												);
											})
										)}
									</div>
								</div>
							</div>

							{}
							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 bg-gray-800 border border-gray-600/50 rounded-sm"></div>
									<span className="text-gray-300">Empty cell</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 bg-blue-500 border border-gray-600/50 rounded-sm"></div>
									<span className="text-gray-300">Filled cell</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 bg-red-500/70 border border-gray-600/50 rounded-sm flex items-center justify-center">
										<span className="text-red-200 font-bold text-xs leading-none">
											×
										</span>
									</div>
									<span className="text-gray-300">Marked cell</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 bg-green-500 border border-gray-600/50 rounded-sm"></div>
									<span className="text-gray-300">Correct cell</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 bg-red-600 border border-gray-600/50 rounded-sm flex items-center justify-center">
										<span className="text-white font-bold text-xs leading-none">
											✗
										</span>
									</div>
									<span className="text-gray-300">Incorrect cell</span>
								</div>
								{showingSolution && (
									<div className="flex items-center gap-3">
										<div className="w-4 h-4 bg-purple-500 border border-gray-600/50 rounded-sm"></div>
										<span className="text-gray-300">Solution cell</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
					<div
						className={cn(
							"bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 h-full w-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-cyan-500/30",
							isPaused && "opacity-75"
						)}
					>
						<div className="flex flex-col items-center justify-center h-full w-full">
							<div
								className="flex flex-col items-end justify-center"
								style={{
									maxHeight: "calc(100vh - 200px)",
									maxWidth: "calc(100vw - 400px)",
								}}
							>
								{}
								<div className="flex mb-2">
									<div style={{ width: `${rowClueWidth}px` }} />
									<div className="flex">{memoizedColumnClues}</div>
								</div>

								{}
								<div className="flex flex-col">{memoizedGridRows}</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{}
			<footer className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 shadow-2xl sticky bottom-0 z-40 relative">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
				<div className="py-4 px-6 flex justify-center items-center relative z-10">
					<span className="text-lg font-bold text-cyan-400 mr-2 drop-shadow-lg animate-pulse">
						NONOGRAM GENIUS
					</span>
					<span className="text-gray-300/90 text-base">
						— A logic puzzle game to master your pattern recognition skills.
					</span>
				</div>
			</footer>
			<style jsx global>{`
				button,
				a {
					cursor: pointer;
				}
			`}</style>
		</div>
	);
};

export default NonogramGame;
