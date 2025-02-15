"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

<style jsx global>{`
	html,
	body,
	#__next {
		height: 100%;
		margin: 0;
		padding: 0;
	}
`}</style>;

const BinaryStarSimulator = () => {
	const [massRatio, setMassRatio] = useState(0.5);
	const [simulationSpeed, setSimulationSpeed] = useState(1);
	const [showLagrangianPoints, setShowLagrangianPoints] = useState(true);
	const [showOrbitPaths, setShowOrbitPaths] = useState(true);
	const [isPlaying, setIsPlaying] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const [activeTab, setActiveTab] = useState("simulation");
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);
	const [expandedSection, setExpandedSection] = useState<string | null>(
		"massControls"
	);
	const [showNebula, setShowNebula] = useState(true);
	const [showControlsPanel, setShowControlsPanel] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationRef = useRef<number | null>(null);

	interface Particle {
		x: number;
		y: number;
		size: number;
		speed: number;
		angle: number;
		opacity: number;
	}

	const particlesRef = useRef<Particle[]>([]);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};

		checkIsMobile();
		window.addEventListener("resize", checkIsMobile);

		for (let i = 0; i < 200; i++) {
			particlesRef.current.push({
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				size: Math.random() * 2,
				speed: 0.02 + Math.random() * 0.05,
				angle: Math.random() * Math.PI * 2,
				opacity: 0.1 + Math.random() * 0.4,
			});
		}

		return () => {
			window.removeEventListener("resize", checkIsMobile);
		};
	}, []);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			const parent = canvas.parentElement;
			if (!parent) return;

			const isMobileDevice = window.innerWidth < 768;
			const pixelRatio = isMobileDevice
				? Math.min(window.devicePixelRatio, 2)
				: window.devicePixelRatio;

			canvas.width = parent.clientWidth * pixelRatio;
			canvas.height = parent.clientHeight * pixelRatio;
			canvas.style.width = `${parent.clientWidth}px`;
			canvas.style.height = `${parent.clientHeight}px`;
			ctx.scale(pixelRatio, pixelRatio);
		};

		const timeoutId = setTimeout(() => {
			resizeCanvas();
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			startAnimation();
		}, 100);

		window.addEventListener("resize", resizeCanvas);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("resize", resizeCanvas);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [
		massRatio,
		simulationSpeed,
		showLagrangianPoints,
		showOrbitPaths,
		showNebula,
		isMobile,
		activeTab,
	]);

	const startAnimation = () => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let time = 0;

		const animate = () => {
			if (isPlaying) {
				time += 0.008 * simulationSpeed;
			}

			const width = canvas.clientWidth;
			const height = canvas.clientHeight;

			ctx.clearRect(0, 0, width, height);

			drawBackground(ctx, width, height, time);
			updateParticles(ctx, width, height);

			const star1Mass = 1 - massRatio;
			const star2Mass = massRatio;
			const totalMass = star1Mass + star2Mass;

			const centerX = width / 2;
			const centerY = height / 2;
			const orbitRadius = Math.min(width, height) * 0.3;

			const star1X =
				centerX - ((orbitRadius * star2Mass) / totalMass) * Math.cos(time);
			const star1Y =
				centerY - ((orbitRadius * star2Mass) / totalMass) * Math.sin(time);

			const star2X =
				centerX + ((orbitRadius * star1Mass) / totalMass) * Math.cos(time);
			const star2Y =
				centerY + ((orbitRadius * star1Mass) / totalMass) * Math.sin(time);

			if (showOrbitPaths) {
				drawOrbitPaths(
					ctx,
					centerX,
					centerY,
					(orbitRadius * star2Mass) / totalMass,
					(orbitRadius * star1Mass) / totalMass
				);
			}

			drawStar(ctx, star1X, star1Y, 8 + star1Mass * 20, "#ff6b35", "#ff9500");
			drawStar(ctx, star2X, star2Y, 8 + star2Mass * 20, "#00ffff", "#0099ff");

			if (showLagrangianPoints) {
				drawLagrangianPoints(
					ctx,
					star1X,
					star1Y,
					star2X,
					star2Y,
					star1Mass,
					star2Mass
				);
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();
	};

	const drawBackground = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		time: number
	) => {
		const gradient = ctx.createLinearGradient(0, 0, width, height);
		gradient.addColorStop(0, "#0a0a0f");
		gradient.addColorStop(0.3, "#1a1a2e");
		gradient.addColorStop(0.7, "#16213e");
		gradient.addColorStop(1, "#0a0a0f");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		if (showNebula) {
			const nebulaGradient = ctx.createRadialGradient(
				width * 0.8,
				height * 0.2,
				0,
				width * 0.8,
				height * 0.2,
				width * 0.6
			);

			nebulaGradient.addColorStop(0, "rgba(139, 92, 246, 0.15)");
			nebulaGradient.addColorStop(0.4, "rgba(255, 107, 53, 0.08)");
			nebulaGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

			ctx.fillStyle = nebulaGradient;
			ctx.fillRect(0, 0, width, height);

			const nebulaGradient2 = ctx.createRadialGradient(
				width * 0.1,
				height * 0.8,
				0,
				width * 0.1,
				height * 0.8,
				width * 0.5
			);

			nebulaGradient2.addColorStop(0, "rgba(0, 255, 255, 0.12)");
			nebulaGradient2.addColorStop(0.5, "rgba(0, 153, 255, 0.06)");
			nebulaGradient2.addColorStop(1, "rgba(0, 0, 0, 0)");

			ctx.fillStyle = nebulaGradient2;
			ctx.fillRect(0, 0, width, height);
		}

		for (let i = 0; i < 150; i++) {
			const x =
				(Math.sin(time * 0.01 + i) * 50 + Math.random() * width) % width;
			const y =
				(Math.cos(time * 0.01 + i * 0.5) * 30 + Math.random() * height) %
				height;
			const radius = Math.random() * 1.5;
			const brightness =
				0.3 + Math.random() * 0.7 + Math.sin(time * 2 + i) * 0.2;

			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, brightness)})`;
			ctx.fill();
		}
	};

	const updateParticles = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number
	) => {
		particlesRef.current.forEach((particle) => {
			particle.x += Math.cos(particle.angle) * particle.speed;
			particle.y += Math.sin(particle.angle) * particle.speed;

			if (particle.x < 0) particle.x = width;
			if (particle.x > width) particle.x = 0;
			if (particle.y < 0) particle.y = height;
			if (particle.y > height) particle.y = 0;

			ctx.beginPath();
			ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
			ctx.fill();
		});
	};

	const drawStar = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		radius: number,
		coreColor: string,
		glowColor: string
	) => {
		const gradient = ctx.createRadialGradient(
			x,
			y,
			radius * 0.1,
			x,
			y,
			radius * 3
		);
		gradient.addColorStop(0, coreColor);
		gradient.addColorStop(0.3, glowColor);
		gradient.addColorStop(0.6, `${glowColor}40`);
		gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

		ctx.beginPath();
		ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
		ctx.fillStyle = gradient;
		ctx.fill();

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fillStyle = coreColor;
		ctx.fill();

		const spikes = 8;
		for (let i = 0; i < spikes; i++) {
			const angle = (i * Math.PI * 2) / spikes;
			const x1 = x + Math.cos(angle) * radius * 0.5;
			const y1 = y + Math.sin(angle) * radius * 0.5;
			const x2 = x + Math.cos(angle) * radius * 2;
			const y2 = y + Math.sin(angle) * radius * 2;

			const spikeGradient = ctx.createLinearGradient(x1, y1, x2, y2);
			spikeGradient.addColorStop(0, `${coreColor}80`);
			spikeGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.strokeStyle = spikeGradient;
			ctx.lineWidth = 2;
			ctx.stroke();
		}
	};

	const drawOrbitPaths = (
		ctx: CanvasRenderingContext2D,
		centerX: number,
		centerY: number,
		radius1: number,
		radius2: number
	) => {
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius1, 0, Math.PI * 2);
		ctx.strokeStyle = "rgba(255, 107, 53, 0.4)";
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 10]);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius2, 0, Math.PI * 2);
		ctx.strokeStyle = "rgba(0, 255, 255, 0.4)";
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 10]);
		ctx.stroke();

		ctx.setLineDash([]);
	};

	const drawLagrangianPoints = (
		ctx: CanvasRenderingContext2D,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		m1: number,
		m2: number
	) => {
		const r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		if (!isFinite(r) || r < 1e-6) return;

		const mu = m2 / (m1 + m2);

		const dx = (x2 - x1) / r;
		const dy = (y2 - y1) / r;

		const rL1 = r * (1 - Math.pow(m2 / (3 * (m1 + m2)), 1 / 3));
		const L1x = x1 + rL1 * dx;
		const L1y = y1 + rL1 * dy;

		const rL2 = r * (1 + Math.pow(m2 / (3 * (m1 + m2)), 1 / 3));
		const L2x = x1 + rL2 * dx;
		const L2y = y1 + rL2 * dy;

		const rL3 = r * (-1 + Math.pow(m1 / (3 * (m1 + m2)), 1 / 3));
		const L3x = x1 + rL3 * dx;
		const L3y = y1 + rL3 * dy;

		const L4x = x1 + r * (0.5 - mu) * dx - ((r * Math.sqrt(3)) / 2) * dy;
		const L4y = y1 + r * (0.5 - mu) * dy + ((r * Math.sqrt(3)) / 2) * dx;

		const L5x = x1 + r * (0.5 - mu) * dx + ((r * Math.sqrt(3)) / 2) * dy;
		const L5y = y1 + r * (0.5 - mu) * dy - ((r * Math.sqrt(3)) / 2) * dx;

		drawLagrangianPoint(ctx, L1x, L1y, "L1", "#ff6b35");
		drawLagrangianPoint(ctx, L2x, L2y, "L2", "#00ffff");
		drawLagrangianPoint(ctx, L3x, L3y, "L3", "#8b5cf6");
		drawLagrangianPoint(ctx, L4x, L4y, "L4", "#22d3ee");
		drawLagrangianPoint(ctx, L5x, L5y, "L5", "#a855f7");
	};

	const drawLagrangianPoint = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		label: string,
		color: string
	) => {
		const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
		gradient.addColorStop(0, color);
		gradient.addColorStop(0.6, `${color}60`);
		gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

		ctx.beginPath();
		ctx.arc(x, y, 12, 0, Math.PI * 2);
		ctx.fillStyle = gradient;
		ctx.fill();

		ctx.beginPath();
		ctx.arc(x, y, 5, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();

		ctx.beginPath();
		ctx.arc(x, y, 8, 0, Math.PI * 2);
		ctx.strokeStyle = `${color}80`;
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.font = "bold 14px Inter";
		ctx.fillStyle = color;
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.fillText(label, x, y - 15);
	};

	const exportSimulation = () => {
		const simulationState = {
			massRatio,
			simulationSpeed,
			showLagrangianPoints,
			showOrbitPaths,
			isPlaying,
			showNebula,
			timestamp: new Date().toISOString(),
		};

		const dataStr = JSON.stringify(simulationState, null, 2);
		const dataUri =
			"data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

		const exportName = `binary-star-${Date.now()}.json`;

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportName);
		linkElement.click();

		setIsExportModalOpen(false);
		toast.success("🚀 Simulation exported successfully!", {
			style: {
				background: "rgba(10, 10, 15, 0.95)",
				color: "#00ffff",
				border: "1px solid #00ffff40",
				borderRadius: "12px",
				backdropFilter: "blur(20px)",
			},
		});
	};

	const importSimulation = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const contents = e.target?.result;
				let simulationState;
				if (typeof contents === "string") {
					simulationState = JSON.parse(contents);
				} else if (contents instanceof ArrayBuffer) {
					simulationState = JSON.parse(new TextDecoder().decode(contents));
				} else {
					throw new Error("Invalid file contents");
				}

				setMassRatio(simulationState.massRatio);
				setSimulationSpeed(simulationState.simulationSpeed);
				setShowLagrangianPoints(simulationState.showLagrangianPoints);
				setShowOrbitPaths(simulationState.showOrbitPaths);
				setIsPlaying(simulationState.isPlaying);
				if (simulationState.showNebula !== undefined) {
					setShowNebula(simulationState.showNebula);
				}

				toast.success("✨ Simulation imported successfully!", {
					style: {
						background: "rgba(10, 10, 15, 0.95)",
						color: "#00ffff",
						border: "1px solid #00ffff40",
						borderRadius: "12px",
						backdropFilter: "blur(20px)",
					},
				});
			} catch (error) {
				toast.error("❌ Failed to import simulation!", {
					style: {
						background: "rgba(10, 10, 15, 0.95)",
						color: "#ff6b35",
						border: "1px solid #ff6b3540",
						borderRadius: "12px",
						backdropFilter: "blur(20px)",
					},
				});
			}
		};

		reader.readAsText(file);
	};

	const togglePlayPause = () => {
		if (isPlaying) {
			setIsPlaying(false);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}
			toast.info("⏸️ Simulation paused", {
				style: {
					background: "rgba(10, 10, 15, 0.95)",
					color: "#8b5cf6",
					border: "1px solid #8b5cf640",
					borderRadius: "12px",
					backdropFilter: "blur(20px)",
				},
			});
		} else {
			setIsPlaying(true);
			startAnimation();
			toast.info("▶️ Simulation resumed", {
				style: {
					background: "rgba(10, 10, 15, 0.95)",
					color: "#8b5cf6",
					border: "1px solid #8b5cf640",
					borderRadius: "12px",
					backdropFilter: "blur(20px)",
				},
			});
		}
	};

	const toggleSection = (section: string | null) => {
		if (expandedSection === section) {
			setExpandedSection(null);
		} else {
			setExpandedSection(section);
		}
	};

	const renderSimulation = () => (
		<div className="relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 via-slate-900/30 to-black/50 backdrop-blur-xl border border-white/10 shadow-2xl">
			<canvas ref={canvasRef} className="w-full h-full" />

			<div className="absolute top-6 left-6 right-6 flex justify-between items-start">
				<div className="bg-black/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
					<div className="text-xs text-cyan-300 font-mono">SYSTEM STATUS</div>
					<div className="text-sm text-white font-semibold">
						{isPlaying ? "🟢 ACTIVE" : "🔴 PAUSED"}
					</div>
				</div>

				<div className="bg-black/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
					<div className="text-xs text-cyan-300 font-mono">SPEED</div>
					<div className="text-sm text-white font-semibold">
						{simulationSpeed.toFixed(1)}x
					</div>
				</div>
			</div>

			<div className="absolute bottom-0 left-6 right-6 flex justify-center">
				<div className="flex items-center space-x-2 sm:space-x-3 bg-black/20 backdrop-blur-xl rounded-2xl px-3 sm:px-6 py-2 sm:py-3 border border-white/10">
					<div className="relative group">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={togglePlayPause}
							className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
						>
							{isPlaying ? (
								<svg
									className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							) : (
								<svg
									className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</motion.button>
						<div className="cursor-pointer absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
							{isPlaying ? "Pause Simulation" : "Play Simulation"}
						</div>
					</div>

					<div className="relative group">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowLagrangianPoints(!showLagrangianPoints)}
							className={`cursor-pointer flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-300 ${
								showLagrangianPoints
									? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
									: "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
							}`}
						>
							<svg
								className="w-5 h-5 sm:w-6 sm:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<circle cx="12" cy="12" r="3" />
								<circle cx="12" cy="6" r="1" />
								<circle cx="12" cy="18" r="1" />
								<circle cx="6" cy="12" r="1" />
								<circle cx="18" cy="12" r="1" />
							</svg>
						</motion.button>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
							{showLagrangianPoints ? "Hide" : "Show"} Lagrangian Points
						</div>
					</div>

					<div className="relative group">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowOrbitPaths(!showOrbitPaths)}
							className={`cursor-pointer flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-300 ${
								showOrbitPaths
									? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
									: "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
							}`}
						>
							<svg
								className="w-5 h-5 sm:w-6 sm:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth="2"
							>
								<ellipse cx="12" cy="12" rx="8" ry="4" />
								<ellipse cx="12" cy="12" rx="4" ry="8" />
							</svg>
						</motion.button>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
							{showOrbitPaths ? "Hide" : "Show"} Orbit Paths
						</div>
					</div>

					<div className="relative group">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowNebula(!showNebula)}
							className={`cursor-pointer flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-300 ${
								showNebula
									? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
									: "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
							}`}
						>
							<svg
								className="w-5 h-5 sm:w-6 sm:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth="2"
							>
								<path d="M2.5 16.88a1 1 0 01-.32-1.43l9-13.02a1 1 0 011.64 0l9 13.02a1 1 0 01-.32 1.43l-8.48 4.85a1 1 0 01-.96 0L2.5 16.88z" />
								<path d="M12 2v20" />
							</svg>
						</motion.button>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
							{showNebula ? "Hide" : "Show"} Cosmic Background
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderControls = () => (
		<div className="w-full h-full flex flex-col space-y-6 p-6 overflow-y-auto bg-gradient-to-br from-gray-900/50 via-slate-900/30 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
			<div className="flex items-center space-x-3 mb-4">
				<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
					<svg
						className="w-5 h-5 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<h2 className="text-xl font-bold text-white">Simulation Controls</h2>
			</div>

			<motion.div
				className="overflow-hidden rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
				initial={{
					height: expandedSection === "massControls" ? "auto" : "4rem",
				}}
				animate={{
					height: expandedSection === "massControls" ? "auto" : "4rem",
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			>
				<button
					onClick={() => toggleSection("massControls")}
					className="w-full flex items-center justify-between p-4 text-white font-semibold hover:bg-white/5 transition-all duration-300 group"
				>
					<span className="flex items-center">
						<div className="w-6 h-6 rounded bg-gradient-to-r from-orange-500 to-red-500 mr-3 flex items-center justify-center">
							<svg
								className="w-4 h-4 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" />
							</svg>
						</div>
						<div className="text-left">
							<div className="font-semibold">Mass Distribution</div>
							<div className="text-xs text-gray-400 font-normal">
								Adjust star mass ratio
							</div>
						</div>
					</span>
					<motion.svg
						className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300"
						animate={{ rotate: expandedSection === "massControls" ? 180 : 0 }}
						transition={{ duration: 0.3 }}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</motion.svg>
				</button>
				{expandedSection === "massControls" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="p-4 pt-0 space-y-6"
					>
						<div className="grid grid-cols-2 gap-4 mb-4">
							<div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 border border-orange-500/30">
								<div className="text-xs text-orange-300 font-mono uppercase">
									Primary Star
								</div>
								<div className="text-2xl font-bold text-white font-mono">
									{Math.round((1 - massRatio) * 100)}%
								</div>
							</div>
							<div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-3 border border-cyan-500/30">
								<div className="text-xs text-cyan-300 font-mono uppercase">
									Secondary Star
								</div>
								<div className="text-2xl font-bold text-white font-mono">
									{Math.round(massRatio * 100)}%
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<div className="relative">
								<input
									type="range"
									min="0.1"
									max="0.9"
									step="0.01"
									value={massRatio}
									onChange={(e) => setMassRatio(parseFloat(e.target.value))}
									className="w-full h-3 bg-gradient-to-r from-orange-500 via-yellow-500 to-cyan-500 rounded-full appearance-none cursor-pointer slider"
								/>
							</div>
							<div className="flex justify-between gap-8 text-xs text-gray-400 font-mono">
								<span>Primary Dominant</span>
								<span>Secondary Dominant</span>
							</div>
						</div>
					</motion.div>
				)}
			</motion.div>

			<motion.div
				className="overflow-hidden rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
				initial={{
					height: expandedSection === "speedControls" ? "auto" : "4rem",
				}}
				animate={{
					height: expandedSection === "speedControls" ? "auto" : "4rem",
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			>
				<button
					onClick={() => toggleSection("speedControls")}
					className="w-full flex items-center justify-between p-4 text-white font-semibold hover:bg-white/5 transition-all duration-300 group"
				>
					<span className="flex items-center">
						<div className="w-6 h-6 rounded bg-gradient-to-r from-teal-500 to-cyan-500 mr-3 flex items-center justify-center">
							<svg
								className="w-4 h-4 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="text-left">
							<div className="font-semibold">Simulation Speed</div>
							<div className="text-xs text-gray-400 font-normal">
								Control animation velocity
							</div>
						</div>
					</span>
					<motion.svg
						className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300"
						animate={{ rotate: expandedSection === "speedControls" ? 180 : 0 }}
						transition={{ duration: 0.3 }}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</motion.svg>
				</button>
				{expandedSection === "speedControls" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="p-4 pt-0 space-y-6"
					>
						<div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-lg p-3 border border-teal-500/30">
							<div className="text-xs text-teal-300 font-mono uppercase">
								Current Speed
							</div>
							<div className="text-2xl font-bold text-white font-mono">
								{simulationSpeed.toFixed(1)}x
							</div>
						</div>

						<div className="space-y-3">
							<input
								type="range"
								min="0.1"
								max="3"
								step="0.1"
								value={simulationSpeed}
								onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
								className="w-full h-3 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-full appearance-none cursor-pointer slider"
							/>
							<div className="flex justify-between text-xs text-gray-400 font-mono">
								<span>0.1x Slow</span>
								<span>3.0x Fast</span>
							</div>
						</div>
					</motion.div>
				)}
			</motion.div>

			<motion.div
				className="overflow-hidden rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
				initial={{
					height: expandedSection === "displayControls" ? "auto" : "4rem",
				}}
				animate={{
					height: expandedSection === "displayControls" ? "auto" : "4rem",
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			>
				<button
					onClick={() => toggleSection("displayControls")}
					className="w-full flex items-center justify-between p-4 text-white font-semibold hover:bg-white/5 transition-all duration-300 group"
				>
					<span className="flex items-center">
						<div className="w-6 h-6 rounded bg-gradient-to-r from-purple-500 to-pink-500 mr-3 flex items-center justify-center">
							<svg
								className="w-4 h-4 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
								<path
									fillRule="evenodd"
									d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="text-left">
							<div className="font-semibold">Visual Elements</div>
							<div className="text-xs text-gray-400 font-normal">
								Toggle display options
							</div>
						</div>
					</span>
					<motion.svg
						className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300"
						animate={{
							rotate: expandedSection === "displayControls" ? 180 : 0,
						}}
						transition={{ duration: 0.3 }}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</motion.svg>
				</button>
				{expandedSection === "displayControls" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="p-4 pt-0 space-y-4"
					>
						<div className="space-y-4">
							<label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer">
								<span className="text-white font-medium">
									Lagrangian Points
								</span>
								<div className="relative">
									<input
										type="checkbox"
										className="sr-only"
										checked={showLagrangianPoints}
										onChange={() =>
											setShowLagrangianPoints(!showLagrangianPoints)
										}
									/>
									<div
										className={`w-12 h-6 rounded-full transition-all duration-300 ${
											showLagrangianPoints
												? "bg-gradient-to-r from-purple-500 to-pink-500"
												: "bg-gray-600"
										}`}
									>
										<div
											className={`w-5 h-5 rounded-full bg-white transition-all duration-300 transform ${
												showLagrangianPoints
													? "translate-x-6"
													: "translate-x-0.5"
											} translate-y-0.5`}
										></div>
									</div>
								</div>
							</label>

							<label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer">
								<span className="text-white font-medium">
									Orbital Trajectories
								</span>
								<div className="relative">
									<input
										type="checkbox"
										className="sr-only"
										checked={showOrbitPaths}
										onChange={() => setShowOrbitPaths(!showOrbitPaths)}
									/>
									<div
										className={`w-12 h-6 rounded-full transition-all duration-300 ${
											showOrbitPaths
												? "bg-gradient-to-r from-orange-500 to-red-500"
												: "bg-gray-600"
										}`}
									>
										<div
											className={`w-5 h-5 rounded-full bg-white transition-all duration-300 transform ${
												showOrbitPaths ? "translate-x-6" : "translate-x-0.5"
											} translate-y-0.5`}
										></div>
									</div>
								</div>
							</label>

							<label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer">
								<span className="text-white font-medium">
									Cosmic Background
								</span>
								<div className="relative">
									<input
										type="checkbox"
										className="sr-only"
										checked={showNebula}
										onChange={() => setShowNebula(!showNebula)}
									/>
									<div
										className={`w-12 h-6 rounded-full transition-all duration-300 ${
											showNebula
												? "bg-gradient-to-r from-teal-500 to-cyan-500"
												: "bg-gray-600"
										}`}
									>
										<div
											className={`w-5 h-5 rounded-full bg-white transition-all duration-300 transform ${
												showNebula ? "translate-x-6" : "translate-x-0.5"
											} translate-y-0.5`}
										></div>
									</div>
								</div>
							</label>
						</div>
					</motion.div>
				)}
			</motion.div>

			<div className="grid grid-cols-2 gap-3 mt-auto pt-6">
				<div className="relative group">
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setIsExportModalOpen(true)}
						className="cursor-pointer w-full flex items-center justify-center space-x-2 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
						<span className="hidden sm:inline">Export</span>
					</motion.button>
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
						Export Configuration
					</div>
				</div>

				<label className="cursor-pointer relative group">
					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 transition-all duration-300"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
								clipRule="evenodd"
								transform="rotate(180 10 10)"
							/>
						</svg>
						<span className="hidden sm:inline">Import</span>
					</motion.div>
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
						Import Configuration
					</div>
					<input
						type="file"
						accept=".json"
						className="hidden"
						onChange={importSimulation}
					/>
				</label>
			</div>
		</div>
	);

	const renderMobileControlsPanel = () => (
		<AnimatePresence>
			{showControlsPanel && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
					onClick={() => setShowControlsPanel(false)}
				>
					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="absolute bottom-0 left-0 right-0 max-h-[85vh] min-h-[60vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-black/95 backdrop-blur-xl border-t border-white/20 rounded-t-3xl p-4 sm:p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold text-white">Controls</h2>
								<button
									onClick={() => setShowControlsPanel(false)}
									className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
								>
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>
							{renderControls()}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);

	const renderMobileNav = () => (
		<div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/95 via-slate-900/95 to-black/95 backdrop-blur-xl border-t border-white/20 z-50 lg:hidden safe-area-inset-bottom">
			<div className="flex justify-around items-center py-3 pb-safe"></div>
		</div>
	);

	const renderExportModal = () => (
		<AnimatePresence>
			{isExportModalOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-50"
					onClick={() => setIsExportModalOpen(false)}
				>
					<motion.div
						initial={{ scale: 0.9, y: 20, opacity: 0 }}
						animate={{ scale: 1, y: 0, opacity: 1 }}
						exit={{ scale: 0.9, y: 20, opacity: 0 }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
						className="bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 max-w-md w-full"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center space-x-3 mb-6">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div>
								<h2 className="text-2xl font-bold text-white">
									Export Configuration
								</h2>
								<p className="text-gray-400">
									Save your current simulation state
								</p>
							</div>
						</div>

						<div className="bg-black/20 backdrop-blur-xl rounded-xl p-4 mb-6 border border-white/10">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="text-xs text-gray-400 font-mono uppercase">
										Mass Ratio
									</div>
									<div className="text-lg font-bold text-white font-mono">
										{massRatio.toFixed(2)}
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-xs text-gray-400 font-mono uppercase">
										Speed
									</div>
									<div className="text-lg font-bold text-white font-mono">
										{simulationSpeed.toFixed(1)}x
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-xs text-gray-400 font-mono uppercase">
										L-Points
									</div>
									<div className="text-lg font-bold text-white font-mono">
										{showLagrangianPoints ? "ON" : "OFF"}
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-xs text-gray-400 font-mono uppercase">
										Orbits
									</div>
									<div className="text-lg font-bold text-white font-mono">
										{showOrbitPaths ? "ON" : "OFF"}
									</div>
								</div>
							</div>
						</div>

						<div className="flex space-x-3">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setIsExportModalOpen(false)}
								className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all duration-300"
							>
								Cancel
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={exportSimulation}
								className="cursor-pointer flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300"
							>
								Export
							</motion.button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);

	return (
		<div className="font-inter min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-auto flex flex-col">
			
			<header className="sticky bg-gradient-to-r from-gray-900/80 via-slate-900/80 to-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl top-0 z-30">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-orange-500/5"></div>
				<div className="relative container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
					<motion.div
						className="flex items-center space-x-2 sm:space-x-3"
						whileHover={{ scale: 1.02 }}
					>
						<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
							<svg
								className="w-4 h-4 sm:w-6 sm:h-6 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M11 3a1 1 0 10-2 0v1.05a2.5 2.5 0 01-2.45 2.5H5a1 1 0 100 2h1.55a2.5 2.5 0 012.45 2.5v1.55a1 1 0 102 0v-1.55a2.5 2.5 0 012.45-2.5H15a1 1 0 100-2h-1.55a2.5 2.5 0 01-2.45-2.5V3z" />
							</svg>
						</div>
						<div>
							<h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
								BinaryStar
							</h1>
							<div className="text-xs text-gray-400 font-mono hidden sm:block">
								QUANTUM SIMULATION LAB
							</div>
						</div>
					</motion.div>

					<div className="hidden lg:flex items-center space-x-6">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() =>
								toast.success("🚀 Share functionality activated!", {
									style: {
										background: "rgba(10, 10, 15, 0.95)",
										color: "#00ffff",
										border: "1px solid #00ffff40",
										borderRadius: "12px",
										backdropFilter: "blur(20px)",
									},
								})
							}
							className="cursor-pointer px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50 transition-all duration-300"
						>
							Share Simulation
						</motion.button>
					</div>
				</div>
			</header>
			<main className="relative w-full px-3 sm:px-6 py-4 sm:py-8 flex-1">
				{isMobile ? (
					<div className="flex flex-col h-[calc(100vh-6rem)]">
						<div className="flex border-b border-white/20 bg-black/50 flex-shrink-0">
							<button
								onClick={() => setActiveTab("simulation")}
								className={`flex-1 py-3 text-center font-medium ${
									activeTab === "simulation"
										? "text-white bg-gray-800"
										: "text-gray-400 hover:text-white"
								}`}
							>
								Simulation
							</button>
							<button
								onClick={() => setActiveTab("controls")}
								className={`flex-1 py-3 text-center font-medium ${
									activeTab === "controls"
										? "text-white bg-gray-800"
										: "text-gray-400 hover:text-white"
								}`}
							>
								Controls
							</button>
						</div>

						<div className="flex-1 min-h-0 mt-8">
							{activeTab === "simulation" ? (
								<div className="h-full">{renderSimulation()}</div>
							) : (
								<div className="h-full overflow-y-auto">{renderControls()}</div>
							)}
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 h-[calc(100vh-12rem)]">
						<div className="lg:col-span-4 xl:col-span-3">
							{renderControls()}
						</div>
						<div className="lg:col-span-8 xl:col-span-9">
							{renderSimulation()}
						</div>
					</div>
				)}
			</main>
			<footer className="relative bg-gradient-to-r from-gray-900/80 via-slate-900/80 to-black/80 backdrop-blur-xl border-t border-white/10 shadow-2xl mt-8 lg:mb-0">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-orange-500/5"></div>
				<div className="relative container mx-auto px-3 sm:px-6 py-4 sm:py-6">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
						<div className="flex items-center space-x-2 sm:space-x-3">
							<div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5 text-white"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M11 3a1 1 0 10-2 0v1.05a2.5 2.5 0 01-2.45 2.5H5a1 1 0 100 2h1.55a2.5 2.5 0 012.45 2.5v1.55a1 1 0 102 0v-1.55a2.5 2.5 0 012.45-2.5H15a1 1 0 100-2h-1.55a2.5 2.5 0 01-2.45-2.5V3z" />
								</svg>
							</div>
							<div>
								<div className="text-xs sm:text-sm font-semibold text-white">
									BinaryStar Quantum Lab
								</div>
								<div className="text-xs text-gray-400 font-mono hidden sm:block">
									© 2025 Advanced Simulation Technologies
								</div>
							</div>
						</div>

						<div className="flex items-center space-x-3 sm:space-x-6">
							<button
								onClick={() =>
									toast.info("🔒 Privacy policy available!", {
										style: {
											background: "rgba(10, 10, 15, 0.95)",
											color: "#8b5cf6",
											border: "1px solid #8b5cf640",
											borderRadius: "12px",
											backdropFilter: "blur(20px)",
										},
									})
								}
								className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 px-2 py-1 rounded"
							>
								Privacy
							</button>
							<button
								onClick={() =>
									toast.info("📋 Terms of service ready!", {
										style: {
											background: "rgba(10, 10, 15, 0.95)",
											color: "#8b5cf6",
											border: "1px solid #8b5cf640",
											borderRadius: "12px",
											backdropFilter: "blur(20px)",
										},
									})
								}
								className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 px-2 py-1 rounded"
							>
								Terms
							</button>
							<button
								onClick={() =>
									toast.info("📧 Contact form available!", {
										style: {
											background: "rgba(10, 10, 15, 0.95)",
											color: "#8b5cf6",
											border: "1px solid #8b5cf640",
											borderRadius: "12px",
											backdropFilter: "blur(20px)",
										},
									})
								}
								className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 px-2 py-1 rounded"
							>
								Contact
							</button>
						</div>
					</div>
				</div>
			</footer>
			{renderExportModal()}
			<ToastContainer
				position="top-right"
				autoClose={4000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				toastStyle={{
					background: "rgba(10, 10, 15, 0.95)",
					backdropFilter: "blur(20px)",
					border: "1px solid rgba(255, 255, 255, 0.1)",
					borderRadius: "12px",
					color: "#ffffff",
					fontSize: "14px",
					maxWidth: "90vw",
				}}
				className="!top-16 sm:!top-24 !right-2 sm:!right-4"
			/>
			<style jsx>{`
				.slider {
					background: linear-gradient(to right, #ff6b35, #ffaa00, #00ffff);
				}
				.slider::-webkit-slider-thumb {
					appearance: none;
					width: 20px;
					height: 20px;
					border-radius: 50%;
					background: linear-gradient(135deg, #ffffff, #e5e7eb);
					border: 2px solid #00ffff;
					box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
					cursor: pointer;
				}
				.slider::-moz-range-thumb {
					width: 20px;
					height: 20px;
					border-radius: 50%;
					background: linear-gradient(135deg, #ffffff, #e5e7eb);
					border: 2px solid #00ffff;
					box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
					cursor: pointer;
				}

				@media (max-width: 768px) {
					.slider::-webkit-slider-thumb {
						width: 24px;
						height: 24px;
					}
					.slider::-moz-range-thumb {
						width: 24px;
						height: 24px;
					}
				}

				@media (max-width: 640px) {
					.group:hover .opacity-0 {
						opacity: 1;
						transform: translateX(-50%) translateY(-0.5rem);
					}
				}

				.safe-area-inset-bottom {
					padding-bottom: env(safe-area-inset-bottom);
				}

				.pb-safe {
					padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
				}
			`}</style>
		</div>
	);
};

export default BinaryStarSimulator;
