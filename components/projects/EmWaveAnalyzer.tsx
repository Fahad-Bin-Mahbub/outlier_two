"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine,
} from "recharts";

// Define types
interface ElectricFieldPoint {
	x: number;
	E: number;
}

interface MagneticFieldPoint {
	x: number;
	B: number;
}

interface NormalizedElectricPoint extends ElectricFieldPoint {
	E_normalized: number;
}

interface NormalizedMagneticPoint extends MagneticFieldPoint {
	B_normalized: number;
}

interface NormalizedData {
	normalizedElectric: NormalizedElectricPoint[];
	normalizedMagnetic: NormalizedMagneticPoint[];
	electricMax: number;
	magneticMax: number;
}

interface FieldMetrics {
	max: number;
	min: number;
	avg: number;
	phase: string;
}

interface WaveConfig {
	name: string;
	amplitude: number;
	frequency: number;
	distance: number;
	time: number;
}

// Function to calculate electric field
const calculateElectricField = (amplitude, frequency, distance, time) => {
	const data = [];
	const omega = 2 * Math.PI * frequency;
	const k = omega / 3e8; // Wave number (assuming speed of light)

	for (let x = 0; x <= distance; x += distance / 100) {
		const E = amplitude * Math.sin(k * x - omega * time);
		data.push({ x, E });
	}

	return data;
};

// Function to calculate magnetic field
const calculateMagneticField = (amplitude, frequency, distance, time) => {
	const data = [];
	const omega = 2 * Math.PI * frequency;
	const k = omega / 3e8; // Wave number

	// B = E/c in SI units for EM waves
	const magneticAmplitude = amplitude / 3e8;

	for (let x = 0; x <= distance; x += distance / 100) {
		const B = magneticAmplitude * Math.sin(k * x - omega * time + Math.PI / 2); // π/2 phase shift B and E are perpendicular to each other
		data.push({ x, B });
	}

	return data;
};

// Function to calculate metrics
const calculateMetrics = (data, fieldName) => {
	const values = data.map((point) => point[fieldName]);
	const max = Math.max(...values);
	const min = Math.min(...values);
	const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

	// Find the phase by looking at the first zero crossing, an EM phenomenon
	let phase = 0;
	for (let i = 0; i < data.length - 1; i++) {
		if (data[i][fieldName] <= 0 && data[i + 1][fieldName] > 0) {
			phase = (data[i].x / data[data.length - 1].x) * 2 * Math.PI;
			break;
		}
	}

	return { max, min, avg, phase: phase.toFixed(2) };
};

// Normalize data function to ensure consistent visualization
const normalizeData = (electricData, magneticData) => {
	// Find the absolute maximum value across both datasets for normalization
	const electricValues = electricData.map((point) => Math.abs(point.E));
	const magneticValues = magneticData.map((point) => Math.abs(point.B));

	const electricMax = Math.max(...electricValues);
	const magneticMax = Math.max(...magneticValues);

	// Create normalized copies of the data, very important for visualization
	// to ensure that the graphs are comparable
	const normalizedElectric = electricData.map((point) => ({
		x: point.x,
		E: point.E,
		E_normalized: point.E / electricMax,
	}));

	const normalizedMagnetic = magneticData.map((point) => ({
		x: point.x,
		B: point.B,
		B_normalized: point.B / magneticMax,
	}));

	return {
		normalizedElectric,
		normalizedMagnetic,
		electricMax,
		magneticMax,
	};
};

// Properly formatting the X-axis labels
// to show two decimal places
const formatXAxis = (value) => {
	return value.toFixed(2);
};

// Tooltip component for explaining physics concepts
const PhysicsTooltip = ({ title, children }) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className="relative inline-block group">
			<span
				className="text-blue-600 ml-1 cursor-help border-b border-dashed border-blue-400"
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				onClick={() => setIsVisible(!isVisible)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4 inline-block"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</span>
			{isVisible && (
				<div className="absolute z-10 w-64 p-3 bg-white text-gray-800 text-sm rounded-lg shadow-xl border border-gray-200 transform -translate-x-1/2 left-1/2 mt-2">
					<h3 className="font-semibold mb-1 text-blue-700">{title}</h3>
					<div className="text-xs">{children}</div>
					<div className="absolute w-3 h-3 bg-white rotate-45 -mt-5 left-1/2 -ml-1.5 border-t border-l border-gray-200"></div>
				</div>
			)}
		</div>
	);
};

// Custom slider component
const RangeSlider = ({
	name,
	value,
	min,
	max,
	step,
	onChange,
	formatter,
	label,
}) => {
	return (
		<div className="relative w-full">
			<label className="flex justify-between mb-1 text-sm font-medium">
				<span>{label}</span>
				<span className="text-blue-700">
					{formatter ? formatter(value) : value}
				</span>
			</label>
			<input
				type="range"
				name={name}
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={onChange}
				className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
			/>
		</div>
	);
};

