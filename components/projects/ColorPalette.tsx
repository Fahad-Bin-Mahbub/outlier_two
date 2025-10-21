"use client";
import React, { useState, useEffect } from "react";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

interface Color {
	hex: string;
	locked: boolean;
}

interface ColorPalette {
	id: string;
	name: string;
	colors: Color[];
	tags: string[];
}

interface DropdownProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

const samplePalettes: ColorPalette[] = [
	{
		id: "1",
		name: "Ocean Breeze",
		colors: [
			{ hex: "#0077b6", locked: false },
			{ hex: "#00b4d8", locked: false },
			{ hex: "#90e0ef", locked: false },
			{ hex: "#caf0f8", locked: false },
			{ hex: "#023e8a", locked: false },
		],
		tags: ["Cool", "Blue", "Calm"],
	},
	{
		id: "2",
		name: "Sunset Glow",
		colors: [
			{ hex: "#ff6b6b", locked: false },
			{ hex: "#ff9e64", locked: false },
			{ hex: "#ffca3a", locked: false },
			{ hex: "#ff8fab", locked: false },
			{ hex: "#590d22", locked: false },
		],
		tags: ["Warm", "Vibrant", "Orange"],
	},
	{
		id: "3",
		name: "Forest Walk",
		colors: [
			{ hex: "#2d6a4f", locked: false },
			{ hex: "#40916c", locked: false },
			{ hex: "#52b788", locked: false },
			{ hex: "#74c69d", locked: false },
			{ hex: "#b7e4c7", locked: false },
		],
		tags: ["Green", "Muted", "Natural"],
	},
	{
		id: "4",
		name: "Lavender Dreams",
		colors: [
			{ hex: "#7209b7", locked: false },
			{ hex: "#9d4edd", locked: false },
			{ hex: "#c77dff", locked: false },
			{ hex: "#e0aaff", locked: false },
			{ hex: "#f3d5ff", locked: false },
		],
		tags: ["Purple", "Soft", "Pastel"],
	},
	{
		id: "5",
		name: "Earthy Tones",
		colors: [
			{ hex: "#582f0e", locked: false },
			{ hex: "#7f4f24", locked: false },
			{ hex: "#936639", locked: false },
			{ hex: "#a68a64", locked: false },
			{ hex: "#d8c3a5", locked: false },
		],
		tags: ["Brown", "Muted", "Natural", "Warm"],
	},
	{
		id: "6",
		name: "Neon Nights",
		colors: [
			{ hex: "#f72585", locked: false },
			{ hex: "#7209b7", locked: false },
			{ hex: "#3a0ca3", locked: false },
			{ hex: "#4361ee", locked: false },
			{ hex: "#4cc9f0", locked: false },
		],
		tags: ["Vibrant", "Bright", "Neon"],
	},
	{
		id: "7",
		name: "Grayscale",
		colors: [
			{ hex: "#f8f9fa", locked: false },
			{ hex: "#e9ecef", locked: false },
			{ hex: "#dee2e6", locked: false },
			{ hex: "#ced4da", locked: false },
			{ hex: "#6c757d", locked: false },
		],
		tags: ["Neutral", "Muted", "Monochrome"],
	},
	{
		id: "8",
		name: "Autumn Leaves",
		colors: [
			{ hex: "#9c6644", locked: false },
			{ hex: "#bc6c25", locked: false },
			{ hex: "#dda15e", locked: false },
			{ hex: "#fefae0", locked: false },
			{ hex: "#283618", locked: false },
		],
		tags: ["Warm", "Orange", "Natural"],
	},
	{
		id: "9",
		name: "Blush Pink",
		colors: [
			{ hex: "#ff8ba7", locked: false },
			{ hex: "#ffc6c7", locked: false },
			{ hex: "#fae0e4", locked: false },
			{ hex: "#f7cad0", locked: false },
			{ hex: "#ff5c8a", locked: false },
		],
		tags: ["Pink", "Soft", "Pastel"],
	},
	{
		id: "10",
		name: "Midnight Blue",
		colors: [
			{ hex: "#03045e", locked: false },
			{ hex: "#023e8a", locked: false },
			{ hex: "#0077b6", locked: false },
			{ hex: "#0096c7", locked: false },
			{ hex: "#00b4d8", locked: false },
		],
		tags: ["Blue", "Dark", "Cool"],
	},
	{
		id: "11",
		name: "Citrus Burst",
		colors: [
			{ hex: "#ff7b00", locked: false },
			{ hex: "#ff8800", locked: false },
			{ hex: "#ff9500", locked: false },
			{ hex: "#ffaa00", locked: false },
			{ hex: "#ffcc00", locked: false },
		],
		tags: ["Orange", "Vibrant", "Warm"],
	},
	{
		id: "12",
		name: "Mint Fresh",
		colors: [
			{ hex: "#f0fff4", locked: false },
			{ hex: "#c6f7e2", locked: false },
			{ hex: "#8eedc7", locked: false },
			{ hex: "#65d6ad", locked: false },
			{ hex: "#3ebd93", locked: false },
		],
		tags: ["Green", "Pastel", "Cool"],
	},
];

