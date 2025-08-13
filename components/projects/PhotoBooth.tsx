"use client";
import Head from "next/head";
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";

interface ExifData {
	Make?: string;
	Model?: string;
	ExposureTime?: string;
	FNumber?: string;
	ISO?: number;
	FocalLength?: string;
	DateTaken?: string;
}

interface DrawingPath {
	id: string;
	points: { x: number; y: number; relativeX: number; relativeY: number }[];
	color: string;
	strokeWidth: number;
	canvasWidth?: number;
	canvasHeight?: number;
}

interface ARStickerConfig {
	id: string;
	name: string;
	icon: JSX.Element;
	defaultStyle: React.CSSProperties;
}

const IconArSunglasses = (): JSX.Element => (
	<svg
		viewBox="0 0 100 50"
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="24"
	>
		<defs>
			<linearGradient id="lensGradient" x1="0%" y1="0%" x2="0%" y2="100%">
				<stop
					offset="0%"
					style={{ stopColor: "rgba(100, 100, 150, 0.7)", stopOpacity: 1 }}
				/>
				<stop
					offset="100%"
					style={{ stopColor: "rgba(50, 50, 100, 0.8)", stopOpacity: 1 }}
				/>
			</linearGradient>
		</defs>
		<rect
			x="5"
			y="10"
			width="35"
			height="25"
			rx="12"
			fill="url(#lensGradient)"
			stroke="#1A202C"
			strokeWidth="2.5"
		/>
		<rect
			x="60"
			y="10"
			width="35"
			height="25"
			rx="12"
			fill="url(#lensGradient)"
			stroke="#1A202C"
			strokeWidth="2.5"
		/>
		<path d="M40 22.5 H60" stroke="#2D3748" strokeWidth="3.5" />
		<path
			d="M22.5 10 Q0 15 0 20 L5 20"
			fill="none"
			stroke="#2D3748"
			strokeWidth="3"
		/>
		<path
			d="M77.5 10 Q100 15 100 20 L95 20"
			fill="none"
			stroke="#2D3748"
			strokeWidth="3"
		/>
	</svg>
);

const IconArHeartEyes = (): JSX.Element => (
	<svg
		viewBox="0 0 100 50"
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="24"
	>
		<path
			d="M25,35 C0,15 15,-5 30,10 C30,10 28,25 25,35 Z"
			fill="#E53E3E"
			stroke="#9B2C2C"
			strokeWidth="2.5"
		/>
		<path
			d="M75,35 C100,15 85,-5 70,10 C70,10 72,25 75,35 Z"
			fill="#E53E3E"
			stroke="#9B2C2C"
			strokeWidth="2.5"
		/>
	</svg>
);

const IconArStarStruck = (): JSX.Element => (
	<svg
		viewBox="0 0 100 50"
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="24"
	>
		<polygon
			points="25,5 30,20 45,20 32,30 35,45 25,35 15,45 18,30 5,20 20,20"
			fill="#F6E05E"
			stroke="#B7791F"
			strokeWidth="2"
		/>
		<polygon
			points="75,5 80,20 95,20 82,30 85,45 75,35 65,45 68,30 55,20 70,20"
			fill="#F6E05E"
			stroke="#B7791F"
			strokeWidth="2"
		/>
	</svg>
);

const IconArPartyPopper = (): JSX.Element => (
	<svg
		viewBox="0 0 50 50"
		xmlns="http://www.w3.org/2000/svg"
		width="40"
		height="40"
	>
		<polygon
			points="10,45 22,5 34,45"
			fill="#4299E1"
			stroke="#2B6CB0"
			strokeWidth="2"
		/>
		<circle cx="18" cy="10" r="3.5" fill="#F6E05E" />
		<circle cx="28" cy="6" r="2.5" fill="#E53E3E" />
		<circle cx="23" cy="16" r="3" fill="#48BB78" />
		<rect
			x="15"
			y="3"
			width="5"
			height="5"
			fill="#ED64A6"
			transform="rotate(45 17.5 5.5)"
		/>
		<polygon points="30,9 32,3 34,9" fill="#ED8936" />
	</svg>
);

const IconArThinkingFace = (): JSX.Element => (
	<svg
		viewBox="0 0 50 50"
		xmlns="http://www.w3.org/2000/svg"
		width="40"
		height="40"
	>
		<path
			d="M5,12 C5,2 15,0 22,6 Q42,17 37,32 Q32,47 17,42 Q2,32 5,12 Z"
			fill="#63B3ED"
			stroke="#2C5282"
			strokeWidth="2"
		/>
		<circle cx="16" cy="32" r="3.5" fill="#1A202C" />
		<circle cx="23" cy="35" r="3" fill="#1A202C" />
		<circle cx="29" cy="37" r="2.5" fill="#1A202C" />
	</svg>
);

const IconArSpeechBubble = (): JSX.Element => (
	<svg
		viewBox="0 0 50 35"
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="28"
	>
		<path
			d="M2,2 H48 C49,2 49,3 48,3 V25 C49,25 49,26 48,26 H15 L7,33 V26 H2 C1,26 1,25 2,25 V3 C1,3 1,2 2,2 Z"
			fill="#48BB78"
			stroke="#2F855A"
			strokeWidth="2"
		/>
		<text
			x="25"
			y="19"
			fontFamily="Poppins, sans-serif"
			fontWeight="600"
			fontSize="11"
			fill="#1A202C"
			textAnchor="middle"
		>
			HEY!
		</text>
	</svg>
);

const AVAILABLE_AR_STICKERS: ARStickerConfig[] = [
	{
		id: "sunglasses",
		name: "Cool Shades",
		icon: <IconArSunglasses />,
		defaultStyle: {
			top: "25%",
			left: "50%",
			transform: "translateX(-50%)",
			width: "clamp(4rem, 15vw, 8rem)",
			height: "auto",
		},
	},
	{
		id: "heart_eyes",
		name: "Love It!",
		icon: <IconArHeartEyes />,
		defaultStyle: {
			top: "15%",
			right: "15%",
			width: "clamp(3rem, 12vw, 6rem)",
			height: "auto",
		},
	},
	{
		id: "star_struck",
		name: "Wow!",
		icon: <IconArStarStruck />,
		defaultStyle: {
			bottom: "20%",
			left: "20%",
			width: "clamp(3rem, 12vw, 6rem)",
			height: "auto",
		},
	},
	{
		id: "party_popper",
		name: "Celebrate!",
		icon: <IconArPartyPopper />,
		defaultStyle: {
			bottom: "15%",
			right: "50%",
			transform: "translateX(50%) rotate(-15deg)",
			width: "clamp(3.5rem, 14vw, 7rem)",
			height: "auto",
		},
	},
	{
		id: "thinking_face",
		name: "Hmm...",
		icon: <IconArThinkingFace />,
		defaultStyle: {
			top: "50%",
			left: "10%",
			transform: "translateY(-50%)",
			width: "clamp(3rem, 12vw, 6rem)",
			height: "auto",
		},
	},
];

interface ImageSubmission {
	id: string;
	userId: string;
	userName: string;
	imageUrl: string;
	originalImageUrl: string;
	exif: ExifData;
	drawings: DrawingPath[];
	appliedFilterCss: string | null;
	filterVotes: { [filterId: string]: number };
	caption?: string;
	isLocal?: boolean;
	activeArStickerIds: Set<string>;
	arStickerDeltas: { [stickerId: string]: { x: number; y: number } };
}

interface SelectedImageModalState extends ImageSubmission {
	userVotedFilters: Set<string>;
}

interface DailyChallenge {
	id: string;
	theme: string;
	date: string;
}

interface ToastMessage {
	id: number;
	message: string;
	type: "success" | "info" | "error" | "warning";
}

const AVAILABLE_FILTERS = [
	{ id: "none", name: "None", css: "" },
	{ id: "sepia", name: "Sepia", css: "sepia(0.8) contrast(0.9)" },
	{ id: "grayscale", name: "Grayscale", css: "grayscale(1)" },
	{ id: "saturate", name: "Vibrant", css: "saturate(2.5) contrast(1.1)" },
	{ id: "hue-rotate-90", name: "Color Shift", css: "hue-rotate(90deg)" },
	{ id: "blur-2", name: "Soft Focus", css: "blur(1.5px) brightness(1.05)" },
	{ id: "contrast-150", name: "Dramatic", css: "contrast(1.7) saturate(1.2)" },
	{ id: "invert", name: "Invert", css: "invert(1)" },
	{
		id: "brightness-150",
		name: "Sunlit",
		css: "brightness(1.4) saturate(1.1)",
	},
	{
		id: "vintage",
		name: "Vintage Film",
		css: "sepia(0.6) contrast(1.2) brightness(0.9) saturate(1.2) hue-rotate(-10deg)",
	},
	{
		id: "dreamy",
		name: "Dreamscape",
		css: "blur(1px) saturate(1.5) brightness(1.1) contrast(0.9) hue-rotate(15deg)",
	},
	{
		id: "noir",
		name: "Film Noir",
		css: "grayscale(1) contrast(1.5) brightness(0.8)",
	},
];

const MOCK_THEMES = [
	"Urban Symphony",
	"Culinary Canvas",
	"Nature's Palette",
	"Monochrome Moments",
	"Abstract Dreams",
	"Golden Hour Hues",
	"Street Stories",
	"Celestial Visions",
	"Minimalist Magic",
];

const STATIC_IMAGES = [
	{
		id: "static_1",
		userName: "Alex",
		imageUrl:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZHNjYXBlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
		caption: "Misty Mountains",
	},
	{
		id: "static_2",
		userName: "Bella",
		imageUrl:
			"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFuZHNjYXBlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
		caption: "Green Valley",
	},
	{
		id: "static_3",
		userName: "Chris",
		imageUrl:
			"https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=800&q=60",
		caption: "Lake Serenity",
	},
	{
		id: "static_4",
		userName: "Diana",
		imageUrl:
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
		caption: "Forest Path",
	},
	{
		id: "static_5",
		userName: "Evan",
		imageUrl:
			"https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
		caption: "Sunlit Woods",
	},
];

const getRandomElement = <T,>(arr: T[]): T =>
	arr[Math.floor(Math.random() * arr.length)];

const generateMockExif = (): ExifData => ({
	Make: getRandomElement([
		"PixelCam",
		"ShutterPro",
		"LensCorp",
		"Aperture Inc.",
	]),
	Model: getRandomElement(["X200 Ultra", "Z10 Alpha Pro", "R8 Mark IV"]),
	ExposureTime: `1/${getRandomElement([125, 250, 500])}s`,
	FNumber: `f/${getRandomElement([1.8, 2.8, 4.0]).toFixed(1)}`,
	ISO: getRandomElement([100, 200, 400, 800]),
	FocalLength: `${getRandomElement([24, 35, 50, 85])}mm`,
	DateTaken: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30)
		.toISOString()
		.split("T")[0],
});

const generateStaticSubmissions = (): ImageSubmission[] => {
	return STATIC_IMAGES.map((img, i) => ({
		id: img.id,
		userId: `user_static_${i}`,
		userName: img.userName,
		imageUrl: img.imageUrl,
		originalImageUrl: img.imageUrl,
		exif: generateMockExif(),
		drawings: [],
		appliedFilterCss: null,
		filterVotes: AVAILABLE_FILTERS.reduce(
			(acc, f) => ({ ...acc, [f.id]: Math.floor(Math.random() * 15) }),
			{}
		),
		caption: img.caption,
		isLocal: false,
		activeArStickerIds: new Set(),
		arStickerDeltas: {},
	}));
};

const IconEye = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
	</svg>
);
const IconBrush = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M13.22 2.3L3.93 11.59c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0L17.75 4.83c-.39-.39.39-1.02 0-1.41L15.63.3c-.39-.39-1.03-.39-1.41 0l-1 1zm-2.12 3.54L3 14.06V17h2.94l8.12-8.12-2.94-2.94zM7.5 19H4c-1.1 0-2 .9-2 2s.9 2 2 2h16c1.1 0 2-.9 2-2s-.9-2-2-2H7.5z" />
	</svg>
);
const IconFilter = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
	</svg>
);
const IconAR = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M19.94,10A8.85,8.85,0,0,0,12,2.06,8.85,8.85,0,0,0,4.06,10H2v4H4.06A8.85,8.85,0,0,0,12,21.94,8.85,8.85,0,0,0,19.94,14H22V10ZM12,20a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" />
		<circle cx="12" cy="12" r="3" />
		<path d="M12,7a5,5,0,1,0,5,5A5,5,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z" />
	</svg>
);
const IconClose = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
	<svg
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="currentColor"
		{...props}
	>
		<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
	</svg>
);
const IconUpload = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
	</svg>
);
const IconCompare = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l5-6v6zm9-15h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
	</svg>
);
const IconInfo = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
	</svg>
);
const IconUndo = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C20.08 11.03 16.63 8 12.5 8z" />
	</svg>
);
const IconSparkles = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path d="M5.05.316a.5.5 0 0 1 .487.023L6.5 1.5l1.006-1.161a.5.5 0 0 1 .684-.01L8.5 1.5l.507-1.161a.5.5 0 0 1 .87.404l-.253 1.153L10.5 3.5l.646-.646a.5.5 0 0 1 .708 0l.5.5a.5.5 0 0 1 0 .708L11.5 5.5l.253 1.153a.5.5 0 0 1-.87.404l-.507-1.161L9.5 4.5l-1.006 1.161a.5.5 0 0 1-.684.01L6.5 4.5l-.507 1.161a.5.5 0 0 1-.87-.404l.253-1.153L3.5 3.5l-.646.646a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 0-.708L2.5 2.5l-.253-1.153a.5.5 0 0 1 .487-.404L3.5 1.5l1.006-1.161ZM10 8.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5ZM8.5 10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5ZM12 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5ZM10.5 12a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5ZM8.5 12a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5ZM10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0Z" />
	</svg>
);
const IconSpinner = (): JSX.Element => (
	<svg
		className="animate-spin h-5 w-5 text-white"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<circle
			className="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			strokeWidth="4"
		></circle>
		<path
			className="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
);
const IconSun = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
	</svg>
);
const IconMoon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.021 3.278 7.277 7.318 7.277a7.316 7.316 0 0 0 5.205-2.149A8.507 8.507 0 0 1 8.344 15C4.229 15 1 11.777 1 7.71c0-2.931 1.162-5.643 3.038-7.545A.758.758 0 0 1 4.858 1.311z" />
	</svg>
);
const IconMenu = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path
			fillRule="evenodd"
			d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
		/>
	</svg>
);
const IconX = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
	</svg>
);
const IconDummySocial1 = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M12 2.04C6.5 2.04 2 6.53 2 12s4.5 9.96 10 9.96c5.5 0 10-4.47 10-9.96S17.5 2.04 12 2.04zm0 17.92c-4.41 0-8-3.59-8-7.96s3.59-8 8-8 8 3.6 8 8-3.59 7.96-8 7.96zm2-8.96H10v2h4v-2zm-6 0H6v2h2v-2zm8 0h-2v2h2v-2z" />
	</svg>
);
const IconDummySocial2 = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
	</svg>
);
const IconDummySocial3 = (): JSX.Element => (
	<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 18H6v-8h2v8zm4 0h-2V8h2v10zm4 0h-2V8h2v10z" />
	</svg>
);

