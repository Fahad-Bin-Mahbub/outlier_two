"use client";

import React, { useState, useEffect, useRef } from "react";

const BikeRanker = () => {
	const [darkMode, setDarkMode] = useState(false);
	const [currentPage, setCurrentPage] = useState("home");
	const [selectedBikes, setSelectedBikes] = useState([]);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success");
	const [animatingOut, setAnimatingOut] = useState(null);
	const [confettiActive, setConfettiActive] = useState(false);
	const confettiRef = useRef(null);
	const [activeUser, setActiveUser] = useState({
		name: "Alex Johnson",
		email: "alex@bikeranker.com",
		image:
			"https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		status: "Premium Member",
	});

	const allBikes = [
		{
			id: 1,
			name: "Mountain Explorer 750",
			description:
				"Premium trail bike with hydraulic disc brakes and full suspension system. Perfect for rough mountain trails.",
			price: 1299,
			image:
				"https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2070&auto=format&fit=crop",
			brand: "Alpine",
			type: "Mountain",
			rating: 4.8,
		},
		{
			id: 2,
			name: "Urban Commuter 5",
			description:
				"Lightweight city bike designed for daily commuting with integrated lights and rack mounts.",
			price: 899,
			image:
				"https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2022&auto=format&fit=crop",
			brand: "CityRide",
			type: "Commuter",
			rating: 4.5,
		},
		{
			id: 3,
			name: "Road Master Pro",
			description:
				"Professional road bike with carbon frame and electronic shifting. Built for speed and long-distance riding.",
			price: 1599,
			image:
				"https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070&auto=format&fit=crop",
			brand: "Velocity",
			type: "Road",
			rating: 4.9,
		},
		{
			id: 4,
			name: "Gravel Wanderer GX",
			description:
				"Versatile gravel bike that handles both pavement and dirt with ease. Perfect for adventure cycling.",
			price: 1099,
			image:
				"https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2070&auto=format&fit=crop",
			brand: "Pathfinder",
			type: "Gravel",
			rating: 4.6,
		},
		{
			id: 5,
			name: "Electric Cruiser Plus",
			description:
				"Powerful e-bike with long-range battery and comfortable riding position. Makes hills feel flat.",
			price: 2299,
			image:
				"https://images.unsplash.com/photo-1601391721091-4646369e0bb5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZWxlY3RyaWMlMjBiaWtlfGVufDB8fDB8fHww",
			brand: "EcoMotion",
			type: "Electric",
			rating: 4.7,
		},
		{
			id: 6,
			name: "Folding City Compact",
			description:
				"Innovative folding bike that fits in small spaces. Ideal for mixed-mode commuting and apartment living.",
			price: 799,
			image:
				"https://images.unsplash.com/photo-1618987688327-dc0b28888fe4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGVsZWN0cmljJTIwYmlrZXxlbnwwfHwwfHx8MA%3D%3D",
			brand: "Zipfold",
			type: "Folding",
			rating: 4.4,
		},
		{
			id: 7,
			name: "Downhill Dominator",
			description:
				"Professional downhill mountain bike with heavy-duty suspension and robust frame for extreme terrain.",
			price: 1899,
			image:
				"https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJpY3ljbGVzfGVufDB8fDB8fHww",
			brand: "Alpine",
			type: "Mountain",
			rating: 4.9,
		},
		{
			id: 8,
			name: "Hybrid Pathfinder",
			description:
				"Versatile hybrid bike that performs well on both city streets and light trails.",
			price: 849,
			image:
				"https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=2070&auto=format&fit=crop",
			brand: "CityRide",
			type: "Hybrid",
			rating: 4.3,
		},
		{
			id: 9,
			name: "Carbon Trail X7",
			description:
				"Ultralight carbon fiber mountain bike with precision handling and top-tier components.",
			price: 2499,
			image:
				"https://media.trekbikes.com/image/upload/w_1200/FuelEX7DeoreXT_23_36347_A_Portrait",
			brand: "Alpine",
			type: "Mountain",
			rating: 4.9,
		},
		{
			id: 10,
			name: "City Glider E1",
			description:
				"Sleek urban e-bike with hidden battery and automatic gear shifting for effortless city navigation.",
			price: 1799,
			image:
				"https://freegobikes.com/cdn/shop/files/9_ba9a2be2-9ca6-4f95-8728-d10bef22435e-234677.jpg?v=1743578542&width=533",
			brand: "EcoMotion",
			type: "Electric",
			rating: 4.6,
		},
		{
			id: 11,
			name: "Adventure Tourer Pro",
			description:
				"Long-distance touring bike with premium luggage mounts and all-day comfort geometry.",
			price: 1399,
			image:
				"https://bikepacking.com/wp-content/uploads/2018/05/Kona-Sutra-LTD-Review_main.jpg",
			brand: "Pathfinder",
			type: "Touring",
			rating: 4.7,
		},
		{
			id: 12,
			name: "Street Racer S1",
			description:
				"Aerodynamic road bike designed for competitive cycling with electronic shifting system.",
			price: 1999,
			image:
				"https://images.unsplash.com/photo-1505705694340-019e1e335916?q=80&w=1932&auto=format&fit=crop",
			brand: "Velocity",
			type: "Road",
			rating: 4.8,
		},
	];

	const [currentBikeLeft, setCurrentBikeLeft] = useState(null);
	const [currentBikeRight, setCurrentBikeRight] = useState(null);
	const [availableBikes, setAvailableBikes] = useState([]);
	const [comparisonCount, setComparisonCount] = useState(0);

	const initializeBikes = () => {
		const shuffled = [...allBikes].sort(() => 0.5 - Math.random());
		setCurrentBikeLeft(shuffled[0]);
		setCurrentBikeRight(shuffled[1]);
		setAvailableBikes(shuffled.slice(2));
		setComparisonCount(0);
		setIsLoading(false);
	};

	useEffect(() => {
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setDarkMode(prefersDark);

		setTimeout(() => {
			initializeBikes();
		}, 800);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (currentPage === "home" && currentBikeLeft && currentBikeRight) {
				if (e.key === "ArrowLeft") {
					handleChoose(currentBikeLeft, currentBikeRight);
				} else if (e.key === "ArrowRight") {
					handleChoose(currentBikeRight, currentBikeLeft);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [currentPage, currentBikeLeft, currentBikeRight]);

	const toastTimeoutRef = useRef(null);

	const displayToast = (message, type = "success") => {
		if (toastTimeoutRef.current) {
			clearTimeout(toastTimeoutRef.current);
		}

		setToastMessage(message);
		setToastType(type);
		setShowToast(true);

		toastTimeoutRef.current = setTimeout(() => {
			setShowToast(false);
			toastTimeoutRef.current = null;
		}, 3000);
	};

	const resetBikes = () => {
		setIsLoading(true);
		setTimeout(() => {
			initializeBikes();
			displayToast("Bikes have been reset!", "success");
		}, 500);
	};

	const handleChoose = (chosenBike, otherBike) => {
		if (availableBikes.length === 0) {
			displayToast("No more bikes to compare! Try resetting.", "warning");
			return;
		}

		setComparisonCount((prevCount) => prevCount + 1);

		if (comparisonCount % 3 === 0) {
			displayToast(`You chose ${chosenBike.name}`, "info");
		}

		const newBike = availableBikes[0];
		const updatedAvailableBikes = availableBikes.slice(1);

		if (chosenBike.id === currentBikeLeft?.id) {
			setAnimatingOut("right");
			setTimeout(() => {
				setCurrentBikeRight(newBike);
				setAvailableBikes(updatedAvailableBikes);
				setAnimatingOut(null);
			}, 300);
		} else {
			setAnimatingOut("left");
			setTimeout(() => {
				setCurrentBikeLeft(newBike);
				setAvailableBikes(updatedAvailableBikes);
				setAnimatingOut(null);
			}, 300);
		}
	};

	const confettiTimeoutRef = useRef(null);

	const triggerConfetti = () => {
		if (confettiTimeoutRef.current) {
			clearTimeout(confettiTimeoutRef.current);
		}

		if (!confettiActive) {
			setConfettiActive(true);
			confettiTimeoutRef.current = setTimeout(() => {
				setConfettiActive(false);
				confettiTimeoutRef.current = null;
			}, 2000);
		}
	};

	const handleIWant = (bike, otherBike) => {
		if (!selectedBikes.some((selectedBike) => selectedBike.id === bike.id)) {
			setSelectedBikes((prev) => [...prev, bike]);
			displayToast(`${bike.name} added to your collection!`, "success");
			triggerConfetti();
		} else {
			displayToast("This bike is already in your collection!", "warning");
		}

		setTimeout(() => {
			handleChoose(bike, otherBike);
		}, 50);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const navigateTo = (page) => {
		if (currentPage !== page) {
			setCurrentPage(page);
			setIsMobileMenuOpen(false);

			if (page === "myChoices") {
				displayToast(
					selectedBikes.length > 0
						? `You have ${selectedBikes.length} bikes in your collection`
						: "Your collection is empty. Start comparing bikes!",
					selectedBikes.length > 0 ? "info" : "warning"
				);
			}
		} else {
			setIsMobileMenuOpen(false);
		}
	};

	const handleDemoTab = (tabName) => {
		displayToast(`${tabName} feature coming soon!`, "info");
	};

	const renderStarRating = (rating) => {
		return (
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => (
					<svg
						key={i}
						className={`w-4 h-4 ${
							i < Math.floor(rating)
								? darkMode
									? "text-amber-400 fill-amber-400"
									: "text-amber-500 fill-amber-500"
								: "text-gray-300 dark:text-gray-600"
						} ${
							i < rating && i >= Math.floor(rating)
								? "fill-amber-400 opacity-50"
								: ""
						}`}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
					</svg>
				))}
				<span
					className={`ml-2 text-xs ${
						darkMode ? "text-gray-400" : "text-gray-600"
					}`}
				>
					{rating.toFixed(1)}
				</span>
			</div>
		);
	};

	const DarkModeToggle = ({ darkMode, setDarkMode, className = "" }) => {
		return (
			<button
				onClick={() => {
					setDarkMode(!darkMode);
				}}
				className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
					darkMode
						? "bg-slate-700 text-amber-300 hover:bg-slate-600 hover:scale-110"
						: "bg-gray-100 text-amber-600 hover:bg-gray-200 hover:scale-110"
				} ${className}`}
				aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
			>
				{darkMode ? (
					<svg
						className="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="5"></circle>
						<line x1="12" y1="1" x2="12" y2="3"></line>
						<line x1="12" y1="21" x2="12" y2="23"></line>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
						<line x1="1" y1="12" x2="3" y2="12"></line>
						<line x1="21" y1="12" x2="23" y2="12"></line>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
					</svg>
				) : (
					<svg
						className="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
					</svg>
				)}
			</button>
		);
	};

	return (
		<div
			className={`font-sans min-h-screen transition-colors duration-500 ease-in-out ${
				darkMode
					? "dark bg-slate-900 text-gray-100"
					: "bg-gray-50 text-gray-900"
			}`}
		>
			{}
			<div
				ref={confettiRef}
				className={`fixed inset-0 z-50 pointer-events-none ${
					confettiActive ? "block" : "hidden"
				}`}
			>
				{confettiActive && (
					<>
						{[...Array(50)].map((_, i) => {
							const size = Math.random() * 8 + 5;
							const left = Math.random() * 100;
							const animDuration = Math.random() * 3 + 2;
							const delay = Math.random() * 0.5;
							const color = [
								"bg-cyan-500",
								"bg-indigo-500",
								"bg-amber-500",
								"bg-emerald-500",
								"bg-rose-500",
								"bg-purple-500",
							][Math.floor(Math.random() * 6)];

							return (
								<div
									key={i}
									className={`absolute ${color} rounded-md opacity-80`}
									style={{
										left: `${left}%`,
										top: "-20px",
										width: `${size}px`,
										height: `${size}px`,
										animation: `confetti ${animDuration}s ease-in ${delay}s forwards`,
									}}
								></div>
							);
						})}
					</>
				)}
			</div>

			<div className="fixed inset-0 -z-10 overflow-hidden">
				<div
					className={`absolute inset-0 bg-gradient-to-br ${
						darkMode ? "from-slate-950 to-slate-900" : "from-white to-gray-100"
					}`}
				></div>
				<div
					className={`absolute top-0 right-0 w-2/3 h-64 ${
						darkMode ? "bg-indigo-900" : "bg-indigo-200"
					} opacity-10 blur-3xl rounded-bl-full`}
				></div>
				<div
					className={`absolute bottom-0 left-0 w-1/2 h-64 ${
						darkMode ? "bg-cyan-900" : "bg-cyan-200"
					} opacity-10 blur-3xl rounded-tr-full`}
				></div>
			</div>

			{}
			{showToast && (
				<div className="fixed top-20 right-4 z-50 animate-fadeIn">
					<div
						className={`px-6 py-3 rounded-lg shadow-xl ${
							darkMode
								? `${
										toastType === "success"
											? "bg-emerald-900/80 border-emerald-700"
											: toastType === "warning"
											? "bg-amber-900/80 border-amber-700"
											: "bg-slate-800/80 border-slate-700"
								  }`
								: `${
										toastType === "success"
											? "bg-emerald-100 border-emerald-200"
											: toastType === "warning"
											? "bg-amber-100 border-amber-200"
											: "bg-white border-gray-200"
								  }`
						} border flex items-center max-w-md transition-all duration-300 backdrop-blur-sm`}
					>
						<svg
							className={`w-5 h-5 mr-2 ${
								toastType === "success"
									? darkMode
										? "text-emerald-400"
										: "text-emerald-500"
									: toastType === "warning"
									? darkMode
										? "text-amber-400"
										: "text-amber-500"
									: darkMode
									? "text-cyan-400"
									: "text-cyan-500"
							}`}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							{toastType === "success" ? (
								<>
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
									<polyline points="22 4 12 14.01 9 11.01"></polyline>
								</>
							) : toastType === "warning" ? (
								<>
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="8" x2="12" y2="12"></line>
									<line x1="12" y1="16" x2="12.01" y2="16"></line>
								</>
							) : (
								<>
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="16" x2="12" y2="12"></line>
									<line x1="12" y1="8" x2="12.01" y2="8"></line>
								</>
							)}
						</svg>
						<p className="font-medium">{toastMessage}</p>
					</div>
				</div>
			)}

			<div className="flex h-screen overflow-hidden">
				<div
					className={`hidden md:block w-64 flex-shrink-0 ${
						darkMode
							? "bg-slate-800/80 border-slate-700 backdrop-blur-sm"
							: "bg-white/80 border-gray-200 backdrop-blur-sm"
					} border-r transition-all duration-300`}
				>
					<div className="h-full flex flex-col">
						<div
							className={`flex items-center p-6 border-b border-opacity-50 ${
								darkMode ? "border-slate-700" : "border-gray-200"
							}`}
						>
							<svg
								className={`h-8 w-8 ${
									darkMode ? "text-cyan-400" : "text-cyan-600"
								}`}
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<circle cx="12" cy="12" r="3" />
								<line x1="12" y1="2" x2="12" y2="5" />
								<line x1="12" y1="19" x2="12" y2="22" />
								<line x1="5" y1="12" x2="2" y2="12" />
								<line x1="22" y1="12" x2="19" y2="12" />
							</svg>
							<span
								className={`ml-2 text-xl font-extrabold tracking-tight ${
									darkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Bike
								<span
									className={`${darkMode ? "text-cyan-400" : "text-cyan-600"}`}
								>
									Ranker
								</span>
							</span>
						</div>

						<div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
							<button
								onClick={() => navigateTo("home")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
									currentPage === "home"
										? `${
												darkMode
													? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
													: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
										  } shadow-md`
										: `${
												darkMode
													? "text-gray-300 hover:bg-slate-700"
													: "text-gray-600 hover:bg-gray-100"
										  }`
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
									<polyline points="9 22 9 12 15 12 15 22"></polyline>
								</svg>
								Home
							</button>

							<button
								onClick={() => navigateTo("myChoices")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer relative ${
									currentPage === "myChoices"
										? `${
												darkMode
													? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
													: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
										  } shadow-md`
										: `${
												darkMode
													? "text-gray-300 hover:bg-slate-700"
													: "text-gray-600 hover:bg-gray-100"
										  }`
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
								</svg>
								My Collection
								{selectedBikes.length > 0 && (
									<span
										className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
											darkMode
												? "bg-cyan-500 text-white"
												: "bg-cyan-600 text-white"
										}`}
									>
										{selectedBikes.length}
									</span>
								)}
							</button>

							{}
							<button
								onClick={() => handleDemoTab("Categories")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
									darkMode
										? "text-gray-300 hover:bg-slate-700"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="8" y1="6" x2="21" y2="6"></line>
									<line x1="8" y1="12" x2="21" y2="12"></line>
									<line x1="8" y1="18" x2="21" y2="18"></line>
									<line x1="3" y1="6" x2="3.01" y2="6"></line>
									<line x1="3" y1="12" x2="3.01" y2="12"></line>
									<line x1="3" y1="18" x2="3.01" y2="18"></line>
								</svg>
								Categories
							</button>

							<button
								onClick={() => handleDemoTab("Sales & Deals")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
									darkMode
										? "text-gray-300 hover:bg-slate-700"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
									<line x1="7" y1="7" x2="7.01" y2="7"></line>
								</svg>
								Sales & Deals
							</button>

							<button
								onClick={() => handleDemoTab("Settings")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
									darkMode
										? "text-gray-300 hover:bg-slate-700"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="3"></circle>
									<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
								</svg>
								Settings
							</button>
						</div>

						{}
						<div
							className={`p-4 border-t ${
								darkMode ? "border-slate-700" : "border-gray-200"
							}`}
						>
							<div className="flex items-center">
								<img
									src={activeUser.image}
									alt="User profile"
									className="rounded-full w-10 h-10 border-2 mr-3"
								/>
								<div className="flex-1 min-w-0">
									<p
										className={`text-sm font-medium truncate ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										{activeUser.name}
									</p>
									<p
										className={`text-xs truncate ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										{activeUser.status}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="md:hidden fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-opacity-80 ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-gray-200'} border-b transition-all duration-300">
					<div className="flex items-center justify-between h-16 px-4">
						<div className="flex items-center">
							<svg
								className={`h-8 w-8 ${
									darkMode ? "text-cyan-400" : "text-cyan-600"
								}`}
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<circle cx="12" cy="12" r="3" />
								<line x1="12" y1="2" x2="12" y2="5" />
								<line x1="12" y1="19" x2="12" y2="22" />
								<line x1="5" y1="12" x2="2" y2="12" />
								<line x1="22" y1="12" x2="19" y2="12" />
							</svg>
							<span
								className={`ml-2 text-xl font-extrabold tracking-tight ${
									darkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Bike
								<span
									className={`${darkMode ? "text-cyan-400" : "text-cyan-600"}`}
								>
									Ranker
								</span>
							</span>
						</div>
						<div className="flex items-center space-x-4">
							<DarkModeToggle
								darkMode={darkMode}
								setDarkMode={(value) => {
									setDarkMode(value);
									displayToast(
										`Switched to ${value ? "dark" : "light"} mode`,
										"info"
									);
								}}
							/>
							<button
								onClick={toggleMobileMenu}
								className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
									darkMode
										? "bg-slate-700 text-gray-300 hover:bg-slate-600"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
								aria-label="Toggle mobile menu"
							>
								{isMobileMenuOpen ? (
									<svg
										className="w-5 h-5"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line x1="18" y1="6" x2="6" y2="18"></line>
										<line x1="6" y1="6" x2="18" y2="18"></line>
									</svg>
								) : (
									<svg
										className="w-5 h-5"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line x1="3" y1="12" x2="21" y2="12"></line>
										<line x1="3" y1="6" x2="21" y2="6"></line>
										<line x1="3" y1="18" x2="21" y2="18"></line>
									</svg>
								)}
							</button>
						</div>
					</div>

					<div
						className={`transition-all duration-300 ease-in-out overflow-hidden ${
							isMobileMenuOpen ? "max-h-60" : "max-h-0"
						}`}
					>
						<div className="px-4 pt-2 pb-3 space-y-1">
							<button
								onClick={() => navigateTo("home")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
									currentPage === "home"
										? `${
												darkMode
													? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
													: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
										  }`
										: `${
												darkMode
													? "text-gray-300 hover:bg-slate-700"
													: "text-gray-600 hover:bg-gray-100"
										  }`
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
									<polyline points="9 22 9 12 15 12 15 22"></polyline>
								</svg>
								Home
							</button>
							<button
								onClick={() => navigateTo("myChoices")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer relative ${
									currentPage === "myChoices"
										? `${
												darkMode
													? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
													: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
										  }`
										: `${
												darkMode
													? "text-gray-300 hover:bg-slate-700"
													: "text-gray-600 hover:bg-gray-100"
										  }`
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
								</svg>
								My Collection
								{selectedBikes.length > 0 && (
									<span
										className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
											darkMode
												? "bg-cyan-500 text-white"
												: "bg-cyan-600 text-white"
										}`}
									>
										{selectedBikes.length}
									</span>
								)}
							</button>

							{}
							<button
								onClick={() => handleDemoTab("Categories")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
									darkMode
										? "text-gray-300 hover:bg-slate-700"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="8" y1="6" x2="21" y2="6"></line>
									<line x1="8" y1="12" x2="21" y2="12"></line>
									<line x1="8" y1="18" x2="21" y2="18"></line>
									<line x1="3" y1="6" x2="3.01" y2="6"></line>
									<line x1="3" y1="12" x2="3.01" y2="12"></line>
									<line x1="3" y1="18" x2="3.01" y2="18"></line>
								</svg>
								Categories
							</button>

							<button
								onClick={() => handleDemoTab("Sales & Deals")}
								className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
									darkMode
										? "text-gray-300 hover:bg-slate-700"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								<svg
									className="w-5 h-5 mr-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
									<line x1="7" y1="7" x2="7.01" y2="7"></line>
								</svg>
								Sales & Deals
							</button>

							{}
							<div className="border-t mt-2 pt-2 flex items-center">
								<img
									src={activeUser.image}
									alt="User profile"
									className="rounded-full w-8 h-8 border-2 mr-2"
								/>
								<div className="flex-1 min-w-0">
									<p
										className={`text-sm font-medium truncate ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										{activeUser.name}
									</p>
									<p
										className={`text-xs truncate ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										{activeUser.status}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-auto md:pt-0 pt-16">
					<div className="hidden md:block absolute top-6 right-8 z-20">
						<div className="flex items-center space-x-4">
							<div
								className={`px-3 py-1.5 rounded-full text-sm ${
									darkMode
										? "bg-slate-800 text-gray-300"
										: "bg-white text-gray-700"
								} shadow-md`}
							>
								<span className="font-medium">Compared: {comparisonCount}</span>
							</div>
							<DarkModeToggle
								darkMode={darkMode}
								setDarkMode={(value) => {
									setDarkMode(value);
									displayToast(
										`Switched to ${value ? "dark" : "light"} mode`,
										"info"
									);
								}}
							/>
						</div>
					</div>

					<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
						{isLoading ? (
							<div className="animate-pulse max-w-6xl mx-auto">
								<div className={`h-10 w-64 ${darkMode? "bg-gray-700": "bg-gray-300"} rounded mx-auto mb-8`}></div>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
									<div className={`h-96 ${darkMode? "bg-gray-700": "bg-gray-300"} rounded-xl`}></div>
									<div className={`h-96 ${darkMode? "bg-gray-700": "bg-gray-300"} rounded-xl`}></div>
								</div>
							</div>
						) : (
							<>
								{currentPage === "home" && (
									<div className="animate-fadeIn">
										<h1
											className={`text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-10 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Which{" "}
											<span
												className={`${
													darkMode ? "text-cyan-400" : "text-cyan-600"
												} bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent`}
											>
												bike
											</span>{" "}
											do you prefer?
										</h1>

										<p className="text-center mb-8 text-sm md:text-base max-w-xl mx-auto">
											<span
												className={darkMode ? "text-gray-300" : "text-gray-600"}
											>
												Compare bikes side by side and build your ultimate
												collection. Use{" "}
												<span className={`inline-flex items-center mx-1 px-1.5 py-0.5 rounded ${darkMode? "bg-gray-700": "bg-gray-300"} text-xs`}>
													arrow keys
												</span>{" "}
												to navigate or tap buttons below.
											</span>
										</p>

										{currentBikeLeft && currentBikeRight ? (
											<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto relative">
												<div
													className={`group rounded-xl overflow-hidden transition-all duration-300 transform ${
														animatingOut === "left"
															? "-translate-x-full opacity-0"
															: "translate-x-0 opacity-100"
													} hover:shadow-xl will-change-transform ${
														darkMode
															? "bg-slate-800/90 shadow-slate-900/60 hover:-translate-y-1"
															: "bg-white shadow-md shadow-gray-200/60 hover:-translate-y-1"
													}`}
												>
													<div className="relative overflow-hidden aspect-video">
														<img
															src={currentBikeLeft?.image}
															alt={currentBikeLeft?.name}
															className="w-full h-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
														/>
														<div
															className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
																darkMode
																	? "bg-slate-800/80 text-cyan-400"
																	: "bg-white/80 text-cyan-700"
															}`}
														>
															{currentBikeLeft?.type}
														</div>
														<div
															className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
																darkMode
																	? "bg-slate-900/80 text-amber-400"
																	: "bg-white/80 text-amber-600"
															}`}
														>
															{currentBikeLeft?.brand}
														</div>
													</div>

													<div className="p-5">
														<div className="flex justify-between items-start mb-2">
															<h2
																className={`text-xl md:text-2xl font-bold ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																{currentBikeLeft?.name}
															</h2>
															<span
																className={`text-xl font-bold ${
																	darkMode ? "text-cyan-400" : "text-cyan-600"
																}`}
															>
																${currentBikeLeft?.price}
															</span>
														</div>

														<div className="mb-3">
															{currentBikeLeft &&
																renderStarRating(currentBikeLeft.rating)}
														</div>

														<p
															className={`mb-5 text-sm md:text-base ${
																darkMode ? "text-gray-300" : "text-gray-600"
															}`}
														>
															{currentBikeLeft?.description}
														</p>

														<div className="flex flex-col sm:flex-row gap-3">
															<button
																onClick={() =>
																	currentBikeLeft &&
																	currentBikeRight &&
																	handleChoose(
																		currentBikeLeft,
																		currentBikeRight
																	)
																}
																className={`flex-1 py-3 px-5 rounded-lg font-medium text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer
                                ${
																	darkMode
																		? "bg-slate-700 text-gray-200 hover:bg-slate-600"
																		: "bg-gray-200 text-gray-800 hover:bg-gray-300"
																}`}
															>
																<div className="flex items-center justify-center">
																	<svg
																		className="w-5 h-5 mr-2"
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="2"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<polyline points="20 6 9 17 4 12"></polyline>
																	</svg>
																	Choose
																</div>
															</button>
															<button
																onClick={() =>
																	currentBikeLeft &&
																	currentBikeRight &&
																	handleIWant(currentBikeLeft, currentBikeRight)
																}
																className={`flex-1 py-3 px-5 rounded-lg font-medium text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer
                                ${
																	darkMode
																		? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500"
																		: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500"
																}`}
															>
																<div className="flex items-center justify-center">
																	<svg
																		className="w-5 h-5 mr-2"
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="2"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
																	</svg>
																	I WANT THIS
																</div>
															</button>
														</div>
													</div>
												</div>

												<div className="lg:hidden flex justify-center items-center my-2">
													<div
														className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold 
                          ${
														darkMode
															? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
															: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
													} shadow-md`}
													>
														VS
													</div>
												</div>

												<div
													className={`group rounded-xl overflow-hidden transition-all duration-300 transform ${
														animatingOut === "right"
															? "translate-x-full opacity-0"
															: "translate-x-0 opacity-100"
													} hover:shadow-xl will-change-transform ${
														darkMode
															? "bg-slate-800/90 shadow-slate-900/60 hover:-translate-y-1"
															: "bg-white shadow-md shadow-gray-200/60 hover:-translate-y-1"
													}`}
												>
													<div className="relative overflow-hidden aspect-video">
														<img
															src={currentBikeRight?.image}
															alt={currentBikeRight?.name}
															className="w-full h-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
														/>
														<div
															className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
																darkMode
																	? "bg-slate-800/80 text-cyan-400"
																	: "bg-white/80 text-cyan-700"
															}`}
														>
															{currentBikeRight?.type}
														</div>
														<div
															className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
																darkMode
																	? "bg-slate-900/80 text-amber-400"
																	: "bg-white/80 text-amber-600"
															}`}
														>
															{currentBikeRight?.brand}
														</div>
													</div>

													<div className="p-5">
														<div className="flex justify-between items-start mb-2">
															<h2
																className={`text-xl md:text-2xl font-bold ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																{currentBikeRight?.name}
															</h2>
															<span
																className={`text-xl font-bold ${
																	darkMode ? "text-cyan-400" : "text-cyan-600"
																}`}
															>
																${currentBikeRight?.price}
															</span>
														</div>

														<div className="mb-3">
															{currentBikeRight &&
																renderStarRating(currentBikeRight.rating)}
														</div>

														<p
															className={`mb-5 text-sm md:text-base ${
																darkMode ? "text-gray-300" : "text-gray-600"
															}`}
														>
															{currentBikeRight?.description}
														</p>

														<div className="flex flex-col sm:flex-row gap-3">
															<button
																onClick={() =>
																	currentBikeLeft &&
																	currentBikeRight &&
																	handleChoose(
																		currentBikeRight,
																		currentBikeLeft
																	)
																}
																className={`flex-1 py-3 px-5 rounded-lg font-medium text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer
                                ${
																	darkMode
																		? "bg-slate-700 text-gray-200 hover:bg-slate-600"
																		: "bg-gray-200 text-gray-800 hover:bg-gray-300"
																}`}
															>
																<div className="flex items-center justify-center">
																	<svg
																		className="w-5 h-5 mr-2"
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="2"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<polyline points="20 6 9 17 4 12"></polyline>
																	</svg>
																	Choose
																</div>
															</button>
															<button
																onClick={() =>
																	currentBikeLeft &&
																	currentBikeRight &&
																	handleIWant(currentBikeRight, currentBikeLeft)
																}
																className={`flex-1 py-3 px-5 rounded-lg font-medium text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer
                                ${
																	darkMode
																		? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500"
																		: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500"
																}`}
															>
																<div className="flex items-center justify-center">
																	<svg
																		className="w-5 h-5 mr-2"
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="2"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
																	</svg>
																	I WANT THIS
																</div>
															</button>
														</div>
													</div>
												</div>

												<div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
													<div
														className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold shadow-lg transform transition-all hover:scale-110 cursor-pointer
                          ${
														darkMode
															? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
															: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
													}`}
													>
														VS
													</div>
												</div>
											</div>
										) : (
											<div className="text-center py-12">
												<p
													className={
														darkMode ? "text-gray-300" : "text-gray-600"
													}
												>
													Loading bikes...
												</p>
											</div>
										)}

										<div className="mt-8 flex justify-center flex-col items-center space-y-4">
											<div
												className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
													darkMode
														? "bg-slate-800 text-gray-300"
														: "bg-gray-200 text-gray-700"
												} shadow-md`}
											>
												<svg
													className="w-4 h-4 mr-2"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
												</svg>
												{availableBikes.length} bikes remaining
											</div>

											{availableBikes.length === 0 ? (
												<button
													onClick={resetBikes}
													className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer ${
														darkMode
															? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500"
															: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500"
													} shadow-md`}
												>
													<div className="flex items-center">
														<svg
															className="w-4 h-4 mr-2"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path d="M23 4v6h-6"></path>
															<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
														</svg>
														Reset Bikes
													</div>
												</button>
											) : (
												<button
													onClick={() => navigateTo("myChoices")}
													className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer ${
														darkMode
															? "bg-slate-700 text-gray-200 hover:bg-slate-600"
															: "bg-gray-200 text-gray-800 hover:bg-gray-300"
													} shadow-md`}
												>
													<div className="flex items-center">
														<svg
															className="w-4 h-4 mr-2"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
														</svg>
														View My Collection
													</div>
												</button>
											)}
										</div>
									</div>
								)}

								{currentPage === "myChoices" && (
									<div className="animate-fadeIn">
										<h1
											className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-10 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											My{" "}
											<span
												className={`bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent`}
											>
												Bike Collection
											</span>
										</h1>

										{selectedBikes.length > 0 ? (
											<>
												<div className="flex justify-between items-center mb-6">
													<div
														className={`px-4 py-2 rounded-lg text-sm ${
															darkMode
																? "bg-slate-800 text-gray-300"
																: "bg-white text-gray-700"
														} shadow-md`}
													>
														<span className="font-medium">
															{selectedBikes.length} bikes collected
														</span>
													</div>
													<button
														onClick={() => navigateTo("home")}
														className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
															darkMode
																? "bg-slate-700 text-gray-200 hover:bg-slate-600"
																: "bg-gray-200 text-gray-800 hover:bg-gray-300"
														} flex items-center`}
													>
														<svg
															className="w-4 h-4 mr-2"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
															<polyline points="9 22 9 12 15 12 15 22"></polyline>
														</svg>
														Back to Compare
													</button>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
													{selectedBikes.map((bike) => (
														<div
															key={bike.id}
															className={`group rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl will-change-transform ${
																darkMode
																	? "bg-slate-800 shadow-slate-900/60"
																	: "bg-white shadow-md shadow-gray-200/60"
															}`}
														>
															<div className="relative overflow-hidden aspect-video">
																<img
																	src={bike.image}
																	alt={bike.name}
																	className="w-full h-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
																/>
																<div
																	className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
																		darkMode
																			? "bg-slate-800/80 text-cyan-400"
																			: "bg-white/80 text-cyan-700"
																	}`}
																>
																	{bike.type}
																</div>
																<div
																	className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
																		darkMode
																			? "bg-slate-900/80 text-amber-400"
																			: "bg-white/80 text-amber-600"
																	}`}
																>
																	{bike.brand}
																</div>
															</div>

															<div className="p-5">
																<div className="flex justify-between items-start mb-2">
																	<h2
																		className={`text-lg font-bold ${
																			darkMode ? "text-white" : "text-gray-900"
																		}`}
																	>
																		{bike.name}
																	</h2>
																	<span
																		className={`text-lg font-bold ${
																			darkMode
																				? "text-cyan-400"
																				: "text-cyan-600"
																		}`}
																	>
																		${bike.price}
																	</span>
																</div>

																<div className="mb-3">
																	{renderStarRating(bike.rating)}
																</div>

																<p
																	className={`mb-4 text-sm ${
																		darkMode ? "text-gray-300" : "text-gray-600"
																	} line-clamp-2`}
																>
																	{bike.description}
																</p>

																<div className="flex justify-end">
																	<button
																		onClick={() => {
																			setSelectedBikes(
																				selectedBikes.filter(
																					(b) => b.id !== bike.id
																				)
																			);
																			displayToast(
																				`${bike.name} removed from your collection!`,
																				"info"
																			);
																		}}
																		className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
																			darkMode
																				? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
																				: "bg-red-100 text-red-600 hover:bg-red-200"
																		}`}
																	>
																		<svg
																			className="w-4 h-4 mr-1"
																			xmlns="http://www.w3.org/2000/svg"
																			viewBox="0 0 24 24"
																			fill="none"
																			stroke="currentColor"
																			strokeWidth="2"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																		>
																			<polyline points="3 6 5 6 21 6"></polyline>
																			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
																			<line
																				x1="10"
																				y1="11"
																				x2="10"
																				y2="17"
																			></line>
																			<line
																				x1="14"
																				y1="11"
																				x2="14"
																				y2="17"
																			></line>
																		</svg>
																		Remove
																	</button>
																</div>
															</div>
														</div>
													))}
												</div>
											</>
										) : (
											<div
												className={`rounded-xl p-8 text-center ${
													darkMode
														? "bg-slate-800 shadow-lg shadow-slate-900/60"
														: "bg-white shadow-md shadow-gray-200/60"
												}`}
											>
												<div
													className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
														darkMode
															? "bg-slate-700 text-cyan-400"
															: "bg-cyan-100 text-cyan-600"
													}`}
												>
													<svg
														className="w-10 h-10"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
													</svg>
												</div>
												<h2
													className={`text-xl font-bold mb-2 ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Your collection is empty
												</h2>
												<p
													className={`mb-6 ${
														darkMode ? "text-gray-300" : "text-gray-600"
													}`}
												>
													You haven't added any bikes to your collection yet.
													Start comparing and select the ones you like!
												</p>
												<button
													onClick={() => navigateTo("home")}
													className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
														darkMode
															? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500"
															: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500"
													} shadow-md`}
												>
													<div className="flex items-center">
														<svg
															className="w-5 h-5 mr-2"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<circle cx="12" cy="12" r="10"></circle>
															<line x1="12" y1="8" x2="12" y2="16"></line>
															<line x1="8" y1="12" x2="16" y2="12"></line>
														</svg>
														Start Building Collection
													</div>
												</button>
											</div>
										)}
									</div>
								)}
							</>
						)}
					</main>

					{}
					<footer
						className={`py-8 mt-12 ${
							darkMode
								? "bg-slate-800/80 border-t border-slate-700"
								: "bg-white/80 border-t border-gray-200"
						}`}
					>
						<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
								<div className="md:col-span-1">
									<div className="flex items-center mb-4">
										<svg
											className={`h-8 w-8 ${
												darkMode ? "text-cyan-400" : "text-cyan-600"
											}`}
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="12" cy="12" r="10" />
											<circle cx="12" cy="12" r="3" />
											<line x1="12" y1="2" x2="12" y2="5" />
											<line x1="12" y1="19" x2="12" y2="22" />
											<line x1="5" y1="12" x2="2" y2="12" />
											<line x1="22" y1="12" x2="19" y2="12" />
										</svg>
										<span
											className={`ml-2 text-xl font-bold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											BikeRanker
										</span>
									</div>
									<p
										className={`text-sm ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Find and compare the perfect bike for your needs.
									</p>
									<div className="flex mt-4 space-x-3">
										<a
											href="#"
											className={`p-2 rounded-full ${
												darkMode
													? "text-gray-400 hover:text-white hover:bg-slate-700"
													: "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
											}`}
										>
											<svg
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
											</svg>
										</a>
										<a
											href="#"
											className={`p-2 rounded-full ${
												darkMode
													? "text-gray-400 hover:text-white hover:bg-slate-700"
													: "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
											}`}
										>
											<svg
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
											</svg>
										</a>
										<a
											href="#"
											className={`p-2 rounded-full ${
												darkMode
													? "text-gray-400 hover:text-white hover:bg-slate-700"
													: "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
											}`}
										>
											<svg
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
											</svg>
										</a>
										<a
											href="#"
											className={`p-2 rounded-full ${
												darkMode
													? "text-gray-400 hover:text-white hover:bg-slate-700"
													: "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
											}`}
										>
											<svg
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
											</svg>
										</a>
									</div>
								</div>

								<div>
									<h3
										className={`text-sm font-semibold uppercase tracking-wider ${
											darkMode ? "text-gray-200" : "text-gray-900"
										}`}
									>
										Explore
									</h3>
									<ul className="mt-4 space-y-2">
										<li>
											<a
												href="#"
												className={`text-sm ${
													darkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-500 hover:text-gray-900"
												}`}
											>
												All Bikes
											</a>
										</li>
										<li>
											<a
												href="#"
												className={`text-sm ${
													darkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-500 hover:text-gray-900"
												}`}
											>
												Mountain Bikes
											</a>
										</li>
										<li>
											<a
												href="#"
												className={`text-sm ${
													darkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-500 hover:text-gray-900"
												}`}
											>
												Road Bikes
											</a>
										</li>
										<li>
											<a
												href="#"
												className={`text-sm ${
													darkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-500 hover:text-gray-900"
												}`}
											>
												Electric Bikes
											</a>
										</li>
									</ul>
								</div>

								<div>
									<h3
										className={`text-sm font-semibold uppercase tracking-wider ${
											darkMode ? "text-gray-200" : "text-gray-900"
										}`}
									>
										Information
									</h3>
									<ul className="mt-4 space-y-2">
										<li>
											<a
												href="#"
												className={`text-sm ${
													darkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-500 hover:text-gray-900"
												}`}
											>
												About Us
											</a>
										</li>
										<li>
											<a
												href="#"
												className={`text-sm ${
													darkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-500 hover:text-gray-900"
												}`}
											>
												Contact
											</a>
										</li>
										<li>
											<a
												href="#"
												className={`text-sm ${
													darkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-500 hover:text-gray-900"
												}`}
											>
												Privacy Policy
											</a>
										</li>
										<li>
											<a
												href="#"
												className={`text-sm ${
													darkMode
														? "text-gray-400 hover:text-white"
														: "text-gray-500 hover:text-gray-900"
												}`}
											>
												Terms & Conditions
											</a>
										</li>
									</ul>
								</div>

								<div>
									<h3
										className={`text-sm font-semibold uppercase tracking-wider ${
											darkMode ? "text-gray-200" : "text-gray-900"
										}`}
									>
										Newsletter
									</h3>
									<p
										className={`mt-4 text-sm ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										Get the latest updates on new bikes and special offers.
									</p>
									<div className="mt-4 flex">
										<input
											type="email"
											placeholder="Enter your email"
											className={`w-full px-3 py-2 text-sm rounded-l-md focus:outline-none ${
												darkMode
													? "bg-slate-700 text-white border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
													: "bg-white text-gray-900 border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
											} border`}
										/>
										<button
											className={`px-4 py-2 rounded-r-md text-sm font-medium text-white cursor-pointer bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500`}
										>
											Subscribe
										</button>
									</div>
								</div>
							</div>

							<div
								className={`mt-8 pt-8 border-t ${
									darkMode ? "border-slate-700" : "border-gray-200"
								}`}
							>
								<p
									className={`text-sm text-center ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									&copy; {new Date().getFullYear()} BikeRanker. All rights
									reserved.
								</p>
								<p
									className={`text-xs text-center mt-2 ${
										darkMode ? "text-gray-500" : "text-gray-400"
									}`}
								>
									Designed for bike enthusiasts everywhere. Find your perfect
									ride.
								</p>
							</div>
						</div>
					</footer>
				</div>
			</div>

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

				@keyframes confetti {
					0% {
						transform: translateY(0) rotate(0);
						opacity: 0.8;
					}
					100% {
						transform: translateY(100vh) rotate(720deg);
						opacity: 0;
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.5s ease-out forwards;
				}

				html {
					scroll-behavior: smooth;
				}

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				@media (prefers-reduced-motion: reduce) {
					.animate-fadeIn,
					.transition-all,
					.transform,
					.hover\:scale-105,
					.hover\:scale-110 {
						transition: none !important;
						transform: none !important;
						animation: none !important;
					}
				}

				@media (max-width: 320px) {
					.py-3 {
						padding-top: 0.5rem;
						padding-bottom: 0.5rem;
					}
					.text-lg,
					.text-xl {
						font-size: 0.9rem;
					}
					.text-sm {
						font-size: 0.75rem;
					}
					.px-3 {
						padding-left: 0.5rem;
						padding-right: 0.5rem;
					}
					.px-4 {
						padding-left: 0.75rem;
						padding-right: 0.75rem;
					}
					h1 {
						font-size: 1.5rem !important;
					}
					h2 {
						font-size: 1.2rem !important;
					}
					.w-5,
					.h-5 {
						width: 1rem;
						height: 1rem;
					}
				}

				.will-change-transform {
					will-change: transform;
				}
			`}</style>
		</div>
	);
};

export default BikeRanker;
