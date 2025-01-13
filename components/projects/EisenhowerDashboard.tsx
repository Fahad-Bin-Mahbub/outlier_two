"use client";
import { useState, useRef, JSX, useEffect, forwardRef } from "react";

type TaskId = number;
type QuadrantId =
	| "urgent-important"
	| "not-urgent-important"
	| "urgent-not-important"
	| "not-urgent-not-important";

interface Task {
	id: TaskId;
	title: string;
	description: string;
	urgency: number;
	importance: number;
	completed: boolean;
	quadrant: QuadrantId;
}

interface QuadrantInput {
	title: string;
	description?: string;
	urgency: number;
	importance: number;
	showForm: boolean;
}

interface IconsType {
	target: JSX.Element;
	clock: JSX.Element;
	users: JSX.Element;
	trash: JSX.Element;
	plus: JSX.Element;
	x: JSX.Element;
	dots: JSX.Element;
	menu: JSX.Element;
	close: JSX.Element;
	check: JSX.Element;
}

interface QuadrantDefinition {
	id: QuadrantId;
	title: string;
	subtitle: string;
	icon: JSX.Element;
	gradient: string;
	bg: string;
	border: string;
	headerBg: string;
	textColor: string;
}

type ProgressColor = "red" | "blue";

interface ProgressDotsProps {
	value: number;
	onChange: (value: number) => void;
	color: ProgressColor;
	label: string;
	disabled?: boolean;
}

const initialTasks: Task[] = [
	{
		id: 1,
		title: "Complete quarterly financial report",
		description: "Finalize Q4 analysis and board presentation",
		urgency: 85,
		importance: 92,
		completed: false,
		quadrant: "urgent-important",
	},
	{
		id: 2,
		title: "Strategic planning session",
		description: "Quarterly strategic review with executive team",
		urgency: 25,
		importance: 88,
		completed: false,
		quadrant: "not-urgent-important",
	},
	{
		id: 3,
		title: "Review team performance metrics",
		description: "Monthly team evaluation and feedback session",
		urgency: 75,
		importance: 45,
		completed: false,
		quadrant: "urgent-not-important",
	},
	{
		id: 4,
		title: "Organize digital workspace",
		description: "Clean up files and optimize folder structure",
		urgency: 15,
		importance: 25,
		completed: true,
		quadrant: "not-urgent-not-important",
	},
	{
		id: 5,
		title: "Project kickoff meeting",
		description: "Introduce new product initiative to the team",
		urgency: 80,
		importance: 90,
		completed: false,
		quadrant: "urgent-important",
	},
	{
		id: 6,
		title: "Budget review",
		description: "Analyze Q2 expenses and adjust forecasts",
		urgency: 70,
		importance: 85,
		completed: false,
		quadrant: "urgent-important",
	},
	{
		id: 7,
		title: "Client presentation preparation",
		description: "Create slides for next week's client meeting",
		urgency: 60,
		importance: 80,
		completed: false,
		quadrant: "urgent-important",
	},
];

const initialQuadrantInputs: Record<QuadrantId, QuadrantInput> = {
	"urgent-important": {
		title: "",
		description: "",
		urgency: 75,
		importance: 75,
		showForm: false,
	},
	"not-urgent-important": {
		title: "",
		description: "",
		urgency: 25,
		importance: 75,
		showForm: false,
	},
	"urgent-not-important": {
		title: "",
		description: "",
		urgency: 75,
		importance: 25,
		showForm: false,
	},
	"not-urgent-not-important": {
		title: "",
		description: "",
		urgency: 25,
		importance: 25,
		showForm: false,
	},
};

