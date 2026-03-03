"use client";

import { useState, useEffect } from "react";
import {
	Calendar,
	Clock,
	Camera,
	Heart,
	User,
	MapPin,
	Star,
	X,
	ChevronLeft,
	ChevronRight,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";

interface Session {
	id: number;
	name: string;
	price: number;
	desc: string;
	duration: string;
	image: string;
	locations: string[];
	features: string[];
}

interface Special {
	id: number;
	name: string;
	price: number;
	desc: string;
	originalPrice: number;
	expiryDate: string;
}

interface Testimonial {
	id: number;
	name: string;
	photo: string;
	text: string;
	rating: number;
}

interface Customer {
	name: string;
	email: string;
	phone: string;
}

interface Booking {
	id: number;
	session: Session;
	date: string;
	time: string;
	location: string;
	specialNotes: string;
	customer: Customer;
	status: string;
	bookingDate: string;
}

interface Toast {
	message: string;
	type: "success" | "error" | "warning" | "info";
}

export default function PhotographyBookingExport(): JSX.Element {
	const sessionTypes: Session[] = [
		{
			id: 1,
			name: "Family Photos",
			price: 150,
			desc: "Capture beautiful moments with your loved ones in a location of your choice.",
			duration: "1 hour",
			image:
				"https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1470&auto=format&fit=crop",
			locations: ["Park", "Beach", "Studio"],
			features: ["10 edited photos", "Online gallery", "Print release"],
		},
		{
			id: 2,
			name: "Wedding Photos",
			price: 500,
			desc: "Comprehensive coverage of your special day, from preparation to reception.",
			duration: "6 hours",
			image:
				"https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1470&auto=format&fit=crop",
			locations: ["Venue of choice"],
			features: [
				"200+ edited photos",
				"Online gallery",
				"Print release",
				"Second photographer",
			],
		},
		{
			id: 3,
			name: "Portrait Session",
			price: 125,
			desc: "Professional portraits perfect for LinkedIn, social media, or personal use.",
			duration: "45 minutes",
			image:
				"https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=1470&auto=format&fit=crop",
			locations: ["Studio", "Urban setting"],
			features: ["5 edited photos", "Online gallery", "Print release"],
		},
		{
			id: 4,
			name: "Engagement Photos",
			price: 200,
			desc: "Celebrate your engagement with a romantic photoshoot.",
			duration: "1.5 hours",
			image:
				"https://images.unsplash.com/photo-1542286777-b6499aa99a0a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			locations: ["Park", "Beach", "Urban setting"],
			features: ["15 edited photos", "Online gallery", "Print release"],
		},
		{
			id: 5,
			name: "Newborn Photography",
			price: 225,
			desc: "Capture the precious early moments of your baby's life with beautiful, gentle portraits.",
			duration: "2 hours",
			image:
				"https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1470&auto=format&fit=crop",
			locations: ["Your home", "Studio"],
			features: [
				"12 edited photos",
				"Custom props and setups",
				"Online gallery",
				"Print release",
				"Baby-friendly environment",
			],
		},
		{
			id: 6,
			name: "Event Coverage",
			price: 350,
			desc: "Professional photography for corporate events, parties, or special celebrations.",
			duration: "4 hours",
			image:
				"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1469&auto=format&fit=crop",
			locations: ["Venue of choice"],
			features: [
				"100+ edited photos",
				"Online gallery",
				"Print release",
				"Fast turnaround",
				"Corporate packages available",
			],
		},
	];

	const specials: Special[] = [
		{
			id: 1,
			name: "Spring Family Special",
			price: 120,
			desc: "20% off family sessions in April & May!",
			originalPrice: 150,
			expiryDate: "May 31, 2025",
		},
		{
			id: 2,
			name: "Engagement + Wedding Bundle",
			price: 650,
			desc: "Book both and save $50!",
			originalPrice: 700,
			expiryDate: "December 31, 2025",
		},
	];

	const testimonials: Testimonial[] = [
		{
			id: 1,
			name: "Sarah Johnson",
			photo:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop",
			text: "Our family photos turned out amazing! The photographer was great with our kids and captured beautiful moments.",
			rating: 5,
		},
		{
			id: 2,
			name: "Michael & Emma",
			photo:
				"https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1470&auto=format&fit=crop",
			text: "The wedding photos exceeded our expectations. Every special moment was captured perfectly.",
			rating: 5,
		},
		{
			id: 3,
			name: "David Chen",
			photo:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop",
			text: "My professional headshots look fantastic. I have already gotten compliments on my LinkedIn profile.",
			rating: 4,
		},
	];

	const [bookings, setBookings] = useState<Booking[]>([]);
	const [currentView, setCurrentView] = useState<string>("home");
	const [selectedSession, setSelectedSession] = useState<Session | null>(null);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [selectedTime, setSelectedTime] = useState<string>("");
	const [selectedLocation, setSelectedLocation] = useState<string>("");
	const [specialNotes, setSpecialNotes] = useState<string>("");
	const [customerName, setCustomerName] = useState<string>("");
	const [customerEmail, setCustomerEmail] = useState<string>("");
	const [customerPhone, setCustomerPhone] = useState<string>("");
	const [showToast, setShowToast] = useState<boolean>(false);
	const [toast, setToast] = useState<Toast>({ message: "", type: "info" });
	const [showModal, setShowModal] = useState<boolean>(false);
	const [modalContent, setModalContent] = useState<Session>({} as Session);
	const [checkoutStep, setCheckoutStep] = useState<number>(1);
	const [activeTab, setActiveTab] = useState<string>("sessions");
	const [searchTerm, setSearchTerm] = useState<string>("");

	useEffect(() => {
		const savedBookings = localStorage.getItem("photoBookings");
		if (savedBookings) {
			setBookings(JSON.parse(savedBookings));
		}
	}, []);

	useEffect(() => {
		if (bookings.length > 0) {
			localStorage.setItem("photoBookings", JSON.stringify(bookings));
		}
	}, [bookings]);

	const filteredSessions = sessionTypes.filter(
		(session) =>
			session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			session.desc.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const displayToast = (
		message: string,
		type: "success" | "error" | "warning" | "info" = "info"
	) => {
		setToast({ message, type });
		setShowToast(true);
		setTimeout(() => {
			setShowToast(false);
		}, 4000);
	};

	const bookSession = (): void => {
		if (
			!selectedSession ||
			!selectedDate ||
			!selectedTime ||
			!customerName ||
			!customerEmail
		) {
			displayToast("Please fill all required fields", "error");
			return;
		}

		const newBooking: Booking = {
			id: Date.now(),
			session: selectedSession,
			date: selectedDate,
			time: selectedTime,
			location: selectedLocation,
			specialNotes,
			customer: {
				name: customerName,
				email: customerEmail,
				phone: customerPhone,
			},
			status: "Confirmed",
			bookingDate: new Date().toISOString(),
		};

		setBookings([...bookings, newBooking]);
		displayToast("Booking confirmed! Check your email for details.", "success");

		setSelectedSession(null);
		setSelectedDate("");
		setSelectedTime("");
		setSelectedLocation("");
		setSpecialNotes("");
		setCustomerName("");
		setCustomerEmail("");
		setCustomerPhone("");
		setCheckoutStep(1);
		setCurrentView("home");
	};

	const deleteBooking = (id: number): void => {
		setBookings(bookings.filter((b) => b.id !== id));
		displayToast("Booking successfully cancelled", "success");
	};

	const viewSessionDetails = (session: Session): void => {
		setModalContent(session);
		setShowModal(true);
	};

	const closeModal = (): void => {
		setShowModal(false);
	};

	const startBooking = (session: Session): void => {
		setSelectedSession(session);
		setCurrentView("booking");
	};

	const navigateToBookings = (): void => {
		setCurrentView("bookings");
	};

	const navigateToHome = (): void => {
		setCurrentView("home");
	};

	const nextStep = (): void => {
		if (checkoutStep === 1 && !selectedDate) {
			displayToast("Please select a date", "warning");
			return;
		}
		if (checkoutStep === 2 && !selectedTime) {
			displayToast("Please select a time", "warning");
			return;
		}
		if (checkoutStep < 4) {
			setCheckoutStep(checkoutStep + 1);
		}
	};

	const prevStep = (): void => {
		if (checkoutStep > 1) {
			setCheckoutStep(checkoutStep - 1);
		}
	};

	const timeSlots: string[] = [
		"9:00 AM",
		"10:00 AM",
		"11:00 AM",
		"1:00 PM",
		"2:00 PM",
		"3:00 PM",
		"4:00 PM",
	];

	const getToastIcon = (type: string): JSX.Element => {
		switch (type) {
			case "success":
				return <CheckCircle size={22} className="text-white" />;
			case "error":
				return <X size={22} className="text-white" />;
			case "warning":
				return <AlertTriangle size={22} className="text-white" />;
			default:
				return <div className="text-white">ℹ️</div>;
		}
	};

	const getToastBgColor = (type: string): string => {
		switch (type) {
			case "success":
				return "bg-gradient-to-r from-green-500 to-green-600";
			case "error":
				return "bg-gradient-to-r from-red-500 to-red-600";
			case "warning":
				return "bg-gradient-to-r from-yellow-500 to-yellow-600";
			default:
				return "bg-gradient-to-r from-blue-500 to-blue-600";
		}
	};

	const renderToast = (): JSX.Element | null => {
		if (!showToast) return null;

		const bgColor = getToastBgColor(toast.type);

		return (
			<div
				className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center transform transition-all duration-300 ease-in-out animate-fade-in`}
			>
				<div className="mr-3">{getToastIcon(toast.type)}</div>
				<span className="font-medium">{toast.message}</span>
				<button
					onClick={() => setShowToast(false)}
					className="ml-4 text-white hover:text-gray-200 focus:outline-none cursor-pointer"
				>
					<X size={18} />
				</button>
			</div>
		);
	};

	const renderModal = (): JSX.Element | null => {
		if (!showModal) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
				<div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto animate-scale-in">
					<div className="relative">
						<img
							src={modalContent.image}
							alt={modalContent.name}
							className="w-full h-64 object-cover rounded-t-xl"
						/>
						<button
							onClick={closeModal}
							className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
						>
							<X size={20} />
						</button>
						<div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
							<h2 className="text-3xl font-bold text-white">
								{modalContent.name}
							</h2>
						</div>
					</div>

					<div className="p-6">
						<div className="flex justify-between items-start mb-6">
							<p className="text-gray-600 text-lg">{modalContent.desc}</p>
							<div className="ml-4">
								<p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
									${modalContent.price}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 mb-6">
							<div className="flex items-center px-4 py-3 rounded-lg bg-indigo-50">
								<Clock size={20} className="text-indigo-600 mr-3" />
								<span className="font-medium">{modalContent.duration}</span>
							</div>
							<div className="flex items-center px-4 py-3 rounded-lg bg-purple-50">
								<MapPin size={20} className="text-purple-600 mr-3" />
								<span className="font-medium">
									{modalContent.locations?.join(", ")}
								</span>
							</div>
						</div>

						<div className="bg-gray-50 p-5 rounded-xl mb-6">
							<h3 className="font-semibold text-gray-800 mb-3 text-lg">
								What's included:
							</h3>
							<ul className="space-y-2">
								{modalContent.features?.map((feature, index) => (
									<li key={index} className="flex items-center">
										<div className="mr-3 text-green-500">✓</div>
										<span>{feature}</span>
									</li>
								))}
							</ul>
						</div>

						<button
							onClick={() => {
								closeModal();
								startBooking(modalContent);
							}}
							className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
						>
							Book This Session
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderHome = (): JSX.Element => (
		<div className="w-full">
			<div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 mb-12 shadow-sm">
				<div className="text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6">
						Capture Your Special Moments
					</h1>
					<p className="text-gray-700 max-w-3xl mx-auto mb-8 text-lg">
						Professional photography services for every occasion. Book your
						session today and preserve your memories forever.
					</p>
					<div className="flex flex-wrap justify-center gap-5">
						<button
							onClick={() => setActiveTab("sessions")}
							className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
						>
							Browse Sessions
						</button>
						<button
							onClick={() => setActiveTab("specials")}
							className="bg-white hover:bg-gray-50 text-indigo-600 py-3 px-8 rounded-lg font-medium border border-indigo-600 transition duration-300 shadow-sm hover:shadow-md cursor-pointer"
						>
							View Specials
						</button>
					</div>
				</div>
			</div>

			<div className="mb-10">
				<div className="relative max-w-2xl mx-auto">
					<input
						type="text"
						placeholder="Search for sessions..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full p-4 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
					/>
					<div className="absolute left-4 top-4 text-gray-400">
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
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div className="flex border-b border-gray-300 mb-10 max-w-4xl mx-auto justify-center">
				<button
					onClick={() => setActiveTab("sessions")}
					className={`py-3 px-6 font-medium transition-all duration-200 cursor-pointer ${
						activeTab === "sessions"
							? "text-indigo-600 border-b-2 border-indigo-600"
							: "text-gray-600 hover:text-indigo-600"
					}`}
				>
					Photography Sessions
				</button>
				<button
					onClick={() => setActiveTab("specials")}
					className={`py-3 px-6 font-medium transition-all duration-200 cursor-pointer ${
						activeTab === "specials"
							? "text-indigo-600 border-b-2 border-indigo-600"
							: "text-gray-600 hover:text-indigo-600"
					}`}
				>
					Special Offers
				</button>
				<button
					onClick={() => setActiveTab("testimonials")}
					className={`py-3 px-6 font-medium transition-all duration-200 cursor-pointer ${
						activeTab === "testimonials"
							? "text-indigo-600 border-b-2 border-indigo-600"
							: "text-gray-600 hover:text-indigo-600"
					}`}
				>
					Testimonials
				</button>
			</div>

			{activeTab === "sessions" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					{filteredSessions.map((session) => (
						<div
							key={session.id}
							className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 group"
						>
							<div className="h-56 overflow-hidden relative">
								<img
									src={session.image}
									alt={session.name}
									className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
									<button
										onClick={() => viewSessionDetails(session)}
										className="bg-white/90 hover:bg-white text-indigo-600 py-2 rounded-lg font-medium transition duration-200 backdrop-blur-sm cursor-pointer w-full"
									>
										View Details
									</button>
								</div>
							</div>
							<div className="p-6">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-xl font-bold text-gray-800">
										{session.name}
									</h3>
									<div className="bg-indigo-50 px-3 py-1 rounded-full">
										<p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
											${session.price}
										</p>
									</div>
								</div>
								<p className="text-gray-600 mb-4 line-clamp-2 min-h-12">
									{session.desc}
								</p>
								<div className="flex flex-wrap gap-2 mb-5">
									<div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
										<Clock size={14} className="text-indigo-500 mr-2" />
										<span className="text-sm">{session.duration}</span>
									</div>
									<div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
										<MapPin size={14} className="text-indigo-500 mr-2" />
										<span className="text-sm">
											{session.locations[0]}
											{session.locations.length > 1 ? "+" : ""}
										</span>
									</div>
								</div>
								<div className="flex justify-center">
									<button
										onClick={() => startBooking(session)}
										className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-5 rounded-lg font-medium transition duration-300 cursor-pointer shadow-sm hover:shadow-md"
									>
										Book Now
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{activeTab === "specials" && (
				<div className="space-y-8 mb-16 max-w-5xl mx-auto">
					{specials.map((special) => (
						<div
							key={special.id}
							className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-md hover:shadow-lg transition duration-300"
						>
							<div className="flex flex-col md:flex-row md:justify-between md:items-center">
								<div>
									<div className="flex items-center mb-3">
										<span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs uppercase font-bold px-3 py-1 rounded-full mr-3">
											Limited Offer
										</span>
										<h3 className="text-xl font-bold text-gray-800">
											{special.name}
										</h3>
									</div>
									<p className="text-gray-700 mb-3 text-lg">{special.desc}</p>
									<p className="text-sm text-gray-500 flex items-center">
										<Clock size={16} className="mr-2" />
										Offer valid until: {special.expiryDate}
									</p>
								</div>
								<div className="mt-6 md:mt-0 flex flex-col items-end">
									<div className="flex items-center mb-4">
										<span className="text-gray-400 line-through mr-3 text-lg">
											${special.originalPrice}
										</span>
										<span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
											${special.price}
										</span>
									</div>
									<button
										onClick={() => {
											const session = sessionTypes.find(
												(s) =>
													special.name.includes(s.name) ||
													s.name.includes(special.name.split(" ")[0])
											);
											if (session) {
												let discountedSession = {
													...session,
													price: special.price,
												};
												startBooking(discountedSession);
											} else {
												displayToast(
													"Sorry, this special is currently unavailable",
													"warning"
												);
											}
										}}
										className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
									>
										Book This Special
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{activeTab === "testimonials" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.id}
							className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
						>
							<div className="flex items-center mb-5">
								<img
									src={testimonial.photo}
									alt={testimonial.name}
									className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-indigo-100"
								/>
								<div>
									<h3 className="font-bold text-gray-800 text-lg">
										{testimonial.name}
									</h3>
									<div className="flex">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												size={16}
												className={
													i < testimonial.rating
														? "text-yellow-400 fill-current"
														: "text-gray-300"
												}
											/>
										))}
									</div>
								</div>
							</div>
							<p className="text-gray-600 italic bg-gray-50 p-4 rounded-lg">
								"{testimonial.text}"
							</p>
						</div>
					))}
				</div>
			)}

			<div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl p-10 mb-12 shadow-lg">
				<div className="text-center">
					<h2 className="text-3xl font-bold mb-4">
						Ready to book your session?
					</h2>
					<p className="mb-6 text-lg max-w-xl mx-auto">
						Choose from our range of professional photography services and
						capture your memories.
					</p>
					<button
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						className="bg-white hover:bg-gray-100 text-indigo-600 py-3 px-8 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
					>
						Browse Sessions
					</button>
				</div>
			</div>

			<div className="flex justify-center mb-8">
				<button
					onClick={navigateToBookings}
					className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-8 rounded-lg font-medium transition duration-300 shadow-sm hover:shadow-md cursor-pointer"
				>
					<User size={20} />
					View My Bookings
				</button>
			</div>
		</div>
	);

	const renderBookingForm = (): JSX.Element | null => {
		if (!selectedSession) return null;

		return (
			<div className="w-full">
				<div className="flex items-center mb-8">
					<button
						onClick={navigateToHome}
						className="mr-4 text-indigo-600 hover:text-indigo-800 cursor-pointer group flex items-center"
					>
						<ChevronLeft
							size={20}
							className="mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform"
						/>
						<span>Back to Home</span>
					</button>
					<h1 className="text-2xl font-bold text-gray-800">
						Book {selectedSession.name}
					</h1>
				</div>

				<div className="mb-10 max-w-4xl mx-auto">
					<div className="flex justify-between">
						{[1, 2, 3, 4].map((step) => (
							<div key={step} className="flex flex-col items-center">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
										step === checkoutStep
											? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-110 shadow-md"
											: step < checkoutStep
											? "bg-indigo-200 text-indigo-800"
											: "bg-gray-200 text-gray-500"
									}`}
								>
									{step}
								</div>
								<span
									className={`text-xs ${
										step === checkoutStep
											? "text-indigo-600 font-medium"
											: "text-gray-500"
									}`}
								>
									{step === 1 && "Date"}
									{step === 2 && "Time"}
									{step === 3 && "Details"}
									{step === 4 && "Payment"}
								</span>
							</div>
						))}
					</div>
					<div className="mt-3 h-1 bg-gray-200 rounded">
						<div
							className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded transition-all duration-500"
							style={{ width: `${(checkoutStep - 1) * 33.33}%` }}
						></div>
					</div>
				</div>

				<div className="max-w-4xl mx-auto">
					{checkoutStep === 1 && (
						<div className="bg-white rounded-xl p-8 shadow-md mb-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Select a Date
							</h2>
							<p className="text-gray-600 mb-6">
								Choose when you'd like to have your{" "}
								{selectedSession.name.toLowerCase()}. Our photographers are
								ready to capture your special moments.
							</p>
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
								<input
									type="date"
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
									min={new Date().toISOString().split("T")[0]}
									className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4 cursor-pointer"
								/>
							</div>
						</div>
					)}

					{checkoutStep === 2 && (
						<div className="bg-white rounded-xl p-8 shadow-md mb-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Select a Time
							</h2>
							<p className="text-gray-600 mb-6">
								Choose an available time slot for your{" "}
								{selectedSession.duration} {selectedSession.name.toLowerCase()}.
							</p>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{timeSlots.map((time) => (
									<button
										key={time}
										onClick={() => setSelectedTime(time)}
										className={`py-4 px-4 rounded-lg border ${
											selectedTime === time
												? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500 text-indigo-700 shadow-md"
												: "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
										} transition-all duration-200 cursor-pointer`}
									>
										{time}
									</button>
								))}
							</div>
						</div>
					)}

					{checkoutStep === 3 && (
						<div className="bg-white rounded-xl p-8 shadow-md mb-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Session Details
							</h2>

							{selectedSession.locations &&
								selectedSession.locations.length > 0 && (
									<div className="mb-6">
										<label className="block text-gray-700 font-medium mb-3">
											Select Location
										</label>
										<select
											value={selectedLocation}
											onChange={(e) => setSelectedLocation(e.target.value)}
											className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
										>
											<option value="">Select a location</option>
											{selectedSession.locations.map((location) => (
												<option key={location} value={location}>
													{location}
												</option>
											))}
										</select>
									</div>
								)}

							<div className="mb-4">
								<label className="block text-gray-700 font-medium mb-3">
									Special Requests or Notes
								</label>
								<textarea
									value={specialNotes}
									onChange={(e) => setSpecialNotes(e.target.value)}
									placeholder="Any special requests or things I should know about your session?"
									className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
									rows={4}
								></textarea>
							</div>
						</div>
					)}

					{}
					{checkoutStep === 4 && (
						<div className="space-y-6">
							<div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
								<h2 className="text-2xl font-bold text-gray-800 mb-4">
									Contact Information
								</h2>

								<div className="mb-6">
									<label className="block text-gray-700 font-medium mb-3">
										Full Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={customerName}
										onChange={(e) => setCustomerName(e.target.value)}
										placeholder="Enter your full name"
										className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
										required
									/>
								</div>

								<div className="mb-6">
									<label className="block text-gray-700 font-medium mb-3">
										Email Address <span className="text-red-500">*</span>
									</label>
									<input
										type="email"
										value={customerEmail}
										onChange={(e) => setCustomerEmail(e.target.value)}
										placeholder="Enter your email address"
										className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-gray-700 font-medium mb-3">
										Phone Number
									</label>
									<input
										type="tel"
										value={customerPhone}
										onChange={(e) => setCustomerPhone(e.target.value)}
										placeholder="Enter your phone number"
										className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
									/>
								</div>
							</div>

							<div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
								<h2 className="text-2xl font-bold text-gray-800 mb-4">
									Order Summary
								</h2>

								<div className="space-y-4 mb-6">
									<div className="flex justify-between items-center py-3 border-b border-gray-100">
										<span className="text-gray-700 font-medium">
											{selectedSession.name}
										</span>
										<span className="font-bold text-lg">
											${selectedSession.price}
										</span>
									</div>
									<div className="flex justify-between items-center py-2">
										<span className="text-gray-600">Date</span>
										<span className="font-medium">{selectedDate}</span>
									</div>
									<div className="flex justify-between items-center py-2">
										<span className="text-gray-600">Time</span>
										<span className="font-medium">{selectedTime}</span>
									</div>
									{selectedLocation && (
										<div className="flex justify-between items-center py-2">
											<span className="text-gray-600">Location</span>
											<span className="font-medium">{selectedLocation}</span>
										</div>
									)}
								</div>

								<div className="border-t border-gray-200 pt-4 mb-8">
									<div className="flex justify-between font-bold text-xl">
										<span>Total</span>
										<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
											${selectedSession.price}
										</span>
									</div>
								</div>

								<div>
									<h3 className="font-medium text-gray-800 mb-3">
										Payment Information
									</h3>
									<div className="border rounded-lg p-5 bg-gray-50">
										<p className="text-center text-gray-500">
											For demo purposes, payment processing is simulated. Click
											"Complete Booking" to confirm your session.
										</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{}
					<div className="flex justify-between mt-10">
						{checkoutStep > 1 ? (
							<button
								onClick={prevStep}
								className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-8 rounded-lg font-medium transition duration-300 flex items-center cursor-pointer"
							>
								<ChevronLeft size={20} className="mr-2" />
								Back
							</button>
						) : (
							<div></div>
						)}

						{checkoutStep < 4 ? (
							<button
								onClick={nextStep}
								className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg flex items-center cursor-pointer"
							>
								Continue
								<ChevronRight size={20} className="ml-2" />
							</button>
						) : (
							<button
								onClick={bookSession}
								className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
							>
								Complete Booking
							</button>
						)}
					</div>
				</div>
			</div>
		);
	};

	const renderCustomerBookings = (): JSX.Element => (
		<div className="w-full max-w-5xl mx-auto">
			<div className="flex items-center mb-10">
				<button
					onClick={navigateToHome}
					className="mr-4 text-indigo-600 hover:text-indigo-800 cursor-pointer group flex items-center"
				>
					<ChevronLeft
						size={20}
						className="mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform"
					/>
					<span>Back to Home</span>
				</button>
				<h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
					My Bookings
				</h1>
			</div>

			{bookings.length === 0 ? (
				<div className="bg-white rounded-xl p-12 shadow-md text-center border border-gray-100 min-h-96 flex flex-col justify-center items-center">
					<div className="mb-6 bg-indigo-50 p-6 rounded-full">
						<Calendar size={70} className="text-indigo-400" />
					</div>
					<h2 className="text-2xl font-medium text-gray-800 mb-4">
						No bookings yet
					</h2>
					<p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg">
						You haven't booked any photography sessions yet. Browse our
						available sessions and book one that fits your needs.
					</p>
					<button
						onClick={navigateToHome}
						className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
					>
						Browse Sessions
					</button>
				</div>
			) : (
				<div>
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-xl font-medium text-gray-700">
							Your Upcoming Sessions
						</h2>
						<div className="text-gray-500 text-sm">
							Total bookings:{" "}
							<span className="font-semibold text-indigo-600">
								{bookings.length}
							</span>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
						{bookings.map((booking) => (
							<div
								key={booking.id}
								className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
							>
								<div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 flex justify-between items-center">
									<h2 className="text-xl font-bold text-gray-800 flex items-center">
										<Camera size={20} className="mr-3 text-indigo-500" />
										{booking.session.name}
									</h2>
									<span className="inline-block bg-green-100 text-green-800 text-xs font-semibold py-1.5 px-3 rounded-full">
										{booking.status}
									</span>
								</div>

								<div className="p-6">
									<div className="flex flex-col space-y-4">
										<div className="flex items-center text-gray-700">
											<Calendar size={18} className="mr-3 text-indigo-500" />
											<span className="font-medium">
												{new Date(booking.date).toLocaleDateString("en-US", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</div>
										<div className="flex items-center text-gray-700">
											<Clock size={18} className="mr-3 text-indigo-500" />
											<span className="font-medium">{booking.time}</span>
										</div>
										{booking.location && (
											<div className="flex items-center text-gray-700">
												<MapPin size={18} className="mr-3 text-indigo-500" />
												<span className="font-medium">{booking.location}</span>
											</div>
										)}
									</div>

									{booking.specialNotes && (
										<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
											<p className="text-gray-600">
												<span className="font-medium">Special notes:</span>{" "}
												{booking.specialNotes}
											</p>
										</div>
									)}

									<div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
										<button
											onClick={() => deleteBooking(booking.id)}
											className="text-red-500 hover:text-red-700 font-medium flex items-center cursor-pointer transition-colors duration-200 px-3 py-1 hover:bg-red-50 rounded-lg"
										>
											<X size={16} className="mr-2" />
											Cancel Booking
										</button>
										<p className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
											${booking.session.price}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{}
			<header className="bg-white shadow-sm sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<Camera size={28} className="text-indigo-600" />
							<span className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
								Capture Studio
							</span>
						</div>
						<nav className="flex space-x-1">
							<button
								onClick={navigateToHome}
								className={`text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition duration-200 cursor-pointer ${
									currentView === "home"
										? "font-medium bg-indigo-50 text-indigo-600"
										: ""
								}`}
							>
								Home
							</button>
							<button
								onClick={navigateToBookings}
								className={`text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition duration-200 cursor-pointer ${
									currentView === "bookings"
										? "font-medium bg-indigo-50 text-indigo-600"
										: ""
								}`}
							>
								My Bookings
							</button>
						</nav>
					</div>
				</div>
			</header>

			{}
			<main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{currentView === "home" && renderHome()}
				{currentView === "booking" && renderBookingForm()}
				{currentView === "bookings" && renderCustomerBookings()}
			</main>

			{}
			<footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 py-12 mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						<div>
							<h3 className="text-white text-lg font-bold mb-4 flex items-center">
								<Camera size={22} className="text-indigo-400 mr-2" />
								Capture Studio
							</h3>
							<p className="mb-5 text-gray-400">
								Professional photography services for all your special moments.
								We capture memories that last a lifetime.
							</p>
							<div className="flex space-x-5">
								<button
									onClick={() =>
										displayToast(
											"Social media links will be added soon",
											"info"
										)
									}
									className="text-gray-400 hover:text-white transition-colors cursor-pointer"
								>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<button
									onClick={() =>
										displayToast(
											"Social media links will be added soon",
											"info"
										)
									}
									className="text-gray-400 hover:text-white transition-colors cursor-pointer"
								>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<button
									onClick={() =>
										displayToast(
											"Social media links will be added soon",
											"info"
										)
									}
									className="text-gray-400 hover:text-white transition-colors cursor-pointer"
								>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
									</svg>
								</button>
							</div>
						</div>
						<div>
							<h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
							<ul className="space-y-3">
								<li>
									<button
										onClick={() =>
											displayToast("This page is coming soon", "info")
										}
										className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center"
									>
										<ChevronRight size={16} className="mr-2 text-indigo-400" />
										About Us
									</button>
								</li>
								<li>
									<button
										onClick={() =>
											displayToast("This page is coming soon", "info")
										}
										className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center"
									>
										<ChevronRight size={16} className="mr-2 text-indigo-400" />
										Services
									</button>
								</li>
								<li>
									<button
										onClick={() =>
											displayToast("This page is coming soon", "info")
										}
										className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center"
									>
										<ChevronRight size={16} className="mr-2 text-indigo-400" />
										Gallery
									</button>
								</li>
								<li>
									<button
										onClick={() =>
											displayToast("This page is coming soon", "info")
										}
										className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center"
									>
										<ChevronRight size={16} className="mr-2 text-indigo-400" />
										Pricing
									</button>
								</li>
								<li>
									<button
										onClick={() =>
											displayToast("This page is coming soon", "info")
										}
										className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center"
									>
										<ChevronRight size={16} className="mr-2 text-indigo-400" />
										Contact
									</button>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
							<ul className="space-y-3">
								<li className="flex items-center text-gray-400 hover:text-white transition-colors">
									<svg
										className="h-5 w-5 mr-3 text-indigo-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
									<span>(555) 123-4567</span>
								</li>
								<li className="flex items-center text-gray-400 hover:text-white transition-colors">
									<svg
										className="h-5 w-5 mr-3 text-indigo-400"
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
										/>
									</svg>
									<span>info@capturestudio.com</span>
								</li>
								<li className="flex items-center text-gray-400 hover:text-white transition-colors">
									<svg
										className="h-5 w-5 mr-3 text-indigo-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span>123 Photo St, Lens City, PC 12345</span>
								</li>
								<li className="flex items-center text-gray-400 hover:text-white transition-colors">
									<svg
										className="h-5 w-5 mr-3 text-indigo-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span>Mon-Fri: 9AM-5PM, Sat: 10AM-4PM</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-700 mt-10 pt-8 text-sm text-center">
						<p>
							&copy; {new Date().getFullYear()} Capture Studio. All rights
							reserved.
						</p>
					</div>
				</div>
			</footer>

			{}
			{renderToast()}

			{}
			{renderModal()}

			{}
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
				@keyframes scaleIn {
					from {
						opacity: 0;
						transform: scale(0.95);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
				.animate-fade-in {
					animation: fadeIn 0.3s ease-out forwards;
				}
				.animate-scale-in {
					animation: scaleIn 0.3s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
