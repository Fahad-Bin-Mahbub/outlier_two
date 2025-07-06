"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
	Activity,
	Bell,
	Bike,
	ChevronDown,
	Clock,
	Dumbbell,
	Facebook,
	Flame,
	Instagram,
	LayoutDashboard,
	Linkedin,
	Mail,
	MapPin,
	Menu,
	Moon,
	MoreVertical,
	AlertCircle,
	Info,
	PersonStanding,
	Phone,
	Plus,
	Settings,
	Sun,
	Target,
	Trash2,
	TrendingDown,
	TrendingUp,
	Trophy,
	Twitter,
	User,
	Waves,
	X,
	HelpCircle,
	Award,
} from "lucide-react";
import { toast, Toaster } from "sonner";

type ActivityType = {
	id: string;
	type: string;
	date: string;
	duration: number;
	distance: number;
	calories: number;
	status: string;
};

type GoalType = {
	id: number;
	type: string;
	target: number;
	unit: string;
	current: number;
	deadline: string;
};

type NotificationType = {
	id: string;
	type: "goal" | "achievement" | "reminder" | "system";
	message: string;
	timestamp: string;
	read: boolean;
};

type UserDataType = {
	name: string;
	email: string;
	activities: ActivityType[];
	goals: GoalType[];
	preferences: {
		chartStyle: string;
		metricSystem: string;
		weekStart: string;
		colorScheme: string;
	};
};

