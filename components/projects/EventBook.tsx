'use client'
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

type EventType =
	| "Musical Concert"
	| "Sports Event"
	| "Technology Conference"
	| "Movie Screening"
	| "Art Exhibition";

interface Event {
	id: number;
	title: string;
	description: string;
	type: EventType;
	performer: string;
	venue: string;
	date: Date;
	price: number;
	image: string;
	status?: "Almost full" | "Going fast" | null;
}

// Mock events data (could be fetched from an API in production)
const mockEvents: Event[] = [
	{
		id: 1,
		title: "Taylor Swift: Eras Tour",
		description:
			"Experience the musical journey through Taylor Swift's eras in this spectacular concert event.",
		type: "Musical Concert",
		performer: "Taylor Swift",
		venue: "Madison Square Garden, New York",
		date: new Date(2025, 4, 25),
		price: 199.99,
		image:
			"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		status: "Almost full",
	},
	{
		id: 2,
		title: "NBA Finals Game 3",
		description:
			"Watch the best basketball teams battle it out in the championship finals.",
		type: "Sports Event",
		performer: "Lakers vs. Celtics",
		venue: "Crypto.com Arena, Los Angeles",
		date: new Date(2025, 5, 10),
		price: 350.0,
		image:
			"https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		status: "Going fast",
	},
	{
		id: 3,
		title: "TechCon 2025",
		description:
			"The premier technology conference showcasing the latest innovations in AI and robotics.",
		type: "Technology Conference",
		performer: "Various Tech Leaders",
		venue: "Moscone Center, San Francisco",
		date: new Date(2025, 6, 15),
		price: 699.0,
		image:
			"https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 4,
		title: "Wolverine & Deadpool",
		description:
			"Special premiere screening of the new Wolverine and Deadpool crossover movie.",
		type: "Movie Screening",
		performer: "Starring Hugh Jackman & Ryan Reynolds",
		venue: "AMC Empire 25, New York",
		date: new Date(2025, 4, 30),
		price: 25.0,
		image:
			"https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		status: "Almost full",
	},
	{
		id: 5,
		title: "Modern Art Exhibition",
		description:
			"Explore contemporary masterpieces from renowned artists around the world.",
		type: "Art Exhibition",
		performer: "Various Artists",
		venue: "Metropolitan Museum of Art, New York",
		date: new Date(2025, 5, 5),
		price: 30.0,
		image:
			"https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 6,
		title: "Beyoncé World Tour",
		description:
			"The legendary performer returns with her spectacular new show and greatest hits.",
		type: "Musical Concert",
		performer: "Beyoncé",
		venue: "Wembley Stadium, London",
		date: new Date(2025, 7, 12),
		price: 250.0,
		image:
			"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		status: "Going fast",
	},
	{
		id: 7,
		title: "Formula 1 Grand Prix",
		description:
			"Witness the fastest cars and drivers compete in this thrilling motorsport event.",
		type: "Sports Event",
		performer: "Various Racing Teams",
		venue: "Circuit of the Americas, Austin",
		date: new Date(2025, 9, 24),
		price: 400.0,
		image:
			"https://thumbs.dreamstime.com/b/barcelona-spain-%C3%A2%E2%82%AC-february-kimi-raikkonen-formula-one-test-days-celebrates-circuit-barcelona-catalunya-formula-110966098.jpg",
	},
	{
		id: 8,
		title: "Oppenheimer IMAX Experience",
		description:
			"Special re-release of Christopher Nolan's epic biographical thriller.",
		type: "Movie Screening",
		performer: "Starring Cillian Murphy",
		venue: "IMAX Lincoln Square, New York",
		date: new Date(2025, 5, 15),
		price: 35.0,
		image:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 9,
		title: "Web Summit 2025",
		description:
			"The world's largest technology conference with keynotes from industry leaders.",
		type: "Technology Conference",
		performer: "Global Tech CEOs",
		venue: "Lisbon Exhibition Center, Portugal",
		date: new Date(2025, 10, 5),
		price: 850.0,
		image:
			"https://qatar.websummit.com/wp-media/2024/11/Centre-Stage-Opening-Night-Welcome-to-Web-Summit-Qatar-aspect-ratio-1723-1041.jpg",
	},
	{
		id: 10,
		title: "Coldplay: Music of the Spheres",
		description:
			"An unforgettable audio-visual experience with one of the world's biggest bands.",
		type: "Musical Concert",
		performer: "Coldplay",
		venue: "Rose Bowl Stadium, Pasadena",
		date: new Date(2025, 6, 28),
		price: 175.0,
		image:
			"https://images.unsplash.com/photo-1499364615650-ec38552f4f34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
	},
];

