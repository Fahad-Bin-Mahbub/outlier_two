"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	FaPlay,
	FaPause,
	FaSyncAlt,
	FaAtom,
	FaBolt,
	FaInfoCircle,
	FaRocket,
	FaBars,
	FaTimes,
	FaGithub,
	FaTwitter,
	FaFacebook,
	FaInstagram,
	FaChalkboardTeacher,
	FaGraduationCap,
	FaQuestion,
	FaEnvelope,
	FaHome,
	FaGamepad,
	FaUser,
	FaArrowLeft,
	FaExclamationTriangle,
} from "react-icons/fa";

interface Planet {
	id: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
	mass: number;
	radius: number;
	color: string;
	isDragging?: boolean;
}

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	color: string;
}

interface EnergyMetrics {
	kineticEnergy: number;
	potentialEnergy: number;
	totalEnergy: number;
}

interface Toast {
	id: number;
	message: string;
	type: "info" | "warning" | "error" | "success";
}

const generateStars = (count: number, width: number, height: number) => {
	const stars = [];
	for (let i = 0; i < count; i++) {
		stars.push({
			x: Math.random() * width,
			y: Math.random() * height,
			radius: Math.random() * 1.5 + 0.5,
			alpha: Math.random() * 0.5 + 0.5,
		});
	}
	return stars;
};

