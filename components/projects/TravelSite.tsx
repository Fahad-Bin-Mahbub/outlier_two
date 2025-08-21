"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

let Globe = null;

interface Destination {
	id: string;
	name: string;
	location: string;
	description: string;
	longDescription?: string;
	imageUrl: string;
	galleryImages?: string[];
	rating: number;
	isFeatured: boolean;
	tags: string[];
	coordinates: {
		lat: number;
		lng: number;
	};
	price?: {
		amount: number;
		currency: string;
		period: string;
	};
	highlights?: string[];
}

interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
}

const destinations: Destination[] = [
	{
		id: "1",
		name: "Santorini",
		location: "Greece",
		description:
			"Iconic white buildings with blue domes overlooking the Aegean Sea",
		longDescription:
			"Santorini is a volcanic island known for its stunning caldera views, white-washed buildings cascading down cliffs, and spectacular sunsets.",
		imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
		galleryImages: [
			"https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
			"https://images.unsplash.com/photo-1601581875039-e899893d520c",
		],
		rating: 4.9,
		isFeatured: true,
		tags: ["beach", "island", "romantic"],
		coordinates: { lat: 36.3932, lng: 25.4615 },
		price: {
			amount: 280,
			currency: "$",
			period: "night",
		},
		highlights: [
			"Oia Sunset Views",
			"Red Beach",
			"Ancient Akrotiri",
			"Volcanic Hot Springs",
			"Wine Tasting Tours",
		],
	},
	{
		id: "2",
		name: "Kyoto",
		location: "Japan",
		description: "Ancient temples, traditional gardens and geisha districts",
		longDescription:
			"Kyoto served as Japan's capital for over a millennium and remains the cultural heart of the country.",
		imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
		galleryImages: [
			"https://images.unsplash.com/photo-1528360983277-13d401cdc186",
		],
		rating: 4.8,
		isFeatured: true,
		tags: ["cultural", "historical", "temples"],
		coordinates: { lat: 35.0116, lng: 135.7681 },
		price: {
			amount: 210,
			currency: "$",
			period: "night",
		},
		highlights: [
			"Fushimi Inari Shrine",
			"Arashiyama Bamboo Grove",
			"Kinkaku-ji (Golden Pavilion)",
			"Gion District",
			"Traditional Tea Ceremony",
		],
	},
	{
		id: "3",
		name: "Bali",
		location: "Indonesia",
		description:
			"Tropical paradise with lush jungles, rice terraces, and vibrant culture",
		longDescription:
			"Bali is famous for its volcanic mountains, iconic rice paddies, pristine beaches, and coral reefs.",
		imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
		galleryImages: [
			"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
		],
		rating: 4.7,
		isFeatured: true,
		tags: ["beach", "cultural", "tropical"],
		coordinates: { lat: -8.4095, lng: 115.1889 },
		price: {
			amount: 120,
			currency: "$",
			period: "night",
		},
		highlights: [
			"Ubud Monkey Forest",
			"Tegallalang Rice Terraces",
			"Uluwatu Temple",
			"Kuta Beach",
			"Balinese Cooking Classes",
		],
	},
	{
		id: "4",
		name: "Machu Picchu",
		location: "Peru",
		description: "Ancient Incan citadel set high in the Andes Mountains",
		longDescription:
			"Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley.",
		imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377",
		galleryImages: [
			"https://images.unsplash.com/photo-1587595431973-160d0d94add1",
		],
		rating: 4.9,
		isFeatured: false,
		tags: ["historical", "adventure", "hiking"],
		coordinates: { lat: -13.1631, lng: -72.545 },
		price: {
			amount: 350,
			currency: "$",
			period: "tour",
		},
		highlights: [
			"Inca Trail",
			"Sun Gate Sunrise",
			"Huayna Picchu Climb",
			"Temple of the Sun",
			"Agricultural Terraces",
		],
	},
	{
		id: "5",
		name: "Paris",
		location: "France",
		description:
			"City of light famous for art, fashion, gastronomy, and culture",
		longDescription:
			"Paris, France's capital, is a global center for art, fashion, gastronomy, and culture.",
		imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
		galleryImages: [
			"https://images.unsplash.com/photo-1550340499-a6c60fc8287c",
		],
		rating: 4.6,
		isFeatured: true,
		tags: ["cultural", "romantic", "historical", "urban"],
		coordinates: { lat: 48.8566, lng: 2.3522 },
		price: {
			amount: 250,
			currency: "$",
			period: "night",
		},
		highlights: [
			"Eiffel Tower",
			"Louvre Museum",
			"Notre-Dame Cathedral",
			"Seine River Cruise",
			"Montmartre District",
		],
	},
	{
		id: "6",
		name: "Serengeti",
		location: "Tanzania",
		description: "Vast plains of Africa with annual wildebeest migration",
		longDescription:
			"The Serengeti ecosystem is a vast geographical region in north Tanzania extending to south-western Kenya, spanning 30,000 km².",
		imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
		galleryImages: [
			"https://images.unsplash.com/photo-1547970810-dc1eac37d174",
		],
		rating: 4.9,
		isFeatured: false,
		tags: ["safari", "nature", "wildlife"],
		coordinates: { lat: -2.3333, lng: 34.8333 },
		price: {
			amount: 420,
			currency: "$",
			period: "night",
		},
		highlights: [
			"Great Migration",
			"Hot Air Balloon Safari",
			"Big Five Animals",
			"Moru Kopjes",
			"Grumeti River",
		],
	},
];

const allTags = Array.from(new Set(destinations.flatMap((dest) => dest.tags)));

