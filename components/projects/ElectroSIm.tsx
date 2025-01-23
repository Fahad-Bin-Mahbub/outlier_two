'use client'
import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
	useCallback,
	Suspense,
} from "react";
import { createRoot } from "react-dom/client";
import {
	Loader,
	Menu,
	X,
	Settings,
	Zap,
	Eye,
	EyeOff,
	ZoomIn,
	ZoomOut,
	RefreshCw,
} from "lucide-react";
import { Helmet } from "react-helmet";

// Types
interface Vector2D {
	x: number;
	y: number;
}

interface ChargePoint {
	id: string;
	position: Vector2D;
	charge: number; // Positive for positive charge, negative for negative charge
	radius: number;
	isDragging: boolean;
}

interface SimulationSettings {
	showFieldLines: boolean;
	showEquipotentialLines: boolean;
	showGrid: boolean;
	fieldLineCount: number;
	equipotentialLineCount: number;
	fieldIntensity: number;
	resolution: number;
}

type SimulationMode = "place" | "modify" | "observe";

type Viewport = {
	width: number;
	height: number;
	scale: number;
	offset: Vector2D;
};

// Physics Constants
const COULOMB_CONSTANT = 8.99e9; // N·m²/C²
const EPSILON = 1e-10; // Small value to avoid division by zero

// Utils
/**
 * Generate a unique ID
 */
function generateId(): string {
	return Math.random().toString(36).substring(2, 11);
}

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

/**
 * Get a color from a gradient based on value
 */
function getGradientColor(value: number, min: number, max: number): string {
	// Normalize value to [0, 1]
	const t = clamp((value - min) / (max - min), 0, 1);

	// Generate RGB components for blue to red gradient
	const r = Math.round(lerp(0, 255, t));
	const g = Math.round(lerp(128, 0, t));
	const b = Math.round(lerp(255, 0, t));

	return `rgb(${r}, ${g}, ${b})`;
}

// Physics Calculations
/**
 * Calculate the electric field at a point due to all charges
 */
function calculateElectricField(
	point: Vector2D,
	charges: ChargePoint[]
): Vector2D {
	let fieldX = 0;
	let fieldY = 0;

	for (const charge of charges) {
		const dx = point.x - charge.position.x;
		const dy = point.y - charge.position.y;
		const distanceSquared = dx * dx + dy * dy;

		if (distanceSquared < EPSILON) continue;

		const distance = Math.sqrt(distanceSquared);
		const forceMagnitude = (COULOMB_CONSTANT * charge.charge) / distanceSquared;

		fieldX += (forceMagnitude * dx) / distance;
		fieldY += (forceMagnitude * dy) / distance;
	}

	return { x: fieldX, y: fieldY };
}

/**
 * Calculate the electric potential at a point due to all charges
 */
function calculateElectricPotential(
	point: Vector2D,
	charges: ChargePoint[]
): number {
	let potential = 0;

	for (const charge of charges) {
		const dx = point.x - charge.position.x;
		const dy = point.y - charge.position.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < EPSILON) continue;

		potential += (COULOMB_CONSTANT * charge.charge) / distance;
	}

	return potential;
}

/**
 * Calculate points for drawing equipotential lines
 */
function calculateEquipotentialPoints(
	charges: ChargePoint[],
	potentialValues: number[],
	resolution: number,
	width: number,
	height: number,
	offset: Vector2D,
	scale: number
): Vector2D[][] {
	const lines: Vector2D[][] = [];
	const gridSize = 20 * resolution;

	// Determine grid boundaries
	const left = -width / (2 * scale) - offset.x;
	const right = width / (2 * scale) - offset.x;
	const top = -height / (2 * scale) - offset.y;
	const bottom = height / (2 * scale) - offset.y;

	// Create a grid of potential values
	const cols = Math.ceil((right - left) / gridSize);
	const rows = Math.ceil((bottom - top) / gridSize);

	const potentialGrid: number[][] = [];
	for (let i = 0; i <= rows; i++) {
		potentialGrid[i] = [];
		for (let j = 0; j <= cols; j++) {
			const x = left + j * gridSize;
			const y = top + i * gridSize;
			potentialGrid[i][j] = calculateElectricPotential({ x, y }, charges);
		}
	}

	// March squares algorithm to find equipotential lines
	for (const potentialValue of potentialValues) {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const corners = [
					potentialGrid[i][j] - potentialValue,
					potentialGrid[i][j + 1] - potentialValue,
					potentialGrid[i + 1][j + 1] - potentialValue,
					potentialGrid[i + 1][j] - potentialValue,
				];

				// Check if an equipotential line passes through this cell
				const hasPos = corners.some((val) => val >= 0);
				const hasNeg = corners.some((val) => val <= 0);

				if (hasPos && hasNeg) {
					const x0 = left + j * gridSize;
					const y0 = top + i * gridSize;

					// Find intersection points
					const points: Vector2D[] = [];

					// Check edges
					if (corners[0] * corners[1] <= 0) {
						const t =
							Math.abs(corners[0]) /
							(Math.abs(corners[0]) + Math.abs(corners[1]));
						points.push({ x: x0 + t * gridSize, y: y0 });
					}

					if (corners[1] * corners[2] <= 0) {
						const t =
							Math.abs(corners[1]) /
							(Math.abs(corners[1]) + Math.abs(corners[2]));
						points.push({ x: x0 + gridSize, y: y0 + t * gridSize });
					}

					if (corners[2] * corners[3] <= 0) {
						const t =
							Math.abs(corners[2]) /
							(Math.abs(corners[2]) + Math.abs(corners[3]));
						points.push({ x: x0 + (1 - t) * gridSize, y: y0 + gridSize });
					}

					if (corners[3] * corners[0] <= 0) {
						const t =
							Math.abs(corners[3]) /
							(Math.abs(corners[3]) + Math.abs(corners[0]));
						points.push({ x: x0, y: y0 + (1 - t) * gridSize });
					}

					// If we found exactly 2 points, add a line segment
					if (points.length === 2) {
						lines.push(points);
					}
				}
			}
		}
	}

	return lines;
}

