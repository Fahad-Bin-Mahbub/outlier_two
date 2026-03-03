"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

const preventScroll = (enabled: boolean) => {
	if (typeof document !== "undefined") {
		if (enabled) {
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = "15px";
		} else {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		}
	}
};

interface Flashcard {
	id: string;
	front: string;
	back: string;
	difficulty: "easy" | "medium" | "hard";
	english?: string;
	alternatives?: string[];
}

interface Lesson {
	id: string;
	title: string;
	level: string;
	progress: number;
	flashcards: Flashcard[];
	category: string;
	estimatedTime: string;
}

interface UserProfile {
	name: string;
	avatar: string;
	level: number;
	totalXP: number;
	streak: number;
	completedLessons: number;
}

interface Notification {
	id: string;
	type: "success" | "info" | "warning" | "celebration";
	title: string;
	message: string;
	duration?: number;
}

interface DailyProgress {
	cards: number;
	goal: number;
	voicePractice: number;
	voiceGoal: number;
	translations: number;
	translationGoal: number;
}

interface SessionStats {
	correct: number;
	incorrect: number;
	total: number;
	streak: number;
	currentStreak: number;
}

type Mode = "flashcards" | "voice" | "text";
type Difficulty = "all" | "easy" | "medium" | "hard";
type Level = "all" | "Beginner" | "Intermediate" | "Advanced";

const userProfile: UserProfile = {
	name: "María González",
	avatar: "person",
	level: 12,
	totalXP: 2450,
	streak: 7,
	completedLessons: 23,
};

const sampleLessons: Lesson[] = [
	{
		id: "1",
		title: "Basic Greetings",
		level: "Beginner",
		progress: 75,
		category: "Conversation",
		estimatedTime: "5 min",
		flashcards: [
			{ id: "1", front: "Hello", back: "Hola", difficulty: "easy" },
			{
				id: "2",
				front: "Good morning",
				back: "Buenos días",
				difficulty: "easy",
			},
			{
				id: "3",
				front: "How are you?",
				back: "¿Cómo estás?",
				difficulty: "medium",
			},
			{ id: "4", front: "Thank you", back: "Gracias", difficulty: "easy" },
			{
				id: "14",
				front: "Good evening",
				back: "Buenas noches",
				difficulty: "easy",
			},
			{
				id: "15",
				front: "Nice to meet you",
				back: "Mucho gusto",
				difficulty: "medium",
			},
			{
				id: "16",
				front: "See you tomorrow",
				back: "Hasta mañana",
				difficulty: "medium",
			},
			{
				id: "17",
				front: "Have a good day",
				back: "Que tengas un buen día",
				difficulty: "hard",
			},
			{
				id: "18",
				front: "My name is...",
				back: "Me llamo...",
				difficulty: "easy",
			},
			{
				id: "19",
				front: "What time is it?",
				back: "¿Qué hora es?",
				difficulty: "medium",
			},
			{ id: "20", front: "I understand", back: "Entiendo", difficulty: "easy" },
			{
				id: "21",
				front: "I don't understand",
				back: "No entiendo",
				difficulty: "easy",
			},
			{
				id: "22",
				front: "Could you repeat that?",
				back: "¿Puede repetir eso?",
				difficulty: "hard",
			},
			{
				id: "23",
				front: "Pleased to meet you",
				back: "Encantado/a de conocerte",
				difficulty: "hard",
			},
		],
	},
	{
		id: "2",
		title: "Common Phrases",
		level: "Intermediate",
		progress: 45,
		category: "Conversation",
		estimatedTime: "8 min",
		flashcards: [
			{ id: "5", front: "Excuse me", back: "Disculpe", difficulty: "medium" },
			{
				id: "6",
				front: "Where is...?",
				back: "¿Dónde está...?",
				difficulty: "hard",
			},
			{
				id: "24",
				front: "I would like to order",
				back: "Quisiera ordenar",
				difficulty: "hard",
			},
			{
				id: "25",
				front: "Do you speak English?",
				back: "¿Habla inglés?",
				difficulty: "medium",
			},
			{
				id: "26",
				front: "I need help",
				back: "Necesito ayuda",
				difficulty: "medium",
			},
			{
				id: "27",
				front: "How much is this?",
				back: "¿Cuánto cuesta esto?",
				difficulty: "medium",
			},
		],
	},
	{
		id: "3",
		title: "Food & Dining",
		level: "Intermediate",
		progress: 20,
		category: "Vocabulary",
		estimatedTime: "10 min",
		flashcards: [
			{
				id: "7",
				front: "I would like...",
				back: "Me gustaría...",
				difficulty: "hard",
			},
			{
				id: "8",
				front: "The check, please",
				back: "La cuenta, por favor",
				difficulty: "medium",
			},
		],
	},
	{
		id: "4",
		title: "Numbers 1-20",
		level: "Beginner",
		progress: 90,
		category: "Numbers",
		estimatedTime: "6 min",
		flashcards: [
			{ id: "9", front: "One", back: "Uno", difficulty: "easy" },
			{ id: "10", front: "Five", back: "Cinco", difficulty: "easy" },
			{ id: "11", front: "Ten", back: "Diez", difficulty: "easy" },
		],
	},
	{
		id: "5",
		title: "Advanced Grammar",
		level: "Advanced",
		progress: 15,
		category: "Grammar",
		estimatedTime: "15 min",
		flashcards: [
			{
				id: "12",
				front: "Subjunctive mood",
				back: "Modo subjuntivo",
				difficulty: "hard",
			},
			{
				id: "13",
				front: "Conditional tense",
				back: "Tiempo condicional",
				difficulty: "hard",
			},
		],
	},
];

const NotificationToast: React.FC<{
	notification: Notification;
	onClose: (id: string) => void;
}> = ({ notification, onClose }) => {
	const [isVisible, setIsVisible] = useState(true);
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		const duration = notification.duration || 3000;
		const timer = setTimeout(() => {
			setIsExiting(true);
			setTimeout(() => {
				setIsVisible(false);
				onClose(notification.id);
			}, 300);
		}, duration);

		return () => clearTimeout(timer);
	}, [notification.id, notification.duration, onClose]);

	const getNotificationStyle = (type: string) => {
		switch (type) {
			case "success":
				return "bg-emerald-500 border-l-emerald-600 shadow-emerald-500/20";
			case "celebration":
				return "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-l-purple-600 shadow-purple-500/20";
			case "info":
				return "bg-blue-500 border-l-blue-600 shadow-blue-500/20";
			case "warning":
				return "bg-rose-500 border-l-rose-600 shadow-rose-500/20";
			default:
				return "bg-gray-500 border-l-gray-600 shadow-gray-500/20";
		}
	};

	const getIcon = (type: string) => {
		switch (type) {
			case "success":
				return "check_circle";
			case "celebration":
				return "celebration";
			case "info":
				return "info";
			case "warning":
				return "warning";
			default:
				return "notifications";
		}
	};

	if (!isVisible) return null;

	return (
		<div
			className={`transform transition-all duration-300 ease-in-out ${
				isExiting
					? "-translate-y-full opacity-0 scale-95"
					: "translate-y-0 opacity-100 scale-100"
			}`}
		>
			<div
				className={`${getNotificationStyle(
					notification.type
				)} text-white p-4 rounded-xl shadow-lg border-l-4 backdrop-blur-sm bg-opacity-95 min-w-[280px] max-w-[95vw] sm:max-w-[400px] mx-auto`}
				style={{ backdropFilter: "blur(8px)" }}
			>
				<div className="flex items-start space-x-3">
					<div className="flex-shrink-0">
						<Icon
							name={getIcon(notification.type)}
							className="text-white"
							size={24}
						/>
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="font-semibold text-sm truncate">
							{notification.title}
						</h4>
						<p className="text-sm opacity-90 mt-1 break-words">
							{notification.message}
						</p>
					</div>
					<button
						onClick={() => {
							setIsExiting(true);
							setTimeout(() => {
								setIsVisible(false);
								onClose(notification.id);
							}, 300);
						}}
						className="flex-shrink-0 hover:bg-white/20 p-1 rounded-full transition-colors"
					>
						<Icon name="close" className="text-white" size={16} />
					</button>
				</div>
			</div>
		</div>
	);
};

const NotificationManager: React.FC<{
	notifications: Notification[];
	onRemoveNotification: (id: string) => void;
}> = ({ notifications, onRemoveNotification }) => {
	const notification = notifications[0];

	if (!notification) return null;

	return (
		<div className="fixed top-0 left-0 right-0 z-[100] p-4 pointer-events-none">
			<div className="max-w-screen-sm mx-auto">
				<div className="transform transition-all duration-300 pointer-events-auto">
					<NotificationToast
						notification={notification}
						onClose={onRemoveNotification}
					/>
				</div>
			</div>
		</div>
	);
};