const chroma = (initialHexColor: string) => {
	const darken = (amount: number): string => {
		let color = initialHexColor;
		if (color.startsWith("#")) {
			color = color.slice(1);
		}
		if (color.length === 3) {
			color = color
				.split("")
				.map((char) => char + char)
				.join("");
		}
		if (color.length !== 6) {
			console.warn(
				`Invalid color for darken: ${initialHexColor}. Returning black.`
			);
			return "#000000";
		}

		let [r, g, b] = (color.match(/\w\w/g) || []).map((x) => parseInt(x, 16));
		if (isNaN(r) || isNaN(g) || isNaN(b)) {
			console.warn(
				`Could not parse color for darken: ${initialHexColor}. Returning black.`
			);
			return "#000000";
		}

		const factor = 1 - Math.min(1, Math.max(0, amount));
		r = Math.max(0, Math.min(255, Math.floor(r * factor)));
		g = Math.max(0, Math.min(255, Math.floor(g * factor)));
		b = Math.max(0, Math.min(255, Math.floor(b * factor)));
		return `#${r.toString(16).padStart(2, "0")}${g
			.toString(16)
			.padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};
	return { darken, hex: () => initialHexColor };
};

const PlanetaryCollisionGame: React.FC = () => {
	const [currentPage, setCurrentPage] = useState<string>("home");

	const [showSignInModal, setShowSignInModal] = useState(false);

	const [toasts, setToasts] = useState<Toast[]>([]);
	const nextToastId = useRef(1);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [planets, setPlanets] = useState<Planet[]>([
		{
			id: "1",
			x: 200,
			y: 300,
			vx: 0.5,
			vy: 0,
			mass: 50,
			radius: 25,
			color: "#FF6B6B",
		},
		{
			id: "2",
			x: 600,
			y: 300,
			vx: -0.5,
			vy: 0,
			mass: 30,
			radius: 20,
			color: "#4ECDC4",
		},
		{
			id: "3",
			x: 400,
			y: 150,
			vx: 0,
			vy: 0.3,
			mass: 40,
			radius: 22,
			color: "#45B7D1",
		},
	]);

	const [particles, setParticles] = useState<Particle[]>([]);
	const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
	const [isPaused, setIsPaused] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [initialEnergy, setInitialEnergy] = useState<EnergyMetrics | null>(
		null
	);
	const [currentEnergy, setCurrentEnergy] = useState<EnergyMetrics | null>(
		null
	);
	const animationRef = useRef<number | null>(null);
	const [stars, setStars] = useState<
		{
			x: number;
			y: number;
			radius: number;
			alpha: number;
		}[]
	>([]);

	const [canvasDimensions, setCanvasDimensions] = useState({
		width: 820,
		height: 610,
	});

	const G = 0.1;
	const CANVAS_WIDTH = canvasDimensions.width;
	const CANVAS_HEIGHT = canvasDimensions.height;

	const showToast = (
		message: string,
		type: "info" | "warning" | "error" | "success" = "info"
	) => {
		const id = nextToastId.current++;
		setToasts((prev) => [...prev, { id, message, type }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 3000);
	};

	const handleNotImplemented = (feature: string) => {
		showToast(`${feature} will be available soon`, "info");
	};

	useEffect(() => {
		const handleResize = () => {
			const containerDiv = document.getElementById("canvas-container");
			if (containerDiv) {
				const containerWidth = containerDiv.clientWidth;
				const containerHeight = Math.min(window.innerHeight * 0.6, 610);

				const aspectRatio = 820 / 610;
				let width = containerWidth;
				let height = width / aspectRatio;

				if (height > containerHeight) {
					height = containerHeight;
					width = height * aspectRatio;
				}

				setCanvasDimensions({
					width: Math.floor(width),
					height: Math.floor(height),
				});
			}
		};

		window.addEventListener("resize", handleResize);

		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		setStars(generateStars(200, CANVAS_WIDTH, CANVAS_HEIGHT));
	}, [CANVAS_WIDTH, CANVAS_HEIGHT]);

	const calculateEnergy = useCallback(
		(planetList: Planet[]): EnergyMetrics => {
			let kineticEnergy = 0;
			let potentialEnergy = 0;

			planetList.forEach((planet) => {
				const v = Math.sqrt(planet.vx * planet.vx + planet.vy * planet.vy);
				kineticEnergy += 0.5 * planet.mass * v * v;
			});

			for (let i = 0; i < planetList.length; i++) {
				for (let j = i + 1; j < planetList.length; j++) {
					const dx = planetList[i].x - planetList[j].x;
					const dy = planetList[i].y - planetList[j].y;
					const r = Math.sqrt(dx * dx + dy * dy);
					if (r > (planetList[i].radius + planetList[j].radius) * 0.1) {
						potentialEnergy -=
							(G * planetList[i].mass * planetList[j].mass) / r;
					}
				}
			}
			return {
				kineticEnergy,
				potentialEnergy,
				totalEnergy: kineticEnergy + potentialEnergy,
			};
		},
		[G]
	);

	const initialEnergyPlanetsCountRef = useRef(planets.length);

	useEffect(() => {
		const energy = calculateEnergy(planets);
		if (
			!initialEnergy ||
			planets.length !== initialEnergyPlanetsCountRef.current
		) {
			setInitialEnergy(energy);
			initialEnergyPlanetsCountRef.current = planets.length;
		}
		setCurrentEnergy(energy);
	}, [planets, calculateEnergy, initialEnergy]);

	const createCollisionParticles = (
		x: number,
		y: number,
		color1: string,
		color2: string,
		impactSpeed: number
	) => {
		const newParticles: Particle[] = [];
		const numParticles = Math.min(50, 10 + Math.floor(impactSpeed * 5));
		for (let i = 0; i < numParticles; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 1 + Math.random() * (impactSpeed * 0.5 + 2);
			newParticles.push({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				life: 0.5 + Math.random() * 0.5,
				color: Math.random() > 0.5 ? color1 : color2,
			});
		}
		return newParticles;
	};

	const updatePhysics = useCallback(() => {
		if (isPaused || currentPage !== "home") return;

		setPlanets((prevPlanets) => {
			let newPlanets = JSON.parse(JSON.stringify(prevPlanets)) as Planet[];

			for (let i = 0; i < newPlanets.length; i++) {
				if (newPlanets[i].isDragging) continue;
				for (let j = 0; j < newPlanets.length; j++) {
					if (i === j) continue;
					const dx = newPlanets[j].x - newPlanets[i].x;
					const dy = newPlanets[j].y - newPlanets[i].y;
					let r = Math.sqrt(dx * dx + dy * dy);
					r = Math.max(r, (newPlanets[i].radius + newPlanets[j].radius) * 0.1);

					const F = (G * newPlanets[i].mass * newPlanets[j].mass) / (r * r);
					const ax = (F * dx) / (r * newPlanets[i].mass);
					const ay = (F * dy) / (r * newPlanets[i].mass);
					newPlanets[i].vx += ax;
					newPlanets[i].vy += ay;
				}
			}

			for (let i = 0; i < newPlanets.length; i++) {
				if (!newPlanets[i].isDragging) {
					newPlanets[i].x += newPlanets[i].vx;
					newPlanets[i].y += newPlanets[i].vy;
				}

				const xScaleFactor = CANVAS_WIDTH / 820;
				const yScaleFactor = CANVAS_HEIGHT / 610;

				const restitution = 0.7;
				if (newPlanets[i].x - newPlanets[i].radius < 0) {
					newPlanets[i].vx *= -restitution;
					newPlanets[i].x = newPlanets[i].radius;
				} else if (newPlanets[i].x + newPlanets[i].radius > CANVAS_WIDTH) {
					newPlanets[i].vx *= -restitution;
					newPlanets[i].x = CANVAS_WIDTH - newPlanets[i].radius;
				}
				if (newPlanets[i].y - newPlanets[i].radius < 0) {
					newPlanets[i].vy *= -restitution;
					newPlanets[i].y = newPlanets[i].radius;
				} else if (newPlanets[i].y + newPlanets[i].radius > CANVAS_HEIGHT) {
					newPlanets[i].vy *= -restitution;
					newPlanets[i].y = CANVAS_HEIGHT - newPlanets[i].radius;
				}
			}

			for (let i = 0; i < newPlanets.length; i++) {
				for (let j = i + 1; j < newPlanets.length; j++) {
					const dx = newPlanets[i].x - newPlanets[j].x;
					const dy = newPlanets[i].y - newPlanets[j].y;
					const r = Math.sqrt(dx * dx + dy * dy);

					if (r < newPlanets[i].radius + newPlanets[j].radius) {
						const collisionX =
							(newPlanets[i].x * newPlanets[j].radius +
								newPlanets[j].x * newPlanets[i].radius) /
							(newPlanets[i].radius + newPlanets[j].radius);
						const collisionY =
							(newPlanets[i].y * newPlanets[j].radius +
								newPlanets[j].y * newPlanets[i].radius) /
							(newPlanets[i].radius + newPlanets[j].radius);

						const m1 = newPlanets[i].mass;
						const m2 = newPlanets[j].mass;
						const v1x = newPlanets[i].vx;
						const v1y = newPlanets[i].vy;
						const v2x = newPlanets[j].vx;
						const v2y = newPlanets[j].vy;

						const nx = dx / r;
						const ny = dy / r;
						const dvx = v1x - v2x;
						const dvy = v1y - v2y;
						const dvn = dvx * nx + dvy * ny;

						if (dvn > 0) continue;

						const impactSpeed = Math.abs(dvn);
						setParticles((prev) => [
							...prev,
							...createCollisionParticles(
								collisionX,
								collisionY,
								newPlanets[i].color,
								newPlanets[j].color,
								impactSpeed
							),
						]);

						const collisionRestitution = 0.7;
						const impulse =
							(-(1 + collisionRestitution) * dvn) / (1 / m1 + 1 / m2);

						newPlanets[i].vx += (impulse * nx) / m1;
						newPlanets[i].vy += (impulse * ny) / m1;
						newPlanets[j].vx -= (impulse * nx) / m2;
						newPlanets[j].vy -= (impulse * ny) / m2;

						const overlap = newPlanets[i].radius + newPlanets[j].radius - r;
						if (overlap > 0) {
							const separationFactor = 0.5;
							const totalMass = m1 + m2;
							if (totalMass > 0) {
								newPlanets[i].x +=
									overlap * nx * separationFactor * (m2 / totalMass);
								newPlanets[i].y +=
									overlap * ny * separationFactor * (m2 / totalMass);
								newPlanets[j].x -=
									overlap * nx * separationFactor * (m1 / totalMass);
								newPlanets[j].y -=
									overlap * ny * separationFactor * (m1 / totalMass);
							} else {
								newPlanets[i].x += overlap * nx * separationFactor * 0.5;
								newPlanets[i].y += overlap * ny * separationFactor * 0.5;
								newPlanets[j].x -= overlap * nx * separationFactor * 0.5;
								newPlanets[j].y -= overlap * ny * separationFactor * 0.5;
							}
						}
					}
				}
			}
			return newPlanets;
		});

		setParticles((prev) =>
			prev
				.map((p) => ({
					...p,
					x: p.x + p.vx,
					y: p.y + p.vy,
					life: p.life - 0.015,
					vx: p.vx * 0.99,
					vy: p.vy * 0.99,
				}))
				.filter((p) => p.life > 0)
		);
	}, [isPaused, G, CANVAS_WIDTH, CANVAS_HEIGHT, currentPage]);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || currentPage !== "home") return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const scaleX = canvas.width / CANVAS_WIDTH;
		const scaleY = canvas.height / CANVAS_HEIGHT;
		ctx.save();
		ctx.scale(scaleX, scaleY);

		ctx.fillStyle = "#0D1117";
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		stars.forEach((star) => {
			ctx.beginPath();
			ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${
				star.alpha * (0.5 + Math.sin(Date.now() * 0.001 + star.x) * 0.5)
			})`;
			ctx.fill();
		});

		particles.forEach((particle) => {
			ctx.globalAlpha = Math.max(0, particle.life);
			ctx.fillStyle = particle.color;
			ctx.beginPath();
			const trailLength = 3;
			const endX = particle.x - particle.vx * trailLength * 0.1;
			const endY = particle.y - particle.vy * trailLength * 0.1;
			ctx.moveTo(endX, endY);
			ctx.arc(
				particle.x,
				particle.y,
				Math.max(1, particle.life * 2.5),
				0,
				Math.PI * 2
			);
			ctx.fill();
		});
		ctx.globalAlpha = 1;

		planets.forEach((planet) => {
			ctx.shadowColor = planet.color;
			ctx.shadowBlur = 20;

			const gradient = ctx.createRadialGradient(
				planet.x - planet.radius * 0.3,
				planet.y - planet.radius * 0.3,
				planet.radius * 0.1,
				planet.x,
				planet.y,
				planet.radius
			);
			gradient.addColorStop(0, "rgba(255,255,255,0.7)");
			gradient.addColorStop(0.5, planet.color);
			gradient.addColorStop(1, chroma(planet.color).darken(0.6));

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
			ctx.fill();

			ctx.shadowBlur = 0;

			if (selectedPlanet === planet.id) {
				ctx.strokeStyle = "#00A8FF";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(planet.x, planet.y, planet.radius + 5, 0, Math.PI * 2);
				ctx.stroke();

				ctx.setLineDash([5, 5]);
				ctx.lineDashOffset = -(Date.now() / 50) % 10;
				ctx.stroke();
				ctx.setLineDash([]);
			}
		});

		ctx.restore();
	}, [
		planets,
		particles,
		selectedPlanet,
		stars,
		CANVAS_WIDTH,
		CANVAS_HEIGHT,
		currentPage,
	]);

	useEffect(() => {
		const gameLoop = () => {
			updatePhysics();
			draw();
			animationRef.current = requestAnimationFrame(gameLoop);
		};
		animationRef.current = requestAnimationFrame(gameLoop);
		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
		};
	}, [updatePhysics, draw]);

	const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();

		const scaleX = CANVAS_WIDTH / canvas.clientWidth;
		const scaleY = CANVAS_HEIGHT / canvas.clientHeight;

		const x = (e.clientX - rect.left) * scaleX;
		const y = (e.clientY - rect.top) * scaleY;

		let foundPlanet = false;
		for (let i = planets.length - 1; i >= 0; i--) {
			const planet = planets[i];
			const dx = x - planet.x;
			const dy = y - planet.y;
			if (Math.sqrt(dx * dx + dy * dy) <= planet.radius) {
				setSelectedPlanet(planet.id);
				setDragOffset({ x: dx, y: dy });
				setPlanets((prev) =>
					prev.map((p) =>
						p.id === planet.id ? { ...p, isDragging: true, vx: 0, vy: 0 } : p
					)
				);
				foundPlanet = true;
				break;
			}
		}
		if (!foundPlanet) {
			setSelectedPlanet(null);
		}
	};

	const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas || !selectedPlanet) return;

		if (e.buttons !== 1) {
			handleCanvasMouseUp();
			return;
		}

		const rect = canvas.getBoundingClientRect();
		const scaleX = CANVAS_WIDTH / canvas.clientWidth;
		const scaleY = CANVAS_HEIGHT / canvas.clientHeight;

		const x = (e.clientX - rect.left) * scaleX;
		const y = (e.clientY - rect.top) * scaleY;

		setPlanets((prev) =>
			prev.map((planet) =>
				planet.id === selectedPlanet && planet.isDragging
					? { ...planet, x: x - dragOffset.x, y: y - dragOffset.y }
					: planet
			)
		);
	};

	const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		const canvas = canvasRef.current;
		if (!canvas || e.touches.length !== 1) return;

		const rect = canvas.getBoundingClientRect();
		const touch = e.touches[0];

		const scaleX = CANVAS_WIDTH / canvas.clientWidth;
		const scaleY = CANVAS_HEIGHT / canvas.clientHeight;

		const x = (touch.clientX - rect.left) * scaleX;
		const y = (touch.clientY - rect.top) * scaleY;

		let foundPlanet = false;
		for (let i = planets.length - 1; i >= 0; i--) {
			const planet = planets[i];
			const dx = x - planet.x;
			const dy = y - planet.y;
			if (Math.sqrt(dx * dx + dy * dy) <= planet.radius) {
				setSelectedPlanet(planet.id);
				setDragOffset({ x: dx, y: dy });
				setPlanets((prev) =>
					prev.map((p) =>
						p.id === planet.id ? { ...p, isDragging: true, vx: 0, vy: 0 } : p
					)
				);
				foundPlanet = true;
				break;
			}
		}
		if (!foundPlanet) {
			setSelectedPlanet(null);
		}
	};

	const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		const canvas = canvasRef.current;
		if (!canvas || !selectedPlanet || e.touches.length !== 1) return;

		const rect = canvas.getBoundingClientRect();
		const touch = e.touches[0];

		const scaleX = CANVAS_WIDTH / canvas.clientWidth;
		const scaleY = CANVAS_HEIGHT / canvas.clientHeight;

		const x = (touch.clientX - rect.left) * scaleX;
		const y = (touch.clientY - rect.top) * scaleY;

		setPlanets((prev) =>
			prev.map((planet) =>
				planet.id === selectedPlanet && planet.isDragging
					? { ...planet, x: x - dragOffset.x, y: y - dragOffset.y }
					: planet
			)
		);
	};

	const handleCanvasTouchEnd = () => {
		handleCanvasMouseUp();
	};

	const handleCanvasMouseUp = () => {
		if (selectedPlanet) {
			setPlanets((prev) =>
				prev.map((p) =>
					p.id === selectedPlanet ? { ...p, isDragging: false } : { ...p }
				)
			);
		}
	};

	const handleMassChange = (planetId: string, newMass: number) => {
		setPlanets((prev) =>
			prev.map((planet) => {
				if (planet.id === planetId) {
					const oldMass = planet.mass;
					if (oldMass === 0 && newMass > 0) {
						return {
							...planet,
							mass: newMass,
							radius: Math.max(5, Math.sqrt(newMass) * 2),
						};
					}
					if (oldMass <= 0)
						return {
							...planet,
							mass: newMass,
							radius: Math.max(5, planet.radius),
						};

					const scale = Math.pow(newMass / oldMass, 1 / 3);
					return {
						...planet,
						mass: newMass,
						radius: Math.max(5, planet.radius * scale),
					};
				}
				return planet;
			})
		);
	};

	const resetSimulation = () => {
		const xScale = CANVAS_WIDTH / 820;
		const yScale = CANVAS_HEIGHT / 610;

		const initialPlanetsData = [
			{
				id: "1",
				x: 200 * xScale,
				y: 300 * yScale,
				vx: 0.5,
				vy: 0,
				mass: 50,
				radius: 25,
				color: "#FF6B6B",
			},
			{
				id: "2",
				x: 600 * xScale,
				y: 300 * yScale,
				vx: -0.5,
				vy: 0,
				mass: 30,
				radius: 20,
				color: "#4ECDC4",
			},
			{
				id: "3",
				x: 400 * xScale,
				y: 150 * yScale,
				vx: 0,
				vy: 0.3,
				mass: 40,
				radius: 22,
				color: "#45B7D1",
			},
		];
		setPlanets(initialPlanetsData);
		setParticles([]);
		const energy = calculateEnergy(initialPlanetsData);
		setInitialEnergy(energy);
		setCurrentEnergy(energy);
		initialEnergyPlanetsCountRef.current = initialPlanetsData.length;
		setIsPaused(false);
		setSelectedPlanet(null);
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const PlaceholderPage = ({ title }: { title: string }) => (
		<div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#0D1117] px-4 text-center">
			<FaExclamationTriangle className="text-6xl text-yellow-500 mb-6" />
			<h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-4">
				This page will be available soon
			</h2>
			<button
				onClick={() => setCurrentPage("home")}
				className="mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
			>
				<FaArrowLeft /> Return to Home
			</button>
		</div>
	);

	const ToastContainer = () => (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`
            flex items-center p-3 rounded-lg shadow-lg text-white min-w-[200px] max-w-[350px] animate-slideIn
            ${toast.type === "info" ? "bg-blue-600" : ""}
            ${toast.type === "warning" ? "bg-yellow-500" : ""}
            ${toast.type === "error" ? "bg-red-600" : ""}
            ${toast.type === "success" ? "bg-green-600" : ""}
          `}
				>
					<div className="flex-1">{toast.message}</div>
					<button
						onClick={() =>
							setToasts((prev) => prev.filter((t) => t.id !== toast.id))
						}
						className="ml-2 text-white opacity-70 hover:opacity-100"
					>
						<FaTimes />
					</button>
				</div>
			))}
		</div>
	);

	return (
		<div className="min-h-screen bg-[#0D1117] text-[#c9d1d9] font-sans">
			{}
			<header className="sticky top-0 z-30 bg-[#161B22] border-b border-[#30363d] p-4 md:px-8">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<FaRocket className="text-2xl text-[#58a6ff]" />
						<h1 className="text-xl md:text-2xl font-bold">
							Cosmic Ed <span className="text-[#58a6ff]">Labs</span>
						</h1>
					</div>

					{}
					<nav className="hidden md:flex items-center gap-6">
						<button
							onClick={() => setCurrentPage("home")}
							className={`flex items-center gap-1.5 font-semibold ${
								currentPage === "home"
									? "text-[#58a6ff]"
									: "text-[#c9d1d9] hover:text-[#58a6ff]"
							}`}
						>
							<FaHome /> Home
						</button>
						<button
							onClick={() => {
								setCurrentPage("games");
								handleNotImplemented("Games page");
							}}
							className={`flex items-center gap-1.5 font-semibold ${
								currentPage === "games"
									? "text-[#58a6ff]"
									: "text-[#c9d1d9] hover:text-[#58a6ff]"
							}`}
						>
							<FaGamepad /> Games
						</button>
						<button
							onClick={() => {
								setCurrentPage("lessons");
								handleNotImplemented("Lessons page");
							}}
							className={`flex items-center gap-1.5 font-semibold ${
								currentPage === "lessons"
									? "text-[#58a6ff]"
									: "text-[#c9d1d9] hover:text-[#58a6ff]"
							}`}
						>
							<FaChalkboardTeacher /> Lessons
						</button>
						<button
							onClick={() => {
								setCurrentPage("about");
								handleNotImplemented("About page");
							}}
							className={`flex items-center gap-1.5 font-semibold ${
								currentPage === "about"
									? "text-[#58a6ff]"
									: "text-[#c9d1d9] hover:text-[#58a6ff]"
							}`}
						>
							<FaQuestion /> About
						</button>
						<button
							onClick={() => {
								setCurrentPage("contact");
								handleNotImplemented("Contact page");
							}}
							className={`flex items-center gap-1.5 font-semibold ${
								currentPage === "contact"
									? "text-[#58a6ff]"
									: "text-[#c9d1d9] hover:text-[#58a6ff]"
							}`}
						>
							<FaEnvelope /> Contact
						</button>
						<button
							onClick={() => setShowSignInModal(true)}
							className="flex items-center gap-1.5 bg-[#238636] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#2ea043] transition-colors"
						>
							<FaUser /> Sign In
						</button>
					</nav>

					{}
					<button
						onClick={toggleMobileMenu}
						className="md:hidden text-2xl text-[#c9d1d9]"
					>
						{mobileMenuOpen ? <FaTimes /> : <FaBars />}
					</button>
				</div>
			</header>

			{}
			{mobileMenuOpen && (
				<div className="md:hidden fixed inset-x-0 top-[65px] bg-[#161B22] border-b border-[#30363d] z-20">
					<div className="flex flex-col p-4">
						<button
							onClick={() => {
								setCurrentPage("home");
								setMobileMenuOpen(false);
							}}
							className={`flex items-center gap-2 p-4 border-b border-[#30363d] font-semibold ${
								currentPage === "home" ? "text-[#58a6ff]" : "text-[#c9d1d9]"
							}`}
						>
							<FaHome /> Home
						</button>
						<button
							onClick={() => {
								setCurrentPage("games");
								setMobileMenuOpen(false);
								handleNotImplemented("Games page");
							}}
							className={`flex items-center gap-2 p-4 border-b border-[#30363d] font-semibold ${
								currentPage === "games" ? "text-[#58a6ff]" : "text-[#c9d1d9]"
							}`}
						>
							<FaGamepad /> Games
						</button>
						<button
							onClick={() => {
								setCurrentPage("lessons");
								setMobileMenuOpen(false);
								handleNotImplemented("Lessons page");
							}}
							className={`flex items-center gap-2 p-4 border-b border-[#30363d] font-semibold ${
								currentPage === "lessons" ? "text-[#58a6ff]" : "text-[#c9d1d9]"
							}`}
						>
							<FaChalkboardTeacher /> Lessons
						</button>
						<button
							onClick={() => {
								setCurrentPage("about");
								setMobileMenuOpen(false);
								handleNotImplemented("About page");
							}}
							className={`flex items-center gap-2 p-4 border-b border-[#30363d] font-semibold ${
								currentPage === "about" ? "text-[#58a6ff]" : "text-[#c9d1d9]"
							}`}
						>
							<FaQuestion /> About
						</button>
						<button
							onClick={() => {
								setCurrentPage("contact");
								setMobileMenuOpen(false);
								handleNotImplemented("Contact page");
							}}
							className={`flex items-center gap-2 p-4 border-b border-[#30363d] font-semibold ${
								currentPage === "contact" ? "text-[#58a6ff]" : "text-[#c9d1d9]"
							}`}
						>
							<FaEnvelope /> Contact
						</button>
						<button
							onClick={() => {
								setShowSignInModal(true);
								setMobileMenuOpen(false);
							}}
							className="flex items-center justify-center gap-2 bg-[#238636] text-white p-3 rounded-md font-semibold my-4"
						>
							<FaUser /> Sign In
						</button>
					</div>
				</div>
			)}

			{}
			{currentPage === "home" ? (
				<>
					{}
					<section className="py-10 md:py-12 px-4 text-center bg-gradient-to-b from-[#0D1117] to-[#161B22] border-b border-[#30363d]">
						<h1 className="text-2xl md:text-4xl text-[#58a6ff] font-extrabold mb-4 flex items-center justify-center">
							<FaRocket className="mr-2" />
							Cosmic Collisions: Interactive Planetary Physics
						</h1>
						<p className="text-base md:text-lg text-[#8b949e] max-w-3xl mx-auto mb-6 leading-relaxed">
							Explore gravitational interactions between planets in this
							educational simulation. Perfect for 6th-grade science classes to
							visualize physics concepts in a fun, interactive way!
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<button
								onClick={() => handleNotImplemented("Teacher's Guide")}
								className="bg-[#238636] text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-[#2ea043] transition-colors"
							>
								Teacher's Guide
							</button>
							<button
								onClick={() => handleNotImplemented("Lesson Plans")}
								className="bg-[#1F6FEB] text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-[#388bfd] transition-colors"
							>
								Lesson Plans
							</button>
						</div>
					</section>

					{}
					<div className="flex flex-col md:flex-row gap-5 p-4 md:p-8 max-w-7xl mx-auto">
						{}
						<div
							id="canvas-container"
							className="flex-grow flex justify-center items-center min-w-0 relative"
						>
							<canvas
								ref={canvasRef}
								width={canvasDimensions.width}
								height={canvasDimensions.height}
								onMouseDown={handleCanvasMouseDown}
								onMouseMove={handleCanvasMouseMove}
								onMouseUp={handleCanvasMouseUp}
								onMouseLeave={handleCanvasMouseUp}
								onTouchStart={handleCanvasTouchStart}
								onTouchMove={handleCanvasTouchMove}
								onTouchEnd={handleCanvasTouchEnd}
								className={`rounded-xl border border-[#30363d] shadow-[0_0_25px_rgba(0,168,255,0.3)] max-w-full max-h-full ${
									selectedPlanet ? "cursor-grabbing" : "cursor-grab"
								} touch-none`}
							/>
						</div>

						{}
						<div className="w-full md:w-80 md:min-w-[320px] flex-shrink-0 max-h-[calc(100vh-40px)] overflow-y-auto scrollbar-hide p-5 bg-[rgba(13,17,23,0.6)] backdrop-blur-xl backdrop-saturate-[180%] border border-[rgba(48,54,61,0.5)] rounded-2xl shadow-xl flex flex-col">
							<h2 className="text-[#58a6ff] mb-6 text-center text-2xl font-bold flex items-center justify-center gap-2">
								<FaRocket className="text-2xl" /> Simulation Controls
							</h2>

							<div className="mb-6">
								<button
									onClick={() => setIsPaused(!isPaused)}
									className={`flex items-center justify-center gap-2 w-full p-3 text-base font-bold rounded-lg mb-2.5 border border-[#30363d] transition-colors ${
										isPaused
											? "bg-[#238636] hover:border-[#3FB950]"
											: "bg-[#DA3633] hover:border-[#F85149]"
									}`}
								>
									{isPaused ? <FaPlay /> : <FaPause />}{" "}
									{isPaused ? "Resume" : "Pause"}
								</button>

								<button
									onClick={resetSimulation}
									className="flex items-center justify-center gap-2 w-full p-3 text-base font-bold bg-[#21262d] text-[#c9d1d9] rounded-lg border border-[#30363d] hover:border-[#58a6ff] transition-colors"
								>
									<FaSyncAlt /> Reset Simulation
								</button>
							</div>

							<div className="bg-[rgba(22,27,34,0.8)] backdrop-blur-md border border-[#30363d] rounded-xl p-4 mb-5 shadow-lg">
								<h3 className="text-[#58a6ff] mb-4 flex items-center gap-2 font-semibold">
									<FaAtom /> Planet Properties
								</h3>
								{planets.map((planet) => (
									<div
										key={planet.id}
										className={`bg-[rgba(33,38,45,0.7)] p-3 rounded-lg mb-3 transition-colors ${
											selectedPlanet === planet.id
												? "border-2 border-[#58a6ff]"
												: "border border-[#30363d]"
										}`}
									>
										<div className="flex items-center mb-2">
											<div
												className="w-[18px] h-[18px] rounded-full mr-2.5 border-2 border-[rgba(255,255,255,0.3)]"
												style={{ backgroundColor: planet.color }}
											/>
											<span className="font-semibold text-[15px]">
												Planet {planet.id}
											</span>
										</div>
										<div className="text-[13px] mb-2 opacity-80">
											Velocity:{" "}
											{Math.sqrt(planet.vx ** 2 + planet.vy ** 2).toFixed(2)}{" "}
											m/s
										</div>
										<div>
											<label className="text-[13px] block mb-1.5 opacity-80">
												Mass: {planet.mass.toFixed(0)} kg
											</label>
											<input
												className="w-full h-2 bg-[#30363d] rounded-md appearance-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
												type="range"
												min="5"
												max="150"
												step="1"
												value={planet.mass}
												onChange={(e) =>
													handleMassChange(planet.id, Number(e.target.value))
												}
											/>
										</div>
									</div>
								))}
								{!planets.length && (
									<p className="text-center opacity-70">
										No planets in simulation.
									</p>
								)}
							</div>

							<div className="bg-[rgba(22,27,34,0.8)] backdrop-blur-md border border-[#30363d] rounded-xl p-4 mb-5 shadow-lg">
								<h3 className="text-[#58a6ff] mb-4 flex items-center gap-2 font-semibold">
									<FaBolt /> Energy Metrics
								</h3>
								{initialEnergy && currentEnergy ? (
									<>
										<div className="mb-4">
											<h4 className="text-[#8b949e] mb-2 text-sm font-semibold">
												Initial State
											</h4>
											<div className="text-[13px] opacity-80 leading-relaxed">
												<div>
													Kinetic: {initialEnergy.kineticEnergy.toFixed(1)} J
												</div>
												<div>
													Potential: {initialEnergy.potentialEnergy.toFixed(1)}{" "}
													J
												</div>
												<div className="font-bold text-[#c9d1d9]">
													Total: {initialEnergy.totalEnergy.toFixed(1)} J
												</div>
											</div>
										</div>

										<div className="mb-4">
											<h4 className="text-[#8b949e] mb-2 text-sm font-semibold">
												Current State
											</h4>
											<div className="text-[13px] opacity-80 leading-relaxed">
												<div>
													Kinetic: {currentEnergy.kineticEnergy.toFixed(1)} J
												</div>
												<div>
													Potential: {currentEnergy.potentialEnergy.toFixed(1)}{" "}
													J
												</div>
												<div className="font-bold text-[#c9d1d9]">
													Total: {currentEnergy.totalEnergy.toFixed(1)} J
												</div>
											</div>
										</div>

										{initialEnergy.totalEnergy !== 0 &&
										Math.abs(initialEnergy.totalEnergy) > 1e-6 ? (
											<div className="mt-4 p-2.5 bg-[rgba(33,38,45,0.7)] rounded-md text-center border border-[#30363d]">
												<div className="text-[13px] text-[#58a6ff] font-bold">
													Energy Conservation:{" "}
													{(
														(currentEnergy.totalEnergy /
															initialEnergy.totalEnergy) *
														100
													).toFixed(1)}
													%
												</div>
											</div>
										) : (
											<p className="text-center opacity-70 text-[13px]">
												Energy conservation N/A (initial total energy is zero).
											</p>
										)}
									</>
								) : (
									<p className="text-center opacity-70">
										Calculating energy...
									</p>
								)}
							</div>

							<div className="bg-[rgba(33,38,45,0.5)] border border-[#30363d] rounded-xl p-4 shadow-lg">
								<h3 className="text-[#8b949e] mb-2.5 flex items-center gap-2 text-sm">
									<FaInfoCircle /> Quick Tips
								</h3>
								<p className="text-[13px] opacity-70 leading-normal mb-1">
									🎯 Drag planets to reposition.
								</p>
								<p className="text-[13px] opacity-70 leading-normal">
									🌟 Collisions create particle effects!
								</p>
								<p className="text-[13px] opacity-70 leading-normal mt-1">
									⚖️ Adjust mass to see different interactions.
								</p>
							</div>
						</div>
					</div>

					{}
					<section className="py-12 px-4 bg-[#161B22] border-t border-[#30363d]">
						<div className="max-w-6xl mx-auto text-center">
							<h2 className="text-2xl md:text-3xl text-[#58a6ff] mb-8">
								Educational Features
							</h2>

							<div className="flex flex-wrap justify-center gap-6 md:gap-8">
								<div className="w-full sm:w-[300px] bg-[rgba(13,17,23,0.6)] rounded-xl p-6 border border-[#30363d]">
									<FaGraduationCap className="text-4xl text-[#58a6ff] mx-auto mb-4" />
									<h3 className="text-[#c9d1d9] mb-2 font-semibold">
										Physics Concepts
									</h3>
									<p className="text-[#8b949e] text-sm leading-relaxed">
										Learn about gravity, momentum, and energy conservation
										through interactive experimentation.
									</p>
								</div>

								<div className="w-full sm:w-[300px] bg-[rgba(13,17,23,0.6)] rounded-xl p-6 border border-[#30363d]">
									<FaAtom className="text-4xl text-[#FF6B6B] mx-auto mb-4" />
									<h3 className="text-[#c9d1d9] mb-2 font-semibold">
										Real-Time Data
									</h3>
									<p className="text-[#8b949e] text-sm leading-relaxed">
										Watch how velocity, mass, and energy change during planetary
										interactions.
									</p>
								</div>

								<div className="w-full sm:w-[300px] bg-[rgba(13,17,23,0.6)] rounded-xl p-6 border border-[#30363d]">
									<FaRocket className="text-4xl text-[#4ECDC4] mx-auto mb-4" />
									<h3 className="text-[#c9d1d9] mb-2 font-semibold">
										Hands-On Learning
									</h3>
									<p className="text-[#8b949e] text-sm leading-relaxed">
										Students can experiment by dragging planets and adjusting
										masses to see different outcomes.
									</p>
								</div>
							</div>
						</div>
					</section>

					{}
					<section className="py-12 px-4 bg-[#0D1117]">
						<div className="max-w-5xl mx-auto text-center">
							<h2 className="text-2xl md:text-3xl text-[#c9d1d9] mb-10">
								What Teachers Are Saying
							</h2>

							<div className="flex flex-wrap justify-center gap-6 md:gap-8">
								<div className="w-full sm:w-[300px] bg-[rgba(22,27,34,0.6)] rounded-xl p-6 border border-[#30363d] text-left">
									<p className="text-[#8b949e] text-base leading-relaxed mb-4 italic">
										"My students love this simulation! It's the perfect blend of
										fun and educational content for our physics unit."
									</p>
									<p className="text-[#58a6ff] font-semibold">Ms. Johnson</p>
									<p className="text-[#8b949e] text-sm">
										6th Grade Science, Lincoln Middle School
									</p>
								</div>

								<div className="w-full sm:w-[300px] bg-[rgba(22,27,34,0.6)] rounded-xl p-6 border border-[#30363d] text-left">
									<p className="text-[#8b949e] text-base leading-relaxed mb-4 italic">
										"Cosmic Collisions has been a great addition to our computer
										lab curriculum. The energy metrics really help visualize
										conservation principles."
									</p>
									<p className="text-[#58a6ff] font-semibold">Mr. Rodriguez</p>
									<p className="text-[#8b949e] text-sm">
										Science Department Chair, Washington Elementary
									</p>
								</div>
							</div>
						</div>
					</section>

					{}
					<section className="py-12 px-4 bg-[#161B22] border-t border-[#30363d] text-center">
						<h2 className="text-2xl md:text-3xl text-[#c9d1d9] mb-5">
							Ready to Enhance Your Science Curriculum?
						</h2>
						<p className="text-[#8b949e] text-base md:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
							Join thousands of teachers using Cosmic Ed Labs in their
							classrooms. Get full access to this and many other interactive
							simulations.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<button
								onClick={() => handleNotImplemented("Free Trial")}
								className="bg-[#238636] text-white px-7 py-3.5 rounded-md text-base font-semibold hover:bg-[#2ea043] transition-colors"
							>
								Start Free Trial
							</button>
							<button
								onClick={() => handleNotImplemented("Lesson Plans")}
								className="bg-transparent text-[#58a6ff] border border-[#58a6ff] px-7 py-3.5 rounded-md text-base font-semibold hover:bg-[rgba(88,166,255,0.1)] transition-colors"
							>
								View Lesson Plans
							</button>
						</div>
					</section>
				</>
			) : (
				<PlaceholderPage title={currentPage} />
			)}

			{}
			<footer className="bg-[#0D1117] border-t border-[#30363d] py-10 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8">
						<div className="mb-6 md:mb-0 text-center md:text-left">
							<div className="flex items-center gap-2.5 justify-center md:justify-start mb-4">
								<FaRocket className="text-2xl text-[#58a6ff]" />
								<h2 className="text-xl text-[#c9d1d9]">
									Cosmic Ed <span className="text-[#58a6ff]">Labs</span>
								</h2>
							</div>
							<p className="text-[#8b949e] max-w-md text-sm leading-relaxed">
								Interactive educational tools designed specifically for K-12
								science classrooms. Making complex physics concepts accessible
								and fun!
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-8 md:gap-12 mt-6 md:mt-0">
							<div>
								<h4 className="text-[#c9d1d9] mb-4 font-medium">Company</h4>
								<ul className="space-y-2">
									<li>
										<button
											onClick={() => handleNotImplemented("About Us")}
											className="text-[#58a6ff] hover:text-[#1f6feb]"
										>
											About Us
										</button>
									</li>
									<li>
										<button
											onClick={() => handleNotImplemented("Careers")}
											className="text-[#58a6ff] hover:text-[#1f6feb]"
										>
											Careers
										</button>
									</li>
									<li>
										<button
											onClick={() => handleNotImplemented("Blog")}
											className="text-[#58a6ff] hover:text-[#1f6feb]"
										>
											Blog
										</button>
									</li>
									<li>
										<button
											onClick={() => handleNotImplemented("Contact")}
											className="text-[#58a6ff] hover:text-[#1f6feb]"
										>
											Contact
										</button>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="text-[#c9d1d9] mb-4 font-medium">Support</h4>
								<ul className="space-y-2">
									<li>
										<button
											onClick={() => handleNotImplemented("Help Center")}
											className="text-[#58a6ff] hover:text-[#1f6feb]"
										>
											Help Center
										</button>
									</li>
									<li>
										<button
											onClick={() => handleNotImplemented("Teacher Resources")}
											className="text-[#58a6ff] hover:text-[#1f6feb]"
										>
											Teacher Resources
										</button>
									</li>
									<li>
										<button
											onClick={() => handleNotImplemented("FAQs")}
											className="text-[#58a6ff] hover:text-[#1f6feb]"
										>
											FAQs
										</button>
									</li>
									<li>
										<button
											onClick={() => handleNotImplemented("Community")}
											className="text-[#58a6ff] hover:text-[#1f6feb]"
										>
											Community
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-[#30363d] gap-4">
						<p className="text-[#8b949e] text-sm">
							 2025 Cosmic Ed Labs. Visualization beyond your eyes.
						</p>

						<div className="flex gap-4">
							<button
								onClick={() => handleNotImplemented("Twitter")}
								className="text-[#8b949e] hover:text-white transition-colors"
							>
								<FaTwitter className="text-lg" />
							</button>
							<button
								onClick={() => handleNotImplemented("Facebook")}
								className="text-[#8b949e] hover:text-white transition-colors"
							>
								<FaFacebook className="text-lg" />
							</button>
							<button
								onClick={() => handleNotImplemented("Instagram")}
								className="text-[#8b949e] hover:text-white transition-colors"
							>
								<FaInstagram className="text-lg" />
							</button>
							<button
								onClick={() => handleNotImplemented("GitHub")}
								className="text-[#8b949e] hover:text-white transition-colors"
							>
								<FaGithub className="text-lg" />
							</button>
						</div>

						<div className="flex gap-5">
							<button
								onClick={() => handleNotImplemented("Privacy Policy")}
								className="text-[#8b949e] hover:text-white text-sm transition-colors"
							>
								Privacy Policy
							</button>
							<button
								onClick={() => handleNotImplemented("Terms of Service")}
								className="text-[#8b949e] hover:text-white text-sm transition-colors"
							>
								Terms of Service
							</button>
						</div>
					</div>
				</div>
			</footer>

			{}
			{showSignInModal && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
					<div className="bg-[#161B22] rounded-xl border border-[#30363d] p-6 w-full max-w-md animate-fadeIn">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold text-[#c9d1d9]">Sign In</h2>
							<button
								onClick={() => setShowSignInModal(false)}
								className="text-[#8b949e] hover:text-white"
							>
								<FaTimes />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label
									className="block text-sm font-medium text-[#c9d1d9] mb-1"
									htmlFor="email"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									className="w-full p-2.5 bg-[#0D1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none"
									placeholder="your@email.com"
								/>
							</div>

							<div>
								<label
									className="block text-sm font-medium text-[#c9d1d9] mb-1"
									htmlFor="password"
								>
									Password
								</label>
								<input
									type="password"
									id="password"
									className="w-full p-2.5 bg-[#0D1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none"
									placeholder="••••••••"
								/>
							</div>

							<div className="flex justify-between text-sm">
								<label className="flex items-center">
									<input
										type="checkbox"
										className="mr-1.5 rounded bg-[#0D1117] border-[#30363d]"
									/>
									Remember me
								</label>
								<button
									onClick={() => handleNotImplemented("Password recovery")}
									className="text-[#58a6ff] hover:underline"
								>
									Forgot password?
								</button>
							</div>

							<button
								onClick={() => {
									setShowSignInModal(false);
									handleNotImplemented("Sign in functionality");
								}}
								className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2.5 rounded-md font-semibold transition-colors"
							>
								Sign In
							</button>

							<div className="text-center mt-4 text-sm">
								<span className="text-[#8b949e]">Don't have an account? </span>
								<button
									onClick={() => handleNotImplemented("Registration")}
									className="text-[#58a6ff] hover:underline"
								>
									Register now
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{}
			<ToastContainer />

			{}
			<style jsx global>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes slideIn {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
				button,
				a {
					cursor: pointer;
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out forwards;
				}

				.animate-slideIn {
					animation: slideIn 0.3s ease-out forwards;
				}

				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}

				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				input[type="range"] {
					-webkit-appearance: none;
					appearance: none;
					height: 8px;
					background: #30363d;
					border-radius: 5px;
					outline: none;
				}

				input[type="range"]::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					width: 18px;
					height: 18px;
					background: #58a6ff;
					border-radius: 50%;
					cursor: pointer;
					border: 2px solid #0d1117;
				}

				input[type="range"]::-moz-range-thumb {
					width: 18px;
					height: 18px;
					background: #58a6ff;
					border-radius: 50%;
					cursor: pointer;
					border: 2px solid #0d1117;
				}
			`}</style>
		</div>
	);
};

export default PlanetaryCollisionGame;