/**
 * Generates field line starting points around a charge
 */
function generateFieldLineStartPoints(
	charge: ChargePoint,
	count: number,
	radius: number
): Vector2D[] {
	const points: Vector2D[] = [];
	const step = (2 * Math.PI) / count;

	for (let i = 0; i < count; i++) {
		const angle = i * step;
		points.push({
			x: charge.position.x + radius * Math.cos(angle),
			y: charge.position.y + radius * Math.sin(angle),
		});
	}

	return points;
}

/**
 * Trace a field line from a starting point
 */
function traceFieldLine(
	startPoint: Vector2D,
	charges: ChargePoint[],
	maxSteps: number,
	stepSize: number,
	isNegative: boolean = false
): Vector2D[] {
	const line: Vector2D[] = [startPoint];
	let currentPoint = { ...startPoint };

	for (let i = 0; i < maxSteps; i++) {
		const field = calculateElectricField(currentPoint, charges);
		const fieldMagnitude = Math.sqrt(field.x * field.x + field.y * field.y);

		if (fieldMagnitude < EPSILON) break;

		// Normalize and adjust for direction
		const directionFactor = isNegative ? -1 : 1;
		const dx = (field.x / fieldMagnitude) * stepSize * directionFactor;
		const dy = (field.y / fieldMagnitude) * stepSize * directionFactor;

		currentPoint = {
			x: currentPoint.x + dx,
			y: currentPoint.y + dy,
		};

		line.push(currentPoint);

		// Check if we're too close to a charge (termination condition)
		const tooCloseToCharge = charges.some((charge) => {
			const dx = currentPoint.x - charge.position.x;
			const dy = currentPoint.y - charge.position.y;
			const distanceSquared = dx * dx + dy * dy;
			return distanceSquared < charge.radius * charge.radius;
		});

		if (tooCloseToCharge) break;
	}

	return line;
}

// Canvas Rendering
/**
 * Draw a grid on the canvas
 */
function drawGrid(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
	const { width, height, scale, offset } = viewport;

	// Calculate grid properties based on scale
	const gridSize = 50 * scale;
	const minGridSize = 20;

	// Set a minimum size for the grid to avoid too dense lines
	const effectiveGridSize = Math.max(gridSize, minGridSize);

	// Calculate visible grid bounds
	const startX =
		Math.floor((-width / 2 - offset.x * scale) / effectiveGridSize) *
		effectiveGridSize;
	const startY =
		Math.floor((-height / 2 - offset.y * scale) / effectiveGridSize) *
		effectiveGridSize;
	const endX =
		Math.ceil((width / 2 - offset.x * scale) / effectiveGridSize) *
		effectiveGridSize;
	const endY =
		Math.ceil((height / 2 - offset.y * scale) / effectiveGridSize) *
		effectiveGridSize;

	ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
	ctx.lineWidth = 1;

	// Draw vertical grid lines
	for (let x = startX; x <= endX; x += effectiveGridSize) {
		const screenX = x + width / 2 + offset.x * scale;
		ctx.beginPath();
		ctx.moveTo(screenX, 0);
		ctx.lineTo(screenX, height);
		ctx.stroke();
	}

	// Draw horizontal grid lines
	for (let y = startY; y <= endY; y += effectiveGridSize) {
		const screenY = y + height / 2 + offset.y * scale;
		ctx.beginPath();
		ctx.moveTo(0, screenY);
		ctx.lineTo(width, screenY);
		ctx.stroke();
	}

	// Draw origin
	const originX = width / 2 + offset.x * scale;
	const originY = height / 2 + offset.y * scale;

	ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
	ctx.lineWidth = 2;

	// Draw x axis
	ctx.beginPath();
	ctx.moveTo(0, originY);
	ctx.lineTo(width, originY);
	ctx.stroke();

	// Draw y axis
	ctx.beginPath();
	ctx.moveTo(originX, 0);
	ctx.lineTo(originX, height);
	ctx.stroke();
}

/**
 * Draw all charges on the canvas
 */
function drawCharges(
	ctx: CanvasRenderingContext2D,
	charges: ChargePoint[],
	viewport: Viewport,
	selectedChargeId: string | null
): void {
	const { width, height, scale, offset } = viewport;

	for (const charge of charges) {
		// Convert simulation coordinates to screen coordinates
		const screenX = (charge.position.x + offset.x) * scale + width / 2;
		const screenY = (charge.position.y + offset.y) * scale + height / 2;
		const screenRadius = charge.radius * scale;

		// Skip if the charge is out of view
		if (
			screenX + screenRadius < 0 ||
			screenX - screenRadius > width ||
			screenY + screenRadius < 0 ||
			screenY - screenRadius > height
		) {
			continue;
		}

		const isSelected = charge.id === selectedChargeId;

		// Draw charge
		ctx.beginPath();
		ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);

		// Fill based on charge polarity
		if (charge.charge > 0) {
			const gradient = ctx.createRadialGradient(
				screenX,
				screenY,
				0,
				screenX,
				screenY,
				screenRadius
			);
			gradient.addColorStop(0, "rgba(59, 130, 246, 1)");
			gradient.addColorStop(1, "rgba(59, 130, 246, 0.7)");
			ctx.fillStyle = gradient;
		} else {
			const gradient = ctx.createRadialGradient(
				screenX,
				screenY,
				0,
				screenX,
				screenY,
				screenRadius
			);
			gradient.addColorStop(0, "rgba(239, 68, 68, 1)");
			gradient.addColorStop(1, "rgba(239, 68, 68, 0.7)");
			ctx.fillStyle = gradient;
		}

		ctx.fill();

		// Draw charge symbol
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = `${Math.max(screenRadius * 0.8, 12)}px Arial`;
		ctx.fillText(charge.charge > 0 ? "+" : "−", screenX, screenY);

		// Draw highlight for selected charge
		if (isSelected) {
			ctx.strokeStyle = "white";
			ctx.lineWidth = 2;
			ctx.stroke();

			// Draw a halo effect
			ctx.beginPath();
			ctx.arc(screenX, screenY, screenRadius + 5, 0, Math.PI * 2);
			ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
			ctx.lineWidth = 2;
			ctx.stroke();
		}
	}
}

