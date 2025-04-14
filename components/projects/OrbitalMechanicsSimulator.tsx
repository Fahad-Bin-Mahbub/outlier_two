"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface PlanetData {
	name: string;
	radius: number; // Scaled for visualization (Earth = 1)
	distance: number; // Scaled AU (Earth = 1)
	orbitalPeriod: number; // Earth days
	orbitalEccentricity: number; // Value between 0-1
	obliquity: number; // Axial tilt in degrees
	color: string;
	mass: string; // Textual representation
}

// Real astronomical data with scale factors applied for visualization
const planetaryData: PlanetData[] = [
	{
		name: "Mercury",
		radius: 0.38,
		distance: 0.39,
		orbitalPeriod: 88,
		orbitalEccentricity: 0.206,
		obliquity: 0.03,
		color: "#A9A9A9",
		mass: "3.3 × 10^23 kg",
	},
	{
		name: "Venus",
		radius: 0.95,
		distance: 0.72,
		orbitalPeriod: 225,
		orbitalEccentricity: 0.007,
		obliquity: 177.4,
		color: "#E6E6FA",
		mass: "4.87 × 10^24 kg",
	},
	{
		name: "Earth",
		radius: 1,
		distance: 1,
		orbitalPeriod: 365,
		orbitalEccentricity: 0.017,
		obliquity: 23.44,
		color: "#1E90FF",
		mass: "5.97 × 10^24 kg",
	},
	{
		name: "Mars",
		radius: 0.53,
		distance: 1.52,
		orbitalPeriod: 687,
		orbitalEccentricity: 0.093,
		obliquity: 25.19,
		color: "#FF4500",
		mass: "6.42 × 10^23 kg",
	},
	{
		name: "Jupiter",
		radius: 11.2,
		distance: 5.2,
		orbitalPeriod: 4333,
		orbitalEccentricity: 0.048,
		obliquity: 3.13,
		color: "#CD853F",
		mass: "1.9 × 10^27 kg",
	},
	{
		name: "Saturn",
		radius: 9.45,
		distance: 9.54,
		orbitalPeriod: 10759,
		orbitalEccentricity: 0.054,
		obliquity: 26.73,
		color: "#F0E68C",
		mass: "5.68 × 10^26 kg",
	},
	{
		name: "Uranus",
		radius: 4.01,
		distance: 19.19,
		orbitalPeriod: 30687,
		orbitalEccentricity: 0.047,
		obliquity: 97.77,
		color: "#00FFFF",
		mass: "8.68 × 10^25 kg",
	},
	{
		name: "Neptune",
		radius: 3.88,
		distance: 30.07,
		orbitalPeriod: 60190,
		orbitalEccentricity: 0.009,
		obliquity: 28.32,
		color: "#4169E1",
		mass: "1.02 × 10^26 kg",
	},
];

