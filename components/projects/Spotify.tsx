"use client";
import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	useRef,
} from "react";
import {
	Home,
	Search,
	Library,
	Heart,
	Plus,
	Play,
	Pause,
	SkipBack,
	SkipForward,
	Volume2,
	Repeat,
	Shuffle,
	User,
	X,
	ChevronLeft,
	ChevronRight,
	Volume1,
	VolumeX,
	Repeat1,
} from "lucide-react";

interface Song {
	id: number;
	title: string;
	artist: string;
	album: string;
	duration: string;
	durationInSeconds: number;
	coverUrl: string;
	audioUrl?: string;
}

interface Playlist {
	id: number;
	name: string;
	description: string;
	coverUrl: string;
	songs: Song[];
	createdBy: string;
}

interface Category {
	id: number;
	name: string;
	coverUrl: string;
}

interface AppContextType {
	currentPage: string;
	setCurrentPage: (page: string) => void;
	currentPlaylist: Playlist | null;
	setCurrentPlaylist: (playlist: Playlist | null) => void;
	isPlaying: boolean;
	setIsPlaying: (isPlaying: boolean) => void;
	currentSong: Song | null;
	setCurrentSong: (song: Song | null) => void;
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	searchResults: Playlist[];
	windowWidth: number;
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;

	currentTime: number;
	setCurrentTime: (time: number) => void;
	duration: number;
	setDuration: (duration: number) => void;
	volume: number;
	setVolume: (volume: number) => void;
	isMuted: boolean;
	setIsMuted: (muted: boolean) => void;
	isRepeat: "off" | "all" | "one";
	setIsRepeat: (repeat: "off" | "all" | "one") => void;
	isShuffle: boolean;
	setIsShuffle: (shuffle: boolean) => void;
	playNextSong: () => void;
	playPreviousSong: () => void;
	togglePlay: () => void;