/**
 * Draw electric field lines
 */
function drawFieldLines(
	ctx: CanvasRenderingContext2D,
	charges: ChargePoint[],
	viewport: Viewport,
	settings: SimulationSettings
): void {
	const { width, height, scale, offset } = viewport;
	const { fieldLineCount, fieldIntensity } = settings;

	ctx.lineWidth = 1.5;

	// For each charge, draw field lines
	for (const charge of charges) {
		// Number of field lines proportional to charge magnitude
		const lineCount = Math.max(
			4,
			Math.round((fieldLineCount * Math.abs(charge.charge)) / 3)
		);
		const startPoints = generateFieldLineStartPoints(
			charge,
			lineCount,
			charge.radius * 1.2
		);

		// Only trace lines outward from positive charges and inward to negative charges
		const traceDirection = charge.charge > 0;

		for (const startPoint of startPoints) {
			const fieldLine = traceFieldLine(
				startPoint,
				charges,
				100, // Max steps
				10 / scale, // Step size (adjusted for viewport scale)
				!traceDirection
			);

			// Skip if line is too short
			if (fieldLine.length < 3) continue;

			ctx.beginPath();

			// Convert first point to screen coordinates
			let firstPoint = fieldLine[0];
			let screenX = (firstPoint.x + offset.x) * scale + width / 2;
			let screenY = (firstPoint.y + offset.y) * scale + height / 2;
			ctx.moveTo(screenX, screenY);

			// Draw the line with gradient color based on field strength
			for (let i = 1; i < fieldLine.length; i++) {
				const point = fieldLine[i];
				screenX = (point.x + offset.x) * scale + width / 2;
				screenY = (point.y + offset.y) * scale + height / 2;

				ctx.lineTo(screenX, screenY);
			}

			// Create gradient based on charge polarity
			if (charge.charge > 0) {
				ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
			} else {
				ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
			}

			ctx.stroke();
		}
	}
}

/**
 * Draw equipotential lines
 */
function drawEquipotentialLines(
	ctx: CanvasRenderingContext2D,
	charges: ChargePoint[],
	viewport: Viewport,
	settings: SimulationSettings
): void {
	const { width, height, scale, offset } = viewport;
	const { equipotentialLineCount, resolution } = settings;

	// Get min and max potential values
	let maxPotential = 0;

	// Sample points to find potential range
	const sampleSize = 10;
	const samplePoints: Vector2D[] = [];

	for (let i = 0; i < sampleSize; i++) {
		for (let j = 0; j < sampleSize; j++) {
			const x = ((i / (sampleSize - 1) - 0.5) * width) / scale - offset.x;
			const y = ((j / (sampleSize - 1) - 0.5) * height) / scale - offset.y;
			samplePoints.push({ x, y });
		}
	}

	// Find max absolute potential
	for (const point of samplePoints) {
		const potential = Math.abs(calculateElectricPotential(point, charges));
		maxPotential = Math.max(maxPotential, potential);
	}

	// Calculate potential values for equipotential lines
	const potentialValues: number[] = [];
	const minPotential = maxPotential / (equipotentialLineCount * 5);

	for (let i = 1; i <= equipotentialLineCount; i++) {
		const value = minPotential * Math.pow(3, i - 1);
		if (value <= maxPotential) {
			potentialValues.push(value);
			potentialValues.push(-value);
		}
	}

	// Calculate equipotential lines
	const lines = calculateEquipotentialPoints(
		charges,
		potentialValues,
		resolution,
		width,
		height,
		offset,
		scale
	);

	// Draw equipotential lines
	ctx.lineWidth = 1;
	ctx.setLineDash([5, 3]);

	for (const line of lines) {
		if (line.length !== 2) continue;

		ctx.beginPath();

		// Convert points to screen coordinates
		const screenX1 = (line[0].x + offset.x) * scale + width / 2;
		const screenY1 = (line[0].y + offset.y) * scale + height / 2;
		const screenX2 = (line[1].x + offset.x) * scale + width / 2;
		const screenY2 = (line[1].y + offset.y) * scale + height / 2;

		ctx.moveTo(screenX1, screenY1);
		ctx.lineTo(screenX2, screenY2);

		ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
		ctx.stroke();
	}

	ctx.setLineDash([]);
}

// Context
interface PhysicsContextType {
	charges: ChargePoint[];
	settings: SimulationSettings;
	mode: SimulationMode;
	selectedChargeId: string | null;
	// Actions
	addCharge: (position: Vector2D, charge: number) => void;
	removeCharge: (id: string) => void;
	updateCharge: (id: string, updates: Partial<ChargePoint>) => void;
	updateSettings: (updates: Partial<SimulationSettings>) => void;
	setMode: (mode: SimulationMode) => void;
	selectCharge: (id: string | null) => void;
	clearAllCharges: () => void;
}

