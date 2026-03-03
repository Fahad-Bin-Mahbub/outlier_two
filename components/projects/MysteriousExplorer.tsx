"use client";
import React, { useState, useEffect, useRef } from "react";

type ColorBlock = {
	color: string;
	isTarget: boolean;
};

type GameDifficulty = "easy" | "medium" | "hard";

type GameStats = {
	gamesPlayed: number;
	bestLevel: number;
	totalScore: number;
	bestTime: number | null;
};

type Achievement = {
	id: string;
	title: string;
	description: string;
	unlocked: boolean;
	icon: string;
};

const ColorPerceptionGame: React.FC = () => {
	const [level, setLevel] = useState<number>(1);
	const [score, setScore] = useState<number>(0);
	const [highScore, setHighScore] = useState<number>(0);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [gridSize, setGridSize] = useState<number>(3);
	const [grid, setGrid] = useState<ColorBlock[]>([]);
	const [targetIndex, setTargetIndex] = useState<number>(0);
	const [timeLeft, setTimeLeft] = useState<number>(15);
	const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<GameDifficulty>("medium");
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [isPaused, setIsPaused] = useState<boolean>(false);
	const [showSettings, setShowSettings] = useState<boolean>(false);
	const [showAchievements, setShowAchievements] = useState<boolean>(false);
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
	const [colorblindMode, setColorblindMode] = useState<boolean>(false);
	const [theme, setTheme] = useState<"dark" | "light">("dark");
	const [recentlyFailed, setRecentlyFailed] = useState<boolean>(false);
	const [streakCount, setStreakCount] = useState<number>(0);
	const [initialAnimationDone, setInitialAnimationDone] =
		useState<boolean>(false);
	const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
	const [stats, setStats] = useState<GameStats>({
		gamesPlayed: 0,
		bestLevel: 1,
		totalScore: 0,
		bestTime: null,
	});
	const [achievements, setAchievements] = useState<Achievement[]>([
		{
			id: "level5",
			title: "Getting Started",
			description: "Reach level 5",
			unlocked: false,
			icon: "🌱",
		},
		{
			id: "level10",
			title: "Color Apprentice",
			description: "Reach level 10",
			unlocked: false,
			icon: "🎨",
		},
		{
			id: "level20",
			title: "Color Master",
			description: "Reach level 20",
			unlocked: false,
			icon: "👁️",
		},
		{
			id: "perfect10",
			title: "Perfect Streak",
			description: "Get 10 correct in a row",
			unlocked: false,
			icon: "🔥",
		},
		{
			id: "speed",
			title: "Lightning Fast",
			description: "Find the different color in under 1 second",
			unlocked: false,
			icon: "⚡",
		},
	]);

	const [unlockedAchievement, setUnlockedAchievement] =
		useState<Achievement | null>(null);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const lastClickTime = useRef<number>(0);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const pausedTimeRef = useRef<number | null>(null);

	const generateRandomColor = () => {
		const h = Math.floor(Math.random() * 360);
		let s, l;

		if (colorblindMode) {
			s = Math.floor(Math.random() * 20) + 40;
			l = Math.floor(Math.random() * 30) + 35;
		} else {
			s = Math.floor(Math.random() * 30) + 60;
			l = Math.floor(Math.random() * 20) + 40;
		}

		return `hsl(${h}, ${s}%, ${l}%)`;
	};

	const getColorDifference = () => {
		let baseDiff = 10;

		if (difficulty === "easy") {
			baseDiff = 15;
		} else if (difficulty === "hard") {
			baseDiff = 7;
		}

		return Math.max(1, baseDiff - Math.floor(level / 3));
	};

	const generateDifferentColor = (baseColor: string): string => {
		const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
		if (!hslMatch) return baseColor;

		const h = parseInt(hslMatch[1]);
		const s = parseInt(hslMatch[2]);
		const l = parseInt(hslMatch[3]);

		const difference = getColorDifference();

		let attribute = Math.floor(Math.random() * 3);

		if (colorblindMode) {
			attribute = Math.random() > 0.3 ? 2 : Math.floor(Math.random() * 2);
		}

		let newH = h;
		let newS = s;
		let newL = l;

		if (attribute === 0) {
			newH = (h + difference) % 360;
		} else if (attribute === 1) {
			newS = Math.min(100, Math.max(0, s + difference));
		} else {
			newL = Math.min(100, Math.max(0, l + difference));
		}

		return `hsl(${newH}, ${newS}%, ${newL}%)`;
	};

	const playSound = (
		type: "success" | "error" | "levelup" | "gamestart" | "gameover"
	) => {
		if (!soundEnabled) return;

		let frequency = 0;
		let duration = 0.2;
		let type2 = "sine";

		switch (type) {
			case "success":
				frequency = 440 + level * 20;
				duration = 0.15;
				type2 = "triangle";
				break;
			case "error":
				frequency = 200;
				duration = 0.3;
				type2 = "sawtooth";
				break;
			case "levelup":
				frequency = 660;
				duration = 0.4;
				type2 = "sine";
				break;
			case "gamestart":
				frequency = 330;
				duration = 0.6;
				type2 = "triangle";
				break;
			case "gameover":
				frequency = 220;
				duration = 0.8;
				type2 = "sawtooth";
				break;
		}

		try {
			const AudioContext =
				window.AudioContext || (window as any).webkitAudioContext;
			if (!AudioContext) return;

			const audioCtx = new AudioContext();
			const oscillator = audioCtx.createOscillator();
			const gainNode = audioCtx.createGain();

			oscillator.type = type2 as OscillatorType;
			oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

			gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(
				0.001,
				audioCtx.currentTime + duration
			);

			oscillator.connect(gainNode);
			gainNode.connect(audioCtx.destination);

			oscillator.start();
			oscillator.stop(audioCtx.currentTime + duration);
		} catch (e) {
			console.warn("Audio not supported", e);
		}
	};

	const checkAchievements = () => {
		let newAchievements = [...achievements];
		let unlocked = false;
		let unlockedAch: Achievement | null = null;

		if (
			level >= 5 &&
			!newAchievements.find((a) => a.id === "level5")?.unlocked
		) {
			const index = newAchievements.findIndex((a) => a.id === "level5");
			newAchievements[index] = { ...newAchievements[index], unlocked: true };
			unlocked = true;
			unlockedAch = newAchievements[index];
		}

		if (
			level >= 10 &&
			!newAchievements.find((a) => a.id === "level10")?.unlocked
		) {
			const index = newAchievements.findIndex((a) => a.id === "level10");
			newAchievements[index] = { ...newAchievements[index], unlocked: true };
			unlocked = true;
			unlockedAch = newAchievements[index];
		}

		if (
			level >= 20 &&
			!newAchievements.find((a) => a.id === "level20")?.unlocked
		) {
			const index = newAchievements.findIndex((a) => a.id === "level20");
			newAchievements[index] = { ...newAchievements[index], unlocked: true };
			unlocked = true;
			unlockedAch = newAchievements[index];
		}

		if (
			streakCount >= 10 &&
			!newAchievements.find((a) => a.id === "perfect10")?.unlocked
		) {
			const index = newAchievements.findIndex((a) => a.id === "perfect10");
			newAchievements[index] = { ...newAchievements[index], unlocked: true };
			unlocked = true;
			unlockedAch = newAchievements[index];
		}

		const timeTaken = Date.now() - lastClickTime.current;
		if (
			timeTaken < 1000 &&
			!newAchievements.find((a) => a.id === "speed")?.unlocked
		) {
			const index = newAchievements.findIndex((a) => a.id === "speed");
			newAchievements[index] = { ...newAchievements[index], unlocked: true };
			unlocked = true;
			unlockedAch = newAchievements[index];
		}

		if (unlocked) {
			setAchievements(newAchievements);
			setUnlockedAchievement(unlockedAch);

			setTimeout(() => {
				setUnlockedAchievement(null);
			}, 3000);
		}
	};

	const generateGrid = () => {
		let newGridSize = 3;

		if (level > 10) newGridSize = 4;
		if (level > 20) newGridSize = 5;
		if (level > 30) newGridSize = 6;

		setGridSize(newGridSize);

		const baseColor = generateRandomColor();

		const differentColor = generateDifferentColor(baseColor);

		const newTargetIndex = Math.floor(
			Math.random() * (newGridSize * newGridSize)
		);
		setTargetIndex(newTargetIndex);

		const newGrid = Array(newGridSize * newGridSize)
			.fill(0)
			.map((_, index) => ({
				color: index === newTargetIndex ? differentColor : baseColor,
				isTarget: index === newTargetIndex,
			}));

		setGrid(newGrid);

		lastClickTime.current = Date.now();
	};

	const updateStats = () => {
		setStats((prev) => {
			const newStats = { ...prev };
			newStats.gamesPlayed += 1;
			newStats.bestLevel = Math.max(newStats.bestLevel, level);
			newStats.totalScore += score;
			return newStats;
		});
	};

	const resetGame = () => {
		if (gameStarted && (gameOver || score > 0)) {
			updateStats();
		}

		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		setLevel(1);
		setScore(0);
		setGameOver(false);
		setTimeLeft(15);
		setShowModal(false);
		setGameStarted(false);
		setIsTimerRunning(false);
		setStreakCount(0);
		setRecentlyFailed(false);
		setInitialAnimationDone(false);
		pausedTimeRef.current = null;
	};

	const togglePause = () => {
		if (gameOver) return;

		const newIsPaused = !isPaused;
		setIsPaused(newIsPaused);
		setIsTimerRunning(!newIsPaused);
	};

	const startGame = (selectedDifficulty: GameDifficulty) => {
		setDifficulty(selectedDifficulty);
		setGameStarted(true);
		setIsTimerRunning(true);
		generateGrid();
		playSound("gamestart");

		setTimeout(() => {
			setInitialAnimationDone(true);
		}, 800);
	};

	const handleBlockClick = (index: number) => {
		if (!gameStarted || gameOver || isPaused) return;

		if (index === targetIndex) {
			playSound("success");

			const newScore = score + level * 10;
			setScore(newScore);

			if (newScore > highScore) {
				setHighScore(newScore);
			}

			setLevel((prev) => prev + 1);

			setStreakCount((prev) => prev + 1);

			setShowLevelUp(true);
			setTimeout(() => {
				setShowLevelUp(false);
			}, 800);

			if ((level + 1) % 5 === 0) {
				playSound("levelup");
			}

			let newTime = 15 - Math.floor(level / 5);
			if (difficulty === "easy") newTime += 2;
			if (difficulty === "hard") newTime -= 2;
			setTimeLeft(Math.max(5, newTime));

			checkAchievements();

			setRecentlyFailed(false);

			generateGrid();
		} else {
			playSound("error");
			setRecentlyFailed(true);
			setStreakCount(0);

			setTimeLeft((prev) => Math.max(1, prev - 3));

			setTimeout(() => {
				setRecentlyFailed(false);
			}, 500);
		}
	};

	const endGame = () => {
		setGameOver(true);
		setIsTimerRunning(false);
		setShowModal(true);
		playSound("gameover");
		updateStats();
	};

	useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if (isTimerRunning && timeLeft > 0 && !isPaused) {
			timerRef.current = setTimeout(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (timeLeft === 0 && isTimerRunning) {
			endGame();
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [timeLeft, isTimerRunning, isPaused]);

	useEffect(() => {
		const savedHighScore = localStorage.getItem("colorQuestHighScore");
		if (savedHighScore) {
			setHighScore(parseInt(savedHighScore, 10));
		}

		const savedStats = localStorage.getItem("colorQuestStats");
		if (savedStats) {
			try {
				setStats(JSON.parse(savedStats));
			} catch (e) {
				console.warn("Failed to parse saved stats", e);
			}
		}

		const savedAchievements = localStorage.getItem("colorQuestAchievements");
		if (savedAchievements) {
			try {
				setAchievements(JSON.parse(savedAchievements));
			} catch (e) {
				console.warn("Failed to parse saved achievements", e);
			}
		}

		const prefersDarkMode = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setTheme(prefersDarkMode ? "dark" : "light");
	}, []);

	useEffect(() => {
		localStorage.setItem("colorQuestHighScore", highScore.toString());
	}, [highScore]);

	useEffect(() => {
		localStorage.setItem("colorQuestStats", JSON.stringify(stats));
	}, [stats]);

	useEffect(() => {
		localStorage.setItem(
			"colorQuestAchievements",
			JSON.stringify(achievements)
		);
	}, [achievements]);

	const getThemeStyles = () => {
		return {
			bg: theme === "dark" ? "bg-gray-900" : "bg-gray-100",
			text: theme === "dark" ? "text-white" : "text-gray-800",
			card:
				theme === "dark"
					? "bg-gradient-to-br from-gray-800 to-gray-900"
					: "bg-gradient-to-br from-white to-gray-100",
			cardAlt:
				theme === "dark"
					? "bg-gray-800 bg-opacity-60"
					: "bg-white bg-opacity-70",
			btnPrimary:
				theme === "dark"
					? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
					: "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600",
			btnSecondary:
				theme === "dark"
					? "bg-gray-700 hover:bg-gray-600"
					: "bg-gray-300 hover:bg-gray-400 text-gray-800",
			shadow:
				theme === "dark"
					? "shadow-lg shadow-blue-900/20"
					: "shadow-lg shadow-blue-500/10",
		};
	};

	const themeStyles = getThemeStyles();

	const getTimerColorClass = () => {
		if (timeLeft <= 3) return "text-red-500 animate-pulse";
		if (timeLeft <= 6) return "text-yellow-500";
		return "";
	};

	if (!gameStarted) {
		return (
			<div
				className={`min-h-screen w-full flex flex-col items-center justify-center ${themeStyles.bg} ${themeStyles.text} transition-colors duration-300`}
			>
				<div
					className={`w-full max-w-md px-8 py-10 rounded-xl ${themeStyles.card} ${themeStyles.shadow} transform transition-all duration-500 hover:scale-102`}
				>
					<h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
						ColorQuest
					</h1>
					<p className="text-xl text-center mb-8 text-gray-500">
						Challenge Your Color Perception
					</p>

					<div className="space-y-6">
						<div className={`${themeStyles.cardAlt} p-4 rounded-lg`}>
							<p
								className={`${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								} mb-2`}
							>
								How to play:
							</p>
							<p
								className={`text-sm ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}
							>
								Find the block with a slightly different color from the others.
								The difference becomes more subtle as you progress. Be quick -
								you're racing against the clock!
							</p>
						</div>

						<div className="space-y-4">
							<p
								className={`text-center ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Select difficulty:
							</p>
							<div className="grid grid-cols-3 gap-3">
								<button
									onClick={() => startGame("easy")}
									className="py-3 px-4 bg-green-600 rounded-lg text-white font-medium transition-all duration-300 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:-translate-y-1 cursor-pointer"
									aria-label="Easy difficulty"
								>
									Easy
								</button>
								<button
									onClick={() => startGame("medium")}
									className="py-3 px-4 bg-blue-600 rounded-lg text-white font-medium transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:-translate-y-1 cursor-pointer"
									aria-label="Medium difficulty"
								>
									Medium
								</button>
								<button
									onClick={() => startGame("hard")}
									className="py-3 px-4 bg-red-600 rounded-lg text-white font-medium transition-all duration-300 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transform hover:-translate-y-1 cursor-pointer"
									aria-label="Hard difficulty"
								>
									Hard
								</button>
							</div>
						</div>

						<div className="space-y-3 mt-8">
							<div className="flex justify-between items-center">
								<button
									onClick={() => setShowAchievements(true)}
									className={`text-sm py-2 px-4 ${themeStyles.btnSecondary} rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer`}
									aria-label="View achievements"
								>
									Achievements
								</button>

								<button
									onClick={() => setShowHelp(true)}
									className={`text-sm py-2 px-4 ${themeStyles.btnSecondary} rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer`}
									aria-label="View help"
								>
									How to Play
								</button>

								<button
									onClick={() => setShowSettings(true)}
									className={`text-sm py-2 px-4 ${themeStyles.btnSecondary} rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer`}
									aria-label="Settings"
								>
									Settings
								</button>
							</div>

							{stats.gamesPlayed > 0 && (
								<div
									className={`mt-6 ${themeStyles.cardAlt} p-4 rounded-lg text-sm`}
								>
									<p className="font-semibold mb-2">Your Stats:</p>
									<div className="grid grid-cols-2 gap-2">
										<div>
											<p
												className={`${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												Best Score:{" "}
												<span className="font-bold text-purple-500">
													{highScore}
												</span>
											</p>
											<p
												className={`${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												Best Level:{" "}
												<span className="font-bold text-blue-500">
													{stats.bestLevel}
												</span>
											</p>
										</div>
										<div>
											<p
												className={`${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												Games Played:{" "}
												<span className="font-bold">{stats.gamesPlayed}</span>
											</p>
											<p
												className={`${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												Total Score:{" "}
												<span className="font-bold">{stats.totalScore}</span>
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{}
				{showSettings && (
					<div
						className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
						onClick={() => setShowSettings(false)}
					>
						<div
							className={`${themeStyles.card} p-6 rounded-xl max-w-md w-full ${themeStyles.shadow} transform transition-all duration-300 animate-fadeIn`}
							onClick={(e) => e.stopPropagation()}
						>
							<h2 className="text-2xl font-bold mb-4">Settings</h2>

							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<label
										htmlFor="sound-toggle"
										className={`${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Sound Effects
									</label>
									<button
										id="sound-toggle"
										className={`w-12 h-6 rounded-full ${
											soundEnabled ? "bg-green-500" : "bg-gray-400"
										} relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer`}
										onClick={() => setSoundEnabled(!soundEnabled)}
										aria-pressed={soundEnabled}
										aria-label="Toggle sound effects"
									>
										<span
											className={`w-4 h-4 bg-white rounded-full absolute transform transition-transform duration-200 ${
												soundEnabled ? "translate-x-6" : "translate-x-1"
											} top-1 left-0`}
										></span>
									</button>
								</div>

								<div className="flex justify-between items-center">
									<label
										htmlFor="colorblind-toggle"
										className={`${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Colorblind Mode
									</label>
									<button
										id="colorblind-toggle"
										className={`w-12 h-6 rounded-full ${
											colorblindMode ? "bg-green-500" : "bg-gray-400"
										} relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer`}
										onClick={() => setColorblindMode(!colorblindMode)}
										aria-pressed={colorblindMode}
										aria-label="Toggle colorblind mode"
									>
										<span
											className={`w-4 h-4 bg-white rounded-full absolute transform transition-transform duration-200 ${
												colorblindMode ? "translate-x-6" : "translate-x-1"
											} top-1 left-0`}
										></span>
									</button>
								</div>

								<div className="flex justify-between items-center">
									<label
										htmlFor="theme-toggle"
										className={`${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										{theme === "dark" ? "Dark Mode" : "Light Mode"}
									</label>
									<button
										id="theme-toggle"
										className={`w-12 h-6 rounded-full ${
											theme === "dark" ? "bg-blue-600" : "bg-yellow-400"
										} relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
										onClick={() =>
											setTheme(theme === "dark" ? "light" : "dark")
										}
										aria-pressed={theme === "dark"}
										aria-label="Toggle dark mode"
									>
										<span
											className={`w-4 h-4 bg-white rounded-full absolute transform transition-transform duration-200 ${
												theme === "dark" ? "translate-x-6" : "translate-x-1"
											} top-1 left-0`}
										></span>
									</button>
								</div>

								<div className="mt-4 pt-4 border-t border-gray-700">
									<button
										onClick={() => {
											localStorage.removeItem("colorQuestHighScore");
											localStorage.removeItem("colorQuestStats");
											localStorage.removeItem("colorQuestAchievements");
											setHighScore(0);
											setStats({
												gamesPlayed: 0,
												bestLevel: 1,
												totalScore: 0,
												bestTime: null,
											});
											setAchievements(
												achievements.map((a) => ({ ...a, unlocked: false }))
											);
											setShowSettings(false);
										}}
										className="text-sm py-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
										aria-label="Reset all progress and stats"
									>
										Reset All Progress
									</button>
								</div>
							</div>

							<div className="mt-6 flex justify-end">
								<button
									onClick={() => setShowSettings(false)}
									className={`px-4 py-2 ${themeStyles.btnPrimary} rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
									aria-label="Close settings"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				{showAchievements && (
					<div
						className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
						onClick={() => setShowAchievements(false)}
					>
						<div
							className={`${themeStyles.card} p-6 rounded-xl max-w-md w-full ${themeStyles.shadow} transform transition-all duration-300 animate-fadeIn`}
							onClick={(e) => e.stopPropagation()}
						>
							<h2 className="text-2xl font-bold mb-4">Achievements</h2>

							<div className="space-y-4 max-h-80 overflow-y-auto pr-2">
								{achievements.map((achievement) => (
									<div
										key={achievement.id}
										className={`p-3 rounded-lg flex items-center space-x-3 transition-all ${
											achievement.unlocked
												? `${
														theme === "dark"
															? "bg-gradient-to-r from-blue-900/60 to-purple-900/60"
															: "bg-gradient-to-r from-blue-200 to-purple-200"
												  } border border-purple-500/50`
												: `${
														theme === "dark"
															? "bg-gray-800/70"
															: "bg-gray-300/90"
												  } opacity-80`
										}`}
									>
										<div className="text-3xl">{achievement.icon}</div>
										<div>
											<h3
												className={`font-bold ${
													achievement.unlocked
														? theme === "dark"
															? "text-purple-300"
															: "text-purple-700"
														: ""
												}`}
											>
												{achievement.title}
											</h3>
											<p
												className={`text-sm ${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												{achievement.description}
											</p>
										</div>
										{achievement.unlocked && (
											<div className="ml-auto">
												<span className="text-green-400 text-xl">✓</span>
											</div>
										)}
									</div>
								))}
							</div>

							<div className="mt-6 flex justify-end">
								<button
									onClick={() => setShowAchievements(false)}
									className={`px-4 py-2 ${themeStyles.btnPrimary} rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
									aria-label="Close achievements"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				{showHelp && (
					<div
						className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
						onClick={() => setShowHelp(false)}
					>
						<div
							className={`${themeStyles.card} p-6 rounded-xl max-w-md w-full ${themeStyles.shadow} transform transition-all duration-300 animate-fadeIn`}
							onClick={(e) => e.stopPropagation()}
						>
							<h2 className="text-2xl font-bold mb-4">How to Play</h2>

							<div className="space-y-4">
								<p
									className={`${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									ColorQuest tests your ability to distinguish subtle color
									differences.
								</p>

								<div className="space-y-2">
									<h3 className="font-bold text-lg">Rules:</h3>
									<ul className="list-disc list-inside space-y-1 text-sm">
										<li
											className={`${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Find the block with a slightly different color from all
											the others.
										</li>
										<li
											className={`${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Click on it before the timer runs out.
										</li>
										<li
											className={`${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Each correct pick advances you to the next level.
										</li>
										<li
											className={`${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											The difficulty increases as you progress:
										</li>
										<ul className="list-disc list-inside ml-4 space-y-1">
											<li
												className={`${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												Colors become more similar
											</li>
											<li
												className={`${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												Grid size increases at level 10, 20, and 30
											</li>
											<li
												className={`${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}
											>
												Timer gets shorter as you progress
											</li>
										</ul>
									</ul>
								</div>

								<div className="space-y-2 mt-4">
									<h3 className="font-bold text-lg">Tips:</h3>
									<ul className="list-disc list-inside space-y-1 text-sm">
										<li
											className={`${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Scan the entire grid quickly with your eyes.
										</li>
										<li
											className={`${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											If you can't easily spot the different color, try looking
											at the grid from different angles or distances.
										</li>
										<li
											className={`${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											If you're having trouble, turn on Colorblind Mode in
											Settings.
										</li>
										<li
											className={`${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Use the pause button during gameplay if you need a break.
										</li>
									</ul>
								</div>
							</div>

							<div className="mt-6 flex justify-end">
								<button
									onClick={() => setShowHelp(false)}
									className={`px-4 py-2 ${themeStyles.btnPrimary} rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
									aria-label="Close help"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen w-full flex flex-col items-center justify-center ${themeStyles.bg} ${themeStyles.text} p-6 transition-colors duration-300`}
		>
			{}
			{unlockedAchievement && (
				<div className="fixed top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg shadow-xl animate-slideIn z-50 max-w-xs">
					<div className="flex items-center space-x-3">
						<span className="text-3xl">{unlockedAchievement.icon}</span>
						<div>
							<p className="font-bold text-white">Achievement Unlocked!</p>
							<p className="text-sm text-white">{unlockedAchievement.title}</p>
						</div>
					</div>
				</div>
			)}

			{}
			{showLevelUp && (
				<div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
					<div className="text-4xl font-bold text-purple-400 animate-levelUp">
						Level Up!
					</div>
				</div>
			)}

			{}
			<div
				className={`w-full max-w-2xl mb-6 flex flex-col items-center ${
					initialAnimationDone ? "opacity-100" : "opacity-0"
				} transition-opacity duration-500`}
			>
				<div className="flex justify-between items-center w-full mb-4">
					<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
						ColorQuest
					</h1>

					<div className="flex items-center space-x-2">
						<button
							onClick={togglePause}
							className={`p-2 ${themeStyles.btnSecondary} rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 cursor-pointer`}
							aria-label={isPaused ? "Resume game" : "Pause game"}
						>
							{isPaused ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<polygon points="5 3 19 12 5 21 5 3" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<rect x="6" y="4" width="4" height="16" />
									<rect x="14" y="4" width="4" height="16" />
								</svg>
							)}
						</button>

						<button
							onClick={() => setShowSettings(true)}
							className={`p-2 ${themeStyles.btnSecondary} rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 cursor-pointer`}
							aria-label="Settings"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="12" cy="12" r="3" />
								<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
							</svg>
						</button>
					</div>
				</div>

				<div className="w-full grid grid-cols-4 gap-3 mb-4">
					<div className={`${themeStyles.cardAlt} p-3 rounded-lg text-center`}>
						<p className="text-xs text-gray-400">Level</p>
						<p className="text-xl font-bold">{level}</p>
					</div>

					<div className={`${themeStyles.cardAlt} p-3 rounded-lg text-center`}>
						<p className="text-xs text-gray-400">Score</p>
						<p className="text-xl font-bold">{score}</p>
					</div>

					<div className={`${themeStyles.cardAlt} p-3 rounded-lg text-center`}>
						<p className="text-xs text-gray-400">Time</p>
						<p className={`text-xl font-bold ${getTimerColorClass()}`}>
							{timeLeft}
						</p>
					</div>

					<div className={`${themeStyles.cardAlt} p-3 rounded-lg text-center`}>
						<p className="text-xs text-gray-400">Streak</p>
						<p
							className={`text-xl font-bold ${
								streakCount >= 5 ? "text-yellow-400" : ""
							}`}
						>
							{streakCount >= 3 && "🔥"} {streakCount}
						</p>
					</div>
				</div>

				<div className="flex items-center justify-center mb-2 w-full text-center">
					<p
						className={`text-sm ${
							theme === "dark" ? "text-gray-300" : "text-gray-700"
						} py-1 px-3 rounded-full ${
							themeStyles.cardAlt
						} inline-flex items-center`}
					>
						<span className="mr-1">👁️</span> Find the block with a different
						color
						{isPaused && <span className="ml-2 animate-pulse">PAUSED</span>}
					</p>
				</div>

				<div className="w-full bg-gray-700 h-1 rounded-full mb-4 overflow-hidden">
					<div
						className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
						style={{ width: `${Math.min(100, (timeLeft / 15) * 100)}%` }}
					></div>
				</div>
			</div>

			{}
			<div
				className={`w-full max-w-md mb-8 grid gap-2 p-3 rounded-xl ${
					themeStyles.cardAlt
				} ${themeStyles.shadow} transition-all duration-500 ${
					isPaused ? "opacity-50 blur-sm" : "opacity-100"
				} ${recentlyFailed ? "animate-shake" : ""} ${
					initialAnimationDone ? "scale-100" : "scale-90"
				}`}
				style={{
					gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
				}}
			>
				{grid.map((block, index) => (
					<button
						key={index}
						onClick={() => handleBlockClick(index)}
						className={`aspect-square rounded-lg transition-all duration-150 transform hover:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg cursor-pointer ${
							block.isTarget && gameOver
								? "ring-2 ring-green-500 ring-opacity-70"
								: ""
						}`}
						style={{
							backgroundColor: block.color,
						}}
						disabled={isPaused || gameOver}
						aria-label={`Color block ${index + 1}`}
					/>
				))}
			</div>

			{}
			<div
				className={`flex gap-4 ${
					initialAnimationDone ? "opacity-100" : "opacity-0"
				} transition-opacity duration-500`}
			>
				<button
					onClick={resetGame}
					className={`px-6 py-2 ${themeStyles.btnSecondary} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 cursor-pointer`}
					aria-label="Restart game"
				>
					Restart
				</button>

				<button
					onClick={() => setShowAchievements(true)}
					className={`px-6 py-2 ${themeStyles.btnSecondary} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 cursor-pointer`}
					aria-label="View achievements"
				>
					Achievements
				</button>
			</div>

			{}
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
					<div
						className={`${themeStyles.card} p-8 rounded-xl max-w-md w-full ${themeStyles.shadow} transform transition-all duration-300 animate-fadeIn`}
					>
						<h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">
							Game Over!
						</h2>

						<div className="space-y-4 mb-6">
							<div className="flex justify-between items-center">
								<p
									className={`${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Final Score:
								</p>
								<p className="text-2xl font-bold">{score}</p>
							</div>

							<div className="flex justify-between items-center">
								<p
									className={`${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Highest Score:
								</p>
								<p className="text-xl font-bold text-yellow-400">{highScore}</p>
							</div>

							<div className="flex justify-between items-center">
								<p
									className={`${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Level Reached:
								</p>
								<p className="text-xl">{level}</p>
							</div>

							<div className="flex justify-between items-center">
								<p
									className={`${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Best Streak:
								</p>
								<p className="text-xl">{streakCount}</p>
							</div>
						</div>

						{score > highScore / 2 && (
							<div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 rounded-lg mb-6 border border-purple-500/30">
								<p className="text-center text-purple-300 font-medium">
									Great job! You're getting better at this!
								</p>
							</div>
						)}

						<div className="mt-6 flex justify-center">
							<button
								onClick={resetGame}
								className={`px-8 py-3 ${themeStyles.btnPrimary} rounded-lg text-white font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:-translate-y-1 cursor-pointer`}
								aria-label="Play again"
							>
								Play Again
							</button>
						</div>
					</div>
				</div>
			)}

			{}
			{isPaused &&
				!showSettings &&
				!showAchievements &&
				!showHelp &&
				!showModal && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
						<div
							className={`${themeStyles.card} p-6 rounded-xl ${themeStyles.shadow} transform transition-all duration-300 animate-fadeIn flex flex-col items-center`}
						>
							<h2 className="text-2xl font-bold mb-4">Game Paused</h2>

							<div className="space-y-3 w-full max-w-xs mb-4">
								<button
									onClick={togglePause}
									className={`w-full py-3 ${themeStyles.btnPrimary} rounded-lg text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
									aria-label="Resume game"
								>
									Resume
								</button>

								<button
									onClick={() => setShowSettings(true)}
									className={`w-full py-3 ${themeStyles.btnSecondary} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer`}
									aria-label="Open settings"
								>
									Settings
								</button>

								<button
									onClick={resetGame}
									className={`w-full py-3 ${themeStyles.btnSecondary} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer`}
									aria-label="Restart game"
								>
									Restart
								</button>
							</div>

							<div
								className={`mt-2 text-sm ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Current Level: {level} | Score: {score}
							</div>
						</div>
					</div>
				)}

			{}
			<style jsx global>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: scale(0.9);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out forwards;
				}

				@keyframes shake {
					0% {
						transform: translateX(0);
					}
					25% {
						transform: translateX(-5px);
					}
					50% {
						transform: translateX(5px);
					}
					75% {
						transform: translateX(-5px);
					}
					100% {
						transform: translateX(0);
					}
				}
				.animate-shake {
					animation: shake 0.4s ease-in-out;
				}

				@keyframes slideIn {
					from {
						transform: translateY(-20px);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}
				.animate-slideIn {
					animation: slideIn 0.3s ease-out forwards;
				}

				@keyframes levelUp {
					0% {
						transform: scale(0.5);
						opacity: 0;
					}
					50% {
						transform: scale(1.5);
						opacity: 1;
					}
					100% {
						transform: scale(1);
						opacity: 0;
					}
				}
				.animate-levelUp {
					animation: levelUp 0.8s ease-out forwards;
				}

				@keyframes pulse {
					0% {
						opacity: 1;
					}
					50% {
						opacity: 0.5;
					}
					100% {
						opacity: 1;
					}
				}
				.animate-pulse {
					animation: pulse 1s infinite;
				}
			`}</style>
		</div>
	);
};

export default ColorPerceptionGame;
