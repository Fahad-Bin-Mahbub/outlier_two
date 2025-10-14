"use client";
import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import {
	MapPin,
	Calendar,
	Search,
	Filter,
	ArrowRight,
	Clock,
	X,
	Navigation,
	ChevronUp,
	ChevronDown,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MOCK_EVENTS = [
	{
		id: "evt-001",
		title: "Tech Innovation Summit 2025",
		description:
			"Join industry leaders to explore cutting-edge technologies shaping our future.",
		date: "2025-05-15T09:00:00",
		endDate: "2025-05-15T17:00:00",
		category: "Technology",
		location: {
			name: "Global Convention Center",
			address: "123 Innovation Ave, San Francisco, CA",
			coordinates: { lat: 37.7749, lng: -122.4194 },
		},
		image:
			"https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop",
		price: "$299",
		attendees: 1240,
		featured: true,
		tags: ["AI", "Blockchain", "Web3", "North America"],
	},

	{
		id: "evt-002",
		title: "European Finance Summit",
		description:
			"Connect with financial experts and discover emerging market trends in Europe.",
		date: "2025-06-10T10:00:00",
		endDate: "2025-06-12T16:00:00",
		category: "Finance",
		location: {
			name: "London Business Center",
			address: "10 Canary Wharf, London, UK",
			coordinates: { lat: 51.5074, lng: -0.1278 },
		},
		image:
			"https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop",
		price: "€450",
		attendees: 875,
		featured: true,
		tags: ["Investing", "Economics", "Markets", "Europe"],
	},

	{
		id: "evt-003",
		title: "Asian Tech Expo",
		description:
			"Explore the latest innovations and technologies from across Asia.",
		date: "2025-04-28T11:00:00",
		endDate: "2025-04-30T18:00:00",
		category: "Technology",
		location: {
			name: "Tokyo International Exhibition Center",
			address: "3-11-1 Ariake, Koto City, Tokyo",
			coordinates: { lat: 35.6762, lng: 139.6503 },
		},
		image:
			"https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?w=800&auto=format&fit=crop",
		price: "¥25000",
		attendees: 3500,
		featured: true,
		tags: ["Innovation", "Robotics", "AI", "Asia"],
	},

	{
		id: "evt-004",
		title: "African Innovation Conference",
		description:
			"Celebrating African entrepreneurs and technological innovations changing the continent.",
		date: "2025-05-20T13:00:00",
		endDate: "2025-05-22T17:00:00",
		category: "Business",
		location: {
			name: "Cape Town Convention Centre",
			address: "Convention Square, 1 Lower Long Street, Cape Town",
			coordinates: { lat: -33.9249, lng: 18.4241 },
		},
		image:
			"https://images.unsplash.com/photo-1489367874814-f5d040621dd8?w=800&auto=format&fit=crop",
		price: "R1500",
		attendees: 1200,
		featured: true,
		tags: ["Entrepreneurship", "Innovation", "Development", "Africa"],
	},

	{
		id: "evt-005",
		title: "Sydney Sustainability Summit",
		description:
			"Explore sustainable solutions and environmental innovations in the Pacific region.",
		date: "2025-06-05T09:00:00",
		endDate: "2025-06-06T17:00:00",
		category: "Environment",
		location: {
			name: "Sydney Convention Centre",
			address: "14 Darling Drive, Sydney NSW 2000",
			coordinates: { lat: -33.8688, lng: 151.2093 },
		},
		image:
			"https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop",
		price: "$250",
		attendees: 850,
		featured: true,
		tags: ["Sustainability", "Climate", "Green Energy", "Oceania"],
	},

	{
		id: "evt-006",
		title: "Rio Cultural Festival",
		description:
			"Experience the vibrant arts, music, and culture of South America.",
		date: "2025-05-01T10:00:00",
		endDate: "2025-05-05T20:00:00",
		category: "Arts",
		location: {
			name: "Copacabana Beach",
			address: "Av. Atlântica, Rio de Janeiro, Brazil",
			coordinates: { lat: -22.9068, lng: -43.1729 },
		},
		image:
			"https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&auto=format&fit=crop",
		price: "R$100",
		attendees: 5000,
		featured: true,
		tags: ["Culture", "Music", "Dance", "South America"],
	},

	{
		id: "evt-007",
		title: "Antarctic Research Symposium",
		description:
			"Join leading scientists for discussions on climate research and conservation in Antarctica.",
		date: "2025-01-15T08:00:00",
		endDate: "2025-01-17T17:00:00",
		category: "Science",
		location: {
			name: "Research Base Alpha",
			address: "King George Island, Antarctica",
			coordinates: { lat: -62.0833, lng: -58.4167 },
		},
		image:
			"https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=800&auto=format&fit=crop",
		price: "$1500",
		attendees: 120,
		featured: true,
		tags: ["Research", "Climate Science", "Conservation", "Antarctica"],
	},

	{
		id: "evt-008",
		title: "Music Festival 2025",
		description:
			"Three days of incredible performances across multiple genres.",
		date: "2025-07-15T14:00:00",
		endDate: "2025-07-17T23:00:00",
		category: "Entertainment",
		location: {
			name: "Riverside Park",
			address: "1500 Festival Grounds, Nashville, TN",
			coordinates: { lat: 36.1627, lng: -86.7816 },
		},
		image:
			"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
		price: "$199",
		attendees: 15000,
		featured: false,
		tags: ["Music", "Festival", "Live Performance", "North America"],
	},
];

const CATEGORIES = [
	"All Categories",
	"Technology",
	"Finance",
	"Environment",
	"Arts",
	"Business",
	"Entertainment",
	"Science",
];

const LOCATIONS = [
	"All Locations",
	"San Francisco, CA",
	"Nashville, TN",
	"London, UK",
	"Tokyo, Japan",
	"Cape Town, South Africa",
	"Sydney, Australia",
	"Rio de Janeiro, Brazil",
	"King George Island, Antarctica",
];

const generateRandomEvent = (id: string): any => {
	const randomLocations = [
		{
			name: "Tokyo Tech Hub",
			address: "Shibuya, Tokyo, Japan",
			coordinates: { lat: 35.6594, lng: 139.7005 },
		},
		{
			name: "Berlin Innovation Center",
			address: "Kreuzberg, Berlin, Germany",
			coordinates: { lat: 52.52, lng: 13.405 },
		},
		{
			name: "Mumbai Conference Hall",
			address: "Bandra, Mumbai, India",
			coordinates: { lat: 19.076, lng: 72.8777 },
		},
		{
			name: "São Paulo Exhibition Space",
			address: "Pinheiros, São Paulo, Brazil",
			coordinates: { lat: -23.5505, lng: -46.6333 },
		},
		{
			name: "Dubai Future Center",
			address: "Downtown Dubai, UAE",
			coordinates: { lat: 25.2048, lng: 55.2708 },
		},
		{
			name: "Nairobi Tech Park",
			address: "Westlands, Nairobi, Kenya",
			coordinates: { lat: -1.2921, lng: 36.8219 },
		},
		{
			name: "Vancouver Convention Center",
			address: "Downtown, Vancouver, Canada",
			coordinates: { lat: 49.2827, lng: -123.1207 },
		},
		{
			name: "Melbourne Arts Hub",
			address: "Southbank, Melbourne, Australia",
			coordinates: { lat: -37.8136, lng: 144.9631 },
		},
	];

	const randomImages = [
		"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop",
	];

	const eventTitles = [
		"Global Tech Summit 2025",
		"International Arts Festival",
		"Sustainable Future Conference",
		"Digital Marketing Masterclass",
		"World Music Celebration",
		"Startup Pitch Competition",
		"Culinary Excellence Expo",
		"Renewable Energy Forum",
	];

	const categories = [
		"Technology",
		"Arts",
		"Environment",
		"Business",
		"Entertainment",
		"Science",
		"Finance",
	];

	const tagsByCategory: { [key: string]: string[] } = {
		Technology: ["Innovation", "AI", "Blockchain", "Digital", "Future Tech"],
		Arts: ["Culture", "Exhibition", "Creative", "Design", "Performance"],
		Environment: [
			"Sustainability",
			"Green Energy",
			"Climate",
			"Conservation",
			"Eco-friendly",
		],
		Business: [
			"Entrepreneurship",
			"Leadership",
			"Strategy",
			"Networking",
			"Growth",
		],
		Entertainment: ["Music", "Festival", "Performance", "Live Show", "Concert"],
		Science: ["Research", "Discovery", "Innovation", "Breakthrough", "Future"],
		Finance: ["Investment", "Markets", "Economics", "Banking", "Fintech"],
	};

	const futureDate = new Date();
	futureDate.setMonth(
		futureDate.getMonth() + Math.floor(Math.random() * 6) + 1
	);
	const startDate = futureDate.toISOString();

	const endDate = new Date(futureDate);
	endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1);

	const locationIndex = Math.floor(Math.random() * randomLocations.length);
	const location = randomLocations[locationIndex];

	const categoryIndex = Math.floor(Math.random() * categories.length);
	const category = categories[categoryIndex];

	const availableTags = tagsByCategory[category] || [
		"Event",
		"Global",
		"Featured",
	];
	const numTags = Math.floor(Math.random() * 3) + 2;
	const tags: string[] = [];

	let regionTag = "Global";
	const lat = location.coordinates.lat;
	const lng = location.coordinates.lng;

	if (lat > 0 && lng > -30 && lng < 60) regionTag = "Europe/Africa";
	else if (lat > 0 && lng >= 60) regionTag = "Asia";
	else if (lat < 0 && lng > 100) regionTag = "Oceania";
	else if (lat < 0 && lng < 0) regionTag = "South America";
	else if (lat > 0 && lng < -30) regionTag = "North America";

	tags.push(regionTag);

	for (let i = 0; i < numTags; i++) {
		const tagIndex = Math.floor(Math.random() * availableTags.length);
		if (!tags.includes(availableTags[tagIndex])) {
			tags.push(availableTags[tagIndex]);
		}
	}

	const isFree = Math.random() < 0.2;
	const price = isFree ? "Free" : `$${Math.floor(Math.random() * 450) + 50}`;

	const attendees = Math.floor(Math.random() * 1950) + 50;

	const imageIndex = Math.floor(Math.random() * randomImages.length);

	const titleIndex = Math.floor(Math.random() * eventTitles.length);

	const descriptions = [
		`Join us for this exclusive ${category.toLowerCase()} event featuring top experts and innovators from around the world.`,
		`Experience the future of ${category.toLowerCase()} at this premier global gathering of industry leaders and visionaries.`,
		`Connect with like-minded professionals and explore the latest trends in ${category.toLowerCase()} at this must-attend event.`,
		`Discover groundbreaking innovations and insights in the world of ${category.toLowerCase()} at this international summit.`,
		`Engage with the global ${category.toLowerCase()} community and gain valuable knowledge and connections at this special event.`,
	];
	const descriptionIndex = Math.floor(Math.random() * descriptions.length);

	return {
		id: id,
		title: eventTitles[titleIndex],
		description: descriptions[descriptionIndex],
		date: startDate,
		endDate: endDate.toISOString(),
		category: category,
		location: location,
		image: randomImages[imageIndex],
		price: price,
		attendees: attendees,
		featured: Math.random() > 0.7,
		tags: tags,
	};
};

