"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ScissorsIcon,
	PaintBrushIcon,
	SparklesIcon,
	CheckIcon,
	ShoppingCartIcon,
	XMarkIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/24/solid";

interface Service {
	id: string;
	name: string;
	category: "cuts" | "coloring" | "treatments";
	duration: number;
	price: number;
	description: string;
}

interface Stylist {
	id: string;
	name: string;
	photo: string;
	specialties: string[];
	rating: number;
	age: number;
	description: string;
	experience: string;
	education: string;
	achievements: string[];
}

interface TimeSlot {
	time: string;
	available: boolean;
	stylistId: string;
}

interface CartItem {
	service: Service;
	stylist: Stylist;
	date: string;
	time: string;
}

interface CustomerInfo {
	name: string;
	email: string;
	phone: string;
}

interface Notification {
	id: string;
	message: string;
	show: boolean;
}

interface HeroBackgroundVideoProps {
	src: string;
}

const HeroBackgroundVideo: React.FC<HeroBackgroundVideoProps> = ({ src }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (video) {
			const playPromise = video.play();
			if (playPromise !== undefined) {
				playPromise.catch(() => {
					video.muted = true;
					video.play().catch(() => {});
				});
			}
		}
	}, []);

	return (
		<div className="absolute inset-0 z-0 overflow-hidden">
			<video
				ref={videoRef}
				className="w-full h-full object-cover object-center md:object-center"
				style={{ objectPosition: "22% center" }}
				autoPlay
				muted
				loop
				playsInline
				preload="auto"
				disablePictureInPicture
			>
				<source src={src} type="video/mp4" />
				Your browser does not support HTML5 video.
			</video>
			<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
		</div>
	);
};

const services: Service[] = [
	{
		id: "1",
		name: "Classic Cut",
		category: "cuts",
		duration: 45,
		price: 65,
		description: "Professional haircut with wash and style",
	},
	{
		id: "2",
		name: "Precision Cut",
		category: "cuts",
		duration: 60,
		price: 85,
		description: "Detailed precision cutting with consultation",
	},
	{
		id: "3",
		name: "Beard Trim",
		category: "cuts",
		duration: 30,
		price: 35,
		description: "Professional beard trimming and shaping",
	},

	{
		id: "4",
		name: "Full Color",
		category: "coloring",
		duration: 120,
		price: 150,
		description: "Complete hair coloring service",
	},
	{
		id: "5",
		name: "Highlights",
		category: "coloring",
		duration: 180,
		price: 200,
		description: "Professional highlighting technique",
	},
	{
		id: "6",
		name: "Root Touch-up",
		category: "coloring",
		duration: 90,
		price: 95,
		description: "Root color maintenance",
	},

	{
		id: "7",
		name: "Deep Conditioning",
		category: "treatments",
		duration: 45,
		price: 55,
		description: "Intensive hair conditioning treatment",
	},
	{
		id: "8",
		name: "Scalp Treatment",
		category: "treatments",
		duration: 60,
		price: 75,
		description: "Therapeutic scalp treatment",
	},
	{
		id: "9",
		name: "Keratin Treatment",
		category: "treatments",
		duration: 150,
		price: 300,
		description: "Professional keratin smoothing treatment",
	},
];

const stylists: Stylist[] = [
	{
		id: "1",
		name: "Sarah Johnson",
		photo:
			"https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&h=200&fit=crop&crop=face",
		specialties: ["Cuts", "Coloring"],
		rating: 4.9,
		age: 32,
		description: "Experienced stylist with a passion for cutting and coloring",
		experience: "5 years",
		education: "Hairdressing Institute",
		achievements: [
			"Best Hair Stylist 2022",
			"Winner of the Color Competition 2021",
		],
	},
	{
		id: "2",
		name: "Mike Chen",
		photo:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
		specialties: ["Cuts", "Treatments"],
		rating: 4.8,
		age: 28,
		description: "Skilled in both cutting and treatments",
		experience: "3 years",
		education: "Cosmetology School",
		achievements: ["Top Rated Stylist 2023"],
	},
	{
		id: "3",
		name: "Alex Johnson",
		photo:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
		specialties: ["Coloring", "Treatments"],
		rating: 4.9,
		age: 30,
		description: "Expert in both coloring and treatments",
		experience: "4 years",
		education: "Hairdressing Academy",
		achievements: [
			"Best Colorist 2022",
			"Winner of the Treatment Competition 2021",
		],
	},
];

const generateTimeSlots = (): { [date: string]: TimeSlot[] } => {
	const slots: { [date: string]: TimeSlot[] } = {};
	const times = [
		"9:00",
		"10:00",
		"11:00",
		"12:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
	];

	for (let i = 0; i < 60; i++) {
		const date = new Date();
		date.setDate(date.getDate() + i);
		const dateStr = date.toISOString().split("T")[0];

		slots[dateStr] = [];
		times.forEach((time) => {
			stylists.forEach((stylist) => {
				slots[dateStr].push({
					time,
					available: Math.random() > 0.3,
					stylistId: stylist.id,
				});
			});
		});
	}
	return slots;
};

const getCategoryIcon = (
	category: "cuts" | "coloring" | "treatments",
	className: string = "w-8 h-8"
) => {
	switch (category) {
		case "cuts":
			return <ScissorsIcon className={className} />;
		case "coloring":
			return <PaintBrushIcon className={className} />;
		case "treatments":
			return <SparklesIcon className={className} />;
		default:
			return <SparklesIcon className={className} />;
	}
};

