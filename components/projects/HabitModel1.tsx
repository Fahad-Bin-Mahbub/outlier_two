'use client'
import React, { useState, useRef, useEffect } from "react";
import type { GetServerSideProps } from "next";

// Demo initial data for SSR (could be replaced with DB/fetch)
export const getServerSideProps: GetServerSideProps = async () => {
	return {
		props: {
			initialGoals: [
				{
					id: "hydration",
					name: "Hydration",
					target: 8,
					unit: "glasses",
					colorFrom: "#5b6ee1",
					colorTo: "#a16ae8",
				},
				{
					id: "meditation",
					name: "Meditation",
					target: 1,
					unit: "session",
					colorFrom: "#7f53ac",
					colorTo: "#647dee",
				},
			],
		},
	};
};

type Goal = {
	id: string;
	name: string;
	target: number;
	unit: string;
	colorFrom: string;
	colorTo: string;
};

type DailyProgress = {
	[goalId: string]: {
		[date: string]: number; // date: ISO string (YYYY-MM-DD), value: progress
	};
};

function getToday() {
	return new Date().toISOString().slice(0, 10);
}

function getCurrentMonthDays() {
	const now = new Date();
	const days = [];
	const year = now.getFullYear();
	const month = now.getMonth();
	const last = new Date(year, month + 1, 0).getDate();
	for (let d = 1; d <= last; d++) {
		days.push(new Date(year, month, d));
	}
	return days;
}

function getStreak(
	progress: { [date: string]: number },
	todayStr: string,
	target: number
) {
	// Compute streak ending today
	let streak = 0;
	let date = new Date(todayStr);
	while (true) {
		const iso = date.toISOString().slice(0, 10);
		if (progress[iso] && progress[iso] >= target) {
			streak++;
			date.setDate(date.getDate() - 1);
		} else {
			break;
		}
	}
	return streak;
}

function getTotalCount(progress: { [date: string]: number }, target: number) {
	return Object.values(progress).filter((v) => v >= target).length;
}

// Simple flame CSS animation
const Flame = () => (
	<span className="relative inline-block w-6 h-6 align-middle">
		<span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-flame">
			<svg width={24} height={24} viewBox="0 0 24 24">
				<g>
					<path
						d="M12 2C12 2 9 7 12 9.5C15 7 12 2 12 2Z"
						fill="#FFD700"
						opacity="0.7"
					></path>
					<path
						d="M12 4C12 4 10 8 12 10C14 8 12 4 12 4Z"
						fill="#FF9100"
						opacity="0.85"
					></path>
					<path
						d="M12 7C12 7 11 10 12 11C13 10 12 7 12 7Z"
						fill="#FF5722"
					></path>
				</g>
			</svg>
		</span>
		<style>{`
      @keyframes flame {
        0% { transform: translate(-50%, -50%) scaleY(1) }
        50% { transform: translate(-50%, -55%) scaleY(1.08) scaleX(0.9) }
        100% { transform: translate(-50%, -50%) scaleY(1) }
      }
      .animate-flame {
        animation: flame 1s infinite ease-in-out;
      }
    `}</style>
	</span>
);

// SVG Progress Ring
const ProgressRing = ({
	radius = 40,
	stroke = 7,
	progress = 0,
	colorFrom,
	colorTo,
}: {
	radius?: number;
	stroke?: number;
	progress: number;
	colorFrom: string;
	colorTo: string;
}) => {
	const norm = Math.max(0, Math.min(1, progress));
	const size = radius * 2 + stroke;
	const circ = 2 * Math.PI * radius;
	const offset = circ - circ * norm;
	return (
		<svg width={size} height={size}>
			<defs>
				<linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor={colorFrom} />
					<stop offset="100%" stopColor={colorTo} />
				</linearGradient>
			</defs>
			<circle
				cx={radius + stroke / 2}
				cy={radius + stroke / 2}
				r={radius}
				stroke="#e3e3ee"
				strokeWidth={stroke}
				fill="none"
			/>
			<circle
				cx={radius + stroke / 2}
				cy={radius + stroke / 2}
				r={radius}
				stroke="url(#prog)"
				strokeWidth={stroke}
				fill="none"
				strokeDasharray={circ}
				strokeDashoffset={offset}
				strokeLinecap="round"
				style={{
					transition: "stroke-dashoffset 0.6s cubic-bezier(.7,0,.35,1)",
				}}
			/>
		</svg>
	);
};

// Achievement badges
const Badge = ({ emoji, label }: { emoji: string; label: string }) => (
	<span
		className="inline-flex items-center px-2 py-1 rounded-full shadow-neumorph bg-gradient-to-r from-blue-200 via-purple-200 to-blue-100 text-sm font-medium mr-2"
		style={{
			filter: "drop-shadow(0 2px 8px #a1a1f7aa)",
			userSelect: "none",
		}}
		title={label}
	>
		<span className="mr-1">{emoji}</span>
		{label}
	</span>
);