// Main component
const SolarSystemSimulator: React.FC = () => {
	// References for WebGL
	const mountRef = useRef<HTMLDivElement>(null);

	// Simulation state
	const [timeScale, setTimeScale] = useState<number>(5);
	const [showOrbits, setShowOrbits] = useState<boolean>(true);
	const [showVectors, setShowVectors] = useState<boolean>(true);
	const [showTrails, setShowTrails] = useState<boolean>(false);
	const [isPaused, setIsPaused] = useState<boolean>(false);
	const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

	// Refs to maintain state across renders
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const controlsRef = useRef<OrbitControls | null>(null);
	const animationFrameRef = useRef<number>(0);
	const simulationTimeRef = useRef<number>(0);

	// Planet tracking refs
	const planetsRef = useRef<
		{
			mesh: THREE.Mesh;
			orbit: THREE.Line;
			vectorArrow: THREE.ArrowHelper;
			trail: THREE.Line;
			trailPositions: THREE.Vector3[];
			data: PlanetData;
		}[]
	>([]);

	// Scale factors
	const distanceScale = 10; // 1 AU = 10 units
	const sizeScale = 0.4; // Scaling planet sizes for better visualization
	const timeScaleRef = useRef<number>(timeScale);
	const sunRadius = 2;

	// Setup Three.js scene
	useEffect(() => {
		if (!mountRef.current) return;

		const width = mountRef.current.clientWidth;
		const height = mountRef.current.clientHeight;

		// Create scene
		const scene = new THREE.Scene();
		sceneRef.current = scene;

		// Create camera
		const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
		camera.position.set(0, 40, 40);
		cameraRef.current = camera;

		// Create renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		renderer.setClearColor(0x000000);
		mountRef.current.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		// Add orbit controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controlsRef.current = controls;

		// Create lighting
		const ambientLight = new THREE.AmbientLight(0x333333);
		scene.add(ambientLight);

		// Create Sun
		const sunGeometry = new THREE.SphereGeometry(sunRadius, 32, 32);
		const sunMaterial = new THREE.MeshBasicMaterial({
			color: 0xffff00,
			emissive: 0xffff00,
			emissiveIntensity: 1,
		});
		const sun = new THREE.Mesh(sunGeometry, sunMaterial);
		scene.add(sun);

		// Add point light at sun
		const sunLight = new THREE.PointLight(0xffffff, 2, 300);
		sun.add(sunLight);

		// Create starfield background
		const starGeometry = new THREE.BufferGeometry();
		const starCount = 2000;
		const starPositions = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount * 3; i += 3) {
			// Generate random positions in a spherical distribution
			const radius = 500;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);

			starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
			starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
			starPositions[i + 2] = radius * Math.cos(phi);
		}

		starGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(starPositions, 3)
		);
		const starMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.5,
			sizeAttenuation: true,
		});
		const stars = new THREE.Points(starGeometry, starMaterial);
		scene.add(stars);

		// Create planets
		const planets: {
			mesh: THREE.Mesh;
			orbit: THREE.Line;
			vectorArrow: THREE.ArrowHelper;
			trail: THREE.Line;
			trailPositions: THREE.Vector3[];
			data: PlanetData;
		}[] = [];

		// Create grid helper for reference (optional)
		const gridHelper = new THREE.GridHelper(100, 100, 0x555555, 0x222222);
		gridHelper.visible = false;
		scene.add(gridHelper);

		// Create each planet with its orbit
		planetaryData.forEach((planetData) => {
			// Scale the radius and distance
			const scaledRadius = planetData.radius * sizeScale;
			const scaledDistance = planetData.distance * distanceScale;

			// Calculate orbit parameters
			const a = scaledDistance; // Semi-major axis
			const e = planetData.orbitalEccentricity; // Eccentricity
			const b = a * Math.sqrt(1 - e * e); // Semi-minor axis
			const c = a * e; // Focus distance

			// Create planet mesh
			const planetGeometry = new THREE.SphereGeometry(scaledRadius, 24, 24);
			const planetMaterial = new THREE.MeshLambertMaterial({
				color: planetData.color,
			});
			const planet = new THREE.Mesh(planetGeometry, planetMaterial);

			// Create orbit path (elliptical)
			const orbitPoints: THREE.Vector3[] = [];
			const orbitSegments = 128;

			for (let i = 0; i <= orbitSegments; i++) {
				const angle = (i / orbitSegments) * Math.PI * 2;
				const x = a * Math.cos(angle);
				const z = b * Math.sin(angle);
				// Shift the orbit so the sun is at the focus
				orbitPoints.push(new THREE.Vector3(x - c, 0, z));
			}

			const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
				orbitPoints
			);
			const orbitMaterial = new THREE.LineBasicMaterial({
				color: 0x444444,
				transparent: true,
				opacity: 0.5,
			});
			const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
			scene.add(orbit);

			// Initial position (random angle)
			const startAngle = Math.random() * Math.PI * 2;
			const xPos = a * Math.cos(startAngle) - c;
			const zPos = b * Math.sin(startAngle);
			planet.position.set(xPos, 0, zPos);

			// Calculate initial velocity (perpendicular to radius vector)
			const velocityMagnitude = 0.5 / Math.sqrt(scaledDistance);
			const vx = -velocityMagnitude * Math.sin(startAngle);
			const vz = velocityMagnitude * Math.cos(startAngle);

			// Create velocity vector arrow
			const velocityDir = new THREE.Vector3(vx, 0, vz).normalize();
			const arrowLength = scaledRadius * 5;
			const vectorArrow = new THREE.ArrowHelper(
				velocityDir,
				planet.position,
				arrowLength,
				0x00ff00,
				arrowLength * 0.2,
				arrowLength * 0.1
			);
			scene.add(vectorArrow);
			vectorArrow.visible = showVectors;

			// Create trail
			const trailPositions: THREE.Vector3[] = [planet.position.clone()];
			const trailGeometry = new THREE.BufferGeometry().setFromPoints(
				trailPositions
			);
			const trailMaterial = new THREE.LineBasicMaterial({
				color: planetData.color,
				transparent: true,
				opacity: 0.4,
			});
			const trail = new THREE.Line(trailGeometry, trailMaterial);
			scene.add(trail);
			trail.visible = showTrails;

			// Add planet to scene
			scene.add(planet);

			// Add to planets array
			planets.push({
				mesh: planet,
				orbit: orbit,
				vectorArrow: vectorArrow,
				trail: trail,
				trailPositions: trailPositions,
				data: planetData,
			});
		});

		// Store planets in ref
		planetsRef.current = planets;

		// Handle resize
		const handleResize = () => {
			if (!mountRef.current || !rendererRef.current || !cameraRef.current)
				return;

			const width = mountRef.current.clientWidth;
			const height = mountRef.current.clientHeight;

			rendererRef.current.setSize(width, height);
			cameraRef.current.aspect = width / height;
			cameraRef.current.updateProjectionMatrix();
		};

		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			// Remove renderer from DOM
			if (mountRef.current && rendererRef.current) {
				mountRef.current.removeChild(rendererRef.current.domElement);
			}

			// Dispose resources
			planetsRef.current.forEach((planet) => {
				planet.mesh.geometry.dispose();
				(planet.mesh.material as THREE.Material).dispose();
				planet.orbit.geometry.dispose();
				(planet.orbit.material as THREE.Material).dispose();
				planet.trail.geometry.dispose();
				(planet.trail.material as THREE.Material).dispose();
			});
		};
	}, []);

	// Update time scale ref when state changes
	useEffect(() => {
		timeScaleRef.current = timeScale;
	}, [timeScale]);

	// Update orbit visibility
	useEffect(() => {
		planetsRef.current.forEach((planet) => {
			planet.orbit.visible = showOrbits;
		});
	}, [showOrbits]);

	// Update vector visibility
	useEffect(() => {
		planetsRef.current.forEach((planet) => {
			planet.vectorArrow.visible = showVectors;
		});
	}, [showVectors]);

	// Update trail visibility
	useEffect(() => {
		planetsRef.current.forEach((planet) => {
			planet.trail.visible = showTrails;
		});
	}, [showTrails]);

	// Animation loop
	useEffect(() => {
		// Skip if scene setup isn't complete
		if (
			!sceneRef.current ||
			!cameraRef.current ||
			!rendererRef.current ||
			!controlsRef.current
		) {
			return;
		}

		const G = 0.1; // Gravity constant (scaled)

		const animate = () => {
			// Update controls
			controlsRef.current?.update();

			// Only update positions if not paused
			if (!isPaused) {
				// Calculate time step
				const timeStep = 0.001 * timeScaleRef.current;
				simulationTimeRef.current += timeStep;

				// Update each planet
				planetsRef.current.forEach((planet) => {
					const planetMesh = planet.mesh;
					const planetData = planet.data;

					// Calculate semi-major and semi-minor axes
					const a = planetData.distance * distanceScale;
					const e = planetData.orbitalEccentricity;
					const b = a * Math.sqrt(1 - e * e);

					// Calculate orbital period (Kepler's third law)
					// T^2 ∝ a^3
					// We scale this to make the animation reasonable
					const periodFactor = 0.1;
					const period = periodFactor * Math.sqrt((a * a * a) / G);

					// Calculate angle based on time
					// Use mean anomaly (M) for approximate motion
					const meanAnomaly =
						(simulationTimeRef.current / period) * Math.PI * 2;

					// Solve Kepler's equation to get eccentric anomaly (E)
					// M = E - e * sin(E)
					// This is using a simple iterative approach
					let E = meanAnomaly;
					for (let i = 0; i < 5; i++) {
						E = meanAnomaly + e * Math.sin(E);
					}

					// Convert eccentric anomaly to true anomaly (𝜈)
					const trueAnomaly =
						2 *
						Math.atan2(
							Math.sqrt(1 + e) * Math.sin(E / 2),
							Math.sqrt(1 - e) * Math.cos(E / 2)
						);

					// Calculate position in orbital plane
					const r = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));
					const x = r * Math.cos(trueAnomaly);
					const z = r * Math.sin(trueAnomaly);

					// Position planet and shift to account for sun at focus
					const c = a * e; // Focus distance
					planetMesh.position.set(x - c, 0, z);

					// Calculate instantaneous velocity
					// v = sqrt(G * M * (2/r - 1/a))
					const sunMass = 1; // We use relative units
					const r_mag = Math.sqrt(x * x + z * z);
					const v_mag = Math.sqrt(G * sunMass * (2 / r_mag - 1 / a));

					// Velocity direction (perpendicular to radius vector)
					const vx = (-v_mag * z) / r_mag;
					const vz = (v_mag * x) / r_mag;

					// Update velocity arrow
					planet.vectorArrow.position.copy(planetMesh.position);
					const dir = new THREE.Vector3(vx, 0, vz).normalize();
					planet.vectorArrow.setDirection(dir);
					planet.vectorArrow.setLength(
						planetData.radius * sizeScale * 5,
						planetData.radius * sizeScale,
						planetData.radius * sizeScale * 0.5
					);

					// Update trail
					if (showTrails) {
						const maxTrailPoints = 200;
						const currentPos = planetMesh.position.clone();

						if (simulationTimeRef.current % 0.01 < timeStep) {
							planet.trailPositions.push(currentPos);
							if (planet.trailPositions.length > maxTrailPoints) {
								planet.trailPositions.shift();
							}

							// Update trail geometry
							planet.trail.geometry.dispose();
							planet.trail.geometry = new THREE.BufferGeometry().setFromPoints(
								planet.trailPositions
							);
						}
					}
				});
			}

			// Render scene
			rendererRef.current?.render(sceneRef.current!, cameraRef.current!);

			// Request next frame
			animationFrameRef.current = requestAnimationFrame(animate);
		};

		// Start animation loop
		animate();

		// Cleanup animation on unmount
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isPaused, showTrails]);

	// Handle planet selection
	const handlePlanetSelect = (planet: PlanetData | null) => {
		setSelectedPlanet(planet);

		if (planet && controlsRef.current && cameraRef.current) {
			// Find the selected planet object
			const planetObj = planetsRef.current.find(
				(p) => p.data.name === planet.name
			);

			if (planetObj) {
				// Animate camera to look at the planet
				const distance = planet.radius * 10 + 5;
				const position = planetObj.mesh.position.clone();

				// Set target to planet position
				controlsRef.current.target.copy(position);

				// Set camera position to look at planet from a distance
				const offset = new THREE.Vector3(distance, distance, distance);
				cameraRef.current.position.copy(position.clone().add(offset));
			}
		} else if (controlsRef.current) {
			// Reset to look at sun
			controlsRef.current.target.set(0, 0, 0);
		}
	};

	// Reset camera
	const resetCamera = () => {
		if (controlsRef.current && cameraRef.current) {
			controlsRef.current.target.set(0, 0, 0);
			cameraRef.current.position.set(0, 40, 40);
			controlsRef.current.update();
		}
	};

	return (
		<div className="flex flex-col w-full h-screen">
			{/* Top Controls */}
			<div className="flex flex-wrap justify-between items-center p-3 bg-gray-900 text-white">
				<h1 className="text-xl font-bold">Solar System Simulator</h1>

				<div className="flex flex-wrap gap-3">
					<button
						onClick={() => setIsPaused(!isPaused)}
						className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
					>
						{isPaused ? "Play" : "Pause"}
					</button>

					<button
						onClick={resetCamera}
						className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
					>
						Reset View
					</button>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex flex-col md:flex-row flex-1 overflow-hidden">
				{/* Left Controls Panel */}
				<div className="w-full md:w-64 bg-gray-800 text-white p-4 overflow-y-auto">
					<h2 className="text-lg font-semibold mb-3">Simulation Controls</h2>

					<div className="mb-4">
						<label className="block mb-2">
							Time Scale: {timeScale.toFixed(1)}x
							<input
								type="range"
								min="0.1"
								max="50"
								step="0.1"
								value={timeScale}
								onChange={(e) => setTimeScale(parseFloat(e.target.value))}
								className="w-full"
							/>
						</label>
					</div>

					<div className="mb-4 space-y-2">
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={showOrbits}
								onChange={(e) => setShowOrbits(e.target.checked)}
								className="mr-2"
							/>
							Show Orbital Paths
						</label>

						<label className="flex items-center">
							<input
								type="checkbox"
								checked={showVectors}
								onChange={(e) => setShowVectors(e.target.checked)}
								className="mr-2"
							/>
							Show Velocity Vectors
						</label>

						<label className="flex items-center">
							<input
								type="checkbox"
								checked={showTrails}
								onChange={(e) => setShowTrails(e.target.checked)}
								className="mr-2"
							/>
							Show Orbital Trails
						</label>
					</div>

					<div className="mb-4">
						<h3 className="text-md font-medium mb-2">Planets</h3>
						<div className="space-y-1">
							<button
								onClick={() => handlePlanetSelect(null)}
								className={`w-full text-left px-2 py-1 rounded ${
									selectedPlanet === null ? "bg-blue-700" : "hover:bg-gray-700"
								}`}
							>
								Overview (All Planets)
							</button>

							{planetaryData.map((planet) => (
								<button
									key={planet.name}
									onClick={() => handlePlanetSelect(planet)}
									className={`w-full text-left px-2 py-1 rounded flex items-center ${
										selectedPlanet?.name === planet.name
											? "bg-blue-700"
											: "hover:bg-gray-700"
									}`}
								>
									<span
										className="inline-block w-3 h-3 rounded-full mr-2"
										style={{ backgroundColor: planet.color }}
									></span>
									{planet.name}
								</button>
							))}
						</div>
					</div>

					{/* Planet Info Panel */}
					{selectedPlanet && (
						<div className="p-3 bg-gray-900 rounded">
							<h3 className="text-lg font-semibold mb-2">
								{selectedPlanet.name}
							</h3>
							<div className="space-y-1 text-sm">
								<p>
									<span className="font-medium">Distance from Sun:</span>{" "}
									{selectedPlanet.distance.toFixed(2)} AU
								</p>
								<p>
									<span className="font-medium">Orbital Period:</span>{" "}
									{selectedPlanet.orbitalPeriod.toLocaleString()} days
								</p>
								<p>
									<span className="font-medium">Eccentricity:</span>{" "}
									{selectedPlanet.orbitalEccentricity.toFixed(3)}
								</p>
								<p>
									<span className="font-medium">Radius:</span>{" "}
									{selectedPlanet.radius.toFixed(2)} Earth radii
								</p>
								<p>
									<span className="font-medium">Axial Tilt:</span>{" "}
									{selectedPlanet.obliquity.toFixed(2)}°
								</p>
								<p>
									<span className="font-medium">Mass:</span>{" "}
									{selectedPlanet.mass}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* 3D Canvas */}
				<div className="flex-1 bg-black relative">
					<div
						ref={mountRef}
						className="w-full h-full"
						style={{ touchAction: "none" }}
					></div>

					{/* Controls instructions overlay */}
					<div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-60 p-3 rounded text-sm">
						<p>Mouse Controls:</p>
						<p>• Left-click + drag: Rotate view</p>
						<p>• Right-click + drag: Pan camera</p>
						<p>• Scroll: Zoom in/out</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SolarSystemSimulator;