const IconCameraSolid = (): JSX.Element => (
	<svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
		<path
			fillRule="evenodd"
			d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586A2 2 0 0113.414 4H6.586A2 2 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
			clipRule="evenodd"
		/>
		<path d="M2 7a1 1 0 011-1h.586A1 1 0 014.586 5H10a1 1 0 011 1v.01A.997.997 0 0110 7H2z" />
	</svg>
);
const IconImageSolid = (): JSX.Element => (
	<svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
		<path
			fillRule="evenodd"
			d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
			clipRule="evenodd"
		/>
	</svg>
);
const IconTrophySolid = (): JSX.Element => (
	<svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
		<path d="M2 9.5A4.5 4.5 0 016.5 5H8V4a1 1 0 011-1h2a1 1 0 011 1v1h1.5A4.5 4.5 0 0118 9.5V14a1 1 0 01-1 1H3a1 1 0 01-1-1V9.5zM6 13h8V9.5A2.5 2.5 0 0011.5 7H11V6H9v1H8.5A2.5 2.5 0 006 9.5V13zM5 16.5A1.5 1.5 0 016.5 15h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 015 16.5z" />
	</svg>
);

type ModalTabId =
	| "view"
	| "draw"
	| "filter"
	| "ar_tools"
	| "exif"
	| "beforeAfter";

