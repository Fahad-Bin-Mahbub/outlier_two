"use client";
import React, { useState, useRef, useEffect } from "react";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Settings,
	ChevronRight,
	X,
	List,
	Globe,
	SkipBack,
	SkipForward,
	Maximize,
	Minimize,
	Info,
} from "lucide-react";

export default function NetflixExport() {
	const videoRef = useRef(null);
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);
	const progressTooltipRef = useRef(null);
	const volumeSliderRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [bufferedTime, setBufferedTime] = useState(0);
	const [isControlsVisible, setIsControlsVisible] = useState(true);
	const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
	const [isSubtitleMenuOpen, setIsSubtitleMenuOpen] = useState(false);
	const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false);
	const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
	const [selectedQuality, setSelectedQuality] = useState("1080p");
	const [selectedSubtitle, setSelectedSubtitle] = useState("Off");
	const [selectedAudio, setSelectedAudio] = useState("English");
	const [showSkipButton, setShowSkipButton] = useState(false);
	const [showSkipCredits, setShowSkipCredits] = useState(false);
	const [isBuffering, setIsBuffering] = useState(false);
	const [showNextEpisode, setShowNextEpisode] = useState(false);
	const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState(10);
	const [countdownProgress, setCountdownProgress] = useState(100);
	const [showSkipAnimation, setShowSkipAnimation] = useState(null);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [maturityRating, setMaturityRating] = useState("TV-14");
	const [longPause, setLongPause] = useState(false);
	const [isDraggingProgress, setIsDraggingProgress] = useState(false);
	const [hoverPosition, setHoverPosition] = useState(null);
	const [hoverTime, setHoverTime] = useState(null);
	const [chapterMarkers, setChapterMarkers] = useState([]);
	const controlsTimeoutRef = useRef(null);
	const pauseTimeoutRef = useRef(null);

	const videoURL =
		"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

	const videoThumbnail =
		"https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
	const episodeTitle = "The Great Adventure";
	const seriesTitle = "Nature Explorers";
	const episodeDescription =
		"Join our explorers as they venture into the wild to discover the secrets of nature.";

	const nextEpisodeThumbnail =
		"https://plus.unsplash.com/premium_photo-1667574871485-ea94f9d1a2f5?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
	const nextEpisodeTitle = "The Forest Mystery";
	const nextEpisodeNumber = "S1:E2";
	const nextEpisodeDuration = "28m";
	const nextEpisodeDescription =
		"Our explorers discover unusual animal behavior in the ancient forest that leads to an unexpected discovery.";

	const qualityOptions = ["2160p", "1080p", "720p", "480p", "360p", "Auto"];
	const subtitleOptions = ["Off", "English", "Spanish", "French", "German"];
	const audioOptions = ["English", "Spanish", "French", "German"];

	useEffect(() => {
		setChapterMarkers([
			{ time: 0, title: "Introduction" },
			{ time: 45, title: "Chapter 1: The Journey Begins" },
			{ time: 120, title: "Chapter 2: Discovering the Forest" },
			{ time: 180, title: "Chapter 3: Unexpected Findings" },
			{ time: 240, title: "Chapter 4: The Resolution" },
		]);
	}, []);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleTimeUpdate = () => {
			setCurrentTime(video.currentTime);

			if (video.buffered.length > 0) {
				setBufferedTime(video.buffered.end(video.buffered.length - 1));
			}

			if (video.currentTime > 20 && video.currentTime < 45) {
				setShowSkipButton(true);
			} else {
				setShowSkipButton(false);
			}

			if (
				video.currentTime > video.duration * 0.8 &&
				video.currentTime < video.duration * 0.95
			) {
				setShowSkipCredits(true);
			} else {
				setShowSkipCredits(false);
			}

			if (video.duration - video.currentTime < 45 && video.currentTime > 60) {
				setShowNextEpisode(true);

				const remainingTime = video.duration - video.currentTime;
				const progressPercentage = (remainingTime / 45) * 100;
				setCountdownProgress(Math.min(progressPercentage, 100));
			} else {
				setShowNextEpisode(false);
			}
		};

		const handleLoadedMetadata = () => {
			setDuration(video.duration);
		};

		const handlePlay = () => setIsPlaying(true);
		const handlePause = () => setIsPlaying(false);
		const handleVolumeChange = () => {
			setVolume(video.volume);
			setIsMuted(video.muted);
		};

		const handleWaiting = () => setIsBuffering(true);
		const handlePlaying = () => setIsBuffering(false);

		video.addEventListener("timeupdate", handleTimeUpdate);
		video.addEventListener("loadedmetadata", handleLoadedMetadata);
		video.addEventListener("play", handlePlay);
		video.addEventListener("pause", handlePause);
		video.addEventListener("volumechange", handleVolumeChange);
		video.addEventListener("waiting", handleWaiting);
		video.addEventListener("playing", handlePlaying);

		return () => {
			video.removeEventListener("timeupdate", handleTimeUpdate);
			video.removeEventListener("loadedmetadata", handleLoadedMetadata);
			video.removeEventListener("play", handlePlay);
			video.removeEventListener("pause", handlePause);
			video.removeEventListener("volumechange", handleVolumeChange);
			video.removeEventListener("waiting", handleWaiting);
			video.removeEventListener("playing", handlePlaying);
		};
	}, []);

	useEffect(() => {
		if (showNextEpisode) {
			const interval = setInterval(() => {
				setNextEpisodeCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						handlePlayNextEpisode();
						return 10;
					}
					return prev - 1;
				});

				setCountdownProgress((prev) =>
					Math.max(prev - 100 / (nextEpisodeCountdown * 10), 0)
				);
			}, 100);

			return () => clearInterval(interval);
		} else {
			setNextEpisodeCountdown(10);
			setCountdownProgress(100);
		}
	}, [showNextEpisode, nextEpisodeCountdown]);

	useEffect(() => {
		if (!isPlaying && videoRef.current?.currentTime > 10) {
			pauseTimeoutRef.current = setTimeout(() => {
				setLongPause(true);
			}, 180000);
		} else {
			setLongPause(false);
			if (pauseTimeoutRef.current) {
				clearTimeout(pauseTimeoutRef.current);
			}
		}

		return () => {
			if (pauseTimeoutRef.current) {
				clearTimeout(pauseTimeoutRef.current);
			}
		};
	}, [isPlaying]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleMouseMove = () => {
			setIsControlsVisible(true);

			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current);
			}

			controlsTimeoutRef.current = setTimeout(() => {
				if (isPlaying) {
					setIsControlsVisible(false);
				}
			}, 3000);
		};

		const handleMouseLeave = () => {
			if (isPlaying) {
				setIsControlsVisible(false);
			}
		};

		const handleTouchStart = () => {
			setIsControlsVisible(true);

			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current);
			}

			controlsTimeoutRef.current = setTimeout(() => {
				if (isPlaying) {
					setIsControlsVisible(false);
				}
			}, 3000);
		};

		container.addEventListener("mousemove", handleMouseMove);
		container.addEventListener("mouseleave", handleMouseLeave);
		container.addEventListener("touchstart", handleTouchStart);

		return () => {
			container.removeEventListener("mousemove", handleMouseMove);
			container.removeEventListener("mouseleave", handleMouseLeave);
			container.removeEventListener("touchstart", handleTouchStart);
			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current);
			}
		};
	}, [isPlaying]);

	useEffect(() => {
		if (showSkipAnimation) {
			const timer = setTimeout(() => {
				setShowSkipAnimation(null);
			}, 800);
			return () => clearTimeout(timer);
		}
	}, [showSkipAnimation]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				volumeSliderRef.current &&
				!volumeSliderRef.current.contains(event.target) &&
				!event.target?.toString().includes("volume-button")
			) {
				setIsVolumeSliderVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(
				document.fullscreenElement ||
					document.webkitFullscreenElement ||
					document.mozFullScreenElement ||
					document.msFullscreenElement
			);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
		document.addEventListener("mozfullscreenchange", handleFullscreenChange);
		document.addEventListener("MSFullscreenChange", handleFullscreenChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
			document.removeEventListener(
				"webkitfullscreenchange",
				handleFullscreenChange
			);
			document.removeEventListener(
				"mozfullscreenchange",
				handleFullscreenChange
			);
			document.removeEventListener(
				"MSFullscreenChange",
				handleFullscreenChange
			);
		};
	}, []);

	const togglePlay = () => {
		const video = videoRef.current;
		if (!video) return;

		if (isPlaying) {
			video.pause();
		} else {
			video.play();
		}
	};

	const toggleMute = () => {
		const video = videoRef.current;
		if (!video) return;

		video.muted = !video.muted;
	};

	const handleVolumeChange = (e) => {
		const video = videoRef.current;
		if (!video) return;

		const newVolume = parseFloat(e.target.value);
		video.volume = newVolume;
		if (newVolume === 0) {
			video.muted = true;
		} else {
			video.muted = false;
		}
	};

	const handleVolumeClick = (e) => {
		e.stopPropagation();
		setIsVolumeSliderVisible(!isVolumeSliderVisible);
	};

	const handleProgressHover = (e) => {
		if (!progressBarRef.current || !videoRef.current) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		const position = (e.clientX - rect.left) / rect.width;
		const time = position * videoRef.current.duration;

		setHoverPosition(position);
		setHoverTime(time);
	};

	const handleProgressLeave = () => {
		setHoverPosition(null);
		setHoverTime(null);
	};

	const handleProgressClick = (e) => {
		const progressBar = progressBarRef.current;
		const video = videoRef.current;
		if (!progressBar || !video) return;

		const rect = progressBar.getBoundingClientRect();
		const pos = (e.clientX - rect.left) / rect.width;
		const newTime = pos * video.duration;

		setIsBuffering(true);
		video.currentTime = newTime;
		setTimeout(() => setIsBuffering(false), 300);
	};

	const handleProgressDragStart = () => {
		setIsDraggingProgress(true);

		document.addEventListener("mousemove", handleProgressDrag);
		document.addEventListener("mouseup", handleProgressDragEnd);
	};

	const handleProgressDrag = (e) => {
		if (!isDraggingProgress || !progressBarRef.current || !videoRef.current)
			return;

		const rect = progressBarRef.current.getBoundingClientRect();
		const position = Math.max(
			0,
			Math.min(1, (e.clientX - rect.left) / rect.width)
		);
		setHoverPosition(position);
		setHoverTime(position * videoRef.current.duration);
	};

	const handleProgressDragEnd = (e) => {
		if (!isDraggingProgress || !videoRef.current) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		const position = Math.max(
			0,
			Math.min(1, (e.clientX - rect.left) / rect.width)
		);
		videoRef.current.currentTime = position * videoRef.current.duration;

		setIsDraggingProgress(false);
		document.removeEventListener("mousemove", handleProgressDrag);
		document.removeEventListener("mouseup", handleProgressDragEnd);
	};

	const formatTime = (timeInSeconds) => {
		if (isNaN(timeInSeconds)) return "0:00";

		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60);
		const seconds = Math.floor(timeInSeconds % 60);

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
				.toString()
				.padStart(2, "0")}`;
		}
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const handleQualityChange = (quality) => {
		setSelectedQuality(quality);
		setIsQualityMenuOpen(false);

		console.log(`Quality changed to ${quality}`);
	};

	const handleSubtitleChange = (subtitle) => {
		setSelectedSubtitle(subtitle);
		setIsSubtitleMenuOpen(false);

		console.log(`Subtitle changed to ${subtitle}`);
	};

	const handleAudioChange = (audio) => {
		setSelectedAudio(audio);
		setIsAudioMenuOpen(false);

		console.log(`Audio changed to ${audio}`);
	};

	const handleSkipIntro = () => {
		const video = videoRef.current;
		if (!video) return;

		setShowSkipAnimation("intro");
		setTimeout(() => {
			video.currentTime = 45;
			setShowSkipButton(false);
		}, 300);
	};

	const handleSkipCredits = () => {
		const video = videoRef.current;
		if (!video) return;

		setShowSkipAnimation("credits");
		setTimeout(() => {
			handlePlayNextEpisode();
		}, 300);
	};

	const handlePlayNextEpisode = () => {
		console.log("Playing next episode");
		setShowNextEpisode(false);

		setIsBuffering(true);

		setTimeout(() => {
			const video = videoRef.current;
			if (!video) return;

			video.currentTime = 0;
			video.play();
			setIsBuffering(false);
		}, 1500);
	};

	const handleContinueWatching = () => {
		setLongPause(false);
		const video = videoRef.current;
		if (video) {
			video.play();
		}
	};

	const skipForward = () => {
		const video = videoRef.current;
		if (!video) return;

		video.currentTime = Math.min(video.currentTime + 10, video.duration);
		setShowSkipAnimation("forward");
	};

	const skipBackward = () => {
		const video = videoRef.current;
		if (!video) return;

		video.currentTime = Math.max(video.currentTime - 10, 0);
		setShowSkipAnimation("backward");
	};

	const toggleFullscreen = () => {
		const container = containerRef.current;
		if (!container) return;

		if (!isFullscreen) {
			if (container.requestFullscreen) {
				container.requestFullscreen();
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen();
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
	};

	const toggleInfo = () => {
		setShowInfo(!showInfo);
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-black font-sans text-white">
			<div
				ref={containerRef}
				className="relative w-full max-w-6xl aspect-video bg-black overflow-hidden rounded shadow-2xl"
			>
				{}
				<video
					ref={videoRef}
					src={videoURL}
					className="w-full h-full object-contain"
					onClick={togglePlay}
					playsInline
					poster={videoThumbnail}
				/>

				{}
				<div
					className={`absolute top-4 left-4 transition-opacity duration-300 ${
						isControlsVisible ? "opacity-100" : "opacity-0"
					}`}
				>
					<div className="flex items-center space-x-2">
						<span className="text-white font-bold text-lg md:text-2xl">
							{seriesTitle}
						</span>
						<span className="text-gray-400">:</span>
						<span className="text-gray-300 text-sm md:text-base">
							{episodeTitle}
						</span>
					</div>
				</div>

				{}
				<div
					className={`absolute top-4 right-16 transition-opacity duration-300 ${
						isControlsVisible ? "opacity-100" : "opacity-0"
					}`}
				>
					<div className="bg-gray-700 px-2 py-1 text-xs rounded">
						{maturityRating}
					</div>
				</div>

				{}
				<button
					onClick={toggleInfo}
					className={`absolute top-4 right-4 p-2 text-white hover:text-red-600 transition-opacity duration-300 cursor-pointer ${
						isControlsVisible ? "opacity-100" : "opacity-0"
					}`}
				>
					<Info size={20} />
				</button>

				{}
				{showInfo && (
					<div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col p-8 overflow-y-auto">
						<button
							onClick={toggleInfo}
							className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
						>
							<X size={24} />
						</button>
						<div className="mt-12">
							<h2 className="text-3xl font-bold text-white mb-2">
								{seriesTitle}
							</h2>
							<h3 className="text-xl text-gray-300 mb-4">{episodeTitle}</h3>
							<div className="flex items-center mb-4 space-x-4">
								<span className="bg-gray-700 px-2 py-1 text-sm rounded">
									{maturityRating}
								</span>
								<span>2023</span>
								<span>S1:E1</span>
								<span>25m</span>
							</div>
							<p className="text-gray-300 mb-6">{episodeDescription}</p>
							<p className="text-gray-400 text-sm">
								Cast: John Doe, Jane Smith, Alex Johnson
								<br />
								Director: Robert Anderson
								<br />
								Tags: Educational, Family-friendly, Wildlife
							</p>
						</div>
					</div>
				)}

				{}
				{isBuffering && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
						<div className="w-16 h-16 border-4 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
					</div>
				)}

				{}
				{showSkipAnimation && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="flex items-center justify-center bg-black bg-opacity-70 rounded-full p-6 animate-pulse">
							{showSkipAnimation === "forward" ? (
								<div className="flex flex-col items-center">
									<SkipForward size={48} className="text-white" />
									<span className="text-white font-bold mt-2">+10s</span>
								</div>
							) : showSkipAnimation === "backward" ? (
								<div className="flex flex-col items-center">
									<SkipBack size={48} className="text-white" />
									<span className="text-white font-bold mt-2">-10s</span>
								</div>
							) : showSkipAnimation === "intro" ? (
								<div className="flex flex-col items-center">
									<div className="text-white font-bold text-lg">
										Skipping Intro...
									</div>
								</div>
							) : (
								<div className="flex flex-col items-center">
									<div className="text-white font-bold text-lg">
										Skipping to Next Episode...
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{}
				{!isPlaying && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
						<button
							onClick={togglePlay}
							className="w-20 h-20 flex items-center cursor-pointer justify-center bg-red-600 bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105"
						>
							<Play size={36} className="text-white ml-1" />
						</button>
					</div>
				)}

				{}
				<div
					className={`absolute inset-0 flex items-center justify-between px-4 sm:px-12 pointer-events-none transition-opacity duration-300 ${
						isControlsVisible ? "opacity-100" : "opacity-0"
					}`}
				>
					<button
						onClick={skipBackward}
						className="w-12 h-12 sm:w-16 sm:h-16 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105 pointer-events-auto"
					>
						<SkipBack size={24} className="text-white" />
					</button>
					<button
						onClick={skipForward}
						className="w-12 h-12 sm:w-16 sm:h-16 flex items-center cursor-pointer justify-center bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105 pointer-events-auto"
					>
						<SkipForward size={24} className="text-white" />
					</button>
				</div>

				{}
				<div
					className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-4 px-4 transition-opacity duration-300 ${
						isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
					}`}
				>
					{}
					<div
						className="relative w-full mb-4 group"
						onMouseMove={handleProgressHover}
						onMouseLeave={handleProgressLeave}
					>
						{}
						{hoverPosition !== null && (
							<div
								ref={progressTooltipRef}
								className="absolute bottom-full mb-2 bg-black bg-opacity-90 px-2 py-1 rounded text-white text-xs pointer-events-none transform -translate-x-1/2 z-10"
								style={{ left: `${hoverPosition * 100}%` }}
							>
								{formatTime(hoverTime)}

								{}
								<div className="w-32 h-20 mt-1 bg-gray-800 overflow-hidden rounded">
									<img
										src="https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
										alt="Preview"
										className="w-full h-full object-cover"
									/>
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-8"></div>

									{}
									{chapterMarkers.map((marker, index) => {
										if (Math.abs(marker.time - hoverTime) < 5) {
											return (
												<div
													key={index}
													className="absolute bottom-1 left-1 right-1 text-white text-xs truncate"
												>
													{marker.title}
												</div>
											);
										}
										return null;
									})}
								</div>
							</div>
						)}

						{}
						<div
							ref={progressBarRef}
							className="w-full h-1 bg-gray-700 rounded-full cursor-pointer group-hover:h-2 transition-all duration-200"
							onClick={handleProgressClick}
							onMouseDown={handleProgressDragStart}
						>
							{}
							<div
								className="absolute h-full bg-gray-500 rounded-full"
								style={{ width: `${(bufferedTime / duration) * 100}%` }}
							></div>

							{}
							<div
								className="h-full bg-red-600 rounded-full relative"
								style={{
									width:
										isDraggingProgress && hoverPosition !== null
											? `${hoverPosition * 100}%`
											: `${(currentTime / duration) * 100}%`,
								}}
							>
								{}
								<div
									className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-4 group-hover:h-4 bg-red-600 rounded-full transition-all duration-300 ${
										isDraggingProgress ? "w-4 h-4" : ""
									}`}
								></div>
							</div>

							{}
							{chapterMarkers.map((marker, index) => (
								<div
									key={index}
									className="absolute top-1/2 w-1 h-3 bg-white bg-opacity-60 rounded-full transform -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-opacity duration-200"
									style={{ left: `${(marker.time / duration) * 100}%` }}
									title={marker.title}
								></div>
							))}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							{}
							<button
								onClick={togglePlay}
								className="text-white hover:text-red-600 transition-all duration-200 cursor-pointer"
							>
								{isPlaying ? <Pause size={24} /> : <Play size={24} />}
							</button>

							{}
							<div
								ref={volumeSliderRef}
								className="relative flex items-center space-x-2 group"
							>
								<button
									onClick={toggleMute}
									className="text-white hover:text-red-600 transition-all duration-200 volume-button cursor-pointer"
								>
									{isMuted || volume === 0 ? (
										<VolumeX size={24} />
									) : (
										<Volume2 size={24} />
									)}
								</button>

								{}
								<div
									className={`
                  absolute bottom-full left-0 mb-2 bg-gray-900 rounded-md shadow-lg p-3 
                  transform origin-bottom-left transition-all duration-200
                  ${
										isVolumeSliderVisible
											? "scale-100"
											: "scale-0 hidden sm:block sm:scale-0 sm:opacity-0 sm:group-hover:scale-100 sm:group-hover:opacity-100"
									}
                `}
								>
									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={isMuted ? 0 : volume}
										onChange={handleVolumeChange}
										className="w-24 h-1 accent-red-600"
									/>
								</div>

								{}
								<div className="hidden sm:block group">
									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={isMuted ? 0 : volume}
										onChange={handleVolumeChange}
										className="w-0 group-hover:w-20 opacity-0 group-hover:opacity-100 transition-all duration-300 accent-red-600 h-1"
									/>
								</div>
							</div>

							{}
							<div className="text-white text-sm">
								{formatTime(currentTime)} / {formatTime(duration)}
							</div>
						</div>

						<div className="flex items-center space-x-4">
							{}
							<div className="relative">
								<button
									onClick={() => {
										setIsSubtitleMenuOpen(!isSubtitleMenuOpen);
										setIsQualityMenuOpen(false);
										setIsAudioMenuOpen(false);
										setIsVolumeSliderVisible(false);
									}}
									className="text-white hover:text-red-600 transition-all duration-200 cursor-pointer"
								>
									<List size={20} />
								</button>

								{isSubtitleMenuOpen && (
									<div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 border border-gray-800 rounded shadow-lg p-2 w-40 transform origin-bottom-right transition-all duration-200 scale-100">
										<div className="text-white text-xs font-semibold mb-1 px-2">
											Subtitles
										</div>
										{subtitleOptions.map((option) => (
											<button
												key={option}
												onClick={() => handleSubtitleChange(option)}
												className={`w-full text-left px-2 py-1 text-sm rounded cursor-pointer hover:bg-gray-800 transition-all duration-200 ${
													selectedSubtitle === option
														? "text-red-600"
														: "text-gray-300"
												}`}
											>
												{option}
											</button>
										))}
									</div>
								)}
							</div>

							{}
							<div className="relative">
								<button
									onClick={() => {
										setIsAudioMenuOpen(!isAudioMenuOpen);
										setIsQualityMenuOpen(false);
										setIsSubtitleMenuOpen(false);
										setIsVolumeSliderVisible(false);
									}}
									className="text-white hover:text-red-600 transition-all duration-200 cursor-pointer"
								>
									<Globe size={20} />
								</button>

								{isAudioMenuOpen && (
									<div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 border border-gray-800 rounded shadow-lg p-2 w-40 transform origin-bottom-right transition-all duration-200 scale-100">
										<div className="text-white text-xs font-semibold mb-1 px-2">
											Audio
										</div>
										{audioOptions.map((option) => (
											<button
												key={option}
												onClick={() => handleAudioChange(option)}
												className={`w-full text-left px-2 py-1 cursor-pointer text-sm rounded hover:bg-gray-800 transition-all duration-200 ${
													selectedAudio === option
														? "text-red-600"
														: "text-gray-300"
												}`}
											>
												{option}
											</button>
										))}
									</div>
								)}
							</div>

							{}
							<div className="relative">
								<button
									onClick={() => {
										setIsQualityMenuOpen(!isQualityMenuOpen);
										setIsSubtitleMenuOpen(false);
										setIsAudioMenuOpen(false);
										setIsVolumeSliderVisible(false);
									}}
									className="text-white hover:text-red-600 transition-all duration-200 cursor-pointer"
								>
									<Settings size={20} />
								</button>

								{isQualityMenuOpen && (
									<div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 border border-gray-800 rounded shadow-lg p-2 w-40 transform origin-bottom-right transition-all duration-200 scale-100">
										<div className="text-white text-xs font-semibold mb-1 px-2">
											Quality
										</div>
										{qualityOptions.map((option) => (
											<button
												key={option}
												onClick={() => handleQualityChange(option)}
												className={`w-full text-left px-2 py-1  cursor-pointer text-sm rounded hover:bg-gray-800 transition-all duration-200 ${
													selectedQuality === option
														? "text-red-600"
														: "text-gray-300"
												}`}
											>
												{option}
											</button>
										))}
									</div>
								)}
							</div>

							{}
							<button
								onClick={toggleFullscreen}
								className="text-white hover:text-red-600 transition-all duration-200 cursor-pointer"
							>
								{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
							</button>
						</div>
					</div>
				</div>

				{}
				{showSkipButton && (
					<div className="absolute bottom-24 right-4 animate-fadeIn">
						<button
							onClick={handleSkipIntro}
							className="bg-gray-800 bg-opacity-80 cursor-pointer text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-700"
						>
							Skip Intro <ChevronRight size={16} />
						</button>
					</div>
				)}

				{}
				{showSkipCredits && (
					<div className="absolute bottom-24 right-4 animate-fadeIn">
						<button
							onClick={handleSkipCredits}
							className="bg-gray-800 bg-opacity-80 cursor-pointer text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-700"
						>
							Skip to Next Episode <ChevronRight size={16} />
						</button>
					</div>
				)}

				{}
				{longPause && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
						<div className="bg-gray-900 p-6 rounded-lg max-w-md text-center">
							<div className="text-white text-xl font-bold mb-4">
								Are you still watching?
							</div>
							<p className="text-gray-400 mb-6">
								Press Continue to keep watching {seriesTitle}
							</p>
							<button
								onClick={handleContinueWatching}
								className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-duration-300 cursor-pointer"
							>
								Continue
							</button>
						</div>
					</div>
				)}

				{}
				{showNextEpisode && (
					<div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-black to-transparent flex items-end p-8 transition-all duration-500 animate-fadeIn">
						<div className="w-full md:w-1/2 lg:w-2/5 bg-black bg-opacity-80 p-5 rounded-lg border border-gray-800 shadow-xl">
							<div className="flex justify-between items-center mb-3">
								<div className="text-white font-bold text-lg">Up Next</div>
								<button
									onClick={() => setShowNextEpisode(false)}
									className="text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
								>
									<X size={20} />
								</button>
							</div>

							<div className="flex space-x-4 mb-4">
								<div className="relative w-32 h-20 bg-gray-900 rounded overflow-hidden flex-shrink-0">
									<img
										src={nextEpisodeThumbnail}
										alt="Next episode thumbnail"
										className="w-full h-full object-cover"
									/>

									{}
									<div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
										<div
											className="h-full bg-red-600"
											style={{ width: `${countdownProgress}%` }}
										></div>
									</div>
								</div>

								<div className="flex-1">
									<div className="text-white text-sm font-medium mb-1">
										{nextEpisodeTitle}
									</div>
									<div className="text-gray-400 text-xs mb-2">
										{nextEpisodeNumber} • {nextEpisodeDuration}
									</div>
									<div className="text-gray-300 text-xs line-clamp-2">
										{nextEpisodeDescription}
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<svg
										className="text-gray-500 mr-2 h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<circle cx="12" cy="12" r="10" strokeWidth="2" />
										<path
											d="M12 6v6l4 2"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
									<div className="text-gray-400 text-sm">
										Playing in{" "}
										<span className="text-white font-medium">
											{nextEpisodeCountdown}s
										</span>
									</div>
								</div>

								<div className="flex space-x-3">
									<button
										onClick={() => setShowNextEpisode(false)}
										className="border border-gray-600 cursor-pointer text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-800 transition-all duration-300"
									>
										Not Now
									</button>
									<button
										onClick={handlePlayNextEpisode}
										className="bg-white text-black px-3 py-1 cursor-pointer rounded text-sm font-medium hover:bg-gray-300 transition-all duration-300"
									>
										Play Now
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
