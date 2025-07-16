"use client";

import { useState } from "react";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import {
	Card,
	CardContent,
	Typography,
	Box,
	Button,
	Tabs,
	Tab,
	Chip,
	Avatar,
	LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Poppins } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";
import  DownloadIcon  from "@mui/icons-material/Download";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
	variable: "--font-poppins",
});

const typography = {
	fontFamily: poppins.style.fontFamily,
	h1: {
		fontSize: "2rem",
		fontWeight: 600,
		lineHeight: 1.2,
	},
	h2: {
		fontSize: "1.5rem",
		fontWeight: 600,
		lineHeight: 1.3,
	},
	h3: {
		fontSize: "1.25rem",
		fontWeight: 600,
		lineHeight: 1.4,
	},
	h4: {
		fontSize: "1.125rem",
		fontWeight: 500,
		lineHeight: 1.4,
	},
	body1: {
		fontSize: "1rem",
		fontWeight: 400,
		lineHeight: 1.5,
	},
	body2: {
		fontSize: "0.875rem",
		fontWeight: 400,
		lineHeight: 1.5,
	},
	caption: {
		fontSize: "0.75rem",
		fontWeight: 400,
		lineHeight: 1.5,
	},
};

// Mock data
const mockStudentData = {
	name: "Alex Johnson",
	profilePic: "https://i.pravatar.cc/300?img=12",
	coursesCompleted: 14,
	coursesInProgress: 3,
	overallProgress: 68,
	quizScores: [85, 92, 78, 96, 88, 74, 90],
	timeSpent: [4.2, 5.1, 2.8, 3.5, 6.2, 3.0, 4.5],
	topics: [
		"JavaScript",
		"React",
		"CSS",
		"Node.js",
		"Data Structures",
		"Algorithms",
		"UX Design",
	],
	strengths: ["JavaScript", "React", "UX Design"],
	weaknesses: ["Algorithms", "Data Structures"],
	goals: [
		{ id: 1, text: "Complete React course", deadline: "Nov 30", progress: 65 },
		{
			id: 2,
			text: "Score 90+ on next algorithm quiz",
			deadline: "Nov 15",
			progress: 40,
		},
	],
};

const mockClassData = {
	averageScore: 82,
	averageProgress: 71,
	studentPerformance: [
		{
			id: 1,
			name: "Alex Johnson",
			score: 88,
			progress: 68,
			needsHelp: false,
			avatar: "https://i.pravatar.cc/300?img=12",
		},
		{
			id: 2,
			name: "Taylor Smith",
			score: 65,
			progress: 45,
			needsHelp: true,
			avatar: "https://i.pravatar.cc/300?img=33",
		},
		{
			id: 3,
			name: "Jamie Williams",
			score: 92,
			progress: 85,
			needsHelp: false,
			avatar: "https://i.pravatar.cc/300?img=44",
		},
		{
			id: 4,
			name: "Morgan Brown",
			score: 74,
			progress: 62,
			needsHelp: true,
			avatar: "https://i.pravatar.cc/300?img=47",
		},
		{
			id: 5,
			name: "Casey Jones",
			score: 91,
			progress: 88,
			needsHelp: false,
			avatar: "https://i.pravatar.cc/300?img=68",
		},
	],
	topicCompletionRate: [
		{ topic: "JavaScript", completion: 85, students: 42 },
		{ topic: "React", completion: 78, students: 38 },
		{ topic: "CSS", completion: 92, students: 45 },
		{ topic: "Node.js", completion: 65, students: 32 },
		{ topic: "Data Structures", completion: 58, students: 28 },
		{ topic: "Algorithms", completion: 62, students: 30 },
		{ topic: "UX Design", completion: 74, students: 36 },
	],
};

const weekLabels = [
	"Week 1",
	"Week 2",
	"Week 3",
	"Week 4",
	"Week 5",
	"Week 6",
	"Week 7",
];

const DashboardCard = styled("div")({
	background: "#FFFFFF",
	borderRadius: "20px",
	boxShadow: "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
	padding: "24px",
	marginBottom: "24px",
	display: "flex",
	flexDirection: "column",
	gap: "16px",
	fontFamily: typography.fontFamily,
});

const CardTitle = styled("h2")({
	...typography.h3,
	color: "#2B3674",
	margin: 0,
	fontFamily: typography.fontFamily,
});

const CardSubtitle = styled("p")({
	...typography.body2,
	color: "#707EAE",
	margin: 0,
	fontFamily: typography.fontFamily,
});

const StatValue = styled("span")({
	fontSize: "34px",
	fontWeight: 700,
	color: "#2B3674",
	lineHeight: 1.2,
	fontFamily: typography.fontFamily,
});

const StatLabel = styled("span")({
	...typography.caption,
	color: "#A3AED0",
	marginTop: "4px",
	fontFamily: typography.fontFamily,
});

const StatContainer = styled("div")({
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	fontFamily: typography.fontFamily,
});

