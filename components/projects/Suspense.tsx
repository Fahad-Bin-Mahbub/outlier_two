"use client";
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts";
import {
	FaPlay,
	FaPause,
	FaRedo,
	FaCog,
	FaBolt,
	FaMountain,
	FaChartLine,
	FaCar,
	FaTachometerAlt,
	FaWaveSquare,
} from "react-icons/fa";

interface SuspensionParams {
	springConstant: number;
	dampingRatio: number;
	mass: number;
	terrainRoughness: number;
	vehicleSpeed: number;
	unsprungMass: number;
	tireStiffness: number;
}

interface PhysicsState {
	chassisPosition: number;
	chassisVelocity: number;
	chassisAcceleration: number;
	wheelPosition: number;
	wheelVelocity: number;
	wheelAcceleration: number;
	springForce: number;
	damperForce: number;
	tireForce: number;
	totalEnergy: number;
}

interface TerrainPoint {
	x: number;
	height: number;
	type: "normal" | "bump" | "pothole" | "wave";
	gradient: number;
}

interface PerformanceData {
	time: number;
	chassisAcceleration: number;
	wheelAcceleration: number;
	springDeflection: number;
	tireDeflection: number;
	comfort: number;
	stability: number;
	roadHolding: number;
}

interface BumpPattern {
	name: string;
	icon: React.ReactNode;
	description: string;
	pattern: Array<{
		x: number;
		height: number;
		width: number;
		type: "bump" | "pothole" | "wave";
	}>;
}

