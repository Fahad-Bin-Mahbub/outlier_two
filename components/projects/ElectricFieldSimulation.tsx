"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	FaBook,
	FaChevronDown,
	FaChevronUp,
	FaEraser,
	FaGripLinesVertical,
	FaHandLizard,
	FaArrowsAlt,
	FaUndoAlt,
	FaRuler,
	FaBullseye,
	FaTrashAlt,
	FaTimes,
	FaBolt,
	FaGithub,
	FaTwitter,
	FaLinkedin,
	FaEnvelope,
	FaSun,
	FaMoon,
	FaQuestion,
	FaCube,
	FaInfoCircle,
	FaPlus,
	FaMinus,
	FaExpand,
	FaAtom,
	FaGraduationCap,
	FaLaptopCode,
	FaUniversity,
	FaLightbulb,
} from "react-icons/fa";

type Vector2 = {
	x: number;
	y: number;
};

type Charge = {
	id: number;
	position: Vector2;
	magnitude: number;
	color: string;
};

interface NavbarProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

interface ChargeInfoDisplayProps {
	charge: Charge;
	mobile?: boolean;
}

const FIELD_LINE_STEP_SIZE = 7.6;
const FIELD_LINE_MAX_STEPS = 140;
const MAX_FIELD_LINE_RADIUS = FIELD_LINE_MAX_STEPS * FIELD_LINE_STEP_SIZE;

const DARK_BG_COLOR = "#121212";
const LIGHT_BG_COLOR = "#f7f9fc";
const BORDER_COLOR_DARK = "rgba(255, 255, 255, 0.3)";
const BORDER_COLOR_LIGHT = "rgba(0, 0, 0, 0.1)";
const GLASS_BORDER_DARK = "rgba(255, 255, 255, 0.2)";
const GLASS_BORDER_LIGHT = "rgba(0, 0, 0, 0.1)";
const BLUE = "#1E88E5";
const BLUE_GLOW = "#4285F4";
const ORANGE = "#FA7B17";
const CHARGE_RADIUS = 18;
const ARROW_COLOR_DARK = "#FFFFFF";
const ARROW_COLOR_LIGHT = "#333333";
const FIELD_LINE_COLOR_DARK = "#4285F4";
const FIELD_LINE_COLOR_LIGHT = "#1a73e8";
const FIELD_DENSITY = 24;
const VECTOR_STEP = 48;
const FIELD_VECTOR_LEN = 32;
const CANVAS_BORDER = 1;

const initialCharges: Charge[] = [];

function distance(a: Vector2, b: Vector2) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

function add(v1: Vector2, v2: Vector2): Vector2 {
	return { x: v1.x + v2.x, y: v1.y + v2.y };
}

function sub(v1: Vector2, v2: Vector2): Vector2 {
	return { x: v1.x - v2.x, y: v1.y - v2.y };
}

function scale(v: Vector2, s: number): Vector2 {
	return { x: v.x * s, y: v.y * s };
}

function norm(v: Vector2): number {
	return Math.hypot(v.x, v.y);
}

function normalize(v: Vector2): Vector2 {
	const n = norm(v);
	if (n === 0) return { x: 0, y: 0 };
	return { x: v.x / n, y: v.y / n };
}

function calcE(p: Vector2, charges: Charge[], k = 9e4): Vector2 {
	let E = { x: 0, y: 0 };
	for (const c of charges) {
		const r = sub(p, c.position);
		const d = Math.max(norm(r), 12);
		const E_mag = (k * c.magnitude) / (d * d);
		const r_n = normalize(r);
		E = add(E, scale(r_n, E_mag));
	}
	return E;
}

function getChargeColor(magnitude: number, isDarkMode: boolean) {
	return magnitude > 0 ? "#0D47A1" : "#E65100";
}

function isMobile() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(max-width: 768px)").matches;
}

function isTablet() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(min-width: 769px) and (max-width: 1024px)")
		.matches;
}

