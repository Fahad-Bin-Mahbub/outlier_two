"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const theme = {
	colors: {
		primary: "#2563EB",
		primaryLight: "#3B82F6",
		primaryDark: "#1D4ED8",
		secondary: "#FFFFFF",
		accent: "#F59E0B",
		background: "#F3F4F6",
		card: "#FFFFFF",
		text: "#1E293B",
		textLight: "#64748B",
		success: "#10B981",
		warning: "#F59E0B",
		error: "#EF4444",
		border: "#E2E8F0",
	},

	spacing: {
		xs: "0.5rem",
		sm: "1rem",
		md: "1.5rem",
		lg: "2rem",
		xl: "3rem",
	},

	typography: {
		fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
		fontSize: {
			base: "16px",
			lg: "18px",
			xl: "20px",
			"2xl": "24px",
			"3xl": "30px",
		},
	},

	fontWeight: {
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
	},

	borderRadius: {
		sm: "0.25rem",
		md: "0.375rem",
		lg: "0.5rem",
		xl: "0.75rem",
		full: "9999px",
	},

	boxShadow: {
		sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
		md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
		lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
	},

	transition: {
		fast: "all 0.15s ease",
		default: "all 0.3s ease",
		slow: "all 0.5s ease",
	},
};

const hospitals: Hospital[] = [
	{
		id: 1,
		name: "Apollo Care Hospital",
		location: "Mumbai, Maharashtra",
		revenue: 12000000,
		patientCount: 15000,
		doctorCount: 120,
		surgeryCount: 3000,
		medicineInventory: 8500,
		trend: {
			revenue: "up",
			patientCount: "stable",
			doctorCount: "up",
			surgeryCount: "up",
			medicineInventory: "down",
		},
		monthlyData: [
			{
				month: "Jan",
				revenue: 1000000,
				consultancy: 400000,
				medicine: 300000,
				surgery: 300000,
				patients: 1200,
				admitted: 700,
				released: 500,
			},
			{
				month: "Feb",
				revenue: 1100000,
				consultancy: 450000,
				medicine: 350000,
				surgery: 300000,
				patients: 1300,
				admitted: 750,
				released: 550,
			},
			{
				month: "Mar",
				revenue: 1200000,
				consultancy: 500000,
				medicine: 400000,
				surgery: 300000,
				patients: 1400,
				admitted: 800,
				released: 600,
			},
			{
				month: "Apr",
				revenue: 1150000,
				consultancy: 480000,
				medicine: 370000,
				surgery: 300000,
				patients: 1350,
				admitted: 780,
				released: 570,
			},
			{
				month: "May",
				revenue: 1250000,
				consultancy: 520000,
				medicine: 400000,
				surgery: 330000,
				patients: 1450,
				admitted: 830,
				released: 620,
			},
			{
				month: "Jun",
				revenue: 1300000,
				consultancy: 550000,
				medicine: 420000,
				surgery: 330000,
				patients: 1500,
				admitted: 850,
				released: 650,
			},
		],
		purchases: [
			{ item: "Ambulance", quantity: 2, cost: 200000 },
			{ item: "Beds", quantity: 50, cost: 50000 },
			{ item: "Chairs", quantity: 100, cost: 10000 },
			{ item: "Computers", quantity: 20, cost: 30000 },
			{ item: "Medical Equipment", quantity: 15, cost: 150000 },
			{ item: "Ventilators", quantity: 5, cost: 125000 },
		],
		doctors: [
			{
				id: "D001",
				name: "Dr. Anil Sharma",
				email: "anil.sharma@hospital.com",
				salary: 150000,
				expertise: "Cardiology",
			},
			{
				id: "D002",
				name: "Dr. Priya Patel",
				email: "priya.patel@hospital.com",
				salary: 140000,
				expertise: "Neurology",
			},
			{
				id: "D003",
				name: "Dr. Rajan Iyer",
				email: "rajan.iyer@hospital.com",
				salary: 145000,
				expertise: "Orthopedics",
			},
			{
				id: "D004",
				name: "Dr. Meera Singh",
				email: "meera.singh@hospital.com",
				salary: 155000,
				expertise: "Gynecology",
			},
		],
	},
	{
		id: 2,
		name: "Fortis Health Center",
		location: "Bengaluru, Karnataka",
		revenue: 8000000,
		patientCount: 10000,
		doctorCount: 80,
		surgeryCount: 2000,
		medicineInventory: 6000,
		trend: {
			revenue: "down",
			patientCount: "up",
			doctorCount: "stable",
			surgeryCount: "stable",
			medicineInventory: "stable",
		},
		monthlyData: [
			{
				month: "Jan",
				revenue: 650000,
				consultancy: 200000,
				medicine: 250000,
				surgery: 200000,
				patients: 800,
				admitted: 450,
				released: 350,
			},
			{
				month: "Feb",
				revenue: 700000,
				consultancy: 250000,
				medicine: 250000,
				surgery: 200000,
				patients: 850,
				admitted: 500,
				released: 350,
			},
			{
				month: "Mar",
				revenue: 750000,
				consultancy: 300000,
				medicine: 250000,
				surgery: 200000,
				patients: 900,
				admitted: 550,
				released: 400,
			},
			{
				month: "Apr",
				revenue: 720000,
				consultancy: 280000,
				medicine: 240000,
				surgery: 200000,
				patients: 880,
				admitted: 520,
				released: 380,
			},
			{
				month: "May",
				revenue: 680000,
				consultancy: 260000,
				medicine: 230000,
				surgery: 190000,
				patients: 850,
				admitted: 500,
				released: 370,
			},
			{
				month: "Jun",
				revenue: 650000,
				consultancy: 240000,
				medicine: 220000,
				surgery: 190000,
				patients: 830,
				admitted: 480,
				released: 350,
			},
		],
		purchases: [
			{ item: "Ambulance", quantity: 1, cost: 100000 },
			{ item: "Beds", quantity: 30, cost: 30000 },
			{ item: "Chairs", quantity: 80, cost: 8000 },
			{ item: "Computers", quantity: 15, cost: 22500 },
			{ item: "Medical Equipment", quantity: 10, cost: 100000 },
			{ item: "Laboratory Tools", quantity: 20, cost: 50000 },
		],
		doctors: [
			{
				id: "D003",
				name: "Dr. Neha Gupta",
				email: "neha.gupta@hospital.com",
				salary: 130000,
				expertise: "Pediatrics",
			},
			{
				id: "D004",
				name: "Dr. Vikram Singh",
				email: "vikram.singh@hospital.com",
				salary: 135000,
				expertise: "Orthopedics",
			},
			{
				id: "D007",
				name: "Dr. Amit Kumar",
				email: "amit.kumar@hospital.com",
				salary: 120000,
				expertise: "General Medicine",
			},
			{
				id: "D008",
				name: "Dr. Kavita Reddy",
				email: "kavita.reddy@hospital.com",
				salary: 125000,
				expertise: "Dermatology",
			},
		],
	},
	{
		id: 3,
		name: "Max Lifeline Hospital",
		location: "Delhi, NCR",
		revenue: 9500000,
		patientCount: 12000,
		doctorCount: 95,
		surgeryCount: 2500,
		medicineInventory: 7000,
		trend: {
			revenue: "stable",
			patientCount: "down",
			doctorCount: "down",
			surgeryCount: "down",
			medicineInventory: "up",
		},
		monthlyData: [
			{
				month: "Jan",
				revenue: 800000,
				consultancy: 300000,
				medicine: 300000,
				surgery: 200000,
				patients: 1000,
				admitted: 600,
				released: 400,
			},
			{
				month: "Feb",
				revenue: 820000,
				consultancy: 320000,
				medicine: 300000,
				surgery: 200000,
				patients: 1050,
				admitted: 620,
				released: 430,
			},
			{
				month: "Mar",
				revenue: 850000,
				consultancy: 350000,
				medicine: 300000,
				surgery: 200000,
				patients: 1100,
				admitted: 650,
				released: 450,
			},
			{
				month: "Apr",
				revenue: 840000,
				consultancy: 340000,
				medicine: 300000,
				surgery: 200000,
				patients: 1080,
				admitted: 640,
				released: 440,
			},
			{
				month: "May",
				revenue: 830000,
				consultancy: 330000,
				medicine: 300000,
				surgery: 200000,
				patients: 1060,
				admitted: 630,
				released: 430,
			},
			{
				month: "Jun",
				revenue: 820000,
				consultancy: 320000,
				medicine: 300000,
				surgery: 200000,
				patients: 1040,
				admitted: 620,
				released: 420,
			},
		],
		purchases: [
			{ item: "Ambulance", quantity: 1, cost: 100000 },
			{ item: "Beds", quantity: 40, cost: 40000 },
			{ item: "Chairs", quantity: 90, cost: 9000 },
			{ item: "Computers", quantity: 25, cost: 37500 },
			{ item: "MRI Machine", quantity: 1, cost: 500000 },
			{ item: "X-Ray Machines", quantity: 3, cost: 150000 },
		],
		doctors: [
			{
				id: "D005",
				name: "Dr. Shalini Verma",
				email: "shalini.verma@hospital.com",
				salary: 145000,
				expertise: "Oncology",
			},
			{
				id: "D006",
				name: "Dr. Rajesh Kumar",
				email: "rajesh.kumar@hospital.com",
				salary: 140000,
				expertise: "Surgery",
			},
			{
				id: "D009",
				name: "Dr. Deepak Sharma",
				email: "deepak.sharma@hospital.com",
				salary: 150000,
				expertise: "Cardiology",
			},
			{
				id: "D010",
				name: "Dr. Ananya Mishra",
				email: "ananya.mishra@hospital.com",
				salary: 135000,
				expertise: "Endocrinology",
			},
		],
	},
];

