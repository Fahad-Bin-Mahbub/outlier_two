"use client";

import React, { useState, useEffect } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

type Priority = "high" | "medium" | "low";
type View = "daily" | "weekly" | "monthly";
type CollaboratorStatus = "pending" | "in-progress" | "complete";

interface Subtask {
	id: string;
	title: string;
	completed: boolean;
}

interface Collaborator {
	id: string;
	name: string;
	avatar: string;
	status: CollaboratorStatus;
}

interface Task {
	id: string;
	title: string;
	description: string;
	priority: Priority;
	dueDate: string;
	reminder: string;
	completed: boolean;
	subtasks: Subtask[];
	collaborators: Collaborator[];
	isShared: boolean;
}

export default function TaskManagementAppExport() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [view, setView] = useState<View>("daily");
	const [newTask, setNewTask] = useState<Task>({
		id: "",
		title: "",
		description: "",
		priority: "medium",
		dueDate: "",
		reminder: "",
		completed: false,
		subtasks: [],
		collaborators: [],
		isShared: false,
	});
	const [newSubtask, setNewSubtask] = useState("");
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState("");
	const [currentTab, setCurrentTab] = useState<
		"tasks" | "calendar" | "collaboration"
	>("tasks");
	const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
	const [currentTaskForSubtasks, setCurrentTaskForSubtasks] = useState<
		string | null
	>(null);

	const dummyCollaborators: Collaborator[] = [
		{ id: "1", name: "Alex Kim", avatar: "👤", status: "in-progress" },
		{ id: "2", name: "Sam Jones", avatar: "👤", status: "pending" },
		{ id: "3", name: "Taylor Smith", avatar: "👤", status: "complete" },
	];

	useEffect(() => {
		const savedTasks = localStorage.getItem("tasks");
		if (savedTasks) {
			setTasks(JSON.parse(savedTasks));
		} else {
			const demoTasks: Task[] = [
				{
					id: "1",
					title: "Complete project proposal",
					description: "Finish the draft and send it to the team for review",
					priority: "high",
					dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0],
					reminder: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0],
					completed: false,
					subtasks: [
						{ id: "s1", title: "Research market competitors", completed: true },
						{ id: "s2", title: "Draft executive summary", completed: false },
					],
					collaborators: [dummyCollaborators[0], dummyCollaborators[1]],
					isShared: true,
				},
				{
					id: "2",
					title: "Weekly team meeting",
					description: "Discuss progress and roadblocks",
					priority: "medium",
					dueDate: new Date().toISOString().split("T")[0],
					reminder: new Date().toISOString().split("T")[0],
					completed: false,
					subtasks: [],
					collaborators: [dummyCollaborators[0], dummyCollaborators[2]],
					isShared: true,
				},
				{
					id: "3",
					title: "Update personal portfolio",
					description: "Add recent projects and update skills section",
					priority: "low",
					dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0],
					reminder: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0],
					completed: false,
					subtasks: [
						{ id: "s3", title: "Take new profile photo", completed: false },
						{
							id: "s4",
							title: "Update project descriptions",
							completed: false,
						},
					],
					collaborators: [],
					isShared: false,
				},
			];
			setTasks(demoTasks);
			localStorage.setItem("tasks", JSON.stringify(demoTasks));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}, [tasks]);

	const handleTaskSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingTaskId) {
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === editingTaskId ? { ...newTask, id: editingTaskId } : task
				)
			);
			setEditingTaskId(null);
		} else {
			const taskWithId = { ...newTask, id: Date.now().toString() };
			setTasks((prevTasks) => [...prevTasks, taskWithId]);
		}
		setNewTask({
			id: "",
			title: "",
			description: "",
			priority: "medium",
			dueDate: "",
			reminder: "",
			completed: false,
			subtasks: [],
			collaborators: [],
			isShared: false,
		});
		setIsTaskModalOpen(false);
		showNotificationMessage("Task saved successfully!");
	};

	const editTask = (taskId: string) => {
		const taskToEdit = tasks.find((task) => task.id === taskId);
		if (taskToEdit) {
			setNewTask({ ...taskToEdit });
			setEditingTaskId(taskId);
			setIsTaskModalOpen(true);
		}
	};

	const deleteTask = (taskId: string) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
		showNotificationMessage("Task deleted successfully!");
	};

	const toggleTaskCompletion = (taskId: string) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const addSubtaskToNew = () => {
		if (newSubtask.trim()) {
			setNewTask({
				...newTask,
				subtasks: [
					...newTask.subtasks,
					{ id: Date.now().toString(), title: newSubtask, completed: false },
				],
			});
			setNewSubtask("");
		}
	};

	const removeSubtaskFromNew = (subtaskId: string) => {
		setNewTask({
			...newTask,
			subtasks: newTask.subtasks.filter((subtask) => subtask.id !== subtaskId),
		});
	};

	const toggleSubtaskCompletion = (taskId: string, subtaskId: string) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId
					? {
							...task,
							subtasks: task.subtasks.map((subtask) =>
								subtask.id === subtaskId
									? { ...subtask, completed: !subtask.completed }
									: subtask
							),
					  }
					: task
			)
		);
	};

	const addCollaboratorToTask = (taskId: string, collaboratorId: string) => {
		const collaborator = dummyCollaborators.find(
			(c) => c.id === collaboratorId
		);
		if (!collaborator) return;
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId
					? {
							...task,
							collaborators: [...task.collaborators, collaborator],
							isShared: true,
					  }
					: task
			)
		);
		showNotificationMessage(`Collaborator ${collaborator.name} added!`);
	};

	const removeCollaboratorFromTask = (
		taskId: string,
		collaboratorId: string
	) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId
					? {
							...task,
							collaborators: task.collaborators.filter(
								(c) => c.id !== collaboratorId
							),
							isShared:
								task.collaborators.filter((c) => c.id !== collaboratorId)
									.length > 0,
					  }
					: task
			)
		);
	};

	const openSubtaskModal = (taskId: string) => {
		setCurrentTaskForSubtasks(taskId);
		setIsSubtaskModalOpen(true);
	};

	const addSubtaskToExisting = () => {
		if (newSubtask.trim() && currentTaskForSubtasks) {
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === currentTaskForSubtasks
						? {
								...task,
								subtasks: [
									...task.subtasks,
									{
										id: Date.now().toString(),
										title: newSubtask,
										completed: false,
									},
								],
						  }
						: task
				)
			);
			setNewSubtask("");
		}
	};

	const showNotificationMessage = (message: string) => {
		setNotificationMessage(message);
		setShowNotification(true);
		setTimeout(() => setShowNotification(false), 3000);
	};

	const sendTaskReminder = (taskId: string) => {
		const task = tasks.find((t) => t.id === taskId);
		if (task && task.isShared) {
			showNotificationMessage(
				`Reminder sent to ${task.collaborators.length} collaborators!`
			);
		}
	};

	const generateCalendar = () => {
		const today = new Date();

		if (view === "daily") {
			const dailyTasks = tasks.filter((task) => {
				const taskDate = new Date(task.dueDate);
				return (
					taskDate.getDate() === selectedDate.getDate() &&
					taskDate.getMonth() === selectedDate.getMonth() &&
					taskDate.getFullYear() === selectedDate.getFullYear()
				);
			});

			return (
				<div className="bg-white rounded-lg shadow-md p-4 transform transition-all duration-300 hover:shadow-lg">
					<div className="flex justify-between items-center mb-4">
						<button
							className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 flex items-center justify-center w-8 h-8 text-blue-700 transition-colors duration-200 cursor-pointer transform hover:scale-105"
							onClick={() =>
								setSelectedDate(
									new Date(selectedDate.setDate(selectedDate.getDate() - 1))
								)
							}
						>
							<span className="text-lg font-bold">←</span>
						</button>
						<h2 className="text-xl font-semibold text-gray-900">
							{selectedDate.toLocaleDateString("en-US", {
								weekday: "long",
								month: "long",
								day: "numeric",
							})}
						</h2>
						<button
							className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 flex items-center justify-center w-8 h-8 text-blue-700 transition-colors duration-200 cursor-pointer transform hover:scale-105"
							onClick={() =>
								setSelectedDate(
									new Date(selectedDate.setDate(selectedDate.getDate() + 1))
								)
							}
						>
							<span className="text-lg font-bold">→</span>
						</button>
					</div>
					<div className="divide-y">
						{dailyTasks.length > 0 ? (
							dailyTasks.map((task) => (
								<div
									key={task.id}
									className="py-3 transition-all duration-200 hover:bg-gray-50 rounded-md px-2"
								>
									<div className="flex items-center">
										<div
											className={`w-3 h-3 rounded-full mr-2 ${
												task.priority === "high"
													? "bg-red-500"
													: task.priority === "medium"
													? "bg-yellow-500"
													: "bg-green-500"
											}`}
										></div>
										<span
											className={
												task.completed
													? "line-through text-gray-500"
													: "text-gray-800"
											}
										>
											{task.title}
										</span>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500 py-3 text-center italic">
								No tasks for this day
							</p>
						)}
					</div>
				</div>
			);
		}

		if (view === "weekly") {
			const startOfWeek = new Date(selectedDate);
			startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
			const days = Array(7)
				.fill(0)
				.map((_, i) => {
					const day = new Date(startOfWeek);
					day.setDate(startOfWeek.getDate() + i);
					return day;
				});

			return (
				<div className="bg-white rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
					<div className="flex justify-between items-center p-4">
						<button
							className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 flex items-center justify-center w-8 h-8 text-blue-700 transition-colors duration-200 cursor-pointer transform hover:scale-105"
							onClick={() =>
								setSelectedDate(
									new Date(selectedDate.setDate(selectedDate.getDate() - 7))
								)
							}
						>
							<span className="text-lg font-bold">←</span>
						</button>
						<h2 className="text-xl font-semibold text-gray-900">
							{startOfWeek.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})}{" "}
							-{" "}
							{new Date(
								startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000
							).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
						</h2>
						<button
							className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 flex items-center justify-center w-8 h-8 text-blue-700 transition-colors duration-200 cursor-pointer transform hover:scale-105"
							onClick={() =>
								setSelectedDate(
									new Date(selectedDate.setDate(selectedDate.getDate() + 7))
								)
							}
						>
							<span className="text-lg font-bold">→</span>
						</button>
					</div>
					<div className="grid grid-cols-7 gap-1 p-4">
						{days.map((day, index) => {
							const dayTasks = tasks.filter((task) => {
								const taskDate = new Date(task.dueDate);
								return (
									taskDate.getDate() === day.getDate() &&
									taskDate.getMonth() === day.getMonth() &&
									taskDate.getFullYear() === day.getFullYear()
								);
							});
							const isToday =
								day.getDate() === today.getDate() &&
								day.getMonth() === today.getMonth() &&
								day.getFullYear() === today.getFullYear();
							return (
								<div
									key={index}
									className={`p-2 min-h-32 border cursor-pointer transition-all duration-200 hover:shadow-md ${
										isToday
											? "bg-blue-50 border-blue-300"
											: "border-gray-200 hover:border-blue-200"
									}`}
									onClick={() => setSelectedDate(new Date(day))}
								>
									<div className="text-sm font-medium mb-1 text-gray-800 text-center">
										{day.toLocaleDateString("en-US", { weekday: "short" })}
									</div>
									<div className="text-center font-bold mb-2 text-gray-800 text-lg">
										{day.getDate()}
									</div>
									<div className="space-y-1">
										{dayTasks.slice(0, 3).map((task) => (
											<div
												key={task.id}
												className={`text-xs p-1 rounded truncate transition-colors duration-200 ${
													task.priority === "high"
														? "bg-red-100 text-red-800 hover:bg-red-200"
														: task.priority === "medium"
														? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
														: "bg-green-100 text-green-800 hover:bg-green-200"
												}`}
											>
												{task.title}
											</div>
										))}
										{dayTasks.length > 3 && (
											<div className="text-xs text-gray-700 bg-gray-100 p-1 rounded text-center hover:bg-gray-200 transition-colors duration-200">
												+{dayTasks.length - 3} more
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			);
		}

		if (view === "monthly") {
			const firstDayOfMonth = new Date(
				selectedDate.getFullYear(),
				selectedDate.getMonth(),
				1
			);
			const lastDayOfMonth = new Date(
				selectedDate.getFullYear(),
				selectedDate.getMonth() + 1,
				0
			);
			const startDay = firstDayOfMonth.getDay();
			const daysInMonth = lastDayOfMonth.getDate();
			const days = Array(startDay)
				.fill(null)
				.concat(
					Array(daysInMonth)
						.fill(0)
						.map(
							(_, i) =>
								new Date(
									selectedDate.getFullYear(),
									selectedDate.getMonth(),
									i + 1
								)
						)
				);
			while (days.length < 35) {
				days.push(null);
			}

			return (
				<div className="bg-white rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
					<div className="flex justify-between items-center p-4">
						<button
							className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 flex items-center justify-center w-8 h-8 text-blue-700 transition-colors duration-200 cursor-pointer transform hover:scale-105"
							onClick={() =>
								setSelectedDate(
									new Date(selectedDate.setMonth(selectedDate.getMonth() - 1))
								)
							}
						>
							<span className="text-lg font-bold">←</span>
						</button>
						<h2 className="text-xl font-semibold text-gray-900">
							{selectedDate.toLocaleDateString("en-US", {
								month: "long",
								year: "numeric",
							})}
						</h2>
						<button
							className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 flex items-center justify-center w-8 h-8 text-blue-700 transition-colors duration-200 cursor-pointer transform hover:scale-105"
							onClick={() =>
								setSelectedDate(
									new Date(selectedDate.setMonth(selectedDate.getMonth() + 1))
								)
							}
						>
							<span className="text-lg font-bold">→</span>
						</button>
					</div>
					<div className="grid grid-cols-7 gap-1 p-4">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<div
								key={day}
								className="text-center font-medium text-gray-800 p-1"
							>
								{day}
							</div>
						))}
						{days.map((day, index) => {
							if (!day) {
								return (
									<div
										key={`empty-${index}`}
										className="p-2 border border-gray-100"
									></div>
								);
							}
							const dayTasks = tasks.filter((task) => {
								const taskDate = new Date(task.dueDate);
								return (
									taskDate.getDate() === day.getDate() &&
									taskDate.getMonth() === day.getMonth() &&
									taskDate.getFullYear() === day.getFullYear()
								);
							});
							const isToday =
								day.getDate() === today.getDate() &&
								day.getMonth() === today.getMonth() &&
								day.getFullYear() === today.getFullYear();
							const isSelected =
								day.getDate() === selectedDate.getDate() &&
								day.getMonth() === selectedDate.getMonth() &&
								day.getFullYear() === selectedDate.getFullYear();
							return (
								<div
									key={`day-${index}`}
									className={`p-1 min-h-16 border cursor-pointer transition-all duration-200 hover:shadow-inner ${
										isToday
											? "bg-blue-50 border-blue-300"
											: isSelected
											? "bg-gray-100 border-gray-300"
											: "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
									}`}
									onClick={() => setSelectedDate(new Date(day))}
								>
									<div className="text-right text-sm font-medium text-gray-800">
										{day.getDate()}
									</div>
									{dayTasks.length > 0 && (
										<div className="mt-1">
											<div
												className={`text-xs p-1 rounded-full w-5 h-5 flex items-center justify-center transform transition-transform duration-200 hover:scale-110 ${
													dayTasks.some((t) => t.priority === "high")
														? "bg-red-500 text-white"
														: dayTasks.some((t) => t.priority === "medium")
														? "bg-yellow-500 text-white"
														: "bg-green-500 text-white"
												}`}
											>
												{dayTasks.length}
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			);
		}

		return null;
	};

	const renderTaskList = () => {
		const sortedTasks = [...tasks].sort((a, b) => {
			if (a.completed !== b.completed) {
				return a.completed ? 1 : -1;
			}
			const priorityOrder = { high: 0, medium: 1, low: 2 };
			if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
				return priorityOrder[a.priority] - priorityOrder[b.priority];
			}
			return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
		});

		return (
			<div className="space-y-4">
				{sortedTasks.map((task) => (
					<div
						key={task.id}
						className={`bg-white rounded-lg shadow-md p-4 transform transition-all duration-300 ${
							task.completed ? "opacity-70" : "hover:shadow-lg"
						}`}
					>
						<div className="flex items-start justify-between">
							<div className="flex items-start space-x-3">
								<div className="mt-1">
									<input
										type="checkbox"
										checked={task.completed}
										onChange={() => toggleTaskCompletion(task.id)}
										className="h-5 w-5 text-blue-600 rounded cursor-pointer transition-all duration-200 hover:scale-110"
									/>
								</div>
								<div>
									<h3
										className={`font-semibold text-lg text-gray-900 transition-all duration-300 ${
											task.completed ? "line-through text-gray-600" : ""
										}`}
									>
										{task.title}
									</h3>
									<p className="text-gray-700 text-sm mt-1">
										{task.description}
									</p>
									<div className="flex flex-wrap items-center mt-2 text-sm text-gray-700 space-x-4">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
												task.priority === "high"
													? "bg-red-100 text-red-800 hover:bg-red-200"
													: task.priority === "medium"
													? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
													: "bg-green-100 text-green-800 hover:bg-green-200"
											}`}
										>
											{task.priority.charAt(0).toUpperCase() +
												task.priority.slice(1)}
										</span>
										{task.dueDate && (
											<span className="bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors duration-200">
												Due: {new Date(task.dueDate).toLocaleDateString()}
											</span>
										)}
										{task.subtasks.length > 0 && (
											<span className="bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors duration-200">
												Subtasks:{" "}
												{task.subtasks.filter((s) => s.completed).length}/
												{task.subtasks.length}
											</span>
										)}
									</div>
									{task.subtasks.length > 0 && (
										<div className="mt-3 pl-2 border-l-2 border-gray-200">
											{task.subtasks.map((subtask) => (
												<div
													key={subtask.id}
													className="flex items-center space-x-2 py-1 group hover:bg-gray-50 rounded px-1 transition-colors duration-200"
												>
													<input
														type="checkbox"
														checked={subtask.completed}
														onChange={() =>
															toggleSubtaskCompletion(task.id, subtask.id)
														}
														className="h-4 w-4 text-blue-600 rounded cursor-pointer transition-all duration-200 hover:scale-110"
													/>
													<span
														className={
															subtask.completed
																? "line-through text-gray-500 text-sm transition-all duration-300"
																: "text-gray-800 text-sm transition-all duration-300"
														}
													>
														{subtask.title}
													</span>
												</div>
											))}
											<button
												className="text-blue-600 text-sm hover:text-blue-800 mt-1 transition-colors duration-200 hover:underline flex items-center group cursor-pointer"
												onClick={() => openSubtaskModal(task.id)}
											>
												<span className="transform transition-transform duration-200 group-hover:scale-110 mr-1">
													+
												</span>{" "}
												Add subtask
											</button>
										</div>
									)}
									{task.isShared && (
										<div className="mt-3 flex items-center space-x-2">
											{task.collaborators.map((collab) => (
												<div key={collab.id} className="relative group">
													<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm transition-transform duration-200 hover:scale-110 cursor-pointer shadow-sm hover:shadow">
														{collab.avatar}
													</div>
													<div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-1 -mt-1 ml-6 z-10 shadow-lg transform transition-opacity duration-200 opacity-0 group-hover:opacity-100 min-w-max">
														{collab.name} • {collab.status}
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
							<div className="flex space-x-2">
								{task.isShared && (
									<button
										onClick={() => sendTaskReminder(task.id)}
										className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors duration-200 cursor-pointer transform hover:scale-110"
										title="Send reminder"
									>
										📣
									</button>
								)}
								<button
									onClick={() => editTask(task.id)}
									className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors duration-200 cursor-pointer transform hover:scale-110"
									title="Edit task"
								>
									✏️
								</button>
								<button
									onClick={() => deleteTask(task.id)}
									className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors duration-200 cursor-pointer transform hover:scale-110"
									title="Delete task"
								>
									🗑️
								</button>
							</div>
						</div>
						{task.subtasks.length === 0 && (
							<button
								className="text-blue-600 text-sm hover:text-blue-800 mt-3 transition-colors duration-200 hover:underline flex items-center group cursor-pointer"
								onClick={() => openSubtaskModal(task.id)}
							>
								<span className="transform transition-transform duration-200 group-hover:scale-110 mr-1">
									+
								</span>{" "}
								Add subtasks
							</button>
						)}
					</div>
				))}
				{tasks.length === 0 && (
					<div className="text-center py-12 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
						<p className="text-gray-700 text-lg">
							No tasks yet. Create your first task!
						</p>
						<button
							onClick={() => {
								setNewTask({
									id: "",
									title: "",
									description: "",
									priority: "medium",
									dueDate: "",
									reminder: "",
									completed: false,
									subtasks: [],
									collaborators: [],
									isShared: false,
								});
								setEditingTaskId(null);
								setIsTaskModalOpen(true);
							}}
							className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
						>
							<span className="mr-2">+</span> Add Task
						</button>
					</div>
				)}
			</div>
		);
	};

	const renderCollaborationSection = () => {
		const sharedTasks = tasks.filter((task) => task.isShared);

		return (
			<div className="space-y-4">
				<h2 className="text-xl font-semibold mb-4 text-gray-900">
					Shared Tasks
				</h2>
				{sharedTasks.length === 0 ? (
					<div className="text-center py-12 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
						<p className="text-gray-700 text-lg">No shared tasks yet.</p>
						<button
							onClick={() => {
								setNewTask({
									id: "",
									title: "",
									description: "",
									priority: "medium",
									dueDate: "",
									reminder: "",
									completed: false,
									subtasks: [],
									collaborators: [dummyCollaborators[0]],
									isShared: true,
								});
								setEditingTaskId(null);
								setIsTaskModalOpen(true);
							}}
							className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
						>
							<span className="mr-2">+</span> Create Shared Task
						</button>
					</div>
				) : (
					<div className="space-y-4">
						{sharedTasks.map((task) => (
							<div
								key={task.id}
								className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg"
							>
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold text-gray-900 text-lg">
											{task.title}
										</h3>
										<p className="text-sm text-gray-700 mt-1">
											{task.description}
										</p>
										<div className="mt-3">
											<div className="text-sm font-medium mb-2 text-gray-800">
												Collaborators:
											</div>
											<div className="flex flex-wrap gap-2">
												{task.collaborators.map((collaborator) => (
													<div
														key={collaborator.id}
														className="flex items-center bg-gray-100 rounded-full px-3 py-1 transition-all duration-200 hover:bg-gray-200 group"
													>
														<span className="mr-1">{collaborator.avatar}</span>
														<span className="text-sm text-gray-800">
															{collaborator.name}
														</span>
														<span
															className={`ml-2 w-2 h-2 rounded-full ${
																collaborator.status === "complete"
																	? "bg-green-500"
																	: collaborator.status === "in-progress"
																	? "bg-yellow-500"
																	: "bg-gray-500"
															}`}
														></span>
														<button
															onClick={() =>
																removeCollaboratorFromTask(
																	task.id,
																	collaborator.id
																)
															}
															className="ml-2 text-red-500 text-xs cursor-pointer transition-all duration-200 hover:text-red-700 transform group-hover:scale-110"
														>
															×
														</button>
													</div>
												))}
												<div className="relative group">
													<button className="flex items-center bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-sm transition-colors duration-200 hover:bg-blue-200 cursor-pointer shadow-sm hover:shadow">
														+ Add
													</button>
													<div className="absolute hidden group-hover:block z-10 bg-white shadow-lg rounded mt-1 p-2 w-40 transform transition-all duration-200 scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100">
														{dummyCollaborators
															.filter(
																(c) =>
																	!task.collaborators.some(
																		(tc) => tc.id === c.id
																	)
															)
															.map((collaborator) => (
																<div
																	key={collaborator.id}
																	className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200"
																	onClick={() =>
																		addCollaboratorToTask(
																			task.id,
																			collaborator.id
																		)
																	}
																>
																	<span className="mr-2">
																		{collaborator.avatar}
																	</span>
																	<span className="text-sm text-gray-800">
																		{collaborator.name}
																	</span>
																</div>
															))}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
				<div className="mt-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-900">
						Team Activity
					</h2>
					<div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
						<div className="space-y-4">
							<div className="border-l-4 border-blue-500 pl-3 transform transition-transform duration-300 hover:translate-x-1 hover:shadow-sm p-2 rounded-r">
								<div className="flex items-start">
									<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm mr-3 shadow-sm transition-transform duration-200 hover:scale-110">
										👤
									</div>
									<div>
										<p className="font-medium text-gray-800">Alex Kim</p>
										<p className="text-gray-700">
											Completed "Research market competitors" subtask
										</p>
										<p className="text-xs text-gray-500 mt-1">2 hours ago</p>
									</div>
								</div>
							</div>
							<div className="border-l-4 border-green-500 pl-3 transform transition-transform duration-300 hover:translate-x-1 hover:shadow-sm p-2 rounded-r">
								<div className="flex items-start">
									<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm mr-3 shadow-sm transition-transform duration-200 hover:scale-110">
										👤
									</div>
									<div>
										<p className="font-medium text-gray-800">Taylor Smith</p>
										<p className="text-gray-700">
											Added new task "Prepare for client meeting"
										</p>
										<p className="text-xs text-gray-500 mt-1">5 hours ago</p>
									</div>
								</div>
							</div>
							<div className="border-l-4 border-yellow-500 pl-3 transform transition-transform duration-300 hover:translate-x-1 hover:shadow-sm p-2 rounded-r">
								<div className="flex items-start">
									<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm mr-3 shadow-sm transition-transform duration-200 hover:scale-110">
										👤
									</div>
									<div>
										<p className="font-medium text-gray-800">Sam Jones</p>
										<p className="text-gray-700">
											Updated due date for "Complete project proposal"
										</p>
										<p className="text-xs text-gray-500 mt-1">Yesterday</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-900">
						Team Performance
					</h2>
					<div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
							<div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300 transform hover:scale-105">
								<h3 className="text-lg font-medium text-blue-800">
									Completed Tasks
								</h3>
								<p className="text-3xl font-bold text-blue-600 mt-2">12</p>
								<p className="text-sm text-blue-700 mt-1 flex items-center">
									<span className="text-green-500 mr-1">↑</span> +3 from last
									week
								</p>
							</div>
							<div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300 transform hover:scale-105">
								<h3 className="text-lg font-medium text-green-800">
									On-time Completion
								</h3>
								<p className="text-3xl font-bold text-green-600 mt-2">87%</p>
								<p className="text-sm text-green-700 mt-1 flex items-center">
									<span className="text-green-500 mr-1">↑</span> +5% from last
									week
								</p>
							</div>
							<div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300 transform hover:scale-105 sm:col-span-2 md:col-span-1">
								<h3 className="text-lg font-medium text-purple-800">
									Team Engagement
								</h3>
								<p className="text-3xl font-bold text-purple-600 mt-2">92%</p>
								<p className="text-sm text-purple-700 mt-1 flex items-center">
									<span className="text-green-500 mr-1">↑</span> +2% from last
									week
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// CSS for animated modal entrances/exits
	const modalClasses = `fixed inset-0 z-50 flex items-center justify-center ${
		isTaskModalOpen || isSubtaskModalOpen
			? "opacity-100"
			: "opacity-0 pointer-events-none"
	} transition-opacity duration-300`;

	const modalContentClasses = `bg-white rounded-lg shadow-lg relative z-10 transform transition-all duration-300 ${
		isTaskModalOpen || isSubtaskModalOpen
			? "translate-y-0 opacity-100"
			: "translate-y-8 opacity-0"
	}`;

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${montserrat.className}`}
		>
			<div className="container mx-auto px-4 py-8">
				<header className="mb-8">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
						<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
							Task Manager
						</h1>
						<button
							onClick={() => {
								setNewTask({
									id: "",
									title: "",
									description: "",
									priority: "medium",
									dueDate: "",
									reminder: "",
									completed: false,
									subtasks: [],
									collaborators: [],
									isShared: false,
								});
								setEditingTaskId(null);
								setIsTaskModalOpen(true);
							}}
							className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
						>
							<span className="mr-2 text-lg font-bold">+</span> New Task
						</button>
					</div>
					<div className="bg-white rounded-lg shadow-md p-2 flex flex-wrap mb-6">
						<button
							onClick={() => setCurrentTab("tasks")}
							className={`flex-1 py-2 px-4 rounded-lg text-center transition-all duration-200 cursor-pointer ${
								currentTab === "tasks"
									? "bg-blue-100 text-blue-700 shadow-sm"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							Tasks
						</button>
						<button
							onClick={() => setCurrentTab("calendar")}
							className={`flex-1 py-2 px-4 rounded-lg text-center transition-all duration-200 cursor-pointer ${
								currentTab === "calendar"
									? "bg-blue-100 text-blue-700 shadow-sm"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							Calendar
						</button>
						<button
							onClick={() => setCurrentTab("collaboration")}
							className={`flex-1 py-2 px-4 rounded-lg text-center transition-all duration-200 cursor-pointer ${
								currentTab === "collaboration"
									? "bg-blue-100 text-blue-700 shadow-sm"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							Collaboration
						</button>
					</div>
				</header>
				<main className="pb-16">
					{currentTab === "tasks" && renderTaskList()}
					{currentTab === "calendar" && (
						<div>
							<div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-wrap items-center justify-between">
								<div className="space-x-2 mb-2 md:mb-0">
									<button
										onClick={() => setView("daily")}
										className={`px-3 py-1 rounded transition-all duration-200 cursor-pointer ${
											view === "daily"
												? "bg-blue-600 text-white shadow-sm"
												: "bg-gray-200 text-gray-800 hover:bg-gray-300"
										}`}
									>
										Day
									</button>
									<button
										onClick={() => setView("weekly")}
										className={`px-3 py-1 rounded transition-all duration-200 cursor-pointer ${
											view === "weekly"
												? "bg-blue-600 text-white shadow-sm"
												: "bg-gray-200 text-gray-800 hover:bg-gray-300"
										}`}
									>
										Week
									</button>
									<button
										onClick={() => setView("monthly")}
										className={`px-3 py-1 rounded transition-all duration-200 cursor-pointer ${
											view === "monthly"
												? "bg-blue-600 text-white shadow-sm"
												: "bg-gray-200 text-gray-800 hover:bg-gray-300"
										}`}
									>
										Month
									</button>
								</div>
								<button
									onClick={() => setSelectedDate(new Date())}
									className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow"
								>
									Today
								</button>
							</div>
							{generateCalendar()}
						</div>
					)}
					{currentTab === "collaboration" && renderCollaborationSection()}
				</main>
			</div>

			<div className={modalClasses}>
				<div
					className="fixed inset-0 bg-black/30 backdrop-blur-[2px] cursor-pointer"
					onClick={() => {
						setIsTaskModalOpen(false);
						setIsSubtaskModalOpen(false);
					}}
				></div>

				{isTaskModalOpen && (
					<div
						className={`${modalContentClasses} w-11/12 sm:w-96 md:w-[450px] max-h-[90vh] overflow-hidden`}
					>
						<div className="p-5">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-gray-900">
									{editingTaskId ? "Edit Task" : "Create New Task"}
								</h2>
								<button
									onClick={() => setIsTaskModalOpen(false)}
									className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
								>
									✕
								</button>
							</div>
							<form
								onSubmit={handleTaskSubmit}
								className="max-h-[70vh] overflow-y-auto pr-1 space-y-4"
							>
								<div className="space-y-4">
									<div>
										<label className="block text-gray-800 font-medium mb-1">
											Title
										</label>
										<input
											type="text"
											value={newTask.title}
											onChange={(e) =>
												setNewTask({ ...newTask, title: e.target.value })
											}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
											placeholder="Task title"
											required
										/>
									</div>
									<div>
										<label className="block text-gray-800 font-medium mb-1">
											Description
										</label>
										<textarea
											value={newTask.description}
											onChange={(e) =>
												setNewTask({ ...newTask, description: e.target.value })
											}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
											placeholder="Task description"
											rows={3}
										/>
									</div>
									<div>
										<label className="block text-gray-800 font-medium mb-1">
											Priority
										</label>
										<select
											value={newTask.priority}
											onChange={(e) =>
												setNewTask({
													...newTask,
													priority: e.target.value as Priority,
												})
											}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none cursor-pointer"
										>
											<option value="high">High</option>
											<option value="medium">Medium</option>
											<option value="low">Low</option>
										</select>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-gray-800 font-medium mb-1">
												Due Date
											</label>
											<input
												type="date"
												value={newTask.dueDate}
												onChange={(e) =>
													setNewTask({ ...newTask, dueDate: e.target.value })
												}
												className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 h-10 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none cursor-pointer"
												onClick={(e) =>
													(e.target as HTMLInputElement).showPicker()
												}
											/>
										</div>
										<div>
											<label className="block text-gray-800 font-medium mb-1">
												Reminder
											</label>
											<input
												type="date"
												value={newTask.reminder}
												onChange={(e) =>
													setNewTask({ ...newTask, reminder: e.target.value })
												}
												className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 h-10 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none cursor-pointer"
												onClick={(e) =>
													(e.target as HTMLInputElement).showPicker()
												}
											/>
										</div>
									</div>
									<div>
										<label className="block text-gray-800 font-medium mb-1">
											Subtasks
										</label>
										<div className="flex space-x-2 mb-2">
											<input
												type="text"
												value={newSubtask}
												onChange={(e) => setNewSubtask(e.target.value)}
												className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
												placeholder="Add subtask"
											/>
											<button
												type="button"
												onClick={addSubtaskToNew}
												className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow"
											>
												Add
											</button>
										</div>
										<div className="space-y-2 max-h-32 overflow-y-auto">
											{newTask.subtasks.map((subtask) => (
												<div
													key={subtask.id}
													className="flex items-center justify-between bg-gray-100 rounded px-3 py-2 group hover:bg-gray-200 transition-colors duration-200"
												>
													<span className="text-sm text-gray-800">
														{subtask.title}
													</span>
													<button
														type="button"
														onClick={() => removeSubtaskFromNew(subtask.id)}
														className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer opacity-70 group-hover:opacity-100"
													>
														✕
													</button>
												</div>
											))}
										</div>
									</div>
									<div className="flex items-center">
										<input
											type="checkbox"
											id="isShared"
											checked={newTask.isShared}
											onChange={(e) =>
												setNewTask({ ...newTask, isShared: e.target.checked })
											}
											className="h-4 w-4 text-blue-600 cursor-pointer"
										/>
										<label
											htmlFor="isShared"
											className="ml-2 text-gray-800 cursor-pointer"
										>
											Share with collaborators
										</label>
									</div>
									{newTask.isShared && (
										<div className="animate-fadeIn">
											<label className="block text-gray-800 font-medium mb-1">
												Select Collaborators
											</label>
											<div className="space-y-2 border border-gray-300 rounded-lg p-3">
												{dummyCollaborators.map((collaborator) => (
													<div
														key={collaborator.id}
														className="flex items-center hover:bg-gray-50 p-1 rounded transition-colors duration-200"
													>
														<input
															type="checkbox"
															id={`collab-${collaborator.id}`}
															checked={newTask.collaborators.some(
																(c) => c.id === collaborator.id
															)}
															onChange={(e) => {
																if (e.target.checked) {
																	setNewTask({
																		...newTask,
																		collaborators: [
																			...newTask.collaborators,
																			collaborator,
																		],
																	});
																} else {
																	setNewTask({
																		...newTask,
																		collaborators: newTask.collaborators.filter(
																			(c) => c.id !== collaborator.id
																		),
																	});
																}
															}}
															className="h-4 w-4 text-blue-600 cursor-pointer"
														/>
														<label
															htmlFor={`collab-${collaborator.id}`}
															className="ml-2 flex items-center text-gray-800 cursor-pointer"
														>
															<span className="mr-1 transition-transform duration-200 hover:scale-110">
																{collaborator.avatar}
															</span>
															<span>{collaborator.name}</span>
														</label>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
								<div className="mt-6 flex justify-end space-x-3">
									<button
										type="button"
										onClick={() => setIsTaskModalOpen(false)}
										className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow transform hover:scale-105"
									>
										{editingTaskId ? "Update Task" : "Create Task"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{isSubtaskModalOpen && (
					<div
						className={`${modalContentClasses} w-11/12 sm:w-96 md:w-[450px] max-h-[90vh] overflow-hidden`}
					>
						<div className="p-5">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-gray-900">
									Add Subtask
								</h2>
								<button
									onClick={() => setIsSubtaskModalOpen(false)}
									className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
								>
									✕
								</button>
							</div>
							<div className="flex space-x-2 mb-4">
								<input
									type="text"
									value={newSubtask}
									onChange={(e) => setNewSubtask(e.target.value)}
									className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
									placeholder="Add subtask"
								/>
								<button
									onClick={addSubtaskToExisting}
									className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow"
								>
									Add
								</button>
							</div>
							<div className="space-y-2 max-h-60 overflow-y-auto">
								{currentTaskForSubtasks &&
									tasks
										.find((t) => t.id === currentTaskForSubtasks)
										?.subtasks.map((subtask) => (
											<div
												key={subtask.id}
												className="flex items-center justify-between bg-gray-100 rounded px-3 py-2 group hover:bg-gray-200 transition-colors duration-200"
											>
												<div className="flex items-center">
													<input
														type="checkbox"
														checked={subtask.completed}
														onChange={() =>
															toggleSubtaskCompletion(
																currentTaskForSubtasks,
																subtask.id
															)
														}
														className="h-4 w-4 text-blue-600 mr-2 cursor-pointer transition-all duration-200 hover:scale-110"
													/>
													<span
														className={`text-sm ${
															subtask.completed
																? "line-through text-gray-500"
																: "text-gray-800"
														}`}
													>
														{subtask.title}
													</span>
												</div>
												<button
													onClick={() => {
														setTasks((prevTasks) =>
															prevTasks.map((task) =>
																task.id === currentTaskForSubtasks
																	? {
																			...task,
																			subtasks: task.subtasks.filter(
																				(s) => s.id !== subtask.id
																			),
																	  }
																	: task
															)
														);
													}}
													className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer opacity-70 group-hover:opacity-100"
												>
													✕
												</button>
											</div>
										))}
							</div>
							<div className="mt-6 flex justify-end">
								<button
									onClick={() => setIsSubtaskModalOpen(false)}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow transform hover:scale-105"
								>
									Done
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{showNotification && (
				<div className="fixed bottom-4 right-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn flex items-center">
					<span className="mr-2">✓</span>
					{notificationMessage}
				</div>
			)}

			<style jsx global>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeOut {
					from {
						opacity: 1;
						transform: translateY(0);
					}
					to {
						opacity: 0;
						transform: translateY(10px);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out forwards;
				}

				.animate-fadeOut {
					animation: fadeOut 0.3s ease-in forwards;
				}

				.animate-fade-in-out {
					animation: fadeIn 0.3s ease-out forwards,
						fadeOut 0.3s ease-in forwards 2.7s;
				}

				/* Improve scrollbar appearance */
				::-webkit-scrollbar {
					width: 8px;
				}

				::-webkit-scrollbar-track {
					background: #f1f1f1;
					border-radius: 10px;
				}

				::-webkit-scrollbar-thumb {
					background: #c5c5c5;
					border-radius: 10px;
				}

				::-webkit-scrollbar-thumb:hover {
					background: #a0a0a0;
				}

				/* Ensure all buttons have pointer cursor */
				button,
				[role="button"],
				.cursor-pointer {
					cursor: pointer;
				}

				/* Improve focus states for accessibility */
				button:focus,
				input:focus,
				select:focus,
				textarea:focus {
					outline: 2px solid rgba(59, 130, 246, 0.5);
					outline-offset: 2px;
				}

				/* Consistent input styles */
				input,
				select,
				textarea {
					transition: all 0.2s ease;
				}

				@media (max-width: 320px) {
					.container {
						padding-left: 8px;
						padding-right: 8px;
					}

					h1 {
						font-size: 1.5rem;
					}

					button {
						padding-left: 12px;
						padding-right: 12px;
					}
				}
			`}</style>
		</div>
	);
}