function drawCharge(
	ctx: CanvasRenderingContext2D,
	c: Charge,
	selected = false,
	is2D = true,
	rotation = 0,
	canvasCenter: Vector2,
	isMoving = false,
	isDarkMode = true,
	zoomLevel = 1
) {
	ctx.save();

	let pos = c.position;
	let scale3D = 1;

	if (!is2D) {
		const angle = (rotation * Math.PI) / 180;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		const relativePos = {
			x: pos.x - canvasCenter.x,
			y: pos.y - canvasCenter.y,
		};

		const x3d = relativePos.x * cos - relativePos.y * sin * 0.3;
		const z3d = relativePos.x * sin + relativePos.y * sin * 0.1;
		const y3d = relativePos.y;

		const perspective = 1 + z3d / 800;
		scale3D = Math.max(0.3, Math.min(1.5, 1 - z3d / 800));

		pos = {
			x: canvasCenter.x + x3d / perspective,
			y: canvasCenter.y + y3d / perspective,
		};
	}

	const zoomedPos = {
		x: canvasCenter.x + (pos.x - canvasCenter.x) * zoomLevel,
		y: canvasCenter.y + (pos.y - canvasCenter.y) * zoomLevel,
	};

	const radius = Math.max(5, CHARGE_RADIUS * scale3D * zoomLevel);

	ctx.lineWidth = selected ? 4 : 2;
	ctx.strokeStyle = isMoving
		? "#00FF88"
		: selected
		? isDarkMode
			? "#fff"
			: "#555"
		: isDarkMode
		? "#aaa"
		: "#777";
	ctx.beginPath();
	ctx.arc(zoomedPos.x, zoomedPos.y, radius, 0, 2 * Math.PI);
	ctx.stroke();

	if (selected || isMoving) {
		const glowColor = isMoving
			? "rgba(0, 255, 136, 0.4)"
			: c.magnitude > 0
			? "rgba(66, 133, 244, 0.4)"
			: "rgba(250, 123, 23, 0.4)";
		ctx.shadowColor = glowColor;
		ctx.shadowBlur = 15 * zoomLevel;
	}

	ctx.beginPath();
	ctx.arc(zoomedPos.x, zoomedPos.y, Math.max(2, radius - 3), 0, 2 * Math.PI);
	ctx.fillStyle = c.color;
	ctx.globalAlpha = 0.98 * scale3D;
	ctx.fill();
	ctx.globalAlpha = 1;

	const fontSize = Math.max(8, 15 * scale3D * zoomLevel);
	ctx.font = `bold ${fontSize}px 'Poppins', sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = isDarkMode ? "#fff" : "#fff";
	ctx.strokeStyle = isDarkMode ? "#111" : "#111";
	ctx.lineWidth = 2.5 * zoomLevel;
	ctx.strokeText(c.magnitude > 0 ? "+" : "-", zoomedPos.x, zoomedPos.y);
	ctx.fillText(c.magnitude > 0 ? "+" : "-", zoomedPos.x, zoomedPos.y);

	const labelText = `${Math.abs(c.magnitude).toFixed(2)} µC`;
	const labelFontSize = Math.max(6, 12 * scale3D * zoomLevel);
	ctx.font = `${labelFontSize}px 'Poppins', sans-serif`;

	const textMetrics = ctx.measureText(labelText);
	const textWidth = textMetrics.width;
	const textHeight = labelFontSize;
	const labelY = zoomedPos.y + radius + 16 * zoomLevel;

	ctx.fillStyle = isDarkMode
		? "rgba(0, 0, 0, 0.7)"
		: "rgba(255, 255, 255, 0.85)";
	ctx.fillRect(
		zoomedPos.x - textWidth / 2 - 4,
		labelY - textHeight / 2 - 2,
		textWidth + 8,
		textHeight + 4
	);

	ctx.fillStyle = isDarkMode ? "#fff" : "#333";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(labelText, zoomedPos.x, labelY);
	ctx.restore();
}

function drawFieldVectors(
	ctx: CanvasRenderingContext2D,
	charges: Charge[],
	dims: { width: number; height: number },
	is2D: boolean,
	rotation: number,
	offset: Vector2,
	isDarkMode: boolean,
	zoomLevel = 1
) {
	ctx.save();

	const density = VECTOR_STEP / zoomLevel;
	const canvasCenter = { x: dims.width / 2, y: dims.height / 2 };

	const viewportLeft = -offset.x / zoomLevel;
	const viewportRight = viewportLeft + dims.width / zoomLevel;
	const viewportTop = -offset.y / zoomLevel;
	const viewportBottom = viewportTop + dims.height / zoomLevel;

	const padding = density * 2;
	const startX = Math.floor((viewportLeft - padding) / density) * density;
	const endX = Math.ceil((viewportRight + padding) / density) * density;
	const startY = Math.floor((viewportTop - padding) / density) * density;
	const endY = Math.ceil((viewportBottom + padding) / density) * density;

	for (let x = startX; x < endX; x += density) {
		for (let y = startY; y < endY; y += density) {
			const originalP = { x, y };

			const zoomedP = {
				x: canvasCenter.x + (originalP.x - canvasCenter.x) * zoomLevel,
				y: canvasCenter.y + (originalP.y - canvasCenter.y) * zoomLevel,
			};

			let p = zoomedP;
			let scale3D = 1;

			if (!is2D) {
				const angle = (rotation * Math.PI) / 180;
				const cos = Math.cos(angle);
				const sin = Math.sin(angle);

				const relativePos = {
					x: (originalP.x - canvasCenter.x) * zoomLevel,
					y: (originalP.y - canvasCenter.y) * zoomLevel,
				};

				const x3d = relativePos.x * cos - relativePos.y * sin * 0.3;
				const z3d = relativePos.x * sin + relativePos.y * sin * 0.1;
				const y3d = relativePos.y;

				const perspective = 1 + z3d / 800;
				scale3D = Math.max(0.3, Math.min(1.5, 1 - z3d / 800));

				p = {
					x: canvasCenter.x + x3d / perspective,
					y: canvasCenter.y + y3d / perspective,
				};
			}

			const E = calcE(originalP, charges);
			const mag = norm(E);
			if (mag < 0.2) continue;

			let dir: Vector2 = normalize(E);
			if (!is2D) {
				const angle = (rotation * Math.PI) / 180;
				const cos = Math.cos(angle);
				const sin = Math.sin(angle);

				dir = {
					x: dir.x * cos - dir.y * sin * 0.3,
					y: dir.y * cos + dir.x * sin * 0.2,
				};
				dir = normalize(dir);
			}

			const length =
				Math.min(FIELD_VECTOR_LEN, 17 + 9 * Math.log2(1 + mag)) *
				scale3D *
				zoomLevel;
			drawArrow(ctx, p.x, p.y, p.x + dir.x * length, p.y + dir.y * length, {
				color: isDarkMode ? ARROW_COLOR_DARK : ARROW_COLOR_LIGHT,
				width: Math.max(1, 2 * scale3D * zoomLevel),
			});
		}
	}
	ctx.restore();
}

function drawArrow(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	opts: { color: string; width: number }
) {
	ctx.save();
	ctx.strokeStyle = opts.color;
	ctx.lineWidth = opts.width;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();

	const angle = Math.atan2(y2 - y1, x2 - x1);
	const len = 8 * (opts.width / 2);
	ctx.beginPath();
	ctx.moveTo(x2, y2);
	ctx.lineTo(
		x2 - len * Math.cos(angle - Math.PI / 7),
		y2 - len * Math.sin(angle - Math.PI / 7)
	);
	ctx.lineTo(
		x2 - len * Math.cos(angle + Math.PI / 7),
		y2 - len * Math.sin(angle + Math.PI / 7)
	);
	ctx.lineTo(x2, y2);
	ctx.lineTo(
		x2 - len * Math.cos(angle - Math.PI / 7),
		y2 - len * Math.sin(angle - Math.PI / 7)
	);
	ctx.fillStyle = opts.color;
	ctx.globalAlpha = 0.6;
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.restore();
}

function drawFieldLines(
	ctx: CanvasRenderingContext2D,
	c: Charge,
	charges: Charge[],
	dims: { width: number; height: number },
	is2D: boolean,
	rotation: number,
	offset: Vector2,
	isDarkMode: boolean,
	zoomLevel = 1
) {
	const canvasCenter = { x: dims.width / 2, y: dims.height / 2 };

	const viewportLeft = -offset.x / zoomLevel;
	const viewportRight = viewportLeft + dims.width / zoomLevel;
	const viewportTop = -offset.y / zoomLevel;
	const viewportBottom = viewportTop + dims.height / zoomLevel;

	const padding = MAX_FIELD_LINE_RADIUS;

	const chargeNearViewport =
		c.position.x >= viewportLeft - padding &&
		c.position.x <= viewportRight + padding &&
		c.position.y >= viewportTop - padding &&
		c.position.y <= viewportBottom + padding;

	if (!chargeNearViewport) return;

	const nLines = Math.max(
		12,
		Math.floor(FIELD_DENSITY * Math.abs(c.magnitude))
	);

	for (let i = 0; i < nLines; ++i) {
		const theta = (2 * Math.PI * i) / nLines;
		const start: Vector2 = {
			x: c.position.x + (CHARGE_RADIUS - 2) * Math.cos(theta),
			y: c.position.y + (CHARGE_RADIUS - 2) * Math.sin(theta),
		};
		drawFieldLinePath(
			ctx,
			start,
			c.magnitude > 0 ? 1 : -1,
			charges,
			dims,
			is2D,
			rotation,
			canvasCenter,
			offset,
			isDarkMode,
			zoomLevel
		);
	}
}

function drawFieldLinePath(
	ctx: CanvasRenderingContext2D,
	start: Vector2,
	sign: 1 | -1,
	charges: Charge[],
	dims: { width: number; height: number },
	is2D: boolean,
	rotation: number,
	canvasCenter: Vector2,
	offset: Vector2,
	isDarkMode: boolean,
	zoomLevel = 1
) {
	const viewportLeft = -offset.x / zoomLevel;
	const viewportRight = viewportLeft + dims.width / zoomLevel;
	const viewportTop = -offset.y / zoomLevel;
	const viewportBottom = viewportTop + dims.height / zoomLevel;

	const padding = MAX_FIELD_LINE_RADIUS;
	let p = { ...start };
	const ds = FIELD_LINE_STEP_SIZE;
	const N = FIELD_LINE_MAX_STEPS;
	ctx.save();
	ctx.beginPath();

	let zoomedP = {
		x: canvasCenter.x + (p.x - canvasCenter.x) * zoomLevel,
		y: canvasCenter.y + (p.y - canvasCenter.y) * zoomLevel,
	};

	let transformedP = zoomedP;
	if (!is2D) {
		const angle = (rotation * Math.PI) / 180;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		const relativePos = {
			x: (p.x - canvasCenter.x) * zoomLevel,
			y: (p.y - canvasCenter.y) * zoomLevel,
		};

		const x3d = relativePos.x * cos - relativePos.y * sin * 0.3;
		const z3d = relativePos.x * sin + relativePos.y * sin * 0.1;
		const y3d = relativePos.y;

		const perspective = 1 + z3d / 800;
		transformedP = {
			x: canvasCenter.x + x3d / perspective,
			y: canvasCenter.y + y3d / perspective,
		};
	}

	ctx.moveTo(transformedP.x, transformedP.y);
	let terminated = false;

	for (let j = 0; j < N && !terminated; ++j) {
		const E = calcE(p, charges);
		if (norm(E) < 0.2) break;

		const dir = normalize(E);
		const step4 = { x: dir.x * ds * sign, y: dir.y * ds * sign };
		p = { x: p.x + step4.x, y: p.y + step4.y };

		const zoomedNextP = {
			x: canvasCenter.x + (p.x - canvasCenter.x) * zoomLevel,
			y: canvasCenter.y + (p.y - canvasCenter.y) * zoomLevel,
		};

		let newTransformedP = zoomedNextP;
		if (!is2D) {
			const angle = (rotation * Math.PI) / 180;
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);

			const relativePos = {
				x: (p.x - canvasCenter.x) * zoomLevel,
				y: (p.y - canvasCenter.y) * zoomLevel,
			};

			const x3d = relativePos.x * cos - relativePos.y * sin * 0.3;
			const z3d = relativePos.x * sin + relativePos.y * sin * 0.1;
			const y3d = relativePos.y;

			const perspective = 1 + z3d / 800;
			newTransformedP = {
				x: canvasCenter.x + x3d / perspective,
				y: canvasCenter.y + y3d / perspective,
			};
		}

		ctx.lineTo(newTransformedP.x, newTransformedP.y);

		for (const ch of charges) {
			if (
				ch !== charges[0] &&
				distance(ch.position, p) < CHARGE_RADIUS * 0.88 + 1.5
			) {
				terminated = true;
				break;
			}
		}
		if (
			p.x < viewportLeft - padding ||
			p.x > viewportRight + padding ||
			p.y < viewportTop - padding ||
			p.y > viewportBottom + padding
		)
			break;
	}

	ctx.strokeStyle = isDarkMode ? FIELD_LINE_COLOR_DARK : FIELD_LINE_COLOR_LIGHT;
	ctx.lineWidth = 1.4 * zoomLevel;
	ctx.globalAlpha = 0.82;
	ctx.stroke();
	ctx.globalAlpha = 1.0;
	ctx.restore();
}

const ChargeInfoDisplay: React.FC<ChargeInfoDisplayProps> = ({
	charge,
	mobile = false,
}) => (
	<div
		className={`flex items-center ${
			mobile ? "gap-2 text-sm -mt-0.5" : "gap-3 text-base -mt-0.5"
		}`}
	>
		<div
			className={`${
				mobile ? "w-5 h-5 text-sm" : "w-6 h-6 text-lg"
			} rounded-full flex items-center justify-center font-bold text-white border-white`}
			style={{
				background: charge.color,
				borderWidth: "1.5px",
				boxShadow:
					charge.magnitude > 0 ? `0 0 12px #4285F4FF` : `0 0 12px #FA7B1777`,
			}}
		>
			{charge.magnitude > 0 ? "+" : "-"}
		</div>
		<span
			className={`font-semibold text-gray-200 ${mobile ? "text-sm" : ""}`}
			style={{ fontSize: mobile ? 13 : 15.5 }}
		>
			{charge.magnitude > 0 ? "Positive" : "Negative"}
		</span>
		<span
			className={`font-normal ${mobile ? "ml-1.5 text-xs" : "ml-2 text-sm"}`}
			style={{ color: ORANGE }}
		>
			[{charge.position.x.toFixed(0)}, {charge.position.y.toFixed(0)}]
		</span>
	</div>
);

