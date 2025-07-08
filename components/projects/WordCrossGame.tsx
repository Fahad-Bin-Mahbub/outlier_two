"use client";
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import {
	FaShareAlt,
	FaTrophy,
	FaCalendarAlt,
	FaSync,
	FaClock,
	FaStar,
	FaBars,
	FaTimes,
	FaPlay,
	FaPause,
	FaLightbulb,
	FaChartLine,
	FaFire,
	FaCrown,
	FaMedal,
	FaGem,
	FaRocket,
	FaHeart,
	FaVolumeMute,
	FaVolumeUp,
	FaHome,
	FaCog,
	FaUser,
	FaAward,
	FaMagic,
	FaBolt,
	FaCheckCircle,
	FaTimesCircle,
	FaGithub,
	FaTwitter,
	FaLinkedin,
} from "react-icons/fa";

interface Cell {
	letter: string;
	isLocked: boolean;
	row: number;
	col: number;
	clueNumber?: number;
	isHighlighted?: boolean;
	animationDelay?: number;
	belongsToClue?: number[];
}

interface Clue {
	id: number;
	text: string;
	answer: string;
	direction: "across" | "down";
	startRow: number;
	startCol: number;
	number: number;
	isCompleted?: boolean;
	difficulty: "easy" | "medium" | "hard";
}

interface DailyChallenge {
	id: string;
	date: string;
	grid: Cell[][];
	clues: Clue[];
	targetScore: number;
	theme: string;
	difficulty: "beginner" | "intermediate" | "expert";
}

interface LeaderboardEntry {
	name: string;
	score: number;
	time: number;
	date: string;
	achievements: string[];
	difficulty: string;
	challengeId: string;
}

interface Achievement {
	id: string;
	name: string;
	description: string;
	iconName: string;
	unlocked: boolean;
	progress?: number;
	maxProgress?: number;
}

interface GameStats {
	gamesPlayed: number;
	totalScore: number;
	bestTime: number;
	currentStreak: number;
	longestStreak: number;
	wordsCompleted: number;
	hintsUsed: number;
}

const achievementIcons: Record<string, React.ReactNode> = {
	checkCircle: <FaCheckCircle />,
	bolt: <FaBolt />,
	crown: <FaCrown />,
	fire: <FaFire />,
	magic: <FaMagic />,
	gem: <FaGem />,
};

