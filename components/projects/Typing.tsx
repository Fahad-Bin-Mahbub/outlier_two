"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdRefresh } from "react-icons/io";
import {
	FiClock,
	FiSettings,
	FiAward,
	FiVolume2,
	FiVolumeX,
} from "react-icons/fi";
import { FaCheck, FaTimes, FaChartLine, FaKeyboard } from "react-icons/fa";
import { BiChevronDown } from "react-icons/bi";
import { BsSun, BsMoon } from "react-icons/bs";

type Difficulty = "easy" | "medium" | "hard" | "custom";

interface Score {
	wpm: number;
	acc: number;
	dt: string;
}

interface GameState {
	txt: string;
	start: number;
	done: boolean;
	timeElapsed: number;
	id: string;
}

interface ScoreMap {
	[key: string]: Score[];
}

interface UserSettings {
	theme: "light" | "dark";
	soundEnabled: boolean;
	timerEnabled: boolean;
	timerLength: number;
}

const keyPressSound = () => {
	if (typeof window !== "undefined") {
		const audio = new Audio(
			"https://www.myinstants.com/media/sounds/typewriter.mp3"
		);
		audio.volume = 0.2;
		return audio;
	}
	return null;
};

const successSound = () => {
	if (typeof window !== "undefined") {
		const audio = new Audio(
			"https://www.myinstants.com/media/sounds/applepay.mp3"
		);
		audio.volume = 0.5;
		return audio;
	}
	return null;
};

const errorSound = () => {
	if (typeof window !== "undefined") {
		const audio = new Audio(
			"https://www.myinstants.com/media/sounds/typing-error.mp3"
		);
		audio.volume = 0.3;
		return audio;
	}
	return null;
};

const sentences = {
	easy: [
		"The quick fox jumps high.",
		"Sun shines on the hill.",
		"Cats sleep all day long.",
		"Birds sing in the trees.",
		"She walks to the store.",
		"They play in the park.",
		"We read books at night.",
		"The car drives down the road.",
		"Flowers bloom in spring.",
		"He writes with a pen.",
	],
	medium: [
		"The moon lights up the dark night sky.",
		"A dog chases its tail in the park.",
		"Rain falls gently on the quiet town.",
		"Stars twinkle above the calm valley.",
		"The chef prepares a delicious meal.",
		"Students study hard for their exams.",
		"Autumn leaves fall from the tall trees.",
		"The artist paints a beautiful landscape.",
		"Children build sandcastles at the beach.",
		"The musician plays a lovely melody.",
	],
	hard: [
		"The old library holds ancient secrets in its dusty tomes.",
		"A brave knight ventures into the enchanted forest alone.",
		"Waves crash against the rocky shore under a stormy sky.",
		"The scientist discovers a new species in the deep ocean.",
		"Mountaineers carefully navigate the treacherous snowy peaks.",
		"The detective solved the mysterious case with a surprising twist.",
		"Archaeologists excavate artifacts from an ancient civilization.",
		"Programmers collaborate to develop innovative software solutions.",
		"The astronomer observed a distant galaxy through the telescope.",
		"Philosophers debate complex ethical questions throughout history.",
	],
	custom: [] as string[],
};

const calculateStats = (
	text: string,
	input: string,
	timeInSeconds: number
): { wpm: number; acc: number; cpm: number } => {
	const words = text.length / 5;
	const timeInMinutes = timeInSeconds / 60;
	const wpm = Math.round(words / timeInMinutes) || 0;
	const correctChars = text
		.split("")
		.filter((c, i) => i < input.length && c === input[i]).length;
	const acc =
		text.length > 0 ? Math.round((correctChars / text.length) * 100) : 0;
	const cpm = Math.round(correctChars / timeInMinutes || 0);

	return { wpm, acc, cpm };
};

const getRandomSentence = (diff: Difficulty): string => {
	const pool = sentences[diff];
	return pool[Math.floor(Math.random() * pool.length)];
};