function Footer({
	isDarkMode,
	onTabChange,
}: {
	isDarkMode: boolean;
	onTabChange: (tab: string) => void;
}) {
	return (
		<footer
			className={`w-full py-12 px-4 ${
				isDarkMode ? "bg-gray-900" : "bg-gray-100"
			} transition-colors duration-300`}
		>
			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
					<div>
						<h3
							className={`text-xl font-bold mb-4 ${
								isDarkMode ? "text-white" : "text-gray-800"
							} flex items-center`}
						>
							<span className="mr-2 text-blue-500">
								<FaAtom size={20} />
							</span>
							QuantumField Visualizer
						</h3>
						<p
							className={`${
								isDarkMode ? "text-gray-300" : "text-gray-600"
							} text-sm leading-relaxed mb-4`}
						>
							Explore the beauty of electromagnetic physics through interactive
							visualization. Perfect for students, educators, and physics
							enthusiasts.
						</p>
					</div>

					<div>
						<h3
							className={`text-xl font-bold mb-5 ${
								isDarkMode ? "text-white" : "text-gray-800"
							}`}
						>
							Quick Links
						</h3>
						<div className="grid grid-cols-2 gap-x-4 gap-y-2">
							<ul
								className={`${
									isDarkMode ? "text-gray-300" : "text-gray-600"
								} space-y-2`}
							>
								<li className="transition-transform hover:translate-x-1 duration-200">
									<button
										onClick={() => onTabChange("home")}
										className="hover:underline flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
									>
										<FaBolt className="text-blue-500 text-xs" />
										Home
									</button>
								</li>
								<li className="transition-transform hover:translate-x-1 duration-200">
									<button
										onClick={() => onTabChange("simulator")}
										className="hover:underline flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
									>
										<FaCube className="text-blue-500 text-xs" />
										Simulator
									</button>
								</li>
								<li className="transition-transform hover:translate-x-1 duration-200">
									<button
										onClick={() => onTabChange("how-it-works")}
										className="hover:underline flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
									>
										<FaBook className="text-blue-500 text-xs" />
										How It Works
									</button>
								</li>
							</ul>
							<ul
								className={`${
									isDarkMode ? "text-gray-300" : "text-gray-600"
								} space-y-2`}
							>
								<li className="transition-transform hover:translate-x-1 duration-200">
									<button
										onClick={() => onTabChange("home")}
										className="hover:underline flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
									>
										<FaGraduationCap className="text-blue-500 text-xs" />
										Resources
									</button>
								</li>
								<li className="transition-transform hover:translate-x-1 duration-200">
									<button
										onClick={() => onTabChange("how-it-works")}
										className="hover:underline flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
									>
										<FaLightbulb className="text-blue-500 text-xs" />
										Tutorials
									</button>
								</li>
								<li className="transition-transform hover:translate-x-1 duration-200">
									<button
										onClick={() => onTabChange("simulator")}
										className="hover:underline flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
									>
										<FaUniversity className="text-blue-500 text-xs" />
										Try It Now
									</button>
								</li>
							</ul>
						</div>
					</div>

					<div>
						<h3
							className={`text-xl font-bold mb-4 ${
								isDarkMode ? "text-white" : "text-gray-800"
							}`}
						>
							Key Features
						</h3>
						<ul
							className={`${
								isDarkMode ? "text-gray-300" : "text-gray-600"
							} space-y-3`}
						>
							<li className="flex items-start gap-2">
								<div className="mt-0.5">
									<FaBolt className="text-blue-500" />
								</div>
								<span className="text-sm">
									Interactive electric field visualization
								</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-0.5">
									<FaCube className="text-blue-500" />
								</div>
								<span className="text-sm">
									Dynamic 2D and 3D rendering modes
								</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-0.5">
									<FaLightbulb className="text-blue-500" />
								</div>
								<span className="text-sm">
									Intuitive touch and gesture controls
								</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-0.5">
									<FaGraduationCap className="text-blue-500" />
								</div>
								<span className="text-sm">
									Educational tools for physics concepts
								</span>
							</li>
						</ul>
						<button
							onClick={() => onTabChange("simulator")}
							className="mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm font-medium"
						>
							Launch Simulator
						</button>
					</div>
				</div>

				<div
					className={`pt-6 mt-6 border-t ${
						isDarkMode
							? "border-gray-800 text-gray-400"
							: "border-gray-200 text-gray-500"
					} flex flex-col md:flex-row justify-between items-center text-sm`}
				>
					<div className="mb-4 md:mb-0">
						{new Date().getFullYear()} QuantumField Visualizer.
					</div>
					<div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
						<button
							onClick={() => onTabChange("home")}
							className="hover:text-blue-500 transition-colors duration-200 bg-transparent border-0 p-0 cursor-pointer"
						>
							About Us
						</button>
						<button
							onClick={() => onTabChange("how-it-works")}
							className="hover:text-blue-500 transition-colors duration-200 bg-transparent border-0 p-0 cursor-pointer"
						>
							Documentation
						</button>
						<button
							onClick={() => onTabChange("simulator")}
							className="hover:text-blue-500 transition-colors duration-200 bg-transparent border-0 p-0 cursor-pointer"
						>
							Try Now
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}

function Navbar({
	activeTab,
	onTabChange,
	isDarkMode,
	toggleDarkMode,
}: NavbarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	const isActive = (tab: string) => activeTab === tab;

	const mobile = isHydrated ? isMobile() : false;

	const navLinks = [
		{ id: "home", label: "Home" },
		{ id: "how-it-works", label: "How It Works" },
		{ id: "simulator", label: "Simulator" },
	];

	const NAVBAR_GLASS_STYLES_CLASS = isDarkMode
		? "bg-black/80 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
		: "bg-white/90 backdrop-blur-xl border-b border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.1)]";

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 ${NAVBAR_GLASS_STYLES_CLASS} transition-colors duration-300`}
		>
			<div className="max-w-6xl mx-auto px-5">
				<div className="flex justify-between items-center h-14">
					<button
						onClick={() => onTabChange("home")}
						className={`text-2xl font-bold ${
							isDarkMode ? "text-white" : "text-gray-800"
						} no-underline bg-transparent border-none cursor-pointer transition-colors duration-300 flex items-center`}
					>
						<FaAtom className="mr-2 text-blue-500 animate-pulse" />
						QuantumField
					</button>

					<div className={`${mobile ? "hidden" : "flex"} items-center gap-8`}>
						{navLinks.map((link) => (
							<button
								key={link.id}
								onClick={() => onTabChange(link.id)}
								className={`bg-transparent border-none no-underline text-base transition-all duration-300 py-3 px-2 relative cursor-pointer ${
									isActive(link.id) ? "font-semibold" : "font-normal"
								} ${
									isActive(link.id)
										? `text-blue-500 border-b-2 border-blue-500`
										: `${
												isDarkMode ? "text-white/80" : "text-gray-700"
										  } border-b-2 border-transparent`
								} hover:text-blue-500 hover:border-blue-500/50`}
							>
								{link.label}
							</button>
						))}
						<button
							onClick={toggleDarkMode}
							className={`bg-transparent border-none ${
								isDarkMode ? "text-white/80" : "text-gray-700"
							} text-lg cursor-pointer p-2 rounded-full hover:bg-gray-800/10 transition-colors duration-300`}
							aria-label="Toggle dark mode"
						>
							{isDarkMode ? <FaSun /> : <FaMoon />}
						</button>
					</div>

					<div className={`${mobile ? "flex" : "hidden"} items-center gap-3`}>
						<button
							onClick={toggleDarkMode}
							className={`bg-transparent border-none ${
								isDarkMode ? "text-white/80" : "text-gray-700"
							} text-lg cursor-pointer p-2 rounded-full hover:bg-gray-800/10 transition-colors duration-300`}
							aria-label="Toggle dark mode"
						>
							{isDarkMode ? <FaSun /> : <FaMoon />}
						</button>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className={`bg-transparent border-none ${
								isDarkMode ? "text-white" : "text-gray-800"
							} text-2xl cursor-pointer p-2`}
						>
							{isOpen ? <FaTimes /> : "☰"}
						</button>
					</div>
				</div>

				{isOpen && mobile && (
					<div className="block pb-4 animate-fadeIn">
						{navLinks.map((link) => (
							<button
								key={link.id}
								onClick={() => {
									onTabChange(link.id);
									setIsOpen(false);
								}}
								className={`block bg-transparent border-none w-full text-left no-underline text-base font-medium py-3 transition-colors duration-300 border-b ${
									isDarkMode ? "border-white/10" : "border-gray-200"
								} cursor-pointer ${
									isActive(link.id)
										? "text-blue-500"
										: isDarkMode
										? "text-white"
										: "text-gray-800"
								} hover:text-blue-500`}
							>
								{link.label}
							</button>
						))}
					</div>
				)}
			</div>
		</nav>
	);
}

function HowItWorksPage({
	onTabChange,
	isDarkMode,
}: {
	onTabChange?: (tab: string) => void;
	isDarkMode: boolean;
}) {
	const GLASS_STYLES_CLASS = isDarkMode
		? "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
		: "bg-black/5 backdrop-blur-md border border-black/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)]";

	return (
		<main className="pt-20 pb-15">
			<div className="max-w-4xl mx-auto px-5">
				<div
					className={`py-15 px-10 mb-10 text-center ${
						isDarkMode ? "bg-white/5" : "bg-black/5"
					} ${GLASS_STYLES_CLASS} transition-colors duration-300`}
				>
					<h1
						className={`${
							isDarkMode ? "text-white" : "text-gray-800"
						} font-black mb-6 text-[clamp(2.5rem,6vw,4rem)] transition-colors duration-300`}
					>
						How It Works
					</h1>
					<p
						className={`text-lg ${
							isDarkMode ? "text-white/90" : "text-gray-700"
						} leading-relaxed max-w-2xl mx-auto transition-colors duration-300`}
					>
						Understanding electric fields has never been easier. Our interactive
						simulator brings complex physics concepts to life with intuitive
						controls and real-time visualization.
					</p>
				</div>

				<div className="flex flex-col gap-8">
					{[
						{
							step: "01",
							title: "Choose Your Interaction Mode",
							description:
								"The draggable toolbar offers four distinct interaction modes, each optimized for specific tasks. Switch between modes as needed to efficiently build and explore your electric field simulations.",
							details: [
								"Select Mode (Hand): Click and drag to move charges",
								"Place Mode (Lightning): Create new positive/negative charges",
								"Delete Mode (Eraser): Remove charges with precision",
								"Move Mode (Arrows): Pan and navigate the viewport",
							],
							icon: <FaHandLizard className="text-blue-500 text-4xl mb-2" />,
						},
						{
							step: "02",
							title: "Build Your Electric Field",
							description:
								"Start in Place mode to create charges anywhere in the viewport. Right-click for positive charges, left-click for negative charges. Drag while placing to adjust magnitude. Each placed charge is automatically selected for immediate editing.",
							details: [
								"Right-click: Create positive charge (blue)",
								"Left-click: Create negative charge (orange)",
								"Drag while placing: Adjust charge magnitude",
								"Auto-selection: Edit properties immediately",
							],
							icon: <FaBolt className="text-blue-500 text-4xl mb-2" />,
						},
						{
							step: "03",
							title: "Manipulate and Refine",
							description:
								"Switch to Select mode to reposition charges by dragging them around. Use Delete mode to precisely remove unwanted charges. The grid background helps with spatial positioning as you pan around.",
							details: [
								"Select mode: Drag charges to new positions",
								"Delete mode: Click charges to remove them",
								"Property panel: Adjust magnitude and settings",
								"Grid reference: Visual positioning aid",
							],
							icon: <FaArrowsAlt className="text-blue-500 text-4xl mb-2" />,
						},
						{
							step: "04",
							title: "Explore and Visualize",
							description:
								"Toggle between 2D and 3D views with touch/gesture controls for rotation. Use pinch gestures to zoom and swipe to rotate in 3D mode. The viewport-optimized rendering ensures smooth performance while maintaining physics accuracy.",
							details: [
								"2D/3D toggle: Switch visualization modes",
								"Touch gestures: Swipe to rotate in 3D view",
								"Pinch gesture: Zoom in/out for detailed viewing",
								"Real-time physics: Field vectors and lines update live",
							],
							icon: <FaCube className="text-blue-500 text-4xl mb-2" />,
						},
					].map((section, index) => (
						<div
							key={index}
							className={`${GLASS_STYLES_CLASS} p-10 ${
								isDarkMode ? "bg-white/5" : "bg-black/5"
							} transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}
						>
							<div className="flex items-start gap-8 flex-col md:flex-row">
								<div className="text-5xl font-black opacity-70 min-w-20 text-blue-500 flex flex-col items-center">
									{section.step}
									{section.icon}
								</div>

								<div className="flex-1">
									<h3
										className={`text-2xl font-bold mb-4 ${
											isDarkMode ? "text-white" : "text-gray-800"
										} transition-colors duration-300`}
									>
										{section.title}
									</h3>

									<p
										className={`text-base leading-relaxed mb-6 ${
											isDarkMode ? "text-white/80" : "text-gray-700"
										} transition-colors duration-300`}
									>
										{section.description}
									</p>

									<ul className="list-none p-0 m-0 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
										{section.details.map((detail, detailIndex) => (
											<li
												key={detailIndex}
												className={`text-sm ${
													isDarkMode ? "text-white/70" : "text-gray-600"
												} flex items-center gap-2 transition-colors duration-300`}
											>
												<span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-yellow-500"></span>
												{detail}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					))}
				</div>

				<div
					className={`${GLASS_STYLES_CLASS} p-10 mt-10 text-center ${
						isDarkMode ? "bg-white/5" : "bg-black/5"
					} transition-colors duration-300`}
				>
					<h3 className="text-2xl font-bold mb-4 text-blue-500">
						Ready to Explore?
					</h3>
					<p
						className={`text-base mb-8 ${
							isDarkMode ? "text-white/80" : "text-gray-700"
						} leading-relaxed transition-colors duration-300`}
					>
						Start experimenting with electric fields and discover the beauty of
						electromagnetic physics through interactive visualization.
					</p>
					<button
						onClick={() => onTabChange?.("simulator")}
						className="inline-block py-4 px-8 text-white no-underline rounded-xl text-lg font-semibold border border-white/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg hover:shadow-xl"
					>
						Launch Simulator
					</button>
				</div>
			</div>
		</main>
	);
}