const VehicleSuspensionSimulator: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);
	const timeRef = useRef<number>(0);
	const lastTimeRef = useRef<number>(0);

	const [isRunning, setIsRunning] = useState(false);
	const [isBumpTest, setIsBumpTest] = useState(false);
	const [selectedPreset, setSelectedPreset] = useState<string>("comfort");
	const [selectedBumpPattern, setSelectedBumpPattern] =
		useState<string>("mixed");
	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
	const [viewMode, setViewMode] = useState<"3d" | "analysis" | "engineering">(
		"3d"
	);

	const [params, setParams] = useState<SuspensionParams>({
		springConstant: 25000,
		dampingRatio: 0.7,
		mass: 300,
		terrainRoughness: 0.3,
		vehicleSpeed: 20,
		unsprungMass: 45,
		tireStiffness: 200000,
	});

	const [physicsState, setPhysicsState] = useState<PhysicsState>({
		chassisPosition: 0,
		chassisVelocity: 0,
		chassisAcceleration: 0,
		wheelPosition: 0,
		wheelVelocity: 0,
		wheelAcceleration: 0,
		springForce: 0,
		damperForce: 0,
		tireForce: 0,
		totalEnergy: 0,
	});

	const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
	const [terrain, setTerrain] = useState<TerrainPoint[]>([]);
	const [vehicleX, setVehicleX] = useState(0);

	const presets = {
		comfort: {
			springConstant: 18000,
			dampingRatio: 0.8,
			mass: 350,
			unsprungMass: 50,
			tireStiffness: 180000,
			description: "Luxury sedan - prioritizes ride comfort",
		},
		sport: {
			springConstant: 35000,
			dampingRatio: 0.6,
			mass: 280,
			unsprungMass: 40,
			tireStiffness: 220000,
			description: "Performance car - balanced handling",
		},
		offroad: {
			springConstant: 22000,
			dampingRatio: 0.9,
			mass: 400,
			unsprungMass: 60,
			tireStiffness: 160000,
			description: "SUV/Truck - rough terrain absorption",
		},
		race: {
			springConstant: 45000,
			dampingRatio: 0.5,
			mass: 250,
			unsprungMass: 35,
			tireStiffness: 250000,
			description: "Track-focused - maximum performance",
		},
	};

	const bumpPatterns: Record<string, BumpPattern> = {
		single: {
			name: "Single Speed Bump",
			icon: <FaMountain />,
			description: "ISO standard 75mm bump",
			pattern: [{ x: 400, height: 75, width: 350, type: "bump" }],
		},
		double: {
			name: "Double Bump",
			icon: <FaMountain />,
			description: "Consecutive speed bumps",
			pattern: [
				{ x: 300, height: 60, width: 300, type: "bump" },
				{ x: 700, height: 65, width: 300, type: "bump" },
			],
		},
		pothole: {
			name: "Pothole Series",
			icon: <FaMountain />,
			description: "Deep road defects",
			pattern: [
				{ x: 250, height: -40, width: 150, type: "pothole" },
				{ x: 500, height: -30, width: 200, type: "pothole" },
				{ x: 800, height: -50, width: 120, type: "pothole" },
			],
		},
		wave: {
			name: "Sinusoidal Waves",
			icon: <FaWaveSquare />,
			description: "Periodic undulations",
			pattern: [{ x: 0, height: 25, width: 1200, type: "wave" }],
		},
		mixed: {
			name: "Mixed Terrain",
			icon: <FaChartLine />,
			description: "Real-world combination",
			pattern: [
				{ x: 200, height: 45, width: 250, type: "bump" },
				{ x: 500, height: -25, width: 180, type: "pothole" },
				{ x: 750, height: 55, width: 280, type: "bump" },
				{ x: 1100, height: -35, width: 150, type: "pothole" },
			],
		},
	};

	const generateTerrain = useCallback(
		(roughness: number, width: number = 1400) => {
			const points: TerrainPoint[] = [];
			let height = 0;
			let slope = 0;

			for (let x = 0; x < width; x += 2) {
				let currentHeight = 0;
				let pointType: "normal" | "bump" | "pothole" | "wave" = "normal";
				let gradient = 0;

				if (isBumpTest) {
					const pattern = bumpPatterns[selectedBumpPattern];
					for (const obstacle of pattern.pattern) {
						if (obstacle.type === "wave") {
							const wavePhase = (x * 4 * Math.PI) / obstacle.width;
							currentHeight += Math.sin(wavePhase) * obstacle.height * 0.8;
							gradient =
								(Math.cos(wavePhase) * obstacle.height * 0.8 * (4 * Math.PI)) /
								obstacle.width;
							pointType = "wave";
						} else if (x >= obstacle.x && x <= obstacle.x + obstacle.width) {
							const progress = (x - obstacle.x) / obstacle.width;

							if (obstacle.type === "bump") {
								const intensity = Math.sin(progress * Math.PI);
								currentHeight += obstacle.height * intensity;
								gradient =
									(obstacle.height * Math.cos(progress * Math.PI) * Math.PI) /
									obstacle.width;
							} else if (obstacle.type === "pothole") {
								const intensity = -Math.sin(progress * Math.PI);
								currentHeight += obstacle.height * intensity;
								gradient =
									(obstacle.height * Math.cos(progress * Math.PI) * Math.PI) /
									obstacle.width;
							}

							pointType = obstacle.type as "bump" | "pothole";
						}
					}
				} else {
					const noiseScale = 0.015;
					const heightVariation =
						Math.sin(x * noiseScale) *
						Math.cos(x * noiseScale * 1.7) *
						Math.sin(x * noiseScale * 0.3) *
						roughness *
						20;

					slope += (Math.random() - 0.5) * 0.008;
					slope *= 0.985;
					height += slope + heightVariation * 0.05;
					height *= 0.998;
					currentHeight = height;
					gradient = slope;
				}

				points.push({ x, height: currentHeight, type: pointType, gradient });
			}
			return points;
		},
		[isBumpTest, selectedBumpPattern]
	);

	// Improved physics with RK4 integration and stability
	const updatePhysics = useCallback(
		(dt: number) => {
			// Fixed timestep for stability
			const fixedDt = 0.001; // 1ms timestep
			const steps = Math.max(1, Math.min(10, Math.floor(dt / fixedDt)));
			const actualDt = dt / steps;

			const {
				springConstant,
				dampingRatio,
				mass,
				vehicleSpeed,
				unsprungMass,
				tireStiffness,
			} = params;

			// Safety checks
			if (
				!isFinite(springConstant) ||
				!isFinite(dampingRatio) ||
				!isFinite(mass) ||
				!isFinite(unsprungMass) ||
				!isFinite(tireStiffness) ||
				mass <= 0 ||
				unsprungMass <= 0 ||
				springConstant <= 0 ||
				tireStiffness <= 0
			) {
				return;
			}

			let state = { ...physicsState };

			// Multiple small steps for stability
			for (let step = 0; step < steps; step++) {
				// Get terrain height
				const terrainIndex = Math.max(
					0,
					Math.min(terrain.length - 1, Math.floor(vehicleX / 2))
				);
				const terrainFraction = Math.max(
					0,
					Math.min(1, vehicleX / 2 - terrainIndex)
				);

				const p0 = terrain[Math.max(0, terrainIndex - 1)]?.height || 0;
				const p1 = terrain[terrainIndex]?.height || 0;
				const p2 =
					terrain[Math.min(terrain.length - 1, terrainIndex + 1)]?.height || 0;
				const p3 =
					terrain[Math.min(terrain.length - 1, terrainIndex + 2)]?.height || 0;

				const t = terrainFraction;
				const t2 = t * t;
				const t3 = t2 * t;
				let roadHeight =
					0.5 *
					((-p0 + 3 * p1 - 3 * p2 + p3) * t3 +
						(2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
						(-p0 + p2) * t +
						2 * p1);

				roadHeight = Math.max(-100, Math.min(100, roadHeight || 0));

				// Calculate deflections
				const springDeflection = state.chassisPosition - state.wheelPosition;
				const tireDeflection = state.wheelPosition - roadHeight;

				// Clamp deflections
				const clampedSpringDeflection = Math.max(
					-200,
					Math.min(200, springDeflection)
				);
				const clampedTireDeflection = Math.max(
					-100,
					Math.min(100, tireDeflection)
				);

				// Calculate forces
				const dampingCoeff =
					2 * dampingRatio * Math.sqrt(springConstant * mass);
				const springForce = -springConstant * clampedSpringDeflection;
				const damperForce =
					-dampingCoeff * (state.chassisVelocity - state.wheelVelocity);
				const tireForce = -tireStiffness * clampedTireDeflection;

				// RK4 Integration for chassis
				const chassisForce = springForce + damperForce;
				const k1_cv = state.chassisVelocity;
				const k1_ca = chassisForce / mass;

				const k2_cv = state.chassisVelocity + k1_ca * actualDt * 0.5;
				const k2_ca = chassisForce / mass;

				const k3_cv = state.chassisVelocity + k2_ca * actualDt * 0.5;
				const k3_ca = chassisForce / mass;

				const k4_cv = state.chassisVelocity + k3_ca * actualDt;
				const k4_ca = chassisForce / mass;

				const newChassisVelocity =
					state.chassisVelocity +
					((k1_ca + 2 * k2_ca + 2 * k3_ca + k4_ca) * actualDt) / 6;
				const newChassisPosition =
					state.chassisPosition +
					((k1_cv + 2 * k2_cv + 2 * k3_cv + k4_cv) * actualDt) / 6;

				// RK4 Integration for wheel
				const wheelForce = -springForce - damperForce + tireForce;
				const wk1_wv = state.wheelVelocity;
				const wk1_wa = wheelForce / unsprungMass;

				const wk2_wv = state.wheelVelocity + wk1_wa * actualDt * 0.5;
				const wk2_wa = wheelForce / unsprungMass;

				const wk3_wv = state.wheelVelocity + wk2_wa * actualDt * 0.5;
				const wk3_wa = wheelForce / unsprungMass;

				const wk4_wv = state.wheelVelocity + wk3_wa * actualDt;
				const wk4_wa = wheelForce / unsprungMass;

				const newWheelVelocity =
					state.wheelVelocity +
					((wk1_wa + 2 * wk2_wa + 2 * wk3_wa + wk4_wa) * actualDt) / 6;
				const newWheelPosition =
					state.wheelPosition +
					((wk1_wv + 2 * wk2_wv + 2 * wk3_wv + wk4_wv) * actualDt) / 6;

				// Clamp values to prevent instability
				state.chassisVelocity =
					Math.max(-20, Math.min(20, newChassisVelocity)) * 0.9999;
				state.chassisPosition = Math.max(
					-500,
					Math.min(500, newChassisPosition)
				);
				state.chassisAcceleration = Math.max(-100, Math.min(100, k1_ca));

				state.wheelVelocity =
					Math.max(-20, Math.min(20, newWheelVelocity)) * 0.9999;
				state.wheelPosition = Math.max(-500, Math.min(500, newWheelPosition));
				state.wheelAcceleration = Math.max(-100, Math.min(100, wk1_wa));

				state.springForce = Math.max(-50000, Math.min(50000, springForce));
				state.damperForce = Math.max(-50000, Math.min(50000, damperForce));
				state.tireForce = Math.max(-50000, Math.min(50000, tireForce));

				// Check for instability
				if (
					!isFinite(state.chassisVelocity) ||
					!isFinite(state.wheelVelocity) ||
					!isFinite(state.chassisPosition) ||
					!isFinite(state.wheelPosition)
				) {
					console.warn("Physics instability detected, resetting");
					state = {
						chassisPosition: 0,
						chassisVelocity: 0,
						chassisAcceleration: 0,
						wheelPosition: 0,
						wheelVelocity: 0,
						wheelAcceleration: 0,
						springForce: 0,
						damperForce: 0,
						tireForce: 0,
						totalEnergy: 0,
					};
					break;
				}
			}

			// Calculate energy
			const kineticEnergy =
				0.5 * mass * state.chassisVelocity * state.chassisVelocity +
				0.5 * unsprungMass * state.wheelVelocity * state.wheelVelocity;
			const potentialEnergy =
				0.5 *
				springConstant *
				(state.chassisPosition - state.wheelPosition) *
				(state.chassisPosition - state.wheelPosition);
			state.totalEnergy = Math.max(
				0,
				Math.min(100000, kineticEnergy + potentialEnergy)
			);

			setPhysicsState(state);

			// Performance metrics
			const comfort = Math.max(
				0,
				Math.min(100, 100 - Math.abs(state.chassisAcceleration) * 5)
			);
			const stability = Math.max(
				0,
				Math.min(
					100,
					100 - Math.abs(state.chassisPosition - state.wheelPosition) * 0.8
				)
			);
			const roadHolding = Math.max(
				0,
				Math.min(100, 100 - Math.abs(state.tireForce) * 0.001)
			);

			setPerformanceData((prev) => {
				const newData = [
					...prev,
					{
						time: timeRef.current / 1000,
						chassisAcceleration: Math.abs(state.chassisAcceleration),
						wheelAcceleration: Math.abs(state.wheelAcceleration),
						springDeflection: Math.abs(
							state.chassisPosition - state.wheelPosition
						),
						tireDeflection: Math.abs(state.wheelPosition),
						comfort,
						stability,
						roadHolding,
					},
				];
				console.log("New performance data:", newData[newData.length - 1]); // Debug log
				return newData.slice(-300);
			});

			// Update vehicle position with proper speed scaling
			setVehicleX((prev) => {
				const speedMps = vehicleSpeed * 0.278; // km/h to m/s
				const newX = (prev + speedMps * dt * 8) % (terrain.length * 2 - 2); // 2x speed multiplier
				return Math.max(0, newX);
			});
		},
		[params, physicsState, terrain, vehicleX]
	);

	const drawCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const devicePixelRatio = window.devicePixelRatio || 1;
		const width = rect.width * devicePixelRatio;
		const height = rect.height * devicePixelRatio;

		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
			ctx.scale(devicePixelRatio, devicePixelRatio);
		}

		const canvasWidth = rect.width;
		const canvasHeight = rect.height;

		// Clear with gradient background
		const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
		bgGradient.addColorStop(0, "#0a0a1f");
		bgGradient.addColorStop(0.3, "#1a1a3a");
		bgGradient.addColorStop(0.7, "#2a2a4a");
		bgGradient.addColorStop(1, "#1a1a2e");
		ctx.fillStyle = bgGradient;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// Draw grid
		ctx.strokeStyle = "rgba(100, 100, 150, 0.1)";
		ctx.lineWidth = 1;
		for (let x = 0; x < canvasWidth; x += 50) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvasHeight);
			ctx.stroke();
		}
		for (let y = 0; y < canvasHeight; y += 50) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvasWidth, y);
			ctx.stroke();
		}

		const centerX = canvasWidth / 2;
		const groundLevel = canvasHeight - 120;

		// Draw terrain
		ctx.beginPath();
		ctx.lineWidth = 4;

		terrain.forEach((point, i) => {
			const x = point.x - vehicleX + centerX;
			const y = groundLevel - point.height * 3; // Increased scale for visibility

			if (x >= -100 && x <= canvasWidth + 100) {
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
		});

		ctx.shadowColor = "#00ff88";
		ctx.shadowBlur = 10;
		ctx.strokeStyle = "#00ff88";
		ctx.stroke();
		ctx.shadowBlur = 0;

		// Fill terrain
		ctx.lineTo(canvasWidth + 100, canvasHeight);
		ctx.lineTo(-100, canvasHeight);
		ctx.closePath();
		const terrainGradient = ctx.createLinearGradient(
			0,
			groundLevel,
			0,
			canvasHeight
		);
		terrainGradient.addColorStop(0, "rgba(0, 255, 136, 0.4)");
		terrainGradient.addColorStop(0.7, "rgba(0, 255, 136, 0.2)");
		terrainGradient.addColorStop(1, "rgba(0, 255, 136, 0.05)");
		ctx.fillStyle = terrainGradient;
		ctx.fill();

		// Calculate positions with better scaling
		const wheelY = groundLevel - physicsState.wheelPosition * 3;
		const chassisY = groundLevel - physicsState.chassisPosition * 3 - 60;

		// Draw wheel
		const tireRadius = 35;
		drawWheel(ctx, centerX, wheelY - tireRadius, tireRadius, vehicleX * 0.05);

		// Draw chassis
		drawChassis(ctx, centerX, chassisY);

		// Draw suspension
		drawSuspension(ctx, centerX, wheelY - tireRadius, chassisY, physicsState);

		// Draw HUD
		drawHUD(ctx, canvasWidth, canvasHeight);
	}, [physicsState, terrain, vehicleX, params]);

	const drawWheel = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		radius: number,
		rotation: number
	) => {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rotation);

		// Tire
		const tireGradient = ctx.createRadialGradient(
			0,
			0,
			radius * 0.3,
			0,
			0,
			radius
		);
		tireGradient.addColorStop(0, "#4a4a4a");
		tireGradient.addColorStop(0.7, "#2a2a2a");
		tireGradient.addColorStop(1, "#1a1a1a");
		ctx.fillStyle = tireGradient;
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI);
		ctx.fill();

		// Rim
		const rimGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.75);
		rimGradient.addColorStop(0, "#f0f0f0");
		rimGradient.addColorStop(0.5, "#d0d0d0");
		rimGradient.addColorStop(1, "#a0a0a0");
		ctx.fillStyle = rimGradient;
		ctx.beginPath();
		ctx.arc(0, 0, radius * 0.75, 0, 2 * Math.PI);
		ctx.fill();

		// Spokes
		ctx.strokeStyle = "#888888";
		ctx.lineWidth = 4;
		for (let i = 0; i < 6; i++) {
			const angle = (i * 2 * Math.PI) / 6;
			ctx.beginPath();
			ctx.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
			ctx.lineTo(
				Math.cos(angle) * radius * 0.7,
				Math.sin(angle) * radius * 0.7
			);
			ctx.stroke();
		}

		// Center hub
		ctx.fillStyle = "#cccccc";
		ctx.beginPath();
		ctx.arc(0, 0, 12, 0, 2 * Math.PI);
		ctx.fill();

		ctx.restore();
	};

	const drawChassis = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
		const chassisGradient = ctx.createLinearGradient(
			x - 80,
			y - 20,
			x + 80,
			y + 20
		);
		chassisGradient.addColorStop(0, "#5a67d8");
		chassisGradient.addColorStop(0.3, "#667eea");
		chassisGradient.addColorStop(0.7, "#764ba2");
		chassisGradient.addColorStop(1, "#4c51bf");

		ctx.fillStyle = chassisGradient;
		ctx.fillRect(x - 80, y - 20, 160, 35);

		ctx.fillStyle = "#2d3748";
		ctx.fillRect(x - 75, y - 15, 150, 25);

		ctx.fillStyle = "#4a5568";
		ctx.fillRect(x - 80, y - 20, 10, 35);
		ctx.fillRect(x + 70, y - 20, 10, 35);

		ctx.fillStyle = "#a0aec0";
		ctx.fillRect(x - 75, y - 20, 150, 5);
	};

	const drawSuspension = (
		ctx: CanvasRenderingContext2D,
		x: number,
		wheelY: number,
		chassisY: number,
		state: PhysicsState
	) => {
		const springLength = Math.max(40, Math.abs(chassisY - wheelY + 40));
		const springStartY = Math.min(chassisY + 20, wheelY + 30);
		const compressionRatio = Math.max(0.5, Math.min(1.5, springLength / 240));

		// Damper
		ctx.strokeStyle = "#dc2626";
		ctx.lineWidth = 8;
		ctx.shadowColor = "#dc2626";
		ctx.shadowBlur = 6;
		ctx.beginPath();
		ctx.moveTo(x + 25, wheelY + 30);
		ctx.lineTo(x + 25, chassisY + 20);
		ctx.stroke();
		ctx.shadowBlur = 0;

		// Control arms
		ctx.strokeStyle = "#374151";
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(x - 60, chassisY + 10);
		ctx.lineTo(x, wheelY + 20);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(x + 60, chassisY + 10);
		ctx.lineTo(x, wheelY + 20);
		ctx.stroke();
	};
	const drawHUD = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number
	) => {
		// Telemetry panel
		const panelWidth = Math.min(350, width * 0.4);
		const panelHeight = 220;
		const panelX = 30;
		const panelY = 30;

		const panelGradient = ctx.createLinearGradient(
			panelX,
			panelY,
			panelX,
			panelY + panelHeight
		);
		panelGradient.addColorStop(0, "rgba(15, 15, 35, 0.95)");
		panelGradient.addColorStop(1, "rgba(25, 25, 45, 0.85)");
		ctx.fillStyle = panelGradient;
		ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

		ctx.strokeStyle = "#4f46e5";
		ctx.lineWidth = 2;
		ctx.shadowColor = "#4f46e5";
		ctx.shadowBlur = 10;
		ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
		ctx.shadowBlur = 0;

		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 16px sans-serif";
		ctx.fillText("SUSPENSION TELEMETRY", panelX + 15, panelY + 25);

		const telemetryData = [
			{
				label: "Chassis Accel",
				value: `${Math.abs(physicsState.chassisAcceleration).toFixed(2)} m/s²`,
				color: "#fbbf24",
			},
			{
				label: "Wheel Accel",
				value: `${Math.abs(physicsState.wheelAcceleration).toFixed(2)} m/s²`,
				color: "#22d3ee",
			},
			{
				label: "Spring Deflection",
				value: `${Math.abs(
					physicsState.chassisPosition - physicsState.wheelPosition
				).toFixed(1)} mm`,
				color: "#10b981",
			},
			{
				label: "Spring Force",
				value: `${Math.abs(physicsState.springForce).toFixed(0)} N`,
				color: "#f59e0b",
			},
			{
				label: "Damper Force",
				value: `${Math.abs(physicsState.damperForce).toFixed(0)} N`,
				color: "#ef4444",
			},
		];

		telemetryData.forEach((item, index) => {
			const yPos = panelY + 55 + index * 30;

			ctx.fillStyle = "#cbd5e1";
			ctx.font = "12px sans-serif";
			ctx.fillText(item.label, panelX + 15, yPos);

			ctx.fillStyle = item.color;
			ctx.font = "bold 12px sans-serif";
			ctx.textAlign = "right";
			ctx.fillText(item.value, panelX + panelWidth - 15, yPos);
			ctx.textAlign = "left";
		});

		// Speed gauge
		const speedGaugeX = width - 150;
		const speedGaugeY = height - 150;
		drawSpeedGauge(ctx, speedGaugeX, speedGaugeY, params.vehicleSpeed);
	};

	const drawSpeedGauge = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		speed: number
	) => {
		const radius = 60;

		const gaugeGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
		gaugeGradient.addColorStop(0, "rgba(15, 15, 35, 0.9)");
		gaugeGradient.addColorStop(1, "rgba(25, 25, 45, 0.7)");
		ctx.fillStyle = gaugeGradient;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill();

		ctx.strokeStyle = "#4f46e5";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.stroke();

		const maxSpeed = 100;
		const speedAngle = (speed / maxSpeed) * 1.5 * Math.PI - 0.75 * Math.PI;
		ctx.strokeStyle = "#ff4444";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(
			x + Math.cos(speedAngle) * (radius - 20),
			y + Math.sin(speedAngle) * (radius - 20)
		);
		ctx.stroke();

		ctx.fillStyle = "#666666";
		ctx.beginPath();
		ctx.arc(x, y, 6, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 16px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(`${speed.toFixed(0)}`, x, y + 6);
		ctx.font = "12px sans-serif";
		ctx.fillText("km/h", x, y + 22);
		ctx.textAlign = "left";
	};

	const animate = useCallback(
		(timestamp: number) => {
			if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
			const deltaTime = Math.min(
				(timestamp - lastTimeRef.current) / 1000,
				0.016
			);
			lastTimeRef.current = timestamp;

			if (isRunning && deltaTime > 0) {
				timeRef.current += deltaTime * 1000;
				updatePhysics(deltaTime);
			}

			drawCanvas();
			animationRef.current = requestAnimationFrame(animate);
		},
		[isRunning, updatePhysics, drawCanvas]
	);

	const performanceMetrics = useMemo(() => {
		if (performanceData.length === 0)
			return {
				avgComfort: 0,
				avgStability: 0,
				avgRoadHolding: 0,
				maxChassisAccel: 0,
				maxWheelAccel: 0,
				rmsChassisAccel: 0,
			};

		const recent = performanceData.slice(-100);
		const avgComfort =
			recent.reduce((sum, d) => sum + d.comfort, 0) / recent.length;
		const avgStability =
			recent.reduce((sum, d) => sum + d.stability, 0) / recent.length;
		const avgRoadHolding =
			recent.reduce((sum, d) => sum + d.roadHolding, 0) / recent.length;
		const maxChassisAccel = Math.max(
			...recent.map((d) => d.chassisAcceleration)
		);
		const maxWheelAccel = Math.max(...recent.map((d) => d.wheelAcceleration));
		const rmsChassisAccel = Math.sqrt(
			recent.reduce(
				(sum, d) => sum + d.chassisAcceleration * d.chassisAcceleration,
				0
			) / recent.length
		);

		return {
			avgComfort,
			avgStability,
			avgRoadHolding,
			maxChassisAccel,
			maxWheelAccel,
			rmsChassisAccel,
		};
	}, [performanceData]);

	useEffect(() => {
		setTerrain(generateTerrain(params.terrainRoughness));
	}, [params.terrainRoughness, generateTerrain]);

	useEffect(() => {
		const handleResize = () => {
			if (canvasRef.current) {
				const rect = canvasRef.current.getBoundingClientRect();
				canvasRef.current.style.width = rect.width + "px";
				canvasRef.current.style.height = rect.height + "px";
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		animationRef.current = requestAnimationFrame(animate);
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [animate]);

	// Parameter validation function
	const validateAndSetParam = (
		paramName: keyof SuspensionParams,
		value: number
	) => {
		let validatedValue = value;

		switch (paramName) {
			case "springConstant":
				validatedValue = Math.max(5000, Math.min(80000, value));
				break;
			case "dampingRatio":
				validatedValue = Math.max(0.1, Math.min(2.5, value));
				break;
			case "mass":
				validatedValue = Math.max(150, Math.min(800, value));
				break;
			case "unsprungMass":
				validatedValue = Math.max(20, Math.min(100, value));
				break;
			case "tireStiffness":
				validatedValue = Math.max(100000, Math.min(400000, value));
				break;
			case "vehicleSpeed":
				validatedValue = Math.max(1, Math.min(120, value));
				break;
			case "terrainRoughness":
				validatedValue = Math.max(0, Math.min(1, value));
				break;
		}

		setParams((prev) => ({ ...prev, [paramName]: validatedValue }));
	};

	const handlePresetChange = (preset: string) => {
		setSelectedPreset(preset);
		const presetData = presets[preset as keyof typeof presets];

		const safeParams = {
			springConstant: Math.max(
				5000,
				Math.min(80000, presetData.springConstant)
			),
			dampingRatio: Math.max(0.1, Math.min(2.5, presetData.dampingRatio)),
			mass: Math.max(150, Math.min(800, presetData.mass)),
			unsprungMass: Math.max(20, Math.min(100, presetData.unsprungMass)),
			tireStiffness: Math.max(
				100000,
				Math.min(400000, presetData.tireStiffness)
			),
		};

		setParams((prev) => ({ ...prev, ...safeParams }));
		resetSimulation();
	};

	const resetSimulation = () => {
		setIsRunning(false);
		setPhysicsState({
			chassisPosition: 0,
			chassisVelocity: 0,
			chassisAcceleration: 0,
			wheelPosition: 0,
			wheelVelocity: 0,
			wheelAcceleration: 0,
			springForce: 0,
			damperForce: 0,
			tireForce: 0,
			totalEnergy: 0,
		});
		setPerformanceData([]);
		setVehicleX(0);
		timeRef.current = 0;
		lastTimeRef.current = 0;
		setTerrain(generateTerrain(params.terrainRoughness));
		console.log("Simulation reset to initial state");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
			{/* Header */}
			<div className="bg-black/20 backdrop-blur-xl border-b border-indigo-500/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="flex items-center space-x-4">
							<div className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
								<FaCog className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
									SuspensionLab Pro
								</h1>
								<p className="text-slate-300 text-sm sm:text-base">
									Advanced Vehicle Dynamics Simulator
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-2 sm:space-x-4">
							<button
								onClick={() => setIsBumpTest(!isBumpTest)}
								className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-300 text-sm sm:text-base hover:scale-105 ${
									isBumpTest
										? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
										: "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300"
								}`}
							>
								<FaMountain className="inline mr-2" />
								Bump Test
							</button>

							<button
								onClick={() => setIsRunning(!isRunning)}
								className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-300 text-sm sm:text-base hover:scale-105 ${
									isRunning
										? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25"
										: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
								}`}
							>
								{isRunning ? (
									<FaPause className="inline mr-2" />
								) : (
									<FaPlay className="inline mr-2" />
								)}
								{isRunning ? "Pause" : "Start"}
							</button>

							<button
								onClick={resetSimulation}
								className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg font-bold transition-all duration-300 text-sm sm:text-base hover:scale-105"
							>
								<FaRedo className="inline mr-2" />
								Reset
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
					{/* Control Panel */}
					<div className="lg:col-span-3 space-y-4 sm:space-y-6">
						{/* Vehicle Presets */}
						<div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-indigo-500/20">
							<div className="flex items-center space-x-3 mb-4">
								<FaCar className="w-6 h-6 text-indigo-400" />
								<h3 className="text-lg sm:text-xl font-bold text-white">
									Vehicle Presets
								</h3>
							</div>

							<div className="space-y-3">
								{Object.entries(presets).map(([key, preset]) => (
									<button
										key={key}
										onClick={() => handlePresetChange(key)}
										className={`w-full p-3 sm:p-4 rounded-xl font-bold text-left transition-all duration-300 hover:scale-102 ${
											selectedPreset === key
												? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
												: "bg-slate-700/30 hover:bg-slate-600/30 text-slate-300 hover:shadow-lg"
										}`}
									>
										<div className="flex items-center justify-between">
											<span className="capitalize text-base sm:text-lg">
												{key}
											</span>
											<FaCar className="w-5 h-5" />
										</div>
										<p className="text-xs sm:text-sm mt-1 opacity-90">
											{preset.description}
										</p>
									</button>
								))}
							</div>
						</div>

						{/* Bump Test Patterns */}
						{isBumpTest && (
							<div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-orange-500/20">
								<div className="flex items-center space-x-3 mb-4">
									<FaMountain className="w-6 h-6 text-orange-400" />
									<h3 className="text-lg sm:text-xl font-bold text-white">
										Test Patterns
									</h3>
								</div>

								<div className="space-y-3">
									{Object.entries(bumpPatterns).map(([key, pattern]) => (
										<button
											key={key}
											onClick={() => setSelectedBumpPattern(key)}
											className={`w-full p-3 rounded-xl font-medium text-left transition-all duration-300 hover:scale-102 ${
												selectedBumpPattern === key
													? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
													: "bg-slate-700/30 hover:bg-slate-600/30 text-slate-300"
											}`}
										>
											<div className="flex items-center space-x-3">
												<span className="text-lg">{pattern.icon}</span>
												<div>
													<div className="font-bold text-sm sm:text-base">
														{pattern.name}
													</div>
													<div className="text-xs opacity-90">
														{pattern.description}
													</div>
												</div>
											</div>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Physics Parameters */}
						<div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-blue-500/20">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-3">
									<FaCog className="w-6 h-6 text-blue-400" />
									<h3 className="text-lg sm:text-xl font-bold text-white">
										Physics
									</h3>
								</div>
								<button
									onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
									className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors duration-200 hover:scale-110"
								>
									<FaCog
										className={`w-5 h-5 text-blue-400 transition-transform duration-300 ${
											showAdvancedSettings ? "rotate-180" : ""
										}`}
									/>
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-bold text-blue-300 mb-2">
										Spring Constant: {params.springConstant.toLocaleString()}{" "}
										N/m
									</label>
									<input
										type="range"
										min="5000"
										max="80000"
										step="1000"
										value={params.springConstant}
										onChange={(e) =>
											validateAndSetParam(
												"springConstant",
												parseInt(e.target.value)
											)
										}
										className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
										style={{
											background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
												((params.springConstant - 5000) / (80000 - 5000)) * 100
											}%, rgba(71, 85, 105, 0.5) ${
												((params.springConstant - 5000) / (80000 - 5000)) * 100
											}%, rgba(71, 85, 105, 0.5) 100%)`,
										}}
									/>
								</div>

								<div>
									<label className="block text-sm font-bold text-purple-300 mb-2">
										Damping Ratio: {params.dampingRatio.toFixed(2)}
									</label>
									<input
										type="range"
										min="0.1"
										max="2.5"
										step="0.05"
										value={params.dampingRatio}
										onChange={(e) =>
											validateAndSetParam(
												"dampingRatio",
												parseFloat(e.target.value)
											)
										}
										className="w-full h-3 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
										style={{
											background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
												((params.dampingRatio - 0.1) / (2.5 - 0.1)) * 100
											}%, rgba(71, 85, 105, 0.5) ${
												((params.dampingRatio - 0.1) / (2.5 - 0.1)) * 100
											}%, rgba(71, 85, 105, 0.5) 100%)`,
										}}
									/>
								</div>

								<div>
									<label className="block text-sm font-bold text-green-300 mb-2">
										Sprung Mass: {params.mass} kg
									</label>
									<input
										type="range"
										min="150"
										max="800"
										step="10"
										value={params.mass}
										onChange={(e) =>
											validateAndSetParam("mass", parseInt(e.target.value))
										}
										className="w-full h-3 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
										style={{
											background: `linear-gradient(to right, #10b981 0%, #10b981 ${
												((params.mass - 150) / (800 - 150)) * 100
											}%, rgba(71, 85, 105, 0.5) ${
												((params.mass - 150) / (800 - 150)) * 100
											}%, rgba(71, 85, 105, 0.5) 100%)`,
										}}
									/>
								</div>

								{showAdvancedSettings && (
									<div className="space-y-4 pt-4 border-t border-slate-600/30">
										<div>
											<label className="block text-sm font-bold text-yellow-300 mb-2">
												Vehicle Speed: {params.vehicleSpeed} km/h
											</label>
											<input
												type="range"
												min="5"
												max="120"
												step="1"
												value={params.vehicleSpeed}
												onChange={(e) =>
													validateAndSetParam(
														"vehicleSpeed",
														parseInt(e.target.value)
													)
												}
												className="w-full h-3 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
												style={{
													background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
														((params.vehicleSpeed - 5) / (120 - 5)) * 100
													}%, rgba(71, 85, 105, 0.5) ${
														((params.vehicleSpeed - 5) / (120 - 5)) * 100
													}%, rgba(71, 85, 105, 0.5) 100%)`,
												}}
											/>
										</div>

										<div>
											<label className="block text-sm font-bold text-orange-300 mb-2">
												Unsprung Mass: {params.unsprungMass} kg
											</label>
											<input
												type="range"
												min="20"
												max="100"
												step="2"
												value={params.unsprungMass}
												onChange={(e) =>
													validateAndSetParam(
														"unsprungMass",
														parseInt(e.target.value)
													)
												}
												className="w-full h-3 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
												style={{
													background: `linear-gradient(to right, #f97316 0%, #f97316 ${
														((params.unsprungMass - 20) / (100 - 20)) * 100
													}%, rgba(71, 85, 105, 0.5) ${
														((params.unsprungMass - 20) / (100 - 20)) * 100
													}%, rgba(71, 85, 105, 0.5) 100%)`,
												}}
											/>
										</div>

										<div>
											<label className="block text-sm font-bold text-pink-300 mb-2">
												Tire Stiffness: {params.tireStiffness.toLocaleString()}{" "}
												N/m
											</label>
											<input
												type="range"
												min="100000"
												max="400000"
												step="10000"
												value={params.tireStiffness}
												onChange={(e) =>
													validateAndSetParam(
														"tireStiffness",
														parseInt(e.target.value)
													)
												}
												className="w-full h-3 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
												style={{
													background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${
														((params.tireStiffness - 100000) /
															(400000 - 100000)) *
														100
													}%, rgba(71, 85, 105, 0.5) ${
														((params.tireStiffness - 100000) /
															(400000 - 100000)) *
														100
													}%, rgba(71, 85, 105, 0.5) 100%)`,
												}}
											/>
										</div>

										<div>
											<label className="block text-sm font-bold text-cyan-300 mb-2">
												Terrain Roughness:{" "}
												{(params.terrainRoughness * 100).toFixed(0)}%
											</label>
											<input
												type="range"
												min="0"
												max="1"
												step="0.05"
												value={params.terrainRoughness}
												onChange={(e) =>
													validateAndSetParam(
														"terrainRoughness",
														parseFloat(e.target.value)
													)
												}
												className="w-full h-3 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
												style={{
													background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${
														(params.terrainRoughness / 1) * 100
													}%, rgba(71, 85, 105, 0.5) ${
														(params.terrainRoughness / 1) * 100
													}%, rgba(71, 85, 105, 0.5) 100%)`,
												}}
											/>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Performance Metrics */}
						<div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-emerald-500/20">
							<div className="flex items-center space-x-3 mb-4">
								<FaTachometerAlt className="w-6 h-6 text-emerald-400" />
								<h3 className="text-lg sm:text-xl font-bold text-white">
									Live Metrics
								</h3>
							</div>

							<div className="space-y-3">
								<div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-3">
									<div className="flex justify-between items-center">
										<span className="text-slate-200 text-sm">Max Chassis</span>
										<span className="font-black text-yellow-400">
											{performanceMetrics.maxChassisAccel.toFixed(1)} m/s²
										</span>
									</div>
								</div>

								<div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-3">
									<div className="flex justify-between items-center">
										<span className="text-slate-200 text-sm">Max Wheel</span>
										<span className="text-cyan-400 font-black">
											{performanceMetrics.maxWheelAccel.toFixed(1)} m/s²
										</span>
									</div>
								</div>

								<div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3">
									<div className="flex justify-between items-center">
										<span className="text-slate-200 text-sm">Avg Comfort</span>
										<span className="text-green-400 font-black">
											{performanceMetrics.avgComfort.toFixed(0)}%
										</span>
									</div>
								</div>

								<div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-xl p-3">
									<div className="flex justify-between items-center">
										<span className="text-slate-200 text-sm">
											Avg Stability
										</span>
										<span className="text-blue-400 font-black">
											{performanceMetrics.avgStability.toFixed(0)}%
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* Main Visualization Area */}
					<div className="lg:col-span-9 space-y-6">
						{/* 3D View - Always Visible */}
						<div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-8 border border-indigo-500/20">
							<div className="mb-4 sm:mb-6">
								<h3 className="text-xl sm:text-2xl font-black text-white mb-2">
									3D Suspension Dynamics
								</h3>
								<p className="text-slate-300 text-sm sm:text-base">
									Real-time quarter-car model simulation
								</p>
							</div>

							<div className="relative">
								<canvas
									ref={canvasRef}
									className="w-full h-96 sm:h-[500px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/10"
								/>

								{!isRunning && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl backdrop-blur-sm">
										<div className="text-center">
											<div className="animate-pulse">
												<FaPlay className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
											</div>
											<p className="text-xl font-bold text-white mb-2">
												Ready to Simulate
											</p>
											<p className="text-slate-300">
												Click Start to begin simulation
											</p>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Engineering View - Always Visible */}
						<div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-8 border border-emerald-500/20">
							<h3 className="text-xl sm:text-2xl font-black text-white mb-4">
								Engineering Analysis
							</h3>
							{/* ... existing engineering analysis code ... */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<div className="bg-slate-800/30 rounded-xl p-4">
									<h4 className="text-base font-bold text-white mb-3">
										System Parameters
									</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-slate-400">Natural Freq:</span>
											<span className="text-green-400 font-bold">
												{(
													Math.sqrt(params.springConstant / params.mass) /
													(2 * Math.PI)
												).toFixed(2)}{" "}
												Hz
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Damping:</span>
											<span className="text-blue-400 font-bold">
												{params.dampingRatio.toFixed(3)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Wheel Freq:</span>
											<span className="text-yellow-400 font-bold">
												{(
													Math.sqrt(
														params.tireStiffness / params.unsprungMass
													) /
													(2 * Math.PI)
												).toFixed(2)}{" "}
												Hz
											</span>
										</div>
									</div>
								</div>

								<div className="bg-slate-800/30 rounded-xl p-4">
									<h4 className="text-base font-bold text-white mb-3">
										Force Analysis
									</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-slate-400">Spring Force:</span>
											<span className="text-orange-400 font-bold">
												{Math.abs(physicsState.springForce).toFixed(0)} N
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Damper Force:</span>
											<span className="text-red-400 font-bold">
												{Math.abs(physicsState.damperForce).toFixed(0)} N
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Tire Force:</span>
											<span className="text-purple-400 font-bold">
												{Math.abs(physicsState.tireForce).toFixed(0)} N
											</span>
										</div>
									</div>
								</div>

								<div className="bg-slate-800/30 rounded-xl p-4">
									<h4 className="text-base font-bold text-white mb-3">
										Energy & Performance
									</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-slate-400">Total Energy:</span>
											<span className="text-cyan-400 font-bold">
												{physicsState.totalEnergy.toFixed(0)} J
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">RMS Accel:</span>
											<span className="text-pink-400 font-bold">
												{performanceMetrics.rmsChassisAccel.toFixed(2)} m/s²
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Road Holding:</span>
											<span className="text-emerald-400 font-bold">
												{performanceMetrics.avgRoadHolding.toFixed(0)}%
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Analysis View - Always Visible */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
							<div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-blue-500/20">
								<h4 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
									<FaBolt className="w-5 h-5 text-yellow-400 mr-3" />
									Acceleration Analysis
								</h4>
								{/* ... existing chart code ... */}
								<div className="h-64 sm:h-72">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={performanceData.slice(-100)}>
											<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
											<XAxis
												dataKey="time"
												stroke="#9ca3af"
												fontSize={11}
												tickFormatter={(value) => `${value.toFixed(1)}s`}
											/>
											<YAxis stroke="#9ca3af" fontSize={11} />
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(0, 0, 0, 0.9)",
													border: "1px solid #374151",
													borderRadius: "8px",
													color: "#ffffff",
												}}
											/>
											<Line
												type="monotone"
												dataKey="chassisAcceleration"
												stroke="#22d3ee"
												strokeWidth={2}
												dot={false}
												name="Chassis"
											/>
											<Line
												type="monotone"
												dataKey="wheelAcceleration"
												stroke="#f59e0b"
												strokeWidth={2}
												dot={false}
												name="Wheel"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-green-500/20">
								<h4 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
									<FaChartLine className="w-5 h-5 text-green-400 mr-3" />
									Performance Indices
								</h4>
								{/* ... existing chart code ... */}
								<div className="h-64 sm:h-72">
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart data={performanceData.slice(-100)}>
											<defs>
												<linearGradient
													id="comfortGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#22c55e"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#22c55e"
														stopOpacity={0.1}
													/>
												</linearGradient>
												<linearGradient
													id="stabilityGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#3b82f6"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#3b82f6"
														stopOpacity={0.1}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
											<XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
											<YAxis stroke="#9ca3af" fontSize={11} domain={[0, 100]} />
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(0, 0, 0, 0.9)",
													border: "1px solid #374151",
													borderRadius: "8px",
												}}
											/>
											<Area
												type="monotone"
												dataKey="comfort"
												stroke="#22c55e"
												fillOpacity={1}
												fill="url(#comfortGradient)"
												strokeWidth={2}
												name="Comfort"
											/>
											<Area
												type="monotone"
												dataKey="stability"
												stroke="#3b82f6"
												fillOpacity={1}
												fill="url(#stabilityGradient)"
												strokeWidth={2}
												name="Stability"
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Custom Styles */}
			<style>{`
       input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 24px;
  width: 24px;
  margin-top: -6px; /* ⬅️ this centers the thumb */
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  border: 3px solid #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.6);
}

input[type="range"]::-moz-range-thumb {
  height: 24px;
  width: 24px;
  margin-top: -6px; /* ⬅️ also add for Firefox */
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  border: 3px solid #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transition: all 0.3s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.6);
}

input[type="range"]::-moz-range-track {
  height: 12px;
  border-radius: 6px;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 12px;
  border-radius: 6px;
}


       /* Custom scrollbar */
       ::-webkit-scrollbar {
         width: 8px;
         height: 8px;
       }

       ::-webkit-scrollbar-track {
         background: rgba(0, 0, 0, 0.1);
         border-radius: 4px;
       }

       ::-webkit-scrollbar-thumb {
         background: rgba(99, 102, 241, 0.5);
         border-radius: 4px;
       }

       ::-webkit-scrollbar-thumb:hover {
         background: rgba(99, 102, 241, 0.7);
       }

       /* Smooth animations */
       * {
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
       }

       .hover\\:scale-102:hover {
         transform: scale(1.02);
       }

       .hover\\:scale-105:hover {
         transform: scale(1.05);
       }

       .hover\\:scale-110:hover {
         transform: scale(1.1);
       }

       /* Canvas crisp rendering */
       canvas {
         image-rendering: -moz-crisp-edges;
         image-rendering: -webkit-crisp-edges;
         image-rendering: pixelated;
         image-rendering: crisp-edges;
       }

       /* Button animations */
       button {
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
       }

       button:active {
         transform: scale(0.95);
       }

       /* Gradient text animation */
       .bg-clip-text {
         background-clip: text;
         -webkit-background-clip: text;
       }

       /* Enhanced backdrop blur */
       .backdrop-blur-xl {
         backdrop-filter: blur(24px);
         -webkit-backdrop-filter: blur(24px);
       }

       /* Improved shadows */
       .shadow-lg {
         box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
       }

       .shadow-2xl {
         box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
       }

       /* Performance optimizations */
       .will-change-transform {
         will-change: transform;
       }

       .transform-gpu {
         transform: translateZ(0);
       }

       /* Responsive canvas */
       canvas {
         display: block;
         max-width: 100%;
         height: auto;
       }

       /* Mobile optimizations */
       @media (max-width: 640px) {
         .text-2xl {
           font-size: 1.5rem;
         }
         
         .text-3xl {
           font-size: 1.875rem;
         }
         
         .px-4 {
           padding-left: 0.75rem;
           padding-right: 0.75rem;
         }
         
         .py-2 {
           padding-top: 0.375rem;
           padding-bottom: 0.375rem;
         }
       }

       /* High DPI displays */
       @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
         canvas {
           image-rendering: auto;
         }
       }

       /* Dark mode optimizations */
       @media (prefers-color-scheme: dark) {
         ::-webkit-scrollbar-track {
           background: rgba(255, 255, 255, 0.1);
         }
         
         ::-webkit-scrollbar-thumb {
           background: rgba(255, 255, 255, 0.2);
         }
       }

       /* Reduced motion support */
       @media (prefers-reduced-motion: reduce) {
         * {
           animation-duration: 0.01ms !important;
           animation-iteration-count: 1 !important;
           transition-duration: 0.01ms !important;
         }
         
         .animate-pulse {
           animation: none;
         }
       }

       /* Focus styles for accessibility */
       button:focus-visible {
         outline: 2px solid #4f46e5;
         outline-offset: 2px;
       }

       input:focus-visible {
         outline: 2px solid #4f46e5;
         outline-offset: 2px;
       }

       /* Enhanced hover effects */
       @media (hover: hover) {
         .hover\\:bg-slate-600\\/30:hover {
           background-color: rgba(71, 85, 105, 0.3);
         }
         
         .hover\\:bg-slate-600\\/50:hover {
           background-color: rgba(71, 85, 105, 0.5);
         }
         
         .hover\\:bg-blue-500\\/30:hover {
           background-color: rgba(59, 130, 246, 0.3);
         }
       }

       /* Loading states */
       .animate-pulse {
         animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
       }

       @keyframes pulse {
         0%, 100% {
           opacity: 1;
         }
         50% {
           opacity: .5;
         }
       }

       /* Performance indicators */
       .performance-bar {
         height: 4px;
         border-radius: 2px;
         overflow: hidden;
         background: rgba(71, 85, 105, 0.3);
       }

       .performance-fill {
         height: 100%;
         transition: width 0.3s ease;
         border-radius: 2px;
       }
     `}</style>
		</div>
	);
};

export default VehicleSuspensionSimulator;
