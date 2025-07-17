"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	FiCalendar,
	FiEdit,
	FiTrash2,
	FiBarChart2,
	FiUser,
	FiPlusCircle,
	FiEye,
	FiX,
	FiSearch,
	FiArrowLeft,
	FiUserPlus,
	FiClock,
	FiBell,
	FiAlertCircle,
	FiInfo,
	FiSave,
	FiCheckCircle,
} from "react-icons/fi";
import {
	FaUserMd,
	FaXRay,
	FaTint,
	FaHeartbeat,
	FaNotesMedical,
	FaFileMedical,
} from "react-icons/fa";

// Define type interfaces
interface PatientData {
	name: string;
	dob: string;
	id: string;
	contacts: {
		phone: string;
		address: string;
		email: string;
	};
	height: string;
	weight: string;
	bloodGroup: string;
	lastBloodSugar: string;
	lastCholesterol: string;
}

interface Visit {
	id: number;
	doctor: string;
	specialty: string;
	date: string;
	time: string;
	details?: string;
}

interface MedicalRecord {
	id: number;
	type: "visit" | "test";
	doctor?: string;
	date: string;
	specialty?: string;
	diagnosis?: string;
	prescription?: string;
	price?: string;
	icon: JSX.Element;
	testName?: string;
	details?: string;
	detailedReport?: string;
}

interface Vitals {
	height: string;
	weight: string;
	bloodPressure: string;
	heartRate: string;
	temperature: string;
	bloodGlucose: string;
	bloodType: string;
	cholesterol: string;
}

interface Patient {
	id: string;
	name: string;
	age: number;
	lastVisit: string;
	condition: string;
	status: string;
	initials: string;
	medicalHistory: MedicalRecord[];
	vitals: Vitals;
	upcomingAppointments: Visit[];
	notes: string;
}

const initialPatientData: PatientData = {
	name: "John Smith",
	dob: "1980-05-15",
	id: "#123456789",
	contacts: {
		phone: "+1 (123) 456-7890",
		address: "123 Main Street, Anytown, USA",
		email: "john.doe@example.com",
	},
	height: "188 cm",
	weight: "87 kg",
	bloodGroup: "A+",
	lastBloodSugar: "90 mg/dL",
	lastCholesterol: "180 mg/dL",
};

const initialUpcomingVisits: Visit[] = [
	{
		id: 1,
		doctor: "Dr. Amanda Rodriguez",
		specialty: "Pediatrician",
		date: "Tomorrow",
		time: "12:15 PM",
	},
	{
		id: 2,
		doctor: "Magnetic Resonance Angiography (MRA)",
		specialty: "Radiology",
		date: "June 25th 2024",
		time: "4:43 PM",
		details: "Check blood flow in arteries.",
	},
	{
		id: 3,
		doctor: "Cardiology Consult",
		specialty: "Cardiologist",
		date: "July 1st 2024",
		time: "10:00 AM",
		details: "Follow-up on hypertension.",
	},
];

const initialMedicalHistory: MedicalRecord[] = [
	{
		id: 1,
		type: "visit",
		doctor: "Dr. Emily Smith",
		date: "September 5th 2023, 10:10:00 am",
		specialty: "Cardiologist",
		diagnosis: "Hypertension",
		prescription: "Prescribed Blood pressure medication (Lisinopril 10mg)",
		price: "$150",
		icon: <FaUserMd className="text-[#556f44]" />,
		detailedReport:
			"Patient presented with elevated blood pressure readings. Confirmed diagnosis of essential hypertension. Started on Lisinopril 10mg daily. Advised lifestyle modifications including low-sodium diet and regular exercise. Follow-up scheduled in 3 months. BP at visit: 150/95 mmHg.",
	},
	{
		id: 2,
		type: "test",
		testName: "Chest X-ray",
		date: "August 28th 2023, 9:15:00 am",
		icon: <FaXRay className="text-[#556f44]" />,
		details: "Chest X-ray results: Normal",
		detailedReport:
			"Clinical Indication: Routine check-up.\nFindings: Lungs are clear without evidence of consolidation, effusion, or pneumothorax. Cardiac silhouette is normal in size and contour. Bony structures appear intact. Impression: No acute cardiopulmonary abnormalities.",
	},
];

const initialPatientList: Patient[] = [
	{
		id: "P001",
		name: "John Smith",
		age: 42,
		lastVisit: "May 15, 2024",
		condition: "Hypertension",
		status: "Stable",
		initials: "JS",
		medicalHistory: [
			{
				id: 1,
				type: "visit",
				doctor: "Dr. Emily Smith",
				date: "May 15, 2024",
				specialty: "Cardiologist",
				diagnosis: "Hypertension",
				prescription: "Lisinopril 10mg daily",
				price: "$150",
				icon: <FaUserMd className="text-[#556f44]" />,
			},
			{
				id: 2,
				type: "test",
				testName: "Blood Pressure Check",
				date: "May 15, 2024",
				icon: <FaTint className="text-[#556f44]" />,
				details: "140/85 mmHg",
			},
		],
		vitals: {
			height: "180 cm",
			weight: "85 kg",
			bloodPressure: "140/85 mmHg",
			heartRate: "72 bpm",
			temperature: "36.6°C",
			bloodGlucose: "95 mg/dL",
			bloodType: "A+",
			cholesterol: "180 mg/dL",
		},
		upcomingAppointments: [
			{
				id: 1,
				doctor: "Dr. Emily Smith",
				specialty: "Cardiologist",
				date: "June 15, 2024",
				time: "10:30 AM",
			},
		],
		notes:
			"Patient is responding well to medication. Continue current treatment plan and monitor blood pressure.",
	},
	{
		id: "P002",
		name: "Sarah Johnson",
		age: 35,
		lastVisit: "May 10, 2024",
		condition: "Diabetes Type 2",
		status: "Monitoring",
		initials: "SJ",
		medicalHistory: [
			{
				id: 1,
				type: "visit",
				doctor: "Dr. Michael Chen",
				date: "May 10, 2024",
				specialty: "Endocrinologist",
				diagnosis: "Diabetes Type 2",
				prescription: "Metformin 500mg twice daily",
				price: "$175",
				icon: <FaUserMd className="text-[#556f44]" />,
			},
			{
				id: 2,
				type: "test",
				testName: "HbA1c Test",
				date: "May 10, 2024",
				icon: <FaTint className="text-[#556f44]" />,
				details: "7.2%",
			},
		],
		vitals: {
			height: "165 cm",
			weight: "72 kg",
			bloodPressure: "125/80 mmHg",
			heartRate: "78 bpm",
			temperature: "36.7°C",
			bloodGlucose: "145 mg/dL",
			bloodType: "O+",
			cholesterol: "180 mg/dL",
		},
		upcomingAppointments: [
			{
				id: 1,
				doctor: "Dr. Michael Chen",
				specialty: "Endocrinologist",
				date: "June 10, 2024",
				time: "2:15 PM",
			},
		],
		notes:
			"Patient needs to improve diet and exercise. HbA1c levels are still above target range.",
	},
	{
		id: "P003",
		name: "Michael Chen",
		age: 28,
		lastVisit: "April 30, 2024",
		condition: "Asthma",
		status: "Improving",
		initials: "MC",
		medicalHistory: [
			{
				id: 1,
				type: "visit",
				doctor: "Dr. Sarah Williams",
				date: "April 30, 2024",
				specialty: "Pulmonologist",
				diagnosis: "Mild Asthma",
				prescription: "Albuterol inhaler as needed",
				price: "$125",
				icon: <FaUserMd className="text-[#556f44]" />,
			},
			{
				id: 2,
				type: "test",
				testName: "Pulmonary Function Test",
				date: "April 30, 2024",
				icon: <FaXRay className="text-[#556f44]" />,
				details: "Mild obstruction, improved from previous test",
			},
		],
		vitals: {
			height: "175 cm",
			weight: "68 kg",
			bloodPressure: "120/75 mmHg",
			heartRate: "68 bpm",
			temperature: "36.5°C",
			bloodGlucose: "90 mg/dL",
			bloodType: "B+",
			cholesterol: "198 mg/dL",
		},
		upcomingAppointments: [
			{
				id: 1,
				doctor: "Dr. Sarah Williams",
				specialty: "Pulmonologist",
				date: "July 30, 2024",
				time: "11:00 AM",
			},
		],
		notes:
			"Patient's asthma symptoms have improved significantly with current treatment plan.",
	},
];

// Animation variants
const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.1, duration: 0.4 },
	}),
};

const buttonHover = { scale: 1.05 };
const iconHover = { scale: 1.2 };

const backdropVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

const modalVariants = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { type: "spring", stiffness: 300, damping: 25 },
	},
	exit: { opacity: 0, scale: 0.9 },
};

interface SimpleGraphProps {
	title: string;
	currentValue: number;
	unit: string;
	icon: React.ReactNode;
	normalMin: number;
	normalMax: number;
	borderlineMax?: number;
	lowThreshold?: number;
	barVisualMin: number;
	barVisualMax: number;
}

const SimpleGraph: React.FC<SimpleGraphProps> = ({
	title,
	currentValue,
	unit,
	icon,
	normalMin,
	normalMax,
	borderlineMax,
	lowThreshold,
	barVisualMin,
	barVisualMax,
}) => {
	const [lastReadingDate, setLastReadingDate] = useState("");

	useEffect(() => {
		setLastReadingDate(new Date().toLocaleDateString());
	}, []);

	let statusText: string = "";
	let statusColorClass: string = "text-gray-600";
	let barColorClass: string = "bg-gray-400";

	if (lowThreshold !== undefined && currentValue < lowThreshold) {
		statusText = "Low";
		statusColorClass = "text-blue-600";
		barColorClass = "bg-blue-500";
	} else if (currentValue >= normalMin && currentValue <= normalMax) {
		statusText = "Normal";
		statusColorClass = "text-green-600";
		barColorClass = "bg-green-500";
	} else if (
		borderlineMax !== undefined &&
		currentValue > normalMax &&
		currentValue <= borderlineMax
	) {
		statusText = "Borderline";
		statusColorClass = "text-yellow-600";
		barColorClass = "bg-yellow-500";
	} else if (currentValue > normalMax) {
		statusText = "High";
		statusColorClass = "text-red-600";
		barColorClass = "bg-red-500";
	} else if (currentValue < normalMin) {
		statusText = "Below Normal";
		statusColorClass = "text-blue-600";
		barColorClass = "bg-blue-500";
	}

	const range = barVisualMax - barVisualMin;
	const correctedValueForBar = Math.max(0, currentValue - barVisualMin);
	let barFillPercentage = range > 0 ? (correctedValueForBar / range) * 100 : 0;
	barFillPercentage = Math.min(100, Math.max(0, barFillPercentage));

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
			className="bg-white p-4 rounded-lg shadow flex flex-col justify-between h-full border border-gray-200"
		>
			<div>
				<div className="flex flex-wrap justify-between items-baseline mb-1">
					<h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mr-2">
						{icon} {title}
					</h4>
					<div className="text-right">
						<span className={`text-lg font-bold ${statusColorClass}`}>
							{currentValue}
							<span className="text-xs text-gray-500 ml-1">{unit}</span>
						</span>
					</div>
				</div>
				{statusText && (
					<div
						className={`text-xs mb-2 text-right font-medium ${statusColorClass}`}
					>
						({statusText})
					</div>
				)}
				<p className="text-xs text-gray-500 mb-3">
					Last reading: {lastReadingDate}
				</p>
			</div>
			<div className="h-20 bg-gray-100 rounded flex items-end overflow-hidden">
				<motion.div
					className={`${barColorClass} w-full rounded-t`}
					initial={{ height: 0 }}
					animate={{ height: `${barFillPercentage}%` }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				/>
			</div>
		</motion.div>
	);
};