function SimulatorPage({ isDarkMode }: { isDarkMode: boolean }) {
	const [isHydrated, setIsHydrated] = useState(false);
	const [charges, setCharges] = useState<Charge[]>(initialCharges);
	const [placingCharge, setPlacingCharge] = useState<null | {
		start: Vector2;
		pos: Vector2;
		currentPos: Vector2;
		magnitude: number;
		positive: boolean;
		isDragging: boolean;
	}>(null);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [movingId, setMovingId] = useState<number | null>(null);
	const [isDraggingCharge, setIsDraggingCharge] = useState(false);
	const [draggedChargeId, setDraggedChargeId] = useState<number | null>(null);
	const [isHoveringCharge, setIsHoveringCharge] = useState(false);
	const [frame, setFrame] = useState(0);
	const [is2D, setIs2D] = useState(true);
	const [rotation3D, setRotation3D] = useState(0);
	const [isPanelFolded, setIsPanelFolded] = useState(false);
	const [canvasDims, setCanvasDims] = useState({
		width: 800,
		height: 600,
	});

	const [interactionMode, setInteractionMode] = useState<
		"select" | "place" | "delete" | "move"
	>("place");
	const [panMode, setPanMode] = useState(false);
	const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState({ x: 0, y: 0 });

	const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
	const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [toolbarDimensions, setToolbarDimensions] = useState({
		width: 240,
		height: 400,
	});
	const [isToolbarReady, setIsToolbarReady] = useState(false);
	const [selectedPanelPosition, setSelectedPanelPosition] = useState({
		x: 0,
		y: 0,
	});
	const [isSelectedPanelReady, setIsSelectedPanelReady] = useState(false);

	const [touchStartX, setTouchStartX] = useState<number | null>(null);
	const [touchStartY, setTouchStartY] = useState<number | null>(null);
	const [isTouchRotating, setIsTouchRotating] = useState(false);
	const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
		null
	);

	const [zoomLevel, setZoomLevel] = useState(1);
	const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(
		null
	);
	const [showZoomControls, setShowZoomControls] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);

	const GLASS_STYLES_CLASS = isDarkMode
		? "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
		: "bg-black/5 backdrop-blur-md border border-black/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)]";

	const PANEL_BG_CLASS = isDarkMode
		? "bg-gray-900/90 backdrop-blur-md"
		: "bg-white/90 backdrop-blur-md";

	const BG_COLOR = isDarkMode ? DARK_BG_COLOR : LIGHT_BG_COLOR;
	const BORDER_COLOR = isDarkMode ? BORDER_COLOR_DARK : BORDER_COLOR_LIGHT;
	const GLASS_BORDER = isDarkMode ? GLASS_BORDER_DARK : GLASS_BORDER_LIGHT;
	const ARROW_COLOR = isDarkMode ? ARROW_COLOR_DARK : ARROW_COLOR_LIGHT;
	const FIELD_LINE_COLOR = isDarkMode
		? FIELD_LINE_COLOR_DARK
		: FIELD_LINE_COLOR_LIGHT;
	const mobile = isHydrated ? isMobile() : false;

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		setPanMode(interactionMode === "move");
	}, [interactionMode]);

	useEffect(() => {
		if (mobile && !isPanelFolded) {
			if (autoHideTimer) clearTimeout(autoHideTimer);

			const timer = setTimeout(() => {
				setIsPanelFolded(true);
			}, 8000);

			setAutoHideTimer(timer);
		}

		return () => {
			if (autoHideTimer) clearTimeout(autoHideTimer);
		};
	}, [mobile, isPanelFolded, charges, selectedId, movingId]);

	useEffect(() => {
		if (
			canvasRef.current &&
			containerRef.current &&
			isHydrated &&
			toolbarPosition.x === 0 &&
			toolbarPosition.y === 0
		) {
			setTimeout(() => {
				if (canvasRef.current && containerRef.current) {
					const canvasRect = canvasRef.current.getBoundingClientRect();
					const containerRect = containerRef.current.getBoundingClientRect();
					setToolbarPosition({
						x: canvasRect.left - containerRect.left + 10,
						y: canvasRect.top - containerRect.top + 10,
					});
					setIsToolbarReady(true);
				}
			}, 100);
		}
	}, [isHydrated, canvasDims]);

	useEffect(() => {
		if (canvasRef.current && containerRef.current && selectedId != null) {
			setTimeout(() => {
				if (canvasRef.current && containerRef.current) {
					const canvasRect = canvasRef.current.getBoundingClientRect();
					const containerRect = containerRef.current.getBoundingClientRect();
					const panelWidth = mobile ? 260 : 300;
					setSelectedPanelPosition({
						x: canvasRect.right - containerRect.left - panelWidth - 10,
						y: canvasRect.top - containerRect.top + 10,
					});
					setIsSelectedPanelReady(true);
				}
			}, 100);
		}
	}, [selectedId, isHydrated, canvasDims, mobile]);

	useEffect(() => {
		if (selectedId === null) {
			setIsSelectedPanelReady(false);
		}
	}, [selectedId]);

	useEffect(() => {
		function onResize() {
			if (containerRef.current) {
				const mobile = isMobile();
				const tablet = isTablet();

				const vw = window.innerWidth;
				const vh = window.innerHeight;

				let w: number, h: number;

				if (mobile) {
					w = Math.min(vw - 20, 800);
					h = Math.min(vh - 160, 600);
				} else if (tablet) {
					w = Math.min(vw - 40, 900);
					h = Math.min(vh - 150, 700);
				} else {
					w = Math.min(vw - 40, 1200);
					h = Math.min(vh - 150, 800);
				}

				setCanvasDims({ width: w, height: h });
			}
		}

		window.addEventListener("resize", onResize);
		onResize();
		return () => window.removeEventListener("resize", onResize);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = canvasDims.width * dpr;
		canvas.height = canvasDims.height * dpr;
		canvas.style.width = `${canvasDims.width}px`;
		canvas.style.height = `${canvasDims.height}px`;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(dpr, dpr);

		ctx.translate(canvasOffset.x, canvasOffset.y);

		ctx.fillStyle = BG_COLOR;
		ctx.fillRect(
			-canvasOffset.x,
			-canvasOffset.y,
			canvasDims.width,
			canvasDims.height
		);

		ctx.strokeStyle = GLASS_BORDER;
		ctx.lineWidth = CANVAS_BORDER;
		ctx.strokeRect(
			-canvasOffset.x,
			-canvasOffset.y,
			canvasDims.width,
			canvasDims.height
		);

		const gridSize = 80;
		ctx.save();
		ctx.strokeStyle = isDarkMode
			? "rgba(255, 255, 255, 0.25)"
			: "rgba(0, 0, 0, 0.1)";
		ctx.lineWidth = 0.5;
		ctx.beginPath();

		const zoomedGridSize = gridSize * zoomLevel;
		const canvasCenter = { x: canvasDims.width / 2, y: canvasDims.height / 2 };

		const startX =
			Math.floor((-canvasOffset.x - canvasCenter.x) / zoomedGridSize) *
				zoomedGridSize +
			canvasCenter.x;
		const startY =
			Math.floor((-canvasOffset.y - canvasCenter.y) / zoomedGridSize) *
				zoomedGridSize +
			canvasCenter.y;
		const endX = startX + canvasDims.width + zoomedGridSize;
		const endY = startY + canvasDims.height + zoomedGridSize;

		for (let x = startX; x <= endX; x += zoomedGridSize) {
			ctx.moveTo(x, -canvasOffset.y);
			ctx.lineTo(x, -canvasOffset.y + canvasDims.height);
		}

		for (let y = startY; y <= endY; y += zoomedGridSize) {
			ctx.moveTo(-canvasOffset.x, y);
			ctx.lineTo(-canvasOffset.x + canvasDims.width, y);
		}

		ctx.stroke();
		ctx.restore();

		drawFieldVectors(
			ctx,
			charges,
			canvasDims,
			is2D,
			rotation3D,
			canvasOffset,
			isDarkMode,
			zoomLevel
		);

		for (const c of charges) {
			drawFieldLines(
				ctx,
				c,
				charges,
				canvasDims,
				is2D,
				rotation3D,
				canvasOffset,
				isDarkMode,
				zoomLevel
			);
		}

		for (const c of charges) {
			drawCharge(
				ctx,
				c,
				selectedId === c.id,
				is2D,
				rotation3D,
				canvasCenter,
				movingId === c.id,
				isDarkMode,
				zoomLevel
			);
		}

		if (placingCharge) {
			drawCharge(
				ctx,
				{
					id: -1,
					position: placingCharge.pos,
					magnitude: placingCharge.positive
						? Math.abs(placingCharge.magnitude)
						: -Math.abs(placingCharge.magnitude),
					color: getChargeColor(
						placingCharge.positive
							? Math.abs(placingCharge.magnitude)
							: -Math.abs(placingCharge.magnitude),
						isDarkMode
					),
				},
				false,
				is2D,
				rotation3D,
				canvasCenter,
				false,
				isDarkMode,
				zoomLevel
			);
			if (placingCharge.isDragging) {
				ctx.save();
				ctx.strokeStyle = isDarkMode
					? "rgba(255, 255, 255, 0.8)"
					: "rgba(0, 0, 0, 0.6)";
				ctx.setLineDash([6, 4]);
				ctx.lineWidth = 2 * zoomLevel;
				ctx.beginPath();

				const startPos = is2D
					? {
							x:
								canvasCenter.x +
								(placingCharge.start.x - canvasCenter.x) * zoomLevel,
							y:
								canvasCenter.y +
								(placingCharge.start.y - canvasCenter.y) * zoomLevel,
					  }
					: (() => {
							const angle = (rotation3D * Math.PI) / 180;
							const cos = Math.cos(angle);
							const sin = Math.sin(angle);
							const relativePos = {
								x: (placingCharge.start.x - canvasCenter.x) * zoomLevel,
								y: (placingCharge.start.y - canvasCenter.y) * zoomLevel,
							};
							const x3d = relativePos.x * cos - relativePos.y * sin * 0.3;
							const z3d = relativePos.x * sin + relativePos.y * cos * 0.3;

							const y3d = relativePos.y;
							const perspective = 1 + z3d / 800;
							return {
								x: canvasCenter.x + x3d / perspective,
								y: canvasCenter.y + y3d / perspective,
							};
					  })();

				ctx.moveTo(startPos.x, startPos.y);
				ctx.lineTo(placingCharge.currentPos.x, placingCharge.currentPos.y);
				ctx.stroke();
				ctx.restore();
			}
		}
	}, [
		charges,
		placingCharge,
		selectedId,
		canvasDims.width,
		canvasDims.height,
		is2D,
		rotation3D,
		canvasOffset,
		movingId,
		frame,
		isDarkMode,
		zoomLevel,
	]);

	const worldToScreen = useCallback(
		(worldPos: Vector2) => {
			const canvasCenter = {
				x: canvasDims.width / 2,
				y: canvasDims.height / 2,
			};

			const zoomedPos = {
				x: canvasCenter.x + (worldPos.x - canvasCenter.x) * zoomLevel,
				y: canvasCenter.y + (worldPos.y - canvasCenter.y) * zoomLevel,
			};

			if (is2D) return zoomedPos;

			const angle = (rotation3D * Math.PI) / 180;
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);

			const relativePos = {
				x: zoomedPos.x - canvasCenter.x,
				y: zoomedPos.y - canvasCenter.y,
			};

			const x3d = relativePos.x * cos - relativePos.y * sin * 0.3;
			const z3d = relativePos.x * sin + relativePos.y * sin * 0.1;
			const y3d = relativePos.y;

			const perspective = 1 + z3d / 800;

			return {
				x: canvasCenter.x + x3d / perspective,
				y: canvasCenter.y + y3d / perspective,
			};
		},
		[is2D, rotation3D, canvasDims, zoomLevel]
	);

	const screenToWorld = useCallback(
		(screenPos: Vector2) => {
			const canvasCenter = {
				x: canvasDims.width / 2,
				y: canvasDims.height / 2,
			};

			if (is2D) {
				return {
					x: canvasCenter.x + (screenPos.x - canvasCenter.x) / zoomLevel,
					y: canvasCenter.y + (screenPos.y - canvasCenter.y) / zoomLevel,
				};
			}

			const angle = (rotation3D * Math.PI) / 180;
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);

			const screenRelative = {
				x: screenPos.x - canvasCenter.x,
				y: screenPos.y - canvasCenter.y,
			};

			const perspective = 1;
			const x3d = screenRelative.x * perspective;
			const y3d = screenRelative.y * perspective;

			const relativeY = y3d;
			const relativeX = (x3d + relativeY * sin * 0.3) / cos;

			return {
				x: canvasCenter.x + relativeX / zoomLevel,
				y: canvasCenter.y + relativeY / zoomLevel,
			};
		},
		[is2D, rotation3D, canvasDims, zoomLevel]
	);

	const findWorldPositionForScreenTarget = useCallback(
		(targetScreenPos: Vector2) => {
			const worldPos = screenToWorld(targetScreenPos);

			if (!is2D) {
				const checkScreenPos = worldToScreen(worldPos);

				const error = {
					x: Math.abs(targetScreenPos.x - checkScreenPos.x),
					y: Math.abs(targetScreenPos.y - checkScreenPos.y),
				};

				if (error.x < 0.5 && error.y < 0.5) {
					return worldPos;
				}

				const refinedWorldPos = { ...worldPos };
				let stepSize = 1.0;

				for (let i = 0; i < 15; i++) {
					const currentScreenPos = worldToScreen(refinedWorldPos);
					const currentError = {
						x: targetScreenPos.x - currentScreenPos.x,
						y: targetScreenPos.y - currentScreenPos.y,
					};

					if (
						Math.abs(currentError.x) < 0.1 &&
						Math.abs(currentError.y) < 0.1
					) {
						break;
					}

					refinedWorldPos.x += (currentError.x * stepSize) / zoomLevel;
					refinedWorldPos.y += (currentError.y * stepSize) / zoomLevel;

					if (
						i > 5 &&
						(Math.abs(currentError.x) > 2 || Math.abs(currentError.y) > 2)
					) {
						stepSize *= 0.7;
					}
				}

				return refinedWorldPos;
			}

			return worldPos;
		},
		[is2D, worldToScreen, screenToWorld, zoomLevel]
	);

	const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		e.preventDefault();

		if (autoHideTimer) clearTimeout(autoHideTimer);

		const rect = canvasRef.current?.getBoundingClientRect();
		if (!rect) return;

		const rawX = e.clientX - rect.left;
		const rawY = e.clientY - rect.top;

		const pos = { x: rawX - canvasOffset.x, y: rawY - canvasOffset.y };

		if (panMode && e.button === 0) {
			setIsPanning(true);
			setPanStart({
				x: e.clientX - canvasOffset.x,
				y: e.clientY - canvasOffset.y,
			});
			return;
		}

		if (placingCharge || isPanning) return;

		if (interactionMode === "select") {
			let clickedCharge: Charge | null = null;
			for (const c of charges) {
				const screenPos = worldToScreen(c.position);
				if (distance(screenPos, pos) < CHARGE_RADIUS * zoomLevel + 4) {
					clickedCharge = c;
					break;
				}
			}
			if (clickedCharge) {
				setSelectedId(clickedCharge.id);
				setIsDraggingCharge(true);
				setDraggedChargeId(clickedCharge.id);
			} else {
				setSelectedId(null);
				setIsDraggingCharge(false);
				setDraggedChargeId(null);
			}
			return;
		}

		if (interactionMode === "place") {
			setSelectedId(null);
			const isRightClick = e.button === 2;
			const isLeftClick = e.button === 0;

			let isPositive = isRightClick;

			if (mobile) {
				isPositive = e.pointerType === "touch" ? e.altKey : isLeftClick;
			} else {
				isPositive = isRightClick ? true : isLeftClick ? false : true;
			}

			const screenPos = pos;
			const worldPos = findWorldPositionForScreenTarget(screenPos);

			setPlacingCharge({
				start: worldPos,
				pos: worldPos,
				currentPos: pos,
				magnitude: 1,
				positive: isPositive,
				isDragging: false,
			});
			return;
		}

		if (interactionMode === "delete") {
			let clickedCharge: Charge | null = null;
			for (const c of charges) {
				const screenPos = worldToScreen(c.position);
				if (distance(screenPos, pos) < CHARGE_RADIUS * zoomLevel + 4) {
					clickedCharge = c;
					break;
				}
			}
			if (clickedCharge) {
				setCharges((prevCharges) =>
					prevCharges.filter((c) => c.id !== clickedCharge!.id)
				);
				if (selectedId === clickedCharge.id) {
					setSelectedId(null);
				}
			}
			return;
		}
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (autoHideTimer) clearTimeout(autoHideTimer);

		if (isPanning && panMode) {
			const newOffset = {
				x: e.clientX - panStart.x,
				y: e.clientY - panStart.y,
			};
			setCanvasOffset(newOffset);
			return;
		}

		if (isDraggingCharge && draggedChargeId !== null) {
			const rect = canvasRef.current?.getBoundingClientRect();
			if (!rect) return;

			const rawX = e.clientX - rect.left;
			const rawY = e.clientY - rect.top;
			const screenPos = { x: rawX - canvasOffset.x, y: rawY - canvasOffset.y };

			const worldPos = findWorldPositionForScreenTarget(screenPos);

			setCharges((prevCharges) =>
				prevCharges.map((charge) =>
					charge.id === draggedChargeId
						? { ...charge, position: worldPos }
						: charge
				)
			);
			return;
		}

		if (!placingCharge) return;

		const rect = canvasRef.current?.getBoundingClientRect();
		if (!rect) return;

		const rawX = e.clientX - rect.left;
		const rawY = e.clientY - rect.top;
		const screenPos = { x: rawX - canvasOffset.x, y: rawY - canvasOffset.y };

		const startScreenPos = worldToScreen(placingCharge.start);
		const dragDistance = distance(screenPos, startScreenPos);
		const isDragging = dragDistance > 5;
		const mag = Math.min(10, Math.max(0.1, dragDistance / (30 * zoomLevel)));

		setPlacingCharge({
			...placingCharge,
			pos: placingCharge.start,
			currentPos: screenPos,
			magnitude: mag,
			isDragging: isDragging,
		});
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (interactionMode !== "select" || isDraggingCharge) return;

		const rect = canvasRef.current?.getBoundingClientRect();
		if (!rect) return;

		const rawX = e.clientX - rect.left;
		const rawY = e.clientY - rect.top;
		const pos = { x: rawX - canvasOffset.x, y: rawY - canvasOffset.y };

		let hoveringOverCharge = false;
		for (const c of charges) {
			const screenPos = worldToScreen(c.position);
			if (distance(screenPos, pos) < CHARGE_RADIUS * zoomLevel + 4) {
				hoveringOverCharge = true;
				break;
			}
		}

		setIsHoveringCharge(hoveringOverCharge);
	};

	const handleMouseLeave = () => {
		setIsHoveringCharge(false);
	};

	const handlePointerUp = () => {
		if (isPanning) {
			setIsPanning(false);
			return;
		}

		if (isDraggingCharge) {
			setIsDraggingCharge(false);
			setDraggedChargeId(null);
			return;
		}

		if (!placingCharge) return;

		const pos = placingCharge.pos;

		const canvasCenter = { x: canvasDims.width / 2, y: canvasDims.height / 2 };
		const viewportLeft =
			canvasCenter.x -
			canvasDims.width / 2 / zoomLevel -
			canvasOffset.x / zoomLevel;
		const viewportRight =
			canvasCenter.x +
			canvasDims.width / 2 / zoomLevel -
			canvasOffset.x / zoomLevel;
		const viewportTop =
			canvasCenter.y -
			canvasDims.height / 2 / zoomLevel -
			canvasOffset.y / zoomLevel;
		const viewportBottom =
			canvasCenter.y +
			canvasDims.height / 2 / zoomLevel -
			canvasOffset.y / zoomLevel;

		const margin = CHARGE_RADIUS + 8;

		if (
			pos.x > viewportLeft + margin &&
			pos.x < viewportRight - margin &&
			pos.y > viewportTop + margin &&
			pos.y < viewportBottom - margin
		) {
			const newChargeId = Date.now() + Math.floor(Math.random() * 100000);
			const newCharge: Charge = {
				id: newChargeId,
				position: pos,
				magnitude: placingCharge.positive
					? Math.abs(placingCharge.magnitude)
					: -Math.abs(placingCharge.magnitude),
				color: getChargeColor(
					placingCharge.positive
						? Math.abs(placingCharge.magnitude)
						: -Math.abs(placingCharge.magnitude),
					isDarkMode
				),
			};
			setCharges((c) => [...c, newCharge]);
			setSelectedId(newChargeId);
		}
		setPlacingCharge(null);
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
		if (autoHideTimer) clearTimeout(autoHideTimer);

		if (!is2D && e.touches.length === 1) {
			setTouchStartX(e.touches[0].clientX);
			setTouchStartY(e.touches[0].clientY);
			setIsTouchRotating(true);
		} else if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			setLastTouchDistance(distance);
		}
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
		if (autoHideTimer) clearTimeout(autoHideTimer);

		if (
			!is2D &&
			isTouchRotating &&
			touchStartX !== null &&
			e.touches.length === 1
		) {
			const deltaX = e.touches[0].clientX - touchStartX;

			setRotation3D((prevRotation) => {
				let newRotation = prevRotation + deltaX * 0.5;
				if (newRotation < 0) newRotation += 360;
				if (newRotation >= 360) newRotation -= 360;
				return newRotation;
			});

			setTouchStartX(e.touches[0].clientX);
			setTouchStartY(e.touches[0].clientY);

			e.preventDefault();
		} else if (e.touches.length === 2 && lastTouchDistance !== null) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const newDistance = Math.sqrt(dx * dx + dy * dy);

			const zoomRatio = newDistance / lastTouchDistance;

			setZoomLevel((prevZoom) => {
				const newZoom = prevZoom * zoomRatio;
				return Math.max(0.5, Math.min(3, newZoom));
			});

			setLastTouchDistance(newDistance);
			e.preventDefault();

			setShowZoomControls(true);

			setTimeout(() => setShowZoomControls(false), 3000);
		}
	};

	const handleTouchEnd = () => {
		setIsTouchRotating(false);
		setTouchStartX(null);
		setTouchStartY(null);
		setLastTouchDistance(null);
	};

	const handleZoomIn = () => {
		setZoomLevel((prev) => Math.min(3, prev * 1.2));
	};

	const handleZoomOut = () => {
		setZoomLevel((prev) => Math.max(0.5, prev / 1.2));
	};

	const handleZoomReset = () => {
		setZoomLevel(1);
	};

	const handleRemoveCharge = () => {
		if (selectedId != null) {
			setCharges((chgs) => chgs.filter((c) => c.id !== selectedId));
			setSelectedId(null);
		}
	};

	const handleMagnitudeChange = (v: number) => {
		setCharges((chgs) =>
			chgs.map((c) =>
				c.id === selectedId
					? {
							...c,
							magnitude: v,
							color: getChargeColor(v, isDarkMode),
					  }
					: c
			)
		);
	};

	const handleClearAll = () => {
		setCharges([]);
		setSelectedId(null);
	};

	const handleTogglePanel = () => setIsPanelFolded((v) => !v);

	const getSimulationBounds = useCallback(() => {
		if (!containerRef.current || !canvasRef.current)
			return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

		const canvasRect = canvasRef.current.getBoundingClientRect();
		const containerRect = containerRef.current.getBoundingClientRect();
		const toolbarWidth = toolbarDimensions.width;
		const toolbarHeight = toolbarDimensions.height;

		const canvasLeft = canvasRect.left - containerRect.left;
		const canvasTop = canvasRect.top - containerRect.top;
		const canvasWidth = canvasRect.width;
		const canvasHeight = canvasRect.height;

		return {
			minX: canvasLeft,
			maxX: canvasLeft + canvasWidth - toolbarWidth,
			minY: canvasTop,
			maxY: canvasTop + canvasHeight - toolbarHeight,
		};
	}, [toolbarDimensions]);

	useEffect(() => {
		const updateToolbarDimensions = () => {
			if (toolbarRef.current) {
				const rect = toolbarRef.current.getBoundingClientRect();
				setToolbarDimensions({ width: rect.width, height: rect.height });
			}
		};

		const timeoutId = setTimeout(updateToolbarDimensions, 100);

		window.addEventListener("resize", updateToolbarDimensions);
		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("resize", updateToolbarDimensions);
		};
	}, [is2D, panMode, selectedId]);

	const handleToolbarDragStart = (e: React.PointerEvent) => {
		e.preventDefault();
		setIsDraggingToolbar(true);
		setDragStart({
			x: e.clientX - toolbarPosition.x,
			y: e.clientY - toolbarPosition.y,
		});
	};

	const handleToolbarDrag = useCallback(
		(e: PointerEvent) => {
			if (!isDraggingToolbar) return;

			const newX = e.clientX - dragStart.x;
			const newY = e.clientY - dragStart.y;

			const bounds = getSimulationBounds();

			setToolbarPosition({
				x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
				y: Math.max(bounds.minY, Math.min(bounds.maxY, newY)),
			});
		},
		[isDraggingToolbar, dragStart, getSimulationBounds]
	);

	const handleToolbarDragEnd = useCallback(() => {
		setIsDraggingToolbar(false);
	}, []);

	useEffect(() => {
		if (isDraggingToolbar) {
			window.addEventListener("pointermove", handleToolbarDrag);
			window.addEventListener("pointerup", handleToolbarDragEnd);
			return () => {
				window.removeEventListener("pointermove", handleToolbarDrag);
				window.removeEventListener("pointerup", handleToolbarDragEnd);
			};
		}
	}, [isDraggingToolbar, handleToolbarDrag, handleToolbarDragEnd]);

	useEffect(() => {
		const adjustToolbarPosition = () => {
			const bounds = getSimulationBounds();
			setToolbarPosition((prev) => ({
				x: Math.max(bounds.minX, Math.min(bounds.maxX, prev.x)),
				y: Math.max(bounds.minY, Math.min(bounds.maxY, prev.y)),
			}));
		};

		window.addEventListener("resize", adjustToolbarPosition);
		return () => window.removeEventListener("resize", adjustToolbarPosition);
	}, [getSimulationBounds]);

	useEffect(() => {
		const animate = () => {
			setFrame((f) => f + 1);
			animationFrameId = requestAnimationFrame(animate);
		};

		let animationFrameId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={`pt-20 pb-15 min-h-screen flex items-center justify-center relative ${
				isDarkMode ? "text-white" : "text-gray-800"
			} transition-colors duration-300`}
			onClick={(e) => {
				if (mobile && !isPanelFolded && toolbarRef.current) {
					const panelRect = toolbarRef.current.getBoundingClientRect();
					const clickX = e.clientX;
					const clickY = e.clientY;

					const isClickOutsidePanel =
						clickX < panelRect.left ||
						clickX > panelRect.right ||
						clickY < panelRect.top ||
						clickY > panelRect.bottom;

					if (isClickOutsidePanel) {
						setIsPanelFolded(true);
					}
				}
			}}
		>
			<canvas
				ref={canvasRef}
				tabIndex={0}
				className={`outline-none select-none z-10 m-2.5 ${GLASS_STYLES_CLASS} ${
					mobile ? "rounded-xl" : "rounded-3xl"
				} transition-all duration-300`}
				style={{
					boxShadow: isDarkMode
						? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
						: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
					cursor:
						interactionMode === "move"
							? "move"
							: interactionMode === "place"
							? "crosshair"
							: interactionMode === "delete"
							? "crosshair"
							: isDraggingCharge
							? "grabbing"
							: interactionMode === "select" && isHoveringCharge
							? "grab"
							: "default",
				}}
				width={canvasDims.width}
				height={canvasDims.height}
				onPointerDown={handlePointerDown}
				onPointerMove={
					placingCharge || isPanning || isDraggingCharge
						? handlePointerMove
						: undefined
				}
				onPointerUp={
					placingCharge || isPanning || isDraggingCharge
						? handlePointerUp
						: undefined
				}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onContextMenu={(e) => e.preventDefault()}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onWheel={(e) => {
					const delta = e.deltaY < 0 ? 1.1 : 0.9;
					setZoomLevel((prevZoom) =>
						Math.max(0.5, Math.min(3, prevZoom * delta))
					);
					setShowZoomControls(true);
					setTimeout(() => setShowZoomControls(false), 3000);
					e.preventDefault();
				}}
			/>

			<div
				className={`absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full ${PANEL_BG_CLASS} p-2 shadow-lg transition-opacity duration-300 ${
					showZoomControls || zoomLevel !== 1 ? "opacity-100" : "opacity-0"
				}`}
			>
				<button
					onClick={handleZoomOut}
					className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
				>
					<FaMinus size={12} />
				</button>
				<button
					onClick={handleZoomReset}
					className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-400 transition-colors"
				>
					<FaExpand size={12} />
				</button>
				<button
					onClick={handleZoomIn}
					className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
				>
					<FaPlus size={12} />
				</button>
				<span className="text-xs ml-1 font-medium">
					{Math.round(zoomLevel * 100)}%
				</span>
			</div>

			{!is2D && (
				<div
					className={`absolute top-4 right-4 z-20 px-3 py-2 ${PANEL_BG_CLASS} rounded-lg text-sm font-medium shadow-lg transition-opacity duration-300 ${
						isDarkMode ? "text-white/90" : "text-gray-800"
					}`}
					style={{ opacity: 0.9 }}
				>
					<div className="flex items-center gap-2">
						<FaInfoCircle size={14} className="text-blue-500" />
						{mobile ? "Swipe to rotate" : "Drag to rotate"} |{" "}
						{mobile ? "Pinch" : "Wheel"} to zoom
					</div>
				</div>
			)}

			<div
				ref={toolbarRef}
				className={`absolute z-20 min-w-60 max-w-70 overflow-hidden rounded-xl ${
					isToolbarReady ? "visible" : "invisible"
				} ${PANEL_BG_CLASS} border ${
					isDarkMode ? "border-white/20" : "border-black/10"
				} shadow-lg transition-all duration-300`}
				style={{
					top: `${toolbarPosition.y}px`,
					left: `${toolbarPosition.x}px`,
					transform:
						isPanelFolded && mobile ? "translateY(-10px)" : "translateY(0)",
					opacity: isPanelFolded && mobile ? 0.85 : 1,
				}}
			>
				<div
					className={`flex items-center justify-between px-4 py-3 border-b ${
						isDarkMode ? "border-white/20" : "border-black/10"
					} cursor-grab`}
					onPointerDown={handleToolbarDragStart}
				>
					<div className="flex items-center gap-2">
						<FaGripLinesVertical
							size={16}
							className={isDarkMode ? "text-white/60" : "text-black/60"}
						/>
						<h3
							className={`m-0 text-sm font-semibold ${
								isDarkMode ? "text-white" : "text-gray-800"
							}`}
						>
							Controls
						</h3>
					</div>
					<button
						onClick={handleTogglePanel}
						className={`bg-transparent border-none ${
							isDarkMode ? "text-white/60" : "text-black/60"
						} cursor-pointer p-1 rounded transition-all duration-300 ${
							isDarkMode
								? "hover:text-white/90 hover:bg-white/10"
								: "hover:text-black/90 hover:bg-black/10"
						}`}
					>
						{isPanelFolded ? (
							<FaChevronDown size={16} />
						) : (
							<FaChevronUp size={16} />
						)}
					</button>
				</div>

				{!isPanelFolded && (
					<div className="p-4 animate-fadeIn">
						<div className="mb-5">
							<h4 className="m-0 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-500">
								View
							</h4>
							<div className="flex gap-2 mb-3">
								<button
									onClick={() => setIs2D(true)}
									className={` border-none rounded-md px-4 py-2 text-xs font-semibold cursor-pointer transition-all duration-300 flex-1 ${
										is2D
											? "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
											: isDarkMode
											? "bg-white/10 text-white"
											: "bg-black/5 text-gray-800"
									}`}
									title="2D view"
								>
									2D
								</button>
								<button
									onClick={() => setIs2D(false)}
									className={` border-none rounded-md px-4 py-2 text-xs font-semibold cursor-pointer transition-all duration-300 flex-1 ${
										!is2D
											? "bg-gradient-to-br from-orange-500 to-orange-700 text-white"
											: isDarkMode
											? "bg-white/10 text-white"
											: "bg-black/5 text-gray-800"
									}`}
									title="3D view"
								>
									3D
								</button>
							</div>

							{!is2D && !mobile && (
								<div className="mt-3">
									<div className="flex items-center gap-2 mb-2">
										<FaUndoAlt size={14} className="text-orange-500" />
										<span
											className={`text-xs ${
												isDarkMode ? "text-white/80" : "text-gray-700"
											}`}
										>
											Rotation: {rotation3D.toFixed(0)}°
										</span>
									</div>
									<input
										type="range"
										min={0}
										max={360}
										step={5}
										value={rotation3D}
										onChange={(e) => setRotation3D(Number(e.target.value))}
										className="w-full h-1.5 rounded appearance-none outline-none cursor-pointer"
										style={{
											background: isDarkMode
												? "rgba(255, 255, 255, 0.2)"
												: "rgba(0, 0, 0, 0.1)",
											WebkitAppearance: "none",
										}}
									/>
								</div>
							)}

							<div className="mt-3">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<FaExpand size={14} className="text-blue-500" />
										<span
											className={`text-xs ${
												isDarkMode ? "text-white/80" : "text-gray-700"
											}`}
										>
											Zoom: {Math.round(zoomLevel * 100)}%
										</span>
									</div>
									<button
										onClick={handleZoomReset}
										className="text-xs bg-blue-500 hover:bg-blue-400 text-white px-2 py-0.5 rounded transition-colors"
									>
										Reset
									</button>
								</div>
								<div className="flex items-center gap-2">
									<button
										onClick={handleZoomOut}
										className="text-gray-400 hover:text-gray-200 transition-colors"
									>
										<FaMinus size={12} />
									</button>
									<input
										type="range"
										min={0.5}
										max={3}
										step={0.1}
										value={zoomLevel}
										onChange={(e) => setZoomLevel(Number(e.target.value))}
										className="flex-1 h-1.5 rounded appearance-none outline-none cursor-pointer"
										style={{
											background: isDarkMode
												? "rgba(255, 255, 255, 0.2)"
												: "rgba(0, 0, 0, 0.1)",
											WebkitAppearance: "none",
										}}
									/>
									<button
										onClick={handleZoomIn}
										className="text-gray-400 hover:text-gray-200 transition-colors"
									>
										<FaPlus size={12} />
									</button>
								</div>
							</div>
						</div>

						<div className="mb-5">
							<h4 className="m-0 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-500">
								Interaction
							</h4>
							<div className="grid grid-cols-2 gap-1.5">
								<button
									onClick={() => setInteractionMode("select")}
									className={`border-none rounded-md p-2 text-xs font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-1
                  ${
										interactionMode === "select"
											? "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
											: isDarkMode
											? "bg-white/10 text-white"
											: "bg-black/5 text-gray-800"
									}`}
									title="Select and move charges"
								>
									<FaHandLizard size={14} />
									Select
								</button>
								<button
									onClick={() => setInteractionMode("place")}
									className={`border-none rounded-md p-2 text-xs font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-1
                  ${
										interactionMode === "place"
											? "bg-gradient-to-br from-orange-500 to-orange-700 text-white"
											: isDarkMode
											? "bg-white/10 text-white"
											: "bg-black/5 text-gray-800"
									}`}
									title="Place charges"
								>
									<FaBolt size={14} />
									Place
								</button>
								<button
									onClick={() => setInteractionMode("delete")}
									className={`border-none rounded-md p-2 text-xs font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-1
                  ${
										interactionMode === "delete"
											? "bg-gradient-to-br from-red-500 to-red-700 text-white"
											: isDarkMode
											? "bg-white/10 text-white"
											: "bg-black/5 text-gray-800"
									}`}
									title="Delete charges"
								>
									<FaEraser size={14} />
									Delete
								</button>
								<button
									onClick={() => setInteractionMode("move")}
									className={`border-none rounded-md p-2 text-xs font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-1
                  ${
										interactionMode === "move"
											? "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white"
											: isDarkMode
											? "bg-white/10 text-white"
											: "bg-black/5 text-gray-800"
									}`}
									title="Move view"
								>
									<FaArrowsAlt size={14} />
									Move
								</button>
							</div>
						</div>

						<div className="mb-5">
							<div
								className={`text-xs ${
									isDarkMode ? "text-white/80" : "text-gray-600"
								} leading-relaxed p-2 rounded-md border ${
									isDarkMode ? "border-white/10" : "border-black/10"
								} ${isDarkMode ? "bg-gray-900/60" : "bg-white/60"}`}
							>
								{interactionMode === "select" && (
									<div>
										<div className="text-blue-500 font-semibold mb-1">
											Select Mode
										</div>
										{mobile
											? "Tap and drag charges to move them around the canvas."
											: "Click and drag charges to move them around the canvas."}
									</div>
								)}
								{interactionMode === "place" && (
									<div>
										<div className="text-orange-500 font-semibold mb-1">
											Place Mode
										</div>
										{mobile ? (
											<>
												<div className="mb-1">• Tap: Place negative charge</div>
												<div className="mb-1">
													• Hold Alt + Tap: Place positive charge
												</div>
												<div>• Drag while placing: Adjust magnitude</div>
											</>
										) : (
											<>
												<div className="mb-1">
													• Right-click: Place positive charge
												</div>
												<div className="mb-1">
													• Left-click: Place negative charge
												</div>
												<div>• Drag while placing: Adjust magnitude</div>
											</>
										)}
									</div>
								)}
								{interactionMode === "delete" && (
									<div>
										<div className="text-red-500 font-semibold mb-1">
											Delete Mode
										</div>
										{mobile
											? "Tap on any charge to remove it from the simulation."
											: "Click on any charge to remove it from the simulation."}
									</div>
								)}
								{interactionMode === "move" && (
									<div>
										<div className="text-emerald-500 font-semibold mb-1">
											Move Mode
										</div>
										{mobile
											? "Touch and drag to pan around the simulation view."
											: "Left-click and drag to pan around the simulation view."}
									</div>
								)}
							</div>
						</div>

						<div>
							<h4 className="m-0 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-500">
								Actions
							</h4>
							<button
								onClick={handleClearAll}
								className={`w-full ${
									isDarkMode
										? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500/50"
										: "bg-red-500/5 hover:bg-red-500/10 text-red-600 border border-red-500/20 hover:border-red-500/30"
								} rounded-md py-2 px-3 cursor-pointer text-xs font-semibold transition-all flex items-center justify-center gap-1.5`}
								title="Clear all charges"
							>
								<FaTrashAlt size={14} />
								Clear All
							</button>
						</div>
					</div>
				)}

				{isPanelFolded && (
					<div className="p-3 flex gap-1 justify-center animate-fadeIn">
						<button
							onClick={() => setInteractionMode("select")}
							className={`bg-transparent border-none rounded-md p-2 cursor-pointer transition-all duration-300 flex items-center justify-center
              ${
								interactionMode === "select"
									? "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
									: isDarkMode
									? "bg-white/10 text-white"
									: "bg-black/5 text-gray-800"
							}`}
							title="Select and move charges"
						>
							<FaHandLizard size={14} />
						</button>
						<button
							onClick={() => setInteractionMode("place")}
							className={`bg-transparent border-none rounded-md p-2 cursor-pointer transition-all duration-300 flex items-center justify-center
              ${
								interactionMode === "place"
									? "bg-gradient-to-br from-yellow-500 to-yellow-700 text-white"
									: isDarkMode
									? "bg-white/10 text-white"
									: "bg-black/5 text-gray-800"
							}`}
							title="Place charges"
						>
							<FaBolt size={14} />
						</button>
						<button
							onClick={() => setInteractionMode("delete")}
							className={`bg-transparent border-none rounded-md p-2 cursor-pointer transition-all duration-300 flex items-center justify-center
              ${
								interactionMode === "delete"
									? "bg-gradient-to-br from-red-600 to-red-700 text-white"
									: isDarkMode
									? "bg-white/10 text-white"
									: "bg-black/5 text-gray-800"
							}`}
							title="Delete charges"
						>
							<FaEraser size={14} />
						</button>
						<button
							onClick={() => setInteractionMode("move")}
							className={`bg-transparent border-none rounded-md p-2 cursor-pointer transition-all duration-300 flex items-center justify-center
              ${
								interactionMode === "move"
									? "bg-gradient-to-br from-green-600 to-green-700 text-white"
									: isDarkMode
									? "bg-white/10 text-white"
									: "bg-black/5 text-gray-800"
							}`}
							title="Move view"
						>
							<FaArrowsAlt size={14} />
						</button>
					</div>
				)}
			</div>

			{selectedId != null && (
				<div
					className={`absolute z-20 p-5 ${
						mobile ? "min-w-65" : "min-w-75"
					} rounded-xl ${
						isSelectedPanelReady ? "visible animate-fadeIn" : "invisible"
					} ${PANEL_BG_CLASS} border ${
						isDarkMode ? "border-white/20" : "border-black/10"
					} shadow-lg transition-colors duration-300`}
					style={{
						top: `${selectedPanelPosition.y}px`,
						left: `${selectedPanelPosition.x}px`,
					}}
				>
					<div className="flex items-center justify-between mb-4">
						<h4 className="text-base font-bold text-blue-500 m-0 flex items-center gap-2">
							<FaBolt size={18} />
							Selected Charge
						</h4>
						<button
							onClick={() => {
								setSelectedId(null);
								setIsSelectedPanelReady(false);
							}}
							className={`bg-transparent border-none ${
								isDarkMode
									? "text-white/60 hover:text-white/90"
									: "text-black/60 hover:text-black/90"
							} cursor-pointer p-1 transition-colors`}
						>
							<FaTimes size={18} />
						</button>
					</div>

					<ChargeInfoDisplay
						charge={charges.find((c) => c.id === selectedId)!}
						mobile={mobile}
					/>

					<div className="mt-4">
						<label
							className={`${
								isDarkMode ? "text-white" : "text-gray-800"
							} font-medium text-sm flex items-center gap-2 mb-3`}
						>
							<FaRuler size={16} />
							Magnitude:{" "}
							{Number(
								charges.find((c) => c.id === selectedId)?.magnitude
							).toFixed(2)}{" "}
							µC
						</label>
						<input
							type="range"
							min={-10}
							max={10}
							step={0.1}
							value={charges.find((c) => c.id === selectedId)?.magnitude || 0}
							onChange={(e) => handleMagnitudeChange(Number(e.target.value))}
							className="w-full h-1.5 rounded-full appearance-none outline-none cursor-pointer"
							style={{
								background: isDarkMode
									? "rgba(255, 255, 255, 0.2)"
									: "rgba(0, 0, 0, 0.1)",
								WebkitAppearance: "none",
							}}
						/>
					</div>

					<button
						onClick={handleRemoveCharge}
						className={`w-full mt-4 bg-gradient-to-br from-yellow-500 to-yellow-700 text-white border ${
							isDarkMode ? "border-white/20" : "border-black/10"
						} rounded-xl py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl`}
					>
						<FaTrashAlt size={16} />
						Remove Charge
					</button>
				</div>
			)}
		</div>
	);
}

