"use client";
import React, { useState, useEffect, useRef } from "react";

interface Author {
	name: string;
	date: string;
}

interface TravelPost {
	id: string;
	title: string;
	excerpt: string;
	imageUrl: string;
	author: Author;
	category: string;
	isFeatured?: boolean;
}

interface Category {
	id: string;
	name: string;
}

interface AvatarProps {
	name: string;
	size?: number;
	className?: string;
}

interface ToastProps {
	message: string;
	isVisible: boolean;
	onClose: () => void;
}

interface MobileDropdowns {
	destinations: boolean;
	guides: boolean;
	about: boolean;
	contact: boolean;
}

interface ToastState {
	visible: boolean;
	message: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 40, className = "" }) => {
	const getInitials = (nameStr: string): string => {
		const parts = nameStr.split(" ");
		if (parts.length > 1) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		return parts[0].substring(0, 2).toUpperCase();
	};

	const initials = getInitials(name);

	const stringToColor = (str: string) => {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const colors = [
			"#3B82F6",
			"#8B5CF6",
			"#EC4899",
			"#10B981",
			"#F59E0B",
			"#EF4444",
			"#6366F1",
			"#14B8A6",
		];
		return colors[Math.abs(hash) % colors.length];
	};

	const bgColor = stringToColor(name);

	return (
		<div
			className={`flex items-center justify-center rounded-full text-white shadow-md ${className}`}
			style={{
				width: `${size}px`,
				height: `${size}px`,
				minWidth: `${size}px`,
				backgroundColor: bgColor,
			}}
		>
			<span className={`font-medium ${size <= 32 ? "text-xs" : "text-sm"}`}>
				{initials}
			</span>
		</div>
	);
};

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				onClose();
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [isVisible, onClose]);

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
			<div className="px-4 py-3 rounded-lg bg-gray-800 text-white shadow-xl flex items-center transform transition-all duration-300 hover:translate-y-1">
				<span>{message}</span>
				<button
					className="ml-3 text-gray-300 hover:text-white transition-colors"
					onClick={onClose}
				>
					<svg
						className="w-4 h-4"
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
		</div>
	);
};

const categories: Category[] = [
	{ id: "all", name: "View all" },
	{ id: "asia", name: "Asia" },
	{ id: "europe", name: "Europe" },
	{ id: "north-america", name: "North America" },
	{ id: "south-america", name: "South America" },
	{ id: "africa", name: "Africa" },
	{ id: "oceania", name: "Oceania" },
];

const unsplashImages = [
	"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1491555103944-7c647fd857e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1589330694653-ded6df03f754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
	"https://images.unsplash.com/photo-1504214208698-ea1916a2195a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
];

const travelPosts: TravelPost[] = [
	{
		id: "1",
		title: "Two Weeks in Japan: Finding Serenity in Kyoto's Ancient Temples",
		excerpt:
			"Walking through the bamboo groves of Arashiyama at dawn, I found myself completely alone with the whispers of history. The gentle rustle of leaves and the distant chanting from nearby temples created a moment of perfect tranquility that I'd been searching for since leaving the chaos of Tokyo three days earlier.",
		imageUrl: unsplashImages[0],
		author: {
			name: "Emma Wilkinson",
			date: "20 Jan 2024",
		},
		category: "asia",
		isFeatured: true,
	},
	{
		id: "2",
		title: "A Weekend in Barcelona: Architecture and Tapas",
		excerpt:
			"The city of Gaudí never disappoints. From the organic curves of Casa Batlló to the late-night energy of the Gothic Quarter, Barcelona offers a perfect blend of visual beauty and culinary delight.",
		imageUrl: unsplashImages[1],
		author: {
			name: "Emma Wilkinson",
			date: "15 Jan 2024",
		},
		category: "europe",
	},
	{
		id: "3",
		title: "Solo Hiking the Inca Trail to Machu Picchu",
		excerpt:
			"Four days of challenging terrain, breathtaking vistas, and unexpected friendships. The ancient path to the lost city of the Incas taught me more about myself than any journey before...",
		imageUrl: unsplashImages[2],
		author: {
			name: "Emma Wilkinson",
			date: "10 Jan 2024",
		},
		category: "south-america",
	},
	{
		id: "4",
		title: "The Hidden Beaches of Portugal's Algarve Coast",
		excerpt:
			"Beyond the tourist hotspots lies a series of secluded coves accessible only by boat or narrow cliff trails. These pristine beaches offer perfect solitude and the clearest waters I've ever seen...",
		imageUrl: unsplashImages[3],
		author: {
			name: "Emma Wilkinson",
			date: "7 Jan 2024",
		},
		category: "europe",
	},
	{
		id: "5",
		title: "Street Food Journey Through Vietnam",
		excerpt:
			"From the pho stalls of Hanoi to the banh mi carts of Ho Chi Minh City, my month-long culinary adventure revealed how deeply food is woven into Vietnamese culture and daily life...",
		imageUrl: unsplashImages[4],
		author: {
			name: "Emma Wilkinson",
			date: "5 Jan 2024",
		},
		category: "asia",
	},
	{
		id: "6",
		title: "Winter Magic in the Swiss Alps",
		excerpt:
			"The village of Zermatt sits in the shadow of the Matterhorn, offering not just world-class skiing but a glimpse into alpine traditions that have remained unchanged for generations.",
		imageUrl: unsplashImages[5],
		author: {
			name: "Emma Wilkinson",
			date: "30 Dec 2023",
		},
		category: "europe",
	},
	{
		id: "7",
		title: "Island Hopping in Greece: Beyond Santorini",
		excerpt:
			"While Santorini gets all the attention, the lesser-known islands of Milos, Folegandros, and Sifnos offer equally stunning landscapes without the crowds. My two weeks sailing the Cyclades revealed...",
		imageUrl: unsplashImages[6],
		author: {
			name: "Emma Wilkinson",
			date: "14 Dec 2023",
		},
		category: "europe",
	},
	{
		id: "8",
		title: "Safari Adventures in Kenya: Witnessing the Great Migration",
		excerpt:
			"The thundering hooves of wildebeest crossing the Mara River is a spectacle that defies description. Our three days in the Maasai Mara provided wildlife encounters that will stay with me forever...",
		imageUrl: unsplashImages[7],
		author: {
			name: "Emma Wilkinson",
			date: "5 Dec 2023",
		},
		category: "africa",
	},
	{
		id: "9",
		title: "Exploring the Great Barrier Reef: A Diver's Paradise",
		excerpt:
			"Descending into the crystal clear waters off the coast of Cairns, I was immediately surrounded by a kaleidoscope of colors as fish darted between the ancient coral formations...",
		imageUrl: unsplashImages[8],
		author: {
			name: "Emma Wilkinson",
			date: "28 Nov 2023",
		},
		category: "oceania",
	},
	{
		id: "10",
		title: "Road Tripping Through America's National Parks",
		excerpt:
			"From the carved spires of Bryce Canyon to the geothermal wonders of Yellowstone, our month-long journey through eight national parks showcased the incredible diversity of America's landscapes...",
		imageUrl: unsplashImages[9],
		author: {
			name: "Emma Wilkinson",
			date: "15 Nov 2023",
		},
		category: "north-america",
	},
];

