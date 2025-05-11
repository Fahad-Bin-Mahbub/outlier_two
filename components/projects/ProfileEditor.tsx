"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	FiHome,
	FiSearch,
	FiBell,
	FiUser,
	FiCamera,
	FiEdit3,
	FiSave,
	FiRotateCcw,
	FiRotateCw,
	FiEye,
	FiEyeOff,
	FiGlobe,
	FiUsers,
	FiTrash2,
	FiLink,
	FiImage,
	FiVideo,
	FiMusic,
	FiSettings,
	FiCheck,
	FiX,
	FiUpload,
	FiHeart,
	FiPlus,
	FiSmartphone,
} from "react-icons/fi";
import { FaLinkedin, FaYoutube, FaGithub } from "react-icons/fa";
import {
	FaTwitter,
	FaInstagram,
	FaFacebook,
	FaTiktok,
	FaDiscord,
	FaTwitch,
	FaMedium,
	FaLink,
} from "react-icons/fa";

interface HistoryState {
	bio: string;
	displayName: string;
	username: string;
	themeColor: string;
	avatar: string;
	highlights: HighlightItem[];
	privacySettings: PrivacySettings;
}

interface LinkPreview {
	url: string;
	title: string;
	description: string;
	image: string;
	favicon: string;
	type:
		| "linkedin"
		| "youtube"
		| "github"
		| "twitter"
		| "instagram"
		| "facebook"
		| "tiktok"
		| "discord"
		| "twitch"
		| "medium"
		| "external";
}

interface HighlightItem {
	id: string;
	type: "image" | "video" | "music" | "link";
	title: string;
	content: string;
	thumbnail?: string;
	views?: number;
	likes?: number;
	date?: string;
	isStory?: boolean;
}

interface PrivacySettings {
	profileVisibility: "public" | "friends" | "private";
	showActivity: boolean;
	allowMessages: boolean;
	showOnlineStatus: boolean;
}
/* eslint-disable @next/next/no-img-element */

interface ThemeColor {
	name: string;
	gradient: string;
	color: string;
	accent: string;
	glow: string;
}

const themeColors: ThemeColor[] = [
	{
		name: "Vibrant Mint",
		gradient: "linear-gradient(135deg, #1a2f3a 0%, #2d4a5a 50%, #40e0d0 100%)",
		color: "#1a2f3a",
		accent: "#40e0d0",
		glow: "#64f4e2",
	},
	{
		name: "Midnight Aurora",
		gradient: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
		color: "#0f0f23",
		accent: "#4c1d95",
		glow: "#8b5cf6",
	},
	{
		name: "Cosmic Black",
		gradient: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
		color: "#000000",
		accent: "#374151",
		glow: "#6b7280",
	},
	{
		name: "Deep Ocean",
		gradient: "linear-gradient(135deg, #0c1426 0%, #1e293b 50%, #334155 100%)",
		color: "#0c1426",
		accent: "#1e40af",
		glow: "#3b82f6",
	},
	{
		name: "Royal Purple",
		gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
		color: "#1e1b4b",
		accent: "#7c3aed",
		glow: "#a855f7",
	},
	{
		name: "Rose Gold",
		gradient: "linear-gradient(135deg, #4c1d24 0%, #7c2d12 50%, #dc2626 100%)",
		color: "#4c1d24",
		accent: "#dc2626",
		glow: "#f87171",
	},
];