export default function FitnessExport() {
	const [userData, setUserData] = useState<UserDataType>({
		name: "John Doe",
		email: "john.doe@example.com",
		activities: [],
		goals: [],
		preferences: {
			chartStyle: "gradient",
			metricSystem: "metric",
			weekStart: "monday",
			colorScheme: "default",
		},
	});
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
	const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
	const [editingActivity, setEditingActivity] = useState<ActivityType | null>(
		null
	);
	const [editingGoal, setEditingGoal] = useState<GoalType | null>(null);
	const [notifications, setNotifications] = useState<NotificationType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pendingDeletions, setPendingDeletions] = useState<{
		activities: string[];
		goals: number[];
	}>({ activities: [], goals: [] });
	const activityChartRef = useRef<Chart | null>(null);
	const breakdownChartRef = useRef<Chart | null>(null);
	const goalChartRefs = useRef<{ [key: string]: Chart }>({});
	const activityModalRef = useRef<HTMLDivElement>(null);
	const goalModalRef = useRef<HTMLDivElement>(null);
	const notificationMenuRef = useRef<HTMLDivElement>(null);
	const userMenuRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		updateGoalProgress();
	}, [userData.activities]);

	useEffect(() => {
		updateGoalCharts();
	}, [userData.goals, isDarkMode]);

	useEffect(() => {
		updateActivityCharts();
	}, [userData.activities, isDarkMode]);
	useEffect(() => {
		const initializeData = async () => {
			try {
				setIsLoading(true);
				const savedUserData = localStorage.getItem("userData");
				const savedDarkMode = localStorage.getItem("darkMode");
				const savedNotifications = localStorage.getItem("notifications");

				if (savedUserData) {
					setUserData(JSON.parse(savedUserData));
				} else {
					setUserData({
						name: "John Doe",
						email: "john.doe@example.com",
						activities: [
							{
								id: "1",
								type: "running",
								date: "2025-05-15T07:30",
								duration: 45,
								distance: 5.2,
								calories: 420,
								status: "completed",
							},
							{
								id: "2",
								type: "cycling",
								date: "2025-05-14T18:15",
								duration: 80,
								distance: 18.5,
								calories: 750,
								status: "completed",
							},
							{
								id: "3",
								type: "swimming",
								date: "2025-05-12T08:00",
								duration: 50,
								distance: 1.5,
								calories: 380,
								status: "completed",
							},
							{
								id: "4",
								type: "strength",
								date: "2025-05-10T17:30",
								duration: 60,
								distance: 0,
								calories: 320,
								status: "completed",
							},
						],
						goals: [
							{
								id: 1,
								type: "running",
								target: 100,
								unit: "km",
								current: 70,
								deadline: "2025-06-30",
							},
							{
								id: 2,
								type: "cycling",
								target: 500,
								unit: "km",
								current: 200,
								deadline: "2025-07-15",
							},
						],
						preferences: {
							chartStyle: "gradient",
							metricSystem: "metric",
							weekStart: "monday",
							colorScheme: "default",
						},
					});
				}

				if (savedNotifications) {
					setNotifications(JSON.parse(savedNotifications));
				} else {
					setNotifications([
						{
							id: "1",
							type: "goal",
							message:
								"Goal Achieved! You completed your running goal of 100km",
							timestamp: "2025-05-15T10:00",
							read: false,
						},
						{
							id: "2",
							type: "reminder",
							message: "Time for your daily workout!",
							timestamp: "2025-05-15T09:00",
							read: false,
						},
						{
							id: "3",
							type: "achievement",
							message: "New milestone: 500km cycled!",
							timestamp: "2025-05-14T18:00",
							read: true,
						},
					]);
				}

				setIsDarkMode(savedDarkMode === "true");
			} catch (err) {
				setError("Failed to load data. Please try again.");
				toast.error("Failed to load data. Please try again.");
			} finally {
				setIsLoading(false);
				updateCharts();
			}
		};

		initializeData();
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem("userData", JSON.stringify(userData));
			localStorage.setItem("darkMode", isDarkMode.toString());
			localStorage.setItem("notifications", JSON.stringify(notifications));
		} catch (err) {
			setError("Failed to save data. Storage may be full.");
			toast.error("Failed to save data. Storage may be full.");
		}
	}, [userData, isDarkMode, notifications]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isActivityModalOpen &&
				activityModalRef.current &&
				!activityModalRef.current.contains(event.target as Node)
			) {
				return;
			}
			if (
				isGoalModalOpen &&
				goalModalRef.current &&
				!goalModalRef.current.contains(event.target as Node)
			) {
				return;
			}
			if (
				isNotificationMenuOpen &&
				notificationMenuRef.current &&
				!notificationMenuRef.current.contains(event.target as Node)
			) {
				setIsNotificationMenuOpen(false);
			}
			if (
				isUserMenuOpen &&
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setIsUserMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [
		isActivityModalOpen,
		isGoalModalOpen,
		isNotificationMenuOpen,
		isUserMenuOpen,
	]);

	const getChartColors = () => ({
		running: "#F59E0B",
		cycling: "#EF4444",
		swimming: "#3B82F6",
		strength: "#8B5CF6",
		yoga: "#10B981",
		hiking: "#6D28D9",
		background: isDarkMode ? "#2D3748" : "#E6E9F0",
		gridLines: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
		text: isDarkMode ? "#E2E8F0" : "#2D3748",
	});

	const processActivityData = () => {
		const now = new Date();
		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date(now);
			date.setDate(date.getDate() - (6 - i));
			return { date, dayName: dayNames[date.getDay()] };
		});

		const data = {
			labels: days.map((d) => d.dayName),
			running: Array(7).fill(0),
			cycling: Array(7).fill(0),
			swimming: Array(7).fill(0),
			strength: Array(7).fill(0),
			totals: { running: 0, cycling: 0, swimming: 0, strength: 0 },
		};

		userData.activities.forEach((activity) => {
			const activityDate = new Date(activity.date);
			days.forEach((day, i) => {
				if (activityDate.toDateString() === day.date.toDateString()) {
					if (["running", "cycling", "swimming"].includes(activity.type)) {
						data[activity.type][i] += activity.distance;
					} else {
						data[activity.type][i] += activity.duration;
					}
				}
			});
			if (["running", "cycling", "swimming"].includes(activity.type)) {
				data.totals[activity.type] += activity.distance;
			} else {
				data.totals[activity.type] += activity.duration;
			}
		});

		return data;
	};
	const updateActivityCharts = () => {
		const chartColors = getChartColors();
		const activityData = processActivityData();

		const activityCtx = document.getElementById(
			"activityChart"
		) as HTMLCanvasElement;
		if (activityCtx) {
			if (activityChartRef.current) activityChartRef.current.destroy();
			activityChartRef.current = new Chart(activityCtx, {
				type: "bar",
				data: {
					labels: activityData.labels,
					datasets: [
						{
							label: "Running (km)",
							data: activityData.running,
							backgroundColor: chartColors.running,
							borderRadius: 6,
						},
						{
							label: "Cycling (km)",
							data: activityData.cycling,
							backgroundColor: chartColors.cycling,
							borderRadius: 6,
						},
						{
							label: "Swimming (km)",
							data: activityData.swimming,
							backgroundColor: chartColors.swimming,
							borderRadius: 6,
						},
						{
							label: "Strength (min)",
							data: activityData.strength,
							backgroundColor: chartColors.strength,
							borderRadius: 6,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { position: "top", labels: { color: chartColors.text } },
					},
					scales: {
						x: { grid: { display: false }, ticks: { color: chartColors.text } },
						y: {
							grid: { color: chartColors.gridLines },
							ticks: { color: chartColors.text },
						},
					},
				},
			});
		}

		const breakdownCtx = document.getElementById(
			"breakdownChart"
		) as HTMLCanvasElement;
		if (breakdownCtx) {
			if (breakdownChartRef.current) breakdownChartRef.current.destroy();
			breakdownChartRef.current = new Chart(breakdownCtx, {
				type: "doughnut",
				data: {
					labels: ["Running", "Cycling", "Swimming", "Strength"],
					datasets: [
						{
							data: [
								activityData.totals.running,
								activityData.totals.cycling,
								activityData.totals.swimming,
								activityData.totals.strength,
							],
							backgroundColor: [
								chartColors.running,
								chartColors.cycling,
								chartColors.swimming,
								chartColors.strength,
							],
							borderWidth: 0,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: "70%",
					plugins: {
						legend: { position: "bottom", labels: { color: chartColors.text } },
					},
				},
			});
		}
	};
	const updateCharts = () => {
		if (isLoading) return;
		updateActivityCharts();
		updateGoalCharts();
	};

	const deleteActivity = (id: string) => {
		const activityToDelete = userData.activities.find((a) => a.id === id);
		if (!activityToDelete) return;

		setPendingDeletions({
			...pendingDeletions,
			activities: [...pendingDeletions.activities, id],
		});

		const toastId = toast.info(
			<div>
				Activity deleted
				<button
					onClick={() => {
						setPendingDeletions({
							...pendingDeletions,
							activities: pendingDeletions.activities.filter(
								(pendingId) => pendingId !== id
							),
						});
						toast.dismiss(toastId);
					}}
					className="ml-2 text-blue-500"
				>
					Undo
				</button>
			</div>,
			{
				autoClose: 5000,
				onClose: () => {
					setUserData((prevState) => ({
						...prevState,
						activities: prevState.activities.filter((a) => a.id !== id),
					}));
					setPendingDeletions({
						...pendingDeletions,
						activities: pendingDeletions.activities.filter(
							(pendingId) => pendingId !== id
						),
					});
					setNotifications((prevNotifications) => [
						...prevNotifications,
						{
							id: Date.now().toString(),
							type: "system",
							message: "Activity deleted successfully",
							timestamp: new Date().toISOString(),
							read: false,
						},
					]);
				},
			}
		);
	};

	const deleteGoal = (id: number) => {
		setPendingDeletions({
			...pendingDeletions,
			goals: [...pendingDeletions.goals, id],
		});

		const toastId = toast.info(
			<div>
				Goal deleted
				<button
					onClick={() => {
						setPendingDeletions({
							...pendingDeletions,
							goals: pendingDeletions.goals.filter(
								(pendingId) => pendingId !== id
							),
						});
						toast.dismiss(toastId);
					}}
					className="ml-2 text-blue-500"
				>
					Undo
				</button>
			</div>,
			{
				autoClose: 5000,
				onClose: () => {
					setUserData((prevState) => ({
						...prevState,
						goals: prevState.goals.filter((g) => g.id !== id),
					}));

					setPendingDeletions({
						...pendingDeletions,
						goals: pendingDeletions.goals.filter(
							(pendingId) => pendingId !== id
						),
					});

					setNotifications((prevNotifications) => [
						...prevNotifications,
						{
							id: Date.now().toString(),
							type: "system",
							message: "Goal deleted successfully",
							timestamp: new Date().toISOString(),
							read: false,
						},
					]);
				},
			}
		);
	};

	const updateGoalProgress = () => {
		const updatedGoals = userData.goals.map((goal) => {
			let currentProgress = 0;
			userData.activities.forEach((activity) => {
				if (activity.type === goal.type) {
					if (goal.unit === "km") {
						currentProgress += activity.distance;
					} else if (goal.unit === "min") {
						currentProgress += activity.duration;
					} else if (goal.unit === "kcal") {
						currentProgress += activity.calories;
					}
				}
			});
			const roundedProgress = Math.round(currentProgress * 10) / 10;
			if (goal.current !== roundedProgress) {
				if (roundedProgress >= goal.target && goal.current < goal.target) {
					setNotifications((prevNotifications) => [
						...prevNotifications,
						{
							id: Date.now().toString(),
							type: "goal",
							message: `Goal Achieved! You completed your ${goal.type} goal of ${goal.target}${goal.unit}`,
							timestamp: new Date().toISOString(),
							read: false,
						},
					]);
					toast.success(
						`Congratulations! You've achieved your ${goal.type} goal!`
					);
				}
				return { ...goal, current: roundedProgress };
			}
			return goal;
		});

		setUserData((prevState) => ({
			...prevState,
			goals: updatedGoals,
		}));
	};

	const updateGoalCharts = () => {
		const chartColors = getChartColors();

		userData.goals.forEach((goal) => {
			const goalCtx = document.getElementById(
				`goalChart${goal.id}`
			) as HTMLCanvasElement;
			if (goalCtx) {
				if (goalChartRefs.current[goal.id]) {
					goalChartRefs.current[goal.id].destroy();
				}

				const progress = (goal.current / goal.target) * 100;
				const cappedProgress = Math.min(progress, 100);

				goalChartRefs.current[goal.id] = new Chart(goalCtx, {
					type: "doughnut",
					data: {
						datasets: [
							{
								data: [cappedProgress, 100 - cappedProgress],
								backgroundColor: [
									chartColors[goal.type] || chartColors.running,
									"rgba(0,0,0,0.1)",
								],
								borderWidth: 0,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						cutout: "80%",
						plugins: {
							legend: { display: false },
							tooltip: { enabled: false },
						},
					},
				});
			}
		});
	};

	const clearNotification = (id: string) => {
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	const clearAllNotifications = () => {
		const previousNotifications = [...notifications];
		setNotifications([]);
		const toastId = toast.info(
			<div>
				All notifications cleared
				<button
					onClick={() => {
						setNotifications(previousNotifications);
						toast.dismiss(toastId);
					}}
					className="ml-2 text-blue-500"
				>
					Undo
				</button>
			</div>,
			{ autoClose: 5000 }
		);
	};

	const ActivityModal = ({ onClose }: { onClose: () => void }) => {
		const [isSubmitting, setIsSubmitting] = useState(false);
		const [formError, setFormError] = useState<string | null>(null);
		const [affectedGoals, setAffectedGoals] = useState<GoalType[]>([]);

		useEffect(() => {
			if (editingActivity) {
				const relevantGoals = userData.goals.filter(
					(goal) => goal.type === editingActivity.type
				);
				setAffectedGoals(relevantGoals);
			}
		}, [editingActivity]);

		const handleActivityTypeChange = (
			e: React.ChangeEvent<HTMLSelectElement>
		) => {
			const selectedType = e.target.value;
			const relevantGoals = userData.goals.filter(
				(goal) => goal.type === selectedType
			);
			setAffectedGoals(relevantGoals);
		};

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (isSubmitting) return;
			setIsSubmitting(true);
			setFormError(null);

			const formData = new FormData(e.currentTarget);
			const activityType = formData.get("activityType") as string;
			const activityDate = formData.get("activityDate") as string;
			const duration = parseInt(formData.get("activityDuration") as string);
			const distance =
				parseFloat(formData.get("activityDistance") as string) || 0;
			const calories = parseInt(formData.get("activityCalories") as string);

			if (
				![
					"running",
					"cycling",
					"swimming",
					"strength",
					"yoga",
					"hiking",
				].includes(activityType)
			) {
				setFormError("Invalid activity type");
				setIsSubmitting(false);
				return;
			}
			if (!activityDate || new Date(activityDate) > new Date()) {
				setFormError("Invalid date");
				setIsSubmitting(false);
				return;
			}
			if (isNaN(duration) || duration <= 0) {
				setFormError("Duration must be a positive number");
				setIsSubmitting(false);
				return;
			}
			if (distance < 0) {
				setFormError("Distance cannot be negative");
				setIsSubmitting(false);
				return;
			}
			if (isNaN(calories) || calories <= 0) {
				setFormError("Calories must be a positive number");
				setIsSubmitting(false);
				return;
			}

			const newActivity: ActivityType = {
				id: editingActivity ? editingActivity.id : Date.now().toString(),
				type: activityType,
				date: activityDate,
				duration,
				distance,
				calories,
				status: "completed",
			};

			setUserData((prevState) => {
				const updatedActivities = editingActivity
					? prevState.activities.map((a) =>
							a.id === editingActivity.id ? newActivity : a
					  )
					: [newActivity, ...prevState.activities];
				return { ...prevState, activities: updatedActivities };
			});

			setNotifications((prevNotifications) => [
				...prevNotifications,
				{
					id: Date.now().toString(),
					type: "system",
					message: editingActivity
						? "Activity updated successfully"
						: "Activity added successfully",
					timestamp: new Date().toISOString(),
					read: false,
				},
			]);

			toast.success(
				editingActivity
					? "Activity updated successfully"
					: "Activity added successfully"
			);

			setTimeout(() => {
				setIsSubmitting(false);
				onClose();
			}, 100);
		};

		return (
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="fixed inset-0 bg-black bg-opacity-50"></div>
				<div
					ref={activityModalRef}
					className="neumorph-card p-6 max-w-md w-full z-10 relative"
				>
					<button
						className="absolute top-4 right-4 neumorph-button p-2"
						onClick={onClose}
						aria-label="Close modal"
					>
						<X className="w-4 h-4 text-muted" />
					</button>
					<h3 className="text-xl font-bold text-primary mb-4">
						{editingActivity ? "Edit" : "Add"} Activity
					</h3>
					{formError && (
						<div className="bg-danger bg-opacity-20 text-danger p-3 rounded-md mb-4">
							{formError}
						</div>
					)}
					<form id="activityForm" className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<label className="block text-muted mb-2" htmlFor="activityType">
								Activity Type
							</label>
							<select
								id="activityType"
								name="activityType"
								className="w-full neumorph-input p-3 text-primary"
								defaultValue={editingActivity?.type || "running"}
								onChange={handleActivityTypeChange}
								required
							>
								<option value="running">Running</option>
								<option value="cycling">Cycling</option>
								<option value="swimming">Swimming</option>
								<option value="strength">Strength Training</option>
								<option value="yoga">Yoga</option>
								<option value="hiking">Hiking</option>
							</select>
						</div>
						<div>
							<label className="block text-muted mb-2" htmlFor="activityDate">
								Date & Time
							</label>
							<input
								type="datetime-local"
								id="activityDate"
								name="activityDate"
								className="w-full neumorph-input p-3 text-primary"
								defaultValue={
									editingActivity
										? new Date(editingActivity.date).toISOString().slice(0, 16)
										: new Date().toISOString().slice(0, 16)
								}
								max={new Date().toISOString().slice(0, 16)}
								required
							/>
						</div>
						<div>
							<label
								className="block text-muted mb-2"
								htmlFor="activityDuration"
							>
								Duration (minutes)
							</label>
							<input
								type="number"
								id="activityDuration"
								name="activityDuration"
								className="w-full neumorph-input p-3 text-primary"
								defaultValue={editingActivity?.duration || ""}
								min="1"
								required
							/>
						</div>
						<div>
							<label
								className="block text-muted mb-2"
								htmlFor="activityDistance"
							>
								Distance (km)
							</label>
							<input
								type="number"
								id="activityDistance"
								name="activityDistance"
								className="w-full neumorph-input p-3 text-primary"
								defaultValue={editingActivity?.distance || ""}
								min="0"
								step="0.1"
							/>
						</div>
						<div>
							<label
								className="block text-muted mb-2"
								htmlFor="activityCalories"
							>
								Calories Burned
							</label>
							<input
								type="number"
								id="activityCalories"
								name="activityCalories"
								className="w-full neumorph-input p-3 text-primary"
								defaultValue={editingActivity?.calories || ""}
								min="0"
								required
							/>
						</div>

						{}
						{affectedGoals.length > 0 && (
							<div className="mt-2 p-4 bg-light-secondary dark:bg-dark-secondary rounded-md">
								<h4 className="font-medium text-primary mb-2">
									This activity will update the following goals:
								</h4>
								<ul className="space-y-2">
									{affectedGoals.map((goal) => (
										<li key={goal.id} className="flex items-center">
											<div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
											<span className="text-primary">
												{goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}{" "}
												-{goal.target} {goal.unit} (
												{Math.round((goal.current / goal.target) * 100)}%
												complete)
											</span>
										</li>
									))}
								</ul>
							</div>
						)}

						<div className="flex justify-end space-x-3 pt-4">
							<button
								type="button"
								className="neumorph-button px-4 py-2 text-primary"
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="primary-button px-4 py-2"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Saving..." : "Save Activity"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	const GoalModal = ({ onClose }: { onClose: () => void }) => {
		const [isSubmitting, setIsSubmitting] = useState(false);
		const [formError, setFormError] = useState<string | null>(null);

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (isSubmitting) return;
			setIsSubmitting(true);
			setFormError(null);

			const formData = new FormData(e.currentTarget);
			const goalType = formData.get("goalType") as string;
			const target = parseFloat(formData.get("goalTarget") as string);
			const unit = formData.get("goalUnit") as string;
			const deadline = formData.get("goalDeadline") as string;

			if (!["running", "cycling", "swimming", "strength"].includes(goalType)) {
				setFormError("Invalid goal type");
				setIsSubmitting(false);
				return;
			}
			if (isNaN(target) || target <= 0) {
				setFormError("Target must be a positive number");
				setIsSubmitting(false);
				return;
			}
			if (!["km", "min", "kcal"].includes(unit)) {
				setFormError("Invalid unit");
				setIsSubmitting(false);
				return;
			}
			if (!deadline || new Date(deadline) < new Date()) {
				setFormError("Deadline must be in the future");
				setIsSubmitting(false);
				return;
			}

			const newGoal: GoalType = {
				id: editingGoal
					? editingGoal.id
					: userData.goals.length > 0
					? Math.max(...userData.goals.map((g) => g.id)) + 1
					: 1,
				type: goalType,
				target,
				unit,
				current: 0,
				deadline,
			};

			if (!editingGoal) {
				let initialProgress = 0;
				userData.activities.forEach((activity) => {
					if (activity.type === goalType) {
						if (unit === "km") initialProgress += activity.distance;
						else if (unit === "min") initialProgress += activity.duration;
						else if (unit === "kcal") initialProgress += activity.calories;
					}
				});
				newGoal.current = Math.round(initialProgress * 10) / 10;
			}

			setUserData((prevState) => {
				const updatedGoals = editingGoal
					? prevState.goals.map((g) => (g.id === editingGoal.id ? newGoal : g))
					: [...prevState.goals, newGoal];
				return { ...prevState, goals: updatedGoals };
			});

			setNotifications((prevNotifications) => [
				...prevNotifications,
				{
					id: Date.now().toString(),
					type: "system",
					message: editingGoal
						? "Goal updated successfully"
						: "Goal added successfully",
					timestamp: new Date().toISOString(),
					read: false,
				},
			]);

			toast.success(
				editingGoal ? "Goal updated successfully" : "Goal added successfully"
			);

			setTimeout(() => {
				setIsSubmitting(false);
				onClose();
			}, 100);
		};

		const defaultDeadline = new Date();
		defaultDeadline.setDate(defaultDeadline.getDate() + 30);

		return (
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
				<div
					ref={goalModalRef}
					className="neumorph-card p-6 max-w-md w-full z-10 relative form-modal"
				>
					<button
						className="absolute top-4 right-4 neumorph-button p-2"
						onClick={onClose}
						aria-label="Close modal"
					>
						<X className="w-4 h-4 text-muted" />
					</button>
					<h3 className="text-xl font-bold text-primary mb-5">
						{editingGoal ? "Edit" : "Set New"} Goal
					</h3>
					{formError && (
						<div className="bg-danger bg-opacity-20 text-danger p-3 rounded-md mb-5">
							{formError}
						</div>
					)}
					<form id="goalForm" className="space-y-5" onSubmit={handleSubmit}>
						<div>
							<label
								className="block font-medium text-primary mb-2"
								htmlFor="goalType"
							>
								Activity Type
							</label>
							<select
								id="goalType"
								name="goalType"
								className="w-full neumorph-input p-3 text-primary"
								defaultValue={editingGoal?.type || "running"}
								required
							>
								<option value="running">Running</option>
								<option value="cycling">Cycling</option>
								<option value="swimming">Swimming</option>
								<option value="strength">Strength Training</option>
							</select>
						</div>
						<div className="grid grid-cols-2 gap-5">
							<div>
								<label
									className="block font-medium text-primary mb-2"
									htmlFor="goalTarget"
								>
									Target
								</label>
								<input
									type="number"
									id="goalTarget"
									name="goalTarget"
									className="w-full neumorph-input p-3 text-primary"
									defaultValue={editingGoal?.target || ""}
									min="1"
									step="0.1"
									required
									placeholder="Enter target"
								/>
							</div>
							<div>
								<label
									className="block font-medium text-primary mb-2"
									htmlFor="goalUnit"
								>
									Unit
								</label>
								<select
									id="goalUnit"
									name="goalUnit"
									className="w-full neumorph-input p-3 text-primary"
									defaultValue={editingGoal?.unit || "km"}
									required
								>
									<option value="km">Kilometers (km)</option>
									<option value="min">Minutes (min)</option>
									<option value="kcal">Calories (kcal)</option>
								</select>
							</div>
						</div>
						<div>
							<label
								className="block font-medium text-primary mb-2"
								htmlFor="goalDeadline"
							>
								Deadline
							</label>
							<input
								type="date"
								id="goalDeadline"
								name="goalDeadline"
								className="w-full neumorph-input p-3 text-primary"
								defaultValue={
									editingGoal?.deadline ||
									defaultDeadline.toISOString().split("T")[0]
								}
								min={new Date().toISOString().split("T")[0]}
								required
							/>
						</div>
						<div className="mt-2 p-4 bg-light-secondary dark:bg-dark-secondary rounded-md">
							<div className="flex items-center">
								<div className="mr-3">
									<Info className="w-5 h-5 text-info" />
								</div>
								<p className="text-sm text-primary">
									Your goal progress will automatically update based on your
									tracked activities.
								</p>
							</div>
						</div>
						<div className="flex justify-end space-x-4 pt-5">
							<button
								type="button"
								className="neumorph-button px-5 py-2 text-primary font-medium"
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="primary-button px-5 py-2 font-medium"
								disabled={isSubmitting}
							>
								{isSubmitting
									? "Saving..."
									: (editingGoal ? "Update" : "Save") + " Goal"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="bg-danger bg-opacity-20 text-danger p-6 rounded-md">
					{error}
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
			</div>
		);
	}

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<Toaster richColors position="top-right" />
			{isMobileMenuOpen && (
				<div
					className="mobile-nav-overlay fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={() => setIsMobileMenuOpen(false)}
				></div>
			)}
			<header className="fixed top-0 right-0 left-0 ml-20 z-40">
				<div className="header-container p-4 flex justify-between items-center">
					<div className="flex items-center">
						<button
							className="mobile-menu-toggle md:hidden"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle mobile menu"
						>
							{isMobileMenuOpen ? (
								<X className="w-5 h-5 text-accent" />
							) : (
								<Menu className="w-5 h-5 text-accent" />
							)}
						</button>
						<h1 className="text-xl font-bold text-primary hidden md:block">
							Sports Activity Tracker Pro
						</h1>
						<span className="text-accent text-lg font-bold md:hidden">
							SAT Pro
						</span>
					</div>
					<div className="flex items-center space-x-4">
						<div className="relative">
							<button
								className="neumorph-button p-2 relative"
								onClick={() =>
									setIsNotificationMenuOpen(!isNotificationMenuOpen)
								}
								aria-label={`Notifications (${
									notifications.filter((n) => !n.read).length
								} unread)`}
							>
								<Bell className="w-5 h-5 text-accent" />
								{notifications.filter((n) => !n.read).length > 0 && (
									<span className="notification-badge">
										{notifications.filter((n) => !n.read).length}
									</span>
								)}
							</button>
							{isNotificationMenuOpen && (
								<div
									ref={notificationMenuRef}
									className="dropdown-menu absolute right-0 mt-2 w-80 bg-white dark:bg-dark-primary shadow-lg rounded-lg flex flex-col max-h-[80vh]"
								>
									<div className="p-4 border-b border-light-shadow-2 dark:border-dark-shadow-2 flex-shrink-0">
										<div className="flex justify-between items-center">
											<p className="font-medium text-primary">Notifications</p>
											<span className="text-xs px-2 py-1 bg-accent bg-opacity-20 text-accent rounded-full">
												{notifications.filter((n) => !n.read).length} new
											</span>
										</div>
									</div>
									<div className="overflow-y-auto flex-grow">
										{notifications.length === 0 ? (
											<div className="p-4 text-center text-muted">
												No notifications
											</div>
										) : (
											notifications.map((notification) => (
												<div
													key={notification.id}
													className={`p-4 flex items-start border-b border-light-shadow-2 dark:border-dark-shadow-2 transition-colors hover:bg-light-secondary dark:hover:bg-dark-secondary ${
														notification.read ? "" : "relative"
													}`}
												>
													{!notification.read && (
														<div className="absolute w-2 h-2 rounded-full bg-light-accent left-3 top-[1.4rem]"></div>
													)}
													<div className="neumorph-icon-container p-2 mr-3 flex-shrink-0">
														{notification.type === "goal" && (
															<Target className="w-4 h-4 text-success" />
														)}
														{notification.type === "achievement" && (
															<Trophy className="w-4 h-4 text-success" />
														)}
														{notification.type === "reminder" && (
															<Clock className="w-4 h-4 text-warning" />
														)}
														{notification.type === "system" && (
															<Settings className="w-4 h-4 text-info" />
														)}
													</div>
													<div className="flex-grow mx-1">
														<p className="text-primary text-sm font-medium">
															{notification.message}
														</p>
														<p className="text-xs text-accent mt-1">
															{new Date(notification.timestamp).toLocaleString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																	hour: "numeric",
																	minute: "numeric",
																}
															)}
														</p>
													</div>
													<button
														className="neumorph-button p-2 ml-2 flex-shrink-0"
														onClick={() => clearNotification(notification.id)}
														aria-label="Clear notification"
													>
														<X className="w-4 h-4 text-muted" />
													</button>
												</div>
											))
										)}
									</div>
									{notifications.length > 0 && (
										<div className="p-3 border-t border-light-shadow-2 dark:border-dark-shadow-2 text-center flex-shrink-0">
											<button
												className="text-danger text-sm hover:underline"
												onClick={clearAllNotifications}
											>
												Clear all notifications
											</button>
										</div>
									)}
								</div>
							)}
						</div>
						<div className="relative">
							<button
								className="flex items-center space-x-2 neumorph-card p-2 pr-4"
								onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
								aria-label="User menu"
							>
								<img
									src="https://randomuser.me/api/portraits/men/32.jpg"
									alt="User Avatar"
									className="user-avatar"
								/>
								<span className="text-primary font-medium hidden md:block">
									{userData.name}
								</span>
								<ChevronDown className="w-4 h-4 text-muted hidden md:block" />
							</button>
							{isUserMenuOpen && (
								<div
									ref={userMenuRef}
									className="dropdown-menu absolute right-0 mt-2 bg-white dark:bg-dark-primary shadow-lg rounded-lg"
								>
									<div className="p-4 border-b border-light-shadow-2 dark:border-dark-shadow-2">
										<p className="font-medium text-primary">{userData.name}</p>
										<p className="text-sm text-muted">{userData.email}</p>
									</div>
									<a href="#" className="dropdown-item">
										<User className="w-4 h-4 mr-3 text-muted" />
										<span className="text-primary">My Profile</span>
									</a>
									<a href="#" className="dropdown-item">
										<Settings className="w-4 h-4 mr-3 text-muted" />
										<span className="text-primary">Settings</span>
									</a>
									<a href="#" className="dropdown-item">
										<Award className="w-4 h-4 mr-3 text-muted" />
										<span className="text-primary">Achievements</span>
									</a>
									<a href="#" className="dropdown-item">
										<Settings className="w-4 h-4 mr-3 text-muted" />
										<span className="text-primary">Preferences</span>
									</a>
									<a href="#" className="dropdown-item">
										<HelpCircle className="w-4 h-4 mr-3 text-muted" />
										<span className="text-primary">Help & Support</span>
									</a>
									<div className="dropdown-divider"></div>
									<a href="#" className="dropdown-item">
										<User className="w-4 h-4 mr-3 text-danger" />
										<span className="text-primary">Log Out</span>
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<nav
				className={`fixed left-0 top-0 h-full w-20 neumorph-nav flex flex-col items-center py-8 z-50 ${
					isMobileMenuOpen ? "mobile-nav-open" : ""
				}`}
			>
				<div className="brand text-2xl font-bold text-accent">SAT</div>
				<div className="flex flex-col space-y-6 mt-8">
					<a
						href="#dashboard"
						className="nav-link relative p-3 neumorph-button flex items-center justify-center"
					>
						<LayoutDashboard className="w-6 h-6 text-accent" />
						<span className="nav-tooltip">Dashboard</span>
					</a>
					<a
						href="#activities"
						className="nav-link relative p-3 neumorph-button flex items-center justify-center"
					>
						<Activity className="w-6 h-6 text-accent" />
						<span className="nav-tooltip">Activities</span>
					</a>
					<a
						href="#goals"
						className="nav-link relative p-3 neumorph-button flex items-center justify-center"
					>
						<Target className="w-6 h-6 text-accent" />
						<span className="nav-tooltip">Goals</span>
					</a>
				</div>
				<div className="mt-auto mb-8">
					<button
						className="relative p-3 neumorph-button flex items-center justify-center"
						onClick={() => setIsDarkMode(!isDarkMode)}
						aria-label="Toggle theme"
					>
						{isDarkMode ? (
							<Sun className="w-6 h-6 text-accent" />
						) : (
							<Moon className="w-6 h-6 text-accent" />
						)}
						<span className="nav-tooltip">Toggle Theme</span>
					</button>
				</div>
			</nav>

			<main className="ml-20 pt-28 p-6 lg:px-10 lg:pb-10 min-h-screen">
				<section id="dashboard" className="mb-16 fade-in">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
						<div>
							<h1 className="text-3xl font-bold mb-2 section-title text-primary">
								Activity Dashboard
							</h1>
							<p className="text-muted">
								Track your fitness journey with precision and elegance
							</p>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
						<div className="neumorph-card p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-primary">
									Total Activities
								</h3>
								<div className="neumorph-icon-container p-2">
									<Activity className="w-5 h-5 text-accent" />
								</div>
							</div>
							<div className="flex items-end">
								<span className="text-3xl font-bold text-primary">
									{userData.activities.length}
								</span>
								<span className="text-success ml-2 flex items-center text-sm">
									<TrendingUp className="w-4 h-4 mr-1" />
									12%
								</span>
							</div>
							<p className="text-muted text-sm mt-2">Compared to last month</p>
						</div>
						<div className="neumorph-card p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-primary">
									Total Distance
								</h3>
								<div className="neumorph-icon-container p-2">
									<MapPin className="w-5 h-5 text-accent" />
								</div>
							</div>
							<div className="flex items-end">
								<span className="text-3xl font-bold text-primary">
									{userData.activities
										.reduce((sum, a) => sum + a.distance, 0)
										.toFixed(1)}
								</span>
								<span className="text-sm text-primary ml-1">km</span>
								<span className="text-success ml-2 flex items-center text-sm">
									<TrendingUp className="w-4 h-4 mr-1" />
									8%
								</span>
							</div>
							<p className="text-muted text-sm mt-2">Compared to last month</p>
						</div>
						<div className="neumorph-card p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-primary">
									Calories Burned
								</h3>
								<div className="neumorph-icon-container p-2">
									<Flame className="w-5 h-5 text-accent" />
								</div>
							</div>
							<div className="flex items-end">
								<span className="text-3xl font-bold text-primary">
									{userData.activities.reduce((sum, a) => sum + a.calories, 0)}
								</span>
								<span className="text-danger ml-2 flex items-center text-sm">
									<TrendingDown className="w-4 h-4 mr-1" />
									3%
								</span>
							</div>
							<p className="text-muted text-sm mt-2">Compared to last month</p>
						</div>
						<div className="neumorph-card p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-primary">
									Active Time
								</h3>
								<div className="neumorph-icon-container p-2">
									<Clock className="w-5 h-5 text-accent" />
								</div>
							</div>
							<div className="flex items-end">
								<span className="text-3xl font-bold text-primary">
									{(
										userData.activities.reduce(
											(sum, a) => sum + a.duration,
											0
										) / 60
									).toFixed(1)}
								</span>
								<span className="text-sm text-primary ml-1">hrs</span>
								<span className="text-success ml-2 flex items-center text-sm">
									<TrendingUp className="w-4 h-4 mr-1" />
									15%
								</span>
							</div>
							<p className="text-muted text-sm mt-2">Compared to last month</p>
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
						<div className="neumorph-card p-6 lg:col-span-2 fade-in">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-semibold text-primary">
									Weekly Activity
								</h3>
							</div>
							<div className="chart-container">
								<canvas id="activityChart" height="250"></canvas>
							</div>
						</div>
						<div className="neumorph-card p-6 fade-in">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-semibold text-primary">
									Activity Breakdown
								</h3>
							</div>
							<div className="chart-container">
								<canvas id="breakdownChart" height="250"></canvas>
							</div>
						</div>
					</div>
					<div className="neumorph-card p-6 mb-8 fade-in" id="activities">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-primary">
								Recent Activities
							</h3>
							<button
								className="primary-button text-sm py-2"
								onClick={() => {
									setEditingActivity(null);
									setIsActivityModalOpen(true);
								}}
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Activity
							</button>
						</div>
						{userData.activities.length === 0 ? (
							<div className="text-center py-8 text-muted">
								No activities yet. Add one to get started!
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="text-left text-muted border-b border-light-shadow-2 dark:border-dark-shadow-2">
											<th className="pb-3 font-medium">Activity</th>
											<th className="pb-3 font-medium">Date</th>
											<th className="pb-3 font-medium">Duration</th>
											<th className="pb-3 font-medium">Distance</th>
											<th className="pb-3 font-medium">Calories</th>
											<th className="pb-3 font-medium">Status</th>
											<th className="pb-3 font-medium">Actions</th>
										</tr>
									</thead>
									<tbody>
										{userData.activities
											.filter(
												(activity) =>
													!pendingDeletions.activities.includes(activity.id)
											)
											.slice(0, 5)
											.map((activity) => (
												<tr
													key={activity.id}
													className="border-b border-light-shadow-2 dark:border-dark-shadow-2"
												>
													<td className="py-4">
														<div className="flex items-center">
															<div className="neumorph-icon-container p-2 mr-3">
																{activity.type === "running" && (
																	<PersonStanding className="w-4 h-4 icon-running" />
																)}
																{activity.type === "cycling" && (
																	<Bike className="w-4 h-4 icon-cycling" />
																)}
																{activity.type === "swimming" && (
																	<Waves className="w-4 h-4 icon-swimming" />
																)}
																{activity.type === "strength" && (
																	<Dumbbell className="w-4 h-4 icon-strength" />
																)}
																{activity.type === "yoga" && (
																	<PersonStanding className="w-4 h-4 icon-yoga" />
																)}
																{activity.type === "hiking" && (
																	<PersonStanding className="w-4 h-4 icon-hiking" />
																)}
															</div>
															<span className="font-medium text-primary">
																{activity.type.charAt(0).toUpperCase() +
																	activity.type.slice(1)}
															</span>
														</div>
													</td>
													<td className="py-4 text-muted">
														{new Date(activity.date).toLocaleString("en-US", {
															month: "short",
															day: "numeric",
															hour: "numeric",
															minute: "numeric",
														})}
													</td>
													<td className="py-4 text-muted">
														{activity.duration} min
													</td>
													<td className="py-4 text-muted">
														{activity.distance > 0
															? `${activity.distance} km`
															: "-"}
													</td>
													<td className="py-4 text-muted">
														{activity.calories} kcal
													</td>
													<td className="py-4">
														<span className="px-2 py-1 text-xs rounded-full bg-success bg-opacity-20 text-success">
															{activity.status.charAt(0).toUpperCase() +
																activity.status.slice(1)}
														</span>
													</td>
													<td className="py-4 flex space-x-2">
														<button
															className="neumorph-button p-2"
															onClick={() => {
																setEditingActivity(activity);
																setIsActivityModalOpen(true);
															}}
															aria-label={`Edit ${activity.type} activity`}
														>
															<Settings className="w-4 h-4 text-muted" />
														</button>
														<button
															className="neumorph-button p-2"
															onClick={() => deleteActivity(activity.id)}
															aria-label={`Delete ${activity.type} activity`}
														>
															<Trash2 className="w-4 h-4 text-danger" />
														</button>
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</section>

				<section id="goals" className="mb-16 fade-in">
					<h2 className="text-2xl font-bold mb-8 section-title text-primary">
						Fitness Goals
					</h2>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
						<p className="text-muted mb-4 md:mb-0">
							Track your progress towards your fitness goals
						</p>
						<button
							className="primary-button text-sm py-2"
							onClick={() => {
								setEditingGoal(null);
								setIsGoalModalOpen(true);
							}}
						>
							<Plus className="w-4 h-4 mr-2" />
							Add New Goal
						</button>
					</div>
					{userData.goals.length === 0 ? (
						<div className="text-center py-8 text-muted">
							No goals yet. Set one to challenge yourself!
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{userData.goals
								.filter((goal) => !pendingDeletions.goals.includes(goal.id))
								.map((goal) => {
									const progress = Math.round(
										(goal.current / goal.target) * 100
									);
									return (
										<div
											key={goal.id}
											className="neumorph-card p-5 flex items-center justify-between"
										>
											<div>
												<p className="font-semibold text-primary text-lg">
													{goal.type.charAt(0).toUpperCase() +
														goal.type.slice(1)}{" "}
													{goal.target}
													{goal.unit}
												</p>
												<p className="text-sm text-muted mt-1">
													Progress: {goal.current}
													{goal.unit} ({progress}%)
												</p>
												<div className="w-48 neumorph-progress mt-3">
													<div
														className="neumorph-progress-bar"
														style={{ width: `${progress}%` }}
													></div>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-24 h-24 neumorph-icon-container flex items-center justify-center">
													<canvas id={`goalChart${goal.id}`}></canvas>
												</div>
												<div className="flex flex-col space-y-2">
													<button
														className="neumorph-button p-2"
														onClick={() => {
															setEditingGoal(goal);
															setIsGoalModalOpen(true);
														}}
														aria-label={`Edit ${goal.type} goal`}
													>
														<Settings className="w-4 h-4 text-muted" />
													</button>
													<button
														className="neumorph-button p-2"
														onClick={() => deleteGoal(goal.id)}
														aria-label={`Delete ${goal.type} goal`}
													>
														<Trash2 className="w-4 h-4 text-danger" />
													</button>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					)}
				</section>

				<footer className="footer mt-16 py-8 px-6">
					<div className="container mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							<div>
								<h3 className="text-xl font-bold text-primary mb-4">
									Sports Activity Tracker
								</h3>
								<p className="text-muted mb-4">
									Track your fitness journey with precision and elegance.
								</p>
								<div className="flex space-x-3">
									<a href="#" className="social-icon">
										<Facebook className="w-4 h-4 text-accent" />
									</a>
									<a href="#" className="social-icon">
										<Twitter className="w-4 h-4 text-accent" />
									</a>
									<a href="#" className="social-icon">
										<Instagram className="w-4 h-4 text-accent" />
									</a>
									<a href="#" className="social-icon">
										<Linkedin className="w-4 h-4 text-accent" />
									</a>
								</div>
							</div>
							<div>
								<h4 className="text-lg font-semibold text-primary mb-4">
									Quick Links
								</h4>
								<ul className="space-y-2">
									<li>
										<a
											href="#dashboard"
											className="text-muted hover:text-accent transition-colors"
										>
											Dashboard
										</a>
									</li>
									<li>
										<a
											href="#activities"
											className="text-muted hover:text-accent transition-colors"
										>
											Activities
										</a>
									</li>
									<li>
										<a
											href="#goals"
											className="text-muted hover:text-accent transition-colors"
										>
											Goals
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h4 className="text-lg font-semibold text-primary mb-4">
									Resources
								</h4>
								<ul className="space-y-2">
									<li>
										<a
											href="#"
											className="text-muted hover:text-accent transition-colors"
										>
											Help Center
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-muted hover:text-accent transition-colors"
										>
											Community
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h4 className="text-lg font-semibold text-primary mb-4">
									Contact Us
								</h4>
								<ul className="space-y-2">
									<li className="flex items-start">
										<MapPin className="w-5 h-5 text-accent mr-2 mt-0.5" />
										<span className="text-muted">
											123 Fitness Street, Exercise City, 10001
										</span>
									</li>
									<li className="flex items-center">
										<Mail className="w-5 h-5 text-accent mr-2" />
										<span className="text-muted">
											support@sportstracker.com
										</span>
									</li>
									<li className="flex items-center">
										<Phone className="w-5 h-5 text-accent mr-2" />
										<span className="text-muted">+1 (555) 123-4567</span>
									</li>
								</ul>
							</div>
						</div>
						<div className="border-t border-light-shadow-2 dark:border-dark-shadow-2 mt-8 pt-8 flex flex-col md:flex-row md:justify-between md:items-center">
							<p className="text-muted text-sm mb-4 md:mb-0">
								© 2025 Sports Activity Tracker Pro. All rights reserved.
							</p>
							<div className="flex flex-wrap gap-4">
								<a
									href="#"
									className="text-muted text-sm hover:text-accent transition-colors"
								>
									Privacy Policy
								</a>
								<a
									href="#"
									className="text-muted text-sm hover:text-accent transition-colors"
								>
									Terms of Service
								</a>
							</div>
						</div>
					</div>
				</footer>
			</main>

			{isActivityModalOpen && (
				<ActivityModal
					onClose={() => {
						setIsActivityModalOpen(false);
						setEditingActivity(null);
					}}
				/>
			)}
			{isGoalModalOpen && (
				<GoalModal
					onClose={() => {
						setIsGoalModalOpen(false);
						setEditingGoal(null);
					}}
				/>
			)}

			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap");

				:root {
					--light-primary: #f0f2f8;
					--light-secondary: #eaecf5;
					--light-accent: #6c63ff;
					--light-accent-hover: #5a52e0;
					--light-text: #2d3748;
					--light-text-secondary: #4a5568;
					--light-muted: #718096;
					--light-shadow-1: rgba(255, 255, 255, 0.9);
					--light-shadow-2: rgba(209, 217, 230, 0.7);
					--light-success: #48bb78;
					--light-warning: #f59e0b;
					--light-danger: #ef4444;
					--light-info: #3b82f6;

					--running-color: #f59e0b;
					--cycling-color: #ef4444;
					--swimming-color: #3b82f6;
					--strength-color: #8b5cf6;
					--yoga-color: #10b981;
					--hiking-color: #6d28d9;

					--dark-primary: #292d3e;
					--dark-secondary: #252a3c;
					--dark-accent: #6c63ff;
					--dark-accent-hover: #5a52e0;
					--dark-text: #f0f2f5;
					--dark-text-secondary: #d1d5e2;
					--dark-muted: #d1d5db;
					--dark-shadow-1: rgba(50, 56, 70, 0.7);
					--dark-shadow-2: rgba(30, 34, 53, 0.7);
					--dark-success: #48bb78;
					--dark-warning: #f59e0b;
					--dark-danger: #ef4444;
					--dark-info: #3b82f6;

					--space-xs: 0.25rem;
					--space-sm: 0.5rem;
					--space-md: 1rem;
					--space-lg: 1.5rem;
					--space-xl: 2rem;
					--space-2xl: 3rem;

					--radius-sm: 6px;
					--radius-md: 12px;
					--radius-lg: 20px;
					--radius-full: 9999px;

					--transition-fast: 0.2s ease;
					--transition-normal: 0.3s ease;
					--transition-slow: 0.5s ease;
				}

				main {
					padding-top: 80px;
				}

				body {
					font-family: "Inter", sans-serif;
					transition: background-color var(--transition-normal),
						color var(--transition-normal);
					background-color: var(--light-primary);
					color: var(--light-text);
					line-height: 1.6;
					overflow-x: hidden;
				}

				.dark {
					background-color: var(--dark-primary);
					color: var(--dark-text);
				}

				h1,
				h2,
				h3,
				h4,
				h5,
				h6,
				.brand {
					font-family: "Poppins", sans-serif;
					font-weight: 600;
					line-height: 1.3;
				}

				.text-primary {
					color: var(--light-text);
				}
				.dark .text-primary {
					color: var(--dark-text);
				}
				.text-secondary {
					color: var(--light-text-secondary);
				}
				.dark .text-secondary {
					color: var(--dark-text-secondary);
				}
				.text-muted {
					color: var(--light-muted);
				}
				.dark .text-muted {
					color: var(--dark-muted);
				}
				.text-accent {
					color: var(--light-accent);
				}
				.dark .text-accent {
					color: var(--dark-accent);
				}
				.text-success {
					color: var(--light-success);
				}
				.dark .text-success {
					color: var(--dark-success);
				}
				.text-warning {
					color: var(--light-warning);
				}
				.dark .text-warning {
					color: var(--dark-warning);
				}
				.text-danger {
					color: var(--light-danger);
				}
				.dark .text-danger {
					color: var(--dark-danger);
				}
				.text-info {
					color: var(--light-info);
				}
				.dark .text-info {
					color: var(--dark-info);
				}

				.chart-container {
					position: relative;
					height: 300px;
					width: 100%;
				}

				.neumorph-input {
					background-color: var(--light-primary);
					box-shadow: inset 2px 2px 5px var(--light-shadow-2),
						inset -2px -2px 5px var(--light-shadow-1);
					border: none;
					border-radius: var(--radius-md);
					transition: all var(--transition-fast);
					color: var(--light-text);
					font-weight: 500;
				}

				.dark .neumorph-input {
					background-color: var(--dark-secondary);
					box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2),
						inset -2px -2px 5px rgba(255, 255, 255, 0.05);
					color: #ffffff;
				}

				.neumorph-input:focus {
					outline: none;
					box-shadow: inset 1px 1px 3px var(--light-shadow-2),
						inset -1px -1px 3px var(--light-shadow-1),
						0 0 0 2px rgba(108, 99, 255, 0.2);
				}

				.dark .neumorph-input:focus {
					box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.3),
						inset -1px -1px 3px rgba(255, 255, 255, 0.05),
						0 0 0 2px rgba(108, 99, 255, 0.4);
				}

				.neumorph-card {
					background-color: var(--light-primary);
					box-shadow: 4px 4px 10px rgba(209, 217, 230, 0.8),
						-4px -4px 10px rgba(255, 255, 255, 0.8);
					border-radius: var(--radius-md);
					transition: all var(--transition-normal);
				}

				.neumorph-card:hover {
					transform: translateY(-3px);
					box-shadow: 6px 6px 12px rgba(209, 217, 230, 0.8),
						-6px -6px 12px rgba(255, 255, 255, 0.8);
				}

				.dark .neumorph-card {
					background-color: var(--dark-primary);
					box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3),
						-5px -5px 10px rgba(83, 90, 107, 0.15);
				}

				.dark .neumorph-card:hover {
					box-shadow: 7px 7px 14px rgba(0, 0, 0, 0.3),
						-7px -7px 14px rgba(83, 90, 107, 0.15);
				}

				label.block.text-muted {
					font-weight: 500;
					margin-bottom: 0.5rem;
				}

				.dark label.block.text-muted {
					color: #b4bcd0;
				}

				.dark label.block.font-medium {
					color: #e0e6f1;
				}

				.neumorph-button {
					background-color: var(--light-primary);
					box-shadow: 3px 3px 6px rgba(209, 217, 230, 0.8),
						-3px -3px 6px rgba(255, 255, 255, 0.8);
					border-radius: var(--radius-full);
					transition: all var(--transition-fast);
				}

				.neumorph-button:hover,
				.neumorph-button:focus {
					box-shadow: 2px 2px 4px rgba(209, 217, 230, 0.8),
						-2px -2px 4px rgba(255, 255, 255, 0.8),
						inset 1px 1px 2px rgba(209, 217, 230, 0.4),
						inset -1px -1px 2px rgba(255, 255, 255, 0.4);
					transform: translateY(-1px);
				}

				.dark .neumorph-button {
					background-color: var(--dark-primary);
					box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25),
						-3px -3px 6px rgba(83, 90, 107, 0.15);
				}

				.dark .neumorph-button:hover,
				.dark .neumorph-button:focus {
					box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25),
						-2px -2px 4px rgba(83, 90, 107, 0.15),
						inset 1px 1px 2px rgba(0, 0, 0, 0.15),
						inset -1px -1px 2px rgba(83, 90, 107, 0.1);
				}

				.fixed.inset-0.bg-black.bg-opacity-50 {
					backdrop-filter: blur(3px);
				}

				.dark select.neumorph-input,
				.dark input.neumorph-input {
					background-color: rgba(45, 50, 70, 0.8);
					color: #ffffff;
				}

				.neumorph-input::placeholder {
					color: var(--light-muted);
					opacity: 0.7;
				}

				.dark .neumorph-input::placeholder {
					color: #9ca3af;
				}

				.form-modal {
					max-width: 500px;
					padding: 1.75rem;
				}

				.dark .form-modal {
					background-color: #2c3146;
					border: 1px solid rgba(255, 255, 255, 0.05);
				}

				form .space-y-4 > div,
				form .space-y-5 > div {
					margin-bottom: 1.25rem;
				}

				.neumorph-input:focus-visible {
					outline: 2px solid var(--light-accent);
					outline-offset: 2px;
				}

				.dark .neumorph-input:focus-visible {
					outline: 2px solid var(--dark-accent);
				}

				.bg-danger.bg-opacity-20.text-danger.p-3.rounded-md.mb-4,
				.bg-danger.bg-opacity-20.text-danger.p-3.rounded-md.mb-5 {
					border-left: 3px solid var(--light-danger);
					background-color: rgba(239, 68, 68, 0.08);
					padding: 0.75rem 1rem;
				}

				.dark .bg-danger.bg-opacity-20.text-danger.p-3.rounded-md.mb-4,
				.dark .bg-danger.bg-opacity-20.text-danger.p-3.rounded-md.mb-5 {
					background-color: rgba(239, 68, 68, 0.15);
				}

				.primary-button {
					background: linear-gradient(
						135deg,
						var(--light-accent),
						var(--light-accent-hover)
					);
					color: white;
					border-radius: var(--radius-md);
					padding: var(--space-md) var(--space-lg);
					font-weight: 600;
					transition: all var(--transition-normal);
					box-shadow: 2px 2px 6px rgba(209, 217, 230, 0.7),
						-2px -2px 6px rgba(255, 255, 255, 0.7);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.primary-button:hover {
					transform: translateY(-2px);
					box-shadow: 3px 3px 8px rgba(209, 217, 230, 0.7),
						-3px -3px 8px rgba(255, 255, 255, 0.7);
				}

				.dark .primary-button {
					background: linear-gradient(
						135deg,
						var(--dark-accent),
						var(--dark-accent-hover)
					);
					box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25),
						-2px -2px 6px rgba(83, 90, 107, 0.1);
				}

				.dark .primary-button:hover {
					box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.25),
						-3px -3px 8px rgba(83, 90, 107, 0.1);
				}

				.neumorph-nav {
					background-color: var(--light-primary);
					box-shadow: 6px 6px 12px var(--light-shadow-2),
						-6px -6px 12px var(--light-shadow-1);
					border-radius: var(--radius-lg);
					margin: var(--space-sm);
					transition: box-shadow var(--transition-normal);
				}

				.dark .neumorph-nav {
					background-color: var(--dark-primary);
					box-shadow: 6px 6px 12px var(--dark-shadow-2),
						-6px -6px 12px var(--dark-shadow-1);
				}

				.neumorph-icon-container {
					border-radius: var(--radius-full);
					background-color: var(--light-primary);
					box-shadow: 4px 4px 8px var(--light-shadow-2),
						-4px -4px 8px var(--light-shadow-1);
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all var(--transition-fast);
				}

				.dark .neumorph-icon-container {
					background-color: var(--dark-primary);
					box-shadow: 4px 4px 8px var(--dark-shadow-2),
						-4px -4px 8px var(--dark-shadow-1);
				}

				.neumorph-icon-container:hover {
					transform: translateY(-2px);
				}

				.nav-tooltip {
					visibility: hidden;
					position: absolute;
					left: 100%;
					margin-left: var(--space-md);
					background-color: var(--light-primary);
					color: var(--light-text);
					padding: var(--space-sm) var(--space-md);
					border-radius: var(--radius-sm);
					font-size: 12px;
					white-space: nowrap;
					z-index: 20;
					transition: opacity var(--transition-normal),
						transform var(--transition-normal);
					opacity: 0;
					transform: translateX(-10px);
					box-shadow: 4px 4px 8px var(--light-shadow-2),
						-4px -4px 8px var(--light-shadow-1);
				}

				.dark .nav-tooltip {
					background-color: var(--dark-primary);
					color: var(--dark-text);
					box-shadow: 4px 4px 8px var(--dark-shadow-2),
						-4px -4px 8px var(--dark-shadow-1);
				}

				.nav-link:hover .nav-tooltip {
					visibility: visible;
					opacity: 1;
					transform: translateX(0);
				}

				.neumorph-progress {
					height: 10px;
					border-radius: var(--radius-sm);
					background-color: var(--light-primary);
					box-shadow: inset 2px 2px 4px rgba(209, 217, 230, 0.8),
						inset -2px -2px 4px rgba(255, 255, 255, 0.8);
					overflow: hidden;
				}

				.dark .neumorph-progress {
					background-color: var(--dark-primary);
					box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.3),
						inset -2px -2px 4px rgba(83, 90, 107, 0.1);
				}

				.neumorph-progress-bar {
					height: 100%;
					border-radius: var(--radius-sm);
					background: linear-gradient(
						90deg,
						var(--light-accent),
						var(--light-accent-hover)
					);
					transition: width var(--transition-normal);
				}

				.dark .neumorph-progress-bar {
					background: linear-gradient(
						90deg,
						var(--dark-accent),
						var(--dark-accent-hover)
					);
				}

				.section-title {
					position: relative;
					display: inline-block;
					margin-bottom: 1.5rem;
				}

				.section-title::after {
					content: "";
					position: absolute;
					left: 0;
					bottom: -10px;
					width: 60px;
					height: 4px;
					background: linear-gradient(
						90deg,
						var(--light-accent),
						var(--light-accent-hover)
					);
					border-radius: 2px;
					transition: width var(--transition-normal);
				}

				.section-title:hover::after {
					width: 100px;
				}

				.dark .section-title::after {
					background: linear-gradient(
						90deg,
						var(--dark-accent),
						var(--dark-accent-hover)
					);
				}

				.header-container {
					background-color: var(--light-primary);
					box-shadow: 0 4px 10px rgba(209, 217, 230, 0.5);
					border-radius: var(--radius-md);
					transition: background-color var(--transition-normal);
					position: relative;
					z-index: 40;
					margin: 0.75rem;
				}

				.dark .header-container {
					background-color: var(--dark-primary);
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
				}

				.dropdown-menu {
					position: absolute;
					top: 100%;
					right: 0;
					margin-top: var(--space-sm);
					background-color: var(--light-primary);
					border-radius: var(--radius-md);
					box-shadow: 0 4px 10px rgba(209, 217, 230, 0.7);
					min-width: 200px;
					z-index: 30;
				}

				.dark .dropdown-menu {
					background-color: var(--dark-primary);
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
					border: 1px solid rgba(255, 255, 255, 0.05);
				}

				.icon-running {
					color: var(--running-color);
				}
				.icon-cycling {
					color: var(--cycling-color);
				}
				.icon-swimming {
					color: var(--swimming-color);
				}
				.icon-strength {
					color: var(--strength-color);
				}
				.icon-yoga {
					color: var(--yoga-color);
				}
				.icon-hiking {
					color: var(--hiking-color);
				}

				.user-avatar {
					width: 40px;
					height: 40px;
					border-radius: var(--radius-full);
					object-fit: cover;
					border: 2px solid var(--light-accent);
					transition: transform var(--transition-fast);
				}

				.dark .user-avatar {
					border-color: var(--dark-accent);
				}

				.user-avatar:hover {
					transform: scale(1.1);
				}

				.notification-badge {
					position: absolute;
					top: -5px;
					right: -5px;
					background-color: var(--light-accent);
					color: white;
					font-size: 10px;
					width: 18px;
					height: 18px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.notification-item {
					padding: var(--space-md);
					display: flex;
					align-items: flex-start;
					transition: background-color var(--transition-fast);
					border-bottom: 1px solid var(--light-shadow-2);
				}

				.dark .notification-item {
					border-bottom: 1px solid var(--dark-shadow-2);
				}

				.notification-item:hover {
					background-color: var(--light-secondary);
				}

				.dark .notification-item:hover {
					background-color: var(--dark-secondary);
				}

				.notification-item.unread::before {
					content: "";
					display: block;
					width: 8px;
					height: 8px;
					background-color: var(--light-accent);
					border-radius: 50%;
					position: absolute;
					left: 12px;
					margin-top: 6px;
				}

				.dropdown-item {
					padding: var(--space-md);
					display: flex;
					align-items: center;
					transition: background-color var(--transition-fast);
				}

				.dropdown-item:hover {
					background-color: var(--light-secondary);
				}

				.dark .dropdown-item:hover {
					background-color: var(--dark-secondary);
				}

				.dropdown-divider {
					height: 1px;
					background-color: var(--light-shadow-2);
					margin: var(--space-xs) 0;
				}

				.dark .dropdown-divider {
					background-color: var(--dark-shadow-2);
				}

				@keyframes pulse {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.05);
					}
					100% {
						transform: scale(1);
					}
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.fade-in {
					animation: fadeIn 0.5s ease-out forwards;
				}

				::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}

				::-webkit-scrollbar-track {
					background: var(--light-primary);
				}

				.dark ::-webkit-scrollbar-track {
					background: var(--dark-primary);
				}

				::-webkit-scrollbar-thumb {
					background: var(--light-muted);
					border-radius: var(--radius-full);
				}

				.dark ::-webkit-scrollbar-thumb {
					background: var(--dark-muted);
				}

				::-webkit-scrollbar-thumb:hover {
					background: var(--light-text-secondary);
				}

				.dark ::-webkit-scrollbar-thumb:hover {
					background: var(--dark-text-secondary);
				}

				.footer {
					background-color: var(--light-primary);
					border-top: 1px solid var(--light-shadow-2);
					transition: background-color var(--transition-normal);
				}

				.dark .footer {
					background-color: var(--dark-primary);
					border-top: 1px solid var(--dark-shadow-2);
				}

				.social-icon {
					width: 36px;
					height: 36px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: var(--radius-full);
					transition: all var(--transition-fast);
					background-color: var(--light-primary);
					box-shadow: 2px 2px 4px var(--light-shadow-2),
						-2px -2px 4px var(--light-shadow-1);
				}

				.social-icon:hover {
					transform: translateY(-3px);
					box-shadow: 4px 4px 8px var(--light-shadow-2),
						-4px -4px 8px var(--light-shadow-1);
				}

				.dark .social-icon {
					background-color: var(--dark-primary);
					box-shadow: 2px 2px 4px var(--dark-shadow-2),
						-2px -2px 4px var(--dark-shadow-1);
				}

				.dark .social-icon:hover {
					box-shadow: 4px 4px 8px var(--dark-shadow-2),
						-4px -4px 8px var(--dark-shadow-1);
				}

				@media (max-width: 768px) {
					.nav-tooltip {
						display: none;
					}
					.section-title::after {
						width: 40px;
					}
					.section-title:hover::after {
						width: 60px;
					}
					.neumorph-nav {
						position: fixed;
						top: 0;
						left: 0;
						width: 280px;
						height: 100vh;
						z-index: 50;
						transform: translateX(-100%);
						transition: transform 0.3s ease;
						overflow-y: auto;
						padding-top: 3rem;
					}
					.neumorph-nav.mobile-nav-open {
						transform: translateX(0);
					}

					.brand {
						font-size: 1rem;
						padding: 0.25rem;
					}
					main.ml-20,
					header.ml-20 {
						margin-left: 0;
					}
					.header-container {
						padding-left: 16px;
					}
					.mobile-menu-toggle {
						display: flex;
						position: relative;
						z-index: 60;
						width: 40px;
						height: 40px;
						border-radius: 50%;
						background-color: var(--light-primary);
						align-items: center;
						justify-content: center;
						transition: all 0.3s ease;
						margin-right: 10px;
					}
					.dark .mobile-menu-toggle {
						background-color: var(--dark-primary);
					}
				}
			`}</style>
		</div>
	);
}