interface Hospital {
	id: number;
	name: string;
	location: string;
	revenue: number;
	patientCount: number;
	doctorCount: number;
	surgeryCount: number;
	medicineInventory: number;
	trend: {
		revenue: "up" | "down" | "stable";
		patientCount: "up" | "down" | "stable";
		doctorCount: "up" | "down" | "stable";
		surgeryCount: "up" | "down" | "stable";
		medicineInventory: "up" | "down" | "stable";
	};
	monthlyData: {
		month: string;
		revenue: number;
		consultancy: number;
		medicine: number;
		surgery: number;
		patients: number;
		admitted: number;
		released: number;
	}[];
	purchases: { item: string; quantity: number; cost: number }[];
	doctors: {
		id: string;
		name: string;
		email: string;
		salary: number;
		expertise: string;
	}[];
}

interface NewDoctor {
	id: string;
	name: string;
	email: string;
	salary: string;
	expertise: string;
}

interface ToastProps {
	message: string;
	type: "success" | "error" | "info";
}

export default function HospitalDashboardExport() {
	const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
		hospitals[0]
	);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [toastInfo, setToastInfo] = useState<ToastProps>({
		message: "",
		type: "info",
	});
	const [selectedGraph, setSelectedGraph] = useState<string | null>(null);
	const [showTableOfDoctors, setShowTableOfDoctors] = useState<boolean>(false);
	const [showAddDoctorForm, setShowAddDoctorForm] = useState<boolean>(false);
	const [newDoctor, setNewDoctor] = useState<NewDoctor>({
		id: "",
		name: "",
		email: "",
		salary: "",
		expertise: "",
	});
	const [isExporting, setIsExporting] = useState<boolean>(false);

	const displayToast = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		setToastInfo({ message, type });
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	const formatCurrency = (value: number): string =>
		new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(value);

	const formatNumber = (value: number): string =>
		new Intl.NumberFormat("en-IN").format(value);

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "up":
				return (
					<svg
						className="w-4 h-4 text-success"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 10l7-7m0 0l7 7m-7-7v18"
						/>
					</svg>
				);
			case "down":
				return (
					<svg
						className="w-4 h-4 text-error"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				);
			default:
				return (
					<svg
						className="w-4 h-4 text-warning"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 12h16"
						/>
					</svg>
				);
		}
	};

	const exportReport = async () => {
		if (!selectedHospital) return;
		setIsExporting(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			displayToast("Report exported successfully!", "success");
		} catch (error) {
			displayToast("Export failed. Please try again.", "error");
		}
		setIsExporting(false);
	};

	const handleMetricClick = (metric: string) => {
		if (metric === "doctorCount") {
			setShowTableOfDoctors(true);
			setSelectedGraph(null);
		} else {
			setShowTableOfDoctors(false);
			setSelectedGraph(metric);
		}

		const contentElement = document.getElementById("content-area");
		if (contentElement) {
			contentElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleAddDoctor = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedHospital) return;

		const isDuplicate = selectedHospital.doctors.some(
			(doctor) => doctor.id === newDoctor.id
		);
		if (isDuplicate) {
			displayToast(`Doctor ID ${newDoctor.id} already exists.`, "error");
			return;
		}

		const updatedHospitals = hospitals.map((hospital) => {
			if (hospital.id === selectedHospital.id) {
				return {
					...hospital,
					doctors: [
						...hospital.doctors,
						{
							id: newDoctor.id,
							name: newDoctor.name,
							email: newDoctor.email,
							salary: parseFloat(newDoctor.salary),
							expertise: newDoctor.expertise,
						},
					],
					doctorCount: hospital.doctorCount + 1,
				};
			}
			return hospital;
		});

		setSelectedHospital(
			updatedHospitals.find((h) => h.id === selectedHospital.id) || null
		);
		setNewDoctor({ id: "", name: "", email: "", salary: "", expertise: "" });
		setShowAddDoctorForm(false);
		displayToast(
			`Dr. ${newDoctor.name} has been added successfully!`,
			"success"
		);
	};

	const handleDeleteDoctor = (doctorId: string) => {
		if (!selectedHospital) return;

		const doctorToDelete = selectedHospital.doctors.find(
			(d) => d.id === doctorId
		);

		const updatedHospitals = hospitals.map((hospital) => {
			if (hospital.id === selectedHospital.id) {
				return {
					...hospital,
					doctors: hospital.doctors.filter((doctor) => doctor.id !== doctorId),
					doctorCount: hospital.doctorCount - 1,
				};
			}
			return hospital;
		});

		setSelectedHospital(
			updatedHospitals.find((h) => h.id === selectedHospital.id) || null
		);

		if (doctorToDelete) {
			displayToast(`Dr. ${doctorToDelete.name} has been removed.`, "info");
		}
	};

	const handleNonFunctional = (feature: string) => {
		displayToast(`${feature} feature is not available yet.`, "info");
	};

	const renderChart = () => {
		if (!selectedHospital || !selectedGraph) return null;

		const data = selectedHospital.monthlyData;
		const COLORS = [
			theme.colors.primary,
			theme.colors.accent,
			theme.colors.success,
			theme.colors.error,
		];

		if (selectedGraph === "revenue") {
			return (
				<div className="bg-white rounded-lg shadow-md p-6 mb-6 transform transition-all duration-300 hover:shadow-lg">
					<h3 className="text-primary-600 font-semibold text-xl mb-4">
						Monthly Revenue Breakdown
					</h3>
					<ResponsiveContainer width="100%" height={350}>
						<BarChart
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
							<XAxis dataKey="month" stroke="#4A5568" />
							<YAxis
								tickFormatter={(value) => `₹${value / 100000}L`}
								stroke="#4A5568"
							/>
							<Tooltip
								formatter={(value: number, name: string) => [
									formatCurrency(value),
									name.charAt(0).toUpperCase() + name.slice(1),
								]}
								contentStyle={{
									backgroundColor: "#FFFFFF",
									border: "1px solid #E2E8F0",
									borderRadius: "0.375rem",
									boxShadow:
										"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
								}}
							/>
							<Legend wrapperStyle={{ paddingTop: 20 }} />
							<Bar
								dataKey="consultancy"
								name="Consultancy Revenue"
								fill={theme.colors.primary}
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="medicine"
								name="Medicine Revenue"
								fill={theme.colors.accent}
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="surgery"
								name="Surgery Revenue"
								fill={theme.colors.success}
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			);
		}

		if (selectedGraph === "patientCount") {
			return (
				<div className="bg-white rounded-lg shadow-md p-6 mb-6 transform transition-all duration-300 hover:shadow-lg">
					<h3 className="text-primary-600 font-semibold text-xl mb-4">
						Monthly Patient Data
					</h3>
					<ResponsiveContainer width="100%" height={350}>
						<LineChart
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
							<XAxis dataKey="month" stroke="#4A5568" />
							<YAxis stroke="#4A5568" />
							<Tooltip
								formatter={(value: number, name: string) => [
									value,
									name.charAt(0).toUpperCase() + name.slice(1),
								]}
								contentStyle={{
									backgroundColor: "#FFFFFF",
									border: "1px solid #E2E8F0",
									borderRadius: "0.375rem",
									boxShadow:
										"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
								}}
							/>
							<Legend wrapperStyle={{ paddingTop: 20 }} />
							<Line
								type="monotone"
								dataKey="patients"
								name="Total Patients"
								stroke={theme.colors.primary}
								strokeWidth={3}
								dot={{ r: 6, strokeWidth: 2 }}
								activeDot={{ r: 8, strokeWidth: 2 }}
							/>
							<Line
								type="monotone"
								dataKey="admitted"
								name="Admitted Patients"
								stroke={theme.colors.accent}
								strokeWidth={2}
								dot={{ r: 5 }}
							/>
							<Line
								type="monotone"
								dataKey="released"
								name="Released Patients"
								stroke={theme.colors.success}
								strokeWidth={2}
								dot={{ r: 5 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			);
		}

		if (selectedGraph === "surgeryCount") {
			const pieData = data.map((entry) => ({
				name: entry.month,
				value: entry.surgery,
			}));

			return (
				<div className="bg-white rounded-lg shadow-md p-6 mb-6 transform transition-all duration-300 hover:shadow-lg">
					<h3 className="text-primary-600 font-semibold text-xl mb-4">
						Monthly Surgeries Distribution
					</h3>
					<ResponsiveContainer width="100%" height={350}>
						<PieChart>
							<Pie
								data={pieData}
								cx="50%"
								cy="50%"
								outerRadius={120}
								innerRadius={60}
								fill="#8884d8"
								dataKey="value"
								label={({ name, value, percent }) =>
									`${name}: ${formatCurrency(value)} (${(percent * 100).toFixed(
										0
									)}%)`
								}
								labelLine={{ stroke: "#4A5568", strokeWidth: 1 }}
								animationDuration={1000}
								animationBegin={200}
							>
								{pieData.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(value: number) => [
									formatCurrency(value),
									"Surgery Revenue",
								]}
								contentStyle={{
									backgroundColor: "#FFFFFF",
									border: "1px solid #E2E8F0",
									borderRadius: "0.375rem",
									boxShadow:
										"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
								}}
							/>
							<Legend
								layout="horizontal"
								verticalAlign="bottom"
								align="center"
								wrapperStyle={{ paddingTop: 20 }}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>
			);
		}

		if (selectedGraph === "medicineInventory") {
			return (
				<div className="bg-white rounded-lg shadow-md p-6 mb-6 transform transition-all duration-300 hover:shadow-lg">
					<h3 className="text-primary-600 font-semibold text-xl mb-4">
						Medicine Inventory Overview
					</h3>
					<div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
						<div className="w-full md:w-1/2 flex flex-col items-center">
							<div className="text-5xl font-bold text-primary-600 mb-2">
								{formatNumber(selectedHospital.medicineInventory)}
							</div>
							<div className="text-lg text-gray-600">Total Units in Stock</div>

							<div className="w-full mt-8 bg-gray-100 rounded-full h-6 overflow-hidden">
								<div
									className="bg-primary-500 h-full rounded-full flex items-center justify-center text-white font-medium text-sm"
									style={{
										width: `${Math.min(
											(selectedHospital.medicineInventory / 10000) * 100,
											100
										)}%`,
									}}
								>
									{Math.min(
										Math.round(
											(selectedHospital.medicineInventory / 10000) * 100
										),
										100
									)}
									%
								</div>
							</div>
							<div className="text-sm text-gray-500 mt-2">
								Stock level (% of capacity)
							</div>
						</div>

						<div className="w-full md:w-1/2 flex flex-col">
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-blue-50 p-4 rounded-lg">
									<div className="text-xl font-semibold text-primary-600">
										Antibiotics
									</div>
									<div className="text-2xl font-bold">
										{formatNumber(
											Math.round(selectedHospital.medicineInventory * 0.35)
										)}
									</div>
									<div className="text-sm text-gray-500">35% of inventory</div>
								</div>
								<div className="bg-amber-50 p-4 rounded-lg">
									<div className="text-xl font-semibold text-amber-600">
										Pain Relief
									</div>
									<div className="text-2xl font-bold">
										{formatNumber(
											Math.round(selectedHospital.medicineInventory * 0.25)
										)}
									</div>
									<div className="text-sm text-gray-500">25% of inventory</div>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<div className="text-xl font-semibold text-green-600">
										Chronic Disease
									</div>
									<div className="text-2xl font-bold">
										{formatNumber(
											Math.round(selectedHospital.medicineInventory * 0.2)
										)}
									</div>
									<div className="text-sm text-gray-500">20% of inventory</div>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<div className="text-xl font-semibold text-purple-600">
										Others
									</div>
									<div className="text-2xl font-bold">
										{formatNumber(
											Math.round(selectedHospital.medicineInventory * 0.2)
										)}
									</div>
									<div className="text-sm text-gray-500">20% of inventory</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return null;
	};

	const renderDoctorsTable = () => {
		if (!selectedHospital || !showTableOfDoctors) return null;

		return (
			<div className="bg-white rounded-lg shadow-md p-6 mb-6 transform transition-all duration-300 hover:shadow-lg">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<h3 className="text-primary-600 font-semibold text-xl">
						Hospital Doctors
					</h3>
					<button
						onClick={() => setShowAddDoctorForm(!showAddDoctorForm)}
						className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 cursor-pointer"
					>
						{showAddDoctorForm ? "Cancel" : "+ Add New Doctor"}
					</button>
				</div>

				{showAddDoctorForm && (
					<form
						onSubmit={handleAddDoctor}
						className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn"
					>
						<h4 className="text-lg font-semibold text-primary-700 mb-4">
							Add New Doctor
						</h4>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
							<div className="flex flex-col">
								<label
									htmlFor="doctorId"
									className="text-sm font-medium text-gray-700 mb-1"
								>
									Doctor ID
								</label>
								<input
									id="doctorId"
									type="text"
									placeholder="e.g., D011"
									value={newDoctor.id}
									onChange={(e) =>
										setNewDoctor({ ...newDoctor, id: e.target.value })
									}
									className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required
								/>
							</div>
							<div className="flex flex-col">
								<label
									htmlFor="doctorName"
									className="text-sm font-medium text-gray-700 mb-1"
								>
									Full Name
								</label>
								<input
									id="doctorName"
									type="text"
									placeholder="Dr. Full Name"
									value={newDoctor.name}
									onChange={(e) =>
										setNewDoctor({ ...newDoctor, name: e.target.value })
									}
									className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required
								/>
							</div>
							<div className="flex flex-col">
								<label
									htmlFor="doctorEmail"
									className="text-sm font-medium text-gray-700 mb-1"
								>
									Email Address
								</label>
								<input
									id="doctorEmail"
									type="email"
									placeholder="doctor@hospital.com"
									value={newDoctor.email}
									onChange={(e) =>
										setNewDoctor({ ...newDoctor, email: e.target.value })
									}
									className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required
								/>
							</div>
							<div className="flex flex-col">
								<label
									htmlFor="doctorSalary"
									className="text-sm font-medium text-gray-700 mb-1"
								>
									Salary (₹)
								</label>
								<input
									id="doctorSalary"
									type="number"
									placeholder="e.g., 150000"
									value={newDoctor.salary}
									onChange={(e) =>
										setNewDoctor({ ...newDoctor, salary: e.target.value })
									}
									className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required
								/>
							</div>
							<div className="flex flex-col">
								<label
									htmlFor="doctorExpertise"
									className="text-sm font-medium text-gray-700 mb-1"
								>
									Expertise
								</label>
								<input
									id="doctorExpertise"
									type="text"
									placeholder="e.g., Cardiology"
									value={newDoctor.expertise}
									onChange={(e) =>
										setNewDoctor({ ...newDoctor, expertise: e.target.value })
									}
									className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required
								/>
							</div>
						</div>
						<div className="mt-6 flex justify-end">
							<button
								type="button"
								onClick={() => setShowAddDoctorForm(false)}
								className="mr-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors cursor-pointer"
							>
								Add Doctor
							</button>
						</div>
					</form>
				)}

				<div className="overflow-x-auto rounded-lg border border-gray-200">
					<table className="w-full text-left text-base">
						<thead>
							<tr className="bg-primary-600 text-white">
								<th className="p-3 font-semibold">ID</th>
								<th className="p-3 font-semibold">Name</th>
								<th className="p-3 font-semibold">Email</th>
								<th className="p-3 font-semibold">Salary</th>
								<th className="p-3 font-semibold">Expertise</th>
								<th className="p-3 font-semibold text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{selectedHospital.doctors.map((doctor, index) => (
								<tr
									key={doctor.id}
									className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									}`}
								>
									<td className="p-3 font-medium text-gray-900">{doctor.id}</td>
									<td className="p-3">{doctor.name}</td>
									<td className="p-3 text-blue-600">{doctor.email}</td>
									<td className="p-3">{formatCurrency(doctor.salary)}</td>
									<td className="p-3">
										<span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
											{doctor.expertise}
										</span>
									</td>
									<td className="p-3 text-center">
										<div className="flex justify-center gap-2">
											<button
												onClick={() => handleNonFunctional("Edit doctor")}
												className="p-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
												title="Edit Doctor"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
													/>
												</svg>
											</button>
											<button
												onClick={() => handleDeleteDoctor(doctor.id)}
												className="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
												title="Delete Doctor"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	return (
		<>
			<style jsx global>{`
				html {
					scroll-behavior: smooth;
				}

				body {
					background-color: ${theme.colors.background};
					color: ${theme.colors.text};
					font-family: ${theme.typography.fontFamily};
					margin: 0;
					padding: 0;
				}

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

				@keyframes slideIn {
					from {
						transform: translateX(-20px);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}

				@keyframes pulse {
					0%,
					100% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.05);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.5s ease-out forwards;
				}

				.animate-slideIn {
					animation: slideIn 0.5s ease-out forwards;
				}

				.animate-pulse {
					animation: pulse 2s infinite;
				}

				.card,
				button,
				a {
					transition: ${theme.transition.default};
				}

				.card {
					background-color: white;
					border-radius: ${theme.borderRadius.lg};
					box-shadow: ${theme.boxShadow.md};
				}

				.card:hover {
					transform: translateY(-4px);
					box-shadow: ${theme.boxShadow.lg};
				}

				button {
					cursor: pointer;
				}

				button:hover {
					transform: translateY(-2px);
				}

				.bg-primary-50 {
					background-color: #eff6ff;
				}
				.bg-primary-100 {
					background-color: #dbeafe;
				}
				.bg-primary-200 {
					background-color: #bfdbfe;
				}
				.bg-primary-300 {
					background-color: #93c5fd;
				}
				.bg-primary-400 {
					background-color: #60a5fa;
				}
				.bg-primary-500 {
					background-color: #3b82f6;
				}
				.bg-primary-600 {
					background-color: #2563eb;
				}
				.bg-primary-700 {
					background-color: #1d4ed8;
				}
				.bg-primary-800 {
					background-color: #1e40af;
				}
				.bg-primary-900 {
					background-color: #1e3a8a;
				}

				.text-primary-500 {
					color: #3b82f6;
				}
				.text-primary-600 {
					color: #2563eb;
				}
				.text-primary-700 {
					color: #1d4ed8;
				}

				.border-primary-500 {
					border-color: #3b82f6;
				}

				.text-success {
					color: #10b981;
				}
				.text-warning {
					color: #f59e0b;
				}
				.text-error {
					color: #ef4444;
				}
			`}</style>

			<div className="min-h-screen flex flex-col bg-gray-50">
				{}
				<header className="bg-primary-600 text-white py-4 sticky top-0 z-50 shadow-md">
					<nav className="flex flex-col md:flex-row md:items-center justify-between max-w-7xl mx-auto px-4 sm:px-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="bg-white p-2 rounded-full transform transition-transform hover:rotate-12">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8 text-primary-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
										/>
									</svg>
								</div>
								<div>
									<h1 className="text-xl sm:text-2xl font-bold">
										Hospital Dashboard
									</h1>
									<p className="text-xs sm:text-sm text-blue-100">
										Supply Chain & Patient Analytics
									</p>
								</div>
							</div>

							<button
								className="md:hidden bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors"
								onClick={() => handleNonFunctional("Mobile menu")}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16m-7 6h7"
									/>
								</svg>
							</button>
						</div>

						<div className="hidden md:flex items-center gap-4 mt-4 md:mt-0">
							<select
								className="px-3 py-2 rounded-md bg-white text-primary-600 text-sm sm:text-base border-none focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
								value={selectedHospital?.id || ""}
								onChange={(e) => {
									const hospital = hospitals.find(
										(h) => h.id === Number(e.target.value)
									);
									setSelectedHospital(hospital || null);
									setSelectedGraph(null);
									setShowTableOfDoctors(false);
								}}
							>
								{hospitals.map((hospital) => (
									<option key={hospital.id} value={hospital.id}>
										{hospital.name}
									</option>
								))}
							</select>

							<div className="flex items-center space-x-2">
								<button
									onClick={() => handleNonFunctional("Notifications")}
									className="p-2 rounded-full hover:bg-white/10 transition-colors relative cursor-pointer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
										/>
									</svg>
									<span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
								</button>

								<button
									onClick={() => handleNonFunctional("User profile")}
									className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer flex items-center"
								>
									<div className="h-7 w-7 bg-white rounded-full flex items-center justify-center mr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-primary-600"
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
									<span className="text-sm font-medium">Area Manager</span>
								</button>
							</div>
						</div>
					</nav>
				</header>

				{}
				<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
					{}
					{selectedHospital && (
						<div className="mb-8 animate-fadeIn">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
								<div>
									<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
										{selectedHospital.name}
										<span className="ml-3 px-2 py-1 bg-blue-100 text-xs font-medium text-blue-800 rounded-full">
											Active
										</span>
									</h2>
									<p className="text-gray-600 mt-1 flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										{selectedHospital.location}
									</p>
								</div>
								<div className="flex flex-col sm:items-end">
									<span className="text-gray-500 text-sm">
										{new Date().toLocaleDateString("en-US", {
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
									<div className="mt-2 flex gap-2">
										<button
											onClick={() => handleNonFunctional("Hospital filters")}
											className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
												/>
											</svg>
											Filters
										</button>
										<button
											onClick={exportReport}
											disabled={isExporting}
											className="text-sm px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-70 disabled:hover:bg-primary-600"
										>
											{isExporting ? (
												<>
													<svg
														className="animate-spin h-4 w-4 text-white"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
													>
														<circle
															className="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															strokeWidth="4"
														></circle>
														<path
															className="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Exporting...
												</>
											) : (
												<>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
														/>
													</svg>
													Export Report
												</>
											)}
										</button>
									</div>
								</div>
							</div>

							{}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
								<div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
									<h3 className="text-lg font-semibold text-primary-600 mb-3 flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Hospital Information
									</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-gray-600">Hospital ID:</span>
											<span className="font-medium text-gray-900">
												HOS-{selectedHospital.id.toString().padStart(3, "0")}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Type:</span>
											<span className="font-medium text-gray-900">
												Multi-Specialty
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Beds:</span>
											<span className="font-medium text-gray-900">
												{Math.round(selectedHospital.patientCount * 0.15)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Established:</span>
											<span className="font-medium text-gray-900">2012</span>
										</div>
									</div>
								</div>

								<div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
									<h3 className="text-lg font-semibold text-primary-600 mb-3 flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
										Contact Information
									</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-gray-600">Phone:</span>
											<span className="font-medium text-gray-900">
												+91 2200-123456
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Email:</span>
											<span className="font-medium text-blue-600">
												{selectedHospital.name
													.toLowerCase()
													.replace(/\s+/g, ".")}
												@healthcare.com
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Website:</span>
											<span className="font-medium text-blue-600">
												www.
												{selectedHospital.name
													.toLowerCase()
													.replace(/\s+/g, "")}
												.com
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Emergency:</span>
											<span className="font-medium text-red-600">
												+91 2200-999999
											</span>
										</div>
									</div>
								</div>

								<div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
									<h3 className="text-lg font-semibold text-primary-600 mb-3 flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Status & Compliance
									</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-gray-600">Status:</span>
											<span className="font-medium text-green-600">
												Fully Operational
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Last Inspection:</span>
											<span className="font-medium text-gray-900">
												March 15, 2025
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Compliance:</span>
											<span className="font-medium text-green-600">98%</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Next Audit:</span>
											<span className="font-medium text-gray-900">
												September 2025
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{}
					{selectedHospital && (
						<section className="mb-8">
							<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2 text-primary-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
								Key Performance Metrics
							</h2>

							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
								{}
								<div
									className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md border-l-4 border-primary-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
									onClick={() => handleMetricClick("revenue")}
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold text-gray-700">
											Total Revenue
										</h3>
										<div className="p-2 bg-blue-50 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-primary-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
									</div>
									<div className="text-2xl font-bold text-gray-900 mb-1">
										{formatCurrency(selectedHospital.revenue)}
									</div>
									<div
										className={`flex items-center gap-1 text-sm font-medium ${
											selectedHospital.trend.revenue === "up"
												? "text-green-600"
												: selectedHospital.trend.revenue === "down"
												? "text-red-600"
												: "text-amber-600"
										}`}
									>
										{getTrendIcon(selectedHospital.trend.revenue)}
										{selectedHospital.trend.revenue === "up"
											? "12% increase from last quarter"
											: selectedHospital.trend.revenue === "down"
											? "8% decrease from last quarter"
											: "No change from last quarter"}
									</div>
								</div>

								{}
								<div
									className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md border-l-4 border-amber-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
									onClick={() => handleMetricClick("patientCount")}
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold text-gray-700">
											Patient Count
										</h3>
										<div className="p-2 bg-amber-50 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-amber-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
												/>
											</svg>
										</div>
									</div>
									<div className="text-2xl font-bold text-gray-900 mb-1">
										{formatNumber(selectedHospital.patientCount)}
									</div>
									<div
										className={`flex items-center gap-1 text-sm font-medium ${
											selectedHospital.trend.patientCount === "up"
												? "text-green-600"
												: selectedHospital.trend.patientCount === "down"
												? "text-red-600"
												: "text-amber-600"
										}`}
									>
										{getTrendIcon(selectedHospital.trend.patientCount)}
										{selectedHospital.trend.patientCount === "up"
											? "15% increase from last year"
											: selectedHospital.trend.patientCount === "down"
											? "7% decrease from last year"
											: "Stable patient count"}
									</div>
								</div>

								{}
								<div
									className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md border-l-4 border-green-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
									onClick={() => handleMetricClick("surgeryCount")}
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold text-gray-700">
											Total Surgeries
										</h3>
										<div className="p-2 bg-green-50 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-green-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>
										</div>
									</div>
									<div className="text-2xl font-bold text-gray-900 mb-1">
										{formatNumber(selectedHospital.surgeryCount)}
									</div>
									<div
										className={`flex items-center gap-1 text-sm font-medium ${
											selectedHospital.trend.surgeryCount === "up"
												? "text-green-600"
												: selectedHospital.trend.surgeryCount === "down"
												? "text-red-600"
												: "text-amber-600"
										}`}
									>
										{getTrendIcon(selectedHospital.trend.surgeryCount)}
										{selectedHospital.trend.surgeryCount === "up"
											? "10% increase from previous year"
											: selectedHospital.trend.surgeryCount === "down"
											? "5% decrease from previous year"
											: "Stable surgery count"}
									</div>
								</div>

								{}
								<div
									className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md border-l-4 border-purple-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
									onClick={() => handleMetricClick("doctorCount")}
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold text-gray-700">
											Doctors
										</h3>
										<div className="p-2 bg-purple-50 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-purple-500"
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
									</div>
									<div className="text-2xl font-bold text-gray-900 mb-1">
										{selectedHospital.doctorCount}
									</div>
									<div
										className={`flex items-center gap-1 text-sm font-medium ${
											selectedHospital.trend.doctorCount === "up"
												? "text-green-600"
												: selectedHospital.trend.doctorCount === "down"
												? "text-red-600"
												: "text-amber-600"
										}`}
									>
										{getTrendIcon(selectedHospital.trend.doctorCount)}
										{selectedHospital.trend.doctorCount === "up"
											? "New hires this quarter"
											: selectedHospital.trend.doctorCount === "down"
											? "Staffing reduction this quarter"
											: "Stable staffing this quarter"}
									</div>
								</div>

								{}
								<div
									className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md border-l-4 border-red-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
									onClick={() => handleMetricClick("medicineInventory")}
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold text-gray-700">
											Medicine Inventory
										</h3>
										<div className="p-2 bg-red-50 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-red-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
												/>
											</svg>
										</div>
									</div>
									<div className="text-2xl font-bold text-gray-900 mb-1">
										{formatNumber(selectedHospital.medicineInventory)}
									</div>
									<div
										className={`flex items-center gap-1 text-sm font-medium ${
											selectedHospital.trend.medicineInventory === "up"
												? "text-green-600"
												: selectedHospital.trend.medicineInventory === "down"
												? "text-red-600"
												: "text-amber-600"
										}`}
									>
										{getTrendIcon(selectedHospital.trend.medicineInventory)}
										{selectedHospital.trend.medicineInventory === "up"
											? "Stock level increasing"
											: selectedHospital.trend.medicineInventory === "down"
											? "Stock level decreasing"
											: "Stock level stable"}
									</div>
								</div>
							</div>
						</section>
					)}

					{}
					<section id="content-area" className="mb-8">
						{renderChart()}
						{renderDoctorsTable()}
					</section>

					{}
					{selectedHospital && (
						<section className="mb-8">
							<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2 text-primary-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								Supply Chain & Purchasing
							</h2>

							<div className="bg-white rounded-lg shadow-md overflow-hidden">
								<div className="p-6 border-b border-gray-200">
									<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
										<h3 className="text-lg font-semibold text-gray-900">
											Recent Purchases
										</h3>
										<div className="flex gap-2">
											<button
												onClick={() => handleNonFunctional("Add new purchase")}
												className="px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors cursor-pointer flex items-center gap-1"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
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
												Add Purchase
											</button>
											<button
												onClick={() => handleNonFunctional("Filter purchases")}
												className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
													/>
												</svg>
												Filter
											</button>
										</div>
									</div>

									<div className="overflow-x-auto">
										<table className="w-full">
											<thead>
												<tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													<th className="px-6 py-3">Item</th>
													<th className="px-6 py-3">Quantity</th>
													<th className="px-6 py-3">Unit Cost</th>
													<th className="px-6 py-3">Total Cost</th>
													<th className="px-6 py-3">Status</th>
													<th className="px-6 py-3 text-right">Actions</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200">
												{selectedHospital.purchases.map((purchase, index) => (
													<tr
														key={index}
														className="hover:bg-gray-50 transition-colors"
													>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
																	{purchase.item.charAt(0)}
																</div>
																<div className="ml-4">
																	<div className="text-sm font-medium text-gray-900">
																		{purchase.item}
																	</div>
																	<div className="text-xs text-gray-500">
																		Added on April {10 + index}, 2025
																	</div>
																</div>
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">
																{purchase.quantity}{" "}
																{purchase.item === "Ambulance"
																	? "units"
																	: "units"}
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">
																{formatCurrency(
																	purchase.cost / purchase.quantity
																)}
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm font-medium text-gray-900">
																{formatCurrency(purchase.cost)}
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<span
																className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
																	index % 3 === 0
																		? "bg-green-100 text-green-800"
																		: index % 3 === 1
																		? "bg-yellow-100 text-yellow-800"
																		: "bg-blue-100 text-blue-800"
																}`}
															>
																{index % 3 === 0
																	? "Delivered"
																	: index % 3 === 1
																	? "In Transit"
																	: "Processing"}
															</span>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
															<button
																onClick={() =>
																	handleNonFunctional("View purchase details")
																}
																className="text-primary-600 hover:text-primary-900 mr-3 cursor-pointer"
															>
																View
															</button>
															<button
																onClick={() =>
																	handleNonFunctional("Edit purchase")
																}
																className="text-amber-600 hover:text-amber-900 cursor-pointer"
															>
																Edit
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>

									<div className="flex justify-between items-center mt-6 text-sm text-gray-600">
										<div>Showing {selectedHospital.purchases.length} items</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => handleNonFunctional("Previous page")}
												className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
											>
												Previous
											</button>
											<span className="px-3 py-1 border border-gray-300 bg-primary-50 text-primary-700 rounded-md font-medium">
												1
											</span>
											<button
												onClick={() => handleNonFunctional("Next page")}
												className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
											>
												Next
											</button>
										</div>
									</div>
								</div>
							</div>
						</section>
					)}
				</main>

				{}
				<footer className="bg-gray-800 text-white py-8 mt-auto">
					<div className="max-w-7xl mx-auto px-4 sm:px-6">
						<div className="flex flex-col md:flex-row justify-between items-center gap-6">
							<div className="flex items-center gap-3">
								<div className="bg-white p-2 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-primary-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-lg font-bold">Hospital Dashboard</h3>
									<p className="text-xs text-gray-400">
										v2.5.0 | Last Updated: April 2025
									</p>
								</div>
							</div>

							<div className="flex flex-wrap justify-center gap-4 text-sm">
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										handleNonFunctional("Help center");
									}}
									className="text-gray-300 hover:text-white transition-colors cursor-pointer"
								>
									Help Center
								</a>
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										handleNonFunctional("Privacy policy");
									}}
									className="text-gray-300 hover:text-white transition-colors cursor-pointer"
								>
									Privacy Policy
								</a>
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										handleNonFunctional("Terms of service");
									}}
									className="text-gray-300 hover:text-white transition-colors cursor-pointer"
								>
									Terms of Service
								</a>
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										handleNonFunctional("Contact support");
									}}
									className="text-gray-300 hover:text-white transition-colors cursor-pointer"
								>
									Contact Support
								</a>
							</div>

							<div className="text-sm text-gray-400">
								© 2025 Hospital Management System. All rights reserved.
							</div>
						</div>
					</div>
				</footer>
			</div>

			{}
			{showToast && (
				<div
					className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white animate-fadeIn
          ${
						toastInfo.type === "success"
							? "bg-green-600"
							: toastInfo.type === "error"
							? "bg-red-600"
							: "bg-blue-600"
					}`}
				>
					<div className="flex items-center gap-2">
						{toastInfo.type === "success" ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						) : toastInfo.type === "error" ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
						{toastInfo.message}
					</div>
				</div>
			)}
		</>
	);
}