const Eventy: React.FC = () => {
	const [events, setEvents] = useState(MOCK_EVENTS);
	const [filteredEvents, setFilteredEvents] = useState(MOCK_EVENTS);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadingTimer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(loadingTimer);
	}, []);
	const [showFilters, setShowFilters] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("All Categories");
	const [selectedLocation, setSelectedLocation] = useState("All Locations");
	const [selectedDate, setSelectedDate] = useState("");
	const [showMap, setShowMap] = useState(false);
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
		lat: 39.8283,
		lng: -98.5795,
	});
	const [mapZoom, setMapZoom] = useState(3);
	const [recentlyAddedEvents, setRecentlyAddedEvents] = useState<string[]>([]);
	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [mapError, setMapError] = useState<string | null>(null);
	const [activeView, setActiveView] = useState<"list" | "featured" | "map">(
		"featured"
	);
	const [showEventDetails, setShowEventDetails] = useState<string | null>(null);
	const [showRegistrationSuccess, setShowRegistrationSuccess] =
		useState<boolean>(false);
	const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
	const [eventsListExpanded, setEventsListExpanded] = useState<boolean>(false);
	const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>(
		{}
	);
	const [registeredEvents, setRegisteredEvents] = useState<string[]>(() => {
		const savedRegistrations = localStorage.getItem("eventy_registrations");
		return savedRegistrations ? JSON.parse(savedRegistrations) : [];
	});

	const mapInstanceRef = useRef<any>(null);

	useEffect(() => {
		localStorage.setItem(
			"eventy_registrations",
			JSON.stringify(registeredEvents)
		);
	}, [registeredEvents]);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const userPos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					setUserLocation(userPos);
					if (!showMap) {
						setMapCenter(userPos);
					}
				},
				(error) => {
					console.error("Error getting location: ", error);

					setShowRegistrationSuccess(true);
					setTimeout(() => setShowRegistrationSuccess(false), 3000);
				}
			);
		}
	}, [showMap]);

	useEffect(() => {
		const interval = setInterval(() => {
			const action = Math.random();

			if (action > 0.7) {
				const newEventId = `evt-${Date.now()}`;
				const newEvent = generateRandomEvent(newEventId);

				setEvents((currentEvents) => {
					const updatedEvents = [...currentEvents, newEvent];

					if (
						selectedCategory === "All Categories" &&
						selectedLocation === "All Locations" &&
						!selectedDate &&
						!searchTerm
					) {
						setFilteredEvents(updatedEvents);
					}
					return updatedEvents;
				});

				setRecentlyAddedEvents((prev) => {
					const newList = [...prev, newEventId];

					setTimeout(() => {
						setRecentlyAddedEvents((current) =>
							current.filter((id) => id !== newEventId)
						);
					}, 8000);
					return newList;
				});

				setShowRegistrationSuccess(true);
				setTimeout(() => setShowRegistrationSuccess(false), 3000);
			} else if (action > 0.4) {
				const randomIndex = Math.floor(Math.random() * events.length);
				const updatedEvent = { ...events[randomIndex] };

				updatedEvent.attendees =
					Math.floor(Math.random() * 1000) + updatedEvent.attendees;

				setEvents((currentEvents) => {
					const updatedEvents = [...currentEvents];
					updatedEvents[randomIndex] = updatedEvent;

					if (filteredEvents.some((e) => e.id === updatedEvent.id)) {
						setFilteredEvents((current) => {
							return current.map((e) =>
								e.id === updatedEvent.id ? updatedEvent : e
							);
						});
					}

					return updatedEvents;
				});

				setRecentlyAddedEvents((prev) => {
					const newList = [...prev, updatedEvent.id];
					setTimeout(() => {
						setRecentlyAddedEvents((current) =>
							current.filter((id) => id !== updatedEvent.id)
						);
					}, 5000);
					return newList;
				});
			}
		}, 10000);

		return () => clearInterval(interval);
	}, [
		events,
		filteredEvents,
		selectedCategory,
		selectedLocation,
		selectedDate,
		searchTerm,
	]);

	useEffect(() => {
		const applyFilters = () => {
			let filtered = [...events];

			if (searchTerm) {
				const lowercasedSearch = searchTerm.toLowerCase();
				filtered = filtered.filter(
					(event) =>
						event.title.toLowerCase().includes(lowercasedSearch) ||
						event.description.toLowerCase().includes(lowercasedSearch) ||
						event.category.toLowerCase().includes(lowercasedSearch) ||
						event.location.name.toLowerCase().includes(lowercasedSearch) ||
						event.tags.some((tag) =>
							tag.toLowerCase().includes(lowercasedSearch)
						)
				);
			}

			if (selectedCategory !== "All Categories") {
				filtered = filtered.filter(
					(event) => event.category === selectedCategory
				);
			}

			if (selectedLocation !== "All Locations") {
				filtered = filtered.filter((event) =>
					event.location.address.includes(selectedLocation)
				);
			}

			if (selectedDate) {
				const selectedDateStr = new Date(selectedDate)
					.toISOString()
					.split("T")[0];
				filtered = filtered.filter((event) => {
					const eventDate = new Date(event.date).toISOString().split("T")[0];
					return eventDate === selectedDateStr;
				});
			}

			setFilteredEvents(filtered);
		};

		applyFilters();
	}, [events, searchTerm, selectedCategory, selectedLocation, selectedDate]);

	useEffect(() => {
		if (showMap) {
			console.log("Preparing map view at", mapCenter);

			setIsMapLoaded(false);

			const isRunningOnServer =
				window.location.hostname !== "localhost" &&
				window.location.hostname !== "127.0.0.1";

			if (isRunningOnServer) {
				const handleMapError = (error: any) => {
					console.error("Map error caught:", error);

					if (
						error &&
						error.message &&
						error.message.includes("is not a function")
					) {
						setMapError(
							"Map cannot be loaded in this environment. Please run this application locally for the best experience."
						);
					} else {
						if (isRunningOnServer) {
							setMapError(
								"Map cannot be loaded. Please run this application locally for the best experience."
							);
						}
					}
				};

				window.addEventListener("error", handleMapError);

				const handlePromiseRejection = (event: PromiseRejectionEvent) => {
					console.error("Promise rejection in map:", event.reason);
					if (
						event.reason &&
						event.reason.message &&
						(event.reason.message.includes("is not a function") ||
							event.reason.message.includes("Cannot read properties"))
					) {
						setMapError(
							"Map cannot be loaded in this environment. Please run this application locally for the best experience."
						);
					}
				};
				window.addEventListener("unhandledrejection", handlePromiseRejection);

				const mapTimeoutId = setTimeout(() => {
					if (!mapError && activeView === "map") {
						setMapError(
							"Map is taking too long to load. Please run this application locally for the best experience."
						);
					}
				}, 5000);

				return () => {
					window.removeEventListener("error", handleMapError);
					window.removeEventListener(
						"unhandledrejection",
						handlePromiseRejection
					);
					clearTimeout(mapTimeoutId);
				};
			}

			setTimeout(() => {
				setIsMapLoaded(true);
			}, 100);

			setTimeout(() => {
				if (mapInstanceRef.current) {
					try {
						mapInstanceRef.current.invalidateSize();
						console.log("Map size recalculated");
					} catch (error) {
						console.error("Error recalculating map size:", error);

						if (isRunningOnServer) {
							setMapError(
								"Map cannot be loaded. Please run this application locally for the best experience."
							);
						}
					}
				}
			}, 500);
		}
	}, [showMap, mapCenter, mapError, activeView]);

	const handleShowMap = () => {
		setActiveView("map");

		if (userLocation) {
			setMapCenter(userLocation);
			setMapZoom(13);
		}

		const forceServerError = false;
		const isRunningOnServer =
			forceServerError ||
			(window.location.hostname !== "localhost" &&
				window.location.hostname !== "127.0.0.1");

		setTimeout(() => {
			setShowMap(true);

			if (isRunningOnServer) {
				setMapError(
					"Map cannot be loaded. Please run this application locally for the best experience."
				);

				setIsMapLoaded(true);
				return;
			}

			if (mapError) {
				setMapError(null);
			}

			setIsMapLoaded(false);
			setTimeout(() => {
				setIsMapLoaded(true);
			}, 100);
		}, 100);
	};

	const formatDate = React.useCallback((dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(dateString).toLocaleDateString("en-US", options);
	}, []);

	const getTimeRange = React.useCallback(
		(startDate: string, endDate: string) => {
			const start = new Date(startDate);
			const end = new Date(endDate);

			const startTime = start.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});

			const endTime = end.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});

			return `${startTime} - ${endTime}`;
		},
		[]
	);

	const clearFilters = React.useCallback(() => {
		setSearchTerm("");
		setSelectedCategory("All Categories");
		setSelectedLocation("All Locations");
		setSelectedDate("");
	}, []);

	const handleEventClick = (eventId: string) => {
		setShowEventDetails(eventId);
	};

	const getEventById = (id: string) => {
		return events.find((event) => event.id === id);
	};

	const closeEventDetails = () => {
		setShowEventDetails(null);
	};

	const changeView = (view: "list" | "featured" | "map") => {
		setActiveView(view);

		setShowEventDetails(null);

		if (view === "map") {
			handleShowMap();
		} else {
			setShowMap(false);
		}
	};

	const renderEventDetails = () => {
		if (!showEventDetails) return null;

		const event = getEventById(showEventDetails);
		if (!event) return null;

		return (
			<div className="event-details-overlay">
				<div className="event-details-container">
					<button
						className="back-button"
						onClick={closeEventDetails}
						aria-label="Close event details"
					>
						<X size={24} />
					</button>

					<div className="event-details-image-container">
						<img
							src={event.image}
							alt={event.title}
							className={`event-details-image ${
								imagesLoaded[event.id] ? "loaded" : ""
							}`}
							onLoad={() =>
								setImagesLoaded((prev) => ({ ...prev, [event.id]: true }))
							}
						/>
						{!imagesLoaded[event.id] && (
							<div className="image-placeholder"></div>
						)}
						{event.featured && (
							<span className="event-details-featured-badge">Featured</span>
						)}
					</div>

					<div className="event-details-content">
						<h1 className="event-details-title">{event.title}</h1>

						<div className="event-details-info">
							<div className="event-details-info-item">
								<Calendar size={18} />
								<span>{formatDate(event.date)}</span>
							</div>

							<div className="event-details-info-item">
								<MapPin size={18} />
								<span>{event.location.name}</span>
							</div>

							<div className="event-details-info-item">
								<Clock size={18} />
								<span>{getTimeRange(event.date, event.endDate)}</span>
							</div>
						</div>

						<p className="event-details-description">{event.description}</p>

						<div className="event-details-address">
							<strong>Address:</strong> {event.location.address}
						</div>

						<div className="event-details-price-attendees">
							<div className="event-details-price">{event.price}</div>
							<div className="event-details-attendees">
								{event.attendees} attending
							</div>
						</div>

						<div className="event-details-tags">
							{event.tags.map((tag, index) => (
								<span key={index} className="event-tag">
									{tag}
								</span>
							))}
						</div>

						<button
							className={`register-button ${
								registeredEvents.includes(event.id) ? "registered" : ""
							}`}
							onClick={(e) => {
								e.stopPropagation();
								if (!registeredEvents.includes(event.id)) {
									setRegisteredEvents((prev) => [...prev, event.id]);
									setShowRegistrationSuccess(true);
									setTimeout(() => setShowRegistrationSuccess(false), 3000);

									setTimeout(() => {
										closeEventDetails();
									}, 1000);
								}
							}}
							aria-label={
								registeredEvents.includes(event.id)
									? `Already registered for ${event.title}`
									: `Register for ${event.title}`
							}
						>
							{registeredEvents.includes(event.id)
								? "Registered"
								: "Register Now"}
						</button>
					</div>
				</div>
			</div>
		);
	};

	const MapUpdater = ({
		center,
		zoom,
	}: {
		center: { lat: number; lng: number };
		zoom: number;
	}) => {
		const map = useMap();

		useEffect(() => {
			map.setView(center, zoom);
			map.invalidateSize();

			setTimeout(() => {
				map.invalidateSize();
			}, 300);
		}, [map, center, zoom]);

		return null;
	};

	const createMarkerIcon = (isHighlighted = false) => {
		return L.divIcon({
			html: `<div class="custom-marker ${
				isHighlighted ? "highlighted-marker" : ""
			}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${
								isHighlighted ? "#4f46e5" : "#ff3e00"
							}" stroke="${isHighlighted ? "#4f46e5" : "#ff3e00"}">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3" fill="white"></circle>
              </svg>
            </div>`,
			className: "custom-marker-container",
			iconSize: [36, 36],
			iconAnchor: [18, 36],
			popupAnchor: [0, -36],
		});
	};

	const renderMap = () => {
		if (activeView !== "map") return null;

		return (
			<div className="map-container">
				{mapError ? (
					<div className="map-error">
						<div className="error-icon">!</div>
						<div className="error-message">
							<p className="error-title">Map Error</p>
							<p className="error-details">{mapError}</p>
							{mapError && mapError.includes("locally") ? (
								<div className="local-run-message">
									<p>
										This application uses features that may be restricted on
										some servers.
									</p>
									<p>
										For the best experience, please download and run the
										application locally.
									</p>
								</div>
							) : (
								<button
									className="retry-button"
									onClick={() => {
										setMapError(null);
										setIsMapLoaded(false);
										setTimeout(() => setIsMapLoaded(true), 100);
									}}
								>
									Retry
								</button>
							)}
						</div>
					</div>
				) : (
					(isLoading || !isMapLoaded) && (
						<div className="map-loading">
							<div className="loading-spinner"></div>
							<p>Loading map...</p>
							<p className="loading-subtitle">
								Preparing your interactive map experience
							</p>
						</div>
					)
				)}

				<div className="map-canvas">
					{userLocation && (
						<button
							className="recenter-map-button"
							onClick={() => {
								if (userLocation) {
									setMapCenter(userLocation);
									setMapZoom(13);
									setShowRegistrationSuccess(true);
									setTimeout(() => setShowRegistrationSuccess(false), 2000);
								}
							}}
							aria-label="Center map on my location"
						>
							<Navigation size={18} />
							<span>Center on me</span>
						</button>
					)}

					{mapError ? (
						<div className="map-error">
							<div className="error-icon">!</div>
							<div className="error-message">
								<p className="error-title">Map Error</p>
								<p className="error-details">{mapError}</p>
								<div className="local-run-message">
									<p>
										This application uses features that may be restricted on
										some servers.
									</p>
									<p>
										For the best experience, please download and run the
										application locally.
									</p>
								</div>
							</div>
						</div>
					) : isMapLoaded ? (
						<MapContainer
							center={mapCenter}
							zoom={mapZoom}
							style={{ height: "100%", width: "100%" }}
							ref={(mapInstance: any) => {
								if (mapInstance) {
									mapInstanceRef.current = mapInstance;

									console.log("Map instance created");

									const isRunningOnServer =
										window.location.hostname !== "localhost" &&
										window.location.hostname !== "127.0.0.1";

									setTimeout(() => {
										try {
											mapInstance.invalidateSize();
										} catch (error) {
											console.error("Error invalidating map size:", error);

											if (isRunningOnServer) {
												setMapError(
													"Map cannot be loaded. Please run this application locally for the best experience."
												);
											}
										}
									}, 100);

									try {
										mapInstance.on("tileerror", (error: any) => {
											console.error("Tile loading error:", error);

											if (isRunningOnServer) {
												setMapError(
													"Unable to load map tiles. Please run this application locally for the best experience."
												);
											}
										});
									} catch (error) {
										console.error(
											"Error setting up tile error handler:",
											error
										);
									}

									try {
										if (typeof mapInstance.getZoom !== "function") {
											throw new Error("Map functions not available");
										}
									} catch (error) {
										console.error("Map initialization error:", error);

										if (isRunningOnServer) {
											setMapError(
												"Map cannot be loaded. Please run this application locally for the best experience."
											);
										}
									}
								}
							}}
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>

							<MapUpdater center={mapCenter} zoom={mapZoom} />

							{filteredEvents.map((event) => (
								<Marker
									key={event.id}
									position={event.location.coordinates}
									icon={createMarkerIcon(hoveredEventId === event.id)}
									eventHandlers={{
										click: () => handleEventClick(event.id),
									}}
								>
									<Popup>
										<div className="map-popup">
											<h4>{event.title}</h4>
											<p>{formatDate(event.date)}</p>
											<button
												onClick={() => {
													handleEventClick(event.id);

													setShowRegistrationSuccess(true);
													setTimeout(
														() => setShowRegistrationSuccess(false),
														2000
													);
												}}
											>
												View Details
											</button>
										</div>
									</Popup>
								</Marker>
							))}

							{userLocation && (
								<Marker
									position={userLocation}
									icon={L.divIcon({
										html: `<div class="user-location-marker"></div>`,
										className: "user-marker-container",
										iconSize: [16, 16],
										iconAnchor: [8, 8],
									})}
								>
									<Popup>Your location</Popup>
								</Marker>
							)}
						</MapContainer>
					) : (
						<div className="map-loading">
							<div className="loading-spinner"></div>
							<p>Loading map...</p>
						</div>
					)}
				</div>

				<div
					className={`map-events-list ${eventsListExpanded ? "expanded" : ""}`}
				>
					<div className="map-events-header">
						<h3 className="map-events-title">Nearby Events</h3>
						<button
							className="toggle-events-button"
							onClick={() => setEventsListExpanded(!eventsListExpanded)}
							aria-label={
								eventsListExpanded
									? "Collapse nearby events panel"
									: "Expand nearby events panel"
							}
							aria-expanded={eventsListExpanded}
						>
							{eventsListExpanded ? (
								<ChevronDown size={18} />
							) : (
								<ChevronUp size={18} />
							)}
						</button>
					</div>
					<div className="map-events-scrollable">
						{filteredEvents.slice(0, 5).map((event) => (
							<div
								key={event.id}
								className={`map-event-card ${
									hoveredEventId === event.id ? "highlighted-card" : ""
								}`}
								onClick={() => {
									handleEventClick(event.id);

									setShowRegistrationSuccess(true);
									setTimeout(() => setShowRegistrationSuccess(false), 2000);
								}}
								onMouseEnter={() => setHoveredEventId(event.id)}
								onMouseLeave={() => setHoveredEventId(null)}
							>
								<img
									src={event.image}
									alt={event.title}
									className={`map-event-image ${
										imagesLoaded[event.id] ? "loaded" : ""
									}`}
									onLoad={() =>
										setImagesLoaded((prev) => ({ ...prev, [event.id]: true }))
									}
									loading="lazy"
								/>
								{!imagesLoaded[event.id] && (
									<div className="image-placeholder"></div>
								)}
								<div className="map-event-details">
									<h4 className="map-event-title">{event.title}</h4>
									<p className="map-event-date">{formatDate(event.date)}</p>
									<div className="map-event-distance">
										{userLocation
											? `${(Math.random() * 5 + 0.1).toFixed(1)} km away`
											: "Distance unavailable"}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	};

	const renderSkeletonEvents = React.useCallback((count = 3) => {
		return Array(count)
			.fill(0)
			.map((_, index) => (
				<div key={`skeleton-${index}`} className="skeleton-card">
					<div className="skeleton-image"></div>
					<div className="skeleton-content">
						<div className="skeleton-title"></div>
						<div className="skeleton-text"></div>
						<div className="skeleton-text"></div>
						<div className="skeleton-footer">
							<div className="skeleton-badge"></div>
							<div className="skeleton-button"></div>
						</div>
					</div>
				</div>
			));
	}, []);

	const renderFeaturedEvents = () => {
		const featuredEvents = filteredEvents.filter((event) => event.featured);

		return (
			<div className="featured-events">
				<h2 className="featured-events-title">Featured Events</h2>

				<div className="featured-events-container">
					{isLoading ? (
						renderSkeletonEvents(3)
					) : featuredEvents.length === 0 ? (
						<p className="no-results">No featured events match your filters</p>
					) : (
						featuredEvents.map((event) => (
							<div
								key={event.id}
								className={`featured-event-card ${
									recentlyAddedEvents.includes(event.id)
										? "recently-updated"
										: ""
								}`}
								onClick={() => {
									handleEventClick(event.id);

									setShowRegistrationSuccess(true);
									setTimeout(() => setShowRegistrationSuccess(false), 2000);
								}}
							>
								{recentlyAddedEvents.includes(event.id) && (
									<div className="new-event-badge">New</div>
								)}
								<div className="featured-event-image-container">
									<img
										src={event.image}
										alt={event.title}
										className={`featured-event-image ${
											imagesLoaded[event.id] ? "loaded" : ""
										}`}
										onLoad={() =>
											setImagesLoaded((prev) => ({ ...prev, [event.id]: true }))
										}
										loading="lazy"
									/>
									{!imagesLoaded[event.id] && (
										<div className="image-placeholder"></div>
									)}
									<div className="event-category-badge">{event.category}</div>
								</div>

								<div className="featured-event-details">
									<h3 className="featured-event-title">{event.title}</h3>

									<div className="featured-event-info">
										<div className="featured-event-date">
											<Calendar size={16} />
											<span>{formatDate(event.date)}</span>
										</div>

										<div className="featured-event-location">
											<MapPin size={16} />
											<span>{event.location.name}</span>
										</div>
									</div>

									<div className="featured-event-footer">
										<div className="featured-event-price">{event.price}</div>
										<button
											className="view-details-button"
											onClick={(e) => {
												e.stopPropagation();
												handleEventClick(event.id);

												setShowRegistrationSuccess(true);
												setTimeout(
													() => setShowRegistrationSuccess(false),
													2000
												);
											}}
										>
											<span>View Details</span>
											<ArrowRight size={16} />
										</button>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		);
	};

	const renderEventsList = () => {
		return (
			<div className="events-list">
				<h2 className="events-list-title">All Events</h2>

				<div className="events-grid">
					{isLoading ? (
						renderSkeletonEvents(6)
					) : filteredEvents.length === 0 ? (
						<p className="no-results">No events match your search</p>
					) : (
						filteredEvents.map((event) => (
							<div
								key={event.id}
								className={`event-card ${
									recentlyAddedEvents.includes(event.id)
										? "recently-updated"
										: ""
								}`}
								onClick={() => {
									handleEventClick(event.id);
									setShowRegistrationSuccess(true);
									setTimeout(() => setShowRegistrationSuccess(false), 2000);
								}}
							>
								{recentlyAddedEvents.includes(event.id) && (
									<div className="new-event-badge">New</div>
								)}

								<div className="event-image-container">
									<img
										src={event.image}
										alt={event.title}
										className={`event-image ${
											imagesLoaded[event.id] ? "loaded" : ""
										}`}
										onLoad={() =>
											setImagesLoaded((prev) => ({ ...prev, [event.id]: true }))
										}
										loading="lazy"
									/>
									{!imagesLoaded[event.id] && (
										<div className="image-placeholder"></div>
									)}
									{event.featured && (
										<span className="featured-badge">Featured</span>
									)}
								</div>

								<div className="event-content">
									<div>
										<div className="event-category">{event.category}</div>
										<h3 className="event-title">{event.title}</h3>

										<div className="event-info">
											<div className="event-date">
												<Calendar size={14} />
												<span>{formatDate(event.date)}</span>
											</div>

											<div className="event-location">
												<MapPin size={14} />
												<span>{event.location.name}</span>
											</div>
										</div>

										{}
										<div className="event-description">
											{event.description.length > 100
												? `${event.description.substring(0, 100)}...`
												: event.description}
										</div>
									</div>

									<div>
										{}
										<div className="event-tags">
											{event.tags.slice(0, 3).map((tag, index) => (
												<span key={index} className="event-tag">
													{tag}
												</span>
											))}
										</div>

										<div className="event-footer">
											<div className="event-price">{event.price}</div>
											<div className="event-attendees">
												{event.attendees} attending
											</div>
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		);
	};

	const renderRegistrationSuccess = () => {
		if (!showRegistrationSuccess) return null;

		let message = "Action successful!";
		let bgColor = "#10b981";

		if (
			registeredEvents.length > 0 &&
			registeredEvents[registeredEvents.length - 1]
		) {
			const lastEvent = events.find(
				(e) => e.id === registeredEvents[registeredEvents.length - 1]
			);
			if (lastEvent) {
				message = `Registered for ${lastEvent.title}!`;
				bgColor = "#10b981";
			} else {
				message = "Registration successful!";
			}
		}

		if (
			selectedCategory !== "All Categories" ||
			selectedLocation !== "All Locations" ||
			selectedDate
		) {
			message = "Filters applied successfully!";
			bgColor = "#4f46e5";
		}

		if (activeView === "featured") {
			message = "Showing featured events";
			bgColor = "#f59e0b";
		} else if (activeView === "list") {
			message = "Showing all events";
			bgColor = "#f59e0b";
		} else if (activeView === "map") {
			message = "Showing map view";
			bgColor = "#f59e0b";
		}

		if (showEventDetails) {
			const event = events.find((e) => e.id === showEventDetails);
			if (event) {
				message = `Viewing ${event.title}`;
				bgColor = "#3b82f6";
			}
		}

		if (navigator.geolocation && !userLocation) {
			message = "Location access denied. Some features may be limited.";
			bgColor = "#ef4444";
		}

		const recentlyAddedIds = recentlyAddedEvents.filter((id) =>
			id.startsWith("evt-")
		);
		if (recentlyAddedIds.length > 0) {
			const newEvent = events.find(
				(e) => e.id === recentlyAddedIds[recentlyAddedIds.length - 1]
			);
			if (newEvent) {
				message = `New event added: ${newEvent.title}`;
				bgColor = "#8b5cf6";
			}
		}

		return (
			<div className="registration-success">
				<div
					className="registration-success-content"
					style={{ backgroundColor: bgColor }}
				>
					<div className="success-icon">✓</div>
					<p>{message}</p>
				</div>
			</div>
		);
	};

	return (
		<>
			{renderRegistrationSuccess()}
			<style>{`
        
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          position: relative;
          max-width: 100vw;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: #f8f9fa;
          color: #333;
          line-height: 1.5;
          overflow-x: hidden;
          touch-action: manipulation;
        }

        button, input, select {
          font-family: inherit;
          font-size: inherit;
        }

        
        .event-discovery-app {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          -webkit-overflow-scrolling: touch;
        }

        
        .app-header {
          padding: 1.25rem 1.5rem;
          background-color: #fff;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 100vw;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .app-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1f2c;
          margin: 0;
        }

        .app-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        
        .search-container {
          position: relative;
          margin-top: 0.5rem;
        }

        .search-bar {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          background-color: #f9fafb;
          transition: all 0.3s ease;
          outline: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .search-bar:focus {
          border-color: #6366f1;
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          transform: translateY(-1px);
        }

        .search-bar:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          transition: color 0.2s ease;
        }

        .search-bar:focus + .search-icon {
          color: #6366f1;
        }

        .filters-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border: none;
          border-radius: 12px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #4b5563;
          position: relative;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .filters-button:hover {
          background-color: #e5e7eb;
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .filters-button:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .filters-button-active {
          background-color: #4f46e5;
          color: white;
          box-shadow: 0 2px 5px rgba(79, 70, 229, 0.4);
        }

        .filters-button-active:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(79, 70, 229, 0.5);
        }

        .filters-button::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform 0.5s, opacity 0.8s;
        }

        .filters-button:active::after {
          transform: scale(0, 0);
          opacity: 0.3;
          transition: 0s;
        }

        

        
        .filters-panel {
          padding: 1.5rem;
          background-color: #fff;
          border-radius: 0 0 16px 16px;
          margin-top: -1px;
          border-top: 1px solid #f3f4f6;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: slideDown 0.3s ease-out;
          z-index: 90;
          position: relative;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .filter-group {
          margin-bottom: 1.25rem;
        }

        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }

        .filter-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
        }

        .filter-select:focus {
          border-color: #6366f1;
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .date-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .date-input:focus {
          border-color: #6366f1;
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .filters-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
        }

        .clear-filters-button {
          padding: 0.75rem 1.25rem;
          border: 1px solid #e5e7eb;
          background-color: #fff;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .clear-filters-button::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.05) 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform 0.3s, opacity 0.5s;
        }

        .clear-filters-button:hover {
          background-color: #f9fafb;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .clear-filters-button:active {
          transform: translateY(0);
        }

        .clear-filters-button:active::after {
          transform: scale(0, 0);
          opacity: 0.3;
          transition: 0s;
        }

        .apply-filters-button {
          padding: 0.75rem 1.25rem;
          border: none;
          background-color: #4f46e5;
          color: #fff;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .apply-filters-button:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(79, 70, 229, 0.4);
        }

        .apply-filters-button:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(79, 70, 229, 0.3);
        }

        .apply-filters-button:active::after {
          transform: scale(0, 0);
          opacity: 0.3;
          transition: 0s;
        }

        
        .main-content {
          padding: 1.5rem;
          padding-top: 0.75rem;
          padding-bottom: 5rem; 
          overflow-x: hidden;
          flex: 1;
          width: 100%;
          max-width: 100vw;
          position: relative;
        }

        
        .view-navigation {
          display: flex;
          background-color: #f3f4f6;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          padding: 0.25rem;
        }

        .view-button {
          flex: 1;
          padding: 0.75rem 0;
          text-align: center;
          font-weight: 500;
          font-size: 0.875rem;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6b7280;
          position: relative;
          overflow: hidden;
        }

        .view-button:hover {
          color: #4f46e5;
        }

        .view-button:active {
          transform: scale(0.97);
        }

        .view-button.active {
          background-color: #fff;
          color: #1a1f2c;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .view-button::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform 0.5s, opacity 0.8s;
        }

        .view-button:active::after {
          transform: scale(0, 0);
          opacity: 0.3;
          transition: 0s;
        }

        
        .featured-events {
          margin-bottom: 2rem;
        }

        .featured-events-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1f2c;
        }

        .featured-events-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          width: 100%;
        }

        .featured-event-card {
          background-color: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          will-change: transform, box-shadow;
        }

        .featured-event-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
        }

        .featured-event-card:active {
          transform: translateY(-3px) scale(0.99);
          box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .featured-event-image-container {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .featured-event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease, opacity 0.3s ease;
          opacity: 0;
        }

        .featured-event-image.loaded {
          opacity: 1;
        }

        .featured-event-card:hover .featured-event-image {
          transform: scale(1.05);
        }

        .event-category-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background-color: rgba(0, 0, 0, 0.6);
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          backdrop-filter: blur(4px);
        }

        .featured-event-details {
          padding: 1.25rem;
        }

        .featured-event-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1a1f2c;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.8rem;
        }

        .featured-event-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .featured-event-date, .featured-event-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .featured-event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }

        .featured-event-price {
          font-weight: 600;
          color: #1a1f2c;
        }

        .view-details-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4f46e5;
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .view-details-button:hover {
          background-color: rgba(79, 70, 229, 0.05);
          transform: translateX(2px);
        }

        .view-details-button:active {
          transform: translateX(0);
        }

        .view-details-button svg {
          transition: transform 0.2s ease;
        }

        .view-details-button:hover svg {
          transform: translateX(3px);
        }

        
        .events-list {
          margin-bottom: 2rem;
        }

        .events-list-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1f2c;
        }

        .events-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          width: 100%;
        }

        .event-card {
          display: flex;
          background-color: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          height: 128px;
          will-change: transform, box-shadow;
        }

        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }

        .event-card:active {
          transform: translateY(-2px) scale(0.99);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .event-image-container {
          position: relative;
          width: 35%;
          overflow: hidden;
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .event-image.loaded {
          opacity: 1;
        }

        .featured-badge {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          background-color: #4f46e5;
          color: #fff;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .event-content {
          flex: 1;
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
        }

        .event-category {
          font-size: 0.75rem;
          color: #6366f1;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .event-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1a1f2c;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .event-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: auto;
        }

        .event-date, .event-location {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          font-size: 0.75rem;
        }

        .event-price {
          font-weight: 600;
          color: #1a1f2c;
        }

        .event-attendees {
          color: #6b7280;
        }

        
        .map-container {
          position: relative;
          height: calc(100vh - 180px);
          margin: -1.5rem;
          background-color: #f2f2f2;
          overflow: hidden;
          min-height: 500px;
          width: 100vw;
          left: 0;
          right: 0;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          max-width: none;
        }

        .map-canvas {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .map-loading, .map-error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          z-index: 1000;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(4px);
          width: 80%;
          max-width: 400px;
          text-align: center;
          animation: fadeIn 0.5s ease, floatIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes floatIn {
          from {
            transform: translate(-50%, -40%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }

        .map-error {
          flex-direction: column;
          max-width: 80%;
          width: 400px;
          text-align: center;
        }

        .local-run-message {
          margin-top: 1rem;
          padding: 1rem;
          background-color: rgba(79, 70, 229, 0.1);
          border-radius: 0.5rem;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #4b5563;
        }

        .local-run-message p {
          margin-bottom: 0.5rem;
        }

        .local-run-message p:last-child {
          margin-bottom: 0;
          font-weight: 500;
        }

        .error-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #ef4444;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          margin: 0 auto 1rem auto;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
        }

        .error-message {
          flex: 1;
          text-align: center;
          width: 100%;
        }

        .error-title {
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .error-details {
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .retry-button {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);
          margin: 0 auto;
          display: block;
        }

        .retry-button:hover {
          background-color: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(79, 70, 229, 0.3);
        }

        .retry-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 3px rgba(79, 70, 229, 0.2);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #4f46e5;
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
          margin-bottom: 0.5rem;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        
        .leaflet-container {
          width: 100%;
          height: 100%;
          font-family: inherit;
          z-index: 1;
          touch-action: manipulation;
        }

        .recenter-map-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 10;
          font-size: 0.8rem;
          font-weight: 500;
          color: #4f46e5;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .recenter-map-button::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(79, 70, 229, 0.1) 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform 0.3s, opacity 0.5s;
        }

        .recenter-map-button:hover {
          background-color: #f5f3ff;
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(79, 70, 229, 0.2);
        }

        .recenter-map-button:active {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .recenter-map-button:active::after {
          transform: scale(0, 0);
          opacity: 0.3;
          transition: 0s;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }

        .leaflet-popup-content {
          margin: 0;
          width: 220px !important;
        }

        .map-popup {
          padding: 12px;
        }

        .map-popup h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .map-popup p {
          margin: 0 0 10px 0;
          font-size: 12px;
          color: #6b7280;
        }

        .map-popup button {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          margin-top: 8px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .map-popup button:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
        }

        .map-popup button:active {
          transform: translateY(0);
          box-shadow: none;
        }

        .custom-marker-container {
          background: none;
          border: none;
        }

        .custom-marker {
          filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.15));
          transform: translateY(-8px);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
          will-change: transform, filter;
        }

        .custom-marker:hover {
          transform: translateY(-14px) scale(1.15);
          filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.25));
        }

        .custom-marker:active {
          transform: translateY(-10px) scale(1.05);
          filter: drop-shadow(0 5px 4px rgba(0, 0, 0, 0.2));
          transition: transform 0.1s ease, filter 0.1s ease;
        }

        .highlighted-marker {
          transform: translateY(-14px) scale(1.15);
          filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.25));
          animation: pulse-marker 2s infinite alternate;
        }

        @keyframes pulse-marker {
          0% {
            transform: translateY(-14px) scale(1.15);
          }
          100% {
            transform: translateY(-16px) scale(1.2);
          }
        }

        .user-marker-container {
          background: none;
          border: none;
        }

        .user-location-marker {
          width: 16px;
          height: 16px;
          background-color: #4f46e5;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
          position: relative;
        }

        .user-location-marker::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(79, 70, 229, 0.2);
          animation: userPulse 2s infinite;
          z-index: -1;
        }

        @keyframes userPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        
        .registration-success {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), fadeOut 0.3s ease-out 2.7s;
          filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
        }

        .registration-success-content {
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background-color 0.3s ease;
        }

        .success-icon {
          font-size: 20px;
          font-weight: bold;
          background-color: rgba(255, 255, 255, 0.2);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes slideDown {
          from { transform: translate(-50%, -100%); }
          to { transform: translate(-50%, 0); }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .register-button.registered {
          background-color: #10b981;
          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
        }

        .register-button.registered:hover {
          background-color: #059669;
          box-shadow: 0 6px 10px rgba(16, 185, 129, 0.3);
        }

        
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }

        @keyframes shine {
          to {
            background-position-x: -200%;
          }
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
          background-size: 200% 100%;
          animation: shine 1.5s linear infinite;
          z-index: 0;
        }

        .skeleton-card {
          border-radius: 12px;
          overflow: hidden;
          background-color: #fff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          height: 320px;
          display: flex;
          flex-direction: column;
          animation: skeletonPulse 1.5s ease-in-out infinite alternate;
        }

        @keyframes skeletonPulse {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }

        .skeleton-image {
          height: 160px;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-content {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .skeleton-title {
          height: 24px;
          width: 80%;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }

        .skeleton-text {
          height: 16px;
          width: 100%;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }

        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .skeleton-badge {
          height: 20px;
          width: 60px;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }

        .skeleton-button {
          height: 20px;
          width: 100px;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }

        .map-events-list {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          border-radius: 24px 24px 0 0;
          padding: 1.5rem;
          padding-bottom: 5rem; 
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
          max-height: 40%;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .map-events-list {
  
  padding-bottom: 5rem; 
  
  max-height: calc(40% - 5rem);
  overflow-y: auto;
}

.map-events-list.expanded {
  max-height: calc(70% - 5rem);
}

.map-events-scrollable {
  
  padding-bottom: 1rem;
}


@media (min-width: 1024px) {
  .map-events-list {
    
    padding-bottom: 1.5rem;
    max-height: calc(100% - 40px);
  }
}
  .featured-event-title {
  
  height: auto;
  
  line-height: 1.4;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  min-height: 2.8rem;
  
  margin-bottom: 0.75rem;
}




.event-card {
  
  height: auto;
  min-height: 140px;
  
  display: flex;
  flex-direction: row;
  
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}


.event-image-container {
  width: 35%;
  min-width: 120px;
  height: auto;
  position: relative;
}


.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 100%;
}


.event-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


.event-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: auto;
}


.event-info {
  margin: 0.5rem 0;
  flex-grow: 1;
}


.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  width: 100%;
}


.event-price, .event-attendees {
  font-size: 0.8rem;
}


.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.event-tag {
  background-color: #f3f4f6;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.65rem;
  color: #4b5563;
  white-space: nowrap;
}


@media (max-width: 480px) {
  .event-card {
    min-height: 120px;
  }
  
  .event-image-container {
    width: 40%;
    min-width: 100px;
  }
  
  .event-content {
    padding: 0.75rem;
  }
  
  .event-title {
    font-size: 0.9rem;
    -webkit-line-clamp: 1;
  }
  
  .event-info {
    margin: 0.25rem 0;
  }
  
  .event-footer {
    margin-top: 0.25rem;
  }
  
  .event-price, .event-attendees {
    font-size: 0.7rem;
  }
  
  
  .event-tags {
    display: none;
  }
}


@media (min-width: 768px) {
  .event-card {
    min-height: 160px;
  }
  
  .event-content {
    padding: 1.25rem;
  }
  
  .event-title {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .event-date, .event-location {
    font-size: 0.85rem;
  }
  
  .event-price, .event-attendees {
    font-size: 0.9rem;
  }
  
  
  .event-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
}


@media (min-width: 1024px) {
  .event-card {
    min-height: 180px;
  }
  
  .event-image-container {
    width: 30%;
  }
  
  .event-title {
    font-size: 1.2rem;
  }
  
  
  .event-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0.5rem 0;
    font-size: 0.85rem;
    color: #6b7280;
    line-height: 1.4;
  }
}

        .map-events-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .toggle-events-button {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .toggle-events-button:hover {
          background-color: #f3f4f6;
          color: #4f46e5;
        }

        .map-events-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1f2c;
        }

        .map-events-scrollable {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: calc(100% - 50px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .map-event-card {
          display: flex;
          background-color: #f9fafb;
          border-radius: 12px;
          overflow: hidden;
          height: 72px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
          position: relative;
          will-change: transform, box-shadow;
        }

        .map-event-card:hover {
          background-color: #f5f3ff;
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .map-event-card:active {
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .map-event-image {
          width: 72px;
          height: 72px;
          object-fit: cover;
        }

        .map-event-details {
          flex: 1;
          padding: 0.75rem;
        }

        .map-event-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1a1f2c;
        }

        .map-event-date {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .map-event-distance {
          font-size: 0.7rem;
          color: #4f46e5;
          margin-top: 0.25rem;
          font-weight: 500;
        }

        .highlighted-card {
          background-color: #f5f3ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-left: 3px solid #4f46e5;
        }

        .loading-subtitle {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: -0.5rem;
        }

        
        .bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #fff;
          display: flex;
          justify-content: space-around;
          padding: 0.75rem 0;
          box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.1);
          z-index: 50;
          height: 60px;
          width: 100%;
          max-width: 100vw;
        }

        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: none;
          border: none;
          padding: 0.5rem;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.75rem;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-button:hover {
          color: #4f46e5;
          transform: translateY(-2px);
        }

        .nav-button:active {
          transform: scale(0.95);
        }

        .nav-button.active {
          color: #4f46e5;
        }

        .nav-button.active::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background-color: #4f46e5;
          border-radius: 3px;
        }

        .nav-button::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(79, 70, 229, 0.2) 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform 0.5s, opacity 0.8s;
        }

        .nav-button:active::after {
          transform: scale(0, 0);
          opacity: 0.3;
          transition: 0s;
        }

        
        .event-details-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #fff;
          z-index: 200;
          overflow-y: auto;
          overflow-x: hidden;
          animation: fadeIn 0.3s ease;
          width: 100%;
          height: 100%;
          max-width: 100vw;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .event-details-container {
          position: relative;
        }

        .back-button {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
          z-index: 10;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .event-details-image-container {
          position: relative;
          height: 40vh;
        }

        .event-details-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .event-details-image.loaded {
          opacity: 1;
        }

        .event-details-featured-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: #4f46e5;
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .event-details-content {
          padding: 1.5rem;
        }

        .event-details-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1f2c;
        }

        .event-details-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .event-details-info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4b5563;
          font-size: 0.9375rem;
        }

        .event-details-description {
          margin-bottom: 1.5rem;
          color: #4b5563;
          line-height: 1.6;
        }

        .event-details-address {
          margin-bottom: 1.5rem;
          color: #4b5563;
        }

        .event-details-price-attendees {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .event-details-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1a1f2c;
        }

        .event-details-attendees {
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .event-details-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .event-tag {
          background-color: #f3f4f6;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          color: #4b5563;
        }

        .register-button {
          width: 100%;
          background-color: #4f46e5;
          color: #fff;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
        }

        .register-button:hover {
          background-color: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(79, 70, 229, 0.3);
        }

        .register-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        }

        .register-button::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform 0.5s, opacity 0.8s;
        }

        .register-button:active::after {
          transform: scale(0, 0);
          opacity: 0.3;
          transition: 0s;
        }

        .no-results {
          padding: 2rem;
          text-align: center;
          color: #6b7280;
        }

        
        .recently-updated {
          position: relative;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(79, 70, 229, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
          }
        }

        .new-event-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background-color: #ef4444;
          color: #fff;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 5;
          box-shadow: 0 0 0 rgba(239, 68, 68, 0.4);
          animation: pulse-red 2s infinite;
        }

        @keyframes pulse-red {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            transform: scale(1);
          }
        }

        
        
        @media (min-width: 320px) {
          .app-header {
            padding: 1rem;
          }

          .app-title {
            font-size: 1.25rem;
          }

          .search-bar {
            padding: 0.75rem 1rem 0.75rem 2.5rem;
          }

          .search-icon {
            left: 0.75rem;
          }

          .map-container {
            height: calc(100vh - 200px);
          }
        }

        
        @media (min-width: 480px) {
          .app-header {
            padding: 1.25rem;
          }

          .app-title {
            font-size: 1.35rem;
          }

          .map-container {
            height: calc(100vh - 180px);
          }
        }

        
        @media (min-width: 640px) {
          .featured-events-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .events-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .event-card {
            height: 140px;
          }

          
          .map-container {
            height: calc(100vh - 170px);
          }

          .app-header {
            padding: 1.25rem 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .featured-events-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .events-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          
          .map-container {
            height: calc(100vh - 160px);
          }

          .map-events-list {
            max-height: 35%;
          }
        }

        @media (min-width: 1024px) {
          .featured-events-container {
            grid-template-columns: repeat(3, 1fr);
          }

          .events-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          
          .map-container {
            height: calc(100vh - 150px);
            margin: -1.5rem -1.5rem -5rem -1.5rem;
            width: auto;
            left: auto;
            right: auto;
            margin-left: -1.5rem;
            margin-right: -1.5rem;
            max-width: none;
          }

          .event-discovery-app {
            max-width: 1400px;
            margin: 0 auto;
          }

          .event-details-overlay {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
          }

          .event-details-container {
            max-width: 1000px;
            width: 90%;
            margin: 2rem auto;
            border-radius: 16px;
            overflow: hidden;
            background-color: white;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            max-height: 90vh;
            display: flex;
            flex-direction: column;
          }

          .event-details-image-container {
            height: 350px;
          }

          .event-details-content {
            overflow-y: auto;
          }

          .map-events-list {
            width: 350px;
            right: auto;
            left: 20px;
            bottom: 20px;
            border-radius: 12px;
            max-height: calc(100% - 40px);
            padding-bottom: 1.5rem;
          }

          .map-events-list.expanded {
            width: 400px;
          }

          .recenter-map-button {
            top: 20px;
            right: 20px;
          }
        }

        
        @media (min-width: 1280px) {
          .map-events-list {
            width: 400px;
          }

          .map-events-list.expanded {
            width: 450px;
          }

          .event-discovery-app {
            max-width: 1600px;
          }

          .featured-events-container {
            grid-template-columns: repeat(4, 1fr);
          }

          .events-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>

			<div className="event-discovery-app">
				<Helmet>
					{" "}
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
					/>{" "}
				</Helmet>

				{}
				<header className="app-header">
					<div className="header-top">
						<div>
							<h1 className="app-title">EventHorizon</h1>
							<p className="app-subtitle">Discover events around you</p>
						</div>
						<button
							className={`filters-button ${
								showFilters ? "filters-button-active" : ""
							}`}
							onClick={() => setShowFilters(!showFilters)}
							aria-label="Toggle filters"
							aria-expanded={showFilters}
						>
							<Filter size={20} />
						</button>
					</div>

					<div className="search-container">
						<Search size={18} className="search-icon" />
						<input
							type="text"
							className="search-bar"
							placeholder="Search events, categories, locations..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							aria-label="Search events"
						/>
					</div>

					{showFilters && (
						<div className="filters-panel">
							<div className="filter-group">
								<label className="filter-label">Category</label>
								<select
									className="filter-select"
									value={selectedCategory}
									onChange={(e) => {
										setSelectedCategory(e.target.value);

										if (e.target.value !== "All Categories") {
											setShowRegistrationSuccess(true);
											setTimeout(() => setShowRegistrationSuccess(false), 2000);
										}
									}}
								>
									{CATEGORIES.map((category, index) => (
										<option key={index} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							<div className="filter-group">
								<label className="filter-label">Location</label>
								<select
									className="filter-select"
									value={selectedLocation}
									onChange={(e) => {
										setSelectedLocation(e.target.value);

										if (e.target.value !== "All Locations") {
											setShowRegistrationSuccess(true);
											setTimeout(() => setShowRegistrationSuccess(false), 2000);
										}
									}}
								>
									{LOCATIONS.map((location, index) => (
										<option key={index} value={location}>
											{location}
										</option>
									))}
								</select>
							</div>

							<div className="filter-group">
								<label className="filter-label">Date</label>
								<input
									type="date"
									className="date-input"
									value={selectedDate}
									onChange={(e) => {
										setSelectedDate(e.target.value);

										if (e.target.value) {
											setShowRegistrationSuccess(true);
											setTimeout(() => setShowRegistrationSuccess(false), 2000);
										}
									}}
								/>
							</div>

							<div className="filters-actions">
								<button
									className="clear-filters-button"
									onClick={() => {
										clearFilters();

										setShowRegistrationSuccess(true);
										setTimeout(() => setShowRegistrationSuccess(false), 2000);
									}}
									aria-label="Clear all filters"
								>
									Clear All
								</button>
								<button
									className="apply-filters-button"
									onClick={() => {
										setShowFilters(false);

										if (
											selectedCategory !== "All Categories" ||
											selectedLocation !== "All Locations" ||
											selectedDate
										) {
											setShowRegistrationSuccess(true);
											setTimeout(() => setShowRegistrationSuccess(false), 2000);
										}
									}}
									aria-label="Apply filters"
								>
									Apply Filters
								</button>
							</div>
						</div>
					)}
				</header>

				{}
				<main className="main-content">
					{}
					<div className="view-navigation">
						<button
							className={`view-button ${
								activeView === "featured" ? "active" : ""
							}`}
							onClick={() => {
								changeView("featured");

								if (activeView !== "featured") {
									setShowRegistrationSuccess(true);
									setTimeout(() => setShowRegistrationSuccess(false), 2000);
								}
							}}
							aria-label="Show featured events"
							aria-pressed={activeView === "featured"}
						>
							Featured
						</button>
						<button
							className={`view-button ${activeView === "list" ? "active" : ""}`}
							onClick={() => {
								changeView("list");

								if (activeView !== "list") {
									setShowRegistrationSuccess(true);
									setTimeout(() => setShowRegistrationSuccess(false), 2000);
								}
							}}
							aria-label="Show all events"
							aria-pressed={activeView === "list"}
						>
							All Events
						</button>
						<button
							className={`view-button ${activeView === "map" ? "active" : ""}`}
							onClick={() => {
								changeView("map");

								if (activeView !== "map") {
									setShowRegistrationSuccess(true);
									setTimeout(() => setShowRegistrationSuccess(false), 2000);
								}
							}}
							aria-label="Show map view"
							aria-pressed={activeView === "map"}
						>
							Map
						</button>
					</div>

					{}
					{activeView === "featured" && renderFeaturedEvents()}
					{activeView === "list" && renderEventsList()}
					{activeView === "map" && renderMap()}
				</main>

				{}
				<nav className="bottom-navigation">
					<button
						className={`nav-button ${
							activeView === "featured" ? "active" : ""
						}`}
						onClick={() => {
							changeView("featured");

							if (activeView !== "featured") {
								setShowRegistrationSuccess(true);
								setTimeout(() => setShowRegistrationSuccess(false), 2000);
							}
						}}
						aria-label="Show featured events"
						aria-pressed={activeView === "featured"}
					>
						<Calendar size={20} />
						<span>Featured</span>
					</button>
					<button
						className={`nav-button ${activeView === "list" ? "active" : ""}`}
						onClick={() => {
							changeView("list");

							if (activeView !== "list") {
								setShowRegistrationSuccess(true);
								setTimeout(() => setShowRegistrationSuccess(false), 2000);
							}
						}}
						aria-label="Show all events"
						aria-pressed={activeView === "list"}
					>
						<Search size={20} />
						<span>Explore</span>
					</button>
					<button
						className={`nav-button ${activeView === "map" ? "active" : ""}`}
						onClick={() => {
							changeView("map");

							if (activeView !== "map") {
								setShowRegistrationSuccess(true);
								setTimeout(() => setShowRegistrationSuccess(false), 2000);
							}
						}}
						aria-label="Show map view"
						aria-pressed={activeView === "map"}
					>
						<MapPin size={20} />
						<span>Map</span>
					</button>
				</nav>

				{}
				{showEventDetails && renderEventDetails()}
			</div>
		</>
	);
};

export default Eventy;