export default function EmWaveAnalyzerExport() {
	const [params, setParams] = useState({
		amplitude: 1.0,
		frequency: 2.45e9, // 2.45 GHz (common microwave frequency, even for 4G networks)
		distance: 0.5, // 0.5 meters
		time: 0, // Initial time
	});

	const [electricFieldData, setElectricFieldData] = useState([]);
	const [magneticFieldData, setMagneticFieldData] = useState([]);
	const [normalizedData, setNormalizedData] = useState({
		normalizedElectric: [],
		normalizedMagnetic: [],
		electricMax: 1,
		magneticMax: 1,
	});

	// Metrics for electric and magnetic fields, states are used to store the calculated metrics
	const [electricMetrics, setElectricMetrics] = useState({
		max: 0,
		min: 0,
		avg: 0,
		phase: 0,
	});
	const [magneticMetrics, setMagneticMetrics] = useState({
		max: 0,
		min: 0,
		avg: 0,
		phase: 0,
	});

	// Animation frame reference
	const animationRef = useRef(null);

	// Loading state
	const [isCalculating, setIsCalculating] = useState(false);

	// Saved configurations
	const [savedConfigs, setSavedConfigs] = useState([]);

	// Animation state
	const [isAnimating, setIsAnimating] = useState(false);

	// Combined view state
	const [showCombinedView, setShowCombinedView] = useState(false);

	// Mobile menu state
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Control the calculate button
	// to trigger calculations when parameters change
	const [shouldCalculate, setShouldCalculate] = useState(true);

	// Update calculations when parameters change or when shouldCalculate is true
	// mdata: magenetic data, eData: electric data
	useEffect(() => {
		if (shouldCalculate) {
			setIsCalculating(true);

			// Simulate calculation time for better UX
			setTimeout(() => {
				const eData = calculateElectricField(
					params.amplitude,
					params.frequency,
					params.distance,
					params.time
				);

				const mData = calculateMagneticField(
					params.amplitude,
					params.frequency,
					params.distance,
					params.time
				);

				// Store the raw data
				setElectricFieldData(eData);
				setMagneticFieldData(mData);

				// Generate normalized data for visualization
				const normalized = normalizeData(eData, mData);
				setNormalizedData(normalized);

				// Calculate metrics
				setElectricMetrics(calculateMetrics(eData, "E"));
				setMagneticMetrics(calculateMetrics(mData, "B"));

				// Reset the flag
				setShouldCalculate(false);
				setIsCalculating(false);
			}, 300);
		}
	}, [params, shouldCalculate]);

	// Handle animating the wave over time
	useEffect(() => {
		if (isAnimating) {
			animationRef.current = requestAnimationFrame(animateWave);
		} else if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [isAnimating, params]);

	const animateWave = () => {
		setParams((prev) => ({
			...prev,
			time: prev.time + 0.05e-9,
		}));
		setShouldCalculate(true);
		animationRef.current = requestAnimationFrame(animateWave);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setParams((prev) => ({
			...prev,
			[name]: parseFloat(value),
		}));
	};

	const handleCalculate = () => {
		// Set the shouldCalculate flag to true to trigger calculations
		setShouldCalculate(true);
	};

	const handleReset = () => {
		setParams({
			amplitude: 1.0,
			frequency: 2.45e9,
			distance: 0.5,
			time: 0,
		});
		setShouldCalculate(true);
		setIsAnimating(false);
	};

	const handleSaveConfig = () => {
		const configName = prompt(
			"Enter a name for this configuration",
			`Config ${savedConfigs.length + 1}`
		);
		if (configName) {
			setSavedConfigs([
				...savedConfigs,
				{
					name: configName,
					...params,
				},
			]);
		}
	};

	const loadConfig = (config) => {
		setParams(config);
		setShouldCalculate(true);
	};

	const toggleAnimation = () => {
		setIsAnimating(!isAnimating);
	};

	// Function to format frequency for display
	const formatFrequency = (freq) => {
		if (freq >= 1e9) return `${(freq / 1e9).toFixed(2)} GHz`;
		if (freq >= 1e6) return `${(freq / 1e6).toFixed(2)} MHz`;
		if (freq >= 1e3) return `${(freq / 1e3).toFixed(2)} kHz`;
		return `${freq.toFixed(2)} Hz`;
	};

	// Function to format wavelength
	const calculateWavelength = () => {
		return (3e8 / params.frequency).toFixed(4);
	};

	// Function to format time
	const formatTime = (time) => {
		if (time < 1e-9) return `${(time * 1e12).toFixed(2)} ps`;
		if (time < 1e-6) return `${(time * 1e9).toFixed(2)} ns`;
		if (time < 1e-3) return `${(time * 1e6).toFixed(2)} μs`;
		if (time < 1) return `${(time * 1e3).toFixed(2)} ms`;
		return `${time.toFixed(2)} s`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
			{/* Custom styles and fonts */}
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap");

				body {
					font-family: "Poppins", sans-serif;
				}

				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					font-family: "Poppins", sans-serif;
				}

				.custom-slider::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					width: 18px;
					height: 18px;
					border-radius: 50%;
					background: #3b82f6;
					cursor: pointer;
					transition: all 0.2s ease;
				}

				.custom-slider::-webkit-slider-thumb:hover {
					background: #2563eb;
					transform: scale(1.1);
				}

				.animate-pulse-slow {
					animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
				}

				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.8;
					}
				}

				.button-transition {
					transition: all 0.2s ease;
				}

				.button-transition:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
				}

				.button-transition:active {
					transform: translateY(0);
				}
			`}</style>

			{/* Header/Navbar */}
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center">
							<div className="text-blue-600 mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
										fill="#3B82F6"
										fillOpacity="0.2"
										stroke="#3B82F6"
										strokeWidth="2"
									/>
									<path
										d="M12 6V18"
										stroke="#3B82F6"
										strokeWidth="2"
										strokeLinecap="round"
									/>
									<path
										d="M6 12H18"
										stroke="#3B82F6"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</div>
							<div>
								<h1 className="text-xl font-bold text-gray-800">WaveViz Pro</h1>
								<p className="text-xs text-gray-500">
									Electromagnetic Wave Analyzer
								</p>
							</div>
						</div>

						<div className="hidden md:flex space-x-6">
							<a
								href="#"
								className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
							>
								Home
							</a>
							<a
								href="#"
								className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
							>
								Features
							</a>
							<a
								href="#"
								className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
							>
								Documentation
							</a>
							<a
								href="#"
								className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
							>
								About
							</a>
						</div>

						<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow hidden md:block cursor-pointer">
							Pro Features
						</button>

						{/* Mobile menu button */}
						<button
							className="md:hidden text-gray-700"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>

					{/* Mobile menu */}
					{isMobileMenuOpen && (
						<div className="md:hidden py-3 pb-4 border-t border-gray-200">
							<a
								href="#"
								className="block py-2 text-gray-700 hover:text-blue-600"
							>
								Home
							</a>
							<a
								href="#"
								className="block py-2 text-gray-700 hover:text-blue-600"
							>
								Features
							</a>
							<a
								href="#"
								className="block py-2 text-gray-700 hover:text-blue-600"
							>
								Documentation
							</a>
							<a
								href="#"
								className="block py-2 text-gray-700 hover:text-blue-600"
							>
								About
							</a>
							<button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow cursor-pointer">
								Pro Features
							</button>
						</div>
					)}
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Introduction section */}
				<section className="mb-10">
					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
						<div className="p-6 sm:p-8">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
								Electromagnetic Wave Simulator
							</h2>
							<p className="text-gray-600 mb-6">
								Interactively visualize and analyze electromagnetic waves based
								on Maxwell's equations. Adjust the parameters to see real-time
								changes in electric and magnetic fields.
							</p>

							<div className="flex flex-wrap gap-4">
								<div className="flex items-center text-sm text-blue-700">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-1"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
									Real-time visualization
								</div>
								<div className="flex items-center text-sm text-blue-700">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-1"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
									Scientific accuracy
								</div>
								<div className="flex items-center text-sm text-blue-700">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-1"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
									Interactive controls
								</div>
								<div className="flex items-center text-sm text-blue-700">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-1"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
									Save configurations
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 border-t border-gray-100">
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								Quick Start Guide
							</h3>
							<ol className="list-decimal list-inside text-gray-600 space-y-2">
								<li>
									Adjust amplitude, frequency, distance, and time using the
									controls below
								</li>
								<li>Click "Calculate" to update the visualization</li>
								<li>
									Toggle animation to see how the wave propagates over time
								</li>
								<li>Compare electric and magnetic field behaviors</li>
								<li>Save your configurations for future reference</li>
							</ol>
						</div>
					</div>
				</section>

				{/* Equation and Parameter Section */}
				<section className="mb-10">
					<div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-xl overflow-hidden">
						<div className="p-6 md:p-8">
							<h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
								Maxwell's Equations
								<PhysicsTooltip title="Maxwell's Equations Explained">
									Maxwell's equations are a set of four partial differential
									equations that form the foundation of classical
									electromagnetism. They describe how electric and magnetic
									fields are generated and interact with each other, as well as
									how they relate to charge and current.
								</PhysicsTooltip>
							</h2>

							<div className="mb-6 p-4 bg-white text-black rounded-lg">
								{/* Complete Maxwell Equations with relative equations*/}
								<div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
										<p className="text-center font-mono mb-2">
											∇ · <strong className="text-blue-600">E</strong> = ρ/ε₀
										</p>
										<p className="text-center text-xs text-gray-600">
											Gauss's Law (Electric field)
											<PhysicsTooltip title="Gauss's Law">
												This equation relates the electric field to the
												distribution of electric charge. It states that the
												electric flux through any closed surface is proportional
												to the total charge enclosed.
											</PhysicsTooltip>
										</p>
									</div>
									<div className="pt-4 md:pt-0 md:pl-4">
										<p className="text-center font-mono mb-2">
											∇ · <strong className="text-purple-600">B</strong> = 0
										</p>
										<p className="text-center text-xs text-gray-600">
											Gauss's Law (Magnetic field)
											<PhysicsTooltip title="Gauss's Law for Magnetism">
												This law states that magnetic monopoles don't exist. The
												magnetic field lines always form closed loops without
												beginning or end points.
											</PhysicsTooltip>
										</p>
									</div>
								</div>
								<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
										<p className="text-center font-mono mb-2">
											∇ × <strong className="text-blue-600">E</strong> = -∂
											<strong className="text-purple-600">B</strong>/∂t
										</p>
										<p className="text-center text-xs text-gray-600">
											Faraday's Law of Induction
											<PhysicsTooltip title="Faraday's Law">
												This law describes how a changing magnetic field creates
												(induces) an electric field. This is the principle
												behind electric generators.
											</PhysicsTooltip>
										</p>
									</div>
									<div className="pt-4 md:pt-0 md:pl-4">
										<p className="text-center font-mono mb-2">
											∇ × <strong className="text-purple-600">B</strong> = μ₀
											<strong>J</strong> + μ₀ε₀∂
											<strong className="text-blue-600">E</strong>/∂t
										</p>
										<p className="text-center text-xs text-gray-600">
											Ampère's Law with Maxwell's addition
											<PhysicsTooltip title="Ampère's Law with Maxwell's Addition">
												This equation shows how electric currents and changing
												electric fields generate magnetic fields. Maxwell's
												addition of the displacement current term completed the
												set of equations.
											</PhysicsTooltip>
										</p>
									</div>
								</div>
								<div className="mt-6 pt-4 border-t border-gray-200">
									<p className="text-center font-mono mb-2">
										For EM Waves in vacuum:
										<PhysicsTooltip title="Electromagnetic Waves">
											Electromagnetic waves are self-propagating waves of
											oscillating electric and magnetic fields that travel
											through space at the speed of light. Examples include
											radio waves, microwaves, visible light, and X-rays.
										</PhysicsTooltip>
									</p>
									<p className="mb-3 text-center font-mono">
										<strong className="text-blue-600">E</strong>(x,t) = E
										<sub>0</sub> sin(kx - ωt)
									</p>
									<p className="mb-3 text-center font-mono">
										<strong className="text-purple-600">B</strong>(x,t) = B
										<sub>0</sub> sin(kx - ωt + π/2)
									</p>
									<p className="mt-2 text-center text-sm text-gray-600">
										where: ω = 2πf, k = ω/c, and B<sub>0</sub> = E<sub>0</sub>/c
									</p>
								</div>
							</div>

							<h2 className="text-xl font-bold mb-4">Wave Parameters</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
								<div className="space-y-4">
									<div>
										<label className="block mb-2 font-medium">
											Amplitude (V/m)
										</label>
										<div className="flex items-center">
											<input
												type="number"
												name="amplitude"
												value={params.amplitude}
												onChange={handleInputChange}
												className="w-full p-2 rounded-l-md text-black border border-blue-300 focus:ring focus:ring-blue-200 focus:border-blue-500 transition"
											/>
											<span className="bg-blue-800 text-white p-2 rounded-r-md">
												V/m
											</span>
										</div>
										<RangeSlider
											name="amplitude"
											value={params.amplitude}
											min={0.1}
											max={10}
											step={0.1}
											onChange={handleInputChange}
											label=""
										/>
									</div>

									<div>
										<label className="block mb-2 font-medium">
											Frequency (Hz)
										</label>
										<div className="flex items-center">
											<input
												type="number"
												name="frequency"
												value={params.frequency}
												onChange={handleInputChange}
												className="w-full p-2 rounded-l-md text-black border border-blue-300 focus:ring focus:ring-blue-200 focus:border-blue-500 transition"
											/>
											<span className="bg-blue-800 text-white p-2 rounded-r-md">
												Hz
											</span>
										</div>
										<div className="flex justify-between items-center">
											<RangeSlider
												name="frequency"
												value={params.frequency}
												min={1e6}
												max={1e10}
												step={1e6}
												onChange={handleInputChange}
												formatter={formatFrequency}
												label=""
											/>
											<span className="text-xs mt-1 block opacity-90 ml-2 bg-blue-900 px-2 py-1 rounded">
												{formatFrequency(params.frequency)}
											</span>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<label className="block mb-2 font-medium">
											Distance (m)
										</label>
										<div className="flex items-center">
											<input
												type="number"
												name="distance"
												value={params.distance}
												onChange={handleInputChange}
												className="w-full p-2 rounded-l-md text-black border border-blue-300 focus:ring focus:ring-blue-200 focus:border-blue-500 transition"
											/>
											<span className="bg-blue-800 text-white p-2 rounded-r-md">
												m
											</span>
										</div>
										<RangeSlider
											name="distance"
											value={params.distance}
											min={0.1}
											max={2}
											step={0.1}
											onChange={handleInputChange}
											label=""
										/>
									</div>

									<div>
										<label className="block mb-2 font-medium">Time (s)</label>
										<div className="flex items-center">
											<input
												type="number"
												name="time"
												value={params.time}
												onChange={handleInputChange}
												step="0.00000001"
												className="w-full p-2 rounded-l-md text-black border border-blue-300 focus:ring focus:ring-blue-200 focus:border-blue-500 transition"
											/>
											<span className="bg-blue-800 text-white p-2 rounded-r-md">
												s
											</span>
										</div>
										<div className="flex justify-between items-center">
											<RangeSlider
												name="time"
												value={params.time}
												min={0}
												max={1e-8}
												step={1e-10}
												onChange={handleInputChange}
												formatter={formatTime}
												label=""
											/>
											<span className="text-xs mt-1 block opacity-90 ml-2 bg-blue-900 px-2 py-1 rounded">
												{formatTime(params.time)}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
								<button
									onClick={handleCalculate}
									disabled={isCalculating}
									className="bg-white text-blue-700 px-4 py-3 rounded-md font-bold hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-md flex items-center justify-center cursor-pointer button-transition disabled:opacity-70"
								>
									{isCalculating ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700"
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
											Calculating...
										</>
									) : (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 mr-1"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clipRule="evenodd"
												/>
											</svg>
											Calculate
										</>
									)}
								</button>

								<button
									onClick={handleReset}
									className="bg-white text-gray-700 px-4 py-3 rounded-md font-bold hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-md flex items-center justify-center cursor-pointer button-transition"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-1"
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
								</button>

								<button
									onClick={toggleAnimation}
									className={`${
										isAnimating
											? "bg-red-600 hover:bg-red-700 text-white"
											: "bg-white text-blue-700 hover:bg-blue-50"
									} px-4 py-3 rounded-md font-bold active:bg-blue-100 transition-colors shadow-md flex items-center justify-center cursor-pointer button-transition`}
								>
									{isAnimating ? (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 mr-1"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											Stop Animation
										</>
									) : (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 mr-1"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
													clipRule="evenodd"
												/>
											</svg>
											Animate Wave
										</>
									)}
								</button>

								<button
									onClick={handleSaveConfig}
									className="bg-white text-blue-700 px-4 py-3 rounded-md font-bold hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-md flex items-center justify-center cursor-pointer button-transition"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-1"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
									</svg>
									Save Config
								</button>
							</div>
						</div>

						{/* Saved configurations */}
						{savedConfigs.length > 0 && (
							<div className="bg-indigo-900/20 backdrop-blur-sm p-4 border-t border-indigo-500/30">
								<h3 className="text-lg font-semibold mb-2">
									Saved Configurations
								</h3>
								<div className="flex flex-wrap gap-2">
									{savedConfigs.map((config, index) => (
										<button
											key={index}
											onClick={() => loadConfig(config)}
											className="bg-white/90 text-indigo-900 text-sm px-3 py-1 rounded shadow hover:bg-white transition-colors cursor-pointer"
										>
											{config.name}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</section>

				{/* Field Visualizations */}
				<section className="mb-10">
					<div className="flex flex-wrap justify-between items-center mb-4">
						<h2 className="text-2xl font-bold text-gray-800">
							Field Visualizations
						</h2>
						<div className="flex items-center">
							<label className="mr-2 font-medium text-gray-700 text-sm">
								Combined View
							</label>
							<button
								onClick={() => setShowCombinedView(!showCombinedView)}
								className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
									showCombinedView ? "bg-blue-600" : "bg-gray-300"
								} cursor-pointer`}
							>
								<span
									className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
										showCombinedView ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Wave Properties Card */}
						<div className="bg-white rounded-xl shadow-lg overflow-hidden">
							<div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-3">
									Wave Properties
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="bg-white rounded-lg p-4 shadow">
										<h4 className="font-medium text-blue-600 mb-2">
											General Properties
										</h4>
										<ul className="space-y-2">
											<li className="flex justify-between">
												<span className="text-gray-600">Wavelength:</span>
												<span className="font-medium">
													{calculateWavelength()} m
												</span>
											</li>
											<li className="flex justify-between">
												<span className="text-gray-600">Wave Speed:</span>
												<span className="font-medium">3.00 × 10⁸ m/s</span>
											</li>
											<li className="flex justify-between">
												<span className="text-gray-600">Period:</span>
												<span className="font-medium">
													{(1 / params.frequency).toExponential(3)} s
												</span>
											</li>
										</ul>
									</div>

									<div className="bg-white rounded-lg p-4 shadow">
										<h4 className="font-medium text-purple-600 mb-2">
											Field Relationships
										</h4>
										<ul className="space-y-2">
											<li className="flex justify-between">
												<span className="text-gray-600">E/B Ratio:</span>
												<span className="font-medium">
													{(
														electricMetrics.max / Math.abs(magneticMetrics.max)
													).toExponential(2)}{" "}
													m/s
												</span>
											</li>
											<li className="flex justify-between">
												<span className="text-gray-600">Phase Difference:</span>
												<span className="font-medium">π/2 rad</span>
											</li>
											<li className="flex justify-between">
												<span className="text-gray-600">Energy Density:</span>
												<span className="font-medium">
													{(
														0.5 *
														8.85e-12 *
														Math.pow(electricMetrics.max, 2)
													).toExponential(3)}{" "}
													J/m³
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						{/* Applications Card */}
						<div className="bg-white rounded-xl shadow-lg overflow-hidden">
							<div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-3">
									Applications
								</h3>
								<div className="space-y-3">
									<div className="flex items-start">
										<div className="bg-blue-100 text-blue-700 p-2 rounded mr-3 flex-shrink-0">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
											</svg>
										</div>
										<div>
											<h4 className="font-medium text-gray-800">
												Frequency Analysis
											</h4>
											<p className="text-sm text-gray-600">
												Current frequency ({formatFrequency(params.frequency)})
												is in the{" "}
												{params.frequency >= 1e9
													? "microwave"
													: params.frequency >= 1e6
													? "radio wave"
													: "low frequency"}{" "}
												range.
											</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="bg-purple-100 text-purple-700 p-2 rounded mr-3 flex-shrink-0">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
										<div>
											<h4 className="font-medium text-gray-800">
												Practical Use Cases
											</h4>
											<p className="text-sm text-gray-600">
												{params.frequency >= 2.4e9 && params.frequency <= 2.5e9
													? "Wi-Fi and microwave ovens operate around this frequency (2.4 GHz)"
													: params.frequency >= 1e9 && params.frequency <= 3e9
													? "This range includes cellular networks (1-3 GHz)"
													: params.frequency >= 3e8 && params.frequency <= 3e9
													? "This range includes UHF TV broadcasts"
													: "Adjust frequency to see practical applications in that range"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Charts Section */}
				<section className="grid grid-cols-1 gap-8">
					{showCombinedView ? (
						// Combined view
						<div className="bg-white rounded-xl shadow-xl overflow-hidden">
							<div className="p-6">
								<h2 className="text-xl font-bold mb-4 text-gray-800">
									Combined Field Visualization
								</h2>
								<div className="h-96 bg-gray-50 rounded-lg p-4">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart
											margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
										>
											<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
											<XAxis
												dataKey="x"
												type="number"
												domain={[0, params.distance]}
												tickFormatter={formatXAxis}
												label={{
													value: "Distance (m)",
													position: "bottom",
													offset: 0,
													fill: "#333",
												}}
											/>
											<YAxis
												yAxisId="left"
												domain={[-1, 1]}
												label={{
													value: "Normalized Electric Field",
													angle: -90,
													position: "insideLeft",
													fill: "#00BCD4",
												}}
												tick={{ fill: "#00BCD4" }}
											/>
											<YAxis
												yAxisId="right"
												orientation="right"
												domain={[-1, 1]}
												label={{
													value: "Normalized Magnetic Field",
													angle: 90,
													position: "insideRight",
													fill: "#9C27B0",
												}}
												tick={{ fill: "#9C27B0" }}
											/>
											<Tooltip
												formatter={(value, name) => {
													if (name === "Electric Field") {
														const actualValue =
															value * normalizedData.electricMax;
														return [`${actualValue.toFixed(4)} V/m`, name];
													} else if (name === "Magnetic Field") {
														const actualValue =
															value * normalizedData.magneticMax;
														return [`${actualValue.toExponential(3)} T`, name];
													}
													return [value, name];
												}}
												labelFormatter={(x) => `Distance: ${x.toFixed(3)} m`}
												contentStyle={{
													borderRadius: "6px",
													border: "1px solid #ddd",
													backgroundColor: "rgba(255, 255, 255, 0.9)",
												}}
											/>
											<Legend />
											<ReferenceLine
												y={0}
												stroke="#666"
												strokeDasharray="3 3"
											/>
											<Line
												yAxisId="left"
												type="monotone"
												data={normalizedData.normalizedElectric}
												dataKey="E_normalized"
												stroke="#00BCD4"
												strokeWidth={3}
												dot={false}
												name="Electric Field"
												animationDuration={300}
											/>
											<Line
												yAxisId="right"
												type="monotone"
												data={normalizedData.normalizedMagnetic}
												dataKey="B_normalized"
												stroke="#9C27B0"
												strokeWidth={3}
												dot={false}
												name="Magnetic Field"
												animationDuration={300}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div className="bg-gray-50 p-6 border-t border-gray-100">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div className="bg-blue-50 p-4 rounded-lg shadow">
										<h3 className="font-bold mb-2 text-blue-700">
											Electric Field Analysis
										</h3>
										<ul className="space-y-1 text-gray-700">
											<li className="flex justify-between">
												<span>Maximum:</span>
												<span className="font-medium">
													{electricMetrics.max.toFixed(4)} V/m
												</span>
											</li>
											<li className="flex justify-between">
												<span>Minimum:</span>
												<span className="font-medium">
													{electricMetrics.min.toFixed(4)} V/m
												</span>
											</li>
											<li className="flex justify-between">
												<span>Average:</span>
												<span className="font-medium">
													{electricMetrics.avg.toFixed(4)} V/m
												</span>
											</li>
											<li className="flex justify-between">
												<span>Phase:</span>
												<span className="font-medium">
													{electricMetrics.phase} rad
												</span>
											</li>
										</ul>
									</div>

									<div className="bg-purple-50 p-4 rounded-lg shadow">
										<h3 className="font-bold mb-2 text-purple-700">
											Magnetic Field Analysis
										</h3>
										<ul className="space-y-1 text-gray-700">
											<li className="flex justify-between">
												<span>Maximum:</span>
												<span className="font-medium">
													{magneticMetrics.max.toExponential(3)} T
												</span>
											</li>
											<li className="flex justify-between">
												<span>Minimum:</span>
												<span className="font-medium">
													{magneticMetrics.min.toExponential(3)} T
												</span>
											</li>
											<li className="flex justify-between">
												<span>Average:</span>
												<span className="font-medium">
													{magneticMetrics.avg.toExponential(3)} T
												</span>
											</li>
											<li className="flex justify-between">
												<span>Phase:</span>
												<span className="font-medium">
													{magneticMetrics.phase} rad
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					) : (
						// Separate views
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Electric Field Section */}
							<div className="bg-white rounded-xl shadow-xl overflow-hidden">
								<div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6">
									<h2 className="text-xl font-bold mb-4 flex items-center">
										Electric Field
										<PhysicsTooltip title="Electric Field">
											The electric field is a vector field that shows the
											direction and magnitude of the electric force experienced
											by a charged particle. In an electromagnetic wave, the
											electric field oscillates perpendicular to the direction
											of wave propagation.
										</PhysicsTooltip>
									</h2>
									<div className="h-64 bg-white rounded-lg p-2">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={normalizedData.normalizedElectric}
												margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
											>
												<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
												<XAxis
													dataKey="x"
													tickFormatter={formatXAxis}
													label={{
														value: "Distance (m)",
														position: "bottom",
														fill: "#333",
														fontSize: 12,
														dy: 10,
													}}
													domain={[0, params.distance]}
													tick={{ fill: "#333", fontSize: 11 }}
												/>
												<YAxis
													domain={[-1, 1]}
													label={{
														value: "E-field",
														angle: -90,
														position: "left",
														fill: "#333",
														fontSize: 12,
														dx: -15,
													}}
													tick={{ fill: "#333", fontSize: 11 }}
												/>
												<Tooltip
													formatter={(value, name) => {
														if (name === "Electric Field") {
															const actualValue =
																value * normalizedData.electricMax;
															return [`${actualValue.toFixed(4)} V/m`, name];
														}
														return [value, name];
													}}
													labelFormatter={(x) => `Distance: ${x.toFixed(3)} m`}
													contentStyle={{
														borderRadius: "6px",
														border: "1px solid #ddd",
														backgroundColor: "rgba(255, 255, 255, 0.95)",
													}}
												/>
												<Legend wrapperStyle={{ fontSize: "12px" }} />
												<ReferenceLine
													y={0}
													stroke="#666"
													strokeDasharray="3 3"
												/>
												<Line
													type="monotone"
													dataKey="E_normalized"
													stroke="#00BCD4"
													strokeWidth={3}
													name="Electric Field"
													dot={false}
													activeDot={{ r: 5 }}
													animationDuration={300}
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
								</div>

								<div className="bg-blue-50 p-4 border-t border-blue-100">
									<h3 className="font-bold mb-2 text-blue-800">
										Electric Field Analysis
									</h3>
									<div className="grid grid-cols-2 gap-2">
										<div className="bg-white rounded-lg p-3 shadow">
											<div className="text-xs text-gray-500 mb-1">Maximum</div>
											<div className="text-blue-800 font-medium">
												{electricMetrics.max.toFixed(4)} V/m
											</div>
										</div>
										<div className="bg-white rounded-lg p-3 shadow">
											<div className="text-xs text-gray-500 mb-1">Minimum</div>
											<div className="text-blue-800 font-medium">
												{electricMetrics.min.toFixed(4)} V/m
											</div>
										</div>
										<div className="bg-white rounded-lg p-3 shadow">
											<div className="text-xs text-gray-500 mb-1">Average</div>
											<div className="text-blue-800 font-medium">
												{electricMetrics.avg.toFixed(4)} V/m
											</div>
										</div>
										<div className="bg-white rounded-lg p-3 shadow">
											<div className="text-xs text-gray-500 mb-1">Phase</div>
											<div className="text-blue-800 font-medium">
												{electricMetrics.phase} rad
											</div>
										</div>
									</div>
									<div className="mt-3 bg-white rounded-lg p-3 shadow">
										<div className="text-xs text-gray-500 mb-1">Wavelength</div>
										<div className="text-blue-800 font-medium">
											{calculateWavelength()} m
										</div>
									</div>
								</div>
							</div>

							{/* Magnetic Field Section */}
							<div className="bg-white rounded-xl shadow-xl overflow-hidden">
								<div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6">
									<h2 className="text-xl font-bold mb-4 flex items-center">
										Magnetic Field
										<PhysicsTooltip title="Magnetic Field">
											The magnetic field is a vector field that describes the
											magnetic influence on moving electric charges, electric
											currents, and magnetic materials. In an electromagnetic
											wave, the magnetic field oscillates perpendicular to both
											the electric field and the direction of wave propagation.
										</PhysicsTooltip>
									</h2>
									<div className="h-64 bg-white rounded-lg p-2">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={normalizedData.normalizedMagnetic}
												margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
											>
												<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
												<XAxis
													dataKey="x"
													tickFormatter={formatXAxis}
													label={{
														value: "Distance (m)",
														position: "bottom",
														fill: "#333",
														fontSize: 12,
														dy: 10,
													}}
													domain={[0, params.distance]}
													tick={{ fill: "#333", fontSize: 11 }}
												/>
												<YAxis
													domain={[-1, 1]}
													label={{
														value: "B-field",
														angle: -90,
														position: "left",
														fill: "#333",
														fontSize: 12,
														dx: -15,
													}}
													tick={{ fill: "#333", fontSize: 11 }}
												/>
												<Tooltip
													formatter={(value, name) => {
														if (name === "Magnetic Field") {
															const actualValue =
																value * normalizedData.magneticMax;
															return [
																`${actualValue.toExponential(3)} T`,
																name,
															];
														}
														return [value, name];
													}}
													labelFormatter={(x) => `Distance: ${x.toFixed(3)} m`}
													contentStyle={{
														borderRadius: "6px",
														border: "1px solid #ddd",
														backgroundColor: "rgba(255, 255, 255, 0.95)",
													}}
												/>
												<Legend wrapperStyle={{ fontSize: "12px" }} />
												<ReferenceLine
													y={0}
													stroke="#666"
													strokeDasharray="3 3"
												/>
												<Line
													type="monotone"
													dataKey="B_normalized"
													stroke="#9C27B0"
													strokeWidth={3}
													name="Magnetic Field"
													dot={false}
													activeDot={{ r: 5 }}
													animationDuration={300}
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
								</div>

								<div className="bg-purple-50 p-4 border-t border-purple-100">
									<h3 className="font-bold mb-2 text-purple-800">
										Magnetic Field Analysis
									</h3>
									<div className="grid grid-cols-2 gap-2">
										<div className="bg-white rounded-lg p-3 shadow">
											<div className="text-xs text-gray-500 mb-1">Maximum</div>
											<div className="text-purple-800 font-medium">
												{magneticMetrics.max.toExponential(3)} T
											</div>
										</div>
										<div className="bg-white rounded-lg p-3 shadow">
											<div className="text-xs text-gray-500 mb-1">Minimum</div>
											<div className="text-purple-800 font-medium">
												{magneticMetrics.min.toExponential(3)} T
											</div>
										</div>
										<div className="bg-white rounded-lg p-3 shadow">
											<div className="text-xs text-gray-500 mb-1">Average</div>
											<div className="text-purple-800 font-medium">
												{magneticMetrics.avg.toExponential(3)} T
											</div>
										</div>
										<div className="bg-white rounded-lg p-3 shadow">
											<div className="text-xs text-gray-500 mb-1">Phase</div>
											<div className="text-purple-800 font-medium">
												{magneticMetrics.phase} rad
											</div>
										</div>
									</div>
									<div className="mt-3 bg-white rounded-lg p-3 shadow">
										<div className="text-xs text-gray-500 mb-1">E/B Ratio</div>
										<div className="text-purple-800 font-medium">
											{(
												electricMetrics.max / Math.abs(magneticMetrics.max)
											).toExponential(2)}{" "}
											(m/s)
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-gray-800 text-white mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<div className="flex items-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-blue-400 mr-2"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
										fill="#3B82F6"
										fillOpacity="0.2"
										stroke="#3B82F6"
										strokeWidth="2"
									/>
									<path
										d="M12 6V18"
										stroke="#3B82F6"
										strokeWidth="2"
										strokeLinecap="round"
									/>
									<path
										d="M6 12H18"
										stroke="#3B82F6"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
								<div>
									<h3 className="text-lg font-bold">WaveViz Pro</h3>
									<p className="text-xs text-gray-400">
										Electromagnetic Wave Analyzer
									</p>
								</div>
							</div>
							<p className="text-gray-400 text-sm">
								A powerful tool for visualizing and analyzing electromagnetic
								wave behavior based on Maxwell's equations.
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a href="#" className="hover:text-blue-400 transition-colors">
										Home
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-400 transition-colors">
										Features
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-400 transition-colors">
										Documentation
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-400 transition-colors">
										About
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Resources</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a href="#" className="hover:text-blue-400 transition-colors">
										Maxwell's Equations
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-400 transition-colors">
										EM Wave Theory
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-400 transition-colors">
										Physics Tutorials
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-400 transition-colors">
										Contact Support
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400 text-sm">
							© 2025 WaveViz Pro. All rights reserved.
						</p>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<a
								href="#"
								className="text-gray-400 hover:text-blue-400 transition-colors"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-blue-400 transition-colors"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										fillRule="evenodd"
										d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-blue-400 transition-colors"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										fillRule="evenodd"
										d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