const allTags = Array.from(
	new Set(samplePalettes.flatMap((palette) => palette.tags))
).sort();

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number): string => {
	return `#${r.toString(16).padStart(2, "0")}${g
		.toString(16)
		.padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const generateSimilarColor = (
	baseColor: string,
	variation: number = 50
): string => {
	const { r, g, b } = hexToRgb(baseColor);

	const newR = Math.max(
		0,
		Math.min(255, r + (Math.random() * variation * 2 - variation))
	);
	const newG = Math.max(
		0,
		Math.min(255, g + (Math.random() * variation * 2 - variation))
	);
	const newB = Math.max(
		0,
		Math.min(255, b + (Math.random() * variation * 2 - variation))
	);

	return rgbToHex(Math.round(newR), Math.round(newG), Math.round(newB));
};

const calculateLuminance = (hex: string): number => {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;

	const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
	const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
	const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const calculateContrast = (color1: string, color2: string): number => {
	const luminance1 = calculateLuminance(color1);
	const luminance2 = calculateLuminance(color2);

	const lighter = Math.max(luminance1, luminance2);
	const darker = Math.min(luminance1, luminance2);

	return (lighter + 0.05) / (darker + 0.05);
};

const isAccessible = (
	contrast: number,
	isLargeText: boolean = false
): boolean => {
	if (isLargeText) {
		return contrast >= 3;
	}
	return contrast >= 4.5;
};

const ColorPaletteExplorer = () => {
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(
		null
	);
	const [palettes] = useState<ColorPalette[]>(samplePalettes);
	const [showSignInDropdown, setShowSignInDropdown] = useState(false);
	const [showSignUpDropdown, setShowSignUpDropdown] = useState(false);
	const signInRef = React.useRef<HTMLDivElement>(null);
	const signUpRef = React.useRef<HTMLDivElement>(null);

	const [copiedText, setCopiedText] = useState<string | null>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				signInRef.current &&
				!signInRef.current.contains(event.target as Node)
			) {
				setShowSignInDropdown(false);
			}
			if (
				signUpRef.current &&
				!signUpRef.current.contains(event.target as Node)
			) {
				setShowSignUpDropdown(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (copiedText) {
			const timer = setTimeout(() => {
				setCopiedText(null);
			}, 1500);
			return () => clearTimeout(timer);
		}
	}, [copiedText]);

	const Dropdown: React.FC<DropdownProps> = ({
		isOpen,
		onClose,
		title,
		children,
	}) => {
		if (!isOpen) return null;

		return (
			<div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
				<div className="p-4 border-b border-gray-100">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-medium text-gray-900">{title}</h3>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-500 cursor-pointer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div className="p-4">{children}</div>
			</div>
		);
	};

	const filteredPalettes =
		selectedTags.length === 0
			? palettes
			: palettes.filter((palette) =>
					selectedTags.every((tag) => palette.tags.includes(tag))
			  );

	const toggleTag = (tag: string) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter((t) => t !== tag));
		} else {
			setSelectedTags([...selectedTags, tag]);
		}
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const selectPalette = (palette: ColorPalette) => {
		setSelectedPalette({
			...palette,
			colors: palette.colors.map((c) => ({ ...c })),
		});
	};

	const closeDetailView = () => {
		setSelectedPalette(null);
	};

	const toggleColorLock = (index: number, e: React.MouseEvent) => {
		e.stopPropagation();
		if (!selectedPalette) return;

		const newColors = [...selectedPalette.colors];
		newColors[index] = {
			...newColors[index],
			locked: !newColors[index].locked,
		};

		setSelectedPalette({
			...selectedPalette,
			colors: newColors,
		});
	};

	const randomizeUnlockedColors = () => {
		if (!selectedPalette) return;

		const baseColorIndex = selectedPalette.colors.findIndex((c) => c.locked);
		const baseColor =
			baseColorIndex >= 0
				? selectedPalette.colors[baseColorIndex].hex
				: selectedPalette.colors[0].hex;

		const newColors = selectedPalette.colors.map((color) => {
			if (color.locked) return color;

			return {
				...color,
				hex: generateSimilarColor(baseColor, 100),
			};
		});

		setSelectedPalette({
			...selectedPalette,
			colors: newColors,
		});
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopiedText(text);
		});
	};

	return (
		<div className={`min-h-screen bg-gray-50 flex flex-col ${inter.className}`}>
			<header
				className="bg-white shadow-md py-4 px-4 sticky top-0 z-10 border-b"
				style={{
					boxShadow: "0 2px 10px rgba(71, 101, 255, 0.08)",
					borderImage:
						"linear-gradient(to right, #FF6B6B, #4CC9F0, #4361EE, #3A0CA3, #F72585) 1",
				}}
			>
				<div className="max-w-[1500px] mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<svg
							width="36"
							height="36"
							viewBox="0 0 36 36"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="flex-shrink-0"
						>
							<circle cx="12" cy="12" r="6" fill="#FF6B6B" />
							<circle cx="24" cy="12" r="6" fill="#4CC9F0" />
							<circle cx="12" cy="24" r="6" fill="#4361EE" />
							<circle cx="24" cy="24" r="6" fill="#3A0CA3" />
							<circle cx="18" cy="18" r="4" fill="#F72585" />
						</svg>
						<h1
							className={`text-2xl font-bold text-gray-900 ${playfair.className}`}
						>
							ChromaHive
						</h1>
					</div>
					<div className="flex items-center space-x-4">
						<div className="text-sm text-gray-500 hidden md:block">
							Professional Color Palettes
						</div>
						<div className="relative" ref={signInRef}>
							<button
								onClick={() => {
									setShowSignInDropdown(!showSignInDropdown);
									setShowSignUpDropdown(false);
								}}
								className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-200"
							>
								Sign In
							</button>
							<Dropdown
								isOpen={showSignInDropdown}
								onClose={() => setShowSignInDropdown(false)}
								title="Sign In"
							>
								<div className="space-y-4">
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700"
										>
											Email
										</label>
										<input
											type="email"
											id="email"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											placeholder="you@example.com"
										/>
									</div>
									<div>
										<label
											htmlFor="password"
											className="block text-sm font-medium text-gray-700"
										>
											Password
										</label>
										<input
											type="password"
											id="password"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											placeholder="••••••••"
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<input
												id="remember-me"
												name="remember-me"
												type="checkbox"
												className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
											/>
											<label
												htmlFor="remember-me"
												className="ml-2 block text-sm text-gray-700"
											>
												Remember me
											</label>
										</div>
										<div className="text-sm">
											<a
												href="#"
												className="font-medium text-blue-600 hover:text-blue-500"
											>
												Forgot password?
											</a>
										</div>
									</div>
									<div>
										<button
											type="button"
											className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200"
										>
											Sign in
										</button>
									</div>
								</div>
							</Dropdown>
						</div>
						<div className="relative" ref={signUpRef}>
							<button
								onClick={() => {
									setShowSignUpDropdown(!showSignUpDropdown);
									setShowSignInDropdown(false);
								}}
								className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm hover:shadow cursor-pointer transition-all duration-200"
							>
								Sign Up
							</button>
							<Dropdown
								isOpen={showSignUpDropdown}
								onClose={() => setShowSignUpDropdown(false)}
								title="Create Account"
							>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="first-name"
												className="block text-sm font-medium text-gray-700"
											>
												First name
											</label>
											<input
												type="text"
												id="first-name"
												className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											/>
										</div>
										<div>
											<label
												htmlFor="last-name"
												className="block text-sm font-medium text-gray-700"
											>
												Last name
											</label>
											<input
												type="text"
												id="last-name"
												className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="signup-email"
											className="block text-sm font-medium text-gray-700"
										>
											Email
										</label>
										<input
											type="email"
											id="signup-email"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											placeholder="you@example.com"
										/>
									</div>
									<div>
										<label
											htmlFor="signup-password"
											className="block text-sm font-medium text-gray-700"
										>
											Password
										</label>
										<input
											type="password"
											id="signup-password"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											placeholder="••••••••"
										/>
									</div>
									<div>
										<button
											type="button"
											className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200"
										>
											Create account
										</button>
									</div>
									<p className="text-xs text-gray-500 text-center mt-2">
										By signing up, you agree to our{" "}
										<a href="#" className="text-blue-600 hover:text-blue-500">
											Terms
										</a>{" "}
										and{" "}
										<a href="#" className="text-blue-600 hover:text-blue-500">
											Privacy Policy
										</a>
										.
									</p>
								</div>
							</Dropdown>
						</div>
					</div>
				</div>
			</header>

			<main className="flex-grow py-6">
				<div className="flex flex-col md:flex-row max-w-[1500px] mx-auto px-4 sm:px-4 lg:px-4">
					{!selectedPalette && (
						<div
							className={`transition-all duration-300 ease-in-out ${
								sidebarOpen ? "w-full md:w-64" : "w-12"
							} bg-white shadow-md rounded-lg mb-6 md:mb-0 md:mr-6 flex-shrink-0`}
						>
							<div className="p-4 flex items-center justify-between">
								<h2
									className={`font-semibold text-gray-700 ${
										sidebarOpen ? "block" : "hidden"
									}`}
								>
									Filters
								</h2>
								<button
									onClick={toggleSidebar}
									className="p-1 rounded-md hover:bg-gray-100 focus:outline-none cursor-pointer transition-colors duration-200"
									aria-label={
										sidebarOpen ? "Collapse sidebar" : "Expand sidebar"
									}
								>
									{sidebarOpen ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 19l-7-7 7-7"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									)}
								</button>
							</div>

							{sidebarOpen && (
								<div className="px-4 pb-4">
									<div className="mb-4">
										<h3 className="text-sm font-medium text-gray-600 mb-2">
											Tags
										</h3>
										<div className="space-y-2">
											{allTags.map((tag) => (
												<div key={tag} className="flex items-center">
													<input
														type="checkbox"
														id={`tag-${tag}`}
														checked={selectedTags.includes(tag)}
														onChange={() => toggleTag(tag)}
														className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
													/>
													<label
														htmlFor={`tag-${tag}`}
														className="ml-2 text-sm text-gray-700 cursor-pointer"
													>
														{tag}
													</label>
												</div>
											))}
										</div>
									</div>

									{selectedTags.length > 0 && (
										<button
											onClick={() => setSelectedTags([])}
											className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors duration-200"
										>
											Clear filters
										</button>
									)}
								</div>
							)}
						</div>
					)}

					<div className={`flex-1 ${selectedPalette ? "w-full" : ""}`}>
						{!selectedPalette ? (
							<>
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-gray-700">
										Palettes{" "}
										{filteredPalettes.length > 0 &&
											`(${filteredPalettes.length})`}
									</h2>
								</div>

								{filteredPalettes.length === 0 ? (
									<div className="bg-white rounded-lg shadow-md p-8 text-center">
										<p className="text-gray-500">
											No palettes match your filters.
										</p>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
										{filteredPalettes.map((palette) => (
											<div
												key={palette.id}
												onClick={() => selectPalette(palette)}
												className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
											>
												<div className="p-4">
													<h3 className="font-medium text-gray-800 mb-2">
														{palette.name}
													</h3>
													<div className="flex h-12 rounded-md overflow-hidden mb-3 shadow-sm">
														{palette.colors.map((color, idx) => (
															<div
																key={idx}
																className="flex-1"
																style={{ backgroundColor: color.hex }}
															/>
														))}
													</div>
													<div className="flex flex-wrap mb-3 text-xs">
														{palette.colors.map((color, idx) => (
															<div
																key={idx}
																className="w-1/5 text-gray-700 truncate pr-1 font-mono"
																title={color.hex}
															>
																{color.hex}
															</div>
														))}
													</div>
													<div className="flex flex-wrap gap-1">
														{palette.tags.map((tag) => (
															<span
																key={tag}
																className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
															>
																{tag}
															</span>
														))}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</>
						) : (
							<div className="bg-white rounded-lg shadow-md overflow-hidden">
								<div className="p-6">
									<div className="flex justify-between items-center mb-6">
										<div className="flex items-center">
											<button
												onClick={closeDetailView}
												className="mr-3 flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
												aria-label="Back to gallery"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 mr-1"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M15 19l-7-7 7-7"
													/>
												</svg>
												Back to Gallery
											</button>
											<h2 className="text-xl font-semibold text-gray-800">
												{selectedPalette.name}
											</h2>
										</div>
										<button
											onClick={closeDetailView}
											className="p-2 rounded-md hover:bg-gray-100 text-gray-500 focus:outline-none md:hidden cursor-pointer"
											aria-label="Close detail view"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
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

									<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
										{selectedPalette.colors.map((color, idx) => (
											<div key={idx} className="flex flex-col items-center">
												<div
													className="w-full h-28 rounded-md mb-2 relative shadow-md transition-transform duration-200 hover:scale-105"
													style={{ backgroundColor: color.hex }}
												>
													<button
														onClick={(e) => toggleColorLock(idx, e)}
														className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 cursor-pointer transition-all duration-200"
														aria-label={
															color.locked ? "Unlock color" : "Lock color"
														}
													>
														{color.locked ? (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4 text-gray-700"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fillRule="evenodd"
																	d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
																	clipRule="evenodd"
																/>
															</svg>
														) : (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4 text-gray-700"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
															</svg>
														)}
													</button>
												</div>
												<div
													className="text-sm font-mono text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-center group"
													onClick={() => copyToClipboard(color.hex)}
												>
													{color.hex}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
														<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
													</svg>
												</div>
											</div>
										))}
									</div>

									{copiedText && (
										<div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 mr-2 text-green-400"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clipRule="evenodd"
												/>
											</svg>
											<span>{copiedText} copied to clipboard</span>
										</div>
									)}

									<button
										onClick={randomizeUnlockedColors}
										className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-8 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
									>
										Randomize Unlocked Colors
									</button>

									<div className="mb-8">
										<h3 className="text-lg font-medium text-gray-800 mb-4">
											Tags
										</h3>
										<div className="flex flex-wrap gap-2">
											{selectedPalette.tags.map((tag) => (
												<span
													key={tag}
													className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md"
												>
													{tag}
												</span>
											))}
										</div>
									</div>

									<div>
										<h3 className="text-lg font-medium text-gray-800 mb-4">
											Accessibility Contrast Checks
										</h3>

										<div className="space-y-6">
											<div>
												<h4 className="text-md font-medium text-gray-700 mb-2">
													Text on Light Background (White #FFFFFF)
												</h4>
												<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
													{selectedPalette.colors.map((color, idx) => {
														const contrastWithWhite = calculateContrast(
															color.hex,
															"#FFFFFF"
														);
														const passesNormal =
															isAccessible(contrastWithWhite);
														const passesLarge = isAccessible(
															contrastWithWhite,
															true
														);

														return (
															<div
																key={idx}
																className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm"
															>
																<div className="p-3 border-b border-gray-100">
																	<div
																		className="rounded h-8 w-full mb-2"
																		style={{ backgroundColor: color.hex }}
																	></div>
																	<div className="font-mono text-xs">
																		{color.hex}
																	</div>
																</div>
																<div className="p-3 text-sm">
																	<div className="flex justify-between mb-1">
																		<span>Contrast:</span>
																		<span className="font-mono">
																			{contrastWithWhite.toFixed(2)}
																		</span>
																	</div>
																	<div className="flex justify-between mb-1">
																		<span>Normal Text:</span>
																		<span
																			className={`font-semibold ${
																				passesNormal
																					? "text-green-600"
																					: "text-red-600"
																			}`}
																		>
																			{passesNormal ? "Pass" : "Fail"}
																		</span>
																	</div>
																	<div className="flex justify-between">
																		<span>Large Text:</span>
																		<span
																			className={`font-semibold ${
																				passesLarge
																					? "text-green-600"
																					: "text-red-600"
																			}`}
																		>
																			{passesLarge ? "Pass" : "Fail"}
																		</span>
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											</div>

											<div>
												<h4 className="text-md font-medium text-gray-700 mb-2">
													Text on Dark Background (Black #000000)
												</h4>
												<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
													{selectedPalette.colors.map((color, idx) => {
														const contrastWithBlack = calculateContrast(
															color.hex,
															"#000000"
														);
														const passesNormal =
															isAccessible(contrastWithBlack);
														const passesLarge = isAccessible(
															contrastWithBlack,
															true
														);

														return (
															<div
																key={idx}
																className="bg-black border border-gray-800 rounded-md overflow-hidden shadow-sm"
															>
																<div className="p-3 border-b border-gray-800">
																	<div
																		className="rounded h-8 w-full mb-2"
																		style={{ backgroundColor: color.hex }}
																	></div>
																	<div className="font-mono text-xs text-white">
																		{color.hex}
																	</div>
																</div>
																<div className="p-3 text-sm text-white">
																	<div className="flex justify-between mb-1">
																		<span>Contrast:</span>
																		<span className="font-mono">
																			{contrastWithBlack.toFixed(2)}
																		</span>
																	</div>
																	<div className="flex justify-between mb-1">
																		<span>Normal Text:</span>
																		<span
																			className={`font-semibold ${
																				passesNormal
																					? "text-green-400"
																					: "text-red-400"
																			}`}
																		>
																			{passesNormal ? "Pass" : "Fail"}
																		</span>
																	</div>
																	<div className="flex justify-between">
																		<span>Large Text:</span>
																		<span
																			className={`font-semibold ${
																				passesLarge
																					? "text-green-400"
																					: "text-red-400"
																			}`}
																		>
																			{passesLarge ? "Pass" : "Fail"}
																		</span>
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>

			<footer
				className="bg-white py-8 border-t"
				style={{
					borderImage:
						"linear-gradient(to right, #FF6B6B, #4CC9F0, #4361EE, #3A0CA3, #F72585) 1",
					boxShadow: "0 -2px 10px rgba(71, 101, 255, 0.05)",
				}}
			>
				<div className="max-w-[1500px] mx-auto px-4 sm:px-4 lg:px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<div className="flex items-center space-x-3 mb-4">
								<svg
									width="28"
									height="28"
									viewBox="0 0 36 36"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle cx="12" cy="12" r="6" fill="#FF6B6B" />
									<circle cx="24" cy="12" r="6" fill="#4CC9F0" />
									<circle cx="12" cy="24" r="6" fill="#4361EE" />
									<circle cx="24" cy="24" r="6" fill="#3A0CA3" />
									<circle cx="18" cy="18" r="4" fill="#F72585" />
								</svg>
								<h3
									className={`text-lg font-bold text-gray-900 ${playfair.className}`}
								>
									ChromaHive
								</h3>
							</div>
							<p className="text-gray-600 text-sm">
								Create, explore, and test beautiful color palettes for your next
								design project.
							</p>
						</div>

						<div>
							<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 relative inline-block">
								Resources
								<span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
									>
										Color Theory Guide
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
									>
										Accessibility Standards
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
									>
										Design Principles
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
									>
										API Documentation
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 relative inline-block">
								Contact
								<span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></span>
							</h3>
							<p className="text-sm text-gray-600 mb-4">
								Have questions or suggestions? We'd love to hear from you.
							</p>
							<a
								href="#"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
							>
								Contact Us
							</a>
						</div>
					</div>

					<div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
						<p className="text-xs text-gray-500">
							&copy; {new Date().getFullYear()} ChromaHive. All rights reserved.
						</p>
						<div className="flex space-x-6 mt-4 md:mt-0">
							<a
								href="#"
								className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
							>
								Terms
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
							>
								Privacy
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
							>
								Cookies
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default ColorPaletteExplorer;
