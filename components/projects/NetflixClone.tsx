"use client";

import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
	BsPlayFill,
	BsPauseFill,
	BsPlus,
	BsHandThumbsUp,
	BsInfoCircle,
	BsSearch,
	BsBell,
	BsVolumeUp,
	BsVolumeMute,
	BsFullscreen,
} from "react-icons/bs";
import { RiArrowDropDownFill } from "react-icons/ri";

interface Movie {
	id: string;
	title: string;
	img: string;
	description: string;
	genre: string[];
	year: number;
	rating: string;
	duration: string;
	videoUrl?: string;
}

interface Category {
	id: string;
	title: string;
	movies: Movie[];
}

export default function NetflixCloneExport() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [videoProgress, setVideoProgress] = useState(0);
	const [showControls, setShowControls] = useState(true);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
	const searchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const updateProgress = () => {
			if (videoRef.current) {
				const progress =
					(videoRef.current.currentTime / videoRef.current.duration) * 100;
				setVideoProgress(progress);
			}
		};

		const videoElement = videoRef.current;
		if (videoElement) {
			videoElement.addEventListener("timeupdate", updateProgress);
		}

		return () => {
			if (videoElement) {
				videoElement.removeEventListener("timeupdate", updateProgress);
			}
		};
	}, [isPlaying, selectedMovie]);

	useEffect(() => {
		const hideControls = () => {
			if (isPlaying) {
				setShowControls(false);
			}
		};

		if (controlsTimerRef.current) {
			clearTimeout(controlsTimerRef.current);
		}

		if (showControls) {
			controlsTimerRef.current = setTimeout(hideControls, 3000);
		}

		return () => {
			if (controlsTimerRef.current) {
				clearTimeout(controlsTimerRef.current);
			}
		};
	}, [showControls, isPlaying]);

	// Close search when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setSearchOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const demoVideoUrl =
		"https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js";

	const videoSources = [
		"https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
		"https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
	];

	const featuredMovie: Movie = {
		id: "featured-1",
		title: "Stranger Things 4",
		img: "https://c4.wallpaperflare.com/wallpaper/462/921/235/stranger-things-5k-wallpaper-preview.jpg",
		description:
			"When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
		genre: ["Sci-Fi", "Horror", "Drama"],
		year: 2022,
		rating: "TV-14",
		duration: "4 Seasons",
		videoUrl: videoSources[0],
	};

	const getRandomVideoUrl = () => {
		const randomIndex = Math.floor(Math.random() * videoSources.length);
		return videoSources[randomIndex];
	};

	const categories: Category[] = [
		{
			id: "trending",
			title: "Trending Now",
			movies: [
				{
					id: "trend-1",
					title: "Stranger Things",
					img: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
					description:
						"In 1980s Indiana, a group of young friends witness supernatural forces and secret government exploits.",
					genre: ["Drama", "Fantasy", "Horror"],
					year: 2016,
					rating: "TV-14",
					duration: "4 Seasons",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "trend-2",
					title: "The Witcher",
					img: "https://cdn.theatlantic.com/thumbor/t0i76cz5I8Yq4rrymyekNrStTgc=/0x512:6000x3887/976x549/media/img/mt/2019/12/TheWitcher_101_Unit_06900_RT.fk3ph4dhp/original.jpg",
					description:
						"Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
					genre: ["Fantasy", "Action", "Adventure"],
					year: 2019,
					rating: "TV-MA",
					duration: "2 Seasons",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "trend-3",
					title: "Extraction",
					img: "https://image.tmdb.org/t/p/w500/wlfDxbGEsW58vGhFljKkcR5IxDj.jpg",
					description:
						"A hardened mercenary's mission becomes a soul-searching race to survive when he's sent into Bangladesh to rescue a drug lord's kidnapped son.",
					genre: ["Action", "Thriller"],
					year: 2020,
					rating: "R",
					duration: "1h 56m",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "trend-4",
					title: "Squid Game",
					img: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
					description:
						"Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
					genre: ["Drama", "Thriller", "Action"],
					year: 2021,
					rating: "TV-MA",
					duration: "1 Season",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "trend-5",
					title: "Don't Look Up",
					img: "https://m.media-amazon.com/images/M/MV5BMjhhNWFjNzctYTJjOS00MDc0LThiNjItZmM0ZDVmMWViY2UzXkEyXkFqcGc@._V1_.jpg",
					description:
						"Two astronomers go on a media tour to warn humanity of a planet-killing comet hurtling toward Earth.",
					genre: ["Comedy", "Drama"],
					year: 2021,
					rating: "R",
					duration: "2h 18m",
					videoUrl: getRandomVideoUrl(),
				},
			],
		},
		{
			id: "toppicks",
			title: "Top Picks For You",
			movies: [
				{
					id: "pick-1",
					title: "Breaking Bad",
					img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
					description:
						"A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
					genre: ["Drama", "Crime", "Thriller"],
					year: 2008,
					rating: "TV-MA",
					duration: "5 Seasons",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "pick-2",
					title: "Money Heist",
					img: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
					description:
						"An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
					genre: ["Crime", "Drama", "Thriller"],
					year: 2017,
					rating: "TV-MA",
					duration: "5 Seasons",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "pick-3",
					title: "Lupin",
					img: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
					description:
						"Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.",
					genre: ["Crime", "Mystery", "Drama"],
					year: 2021,
					rating: "TV-MA",
					duration: "2 Seasons",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "pick-4",
					title: "Dark",
					img: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
					description:
						"A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
					genre: ["Drama", "Mystery", "Sci-Fi"],
					year: 2017,
					rating: "TV-MA",
					duration: "3 Seasons",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "pick-5",
					title: "The Queen's Gambit",
					img: "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
					description:
						"In a Kentucky orphanage in the 1950s, a young girl discovers an astonishing talent for chess while struggling with addiction.",
					genre: ["Drama"],
					year: 2020,
					rating: "TV-MA",
					duration: "Limited Series",
					videoUrl: getRandomVideoUrl(),
				},
			],
		},
		{
			id: "newreleases",
			title: "New Releases",
			movies: [
				{
					id: "new-1",
					title: "Enola Holmes",
					img: "https://image.tmdb.org/t/p/w500/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
					description:
						"While searching for her missing mother, intrepid teen Enola Holmes uses her sleuthing skills to outsmart big brother Sherlock and help a runaway lord.",
					genre: ["Adventure", "Crime", "Drama"],
					year: 2020,
					rating: "PG-13",
					duration: "2h 3m",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "new-2",
					title: "Army of the Dead",
					img: "https://image.tmdb.org/t/p/w500/z8CExJekGrEThbpMXAmCFvvgoJR.jpg",
					description:
						"Following a zombie outbreak in Las Vegas, a group of mercenaries take the ultimate gamble, venturing into the quarantine zone to pull off the greatest heist ever attempted.",
					genre: ["Action", "Horror", "Thriller"],
					year: 2021,
					rating: "R",
					duration: "2h 28m",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "new-3",
					title: "Sweet Tooth",
					img: "https://editorial.rottentomatoes.com/wp-content/uploads/2023/03/sweet-tooth-s2-10-700x380-1.jpg",
					description:
						"On a perilous adventure across a post-apocalyptic world, a lovable boy who's half-human and half-deer searches for a new beginning with a gruff protector.",
					genre: ["Drama", "Fantasy", "Adventure"],
					year: 2021,
					rating: "TV-14",
					duration: "2 Seasons",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "new-4",
					title: "Outside the Wire",
					img: "https://image.tmdb.org/t/p/w500/uZkNbB8isWXHMDNoIbqXvmslBMC.jpg",
					description:
						"In the near future, a drone pilot sent into a war zone finds himself paired with a top-secret android officer on a mission to stop a nuclear attack.",
					genre: ["Action", "Adventure", "Sci-Fi"],
					year: 2021,
					rating: "R",
					duration: "1h 55m",
					videoUrl: getRandomVideoUrl(),
				},
				{
					id: "new-5",
					title: "Shadow and Bone",
					img: "https://m.media-amazon.com/images/M/MV5BZWM1NTJiNzUtYTJlYy00NWYyLTliNjUtN2FjNzdkOWQxNWRjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
					description:
						"Dark forces conspire against orphan mapmaker Alina Starkov when she unleashes an extraordinary power that could change the fate of her war-torn world.",
					genre: ["Fantasy", "Drama", "Action"],
					year: 2021,
					rating: "TV-14",
					duration: "1 Season",
					videoUrl: getRandomVideoUrl(),
				},
			],
		},
	];

	const playMovie = (movie: Movie) => {
		setSelectedMovie(movie);
		setIsPlaying(true);

		window.scrollTo({ top: 0, behavior: "smooth" });

		setShowControls(true);

		setTimeout(() => {
			if (videoRef.current) {
				videoRef.current.play().catch((err) => {
					console.error("Error playing video:", err);
				});
			}
		}, 300);
	};

	const togglePlay = () => {
		if (videoRef.current) {
			if (videoRef.current.paused) {
				videoRef.current.play();
				setIsPlaying(true);
			} else {
				videoRef.current.pause();
				setIsPlaying(false);
			}
		}
	};

	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !videoRef.current.muted;
			setIsMuted(!isMuted);
		}
	};

	const setVideoTime = (e: React.MouseEvent<HTMLDivElement>) => {
		if (videoRef.current) {
			const progressBar = e.currentTarget;
			const rect = progressBar.getBoundingClientRect();
			const pos = (e.clientX - rect.left) / rect.width;
			videoRef.current.currentTime = pos * videoRef.current.duration;
			setVideoProgress(pos * 100);
		}
	};

	const toggleFullscreen = () => {
		if (videoRef.current) {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				videoRef.current.requestFullscreen();
			}
		}
	};

	const closePlayer = () => {
		if (videoRef.current) {
			videoRef.current.pause();
		}
		setIsPlaying(false);
		setTimeout(() => setSelectedMovie(null), 500);
	};

	const handleMouseMove = () => {
		setShowControls(true);
	};

	const filteredMovies = searchQuery
		? categories.flatMap((category) =>
				category.movies.filter(
					(movie) =>
						movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						movie.genre.some((g) =>
							g.toLowerCase().includes(searchQuery.toLowerCase())
						)
				)
		  )
		: [];

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<main className="min-h-screen bg-black text-white overflow-x-hidden">
			{!isPlaying && (
				<nav
					className={`fixed top-0 w-full z-50 flex items-center justify-between px-2 xs:px-4 md:px-16 py-3 md:py-4 transition-all duration-500 ${
						isScrolled
							? "bg-black"
							: "bg-gradient-to-b from-black/80 to-transparent"
					}`}
				>
					<div className="flex items-center space-x-2 xs:space-x-4 md:space-x-8">
						<h1 className="text-xl xs:text-2xl md:text-3xl font-bold text-red-600 cursor-pointer">
							NETFLUX
						</h1>
						<div className="hidden md:flex gap-6 text-sm text-gray-300">
							<button className="hover:text-white transition cursor-pointer">
								Home
							</button>
							<button className="hover:text-white transition cursor-pointer">
								TV Shows
							</button>
							<button className="hover:text-white transition cursor-pointer">
								Movies
							</button>
							<button className="hover:text-white transition cursor-pointer">
								New & Popular
							</button>
							<button className="hover:text-white transition cursor-pointer">
								My List
							</button>
							<button className="hover:text-white transition cursor-pointer">
								Browse by Languages
							</button>
						</div>
						<div className="md:hidden text-xs xs:text-sm">
							<button
								className="flex items-center gap-1 text-white cursor-pointer"
								onClick={toggleMobileMenu}
							>
								Browse <RiArrowDropDownFill size={20} />
							</button>

							{/* Mobile Menu Dropdown */}
							{mobileMenuOpen && (
								<div className="absolute top-12 left-2 right-2 bg-black/95 border border-gray-800 rounded-md shadow-lg z-50 py-2">
									<button className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition">
										Home
									</button>
									<button className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition">
										TV Shows
									</button>
									<button className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition">
										Movies
									</button>
									<button className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition">
										New & Popular
									</button>
									<button className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition">
										My List
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center space-x-2 xs:space-x-4">
						<div className="relative" ref={searchRef}>
							<div
								className={`flex items-center transition-all duration-300 ${
									searchOpen
										? "bg-black border border-white w-full xs:w-40 sm:w-64"
										: "bg-transparent w-8 xs:w-10"
								}`}
							>
								<button
									onClick={() => setSearchOpen(!searchOpen)}
									className="p-1 xs:p-2 cursor-pointer"
								>
									<BsSearch size={16} />
								</button>
								<input
									type="text"
									placeholder="Titles, people, genres"
									className={`bg-transparent outline-none text-xs xs:text-sm text-white ${
										searchOpen ? "w-full opacity-100" : "w-0 opacity-0"
									} transition-all duration-300`}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							{searchOpen && searchQuery && (
								<div className="absolute top-10 xs:top-12 right-0 w-48 xs:w-56 sm:w-72 bg-black border border-gray-700 rounded shadow-lg max-h-80 overflow-y-auto z-50">
									{filteredMovies.length > 0 ? (
										filteredMovies.map((movie) => (
											<div
												key={movie.id}
												className="flex items-center p-2 hover:bg-gray-800 cursor-pointer"
												onClick={() => {
													playMovie(movie);
													setSearchOpen(false);
													setSearchQuery("");
												}}
											>
												<img
													src={movie.img}
													alt={movie.title}
													className="w-8 xs:w-12 h-12 xs:h-16 object-cover rounded mr-2 xs:mr-3"
												/>
												<div>
													<p className="text-white text-xs xs:text-sm font-medium">
														{movie.title}
													</p>
													<p className="text-gray-400 text-xs">
														{movie.genre.join(", ")}
													</p>
												</div>
											</div>
										))
									) : (
										<div className="p-4 text-gray-400 text-xs xs:text-sm">
											No results found for "{searchQuery}"
										</div>
									)}
								</div>
							)}
						</div>

						<button className="p-1 xs:p-2 cursor-pointer hidden xs:block">
							<BsBell size={16} />
						</button>

						<div className="flex items-center space-x-1 xs:space-x-2 cursor-pointer">
							<img
								src="https://wallpapers.com/images/hd/netflix-profile-pictures-5yup5hd2i60x7ew3.jpg"
								alt="Profile"
								className="w-6 h-6 xs:w-8 xs:h-8 rounded"
							/>
							<RiArrowDropDownFill size={20} className="hidden xs:block" />
						</div>
					</div>
				</nav>
			)}

			{isPlaying && selectedMovie && (
				<div className="fixed inset-0 bg-black z-40 flex flex-col">
					<div
						className="relative w-full pt-[56.25%] bg-gray-900 overflow-hidden"
						onMouseMove={handleMouseMove}
					>
						<video
							ref={videoRef}
							className="absolute inset-0 w-full h-full object-contain bg-black"
							src={selectedMovie.videoUrl}
							autoPlay
							onClick={togglePlay}
							onEnded={() => setIsPlaying(false)}
						/>

						<div
							className={`absolute inset-0 flex flex-col justify-between p-2 xs:p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
								showControls ? "opacity-100" : "opacity-0"
							}`}
						>
							<div className="flex justify-between items-center">
								<h2 className="text-lg xs:text-xl sm:text-2xl font-bold truncate pr-2">
									{selectedMovie.title}
								</h2>
								<button
									onClick={closePlayer}
									className="text-white px-2 xs:px-4 py-1 rounded cursor-pointer"
								>
									<X size={20} />
								</button>
							</div>

							<div>
								<div
									className="w-full h-1.5 xs:h-2 bg-gray-600 rounded-full mb-2 xs:mb-4 cursor-pointer"
									onClick={setVideoTime}
								>
									<div
										className="bg-red-600 h-1.5 xs:h-2 rounded-full"
										style={{ width: `${videoProgress}%` }}
									></div>
								</div>

								<div className="flex justify-between items-center">
									<div className="flex space-x-2 xs:space-x-4">
										<button
											onClick={togglePlay}
											className="bg-white text-black rounded-full p-1.5 xs:p-2 cursor-pointer"
										>
											{isPlaying ? (
												<BsPauseFill size={16} className="xs:hidden" />
											) : (
												<BsPlayFill size={16} className="xs:hidden" />
											)}
											{isPlaying ? (
												<BsPauseFill size={24} className="hidden xs:block" />
											) : (
												<BsPlayFill size={24} className="hidden xs:block" />
											)}
										</button>
										<button
											onClick={toggleMute}
											className="border border-gray-400 rounded-full p-1.5 xs:p-2 text-white cursor-pointer"
										>
											{isMuted ? (
												<BsVolumeMute size={14} className="xs:hidden" />
											) : (
												<BsVolumeUp size={14} className="xs:hidden" />
											)}
											{isMuted ? (
												<BsVolumeMute size={20} className="hidden xs:block" />
											) : (
												<BsVolumeUp size={20} className="hidden xs:block" />
											)}
										</button>
										<button className="border border-gray-400 rounded-full p-1.5 xs:p-2 text-white cursor-pointer hidden xs:block">
											<BsPlus size={14} className="xs:hidden" />
											<BsPlus size={20} className="hidden xs:block" />
										</button>
										<button className="border border-gray-400 rounded-full p-1.5 xs:p-2 text-white cursor-pointer hidden sm:block">
											<BsHandThumbsUp size={14} className="xs:hidden" />
											<BsHandThumbsUp size={20} className="hidden xs:block" />
										</button>
									</div>
									<button
										onClick={toggleFullscreen}
										className="border border-gray-400 rounded-full p-1.5 xs:p-2 text-white cursor-pointer"
									>
										<BsFullscreen size={14} className="xs:hidden" />
										<BsFullscreen size={20} className="hidden xs:block" />
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="p-3 xs:p-4 sm:p-6 bg-black">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="w-full md:w-2/3">
								<div className="flex flex-wrap items-center gap-2 mb-3 xs:mb-4 text-xs xs:text-sm">
									<span className="text-green-500 font-bold">98% Match</span>
									<span className="border border-gray-500 px-1 text-xs">
										{selectedMovie.rating}
									</span>
									<span>{selectedMovie.duration}</span>
									<span className="border border-gray-500 px-1 text-xs">
										HD
									</span>
								</div>

								<p className="text-gray-300 text-xs xs:text-sm mb-3 xs:mb-4">
									{selectedMovie.description}
								</p>

								<div className="text-gray-400 text-xs xs:text-sm">
									<p>
										<span className="text-gray-500">Genres:</span>{" "}
										{selectedMovie.genre.join(", ")}
									</p>
									<p>
										<span className="text-gray-500">Released:</span>{" "}
										{selectedMovie.year}
									</p>
								</div>
							</div>

							<div className="w-full md:w-1/3 mt-4 md:mt-0">
								<h3 className="text-gray-500 text-xs xs:text-sm mb-1 xs:mb-2">
									Cast:
								</h3>
								<p className="text-gray-300 text-xs xs:text-sm">
									Cast information would appear here
								</p>

								<h3 className="text-gray-500 text-xs xs:text-sm mt-3 xs:mt-4 mb-1 xs:mb-2">
									Director:
								</h3>
								<p className="text-gray-300 text-xs xs:text-sm">
									Director information would appear here
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			<section className="relative min-h-[85vh] xs:min-h-screen">
				<div className="absolute top-0 left-0 w-full h-full">
					<img
						src={featuredMovie.img}
						alt={featuredMovie.title}
						className="w-full h-full object-cover"
					/>

					<div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
					<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
				</div>

				<div className="relative pt-24 xs:pt-32 sm:pt-40 md:pt-48 px-2 xs:px-4 md:px-16 min-h-[85vh] xs:min-h-screen flex flex-col justify-center">
					<div className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg">
						<h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold mb-2 xs:mb-4">
							{featuredMovie.title}
						</h1>

						<div className="flex flex-wrap items-center gap-2 mb-2 xs:mb-4 text-xs xs:text-sm">
							<span className="text-green-500 font-bold">98% Match</span>
							<span>{featuredMovie.year}</span>
							<span className="border border-gray-500 px-1">
								{featuredMovie.rating}
							</span>
							<span>{featuredMovie.duration}</span>
						</div>

						<p className="text-gray-300 text-xs xs:text-sm mb-4 xs:mb-6">
							{featuredMovie.description}
						</p>

						<div className="flex space-x-2 xs:space-x-4">
							<button
								onClick={() => playMovie(featuredMovie)}
								className="flex items-center bg-white hover:bg-opacity-80 text-black py-1.5 xs:py-2 px-3 xs:px-6 rounded font-bold transition cursor-pointer text-xs xs:text-sm"
							>
								<BsPlayFill size={18} className="mr-1 xs:mr-2" /> Play
							</button>
							<button className="flex items-center bg-gray-600 hover:bg-gray-700 text-white py-1.5 xs:py-2 px-3 xs:px-6 rounded font-bold transition cursor-pointer text-xs xs:text-sm">
								<BsInfoCircle size={16} className="mr-1 xs:mr-2" /> More Info
							</button>
						</div>
					</div>
				</div>
			</section>

			<div className="relative mt-[-100px] xs:mt-[-120px] sm:mt-[-150px] pb-16 xs:pb-20 z-10 px-2 xs:px-4 md:px-16 space-y-10 xs:space-y-16">
				{categories.map((category) => (
					<div key={category.id} className="category">
						<h2 className="text-lg xs:text-xl md:text-2xl font-bold mb-2 xs:mb-4">
							{category.title}
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3 md:gap-4">
							{category.movies.map((movie) => (
								<div
									key={movie.id}
									className="group relative cursor-pointer overflow-hidden rounded-md"
									onClick={() => playMovie(movie)}
								>
									<div className="aspect-[2/3] overflow-hidden">
										<img
											src={movie.img}
											alt={movie.title}
											className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
										/>
									</div>

									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
										<div className="p-2 xs:p-3">
											<h3 className="font-semibold text-xs xs:text-sm mb-1">
												{movie.title}
											</h3>
											<div className="flex flex-wrap items-center text-xs space-x-1 xs:space-x-2 mb-1 xs:mb-2">
												<span className="text-green-500">
													{Math.floor(Math.random() * 30) + 70}% Match
												</span>
												<span className="border border-gray-500 px-1 text-xs">
													{movie.rating}
												</span>
												<span className="text-xs truncate">
													{movie.duration}
												</span>
											</div>
											<div className="flex space-x-1 xs:space-x-2 mt-1 xs:mt-2">
												<button className="bg-white text-black rounded-full p-1 cursor-pointer">
													<BsPlayFill size={12} className="xs:hidden" />
													<BsPlayFill size={16} className="hidden xs:block" />
												</button>
												<button className="border border-gray-400 rounded-full p-1 text-white cursor-pointer">
													<BsPlus size={10} className="xs:hidden" />
													<BsPlus size={14} className="hidden xs:block" />
												</button>
												<button className="border border-gray-400 rounded-full p-1 text-white cursor-pointer hidden xs:block">
													<BsHandThumbsUp size={10} className="xs:hidden" />
													<BsHandThumbsUp
														size={14}
														className="hidden xs:block"
													/>
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			<footer className="bg-black py-6 xs:py-10 px-2 xs:px-4 md:px-16 text-gray-500 text-xs xs:text-sm">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-wrap gap-3 mb-4 xs:mb-6">
						<a href="#" className="cursor-pointer hover:text-gray-300">
							Facebook
						</a>
						<a href="#" className="cursor-pointer hover:text-gray-300">
							Instagram
						</a>
						<a href="#" className="cursor-pointer hover:text-gray-300">
							Twitter
						</a>
						<a href="#" className="cursor-pointer hover:text-gray-300">
							YouTube
						</a>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 xs:gap-4 mb-6 xs:mb-8">
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Audio Description
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Help Center
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Gift Cards
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Media Center
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Investor Relations
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Jobs
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Terms of Use
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Privacy
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Legal Notices
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Cookie Preferences
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Corporate Information
						</a>
						<a href="#" className="text-xs cursor-pointer hover:text-gray-300">
							Contact Us
						</a>
					</div>

					<button className="border border-gray-500 px-2 py-1 text-xs mb-4 cursor-pointer">
						Service Code
					</button>

					<p className="text-xs">© 2023-2025 Netflix, Inc.</p>
				</div>
			</footer>
		</main>
	);
}