const DifficultySelector = ({
	difficulty,
	setDifficulty,
	customText,
	setCustomText,
	isDarkMode,
}: {
	difficulty: Difficulty;
	setDifficulty: (diff: Difficulty) => void;
	customText: string;
	setCustomText: (text: string) => void;
	isDarkMode: boolean;
}) => {
	const [showCustom, setShowCustom] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`${
				isDarkMode ? "bg-gray-800" : "bg-white"
			} rounded-lg shadow-lg p-6 mb-6`}
		>
			<h2
				className={`text-2xl font-bold mb-4 ${
					isDarkMode ? "text-white" : "text-gray-900"
				} flex items-center`}
			>
				<FaKeyboard className="mr-2" />
				Difficulty
			</h2>
			<div className="flex flex-wrap gap-2 mb-4">
				{["easy", "medium", "hard", "custom"].map((d) => (
					<button
						key={d}
						onClick={() => {
							setDifficulty(d as Difficulty);
							if (d === "custom") setShowCustom(true);
						}}
						className={`px-4 py-2 rounded-lg capitalize flex items-center cursor-pointer
              ${
								difficulty === d
									? "bg-blue-600 text-white"
									: `${
											isDarkMode
												? "bg-gray-700 text-white"
												: "bg-gray-200 text-gray-900"
									  }`
							} 
              hover:bg-blue-500 hover:text-white transition-colors`}
						aria-label={`Select ${d} difficulty`}
					>
						{d}
						{difficulty === d && <FaCheck className="ml-2" size={12} />}
					</button>
				))}
			</div>

			<AnimatePresence>
				{showCustom && difficulty === "custom" && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden"
					>
						<textarea
							value={customText}
							onChange={(e) => setCustomText(e.target.value)}
							placeholder="Enter your custom text to type..."
							className={`w-full p-3 border ${
								isDarkMode
									? "border-gray-600 bg-gray-700 text-white"
									: "border-gray-300 bg-white text-gray-900"
							} rounded-lg focus:ring-2 focus:ring-blue-600`}
							rows={3}
						/>
						<p
							className={`text-sm ${
								isDarkMode ? "text-gray-400" : "text-gray-500"
							} mt-1`}
						>
							Custom text will be used for your typing test.
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

const TypingArea = ({
	game,
	input,
	setInput,
	retry,
	settings,
	updateGameState,
	isDarkMode,
}: {
	game: GameState;
	input: string;
	setInput: (val: string) => void;
	retry: () => void;
	settings: UserSettings;
	updateGameState: (updates: Partial<GameState>) => void;
	isDarkMode: boolean;
}) => {
	const [lastKeyCorrect, setLastKeyCorrect] = useState<boolean | null>(null);
	const [showStats, setShowStats] = useState(false);

	const timeInSeconds = game.start
		? (game.timeElapsed || Date.now() - game.start) / 1000
		: 0;

	const { wpm, acc, cpm } = useMemo(
		() => calculateStats(game.txt, input, timeInSeconds || 0.1),
		[game.txt, input, timeInSeconds]
	);

	const type = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.target.value;
			const wasCorrect =
				val.length > 0 &&
				val.length <= game.txt.length &&
				game.txt[val.length - 1] === val[val.length - 1];

			if (settings.soundEnabled) {
				if (val.length > input.length) {
					if (wasCorrect) {
						keyPressSound()?.play();
					} else {
						errorSound()?.play();
					}
				}
			}

			setLastKeyCorrect(wasCorrect);
			setInput(val);

			if (!game.start && val.length > 0) {
				const startTime = Date.now();
				updateGameState({ start: startTime });
			}

			if (val === game.txt && !game.done) {
				const endTime = Date.now();
				const elapsedTime = game.start ? endTime - game.start : 0;

				if (settings.soundEnabled) {
					successSound()?.play();
				}

				updateGameState({
					done: true,
					timeElapsed: elapsedTime,
				});

				setShowStats(true);
			}
		},
		[game, input, setInput, settings.soundEnabled, updateGameState]
	);

	const renderTxt = useCallback(() => {
		return game.txt.split("").map((c, i) => {
			const typed = input[i];
			const color = typed
				? typed === c
					? isDarkMode
						? "text-green-400"
						: "text-green-600"
					: isDarkMode
					? "text-red-400"
					: "text-red-600"
				: isDarkMode
				? "text-gray-400"
				: "text-gray-600";
			return (
				<span key={i} className={color}>
					{c}
				</span>
			);
		});
	}, [game.txt, input, isDarkMode]);

	const progress = Math.min(
		Math.round((input.length / game.txt.length) * 100),
		100
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`${
				isDarkMode ? "bg-gray-800" : "bg-white"
			} rounded-lg shadow-lg p-6 mb-6`}
		>
			<h2
				className={`text-2xl font-bold mb-4 ${
					isDarkMode ? "text-white" : "text-gray-900"
				} flex items-center`}
			>
				<BiChevronDown className="mr-2" />
				Type This
			</h2>

			<div
				className={`w-full h-2 ${
					isDarkMode ? "bg-gray-700" : "bg-gray-200"
				} rounded-full mb-4`}
			>
				<div
					className="h-2 bg-green-500 rounded-full transition-all duration-200"
					style={{ width: `${progress}%` }}
				></div>
			</div>

			<div
				className={`flex justify-between mb-4 text-sm ${
					isDarkMode ? "text-gray-400" : "text-gray-600"
				}`}
			>
				<div className="flex items-center">
					<FiClock className="mr-1" />
					{timeInSeconds.toFixed(1)}s
				</div>
				<div className="flex items-center">
					<span className="font-mono">{wpm}</span> WPM
				</div>
				<div className="flex items-center">
					<span className="font-mono">{acc}%</span> Accuracy
				</div>
			</div>

			<div
				className={`p-4 ${
					isDarkMode ? "bg-gray-900" : "bg-gray-100"
				} rounded-lg mb-4`}
			>
				<p className="text-lg font-mono mb-2 leading-relaxed">{renderTxt()}</p>
				<AnimatePresence>
					{lastKeyCorrect !== null && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className={`text-sm ${
								lastKeyCorrect ? "text-green-600" : "text-red-600"
							}`}
						>
							{lastKeyCorrect ? (
								<span className="flex items-center">
									<FaCheck className="mr-1" /> Correct
								</span>
							) : (
								<span className="flex items-center">
									<FaTimes className="mr-1" /> Typo
								</span>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<input
				type="text"
				value={input}
				onChange={type}
				disabled={game.done}
				placeholder="Start typing..."
				className={`w-full p-3 border ${
					isDarkMode
						? "border-gray-600 bg-gray-700 text-white disabled:bg-gray-600"
						: "border-gray-300 bg-white text-gray-900 disabled:bg-gray-200"
				} rounded-lg text-lg font-mono focus:ring-2 focus:ring-blue-600`}
				aria-label="Typing input"
				autoFocus
			/>

			<AnimatePresence>
				{game.done && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className="mt-4 overflow-hidden"
					>
						<div
							className={`${
								isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
							} p-4 rounded-lg`}
						>
							<h3
								className={`text-xl font-bold ${
									isDarkMode ? "text-blue-300" : "text-blue-900"
								} mb-2`}
							>
								Results
							</h3>
							<div className="grid grid-cols-3 gap-4">
								<div
									className={`${
										isDarkMode ? "bg-gray-800" : "bg-white"
									} p-3 rounded-lg shadow text-center`}
								>
									<p
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Speed
									</p>
									<p
										className={`text-2xl font-bold ${
											isDarkMode ? "text-blue-400" : "text-blue-600"
										}`}
									>
										{wpm} WPM
									</p>
								</div>
								<div
									className={`${
										isDarkMode ? "bg-gray-800" : "bg-white"
									} p-3 rounded-lg shadow text-center`}
								>
									<p
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Accuracy
									</p>
									<p
										className={`text-2xl font-bold ${
											isDarkMode ? "text-green-400" : "text-green-600"
										}`}
									>
										{acc}%
									</p>
								</div>
								<div
									className={`${
										isDarkMode ? "bg-gray-800" : "bg-white"
									} p-3 rounded-lg shadow text-center`}
								>
									<p
										className={`text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Time
									</p>
									<p
										className={`text-2xl font-bold ${
											isDarkMode ? "text-purple-400" : "text-purple-600"
										}`}
									>
										{timeInSeconds.toFixed(1)}s
									</p>
								</div>
							</div>
							<button
								onClick={retry}
								className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-transform cursor-pointer"
								aria-label="Retry"
							>
								<IoMdRefresh className="w-5 h-5" />
								Try Again
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

const ScoreBoard = ({
	scores,
	difficulty,
	isDarkMode,
}: {
	scores: ScoreMap;
	difficulty: Difficulty;
	isDarkMode: boolean;
}) => {
	const currentScores = scores[difficulty] || [];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`${
				isDarkMode ? "bg-gray-800" : "bg-white"
			} rounded-lg shadow-lg p-6`}
		>
			<h2
				className={`text-2xl font-bold mb-4 ${
					isDarkMode ? "text-white" : "text-gray-900"
				} flex items-center`}
			>
				<FiAward className="mr-2" />
				High Scores ({difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
			</h2>
			{currentScores.length === 0 ? (
				<div
					className={`${
						isDarkMode ? "bg-gray-900" : "bg-gray-100"
					} rounded-lg p-6 text-center`}
				>
					<p
						className={`text-lg ${
							isDarkMode ? "text-gray-400" : "text-gray-600"
						}`}
					>
						No high scores yet. Play to set one!
					</p>
					<FaChartLine
						className={`mx-auto mt-2 ${
							isDarkMode ? "text-gray-600" : "text-gray-400"
						}`}
						size={36}
					/>
				</div>
			) : (
				<div className="overflow-hidden rounded-lg">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
							<tr>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									Rank
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									WPM
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									Accuracy
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium ${
										isDarkMode ? "text-gray-400" : "text-gray-500"
									} uppercase tracking-wider`}
								>
									Date
								</th>
							</tr>
						</thead>
						<tbody
							className={`${isDarkMode ? "bg-gray-800" : "bg-white"} divide-y ${
								isDarkMode ? "divide-gray-700" : "divide-gray-200"
							}`}
						>
							{currentScores.map((s, i) => (
								<tr
									key={i}
									className={
										i === 0
											? isDarkMode
												? "bg-yellow-900/20"
												: "bg-yellow-50"
											: ""
									}
								>
									<td
										className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										{i + 1}
										{i === 0 && "🏆"}
									</td>
									<td
										className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
											isDarkMode ? "text-blue-400" : "text-blue-600"
										}`}
									>
										{s.wpm}
									</td>
									<td
										className={`px-6 py-4 whitespace-nowrap text-sm ${
											isDarkMode ? "text-white" : "text-gray-900"
										}`}
									>
										{s.acc}%
									</td>
									<td
										className={`px-6 py-4 whitespace-nowrap text-sm ${
											isDarkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										{s.dt}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</motion.div>
	);
};

const Settings = ({
	settings,
	setSettings,
	isDarkMode,
}: {
	settings: UserSettings;
	setSettings: (settings: UserSettings) => void;
	isDarkMode: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="fixed top-4 right-4 z-10">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`${
					isDarkMode
						? "bg-gray-800 text-gray-300 hover:text-blue-400"
						: "bg-white text-gray-600 hover:text-blue-600"
				} p-2 rounded-full shadow-lg transition-colors cursor-pointer `}
				aria-label="Settings"
			>
				<FiSettings size={20} />
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 10 }}
						className={`absolute right-0 mt-2 w-64 ${
							isDarkMode ? "bg-gray-800" : "bg-white"
						} rounded-lg shadow-xl p-4`}
					>
						<h3
							className={`text-lg font-bold mb-3 ${
								isDarkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Settings
						</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Theme
								</span>
								<button
									onClick={() =>
										setSettings({
											...settings,
											theme: settings.theme === "light" ? "dark" : "light",
										})
									}
									className={`p-2 ${
										isDarkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-lg cursor-pointer ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									{settings.theme === "light" ? <BsMoon /> : <BsSun />}
								</button>
							</div>

							<div className="flex items-center justify-between">
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Sound
								</span>
								<button
									onClick={() =>
										setSettings({
											...settings,
											soundEnabled: !settings.soundEnabled,
										})
									}
									className={`p-2 ${
										isDarkMode ? "bg-gray-700" : "bg-gray-200"
									} rounded-lg cursor-pointer ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									{settings.soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
								</button>
							</div>

							<div className="flex items-center justify-between">
								<span
									className={`${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Timer
								</span>
								<div className="flex items-center">
									<input
										type="checkbox"
										checked={settings.timerEnabled}
										onChange={() =>
											setSettings({
												...settings,
												timerEnabled: !settings.timerEnabled,
											})
										}
										className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
									/>
									<input
										type="number"
										value={settings.timerLength}
										onChange={(e) =>
											setSettings({
												...settings,
												timerLength: parseInt(e.target.value) || 30,
											})
										}
										min="10"
										max="300"
										disabled={!settings.timerEnabled}
										className={`w-16 p-1 text-center border ${
											isDarkMode
												? "border-gray-600 bg-gray-700 text-white disabled:bg-gray-600"
												: "border-gray-300 bg-white text-gray-900 disabled:bg-gray-200"
										}`}
									/>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default function TypingExport() {
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const [game, setGame] = useState<GameState>({
		txt: "",
		start: 0,
		done: false,
		timeElapsed: 0,
		id: "",
	});
	const [input, setInput] = useState<string>("");
	const [scores, setScores] = useState<ScoreMap>({
		easy: [],
		medium: [],
		hard: [],
		custom: [],
	});
	const [customText, setCustomText] = useState<string>("");
	const [settings, setSettings] = useState<UserSettings>({
		theme: "light",
		soundEnabled: true,
		timerEnabled: false,
		timerLength: 30,
	});

	const isDarkMode = settings.theme === "dark";

	const updateGameState = useCallback((updates: Partial<GameState>) => {
		setGame((currentGame) => ({
			...currentGame,
			...updates,
		}));
	}, []);

	useEffect(() => {
		if (typeof document !== "undefined") {
			if (settings.theme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	}, [settings.theme]);

	useEffect(() => {
		try {
			const savedScores = localStorage.getItem("typingGameScores");
			if (savedScores) {
				const parsed = JSON.parse(savedScores);
				setScores({
					easy: parsed.easy || [],
					medium: parsed.medium || [],
					hard: parsed.hard || [],
					custom: parsed.custom || [],
				});
			}

			const savedSettings = localStorage.getItem("typingGameSettings");
			if (savedSettings) {
				setSettings(JSON.parse(savedSettings));
			}
		} catch (error) {
			console.error("Error loading saved data:", error);
		}
	}, []);

	useEffect(() => {
		const t = setTimeout(() => {
			try {
				localStorage.setItem("typingGameScores", JSON.stringify(scores));
			} catch (error) {
				console.error("Error saving scores:", error);
			}
		}, 500);
		return () => clearTimeout(t);
	}, [scores]);

	useEffect(() => {
		const t = setTimeout(() => {
			try {
				localStorage.setItem("typingGameSettings", JSON.stringify(settings));
			} catch (error) {
				console.error("Error saving settings:", error);
			}
		}, 500);
		return () => clearTimeout(t);
	}, [settings]);

	useEffect(() => {
		setInput("");

		if (difficulty === "custom" && !customText) {
			return;
		}

		const gameId = Date.now().toString();

		let text = "";
		if (difficulty === "custom") {
			text = customText.trim();
			if (text) {
				sentences.custom = [text];
			} else {
				return;
			}
		} else {
			text = getRandomSentence(difficulty);
		}

		setGame({
			txt: text,
			start: 0,
			done: false,
			timeElapsed: 0,
			id: gameId,
		});
	}, [difficulty, customText]);

	useEffect(() => {
		if (!settings.timerEnabled || !game.start || game.done) return;

		const timer = setInterval(() => {
			const elapsed = Date.now() - game.start;

			if (elapsed >= settings.timerLength * 1000) {
				clearInterval(timer);
				setGame((g) => ({
					...g,
					done: true,
					timeElapsed: elapsed,
				}));
			}
		}, 100);

		return () => clearInterval(timer);
	}, [game.start, game.done, settings.timerEnabled, settings.timerLength]);

	const retry = useCallback(() => {
		setInput("");

		let text = "";
		if (difficulty === "custom") {
			text = customText.trim();
			if (!text) {
				text = "This is a default custom text since you didn't provide one.";
			}
		} else {
			text = getRandomSentence(difficulty);
		}

		setGame({
			txt: text,
			start: 0,
			done: false,
			timeElapsed: 0,
			id: Date.now().toString(),
		});
	}, [difficulty, customText]);

	useEffect(() => {
		if (game.done && game.start && game.timeElapsed > 0) {
			const timeInSeconds = game.timeElapsed / 1000;
			const { wpm, acc } = calculateStats(game.txt, input, timeInSeconds);

			const newScore = {
				wpm,
				acc,
				dt: new Date().toLocaleDateString(),
			};

			setScores((prevScores) => {
				const updatedScores = { ...prevScores };

				if (!updatedScores[difficulty]) {
					updatedScores[difficulty] = [];
				}

				const newScores = [...updatedScores[difficulty], newScore]
					.sort((a, b) => b.wpm - a.wpm)
					.slice(0, 10);

				updatedScores[difficulty] = newScores;
				return updatedScores;
			});
		}
	}, [game.done, game.start, game.timeElapsed, game.txt, input, difficulty]);

	return (
		<div
			className={`min-h-screen ${
				isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
			} p-4 sm:p-6 font-sans transition-colors duration-200`}
		>
			<Settings
				settings={settings}
				setSettings={setSettings}
				isDarkMode={isDarkMode}
			/>

			<header className="mb-8 text-center">
				<h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
					Typing Speed Challenge
				</h1>
				<p
					className={`text-lg ${
						isDarkMode ? "text-gray-400" : "text-gray-600"
					} mt-2`}
				>
					Test your typing skills and track your progress!
				</p>
			</header>

			<main className="max-w-2xl mx-auto">
				<DifficultySelector
					difficulty={difficulty}
					setDifficulty={setDifficulty}
					customText={customText}
					setCustomText={setCustomText}
					isDarkMode={isDarkMode}
				/>

				<TypingArea
					game={game}
					input={input}
					setInput={setInput}
					retry={retry}
					settings={settings}
					updateGameState={updateGameState}
					isDarkMode={isDarkMode}
				/>

				<ScoreBoard
					scores={scores}
					difficulty={difficulty}
					isDarkMode={isDarkMode}
				/>
			</main>

			<footer
				className={`mt-12 text-center text-sm ${
					isDarkMode ? "text-gray-400" : "text-gray-500"
				}`}
			>
				<p>© {new Date().getFullYear()} Typing Speed Challenge</p>
				<p className="mt-1">Improve your typing speed with daily practice</p>
			</footer>
		</div>
	);
}
