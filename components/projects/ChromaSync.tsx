"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function ChromaSyncExport() {
	const [palettes, setPalettes] = useState<
		Array<{ name: string; colors: string[] }>
	>([]);
	const [currentPalette, setCurrentPalette] = useState<string[]>([
		"#FF5733",
		"#33FF57",
		"#3357FF",
		"#F3FF33",
		"#FF33F3",
	]);
	const [selectedColor, setSelectedColor] = useState<string>("#FF5733");
	const [paletteType, setPaletteType] = useState<string>("analogous");
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [savedPalettes, setSavedPalettes] = useState<
		Array<{ name: string; colors: string[] }>
	>([]);
	const [paletteName, setPaletteName] = useState<string>("My Palette");
	const [colorFormat, setColorFormat] = useState<string>("hex");
	const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
	const [hue, setHue] = useState<number>(0);
	const [saturation, setSaturation] = useState<number>(100);
	const [brightness, setBrightness] = useState<number>(100);
	const [pickerColor, setPickerColor] = useState<string>("#FF0000");
	const [quoteIndex, setQuoteIndex] = useState<number>(0);
	const [copiedColor, setCopiedColor] = useState<string | null>(null);
	const [colorHistory, setColorHistory] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState<string>("picker");
	const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
	const [isColorDropperActive, setIsColorDropperActive] =
		useState<boolean>(false);
	const [imageLoading, setImageLoading] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const colorPickerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const inspirationalQuotes = [
		"Colors, like features, follow the changes of the emotions. — Pablo Picasso",
		"The purest and most thoughtful minds are those which love color the most. — John Ruskin",
		"Color is a power which directly influences the soul. — Wassily Kandinsky",
		"Colors are the smiles of nature. — Leigh Hunt",
		"Mere color can speak to the soul in a thousand different ways. — Oscar Wilde",
		"There are no lines in nature, only areas of color, one against another. — Edouard Manet",
	];

	useEffect(() => {
		const intervalId = setInterval(() => {
			setQuoteIndex(
				(prevIndex) => (prevIndex + 1) % inspirationalQuotes.length
			);
		}, 10000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		const storedPalettes = localStorage.getItem("savedPalettes");
		if (storedPalettes) {
			setSavedPalettes(JSON.parse(storedPalettes));
		}

		const storedColorHistory = localStorage.getItem("colorHistory");
		if (storedColorHistory) {
			setColorHistory(JSON.parse(storedColorHistory));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));
	}, [savedPalettes]);

	useEffect(() => {
		localStorage.setItem("colorHistory", JSON.stringify(colorHistory));
	}, [colorHistory]);

	useEffect(() => {
		generatePalette(selectedColor, paletteType);

		if (!colorHistory.includes(selectedColor)) {
			const newHistory = [selectedColor, ...colorHistory.slice(0, 9)];
			setColorHistory(newHistory);
		}
	}, [selectedColor, paletteType]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				colorPickerRef.current &&
				!colorPickerRef.current.contains(event.target as Node)
			) {
				setIsColorPickerOpen(false);
				setIsColorDropperActive(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (!uploadedImage) return;

		const setupCanvas = () => {
			if (!imageRef.current || !canvasRef.current) return;

			const img = new Image();
			img.onload = () => {
				const canvas = canvasRef.current;
				if (!canvas) return;

				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.width, img.height);
			};
			img.src = uploadedImage;
		};

		setupCanvas();

		const handleImageClick = (e: MouseEvent) => {
			if (!imageRef.current || !canvasRef.current || !isColorDropperActive)
				return;

			const rect = imageRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const scaleX = imageRef.current.naturalWidth / rect.width;
			const scaleY = imageRef.current.naturalHeight / rect.height;

			const pixelX = Math.floor(x * scaleX);
			const pixelY = Math.floor(y * scaleY);

			const ctx = canvasRef.current.getContext("2d");
			if (!ctx) return;

			const safeX = Math.max(0, Math.min(pixelX, canvasRef.current.width - 1));
			const safeY = Math.max(0, Math.min(pixelY, canvasRef.current.height - 1));

			try {
				const pixelData = ctx.getImageData(safeX, safeY, 1, 1).data;
				const hexColor = `#${(
					(1 << 24) |
					(pixelData[0] << 16) |
					(pixelData[1] << 8) |
					pixelData[2]
				)
					.toString(16)
					.slice(1)}`;

				setSelectedColor(hexColor);
				setIsColorDropperActive(false);
			} catch (error) {
				console.error("Error getting pixel data:", error);
			}
		};

		if (isColorDropperActive && imageRef.current) {
			imageRef.current.addEventListener("click", handleImageClick);
		}

		return () => {
			if (imageRef.current) {
				imageRef.current.removeEventListener("click", handleImageClick);
			}
		};
	}, [isColorDropperActive, uploadedImage]);

	const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
		let r = 0,
			g = 0,
			b = 0;

		if (hex.length === 4) {
			r = parseInt(hex[1] + hex[1], 16);
			g = parseInt(hex[2] + hex[2], 16);
			b = parseInt(hex[3] + hex[3], 16);
		} else if (hex.length === 7) {
			r = parseInt(hex.substring(1, 3), 16);
			g = parseInt(hex.substring(3, 5), 16);
			b = parseInt(hex.substring(5, 7), 16);
		}

		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0,
			s = 0,
			l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}

			h /= 6;
		}

		return { h: h * 360, s: s * 100, l: l * 100 };
	};

	const hslToHex = (h: number, s: number, l: number): string => {
		h /= 360;
		s /= 100;
		l /= 100;

		let r, g, b;

		if (s === 0) {
			r = g = b = l;
		} else {
			const hueToRgb = (p: number, q: number, t: number): number => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = hueToRgb(p, q, h + 1 / 3);
			g = hueToRgb(p, q, h);
			b = hueToRgb(p, q, h - 1 / 3);
		}

		const toHex = (x: number): string => {
			const hex = Math.round(x * 255).toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		};

		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	};

	const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
		let r = 0,
			g = 0,
			b = 0;

		if (hex.length === 4) {
			r = parseInt(hex[1] + hex[1], 16);
			g = parseInt(hex[2] + hex[2], 16);
			b = parseInt(hex[3] + hex[3], 16);
		} else if (hex.length === 7) {
			r = parseInt(hex.substring(1, 3), 16);
			g = parseInt(hex.substring(3, 5), 16);
			b = parseInt(hex.substring(5, 7), 16);
		}

		return { r, g, b };
	};

	const rgbToCmyk = (
		r: number,
		g: number,
		b: number
	): { c: number; m: number; y: number; k: number } => {
		r = r / 255;
		g = g / 255;
		b = b / 255;

		const k = 1 - Math.max(r, g, b);
		const c = (1 - r - k) / (1 - k) || 0;
		const m = (1 - g - k) / (1 - k) || 0;
		const y = (1 - b - k) / (1 - k) || 0;

		return {
			c: Math.round(c * 100),
			m: Math.round(m * 100),
			y: Math.round(y * 100),
			k: Math.round(k * 100),
		};
	};

	const formatColor = (color: string): string => {
		if (colorFormat === "hex") {
			return color;
		} else if (colorFormat === "rgb") {
			const { r, g, b } = hexToRgb(color);
			return `rgb(${r}, ${g}, ${b})`;
		} else if (colorFormat === "cmyk") {
			const { r, g, b } = hexToRgb(color);
			const { c, m, y, k } = rgbToCmyk(r, g, b);
			return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
		}
		return color;
	};

	const generatePalette = (baseColor: string, type: string) => {
		const { h, s, l } = hexToHSL(baseColor);
		let newColors: string[] = [];

		switch (type) {
			case "monochromatic":
				newColors = [
					hslToHex(h, s, l),
					hslToHex(h, s, Math.max(10, l - 30)),
					hslToHex(h, s, Math.min(90, l + 30)),
					hslToHex(h, Math.max(10, s - 30), l),
					hslToHex(h, Math.min(90, s + 30), l),
				];
				break;

			case "analogous":
				newColors = [
					hslToHex(h, s, l),
					hslToHex((h + 30) % 360, s, l),
					hslToHex((h + 60) % 360, s, l),
					hslToHex((h - 30 + 360) % 360, s, l),
					hslToHex((h - 60 + 360) % 360, s, l),
				];
				break;

			case "complementary":
				newColors = [
					hslToHex(h, s, l),
					hslToHex((h + 180) % 360, s, l),
					hslToHex(h, Math.max(10, s - 20), Math.max(10, l - 20)),
					hslToHex(h, Math.min(90, s + 20), Math.min(90, l + 20)),
					hslToHex((h + 180) % 360, Math.max(10, s - 20), Math.max(10, l - 20)),
				];
				break;

			case "triadic":
				newColors = [
					hslToHex(h, s, l),
					hslToHex((h + 120) % 360, s, l),
					hslToHex((h + 240) % 360, s, l),
					hslToHex(h, Math.max(10, s - 20), Math.max(10, l - 20)),
					hslToHex((h + 120) % 360, Math.max(10, s - 20), Math.max(10, l - 20)),
				];
				break;

			case "tetradic":
				newColors = [
					hslToHex(h, s, l),
					hslToHex((h + 90) % 360, s, l),
					hslToHex((h + 180) % 360, s, l),
					hslToHex((h + 270) % 360, s, l),
					hslToHex(h, Math.max(10, s - 20), Math.max(10, l - 20)),
				];
				break;

			default:
				newColors = [baseColor];
		}

		setCurrentPalette(newColors);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setImageLoading(true);

		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const colors = extractColorsFromImage(img);
				setCurrentPalette(colors);
				setUploadedImage(e.target?.result as string);
				setImageLoading(false);
			};
			img.src = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	};

	const removeUploadedImage = () => {
		setUploadedImage(null);
		setIsColorDropperActive(false);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}

		generatePalette(selectedColor, paletteType);
	};

	const extractColorsFromImage = (img: HTMLImageElement): string[] => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const maxSize = 100;

		let width = img.width;
		let height = img.height;
		if (width > height) {
			if (width > maxSize) {
				height = Math.round((height * maxSize) / width);
				width = maxSize;
			}
		} else {
			if (height > maxSize) {
				width = Math.round((width * maxSize) / height);
				height = maxSize;
			}
		}

		canvas.width = width;
		canvas.height = height;

		ctx?.drawImage(img, 0, 0, width, height);
		const imageData = ctx?.getImageData(0, 0, width, height).data;

		const colorMap: { [key: string]: number } = {};
		if (imageData) {
			for (let i = 0; i < imageData.length; i += 4) {
				const r = imageData[i];
				const g = imageData[i + 1];
				const b = imageData[i + 2];

				const simplifiedR = Math.round(r / 10) * 10;
				const simplifiedG = Math.round(g / 10) * 10;
				const simplifiedB = Math.round(b / 10) * 10;

				const colorKey = `rgb(${simplifiedR},${simplifiedG},${simplifiedB})`;
				colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
			}
		}

		const sortedColors = Object.entries(colorMap)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([color]) => {
				const rgbValues = color.match(/\d+/g);
				if (rgbValues && rgbValues.length === 3) {
					const r = parseInt(rgbValues[0]);
					const g = parseInt(rgbValues[1]);
					const b = parseInt(rgbValues[2]);
					return `#${((1 << 24) | (r << 16) | (g << 8) | b)
						.toString(16)
						.slice(1)}`;
				}
				return "#000000";
			});

		return sortedColors;
	};

	const savePalette = () => {
		if (paletteName.trim() === "") return;

		const newPalette = {
			name: paletteName,
			colors: [...currentPalette],
		};

		setSavedPalettes([...savedPalettes, newPalette]);
		setPaletteName("My Palette");
	};

	const copyToClipboard = (color: string) => {
		navigator.clipboard
			.writeText(formatColor(color))
			.then(() => {
				setCopiedColor(color);
				setTimeout(() => {
					setCopiedColor(null);
				}, 2000);
			})
			.catch((err) => console.error("Failed to copy: ", err));
	};

	const exportPalette = () => {
		const paletteData = currentPalette.map((color) => {
			const hex = color;
			const { r, g, b } = hexToRgb(color);
			const { c, m, y, k } = rgbToCmyk(r, g, b);

			return {
				hex,
				rgb: `rgb(${r}, ${g}, ${b})`,
				cmyk: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`,
			};
		});

		const jsonString = JSON.stringify(paletteData, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `${paletteName.replace(/\s+/g, "_")}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const updatePickerColor = () => {
		const newColor = hslToHex(hue, saturation, brightness);
		setPickerColor(newColor);
	};

	useEffect(() => {
		updatePickerColor();
	}, [hue, saturation, brightness]);

	const addPickedColor = () => {
		setSelectedColor(pickerColor);
		setIsColorPickerOpen(false);
	};

	const isColorLight = (color: string): boolean => {
		const { r, g, b } = hexToRgb(color);

		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5;
	};

	const getContrastColor = (color: string): string => {
		return isColorLight(color) ? "#000000" : "#FFFFFF";
	};

	const deletePalette = (index: number) => {
		const updatedPalettes = [...savedPalettes];
		updatedPalettes.splice(index, 1);
		setSavedPalettes(updatedPalettes);
	};

	const selectHistoryColor = (color: string) => {
		setSelectedColor(color);

		const { h, s, l } = hexToHSL(color);
		setHue(h);
		setSaturation(s);
		setBrightness(l);
	};

	const activateColorDropper = () => {
		if (uploadedImage) {
			setIsColorDropperActive(!isColorDropperActive);
		}
	};

	const harmonyDescriptions: { [key: string]: string } = {
		monochromatic:
			"Variations of a single color with different shades and tints",
		analogous: "Colors that are adjacent to each other on the color wheel",
		complementary: "Colors that are opposite each other on the color wheel",
		triadic: "Three colors that are evenly spaced around the color wheel",
		tetradic: "Four colors that form a rectangle on the color wheel",
	};

	return (
		<div className={`min-h-screen bg-slate-100 ${montserrat.className}`}>
			<Head>
				<title>ChromaSync - Intelligent Palette Generator</title>
				<meta
					name="description"
					content="Create, explore, and export beautiful color palettes powered by color theory"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="container mx-auto px-4 py-8 md:py-12">
				<motion.header
					className="mb-10 text-center"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3 relative inline-block">
						ChromaSync
						<motion.span
							className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
							initial={{ width: 0 }}
							animate={{ width: "100%" }}
							transition={{ delay: 0.5, duration: 0.6 }}
						/>
					</h1>
					<p className="text-slate-600 text-lg mb-6">
						Intelligent Palette Generator
					</p>
					<motion.div
						className="max-w-2xl mx-auto bg-white rounded-lg p-6 border border-slate-200 shadow-md transition-all duration-300 hover:shadow-lg"
						whileHover={{ scale: 1.02 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<AnimatePresence mode="wait">
							<motion.p
								key={quoteIndex}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3 }}
								className="text-slate-700 italic text-center text-lg"
							>
								"{inspirationalQuotes[quoteIndex]}"
							</motion.p>
						</AnimatePresence>
					</motion.div>
				</motion.header>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<motion.div
						className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.4 }}
					>
						<h2 className="text-xl font-semibold mb-5 text-slate-800 border-b pb-2 border-slate-200">
							Palette Options
						</h2>

						<div className="mb-6">
							<label className="block text-slate-700 text-sm font-bold mb-3">
								Base Color
							</label>
							<div className="flex items-center">
								<motion.div
									whileHover={{ scale: 1.1 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
									className="relative"
								>
									<input
										type="color"
										value={selectedColor}
										onChange={(e) => setSelectedColor(e.target.value)}
										className="h-12 w-28 rounded-md border border-slate-300 cursor-pointer transition-transform duration-200 hover:scale-105"
									/>
									<span className="absolute -top-1 -right-1 h-4 w-4 bg-white rounded-full shadow-sm flex items-center justify-center text-xs text-blue-600">
										<motion.span
											animate={{ rotate: [0, 360] }}
											transition={{
												repeat: Infinity,
												duration: 4,
												ease: "linear",
											}}
										>
											⟳
										</motion.span>
									</span>
								</motion.div>
								<span className="ml-4 text-slate-700 font-medium px-3 py-2 bg-slate-100 rounded-md">
									{formatColor(selectedColor)}
								</span>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-slate-700 text-sm font-bold mb-3">
								Color Harmony
							</label>
							<select
								value={paletteType}
								onChange={(e) => setPaletteType(e.target.value)}
								className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer transition-shadow duration-200 hover:shadow-md"
							>
								<option value="monochromatic">Monochromatic</option>
								<option value="analogous">Analogous</option>
								<option value="complementary">Complementary</option>
								<option value="triadic">Triadic</option>
								<option value="tetradic">Tetradic</option>
							</select>
							{paletteType && (
								<motion.p
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									transition={{ duration: 0.3 }}
									className="mt-2 text-sm text-slate-600 italic"
								>
									{harmonyDescriptions[paletteType]}
								</motion.p>
							)}
						</div>

						<div className="mb-6">
							<label className="block text-slate-700 text-sm font-bold mb-3">
								Color Picker
							</label>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
								className="bg-blue-500 text-white font-bold py-3 px-5 rounded-md transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer w-full shadow-sm hover:shadow-md"
							>
								{isColorPickerOpen ? "Close Picker" : "Open Color Picker"}
							</motion.button>

							<AnimatePresence>
								{isColorPickerOpen && (
									<motion.div
										ref={colorPickerRef}
										initial={{ opacity: 0, height: 0, overflow: "hidden" }}
										animate={{
											opacity: 1,
											height: "auto",
											overflow: "visible",
										}}
										exit={{ opacity: 0, height: 0, overflow: "hidden" }}
										transition={{ duration: 0.3 }}
										className="mt-4 p-5 border border-slate-300 rounded-lg bg-white shadow-lg"
									>
										<div className="flex mb-3 border-b pb-3">
											<button
												className={`mr-3 px-3 py-1 rounded-md ${
													activeTab === "picker"
														? "bg-blue-500 text-white"
														: "bg-slate-100 text-slate-700"
												}`}
												onClick={() => setActiveTab("picker")}
											>
												Advanced Picker
											</button>
											<button
												className={`px-3 py-1 rounded-md ${
													activeTab === "history"
														? "bg-blue-500 text-white"
														: "bg-slate-100 text-slate-700"
												}`}
												onClick={() => setActiveTab("history")}
											>
												History
											</button>
										</div>

										{activeTab === "picker" ? (
											<>
												<motion.div
													className="w-full h-32 mb-4 rounded-lg shadow-inner relative overflow-hidden"
													whileHover={{ scale: 1.02 }}
													transition={{
														type: "spring",
														stiffness: 400,
														damping: 10,
													}}
													style={{ backgroundColor: pickerColor }}
												>
													<div className="absolute inset-0 bg-gradient-to-r from-white/0 to-black/30"></div>
												</motion.div>

												<div className="mb-4 relative">
													<label
														className="block text-slate-700 text-sm font-bold mb-2 flex justify-between"
														onMouseEnter={() => setTooltipVisible("hue")}
														onMouseLeave={() => setTooltipVisible(null)}
													>
														<span>Hue</span> <span>{hue}°</span>
													</label>
													{tooltipVisible === "hue" && (
														<div className="absolute right-0 -top-10 bg-black text-white text-xs px-2 py-1 rounded z-10">
															Choose the base color shade
														</div>
													)}
													<motion.input
														type="range"
														min="0"
														max="359"
														value={hue}
														onChange={(e) => setHue(parseInt(e.target.value))}
														className="w-full cursor-pointer"
														whileHover={{ scale: 1.03 }}
														style={{
															background: `linear-gradient(to right, 
																#ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
														}}
													/>
												</div>

												<div className="mb-4 relative">
													<label
														className="block text-slate-700 text-sm font-bold mb-2 flex justify-between"
														onMouseEnter={() => setTooltipVisible("saturation")}
														onMouseLeave={() => setTooltipVisible(null)}
													>
														<span>Saturation</span> <span>{saturation}%</span>
													</label>
													{tooltipVisible === "saturation" && (
														<div className="absolute right-0 -top-10 bg-black text-white text-xs px-2 py-1 rounded z-10">
															Control color intensity
														</div>
													)}
													<motion.input
														type="range"
														min="0"
														max="100"
														value={saturation}
														onChange={(e) =>
															setSaturation(parseInt(e.target.value))
														}
														className="w-full cursor-pointer"
														whileHover={{ scale: 1.03 }}
														style={{
															background: `linear-gradient(to right, 
																${hslToHex(hue, 0, brightness)}, 
																${hslToHex(hue, 100, brightness)})`,
														}}
													/>
												</div>

												<div className="mb-4 relative">
													<label
														className="block text-slate-700 text-sm font-bold mb-2 flex justify-between"
														onMouseEnter={() => setTooltipVisible("brightness")}
														onMouseLeave={() => setTooltipVisible(null)}
													>
														<span>Brightness</span> <span>{brightness}%</span>
													</label>
													{tooltipVisible === "brightness" && (
														<div className="absolute right-0 -top-10 bg-black text-white text-xs px-2 py-1 rounded z-10">
															Adjust lightness/darkness
														</div>
													)}
													<motion.input
														type="range"
														min="0"
														max="100"
														value={brightness}
														onChange={(e) =>
															setBrightness(parseInt(e.target.value))
														}
														className="w-full cursor-pointer"
														whileHover={{ scale: 1.03 }}
														style={{
															background: `linear-gradient(to right, #000000, 
																${hslToHex(hue, saturation, 50)})`,
														}}
													/>
												</div>

												<div className="flex justify-between mt-5">
													<span className="text-slate-700 font-medium px-3 py-2 bg-slate-100 rounded-md">
														{formatColor(pickerColor)}
													</span>
													<motion.button
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														onClick={addPickedColor}
														className="bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 hover:bg-green-600 cursor-pointer"
													>
														Use This Color
													</motion.button>
												</div>
											</>
										) : (
											<div className="grid grid-cols-5 gap-3">
												{colorHistory.length > 0 ? (
													colorHistory.map((color, index) => (
														<motion.div
															key={index}
															whileHover={{ scale: 1.15, rotate: 5 }}
															whileTap={{ scale: 0.95 }}
															className="w-12 h-12 rounded-md cursor-pointer shadow-sm"
															style={{ backgroundColor: color }}
															onClick={() => selectHistoryColor(color)}
															title={color}
														/>
													))
												) : (
													<p className="col-span-5 text-center text-slate-500 italic py-4">
														No color history yet
													</p>
												)}
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<div className="mb-6">
							<label className="block text-slate-700 text-sm font-bold mb-3">
								Extract Colors from Image
							</label>
							<div className="grid grid-cols-2 gap-3">
								<motion.button
									whileHover={{ scale: 1.04 }}
									whileTap={{ scale: 0.96 }}
									onClick={() => fileInputRef.current?.click()}
									className="bg-purple-600 text-white font-bold py-3 px-5 rounded-md transition-all duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer shadow-sm hover:shadow-md"
								>
									Upload Image
								</motion.button>

								{uploadedImage && (
									<motion.button
										whileHover={{ scale: 1.04, backgroundColor: "#f43f5e" }}
										whileTap={{ scale: 0.96 }}
										onClick={removeUploadedImage}
										className="bg-red-500 text-white font-bold py-3 px-5 rounded-md transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer shadow-sm hover:shadow-md"
									>
										Remove Image
									</motion.button>
								)}
							</div>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
							{uploadedImage && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`w-full mt-3 px-4 py-2 rounded-md ${
										isColorDropperActive
											? "bg-green-100 text-green-800 border-2 border-green-500"
											: "bg-slate-100 text-slate-700 border border-slate-300"
									}`}
									onClick={activateColorDropper}
								>
									{isColorDropperActive
										? "Click on image to pick a color (click again to cancel)"
										: "Pick Color from Image"}
								</motion.button>
							)}
							<p className="mt-2 text-sm text-slate-600 italic">
								Upload an image to extract a palette from its dominant colors
							</p>
						</div>

						<div className="mb-6">
							<label className="block text-slate-700 text-sm font-bold mb-3">
								Color Format
							</label>
							<select
								value={colorFormat}
								onChange={(e) => setColorFormat(e.target.value)}
								className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer transition-shadow duration-200 hover:shadow-md"
							>
								<option value="hex">HEX</option>
								<option value="rgb">RGB</option>
								<option value="cmyk">CMYK</option>
							</select>
						</div>
					</motion.div>

					<motion.div
						className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1, duration: 0.4 }}
					>
						<h2 className="text-xl font-semibold mb-5 text-slate-800 border-b pb-2 border-slate-200">
							Current Palette
						</h2>

						{uploadedImage && (
							<div className="mb-6">
								<h3 className="text-lg font-medium mb-3 text-slate-700">
									Source Image
								</h3>
								<div className="relative overflow-hidden rounded-lg shadow-md">
									{imageLoading ? (
										<div className="w-full h-48 bg-slate-200 animate-pulse flex items-center justify-center">
											<span className="text-slate-500">Loading image...</span>
										</div>
									) : (
										<>
											<canvas ref={canvasRef} className="hidden" />
											<motion.img
												ref={imageRef}
												src={uploadedImage}
												alt="Uploaded source image"
												className={`w-full h-48 object-cover transition-all duration-300 ${
													isColorDropperActive
														? "cursor-crosshair"
														: "cursor-default hover:scale-105"
												}`}
												whileHover={{ scale: isColorDropperActive ? 1 : 1.05 }}
												drag={!isColorDropperActive}
												dragConstraints={{
													left: 0,
													right: 0,
													top: 0,
													bottom: 0,
												}}
												dragElastic={0.1}
											/>
											{isColorDropperActive && (
												<div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
													<span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-black">
														Click to pick a color
													</span>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						)}

						<div className="mb-8">
							<div className="grid grid-cols-1 gap-4">
								<AnimatePresence>
									{currentPalette.map((color, index) => (
										<motion.div
											key={color + index}
											className="flex items-center group"
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.1, duration: 0.3 }}
											exit={{ opacity: 0, x: 10 }}
											layout
										>
											<motion.div
												className="w-20 h-20 rounded-lg mr-4 cursor-pointer border border-slate-200 shadow-sm group-hover:shadow-md"
												style={{ backgroundColor: color }}
												onClick={() => copyToClipboard(color)}
												title="Click to copy"
												whileHover={{
													scale: 1.1,
													rotate: 5,
													boxShadow:
														"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
												}}
												whileTap={{ scale: 0.9 }}
											></motion.div>
											<div className="flex-1">
												<motion.div
													className="font-medium p-3 rounded-md group-hover:shadow-md"
													style={{
														backgroundColor: color,
														color: getContrastColor(color),
													}}
													onClick={() => copyToClipboard(color)}
													title="Click to copy"
													role="button"
													whileHover={{ scale: 1.03 }}
													whileTap={{ scale: 0.97 }}
												>
													{formatColor(color)}
													<AnimatePresence>
														{copiedColor === color && (
															<motion.span
																initial={{ opacity: 0, scale: 0.5 }}
																animate={{ opacity: 1, scale: 1 }}
																exit={{ opacity: 0, scale: 0.5 }}
																className="ml-2 text-sm bg-white bg-opacity-80 text-green-700 px-2 py-1 rounded-full"
															>
																Copied!
															</motion.span>
														)}
													</AnimatePresence>
												</motion.div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-slate-700 text-sm font-bold mb-3">
								Palette Name
							</label>
							<input
								type="text"
								value={paletteName}
								onChange={(e) => setPaletteName(e.target.value)}
								className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 transition-shadow duration-200 hover:shadow-inner"
								placeholder="My Awesome Palette"
							/>
						</div>

						<div className="flex space-x-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={savePalette}
								className="bg-green-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer flex-1 shadow-sm hover:shadow-md"
							>
								Save Palette
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={exportPalette}
								className="bg-blue-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer flex-1 shadow-sm hover:shadow-md"
							>
								Export
							</motion.button>
						</div>

						<motion.div
							className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.4 }}
							whileHover={{
								backgroundColor: "#f8fafc",
								boxShadow:
									"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
							}}
						>
							<p className="text-sm text-slate-600">
								<strong>Tip:</strong> Click on any color or color code to copy
								it to your clipboard in your selected format.
							</p>
						</motion.div>
					</motion.div>

					<motion.div
						className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						<h2 className="text-xl font-semibold mb-5 text-slate-800 border-b pb-2 border-slate-200">
							Saved Palettes
						</h2>

						{savedPalettes.length === 0 ? (
							<motion.div
								className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.5 }}
								whileHover={{ borderColor: "#94a3b8" }}
							>
								<p className="text-slate-500 mb-4">
									No saved palettes yet. Create and save your first palette!
								</p>
								<motion.svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-16 w-16 mx-auto text-slate-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									animate={{
										rotate: [0, 5, 0, -5, 0],
										scale: [1, 1.05, 1, 1.05, 1],
									}}
									transition={{
										repeat: Infinity,
										repeatType: "reverse",
										duration: 5,
									}}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1}
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
									/>
								</motion.svg>
							</motion.div>
						) : (
							<div className="space-y-6">
								<AnimatePresence>
									{savedPalettes.map((palette, index) => (
										<motion.div
											key={palette.name + index}
											className="border border-slate-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1, duration: 0.3 }}
											exit={{ opacity: 0, x: -100 }}
											whileHover={{
												y: -5,
												boxShadow:
													"0 12px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)",
											}}
											layout
										>
											<div className="flex justify-between items-start mb-3">
												<h3 className="font-medium text-slate-700">
													{palette.name}
												</h3>
												<div className="flex space-x-2">
													<motion.button
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
														onClick={() => setCurrentPalette(palette.colors)}
														className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm py-1 px-3 rounded-md transition-colors duration-200 cursor-pointer"
														title="Load palette"
													>
														Load
													</motion.button>
													<motion.button
														whileHover={{
															scale: 1.1,
															backgroundColor: "#fee2e2",
														}}
														whileTap={{ scale: 0.9 }}
														onClick={() => deletePalette(index)}
														className="bg-red-100 hover:bg-red-200 text-red-700 text-sm py-1 px-3 rounded-md transition-colors duration-200 cursor-pointer"
														title="Delete palette"
													>
														Delete
													</motion.button>
												</div>
											</div>
											<motion.div
												className="flex h-12 rounded-md overflow-hidden shadow-sm mb-2"
												whileHover={{ height: "3.5rem" }}
												transition={{ duration: 0.2 }}
											>
												{palette.colors.map((color, colorIndex) => (
													<motion.div
														key={colorIndex}
														className="h-12 flex-1 cursor-pointer"
														style={{ backgroundColor: color }}
														title={formatColor(color)}
														onClick={() => copyToClipboard(color)}
														whileHover={{ transform: "scaleY(1.1)" }}
														whileTap={{ scaleY: 0.9 }}
														transition={{ duration: 0.1 }}
													></motion.div>
												))}
											</motion.div>
											<div className="grid grid-cols-5 gap-1 mt-2">
												{palette.colors.map((color, colorIndex) => (
													<motion.div
														key={colorIndex}
														className="text-xs text-center p-1 rounded"
														style={{
															backgroundColor: `${color}20`,
															color: isColorLight(color) ? "#555" : "#eee",
														}}
														whileHover={{ backgroundColor: `${color}40` }}
													>
														{color.substring(1, 7)}
													</motion.div>
												))}
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						)}
						<motion.div
							className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7, duration: 0.4 }}
							whileHover={{
								backgroundColor: "#f8fafc",
								boxShadow:
									"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
							}}
						>
							<h3 className="font-medium text-slate-700 mb-2">Palette Tips</h3>
							<ul className="text-sm text-slate-600 space-y-2">
								<li>• Use complementary colors for high contrast</li>
								<li>• Analogous palettes create harmony and are pleasing</li>
								<li>
									• Use the 60-30-10 rule: 60% primary, 30% secondary, 10%
									accent
								</li>
								<li>• Consider color psychology for your projects</li>
							</ul>
						</motion.div>
					</motion.div>
				</div>

				<motion.footer
					className="mt-16 text-center text-slate-600 border-t border-slate-200 pt-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8, duration: 0.6 }}
				>
					<p className="font-medium text-lg">
						ChromaSync - Intelligent Palette Generator &copy;{" "}
						{new Date().getFullYear()}
					</p>
					<p className="mt-2">
						Design beautiful color schemes with the power of color theory
					</p>
					<div className="max-w-lg mx-auto mt-4 flex justify-center space-x-6 text-slate-500">
						<motion.span
							className="cursor-pointer hover:text-slate-700 transition-colors duration-200"
							whileHover={{ scale: 1.1 }}
						>
							Help
						</motion.span>
						<motion.span
							className="cursor-pointer hover:text-slate-700 transition-colors duration-200"
							whileHover={{ scale: 1.1 }}
						>
							About
						</motion.span>
						<motion.span
							className="cursor-pointer hover:text-slate-700 transition-colors duration-200"
							whileHover={{ scale: 1.1 }}
						>
							Privacy
						</motion.span>
						<motion.span
							className="cursor-pointer hover:text-slate-700 transition-colors duration-200"
							whileHover={{ scale: 1.1 }}
						>
							Terms
						</motion.span>
					</div>
				</motion.footer>
			</main>
		</div>
	);
}