const EventBookingApp: React.FC = () => {
	// State management
	const [events] = useState<Event[]>(mockEvents);
	const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
	const [favorites, setFavorites] = useState<Set<number>>(() => {
		// Load favorites from localStorage if available
		const savedFavorites = localStorage.getItem("eventbook_favorites");
		return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
	});
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedType, setSelectedType] = useState<EventType | "All">("All");
	const [selectedVenue, setSelectedVenue] = useState<string>("All");
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const [showEventDetails, setShowEventDetails] = useState<number | null>(null);
	const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [searchDate, setSearchDate] = useState<Date | null>(null);
	const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(
		new Date()
	);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [ticketQuantity, setTicketQuantity] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
	const [user, setUser] = useState<{ name: string; email: string } | null>(
		null
	);
	const [viewType, setViewType] = useState<"grid" | "list">(
		windowWidth < 1000 ? "list" : "grid"
	);
	const [isPriceFilterOpen, setIsPriceFilterOpen] = useState<boolean>(false);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

	// Save favorites to localStorage when they change
	useEffect(() => {
		localStorage.setItem(
			"eventbook_favorites",
			JSON.stringify(Array.from(favorites))
		);
	}, [favorites]);

	// Handle window resize
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			setWindowWidth(width);
			if (width < 1000 && viewType === "grid") {
				setViewType("list");
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [viewType]);

	// Simulate data fetching for production-ready app
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// In a real app, this would be an API call
				// const response = await fetch('/api/events');
				// const data = await response.json();
				// setEvents(data);

				// Simulate network delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				setIsLoading(false);
			} catch (err) {
				setIsLoading(false);
				setError("Failed to fetch events. Please try again later.");
				console.error("Error fetching events:", err);
			}
		};

		fetchEvents();
	}, []);

	// Filter events based on user selections
	useEffect(() => {
		let result = [...events];

		// Apply search query filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(event) =>
					event.title.toLowerCase().includes(query) ||
					event.performer.toLowerCase().includes(query) ||
					event.venue.toLowerCase().includes(query) ||
					event.description.toLowerCase().includes(query)
			);
		}

		// Apply date filters
		if (selectedDate) {
			result = result.filter(
				(event) =>
					event.date.getFullYear() === selectedDate.getFullYear() &&
					event.date.getMonth() === selectedDate.getMonth() &&
					event.date.getDate() === selectedDate.getDate()
			);
		}

		if (searchDate) {
			result = result.filter(
				(event) =>
					event.date.getFullYear() === searchDate.getFullYear() &&
					event.date.getMonth() === searchDate.getMonth() &&
					event.date.getDate() === searchDate.getDate()
			);
		}

		// Apply type filter
		if (selectedType !== "All") {
			result = result.filter((event) => event.type === selectedType);
		}

		// Apply venue filter
		if (selectedVenue !== "All") {
			result = result.filter((event) => event.venue.includes(selectedVenue));
		}

		// Apply price range filter
		result = result.filter(
			(event) => event.price >= priceRange[0] && event.price <= priceRange[1]
		);

		// Apply favorites filter
		if (showFavoritesOnly) {
			result = result.filter((event) => favorites.has(event.id));
		}

		setFilteredEvents(result);
	}, [
		selectedDate,
		selectedType,
		selectedVenue,
		showFavoritesOnly,
		favorites,
		events,
		searchQuery,
		searchDate,
		priceRange,
	]);

	// Toggle event favorite status
	const toggleFavorite = (eventId: number, e: React.MouseEvent) => {
		e.stopPropagation();
		const newFavorites = new Set(favorites);

		if (newFavorites.has(eventId)) {
			newFavorites.delete(eventId);
		} else {
			newFavorites.add(eventId);
		}

		setFavorites(newFavorites);
	};

	// Get unique venues for filter dropdown
	const getUniqueVenues = (): string[] => {
		const venues = events.map((event) => event.venue.split(",")[0].trim());
		return ["All", ...Array.from(new Set(venues))];
	};

	// Format date for display
	const formatDate = (date: Date): string => {
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	// Format price for display
	const formatPrice = (price: number): string => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price);
	};

	// Format time for display
	const formatTime = (date: Date): string => {
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});
	};

	// Calendar helper functions
	const daysInMonth = (year: number, month: number): number =>
		new Date(year, month + 1, 0).getDate();
	const firstDayOfMonth = (year: number, month: number): number =>
		new Date(year, month, 1).getDay();

	// Generate calendar days
	const generateCalendar = () => {
		const year = currentCalendarDate.getFullYear();
		const month = currentCalendarDate.getMonth();
		const totalDays = daysInMonth(year, month);
		const firstDay = firstDayOfMonth(year, month);

		const days: (number | null)[] = Array(firstDay)
			.fill(null)
			.concat(Array.from({ length: totalDays }, (_, i) => i + 1));

		return days;
	};

	// Check if a date has events
	const hasEventsOnDate = (day: number): boolean => {
		const dateStr = new Date(
			currentCalendarDate.getFullYear(),
			currentCalendarDate.getMonth(),
			day
		);
		return events.some(
			(event) =>
				event.date.getFullYear() === dateStr.getFullYear() &&
				event.date.getMonth() === dateStr.getMonth() &&
				event.date.getDate() === dateStr.getDate()
		);
	};

	// Select a date from the calendar
	const selectCalendarDate = (day: number): void => {
		const selected = new Date(
			currentCalendarDate.getFullYear(),
			currentCalendarDate.getMonth(),
			day
		);
		setSearchDate(selected);
	};

	// Calendar navigation
	const prevMonth = (): void => {
		setCurrentCalendarDate(
			new Date(
				currentCalendarDate.getFullYear(),
				currentCalendarDate.getMonth() - 1
			)
		);
	};

	const nextMonth = (): void => {
		setCurrentCalendarDate(
			new Date(
				currentCalendarDate.getFullYear(),
				currentCalendarDate.getMonth() + 1
			)
		);
	};

	// Check if mobile view
	const isMobileView = windowWidth < 1000;

	// Modal management
	const openModal = (event: Event, e: React.MouseEvent): void => {
		e.stopPropagation();
		setSelectedEvent(event);
		setShowModal(true);
		setTicketQuantity(1);
	};

	const closeModal = (): void => {
		setShowModal(false);
		setSelectedEvent(null);
		setTicketQuantity(1);
	};

	// Handle login modal
	const openLoginModal = (): void => {
		setShowLoginModal(true);
	};

	const closeLoginModal = (): void => {
		setShowLoginModal(false);
	};

	// Handle mock login
	const handleLogin = (email: string, password: string): void => {
		// In a production app, this would make an API request
		// Simulating successful login
		setUser({
			name: email.split("@")[0],
			email: email,
		});
		closeLoginModal();
	};

	// Handle logout
	const handleLogout = (): void => {
		setUser(null);
	};

	// Handle booking tickets
	const handleBookTickets = (): void => {
		if (!user) {
			closeModal();
			openLoginModal();
			return;
		}

		if (selectedEvent) {
			// In a production app, this would make an API request to create a booking
			alert(
				`Successfully booked ${ticketQuantity} ticket${
					ticketQuantity > 1 ? "s" : ""
				} for ${selectedEvent.title}! Total: ${formatPrice(
					selectedEvent.price * ticketQuantity
				)}`
			);
			closeModal();
		}
	};

	// Reset all filters
	const resetFilters = (): void => {
		setSelectedType("All");
		setSelectedVenue("All");
		setSelectedDate(null);
		setShowFavoritesOnly(false);
		setSearchQuery("");
		setSearchDate(null);
		setPriceRange([0, 1000]);
	};

	// Login Modal Component
	const LoginModal: React.FC = () => {
		const [email, setEmail] = useState<string>("");
		const [password, setPassword] = useState<string>("");
		const [isSignup, setIsSignup] = useState<boolean>(false);

		if (!showLoginModal) return null;

		return (
			<div
				className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
				role="dialog"
				aria-labelledby="login-modal-title"
			>
				<div className="bg-white rounded-lg p-6 w-full max-w-md">
					<div className="flex justify-between items-center mb-4">
						<h2
							id="login-modal-title"
							className="text-xl font-bold text-gray-800"
						>
							{isSignup ? "Create Account" : "Log In"}
						</h2>
						<button
							onClick={closeLoginModal}
							className="text-gray-500 hover:text-gray-700"
							aria-label="Close login modal"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleLogin(email, password);
						}}
					>
						<div className="mb-4">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full p-2 border rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
							/>
						</div>
						<div className="mb-6">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full p-2 border rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
							/>
						</div>
						<div className="flex flex-col space-y-3">
							<button
								type="submit"
								className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
							>
								{isSignup ? "Sign Up" : "Log In"}
							</button>
							<button
								type="button"
								onClick={() => setIsSignup(!isSignup)}
								className="text-sm text-orange-600 hover:text-orange-800 text-center"
							>
								{isSignup
									? "Already have an account? Log in"
									: "Don't have an account? Sign up"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Booking Modal Component
	const BookingModal: React.FC = () => {
		if (!showModal || !selectedEvent) return null;

		return (
			<div
				className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
				role="dialog"
				aria-labelledby="modal-title"
			>
				<div className="bg-white rounded-lg p-6 w-full max-w-md">
					<div className="flex justify-between items-center mb-4">
						<h2 id="modal-title" className="text-xl font-bold text-gray-800">
							Book Tickets
						</h2>
						<button
							onClick={closeModal}
							className="text-gray-500 hover:text-gray-700"
							aria-label="Close modal"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					<div className="mb-4">
						<h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
						<p className="text-sm text-gray-600">
							{formatDate(selectedEvent.date)} at{" "}
							{formatTime(selectedEvent.date)}
						</p>
						<p className="text-sm text-gray-600">{selectedEvent.venue}</p>
						<p className="text-sm font-bold mt-2">
							{formatPrice(selectedEvent.price)} per ticket
						</p>
					</div>
					<div className="mb-4">
						<label
							htmlFor="ticket-quantity"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Number of Tickets
						</label>
						<div className="flex items-center">
							<button
								onClick={() =>
									setTicketQuantity(Math.max(1, ticketQuantity - 1))
								}
								className="px-3 py-2 border rounded-l bg-gray-100"
								aria-label="Decrease ticket quantity"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M20 12H4"
									/>
								</svg>
							</button>
							<input
								id="ticket-quantity"
								type="number"
								min="1"
								max="10"
								value={ticketQuantity}
								onChange={(e) =>
									setTicketQuantity(
										Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
									)
								}
								className="w-16 p-2 border-y text-center focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
								aria-describedby="ticket-quantity-desc"
							/>
							<button
								onClick={() =>
									setTicketQuantity(Math.min(10, ticketQuantity + 1))
								}
								className="px-3 py-2 border rounded-r bg-gray-100"
								aria-label="Increase ticket quantity"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 4v16m8-8H4"
									/>
								</svg>
							</button>
						</div>
						<p id="ticket-quantity-desc" className="text-xs text-gray-500 mt-1">
							Maximum 10 tickets per booking
						</p>
					</div>
					<div className="mb-4 p-3 bg-gray-50 rounded-md">
						<div className="flex justify-between mb-1">
							<span>
								Tickets ({ticketQuantity} × {formatPrice(selectedEvent.price)})
							</span>
							<span>{formatPrice(selectedEvent.price * ticketQuantity)}</span>
						</div>
						<div className="flex justify-between mb-1">
							<span>Service Fee</span>
							<span>{formatPrice(ticketQuantity * 10)}</span>
						</div>
						<div className="border-t pt-2 mt-2 font-bold flex justify-between">
							<span>Total</span>
							<span>
								{formatPrice(
									selectedEvent.price * ticketQuantity + ticketQuantity * 10
								)}
							</span>
						</div>
					</div>
					<button
						onClick={handleBookTickets}
						className="w-full py-3 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-colors"
					>
						{user ? "Confirm Booking" : "Log in to Book"}
					</button>
					<p className="text-xs text-gray-500 mt-3 text-center">
						By completing this booking you agree to our{" "}
						<a href="#" className="text-orange-600 hover:underline">
							Terms of Service
						</a>{" "}
						and{" "}
						<a href="#" className="text-orange-600 hover:underline">
							Privacy Policy
						</a>
					</p>
				</div>
			</div>
		);
	};

	// Render Grid View
	const renderEventbriteGridView = () => {
		if (isLoading) {
			return (
				<div className="py-12 text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
					<p className="text-gray-600">Loading events...</p>
				</div>
			);
		}

		if (error) {
			return (
				<div className="py-10 text-center">
					<div className="bg-red-50 p-4 rounded-lg inline-block">
						<p className="text-red-600">{error}</p>
						<button
							className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
							onClick={() => window.location.reload()}
						>
							Try Again
						</button>
					</div>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{filteredEvents.map((event) => (
					<div
						key={event.id}
						className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-all cursor-pointer border border-gray-200 relative flex flex-col"
						onClick={() =>
							setShowEventDetails(
								showEventDetails === event.id ? null : event.id
							)
						}
					>
						<div className="relative">
							<img
								src={event.image}
								alt={event.title}
								className="w-full h-48 object-cover"
								loading="lazy"
							/>
							{event.status && (
								<div
									className={`absolute top-4 left-0 py-1 px-3 text-xs font-medium ${
										event.status === "Almost full"
											? "bg-purple-600"
											: "bg-red-500"
									} text-white`}
								>
									{event.status}
								</div>
							)}
							<button
								onClick={(e) => toggleFavorite(event.id, e)}
								className="absolute top-3 right-3 bg-white rounded-full p-1 shadow focus:outline-none hover:bg-gray-100"
								aria-label={
									favorites.has(event.id)
										? "Remove from favorites"
										: "Add to favorites"
								}
							>
								{favorites.has(event.id) ? (
									<svg
										className="w-5 h-5 text-orange-500 fill-current"
										viewBox="0 0 24 24"
									>
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
									</svg>
								) : (
									<svg
										className="w-5 h-5 text-gray-400 fill-current"
										viewBox="0 0 24 24"
									>
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
									</svg>
								)}
							</button>
						</div>
						<div className="p-4 flex-grow">
							<div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
								<svg
									className="w-4 h-4 mr-1 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								{formatDate(event.date)} · {formatTime(event.date)}
							</div>
							<h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1">
								{event.title}
							</h3>
							<div className="text-sm text-gray-600 mb-1 flex items-center">
								<svg
									className="w-4 h-4 mr-1 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
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
								{event.venue.split(",")[0]}
							</div>
							<div className="text-sm text-gray-600 mb-2 flex items-center">
								<svg
									className="w-4 h-4 mr-1 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								<span>{event.performer.split(" ")[0]}</span>
							</div>
							<div className="flex items-center text-xs mb-3">
								<span className="bg-gray-100 text-gray-800 rounded-full px-2 py-1">
									{event.type}
								</span>
							</div>
						</div>
						<div className="bg-gray-50 p-4 border-t">
							<div className="flex items-center justify-between">
								<div className="text-sm font-bold">
									{event.price === 0 ? "Free" : formatPrice(event.price)}
								</div>
								<button
									onClick={(e) => openModal(event, e)}
									className="text-sm px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
								>
									Get Tickets
								</button>
							</div>
							{showEventDetails === event.id && (
								<div className="mt-4 pt-4 border-t border-gray-200">
									<p className="text-gray-600 text-sm">{event.description}</p>
									<div className="mt-3 text-sm">
										<div className="mb-1">
											<span className="font-bold">Date & Time:</span>{" "}
											{formatDate(event.date)} at {formatTime(event.date)}
										</div>
										<div className="mb-1">
											<span className="font-bold">Venue:</span> {event.venue}
										</div>
									</div>
									<button
										onClick={(e) => openModal(event, e)}
										className="mt-4 w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors font-medium"
									>
										Book Now
									</button>
								</div>
							)}
						</div>
					</div>
				))}
				{filteredEvents.length === 0 && !isLoading && !error && (
					<div className="col-span-full text-center py-16 text-gray-500">
						<svg
							className="w-12 h-12 mx-auto text-gray-300 mb-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p className="text-lg font-medium">
							No events found matching your criteria.
						</p>
						<button
							onClick={resetFilters}
							className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
						>
							Reset Filters
						</button>
					</div>
				)}
			</div>
		);
	};

	// Render List View
	const renderEventbriteListView = () => {
		if (isLoading) {
			return (
				<div className="py-12 text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
					<p className="text-gray-600">Loading events...</p>
				</div>
			);
		}

		if (error) {
			return (
				<div className="py-10 text-center">
					<div className="bg-red-50 p-4 rounded-lg inline-block">
						<p className="text-red-600">{error}</p>
						<button
							className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
							onClick={() => window.location.reload()}
						>
							Try Again
						</button>
					</div>
				</div>
			);
		}

		return (
			<div className="space-y-4">
				{filteredEvents.length > 0 ? (
					filteredEvents
						.sort((a, b) => a.date.getTime() - b.date.getTime())
						.map((event) => (
							<div
								key={event.id}
								className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
								onClick={() =>
									setShowEventDetails(
										showEventDetails === event.id ? null : event.id
									)
								}
							>
								<div className="flex">
									<div className="relative w-1/3 max-w-xs">
										<img
											src={event.image}
											alt={event.title}
											className="h-full w-full object-cover"
											loading="lazy"
										/>
										{event.status && (
											<div
												className={`absolute top-0 left-0 py-1 px-2 text-xs font-medium ${
													event.status === "Almost full"
														? "bg-purple-600"
														: "bg-red-500"
												} text-white`}
											>
												{event.status}
											</div>
										)}
									</div>
									<div className="w-2/3 p-3">
										<div className="text-xs text-gray-500 mb-1 flex items-center">
											<svg
												className="w-3 h-3 mr-1 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											{formatDate(event.date)}
										</div>
										<h3 className="font-bold line-clamp-1 text-gray-800">
											{event.title}
										</h3>
										<div className="text-xs text-gray-600 mt-1 mb-1 flex items-center">
											<svg
												className="w-3 h-3 mr-1 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
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
											{event.venue.split(",")[0]}
										</div>
										<div className="flex items-center justify-between mt-2">
											<div className="text-sm font-bold">
												{event.price === 0 ? "Free" : formatPrice(event.price)}
											</div>
											<div className="flex items-center space-x-2">
												<button
													onClick={(e) => toggleFavorite(event.id, e)}
													className="focus:outline-none"
													aria-label={
														favorites.has(event.id)
															? "Remove from favorites"
															: "Add to favorites"
													}
												>
													{favorites.has(event.id) ? (
														<svg
															className="w-5 h-5 text-orange-500 fill-current"
															viewBox="0 0 24 24"
														>
															<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
														</svg>
													) : (
														<svg
															className="w-5 h-5 text-gray-400 fill-current"
															viewBox="0 0 24 24"
														>
															<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
														</svg>
													)}
												</button>
												<button
													onClick={(e) => openModal(event, e)}
													className="text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
												>
													Tickets
												</button>
											</div>
										</div>
										{showEventDetails === event.id && (
											<div className="mt-3 pt-2 border-t border-gray-200">
												<p className="text-xs text-gray-600">
													{event.description.substring(0, 100)}...
												</p>
												<button
													onClick={(e) => openModal(event, e)}
													className="mt-2 w-full py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors font-medium"
												>
													Get Tickets
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						))
				) : (
					<div className="text-center py-10 text-gray-500">
						<svg
							className="w-12 h-12 mx-auto text-gray-300 mb-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p className="text-lg font-medium">
							No events found matching your criteria.
						</p>
						<button
							onClick={resetFilters}
							className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
						>
							Reset Filters
						</button>
					</div>
				)}
			</div>
		);
	};

	// Render Calendar View
	const renderCalendarView = () => {
		return (
			<div className="hidden md:block bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
				<div className="flex justify-between items-center mb-4">
					<button
						onClick={prevMonth}
						className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
						aria-label="Previous month"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<h2 className="text-xl font-semibold text-gray-800">
						{currentCalendarDate.toLocaleString("default", {
							month: "long",
							year: "numeric",
						})}
					</h2>
					<button
						onClick={nextMonth}
						className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
						aria-label="Next month"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
				<div className="grid grid-cols-7 gap-1 text-center">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
						<div key={day} className="font-medium text-gray-700 py-1">
							{day}
						</div>
					))}
					{generateCalendar().map((day, index) => {
						const isSelected =
							searchDate &&
							day &&
							searchDate.getFullYear() === currentCalendarDate.getFullYear() &&
							searchDate.getMonth() === currentCalendarDate.getMonth() &&
							searchDate.getDate() === day;

						const isToday =
							day &&
							new Date().getFullYear() === currentCalendarDate.getFullYear() &&
							new Date().getMonth() === currentCalendarDate.getMonth() &&
							new Date().getDate() === day;

						return (
							<div
								key={index}
								className={`p-2 h-16 border ${isToday ? "bg-orange-50" : ""} ${
									day ? "hover:bg-orange-50 cursor-pointer" : "bg-gray-100"
								} ${isSelected ? "bg-orange-100 border-orange-500" : ""} ${
									hasEventsOnDate(day!) ? "relative" : ""
								}`}
								onClick={() => day && selectCalendarDate(day)}
								role={day ? "button" : undefined}
								tabIndex={day ? 0 : -1}
								aria-label={
									day
										? `Select ${new Date(
												currentCalendarDate.getFullYear(),
												currentCalendarDate.getMonth(),
												day
										  ).toLocaleDateString()}`
										: undefined
								}
								onKeyDown={(e) =>
									day && e.key === "Enter" && selectCalendarDate(day)
								}
							>
								{day && (
									<span className={`${isToday ? "font-bold" : ""}`}>{day}</span>
								)}
								{hasEventsOnDate(day!) && (
									<span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
								)}
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	// Render Price Filter Panel
	const renderPriceFilter = () => {
		return (
			<div
				className={`bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200 ${
					isPriceFilterOpen ? "block" : "hidden md:block"
				}`}
			>
				<div className="flex justify-between items-center mb-3">
					<h3 className="font-bold text-gray-800">Price Range</h3>
					<button
						className="md:hidden text-gray-500"
						onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
					>
						{isPriceFilterOpen ? (
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 15l7-7 7 7"
								/>
							</svg>
						) : (
							<svg
								className="w-5 h-5"
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
						)}
					</button>
				</div>
				<div className={`${isPriceFilterOpen ? "block" : "hidden md:block"}`}>
					<div className="flex justify-between mb-2 text-sm text-gray-600">
						<span>{formatPrice(priceRange[0])}</span>
						<span>{formatPrice(priceRange[1])}</span>
					</div>
					<div className="relative mb-4">
						<input
							type="range"
							min="0"
							max="1000"
							step="10"
							value={priceRange[0]}
							onChange={(e) =>
								setPriceRange([parseInt(e.target.value), priceRange[1]])
							}
							className="w-full"
						/>
						<input
							type="range"
							min="0"
							max="1000"
							step="10"
							value={priceRange[1]}
							onChange={(e) =>
								setPriceRange([priceRange[0], parseInt(e.target.value)])
							}
							className="w-full absolute top-0"
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-xs text-gray-600 mb-1">
								Min Price
							</label>
							<input
								type="number"
								min="0"
								max={priceRange[1]}
								value={priceRange[0]}
								onChange={(e) =>
									setPriceRange([
										Math.max(0, parseInt(e.target.value) || 0),
										priceRange[1],
									])
								}
								className="w-full p-1 text-sm border rounded"
							/>
						</div>
						<div>
							<label className="block text-xs text-gray-600 mb-1">
								Max Price
							</label>
							<input
								type="number"
								min={priceRange[0]}
								max="1000"
								value={priceRange[1]}
								onChange={(e) =>
									setPriceRange([
										priceRange[0],
										Math.min(1000, parseInt(e.target.value) || 0),
									])
								}
								className="w-full p-1 text-sm border rounded"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// Render App Navigation Bar
	const renderNavBar = () => {
		return (
			<div className="flex justify-between items-center mb-6 border-b pb-4">
				<div className="flex items-center">
					<svg
						className="w-8 h-8 mr-2 text-orange-600 fill-current"
						viewBox="0 0 60 60"
					>
						<path d="M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 45c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z" />
						<path d="M30 20c0-5.5-4.5-10-10-10v20c5.5 0 10-4.5 10-10z" />
					</svg>
					<h1 className="text-2xl font-bold text-gray-800">Eventbook</h1>
				</div>
				<div className="hidden md:flex space-x-4 items-center">
					<button className="text-gray-600 hover:text-orange-500">
						Browse Events
					</button>
					<button className="text-gray-600 hover:text-orange-500">
						Create Events
					</button>
					<button className="text-gray-600 hover:text-orange-500">
						Help Center
					</button>
					{user ? (
						<div className="relative group">
							<button className="flex items-center space-x-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
								<span>{user.name}</span>
								<svg
									className="w-4 h-4"
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
							</button>
							<div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
								<div className="p-2 border-b">
									<div className="text-sm font-medium">{user.name}</div>
									<div className="text-xs text-gray-500">{user.email}</div>
								</div>
								<div className="p-2">
									<button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded">
										My Tickets
									</button>
									<button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded">
										Account Settings
									</button>
									<button
										onClick={handleLogout}
										className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
									>
										Log Out
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="flex space-x-2">
							<button
								onClick={openLoginModal}
								className="text-gray-600 hover:text-orange-500"
							>
								Log In
							</button>
							<button
								onClick={() => {
									openLoginModal();
									setIsSignup(true);
								}}
								className="px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
							>
								Sign Up
							</button>
						</div>
					)}
				</div>
				<button className="md:hidden">
					<svg
						className="w-6 h-6 text-gray-700"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		);
	};

	// Main render function
	return (
		<>
			<Helmet>
				<title>Eventbook - Find and Book Amazing Events</title>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<meta
					name="description"
					content="Discover and book tickets for the hottest concerts, sports events, conferences, movies, and art exhibitions. Find events near you today."
				/>
				<meta
					name="keywords"
					content="events, tickets, booking, concerts, sports, conferences, movies, exhibitions"
				/>
				<meta
					property="og:title"
					content="Eventbook - Find and Book Amazing Events"
				/>
				<meta
					property="og:description"
					content="Discover and book tickets for the hottest concerts, sports events, conferences, movies, and art exhibitions."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://www.eventbook.com" />
				<meta
					property="og:image"
					content="https://www.eventbook.com/og-image.jpg"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="theme-color" content="#f97316" />
				<link rel="canonical" href="https://www.eventbook.com" />
			</Helmet>

			<div className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
				{renderNavBar()}

				<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-6">
					<div className="flex-1 relative">
						<svg
							className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<input
							type="text"
							placeholder="Search events, artists, venues"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
						/>
					</div>
					<div className="relative">
						<svg
							className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<input
							type="date"
							value={searchDate ? searchDate.toISOString().split("T")[0] : ""}
							onChange={(e) =>
								setSearchDate(e.target.value ? new Date(e.target.value) : null)
							}
							className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
						/>
					</div>
					<button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
						Search
					</button>
				</div>

				<div className="bg-gray-50 rounded-lg mb-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="col-span-1 md:col-span-3 flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-200">
							<div className="flex flex-wrap items-center gap-2">
								<div className="px-3 py-1 bg-white border rounded-full flex items-center space-x-1 text-sm">
									<svg
										className="w-4 h-4 text-gray-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
										/>
									</svg>
									<span>Sort by: Date</span>
								</div>

								<button
									onClick={() =>
										setSelectedType(
											selectedType === "All" ? "Musical Concert" : "All"
										)
									}
									className={`px-3 py-1 rounded-full flex items-center space-x-1 text-sm ${
										selectedType === "Musical Concert"
											? "bg-orange-50 border border-orange-300 text-orange-600"
											: "bg-white border"
									}`}
								>
									<span>Concerts</span>
								</button>

								<button
									onClick={() =>
										setSelectedType(
											selectedType === "All" ? "Sports Event" : "All"
										)
									}
									className={`px-3 py-1 rounded-full flex items-center space-x-1 text-sm ${
										selectedType === "Sports Event"
											? "bg-orange-50 border border-orange-300 text-orange-600"
											: "bg-white border"
									}`}
								>
									<span>Sports</span>
								</button>

								<button
									onClick={() =>
										setSelectedType(
											selectedType === "All" ? "Technology Conference" : "All"
										)
									}
									className={`px-3 py-1 rounded-full flex items-center space-x-1 text-sm ${
										selectedType === "Technology Conference"
											? "bg-orange-50 border border-orange-300 text-orange-600"
											: "bg-white border"
									}`}
								>
									<span>Conferences</span>
								</button>

								<button
									onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
									className={`px-3 py-1 rounded-full flex items-center space-x-1 text-sm ${
										showFavoritesOnly
											? "bg-orange-50 border border-orange-300 text-orange-600"
											: "bg-white border"
									}`}
								>
									<svg
										className={`w-4 h-4 ${
											showFavoritesOnly ? "text-orange-500" : "text-gray-400"
										} fill-current`}
										viewBox="0 0 24 24"
									>
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
									</svg>
									<span>Favorites</span>
								</button>

								<button
									onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
									className="md:hidden px-3 py-1 bg-white border rounded-full flex items-center space-x-1 text-sm"
								>
									<svg
										className="w-4 h-4 text-gray-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
									<span>Price</span>
								</button>
							</div>

							<div className="flex items-center space-x-2">
								<button
									onClick={() => setViewType("grid")}
									className={`p-2 rounded ${
										viewType === "grid"
											? "bg-orange-50 text-orange-600"
											: "text-gray-500"
									}`}
									aria-label="Grid view"
									title="Grid view"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
										/>
									</svg>
								</button>
								<button
									onClick={() => setViewType("list")}
									className={`p-2 rounded ${
										viewType === "list"
											? "bg-orange-50 text-orange-600"
											: "text-gray-500"
									}`}
									aria-label="List view"
									title="List view"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								</button>
								<button
									onClick={resetFilters}
									className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-gray-700 text-sm"
								>
									Reset
								</button>
							</div>
						</div>
					</div>

					<div className="flex flex-col md:flex-row gap-6">
						<div className="md:w-64 space-y-4">
							{renderPriceFilter()}

							<div className="bg-white p-4 rounded-lg shadow-sm hidden md:block border border-gray-200">
								<h3 className="font-bold text-gray-800 mb-3">Location</h3>
								<select
									value={selectedVenue}
									onChange={(e) => setSelectedVenue(e.target.value)}
									className="w-full p-2 border rounded-md text-gray-800 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 mb-4"
								>
									{getUniqueVenues().map((venue) => (
										<option key={venue} value={venue}>
											{venue}
										</option>
									))}
								</select>

								<h3 className="font-bold text-gray-800 mb-3">Event Type</h3>
								{[
									"All",
									"Musical Concert",
									"Sports Event",
									"Technology Conference",
									"Movie Screening",
									"Art Exhibition",
								].map((type) => (
									<div key={type} className="flex items-center space-x-2 mb-2">
										<input
											type="radio"
											id={`type-${type}`}
											name="event-type"
											checked={selectedType === type}
											onChange={() =>
												setSelectedType(type as EventType | "All")
											}
											className="text-orange-500 focus:ring-orange-500"
										/>
										<label htmlFor={`type-${type}`} className="text-gray-700">
											{type}
										</label>
									</div>
								))}
							</div>

							{renderCalendarView()}

							<div className="hidden md:block bg-orange-50 p-4 rounded-lg border border-orange-100">
								<h3 className="font-bold text-gray-800 mb-2">Need Help?</h3>
								<p className="text-sm text-gray-600 mb-3">
									Having trouble finding the perfect event? Our team is here to
									help.
								</p>
								<button className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm">
									Contact Support
								</button>
							</div>
						</div>

						<div className="flex-1">
							<div className="mb-4 flex justify-between items-center">
								<h2 className="font-bold text-xl text-gray-800">
									{filteredEvents.length}{" "}
									{filteredEvents.length === 1 ? "Event" : "Events"} Found
								</h2>
							</div>

							{viewType === "grid" && !isMobileView
								? renderEventbriteGridView()
								: renderEventbriteListView()}

							{/* Pagination (simplified) */}
							{filteredEvents.length > 0 && !isLoading && !error && (
								<div className="mt-8 flex justify-center">
									<div className="flex space-x-1">
										<button className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
											Previous
										</button>
										<button className="px-4 py-2 bg-orange-500 text-white rounded">
											1
										</button>
										<button className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
											2
										</button>
										<button className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
											3
										</button>
										<button className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
											Next
										</button>
									</div>
								</div>
							)}

							{/* Mobile sticky CTA */}
							<div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-center md:hidden z-10">
								<button
									onClick={openLoginModal}
									className="w-full max-w-xs py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
								>
									{user ? "Browse More Events" : "Sign Up for Exclusive Access"}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Newsletter Signup */}
				<div className="bg-orange-50 p-6 rounded-lg mb-12 border border-orange-100">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							Never Miss an Event
						</h2>
						<p className="text-gray-600 mb-4">
							Subscribe to our newsletter and be the first to know about
							upcoming events in your area.
						</p>
						<div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Your email address"
								className="flex-1 p-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
							/>
							<button className="px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
								Subscribe
							</button>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t mt-6 pt-8 pb-12 bg-white">
					<div className="max-w-6xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
							<div>
								<div className="flex items-center mb-4">
									<svg
										className="w-8 h-8 mr-2 text-orange-600 fill-current"
										viewBox="0 0 60 60"
									>
										<path d="M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 45c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z" />
										<path d="M30 20c0-5.5-4.5-10-10-10v20c5.5 0 10-4.5 10-10z" />
									</svg>
									<h2 className="text-xl font-bold text-gray-800">Eventbook</h2>
								</div>
								<p className="text-sm text-gray-600 mb-4">
									Your one-stop platform for discovering and booking amazing
									events around the world.
								</p>
								<div className="flex space-x-4">
									<a href="#" className="text-gray-500 hover:text-orange-500">
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
										</svg>
									</a>
									<a href="#" className="text-gray-500 hover:text-orange-500">
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
										</svg>
									</a>
									<a href="#" className="text-gray-500 hover:text-orange-500">
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
										</svg>
									</a>
								</div>
							</div>
							<div>
								<h3 className="font-bold text-gray-800 mb-4">Company</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											About Us
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Careers
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Blog
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Press
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Gift Cards
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="font-bold text-gray-800 mb-4">Support</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Help Center
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Contact Us
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											FAQs
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Accessibility
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Cookie Settings
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="font-bold text-gray-800 mb-4">Legal</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Terms of Service
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Privacy Policy
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Refund Policy
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Cookie Policy
										</a>
									</li>
									<li>
										<a href="#" className="text-gray-600 hover:text-orange-500">
											Trust & Safety
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center">
							<p className="text-sm text-gray-500 mb-4 md:mb-0">
								© 2025 Eventbook. All rights reserved.
							</p>
							<div className="flex space-x-6">
								<select className="text-sm text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0">
									<option value="en">English</option>
									<option value="es">Español</option>
									<option value="fr">Français</option>
									<option value="de">Deutsch</option>
								</select>
								<select className="text-sm text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0">
									<option value="usd">USD ($)</option>
									<option value="eur">EUR (€)</option>
									<option value="gbp">GBP (£)</option>
									<option value="jpy">JPY (¥)</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<BookingModal />
				<LoginModal />
			</div>
		</>
	);
};

export default EventBookingApp;