const defaultSettings: SimulationSettings = {
	showFieldLines: true,
	showEquipotentialLines: true,
	showGrid: true,
	fieldLineCount: 16,
	equipotentialLineCount: 10,
	fieldIntensity: 1,
	resolution: 1,
};

const PhysicsContext = createContext<PhysicsContextType | undefined>(undefined);

const PhysicsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [charges, setCharges] = useState<ChargePoint[]>([]);
	const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);
	const [mode, setMode] = useState<SimulationMode>("place");
	const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);

	const addCharge = useCallback((position: Vector2D, charge: number) => {
		const newCharge: ChargePoint = {
			id: generateId(),
			position,
			charge,
			radius: Math.abs(charge) * 5 + 10,
			isDragging: false,
		};
		setCharges((prev) => [...prev, newCharge]);
	}, []);

	const removeCharge = useCallback(
		(id: string) => {
			setCharges((prev) => prev.filter((charge) => charge.id !== id));
			if (selectedChargeId === id) {
				setSelectedChargeId(null);
			}
		},
		[selectedChargeId]
	);

	const updateCharge = useCallback(
		(id: string, updates: Partial<ChargePoint>) => {
			setCharges((prev) =>
				prev.map((charge) =>
					charge.id === id ? { ...charge, ...updates } : charge
				)
			);
		},
		[]
	);

	const updateSettings = useCallback((updates: Partial<SimulationSettings>) => {
		setSettings((prev) => ({ ...prev, ...updates }));
	}, []);

	const selectCharge = useCallback((id: string | null) => {
		setSelectedChargeId(id);
	}, []);

	const clearAllCharges = useCallback(() => {
		setCharges([]);
		setSelectedChargeId(null);
	}, []);

	return (
		<PhysicsContext.Provider
			value={{
				charges,
				settings,
				mode,
				selectedChargeId,
				addCharge,
				removeCharge,
				updateCharge,
				updateSettings,
				setMode,
				selectCharge,
				clearAllCharges,
			}}
		>
			{children}
		</PhysicsContext.Provider>
	);
};

const usePhysics = () => {
	const context = useContext(PhysicsContext);
	if (context === undefined) {
		throw new Error("usePhysics must be used within a PhysicsProvider");
	}
	return context;
};