const LoginScreen: React.FC<{ onLogin: (email: string) => void }> = ({
	onLogin,
}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address");
			return false;
		}

		if ((email.match(/@/g) || []).length > 1) {
			setEmailError("Email cannot contain multiple @ symbols");
			return false;
		}

		if (email.includes("..") || /\.{2,}/.test(email.split("@")[1])) {
			setEmailError("Invalid email format");
			return false;
		}

		setEmailError("");
		return true;
	};

	const validatePassword = (password: string): boolean => {
		if (password.length < 8) {
			setPasswordError("Password must be at least 8 characters long");
			return false;
		}

		if (!/\d/.test(password)) {
			setPasswordError("Password must contain at least one number");
			return false;
		}

		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			setPasswordError("Password must contain at least one special character");
			return false;
		}

		setPasswordError("");
		return true;
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		const isEmailValid = validateEmail(email);
		const isPasswordValid = validatePassword(password);

		if (!isEmailValid || !isPasswordValid) {
			return;
		}

		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			onLogin(email);
		}, 1500);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
			<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-white/20">
				<div className="text-center mb-8">
					<div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
						<Icon name="school" className="text-white" size={28} />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
						LinguaLearn
					</h1>
					<p className="text-gray-600 font-medium">
						Welcome back! Ready to continue learning?
					</p>
				</div>

				<form onSubmit={handleLogin} className="space-y-6">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Email Address
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Icon name="email" className="text-gray-400" size={20} />
							</div>
							<input
								type="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									if (e.target.value) validateEmail(e.target.value);
								}}
								className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
									emailError
										? "border-red-500 bg-red-50"
										: "border-gray-200 hover:border-gray-300"
								}`}
								placeholder="Enter your email"
								disabled={isLoading}
							/>
						</div>
						{emailError && (
							<p className="mt-2 text-sm text-red-600 flex items-center">
								<Icon name="error" size={16} className="mr-1" />
								{emailError}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Icon name="lock" className="text-gray-400" size={20} />
							</div>
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									if (e.target.value) validatePassword(e.target.value);
								}}
								className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
									passwordError
										? "border-red-500 bg-red-50"
										: "border-gray-200 hover:border-gray-300"
								}`}
								placeholder="Enter your password"
								disabled={isLoading}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 pr-4 flex items-center"
								disabled={isLoading}
							>
								<Icon
									name={showPassword ? "visibility_off" : "visibility"}
									className="text-gray-400 hover:text-gray-600"
									size={20}
								/>
							</button>
						</div>
						{passwordError && (
							<p className="mt-2 text-sm text-red-600 flex items-center">
								<Icon name="error" size={16} className="mr-1" />
								{passwordError}
							</p>
						)}
					</div>

					<div className="bg-gray-50 rounded-xl p-4 text-sm">
						<p className="font-semibold text-gray-700 mb-2">
							Password requirements:
						</p>
						<ul className="space-y-1 text-gray-600">
							<li className="flex items-center">
								<Icon
									name="check_circle"
									size={14}
									className={`mr-2 ${
										password.length >= 8 ? "text-green-500" : "text-gray-400"
									}`}
								/>
								At least 8 characters
							</li>
							<li className="flex items-center">
								<Icon
									name="check_circle"
									size={14}
									className={`mr-2 ${
										/\d/.test(password) ? "text-green-500" : "text-gray-400"
									}`}
								/>
								At least 1 number
							</li>
							<li className="flex items-center">
								<Icon
									name="check_circle"
									size={14}
									className={`mr-2 ${
										/[!@#$%^&*(),.?":{}|<>]/.test(password)
											? "text-green-500"
											: "text-gray-400"
									}`}
								/>
								At least 1 special character
							</li>
						</ul>
					</div>

					<button
						type="submit"
						disabled={
							isLoading ||
							!email ||
							!password ||
							!!emailError ||
							!!passwordError
						}
						className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-3 rounded-xl font-semibold disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg"
					>
						{isLoading ? (
							<>
								<div className="animate-spin mr-2">
									<Icon name="refresh" className="text-white" size={20} />
								</div>
								Signing in...
							</>
						) : (
							<>
								<Icon name="login" className="text-white mr-2" size={20} />
								Sign In
							</>
						)}
					</button>
				</form>

				<div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
					<div className="flex items-start space-x-3">
						<Icon name="info" className="text-blue-500 mt-0.5" size={16} />
						<div>
							<p className="text-sm font-semibold text-blue-800">Demo Access</p>
							<p className="text-xs text-blue-600 mt-1">
								Use any valid email and password to access the app
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Icon: React.FC<{ name: string; className?: string; size?: number }> = ({
	name,
	className = "",
	size = 24,
}) => {
	return (
		<span
			className={`material-icons ${className}`}
			style={{ fontSize: `${size}px`, lineHeight: 1 }}
		>
			{name}
		</span>
	);
};

const SpanishFlag: React.FC<{ className?: string; size?: number }> = ({
	className = "",
	size = 24,
}) => {
	return (
		<svg
			width={size}
			height={size * 0.75}
			viewBox="0 0 640 480"
			className={className}
			aria-label="Spanish flag"
		>
			<path fill="#c60b1e" d="M0 0h640v480H0z" />
			<path fill="#ffc400" d="M0 120h640v240H0z" />
		</svg>
	);
};

const ProgressRing: React.FC<{
	progress: number;
	size: number;
	strokeWidth: number;
	color: string;
	onClick?: () => void;
	showHover?: boolean;
}> = ({ progress, size, strokeWidth, color, onClick, showHover = false }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDasharray = `${circumference} ${circumference}`;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return (
		<div
			className={`relative ${
				showHover
					? "cursor-pointer transition-transform hover:scale-110 active:scale-95"
					: ""
			}`}
			onClick={onClick}
			role={onClick ? "button" : undefined}
			title={onClick ? "View Daily Missions" : undefined}
		>
			<svg width={size} height={size} className="transform -rotate-90">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="#e5e7eb"
					strokeWidth={strokeWidth}
					fill="transparent"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={color}
					strokeWidth={strokeWidth}
					fill="transparent"
					strokeDasharray={strokeDasharray}
					strokeDashoffset={strokeDashoffset}
					className="transition-all duration-500 ease-in-out"
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-xs font-semibold text-gray-700">
					{Math.round(progress)}%
				</span>
			</div>
		</div>
	);
};

const SessionStatsDisplay: React.FC<{ stats: SessionStats }> = ({ stats }) => {
	if (stats.total === 0) return null;

	const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;

	return (
		<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
			<div className="flex items-center justify-between mb-3">
				<h4 className="font-semibold text-gray-800 flex items-center">
					<Icon name="analytics" className="text-blue-600 mr-2" size={20} />
					Session Stats
				</h4>
				<div className="flex items-center space-x-1">
					<Icon name="trending_up" className="text-green-600" size={16} />
					<span className="text-sm font-medium text-green-600">
						{stats.currentStreak} streak
					</span>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-4">
				<div className="text-center">
					<div className="text-2xl font-bold text-green-600">
						{stats.correct}
					</div>
					<div className="text-xs text-gray-600">Correct</div>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold text-red-500">
						{stats.incorrect}
					</div>
					<div className="text-xs text-gray-600">Incorrect</div>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold text-blue-600">
						{Math.round(accuracy)}%
					</div>
					<div className="text-xs text-gray-600">Accuracy</div>
				</div>
			</div>
		</div>
	);
};