export default function LearningAnalyticsExport() {
	const [userRole, setUserRole] = useState("student");
	const [currentTab, setCurrentTab] = useState(0);
	const [isTeacher, setIsTeacher] = useState(false);

	const handleRoleToggle = () => {
		setIsTeacher(!isTeacher);
		setUserRole(userRole === "student" ? "teacher" : "student");
		toast(
			!isTeacher ? "Switched to Teacher Mode" : "Switched to Student Mode",
			{
				icon: "🔄",
				style: {
					background: "#F0FDF4",
					color: "#166534",
				},
			}
		);
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
	};

	const handleViewDetails = () => {
		toast("Opening detailed view...", {
			icon: "ℹ️",
			style: {
				background: "#EEF2FF",
				color: "#4F46E5",
			},
		});
	};

	const handleExport = () => {
		toast("Exporting report...", {
			icon: "📊",
			style: {
				background: "#FEF3C7",
				color: "#92400E",
			},
		});
		// Export logic here
	};

	const handleStudentDetails = (name: string) => {
		toast(`Viewing details for ${name}`, {
			icon: "ℹ️",
			style: {
				background: "#EEF2FF",
				color: "#4F46E5",
			},
		});
	};

	// Theme colors
	const theme = {
		primary: "#4318FF",
		secondary: "#6259FF",
		background: "#ffffff",
		card: "#ffffff",
		text: "#2B3674",
		secondaryText: "#A3AED0",
		border: "#E9EDF7",
		success: "#05CD99",
		error: "#FF5B5B",
		warning: "#FFB547",
	};

	return (
		<div className={`min-h-screen bg-white ${poppins.className}`}>
			<Toaster position="top-right" />
			{/* Header */}
			<header className="sticky top-0 z-50 bg-white shadow-sm">
				<div className="max-w-[1600px] mx-auto px-6 py-4">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-semibold text-black">
							Learning Analytics
						</h1>
						<div className="flex items-center">
							<Button
								variant="contained"
								onClick={handleRoleToggle}
								sx={{
									background: "linear-gradient(to right, #4F46E5, #4338CA)",
									"&:hover": {
										background: "linear-gradient(to right, #4338CA, #3730A3)",
									},
									boxShadow: "none",
									textTransform: "none",
									fontSize: "0.875rem",
									px: 4,
									py: 1.5,
									borderRadius: "0.75rem",
									fontWeight: 500,
									fontFamily: typography.fontFamily,
								}}
							>
								{userRole === "student" ? "Teacher Mode" : "Student Mode"}
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-[1600px] mx-auto px-6 py-8">
				{userRole === "student" ? (
					<div className="space-y-8">
						{/* Student Profile Section */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
									borderRadius: "24px",
									overflow: "hidden",
								}}
							>
								<CardContent sx={{ p: 0 }}>
									<div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-t-[24px]">
										<div className="flex flex-col items-center text-center">
											<Avatar
												src={mockStudentData.profilePic}
												alt={mockStudentData.name}
												sx={{
													width: 88,
													height: 88,
													border: "4px solid white",
													boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
												}}
											/>
											<Typography
												variant="h5"
												sx={{
													color: "#111827",
													fontWeight: 600,
													fontSize: "1.25rem",
													mt: 2,
													mb: 0.5,
													fontFamily: typography.fontFamily,
												}}
											>
												{mockStudentData.name}
											</Typography>
											<Typography
												variant="body2"
												sx={{
													color: "#6B7280",
													mb: 2,
													fontFamily: typography.fontFamily,
												}}
											>
												Computer Science Student
											</Typography>
											<div className="flex flex-wrap gap-1.5 justify-center">
												{mockStudentData.strengths.map((strength) => (
													<Chip
														key={strength}
														label={strength}
														size="small"
														sx={{
															backgroundColor: "white",
															color: "#4F46E5",
															fontWeight: 500,
															fontSize: "0.75rem",
															height: "24px",
															borderRadius: "12px",
															"& .MuiChip-label": {
																px: 2,
																fontFamily: typography.fontFamily,
															},
															cursor: "pointer",
															"&:hover": {
																backgroundColor: "rgba(79, 70, 229, 0.04)",
															},
														}}
														onClick={() =>
															toast(`Strength: ${strength}`, {
																icon: "ℹ️",
																style: {
																	background: "#EEF2FF",
																	color: "#4F46E5",
																},
															})
														}
													/>
												))}
											</div>
										</div>
									</div>
									<div className="p-4">
										<div className="grid grid-cols-3 gap-4 mb-4">
											<div className="text-center">
												<Typography
													variant="h6"
													sx={{
														color: "#4F46E5",
														fontWeight: 600,
														mb: 0.5,
														fontFamily: typography.fontFamily,
													}}
												>
													92%
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: "#6B7280",
														fontFamily: typography.fontFamily,
													}}
												>
													Attendance
												</Typography>
											</div>
											<div className="text-center border-x border-gray-200">
												<Typography
													variant="h6"
													sx={{
														color: "#4F46E5",
														fontWeight: 600,
														mb: 0.5,
														fontFamily: typography.fontFamily,
													}}
												>
													88%
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: "#6B7280",
														fontFamily: typography.fontFamily,
													}}
												>
													Avg. Score
												</Typography>
											</div>
											<div className="text-center">
												<Typography
													variant="h6"
													sx={{
														color: "#4F46E5",
														fontWeight: 600,
														mb: 0.5,
														fontFamily: typography.fontFamily,
													}}
												>
													17
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: "#6B7280",
														fontFamily: typography.fontFamily,
													}}
												>
													Projects
												</Typography>
											</div>
										</div>
										<div className="bg-gray-50 rounded-xl p-3">
											<div className="flex items-center gap-3 mb-2">
												<div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
													<svg
														className="w-4 h-4 text-indigo-600"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
														/>
													</svg>
												</div>
												<div>
													<Typography
														variant="body2"
														sx={{
															color: "#111827",
															fontWeight: 500,
															fontFamily: typography.fontFamily,
														}}
													>
														Current Streak
													</Typography>
													<Typography
														variant="caption"
														sx={{
															color: "#6B7280",
															fontFamily: typography.fontFamily,
														}}
													>
														12 days of continuous learning
													</Typography>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</DashboardCard>

							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
									borderRadius: "24px",
									overflow: "hidden",
								}}
							>
								<CardContent sx={{ p: 0 }}>
									<div className="p-6 border-b border-gray-100">
										<div className="flex items-center justify-between mb-6">
											<Typography
												variant="h6"
												sx={{
													color: "#111827",
													fontWeight: 600,
													fontSize: "1.25rem",
													fontFamily: typography.fontFamily,
												}}
											>
												Course Progress
											</Typography>
											<Chip
												label="Spring 2024"
												size="small"
												sx={{
													backgroundColor: "rgba(79, 70, 229, 0.1)",
													color: "#4F46E5",
													fontWeight: 500,
													fontSize: "0.75rem",
													height: "24px",
													borderRadius: "12px",
													"& .MuiChip-label": {
														px: 2,
														fontFamily: typography.fontFamily,
													},
												}}
											/>
										</div>

										<div className="grid grid-cols-2 gap-4 mb-6">
											<div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-4">
												<div className="flex items-start gap-3">
													<div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
														<svg
															className="w-5 h-5 text-white"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													</div>
													<div className="min-w-0">
														<Typography
															variant="h4"
															sx={{
																color: "#4F46E5",
																fontWeight: 600,
																fontSize: "1.875rem",
																lineHeight: 1,
																mb: 0.5,
																fontFamily: typography.fontFamily,
															}}
														>
															{mockStudentData.coursesCompleted}
														</Typography>
														<Typography
															variant="body2"
															sx={{
																color: "#6B7280",
																whiteSpace: "nowrap",
																overflow: "hidden",
																textOverflow: "ellipsis",
																fontFamily: typography.fontFamily,
															}}
														></Typography>
													</div>
												</div>
												<div className="h-1.5 bg-indigo-200 rounded-full overflow-hidden mt-3">
													<div
														className="h-full bg-indigo-600 rounded-full transition-all duration-500"
														style={{ width: "75%" }}
													/>
												</div>
											</div>

											<div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4">
												<div className="flex items-start gap-3">
													<div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shrink-0">
														<svg
															className="w-5 h-5 text-white"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 6v6m0 0v6m0-6h6m-6 0H6"
															/>
														</svg>
													</div>
													<div className="min-w-0">
														<Typography
															variant="h4"
															sx={{
																color: "#7C3AED",
																fontWeight: 600,
																fontSize: "1.875rem",
																lineHeight: 1,
																mb: 0.5,
																fontFamily: typography.fontFamily,
															}}
														>
															{mockStudentData.coursesInProgress}
														</Typography>
														<Typography
															variant="body2"
															sx={{
																color: "#6B7280",
																whiteSpace: "nowrap",
																overflow: "hidden",
																textOverflow: "ellipsis",
																fontFamily: typography.fontFamily,
															}}
														></Typography>
													</div>
												</div>
												<div className="h-1.5 bg-purple-200 rounded-full overflow-hidden mt-3">
													<div
														className="h-full bg-purple-600 rounded-full transition-all duration-500"
														style={{ width: "25%" }}
													/>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<div>
												<div className="flex items-center justify-between mb-1.5">
													<Typography
														variant="body2"
														sx={{
															color: "#4B5563",
															fontWeight: 500,
															fontFamily: typography.fontFamily,
														}}
													>
														Overall Progress
													</Typography>
													<div className="flex items-center gap-2">
														<div className="flex -space-x-2">
															<div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
																<svg
																	className="w-3 h-3 text-indigo-600"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																		clipRule="evenodd"
																	/>
																</svg>
															</div>
															<div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
																<svg
																	className="w-3 h-3 text-purple-600"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
																		clipRule="evenodd"
																	/>
																</svg>
															</div>
														</div>
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															{mockStudentData.overallProgress}% Complete
														</Typography>
													</div>
												</div>
												<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
													<div
														className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
														style={{
															width: `${mockStudentData.overallProgress}%`,
														}}
													/>
												</div>
											</div>

											<div className="bg-gray-50 rounded-xl p-3">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
														<svg
															className="w-4 h-4 text-green-600"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													</div>
													<div>
														<Typography
															variant="body2"
															sx={{
																color: "#111827",
																fontWeight: 500,
																fontFamily: typography.fontFamily,
															}}
														>
															Estimated Completion
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															On track to finish by June 2024
														</Typography>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 rounded-full bg-green-500"></div>
												<Typography
													variant="caption"
													sx={{
														color: "#6B7280",
														fontFamily: typography.fontFamily,
													}}
												>
													Last updated 2 hours ago
												</Typography>
											</div>
											<Button
												size="small"
												onClick={handleViewDetails}
												sx={{
													color: "#4F46E5",
													fontSize: "0.75rem",
													textTransform: "none",
													fontWeight: 500,
													"&:hover": {
														backgroundColor: "rgba(79, 70, 229, 0.04)",
													},
													fontFamily: typography.fontFamily,
												}}
											>
												View Details
											</Button>
										</div>
									</div>
								</CardContent>
							</DashboardCard>

							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
									borderRadius: "24px",
									overflow: "hidden",
								}}
							>
								<CardContent sx={{ p: 4 }}>
									<Typography
										variant="h6"
										sx={{
											color: "#111827",
											fontWeight: 600,
											fontSize: "1.25rem",
											mb: 4,
											fontFamily: typography.fontFamily,
										}}
									>
										Learning Goals
									</Typography>
									<div className="space-y-4">
										{mockStudentData.goals.map((goal) => (
											<div key={goal.id} className="bg-gray-50 rounded-2xl p-4">
												<div className="flex items-start justify-between mb-3">
													<div className="flex-1">
														<Typography
															variant="body1"
															sx={{
																color: "#111827",
																fontWeight: 500,
																mb: 0.5,
																fontFamily: typography.fontFamily,
															}}
														>
															{goal.text}
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															Due: {goal.deadline}
														</Typography>
													</div>
													<Chip
														label={
															goal.progress >= 50 ? "On Track" : "In Progress"
														}
														onClick={() =>
															toast(
																`Goal Status: ${goal.progress}% completed`,
																{
																	icon: "ℹ️",
																	style: {
																		background: "#EEF2FF",
																		color: "#4F46E5",
																	},
																}
															)
														}
														size="small"
														sx={{
															backgroundColor:
																goal.progress >= 50
																	? "rgba(16, 185, 129, 0.1)"
																	: "rgba(245, 158, 11, 0.1)",
															color:
																goal.progress >= 50 ? "#059669" : "#D97706",
															fontWeight: 500,
															fontSize: "0.75rem",
															height: "24px",
															borderRadius: "12px",
															"& .MuiChip-label": {
																px: 2,
																fontFamily: typography.fontFamily,
															},
															cursor: "pointer",
															"&:hover": {
																opacity: 0.8,
															},
														}}
													/>
												</div>
												<div className="space-y-1">
													<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
														<div
															className={`h-full rounded-full transition-all duration-500 ${
																goal.progress >= 50
																	? "bg-emerald-500"
																	: "bg-amber-500"
															}`}
															style={{ width: `${goal.progress}%` }}
														/>
													</div>
													<Typography
														variant="caption"
														sx={{
															color: "#6B7280",
															display: "block",
															textAlign: "right",
															fontFamily: typography.fontFamily,
														}}
													>
														{goal.progress}% Complete
													</Typography>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</DashboardCard>
						</div>

						{/* Time Spent Charts Section */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
									borderRadius: "16px",
									overflow: "hidden",
								}}
							>
								<CardContent>
									<Typography
										variant="h6"
										sx={{
											color: "#1F2937",
											fontWeight: 600,
											mb: 4,
											fontFamily: typography.fontFamily,
										}}
									>
										Hours Spent Per Week
									</Typography>
									<div style={{ height: 260, margin: "0 -16px" }}>
										<BarChart
											series={[
												{
													data: mockStudentData.timeSpent,
													label: "Hours",
													color: "#6366F1",
													valueFormatter: (value) => `${value}h`,
												},
											]}
											xAxis={[
												{
													scaleType: "band",
													data: weekLabels,
													tickLabelStyle: {
														fill: "#6B7280",
														fontSize: 12,
														fontFamily: typography.fontFamily,
													},
												},
											]}
											yAxis={[
												{
													tickLabelStyle: {
														fontFamily: typography.fontFamily,
													},
												},
											]}
											height={260}
											margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
											sx={{
												"& .MuiChartsAxis-line": {
													stroke: "#E5E7EB",
												},
												"& .MuiChartsAxis-tick": {
													stroke: "#E5E7EB",
												},
												"& .MuiBarElement-root": {
													filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
													"&:hover": {
														filter:
															"brightness(0.9) drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
													},
												},
												"& text": {
													fontFamily: typography.fontFamily,
												},
											}}
										/>
									</div>
								</CardContent>
							</DashboardCard>

							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
									borderRadius: "16px",
									overflow: "hidden",
								}}
							>
								<CardContent>
									<Typography
										variant="h6"
										sx={{
											color: "#1F2937",
											fontWeight: 600,
											mb: 4,
											fontFamily: typography.fontFamily,
										}}
									>
										Time Distribution By Topic
									</Typography>
									<div
										style={{
											height: 260,
											display: "flex",
											justifyContent: "center",
											margin: "0 -16px",
										}}
									>
										<PieChart
											series={[
												{
													data: mockStudentData.topics.map((topic, i) => ({
														id: i,
														value: mockStudentData.timeSpent[i],
														label: topic,
														color: [
															"#6366F1",
															"#8B5CF6",
															"#EC4899",
															"#F59E0B",
															"#10B981",
															"#3B82F6",
															"#6366F1",
														][i],
													})),
													innerRadius: 60,
													paddingAngle: 2,
													cornerRadius: 4,
													highlightScope: { fade: "global", highlight: "item" },
												},
											]}
											slotProps={{
												legend: {
													position: { vertical: "middle", horizontal: "end" },
												},
											}}
											height={260}
											margin={{ top: 20, bottom: 30, left: 20, right: 120 }}
											sx={{
												"& .MuiChartsLegend-label": {
													fill: "#4B5563",
													fontSize: "0.75rem",
													fontWeight: 500,
													fontFamily: typography.fontFamily,
												},
												"& .MuiChartsLegend-mark": {
													borderRadius: "50%",
													transform: "scale(1.2)",
												},
												"& text": {
													fontFamily: typography.fontFamily,
												},
											}}
										/>
									</div>
								</CardContent>
							</DashboardCard>
						</div>

						{/* Performance Charts */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
									borderRadius: "16px",
									overflow: "hidden",
								}}
							>
								<CardContent>
									<Typography
										variant="h6"
										sx={{
											color: "#1F2937",
											fontWeight: 600,
											mb: 4,
											fontFamily: typography.fontFamily,
										}}
									>
										Quiz Performance
									</Typography>
									<div style={{ height: 300 }}>
										<LineChart
											series={[
												{
													data: mockStudentData.quizScores,
													label: "Score",
													color: "#6366F1",
													curve: "natural",
													area: true,
												},
											]}
											xAxis={[
												{
													scaleType: "point",
													data: weekLabels,
													tickLabelStyle: {
														fontSize: 12,
														fill: "#6B7280",
													},
												},
											]}
											yAxis={[
												{
													min: 0,
													max: 100,
													tickLabelStyle: {
														fontSize: 12,
														fill: "#6B7280",
													},
												},
											]}
											height={300}
											margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
											sx={{
												"& .MuiChartsAxis-line": {
													stroke: "#E5E7EB",
												},
												"& .MuiChartsAxis-tick": {
													stroke: "#E5E7EB",
												},
												"& .MuiAreaElement-root": {
													fill: "url(#gradient)",
													opacity: 0.2,
												},
											}}
										>
											<defs>
												<linearGradient
													id="gradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="0%"
														stopColor="#6366F1"
														stopOpacity={0.4}
													/>
													<stop
														offset="100%"
														stopColor="#6366F1"
														stopOpacity={0}
													/>
												</linearGradient>
											</defs>
										</LineChart>
									</div>
								</CardContent>
							</DashboardCard>

							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
									borderRadius: "16px",
									overflow: "hidden",
								}}
							>
								<CardContent>
									<Typography
										variant="h6"
										sx={{
											color: "#1F2937",
											fontWeight: 600,
											mb: 4,
											fontFamily: typography.fontFamily,
										}}
									>
										Topic Proficiency
									</Typography>
									<div style={{ height: 300 }}>
										<BarChart
											series={[
												{
													data: mockStudentData.quizScores,
													label: "Proficiency",
													color: "#6366F1",
													valueFormatter: (value) => `${value}%`,
												},
											]}
											xAxis={[
												{
													scaleType: "band",
													data: mockStudentData.topics,
													tickLabelStyle: {
														fontSize: 11,
														fill: "#6B7280",
														angle: -45,
														textAnchor: "end",
														dominantBaseline: "text-before-edge",
														fontFamily: typography.fontFamily,
													},
												},
											]}
											height={300}
											margin={{ top: 20, bottom: 50, left: 40, right: 20 }}
											sx={{
												"& .MuiChartsAxis-line": {
													stroke: "#E5E7EB",
												},
												"& .MuiChartsAxis-tick": {
													stroke: "#E5E7EB",
												},
												"& .MuiBarElement-root": {
													filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
													"&:hover": {
														filter:
															"brightness(0.9) drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
													},
												},
											}}
										/>
									</div>
								</CardContent>
							</DashboardCard>
						</div>

						{/* Insights Section */}
						<div className="grid grid-cols-1 gap-6">
							<DashboardCard
								sx={{
									background:
										"linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
									border: "1px solid #C7D2FE",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
									borderRadius: "16px",
									overflow: "hidden",
								}}
							>
								<CardContent>
									<div className="flex items-start gap-4 mb-6">
										<div className="p-3 bg-indigo-600 rounded-lg">
											<svg
												className="w-6 h-6 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
												/>
											</svg>
										</div>
										<div>
											<Typography
												variant="h6"
												sx={{
													color: "#1F2937",
													fontWeight: 600,
													mb: 1,
													fontFamily: typography.fontFamily,
												}}
											>
												Learning Insights
											</Typography>
											<Typography
												variant="body2"
												sx={{
													color: "#6B7280",
													fontFamily: typography.fontFamily,
												}}
											>
												Personalized recommendations based on your learning
												patterns
											</Typography>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<div className="bg-white p-4 rounded-xl shadow-sm">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
													<svg
														className="w-4 h-4 text-green-600"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												</div>
												<Typography
													sx={{
														color: "#1F2937",
														fontWeight: 600,
														fontFamily: typography.fontFamily,
													}}
												>
													Peak Performance
												</Typography>
											</div>
											<Typography
												variant="body2"
												sx={{
													color: "#6B7280",
													fontFamily: typography.fontFamily,
												}}
											>
												Your best learning hours are between 6-8 PM. Schedule
												focused study sessions during this time.
											</Typography>
										</div>

										<div className="bg-white p-4 rounded-xl shadow-sm">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
													<svg
														className="w-4 h-4 text-blue-600"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
														/>
													</svg>
												</div>
												<Typography
													sx={{
														color: "#1F2937",
														fontWeight: 600,
														fontFamily: typography.fontFamily,
													}}
												>
													Learning Style
												</Typography>
											</div>
											<Typography
												variant="body2"
												sx={{
													color: "#6B7280",
													fontFamily: typography.fontFamily,
												}}
											>
												Interactive exercises improve your retention. Focus on
												hands-on practice sessions.
											</Typography>
										</div>

										<div className="bg-white p-4 rounded-xl shadow-sm">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
													<svg
														className="w-4 h-4 text-purple-600"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M13 10V3L4 14h7v7l9-11h-7z"
														/>
													</svg>
												</div>
												<Typography
													sx={{
														color: "#1F2937",
														fontWeight: 600,
														fontFamily: typography.fontFamily,
													}}
												>
													Next Steps
												</Typography>
											</div>
											<Typography
												variant="body2"
												sx={{
													color: "#6B7280",
													fontFamily: typography.fontFamily,
												}}
											>
												Consider taking advanced modules in React and Node.js
												based on your progress.
											</Typography>
										</div>
									</div>
								</CardContent>
							</DashboardCard>
						</div>
					</div>
				) : (
					<div className="space-y-8">
						{/* Teacher Dashboard */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
									borderRadius: "24px",
								}}
							>
								<CardContent sx={{ p: 0 }}>
									<div className="p-8">
										<Typography
											variant="h6"
											sx={{
												color: "#1F2937",
												fontWeight: 600,
												mb: 6,
												fontSize: "1.5rem",
												fontFamily: typography.fontFamily,
											}}
										>
											Class Overview
										</Typography>
										<div className="grid grid-cols-1 gap-8">
											{/* Quiz Score Card */}
											<div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-100 transition-all duration-300 shadow-sm hover:shadow-md">
												<div className="flex items-center justify-between">
													<div className="space-y-1">
														<Typography
															variant="body2"
															sx={{
																color: "#6B7280",
																fontSize: "0.875rem",
																fontWeight: 500,
																fontFamily: typography.fontFamily,
																mb: 1,
															}}
														>
															Average Quiz Score
														</Typography>
														<div className="flex items-baseline gap-3">
															<Typography
																variant="h3"
																sx={{
																	color: "#4F46E5",
																	fontWeight: 600,
																	fontSize: "2.5rem",
																	lineHeight: 1,
																	fontFamily: typography.fontFamily,
																}}
															>
																{mockClassData.averageScore}%
															</Typography>
															<div className="flex items-center text-emerald-500 text-sm font-medium">
																<svg
																	className="w-4 h-4 mr-0.5"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
																	/>
																</svg>
																5.2%
															</div>
														</div>
													</div>
													<div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
														<svg
															className="w-6 h-6 text-indigo-600"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
															/>
														</svg>
													</div>
												</div>
												<div className="mt-6 space-y-3">
													<div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
														<div
															className="h-full bg-indigo-600 rounded-full transition-all duration-500"
															style={{
																width: `${mockClassData.averageScore}%`,
															}}
														/>
													</div>
													<div className="flex justify-between items-center text-sm">
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															Previous: 78%
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															Target: 85%
														</Typography>
													</div>
												</div>
											</div>

											{/* Progress Card */}
											<div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple-100 transition-all duration-300 shadow-sm hover:shadow-md">
												<div className="flex items-center justify-between">
													<div className="space-y-1">
														<Typography
															variant="body2"
															sx={{
																color: "#6B7280",
																fontSize: "0.875rem",
																fontWeight: 500,
																fontFamily: typography.fontFamily,
																mb: 1,
															}}
														>
															Average Progress
														</Typography>
														<div className="flex items-baseline gap-3">
															<Typography
																variant="h3"
																sx={{
																	color: "#7C3AED",
																	fontWeight: 600,
																	fontSize: "2.5rem",
																	lineHeight: 1,
																	fontFamily: typography.fontFamily,
																}}
															>
																{mockClassData.averageProgress}%
															</Typography>
															<div className="flex items-center text-emerald-500 text-sm font-medium">
																<svg
																	className="w-4 h-4 mr-0.5"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
																	/>
																</svg>
																3.8%
															</div>
														</div>
													</div>
													<div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
														<svg
															className="w-6 h-6 text-purple-600"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
															/>
														</svg>
													</div>
												</div>
												<div className="mt-6 space-y-3">
													<div className="h-2 bg-purple-50 rounded-full overflow-hidden">
														<div
															className="h-full bg-purple-600 rounded-full transition-all duration-500"
															style={{
																width: `${mockClassData.averageProgress}%`,
															}}
														/>
													</div>
													<div className="flex justify-between items-center text-sm">
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															Previous: 68%
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															Target: 80%
														</Typography>
													</div>
												</div>
											</div>

											{/* Time Spent Card */}
											<div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-amber-100 transition-all duration-300 shadow-sm hover:shadow-md">
												<div className="flex items-center justify-between">
													<div className="space-y-1">
														<Typography
															variant="body2"
															sx={{
																color: "#6B7280",
																fontSize: "0.875rem",
																fontWeight: 500,
																fontFamily: typography.fontFamily,
																mb: 1,
															}}
														>
															Time Spent
														</Typography>
														<div className="flex items-baseline gap-3">
															<Typography
																variant="h3"
																sx={{
																	color: "#D97706",
																	fontWeight: 600,
																	fontSize: "2.5rem",
																	lineHeight: 1,
																	fontFamily: typography.fontFamily,
																}}
															>
																24.3h
															</Typography>
															<div className="flex items-center text-emerald-500 text-sm font-medium">
																<svg
																	className="w-4 h-4 mr-0.5"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
																	/>
																</svg>
																7.2%
															</div>
														</div>
													</div>
													<div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
														<svg
															className="w-6 h-6 text-amber-600"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													</div>
												</div>
												<div className="mt-6 space-y-3">
													<div className="h-2 bg-amber-50 rounded-full overflow-hidden">
														<div
															className="h-full bg-amber-500 rounded-full transition-all duration-500"
															style={{ width: "75%" }}
														/>
													</div>
													<div className="flex justify-between items-center text-sm">
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															Previous: 21.5h
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: "#6B7280",
																fontFamily: typography.fontFamily,
															}}
														>
															Weekly avg: 22.8h
														</Typography>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="px-8 py-4 bg-gray-50 rounded-b-[24px] border-t border-gray-100">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-green-500"></div>
											<Typography
												variant="caption"
												sx={{
													color: "#6B7280",
													fontFamily: typography.fontFamily,
												}}
											>
												Last updated 2 hours ago
											</Typography>
										</div>
									</div>
								</CardContent>
							</DashboardCard>

							<DashboardCard
								sx={{
									background: "white",
									border: "1px solid #E5E7EB",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
									borderRadius: "24px",
									gridColumn: "span 2",
								}}
							>
								<CardContent sx={{ p: 0 }}>
									<div className="p-6">
										<div className="flex items-center justify-between mb-6">
											<Typography
												variant="h6"
												sx={{
													color: "#1F2937",
													fontWeight: 600,
													fontFamily: typography.fontFamily,
												}}
											>
												Topic Completion Rate
											</Typography>
											<Chip
												label="Spring 2024"
												size="small"
												sx={{
													backgroundColor: "rgba(79, 70, 229, 0.1)",
													color: "#4F46E5",
													fontWeight: 500,
													fontSize: "0.75rem",
													height: "24px",
													borderRadius: "12px",
													"& .MuiChip-label": {
														px: 2,
														fontFamily: typography.fontFamily,
													},
												}}
											/>
										</div>
										<div style={{ height: 240, margin: "0 -16px" }}>
											<BarChart
												series={[
													{
														data: mockClassData.topicCompletionRate.map(
															(item) => item.completion
														),
														label: "Completion %",
														color: "#4F46E5",
														valueFormatter: (value) => `${value}%`,
													},
													{
														data: mockClassData.topicCompletionRate.map(
															(item) => item.students
														),
														label: "Students",
														color: "#818CF8",
														valueFormatter: (value) => `${value} students`,
													},
												]}
												xAxis={[
													{
														scaleType: "band",
														data: mockClassData.topicCompletionRate.map(
															(item) => item.topic
														),
														tickLabelStyle: {
															fill: "#6B7280",
															fontSize: 12,
															angle: -45,
															textAnchor: "end",
															dominantBaseline: "text-before-edge",
															fontFamily: typography.fontFamily,
														},
													},
												]}
												yAxis={[
													{
														tickLabelStyle: {
															fontFamily: typography.fontFamily,
														},
													},
												]}
												height={240}
												margin={{ top: 32, bottom: 50, left: 40, right: 20 }}
												sx={{
													"& .MuiChartsAxis-line": {
														stroke: "#E5E7EB",
													},
													"& .MuiChartsAxis-tick": {
														stroke: "#E5E7EB",
													},
													"& .MuiBarElement-root": {
														filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
														"&:hover": {
															filter:
																"brightness(0.9) drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
														},
													},
													"& text": {
														fontFamily: typography.fontFamily,
													},
												}}
											/>
										</div>

										<div className="mt-16 pt-12 border-t border-gray-100">
											<div className="flex items-center justify-between mb-6">
												<Typography
													variant="h6"
													sx={{
														color: "#1F2937",
														fontWeight: 600,
														fontFamily: typography.fontFamily,
													}}
												>
													Weekly Progress Trend
												</Typography>
												<Chip
													label="Spring 2024"
													size="small"
													sx={{
														backgroundColor: "rgba(79, 70, 229, 0.1)",
														color: "#4F46E5",
														fontWeight: 500,
														fontSize: "0.75rem",
														height: "24px",
														borderRadius: "12px",
														"& .MuiChip-label": {
															px: 2,
															fontFamily: typography.fontFamily,
														},
													}}
												/>
											</div>
											<div style={{ height: 200, margin: "0 -16px" }}>
												<LineChart
													series={[
														{
															data: [55, 68, 62, 78, 71, 85, 76],
															label: "Completion Rate",
															color: "#4F46E5",
															curve: "natural",
															area: true,
															showMark: true,
														},
														{
															data: [60, 65, 70, 75, 75, 80, 80],
															label: "Target",
															color: "#10B981",
															curve: "natural",
															area: false,
															showMark: true,
														},
													]}
													xAxis={[
														{
															scaleType: "point",
															data: weekLabels,
															tickLabelStyle: {
																fontSize: 12,
																fill: "#6B7280",
																fontFamily: typography.fontFamily,
															},
														},
													]}
													yAxis={[
														{
															min: 40,
															max: 100,
															tickLabelStyle: {
																fontSize: 12,
																fill: "#6B7280",
																fontFamily: typography.fontFamily,
															},
														},
													]}
													height={200}
													margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
													sx={{
														"& .MuiChartsAxis-line": {
															stroke: "#E5E7EB",
														},
														"& .MuiChartsAxis-tick": {
															stroke: "#E5E7EB",
														},
														"& .MuiAreaElement-root": {
															fill: "url(#gradient)",
															opacity: 0.1,
														},
														"& .MuiLineElement-root": {
															strokeWidth: 2,
															'&[data-index="1"]': {
																strokeDasharray: "5 5",
															},
														},
														"& .MuiMarkElement-root": {
															stroke: "#fff",
															strokeWidth: 2,
															fill: "currentColor",
														},
													}}
												>
													<defs>
														<linearGradient
															id="gradient"
															x1="0"
															y1="0"
															x2="0"
															y2="1"
														>
															<stop
																offset="0%"
																stopColor="#4F46E5"
																stopOpacity={0.4}
															/>
															<stop
																offset="100%"
																stopColor="#4F46E5"
																stopOpacity={0}
															/>
														</linearGradient>
													</defs>
												</LineChart>
											</div>
										</div>
									</div>
								</CardContent>
							</DashboardCard>
						</div>

						<DashboardCard
							sx={{
								background: "white",
								border: "1px solid #E5E7EB",
								boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
								borderRadius: "24px",
							}}
						>
							<CardContent sx={{ p: 0 }}>
								<div className="p-6">
									<div className="flex items-center justify-between mb-6">
										<Typography
											variant="h6"
											sx={{
												color: "#1F2937",
												fontWeight: 600,
												fontFamily: typography.fontFamily,
											}}
										>
											Student Performance
										</Typography>
										<Button
											variant="outlined"
											size="small"
											onClick={handleExport}
											startIcon={<DownloadIcon />}
											sx={{
												borderColor: "#E5E7EB",
												color: "#6B7280",
												"&:hover": {
													borderColor: "#4F46E5",
													color: "#4F46E5",
													backgroundColor: "rgba(79, 70, 229, 0.04)",
												},
												textTransform: "none",
												borderRadius: "8px",
												fontFamily: typography.fontFamily,
											}}
										>
											Export Report
										</Button>
									</div>
									<div className="overflow-x-auto">
										<table className="min-w-full">
											<thead>
												<tr className="border-b border-gray-200">
													<th
														className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														style={{ fontFamily: typography.fontFamily }}
													>
														Student
													</th>
													<th
														className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														style={{ fontFamily: typography.fontFamily }}
													>
														Quiz Score
													</th>
													<th
														className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														style={{ fontFamily: typography.fontFamily }}
													>
														Progress
													</th>
													<th
														className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														style={{ fontFamily: typography.fontFamily }}
													>
														Status
													</th>
													<th
														className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														style={{ fontFamily: typography.fontFamily }}
													>
														Action
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200">
												{mockClassData.studentPerformance.map((student) => (
													<tr
														key={student.id}
														className="hover:bg-gray-50/50 transition-colors"
													>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<Avatar
																	src={student.avatar}
																	sx={{
																		width: 36,
																		height: 36,
																		mr: 2,
																		bgcolor:
																			student.score >= 85
																				? "#4F46E5"
																				: "#6B7280",
																		fontSize: "0.875rem",
																		fontFamily: typography.fontFamily,
																	}}
																>
																	{student.name.charAt(0)}
																</Avatar>
																<div>
																	<Typography
																		sx={{
																			color: "#1F2937",
																			fontWeight: 500,
																			fontSize: "0.875rem",
																			fontFamily: typography.fontFamily,
																		}}
																	>
																		{student.name}
																	</Typography>
																	<Typography
																		variant="caption"
																		sx={{
																			color: "#6B7280",
																			fontFamily: typography.fontFamily,
																		}}
																	>
																		ID: {student.id}
																	</Typography>
																</div>
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center gap-2">
																<Typography
																	sx={{
																		color:
																			student.score >= 85
																				? "#059669"
																				: "#6B7280",
																		fontWeight: 500,
																		fontFamily: typography.fontFamily,
																	}}
																>
																	{student.score}%
																</Typography>
																{student.score >= 85 && (
																	<svg
																		className="w-4 h-4 text-emerald-500"
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path
																			fillRule="evenodd"
																			d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																			clipRule="evenodd"
																		/>
																	</svg>
																)}
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<Box
																sx={{
																	display: "flex",
																	alignItems: "center",
																	width: "200px",
																}}
															>
																<Box sx={{ width: "100%", mr: 1 }}>
																	<LinearProgress
																		variant="determinate"
																		value={student.progress}
																		sx={{
																			height: 6,
																			borderRadius: 3,
																			backgroundColor: "rgba(79, 70, 229, 0.1)",
																			"& .MuiLinearProgress-bar": {
																				backgroundColor:
																					student.progress >= 75
																						? "#059669"
																						: "#4F46E5",
																				borderRadius: 3,
																			},
																		}}
																	/>
																</Box>
																<Box sx={{ minWidth: 35 }}>
																	<Typography
																		variant="caption"
																		sx={{
																			color: "#6B7280",
																			fontFamily: typography.fontFamily,
																		}}
																	>
																		{student.progress}%
																	</Typography>
																</Box>
															</Box>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<Chip
																label={
																	student.needsHelp ? "Needs Help" : "On Track"
																}
																size="small"
																sx={{
																	backgroundColor: student.needsHelp
																		? "rgba(239, 68, 68, 0.1)"
																		: "rgba(16, 185, 129, 0.1)",
																	color: student.needsHelp
																		? "#DC2626"
																		: "#059669",
																	fontWeight: 500,
																	fontSize: "0.75rem",
																	height: "24px",
																	"& .MuiChip-label": {
																		px: 2,
																		fontFamily: typography.fontFamily,
																	},
																	borderRadius: "6px",
																}}
															/>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<Button
																variant="outlined"
																size="small"
																onClick={() =>
																	handleStudentDetails(student.name)
																}
																sx={{
																	borderColor: "#E5E7EB",
																	color: "#4F46E5",
																	"&:hover": {
																		borderColor: "#4F46E5",
																		backgroundColor: "rgba(79, 70, 229, 0.04)",
																	},
																	borderRadius: "8px",
																	textTransform: "none",
																	fontWeight: 500,
																	fontSize: "0.75rem",
																	fontFamily: typography.fontFamily,
																}}
															>
																View Details
															</Button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</CardContent>
						</DashboardCard>
					</div>
				)}
			</main>
		</div>
	);
}