// Components
const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const { settings, updateSettings } = usePhysics();

	const handleChange = (
		key: keyof SimulationSettings,
		value: number | boolean
	) => {
		updateSettings({ [key]: value });
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
				<h2 className="text-xl font-bold mb-4">Simulation Settings</h2>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							Field Line Count
						</label>
						<input
							type="range"
							min={4}
							max={32}
							value={settings.fieldLineCount}
							onChange={(e) =>
								handleChange("fieldLineCount", parseInt(e.target.value))
							}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-slate-400">
							<span>4</span>
							<span>32</span>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Equipotential Line Count
						</label>
						<input
							type="range"
							min={5}
							max={20}
							value={settings.equipotentialLineCount}
							onChange={(e) =>
								handleChange("equipotentialLineCount", parseInt(e.target.value))
							}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-slate-400">
							<span>5</span>
							<span>20</span>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Field Intensity
						</label>
						<input
							type="range"
							min={0.2}
							max={2}
							step={0.1}
							value={settings.fieldIntensity}
							onChange={(e) =>
								handleChange("fieldIntensity", parseFloat(e.target.value))
							}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-slate-400">
							<span>Low</span>
							<span>High</span>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Resolution</label>
						<input
							type="range"
							min={0.5}
							max={2}
							step={0.1}
							value={settings.resolution}
							onChange={(e) =>
								handleChange("resolution", parseFloat(e.target.value))
							}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-slate-400">
							<span>Low</span>
							<span>High</span>
						</div>
					</div>

					<div className="flex items-center">
						<input
							type="checkbox"
							id="showGrid"
							checked={settings.showGrid}
							onChange={(e) => handleChange("showGrid", e.target.checked)}
							className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-600"
						/>
						<label htmlFor="showGrid" className="ml-2 text-sm">
							Show Grid
						</label>
					</div>
				</div>

				<div className="mt-6 flex justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

const SimulationControls: React.FC<{ isMobile?: boolean }> = ({
	isMobile = false,
}) => {
	const { settings, updateSettings } = usePhysics();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const toggleFieldLines = () => {
		updateSettings({ showFieldLines: !settings.showFieldLines });
	};

	const toggleEquipotentialLines = () => {
		updateSettings({
			showEquipotentialLines: !settings.showEquipotentialLines,
		});
	};

	const containerClass = isMobile
		? "flex flex-col space-y-2"
		: "flex items-center space-x-3";

	return (
		<div className={containerClass}>
			<div
				className={
					isMobile ? "grid grid-cols-3 gap-2" : "flex items-center space-x-2"
				}
			>
				<button
					onClick={toggleFieldLines}
					className={`p-1.5 rounded-md flex items-center justify-center ${
						settings.showFieldLines
							? "bg-blue-600 hover:bg-blue-700"
							: "bg-slate-700 hover:bg-slate-600"
					} transition`}
					title="Toggle Field Lines"
				>
					{settings.showFieldLines ? (
						<Eye className="w-5 h-5" />
					) : (
						<EyeOff className="w-5 h-5" />
					)}
					{isMobile && (
						<span className="ml-1 text-xs font-medium truncate">Field Lines</span>
					)}
				</button>

				<button
					onClick={toggleEquipotentialLines}
					className={`p-1.5 rounded-md flex items-center justify-center ${
						settings.showEquipotentialLines
							? "bg-purple-600 hover:bg-purple-700"
							: "bg-slate-700 hover:bg-slate-600"
					} transition`}
					title="Toggle Equipotential Lines"
				>
					{settings.showEquipotentialLines ? (
						<Eye className="w-5 h-5" />
					) : (
						<EyeOff className="w-5 h-5" />
					)}
					{isMobile && (
						<span className="ml-1 text-xs font-medium truncate">Equipotential</span>
					)}
				</button>

				<button
					onClick={() => setIsSettingsOpen(true)}
					className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition"
					title="Simulation Settings"
				>
					<Settings className="w-5 h-5" />
					{isMobile && (
						<span className="ml-1 text-xs font-medium truncate">Settings</span>
					)}
				</button>
			</div>

			{isSettingsOpen && (
				<SettingsModal onClose={() => setIsSettingsOpen(false)} />
			)}
		</div>
	);
};

const SimulationCanvas: React.FC = () => {
	const {
		charges,
		settings,
		selectedChargeId,
		selectCharge,
		addCharge,
		updateCharge,
	} = usePhysics();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [viewport, setViewport] = useState<Viewport>({
		width: 800,
		height: 600,
		scale: 1,
		offset: { x: 0, y: 0 },
	});

	// Interaction state
	const [isPanning, setIsPanning] = useState(false);
	const [lastPanPoint, setLastPanPoint] = useState<Vector2D | null>(null);
	const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
	const [isLongPress, setIsLongPress] = useState(false);
	const [initialDistance, setInitialDistance] = useState<number | null>(null);
	const [initialScale, setInitialScale] = useState<number>(1);

	// Initialize canvas size with better mobile handling
	useEffect(() => {
		const updateCanvasSize = () => {
			if (containerRef.current && canvasRef.current) {
				const { width, height } = containerRef.current.getBoundingClientRect();
				canvasRef.current.width = width * window.devicePixelRatio;
				canvasRef.current.height = height * window.devicePixelRatio;
				canvasRef.current.style.width = `${width}px`;
				canvasRef.current.style.height = `${height}px`;

				const ctx = canvasRef.current.getContext("2d");
				if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

				setViewport((prev) => ({
					...prev,
					width,
					height,
				}));
			}
		};

		updateCanvasSize();
		window.addEventListener("resize", updateCanvasSize);
		return () => window.removeEventListener("resize", updateCanvasSize);
	}, []);

	// Convert screen coordinates to simulation coordinates
	const screenToSimCoords = (screenX: number, screenY: number): Vector2D => {
		return {
			x: (screenX - viewport.width / 2) / viewport.scale - viewport.offset.x,
			y: (screenY - viewport.height / 2) / viewport.scale - viewport.offset.y,
		};
	};

	// Track touch events for pinch zoom
	const handleTouchStart = (e: React.TouchEvent) => {
		if (e.touches.length === 2) {
			// Store initial distance for pinch zoom
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			setInitialDistance(distance);
			setInitialScale(viewport.scale);
			e.preventDefault(); // Prevent default to avoid double-triggering with pointer events
		}
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (e.touches.length === 2 && initialDistance !== null) {
			// Calculate new scale based on pinch
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			const scaleFactor = distance / initialDistance;
			const newScale = initialScale * scaleFactor;

			// Limit zoom level
			if (newScale >= 0.25 && newScale <= 5) {
				setViewport((prev) => ({
					...prev,
					scale: newScale,
				}));
			}

			e.preventDefault(); // Prevent default to avoid conflict with other handlers
		}
	};

	const handleTouchEnd = () => {
		setInitialDistance(null);
	};

	// Render the simulation
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear canvas
		ctx.fillStyle = "#1e293b"; // slate-800
		ctx.fillRect(
			0,
			0,
			canvas.width / window.devicePixelRatio,
			canvas.height / window.devicePixelRatio
		);

		// Draw grid if enabled
		if (settings.showGrid) {
			drawGrid(ctx, viewport);
		}

		// Draw equipotential lines if enabled
		if (settings.showEquipotentialLines && charges.length > 0) {
			drawEquipotentialLines(ctx, charges, viewport, settings);
		}

		// Draw field lines if enabled
		if (settings.showFieldLines && charges.length > 0) {
			drawFieldLines(ctx, charges, viewport, settings);
		}

		// Draw charges
		drawCharges(ctx, charges, viewport, selectedChargeId);
	}, [charges, settings, viewport, selectedChargeId]);

	// Handle interactions with improved mobile support
	const handlePointerDown = (e: React.PointerEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		e.preventDefault();
		canvas.setPointerCapture(e.pointerId);

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Check if clicking on an existing charge
		const simCoords = screenToSimCoords(x, y);
		const clickedCharge = charges.find((charge) => {
			const dx = charge.position.x - simCoords.x;
			const dy = charge.position.y - simCoords.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			return distance <= charge.radius / viewport.scale;
		});

		if (clickedCharge) {
			selectCharge(clickedCharge.id);
			updateCharge(clickedCharge.id, { isDragging: true });
			setIsPanning(false);
		} else {
			// Start potential pan or place charge
			setIsPanning(true);
			setLastPanPoint({ x, y });

			// Start long press timer for negative charge
			// Clear any existing timer first
			if (longPressTimer !== null) {
				clearTimeout(longPressTimer);
			}

			// For mobile, use a shorter long press duration (350ms)
			const isMobile = window.innerWidth < 768;
			const longPressDuration = isMobile ? 350 : 400;

			const timer = setTimeout(() => {
				setIsLongPress(true);
				// Auto-place negative charge on long press
				const simCoords = screenToSimCoords(x, y);
				addCharge(simCoords, -1);

				// Provide haptic feedback if available (for mobile)
				if (navigator.vibrate) {
					navigator.vibrate(50);
				}
			}, longPressDuration);

			setLongPressTimer(timer as unknown as number);
		}
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		e.preventDefault();

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Move a dragging charge
		const draggingCharge = charges.find((c) => c.isDragging);
		if (draggingCharge) {
			const simCoords = screenToSimCoords(x, y);
			updateCharge(draggingCharge.id, {
				position: simCoords,
			});
			return;
		}

		// Handle panning with adjusted threshold for mobile
		if (isPanning && lastPanPoint) {
			const isMobile = window.innerWidth < 768;
			const moveThreshold = isMobile ? 10 : 15;

			// Cancel long press if moved enough
			if (
				longPressTimer !== null &&
				(Math.abs(x - lastPanPoint.x) > moveThreshold ||
					Math.abs(y - lastPanPoint.y) > moveThreshold)
			) {
				clearTimeout(longPressTimer);
				setLongPressTimer(null);
			}

			// Pan the viewport
			const deltaX = (x - lastPanPoint.x) / viewport.scale;
			const deltaY = (y - lastPanPoint.y) / viewport.scale;

			setViewport((prev) => ({
				...prev,
				offset: {
					x: prev.offset.x + deltaX,
					y: prev.offset.y + deltaY,
				},
			}));

			setLastPanPoint({ x, y });
		}
	};

	const handlePointerUp = (e: React.PointerEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		e.preventDefault();
		canvas.releasePointerCapture(e.pointerId);

		// Clear long press timer
		if (longPressTimer !== null) {
			clearTimeout(longPressTimer);
			setLongPressTimer(null);
		}

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Release a dragging charge
		const draggingCharge = charges.find((c) => c.isDragging);
		if (draggingCharge) {
			updateCharge(draggingCharge.id, { isDragging: false });
		}
		// Place a positive charge if it was just a short tap (not a drag and not a long press)
		else if (isPanning && lastPanPoint && !isLongPress) {
			const moveDistance = Math.sqrt(
				Math.pow(x - lastPanPoint.x, 2) + Math.pow(y - lastPanPoint.y, 2)
			);

			// Use smaller threshold for mobile
			const isMobile = window.innerWidth < 768;
			const placementThreshold = isMobile ? 8 : 10;

			// Only place a charge if we haven't moved much (not panning)
			if (moveDistance < placementThreshold) {
				const simCoords = screenToSimCoords(x, y);
				addCharge(simCoords, 1);
			}
		}

		setIsPanning(false);
		setLastPanPoint(null);
		setIsLongPress(false);
	};

	// Handle wheel event for zooming
	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();

		const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
		const newScale = viewport.scale * zoomFactor;

		// Limit zoom level
		if (newScale < 0.25 || newScale > 5) return;

		setViewport((prev) => ({
			...prev,
			scale: newScale,
		}));
	};

	// Reset viewport to default
	const resetViewport = () => {
		setViewport((prev) => ({
			...prev,
			scale: 1,
			offset: { x: 0, y: 0 },
		}));
	};

	return (
		<div
			ref={containerRef}
			className="w-full h-[500px] sm:h-[500px] md:h-[600px] lg:h-[700px] relative overflow-hidden touch-none"
		>
			<canvas
				ref={canvasRef}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onPointerLeave={handlePointerUp}
				onWheel={handleWheel}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				className="touch-none"
			/>

			{/* Original zoom controls */}
			<div className="absolute bottom-4 right-4 flex items-center bg-slate-900/70 backdrop-blur-sm rounded-lg px-2 py-1 space-x-2 border border-slate-700">
				<button
					onClick={() =>
						setViewport((prev) => ({
							...prev,
							scale: prev.scale * 1.2,
						}))
					}
					className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-700 transition"
					title="Zoom In"
				>
					<ZoomIn className="w-5 h-5" />
				</button>
				<button
					onClick={() =>
						setViewport((prev) => ({
							...prev,
							scale: prev.scale / 1.2,
						}))
					}
					className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-700 transition"
					title="Zoom Out"
				>
					<ZoomOut className="w-5 h-5" />
				</button>
				<button
					onClick={resetViewport}
					className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-700 transition"
					title="Reset View"
				>
					<RefreshCw className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

const ChargeControls: React.FC = () => {
	const {
		selectedChargeId,
		charges,
		updateCharge,
		removeCharge,
		selectCharge,
	} = usePhysics();

	const selectedCharge = charges.find((c) => c.id === selectedChargeId);

	if (!selectedCharge) {
		return (
			<div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
				<h2 className="text-lg font-semibold mb-3">Charge Properties</h2>
				<p className="text-slate-400 text-sm">
					Select a charge to edit its properties
				</p>
			</div>
		);
	}

	const handleChargeChange = (value: number) => {
		updateCharge(selectedCharge.id, {
			charge: value,
			radius: Math.abs(value) * 5 + 10, // Update radius based on charge value
		});
	};

	const handleDelete = () => {
		removeCharge(selectedCharge.id);
	};

	return (
		<div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold">Charge Properties</h2>
				<button
					onClick={() => selectCharge(null)}
					className="text-slate-400 hover:text-white"
				>
					<X className="w-5 h-5" />
				</button>
			</div>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Charge Value</label>
					<div className="flex items-center">
						<button
							onClick={() => handleChargeChange(selectedCharge.charge - 1)}
							className="px-2 py-1 bg-slate-700 rounded-l-md"
							disabled={selectedCharge.charge <= -5}
						>
							-
						</button>
						<div className="px-4 py-1 bg-slate-700 flex-1 text-center">
							{selectedCharge.charge > 0
								? `+${selectedCharge.charge}`
								: selectedCharge.charge}
						</div>
						<button
							onClick={() => handleChargeChange(selectedCharge.charge + 1)}
							className="px-2 py-1 bg-slate-700 rounded-r-md"
							disabled={selectedCharge.charge >= 5}
						>
							+
						</button>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Position</label>
					<div className="grid grid-cols-2 gap-2">
						<div>
							<label className="text-xs text-slate-400">X</label>
							<input
								type="number"
								value={Math.round(selectedCharge.position.x)}
								readOnly
								className="w-full bg-slate-700 rounded px-2 py-1 text-sm"
							/>
						</div>
						<div>
							<label className="text-xs text-slate-400">Y</label>
							<input
								type="number"
								value={Math.round(selectedCharge.position.y)}
								readOnly
								className="w-full bg-slate-700 rounded px-2 py-1 text-sm"
							/>
						</div>
					</div>
				</div>

				<button
					onClick={handleDelete}
					className="w-full mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md transition"
				>
					Delete Charge
				</button>
			</div>
		</div>
	);
};

const Header: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { clearAllCharges } = usePhysics();

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	return (
		<header className="bg-slate-900 border-b border-slate-700 relative z-10">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center">
					<Zap className="w-6 h-6 text-blue-400 mr-2" />
					<h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
						ElectroSim
					</h1>
				</div>

				<div className="hidden md:flex items-center space-x-4">
					<SimulationControls />
					<button
						onClick={clearAllCharges}
						className="px-3 py-1.5 text-sm rounded-md text-white bg-slate-700 hover:bg-slate-600 transition"
					>
						Reset
					</button>
				</div>

				<button
					onClick={toggleMenu}
					className="md:hidden p-2 rounded-md hover:bg-slate-700 transition"
					aria-label="Toggle menu"
				>
					{isMenuOpen ? (
						<X className="w-6 h-6" />
					) : (
						<Menu className="w-6 h-6" />
					)}
				</button>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="absolute top-full left-0 w-full bg-slate-800 border-b border-slate-700 py-3 px-4 md:hidden">
					<SimulationControls isMobile />
					<button
						onClick={clearAllCharges}
						className="w-full mt-4 px-4 py-2 text-base font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 transition"
					>
						Reset All Charges
					</button>
				</div>
			)}
		</header>
	);
};