const VoiceVisualization: React.FC<{
	isRecording: boolean;
	isPlaying: boolean;
	analyserNode: AnalyserNode | null;
}> = ({ isRecording, isPlaying, analyserNode }) => {
	const [audioLevels, setAudioLevels] = useState<number[]>(
		new Array(20).fill(0)
	);
	const animationFrameRef = useRef<number>();

	useEffect(() => {
		if (isRecording && analyserNode) {
			setAudioLevels(new Array(20).fill(0).map(() => Math.random() * 50));

			const updateLevels = () => {
				const bufferLength = analyserNode.frequencyBinCount;
				const dataArray = new Uint8Array(bufferLength);
				analyserNode.getByteFrequencyData(dataArray);

				const barCount = 20;
				const step = Math.floor(bufferLength / barCount);
				const newLevels = [];

				for (let i = 0; i < barCount; i++) {
					let sum = 0;
					for (let j = 0; j < step; j++) {
						sum += dataArray[i * step + j];
					}
					const average = sum / step;
					newLevels.push(Math.min((average / 255) * 150, 100));
				}

				setAudioLevels(newLevels);
				animationFrameRef.current = requestAnimationFrame(updateLevels);
			};

			updateLevels();
		} else if (isPlaying) {
			const interval = setInterval(() => {
				setAudioLevels((prev) => prev.map(() => Math.random() * 80));
			}, 100);
			return () => clearInterval(interval);
		} else {
			setAudioLevels(new Array(20).fill(0));
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isRecording, isPlaying, analyserNode]);

	return (
		<div className="flex items-center justify-center space-x-1 h-16 mb-4">
			{audioLevels.map((level, index) => (
				<div
					key={index}
					className={`w-1 bg-gradient-to-t transition-all duration-75 ${
						isRecording
							? "from-red-400 to-red-600"
							: isPlaying
							? "from-blue-400 to-blue-600"
							: "from-gray-300 to-gray-400"
					}`}
					style={{
						height: `${Math.max(4, level * 0.6)}px`,
						transform: `scaleY(${isRecording || isPlaying ? 1.1 : 1})`,
					}}
				/>
			))}
		</div>
	);
};

const VoicePractice: React.FC<{
	onRecordingComplete: () => void;
	onCorrectPronunciation: () => void;
	flashcards: Flashcard[];
	sessionStats: SessionStats;
	onUpdateStats: (correct: boolean) => void;
}> = ({
	onRecordingComplete,
	onCorrectPronunciation,
	flashcards,
	sessionStats,
	onUpdateStats,
}) => {
	const [isRecording, setIsRecording] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasRecording, setHasRecording] = useState(false);
	const [permissionStatus, setPermissionStatus] = useState<
		"granted" | "denied" | "prompt"
	>("prompt");
	const [audioUrl, setAudioUrl] = useState<string>("");
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [audioLevels, setAudioLevels] = useState<number[]>(
		new Array(20).fill(0)
	);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const animationFrameRef = useRef<number>();
	const audioChunksRef = useRef<Blob[]>([]);

	const currentCard = flashcards[currentCardIndex];

	const getSupportedMimeType = (): string => {
		const types = [
			"audio/webm;codecs=opus",
			"audio/webm",
			"audio/mp4",
			"audio/wav",
		];
		for (const type of types) {
			if (MediaRecorder.isTypeSupported(type)) {
				return type;
			}
		}
		return "audio/webm";
	};

	const initializeRecording = async (): Promise<boolean> => {
		try {
			cleanup();

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
					sampleRate: 44100,
				},
			});

			streamRef.current = stream;
			setPermissionStatus("granted");

			const audioContext = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
			if (audioContext.state === "suspended") {
				await audioContext.resume();
			}

			const analyser = audioContext.createAnalyser();
			const source = audioContext.createMediaStreamSource(stream);

			analyser.fftSize = 256;
			analyser.smoothingTimeConstant = 0.8;
			source.connect(analyser);

			audioContextRef.current = audioContext;
			analyserNodeRef.current = analyser;

			const mimeType = getSupportedMimeType();
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType,
				audioBitsPerSecond: 128000,
			});

			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event: BlobEvent) => {
				if (event.data && event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
				const url = URL.createObjectURL(audioBlob);
				setAudioUrl(url);
				setHasRecording(true);
				onRecordingComplete();
			};

			mediaRecorder.onerror = (event) => {
				console.error("MediaRecorder error:", event);
				setIsRecording(false);
			};

			mediaRecorderRef.current = mediaRecorder;
			return true;
		} catch (error) {
			console.error("Error accessing microphone:", error);
			setPermissionStatus("denied");
			return false;
		}
	};

	const startRecording = async () => {
		const initialized = await initializeRecording();
		if (!initialized || !mediaRecorderRef.current) return;

		try {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
				setAudioUrl("");
			}

			setHasRecording(false);
			audioChunksRef.current = [];

			mediaRecorderRef.current.start(1000);
			setIsRecording(true);

			startVisualization();
		} catch (error) {
			console.error("Error starting recording:", error);
			setIsRecording(false);
		}
	};

	const stopRecording = () => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "recording"
		) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);

			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			setAudioLevels(new Array(20).fill(0));
		}
	};

	const toggleRecording = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	const startVisualization = () => {
		if (!analyserNodeRef.current) return;

		const updateLevels = () => {
			if (!analyserNodeRef.current || !isRecording) return;

			const bufferLength = analyserNodeRef.current.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			analyserNodeRef.current.getByteFrequencyData(dataArray);

			const barCount = 20;
			const step = Math.floor(bufferLength / barCount);
			const newLevels = [];

			for (let i = 0; i < barCount; i++) {
				let sum = 0;
				const startIndex = i * step;
				const endIndex = Math.min(startIndex + step, bufferLength);

				for (let j = startIndex; j < endIndex; j++) {
					sum += dataArray[j] || 0;
				}
				const average = sum / (endIndex - startIndex);
				newLevels.push(Math.min((average / 255) * 100, 100));
			}

			setAudioLevels(newLevels);
			animationFrameRef.current = requestAnimationFrame(updateLevels);
		};

		updateLevels();
	};

	useEffect(() => {
		if (isPlaying && !isRecording) {
			const interval = setInterval(() => {
				setAudioLevels((prev) => prev.map(() => Math.random() * 60 + 20));
			}, 100);

			return () => clearInterval(interval);
		} else if (!isRecording && !isPlaying) {
			setAudioLevels(new Array(20).fill(0));
		}
	}, [isPlaying, isRecording]);

	const playRecording = () => {
		if (!audioRef.current || !audioUrl) return;

		if (isPlaying) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setIsPlaying(false);
		} else {
			audioRef.current
				.play()
				.then(() => setIsPlaying(true))
				.catch((error) => {
					console.error("Error playing audio:", error);
					setIsPlaying(false);
				});
		}
	};

	const handleAudioEnd = () => {
		setIsPlaying(false);
	};

	const clearRecording = () => {
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}
		setHasRecording(false);
		setAudioUrl("");
		audioChunksRef.current = [];
	};

	const moveToNextCard = () => {
		onUpdateStats(true);
		if (currentCardIndex < flashcards.length - 1) {
			setCurrentCardIndex((prev) => prev + 1);
		} else {
			setCurrentCardIndex(0);
		}
		clearRecording();
		onCorrectPronunciation();
	};

	const markIncorrect = () => {
		onUpdateStats(false);
		clearRecording();
	};

	const requestPermission = () => {
		initializeRecording();
	};

	const cleanup = () => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "recording"
		) {
			mediaRecorderRef.current.stop();
		}

		if (audioContextRef.current) {
			audioContextRef.current.close();
		}

		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
		}

		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}

		mediaRecorderRef.current = null;
		streamRef.current = null;
		audioContextRef.current = null;
		analyserNodeRef.current = null;
		audioChunksRef.current = [];
	};

	useEffect(() => {
		return cleanup;
	}, []);

	useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);

	return (
		<div className="space-y-6">
			<SessionStatsDisplay stats={sessionStats} />

			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-md font-semibold text-gray-800">
						Practice Pronunciation
					</h3>
					<div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
						{currentCardIndex + 1} of {flashcards.length}
					</div>
				</div>

				<div className="text-center mb-6">
					<p className="text-2xl font-bold text-gray-800 mb-2">
						{currentCard.front}
					</p>
					<p className="text-gray-600 mb-1">English pronunciation</p>
					<p className="text-sm text-blue-600 font-medium">
						({currentCard.back} in Spanish)
					</p>
				</div>

				{permissionStatus === "prompt" && (
					<div className="text-center mb-6">
						<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
							<Icon
								name="mic"
								className="text-blue-600 mx-auto mb-2"
								size={32}
							/>
							<p className="text-sm text-blue-800 mb-3">
								This feature needs microphone access to record your voice
							</p>
							<button
								onClick={requestPermission}
								className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
							>
								Allow Microphone Access
							</button>
						</div>
					</div>
				)}

				{permissionStatus === "denied" && (
					<div className="text-center mb-6">
						<div className="bg-red-50 border border-red-200 rounded-xl p-4">
							<Icon
								name="mic_off"
								className="text-red-600 mx-auto mb-2"
								size={32}
							/>
							<p className="text-sm text-red-800 mb-2">
								Microphone access denied
							</p>
							<p className="text-xs text-red-600">
								Please enable microphone access in your browser settings and
								refresh the page
							</p>
						</div>
					</div>
				)}

				{permissionStatus === "granted" && (
					<>
						<div className="flex items-center justify-center space-x-1 h-16 mb-4">
							{audioLevels.map((level, index) => (
								<div
									key={index}
									className={`w-1 bg-gradient-to-t transition-all duration-75 ${
										isRecording
											? "from-red-400 to-red-600"
											: isPlaying
											? "from-blue-400 to-blue-600"
											: "from-gray-300 to-gray-400"
									}`}
									style={{
										height: `${Math.max(4, level * 0.6)}px`,
									}}
								/>
							))}
						</div>

						{isRecording && (
							<div className="text-center mb-4">
								<div className="inline-flex items-center space-x-2 bg-red-100/80 backdrop-blur-sm text-red-800 px-4 py-2 rounded-full">
									<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
									<span className="text-sm font-medium tracking-wider">
										Recording...
									</span>
								</div>
							</div>
						)}

						{!hasRecording && (
							<div className="flex justify-center items-center space-x-6 mt-4 mb-4">
								<button
									onClick={toggleRecording}
									className={`w-16 h-16 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg ${
										isRecording
											? "bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse ring-4 ring-red-200"
											: "bg-white text-red-500 hover:text-red-600 hover:bg-red-50 ring-1 ring-red-100"
									}`}
									title={isRecording ? "Stop recording" : "Start recording"}
								>
									<Icon
										name={isRecording ? "stop" : "mic"}
										className={`transition-transform duration-300 ${
											isRecording ? "text-white scale-110" : ""
										}`}
										size={28}
									/>
								</button>
							</div>
						)}

						{hasRecording && !isRecording && (
							<>
								<div className="flex justify-center items-center space-x-4 mt-4 mb-4">
									<button
										onClick={playRecording}
										className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-110 active:scale-95 hover:shadow-xl ring-2 ring-blue-200"
										title={isPlaying ? "Stop playback" : "Play recording"}
									>
										<Icon
											name={isPlaying ? "pause" : "play_arrow"}
											className="transition-transform duration-300"
											size={24}
										/>
									</button>
								</div>

								<div className="text-center mb-4">
									<div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
										<Icon name="check_circle" size={16} />
										<span className="text-sm font-medium">
											Recording saved!
										</span>
									</div>
								</div>

								<div className="flex items-center flex-wrap justify-center gap-3 mb-4">
									<button
										onClick={moveToNextCard}
										className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95"
									>
										<Icon name="check" size={20} />
										<span>Correct</span>
									</button>
									<button
										onClick={markIncorrect}
										className="flex items-center space-x-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95"
									>
										<Icon name="close" size={20} />
										<span>Incorrect</span>
									</button>
									<button
										onClick={clearRecording}
										className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95"
									>
										<Icon name="refresh" size={20} />
										<span>Try Again</span>
									</button>
								</div>
							</>
						)}

						{audioUrl && (
							<audio
								ref={audioRef}
								src={audioUrl}
								onEnded={handleAudioEnd}
								preload="metadata"
								style={{ display: "none" }}
							/>
						)}

						<div className="bg-blue-50 rounded-xl p-4">
							<div className="flex items-start space-x-2">
								<Icon name="info" className="text-blue-600 mt-0.5" size={16} />
								<div>
									<p className="text-sm font-medium text-blue-800">
										How to practice:
									</p>
									<ul className="text-xs text-blue-700 mt-1 space-y-1">
										<li>• Press the red microphone to start recording</li>
										<li>• Say "{currentCard.front}" clearly</li>
										<li>• Press stop when finished</li>
										<li>• Use the play button to hear your pronunciation</li>
										<li>
											• Mark correct or incorrect based on your performance
										</li>
									</ul>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

const FlashcardStack: React.FC<{
	cards: Flashcard[];
	onCardAction: (cardId: string, action: "correct" | "incorrect") => void;
	onLessonComplete?: () => void;
	sessionStats: SessionStats;
	onUpdateStats: (correct: boolean) => void;
}> = ({
	cards,
	onCardAction,
	onLessonComplete,
	sessionStats,
	onUpdateStats,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [feedbackAnimation, setFeedbackAnimation] = useState<
		"correct" | "incorrect" | null
	>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	const currentCard = cards[currentIndex % cards.length];

	const handleCardSwipe = useCallback(
		(action: "correct" | "incorrect") => {
			setFeedbackAnimation(action);
			onCardAction(currentCard.id, action);
			onUpdateStats(action === "correct");

			setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % cards.length);
				setIsFlipped(false);
				setFeedbackAnimation(null);
			}, 300);
		},
		[currentCard.id, onCardAction, onUpdateStats, cards.length]
	);

	const handleTouchStart = useCallback(() => {
		setIsDragging(true);
		setDragOffset({ x: 0, y: 0 });
	}, []);

	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!isDragging) return;
			const touch = e.touches[0];
			const rect = cardRef.current?.getBoundingClientRect();
			if (!rect) return;

			const x = touch.clientX - rect.left - rect.width / 2;
			setDragOffset({ x, y: 0 });
		},
		[isDragging]
	);

	const handleTouchEnd = useCallback(() => {
		if (!isDragging) return;
		setIsDragging(false);

		const threshold = 50;
		if (Math.abs(dragOffset.x) > threshold) {
			const action = dragOffset.x > 0 ? "correct" : "incorrect";
			handleCardSwipe(action);
		}

		setDragOffset({ x: 0, y: 0 });
	}, [isDragging, dragOffset, handleCardSwipe]);

	const handleMouseDown = useCallback(() => {
		setIsDragging(true);
		setDragOffset({ x: 0, y: 0 });
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging) return;
			const rect = cardRef.current?.getBoundingClientRect();
			if (!rect) return;

			const x = e.clientX - rect.left - rect.width / 2;
			setDragOffset({ x, y: 0 });
		},
		[isDragging]
	);

	const handleMouseUp = useCallback(() => {
		if (!isDragging) return;
		setIsDragging(false);

		const threshold = 50;
		if (Math.abs(dragOffset.x) > threshold) {
			const action = dragOffset.x > 0 ? "correct" : "incorrect";
			handleCardSwipe(action);
		}

		setDragOffset({ x: 0, y: 0 });
	}, [isDragging, dragOffset, handleCardSwipe]);

	const rotation = dragOffset.x * 0.1;
	const opacity = 1 - Math.abs(dragOffset.x) * 0.001;

	return (
		<div className="space-y-6 mt-2">
			<SessionStatsDisplay stats={sessionStats} />

			<div className="relative h-80">
				{cards[(currentIndex + 1) % cards.length] && (
					<div className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200 transform scale-95 opacity-50" />
				)}

				<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
					<div className="bg-white rounded-full shadow-md border border-gray-200 px-4 py-1.5">
						<div className="flex items-baseline space-x-1">
							<span className="text-lg font-bold text-gray-800">
								{(currentIndex % cards.length) + 1}
							</span>
							<span className="text-gray-500">/</span>
							<span className="text-gray-600 font-medium">{cards.length}</span>
						</div>
					</div>
				</div>

				<div
					ref={cardRef}
					className={`absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 cursor-pointer transition-all duration-200 ${
						feedbackAnimation === "correct"
							? "ring-4 ring-green-400"
							: feedbackAnimation === "incorrect"
							? "ring-4 ring-red-400"
							: ""
					}`}
					style={{
						transform: `translateX(${dragOffset.x}px) translateY(${
							dragOffset.y
						}px) rotate(${rotation}deg) ${isFlipped ? "rotateY(180deg)" : ""}`,
						opacity,
						userSelect: "none",
					}}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					onClick={() => !isDragging && setIsFlipped(!isFlipped)}
				>
					<div className="h-full flex flex-col justify-center items-center p-8 text-center">
						<div
							className={`transition-opacity duration-200 ${
								isFlipped ? "opacity-0" : "opacity-100"
							}`}
						>
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								{currentCard.front}
							</h2>
							<p className="text-gray-600">Tap to reveal translation</p>

							<div
								className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
									currentCard.difficulty === "easy"
										? "bg-green-100 text-green-800"
										: currentCard.difficulty === "medium"
										? "bg-yellow-100 text-yellow-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{currentCard.difficulty}
							</div>
						</div>

						<div
							className={`absolute inset-0 flex flex-col justify-center items-center p-8 text-center transition-opacity duration-200 ${
								isFlipped ? "opacity-100" : "opacity-0"
							}`}
							style={{ transform: isFlipped ? "rotateY(180deg)" : "none" }}
						>
							<h2 className="text-2xl font-bold text-blue-600 mb-4">
								{currentCard.back}
							</h2>
							<p className="text-gray-600">
								Swipe right if you got it right, left if wrong
							</p>
						</div>
					</div>
				</div>

				<div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-4">
					<div className="bg-gray-50 rounded-xl px-4 py-2 shadow-sm border border-gray-200">
						<div className="flex items-center space-x-6 text-sm text-gray-600">
							<div className="flex items-center">
								<Icon
									name="swipe_left"
									className="text-rose-500 mr-1"
									size={20}
								/>
								<span>Incorrect</span>
							</div>
							<div className="h-4 w-px bg-gray-300"></div>
							<div className="flex items-center">
								<Icon
									name="swipe_right"
									className="text-emerald-500 mr-1"
									size={20}
								/>
								<span>Correct</span>
							</div>
						</div>
					</div>
				</div>

				{isDragging && (
					<>
						<div
							className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-opacity ${
								dragOffset.x < -50 ? "opacity-100" : "opacity-30"
							}`}
						>
							<div className="bg-red-500 text-white p-3 rounded-full">
								<Icon name="close" className="text-white" size={24} />
							</div>
						</div>
						<div
							className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-opacity ${
								dragOffset.x > 50 ? "opacity-100" : "opacity-30"
							}`}
						>
							<div className="bg-green-500 text-white p-3 rounded-full">
								<Icon name="check" className="text-white" size={24} />
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

const TextExercise: React.FC<{
	onComplete: () => void;
	onIncorrect: () => void;
	flashcards: Flashcard[];
	sessionStats: SessionStats;
	onUpdateStats: (correct: boolean) => void;
}> = ({ onComplete, onIncorrect, flashcards, sessionStats, onUpdateStats }) => {
	const [userInput, setUserInput] = useState("");
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
	const [answerState, setAnswerState] = useState<
		"idle" | "correct" | "incorrect"
	>("idle");
	const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);

	const currentCard = flashcards[currentCardIndex];
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleResize = () => {
			const viewportHeight =
				window.visualViewport?.height || window.innerHeight;
			const windowHeight = window.innerHeight;
			setIsKeyboardOpen(windowHeight - viewportHeight > 150);
		};

		window.addEventListener("resize", handleResize);
		window.visualViewport?.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.visualViewport?.removeEventListener("resize", handleResize);
		};
	}, []);

	const normalizeText = (text: string) => {
		return text
			.toLowerCase()
			.trim()
			.replace(/[.,!?;]/g, "");
	};

	const isAnswerCorrect = (userAnswer: string) => {
		const userNormalized = normalizeText(userAnswer);
		const correctNormalized = normalizeText(currentCard.front);

		if (userNormalized === correctNormalized) return true;

		return (
			currentCard.alternatives?.some(
				(alt) => normalizeText(alt) === userNormalized
			) || false
		);
	};

	const handleSubmit = () => {
		if (!userInput.trim()) return;

		if (isAnswerCorrect(userInput)) {
			setAnswerState("correct");
			setShowCorrectAnswer(false);
			onComplete();
			onUpdateStats(true);

			setTimeout(() => {
				setUserInput("");
				setAnswerState("idle");
				if (currentCardIndex < flashcards.length - 1) {
					setCurrentCardIndex((prev) => prev + 1);
				} else {
					setCurrentCardIndex(0);
				}
			}, 2000);
		} else {
			setAnswerState("incorrect");
			setShowCorrectAnswer(true);
			onIncorrect();
			onUpdateStats(false);

			setTimeout(() => {
				setAnswerState("idle");
				setShowCorrectAnswer(false);
			}, 3000);
		}
	};

	const handleTryAgain = () => {
		setUserInput("");
		setAnswerState("idle");
		setShowCorrectAnswer(false);
		inputRef.current?.focus();
	};

	const getInputStyle = () => {
		switch (answerState) {
			case "correct":
				return "border-green-500 bg-green-50 text-green-800 placeholder:text-green-400";
			case "incorrect":
				return "border-red-500 bg-red-50 text-red-800 placeholder:text-red-400";
			default:
				return "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900";
		}
	};

	const getButtonStyle = () => {
		switch (answerState) {
			case "correct":
				return "bg-green-500 hover:bg-green-600";
			case "incorrect":
				return "bg-red-500 hover:bg-red-600";
			default:
				return "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300";
		}
	};

	const getButtonText = () => {
		switch (answerState) {
			case "correct":
				return "Correct! Well done!";
			case "incorrect":
				return "Try again";
			default:
				return "Check Answer";
		}
	};

	const getButtonIcon = () => {
		switch (answerState) {
			case "correct":
				return "check_circle";
			case "incorrect":
				return "refresh";
			default:
				return "done";
		}
	};

	return (
		<div
			className={`space-y-6 transition-all duration-300 ${
				isKeyboardOpen ? "pb-4" : "pb-8"
			}`}
		>
			<SessionStatsDisplay stats={sessionStats} />

			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-md font-semibold text-gray-800">
						Translate to English:
					</h3>
					<div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
						{currentCardIndex + 1} of {flashcards.length}
					</div>
				</div>
				<p className="text-xl text-gray-700 mb-6">
					&ldquo;{currentCard.back}&rdquo;
				</p>

				<div className="space-y-4">
					<div className="relative">
						<div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
							<Icon
								name="translate"
								size={20}
								className={`transition-colors duration-200 ${
									answerState === "correct"
										? "text-green-500"
										: answerState === "incorrect"
										? "text-red-500"
										: userInput
										? "text-blue-500"
										: "text-gray-400"
								}`}
							/>
						</div>

						<input
							ref={inputRef}
							type="text"
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							placeholder="Type your translation here..."
							className={`w-full pl-12 pr-4 py-4 border rounded-xl text-lg transition-all duration-300 
                placeholder:text-gray-400 placeholder:font-normal placeholder:italic
                focus:placeholder:text-blue-300 focus:outline-none focus:ring-2
                text-gray-900
                ${getInputStyle()}
                ${!userInput && "bg-gray-50 hover:bg-white focus:bg-white"}
              `}
							onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
							disabled={answerState === "correct"}
						/>

						{answerState !== "idle" && (
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
								<Icon
									name={answerState === "correct" ? "check_circle" : "cancel"}
									className={
										answerState === "correct"
											? "text-green-600"
											: "text-red-600"
									}
									size={24}
								/>
							</div>
						)}
					</div>

					{showCorrectAnswer && (
						<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
							<div className="flex items-start space-x-2">
								<Icon
									name="lightbulb"
									className="text-blue-600 mt-1"
									size={20}
								/>
								<div>
									<p className="text-sm font-medium text-blue-800">
										Correct answer:
									</p>
									<p className="text-blue-700 font-medium">
										{currentCard.front}
									</p>
									{currentCard.alternatives?.map((alt, index: number) => (
										<p key={index} className="text-blue-600 text-sm">
											{alt}
										</p>
									))}
								</div>
							</div>
						</div>
					)}

					<button
						onClick={
							answerState === "incorrect" ? handleTryAgain : handleSubmit
						}
						disabled={!userInput.trim() && answerState === "idle"}
						className={`w-full text-white py-4 rounded-xl font-semibold disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 ${getButtonStyle()}`}
					>
						<Icon name={getButtonIcon()} className="text-white" size={20} />
						<span>{getButtonText()}</span>
					</button>
				</div>

				{answerState === "correct" && (
					<div className="mt-4 flex items-center justify-center space-x-2 text-green-600">
						<Icon name="trending_up" size={16} />
						<span className="text-sm font-medium">Progress updated!</span>
					</div>
				)}
			</div>
		</div>
	);
};