function HomePage({
	onTabChange,
	isDarkMode,
}: {
	onTabChange: (tab: string) => void;
	isDarkMode: boolean;
}) {
	const GLASS_STYLES_CLASS = isDarkMode
		? "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
		: "bg-black/5 backdrop-blur-md border border-black/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)]";

	return (
		<main className="pt-12 pb-10">
			<section className="relative flex flex-col items-center justify-center py-10 px-5 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
					<div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-500/30 animate-pulse"></div>
					<div
						className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/20 animate-pulse"
						style={{ animationDelay: "1s" }}
					></div>
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-500/10 animate-pulse"
						style={{ animationDelay: "2s" }}
					></div>
				</div>

				<div
					className={`py-16 px-8 md:px-12 max-w-5xl mx-auto ${
						isDarkMode ? "bg-white/5" : "bg-black/5"
					} ${GLASS_STYLES_CLASS} transition-colors duration-300 relative z-10`}
				>
					<div className="flex flex-col md:flex-row items-center gap-8">
						<div className="flex-1">
							<h1
								className={`font-black mb-6 ${
									isDarkMode ? "text-white" : "text-gray-800"
								} text-[clamp(2.5rem,5vw,4rem)] leading-tight transition-colors duration-300`}
							>
								<span className="text-blue-500">Quantum</span>Field
								<br />
								<span className="text-2xl md:text-3xl font-bold">
									Interactive Physics Simulator
								</span>
							</h1>

							<p
								className={`${
									isDarkMode ? "text-white/90" : "text-gray-700"
								} text-lg leading-relaxed mb-8 transition-colors duration-300`}
							>
								Visualize and interact with electric fields in real-time.
								Experience physics like never before with our advanced 2D and 3D
								simulator. Perfect for students, educators, and physics
								enthusiasts.
							</p>

							<div className="flex flex-wrap gap-4">
								<button
									onClick={() => onTabChange("simulator")}
									className="inline-block cursor-pointer py-4 px-8 text-white no-underline rounded-xl text-lg font-semibold border border-white/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg hover:shadow-xl"
								>
									Launch Simulator
								</button>

								<button
									onClick={() => onTabChange("how-it-works")}
									className={`inline-block py-4 px-8 ${
										isDarkMode
											? "text-white border-white/30"
											: "text-gray-800 border-black/20"
									} no-underline rounded-xl text-lg font-semibold border backdrop-blur-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
										isDarkMode
											? "bg-white/10 hover:bg-white/15"
											: "bg-black/5 hover:bg-black/10"
									}`}
								>
									How It Works
								</button>
							</div>
						</div>

						<div className="relative w-full md:w-2/5 h-64 md:h-80">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-xl animate-pulse"></div>
							<div
								className={`absolute inset-2 ${GLASS_STYLES_CLASS} rounded-xl flex items-center justify-center overflow-hidden`}
							>
								<FaAtom
									className="text-9xl text-blue-500/50 animate-spin"
									style={{ animationDuration: "15s" }}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 px-5">
				<div className="max-w-6xl mx-auto">
					<h2
						className={`text-center text-3xl md:text-4xl font-bold mb-12 ${
							isDarkMode ? "text-white" : "text-gray-800"
						}`}
					>
						Key Features
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								title: "Interactive Physics",
								description:
									"Place charges with intuitive click and drag mechanics. Watch electric fields update in real-time as you modify charge positions and magnitudes.",
								icon: <FaBolt size={48} className="text-blue-500" />,
							},
							{
								title: "2D & 3D Views",
								description:
									"Toggle between traditional 2D field line visualization and immersive 3D perspective views with intuitive gesture controls for rotation and zoom.",
								icon: <FaCube size={48} className="text-blue-500" />,
							},
							{
								title: "Educational Focus",
								description:
									"Perfect for physics students and educators. Visualize concepts like field strength, superposition, and charge interactions in an engaging way.",
								icon: <FaGraduationCap size={48} className="text-blue-500" />,
							},
						].map((feature, index) => (
							<div
								key={index}
								className={`${GLASS_STYLES_CLASS} p-8 text-center ${
									isDarkMode ? "bg-white/5" : "bg-black/5"
								} transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl`}
							>
								<div className="flex justify-center items-center h-24 mb-6">
									<div className="relative">
										<div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl transform scale-75"></div>
										{feature.icon}
									</div>
								</div>
								<h3 className="text-2xl font-bold mb-4 text-blue-500">
									{feature.title}
								</h3>
								<p
									className={`text-base leading-relaxed ${
										isDarkMode ? "text-white/80" : "text-gray-700"
									} transition-colors duration-300`}
								>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 px-5 bg-gradient-to-br from-blue-900/30 to-purple-900/30">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row items-center gap-12">
						<div className="md:w-1/2">
							<h2
								className={`text-3xl md:text-4xl font-bold mb-6 ${
									isDarkMode ? "text-white" : "text-gray-800"
								}`}
							>
								Learn Physics Through Visualization
							</h2>
							<p
								className={`text-lg mb-6 ${
									isDarkMode ? "text-white/90" : "text-gray-700"
								}`}
							>
								Our powerful visualization engine makes abstract concepts
								tangible. See electric fields come to life as you place and
								manipulate charges in both 2D and 3D space.
							</p>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
								{[
									{ icon: <FaUniversity />, text: "Perfect for classrooms" },
									{ icon: <FaLaptopCode />, text: "Interactive learning" },
									{ icon: <FaLightbulb />, text: "Build intuition" },
									{ icon: <FaBook />, text: "Supplement textbooks" },
								].map((item, i) => (
									<div key={i} className="flex items-center gap-3">
										<div className="text-blue-500 text-xl">{item.icon}</div>
										<span
											className={isDarkMode ? "text-white/90" : "text-gray-700"}
										>
											{item.text}
										</span>
									</div>
								))}
							</div>

							<button
								onClick={() => onTabChange("simulator")}
								className="inline-block py-3 px-6 text-white no-underline rounded-lg text-base font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg hover:shadow-xl"
							>
								Start Exploring
							</button>
						</div>

						<div className="md:w-1/2">
							<div className={`${GLASS_STYLES_CLASS} p-8 rounded-2xl`}>
								<div className="aspect-video bg-black/80 rounded-lg overflow-hidden relative mb-4">
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="relative w-3/4 h-3/4">
											<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-blue-500/80 animate-pulse"></div>
											<div
												className="absolute left-1/4 top-1/3 w-16 h-16 rounded-full bg-orange-500/80 animate-pulse"
												style={{ animationDelay: "0.5s" }}
											></div>
											<div
												className="absolute right-1/4 bottom-1/3 w-12 h-12 rounded-full bg-blue-500/80 animate-pulse"
												style={{ animationDelay: "1s" }}
											></div>

											{Array.from({ length: 12 }).map((_, i) => (
												<div
													key={i}
													className="absolute left-1/2 top-1/2 h-0.5 bg-white/30 origin-left"
													style={{
														width: "120px",
														transform: `rotate(${i * 30}deg)`,
													}}
												></div>
											))}
										</div>
									</div>
								</div>

								<h3
									className={`text-xl font-bold mb-2 ${
										isDarkMode ? "text-white" : "text-gray-800"
									}`}
								>
									Interactive Simulations
								</h3>
								<p
									className={`${
										isDarkMode ? "text-white/80" : "text-gray-700"
									} text-sm`}
								>
									Experiment with different charge configurations and see how
									electric fields respond in real-time. Perfect for
									understanding complex physics concepts through hands-on
									exploration.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 px-5">
				<div className="max-w-4xl mx-auto text-center">
					<h2
						className={`text-3xl md:text-4xl font-bold mb-8 ${
							isDarkMode ? "text-white" : "text-gray-800"
						}`}
					>
						Ready to Experience Physics in a New Dimension?
					</h2>

					<div
						className={`${GLASS_STYLES_CLASS} p-10 ${
							isDarkMode ? "bg-white/5" : "bg-black/5"
						} mb-10`}
					>
						<p
							className={`text-xl italic mb-6 ${
								isDarkMode ? "text-white/90" : "text-gray-700"
							}`}
						>
							"QuantumField Visualizer has transformed how I teach
							electromagnetic concepts in my physics classes. Students now
							actively engage with the material through hands-on
							experimentation."
						</p>
						<div className={isDarkMode ? "text-white/80" : "text-gray-600"}>
							- Dr. Emily Chen, Physics Professor
						</div>
					</div>

					<button
						onClick={() => onTabChange("simulator")}
						className="inline-block py-4 px-10 text-white no-underline rounded-xl text-xl font-semibold border border-white/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg hover:shadow-xl"
					>
						Launch Simulator Now
					</button>
				</div>
			</section>
		</main>
	);
}

