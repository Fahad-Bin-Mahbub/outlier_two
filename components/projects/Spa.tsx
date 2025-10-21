"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";

// ===============================
// Types
// ===============================
type FeaturedService = {
	id: number;
	title: string;
	description: string;
	benefits: string[];
	image: string;
};

type SpaService = {
	id: number;
	name: string;
	duration: string;
	price: number;
	description: string;
};

type AppointmentTime = {
	id: number;
	time: string;
};

type UserInfo = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	specialRequests: string;
};

type Booking = {
	service: SpaService | null;
	date: Date | null;
	time: AppointmentTime | null;
	userInfo: UserInfo;
};

type CompletedBooking = {
	id: string;
	service: SpaService;
	date: Date;
	time: AppointmentTime;
	userInfo: UserInfo;
	createdAt: Date;
};

// ===============================
// Sample Data
// ===============================
const featuredServices: FeaturedService[] = [
	{
		id: 1,
		title: "Premium Relaxation Experience",
		description:
			"Indulge in our signature treatments designed to rejuvenate your body and mind",
		benefits: [
			"Personalized care from our expert therapists",
			"Organic products tailored to your needs",
			"Tranquil environment for complete relaxation",
			"Complimentary refreshments and amenities",
		],
		image:
			"https://www.cvent.com/sites/default/files/styles/focus_scale_and_crop_800x450/public/image/2021-12/massage%20stones%2C%20essential%20oils%2C%20and%20sea%20salt%20set%20up%20for%20spa%20marketing.jpg?h=4bb87b2c&itok=euQKBabN",
	},
	{
		id: 2,
		title: "Luxury Couples Package",
		description:
			"Share the spa experience with your loved one in our private suite",
		benefits: [
			"Side-by-side treatments",
			"Private relaxation lounge",
			"Champagne and chocolate covered strawberries",
			"Dual massage therapists",
		],
		image:
			"https://www.rontar.com/blog/wp-content/uploads/2024/05/spa-name-ideas.jpg",
	},
];

const spaServices: SpaService[] = [
	{
		id: 1,
		name: "Full Body Massage",
		duration: "60 min",
		price: 80,
		description: "A relaxing full body massage to relieve tension and stress.",
	},
	{
		id: 2,
		name: "Thai Massage",
		duration: "90 min",
		price: 100,
		description:
			"Traditional Thai massage focusing on pressure points and stretching.",
	},
	{
		id: 3,
		name: "Russian Massage",
		duration: "75 min",
		price: 90,
		description:
			"Deep tissue massage technique focusing on improving circulation.",
	},
	{
		id: 4,
		name: "Hot Stone Therapy",
		duration: "80 min",
		price: 110,
		description: "Relaxing massage using heated stones to ease muscle tension.",
	},
	{
		id: 5,
		name: "Aromatherapy Massage",
		duration: "60 min",
		price: 85,
		description:
			"Gentle massage with essential oils for relaxation and rejuvenation.",
	},
];

const timeSlots: AppointmentTime[] = [
	{ id: 1, time: "9:00 AM" },
	{ id: 2, time: "10:30 AM" },
	{ id: 3, time: "12:00 PM" },
	{ id: 4, time: "1:30 PM" },
	{ id: 5, time: "3:00 PM" },
	{ id: 6, time: "4:30 PM" },
	{ id: 7, time: "6:00 PM" },
];