	queue: Song[];
	addToQueue: (song: Song) => void;
	removeFromQueue: (songId: number) => void;
	history: Song[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const songs: Song[] = [
	{
		id: 1,
		title: "Blinding Lights",
		artist: "The Weeknd",
		album: "After Hours",
		duration: "3:20",
		durationInSeconds: 200,
		coverUrl:
			"https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?q=80&w=2076&auto=format&fit=crop",
		audioUrl: "https://example.com/audio/blinding-lights.mp3",
	},
	{
		id: 2,
		title: "Bad Guy",
		artist: "Billie Eilish",
		album: "When We All Fall Asleep, Where Do We Go?",
		duration: "3:14",
		durationInSeconds: 194,
		coverUrl:
			"https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop",
		audioUrl: "https://example.com/audio/bad-guy.mp3",
	},
	{
		id: 3,
		title: "Levitating",
		artist: "Dua Lipa",
		album: "Future Nostalgia",
		duration: "3:23",
		durationInSeconds: 203,
		coverUrl: "https://i.ytimg.com/vi/hldMjKHGpag/maxresdefault.jpg",
		audioUrl: "https://example.com/audio/levitating.mp3",
	},
	{
		id: 4,
		title: "Watermelon Sugar",
		artist: "Harry Styles",
		album: "Fine Line",
		duration: "2:54",
		durationInSeconds: 174,
		coverUrl:
			"https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=2070&auto=format&fit=crop",
		audioUrl: "https://example.com/audio/watermelon-sugar.mp3",
	},
	{
		id: 5,
		title: "Stay",
		artist: "The Kid LAROI, Justin Bieber",
		album: "Stay",
		duration: "2:21",
		durationInSeconds: 141,
		coverUrl:
			"https://images.unsplash.com/photo-1507246207829-732ed643ea0a?q=80&w=2080&auto=format&fit=crop",
		audioUrl: "https://example.com/audio/stay.mp3",
	},
	{
		id: 6,
		title: "Montero (Call Me By Your Name)",
		artist: "Lil Nas X",
		album: "Montero",
		duration: "2:17",
		durationInSeconds: 137,
		coverUrl:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop",
		audioUrl: "https://example.com/audio/montero.mp3",
	},
	{
		id: 7,
		title: "Save Your Tears",
		artist: "The Weeknd & Ariana Grande",
		album: "After Hours (Remix)",
		duration: "3:08",
		durationInSeconds: 188,
		coverUrl:
			"https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1974&auto=format&fit=crop",
		audioUrl: "https://example.com/audio/save-your-tears.mp3",
	},
	{
		id: 8,
		title: "Good 4 U",
		artist: "Olivia Rodrigo",
		album: "Sour",
		duration: "2:58",
		durationInSeconds: 178,
		coverUrl:
			"https://images.unsplash.com/photo-1599467556385-48b57868f038?q=80&w=2070&auto=format&fit=crop",
		audioUrl: "https://example.com/audio/good-4-u.mp3",
	},
];

const playlists: Playlist[] = [
	{
		id: 1,
		name: "Today's Top Hits",
		description: "The biggest hits of today, worldwide",
		coverUrl:
			"https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070&auto=format&fit=crop",
		songs: [songs[0], songs[1], songs[2], songs[3]],
		createdBy: "Spotify",
	},
	{
		id: 2,
		name: "RapCaviar",
		description: "Music from Lil Nas X, Gunna and Polo G",
		coverUrl:
			"https://images.unsplash.com/photo-1505816014357-96b5ff457e9a?q=80&w=2033&auto=format&fit=crop",
		songs: [songs[5], songs[6], songs[2], songs[7]],
		createdBy: "Spotify",
	},
	{
		id: 3,
		name: "Chill Hits",
		description: "Kick back to the best new and recent chill hits",
		coverUrl:
			"https://images.unsplash.com/photo-1459305272254-33a7d593a851?q=80&w=2070&auto=format&fit=crop",
		songs: [songs[3], songs[4], songs[6], songs[1]],
		createdBy: "Spotify",
	},
	{
		id: 4,
		name: "Indie Mix",
		description: "The best indie tracks for your day",
		coverUrl:
			"https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop",
		songs: [songs[7], songs[1], songs[4], songs[2]],
		createdBy: "Spotify",
	},
	{
		id: 5,
		name: "Workout Beats",
		description: "Energy-pumping tracks to fuel your workout",
		coverUrl:
			"https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop",
		songs: [songs[0], songs[4], songs[7], songs[5]],
		createdBy: "Spotify",
	},
	{
		id: 6,
		name: "Relaxing Acoustic",
		description: "Gentle acoustic tracks for relaxation",
		coverUrl:
			"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
		songs: [songs[2], songs[3], songs[1], songs[6]],
		createdBy: "Spotify",
	},
];

const categories: Category[] = [
	{
		id: 1,
		name: "Pop",
		coverUrl:
			"https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 2,
		name: "Hip-Hop",
		coverUrl:
			"https://images.unsplash.com/photo-1504898770365-14faca6a7320?q=80&w=2067&auto=format&fit=crop",
	},
	{
		id: 3,
		name: "Rock",
		coverUrl:
			"https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 4,
		name: "Indie",
		coverUrl:
			"https://images.unsplash.com/photo-1557787163-1635e2efb160?q=80&w=2073&auto=format&fit=crop",
	},
	{
		id: 5,
		name: "Electronic",
		coverUrl:
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 6,
		name: "Acoustic",
		coverUrl:
			"https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 7,
		name: "Workout",
		coverUrl:
			"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 8,
		name: "Party",
		coverUrl:
			"https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop",
	},
];

const filterPlaylists = (term: string): Playlist[] => {
	if (!term) return [];
	const lowerTerm = term.toLowerCase();
	return playlists.filter(
		(playlist) =>
			playlist.name.toLowerCase().includes(lowerTerm) ||
			playlist.description.toLowerCase().includes(lowerTerm) ||
			playlist.songs.some(
				(song) =>
					song.title.toLowerCase().includes(lowerTerm) ||
					song.artist.toLowerCase().includes(lowerTerm)
			)
	);
};

const formatTime = (time: number): string => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

const getRandomIndex = (max: number): number => {
	return Math.floor(Math.random() * max);
};

const Sidebar: React.FC = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("Sidebar must be used within an AppProvider");

	const {
		currentPage,
		setCurrentPage,
		windowWidth,
		isSidebarOpen,
		setIsSidebarOpen,
	} = context;

	const yourPlaylists = playlists.slice(0, 3);

	const sidebarWidth =
		windowWidth <= 320
			? isSidebarOpen
				? "w-full"
				: "w-0"
			: isSidebarOpen
			? "w-64"
			: windowWidth <= 768
			? "w-0"
			: "w-16";

	return (
		<div
			className={`fixed top-0 left-0 h-full bg-black z-30 transition-all duration-300 ${sidebarWidth}`}
		>
			{windowWidth <= 768 && isSidebarOpen && (
				<button
					className="absolute top-4 right-4 text-white hover:text-green-500 cursor-pointer"
					onClick={() => setIsSidebarOpen(false)}
				>
					<X size={windowWidth <= 320 ? 16 : 20} />
				</button>
			)}

			<div className="p-4 sm:p-6">
				<div className="mb-6 sm:mb-8">
					<h1
						className={`text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 ${
							!isSidebarOpen && windowWidth > 768 ? "hidden" : ""
						}`}
					>
						Spotify
					</h1>

					<ul className="space-y-3 sm:space-y-4">
						<li
							className={`flex items-center text-gray-400 hover:text-white cursor-pointer ${
								currentPage === "home" ? "text-white" : ""
							}`}
							onClick={() => {
								setCurrentPage("home");
								if (windowWidth <= 768) setIsSidebarOpen(false);
							}}
						>
							<Home size={windowWidth <= 320 ? 20 : 24} />
							{(isSidebarOpen || windowWidth > 768) && (
								<span
									className={`ml-3 sm:ml-4 text-sm sm:text-base ${
										!isSidebarOpen && windowWidth > 768 ? "hidden" : ""
									}`}
								>
									Home
								</span>
							)}
						</li>
						<li
							className={`flex items-center text-gray-400 hover:text-white cursor-pointer ${
								currentPage === "search" ? "text-white" : ""
							}`}
							onClick={() => {
								setCurrentPage("search");
								if (windowWidth <= 768) setIsSidebarOpen(false);
							}}
						>
							<Search size={windowWidth <= 320 ? 20 : 24} />
							{(isSidebarOpen || windowWidth > 768) && (
								<span
									className={`ml-3 sm:ml-4 text-sm sm:text-base ${
										!isSidebarOpen && windowWidth > 768 ? "hidden" : ""
									}`}
								>
									Search
								</span>
							)}
						</li>
						<li
							className={`flex items-center text-gray-400 hover:text-white cursor-pointer ${
								currentPage === "library" ? "text-white" : ""
							}`}
							onClick={() => {
								setCurrentPage("library");
								if (windowWidth <= 768) setIsSidebarOpen(false);
							}}
						>
							<Library size={windowWidth <= 320 ? 20 : 24} />
							{(isSidebarOpen || windowWidth > 768) && (
								<span
									className={`ml-3 sm:ml-4 text-sm sm:text-base ${
										!isSidebarOpen && windowWidth > 768 ? "hidden" : ""
									}`}
								>
									Your Library
								</span>
							)}
						</li>
					</ul>
				</div>

				{(isSidebarOpen || windowWidth > 768) && (
					<div
						className={`mt-6 sm:mt-8 ${
							!isSidebarOpen && windowWidth > 768 ? "hidden" : ""
						}`}
					>
						<div className="flex items-center justify-between mb-3 sm:mb-4">
							<div className="flex items-center text-gray-400 cursor-pointer hover:text-white">
								<Plus size={windowWidth <= 320 ? 16 : 20} />
								<span className="ml-2 text-sm sm:text-base">
									Create Playlist
								</span>
							</div>
						</div>
						<div className="flex items-center text-gray-400 cursor-pointer hover:text-white mb-4 sm:mb-6">
							<Heart size={windowWidth <= 320 ? 16 : 20} />
							<span className="ml-2 text-sm sm:text-base">Liked Songs</span>
						</div>

						<div className="border-t border-gray-800 pt-3 sm:pt-4">
							<h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-4">
								YOUR PLAYLISTS
							</h3>
							<ul className="space-y-2 sm:space-y-3">
								{yourPlaylists.map((playlist) => (
									<li
										key={playlist.id}
										className="text-xs sm:text-sm text-gray-400 hover:text-white cursor-pointer truncate"
										onClick={() => {
											context.setCurrentPlaylist(playlist);
											context.setCurrentPage("playlist");
											if (windowWidth <= 768) setIsSidebarOpen(false);
										}}
									>
										{playlist.name}
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const Player: React.FC = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("Player must be used within an AppProvider");

	const {
		isPlaying,
		setIsPlaying,
		currentSong,
		currentTime,
		duration,
		volume,
		setVolume,
		isMuted,
		setIsMuted,
		isRepeat,
		setIsRepeat,
		isShuffle,
		setIsShuffle,
		playNextSong,
		playPreviousSong,
		togglePlay,
		windowWidth,
	} = context;

	const progressBarRef = useRef<HTMLDivElement>(null);

	const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!progressBarRef.current || !currentSong) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		const clickPosition = (e.clientX - rect.left) / rect.width;
		const newTime = duration * clickPosition;

		const audioElement = document.getElementById(
			"audio-player"
		) as HTMLAudioElement;
		if (audioElement) {
			audioElement.currentTime = newTime;
		}
	};

	const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
		const volumeBar = e.currentTarget;
		const rect = volumeBar.getBoundingClientRect();
		const clickPosition = (e.clientX - rect.left) / rect.width;
		setVolume(Math.max(0, Math.min(1, clickPosition)));

		if (isMuted) setIsMuted(false);
	};

	const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

	const isCompactScreen = windowWidth <= 350;

	const hideOnSmallScreen = isCompactScreen ? "hidden" : "";

	if (!currentSong) {
		return (
			<div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 border-t border-gray-800 p-2 sm:p-4 z-20">
				<div className="flex items-center justify-between">
					<div className="flex items-center w-1/4">
						<div className="h-10 w-10 sm:h-14 sm:w-14 bg-gray-800 rounded mr-2 sm:mr-3 flex items-center justify-center">
							<Music size={16} className="text-gray-600" />
						</div>
						<div className={`${isCompactScreen ? "hidden sm:block" : ""}`}>
							<p className="text-gray-600 text-xs sm:text-sm font-medium">
								Select a track
							</p>
							<p className="text-gray-700 text-xs hidden sm:block">
								No song selected
							</p>
						</div>
					</div>

					<div className="flex flex-col items-center w-2/4">
						<div className="flex items-center space-x-2 sm:space-x-6">
							<button className="text-gray-600 cursor-not-allowed">
								<Shuffle size={isCompactScreen ? 12 : 16} />
							</button>
							<button className="text-gray-600 cursor-not-allowed">
								<SkipBack size={isCompactScreen ? 16 : 20} />
							</button>
							<button className="bg-gray-700 rounded-full p-1 sm:p-2 cursor-not-allowed">
								<Play size={isCompactScreen ? 16 : 20} color="gray" />
							</button>
							<button className="text-gray-600 cursor-not-allowed">
								<SkipForward size={isCompactScreen ? 16 : 20} />
							</button>
							<button className="text-gray-600 cursor-not-allowed">
								<Repeat size={isCompactScreen ? 12 : 16} />
							</button>
						</div>

						<div className="w-full flex items-center mt-1 sm:mt-2">
							<span className="text-xs text-gray-600 mr-1 sm:mr-2">0:00</span>
							<div className="h-1 bg-gray-700 rounded-full flex-grow cursor-not-allowed">
								<div
									className="h-1 bg-gray-600 rounded-full"
									style={{ width: "0%" }}
								></div>
							</div>
							<span className="text-xs text-gray-600 ml-1 sm:ml-2">0:00</span>
						</div>
					</div>

					<div
						className={`flex items-center justify-end w-1/4 ${
							isCompactScreen ? "hidden sm:flex" : ""
						}`}
					>
						<div className="flex items-center">
							<Volume2 size={16} className="text-gray-600 mr-2" />
							<div className="w-16 sm:w-24 h-1 bg-gray-700 rounded-full cursor-not-allowed">
								<div
									className="h-1 bg-gray-600 rounded-full"
									style={{ width: "70%" }}
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 border-t border-gray-800 p-2 sm:p-4 z-20">
			{}
			<audio
				id="audio-player"
				src={currentSong.audioUrl || "https://example.com/fallback.mp3"}
				style={{ display: "none" }}
			/>

			<div className="flex items-center justify-between">
				<div className="flex items-center w-1/4 min-w-0">
					<img
						src={currentSong.coverUrl}
						alt={currentSong.title}
						className="h-10 w-10 sm:h-14 sm:w-14 object-cover rounded mr-2 sm:mr-3 flex-shrink-0"
					/>
					<div
						className={`overflow-hidden ${
							isCompactScreen ? "hidden sm:block" : ""
						}`}
					>
						<p className="text-white text-xs sm:text-sm font-medium truncate">
							{currentSong.title}
						</p>
						<p className="text-gray-400 text-xs truncate">
							{currentSong.artist}
						</p>
					</div>
					<button
						className={`ml-2 sm:ml-4 text-gray-400 hover:text-white ${
							isCompactScreen ? "hidden sm:inline" : ""
						}`}
					>
						<Heart size={isCompactScreen ? 12 : 16} />
					</button>
				</div>

				<div className="flex flex-col items-center w-2/4">
					<div className="flex items-center space-x-1 sm:space-x-6">
						<button
							className={`text-gray-400 hover:text-white cursor-pointer ${
								isShuffle ? "text-green-500" : ""
							} ${isCompactScreen ? "hidden sm:inline" : ""}`}
							onClick={() => setIsShuffle(!isShuffle)}
						>
							<Shuffle size={isCompactScreen ? 12 : 16} />
						</button>
						<button
							className="text-gray-400 hover:text-white cursor-pointer"
							onClick={playPreviousSong}
						>
							<SkipBack size={isCompactScreen ? 16 : 20} />
						</button>
						<button
							className="bg-white rounded-full p-1 sm:p-2 cursor-pointer hover:scale-105 transition"
							onClick={togglePlay}
						>
							{isPlaying ? (
								<Pause size={isCompactScreen ? 16 : 20} color="black" />
							) : (
								<Play size={isCompactScreen ? 16 : 20} color="black" />
							)}
						</button>
						<button
							className="text-gray-400 hover:text-white cursor-pointer"
							onClick={playNextSong}
						>
							<SkipForward size={isCompactScreen ? 16 : 20} />
						</button>
						<button
							className={`text-gray-400 hover:text-white cursor-pointer ${
								isRepeat !== "off" ? "text-green-500" : ""
							} ${isCompactScreen ? "hidden sm:inline" : ""}`}
							onClick={() => {
								if (isRepeat === "off") setIsRepeat("all");
								else if (isRepeat === "all") setIsRepeat("one");
								else setIsRepeat("off");
							}}
						>
							{isRepeat === "one" ? (
								<Repeat size={isCompactScreen ? 12 : 16} />
							) : (
								<Repeat size={isCompactScreen ? 12 : 16} />
							)}
						</button>
					</div>

					<div className="w-full flex items-center mt-1 sm:mt-2">
						<span className="text-xs text-gray-400 mr-1 sm:mr-2">
							{formatTime(currentTime)}
						</span>
						<div
							className="h-1 bg-gray-600 rounded-full flex-grow cursor-pointer"
							onClick={handleProgressBarClick}
							ref={progressBarRef}
						>
							<div
								className="h-1 bg-gray-300 rounded-full hover:bg-green-500"
								style={{ width: `${progressPercentage}%` }}
							></div>
						</div>
						<span className="text-xs text-gray-400 ml-1 sm:ml-2">
							{currentSong.duration}
						</span>
					</div>
				</div>

				<div
					className={`flex items-center justify-end w-1/4 ${
						isCompactScreen ? "hidden sm:flex" : ""
					}`}
				>
					<div className="flex items-center">
						<button
							className="text-gray-400 hover:text-white mr-2"
							onClick={() => setIsMuted(!isMuted)}
						>
							{isMuted ? (
								<VolumeX size={isCompactScreen ? 12 : 16} />
							) : volume > 0.5 ? (
								<Volume2 size={isCompactScreen ? 12 : 16} />
							) : (
								<Volume1 size={isCompactScreen ? 12 : 16} />
							)}
						</button>
						<div
							className="w-16 sm:w-24 h-1 bg-gray-600 rounded-full cursor-pointer"
							onClick={handleVolumeChange}
						>
							<div
								className="h-1 bg-gray-300 rounded-full hover:bg-green-500"
								style={{ width: `${isMuted ? 0 : volume * 100}%` }}
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const TopBar: React.FC = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("TopBar must be used within an AppProvider");

	const {
		currentPage,
		searchTerm,
		setSearchTerm,
		windowWidth,
		isSidebarOpen,
		setIsSidebarOpen,
	} = context;

	const searchInputWidth = windowWidth <= 320 ? "w-40" : "w-64";

	return (
		<div className="sticky top-0 bg-black bg-opacity-95 p-2 sm:p-4 flex items-center justify-between z-10">
			<div className="flex items-center">
				{windowWidth <= 768 && !isSidebarOpen && (
					<button
						className="mr-2 sm:mr-4 text-white cursor-pointer"
						onClick={() => setIsSidebarOpen(true)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={windowWidth <= 320 ? "20" : "24"}
							height={windowWidth <= 320 ? "20" : "24"}
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
					</button>
				)}

				<div className="flex space-x-1 sm:space-x-2">
					<button className="bg-black rounded-full p-1 text-white cursor-pointer">
						<ChevronLeft size={windowWidth <= 320 ? 20 : 24} />
					</button>
					<button className="bg-black rounded-full p-1 text-white cursor-pointer">
						<ChevronRight size={windowWidth <= 320 ? 20 : 24} />
					</button>
				</div>

				{currentPage === "search" && (
					<div className="ml-2 sm:ml-4">
						<div className="relative">
							<Search
								size={windowWidth <= 320 ? 14 : 16}
								className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							/>
							<input
								type="text"
								placeholder="What do you want to listen to?"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`bg-white rounded-full py-1 sm:py-2 pl-7 sm:pl-10 pr-2 sm:pr-4 ${searchInputWidth} text-xs sm:text-sm outline-none`}
							/>
						</div>
					</div>
				)}
			</div>

			<div className="flex items-center">
				<div className="bg-black rounded-full p-1 cursor-pointer">
					<User size={windowWidth <= 320 ? 20 : 24} className="text-white" />
				</div>
			</div>
		</div>
	);
};

const HomePage: React.FC = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("HomePage must be used within an AppProvider");

	const featuredPlaylists = playlists.slice(0, 6);
	const recentlyPlayed = playlists.slice(2, 6);
	const { windowWidth } = context;

	const gridCols =
		windowWidth <= 320
			? "grid-cols-1"
			: windowWidth <= 500
			? "grid-cols-2"
			: "grid-cols-2 md:grid-cols-3";

	const featuredGridCols =
		windowWidth <= 320
			? "grid-cols-1"
			: windowWidth <= 500
			? "grid-cols-2"
			: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

	return (
		<div className="p-3 sm:p-6">
			<h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
				Good afternoon
			</h1>

			<div className={`grid ${gridCols} gap-2 sm:gap-4 mb-6 sm:mb-8`}>
				{recentlyPlayed.map((playlist) => (
					<div
						key={playlist.id}
						className="bg-gray-800 bg-opacity-40 hover:bg-gray-700 transition-colors rounded flex items-center overflow-hidden cursor-pointer"
						onClick={() => {
							context.setCurrentPlaylist(playlist);
							context.setCurrentPage("playlist");
						}}
					>
						<img
							src={playlist.coverUrl}
							alt={playlist.name}
							className="h-16 w-16 sm:h-20 sm:w-20 object-cover"
						/>
						<div className="p-2 sm:p-4 overflow-hidden">
							<p className="text-white text-sm sm:text-base font-medium truncate">
								{playlist.name}
							</p>
						</div>
					</div>
				))}
			</div>

			<h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
				Featured Playlists
			</h2>
			<div className={`grid ${featuredGridCols} gap-3 sm:gap-6`}>
				{featuredPlaylists.map((playlist) => (
					<div
						key={playlist.id}
						className="bg-gray-800 bg-opacity-40 p-3 sm:p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
						onClick={() => {
							context.setCurrentPlaylist(playlist);
							context.setCurrentPage("playlist");
						}}
					>
						<div className="mb-3 sm:mb-4 relative group">
							<img
								src={playlist.coverUrl}
								alt={playlist.name}
								className="w-full aspect-square object-cover rounded-md shadow-lg"
							/>
							<button
								className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform transition"
								onClick={(e) => {
									e.stopPropagation();
									if (playlist.songs.length > 0) {
										context.setCurrentSong(playlist.songs[0]);
										context.setIsPlaying(true);
									}
								}}
							>
								<Play
									size={windowWidth <= 320 ? 16 : 20}
									className="text-black"
								/>
							</button>
						</div>
						<h3 className="text-white text-sm sm:text-base font-medium truncate">
							{playlist.name}
						</h3>
						<p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">
							{playlist.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

const SearchPage: React.FC = () => {
	const context = useContext(AppContext);
	if (!context)
		throw new Error("SearchPage must be used within an AppProvider");

	const { searchTerm, searchResults, windowWidth } = context;

	const gridCols =
		windowWidth <= 320
			? "grid-cols-1"
			: windowWidth <= 500
			? "grid-cols-2"
			: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

	const categoryGridCols =
		windowWidth <= 320
			? "grid-cols-1"
			: windowWidth <= 500
			? "grid-cols-2"
			: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

	return (
		<div className="p-3 sm:p-6">
			{searchTerm ? (
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
						Search Results for "{searchTerm}"
					</h1>

					{searchResults.length > 0 ? (
						<div className={`grid ${gridCols} gap-3 sm:gap-6`}>
							{searchResults.map((playlist) => (
								<div
									key={playlist.id}
									className="bg-gray-800 bg-opacity-40 p-3 sm:p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
									onClick={() => {
										context.setCurrentPlaylist(playlist);
										context.setCurrentPage("playlist");
									}}
								>
									<div className="mb-3 sm:mb-4 relative group">
										<img
											src={playlist.coverUrl}
											alt={playlist.name}
											className="w-full aspect-square object-cover rounded-md shadow-lg"
										/>
										<button
											className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform transition"
											onClick={(e) => {
												e.stopPropagation();
												if (playlist.songs.length > 0) {
													context.setCurrentSong(playlist.songs[0]);
													context.setIsPlaying(true);
												}
											}}
										>
											<Play
												size={windowWidth <= 320 ? 16 : 20}
												className="text-black"
											/>
										</button>
									</div>
									<h3 className="text-white text-sm sm:text-base font-medium truncate">
										{playlist.name}
									</h3>
									<p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">
										{playlist.description}
									</p>
								</div>
							))}
						</div>
					) : (
						<div className="text-gray-400 text-center py-8 sm:py-10">
							<p>No results found for "{searchTerm}"</p>
							<p className="mt-2">Try searching for something else</p>
						</div>
					)}
				</div>
			) : (
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
						Browse all
					</h1>

					<div className={`grid ${categoryGridCols} gap-2 sm:gap-4`}>
						{categories.map((category) => (
							<div
								key={category.id}
								className="relative rounded-lg overflow-hidden cursor-pointer"
								style={{
									backgroundColor: `hsl(${(category.id * 40) % 360}, 70%, 50%)`,
								}}
							>
								<div className="p-3 sm:p-5">
									<h3 className="text-white font-bold text-lg sm:text-2xl">
										{category.name}
									</h3>
								</div>
								<img
									src={category.coverUrl}
									alt={category.name}
									className="absolute bottom-0 right-0 w-16 sm:w-20 h-16 sm:h-20 object-cover transform rotate-25 translate-x-2 translate-y-2 shadow-lg"
									style={{ transform: "rotate(25deg) translate(20%, 5%)" }}
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const LibraryPage: React.FC = () => {
	const context = useContext(AppContext);
	if (!context)
		throw new Error("LibraryPage must be used within an AppProvider");

	const savedPlaylists = playlists.slice(0, 4);
	const { windowWidth } = context;

	return (
		<div className="p-3 sm:p-6">
			<div className="flex items-center justify-between mb-4 sm:mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-white">
					Your Library
				</h1>
				<div className="flex items-center space-x-2">
					<button className="text-white hover:text-green-500 cursor-pointer">
						<Search size={windowWidth <= 320 ? 20 : 24} />
					</button>
					<button className="text-white hover:text-green-500 cursor-pointer">
						<Plus size={windowWidth <= 320 ? 20 : 24} />
					</button>
				</div>
			</div>

			<div className="mb-4 sm:mb-6 flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
				<button className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-3 py-1 text-xs sm:text-sm cursor-pointer whitespace-nowrap">
					Playlists
				</button>
				<button className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-3 py-1 text-xs sm:text-sm cursor-pointer whitespace-nowrap">
					Artists
				</button>
				<button className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-3 py-1 text-xs sm:text-sm cursor-pointer whitespace-nowrap">
					Albums
				</button>
			</div>

			{savedPlaylists.map((playlist) => (
				<div
					key={playlist.id}
					className="flex items-center p-2 hover:bg-gray-800 rounded-md cursor-pointer mb-2"
					onClick={() => {
						context.setCurrentPlaylist(playlist);
						context.setCurrentPage("playlist");
					}}
				>
					<img
						src={playlist.coverUrl}
						alt={playlist.name}
						className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded mr-2 sm:mr-3"
					/>
					<div className="overflow-hidden">
						<p className="text-white text-sm sm:text-base font-medium truncate">
							{playlist.name}
						</p>
						<p className="text-gray-400 text-xs sm:text-sm truncate">
							Playlist • {playlist.createdBy}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

const PlaylistPage: React.FC = () => {
	const context = useContext(AppContext);
	if (!context)
		throw new Error("PlaylistPage must be used within an AppProvider");

	const {
		currentPlaylist,
		setCurrentSong,
		setIsPlaying,
		currentSong,
		isPlaying,
		togglePlay,
		windowWidth,
	} = context;

	if (!currentPlaylist) return null;

	const titleSize = windowWidth <= 320 ? "text-2xl" : "text-4xl md:text-6xl";
	const imageSize =
		windowWidth <= 320 ? "h-32 w-32" : "h-44 w-44 md:h-56 md:w-56";

	return (
		<div>
			<div
				className="flex flex-col md:flex-row items-center md:items-end p-4 sm:p-6 bg-gradient-to-b from-green-800 to-black"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%), 
                            linear-gradient(to right, rgba(29,185,84,0.3) 0%, rgba(0,0,0,0.8) 100%)`,
					paddingBottom: "2rem",
					paddingTop: "8rem",
				}}
			>
				<img
					src={currentPlaylist.coverUrl}
					alt={currentPlaylist.name}
					className={`shadow-2xl ${imageSize} object-cover mb-4 md:mb-0 md:mr-6`}
				/>
				<div>
					<p className="text-white text-xs sm:text-sm uppercase md:mb-2">
						Playlist
					</p>
					<h1 className={`text-white ${titleSize} font-bold mb-2`}>
						{currentPlaylist.name}
					</h1>
					<p className="text-gray-300 text-sm sm:text-base mb-1 line-clamp-2">
						{currentPlaylist.description}
					</p>
					<p className="text-gray-400 text-xs sm:text-sm">
						Created by{" "}
						<span className="text-white">{currentPlaylist.createdBy}</span> •{" "}
						{currentPlaylist.songs.length} songs
					</p>
				</div>
			</div>

			<div className="p-3 sm:p-6 bg-black bg-opacity-90">
				<div className="flex items-center mb-4 sm:mb-8">
					<button
						className="bg-green-500 rounded-full p-2 sm:p-3 mr-4 sm:mr-6 hover:scale-105 transform transition-all cursor-pointer"
						onClick={() => {
							if (currentPlaylist.songs.length > 0) {
								const firstSong = currentPlaylist.songs[0];

								if (currentSong && currentSong.id === firstSong.id) {
									togglePlay();
								} else {
									setCurrentSong(firstSong);
									setIsPlaying(true);
								}
							}
						}}
					>
						{isPlaying &&
						currentSong &&
						currentPlaylist.songs.some((song) => song.id === currentSong.id) ? (
							<Pause
								size={windowWidth <= 320 ? 20 : 24}
								className="text-black"
							/>
						) : (
							<Play
								size={windowWidth <= 320 ? 20 : 24}
								className="text-black"
							/>
						)}
					</button>
					<button className="text-gray-400 hover:text-white cursor-pointer">
						<Heart size={windowWidth <= 320 ? 20 : 24} />
					</button>
				</div>

				<div className="mb-2 sm:mb-4 text-gray-400 grid grid-cols-12 border-b border-gray-800 pb-2">
					<div className="col-span-1 text-center">#</div>
					<div className="col-span-5">Title</div>
					<div className="col-span-4 hidden md:block">Album</div>
					<div className="col-span-2 text-right">Duration</div>
				</div>

				<div>
					{currentPlaylist.songs.map((song, index) => (
						<div
							key={song.id}
							className={`grid grid-cols-12 text-gray-400 hover:bg-gray-800 rounded-md p-2 cursor-pointer ${
								currentSong && currentSong.id === song.id ? "bg-gray-800" : ""
							}`}
							onClick={() => {
								if (currentSong && currentSong.id === song.id) {
									togglePlay();
								} else {
									setCurrentSong(song);
									setIsPlaying(true);
								}
							}}
						>
							<div className="col-span-1 flex items-center justify-center">
								{currentSong && currentSong.id === song.id && isPlaying ? (
									<Pause
										size={windowWidth <= 320 ? 12 : 16}
										className="text-green-500"
									/>
								) : (
									index + 1
								)}
							</div>
							<div className="col-span-5 flex items-center min-w-0">
								<img
									src={song.coverUrl}
									alt={song.title}
									className="h-8 w-8 sm:h-10 sm:w-10 object-cover mr-2 sm:mr-3 flex-shrink-0"
								/>
								<div className="overflow-hidden">
									<p
										className={`truncate ${
											currentSong && currentSong.id === song.id
												? "text-green-500"
												: "text-white"
										} text-sm sm:text-base`}
									>
										{song.title}
									</p>
									<p className="text-xs sm:text-sm truncate">{song.artist}</p>
								</div>
							</div>
							<div className="col-span-4 hidden md:flex items-center">
								{song.album}
							</div>
							<div className="col-span-2 flex items-center justify-end text-xs sm:text-sm">
								{song.duration}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const Music = ({ size = 24, className = "" }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M9 18V5l12-2v13"></path>
		<circle cx="6" cy="18" r="3"></circle>
		<circle cx="18" cy="16" r="3"></circle>
	</svg>
);

const QueuePage: React.FC = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("QueuePage must be used within an AppProvider");

	const {
		queue,
		history,
		currentSong,
		setCurrentSong,
		setIsPlaying,
		windowWidth,
	} = context;

	return (
		<div className="p-3 sm:p-6">
			<h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
				Play Queue
			</h1>

			{currentSong && (
				<div className="mb-4 sm:mb-6">
					<h2 className="text-lg sm:text-xl text-white mb-2 sm:mb-3">
						Now Playing
					</h2>
					<div className="flex items-center p-2 bg-gray-800 bg-opacity-40 rounded-md">
						<img
							src={currentSong.coverUrl}
							alt={currentSong.title}
							className="h-12 w-12 sm:h-14 sm:w-14 object-cover rounded mr-2 sm:mr-3"
						/>
						<div className="overflow-hidden">
							<p className="text-white text-sm sm:text-base font-medium truncate">
								{currentSong.title}
							</p>
							<p className="text-gray-400 text-xs sm:text-sm truncate">
								{currentSong.artist}
							</p>
						</div>
					</div>
				</div>
			)}

			{queue.length > 0 && (
				<div className="mb-4 sm:mb-6">
					<h2 className="text-lg sm:text-xl text-white mb-2 sm:mb-3">
						Next Up
					</h2>
					{queue.map((song) => (
						<div
							key={song.id}
							className="flex items-center p-2 hover:bg-gray-800 rounded-md cursor-pointer mb-2"
							onClick={() => {
								setCurrentSong(song);
								setIsPlaying(true);
							}}
						>
							<img
								src={song.coverUrl}
								alt={song.title}
								className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded mr-2 sm:mr-3"
							/>
							<div className="overflow-hidden">
								<p className="text-white text-sm sm:text-base font-medium truncate">
									{song.title}
								</p>
								<p className="text-gray-400 text-xs sm:text-sm truncate">
									{song.artist}
								</p>
							</div>
						</div>
					))}
				</div>
			)}

			{history.length > 0 && (
				<div>
					<h2 className="text-lg sm:text-xl text-white mb-2 sm:mb-3">
						Recently Played
					</h2>
					{history
						.slice()
						.reverse()
						.map((song) => (
							<div
								key={song.id}
								className="flex items-center p-2 hover:bg-gray-800 rounded-md cursor-pointer mb-2"
								onClick={() => {
									setCurrentSong(song);
									setIsPlaying(true);
								}}
							>
								<img
									src={song.coverUrl}
									alt={song.title}
									className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded mr-2 sm:mr-3"
								/>
								<div className="overflow-hidden">
									<p className="text-white text-sm sm:text-base font-medium truncate">
										{song.title}
									</p>
									<p className="text-gray-400 text-xs sm:text-sm truncate">
										{song.artist}
									</p>
								</div>
							</div>
						))}
				</div>
			)}

			{queue.length === 0 && history.length === 0 && !currentSong && (
				<div className="text-gray-400 text-center py-8 sm:py-10">
					<p>Your queue is empty</p>
					<p className="mt-2">Add songs to your queue to see them here</p>
				</div>
			)}
		</div>
	);
};

const SpotifyClone: React.FC = () => {
	const [currentPage, setCurrentPage] = useState("home");
	const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentSong, setCurrentSong] = useState<Song | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 0
	);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(0.7);
	const [isMuted, setIsMuted] = useState(false);
	const [isRepeat, setIsRepeat] = useState<"off" | "all" | "one">("off");
	const [isShuffle, setIsShuffle] = useState(false);

	const [queue, setQueue] = useState<Song[]>([]);
	const [history, setHistory] = useState<Song[]>([]);

	const audioRef = useRef<HTMLAudioElement | null>(null);

	const searchResults = filterPlaylists(searchTerm);

	const togglePlay = () => {
		if (!currentSong) return;

		const audioElement = document.getElementById(
			"audio-player"
		) as HTMLAudioElement;
		if (!audioElement) return;

		if (isPlaying) {
			audioElement.pause();
		} else {
			audioElement.play().catch((error) => {
				console.error("Error playing audio:", error);
			});
		}

		setIsPlaying(!isPlaying);
	};

	const playNextSong = () => {
		if (!currentSong) return;

		if (queue.length > 0) {
			const nextSong = queue[0];
			const newQueue = queue.slice(1);

			if (currentSong) {
				setHistory([...history, currentSong]);
			}

			setCurrentSong(nextSong);
			setQueue(newQueue);
			setIsPlaying(true);
			return;
		}

		if (currentPlaylist) {
			const currentIndex = currentPlaylist.songs.findIndex(
				(song) => song.id === currentSong.id
			);

			if (currentIndex !== -1) {
				let nextIndex;

				if (isShuffle) {
					const availableIndices = Array.from(
						{ length: currentPlaylist.songs.length },
						(_, i) => i
					).filter((i) => i !== currentIndex);

					if (availableIndices.length > 0) {
						nextIndex =
							availableIndices[getRandomIndex(availableIndices.length)];
					} else {
						nextIndex = (currentIndex + 1) % currentPlaylist.songs.length;
					}
				} else {
					nextIndex = (currentIndex + 1) % currentPlaylist.songs.length;
				}

				setHistory([...history, currentSong]);

				setCurrentSong(currentPlaylist.songs[nextIndex]);
				setIsPlaying(true);
			}
		}
	};

	const playPreviousSong = () => {
		const audioElement = document.getElementById(
			"audio-player"
		) as HTMLAudioElement;
		if (audioElement && audioElement.currentTime > 3) {
			audioElement.currentTime = 0;
			return;
		}

		if (history.length > 0) {
			const prevSong = history[history.length - 1];
			const newHistory = history.slice(0, -1);

			if (currentSong) {
				setQueue([currentSong, ...queue]);
			}

			setCurrentSong(prevSong);
			setHistory(newHistory);
			setIsPlaying(true);
			return;
		}

		if (currentPlaylist && currentSong) {
			const currentIndex = currentPlaylist.songs.findIndex(
				(song) => song.id === currentSong.id
			);

			if (currentIndex !== -1) {
				const prevIndex =
					currentIndex === 0
						? currentPlaylist.songs.length - 1
						: currentIndex - 1;
				setCurrentSong(currentPlaylist.songs[prevIndex]);
				setIsPlaying(true);
			}
		}
	};

	const addToQueue = (song: Song) => {
		setQueue([...queue, song]);
	};

	const removeFromQueue = (songId: number) => {
		setQueue(queue.filter((song) => song.id !== songId));
	};

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
			if (window.innerWidth > 768) {
				setIsSidebarOpen(true);
			} else {
				setIsSidebarOpen(false);
			}
		};

		if (window.innerWidth > 768) {
			setIsSidebarOpen(true);
		} else {
			setIsSidebarOpen(false);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const setupAudioEvents = () => {
			const audioElement = document.getElementById(
				"audio-player"
			) as HTMLAudioElement;
			if (!audioElement) return;

			audioRef.current = audioElement;

			const handleTimeUpdate = () => {
				setCurrentTime(audioElement.currentTime);
			};

			const handleDurationChange = () => {
				setDuration(audioElement.duration);
			};

			const handleEnded = () => {
				if (isRepeat === "one") {
					audioElement.currentTime = 0;
					audioElement.play().catch(console.error);
				} else if (
					isRepeat === "all" ||
					queue.length > 0 ||
					(currentPlaylist && currentPlaylist.songs.length > 1)
				) {
					playNextSong();
				} else {
					setIsPlaying(false);
				}
			};

			audioElement.addEventListener("timeupdate", handleTimeUpdate);
			audioElement.addEventListener("durationchange", handleDurationChange);
			audioElement.addEventListener("ended", handleEnded);

			return () => {
				audioElement.removeEventListener("timeupdate", handleTimeUpdate);
				audioElement.removeEventListener(
					"durationchange",
					handleDurationChange
				);
				audioElement.removeEventListener("ended", handleEnded);
			};
		};

		const cleanup = setupAudioEvents();

		return () => {
			if (cleanup) cleanup();
		};
	}, [queue, isRepeat, currentPlaylist]);

	useEffect(() => {
		const audioElement = document.getElementById(
			"audio-player"
		) as HTMLAudioElement;
		if (!audioElement) return;

		if (currentSong) {
			setCurrentTime(0);

			if (isPlaying) {
				audioElement.play().catch((error) => {
					console.error("Error playing audio:", error);
					setIsPlaying(false);
				});
			}
		} else {
			setIsPlaying(false);
		}
	}, [currentSong]);

	useEffect(() => {
		const audioElement = document.getElementById(
			"audio-player"
		) as HTMLAudioElement;
		if (!audioElement) return;

		audioElement.volume = isMuted ? 0 : volume;
	}, [volume, isMuted]);

	useEffect(() => {
		const audioElement = document.getElementById(
			"audio-player"
		) as HTMLAudioElement;
		if (!audioElement || !currentSong) return;

		if (isPlaying) {
			audioElement.play().catch((error) => {
				console.error("Error playing audio:", error);
				setIsPlaying(false);
			});
		} else {
			audioElement.pause();
		}
	}, [isPlaying]);

	const renderContent = () => {
		switch (currentPage) {
			case "home":
				return <HomePage />;
			case "search":
				return <SearchPage />;
			case "library":
				return <LibraryPage />;
			case "playlist":
				return <PlaylistPage />;
			case "queue":
				return <QueuePage />;
			default:
				return <HomePage />;
		}
	};

	const getMainContentStyle = () => {
		if (windowWidth <= 768) {
			return { marginLeft: "0px" };
		}
		return { marginLeft: isSidebarOpen ? "256px" : "64px" };
	};

	return (
		<AppContext.Provider
			value={{
				currentPage,
				setCurrentPage,
				currentPlaylist,
				setCurrentPlaylist,
				isPlaying,
				setIsPlaying,
				currentSong,
				setCurrentSong,
				searchTerm,
				setSearchTerm,
				searchResults,
				windowWidth,
				isSidebarOpen,
				setIsSidebarOpen,
				currentTime,
				setCurrentTime,
				duration,
				setDuration,
				volume,
				setVolume,
				isMuted,
				setIsMuted,
				isRepeat,
				setIsRepeat,
				isShuffle,
				setIsShuffle,
				playNextSong,
				playPreviousSong,
				togglePlay,
				queue,
				addToQueue,
				removeFromQueue,
				history,
			}}
		>
			<div className="bg-black min-h-screen text-white">
				<Sidebar />

				<div
					className="transition-all duration-300 pb-24"
					style={getMainContentStyle()}
				>
					<TopBar />
					{renderContent()}
				</div>

				{}
				<Player />
			</div>
		</AppContext.Provider>
	);
};

export default SpotifyClone;
