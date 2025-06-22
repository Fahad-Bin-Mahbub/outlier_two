"use client";

import React, { useState, useEffect, useRef } from "react";

export default function GravitationalSimulationExport() {
	const [isRunning, setIsRunning] = useState(false);
	const [gravityStrength, setGravityStrength] = useState(50);
	const [startPosition, setStartPosition] = useState({ x: 200, y: 0 });
	const [inputPosition, setInputPosition] = useState({ x: "200", y: "0" });
	const [showHelp, setShowHelp] = useState(false);
	const [orbitData, setOrbitData] = useState({
		velocity: "0, 0",
		distance: "0",
		stable: true,
	});
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const bodyRef = useRef({ x: 200, y: 0, vx: 0, vy: 1 });
	const trajectoryRef = useRef<Array<{ x: number; y: number }>>([]);
	const animationRef = useRef<number | null>(null);
	const centerRef = useRef({ x: 0, y: 0 });

	const resetSimulation = () => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}

			bodyRef.current = {
				x: startPosition.x,
				y: startPosition.y,
				vx: 0,
				vy: 1,
			};
			trajectoryRef.current = [];
			updateOrbitData();
		}
	};

	const updateOrbitData = () => {
		const dx = bodyRef.current.x - centerRef.current.x;
		const dy = bodyRef.current.y - centerRef.current.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		const prevDistance = parseFloat(orbitData.distance);
		const stable =
			prevDistance > 0
				? Math.abs(distance - prevDistance) / prevDistance < 0.1
				: true;

		setOrbitData({
			velocity: `${Math.round(bodyRef.current.vx * 100) / 100}, ${
				Math.round(bodyRef.current.vy * 100) / 100
			}`,
			distance: Math.round(distance).toString(),
			stable,
		});
	};

	useEffect(() => {
		const handleResize = () => {
			if (canvasRef.current) {
				const canvas = canvasRef.current;
				const dpr = window.devicePixelRatio || 1;

				canvas.style.width = "100%";
				canvas.style.height = "100%";

				const rect = canvas.getBoundingClientRect();
				canvas.width = rect.width * dpr;
				canvas.height = rect.height * dpr;

				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.scale(dpr, dpr);
				}

				centerRef.current = {
					x: rect.width / 2,
					y: rect.height / 2,
				};

				resetSimulation();
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (!isRunning) {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}
			return;
		}

		const updateSimulation = () => {
			const body = bodyRef.current;
			const center = centerRef.current;

			const dx = center.x - body.x;
			const dy = center.y - body.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < 25) {
				setIsRunning(false);
				return;
			}

			const gravity = gravityStrength / 1000;
			const forceMagnitude = (gravity / (distance * distance)) * 10000;

			const ax = (forceMagnitude * dx) / distance;
			const ay = (forceMagnitude * dy) / distance;

			body.vx += ax;
			body.vy += ay;

			body.x += body.vx;
			body.y += body.vy;

			trajectoryRef.current.push({ x: body.x, y: body.y });

			if (trajectoryRef.current.length > 5000) {
				trajectoryRef.current = trajectoryRef.current.slice(-5000);
			}

			if (trajectoryRef.current.length % 10 === 0) {
				updateOrbitData();
			}

			drawScene();

			animationRef.current = requestAnimationFrame(updateSimulation);
		};

		animationRef.current = requestAnimationFrame(updateSimulation);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}
		};
	}, [isRunning, gravityStrength]);

	const drawScene = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();

		ctx.clearRect(0, 0, rect.width, rect.height);

		drawStarsBackground(ctx, rect);

		drawGrid(ctx, rect);

		drawTrajectory(ctx);

		drawStar(ctx);

		drawPlanet(ctx);
	};

	const drawStarsBackground = (
		ctx: CanvasRenderingContext2D,
		rect: DOMRect
	) => {
		const bgGradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
		bgGradient.addColorStop(0, "#0c0621");
		bgGradient.addColorStop(0.5, "#1a0a46");
		bgGradient.addColorStop(1, "#13062e");

		ctx.fillStyle = bgGradient;
		ctx.fillRect(0, 0, rect.width, rect.height);

		const numStars = Math.floor((rect.width * rect.height) / 2000);

		for (let i = 0; i < numStars; i++) {
			const x = Math.random() * rect.width;
			const y = Math.random() * rect.height;

			const radius = Math.random() * 0.8 + 0.2;
			const opacity = Math.random() * 0.5 + 0.2;

			ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();

			if (radius > 0.8 && Math.random() > 0.98) {
				const glowRadius = radius * 2;
				const glow = ctx.createRadialGradient(x, y, radius, x, y, glowRadius);
				glow.addColorStop(0, `rgba(230, 230, 255, ${opacity * 0.3})`);
				glow.addColorStop(1, "rgba(70, 70, 255, 0)");

				ctx.fillStyle = glow;
				ctx.beginPath();
				ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	};

	const drawGrid = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
		ctx.strokeStyle = "rgba(89, 71, 139, 0.12)";
		ctx.lineWidth = 1;

		for (let x = 0; x < rect.width; x += 50) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, rect.height);
			ctx.stroke();
		}

		for (let y = 0; y < rect.height; y += 50) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(rect.width, y);
			ctx.stroke();
		}

		ctx.strokeStyle = "rgba(134, 97, 193, 0.3)";
		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.moveTo(0, centerRef.current.y);
		ctx.lineTo(rect.width, centerRef.current.y);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(centerRef.current.x, 0);
		ctx.lineTo(centerRef.current.x, rect.height);
		ctx.stroke();
	};

	const drawTrajectory = (ctx: CanvasRenderingContext2D) => {
		if (trajectoryRef.current.length < 2) return;

		const gradient = ctx.createLinearGradient(
			trajectoryRef.current[0].x,
			trajectoryRef.current[0].y,
			trajectoryRef.current[trajectoryRef.current.length - 1].x,
			trajectoryRef.current[trajectoryRef.current.length - 1].y
		);

		gradient.addColorStop(0, "rgba(255, 157, 0, 0.1)");
		gradient.addColorStop(0.3, "rgba(255, 157, 0, 0.3)");
		gradient.addColorStop(0.6, "rgba(255, 157, 0, 0.5)");
		gradient.addColorStop(1, "rgba(255, 157, 0, 0.7)");

		ctx.strokeStyle = gradient;
		ctx.lineWidth = 2;
		ctx.beginPath();

		const step = Math.max(1, Math.floor(trajectoryRef.current.length / 500));

		ctx.moveTo(trajectoryRef.current[0].x, trajectoryRef.current[0].y);

		for (let i = step; i < trajectoryRef.current.length; i += step) {
			const point = trajectoryRef.current[i];
			ctx.lineTo(point.x, point.y);
		}

		ctx.stroke();
	};

	const drawStar = (ctx: CanvasRenderingContext2D) => {
		const centerGradient = ctx.createRadialGradient(
			centerRef.current.x,
			centerRef.current.y,
			0,
			centerRef.current.x,
			centerRef.current.y,
			20
		);
		centerGradient.addColorStop(0, "#fff3b0");
		centerGradient.addColorStop(0.4, "#ff9e00");
		centerGradient.addColorStop(1, "#ff4800");

		ctx.fillStyle = centerGradient;
		ctx.beginPath();
		ctx.arc(centerRef.current.x, centerRef.current.y, 20, 0, Math.PI * 2);
		ctx.fill();

		const glowGradient = ctx.createRadialGradient(
			centerRef.current.x,
			centerRef.current.y,
			20,
			centerRef.current.x,
			centerRef.current.y,
			80
		);
		glowGradient.addColorStop(0, "rgba(255, 102, 0, 0.4)");
		glowGradient.addColorStop(0.5, "rgba(255, 102, 0, 0.1)");
		glowGradient.addColorStop(1, "rgba(255, 102, 0, 0)");

		ctx.fillStyle = glowGradient;
		ctx.beginPath();
		ctx.arc(centerRef.current.x, centerRef.current.y, 80, 0, Math.PI * 2);
		ctx.fill();

		const highlight = ctx.createRadialGradient(
			centerRef.current.x - 5,
			centerRef.current.y - 5,
			0,
			centerRef.current.x - 5,
			centerRef.current.y - 5,
			10
		);
		highlight.addColorStop(0, "rgba(255, 255, 200, 0.4)");
		highlight.addColorStop(1, "rgba(255, 255, 200, 0)");

		ctx.fillStyle = highlight;
		ctx.beginPath();
		ctx.arc(
			centerRef.current.x - 5,
			centerRef.current.y - 5,
			10,
			0,
			Math.PI * 2
		);
		ctx.fill();
	};

	const drawPlanet = (ctx: CanvasRenderingContext2D) => {
		const planetGradient = ctx.createRadialGradient(
			bodyRef.current.x,
			bodyRef.current.y,
			0,
			bodyRef.current.x,
			bodyRef.current.y,
			8
		);
		planetGradient.addColorStop(0, "#a5f3fc");
		planetGradient.addColorStop(0.6, "#0ea5e9");
		planetGradient.addColorStop(1, "#0369a1");

		ctx.fillStyle = planetGradient;
		ctx.beginPath();
		ctx.arc(bodyRef.current.x, bodyRef.current.y, 8, 0, Math.PI * 2);
		ctx.fill();

		const planetGlowGradient = ctx.createRadialGradient(
			bodyRef.current.x,
			bodyRef.current.y,
			8,
			bodyRef.current.x,
			bodyRef.current.y,
			14
		);
		planetGlowGradient.addColorStop(0, "rgba(56, 189, 248, 0.3)");
		planetGlowGradient.addColorStop(1, "rgba(56, 189, 248, 0)");

		ctx.fillStyle = planetGlowGradient;
		ctx.beginPath();
		ctx.arc(bodyRef.current.x, bodyRef.current.y, 14, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "rgba(165, 243, 252, 0.7)";
		ctx.beginPath();
		ctx.arc(bodyRef.current.x - 2, bodyRef.current.y - 2, 2.5, 0, Math.PI * 2);
		ctx.fill();
	};

	const handlePositionChange = (axis: "x" | "y", value: string) => {
		const numValue = parseInt(value) || 0;
		setInputPosition({ ...inputPosition, [axis]: value });
		setStartPosition({ ...startPosition, [axis]: numValue });
	};

	const applyStartPosition = () => {
		if (isRunning) {
			setIsRunning(false);
		}

		resetSimulation();
		drawScene();
	};

	return (
		<div className="flex flex-col h-screen bg-gradient-to-b from-indigo-950 via-[#13062e] to-purple-950 text-white font-sans overflow-hidden">
			<header className="relative px-6 py-4 bg-black/30 backdrop-blur-lg border-b border-purple-700/30 z-10 flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="relative flex items-center justify-center w-10 h-10">
						<div className="absolute w-6 h-6 bg-amber-400 rounded-full animate-pulse"></div>
						<div className="absolute w-10 h-10 border-2 border-transparent border-t-amber-400 border-r-amber-400 rounded-full animate-spin"></div>
					</div>
					<h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
						Cosmic Orbit Simulator
					</h1>
				</div>

				<div className="flex items-center gap-4">
					<button
						onClick={() => setShowHelp(!showHelp)}
						className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-900/40 hover:bg-indigo-800/40 transition-colors duration-200 border border-indigo-700/50 text-indigo-200 hover:text-white cursor-pointer"
						aria-label="Help"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</header>

			<main className="flex flex-1 flex-col md:flex-row overflow-hidden p-2 gap-0">
				<div className="relative flex-grow overflow-hidden">
					<div className="w-full h-full rounded-2xl overflow-hidden border border-indigo-900/20">
						<canvas ref={canvasRef} className="w-full h-full"></canvas>
					</div>

					<div className="absolute top-8 left-8 bg-black/70 backdrop-blur-md p-4 rounded-lg text-sm border border-indigo-900/40 shadow-lg shadow-indigo-900/20">
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2.5">
								<div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-300 to-amber-500"></div>
								<p className="font-medium text-amber-200">Center: (0, 0)</p>
							</div>
							<div className="flex items-center gap-2.5">
								<div className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-300 to-sky-500"></div>
								<p className="font-medium text-sky-200">
									Planet: ({Math.round(bodyRef.current.x - centerRef.current.x)}
									, {Math.round(bodyRef.current.y - centerRef.current.y)})
								</p>
							</div>
						</div>
					</div>

					<div className="absolute bottom-8 left-8 bg-black/70 backdrop-blur-md p-3 rounded-lg text-xs border border-indigo-900/40 shadow-lg shadow-indigo-900/20">
						<div className="flex items-center gap-2.5">
							<div
								className={`w-2.5 h-2.5 rounded-full ${
									isRunning ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
								}`}
							></div>
							<p className="font-medium text-gray-200">
								{isRunning ? "Simulation Running" : "Simulation Paused"}
							</p>
						</div>
					</div>
				</div>

				<div className="w-full md:w-80 2xl:w-96 bg-black/40 backdrop-blur-lg border-l border-purple-800/30 overflow-y-auto">
					<div className="p-6 space-y-7">
						<section className="space-y-4">
							<h2 className="text-lg font-bold flex items-center gap-2 text-amber-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
										clipRule="evenodd"
									/>
								</svg>
								Starting Position
							</h2>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-indigo-200 text-sm mb-2 font-medium">
										X Position
									</label>
									<input
										type="number"
										value={inputPosition.x}
										onChange={(e) => handlePositionChange("x", e.target.value)}
										className="w-full px-3 py-2.5 bg-indigo-950/60 rounded-lg text-white border border-indigo-700/50 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
									/>
								</div>
								<div>
									<label className="block text-indigo-200 text-sm mb-2 font-medium">
										Y Position
									</label>
									<input
										type="number"
										value={inputPosition.y}
										onChange={(e) => handlePositionChange("y", e.target.value)}
										className="w-full px-3 py-2.5 bg-indigo-950/60 rounded-lg text-white border border-indigo-700/50 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
									/>
								</div>
							</div>
							<button
								onClick={applyStartPosition}
								className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-amber-900/20 border border-amber-500/30 relative overflow-hidden group cursor-pointer"
							>
								<span className="relative z-10">Apply Position</span>
								<span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
							</button>
						</section>

						<section className="space-y-5">
							<h2 className="text-lg font-bold flex items-center gap-2 text-amber-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M13 8V0L8.11 5.87 3 12h4v8L17 8h-4z" />
								</svg>
								Gravity Strength
							</h2>
							<div className="space-y-4">
								<div className="relative pt-1">
									<input
										type="range"
										min="1"
										max="100"
										value={gravityStrength}
										onChange={(e) =>
											setGravityStrength(parseInt(e.target.value))
										}
										className="w-full h-2 appearance-none rounded-full cursor-pointer focus:outline-none"
										style={{
											background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${gravityStrength}%, #312e81 ${gravityStrength}%, #312e81 100%)`,
											height: "8px",
										}}
									/>
									<div className="mt-4">
										<div className="flex justify-between">
											<span className="text-xs text-indigo-300 font-medium">
												Weak
											</span>
											<span className="text-xs text-indigo-300 font-medium">
												Strong
											</span>
										</div>
									</div>
								</div>
								<div className="text-center">
									<span className="inline-block bg-indigo-900/60 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-200">
										Current: {gravityStrength}%
									</span>
								</div>
							</div>
						</section>

						<section className="space-y-5">
							<h2 className="text-lg font-bold flex items-center gap-2 text-amber-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
										clipRule="evenodd"
									/>
								</svg>
								Simulation Controls
							</h2>
							<div className="grid grid-cols-3 gap-4">
								<button
									onClick={() => setIsRunning(true)}
									disabled={isRunning}
									className={`group relative py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-lg cursor-pointer
                    ${
											isRunning
												? "bg-emerald-900/20 text-emerald-300/50 shadow-none cursor-not-allowed border border-emerald-800/20"
												: "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-900/30 border border-emerald-600/40"
										}`}
								>
									<span className="flex items-center gap-1.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
												clipRule="evenodd"
											/>
										</svg>
										Run
									</span>
								</button>
								<button
									onClick={() => setIsRunning(false)}
									disabled={!isRunning}
									className={`group relative py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-lg cursor-pointer
                    ${
											!isRunning
												? "bg-amber-900/20 text-amber-300/50 shadow-none cursor-not-allowed border border-amber-800/20"
												: "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-amber-900/30 border border-amber-600/40"
										}`}
								>
									<span className="flex items-center gap-1.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
										Pause
									</span>
								</button>
								<button
									onClick={() => {
										setIsRunning(false);
										resetSimulation();
										drawScene();
									}}
									className="group relative py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-rose-900/30 border border-rose-600/40 flex items-center justify-center cursor-pointer"
								>
									<span className="flex items-center gap-1.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
												clipRule="evenodd"
											/>
										</svg>
										Reset
									</span>
								</button>
							</div>
						</section>

						<section className="space-y-4 bg-indigo-950/50 rounded-xl p-5 border border-indigo-800/30 backdrop-blur-sm">
							<h2 className="text-lg font-bold flex items-center gap-2 text-sky-300">
								<svg
									className="w-5 h-5"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="2"
									/>
									<path
										d="M8 12C8 16 10 16 12 16C14 16 16 16 16 12C16 8 14 8 12 8C10 8 8 8 8 12Z"
										fill="currentColor"
									/>
								</svg>
								Orbit Telemetry
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-indigo-300 text-sm">Velocity:</span>
									<span className="text-white font-medium text-sm px-3 py-1 bg-indigo-900/60 rounded-md">
										({orbitData.velocity})
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-indigo-300 text-sm">
										Distance to Star:
									</span>
									<span className="text-white font-medium text-sm px-3 py-1 bg-indigo-900/60 rounded-md">
										{orbitData.distance} units
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-indigo-300 text-sm">
										Orbit Stability:
									</span>
									<span
										className={`text-white font-medium text-sm px-3 py-1 ${
											orbitData.stable ? "bg-emerald-900/60" : "bg-rose-900/60"
										} rounded-md flex items-center gap-1.5`}
									>
										{orbitData.stable ? (
											<>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-3.5 w-3.5 text-emerald-400"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fillRule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clipRule="evenodd"
													/>
												</svg>
												Stable
											</>
										) : (
											<>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-3.5 w-3.5 text-rose-400"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fillRule="evenodd"
														d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
														clipRule="evenodd"
													/>
												</svg>
												Unstable
											</>
										)}
									</span>
								</div>
							</div>
						</section>

						<section className="space-y-4 mt-auto pt-4 border-t border-indigo-800/30">
							<h2 className="text-lg font-bold text-amber-300">Legend</h2>
							<div className="grid grid-cols-2 gap-3">
								<div className="flex items-center gap-2.5 bg-indigo-950/30 p-2.5 rounded-lg">
									<div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-200 to-amber-500"></div>
									<span className="text-amber-200 text-sm">Central Star</span>
								</div>
								<div className="flex items-center gap-2.5 bg-indigo-950/30 p-2.5 rounded-lg">
									<div className="w-4 h-4 rounded-full bg-gradient-to-r from-sky-300 to-sky-600"></div>
									<span className="text-sky-200 text-sm">Planet</span>
								</div>
								<div className="flex items-center gap-2.5 bg-indigo-950/30 p-2.5 rounded-lg">
									<div className="h-0.5 w-6 bg-amber-500"></div>
									<span className="text-amber-200 text-sm">Trajectory</span>
								</div>
								<div className="flex items-center gap-2.5 bg-indigo-950/30 p-2.5 rounded-lg">
									<div className="grid grid-cols-3 gap-[2px] w-6">
										<div className="h-[2px] bg-indigo-400/40"></div>
										<div className="h-[2px] bg-indigo-400/40"></div>
										<div className="h-[2px] bg-indigo-400/40"></div>
									</div>
									<span className="text-indigo-200 text-sm">Grid</span>
								</div>
							</div>
						</section>
					</div>
				</div>
			</main>

			{showHelp && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
					<div className="bg-indigo-950/90 border border-indigo-700/50 rounded-2xl max-w-lg w-full shadow-[0_0_40px_rgba(79,70,229,0.4)] overflow-hidden">
						<div className="p-6">
							<div className="flex justify-between items-center mb-5">
								<h2 className="text-xl font-bold text-indigo-200">
									Gravity Simulator Guide
								</h2>
								<button
									onClick={() => setShowHelp(false)}
									className="text-indigo-400 hover:text-white transition-colors cursor-pointer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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

							<div className="space-y-5 text-indigo-100">
								<div>
									<h3 className="font-semibold text-lg text-amber-300 mb-2">
										About the Simulator
									</h3>
									<p className="text-sm leading-relaxed">
										This simulator demonstrates gravitational orbits based on
										Newton&apos;s law of universal gravitation. Watch how
										planets orbit around a central star under the influence of
										gravity.
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-lg text-amber-300 mb-2">
										Controls Guide
									</h3>
									<ul className="list-disc pl-5 space-y-2 text-sm">
										<li>
											<span className="text-sky-300 font-medium">
												Starting Position:
											</span>{" "}
											Set the initial coordinates of the planet relative to the
											central star (0,0).
										</li>
										<li>
											<span className="text-sky-300 font-medium">
												Gravity Strength:
											</span>{" "}
											Adjust how powerful the gravitational field is. Higher
											values create stronger attraction.
										</li>
										<li>
											<span className="text-sky-300 font-medium">
												Run/Pause/Reset:
											</span>{" "}
											Control the simulation execution.
										</li>
									</ul>
								</div>

								<div>
									<h3 className="font-semibold text-lg text-amber-300 mb-2">
										The Science
									</h3>
									<p className="text-sm leading-relaxed">
										The planet&apos;s trajectory follows Newton&apos;s law of
										universal gravitation: the force between two bodies is
										proportional to the product of their masses and inversely
										proportional to the square of the distance between them.
									</p>
									<p className="text-sm mt-3 leading-relaxed">
										Different starting positions and gravity strengths will
										create different types of orbits: circular, elliptical,
										parabolic, or hyperbolic.
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-lg text-amber-300 mb-2">
										Tips
									</h3>
									<ul className="list-disc pl-5 space-y-1.5 text-sm">
										<li>
											For stable orbits, try X=200, Y=0 with gravity around 50%.
										</li>
										<li>Higher gravity leads to tighter orbits.</li>
										<li>Too close to the star may result in collision.</li>
										<li>
											Too far or too fast may result in escape trajectory.
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="bg-indigo-900/50 p-4 border-t border-indigo-700/30">
							<button
								onClick={() => setShowHelp(false)}
								className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg transition-colors duration-200 font-medium cursor-pointer"
							>
								Got it
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