// ===============================
// Main App Component
// ===============================
const App: React.FC = () => {
	// States
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [previousStep, setPreviousStep] = useState<number>(1);
	const [booking, setBooking] = useState<Booking>({
		service: null,
		date: null,
		time: null,
		userInfo: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			specialRequests: "",
		},
	});
	const [completedBookings, setCompletedBookings] = useState<
		CompletedBooking[]
	>([]);
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth()
	);
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear()
	);
	const [darkMode, setDarkMode] = useState<boolean>(() => {
		// Only run this code in the browser
		if (typeof window !== "undefined") {
			const savedMode = localStorage.getItem("darkMode");
			return savedMode ? JSON.parse(savedMode) : false;
		}
		return false;
	});
	const [isAnimating, setIsAnimating] = useState<boolean>(false);
	const [showConfetti, setShowConfetti] = useState<boolean>(false);
	const [showBookingsList, setShowBookingsList] = useState<boolean>(false);
	const [editingBooking, setEditingBooking] = useState<CompletedBooking | null>(
		null
	);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

	// Refs
	const headerRef = useRef<HTMLDivElement>(null);
	const servicesRef = useRef<HTMLDivElement>(null);
	const bookingRef = useRef<HTMLDivElement>(null);

	// Dark mode effect
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		localStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, [darkMode]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("animate-fade-in");
					}
				});
			},
			{ threshold: 0.1 }
		);

		const hiddenElements = document.querySelectorAll(".animate-on-scroll");
		hiddenElements.forEach((el) => observer.observe(el));

		return () => {
			hiddenElements.forEach((el) => observer.unobserve(el));
		};
	}, [currentStep]);

	useEffect(() => {
		if (showConfetti) {
			const canvas = document.createElement("canvas");
			canvas.style.position = "fixed";
			canvas.style.top = "0";
			canvas.style.left = "0";
			canvas.style.width = "100vw";
			canvas.style.height = "100vh";
			canvas.style.pointerEvents = "none";
			canvas.style.zIndex = "1000";
			document.body.appendChild(canvas);

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			const colors = ["#14B8A6", "#0F766E", "#F472B6", "#DB2777"];
			const confettiCount = 200;
			const gravity = 0.5;
			const terminalVelocity = 5;
			const drag = 0.075;
			const particles: Particle[] = [];

			// Particle class
			class Particle {
				x: number;
				y: number;
				color: string;
				velocity: { x: number; y: number };
				rotation: number;
				rotationSpeed: number;
				width: number;
				height: number;
				thickness: number;
				sides: number;
				decay: number;

				constructor() {
					this.x = Math.random() * canvas.width;
					this.y = Math.random() * canvas.height - canvas.height;
					this.color = colors[Math.floor(Math.random() * colors.length)];
					this.velocity = {
						x: (Math.random() - 0.5) * 8,
						y: Math.random() * 3 + 2,
					};
					this.rotation = Math.random() * 2 * Math.PI;
					this.rotationSpeed = Math.random() * 0.2 - 0.1;
					this.width = Math.random() * 10 + 5;
					this.height = Math.random() * 10 + 5;
					this.thickness = Math.random() * 2 + 1;
					this.sides = Math.floor(Math.random() * 4) + 3;
					this.decay = Math.random() * 0.03 + 0.015;
				}

				update() {
					this.velocity.y += gravity;
					this.velocity.y = Math.min(this.velocity.y, terminalVelocity);
					this.velocity.x *= 1 - drag;
					this.x += this.velocity.x;
					this.y += this.velocity.y;
					this.rotation += this.rotationSpeed;
					return (
						this.y < canvas.height + 100 && this.width > 0 && this.height > 0
					);
				}

				draw() {
					if (!ctx) return;
					ctx.save();
					ctx.translate(this.x, this.y);
					ctx.rotate(this.rotation);
					ctx.fillStyle = this.color;

					if (this.sides === 3) {
						// Triangle
						ctx.beginPath();
						ctx.moveTo(0, -this.height / 2);
						ctx.lineTo(this.width / 2, this.height / 2);
						ctx.lineTo(-this.width / 2, this.height / 2);
						ctx.closePath();
						ctx.fill();
					} else if (this.sides === 4) {
						// Rectangle
						ctx.fillRect(
							-this.width / 2,
							-this.height / 2,
							this.width,
							this.height
						);
					} else {
						// Circle
						ctx.beginPath();
						ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
						ctx.fill();
					}

					ctx.restore();
				}
			}

			for (let i = 0; i < confettiCount; i++) {
				particles.push(new Particle());
			}

			// Animation loop
			let animationId: number;
			const animate = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				if (particles.length === 0) {
					cancelAnimationFrame(animationId);
					document.body.removeChild(canvas);
					return;
				}

				for (let i = particles.length - 1; i >= 0; i--) {
					const particle = particles[i];
					if (particle.update()) {
						particle.draw();
					} else {
						particles.splice(i, 1);
					}
				}

				animationId = requestAnimationFrame(animate);
			};

			animate();

			setTimeout(() => {
				cancelAnimationFrame(animationId);
				if (document.body.contains(canvas)) {
					document.body.removeChild(canvas);
				}
				setShowConfetti(false);
			}, 6000);
		}
	}, [showConfetti]);

	// Step transition effect
	useEffect(() => {
		if (previousStep !== currentStep) {
			setIsAnimating(true);
			const timer = setTimeout(() => {
				setIsAnimating(false);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [currentStep, previousStep]);

	const toggleDarkMode = () => {
		setDarkMode((prevMode) => !prevMode);
	};

	const toggleBookingsList = () => {
		setShowBookingsList(!showBookingsList);
	};

	const startBookingFromFeatured = (featuredId: number) => {
		const serviceMap: Record<number, number> = {
			1: 5,
			2: 4,
		};

		// Select the corresponding service
		const serviceId = serviceMap[featuredId];
		const selectedService = spaServices.find(
			(service) => service.id === serviceId
		);

		if (selectedService) {
			setPreviousStep(currentStep);
			setBooking({ ...booking, service: selectedService });
			setCurrentStep(2);
			if (bookingRef.current) {
				bookingRef.current.scrollIntoView({ behavior: "smooth" });
			}

			const event = window.event as MouseEvent;
			if (event && event.currentTarget) {
				const button = event.currentTarget as HTMLElement;
				const circle = document.createElement("span");
				const diameter = Math.max(button.clientWidth, button.clientHeight);
				const radius = diameter / 2;

				circle.style.width = circle.style.height = `${diameter}px`;
				circle.style.left = `${
					event.clientX - button.getBoundingClientRect().left - radius
				}px`;
				circle.style.top = `${
					event.clientY - button.getBoundingClientRect().top - radius
				}px`;
				circle.classList.add("ripple");

				const ripple = button.getElementsByClassName("ripple")[0];
				if (ripple) {
					ripple.remove();
				}

				button.appendChild(circle);

				setTimeout(() => {
					if (circle.parentElement === button) {
						button.removeChild(circle);
					}
				}, 600);
			}
		}
	};

	const selectService = (service: SpaService) => {
		setPreviousStep(currentStep);
		setBooking({ ...booking, service });
		setCurrentStep(2);
	};

	const selectDate = (date: Date) => {
		setPreviousStep(currentStep);
		setBooking({ ...booking, date });
		setCurrentStep(3);
	};

	const selectTime = (time: AppointmentTime) => {
		setPreviousStep(currentStep);
		setBooking({ ...booking, time });
		setCurrentStep(4);
	};

	const handleUserInfoChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setBooking({
			...booking,
			userInfo: {
				...booking.userInfo,
				[name]: value,
			},
		});
	};

	const submitBooking = (e: React.FormEvent) => {
		e.preventDefault();
		setPreviousStep(currentStep);
		setCurrentStep(5);
	};

	const resetBooking = () => {
		setPreviousStep(currentStep);
		setBooking({
			service: null,
			date: null,
			time: null,
			userInfo: {
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				specialRequests: "",
			},
		});
		setCurrentStep(1);
	};

	// Add a new function to send the final booking
	const finalizeBooking = () => {
		if (booking.service && booking.date && booking.time) {
			const newCompletedBooking: CompletedBooking = {
				id: Math.random().toString(36).substring(2, 9),
				service: booking.service,
				date: booking.date,
				time: booking.time,
				userInfo: booking.userInfo,
				createdAt: new Date(),
			};

			setCompletedBookings((prev) => [...prev, newCompletedBooking]);
		}

		setPreviousStep(currentStep);
		setCurrentStep(6);
		setShowConfetti(true);
	};

	const editBookingStep = (step: number) => {
		setPreviousStep(currentStep);
		setCurrentStep(step);
	};

	const formatDate = (date: Date | null): string => {
		if (!date) return "";
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Calendar Helper Functions
	const getDaysInMonth = (month: number, year: number): number => {
		return new Date(year, month + 1, 0).getDate();
	};

	const getFirstDayOfMonth = (month: number, year: number): number => {
		return new Date(year, month, 1).getDay();
	};

	const generateCalendarDays = (): (Date | null)[] => {
		const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
		const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
		const calendarDays: (Date | null)[] = [];

		for (let i = 0; i < firstDay; i++) {
			calendarDays.push(null);
		}

		for (let i = 1; i <= daysInMonth; i++) {
			calendarDays.push(new Date(selectedYear, selectedMonth, i));
		}

		return calendarDays;
	};

	const changeMonth = (increment: number) => {
		let newMonth = selectedMonth + increment;
		let newYear = selectedYear;

		if (newMonth > 11) {
			newMonth = 0;
			newYear += 1;
		} else if (newMonth < 0) {
			newMonth = 11;
			newYear -= 1;
		}

		setSelectedMonth(newMonth);
		setSelectedYear(newYear);
	};

	const deleteBooking = (bookingId: string) => {
		if (confirm("Are you sure you want to delete this reservation?")) {
			setCompletedBookings((prevBookings) =>
				prevBookings.filter((booking) => booking.id !== bookingId)
			);
		}
	};

	const openEditModal = (booking: CompletedBooking) => {
		setEditingBooking({ ...booking });
		setIsEditModalOpen(true);
	};

	const saveEditedBooking = () => {
		if (editingBooking) {
			setCompletedBookings((prevBookings) =>
				prevBookings.map((booking) =>
					booking.id === editingBooking.id ? editingBooking : booking
				)
			);
			setIsEditModalOpen(false);
			setEditingBooking(null);
		}
	};

	const handleEditChange = (
		field: string,
		value: string | Date | SpaService | AppointmentTime
	) => {
		if (editingBooking) {
			if (field.startsWith("userInfo.")) {
				const userInfoField = field.split(".")[1];
				setEditingBooking({
					...editingBooking,
					userInfo: {
						...editingBooking.userInfo,
						[userInfoField]: value,
					},
				});
			} else {
				setEditingBooking({
					...editingBooking,
					[field]: value,
				});
			}
		}
	};

	return (
		<div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Tranquil Touch Spa</title>

			{/* Header */}
			<header
				ref={headerRef}
				className="bg-gradient-to-r from-teal-800 to-teal-600 dark:from-teal-900 dark:to-teal-700 text-black dark:text-white py-4 md:py-8 text-center relative overflow-hidden"
			>
				<div className="absolute inset-0 overflow-hidden">
					<div className="bubbles">
						{[...Array(10)].map((_, i) => (
							<div
								key={i}
								className="bubble"
								style={
									{
										"--size": `${Math.random() * 4 + 2}rem`,
										"--left": `${Math.random() * 100}%`,
										"--time": `${Math.random() * 10 + 5}s`,
										"--delay": `${Math.random() * 5}s`,
									} as React.CSSProperties
								}
							></div>
						))}
					</div>
				</div>
				<div className="container mx-auto px-4 md:px-6 relative z-10">
					<div className="flex justify-end mb-2 md:mb-0 md:absolute md:right-6 md:top-6">
						<div className="flex space-x-3">
							<button
								className="flex cursor-pointer items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-400 shadow-md hover:shadow-lg transition-all"
								onClick={toggleBookingsList}
								aria-label="View Bookings History"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 md:h-6 md:w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							</button>
							<button
								className="flex cursor-pointer items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-400 shadow-md hover:shadow-lg transition-all"
								onClick={toggleDarkMode}
								aria-label={
									darkMode ? "Switch to light mode" : "Switch to dark mode"
								}
							>
								{darkMode ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 md:h-6 md:w-6 animate-spin-slow"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 md:h-6 md:w-6 animate-pulse"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-wider text-shadow animate-float text-white dark:text-gray-300">
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							T
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							r
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							a
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							n
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							q
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							u
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							i
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							l
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							{" "}
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							T
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							o
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							u
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							c
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							h
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							{" "}
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							S
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							p
						</span>
						<span className="inline-block transform hover:scale-105 transition-transform duration-300">
							a
						</span>
					</h1>
					<p className="text-base md:text-lg text-white dark:text-gray-300 opacity-90 animate-fade-in-up">
						Rejuvenate your body and mind with our premium spa services
					</p>
				</div>
			</header>

			<main>
				<section>
					<div className="relative bg-cover bg-center bg-[url('https://img.freepik.com/photos-premium/pierres-feuilles-zen-gouttes-eau-fond-spa-accessoires-spa-fond-sombre-vue-dessus-espace-libre-pour-votre-texte_187166-19289.jpg')] text-white py-32 px-8 text-center">
						<div className="absolute inset-0 bg-black/30"></div>
						<div className="relative w-full max-w-7xl mx-auto px-4">
							<h2 className="text-5xl mb-4 animate-fade-in-up">
								Discover Our World-Class Spa Experiences
							</h2>
							<p className="text-2xl max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
								Where luxury meets wellness for complete transformation
							</p>
						</div>
					</div>

					<div
						ref={servicesRef}
						className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-6xl mx-auto mt-8 relative z-10 mb-20"
					>
						{featuredServices.map((service, index) => (
							<div
								key={service.id}
								className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-500 animate-on-scroll opacity-0 translate-y-10 border border-transparent hover:border-teal-400 dark:hover:border-teal-500"
								style={{ animationDelay: `${index * 200}ms` }}
							>
								<div className="relative">
									<div
										className="h-64 bg-cover bg-center transform transition-transform duration-700 group-hover:scale-[1.05]"
										style={{ backgroundImage: `url(${service.image})` }}
									></div>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
									<div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
										<span className="bg-pink-600 text-white text-xs uppercase font-bold py-1 px-2 rounded-full">
											Featured
										</span>
									</div>
								</div>
								<div className="p-8">
									<h3 className="text-2xl mb-4 text-teal-700 dark:text-teal-400 font-bold relative group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
										{service.title}
										<span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-pink-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
									</h3>
									<p className="mb-4 dark:text-gray-300 text-gray-600">
										{service.description}
									</p>
									<ul className="my-6 pl-6 space-y-3">
										{service.benefits.map((benefit, index) => (
											<li
												key={index}
												className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[0.35rem] before:w-3 before:h-3 before:bg-pink-500 before:rounded-full before:opacity-80 transform transition-all duration-300 group-hover:translate-x-2 text-gray-700 dark:text-gray-300"
											>
												{benefit}
											</li>
										))}
									</ul>
									<button
										onClick={() => startBookingFromFeatured(service.id)}
										className="bg-gradient-to-r  cursor-pointer from-teal-800 to-teal-700 hover:from-pink-700 hover:to-pink-600 dark:from-teal-600 dark:to-teal-500 dark:hover:from-pink-500 dark:hover:to-pink-400 text-black dark:text-white font-medium py-3 px-6 rounded-lg transition-all duration-500 transform hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden group w-full flex justify-center items-center shadow"
									>
										<span className="relative z-10 text-white flex items-center">
											<span className="">Book Now</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14 5l7 7m0 0l-7 7m7-7H3"
												/>
											</svg>
										</span>
									</button>
								</div>
							</div>
						))}
					</div>
				</section>

				<div
					ref={bookingRef}
					className="bg-gray-100 dark:bg-gray-800 py-4 md:py-6 mb-8 sticky top-0 z-30 shadow-md"
				>
					<div className="w-full max-w-7xl mx-auto px-4 md:px-6">
						<div className="flex justify-between items-center max-w-3xl mx-auto">
							{[
								"Select Service",
								"Choose Date",
								"Choose Time",
								"Your Details",
								"Confirmation",
							].map((step, index) => (
								<div
									key={index}
									className={`flex flex-col items-center w-full relative ${
										index + 1 < currentStep && index < 4
											? 'after:content-[""] after:absolute after:top-3 md:after:top-4 after:right-[-50%] after:w-full after:h-0.5 after:bg-teal-700 dark:after:bg-teal-500 after:z-10 after:transition-all after:duration-500 after:scale-x-100'
											: index < 4
											? 'after:content-[""] after:absolute after:top-3 md:after:top-4 after:right-[-50%] after:w-full after:h-0.5 after:bg-gray-300 dark:after:bg-gray-600 after:z-10'
											: ""
									}`}
								>
									<div
										className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold mb-1 md:mb-2 z-20 transition-all duration-500 ${
											index + 1 === currentStep
												? "bg-teal-700 dark:bg-teal-600 text-white border-2 border-teal-700 dark:border-teal-600 animate-pulse-subtle"
												: index + 1 < currentStep
												? "bg-teal-700 dark:bg-teal-600 text-white border-2 border-teal-700 dark:border-teal-600"
												: "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 dark:text-gray-300"
										}`}
									>
										{index + 1 < currentStep ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3 md:h-4 md:w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={3}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										) : (
											index + 1
										)}
									</div>
									<div
										className={`text-xs md:text-sm text-center transition-all duration-300 hidden md:block ${
											index + 1 === currentStep
												? "text-teal-700 dark:text-teal-400 font-bold scale-110"
												: "text-gray-500 dark:text-gray-400"
										}`}
									>
										{step}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div
					className={`transition-all duration-500 ${
						isAnimating ? "opacity-0 transform translate-y-10" : "opacity-100"
					}`}
				>
					{currentStep === 1 && (
						<section className="py-16">
							<div className="w-full max-w-7xl mx-auto px-6">
								<h2 className="text-3xl text-center mb-4 dark:text-white animate-fade-in-up">
									Select a Spa Service
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
									Choose from our range of rejuvenating treatments
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{spaServices.map((service, index) => (
										<div
											key={service.id}
											className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer animate-on-scroll opacity-0 translate-y-10 border border-transparent hover:border-teal-400 dark:hover:border-teal-500 group transform "
											style={{ animationDelay: `${index * 100}ms` }}
											onClick={() => selectService(service)}
										>
											<div className="p-1.5">
												<div className="h-2.5 w-2.5 rounded-full bg-pink-500 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2"></div>
											</div>
											<div className="px-8 py-6">
												<div className="flex justify-between items-center mb-3">
													<h3 className="text-xl font-bold text-teal-700 dark:text-teal-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
														{service.name}
													</h3>
													<span className="text-sm font-bold text-white rounded-full px-3 py-1 bg-gradient-to-r from-pink-600 to-pink-500">
														${service.price}
													</span>
												</div>
												<div className="flex items-center mb-4 text-sm">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-2"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													<span className="text-gray-600 dark:text-gray-400 font-medium">
														{service.duration}
													</span>
												</div>
												<p className="text-gray-600 dark:text-gray-400 mb-6 text-base border-l-2 border-teal-400 pl-3 py-1">
													{service.description}
												</p>
												<div className="relative overflow-hidden rounded-lg mt-4 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors duration-300">
													<div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600 group-hover:from-pink-500 group-hover:to-pink-700 dark:group-hover:from-pink-400 dark:group-hover:to-pink-600 transition-colors duration-500"></div>
													<button className="cursor-pointer w-full py-3 text-center font-medium text-teal-600 dark:text-teal-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
														<span className="relative group-hover:pl-2 transition-all duration-300 flex items-center justify-center">
															Select
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-0 w-0 group-hover:h-5 group-hover:w-5 ml-0 group-hover:ml-2 transition-all duration-300"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M9 5l7 7-7 7"
																/>
															</svg>
														</span>
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</section>
					)}

					{currentStep === 2 && (
						<section className="py-16">
							<div className="w-full max-w-7xl mx-auto px-6">
								<h2 className="text-3xl text-center mb-4 dark:text-white animate-fade-in-up">
									Choose a Date
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-10 animate-fade-in-up animation-delay-300">
									{booking.service
										? `Select a date for your ${booking.service.name} (${booking.service.duration})`
										: "Please select a date for your appointment"}
								</p>

								<div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-fade-in-up animation-delay-500 transform hover:scale-[1.01] transition-all duration-500">
									<div className="flex justify-between items-center p-6 bg-gradient-to-r from-teal-700 to-teal-500 dark:from-teal-800 dark:to-teal-600 text-white">
										<button
											className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg"
											onClick={() => changeMonth(-1)}
											aria-label="Previous month"
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
													d="M15 19l-7-7 7-7"
												/>
											</svg>
										</button>
										<h3 className="text-xl font-bold tracking-wide">
											<span className="block text-2xl">
												{new Date(
													selectedYear,
													selectedMonth
												).toLocaleDateString("en-US", { month: "long" })}
											</span>
											<span className="block text-sm font-normal text-center text-teal-100">
												{selectedYear}
											</span>
										</h3>
										<button
											className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg"
											onClick={() => changeMonth(1)}
											aria-label="Next month"
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
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</button>
									</div>

									<div className="grid grid-cols-7 gap-px p-4 pb-2">
										{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
											<div
												key={day}
												className="text-center font-medium text-xs text-gray-500 dark:text-gray-400 mb-2"
											>
												{day}
											</div>
										))}
									</div>

									<div className="grid grid-cols-7 gap-2 p-4 pt-0">
										{generateCalendarDays().map((date, index) => {
											const today = new Date();
											today.setHours(0, 0, 0, 0);
											const isPast = date && date < today;
											const isToday =
												date && date.getTime() === today.getTime();

											return (
												<div
													key={index}
													className={`relative flex items-center justify-center h-10 w-full rounded-full transition-all duration-300 ${
														!date
															? "invisible"
															: isPast
															? "text-gray-400 dark:text-gray-600 cursor-default"
															: isToday
															? "bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-400 font-bold hover:bg-teal-600 dark:hover:bg-teal-700 hover:text-white cursor-pointer transform hover:scale-110 hover:shadow-lg"
															: "hover:bg-teal-600 dark:hover:bg-teal-700 hover:text-white cursor-pointer transform hover:scale-110 hover:shadow-md"
													}`}
													onClick={() => date && !isPast && selectDate(date)}
												>
													{date && (
														<>
															{isToday && (
																<span className="absolute inset-0 rounded-full border-2 border-teal-500 dark:border-teal-400 animate-pulse-subtle"></span>
															)}
															<span
																className={`text-sm font-medium ${
																	isToday ? "z-10" : ""
																}`}
															>
																{date.getDate()}
															</span>
														</>
													)}
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</section>
					)}

					{currentStep === 3 && (
						<section className="py-16">
							<div className="w-full max-w-7xl mx-auto px-6">
								<h2 className="text-3xl text-center mb-4 dark:text-white animate-fade-in-up">
									Choose a Time
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-10 animate-fade-in-up animation-delay-300">
									{booking.date
										? `Select an appointment time for ${booking.date.toLocaleDateString(
												"en-US",
												{ weekday: "long", month: "long", day: "numeric" }
										  )}`
										: "Please select a time for your appointment"}
								</p>

								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-8">
									{timeSlots.map((slot, index) => (
										<div
											key={slot.id}
											className="relative group animate-fade-in-up cursor-pointer h-20"
											style={{ animationDelay: `${index * 100}ms` }}
											onClick={() => selectTime(slot)}
										>
											<div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-400 dark:from-teal-600 dark:to-teal-500 rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg opacity-80 group-hover:opacity-100"></div>
											<div className="absolute inset-0 bg-white dark:bg-gray-800 m-0.5 rounded-md z-10 flex flex-col items-center justify-center p-2 transition-all transform group-hover:m-1 group-hover:rounded-lg">
												<div className="flex items-center justify-center mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4 text-teal-600 dark:text-teal-400"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
												</div>
												<span className="text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors duration-300">
													{slot.time}
												</span>
												<div className="w-10 h-0.5 bg-teal-500 rounded mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
											</div>
										</div>
									))}
								</div>

								{booking.service && (
									<div className="max-w-xl mx-auto mt-14 p-6 bg-gradient-to-br dark:from-gray-800 dark:to-gray-750 rounded-xl transform transition-all duration-500 hover:shadow-xl animate-fade-in-up animation-delay-700">
										<div className="flex items-start">
											<div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg mr-4">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6 text-teal-600 dark:text-teal-400"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
													/>
												</svg>
											</div>
											<div className="flex-1">
												<h4 className="text-lg font-bold mb-1 text-gray-800 dark:text-white flex items-center">
													{booking.service.name}
													<span className="ml-2 text-sm font-normal text-pink-600 dark:text-pink-400">
														${booking.service.price}
													</span>
												</h4>
												<div className="flex items-center mb-1 text-sm text-gray-600 dark:text-gray-400">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4 mr-1 text-teal-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													<span>{booking.service.duration}</span>
												</div>
												<p className="text-sm text-gray-600 dark:text-gray-400 mt-2 border-l-2 border-teal-400 pl-2">
													{booking.service.description}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</section>
					)}

					{currentStep === 4 && (
						<section className="py-16">
							<div className="w-full max-w-7xl mx-auto px-6">
								<h2 className="text-3xl text-center mb-4 dark:text-white animate-fade-in-up">
									Your Information
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-10 animate-fade-in-up animation-delay-300">
									Please provide your details to complete the booking
								</p>

								<form
									onSubmit={submitBooking}
									className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl animate-fade-in-up animation-delay-500 relative overflow-hidden"
								>
									<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-pink-500"></div>

									<div className="flex flex-col md:flex-row gap-8 mb-8">
										<div className="flex flex-col flex-1 group relative">
											<label
												htmlFor="firstName"
												className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400"
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
												<span className="transition-all duration-300 group-focus-within:text-teal-700 dark:group-focus-within:text-teal-400">
													First Name *
												</span>
											</label>
											<div className="relative">
												<input
													type="text"
													id="firstName"
													name="firstName"
													value={booking.userInfo.firstName}
													onChange={handleUserInfoChange}
													required
													placeholder="Enter your first name"
													className="p-3 pl-4 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-opacity-20 text-base transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
												/>
												<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-300 group-focus-within:w-full"></div>
											</div>
										</div>

										<div className="flex flex-col flex-1 group relative">
											<label
												htmlFor="lastName"
												className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400"
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
												<span className="transition-all duration-300 group-focus-within:text-teal-700 dark:group-focus-within:text-teal-400">
													Last Name *
												</span>
											</label>
											<div className="relative">
												<input
													type="text"
													id="lastName"
													name="lastName"
													value={booking.userInfo.lastName}
													onChange={handleUserInfoChange}
													required
													placeholder="Enter your last name"
													className="p-3 pl-4 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-opacity-20 text-base transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
												/>
												<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-300 group-focus-within:w-full"></div>
											</div>
										</div>
									</div>

									<div className="flex flex-col md:flex-row gap-8 mb-8">
										<div className="flex flex-col flex-1 group relative">
											<label
												htmlFor="email"
												className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
												<span className="transition-all duration-300 group-focus-within:text-teal-700 dark:group-focus-within:text-teal-400">
													Email *
												</span>
											</label>
											<div className="relative">
												<input
													type="email"
													id="email"
													name="email"
													value={booking.userInfo.email}
													onChange={handleUserInfoChange}
													required
													placeholder="example@email.com"
													className="p-3 pl-4 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-opacity-20 text-base transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
												/>
												<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-300 group-focus-within:w-full"></div>
											</div>
										</div>

										<div className="flex flex-col flex-1 group relative">
											<label
												htmlFor="phone"
												className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400"
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
												<span className="transition-all duration-300 group-focus-within:text-teal-700 dark:group-focus-within:text-teal-400">
													Phone *
												</span>
											</label>
											<div className="relative">
												<input
													type="tel"
													id="phone"
													name="phone"
													value={booking.userInfo.phone}
													onChange={handleUserInfoChange}
													required
													placeholder="(123) 456-7890"
													className="p-3 pl-4 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-opacity-20 text-base transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
												/>
												<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-300 group-focus-within:w-full"></div>
											</div>
										</div>
									</div>

									<div className="group relative mb-10">
										<label
											htmlFor="specialRequests"
											className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
												/>
											</svg>
											<span className="transition-all duration-300 group-focus-within:text-teal-700 dark:group-focus-within:text-teal-400">
												Special Requests
											</span>
										</label>
										<div className="relative">
											<textarea
												id="specialRequests"
												name="specialRequests"
												value={booking.userInfo.specialRequests}
												onChange={handleUserInfoChange}
												placeholder="Additional information we should know..."
												rows={4}
												className="p-4 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-opacity-20 text-base transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none"
											/>
											<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-300 group-focus-within:w-full"></div>
										</div>
									</div>

									<div className="text-gray-600 dark:text-gray-400 text-sm mb-8 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border-l-4 border-teal-500">
										<p className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400"
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
											Upon completing this booking, you will receive a
											confirmation email with your appointment details.
										</p>
									</div>

									<div className="flex justify-end">
										<button
											type="submit"
											className="text-white bg-gradient-to-r from-teal-800 to-teal-700 hover:from-teal-900 hover:to-teal-800 dark:from-teal-500 dark:to-teal-400 dark:hover:from-teal-600 dark:hover:to-teal-500  dark:text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center shadow"
										>
											<span className="drop-shadow-md ">Complete Booking</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 ml-2 drop-shadow-md"
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
										</button>
									</div>
								</form>
							</div>
						</section>
					)}

					{currentStep === 5 && (
						<section className="py-16">
							<div className="w-full max-w-7xl mx-auto px-6">
								<div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-fade-in-up">
									<div className="bg-gradient-to-r from-teal-600 to-teal-500 dark:from-teal-700 dark:to-teal-600 text-white p-8 text-center relative">
										<h2 className="text-3xl font-bold mb-0 text-white">
											Confirm Your Booking
										</h2>
										<p className="mt-2 text-teal-100">
											Please review your booking details before confirming
										</p>
									</div>

									<div className="p-8 border-b border-gray-200 dark:border-gray-700 animate-fade-in-up animation-delay-300">
										<div className="flex items-center justify-between mb-6">
											<h3 className="text-xl font-semibold dark:text-white">
												Booking Details
											</h3>
											<span className="text-sm bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-3 py-1 rounded-full">
												Total: ${booking.service?.price}
											</span>
										</div>

										<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg relative group">
											<div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													onClick={() => editBookingStep(1)}
													className="bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300 p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors"
													aria-label="Edit service"
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
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
												</button>
											</div>
											<h4 className="text-lg font-medium mb-2 dark:text-white flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
												Selected Service
											</h4>
											<div className="ml-7">
												<p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
													{booking.service?.name}
												</p>
												<p className="text-gray-600 dark:text-gray-300">
													{booking.service?.duration}
												</p>
												<p className="text-gray-600 dark:text-gray-300 mt-1">
													{booking.service?.description}
												</p>
											</div>
										</div>

										<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg relative group">
											<div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													onClick={() => editBookingStep(2)}
													className="bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300 p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors"
													aria-label="Edit date"
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
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
												</button>
											</div>
											<h4 className="text-lg font-medium mb-2 dark:text-white flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												Date & Time
											</h4>
											<div className="ml-7">
												<p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
													{formatDate(booking.date)}
												</p>
												<p className="text-gray-600 dark:text-gray-300">
													Time: {booking.time?.time}
												</p>
											</div>
										</div>

										<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg relative group">
											<div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													onClick={() => editBookingStep(4)}
													className="bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300 p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors"
													aria-label="Edit customer information"
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
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
												</button>
											</div>
											<h4 className="text-lg font-medium mb-2 dark:text-white flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400"
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
												Customer Information
											</h4>
											<div className="ml-7">
												<p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
													{booking.userInfo.firstName}{" "}
													{booking.userInfo.lastName}
												</p>
												<p className="text-gray-600 dark:text-gray-300">
													{booking.userInfo.email}
												</p>
												<p className="text-gray-600 dark:text-gray-300">
													{booking.userInfo.phone}
												</p>
												{booking.userInfo.specialRequests && (
													<div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
														<p className="text-sm text-gray-500 dark:text-gray-400">
															Special Requests:
														</p>
														<p className="text-gray-600 dark:text-gray-300">
															{booking.userInfo.specialRequests}
														</p>
													</div>
												)}
											</div>
										</div>

										<div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg border-l-4 border-teal-500 mt-8">
											<p className="text-gray-700 dark:text-gray-100">
												<span className="font-semibold">Please confirm:</span>{" "}
												Check all details above before confirming your booking.
												You can edit any section by clicking the edit button
												that appears when you hover over a section.
											</p>
										</div>
									</div>

									<div className="p-8 text-center animate-fade-in-up animation-delay-700 flex flex-col sm:flex-row justify-center items-center gap-4">
										<button
											onClick={() => editBookingStep(4)}
											className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full sm:w-auto"
										>
											Back to Edit
										</button>
										<button
											onClick={finalizeBooking}
											className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-md transition-all duration-300 w-full sm:w-auto"
										>
											Confirm Booking
										</button>
									</div>
								</div>
							</div>
						</section>
					)}

					{currentStep === 6 && (
						<section className="py-16">
							<div className="w-full max-w-7xl mx-auto px-6">
								<div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-fade-in-up">
									<div className="bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white p-8 text-center relative">
										<h2 className="text-3xl font-bold mb-0 animate-bounce-subtle text-white">
											Booking Confirmed!
										</h2>
									</div>

									<div className="p-8 border-b border-gray-200 dark:border-gray-700 animate-fade-in-up animation-delay-300">
										<h3 className="text-xl font-semibold mb-4 dark:text-white">
											Appointment Details
										</h3>

										<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
											<span className="font-bold min-w-[120px] dark:text-gray-300">
												Service:
											</span>
											<span className="dark:text-gray-300">
												{booking.service?.name}
											</span>
										</div>

										<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
											<span className="font-bold min-w-[120px] dark:text-gray-300">
												Date:
											</span>
											<span className="dark:text-gray-300">
												{formatDate(booking.date)}
											</span>
										</div>

										<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
											<span className="font-bold min-w-[120px] dark:text-gray-300">
												Time:
											</span>
											<span className="dark:text-gray-300">
												{booking.time?.time}
											</span>
										</div>

										<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
											<span className="font-bold min-w-[120px] dark:text-gray-300">
												Duration:
											</span>
											<span className="dark:text-gray-300">
												{booking.service?.duration}
											</span>
										</div>

										<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
											<span className="font-bold min-w-[120px] dark:text-gray-300">
												Price:
											</span>
											<span className="dark:text-gray-300">
												${booking.service?.price}
											</span>
										</div>
									</div>

									<div className="p-8 border-b border-gray-200 dark:border-gray-700 animate-fade-in-up animation-delay-500">
										<h3 className="text-xl font-semibold mb-4 dark:text-white">
											Customer Information
										</h3>

										<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
											<span className="font-bold min-w-[120px] dark:text-gray-300">
												Name:
											</span>
											<span className="dark:text-gray-300">{`${booking.userInfo.firstName} ${booking.userInfo.lastName}`}</span>
										</div>

										<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
											<span className="font-bold min-w-[120px] dark:text-gray-300">
												Email:
											</span>
											<span className="dark:text-gray-300">
												{booking.userInfo.email}
											</span>
										</div>

										<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
											<span className="font-bold min-w-[120px] dark:text-gray-300">
												Phone:
											</span>
											<span className="dark:text-gray-300">
												{booking.userInfo.phone}
											</span>
										</div>

										{booking.userInfo.specialRequests && (
											<div className="flex mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors">
												<span className="font-bold min-w-[120px] dark:text-gray-300">
													Special Requests:
												</span>
												<span className="dark:text-gray-300">
													{booking.userInfo.specialRequests}
												</span>
											</div>
										)}
									</div>

									<div className="p-8 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 animate-fade-in-up animation-delay-700">
										<p className="mb-4 dark:text-gray-300">
											Thank you for booking with Tranquil Touch Spa. We have
											sent a confirmation email to{" "}
											<span className="text-teal-700 dark:text-teal-400 font-medium">
												{booking.userInfo.email}
											</span>{" "}
											with all the details above.
										</p>
										<p className="dark:text-gray-300">
											If you need to cancel or reschedule, please contact us at
											least 24 hours before your appointment.
										</p>
									</div>

									<div className="p-8 text-center animate-fade-in-up animation-delay-1000">
										<button
											className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-300"
											onClick={resetBooking}
										>
											Make Another Booking
										</button>
									</div>
								</div>
							</div>
						</section>
					)}
				</div>
			</main>

			{showBookingsList && (
				<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-fade-in-up">
						<div className="bg-gradient-to-r from-teal-700 to-teal-600 dark:from-teal-800 dark:to-teal-700 p-4 text-white flex justify-between items-center">
							<h2 className="text-2xl font-bold">Reservation History</h2>
						</div>

						<div className="overflow-y-auto flex-grow p-6">
							{completedBookings.length === 0 ? (
								<div className="text-center py-12">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										/>
									</svg>
									<p className="text-lg text-gray-600 dark:text-gray-400">
										No reservations have been made yet.
									</p>
									<p className="text-gray-500 dark:text-gray-500 mt-2">
										Your booking history will appear here after you make a
										reservation.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 gap-6">
									{completedBookings.map((booking, index) => (
										<div
											key={booking.id}
											className="bg-gray-600 dark:bg-gray-900 rounded-xl overflow-hidden border-l-4 border-teal-400 shadow-lg animate-fade-in-up relative group"
											style={{ animationDelay: `${index * 150}ms` }}
										>
											<div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
												{/* Service info */}
												<div className="flex flex-col">
													<div className="flex items-center mb-4">
														<div className="w-12 h-12 flex-shrink-0 rounded-full bg-teal-800/30 flex items-center justify-center mr-4">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-6 w-6 text-teal-400"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
																/>
															</svg>
														</div>
														<div>
															<h3 className="text-xl font-bold text-teal-400 group-hover:text-pink-400 transition-colors duration-300">
																{booking.service.name}
															</h3>
															<span className="inline-block mt-2 text-sm font-bold text-white rounded-full px-3 py-1 bg-pink-600">
																${booking.service.price}
															</span>
														</div>
													</div>
												</div>

												<div className="flex flex-col">
													<div className="flex items-center mb-3">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5 text-pink-400 mr-2"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
															/>
														</svg>
														<p className="text-sm text-gray-300 font-medium">
															Date and Time
														</p>
													</div>
													<p className="text-gray-100 font-medium text-lg ml-7">
														{formatDate(booking.date)}
													</p>
													<div className="flex items-center mt-3 ml-7">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 text-teal-400 mr-2 flex-shrink-0"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														<p className="text-gray-300 text-lg">
															{booking.time.time}{" "}
															<span className="text-sm">
																({booking.service.duration})
															</span>
														</p>
													</div>
												</div>

												<div className="flex flex-col">
													<div className="flex items-center mb-3">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5 text-pink-400 mr-2"
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
														<p className="text-sm text-gray-300 font-medium">
															Client
														</p>
													</div>
													<p className="text-gray-100 font-medium text-lg ml-7 mb-2">
														{booking.userInfo.firstName}{" "}
														{booking.userInfo.lastName}
													</p>
													<div className="ml-7 flex items-center mb-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 text-teal-400 mr-2 flex-shrink-0"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
															/>
														</svg>
														<span
															className="text-gray-300 text-sm overflow-hidden text-ellipsis"
															style={{ maxWidth: "200px" }}
														>
															{booking.userInfo.email}
														</span>
													</div>
													<div className="ml-7 flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 text-teal-400 mr-2 flex-shrink-0"
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
														<span className="text-gray-300 text-sm">
															{booking.userInfo.phone}
														</span>
													</div>
												</div>

												<div className="flex flex-col items-end justify-between">
													<div className="text-right mb-4">
														<p className="text-xs text-gray-400">Booked on</p>
														<p className="text-gray-300 font-medium">
															{booking.createdAt.toLocaleDateString()}
														</p>
														<p className="text-gray-300">
															{booking.createdAt.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}
														</p>
													</div>
													<div className="flex flex-col space-y-2">
														<button
															onClick={() => openEditModal(booking)}
															className="px-6 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-sm transition-colors flex items-center justify-center font-medium"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4 mr-2"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
																/>
															</svg>
															Edit
														</button>
														<button
															onClick={() => deleteBooking(booking.id)}
															className="px-6 py-2 bg-red-800/80 hover:bg-red-700 text-white rounded-lg text-sm transition-colors flex items-center justify-center font-medium"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4 mr-2"
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
															Delete
														</button>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="bg-gray-100 dark:bg-gray-700 p-4 border-t border-gray-300 dark:border-gray-600 flex justify-between">
							<div>
								<span className="text-gray-600 dark:text-gray-300">
									Total Reservations:{" "}
								</span>
								<span className="font-bold text-teal-700 dark:text-teal-400">
									{completedBookings.length}
								</span>
							</div>
							<button
								onClick={toggleBookingsList}
								className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-4 py-2 rounded transition-colors"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{isEditModalOpen && editingBooking && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
						<div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
							<h3 className="text-xl font-bold dark:text-white">
								Edit Booking
							</h3>
							<button
								onClick={() => setIsEditModalOpen(false)}
								className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="overflow-y-auto flex-grow p-6">
							<div className="mb-6">
								<p className="font-medium mb-2 dark:text-white">Service:</p>
								<select
									value={editingBooking.service.id}
									onChange={(e) => {
										const serviceId = Number.parseInt(e.target.value);
										const selectedService = spaServices.find(
											(service) => service.id === serviceId
										);
										if (selectedService) {
											handleEditChange("service", selectedService);
										}
									}}
									className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
								>
									{spaServices.map((service) => (
										<option key={service.id} value={service.id}>
											{service.name} - {service.duration} - ${service.price}
										</option>
									))}
								</select>
							</div>

							<div className="mb-6">
								<p className="font-medium mb-2 dark:text-white">Date & Time:</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
											Date
										</label>
										<input
											type="date"
											value={editingBooking.date.toISOString().split("T")[0]}
											onChange={(e) => {
												const newDate = new Date(e.target.value);
												handleEditChange("date", newDate);
											}}
											className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
										/>
									</div>
									<div>
										<label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
											Time
										</label>
										<select
											value={editingBooking.time.id}
											onChange={(e) => {
												const timeId = Number.parseInt(e.target.value);
												const selectedTime = timeSlots.find(
													(time) => time.id === timeId
												);
												if (selectedTime) {
													handleEditChange("time", selectedTime);
												}
											}}
											className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
										>
											{timeSlots.map((time) => (
												<option key={time.id} value={time.id}>
													{time.time}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>

							<div className="mb-6">
								<p className="font-medium mb-2 dark:text-white">
									Customer Information:
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
											First Name
										</label>
										<input
											type="text"
											value={editingBooking.userInfo.firstName}
											onChange={(e) =>
												handleEditChange("userInfo.firstName", e.target.value)
											}
											className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
										/>
									</div>
									<div>
										<label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
											Last Name
										</label>
										<input
											type="text"
											value={editingBooking.userInfo.lastName}
											onChange={(e) =>
												handleEditChange("userInfo.lastName", e.target.value)
											}
											className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
									<div>
										<label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
											Email
										</label>
										<input
											type="email"
											value={editingBooking.userInfo.email}
											onChange={(e) =>
												handleEditChange("userInfo.email", e.target.value)
											}
											className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
										/>
									</div>
									<div>
										<label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
											Phone
										</label>
										<input
											type="tel"
											value={editingBooking.userInfo.phone}
											onChange={(e) =>
												handleEditChange("userInfo.phone", e.target.value)
											}
											className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
										/>
									</div>
								</div>
							</div>

							<div className="mb-6">
								<label className="font-medium mb-2 block dark:text-white">
									Special Requests:
								</label>
								<textarea
									value={editingBooking.userInfo.specialRequests}
									onChange={(e) =>
										handleEditChange("userInfo.specialRequests", e.target.value)
									}
									rows={4}
									className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
								></textarea>
							</div>
						</div>

						<div className="bg-gray-100 dark:bg-gray-700 p-4 border-t border-gray-300 dark:border-gray-600 flex justify-between">
							<button
								onClick={() => setIsEditModalOpen(false)}
								className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={saveEditedBooking}
								className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition-colors"
							>
								Save Changes
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Footer */}
			<footer className="bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white py-12 mt-28">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
						<div>
							<h3 className="text-xl font-semibold mb-4 text-teal-400">
								Tranquil Touch Spa
							</h3>
							<p className="text-gray-300 mb-4">
								Your sanctuary for relaxation and rejuvenation. Experience
								ultimate wellness with our premium spa services.
							</p>
							<div className="flex space-x-4">
								<a
									href="#"
									className="text-teal-400 hover:text-teal-300 transition-colors duration-300"
								>
									<span className="sr-only">Twitter</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
									</svg>
								</a>
								<a
									href="#"
									className="text-teal-400 hover:text-teal-300 transition-colors duration-300"
								>
									<span className="sr-only">Instagram</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668-.069 4.948-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
								</a>
								<a
									href="#"
									className="text-teal-400 hover:text-teal-300 transition-colors duration-300"
								>
									<span className="sr-only">Facebook</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
									</svg>
								</a>
							</div>
						</div>

						{/* Column 2 - Location */}
						<div>
							<h3 className="text-xl font-semibold mb-4 text-teal-400">
								Our Location
							</h3>
							<div className="space-y-2 text-gray-300">
								<p>123 Relaxation Avenue</p>
								<p>Serenity, CA 90210</p>
								<p className="mt-4">(555) 123-4567</p>
								<p>info@tranquiltouch.com</p>
							</div>
						</div>

						{/* Column 3 - Hours */}
						<div>
							<h3 className="text-xl font-semibold mb-4 text-teal-400">
								Opening Hours
							</h3>
							<div className="space-y-2 text-gray-300">
								<div className="flex justify-between">
									<span>Monday - Friday:</span>
									<span>9AM - 8PM</span>
								</div>
								<div className="flex justify-between">
									<span>Saturday:</span>
									<span>10AM - 6PM</span>
								</div>
								<div className="flex justify-between">
									<span>Sunday:</span>
									<span>10AM - 4PM</span>
								</div>
							</div>
						</div>

						{/* Column 4 - Quick Links */}
						<div>
							<h3 className="text-xl font-semibold mb-4 text-teal-400">
								Quick Links
							</h3>
							<ul className="space-y-2">
								{[
									"Book Appointment",
									"Our Services",
									"About Us",
									"Contact Us",
									"Gift Cards",
									"Privacy Policy",
								].map((link) => (
									<li key={link}>
										<a
											href="#"
											className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
										>
											{link}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Copyright */}
					<div className="pt-8 mt-8 border-t border-gray-700">
						<div className="text-center text-gray-400">
							<p>
								&copy; {new Date().getFullYear()} Tranquil Touch Spa. All rights
								reserved.
							</p>
							<div className="flex justify-center space-x-6 mt-4">
								<a
									href="#"
									className="hover:text-teal-400 transition-colors duration-300"
								>
									Terms of Service
								</a>
								<a
									href="#"
									className="hover:text-teal-400 transition-colors duration-300"
								>
									Privacy Policy
								</a>
								<a
									href="#"
									className="hover:text-teal-400 transition-colors duration-300"
								>
									Sitemap
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>

			<style>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulseSoft 2s infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounceSoft 2s infinite;
        }
        
        .animate-success-check {
          animation: successCheck 1.5s ease-in-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        @keyframes pulseSoft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes bounceSoft {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes successCheck {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5) rotate(-45deg);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple 0.6s linear;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .bubbles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .bubble {
          position: absolute;
          bottom: -100px;
          width: var(--size);
          height: var(--size);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          left: var(--left);
          animation: rise var(--time) ease-in infinite;
          animation-delay: var(--delay);
        }
        
        @keyframes rise {
          0% {
            bottom: -100px;
            transform: translateX(0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateX(20px) scale(1.1);
            opacity: 0.8;
          }
          100% {
            bottom: 100%;
            transform: translateX(-20px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
		</div>
	);
};

export default App;