const WordPuzzleGame: React.FC = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [grid, setGrid] = useState<Cell[][]>([]);
	const [clues, setClues] = useState<Clue[]>([]);
	const [currentChallengeId, setCurrentChallengeId] = useState<string>("");
	const [selectedCell, setSelectedCell] = useState<{
		row: number;
		col: number;
	} | null>(null);
	const [draggedCell, setDraggedCell] = useState<{
		row: number;
		col: number;
	} | null>(null);
	const [score, setScore] = useState(0);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [isComplete, setIsComplete] = useState(false);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [playerName, setPlayerName] = useState("");
	const [showMenu, setShowMenu] = useState(false);
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [hintsRemaining, setHintsRemaining] = useState(3);
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [gameStats, setGameStats] = useState<GameStats>({
		gamesPlayed: 0,
		totalScore: 0,
		bestTime: 0,
		currentStreak: 0,
		longestStreak: 0,
		wordsCompleted: 0,
		hintsUsed: 0,
	});
	const [showStats, setShowStats] = useState(false);
	const [showAchievements, setShowAchievements] = useState(false);
	const [isSoundEnabled, setIsSoundEnabled] = useState(true);
	const [soundsLoaded, setSoundsLoaded] = useState(false);
	const [currentTheme, setCurrentTheme] = useState("classic");
	const [multiplier, setMultiplier] = useState(1);
	const [showHint, setShowHint] = useState<string | null>(null);
	const [lastMove, setLastMove] = useState<{
		from: { row: number; col: number };
		to: { row: number; col: number };
	} | null>(null);
	const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());
	const [confetti, setConfetti] = useState(false);

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const touchStartRef = useRef<{ x: number; y: number } | null>(null);
	const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const successSoundRef = useRef<HTMLAudioElement | null>(null);
	const victorySoundRef = useRef<HTMLAudioElement | null>(null);
	const clickSoundRef = useRef<HTMLAudioElement | null>(null);

	const dailyChallenges: Record<string, DailyChallenge> = {
		"challenge-1": {
			id: "challenge-1",
			date: "2024-12-30",
			targetScore: 1200,
			theme: "Animals & Nature",
			difficulty: "intermediate",
			grid: [
				[
					{
						letter: "C",
						isLocked: true,
						row: 0,
						col: 0,
						clueNumber: 1,
						belongsToClue: [1, 4],
					},
					{ letter: "A", isLocked: false, row: 0, col: 1, belongsToClue: [1] },
					{ letter: "T", isLocked: false, row: 0, col: 2, belongsToClue: [1] },
					{ letter: "", isLocked: true, row: 0, col: 3 },
					{ letter: "", isLocked: true, row: 0, col: 4 },
				],
				[
					{ letter: "O", isLocked: false, row: 1, col: 0, belongsToClue: [4] },
					{ letter: "", isLocked: true, row: 1, col: 1 },
					{ letter: "", isLocked: true, row: 1, col: 2 },
					{ letter: "", isLocked: true, row: 1, col: 3 },
					{ letter: "", isLocked: true, row: 1, col: 4 },
				],
				[
					{ letter: "W", isLocked: false, row: 2, col: 0, belongsToClue: [4] },
					{ letter: "", isLocked: true, row: 2, col: 1 },
					{
						letter: "A",
						isLocked: false,
						row: 2,
						col: 2,
						clueNumber: 2,
						belongsToClue: [2],
					},
					{ letter: "R", isLocked: false, row: 2, col: 3, belongsToClue: [2] },
					{ letter: "T", isLocked: false, row: 2, col: 4, belongsToClue: [2] },
				],
				[
					{ letter: "", isLocked: true, row: 3, col: 0 },
					{
						letter: "D",
						isLocked: true,
						row: 3,
						col: 1,
						clueNumber: 3,
						belongsToClue: [3],
					},
					{ letter: "O", isLocked: false, row: 3, col: 2, belongsToClue: [3] },
					{ letter: "G", isLocked: false, row: 3, col: 3, belongsToClue: [3] },
					{ letter: "", isLocked: true, row: 3, col: 4 },
				],
				[
					{ letter: "", isLocked: true, row: 4, col: 0 },
					{ letter: "", isLocked: true, row: 4, col: 1 },
					{ letter: "", isLocked: true, row: 4, col: 2 },
					{ letter: "", isLocked: true, row: 4, col: 3 },
					{ letter: "", isLocked: true, row: 4, col: 4 },
				],
			],
			clues: [
				{
					id: 1,
					text: "Feline pet",
					answer: "CAT",
					direction: "across",
					startRow: 0,
					startCol: 0,
					number: 1,
					difficulty: "easy",
				},
				{
					id: 2,
					text: "Creative skill",
					answer: "ART",
					direction: "across",
					startRow: 2,
					startCol: 2,
					number: 2,
					difficulty: "easy",
				},
				{
					id: 3,
					text: "Canine companion",
					answer: "DOG",
					direction: "across",
					startRow: 3,
					startCol: 1,
					number: 3,
					difficulty: "easy",
				},
				{
					id: 4,
					text: "Farm animal that moos",
					answer: "COW",
					direction: "down",
					startRow: 0,
					startCol: 0,
					number: 1,
					difficulty: "easy",
				},
			],
		},
		"challenge-2": {
			id: "challenge-2",
			date: "2024-12-31",
			targetScore: 1500,
			theme: "Food & Kitchen",
			difficulty: "intermediate",
			grid: [
				[
					{
						letter: "B",
						isLocked: true,
						row: 0,
						col: 0,
						clueNumber: 1,
						belongsToClue: [1],
					},
					{ letter: "R", isLocked: false, row: 0, col: 1, belongsToClue: [1] },
					{ letter: "E", isLocked: false, row: 0, col: 2, belongsToClue: [1] },
					{ letter: "A", isLocked: false, row: 0, col: 3, belongsToClue: [1] },
					{ letter: "D", isLocked: false, row: 0, col: 4, belongsToClue: [1] },
				],
				[
					{ letter: "", isLocked: true, row: 1, col: 0 },
					{ letter: "", isLocked: true, row: 1, col: 1 },
					{ letter: "", isLocked: true, row: 1, col: 2 },
					{ letter: "", isLocked: true, row: 1, col: 3 },
					{ letter: "", isLocked: true, row: 1, col: 4 },
				],
				[
					{
						letter: "M",
						isLocked: true,
						row: 2,
						col: 0,
						clueNumber: 2,
						belongsToClue: [2],
					},
					{ letter: "I", isLocked: false, row: 2, col: 1, belongsToClue: [2] },
					{ letter: "L", isLocked: false, row: 2, col: 2, belongsToClue: [2] },
					{ letter: "K", isLocked: false, row: 2, col: 3, belongsToClue: [2] },
					{ letter: "", isLocked: true, row: 2, col: 4 },
				],
				[
					{ letter: "", isLocked: true, row: 3, col: 0 },
					{ letter: "", isLocked: true, row: 3, col: 1 },
					{ letter: "", isLocked: true, row: 3, col: 2 },
					{ letter: "", isLocked: true, row: 3, col: 3 },
					{ letter: "", isLocked: true, row: 3, col: 4 },
				],
				[
					{
						letter: "C",
						isLocked: true,
						row: 4,
						col: 0,
						clueNumber: 3,
						belongsToClue: [3],
					},
					{ letter: "A", isLocked: false, row: 4, col: 1, belongsToClue: [3] },
					{ letter: "K", isLocked: false, row: 4, col: 2, belongsToClue: [3] },
					{ letter: "E", isLocked: false, row: 4, col: 3, belongsToClue: [3] },
					{ letter: "", isLocked: true, row: 4, col: 4 },
				],
			],
			clues: [
				{
					id: 1,
					text: "Baked staple food",
					answer: "BREAD",
					direction: "across",
					startRow: 0,
					startCol: 0,
					number: 1,
					difficulty: "easy",
				},
				{
					id: 2,
					text: "White dairy drink",
					answer: "MILK",
					direction: "across",
					startRow: 2,
					startCol: 0,
					number: 2,
					difficulty: "easy",
				},
				{
					id: 3,
					text: "Sweet baked dessert",
					answer: "CAKE",
					direction: "across",
					startRow: 4,
					startCol: 0,
					number: 3,
					difficulty: "easy",
				},
			],
		},
		"challenge-3": {
			id: "challenge-3",
			date: "2025-01-01",
			targetScore: 1800,
			theme: "Technology",
			difficulty: "expert",
			grid: [
				[
					{
						letter: "C",
						isLocked: true,
						row: 0,
						col: 0,
						clueNumber: 1,
						belongsToClue: [1],
					},
					{ letter: "O", isLocked: false, row: 0, col: 1, belongsToClue: [1] },
					{ letter: "D", isLocked: false, row: 0, col: 2, belongsToClue: [1] },
					{ letter: "E", isLocked: false, row: 0, col: 3, belongsToClue: [1] },
					{ letter: "", isLocked: true, row: 0, col: 4 },
				],
				[
					{ letter: "", isLocked: true, row: 1, col: 0 },
					{ letter: "", isLocked: true, row: 1, col: 1 },
					{ letter: "", isLocked: true, row: 1, col: 2 },
					{ letter: "", isLocked: true, row: 1, col: 3 },
					{ letter: "", isLocked: true, row: 1, col: 4 },
				],
				[
					{
						letter: "W",
						isLocked: true,
						row: 2,
						col: 0,
						clueNumber: 2,
						belongsToClue: [2],
					},
					{ letter: "E", isLocked: false, row: 2, col: 1, belongsToClue: [2] },
					{ letter: "B", isLocked: false, row: 2, col: 2, belongsToClue: [2] },
					{ letter: "", isLocked: true, row: 2, col: 3 },
					{ letter: "", isLocked: true, row: 2, col: 4 },
				],
				[
					{ letter: "", isLocked: true, row: 3, col: 0 },
					{ letter: "", isLocked: true, row: 3, col: 1 },
					{ letter: "", isLocked: true, row: 3, col: 2 },
					{ letter: "", isLocked: true, row: 3, col: 3 },
					{ letter: "", isLocked: true, row: 3, col: 4 },
				],
				[
					{
						letter: "A",
						isLocked: true,
						row: 4,
						col: 0,
						clueNumber: 3,
						belongsToClue: [3],
					},
					{ letter: "P", isLocked: false, row: 4, col: 1, belongsToClue: [3] },
					{ letter: "P", isLocked: false, row: 4, col: 2, belongsToClue: [3] },
					{ letter: "", isLocked: true, row: 4, col: 3 },
					{ letter: "", isLocked: true, row: 4, col: 4 },
				],
			],
			clues: [
				{
					id: 1,
					text: "Programming instructions",
					answer: "CODE",
					direction: "across",
					startRow: 0,
					startCol: 0,
					number: 1,
					difficulty: "medium",
				},
				{
					id: 2,
					text: "Internet platform",
					answer: "WEB",
					direction: "across",
					startRow: 2,
					startCol: 0,
					number: 2,
					difficulty: "medium",
				},
				{
					id: 3,
					text: "Mobile software",
					answer: "APP",
					direction: "across",
					startRow: 4,
					startCol: 0,
					number: 3,
					difficulty: "hard",
				},
			],
		},
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const initializeAudio = () => {
			successSoundRef.current = new Audio();
			victorySoundRef.current = new Audio();
			clickSoundRef.current = new Audio();

			const createBeepSound = (frequency: number, duration: number) => {
				const sampleRate = 8000;
				const samples = duration * sampleRate;
				const buffer = new ArrayBuffer(44 + samples * 2);
				const view = new DataView(buffer);

				const writeString = (offset: number, string: string) => {
					for (let i = 0; i < string.length; i++) {
						view.setUint8(offset + i, string.charCodeAt(i));
					}
				};

				writeString(0, "RIFF");
				view.setUint32(4, 36 + samples * 2, true);
				writeString(8, "WAVE");
				writeString(12, "fmt ");
				view.setUint32(16, 16, true);
				view.setUint16(20, 1, true);
				view.setUint16(22, 1, true);
				view.setUint32(24, sampleRate, true);
				view.setUint32(28, sampleRate * 2, true);
				view.setUint16(32, 2, true);
				view.setUint16(34, 16, true);
				writeString(36, "data");
				view.setUint32(40, samples * 2, true);

				for (let i = 0; i < samples; i++) {
					const sample =
						Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 0x7fff;
					view.setInt16(44 + i * 2, sample, true);
				}

				const blob = new Blob([buffer], { type: "audio/wav" });
				return URL.createObjectURL(blob);
			};

			if (successSoundRef.current) {
				successSoundRef.current.src = createBeepSound(800, 0.2);
				successSoundRef.current.volume = 0.3;
			}
			if (victorySoundRef.current) {
				victorySoundRef.current.src = createBeepSound(1000, 0.5);
				victorySoundRef.current.volume = 0.4;
			}
			if (clickSoundRef.current) {
				clickSoundRef.current.src = createBeepSound(400, 0.1);
				clickSoundRef.current.volume = 0.2;
			}

			setSoundsLoaded(true);
		};

		if (isMounted) {
			const handleFirstInteraction = () => {
				initializeAudio();
				document.removeEventListener("click", handleFirstInteraction);
				document.removeEventListener("touchstart", handleFirstInteraction);
			};

			document.addEventListener("click", handleFirstInteraction);
			document.addEventListener("touchstart", handleFirstInteraction);

			return () => {
				document.removeEventListener("click", handleFirstInteraction);
				document.removeEventListener("touchstart", handleFirstInteraction);
			};
		}
	}, [isMounted]);

	const initializeAchievements = (): Achievement[] => [
		{
			id: "first_win",
			name: "First Victory",
			description: "Complete your first puzzle",
			iconName: "checkCircle",
			unlocked: false,
		},
		{
			id: "speed_demon",
			name: "Speed Demon",
			description: "Complete a puzzle in under 2 minutes",
			iconName: "bolt",
			unlocked: false,
		},
		{
			id: "perfectionist",
			name: "Perfectionist",
			description: "Complete a puzzle without using hints",
			iconName: "crown",
			unlocked: false,
		},
		{
			id: "streak_master",
			name: "Streak Master",
			description: "Win 5 games in a row",
			iconName: "fire",
			unlocked: false,
			progress: 0,
			maxProgress: 5,
		},
		{
			id: "word_wizard",
			name: "Word Wizard",
			description: "Complete 100 words",
			iconName: "magic",
			unlocked: false,
			progress: 0,
			maxProgress: 100,
		},
		{
			id: "high_scorer",
			name: "High Scorer",
			description: "Score over 2000 points",
			iconName: "gem",
			unlocked: false,
		},
	];

	const calculateWordScore = useCallback(
		(
			word: string,
			timeBonus: number = 0,
			difficulty: string = "medium"
		): number => {
			const baseScore = word.length * 15;
			const uniqueLetters = new Set(word.toLowerCase()).size;
			const complexityBonus = uniqueLetters * 8;
			const difficultyMultiplier =
				difficulty === "hard" ? 1.5 : difficulty === "easy" ? 0.8 : 1;
			const streakBonus = multiplier > 1 ? (multiplier - 1) * 20 : 0;

			return Math.round(
				(baseScore + complexityBonus + timeBonus + streakBonus) *
					difficultyMultiplier
			);
		},
		[multiplier]
	);

	useEffect(() => {
		if (!isMounted) return;

		loadGameState();
		const savedAchievements = localStorage.getItem("wordPuzzleAchievements");
		const savedStats = localStorage.getItem("wordPuzzleStats");
		const savedPlayerName = localStorage.getItem("wordPuzzlePlayerName");

		if (savedPlayerName) {
			setPlayerName(savedPlayerName);
		}

		if (savedAchievements) {
			try {
				const parsed = JSON.parse(savedAchievements);

				if (
					parsed.length > 0 &&
					parsed[0].icon &&
					typeof parsed[0].iconName === "undefined"
				) {
					setAchievements(initializeAchievements());
				} else {
					setAchievements(parsed);
				}
			} catch (error) {
				setAchievements(initializeAchievements());
			}
		} else {
			setAchievements(initializeAchievements());
		}

		if (savedStats) {
			try {
				setGameStats(JSON.parse(savedStats));
			} catch (error) {
				console.error("Error loading stats:", error);
			}
		}
	}, [isMounted]);

	useEffect(() => {
		if (isGameStarted && !isPaused && !isComplete) {
			timerRef.current = setInterval(() => {
				setTimeElapsed((prev) => prev + 1);
			}, 1000);
		} else if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [isGameStarted, isPaused, isComplete]);

	const getRandomChallenge = useCallback((): DailyChallenge => {
		if (!isMounted) {
			return dailyChallenges["challenge-1"];
		}

		const challengeIds = Object.keys(dailyChallenges);
		const randomId =
			challengeIds[Math.floor(Math.random() * challengeIds.length)];
		return dailyChallenges[randomId];
	}, [isMounted]);

	const loadGameState = useCallback(() => {
		if (!isMounted) return;

		const savedState = localStorage.getItem("wordPuzzleGameState");
		const savedLeaderboard = localStorage.getItem("wordPuzzleLeaderboard");

		if (savedLeaderboard) {
			try {
				setLeaderboard(JSON.parse(savedLeaderboard));
			} catch (error) {
				console.error("Error loading leaderboard:", error);
			}
		}

		const challenge = getRandomChallenge();
		const scrambledGrid = scrambleNonLockedLetters(challenge.grid);
		setGrid(scrambledGrid);
		setClues(challenge.clues);
		setCurrentChallengeId(challenge.id);
		setHintsRemaining(3);
		setScore(0);
		setTimeElapsed(0);
		setIsComplete(false);
		setIsGameStarted(false);
		setMultiplier(1);
	}, [isMounted, getRandomChallenge]);

	const scrambleNonLockedLetters = (originalGrid: Cell[][]): Cell[][] => {
		const newGrid = originalGrid.map((row) => row.map((cell) => ({ ...cell })));
		const nonLockedLetters: string[] = [];
		const nonLockedPositions: { row: number; col: number }[] = [];

		for (let i = 0; i < newGrid.length; i++) {
			for (let j = 0; j < newGrid[i].length; j++) {
				if (!newGrid[i][j].isLocked && newGrid[i][j].letter !== "") {
					nonLockedLetters.push(newGrid[i][j].letter);
					nonLockedPositions.push({ row: i, col: j });
				}
			}
		}

		for (let i = nonLockedLetters.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[nonLockedLetters[i], nonLockedLetters[j]] = [
				nonLockedLetters[j],
				nonLockedLetters[i],
			];
		}

		nonLockedPositions.forEach((pos, index) => {
			newGrid[pos.row][pos.col].letter = nonLockedLetters[index];
		});

		return newGrid;
	};

	const saveGameState = useCallback(() => {
		if (!isMounted) return;

		try {
			const state = {
				date: new Date().toISOString().split("T")[0],
				grid,
				clues,
				score,
				timeElapsed,
				playerName,
				hintsRemaining,
				isGameStarted,
				currentChallengeId,
			};
			localStorage.setItem("wordPuzzleGameState", JSON.stringify(state));
			localStorage.setItem("wordPuzzleStats", JSON.stringify(gameStats));
			localStorage.setItem(
				"wordPuzzleAchievements",
				JSON.stringify(achievements)
			);
			localStorage.setItem("wordPuzzlePlayerName", playerName);
		} catch (error) {
			console.error("Error saving game state:", error);
		}
	}, [
		isMounted,
		grid,
		clues,
		score,
		timeElapsed,
		playerName,
		hintsRemaining,
		isGameStarted,
		gameStats,
		achievements,
		currentChallengeId,
	]);

	useEffect(() => {
		if (!isMounted) return;

		const saveInterval = setInterval(saveGameState, 3000);
		return () => clearInterval(saveInterval);
	}, [saveGameState, isMounted]);

	const checkCompletion = useCallback(() => {
		let completedCount = 0;
		const updatedClues = clues.map((clue) => {
			const word = getWordFromGrid(clue);
			const isCompleted = word === clue.answer;
			if (isCompleted) completedCount++;
			return { ...clue, isCompleted };
		});

		setClues(updatedClues);
		return completedCount === clues.length;
	}, [clues, grid]);

	const getWordFromGrid = (clue: Clue): string => {
		let word = "";
		let row = clue.startRow;
		let col = clue.startCol;

		for (let i = 0; i < clue.answer.length; i++) {
			if (
				row < grid.length &&
				col < grid[0]?.length &&
				grid[row]?.[col]?.letter !== ""
			) {
				word += grid[row][col].letter;
				if (clue.direction === "across") col++;
				else row++;
			}
		}

		return word;
	};

	const handleCellClick = (row: number, col: number) => {
		if (
			grid[row][col].isLocked ||
			grid[row][col].letter === "" ||
			!isGameStarted
		)
			return;

		playClickSound();

		const cellKey = `${row}-${col}`;
		setAnimatingCells((prev) => new Set([...prev, cellKey]));

		setTimeout(() => {
			setAnimatingCells((prev) => {
				const newSet = new Set(prev);
				newSet.delete(cellKey);
				return newSet;
			});
		}, 300);

		if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
			setSelectedCell(null);
		} else if (selectedCell) {
			swapCells(selectedCell, { row, col });
			setSelectedCell(null);
		} else {
			setSelectedCell({ row, col });
		}
	};

	const swapCells = (
		cell1: { row: number; col: number },
		cell2: { row: number; col: number }
	) => {
		const newGrid = [...grid];
		const temp = newGrid[cell1.row][cell1.col].letter;
		newGrid[cell1.row][cell1.col].letter = newGrid[cell2.row][cell2.col].letter;
		newGrid[cell2.row][cell2.col].letter = temp;
		setGrid(newGrid);
		setLastMove({ from: cell1, to: cell2 });

		const completedWords = clues.filter((clue) => {
			const word = getWordFromGrid(clue);
			return word === clue.answer && !clue.isCompleted;
		});

		if (completedWords.length > 0) {
			const timeBonus = Math.max(0, 200 - timeElapsed);
			const totalWordScore = completedWords.reduce(
				(acc, clue) =>
					acc + calculateWordScore(clue.answer, timeBonus, clue.difficulty),
				0
			);

			setScore((prev) => prev + totalWordScore);
			setMultiplier((prev) => Math.min(prev + completedWords.length, 5));

			setGameStats((prev) => ({
				...prev,
				wordsCompleted: prev.wordsCompleted + completedWords.length,
			}));

			completedWords.forEach((clue) => {
				highlightWord(clue);
			});

			playSuccessSound();
		}

		if (checkCompletion()) {
			handlePuzzleComplete();
		}
	};

	const highlightWord = (clue: Clue) => {
		const cells: { row: number; col: number }[] = [];
		let row = clue.startRow;
		let col = clue.startCol;

		for (let i = 0; i < clue.answer.length; i++) {
			cells.push({ row, col });
			if (clue.direction === "across") col++;
			else row++;
		}

		cells.forEach((cell, index) => {
			setTimeout(() => {
				setGrid((prev) =>
					prev.map((gridRow, r) =>
						gridRow.map((gridCell, c) =>
							r === cell.row && c === cell.col
								? { ...gridCell, isHighlighted: true }
								: gridCell
						)
					)
				);
			}, index * 100);
		});

		setTimeout(() => {
			setGrid((prev) =>
				prev.map((row) =>
					row.map((cell) => ({ ...cell, isHighlighted: false }))
				)
			);
		}, cells.length * 100 + 1000);
	};

	const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
		if (
			grid[row][col].isLocked ||
			grid[row][col].letter === "" ||
			!isGameStarted
		)
			return;

		const touch = e.touches[0];
		touchStartRef.current = { x: touch.clientX, y: touch.clientY };
		setDraggedCell({ row, col });
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		e.preventDefault();
	};

	const handleTouchEnd = (e: React.TouchEvent, row: number, col: number) => {
		if (!draggedCell || !touchStartRef.current) return;

		if (draggedCell.row !== row || draggedCell.col !== col) {
			swapCells(draggedCell, { row, col });
		}

		setDraggedCell(null);
		touchStartRef.current = null;
	};

	const handlePuzzleComplete = () => {
		setIsComplete(true);
		setConfetti(true);

		setTimeout(() => setConfetti(false), 3000);

		const newStats = {
			...gameStats,
			gamesPlayed: gameStats.gamesPlayed + 1,
			totalScore: gameStats.totalScore + score,
			bestTime:
				gameStats.bestTime === 0
					? timeElapsed
					: Math.min(gameStats.bestTime, timeElapsed),
			currentStreak: gameStats.currentStreak + 1,
			longestStreak: Math.max(
				gameStats.longestStreak,
				gameStats.currentStreak + 1
			),
		};
		setGameStats(newStats);

		checkAchievements(newStats);

		if (playerName.trim()) {
			const newEntry: LeaderboardEntry = {
				name: playerName.trim(),
				score,
				time: timeElapsed,
				date: new Date().toISOString(),
				achievements: achievements.filter((a) => a.unlocked).map((a) => a.name),
				difficulty:
					dailyChallenges[currentChallengeId]?.difficulty || "intermediate",
				challengeId: currentChallengeId,
			};

			const newLeaderboard = [...leaderboard, newEntry]
				.sort((a, b) => b.score - a.score)
				.slice(0, 50);
			setLeaderboard(newLeaderboard);

			if (isMounted) {
				try {
					localStorage.setItem(
						"wordPuzzleLeaderboard",
						JSON.stringify(newLeaderboard)
					);
				} catch (error) {
					console.error("Error saving leaderboard:", error);
				}
			}
		}

		playVictorySound();
	};

	const checkAchievements = (stats: GameStats) => {
		const newAchievements = [...achievements];
		let hasNewAchievement = false;

		if (
			!newAchievements.find((a) => a.id === "first_win")?.unlocked &&
			stats.gamesPlayed === 1
		) {
			const achievement = newAchievements.find((a) => a.id === "first_win")!;
			achievement.unlocked = true;
			hasNewAchievement = true;
		}

		if (
			!newAchievements.find((a) => a.id === "speed_demon")?.unlocked &&
			timeElapsed < 120
		) {
			const achievement = newAchievements.find((a) => a.id === "speed_demon")!;
			achievement.unlocked = true;
			hasNewAchievement = true;
		}

		if (
			!newAchievements.find((a) => a.id === "perfectionist")?.unlocked &&
			hintsRemaining === 3
		) {
			const achievement = newAchievements.find(
				(a) => a.id === "perfectionist"
			)!;
			achievement.unlocked = true;
			hasNewAchievement = true;
		}

		const streakAchievement = newAchievements.find(
			(a) => a.id === "streak_master"
		)!;
		if (!streakAchievement.unlocked) {
			streakAchievement.progress = stats.currentStreak;
			if (stats.currentStreak >= 5) {
				streakAchievement.unlocked = true;
				hasNewAchievement = true;
			}
		}

		const wordAchievement = newAchievements.find(
			(a) => a.id === "word_wizard"
		)!;
		if (!wordAchievement.unlocked) {
			wordAchievement.progress = stats.wordsCompleted;
			if (stats.wordsCompleted >= 100) {
				wordAchievement.unlocked = true;
				hasNewAchievement = true;
			}
		}

		if (
			!newAchievements.find((a) => a.id === "high_scorer")?.unlocked &&
			score > 2000
		) {
			const achievement = newAchievements.find((a) => a.id === "high_scorer")!;
			achievement.unlocked = true;
			hasNewAchievement = true;
		}

		if (hasNewAchievement) {
			setAchievements(newAchievements);
			setTimeout(() => setShowAchievements(true), 1000);
		}
	};

	const startGame = () => {
		setIsGameStarted(true);
		setIsPaused(false);
	};

	const pauseGame = () => {
		setIsPaused(!isPaused);
	};

	const resetGame = () => {
		loadGameState();
	};

	const useHint = () => {
		if (hintsRemaining <= 0) return;

		const incompletedClues = clues.filter((clue) => !clue.isCompleted);
		if (incompletedClues.length === 0) return;

		const randomClue =
			incompletedClues[Math.floor(Math.random() * incompletedClues.length)];
		const firstLetter = randomClue.answer[0];
		setShowHint(
			`${randomClue.number} ${randomClue.direction}: "${randomClue.text}" starts with "${firstLetter}" (${randomClue.answer.length} letters)`
		);
		setHintsRemaining((prev) => prev - 1);
		setGameStats((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));

		setTimeout(() => setShowHint(null), 5000);
	};

	const undoLastMove = () => {
		if (!lastMove) return;
		swapCells(lastMove.to, lastMove.from);
		setLastMove(null);
	};

	const handleShare = async () => {
		const achievementCount = achievements.filter((a) => a.unlocked).length;
		const shareData = {
			title: "Word Puzzle Challenge",
			text: `🎯 I scored ${score} points in ${formatTime(
				timeElapsed
			)}!\n🏆 ${achievementCount} achievements unlocked\n🔥 ${
				gameStats.currentStreak
			} game streak\n\nCan you beat my score?`,
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				await navigator.clipboard.writeText(shareData.text);
				alert("Score copied to clipboard!");
			}
		} catch (err) {
			console.error("Error sharing:", err);
		}
	};

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${mins.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		}
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const shuffleLetters = () => {
		const newGrid = [...grid];
		const unlockedCells: { row: number; col: number; letter: string }[] = [];

		for (let i = 0; i < newGrid.length; i++) {
			for (let j = 0; j < newGrid[i].length; j++) {
				if (!newGrid[i][j].isLocked && newGrid[i][j].letter !== "") {
					unlockedCells.push({ row: i, col: j, letter: newGrid[i][j].letter });
				}
			}
		}

		const letters = unlockedCells.map((cell) => cell.letter);
		for (let i = letters.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[letters[i], letters[j]] = [letters[j], letters[i]];
		}

		unlockedCells.forEach((cell, index) => {
			newGrid[cell.row][cell.col].letter = letters[index];
		});

		setGrid(newGrid);
		setScore((prev) => Math.max(0, prev - 25));
		setMultiplier(1);
	};

	const playSuccessSound = () => {
		if (isSoundEnabled && soundsLoaded && successSoundRef.current) {
			successSoundRef.current.currentTime = 0;
			successSoundRef.current.play().catch(() => {});
		}
	};

	const playVictorySound = () => {
		if (isSoundEnabled && soundsLoaded && victorySoundRef.current) {
			victorySoundRef.current.currentTime = 0;
			victorySoundRef.current.play().catch(() => {});
		}
	};

	const playClickSound = () => {
		if (isSoundEnabled && soundsLoaded && clickSoundRef.current) {
			clickSoundRef.current.currentTime = 0;
			clickSoundRef.current.play().catch(() => {});
		}
	};

	const memoizedGrid = useMemo(() => grid, [grid]);
	const currentChallenge = dailyChallenges[currentChallengeId];

	if (!isMounted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
					<p className="mt-4 text-purple-600 font-semibold">
						Loading WordCraft Pro...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen transition-all duration-500 ${
				currentTheme === "dark"
					? "bg-gradient-to-br from-gray-900 to-purple-900"
					: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
			} p-2 sm:p-4 relative overflow-hidden`}
		>
			<style jsx>{`
				.neumorphic {
					background: ${currentTheme === "dark"
						? "linear-gradient(145deg, #2a2a3e, #1e1e32)"
						: "linear-gradient(145deg, #f8faff, #ffffff)"};
					box-shadow: ${currentTheme === "dark"
						? "4px 4px 8px #1a1a2e, -4px -4px 8px #2a2a3e"
						: "4px 4px 8px #e1e5f2, -4px -4px 8px #ffffff"};
					border-radius: 12px;
					border: 1px solid
						${currentTheme === "dark"
							? "rgba(255,255,255,0.05)"
							: "rgba(255,255,255,0.8)"};
				}

				.neumorphic-inset {
					background: ${currentTheme === "dark"
						? "linear-gradient(145deg, #1e1e32, #2a2a3e)"
						: "linear-gradient(145deg, #f0f2ff, #f8faff)"};
					box-shadow: ${currentTheme === "dark"
						? "inset 2px 2px 4px #1a1a2e, inset -2px -2px 4px #2a2a3e"
						: "inset 2px 2px 4px #dde0f0, inset -2px -2px 4px #ffffff"};
					border-radius: 8px;
				}

				.neumorphic-button {
					background: linear-gradient(145deg, #6366f1, #8b5cf6);
					box-shadow: 2px 2px 6px #5558d3, -2px -2px 6px #9ca1ff;
					border-radius: 8px;
					transition: all 0.2s ease;
					border: none;
					position: relative;
					overflow: hidden;
				}

				.neumorphic-button:hover {
					box-shadow: 1px 1px 4px #5558d3, -1px -1px 4px #9ca1ff;
					transform: translateY(-1px);
				}

				.neumorphic-button:active {
					box-shadow: inset 1px 1px 2px #5558d3, inset -1px -1px 2px #9ca1ff;
					transform: translateY(0px);
				}

				.cell {
					transition: all 0.3s ease;
					transform-origin: center;
					position: relative;
					overflow: hidden;
				}

				.cell::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(
						45deg,
						rgba(255, 255, 255, 0.1),
						rgba(255, 255, 255, 0.2)
					);
					opacity: 0;
					transition: opacity 0.3s ease;
				}

				.cell:hover::before {
					opacity: 1;
				}

				.cell-locked {
					background: ${currentTheme === "dark"
						? "linear-gradient(145deg, #2a2a3e, #1e1e32)"
						: "linear-gradient(145deg, #e8ebf7, #f0f2ff)"};
					color: ${currentTheme === "dark" ? "#8892b0" : "#64748b"};
				}

				.cell-selected {
					background: linear-gradient(145deg, #8b5cf6, #a78bfa) !important;
					transform: scale(1.05);
					box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
					z-index: 10;
				}

				.cell-highlighted {
					background: linear-gradient(145deg, #10b981, #34d399) !important;
					animation: pulse 0.5s ease-in-out;
				}

				.cell-dragging {
					opacity: 0.7;
					transform: scale(0.95);
					z-index: 20;
				}

				.cell-animating {
					animation: cellPop 0.3s ease-out;
				}

				@keyframes cellPop {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.1);
					}
					100% {
						transform: scale(1);
					}
				}

				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.7;
					}
				}

				@keyframes confetti {
					0% {
						transform: translateY(-100vh) rotate(0deg);
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) rotate(720deg);
						opacity: 0;
					}
				}

				.confetti-piece {
					position: fixed;
					width: 10px;
					height: 10px;
					background: linear-gradient(
						45deg,
						#ff6b6b,
						#4ecdc4,
						#45b7d1,
						#f7b731
					);
					animation: confetti 3s linear infinite;
					z-index: 1000;
				}

				.glass-effect {
					backdrop-filter: blur(20px);
					background: rgba(255, 255, 255, 0.1);
					border: 1px solid rgba(255, 255, 255, 0.2);
				}

				.floating-hint {
					animation: slideInCenter 0.5s ease-out;
				}

				@keyframes slideInCenter {
					from {
						opacity: 0;
						transform: translateX(-50%) translateY(-30px);
					}
					to {
						opacity: 1;
						transform: translateX(-50%) translateY(0);
					}
				}

				.achievement-badge {
					animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
				}

				@keyframes bounceIn {
					0% {
						opacity: 0;
						transform: scale(0.3);
					}
					50% {
						opacity: 1;
						transform: scale(1.05);
					}
					70% {
						transform: scale(0.9);
					}
					100% {
						opacity: 1;
						transform: scale(1);
					}
				}
				button,
				a {
					cursor: pointer;
				}
				@media (max-width: 768px) {
					.game-container {
						flex-direction: column;
					}

					.clue-panel {
						width: 100% !important;
						margin-top: 1rem;
					}

					.neumorphic {
						border-radius: 10px;
						box-shadow: 3px 3px 6px #e1e5f2, -3px -3px 6px #ffffff;
					}
				}

				@media (max-width: 480px) {
					.neumorphic {
						border-radius: 8px;
						box-shadow: 2px 2px 4px #e1e5f2, -2px -2px 4px #ffffff;
					}

					.cell {
						font-size: 1.25rem;
					}
				}
			`}</style>

			{confetti && (
				<div className="fixed inset-0 pointer-events-none z-50">
					{[...Array(50)].map((_, i) => (
						<div
							key={i}
							className="confetti-piece"
							style={{
								left: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 2}s`,
								animationDuration: `${2 + Math.random() * 2}s`,
							}}
						/>
					))}
				</div>
			)}

			{showHint && (
				<div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 ">
					<div className="neumorphic p-4 max-w-xs text-center">
						<FaLightbulb className="text-yellow-500 mx-auto mb-2" size={24} />
						<p className="text-purple-700 font-semibold text-sm">{showHint}</p>
					</div>
				</div>
			)}

			<div className="max-w-7xl mx-auto mb-4 sm:mb-6">
				<div className="neumorphic p-4 sm:p-6">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2 sm:gap-4">
							<div className="flex items-center gap-2">
								<FaGem className="text-purple-600 text-2xl sm:text-3xl" />
								<h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
									WordCraft Pro
								</h1>
							</div>
						</div>
						<button
							onClick={() => setShowMenu(!showMenu)}
							className="lg:hidden neumorphic-button p-2 r-2 text-white"
						>
							{showMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
						</button>
						<div className="hidden lg:flex items-center gap-3">
							<div className="neumorphic-inset px-4 py-2 flex items-center gap-2">
								<FaFire className="text-orange-500" />
								<span className="text-purple-700 font-semibold">
									Score: {score.toLocaleString()}
								</span>
								{multiplier > 1 && (
									<span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
										x{multiplier}
									</span>
								)}
							</div>
							<div className="neumorphic-inset px-4 py-2 flex items-center gap-2">
								<FaClock className="text-blue-600" />
								<span className="text-blue-700 font-semibold">
									{formatTime(timeElapsed)}
								</span>
							</div>
							<div className="neumorphic-inset px-4 py-2 flex items-center gap-2">
								<FaLightbulb className="text-yellow-500" />
								<span className="text-purple-700 font-semibold">
									{hintsRemaining}
								</span>
							</div>
							<div className="flex gap-2">
								{!isGameStarted ? (
									<button
										onClick={startGame}
										className="neumorphic-button px-4 py-2 text-white flex items-center gap-2"
									>
										<FaPlay size={16} />
										Start
									</button>
								) : (
									<button
										onClick={pauseGame}
										className="neumorphic-button px-4 py-2 text-white flex items-center gap-2"
									>
										{isPaused ? <FaPlay size={16} /> : <FaPause size={16} />}
										{isPaused ? "Resume" : "Pause"}
									</button>
								)}
								<button
									onClick={() => setIsSoundEnabled(!isSoundEnabled)}
									className="neumorphic-button px-3 py-2 text-white"
								>
									{isSoundEnabled ? (
										<FaVolumeUp size={16} />
									) : (
										<FaVolumeMute size={16} />
									)}
								</button>
							</div>
						</div>
					</div>

					{showMenu && (
						<div className="lg:hidden mt-4 space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<div className="neumorphic-inset px-3 py-2 flex items-center gap-2">
									<FaFire className="text-orange-500" />
									<span className="text-purple-700 font-semibold text-sm">
										Score: {score.toLocaleString()}
									</span>
								</div>
								<div className="neumorphic-inset px-3 py-2 flex items-center gap-2">
									<FaClock className="text-blue-600" />
									<span className="text-blue-700 font-semibold text-sm">
										{formatTime(timeElapsed)}
									</span>
								</div>
							</div>
							<div className="flex gap-3">
								{!isGameStarted ? (
									<button
										onClick={startGame}
										className="neumorphic-button px-4 py-2 text-white flex items-center gap-2 flex-1"
									>
										<FaPlay size={14} />
										Start Game
									</button>
								) : (
									<button
										onClick={pauseGame}
										className="neumorphic-button px-4 py-2 text-white flex items-center gap-2 flex-1"
									>
										{isPaused ? <FaPlay size={14} /> : <FaPause size={14} />}
										{isPaused ? "Resume" : "Pause"}
									</button>
								)}
								<button
									onClick={() => setIsSoundEnabled(!isSoundEnabled)}
									className="neumorphic-button px-3 py-2 text-white"
								>
									{isSoundEnabled ? (
										<FaVolumeUp size={14} />
									) : (
										<FaVolumeMute size={14} />
									)}
								</button>
							</div>
							<input
								type="text"
								placeholder="Enter your name for leaderboard"
								value={playerName}
								onChange={(e) => setPlayerName(e.target.value)}
								className="w-full neumorphic-inset px-4 py-2 outline-none text-purple-700 placeholder-purple-400"
							/>
						</div>
					)}
				</div>
			</div>

			<div className="max-w-7xl mx-auto game-container flex gap-4 sm:gap-6">
				<div className="flex-1">
					<div className="neumorphic p-4 sm:p-6 relative">
						{!isGameStarted && (
							<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 rounded-12">
								<div className="text-center">
									<FaRocket className="text-white text-6xl mx-auto mb-4" />
									<h2 className="text-2xl font-bold text-white mb-2">
										Ready to Play?
									</h2>
									<p className="text-white mb-4">
										Arrange the letters to form words!
									</p>
									{currentChallenge && (
										<p className="text-gray-300 text-sm mb-4">
											Theme: {currentChallenge.theme}
										</p>
									)}
									<button
										onClick={startGame}
										className="neumorphic-button px-8 py-4 text-white text-xl font-bold"
									>
										<FaPlay className="inline mr-2" />
										Start Challenge
									</button>
								</div>
							</div>
						)}

						{isPaused && isGameStarted && (
							<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 rounded-12">
								<div className="text-center">
									<FaPause className="text-white text-6xl mx-auto mb-4" />
									<h2 className="text-2xl font-bold text-white mb-4">
										Game Paused
									</h2>
									<button
										onClick={pauseGame}
										className="neumorphic-button px-8 py-4 text-white text-xl font-bold"
									>
										<FaPlay className="inline mr-2" />
										Resume
									</button>
								</div>
							</div>
						)}

						<div
							className="grid gap-1 sm:gap-2 max-w-sm sm:max-w-md mx-auto"
							style={{
								gridTemplateColumns: `repeat(${
									memoizedGrid[0]?.length || 5
								}, 1fr)`,
							}}
						>
							{memoizedGrid.map((row, rowIndex) =>
								row.map((cell, colIndex) => (
									<div
										key={`${rowIndex}-${colIndex}`}
										className={`
                      cell neumorphic-inset relative aspect-square flex items-center justify-center
                      text-lg sm:text-2xl font-bold cursor-pointer select-none
                      ${
												cell.isLocked
													? "cell-locked"
													: "text-purple-700 hover:shadow-lg"
											}
                      ${
												selectedCell?.row === rowIndex &&
												selectedCell?.col === colIndex
													? "cell-selected text-white"
													: ""
											}
                      ${
												draggedCell?.row === rowIndex &&
												draggedCell?.col === colIndex
													? "cell-dragging"
													: ""
											}
                      ${cell.isHighlighted ? "cell-highlighted text-white" : ""}
                      ${
												animatingCells.has(`${rowIndex}-${colIndex}`)
													? "cell-animating"
													: ""
											}
                      ${cell.letter === "" ? "bg-gray-200 cursor-default" : ""}
                    `}
										onClick={() => handleCellClick(rowIndex, colIndex)}
										onTouchStart={(e) =>
											handleTouchStart(e, rowIndex, colIndex)
										}
										onTouchMove={handleTouchMove}
										onTouchEnd={(e) => handleTouchEnd(e, rowIndex, colIndex)}
										style={{
											animationDelay: `${cell.animationDelay}s`,
										}}
									>
										{cell.clueNumber && (
											<span className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 text-xs text-gray-500 font-normal">
												{cell.clueNumber}
											</span>
										)}
										{cell.letter}
									</div>
								))
							)}
						</div>

						<div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center">
							<button
								onClick={useHint}
								disabled={hintsRemaining <= 0}
								className={`neumorphic-button px-3 sm:px-4 py-2 text-white flex items-center gap-2 text-sm sm:text-base ${
									hintsRemaining <= 0 ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								<FaLightbulb size={16} />
								Hint ({hintsRemaining})
							</button>
							<button
								onClick={shuffleLetters}
								className="neumorphic-button px-3 sm:px-4 py-2 text-white flex items-center gap-2 text-sm sm:text-base"
							>
								<FaSync size={16} />
								Shuffle
							</button>
							<button
								onClick={undoLastMove}
								disabled={!lastMove}
								className={`neumorphic-button px-3 sm:px-4 py-2 text-white flex items-center gap-2 text-sm sm:text-base ${
									!lastMove ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								<FaTimes size={16} />
								Undo
							</button>
							<button
								onClick={handleShare}
								className="neumorphic-button px-3 sm:px-4 py-2 text-white flex items-center gap-2 text-sm sm:text-base"
							>
								<FaShareAlt size={16} />
								Share
							</button>
							<button
								onClick={() => setShowLeaderboard(!showLeaderboard)}
								className="neumorphic-button px-3 sm:px-4 py-2 text-white flex items-center gap-2 text-sm sm:text-base"
							>
								<FaTrophy size={16} />
								Leaderboard
							</button>
						</div>
					</div>
				</div>

				<div className="clue-panel w-full lg:w-80 xl:w-96">
					<div className="neumorphic p-4 sm:p-6">
						<h2 className="text-lg sm:text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
							<FaCalendarAlt size={20} />
							Challenge
							{currentChallenge && (
								<span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full ml-auto">
									{currentChallenge.theme}
								</span>
							)}
						</h2>

						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
									<FaChartLine size={16} />
									Across
								</h3>
								{clues
									.filter((clue) => clue.direction === "across")
									.map((clue) => (
										<div
											key={clue.id}
											className={`neumorphic-inset p-3 mb-2 transition-all duration-300 ${
												clue.isCompleted
													? "bg-gradient-to-r from-green-100 to-green-200 border-green-300"
													: ""
											}`}
										>
											<div className="flex items-center gap-2">
												<span className="font-bold text-purple-600">
													{clue.number}.
												</span>
												<span className="text-gray-700 flex-1">
													{clue.text}
												</span>
												<span
													className={`text-xs px-2 py-1 rounded-full ${
														clue.difficulty === "hard"
															? "bg-red-100 text-red-600"
															: clue.difficulty === "medium"
															? "bg-yellow-100 text-yellow-600"
															: "bg-green-100 text-green-600"
													}`}
												>
													{clue.difficulty}
												</span>
												{clue.isCompleted && (
													<FaCheckCircle className="text-green-500" />
												)}
											</div>
										</div>
									))}
							</div>

							<div>
								<h3 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
									<FaChartLine size={16} className="rotate-90" />
									Down
								</h3>
								{clues
									.filter((clue) => clue.direction === "down")
									.map((clue) => (
										<div
											key={clue.id}
											className={`neumorphic-inset p-3 mb-2 transition-all duration-300 ${
												clue.isCompleted
													? "bg-gradient-to-r from-green-100 to-green-200 border-green-300"
													: ""
											}`}
										>
											<div className="flex items-center gap-2">
												<span className="font-bold text-purple-600">
													{clue.number}.
												</span>
												<span className="text-gray-700 flex-1">
													{clue.text}
												</span>
												<span
													className={`text-xs px-2 py-1 rounded-full ${
														clue.difficulty === "hard"
															? "bg-red-100 text-red-600"
															: clue.difficulty === "medium"
															? "bg-yellow-100 text-yellow-600"
															: "bg-green-100 text-green-600"
													}`}
												>
													{clue.difficulty}
												</span>
												{clue.isCompleted && (
													<FaCheckCircle className="text-green-500" />
												)}
											</div>
										</div>
									))}
							</div>
						</div>

						<div className="hidden lg:block mt-6">
							<label className="block text-sm font-semibold text-purple-700 mb-2">
								Player Name
							</label>
							<input
								type="text"
								placeholder="Enter your name"
								value={playerName}
								onChange={(e) => setPlayerName(e.target.value)}
								className="w-full neumorphic-inset px-4 py-2 outline-none text-purple-700 placeholder-purple-400"
							/>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<button
								onClick={() => setShowStats(true)}
								className="neumorphic-inset p-3 text-center hover:bg-blue-50 transition-colors"
							>
								<FaChartLine className="text-blue-600 mx-auto mb-1" />
								<p className="text-xs text-gray-600">Stats</p>
							</button>
							<button
								onClick={() => setShowAchievements(true)}
								className="neumorphic-inset p-3 text-center hover:bg-purple-50 transition-colors"
							>
								<FaAward className="text-purple-600 mx-auto mb-1" />
								<p className="text-xs text-gray-600">Achievements</p>
							</button>
						</div>
					</div>
				</div>
			</div>

			{showLeaderboard && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="neumorphic p-6 max-w-lg w-full max-h-90vh overflow-auto">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
								<FaTrophy size={28} className="text-yellow-500" />
								Leaderboard
							</h2>
							<button
								onClick={() => setShowLeaderboard(false)}
								className="neumorphic-button p-2 text-white"
							>
								<FaTimes size={20} />
							</button>
						</div>

						{!playerName.trim() && (
							<div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
								<p className="text-yellow-800 text-sm">
									💡 Enter your name in the game panel to appear on the
									leaderboard when you complete a puzzle!
								</p>
							</div>
						)}

						<div className="space-y-3">
							{leaderboard.length === 0 ? (
								<div className="text-center py-8">
									<FaTrophy className="text-gray-400 text-4xl mx-auto mb-4" />
									<p className="text-gray-600">
										No scores yet. Be the first champion!
									</p>
								</div>
							) : (
								leaderboard.map((entry, index) => (
									<div
										key={`${entry.name}-${entry.date}-${index}`}
										className="neumorphic-inset p-4 flex justify-between items-center"
									>
										<div className="flex items-center gap-3">
											<div className="text-2xl">
												{index === 0 ? (
													<FaCrown className="text-yellow-500" />
												) : index === 1 ? (
													<FaMedal className="text-gray-400" />
												) : index === 2 ? (
													<FaMedal className="text-orange-500" />
												) : (
													<span className="text-gray-500 font-bold">
														#{index + 1}
													</span>
												)}
											</div>
											<div>
												<p className="font-semibold text-purple-700">
													{entry.name}
												</p>
												<p className="text-sm text-gray-600">
													{formatTime(entry.time)} • {entry.difficulty}
												</p>
												<p className="text-xs text-gray-500">
													{new Date(entry.date).toLocaleDateString()}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-blue-600 text-lg">
												{entry.score.toLocaleString()}
											</p>
											{entry.achievements.length > 0 && (
												<div className="flex gap-1 mt-1">
													{entry.achievements
														.slice(0, 3)
														.map((achievement, i) => (
															<FaAward
																key={i}
																className="text-yellow-500 text-xs"
																title={achievement}
															/>
														))}
													{entry.achievements.length > 3 && (
														<span className="text-xs text-gray-500">
															+{entry.achievements.length - 3}
														</span>
													)}
												</div>
											)}
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}

			{showStats && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="neumorphic p-6 max-w-md w-full">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
								<FaChartLine size={28} />
								Your Stats
							</h2>
							<button
								onClick={() => setShowStats(false)}
								className="neumorphic-button p-2 text-white"
							>
								<FaTimes size={20} />
							</button>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="neumorphic-inset p-4 text-center">
								<FaPlay className="text-blue-600 text-2xl mx-auto mb-2" />
								<p className="text-2xl font-bold text-purple-700">
									{gameStats.gamesPlayed}
								</p>
								<p className="text-sm text-gray-600">Games Played</p>
							</div>
							<div className="neumorphic-inset p-4 text-center">
								<FaFire className="text-orange-500 text-2xl mx-auto mb-2" />
								<p className="text-2xl font-bold text-purple-700">
									{gameStats.currentStreak}
								</p>
								<p className="text-sm text-gray-600">Current Streak</p>
							</div>
							<div className="neumorphic-inset p-4 text-center">
								<FaClock className="text-green-600 text-2xl mx-auto mb-2" />
								<p className="text-2xl font-bold text-purple-700">
									{gameStats.bestTime > 0
										? formatTime(gameStats.bestTime)
										: "--:--"}
								</p>
								<p className="text-sm text-gray-600">Best Time</p>
							</div>
							<div className="neumorphic-inset p-4 text-center">
								<FaStar className="text-yellow-500 text-2xl mx-auto mb-2" />
								<p className="text-2xl font-bold text-purple-700">
									{gameStats.totalScore.toLocaleString()}
								</p>
								<p className="text-sm text-gray-600">Total Score</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{showAchievements && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="neumorphic p-6 max-w-md w-full max-h-90vh overflow-auto">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
								<FaAward size={28} className="text-yellow-500" />
								Achievements
							</h2>
							<button
								onClick={() => setShowAchievements(false)}
								className="neumorphic-button p-2 text-white"
							>
								<FaTimes size={20} />
							</button>
						</div>

						<div className="space-y-3">
							{achievements.map((achievement) => (
								<div
									key={achievement.id}
									className={`neumorphic-inset p-4 flex items-center gap-3 ${
										achievement.unlocked ? "achievement-badge" : "opacity-60"
									}`}
								>
									<div
										className={`text-2xl ${
											achievement.unlocked ? "text-yellow-500" : "text-gray-400"
										}`}
									>
										{achievementIcons[achievement.iconName] || (
											<FaCheckCircle />
										)}
									</div>
									<div className="flex-1">
										<p
											className={`font-semibold ${
												achievement.unlocked
													? "text-purple-700"
													: "text-gray-500"
											}`}
										>
											{achievement.name}
										</p>
										<p className="text-sm text-gray-600">
											{achievement.description}
										</p>
										{achievement.progress !== undefined &&
											achievement.maxProgress && (
												<div className="mt-2">
													<div className="bg-gray-200 rounded-full h-2">
														<div
															className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
															style={{
																width: `${
																	(achievement.progress /
																		achievement.maxProgress) *
																	100
																}%`,
															}}
														/>
													</div>
													<p className="text-xs text-gray-500 mt-1">
														{achievement.progress} / {achievement.maxProgress}
													</p>
												</div>
											)}
									</div>
									{achievement.unlocked && (
										<FaCheckCircle className="text-green-500 text-xl" />
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{isComplete && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="neumorphic p-8 max-w-md w-full text-center">
						<div className="mb-6">
							<FaCrown
								size={80}
								className="text-yellow-500 mx-auto mb-4 animate-pulse"
							/>
							<h2 className="text-3xl font-bold text-purple-700 mb-2">
								Magnificent!
							</h2>
							<p className="text-gray-700 mb-2">
								You conquered the puzzle in {formatTime(timeElapsed)}
							</p>
							<div className="flex items-center justify-center gap-2 mb-4">
								<FaFire className="text-orange-500" />
								<span className="text-lg text-gray-600">
									Streak: {gameStats.currentStreak}
								</span>
							</div>
						</div>

						<div className="neumorphic-inset p-4 mb-6">
							<p className="text-3xl font-bold text-blue-600 mb-2">
								{score.toLocaleString()} Points
							</p>
							<div className="flex justify-center gap-4 text-sm text-gray-600">
								<span>Words: {clues.length}</span>
								<span>Hints: {3 - hintsRemaining}</span>
								<span>Multiplier: x{multiplier}</span>
							</div>
						</div>

						{!playerName.trim() && (
							<div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
								<p className="text-blue-800 text-sm">
									Enter your name in the game panel to save your score!
								</p>
							</div>
						)}

						<div className="flex gap-3 justify-center">
							<button
								onClick={handleShare}
								className="neumorphic-button px-6 py-3 text-white flex items-center gap-2"
							>
								<FaShareAlt size={20} />
								Share Victory
							</button>
							<button
								onClick={resetGame}
								className="neumorphic-button px-6 py-3 text-white flex items-center gap-2"
							>
								<FaSync size={20} />
								New Challenge
							</button>
						</div>
					</div>
				</div>
			)}

			<footer className="mt-12 border-t border-gray-200">
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="col-span-1 md:col-span-2">
							<div className="flex items-center gap-2 mb-4">
								<FaGem className="text-purple-600 text-2xl" />
								<span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
									WordCraft Pro
								</span>
							</div>
							<p className="text-gray-600 text-sm mb-4 max-w-md">
								Challenge your mind with engaging word puzzles. Train your
								vocabulary, improve your spelling, and have fun with daily
								challenges designed to keep you entertained and learning.
							</p>
							<div className="flex gap-4">
								<a
									href="#"
									className="text-gray-400 hover:text-purple-600 transition-colors"
									aria-label="Follow us on Twitter"
								>
									<FaTwitter size={20} />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-purple-600 transition-colors"
									aria-label="Visit our GitHub"
								>
									<FaGithub size={20} />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-purple-600 transition-colors"
									aria-label="Connect on LinkedIn"
								>
									<FaLinkedin size={20} />
								</a>
							</div>
						</div>

						<div>
							<h3 className="font-semibold text-gray-800 mb-3">
								Game Features
							</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>Daily Challenges</li>
								<li>Multiple Difficulty Levels</li>
								<li>Achievement System</li>
								<li>Global Leaderboards</li>
								<li>Progress Tracking</li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold text-gray-800 mb-3">Support</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>
									<a
										href="#"
										className="hover:text-purple-600 transition-colors"
									>
										How to Play
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-purple-600 transition-colors"
									>
										Tips & Strategies
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-purple-600 transition-colors"
									>
										Contact Support
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-purple-600 transition-colors"
									>
										Report Bug
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
						<p>&copy; 2024 WordCraft Pro. All rights reserved.</p>
						<div className="flex gap-6 mt-4 md:mt-0">
							<a href="#" className="hover:text-purple-600 transition-colors">
								Privacy Policy
							</a>
							<a href="#" className="hover:text-purple-600 transition-colors">
								Terms of Service
							</a>
							<a href="#" className="hover:text-purple-600 transition-colors">
								Accessibility
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default WordPuzzleGame;
