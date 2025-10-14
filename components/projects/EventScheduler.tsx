"use client";

import React, { useState, useEffect, useRef } from "react";

interface Activity {
	id: number;
	name: string;
	votes: number;
	user: string;
}

interface TimeSlot {
	id: number;
	start: string;
	end: string;
	activities: Activity[];
}

interface Day {
	id: number;
	name: string;
	date: string;
	timeSlots: TimeSlot[];
}

export default function EventSchedulerExport() {
	const initialDays: Day[] = [
		{
			id: 1,
			name: "Day 1",
			date: "June 12, 2023",
			timeSlots: [
				{ id: 1, start: "09:00", end: "10:30", activities: [] },
				{ id: 2, start: "10:30", end: "12:00", activities: [] },
				{ id: 3, start: "13:00", end: "14:30", activities: [] },
				{ id: 4, start: "15:00", end: "16:30", activities: [] },
			],
		},
		{
			id: 2,
			name: "Day 2",
			date: "June 13, 2023",
			timeSlots: [
				{ id: 1, start: "09:00", end: "10:30", activities: [] },
				{ id: 2, start: "10:30", end: "12:00", activities: [] },
				{ id: 3, start: "13:00", end: "14:30", activities: [] },
				{ id: 4, start: "15:00", end: "16:30", activities: [] },
			],
		},
		{
			id: 3,
			name: "Day 3",
			date: "June 14, 2023",
			timeSlots: [
				{ id: 1, start: "09:00", end: "10:30", activities: [] },
				{ id: 2, start: "10:30", end: "12:00", activities: [] },
				{ id: 3, start: "13:00", end: "14:30", activities: [] },
				{ id: 4, start: "15:00", end: "16:30", activities: [] },
			],
		},
	];

	const [days, setDays] = useState<Day[]>(initialDays);
	const [selectedDay, setSelectedDay] = useState(1);
	const [activityInput, setActivityInput] = useState("");
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
	const [showAddActivityForm, setShowAddActivityForm] = useState(false);
	const [userName, setUserName] = useState("");
	const [userNameSet, setUserNameSet] = useState(false);
	const [isUserNameModalOpen, setIsUserNameModalOpen] = useState(true);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);
	const [recentlyVoted, setRecentlyVoted] = useState<{
		dayId: number;
		slotId: number;
		activityId: number;
	} | null>(null);
	const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);
	const [showTooltip, setShowTooltip] = useState(false);
	const [tooltipContent, setTooltipContent] = useState("");
	const [voteCount, setVoteCount] = useState<{ [key: string]: number }>({});
	const [searchQuery, setSearchQuery] = useState("");
	const [votedActivities, setVotedActivities] = useState<{
		[key: number]: boolean;
	}>({});
	const userNameInputRef = useRef<HTMLInputElement>(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		if (days[0].timeSlots[0].activities.length === 0) {
			const updatedDays = [...days];

			updatedDays[0].timeSlots[0].activities = [
				{ id: 1, name: "Welcome Breakfast", votes: 15, user: "Alex" },
				{ id: 2, name: "Networking Session", votes: 8, user: "Jordan" },
			];

			updatedDays[0].timeSlots[2].activities = [
				{ id: 3, name: "Workshop: Team Building", votes: 12, user: "Taylor" },
			];

			updatedDays[1].timeSlots[1].activities = [
				{ id: 4, name: "Panel Discussion", votes: 10, user: "Morgan" },
			];

			setDays(updatedDays);
		}
	}, [days]);

	useEffect(() => {
		const votes: { [key: string]: number } = {};
		days.forEach((day) => {
			day.timeSlots.forEach((slot) => {
				slot.activities.forEach((activity) => {
					if (!votes[activity.user]) {
						votes[activity.user] = 0;
					}
					votes[activity.user] += activity.votes;
				});
			});
		});
		setVoteCount(votes);
	}, [days]);

	useEffect(() => {
		if (isUserNameModalOpen && userNameInputRef.current) {
			setTimeout(() => {
				userNameInputRef.current?.focus();
			}, 100);
		}
	}, [isUserNameModalOpen]);

	useEffect(() => {
		if (isMobile) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.altKey && e.key === "n" && userNameSet) {
				e.preventDefault();
				openFirstAvailableSlot();
			}

			if (e.altKey && e.key === "d") {
				e.preventDefault();
				toggleDarkMode();
			}

			if (e.key === "Escape" && showAddActivityForm) {
				e.preventDefault();
				setShowAddActivityForm(false);
				setActivityInput("");
				setSelectedTimeSlot(null);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [userNameSet, showAddActivityForm, isMobile]);

	const openFirstAvailableSlot = () => {
		const currentDayData = days.find((day) => day.id === selectedDay);
		if (currentDayData) {
			const firstSlot = currentDayData.timeSlots[0];
			setSelectedTimeSlot(firstSlot.id);
			setShowAddActivityForm(true);
		}
	};

	const handleAddActivity = () => {
		if (!activityInput || selectedTimeSlot === null || !userName) return;

		const newActivity: Activity = {
			id: Date.now(),
			name: activityInput,
			votes: 0,
			user: userName,
		};

		const updatedDays = days.map((day) => {
			if (day.id === selectedDay) {
				const updatedTimeSlots = day.timeSlots.map((slot) => {
					if (slot.id === selectedTimeSlot) {
						return {
							...slot,
							activities: [...slot.activities, newActivity],
						};
					}
					return slot;
				});
				return { ...day, timeSlots: updatedTimeSlots };
			}
			return day;
		});

		setDays(updatedDays);
		setActivityInput("");
		setSelectedTimeSlot(null);
		setShowAddActivityForm(false);
		setRecentlyAdded(newActivity.id);

		showTooltipMessage(`"${newActivity.name}" added successfully!`);

		setTimeout(() => {
			setRecentlyAdded(null);
		}, 2000);
	};

	const handleVote = (dayId: number, slotId: number, activityId: number) => {
		if (votedActivities[activityId]) {
			showTooltipMessage("You've already voted for this activity");
			return;
		}

		const currentDay = days.find((day) => day.id === dayId);
		const currentSlot = currentDay?.timeSlots.find(
			(slot) => slot.id === slotId
		);
		const currentActivity = currentSlot?.activities.find(
			(activity) => activity.id === activityId
		);

		const updatedDays = days.map((day) => {
			if (day.id === dayId) {
				const updatedTimeSlots = day.timeSlots.map((slot) => {
					if (slot.id === slotId) {
						const updatedActivities = slot.activities.map((activity) => {
							if (activity.id === activityId) {
								return { ...activity, votes: activity.votes + 1 };
							}
							return activity;
						});
						updatedActivities.sort((a, b) => b.votes - a.votes);
						return { ...slot, activities: updatedActivities };
					}
					return slot;
				});
				return { ...day, timeSlots: updatedTimeSlots };
			}
			return day;
		});

		setDays(updatedDays);
		setRecentlyVoted({ dayId, slotId, activityId });

		setVotedActivities((prev) => ({ ...prev, [activityId]: true }));

		if (currentActivity) {
			setVoteCount((prev) => ({
				...prev,
				[currentActivity.user]: (prev[currentActivity.user] || 0) + 1,
			}));
		}

		showTooltipMessage(`Vote cast for "${currentActivity?.name}"!`);

		setTimeout(() => {
			setRecentlyVoted(null);
		}, 2000);
	};

	const showTooltipMessage = (message: string) => {
		setTooltipContent(message);
		setShowTooltip(true);
		setTimeout(() => {
			setShowTooltip(false);
		}, 3000);
	};

	const handleSetUserName = () => {
		if (userName.trim()) {
			setUserNameSet(true);
			setIsUserNameModalOpen(false);
			showTooltipMessage(`Welcome, ${userName}! You can now plan activities.`);
		}
	};

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
	};

	const currentDay = days.find((day) => day.id === selectedDay);

	const theme = isDarkMode
		? {
				bg: "bg-slate-950",
				gradientBg: "bg-gradient-to-b from-slate-900 to-slate-950",
				text: "text-slate-100",
				textSecondary: "text-slate-300",
				textMuted: "text-slate-400",
				card: "bg-slate-900",
				cardHover: "hover:bg-slate-800",
				border: "border-slate-800",
				inputBg: "bg-slate-800",
				inputBorder: "border-slate-700",
				buttonPrimary:
					"bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white",
				buttonSecondary:
					"bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
				buttonDisabled: "bg-slate-800 text-slate-600 cursor-not-allowed",
				accent: "bg-indigo-600",
				accentLight: "bg-indigo-500/20 text-indigo-300",
				highlight: "bg-indigo-500/10",
				topBadge: "bg-emerald-800 text-emerald-100",
				yoursBadge: "bg-amber-800 text-amber-100",
				shadow: "shadow-lg shadow-indigo-900/20",
		  }
		: {
				bg: "bg-slate-50",
				gradientBg: "bg-gradient-to-b from-indigo-50 via-blue-50 to-white",
				text: "text-slate-900",
				textSecondary: "text-slate-700",
				textMuted: "text-slate-500",
				card: "bg-white",
				cardHover: "hover:bg-slate-50",
				border: "border-slate-200",
				inputBg: "bg-white",
				inputBorder: "border-slate-300",
				buttonPrimary:
					"bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white",
				buttonSecondary:
					"bg-white hover:bg-slate-100 text-slate-800 border border-slate-300",
				buttonDisabled: "bg-slate-100 text-slate-400 cursor-not-allowed",
				accent: "bg-indigo-600",
				accentLight: "bg-indigo-50 text-indigo-600",
				highlight: "bg-indigo-50",
				topBadge: "bg-emerald-100 text-emerald-800",
				yoursBadge: "bg-amber-100 text-amber-800",
				shadow: "shadow-lg shadow-slate-200/50",
		  };

	const getFilteredActivities = () => {
		const allActivities: Array<{
			dayId: number;
			slotId: number;
			activity: Activity;
		}> = [];

		days.forEach((day) => {
			day.timeSlots.forEach((slot) => {
				slot.activities.forEach((activity) => {
					allActivities.push({
						dayId: day.id,
						slotId: slot.id,
						activity,
					});
				});
			});
		});

		if (!searchQuery) return [];

		return allActivities.filter(
			(item) =>
				item.activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.activity.user.toLowerCase().includes(searchQuery.toLowerCase())
		);
	};

	const filteredActivities = getFilteredActivities();

	return (
		<div
			className={`min-h-screen ${theme.gradientBg} ${theme.text} transition-colors duration-300 ease-in-out`}
		>
			{}
			<div
				className={`fixed z-50 transition-all duration-300 transform ${
					isMobile
						? "bottom-4 left-4 right-4"
						: "top-6 left-1/2 -translate-x-1/2"
				} 
                ${
									showTooltip
										? "opacity-100 translate-y-0"
										: `opacity-0 ${
												isMobile ? "translate-y-10" : "-translate-y-10"
										  } pointer-events-none`
								}`}
			>
				<div
					className={`${
						isMobile ? "rounded-xl p-4" : "rounded-lg px-5 py-3"
					} bg-emerald-600 text-white ${
						isMobile ? "shadow-2xl" : "shadow-xl"
					} flex items-center justify-between`}
				>
					<div className="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-3 flex-shrink-0"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						<span className={`${isMobile ? "text-sm font-medium" : ""}`}>
							{tooltipContent}
						</span>
					</div>
					{isMobile && (
						<button
							onClick={() => setShowTooltip(false)}
							className="ml-3 p-1 rounded-full bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>

			{}
			{!isMobile && userNameSet && (
				<div className="fixed bottom-6 right-6 z-40 opacity-100">
					<button
						className={`${
							isDarkMode
								? "bg-slate-800 hover:bg-slate-700"
								: "bg-white hover:bg-slate-100"
						} 
                        p-3 rounded-full ${
													theme.shadow
												} text-indigo-500 transition-all cursor-pointer duration-300
                        border ${theme.border}`}
						onClick={() =>
							showTooltipMessage(
								"Shortcuts: Alt+N to add activity, Alt+D for dark mode"
							)
						}
						aria-label="Keyboard shortcuts"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			)}

			{}
			{isUserNameModalOpen && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn p-4">
					<div
						className={`${theme.card} p-8 rounded-2xl ${theme.shadow} max-w-md w-full mx-auto transform transition-all duration-300 animate-scaleIn`}
					>
						<div className="text-center mb-6">
							<div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto flex items-center justify-center mb-5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							</div>
							<h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
								Welcome to Event Planner
							</h2>
							<p className={`${theme.textMuted} text-lg`}>
								Please enter your name to collaborate with your team
							</p>
						</div>

						<div className="relative mb-6">
							<input
								type="text"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								placeholder="Your Name"
								className={`w-full p-4 rounded-xl ${theme.inputBg} border ${theme.inputBorder} ${theme.text} focus:ring-2 focus:ring-indigo-500 focus:outline-none pl-12 text-lg transition-all`}
								ref={userNameInputRef}
								onKeyDown={(e) =>
									e.key === "Enter" && userName.trim() && handleSetUserName()
								}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={`h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>

						<button
							onClick={handleSetUserName}
							disabled={!userName.trim()}
							className={`w-full py-4 px-6 rounded-xl transition-all cursor-pointer ${
								userName.trim() ? theme.buttonPrimary : theme.buttonDisabled
							} text-lg font-medium`}
						>
							Start Planning
						</button>
					</div>
				</div>
			)}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
				<header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
					<div>
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 tracking-tight">
							Collaborative Event Planner
						</h1>
						<p className={`mt-2 ${theme.textMuted} text-base sm:text-lg`}>
							Plan and vote on activities with your team
						</p>
					</div>

					<div className="flex items-center gap-4 mt-4 md:mt-0">
						{userNameSet && (
							<div
								className={`font-medium ${theme.accentLight} py-2 px-4 rounded-lg flex items-center`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clipRule="evenodd"
									/>
								</svg>
								<span>{userName}</span>
							</div>
						)}

						<button
							onClick={toggleDarkMode}
							className={`p-3 rounded-full transition-all duration-300 cursor-pointer ${
								isDarkMode
									? "bg-slate-800 text-amber-300 hover:bg-slate-700"
									: "bg-white text-indigo-600 hover:bg-slate-100"
							} ${theme.shadow}`}
							aria-label="Toggle dark mode"
						>
							{isDarkMode ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
										clipRule="evenodd"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
								</svg>
							)}
						</button>
					</div>
				</header>

				{userNameSet && (
					<>
						{}
						<div className="mb-8">
							<div className="relative max-w-md mx-auto">
								<input
									type="text"
									placeholder="Search activities or users..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className={`w-full py-3 px-5 pl-12 rounded-full ${theme.shadow} ${theme.inputBg} border ${theme.inputBorder} ${theme.text} focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all`}
								/>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={`h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.textMuted}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								{searchQuery && (
									<button
										className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer ${theme.textMuted} hover:text-indigo-500`}
										onClick={() => setSearchQuery("")}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
								)}
							</div>

							{}
							{searchQuery && (
								<div
									className={`mt-2 max-w-md mx-auto rounded-xl ${theme.card} ${theme.shadow} overflow-hidden border ${theme.border} animate-fadeIn max-h-60 overflow-y-auto`}
								>
									{filteredActivities.length > 0 ? (
										<ul className={`divide-y ${theme.border}`}>
											{filteredActivities.map(({ dayId, slotId, activity }) => {
												const day = days.find((d) => d.id === dayId);
												const slot = day?.timeSlots.find(
													(s) => s.id === slotId
												);

												return (
													<li
														key={activity.id}
														className={`p-3 ${theme.cardHover} transition-colors`}
													>
														<button
															className="w-full text-left cursor-pointer"
															onClick={() => {
																setSelectedDay(dayId);
																setSearchQuery("");
																setTimeout(() => {
																	const elementId = `activity-${activity.id}`;
																	const element =
																		document.getElementById(elementId);
																	if (element) {
																		element.scrollIntoView({
																			behavior: "smooth",
																			block: "center",
																		});
																		element.classList.add("highlight-pulse");
																		setTimeout(
																			() =>
																				element.classList.remove(
																					"highlight-pulse"
																				),
																			2000
																		);
																	}
																}, 100);
															}}
														>
															<div className="font-medium">{activity.name}</div>
															<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm mt-1 gap-1">
																<span className={theme.textMuted}>
																	{activity.user} • {activity.votes} votes
																</span>
																<span className="text-indigo-500">
																	{day?.name}, {slot?.start}-{slot?.end}
																</span>
															</div>
														</button>
													</li>
												);
											})}
										</ul>
									) : (
										<div className="p-4 text-center text-gray-500">
											No activities found matching &quot;{searchQuery}&quot;
										</div>
									)}
								</div>
							)}
						</div>

						{}
						<div className="mb-8 md:mb-10 relative">
							<div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl -z-10 opacity-70"></div>

							<div
								className={`p-1.5 rounded-2xl ${theme.card} ${theme.shadow} mb-6 overflow-x-auto flex no-scrollbar`}
							>
								<div className="flex min-w-max">
									{days.map((day) => (
										<button
											key={day.id}
											onClick={() => setSelectedDay(day.id)}
											className={`px-4 sm:px-6 py-3 cursor-pointer rounded-xl transition-all font-medium text-sm md:text-base whitespace-nowrap mx-0.5 
                                            ${
																							selectedDay === day.id
																								? `bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform scale-[1.03]`
																								: `${
																										isDarkMode
																											? "text-slate-400 hover:text-slate-200"
																											: "text-slate-600 hover:text-slate-800"
																								  }`
																						}`}
										>
											<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
												<span className="font-bold">{day.name}</span>
												<span
													className={`${
														selectedDay === day.id
															? "text-indigo-100"
															: theme.textMuted
													} 
                                                    text-xs`}
												>
													{day.date}
												</span>
											</div>
										</button>
									))}
								</div>
							</div>

							<div className="flex flex-wrap items-center justify-between mb-6 gap-3">
								<div className="flex flex-wrap items-center gap-4">
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
										<span className="text-sm">Most Voted</span>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
										<span className="text-sm">Your Suggestion</span>
									</div>
								</div>
								<div>
									<button
										onClick={openFirstAvailableSlot}
										className={`inline-flex items-center py-2 px-4 cursor-pointer rounded-lg text-sm ${theme.buttonPrimary} ${theme.shadow} transition-all`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
												clipRule="evenodd"
											/>
										</svg>
										Quick Add {!isMobile && "(Alt+N)"}
									</button>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
							{currentDay?.timeSlots.map((slot) => {
								const topActivity = slot.activities[0];
								const yourActivities = slot.activities.filter(
									(a) => a.user === userName
								);

								return (
									<div
										key={slot.id}
										className={`${theme.card} rounded-2xl ${theme.shadow} overflow-hidden transition-all hover:shadow-xl border border-opacity-30 ${theme.border} relative group`}
									>
										{}

										<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>

										<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
											<div className="flex justify-between items-center">
												<h3 className="font-bold text-lg tracking-tight flex items-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 mr-2 opacity-80"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
															clipRule="evenodd"
														/>
													</svg>
													{slot.start} - {slot.end}
												</h3>
												<span className="bg-white/20 text-xs font-medium px-2 py-1 rounded-full">
													{slot.activities.length}{" "}
													{slot.activities.length === 1
														? "activity"
														: "activities"}
												</span>
											</div>
										</div>

										<div className="p-5 min-h-[300px] flex flex-col">
											{slot.activities && slot.activities.length > 0 ? (
												<div className="flex-grow">
													<h4
														className={`font-medium mb-4 flex items-center ${theme.textSecondary}`}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5 mr-2 text-indigo-500"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
															<path
																fillRule="evenodd"
																d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
																clipRule="evenodd"
															/>
														</svg>
														Proposed Activities
													</h4>
													<ul className="space-y-3">
														{slot.activities.map((activity, index) => {
															const isTopActivity = index === 0;
															const isYourActivity = activity.user === userName;
															const isRecentlyVoted =
																recentlyVoted &&
																recentlyVoted.dayId === currentDay.id &&
																recentlyVoted.slotId === slot.id &&
																recentlyVoted.activityId === activity.id;
															const isRecentlyAdded =
																recentlyAdded === activity.id;
															const isHovered = hoveredActivity === activity.id;
															const hasVoted = votedActivities[activity.id];

															return (
																<li
																	key={activity.id}
																	id={`activity-${activity.id}`}
																	className={`p-4 rounded-xl border ${
																		theme.border
																	} transition-all relative
                                                                    ${
																																			isRecentlyAdded
																																				? "animate-pulse border-indigo-500"
																																				: ""
																																		} 
                                                                    ${
																																			isTopActivity
																																				? "border-emerald-500 border-2"
																																				: isYourActivity
																																				? "border-amber-500 border-2"
																																				: ""
																																		}
                                                                    ${
																																			isDarkMode
																																				? "hover:bg-slate-800"
																																				: "hover:bg-slate-50"
																																		}`}
																	onMouseEnter={() =>
																		setHoveredActivity(activity.id)
																	}
																	onMouseLeave={() => setHoveredActivity(null)}
																>
																	<div className="flex items-center justify-between flex-wrap gap-2">
																		<div>
																			<div className="flex items-center flex-wrap gap-2">
																				<p
																					className={`font-medium ${
																						isHovered ? "text-indigo-500" : ""
																					}`}
																				>
																					{activity.name}
																				</p>
																				{isTopActivity && (
																					<span
																						className={`${theme.topBadge} text-xs px-2 py-0.5 rounded-full`}
																					>
																						Top
																					</span>
																				)}
																				{isYourActivity && (
																					<span
																						className={`${theme.yoursBadge} text-xs px-2 py-0.5 rounded-full`}
																					>
																						Yours
																					</span>
																				)}
																			</div>
																			<p
																				className={`text-sm ${theme.textMuted} mt-1 flex items-center`}
																			>
																				<svg
																					xmlns="http://www.w3.org/2000/svg"
																					className="h-3 w-3 mr-1"
																					viewBox="0 0 20 20"
																					fill="currentColor"
																				>
																					<path
																						fillRule="evenodd"
																						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
																						clipRule="evenodd"
																					/>
																				</svg>
																				{activity.user}
																			</p>
																		</div>
																		<div className="relative">
																			{}
																			{isRecentlyVoted && (
																				<div className="absolute -top-2 -right-2 animate-ping h-4 w-4 rounded-full bg-emerald-400 opacity-75"></div>
																			)}
																			<button
																				onClick={() =>
																					handleVote(
																						currentDay.id,
																						slot.id,
																						activity.id
																					)
																				}
																				disabled={hasVoted}
																				className={`flex items-center gap-1 py-1.5 px-3 rounded-full cursor-pointer text-sm transition-colors
                                                                                ${
																																									hasVoted
																																										? theme.buttonDisabled
																																										: isDarkMode
																																										? "bg-slate-700 hover:bg-indigo-600 text-white"
																																										: "bg-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-700"
																																								}`}
																				title={
																					hasVoted
																						? "You've already voted"
																						: "Vote for this activity"
																				}
																			>
																				<svg
																					xmlns="http://www.w3.org/2000/svg"
																					className={`h-4 w-4 ${
																						isHovered && !hasVoted
																							? "text-emerald-300"
																							: ""
																					}`}
																					viewBox="0 0 20 20"
																					fill="currentColor"
																				>
																					<path
																						fillRule="evenodd"
																						d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
																						clipRule="evenodd"
																					/>
																				</svg>
																				<span className="font-bold">
																					{activity.votes}
																				</span>
																			</button>
																		</div>
																	</div>
																</li>
															);
														})}
													</ul>
												</div>
											) : (
												<div className="flex-grow flex flex-col items-center justify-center">
													<div
														className={`w-16 h-16 rounded-full ${theme.highlight} flex items-center justify-center mb-4`}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-8 w-8 text-indigo-400"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={1.5}
																d="M12 6v6m0 0v6m0-6h6m-6 0H6"
															/>
														</svg>
													</div>
													<p className={`text-center ${theme.textMuted}`}>
														No activities proposed yet
													</p>
													<p
														className={`text-center text-sm mt-1 ${theme.textMuted}`}
													>
														Be the first to suggest one!
													</p>
												</div>
											)}

											<div className={`mt-6 pt-4 border-t ${theme.border}`}>
												{!showAddActivityForm ||
												selectedTimeSlot !== slot.id ? (
													<button
														onClick={() => {
															setSelectedTimeSlot(slot.id);
															setShowAddActivityForm(true);
															setTimeout(() => {
																const input = document.querySelector(
																	`#activity-input-${slot.id}`
																) as HTMLInputElement;
																if (input) input.focus();
															}, 100);
														}}
														className={`w-full py-2.5 px-3 rounded-xl text-sm font-medium cursor-pointer flex items-center justify-center transition-all
                                                        ${
																													isDarkMode
																														? "bg-slate-800 hover:bg-indigo-600 text-white border border-slate-700"
																														: "border border-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white"
																												}`}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 mr-2"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path
																fillRule="evenodd"
																d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
																clipRule="evenodd"
															/>
														</svg>
														Propose Activity
													</button>
												) : (
													<div className="space-y-3 animate-fadeIn">
														<div className="relative">
															<input
																id={`activity-input-${slot.id}`}
																type="text"
																value={activityInput}
																onChange={(e) =>
																	setActivityInput(e.target.value)
																}
																placeholder="Activity name"
																className={`w-full p-3 rounded-xl text-sm ${theme.inputBg} border ${theme.inputBorder} ${theme.text} focus:ring-2 focus:ring-indigo-500 focus:outline-none pl-10`}
																onKeyDown={(e) =>
																	e.key === "Enter" &&
																	activityInput.trim() &&
																	handleAddActivity()
																}
															/>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fillRule="evenodd"
																	d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
														<div className="flex gap-2">
															<button
																onClick={handleAddActivity}
																disabled={!activityInput.trim()}
																className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium cursor-pointer flex items-center justify-center
                                                                ${
																																	activityInput.trim()
																																		? theme.buttonPrimary
																																		: theme.buttonDisabled
																																}`}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-4 w-4 mr-2"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																		clipRule="evenodd"
																	/>
																</svg>
																Add
															</button>
															<button
																onClick={() => {
																	setShowAddActivityForm(false);
																	setActivityInput("");
																	setSelectedTimeSlot(null);
																}}
																className={`py-2.5 px-3 rounded-xl text-sm font-medium cursor-pointer flex items-center justify-center ${theme.buttonSecondary}`}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-4 w-4 mr-2"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
																		clipRule="evenodd"
																	/>
																</svg>
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

						{}
						<div
							className={`rounded-2xl ${theme.card} ${theme.shadow} p-6 sm:p-8 mb-8 relative overflow-hidden`}
						>
							{}
							<div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/5 blur-2xl"></div>

							<h2 className="text-2xl font-bold mb-6 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 mr-2 text-indigo-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Event Summary
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{days.map((day) => {
									const topActivity = day.timeSlots
										.flatMap((slot) => slot.activities)
										.sort((a, b) => b.votes - a.votes)[0];

									return (
										<div
											key={day.id}
											id={`day-${day.id}`}
											className={`rounded-xl p-4 ${theme.highlight} relative overflow-hidden group transition-transform hover:scale-[1.01]`}
										>
											<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/70 to-purple-500/70 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

											<h3 className="font-bold flex items-center mb-2">
												<span
													className={`w-2 h-2 rounded-full ${
														day.id === selectedDay
															? "bg-emerald-500"
															: "bg-gray-400"
													} mr-2`}
												></span>
												{day.name}{" "}
												<span className="ml-2 text-sm font-normal text-gray-500">
													{day.date}
												</span>
											</h3>
											{topActivity ? (
												<div
													className={`mt-2 p-3 rounded-lg ${theme.card} shadow-sm relative group-hover:shadow-md transition-shadow`}
												>
													<div className="flex justify-between items-center flex-wrap gap-2">
														<div>
															<p className="font-medium">{topActivity.name}</p>
															<p className={`text-xs ${theme.textMuted}`}>
																Most voted activity
															</p>
														</div>
														<div
															className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${theme.accentLight} group-hover:bg-indigo-600 group-hover:text-white transition-colors`}
														>
															{topActivity.votes} votes
														</div>
													</div>
												</div>
											) : (
												<p className={`mt-2 text-sm italic ${theme.textMuted}`}>
													No activities yet
												</p>
											)}

											<button
												onClick={() => {
													setSelectedDay(day.id);
												}}
												className={`mt-3 text-xs px-3 py-1 rounded-full ${
													day.id === selectedDay
														? theme.accentLight
														: isDarkMode
														? "bg-slate-800 text-slate-300 hover:bg-slate-700"
														: "bg-white text-slate-600 hover:bg-slate-100"
												} transition-colors cursor-pointer`}
											>
												{day.id === selectedDay
													? "Currently viewing"
													: "View details"}
											</button>
										</div>
									);
								})}
							</div>
						</div>

						{}
						<div
							className={`rounded-2xl ${theme.card} ${theme.shadow} p-6 sm:p-8 mb-8 relative overflow-hidden`}
						>
							{}
							<div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/5 blur-2xl"></div>

							<h2 className="text-2xl font-bold mb-6 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 mr-2 text-indigo-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Activity Statistics
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
								<div
									className={`p-6 rounded-xl ${theme.highlight} relative overflow-hidden group hover:shadow-md transition-shadow`}
								>
									<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<p className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-3">
										{
											days.flatMap((day) =>
												day.timeSlots.flatMap((slot) => slot.activities)
											).length
										}
									</p>
									<p className={`${theme.textSecondary} font-medium`}>
										Total Activities
									</p>
								</div>

								<div
									className={`p-6 rounded-xl ${theme.highlight} relative overflow-hidden group hover:shadow-md transition-shadow`}
								>
									<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<p className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-3">
										{
											days.flatMap((day) =>
												day.timeSlots.flatMap((slot) =>
													slot.activities.filter((a) => a.user === userName)
												)
											).length
										}
									</p>
									<p className={`${theme.textSecondary} font-medium`}>
										Your Suggestions
									</p>
								</div>

								<div
									className={`p-6 rounded-xl ${theme.highlight} relative overflow-hidden group hover:shadow-md transition-shadow`}
								>
									<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<p className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-3">
										{days.reduce((total, day) => {
											return (
												total +
												day.timeSlots.reduce((dayTotal, slot) => {
													return (
														dayTotal +
														slot.activities.reduce((slotTotal, activity) => {
															return slotTotal + activity.votes;
														}, 0)
													);
												}, 0)
											);
										}, 0)}
									</p>
									<p className={`${theme.textSecondary} font-medium`}>
										Total Votes
									</p>
								</div>
							</div>

							<div className="mt-8">
								<h3 className="font-bold mb-4 text-lg flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2 text-indigo-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
									</svg>
									Contributors Leaderboard
								</h3>
								<div
									className={`overflow-hidden rounded-xl ${theme.card} ${theme.shadow}`}
								>
									<div
										className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 font-semibold border-b ${theme.border} ${theme.textSecondary}`}
									>
										<div>User</div>
										<div className="hidden sm:block">Activities</div>
										<div className="hidden sm:block">Votes Received</div>
									</div>

									{Array.from(
										new Set(
											days.flatMap((day) =>
												day.timeSlots.flatMap((slot) =>
													slot.activities.map((a) => a.user)
												)
											)
										)
									)
										.sort((a, b) => {
											return (voteCount[b] || 0) - (voteCount[a] || 0);
										})
										.map((user) => {
											const activities = days.flatMap((day) =>
												day.timeSlots.flatMap((slot) =>
													slot.activities.filter((a) => a.user === user)
												)
											);
											const totalVotes = activities.reduce(
												(sum, activity) => sum + activity.votes,
												0
											);

											const maxVotes = Math.max(...Object.values(voteCount));
											const votePercentage =
												maxVotes > 0 ? (totalVotes / maxVotes) * 100 : 0;

											return (
												<div
													key={user}
													className={`p-4 ${
														theme.border
													} border-b transition-colors ${theme.cardHover} ${
														user === userName ? `${theme.highlight}` : ""
													}`}
												>
													<div className="sm:grid sm:grid-cols-3 sm:gap-4 flex flex-col gap-2">
														<div className="flex items-center">
															<div
																className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
																	user === userName
																		? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
																		: isDarkMode
																		? "bg-slate-700"
																		: "bg-indigo-100"
																}`}
															>
																{user.charAt(0).toUpperCase()}
															</div>
															<span
																className={user === userName ? "font-bold" : ""}
															>
																{user}
															</span>
															{user === userName && (
																<span
																	className={`ml-2 text-xs ${theme.yoursBadge} px-2 py-0.5 rounded-full`}
																>
																	You
																</span>
															)}
														</div>
														<div className="flex sm:block items-center mt-1 sm:mt-0">
															<span className="sm:hidden mr-2 font-medium text-sm">
																Activities:
															</span>
															{activities.length}
														</div>
														<div className="sm:flex items-center">
															<div className="flex items-center mb-1 sm:mb-0">
																<span className="sm:hidden mr-2 font-medium text-sm">
																	Votes:
																</span>
																<span className="mr-2 font-semibold">
																	{totalVotes}
																</span>
															</div>
															<div
																className={`h-2 flex-grow bg-slate-200 rounded-full overflow-hidden ${
																	isDarkMode ? "bg-slate-700" : ""
																}`}
															>
																<div
																	className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
																	style={{ width: `${votePercentage}%` }}
																></div>
															</div>
														</div>
													</div>
												</div>
											);
										})}
								</div>
							</div>
						</div>

						<footer className="mt-12 text-center py-6 sm:py-8">
							{!isMobile && (
								<div
									className={`inline-flex items-center p-2 px-4 rounded-full ${theme.card} ${theme.shadow} mb-4`}
								>
									<span className={`${theme.textMuted} text-sm mr-2`}>
										Keyboard shortcuts:
									</span>
									<span
										className={`${
											isDarkMode
												? "bg-slate-700 text-white"
												: "bg-slate-100 text-slate-800"
										} text-xs px-2 py-1 rounded mx-1`}
									>
										Alt+N
									</span>
									<span className={`${theme.textMuted} text-xs mx-1`}>
										Add Activity
									</span>
									<span
										className={`${
											isDarkMode
												? "bg-slate-700 text-white"
												: "bg-slate-100 text-slate-800"
										} text-xs px-2 py-1 rounded mx-1`}
									>
										Alt+D
									</span>
									<span className={`${theme.textMuted} text-xs mx-1`}>
										Toggle Dark Mode
									</span>
								</div>
							)}

							<p className={`${theme.textMuted} text-sm`}>
								Collaborative Event Planner • {new Date().getFullYear()} •
								<span className="text-indigo-500 ml-1">
									Plan Better Together
								</span>
							</p>
						</footer>
					</>
				)}
			</div>

			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

				body {
					font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
						sans-serif;
				}

				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}

				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes scaleIn {
					from {
						transform: scale(0.95);
						opacity: 0;
					}
					to {
						transform: scale(1);
						opacity: 1;
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out;
				}

				.animate-scaleIn {
					animation: scaleIn 0.3s ease-out;
				}

				.highlight-pulse {
					animation: highlight-pulse 1.5s ease-out;
				}

				@keyframes highlight-pulse {
					0% {
						box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
					}
					70% {
						box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
					}
					100% {
						box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
					}
				}
			`}</style>
		</div>
	);
}