const Dashboard: React.FC = () => {
	const { selectedChargeId } = usePhysics();

	return (
		<div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
			<div className="w-full md:w-3/4 lg:w-4/5">
				<div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
					<SimulationCanvas />
				</div>
			</div>

			<div className="w-full md:w-1/4 lg:w-1/5">
				<ChargeControls />

				{!selectedChargeId && (
					<div className="mt-6 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
						<h3 className="text-lg font-semibold mb-3 text-blue-300">
							Instructions
						</h3>
						<ul className="text-sm space-y-3 text-slate-300">
							<li className="flex items-start">
								<span className="inline-block w-5 h-5 rounded-full bg-blue-500 mt-1 mr-2 flex-shrink-0"></span>
								<span>Tap to place positive charges</span>
							</li>
							<li className="flex items-start">
								<span className="inline-block w-5 h-5 rounded-full bg-red-500 mt-1 mr-2 flex-shrink-0"></span>
								<span>Press and hold for negative charges</span>
							</li>
							<li className="flex items-start">
								<span className="inline-block w-5 h-5 border border-slate-500 rounded-md mt-1 mr-2 flex-shrink-0"></span>
								<span>Drag charges to reposition</span>
							</li>
							<li className="flex items-start">
								<span className="inline-block w-5 h-5 border border-slate-500 rounded-md mt-1 mr-2 flex-shrink-0"></span>
								<span>Pinch to zoom on mobile</span>
							</li>
							<li className="flex items-start">
								<span className="inline-block w-5 h-5 border border-slate-500 rounded-md mt-1 mr-2 flex-shrink-0"></span>
								<span>Drag to pan the view</span>
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

// Main App Component
const ElectroSimApp: React.FC = () => {
	return (
		<div className="min-h-screen bg-slate-900 text-white font-sans">
			<Helmet>
				{" "}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>{" "}
			</Helmet>

			<PhysicsProvider>
				<Header />
				<Suspense
					fallback={
						<div className="flex items-center justify-center h-screen">
							<Loader className="w-10 h-10 text-blue-500 animate-spin" />
							<span className="ml-4 text-lg font-semibold">
								Loading simulation...
							</span>
						</div>
					}
				>
					<Dashboard />
				</Suspense>
			</PhysicsProvider>
		</div>
	);
};

// Tailwind CSS equivalent styles
const injectStyles = () => {
	const style = document.createElement("style");
	style.textContent = `
    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Utility classes */
    .container { width: 100%; max-width: 1200px; margin-left: auto; margin-right: auto; }
    .min-h-screen { min-height: 100vh; }
    .h-screen { height: 100vh; }
    .h-auto { height: auto; }
    .w-full { width: 100%; }
    .max-w-md { max-width: 28rem; }
    .h-\\[500px\\] { height: 500px; }
    .h-\\[600px\\] { height: 600px; }
    .h-\\[700px\\] { height: 700px; }
    
    /* Flexbox */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .justify-end { justify-content: flex-end; }
    
    /* Grid */
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    
    /* Spacing */
    .gap-2 { gap: 0.5rem; }
    .gap-6 { gap: 1.5rem; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .space-x-3 > * + * { margin-left: 0.75rem; }
    .space-x-4 > * + * { margin-left: 1rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .p-1 { padding: 0.25rem; }
    .p-1\\.5 { padding: 0.375rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .pt-4 { padding-top: 1rem; }
    .ml-1 { margin-left: 0.25rem; }
    .ml-2 { margin-left: 0.5rem; }
    .ml-4 { margin-left: 1rem; }
    .mr-2 { margin-right: 0.5rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 0.75rem; }
    .mt-6 { margin-top: 1.5rem; }
    
    /* Typography */
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .text-center { text-align: center; }
    .font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    
    /* Colors */
    .text-white { color: #ffffff; }
    .text-slate-300 { color: #cbd5e1; }
    .text-slate-400 { color: #94a3b8; }
    .text-blue-300 { color: #93c5fd; }
    .text-blue-400 { color: #60a5fa; }
    .text-blue-500 { color: #3b82f6; }
    .text-transparent { color: transparent; }
    .bg-black\\/50 { background-color: rgba(0, 0, 0, 0.5); }
    .bg-slate-600 { background-color: #475569; }
    .bg-slate-700 { background-color: #334155; }
    .bg-slate-800 { background-color: #1e293b; }
    .bg-slate-800\\/60 { background-color: rgba(30, 41, 59, 0.6); }
    .bg-slate-900 { background-color: #0f172a; }
    .bg-slate-900\\/70 { background-color: rgba(15, 23, 42, 0.7); }
    .bg-blue-600 { background-color: #2563eb; }
    .bg-blue-700 { background-color: #1d4ed8; }
    .bg-purple-600 { background-color: #9333ea; }
    .bg-purple-700 { background-color: #7e22ce; }
    .bg-red-500 { background-color: #ef4444; }
    .bg-red-600 { background-color: #dc2626; }
    .bg-red-700 { background-color: #b91c1c; }
    .border-slate-500 { border-color: #64748b; }
    .border-slate-700 { border-color: #334155; }
    .border-gray-600 { border-color: #4b5563; }
    
    /* Gradients */
    .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
    .from-blue-400 { --tw-gradient-from: #60a5fa; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(96, 165, 250, 0)); }
    .to-purple-500 { --tw-gradient-to: #a855f7; }
    .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
    
    /* Borders */
    .border { border-width: 1px; }
    .border-b { border-bottom-width: 1px; }
    .rounded { border-radius: 0.25rem; }
    .rounded-md { border-radius: 0.375rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-xl { border-radius: 0.75rem; }
    .rounded-full { border-radius: 9999px; }
    .rounded-l-md { border-top-left-radius: 0.375rem; border-bottom-left-radius: 0.375rem; }
    .rounded-r-md { border-top-right-radius: 0.375rem; border-bottom-right-radius: 0.375rem; }
    
    /* Effects */
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
    .backdrop-blur-sm { backdrop-filter: blur(4px); }
    .overflow-hidden { overflow: hidden; }
    .touch-none { touch-action: none; }
    .transition { transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    
    /* Interactive */
    .hover\\:bg-slate-600:hover { background-color: #475569; }
    .hover\\:bg-slate-700:hover { background-color: #334155; }
    .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
    .hover\\:bg-purple-700:hover { background-color: #7e22ce; }
    .hover\\:bg-red-700:hover { background-color: #b91c1c; }
    .hover\\:text-white:hover { color: #ffffff; }
    
    /* Layout */
    .fixed { position: fixed; }
    .absolute { position: absolute; }
    .relative { position: relative; }
    .inset-0 { top: 0px; right: 0px; bottom: 0px; left: 0px; }
    .top-full { top: 100%; }
    .left-0 { left: 0px; }
    .bottom-4 { bottom: 1rem; }
    .right-4 { right: 1rem; }
    .z-10 { z-index: 10; }
    .z-50 { z-index: 50; }
    .hidden { display: none; }
    .inline-block { display: inline-block; }
    .flex-1 { flex: 1 1 0%; }
    
    /* Size */
    .h-4 { height: 1rem; }
    .h-5 { height: 1.25rem; }
    .h-6 { height: 1.5rem; }
    .h-8 { height: 2rem; }
    .h-10 { height: 2.5rem; }
    .w-4 { width: 1rem; }
    .w-5 { width: 1.25rem; }
    .w-6 { width: 1.5rem; }
    .w-8 { width: 2rem; }
    .w-10 { width: 2.5rem; }
    
    /* Responsive */
    @media (min-width: 768px) {
      .md\\:flex { display: flex; }
      .md\\:hidden { display: none; }
      .md\\:w-1\\/4 { width: 25%; }
      .md\\:w-3\\/4 { width: 75%; }
      .md\\:flex-row { flex-direction: row; }
      .md\\:h-\\[600px\\] { height: 600px; }
    }
    @media (min-width: 1024px) {
      .lg\\:w-1\\/5 { width: 20%; }
      .lg\\:w-4\\/5 { width: 80%; }
      .lg\\:h-\\[700px\\] { height: 700px; }
    }
  `;
	document.head.appendChild(style);
};

// Mount app to DOM
const mountApp = () => {
	const rootElement = document.getElementById("root");
	if (!rootElement) {
		const newRoot = document.createElement("div");
		newRoot.id = "root";
		document.body.appendChild(newRoot);
		createRoot(newRoot).render(
			<React.StrictMode>
				<ElectroSimApp />
			</React.StrictMode>
		);
	} else {
		createRoot(rootElement).render(
			<React.StrictMode>
				<ElectroSimApp />
			</React.StrictMode>
		);
	}
};

// Initialize
injectStyles();
mountApp();

// Export the component if needed
export default ElectroSimApp;