const ProgressDots: React.FC<ProgressDotsProps> = ({
	value,
	onChange,
	color,
	label,
	disabled = false,
}) => {
	const dots = [20, 40, 60, 80, 100];
	const currentLevel = dots.findIndex((level) => value <= level) + 1;

	const handleDotClick = (level: number) => {
		if (disabled) return;
		const newValue = dots[level - 1];
		onChange(newValue);
	};

	const getColorClasses = (dotIndex: number, isActive: boolean) => {
		if (disabled) return isActive ? "bg-gray-400" : "bg-gray-200";

		if (color === "red") {
			return isActive
				? "bg-rose-500 shadow-rose-200"
				: "bg-gray-200 hover:bg-rose-100 border-rose-200";
		} else {
			return isActive
				? "bg-indigo-500 shadow-indigo-200"
				: "bg-gray-200 hover:bg-indigo-100 border-indigo-200";
		}
	};

	const getLabelText = () => {
		if (currentLevel === 1) return "Very Low";
		if (currentLevel === 2) return "Low";
		if (currentLevel === 3) return "Medium";
		if (currentLevel === 4) return "High";
		if (currentLevel === 5) return "Very High";
		return "None";
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-xs font-semibold text-gray-700">{label}</span>
				<span className="text-xs text-gray-600 font-medium">
					{getLabelText()}
				</span>
			</div>
			<div className="flex space-x-2">
				{dots.map((_, index) => {
					const dotLevel = index + 1;
					const isActive = dotLevel <= currentLevel;
					const isCurrent = dotLevel === currentLevel;

					return (
						<button
							key={index}
							type="button"
							onClick={() => handleDotClick(dotLevel)}
							disabled={disabled}
							className={`
                  w-6 h-6 rounded-full border-2 transition-all duration-200 transform
                  ${getColorClasses(index, isActive)}
                  ${isCurrent ? "scale-110 shadow-md" : ""}
                  ${
										disabled
											? "cursor-not-allowed"
											: "cursor-pointer hover:scale-105"
									}
                  ${isActive ? "border-white" : "border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${
										color === "red"
											? "focus:ring-rose-500"
											: "focus:ring-indigo-500"
									}
                `}
						>
							{isActive && (
								<div
									className={`w-2 h-2 rounded-full mx-auto ${
										disabled ? "bg-gray-300" : "bg-white"
									}`}
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};

interface LevelIndicatorProps {
	value: number;
	color: ProgressColor;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ value, color }) => {
	const dots = [20, 40, 60, 80, 100];
	const currentLevel = dots.findIndex((level) => value <= level) + 1;

	return (
		<div className="flex space-x-1">
			{[1, 2, 3, 4, 5].map((level) => (
				<div
					key={level}
					className={`h-1.5 w-3 rounded-full transition-all duration-300 ${
						level <= currentLevel
							? color === "red"
								? "bg-rose-500"
								: "bg-indigo-500"
							: "bg-gray-200"
					}`}
				/>
			))}
		</div>
	);
};

interface ProgressRingProps {
	progress: number;
	size?: "sm" | "md" | "lg";
}

const ProgressRing: React.FC<ProgressRingProps> = ({
	progress,
	size = "md",
}) => {
	const sizeMap = {
		sm: 40,
		md: 52,
		lg: 64,
	};

	const radius = sizeMap[size];
	const strokeWidth = size === "sm" ? 4 : 6;
	const normalizedRadius = radius - strokeWidth * 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDasharray = `${circumference} ${circumference}`;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	const textSizeClass =
		size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

	const subtextSizeClass = size === "sm" ? "text-[10px]" : "text-xs";

	return (
		<div className="relative">
			<svg
				height={radius * 2}
				width={radius * 2}
				className="transform -rotate-90 drop-shadow-sm"
			>
				<circle
					stroke="#e5e7eb"
					fill="transparent"
					strokeWidth={strokeWidth}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
				<circle
					stroke="url(#progressGradient)"
					fill="transparent"
					strokeWidth={strokeWidth}
					strokeDasharray={strokeDasharray}
					style={{ strokeDashoffset }}
					strokeLinecap="round"
					r={normalizedRadius}
					cx={radius}
					cy={radius}
					className="transition-all duration-500 ease-out"
				/>
				<defs>
					<linearGradient
						id="progressGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="#4f46e5" />
						<stop offset="100%" stopColor="#3730a3" />
					</linearGradient>
				</defs>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span
					className={`font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent ${textSizeClass}`}
				>
					{Math.round(progress)}%
				</span>
				<span className={`text-gray-500 font-medium ${subtextSizeClass}`}>
					Complete
				</span>
			</div>
		</div>
	);
};

interface TaskCardProps {
	task: Task;
	isExpanded: boolean;
	onClickCard: (taskId: TaskId) => void;
	onHoverCard: (taskId: TaskId | null) => void;
	onDeleteTask: (taskId: TaskId) => void;
	onToggleTaskComplete: (taskId: TaskId) => void;
	onUpdateTaskUrgencyImportance: (
		taskId: TaskId,
		field: "urgency" | "importance",
		value: number
	) => void;
	iconX: JSX.Element;
	onProgressDotInteraction: () => void;
	isCurrentDraggingTask: boolean;
	onPickupTask: (
		task: Task,
		eventType: "drag" | "touch",
		touchEvent?: React.TouchEvent<HTMLDivElement>
	) => void;
	onReleaseTask: () => void;
	onTouchMoveOverQuadrant?: (clientX: number, clientY: number) => void;
	onTouchDrop?: (clientX: number, clientY: number) => void;
	onDropOntoTask: (targetTaskId: TaskId) => void;
}

const TOUCH_MOVE_THRESHOLD = 5;

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
	(
		{
			task,
			isExpanded,
			onClickCard,
			onHoverCard,
			onDeleteTask,
			onToggleTaskComplete,
			onUpdateTaskUrgencyImportance,
			iconX,
			onProgressDotInteraction,
			isCurrentDraggingTask,
			onPickupTask,
			onReleaseTask,
			onTouchMoveOverQuadrant,
			onTouchDrop,
			onDropOntoTask,
		},
		forwardedRef
	) => {
		const internalCardRef = useRef<HTMLDivElement>(null);
		const [isActivelyTouchDragging, setIsActivelyTouchDragging] =
			useState(false);
		const touchStartDetailsRef = useRef<{
			initialX: number;
			initialY: number;
			offsetX: number;
			offsetY: number;
			rect: DOMRect;
			originalParent: HTMLElement | null;
			originalNextSibling: Node | null;
			placeholderElement?: HTMLDivElement;
		} | null>(null);

		const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
			const target = e.target as HTMLElement;
			if (
				target.closest('input[type="checkbox"]') ||
				target.closest("button") ||
				target.closest(".dots-container")
			) {
				return;
			}
			onClickCard(task.id);
		};

		const handleDragStartWithImageSetup = (
			e: React.DragEvent<HTMLDivElement>
		) => {
			const cardElement = e.currentTarget;
			const detailsContainer = cardElement.querySelector(
				".dots-container"
			) as HTMLElement | null;
			let originalDetailsDisplay: string | undefined = undefined;

			if (detailsContainer) {
				originalDetailsDisplay = detailsContainer.style.display;
				detailsContainer.style.display = "none";
			}

			try {
				e.dataTransfer.setDragImage(
					cardElement,
					e.nativeEvent.offsetX,
					e.nativeEvent.offsetY
				);
			} catch (error) {
				console.warn("setDragImage failed, browser will use default.", error);
			}

			onPickupTask(task, "drag");

			if (detailsContainer) {
				setTimeout(() => {
					detailsContainer.style.display = originalDetailsDisplay || "";
				}, 0);
			}
		};

		const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
			if (task.completed || !internalCardRef.current) return;

			const touch = e.touches[0];
			const rect = internalCardRef.current.getBoundingClientRect();

			touchStartDetailsRef.current = {
				initialX: touch.clientX,
				initialY: touch.clientY,
				offsetX: touch.clientX - rect.left,
				offsetY: touch.clientY - rect.top,
				rect,
				originalParent: internalCardRef.current.parentElement,
				originalNextSibling: internalCardRef.current.nextSibling,
			};
		};

		const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
			if (
				task.completed ||
				!touchStartDetailsRef.current ||
				!internalCardRef.current
			)
				return;

			const touch = e.touches[0];

			if (isActivelyTouchDragging) {
				const newXViewport =
					touch.clientX - touchStartDetailsRef.current.offsetX;
				const newYViewport =
					touch.clientY - touchStartDetailsRef.current.offsetY;

				internalCardRef.current.style.left = `${newXViewport}px`;
				internalCardRef.current.style.top = `${newYViewport}px`;

				onTouchMoveOverQuadrant?.(touch.clientX, touch.clientY);
			} else {
				const deltaX = touch.clientX - touchStartDetailsRef.current.initialX;
				const deltaY = touch.clientY - touchStartDetailsRef.current.initialY;
				const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				if (distance > TOUCH_MOVE_THRESHOLD) {
					onPickupTask(task, "touch", e);
					setIsActivelyTouchDragging(true);

					const { rect, originalParent, originalNextSibling } =
						touchStartDetailsRef.current!;

					const placeholder = document.createElement("div");
					placeholder.style.width = `${rect.width}px`;
					placeholder.style.height = `${rect.height}px`;
					placeholder.className = "task-card-placeholder mb-4";

					if (originalNextSibling) {
						originalParent?.insertBefore(placeholder, originalNextSibling);
					} else {
						originalParent?.appendChild(placeholder);
					}

					touchStartDetailsRef.current!.placeholderElement = placeholder;

					internalCardRef.current.style.position = "fixed";
					internalCardRef.current.style.left = `${rect.left}px`;
					internalCardRef.current.style.top = `${rect.top}px`;
					internalCardRef.current.style.width = `${rect.width}px`;
					internalCardRef.current.style.height = `${rect.height}px`;
					internalCardRef.current.style.transition = "none";
					internalCardRef.current.style.opacity = "0.8";
					internalCardRef.current.style.zIndex = "2000";
					internalCardRef.current.style.boxShadow =
						"0 10px 20px rgba(0,0,0,0.2)";

					document.body.style.overflow = "hidden";

					const newXViewport =
						touch.clientX - touchStartDetailsRef.current.offsetX;
					const newYViewport =
						touch.clientY - touchStartDetailsRef.current.offsetY;
					internalCardRef.current.style.left = `${newXViewport}px`;
					internalCardRef.current.style.top = `${newYViewport}px`;
				}
			}
		};

		const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
			if (task.completed || !touchStartDetailsRef.current) return;

			if (isActivelyTouchDragging) {
				if (internalCardRef.current) {
					onTouchDrop?.(
						e.changedTouches[0].clientX,
						e.changedTouches[0].clientY
					);

					internalCardRef.current.style.position = "";
					internalCardRef.current.style.left = "";
					internalCardRef.current.style.top = "";
					internalCardRef.current.style.width = "";
					internalCardRef.current.style.height = "";
					internalCardRef.current.style.opacity = "";
					internalCardRef.current.style.zIndex = "";
					internalCardRef.current.style.transition = "";
					internalCardRef.current.style.boxShadow = "";
				}
			}

			document.body.style.overflow = "";
			onReleaseTask();
			touchStartDetailsRef.current?.placeholderElement?.remove();
			touchStartDetailsRef.current = null;
			setIsActivelyTouchDragging(false);
		};

		return (
			<div
				ref={(el) => {
					(
						internalCardRef as React.MutableRefObject<HTMLDivElement | null>
					).current = el;
					if (typeof forwardedRef === "function") {
						forwardedRef(el);
					} else if (forwardedRef) {
						(
							forwardedRef as React.MutableRefObject<HTMLDivElement | null>
						).current = el;
					}
				}}
				draggable={!task.completed}
				onDragStart={handleDragStartWithImageSetup}
				onDragEnd={onReleaseTask}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
				onDragOver={(e) => {
					e.preventDefault();
					e.dataTransfer.dropEffect = "move";
				}}
				onDrop={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onDropOntoTask(task.id);
				}}
				onClick={handleCardClick}
				onMouseEnter={() => onHoverCard(task.id)}
				onMouseLeave={() => onHoverCard(null)}
				className={`task-card relative bg-white/95 backdrop-blur-sm border border-white/50 rounded-xl p-4 cursor-move shadow-sm hover:shadow-xl transition-all duration-300 group mb-4
        ${task.completed ? "opacity-60" : ""} ${
					isExpanded && !isCurrentDraggingTask ? "z-20" : "z-0"
				}`}
			>
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-start space-x-3 flex-1">
						<div className="relative mt-0.5">
							<input
								type="checkbox"
								checked={task.completed}
								onChange={(e) => {
									e.stopPropagation();
									onToggleTaskComplete(task.id);
								}}
								className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 transition-all duration-200 cursor-pointer relative z-10"
							/>
						</div>
						<div className="flex-1">
							<h4
								className={`font-semibold text-sm leading-tight ${
									task.completed
										? "line-through text-gray-500"
										: "text-gray-900"
								}`}
							>
								{task.title}
							</h4>
							{task.description && (
								<p className="text-xs text-gray-600 mt-1 leading-relaxed">
									{task.description}
								</p>
							)}
						</div>
					</div>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDeleteTask(task.id);
						}}
						className="text-gray-400 hover:text-rose-500 transition-colors duration-200 lg:opacity-0 group-hover:opacity-100 p-1 relative z-10"
					>
						{iconX}
					</button>
				</div>

				{isExpanded && !task.completed && (
					<div
						className="expanded-details-arrow absolute opacity-95 left-0 right-0 mx-16 bottom-full mb-2 bg-slate-50 rounded-lg shadow-xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-200 dots-container"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="space-y-4">
							<ProgressDots
								value={task.urgency}
								onChange={(value) => {
									onUpdateTaskUrgencyImportance(task.id, "urgency", value);
									onProgressDotInteraction();
								}}
								color="red"
								label="Urgency"
							/>
							<ProgressDots
								value={task.importance}
								onChange={(value) => {
									onUpdateTaskUrgencyImportance(task.id, "importance", value);
									onProgressDotInteraction();
								}}
								color="blue"
								label="Importance"
							/>
						</div>
					</div>
				)}

				<div className="flex space-x-2">
					<LevelIndicator value={task.urgency} color="red" />
					<LevelIndicator value={task.importance} color="blue" />
				</div>
			</div>
		);
	}
);