const Sidebar: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	user: UserProfile;
	lessons: Lesson[];
	onSelectLesson: (lesson: Lesson) => void;
	currentLesson: Lesson;
	onLogout: () => void;
}> = ({
	isOpen,
	onClose,
	user,
	lessons,
	onSelectLesson,
	currentLesson,
	onLogout,
}) => {
	const [selectedDifficulty, setSelectedDifficulty] =
		useState<Difficulty>("all");
	const [selectedLevel, setSelectedLevel] = useState<Level>("all");

	const filteredLessons = lessons.filter((lesson) => {
		const levelMatch =
			selectedLevel === "all" || lesson.level === selectedLevel;
		const difficultyMatch =
			selectedDifficulty === "all" ||
			lesson.flashcards.some((card) => card.difficulty === selectedDifficulty);
		return levelMatch && difficultyMatch;
	});

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return "bg-green-100 text-green-800 border-green-200";
			case "medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "hard":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getLevelColor = (level: string) => {
		switch (level) {
			case "Beginner":
				return "bg-blue-100 text-blue-800";
			case "Intermediate":
				return "bg-purple-100 text-purple-800";
			case "Advanced":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	useEffect(() => {
		preventScroll(isOpen);
		return () => preventScroll(false);
	}, [isOpen]);

	return (
		<div
			className={`fixed inset-0 z-50 transition-all duration-300 ${
				isOpen ? "pointer-events-auto" : "pointer-events-none"
			}`}
		>
			<div
				className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
				onClick={onClose}
			/>

			<div
				className={`absolute top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="h-full flex flex-col overflow-y-auto scrollbar-hide">
					<div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-6 text-white flex-shrink-0">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold">Profile</h2>
							<button
								onClick={onClose}
								className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm"
							>
								<Icon name="close" className="text-white" size={18} />
							</button>
						</div>

						<div className="flex items-center space-x-4 mb-4">
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
								<Icon name={user.avatar} className="text-white" size={32} />
							</div>
							<div>
								<h3 className="font-semibold text-lg">{user.name}</h3>
								<div className="flex items-center space-x-2">
									<Icon name="star" className="text-yellow-300" size={16} />
									<span className="text-sm">Level {user.level}</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4 text-center mb-4">
							<div>
								<div className="text-2xl font-bold">{user.totalXP}</div>
								<div className="text-xs opacity-80">Total XP</div>
							</div>
							<div>
								<div className="text-2xl font-bold">{user.streak}</div>
								<div className="text-xs opacity-80">Day Streak</div>
							</div>
							<div>
								<div className="text-2xl font-bold">
									{user.completedLessons}
								</div>
								<div className="text-xs opacity-80">Completed</div>
							</div>
						</div>

						<button
							onClick={onLogout}
							className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
						>
							<Icon name="logout" className="text-white" size={16} />
							<span className="text-sm font-medium">Sign Out</span>
						</button>
					</div>

					<div className="p-4 border-b border-gray-200 flex-shrink-0">
						<div className="flex items-center space-x-2 mb-3">
							<Icon name="filter_list" className="text-gray-600" size={16} />
							<span className="font-medium text-gray-800">Filters</span>
						</div>

						<div className="space-y-3">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 block">
									Level
								</label>
								<div className="flex flex-wrap gap-2">
									{["all", "Beginner", "Intermediate", "Advanced"].map(
										(level) => (
											<button
												key={level}
												onClick={() => setSelectedLevel(level as any)}
												className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
													selectedLevel === level
														? "bg-blue-500 text-white border-blue-500"
														: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
												}`}
											>
												{level === "all" ? "All Levels" : level}
											</button>
										)
									)}
								</div>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 block">
									Difficulty
								</label>
								<div className="flex flex-wrap gap-2">
									{(["all", "easy", "medium", "hard"] as const).map(
										(difficulty) => (
											<button
												key={difficulty}
												onClick={() =>
													setSelectedDifficulty(difficulty as Difficulty)
												}
												className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
													selectedDifficulty === difficulty
														? difficulty === "all"
															? "bg-blue-500 text-white border-blue-500"
															: getDifficultyColor(difficulty)
																	.replace("bg-", "bg-")
																	.replace("text-", "text-black ")
																	.replace("border-", "border-")
														: getDifficultyColor(difficulty) +
														  " hover:opacity-80"
												}`}
											>
												{difficulty === "all"
													? "All"
													: difficulty.charAt(0).toUpperCase() +
													  difficulty.slice(1)}
											</button>
										)
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="p-4 pb-8">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-semibold text-gray-800">
								Lessons ({filteredLessons.length})
							</h3>
						</div>

						<div className="space-y-3">
							{filteredLessons.map((lesson) => (
								<div
									key={lesson.id}
									className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
										currentLesson.id === lesson.id
											? "border-blue-500 bg-blue-50"
											: "border-gray-200 bg-white hover:border-gray-300"
									}`}
									onClick={() => {
										onSelectLesson(lesson);
										onClose();
									}}
								>
									<div className="flex items-start justify-between mb-2">
										<div className="flex-1">
											<h4 className="font-medium text-gray-800">
												{lesson.title}
											</h4>
											<div className="flex items-center space-x-2 mt-1">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
														lesson.level
													)}`}
												>
													{lesson.level}
												</span>
												<span className="text-xs text-gray-600">
													{lesson.category}
												</span>
											</div>
										</div>
										<Icon
											name="keyboard_arrow_right"
											className="text-gray-400"
											size={16}
										/>
									</div>

									<div className="flex items-center justify-between text-xs text-gray-600 mb-2">
										<span>{lesson.flashcards.length} cards</span>
										<span>{lesson.estimatedTime}</span>
									</div>

									<div className="flex items-center justify-between">
										<ProgressRing
											progress={lesson.progress}
											size={35}
											strokeWidth={3}
											color="#3b82f6"
										/>
										<div className="flex space-x-1">
											{["easy", "medium", "hard"].map((diff) => {
												const count = lesson.flashcards.filter(
													(card) => card.difficulty === diff
												).length;
												return count > 0 ? (
													<span
														key={diff}
														className={`px-1.5 py-0.5 rounded text-xs ${getDifficultyColor(
															diff
														)}`}
													>
														{count}
													</span>
												) : null;
											})}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const BottomSheet: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	lessons: Lesson[];
	onSelectLesson: (lesson: Lesson) => void;
}> = ({ isOpen, onClose, lessons, onSelectLesson }) => {
	useEffect(() => {
		preventScroll(isOpen);
		return () => preventScroll(false);
	}, [isOpen]);

	return (
		<div
			className={`fixed inset-0 z-50 transition-all duration-300 ${
				isOpen ? "pointer-events-auto" : "pointer-events-none"
			}`}
		>
			<div
				className={`absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300 ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
				onClick={onClose}
			/>

			<div
				className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-t-3xl transform transition-transform duration-300 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<div className="px-6 py-4">
					<div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-gray-800">Select Lesson</h2>
						<button
							onClick={onClose}
							className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm"
						>
							<Icon
								name="keyboard_arrow_down"
								className="text-gray-600"
								size={24}
							/>
						</button>
					</div>

					<div className="space-y-4 max-h-96 overflow-y-auto">
						{lessons.map((lesson) => (
							<div
								key={lesson.id}
								className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
								onClick={() => {
									onSelectLesson(lesson);
									onClose();
								}}
							>
								<div className="flex-1">
									<h3 className="font-semibold text-gray-800">
										{lesson.title}
									</h3>
									<p className="text-sm text-gray-600">
										{lesson.level} • {lesson.flashcards.length} cards
									</p>
								</div>
								<ProgressRing
									progress={lesson.progress}
									size={50}
									strokeWidth={4}
									color="#3b82f6"
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const DailyMissionsModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	dailyProgress: DailyProgress;
}> = ({ isOpen, onClose, dailyProgress }) => {
	useEffect(() => {
		preventScroll(isOpen);
		return () => preventScroll(false);
	}, [isOpen]);

	const missions = [
		{
			id: 1,
			title: "Complete Daily Cards",
			description: "Practice flashcards to reach your daily goal",
			target: dailyProgress.goal,
			current: dailyProgress.cards,
			icon: "school",
			xp: 100,
		},
		{
			id: 2,
			title: "Voice Practice",
			description: "Complete voice pronunciation exercises",
			target: dailyProgress.voiceGoal || 5,
			current: dailyProgress.voicePractice || 0,
			icon: "record_voice_over",
			xp: 50,
		},
		{
			id: 3,
			title: "Translation Master",
			description: "Complete text translation exercises",
			target: dailyProgress.translationGoal || 10,
			current: dailyProgress.translations || 0,
			icon: "translate",
			xp: 75,
		},
	];

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full h-[80vh] flex flex-col">
				<div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-6 text-white flex-shrink-0 rounded-t-2xl">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-bold">Daily Missions</h2>
						<button
							onClick={onClose}
							className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
						>
							<Icon name="close" className="text-white" size={18} />
						</button>
					</div>
					<div className="flex items-center space-x-2">
						<Icon name="stars" className="text-yellow-300" size={24} />
						<span className="font-medium">Complete missions to earn XP!</span>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto custom-scrollbar">
					<div className="p-6 space-y-4">
						{missions.map((mission) => {
							const progress = (mission.current / mission.target) * 100;
							const isCompleted = mission.current >= mission.target;

							return (
								<div
									key={mission.id}
									className={`p-4 rounded-xl border-2 transition-all ${
										isCompleted
											? "border-green-500 bg-green-50"
											: "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
									}`}
								>
									<div className="flex items-start space-x-4">
										<div
											className={`w-10 h-10 rounded-full flex items-center justify-center ${
												isCompleted ? "bg-green-500" : "bg-blue-500"
											}`}
										>
											<Icon
												name={mission.icon}
												className="text-white"
												size={20}
											/>
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between mb-2">
												<h3 className="font-semibold text-gray-800">
													{mission.title}
												</h3>
												<div className="flex items-center space-x-1 text-yellow-600">
													<Icon name="workspace_premium" size={16} />
													<span className="text-sm font-medium">
														{mission.xp} XP
													</span>
												</div>
											</div>
											<p className="text-sm text-gray-600 mb-4">
												{mission.description}
											</p>

											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<div className="bg-blue-100 rounded-lg px-3 py-1">
														<div className="flex items-baseline space-x-1">
															<span className="text-lg font-bold text-blue-700">
																{mission.current}
															</span>
															<span className="text-blue-600">/</span>
															<span className="text-blue-700 font-medium">
																{mission.target}
															</span>
														</div>
													</div>
													<span
														className={`text-sm font-medium ${
															isCompleted ? "text-green-600" : "text-gray-500"
														}`}
													>
														{Math.round(progress)}%
													</span>
												</div>

												<div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
													<div
														className={`h-full transition-all duration-500 rounded-full ${
															isCompleted
																? "bg-gradient-to-r from-green-500 to-emerald-500"
																: "bg-gradient-to-r from-blue-500 to-purple-500"
														}`}
														style={{ width: `${progress}%` }}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="border-t border-gray-200 p-4 bg-white flex-shrink-0 rounded-b-2xl">
					<div className="flex items-center justify-center">
						<div className="text-sm text-gray-600 flex items-center space-x-2">
							<Icon name="schedule" size={16} className="text-gray-500" />
							<span>Daily missions reset at midnight</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const LinguaLearn: React.FC = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const saved = localStorage.getItem("isLoggedIn");
		return saved ? JSON.parse(saved) : false;
	});

	const [userEmail, setUserEmail] = useState(() => {
		return localStorage.getItem("userEmail") || "";
	});

	const [currentLesson, setCurrentLesson] = useState(() => {
		const saved = localStorage.getItem("currentLesson");
		return saved ? JSON.parse(saved) : sampleLessons[0];
	});

	const [lessons, setLessons] = useState(() => {
		const saved = localStorage.getItem("lessons");
		return saved ? JSON.parse(saved) : sampleLessons;
	});

	const [currentMode, setCurrentMode] = useState<Mode>(() => {
		return (localStorage.getItem("currentMode") as Mode) || "flashcards";
	});

	const [dailyProgress, setDailyProgress] = useState(() => {
		const saved = localStorage.getItem("dailyProgress");
		if (saved) {
			const parsed = JSON.parse(saved);
			const lastSaved = localStorage.getItem("lastProgressUpdate");
			if (lastSaved) {
				const isNewDay = new Date(lastSaved).getDate() !== new Date().getDate();
				if (isNewDay) {
					return {
						cards: 0,
						goal: 20,
						voicePractice: 0,
						voiceGoal: 5,
						translations: 0,
						translationGoal: 10,
					};
				}
			}
			return parsed;
		}
		return {
			cards: 0,
			goal: 20,
			voicePractice: 0,
			voiceGoal: 5,
			translations: 0,
			translationGoal: 10,
		};
	});

	const [sessionStats, setSessionStats] = useState<SessionStats>({
		correct: 0,
		incorrect: 0,
		total: 0,
		streak: 0,
		currentStreak: 0,
	});

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);

	useEffect(() => {
		localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
	}, [isLoggedIn]);

	useEffect(() => {
		if (userEmail) {
			localStorage.setItem("userEmail", userEmail);
		} else {
			localStorage.removeItem("userEmail");
		}
	}, [userEmail]);

	useEffect(() => {
		localStorage.setItem("currentLesson", JSON.stringify(currentLesson));
	}, [currentLesson]);

	useEffect(() => {
		localStorage.setItem("lessons", JSON.stringify(lessons));
	}, [lessons]);

	useEffect(() => {
		localStorage.setItem("currentMode", currentMode);
	}, [currentMode]);

	useEffect(() => {
		localStorage.setItem("dailyProgress", JSON.stringify(dailyProgress));
		localStorage.setItem("lastProgressUpdate", new Date().toISOString());
	}, [dailyProgress]);

	useEffect(() => {
		const fontLink = document.createElement("link");
		fontLink.href =
			"https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap";
		fontLink.rel = "stylesheet";
		document.head.appendChild(fontLink);

		const iconLink = document.createElement("link");
		iconLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
		iconLink.rel = "stylesheet";
		document.head.appendChild(iconLink);

		document.body.style.fontFamily = "'Outfit', 'Raleway', sans-serif";

		const styleSheet = document.createElement("style");
		styleSheet.textContent = `
      h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', 'Raleway', sans-serif; }
      .font-light { font-weight: 300; }
      .font-normal { font-weight: 400; }
      .font-medium { font-weight: 500; }
      .font-semibold { font-weight: 600; }
      .font-bold { font-weight: 700; }
      .font-extrabold { font-weight: 800; }
      .font-black { font-weight: 900; }
    `;
		document.head.appendChild(styleSheet);

		return () => {
			document.head.removeChild(fontLink);
			document.head.removeChild(iconLink);
			document.body.style.fontFamily = "";
		};
	}, []);

	const addNotification = (notification: Omit<Notification, "id">) => {
		const newNotification: Notification = {
			...notification,
			id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
		};

		setNotifications((prev) => {
			const existingNotification = prev.find(
				(n) => n.type === notification.type
			);
			if (existingNotification) {
				return prev;
			}
			return [newNotification];
		});
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const showSuccessNotification = (title: string, message: string) => {
		addNotification({ type: "success", title, message });
	};

	const showCelebrationNotification = (title: string, message: string) => {
		addNotification({ type: "celebration", title, message, duration: 3000 });
	};

	const updateSessionStats = (correct: boolean) => {
		setSessionStats((prev) => {
			const newStats = {
				correct: prev.correct + (correct ? 1 : 0),
				incorrect: prev.incorrect + (correct ? 0 : 1),
				total: prev.total + 1,
				streak: prev.streak,
				currentStreak: correct ? prev.currentStreak + 1 : 0,
			};

			if (correct && newStats.currentStreak > newStats.streak) {
				newStats.streak = newStats.currentStreak;
			}

			return newStats;
		});
	};

	const updateLessonProgress = () => {
		if (sessionStats.total === 0) return;

		const accuracy = (sessionStats.correct / sessionStats.total) * 100;
		const progressIncrement = Math.min(accuracy / 10, 10);

		setLessons((prevLessons) =>
			prevLessons.map((lesson) =>
				lesson.id === currentLesson.id
					? {
							...lesson,
							progress: Math.min(lesson.progress + progressIncrement, 100),
					  }
					: lesson
			)
		);

		setCurrentLesson((prev) => ({
			...prev,
			progress: Math.min(prev.progress + progressIncrement, 100),
		}));
	};

	const handleLogin = (email: string) => {
		setUserEmail(email);
		setIsLoggedIn(true);

		const userName =
			email.split("@")[0].charAt(0).toUpperCase() +
			email.split("@")[0].slice(1);
		showSuccessNotification(
			`Welcome back, ${userName}!`,
			"Ready to continue your language learning journey?"
		);
	};

	const currentUserProfile: UserProfile = {
		...userProfile,
		name: userEmail
			? userEmail.split("@")[0].charAt(0).toUpperCase() +
			  userEmail.split("@")[0].slice(1)
			: userProfile.name,
	};

	const handleLogout = () => {
		localStorage.removeItem("isLoggedIn");
		localStorage.removeItem("userEmail");
		localStorage.removeItem("currentLesson");
		localStorage.removeItem("lessons");
		localStorage.removeItem("currentMode");
		localStorage.removeItem("dailyProgress");
		localStorage.removeItem("lastProgressUpdate");

		setIsLoggedIn(false);
		setUserEmail("");
		setCurrentLesson(sampleLessons[0]);
		setLessons(sampleLessons);
		setCurrentMode("flashcards");
		setDailyProgress({
			cards: 0,
			goal: 20,
			voicePractice: 0,
			voiceGoal: 5,
			translations: 0,
			translationGoal: 10,
		});
		setSessionStats({
			correct: 0,
			incorrect: 0,
			total: 0,
			streak: 0,
			currentStreak: 0,
		});
		setIsSidebarOpen(false);
		setNotifications([]);
	};

	if (!isLoggedIn) {
		return <LoginScreen onLogin={handleLogin} />;
	}

	const handleCardAction = (
		cardId: string,
		action: "correct" | "incorrect"
	) => {
		if (action === "correct") {
			const newCardsCount = Math.min(
				dailyProgress.cards + 1,
				dailyProgress.goal
			);
			setDailyProgress((prev) => ({
				...prev,
				cards: newCardsCount,
			}));

			if (sessionStats.total > 0 && sessionStats.total % 5 === 0) {
				updateLessonProgress();
			}

			if (
				newCardsCount === dailyProgress.goal &&
				dailyProgress.cards !== dailyProgress.goal
			) {
				showCelebrationNotification(
					"Daily Cards Goal Achieved!",
					`Congratulations! You've completed your daily target of ${dailyProgress.goal} cards!`
				);
			}
		}
	};

	const handleVoiceRecordingComplete = () => {
		const newVoiceCount = Math.min(
			dailyProgress.voicePractice + 1,
			dailyProgress.voiceGoal
		);
		setDailyProgress((prev) => ({
			...prev,
			voicePractice: newVoiceCount,
		}));

		if (
			newVoiceCount === dailyProgress.voiceGoal &&
			dailyProgress.voicePractice !== dailyProgress.voiceGoal
		) {
			showCelebrationNotification(
				"Voice Practice Goal Achieved!",
				"Amazing! You've completed your daily voice practice goal!"
			);
		}
	};

	const handleTextExerciseComplete = () => {
		const newTranslationCount = Math.min(
			dailyProgress.translations + 1,
			dailyProgress.translationGoal
		);
		setDailyProgress((prev) => ({
			...prev,
			translations: newTranslationCount,
		}));

		if (sessionStats.total > 0 && sessionStats.total % 3 === 0) {
			updateLessonProgress();
		}

		if (
			newTranslationCount === dailyProgress.translationGoal &&
			dailyProgress.translations !== dailyProgress.translationGoal
		) {
			showCelebrationNotification(
				"Translation Goal Achieved!",
				"Excellent! You've reached your daily translation practice goal!"
			);
		}
	};

	const handleTextExerciseIncorrect = () => {};

	const handleModeChange = (newMode: Mode) => {
		setCurrentMode(newMode);

		setSessionStats({
			correct: 0,
			incorrect: 0,
			total: 0,
			streak: 0,
			currentStreak: 0,
		});
	};

	const handleLessonComplete = () => {
		updateLessonProgress();
		showSuccessNotification(
			"Lesson Progress Updated!",
			"Great work! Your lesson progress has been updated."
		);
	};

	const handleLessonChange = (lesson: Lesson) => {
		setCurrentLesson(lesson);

		setSessionStats({
			correct: 0,
			incorrect: 0,
			total: 0,
			streak: 0,
			currentStreak: 0,
		});
	};

	const calculateAggregateProgress = () => {
		const missions = [
			{
				target: dailyProgress.goal,
				current: dailyProgress.cards,
			},
			{
				target: dailyProgress.voiceGoal,
				current: dailyProgress.voicePractice,
			},
			{
				target: dailyProgress.translationGoal,
				current: dailyProgress.translations,
			},
		];

		const totalProgress = missions.reduce((acc, mission) => {
			return acc + (mission.current / mission.target) * 100;
		}, 0);

		return Math.round(totalProgress / missions.length);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex flex-col">
			{}
			<NotificationManager
				notifications={notifications}
				onRemoveNotification={removeNotification}
			/>

			{}
			<div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
							<div>
								<h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
									{currentLesson.title}
								</h1>
								<div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-1 sm:mt-0">
									<span className="text-sm text-gray-600 font-medium">
										{currentLesson.level} • {currentLesson.category}
									</span>

									<div className="hidden sm:block h-4 w-px bg-gray-300"></div>

									<div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full w-fit border border-blue-200">
										<Icon name="language" size={16} className="text-blue-600" />
										<span className="text-sm font-semibold text-blue-700">
											Spanish
										</span>
										<SpanishFlag size={16} className="flex-shrink-0" />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						{}
						<div className="relative">
							<ProgressRing
								progress={calculateAggregateProgress()}
								size={44}
								strokeWidth={3}
								color="#3b82f6"
								onClick={() => setIsMissionsModalOpen(true)}
								showHover={true}
							/>
							{calculateAggregateProgress() === 100 && (
								<div className="absolute -top-1 -right-1">
									<Icon name="stars" className="text-yellow-500" size={16} />
								</div>
							)}
						</div>
						<button
							onClick={() => setIsSidebarOpen(true)}
							className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer shadow-sm border border-gray-200"
						>
							<Icon name="menu_open" className="text-gray-700" size={24} />
						</button>
					</div>
				</div>
			</div>

			{}
			<div className="px-6 py-4">
				<div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm border border-gray-200">
					{[
						{ key: "flashcards" as Mode, label: "Cards", icon: "menu_book" },
						{ key: "voice" as Mode, label: "Voice", icon: "mic" },
						{ key: "text" as Mode, label: "Type", icon: "keyboard" },
					].map(({ key, label, icon }) => (
						<button
							key={key}
							onClick={() => handleModeChange(key)}
							className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all cursor-pointer font-medium ${
								currentMode === key
									? "bg-white shadow-md text-blue-600 transform scale-105"
									: "text-gray-600 hover:text-gray-800 hover:bg-white/50"
							}`}
						>
							<Icon name={icon} size={18} />
							<span>{label}</span>
						</button>
					))}
				</div>
			</div>

			{}
			<div className="flex-1 px-6 pb-6">
				{currentMode === "flashcards" && (
					<FlashcardStack
						cards={currentLesson.flashcards}
						onCardAction={handleCardAction}
						onLessonComplete={handleLessonComplete}
						sessionStats={sessionStats}
						onUpdateStats={updateSessionStats}
					/>
				)}

				{currentMode === "voice" && (
					<VoicePractice
						onRecordingComplete={handleVoiceRecordingComplete}
						onCorrectPronunciation={() => {
							const newVoiceCount = Math.min(
								dailyProgress.voicePractice + 1,
								dailyProgress.voiceGoal
							);
							setDailyProgress((prev) => ({
								...prev,
								voicePractice: newVoiceCount,
							}));

							if (newVoiceCount === dailyProgress.voiceGoal) {
								showCelebrationNotification(
									"Voice Practice Goal Achieved!",
									"Amazing! You've completed your daily voice practice goal!"
								);
							}
						}}
						flashcards={currentLesson.flashcards}
						sessionStats={sessionStats}
						onUpdateStats={updateSessionStats}
					/>
				)}

				{currentMode === "text" && (
					<TextExercise
						onComplete={handleTextExerciseComplete}
						onIncorrect={handleTextExerciseIncorrect}
						flashcards={currentLesson.flashcards}
						sessionStats={sessionStats}
						onUpdateStats={updateSessionStats}
					/>
				)}
			</div>

			{}
			<div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-6 py-4">
				<button
					onClick={() => setIsBottomSheetOpen(true)}
					className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-cyan-700 transition-all flex items-center justify-center space-x-2 shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
				>
					<Icon name="menu_book" className="text-white" size={20} />
					<span>Change Lesson</span>
				</button>
			</div>

			{}
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				user={currentUserProfile}
				lessons={lessons}
				onSelectLesson={handleLessonChange}
				currentLesson={currentLesson}
				onLogout={handleLogout}
			/>

			{}
			<BottomSheet
				isOpen={isBottomSheetOpen}
				onClose={() => setIsBottomSheetOpen(false)}
				lessons={lessons}
				onSelectLesson={handleLessonChange}
			/>

			{}
			<DailyMissionsModal
				isOpen={isMissionsModalOpen}
				onClose={() => setIsMissionsModalOpen(false)}
				dailyProgress={dailyProgress}
			/>
		</div>
	);
};

export default LinguaLearn;

const styles = `
@keyframes wiggle {
  0% { transform: translateY(0); }
  25% { transform: translateY(-2px); }
  75% { transform: translateY(2px); }
  100% { transform: translateY(0); }
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.33);
  }
  40%,
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.33);
  }
}

@keyframes success-bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -10px, 0);
  }
  70% {
    transform: translate3d(0, -5px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}


::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(247, 248, 253, 0.8);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #06b6d4);
  border-radius: 10px;
  border: 2px solid rgba(247, 248, 253, 0.8);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #0891b2);
}


* {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 rgba(247, 248, 253, 0.8);
}


.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(229, 231, 235, 0.5);
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #3b82f6);
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4f46e5, #2563eb);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}


.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}


.animate-success {
  animation: success-bounce 1s ease-in-out;
}

.animate-pulse-ring {
  animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}


.focus-ring {
  transition: all 0.2s ease-in-out;
}

.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}


.hover-lift {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}


.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}


.card-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}


.border-gradient {
  border: 2px solid;
  border-image: linear-gradient(45deg, #3b82f6, #06b6d4) 1;
}


button, .cursor-pointer {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}


@media (max-width: 768px) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}
`;

if (typeof document !== "undefined") {
	const styleSheet = document.createElement("style");
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);
}
