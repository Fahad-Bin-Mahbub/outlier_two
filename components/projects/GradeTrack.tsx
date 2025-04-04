"use client";
import React, { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {
	Bell,
	User,
	Book,
	Filter,
	ChevronDown,
	PieChart,
	BarChart2,
	Award,
	AlertTriangle,
} from "lucide-react";

type GradeLevel = 9 | 10 | 11 | 12;
type Subject = "Math" | "Science" | "English" | "History" | "Art";

interface Student {
	id: number;
	name: string;
	gradeLevel: GradeLevel;
	avatar: string;
	grades: Record<Subject, number>;
}

interface ToastMessage {
	id: number;
	message: string;
	type: "success" | "error" | "info";
}

const subjects: Subject[] = ["Math", "Science", "English", "History", "Art"];

const generateRandomGrade = (): number => {
	return Math.floor(Math.random() * 51) + 50;
};

const generateMockStudents = (count: number): Student[] => {
	const students: Student[] = [];

	for (let i = 1; i <= count; i++) {
		const gradeLevel = (Math.floor(Math.random() * 4) + 9) as GradeLevel;
		const grades: Record<Subject, number> = {
			Math: generateRandomGrade(),
			Science: generateRandomGrade(),
			English: generateRandomGrade(),
			History: generateRandomGrade(),
			Art: generateRandomGrade(),
		};

		students.push({
			id: i,
			name: `Student ${i}`,
			gradeLevel,
			avatar: `https://img.freepik.com/premium-vector/young-boy-with-school-uniform_505024-1318.jpg?w=1380`,
			grades,
		});
	}

	return students;
};

const getGradeDistribution = (students: Student[], subject: Subject) => {
	const distribution = Array(10).fill(0);

	students.forEach((student) => {
		const grade = student.grades[subject];
		const binIndex = Math.min(Math.floor(grade / 10), 9);
		distribution[binIndex]++;
	});

	return distribution.map((count, index) => ({
		range: `${index * 10}-${index * 10 + 9}`,
		count,
	}));
};

const calculateAverage = (students: Student[], subject: Subject) => {
	if (students.length === 0) return 0;
	const sum = students.reduce(
		(total, student) => total + student.grades[subject],
		0
	);
	return Math.round((sum / students.length) * 10) / 10;
};

const getTopPerformers = (
	students: Student[],
	subject?: Subject,
	count: number = 5
) => {
	if (subject) {
		return [...students]
			.sort((a, b) => b.grades[subject] - a.grades[subject])
			.slice(0, count);
	}

	return [...students]
		.map((student) => ({
			...student,
			averageGrade:
				Object.values(student.grades).reduce((sum, grade) => sum + grade, 0) /
				subjects.length,
		}))
		.sort((a, b) => b.averageGrade - a.averageGrade)
		.slice(0, count);
};

const getLowPerformers = (
	students: Student[],
	subject?: Subject,
	count: number = 5
) => {
	if (subject) {
		return [...students]
			.sort((a, b) => a.grades[subject] - b.grades[subject])
			.slice(0, count);
	}

	return [...students]
		.map((student) => ({
			...student,
			averageGrade:
				Object.values(student.grades).reduce((sum, grade) => sum + grade, 0) /
				subjects.length,
		}))
		.sort((a, b) => a.averageGrade - b.averageGrade)
		.slice(0, count);
};

const GradeTrack = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
	const [selectedSubject, setSelectedSubject] = useState<Subject>("Math");
	const [selectedGradeLevel, setSelectedGradeLevel] =
		useState<GradeLevel | null>(null);
	const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
	const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
	const [isGradeLevelDropdownOpen, setIsGradeLevelDropdownOpen] =
		useState(false);
	const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
	const [toasts, setToasts] = useState<ToastMessage[]>([]);
	const [toastIdCounter, setToastIdCounter] = useState(1);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	useEffect(() => {
		const mockData = generateMockStudents(50);
		setStudents(mockData);
		setFilteredStudents(mockData);
	}, []);

	useEffect(() => {
		let filtered = [...students];

		if (selectedGradeLevel) {
			filtered = filtered.filter(
				(student) => student.gradeLevel === selectedGradeLevel
			);
		}

		if (selectedStudent) {
			filtered = filtered.filter((student) => student.id === selectedStudent);
		}

		setFilteredStudents(filtered);
	}, [students, selectedSubject, selectedGradeLevel, selectedStudent]);

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		const newToast = {
			id: toastIdCounter,
			message,
			type,
		};

		setToasts((prev) => [...prev, newToast]);
		setToastIdCounter((prev) => prev + 1);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
		}, 3000);
	};

	const handleNonFunctionalClick = (action: string) => {
		showToast(`${action} functionality is not implemented yet`, "info");
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="flex h-screen bg-gray-50 text-gray-800">
			<div
				className={`${
					isSidebarOpen ? "w-64" : "w-20"
				} bg-white shadow-md transition-all duration-300 flex flex-col`}
			>
				<div className="p-4 flex items-center justify-between border-b border-b-gray-200">
					<h1
						className={`font-bold text-xl text-blue-600 ${
							!isSidebarOpen && "hidden"
						}`}
					>
						GradeTrack
					</h1>
					<button
						onClick={toggleSidebar}
						className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
					>
						<div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
						<div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
						<div className="w-6 h-0.5 bg-gray-600"></div>
					</button>
				</div>

				<nav className="flex-1 p-4">
					<ul>
						<li className="mb-2">
							<button className="w-full p-3 flex items-center rounded-lg bg-blue-50 text-blue-600 cursor-pointer">
								<BarChart2 size={20} />
								{isSidebarOpen && <span className="ml-3">Dashboard</span>}
							</button>
						</li>
						<li className="mb-2">
							<button
								onClick={() => handleNonFunctionalClick("Students")}
								className="w-full p-3 flex items-center rounded-lg hover:bg-gray-100 cursor-pointer"
							>
								<User size={20} />
								{isSidebarOpen && <span className="ml-3">Students</span>}
							</button>
						</li>
						<li className="mb-2">
							<button
								onClick={() => handleNonFunctionalClick("Subjects")}
								className="w-full p-3 flex items-center rounded-lg hover:bg-gray-100 cursor-pointer"
							>
								<Book size={20} />
								{isSidebarOpen && <span className="ml-3">Subjects</span>}
							</button>
						</li>
						<li className="mb-2">
							<button
								onClick={() => handleNonFunctionalClick("Reports")}
								className="w-full p-3 flex items-center rounded-lg hover:bg-gray-100 cursor-pointer"
							>
								<PieChart size={20} />
								{isSidebarOpen && <span className="ml-3">Reports</span>}
							</button>
						</li>
					</ul>
				</nav>

				<div className="p-4 border-t border-t-gray-200">
					<button
						onClick={() => handleNonFunctionalClick("Settings")}
						className="w-full p-3 flex items-center rounded-lg hover:bg-gray-100 cursor-pointer"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							></path>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
						</svg>
						{isSidebarOpen && <span className="ml-3">Settings</span>}
					</button>
				</div>
			</div>

			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="bg-white shadow-sm z-10">
					<div className="flex items-center justify-between p-4">
						<div className="flex items-center">
							<h2 className="text-xl font-semibold">
								Student Performance Dashboard
							</h2>
						</div>
						<div className="flex items-center">
							<button
								onClick={() => handleNonFunctionalClick("Notifications")}
								className="p-2 rounded-full hover:bg-gray-100 relative cursor-pointer mr-2"
							>
								<Bell size={20} />
								<span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
							</button>
							<button
								onClick={() => handleNonFunctionalClick("Profile")}
								className="flex items-center cursor-pointer"
							>
								<img
									src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									alt="Profile"
									className="w-8 h-8 rounded-full"
								/>
								<span className="ml-2 font-medium hidden md:block">
									Ms. Johnson
								</span>
							</button>
						</div>
					</div>

					<div className="bg-white border-t border-b border-b-gray-200 border-t-gray-200 p-4 flex flex-wrap items-center gap-4">
						<div className="flex items-center">
							<span className="mr-2 text-sm font-semibold">Filters:</span>
							<Filter size={16} />
						</div>

						<div className="relative">
							<button
								onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
								className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
							>
								<span>Subject: {selectedSubject}</span>
								<ChevronDown size={16} className="ml-2" />
							</button>
							{isSubjectDropdownOpen && (
								<div className="absolute mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 w-36">
									{subjects.map((subject) => (
										<button
											key={subject}
											onClick={() => {
												setSelectedSubject(subject);
												setIsSubjectDropdownOpen(false);
											}}
											className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
										>
											{subject}
										</button>
									))}
								</div>
							)}
						</div>

						<div className="relative">
							<button
								onClick={() =>
									setIsGradeLevelDropdownOpen(!isGradeLevelDropdownOpen)
								}
								className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
							>
								<span>Grade Level: {selectedGradeLevel || "All"}</span>
								<ChevronDown size={16} className="ml-2" />
							</button>
							{isGradeLevelDropdownOpen && (
								<div className="absolute mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 w-36">
									<button
										onClick={() => {
											setSelectedGradeLevel(null);
											setIsGradeLevelDropdownOpen(false);
										}}
										className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
									>
										All
									</button>
									{[9, 10, 11, 12].map((level) => (
										<button
											key={level}
											onClick={() => {
												setSelectedGradeLevel(level as GradeLevel);
												setIsGradeLevelDropdownOpen(false);
											}}
											className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
										>
											Grade {level}
										</button>
									))}
								</div>
							)}
						</div>

						<div className="relative">
							<button
								onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
								className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
							>
								<span>
									Student:{" "}
									{selectedStudent
										? students.find((s) => s.id === selectedStudent)?.name
										: "All"}
								</span>
								<ChevronDown size={16} className="ml-2" />
							</button>
							{isStudentDropdownOpen && (
								<div className="absolute mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 w-48 max-h-64 overflow-y-auto">
									<button
										onClick={() => {
											setSelectedStudent(null);
											setIsStudentDropdownOpen(false);
										}}
										className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
									>
										All Students
									</button>
									{students.map((student) => (
										<button
											key={student.id}
											onClick={() => {
												setSelectedStudent(student.id);
												setIsStudentDropdownOpen(false);
											}}
											className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
										>
											{student.name} (Grade {student.gradeLevel})
										</button>
									))}
								</div>
							)}
						</div>

						<button
							onClick={() => {
								setSelectedSubject("Math");
								setSelectedGradeLevel(null);
								setSelectedStudent(null);
								showToast("Filters have been reset", "success");
							}}
							className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded hover:bg-gray-200 ml-auto cursor-pointer"
						>
							Reset Filters
						</button>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						<div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm text-gray-500">Average Grade</p>
									<p className="text-2xl font-bold">
										{calculateAverage(filteredStudents, selectedSubject)}%
									</p>
								</div>
								<div className="bg-blue-100 p-3 rounded-full">
									<BarChart2 size={20} className="text-blue-500" />
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm text-gray-500">Highest Grade</p>
									<p className="text-2xl font-bold">
										{filteredStudents.length > 0
											? Math.max(
													...filteredStudents.map(
														(s) => s.grades[selectedSubject]
													)
											  )
											: 0}
										%
									</p>
								</div>
								<div className="bg-green-100 p-3 rounded-full">
									<Award size={20} className="text-green-500" />
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm text-gray-500">Lowest Grade</p>
									<p className="text-2xl font-bold">
										{filteredStudents.length > 0
											? Math.min(
													...filteredStudents.map(
														(s) => s.grades[selectedSubject]
													)
											  )
											: 0}
										%
									</p>
								</div>
								<div className="bg-red-100 p-3 rounded-full">
									<AlertTriangle size={20} className="text-red-500" />
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm text-gray-500">Total Students</p>
									<p className="text-2xl font-bold">
										{filteredStudents.length}
									</p>
								</div>
								<div className="bg-purple-100 p-3 rounded-full">
									<User size={20} className="text-purple-500" />
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow mb-6">
						<div className="p-4 border-b border-b-gray-200">
							<h3 className="text-lg font-semibold">
								Grade Distribution for {selectedSubject}
							</h3>
						</div>
						<div className="p-4" style={{ height: "300px" }}>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={getGradeDistribution(filteredStudents, selectedSubject)}
									margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="range" />
									<YAxis
										label={{
											value: "Number of Students",
											angle: -90,
											position: "insideLeft",
										}}
									/>
									<Tooltip />
									<Legend />
									<Bar
										dataKey="count"
										name="Number of Students"
										fill="#3b82f6"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
						<div className="bg-white rounded-lg shadow">
							<div className="p-4 border-b border-b-gray-200 flex justify-between items-center">
								<h3 className="text-lg font-semibold">
									Top Performers in {selectedSubject}
								</h3>
								<button
									onClick={() =>
										handleNonFunctionalClick("View All Top Performers")
									}
									className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
								>
									View All
								</button>
							</div>
							<div className="p-4">
								{getTopPerformers(filteredStudents, selectedSubject).map(
									(student) => (
										<div
											key={student.id}
											className="flex items-center justify-between mb-4 last:mb-0"
										>
											<div className="flex items-center">
												<img
													src={student.avatar}
													alt={student.name}
													className="w-10 h-10 rounded-full mr-3"
												/>
												<div>
													<p className="font-medium">{student.name}</p>
													<p className="text-sm text-gray-500">
														Grade {student.gradeLevel}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-lg font-bold">
													{student.grades[selectedSubject]}%
												</p>
											</div>
										</div>
									)
								)}

								{getTopPerformers(filteredStudents, selectedSubject).length ===
									0 && (
									<p className="text-center text-gray-500 py-4">
										No data available
									</p>
								)}
							</div>
						</div>

						<div className="bg-white rounded-lg shadow">
							<div className="p-4 border-b border-b-gray-200 flex justify-between items-center">
								<h3 className="text-lg font-semibold">
									Need Improvement in {selectedSubject}
								</h3>
								<button
									onClick={() =>
										handleNonFunctionalClick("View All Low Performers")
									}
									className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
								>
									View All
								</button>
							</div>
							<div className="p-4">
								{getLowPerformers(filteredStudents, selectedSubject).map(
									(student) => (
										<div
											key={student.id}
											className="flex items-center justify-between mb-4 last:mb-0"
										>
											<div className="flex items-center">
												<img
													src={student.avatar}
													alt={student.name}
													className="w-10 h-10 rounded-full mr-3"
												/>
												<div>
													<p className="font-medium">{student.name}</p>
													<p className="text-sm text-gray-500">
														Grade {student.gradeLevel}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-lg font-bold text-red-500">
													{student.grades[selectedSubject]}%
												</p>
											</div>
										</div>
									)
								)}

								{getLowPerformers(filteredStudents, selectedSubject).length ===
									0 && (
									<p className="text-center text-gray-500 py-4">
										No data available
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow mb-6">
						<div className="p-4 border-b border-b-gray-200">
							<h3 className="text-lg font-semibold">Quick Actions</h3>
						</div>
						<div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
							<button
								onClick={() => handleNonFunctionalClick("Export Grades")}
								className="flex items-center justify-center bg-blue-50 text-blue-600 p-4 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
							>
								<svg
									className="w-6 h-6 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									></path>
								</svg>
								Export Grades
							</button>
							<button
								onClick={() => handleNonFunctionalClick("Email Reports")}
								className="flex items-center justify-center bg-green-50 text-green-600 p-4 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
							>
								<svg
									className="w-6 h-6 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									></path>
								</svg>
								Email Reports
							</button>
							<button
								onClick={() => handleNonFunctionalClick("Print Gradebook")}
								className="flex items-center justify-center bg-purple-50 text-purple-600 p-4 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
							>
								<svg
									className="w-6 h-6 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
									></path>
								</svg>
								Print Gradebook
							</button>
						</div>
					</div>
				</main>
			</div>

			<div className="fixed bottom-0 right-0 p-4 z-50">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`mb-2 p-3 rounded-lg shadow-lg flex items-center transition-all transform translate-y-0 opacity-100
              ${
								toast.type === "success"
									? "bg-green-500 text-white"
									: toast.type === "error"
									? "bg-red-500 text-white"
									: "bg-blue-500 text-white"
							}`}
					>
						{toast.type === "success" && (
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
						)}
						{toast.type === "error" && (
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						)}
						{toast.type === "info" && (
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						)}
						{toast.message}
					</div>
				))}
			</div>
		</div>
	);
};

export default GradeTrack;