TaskCard.displayName = "TaskCard";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
				<div className="flex justify-between items-center p-5 border-b border-gray-200">
					<h3 className="text-lg font-bold text-gray-900">{title}</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 transition-colors"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
				<div className="p-5">{children}</div>
			</div>
		</div>
	);
};

const EisenhowerDashboard = () => {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [quadrantInputs, setQuadrantInputs] = useState<
		Record<QuadrantId, QuadrantInput>
	>(initialQuadrantInputs);

	const [draggedTask, setDraggedTask] = useState<Task | null>(null);
	const [expandedTask, setExpandedTask] = useState<TaskId | null>(null);
	const [isTouchDevice, setIsTouchDevice] = useState(false);
	const [isAnyTaskDragging, setIsAnyTaskDragging] = useState(false);
	const [activeQuadrantByTouch, setActiveQuadrantByTouch] =
		useState<QuadrantId | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [signInModalOpen, setSignInModalOpen] = useState(false);
	const [proModalOpen, setProModalOpen] = useState(false);

	const dragCounter = useRef(0);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const taskCardRefs = useRef<Record<TaskId, HTMLDivElement | null>>({});

	const icons: IconsType = {
		target: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<circle cx="12" cy="12" r="3" />
				<path
					d="M12 1v6m0 6v6m11-7h-6m-6 0H1"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				<circle
					cx="12"
					cy="12"
					r="8"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		),
		clock: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M12 6v6l4 2" />
			</svg>
		),
		users: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
		),
		trash: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M3 6h18" />
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
				<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
			</svg>
		),
		plus: (
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="3"
			>
				<line x1="12" y1="5" x2="12" y2="19" />
				<line x1="5" y1="12" x2="19" y2="12" />
			</svg>
		),
		x: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		),
		dots: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
				<circle cx="5" cy="12" r="1" />
				<circle cx="12" cy="12" r="1" />
				<circle cx="19" cy="12" r="1" />
			</svg>
		),
		menu: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<line x1="3" y1="12" x2="21" y2="12" />
				<line x1="3" y1="6" x2="21" y2="6" />
				<line x1="3" y1="18" x2="21" y2="18" />
			</svg>
		),
		close: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		),
		check: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<polyline points="20 6 9 17 4 12" />
			</svg>
		),
	};

	const quadrants: QuadrantDefinition[] = [
		{
			id: "urgent-important",
			title: "Do First",
			subtitle: "Urgent & Important",
			icon: icons.target,
			gradient: "from-rose-500 to-rose-600",
			bg: "bg-gradient-to-br from-rose-50 to-rose-100",
			border: "border-rose-200",
			headerBg: "bg-white/90 backdrop-blur-sm",
			textColor: "text-rose-700",
		},
		{
			id: "not-urgent-important",
			title: "Schedule",
			subtitle: "Important, Not Urgent",
			icon: icons.clock,
			gradient: "from-indigo-500 to-indigo-600",
			bg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
			border: "border-indigo-200",
			headerBg: "bg-white/90 backdrop-blur-sm",
			textColor: "text-indigo-700",
		},
		{
			id: "urgent-not-important",
			title: "Delegate",
			subtitle: "Urgent, Not Important",
			icon: icons.users,
			gradient: "from-amber-500 to-amber-600",
			bg: "bg-gradient-to-br from-amber-50 to-amber-100",
			border: "border-amber-200",
			headerBg: "bg-white/90 backdrop-blur-sm",
			textColor: "text-amber-700",
		},
		{
			id: "not-urgent-not-important",
			title: "Eliminate",
			subtitle: "Neither Urgent nor Important",
			icon: icons.trash,
			gradient: "from-slate-500 to-slate-600",
			bg: "bg-gradient-to-br from-slate-50 to-slate-100",
			border: "border-slate-200",
			headerBg: "bg-white/90 backdrop-blur-sm",
			textColor: "text-slate-700",
		},
	];

	const initialQuadrantRefs: Record<QuadrantId, HTMLDivElement | null> = {
		"urgent-important": null,
		"not-urgent-important": null,
		"urgent-not-important": null,
		"not-urgent-not-important": null,
	};

	const quadrantRefs =
		useRef<Record<QuadrantId, HTMLDivElement | null>>(initialQuadrantRefs);

	const getTasksInQuadrant = (quadrantId: QuadrantId) => {
		return tasks.filter((task) => task.quadrant === quadrantId);
	};

	const calculateProgress = () => {
		const completedTasks = tasks.filter((task) => task.completed).length;
		return tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
	};

	const updateQuadrantInput = (
		quadrantId: QuadrantId,
		field: keyof QuadrantInput,
		value: string | number | boolean
	) => {
		setQuadrantInputs((prev) => ({
			...prev,
			[quadrantId]: { ...prev[quadrantId], [field]: value as never },
		}));
	};

	const toggleQuadrantForm = (quadrantId: QuadrantId) => {
		setQuadrantInputs((prev) => ({
			...prev,
			[quadrantId]: {
				...prev[quadrantId],
				showForm: !prev[quadrantId].showForm,
			},
		}));
	};

	const addTask = (quadrantId: QuadrantId) => {
		const input = quadrantInputs[quadrantId];
		if (input.title.trim()) {
			const newTask: Task = {
				id: Date.now(),
				title: input.title.trim(),
				description: input.description?.trim() || "",
				urgency: input.urgency,
				importance: input.importance,
				completed: false,
				quadrant: quadrantId,
			};
			setTasks((prevTasks) => [...prevTasks, newTask]);
			updateQuadrantInput(quadrantId, "title", "");
			updateQuadrantInput(quadrantId, "description", "");
			toggleQuadrantForm(quadrantId);
		}
	};

	const deleteTask = (taskId: TaskId) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
	};

	const toggleTaskCompletion = (taskId: TaskId) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const updateTaskUrgencyImportance = (
		taskId: TaskId,
		field: "urgency" | "importance",
		value: number
	) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId ? { ...task, [field]: value } : task
			)
		);
	};

	const handleTaskPickup = (
		task: Task,
		eventType: "drag" | "touch",
		touchEvent?: React.TouchEvent<HTMLDivElement>
	) => {
		if (expandedTask === task.id) {
			setExpandedTask(null);
		}

		setDraggedTask(task);
		setIsAnyTaskDragging(true);

		if (eventType === "drag" && touchEvent) {
			const dragEvent =
				touchEvent as unknown as React.DragEvent<HTMLDivElement>;
			if (dragEvent.dataTransfer) {
				dragEvent.dataTransfer.effectAllowed = "move";
			}
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		dragCounter.current++;
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		dragCounter.current--;
	};

	const handleTaskDropInQuadrant = (quadrantId: QuadrantId) => {
		dragCounter.current = 0;
		setActiveQuadrantByTouch(null);

		if (draggedTask) {
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === draggedTask.id ? { ...task, quadrant: quadrantId } : task
				)
			);
		}
	};

	const handleDropNative = (
		e: React.DragEvent<HTMLDivElement>,
		quadrantId: QuadrantId
	) => {
		e.preventDefault();
		handleTaskDropInQuadrant(quadrantId);
		handleTaskRelease();
	};

	const handleTaskRelease = () => {
		setIsAnyTaskDragging(false);
		setDraggedTask(null);
		setActiveQuadrantByTouch(null);
	};

	const handleTouchMoveOverQuadrant = (clientX: number, clientY: number) => {
		let foundQuadrant: QuadrantId | null = null;
		for (const id in quadrantRefs.current) {
			const quadrantElement = quadrantRefs.current[id as QuadrantId];
			if (quadrantElement) {
				const rect = quadrantElement.getBoundingClientRect();
				if (
					clientX >= rect.left &&
					clientX <= rect.right &&
					clientY >= rect.top &&
					clientY <= rect.bottom
				) {
					foundQuadrant = id as QuadrantId;
					break;
				}
			}
		}
		setActiveQuadrantByTouch(foundQuadrant);
	};

	const handleTouchDrop = (clientX: number, clientY: number) => {
		if (!draggedTask) return;

		let droppedOnTask = false;
		for (const taskIdStr in taskCardRefs.current) {
			const targetTaskId = parseInt(taskIdStr, 10);
			if (targetTaskId === draggedTask.id) continue;

			const taskElement = taskCardRefs.current[targetTaskId];
			if (taskElement) {
				const rect = taskElement.getBoundingClientRect();
				if (
					clientX >= rect.left &&
					clientX <= rect.right &&
					clientY >= rect.top &&
					clientY <= rect.bottom
				) {
					handleDropOnTask(targetTaskId);
					droppedOnTask = true;
					break;
				}
			}
		}
		if (!droppedOnTask && activeQuadrantByTouch) {
			handleTaskDropInQuadrant(activeQuadrantByTouch);
		}
	};

	const handleDropOnTask = (targetTaskId: TaskId) => {
		if (!draggedTask) {
			return;
		}

		const targetTaskInstance = tasks.find((t) => t.id === targetTaskId);
		if (!targetTaskInstance) {
			return;
		}

		if (draggedTask.id === targetTaskId) {
			return;
		}

		setTasks((prevTasks) => {
			const targetTaskInPrev = prevTasks.find((t) => t.id === targetTaskId);
			if (!targetTaskInPrev) return prevTasks;

			const tasksCopy = [...prevTasks];

			const originalDraggedItemIndex = tasksCopy.findIndex(
				(t) => t.id === draggedTask.id
			);
			if (originalDraggedItemIndex === -1) return prevTasks;

			const originalTargetItemIndex = tasksCopy.findIndex(
				(t) => t.id === targetTaskId
			);

			const [draggedItemInstance] = tasksCopy.splice(
				originalDraggedItemIndex,
				1
			);

			draggedItemInstance.quadrant = targetTaskInPrev.quadrant;

			let insertionIndexInModifiedList = tasksCopy.findIndex(
				(t) => t.id === targetTaskId
			);

			if (originalDraggedItemIndex < originalTargetItemIndex) {
				insertionIndexInModifiedList++;
			}

			tasksCopy.splice(insertionIndexInModifiedList, 0, draggedItemInstance);

			return tasksCopy;
		});
	};

	useEffect(() => {
		const checkIsTouchDevice = () =>
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0 ||
			window.matchMedia("(hover: none)").matches;
		setIsTouchDevice(checkIsTouchDevice());
	}, []);

	const handleHoverCard = (taskId: TaskId | null) => {
		if (isTouchDevice) return;

		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}

		if (taskId !== null && autoCloseTimeoutRef.current) {
			clearTimeout(autoCloseTimeoutRef.current);
		}

		if (taskId === null) {
			hoverTimeoutRef.current = setTimeout(() => {
				setExpandedTask(null);
			}, 200);
		} else {
			setExpandedTask(taskId);
		}
	};

	const handleClickCard = (taskId: TaskId) => {
		setExpandedTask((currentId) => {
			const newId = currentId === taskId ? null : taskId;
			if (newId !== null) {
				startAutoCloseTimeout();
			} else {
				if (autoCloseTimeoutRef.current) {
					clearTimeout(autoCloseTimeoutRef.current);
				}
			}
			return newId;
		});
	};

	const startAutoCloseTimeout = () => {
		if (autoCloseTimeoutRef.current) {
			clearTimeout(autoCloseTimeoutRef.current);
		}
		autoCloseTimeoutRef.current = setTimeout(() => {
			setExpandedTask(null);
		}, 3000);
	};

	const sortedTasksInQuadrant = (quadrantId: QuadrantId) => {
		const quadrantTasks = getTasksInQuadrant(quadrantId);
		return [
			...quadrantTasks.filter((task) => !task.completed),
			...quadrantTasks.filter((task) => task.completed),
		];
	};

	const needsScrolling = (quadrantId: QuadrantId) => {
		return getTasksInQuadrant(quadrantId).length > 3;
	};

	useEffect(() => {
		const link = document.createElement("link");
		link.href =
			"https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap";
		link.rel = "stylesheet";
		document.head.appendChild(link);

		return () => {
			document.head.removeChild(link);
		};
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				expandedTask !== null &&
				!target.closest(".task-card") &&
				!target.closest(".dots-container")
			) {
				setExpandedTask(null);
				if (autoCloseTimeoutRef.current) {
					clearTimeout(autoCloseTimeoutRef.current);
				}
			}
		};

		if (expandedTask !== null) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [expandedTask]);

	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
			if (autoCloseTimeoutRef.current) {
				clearTimeout(autoCloseTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div
			className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-100"
			style={{ fontFamily: "Quicksand, sans-serif" }}
		>
			<style>{`
        .expanded-details-arrow::before {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid #f8fafc;
          filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.1));
        }
        
        .task-list-scrollable {
          max-height: 264px; 
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }
        button,a{
          cursor: pointer;
          }
        .task-list-scrollable::-webkit-scrollbar {
          width: 4px;
        }
        
        .task-list-scrollable::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .task-list-scrollable::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
      `}</style>

			{}
			<header className="bg-white/90 backdrop-blur-sm border-b border-white/50 sticky top-0 z-30 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
					<div className="flex items-center">
						<div className="relative w-10 h-10 sm:w-12 sm:h-12 mr-3 shadow-md rounded-xl">
							{}
							<div className="absolute inset-0 bg-white rounded-xl overflow-hidden border border-gray-100">
								{}
								<div className="absolute top-0 left-0 w-1/2 h-1/2 bg-rose-500 opacity-90"></div>
								<div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500 opacity-90"></div>
								<div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-500 opacity-90"></div>
								<div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-slate-500 opacity-90"></div>

								{}
								<div className="absolute top-[22%] left-0 w-full h-[12%] bg-white/30"></div>
								<div className="absolute top-0 left-[22%] w-[12%] h-full bg-white/30"></div>

								{}
								<div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>

								{}
								<div className="absolute top-[8%] left-[8%] w-[5%] h-[5%] bg-white rounded-full opacity-80"></div>
								<div className="absolute top-[8%] right-[8%] w-[5%] h-[5%] bg-white rounded-full opacity-80"></div>
								<div className="absolute bottom-[8%] left-[8%] w-[5%] h-[5%] bg-white rounded-full opacity-80"></div>
								<div className="absolute bottom-[8%] right-[8%] w-[5%] h-[5%] bg-white rounded-full opacity-80"></div>
							</div>

							{}
							<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent"></div>
						</div>

						<div className="flex flex-col">
							<h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
								Eisenhower Matrix
							</h1>
							<span className="text-xs text-gray-500 hidden sm:inline-block">
								Prioritize what matters
							</span>
						</div>
					</div>

					<div className="flex items-center">
						<div className="hidden sm:flex items-center space-x-6">
							<button
								onClick={() => setSignInModalOpen(true)}
								className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 border border-gray-200"
							>
								Sign In
							</button>
							<button
								onClick={() => setProModalOpen(true)}
								className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 shadow-sm"
							>
								Try Pro Free
							</button>
						</div>
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="ml-3 sm:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
						>
							{icons.menu}
						</button>
					</div>
				</div>

				{}
				{mobileMenuOpen && (
					<div className="sm:hidden bg-white border-t border-gray-100 py-2 px-4 animate-in slide-in-from-top-5 fade-in duration-150">
						<div className="flex flex-col space-y-2">
							<button className="text-left w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
								Dashboard
							</button>
							<button className="text-left w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
								Templates
							</button>
							<button className="text-left w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
								Settings
							</button>
							<div className="pt-2 border-t border-gray-100 flex space-x-2">
								<button
									onClick={() => {
										setMobileMenuOpen(false);
										setSignInModalOpen(true);
									}}
									className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 border border-gray-200"
								>
									Sign In
								</button>
								<button
									onClick={() => {
										setMobileMenuOpen(false);
										setProModalOpen(true);
									}}
									className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 shadow-sm"
								>
									Try Pro
								</button>
							</div>
						</div>
					</div>
				)}
			</header>

			{}
			<div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 border-b border-white/30">
				<div className="max-w-7xl mx-auto p-4 sm:px-6 sm:py-5">
					{}
					<div className="flex items-center justify-between mb-6">
						{}
						<div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-100 shadow-sm flex items-center space-x-1.5">
							<svg
								className="h-3.5 w-3.5 text-indigo-500"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
								<line x1="16" y1="2" x2="16" y2="6" />
								<line x1="8" y1="2" x2="8" y2="6" />
								<line x1="3" y1="10" x2="21" y2="10" />
							</svg>
							<span className="text-xs font-medium text-gray-700">
								{new Date().toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									weekday: "short",
								})}
							</span>
						</div>

						{}
						<div className="flex space-x-3">
							<div className="flex items-center space-x-1">
								<div className="relative">
									<div className="absolute inset-0 bg-indigo-100 rounded-full blur-sm opacity-80"></div>
									<div className="relative px-2.5 py-1 bg-white rounded-full border border-indigo-100 shadow-sm flex items-center space-x-1">
										<div className="h-2 w-2 rounded-full bg-indigo-500"></div>
										<span className="text-sm font-semibold text-indigo-700">
											{tasks.filter((t) => !t.completed).length}
										</span>
									</div>
								</div>
								<div className="relative">
									<div className="absolute inset-0 bg-green-100 rounded-full blur-sm opacity-80"></div>
									<div className="relative px-2.5 py-1 bg-white rounded-full border border-green-100 shadow-sm flex items-center space-x-1">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-sm font-semibold text-green-700">
											{tasks.filter((t) => t.completed).length}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
						{}
						<div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
							<div className="absolute -right-8 -top-8 h-16 w-16 bg-indigo-100 rounded-full opacity-70"></div>
							<div className="absolute -left-8 -bottom-8 h-16 w-16 bg-indigo-50 rounded-full opacity-70"></div>
							<ProgressRing progress={calculateProgress()} size="md" />
							<div className="mt-1 text-xs font-medium text-gray-500">
								Completion
							</div>
						</div>

						{}
						<div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white shadow-sm flex flex-col">
							<div className="flex items-center justify-between mb-2">
								<div className="h-1 w-10 bg-gradient-to-r from-rose-500 via-indigo-500 to-slate-500 rounded-full"></div>
								<div className="text-xs font-medium text-gray-500">
									By quadrant
								</div>
							</div>

							<div className="flex-1 grid grid-cols-2 gap-2">
								{quadrants.map((quadrant, index) => (
									<div key={index} className="flex items-center">
										<div
											className={`h-3 w-3 rounded-sm mr-1.5`}
											style={{
												backgroundColor:
													index === 0
														? "#f43f5e"
														: index === 1
														? "#6366f1"
														: index === 2
														? "#f59e0b"
														: "#64748b",
											}}
										></div>
										<span className="text-lg font-bold text-gray-800">
											{tasks.filter((t) => t.quadrant === quadrant.id).length}
										</span>
									</div>
								))}
							</div>
						</div>

						{}
						<div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white shadow-sm col-span-2 sm:col-span-1">
							<div className="flex items-center justify-between mb-1.5">
								<div className="text-xs font-medium text-gray-500">
									Priority
								</div>
								<div className="flex space-x-1">
									<div className="h-2 w-2 rounded-full bg-rose-500"></div>
									<div className="h-2 w-2 rounded-full bg-indigo-500"></div>
								</div>
							</div>

							<div className="space-y-2">
								{}
								<div>
									<div className="flex items-center justify-between mb-1">
										<div className="text-xs text-rose-600 font-medium">
											Urgency
										</div>
										<div className="text-xs text-gray-500">
											{Math.round(
												tasks.reduce((sum, task) => sum + task.urgency, 0) /
													Math.max(tasks.length, 1)
											)}
											%
										</div>
									</div>
									<div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-rose-300 to-rose-500 rounded-full"
											style={{
												width: `${
													tasks.reduce((sum, task) => sum + task.urgency, 0) /
													Math.max(tasks.length, 1)
												}%`,
											}}
										></div>
									</div>
								</div>

								{}
								<div>
									<div className="flex items-center justify-between mb-1">
										<div className="text-xs text-indigo-600 font-medium">
											Importance
										</div>
										<div className="text-xs text-gray-500">
											{Math.round(
												tasks.reduce((sum, task) => sum + task.importance, 0) /
													Math.max(tasks.length, 1)
											)}
											%
										</div>
									</div>
									<div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-indigo-300 to-indigo-500 rounded-full"
											style={{
												width: `${
													tasks.reduce(
														(sum, task) => sum + task.importance,
														0
													) / Math.max(tasks.length, 1)
												}%`,
											}}
										></div>
									</div>
								</div>
							</div>
						</div>

						{}
						<div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white shadow-sm sm:col-span-1 col-span-2">
							<div className="flex items-center justify-between mb-2">
								<div className="text-xs font-medium text-gray-500">
									Distribution
								</div>
								<div className="text-xs text-gray-500">
									{tasks.length} total
								</div>
							</div>

							{}
							<div className="h-5 w-full bg-gray-100 rounded-lg overflow-hidden flex">
								{tasks.length > 0 ? (
									<>
										<div
											className="h-full bg-rose-500 flex items-center justify-center"
											style={{
												width: `${
													(tasks.filter(
														(t) => t.quadrant === "urgent-important"
													).length /
														tasks.length) *
													100
												}%`,
											}}
										>
											{(tasks.filter((t) => t.quadrant === "urgent-important")
												.length /
												tasks.length) *
												100 >
												15 && (
												<span className="text-xs font-bold text-white">
													{
														tasks.filter(
															(t) => t.quadrant === "urgent-important"
														).length
													}
												</span>
											)}
										</div>
										<div
											className="h-full bg-indigo-500 flex items-center justify-center"
											style={{
												width: `${
													(tasks.filter(
														(t) => t.quadrant === "not-urgent-important"
													).length /
														tasks.length) *
													100
												}%`,
											}}
										>
											{(tasks.filter(
												(t) => t.quadrant === "not-urgent-important"
											).length /
												tasks.length) *
												100 >
												15 && (
												<span className="text-xs font-bold text-white">
													{
														tasks.filter(
															(t) => t.quadrant === "not-urgent-important"
														).length
													}
												</span>
											)}
										</div>
										<div
											className="h-full bg-amber-500 flex items-center justify-center"
											style={{
												width: `${
													(tasks.filter(
														(t) => t.quadrant === "urgent-not-important"
													).length /
														tasks.length) *
													100
												}%`,
											}}
										>
											{(tasks.filter(
												(t) => t.quadrant === "urgent-not-important"
											).length /
												tasks.length) *
												100 >
												15 && (
												<span className="text-xs font-bold text-white">
													{
														tasks.filter(
															(t) => t.quadrant === "urgent-not-important"
														).length
													}
												</span>
											)}
										</div>
										<div
											className="h-full bg-slate-500 flex items-center justify-center"
											style={{
												width: `${
													(tasks.filter(
														(t) => t.quadrant === "not-urgent-not-important"
													).length /
														tasks.length) *
													100
												}%`,
											}}
										>
											{(tasks.filter(
												(t) => t.quadrant === "not-urgent-not-important"
											).length /
												tasks.length) *
												100 >
												15 && (
												<span className="text-xs font-bold text-white">
													{
														tasks.filter(
															(t) => t.quadrant === "not-urgent-not-important"
														).length
													}
												</span>
											)}
										</div>
									</>
								) : (
									<div className="bg-gray-200 h-full w-full" />
								)}
							</div>

							{}
							<div className="mt-3 flex justify-between text-[10px] text-gray-500">
								<span>Do First</span>
								<span>Schedule</span>
								<span>Delegate</span>
								<span>Eliminate</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{}
			<main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
					{quadrants.map((quadrant) => {
						const input = quadrantInputs[quadrant.id];
						const showScrollbar = needsScrolling(quadrant.id);

						return (
							<div
								key={quadrant.id}
								className={`${quadrant.bg} ${quadrant.border} border-2 rounded-2xl p-4 sm:p-6 min-h-[450px] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col`}
								onDragOver={handleDragOver}
								onDragEnter={handleDragEnter}
								onDragLeave={handleDragLeave}
								onDrop={(e) => handleDropNative(e, quadrant.id)}
								ref={(el) => {
									if (quadrantRefs.current) {
										quadrantRefs.current[quadrant.id] = el;
									}
								}}
							>
								{}
								<div
									className={`${
										quadrant.headerBg
									} rounded-xl p-4 mb-4 border border-white/30 shadow-sm flex-shrink-0 ${
										activeQuadrantByTouch === quadrant.id
											? "ring-2 ring-indigo-500"
											: ""
									}`}
								>
									<div className="flex items-start space-x-3 !items-center">
										{}
										<div
											className={`p-2 rounded-lg bg-gradient-to-r ${quadrant.gradient} text-white shadow-sm flex-shrink-0`}
										>
											{quadrant.icon}
										</div>
										<div className="flex-1">
											<h2
												className={`font-bold text-xl ${quadrant.textColor} leading-tight`}
											>
												{quadrant.title}
											</h2>
										</div>
										<div className="flex-1 text-right">
											<p className="text-sm text-gray-600 font-medium mb-1">
												{quadrant.subtitle}
											</p>
											<p className="text-xs text-gray-500 font-medium">
												{getTasksInQuadrant(quadrant.id).length} tasks
											</p>
										</div>
									</div>
								</div>

								<div className="flex-grow flex flex-col">
									{}
									<div
										className={`flex-grow flex flex-col ${
											showScrollbar ? "task-list-scrollable pr-2" : ""
										}`}
									>
										{sortedTasksInQuadrant(quadrant.id).map((task) => (
											<TaskCard
												ref={(el: HTMLDivElement | null) => {
													if (el) {
														taskCardRefs.current[task.id] = el;
													} else {
														delete taskCardRefs.current[task.id];
													}
												}}
												key={task.id}
												task={task}
												isExpanded={expandedTask === task.id}
												onClickCard={handleClickCard}
												onHoverCard={handleHoverCard}
												onDeleteTask={deleteTask}
												onToggleTaskComplete={toggleTaskCompletion}
												onUpdateTaskUrgencyImportance={
													updateTaskUrgencyImportance
												}
												isCurrentDraggingTask={draggedTask?.id === task.id}
												onPickupTask={handleTaskPickup}
												onReleaseTask={handleTaskRelease}
												onTouchMoveOverQuadrant={handleTouchMoveOverQuadrant}
												onTouchDrop={handleTouchDrop}
												iconX={icons.x}
												onDropOntoTask={handleDropOnTask}
												onProgressDotInteraction={startAutoCloseTimeout}
											/>
										))}

										{getTasksInQuadrant(quadrant.id).length === 0 && (
											<div className="text-center py-6 text-gray-400 flex flex-col justify-center items-center h-full">
												<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
													{icons.dots}
												</div>
												<p className="text-sm font-medium">No tasks yet</p>
												<p className="text-xs">
													Drag tasks here or add new ones
												</p>
											</div>
										)}
									</div>

									{}
									<div className="mt-4 pt-2 border-t border-white/40">
										{!input.showForm ? (
											<button
												onClick={() => toggleQuadrantForm(quadrant.id)}
												className={`w-full px-4 py-3 bg-gradient-to-r ${quadrant.gradient} text-white rounded-xl hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2 font-medium`}
											>
												{icons.plus}
												<span>Add New Task</span>
											</button>
										) : (
											<div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 space-y-3">
												<input
													type="text"
													placeholder="Task title..."
													value={input.title}
													onChange={(e) =>
														updateQuadrantInput(
															quadrant.id,
															"title",
															e.target.value
														)
													}
													onKeyDown={(e) =>
														e.key === "Enter" && addTask(quadrant.id)
													}
													className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/90 text-gray-900"
													autoFocus
												/>
												<input
													type="text"
													placeholder="Task subtitle..."
													value={input.description || ""}
													onChange={(e) =>
														updateQuadrantInput(
															quadrant.id,
															"description",
															e.target.value
														)
													}
													onKeyDown={(e) =>
														e.key === "Enter" && addTask(quadrant.id)
													}
													className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/90 text-gray-900"
												/>
												<div className="space-y-4">
													<ProgressDots
														value={input.urgency}
														onChange={(value) =>
															updateQuadrantInput(quadrant.id, "urgency", value)
														}
														color="red"
														label="Urgency"
													/>
													<ProgressDots
														value={input.importance}
														onChange={(value) =>
															updateQuadrantInput(
																quadrant.id,
																"importance",
																value
															)
														}
														color="blue"
														label="Importance"
													/>
												</div>
												<div className="flex space-x-2">
													<button
														onClick={() => addTask(quadrant.id)}
														className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 text-sm font-medium"
													>
														Add Task
													</button>
													<button
														onClick={() => toggleQuadrantForm(quadrant.id)}
														className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm font-medium"
													>
														Cancel
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="mt-10 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
					<h3 className="font-bold text-gray-900 mb-4 text-lg text-center">
						Eisenhower Matrix Framework
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{quadrants.map((quadrant, index) => (
							<div key={index} className="text-center">
								<div
									className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${quadrant.gradient} text-white flex items-center justify-center shadow-sm`}
								>
									{quadrant.icon}
								</div>
								<div className={`font-semibold mb-1 ${quadrant.textColor}`}>
									{quadrant.title}
								</div>
								<div className="text-xs text-gray-600 leading-relaxed px-2">
									{index === 0 && "Crisis mode - handle immediately"}
									{index === 1 && "Plan and prevent future crises"}
									{index === 2 && "Interrupt-driven tasks to delegate"}
									{index === 3 && "Time wasters to eliminate"}
								</div>
							</div>
						))}
					</div>
				</div>
			</main>

			{}
			<footer className="bg-white/90 border-t border-white/50 py-8 mt-auto">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<div className="flex items-center mb-4">
								<div className="relative w-10 h-10 sm:w-12 sm:h-12 mr-3 shadow-md rounded-xl">
									{}
									<div className="absolute inset-0 bg-white rounded-xl overflow-hidden border border-gray-100">
										{}
										<div className="absolute top-0 left-0 w-1/2 h-1/2 bg-rose-500 opacity-90"></div>
										<div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500 opacity-90"></div>
										<div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-500 opacity-90"></div>
										<div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-slate-500 opacity-90"></div>

										{}
										<div className="absolute top-[22%] left-0 w-full h-[12%] bg-white/30"></div>
										<div className="absolute top-0 left-[22%] w-[12%] h-full bg-white/30"></div>

										{}
										<div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>

										{}
										<div className="absolute top-[8%] left-[8%] w-[5%] h-[5%] bg-white rounded-full opacity-80"></div>
										<div className="absolute top-[8%] right-[8%] w-[5%] h-[5%] bg-white rounded-full opacity-80"></div>
										<div className="absolute bottom-[8%] left-[8%] w-[5%] h-[5%] bg-white rounded-full opacity-80"></div>
										<div className="absolute bottom-[8%] right-[8%] w-[5%] h-[5%] bg-white rounded-full opacity-80"></div>
									</div>

									{}
									<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent"></div>
								</div>
								<h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
									Eisenhower Matrix
								</h3>
							</div>
							<p className="text-sm text-gray-600 mb-4">
								A professional task prioritization tool based on the Eisenhower
								Method. Boost your productivity by focusing on what truly
								matters.
							</p>
						</div>

						<div>
							<h4 className="font-semibold text-gray-900 mb-3">Features</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-indigo-600 text-sm"
									>
										Task Management
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-indigo-600 text-sm"
									>
										Priority Setting
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-indigo-600 text-sm"
									>
										Drag & Drop
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-indigo-600 text-sm"
									>
										Progress Tracking
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-indigo-600 text-sm"
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-indigo-600 text-sm"
									>
										Productivity Tips
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-indigo-600 text-sm"
									>
										Video Tutorials
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-indigo-600 text-sm"
									>
										Contact Support
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
						<p className="text-xs text-gray-500 mb-4 sm:mb-0">
							2025 Priority Matrix App. Set priorities easily.
						</p>
						<div className="flex space-x-6">
							<a
								href="#"
								className="text-xs text-gray-500 hover:text-indigo-600"
							>
								Terms
							</a>
							<a
								href="#"
								className="text-xs text-gray-500 hover:text-indigo-600"
							>
								Privacy
							</a>
							<a
								href="#"
								className="text-xs text-gray-500 hover:text-indigo-600"
							>
								Cookies
							</a>
						</div>
					</div>
				</div>
			</footer>

			{}
			<Modal
				isOpen={signInModalOpen}
				onClose={() => setSignInModalOpen(false)}
				title="Sign In"
			>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Enter your email"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Enter your password"
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-gray-700"
							>
								Remember me
							</label>
						</div>
						<a
							href="#"
							className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
						>
							Forgot password?
						</a>
					</div>
					<button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Sign In
					</button>
					<div className="text-center text-sm text-gray-600 mt-4">
						Don't have an account?{" "}
						<button
							className="font-medium text-indigo-600 hover:text-indigo-500"
							onClick={() => {
								setSignInModalOpen(false);
								setProModalOpen(true);
							}}
						>
							Sign up for free
						</button>
					</div>
				</div>
			</Modal>

			{}
			<Modal
				isOpen={proModalOpen}
				onClose={() => setProModalOpen(false)}
				title="Upgrade to Pro"
			>
				<div className="space-y-4">
					<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
						<h4 className="font-semibold text-indigo-800 mb-2">Pro Features</h4>
						<ul className="space-y-2 text-sm text-gray-700">
							<li className="flex items-start">
								<span className="text-indigo-500 mr-2 mt-0.5">
									{icons.check}
								</span>
								<span>Unlimited tasks in each quadrant</span>
							</li>
							<li className="flex items-start">
								<span className="text-indigo-500 mr-2 mt-0.5">
									{icons.check}
								</span>
								<span>Team collaboration features</span>
							</li>
							<li className="flex items-start">
								<span className="text-indigo-500 mr-2 mt-0.5">
									{icons.check}
								</span>
								<span>Customizable categories and labels</span>
							</li>
							<li className="flex items-start">
								<span className="text-indigo-500 mr-2 mt-0.5">
									{icons.check}
								</span>
								<span>Advanced analytics and reporting</span>
							</li>
							<li className="flex items-start">
								<span className="text-indigo-500 mr-2 mt-0.5">
									{icons.check}
								</span>
								<span>Priority scoring algorithms</span>
							</li>
						</ul>
					</div>

					<div className="py-3">
						<div className="flex justify-center items-center gap-x-4">
							<div className="text-center flex-1">
								<div className="text-sm font-medium text-gray-500 mb-1">
									Monthly
								</div>
								<div className="text-2xl font-bold text-gray-900">$9.99</div>
								<div className="text-xs text-gray-500">per month</div>
							</div>
							<div className="text-center border-l border-gray-200 pl-4 flex-1">
								<div className="text-sm font-medium text-gray-500 mb-1">
									Yearly
								</div>
								<div className="text-2xl font-bold text-gray-900">$99.99</div>
								<div className="text-xs text-gray-500">$8.33/mo, save 17%</div>
							</div>
						</div>
					</div>

					<button className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Start 14-Day Free Trial
					</button>

					<div className="text-center text-xs text-gray-500 mt-4">
						No credit card required. Cancel anytime.
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default EisenhowerDashboard;
