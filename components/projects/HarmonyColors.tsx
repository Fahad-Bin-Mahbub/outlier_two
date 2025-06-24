"use client";
import { useState, useEffect } from "react";
import {
	RefreshCw,
	Download,
	Heart,
	Trash2,
	Copy,
	Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const generateComplePaletteFxn = (baseColor) => {
	const hsl = hexToHSLConverter(baseColor);
	const complement = { ...hsl, h: (hsl.h + 180) % 360 };
	const lighter1 = { ...hsl, l: Math.min(hsl.l + 20, 95) };
	const lighter2 = { ...hsl, l: Math.min(hsl.l + 40, 95) };
	const darker = { ...hsl, l: Math.max(hsl.l - 20, 5) };

	return [
		baseColor,
		HSLToHexConverter(complement),
		HSLToHexConverter(lighter1),
		HSLToHexConverter(lighter2),
		HSLToHexConverter(darker),
	];
};

const generateAnalogousPaletteFxn = (baseColor) => {
	const hsl = hexToHSLConverter(baseColor);
	const analog1 = { ...hsl, h: (hsl.h + 30) % 360 };
	const analog2 = { ...hsl, h: (hsl.h + 60) % 360 };
	const analog3 = { ...hsl, h: (hsl.h - 30 + 360) % 360 };
	const analog4 = { ...hsl, h: (hsl.h - 60 + 360) % 360 };

	return [
		baseColor,
		HSLToHexConverter(analog1),
		HSLToHexConverter(analog2),
		HSLToHexConverter(analog3),
		HSLToHexConverter(analog4),
	];
};

const generateTriadicPalette = (baseColor) => {
	const hsl = hexToHSLConverter(baseColor);
	const triad1 = { ...hsl, h: (hsl.h + 120) % 360 };
	const triad2 = { ...hsl, h: (hsl.h + 240) % 360 };
	const lighter = { ...hsl, l: Math.min(hsl.l + 30, 95) };
	const darker = { ...hsl, l: Math.max(hsl.l - 30, 5) };

	return [
		baseColor,
		HSLToHexConverter(triad1),
		HSLToHexConverter(triad2),
		HSLToHexConverter(lighter),
		HSLToHexConverter(darker),
	];
};

const generateMonochromaticPalette = (baseColor) => {
	const hsl = hexToHSLConverter(baseColor);
	const lighter1 = { ...hsl, l: Math.min(hsl.l + 15, 95) };
	const lighter2 = { ...hsl, l: Math.min(hsl.l + 30, 95) };
	const darker1 = { ...hsl, l: Math.max(hsl.l - 15, 5) };
	const darker2 = { ...hsl, l: Math.max(hsl.l - 30, 5) };

	return [
		baseColor,
		HSLToHexConverter(lighter1),
		HSLToHexConverter(lighter2),
		HSLToHexConverter(darker1),
		HSLToHexConverter(darker2),
	];
};

function hexToHSLConverter(hex) {
	hex = hex.replace(/^#/, "");
	let r = parseInt(hex.substring(0, 2), 16) / 255;
	let g = parseInt(hex.substring(2, 4), 16) / 255;
	let b = parseInt(hex.substring(4, 6), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h,
		s,
		l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
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
		h = Math.round(h * 60);
	}

	s = Math.round(s * 100);
	l = Math.round(l * 100);

	return { h, s, l };
}

const HSLToHexConverter = (hsl) => {
	const { h, s, l } = hsl;
	const sPct = s / 100;
	const lPct = l / 100;

	const c = (1 - Math.abs(2 * lPct - 1)) * sPct;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = lPct - c / 2;

	let r, g, b;

	if (0 <= h && h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (60 <= h && h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (120 <= h && h < 180) {
		[r, g, b] = [0, c, x];
	} else if (180 <= h && h < 240) {
		[r, g, b] = [0, x, c];
	} else if (240 <= h && h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	const toHex = (v) => {
		const hex = Math.round((v + m) * 255).toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const getRandomColorFxn = () => {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

const getContrastRatioFxn = (color1, color2) => {
	const lum1 = getLuminance(color1);
	const lum2 = getLuminance(color2);
	return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
};

const getLuminance = (hex) => {
	const rgb = hexToRGBConverter(hex);
	const [r, g, b] = rgb.map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const hexToRGBConverter = (hex) => {
	hex = hex.replace(/^#/, "");
	return [
		parseInt(hex.substring(0, 2), 16),
		parseInt(hex.substring(2, 4), 16),
		parseInt(hex.substring(4, 6), 16),
	];
};

const linearGradientGenrator = (colors, angle = 90) => {
	return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
};

export default function HarmonyColorsExport() {
	const [baseColor, setBaseColor] = useState("#4A90E2");
	const [hsl, setHsl] = useState(hexToHSLConverter(baseColor));
	const [opacity, setOpacity] = useState(100);
	const [colorMode, setColorMode] = useState("complementary");
	const [palette, setPalette] = useState([]);
	const [savedPalettes, setSavedPalettes] = useState([]);
	const [previewMode, setPreviewMode] = useState("buttons");
	const [gradientColors, setGradientColors] = useState([baseColor, "#ffffff"]);
	const [gradientAngle, setGradientAngle] = useState(90);
	const [paletteName, setPaletteName] = useState("");
	const [useGradientPreview, setUseGradientPreview] = useState(false);
	const [showExportMenu, setShowExportMenu] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (showExportMenu && !event.target.closest(".export-button-container")) {
				setShowExportMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showExportMenu]);

	useEffect(() => {
		paletteGenerator();
		const saved = localStorage.getItem("savedPalettes");
		if (saved) {
			try {
				setSavedPalettes(JSON.parse(saved));
			} catch (e) {
				console.error("Error loading saved palettes");
			}
		}
	}, []);

	useEffect(() => {
		paletteGenerator();
		setHsl(hexToHSLConverter(baseColor));
	}, [baseColor, colorMode]);

	const paletteGenerator = () => {
		let newPalette;
		switch (colorMode) {
			case "complementary":
				newPalette = generateComplePaletteFxn(baseColor);
				break;
			case "analogous":
				newPalette = generateAnalogousPaletteFxn(baseColor);
				break;
			case "triadic":
				newPalette = generateTriadicPalette(baseColor);
				break;
			default:
				newPalette = generateMonochromaticPalette(baseColor);
		}
		setPalette(newPalette);
		setGradientColors([newPalette[0], newPalette[1]]);
	};

	const randomcolorHandler = () => {
		const newColor = getRandomColorFxn();
		setBaseColor(newColor);
		setOpacity(100);
	};

	const handleHSLChange = (key, value) => {
		const newHsl = { ...hsl, [key]: value };
		setHsl(newHsl);
		setBaseColor(HSLToHexConverter(newHsl));
	};

	const handleRandomGradientColors = () => {
		const color1 = getRandomColorFxn();
		const color2 = getRandomColorFxn();
		setGradientColors([color1, color2]);
	};

	const savePalette = () => {
		if (!paletteName) {
			alert("Please enter a palette name.");
			return;
		}
		const newSavedPalettes = [
			...savedPalettes,
			{
				id: Date.now(),
				name: paletteName,
				colors: palette,
				mode: colorMode,
			},
		];
		setSavedPalettes(newSavedPalettes);
		localStorage.setItem("savedPalettes", JSON.stringify(newSavedPalettes));
		setPaletteName("");
	};

	const deletePalette = (id) => {
		const filteredPalettes = savedPalettes.filter((p) => p.id !== id);
		setSavedPalettes(filteredPalettes);
		localStorage.setItem("savedPalettes", JSON.stringify(filteredPalettes));
	};

	const copyToClipboardControler = (format) => {
		let textToCopy = "";
		switch (format) {
			case "css":
				textToCopy = palette
					.map((color, index) => `--color-${index + 1}: ${color};`)
					.join("\n");
				break;
			case "scss":
				textToCopy = palette
					.map((color, index) => `$color-${index + 1}: ${color};`)
					.join("\n");
				break;
			case "json":
				textToCopy = JSON.stringify(palette, null, 2);
				break;
			case "gradient":
				textToCopy = linearGradientGenrator(gradientColors, gradientAngle);
				break;
			default:
				textToCopy = palette.join(", ");
		}
		navigator.clipboard
			.writeText(textToCopy)
			.then(() =>
				alert(`Copied to clipboard in ${format.toUpperCase()} format!`)
			)
			.catch((err) => console.error("Failed to copy: ", err));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
			<header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md py-4 shadow-lg">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center space-x-3">
						<Palette size={24} className="text-blue-400" />
						<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
							Color Harmony
						</h1>
					</div>
					<p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
						Craft stunning color palettes here only
					</p>
				</div>
			</header>

			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
				>
					<div className="space-y-8">
						{}
						<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
							<h2 className="text-lg sm:text-xl font-semibold mb-6">
								Color Controls
							</h2>
							<div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
								<div className="w-full sm:w-auto">
									<label className="block text-xs sm:text-sm font-medium mb-2">
										Base Color
									</label>
									<div className="flex items-center space-x-3">
										<input
											type="color"
											value={
												baseColor.startsWith("rgba")
													? HSLToHexConverter(hsl)
													: baseColor
											}
											onChange={(e) => {
												setBaseColor(e.target.value);
											}}
											className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg cursor-pointer"
										/>
										<span className="font-mono text-xs sm:text-sm">
											{baseColor}
										</span>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={randomcolorHandler}
											className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer"
											title="Generate random color"
										>
											<RefreshCw size={16} className="sm:size-5" />
										</motion.button>
									</div>
								</div>
								<div className="w-full sm:w-auto">
									<label className="block text-xs sm:text-sm font-medium mb-2">
										Harmony Type
									</label>
									<select
										value={colorMode}
										onChange={(e) => setColorMode(e.target.value)}
										className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm cursor-pointer"
									>
										<option value="complementary">Complementary</option>
										<option value="analogous">Analogous</option>
										<option value="triadic">Triadic</option>
										<option value="monochromatic">Monochromatic</option>
									</select>
								</div>
							</div>
						</div>

						{}
						<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
							<h2 className="text-lg sm:text-xl font-semibold mb-6">
								Gradient Generator
							</h2>
							<div className="flex flex-wrap items-center gap-4 mb-6">
								{gradientColors.map((color, index) => (
									<div key={index}>
										<label className="block text-xs sm:text-sm mb-2">
											Color {index + 1}
										</label>
										<input
											type="color"
											value={color}
											onChange={(e) => {
												const newColors = [...gradientColors];
												newColors[index] = e.target.value;
												setGradientColors(newColors);
											}}
											className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg cursor-pointer"
										/>
									</div>
								))}
								<div>
									<label className="block text-xs sm:text-sm mb-2">
										Angle: {gradientAngle}°
									</label>
									<input
										type="range"
										min="0"
										max="360"
										value={gradientAngle}
										onChange={(e) => setGradientAngle(parseInt(e.target.value))}
										className="w-24 sm:w-32 cursor-pointer"
									/>
								</div>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={handleRandomGradientColors}
									className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer"
									title="Generate random gradient colors"
								>
									<RefreshCw size={16} className="sm:size-5" />
								</motion.button>
							</div>
							<div
								className="h-24 sm:h-32 rounded-lg shadow-lg w-full"
								style={{
									background: linearGradientGenrator(
										gradientColors,
										gradientAngle
									),
								}}
							></div>
						</div>

						{}
						<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
							<h2 className="text-lg sm:text-xl font-semibold mb-6">
								Fine-Tune Color
							</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-xs sm:text-sm mb-1">
										Hue: {hsl.h}°
									</label>
									<input
										type="range"
										min="0"
										max="360"
										value={hsl.h}
										onChange={(e) =>
											handleHSLChange("h", parseInt(e.target.value))
										}
										className="w-full cursor-pointer"
									/>
								</div>
								<div>
									<label className="block text-xs sm:text-sm mb-1">
										Saturation: {hsl.s}%
									</label>
									<input
										type="range"
										min="0"
										max="100"
										value={hsl.s}
										onChange={(e) =>
											handleHSLChange("s", parseInt(e.target.value))
										}
										className="w-full cursor-pointer"
									/>
								</div>
								<div>
									<label className="block text-xs sm:text-sm mb-1">
										Lightness: {hsl.l}%
									</label>
									<input
										type="range"
										min="0"
										max="100"
										value={hsl.l}
										onChange={(e) =>
											handleHSLChange("l", parseInt(e.target.value))
										}
										className="w-full cursor-pointer"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-8">
						{}
						<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
							<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
								<h2 className="text-lg sm:text-xl font-semibold">Preview</h2>
								<div className="flex items-center space-x-2">
									<span className="text-xs sm:text-sm">
										{useGradientPreview ? "Gradient" : "Color"}
									</span>
									<button
										onClick={() => setUseGradientPreview(!useGradientPreview)}
										className={`relative inline-flex h-5 sm:h-6 w-10 sm:w-11 items-center rounded-full transition-colors cursor-pointer ${
											useGradientPreview ? "bg-blue-600" : "bg-gray-700"
										}`}
									>
										<span
											className={`inline-block h-3 sm:h-4 w-3 sm:w-4 transform rounded-full bg-white transition-transform ${
												useGradientPreview
													? "translate-x-5 sm:translate-x-5"
													: "translate-x-1"
											}`}
										/>
									</button>
								</div>
							</div>
							<div className="flex flex-wrap gap-4 mb-6">
								{["buttons", "card", "form"].map((mode) => (
									<motion.button
										key={mode}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => setPreviewMode(mode)}
										className={`px-4 py-2 rounded-lg text-xs sm:text-sm cursor-pointer ${
											previewMode === mode
												? "bg-blue-600 text-white"
												: "bg-gray-700 text-gray-300"
										}`}
									>
										{mode.charAt(0).toUpperCase() + mode.slice(1)}
									</motion.button>
								))}
							</div>

							<AnimatePresence mode="wait">
								{previewMode === "buttons" && (
									<motion.div
										key="buttons"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="p-6 bg-gray-700/50 rounded-lg"
									>
										<div className="flex flex-wrap gap-4">
											{palette.map((color, index) => (
												<motion.button
													key={index}
													whileHover={{ scale: 1.1 }}
													style={{
														background: useGradientPreview
															? linearGradientGenrator(
																	gradientColors,
																	gradientAngle
															  )
															: color,
														color: index >= 3 ? "#fff" : "#000",
													}}
													className="px-6 py-3 rounded-lg shadow-lg text-sm cursor-pointer"
												>
													Button {index + 1}
												</motion.button>
											))}
										</div>
									</motion.div>
								)}

								{previewMode === "card" && (
									<motion.div
										key="card"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="p-6 bg-gray-700/50 rounded-lg"
									>
										<div
											className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg mx-auto"
											style={{
												background: useGradientPreview
													? linearGradientGenrator(
															gradientColors,
															gradientAngle
													  )
													: palette[0],
											}}
										>
											<div
												className="h-40"
												style={{
													background: useGradientPreview
														? linearGradientGenrator(
																[gradientColors[1], gradientColors[0]],
																gradientAngle
														  )
														: palette[1],
												}}
											></div>
											<div className="p-6">
												<h3
													className="font-bold text-xl mb-2"
													style={{ color: palette[4] }}
												>
													Card Title
												</h3>
												<p className="text-base" style={{ color: palette[3] }}>
													Lorem ipsum dolor sit amet, consectetur adipiscing
													elit. Vivamus lacinia odio vitae vestibulum.
												</p>
												<motion.button
													whileHover={{ scale: 1.05 }}
													className="mt-4 px-4 py-2 rounded-lg text-sm cursor-pointer"
													style={{
														background: useGradientPreview
															? linearGradientGenrator(
																	gradientColors,
																	gradientAngle
															  )
															: palette[2],
														color: palette[4],
													}}
												>
													Learn More
												</motion.button>
											</div>
										</div>
									</motion.div>
								)}

								{previewMode === "form" && (
									<motion.div
										key="form"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="p-6 bg-gray-700/50 rounded-lg"
									>
										<div
											className="w-full max-w-md rounded-lg shadow-lg mx-auto p-6"
											style={{
												background: useGradientPreview
													? linearGradientGenrator(
															gradientColors,
															gradientAngle
													  )
													: palette[0],
											}}
										>
											<h3
												className="font-bold text-xl mb-4"
												style={{ color: palette[4] }}
											>
												Contact Form
											</h3>
											<div className="mb-4">
												<label
													className="block mb-1 text-sm"
													style={{ color: palette[3] }}
												>
													Name
												</label>
												<input
													type="text"
													className="w-full px-3 py-2 rounded-lg border bg-gray-800/50 text-sm cursor-text"
													style={{ borderColor: palette[2], color: palette[3] }}
												/>
											</div>
											<div className="mb-4">
												<label
													className="block mb-1 text-sm"
													style={{ color: palette[3] }}
												>
													Email
												</label>
												<input
													type="email"
													className="w-full px-3 py-2 rounded-lg border bg-gray-800/50 text-sm cursor-text"
													style={{ borderColor: palette[2], color: palette[3] }}
												/>
											</div>
											<motion.button
												whileHover={{ scale: 1.05 }}
												className="w-full px-4 py-2 rounded-lg text-sm cursor-pointer"
												style={{
													background: useGradientPreview
														? linearGradientGenrator(
																gradientColors,
																gradientAngle
														  )
														: palette[1],
													color: "#fff",
												}}
											>
												Submit
											</motion.button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{}
						<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
							<h2 className="text-lg sm:text-xl font-semibold mb-6">
								Generated Palette
							</h2>
							<div className="flex flex-wrap gap-4 mb-6">
								{palette.map((color, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: index * 0.1 }}
										className="flex flex-col items-center"
									>
										<div
											className="h-20 w-20 rounded-lg shadow-lg border border-gray-700/50"
											style={{ backgroundColor: color }}
										></div>
										<span className="text-sm mt-2 font-mono">{color}</span>
										<span className="text-xs text-gray-400">
											Contrast:{" "}
											{getContrastRatioFxn(color, "#ffffff").toFixed(2)}
										</span>
									</motion.div>
								))}
							</div>
							<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={savePalette}
									className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm cursor-pointer"
								>
									<Heart size={16} className="sm:size-5" />
									<span>Save Palette</span>
								</motion.button>
								<input
									type="text"
									placeholder="Palette Name"
									value={paletteName}
									onChange={(e) => setPaletteName(e.target.value)}
									className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto cursor-text"
								/>
								<div
									className="relative export-button-container"
									style={{ zIndex: 999 }}
								>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => setShowExportMenu(!showExportMenu)}
										className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition text-sm w-full sm:w-auto cursor-pointer"
									>
										<Download size={16} className="sm:size-5" />
										<span>Export</span>
									</motion.button>
									{showExportMenu && (
										<>
											<motion.div
												initial={{ opacity: 0, y: 5 }}
												animate={{ opacity: 1, y: 0 }}
												className="absolute left-0 bottom-full w-48 bg-gray-800 rounded-lg shadow-xl"
												style={{
													marginBottom: "8px",
													boxShadow: "0 -10px 25px rgba(0, 0, 0, 0.5)",
													zIndex: 1000,
													position: "absolute",
												}}
											>
												<div className="py-1">
													<button
														onClick={() => {
															copyToClipboardControler("css");
															setShowExportMenu(false);
														}}
														className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
													>
														CSS Variables
													</button>
													<button
														onClick={() => {
															copyToClipboardControler("scss");
															setShowExportMenu(false);
														}}
														className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
													>
														SCSS Variables
													</button>
													<button
														onClick={() => {
															copyToClipboardControler("json");
															setShowExportMenu(false);
														}}
														className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
													>
														JSON
													</button>
													<button
														onClick={() => {
															copyToClipboardControler("gradient");
															setShowExportMenu(false);
														}}
														className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
													>
														Linear Gradient
													</button>
												</div>
											</motion.div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{}
				{savedPalettes.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50 mt-12"
						style={{ position: "relative", zIndex: 10 }}
					>
						<h2 className="text-lg sm:text-xl font-semibold mb-6">
							Saved Palettes
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{savedPalettes.map((savedPalette) => (
								<motion.div
									key={savedPalette.id}
									whileHover={{ y: -5 }}
									className="border border-gray-700/50 rounded-lg p-4 bg-gray-900/50"
								>
									<div className="flex mb-3">
										{savedPalette.colors.map((color, index) => (
											<div
												key={index}
												className="h-10 flex-grow"
												style={{ backgroundColor: color }}
												title={color}
											></div>
										))}
									</div>
									<div className="flex justify-between items-center">
										<div>
											<span className="font-medium text-sm">
												{savedPalette.name}
											</span>
											<span className="block text-xs text-gray-400 capitalize">
												{savedPalette.mode}
											</span>
										</div>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => deletePalette(savedPalette.id)}
											className="text-red-400 hover:text-red-500 cursor-pointer"
										>
											<Trash2 size={16} className="sm:size-5" />
										</motion.button>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</main>

			<footer className="bg-gray-900/80 backdrop-blur-md py-6 mt-12">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<p className="text-gray-400 text-sm">
						Color Harmony - Built with Love for Art and Artists
					</p>
				</div>
			</footer>
		</div>
	);
}
