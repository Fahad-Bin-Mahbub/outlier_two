"use client";

import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";
import {
	ExclamationCircleIcon as AlertCircle,
	PlayCircleIcon as PlayCircle,
	PauseCircleIcon as PauseCircle,
	ForwardIcon as SkipForward,
	BellIcon as Bell,
	ClockIcon as Clock,
	UsersIcon as Users,
	ChartBarIcon as Activity,
	CodeBracketIcon as Code,
	ChevronRightIcon as ChevronRight,
	ChevronLeftIcon as ChevronLeft,
	ShareIcon as Share2,
	CpuChipIcon as Cpu,
	ChartBarIcon as BarChart3,
	BugAntIcon as Bug,
	CheckCircleIcon as CheckCircle,
	XCircleIcon as XCircle,
	BoltIcon as Zap,
	EyeIcon as Eye,
	ChatBubbleLeftRightIcon as MessageSquare,
	Cog6ToothIcon as Settings,
	CircleStackIcon as Database,
	CommandLineIcon as Terminal,
	RectangleGroupIcon as Layers,
	ArrowTrendingUpIcon as TrendingUp,
	ExclamationTriangleIcon as AlertTriangle,
	SparklesIcon as Sparkles,
	ComputerDesktopIcon as Monitor,
	CodeBracketSquareIcon as GitBranch,
	ArrowPathIcon as RefreshCw,
	ArrowDownTrayIcon as Download,
	ArrowUpTrayIcon as Upload,
	FunnelIcon as Filter,
	MagnifyingGlassIcon as Search,
	ClipboardIcon as Copy,
	ArrowTopRightOnSquareIcon as ExternalLink,
	ArrowUpRightIcon as ArrowUpRight,
	EllipsisHorizontalCircleIcon as Circle,
	EnvelopeIcon as Mail,
} from "@heroicons/react/24/outline";

const scrollbarStyles = `
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #8b5cf6, #7c3aed);
    border-radius: 8px;
    border: 1px solid #2d1b69;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #a855f7, #8b5cf6);
  }

  ::-webkit-scrollbar-corner {
    background: #1a1a1a;
  }

  
  * {
    scrollbar-width: thin;
    scrollbar-color: #8b5cf6 #1a1a1a;
  }
`;

interface WorkflowStep {
	id: string;
	name: string;
	type: "api" | "transform" | "condition" | "loop" | "webhook";
	code: string;
	duration?: number;
	status?: "pending" | "running" | "success" | "error" | "paused";
	error?: string;
	input?: any;
	output?: any;
	breakpoint?: boolean;
	performance?: {
		cpu: number;
		memory: number;
		networkLatency?: number;
	};
}

interface ExecutionFrame {
	id: string;
	timestamp: number;
	stepId: string;
	state: any;
	variables: Record<string, any>;
	performance: {
		cpu: number;
		memory: number;
		duration: number;
	};
}

interface AIAnalysis {
	summary: string;
	suggestions: string[];
	codeIssues: Array<{
		line: number;
		severity: "error" | "warning" | "info";
		message: string;
	}>;
	performanceInsights: string[];
}

interface SharedSession {
	id: string;
	users: Array<{
		id: string;
		name: string;
		color: string;
		cursor?: { x: number; y: number };
	}>;
	messages: Array<{ userId: string; message: string; timestamp: number }>;
}

