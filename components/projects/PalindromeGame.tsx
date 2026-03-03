
"use client";
import { useState, useEffect, useRef } from "react";
import {
	Moon,
	Sun,
	Volume2,
	VolumeX,
	Award,
	HelpingHand,
	Clock,
	Zap,
	Brain,
	Sparkles,
	Trophy,
	Rocket,
	ArrowRight,
	Heart,
	Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

enum GameLevel {
	EASY = "Easy",
	MEDIUM = "Medium",
	HARD = "Hard",
	EXPERT = "Expert",
}

enum GameState {
	NOT_STARTED,
	PRACTICE_ROUND,
	COUNTDOWN,
	QUESTION_PHASE,
	INPUT_PHASE,
	PAUSED,
	GAME_OVER,
}

enum Theme {
	LIGHT = "light",
	DARK = "dark",
}

interface GameStats {
	score: number;
	highScore: number;
	streak: number;
	hintsLeft: number;
	lives: number;
}

interface GameSettings {
	level: GameLevel;
	theme: Theme;
	soundEnabled: boolean;
	isPracticeRound: boolean;
}

interface GameTimers {
	timeLeft: number;
	countdown: number;
}

interface GameFeedback {
	message: string;
	messageColor: string;
	showHintModal: boolean;
	showConfetti: boolean;
}

const PalindromeGame: React.FC = () => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const confettiRef = useRef<any>(null);

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

	const [stats, setStats] = useState<GameStats>({
		score: 0,
		highScore: 0,
		streak: 0,
		hintsLeft: 3,
		lives: 3,
	});

	const [settings, setSettings] = useState<GameSettings>({
		level: GameLevel.EASY,
		theme: Theme.DARK,
		soundEnabled: true,
		isPracticeRound: true,
	});

	const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
	const [currentNumber, setCurrentNumber] = useState<number | null>(null);

	const [timers, setTimers] = useState<GameTimers>({
		timeLeft: 0,
		countdown: 3,
	});

	const [windowSize, setWindowSize] = useState({
		width: 0,
		height: 0,
	});

	const [feedback, setFeedback] = useState<GameFeedback>({
		message: "",
		messageColor: "",
		showHintModal: false,
		showConfetti: false,
	});

	const [inputValue, setInputValue] = useState<string>("");

	const [showAchievement, setShowAchievement] = useState<boolean>(false);
	const [achievementMessage, setAchievementMessage] = useState<string>("");

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const animationRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isClient) {
			const handleResize = () => {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			};

			handleResize();

			window.addEventListener("resize", handleResize);

			return () => window.removeEventListener("resize", handleResize);
		}
	}, [isClient]);

	const notesRef = useRef({
		correct: [523.25, 659.25, 783.99, 1046.5],
		wrong: [392.0, 349.23, 293.66],
		click: [440.0, 554.37],
		countdown: [329.63, 392.0],
		levelUp: [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5],
		achievement: [659.25, 783.99, 1046.5, 1318.51, 1567.98],
		gameOver: [783.99, 698.46, 659.25, 587.33, 523.25],
	});

	useEffect(() => {
		if (isClient) {
			try {
				const savedHighScore = localStorage.getItem("palindromeHighScore");
				if (savedHighScore) {
					setStats((prev) => ({
						...prev,
						highScore: parseInt(savedHighScore, 10),
					}));
				}

				const savedTheme = localStorage.getItem("palindromeTheme");
				if (savedTheme) {
					setSettings((prev) => ({ ...prev, theme: savedTheme as Theme }));
				}

				document.body.className =
					savedTheme === Theme.DARK ? "bg-gray-900" : "bg-blue-50";
			} catch (error) {
				console.error("Error accessing localStorage:", error);
			}
		}
	}, [isClient]);

	useEffect(() => {
		if (isClient) {
			try {
				localStorage.setItem("palindromeHighScore", stats.highScore.toString());
			} catch (error) {
				console.error("Error saving to localStorage:", error);
			}
		}
	}, [stats.highScore, isClient]);

	useEffect(() => {
		if (isClient) {
			try {
				localStorage.setItem("palindromeTheme", settings.theme);

				document.body.className =
					settings.theme === Theme.DARK ? "bg-gray-900" : "bg-blue-50";
			} catch (error) {
				console.error("Error saving theme to localStorage:", error);
			}
		}
	}, [settings.theme, isClient]);

	const toggleTheme = (): void => {
		setSettings((prev) => ({
			...prev,
			theme: prev.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
		}));
	};

	const toggleSound = (): void => {
		setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
	};

	const playSound = (
		type:
			| "correct"
			| "wrong"
			| "click"
			| "countdown"
			| "levelUp"
			| "achievement"
			| "gameOver"
	): void => {
		if (!settings.soundEnabled || !isClient) return;

		try {
			const AudioContextClass =
				window.AudioContext || (window as any).webkitAudioContext;

			if (AudioContextClass) {
				const audioContext = new AudioContextClass();

				const frequencies = notesRef.current[type];
				const noteLength =
					type === "levelUp" || type === "achievement" ? 0.15 : 0.1;

				frequencies.forEach((freq: number, index: number) => {
					const oscillator = audioContext.createOscillator();
					const gainNode = audioContext.createGain();

					oscillator.type = "sine";
					oscillator.frequency.value = freq;

					gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
					gainNode.gain.exponentialRampToValueAtTime(
						0.01,
						audioContext.currentTime + noteLength
					);

					oscillator.connect(gainNode);
					gainNode.connect(audioContext.destination);

					oscillator.start(audioContext.currentTime + index * noteLength);
					oscillator.stop(audioContext.currentTime + (index + 1) * noteLength);
				});
			}
		} catch (error) {
			console.error("Error playing sound:", error);
		}
	};

	const generateRandomNumber = (): number => {
		switch (settings.level) {
			case GameLevel.EASY:
				return Math.floor(Math.random() * 90) + 10;
			case GameLevel.MEDIUM:
				return Math.floor(Math.random() * 900) + 100;
			case GameLevel.HARD:
				return Math.floor(Math.random() * 9000) + 1000;
			case GameLevel.EXPERT:
				return Math.floor(Math.random() * 90000) + 10000;
			default:
				return 0;
		}
	};

	const isPalindrome = (num: number): boolean => {
		const str = num.toString();
		const reversed = str.split("").reverse().join("");
		return str === reversed;
	};

	const findNearestPalindrome = (num: number): number => {
		let lower = num - 1;
		let higher = num + 1;

		while (true) {
			if (isPalindrome(lower)) return lower;
			if (isPalindrome(higher)) return higher;
			lower--;
			higher++;
		}
	};

	const showHint = (): void => {
		if (stats.hintsLeft <= 0 || currentNumber === null) return;
		pauseGame();
		setStats((prev) => ({ ...prev, hintsLeft: prev.hintsLeft - 1 }));

		if (gameState === GameState.QUESTION_PHASE) {
			const hint = isPalindrome(currentNumber)
				? "This number reads the same forwards and backwards!"
				: "Try comparing the first and last digits...";
			setFeedback((prev) => ({
				...prev,
				showHintModal: true,
				message: hint,
			}));
		} else if (gameState === GameState.INPUT_PHASE) {
			const correctAnswer = findNearestPalindrome(currentNumber);
			const isLower = correctAnswer < currentNumber;
			const hint = `The answer is ${
				isLower ? "less" : "greater"
			} than the original number.`;
			setFeedback((prev) => ({
				...prev,
				showHintModal: true,
				message: hint,
			}));
		}

		playSound("click");
	};

	const startGame = (): void => {
		setStats((prev) => ({
			...prev,
			score: 0,
			streak: 0,
			hintsLeft: 3,
			lives: 3,
		}));
		setSettings((prev) => ({
			...prev,
			isPracticeRound: true,
		}));
		playSound("click");
		startPracticeRound();
	};

	const startPracticeRound = (): void => {
		clearAllTimers();

		const newNumber = generateRandomNumber();
		setCurrentNumber(newNumber);
		setGameState(GameState.PRACTICE_ROUND);
		setTimers((prev) => ({ ...prev, timeLeft: 0 }));
		setFeedback((prev) => ({
			...prev,
			message: "Practice Round - Take your time",
			messageColor: "",
		}));
		setInputValue("");
	};

	const pauseGame = (): void => {
		if (gameState !== GameState.PAUSED) {
			setGameState(GameState.PAUSED);
			clearAllTimers();
			playSound("click");
		} else {
			if (settings.isPracticeRound) {
				setGameState(GameState.PRACTICE_ROUND);
			} else if (inputValue !== "") {
				setGameState(GameState.INPUT_PHASE);

				startInputTimer();
			} else {
				setGameState(GameState.QUESTION_PHASE);

				startQuestionTimer();
			}
			playSound("click");
		}
	};

	const exitGame = (): void => {
		clearAllTimers();
		playSound("gameOver");

		if (stats.score > stats.highScore) {
			setStats((prev) => ({ ...prev, highScore: prev.score }));
		}

		setGameState(GameState.GAME_OVER);
		setFeedback((prev) => ({
			...prev,
			message: `Game Over! Final Score: ${stats.score}`,
			messageColor: "",
		}));
	};

	const returnToMenu = (): void => {
		setGameState(GameState.NOT_STARTED);
		setFeedback((prev) => ({ ...prev, message: "" }));
		playSound("click");
	};

	const clearAllTimers = (): void => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};

	const startCountdown = (): void => {
		clearAllTimers();
		setGameState(GameState.COUNTDOWN);
		setTimers((prev) => ({ ...prev, countdown: 3 }));

		timerRef.current = setInterval(() => {
			setTimers((prev) => {
				const newCountdown = prev.countdown - 1;
				playSound("countdown");
				if (newCountdown <= 0) {
					if (timerRef.current) {
						clearInterval(timerRef.current);
						timerRef.current = null;
					}
					startNewRound();
					return { ...prev, countdown: 0 };
				}
				return { ...prev, countdown: newCountdown };
			});
		}, 1000);
	};

	const startInputTimer = (): void => {
		setTimers((prev) => ({ ...prev, timeLeft: 5 }));

		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		timerRef.current = setInterval(() => {
			setTimers((prev) => {
				if (prev.timeLeft <= 1) {
					if (timerRef.current) {
						clearInterval(timerRef.current);
						timerRef.current = null;
					}

					handleTimeUp();
					return { ...prev, timeLeft: 0 };
				}
				return { ...prev, timeLeft: prev.timeLeft - 1 };
			});
		}, 1000);
	};

	const startQuestionTimer = (): void => {
		const timeForQuestion =
			settings.level === GameLevel.EASY
				? 3
				: settings.level === GameLevel.MEDIUM
				? 4
				: settings.level === GameLevel.HARD
				? 5
				: 6;

		setTimers((prev) => ({ ...prev, timeLeft: timeForQuestion }));

		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		timerRef.current = setInterval(() => {
			setTimers((prev) => {
				if (prev.timeLeft <= 1) {
					if (timerRef.current) {
						clearInterval(timerRef.current);
						timerRef.current = null;
					}

					handleTimeUp();
					return { ...prev, timeLeft: 0 };
				}
				return { ...prev, timeLeft: prev.timeLeft - 1 };
			});
		}, 1000);
	};

	const startNewRound = (): void => {
		clearAllTimers();

		const newNumber = generateRandomNumber();
		setCurrentNumber(newNumber);
		setGameState(GameState.QUESTION_PHASE);
		setFeedback((prev) => ({
			...prev,
			message: "",
			messageColor: "",
		}));
		setInputValue("");

		if (stats.score >= 150 && settings.level !== GameLevel.EXPERT) {
			setSettings((prev) => ({ ...prev, level: GameLevel.EXPERT }));
			setFeedback((prev) => ({
				...prev,
				message: "Level Up! You're now in EXPERT mode!",
				messageColor: "text-purple-600",
			}));
			unlockAchievement("Expert Mode Unlocked! 🏆");
			playSound("levelUp");
		} else if (
			stats.score >= 100 &&
			settings.level !== GameLevel.HARD &&
			settings.level !== GameLevel.EXPERT
		) {
			setSettings((prev) => ({ ...prev, level: GameLevel.HARD }));
			setFeedback((prev) => ({
				...prev,
				message: "Level Up! You're now in HARD mode!",
				messageColor: "text-purple-600",
			}));
			playSound("levelUp");
		} else if (stats.score >= 50 && settings.level === GameLevel.EASY) {
			setSettings((prev) => ({ ...prev, level: GameLevel.MEDIUM }));
			setFeedback((prev) => ({
				...prev,
				message: "Level Up! You're now in MEDIUM mode!",
				messageColor: "text-purple-600",
			}));
			playSound("levelUp");
		}

		startQuestionTimer();
	};

	const unlockAchievement = (message: string): void => {
		setAchievementMessage(message);
		setShowAchievement(true);
		playSound("achievement");

		setTimeout(() => {
			setShowAchievement(false);
		}, 3000);
	};

	const triggerConfetti = (): void => {
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

	const handleTimeUp = (): void => {
		setFeedback((prev) => ({
			...prev,
			message: "Time's up! Starting with a new number.",
			messageColor: "text-red-600",
		}));
		playSound("wrong");

		timeoutRef.current = setTimeout(() => {
			console.log("Starting new round after timeout");
			startNewRound();
		}, 1500);
	};

	const handleAnswer = (isPalindromeAnswer: boolean): void => {
		clearAllTimers();

		if (currentNumber === null) return;

		const correct = isPalindrome(currentNumber) === isPalindromeAnswer;
		playSound(correct ? "correct" : "wrong");

		if (settings.isPracticeRound) {
			if (correct) {
				if (!isPalindromeAnswer) {
					setGameState(GameState.INPUT_PHASE);
					setFeedback((prev) => ({
						...prev,
						message: "Practice Round - Take your time",
						messageColor: "",
					}));

					setTimeout(() => {
						inputRef.current?.focus();
					}, 0);
				} else {
					setFeedback((prev) => ({
						...prev,
						message: "Correct! Now the real game will begin.",
						messageColor: "text-green-600",
					}));
					timeoutRef.current = setTimeout(() => {
						setSettings((prev) => ({ ...prev, isPracticeRound: false }));
						startCountdown();
					}, 1500);
				}
			} else {
				setFeedback((prev) => ({
					...prev,
					message: "That's not correct. Try again in the real game.",
					messageColor: "text-red-600",
				}));
				timeoutRef.current = setTimeout(() => {
					setSettings((prev) => ({ ...prev, isPracticeRound: false }));
					startCountdown();
				}, 1500);
			}
		} else {
			if (correct) {
				if (!isPalindromeAnswer) {
					setGameState(GameState.INPUT_PHASE);
					startInputTimer();

					setTimeout(() => {
						inputRef.current?.focus();
					}, 0);
				} else {
					const newStreak = stats.streak + 1;
					const streakBonus = newStreak % 5 === 0 ? 20 : 0;

					setStats((prev) => ({
						...prev,
						score: prev.score + 10 + streakBonus,
						streak: newStreak,
					}));

					if (newStreak % 5 === 0) {
						setFeedback((prev) => ({
							...prev,
							message: `Awesome! ${newStreak} streak! +20 points bonus!`,
							messageColor: "text-green-600",
							showConfetti: true,
						}));

						triggerConfetti();

						setTimeout(() => {
							setFeedback((prev) => ({ ...prev, showConfetti: false }));
						}, 2000);

						if (newStreak === 10) {
							unlockAchievement("10 Streak Master! 🔥");
						} else if (newStreak === 20) {
							unlockAchievement("20 Streak Legend! 🌟");
						}
					} else {
						setFeedback((prev) => ({
							...prev,
							message: "Correct! +10 points",
							messageColor: "text-green-600",
						}));
					}

					timeoutRef.current = setTimeout(() => {
						startNewRound();
					}, 1500);
				}
			} else {
				const newLives = stats.lives - 1;
				setStats((prev) => ({
					...prev,
					score: Math.max(0, prev.score - 5),
					streak: 0,
					lives: newLives,
				}));

				if (newLives <= 0) {
					setFeedback((prev) => ({
						...prev,
						message: "Wrong! Game Over!",
						messageColor: "text-red-600",
					}));
					timeoutRef.current = setTimeout(() => {
						exitGame();
					}, 1500);
				} else {
					setFeedback((prev) => ({
						...prev,
						message: `Wrong! You lost a life! Lives remaining: ${newLives}`,
						messageColor: "text-red-600",
					}));
					timeoutRef.current = setTimeout(() => {
						startNewRound();
					}, 1500);
				}
			}
		}
	};

	const handleSubmit = (): void => {
		clearAllTimers();

		if (currentNumber === null || inputValue === "") return;

		const playerAnswer = parseInt(inputValue, 10);
		const correctAnswer = findNearestPalindrome(currentNumber);
		const isCorrect = playerAnswer === correctAnswer;

		playSound(isCorrect ? "correct" : "wrong");

		if (settings.isPracticeRound) {
			if (isCorrect) {
				setFeedback((prev) => ({
					...prev,
					message: "Correct! Now the real game will begin.",
					messageColor: "text-green-600",
				}));
			} else {
				setFeedback((prev) => ({
					...prev,
					message: `That's not correct. The answer was ${correctAnswer}. Now the real game will begin.`,
					messageColor: "text-red-600",
				}));
			}

			timeoutRef.current = setTimeout(() => {
				setSettings((prev) => ({ ...prev, isPracticeRound: false }));
				startCountdown();
			}, 2000);
		} else {
			if (isCorrect) {
				const newStreak = stats.streak + 1;
				const streakBonus = newStreak % 5 === 0 ? 20 : 0;

				setStats((prev) => ({
					...prev,
					score: prev.score + 10 + streakBonus,
					streak: newStreak,
				}));

				if (newStreak % 5 === 0) {
					setFeedback((prev) => ({
						...prev,
						message: `Awesome! ${newStreak} streak! +20 points bonus!`,
						messageColor: "text-green-600",
						showConfetti: true,
					}));

					triggerConfetti();

					setTimeout(() => {
						setFeedback((prev) => ({ ...prev, showConfetti: false }));
					}, 2000);

					if (newStreak === 10) {
						unlockAchievement("10 Streak Master! 🔥");
					} else if (newStreak === 20) {
						unlockAchievement("20 Streak Legend! 🌟");
					}
				} else {
					setFeedback((prev) => ({
						...prev,
						message: "Correct! +10 points",
						messageColor: "text-green-600",
					}));
				}
				timeoutRef.current = setTimeout(() => {
					startNewRound();
				}, 1500);
			} else {
				const newLives = stats.lives - 1;
				setStats((prev) => ({
					...prev,
					score: Math.max(0, prev.score - 5),
					streak: 0,
					lives: newLives,
				}));

				if (newLives <= 0) {
					setFeedback((prev) => ({
						...prev,
						message: `Wrong! The correct answer was ${correctAnswer}. Game Over!`,
						messageColor: "text-red-600",
					}));
					timeoutRef.current = setTimeout(() => {
						exitGame();
					}, 1500);
				} else {
					setFeedback((prev) => ({
						...prev,
						message: `Wrong! The correct answer was ${correctAnswer}. Lives remaining: ${newLives}`,
						messageColor: "text-red-600",
					}));
					timeoutRef.current = setTimeout(() => {
						startNewRound();
					}, 1500);
				}
			}
		}
	};

	useEffect(() => {
		return () => {
			clearAllTimers();
		};
	}, []);

	const getThemeClasses = () => {
		if (settings.theme === Theme.DARK) {
			return {
				background: "bg-gradient-to-br from-gray-900 to-indigo-950",
				container:
					"bg-gray-800/90 backdrop-blur-md border border-indigo-900 shadow-lg shadow-indigo-900/20",
				text: "text-white",
				secondaryText: "text-gray-300",
				button:
					"bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20",
				buttonSecondary:
					"bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-800/20 text-white",
				input:
					"bg-gray-700 border-indigo-600 text-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent",
				timer: "text-pink-400 font-medium",
				practiceText: "text-blue-300",
				messageText: "text-green-300",
				levelButton: "bg-gray-700 text-gray-300 hover:bg-gray-600",
				selectedLevel:
					"bg-indigo-500 text-white shadow-lg shadow-indigo-600/20",
				controlButton: "bg-gray-700 hover:bg-gray-600 text-white",
				modal: "bg-gray-800 border border-indigo-900 text-white",
				navLink: "text-gray-400 hover:text-white transition-colors",
				statsBadge:
					"bg-gray-700 text-white px-3 py-1 rounded-full flex items-center gap-1",
				statsBadgeHighlight:
					"bg-indigo-700 text-white px-3 py-1 rounded-full flex items-center gap-1",
				accentGradient:
					"bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500",
				lifeIcon: "text-red-500",
			};
		}

		return {
			background: "bg-gradient-to-br from-blue-50 to-indigo-100",
			container:
				"bg-white/80 backdrop-blur-md shadow-xl border border-indigo-100",
			text: "text-gray-800",
			secondaryText: "text-gray-600",
			button:
				"bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-300/30",
			buttonSecondary:
				"bg-gray-200 hover:bg-gray-300 shadow-lg shadow-gray-300/20",
			input:
				"bg-white border-indigo-300 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-transparent",
			timer: "text-pink-600 font-medium",
			practiceText: "text-blue-600",
			messageText: "text-green-600",
			levelButton: "bg-gray-200 text-gray-700 hover:bg-gray-300",
			selectedLevel: "bg-indigo-500 text-white shadow-lg shadow-indigo-300/30",
			controlButton: "bg-gray-200 hover:bg-gray-300 text-gray-800",
			modal: "bg-white border border-gray-300 text-gray-800",
			navLink: "text-gray-600 hover:text-gray-900 transition-colors",
			statsBadge:
				"bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center gap-1",
			statsBadgeHighlight:
				"bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-1",
			accentGradient:
				"bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500",
			lifeIcon: "text-red-500",
		};
	};

	const themeClasses = getThemeClasses();

	const renderLives = (): JSX.Element => {
		return (
			<div className="flex">
				{Array.from({ length: 3 }).map((_, i) => (
					<motion.div
						key={i}
						initial={
							i < stats.lives ? { scale: 1 } : { scale: 0.7, opacity: 0.3 }
						}
						animate={
							i < stats.lives
								? { scale: 1, opacity: 1 }
								: { scale: 0.7, opacity: 0.3 }
						}
						transition={{ duration: 0.3 }}
					>
						<Heart
							size={20}
							className={
								i < stats.lives ? themeClasses.lifeIcon : "text-gray-500"
							}
							fill={i < stats.lives ? "currentColor" : "none"}
						/>
					</motion.div>
				))}
			</div>
		);
	};

	const getNumberGradient = (num: number | null): string => {
		if (num === null) return "";

		const digits = num.toString().length;

		if (digits <= 2) {
			return "from-blue-500 to-indigo-500";
		} else if (digits === 3) {
			return "from-indigo-500 to-purple-500";
		} else if (digits === 4) {
			return "from-purple-500 to-pink-500";
		} else {
			return "from-pink-500 to-rose-500";
		}
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
			className={`flex justify-center items-center min-h-screen ${themeClasses.background} px-4 py-8 font-sans relative overflow-hidden`}
			ref={animationRef}
		>
			{}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{isClient &&
					Array.from({ length: 20 }).map((_, i) => {
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
						className="fixed top-5 inset-x-0 z-50 flex justify-center"
					>
						<div
							className={`${themeClasses.accentGradient} text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2`}
						>
							<Trophy size={24} className="text-yellow-300" />
							<span className="font-bold text-lg">{achievementMessage}</span>
							<Sparkles size={20} className="text-yellow-300" />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{feedback.showHintModal && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
					>
						<div
							className={`${themeClasses.modal} max-w-md p-6 rounded-xl shadow-2xl`}
						>
							<h3 className="text-xl font-bold mb-3 flex items-center gap-2">
								<HelpingHand size={24} className="text-indigo-400" />
								Hint
							</h3>
							<p className="text-lg mb-5">{feedback.message}</p>
							<motion.button
								className={`w-full py-3 ${themeClasses.button} text-white rounded-lg font-medium transition-all cursor-pointer hover:scale-105`}
								onClick={() => {
									setFeedback((prev) => ({ ...prev, showHintModal: false }));
									playSound("click");
								}}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Got it!
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
				className={`w-full max-w-2xl p-6 sm:p-8 ${themeClasses.container} rounded-2xl text-center relative overflow-hidden`}
			>
				{}
				<div className="absolute right-4 top-4 flex gap-2">
					<motion.button
						className={`p-2 rounded-full ${
							settings.theme === Theme.DARK ? "bg-gray-700" : "bg-gray-200"
						} transition-all cursor-pointer`}
						onClick={toggleTheme}
						aria-label="Toggle theme"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						{settings.theme === Theme.DARK ? (
							<Sun size={20} className="text-yellow-300" />
						) : (
							<Moon size={20} className="text-gray-600" />
						)}
					</motion.button>

					<motion.button
						className={`p-2 rounded-full ${
							settings.theme === Theme.DARK ? "bg-gray-700" : "bg-gray-200"
						} transition-all cursor-pointer`}
						onClick={toggleSound}
						aria-label="Toggle sound"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						{settings.soundEnabled ? (
							<Volume2
								size={20}
								className={
									settings.theme === Theme.DARK
										? "text-green-300"
										: "text-green-600"
								}
							/>
						) : (
							<VolumeX
								size={20}
								className={
									settings.theme === Theme.DARK
										? "text-red-300"
										: "text-red-500"
								}
							/>
						)}
					</motion.button>
				</div>

				{}
				<motion.div
					className="flex flex-col items-center justify-center mb-6"
					initial={{ y: -20 }}
					animate={{ y: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 20 }}
				>
					<div className="relative mb-2">
						<Brain
							size={48}
							className={`text-indigo-500 ${
								settings.theme === Theme.DARK ? "drop-shadow-glow" : ""
							}`}
						/>
						<motion.div
							className="absolute -inset-1 rounded-full opacity-70"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.7, 0.3],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatType: "mirror",
							}}
						>
							<div
								className={`absolute inset-0 ${themeClasses.accentGradient} rounded-full blur-md`}
							></div>
						</motion.div>
					</div>

					<h1
						className={`font-bold text-3xl sm:text-4xl ${themeClasses.text} drop-shadow-lg`}
					>
						<span
							className={`${themeClasses.accentGradient} text-transparent bg-clip-text`}
						>
							Palindrome
						</span>{" "}
						<span>Brain Game</span>
					</h1>

					<p
						className={`${themeClasses.secondaryText} text-sm sm:text-base mt-1`}
					>
						Test your skills with palindrome numbers!
					</p>
				</motion.div>

				{}
				{gameState !== GameState.NOT_STARTED &&
					gameState !== GameState.GAME_OVER && (
						<div className="flex justify-between mb-6 items-center px-2">
							<motion.div
								className="flex gap-1"
								key={stats.lives}
								animate={{ x: [2, -2, 2], transition: { duration: 0.3 } }}
							>
								{renderLives()}
							</motion.div>

							<div className="flex gap-3">
								<motion.div
									className={
										stats.streak > 0
											? themeClasses.statsBadgeHighlight
											: themeClasses.statsBadge
									}
									key={stats.streak}
									animate={
										stats.streak > 0
											? {
													scale: [1, 1.1, 1],
													transition: { duration: 0.3 },
											  }
											: {}
									}
								>
									<Zap
										size={16}
										className={stats.streak > 0 ? "text-indigo-500" : ""}
									/>
									<span>{stats.streak}</span>
								</motion.div>

								<motion.div
									className={themeClasses.statsBadge}
									key={stats.score}
									animate={{
										scale: [1, 1.1, 1],
										transition: { duration: 0.3 },
									}}
								>
									<Award size={16} />
									<span>{stats.score}</span>
								</motion.div>
							</div>
						</div>
					)}

				{}
				{gameState === GameState.NOT_STARTED && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="flex flex-col items-center"
					>
						<div className="flex items-center gap-2 mb-4">
							<h2 className={`text-xl ${themeClasses.text}`}>
								Select Difficulty
							</h2>
							<Sparkles size={18} className="text-yellow-400" />
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 w-full">
							{Object.values(GameLevel).map((lvl) => (
								<motion.button
									key={lvl}
									className={`py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer ${
										settings.level === lvl
											? themeClasses.selectedLevel
											: themeClasses.levelButton
									}`}
									onClick={() => {
										setSettings((prev) => ({
											...prev,
											level: lvl as GameLevel,
										}));
										playSound("click");
									}}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{lvl}
								</motion.button>
							))}
						</div>

						<div
							className={`text-sm mb-6 ${
								themeClasses.secondaryText
							} max-w-md px-4 py-3 rounded-lg ${
								settings.theme === Theme.DARK
									? "bg-gray-900/50"
									: "bg-indigo-50"
							}`}
						>
							<p className="mb-1">
								<strong>Easy:</strong> 2-digit numbers (10-99)
							</p>
							<p className="mb-1">
								<strong>Medium:</strong> 3-digit numbers (100-999)
							</p>
							<p className="mb-1">
								<strong>Hard:</strong> 4-digit numbers (1000-9999)
							</p>
							<p>
								<strong>Expert:</strong> 5-digit numbers (10000-99999)
							</p>
						</div>

						<motion.button
							className={`py-3 px-8 ${themeClasses.button} text-white text-lg rounded-xl font-bold transition-transform cursor-pointer flex items-center gap-2`}
							onClick={startGame}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span>Start Game</span>
							<ArrowRight size={18} />
						</motion.button>

						{}
						{stats.highScore > 0 && (
							<motion.div
								className="mt-6 flex items-center gap-2"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
							>
								<Trophy size={20} className="text-yellow-500" />
								<span className={`${themeClasses.text} font-medium`}>
									High Score: {stats.highScore}
								</span>
							</motion.div>
						)}
					</motion.div>
				)}

				{}
				{gameState === GameState.COUNTDOWN && (
					<motion.div
						className="flex flex-col items-center justify-center py-10"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							key={timers.countdown}
							initial={{ scale: 2, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0, opacity: 0 }}
							transition={{ duration: 0.5 }}
							className={`text-6xl font-bold ${themeClasses.accentGradient} text-transparent bg-clip-text mb-4`}
						>
							{timers.countdown}
						</motion.div>
						<p
							className={`text-xl ${themeClasses.text} flex items-center gap-2`}
						>
							<Rocket size={20} className="text-indigo-400" />
							Get ready!
						</p>
					</motion.div>
				)}

				{}
				{(gameState === GameState.PRACTICE_ROUND ||
					gameState === GameState.QUESTION_PHASE ||
					gameState === GameState.INPUT_PHASE ||
					gameState === GameState.PAUSED) && (
					<div className="game-area">
						{}
						<div className="flex justify-center gap-3 mb-4">
							<motion.button
								className={`p-2 rounded-full ${themeClasses.controlButton} cursor-pointer transition-transform`}
								onClick={pauseGame}
								aria-label="Pause/Resume Game"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<Clock size={20} />
							</motion.button>

							<motion.button
								className={`p-2 rounded-full ${
									themeClasses.controlButton
								} cursor-pointer transition-transform ${
									stats.hintsLeft === 0 ? "opacity-50 cursor-not-allowed" : ""
								}`}
								onClick={showHint}
								disabled={stats.hintsLeft === 0}
								aria-label="Use Hint"
								whileHover={stats.hintsLeft > 0 ? { scale: 1.1 } : {}}
								whileTap={stats.hintsLeft > 0 ? { scale: 0.9 } : {}}
							>
								<HelpingHand size={20} />
							</motion.button>
						</div>

						{}
						{gameState === GameState.PAUSED && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-10"
							>
								<h2 className="text-3xl font-bold text-white mb-6">PAUSED</h2>
								<div className="flex flex-col sm:flex-row gap-4">
									<motion.button
										className="py-2 px-6 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all cursor-pointer"
										onClick={pauseGame}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Resume
									</motion.button>
									<motion.button
										className="py-2 px-6 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all cursor-pointer"
										onClick={returnToMenu}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Main Menu
									</motion.button>
									<motion.button
										className="py-2 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all cursor-pointer"
										onClick={exitGame}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Exit Game
									</motion.button>
								</div>
							</motion.div>
						)}

						{gameState !== GameState.PAUSED && (
							<>
								<div className="flex justify-between items-center mb-2 text-sm">
									<div className={`${themeClasses.secondaryText}`}>
										Level:{" "}
										<span className="font-semibold">{settings.level}</span>
									</div>
									<div
										className={`${themeClasses.secondaryText} flex items-center gap-1`}
									>
										Hints:{" "}
										{Array(stats.hintsLeft)
											.fill(0)
											.map((_, i) => (
												<motion.span
													key={i}
													className="inline-block"
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													transition={{ delay: i * 0.1 }}
												>
													💡
												</motion.span>
											))}
									</div>
								</div>

								{}
								<motion.div
									initial={{ scale: 0.5, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									key={currentNumber}
									className={`text-5xl sm:text-6xl font-bold mt-2 mb-4 bg-gradient-to-r ${getNumberGradient(
										currentNumber
									)} text-transparent bg-clip-text`}
								>
									{currentNumber}
								</motion.div>

								{settings.isPracticeRound ? (
									<div
										className={`text-lg font-medium ${themeClasses.practiceText} mb-4 px-3 py-1 rounded-full bg-blue-500/10 inline-block`}
									>
										Practice Round - No Time Limit
									</div>
								) : (
									<motion.div
										key={timers.timeLeft}
										animate={{
											scale: timers.timeLeft <= 2 ? [1, 1.2, 1] : 1,
											color: timers.timeLeft <= 2 ? "#ef4444" : "",
										}}
										transition={{ duration: 0.3 }}
										className={`text-lg font-medium ${
											timers.timeLeft <= 2
												? "text-red-500 font-bold"
												: themeClasses.timer
										} mb-4 px-3 py-1 rounded-full ${
											settings.theme === Theme.DARK
												? "bg-pink-500/10"
												: "bg-pink-100"
										} inline-block`}
									>
										Time left: {timers.timeLeft}s
									</motion.div>
								)}

								{(gameState === GameState.PRACTICE_ROUND ||
									gameState === GameState.QUESTION_PHASE) && (
									<div>
										<div
											className={`text-lg mb-4 ${themeClasses.text} font-semibold`}
										>
											Is this number a palindrome?
										</div>
										<div className="flex justify-center gap-4">
											<motion.button
												className={`py-3 px-8 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all cursor-pointer shadow-lg flex items-center gap-2`}
												onClick={() => handleAnswer(true)}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<span>Yes</span>
											</motion.button>
											<motion.button
												className={`py-3 px-8 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all cursor-pointer shadow-lg flex items-center gap-2`}
												onClick={() => handleAnswer(false)}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<span>No</span>
											</motion.button>
										</div>
									</div>
								)}

								{gameState === GameState.INPUT_PHASE && (
									<div>
										<div
											className={`text-lg mb-4 ${themeClasses.text} font-semibold`}
										>
											What is the nearest palindrome?
										</div>
										<div className="flex justify-center items-center">
											<input
												type="number"
												value={inputValue}
												onChange={(e) => setInputValue(e.target.value)}
												className={`py-3 px-4 text-xl w-32 text-center border-2 rounded-lg mr-2 ${themeClasses.input}`}
												autoFocus
												ref={inputRef}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSubmit();
													}
												}}
											/>
											<motion.button
												className={`py-3 px-4 ${themeClasses.button} text-white rounded-lg font-medium transition-all cursor-pointer shadow-lg`}
												onClick={handleSubmit}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												Submit
											</motion.button>
										</div>
									</div>
								)}

								{feedback.message && !feedback.showHintModal && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className={`mt-6 px-4 py-3 rounded-xl text-center font-semibold ${
											feedback.messageColor === "text-green-600"
												? "text-white bg-green-600"
												: feedback.messageColor === "text-red-600"
												? "text-white bg-red-600"
												: feedback.messageColor === "text-purple-600"
												? "text-white bg-purple-600"
												: `${
														settings.theme === Theme.DARK
															? "bg-gray-600 text-white"
															: "bg-gray-200 text-black"
												  }`
										}`}
									>
										{feedback.message}
									</motion.div>
								)}

								<motion.button
									className={`mt-6 py-2 px-6 ${themeClasses.buttonSecondary} text-sm rounded-lg font-medium transition-all cursor-pointer shadow-md`}
									onClick={exitGame}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Exit Game
								</motion.button>
							</>
						)}
					</div>
				)}

				{}
				{gameState === GameState.GAME_OVER && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="py-4"
					>
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 15,
							}}
							className="flex justify-center mb-6"
						>
							<div
								className={`relative inline-block ${themeClasses.accentGradient} p-6 rounded-full`}
							>
								<Trophy size={60} className="text-yellow-300" />
								<motion.div
									className="absolute inset-0 rounded-full opacity-70"
									animate={{
										scale: [1, 1.2, 1],
										opacity: [0.3, 0.7, 0.3],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										repeatType: "mirror",
									}}
								>
									<div
										className={`absolute inset-0 ${themeClasses.accentGradient} rounded-full blur-md`}
									></div>
								</motion.div>
							</div>
						</motion.div>

						<div
							className={`text-4xl font-bold my-4 ${themeClasses.accentGradient} text-transparent bg-clip-text`}
						>
							Game Over!
						</div>

						<div className={`text-2xl mb-2 ${themeClasses.text}`}>
							Final Score: {stats.score}
						</div>

						<div
							className={`${themeClasses.secondaryText} mb-6 max-w-md mx-auto`}
						>
							{stats.score > stats.highScore - 10
								? "Amazing job! That's a top score! 🏆"
								: stats.score > 50
								? "Great job! Keep practicing to beat your high score! 🌟"
								: "Good effort! Keep playing to improve your score! 👍"}
						</div>

						<div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
							<motion.button
								className={`py-3 px-6 ${themeClasses.button} text-white rounded-xl font-medium transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2`}
								onClick={startGame}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Rocket size={18} />
								<span>Play Again</span>
							</motion.button>

							<motion.button
								className={`py-3 px-6 ${themeClasses.buttonSecondary} rounded-xl font-medium transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2`}
								onClick={returnToMenu}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Home size={18} />
								<span>Return to Menu</span>
							</motion.button>
						</div>
					</motion.div>
				)}

				{}
				{gameState === GameState.NOT_STARTED && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className={`mt-6 p-5 rounded-xl text-sm ${
							themeClasses.secondaryText
						} border ${
							settings.theme === Theme.DARK
								? "border-gray-700"
								: "border-gray-300"
						} ${
							settings.theme === Theme.DARK
								? "bg-gray-900/50"
								: "bg-indigo-50/50"
						}`}
					>
						<h3
							className={`text-lg font-bold mb-2 ${themeClasses.text} flex items-center gap-2`}
						>
							<Brain size={18} className="text-indigo-400" />
							How to Play:
						</h3>
						<ul className="text-left space-y-2">
							<li className="flex items-start gap-2">
								<span className="text-indigo-400 mt-1">•</span>A palindrome is a
								number that reads the same backward as forward (e.g., 121, 1001)
							</li>
							<li className="flex items-start gap-2">
								<span className="text-indigo-400 mt-1">•</span>
								Identify if a number is a palindrome
							</li>
							<li className="flex items-start gap-2">
								<span className="text-indigo-400 mt-1">•</span>
								If it's not a palindrome, find the nearest palindrome number
							</li>
							<li className="flex items-start gap-2">
								<span className="text-indigo-400 mt-1">•</span>
								Score +10 points for correct answers
							</li>
							<li className="flex items-start gap-2">
								<span className="text-indigo-400 mt-1">•</span>
								Get bonus points for answer streaks!
							</li>
							<li className="flex items-start gap-2">
								<span className="text-indigo-400 mt-1">•</span>
								You have 3 lives and 3 hints per game - use them wisely!
							</li>
						</ul>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

export default PalindromeGame;