export default function ElectricFieldSimulationExport() {
	const [activeTab, setActiveTab] = useState("home");
	const [isDarkMode, setIsDarkMode] = useState(true);

	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
    
      ::-webkit-scrollbar-track {
        background: ${
					isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
				};
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: ${
					isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
				};
        border-radius: 10px;
        transition: background 0.3s;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${
					isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"
				};
      }
      
      
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      
      body {
        font-family: 'Poppins', sans-serif;
      }
      
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .animate-pulse {
        animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.3; }
      }
      
      .animate-spin {
        animation: spin 15s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
		document.head.appendChild(style);

		return () => {
			document.head.removeChild(style);
		};
	}, [isDarkMode]);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	const toggleDarkMode = () => {
		setIsDarkMode((prev) => !prev);
	};

	const renderContent = () => {
		switch (activeTab) {
			case "home":
				return (
					<HomePage onTabChange={handleTabChange} isDarkMode={isDarkMode} />
				);
			case "how-it-works":
				return (
					<HowItWorksPage
						onTabChange={handleTabChange}
						isDarkMode={isDarkMode}
					/>
				);
			case "simulator":
				return <SimulatorPage isDarkMode={isDarkMode} />;
			default:
				return (
					<HomePage onTabChange={handleTabChange} isDarkMode={isDarkMode} />
				);
		}
	};

	return (
		<div
			className={`min-h-screen ${
				isDarkMode ? "text-white" : "text-gray-800"
			} relative overflow-hidden transition-colors duration-500 ${
				isDarkMode
					? "bg-gradient-to-br from-black via-gray-900 to-black"
					: "bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100"
			}`}
		>
			<div
				className={`absolute inset-0 pointer-events-none ${
					isDarkMode
						? "bg-[radial-gradient(circle_at_25%_25%,#4285F415_0%,transparent_50%),radial-gradient(circle_at_75%_75%,#FA7B1715_0%,transparent_50%)]"
						: "bg-[radial-gradient(circle_at_25%_25%,#4285F410_0%,transparent_50%),radial-gradient(circle_at_75%_75%,#FA7B1710_0%,transparent_50%)]"
				}`}
			/>

			<Navbar
				activeTab={activeTab}
				onTabChange={handleTabChange}
				isDarkMode={isDarkMode}
				toggleDarkMode={toggleDarkMode}
			/>

			{renderContent()}

			<Footer isDarkMode={isDarkMode} onTabChange={handleTabChange} />
			<style jsx global>
				{`
					button,
					a {
						cursor: pointer;
					}
				`}
			</style>
		</div>
	);
}