export default function AssistantAIExport() {
	const [workflow, setWorkflow] = useState<WorkflowStep[]>([
		{
			id: "1",
			name: "Fetch User Data",
			type: "api",
			code: `const response = await fetch('/api/users/' + userId);
const data = await response.json();
return data;`,
			breakpoint: false,
		},
		{
			id: "2",
			name: "Transform Data",
			type: "transform",
			code: `const transformed = data.map(user => ({
  ...user,
  fullName: user.firstName + ' ' + user.lastName,
  isActive: user.status === 'active'
}));
return transformed;`,
			breakpoint: true,
		},
		{
			id: "3",
			name: "Filter Active Users",
			type: "condition",
			code: `const activeUsers = transformed.filter(user => user.isActive);
if (activeUsers.length === 0) {
  throw new Error('No active users found');
}
return activeUsers;`,
			breakpoint: false,
		},
		{
			id: "4",
			name: "Send Notifications",
			type: "webhook",
			code: `for (const user of activeUsers) {
  await sendNotification(user.email, {
    subject: 'Update Available',
    body: 'Check out our latest features!'
  });
}
return { notified: activeUsers.length };`,
			breakpoint: false,
		},
	]);

	const [executionHistory, setExecutionHistory] = useState<ExecutionFrame[]>(
		[]
	);
	const [currentFrame, setCurrentFrame] = useState<number>(0);
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const [selectedStep, setSelectedStep] = useState<string | null>(
		workflow.length > 0 ? workflow[0].id : null
	);
	const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
	const [showHeatmap, setShowHeatmap] = useState(false);
	const [session, setSession] = useState<SharedSession | null>(null);

	const [showSettings, setShowSettings] = useState(false);
	const [monitoringData, setMonitoringData] = useState<any>(null);
	const [activeTab, setActiveTab] = useState<
		"code" | "performance" | "timetravel" | "ai"
	>("code");

	const [searchTerm, setSearchTerm] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const [isMobileWorkflowOpen, setIsMobileWorkflowOpen] = useState(false);
	const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	const [showShareModal, setShowShareModal] = useState(false);
	const [shareEmail, setShareEmail] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [sendFeedback, setSendFeedback] = useState("");
	const [showProfileCircle, setShowProfileCircle] = useState(false);
	const [invitedGuests, setInvitedGuests] = useState<
		Array<{ id: string; email: string; guestNumber: number }>
	>([]);

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const checkMobile = () => {
			if (typeof window !== "undefined") {
				setIsMobile(window.innerWidth < 1024);
				if (window.innerWidth >= 1024) {
					setIsMobileWorkflowOpen(false);
					setIsMobileChatOpen(false);
				}
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener("resize", checkMobile);
			}
		};
	}, []);

	const colorScheme = {
		primary: "from-violet-600 to-purple-700",
		secondary: "from-cyan-500 to-blue-600",
		success: "from-emerald-500 to-green-600",
		warning: "from-amber-500 to-orange-600",
		error: "from-red-500 to-pink-600",
		background: "from-slate-950 via-purple-950 to-slate-950",
		surface: "bg-slate-900/80 backdrop-blur-sm",
		surfaceHover: "hover:bg-slate-800/90",
		border: "border-slate-700/60",
		accent: "from-fuchsia-500 to-violet-600",
		card: "bg-gradient-to-br from-slate-900 to-slate-800/90 shadow-lg shadow-black/20",
		cardHover:
			"hover:shadow-xl hover:shadow-black/30 transition-all duration-300",
		divider:
			"bg-gradient-to-r from-transparent via-slate-700/50 to-transparent",
	};

	const getStepTypeStyle = (type: string) => {
		switch (type) {
			case "api":
				return "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-cyan-500/60 text-cyan-200";
			case "transform":
				return "bg-gradient-to-r from-purple-500/30 to-violet-500/30 border-violet-500/60 text-violet-200";
			case "condition":
				return "bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border-yellow-500/60 text-yellow-200";
			case "loop":
				return "bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-emerald-500/60 text-emerald-200";
			case "webhook":
				return "bg-gradient-to-r from-pink-500/30 to-rose-500/30 border-rose-500/60 text-rose-200";
			default:
				return "bg-gradient-to-r from-slate-500/30 to-gray-500/30 border-gray-500/60 text-gray-200";
		}
	};

	const getStatusStyle = (status?: string) => {
		switch (status) {
			case "running":
				return "bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-400/50 animate-pulse";
			case "success":
				return "bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-400/50";
			case "error":
				return "bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-400/50";
			case "paused":
				return "bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg shadow-orange-400/50";
			default:
				return "bg-gradient-to-r from-slate-400 to-gray-500";
		}
	};

	const executeWorkflow = useCallback(async () => {
		setIsRunning(true);
		setIsPaused(false);
		setExecutionHistory([]);
		const frames: ExecutionFrame[] = [];

		if (workflow.length > 0) {
			setSelectedStep(workflow[0].id);
			setActiveTab("code");
		}

		for (let i = 0; i < workflow.length; i++) {
			const step = workflow[i];

			if (step.breakpoint && !isPaused) {
				setIsPaused(true);
				setWorkflow((prev) =>
					prev.map((s) => (s.id === step.id ? { ...s, status: "paused" } : s))
				);
				await new Promise((resolve) => {
					const checkPause = setInterval(() => {
						if (!isPaused) {
							clearInterval(checkPause);
							resolve(undefined);
						}
					}, 100);
				});
			}

			const startTime = Date.now();

			setWorkflow((prev) =>
				prev.map((s) => (s.id === step.id ? { ...s, status: "running" } : s))
			);

			const frame: ExecutionFrame = {
				id: `frame-${startTime}-${step.id}-${Math.random()
					.toString(36)
					.substr(2, 9)}`,
				timestamp: startTime,
				stepId: step.id,
				state: { currentStep: i, totalSteps: workflow.length },
				variables: {
					userId: "123",
					data:
						step.id === "1"
							? [
									{
										id: "1",
										firstName: "John",
										lastName: "Doe",
										status: "active",
									},
							  ]
							: undefined,
					transformed:
						step.id === "2"
							? [{ id: "1", fullName: "John Doe", isActive: true }]
							: undefined,
					activeUsers:
						step.id === "3"
							? [{ id: "1", fullName: "John Doe", isActive: true }]
							: undefined,
				},
				performance: {
					cpu: Math.random() * 80 + 10,
					memory: Math.random() * 800 + 200,
					duration: Math.random() * 800 + 200,
				},
			};

			frames.push(frame);
			setExecutionHistory((prev) => [...prev, frame]);

			await new Promise((resolve) =>
				setTimeout(resolve, frame.performance.duration)
			);

			const hasError = Math.random() > 0.85;
			const errorMessages = [
				"Network timeout - API request failed",
				"Invalid data format received",
				"Authentication token expired",
				"Rate limit exceeded",
				"Database connection lost",
			];

			setWorkflow((prev) =>
				prev.map((s) =>
					s.id === step.id
						? {
								...s,
								status: hasError ? "error" : "success",
								error: hasError
									? errorMessages[
											Math.floor(Math.random() * errorMessages.length)
									  ]
									: undefined,
								duration: frame.performance.duration,
								performance: {
									cpu: frame.performance.cpu,
									memory: frame.performance.memory,
									networkLatency: Math.random() * 150 + 50,
								},
						  }
						: s
				)
			);

			if (hasError) break;
		}

		setIsRunning(false);
		setCurrentFrame(frames.length - 1);
	}, [workflow, isPaused]);

	const analyzeError = useCallback((step: WorkflowStep) => {
		setIsAnalyzing(true);

		setTimeout(() => {
			setAiAnalysis({
				summary: `🤖 **Deep Analysis Complete**\n\nThe error in "${step.name}" appears to be a critical network connectivity issue. Based on the execution context and error patterns, this is likely caused by:\n\n• **Primary Issue**: API endpoint unreachable or timeout\n• **Secondary Effects**: Cascading failures in downstream steps\n• **Risk Level**: High - affects core workflow functionality`,

				suggestions: [
					"🔄 Implement exponential backoff retry mechanism (3-5 attempts)",
					"⚡ Add circuit breaker pattern to prevent cascade failures",
					"📊 Set up real-time monitoring with alerting thresholds",
					"🔄 Consider implementing request queuing for high-load scenarios",
					"🛡️ Add comprehensive error boundaries with graceful degradation",
					"📈 Implement caching layer to reduce API dependency",
				],

				codeIssues: [
					{
						line: 1,
						severity: "error",
						message:
							"Missing comprehensive error handling - potential unhandled promise rejection",
					},
					{
						line: 2,
						severity: "warning",
						message:
							"No response validation - could cause runtime errors with malformed data",
					},
					{
						line: 1,
						severity: "info",
						message:
							"Consider adding request timeout configuration for better control",
					},
				],

				performanceInsights: [
					"⚡ Average API response time: 350ms (consider 200ms target)",
					"🧠 Memory usage spikes by 40% during data transformation",
					"🔄 CPU utilization peaks at 75% - optimize data processing loops",
					"📡 Network latency varies 50-150ms - implement regional endpoints",
					"💾 Consider implementing streaming for large dataset processing",
				],
			});
			setIsAnalyzing(false);
		}, 2000);
	}, []);

	const drawHeatmap = useCallback(() => {
		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;

		const width = canvasRef.current.width;
		const height = canvasRef.current.height;
		ctx.clearRect(0, 0, width, height);

		const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
		bgGradient.addColorStop(0, "rgba(15, 23, 42, 0.9)");
		bgGradient.addColorStop(1, "rgba(30, 41, 59, 0.9)");
		ctx.fillStyle = bgGradient;
		ctx.fillRect(0, 0, width, height);

		const stepWidth = width / workflow.length;
		const availableHeight = height - 80;
		const baseY = height - 60;
		const textY = height - 35;
		const indicatorY = height - 25;
		const connectionY = height - 15;

		workflow.forEach((step, index) => {
			const centerX = index * stepWidth + stepWidth / 2;
			const barWidth = stepWidth - 20;
			const barStartX = centerX - barWidth / 2;

			const cpuHeight =
				((step.performance?.cpu || 0) * (availableHeight * 0.4)) / 100;
			const cpuGradient = ctx.createLinearGradient(
				barStartX,
				baseY - cpuHeight,
				barStartX,
				baseY
			);
			cpuGradient.addColorStop(
				0,
				`hsl(${280 - (step.performance?.cpu || 0) * 2}, 80%, 65%)`
			);
			cpuGradient.addColorStop(
				1,
				`hsl(${280 - (step.performance?.cpu || 0) * 2}, 80%, 45%)`
			);
			ctx.fillStyle = cpuGradient;
			ctx.fillRect(barStartX, baseY - cpuHeight, barWidth / 2 - 2, cpuHeight);

			const memHeight =
				((step.performance?.memory || 0) * (availableHeight * 0.4)) / 1000;
			const memGradient = ctx.createLinearGradient(
				barStartX + barWidth / 2,
				baseY - memHeight,
				barStartX + barWidth / 2,
				baseY
			);
			memGradient.addColorStop(
				0,
				`hsl(${200 - (step.performance?.memory || 0) * 0.1}, 80%, 65%)`
			);
			memGradient.addColorStop(
				1,
				`hsl(${200 - (step.performance?.memory || 0) * 0.1}, 80%, 45%)`
			);
			ctx.fillStyle = memGradient;
			ctx.fillRect(
				barStartX + barWidth / 2,
				baseY - memHeight,
				barWidth / 2 - 2,
				memHeight
			);

			ctx.shadowColor =
				step.status === "error"
					? "#ef4444"
					: step.status === "success"
					? "#10b981"
					: "#6366f1";
			ctx.shadowBlur = 15;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;

			ctx.shadowBlur = 0;
		});

		ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
		ctx.font = "bold 16px Inter, system-ui, sans-serif";
		ctx.textAlign = "center";

		workflow.forEach((step, index) => {
			const centerX = index * stepWidth + stepWidth / 2;
			const labelText =
				step.name.slice(0, 26) + (step.name.length > 26 ? "..." : "");

			ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
			ctx.fillText(labelText, centerX, textY);
		});

		workflow.forEach((step, index) => {
			const centerX = index * stepWidth + stepWidth / 2;
			const labelText =
				step.name.slice(0, 26) + (step.name.length > 26 ? "..." : "");

			ctx.font = "bold 16px Inter, system-ui, sans-serif";
			const textMetrics = ctx.measureText(labelText);
			const actualTextWidth = textMetrics.width;

			const indicatorColor =
				step.status === "error"
					? "#ef4444"
					: step.status === "success"
					? "#10b981"
					: "#6366f1";
			ctx.fillStyle = indicatorColor;
			ctx.fillRect(
				centerX - actualTextWidth / 2,
				indicatorY,
				actualTextWidth,
				3
			);
		});

		workflow.forEach((step, index) => {
			const centerX = index * stepWidth + stepWidth / 2;
			const stepColor =
				step.status === "error"
					? "#ef4444"
					: step.status === "success"
					? "#10b981"
					: "#6366f1";

			ctx.beginPath();
			ctx.arc(centerX, connectionY, 6, 0, 2 * Math.PI);
			ctx.fillStyle = stepColor;
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
			ctx.lineWidth = 2;
			ctx.stroke();

			if (index < workflow.length - 1) {
				const nextCenterX = (index + 1) * stepWidth + stepWidth / 2;
				const arrowStartX = centerX + 8;
				const arrowEndX = nextCenterX - 8;
				const arrowY = connectionY;

				ctx.beginPath();
				ctx.moveTo(arrowStartX, arrowY);
				ctx.lineTo(arrowEndX, arrowY);
				ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
				ctx.lineWidth = 2;
				ctx.stroke();

				const arrowHeadSize = 4;
				ctx.beginPath();
				ctx.moveTo(arrowEndX, arrowY);
				ctx.lineTo(arrowEndX - arrowHeadSize, arrowY - arrowHeadSize);
				ctx.lineTo(arrowEndX - arrowHeadSize, arrowY + arrowHeadSize);
				ctx.closePath();
				ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				ctx.fill();
			}
		});
	}, [workflow]);

	useEffect(() => {
		if (showHeatmap || activeTab === "performance") {
			drawHeatmap();
		}
	}, [showHeatmap, workflow, drawHeatmap, activeTab]);

	const shareSession = useCallback(() => {
		setShowShareModal(true);
	}, []);

	const isValidEmail = useCallback((email: string) => {
		return email.includes("@") && email.includes(".");
	}, []);

	const copySessionLink = useCallback(() => {
		const sessionId = Math.random().toString(36).substr(2, 9);
		const link = `https://debugger.app/session/${sessionId}`;
		navigator.clipboard.writeText(link);

		setToastMessage("🔗 Session link copied to clipboard!");
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	}, []);

	const sendSessionEmail = useCallback(() => {
		if (!isValidEmail(shareEmail)) return;

		const sessionId = Math.random().toString(36).substr(2, 9);
		const link = `https://debugger.app/session/${sessionId}`;

		setSendFeedback(`✓ Session sent to ${shareEmail}`);

		const guestNumber = invitedGuests.length + 1;
		const newGuest = {
			id: Date.now().toString(),
			email: shareEmail,
			guestNumber: guestNumber,
		};

		setInvitedGuests((prev: any) => [...prev, newGuest]);
		setShowProfileCircle(true);

		setTimeout(() => {
			setSendFeedback("");
			setShareEmail("");
			setShowShareModal(false);
		}, 2000);
	}, [shareEmail, isValidEmail, invitedGuests.length]);

	const removeGuest = useCallback(
		(guestId: string) => {
			setInvitedGuests((prev: any) =>
				prev.filter((guest: any) => guest.id !== guestId)
			);

			if (invitedGuests.length <= 1) {
				setShowProfileCircle(false);
			}
		},
		[invitedGuests.length]
	);

	const filteredWorkflow = useMemo(() => {
		return workflow.filter(
			(step) =>
				step.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				step.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
				step.code.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [workflow, searchTerm]);

	return (
		<div
			className={`min-h-screen bg-gradient-to-br ${colorScheme.background} text-slate-100`}
		>
			<style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
			{}
			<header
				className={`${colorScheme.surface} border-b ${colorScheme.border} px-4 lg:px-6 py-3 lg:py-4 backdrop-blur-xl sticky top-0 z-30`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3 lg:space-x-6">
						<div className="flex items-center space-x-2 lg:space-x-3">
							<div>
								<h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
									AI Debugger
								</h1>
								<p className="text-xs lg:text-sm text-slate-300 hidden sm:block">
									Next.js Enhanced Edition
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-2 lg:space-x-3">
						{}
						{isMobile && (
							<button
								onClick={() => setIsMobileWorkflowOpen(!isMobileWorkflowOpen)}
								className={`flex items-center space-x-1 px-2.5 lg:px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200 shadow-lg lg:hidden mr-1 ${colorScheme.card} ${colorScheme.cardHover}`}
								aria-label="Toggle workflow panel"
							>
								<Terminal className="w-4 h-4" />
								<span className="font-medium text-xs sm:inline">Code</span>
							</button>
						)}

						<button
							onClick={shareSession}
							className={`flex items-center cursor-pointer space-x-1 px-2.5 lg:px-4 py-2 bg-gradient-to-r ${colorScheme.primary} rounded-lg hover:scale-105 transition-all duration-200 shadow-lg`}
							aria-label="Share session"
						>
							<Share2 className="w-4 h-4" />
							<span className="font-medium text-xs sm:inline">Share</span>
						</button>

						{}
						{showProfileCircle && invitedGuests.length > 0 && (
							<div className="flex items-center space-x-1 h-10 lg:h-12">
								{invitedGuests.map((guest: any) => (
									<div
										key={guest.id}
										className="relative group flex items-center"
									>
										<div className="flex flex-col items-center justify-center">
											<div className="relative flex items-center justify-center">
												<div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold border-2 border-purple-400 shadow-md">
													U
												</div>
												<div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-800"></div>
												{}
												<button
													onClick={() => removeGuest(guest.id)}
													className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10"
													title={`Remove ${guest.email}`}
													tabIndex={-1}
													aria-label={`Remove ${guest.email}`}
												>
													<XCircle className="w-2.5 h-2.5 text-white" />
												</button>
											</div>
											{}
											<span
												className="text-[10px] lg:text-xs text-slate-300 mt-0.5 leading-none whitespace-nowrap"
												style={{ lineHeight: "1" }}
											>
												guest {guest.guestNumber}
											</span>
										</div>
									</div>
								))}
							</div>
						)}

						{session && (
							<div className="flex items-center space-x-2 lg:space-x-3">
								<div className="hidden lg:flex items-center space-x-2">
									<Users className="w-4 h-4 text-slate-300" />
									<span className="text-sm font-medium text-slate-300">
										{session?.users?.length || 0} users
									</span>
								</div>
								<div className="flex -space-x-2">
									{session?.users?.slice(0, isMobile ? 2 : 3).map((user) => (
										<div
											key={user.id}
											className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-800 shadow-lg"
											style={{ backgroundColor: user.color }}
											title={user.name}
										>
											{user.name[0]}
										</div>
									))}
									{isMobile && session?.users && session.users.length > 2 && (
										<div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-800 shadow-lg bg-slate-600">
											+{session.users.length - 2}
										</div>
									)}
								</div>

								{}
								{isMobile && (
									<button
										onClick={() => setIsMobileChatOpen(!isMobileChatOpen)}
										className={`p-2 rounded-lg ${colorScheme.card} ${colorScheme.cardHover} transition-all duration-200`}
										aria-label="Toggle chat panel"
									>
										<MessageSquare className="w-4 h-4" />
									</button>
								)}
							</div>
						)}

						<button
							onClick={() => setShowSettings(!showSettings)}
							className={`p-2.5 lg:p-3 rounded-lg cursor-pointer ${colorScheme.card} ${colorScheme.cardHover} transition-all duration-200`}
							aria-label="Settings"
						>
							<Settings className="w-5 h-5 lg:w-5 lg:h-5" />
						</button>
					</div>
				</div>
			</header>

			<div className="flex h-[calc(100vh-60px)] lg:h-[calc(100vh-72px)] relative">
				{}
				<div
					className={`${
						isMobile
							? `fixed inset-y-0 left-0 z-40 w-full max-w-[300px] transform transition-transform duration-300 ${
									isMobileWorkflowOpen ? "translate-x-0" : "-translate-x-full"
							  }`
							: "w-full max-w-[300px] lg:max-w-[320px] xl:max-w-[360px]"
					} ${colorScheme.card} p-3 lg:p-4 border-r ${
						colorScheme.border
					} overflow-y-auto backdrop-blur-xl shadow-xl shadow-black/20`}
				>
					<div className="flex items-center justify-between mb-3 lg:mb-4">
						<h2 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
							Workflow Steps
						</h2>

						<div className="flex items-center space-x-1 lg:space-x-2">
							{}
							{isMobile && (
								<button
									onClick={() => setIsMobileWorkflowOpen(false)}
									className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors lg:hidden mr-2"
									title="Close Panel"
									aria-label="Close workflow panel"
								>
									<XCircle className="w-4 h-4" />
								</button>
							)}

							<button
								onClick={executeWorkflow}
								disabled={isRunning}
								className={`p-1.5 lg:p-2 bg-gradient-to-r ${colorScheme.success} rounded-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-200 shadow-lg`}
								aria-label="Run workflow"
							>
								{isRunning ? (
									<RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
								) : (
									<PlayCircle className="w-4 h-4 lg:w-5 lg:h-5" />
								)}
							</button>
							<button
								onClick={() => setIsPaused(!isPaused)}
								disabled={!isRunning}
								className={`p-1.5 lg:p-2 bg-gradient-to-r ${colorScheme.warning} rounded-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-200 shadow-lg`}
								aria-label={isPaused ? "Resume workflow" : "Pause workflow"}
							>
								<PauseCircle className="w-4 h-4 lg:w-5 lg:h-5" />
							</button>
						</div>
					</div>

					{}
					<div className="relative mb-3 lg:mb-4">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search workflow steps..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`w-full pl-10 pr-4 py-2 lg:py-2.5 rounded-xl border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200 text-sm lg:text-base bg-slate-800/60`}
							aria-label="Search workflow steps"
						/>
					</div>

					<div className="space-y-2.5 lg:space-y-3">
						{filteredWorkflow.map((step, index) => (
							<div
								key={step.id}
								className={`p-3 lg:p-3.5 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
									selectedStep === step.id
										? "border-violet-500/70 bg-violet-500/20 shadow-lg shadow-violet-500/30"
										: `${colorScheme.border} ${colorScheme.card} hover:border-violet-500/40 hover:shadow-lg ${colorScheme.cardHover}`
								}`}
								onClick={() => {
									setSelectedStep(step.id);
									if (isMobile) setIsMobileWorkflowOpen(false);
								}}
								tabIndex={0}
								role="button"
								aria-selected={selectedStep === step.id}
								aria-label={`Select ${step.name}`}
							>
								<div className="flex items-center justify-between mb-2 lg:mb-2.5">
									<div className="flex items-center space-x-2 lg:space-x-3">
										<div
											className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full ${getStatusStyle(
												step.status
											)} transition-all duration-300`}
											aria-hidden="true"
										/>
										<h3 className="font-medium text-slate-200 group-hover:text-white transition-colors text-sm lg:text-base truncate">
											{step.name}
										</h3>
									</div>
									<div className="flex items-center space-x-1 lg:space-x-2">
										{step.breakpoint && (
											<div
												className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full shadow-lg shadow-red-400/50"
												aria-label="Breakpoint set"
											/>
										)}
										{step.duration && (
											<span
												className="text-xs text-slate-300 font-mono bg-slate-800/70 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded"
												title={`Duration: ${step.duration.toFixed(0)}ms`}
											>
												{step.duration.toFixed(0)}ms
											</span>
										)}
									</div>
								</div>

								<div className="flex items-center justify-between mb-2 lg:mb-2.5">
									<span
										className={`px-2 lg:px-2.5 py-0.5 lg:py-0.5 rounded-full text-xs font-medium border ${getStepTypeStyle(
											step.type
										)}`}
									>
										{step.type.toUpperCase()}
									</span>
									{step.error && (
										<div className="flex items-center space-x-1 text-red-300">
											<AlertCircle className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
											<span
												className="text-xs truncate max-w-20 lg:max-w-32"
												title={step.error}
											>
												{step.error}
											</span>
										</div>
									)}
								</div>

								{step.performance && (
									<div className="grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-2 text-xs">
										<div className="flex items-center space-x-1 text-cyan-300 bg-cyan-500/20 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded">
											<Cpu className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
											<span>{step.performance.cpu.toFixed(1)}%</span>
										</div>
										<div className="flex items-center space-x-1 text-purple-300 bg-purple-500/20 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded">
											<Database className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
											<span>{step.performance.memory.toFixed(0)}MB</span>
										</div>
										{step.performance.networkLatency && (
											<div className="flex items-center space-x-1 text-emerald-300 bg-emerald-500/20 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded col-span-2 lg:col-span-1">
												<Activity className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
												<span>
													{step.performance.networkLatency.toFixed(0)}ms
												</span>
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{}
				{isMobile && isMobileWorkflowOpen && (
					<div
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
						onClick={() => setIsMobileWorkflowOpen(false)}
						aria-hidden="true"
					/>
				)}

				{}
				<div
					className={`flex-1 flex flex-col ${
						isMobile && isMobileWorkflowOpen ? "blur-sm" : ""
					}`}
				>
					{}
					<div
						className={`${colorScheme.card} border-b ${colorScheme.border} px-3 lg:px-4 shadow-lg`}
					>
						<div className="flex space-x-1 overflow-x-auto scrollbar-hide py-1">
							{[
								{
									id: "code",
									label: "Code & Debug",
									icon: Code,
									shortLabel: "Code",
								},
								{
									id: "performance",
									label: "Performance",
									icon: BarChart3,
									shortLabel: "Perf",
								},
								{
									id: "timetravel",
									label: "Time Travel",
									icon: Clock,
									shortLabel: "Time",
								},
								{
									id: "ai",
									label: "AI Analysis",
									icon: Sparkles,
									shortLabel: "AI",
								},
							].map(({ id, label, icon: Icon, shortLabel }) => (
								<button
									key={id}
									onClick={() => setActiveTab(id as any)}
									className={`flex items-center space-x-1.5 px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
										activeTab === id
											? `bg-gradient-to-r ${colorScheme.primary} text-white shadow-lg`
											: `text-slate-300 hover:text-slate-100 hover:bg-slate-800/60`
									}`}
									aria-selected={activeTab === id}
									aria-label={label}
								>
									<Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
									<span className="font-medium text-xs lg:text-sm">
										{isMobile ? shortLabel : label}
									</span>
								</button>
							))}
						</div>
					</div>

					{}
					<div className="flex-1 flex overflow-hidden">
						{}
						<div className="flex-1 p-3 lg:p-4 flex flex-col min-h-0 overflow-y-auto">
							{activeTab === "code" &&
								selectedStep &&
								workflow.find((s) => s.id === selectedStep) && (
									<div className="h-full flex flex-col min-h-0">
										<div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-4 space-y-2 lg:space-y-0 flex-shrink-0">
											<div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
												<h3 className="text-base lg:text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent truncate">
													{workflow.find((s) => s.id === selectedStep)?.name}
												</h3>
												<span
													className={`px-1.5 lg:px-2.5 py-0.5 lg:py-0.5 rounded-full text-xs lg:text-sm font-medium border ${getStepTypeStyle(
														workflow.find((s) => s.id === selectedStep)?.type ||
															""
													)} flex-shrink-0`}
												>
													{workflow
														.find((s) => s.id === selectedStep)
														?.type.toUpperCase()}
												</span>
											</div>
											<div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
												<button
													onClick={() => {
														const step = workflow.find(
															(s) => s.id === selectedStep
														);
														if (step) {
															setWorkflow((prev) =>
																prev.map((s) =>
																	s.id === selectedStep
																		? { ...s, breakpoint: !s.breakpoint }
																		: s
																)
															);
														}
													}}
													className={`flex items-center space-x-1.5 lg:space-x-2 px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg transition-all duration-200 ${
														workflow.find((s) => s.id === selectedStep)
															?.breakpoint
															? `bg-gradient-to-r ${colorScheme.error} hover:scale-105 shadow-lg`
															: `bg-slate-800 hover:bg-slate-700 hover:scale-105`
													}`}
													aria-label={
														workflow.find((s) => s.id === selectedStep)
															?.breakpoint
															? "Remove breakpoint"
															: "Add breakpoint"
													}
												>
													<Circle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
													<span className="text-xs lg:text-sm font-medium hidden sm:inline">
														{workflow.find((s) => s.id === selectedStep)
															?.breakpoint
															? "Remove"
															: "Add"}
														<span className="hidden lg:inline">
															{" "}
															Breakpoint
														</span>
													</span>
												</button>
												<button
													onClick={() => {
														analyzeError(
															workflow.find((s) => s.id === selectedStep)!
														);
														setActiveTab("ai");
													}}
													disabled={isAnalyzing}
													className={`flex items-center space-x-1.5 lg:space-x-2 px-2.5 lg:px-3.5 py-1.5 lg:py-2 bg-gradient-to-r ${colorScheme.accent} rounded-lg hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:scale-100`}
													aria-label="Analyze with AI"
												>
													{isAnalyzing ? (
														<RefreshCw className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
													) : (
														<Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
													)}
													<span className="text-xs lg:text-sm font-medium hidden sm:inline">
														{isAnalyzing ? "Analyzing..." : "Analyze"}
														<span className="hidden lg:inline"> with AI</span>
													</span>
												</button>
											</div>
										</div>

										{}
										<div className="flex-1 min-h-0 flex flex-col space-y-3 lg:space-y-4">
											<div
												className={`flex-1 min-h-48 max-h-[40vh] lg:max-h-none ${colorScheme.card} rounded-xl p-2 lg:p-3 xl:p-4 font-mono text-xs lg:text-sm border ${colorScheme.border} shadow-2xl shadow-black/30 flex flex-col`}
											>
												<div className="flex items-center justify-between mb-2 lg:mb-3 flex-shrink-0">
													<div className="flex items-center space-x-1 lg:space-x-2 min-w-0 flex-1">
														<span className="ml-1 lg:ml-3 text-slate-300 text-xs truncate">
															{workflow
																.find((s) => s.id === selectedStep)
																?.name.toLowerCase()
																.replace(/\s+/g, "_")}
															.js
														</span>
													</div>
													<div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
														<button
															className="p-1 hover:bg-slate-700 rounded"
															aria-label="Copy code"
														>
															<Copy className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-slate-300" />
														</button>
														<button
															className="p-1 hover:bg-slate-700 rounded"
															aria-label="Open in external editor"
														>
															<ExternalLink className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-slate-300" />
														</button>
													</div>
												</div>
												<div className="flex-1 min-h-0 overflow-auto rounded-lg bg-slate-950/60 p-3">
													<pre className="text-slate-100 leading-relaxed h-full whitespace-pre-wrap break-words">
														<code>
															{
																workflow.find((s) => s.id === selectedStep)
																	?.code
															}
														</code>
													</pre>
												</div>
											</div>

											{}
											<div
												className={`max-h-[30vh] lg:max-h-none ${colorScheme.card} rounded-xl p-2 lg:p-3 xl:p-4 border ${colorScheme.border} backdrop-blur-sm flex flex-col flex-shrink-0 shadow-xl shadow-black/20`}
											>
												<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 lg:mb-3 space-y-1 sm:space-y-0 flex-shrink-0">
													<h4 className="text-sm lg:text-base font-semibold flex items-center space-x-2 text-slate-100">
														<Terminal className="w-3 h-3 lg:w-4 lg:h-4 text-violet-400" />
														<span>Variables Inspector</span>
													</h4>
													<div className="flex items-center space-x-2 text-xs lg:text-sm text-slate-300 flex-shrink-0">
														<Clock className="w-3 h-3 lg:w-4 lg:h-4" />
														<span>
															Frame {currentFrame + 1} of{" "}
															{executionHistory.length || 1}
														</span>
													</div>
												</div>
												<div className="flex-1 min-h-0 bg-slate-900/90 rounded-lg p-2 lg:p-3 font-mono text-xs lg:text-sm border border-slate-700/50 overflow-auto">
													{executionHistory.length > currentFrame &&
													executionHistory[currentFrame] ? (
														<pre className="text-slate-100 whitespace-pre-wrap break-words">
															{JSON.stringify(
																executionHistory[currentFrame].variables,
																null,
																2
															)}
														</pre>
													) : (
														<div className="text-slate-400 italic">
															No execution data available. Run the workflow to
															see variables.
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								)}

							{activeTab === "performance" && (
								<div className="h-full flex flex-col overflow-hidden">
									<div className="flex items-center justify-between mb-4 flex-shrink-0">
										<h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
											Performance Analytics
										</h3>
									</div>

									<div className="flex-1 overflow-y-auto space-y-4 lg:space-y-5">
										<div
											className={`h-80 lg:h-96 ${colorScheme.card} rounded-xl p-4 lg:p-5 border ${colorScheme.border} shadow-xl shadow-black/30`}
										>
											<canvas
												ref={canvasRef}
												width={1000}
												height={300}
												className="w-full h-full rounded-lg"
											/>
										</div>

										<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3 text-xs lg:text-sm">
											<div className="flex items-center space-x-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg p-2 lg:p-3">
												<div className="w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded"></div>
												<span className="text-cyan-200">CPU Usage</span>
											</div>
											<div className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/40 rounded-lg p-2 lg:p-3">
												<div className="w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-purple-400 to-violet-400 rounded"></div>
												<span className="text-purple-200">Memory Usage</span>
											</div>
											<div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg p-2 lg:p-3">
												<div className="w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded"></div>
												<span className="text-emerald-200">
													Network Latency
												</span>
											</div>
											<div className="flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 rounded-lg p-2 lg:p-3">
												<div className="w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded"></div>
												<span className="text-amber-200">Execution Time</span>
											</div>
										</div>

										<div
											className={`${colorScheme.card} rounded-xl p-4 lg:p-5 border ${colorScheme.border} shadow-xl shadow-black/30`}
										>
											<h4 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 flex items-center space-x-2 text-slate-100">
												<TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
												<span>Performance Heatmap</span>
											</h4>

											{}
											<div className="mb-3 lg:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
												<div className="flex items-center space-x-3 text-xs">
													<span className="text-slate-300">
														Performance Intensity:
													</span>
													<div className="flex items-center space-x-1">
														<span className="text-slate-400">Low</span>
														<div className="w-16 lg:w-20 h-2 lg:h-3 bg-gradient-to-r from-green-500/40 via-yellow-500/60 to-red-500/80 rounded"></div>
														<span className="text-slate-400">High</span>
													</div>
												</div>
												<div className="text-xs text-slate-300">
													Workflow Steps × Time Frames
												</div>
											</div>

											{}
											<div className="bg-slate-900/90 rounded-lg p-3 lg:p-4 border border-slate-700/60">
												<div className="grid grid-cols-11 gap-1">
													{}
													<div className="text-xs text-slate-400 p-1 lg:p-2"></div>
													{Array.from({ length: 10 }, (_, i) => (
														<div
															key={i}
															className="text-xs text-slate-400 p-1 lg:p-2 text-center"
														>
															T{i + 1}
														</div>
													))}

													{}
													{workflow.map((step, stepIndex) => (
														<React.Fragment key={step.id}>
															{}
															<div className="text-xs text-slate-300 p-1 lg:p-2 truncate">
																{step.name}
															</div>
															{}
															{Array.from({ length: 10 }, (_, timeIndex) => {
																const cpuUsage =
																	(step.performance?.cpu || 0) +
																	Math.random() * 20;
																const memUsage =
																	(step.performance?.memory || 0) +
																	Math.random() * 100;
																const intensity = Math.min(
																	(cpuUsage + memUsage / 10) / 100,
																	1
																);

																const getHeatmapColor = (intensity: number) => {
																	if (intensity < 0.3)
																		return "bg-green-500/40 border-green-500/60";
																	if (intensity < 0.6)
																		return "bg-yellow-500/50 border-yellow-500/70";
																	if (intensity < 0.8)
																		return "bg-orange-500/60 border-orange-500/80";
																	return "bg-red-500/70 border-red-500/90";
																};

																return (
																	<div
																		key={timeIndex}
																		className={`h-6 lg:h-8 rounded border transition-all duration-200 hover:scale-110 cursor-pointer ${getHeatmapColor(
																			intensity
																		)}`}
																		title={`Step: ${step.name}\nTime: T${
																			timeIndex + 1
																		}\nCPU: ${cpuUsage.toFixed(
																			1
																		)}%\nMemory: ${memUsage.toFixed(
																			0
																		)}MB\nIntensity: ${(
																			intensity * 100
																		).toFixed(1)}%`}
																	></div>
																);
															})}
														</React.Fragment>
													))}
												</div>
											</div>

											{}
											<div className="mt-3 lg:mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 text-xs lg:text-sm">
												<div className="bg-slate-800/80 rounded-lg p-2 lg:p-3 border border-slate-700/50">
													<div className="text-slate-300 text-xs">
														Avg CPU Usage
													</div>
													<div className="text-cyan-200 font-semibold">
														{(
															workflow.reduce(
																(acc, step) =>
																	acc + (step.performance?.cpu || 0),
																0
															) / workflow.length
														).toFixed(1)}
														%
													</div>
												</div>
												<div className="bg-slate-800/80 rounded-lg p-2 lg:p-3 border border-slate-700/50">
													<div className="text-slate-300 text-xs">
														Avg Memory
													</div>
													<div className="text-purple-200 font-semibold">
														{(
															workflow.reduce(
																(acc, step) =>
																	acc + (step.performance?.memory || 0),
																0
															) / workflow.length
														).toFixed(0)}
														MB
													</div>
												</div>
												<div className="bg-slate-800/80 rounded-lg p-2 lg:p-3 border border-slate-700/50">
													<div className="text-slate-300 text-xs">
														Peak Performance
													</div>
													<div className="text-red-200 font-semibold">
														{Math.max(
															...workflow.map(
																(step) =>
																	(step.performance?.cpu || 0) +
																	(step.performance?.memory || 0) / 10
															)
														).toFixed(1)}
														%
													</div>
												</div>
												<div className="bg-slate-800/80 rounded-lg p-2 lg:p-3 border border-slate-700/50">
													<div className="text-slate-300 text-xs">
														Total Steps
													</div>
													<div className="text-emerald-200 font-semibold">
														{workflow.length}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{activeTab === "timetravel" && (
								<div className="h-full flex flex-col">
									<div className="flex items-center justify-between mb-4 flex-shrink-0">
										<h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
											Time Travel Debugging
										</h3>
										<div className="flex items-center space-x-2 text-xs lg:text-sm text-slate-300">
											<GitBranch className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
											<span>
												{executionHistory.length} execution frames captured
											</span>
										</div>
									</div>

									<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 overflow-y-auto">
										{}
										<div
											className={`${colorScheme.card} rounded-xl p-3 lg:p-4 border ${colorScheme.border} shadow-xl shadow-black/30`}
										>
											<h4 className="text-base lg:text-lg font-semibold mb-3 flex items-center space-x-2 text-slate-100">
												<Clock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
												<span>Execution Timeline</span>
											</h4>
											<div className="space-y-2 max-h-80 lg:max-h-96 overflow-y-auto pr-1">
												{executionHistory.length > 0 ? (
													executionHistory.map((frame, index) => (
														<div
															key={frame.id}
															onClick={() => setCurrentFrame(index)}
															className={`p-2.5 lg:p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
																currentFrame === index
																	? "border-blue-500/70 bg-blue-500/20 shadow-lg shadow-blue-500/30"
																	: "border-slate-700/60 bg-slate-800/60 hover:border-blue-500/40"
															}`}
															tabIndex={0}
															role="button"
															aria-selected={currentFrame === index}
															aria-label={`Frame ${index + 1}: ${
																workflow.find((s) => s.id === frame.stepId)
																	?.name || "Unknown step"
															}`}
														>
															<div className="flex items-center justify-between">
																<span className="font-medium text-sm text-slate-100">
																	{
																		workflow.find((s) => s.id === frame.stepId)
																			?.name
																	}
																</span>
																<span className="text-xs text-slate-300">
																	Frame {index + 1}
																</span>
															</div>
															<div className="text-xs text-slate-400 mt-1">
																{new Date(frame.timestamp).toLocaleTimeString()}{" "}
																• {frame.performance.duration.toFixed(0)}ms
															</div>
															<div className="flex items-center space-x-4 mt-2 text-xs">
																<div className="flex items-center space-x-1">
																	<Cpu className="w-3 h-3 text-cyan-400" />
																	<span className="text-cyan-300">
																		{frame.performance.cpu.toFixed(1)}%
																	</span>
																</div>
																<div className="flex items-center space-x-1">
																	<Database className="w-3 h-3 text-purple-400" />
																	<span className="text-purple-300">
																		{frame.performance.memory.toFixed(0)}MB
																	</span>
																</div>
															</div>
														</div>
													))
												) : (
													<div className="text-center text-slate-400 italic py-6">
														No execution frames available. Run the workflow to
														generate timeline data.
													</div>
												)}
											</div>
										</div>

										{}
										<div
											className={`${colorScheme.card} rounded-xl p-3 lg:p-4 border ${colorScheme.border} shadow-xl shadow-black/30`}
										>
											<h4 className="text-base lg:text-lg font-semibold mb-3 flex items-center space-x-2 text-slate-100">
												<Layers className="w-4 h-4 lg:w-5 lg:h-5 text-violet-400" />
												<span>Frame Details</span>
											</h4>
											{executionHistory[currentFrame] ? (
												<div className="space-y-3">
													<div className="bg-slate-900/90 rounded-lg p-3 border border-slate-700/60">
														<h5 className="text-xs lg:text-sm font-semibold text-slate-200 mb-2">
															State
														</h5>
														<pre className="text-xs text-slate-300 font-mono">
															{JSON.stringify(
																executionHistory[currentFrame].state,
																null,
																2
															)}
														</pre>
													</div>
													<div className="bg-slate-900/90 rounded-lg p-3 border border-slate-700/60">
														<h5 className="text-xs lg:text-sm font-semibold text-slate-200 mb-2">
															Variables
														</h5>
														<pre className="text-xs text-slate-300 font-mono">
															{JSON.stringify(
																executionHistory[currentFrame].variables,
																null,
																2
															)}
														</pre>
													</div>
													<div className="bg-slate-900/90 rounded-lg p-3 border border-slate-700/60">
														<h5 className="text-xs lg:text-sm font-semibold text-slate-200 mb-2">
															Performance
														</h5>
														<div className="grid grid-cols-2 gap-2 text-xs">
															<div className="flex justify-between">
																<span className="text-slate-300">CPU:</span>
																<span className="text-cyan-300">
																	{executionHistory[
																		currentFrame
																	].performance.cpu.toFixed(1)}
																	%
																</span>
															</div>
															<div className="flex justify-between">
																<span className="text-slate-300">Memory:</span>
																<span className="text-purple-300">
																	{executionHistory[
																		currentFrame
																	].performance.memory.toFixed(0)}
																	MB
																</span>
															</div>
															<div className="flex justify-between">
																<span className="text-slate-300">
																	Duration:
																</span>
																<span className="text-emerald-300">
																	{executionHistory[
																		currentFrame
																	].performance.duration.toFixed(0)}
																	ms
																</span>
															</div>
															<div className="flex justify-between">
																<span className="text-slate-300">
																	Timestamp:
																</span>
																<span className="text-amber-300">
																	{new Date(
																		executionHistory[currentFrame].timestamp
																	).toLocaleTimeString()}
																</span>
															</div>
														</div>
													</div>
												</div>
											) : (
												<div className="text-center text-slate-400 italic py-6">
													No execution frames available. Run the workflow to
													generate debugging data.
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{activeTab === "ai" && (
								<div className="h-full flex flex-col">
									<div className="flex items-center justify-between mb-4 flex-shrink-0">
										<h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
											AI-Powered Analysis
										</h3>
										<div className="flex items-center space-x-2">
											<button
												onClick={() =>
													selectedStep &&
													analyzeError(
														workflow.find((s) => s.id === selectedStep)!
													)
												}
												disabled={!selectedStep || isAnalyzing}
												className={`flex items-center space-x-1.5 px-2.5 lg:px-3.5 py-1.5 lg:py-2 bg-gradient-to-r ${colorScheme.accent} rounded-lg hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:scale-100`}
												aria-label="Analyze current step"
											>
												{isAnalyzing ? (
													<RefreshCw className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
												) : (
													<Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
												)}
												<span className="font-medium text-xs lg:text-sm">
													Analyze Current Step
												</span>
											</button>
										</div>
									</div>

									<div className="flex-1 min-h-0 overflow-y-auto">
										{isAnalyzing && (
											<div className="flex items-center justify-center py-12">
												<div className="text-center">
													<div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse mx-auto">
														<Sparkles className="w-8 h-8 text-white" />
													</div>
													<h4 className="text-lg font-semibold mb-2 text-slate-100">
														AI is analyzing your code...
													</h4>
													<p className="text-slate-300">
														This may take a few moments
													</p>
												</div>
											</div>
										)}

										{!isAnalyzing && !aiAnalysis && (
											<div className="flex items-center justify-center py-12">
												<div className="text-center">
													<div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
														<Sparkles className="w-8 h-8 text-slate-300" />
													</div>
													<h4 className="text-lg font-semibold mb-2 text-slate-100">
														Ready for AI Analysis
													</h4>
													<p className="text-slate-300">
														Select a workflow step and click "Analyze Current
														Step" to get started
													</p>
												</div>
											</div>
										)}

										{!isAnalyzing && aiAnalysis && (
											<div className="space-y-4 pb-4">
												{}
												<div
													className={`bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-xl p-3 lg:p-4 border border-fuchsia-500/40 shadow-lg shadow-fuchsia-500/5`}
												>
													<h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-3 flex items-center space-x-2 text-slate-100">
														<Eye className="w-4 h-4 lg:w-5 lg:h-5 text-fuchsia-400" />
														<span>AI Summary</span>
													</h4>
													<div className="prose prose-invert prose-sm max-w-none">
														<div className="text-slate-200 whitespace-pre-line leading-relaxed text-sm lg:text-base">
															{aiAnalysis.summary}
														</div>
													</div>
												</div>

												{}
												<div
													className={`bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-3 lg:p-4 border border-emerald-500/40 shadow-lg shadow-emerald-500/5`}
												>
													<h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-3 flex items-center space-x-2 text-slate-100">
														<ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
														<span>Improvement Suggestions</span>
													</h4>
													<div className="space-y-2 lg:space-y-3">
														{aiAnalysis.suggestions.map((suggestion, index) => (
															<div
																key={index}
																className="flex items-start space-x-2 lg:space-x-3 p-2 lg:p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30"
															>
																<div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
																	<span className="text-xs font-bold text-white">
																		{index + 1}
																	</span>
																</div>
																<span className="text-slate-200 text-xs lg:text-sm leading-relaxed">
																	{suggestion}
																</span>
															</div>
														))}
													</div>
												</div>

												{}
												<div
													className={`bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-3 lg:p-4 border border-amber-500/40 shadow-lg shadow-amber-500/5`}
												>
													<h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-3 flex items-center space-x-2 text-slate-100">
														<Bug className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400" />
														<span>Code Issues</span>
													</h4>
													<div className="space-y-2 lg:space-y-3">
														{aiAnalysis.codeIssues.map((issue, index) => (
															<div
																key={index}
																className={`p-2.5 lg:p-3.5 rounded-lg border transition-all ${
																	issue.severity === "error"
																		? "bg-red-500/20 border-red-500/40 text-red-200"
																		: issue.severity === "warning"
																		? "bg-yellow-500/20 border-yellow-500/40 text-yellow-200"
																		: "bg-blue-500/20 border-blue-500/40 text-blue-200"
																}`}
															>
																<div className="flex items-center justify-between mb-1.5 lg:mb-2">
																	<div className="flex items-center space-x-2">
																		<span className="text-xs font-bold px-2 py-1 rounded bg-slate-800">
																			Line {issue.line}
																		</span>
																		<span
																			className={`text-xs font-medium px-2 py-1 rounded ${
																				issue.severity === "error"
																					? "bg-red-500/30"
																					: issue.severity === "warning"
																					? "bg-yellow-500/30"
																					: "bg-blue-500/30"
																			}`}
																		>
																			{issue.severity.toUpperCase()}
																		</span>
																	</div>
																</div>
																<div className="text-xs lg:text-sm">
																	{issue.message}
																</div>
															</div>
														))}
													</div>
												</div>

												{}
												<div
													className={`bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-3 lg:p-4 border border-cyan-500/40 shadow-lg shadow-cyan-500/5`}
												>
													<h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-3 flex items-center space-x-2 text-slate-100">
														<TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
														<span>Performance Insights</span>
													</h4>
													<div className="space-y-2 lg:space-y-3">
														{aiAnalysis.performanceInsights.map(
															(insight, index) => (
																<div
																	key={index}
																	className="flex items-start space-x-2 lg:space-x-3 p-2 lg:p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30"
																>
																	<BarChart3 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
																	<span className="text-slate-200 text-xs lg:text-sm leading-relaxed">
																		{insight}
																	</span>
																</div>
															)
														)}
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</div>

					{}
					<div
						className={`${colorScheme.card} border-t ${colorScheme.border} px-3 lg:px-4 py-2 lg:py-3 shadow-lg shadow-black/20`}
					>
						<div className="flex items-center space-x-2 lg:space-x-3">
							<button
								onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
								disabled={currentFrame === 0 || executionHistory.length === 0}
								className={`p-1.5 lg:p-2 bg-gradient-to-r ${colorScheme.secondary} rounded-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-200 shadow-lg`}
								aria-label="Previous frame"
							>
								<ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
							</button>

							<div className="flex-1">
								<input
									type="range"
									min="0"
									max={Math.max(0, executionHistory.length - 1)}
									value={currentFrame}
									onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
									className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
									style={{
										background: `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${
											(currentFrame /
												Math.max(1, executionHistory.length - 1)) *
											100
										}%, rgb(51, 65, 85) ${
											(currentFrame /
												Math.max(1, executionHistory.length - 1)) *
											100
										}%, rgb(51, 65, 85) 100%)`,
									}}
									disabled={executionHistory.length <= 1}
									aria-label="Time travel slider"
								/>
								<div className="flex items-center justify-between mt-1 lg:mt-2 text-xs text-slate-300">
									<span>
										Frame {currentFrame + 1} of {executionHistory.length || 1}
									</span>
									{executionHistory[currentFrame] && (
										<span className="hidden sm:inline">
											{new Date(
												executionHistory[currentFrame].timestamp
											).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									)}
								</div>
							</div>

							<button
								onClick={() =>
									setCurrentFrame(
										Math.min(executionHistory.length - 1, currentFrame + 1)
									)
								}
								disabled={
									currentFrame >= executionHistory.length - 1 ||
									executionHistory.length === 0
								}
								className={`p-1.5 lg:p-2 bg-gradient-to-r ${colorScheme.secondary} rounded-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-200 shadow-lg`}
								aria-label="Next frame"
							>
								<ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
							</button>
						</div>
					</div>
				</div>

				{}
				{session && (
					<div
						className={`${
							isMobile
								? `fixed inset-y-0 right-0 z-40 w-full max-w-[280px] transform transition-transform duration-300 ${
										isMobileChatOpen ? "translate-x-0" : "translate-x-full"
								  }`
								: "w-full max-w-[280px] lg:max-w-[320px]"
						} ${colorScheme.card} border-l ${
							colorScheme.border
						} flex flex-col backdrop-blur-xl shadow-xl shadow-black/20`}
					>
						<div className="p-3 lg:p-4 border-b border-slate-700/60">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold flex items-center space-x-2 text-slate-100">
									<MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-violet-400" />
									<span className="text-sm lg:text-base">Session Chat</span>
								</h3>

								<div className="flex items-center space-x-2">
									<span className="text-xs bg-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full">
										{session?.users?.length || 0} online
									</span>

									{}
									{isMobile && (
										<button
											onClick={() => setIsMobileChatOpen(false)}
											className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors lg:hidden"
											title="Close Chat"
											aria-label="Close chat panel"
										>
											<XCircle className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>
						</div>
						<div className="flex-1 p-3 overflow-y-auto space-y-3">
							{session?.messages?.length > 0 ? (
								session.messages.map((msg, index) => {
									const user = session?.users?.find((u) => u.id === msg.userId);
									return (
										<div key={index} className="flex items-start space-x-2">
											<div
												className="w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
												style={{ backgroundColor: user?.color }}
												aria-hidden="true"
											>
												{user?.name[0]}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center space-x-2 mb-1">
													<span className="text-xs lg:text-sm font-medium truncate text-slate-100">
														{user?.name}
													</span>
													<span className="text-xs text-slate-400 flex-shrink-0">
														{new Date(msg.timestamp).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</span>
												</div>
												<div className="text-xs lg:text-sm text-slate-200 bg-slate-800/70 rounded-lg p-2 lg:p-2.5 border border-slate-700/50">
													{msg.message}
												</div>
											</div>
										</div>
									);
								})
							) : (
								<div className="text-center text-slate-400 italic py-6">
									No messages yet. Start the conversation!
								</div>
							)}
						</div>
						<div className="p-3 border-t border-slate-700/60">
							<div className="relative">
								<input
									type="text"
									placeholder="Type a message..."
									className={`w-full px-3 py-2 lg:py-2.5 rounded-xl border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200 pr-9 lg:pr-10 text-sm bg-slate-800/70 text-slate-100`}
									onKeyPress={(e) => {
										if (e.key === "Enter" && e.currentTarget.value) {
											setSession((prev) =>
												prev
													? {
															...prev,
															messages: [
																...prev.messages,
																{
																	userId: "1",
																	message: e.currentTarget.value,
																	timestamp: Date.now(),
																},
															],
													  }
													: null
											);
											e.currentTarget.value = "";
										}
									}}
									aria-label="Chat message"
								/>
								<button
									className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-slate-100"
									aria-label="Send message"
								>
									<ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				{isMobile && isMobileChatOpen && (
					<div
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
						onClick={() => setIsMobileChatOpen(false)}
						aria-hidden="true"
					/>
				)}

				{}
				{showSettings && (
					<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
						<div
							className={`${colorScheme.card} rounded-2xl p-5 lg:p-6 w-[95%] max-w-[550px] max-h-[90vh] overflow-y-auto border ${colorScheme.border} shadow-2xl`}
						>
							<div className="flex items-center justify-between mb-4 lg:mb-5">
								<h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
									Debugger Settings
								</h3>
								<button
									onClick={() => setShowSettings(false)}
									className="p-2 hover:bg-slate-800/80 rounded-lg transition-colors"
									aria-label="Close settings"
								>
									<XCircle className="w-5 h-5 text-slate-300" />
								</button>
							</div>

							<div className="space-y-4 lg:space-y-5">
								{}
								<div className="bg-slate-800/60 rounded-xl p-4 lg:p-5 border border-slate-700/60 shadow-lg shadow-black/10">
									<h4 className="text-base lg:text-lg font-semibold mb-3 flex items-center space-x-2 text-slate-100">
										<Monitor className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
										<span>Monitoring Integration</span>
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
										<div>
											<label className="block text-sm font-medium mb-1.5 text-slate-300">
												Service Provider
											</label>
											<select
												className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-slate-900/60 text-slate-100`}
											>
												<option value="datadog">DataDog</option>
												<option value="newrelic">New Relic</option>
												<option value="prometheus">Prometheus</option>
												<option value="grafana">Grafana</option>
												<option value="custom">Custom Webhook</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium mb-1.5 text-slate-300">
												API Key
											</label>
											<input
												type="password"
												placeholder="Enter your API key..."
												className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-slate-900/60 text-slate-100`}
											/>
										</div>
									</div>
									<div className="mt-3">
										<label className="block text-sm font-medium mb-1.5 text-slate-300">
											Webhook URL
										</label>
										<input
											type="url"
											placeholder="https://hooks.slack.com/services/..."
											className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-slate-900/60 text-slate-100`}
										/>
									</div>
								</div>

								{}
								<div className="bg-slate-800/60 rounded-xl p-4 lg:p-5 border border-slate-700/60 shadow-lg shadow-black/10">
									<h4 className="text-base lg:text-lg font-semibold mb-3 flex items-center space-x-2 text-slate-100">
										<Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-fuchsia-400" />
										<span>AI Configuration</span>
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
										<div>
											<label className="block text-sm font-medium mb-1.5 text-slate-300">
												AI Model
											</label>
											<select
												className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-slate-900/60 text-slate-100`}
											>
												<option value="gpt4">GPT-4 Turbo</option>
												<option value="claude3">Claude 3 Sonnet</option>
												<option value="gemini">Gemini Pro</option>
												<option value="local">Local LLM</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium mb-1.5 text-slate-300">
												Analysis Depth
											</label>
											<select
												className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-slate-900/60 text-slate-100`}
											>
												<option value="basic">Basic</option>
												<option value="detailed">Detailed</option>
												<option value="comprehensive">Comprehensive</option>
											</select>
										</div>
									</div>
									<div className="mt-3">
										<label className="flex items-center space-x-3">
											<input
												type="checkbox"
												className="w-4 h-4 rounded focus:ring-violet-500 border-slate-600 bg-slate-900/60 text-violet-500"
											/>
											<span className="text-sm text-slate-300">
												Enable real-time code analysis
											</span>
										</label>
									</div>
								</div>

								{}
								<div className="bg-slate-800/60 rounded-xl p-4 lg:p-5 border border-slate-700/60 shadow-lg shadow-black/10">
									<h4 className="text-base lg:text-lg font-semibold mb-3 flex items-center space-x-2 text-slate-100">
										<Settings className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
										<span>Proxy & Network</span>
									</h4>
									<div className="space-y-3">
										<div>
											<label className="block text-sm font-medium mb-1.5 text-slate-300">
												Proxy URL
											</label>
											<input
												type="url"
												placeholder="http://proxy.example.com:8080"
												className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-slate-900/60 text-slate-100`}
											/>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
											<div>
												<label className="block text-sm font-medium mb-1.5 text-slate-300">
													Timeout (ms)
												</label>
												<input
													type="number"
													placeholder="5000"
													className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-slate-900/60 text-slate-100`}
												/>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1.5 text-slate-300">
													Retry Attempts
												</label>
												<input
													type="number"
													placeholder="3"
													className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${colorScheme.border} focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-slate-900/60 text-slate-100`}
												/>
											</div>
										</div>
									</div>
								</div>

								{}
								<div className="bg-slate-800/60 rounded-xl p-4 lg:p-5 border border-slate-700/60 shadow-lg shadow-black/10">
									<h4 className="text-base lg:text-lg font-semibold mb-3 flex items-center space-x-2 text-slate-100">
										<Bug className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400" />
										<span>Debugging Preferences</span>
									</h4>
									<div className="space-y-2.5">
										<label className="flex items-center justify-between">
											<span className="text-sm text-slate-300">
												Auto-pause on errors
											</span>
											<input
												type="checkbox"
												defaultChecked
												className="w-4 h-4 rounded focus:ring-violet-500 border-slate-600 bg-slate-900/60 text-violet-500"
											/>
										</label>
										<label className="flex items-center justify-between">
											<span className="text-sm text-slate-300">
												Show performance warnings
											</span>
											<input
												type="checkbox"
												defaultChecked
												className="w-4 h-4 rounded focus:ring-violet-500 border-slate-600 bg-slate-900/60 text-violet-500"
											/>
										</label>
										<label className="flex items-center justify-between">
											<span className="text-sm text-slate-300">
												Enable step-through debugging
											</span>
											<input
												type="checkbox"
												defaultChecked
												className="w-4 h-4 rounded focus:ring-violet-500 border-slate-600 bg-slate-900/60 text-violet-500"
											/>
										</label>
										<label className="flex items-center justify-between">
											<span className="text-sm text-slate-300">
												Capture variable snapshots
											</span>
											<input
												type="checkbox"
												defaultChecked
												className="w-4 h-4 rounded focus:ring-violet-500 border-slate-600 bg-slate-900/60 text-violet-500"
											/>
										</label>
										<label className="flex items-center justify-between">
											<span className="text-sm text-slate-300">
												Real-time collaboration
											</span>
											<input
												type="checkbox"
												defaultChecked
												className="w-4 h-4 rounded focus:ring-violet-500 border-slate-600 bg-slate-900/60 text-violet-500"
											/>
										</label>
									</div>
								</div>
							</div>

							<div className="mt-5 lg:mt-6 flex justify-end space-x-3">
								<button
									onClick={() => setShowSettings(false)}
									className="px-4 lg:px-5 py-2 lg:py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium text-slate-200 text-sm lg:text-base"
									aria-label="Cancel"
								>
									Cancel
								</button>
								<button
									onClick={() => setShowSettings(false)}
									className={`px-4 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r ${colorScheme.primary} rounded-lg hover:scale-105 transition-all duration-200 shadow-lg font-medium text-sm lg:text-base`}
									aria-label="Save changes"
								>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				{showShareModal && (
					<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
						<div
							className={`${colorScheme.card} rounded-2xl p-5 lg:p-6 w-[95%] max-w-[480px] border ${colorScheme.border} shadow-2xl`}
						>
							<div className="flex items-center justify-between mb-4 lg:mb-5">
								<h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent flex items-center space-x-2">
									<Share2 className="w-5 h-5 lg:w-6 lg:h-6 text-violet-400" />
									<span>Share Session</span>
								</h3>
								<button
									onClick={() => {
										setShowShareModal(false);
										setShareEmail("");
										setSendFeedback("");
									}}
									className="p-2 hover:bg-slate-800/80 rounded-lg transition-colors"
									aria-label="Close sharing dialog"
								>
									<XCircle className="w-5 h-5 text-slate-300" />
								</button>
							</div>

							<div className="space-y-4 lg:space-y-5">
								{}
								<div className="space-y-3">
									<label className="block text-sm font-medium text-slate-300">
										Send session to email
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
										<input
											type="email"
											value={shareEmail}
											onChange={(e) => setShareEmail(e.target.value)}
											placeholder="Enter email address..."
											className="w-full pl-10 pr-4 py-2 lg:py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200"
											aria-label="Email for sharing"
										/>
									</div>

									{}
									{sendFeedback && (
										<div className="text-sm text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
											{sendFeedback}
										</div>
									)}
								</div>

								{}
								<div className="flex items-center space-x-4">
									<div className="flex-1 h-px bg-slate-700/60"></div>
									<span className="text-sm text-slate-400">or</span>
									<div className="flex-1 h-px bg-slate-700/60"></div>
								</div>

								{}
								<div className="space-y-3">
									<label className="block text-sm font-medium text-slate-300">
										Copy session link
									</label>
									<button
										onClick={copySessionLink}
										className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 hover:border-slate-600/60 rounded-lg transition-all duration-200 group"
										aria-label="Copy session link"
									>
										<Copy className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 group-hover:text-violet-400" />
										<span className="text-slate-200 group-hover:text-slate-100 text-sm lg:text-base">
											Copy Link to Clipboard
										</span>
									</button>
								</div>
							</div>

							{}
							<div className="mt-5 lg:mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
								<button
									onClick={() => {
										setShowShareModal(false);
										setShareEmail("");
										setSendFeedback("");
									}}
									className="px-4 lg:px-5 py-2 lg:py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium text-slate-200 order-2 sm:order-1 text-sm lg:text-base"
									aria-label="Cancel sharing"
								>
									Cancel
								</button>
								<button
									onClick={sendSessionEmail}
									disabled={!isValidEmail(shareEmail)}
									className={`px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg font-medium transition-all duration-200 order-1 sm:order-2 text-sm lg:text-base ${
										isValidEmail(shareEmail)
											? `bg-gradient-to-r ${colorScheme.primary} hover:scale-105 shadow-lg text-white`
											: "bg-slate-700 text-slate-400 cursor-not-allowed"
									}`}
									aria-label="Send session via email"
								>
									<span className="flex items-center justify-center space-x-2">
										<Mail className="w-4 h-4" />
										<span>Send Session</span>
									</span>
								</button>
							</div>
						</div>
					</div>
				)}

				{}
				{showToast && (
					<div className="fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 lg:px-5 lg:py-3 rounded-lg shadow-lg shadow-emerald-800/30 z-50 animate-in slide-in-from-right text-sm lg:text-base">
						{toastMessage}
					</div>
				)}
			</div>

			{}
			<footer
				className={`${colorScheme.card} border-t ${colorScheme.border} backdrop-blur-xl shadow-2xl shadow-black/40`}
			>
				{}
				<div className="px-3 lg:px-4 py-3 lg:py-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
						{}
						<div className="space-y-2 lg:space-y-3">
							<h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
								<Activity className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-400" />
								<span>System Status</span>
							</h4>
							<div className="space-y-1.5 text-xs">
								<div className="flex items-center justify-between">
									<span className="text-slate-300">Connection</span>
									<div className="flex items-center space-x-1">
										<div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50 animate-pulse"></div>
										<span className="text-emerald-300 font-medium">Active</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300">API Latency</span>
									<span className="text-cyan-300 font-mono">
										{Math.floor(Math.random() * 50 + 80)}ms
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300">Memory Usage</span>
									<span className="text-purple-300 font-mono">
										{Math.floor(Math.random() * 200 + 150)}MB
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300">Active Sessions</span>
									<span className="text-violet-300 font-medium">
										{session ? session.users?.length || 1 : 1}
									</span>
								</div>
							</div>
						</div>

						{}
						<div className="space-y-2 lg:space-y-3">
							<h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
								<Terminal className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-violet-400" />
								<span>Execution Summary</span>
							</h4>
							<div className="space-y-1.5 text-xs">
								<div className="flex items-center justify-between">
									<span className="text-slate-300">Total Steps</span>
									<span className="text-slate-200 font-medium">
										{workflow.length}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300">Completed</span>
									<span className="text-emerald-300 font-medium">
										{workflow.filter((s) => s.status === "success").length}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300">Failed</span>
									<span className="text-red-300 font-medium">
										{workflow.filter((s) => s.status === "error").length}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300">Avg Duration</span>
									<span className="text-amber-300 font-mono">
										{workflow.filter((s) => s.duration).length > 0
											? Math.floor(
													workflow
														.filter((s) => s.duration)
														.reduce((acc, s) => acc + (s.duration || 0), 0) /
														workflow.filter((s) => s.duration).length
											  )
											: 0}
										ms
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300">Frames Captured</span>
									<span className="text-blue-300 font-medium">
										{executionHistory.length}
									</span>
								</div>
							</div>
						</div>

						{}
						<div className="space-y-2 lg:space-y-3">
							<h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
								<Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-400" />
								<span>Quick Actions</span>
							</h4>
							<div className="grid grid-cols-2 gap-1.5">
								<button
									onClick={executeWorkflow}
									disabled={isRunning}
									className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded text-xs text-emerald-300 transition-colors disabled:opacity-50"
									aria-label="Run workflow"
								>
									<PlayCircle className="w-3 h-3" />
									<span>Run</span>
								</button>
								<button
									onClick={() => setActiveTab("ai")}
									className="flex items-center space-x-1 px-2 py-1 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/40 rounded text-xs text-fuchsia-300 transition-colors"
									aria-label="AI Analysis"
								>
									<Sparkles className="w-3 h-3" />
									<span>AI</span>
								</button>
								<button
									onClick={() => setActiveTab("performance")}
									className="flex items-center space-x-1 px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded text-xs text-cyan-300 transition-colors"
									aria-label="Performance view"
								>
									<BarChart3 className="w-3 h-3" />
									<span>Perf</span>
								</button>
								<button
									onClick={() => setActiveTab("timetravel")}
									className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded text-xs text-blue-300 transition-colors"
									aria-label="Time travel debugging"
								>
									<Clock className="w-3 h-3" />
									<span>Time</span>
								</button>
							</div>

							{}
							<div className="pt-1.5 border-t border-slate-700/40">
								<div className="flex items-center space-x-2">
									<button
										className="flex items-center space-x-1 px-2 py-1 bg-slate-700/60 hover:bg-slate-600/60 rounded text-xs text-slate-300 hover:text-slate-200 transition-colors"
										aria-label="Export data"
									>
										<Download className="w-3 h-3" />
										<span>Export</span>
									</button>
									<button
										onClick={shareSession}
										className="flex items-center space-x-1 px-2 py-1 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 rounded text-xs text-violet-300 transition-colors"
										aria-label="Share session"
									>
										<Share2 className="w-3 h-3" />
										<span>Share</span>
									</button>
								</div>
							</div>
						</div>

						{}
						<div className="space-y-2 lg:space-y-3">
							<h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
								<Bell className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-orange-400" />
								<span>Recent Activity</span>
							</h4>
							<div className="space-y-1.5">
								{executionHistory.length > 0 ? (
									executionHistory
										.slice(-3)
										.reverse()
										.map((frame, index) => {
											const step = workflow.find((s) => s.id === frame.stepId);
											return (
												<div
													key={frame.id}
													className="flex items-center space-x-2 text-xs"
												>
													<div
														className={`w-1.5 h-1.5 rounded-full ${
															step?.status === "error"
																? "bg-red-400"
																: step?.status === "success"
																? "bg-emerald-400"
																: "bg-slate-400"
														}`}
														aria-hidden="true"
													></div>
													<span className="text-slate-300 truncate flex-1">
														{step?.name || "Unknown step"}
													</span>
													<span className="text-slate-400 font-mono">
														{new Date(frame.timestamp).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</span>
												</div>
											);
										})
								) : (
									<div className="text-xs text-slate-400 italic">
										No recent activity
									</div>
								)}
							</div>

							{}
							{session && (
								<div className="pt-1.5 border-t border-slate-700/40">
									<div className="flex items-center justify-between text-xs">
										<span className="text-slate-300">Collaborators</span>
										<div className="flex -space-x-1">
											{session.users?.slice(0, 3).map((user, index) => (
												<div
													key={user.id}
													className="w-5 h-5 rounded-full border border-slate-800 flex items-center justify-center text-xs font-bold"
													style={{ backgroundColor: user.color }}
													title={user.name}
													aria-label={`Collaborator: ${user.name}`}
												>
													{user.name[0]}
												</div>
											))}
											{session.users && session.users.length > 3 && (
												<div className="w-5 h-5 rounded-full border border-slate-800 bg-slate-600 flex items-center justify-center text-xs font-bold">
													+{session.users.length - 3}
												</div>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{}
				<div
					className={`px-3 lg:px-4 py-2 lg:py-2.5 border-t ${colorScheme.border} bg-slate-900/40`}
				>
					<div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
						{}
						<div className="flex items-center space-x-3 text-xs text-slate-400">
							<div className="flex items-center space-x-1.5">
								<Code className="w-3 h-3" />
								<span>AI Debugger v2.1.4</span>
							</div>
							<div className="hidden sm:block w-px h-3 bg-slate-700/60"></div>
							<span className="hidden sm:inline">Next.js Enhanced Edition</span>
							<div className="hidden sm:block w-px h-3 bg-slate-700/60"></div>
							<span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs">
								Production
							</span>
						</div>

						{}
						<div className="hidden lg:flex items-center space-x-2 text-xs">
							<span className="text-slate-400">CPU:</span>
							<div className="flex items-end space-x-0.5 h-4">
								{Array.from({ length: 8 }, (_, i) => (
									<div
										key={i}
										className="w-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-sm"
										style={{
											height: `${Math.random() * 16 + 4}px`,
											opacity: 0.7 + Math.random() * 0.3,
										}}
										aria-hidden="true"
									></div>
								))}
							</div>
							<span className="text-slate-400 ml-3">Memory:</span>
							<div className="flex items-end space-x-0.5 h-4">
								{Array.from({ length: 8 }, (_, i) => (
									<div
										key={i}
										className="w-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm"
										style={{
											height: `${Math.random() * 16 + 4}px`,
											opacity: 0.7 + Math.random() * 0.3,
										}}
										aria-hidden="true"
									></div>
								))}
							</div>
						</div>

						{}
						<div className="flex items-center space-x-3 text-xs">
							<button
								className="text-slate-300 hover:text-violet-300 transition-colors flex items-center space-x-1"
								aria-label="Documentation"
							>
								<span>Documentation</span>
								<ExternalLink className="w-3 h-3" />
							</button>
							<div
								className="w-px h-3 bg-slate-700/60"
								aria-hidden="true"
							></div>
							<button
								className="text-slate-300 hover:text-violet-300 transition-colors flex items-center space-x-1"
								aria-label="Support"
							>
								<span>Support</span>
								<MessageSquare className="w-3 h-3" />
							</button>
							<div
								className="w-px h-3 bg-slate-700/60"
								aria-hidden="true"
							></div>
							<button
								onClick={() => setShowSettings(true)}
								className="text-slate-300 hover:text-violet-300 transition-colors"
								aria-label="Settings"
							>
								<Settings className="w-3 h-3" />
							</button>
							<div
								className="hidden sm:block w-px h-3 bg-slate-700/60"
								aria-hidden="true"
							></div>
							<span className="hidden sm:inline text-slate-400">
								© 2025 AI Debugger
							</span>
						</div>
					</div>
				</div>
			</footer>

			{}
			<style jsx>{`
				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}

				.slider::-webkit-slider-thumb {
					appearance: none;
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: linear-gradient(45deg, #8b5cf6, #a855f7);
					cursor: pointer;
					box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
					transition: all 0.2s ease;
				}

				@media (min-width: 1024px) {
					.slider::-webkit-slider-thumb {
						width: 20px;
						height: 20px;
						box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3);
					}

					.slider::-webkit-slider-thumb:hover {
						transform: scale(1.2);
						box-shadow: 0 0 0 6px rgba(139, 92, 246, 0.4);
					}
				}

				.slider::-moz-range-thumb {
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: linear-gradient(45deg, #8b5cf6, #a855f7);
					cursor: pointer;
					border: none;
					box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
				}
				button,
				a {
					transition: all 0.2s ease;
					cursor: pointer;
				}
				@media (min-width: 1024px) {
					.slider::-moz-range-thumb {
						width: 20px;
						height: 20px;
						box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3);
					}
				}

				@keyframes slideInFromRight {
					0% {
						transform: translateX(100%);
						opacity: 0;
					}
					100% {
						transform: translateX(0);
						opacity: 1;
					}
				}

				.animate-in.slide-in-from-right {
					animation: slideInFromRight 0.3s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
