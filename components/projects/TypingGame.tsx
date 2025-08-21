"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { motion, AnimatePresence } from "framer-motion";

const THEMES = {
	LIGHT: "light",
	DARK: "dark",
};

const themeConfig = {
	[THEMES.LIGHT]: {
		background: "bg-slate-50",
		text: "text-slate-900",
		subtext: "text-slate-700",
		accent: "text-indigo-700",
		card: "bg-white",
		cardHover: "hover:bg-slate-100",
		input: "bg-slate-100",
		primaryButton:
			"bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white",
		secondaryButton: "bg-slate-200 hover:bg-slate-300 text-slate-800",
		success: "bg-emerald-100 text-emerald-800 border-emerald-200",
		warning: "bg-amber-100 text-amber-800 border-amber-200",
		error: "bg-rose-100 text-rose-800 border-rose-200",
		info: "bg-sky-100 text-sky-800 border-sky-200",
		progressBg: "bg-slate-200",
		progressBar: "bg-indigo-600",
		border: "border-slate-200",
		shadow: "shadow-lg shadow-slate-200/50",
		hoverShadow: "hover:shadow-xl hover:shadow-slate-200/50",
		focusRing: "focus:ring-indigo-600",
		gridBackground: "bg-slate-200",
		modalBg: "bg-black bg-opacity-50",
		wordCorrect: "text-emerald-700 font-bold",
		wordIncorrect: "text-rose-700 font-bold",
		combo: {
			low: "text-slate-800",
			medium: "text-indigo-700",
			high: "text-amber-600",
		},
		powerUp: "bg-amber-100 border-amber-300",
	},
	[THEMES.DARK]: {
		background: "bg-slate-900",
		text: "text-slate-50",
		subtext: "text-slate-300",
		accent: "text-indigo-300",
		card: "bg-slate-800",
		cardHover: "hover:bg-slate-750",
		input: "bg-slate-700",
		primaryButton:
			"bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white",
		secondaryButton: "bg-slate-700 hover:bg-slate-600 text-slate-200",
		success: "bg-emerald-900/30 text-emerald-300 border-emerald-800/30",
		warning: "bg-amber-900/30 text-amber-300 border-amber-800/30",
		error: "bg-rose-900/30 text-rose-300 border-rose-800/30",
		info: "bg-sky-900/30 text-sky-300 border-sky-800/30",
		progressBg: "bg-slate-700",
		progressBar: "bg-indigo-500",
		border: "border-slate-700",
		shadow: "shadow-lg shadow-black/50",
		hoverShadow: "hover:shadow-xl hover:shadow-black/50",
		focusRing: "focus:ring-indigo-500",
		gridBackground: "bg-slate-800",
		modalBg: "bg-black bg-opacity-75",
		wordCorrect: "text-emerald-300 font-bold",
		wordIncorrect: "text-rose-300 font-bold",
		combo: {
			low: "text-slate-300",
			medium: "text-indigo-300",
			high: "text-amber-300",
		},
		powerUp: "bg-amber-900/30 border-amber-800",
	},
};

const animations = {
	fadeIn: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.3 },
	},
	slideUp: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
		transition: { duration: 0.3 },
	},
	scaleUp: {
		initial: { scale: 0.9, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		exit: { scale: 0.9, opacity: 0 },
		transition: { duration: 0.3 },
	},
	wordEntry: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.3 },
	},
};