const TravelSite: React.FC = () => {
	const [isClient, setIsClient] = useState(false);

	const [favorites, setFavorites] = useState<string[]>([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [showLocationPrompt, setShowLocationPrompt] = useState(false);
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [nearbyDestinations, setNearbyDestinations] = useState<Destination[]>(
		[]
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredDestinations, setFilteredDestinations] =
		useState<Destination[]>(destinations);
	const [isMapVisible, setIsMapVisible] = useState(false);
	const [use3DGlobe, setUse3DGlobe] = useState(false);
	const [globeWidth, setGlobeWidth] = useState(800);
	const [globeHeight, setGlobeHeight] = useState(400);
	const [scrollY, setScrollY] = useState(0);
	const [selectedDestination, setSelectedDestination] =
		useState<Destination | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [mapZoom, setMapZoom] = useState(1);
	const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
	const [windowWidth, setWindowWidth] = useState(1200);
	const [filterOpen, setFilterOpen] = useState(false);
	const [isFilterAnimating, setIsFilterAnimating] = useState(false);
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const carouselRef = useRef<HTMLDivElement>(null);
	const globeRef = useRef<any>(null);
	const featuredDestinations = destinations.filter((dest) => dest.isFeatured);

	useEffect(() => {
		setIsClient(true);

		if (typeof window !== "undefined") {
			import("react-globe.gl")
				.then((module) => {
					Globe = module.default;
				})
				.catch((err) => {
					console.error("Could not load Globe component:", err);
				});
		}
	}, []);

	useEffect(() => {
		if (isClient) {
			try {
				const saved = localStorage.getItem("favorites");
				if (saved) {
					setFavorites(JSON.parse(saved));
				}
			} catch (error) {
				console.error("Error loading favorites from localStorage:", error);
			}
		}
	}, [isClient]);

	useEffect(() => {
		if (isClient) {
			try {
				localStorage.setItem("favorites", JSON.stringify(favorites));
			} catch (error) {
				console.error("Error saving favorites to localStorage:", error);
			}
		}
	}, [favorites, isClient]);

	useEffect(() => {
		if (isClient) {
			const handleScroll = () => {
				setScrollY(window.scrollY);
			};
			window.addEventListener("scroll", handleScroll);
			return () => window.removeEventListener("scroll", handleScroll);
		}
	}, [isClient]);

	useEffect(() => {
		if (isClient) {
			const handleResize = () => {
				setWindowWidth(window.innerWidth);
				setGlobeWidth(
					window.innerWidth < 768
						? window.innerWidth - 40
						: window.innerWidth * 0.8
				);
				setGlobeHeight(window.innerWidth < 768 ? 300 : 400);
			};

			window.addEventListener("resize", handleResize);
			handleResize();

			return () => window.removeEventListener("resize", handleResize);
		}
	}, [isClient]);

	useEffect(() => {
		let filtered = destinations;

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(dest) =>
					dest.name.toLowerCase().includes(query) ||
					dest.location.toLowerCase().includes(query) ||
					dest.description.toLowerCase().includes(query) ||
					dest.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		if (selectedTags.length > 0) {
			filtered = filtered.filter((dest) =>
				selectedTags.some((tag) => dest.tags.includes(tag))
			);
		}

		if (activeCategory) {
			filtered = filtered.filter((dest) => dest.tags.includes(activeCategory));
		}

		setFilteredDestinations(filtered);
	}, [searchQuery, selectedTags, activeCategory]);

	const formatPrice = (price?: {
		amount: number;
		currency: string;
		period: string;
	}) => {
		if (!price) return "";
		return `${price.currency}${price.amount}/${price.period}`;
	};

	const categories = useMemo(() => {
		const categoriesMap: { [key: string]: number } = {};
		filteredDestinations.forEach((dest) => {
			dest.tags.forEach((tag) => {
				if (categoriesMap[tag]) {
					categoriesMap[tag] += 1;
				} else {
					categoriesMap[tag] = 1;
				}
			});
		});
		return Object.entries(categoriesMap)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count);
	}, [filteredDestinations]);

	const globeData = useMemo(() => {
		return filteredDestinations.map((dest) => ({
			lat: dest.coordinates.lat,
			lng: dest.coordinates.lng,
			name: dest.name,
			value: dest.rating,
			id: dest.id,
			color: favorites.includes(dest.id) ? "red" : "orange",
			radius: favorites.includes(dest.id) ? 1.2 : 0.7,
		}));
	}, [favorites, filteredDestinations]);

	const findNearbyDestinations = () => {
		if (!isClient) return;

		if (navigator.geolocation) {
			setShowLocationPrompt(true);

			navigator.geolocation.getCurrentPosition(
				(position) => {
					const userCoords = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					setUserLocation(userCoords);

					setMapCenter([userCoords.lat, userCoords.lng]);
					setMapZoom(3);

					const nearby = destinations
						.map((dest) => {
							const distance = Math.sqrt(
								Math.pow(dest.coordinates.lat - userCoords.lat, 2) +
									Math.pow(dest.coordinates.lng - userCoords.lng, 2)
							);
							return { ...dest, distance };
						})
						.sort((a, b) => (a.distance || 0) - (b.distance || 0))
						.slice(0, 3);

					setNearbyDestinations(nearby);
					setShowLocationPrompt(false);
				},
				(error) => {
					console.error("Error getting location:", error);
					setShowLocationPrompt(false);
					alert(
						"Unable to access your location. Please check your browser settings."
					);
				},
				{ timeout: 10000, enableHighAccuracy: false }
			);
		} else {
			alert("Geolocation is not supported by your browser.");
		}
	};

	const toggleFavorite = (id: string) => {
		if (favorites.includes(id)) {
			setFavorites(favorites.filter((favId) => favId !== id));
		} else {
			setFavorites([...favorites, id]);
		}
	};

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setLoginError("");

		if (!email) {
			setLoginError("Please enter your email address");
			return;
		}

		if (!password) {
			setLoginError("Please enter your password");
			return;
		}

		if (email && password) {
			setIsLoggedIn(true);
			setUser({
				id: "1",
				name: email.split("@")[0],
				email,
				avatar:
					"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop",
			});
			setShowLoginModal(false);
			setEmail("");
			setPassword("");
			setLoginError("");
		}
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
		setUser(null);
	};

	const nextSlide = () => {
		setCurrentSlide((prev) =>
			prev === featuredDestinations.length - 1 ? 0 : prev + 1
		);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) =>
			prev === 0 ? featuredDestinations.length - 1 : prev - 1
		);
	};

	useEffect(() => {
		if (isClient) {
			const interval = setInterval(() => {
				nextSlide();
			}, 5000);

			return () => clearInterval(interval);
		}
	}, [currentSlide, isClient]);

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) => {
			if (prev.includes(tag)) {
				return prev.filter((t) => t !== tag);
			} else {
				return [...prev, tag];
			}
		});
	};

	const selectDestination = (dest: Destination) => {
		setSelectedDestination(dest);
		setShowDetailModal(true);
		setActiveImageIndex(0);
	};

	const toggleFilter = () => {
		if (!isFilterAnimating) {
			setIsFilterAnimating(true);
			setFilterOpen(!filterOpen);
			setTimeout(() => setIsFilterAnimating(false), 300);
		}
	};

	const selectCategory = (category: string | null) => {
		setActiveCategory(category);
	};

	const zoomIn = () => {
		setMapZoom((prev) => Math.min(prev + 0.5, 10));
	};

	const zoomOut = () => {
		setMapZoom((prev) => Math.max(prev - 0.5, 1));
	};

	const resetMapView = () => {
		setMapZoom(1);
		setMapCenter([0, 0]);
	};

	const toggleMobileMenu = () => {
		setShowMobileMenu(!showMobileMenu);
	};

	if (!isClient) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
				<div className="text-center p-8">
					<div className="animate-pulse mb-4">
						<div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
							TravelDiscover
						</div>
					</div>
					<p className="text-gray-500">Loading amazing destinations...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			{}
			<header className="sticky top-0 z-30 bg-white bg-opacity-95 backdrop-blur-md shadow-sm">
				<div className="container mx-auto px-4 py-2 md:py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<motion.div
								initial={{ rotate: 0 }}
								animate={{ rotate: [0, 10, 0, -10, 0] }}
								transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
								className="text-xl md:text-2xl"
							>
								✈️
							</motion.div>
							<h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
								TravelDiscover
							</h1>
						</div>

						{}
						<div className="hidden md:flex items-center space-x-4">
							<button
								onClick={() => {
									setIsMapVisible(!isMapVisible);
									if (!isMapVisible) {
										setUse3DGlobe(false);
									}
								}}
								className="p-2 text-sm rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
							>
								{isMapVisible ? "Hide Map" : "Show Map"}
							</button>

							{isLoggedIn ? (
								<div className="flex items-center space-x-3">
									<div className="flex items-center space-x-2">
										<span className="text-sm text-gray-700">
											Hi, {user?.name}
										</span>
										<img
											src={user?.avatar}
											alt="Profile"
											className="w-8 h-8 rounded-full border-2 border-orange-400"
										/>
									</div>
									<button
										onClick={handleLogout}
										className="p-2 text-sm rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
									>
										Logout
									</button>
								</div>
							) : (
								<button
									onClick={() => setShowLoginModal(true)}
									className="p-2 text-sm rounded-full bg-orange-500 text-white shadow-md hover:shadow-lg hover:bg-orange-600 transition-all"
								>
									Login
								</button>
							)}
						</div>

						{}
						<button
							className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
							onClick={toggleMobileMenu}
							aria-label="Toggle menu"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d={
										showMobileMenu
											? "M6 18L18 6M6 6l12 12"
											: "M4 6h16M4 12h16M4 18h16"
									}
								/>
							</svg>
						</button>
					</div>

					{}
					<AnimatePresence>
						{showMobileMenu && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.2 }}
								className="md:hidden mt-2 pt-2 border-t border-gray-100"
							>
								<div className="flex flex-col space-y-2 py-2">
									<button
										onClick={() => {
											setIsMapVisible(!isMapVisible);
											if (!isMapVisible) {
												setUse3DGlobe(false);
											}
											setShowMobileMenu(false);
										}}
										className="px-4 py-2 text-left text-sm rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
									>
										{isMapVisible ? "Hide Map" : "Show Map"}
									</button>

									{isLoggedIn ? (
										<>
											<div className="flex items-center px-4 py-2 space-x-2">
												<img
													src={user?.avatar}
													alt="Profile"
													className="w-6 h-6 rounded-full border border-orange-400"
												/>
												<span className="text-sm text-gray-700">
													{user?.name}
												</span>
											</div>
											<button
												onClick={() => {
													handleLogout();
													setShowMobileMenu(false);
												}}
												className="px-4 py-2 text-left text-sm rounded-lg bg-gray-200 text-gray-700"
											>
												Logout
											</button>
										</>
									) : (
										<button
											onClick={() => {
												setShowLoginModal(true);
												setShowMobileMenu(false);
											}}
											className="px-4 py-2 text-left text-sm rounded-lg bg-orange-500 text-white"
										>
											Login
										</button>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</header>

			<main className="container mx-auto px-4 py-4 md:py-6">
				{}
				<div className="mb-4 md:mb-6 relative">
					<div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
						<div className="relative flex-grow">
							<input
								type="text"
								placeholder="Search destinations..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm text-sm md:text-base"
							/>
							<span className="absolute left-3 top-2 md:top-3 text-gray-400">
								🔍
							</span>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery("")}
									className="absolute right-3 top-2 md:top-3 text-gray-400 hover:text-gray-600"
								>
									✕
								</button>
							)}
						</div>

						<div className="flex gap-2">
							<button
								onClick={findNearbyDestinations}
								className="px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-1 md:gap-2"
							>
								<span>📍</span>
								<span className="hidden md:inline">Nearby</span>
							</button>

							<div className="relative">
								<button
									onClick={toggleFilter}
									className={`px-3 md:px-4 py-2 rounded-full ${
										filterOpen
											? "bg-cyan-600 text-white"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									} transition-all flex items-center text-sm gap-1 md:gap-2`}
								>
									<span>🏷️</span>
									<span className="hidden md:inline">Filter</span>
								</button>

								<AnimatePresence>
									{filterOpen && (
										<motion.div
											initial={{ opacity: 0, y: 10, height: 0 }}
											animate={{ opacity: 1, y: 0, height: "auto" }}
											exit={{ opacity: 0, y: 10, height: 0 }}
											transition={{ duration: 0.2 }}
											className="absolute right-0 mt-2 p-3 bg-white rounded-lg shadow-lg z-10 w-64 md:w-80"
											style={{
												maxHeight: "70vh",
												overflowY: "auto",
												...(windowWidth < 640
													? { right: "auto", left: "-80px" }
													: {}),
											}}
										>
											<h3 className="font-medium mb-2 text-sm md:text-base">
												Filter by Tags
											</h3>
											<div className="flex flex-wrap gap-2">
												{allTags.map((tag) => (
													<button
														key={tag}
														onClick={() => toggleTag(tag)}
														className={`px-2 py-1 text-xs rounded-full transition-colors ${
															selectedTags.includes(tag)
																? "bg-cyan-500 text-white"
																: "bg-gray-200 text-gray-700 hover:bg-gray-300"
														}`}
													>
														{tag}
													</button>
												))}
											</div>
											{selectedTags.length > 0 && (
												<button
													onClick={() => setSelectedTags([])}
													className="mt-2 text-xs text-cyan-600 hover:underline"
												>
													Clear all
												</button>
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="mb-4 md:mb-6 overflow-x-auto pb-2 hide-scrollbar">
					<div className="flex space-x-2 w-max">
						<button
							onClick={() => selectCategory(null)}
							className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm whitespace-nowrap transition-colors ${
								activeCategory === null
									? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}
						>
							All Destinations
						</button>

						{categories.slice(0, 8).map((category) => (
							<button
								key={category.name}
								onClick={() => selectCategory(category.name)}
								className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm whitespace-nowrap transition-colors ${
									activeCategory === category.name
										? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								{category.name.charAt(0).toUpperCase() + category.name.slice(1)}{" "}
								({category.count})
							</button>
						))}
					</div>
				</div>

				{}
				{isMapVisible && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mb-4 md:mb-6 rounded-xl overflow-hidden shadow-lg"
					>
						<div className="bg-gradient-to-r from-cyan-800 to-blue-900 p-2 flex justify-between items-center">
							<h2 className="text-white font-medium px-2 text-sm md:text-base">
								Destination Map
							</h2>
							<div className="flex items-center space-x-2">
								<button
									onClick={() => setUse3DGlobe(!use3DGlobe)}
									className={`px-2 py-1 md:px-3 md:py-1 rounded-md text-xs transition-colors ${
										use3DGlobe
											? "bg-orange-500 text-white"
											: "bg-white/20 text-white hover:bg-white/30"
									}`}
								>
									{use3DGlobe ? "2D Map" : "3D Globe"}
								</button>
							</div>
						</div>

						<div className="relative h-[250px] md:h-[400px] bg-cyan-100 flex items-center justify-center overflow-hidden">
							{!use3DGlobe ? (
								<div className="absolute inset-0">
									<div className="w-full h-full bg-cyan-200 relative">
										{}
										<div
											className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
											style={{
												transform: `scale(${mapZoom}) translate(${
													(mapCenter[1] * 1.8) / mapZoom
												}%, ${(mapCenter[0] * -1.8) / mapZoom}%)`,
											}}
										>
											<div
												className="w-full h-full"
												style={{
													backgroundImage:
														"url(https://images.unsplash.com/photo-1524661135-423995f22d0b)",
													backgroundSize: "cover",
													backgroundPosition: "center",
													opacity: 0.7,
												}}
											></div>
										</div>

										{}
										{filteredDestinations.map((dest) => (
											<motion.div
												key={`pin-${dest.id}`}
												className="absolute w-6 h-6 cursor-pointer"
												style={{
													left: `${
														((dest.coordinates.lng + 180) / 360) * 100
													}%`,
													top: `${((90 - dest.coordinates.lat) / 180) * 100}%`,
													transform: `scale(${Math.min(1.5, mapZoom * 0.8)})`,
													zIndex: selectedDestination?.id === dest.id ? 10 : 1,
												}}
												whileHover={{ scale: 1.5 }}
												onClick={() => {
													selectDestination(dest);
												}}
											>
												<div
													className={`w-6 h-6 ${
														favorites.includes(dest.id)
															? "bg-red-500"
															: "bg-orange-500"
													} rounded-full flex items-center justify-center text-white text-xs shadow-lg`}
												>
													📍
												</div>
												<AnimatePresence>
													{(selectedDestination?.id === dest.id ||
														windowWidth > 768) && (
														<motion.div
															initial={{ opacity: 0, y: -5 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: -5 }}
															className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap z-10"
														>
															{dest.name}
														</motion.div>
													)}
												</AnimatePresence>
											</motion.div>
										))}

										{}
										{userLocation && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="absolute w-8 h-8 z-20"
												style={{
													left: `${((userLocation.lng + 180) / 360) * 100}%`,
													top: `${((90 - userLocation.lat) / 180) * 100}%`,
												}}
											>
												<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
													👤
												</div>
												<div className="absolute top-9 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
													You are here
												</div>
											</motion.div>
										)}
									</div>
								</div>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									{Globe && (
										<Globe
											ref={globeRef}
											globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
											pointsData={globeData}
											pointAltitude={0.015}
											pointRadius={(d) => (d as any).radius}
											pointColor={(d) => (d as any).color}
											pointLabel={(d) => `${(d as any).name}`}
											pointsMerge={false}
											onPointClick={(point) => {
												const dest = filteredDestinations.find(
													(d) => d.id === (point as any).id
												);
												if (dest) selectDestination(dest);
											}}
											width={globeWidth}
											height={globeHeight}
											backgroundColor="rgba(0,0,0,0)"
											atmosphereColor="rgba(65, 145, 255, 0.4)"
											atmosphereAltitude={0.15}
										/>
									)}
									{!Globe && (
										<div className="text-center p-4">
											<p className="text-gray-600 mb-2">
												3D Globe is loading...
											</p>
											<div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
										</div>
									)}
								</div>
							)}

							{}
							{!use3DGlobe && (
								<div className="absolute top-3 right-3 flex flex-col space-y-2">
									<button
										onClick={zoomIn}
										className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
									>
										+
									</button>
									<button
										onClick={zoomOut}
										className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
									>
										-
									</button>
									<button
										onClick={resetMapView}
										className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
									>
										↺
									</button>
								</div>
							)}
						</div>
					</motion.div>
				)}

				{}
				{nearbyDestinations.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6 md:mb-8"
					>
						<h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-800 flex items-center">
							<span className="mr-2">📍</span> Nearby Destinations
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
							{nearbyDestinations.map((dest) => (
								<motion.div
									key={`nearby-${dest.id}`}
									whileHover={{ y: -5 }}
									className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all relative group"
								>
									<div
										className="h-32 md:h-40 bg-cover bg-center relative"
										style={{
											backgroundImage: `url(${dest.imageUrl})`,
										}}
									>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

										{}
										{dest.price && (
											<div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-bold text-cyan-800 shadow-md">
												{formatPrice(dest.price)}
											</div>
										)}

										{}
										<button
											onClick={(e) => {
												e.stopPropagation();
												toggleFavorite(dest.id);
											}}
											className={`absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
												favorites.includes(dest.id)
													? "bg-red-500 text-white"
													: "bg-white/80 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100"
											}`}
										>
											{favorites.includes(dest.id) ? "❤️" : "🤍"}
										</button>

										{}
										<div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">
											<button
												onClick={() => selectDestination(dest)}
												className="px-2 py-1 md:px-3 md:py-1 bg-white rounded-full text-xs font-medium text-cyan-800 shadow-md hover:bg-cyan-50 transition-colors"
											>
												View Details
											</button>
										</div>
									</div>

									<div className="p-3 md:p-4">
										<h3 className="font-bold text-base md:text-lg">
											{dest.name}
										</h3>
										<p className="text-gray-600 text-xs md:text-sm flex items-center">
											<span className="mr-1">📍</span> {dest.location}
										</p>
										<div className="flex justify-between items-center mt-1 md:mt-2">
											<div className="flex items-center">
												<span className="text-yellow-500">★</span>
												<span className="text-xs md:text-sm ml-1">
													{dest.rating}
												</span>
											</div>
											<div className="flex space-x-1">
												{dest.tags.slice(0, 2).map((tag) => (
													<span
														key={tag}
														className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600"
													>
														{tag}
													</span>
												))}
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}

				{}
				<div className="mb-6 md:mb-10 relative" ref={carouselRef}>
					<h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-800 flex items-center">
						<span className="mr-2">✨</span> Featured Destinations
					</h2>
					<div className="relative rounded-xl overflow-hidden shadow-xl">
						<div className="relative h-[250px] md:h-[350px] lg:h-[400px] w-full overflow-hidden">
							{featuredDestinations.map((dest, index) => (
								<motion.div
									key={dest.id}
									className="absolute inset-0"
									initial={{ opacity: 0 }}
									animate={{ opacity: index === currentSlide ? 1 : 0 }}
									transition={{ duration: 0.5 }}
									style={{ zIndex: index === currentSlide ? 1 : 0 }}
								>
									<div
										className="h-full w-full bg-cover bg-center transition-transform duration-7000 ease-out"
										style={{
											backgroundImage: `url(${dest.imageUrl})`,
											transform:
												index === currentSlide ? "scale(1.05)" : "scale(1)",
										}}
									></div>

									{}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

									{}
									<div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
										<motion.div
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.2 }}
											className="flex items-center space-x-2 mb-1"
										>
											<span className="px-2 py-0.5 md:py-1 bg-orange-500 rounded-full text-xs font-bold">
												Featured
											</span>
											<div className="flex items-center">
												<span className="text-yellow-400">★</span>
												<span className="text-xs md:text-sm ml-1">
													{dest.rating}
												</span>
											</div>
										</motion.div>

										<motion.h3
											className="text-xl md:text-2xl lg:text-3xl font-bold mb-1"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.3 }}
										>
											{dest.name}
										</motion.h3>

										<motion.p
											className="text-sm md:text-lg mb-1 md:mb-2 flex items-center flex-wrap"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.4 }}
										>
											<span className="mr-1">📍</span> {dest.location}
											{dest.price && (
												<span className="ml-3 text-xs md:text-sm bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
													From {formatPrice(dest.price)}
												</span>
											)}
										</motion.p>

										<motion.p
											className="hidden md:block text-sm lg:text-base text-white/90 max-w-2xl"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.5 }}
										>
											{dest.description}
										</motion.p>

										<motion.div
											className="flex flex-wrap mt-2 md:mt-4 gap-1 md:gap-2"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.6 }}
										>
											{dest.tags.map((tag) => (
												<span
													key={tag}
													className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full"
												>
													{tag}
												</span>
											))}
										</motion.div>

										<motion.div
											className="flex mt-3 md:mt-4 space-x-2 md:space-x-3"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.7 }}
										>
											<button
												className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 transition-colors shadow-md hover:shadow-lg text-xs md:text-sm font-medium"
												onClick={() => selectDestination(dest)}
											>
												Explore Details
											</button>
											<button
												className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors shadow-md ${
													favorites.includes(dest.id)
														? "bg-red-500 text-white"
														: "bg-white/30 backdrop-blur-sm text-white hover:bg-white/50"
												}`}
												onClick={() => toggleFavorite(dest.id)}
											>
												{favorites.includes(dest.id) ? "❤️" : "🤍"}
											</button>
										</motion.div>
									</div>
								</motion.div>
							))}
						</div>

						{}
						<div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex justify-center space-x-1 md:space-x-2">
							{featuredDestinations.map((_, index) => (
								<button
									key={`indicator-${index}`}
									onClick={() => setCurrentSlide(index)}
									className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
										index === currentSlide
											? "bg-white w-3 md:w-4"
											: "bg-white/50 hover:bg-white/70"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								></button>
							))}
						</div>

						{}
						<button
							onClick={prevSlide}
							className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-colors"
							aria-label="Previous slide"
						>
							←
						</button>
						<button
							onClick={nextSlide}
							className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-colors"
							aria-label="Next slide"
						>
							→
						</button>
					</div>
				</div>

				{}
				<div className="mb-6 md:mb-10">
					<div className="flex justify-between items-center mb-3 md:mb-4">
						<h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
							<span className="mr-2">🌍</span>
							{activeCategory
								? `${
										activeCategory.charAt(0).toUpperCase() +
										activeCategory.slice(1)
								  } Destinations`
								: "All Destinations"}
						</h2>
						<div className="text-xs md:text-sm text-gray-500">
							{filteredDestinations.length} destination
							{filteredDestinations.length !== 1 ? "s" : ""}
						</div>
					</div>

					{filteredDestinations.length === 0 ? (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-white rounded-lg p-6 md:p-8 text-center shadow-md"
						>
							<div className="text-4xl md:text-5xl mb-3 md:mb-4">🔍</div>
							<p className="text-gray-500 mb-4 text-sm md:text-base">
								No destinations found matching your criteria.
							</p>
							<button
								onClick={() => {
									setSearchQuery("");
									setSelectedTags([]);
									setActiveCategory(null);
								}}
								className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-full hover:from-cyan-700 hover:to-blue-800 transition-colors shadow-md text-sm"
							>
								Clear filters
							</button>
						</motion.div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{filteredDestinations.map((dest) => (
								<motion.div
									id={`dest-${dest.id}`}
									key={dest.id}
									className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group relative"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-100px" }}
									transition={{ duration: 0.5 }}
									whileHover={{ y: -5 }}
								>
									<div className="relative">
										<div
											className="h-40 md:h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
											style={{
												backgroundImage: `url(${dest.imageUrl})`,
											}}
										></div>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

										{}
										{dest.price && (
											<div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-bold text-cyan-800 shadow-md">
												{formatPrice(dest.price)}
											</div>
										)}

										{}
										<div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
											<div className="flex flex-wrap gap-1 justify-end">
												{dest.tags.slice(0, 1).map((tag) => (
													<span
														key={`${dest.id}-${tag}`}
														className="px-2 py-0.5 text-xs bg-white/90 backdrop-blur-sm rounded-full text-gray-800 shadow-sm"
													>
														{tag}
													</span>
												))}
											</div>

											{}
											<div className="px-2 py-1 bg-orange-500 rounded-full text-white text-xs font-bold flex items-center">
												<span className="mr-1">★</span>
												{dest.rating}
											</div>
										</div>

										{}
										<div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
											<button
												onClick={() => selectDestination(dest)}
												className="px-3 py-1 bg-white rounded-full text-xs font-medium text-cyan-800 shadow-md hover:bg-cyan-50 transition-colors"
											>
												View Details
											</button>
										</div>
									</div>

									<div className="p-3 md:p-4">
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-bold text-base md:text-lg">
													{dest.name}
												</h3>
												<p className="text-gray-600 text-xs md:text-sm flex items-center">
													<span className="mr-1">📍</span> {dest.location}
												</p>
											</div>
											<button
												onClick={() => toggleFavorite(dest.id)}
												className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${
													favorites.includes(dest.id)
														? "bg-red-100 text-red-500"
														: "text-gray-400 hover:text-red-500 hover:bg-red-50"
												}`}
												aria-label={`${
													favorites.includes(dest.id) ? "Remove from" : "Add to"
												} favorites`}
											>
												<motion.span
													animate={
														favorites.includes(dest.id)
															? { scale: [1, 1.2, 1] }
															: {}
													}
													transition={{ duration: 0.3 }}
												>
													{favorites.includes(dest.id) ? "❤️" : "🤍"}
												</motion.span>
											</button>
										</div>

										<p className="text-gray-700 text-xs md:text-sm my-2 line-clamp-2">
											{dest.description}
										</p>

										{}
										<div className="flex flex-wrap gap-1 mt-1 md:mt-2 mb-2 md:mb-3">
											{dest.tags.slice(0, 3).map((tag) => (
												<span
													key={tag}
													className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600"
												>
													{tag}
												</span>
											))}
											{dest.tags.length > 3 && (
												<span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600">
													+{dest.tags.length - 3}
												</span>
											)}
										</div>

										<button
											onClick={() => selectDestination(dest)}
											className="text-cyan-600 hover:text-cyan-800 text-xs md:text-sm font-medium transition-colors flex items-center"
										>
											Learn more
											<span className="ml-1">→</span>
										</button>
									</div>
								</motion.div>
							))}
						</div>
					)}
				</div>

				{}
				<div className="mb-6 md:mb-10">
					<div className="relative rounded-xl overflow-hidden">
						<div
							className="h-48 md:h-64 bg-cover bg-center"
							style={{
								backgroundImage:
									"url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1)",
							}}
						></div>
						<div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-blue-700/40"></div>
						<div className="absolute inset-0 flex items-center">
							<div className="p-4 md:p-6 lg:p-10 max-w-xl">
								<h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-4">
									Ready for your next adventure?
								</h2>
								<p className="text-white/90 text-sm md:text-base mb-4 md:mb-6">
									Sign up now to save your favorite destinations and get
									personalized travel recommendations.
								</p>
								{!isLoggedIn && (
									<button
										onClick={() => setShowLoginModal(true)}
										className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white text-sm md:text-base font-medium hover:from-orange-600 hover:to-orange-700 transition-colors shadow-lg hover:shadow-xl"
									>
										Get Started
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			{}
			<footer className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white py-8 md:py-10">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
						<div>
							<h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center">
								<span className="mr-2">✈️</span> TravelDiscover
							</h3>
							<p className="text-white/80 text-sm mb-4">
								Discover your next adventure with our curated selection of
								amazing destinations around the world.
							</p>
							<div className="flex space-x-4">
								<a
									href="#"
									className="text-white hover:text-orange-300 transition-colors"
								>
									<span className="sr-only">Facebook</span>
									📱
								</a>
								<a
									href="#"
									className="text-white hover:text-orange-300 transition-colors"
								>
									<span className="sr-only">Instagram</span>
									📸
								</a>
								<a
									href="#"
									className="text-white hover:text-orange-300 transition-colors"
								>
									<span className="sr-only">Twitter</span>
									🐦
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">
								Quick Links
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-white/80 hover:text-white transition-colors text-sm"
									>
										About Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-white/80 hover:text-white transition-colors text-sm"
									>
										Contact
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-white/80 hover:text-white transition-colors text-sm"
									>
										FAQ
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-white/80 hover:text-white transition-colors text-sm"
									>
										Privacy Policy
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">
								Newsletter
							</h3>
							<p className="text-white/80 text-sm mb-3 md:mb-4">
								Subscribe to get travel inspiration and special offers.
							</p>
							<form className="flex">
								<input
									type="email"
									placeholder="Your email"
									className="flex-grow rounded-l-lg px-3 md:px-4 py-2 text-gray-800 bg-white focus:outline-none border-2 border-transparent focus:border-cyan-300"
								/>
								<button
									type="submit"
									className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-r-lg px-3 md:px-4 py-2 text-white text-sm hover:from-orange-600 hover:to-orange-700 transition-colors"
								>
									Subscribe
								</button>
							</form>
						</div>
					</div>

					<div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20 text-center text-white/60 text-xs md:text-sm">
						<p>© 2025 TravelDiscover. All rights reserved.</p>
					</div>
				</div>
			</footer>

			{}
			<AnimatePresence>
				{showLoginModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
						onClick={() => setShowLoginModal(false)}
					>
						<motion.div
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-5">
								<h3 className="text-xl font-bold text-gray-800">
									Welcome to TravelDiscover
								</h3>
								<button
									onClick={() => setShowLoginModal(false)}
									className="text-gray-500 hover:text-gray-700 transition-colors"
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
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="text-center mb-6">
								<p className="text-gray-600 text-sm">
									Sign in to save your favorite destinations and get
									personalized recommendations
								</p>
							</div>

							{loginError && (
								<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
									{loginError}
								</div>
							)}

							<form onSubmit={handleLogin}>
								<div className="mb-4">
									<label
										className="block text-gray-700 text-sm font-medium mb-2"
										htmlFor="email"
									>
										Email Address
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg
												className="w-5 h-5 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<input
											id="email"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="your.email@example.com"
											className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
										/>
									</div>
								</div>

								<div className="mb-6">
									<div className="flex justify-between items-center mb-2">
										<label
											className="block text-gray-700 text-sm font-medium"
											htmlFor="password"
										>
											Password
										</label>
										<a
											href="#"
											className="text-xs text-cyan-600 hover:text-cyan-800"
										>
											Forgot password?
										</a>
									</div>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg
												className="w-5 h-5 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
												/>
											</svg>
										</div>
										<input
											id="password"
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="••••••••"
											className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
										/>
									</div>
								</div>

								<div className="flex items-center mb-6">
									<input
										id="remember"
										type="checkbox"
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
										className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
									/>
									<label
										htmlFor="remember"
										className="ml-2 block text-gray-700 text-sm"
									>
										Remember me
									</label>
								</div>

								<button
									type="submit"
									className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium hover:from-cyan-700 hover:to-blue-800 transition-colors shadow-md text-sm"
								>
									Sign in
								</button>

								<div className="mt-6 flex items-center justify-between">
									<hr className="w-full border-gray-200" />
									<span className="px-3 text-xs text-gray-500 bg-white">
										or continue with
									</span>
									<hr className="w-full border-gray-200" />
								</div>

								<div className="mt-6 grid grid-cols-3 gap-3">
									<button
										type="button"
										className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
									>
										<svg
											className="w-5 h-5"
											viewBox="0 0 48 48"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
												fill="#4285F4"
											/>
											<path
												d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
												fill="#34A853"
											/>
											<path
												d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
												fill="#FBBC04"
											/>
											<path
												d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
												fill="#EA4335"
											/>
										</svg>
									</button>
									<button
										type="button"
										className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
									>
										<svg
											className="w-5 h-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
												fill="#1877F2"
											/>
										</svg>
									</button>
									<button
										type="button"
										className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
									>
										<svg
											className="w-5 h-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M22.1623 5.65593C21.3989 5.99362 20.5893 6.2154 19.7603 6.31393C20.634 5.79136 21.288 4.96894 21.6003 3.99993C20.7803 4.48793 19.8813 4.82993 18.9443 5.01493C18.3149 4.34151 17.4807 3.89489 16.5713 3.74451C15.6618 3.59413 14.7282 3.74842 13.9156 4.18338C13.1029 4.61834 12.4567 5.30961 12.0774 6.14972C11.6981 6.98983 11.607 7.93171 11.8183 8.82893C10.1554 8.74558 8.52863 8.31345 7.04358 7.56059C5.55854 6.80773 4.24842 5.75097 3.1983 4.45893C2.82659 5.09738 2.63125 5.82315 2.6323 6.56193C2.6323 8.01193 3.3703 9.29293 4.4923 10.0429C3.82831 10.022 3.17893 9.84271 2.5983 9.51993V9.57193C2.5985 10.5376 2.93267 11.4735 3.54414 12.221C4.15562 12.9684 5.00678 13.4814 5.9533 13.6729C5.33691 13.84 4.6906 13.8646 4.0653 13.7449C4.33874 14.5762 4.85412 15.3031 5.55089 15.824C6.24767 16.3449 7.09501 16.6337 7.9703 16.6499C7.10278 17.3313 6.10947 17.8349 5.04718 18.1321C3.98488 18.4293 2.87442 18.5142 1.7793 18.3819C3.69099 19.6114 5.91639 20.264 8.1893 20.2619C15.8823 20.2619 20.0893 13.8889 20.0893 8.36193C20.0893 8.18193 20.0843 7.99993 20.0763 7.82193C20.8952 7.23009 21.6019 6.49695 22.1633 5.65693L22.1623 5.65593Z"
												fill="#1DA1F2"
											/>
										</svg>
									</button>
								</div>

								<div className="mt-6 text-center text-sm text-gray-600">
									<p>
										Don't have an account?{" "}
										<button
											type="button"
											className="text-cyan-600 hover:text-cyan-800 font-medium"
										>
											Sign up
										</button>
									</p>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{showLocationPrompt && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.9 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.9 }}
							className="bg-white rounded-xl shadow-xl p-5 max-w-md m-4"
						>
							<div className="text-center">
								<div className="w-14 h-14 mx-auto mb-3 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-xl">
									📍
								</div>
								<h3 className="text-lg font-bold mb-2">Location Access</h3>
								<p className="text-gray-600 text-sm mb-5">
									We need your location to find nearby destinations. Please
									allow location access in your browser.
								</p>
								<div className="flex justify-center space-x-3">
									<button
										onClick={() => setShowLocationPrompt(false)}
										className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
									>
										Cancel
									</button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{showDetailModal && selectedDestination && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-6 overflow-y-auto"
						onClick={() => setShowDetailModal(false)}
					>
						<motion.div
							initial={{ scale: 0.95, y: 20, opacity: 0 }}
							animate={{ scale: 1, y: 0, opacity: 1 }}
							exit={{ scale: 0.95, y: 20, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col"
							onClick={(e) => e.stopPropagation()}
						>
							{}
							<div className="relative">
								<div className="relative h-56 md:h-64 lg:h-80">
									{}
									<div
										className="absolute inset-0 bg-cover bg-center"
										style={{
											backgroundImage: `url(${
												selectedDestination.galleryImages?.[activeImageIndex] ||
												selectedDestination.imageUrl
											})`,
										}}
									></div>

									{}
									{selectedDestination.galleryImages &&
										selectedDestination.galleryImages.length > 1 && (
											<>
												<button
													onClick={(e) => {
														e.stopPropagation();
														setActiveImageIndex((prev) =>
															prev === 0
																? selectedDestination.galleryImages!.length - 1
																: prev - 1
														);
													}}
													className="absolute left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-colors z-10"
												>
													←
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														setActiveImageIndex((prev) =>
															prev ===
															selectedDestination.galleryImages!.length - 1
																? 0
																: prev + 1
														);
													}}
													className="absolute right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-colors z-10"
												>
													→
												</button>

												{}
												<div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
													{selectedDestination.galleryImages.map((_, idx) => (
														<button
															key={`indicator-${idx}`}
															onClick={() => setActiveImageIndex(idx)}
															className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
																idx === activeImageIndex
																	? "bg-white w-3 md:w-4"
																	: "bg-white/50 hover:bg-white/70"
															}`}
														></button>
													))}
												</div>
											</>
										)}

									{}
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

									<div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
										<div className="flex justify-between items-start">
											<div>
												<h2 className="text-xl md:text-2xl font-bold">
													{selectedDestination.name}
												</h2>
												<p className="flex items-center text-sm">
													<span className="mr-1">📍</span>{" "}
													{selectedDestination.location}
												</p>
											</div>
											<div className="flex flex-col items-end">
												<div className="flex items-center bg-orange-500 px-2 py-1 rounded-full text-xs md:text-sm">
													<span className="mr-1">★</span>
													{selectedDestination.rating}
												</div>
												{selectedDestination.price && (
													<div className="mt-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
														From {formatPrice(selectedDestination.price)}
													</div>
												)}
											</div>
										</div>
									</div>

									{}
									<button
										onClick={() => setShowDetailModal(false)}
										className="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-colors"
									>
										✕
									</button>

									{}
									<button
										onClick={() => toggleFavorite(selectedDestination.id)}
										className={`absolute top-2 left-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors ${
											favorites.includes(selectedDestination.id)
												? "bg-red-500 text-white"
												: "bg-white/30 backdrop-blur-sm text-white hover:bg-white/50"
										}`}
									>
										{favorites.includes(selectedDestination.id) ? "❤️" : "🤍"}
									</button>
								</div>
							</div>

							{}
							<div className="flex-grow overflow-y-auto p-3 md:p-4">
								{}
								<div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
									{selectedDestination.tags.map((tag) => (
										<span
											key={tag}
											className="px-2 py-1 bg-gray-100 rounded-full text-xs md:text-sm text-gray-700"
										>
											{tag}
										</span>
									))}
								</div>

								{}
								<div className="mb-4 md:mb-6">
									<h3 className="text-base md:text-lg font-semibold mb-1.5 md:mb-2">
										About
									</h3>
									<p className="text-gray-700 text-sm md:text-base">
										{selectedDestination.longDescription ||
											selectedDestination.description}
									</p>
								</div>

								{}
								{selectedDestination.highlights && (
									<div className="mb-4 md:mb-6">
										<h3 className="text-base md:text-lg font-semibold mb-1.5 md:mb-2">
											Highlights
										</h3>
										<ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{selectedDestination.highlights.map((highlight, idx) => (
												<li
													key={idx}
													className="flex items-start text-sm md:text-base"
												>
													<span className="text-cyan-600 mr-2">✓</span>
													<span>{highlight}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{}
								<div className="mb-4 md:mb-6">
									<h3 className="text-base md:text-lg font-semibold mb-1.5 md:mb-2">
										Location
									</h3>
									<div className="h-36 md:h-48 bg-cyan-100 rounded-lg overflow-hidden relative">
										<div
											className="w-full h-full bg-cover bg-center"
											style={{
												backgroundImage: `url(https://images.unsplash.com/photo-1524661135-423995f22d0b)`,
												backgroundSize: "cover",
												backgroundPosition: "center",
												opacity: 0.7,
											}}
										></div>
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg">
												📍
											</div>
										</div>
									</div>
								</div>
							</div>

							{}
							<div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
								<div className="flex justify-between items-center">
									{selectedDestination.price && (
										<div>
											<p className="text-gray-500 text-xs md:text-sm">
												Price starts from
											</p>
											<p className="text-lg md:text-xl font-bold text-cyan-700">
												{formatPrice(selectedDestination.price)}
											</p>
										</div>
									)}
									<div className="flex space-x-2">
										<button
											onClick={() => toggleFavorite(selectedDestination.id)}
											className={`px-3 md:px-4 py-2 rounded-lg flex items-center text-xs md:text-sm transition-colors ${
												favorites.includes(selectedDestination.id)
													? "bg-red-100 text-red-500"
													: "bg-gray-200 text-gray-700 hover:bg-gray-300"
											}`}
										>
											{favorites.includes(selectedDestination.id)
												? "❤️ Saved"
												: "🤍 Save"}
										</button>
										<button className="px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-xs md:text-sm hover:from-cyan-700 hover:to-blue-800 transition-colors shadow-md">
											Book Now
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			{isClient && scrollY > 500 && (
				<button
					className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg flex items-center justify-center hover:from-cyan-700 hover:to-blue-800 transition-colors z-10"
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					aria-label="Back to top"
				>
					↑
				</button>
			)}

			{}
			<style jsx global>{`
				.hide-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}
				button,
				a {
					cursor: pointer;
				}
			`}</style>
		</div>
	);
};

export default TravelSite;