export default function ProfileEditorExport() {
	const [activeTab, setActiveTab] = useState("profile");
	const [isEditing, setIsEditing] = useState(false);
	const [linkPreviews, setLinkPreviews] = useState<LinkPreview[]>([]);
	const [isLoadingPreview, setIsLoadingPreview] = useState(false);
	const [showDesktopOverlay, setShowDesktopOverlay] = useState(false);

	const [profileData, setProfileData] = useState({
		displayName: "Alexandra Chen",
		username: "@alexandra.creates",
		bio: "✨ Creative Director & Digital Artist\n🎨 Crafting beautiful experiences\n🌍 Based in Tokyo • Available for projects",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
		coverImage:
			"https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop",
		themeGradient:
			"linear-gradient(135deg, #1a2f3a 0%, #2d4a5a 50%, #40e0d0 100%)",
		themeColor: "#1a2f3a",
		themeAccent: "#40e0d0",
		themeGlow: "#64f4e2",
		followers: 12847,
		following: 892,
		posts: 156,
		verified: true,
		level: "Pro",
	});

	const [bioText, setBioText] = useState(profileData.bio);
	const [bioCharCount, setBioCharCount] = useState(profileData.bio.length);
	const [links, setLinks] = useState([
		"https://linkedin.com",
		"https://youtube.com",
		"https://github.com",
	]);
	const maxBioLength = 200;

	useEffect(() => {
		if (isEditing) {
			processLinks(links.join("\n"));
		} else {
			setLinkPreviews([]);
		}
	}, [isEditing, links]);

	const [highlights, setHighlights] = useState<HighlightItem[]>([
		{
			id: "1",
			type: "image",
			title: "Brand Identity Project",
			content: "Niki x Studio Collaboration",
			thumbnail:
				"https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&h=200&fit=crop",
			views: 1234,
			likes: 89,
			date: "2024-03-15",
			isStory: true,
		},
		{
			id: "2",
			type: "video",
			title: "Motion Graphics Reel",
			content: "2024 Creative Showcase",
			thumbnail:
				"https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=200&fit=crop",
			views: 2345,
			likes: 156,
			date: "2024-03-14",
			isStory: false,
		},
		{
			id: "3",
			type: "music",
			title: "Creative Flow Playlist",
			content: "Deep Focus & Inspiration",
			thumbnail:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
			views: 890,
			likes: 45,
			date: "2024-03-13",
			isStory: false,
		},
		{
			id: "4",
			type: "link",
			title: "Portfolio Website",
			content: "alexandra-creates.com",
			thumbnail:
				"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
			views: 567,
			likes: 23,
			date: "2024-03-12",
			isStory: false,
		},
		{
			id: "5",
			type: "image",
			title: "Urban Photography",
			content: "City Life Collection",
			thumbnail:
				"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&h=200&fit=crop",
			views: 3456,
			likes: 234,
			date: "2024-03-11",
			isStory: true,
		},
		{
			id: "6",
			type: "image",
			title: "Nature Series",
			content: "Mountain Landscapes",
			thumbnail:
				"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop",
			views: 4567,
			likes: 345,
			date: "2024-03-10",
			isStory: true,
		},
		{
			id: "7",
			type: "image",
			title: "Abstract Art",
			content: "Digital Paintings",
			thumbnail:
				"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop",
			views: 2345,
			likes: 167,
			date: "2024-03-09",
			isStory: true,
		},
		{
			id: "8",
			type: "image",
			title: "Minimal Design",
			content: "Clean Aesthetics",
			thumbnail:
				"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop",
			views: 3456,
			likes: 234,
			date: "2024-03-08",
			isStory: false,
		},
		{
			id: "9",
			type: "image",
			title: "Architecture",
			content: "Modern Buildings",
			thumbnail:
				"https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=200&h=200&fit=crop",
			views: 4567,
			likes: 345,
			date: "2024-03-07",
			isStory: false,
		},
		{
			id: "10",
			type: "image",
			title: "Travel Diary",
			content: "Around the World",
			thumbnail:
				"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop",
			views: 5678,
			likes: 456,
			date: "2024-03-06",
			isStory: false,
		},
		{
			id: "11",
			type: "image",
			title: "Street Photography",
			content: "Urban Moments",
			thumbnail:
				"https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&h=200&fit=crop",
			views: 3456,
			likes: 234,
			date: "2024-03-05",
			isStory: false,
		},
		{
			id: "12",
			type: "image",
			title: "Food Photography",
			content: "Culinary Art",
			thumbnail:
				"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop",
			views: 4567,
			likes: 345,
			date: "2024-03-04",
			isStory: false,
		},
		{
			id: "13",
			type: "image",
			title: "Fashion Collection",
			content: "Style & Trends",
			thumbnail:
				"https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
			views: 5678,
			likes: 456,
			date: "2024-03-03",
			isStory: false,
		},
	]);

	const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
		profileVisibility: "public",
		showActivity: true,
		allowMessages: true,
		showOnlineStatus: false,
	});

	const [history, setHistory] = useState<HistoryState[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);

	const [showAvatarCrop, setShowAvatarCrop] = useState(false);
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [showPrivacyPanel, setShowPrivacyPanel] = useState(false);
	const [notification, setNotification] = useState<string | null>(null);

	const [cropImage, setCropImage] = useState<string | null>(null);
	const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
	const [cropZoom, setCropZoom] = useState(1);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [cropSize] = useState(200);
	const [isDragging, setIsDragging] = useState(false);

	const [touchStartX, setTouchStartX] = useState<number | null>(null);
	const [scrollLeft, setScrollLeft] = useState(0);
	const storiesContainerRef = useRef<HTMLDivElement>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const coverInputRef = useRef<HTMLInputElement>(null);
	const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

	const [showPostModal, setShowPostModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const imageUploadRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const checkViewport = () => {
			setShowDesktopOverlay(window.innerWidth > 768);
		};

		checkViewport();
		window.addEventListener("resize", checkViewport);

		return () => window.removeEventListener("resize", checkViewport);
	}, []);

	const saveToHistory = useCallback(() => {
		const currentState: HistoryState = {
			bio: bioText,
			displayName: profileData.displayName,
			username: profileData.username,
			themeColor: profileData.themeColor,
			avatar: profileData.avatar,
			highlights: [...highlights],
			privacySettings: { ...privacySettings },
		};

		const newHistory = history.slice(0, historyIndex + 1);

		if (historyIndex >= 0) {
			const lastState = history[historyIndex];
			if (JSON.stringify(lastState) === JSON.stringify(currentState)) {
				return;
			}
		}

		newHistory.push(currentState);
		setHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
	}, [
		bioText,
		profileData,
		highlights,
		privacySettings,
		history,
		historyIndex,
	]);

	const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value;
		if (text.length <= maxBioLength) {
			setBioText(text);
			setBioCharCount(text.length);
		}
	};

	const handleLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value;
		const newLinks = text.split("\n").filter((link) => link.trim() !== "");
		setLinks(newLinks);
	};

	const processLinks = async (text: string) => {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const urls = text.match(urlRegex) || [];

		if (urls.length === 0) {
			setLinkPreviews([]);
			return;
		}

		setIsLoadingPreview(true);
		const newPreviews: LinkPreview[] = [];

		for (const url of urls) {
			try {
				let preview: LinkPreview;
				const urlLower = url.toLowerCase();

				const hasDomain = (domain: string) => {
					return (
						urlLower.includes(domain) ||
						urlLower.includes(domain.replace(".", ""))
					);
				};

				if (hasDomain("linkedin.com")) {
					preview = {
						url,
						title: "LinkedIn Profile",
						description: "Connect with me on LinkedIn",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "linkedin",
					};
				} else if (hasDomain("youtube.com")) {
					preview = {
						url,
						title: "YouTube Channel",
						description: "Check out my YouTube content",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "youtube",
					};
				} else if (hasDomain("github.com")) {
					preview = {
						url,
						title: "GitHub Profile",
						description: "Explore my code repositories",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "github",
					};
				} else if (hasDomain("twitter.com") || hasDomain("x.com")) {
					preview = {
						url,
						title: "Twitter Profile",
						description: "Follow me on Twitter",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "twitter",
					};
				} else if (hasDomain("instagram.com")) {
					preview = {
						url,
						title: "Instagram Profile",
						description: "Follow my Instagram",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "instagram",
					};
				} else if (hasDomain("facebook.com")) {
					preview = {
						url,
						title: "Facebook Profile",
						description: "Connect with me on Facebook",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "facebook",
					};
				} else if (hasDomain("tiktok.com")) {
					preview = {
						url,
						title: "TikTok Profile",
						description: "Follow me on TikTok",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "tiktok",
					};
				} else if (hasDomain("discord.gg") || hasDomain("discord.com")) {
					preview = {
						url,
						title: "Discord Server",
						description: "Join my Discord community",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "discord",
					};
				} else if (hasDomain("twitch.tv")) {
					preview = {
						url,
						title: "Twitch Channel",
						description: "Watch my live streams",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "twitch",
					};
				} else if (hasDomain("medium.com")) {
					preview = {
						url,
						title: "Medium Blog",
						description: "Read my articles on Medium",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "medium",
					};
				} else {
					preview = {
						url,
						title: "External Link",
						description: "Visit this link",
						image: "https://via.placeholder.com/300x200",
						favicon: "https://via.placeholder.com/32x32",
						type: "external",
					};
				}

				newPreviews.push(preview);
			} catch (error) {
				console.error("Error fetching link preview:", error);
			}
		}

		setLinkPreviews(newPreviews);
		setIsLoadingPreview(false);
	};

	const saveProfile = () => {
		setProfileData((prev) => ({ ...prev, bio: bioText }));
		setIsEditing(false);
		saveToHistory();
		showNotification("Profile saved successfully!");
	};

	const cancelEditing = () => {
		setIsEditing(false);
		setBioText(profileData.bio);
		setBioCharCount(profileData.bio.length);
		setLinkPreviews([]);
	};

	const handleThemeChange = (theme: ThemeColor) => {
		setProfileData((prev) => ({
			...prev,
			themeColor: theme.color,
			themeGradient: theme.gradient,
			themeAccent: theme.accent,
			themeGlow: theme.glow,
		}));
		setShowColorPicker(false);
		saveToHistory();
		showNotification("✨ Theme updated successfully!");
	};

	const togglePrivacySetting = (
		key: keyof PrivacySettings,
		value?: string | boolean
	) => {
		setPrivacySettings((prev) => ({
			...prev,
			[key]:
				value !== undefined
					? value
					: !prev[key as keyof Omit<PrivacySettings, "profileVisibility">],
		}));
		saveToHistory();
		showNotification("Privacy settings updated!");
	};

	const undo = useCallback(() => {
		if (historyIndex > 0) {
			const prevState = history[historyIndex - 1];

			setBioText(prevState.bio);
			setBioCharCount(prevState.bio.length);
			setProfileData((prev) => ({
				...prev,
				bio: prevState.bio,
				displayName: prevState.displayName,
				username: prevState.username,
				themeColor: prevState.themeColor,
				avatar: prevState.avatar,
				themeGradient:
					themeColors.find((t) => t.color === prevState.themeColor)?.gradient ||
					prev.themeGradient,
				themeAccent:
					themeColors.find((t) => t.color === prevState.themeColor)?.accent ||
					prev.themeAccent,
				themeGlow:
					themeColors.find((t) => t.color === prevState.themeColor)?.glow ||
					prev.themeGlow,
			}));

			setHighlights(prevState.highlights);
			setPrivacySettings(prevState.privacySettings);

			setHistoryIndex(historyIndex - 1);
			showNotification("Changes undone");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history, historyIndex, themeColors]);

	const redo = useCallback(() => {
		if (historyIndex < history.length - 1) {
			const nextState = history[historyIndex + 1];

			setBioText(nextState.bio);
			setBioCharCount(nextState.bio.length);
			setProfileData((prev) => ({
				...prev,
				bio: nextState.bio,
				displayName: nextState.displayName,
				username: nextState.username,
				themeColor: nextState.themeColor,
				avatar: nextState.avatar,
				themeGradient:
					themeColors.find((t) => t.color === nextState.themeColor)?.gradient ||
					prev.themeGradient,
				themeAccent:
					themeColors.find((t) => t.color === nextState.themeColor)?.accent ||
					prev.themeAccent,
				themeGlow:
					themeColors.find((t) => t.color === nextState.themeColor)?.glow ||
					prev.themeGlow,
			}));

			setHighlights(nextState.highlights);
			setPrivacySettings(nextState.privacySettings);

			setHistoryIndex(historyIndex + 1);
			showNotification("Changes restored");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history, historyIndex, themeColors]);

	useEffect(() => {
		if (history.length === 0) {
			const initialState: HistoryState = {
				bio: profileData.bio,
				displayName: profileData.displayName,
				username: profileData.username,
				themeColor: profileData.themeColor,
				avatar: profileData.avatar,
				highlights: [...highlights],
				privacySettings: { ...privacySettings },
			};
			setHistory([initialState]);
			setHistoryIndex(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const showNotification = (message: string) => {
		setNotification(message);
		setTimeout(() => setNotification(null), 2000);
	};

	const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageUrl = e.target?.result as string;
				setCropImage(imageUrl);
				setCropPosition({ x: 0, y: 0 });
				setCropZoom(1);
				setShowAvatarCrop(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCropMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleCropMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		const dx = e.clientX - dragStart.x;
		const dy = e.clientY - dragStart.y;
		setCropPosition((prev) => ({
			x: prev.x + dx,
			y: prev.y + dy,
		}));
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleCropMouseUp = () => {
		setIsDragging(false);
	};

	const handleCropTouchStart = (e: React.TouchEvent) => {
		const touch = e.touches[0];
		setIsDragging(true);
		setDragStart({ x: touch.clientX, y: touch.clientY });
	};

	const handleCropTouchMove = (e: React.TouchEvent) => {
		if (!isDragging) return;
		const touch = e.touches[0];
		const dx = touch.clientX - dragStart.x;
		const dy = touch.clientY - dragStart.y;
		setCropPosition((prev) => ({
			x: prev.x + dx,
			y: prev.y + dy,
		}));
		setDragStart({ x: touch.clientX, y: touch.clientY });
	};

	const handleCropTouchEnd = () => {
		setIsDragging(false);
	};

	const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCropZoom(parseFloat(e.target.value));
	};

	const applyCrop = () => {
		if (!cropImage) return;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.onload = () => {
			canvas.width = cropSize;
			canvas.height = cropSize;

			if (ctx) {
				const displayWidth = 400;
				const displayHeight = 400;

				const scaleX = img.width / displayWidth;
				const scaleY = img.height / displayHeight;

				const sourceSize = cropSize / cropZoom;
				const sourceX =
					((displayWidth / 2 - cropPosition.x - cropSize / 2) * scaleX) /
					cropZoom;
				const sourceY =
					((displayHeight / 2 - cropPosition.y - cropSize / 2) * scaleY) /
					cropZoom;
				const sourceWidth = sourceSize * scaleX;
				const sourceHeight = sourceSize * scaleY;

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				ctx.drawImage(
					img,
					sourceX,
					sourceY,
					sourceWidth,
					sourceHeight,
					0,
					0,
					cropSize,
					cropSize
				);

				const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
				setProfileData((prev) => ({ ...prev, avatar: croppedDataUrl }));
				setShowAvatarCrop(false);
				setCropImage(null);
				saveToHistory();
				showNotification("✨ Avatar updated successfully!");
			}
		};

		img.src = cropImage;
	};

	const resetCrop = () => {
		setCropPosition({ x: 0, y: 0 });
		setCropZoom(1);
		showNotification("🔄 Crop reset");
	};

	const removeHighlight = (id: string) => {
		setHighlights((prev) => prev.filter((item) => item.id !== id));
		queueMicrotask(saveToHistory);
		showNotification("Highlight removed!");
	};

	const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageUrl = e.target?.result as string;
				setProfileData((prev) => ({ ...prev, coverImage: imageUrl }));
				saveToHistory();
				showNotification("✨ Cover image updated successfully!");
			};
			reader.readAsDataURL(file);
		}
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		if (storiesContainerRef.current) {
			setTouchStartX(e.touches[0].clientX);
			setScrollLeft(storiesContainerRef.current.scrollLeft);
		}
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!touchStartX || !storiesContainerRef.current) return;

		const x = e.touches[0].clientX;
		const walk = (touchStartX - x) * 2;
		storiesContainerRef.current.scrollLeft = scrollLeft + walk;
	};

	const handleTouchEnd = () => {
		setTouchStartX(null);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageUrl = e.target?.result as string;
				setSelectedImage(imageUrl);
			};
			reader.readAsDataURL(file);
		}
	};

	const handlePostImage = () => {
		if (selectedImage) {
			const newHighlight: HighlightItem = {
				id: Date.now().toString(),
				type: "image",
				title: "New Highlight",
				content: "Uploaded image",
				thumbnail: selectedImage,
				views: 0,
				likes: 0,
				date: new Date().toISOString().split("T")[0],
				isStory: true,
			};
			setHighlights((prev) => [newHighlight, ...prev]);
			queueMicrotask(saveToHistory);
			setShowPostModal(false);
			setSelectedImage(null);
			showNotification("Highlight added successfully!");
		}
	};

	const handleGalleryImage = () => {
		if (selectedImage) {
			const newHighlight: HighlightItem = {
				id: Date.now().toString(),
				type: "image",
				title: "New Image",
				content: "Uploaded image",
				thumbnail: selectedImage,
				views: 0,
				likes: 0,
				date: new Date().toISOString().split("T")[0],
				isStory: false,
			};
			setHighlights((prev) => [...prev, newHighlight]);
			queueMicrotask(saveToHistory);
			setShowPostModal(false);
			setSelectedImage(null);
			showNotification("Image added to gallery!");
		}
	};

	const dragStory = useRef<HighlightItem | null>(null);
	const dragHighlight = useRef<HighlightItem | null>(null);
	const [, setDraggedElement] = useState<HTMLElement | null>(null);
	const [, setDraggedOverId] = useState<string | null>(null);

	const handleStoryDragStart = (
		story: HighlightItem,
		e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
	) => {
		e.preventDefault();
		dragStory.current = story;

		if ("touches" in e) {
			const touch = e.touches[0];
			const element = e.currentTarget as HTMLElement;
			setDraggedElement(element.cloneNode(true) as HTMLElement);

			const clone = element.cloneNode(true) as HTMLElement;
			clone.style.position = "fixed";
			clone.style.pointerEvents = "none";
			clone.style.opacity = "0.8";
			clone.style.zIndex = "1000";
			clone.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
			clone.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
			clone.id = "drag-clone";
			document.body.appendChild(clone);
		}
	};

	const handleStoryDragMove = (e: React.TouchEvent<HTMLDivElement>) => {
		e.preventDefault();
		const touch = e.touches[0];
		const clone = document.getElementById("drag-clone");

		if (clone) {
			clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
			clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;

			const elementBelow = document.elementFromPoint(
				touch.clientX,
				touch.clientY
			);
			const storyElement = elementBelow?.closest("[data-story-id]");

			if (storyElement) {
				const targetId = storyElement.getAttribute("data-story-id");
				if (targetId && targetId !== dragStory.current?.id) {
					setDraggedOverId(targetId);
					handleStoryReorder(targetId);
				}
			}
		}
	};

	const handleStoryReorder = (targetId: string) => {
		if (!dragStory.current || dragStory.current.id === targetId) return;

		setHighlights((prev) => {
			const updated = [...prev];
			const from = updated.findIndex((h) => h.id === dragStory.current!.id);
			const to = updated.findIndex((h) => h.id === targetId);
			if (from === -1 || to === -1) return prev;
			const [moved] = updated.splice(from, 1);
			updated.splice(to, 0, moved);
			return updated;
		});
	};

	const handleStoryDragEnd = (
		e?: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
	) => {
		if (e) e.preventDefault();

		const clone = document.getElementById("drag-clone");
		if (clone) {
			clone.remove();
		}

		dragStory.current = null;
		setDraggedElement(null);
		setDraggedOverId(null);
		saveToHistory();
	};

	const handleStoryDragOver = (
		e: React.DragEvent<HTMLDivElement>,
		targetId: string
	) => {
		e.preventDefault();
		if (!dragStory.current || dragStory.current.id === targetId) return;
		handleStoryReorder(targetId);
	};

	const handleHighlightDragStart = (
		h: HighlightItem,
		e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
	) => {
		e.preventDefault();
		dragHighlight.current = h;

		if ("touches" in e) {
			const touch = e.touches[0];
			const element = e.currentTarget as HTMLElement;

			const clone = element.cloneNode(true) as HTMLElement;
			clone.style.position = "fixed";
			clone.style.pointerEvents = "none";
			clone.style.opacity = "0.8";
			clone.style.zIndex = "1000";
			clone.style.width = element.offsetWidth + "px";
			clone.style.height = element.offsetHeight + "px";
			clone.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
			clone.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
			clone.id = "highlight-drag-clone";
			document.body.appendChild(clone);
		}
	};

	const handleHighlightDragMove = (e: React.TouchEvent<HTMLDivElement>) => {
		e.preventDefault();
		const touch = e.touches[0];
		const clone = document.getElementById("highlight-drag-clone");

		if (clone) {
			clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
			clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;

			const elementBelow = document.elementFromPoint(
				touch.clientX,
				touch.clientY
			);
			const highlightElement = elementBelow?.closest("[data-highlight-id]");

			if (highlightElement) {
				const targetId = highlightElement.getAttribute("data-highlight-id");
				if (targetId && targetId !== dragHighlight.current?.id) {
					handleHighlightReorder(targetId);
				}
			}
		}
	};

	const handleHighlightReorder = (targetId: string) => {
		if (!dragHighlight.current || dragHighlight.current.id === targetId) return;

		setHighlights((prev) => {
			const updated = [...prev];
			const from = updated.findIndex((x) => x.id === dragHighlight.current!.id);
			const to = updated.findIndex((x) => x.id === targetId);
			if (from === -1 || to === -1) return prev;
			const [moved] = updated.splice(from, 1);
			updated.splice(to, 0, moved);
			return updated;
		});
	};

	const handleHighlightDragEnd = (
		e?: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
	) => {
		if (e) e.preventDefault();

		const clone = document.getElementById("highlight-drag-clone");
		if (clone) {
			clone.remove();
		}

		dragHighlight.current = null;
		saveToHistory();
	};

	const handleHighlightDragOver = (
		e: React.DragEvent<HTMLDivElement>,
		targetId: string
	) => {
		e.preventDefault();
		if (!dragHighlight.current || dragHighlight.current.id === targetId) return;
		handleHighlightReorder(targetId);
	};

	return (
		<div
			className="min-h-screen text-white font-sans relative"
			style={{ background: profileData.themeGradient }}
		>
			<AnimatePresence>
				{showDesktopOverlay && (
					<motion.div
						className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="max-w-md w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.1 }}
						>
							<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
								<FiSmartphone className="w-10 h-10 text-white" />
							</div>

							<h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-4">
								Mobile View Required
							</h2>

							<p className="text-white/80 mb-6">
								This profile customization experience is optimized for mobile
								devices. Please switch to mobile view for the best experience.
							</p>

							<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-6">
								<p className="text-sm text-white/60 mb-2">
									How to switch to mobile view:
								</p>
								<ol className="text-sm text-white/80 text-left space-y-1">
									<li>
										1. Right-click and select &quot;Inspect&quot; (or press F12)
									</li>
									<li>2. Click the device toggle toolbar icon</li>
									<li>3. Select a mobile device from the dropdown</li>
								</ol>
							</div>

							<motion.button
								onClick={() => setShowDesktopOverlay(false)}
								className="w-full py-3 px-6 bg-gradient-to-r from-white/20 to-white/10 text-white rounded-xl font-semibold hover:from-white/30 hover:to-white/20 transition-all duration-300"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Continue Anyway
							</motion.button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div
					className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
					style={{
						background: `radial-gradient(circle, ${profileData.themeGlow} 0%, transparent 70%)`,
						filter: "blur(40px)",
					}}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.1, 0.3, 0.1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20"
					style={{
						background: `radial-gradient(circle, ${profileData.themeAccent} 0%, transparent 70%)`,
						filter: "blur(40px)",
					}}
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.2, 0.1, 0.2],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			<div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
				<div className="flex items-center justify-between p-4">
					<motion.div
						className="flex items-center gap-3"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
					>
						<div className="relative">
							<motion.div
								className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<div
									className="w-3 h-3 rounded-sm"
									style={{ backgroundColor: profileData.themeGlow }}
								/>
							</motion.div>
							<motion.div
								className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black"
								style={{ backgroundColor: profileData.themeGlow }}
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 2, repeat: Infinity }}
							/>
						</div>
						<div>
							<h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
								{activeTab === "profile"
									? "Profile Studio"
									: activeTab === "home"
									? "Home"
									: activeTab === "search"
									? "Search"
									: activeTab === "notifications"
									? "Notifications"
									: "Profile Studio"}
							</h1>
							<div className="flex items-center gap-1">
								<div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
								<span className="text-xs text-white/60">Live Preview</span>
							</div>
						</div>
					</motion.div>

					<div className="flex items-center gap-2">
						<motion.button
							onClick={undo}
							disabled={historyIndex <= 0}
							className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 cursor-pointer"
							whileHover={{ scale: 1.05, y: -1 }}
							whileTap={{ scale: 0.95 }}
						>
							<FiRotateCcw className="w-4 h-4" />
						</motion.button>

						<motion.button
							onClick={redo}
							disabled={historyIndex >= history.length - 1}
							className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 cursor-pointer"
							whileHover={{ scale: 1.05, y: -1 }}
							whileTap={{ scale: 0.95 }}
						>
							<FiRotateCw className="w-4 h-4" />
						</motion.button>

						<motion.button
							onClick={() => setShowColorPicker(true)}
							className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
							whileHover={{ scale: 1.05, y: -1 }}
							whileTap={{ scale: 0.95 }}
						>
							<FiEdit3 className="w-4 h-4" />
						</motion.button>

						<motion.button
							onClick={() => setShowPrivacyPanel(true)}
							className="p-2.5 rounded-xl bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 hover:from-white/30 hover:to-white/20 transition-all duration-300 shadow-lg cursor-pointer"
							whileHover={{ scale: 1.05, y: -1 }}
							whileTap={{ scale: 0.95 }}
						>
							<FiSettings className="w-4 h-4" />
						</motion.button>
					</div>
				</div>
			</div>

			<div
				className="flex-1 overflow-y-auto pb-24"
				style={{ height: "calc(100vh - 144px)" }}
			>
				{activeTab === "profile" ? (
					<>
						<div className="relative">
							<div className="h-40 md:h-60 lg:h-80 relative overflow-hidden mx-auto max-w-7xl">
								<div
									className="absolute inset-0"
									style={{ background: profileData.themeGradient }}
								/>
								<img
									src={profileData.coverImage}
									alt="Cover"
									className="absolute inset-0 w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

								<div className="absolute inset-0">
									{[
										{ x: 100, y: 50 },
										{ x: 200, y: 80 },
										{ x: 150, y: 120 },
										{ x: 250, y: 40 },
										{ x: 180, y: 100 },
										{ x: 220, y: 60 },
									].map((pos, i) => (
										<motion.div
											key={i}
											className="absolute w-1 h-1 rounded-full"
											style={{
												backgroundColor: profileData.themeGlow,
												opacity: 0,
												transform: `translateX(${pos.x}px) translateY(${pos.y}px)`,
											}}
											initial={{
												opacity: 0,
											}}
											animate={{
												y: [-20, 0, -20],
												opacity: [0, 0.6, 0],
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												delay: i * 0.5,
											}}
										/>
									))}
								</div>

								<div className="absolute top-4 right-4 flex gap-2">
									<motion.button
										onClick={() => coverInputRef.current?.click()}
										className="p-3 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 hover:bg-black/50 transition-all duration-300 shadow-xl cursor-pointer"
										whileHover={{ scale: 1.05, y: -2 }}
										whileTap={{ scale: 0.95 }}
									>
										<FiCamera className="w-4 h-4 text-white" />
									</motion.button>
								</div>

								<input
									ref={coverInputRef}
									type="file"
									accept="image/*"
									onChange={handleCoverUpload}
									className="hidden"
								/>
							</div>

							<div className="px-6 pb-8 max-w-7xl mx-auto">
								<div className="relative -mt-20 mb-6">
									<motion.div
										className="relative w-28 h-28 mx-auto"
										whileHover={{ scale: 1.05 }}
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ delay: 0.2 }}
									>
										<div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm p-1">
											<img
												src={profileData.avatar}
												alt="Profile"
												className="w-full h-full rounded-full object-cover border-2 border-white/30"
											/>
										</div>

										<motion.button
											onClick={() => fileInputRef.current?.click()}
											className="absolute bottom-1 right-1 p-2.5 rounded-full bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm border border-white/50 hover:from-white hover:to-white/90 transition-all duration-300 shadow-lg cursor-pointer"
											whileHover={{ scale: 1.1, y: -1 }}
											whileTap={{ scale: 0.95 }}
										>
											<FiCamera className="w-3.5 h-3.5 text-gray-800" />
										</motion.button>

										<motion.div
											className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-3 border-black flex items-center justify-center"
											animate={{ scale: [1, 1.1, 1] }}
											transition={{ duration: 2, repeat: Infinity }}
										>
											<div className="w-2 h-2 rounded-full bg-white" />
										</motion.div>

										<input
											ref={fileInputRef}
											type="file"
											accept="image/*"
											onChange={handleAvatarUpload}
											className="hidden"
										/>
									</motion.div>
								</div>

								<motion.div
									className="text-center mb-6"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
								>
									<div className="flex items-center justify-center gap-2 mb-2">
										<h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
											{profileData.displayName}
										</h2>
										{profileData.verified && (
											<motion.div
												className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
												whileHover={{ scale: 1.1 }}
											>
												<FiCheck className="w-3 h-3 text-white" />
											</motion.div>
										)}
									</div>
									<p className="text-white/60 text-sm mb-2">
										{profileData.username}
									</p>
									<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
										<div
											className="w-2 h-2 rounded-full"
											style={{ backgroundColor: profileData.themeGlow }}
										/>
										<span className="text-xs font-medium text-white/80">
											{profileData.level} Member
										</span>
									</div>
								</motion.div>

								<motion.div
									className="flex justify-center gap-8 mb-8"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
								>
									{[
										{ label: "Posts", value: profileData.posts },
										{
											label: "Followers",
											value: profileData.followers.toLocaleString(),
										},
										{ label: "Following", value: profileData.following },
									].map((stat) => (
										<motion.div
											key={stat.label}
											className="text-center"
											whileHover={{ scale: 1.05 }}
										>
											<div className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-1">
												{stat.value}
											</div>
											<div className="text-xs text-white/50 font-medium">
												{stat.label}
											</div>
										</motion.div>
									))}
								</motion.div>

								<motion.div
									className="mb-8"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
								>
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
											About
										</h3>
										{!isEditing && (
											<motion.button
												onClick={() => setIsEditing(!isEditing)}
												className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
												whileHover={{ scale: 1.05, y: -1 }}
												whileTap={{ scale: 0.95 }}
											>
												<FiEdit3 className="w-4 h-4" />
											</motion.button>
										)}
									</div>

									{isEditing ? (
										<motion.div
											className="space-y-4"
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
										>
											<div className="relative">
												<textarea
													ref={bioTextareaRef}
													value={bioText}
													onChange={handleBioChange}
													placeholder="Share your story with the world..."
													className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 resize-none focus:outline-none focus:border-white/40 transition-all duration-300 text-sm leading-relaxed"
													rows={5}
													maxLength={maxBioLength}
												/>
												<div className="absolute bottom-3 right-3 text-xs text-white/40 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
													{bioCharCount}/{maxBioLength}
												</div>
											</div>

											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<h4 className="text-sm font-semibold text-white">
														Social Media Links
													</h4>
													<span className="text-xs text-white/40">
														One link per line
													</span>
												</div>
												<div className="relative">
													<textarea
														value={links.join("\n")}
														onChange={handleLinksChange}
														placeholder="Add your social media links (one per line)..."
														className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 resize-none focus:outline-none focus:border-white/40 transition-all duration-300 text-sm leading-relaxed"
														rows={3}
														style={{ minHeight: "100px" }}
													/>
													<div className="absolute bottom-3 right-3 text-xs text-white/40 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
														{links.length} links
													</div>
												</div>
											</div>

											{isLoadingPreview && (
												<motion.div
													className="flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
												>
													<div className="flex items-center gap-3">
														<div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
														<span className="text-sm text-white/60">
															Loading link previews...
														</span>
													</div>
												</motion.div>
											)}
											{!isLoadingPreview && linkPreviews.length > 0 && (
												<motion.div
													className="space-y-2"
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
												>
													{linkPreviews.map((preview, index) => (
														<motion.div
															key={preview.url}
															className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: index * 0.1 }}
														>
															<div className="flex gap-3 p-3">
																<div
																	className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${
																		preview.type === "linkedin"
																			? "bg-[#0077B5]"
																			: preview.type === "youtube"
																			? "bg-[#FF0000]"
																			: preview.type === "github"
																			? "bg-[#333]"
																			: preview.type === "twitter"
																			? "bg-[#1DA1F2]"
																			: preview.type === "instagram"
																			? "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
																			: preview.type === "facebook"
																			? "bg-[#1877F2]"
																			: preview.type === "tiktok"
																			? "bg-[#000000]"
																			: preview.type === "discord"
																			? "bg-[#5865F2]"
																			: preview.type === "twitch"
																			? "bg-[#9146FF]"
																			: preview.type === "medium"
																			? "bg-[#000000]"
																			: "bg-gray-600"
																	}`}
																>
																	{preview.type === "linkedin" && (
																		<FaLinkedin className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "youtube" && (
																		<FaYoutube className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "github" && (
																		<FaGithub className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "twitter" && (
																		<FaTwitter className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "instagram" && (
																		<FaInstagram className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "facebook" && (
																		<FaFacebook className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "tiktok" && (
																		<FaTiktok className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "discord" && (
																		<FaDiscord className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "twitch" && (
																		<FaTwitch className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "medium" && (
																		<FaMedium className="w-6 h-6 text-white" />
																	)}
																	{preview.type === "external" && (
																		<FaLink className="w-6 h-6 text-white" />
																	)}
																</div>
																<div className="flex-1 min-w-0">
																	<div className="flex items-center gap-2">
																		{preview.type === "linkedin" && (
																			<FaLinkedin className="w-3.5 h-3.5 text-[#0077B5]" />
																		)}
																		{preview.type === "youtube" && (
																			<FaYoutube className="w-3.5 h-3.5 text-[#FF0000]" />
																		)}
																		{preview.type === "github" && (
																			<FaGithub className="w-3.5 h-3.5 text-[#333]" />
																		)}
																		{preview.type === "twitter" && (
																			<FaTwitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
																		)}
																		{preview.type === "instagram" && (
																			<FaInstagram className="w-3.5 h-3.5 text-[#E1306C]" />
																		)}
																		{preview.type === "facebook" && (
																			<FaFacebook className="w-3.5 h-3.5 text-[#1877F2]" />
																		)}
																		{preview.type === "tiktok" && (
																			<FaTiktok className="w-3.5 h-3.5 text-[#000000]" />
																		)}
																		{preview.type === "discord" && (
																			<FaDiscord className="w-3.5 h-3.5 text-[#5865F2]" />
																		)}
																		{preview.type === "twitch" && (
																			<FaTwitch className="w-3.5 h-3.5 text-[#9146FF]" />
																		)}
																		{preview.type === "medium" && (
																			<FaMedium className="w-3.5 h-3.5 text-[#000000]" />
																		)}
																		{preview.type === "external" && (
																			<FaLink className="w-3.5 h-3.5 text-gray-400" />
																		)}
																		<h4 className="text-sm font-semibold text-white truncate">
																			{preview.title}
																		</h4>
																	</div>
																	<p className="text-xs text-white/60 line-clamp-1 mt-0.5">
																		{preview.description}
																	</p>
																	<a
																		href={preview.url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block truncate"
																	>
																		{preview.url}
																	</a>
																</div>
															</div>
														</motion.div>
													))}
												</motion.div>
											)}

											<div className="flex gap-3">
												<motion.button
													onClick={saveProfile}
													className="flex-1 py-3 px-6 bg-gradient-to-r from-white to-white/90 text-black rounded-xl font-semibold hover:from-white/90 hover:to-white/80 transition-all duration-300 shadow-lg cursor-pointer"
													whileHover={{ scale: 1.02, y: -1 }}
													whileTap={{ scale: 0.98 }}
												>
													<FiSave className="w-4 h-4 inline mr-2" />
													Save Changes
												</motion.button>
												<motion.button
													onClick={cancelEditing}
													className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 cursor-pointer"
													whileHover={{ scale: 1.02, y: -1 }}
													whileTap={{ scale: 0.98 }}
												>
													<FiX className="w-4 h-4" />
												</motion.button>
											</div>
										</motion.div>
									) : (
										<motion.div
											className="p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
											whileHover={{ scale: 1.01 }}
										>
											<p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
												{profileData.bio || "No bio yet..."}
											</p>
											{!isLoadingPreview && linkPreviews.length > 0 && (
												<div className="mt-4 space-y-3">
													{linkPreviews.map((preview, index) => (
														<motion.div
															key={preview.url}
															className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: index * 0.1 }}
														>
															<div className="flex gap-4 p-2">
																<div
																	className={`w-15 h-15 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${
																		preview.type === "linkedin"
																			? "bg-[#0077B5]"
																			: preview.type === "youtube"
																			? "bg-[#FF0000]"
																			: preview.type === "github"
																			? "bg-[#333]"
																			: preview.type === "twitter"
																			? "bg-[#1DA1F2]"
																			: preview.type === "instagram"
																			? "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
																			: preview.type === "facebook"
																			? "bg-[#1877F2]"
																			: preview.type === "tiktok"
																			? "bg-[#000000]"
																			: preview.type === "discord"
																			? "bg-[#5865F2]"
																			: preview.type === "twitch"
																			? "bg-[#9146FF]"
																			: preview.type === "medium"
																			? "bg-[#000000]"
																			: "bg-gray-600"
																	}`}
																>
																	{preview.type === "linkedin" && (
																		<FaLinkedin className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "youtube" && (
																		<FaYoutube className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "github" && (
																		<FaGithub className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "twitter" && (
																		<FaTwitter className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "instagram" && (
																		<FaInstagram className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "facebook" && (
																		<FaFacebook className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "tiktok" && (
																		<FaTiktok className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "discord" && (
																		<FaDiscord className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "twitch" && (
																		<FaTwitch className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "medium" && (
																		<FaMedium className="w-12 h-12 text-white" />
																	)}
																	{preview.type === "external" && (
																		<FaLink className="w-12 h-12 text-white" />
																	)}
																</div>
																<div className="flex-1 min-w-0">
																	<div className="flex items-center gap-2 mb-1">
																		{preview.type === "linkedin" && (
																			<FaLinkedin className="w-4 h-4 text-[#0077B5]" />
																		)}
																		{preview.type === "youtube" && (
																			<FaYoutube className="w-4 h-4 text-[#FF0000]" />
																		)}
																		{preview.type === "github" && (
																			<FaGithub className="w-4 h-4 text-[#333]" />
																		)}
																		{preview.type === "twitter" && (
																			<FaTwitter className="w-4 h-4 text-[#1DA1F2]" />
																		)}
																		{preview.type === "instagram" && (
																			<FaInstagram className="w-4 h-4 text-[#E1306C]" />
																		)}
																		{preview.type === "facebook" && (
																			<FaFacebook className="w-4 h-4 text-[#1877F2]" />
																		)}
																		{preview.type === "tiktok" && (
																			<FaTiktok className="w-4 h-4 text-[#000000]" />
																		)}
																		{preview.type === "discord" && (
																			<FaDiscord className="w-4 h-4 text-[#5865F2]" />
																		)}
																		{preview.type === "twitch" && (
																			<FaTwitch className="w-4 h-4 text-[#9146FF]" />
																		)}
																		{preview.type === "medium" && (
																			<FaMedium className="w-4 h-4 text-[#000000]" />
																		)}
																		{preview.type === "external" && (
																			<FaLink className="w-4 h-4 text-gray-400" />
																		)}
																		<h4 className="text-sm font-semibold text-white truncate">
																			{preview.title}
																		</h4>
																	</div>
																	<p className="text-xs text-white/60 line-clamp-2">
																		{preview.description}
																	</p>
																	<a
																		href={preview.url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
																	>
																		{preview.url}
																	</a>
																</div>
															</div>
														</motion.div>
													))}
												</div>
											)}
										</motion.div>
									)}
								</motion.div>
							</div>
						</div>

						<div className="px-4 md:px-12 mb-8 max-w-7xl mx-auto">
							{isEditing && (
								<motion.div
									className="mb-8 p-6 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
								>
									<div className="flex items-center justify-between mb-4 sm:mb-8">
										<div>
											<h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
												Live Preview
											</h3>
											<p className="text-white/60 text-xs sm:text-sm mt-0.5 sm:mt-1">
												Real-time updates
											</p>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
											<span className="text-xs text-white/60">
												Real-time updates
											</span>
										</div>
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-4">
											<div className="relative">
												<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
													<img
														src={profileData.avatar}
														alt="Profile"
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-black" />
											</div>
											<div>
												<div className="flex items-center gap-2">
													<h4 className="text-base font-semibold text-white">
														{profileData.displayName}
													</h4>
													{profileData.verified && (
														<div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
															<FiCheck className="w-2 h-2 text-white" />
														</div>
													)}
												</div>
												<p className="text-sm text-white/60">
													{profileData.username}
												</p>
											</div>
										</div>

										<div className="bg-white/5 rounded-xl p-4">
											<p className="text-sm text-white/80 whitespace-pre-line">
												{bioText || "No bio yet..."}
											</p>
										</div>

										{linkPreviews.length > 0 && (
											<div className="space-y-2">
												{linkPreviews.map((preview) => (
													<div
														key={preview.url}
														className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
													>
														<div
															className={`w-8 h-8 rounded-lg flex items-center justify-center ${
																preview.type === "linkedin"
																	? "bg-[#0077B5]"
																	: preview.type === "youtube"
																	? "bg-[#FF0000]"
																	: preview.type === "github"
																	? "bg-[#333]"
																	: preview.type === "twitter"
																	? "bg-[#1DA1F2]"
																	: preview.type === "instagram"
																	? "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
																	: preview.type === "facebook"
																	? "bg-[#1877F2]"
																	: preview.type === "tiktok"
																	? "bg-[#000000]"
																	: preview.type === "discord"
																	? "bg-[#5865F2]"
																	: preview.type === "twitch"
																	? "bg-[#9146FF]"
																	: preview.type === "medium"
																	? "bg-[#000000]"
																	: "bg-gray-600"
															}`}
														>
															{preview.type === "linkedin" && (
																<FaLinkedin className="w-4 h-4 text-white" />
															)}
															{preview.type === "youtube" && (
																<FaYoutube className="w-4 h-4 text-white" />
															)}
															{preview.type === "github" && (
																<FaGithub className="w-4 h-4 text-white" />
															)}
															{preview.type === "twitter" && (
																<FaTwitter className="w-4 h-4 text-white" />
															)}
															{preview.type === "instagram" && (
																<FaInstagram className="w-4 h-4 text-white" />
															)}
															{preview.type === "facebook" && (
																<FaFacebook className="w-4 h-4 text-white" />
															)}
															{preview.type === "tiktok" && (
																<FaTiktok className="w-4 h-4 text-white" />
															)}
															{preview.type === "discord" && (
																<FaDiscord className="w-4 h-4 text-white" />
															)}
															{preview.type === "twitch" && (
																<FaTwitch className="w-4 h-4 text-white" />
															)}
															{preview.type === "medium" && (
																<FaMedium className="w-4 h-4 text-white" />
															)}
															{preview.type === "external" && (
																<FaLink className="w-4 h-4 text-white" />
															)}
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-sm text-white/80 truncate">
																{preview.title}
															</p>
															<p className="text-xs text-white/60 truncate">
																{preview.url}
															</p>
														</div>
													</div>
												))}
											</div>
										)}

										<div className="flex items-center gap-3">
											<div
												className="w-8 h-8 rounded-lg"
												style={{ background: profileData.themeGradient }}
											/>
											<div className="flex-1">
												<div className="h-2 bg-white/20 rounded-full">
													<div
														className="h-full rounded-full"
														style={{ background: profileData.themeGradient }}
													/>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							)}

							<div className="mb-8">
								<div
									ref={storiesContainerRef}
									className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 pt-2 min-h-[100px] relative snap-x snap-mandatory scrollbar-hide"
									onTouchStart={handleTouchStart}
									onTouchMove={handleTouchMove}
									onTouchEnd={handleTouchEnd}
									style={{
										WebkitOverflowScrolling: "touch",
										scrollBehavior: "smooth",
										msOverflowStyle: "none",
										scrollbarWidth: "none",
										touchAction: "pan-x",
									}}
								>
									<motion.div
										className="flex-shrink-0 w-20 snap-center"
										whileHover={{ scale: 1.05 }}
									>
										<div className="relative">
											<div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/20">
												<div
													className="w-full h-full rounded-full overflow-hidden bg-black/20 flex items-center justify-center cursor-pointer"
													onClick={() => {
														setShowPostModal(true);
														setSelectedImage(null);
														setActiveTab("highlight");
													}}
												>
													<FiPlus className="w-8 h-8 text-white/60" />
												</div>
											</div>
											<p className="text-xs text-white/80 text-center mt-2">
												New Highlight
											</p>
										</div>
									</motion.div>

									{highlights
										.filter((h) => h.isStory)
										.map((highlight) => (
											<div
												key={highlight.id}
												className="flex-shrink-0 w-20 snap-center"
												data-story-id={highlight.id}
												draggable
												onDragStart={(e) => handleStoryDragStart(highlight, e)}
												onDragOver={(e) => handleStoryDragOver(e, highlight.id)}
												onDragEnd={handleStoryDragEnd}
												onTouchStart={(e) => {
													e.stopPropagation();
													handleStoryDragStart(highlight, e);
												}}
												onTouchMove={(e) => {
													e.stopPropagation();
													handleStoryDragMove(e);
												}}
												onTouchEnd={(e) => {
													e.stopPropagation();
													handleStoryDragEnd(e);
												}}
												onContextMenu={(e) => e.preventDefault()}
												style={{
													WebkitTouchCallout: "none",
													WebkitUserSelect: "none",
													userSelect: "none",
												}}
											>
												<motion.div
													className="relative pointer-events-none"
													whileHover={{ scale: 1.05 }}
												>
													<div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743]">
														<div className="w-full h-full rounded-full overflow-hidden bg-black">
															<img
																src={highlight.thumbnail}
																alt={highlight.title}
																className="w-full h-full object-cover"
																draggable={false}
															/>
														</div>
													</div>
													<p className="text-xs text-white/80 text-center mt-2 truncate">
														{highlight.title}
													</p>
												</motion.div>
											</div>
										))}
								</div>
							</div>

							<div className="flex flex-col items-center justify-between mb-2">
								<div className="flex gap-2 w-full">
									<div className="grid grid-cols-4 gap-3 md:gap-15 mb-3 w-full">
										{[
											{
												type: "image",
												icon: FiImage,
												color: "#3b82f6",
												label: "Story",
												onClick: () => {
													setShowPostModal(true);
													setSelectedImage(null);
													setActiveTab("gallery");
												},
											},
											{
												type: "video",
												icon: FiVideo,
												color: "#3b82f6",
												label: "Video",
											},
											{
												type: "music",
												icon: FiMusic,
												color: "#3b82f6",
												label: "Music",
											},
											{
												type: "link",
												icon: FiLink,
												color: "#3b82f6",
												label: "Link",
											},
										].map(({ type, icon: Icon, color, label, onClick }) => (
											<motion.button
												key={type}
												onClick={onClick}
												className="p-5 gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 flex flex-col items-center w-full"
												whileHover={{ scale: 1.05, y: -2 }}
												whileTap={{ scale: 0.95 }}
											>
												<Icon className="w-6 h-6 mb-1" style={{ color }} />
												<span className="text-xs text-white/60">{label}</span>
											</motion.button>
										))}
									</div>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-1">
								{highlights
									.filter((h) => !h.isStory)
									.map((highlight, index) => (
										<div
											key={highlight.id}
											className="relative aspect-square group"
											data-highlight-id={highlight.id}
											draggable
											onDragStart={(e) =>
												handleHighlightDragStart(highlight, e)
											}
											onDragOver={(e) =>
												handleHighlightDragOver(e, highlight.id)
											}
											onDragEnd={handleHighlightDragEnd}
											onTouchStart={(e) => {
												e.stopPropagation();
												handleHighlightDragStart(highlight, e);
											}}
											onTouchMove={(e) => {
												e.stopPropagation();
												handleHighlightDragMove(e);
											}}
											onTouchEnd={(e) => {
												e.stopPropagation();
												handleHighlightDragEnd(e);
											}}
											onContextMenu={(e) => e.preventDefault()}
											style={{
												WebkitTouchCallout: "none",
												WebkitUserSelect: "none",
												userSelect: "none",
											}}
										>
											<motion.div
												className="absolute inset-0"
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.7 + index * 0.1 }}
											>
												<img
													src={highlight.thumbnail}
													alt=""
													className="w-full h-full object-cover"
													draggable={false}
												/>
												<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
											</motion.div>

											<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-4">
												<div className="flex items-center gap-1 md:gap-2 text-white">
													<FiHeart className="w-3 h-3 md:w-5 md:h-5" />
													<span className="text-xs md:text-sm font-medium">
														{highlight.likes || 0}
													</span>
												</div>
												<div className="flex items-center gap-1 md:gap-2 text-white">
													<FiEye className="w-3 h-3 md:w-5 md:h-5" />
													<span className="text-xs md:text-sm font-medium">
														{highlight.views || 0}
													</span>
												</div>
											</div>

											{highlight.type === "video" && (
												<div className="absolute top-1 right-1 md:top-2 md:right-2">
													<FiVideo className="w-3 h-3 md:w-4 md:h-4 text-white" />
												</div>
											)}
											{highlight.type === "music" && (
												<div className="absolute top-1 right-1 md:top-2 md:right-2">
													<FiMusic className="w-3 h-3 md:w-4 md:h-4 text-white" />
												</div>
											)}
											{highlight.type === "link" && (
												<div className="absolute top-1 right-1 md:top-2 md:right-2">
													<FiLink className="w-3 h-3 md:w-4 md:h-4 text-white" />
												</div>
											)}

											<div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
												<motion.button
													onClick={() => removeHighlight(highlight.id)}
													className="p-1.5 md:p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.95 }}
												>
													<FiTrash2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
												</motion.button>
											</div>
										</div>
									))}
							</div>
						</div>
					</>
				) : (
					<motion.div
						className="flex flex-col items-center justify-center min-h-[80vh] px-6 pt-20"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<motion.div
							className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8"
							style={{
								boxShadow: `0 0 40px ${profileData.themeGlow}20`,
							}}
							animate={{
								scale: [1, 1.05, 1],
								rotate: [0, 5, 0],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							{activeTab === "home" && (
								<FiHome className="w-12 h-12 text-white/80" />
							)}
							{activeTab === "search" && (
								<FiSearch className="w-12 h-12 text-white/80" />
							)}
							{activeTab === "notifications" && (
								<FiBell className="w-12 h-12 text-white/80" />
							)}
						</motion.div>

						<h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-4">
							{activeTab === "home"
								? "Home"
								: activeTab === "search"
								? "Search"
								: activeTab === "notifications"
								? "Notifications"
								: ""}{" "}
							Will be available Soon
						</h2>

						<p className="text-white/60 text-center max-w-md mb-8">
							We&apos;re working hard to bring you an amazing experience. This
							feature will be available soon!
						</p>

						<motion.div
							className="mt-12 p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-md w-full"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
						>
							<div className="flex items-start gap-4">
								<div
									className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0"
									style={{
										boxShadow: `0 0 20px ${profileData.themeGlow}20`,
									}}
								>
									<div
										className="w-4 h-4 rounded-full"
										style={{ backgroundColor: profileData.themeGlow }}
									/>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-white mb-2">
										Will be available in next update!
									</h3>
									<p className="text-sm text-white/60">
										We&apos;re adding exciting new features to enhance your
										experience. Follow us for updates and be the first to know
										when this feature launches.
									</p>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</div>

			<div className="fixed bottom-0 left-0 right-0 z-40">
				<div className="mx-4 mb-4">
					<div
						className="backdrop-blur-2xl border border-white/20 rounded-3xl p-2 shadow-2xl max-w-7xl mx-auto"
						style={{
							background: `linear-gradient(to bottom, ${profileData.themeColor}dd, ${profileData.themeColor}ee)`,
						}}
					>
						<div className="flex items-center justify-around">
							{[
								{ id: "home", icon: FiHome, label: "Home" },
								{ id: "search", icon: FiSearch, label: "Search" },
								{ id: "notifications", icon: FiBell, label: "Notifications" },
								{ id: "profile", icon: FiUser, label: "Profile" },
							].map(({ id, icon: Icon, label }) => (
								<motion.button
									key={id}
									onClick={() => setActiveTab(id)}
									className={`relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
										activeTab === id
											? "text-white"
											: "text-white/50 hover:text-white/80"
									}`}
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									{activeTab === id && (
										<motion.div
											className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
											layoutId="activeTab"
											style={{
												boxShadow: `0 0 20px ${profileData.themeGlow}30`,
											}}
										/>
									)}
									<div className="relative z-10 flex flex-col items-center">
										<Icon className="w-5 h-5 mb-1" />
										<span className="text-xs font-medium">{label}</span>
									</div>
									{activeTab === id && (
										<motion.div
											className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
											style={{ backgroundColor: profileData.themeGlow }}
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
										/>
									)}
								</motion.button>
							))}
						</div>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{showColorPicker && (
					<motion.div
						className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-end"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowColorPicker(false)}
					>
						<motion.div
							className="w-full bg-black/80 backdrop-blur-2xl border-t border-white/20 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-4 sm:mb-8">
								<div>
									<h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
										Choose Your Theme
									</h3>
									<p className="text-white/60 text-xs sm:text-sm mt-0.5 sm:mt-1">
										Select a color that represents you
									</p>
								</div>
								<motion.button
									onClick={() => setShowColorPicker(false)}
									className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
									whileHover={{ scale: 1.05, y: -1 }}
									whileTap={{ scale: 0.95 }}
								>
									<FiX className="w-4 h-4 sm:w-5 sm:h-5" />
								</motion.button>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
								{themeColors.map((theme, index) => (
									<motion.button
										key={theme.name}
										onClick={() => handleThemeChange(theme)}
										className="relative group"
										whileHover={{ scale: 1.02, y: -2 }}
										whileTap={{ scale: 0.98 }}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
											<div
												className="absolute inset-0"
												style={{ background: theme.gradient }}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

											<div className="relative z-10">
												<div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
													<div
														className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 shadow-lg flex-shrink-0"
														style={{ background: theme.gradient }}
													/>
													<div className="text-left">
														<h4 className="text-sm sm:text-lg font-bold text-white">
															{theme.name}
														</h4>
														<div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
															<div
																className="w-1.5 h-1.5 rounded-full"
																style={{ backgroundColor: theme.glow }}
															/>
															<span className="text-[10px] sm:text-xs text-white/60">
																Premium Theme
															</span>
														</div>
													</div>
												</div>

												<div className="space-y-1 sm:space-y-2">
													<div className="h-1 sm:h-2 bg-white/20 rounded-full" />
													<div className="h-1 sm:h-2 bg-white/10 rounded-full w-3/4" />
												</div>
											</div>

											<div
												className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
												style={{
													boxShadow: `0 0 40px ${theme.glow}30, inset 0 0 40px ${theme.glow}10`,
												}}
											/>
										</div>
									</motion.button>
								))}
							</div>

							<div className="text-center">
								<p className="text-white/40 text-xs sm:text-sm">
									Current theme:{" "}
									<span className="text-white/80 font-medium">
										{themeColors.find((t) => t.color === profileData.themeColor)
											?.name || "Custom"}
									</span>
								</p>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showPrivacyPanel && (
					<motion.div
						className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-end"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowPrivacyPanel(false)}
					>
						<motion.div
							className="w-full bg-black/80 backdrop-blur-2xl border-t border-white/20 rounded-t-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-4 sm:mb-8">
								<div>
									<h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
										Privacy & Security
									</h3>
									<p className="text-white/60 text-xs sm:text-sm mt-0.5 sm:mt-1">
										Control who can see your content
									</p>
								</div>
								<motion.button
									onClick={() => setShowPrivacyPanel(false)}
									className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
									whileHover={{ scale: 1.05, y: -1 }}
									whileTap={{ scale: 0.95 }}
								>
									<FiX className="w-4 h-4 sm:w-5 sm:h-5" />
								</motion.button>
							</div>

							<div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
								<motion.div
									className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:bg-white/10 transition-all duration-300"
									whileHover={{ scale: 1.01 }}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
												<FiGlobe className="w-5 h-5 text-blue-400" />
											</div>
											<div>
												<p className="text-lg font-semibold text-white">
													Profile Visibility
												</p>
												<p className="text-sm text-white/60">
													Who can see your profile
												</p>
											</div>
										</div>
										<select
											value={privacySettings.profileVisibility}
											onChange={(e) =>
												togglePrivacySetting(
													"profileVisibility",
													e.target.value
												)
											}
											className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-white/40 transition-all duration-300"
										>
											<option value="public" className="bg-gray-900 text-white">
												🌍 Public
											</option>
											<option
												value="friends"
												className="bg-gray-900 text-white"
											>
												👥 Friends
											</option>
											<option
												value="private"
												className="bg-gray-900 text-white"
											>
												🔒 Private
											</option>
										</select>
									</div>
								</motion.div>

								<motion.div
									className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:bg-white/10 transition-all duration-300"
									whileHover={{ scale: 1.01 }}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center">
												<FiEye className="w-5 h-5 text-green-400" />
											</div>
											<div>
												<p className="text-lg font-semibold text-white">
													Show Activity
												</p>
												<p className="text-sm text-white/60">
													Display your activity status
												</p>
											</div>
										</div>
										<motion.button
											onClick={() => togglePrivacySetting("showActivity")}
											className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
												privacySettings.showActivity
													? "bg-gradient-to-r from-green-400 to-emerald-500"
													: "bg-white/20"
											}`}
											whileTap={{ scale: 0.95 }}
										>
											<motion.div
												className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300"
												style={{
													left: privacySettings.showActivity
														? "calc(100% - 24px)"
														: "4px",
												}}
												layout
											/>
										</motion.button>
									</div>
								</motion.div>

								<motion.div
									className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:bg-white/10 transition-all duration-300"
									whileHover={{ scale: 1.01 }}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
												<FiUsers className="w-5 h-5 text-purple-400" />
											</div>
											<div>
												<p className="text-lg font-semibold text-white">
													Allow Messages
												</p>
												<p className="text-sm text-white/60">
													Let others send you messages
												</p>
											</div>
										</div>
										<motion.button
											onClick={() => togglePrivacySetting("allowMessages")}
											className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
												privacySettings.allowMessages
													? "bg-gradient-to-r from-purple-400 to-purple-500"
													: "bg-white/20"
											}`}
											whileTap={{ scale: 0.95 }}
										>
											<motion.div
												className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300"
												style={{
													left: privacySettings.allowMessages
														? "calc(100% - 24px)"
														: "4px",
												}}
												layout
											/>
										</motion.button>
									</div>
								</motion.div>

								<motion.div
									className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:bg-white/10 transition-all duration-300"
									whileHover={{ scale: 1.01 }}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center">
												<FiEyeOff className="w-5 h-5 text-orange-400" />
											</div>
											<div>
												<p className="text-lg font-semibold text-white">
													Show Online Status
												</p>
												<p className="text-sm text-white/60">
													Display when you&apos;re online
												</p>
											</div>
										</div>
										<motion.button
											onClick={() => togglePrivacySetting("showOnlineStatus")}
											className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
												privacySettings.showOnlineStatus
													? "bg-gradient-to-r from-orange-400 to-orange-500"
													: "bg-white/20"
											}`}
											whileTap={{ scale: 0.95 }}
										>
											<motion.div
												className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300"
												style={{
													left: privacySettings.showOnlineStatus
														? "calc(100% - 24px)"
														: "4px",
												}}
												layout
											/>
										</motion.button>
									</div>
								</motion.div>
							</div>

							<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 sm:p-4">
								<div className="flex items-start gap-2 sm:gap-3">
									<div
										className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
										style={{ backgroundColor: `${profileData.themeGlow}20` }}
									>
										<div
											className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
											style={{ backgroundColor: profileData.themeGlow }}
										/>
									</div>
									<div>
										<h4 className="text-xs sm:text-sm font-semibold text-white mb-0.5 sm:mb-1">
											🔐 Your Privacy Matters
										</h4>
										<p className="text-[10px] sm:text-xs text-white/60">
											These settings help you control your digital footprint and
											maintain your privacy online.
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showAvatarCrop && (
					<motion.div
						className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowAvatarCrop(false)}
					>
						<motion.div
							className="w-full max-w-sm bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
							initial={{ scale: 0.8, opacity: 0, y: 50 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.8, opacity: 0, y: 50 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-4 sm:mb-6">
								<div>
									<h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
										Crop Avatar
									</h3>
									<p className="text-white/60 text-xs sm:text-sm mt-0.5">
										Adjust your profile picture
									</p>
								</div>
								<motion.button
									onClick={() => setShowAvatarCrop(false)}
									className="p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
									whileHover={{ scale: 1.05, y: -1 }}
									whileTap={{ scale: 0.95 }}
								>
									<FiX className="w-4 h-4" />
								</motion.button>
							</div>

							<div className="space-y-4 sm:space-y-5">
								<div className="relative">
									<div className="aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
										<div
											className="relative w-full h-full rounded-2xl overflow-hidden cursor-move"
											onMouseDown={handleCropMouseDown}
											onMouseMove={handleCropMouseMove}
											onMouseUp={handleCropMouseUp}
											onMouseLeave={handleCropMouseUp}
											onTouchStart={handleCropTouchStart}
											onTouchMove={handleCropTouchMove}
											onTouchEnd={handleCropTouchEnd}
										>
											{cropImage && (
												<img
													src={cropImage}
													alt="Crop preview"
													className="absolute select-none pointer-events-none"
													style={{
														width: `${100 * cropZoom}%`,
														height: `${100 * cropZoom}%`,
														transform: `translate(${cropPosition.x}px, ${cropPosition.y}px)`,
														objectFit: "cover",
													}}
													draggable={false}
												/>
											)}

											<div className="absolute inset-0 pointer-events-none">
												<div className="absolute inset-0 bg-black/60">
													<div
														className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
														style={{
															width: `${cropSize}px`,
															height: `${cropSize}px`,
															boxShadow: `0 0 0 1000px rgba(0,0,0,0.6)`,
														}}
													/>
												</div>

												<div
													className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white/60 rounded-full"
													style={{
														width: `${cropSize}px`,
														height: `${cropSize}px`,
													}}
												/>

												<div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white/40 rounded-tl-lg" />
												<div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white/40 rounded-tr-lg" />
												<div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white/40 rounded-bl-lg" />
												<div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white/40 rounded-br-lg" />

												<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
													<div className="w-4 h-0.5 bg-white/40 absolute -translate-x-1/2" />
													<div className="h-4 w-0.5 bg-white/40 absolute -translate-y-1/2" />
												</div>
											</div>
										</div>
									</div>

									<div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2">
										<div className="bg-black/80 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20">
											<span className="text-[10px] sm:text-xs text-white/60">
												{isDragging ? "Dragging..." : "Drag to adjust position"}
											</span>
										</div>
									</div>
								</div>

								<div className="space-y-2 sm:space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-xs sm:text-sm text-white/60">
											Zoom
										</span>
										<span className="text-[10px] sm:text-xs text-white/40">
											{cropZoom.toFixed(1)}x
										</span>
									</div>
									<div className="relative">
										<input
											type="range"
											min="0.5"
											max="3"
											step="0.1"
											value={cropZoom}
											onChange={handleZoomChange}
											className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
											style={{
												background: `linear-gradient(to right, ${
													profileData.themeAccent
												} 0%, ${profileData.themeGlow} ${
													((cropZoom - 0.5) / 2.5) * 100
												}%, rgba(255,255,255,0.2) ${
													((cropZoom - 0.5) / 2.5) * 100
												}%)`,
											}}
										/>
										<style jsx>{`
											input[type="range"]::-webkit-slider-thumb {
												appearance: none;
												width: 20px;
												height: 20px;
												border-radius: 50%;
												background: linear-gradient(
													135deg,
													${profileData.themeAccent},
													${profileData.themeGlow}
												);
												cursor: pointer;
												border: 2px solid white;
												box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
											}
											input[type="range"]::-moz-range-thumb {
												width: 20px;
												height: 20px;
												border-radius: 50%;
												background: linear-gradient(
													135deg,
													${profileData.themeAccent},
													${profileData.themeGlow}
												);
												cursor: pointer;
												border: 2px solid white;
												box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
											}
										`}</style>
									</div>
								</div>

								<div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
									<motion.button
										onClick={applyCrop}
										disabled={!cropImage}
										className="flex-1 py-3 sm:py-3.5 px-4 sm:px-5 bg-gradient-to-r from-white to-white/90 text-black rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:from-white/90 hover:to-white/80 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
										whileHover={{ scale: 1.02, y: -1 }}
										whileTap={{ scale: 0.98 }}
									>
										<FiCheck className="w-4 h-4" />
										Apply
									</motion.button>

									<motion.button
										onClick={resetCrop}
										className="p-3 sm:p-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
										whileHover={{ scale: 1.05, y: -1 }}
										whileTap={{ scale: 0.95 }}
									>
										<FiRotateCw className="w-4 h-4" />
									</motion.button>

									<motion.button
										onClick={() => fileInputRef.current?.click()}
										className="p-3 sm:p-3.5 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl sm:rounded-2xl hover:from-white/30 hover:to-white/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
										whileHover={{ scale: 1.05, y: -1 }}
										whileTap={{ scale: 0.95 }}
										style={{
											boxShadow: `0 0 20px ${profileData.themeGlow}20`,
										}}
									>
										<FiUpload className="w-4 h-4" />
									</motion.button>
								</div>

								<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4">
									<div className="flex items-start gap-2 sm:gap-3">
										<div
											className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
											style={{ backgroundColor: `${profileData.themeGlow}20` }}
										>
											<div
												className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
												style={{ backgroundColor: profileData.themeGlow }}
											/>
										</div>
										<div>
											<h4 className="text-xs sm:text-sm font-semibold text-white mb-0.5 sm:mb-1">
												Pro Tips
											</h4>
											<ul className="text-[10px] sm:text-xs text-white/60 space-y-0.5 sm:space-y-1">
												<li>• Center your face for best results</li>
												<li>• Use good lighting for clarity</li>
												<li>• Square images work best</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showPostModal && (
					<motion.div
						className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => {
							setShowPostModal(false);
							setActiveTab("profile");
						}}
					>
						<motion.div
							className="w-full max-w-md bg-black/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-6"
							initial={{ scale: 0.8, opacity: 0, y: 50 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.8, opacity: 0, y: 50 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-bold text-white">
									{activeTab === "gallery"
										? "Add to Gallery"
										: "Add New Highlight"}
								</h3>
								<motion.button
									onClick={() => {
										setShowPostModal(false);
										setActiveTab("profile");
									}}
									className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<FiX className="w-5 h-5 text-white" />
								</motion.button>
							</div>

							<div className="space-y-4">
								<div
									className="relative aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/20 overflow-hidden cursor-pointer"
									onClick={() => imageUploadRef.current?.click()}
								>
									{selectedImage ? (
										<img
											src={selectedImage}
											alt="Preview"
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
											<FiImage className="w-12 h-12 mb-2" />
											<p className="text-sm">Tap to select an image</p>
										</div>
									)}
								</div>

								<input
									ref={imageUploadRef}
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className="hidden"
								/>

								<div className="flex gap-3">
									<motion.button
										onClick={() => {
											if (activeTab === "gallery") {
												handleGalleryImage();
											} else {
												handlePostImage();
											}
											setShowPostModal(false);
											setActiveTab("profile");
										}}
										disabled={!selectedImage}
										className="flex-1 py-3 px-6 bg-gradient-to-r from-white to-white/90 text-black rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										{activeTab === "gallery"
											? "Add to Gallery"
											: "Add Highlight"}
									</motion.button>
									<motion.button
										onClick={() => {
											setShowPostModal(false);
											setActiveTab("profile");
										}}
										className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										Cancel
									</motion.button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{notification && (
					<motion.div
						className="fixed top-20 left-4 right-4 z-50"
						initial={{ opacity: 0, y: -50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -50, scale: 0.9 }}
					>
						<motion.div
							className="bg-white/95 backdrop-blur-xl text-black px-6 py-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4"
							style={{
								boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${profileData.themeGlow}20`,
							}}
						>
							<motion.div
								className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.1 }}
							>
								<FiCheck className="w-4 h-4 text-white" />
							</motion.div>
							<span className="text-sm font-semibold text-gray-800">
								{notification}
							</span>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