const TypingGame: NextPage = () => {
	const [gameActive, setGameActive] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [timeLeft, setTimeLeft] = useState(60);

	const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
	const [wordQueue, setWordQueue] = useState<string[]>([]);
	const [difficulty, setDifficulty] = useState("medium");

	const [currentWord, setCurrentWord] = useState("");
	const [userInput, setUserInput] = useState("");
	const [score, setScore] = useState(0);

	const [wordsTyped, setWordsTyped] = useState(0);
	const [accuracy, setAccuracy] = useState(100);
	const [totalKeystrokes, setTotalKeystrokes] = useState(0);

	const [highScore, setHighScore] = useState(0);
	const [showHowToPlay, setShowHowToPlay] = useState(false);

	const [soundEnabled, setSoundEnabled] = useState(true);
	const [focusMode, setFocusMode] = useState(false);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [username, setUsername] = useState("Player");

	const [theme, setTheme] = useState(THEMES.DARK);
	const [showMenu, setShowMenu] = useState(true);
	const [combo, setCombo] = useState(0);
	const [maxCombo, setMaxCombo] = useState(0);
	const [showConfetti, setShowConfetti] = useState(false);
	const [showStats, setShowStats] = useState(false);

	const currentTheme = themeConfig[theme];

	const leaderboardData = [
		{ name: "TypeMaster", score: 1250, wpm: 95, accuracy: 98 },
		{ name: "SpeedyFingers", score: 1120, wpm: 88, accuracy: 96 },
		{ name: "KeyboardNinja", score: 980, wpm: 82, accuracy: 94 },
		{ name: "SwiftTypist", score: 920, wpm: 75, accuracy: 95 },
		{ name: "RapidWriter", score: 850, wpm: 70, accuracy: 92 },
	];

	const [powerUpActive, setPowerUpActive] = useState<string | null>(null);
	const [powerUpTimeLeft, setPowerUpTimeLeft] = useState(0);
	const [gameHistory, setGameHistory] = useState<
		Array<{ score: number; wpm: number; accuracy: number; date: string }>
	>([]);

	const wordLists = {
		easy: [
			"cat",
			"dog",
			"run",
			"jump",
			"play",
			"fast",
			"slow",
			"big",
			"small",
			"red",
			"blue",
			"green",
			"happy",
			"sad",
			"hot",
			"cold",
			"up",
			"down",
			"left",
			"right",
			"good",
			"bad",
			"tall",
			"short",
			"long",
			"easy",
			"hard",
			"fun",
			"work",
			"play",
		],
		medium: [
			"keyboard",
			"monitor",
			"computer",
			"program",
			"network",
			"database",
			"software",
			"hardware",
			"internet",
			"developer",
			"function",
			"variable",
			"constant",
			"algorithm",
			"interface",
			"solution",
			"problem",
			"graphics",
			"document",
			"project",
			"coding",
			"website",
			"browser",
			"language",
			"system",
			"design",
			"mobile",
			"testing",
			"server",
			"client",
		],
		hard: [
			"synchronization",
			"implementation",
			"authentication",
			"optimization",
			"infrastructure",
			"virtualization",
			"cryptocurrency",
			"architecture",
			"microservices",
			"accessibility",
			"serialization",
			"heterogeneous",
			"parallelism",
			"methodology",
			"internationalization",
			"cybersecurity",
			"collaboration",
			"compatibility",
			"encapsulation",
			"decentralization",
		],
	};

	const inputRef = useRef<HTMLInputElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	const powerUps = [
		{
			name: "Time Bonus",
			description: "+10 seconds",
			icon: "⏱️",
			effect: () => setTimeLeft((prev) => prev + 10),
		},
		{
			name: "Double Points",
			description: "2x points for 10s",
			icon: "💰",
			effect: () => activatePowerUp("doublePoints"),
		},
		{
			name: "Word Skip",
			description: "Skip current word",
			icon: "⏩",
			effect: () => {
				addWordToQueue();
				setUserInput("");
			},
		},
		{
			name: "Accuracy Boost",
			description: "Perfect accuracy for 5s",
			icon: "🎯",
			effect: () => activatePowerUp("perfectAccuracy"),
		},
	];

	const soundEffects = {
		correct: "https://www.myinstants.com/media/sounds/ding-sound-effect_1.mp3",
		wrong: "https://www.myinstants.com/media/sounds/wrong-answer-buzzer.mp3",
		complete: "https://www.myinstants.com/media/sounds/task_complete-online-audio-converter.mp3",
		powerup: "https://www.myinstants.com/media/sounds/01-power-up-mario.mp3",
		gameOver: "https://www.myinstants.com/media/sounds/12322.mp3",
	};

	const playSound = (type: string) => {
		if (!soundEnabled || !audioRef.current) return;

		audioRef.current.src =
			soundEffects[type as keyof typeof soundEffects] || "";
		audioRef.current.play().catch((e) => console.log("Audio play error:", e));
	};

	const activatePowerUp = (powerUpType: string) => {
		setPowerUpActive(powerUpType);
		setPowerUpTimeLeft(powerUpType === "doublePoints" ? 10 : 5);
		playSound("powerup");

		setShowConfetti(true);
		setTimeout(() => setShowConfetti(false), 2000);
	};

	const startGame = () => {
		setGameActive(true);
		setGameOver(false);
		setTimeLeft(60);
		setScore(0);
		setWordsTyped(0);
		setUserInput("");
		setTotalKeystrokes(0);
		setCorrectKeystrokes(0);
		setAccuracy(100);
		setCombo(0);
		setMaxCombo(0);
		setPowerUpActive(null);
		setPowerUpTimeLeft(0);
		generateWordQueue();
		setShowMenu(false);
		setShowHowToPlay(false);
		setShowLeaderboard(false);
		setShowStats(false);
		if (inputRef.current) inputRef.current.focus();
		playSound("correct");
	};

	const goToMainMenu = () => {
		setGameActive(false);
		setGameOver(false);
		setShowMenu(true);
		setShowHowToPlay(false);
		setShowLeaderboard(false);
		setShowStats(false);
		setPowerUpActive(null);
	};

	const toggleTheme = () => {
		setTheme((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
	};

	const generateWordQueue = () => {
		const words = wordLists[difficulty as keyof typeof wordLists];
		const newQueue = Array(5)
			.fill("")
			.map(() => words[Math.floor(Math.random() * words.length)]);
		setWordQueue(newQueue);
		setCurrentWord(newQueue[0] || "");
	};

	const addWordToQueue = () => {
		const words = wordLists[difficulty as keyof typeof wordLists];
		const newWord = words[Math.floor(Math.random() * words.length)];
		setWordQueue((prevQueue) => {
			const newQueue = [...prevQueue.slice(1), newWord];
			setCurrentWord(newQueue[0] || "");
			return newQueue;
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setUserInput(value);

		if (value.length > userInput.length) {
			setTotalKeystrokes((prev) => prev + 1);
			const newChar = value[value.length - 1];
			const expectedChar = currentWord[value.length - 1];
			const isCorrect = newChar === expectedChar;

			if (isCorrect) {
				setCorrectKeystrokes((prev) => prev + 1);
				if (soundEnabled) playSound("correct");
			} else {
				if (soundEnabled) playSound("wrong");
			}

			if (powerUpActive === "perfectAccuracy") {
				setAccuracy(100);
			} else {
				const newAccuracy = Math.round(
					((correctKeystrokes + (isCorrect ? 1 : 0)) / (totalKeystrokes + 1)) *
						100
				);
				setAccuracy(newAccuracy);
			}
		}

		if (value === currentWord) {
			const difficultyMultiplier =
				difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
			const accuracyBonus = Math.max(0, accuracy - 90) / 10;
			const comboMultiplier = Math.min(3, 1 + combo / 10);
			const powerUpMultiplier = powerUpActive === "doublePoints" ? 2 : 1;

			const pointsGained = Math.round(
				currentWord.length *
					difficultyMultiplier *
					(1 + accuracyBonus) *
					comboMultiplier *
					powerUpMultiplier
			);

			setScore((prev) => prev + pointsGained);
			setWordsTyped((prev) => prev + 1);
			setUserInput("");

			setCombo((prev) => {
				const newCombo = prev + 1;
				if (newCombo > maxCombo) setMaxCombo(newCombo);
				return newCombo;
			});

			const powerUpChance = 0.05 + Math.min(0.15, combo * 0.01);
			if (Math.random() < powerUpChance && !powerUpActive) {
				const randomPowerUp =
					powerUps[Math.floor(Math.random() * powerUps.length)];
				randomPowerUp.effect();
			}

			addWordToQueue();
			playSound("complete");
		}
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && gameActive) {
				e.preventDefault();
				setGameActive(false);
				setShowMenu(true);
			}

			if (e.key === " " && gameOver && !showMenu) {
				e.preventDefault();
				startGame();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameActive, gameOver, showMenu]);

	const changeDifficulty = (level: string) => {
		setDifficulty(level);
		if (!gameActive) {
			generateWordQueue();
		}
	};

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		if (gameActive && timeLeft > 0) {
			timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
		} else if (timeLeft === 0 && gameActive) {
			setGameActive(false);
			setGameOver(true);
			if (score > highScore) setHighScore(score);

			const newGame = {
				score,
				wpm: calculateWPM(),
				accuracy,
				date: new Date().toLocaleDateString(),
			};
			setGameHistory((prev) => [newGame, ...prev].slice(0, 10));

			playSound("gameOver");
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [gameActive, timeLeft, score, highScore, accuracy]);

	useEffect(() => {
		let powerUpTimer: NodeJS.Timeout | null = null;

		if (powerUpActive && powerUpTimeLeft > 0) {
			powerUpTimer = setTimeout(() => {
				setPowerUpTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (powerUpTimeLeft === 0 && powerUpActive) {
			setPowerUpActive(null);
		}

		return () => {
			if (powerUpTimer) clearTimeout(powerUpTimer);
		};
	}, [powerUpActive, powerUpTimeLeft]);

	const highlightWord = () => {
		if (!currentWord) return null;
		const correct = userInput
			.split("")
			.map((char, i) => currentWord[i] === char);

		return (
			<motion.div
				className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono tracking-wider ${
					difficulty === "hard" ? "break-words" : ""
				}`}
				key={currentWord}
				{...animations.wordEntry}
			>
				{currentWord.split("").map((char, i) => {
					let className = "px-0.5";
					if (i < userInput.length) {
						className += correct[i]
							? ` ${currentTheme.wordCorrect}`
							: ` ${currentTheme.wordIncorrect}`;
					}
					return (
						<span key={i} className={className}>
							{char}
						</span>
					);
				})}
			</motion.div>
		);
	};

	const calculateWPM = () => {
		const adjustedWordCount = wordsTyped;
		const timeElapsedMinutes = (60 - timeLeft) / 60;
		if (timeElapsedMinutes <= 0) return 0;
		return Math.round(adjustedWordCount / timeElapsedMinutes);
	};

	const getComboStyle = () => {
		if (combo > 5) return currentTheme.combo.high;
		if (combo > 2) return currentTheme.combo.medium;
		return currentTheme.combo.low;
	};

	const getAccuracyColor = () => {
		if (accuracy > 90) return "bg-emerald-500";
		if (accuracy > 70) return "bg-amber-500";
		return "bg-rose-500";
	};

	const renderConfetti = () => {
		if (!showConfetti) return null;

		const confettiPieces = Array.from({ length: 50 }, (_, i) => {
			const colors = [
				"bg-red-500",
				"bg-blue-500",
				"bg-green-500",
				"bg-yellow-500",
				"bg-purple-500",
				"bg-pink-500",
			];
			const randomColor = colors[Math.floor(Math.random() * colors.length)];
			const left = `${Math.random() * 100}vw`;
			const animDelay = `${Math.random() * 2}s`;
			const size = `${Math.random() * 0.5 + 0.5}rem`;

			return (
				<div
					key={i}
					className={`absolute ${randomColor} rounded-full`}
					style={{
						left,
						top: "-5vh",
						width: size,
						height: size,
						animation: `fall 3s linear forwards`,
						animationDelay: animDelay,
					}}
				/>
			);
		});

		return (
			<div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
				{confettiPieces}
			</div>
		);
	};

	return (
		<div
			className={`min-h-screen ${currentTheme.background} ${currentTheme.text} relative overflow-hidden transition-colors duration-300 flex flex-col items-center justify-center`}
		>
			<Head>
				<title>Word Sprint - Typing Game</title>
				<meta
					name="description"
					content="Test your typing skills with Word Sprint"
				/>
				<style>{`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          
          .cursor-hover:hover {
            cursor: pointer;
          }
          
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${theme === THEMES.DARK ? "#1e293b" : "#f1f5f9"};
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${theme === THEMES.DARK ? "#475569" : "#cbd5e1"};
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${theme === THEMES.DARK ? "#64748b" : "#94a3b8"};
          }
        `}</style>
			</Head>

			{renderConfetti()}

			<audio ref={audioRef} className="hidden" />

			<div
				className={`absolute inset-0 overflow-hidden ${currentTheme.background} transition-colors duration-300`}
			>
				<div
					className={`grid-background ${
						theme === THEMES.DARK ? "dark-grid" : "light-grid"
					}`}
				/>
				<div
					className={`absolute top-1/4 left-1/4 w-64 h-64 ${
						theme === THEMES.DARK ? "bg-indigo-600" : "bg-indigo-400"
					} rounded-full filter blur-3xl opacity-10 animate-pulse transition-colors duration-300`}
				/>
				<div
					className={`absolute bottom-1/3 right-1/4 w-80 h-80 ${
						theme === THEMES.DARK ? "bg-purple-600" : "bg-purple-400"
					} rounded-full filter blur-3xl opacity-10 animate-pulse transition-colors duration-300`}
					style={{ animationDelay: "2s" }}
				/>
				<div
					className={`absolute top-2/3 left-2/3 w-48 h-48 ${
						theme === THEMES.DARK ? "bg-pink-600" : "bg-pink-400"
					} rounded-full filter blur-3xl opacity-10 animate-pulse transition-colors duration-300`}
					style={{ animationDelay: "3s" }}
				/>
				<div
					className={`absolute bottom-1/4 left-1/4 w-56 h-56 ${
						theme === THEMES.DARK ? "bg-green-600" : "bg-green-400"
					} rounded-full filter blur-3xl opacity-10 animate-pulse transition-colors duration-300`}
					style={{ animationDelay: "1s" }}
				/>
			</div>

			<div className="absolute top-4 right-4 z-20">
				<button
					onClick={toggleTheme}
					className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 cursor-pointer ${
						theme === THEMES.DARK
							? "bg-slate-700 text-amber-300"
							: "bg-indigo-100 text-indigo-800"
					}`}
					aria-label="Toggle theme"
				>
					{theme === THEMES.DARK ? "☀️" : "🌙"}
				</button>
			</div>

			<div className="absolute top-4 left-4 z-20">
				<button
					onClick={() => setSoundEnabled(!soundEnabled)}
					className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 cursor-pointer ${
						theme === THEMES.DARK ? "bg-slate-700" : "bg-indigo-100"
					}`}
					aria-label="Toggle sound"
				>
					{soundEnabled ? "🔊" : "🔇"}
				</button>
			</div>

			<main
				className={`container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center min-h-screen ${
					focusMode && gameActive ? "focus-mode" : ""
				}`}
			>
				<motion.div
					{...animations.fadeIn}
					transition={{ duration: 0.5 }}
					className="text-center mb-8"
				>
					<h1
						className={`text-3xl sm:text-4xl md:text-5xl font-bold ${currentTheme.accent} tracking-tight`}
					>
						Word Sprint
					</h1>
					<motion.p
						className="text-sm md:text-base font-medium text-amber-400 mt-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						Master Typing with Fun
					</motion.p>
				</motion.div>

				<AnimatePresence>
					{showMenu && (
						<motion.div
							className="max-w-xl mx-auto w-full"
							{...animations.scaleUp}
						>
							<div
								className={`${currentTheme.card} p-6 rounded-xl mb-6 ${currentTheme.shadow} transition-all duration-300 border ${currentTheme.border}`}
							>
								<label className="block mb-2 font-medium">
									Enter you name:
								</label>
								<input
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className={`w-full px-4 py-3 rounded-lg ${currentTheme.input} focus:outline-none focus:ring-2 ${currentTheme.focusRing} transition-all duration-300`}
									maxLength={15}
								/>
							</div>

							<div className="flex flex-col gap-4">
								<motion.button
									onClick={startGame}
									className={`py-4 px-6 ${currentTheme.primaryButton} font-bold rounded-xl ${currentTheme.shadow} transform transition-all duration-300 hover:scale-105 ${currentTheme.hoverShadow} flex items-center justify-center cursor-pointer`}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
								>
									<span className="mr-2">🚀</span> Start Game
								</motion.button>

								<motion.button
									onClick={() => setShowHowToPlay(true)}
									className={`py-4 px-6 ${currentTheme.card} ${currentTheme.cardHover} border ${currentTheme.border} font-bold rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer`}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
								>
									<span className="mr-2">📚</span> How to Play
								</motion.button>

								<motion.button
									onClick={() => setShowLeaderboard(true)}
									className={`py-4 px-6 ${currentTheme.card} ${currentTheme.cardHover} border ${currentTheme.border} font-bold rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer`}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
								>
									<span className="mr-2">🏆</span> Leaderboard
								</motion.button>

								{gameHistory.length > 0 && (
									<motion.button
										onClick={() => setShowStats(true)}
										className={`py-4 px-6 ${currentTheme.card} ${currentTheme.cardHover} border ${currentTheme.border} font-bold rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer`}
										whileHover={{ scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
									>
										<span className="mr-2">📊</span> Your Stats
									</motion.button>
								)}
							</div>

							<div className="mt-6">
								<p className="text-center font-medium mb-3">Game Options</p>
								<div className="flex justify-center gap-4">
									<label className="flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={focusMode}
											onChange={() => setFocusMode(!focusMode)}
											className="sr-only"
										/>
										<div
											className={`relative w-12 h-6 ${
												theme === THEMES.DARK ? "bg-slate-700" : "bg-slate-300"
											} rounded-full transition-all ${
												focusMode ? "bg-indigo-500" : ""
											}`}
										>
											<div
												className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
													focusMode ? "transform translate-x-6" : ""
												}`}
											></div>
										</div>
										<span className="ml-2 text-sm">Focus Mode</span>
									</label>
								</div>
							</div>

							<div className="mt-8">
								<p className="text-center font-medium mb-3">
									Select Difficulty
								</p>
								<div className="flex justify-center gap-4">
									{["easy", "medium", "hard"].map((level) => (
										<motion.button
											key={level}
											onClick={() => changeDifficulty(level)}
											className={`px-5 py-3 rounded-lg capitalize font-medium transition-all duration-300 cursor-pointer ${
												difficulty === level
													? `bg-indigo-600 text-white`
													: `${
															theme === THEMES.DARK
																? "bg-slate-700 hover:bg-slate-600 text-slate-200"
																: "bg-slate-200 hover:bg-slate-300 text-slate-800"
													  }`
											}`}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.97 }}
										>
											{level === "easy" && "😊 "}
											{level === "medium" && "😐 "}
											{level === "hard" && "😰 "}
											{level}
										</motion.button>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showHowToPlay && (
						<motion.div
							className={`fixed inset-0 ${currentTheme.modalBg} flex items-center justify-center z-50 p-4`}
							{...animations.fadeIn}
						>
							<motion.div
								className={`${currentTheme.card} p-4 sm:p-6 rounded-xl max-w-md w-full ${currentTheme.shadow} border ${currentTheme.border} max-h-[90vh] overflow-y-auto`}
								{...animations.scaleUp}
							>
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-2xl font-bold">How to Play</h2>
									<button
										onClick={() => setShowHowToPlay(false)}
										className={`rounded-full p-2 ${currentTheme.secondaryButton} transition-colors cursor-pointer`}
									>
										✕
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<h3 className="text-xl font-bold mb-3 flex items-center">
											<span className="mr-2 text-indigo-500">📝</span> Game
											Rules
										</h3>
										<ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
											<li>Type the displayed word correctly</li>
											<li>Earn points based on word length and difficulty</li>
											<li>Maintain high accuracy for bonus points</li>
											<li>Build combos for multipliers</li>
											<li>Collect power-ups for advantages</li>
											<li>Type as many words as you can in 60 seconds</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-bold mb-3 flex items-center">
											<span className="mr-2 text-purple-500">⚡</span> Power-ups
										</h3>
										<div className="grid grid-cols-1 gap-3">
											{powerUps.map((powerUp, index) => (
												<div
													key={index}
													className={`p-3 rounded-lg flex items-center ${currentTheme.input}`}
												>
													<span className="text-2xl mr-3">{powerUp.icon}</span>
													<div>
														<p className="font-bold">{powerUp.name}</p>
														<p className="text-sm ${currentTheme.subtext}">
															{powerUp.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>

									<div>
										<h3 className="text-xl font-bold mb-3 flex items-center">
											<span className="mr-2 text-amber-500">⌨️</span> Keyboard
											Shortcuts
										</h3>
										<ul className="space-y-2">
											<li className="flex items-center">
												<span
													className={`px-2 py-1 rounded ${currentTheme.input} font-mono mr-2`}
												>
													Esc
												</span>
												<span>Pause game / Return to menu</span>
											</li>
											<li className="flex items-center">
												<span
													className={`px-2 py-1 rounded ${currentTheme.input} font-mono mr-2`}
												>
													Space
												</span>
												<span>Start new game (when game over)</span>
											</li>
										</ul>
									</div>
								</div>

								<div className="mt-8 flex justify-end">
									<motion.button
										onClick={() => setShowHowToPlay(false)}
										className={`px-5 py-2 ${currentTheme.primaryButton} rounded-lg text-white font-bold transition-all duration-300 cursor-pointer`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.97 }}
									>
										Got it!
									</motion.button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showLeaderboard && (
						<motion.div
							className={`fixed inset-0 ${currentTheme.modalBg} flex items-center justify-center z-50 p-4`}
							{...animations.fadeIn}
						>
							<motion.div
								className={`${currentTheme.card} p-6 sm:p-8 rounded-xl max-w-md w-full ${currentTheme.shadow} border ${currentTheme.border}`}
								{...animations.scaleUp}
							>
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-2xl font-bold flex items-center">
										<span className="mr-2">🏆</span> Leaderboard
									</h2>
									<button
										onClick={() => setShowLeaderboard(false)}
										className={`rounded-full p-2 ${currentTheme.secondaryButton} transition-colors cursor-pointer`}
									>
										✕
									</button>
								</div>

								<div className="mb-6">
									<div className="grid grid-cols-4 gap-2 font-bold mb-3 pb-2 border-b border-slate-600 text-sm sm:text-base">
										<div>#</div>
										<div>Name</div>
										<div>Score</div>
										<div>WPM</div>
									</div>
									<div className="max-h-80 overflow-y-auto pr-2">
										{[
											...leaderboardData,
											...(gameHistory.length > 0
												? [
														{
															name: username,
															score: gameHistory[0].score,
															wpm: gameHistory[0].wpm,
															accuracy: gameHistory[0].accuracy,
														},
												  ]
												: []),
										]
											.sort((a, b) => b.score - a.score)
											.slice(0, 10)
											.map((entry, index) => (
												<motion.div
													key={index}
													className={`w-full p-4 mb-2 rounded-lg flex items-center ${
														entry.name === username
															? "bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30"
															: `${currentTheme.input}`
													} transition-all duration-300`}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.3, delay: index * 0.1 }}
												>
													<div className="grid grid-cols-4 w-full">
														<div className="flex items-center">
															<span
																className={`font-bold text-lg ${
																	index < 3 ? "text-amber-500" : ""
																}`}
															>
																{index === 0
																	? "🥇"
																	: index === 1
																	? "🥈"
																	: index === 2
																	? "🥉"
																	: `${index + 1}`}
															</span>
														</div>
														<div className="truncate font-medium">
															{entry.name}
														</div>
														<div className="font-bold text-lg">
															{entry.score}
														</div>
														<div className="text-sm">
															<span className="font-medium">{entry.wpm}</span>
															<span className="text-xs ml-1 text-slate-500">
																wpm
															</span>
														</div>
													</div>
												</motion.div>
											))}
									</div>
								</div>

								<div className="flex justify-end">
									<motion.button
										onClick={() => setShowLeaderboard(false)}
										className={`px-5 py-2 ${currentTheme.primaryButton} rounded-lg text-white font-bold transition-all duration-300 cursor-pointer`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.97 }}
									>
										Close
									</motion.button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showStats && (
						<motion.div
							className={`fixed inset-0 ${currentTheme.modalBg} flex items-center justify-center z-50 p-4`}
							{...animations.fadeIn}
						>
							<motion.div
								className={`${currentTheme.card} p-6 sm:p-8 rounded-xl max-w-md w-full ${currentTheme.shadow} border ${currentTheme.border}`}
								{...animations.scaleUp}
							>
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-2xl font-bold flex items-center">
										<span className="mr-2">📊</span> Your Stats
									</h2>
									<button
										onClick={() => setShowStats(false)}
										className={`rounded-full p-2 ${currentTheme.secondaryButton} transition-colors cursor-pointer`}
									>
										✕
									</button>
								</div>

								<div className="mb-6">
									<div className={`p-4 rounded-lg ${currentTheme.info} mb-6`}>
										<div className="flex justify-between items-center">
											<span className="text-lg">High Score:</span>
											<span className="text-2xl font-bold">{highScore}</span>
										</div>
									</div>

									<h3 className="text-xl font-bold mb-3 flex items-center">
										<span className="mr-2">📜</span> Recent Games
									</h3>
									<div className="max-h-64 overflow-y-auto pr-2">
										{gameHistory.map((game, index) => (
											<motion.div
												key={index}
												className={`w-full p-4 mb-3 rounded-lg ${
													index === 0
														? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
														: currentTheme.input
												}`}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3, delay: index * 0.1 }}
											>
												<div className="flex justify-between items-center">
													<span className="text-sm">{game.date}</span>
													<span className="font-bold text-lg">
														{game.score} pts
													</span>
												</div>
												<div className="flex justify-between mt-2">
													<span className="text-sm bg-indigo-500/10 px-2 py-1 rounded">
														<span className="font-medium">{game.wpm}</span>
														<span className="text-xs ml-1 text-slate-500">
															WPM
														</span>
													</span>
													<span className="text-sm bg-emerald-500/10 px-2 py-1 rounded">
														<span className="font-medium">
															{game.accuracy}%
														</span>
														<span className="text-xs ml-1 text-slate-500">
															accuracy
														</span>
													</span>
												</div>
											</motion.div>
										))}
									</div>
								</div>

								<div className="flex justify-end">
									<motion.button
										onClick={() => setShowStats(false)}
										className={`px-5 py-2 ${currentTheme.primaryButton} rounded-lg text-white font-bold transition-all duration-300 cursor-pointer`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.97 }}
									>
										Close
									</motion.button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{gameActive && (
						<motion.div
							className="max-w-full sm:max-w-2xl mx-auto w-full"
							{...animations.slideUp}
						>
							<div className="flex flex-wrap justify-between items-center mb-6 gap-4">
								<motion.div
									className={`${currentTheme.card} p-3 rounded-xl w-24 text-center ${currentTheme.shadow} transition-all duration-300 border ${currentTheme.border}`}
									whileHover={{ scale: 1.05 }}
								>
									<div className="text-xs font-medium uppercase tracking-wider opacity-70">
										Time
									</div>
									<div className="text-2xl font-bold">{timeLeft}s</div>
									<div
										className={`w-full ${currentTheme.progressBg} h-1.5 mt-2 rounded-full overflow-hidden`}
									>
										<div
											className={`h-full ${currentTheme.progressBar}`}
											style={{ width: `${(timeLeft / 60) * 100}%` }}
										></div>
									</div>
								</motion.div>

								<motion.div
									className={`${currentTheme.card} p-3 rounded-xl w-24 text-center ${currentTheme.shadow} transition-all duration-300 border ${currentTheme.border}`}
									whileHover={{ scale: 1.05 }}
								>
									<div className="text-xs font-medium uppercase tracking-wider opacity-70">
										Score
									</div>
									<div className="text-2xl font-bold">{score}</div>
								</motion.div>

								<motion.div
									className={`${currentTheme.card} p-3 rounded-xl w-24 text-center ${currentTheme.shadow} transition-all duration-300 border ${currentTheme.border}`}
									whileHover={{ scale: 1.05 }}
								>
									<div className="text-xs font-medium uppercase tracking-wider opacity-70">
										WPM
									</div>
									<div className="text-2xl font-bold">{calculateWPM()}</div>
								</motion.div>
							</div>

							<AnimatePresence>
								{powerUpActive && (
									<motion.div
										className={`mb-4 p-3 rounded-xl ${currentTheme.powerUp} flex items-center justify-between ${currentTheme.shadow}`}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.3 }}
									>
										<div className="flex items-center">
											<span className="text-2xl mr-3">
												{powerUpActive === "doublePoints"
													? "💰"
													: powerUpActive === "perfectAccuracy"
													? "🎯"
													: "⚡"}
											</span>
											<span className="font-bold">
												{powerUpActive === "doublePoints"
													? "Double Points"
													: "Perfect Accuracy"}{" "}
												Active!
											</span>
										</div>
										<div className="flex items-center">
											<span className="font-bold text-lg">
												{powerUpTimeLeft}s
											</span>
											<div className="ml-2 w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center">
												<div
													className="w-6 h-6 rounded-full bg-amber-500"
													style={{
														transform: `scale(${
															powerUpTimeLeft /
															(powerUpActive === "doublePoints" ? 10 : 5)
														})`,
													}}
												></div>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							<AnimatePresence>
								{combo > 0 && (
									<motion.div
										className={`mb-4 text-center ${getComboStyle()} text-lg`}
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.5, opacity: 0 }}
										key={combo}
										transition={{ duration: 0.3, type: "spring" }}
									>
										<span className="font-bold inline-flex items-center">
											{combo >= 10 ? "🔥 " : combo >= 5 ? "✨ " : ""}
											<span className="mx-1">Combo:</span>
											<span className="text-2xl">{combo}x</span>
											{combo >= 10 ? " 🔥" : combo >= 5 ? " ✨" : ""}
										</span>
									</motion.div>
								)}
							</AnimatePresence>

							<div className="mb-4 flex justify-center gap-4 flex-wrap">
								{wordQueue.slice(1, 3).map((word, index) => (
									<motion.div
										key={index}
										className={`px-3 py-1 rounded-lg ${
											currentTheme.subtext
										} text-sm font-medium opacity-${70 - index * 20}`}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 0.7 - index * 0.2, y: 0 }}
										transition={{ duration: 0.3, delay: 0.1 * index }}
									>
										{word}
									</motion.div>
								))}
							</div>

							<motion.div
								className={`${currentTheme.card} p-6 sm:p-8 rounded-xl mb-6 flex justify-center ${currentTheme.shadow} transition-all duration-300 border ${currentTheme.border}`}
								animate={{
									boxShadow: powerUpActive
										? [
												"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
												"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
												"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
										  ]
										: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
								}}
								transition={{
									duration: 1,
									repeat: powerUpActive ? Infinity : 0,
								}}
							>
								{highlightWord()}
							</motion.div>

							<div className="mb-8">
								<input
									ref={inputRef}
									type="text"
									value={userInput}
									onChange={handleInputChange}
									className={`w-full px-5 py-4 text-xl rounded-xl ${currentTheme.input} focus:outline-none focus:ring-2 ${currentTheme.focusRing} ${currentTheme.shadow} transition-all duration-300`}
									placeholder="Type here..."
									autoFocus
									autoComplete="off"
									autoCorrect="off"
									autoCapitalize="off"
									spellCheck={false}
								/>
							</div>

							<div className="grid grid-cols-3 gap-4 mb-6">
								<motion.div
									className={`${currentTheme.card} p-3 rounded-xl text-center ${currentTheme.shadow} transition-all duration-300 border ${currentTheme.border}`}
									whileHover={{ scale: 1.03 }}
								>
									<div className="text-xs font-medium uppercase tracking-wider opacity-70">
										Words
									</div>
									<div className="text-xl font-bold">{wordsTyped}</div>
								</motion.div>

								<motion.div
									className={`${currentTheme.card} p-3 rounded-xl text-center ${currentTheme.shadow} transition-all duration-300 border ${currentTheme.border}`}
									whileHover={{ scale: 1.03 }}
								>
									<div className="text-xs font-medium uppercase tracking-wider opacity-70">
										Accuracy
									</div>
									<div className="text-xl font-bold">{accuracy}%</div>
									<div
										className={`w-full ${currentTheme.progressBg} h-1.5 mt-2 rounded-full overflow-hidden`}
									>
										<div
											className={`h-full ${getAccuracyColor()}`}
											style={{ width: `${accuracy}%` }}
										></div>
									</div>
								</motion.div>

								<motion.div
									className={`${currentTheme.card} p-3 rounded-xl text-center ${currentTheme.shadow} transition-all duration-300 border ${currentTheme.border}`}
									whileHover={{ scale: 1.03 }}
								>
									<div className="text-xs font-medium uppercase tracking-wider opacity-70">
										Max Combo
									</div>
									<div className="text-xl font-bold">{maxCombo}x</div>
								</motion.div>
							</div>

							<div className="flex justify-center gap-4">
								<motion.button
									onClick={goToMainMenu}
									className={`px-4 py-3 ${currentTheme.secondaryButton} rounded-lg text-base font-medium cursor-pointer transition-all duration-300`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.97 }}
								>
									<span className="mr-2">⬅️</span> Menu
								</motion.button>

								<motion.button
									onClick={() => setFocusMode(!focusMode)}
									className={`px-4 py-3 ${
										focusMode
											? `bg-emerald-600 hover:bg-emerald-700 text-white`
											: currentTheme.secondaryButton
									} rounded-lg text-base font-medium cursor-pointer transition-all duration-300`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.97 }}
								>
									{focusMode ? "👁️ Focus: ON" : "👁️ Focus: OFF"}
								</motion.button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{gameOver && !showMenu && (
						<motion.div
							className="max-w-md mx-auto w-full"
							{...animations.slideUp}
							transition={{ duration: 0.5 }}
						>
							<motion.div
								className={`${currentTheme.card} p-6 sm:p-8 rounded-xl mb-6 ${currentTheme.shadow} overflow-hidden relative border ${currentTheme.border}`}
								initial={{ scale: 0.9 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.5, type: "spring" }}
							>
								{score > highScore && (
									<div className="absolute -top-2 -right-2 transform rotate-12 bg-amber-500 text-amber-900 font-bold py-1 px-4 text-sm">
										NEW HIGH SCORE!
									</div>
								)}

								<h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
									Game Over!
								</h2>
								<p className="text-center mb-6">Great job typing!</p>

								<div className="grid grid-cols-2 gap-4 mb-6">
									<motion.div
										className={`text-center p-4 ${currentTheme.input} rounded-xl`}
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.2 }}
									>
										<div className="text-xs font-medium uppercase tracking-wider opacity-70">
											Final Score
										</div>
										<div className="text-3xl font-bold mt-1">{score}</div>
										{score > highScore && (
											<div className="text-xs text-emerald-500 mt-1">
												New Record! 🏆
											</div>
										)}
									</motion.div>

									<motion.div
										className={`text-center p-4 ${currentTheme.input} rounded-xl`}
										initial={{ x: 20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.2 }}
									>
										<div className="text-xs font-medium uppercase tracking-wider opacity-70">
											WPM
										</div>
										<div className="text-3xl font-bold mt-1">
											{calculateWPM()}
										</div>
									</motion.div>
								</div>

								<div className="grid grid-cols-3 gap-4 mb-8">
									<motion.div
										className="text-center"
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: 0.3 }}
									>
										<div className="text-xs font-medium uppercase tracking-wider opacity-70">
											Words
										</div>
										<div className="text-2xl font-bold mt-1">{wordsTyped}</div>
									</motion.div>

									<motion.div
										className="text-center"
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: 0.4 }}
									>
										<div className="text-xs font-medium uppercase tracking-wider opacity-70">
											Accuracy
										</div>
										<div className="text-2xl font-bold mt-1">{accuracy}%</div>
									</motion.div>

									<motion.div
										className="text-center"
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: 0.5 }}
									>
										<div className="text-xs font-medium uppercase tracking-wider opacity-70">
											Max Combo
										</div>
										<div className="text-2xl font-bold mt-1">{maxCombo}x</div>
									</motion.div>
								</div>

								<div className="flex justify-center gap-4">
									<motion.button
										onClick={startGame}
										className={`px-5 py-3 ${currentTheme.primaryButton} rounded-xl text-white font-bold ${currentTheme.shadow} cursor-pointer transition-all duration-300`}
										whileHover={{
											scale: 1.05,
											boxShadow:
												"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
										}}
										whileTap={{ scale: 0.97 }}
									>
										Play Again
									</motion.button>

									<motion.button
										onClick={goToMainMenu}
										className={`px-5 py-3 ${currentTheme.secondaryButton} rounded-xl font-bold cursor-pointer transition-all duration-300`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.97 }}
									>
										Main Menu
									</motion.button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.footer
					className="mt-8 text-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}
				>
					<p className={`text-sm ${currentTheme.subtext}`}>
						Word Sprint Typing Game © {new Date().getFullYear()}
					</p>
					<p className={`text-sm ${currentTheme.subtext}`}>
						Designed with 💙 for typing enthusiasts!
					</p>
				</motion.footer>
			</main>

			<style jsx>{`
				.grid-background {
					position: absolute;
					width: 200%;
					height: 200%;
					transform: rotate(30deg) translate(-50%, -50%);
					top: 50%;
					left: 50%;
					background-size: 40px 40px;
					opacity: 0.1;
				}

				.dark-grid {
					background-image: linear-gradient(
							to right,
							#64748b 1px,
							transparent 1px
						),
						linear-gradient(to bottom, #64748b 1px, transparent 1px);
				}

				.light-grid {
					background-image: linear-gradient(
							to right,
							#cbd5e1 1px,
							transparent 1px
						),
						linear-gradient(to bottom, #cbd5e1 1px, transparent 1px);
				}

				.focus-mode .grid-background,
				.focus-mode footer,
				.focus-mode h1,
				.focus-mode p {
					opacity: 0;
					transition: opacity 0.5s;
				}

				button,
				input[type="button"],
				input[type="submit"],
				.cursor-pointer {
					cursor: pointer;
				}

				.${currentTheme.card} {
					backdrop-filter: blur(4px);
					-webkit-backdrop-filter: blur(4px);
				}
			`}</style>
		</div>
	);
};

export default TypingGame;
