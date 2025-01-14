"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardEntry {
	name: string;
	score: number;
	date: string;
}

const SimonGame: React.FC = () => {
	const [gameState, setGameState] = useState<
		"idle" | "sequence" | "userTurn" | "gameOver" | "paused"
	>("idle");
	const [sequence, setSequence] = useState<number[]>([]);
	const [userSequence, setUserSequence] = useState<number[]>([]);
	const [score, setScore] = useState<number>(0);
	const [highScore, setHighScore] = useState<number>(0);
	const [level, setLevel] = useState<number>(1);
	const [speed, setSpeed] = useState<number>(1000);
	const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
	const [userName, setUserName] = useState<string>("");
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [showRules, setShowRules] = useState<boolean>(false);
	const [showSettings, setShowSettings] = useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
		"medium"
	);
	const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
	const [theme, setTheme] = useState<"cosmic" | "neon">("cosmic");
	const [showGameOver, setShowGameOver] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<number>(3);
	const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [isClient, setIsClient] = useState(false);
	const [showAchievement, setShowAchievement] = useState<boolean>(false);
	const [achievementMessage, setAchievementMessage] = useState<string>("");
	const [streakCount, setStreakCount] = useState<number>(0);

	const audioRefs = [
		useRef<HTMLAudioElement>(null),
		useRef<HTMLAudioElement>(null),
		useRef<HTMLAudioElement>(null),
		useRef<HTMLAudioElement>(null),
	];

	const successSoundRef = useRef<HTMLAudioElement>(null);
	const failSoundRef = useRef<HTMLAudioElement>(null);
	const backgroundMusicRef = useRef<HTMLAudioElement>(null);
	const confettiRef = useRef<any>(null);
	const animationRef = useRef<HTMLDivElement>(null);

	const themes = {
		cosmic: {
			background: "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]",
			primaryButton:
				"bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg shadow-indigo-700/30",
			secondaryButton:
				"bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white shadow-lg shadow-purple-700/30",
			accentButton:
				"bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30",
			dangerButton:
				"bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30",
			neutralButton:
				"bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg shadow-gray-900/30",
			buttonColors: [
				{
					bg: "bg-gradient-to-br from-pink-500 to-purple-600",
					active: "from-pink-600 to-purple-700",
					glow: "pink-500",
					text: "text-white",
				},
				{
					bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
					active: "from-blue-600 to-indigo-700",
					glow: "blue-500",
					text: "text-white",
				},
				{
					bg: "bg-gradient-to-br from-amber-400 to-orange-500",
					active: "from-amber-500 to-orange-600",
					glow: "amber-400",
					text: "text-white",
				},
				{
					bg: "bg-gradient-to-br from-emerald-400 to-teal-500",
					active: "from-emerald-500 to-teal-600",
					glow: "emerald-400",
					text: "text-white",
				},
			],
			card: "bg-gray-900/90 backdrop-blur-xl border border-indigo-900/50 shadow-2xl shadow-indigo-900/20",
			text: "text-white",
			subtext: "text-gray-300",
			header:
				"text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
			accent: "text-pink-400",
			gameBoardBg:
				"bg-gray-900/80 backdrop-blur-xl border border-indigo-900/50 shadow-2xl",
			centerButton:
				"bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-indigo-700/30",
			scoreCard:
				"bg-gray-800/80 backdrop-blur-md border border-indigo-900/50 shadow-lg",
		},
		neon: {
			background: "bg-gradient-to-br from-gray-900 to-gray-950",
			primaryButton:
				"bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/40",
			secondaryButton:
				"bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/40",
			accentButton:
				"bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/40",
			dangerButton:
				"bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/40",
			neutralButton:
				"bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg shadow-gray-800/30",
			buttonColors: [
				{
					bg: "bg-gradient-to-r from-red-500 to-pink-500",
					active: "from-red-600 to-pink-600",
					glow: "red-500",
					text: "text-white",
				},
				{
					bg: "bg-gradient-to-r from-blue-500 to-cyan-400",
					active: "from-blue-600 to-cyan-500",
					glow: "cyan-400",
					text: "text-white",
				},
				{
					bg: "bg-gradient-to-r from-yellow-400 to-amber-500",
					active: "from-yellow-500 to-amber-600",
					glow: "yellow-400",
					text: "text-white",
				},
				{
					bg: "bg-gradient-to-r from-green-400 to-emerald-500",
					active: "from-green-500 to-emerald-600",
					glow: "green-400",
					text: "text-white",
				},
			],
			card: "bg-gray-800/90 backdrop-blur-xl border border-cyan-900/30 shadow-2xl shadow-cyan-900/20",
			text: "text-white",
			subtext: "text-gray-300",
			header:
				"text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600",
			accent: "text-cyan-400",
			gameBoardBg:
				"bg-gray-800/90 backdrop-blur-xl border border-cyan-900/30 shadow-2xl",
			centerButton:
				"bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30",
			scoreCard:
				"bg-gray-800/80 backdrop-blur-md border border-cyan-900/30 shadow-lg",
		},
	};

	const currentTheme = themes[theme];

	const [activeButton, setActiveButton] = useState<number | null>(null);

	useEffect(() => {
		setIsClient(true);

		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const loadConfetti = async () => {
			try {
				const confettiModule = await import("canvas-confetti");
				confettiRef.current = confettiModule.default;
			} catch (error) {
				console.error("Failed to load confetti:", error);
			}
		};

		if (isClient) {
			loadConfetti();
		}
	}, [isClient]);

	useEffect(() => {
		if (isClient) {
			try {
				const savedLeaderboard = localStorage.getItem("simonLeaderboard");
				if (savedLeaderboard) {
					setLeaderboard(JSON.parse(savedLeaderboard));
				}

				const savedHighScore = localStorage.getItem("simonHighScore");
				if (savedHighScore) {
					setHighScore(parseInt(savedHighScore, 10));
				}

				const savedTheme = localStorage.getItem("simonTheme");
				if (savedTheme) {
					setTheme(savedTheme as "cosmic" | "neon" | "minimal");
				}
			} catch (error) {
				console.error("Error accessing localStorage:", error);
			}
		}
	}, [isClient]);

	useEffect(() => {
		if (isClient) {
			try {
				localStorage.setItem("simonLeaderboard", JSON.stringify(leaderboard));
			} catch (error) {
				console.error("Error saving to localStorage:", error);
			}
		}
	}, [leaderboard, isClient]);

	useEffect(() => {
		if (isClient) {
			try {
				localStorage.setItem("simonHighScore", highScore.toString());
			} catch (error) {
				console.error("Error saving to localStorage:", error);
			}
		}
	}, [highScore, isClient]);

	useEffect(() => {
		if (isClient) {
			try {
				localStorage.setItem("simonTheme", theme);
			} catch (error) {
				console.error("Error saving theme to localStorage:", error);
			}
		}
	}, [theme, isClient]);

	useEffect(() => {
		if (backgroundMusicRef.current) {
			backgroundMusicRef.current.volume = 0.2;
			backgroundMusicRef.current.loop = true;

			if (
				soundEnabled &&
				(gameState === "sequence" || gameState === "userTurn")
			) {
				backgroundMusicRef.current
					.play()
					.catch((e) => console.error("Audio play failed:", e));
			} else {
				backgroundMusicRef.current.pause();
			}
		}

		return () => {
			if (backgroundMusicRef.current) {
				backgroundMusicRef.current.pause();
			}
		};
	}, [soundEnabled, gameState]);

	const triggerConfetti = () => {
		if (isClient && confettiRef.current) {
			const canvasConfetti = confettiRef.current.create(undefined, {
				resize: true,
				useWorker: true,
			});

			canvasConfetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: [
					"#26ccff",
					"#a25afd",
					"#ff5e7e",
					"#88ff5a",
					"#fcff42",
					"#ffa62d",
					"#ff36ff",
				],
			});
		}
	};

	const unlockAchievement = (message: string): void => {
		setAchievementMessage(message);
		setShowAchievement(true);

		if (soundEnabled && successSoundRef.current) {
			successSoundRef.current
				.play()
				.catch((e) => console.error("Audio play failed:", e));
		}

		setTimeout(() => {
			setShowAchievement(false);
		}, 3000);
	};

	const startGame = () => {
		console.log("Starting game...");
		if (isCountingDown) return;

		setIsCountingDown(true);
		setCountdown(3);

		if (soundEnabled && backgroundMusicRef.current) {
			backgroundMusicRef.current.currentTime = 0;
			backgroundMusicRef.current
				.play()
				.catch((e) => console.error("Audio play failed:", e));
		}

		const countdownInterval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(countdownInterval);
					setIsCountingDown(false);
					initializeGame();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const initializeGame = () => {
		setSequence([]);
		setUserSequence([]);
		setScore(0);
		setLevel(1);
		setStreakCount(0);

		if (difficulty === "easy") {
			setSpeed(1200);
		} else if (difficulty === "medium") {
			setSpeed(1000);
		} else {
			setSpeed(800);
		}

		setGameState("sequence");
		addToSequence();
	};

	const addToSequence = () => {
		const nextValue = Math.floor(Math.random() * 4);
		const newSequence = [...sequence, nextValue];
		setSequence(newSequence);
		playSequence(newSequence);
	};

	const playSequence = async (currentSequence: number[]) => {
		setGameState("sequence");
		setUserSequence([]);

		await new Promise((resolve) => setTimeout(resolve, 500));

		for (let i = 0; i < currentSequence.length; i++) {
			const button = currentSequence[i];

			setActiveButton(button);
			if (soundEnabled && audioRefs[button].current) {
				audioRefs[button].current.currentTime = 0;
				audioRefs[button].current
					.play()
					.catch((e) => console.error("Audio play failed:", e));
			}

			await new Promise((resolve) => setTimeout(resolve, speed / 2));

			setActiveButton(null);

			await new Promise((resolve) => setTimeout(resolve, speed / 2));
		}

		setGameState("userTurn");
	};

	const handleButtonClick = (buttonIndex: number) => {
		if (gameState !== "userTurn") return;

		if (soundEnabled && audioRefs[buttonIndex].current) {
			audioRefs[buttonIndex].current.currentTime = 0;
			audioRefs[buttonIndex].current
				.play()
				.catch((e) => console.error("Audio play failed:", e));
		}

		setActiveButton(buttonIndex);
		setTimeout(() => setActiveButton(null), 300);

		const newUserSequence = [...userSequence, buttonIndex];
		setUserSequence(newUserSequence);

		const isCorrect = newUserSequence.every(
			(value, index) => value === sequence[index]
		);

		if (!isCorrect) {
			if (soundEnabled && failSoundRef.current) {
				failSoundRef.current
					.play()
					.catch((e) => console.error("Audio play failed:", e));
			}
			endGame();
			return;
		}

		if (newUserSequence.length === sequence.length) {
			if (soundEnabled && successSoundRef.current) {
				successSoundRef.current
					.play()
					.catch((e) => console.error("Audio play failed:", e));
			}

			const newScore = score + sequence.length * 10;
			const newStreakCount = streakCount + 1;

			setScore(newScore);
			setStreakCount(newStreakCount);

			if (newScore > highScore) {
				setHighScore(newScore);
			}

			if (newStreakCount === 5) {
				unlockAchievement("5 Level Streak! 🔥");
				triggerConfetti();
			} else if (newStreakCount === 10) {
				unlockAchievement("10 Level Streak! ⚡");
				triggerConfetti();
			} else if (newStreakCount % 5 === 0 && newStreakCount > 10) {
				unlockAchievement(`${newStreakCount} Level Streak! 🌟`);
				triggerConfetti();
			}

			if (level === 5) {
				unlockAchievement("Level 5 Reached! 🏆");
			} else if (level === 10) {
				unlockAchievement("Level 10 Master! 👑");
			} else if (level === 15) {
				unlockAchievement("Level 15 Legend! 🌟");
			}

			setLevel(level + 1);

			if (level % 5 === 0 && speed > 400) {
				setSpeed((prevSpeed) => Math.max(prevSpeed - 100, 400));
			}

			setTimeout(() => {
				addToSequence();
			}, 1000);
		}
	};

	const endGame = () => {
		setGameState("gameOver");
		setShowGameOver(true);

		if (backgroundMusicRef.current) {
			backgroundMusicRef.current.pause();
		}
	};

	const togglePause = () => {
		if (gameState === "paused") {
			setGameState("userTurn");
			if (soundEnabled && backgroundMusicRef.current) {
				backgroundMusicRef.current
					.play()
					.catch((e) => console.error("Audio play failed:", e));
			}
		} else if (gameState === "userTurn" || gameState === "sequence") {
			setGameState("paused");
			if (backgroundMusicRef.current) {
				backgroundMusicRef.current.pause();
			}
		}
	};

	const addToLeaderboard = () => {
		if (!userName.trim()) return;

		const newEntry: LeaderboardEntry = {
			name: userName,
			score,
			date: new Date().toLocaleDateString(),
		};

		const newLeaderboard = [...leaderboard, newEntry]
			.sort((a, b) => b.score - a.score)
			.slice(0, 10);

		setLeaderboard(newLeaderboard);
		setShowGameOver(false);
		setUserName("");
		setGameState("idle");
	};

	const replaySequence = () => {
		if (gameState === "userTurn" || gameState === "paused") {
			setGameState("sequence");
			playSequence(sequence);
		}
	};

	const buttonVariants = {
		idle: { scale: 1 },
		hover: {
			scale: 1.05,
			boxShadow: `0 0 20px 5px rgba(var(--${currentTheme.buttonColors[0].glow}-rgb), 0.7)`,
		},
		tap: { scale: 0.95 },
	};

	const ctaButtonVariants = {
		initial: { scale: 1 },
		hover: {
			scale: 1.05,
			boxShadow:
				"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
		},
		tap: { scale: 0.98 },
	};

	if (!isClient) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-white text-center">
					<p className="text-xl font-bold">Loading Game...</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${currentTheme.background} ${currentTheme.text} font-sans overflow-x-hidden relative`}
			ref={animationRef}
		>
			{}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{Array.from({ length: 20 }).map((_, i) => {
					const randomX = Math.random() * windowSize.width;
					const randomY = Math.random() * windowSize.height;

					return (
						<motion.div
							key={i}
							className={`absolute rounded-full ${
								i % 2 === 0 ? "bg-indigo-500" : "bg-purple-500"
							} opacity-5`}
							initial={{
								x: randomX,
								y: randomY,
								scale: Math.random() * 4 + 1,
							}}
							animate={{
								x: Math.random() * windowSize.width,
								y: Math.random() * windowSize.height,
								transition: {
									duration: Math.random() * 20 + 15,
									repeat: Infinity,
									repeatType: "mirror",
								},
							}}
							style={{
								width: `${Math.random() * 200 + 50}px`,
								height: `${Math.random() * 200 + 50}px`,
							}}
						/>
					);
				})}
			</div>

			{}
			<AnimatePresence>
				{showAchievement && (
					<motion.div
						initial={{ y: -100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -100, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className="fixed top-20 inset-x-0 z-50 flex justify-center"
					>
						<div
							className={`bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2`}
						>
							<span className="text-yellow-300 text-lg">🏆</span>
							<span className="font-bold text-lg">{achievementMessage}</span>
							<span className="text-yellow-300 text-lg">✨</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<audio
				ref={audioRefs[0]}
				src="https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
			/>
			<audio
				ref={audioRefs[1]}
				src="https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
			/>
			<audio
				ref={audioRefs[2]}
				src="https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
			/>
			<audio
				ref={audioRefs[3]}
				src="https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
			/>
			<audio
				ref={successSoundRef}
				src="https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3"
			/>
			<audio
				ref={failSoundRef}
				src="https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"
			/>
			<audio
				ref={backgroundMusicRef}
				src="https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-689.mp3"
			/>

			{}
			<header className="w-full py-4 px-6 fixed top-0 left-0 z-50 bg-opacity-90 backdrop-blur-lg bg-gray-900">
				<div className="container mx-auto flex justify-between items-center">
					<div className="flex items-center">
						<motion.div
							className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							SIMON
						</motion.div>
					</div>

					<div className="hidden md:flex items-center space-x-4">
						<motion.button
							variants={buttonVariants}
							whileHover="hover"
							whileTap="tap"
							onClick={() => setShowRules(true)}
							className={`px-4 py-2 rounded-full font-medium ${currentTheme.neutralButton}`}
						>
							How to Play
						</motion.button>

						<motion.button
							variants={buttonVariants}
							whileHover="hover"
							whileTap="tap"
							onClick={() => setShowLeaderboard(true)}
							className={`px-4 py-2 rounded-full font-medium ${currentTheme.secondaryButton}`}
						>
							Leaderboard
						</motion.button>

						<motion.button
							variants={buttonVariants}
							whileHover="hover"
							whileTap="tap"
							onClick={() => setShowSettings(true)}
							className={`px-4 py-2 rounded-full font-medium ${currentTheme.accentButton}`}
						>
							Settings
						</motion.button>
					</div>

					<div className="md:hidden">
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowMenu(!showMenu)}
							className="p-2"
						>
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
									d="M4 6h16M4 12h16m-7 6h7"
								/>
							</svg>
						</motion.button>
					</div>
				</div>
			</header>

			{}
			<AnimatePresence>
				{showMenu && (
					<motion.div
						className="fixed inset-0 z-40 bg-black bg-opacity-90 flex flex-col justify-center items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="flex flex-col space-y-4 w-full px-8"
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.1 }}
						>
							<motion.button
								variants={buttonVariants}
								whileHover="hover"
								whileTap="tap"
								onClick={() => {
									setShowRules(true);
									setShowMenu(false);
								}}
								className={`px-6 py-3 rounded-xl font-medium text-lg ${currentTheme.neutralButton} w-full`}
							>
								How to Play
							</motion.button>

							<motion.button
								variants={buttonVariants}
								whileHover="hover"
								whileTap="tap"
								onClick={() => {
									setShowLeaderboard(true);
									setShowMenu(false);
								}}
								className={`px-6 py-3 rounded-xl font-medium text-lg ${currentTheme.secondaryButton} w-full`}
							>
								Leaderboard
							</motion.button>

							<motion.button
								variants={buttonVariants}
								whileHover="hover"
								whileTap="tap"
								onClick={() => {
									setShowSettings(true);
									setShowMenu(false);
								}}
								className={`px-6 py-3 rounded-xl font-medium text-lg ${currentTheme.accentButton} w-full`}
							>
								Settings
							</motion.button>

							<motion.button
								variants={buttonVariants}
								whileHover="hover"
								whileTap="tap"
								onClick={() => setShowMenu(false)}
								className={`px-6 py-3 rounded-xl font-medium text-lg ${currentTheme.dangerButton} w-full mt-8`}
							>
								Close Menu
							</motion.button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<div className="pt-28 pb-12 bg-gradient-to-b from-black to-transparent">
				<div className="container mx-auto px-6">
					<div className="max-w-3xl mx-auto text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<h1
								className={`text-5xl md:text-7xl font-bold mb-6 ${currentTheme.header}`}
							>
								Simon <span className={currentTheme.accent}>Says</span>
							</h1>

							<p className={`text-xl mb-10 ${currentTheme.subtext}`}>
								Test your memory with this classic game reimagined
							</p>

							{(gameState === "idle" || gameState === "gameOver") && (
								<motion.button
									variants={ctaButtonVariants}
									initial="initial"
									whileHover="hover"
									whileTap="tap"
									onClick={startGame}
									className={`${currentTheme.primaryButton} text-lg font-bold py-3 px-8 rounded-full mx-auto`}
								>
									Start Playing
								</motion.button>
							)}
						</motion.div>
					</div>
				</div>
			</div>

			<main className="flex-grow container mx-auto px-4 py-6 relative">
				{}
				{(gameState !== "idle" || score > 0 || streakCount > 0) && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`${currentTheme.scoreCard} mb-8 p-6 rounded-2xl max-w-4xl mx-auto`}
					>
						<div className="flex flex-col md:flex-row justify-between items-center">
							<div>
								<h2 className="text-2xl font-bold mb-2">
									Level <span className={currentTheme.accent}>{level}</span>
								</h2>
								<div className="flex items-center space-x-6">
									<p className="font-medium">
										Score: <span className="font-bold">{score}</span>
									</p>
									<p className="font-medium">
										High Score: <span className="font-bold">{highScore}</span>
									</p>
								</div>
								{streakCount > 0 && (
									<motion.div
										className="mt-2 flex items-center gap-2"
										animate={{ scale: [1, 1.1, 1] }}
										transition={{
											duration: 0.6,
											repeat: Infinity,
											repeatType: "loop",
										}}
									>
										<span className="text-yellow-400">⚡</span>
										<span className="text-yellow-300 font-medium">
											{streakCount} Level Streak
										</span>
									</motion.div>
								)}
							</div>

							<div className="flex mt-4 md:mt-0 space-x-2">
								{gameState !== "idle" && gameState !== "gameOver" && (
									<>
										<motion.button
											variants={buttonVariants}
											whileHover="hover"
											whileTap="tap"
											onClick={togglePause}
											className={`px-4 py-2 rounded-full text-sm font-medium ${
												gameState === "paused"
													? currentTheme.primaryButton
													: currentTheme.neutralButton
											}`}
										>
											{gameState === "paused" ? "Resume" : "Pause"}
										</motion.button>

										<motion.button
											variants={buttonVariants}
											whileHover="hover"
											whileTap="tap"
											onClick={replaySequence}
											className={`px-4 py-2 rounded-full text-sm font-medium ${currentTheme.secondaryButton}`}
										>
											Hint
										</motion.button>

										<motion.button
											variants={buttonVariants}
											whileHover="hover"
											whileTap="tap"
											onClick={initializeGame}
											className={`px-4 py-2 rounded-full text-sm font-medium ${currentTheme.dangerButton}`}
										>
											Restart
										</motion.button>
									</>
								)}
							</div>
						</div>

						{}
						<div className="text-center mt-4">
							{gameState === "sequence" && (
								<p className={`text-lg font-medium text-blue-400`}>
									Watch the sequence...
								</p>
							)}
							{gameState === "userTurn" && (
								<p className={`text-lg font-medium text-green-400`}>
									Your turn! Repeat the sequence
								</p>
							)}
							{gameState === "paused" && (
								<p className={`text-lg font-medium text-amber-400`}>
									Game paused
								</p>
							)}
						</div>
					</motion.div>
				)}

				{}
				<AnimatePresence>
					{isCountingDown && (
						<motion.div
							className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								className="relative flex items-center justify-center"
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.5, opacity: 0 }}
								key={countdown}
							>
								<svg className="w-40 h-40" viewBox="0 0 100 100">
									<circle
										className="text-gray-700 stroke-current"
										strokeWidth="4"
										fill="transparent"
										r="45"
										cx="50"
										cy="50"
									/>
									<circle
										className={`${
											theme === "cosmic"
												? "text-pink-500"
												: theme === "neon"
												? "text-cyan-400"
												: "text-blue-600"
										} stroke-current`}
										strokeWidth="4"
										strokeLinecap="round"
										fill="transparent"
										r="45"
										cx="50"
										cy="50"
										strokeDasharray="283"
										strokeDashoffset="0"
									/>
								</svg>
								<span className="absolute text-7xl font-bold text-white">
									{countdown === 0 ? "GO!" : countdown}
								</span>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{}
				{gameState !== "idle" && gameState !== "gameOver" && (
					<div className="relative max-w-md mx-auto mb-12">
						<motion.div
							className={`aspect-square ${currentTheme.gameBoardBg} rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden`}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<div className="w-full h-full grid grid-cols-2 gap-3 relative z-10">
								{[0, 1, 2, 3].map((buttonIndex) => (
									<motion.button
										key={buttonIndex}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => handleButtonClick(buttonIndex)}
										disabled={gameState !== "userTurn"}
										className={`
                      ${currentTheme.buttonColors[buttonIndex].bg}
                      rounded-full
                      flex items-center justify-center
                      text-2xl font-bold
                      ${currentTheme.buttonColors[buttonIndex].text}
                      shadow-lg
                      transition-all duration-100
                      ${
												gameState === "userTurn"
													? "cursor-pointer"
													: "cursor-default"
											}
                    `}
										style={{
											filter:
												activeButton === buttonIndex
													? "brightness(1.3)"
													: "brightness(1)",
											boxShadow:
												activeButton === buttonIndex
													? `0 0 20px 5px rgba(var(--${currentTheme.buttonColors[buttonIndex].glow}-rgb), 0.7)`
													: "none",
										}}
									>
										<span className="drop-shadow-md">{buttonIndex + 1}</span>
									</motion.button>
								))}
							</div>
						</motion.div>
					</div>
				)}

				{}
				{gameState === "idle" && (
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="flex flex-col items-center my-12 max-w-xl mx-auto"
					>
						<div className="p-6 text-center">
							<div className={`${currentTheme.card} p-8 rounded-xl mb-8`}>
								<h2
									className={`text-3xl font-bold mb-4 ${currentTheme.header}`}
								>
									How to Play
								</h2>
								<p className={`${currentTheme.subtext} mb-6`}>
									Simon will play a sequence of colored buttons. Your task is to
									remember and repeat that sequence exactly.
								</p>
								<ul className="space-y-3 text-left mb-6">
									<li className="flex items-start gap-3">
										<span className="text-indigo-400 text-xl">•</span>
										<span>Watch as Simon lights up buttons in sequence</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="text-indigo-400 text-xl">•</span>
										<span>
											Repeat the exact sequence by pressing the buttons
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="text-indigo-400 text-xl">•</span>
										<span>The sequence gets longer with each round</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="text-indigo-400 text-xl">•</span>
										<span>Make a mistake and the game ends!</span>
									</li>
								</ul>
							</div>
						</div>
					</motion.div>
				)}

				{}
				{gameState === "idle" && (
					<div className="max-w-5xl mx-auto mt-8 mb-20">
						<h2
							className={`text-3xl font-bold text-center mb-12 ${currentTheme.header}`}
						>
							Game Features
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<motion.div
								className={`${currentTheme.card} p-6 rounded-xl`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
							>
								<div
									className={`w-12 h-12 mb-4 flex items-center justify-center rounded-full ${currentTheme.accentButton}`}
								>
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
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-2">Responsive Design</h3>
								<p className={`${currentTheme.subtext}`}>
									Enjoy the game on any device with our fully responsive layout
									optimized for touch.
								</p>
							</motion.div>

							<motion.div
								className={`${currentTheme.card} p-6 rounded-xl`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<div
									className={`w-12 h-12 mb-4 flex items-center justify-center rounded-full ${currentTheme.accentButton}`}
								>
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
											d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-2">Customizable Themes</h3>
								<p className={`${currentTheme.subtext}`}>
									Choose between cosmic, neon, and minimal themes to personalize
									your gaming experience.
								</p>
							</motion.div>

							<motion.div
								className={`${currentTheme.card} p-6 rounded-xl`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<div
									className={`w-12 h-12 mb-4 flex items-center justify-center rounded-full ${currentTheme.accentButton}`}
								>
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
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-2">Global Leaderboard</h3>
								<p className={`${currentTheme.subtext}`}>
									Compete with players worldwide and see your name on the top
									scores leaderboard.
								</p>
							</motion.div>
						</div>
					</div>
				)}
			</main>

			{}
			<AnimatePresence>
				{showLeaderboard && (
					<motion.div
						className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowLeaderboard(false)}
					>
						<motion.div
							className={`${currentTheme.card} max-w-md w-full p-6 rounded-2xl`}
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold">Leaderboard</h2>
								<button
									onClick={() => setShowLeaderboard(false)}
									className={`${currentTheme.subtext} hover:text-white`}
								>
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
								</button>
							</div>

							{leaderboard.length > 0 ? (
								<div className="overflow-y-auto max-h-96">
									<table className="w-full">
										<thead>
											<tr className={`border-b border-gray-700`}>
												<th className="text-left py-3 px-2">Rank</th>
												<th className="text-left py-3 px-2">Name</th>
												<th className="text-right py-3 px-2">Score</th>
												<th className="text-right py-3 px-2">Date</th>
											</tr>
										</thead>
										<tbody>
											{leaderboard.map((entry, index) => (
												<tr key={index} className={`border-b border-gray-800`}>
													<td className="py-3 px-2">
														<span
															className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
																index < 3
																	? currentTheme.accentButton
																	: "bg-gray-700"
															} text-sm font-bold`}
														>
															{index + 1}
														</span>
													</td>
													<td className="py-3 px-2 font-medium">
														{entry.name}
													</td>
													<td className="py-3 px-2 text-right font-bold">
														{entry.score}
													</td>
													<td className="py-3 px-2 text-right text-sm text-gray-400">
														{entry.date}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className="py-12 text-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-16 w-16 mx-auto text-gray-600 mb-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<p className={`${currentTheme.subtext} text-lg`}>
										No scores yet. Be the first!
									</p>
								</div>
							)}

							<div className="mt-6 flex justify-end">
								<motion.button
									variants={buttonVariants}
									whileHover="hover"
									whileTap="tap"
									onClick={() => setShowLeaderboard(false)}
									className={`${currentTheme.primaryButton} px-6 py-2 rounded-full font-medium`}
								>
									Close
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{showSettings && (
					<motion.div
						className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowSettings(false)}
					>
						<motion.div
							className={`${currentTheme.card} max-w-md w-full p-4 sm:p-6 rounded-2xl`}
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-4 sm:mb-6">
								<h2 className="text-xl sm:text-2xl font-bold">Game Settings</h2>
								<button
									onClick={() => setShowSettings(false)}
									className={`${currentTheme.subtext} hover:text-white`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 sm:h-6 sm:w-6"
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
								</button>
							</div>

							<div className="space-y-6 sm:space-y-8">
								<div>
									<h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
										Difficulty Level
									</h3>
									<div className="grid grid-cols-3 gap-2 sm:gap-3">
										{["easy", "medium", "hard"].map((level) => (
											<motion.button
												key={level}
												variants={buttonVariants}
												whileHover="hover"
												whileTap="tap"
												onClick={() =>
													setDifficulty(level as "easy" | "medium" | "hard")
												}
												className={`px-2 py-2 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm md:text-base font-medium ${
													difficulty === level
														? currentTheme.primaryButton
														: "bg-gray-800 text-gray-300"
												}`}
											>
												<span className="block sm:hidden">
													{level === "easy"
														? "Easy"
														: level === "medium"
														? "Med"
														: "Hard"}
												</span>
												<span className="hidden sm:block">
													{level.charAt(0).toUpperCase() + level.slice(1)}
												</span>
											</motion.button>
										))}
									</div>
								</div>

								<div>
									<h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
										Visual Theme
									</h3>
									<div className="grid grid-cols-3 gap-2 sm:gap-3">
										{["cosmic", "neon"].map((themeOption) => (
											<motion.button
												key={themeOption}
												variants={buttonVariants}
												whileHover="hover"
												whileTap="tap"
												onClick={() =>
													setTheme(themeOption as "cosmic" | "neon")
												}
												className={`px-2 py-2 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm md:text-base font-medium ${
													theme === themeOption
														? currentTheme.secondaryButton
														: "bg-gray-800 text-gray-300"
												}`}
											>
												<span className="block sm:hidden">
													{themeOption === "cosmic" ? "Cosm" : "Neon"}
												</span>
												<span className="hidden sm:block">
													{themeOption.charAt(0).toUpperCase() +
														themeOption.slice(1)}
												</span>
											</motion.button>
										))}
									</div>
								</div>

								<div>
									<h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
										Sound Options
									</h3>
									<label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-gray-800">
										<span className="font-medium text-sm sm:text-base">
											Game Sounds
										</span>
										<div className="relative">
											<input
												type="checkbox"
												checked={soundEnabled}
												onChange={() => setSoundEnabled(!soundEnabled)}
												className="sr-only"
											/>
											<div
												className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors ${
													soundEnabled
														? theme === "cosmic"
															? "bg-pink-500"
															: theme === "neon"
															? "bg-cyan-500"
															: "bg-blue-600"
														: "bg-gray-600"
												}`}
											>
												<div
													className={`absolute w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full top-1 transition-transform ${
														soundEnabled
															? "transform translate-x-6 sm:translate-x-7"
															: "translate-x-1"
													}`}
												/>
											</div>
										</div>
									</label>
								</div>
							</div>

							<div className="mt-6 sm:mt-8 flex justify-end">
								<motion.button
									variants={buttonVariants}
									whileHover="hover"
									whileTap="tap"
									onClick={() => setShowSettings(false)}
									className={`${currentTheme.primaryButton} px-4 py-2 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base font-medium`}
								>
									Save Settings
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{showRules && (
					<motion.div
						className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowRules(false)}
					>
						<motion.div
							className={`${currentTheme.card} max-w-md w-full h-[90vh] overflow-scroll p-6 rounded-2xl`}
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold">How To Play</h2>
								<button
									onClick={() => setShowRules(false)}
									className={`${currentTheme.subtext} hover:text-white`}
								>
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
								</button>
							</div>

							<div className="space-y-6">
								<div>
									<h3
										className={`text-lg font-bold mb-2 ${currentTheme.accent}`}
									>
										Game Rules
									</h3>
									<ol className="list-decimal pl-5 space-y-2">
										<li>
											Watch as the game highlights buttons in a specific
											sequence.
										</li>
										<li>
											After the sequence finishes playing, repeat it by pressing
											the buttons in the same order.
										</li>
										<li>
											Each successful round adds to your sequence and increases
											the difficulty.
										</li>
										<li>If you press the wrong button, the game ends.</li>
										<li>
											Try to achieve the highest score by remembering longer
											sequences!
										</li>
									</ol>
								</div>

								<div>
									<h3
										className={`text-lg font-bold mb-2 ${currentTheme.accent}`}
									>
										Controls
									</h3>
									<ul className="space-y-3">
										<li className="flex items-start">
											<div
												className={`${currentTheme.primaryButton} w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</div>
											<div>
												<span className="font-medium">Start/Center Button</span>
												<p className={`text-sm ${currentTheme.subtext}`}>
													Press to begin the game or view the Simon logo during
													play.
												</p>
											</div>
										</li>

										<li className="flex items-start">
											<div
												className={`${currentTheme.secondaryButton} w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</div>
											<div>
												<span className="font-medium">Hint Button</span>
												<p className={`text-sm ${currentTheme.subtext}`}>
													Replays the current sequence if you need a reminder.
												</p>
											</div>
										</li>

										<li className="flex items-start">
											<div
												className={`${currentTheme.neutralButton} w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</div>
											<div>
												<span className="font-medium">Pause Button</span>
												<p className={`text-sm ${currentTheme.subtext}`}>
													Temporarily suspends gameplay. Press again to resume.
												</p>
											</div>
										</li>
									</ul>
								</div>

								<div>
									<h3
										className={`text-lg font-bold mb-2 ${currentTheme.accent}`}
									>
										Difficulty Levels
									</h3>
									<ul className="space-y-2">
										<li>
											<span className="font-medium">Easy:</span> Slower sequence
											playback for beginners.
										</li>
										<li>
											<span className="font-medium">Medium:</span> Standard
											speed with moderate challenge.
										</li>
										<li>
											<span className="font-medium">Hard:</span> Faster sequence
											playback for experts.
										</li>
									</ul>
								</div>
							</div>

							<div className="mt-6 flex justify-end">
								<motion.button
									variants={buttonVariants}
									whileHover="hover"
									whileTap="tap"
									onClick={() => {
										setShowRules(false);
										if (gameState === "idle") startGame();
									}}
									className={`${currentTheme.primaryButton} px-6 py-2 rounded-full font-medium`}
								>
									{gameState === "idle" ? "Play Now" : "Got It"}
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{showGameOver && (
					<motion.div
						className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-4 z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className={`${currentTheme.card} max-w-md w-full p-6 rounded-2xl overflow-hidden relative`}
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
						>
							<div className="relative z-10">
								<div className="text-center mb-6">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500 bg-opacity-20 mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-red-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<h2 className="text-3xl font-bold text-red-500 mb-2">
										Game Over!
									</h2>
									<p className={`${currentTheme.subtext} text-lg`}>
										You reached Level {level}
									</p>

									<div className="flex items-center justify-center space-x-6 mt-4">
										<div className="text-center">
											<p className={`${currentTheme.subtext} text-sm`}>Score</p>
											<p className="text-2xl font-bold">{score}</p>
										</div>
										<div className="h-12 border-l border-gray-700"></div>
										<div className="text-center">
											<p className={`${currentTheme.subtext} text-sm`}>
												High Score
											</p>
											<p className="text-2xl font-bold">{highScore}</p>
										</div>
									</div>
								</div>

								{score > 0 && (
									<div className="mb-6">
										<label
											className="block text-sm font-medium mb-2"
											htmlFor="userName"
										>
											Enter your name for the leaderboard:
										</label>
										<input
											type="text"
											id="userName"
											value={userName}
											onChange={(e) => setUserName(e.target.value)}
											className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
											placeholder="Your name"
											maxLength={20}
										/>
									</div>
								)}

								<div className="flex space-x-3">
									<motion.button
										variants={buttonVariants}
										whileHover="hover"
										whileTap="tap"
										onClick={() => {
											if (score > 0 && userName.trim()) {
												addToLeaderboard();
											} else {
												setShowGameOver(false);
												setGameState("idle");
											}
										}}
										className={`${currentTheme.neutralButton} flex-1 py-3 rounded-xl font-medium text-center`}
									>
										{score > 0 ? "Save Score" : "Close"}
									</motion.button>

									<motion.button
										variants={buttonVariants}
										whileHover="hover"
										whileTap="tap"
										onClick={() => {
											setShowGameOver(false);
											setGameState("idle");
										}}
										className={`${currentTheme.primaryButton} flex-1 py-3 rounded-xl font-medium text-center`}
									>
										Play Again
									</motion.button>
								</div>

								<div className="mt-6 pt-4 border-t border-gray-800 flex justify-between">
									<motion.button
										variants={buttonVariants}
										whileHover="hover"
										whileTap="tap"
										onClick={() => {
											setShowLeaderboard(true);
											setShowGameOver(false);
										}}
										className="text-sm font-medium flex items-center text-gray-400 hover:text-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
											/>
										</svg>
										View Leaderboard
									</motion.button>

									<motion.button
										variants={buttonVariants}
										whileHover="hover"
										whileTap="tap"
										onClick={() => {
											setShowSettings(true);
											setShowGameOver(false);
										}}
										className="text-sm font-medium flex items-center text-gray-400 hover:text-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										Change Settings
									</motion.button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<footer className="bg-gray-900 py-12">
				<div className="container mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-8 md:mb-0 text-center md:text-left">
							<h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2">
								SIMON
							</h3>
							<p className="text-gray-400">
								Challenge your memory with this classic game
							</p>
						</div>

						<div className="grid grid-cols-3 gap-8">
							<div>
								<h4 className="font-bold text-gray-300 mb-3">Game</h4>
								<ul className="space-y-2">
									<li>
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												startGame();
											}}
											className="text-gray-400 hover:text-white transition-colors"
										>
											Play Now
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setShowRules(true);
											}}
											className="text-gray-400 hover:text-white transition-colors"
										>
											How to Play
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setShowLeaderboard(true);
											}}
											className="text-gray-400 hover:text-white transition-colors"
										>
											Leaderboard
										</a>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-bold text-gray-300 mb-3">Settings</h4>
								<ul className="space-y-2">
									<li>
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setShowSettings(true);
											}}
											className="text-gray-400 hover:text-white transition-colors"
										>
											Game Options
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setSoundEnabled(!soundEnabled);
											}}
											className="text-gray-400 hover:text-white transition-colors"
										>
											Toggle Sound
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setTheme(theme === "cosmic" ? "neon" : "cosmic");
											}}
											className="text-gray-400 hover:text-white transition-colors"
										>
											Change Theme
										</a>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-bold text-gray-300 mb-3">Connect</h4>
								<div className="flex space-x-3">
									<a
										href="#"
										className="text-gray-400 hover:text-white transition-colors"
									>
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
												clipRule="evenodd"
											></path>
										</svg>
									</a>
									<a
										href="#"
										className="text-gray-400 hover:text-white transition-colors"
									>
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
												clipRule="evenodd"
											></path>
										</svg>
									</a>
									<a
										href="#"
										className="text-gray-400 hover:text-white transition-colors"
									>
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
										</svg>
									</a>
								</div>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
						<p>&copy; 2025 Simon Says Memory Game | All Rights Reserved</p>
					</div>
				</div>
			</footer>

			{}
			<style jsx global>{`
				@keyframes slow-spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
				.animate-slow-spin {
					animation: slow-spin 20s linear infinite;
				}

				.drop-shadow-glow {
					filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.7));
				}
			`}</style>
		</div>
	);
};

export default SimonGame;