interface StatCardProps {
	title: string;
	value: string;
	change: string;
	isPositive: boolean;
	icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	change,
	isPositive,
	icon,
}) => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.6 }}
		className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
	>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
				<h4 className="text-sm font-medium text-gray-600">{title}</h4>
			</div>
			<span
				className={`text-xs font-medium ${
					isPositive ? "text-green-600" : "text-red-600"
				}`}
			>
				{change}
			</span>
		</div>
		<p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
	</motion.div>
);

const getInitials = (name: string) => {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
};

const formatDateForInput = (dateStr: string | undefined): string => {
	if (!dateStr) return "";

	let dateObj: Date;

	if (dateStr.toLowerCase() === "tomorrow") {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		dateObj = tomorrow;
	} else {
		const cleanedDateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
		dateObj = new Date(cleanedDateStr);
	}

	if (isNaN(dateObj.getTime())) {
		dateObj = new Date(dateStr);
		if (isNaN(dateObj.getTime())) {
			console.warn("Could not parse date string for input:", dateStr);
			return "";
		}
	}

	const year = dateObj.getFullYear();
	const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
	const day = dateObj.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export default function PMSExport() {
	const [userRole, setUserRole] = useState<"patient" | "doctor">("patient");
	const [activeView, setActiveView] = useState<"dashboard" | "account">(
		"dashboard"
	);
	const [patientData, setPatientData] =
		useState<PatientData>(initialPatientData);
	const [upcomingVisits, setUpcomingVisits] = useState<Visit[]>(
		initialUpcomingVisits
	);
	const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>(
		initialMedicalHistory
	);
	const [historyFilter, setHistoryFilter] = useState<
		"All" | "Visits" | "Tests"
	>("All");
	const [patientList, setPatientList] = useState<Patient[]>(initialPatientList);
	const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [patientFilter, setPatientFilter] = useState<
		"All" | "Stable" | "Monitoring" | "Needs Attention"
	>("All");
	const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
	const [appointmentModalData, setAppointmentModalData] = useState<{
		doctor?: string;
		visitId?: number;
		date?: string;
		time?: string;
		specialty?: string;
		details?: string;
	}>({});
	const [isReportModalOpen, setIsReportModalOpen] = useState(false);
	const [reportModalData, setReportModalData] = useState<MedicalRecord | null>(
		null
	);
	const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
	const [isEditVitalsModalOpen, setIsEditVitalsModalOpen] = useState(false);
	const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
	const [isEditRecordModalOpen, setIsEditRecordModalOpen] = useState(false);
	const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(
		null
	);
	const [isSaveChangesModalOpen, setIsSaveChangesModalOpen] = useState(false);
	const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleNavigate = (view: "dashboard" | "account") => {
		setActiveView(view);
	};

	const handleRoleSwitch = (role: "patient" | "doctor") => {
		setUserRole(role);
		setActiveView("dashboard");
		setSelectedPatient(null);
	};

	const handleAccountInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		const keys = name.split(".");

		if (keys.length > 1) {
			setPatientData((prev) => ({
				...prev,
				[keys[0]]: {
					...(prev as any)[keys[0]],
					[keys[1]]: value,
				},
			}));
		} else {
			setPatientData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSaveChanges = (e: React.FormEvent) => {
		e.preventDefault();

		const dobDate = new Date(patientData.dob);
		const today = new Date();

		if (isNaN(dobDate.getTime())) {
			alert("Please enter a valid date of birth.");
			return;
		}

		if (dobDate > today) {
			alert("Date of birth cannot be in the future.");
			return;
		}

		const ageDiff = today.getFullYear() - dobDate.getFullYear();
		if (ageDiff > 120) {
			alert("Please enter a reasonable date of birth.");
			return;
		}

		setIsSaveChangesModalOpen(true);
	};

	const confirmSaveChanges = () => {
		setActiveView("dashboard");
		setIsSaveChangesModalOpen(false);
		showSuccessMessage("Profile updated successfully");
	};

	const handleDeleteAppointment = (id: number) => {
		setUpcomingVisits((prevVisits) =>
			prevVisits.filter((visit) => visit.id !== id)
		);
		showSuccessMessage("Appointment deleted successfully");
	};

	const openAppointmentModal = (data = {}) => {
		setAppointmentModalData(data);
		setIsAppointmentModalOpen(true);
	};

	const openEditModal = (visit: Visit) => {
		openAppointmentModal({
			doctor: visit.doctor,
			visitId: visit.id,
			date: visit.date,
			time: visit.time,
			specialty: visit.specialty,
			details: visit.details,
		});
	};

	const openReportModal = (report: MedicalRecord) => {
		setReportModalData(report);
		setIsReportModalOpen(true);
	};

	const openAddRecordModal = () => {
		setIsAddRecordModalOpen(true);
	};

	const openEditRecordModal = (record: MedicalRecord) => {
		setEditingRecord(record);
		setIsEditRecordModalOpen(true);
	};

	const closeAppointmentModal = () => setIsAppointmentModalOpen(false);
	const closeReportModal = () => setIsReportModalOpen(false);
	const closeAddRecordModal = () => setIsAddRecordModalOpen(false);
	const closeEditRecordModal = () => {
		setIsEditRecordModalOpen(false);
		setEditingRecord(null);
	};

	const showSuccessMessage = (message: string) => {
		setSuccessMessage(message);
		setIsSuccessMessageVisible(true);
		setTimeout(() => {
			setIsSuccessMessageVisible(false);
		}, 3000);
	};

	const handleScheduleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const doctorInput = (form.elements.namedItem("doctor") as HTMLInputElement)
			.value;
		const dateInput = (form.elements.namedItem("date") as HTMLInputElement)
			.value;
		const timeInput = (form.elements.namedItem("time") as HTMLInputElement)
			.value;
		const specialtyInput = (
			form.elements.namedItem("specialty") as HTMLInputElement
		).value;
		const detailsInput = (
			form.elements.namedItem("details") as HTMLTextAreaElement
		).value;

		if (!doctorInput) {
			alert("Please enter a doctor's name.");
			return;
		}

		if (!dateInput) {
			alert("Please select a date for the appointment.");
			return;
		}

		if (!timeInput) {
			alert("Please select a time for the appointment.");
			return;
		}

		const appointmentDate = new Date(`${dateInput}T${timeInput}`);
		const now = new Date();

		if (appointmentDate < now) {
			alert(
				"Cannot schedule appointments in the past. Please select a future date and time."
			);
			return;
		}

		const formattedDate = new Date(dateInput).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});

		if (appointmentModalData.visitId) {
			setUpcomingVisits((prevVisits) =>
				prevVisits.map((visit) =>
					visit.id === appointmentModalData.visitId
						? {
								...visit,
								doctor: doctorInput,
								date: formattedDate,
								time: timeInput,
								specialty: specialtyInput,
								details: detailsInput,
						  }
						: visit
				)
			);
			showSuccessMessage("Appointment updated successfully!");
		} else {
			const newVisit = {
				id: Math.max(0, ...upcomingVisits.map((v) => v.id)) + 1,
				doctor: doctorInput,
				specialty: specialtyInput || "Appointment",
				date: formattedDate,
				time: timeInput,
				details: detailsInput,
			};
			setUpcomingVisits((prev) => [...prev, newVisit]);
			showSuccessMessage("Appointment scheduled successfully!");
		}

		closeAppointmentModal();
	};

	const handlePatientSelect = (patientId: string) => {
		setSelectedPatient(patientId);
	};

	const handleBackToPatientList = () => {
		setSelectedPatient(null);
	};

	const openAddPatientModal = () => {
		setIsAddPatientModalOpen(true);
	};

	const closeAddPatientModal = () => {
		setIsAddPatientModalOpen(false);
	};

	const openEditVitalsModal = () => {
		setIsEditVitalsModalOpen(true);
	};

	const closeEditVitalsModal = () => {
		setIsEditVitalsModalOpen(false);
	};

	const handleAddPatient = (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const patientName = (
			form.elements.namedItem("patientName") as HTMLInputElement
		).value;
		const ageInput = Number.parseInt(
			(form.elements.namedItem("patientAge") as HTMLInputElement).value
		);

		if (isNaN(ageInput) || ageInput <= 0 || ageInput > 120) {
			alert("Please enter a valid age between 1 and 120.");
			return;
		}

		const initials = getInitials(patientName);

		const newPatient: Patient = {
			id: `P${Math.floor(Math.random() * 1000)
				.toString()
				.padStart(3, "0")}`,
			name: patientName,
			age: ageInput,
			lastVisit: new Date().toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			}),
			condition: (
				form.elements.namedItem("patientCondition") as HTMLInputElement
			).value,
			status: (form.elements.namedItem("patientStatus") as HTMLSelectElement)
				.value,
			initials: initials,
			medicalHistory: [],
			vitals: {
				height: "N/A",
				weight: "N/A",
				bloodPressure: "N/A",
				heartRate: "N/A",
				temperature: "N/A",
				bloodGlucose: "N/A",
				bloodType: "N/A",
				cholesterol: "N/A",
			},
			upcomingAppointments: [],
			notes: "New patient. No medical history available yet.",
		};

		setPatientList((prev) => [...prev, newPatient]);
		closeAddPatientModal();
		showSuccessMessage("Patient added successfully!");
	};

	const handleSaveVitals = (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;

		if (!selectedPatient) return;

		const updatedVitals: Vitals = {
			height: (form.elements.namedItem("height") as HTMLInputElement).value,
			weight: (form.elements.namedItem("weight") as HTMLInputElement).value,
			bloodPressure: (
				form.elements.namedItem("bloodPressure") as HTMLInputElement
			).value,
			heartRate: (form.elements.namedItem("heartRate") as HTMLInputElement)
				.value,
			temperature: (form.elements.namedItem("temperature") as HTMLInputElement)
				.value,
			bloodGlucose: (
				form.elements.namedItem("bloodGlucose") as HTMLInputElement
			).value,
			bloodType: (form.elements.namedItem("bloodType") as HTMLSelectElement)
				.value,
			cholesterol: (form.elements.namedItem("cholesterol") as HTMLInputElement)
				.value,
		};

		setPatientList((prevList) =>
			prevList.map((patient) =>
				patient.id === selectedPatient
					? { ...patient, vitals: updatedVitals }
					: patient
			)
		);

		closeEditVitalsModal();
		showSuccessMessage("Patient vitals updated successfully!");
	};

	const handleAddMedicalRecord = (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;

		if (!selectedPatient) return;

		const recordType = (
			form.elements.namedItem("recordType") as HTMLSelectElement
		).value as "visit" | "test";
		const nowDate =
			new Date().toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			}) +
			", " +
			new Date().toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			});

		let newRecord: MedicalRecord;

		if (recordType === "visit") {
			newRecord = {
				id: Date.now(),
				type: "visit",
				doctor: (form.elements.namedItem("doctor") as HTMLInputElement).value,
				date: nowDate,
				specialty: (form.elements.namedItem("specialty") as HTMLInputElement)
					.value,
				diagnosis: (form.elements.namedItem("diagnosis") as HTMLInputElement)
					.value,
				prescription: (
					form.elements.namedItem("prescription") as HTMLInputElement
				).value,
				price: (form.elements.namedItem("price") as HTMLInputElement).value,
				icon: <FaUserMd className="text-[#556f44]" />,
				detailedReport: (
					form.elements.namedItem("detailedReport") as HTMLTextAreaElement
				).value,
			};
		} else {
			newRecord = {
				id: Date.now(),
				type: "test",
				testName: (form.elements.namedItem("testName") as HTMLInputElement)
					.value,
				date: nowDate,
				icon: <FaXRay className="text-[#556f44]" />,
				details: (form.elements.namedItem("details") as HTMLInputElement).value,
				detailedReport: (
					form.elements.namedItem("detailedReport") as HTMLTextAreaElement
				).value,
			};
		}

		// Add to both the patient's medical history and the general medical history
		setPatientList((prevList) =>
			prevList.map((patient) =>
				patient.id === selectedPatient
					? {
							...patient,
							medicalHistory: [...patient.medicalHistory, newRecord],
							lastVisit: new Date().toLocaleDateString("en-US", {
								month: "long",
								day: "numeric",
								year: "numeric",
							}),
					  }
					: patient
			)
		);

		setMedicalHistory((prev) => [...prev, newRecord]);
		closeAddRecordModal();
		showSuccessMessage("Medical record added successfully!");
	};

	const handleEditMedicalRecord = (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;

		if (!editingRecord) return;

		const recordType = editingRecord.type;
		let updatedRecord: MedicalRecord;

		if (recordType === "visit") {
			updatedRecord = {
				...editingRecord,
				doctor: (form.elements.namedItem("doctor") as HTMLInputElement).value,
				specialty: (form.elements.namedItem("specialty") as HTMLInputElement)
					.value,
				diagnosis: (form.elements.namedItem("diagnosis") as HTMLInputElement)
					.value,
				prescription: (
					form.elements.namedItem("prescription") as HTMLInputElement
				).value,
				price: (form.elements.namedItem("price") as HTMLInputElement).value,
				detailedReport: (
					form.elements.namedItem("detailedReport") as HTMLTextAreaElement
				).value,
			};
		} else {
			updatedRecord = {
				...editingRecord,
				testName: (form.elements.namedItem("testName") as HTMLInputElement)
					.value,
				details: (form.elements.namedItem("details") as HTMLInputElement).value,
				detailedReport: (
					form.elements.namedItem("detailedReport") as HTMLTextAreaElement
				).value,
			};
		}

		// Update in both places
		if (selectedPatient) {
			setPatientList((prevList) =>
				prevList.map((patient) =>
					patient.id === selectedPatient
						? {
								...patient,
								medicalHistory: patient.medicalHistory.map((record) =>
									record.id === editingRecord.id ? updatedRecord : record
								),
						  }
						: patient
				)
			);
		}

		setMedicalHistory((prev) =>
			prev.map((record) =>
				record.id === editingRecord.id ? updatedRecord : record
			)
		);

		closeEditRecordModal();
		showSuccessMessage("Medical record updated successfully!");
	};

	const handleSavePatientNotes = (patientId: string, notes: string) => {
		setPatientList((prevList) =>
			prevList.map((patient) =>
				patient.id === patientId ? { ...patient, notes: notes } : patient
			)
		);
		showSuccessMessage("Patient notes saved successfully!");
	};

	const filteredPatients = patientList.filter((patient) => {
		const matchesSearch =
			patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			patient.id.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter =
			patientFilter === "All" || patient.status === patientFilter;
		return matchesSearch && matchesFilter;
	});

	const filteredMedicalHistory = medicalHistory.filter((item) => {
		if (historyFilter === "All") return true;
		if (historyFilter === "Visits") return item.type === "visit";
		if (historyFilter === "Tests") return item.type === "test";
		return true;
	});

	const selectedPatientData = selectedPatient
		? patientList.find((p) => p.id === selectedPatient)
		: null;

	return (
		<div className="min-h-screen bg-slate-100 text-gray-900 p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
			<motion.nav
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 bg-white p-3 sm:p-4 rounded-lg shadow-md gap-3 sm:gap-0 border border-gray-200/75"
			>
				<div className="flex items-center gap-2 sm:gap-3">
					<motion.div whileHover={iconHover}>
						<FiBarChart2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#556f44]" />
					</motion.div>
					<h1 className="text-lg sm:text-2xl font-bold text-gray-900">
						{userRole === "patient" ? "Patient Portal" : "Doctor Portal"}
					</h1>
				</div>

				<div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-auto">
					{userRole === "patient" && (
						<div className="flex gap-2 mt-2 sm:mt-0 sm:ml-2">
							<motion.button
								whileHover={buttonHover}
								onClick={() => handleNavigate("dashboard")}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium transition-colors duration-300 cursor-pointer ${
									activeView === "dashboard"
										? "bg-[#556f44] text-white"
										: "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
								}`}
							>
								Dashboard
							</motion.button>
							<motion.button
								whileHover={buttonHover}
								onClick={() => handleNavigate("account")}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium transition-colors duration-300 cursor-pointer ${
									activeView === "account"
										? "bg-[#556f44] text-white"
										: "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
								}`}
							>
								<FiUser className="inline mr-1 mb-0.5" /> Account
							</motion.button>
						</div>
					)}

					{userRole === "doctor" && selectedPatient && (
						<motion.button
							whileHover={buttonHover}
							onClick={handleBackToPatientList}
							className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 mt-2 sm:mt-0 sm:ml-2 cursor-pointer"
						>
							<FiArrowLeft className="inline mr-1 mb-0.5" /> Back to Patients
						</motion.button>
					)}

					<div className="bg-gray-100 p-1 rounded-lg flex gap-1">
						<motion.button
							whileHover={buttonHover}
							onClick={() => handleRoleSwitch("patient")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 cursor-pointer ${
								userRole === "patient"
									? "bg-[#556f44] text-white"
									: "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
							}`}
						>
							<FiUser className="inline mr-1 mb-0.5" /> Patient
						</motion.button>
						<motion.button
							whileHover={buttonHover}
							onClick={() => handleRoleSwitch("doctor")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 cursor-pointer ${
								userRole === "doctor"
									? "bg-[#556f44] text-white"
									: "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
							}`}
						>
							<FaUserMd className="inline mr-1 mb-0.5" /> Doctor
						</motion.button>
					</div>
				</div>
			</motion.nav>
			{/* Success Message Toast */}
			<AnimatePresence>
				{isSuccessMessageVisible && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md flex items-center"
					>
						<FiCheckCircle className="mr-2" />
						<span>{successMessage}</span>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence mode="wait">
				{userRole === "patient" && activeView === "dashboard" && (
					<motion.div
						key="patient-dashboard-view"
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.4 }}
						className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
					>
						<motion.div
							variants={cardVariants}
							initial="hidden"
							animate="visible"
							className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200/75 flex flex-col"
						>
							<div className="flex flex-col items-center gap-4 mb-8">
								<motion.div
									initial={{ scale: 0.8 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 150 }}
									className="relative"
								>
									<div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#556f44] to-[#283F3B] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
										{getInitials(patientData.name)}
									</div>
									<div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
										<FiEdit className="w-5 h-5 text-[#556f44] cursor-pointer hover:text-[#283F3B] transition-colors" />
									</div>
								</motion.div>
								<div className="text-center">
									<h2 className="text-2xl font-bold text-gray-900 mb-1">
										{patientData.name}
									</h2>
									<div className="flex items-center justify-center gap-2 text-sm text-gray-600">
										<span>Male</span>
										<span className="w-1 h-1 rounded-full bg-gray-400"></span>
										<span>DOB: {patientData.dob}</span>
									</div>
									<div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
										<span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
										Active Patient
									</div>
								</div>
							</div>

							<div className="space-y-6">
								<div className="bg-gray-50 rounded-xl p-4">
									<h3 className="text-lg font-semibold mb-4 text-[#283F3B] flex items-center gap-2">
										<FiUser className="text-[#556f44]" /> Contact Information
									</h3>
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
												<FiUser className="text-[#556f44]" />
											</div>
											<div>
												<p className="text-xs text-gray-500">Phone</p>
												<p className="text-sm font-medium text-gray-900">
													{patientData.contacts.phone}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
												<FiUser className="text-[#556f44]" />
											</div>
											<div>
												<p className="text-xs text-gray-500">Address</p>
												<p className="text-sm font-medium text-gray-900">
													{patientData.contacts.address}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
												<FiUser className="text-[#556f44]" />
											</div>
											<div>
												<p className="text-xs text-gray-500">Email</p>
												<a
													href={`mailto:${patientData.contacts.email}`}
													className="text-sm font-medium text-[#556f44] hover:text-[#283F3B] transition-colors"
												>
													{patientData.contacts.email}
												</a>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-gray-50 rounded-xl p-4">
									<h3 className="text-lg font-semibold mb-4 text-[#283F3B] flex items-center gap-2">
										<FaHeartbeat className="text-[#556f44]" /> Vital Signs
									</h3>
									<div className="grid grid-cols-2 gap-4">
										<motion.div
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.1 }}
											className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
										>
											<div className="flex items-center gap-2 mb-1">
												<FaHeartbeat className="text-[#556f44]" />
												<p className="text-xs text-gray-600">Height</p>
											</div>
											<p className="text-lg font-semibold text-gray-900">
												{patientData.height}
											</p>
										</motion.div>
										<motion.div
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.2 }}
											className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
										>
											<div className="flex items-center gap-2 mb-1">
												<FaHeartbeat className="text-[#556f44]" />
												<p className="text-xs text-gray-600">Weight</p>
											</div>
											<p className="text-lg font-semibold text-gray-900">
												{patientData.weight}
											</p>
										</motion.div>
										<motion.div
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.3 }}
											className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
										>
											<div className="flex items-center gap-2 mb-1">
												<FaTint className="text-[#556f44]" />
												<p className="text-xs text-gray-600">Blood Group</p>
											</div>
											<p className="text-lg font-semibold text-gray-900">
												{patientData.bloodGroup}
											</p>
										</motion.div>
										<motion.div
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.4 }}
											className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
										>
											<div className="flex items-center gap-2 mb-1">
												<FaTint className="text-[#556f44]" />
												<p className="text-xs text-gray-600">Blood Sugar</p>
											</div>
											<p className="text-lg font-semibold text-gray-900">
												{patientData.lastBloodSugar}
											</p>
										</motion.div>
									</div>
								</div>

								<div className="bg-gray-50 rounded-xl p-4">
									<h3 className="text-lg font-semibold mb-4 text-[#283F3B] flex items-center gap-2">
										<FiBarChart2 className="text-[#556f44]" /> Medical Notes
									</h3>
									<textarea
										className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-1 focus:ring-[#556f44] focus:border-[#556f44] h-32 resize-none"
										placeholder="Add medical notes here..."
										defaultValue="Patient has been responding well to current treatment plan. Blood pressure has stabilized but continue monitoring. Discussed lifestyle changes during last visit."
									></textarea>
								</div>

								<motion.div
									variants={cardVariants}
									initial="hidden"
									animate="visible"
									transition={{ delay: 0.5 }}
									className="bg-gray-50 rounded-xl p-4"
								>
									<h3 className="text-lg font-semibold mb-4 text-[#283F3B] flex items-center gap-2">
										<FiBarChart2 className="text-[#556f44]" /> Health Trends
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<SimpleGraph
											title="Sugar Level"
											currentValue={parseFloat(patientData.lastBloodSugar) || 0}
											unit="mg/dL"
											icon={<FaTint />}
											normalMin={70}
											normalMax={100}
											lowThreshold={70}
											borderlineMax={125}
											barVisualMin={40}
											barVisualMax={180}
										/>
										<SimpleGraph
											title="Cholesterol"
											currentValue={
												parseFloat(patientData.lastCholesterol) || 0
											}
											unit="mg/dL"
											icon={<FaHeartbeat />}
											normalMin={0}
											normalMax={199}
											borderlineMax={239}
											barVisualMin={100}
											barVisualMax={300}
										/>
									</div>
								</motion.div>
							</div>
						</motion.div>

						<motion.div
							variants={cardVariants}
							initial="hidden"
							animate="visible"
							transition={{ delay: 0.1 }}
							className="lg:col-span-2 bg-white p-6 h-fit rounded-xl shadow-lg border border-gray-200/75 flex flex-col"
						>
							<div className="flex flex-col gap-4 mb-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-gray-50 rounded-lg">
										<FiCalendar className="w-6 h-6 text-[#556f44]" />
									</div>
									<div>
										<h3 className="text-xl font-semibold text-[#283F3B]">
											Upcoming Visits
										</h3>
										<p className="text-sm text-gray-600">
											View and manage your scheduled appointments
										</p>
									</div>
								</div>
								<div className="flex justify-end">
									<motion.button
										whileHover={buttonHover}
										onClick={() => openAppointmentModal()}
										className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
									>
										<FiPlusCircle /> Schedule New
									</motion.button>
								</div>
							</div>

							<div className="space-y-4 flex-grow overflow-y-auto max-h-[600px] rounded-xl p-2 sm:p-4 border-2 border-gray-100 pr-2">
								<AnimatePresence>
									{upcomingVisits.map((visit, index) => (
										<motion.div
											key={visit.id}
											layout
											custom={index}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
											exit={{
												opacity: 0,
												x: 50,
												transition: { duration: 0.3 },
											}}
											className="bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
										>
											<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
												<div className="flex items-start gap-3 sm:gap-4 w-full">
													<div className="p-2 sm:p-3 bg-gray-50 rounded-lg shrink-0">
														<FiCalendar className="text-[#556f44] w-5 h-5 sm:w-6 sm:h-6" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
															<h4 className="font-semibold text-gray-900 truncate">
																{visit.doctor}
															</h4>
															<span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full w-fit">
																{visit.specialty}
															</span>
														</div>
														<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-600">
															<div className="flex items-center gap-1">
																<FiCalendar className="w-4 h-4" />
																<span>{visit.date}</span>
															</div>
															<div className="flex items-center gap-1">
																<FiClock className="w-4 h-4" />
																<span>{visit.time}</span>
															</div>
														</div>
														{visit.details && (
															<p className="mt-2 text-sm text-gray-600 line-clamp-2">
																{visit.details}
															</p>
														)}
													</div>
												</div>
												<div className="flex gap-2 self-end sm:self-auto">
													<motion.button
														whileHover={iconHover}
														onClick={() => openEditModal(visit)}
														className="p-2 text-gray-600 hover:text-[#556f44] hover:bg-gray-50 rounded-lg transition-colors duration-200"
													>
														<FiEdit className="w-4 h-4" />
													</motion.button>
													<motion.button
														whileHover={iconHover}
														onClick={() => handleDeleteAppointment(visit.id)}
														className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
													>
														<FiTrash2 className="w-4 h-4" />
													</motion.button>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
								{upcomingVisits.length === 0 && (
									<div className="text-center py-8">
										<div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
											<FiCalendar className="w-8 h-8 text-gray-400" />
										</div>
										<p className="text-gray-500 mb-2">
											No upcoming visits scheduled
										</p>
										<motion.button
											whileHover={buttonHover}
											onClick={() => openAppointmentModal()}
											className="text-[#556f44] hover:text-[#283F3B] font-medium flex items-center gap-2 mx-auto"
										>
											<FiPlusCircle /> Schedule your first visit
										</motion.button>
									</div>
								)}
							</div>

							<div className="mt-8">
								<h3 className="text-xl font-semibold mb-5 text-[#283F3B] border-b border-gray-200 pb-2">
									Health Statistics
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
									<StatCard
										title="Blood Pressure"
										value="120/80"
										change="+2%"
										isPositive={true}
										icon={<FaHeartbeat className="text-[#556f44]" />}
									/>
									<StatCard
										title="Heart Rate"
										value="72 bpm"
										change="-3%"
										isPositive={true}
										icon={<FaHeartbeat className="text-[#556f44]" />}
									/>
									<StatCard
										title="Blood Sugar"
										value="90 mg/dL"
										change="+5%"
										isPositive={false}
										icon={<FaTint className="text-[#556f44]" />}
									/>
									<StatCard
										title="Weight"
										value="75 kg"
										change="-1.5%"
										isPositive={true}
										icon={<FiBarChart2 className="text-[#556f44]" />}
									/>
								</div>
							</div>

							<div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200/75">
								<div className="flex justify-between items-center mb-6">
									<h3 className="text-xl font-semibold text-[#283F3B] flex items-center gap-2">
										<FiBell className="text-[#556f44]" /> Recent Notifications
									</h3>
									<motion.button
										whileHover={buttonHover}
										className="text-sm text-[#556f44] hover:text-[#283F3B] font-medium flex items-center gap-2"
									>
										View All
									</motion.button>
								</div>

								<div className="space-y-4">
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 }}
										className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100"
									>
										<div className="p-2 bg-blue-100 rounded-lg">
											<FiCalendar className="w-5 h-5 text-blue-600" />
										</div>
										<div className="flex-1">
											<h4 className="font-medium text-blue-900">
												Upcoming Appointment Reminder
											</h4>
											<p className="text-sm text-blue-700 mt-1">
												Your appointment with Dr. Amanda Rodriguez is scheduled
												for tomorrow at 12:15 PM.
											</p>
											<p className="text-xs text-blue-600 mt-2">2 hours ago</p>
										</div>
									</motion.div>

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100"
									>
										<div className="p-2 bg-green-100 rounded-lg">
											<FaHeartbeat className="w-5 h-5 text-green-600" />
										</div>
										<div className="flex-1">
											<h4 className="font-medium text-green-900">
												Test Results Available
											</h4>
											<p className="text-sm text-green-700 mt-1">
												Your recent blood test results are now available. Click
												to view detailed report.
											</p>
											<p className="text-xs text-green-600 mt-2">1 day ago</p>
										</div>
									</motion.div>
								</div>
							</div>
						</motion.div>

						<motion.div
							variants={cardVariants}
							initial="hidden"
							animate="visible"
							transition={{ delay: 0.2 }}
							className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg border border-gray-200/75"
						>
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
								<div className="flex items-center gap-2 sm:gap-3">
									<div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
										<FiBarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#556f44]" />
									</div>
									<div>
										<h3 className="text-lg sm:text-xl font-semibold text-[#283F3B]">
											Medical History Records
										</h3>
										<p className="text-sm text-gray-600 mt-1 hidden sm:block">
											View and manage patient medical records
										</p>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
									<div className="flex items-center gap-2 w-full sm:w-auto">
										<span className="text-sm text-gray-600 whitespace-nowrap">
											Show:
										</span>
										<select
											value={historyFilter}
											onChange={(e) =>
												setHistoryFilter(
													e.target.value as "All" | "Visits" | "Tests"
												)
											}
											className="w-full sm:w-auto bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-[#556f44] focus:border-[#556f44] p-2 appearance-none cursor-pointer pl-3 pr-8"
										>
											<option value="All">All Records</option>
											<option value="Visits">Doctor Visits</option>
											<option value="Tests">Medical Tests</option>
										</select>
									</div>
									<motion.button
										whileHover={buttonHover}
										onClick={openAddRecordModal}
										className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
									>
										<FiPlusCircle className="w-4 h-4" />
										Add Record
									</motion.button>
								</div>
							</div>

							<div className="overflow-x-auto -mx-6 sm:mx-0">
								<div className="min-w-full inline-block align-middle">
									<div className="overflow-hidden">
										<table className="min-w-full divide-y divide-gray-200">
											<thead>
												<tr>
													<th className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
														Type
													</th>
													<th className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
														Details
													</th>
													<th className="hidden sm:table-cell px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
														Date
													</th>
													<th className="hidden sm:table-cell px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
														Status
													</th>
													<th className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
														Actions
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{filteredMedicalHistory.map((record) => (
													<motion.tr
														key={record.id}
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														className="hover:bg-gray-50 transition-colors duration-200"
													>
														<td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="p-2 bg-gray-50 rounded-lg mr-3">
																	{record.icon}
																</div>
																<span className="text-sm font-medium text-gray-900">
																	{record.type === "visit"
																		? "Doctor Visit"
																		: "Medical Test"}
																</span>
															</div>
														</td>
														<td className="px-3 sm:px-6 py-3 sm:py-4">
															<div className="text-sm text-gray-900">
																{record.type === "visit"
																	? record.diagnosis
																	: record.testName}
															</div>
															{record.type === "visit" && (
																<div className="text-xs text-gray-500 mt-1">
																	{record.doctor} • {record.specialty}
																</div>
															)}
															<div className="sm:hidden text-xs text-gray-500 mt-1">
																{record.date}
															</div>
															<div className="sm:hidden mt-1">
																<span
																	className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
																		record.type === "visit"
																			? "bg-green-100 text-green-800"
																			: "bg-blue-100 text-blue-800"
																	}`}
																>
																	{record.type === "visit"
																		? "Completed"
																		: "Results Available"}
																</span>
															</div>
														</td>
														<td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">
																{record.date}
															</div>
														</td>
														<td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
															<span
																className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
																	record.type === "visit"
																		? "bg-green-100 text-green-800"
																		: "bg-blue-100 text-blue-800"
																}`}
															>
																{record.type === "visit"
																	? "Completed"
																	: "Results Available"}
															</span>
														</td>
														<td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
															<div className="flex items-center gap-2 sm:gap-3">
																<motion.button
																	whileHover={iconHover}
																	onClick={() => openReportModal(record)}
																	className="p-2 text-gray-600 hover:text-[#556f44] hover:bg-gray-50 rounded-lg transition-colors duration-200"
																>
																	<FiEye className="w-4 h-4" />
																</motion.button>
																<motion.button
																	whileHover={iconHover}
																	onClick={() => openEditRecordModal(record)}
																	className="p-2 text-gray-600 hover:text-[#556f44] hover:bg-gray-50 rounded-lg transition-colors duration-200"
																>
																	<FiEdit className="w-4 h-4" />
																</motion.button>
															</div>
														</td>
													</motion.tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}

				{userRole === "patient" && activeView === "account" && (
					<motion.div
						key="patient-account-view"
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.4 }}
						className="max-w-4xl mx-auto"
					>
						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/75 mb-6">
							<div className="flex items-center gap-4 mb-6">
								<motion.div
									initial={{ scale: 0.8 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 150 }}
									className="relative"
								>
									<div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#556f44] to-[#283F3B] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
										{getInitials(patientData.name)}
									</div>
									<motion.button
										whileHover={{ scale: 1.1 }}
										className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-gray-200"
									>
										<FiEdit className="w-5 h-5 text-[#556f44]" />
									</motion.button>
								</motion.div>
								<div>
									<h2 className="text-2xl font-bold text-gray-900">
										{patientData.name}
									</h2>
									<p className="text-gray-600">Patient ID: {patientData.id}</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-6">
									<div>
										<h3 className="text-lg font-semibold text-[#283F3B] mb-4 flex items-center gap-2">
											<FiUser className="text-[#556f44]" /> Personal Information
										</h3>
										<div className="space-y-4">
											<div>
												<label
													htmlFor="name"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Full Name
												</label>
												<input
													type="text"
													id="name"
													name="name"
													value={patientData.name}
													onChange={handleAccountInputChange}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												/>
											</div>
											<div>
												<label
													htmlFor="dob"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Date of Birth
												</label>
												<input
													type="date"
													id="dob"
													name="dob"
													max={new Date().toISOString().split("T")[0]}
													value={patientData.dob}
													onChange={handleAccountInputChange}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												/>
											</div>
										</div>
									</div>

									<div>
										<h3 className="text-lg font-semibold text-[#283F3B] mb-4 flex items-center gap-2">
											<FiUser className="text-[#556f44]" /> Medical Information
										</h3>
										<div className="space-y-4">
											<div>
												<label
													htmlFor="bloodGroup"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Blood Group
												</label>
												<select
													id="bloodGroup"
													name="bloodGroup"
													value={patientData.bloodGroup}
													onChange={handleAccountInputChange}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												>
													<option value="A+">A+</option>
													<option value="A-">A-</option>
													<option value="B+">B+</option>
													<option value="B-">B-</option>
													<option value="AB+">AB+</option>
													<option value="AB-">AB-</option>
													<option value="O+">O+</option>
													<option value="O-">O-</option>
												</select>
											</div>
											<div>
												<label
													htmlFor="allergies"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Allergies
												</label>
												<input
													type="text"
													id="allergies"
													name="allergies"
													placeholder="Enter any allergies (comma separated)"
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="space-y-6">
									<div>
										<h3 className="text-lg font-semibold text-[#283F3B] mb-4 flex items-center gap-2">
											<FiUser className="text-[#556f44]" /> Contact Information
										</h3>
										<div className="space-y-4">
											<div>
												<label
													htmlFor="contacts.phone"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Phone Number
												</label>
												<input
													type="tel"
													id="contacts.phone"
													name="contacts.phone"
													value={patientData.contacts.phone}
													onChange={handleAccountInputChange}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												/>
											</div>
											<div>
												<label
													htmlFor="contacts.email"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Email Address
												</label>
												<input
													type="email"
													id="contacts.email"
													name="contacts.email"
													value={patientData.contacts.email}
													onChange={handleAccountInputChange}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												/>
											</div>
											<div>
												<label
													htmlFor="contacts.address"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Address
												</label>
												<textarea
													id="contacts.address"
													name="contacts.address"
													value={patientData.contacts.address}
													onChange={handleAccountInputChange}
													rows={3}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200 resize-none"
												/>
											</div>
										</div>
									</div>

									<div>
										<h3 className="text-lg font-semibold text-[#283F3B] mb-4 flex items-center gap-2">
											<FiUser className="text-[#556f44]" /> Emergency Contact
										</h3>
										<div className="space-y-4">
											<div>
												<label
													htmlFor="emergencyName"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Contact Name
												</label>
												<input
													type="text"
													id="emergencyName"
													name="emergencyName"
													placeholder="Enter emergency contact name"
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												/>
											</div>
											<div>
												<label
													htmlFor="emergencyPhone"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Contact Phone
												</label>
												<input
													type="tel"
													id="emergencyPhone"
													name="emergencyPhone"
													placeholder="Enter emergency contact phone"
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												/>
											</div>
											<div>
												<label
													htmlFor="emergencyRelation"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Relationship
												</label>
												<input
													type="text"
													id="emergencyRelation"
													name="emergencyRelation"
													placeholder="Enter relationship"
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
								<motion.button
									whileHover={buttonHover}
									onClick={() => handleNavigate("dashboard")}
									className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
								>
									Cancel
								</motion.button>
								<motion.button
									whileHover={buttonHover}
									onClick={handleSaveChanges}
									className="px-6 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
								>
									Save Changes
								</motion.button>
							</div>
						</div>

						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/75">
							<h3 className="text-lg font-semibold text-[#283F3B] mb-4 flex items-center gap-2">
								<FiAlertCircle className="text-[#556f44]" /> Account Security
							</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
									<div>
										<h4 className="font-medium text-gray-900">Password</h4>
										<p className="text-sm text-gray-600">
											Last changed 3 months ago
										</p>
									</div>
									<motion.button
										whileHover={buttonHover}
										className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
									>
										Change Password
									</motion.button>
								</div>
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
									<div>
										<h4 className="font-medium text-gray-900">
											Two-Factor Authentication
										</h4>
										<p className="text-sm text-gray-600">
											Add an extra layer of security to your account
										</p>
									</div>
									<motion.button
										whileHover={buttonHover}
										className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
									>
										Enable 2FA
									</motion.button>
								</div>
							</div>
						</div>
					</motion.div>
				)}

				{userRole === "doctor" && !selectedPatient && (
					<motion.div
						key="doctor-patient-list-view"
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.4 }}
						className="space-y-6"
					>
						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/75">
							<div className="flex flex-col gap-4 mb-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-gray-50 rounded-lg">
										<FaUserMd className="w-6 h-6 text-[#556f44]" />
									</div>
									<div>
										<h2 className="text-xl font-semibold text-[#283F3B]">
											Patient List
										</h2>
										<p className="text-sm text-gray-600">
											Manage your patients and their records
										</p>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-4 w-full">
									<div className="relative flex-grow">
										<div className="relative">
											<input
												type="text"
												placeholder="Search patients..."
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200 bg-white"
											/>
											<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
											{searchQuery && (
												<motion.button
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													whileHover={{ scale: 1.1 }}
													onClick={() => setSearchQuery("")}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
												>
													<FiX className="w-4 h-4" />
												</motion.button>
											)}
										</div>
									</div>
									<div className="flex flex-col sm:flex-row gap-2">
										<div className="relative flex-grow sm:flex-grow-0">
											<select
												value={patientFilter}
												onChange={(e) =>
													setPatientFilter(
														e.target.value as
															| "All"
															| "Stable"
															| "Monitoring"
															| "Needs Attention"
													)
												}
												className="w-full sm:w-40 appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200 bg-white cursor-pointer"
											>
												<option value="All">All Patients</option>
												<option value="Stable">Stable</option>
												<option value="Monitoring">Monitoring</option>
												<option value="Needs Attention">Needs Attention</option>
											</select>
											<div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
												<svg
													className="w-4 h-4 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</div>
										</div>
										<motion.button
											whileHover={buttonHover}
											onClick={openAddPatientModal}
											className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
										>
											<FiUserPlus className="w-4 h-4" />
											Add Patient
										</motion.button>
									</div>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">Total Patients:</span>
									<span className="text-sm font-semibold text-gray-900">
										{filteredPatients.length}
									</span>
								</div>
								<div className="flex flex-wrap items-center gap-4">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										<span className="text-sm text-gray-600">Stable</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-yellow-500"></span>
										<span className="text-sm text-gray-600">Monitoring</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-red-500"></span>
										<span className="text-sm text-gray-600">
											Needs Attention
										</span>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{filteredPatients.map((patient) => (
									<motion.div
										key={patient.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										whileHover={{ y: -5 }}
										className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
										onClick={() => handlePatientSelect(patient.id)}
									>
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#556f44] to-[#283F3B] flex items-center justify-center text-white text-lg font-bold shadow-md">
												{patient.initials}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between mb-1">
													<h3 className="text-lg font-semibold text-gray-900 truncate">
														{patient.name}
													</h3>
													<span
														className={`px-2 py-1 text-xs font-medium rounded-full ${
															patient.status === "Stable"
																? "bg-green-100 text-green-800"
																: patient.status === "Monitoring"
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
														}`}
													>
														{patient.status}
													</span>
												</div>
												<p className="text-sm text-gray-600 mb-2">
													{patient.age} years • {patient.condition}
												</p>
												<div className="flex items-center gap-4 text-sm text-gray-500">
													<div className="flex items-center gap-1">
														<FiCalendar className="w-4 h-4" />
														<span>Last Visit: {patient.lastVisit}</span>
													</div>
												</div>
											</div>
										</div>
										<div className="mt-4 pt-4 border-t border-gray-100">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<FiClock className="w-4 h-4 text-gray-400" />
													<span className="text-sm text-gray-600">
														{patient.upcomingAppointments.length} upcoming
													</span>
												</div>
												<motion.button
													whileHover={iconHover}
													onClick={(e) => {
														e.stopPropagation();
														handlePatientSelect(patient.id);
													}}
													className="p-2 text-gray-600 hover:text-[#556f44] hover:bg-gray-50 rounded-lg transition-colors duration-200"
												>
													<FiEye className="w-4 h-4" />
												</motion.button>
											</div>
										</div>
									</motion.div>
								))}
								{filteredPatients.length === 0 && (
									<div className="col-span-full text-center py-12">
										<div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
											<FiUserPlus className="w-8 h-8 text-gray-400" />
										</div>
										<p className="text-gray-500 mb-2">No patients found</p>
										<motion.button
											whileHover={buttonHover}
											onClick={openAddPatientModal}
											className="text-[#556f44] hover:text-[#283F3B] font-medium flex items-center gap-2 mx-auto"
										>
											<FiUserPlus /> Add your first patient
										</motion.button>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				)}

				{userRole === "doctor" && selectedPatient && selectedPatientData && (
					<motion.div
						key="doctor-patient-details-view"
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.4 }}
						className="space-y-6"
					>
						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/75">
							<div className="flex items-center gap-4 mb-6">
								<motion.button
									whileHover={buttonHover}
									onClick={handleBackToPatientList}
									className="p-2 text-gray-600 hover:text-[#556f44] hover:bg-gray-50 rounded-lg transition-colors duration-200"
								>
									<FiArrowLeft className="w-6 h-6" />
								</motion.button>
								<div className="flex-1">
									<h2 className="text-2xl font-bold text-gray-900">
										{selectedPatientData.name}
									</h2>
									<p className="text-gray-600">
										Patient ID: {selectedPatientData.id}
									</p>
								</div>
								<motion.button
									whileHover={buttonHover}
									onClick={() => openEditVitalsModal()}
									className="px-4 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 flex items-center gap-2 hidden sm:flex"
								>
									<FiEdit className="w-4 h-4" />
									Edit Vitals
								</motion.button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<div className="lg:col-span-2 space-y-6">
									<div className="bg-gray-50 rounded-xl p-4">
										<div className="flex justify-between items-center mb-4">
											<h3 className="text-lg font-semibold text-[#283F3B] flex items-center gap-2">
												<FaHeartbeat className="text-[#556f44]" /> Vital Signs
											</h3>
											<motion.button
												whileHover={buttonHover}
												onClick={() => openEditVitalsModal()}
												className="px-3 py-1 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 flex items-center gap-1 text-sm sm:hidden"
											>
												<FiEdit className="w-3 h-3" />
												Edit
											</motion.button>
										</div>
										<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
											{Object.entries(selectedPatientData.vitals).map(
												([key, value], index) => (
													<motion.div
														key={key}
														initial={{ opacity: 0, scale: 0.9 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{ delay: index * 0.05 }}
														className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
													>
														<div className="flex items-center gap-2 mb-1">
															<FaHeartbeat className="text-[#556f44]" />
															<p className="text-xs text-gray-600">
																{key
																	.replace(/([A-Z])/g, " $1")
																	.replace(/^./, (str) => str.toUpperCase())}
															</p>
														</div>
														<p className="text-lg font-semibold text-gray-900">
															{value}
														</p>
													</motion.div>
												)
											)}
										</div>
									</div>

									<div className="bg-gray-50 rounded-xl p-4">
										<h3 className="text-lg font-semibold text-[#283F3B] mb-4 flex items-center gap-2">
											<FiCalendar className="text-[#556f44]" /> Upcoming
											Appointments
										</h3>
										<div className="space-y-4">
											{selectedPatientData.upcomingAppointments.map(
												(appointment) => (
													<motion.div
														key={appointment.id}
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
													>
														<div className="flex justify-between items-start">
															<div>
																<h4 className="font-semibold text-gray-900">
																	{appointment.doctor}
																</h4>
																<p className="text-sm text-gray-600">
																	{appointment.specialty}
																</p>
																<div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
																	<div className="flex items-center gap-1">
																		<FiCalendar className="w-4 h-4" />
																		<span>{appointment.date}</span>
																	</div>
																	<div className="flex items-center gap-1">
																		<FiClock className="w-4 h-4" />
																		<span>{appointment.time}</span>
																	</div>
																</div>
															</div>
															<div className="flex gap-2">
																<motion.button
																	whileHover={iconHover}
																	onClick={() => openEditModal(appointment)}
																	className="p-2 text-gray-600 hover:text-[#556f44] hover:bg-gray-50 rounded-lg transition-colors duration-200"
																>
																	<FiEdit className="w-4 h-4" />
																</motion.button>
																<motion.button
																	whileHover={iconHover}
																	onClick={() =>
																		handleDeleteAppointment(appointment.id)
																	}
																	className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
																>
																	<FiTrash2 className="w-4 h-4" />
																</motion.button>
															</div>
														</div>
													</motion.div>
												)
											)}
											{selectedPatientData.upcomingAppointments.length ===
												0 && (
												<div className="text-center py-8">
													<div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
														<FiCalendar className="w-8 h-8 text-gray-400" />
													</div>
													<p className="text-gray-500 mb-2">
														No upcoming appointments
													</p>
													<motion.button
														whileHover={buttonHover}
														onClick={() => openAppointmentModal()}
														className="text-[#556f44] hover:text-[#283F3B] font-medium flex items-center gap-2 mx-auto"
													>
														<FiPlusCircle /> Schedule an appointment
													</motion.button>
												</div>
											)}
										</div>
									</div>

									<div className="bg-gray-50 rounded-xl p-4 mt-6">
										<div className="flex justify-between items-center mb-4">
											<h3 className="text-lg font-semibold text-[#283F3B] flex items-center gap-2">
												<FiBarChart2 className="text-[#556f44]" /> Key Health
												Indicators
											</h3>
											<motion.button
												whileHover={buttonHover}
												onClick={() => openAddRecordModal()}
												className="px-3 py-1 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 flex items-center gap-1 text-sm"
											>
												<FiPlusCircle className="w-3 h-3" />
												Add Record
											</motion.button>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<SimpleGraph
												title="Blood Glucose"
												currentValue={
													parseFloat(selectedPatientData.vitals.bloodGlucose) ||
													0
												}
												unit="mg/dL"
												icon={<FaTint />}
												normalMin={70}
												normalMax={100}
												lowThreshold={70}
												borderlineMax={125}
												barVisualMin={40}
												barVisualMax={180}
											/>
											<SimpleGraph
												title="Cholesterol"
												currentValue={
													parseFloat(selectedPatientData.vitals.cholesterol) ||
													0
												}
												unit="mg/dL"
												icon={<FaHeartbeat />}
												normalMin={0}
												normalMax={199}
												borderlineMax={239}
												barVisualMin={100}
												barVisualMax={300}
											/>
										</div>
									</div>

									<div className="bg-gray-50 rounded-xl p-4">
										<div className="flex justify-between items-center mb-4">
											<h3 className="text-lg font-semibold text-[#283F3B] flex items-center gap-2">
												<FaNotesMedical className="text-[#556f44]" /> Medical
												History
											</h3>
										</div>

										<div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
											{selectedPatientData.medicalHistory.length > 0 ? (
												selectedPatientData.medicalHistory.map((record) => (
													<motion.div
														key={record.id}
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
													>
														<div className="flex justify-between items-start">
															<div className="flex items-start gap-3">
																<div className="p-2 bg-gray-50 rounded-full">
																	{record.icon}
																</div>
																<div>
																	<h4 className="font-semibold text-gray-900">
																		{record.type === "visit"
																			? record.diagnosis
																			: record.testName}
																	</h4>
																	<p className="text-sm text-gray-600">
																		{record.type === "visit"
																			? `${record.doctor} • ${record.specialty}`
																			: record.details}
																	</p>
																	<p className="text-xs text-gray-500 mt-1">
																		{record.date}
																	</p>
																</div>
															</div>
															<div className="flex gap-2">
																<motion.button
																	whileHover={iconHover}
																	onClick={() => openReportModal(record)}
																	className="p-2 text-gray-600 hover:text-[#556f44] hover:bg-gray-50 rounded-lg transition-colors duration-200"
																>
																	<FiEye className="w-4 h-4" />
																</motion.button>
																<motion.button
																	whileHover={iconHover}
																	onClick={() => openEditRecordModal(record)}
																	className="p-2 text-gray-600 hover:text-[#556f44] hover:bg-gray-50 rounded-lg transition-colors duration-200"
																>
																	<FiEdit className="w-4 h-4" />
																</motion.button>
															</div>
														</div>
													</motion.div>
												))
											) : (
												<div className="text-center py-8">
													<div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
														<FaFileMedical className="w-8 h-8 text-gray-400" />
													</div>
													<p className="text-gray-500 mb-2">
														No medical history available
													</p>
													<motion.button
														whileHover={buttonHover}
														onClick={() => openAddRecordModal()}
														className="text-[#556f44] hover:text-[#283F3B] font-medium flex items-center gap-2 mx-auto"
													>
														<FiPlusCircle /> Add first medical record
													</motion.button>
												</div>
											)}
										</div>
									</div>
								</div>

								<div className="space-y-6">
									<div className="bg-gray-50 rounded-xl p-4">
										<h3 className="text-lg font-semibold text-[#283F3B] mb-4 flex items-center gap-2">
											<FiUser className="text-[#556f44]" /> Patient Information
										</h3>
										<div className="space-y-4">
											<div>
												<p className="text-sm text-gray-600">Age</p>
												<p className="text-lg font-semibold text-gray-900">
													{selectedPatientData.age} years
												</p>
											</div>
											<div>
												<p className="text-sm text-gray-600">Condition</p>
												<p className="text-lg font-semibold text-gray-900">
													{selectedPatientData.condition}
												</p>
											</div>
											<div>
												<p className="text-sm text-gray-600">Status</p>
												<span
													className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
														selectedPatientData.status === "Stable"
															? "bg-green-100 text-green-800"
															: selectedPatientData.status === "Monitoring"
															? "bg-yellow-100 text-yellow-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{selectedPatientData.status}
												</span>
											</div>
										</div>
									</div>

									<div className="bg-gray-50 rounded-xl p-4">
										<h3 className="text-lg font-semibold text-[#283F3B] mb-4 flex items-center gap-2">
											<FiBarChart2 className="text-[#556f44]" /> Medical Notes
										</h3>
										<textarea
											className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-1 focus:ring-[#556f44] focus:border-[#556f44] h-32 resize-none"
											placeholder="Add medical notes here..."
											defaultValue={selectedPatientData.notes}
											id="patientNotes"
										/>
										<div className="mt-4 flex justify-end">
											<motion.button
												whileHover={buttonHover}
												onClick={() => {
													const notesTextarea = document.getElementById(
														"patientNotes"
													) as HTMLTextAreaElement;
													handleSavePatientNotes(
														selectedPatient,
														notesTextarea.value
													);
												}}
												className="px-4 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 flex items-center gap-2"
											>
												<FiSave className="w-4 h-4" />
												Save Notes
											</motion.button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<footer className="mt-8 border-t border-gray-200 py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="col-span-1 md:col-span-2">
							<h3 className="text-lg font-semibold text-[#283F3B] mb-4">
								Patient-Doctor Portal
							</h3>
							<p className="text-gray-600 text-sm">
								A comprehensive healthcare management system connecting patients
								and healthcare providers.
							</p>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-gray-900 mb-4">
								Quick Links
							</h4>
							<ul className="space-y-2">
								<li>
									<motion.button
										whileHover={{ scale: 1.05 }}
										className="text-gray-600 hover:text-[#556f44] text-sm transition-colors duration-200"
									>
										About Us
									</motion.button>
								</li>
								<li>
									<motion.button
										whileHover={{ scale: 1.05 }}
										className="text-gray-600 hover:text-[#556f44] text-sm transition-colors duration-200"
									>
										Services
									</motion.button>
								</li>
								<li>
									<motion.button
										whileHover={{ scale: 1.05 }}
										className="text-gray-600 hover:text-[#556f44] text-sm transition-colors duration-200"
									>
										Contact
									</motion.button>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-gray-900 mb-4">
								Resources
							</h4>
							<ul className="space-y-2">
								<li>
									<motion.button
										whileHover={{ scale: 1.05 }}
										className="text-gray-600 hover:text-[#556f44] text-sm transition-colors duration-200"
									>
										Help Center
									</motion.button>
								</li>
								<li>
									<motion.button
										whileHover={{ scale: 1.05 }}
										className="text-gray-600 hover:text-[#556f44] text-sm transition-colors duration-200"
									>
										Privacy Policy
									</motion.button>
								</li>
								<li>
									<motion.button
										whileHover={{ scale: 1.05 }}
										className="text-gray-600 hover:text-[#556f44] text-sm transition-colors duration-200"
									>
										Terms of Service
									</motion.button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</footer>
			{/* Modals */}
			<AnimatePresence>
				{isSaveChangesModalOpen && (
					<motion.div
						className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50"
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<motion.div
							className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full m-4"
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-[#283F3B]">
									Confirm Changes
								</h2>
								<motion.button
									whileHover={iconHover}
									onClick={() => setIsSaveChangesModalOpen(false)}
									className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
								>
									<FiX className="w-6 h-6" />
								</motion.button>
							</div>
							<div className="text-center py-6">
								<div className="w-20 h-20 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
									<FiEdit className="w-10 h-10 text-[#556f44]" />
								</div>
								<p className="text-gray-600 mb-4">
									Are you sure you want to save these changes to your profile?
								</p>
								<p className="text-sm text-gray-500">
									This will update your personal and medical information.
								</p>
							</div>
							<div className="flex justify-end gap-4">
								<motion.button
									whileHover={buttonHover}
									onClick={() => setIsSaveChangesModalOpen(false)}
									className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
								>
									Cancel
								</motion.button>
								<motion.button
									whileHover={buttonHover}
									onClick={confirmSaveChanges}
									className="px-6 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
								>
									Save Changes
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isAddPatientModalOpen && (
					<motion.div
						className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50"
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<motion.div
							className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full m-4"
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-[#283F3B]">
									Add New Patient
								</h2>
								<motion.button
									whileHover={iconHover}
									onClick={closeAddPatientModal}
									className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
								>
									<FiX className="w-6 h-6" />
								</motion.button>
							</div>
							<form onSubmit={handleAddPatient} className="space-y-4">
								<div>
									<label
										htmlFor="patientName"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Full Name
									</label>
									<input
										type="text"
										id="patientName"
										name="patientName"
										required
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
										placeholder="Enter patient's full name"
									/>
								</div>
								<div>
									<label
										htmlFor="patientAge"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Age
									</label>
									<input
										type="number"
										id="patientAge"
										name="patientAge"
										required
										min="1"
										max="120"
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
										placeholder="Enter patient's age"
									/>
								</div>
								<div>
									<label
										htmlFor="patientCondition"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Primary Condition
									</label>
									<input
										type="text"
										id="patientCondition"
										name="patientCondition"
										required
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
										placeholder="Enter primary condition"
									/>
								</div>
								<div>
									<label
										htmlFor="patientStatus"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Status
									</label>
									<select
										id="patientStatus"
										name="patientStatus"
										required
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
									>
										<option value="">Select status</option>
										<option value="Stable">Stable</option>
										<option value="Monitoring">Monitoring</option>
										<option value="Needs Attention">Needs Attention</option>
									</select>
								</div>
								<div className="flex justify-end gap-4 mt-6">
									<motion.button
										whileHover={buttonHover}
										type="button"
										onClick={closeAddPatientModal}
										className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
									>
										Cancel
									</motion.button>
									<motion.button
										whileHover={buttonHover}
										type="submit"
										className="px-6 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
									>
										Add Patient
									</motion.button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isAppointmentModalOpen && (
					<motion.div
						className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50"
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<motion.div
							className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full m-4"
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-[#283F3B]">
									{appointmentModalData.visitId
										? "Edit Appointment"
										: "Schedule New Appointment"}
								</h2>
								<motion.button
									whileHover={iconHover}
									onClick={closeAppointmentModal}
									className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
								>
									<FiX className="w-6 h-6" />
								</motion.button>
							</div>
							<form onSubmit={handleScheduleSubmit} className="space-y-4">
								<div>
									<label
										htmlFor="doctor"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Doctor's Name
									</label>
									<input
										type="text"
										id="doctor"
										name="doctor"
										defaultValue={appointmentModalData.doctor}
										required
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
										placeholder="Enter doctor's name"
									/>
								</div>
								<div>
									<label
										htmlFor="specialty"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Specialty
									</label>
									<input
										type="text"
										id="specialty"
										name="specialty"
										defaultValue={appointmentModalData.specialty}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
										placeholder="Enter specialty"
									/>
								</div>
								<div>
									<label
										htmlFor="date"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Date
									</label>
									<input
										type="date"
										id="date"
										name="date"
										required
										min={new Date().toISOString().split("T")[0]}
										defaultValue={formatDateForInput(appointmentModalData.date)}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
									/>
								</div>
								<div>
									<label
										htmlFor="time"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Time
									</label>
									<input
										type="time"
										id="time"
										name="time"
										required
										defaultValue={appointmentModalData.time}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
									/>
								</div>
								<div>
									<label
										htmlFor="details"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Additional Details
									</label>
									<textarea
										id="details"
										name="details"
										defaultValue={appointmentModalData.details}
										rows={3}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200 resize-none"
										placeholder="Enter any additional details about the appointment"
									/>
								</div>
								<div className="flex justify-end gap-4 mt-6">
									<motion.button
										whileHover={buttonHover}
										type="button"
										onClick={closeAppointmentModal}
										className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
									>
										Cancel
									</motion.button>
									<motion.button
										whileHover={buttonHover}
										type="submit"
										className="px-6 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
									>
										{appointmentModalData.visitId
											? "Update Appointment"
											: "Schedule Appointment"}
									</motion.button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isReportModalOpen && reportModalData && (
					<motion.div
						className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50"
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<motion.div
							className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-[#283F3B]">
									{reportModalData.type === "visit"
										? "Visit Report"
										: "Test Results"}
								</h2>
								<motion.button
									whileHover={iconHover}
									onClick={closeReportModal}
									className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
								>
									<FiX className="w-6 h-6" />
								</motion.button>
							</div>

							<div className="space-y-6">
								<div className="flex items-center gap-4 mb-6">
									<div className="p-3 bg-gray-50 rounded-full">
										{reportModalData.icon}
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900">
											{reportModalData.type === "visit"
												? reportModalData.diagnosis
												: reportModalData.testName}
										</h3>
										<p className="text-sm text-gray-600">
											{reportModalData.date}
										</p>
									</div>
								</div>

								{reportModalData.type === "visit" ? (
									<div className="space-y-4">
										<div>
											<h4 className="text-sm font-medium text-gray-700 mb-1">
												Doctor
											</h4>
											<p className="p-3 bg-gray-50 rounded-lg">
												{reportModalData.doctor}
											</p>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-700 mb-1">
												Specialty
											</h4>
											<p className="p-3 bg-gray-50 rounded-lg">
												{reportModalData.specialty}
											</p>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-700 mb-1">
												Diagnosis
											</h4>
											<p className="p-3 bg-gray-50 rounded-lg">
												{reportModalData.diagnosis}
											</p>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-700 mb-1">
												Prescription
											</h4>
											<p className="p-3 bg-gray-50 rounded-lg">
												{reportModalData.prescription}
											</p>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-700 mb-1">
												Detailed Report
											</h4>
											<div className="p-3 bg-gray-50 rounded-lg whitespace-pre-line">
												{reportModalData.detailedReport}
											</div>
										</div>
									</div>
								) : (
									<div className="space-y-4">
										<div>
											<h4 className="text-sm font-medium text-gray-700 mb-1">
												Test Name
											</h4>
											<p className="p-3 bg-gray-50 rounded-lg">
												{reportModalData.testName}
											</p>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-700 mb-1">
												Results
											</h4>
											<p className="p-3 bg-gray-50 rounded-lg">
												{reportModalData.details}
											</p>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-700 mb-1">
												Detailed Report
											</h4>
											<div className="p-3 bg-gray-50 rounded-lg whitespace-pre-line">
												{reportModalData.detailedReport}
											</div>
										</div>
									</div>
								)}
							</div>

							<div className="mt-6 flex justify-end">
								<motion.button
									whileHover={buttonHover}
									onClick={closeReportModal}
									className="px-6 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200"
								>
									Close
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isEditVitalsModalOpen && selectedPatientData && (
					<motion.div
						className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50"
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<motion.div
							className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-[#283F3B]">
									Edit Patient Vitals
								</h2>
								<motion.button
									whileHover={iconHover}
									onClick={closeEditVitalsModal}
									className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
								>
									<FiX className="w-6 h-6" />
								</motion.button>
							</div>

							<form onSubmit={handleSaveVitals} className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="height"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Height
										</label>
										<input
											type="text"
											id="height"
											name="height"
											defaultValue={selectedPatientData.vitals.height}
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
											placeholder="e.g. 180 cm"
										/>
									</div>
									<div>
										<label
											htmlFor="weight"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Weight
										</label>
										<input
											type="text"
											id="weight"
											name="weight"
											defaultValue={selectedPatientData.vitals.weight}
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
											placeholder="e.g. 75 kg"
										/>
									</div>
									<div>
										<label
											htmlFor="bloodPressure"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Blood Pressure
										</label>
										<input
											type="text"
											id="bloodPressure"
											name="bloodPressure"
											defaultValue={selectedPatientData.vitals.bloodPressure}
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
											placeholder="e.g. 120/80 mmHg"
										/>
									</div>
									<div>
										<label
											htmlFor="heartRate"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Heart Rate
										</label>
										<input
											type="text"
											id="heartRate"
											name="heartRate"
											defaultValue={selectedPatientData.vitals.heartRate}
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
											placeholder="e.g. 72 bpm"
										/>
									</div>
									<div>
										<label
											htmlFor="temperature"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Temperature
										</label>
										<input
											type="text"
											id="temperature"
											name="temperature"
											defaultValue={selectedPatientData.vitals.temperature}
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
											placeholder="e.g. 36.6°C"
										/>
									</div>
									<div>
										<label
											htmlFor="bloodType"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Blood Type
										</label>
										<select
											id="bloodType"
											name="bloodType"
											defaultValue={selectedPatientData.vitals.bloodType}
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
										>
											<option value="A+">A+</option>
											<option value="A-">A-</option>
											<option value="B+">B+</option>
											<option value="B-">B-</option>
											<option value="AB+">AB+</option>
											<option value="AB-">AB-</option>
											<option value="O+">O+</option>
											<option value="O-">O-</option>
										</select>
									</div>
									<div>
										<label
											htmlFor="bloodGlucose"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Blood Glucose
										</label>
										<input
											type="text"
											id="bloodGlucose"
											name="bloodGlucose"
											defaultValue={selectedPatientData.vitals.bloodGlucose}
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
											placeholder="e.g. 95 mg/dL"
										/>
									</div>
									<div>
										<label
											htmlFor="cholesterol"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Cholesterol
										</label>
										<input
											type="text"
											id="cholesterol"
											name="cholesterol"
											defaultValue={selectedPatientData.vitals.cholesterol}
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
											placeholder="e.g. 180 mg/dL"
										/>
									</div>
								</div>

								<div className="flex justify-end gap-4 mt-6">
									<motion.button
										whileHover={buttonHover}
										type="button"
										onClick={closeEditVitalsModal}
										className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
									>
										Cancel
									</motion.button>
									<motion.button
										whileHover={buttonHover}
										type="submit"
										className="px-6 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
									>
										Save Vitals
									</motion.button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isAddRecordModalOpen && (
					<motion.div
						className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50"
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<motion.div
							className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-[#283F3B]">
									Add Medical Record
								</h2>
								<motion.button
									whileHover={iconHover}
									onClick={closeAddRecordModal}
									className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
								>
									<FiX className="w-6 h-6" />
								</motion.button>
							</div>

							<form onSubmit={handleAddMedicalRecord} className="space-y-4">
								<div>
									<label
										htmlFor="recordType"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Record Type
									</label>
									<select
										id="recordType"
										name="recordType"
										required
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
										onChange={(e) => {
											// Force a re-render to show/hide fields based on type
											const formElement = e.target.form;
											if (formElement) formElement.reset();
										}}
									>
										<option value="visit">Doctor Visit</option>
										<option value="test">Medical Test</option>
									</select>
								</div>

								<div className="record-visit-fields">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="doctor"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Doctor
											</label>
											<input
												type="text"
												id="doctor"
												name="doctor"
												className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												placeholder="Doctor's name"
											/>
										</div>
										<div>
											<label
												htmlFor="specialty"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Specialty
											</label>
											<input
												type="text"
												id="specialty"
												name="specialty"
												className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												placeholder="Doctor's specialty"
											/>
										</div>
										<div>
											<label
												htmlFor="diagnosis"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Diagnosis
											</label>
											<input
												type="text"
												id="diagnosis"
												name="diagnosis"
												className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												placeholder="Diagnosis"
											/>
										</div>
										<div>
											<label
												htmlFor="prescription"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Prescription
											</label>
											<input
												type="text"
												id="prescription"
												name="prescription"
												className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												placeholder="Prescription details"
											/>
										</div>
										<div>
											<label
												htmlFor="price"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Price
											</label>
											<input
												type="text"
												id="price"
												name="price"
												className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												placeholder="e.g. $150"
											/>
										</div>
									</div>
								</div>

								<div className="record-test-fields">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="testName"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Test Name
											</label>
											<input
												type="text"
												id="testName"
												name="testName"
												className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												placeholder="Name of the test"
											/>
										</div>
										<div>
											<label
												htmlFor="details"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Results/Details
											</label>
											<input
												type="text"
												id="details"
												name="details"
												className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
												placeholder="Test results or details"
											/>
										</div>
									</div>
								</div>

								<div>
									<label
										htmlFor="detailedReport"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Detailed Report
									</label>
									<textarea
										id="detailedReport"
										name="detailedReport"
										rows={5}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200 resize-none"
										placeholder="Enter detailed report or findings"
									/>
								</div>

								<div className="flex justify-end gap-4 mt-6">
									<motion.button
										whileHover={buttonHover}
										type="button"
										onClick={closeAddRecordModal}
										className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
									>
										Cancel
									</motion.button>
									<motion.button
										whileHover={buttonHover}
										type="submit"
										className="px-6 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
									>
										Add Record
									</motion.button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isEditRecordModalOpen && editingRecord && (
					<motion.div
						className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50"
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<motion.div
							className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-[#283F3B]">
									Edit Medical Record
								</h2>
								<motion.button
									whileHover={iconHover}
									onClick={closeEditRecordModal}
									className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
								>
									<FiX className="w-6 h-6" />
								</motion.button>
							</div>

							<form onSubmit={handleEditMedicalRecord} className="space-y-4">
								{editingRecord.type === "visit" ? (
									<div className="record-visit-fields">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label
													htmlFor="doctor"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Doctor
												</label>
												<input
													type="text"
													id="doctor"
													name="doctor"
													defaultValue={editingRecord.doctor}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
													placeholder="Doctor's name"
												/>
											</div>
											<div>
												<label
													htmlFor="specialty"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Specialty
												</label>
												<input
													type="text"
													id="specialty"
													name="specialty"
													defaultValue={editingRecord.specialty}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
													placeholder="Doctor's specialty"
												/>
											</div>
											<div>
												<label
													htmlFor="diagnosis"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Diagnosis
												</label>
												<input
													type="text"
													id="diagnosis"
													name="diagnosis"
													defaultValue={editingRecord.diagnosis}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
													placeholder="Diagnosis"
												/>
											</div>
											<div>
												<label
													htmlFor="prescription"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Prescription
												</label>
												<input
													type="text"
													id="prescription"
													name="prescription"
													defaultValue={editingRecord.prescription}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
													placeholder="Prescription details"
												/>
											</div>
											<div>
												<label
													htmlFor="price"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Price
												</label>
												<input
													type="text"
													id="price"
													name="price"
													defaultValue={editingRecord.price}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
													placeholder="e.g. $150"
												/>
											</div>
										</div>
									</div>
								) : (
									<div className="record-test-fields">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label
													htmlFor="testName"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Test Name
												</label>
												<input
													type="text"
													id="testName"
													name="testName"
													defaultValue={editingRecord.testName}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
													placeholder="Name of the test"
												/>
											</div>
											<div>
												<label
													htmlFor="details"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Results/Details
												</label>
												<input
													type="text"
													id="details"
													name="details"
													defaultValue={editingRecord.details}
													className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200"
													placeholder="Test results or details"
												/>
											</div>
										</div>
									</div>
								)}

								<div>
									<label
										htmlFor="detailedReport"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Detailed Report
									</label>
									<textarea
										id="detailedReport"
										name="detailedReport"
										rows={5}
										defaultValue={editingRecord.detailedReport}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556f44] focus:border-[#556f44] transition-colors duration-200 resize-none"
										placeholder="Enter detailed report or findings"
									/>
								</div>

								<div className="flex justify-end gap-4 mt-6">
									<motion.button
										whileHover={buttonHover}
										type="button"
										onClick={closeEditRecordModal}
										className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
									>
										Cancel
									</motion.button>
									<motion.button
										whileHover={buttonHover}
										type="submit"
										className="px-6 py-2 rounded-lg bg-[#556f44] text-white hover:bg-[#283F3B] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
									>
										Update Record
									</motion.button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<style jsx global>
				{`
					button,
					a {
						cursor: pointer;
					}
				`}
			</style>
			;
		</div>
	);
}