const HomePage: React.FC = () => {
	const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(
		null
	);
	const [submissions, setSubmissions] = useState<ImageSubmission[]>([]);
	const [selectedImage, setSelectedImage] =
		useState<SelectedImageModalState | null>(null);

	const [compareSlot1, setCompareSlot1] = useState<ImageSubmission | null>(
		null
	);
	const [compareSlot2, setCompareSlot2] = useState<ImageSubmission | null>(
		null
	);
	const [showExifCompareModal, setShowExifCompareModal] = useState(false);

	const [isLoading, setIsLoading] = useState(true);
	const [isUploading, setIsUploading] = useState(false);
	const [activeTabInModal, setActiveTabInModal] = useState<ModalTabId>("view");

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [drawingColor, setDrawingColor] = useState("#FF3B30");
	const [drawingStrokeWidth, setDrawingStrokeWidth] = useState(5);
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

	const [beforeAfterPercentage, setBeforeAfterPercentage] = useState(50);
	const [isSwipingBeforeAfter, setIsSwipingBeforeAfter] = useState(false);

	const [arEffectActive, setArEffectActive] = useState(false);
	const [toasts, setToasts] = useState<ToastMessage[]>([]);
	const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const [showPrivacyModal, setShowPrivacyModal] = useState(false);
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [showCareersModal, setShowCareersModal] = useState(false);
	const [showSupportModal, setShowSupportModal] = useState(false);
	const [showBlogModal, setShowBlogModal] = useState(false);

	const [showAppView, setShowAppView] = useState(false);
	const [showExifHelp, setShowExifHelp] = useState(true);

	const [draggingStickerId, setDraggingStickerId] = useState<string | null>(
		null
	);
	const [dragStartPos, setDragStartPos] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [initialStickerDelta, setInitialStickerDelta] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [calculatedImgStyle, setCalculatedImgStyle] = useState({
		width: "0px",
		height: "0px",
		left: "0px",
		top: "0px",
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			setThemeMode(prefersDark ? "dark" : "light");
		}
	}, []);

	const toggleThemeMode = () => {
		setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
	};

	const removeToast = (id: number) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
	};

	const addToast = useCallback(
		(message: string, type: ToastMessage["type"] = "info") => {
			const id = Date.now();
			setToasts((prevToasts) => {
				const newToasts = [...prevToasts, { id, message, type }];
				if (newToasts.length > 5) newToasts.shift();
				return newToasts;
			});
			setTimeout(() => {
				removeToast(id);
			}, 4000);
		},
		[]
	);

	useEffect(() => {
		const today = new Date();
		const dayOfYear = Math.floor(
			(today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
				(1000 * 60 * 60 * 24)
		);
		const currentTheme = MOCK_THEMES[dayOfYear % MOCK_THEMES.length];
		setDailyChallenge({
			id: `challenge_${today.toISOString().split("T")[0]}`,
			theme: currentTheme,
			date: today.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			}),
		});
		setSubmissions(generateStaticSubmissions());
		setIsLoading(false);
		if (
			typeof window !== "undefined" &&
			!localStorage.getItem("welcomeToastShownHixcelQuest")
		) {
			addToast("Welcome to HixcelQuest Challenge!", "info");
			localStorage.setItem("welcomeToastShownHixcelQuest", "true");
		}
	}, [addToast]);

	useEffect(() => {
		const body = document.body;
		const isAnyModalOpen =
			selectedImage ||
			showExifCompareModal ||
			showPrivacyModal ||
			showTermsModal ||
			showCareersModal ||
			showSupportModal ||
			showBlogModal;

		if (isAnyModalOpen) {
			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;
			body.style.overflow = "hidden";
			body.style.paddingRight = `${scrollbarWidth}px`;
		} else {
			body.style.overflow = "auto";
			body.style.paddingRight = "0px";
		}

		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (
				draggingStickerId &&
				dragStartPos &&
				initialStickerDelta &&
				selectedImage
			) {
				const deltaX = e.clientX - dragStartPos.x;
				const deltaY = e.clientY - dragStartPos.y;
				setSelectedImage((prev) => {
					if (!prev) return null;
					return {
						...prev,
						arStickerDeltas: {
							...prev.arStickerDeltas,
							[draggingStickerId]: {
								x: initialStickerDelta.x + deltaX,
								y: initialStickerDelta.y + deltaY,
							},
						},
					};
				});
			}
		};

		const handleGlobalMouseUp = () => {
			setDraggingStickerId(null);
			setDragStartPos(null);
			setInitialStickerDelta(null);
		};

		const handleGlobalTouchMove = (e: TouchEvent) => {
			if (
				draggingStickerId &&
				dragStartPos &&
				initialStickerDelta &&
				selectedImage &&
				e.touches.length > 0
			) {
				const touch = e.touches[0];
				const deltaX = touch.clientX - dragStartPos.x;
				const deltaY = touch.clientY - dragStartPos.y;
				setSelectedImage((prev) => {
					if (!prev) return null;
					return {
						...prev,
						arStickerDeltas: {
							...prev.arStickerDeltas,
							[draggingStickerId]: {
								x: initialStickerDelta.x + deltaX,
								y: initialStickerDelta.y + deltaY,
							},
						},
					};
				});
			}
		};

		const handleGlobalTouchEnd = () => {
			setDraggingStickerId(null);
			setDragStartPos(null);
			setInitialStickerDelta(null);
		};

		if (draggingStickerId) {
			document.addEventListener("mousemove", handleGlobalMouseMove);
			document.addEventListener("mouseup", handleGlobalMouseUp);
			document.addEventListener("touchmove", handleGlobalTouchMove);
			document.addEventListener("touchend", handleGlobalTouchEnd);
		}

		return () => {
			body.style.overflow = "auto";
			body.style.paddingRight = "0px";
			document.removeEventListener("mousemove", handleGlobalMouseMove);
			document.removeEventListener("mouseup", handleGlobalMouseUp);
			document.removeEventListener("touchmove", handleGlobalTouchMove);
			document.removeEventListener("touchend", handleGlobalTouchEnd);
		};
	}, [
		selectedImage,
		showExifCompareModal,
		showPrivacyModal,
		showTermsModal,
		showCareersModal,
		showSupportModal,
		showBlogModal,
		draggingStickerId,
		dragStartPos,
		initialStickerDelta,
	]);

	const getMousePosition = (
		e: React.MouseEvent | React.TouchEvent
	): { x: number; y: number; relativeX: number; relativeY: number } | null => {
		const canvas = canvasRef.current;
		if (!canvas) return null;
		const rect = canvas.getBoundingClientRect();
		let clientX, clientY;

		if ("touches" in e) {
			if (e.touches.length === 0) return null;
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = (e as React.MouseEvent).clientX;
			clientY = (e as React.MouseEvent).clientY;
		}

		const x = clientX - rect.left;
		const y = clientY - rect.top;

		const relativeX = x / rect.width;
		const relativeY = y / rect.height;

		return { x, y, relativeX, relativeY };
	};

	const startDrawing = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			if (activeTabInModal !== "draw" || !selectedImage || !canvasRef.current)
				return;
			e.preventDefault();
			const pos = getMousePosition(e);
			if (!pos) return;
			setIsDrawing(true);

			const canvas = canvasRef.current;
			const canvasWidth = canvas.width;
			const canvasHeight = canvas.height;
			setCanvasSize({ width: canvasWidth, height: canvasHeight });

			const newPath: DrawingPath = {
				id: `path_${Date.now()}`,
				points: [pos],
				color: drawingColor,
				strokeWidth: drawingStrokeWidth,
				canvasWidth,
				canvasHeight,
			};
			setSelectedImage((prev) =>
				prev
					? {
							...prev,
							drawings: [...prev.drawings, newPath],
							arStickerDeltas: prev.arStickerDeltas || {},
					  }
					: null
			);
		},
		[activeTabInModal, drawingColor, drawingStrokeWidth, selectedImage]
	);

	const draw = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			if (
				!isDrawing ||
				!selectedImage ||
				!canvasRef.current ||
				activeTabInModal !== "draw"
			)
				return;
			e.preventDefault();
			const pos = getMousePosition(e);
			if (!pos) return;
			setSelectedImage((prev) => {
				if (!prev || !prev.drawings.length) return prev;
				const updatedDrawings = [...prev.drawings];
				const currentPath = updatedDrawings[updatedDrawings.length - 1];
				if (currentPath) {
					currentPath.points.push(pos);
				}
				return {
					...prev,
					drawings: updatedDrawings,
					arStickerDeltas: prev.arStickerDeltas || {},
				};
			});
		},
		[isDrawing, selectedImage, activeTabInModal]
	);

	const stopDrawing = useCallback(() => {
		if (!isDrawing) return;
		setIsDrawing(false);
	}, [isDrawing]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const image = imageRef.current;
		const imageContainer = imageContainerRef.current;

		if (!canvas || !image || !imageContainer || !selectedImage) {
			if (canvas) {
				const ctx = canvas.getContext("2d");
				if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			setCalculatedImgStyle({
				width: "0px",
				height: "0px",
				left: "0px",
				top: "0px",
			});
			return;
		}

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeAndDrawCanvas = () => {
			if (
				!image.naturalWidth ||
				!image.naturalHeight ||
				!imageContainer.offsetWidth ||
				!imageContainer.offsetHeight
			)
				return;

			const dpr = window.devicePixelRatio || 1;

			const containerPaddingX =
				parseFloat(getComputedStyle(imageContainer).paddingLeft) +
				parseFloat(getComputedStyle(imageContainer).paddingRight);
			const containerPaddingY =
				parseFloat(getComputedStyle(imageContainer).paddingTop) +
				parseFloat(getComputedStyle(imageContainer).paddingBottom);

			const availableWidth = imageContainer.offsetWidth - containerPaddingX;
			const availableHeight = imageContainer.offsetHeight - containerPaddingY;

			const imgAspectRatio = image.naturalWidth / image.naturalHeight;

			let displayWidth = availableWidth;
			let displayHeight = availableWidth / imgAspectRatio;

			if (displayHeight > availableHeight) {
				displayHeight = availableHeight;
				displayWidth = availableHeight * imgAspectRatio;
			}

			const offsetX =
				(availableWidth - displayWidth) / 2 +
				parseFloat(getComputedStyle(imageContainer).paddingLeft);
			const offsetY =
				(availableHeight - displayHeight) / 2 +
				parseFloat(getComputedStyle(imageContainer).paddingTop);

			setCalculatedImgStyle({
				width: `${displayWidth}px`,
				height: `${displayHeight}px`,
				left: `${offsetX}px`,
				top: `${offsetY}px`,
			});

			const canvasWidth = displayWidth * dpr;
			const canvasHeight = displayHeight * dpr;
			setCanvasSize({ width: canvasWidth, height: canvasHeight });

			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			canvas.style.width = `${displayWidth}px`;
			canvas.style.height = `${displayHeight}px`;
			canvas.style.position = "absolute";
			canvas.style.left = `${offsetX}px`;
			canvas.style.top = `${offsetY}px`;

			ctx.resetTransform();
			ctx.scale(dpr, dpr);
			ctx.clearRect(0, 0, displayWidth, displayHeight);

			if (selectedImage.drawings && selectedImage.drawings.length > 0) {
				selectedImage.drawings.forEach((path) => {
					if (path.points.length < 1) return;

					ctx.beginPath();

					const firstPoint = path.points[0];

					if (path.canvasWidth && path.canvasHeight) {
						const scaleX = displayWidth / (path.canvasWidth / dpr);
						const scaleY = displayHeight / (path.canvasHeight / dpr);

						const x =
							firstPoint.relativeX !== undefined
								? firstPoint.relativeX * displayWidth
								: firstPoint.x * scaleX;

						const y =
							firstPoint.relativeY !== undefined
								? firstPoint.relativeY * displayHeight
								: firstPoint.y * scaleY;

						ctx.moveTo(x, y);

						for (let i = 1; i < path.points.length; i++) {
							const point = path.points[i];
							const x =
								point.relativeX !== undefined
									? point.relativeX * displayWidth
									: point.x * scaleX;

							const y =
								point.relativeY !== undefined
									? point.relativeY * displayHeight
									: point.y * scaleY;

							ctx.lineTo(x, y);
						}
					} else {
						ctx.moveTo(firstPoint.x, firstPoint.y);
						for (let i = 1; i < path.points.length; i++) {
							ctx.lineTo(path.points[i].x, path.points[i].y);
						}
					}

					ctx.strokeStyle = path.color;
					ctx.lineWidth = path.strokeWidth;
					ctx.lineCap = "round";
					ctx.lineJoin = "round";
					ctx.stroke();
				});
			}
		};

		if (image.complete && image.naturalWidth > 0) {
			resizeAndDrawCanvas();
		} else {
			image.onload = resizeAndDrawCanvas;
		}

		const resizeObserver = new ResizeObserver(resizeAndDrawCanvas);
		if (imageContainer) {
			resizeObserver.observe(imageContainer);
		}
		window.addEventListener("resize", resizeAndDrawCanvas);

		return () => {
			window.removeEventListener("resize", resizeAndDrawCanvas);
			if (imageContainer) {
				resizeObserver.unobserve(imageContainer);
			}
			if (image) image.onload = null;
		};
	}, [selectedImage, selectedImage?.drawings, activeTabInModal]);

	const handleImageSelect = (image: ImageSubmission) => {
		setSelectedImage({
			...image,
			drawings: [
				...image.drawings.map((d) => ({ ...d, points: [...d.points] })),
			],
			userVotedFilters: new Set(),
			activeArStickerIds: image.activeArStickerIds || new Set(),
			arStickerDeltas: image.arStickerDeltas || {},
		});
		setActiveTabInModal("view");
		setArEffectActive((image.activeArStickerIds || new Set()).size > 0);
		setBeforeAfterPercentage(50);
	};

	const handleCloseModal = () => {
		if (selectedImage) {
			const { userVotedFilters, ...submissionDataToSave } = selectedImage;
			setSubmissions((prevSubs) =>
				prevSubs.map((s) =>
					s.id === submissionDataToSave.id ? submissionDataToSave : s
				)
			);
			addToast("Changes saved.", "info");
		}
		setSelectedImage(null);
		setArEffectActive(false);
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			addToast("Please upload a valid image file.", "error");
			return;
		}
		setIsUploading(true);
		const reader = new FileReader();
		reader.onload = (e) => {
			const imageUrl = e.target?.result as string;
			const newSubmission: ImageSubmission = {
				id: `img_local_${Date.now()}`,
				userId: `user_local_${Date.now()}`,
				userName: "You (Uploaded)",
				imageUrl: imageUrl,
				originalImageUrl: imageUrl,
				exif: {
					DateTaken: new Date().toISOString().split("T")[0],
					Make: "Your Device",
					Model: "Uploaded Image",
				},
				drawings: [],
				appliedFilterCss: null,
				filterVotes: AVAILABLE_FILTERS.reduce(
					(acc, f) => ({ ...acc, [f.id]: 0 }),
					{}
				),
				caption: file.name,
				isLocal: true,
				activeArStickerIds: new Set(),
				arStickerDeltas: {},
			};
			setSubmissions((prev) => [newSubmission, ...prev]);
			setIsUploading(false);
			addToast("Image uploaded!", "success");
			handleImageSelect(newSubmission);
		};
		reader.onerror = () => {
			setIsUploading(false);
			addToast("Failed to read image.", "error");
		};
		reader.readAsDataURL(file);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const triggerFileUpload = () => {
		fileInputRef.current?.click();
	};

	const handleVoteForFilter = (filterId: string) => {
		if (!selectedImage) return;
		setSelectedImage((prev) => {
			if (!prev) return null;
			const newVotesOnThisImage = new Set(prev.userVotedFilters);
			let newTotalVotes = { ...prev.filterVotes };
			let voteChange = 0;
			if (newVotesOnThisImage.has(filterId)) {
				newVotesOnThisImage.delete(filterId);
				voteChange = -1;
				addToast("Vote removed.", "info");
			} else {
				newVotesOnThisImage.add(filterId);
				voteChange = 1;
				addToast("Vote counted!", "success");
			}
			newTotalVotes[filterId] = Math.max(
				0,
				(newTotalVotes[filterId] || 0) + voteChange
			);
			return {
				...prev,
				userVotedFilters: newVotesOnThisImage,
				filterVotes: newTotalVotes,
				arStickerDeltas: prev.arStickerDeltas || {},
			};
		});
	};

	const handleApplyFilter = (filterCss: string | null, filterName: string) => {
		if (!selectedImage) return;
		setSelectedImage((prev) =>
			prev
				? {
						...prev,
						appliedFilterCss: filterCss,
						arStickerDeltas: prev.arStickerDeltas || {},
				  }
				: null
		);
		addToast(`${filterName} filter applied.`, "info");
	};

	const handleUndoDrawing = () => {
		if (!selectedImage || selectedImage.drawings.length === 0) {
			addToast("No drawings to undo.", "warning");
			return;
		}
		setSelectedImage((prev) => {
			if (!prev) return null;
			return {
				...prev,
				drawings: prev.drawings.slice(0, -1),
				arStickerDeltas: prev.arStickerDeltas || {},
			};
		});
		addToast("Last drawing removed.", "info");
	};

	const handleExifCompareSelect = (image: ImageSubmission) => {
		if (!compareSlot1) {
			setCompareSlot1(image);
			addToast(`${image.userName}'s photo added. Select another.`, "info");
		} else if (!compareSlot2 && image.id !== compareSlot1.id) {
			setCompareSlot2(image);
			setShowExifCompareModal(true);
			addToast(
				`Comparing ${compareSlot1.userName} & ${image.userName}.`,
				"info"
			);
		} else if (image.id === compareSlot1.id) {
			setCompareSlot1(null);
			addToast(`Removed ${image.userName}'s photo.`, "info");
		} else if (compareSlot2 && image.id === compareSlot2.id) {
			setCompareSlot2(null);
			addToast(`Removed ${image.userName}'s photo.`, "info");
		} else {
			setCompareSlot1(image);
			setCompareSlot2(null);
			addToast(
				`${image.userName}'s photo set as first. Select another.`,
				"info"
			);
		}
	};

	const resetExifCompare = () => {
		setCompareSlot1(null);
		setCompareSlot2(null);
		setShowExifCompareModal(false);
		addToast("EXIF comparison closed.", "info");
	};

	const dismissExifHelp = () => {
		setShowExifHelp(false);
		if (typeof window !== "undefined") {
			localStorage.setItem("exifHelpDismissed", "true");
		}
	};

	const toggleArEffect = () => {
		if (!selectedImage) {
			if (submissions.length > 0) {
				handleImageSelect(submissions[0]);
				setArEffectActive(true);
				setActiveTabInModal("ar_tools");
				addToast("AR Booth activated on first image!", "info");
			} else {
				addToast("Upload an image for AR Booth.", "warning");
			}
			return;
		}
		setArEffectActive((p) => {
			const newArState = !p;
			addToast(newArState ? "AR Effects On!" : "AR Effects Off.", "info");
			if (newArState && activeTabInModal !== "ar_tools")
				setActiveTabInModal("ar_tools");
			return newArState;
		});
	};

	const toggleArSticker = (stickerId: string) => {
		if (!selectedImage) return;
		setSelectedImage((prev) => {
			if (!prev) return null;
			const newActiveStickers = new Set(prev.activeArStickerIds);
			const newDeltas = { ...(prev.arStickerDeltas || {}) };

			if (newActiveStickers.has(stickerId)) {
				newActiveStickers.delete(stickerId);
				delete newDeltas[stickerId];
			} else {
				newActiveStickers.add(stickerId);
				newDeltas[stickerId] = { x: 0, y: 0 };
			}

			if (
				newActiveStickers.size > 0 &&
				!arEffectActive &&
				activeTabInModal === "ar_tools"
			) {
				setArEffectActive(true);
			}
			return {
				...prev,
				activeArStickerIds: newActiveStickers,
				arStickerDeltas: newDeltas,
			};
		});
	};

	const handleStickerMouseDown = (
		e: React.MouseEvent<HTMLDivElement>,
		stickerId: string
	) => {
		e.preventDefault();
		e.stopPropagation();
		if (!selectedImage || !selectedImage.arStickerDeltas) return;

		setDraggingStickerId(stickerId);
		setDragStartPos({ x: e.clientX, y: e.clientY });
		setInitialStickerDelta(
			selectedImage.arStickerDeltas[stickerId] || { x: 0, y: 0 }
		);
	};

	const handleStickerTouchStart = (
		e: React.TouchEvent<HTMLDivElement>,
		stickerId: string
	) => {
		e.stopPropagation();
		if (
			!selectedImage ||
			!selectedImage.arStickerDeltas ||
			e.touches.length === 0
		)
			return;

		const touch = e.touches[0];
		setDraggingStickerId(stickerId);
		setDragStartPos({ x: touch.clientX, y: touch.clientY });
		setInitialStickerDelta(
			selectedImage.arStickerDeltas[stickerId] || { x: 0, y: 0 }
		);
	};

	const handleBeforeAfterSwipeStart = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			e.preventDefault();
			setIsSwipingBeforeAfter(true);
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

			if (imageRef.current) {
				const imageRect = imageRef.current.getBoundingClientRect();
				const relativeX = clientX - imageRect.left;
				let newPercentage = (relativeX / imageRect.width) * 100;
				newPercentage = Math.max(0, Math.min(100, newPercentage));
				setBeforeAfterPercentage(newPercentage);
			}
		},
		[]
	);

	const handleBeforeAfterSwipeMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!isSwipingBeforeAfter || !imageRef.current) return;
			e.preventDefault();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

			const imageRect = imageRef.current.getBoundingClientRect();

			const relativeX = clientX - imageRect.left;
			let newPercentage = (relativeX / imageRect.width) * 100;

			newPercentage = Math.max(0, Math.min(100, newPercentage));
			setBeforeAfterPercentage(newPercentage);
		},
		[isSwipingBeforeAfter]
	);

	const handleBeforeAfterSwipeEnd = useCallback(() => {
		setIsSwipingBeforeAfter(false);
	}, []);

	useEffect(() => {
		if (isSwipingBeforeAfter) {
			document.addEventListener("mousemove", handleBeforeAfterSwipeMove);
			document.addEventListener("touchmove", handleBeforeAfterSwipeMove, {
				passive: false,
			});
			document.addEventListener("mouseup", handleBeforeAfterSwipeEnd);
			document.addEventListener("touchend", handleBeforeAfterSwipeEnd);
		}
		return () => {
			document.removeEventListener("mousemove", handleBeforeAfterSwipeMove);
			document.removeEventListener("touchmove", handleBeforeAfterSwipeMove);
			document.removeEventListener("mouseup", handleBeforeAfterSwipeEnd);
			document.removeEventListener("touchend", handleBeforeAfterSwipeEnd);
		};
	}, [
		isSwipingBeforeAfter,
		handleBeforeAfterSwipeMove,
		handleBeforeAfterSwipeEnd,
	]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const helpDismissed = localStorage.getItem("exifHelpDismissed");
			if (helpDismissed) {
				setShowExifHelp(false);
			}
		}
	}, []);

	const imageForModalDisplay = useMemo(
		() =>
			activeTabInModal === "beforeAfter"
				? selectedImage?.originalImageUrl
				: selectedImage?.imageUrl,
		[selectedImage, activeTabInModal]
	);
	const beforeAfterImageUrl = useMemo(
		() => selectedImage?.originalImageUrl,
		[selectedImage]
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 text-white text-4xl font-poppins tracking-wider">
				Loading A Creative Universe...
			</div>
		);
	}

	const modalTabs: { id: ModalTabId; label: string; icon: JSX.Element }[] = [
		{ id: "view", label: "View", icon: <IconEye /> },
		{ id: "draw", label: "Draw", icon: <IconBrush /> },
		{ id: "filter", label: "Filters", icon: <IconFilter /> },
		{ id: "ar_tools", label: "AR Booth", icon: <IconSparkles /> },
		{ id: "exif", label: "EXIF", icon: <IconInfo /> },
		{ id: "beforeAfter", label: "Compare", icon: <IconCompare /> },
	];

	const navLinks = [
		{ name: "How It Works", href: "#how-it-works" },
		{ name: "About Us", href: "#about-us" },
		{ name: "Challenge App", action: () => setShowAppView(true) },
	];

	const footerLinks = {
		Product: [
			{ name: "How It Works", href: "#how-it-works" },
			{ name: "Challenge App", action: () => setShowAppView(true) },
		],
		Resources: [
			{ name: "Blog", action: () => setShowBlogModal(true) },
			{ name: "Support", action: () => setShowSupportModal(true) },
		],
		Company: [
			{ name: "Careers", action: () => setShowCareersModal(true) },
			{ name: "Privacy Policy", action: () => setShowPrivacyModal(true) },
			{ name: "Terms of Service", action: () => setShowTermsModal(true) },
		],
	};

	const closeAllInfoModals = () => {
		setShowPrivacyModal(false);
		setShowTermsModal(false);
		setShowCareersModal(false);
		setShowSupportModal(false);
		setShowBlogModal(false);
	};

	const AppView = () => (
		<div className={`app-shell flex flex-col min-h-screen themed-app-bg`}>
			<header
				className={`p-4 text-center z-10 frosted-glass rounded-b-2xl shadow-lg mx-auto max-w-4xl w-[calc(100%-2rem)] sm:w-full sticky top-2 ${
					themeMode === "dark"
						? "border-t border-[var(--frosted-border-dark)]"
						: "border-t border-[var(--frosted-border-light)]"
				}`}
			>
				<div className="flex items-center justify-between">
					<button
						onClick={() => setShowAppView(false)}
						className="themed-button-text themed-button-hover-bg px-3 py-2 rounded-md text-sm font-medium cursor-pointer font-manrope"
					>
						&larr; Home
					</button>
					<h1 className="font-poppins text-xl sm:text-2xl font-bold themed-header-text truncate px-2">
						{dailyChallenge?.theme || "Daily Challenge"}
					</h1>
					<button
						onClick={toggleThemeMode}
						className="p-2.5 rounded-full themed-button-text themed-button-hover-bg transition-colors cursor-pointer"
						title="Toggle Theme Mode"
					>
						{themeMode === "dark" ? <IconSun /> : <IconMoon />}
					</button>
				</div>
				<p className="text-xs sm:text-sm themed-secondary-text mt-1 font-manrope">
					{dailyChallenge?.date}
				</p>
			</header>

			{}
			{showExifHelp && submissions.length > 0 && (
				<div className="fixed top-20 sm:top-24 left-0 right-0 z-30 mx-auto max-w-md px-4">
					<div
						className={`p-3 sm:p-4 rounded-lg shadow-xl animate-pulse ${
							themeMode === "dark" ? "bg-indigo-900/90" : "bg-indigo-600/90"
						} text-white`}
					>
						<div className="flex items-start justify-between">
							<div className="flex items-center">
								<IconCompare className="w-5 h-5 mr-2 flex-shrink-0" />
								<p className="text-sm">
									Tap the{" "}
									<span className="font-bold">blue comparison button</span> on
									photos to compare camera settings!
								</p>
							</div>
							<button
								onClick={dismissExifHelp}
								className="text-white p-1 rounded-full hover:bg-white/20"
							>
								<IconX className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			)}

			<main className="flex-grow overflow-y-auto p-3 sm:p-4 md:p-6 pt-20 sm:pt-24 md:pt-28">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
					{submissions.map((sub) => (
						<div
							key={sub.id}
							className={`relative group cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden shadow-lg aspect-[4/5] transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] photo-item-themed-bg`}
							onClick={() => handleImageSelect(sub)}
						>
							<img
								src={sub.imageUrl}
								alt={`Submission by ${sub.userName}`}
								loading="lazy"
								className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
								<span className="block font-semibold text-md sm:text-lg text-white font-poppins drop-shadow-md">
									{sub.userName}
								</span>
								<p className="text-xs sm:text-sm text-gray-200 truncate drop-shadow-sm font-manrope">
									{sub.caption?.substring(0, 40)}...
								</p>
							</div>
							<button
								className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full text-white transition-all duration-200 z-10 cursor-pointer flex items-center justify-center
                    ${
											compareSlot1?.id === sub.id || compareSlot2?.id === sub.id
												? "bg-blue-500 scale-110 ring-2 ring-white/50 shadow-md"
												: "bg-blue-500/80 group-hover:bg-blue-500 hover:scale-105 hover:shadow-sm"
										}`}
								onClick={(e) => {
									e.stopPropagation();
									handleExifCompareSelect(sub);
								}}
								title="Select for EXIF comparison"
							>
								<IconCompare />
								{!compareSlot1 && !compareSlot2 && (
									<span className="absolute -bottom-1 right-0 w-3 h-3 rounded-full bg-red-500 border border-white animate-ping"></span>
								)}
							</button>
						</div>
					))}
					{submissions.length === 0 && !isLoading && (
						<div className="col-span-full text-center py-10">
							<p className="text-xl sm:text-2xl themed-primary-text font-semibold font-poppins">
								No submissions yet.
							</p>
							<p className="themed-secondary-text mt-2 text-sm sm:text-base font-manrope">
								Be the first to upload!
							</p>
							<button
								onClick={triggerFileUpload}
								className="mt-6 px-5 py-2.5 themed-primary-button text-white font-semibold rounded-lg shadow-md flex items-center gap-2 mx-auto text-sm sm:text-base cursor-pointer font-manrope"
							>
								{isUploading ? <IconSpinner /> : <IconUpload />} Upload Photo
							</button>
						</div>
					)}
				</div>
			</main>

			<footer
				className={`p-3 frosted-glass rounded-t-2xl sm:rounded-t-3xl shadow-[0_-12px_40px_0_rgba(31,38,135,0.2)] sticky bottom-0 z-20 mt-auto ${
					themeMode === "dark" ? "app-footer-dark" : "app-footer-light"
				}`}
			>
				<div className="flex justify-around items-center max-w-md mx-auto">
					{[
						{
							label: "Upload",
							icon: isUploading ? <IconSpinner /> : <IconUpload />,
							action: triggerFileUpload,
							disabled: isUploading,
						},
						{
							label: "AR Booth",
							icon: <IconAR />,
							action: toggleArEffect,
							active: arEffectActive,
							disabled: false,
						},
					].map((tool) => (
						<button
							key={tool.label}
							className={`flex flex-col items-center p-2.5 sm:p-3 rounded-lg sm:rounded-xl themed-button-text themed-button-hover-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
								tool.active ? "themed-button-active-bg active scale-105" : ""
							}`}
							onClick={tool.action}
							disabled={tool.disabled}
							title={tool.label}
						>
							{React.cloneElement(tool.icon, {
								className: "w-5 h-5 sm:w-6 sm:h-6",
							})}
							<span className="text-[10px] sm:text-xs font-semibold mt-1 sm:mt-1.5 font-manrope">
								{tool.label}
							</span>
						</button>
					))}
				</div>
			</footer>
		</div>
	);

	return (
		<div className={themeMode === "dark" ? "dark-theme" : "light-theme"}>
			<Head>
				<title>HixcelQuest Challenge - Daily Creativity</title>
				<meta
					name="description"
					content="Join daily photo challenges, edit, draw, and share with HixcelQuest!"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					rel="icon"
					href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%234F46E5'/><circle cx='50' cy='50' r='30' fill='white'/><circle cx='50' cy='50' r='15' fill='%23A5B4FC'/></svg>"
				/>
				<script src="https://cdn.tailwindcss.com"></script>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<style jsx global>{`
				:root {
					--bg-gradient-start-light: #f0f9ff;
					--bg-gradient-end-light: #a5b4fc;
					--text-primary-light: #1e293b;
					--text-secondary-light: #4b5563;
					--text-accent-light: #6366f1;
					--frosted-bg-light: rgba(255, 255, 255, 0.8);
					--frosted-border-light: rgba(229, 231, 235, 0.5);
					--header-text-light: #312e81;
					--button-text-light: #374151;
					--button-hover-bg-light: rgba(99, 102, 241, 0.1);
					--button-active-bg-light: rgba(99, 102, 241, 0.2);
					--range-thumb-light: #6366f1;
					--range-track-light: #d1d5db;
					--modal-content-bg-light: rgba(249, 250, 251, 0.9);
					--modal-text-primary-light: #111827;
					--modal-text-secondary-light: #374151;
					--modal-button-bg-light: rgba(224, 231, 255, 0.8);
					--modal-button-text-light: #312e81;
					--modal-button-active-bg-light: #6366f1;
					--modal-button-active-text-light: #ffffff;
					--modal-section-bg-light: rgba(243, 244, 246, 0.9);
					--input-bg-light: #ffffff;
					--input-border-light: #d1d5db;
					--input-text-light: #111827;
					--gallery-item-bg-light: rgba(255, 255, 255, 0.4);
					--mobile-menu-bg-light: #ffffff;
					--app-footer-bg-light: var(--frosted-bg-light);
					--app-bg-light: #f9fafb;

					--bg-gradient-start-dark: #1a202c;
					--bg-gradient-end-dark: #2c3e50;
					--text-primary-dark: #e0e7ff;
					--text-secondary-dark: #a5b4fc;
					--text-accent-dark: #818cf8;
					--frosted-bg-dark: rgba(31, 41, 55, 0.85);
					--frosted-border-dark: rgba(55, 65, 81, 0.7);
					--header-text-dark: #ffffff;
					--button-text-dark: #d1d5db;
					--button-hover-bg-dark: rgba(129, 140, 248, 0.15);
					--button-active-bg-dark: rgba(129, 140, 248, 0.25);
					--range-thumb-dark: #818cf8;
					--range-track-dark: #4b5563;
					--modal-content-bg-dark: rgba(31, 41, 55, 0.9);
					--modal-text-primary-dark: #e0e7ff;
					--modal-text-secondary-dark: #a5b4fc;
					--modal-button-bg-dark: rgba(55, 65, 81, 0.8);
					--modal-button-text-dark: #d1d5db;
					--modal-button-active-bg-dark: #818cf8;
					--modal-button-active-text-dark: #1f2937;
					--modal-section-bg-dark: #374155;
					--input-bg-dark: #374151;
					--input-border-dark: #4b5563;
					--input-text-dark: #f3f4f6;
					--gallery-item-bg-dark: rgba(55, 65, 81, 0.4);
					--mobile-menu-bg-dark: #1f2937;
					--app-footer-bg-dark: var(--frosted-bg-dark);
					--app-bg-dark: #111827;

					--highlight-accent-light: #6366f1;
					--highlight-accent-dark: #a78bfa;
					--highlight-accent-bg-light: var(--highlight-accent-light);
					--highlight-accent-bg-dark: var(--highlight-accent-dark);

					--primary-button-bg-light: #4f46e5;
					--primary-button-hover-bg-light: #4338ca;
					--primary-button-bg-dark: #6366f1;
					--primary-button-hover-bg-dark: #4f46e5;

					--secondary-button-bg-light: #e2e8f0;
					--secondary-button-hover-bg-light: #cbd5e1;
					--secondary-button-bg-dark: #334155;
					--secondary-button-hover-bg-dark: #475569;

					--modal-text-highlight-light: #4f46e5;
					--modal-text-highlight-dark: #c7d2fe;

					--ring-accent-light: #a5b4fc;
					--ring-accent-dark: #818cf8;

					--ring-subtle-light: rgba(0, 0, 0, 0.05);
					--ring-subtle-dark: rgba(255, 255, 255, 0.05);

					--filter-apply-bg-light: rgba(224, 231, 255, 0.7);
					--filter-apply-text-light: #312e81;
					--filter-apply-hover-bg-light: rgba(199, 210, 254, 0.8);

					--filter-apply-default-bg-dark: #4a5568;
					--filter-apply-default-text-dark: #e2e8f0;
					--filter-apply-default-hover-bg-dark: #2d3748;

					--filter-vote-voted-bg-light: #ec4899;
					--filter-vote-voted-bg-dark: #db2777;

					--filter-vote-default-bg-light: rgba(226, 232, 240, 0.8);
					--filter-vote-default-text-light: #334155;
					--filter-vote-default-hover-bg-light: #cbd5e1;

					--filter-vote-default-bg-dark: rgba(71, 85, 105, 0.7);
					--filter-vote-default-text-dark: #e0e7ff;
					--filter-vote-default-hover-bg-dark: rgba(100, 116, 139, 0.9);

					--subtle-text-light: #64748b;
					--subtle-text-dark: #a5b4fc;

					--ar-sticker-active-bg-light: var(--highlight-accent-light);
					--ar-sticker-active-text-light: #ffffff;
					--ar-sticker-active-ring-light: var(--highlight-accent-light);

					--ar-sticker-active-bg-dark: var(--highlight-accent-dark);
					--ar-sticker-active-text-dark: #111827;
					--ar-sticker-active-ring-dark: var(--highlight-accent-dark);

					--ar-sticker-default-bg-light: rgba(236, 240, 241, 0.9);
					--ar-sticker-default-text-light: #374151;
					--ar-sticker-default-hover-bg-light: rgba(224, 231, 255, 0.95);

					--ar-sticker-default-bg-dark: rgba(42, 50, 66, 0.9);
					--ar-sticker-default-text-dark: #cbd5e1;
					--ar-sticker-default-hover-bg-dark: rgba(55, 65, 81, 0.95);

					--main-footer-bg-light: #f1f5f9;
					--main-footer-border-light: #e2e8f0;

					--main-footer-bg-dark: #0f172a;
					--main-footer-border-dark: #334155;

					--section-bg-primary-light: rgba(240, 249, 255, 0.5);
					--section-bg-primary-dark: #1e293b;

					--section-bg-secondary-light: #ffffff;
					--section-bg-secondary-dark: #1e293b;

					--modal-border-top-bg-light: rgba(255, 255, 255, 0.2);
					--modal-border-top-border-light: rgba(255, 255, 255, 0.1);

					--modal-border-top-bg-dark: rgba(30, 41, 59, 0.2);
					--modal-border-top-border-dark: rgba(55, 65, 81, 0.4);

					--modal-image-bg-light: rgba(75, 85, 99, 0.4);
					--modal-image-bg-dark: rgba(30, 41, 59, 0.6);

					--color-input-border-light: #f3f4f6;
					--color-input-border-dark: #64748b;
				}

				body {
					font-family: "Manrope", sans-serif;
					margin: 0;
					background: linear-gradient(
						145deg,
						var(--bg-gradient-start-light) 0%,
						var(--bg-gradient-end-light) 100%
					);
					color: var(--text-primary-light);
					line-height: 1.65;
					overscroll-behavior-y: contain;
					transition: background 0.4s ease-in-out, color 0.4s ease-in-out;
				}
				.dark-theme body {
					background: linear-gradient(
						145deg,
						var(--bg-gradient-start-dark) 0%,
						var(--bg-gradient-end-dark) 100%
					);
					color: var(--text-primary-dark);
				}

				h1,
				h2,
				h3,
				h4,
				h5,
				h6,
				.font-poppins {
					font-family: "Poppins", sans-serif;
				}
				.font-manrope {
					font-family: "Manrope", sans-serif;
				}

				.frosted-glass {
					background: var(--frosted-bg-light);
					backdrop-filter: blur(24px) saturate(180%);
					-webkit-backdrop-filter: blur(24px) saturate(180%);
					border: 1px solid var(--frosted-border-light);
					box-shadow: 0 10px 30px -5px rgba(31, 38, 135, 0.15);
					transition: background 0.4s ease-in-out, border-color 0.4s ease-in-out;
				}
				.dark-theme .frosted-glass {
					background: var(--frosted-bg-dark);
					border-color: var(--frosted-border-dark);
				}

				::-webkit-scrollbar {
					width: 10px;
					height: 10px;
				}
				::-webkit-scrollbar-track {
					background: rgba(0, 0, 0, 0.03);
					border-radius: 10px;
				}
				::-webkit-scrollbar-thumb {
					background: rgba(0, 0, 0, 0.15);
					border-radius: 10px;
					border: 2px solid transparent;
					background-clip: content-box;
				}
				::-webkit-scrollbar-thumb:hover {
					background: rgba(0, 0, 0, 0.25);
				}

				.dark-theme ::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.03);
				}
				.dark-theme ::-webkit-scrollbar-thumb {
					background: rgba(255, 255, 255, 0.15);
				}
				.dark-theme ::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 255, 255, 0.25);
				}

				.ar-photo-booth-overlay {
					position: absolute;
					inset: 0;
					pointer-events: none;
					z-index: 10;
				}
				.ar-scanline {
					position: absolute;
					left: 0;
					right: 0;
					height: 3px;
					background: linear-gradient(
						90deg,
						transparent,
						rgba(0, 220, 220, 0.7),
						transparent
					);
					box-shadow: 0 0 12px 2px rgba(0, 220, 220, 0.5);
					animation: ar-scanner-anim 2.8s ease-in-out infinite;
					border-radius: 2px;
				}
				.ar-corner-brackets {
					position: absolute;
					width: 30px;
					height: 30px;
					border-style: solid;
					border-color: rgba(0, 200, 200, 0.8);
					opacity: 0;
					animation: ar-bracket-fade-in 1s ease-out forwards;
				}
				.ar-corner-brackets.top-left {
					top: 15px;
					left: 15px;
					border-width: 3px 0 0 3px;
					animation-delay: 0.2s;
				}
				.ar-corner-brackets.top-right {
					top: 15px;
					right: 15px;
					border-width: 3px 3px 0 0;
					animation-delay: 0.4s;
				}
				.ar-corner-brackets.bottom-left {
					bottom: 15px;
					left: 15px;
					border-width: 0 0 3px 3px;
					animation-delay: 0.6s;
				}
				.ar-corner-brackets.bottom-right {
					bottom: 15px;
					right: 15px;
					border-width: 0 3px 3px 0;
					animation-delay: 0.8s;
				}

				@keyframes ar-scanner-anim {
					0% {
						top: 8%;
						opacity: 0.5;
						transform: scaleX(0.9);
					}
					50% {
						top: 88%;
						opacity: 0.9;
						transform: scaleX(1.02);
					}
					100% {
						top: 8%;
						opacity: 0.5;
						transform: scaleX(0.9);
					}
				}
				@keyframes ar-bracket-fade-in {
					from {
						opacity: 0;
						transform: scale(0.85);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
				.ar-image-effect-active {
					filter: brightness(1.1) contrast(1.05) saturate(1.15) hue-rotate(5deg)
						drop-shadow(0 0 8px rgba(0, 180, 180, 0.25));
					transform: scale(1.02);
					transition: filter 0.5s ease-in-out, transform 0.5s ease-in-out;
				}
				.ar-sticker {
					position: absolute;
					cursor: grab;
					user-select: none;
					z-index: 4;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.ar-sticker:active {
					cursor: grabbing;
				}
				.ar-sticker svg {
					width: 100%;
					height: 100%;
				}

				.themed-header-text {
					color: var(--header-text-light);
				}
				.dark-theme .themed-header-text {
					color: var(--header-text-dark);
				}
				.themed-secondary-text {
					color: var(--text-secondary-light);
				}
				.dark-theme .themed-secondary-text {
					color: var(--text-secondary-dark);
				}
				.themed-primary-text {
					color: var(--text-primary-light);
				}
				.dark-theme .themed-primary-text {
					color: var(--text-primary-dark);
				}
				.themed-button-text {
					color: var(--button-text-light);
				}
				.dark-theme .themed-button-text {
					color: var(--button-text-dark);
				}
				.themed-button-hover-bg:hover {
					background-color: var(--button-hover-bg-light);
				}
				.dark-theme .themed-button-hover-bg:hover {
					background-color: var(--button-hover-bg-dark);
				}
				.themed-button-active-bg.active {
					background-color: var(--button-active-bg-light);
					color: var(--text-accent-light);
				}
				.dark-theme .themed-button-active-bg.active {
					background-color: var(--button-active-bg-dark);
					color: var(--text-accent-dark);
				}
				.themed-modal-content-bg {
					background: var(--modal-content-bg-light);
				}
				.dark-theme .themed-modal-content-bg {
					background: var(--modal-content-bg-dark);
				}
				.themed-modal-text-primary {
					color: var(--modal-text-primary-light);
				}
				.dark-theme .themed-modal-text-primary {
					color: var(--modal-text-primary-dark);
				}
				.themed-modal-text-secondary {
					color: var(--modal-text-secondary-light);
				}
				.dark-theme .themed-modal-text-secondary {
					color: var(--modal-text-secondary-dark);
				}
				.themed-modal-button-bg {
					background-color: var(--modal-button-bg-light);
					color: var(--modal-button-text-light);
				}
				.dark-theme .themed-modal-button-bg {
					background-color: var(--modal-button-bg-dark);
					color: var(--modal-button-text-dark);
				}
				.themed-modal-button-active-bg.active {
					background-color: var(--modal-button-active-bg-light);
					color: var(--modal-button-active-text-light);
				}
				.dark-theme .themed-modal-button-active-bg.active {
					background-color: var(--modal-button-active-bg-dark);
					color: var(--modal-button-active-text-dark);
				}
				.themed-modal-section-bg {
					background-color: var(--modal-section-bg-light);
				}
				.dark-theme .themed-modal-section-bg {
					background-color: var(--modal-section-bg-dark);
				}
				.themed-input {
					background-color: var(--input-bg-light);
					border-color: var(--input-border-light);
					color: var(--input-text-light);
				}
				.dark-theme .themed-input {
					background-color: var(--input-bg-dark);
					border-color: var(--input-border-dark);
					color: var(--input-text-dark);
				}
				.themed-range::-webkit-slider-thumb {
					background: var(--range-thumb-light);
				}
				.dark-theme .themed-range::-webkit-slider-thumb {
					background: var(--range-thumb-dark);
				}
				.themed-range::-moz-range-thumb {
					background: var(--range-thumb-light);
				}
				.dark-theme .themed-range::-moz-range-thumb {
					background: var(--range-thumb-dark);
				}
				.themed-range::-webkit-slider-runnable-track {
					background: var(--range-track-light);
				}
				.dark-theme .themed-range::-webkit-slider-runnable-track {
					background: var(--range-track-dark);
				}
				.themed-range::-moz-range-track {
					background: var(--range-track-light);
				}
				.dark-theme .themed-range::-moz-range-track {
					background: var(--range-track-dark);
				}
				.photo-item-themed-bg {
					background-color: var(--gallery-item-bg-light);
				}
				.dark-theme .photo-item-themed-bg {
					background-color: var(--gallery-item-bg-dark);
				}
				.mobile-menu-drawer {
					background-color: var(--mobile-menu-bg-light);
				}
				.dark-theme .mobile-menu-drawer {
					background-color: var(--mobile-menu-bg-dark);
				}
				.app-footer-light {
					background-color: var(--app-footer-bg-light);
				}
				.dark-theme .app-footer-dark {
					background-color: var(--app-footer-bg-dark);
				}
				.themed-app-bg {
					background-color: var(--app-bg-light);
				}
				.dark-theme .themed-app-bg {
					background-color: var(--app-bg-dark);
				}

				.themed-highlight-accent-text {
					color: var(--highlight-accent-light);
				}
				.dark-theme .themed-highlight-accent-text {
					color: var(--highlight-accent-dark);
				}
				.themed-highlight-accent-bg {
					background-color: var(--highlight-accent-bg-light);
				}
				.dark-theme .themed-highlight-accent-bg {
					background-color: var(--highlight-accent-dark);
				}

				.themed-primary-button {
					background-color: var(--primary-button-bg-light);
					color: white;
					transition: background-color 0.2s ease-in-out;
				}
				.themed-primary-button:hover {
					background-color: var(--primary-button-hover-bg-light);
				}
				.dark-theme .themed-primary-button {
					background-color: var(--primary-button-bg-dark);
				}
				.dark-theme .themed-primary-button:hover {
					background-color: var(--primary-button-hover-bg-dark);
				}

				.themed-secondary-button {
					background-color: var(--secondary-button-bg-light);
					color: var(--text-secondary-light);
					transition: background-color 0.2s ease-in-out;
				}
				.themed-secondary-button:hover {
					background-color: var(--secondary-button-hover-bg-light);
				}
				.dark-theme .themed-secondary-button {
					background-color: var(--secondary-button-bg-dark);
					color: var(--text-secondary-dark);
				}
				.dark-theme .themed-secondary-button:hover {
					background-color: var(--secondary-button-hover-bg-dark);
				}

				.themed-accent-hover-text:hover {
					color: var(--text-accent-light);
				}
				.dark-theme .themed-accent-hover-text:hover {
					color: var(--text-accent-dark);
				}

				.themed-modal-text-highlight {
					color: var(--modal-text-highlight-light);
				}
				.dark-theme .themed-modal-text-highlight {
					color: var(--modal-text-highlight-dark);
				}

				.themed-ring-accent {
					ring-color: var(--ring-accent-light);
				}
				.dark-theme .themed-ring-accent {
					ring-color: var(--ring-accent-dark);
				}

				.themed-ring-subtle {
					ring-color: var(--ring-subtle-light);
				}
				.dark-theme .themed-ring-subtle {
					ring-color: var(--ring-subtle-dark);
				}

				.themed-filter-apply-button-default {
					background-color: var(--filter-apply-bg-light);
					color: var(--filter-apply-text-light);
					transition: background-color 0.2s ease-in-out;
				}
				.themed-filter-apply-button-default:hover {
					background-color: var(--filter-apply-hover-bg-light);
				}
				.dark-theme .themed-filter-apply-button-default {
					background-color: var(--filter-apply-default-bg-dark);
					color: var(--filter-apply-default-text-dark);
				}
				.dark-theme .themed-filter-apply-button-default:hover {
					background-color: var(--filter-apply-default-hover-bg-dark);
				}

				.themed-filter-vote-button-voted {
					background-color: var(--filter-vote-voted-bg-light);
					color: white;
				}
				.dark-theme .themed-filter-vote-button-voted {
					background-color: var(--filter-vote-voted-bg-dark);
				}

				.themed-filter-vote-button-default {
					background-color: var(--filter-vote-default-bg-light);
					color: var(--filter-vote-default-text-light);
					transition: background-color 0.2s ease-in-out;
				}
				.themed-filter-vote-button-default:hover {
					background-color: var(--filter-vote-default-hover-bg-light);
				}
				.dark-theme .themed-filter-vote-button-default {
					background-color: var(--filter-vote-default-bg-dark);
					color: var(--filter-vote-default-text-dark);
				}
				.dark-theme .themed-filter-vote-button-default:hover {
					background-color: var(--filter-vote-default-hover-bg-dark);
				}

				.themed-subtle-text {
					color: var(--subtle-text-light);
				}
				.dark-theme .themed-subtle-text {
					color: var(--subtle-text-dark);
				}

				.themed-ar-sticker-active {
					background-color: var(--ar-sticker-active-bg-light);
					color: var(--ar-sticker-active-text-light);
					ring-color: var(--ar-sticker-active-ring-light);
				}
				.themed-ar-sticker-active svg {
					fill: var(--ar-sticker-active-text-light) !important;
				}
				.dark-theme .themed-ar-sticker-active {
					background-color: var(--ar-sticker-active-bg-dark);
					color: var(--ar-sticker-active-text-dark);
					ring-color: var(--ar-sticker-active-ring-dark);
				}
				.dark-theme .themed-ar-sticker-active svg {
					fill: var(--ar-sticker-active-text-dark) !important;
				}

				.themed-ar-sticker-default {
					background-color: var(--ar-sticker-default-bg-light);
					color: var(--ar-sticker-default-text-light);
					transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
				}
				.themed-ar-sticker-default:hover {
					background-color: var(--ar-sticker-default-hover-bg-light);
				}
				.dark-theme .themed-ar-sticker-default {
					background-color: var(--ar-sticker-default-bg-dark);
					color: var(--ar-sticker-default-text-dark);
				}
				.dark-theme .themed-ar-sticker-default:hover {
					background-color: var(--ar-sticker-default-hover-bg-dark);
				}

				.themed-main-footer-bg {
					background-color: var(--main-footer-bg-light);
					border-color: var(--main-footer-border-light);
				}
				.dark-theme .themed-main-footer-bg {
					background-color: var(--main-footer-bg-dark);
					border-color: var(--main-footer-border-dark);
				}

				.themed-section-bg-primary {
					background-color: var(--section-bg-primary-light);
				}
				.dark-theme .themed-section-bg-primary {
					background-color: var(--section-bg-primary-dark);
				}

				.themed-section-bg-secondary {
					background-color: var(--section-bg-secondary-light);
				}
				.dark-theme .themed-section-bg-secondary {
					background-color: var(--section-bg-secondary-dark);
				}

				.themed-modal-border-top {
					background-color: var(--modal-border-top-bg-light);
					border-color: var(--modal-border-top-border-light);
				}
				.dark-theme .themed-modal-border-top {
					background-color: var(--modal-border-top-bg-dark);
					border-color: var(--modal-border-top-border-dark);
				}

				.themed-modal-image-bg {
					background-color: var(--modal-image-bg-light);
				}
				.dark-theme .themed-modal-image-bg {
					background-color: var(--modal-image-bg-dark);
				}

				.themed-color-input-border {
					border-color: var(--color-input-border-light);
				}
				.dark-theme .themed-color-input-border {
					border-color: var(--color-input-border-dark);
				}
			`}</style>
			<style jsx>{`
				@keyframes toast-in {
					from {
						opacity: 0;
						transform: translateY(-20px) scale(0.95);
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}
				@keyframes toast-out {
					from {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
					to {
						opacity: 0;
						transform: translateY(20px) scale(0.95);
					}
				}
				.animate-fade-in {
					animation: fadeInModal 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
				}
				.animate-fade-in-slow {
					animation: fadeInModal 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
				}
				.animate-slide-up {
					animation: slideUpModal 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
				}
				@keyframes fadeInModal {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				@keyframes slideUpModal {
					from {
						opacity: 0;
						transform: translateY(30px) scale(0.98);
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}
			`}</style>

			<div className="fixed top-4 left-4 right-4 z-[9999] space-y-2.5 pointer-events-none">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`mx-auto max-w-md flex items-center justify-between px-4 py-3 rounded-lg shadow-xl text-sm font-medium text-white transition-all duration-400 ease-out transform font-manrope pointer-events-auto
              ${
								toast.type === "success"
									? themeMode === "dark"
										? "bg-green-500"
										: "bg-green-600"
									: toast.type === "error"
									? themeMode === "dark"
										? "bg-red-500"
										: "bg-red-600"
									: toast.type === "warning"
									? themeMode === "dark"
										? "bg-yellow-400 text-gray-900"
										: "bg-yellow-500 text-gray-800"
									: themeMode === "dark"
									? "bg-indigo-500"
									: "bg-indigo-600"
							}`}
						style={{
							animationName: "toast-in, toast-out",
							animationDuration: "0.4s, 0.4s",
							animationDelay: "0s, 3.6s",
							animationFillMode: "forwards",
						}}
					>
						<span className="flex-grow mr-2">{toast.message}</span>
						<button
							onClick={() => removeToast(toast.id)}
							className={`p-1 -m-1 rounded-full transition-colors ${
								toast.type === "warning"
									? "hover:bg-black/10"
									: "hover:bg-white/20"
							} focus:outline-none focus:ring-2 ${
								toast.type === "warning"
									? "focus:ring-black/30"
									: "focus:ring-white/50"
							}`}
							aria-label="Close notification"
						>
							<IconClose
								className={`w-4 h-4 ${
									toast.type === "warning"
										? themeMode === "dark"
											? "text-gray-900"
											: "text-gray-800"
										: "text-white"
								}`}
							/>
						</button>
					</div>
				))}
			</div>

			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileUpload}
				accept="image/*"
				className="hidden"
			/>

			{showAppView ? (
				<AppView />
			) : (
				<div className="flex flex-col min-h-screen">
					<header
						className={`sticky top-0 z-30 frosted-glass shadow-md ${
							themeMode === "dark"
								? "border-b border-[var(--frosted-border-dark)]"
								: "border-b border-[var(--frosted-border-light)]"
						}`}
					>
						<div className="container mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex items-center justify-between h-16">
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										setShowAppView(false);
									}}
									className="flex items-center gap-2 font-poppins text-xl sm:text-2xl font-bold themed-header-text cursor-pointer"
								>
									<IconSparkles /> HixcelQuest
								</a>
								<nav className="hidden md:flex space-x-6">
									{navLinks.map((link) =>
										link.action ? (
											<button
												key={link.name}
												onClick={link.action}
												className="font-medium themed-secondary-text themed-button-hover-bg px-3 py-1.5 rounded-md text-sm cursor-pointer font-manrope"
											>
												{link.name}
											</button>
										) : (
											<a
												key={link.name}
												href={link.href}
												className="font-medium themed-secondary-text themed-button-hover-bg px-3 py-1.5 rounded-md text-sm cursor-pointer font-manrope"
											>
												{link.name}
											</a>
										)
									)}
								</nav>
								<div className="hidden md:flex items-center space-x-3">
									<button
										onClick={() => setShowAppView(true)}
										className={`px-4 py-2 text-sm font-medium rounded-md text-white themed-primary-button cursor-pointer font-manrope`}
									>
										Join Challenge
									</button>
									<button
										onClick={toggleThemeMode}
										className="p-2.5 rounded-full themed-button-text themed-button-hover-bg transition-colors cursor-pointer"
										title="Toggle Theme Mode"
									>
										{themeMode === "dark" ? <IconSun /> : <IconMoon />}
									</button>
								</div>
								<div className="md:hidden flex items-center">
									<button
										onClick={toggleThemeMode}
										className="p-2 rounded-full themed-button-text themed-button-hover-bg transition-colors mr-1.5 cursor-pointer"
										title="Toggle Theme Mode"
									>
										{themeMode === "dark" ? <IconSun /> : <IconMoon />}
									</button>
									<button
										onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
										className="p-2 rounded-md themed-button-text themed-button-hover-bg cursor-pointer"
									>
										{mobileMenuOpen ? <IconX /> : <IconMenu />}
									</button>
								</div>
							</div>
						</div>
						{mobileMenuOpen && (
							<div
								className={`md:hidden absolute top-16 left-0 right-0 mobile-menu-drawer shadow-lg pb-3 pt-1 ${
									themeMode === "dark"
										? "border-t border-[var(--frosted-border-dark)]"
										: "border-t border-[var(--frosted-border-light)]"
								}`}
							>
								<nav className="flex flex-col space-y-1 px-3">
									{navLinks.map((link) =>
										link.action ? (
											<button
												key={link.name}
												onClick={() => {
													link.action();
													setMobileMenuOpen(false);
												}}
												className="block px-3 py-2 rounded-md text-base font-medium themed-secondary-text themed-button-hover-bg text-left cursor-pointer font-manrope"
											>
												{link.name}
											</button>
										) : (
											<a
												key={link.name}
												href={link.href}
												onClick={() => setMobileMenuOpen(false)}
												className="block px-3 py-2 rounded-md text-base font-medium themed-secondary-text themed-button-hover-bg cursor-pointer font-manrope"
											>
												{link.name}
											</a>
										)
									)}
									<button
										onClick={() => {
											setShowAppView(true);
											setMobileMenuOpen(false);
										}}
										className={`block w-full mt-1 px-3 py-2.5 rounded-md text-base font-medium text-white themed-primary-button text-center cursor-pointer font-manrope`}
									>
										Join Challenge
									</button>
								</nav>
							</div>
						)}
					</header>

					<main className="flex-grow">
						<section
							id="hero"
							className={`themed-section-bg-primary py-16 sm:py-24 lg:py-32`}
						>
							<div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
								<h1 className="font-poppins text-3xl sm:text-5xl lg:text-6xl font-extrabold themed-primary-text tracking-tight">
									Snap, Edit,{" "}
									<span className={`themed-highlight-accent-text`}>Share.</span>
								</h1>
								<h2 className="font-poppins text-2xl sm:text-4xl lg:text-5xl font-bold themed-primary-text tracking-tight mt-1 sm:mt-2">
									Daily Photo Fun.
								</h2>
								<p className="mt-4 sm:mt-6 max-w-xl sm:max-w-2xl mx-auto text-md sm:text-lg themed-secondary-text font-manrope">
									Join daily photo challenges, unleash your creativity with
									powerful editing tools, and connect with a vibrant community.
								</p>
								<div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
									<button
										onClick={() => setShowAppView(true)}
										className={`px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg text-white themed-primary-button shadow-lg cursor-pointer font-manrope`}
									>
										Join Today's Challenge
									</button>
									<a
										href="#how-it-works"
										className={`px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg themed-secondary-text themed-secondary-button shadow-md cursor-pointer font-manrope`}
									>
										Learn More
									</a>
								</div>
							</div>
						</section>

						<section
							id="how-it-works"
							className={`themed-section-bg-secondary py-12 sm:py-20`}
						>
							<div className="container mx-auto px-4 sm:px-6 lg:px-8">
								<h2 className="text-2xl sm:text-3xl font-poppins font-bold themed-primary-text text-center mb-10 sm:mb-14">
									How It Works
								</h2>
								<div className="grid md:grid-cols-3 gap-6 sm:gap-10">
									{[
										{
											icon: <IconCameraSolid />,
											title: "Get the Theme",
											description:
												"Check daily for a new, inspiring photo theme to spark your creativity.",
										},
										{
											icon: <IconImageSolid />,
											title: "Snap & Upload",
											description:
												"Take your best shot and upload it. Edit with our tools if you like!",
										},
										{
											icon: <IconTrophySolid />,
											title: "Share & Engage",
											description:
												"View others' work, vote, draw, and see who tops the leaderboard.",
										},
									].map((step, index) => (
										<div
											key={index}
											className={`p-6 sm:p-8 rounded-xl shadow-lg themed-modal-section-bg text-center transition-all hover:shadow-2xl hover:scale-[1.03] flex flex-col items-center`}
										>
											<div className="p-3 sm:p-4 rounded-full bg-indigo-500 text-white  mb-4 sm:mb-6 inline-block shadow-md">
												{React.cloneElement(step.icon, {
													className: "w-7 h-7 sm:w-8 sm:h-8 text-white",
												})}
											</div>
											<h3 className="text-lg sm:text-xl font-poppins font-semibold themed-modal-text-primary mb-2 sm:mb-3">
												{step.title}
											</h3>
											<p className="text-sm sm:text-base themed-modal-text-secondary font-manrope flex-grow">
												{step.description}
											</p>
										</div>
									))}
								</div>
							</div>
						</section>

						<section
							id="about-us"
							className={`themed-section-bg-primary py-12 sm:py-20`}
						>
							<div className="container mx-auto px-4 sm:px-6 lg:px-8">
								<div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
									<div>
										<h2 className="text-2xl sm:text-3xl font-poppins font-bold themed-primary-text mb-4 sm:mb-6">
											About HixcelQuest
										</h2>
										<p className="text-md sm:text-lg themed-secondary-text mb-3 sm:mb-4 font-manrope">
											HixcelQuest is born from a passion for photography and
											community. We believe everyone has a unique perspective to
											share, and daily challenges are a fantastic way to hone
											skills and connect.
										</p>
										<p className="text-md sm:text-lg themed-secondary-text font-manrope">
											Our platform provides intuitive tools for quick edits, fun
											AR additions, and collaborative feedback, making creative
											expression accessible for all.
										</p>
									</div>
									<div className="grid grid-cols-2 gap-3 sm:gap-4">
										<img
											src="https://ehsdailyadvisor.com/app/uploads/sites/2/2012/04/teamwork.jpg"
											alt="Team working"
											className="rounded-lg shadow-xl aspect-square object-cover"
										/>
										<img
											src="https://www.it-labs.com/wp-content/uploads/2022/04/brainstorming-01.png"
											alt="Creative discussion"
											className="rounded-lg shadow-xl aspect-square object-cover mt-4 sm:mt-8"
										/>
									</div>
								</div>
							</div>
						</section>
					</main>

					<footer
						className={`pt-12 sm:pt-16 pb-6 sm:pb-8 themed-main-footer-bg border-t`}
					>
						<div className="container mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
								<div className="col-span-2 lg:col-span-1">
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setShowAppView(false);
										}}
										className="flex items-center gap-2 font-poppins text-xl sm:text-2xl font-bold themed-primary-text cursor-pointer"
									>
										<IconSparkles /> HixcelQuest
									</a>
									<p className="mt-3 sm:mt-4 text-xs sm:text-sm themed-secondary-text font-manrope">
										Creative photo challenges, daily.
									</p>
									<div className="mt-4 sm:mt-6 flex space-x-4">
										<a
											href="https://example.com/"
											target="_blank"
											rel="noopener noreferrer"
											className="themed-secondary-text themed-accent-hover-text cursor-pointer"
										>
											<IconDummySocial1 />
										</a>
										<a
											href="https://example.com/"
											target="_blank"
											rel="noopener noreferrer"
											className="themed-secondary-text themed-accent-hover-text cursor-pointer"
										>
											<IconDummySocial2 />
										</a>
										<a
											href="https://example.com/"
											target="_blank"
											rel="noopener noreferrer"
											className="themed-secondary-text themed-accent-hover-text cursor-pointer"
										>
											<IconDummySocial3 />
										</a>
									</div>
								</div>
								{Object.entries(footerLinks).map(([category, links]) => (
									<div key={category}>
										<h3 className="text-xs sm:text-sm font-semibold themed-primary-text tracking-wider uppercase font-poppins">
											{category}
										</h3>
										<ul
											role="list"
											className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2"
										>
											{links.map((link) => (
												<li key={link.name}>
													{link.action ? (
														<button
															onClick={link.action}
															className="text-xs sm:text-sm themed-secondary-text themed-accent-hover-text cursor-pointer font-manrope"
														>
															{link.name}
														</button>
													) : (
														<a
															href={link.href || "#"}
															className="text-xs sm:text-sm themed-secondary-text themed-accent-hover-text cursor-pointer font-manrope"
														>
															{link.name}
														</a>
													)}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
							<div
								className={`mt-8 pt-6 sm:pt-8 border-t ${
									themeMode === "dark" ? "border-slate-700" : "border-slate-200"
								} text-xs sm:text-sm themed-secondary-text text-center font-manrope`}
							>
								{new Date().getFullYear()} PixelQuest. A creative photo gallery!
							</div>
						</div>
					</footer>
				</div>
			)}

			{selectedImage && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-2 sm:p-4 transition-opacity duration-300 animate-fade-in"
					onClick={handleCloseModal}
				>
					<div
						className="frosted-glass themed-modal-content-bg rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[101] p-2.5 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors cursor-pointer"
							onClick={handleCloseModal}
							title="Close Modal"
						>
							<IconClose />
						</button>

						<div
							ref={imageContainerRef}
							className={`relative w-full h-[40vh] sm:h-[50vh] md:h-[55vh] themed-modal-image-bg flex items-center justify-center overflow-hidden p-2 sm:p-4`}
						>
							<img
								ref={imageRef}
								src={imageForModalDisplay}
								alt={`Selected: ${selectedImage.caption || "Image"}`}
								className={`block max-w-full max-h-full object-contain rounded-md sm:rounded-lg transition-all duration-300 
                      ${
												arEffectActive && activeTabInModal === "ar_tools"
													? "ar-image-effect-active"
													: ""
											}
                    `}
								style={{
									filter:
										(activeTabInModal === "beforeAfter"
											? undefined
											: selectedImage.appliedFilterCss) || undefined,
									opacity:
										activeTabInModal === "beforeAfter" &&
										beforeAfterPercentage === 0
											? 0
											: 1,
									position: "absolute",
									zIndex: 1,
									width: calculatedImgStyle.width,
									height: calculatedImgStyle.height,
									left: calculatedImgStyle.left,
									top: calculatedImgStyle.top,
								}}
							/>
							<canvas
								ref={canvasRef}
								className="absolute top-0 left-0"
								style={{
									pointerEvents: activeTabInModal === "draw" ? "auto" : "none",
									zIndex: 2,
								}}
								onMouseDown={startDrawing}
								onMouseMove={draw}
								onMouseUp={stopDrawing}
								onMouseLeave={stopDrawing}
								onTouchStart={startDrawing}
								onTouchMove={draw}
								onTouchEnd={stopDrawing}
							/>
							{activeTabInModal === "beforeAfter" &&
								selectedImage.originalImageUrl &&
								imageRef.current && (
									<>
										<img
											src={beforeAfterImageUrl}
											alt="Image with edits"
											className="absolute object-contain rounded-md sm:rounded-lg"
											style={{
												filter: selectedImage.appliedFilterCss || undefined,
												clipPath: `inset(0 ${
													100 - beforeAfterPercentage
												}% 0 0)`,
												zIndex: 3,
												width: calculatedImgStyle.width,
												height: calculatedImgStyle.height,
												left: calculatedImgStyle.left,
												top: calculatedImgStyle.top,
												opacity: beforeAfterPercentage === 100 ? 0 : 1,
											}}
										/>
										<div
											className={`absolute top-0 bottom-0 w-1.5 rounded-full cursor-ew-resize z-[5] ${
												themeMode === "dark"
													? "bg-white/40 hover:bg-white/60"
													: "bg-black/30 hover:bg-black/50"
											} transition-colors touch-none`}
											style={{
												left: `calc(${parseFloat(
													calculatedImgStyle.left || "0"
												)}px + (${beforeAfterPercentage / 100} * ${parseFloat(
													calculatedImgStyle.width || "0"
												)}px) - 3px)`,
												height: calculatedImgStyle.height,
												top: calculatedImgStyle.top,
											}}
											onMouseDown={handleBeforeAfterSwipeStart as any}
											onTouchStart={handleBeforeAfterSwipeStart as any}
										>
											<div
												className={`absolute top-1/2 -translate-y-1/2 -left-1 w-4 h-8 rounded-sm ${
													themeMode === "dark" ? "bg-white/50" : "bg-black/40"
												} flex items-center justify-center shadow-md`}
											>
												<svg
													className={`w-2 h-4 ${
														themeMode === "dark"
															? "text-gray-800"
															: "text-white"
													}`}
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="3"
														d="M8 9l4-4 4 4m0 6l-4 4-4-4"
													></path>
												</svg>
											</div>
										</div>
									</>
								)}

							{selectedImage.activeArStickerIds.size > 0 && (
								<>
									{AVAILABLE_AR_STICKERS.map((stickerConf) => {
										if (selectedImage.activeArStickerIds.has(stickerConf.id)) {
											const delta = selectedImage.arStickerDeltas[
												stickerConf.id
											] || { x: 0, y: 0 };
											const baseTransform =
												stickerConf.defaultStyle.transform || "";
											const style: React.CSSProperties = {
												...stickerConf.defaultStyle,
												transform: `${baseTransform} translateX(${delta.x}px) translateY(${delta.y}px)`,
												zIndex: 4,
											};
											return (
												<div
													key={stickerConf.id}
													className="ar-sticker"
													style={style}
													onMouseDown={(e) =>
														handleStickerMouseDown(e, stickerConf.id)
													}
													onTouchStart={(e) =>
														handleStickerTouchStart(e, stickerConf.id)
													}
												>
													{React.cloneElement(stickerConf.icon, {
														className: "w-full h-full",
													})}
												</div>
											);
										}
										return null;
									})}
								</>
							)}

							{arEffectActive && activeTabInModal === "ar_tools" && (
								<div className="ar-photo-booth-overlay">
									<div className="ar-scanline"></div>
									<div className="ar-corner-brackets top-left"></div>
									<div className="ar-corner-brackets top-right"></div>
									<div className="ar-corner-brackets bottom-left"></div>
									<div className="ar-corner-brackets bottom-right"></div>
								</div>
							)}
						</div>

						<div className={`p-3 sm:p-3.5 themed-modal-border-top border-t`}>
							<div className="sm:hidden flex justify-center w-full">
								<div className="inline-flex flex-nowrap space-x-1.5 overflow-x-auto pb-1 no-scrollbar px-1">
									{modalTabs.map((tab) => (
										<button
											key={tab.id + "-mobile"}
											className={`flex items-center justify-center p-3 rounded-lg themed-modal-button-bg cursor-pointer font-manrope aspect-square ${
												activeTabInModal === tab.id
													? "themed-modal-button-active-bg active shadow-lg scale-105 ring-1 themed-ring-accent"
													: "hover:shadow-md"
											}`}
											onClick={() => {
												setActiveTabInModal(tab.id);
												if (tab.id === "ar_tools") {
													if (!arEffectActive) setArEffectActive(true);
												} else {
													if (
														arEffectActive &&
														selectedImage.activeArStickerIds.size === 0
													)
														setArEffectActive(false);
												}
											}}
											title={tab.label}
										>
											{React.cloneElement(tab.icon, {
												className: "w-5 h-5 shrink-0",
											})}
										</button>
									))}
								</div>
							</div>
							<div className="hidden sm:flex w-full justify-center">
								<div className="inline-flex flex-nowrap justify-start space-x-2 overflow-x-auto pb-1 no-scrollbar px-2">
									{modalTabs.map((tab) => (
										<button
											key={tab.id + "-desktop"}
											className={`flex items-center space-x-2 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap themed-modal-button-bg cursor-pointer font-manrope ${
												activeTabInModal === tab.id
													? "themed-modal-button-active-bg active shadow-lg scale-105 ring-1 themed-ring-accent"
													: "hover:shadow-md"
											}`}
											onClick={() => {
												setActiveTabInModal(tab.id);
												if (tab.id === "ar_tools") {
													if (!arEffectActive) setArEffectActive(true);
												} else {
													if (
														arEffectActive &&
														selectedImage.activeArStickerIds.size === 0
													)
														setArEffectActive(false);
												}
											}}
											title={tab.label}
										>
											{React.cloneElement(tab.icon, {
												className: "w-5 h-5 shrink-0",
											})}{" "}
											<span>{tab.label}</span>
										</button>
									))}
								</div>
							</div>
						</div>

						<div className="p-3 sm:p-4 md:p-5 overflow-y-auto flex-grow no-scrollbar themed-modal-text-primary font-manrope">
							{activeTabInModal === "view" && (
								<div className="space-y-3 sm:space-y-4 animate-fade-in-slow">
									<h3 className="font-poppins text-xl sm:text-2xl font-bold themed-modal-text-primary">
										{selectedImage.caption || "Image Details"}
									</h3>
									<p className="themed-modal-text-secondary text-sm sm:text-base">
										{selectedImage.isLocal
											? "This is your uploaded image."
											: "A submission from our community."}
									</p>
									<p className="text-sm themed-modal-text-secondary">
										By:{" "}
										<span
											className={`font-semibold themed-modal-text-highlight`}
										>
											{selectedImage.userName}
										</span>
									</p>
								</div>
							)}

							{activeTabInModal === "draw" && (
								<div className="space-y-4 sm:space-y-5 animate-fade-in-slow">
									<h3 className="font-poppins text-xl sm:text-2xl font-bold themed-modal-text-primary">
										Draw on Image
									</h3>
									<div
										className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 themed-modal-section-bg rounded-xl sm:rounded-2xl shadow-inner`}
									>
										<input
											type="color"
											value={drawingColor}
											onChange={(e) => setDrawingColor(e.target.value)}
											title="Select Color"
											className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 themed-color-input-border shadow-md cursor-pointer`}
										/>
										<div className="flex-grow w-full sm:w-auto flex items-center gap-2 sm:gap-3">
											<label
												htmlFor="strokeWidthRange"
												className={`text-xs sm:text-sm font-medium themed-modal-text-secondary shrink-0`}
											>
												Size:
											</label>
											<input
												id="strokeWidthRange"
												type="range"
												min="1"
												max="30"
												value={drawingStrokeWidth}
												onChange={(e) =>
													setDrawingStrokeWidth(parseInt(e.target.value))
												}
												title="Stroke Width"
												className={`w-full themed-range h-2.5 sm:h-3 rounded-lg appearance-none cursor-pointer`}
											/>
											<span
												className={`text-sm themed-modal-text-primary w-10 text-right font-semibold tabular-nums shrink-0`}
											>
												{drawingStrokeWidth}px
											</span>
										</div>
										<button
											onClick={handleUndoDrawing}
											title="Undo"
											className={`px-3 py-2 sm:px-4 sm:py-2.5 themed-primary-button text-white rounded-md sm:rounded-lg focus:ring-1 focus:ring-indigo-300 transition-all duration-200 shadow-md flex items-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer`}
										>
											<IconUndo />{" "}
											<span className="hidden sm:inline">Undo</span>
										</button>
									</div>
									<p className="text-xs sm:text-sm themed-modal-text-secondary text-center">
										Draw on the image. Changes are saved.
									</p>
								</div>
							)}

							{activeTabInModal === "ar_tools" && (
								<div className="space-y-4 sm:space-y-5 animate-fade-in-slow">
									<h3 className="font-poppins text-xl sm:text-2xl font-bold themed-modal-text-primary">
										AR Photo Booth
									</h3>
									{!arEffectActive &&
										selectedImage.activeArStickerIds.size === 0 && (
											<p className="text-center themed-modal-text-secondary text-sm">
												Activate AR Effects to add stickers!
											</p>
										)}
									{(arEffectActive ||
										selectedImage.activeArStickerIds.size > 0) && (
										<>
											<p className="text-sm themed-modal-text-secondary text-center">
												Tap stickers to add/remove. Drag stickers on the image
												to reposition.
											</p>
											<div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
												{AVAILABLE_AR_STICKERS.map((sticker) => (
													<button
														key={sticker.id}
														onClick={() => toggleArSticker(sticker.id)}
														className={`p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 aspect-square cursor-pointer shadow-md hover:shadow-lg
                                                  ${
																										selectedImage.activeArStickerIds.has(
																											sticker.id
																										)
																											? "themed-ar-sticker-active ring-2"
																											: "themed-ar-sticker-default"
																									}`}
													>
														<span className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
															{React.cloneElement(sticker.icon, {
																className: "w-full h-full",
															})}
														</span>
														<span className="text-xs sm:text-sm font-medium truncate max-w-full">
															{sticker.name}
														</span>
													</button>
												))}
											</div>
										</>
									)}
								</div>
							)}

							{activeTabInModal === "filter" && (
								<div className="space-y-4 sm:space-y-5 animate-fade-in-slow">
									<h3 className="font-poppins text-xl sm:text-2xl font-bold themed-modal-text-primary">
										Apply Filters
									</h3>
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
										{AVAILABLE_FILTERS.map((filter) => (
											<div
												key={filter.id}
												className={`text-center p-2 sm:p-3 themed-modal-section-bg rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between`}
											>
												<div
													className={`w-full aspect-[16/10] bg-cover bg-center rounded-md sm:rounded-lg mb-2 cursor-pointer border border-transparent themed-ring-accent themed-ring-subtle transition-all duration-200 ring-1`}
													style={{
														backgroundImage: `url(${selectedImage.originalImageUrl})`,
														filter: filter.css,
													}}
													onClick={() =>
														handleApplyFilter(
															filter.id === "none" ? null : filter.css,
															filter.name
														)
													}
												></div>
												<div>
													<p
														className="text-xs sm:text-sm font-semibold themed-modal-text-primary mb-1.5 sm:mb-2 truncate"
														title={filter.name}
													>
														{filter.name}
													</p>
													<div className="flex flex-col sm:flex-row gap-1 sm:gap-1.5 justify-center">
														<button
															onClick={() =>
																handleApplyFilter(
																	filter.id === "none" ? null : filter.css,
																	filter.name
																)
															}
															className={`text-[10px] sm:text-xs w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md font-semibold ${
																selectedImage.appliedFilterCss === filter.css ||
																(selectedImage.appliedFilterCss === null &&
																	filter.id === "none")
																	? "themed-primary-button shadow-md"
																	: "themed-filter-apply-button-default"
															} transition-all duration-200 cursor-pointer`}
															title={`Apply ${filter.name}`}
														>
															{" "}
															Apply{" "}
														</button>
														<button
															onClick={() => handleVoteForFilter(filter.id)}
															title={`Vote for ${filter.name}`}
															className={`text-[10px] sm:text-xs w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md font-semibold flex items-center justify-center gap-1 cursor-pointer
                                    ${
																			selectedImage.userVotedFilters.has(
																				filter.id
																			)
																				? "themed-filter-vote-button-voted shadow-sm"
																				: "themed-filter-vote-button-default"
																		} transition-all duration-200`}
														>
															{selectedImage.userVotedFilters.has(filter.id)
																? "Voted"
																: "Vote"}{" "}
															({selectedImage.filterVotes[filter.id] || 0})
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{activeTabInModal === "exif" && (
								<div className="space-y-3 sm:space-y-4 animate-fade-in-slow">
									<h3 className="font-poppins text-xl sm:text-2xl font-bold themed-modal-text-primary">
										EXIF Data
									</h3>
									<dl
										className={`grid grid-cols-[auto_1fr] gap-x-3 sm:gap-x-4 gap-y-2 sm:gap-y-2.5 text-xs sm:text-sm p-3 sm:p-4 themed-modal-section-bg rounded-xl sm:rounded-2xl shadow-inner`}
									>
										{Object.entries(selectedImage.exif).filter(
											([_, value]) => value
										).length > 0 ? (
											Object.entries(selectedImage.exif).map(([key, value]) =>
												value ? (
													<React.Fragment key={key}>
														<dt
															className={`font-medium themed-modal-text-highlight`}
														>
															{key.replace(/([A-Z])/g, " $1").trim()}:
														</dt>
														<dd className="themed-modal-text-primary break-all">
															{String(value)}
														</dd>
													</React.Fragment>
												) : null
											)
										) : (
											<p className="col-span-2 themed-modal-text-secondary italic">
												No EXIF data available.
											</p>
										)}
									</dl>
								</div>
							)}

							{activeTabInModal === "beforeAfter" && (
								<div className="space-y-4 sm:space-y-5 animate-fade-in-slow text-center">
									<h3 className="font-poppins text-xl sm:text-2xl font-bold themed-modal-text-primary">
										Compare Edits
									</h3>
									<p className="text-sm themed-modal-text-secondary">
										Swipe the handle to compare original (left) with filtered
										(right). <br />{" "}
										<span className={`text-xs themed-subtle-text`}>
											(Drawings not shown. Active AR stickers will overlay both
											images.)
										</span>
									</p>
									<div
										className={`flex justify-between text-xs sm:text-sm themed-subtle-text font-medium max-w-md mx-auto px-1 pt-4`}
									>
										<span>Original</span>
										<span>Filtered</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{showExifCompareModal && compareSlot1 && compareSlot2 && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] p-2 sm:p-4 animate-fade-in"
					onClick={resetExifCompare}
				>
					<div
						className="frosted-glass themed-modal-content-bg rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[111] p-2.5 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors cursor-pointer"
							onClick={resetExifCompare}
							title="Close Comparison"
						>
							<IconClose />
						</button>
						<h2
							className={`font-poppins text-xl sm:text-2xl font-bold themed-modal-text-primary text-center p-4 sm:p-5 border-b themed-modal-border-top`}
						>
							Compare EXIF Data
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-5 overflow-y-auto no-scrollbar font-manrope">
							{[compareSlot1, compareSlot2].map(
								(img, index) =>
									img && (
										<div
											key={index}
											className={`themed-modal-section-bg p-3 sm:p-4 rounded-xl sm:rounded-2xl space-y-2.5 sm:space-y-3 shadow-lg`}
										>
											<img
												src={img.imageUrl}
												alt={`Image by ${img.userName}`}
												className="w-full h-40 sm:h-52 object-cover rounded-lg sm:rounded-xl shadow-md mb-2.5 sm:mb-3"
											/>
											<h4
												className={`font-poppins text-lg sm:text-xl font-semibold themed-modal-text-highlight`}
											>
												{img.userName}'s Photo
											</h4>
											<dl className="grid grid-cols-[auto_1fr] gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm">
												{Object.entries(img.exif).filter(([_, value]) => value)
													.length > 0 ? (
													Object.entries(img.exif).map(([key, value]) =>
														value ? (
															<React.Fragment key={`${img.id}-${key}`}>
																<dt
																	className={`font-medium themed-modal-text-highlight`}
																>
																	{key.replace(/([A-Z])/g, " $1").trim()}:
																</dt>
																<dd className="themed-modal-text-primary break-all">
																	{String(value)}
																</dd>
															</React.Fragment>
														) : null
													)
												) : (
													<p className="col-span-2 themed-modal-text-secondary italic">
														No EXIF data.
													</p>
												)}
											</dl>
										</div>
									)
							)}
						</div>
						<div
							className={`p-4 sm:p-5 border-t themed-modal-border-top text-center`}
						>
							<button
								onClick={resetExifCompare}
								className={`px-5 py-2.5 sm:px-6 sm:py-3 themed-primary-button text-white rounded-lg focus:ring-1 focus:ring-indigo-300 transition-all duration-200 shadow-md text-sm sm:text-base font-semibold cursor-pointer font-manrope`}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{(showPrivacyModal ||
				showTermsModal ||
				showCareersModal ||
				showSupportModal ||
				showBlogModal) && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[120] p-3 sm:p-4 animate-fade-in"
					onClick={closeAllInfoModals}
				>
					<div
						className="frosted-glass themed-modal-content-bg rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up"
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className={`flex justify-between items-center p-4 sm:p-5 border-b themed-modal-border-top`}
						>
							<h2 className="font-poppins text-lg sm:text-xl font-bold themed-modal-text-primary">
								{showPrivacyModal
									? "Privacy Policy"
									: showTermsModal
									? "Terms of Service"
									: showCareersModal
									? "Careers"
									: showSupportModal
									? "Support"
									: "HixcelQuest Blog"}
							</h2>
							<button
								onClick={closeAllInfoModals}
								className="p-2 rounded-full themed-button-text themed-button-hover-bg cursor-pointer"
							>
								<IconClose />
							</button>
						</div>
						<div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 themed-modal-text-secondary text-xs sm:text-sm leading-relaxed font-manrope">
							<p>
								<strong>
									Last Updated:{" "}
									{new Date().toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</strong>
							</p>
							{showPrivacyModal && (
								<>
									<p>
										Your privacy is important to us. This policy explains what
										information we collect and how we use it.
									</p>
									<h3 className="text-md sm:text-lg font-semibold themed-modal-text-primary mt-3 font-poppins">
										1. Information Collection
									</h3>
									<p>
										We collect info you provide (email, username, photos) and
										usage data to improve our service.
									</p>
									<p>
										Full details on our{" "}
										<a
											href="#"
											target="_blank"
											rel="noopener noreferrer"
											className={`font-semibold themed-modal-text-highlight themed-accent-hover-text cursor-pointer`}
										>
											Privacy Page
										</a>
										.
									</p>
								</>
							)}
							{showTermsModal && (
								<>
									<p>
										By using HixcelQuest, you agree to these terms. Please read
										them carefully.
									</p>
									<h3 className="text-md sm:text-lg font-semibold themed-modal-text-primary mt-3 font-poppins">
										1. User Accounts
									</h3>
									<p>
										You are responsible for your account activity and keeping
										your password secure.
									</p>
									<p>
										Full details on our{" "}
										<a
											href="#"
											target="_blank"
											rel="noopener noreferrer"
											className={`font-semibold themed-modal-text-highlight themed-accent-hover-text cursor-pointer`}
										>
											Terms Page
										</a>
										.
									</p>
								</>
							)}
							{showCareersModal && (
								<>
									<h3 className="text-md sm:text-lg font-semibold themed-modal-text-primary mt-2 font-poppins">
										Join Our Team!
									</h3>
									<p>
										We're passionate about photography and building great
										experiences. Check current openings:
									</p>
									<ul className="list-disc list-inside space-y-1 pl-3">
										<li>React Developer</li> <li>Backend Engineer</li>{" "}
										<li>UX/UI Designer</li>
									</ul>
									<p>
										Email: careers@hixcelquest.dev or see{" "}
										<a
											href="#"
											target="_blank"
											rel="noopener noreferrer"
											className={`font-semibold themed-modal-text-highlight themed-accent-hover-text cursor-pointer`}
										>
											Careers Page
										</a>
										.
									</p>
								</>
							)}
							{showSupportModal && (
								<>
									<h3 className="text-md sm:text-lg font-semibold themed-modal-text-primary mt-2 font-poppins">
										How Can We Help?
									</h3>
									<p>
										Check our FAQ for common questions about uploads, AR
										features, and challenges.
									</p>
									<p>
										<strong>Common Questions:</strong>
									</p>
									<ul className="list-disc list-inside space-y-1 pl-3">
										<li>How do I upload?</li> <li>AR Booth guide?</li>{" "}
										<li>Challenge rules?</li>
									</ul>
									<p>
										Contact: support@hixcelquest.dev or visit{" "}
										<a
											href="#"
											target="_blank"
											rel="noopener noreferrer"
											className={`font-semibold themed-modal-text-highlight themed-accent-hover-text cursor-pointer`}
										>
											Support Portal
										</a>
										.
									</p>
								</>
							)}
							{showBlogModal && (
								<>
									<h3 className="text-md sm:text-lg font-semibold themed-modal-text-primary mt-2 font-poppins">
										Latest from the Blog
									</h3>
									<div className="space-y-3">
										<div>
											<h4
												className={`font-semibold themed-modal-text-highlight font-poppins`}
											>
												Mastering Golden Hour Shots
											</h4>
											<p className="text-xs">
												Tips and tricks for capturing stunning photos during the
												magic hour. Learn about lighting, composition, and
												settings.
											</p>
										</div>
										<div>
											<h4
												className={`font-semibold themed-modal-text-highlight font-poppins`}
											>
												Creative Uses of AR Stickers
											</h4>
											<p className="text-xs">
												Go beyond simple icons! Discover fun ways to enhance
												your photos with our AR sticker collection.
											</p>
										</div>
									</div>
									<p className="mt-3">
										Visit our full{" "}
										<a
											href="#"
											target="_blank"
											rel="noopener noreferrer"
											className={`font-semibold themed-modal-text-highlight themed-accent-hover-text cursor-pointer`}
										>
											Blog Page
										</a>{" "}
										for more articles.
									</p>
								</>
							)}
						</div>
						<div
							className={`p-3 sm:p-4 border-t themed-modal-border-top text-right`}
						>
							<button
								onClick={closeAllInfoModals}
								className={`px-4 py-2 sm:px-5 themed-primary-button text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-medium cursor-pointer font-manrope`}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			<style jsx>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				.themed-range {
					-webkit-appearance: none;
					appearance: none;
					background: transparent;
				}
				.themed-range::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					margin-top: -6px;
					background-color: var(
						${themeMode === "dark"
							? "--range-thumb-dark"
							: "--range-thumb-light"}
					);
					height: 18px;
					width: 18px;
					border-radius: 50%;
					cursor: pointer;
					border: 2px solid
						${themeMode === "dark"
							? "var(--modal-content-bg-dark)"
							: "var(--modal-content-bg-light)"};
					box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
				}
				.themed-range::-moz-range-thumb {
					background-color: var(
						${themeMode === "dark"
							? "--range-thumb-dark"
							: "--range-thumb-light"}
					);
					height: 14px;
					width: 14px;
					border-radius: 50%;
					cursor: pointer;
					border: 2px solid
						${themeMode === "dark"
							? "var(--modal-content-bg-dark)"
							: "var(--modal-content-bg-light)"};
					box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
				}
				.themed-range::-webkit-slider-runnable-track {
					width: 100%;
					height: 6px;
					cursor: pointer;
					background: var(
						${themeMode === "dark"
							? "--range-track-dark"
							: "--range-track-light"}
					);
					border-radius: 3px;
				}
				.themed-range::-moz-range-track {
					width: 100%;
					height: 6px;
					cursor: pointer;
					background: var(
						${themeMode === "dark"
							? "--range-track-dark"
							: "--range-track-light"}
					);
					border-radius: 3px;
				}
			`}</style>
		</div>
	);
};

export default HomePage;