const EnhancedTravelBlog: React.FC = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
	const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [activePost, setActivePost] = useState<TravelPost | null>(null);

	const [toast, setToast] = useState<ToastState>({
		visible: false,
		message: "",
	});

	const dropdownRef = useRef<HTMLDivElement>(null);
	const postsPerPage = 4;

	const [mobileDropdowns, setMobileDropdowns] = useState<MobileDropdowns>({
		destinations: false,
		guides: false,
		about: false,
		contact: false,
	});

	const showToast = (message: string): void => {
		setToast({ visible: true, message });
	};

	const handleNoFunctionButton = (text: string): void => {
		showToast(text);
	};

	useEffect(() => {
		const updateHeaderHeight = (): void => {
			const headerElement = document.querySelector("header");
			if (headerElement) {
				const height = headerElement.offsetHeight;
				document.documentElement.style.setProperty(
					"--header-height",
					`${height}px`
				);
			}
		};

		updateHeaderHeight();
		window.addEventListener("resize", updateHeaderHeight);

		const handleClickOutside = (event: MouseEvent): void => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setActiveMenu(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("resize", updateHeaderHeight);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const toggleMenu = (menu: string): void => {
		if (activeMenu === menu) {
			setActiveMenu(null);
		} else {
			setActiveMenu(menu);
		}
	};

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	const handleSubscribe = (): void => {
		setIsSubscribed(!isSubscribed);
		showToast(
			isSubscribed
				? "Unsubscribed from newsletter"
				: "Subscribed to newsletter!"
		);
	};

	const toggleMobileDropdown = (dropdown: keyof MobileDropdowns): void => {
		setMobileDropdowns((prev) => ({
			...prev,
			[dropdown]: !prev[dropdown],
		}));
	};

	const filteredPosts = travelPosts.filter((post) => {
		const matchesSearch =
			searchQuery === "" ||
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory =
			selectedCategory === "all" || post.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedCategory, searchQuery]);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

	const handleNextPage = (): void => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);

			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};

	const handlePrevPage = (): void => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);

			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};

	const handleNavItemClick = (item: string): void => {
		showToast(
			`Navigated to: ${item.replace("-mobile", "").replace(/-/g, " ")}`
		);
		setMobileMenuOpen(false);
	};

	const SinglePostView = (): JSX.Element | null => {
		if (!activePost) return null;

		return (
			<div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
				<button
					onClick={() => setActivePost(null)}
					className={`mb-6 flex items-center text-sm font-medium ${
						darkMode ? "hover:text-teal-400" : "hover:text-teal-600"
					} transition-colors duration-200 cursor-pointer`}
				>
					<svg
						className="h-5 w-5 mr-2"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15 10H5m0 0l4-4m-4 4l4 4"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					Back to articles
				</button>

				<article>
					<div
						className={`mb-6 inline-block px-3 py-1 text-xs rounded-full font-medium ${
							darkMode
								? "bg-teal-900/30 text-teal-300"
								: "bg-teal-100 text-teal-800"
						}`}
					>
						{categories.find((cat) => cat.id === activePost.category)?.name}
					</div>

					<h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif leading-tight">
						{activePost.title}
					</h1>

					<div className="flex items-center mb-8">
						<Avatar name={activePost.author.name} size={48} className="mr-4" />
						<div>
							<div className="font-medium">{activePost.author.name}</div>
							<div
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								{activePost.author.date} •{" "}
								{Math.ceil(activePost.excerpt.length / 100)} min read
							</div>
						</div>
					</div>

					<div className="mb-8 rounded-xl overflow-hidden max-h-96 shadow-xl transform transition-transform duration-500 hover:scale-[1.01]">
						<img
							src={activePost.imageUrl}
							alt={activePost.title}
							className="w-full h-full object-cover"
						/>
					</div>

					<div className="prose max-w-none mb-10 font-sans lg:text-lg">
						<p className="mb-4">{activePost.excerpt}</p>

						<p className="mb-4">
							{activePost.category === "asia"
								? "The ancient temples stood as silent witnesses to centuries of history, their weathered stones whispering tales of emperors and monks, wars and peace. As the morning mist curled around the pagodas, I found myself transported to another time."
								: activePost.category === "europe"
								? "The cobblestone streets wound through the old town, each turn revealing another architectural marvel. Cafés spilled onto plazas where locals gathered, their animated conversations adding to the vibrant atmosphere that defines European charm."
								: activePost.category === "africa"
								? "The savanna stretched to the horizon, a sea of golden grass swaying in the breeze. Wildlife moved in elegant procession across this timeless landscape, seemingly unaware of our presence as we watched in awe."
								: activePost.category === "north-america"
								? "The vastness of the landscape was humbling, from towering redwoods to plunging canyons. Each national park offered its own distinct character, a testament to the incredible diversity of the American wilderness."
								: activePost.category === "south-america"
								? "The Andean peaks pierced the clouds, creating a dramatic backdrop to the ancient ruins. Local communities maintained traditions passed down through generations, their colorful textiles and warm hospitality making every encounter memorable."
								: "The crystal-clear waters revealed a kaleidoscope of marine life, with coral formations creating an underwater metropolis. Island time moved at its own pace, encouraging a slower, more mindful approach to experiencing this paradise."}
						</p>

						<p className="mb-4">
							Travel has a way of shifting our perspective, opening our eyes to
							new possibilities and ways of living. Whether navigating busy
							markets filled with unfamiliar spices and crafts, or finding
							solitude in natural landscapes untouched by time, each journey
							leaves an indelible mark on our understanding of the world and
							ourselves.
						</p>

						<p className="mb-4">
							The local cuisine became a highlight of my stay. Each meal was a
							cultural education, introducing flavors and cooking techniques
							passed down through generations. Market vendors and restaurant
							chefs alike took pride in sharing their culinary heritage, often
							accompanied by stories that added context and depth to the
							experience.
						</p>

						<h2 className="text-2xl font-semibold mt-8 mb-4 font-serif">
							Unexpected Discoveries
						</h2>

						<p className="mb-4">
							It's often the unplanned moments that become the most treasured
							memories. A wrong turn led me to a hidden courtyard where an
							elderly artisan had been crafting traditional items for over six
							decades. The afternoon spent in conversation with him, watching
							his practiced hands work with remarkable precision, taught me more
							about the culture than any guidebook could offer.
						</p>

						<p className="mb-8">
							As my journey came to an end, I found myself already planning a
							return. There are places that capture your imagination and others
							that capture your heart. This destination had somehow managed to
							do both, leaving me with a renewed sense of wonder and a deeper
							appreciation for the incredible diversity of our world.
						</p>
					</div>

					<div
						className={`p-6 border-t ${
							darkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<h3 className="text-xl font-semibold mb-4 font-serif">
							Share this article
						</h3>
						<div className="flex space-x-4">
							<button
								className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
									darkMode
										? "bg-gray-800 hover:bg-teal-800"
										: "bg-gray-100 hover:bg-teal-100"
								}`}
								onClick={() => handleNoFunctionButton("Shared on Twitter")}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
								</svg>
							</button>
							<button
								className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
									darkMode
										? "bg-gray-800 hover:bg-teal-800"
										: "bg-gray-100 hover:bg-teal-100"
								}`}
								onClick={() => handleNoFunctionButton("Shared on Facebook")}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
								</svg>
							</button>
							<button
								className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
									darkMode
										? "bg-gray-800 hover:bg-teal-800"
										: "bg-gray-100 hover:bg-teal-100"
								}`}
								onClick={() => handleNoFunctionButton("Shared on Instagram")}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</button>
							<button
								className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
									darkMode
										? "bg-gray-800 hover:bg-teal-800"
										: "bg-gray-100 hover:bg-teal-100"
								}`}
								onClick={() => handleNoFunctionButton("Shared on YouTube")}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
								</svg>
							</button>
						</div>
					</div>

					<div
						className={`mt-10 border-t pt-10 ${
							darkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<h3 className="text-xl font-semibold mb-6 font-serif">
							Related Articles
						</h3>
						<div className="grid md:grid-cols-3 gap-6">
							{travelPosts
								.filter(
									(relatedPost) =>
										relatedPost.id !== activePost.id &&
										relatedPost.category === activePost.category
								)
								.slice(0, 3)
								.map((relatedPost) => (
									<div
										key={relatedPost.id}
										className={`block rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
											darkMode
												? "bg-gray-800/70 hover:bg-gray-800"
												: "bg-white hover:bg-gray-50 shadow-md"
										}`}
										onClick={() => {
											setActivePost(relatedPost);
											window.scrollTo(0, 0);
										}}
									>
										<div className="h-40">
											<img
												src={relatedPost.imageUrl}
												alt={relatedPost.title}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="p-4">
											<h4 className="font-medium mb-2 font-serif line-clamp-2">
												{relatedPost.title}
											</h4>
											<div className="flex items-center text-xs">
												<span
													className={
														darkMode ? "text-gray-400" : "text-gray-500"
													}
												>
													{relatedPost.author.date}
												</span>
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				</article>
			</div>
		);
	};

	const bgColor = darkMode ? "bg-gray-900" : "bg-gray-50";
	const contentBg = darkMode ? "bg-gray-900" : "bg-white";
	const textColor = darkMode ? "text-white" : "text-gray-800";
	const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
	const headerBg = darkMode ? "bg-gray-900/90" : "bg-white/90";
	const inputBg = darkMode ? "bg-gray-800" : "bg-white";
	const inputFocusBg = darkMode ? "bg-gray-700" : "bg-white";
	const placeholderColor = darkMode
		? "placeholder-gray-400"
		: "placeholder-gray-500";
	const hoverBg = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";
	const activeBg = darkMode ? "bg-teal-900/30" : "bg-teal-50";
	const buttonHoverColor = darkMode
		? "hover:text-teal-400"
		: "hover:text-teal-600";
	const dropdownBg = darkMode ? "bg-gray-800" : "bg-white";
	const dropdownHoverBg = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
	const footerBg = darkMode ? "bg-teal-900" : "bg-teal-800";
	const footerText = darkMode ? "text-teal-50" : "text-teal-50";
	const mobileNavBg = darkMode ? "bg-gray-800" : "bg-white";
	const grayText = darkMode ? "text-gray-400" : "text-gray-500";
	const primaryAccent = darkMode ? "text-teal-400" : "text-teal-600";
	const primaryButton = darkMode
		? "bg-teal-600 hover:bg-teal-700"
		: "bg-teal-600 hover:bg-teal-700";
	const primaryButtonText = "text-white";
	const cardBg = darkMode ? "bg-gray-800/50" : "bg-white";

	return (
		<div
			className={`${bgColor} ${textColor} min-h-screen flex flex-col transition-colors duration-300 font-sans overflow-x-hidden relative`}
			style={{ "--header-height": "140px" } as React.CSSProperties}
		>
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div
					className={`absolute inset-0 opacity-5 ${
						darkMode ? "bg-black" : "bg-teal-700"
					}`}
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				></div>
			</div>

			<Toast
				message={toast.message}
				isVisible={toast.visible}
				onClose={() => setToast({ ...toast, visible: false })}
			/>

			{mobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-50"
					onClick={() => setMobileMenuOpen(false)}
				>
					<div
						className={`fixed top-0 left-0 bottom-0 w-64 ${mobileNavBg} transform transition-transform duration-300 shadow-lg animate-slide-in`}
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className={`p-4 border-b ${borderColor} flex justify-between items-center`}
						>
							<div className="flex items-center space-x-2">
								<svg
									className="h-6 w-6 text-teal-500"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3.5 10C3.5 7.791 3.5 6.686 4.243 5.943C4.986 5.2 6.091 5.2 8.3 5.2H15.7C17.909 5.2 19.014 5.2 19.757 5.943C20.5 6.686 20.5 7.791 20.5 10V14C20.5 16.209 20.5 17.314 19.757 18.057C19.014 18.8 17.909 18.8 15.7 18.8H8.3C6.091 18.8 4.986 18.8 4.243 18.057C3.5 17.314 3.5 16.209 3.5 14V10Z"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
									<path
										d="M9 14V10L13 12L9 14Z"
										fill="currentColor"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="font-semibold font-serif">Wanderlust</span>
							</div>
							<button
								onClick={() => setMobileMenuOpen(false)}
								className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
							>
								<svg
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
						<nav className="p-4">
							<ul className="space-y-3">
								<li>
									<div
										className={`block py-2 px-4 rounded-lg ${hoverBg} cursor-pointer`}
										onClick={() => handleNavItemClick("home")}
									>
										Home
									</div>
								</li>

								<li>
									<div className="relative">
										<div
											className={`flex items-center justify-between py-2 px-4 rounded-lg ${hoverBg} cursor-pointer`}
											onClick={() => toggleMobileDropdown("destinations")}
										>
											<span>Destinations</span>
											<svg
												className={`h-4 w-4 transition-transform duration-200 ${
													mobileDropdowns.destinations
														? "transform rotate-180"
														: ""
												}`}
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M4 6l4 4 4-4"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>

										{mobileDropdowns.destinations && (
											<div className="pl-4 mt-1 border-l-2 ml-4 space-y-1 animate-fade-in-up border-teal-500">
												{categories.slice(1).map((category) => (
													<div
														key={category.id}
														className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
														onClick={() => {
															setSelectedCategory(category.id);
															handleNavItemClick("destinations");
														}}
													>
														{category.name}
													</div>
												))}
											</div>
										)}
									</div>
								</li>

								<li>
									<div className="relative">
										<div
											className={`flex items-center justify-between py-2 px-4 rounded-lg ${hoverBg} cursor-pointer`}
											onClick={() => toggleMobileDropdown("guides")}
										>
											<span>Travel Guides</span>
											<svg
												className={`h-4 w-4 transition-transform duration-200 ${
													mobileDropdowns.guides ? "transform rotate-180" : ""
												}`}
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M4 6l4 4 4-4"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>

										{mobileDropdowns.guides && (
											<div className="pl-4 mt-1 border-l-2 ml-4 space-y-1 animate-fade-in-up border-teal-500">
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("city-guides")}
												>
													City Guides
												</div>
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("solo-travel")}
												>
													Solo Travel
												</div>
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("budget-travel")}
												>
													Budget Travel
												</div>
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("luxury-travel")}
												>
													Luxury Travel
												</div>
											</div>
										)}
									</div>
								</li>

								<li>
									<div
										className={`block py-2 px-4 rounded-lg ${hoverBg} cursor-pointer`}
										onClick={() => handleNavItemClick("essays")}
									>
										Photo Essays
									</div>
								</li>

								<li>
									<div className="relative">
										<div
											className={`flex items-center justify-between py-2 px-4 rounded-lg ${hoverBg} cursor-pointer`}
											onClick={() => toggleMobileDropdown("about")}
										>
											<span>About</span>
											<svg
												className={`h-4 w-4 transition-transform duration-200 ${
													mobileDropdowns.about ? "transform rotate-180" : ""
												}`}
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M4 6l4 4 4-4"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>

										{mobileDropdowns.about && (
											<div className="pl-4 mt-1 border-l-2 ml-4 space-y-1 animate-fade-in-up border-teal-500">
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("our-story")}
												>
													Our Story
												</div>
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("meet-emma")}
												>
													Meet Emma
												</div>
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("photography")}
												>
													Photography
												</div>
											</div>
										)}
									</div>
								</li>

								<li>
									<div className="relative">
										<div
											className={`flex items-center justify-between py-2 px-4 rounded-lg ${hoverBg} cursor-pointer`}
											onClick={() => toggleMobileDropdown("contact")}
										>
											<span>Contact</span>
											<svg
												className={`h-4 w-4 transition-transform duration-200 ${
													mobileDropdowns.contact ? "transform rotate-180" : ""
												}`}
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M4 6l4 4 4-4"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>

										{mobileDropdowns.contact && (
											<div className="pl-4 mt-1 border-l-2 ml-4 space-y-1 animate-fade-in-up border-teal-500">
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("email")}
												>
													Email Me
												</div>
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("collaboration")}
												>
													Collaboration
												</div>
												<div
													className={`block py-2 px-4 rounded-lg text-sm ${hoverBg} cursor-pointer`}
													onClick={() => handleNavItemClick("report")}
												>
													Report an Issue
												</div>
											</div>
										)}
									</div>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			)}

			<header
				className={`fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md transition-colors duration-300 ${headerBg} border-b ${borderColor} shadow-md`}
			>
				<div className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<button
							className="md:hidden mr-2 cursor-pointer"
							onClick={() => setMobileMenuOpen(true)}
							aria-label="Open menu"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
						<div
							className="flex items-center space-x-2 cursor-pointer"
							onClick={() => setActivePost(null)}
						>
							<svg
								className="h-6 w-6 text-teal-500"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3.5 10C3.5 7.791 3.5 6.686 4.243 5.943C4.986 5.2 6.091 5.2 8.3 5.2H15.7C17.909 5.2 19.014 5.2 19.757 5.943C20.5 6.686 20.5 7.791 20.5 10V14C20.5 16.209 20.5 17.314 19.757 18.057C19.014 18.8 17.909 18.8 15.7 18.8H8.3C6.091 18.8 4.986 18.8 4.243 18.057C3.5 17.314 3.5 16.209 3.5 14V10Z"
									stroke="currentColor"
									strokeWidth="1.5"
								/>
								<path
									d="M9 14V10L13 12L9 14Z"
									fill="currentColor"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="font-semibold text-teal-500">Wanderlust</span>
						</div>
					</div>

					<nav
						className="hidden md:flex items-center space-x-6"
						ref={dropdownRef}
					>
						<div
							className={`text-sm font-medium transition-colors duration-200 hover:text-teal-500 cursor-pointer`}
							onClick={() => handleNavItemClick("home")}
						>
							Home
						</div>

						<div className="relative">
							<div
								className="flex items-center space-x-1 cursor-pointer hover:text-teal-500 transition-colors duration-200"
								onClick={() => toggleMenu("destinations")}
							>
								<span className="text-sm font-medium">Destinations</span>
								<svg
									className={`h-4 w-4 transition-transform duration-200 ${
										activeMenu === "destinations" ? "transform rotate-180" : ""
									}`}
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M4 6l4 4 4-4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>

							{activeMenu === "destinations" && (
								<div
									className={`absolute left-0 mt-2 w-48 rounded-lg py-1 z-50 ${dropdownBg} border ${borderColor} transition-all duration-200 opacity-100 animate-fade-in-up shadow-xl`}
								>
									{categories.slice(1).map((category) => (
										<div
											key={category.id}
											className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
											onClick={() => {
												setSelectedCategory(category.id);
												setActiveMenu(null);
											}}
										>
											{category.name}
										</div>
									))}
								</div>
							)}
						</div>

						<div className="relative">
							<div
								className="flex items-center space-x-1 cursor-pointer hover:text-teal-500 transition-colors duration-200"
								onClick={() => toggleMenu("guides")}
							>
								<span className="text-sm font-medium">Travel Guides</span>
								<svg
									className={`h-4 w-4 transition-transform duration-200 ${
										activeMenu === "guides" ? "transform rotate-180" : ""
									}`}
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M4 6l4 4 4-4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>

							{activeMenu === "guides" && (
								<div
									className={`absolute left-0 mt-2 w-48 rounded-lg py-1 z-50 ${dropdownBg} border ${borderColor} transition-all duration-200 opacity-100 animate-fade-in-up shadow-xl`}
								>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("city-guides");
											setActiveMenu(null);
										}}
									>
										City Guides
									</div>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("solo-travel");
											setActiveMenu(null);
										}}
									>
										Solo Travel
									</div>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("budget-travel");
											setActiveMenu(null);
										}}
									>
										Budget Travel
									</div>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("luxury-travel");
											setActiveMenu(null);
										}}
									>
										Luxury Travel
									</div>
								</div>
							)}
						</div>

						<div
							className="text-sm font-medium transition-colors duration-200 hover:text-teal-500 cursor-pointer"
							onClick={() => handleNavItemClick("essays")}
						>
							Photo Essays
						</div>

						<div className="relative">
							<div
								className="flex items-center space-x-1 cursor-pointer hover:text-teal-500 transition-colors duration-200"
								onClick={() => toggleMenu("about")}
							>
								<span className="text-sm font-medium">About</span>
								<svg
									className={`h-4 w-4 transition-transform duration-200 ${
										activeMenu === "about" ? "transform rotate-180" : ""
									}`}
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M4 6l4 4 4-4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>

							{activeMenu === "about" && (
								<div
									className={`absolute left-0 mt-2 w-48 rounded-lg py-1 z-50 ${dropdownBg} border ${borderColor} transition-all duration-200 opacity-100 animate-fade-in-up shadow-xl`}
								>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("our-story");
											setActiveMenu(null);
										}}
									>
										Our Story
									</div>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("meet-emma");
											setActiveMenu(null);
										}}
									>
										Meet Emma
									</div>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("photography");
											setActiveMenu(null);
										}}
									>
										Photography
									</div>
								</div>
							)}
						</div>

						<div className="relative">
							<div
								className="flex items-center space-x-1 cursor-pointer hover:text-teal-500 transition-colors duration-200"
								onClick={() => toggleMenu("contact")}
							>
								<span className="text-sm font-medium">Contact</span>
								<svg
									className={`h-4 w-4 transition-transform duration-200 ${
										activeMenu === "contact" ? "transform rotate-180" : ""
									}`}
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M4 6l4 4 4-4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>

							{activeMenu === "contact" && (
								<div
									className={`absolute right-0 mt-2 w-48 rounded-lg py-1 z-50 ${dropdownBg} border ${borderColor} transition-all duration-200 opacity-100 animate-fade-in-up shadow-xl`}
								>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("email");
											setActiveMenu(null);
										}}
									>
										Email Me
									</div>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("collaboration");
											setActiveMenu(null);
										}}
									>
										Collaboration
									</div>
									<div
										className={`block px-4 py-2 text-sm ${dropdownHoverBg} cursor-pointer`}
										onClick={() => {
											handleNavItemClick("report");
											setActiveMenu(null);
										}}
									>
										Report an Issue
									</div>
								</div>
							)}
						</div>
					</nav>

					<div className="flex items-center space-x-4">
						<button
							onClick={() => setDarkMode(!darkMode)}
							className={`p-2 rounded-full transition-colors cursor-pointer ${
								darkMode
									? "bg-gray-700 hover:bg-gray-600"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							aria-label="Toggle dark mode"
						>
							{darkMode ? (
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
										fillRule="evenodd"
										clipRule="evenodd"
									></path>
								</svg>
							) : (
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
								</svg>
							)}
						</button>
						<button
							onClick={handleSubscribe}
							className={`${
								isSubscribed
									? darkMode
										? "bg-green-600 hover:bg-green-700"
										: "bg-green-600 hover:bg-green-700"
									: primaryButton
							} ${primaryButtonText} px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
						>
							{isSubscribed ? "Subscribed ✓" : "Subscribe"}
						</button>
					</div>
				</div>
				<div className="w-full max-w-6xl mx-auto px-4 py-3">
					<div className="relative">
						<input
							type="text"
							placeholder="Search travel stories..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={`w-full px-4 py-2 rounded-full ${inputBg} border ${borderColor} ${placeholderColor} focus:${inputFocusBg} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors shadow-sm`}
						/>
						<svg
							className="h-5 w-5 absolute right-3 top-2.5 text-gray-500"
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
			</header>

			<main
				className="flex-1 relative z-10"
				style={{ marginTop: "var(--header-height)" }}
			>
				{activePost ? (
					<SinglePostView />
				) : (
					<div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
						<div className={`border-b pb-8 mb-8 ${borderColor}`}>
							<span
								className={`inline-block rounded-full px-3 py-1 text-xs mb-4 font-medium ${
									darkMode
										? "bg-teal-900/30 text-teal-300"
										: "bg-teal-100 text-teal-800"
								}`}
							>
								Travel Journal
							</span>
							<h1 className="text-3xl sm:text-4xl font-semibold mb-6 font-serif leading-tight">
								Exploring the World{" "}
								<span className={primaryAccent}>One Step at a Time</span>
							</h1>
							<div className="flex flex-col md:flex-row md:items-center">
								<Avatar
									name="Emma Wilkinson"
									size={64}
									className="mr-4 mb-4 md:mb-0"
								/>
								<div>
									<h2 className="text-xl font-medium font-serif">
										Emma Wilkinson
									</h2>
									<p
										className={`${
											darkMode ? "text-gray-300" : "text-gray-600"
										} font-sans`}
									>
										Travel writer, photographer, and full-time nomad since 2018.
										I've explored 47 countries across 6 continents, always
										seeking the stories and moments that make each place unique.
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col md:flex-row gap-8">
							<aside className="w-full md:w-48 flex-shrink-0">
								<div
									className={`flex items-center text-sm font-medium mb-4 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
										selectedCategory === "all" ? activeBg : hoverBg
									}`}
									onClick={() => setSelectedCategory("all")}
								>
									<svg
										className="h-5 w-5 mr-2 text-teal-500"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M4 10h12M10 4v12"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									View all
								</div>
								<ul className="space-y-2">
									{categories.slice(1).map((category) => (
										<li
											key={category.id}
											className={`px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
												selectedCategory === category.id ? activeBg : hoverBg
											}`}
											onClick={() => setSelectedCategory(category.id)}
										>
											<span className="text-sm">{category.name}</span>
										</li>
									))}
								</ul>
							</aside>

							<div className="flex-1">
								<div className="mb-6">
									<h2 className="text-xl font-semibold font-serif">
										{selectedCategory === "all"
											? "All Destinations"
											: categories.find((cat) => cat.id === selectedCategory)
													?.name}
									</h2>
									<p className={`text-sm ${grayText}`}>
										Showing {filteredPosts.length}{" "}
										{filteredPosts.length === 1 ? "story" : "stories"}
										{filteredPosts.length > 0 &&
											` (Page ${currentPage} of ${totalPages})`}
									</p>
								</div>

								{currentPage === 1 &&
									currentPosts
										.filter((post) => post.isFeatured)
										.map((post) => (
											<div
												key={post.id}
												className={`block rounded-xl overflow-hidden mb-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
													darkMode
														? "bg-gray-800/50 hover:bg-gray-800"
														: "bg-white hover:bg-gray-50 shadow-md"
												}`}
												onClick={() => {
													setActivePost(post);
													window.scrollTo(0, 0);
												}}
											>
												<div className="md:flex">
													<div className="md:w-2/5">
														<div className="h-64 md:h-full relative">
															<img
																src={post.imageUrl}
																alt={post.title}
																className="h-full w-full object-cover"
															/>
															<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
														</div>
													</div>
													<div className="p-6 md:w-3/5">
														<span
															className={`inline-block rounded-full px-3 py-1 text-xs mb-3 w-auto max-w-max font-medium ${
																darkMode
																	? "bg-teal-900/30 text-teal-300"
																	: "bg-teal-100 text-teal-800"
															}`}
														>
															{
																categories.find(
																	(cat) => cat.id === post.category
																)?.name
															}
														</span>
														<h2 className="text-xl font-semibold mb-4 font-serif">
															{post.title}
														</h2>
														<p
															className={`${
																darkMode ? "text-gray-300" : "text-gray-600"
															} mb-6 font-sans line-clamp-3`}
														>
															{post.excerpt}
														</p>
														<div className="flex items-center">
															<Avatar
																name={post.author.name}
																size={40}
																className="mr-3"
															/>
															<div>
																<div className="font-medium">
																	{post.author.name}
																</div>
																<div className={`text-sm ${grayText}`}>
																	{post.author.date}
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}

								<div className="grid md:grid-cols-2 gap-6">
									{currentPosts
										.filter((post) => !post.isFeatured || currentPage > 1)
										.map((post) => (
											<div
												key={post.id}
												className={`block rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${cardBg} hover:shadow-xl ${
													darkMode
														? "bg-gray-800/50 hover:bg-gray-800"
														: "shadow-md hover:bg-gray-50"
												}`}
												onClick={() => {
													setActivePost(post);
													window.scrollTo(0, 0);
												}}
											>
												<div className="h-48 relative">
													<img
														src={post.imageUrl}
														alt={post.title}
														className="h-full w-full object-cover"
													/>
													<div
														className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300`}
													></div>
												</div>
												<div className="p-6 flex flex-col flex-1">
													<span
														className={`inline-block rounded-full px-3 py-1 text-xs mb-3 w-auto max-w-max font-medium ${
															darkMode
																? "bg-teal-900/30 text-teal-300"
																: "bg-teal-100 text-teal-800"
														}`}
													>
														{
															categories.find((cat) => cat.id === post.category)
																?.name
														}
													</span>
													<h3 className="text-lg font-semibold mb-3 font-serif">
														{post.title}
													</h3>
													<p
														className={`${
															darkMode ? "text-gray-300" : "text-gray-600"
														} mb-6 flex-1 font-sans line-clamp-3`}
													>
														{post.excerpt}
													</p>
													<div className="flex justify-between items-center mt-2">
														<div className="flex items-center">
															<Avatar
																name={post.author.name}
																size={32}
																className="mr-3"
															/>
															<div>
																<div className="text-sm font-medium">
																	{post.author.name}
																</div>
																<div className={`text-xs ${grayText}`}>
																	{post.author.date}
																</div>
															</div>
														</div>
														<div className={`${primaryAccent}`}>
															<svg
																className="h-5 w-5"
																viewBox="0 0 20 20"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M5 10h10m0 0l-4-4m4 4l-4 4"
																	stroke="currentColor"
																	strokeWidth="1.5"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
															</svg>
														</div>
													</div>
												</div>
											</div>
										))}
								</div>

								{currentPosts.length === 0 && (
									<div
										className={`text-center py-12 rounded-lg ${
											darkMode ? "bg-gray-800/50" : "bg-white shadow-md"
										}`}
									>
										<svg
											className="mx-auto h-12 w-12 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1}
												d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<h3 className="mt-2 text-lg font-medium font-serif">
											No stories found
										</h3>
										<p className={`mt-1 ${grayText} font-sans`}>
											Try adjusting your search or filter to find what you're
											looking for.
										</p>
									</div>
								)}

								{filteredPosts.length > 0 && (
									<div className={`mt-8 pt-6 border-t ${borderColor}`}>
										<div className="flex justify-between items-center">
											<button
												onClick={handlePrevPage}
												disabled={currentPage === 1}
												className={`flex items-center text-sm font-medium ${
													currentPage === 1
														? darkMode
															? "text-gray-600 cursor-not-allowed"
															: "text-gray-400 cursor-not-allowed"
														: buttonHoverColor + " cursor-pointer"
												}`}
											>
												<svg
													className={`h-5 w-5 mr-2 ${
														currentPage === 1 ? "opacity-50" : ""
													}`}
													viewBox="0 0 20 20"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M15 10H5m0 0l4-4m-4 4l4 4"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
												Previous
											</button>

											<div className="flex space-x-2">
												{Array.from(
													{ length: totalPages },
													(_, i) => i + 1
												).map((page) => (
													<button
														key={page}
														onClick={() => setCurrentPage(page)}
														className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors duration-200 cursor-pointer ${
															currentPage === page
																? darkMode
																	? "bg-teal-600 text-white"
																	: "bg-teal-600 text-white"
																: darkMode
																? "text-gray-300 hover:bg-gray-800"
																: "text-gray-600 hover:bg-gray-100"
														}`}
													>
														{page}
													</button>
												))}
											</div>

											<button
												onClick={handleNextPage}
												disabled={currentPage === totalPages}
												className={`flex items-center text-sm font-medium ${
													currentPage === totalPages
														? darkMode
															? "text-gray-600 cursor-not-allowed"
															: "text-gray-400 cursor-not-allowed"
														: buttonHoverColor + " cursor-pointer"
												}`}
											>
												Next
												<svg
													className={`h-5 w-5 ml-2 ${
														currentPage === totalPages ? "opacity-50" : ""
													}`}
													viewBox="0 0 20 20"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M5 10h10m0 0l-4-4m4 4l-4 4"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</main>

			<footer className={`mt-auto ${footerBg} ${footerText}`}>
				<div className="bg-teal-700 text-teal-50 py-4">
					<div className="w-full max-w-6xl mx-auto px-4">
						<div className="flex flex-col sm:flex-row justify-between items-center">
							<div className="text-center sm:text-left mb-4 sm:mb-0">
								<p className="text-sm font-medium">
									Join 25,000+ travelers receiving inspiration, tips & exclusive
									offers
								</p>
							</div>
							<div className="flex">
								<input
									type="email"
									placeholder="Your email address"
									className="bg-teal-800/80 text-white px-4 py-2 rounded-l-full outline-none placeholder-teal-200 focus:bg-teal-800 w-64"
								/>
								<button className="bg-white text-teal-800 font-medium px-4 py-2 rounded-r-full hover:bg-teal-50 transition-colors">
									Subscribe
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="py-12">
					<div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
						<div className="col-span-2 sm:col-span-3 lg:col-span-1">
							<div className="flex items-center space-x-2 mb-4">
								<svg
									className="h-6 w-6"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3.5 10C3.5 7.791 3.5 6.686 4.243 5.943C4.986 5.2 6.091 5.2 8.3 5.2H15.7C17.909 5.2 19.014 5.2 19.757 5.943C20.5 6.686 20.5 7.791 20.5 10V14C20.5 16.209 20.5 17.314 19.757 18.057C19.014 18.8 17.909 18.8 15.7 18.8H8.3C6.091 18.8 4.986 18.8 4.243 18.057C3.5 17.314 3.5 16.209 3.5 14V10Z"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
									<path
										d="M9 14V10L13 12L9 14Z"
										fill="currentColor"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="font-semibold">Wanderlust</span>
							</div>
							<p className="text-sm font-sans">
								Sharing stories from around the world to inspire your next
								adventure.
							</p>

							<div className="mt-4 flex space-x-3">
								<div
									className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center text-white cursor-pointer hover:bg-teal-600 transition-colors"
									onClick={() =>
										handleNoFunctionButton("Instagram profile opened")
									}
								>
									<svg
										className="h-4 w-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
								</div>
								<div
									className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center text-white cursor-pointer hover:bg-teal-600 transition-colors"
									onClick={() =>
										handleNoFunctionButton("Pinterest profile opened")
									}
								>
									<svg
										className="h-4 w-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										path
										<path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
									</svg>
								</div>
								<div
									className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center text-white cursor-pointer hover:bg-teal-600 transition-colors"
									onClick={() => handleNoFunctionButton("Facebook page opened")}
								>
									<svg
										className="h-4 w-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
									</svg>
								</div>
								<div
									className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center text-white cursor-pointer hover:bg-teal-600 transition-colors"
									onClick={() =>
										handleNoFunctionButton("YouTube channel opened")
									}
								>
									<svg
										className="h-4 w-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
									</svg>
								</div>
							</div>
						</div>

						<div className="col-span-2 sm:col-span-3 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
							<div>
								<h4 className="font-semibold mb-4 font-serif">Destinations</h4>
								<ul className="space-y-2 text-sm">
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() => handleNoFunctionButton("Browsing Asia")}
										>
											Asia
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() => handleNoFunctionButton("Browsing Europe")}
										>
											Europe
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Browsing North America")
											}
										>
											North America
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Browsing South America")
											}
										>
											South America
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() => handleNoFunctionButton("Browsing Africa")}
										>
											Africa
										</div>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-4 font-serif">Travel Guides</h4>
								<ul className="space-y-2 text-sm">
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Viewing City Guides")
											}
										>
											City Guides
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Viewing Solo Travel Guides")
											}
										>
											Solo Travel
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Viewing Budget Travel Tips")
											}
										>
											Budget Travel
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Viewing Luxury Travel Options")
											}
										>
											Luxury Travel
										</div>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-4 font-serif">Resources</h4>
								<ul className="space-y-2 text-sm">
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() => handleNoFunctionButton("About Me page")}
										>
											About Me
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Subscribed to newsletter")
											}
										>
											Newsletter
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Photography portfolio")
											}
										>
											Photography
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Viewing Travel Map")
											}
										>
											Travel Map
										</div>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-4 font-serif">Social</h4>
								<ul className="space-y-2 text-sm">
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Instagram profile opened")
											}
										>
											Instagram
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Pinterest profile opened")
											}
										>
											Pinterest
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("Facebook page opened")
											}
										>
											Facebook
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() =>
												handleNoFunctionButton("YouTube channel opened")
											}
										>
											YouTube
										</div>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-4 font-serif">Legal</h4>
								<ul className="space-y-2 text-sm">
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() => handleNoFunctionButton("Terms of Service")}
										>
											Terms
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() => handleNoFunctionButton("Privacy Policy")}
										>
											Privacy
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() => handleNoFunctionButton("Cookie Policy")}
										>
											Cookies
										</div>
									</li>
									<li>
										<div
											className="hover:text-teal-300 transition-colors cursor-pointer"
											onClick={() => handleNoFunctionButton("Contact Form")}
										>
											Contact
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="mt-8 pt-8 border-t border-teal-800/30 text-center text-sm mx-auto max-w-6xl px-4">
						<div className="flex flex-col md:flex-row justify-between items-center">
							<p>
								© {new Date().getFullYear()} Wanderlust Journal. All rights
								reserved.
							</p>
							<p className="mt-2 md:mt-0">
								Crafted with ❤️ by travel enthusiasts
							</p>
						</div>
					</div>
				</div>
			</footer>

			<style jsx global>{`
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

				@keyframes slideIn {
					from {
						transform: translateX(-100%);
					}
					to {
						transform: translateX(0);
					}
				}

				@keyframes pulse {
					0% {
						box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4);
					}
					70% {
						box-shadow: 0 0 0 10px rgba(20, 184, 166, 0);
					}
					100% {
						box-shadow: 0 0 0 0 rgba(20, 184, 166, 0);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.5s ease-in-out;
				}

				.animate-fade-in-up {
					animation: fadeInUp 0.5s ease-out;
				}

				.animate-slide-in {
					animation: slideIn 0.3s ease-in-out;
				}

				.animate-pulse {
					animation: pulse 2s infinite;
				}

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.line-clamp-3 {
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				::-webkit-scrollbar {
					width: 10px;
				}

				::-webkit-scrollbar-track {
					background: rgba(229, 231, 235, 0.1);
				}

				::-webkit-scrollbar-thumb {
					background: rgba(20, 184, 166, 0.5);
					border-radius: 5px;
				}

				::-webkit-scrollbar-thumb:hover {
					background: rgba(20, 184, 166, 0.7);
				}

				html {
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}

				.dark .transition-colors {
					transition-duration: 400ms;
				}

				*:focus-visible {
					outline: 2px solid rgba(20, 184, 166, 0.6);
					outline-offset: 2px;
				}
			`}</style>
		</div>
	);
};

export default EnhancedTravelBlog;