export default function HabitModel1Export({
	initialGoals,
}: {
	initialGoals: Goal[];
}) {
	// Goal state
	const [goals, setGoals] = useState<Goal[]>(initialGoals);
	// Progress per day per goal
	const [progress, setProgress] = useState<DailyProgress>(() => {
		// Try to restore from localStorage
		if (typeof window !== "undefined") {
			const stored = window.localStorage.getItem("progress");
			if (stored) return JSON.parse(stored);
		}
		// Else, empty
		return {};
	});
	// Which goal is active (swipe to change)
	const [activeGoalIdx, setActiveGoalIdx] = useState(0);

	// For new goal modal
	const [showAdd, setShowAdd] = useState(false);
	const [newGoal, setNewGoal] = useState<Partial<Goal>>({
		name: "",
		target: 1,
		unit: "",
		colorFrom: "#5b6ee1",
		colorTo: "#a16ae8",
	});

	// For swipe gestures
	const touchStartX = useRef<number | null>(null);

	// Save progress to localStorage on change
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem("progress", JSON.stringify(progress));
		}
	}, [progress]);

	// Save goals to localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem("goals", JSON.stringify(goals));
		}
	}, [goals]);

	// Restore goals from localStorage (if present)
	useEffect(() => {
		if (typeof window !== "undefined") {
			const stored = window.localStorage.getItem("goals");
			if (stored) setGoals(JSON.parse(stored));
		}
		// eslint-disable-next-line
	}, []);

	// Haptic feedback
	const vibrate = (pattern = 15) => {
		if (typeof window !== "undefined" && "vibrate" in window.navigator) {
			window.navigator.vibrate(pattern);
		}
	};

	// Handle swipe gestures
	const onTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const onTouchMove = (e: React.TouchEvent) => {
		// Prevent scroll if horizontal swipe
		if (
			touchStartX.current !== null &&
			Math.abs(e.touches[0].clientX - touchStartX.current) > 10
		) {
			e.preventDefault();
		}
	};
	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const delta = e.changedTouches[0].clientX - touchStartX.current;
		if (delta > 50 && activeGoalIdx > 0) {
			setActiveGoalIdx((i) => i - 1);
			vibrate();
		} else if (delta < -50 && activeGoalIdx < goals.length - 1) {
			setActiveGoalIdx((i) => i + 1);
			vibrate();
		}
		touchStartX.current = null;
	};

	// -------- UI Actions --------
	const today = getToday();
	const activeGoal = goals[activeGoalIdx] || goals[0];
	const activeProgress = progress[activeGoal?.id] || {};
	const todayCount = activeProgress?.[today] || 0;
	const pct = Math.min(1, todayCount / (activeGoal?.target || 1));
	const streak = getStreak(activeProgress, today, activeGoal?.target || 1);
	const totalCompleted = getTotalCount(activeProgress, activeGoal?.target || 1);

	// Update today's count
	const updateCount = (change: number) => {
		setProgress((prev) => {
			const newProg = { ...prev };
			const goalProg = { ...newProg[activeGoal.id] } || {};
			const cur = goalProg[today] || 0;
			let next = Math.max(0, Math.min(cur + change, activeGoal.target));
			goalProg[today] = next;
			newProg[activeGoal.id] = goalProg;
			return newProg;
		});
		vibrate([25, 10, 25]);
	};

	// Toggle checkmark for a date in calendar (for manual correction)
	const toggleDay = (date: string) => {
		setProgress((prev) => {
			const newProg = { ...prev };
			const goalProg = { ...newProg[activeGoal.id] } || {};
			if (goalProg[date] && goalProg[date] >= activeGoal.target) {
				goalProg[date] = 0;
			} else {
				goalProg[date] = activeGoal.target;
			}
			newProg[activeGoal.id] = goalProg;
			return newProg;
		});
		vibrate([15, 10, 15]);
	};

	// Add new goal
	const handleAddGoal = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newGoal.name || !newGoal.unit || !newGoal.target) return;
		const id = newGoal.name
			?.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
			.slice(0, 24);
		setGoals((prev) => [
			...prev,
			{
				id: id + "-" + Math.floor(Math.random() * 1000000),
				name: newGoal.name!,
				unit: newGoal.unit!,
				target: Number(newGoal.target),
				colorFrom: newGoal.colorFrom || "#5b6ee1",
				colorTo: newGoal.colorTo || "#a16ae8",
			},
		]);
		setNewGoal({
			name: "",
			target: 1,
			unit: "",
			colorFrom: "#5b6ee1",
			colorTo: "#a16ae8",
		});
		setShowAdd(false);
		setTimeout(() => setActiveGoalIdx(goals.length), 200);
		vibrate([5, 10, 30]);
	};

	// Remove a goal
	const removeGoal = (id: string) => {
		if (!confirm("Delete this goal?")) return;
		setGoals((prev) => prev.filter((g) => g.id !== id));
		setActiveGoalIdx((idx) => Math.max(0, idx - 1));
		vibrate([30, 10, 30]);
	};

	// Prettier date labels
	function labelDay(date: Date) {
		const todayDate = new Date(today);
		if (
			date.getFullYear() === todayDate.getFullYear() &&
			date.getMonth() === todayDate.getMonth()
		) {
			if (date.getDate() === todayDate.getDate()) return "Today";
			if (date.getDate() === todayDate.getDate() - 1) return "Yest.";
		}
		return date.getDate();
	}

	// Get achievement badges
	function getBadges() {
		const badges = [];
		if (streak >= 3)
			badges.push(<Badge key="🔥" emoji="🔥" label={`Streak ${streak}`} />);
		if (totalCompleted >= 7)
			badges.push(<Badge key="⭐" emoji="⭐" label="7 days" />);
		if (totalCompleted >= 30)
			badges.push(<Badge key="🏆" emoji="🏆" label="30 days" />);
		if (todayCount >= activeGoal.target)
			badges.push(<Badge key="✅" emoji="✅" label="Goal met today" />);
		return badges;
	}

	// --------- RENDER --------
	return (
		<main
			className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 px-2 py-3"
			style={{
				fontFamily:
					"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
				WebkitTapHighlightColor: "transparent",
			}}
		>
			{/* Header */}
			<header className="flex items-center justify-between mb-2 mt-1">
				<h1 className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-blue-600 select-none">
					Habit Streak
				</h1>
				<button
					onClick={() => setShowAdd(true)}
					className="rounded-full shadow-neumorph bg-gradient-to-r from-blue-300 to-purple-200 text-blue-800 px-3 py-1 font-bold text-lg focus:outline-none active:scale-95 transition"
					aria-label="Add goal"
				>
					+
				</button>
			</header>

			{/* Goal category pills */}
			<nav className="flex justify-center gap-2 mb-2 overflow-x-auto scrollbar-hide">
				{goals.map((g, idx) => (
					<button
						key={g.id}
						onClick={() => setActiveGoalIdx(idx)}
						className={`px-3 py-1 rounded-full font-semibold text-sm focus:outline-none transition 
              ${
								idx === activeGoalIdx
									? "bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-neumorph"
									: "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
							}`}
						style={{
							minWidth: 64,
							boxShadow:
								idx === activeGoalIdx
									? "0 2px 10px #8cb7e6aa"
									: "0 0px 0px transparent",
						}}
					>
						{g.name}
					</button>
				))}
			</nav>

			{/* Goal Card */}
			<section
				className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-blue-50 rounded-3xl shadow-neumorph mx-auto my-1 py-5 px-2 relative w-full max-w-md"
				style={{
					minHeight: 340,
					boxShadow: "0 4px 16px #c9c9f7bb",
				}}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			>
				{/* Progress ring */}
				<div className="relative mb-2">
					<ProgressRing
						progress={pct}
						colorFrom={activeGoal.colorFrom}
						colorTo={activeGoal.colorTo}
					/>
					{/* Center count */}
					<div className="absolute inset-0 flex flex-col items-center justify-center select-none">
						<span className="text-4xl font-extrabold text-blue-800 drop-shadow">
							{todayCount}
						</span>
						<span className="text-xs text-blue-600">{activeGoal.unit}</span>
					</div>
				</div>

				{/* Buttons */}
				<div className="flex gap-4 items-center my-2 select-none">
					<button
						className="w-12 h-12 rounded-full text-3xl bg-gradient-to-br from-blue-300 to-purple-200 shadow-neumorph active:scale-95 focus:outline-none"
						aria-label="-1"
						onClick={() => updateCount(-1)}
						disabled={todayCount === 0}
					>
						–
					</button>
					<button
						className="w-12 h-12 rounded-full text-3xl bg-gradient-to-br from-blue-400 to-purple-400 text-white shadow-neumorph active:scale-95 focus:outline-none"
						aria-label="+1"
						onClick={() => updateCount(1)}
						disabled={todayCount >= activeGoal.target}
					>
						+
					</button>
				</div>

				{/* Streak + remove goal */}
				<div className="flex gap-2 items-center justify-center mt-1 mb-3 w-full px-2">
					<span className="text-xl font-semibold text-orange-600 flex items-center">
						<Flame /> <span className="ml-1">{streak}</span>
					</span>
					<span className="ml-2 text-xs text-blue-500">Day streak</span>
					{goals.length > 1 && (
						<button
							className="ml-auto text-xs text-red-500 font-bold underline"
							onClick={() => removeGoal(activeGoal.id)}
							aria-label="Remove goal"
						>
							Remove
						</button>
					)}
				</div>

				{/* Badges */}
				<div className="flex flex-wrap gap-1 mb-2">{getBadges()}</div>
			</section>

			{/* Calendar View */}
			<section className="mt-2 bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-2xl shadow-neumorph w-full max-w-md mx-auto">
				<h3 className="font-bold text-blue-700 mb-2 text-lg select-none">
					This Month
				</h3>
				<div className="grid grid-cols-7 gap-1">
					{getCurrentMonthDays().map((d) => {
						const iso = d.toISOString().slice(0, 10);
						const done = (activeProgress?.[iso] || 0) >= activeGoal.target;
						return (
							<button
								key={iso}
								className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-150 focus:outline-none 
                  ${
										done
											? "bg-gradient-to-br from-blue-400 to-purple-400 text-white shadow"
											: "bg-gradient-to-br from-blue-100 to-purple-100 text-blue-500"
									}
                  ${iso === today ? "ring-2 ring-purple-400 ring-offset-2" : ""}
                `}
								aria-label={d.toDateString()}
								onClick={() => toggleDay(iso)}
								disabled={d > new Date()}
								tabIndex={0}
								style={{
									fontWeight:
										iso === today || labelDay(d) === "Yest." ? 700 : 500,
								}}
							>
								{done ? "✔" : labelDay(d)}
							</button>
						);
					})}
				</div>
			</section>

			{/* Modal for new goal */}
			{showAdd && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
					<form
						className="bg-gradient-to-br from-blue-100 to-purple-100 p-7 rounded-2xl shadow-neumorph flex flex-col gap-3 min-w-[90vw] max-w-xs"
						onSubmit={handleAddGoal}
						style={{
							minWidth: 260,
							boxShadow: "0 8px 28px #9f9fe7bb",
						}}
					>
						<h2 className="font-bold text-blue-700 text-xl mb-2">New Goal</h2>
						<input
							className="rounded-lg px-3 py-2 bg-blue-50 text-blue-800 font-medium mb-1 border-none focus:ring-2 focus:ring-purple-400"
							placeholder="Name (e.g. Reading)"
							value={newGoal.name ?? ""}
							maxLength={24}
							onChange={(e) =>
								setNewGoal((g) => ({ ...g, name: e.target.value }))
							}
							required
							autoFocus
						/>
						<div className="flex gap-1">
							<input
								type="number"
								className="rounded-lg px-3 py-2 bg-blue-50 w-20 text-blue-800 font-medium border-none focus:ring-2 focus:ring-purple-400"
								min={1}
								value={newGoal.target ?? 1}
								onChange={(e) =>
									setNewGoal((g) => ({
										...g,
										target: Number(e.target.value) || 1,
									}))
								}
								required
							/>
							<input
								className="rounded-lg px-3 py-2 bg-blue-50 text-blue-800 font-medium border-none focus:ring-2 focus:ring-purple-400 flex-1"
								placeholder="Unit (e.g. pages, min)"
								value={newGoal.unit ?? ""}
								onChange={(e) =>
									setNewGoal((g) => ({ ...g, unit: e.target.value }))
								}
								required
							/>
						</div>
						{/* Color gradient picker */}
						<div className="flex gap-2 py-1">
							<label className="flex items-center gap-1 text-blue-600 text-sm">
								From
								<input
									type="color"
									value={newGoal.colorFrom}
									onChange={(e) =>
										setNewGoal((g) => ({
											...g,
											colorFrom: e.target.value,
										}))
									}
									className="w-6 h-6 border-0 bg-transparent"
								/>
							</label>
							<label className="flex items-center gap-1 text-purple-600 text-sm">
								To
								<input
									type="color"
									value={newGoal.colorTo}
									onChange={(e) =>
										setNewGoal((g) => ({
											...g,
											colorTo: e.target.value,
										}))
									}
									className="w-6 h-6 border-0 bg-transparent"
								/>
							</label>
						</div>
						<div className="flex gap-2 mt-2">
							<button
								type="button"
								className="flex-1 rounded-lg py-2 px-3 bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800 font-bold"
								onClick={() => setShowAdd(false)}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="flex-1 rounded-lg py-2 px-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold"
							>
								Add
							</button>
						</div>
					</form>
				</div>
			)}

			{/* CSS Neumorph shadow */}
			<style jsx global>{`
				.shadow-neumorph {
					box-shadow: 2px 2px 8px #c1c1ef66, -2px -2px 6px #ffffff88;
				}
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
			`}</style>
			{/* Mobile-friendly meta */}
			<style jsx global>{`
				html,
				body,
				#__next {
					height: 100%;
				}
				body {
					overscroll-behavior-y: contain;
					touch-action: manipulation;
				}
			`}</style>
		</main>
	);
}