const HairSalonApp: React.FC = () => {
	const [selectedCategory, setSelectedCategory] = useState<
		"cuts" | "coloring" | "treatments"
	>("cuts");
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [selectedTime, setSelectedTime] = useState<string>("");
	const [cart, setCart] = useState<CartItem[]>([]);
	const [showCart, setShowCart] = useState(false);
	const [showBooking, setShowBooking] = useState(false);
	const [showCheckout, setShowCheckout] = useState(false);
	const [timeSlots, setTimeSlots] = useState<{ [date: string]: TimeSlot[] }>(
		{}
	);
	const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
		name: "",
		email: "",
		phone: "",
	});
	const [notification, setNotification] = useState<Notification>({
		id: "",
		message: "",
		show: false,
	});
	const [isBookingComplete, setIsBookingComplete] = useState(false);
	const [emailError, setEmailError] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [isCartLoaded, setIsCartLoaded] = useState(false);
	const [showStylistModal, setShowStylistModal] = useState(false);
	const [selectedStylistForModal, setSelectedStylistForModal] =
		useState<Stylist | null>(null);
	const stylistSelectionRef = useRef<HTMLDivElement>(null);
	const dateSelectionRef = useRef<HTMLDivElement>(null);
	const timeSelectionRef = useRef<HTMLDivElement>(null);

	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [bookingStep, setBookingStep] = useState(1);

	useEffect(() => {
		setTimeSlots(generateTimeSlots());
		const today = new Date().toISOString().split("T")[0];
		setSelectedDate(today);

		if (typeof window !== "undefined") {
			try {
				const savedCart = localStorage.getItem("hairSalonCart");
				if (savedCart) {
					const parsedCart = JSON.parse(savedCart);
					setCart(parsedCart);
				}
				setIsCartLoaded(true);
			} catch (error) {
				console.error("Error loading cart from localStorage:", error);
			}
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined" && isCartLoaded) {
			try {
				localStorage.setItem("hairSalonCart", JSON.stringify(cart));
			} catch (error) {
				console.error("Error saving cart to localStorage:", error);
			}
		}
	}, [cart, isCartLoaded]);

	useEffect(() => {
		if (isBookingComplete && typeof window !== "undefined") {
			try {
				localStorage.removeItem("hairSalonCart");
			} catch (error) {
				console.error("Error clearing cart from localStorage:", error);
			}
		}
	}, [isBookingComplete]);

	useEffect(() => {
		const isAnyModalOpen =
			showBooking || showCart || showCheckout || showStylistModal;

		if (isAnyModalOpen) {
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = "0px";
		} else {
			document.body.style.overflow = "unset";
			document.body.style.paddingRight = "0px";
		}

		return () => {
			document.body.style.overflow = "unset";
			document.body.style.paddingRight = "0px";
		};
	}, [showBooking, showCart, showCheckout, showStylistModal]);

	useEffect(() => {
		if (showBooking) {
			setBookingStep(1);
		}
	}, [showBooking]);

	useEffect(() => {
		if (selectedService && bookingStep === 1) {
			setBookingStep(2);
		}
	}, [selectedService, bookingStep]);

	useEffect(() => {
		if (selectedStylist && bookingStep === 2) {
			setBookingStep(3);
		}
	}, [selectedStylist, bookingStep]);

	useEffect(() => {
		if (!showBooking) return;

		if (bookingStep === 2 && stylistSelectionRef.current) {
			setTimeout(() => {
				stylistSelectionRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 300);
		}
	}, [bookingStep, showBooking]);

	useEffect(() => {
		if (!showBooking) return;

		if (bookingStep === 3 && dateSelectionRef.current) {
			setTimeout(() => {
				dateSelectionRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 300);
		}
	}, [bookingStep, showBooking]);

	const categories = [
		{ key: "cuts" as const, name: "CUTS" },
		{ key: "coloring" as const, name: "COLORING" },
		{ key: "treatments" as const, name: "TREATMENTS" },
	];

	const filteredServices = services.filter(
		(service) => service.category === selectedCategory
	);

	const getAvailableSlots = (date: string) => {
		if (!selectedStylist || !timeSlots[date]) return [];
		return timeSlots[date].filter(
			(slot) => slot.stylistId === selectedStylist.id && slot.available
		);
	};

	const showNotification = (message: string) => {
		const id = Date.now().toString();
		setNotification({ id, message, show: true });
		setTimeout(() => {
			setNotification((prev) => ({ ...prev, show: false }));
		}, 4000);
	};

	const openStylistModal = (stylist: Stylist) => {
		setSelectedStylistForModal(stylist);
		setShowStylistModal(true);
	};

	const handleModalBackdropClick = (
		e: React.MouseEvent,
		modalType: "booking" | "cart" | "checkout" | "stylist"
	) => {
		if (e.target === e.currentTarget) {
			switch (modalType) {
				case "booking":
					setShowBooking(false);
					break;
				case "cart":
					setShowCart(false);
					break;
				case "checkout":
					setShowCheckout(false);
					setIsBookingComplete(false);
					break;
				case "stylist":
					setShowStylistModal(false);
					break;
			}
		}
	};

	const addToCart = () => {
		if (selectedService && selectedStylist && selectedDate && selectedTime) {
			const newItem: CartItem = {
				service: selectedService,
				stylist: selectedStylist,
				date: selectedDate,
				time: selectedTime,
			};

			const updatedCart = [...cart, newItem];
			setCart(updatedCart);

			if (typeof window !== "undefined") {
				try {
					localStorage.setItem("hairSalonCart", JSON.stringify(updatedCart));
				} catch (error) {
					console.error(
						"Error saving cart to localStorage in addToCart:",
						error
					);
				}
			}

			setSelectedService(null);
			setSelectedStylist(null);
			setSelectedTime("");
			setBookingStep(1);

			showNotification(`${selectedService.name} added to cart!`);
			setShowBooking(false);
		}
	};

	const removeFromCart = (index: number) => {
		const updatedCart = cart.filter((_, i) => i !== index);
		setCart(updatedCart);

		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("hairSalonCart", JSON.stringify(updatedCart));
			} catch (error) {
				console.error(
					"Error saving cart to localStorage in removeFromCart:",
					error
				);
			}
		}
	};

	const getTotalPrice = () => {
		return cart.reduce((total, item) => total + item.service.price, 0);
	};

	const getTotalDuration = () => {
		return cart.reduce((total, item) => total + item.service.duration, 0);
	};

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePhone = (phone: string) => {
		const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
		return phoneRegex.test(phone);
	};

	const formatPhoneNumber = (value: string) => {
		const numbers = value.replace(/\D/g, "");

		if (numbers.length <= 3) {
			return numbers;
		} else if (numbers.length <= 6) {
			return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
		} else {
			return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
				6,
				10
			)}`;
		}
	};

	const handlePhoneChange = (value: string) => {
		const formattedValue = formatPhoneNumber(value);
		setCustomerInfo((prev) => ({ ...prev, phone: formattedValue }));

		if (value) {
			const numbers = value.replace(/\D/g, "");
			if (numbers.length < 10) {
				setPhoneError("Please enter a valid 10-digit phone number");
			} else if (numbers.length > 15) {
				setPhoneError("Phone number should not exceed 15 digits");
			} else {
				setPhoneError("");
			}
		} else {
			setPhoneError("");
		}
	};

	const handleEmailChange = (value: string) => {
		setCustomerInfo((prev) => ({ ...prev, email: value }));
		if (value && !validateEmail(value)) {
			setEmailError("Please enter a valid email address (example@domain.com)");
		} else {
			setEmailError("");
		}
	};

	const clearCart = () => {
		setCart([]);
		if (typeof window !== "undefined") {
			try {
				localStorage.removeItem("hairSalonCart");
			} catch (error) {
				console.error("Error clearing cart from localStorage:", error);
			}
		}
	};

	const handleBookingSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		let hasErrors = false;

		if (!validateEmail(customerInfo.email)) {
			setEmailError("Please enter a valid email address");
			hasErrors = true;
		}

		const phoneDigits = customerInfo.phone.replace(/\D/g, "");
		if (phoneDigits.length < 10) {
			setPhoneError("Please enter a valid 10-digit phone number");
			hasErrors = true;
		}

		if (
			customerInfo.name &&
			customerInfo.email &&
			customerInfo.phone &&
			cart.length > 0 &&
			!hasErrors
		) {
			setTimeout(() => {
				setIsBookingComplete(true);
				clearCart();
				setCustomerInfo({ name: "", email: "", phone: "" });
				setEmailError("");
				setPhoneError("");
			}, 1000);
		}
	};

	const getDaysInMonth = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate();
	};

	const getFirstDayOfMonth = (year: number, month: number) => {
		return new Date(year, month, 1).getDay();
	};

	const isPastDate = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date < today;
	};

	const renderCalendar = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();

		const daysInMonth = getDaysInMonth(year, month);
		const firstDayOfMonth = getFirstDayOfMonth(year, month);

		const days = [];

		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(<div key={`prev-${i}`} className="h-9 sm:h-10 md:h-12"></div>);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day);
			const dateStr = date.toISOString().split("T")[0];
			const isPast = isPastDate(date);
			const isSelected = dateStr === selectedDate;
			const hasAvailability =
				selectedStylist &&
				timeSlots[dateStr]?.some(
					(slot) => slot.stylistId === selectedStylist.id && slot.available
				);

			days.push(
				<button
					key={`day-${day}`}
					disabled={isPast || !hasAvailability}
					onClick={() => {
						setSelectedDate(dateStr);
						setSelectedTime("");
					}}
					className={`h-9 sm:h-10 md:h-12 flex items-center justify-center rounded-xl text-sm transition-all ${
						isSelected
							? "bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold shadow-lg"
							: isPast || !hasAvailability
							? "text-gray-600 bg-gray-800/20 cursor-not-allowed"
							: "hover:bg-gray-800 text-gray-300"
					}`}
				>
					{day}
				</button>
			);
		}

		return days;
	};

	const prevMonth = () => {
		const date = new Date(currentMonth);
		date.setMonth(date.getMonth() - 1);

		const today = new Date();
		if (
			date.getMonth() < today.getMonth() &&
			date.getFullYear() <= today.getFullYear()
		) {
			return;
		}

		setCurrentMonth(date);
	};

	const nextMonth = () => {
		const date = new Date(currentMonth);
		date.setMonth(date.getMonth() + 1);
		setCurrentMonth(date);
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const formatMonth = (date: Date) => {
		return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
	};

	return (
		<>
			<link
				href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;900&display=swap"
				rel="stylesheet"
			/>
			<style>
				{`
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          button,a{cursor: pointer;}
          ::-webkit-scrollbar-track {
            background: #1f2937;
            border-radius: 8px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #d97706, #f59e0b);
            border-radius: 8px;
            transition: background 0.3s ease;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #f59e0b, #fbbf24);
          }
          
          ::-webkit-scrollbar-corner {
            background: #1f2937;
          }
          
          * {
            scrollbar-width: thin;
            scrollbar-color: #d97706 #1f2937;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(17, 24, 39, 0.5);
            border-radius: 8px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #d97706, #f59e0b);
            border-radius: 8px;
            transition: background 0.3s ease;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #f59e0b, #fbbf24);
          }
          
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: rgba(17, 24, 39, 0.5);
          }
          
          .modal-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          .modal-scrollbar::-webkit-scrollbar-track {
            background: rgba(55, 65, 81, 0.3);
            border-radius: 8px;
          }
          
          .modal-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #d97706, #f59e0b);
            border-radius: 8px;
            transition: background 0.3s ease;
          }
          
          .modal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #f59e0b, #fbbf24);
          }
          
          .modal-scrollbar::-webkit-scrollbar-corner {
            background: rgba(55, 65, 81, 0.3);
          }
          
          .metallic-gradient {
            background: linear-gradient(
              90deg,
              #fbbf24 0%,
              #f59e0b 20%,
              #d97706 40%,
              #CB692B 50%,
              #d97706 60%,
              #f59e0b 80%,
              #fbbf24 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: metallic-shine 8s linear infinite;
          }
          
          @keyframes metallic-shine {
            0% {
              background-position: 0% center;
            }
            100% {
              background-position: 200% center;
            }
          }
          
          .glass-card {
            backdrop-filter: blur(10px);
            background: rgba(31, 41, 55, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          
          .golden-glow {
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
            transition: box-shadow 0.3s ease;
          }
          
          .golden-glow:hover {
            box-shadow: 0 0 25px rgba(251, 191, 36, 0.5);
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          }
          
          .gradient-button {
            background: linear-gradient(to right, #d97706, #f59e0b);
            transition: all 0.3s ease;
          }
          
          .gradient-button:hover {
            background: linear-gradient(to right, #f59e0b, #fbbf24);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
          
          .neon-border {
            box-shadow: 0 0 5px rgba(251, 191, 36, 0.5), inset 0 0 5px rgba(251, 191, 36, 0.5);
          }

          .booking-progress-bar {
            background: linear-gradient(to right, #d97706 var(--progress), #374151 var(--progress));
          }
          
          @media (max-width: 640px) {
            .booking-grid {
              grid-template-columns: 1fr;
            }
          }
          
          
          @media (max-width: 360px) {
            .shrink-text-xs {
              font-size: 0.75rem;
            }
            .shrink-heading-xs {
              font-size: 1.5rem;
            }
          }

          
          @supports (-webkit-touch-callout: none) {
            .ios-height-fix {
              height: -webkit-fill-available;
            }
          }
        `}
			</style>
			<div
				className="min-h-screen gradient-bg text-white"
				style={{ fontFamily: "Montserrat, sans-serif" }}
			>
				<nav className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md fixed w-full z-40 border-b border-amber-600/30">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center">
								<h1 className="text-sm sm:text-lg lg:text-xl font-bold metallic-gradient">
									<span className="hidden sm:inline">
										CROWN & BLADE Hair Salon
									</span>
									<span className="sm:hidden">CROWN & BLADE</span>
								</h1>
							</div>
							<div className="flex items-center space-x-3 sm:space-x-5">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowCart(!showCart)}
									className="relative gradient-button text-white px-2 py-2 sm:px-3 sm:py-2 rounded-full hover:bg-amber-500 transition-all font-medium flex items-center space-x-1 sm:space-x-2 shadow-lg"
								>
									<ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
									<span className="hidden sm:inline text-sm">CART</span>

									{cart.length > 0 && (
										<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{cart.length}
										</span>
									)}
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowBooking(!showBooking)}
									className="gradient-button text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full transition-all font-medium text-xs sm:text-sm shadow-lg"
								>
									<span className="hidden sm:inline">BOOK NOW</span>
									<span className="sm:hidden">BOOK</span>
								</motion.button>
							</div>
						</div>
					</div>
				</nav>

				<section className="relative h-screen pt-16 flex items-center justify-center bg-cover bg-center">
					<HeroBackgroundVideo src="https://res.cloudinary.com/dw9fentsh/video/upload/v1/sf8ymrlulbirf74rxhkr.mp4" />
					<div className="text-center max-w-4xl px-4 relative z-10">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1 }}
							className="glass-card p-8 sm:p-12 rounded-3xl max-w-3xl mx-auto"
						>
							<motion.h1
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1 }}
								className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-wider shrink-heading-xs"
							>
								WELCOME TO
								<br />
								<span className="text-amber-400 metallic-gradient">
									CROWN & BLADE
								</span>
								<br />
								<span className="text-3xl sm:text-4xl md:text-5xl font-light tracking-widest">
									HAIR SALON
								</span>
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1, delay: 0.3 }}
								className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 shrink-text-xs"
							>
								Book with confidence at Crown & Blade where you can relax and
								get all your grooming needs fulfilled
							</motion.p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.2,
									hover: { duration: 0.2 },
									tap: { duration: 0.1 },
								}}
								onClick={() => setShowBooking(true)}
								className="gradient-button px-8 py-4 text-xl font-bold rounded-full shadow-xl hover:shadow-amber-600/20"
							>
								BOOK NOW
							</motion.button>
						</motion.div>
					</div>
				</section>

				<section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold metallic-gradient mb-4 shrink-heading-xs">
								OUR SERVICES
							</h2>
							<p className="text-gray-300 text-lg">
								Professional services delivered with precision and care
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{categories.map((category, index) => (
								<motion.div
									key={category.key}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.2 }}
									onClick={() => {
										setSelectedCategory(category.key);
										setShowBooking(true);
									}}
									className="glass-card golden-glow rounded-2xl p-8 text-center cursor-pointer hover:border-amber-600/50 transition-all group"
								>
									<div className="mb-6 group-hover:scale-110 transition-transform flex justify-center">
										<div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
											{getCategoryIcon(category.key, "w-12 h-12 text-white")}
										</div>
									</div>
									<h3 className="text-2xl font-bold text-amber-400 mb-4">
										{category.name}
									</h3>
									<p className="text-gray-300 mb-6">
										{category.key === "cuts" &&
											"Professional haircuts and beard trims"}
										{category.key === "coloring" &&
											"Expert hair coloring and highlights"}
										{category.key === "treatments" &&
											"Luxury hair and scalp treatments"}
									</p>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="gradient-button text-white px-6 py-3 rounded-full font-medium shadow-lg"
									>
										VIEW SERVICES
									</motion.button>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold metallic-gradient mb-4 shrink-heading-xs">
								OUR STYLISTS
							</h2>
							<p className="text-gray-300 text-lg">
								Meet our talented team of professional stylists
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{stylists.map((stylist, index) => (
								<motion.div
									key={stylist.id}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.2 }}
									onClick={() => openStylistModal(stylist)}
									className="glass-card golden-glow rounded-2xl p-8 text-center cursor-pointer hover:border-amber-600/50 transition-all group"
								>
									<div className="mb-6 group-hover:scale-105 transition-transform">
										<img
											src={stylist.photo}
											alt={stylist.name}
											className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-amber-600 neon-border shadow-xl"
										/>
									</div>
									<h3 className="text-xl font-bold text-amber-400 mb-2">
										{stylist.name}
									</h3>
									<p className="text-gray-400 text-sm mb-3">
										{stylist.specialties.join(" • ")}
									</p>
									<div className="flex items-center justify-center space-x-1 mb-3">
										<SparklesIcon className="text-amber-400 w-4 h-4" />
										<span className="text-gray-300 text-sm">
											{stylist.rating}
										</span>
									</div>
									<p className="text-gray-500 text-xs">
										{stylist.experience} experience
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<AnimatePresence>
					{showBooking && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
							onClick={(e: React.MouseEvent) =>
								handleModalBackdropClick(e, "booking")
							}
						>
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-amber-600/30 modal-scrollbar golden-glow"
								style={{
									scrollbarWidth: "thin",
									scrollbarColor: "#d97706 #374151",
								}}
							>
								<div className="p-6 border-b border-amber-600/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 sticky top-0 z-10">
									<div className="flex justify-between items-center">
										<h2 className="text-3xl font-bold metallic-gradient shrink-heading-xs">
											BOOK YOUR APPOINTMENT
										</h2>
										<button
											onClick={() => setShowBooking(false)}
											className="text-gray-400 hover:text-white text-2xl bg-gray-800/50 p-2 rounded-full transition-colors"
										>
											<XMarkIcon className="w-6 h-6" />
										</button>
									</div>

									{}
									<div className="mt-4 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
										<div
											className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-500"
											style={{ width: `${(bookingStep / 3) * 100}%` }}
										></div>
									</div>

									{}
									<div className="flex justify-between mt-2">
										<div
											className={`text-xs ${
												bookingStep >= 1
													? "text-amber-400 font-bold"
													: "text-gray-400"
											}`}
										>
											1. Select Service
										</div>
										<div
											className={`text-xs ${
												bookingStep >= 2
													? "text-amber-400 font-bold"
													: "text-gray-400"
											}`}
										>
											2. Choose Stylist
										</div>
										<div
											className={`text-xs ${
												bookingStep >= 3
													? "text-amber-400 font-bold"
													: "text-gray-400"
											}`}
										>
											3. Schedule
										</div>
									</div>
								</div>

								<div className="p-6 lg:p-8">
									{}
									<div
										className={`grid grid-cols-1 ${
											selectedStylist ? "lg:grid-cols-2" : "lg:grid-cols-1"
										} gap-8`}
									>
										{}
										<div
											className={`space-y-6 ${
												bookingStep !== 1 && selectedStylist
													? "lg:col-span-1"
													: "lg:col-span-2"
											}`}
										>
											<div
												className={`${
													bookingStep !== 1 ? "hidden lg:block" : ""
												}`}
											>
												<h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
													<span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm mr-2">
														1
													</span>
													SELECT SERVICE CATEGORY
												</h3>
												<div className="grid grid-cols-3 gap-4">
													{categories.map((category) => (
														<motion.button
															key={category.key}
															whileHover={{ scale: 1.02 }}
															whileTap={{ scale: 0.98 }}
															onClick={() => {
																setSelectedCategory(category.key);
																setSelectedService(null);
															}}
															className={`p-4 rounded-xl border transition-all text-center ${
																selectedCategory === category.key
																	? "border-amber-600 bg-gradient-to-br from-amber-600/30 to-amber-500/20 text-amber-400 shadow-lg shadow-amber-600/10"
																	: "border-gray-700/50 hover:border-gray-600 text-gray-300 bg-gray-800/30"
															}`}
														>
															<div className="mb-3 flex justify-center">
																{getCategoryIcon(category.key, "w-7 h-7")}
															</div>
															<div className="font-medium text-xs sm:text-sm truncate">
																{category.name}
															</div>
														</motion.button>
													))}
												</div>
											</div>

											<div
												className={`${
													bookingStep !== 1 ? "hidden lg:block" : ""
												}`}
											>
												<h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
													<span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm mr-2">
														1
													</span>
													CHOOSE{" "}
													{
														categories.find((c) => c.key === selectedCategory)
															?.name
													}{" "}
													SERVICE
												</h3>
												<div className="space-y-3">
													{filteredServices.map((service) => (
														<motion.div
															key={service.id}
															whileHover={{ scale: 1.01 }}
															onClick={() => setSelectedService(service)}
															className={`p-5 rounded-xl border cursor-pointer transition-all ${
																selectedService?.id === service.id
																	? "border-amber-600 bg-gradient-to-br from-amber-600/30 to-amber-500/20 shadow-lg shadow-amber-600/10"
																	: "border-gray-700/50 hover:border-gray-600 bg-gray-800/30"
															}`}
														>
															<div className="flex justify-between items-start">
																<div className="flex-1">
																	<h4 className="font-medium text-white text-lg">
																		{service.name}
																	</h4>
																	<p className="text-gray-400 text-sm mt-1">
																		{service.description}
																	</p>
																	<p className="text-amber-400 text-sm mt-2 font-medium">
																		{service.duration} minutes
																	</p>
																</div>
																<div className="text-right">
																	<div className="font-bold text-amber-400 text-xl">
																		${service.price}
																	</div>
																</div>
															</div>
														</motion.div>
													))}
												</div>
											</div>

											{}
											{(selectedService || bookingStep > 1) && (
												<motion.div
													ref={stylistSelectionRef}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													className={bookingStep !== 2 ? "hidden lg:block" : ""}
												>
													<h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
														<span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm mr-2">
															2
														</span>
														CHOOSE YOUR STYLIST
													</h3>
													<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
														{stylists.map((stylist) => (
															<motion.div
																key={stylist.id}
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.98 }}
																onClick={() => setSelectedStylist(stylist)}
																className={`p-5 rounded-xl border cursor-pointer transition-all text-center ${
																	selectedStylist?.id === stylist.id
																		? "border-amber-600 bg-gradient-to-br from-amber-600/30 to-amber-500/20 shadow-lg shadow-amber-600/10"
																		: "border-gray-700/50 hover:border-gray-600 bg-gray-800/30"
																}`}
															>
																<img
																	src={stylist.photo}
																	alt={stylist.name}
																	className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-amber-600 shadow-lg"
																/>
																<h4 className="font-medium text-white">
																	{stylist.name}
																</h4>
																<p className="text-gray-400 text-sm mt-1">
																	{stylist.specialties.join(", ")}
																</p>
																<div className="flex items-center justify-center mt-2">
																	<SparklesIcon className="text-amber-400 w-4 h-4" />
																	<span className="text-gray-400 text-sm ml-1">
																		{stylist.rating}
																	</span>
																</div>
															</motion.div>
														))}
													</div>
												</motion.div>
											)}
										</div>

										{}
										{selectedStylist && (
											<motion.div
												ref={dateSelectionRef}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												className={`${
													bookingStep !== 3 ? "hidden lg:block" : ""
												} lg:border-l lg:border-amber-600/20 lg:pl-6`}
											>
												<h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
													<span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm mr-2">
														3
													</span>
													SELECT DATE & TIME
												</h3>

												{}
												<div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 mb-6">
													<div className="flex justify-between items-center mb-4">
														<button
															onClick={prevMonth}
															className="p-2 rounded-full hover:bg-gray-700 transition-colors"
														>
															<ChevronLeftIcon className="w-5 h-5" />
														</button>
														<h4 className="text-lg font-bold text-amber-400">
															{formatMonth(currentMonth)}
														</h4>
														<button
															onClick={nextMonth}
															className="p-2 rounded-full hover:bg-gray-700 transition-colors"
														>
															<ChevronRightIcon className="w-5 h-5" />
														</button>
													</div>

													<div className="grid grid-cols-7 gap-1 text-center mb-2">
														{["S", "M", "T", "W", "T", "F", "S"].map(
															(day, i) => (
																<div
																	key={i}
																	className="text-gray-400 text-sm font-medium"
																>
																	{day}
																</div>
															)
														)}
													</div>

													<div className="grid grid-cols-7 gap-1">
														{renderCalendar()}
													</div>
												</div>

												{}
												{selectedDate && (
													<div className="mb-6">
														<h4 className="text-lg font-bold text-amber-400 mb-3">
															Available Times for {formatDate(selectedDate)}
														</h4>
														<div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
															{getAvailableSlots(selectedDate).length > 0 ? (
																getAvailableSlots(selectedDate).map((slot) => (
																	<button
																		key={`${slot.time}-${slot.stylistId}`}
																		onClick={() => setSelectedTime(slot.time)}
																		className={`p-3 rounded-xl border text-center transition-all ${
																			selectedTime === slot.time
																				? "border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold shadow-lg"
																				: "border-gray-700/50 hover:border-gray-600 text-gray-300 bg-gray-800/30"
																		}`}
																	>
																		{slot.time}
																	</button>
																))
															) : (
																<p className="col-span-full text-gray-400 text-center py-4">
																	No available time slots for this date
																</p>
															)}
														</div>
													</div>
												)}

												{}
												{selectedService &&
													selectedStylist &&
													selectedDate &&
													selectedTime && (
														<div className="bg-gray-800/40 p-5 rounded-xl border border-amber-600/30 shadow-lg">
															<h4 className="text-lg font-bold text-amber-400 mb-3">
																Booking Summary
															</h4>
															<div className="space-y-2 mb-4">
																<div className="flex justify-between">
																	<span className="text-gray-300">
																		Service:
																	</span>
																	<span className="text-white font-medium">
																		{selectedService.name}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span className="text-gray-300">
																		Stylist:
																	</span>
																	<span className="text-white font-medium">
																		{selectedStylist.name}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span className="text-gray-300">Date:</span>
																	<span className="text-white font-medium">
																		{formatDate(selectedDate)}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span className="text-gray-300">Time:</span>
																	<span className="text-white font-medium">
																		{selectedTime}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span className="text-gray-300">
																		Duration:
																	</span>
																	<span className="text-white font-medium">
																		{selectedService.duration} minutes
																	</span>
																</div>
																<div className="flex justify-between">
																	<span className="text-gray-300">Price:</span>
																	<span className="text-amber-400 font-bold">
																		${selectedService.price}
																	</span>
																</div>
															</div>
															<motion.button
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.98 }}
																onClick={addToCart}
																className="w-full gradient-button text-white py-3 rounded-xl font-bold shadow-lg"
															>
																ADD TO CART
															</motion.button>
														</div>
													)}
											</motion.div>
										)}
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showCart && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
							onClick={(e: React.MouseEvent) =>
								handleModalBackdropClick(e, "cart")
							}
						>
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-amber-600/30 golden-glow"
							>
								<div className="p-6 border-b border-amber-600/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 sticky top-0 z-10">
									<div className="flex justify-between items-center mb-2">
										<h2 className="text-2xl font-bold metallic-gradient shrink-heading-xs">
											YOUR BOOKING CART
										</h2>
										<button
											onClick={() => setShowCart(false)}
											className="text-gray-400 hover:text-white text-2xl bg-gray-800/50 p-2 rounded-full transition-colors"
										>
											<XMarkIcon className="w-6 h-6" />
										</button>
									</div>
								</div>

								<div className="p-6">
									{cart.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-12 px-4">
											<ShoppingCartIcon className="w-16 h-16 text-gray-500 mb-4" />
											<p className="text-gray-400 text-center text-lg mb-6">
												Your cart is empty
											</p>
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => {
													setShowCart(false);
													setShowBooking(true);
												}}
												className="gradient-button text-white px-6 py-3 rounded-full font-medium shadow-lg"
											>
												BOOK NOW
											</motion.button>
										</div>
									) : (
										<>
											<div className="space-y-4 mb-6">
												{cart.map((item, index) => (
													<div
														key={index}
														className="border border-gray-700/50 rounded-xl p-4 bg-gray-800/30 shadow-md"
													>
														<div className="flex justify-between items-start">
															<div className="flex-1">
																<h3 className="font-medium text-white text-lg">
																	{item.service.name}
																</h3>
																<p className="text-gray-400 text-sm">
																	with {item.stylist.name}
																</p>
																<p className="text-gray-400 text-sm">
																	{formatDate(item.date)} at {item.time}
																</p>
																<p className="text-amber-400 text-sm font-medium mt-1">
																	{item.service.duration} minutes
																</p>
															</div>
															<div className="text-right">
																<div className="font-bold text-amber-400 text-xl">
																	${item.service.price}
																</div>
																<button
																	onClick={() => removeFromCart(index)}
																	className="text-red-400 hover:text-red-300 text-sm mt-2 bg-red-900/20 px-3 py-1 rounded-full transition-colors"
																>
																	Remove
																</button>
															</div>
														</div>
													</div>
												))}
											</div>

											<div className="border-t border-gray-700/50 pt-6 mt-6">
												<div className="flex justify-between text-lg font-semibold text-white mb-3">
													<span>Total Duration:</span>
													<span className="text-amber-400">
														{getTotalDuration()} minutes
													</span>
												</div>
												<div className="flex justify-between text-2xl font-bold text-white mb-6">
													<span>Total Price:</span>
													<span className="text-amber-400">
														${getTotalPrice()}
													</span>
												</div>
												<motion.button
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													onClick={() => {
														setShowCart(false);
														setShowCheckout(true);
													}}
													className="w-full gradient-button text-white py-4 rounded-xl font-bold text-lg shadow-lg"
												>
													CHECKOUT
												</motion.button>
											</div>
										</>
									)}
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{notification.show && (
						<div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4">
							<motion.div
								initial={{ opacity: 0, y: -100 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -100 }}
								className="w-full max-w-md bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center justify-center space-x-4"
							>
								<CheckIcon className="w-5 h-5 flex-shrink-0" />
								<span className="font-medium">{notification.message}</span>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => {
										setNotification((prev) => ({ ...prev, show: false }));
										setShowCart(true);
									}}
									className="bg-white text-amber-600 px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors shadow-md"
								>
									View Cart
								</motion.button>
							</motion.div>
						</div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showCheckout && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
							onClick={(e: React.MouseEvent) =>
								handleModalBackdropClick(e, "checkout")
							}
						>
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-amber-600/30 modal-scrollbar golden-glow"
								style={{
									scrollbarWidth: "thin",
									scrollbarColor: "#d97706 #374151",
								}}
							>
								<div className="p-6 border-b border-amber-600/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 sticky top-0 z-10">
									<div className="flex justify-between items-center mb-2">
										<h2 className="text-2xl font-bold metallic-gradient shrink-heading-xs">
											{isBookingComplete
												? "APPOINTMENT CONFIRMED"
												: "COMPLETE YOUR BOOKING"}
										</h2>
										<button
											onClick={() => {
												setShowCheckout(false);
												setIsBookingComplete(false);
											}}
											className="text-gray-400 hover:text-white text-2xl bg-gray-800/50 p-2 rounded-full transition-colors"
										>
											<XMarkIcon className="w-6 h-6" />
										</button>
									</div>
								</div>

								<div className="p-6">
									{isBookingComplete ? (
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											className="text-center py-12"
										>
											<div className="mb-6 text-green-500 flex justify-center">
												<div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
													<CheckIcon className="w-12 h-12 text-white" />
												</div>
											</div>
											<h3 className="text-2xl font-bold text-amber-400 mb-4">
												Booking Confirmed!
											</h3>
											<p className="text-gray-300 mb-8">
												We'll send you a confirmation email shortly.
											</p>
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => {
													setShowCheckout(false);
													setIsBookingComplete(false);
												}}
												className="gradient-button text-white px-6 py-3 rounded-full font-medium shadow-lg"
											>
												DONE
											</motion.button>
										</motion.div>
									) : (
										<>
											<div className="mb-8">
												<h3 className="text-lg font-bold text-amber-400 mb-4">
													ORDER SUMMARY
												</h3>
												<div className="space-y-3">
													{cart.map((item, index) => (
														<div
															key={index}
															className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
														>
															<div>
																<h4 className="text-white font-medium">
																	{item.service.name}
																</h4>
																<p className="text-gray-400 text-sm">
																	{item.stylist.name} • {formatDate(item.date)}{" "}
																	at {item.time}
																</p>
															</div>
															<span className="text-amber-400 font-bold">
																${item.service.price}
															</span>
														</div>
													))}
													<div className="border-t border-gray-700/50 pt-4 mt-3 flex justify-between items-center">
														<span className="text-lg font-bold text-white">
															Total:
														</span>
														<span className="text-xl font-bold text-amber-400">
															${getTotalPrice()}
														</span>
													</div>
												</div>
											</div>

											<form onSubmit={handleBookingSubmit}>
												<h3 className="text-lg font-bold text-amber-400 mb-4">
													CUSTOMER INFORMATION
												</h3>
												<div className="space-y-4 mb-6">
													<div>
														<label className="block text-gray-300 text-sm font-medium mb-2">
															Full Name *
														</label>
														<input
															type="text"
															required
															value={customerInfo.name}
															onChange={(e) =>
																setCustomerInfo((prev) => ({
																	...prev,
																	name: e.target.value,
																}))
															}
															className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:border-amber-600 focus:outline-none shadow-inner"
															placeholder="Enter your full name"
														/>
													</div>
													<div>
														<label className="block text-gray-300 text-sm font-medium mb-2">
															Email Address *
														</label>
														<input
															type="email"
															required
															value={customerInfo.email}
															onChange={(e) =>
																handleEmailChange(e.target.value)
															}
															className={`w-full p-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none shadow-inner ${
																emailError
																	? "border-red-500 focus:border-red-500"
																	: "border-gray-700/50 focus:border-amber-600"
															}`}
															placeholder="Enter your email address (example@domain.com)"
														/>
														{emailError && (
															<p className="text-red-400 text-sm mt-2 bg-red-900/20 p-3 rounded-xl border-l-4 border-red-500">
																{emailError}
															</p>
														)}
													</div>
													<div>
														<label className="block text-gray-300 text-sm font-medium mb-2">
															Phone Number *
														</label>
														<input
															type="tel"
															required
															value={customerInfo.phone}
															onChange={(e) =>
																handlePhoneChange(e.target.value)
															}
															className={`w-full p-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none shadow-inner ${
																phoneError
																	? "border-red-500 focus:border-red-500"
																	: "border-gray-700/50 focus:border-amber-600"
															}`}
															placeholder="Enter your phone number ((555) 123-4567)"
														/>
														{phoneError && (
															<p className="text-red-400 text-sm mt-2 bg-red-900/20 p-3 rounded-xl border-l-4 border-red-500">
																{phoneError}
															</p>
														)}
														{!phoneError && customerInfo.phone && (
															<p className="text-green-400 text-sm mt-2">
																Valid phone number format
															</p>
														)}
													</div>
												</div>

												<motion.button
													type="submit"
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="w-full gradient-button text-white py-4 rounded-xl font-bold text-lg shadow-lg"
												>
													CONFIRM BOOKING
												</motion.button>
											</form>
										</>
									)}
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showStylistModal && selectedStylistForModal && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
							onClick={(e: React.MouseEvent) =>
								handleModalBackdropClick(e, "stylist")
							}
						>
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-amber-600/30 modal-scrollbar golden-glow"
								style={{
									scrollbarWidth: "thin",
									scrollbarColor: "#d97706 #374151",
								}}
							>
								<div className="p-6 border-b border-amber-600/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 sticky top-0 z-10">
									<div className="flex justify-between items-center mb-2">
										<h2 className="text-2xl font-bold metallic-gradient shrink-heading-xs">
											STYLIST PROFILE
										</h2>
										<button
											onClick={() => setShowStylistModal(false)}
											className="text-gray-400 hover:text-white text-2xl bg-gray-800/50 p-2 rounded-full transition-colors"
										>
											<XMarkIcon className="w-6 h-6" />
										</button>
									</div>
								</div>

								<div className="p-6">
									<div className="flex flex-col md:flex-row md:gap-10 md:justify-start md:items-start">
										<div className="text-center mb-8 flex flex-col justify-center items-center">
											<div className="relative mb-6">
												<div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full blur-md opacity-50 transform scale-110"></div>
												<img
													src={selectedStylistForModal.photo}
													alt={selectedStylistForModal.name}
													className="w-40 h-40 rounded-full relative z-10 object-cover border-4 border-amber-600 shadow-lg"
												/>
											</div>
											<h3 className="text-2xl font-bold text-amber-400 mb-2">
												{selectedStylistForModal.name}
											</h3>
											<p className="text-gray-400 text-lg mb-3">
												{selectedStylistForModal.age} years old
											</p>
											<div className="flex items-center justify-center space-x-1 mb-4">
												<div className="bg-amber-600/20 px-3 py-1 rounded-full flex items-center">
													<SparklesIcon className="text-amber-400 w-5 h-5 mr-1" />
													<span className="text-amber-300 text-lg font-medium">
														{selectedStylistForModal.rating}
													</span>
												</div>
											</div>
										</div>

										<div className="space-y-6 flex-1">
											<div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
												<h4 className="text-lg font-bold text-amber-400 mb-3">
													About
												</h4>
												<p className="text-gray-300 leading-relaxed">
													{selectedStylistForModal.description}
												</p>
											</div>

											<div>
												<h4 className="text-lg font-bold text-amber-400 mb-3">
													Specialties
												</h4>
												<div className="flex flex-wrap gap-2">
													{selectedStylistForModal.specialties.map(
														(specialty, index) => (
															<span
																key={index}
																className="bg-amber-600/20 text-amber-400 px-3 py-1 rounded-full text-sm border border-amber-600/30"
															>
																{specialty}
															</span>
														)
													)}
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
													<h4 className="text-lg font-bold text-amber-400 mb-2">
														Experience
													</h4>
													<p className="text-gray-300">
														{selectedStylistForModal.experience}
													</p>
												</div>
												<div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
													<h4 className="text-lg font-bold text-amber-400 mb-2">
														Education
													</h4>
													<p className="text-gray-300">
														{selectedStylistForModal.education}
													</p>
												</div>
											</div>

											{selectedStylistForModal.achievements.length > 0 && (
												<div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
													<h4 className="text-lg font-bold text-amber-400 mb-3">
														Achievements
													</h4>
													<ul className="space-y-2">
														{selectedStylistForModal.achievements.map(
															(achievement, index) => (
																<li
																	key={index}
																	className="flex items-center space-x-2"
																>
																	<CheckIcon className="text-amber-400 w-4 h-4 flex-shrink-0" />
																	<span className="text-gray-300">
																		{achievement}
																	</span>
																</li>
															)
														)}
													</ul>
												</div>
											)}
										</div>
									</div>

									<div className="mt-8 pt-6 border-t border-amber-600/20">
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => {
												setShowStylistModal(false);
												setSelectedStylist(selectedStylistForModal);
												setShowBooking(true);
												setBookingStep(2);
											}}
											className="w-full gradient-button text-white py-4 rounded-xl font-bold shadow-lg"
										>
											BOOK WITH {selectedStylistForModal.name.toUpperCase()}
										</motion.button>
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<footer className="bg-gradient-to-b from-gray-900 to-gray-800 border-t border-amber-600/30 py-12">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							<h3 className="text-2xl font-bold metallic-gradient mb-6 shrink-heading-xs">
								CROWN & BLADE Hair Salon
							</h3>
							<div className="flex flex-wrap justify-center gap-4 mb-6">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowBooking(true)}
									className="text-gray-300 hover:text-amber-400 transition-colors bg-gray-800/30 px-4 py-2 rounded-full border border-gray-700/30 shadow-md"
								>
									Book Appointment
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowCart(true)}
									className="text-gray-300 hover:text-amber-400 transition-colors bg-gray-800/30 px-4 py-2 rounded-full border border-gray-700/30 shadow-md"
								>
									View Cart
								</motion.button>
							</div>
							<div className="flex justify-center space-x-6 mb-8">
								{/* Generic Social Media Icons */}
								<a
									href="#"
									className="text-gray-400 hover:text-amber-400 transition-colors"
								>
									<span className="sr-only">Social Network</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-amber-400 transition-colors"
								>
									<span className="sr-only">Social Network</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z" />
									</svg>
								</a>

								<a
									href="#"
									className="text-gray-400 hover:text-amber-400 transition-colors"
								>
									<span className="sr-only">Social Network</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
									</svg>
								</a>
							</div>
							<p className="text-gray-400 text-sm">
								© 2025 Crown & Blade Hair Salon.
							</p>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
};

export default HairSalonApp;
