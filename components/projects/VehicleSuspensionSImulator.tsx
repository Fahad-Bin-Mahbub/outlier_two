"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	AlertCircle,
	HelpCircle,
	Settings,
	Play,
	Pause,
	RefreshCw,
	Info,
	ChevronDown,
	ChevronUp,
} from "lucide-react";

interface ToastProps {
	message: string;
	isVisible: boolean;
	type: "error" | "info" | "success";
}

interface ButtonProps {
	children: React.ReactNode;
	onClick: () => void;
	icon?: React.ReactNode;
	primary?: boolean;
	disabled?: boolean;
	small?: boolean;
	className?: string;
}

interface SliderProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step?: number;
	tooltip?: string;
	unit?: string;
}

interface TabsProps {
	tabs: { id: string; label: string }[];
	activeTab: string;
	setActiveTab: (id: string) => void;
}

interface PresetProps {
	label: string;
	description: string;
	onClick: () => void;
	active?: boolean;
}

interface RoadProfile {
	x: number;
	y: number;
}

interface Position {
	x: number;
	y: number;
}

interface SuspensionSettings {
	mass: number;
	springStiffness: number;
	dampingCoefficient: number;
	description: string;
}

interface WheelData {
	position: Position;
	suspensionTravel: number;
	suspensionVelocity: number;
	roadHeight: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, type }) => {
	if (!isVisible) return null;

	const bgColor =
		type === "error"
			? "bg-red-500"
			: type === "success"
			? "bg-green-500"
			: "bg-blue-500";

	return (
		<div
			className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 flex items-center`}
		>
			<AlertCircle className="mr-2" size={20} />
			<span>{message}</span>
		</div>
	);
};

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	icon,
	primary = false,
	disabled = false,
	small = false,
	className = "",
}) => {
	const baseClasses =
		"flex items-center justify-center rounded-md font-medium transition-all duration-200 cursor-pointer";
	const sizeClasses = small ? "px-2 py-1 text-sm" : "px-4 py-2";
	const primaryClasses = primary
		? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
		: "bg-gray-200 hover:bg-gray-300 text-gray-800";
	const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${sizeClasses} ${primaryClasses} ${disabledClasses} ${className}`}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{children}
		</button>
	);
};

const Slider: React.FC<SliderProps> = ({
	label,
	value,
	onChange,
	min,
	max,
	step = 0.1,
	tooltip,
	unit,
}) => {
	return (
		<div className="mb-4">
			<div className="flex justify-between items-center mb-1">
				<label className="text-sm font-medium text-gray-700 flex items-center">
					{label}
					{tooltip && (
						<div className="relative group ml-1 z-50">
							<HelpCircle size={16} className="text-gray-400" />
							<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
								{tooltip}
							</div>
						</div>
					)}
				</label>
				<span className="text-sm font-medium text-blue-600 whitespace-nowrap">
					{value.toFixed(unit?.includes("k") ? 0 : 1)} {unit || ""}
				</span>
			</div>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(parseFloat(e.target.value))}
				className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
			/>
		</div>
	);
};

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
	return (
		<div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-4 overflow-x-auto">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => setActiveTab(tab.id)}
					className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
						activeTab === tab.id
							? "bg-white shadow-sm text-blue-600"
							: "text-gray-600 hover:bg-gray-200"
					} cursor-pointer whitespace-nowrap`}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
};

const Preset: React.FC<PresetProps> = ({
	label,
	description,
	onClick,
	active = false,
}) => {
	return (
		<div className="relative group">
			<button
				onClick={onClick}
				className={`border rounded-md px-3 py-1 text-sm transition cursor-pointer ${
					active
						? "bg-blue-100 border-blue-400 text-blue-700"
						: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
				}`}
			>
				{label}
			</button>
			<div className="absolute bottom-full left-5/6 transform -translate-x-1/2 mb-2 w-48 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
				{description}
			</div>
		</div>
	);
};

const CollapsibleSection: React.FC<{
	title: string;
	children: React.ReactNode;
	initiallyOpen?: boolean;
}> = ({ title, children, initiallyOpen = true }) => {
	const [isOpen, setIsOpen] = useState(initiallyOpen);

	return (
		<div className="border border-gray-200 rounded-lg mb-4">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition rounded-t-lg"
			>
				<h3 className="text-md font-semibold text-gray-800">{title}</h3>
				{isOpen ? (
					<ChevronUp size={18} className="text-gray-600" />
				) : (
					<ChevronDown size={18} className="text-gray-600" />
				)}
			</button>
			{isOpen && <div className="p-3 bg-white rounded-b-lg">{children}</div>}
		</div>
	);
};

const SuspensionSimulator: React.FC = () => {
	const [mass, setMass] = useState<number>(1500);
	const [springStiffness, setSpringStiffness] = useState<number>(60000);
	const [dampingCoefficient, setDampingCoefficient] = useState<number>(8000);
	const [speed, setSpeed] = useState<number>(30);
	const [bumpHeight, setBumpHeight] = useState<number>(0.1);
	const [bumpWidth, setBumpWidth] = useState<number>(1.0);
	const [roadType, setRoadType] = useState<string>("single-bump");
	const [detailLevel, setDetailLevel] = useState<number>(2);

	const [dampingRatio, setDampingRatio] = useState<number>(0);
	const [naturalFrequency, setNaturalFrequency] = useState<number>(0);
	const [dampingType, setDampingType] = useState<string>("");
	const [resonanceFrequency, setResonanceFrequency] = useState<number>(0);

	const [isSimulating, setIsSimulating] = useState<boolean>(true);
	const [time, setTime] = useState<number>(0);
	const [carPosition, setCarPosition] = useState<Position>({ x: 0, y: 0 });
	const [carRotation, setCarRotation] = useState<number>(0);
	const [wheelData, setWheelData] = useState<WheelData[]>([
		{
			position: { x: -1.2, y: 0 },
			suspensionTravel: 0,
			suspensionVelocity: 0,
			roadHeight: 0,
		},
		{
			position: { x: 1.2, y: 0 },
			suspensionTravel: 0,
			suspensionVelocity: 0,
			roadHeight: 0,
		},
		{
			position: { x: -1.2, y: 0 },
			suspensionTravel: 0,
			suspensionVelocity: 0,
			roadHeight: 0,
		},
		{
			position: { x: 1.2, y: 0 },
			suspensionTravel: 0,
			suspensionVelocity: 0,
			roadHeight: 0,
		},
	]);

	const [roadProfile, setRoadProfile] = useState<RoadProfile[]>([]);

	const [simulationUpdate, setSimulationUpdate] = useState<number>(0);
	const [currentPreset, setCurrentPreset] = useState<string>("standard");

	const [activeTab, setActiveTab] = useState<string>("controls");
	const [showToast, setShowToast] = useState<boolean>(false);
	const [toastMessage, setToastMessage] = useState<string>("");
	const [toastType, setToastType] = useState<"error" | "info" | "success">(
		"info"
	);
	const [zoomedViewport, setZoomedViewport] = useState<boolean>(true);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationRef = useRef<number | null>(null);

	const vehicleParams = {
		wheelbase: 2.8,
		trackWidth: 1.8,
		suspensionTravel: 0.3,
		carHeight: 1.5,
		carWidth: 2.0,
		carLength: 4.5,
		wheelRadius: 0.35,
		suspensionRestLength: 0.5,
		cg: 0.7,
	};

	const MAX_SUSPENSION_VELOCITY = 10;

	useEffect(() => {
		const omega = Math.sqrt(springStiffness / mass);

		const ratio = dampingCoefficient / (2 * Math.sqrt(mass * springStiffness));

		const omegaD = omega * Math.sqrt(1 - Math.min(ratio, 0.999) ** 2);

		const resonance = omegaD / (2 * Math.PI);

		setNaturalFrequency(omega);
		setDampingRatio(ratio);
		setResonanceFrequency(resonance);

		if (Math.abs(ratio - 1) < 0.01) {
			setDampingType("Critically Damped");
		} else if (ratio < 1) {
			setDampingType("Underdamped");
		} else {
			setDampingType("Overdamped");
		}

		generateRoadProfile();

		setSimulationUpdate((prev) => prev + 1);
	}, [
		mass,
		springStiffness,
		dampingCoefficient,
		bumpHeight,
		bumpWidth,
		roadType,
	]);

	const generateRoadProfile = (): void => {
		const roadLength = 100;
		const resolution = 0.1;
		const numPoints = Math.floor(roadLength / resolution);
		const profile: RoadProfile[] = [];

		for (let i = 0; i < numPoints; i++) {
			const x = i * resolution;
			let y = 0;

			if (roadType === "single-bump") {
				const bumpCenter = 5;
				const distFromBump = Math.abs(x - bumpCenter);
				if (distFromBump < bumpWidth / 2) {
					y =
						bumpHeight * Math.cos((distFromBump / (bumpWidth / 2)) * Math.PI) +
						bumpHeight;
				}
			} else if (roadType === "sine-wave") {
				y = bumpHeight * Math.sin((x * Math.PI) / bumpWidth);
			} else if (roadType === "random-bumps") {
				const noise =
					Math.sin(x * 2) * 0.3 +
					Math.sin(x * 4.5) * 0.2 +
					Math.sin(x * 7) * 0.1;
				y = noise * bumpHeight;
			} else if (roadType === "step") {
				if (x > 5 && x < 15) {
					y = bumpHeight;
				}
			} else if (roadType === "speedbumps") {
				const bumpSpacing = 5;
				const bumpStart = x % bumpSpacing;
				if (bumpStart < bumpWidth) {
					const bumpPos = bumpStart / bumpWidth;
					y = bumpHeight * Math.sin(bumpPos * Math.PI);
				}
			}

			profile.push({ x, y });
		}

		setRoadProfile(profile);
	};

	useEffect(() => {
		if (!isSimulating) return;

		const wheelPositions = [
			{ x: -vehicleParams.trackWidth / 2, y: -vehicleParams.wheelbase / 2 },
			{ x: vehicleParams.trackWidth / 2, y: -vehicleParams.wheelbase / 2 },
			{ x: -vehicleParams.trackWidth / 2, y: vehicleParams.wheelbase / 2 },
			{ x: vehicleParams.trackWidth / 2, y: vehicleParams.wheelbase / 2 },
		];

		const newWheelData: WheelData[] = [...wheelData];

		const updateSimulation = () => {
			setTime((prevTime) => {
				const newTime = prevTime + 0.016;
				const speedMS = speed / 3.6;
				const carX = Math.min(newTime * speedMS, 95);

				const getRoadHeight = (xPos: number): number => {
					const adjustedX = xPos;
					const index = Math.floor(adjustedX / 0.1);

					if (index >= 0 && index < roadProfile.length - 1) {
						const t = (adjustedX - roadProfile[index].x) / 0.1;
						return (
							roadProfile[index].y * (1 - t) + roadProfile[index + 1].y * t
						);
					}
					return 0;
				};

				const updatedWheelData = newWheelData.map((wheel, index) => {
					const wheelPos = wheelPositions[index];
					const wheelX = carX + wheelPos.y;
					const wheelTrack = wheelPos.x;
					const roadHeight = getRoadHeight(wheelX);

					const suspensionLength = wheel.suspensionTravel;
					const suspensionVelocity = wheel.suspensionVelocity;

					const springForce = -springStiffness * suspensionLength;
					const dampingForce = -dampingCoefficient * suspensionVelocity;
					const roadForce = springStiffness * roadHeight;
					const totalForce = springForce + dampingForce + roadForce;
					const wheelAcceleration = totalForce / (mass / 4);

					const newVelocity = suspensionVelocity + wheelAcceleration * 0.016;
					const clampedNewVelocity = Math.max(
						-MAX_SUSPENSION_VELOCITY,
						Math.min(MAX_SUSPENSION_VELOCITY, newVelocity)
					);
					const newTravel = suspensionLength + clampedNewVelocity * 0.016;
					const clampedNewTravel = Math.max(
						-vehicleParams.suspensionTravel,
						Math.min(vehicleParams.suspensionTravel, newTravel)
					);

					return {
						position: {
							x: wheelTrack,
							y: roadHeight,
						},
						suspensionTravel: clampedNewTravel,
						suspensionVelocity: clampedNewVelocity,
						roadHeight,
					};
				});

				setWheelData(updatedWheelData);

				const frontSuspAvg =
					(updatedWheelData[0].suspensionTravel +
						updatedWheelData[1].suspensionTravel) /
					2;
				const rearSuspAvg =
					(updatedWheelData[2].suspensionTravel +
						updatedWheelData[3].suspensionTravel) /
					2;
				const leftSuspAvg =
					(updatedWheelData[0].suspensionTravel +
						updatedWheelData[2].suspensionTravel) /
					2;
				const rightSuspAvg =
					(updatedWheelData[1].suspensionTravel +
						updatedWheelData[3].suspensionTravel) /
					2;

				const pitchAngle = Math.atan2(
					frontSuspAvg - rearSuspAvg,
					vehicleParams.wheelbase
				);

				const avgSuspension = (frontSuspAvg + rearSuspAvg) / 2;
				const avgRoadHeight =
					(updatedWheelData[0].roadHeight +
						updatedWheelData[1].roadHeight +
						updatedWheelData[2].roadHeight +
						updatedWheelData[3].roadHeight) /
					4;

				setCarPosition({
					x: carX,
					y: avgSuspension + avgRoadHeight + vehicleParams.suspensionRestLength,
				});

				setCarRotation(pitchAngle);

				return newTime;
			});

			animationRef.current = requestAnimationFrame(updateSimulation);
		};

		animationRef.current = requestAnimationFrame(updateSimulation);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [
		isSimulating,
		mass,
		springStiffness,
		dampingCoefficient,
		speed,
		roadProfile,
		simulationUpdate,
		wheelData,
	]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const { width, height } = canvas;
		const scale = zoomedViewport ? 60 : 40;

		ctx.clearRect(0, 0, width, height);
		ctx.save();
		ctx.translate(width / 2, height / 2 + (zoomedViewport ? 50 : 0));
		ctx.scale(scale, -scale);

		ctx.fillStyle = "#E0F2FE";
		ctx.fillRect(-width / scale / 2, 0, width / scale, height / scale / 2);

		ctx.fillStyle = "#8B5A2B";
		ctx.fillRect(
			-width / scale / 2,
			-height / scale / 2,
			width / scale,
			height / scale / 2
		);

		ctx.beginPath();
		ctx.moveTo(-10, -0.45);
		const visibleRoadStart = Math.floor(carPosition.x) - 10;
		const visibleRoadEnd = Math.floor(carPosition.x) + 10;

		for (let i = 0; i < roadProfile.length; i++) {
			const { x, y } = roadProfile[i];
			if (x >= visibleRoadStart && x <= visibleRoadEnd) {
				ctx.lineTo(x - carPosition.x, y);
			}
		}

		ctx.lineTo(10, -0.45);
		ctx.lineTo(-10, -0.45);
		ctx.closePath();
		ctx.fillStyle = "#64748B";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(-10, -0.45);
		for (let i = 0; i < roadProfile.length; i++) {
			const { x, y } = roadProfile[i];
			if (x >= visibleRoadStart && x <= visibleRoadEnd) {
				ctx.lineTo(x - carPosition.x, y);
			}
		}
		ctx.lineTo(10, -0.45);
		ctx.strokeStyle = "#334155";
		ctx.lineWidth = 0.02;
		ctx.stroke();

		ctx.setLineDash([0.5, 0.5]);
		ctx.beginPath();
		ctx.moveTo(-10, 0.01);
		ctx.lineTo(10, 0.01);
		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 0.05;
		ctx.stroke();
		ctx.setLineDash([]);

		ctx.save();
		ctx.rotate(carRotation);

		const drawSuspension = (wheelIndex: number) => {
			const wheelPosition = wheelData[wheelIndex].position;
			const roadHeight = wheelData[wheelIndex].roadHeight;
			const suspensionTravel = wheelData[wheelIndex].suspensionTravel;

			const wheelX = wheelPosition.x;
			const wheelY = roadHeight;
			const bodyX = wheelX;
			const bodyY = carPosition.y - vehicleParams.suspensionRestLength;

			if (detailLevel >= 2) {
				ctx.strokeStyle =
					dampingType === "Underdamped"
						? "#FF5722"
						: dampingType === "Critically Damped"
						? "#4CAF50"
						: "#2196F3";
				ctx.lineWidth = 0.04;

				const springSegments = Math.floor(12 - dampingRatio * 4);
				const springWidth = 0.15;
				const springHeight = bodyY - wheelY;
				const segmentHeight = springHeight / springSegments;

				ctx.beginPath();
				ctx.moveTo(wheelX, wheelY + vehicleParams.wheelRadius);
				for (let i = 0; i < springSegments; i++) {
					const segmentY =
						wheelY + vehicleParams.wheelRadius + i * segmentHeight;
					ctx.lineTo(
						wheelX + (i % 2 === 0 ? springWidth : -springWidth),
						segmentY
					);
				}
				ctx.lineTo(bodyX, bodyY);
				ctx.stroke();

				const damperColor =
					dampingType === "Underdamped"
						? "#FF9800"
						: dampingType === "Critically Damped"
						? "#66BB6A"
						: "#42A5F5";
				ctx.strokeStyle = damperColor;
				ctx.lineWidth = 0.05;

				const damperOffset = 0.2;
				const cylinderHeight = (bodyY - wheelY) * 0.6;

				ctx.beginPath();
				ctx.moveTo(wheelX + damperOffset, wheelY + vehicleParams.wheelRadius);
				ctx.lineTo(
					wheelX + damperOffset,
					wheelY + vehicleParams.wheelRadius + cylinderHeight * 0.2
				);
				ctx.lineWidth = 0.08;
				ctx.stroke();

				ctx.beginPath();
				ctx.lineWidth = 0.03;
				ctx.moveTo(
					wheelX + damperOffset - 0.1,
					wheelY + vehicleParams.wheelRadius + cylinderHeight * 0.2
				);
				ctx.lineTo(
					wheelX + damperOffset + 0.1,
					wheelY + vehicleParams.wheelRadius + cylinderHeight * 0.2
				);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(
					wheelX + damperOffset,
					wheelY + vehicleParams.wheelRadius + cylinderHeight * 0.2
				);
				ctx.lineTo(wheelX + damperOffset, bodyY - 0.1);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(wheelX + damperOffset, bodyY - 0.1, 0.04, 0, Math.PI * 2);
				ctx.fillStyle = damperColor;
				ctx.fill();

				if (detailLevel >= 3) {
					ctx.beginPath();
					ctx.moveTo(wheelX, wheelY + vehicleParams.wheelRadius * 0.8);
					ctx.lineTo(bodyX - 0.3, bodyY - 0.15);
					ctx.lineTo(bodyX + 0.3, bodyY - 0.15);
					ctx.lineTo(wheelX, wheelY + vehicleParams.wheelRadius * 0.8);
					ctx.fillStyle = "#475569";
					ctx.fill();

					ctx.beginPath();
					ctx.arc(bodyX - 0.25, bodyY - 0.15, 0.05, 0, Math.PI * 2);
					ctx.arc(bodyX + 0.25, bodyY - 0.15, 0.05, 0, Math.PI * 2);
					ctx.fillStyle = "#94A3B8";
					ctx.fill();
				}
			} else {
				ctx.beginPath();
				ctx.moveTo(wheelX, wheelY + vehicleParams.wheelRadius);
				ctx.lineTo(bodyX, bodyY);
				ctx.strokeStyle = "#94A3B8";
				ctx.lineWidth = 0.05;
				ctx.stroke();
			}

			ctx.beginPath();
			ctx.arc(wheelX, wheelY, vehicleParams.wheelRadius, 0, Math.PI * 2);
			ctx.fillStyle = "#1E293B";
			ctx.fill();

			ctx.beginPath();
			ctx.arc(wheelX, wheelY, vehicleParams.wheelRadius * 0.6, 0, Math.PI * 2);
			ctx.fillStyle = "#94A3B8";
			ctx.fill();

			ctx.beginPath();
			ctx.arc(wheelX, wheelY, vehicleParams.wheelRadius * 0.15, 0, Math.PI * 2);
			ctx.fillStyle = "#E2E8F0";
			ctx.fill();

			ctx.strokeStyle = "#64748B";
			ctx.lineWidth = 0.03;
			for (let i = 0; i < 5; i++) {
				const angle = (i / 5) * Math.PI * 2;
				ctx.beginPath();
				ctx.moveTo(wheelX, wheelY);
				ctx.lineTo(
					wheelX + Math.cos(angle) * vehicleParams.wheelRadius * 0.58,
					wheelY + Math.sin(angle) * vehicleParams.wheelRadius * 0.58
				);
				ctx.stroke();
			}
		};

		const drawCarBody = () => {
			const bodyWidth = vehicleParams.carWidth;
			const bodyLength = vehicleParams.carLength;
			const bodyHeight = vehicleParams.carHeight;

			ctx.fillStyle = "#3B82F6";
			ctx.beginPath();
			ctx.roundRect(
				-bodyWidth / 2,
				carPosition.y - vehicleParams.suspensionRestLength,
				bodyWidth,
				bodyHeight * 0.5,
				0.2
			);
			ctx.fill();

			ctx.fillStyle = "#2563EB";
			ctx.beginPath();
			ctx.moveTo(
				-bodyWidth * 0.4,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.5
			);
			ctx.lineTo(
				-bodyWidth * 0.45,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.65
			);
			ctx.lineTo(
				-bodyWidth * 0.4,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.85
			);
			ctx.lineTo(
				bodyWidth * 0.4,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.85
			);
			ctx.lineTo(
				bodyWidth * 0.45,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.65
			);
			ctx.lineTo(
				bodyWidth * 0.4,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.5
			);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = "#BFDBFE";
			ctx.beginPath();
			ctx.moveTo(
				-bodyWidth * 0.38,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.52
			);
			ctx.lineTo(
				-bodyWidth * 0.42,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.64
			);
			ctx.lineTo(
				-bodyWidth * 0.38,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.82
			);
			ctx.lineTo(
				bodyWidth * 0.38,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.82
			);
			ctx.lineTo(
				bodyWidth * 0.42,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.64
			);
			ctx.lineTo(
				bodyWidth * 0.38,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.52
			);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = "#FBBF24";
			ctx.beginPath();
			ctx.roundRect(
				-bodyWidth * 0.45,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.3,
				bodyWidth * 0.1,
				bodyHeight * 0.1,
				0.05
			);
			ctx.roundRect(
				bodyWidth * 0.35,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.3,
				bodyWidth * 0.1,
				bodyHeight * 0.1,
				0.05
			);
			ctx.fill();

			ctx.fillStyle = "#1E3A8A";
			ctx.beginPath();
			ctx.roundRect(
				-bodyWidth * 0.3,
				carPosition.y - vehicleParams.suspensionRestLength + bodyHeight * 0.25,
				bodyWidth * 0.6,
				bodyHeight * 0.08,
				0.02
			);
			ctx.fill();

			if (detailLevel >= 3) {
				ctx.fillStyle = "#94A3B8";
				ctx.beginPath();
				ctx.roundRect(
					-bodyWidth * 0.05,
					carPosition.y -
						vehicleParams.suspensionRestLength +
						bodyHeight * 0.35,
					bodyWidth * 0.1,
					bodyHeight * 0.04,
					0.01
				);
				ctx.fill();

				ctx.strokeStyle = "#1E40AF";
				ctx.lineWidth = 0.05;

				ctx.beginPath();
				ctx.arc(
					-vehicleParams.trackWidth / 2,
					carPosition.y -
						vehicleParams.suspensionRestLength +
						vehicleParams.wheelRadius,
					vehicleParams.wheelRadius * 1.2,
					Math.PI,
					0,
					true
				);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(
					vehicleParams.trackWidth / 2,
					carPosition.y -
						vehicleParams.suspensionRestLength +
						vehicleParams.wheelRadius,
					vehicleParams.wheelRadius * 1.2,
					Math.PI,
					0,
					true
				);
				ctx.stroke();
			}
		};

		for (let i = 0; i < wheelData.length; i++) {
			drawSuspension(i);
		}

		drawCarBody();
		ctx.restore();

		if (detailLevel >= 3 && !zoomedViewport) {
			const graphWidth = 4;
			const graphHeight = 1;
			const graphX = -8;
			const graphY = 3;

			ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
			ctx.strokeStyle = "#475569";
			ctx.lineWidth = 0.02;
			ctx.fillRect(graphX, graphY, graphWidth, graphHeight);
			ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);

			ctx.fillStyle = "#1E293B";
			ctx.font = "0.2px Arial";
			ctx.fillText("Suspension Travel", graphX + 0.2, graphY + 0.25);

			ctx.beginPath();
			ctx.moveTo(graphX, graphY + graphHeight / 2);
			ctx.lineTo(graphX + graphWidth, graphY + graphHeight / 2);
			ctx.strokeStyle = "#94A3B8";
			ctx.lineWidth = 0.01;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(graphX, graphY + graphHeight / 2);
			const timeScale = graphWidth / 5;

			for (let t = 0; t < 5; t += 0.1) {
				const x = graphX + t * timeScale;
				let dampingEffect = 0.5;
				if (dampingType === "Underdamped") dampingEffect = 0.2;
				if (dampingType === "Overdamped") dampingEffect = 0.8;
				const offset =
					Math.sin(time * 2 + t * 3) * 0.1 * Math.exp(-t * dampingEffect);
				const y = graphY + graphHeight / 2 - offset;
				ctx.lineTo(x, y);
			}

			ctx.strokeStyle =
				dampingType === "Underdamped"
					? "#FF5722"
					: dampingType === "Critically Damped"
					? "#4CAF50"
					: "#2196F3";
			ctx.lineWidth = 0.03;
			ctx.stroke();
		}

		ctx.restore();

		if (!zoomedViewport) {
			const margin = 20;
			const padding = 10;
			const boxWidth = 200;
			const boxHeight = 100;

			ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
			ctx.beginPath();
			ctx.roundRect(
				margin,
				height - boxHeight - margin,
				boxWidth,
				boxHeight,
				5
			);
			ctx.fill();

			ctx.fillStyle = "#FFFFFF";
			ctx.font = "14px Arial";
			ctx.fillText(
				"Suspension Data",
				margin + padding,
				height - boxHeight - margin + padding + 16
			);

			ctx.font = "12px Arial";
			ctx.fillText(
				`Damping Type: ${dampingType}`,
				margin + padding,
				height - boxHeight - margin + padding + 40
			);
			ctx.fillText(
				`Damping Ratio: ${dampingRatio.toFixed(2)}`,
				margin + padding,
				height - boxHeight - margin + padding + 60
			);
			ctx.fillText(
				`Natural Freq: ${naturalFrequency.toFixed(1)} rad/s`,
				margin + padding,
				height - boxHeight - margin + padding + 80
			);
		}
	}, [
		carPosition,
		carRotation,
		wheelData,
		roadProfile,
		dampingType,
		dampingRatio,
		naturalFrequency,
		time,
		detailLevel,
		zoomedViewport,
	]);

	const showToastNotification = (
		message: string,
		type: "error" | "info" | "success" = "info"
	): void => {
		setToastMessage(message);
		setToastType(type);
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	const presets = {
		underdamped: {
			mass: 1500,
			springStiffness: 60000,
			dampingRatio: 0.5,
			description: "Bouncy, oscillating suspension - like a sports car",
		},
		criticallyDamped: {
			mass: 1500,
			springStiffness: 60000,
			dampingRatio: 1.0,
			description: "Optimal balance - fastest return to equilibrium",
		},
		overdamped: {
			mass: 1500,
			springStiffness: 60000,
			dampingRatio: 1.5,
			description: "Slow return without oscillation - like a luxury car",
		},
		sportsCar: {
			mass: 1300,
			springStiffness: 80000,
			dampingRatio: 0.7,
			description: "Stiff, responsive setup for performance driving",
		},
		luxuryCar: {
			mass: 2000,
			springStiffness: 50000,
			dampingRatio: 1.2,
			description: "Soft, comfortable setup for smooth ride quality",
		},
		standard: {
			mass: 1500,
			springStiffness: 60000,
			dampingRatio: 0.8,
			description: "Balanced setup for general driving",
		},
	};

	const applyPreset = (presetKey: string): void => {
		const preset = presets[presetKey];
		if (preset) {
			setMass(preset.mass);
			setSpringStiffness(preset.springStiffness);
			const c =
				preset.dampingRatio *
				2 *
				Math.sqrt(preset.mass * preset.springStiffness);
			setDampingCoefficient(c);
			setCurrentPreset(presetKey);
			resetSimulation();
			showToastNotification(`Applied ${preset.description}`, "success");
		}
	};

	const resetSimulation = (): void => {
		setTime(0);
		setCarPosition({ x: 0, y: 0 });
		setWheelData([
			{
				position: { x: -1.2, y: 0 },
				suspensionTravel: 0,
				suspensionVelocity: 0,
				roadHeight: 0,
			},
			{
				position: { x: 1.2, y: 0 },
				suspensionTravel: 0,
				suspensionVelocity: 0,
				roadHeight: 0,
			},
			{
				position: { x: -1.2, y: 0 },
				suspensionTravel: 0,
				suspensionVelocity: 0,
				roadHeight: 0,
			},
			{
				position: { x: 1.2, y: 0 },
				suspensionTravel: 0,
				suspensionVelocity: 0,
				roadHeight: 0,
			},
		]);
		setCarRotation(0);
		setSimulationUpdate((prev) => prev + 1);
		showToastNotification("Simulation reset", "info");
	};

	const tabs = [
		{ id: "controls", label: "Controls" },
		{ id: "theory", label: "Suspension Theory" },
		{ id: "settings", label: "Settings" },
		{ id: "about", label: "About" },
	];

	const roadTypes = [
		{ id: "single-bump", label: "Single Bump" },
		{ id: "sine-wave", label: "Sine Wave" },
		{ id: "random-bumps", label: "Random Bumps" },
		{ id: "step", label: "Step" },
		{ id: "speedbumps", label: "Speed Bumps" },
	];

	const getDampingColor = (): string => {
		if (dampingType === "Underdamped") return "bg-orange-500";
		if (dampingType === "Critically Damped") return "bg-green-500";
		return "bg-blue-500";
	};

	const getDampingStateText = (): string => {
		if (dampingRatio < 0.3) {
			return "Very underdamped - Will oscillate many times before settling. Comfortable but poor handling.";
		} else if (dampingRatio < 0.7) {
			return "Underdamped - Some oscillation. Good for sporty feel while maintaining decent comfort.";
		} else if (dampingRatio < 0.9) {
			return "Slightly underdamped - Quick return with minimal oscillation. Good balance for everyday driving.";
		} else if (dampingRatio <= 1.1) {
			return "Critically damped - Optimal response time without oscillation. Excellent for precision handling.";
		} else if (dampingRatio < 1.5) {
			return "Slightly overdamped - Smooth but slightly slow return. Good for comfort-oriented vehicles.";
		} else if (dampingRatio < 2.0) {
			return "Overdamped - Slow, smooth return. Excellent for luxury vehicles prioritizing ride quality.";
		} else {
			return "Very overdamped - Very slow return. May feel unresponsive but extremely smooth ride.";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-4 sm:py-8 px-2 sm:px-4 font-sans">
			<div className="max-w-6xl mx-auto">
				{}
				<header className="text-center mb-4 sm:mb-8">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-2">
						Vehicle Suspension Simulator
					</h1>
					<p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
						Explore how different suspension setups affect vehicle stability and
						comfort over various road conditions.
					</p>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
					{}
					<div className="bg-white rounded-xl shadow-md p-4 sm:p-5 order-2 lg:order-1 max-h-[calc(100vh-130px)] overflow-y-auto">
						<Tabs
							tabs={tabs}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>

						{activeTab === "controls" && (
							<div className="space-y-3 sm:space-y-5">
								{}
								<div className="flex justify-between items-center mb-2">
									<Button
										onClick={() => setZoomedViewport(!zoomedViewport)}
										icon={
											zoomedViewport ? (
												<ChevronDown size={18} />
											) : (
												<ChevronUp size={18} />
											)
										}
										small
									>
										{zoomedViewport ? "Zoom Out" : "Zoom In"}
									</Button>

									<div
										className={`px-3 py-1 rounded-full text-white text-sm ${getDampingColor()}`}
									>
										{dampingType}
									</div>
								</div>

								<CollapsibleSection title="Suspension Presets">
									<div className="flex flex-wrap gap-2">
										<Preset
											label="Underdamped"
											description={presets.underdamped.description}
											onClick={() => applyPreset("underdamped")}
											active={currentPreset === "underdamped"}
										/>
										<Preset
											label="Critically Damped"
											description={presets.criticallyDamped.description}
											onClick={() => applyPreset("criticallyDamped")}
											active={currentPreset === "criticallyDamped"}
										/>
										<Preset
											label="Overdamped"
											description={presets.overdamped.description}
											onClick={() => applyPreset("overdamped")}
											active={currentPreset === "overdamped"}
										/>
									</div>

									<div className="flex flex-wrap gap-2 mt-2">
										<Preset
											label="Sports Car"
											description={presets.sportsCar.description}
											onClick={() => applyPreset("sportsCar")}
											active={currentPreset === "sportsCar"}
										/>
										<Preset
											label="Luxury Car"
											description={presets.luxuryCar.description}
											onClick={() => applyPreset("luxuryCar")}
											active={currentPreset === "luxuryCar"}
										/>
										<Preset
											label="Standard"
											description={presets.standard.description}
											onClick={() => applyPreset("standard")}
											active={currentPreset === "standard"}
										/>
									</div>
								</CollapsibleSection>

								<CollapsibleSection title="Vehicle Parameters">
									<Slider
										label="Vehicle Mass"
										value={mass}
										onChange={setMass}
										min={500}
										max={3000}
										step={100}
										unit="kg"
										tooltip="The weight of the vehicle. Heavier vehicles need stiffer springs and more damping."
									/>
									<Slider
										label="Spring Stiffness"
										value={springStiffness}
										onChange={setSpringStiffness}
										min={20000}
										max={120000}
										step={5000}
										unit="N/m"
										tooltip="How stiff the springs are. Stiffer springs provide better handling but harsher ride."
									/>
									<Slider
										label="Damping Coefficient"
										value={dampingCoefficient}
										onChange={setDampingCoefficient}
										min={1000}
										max={30000}
										step={500}
										unit="Ns/m"
										tooltip="How strong the shock absorbers are. Higher values reduce oscillations but may make the ride stiffer."
									/>
								</CollapsibleSection>

								<CollapsibleSection title="Road Parameters">
									<div className="mb-3">
										<label className="text-sm font-medium text-gray-700 mb-1 block">
											Road Profile
										</label>
										<div className="flex flex-wrap gap-2">
											{roadTypes.map((type) => (
												<button
													key={type.id}
													onClick={() => setRoadType(type.id)}
													className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all ${
														roadType === type.id
															? "bg-blue-100 text-blue-700 border border-blue-300"
															: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
													}`}
												>
													{type.label}
												</button>
											))}
										</div>
									</div>
									<Slider
										label="Bump Height"
										value={bumpHeight}
										onChange={setBumpHeight}
										min={0.05}
										max={0.3}
										step={0.01}
										unit="m"
										tooltip="The height of road bumps or amplitude of waves."
									/>
									<Slider
										label="Bump Width/Frequency"
										value={bumpWidth}
										onChange={setBumpWidth}
										min={0.5}
										max={4}
										step={0.1}
										unit="m"
										tooltip="Width of bumps or wavelength of sine patterns. Smaller values create sharper, more frequent bumps."
									/>
									<Slider
										label="Vehicle Speed"
										value={speed}
										onChange={setSpeed}
										min={5}
										max={100}
										step={5}
										unit="km/h"
										tooltip="How fast the vehicle is moving. Higher speeds can amplify suspension effects."
									/>
								</CollapsibleSection>

								{}
								<div className="flex justify-between mt-4">
									<Button
										onClick={() => setIsSimulating(!isSimulating)}
										icon={
											isSimulating ? <Pause size={18} /> : <Play size={18} />
										}
										primary={true}
									>
										{isSimulating ? "Pause" : "Play"}
									</Button>
									<Button
										onClick={resetSimulation}
										icon={<RefreshCw size={18} />}
									>
										Reset
									</Button>
								</div>
							</div>
						)}

						{activeTab === "theory" && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold text-gray-800 mb-2">
									Suspension Theory
								</h3>
								<p className="text-gray-700 text-sm sm:text-base">
									A vehicle suspension system is essentially a
									mass-spring-damper system. The vehicle body (mass) is
									supported by springs, while shock absorbers (dampers) control
									oscillations.
								</p>

								<div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
									<h4 className="font-semibold text-gray-800 mb-2">
										Damping Types Explained
									</h4>
									<ul className="space-y-2 text-sm sm:text-base">
										<li>
											<span className="font-medium text-orange-600">
												Underdamped
											</span>
											: Oscillates before settling. Good for sporty feel but
											less comfortable.
										</li>
										<li>
											<span className="font-medium text-green-600">
												Critically Damped
											</span>
											: Returns to equilibrium in minimal time without
											oscillation. Optimal balance.
										</li>
										<li>
											<span className="font-medium text-blue-600">
												Overdamped
											</span>
											: Returns slowly without oscillation. Provides comfort but
											less responsive.
										</li>
									</ul>
								</div>

								<div className="mt-4">
									<h4 className="font-semibold text-gray-800 mb-2">
										Current Suspension Status
									</h4>
									<div
										className={`p-3 rounded text-white text-center font-medium mb-2 ${getDampingColor()}`}
									>
										{dampingType} (Ratio: {dampingRatio.toFixed(2)})
									</div>
									<p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
										{getDampingStateText()}
									</p>
								</div>

								<div className="mt-4">
									<h4 className="font-semibold text-gray-800 mb-2">
										Key Metrics
									</h4>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-gray-50 p-3 rounded">
											<p className="text-sm text-gray-600">Damping Ratio (ζ)</p>
											<p className="text-lg font-medium text-blue-700">
												{dampingRatio.toFixed(2)}
											</p>
											<p className="text-xs text-gray-500">ζ = c/(2√mk)</p>
										</div>
										<div className="bg-gray-50 p-3 rounded">
											<p className="text-sm text-gray-600">
												Natural Frequency (ωn)
											</p>
											<p className="text-lg font-medium text-blue-700">
												{naturalFrequency.toFixed(2)} rad/s
											</p>
											<p className="text-xs text-gray-500">ωn = √(k/m)</p>
										</div>
										<div className="bg-gray-50 p-3 rounded">
											<p className="text-sm text-gray-600">
												Resonance Frequency
											</p>
											<p className="text-lg font-medium text-blue-700">
												{resonanceFrequency.toFixed(2)} Hz
											</p>
											<p className="text-xs text-gray-500">f = ωd/(2π)</p>
										</div>
										<div className="bg-gray-50 p-3 rounded">
											<p className="text-sm text-gray-600">Return Time</p>
											<p className="text-lg font-medium text-blue-700">
												{(5 / (dampingRatio * naturalFrequency)).toFixed(2)} s
											</p>
											<p className="text-xs text-gray-500">t = 5/(ζωn)</p>
										</div>
									</div>
								</div>

								<div className="bg-gray-50 p-4 rounded mt-4">
									<h4 className="font-semibold text-gray-800 mb-2">
										Tips for a Good Suspension
									</h4>
									<ul className="space-y-1 text-sm text-gray-700">
										<li>
											• Spring stiffness should be proportional to vehicle
											weight
										</li>
										<li>
											• Damping ratio around 0.7 is often ideal for passenger
											cars
										</li>
										<li>
											• Racing vehicles often use underdamped, stiffer setups (ζ
											= 0.3-0.5)
										</li>
										<li>
											• Luxury vehicles use overdamped setups for comfort (ζ =
											1.3-2.0)
										</li>
										<li>
											• Resonance occurs when road input frequency matches
											natural frequency
										</li>
									</ul>
								</div>

								<div className="bg-gray-50 p-4 rounded mt-4">
									<h4 className="font-semibold text-gray-800 mb-2">
										Suspension Equation
									</h4>
									<div className="bg-white p-3 rounded text-center font-medium border border-gray-200">
										m·ẍ + c·ẋ + k·x = F(t)
									</div>
									<div className="text-xs text-gray-600 mt-2">
										Where m = mass, c = damping coefficient, k = spring
										stiffness, x = displacement, and F(t) = external force
									</div>
								</div>
							</div>
						)}

						{activeTab === "settings" && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold text-gray-800 mb-4">
									Simulator Settings
								</h3>

								<div className="mb-4">
									<label className="text-sm font-medium text-gray-700 mb-2 block">
										Detail Level
									</label>
									<div className="flex flex-wrap gap-2">
										<button
											onClick={() => setDetailLevel(1)}
											className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all ${
												detailLevel === 1
													? "bg-blue-100 text-blue-700 border border-blue-300"
													: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
											}`}
										>
											Low
										</button>
										<button
											onClick={() => setDetailLevel(2)}
											className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all ${
												detailLevel === 2
													? "bg-blue-100 text-blue-700 border border-blue-300"
													: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
											}`}
										>
											Medium
										</button>
										<button
											onClick={() => setDetailLevel(3)}
											className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all ${
												detailLevel === 3
													? "bg-blue-100 text-blue-700 border border-blue-300"
													: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
											}`}
										>
											High
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Higher detail levels show more suspension components but may
										affect performance on some devices.
									</p>
								</div>

								<div className="mb-4">
									<label className="text-sm font-medium text-gray-700 mb-2 block">
										View Mode
									</label>
									<div className="flex flex-wrap gap-2">
										<button
											onClick={() => setZoomedViewport(true)}
											className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all ${
												zoomedViewport
													? "bg-blue-100 text-blue-700 border border-blue-300"
													: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
											}`}
										>
											Zoomed (Suspension Focus)
										</button>
										<button
											onClick={() => setZoomedViewport(false)}
											className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all ${
												!zoomedViewport
													? "bg-blue-100 text-blue-700 border border-blue-300"
													: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
											}`}
										>
											Standard (Full View)
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Zoomed view focuses on the suspension system for better
										detail.
									</p>
								</div>

								<div className="mt-6">
									<Button
										onClick={resetSimulation}
										icon={<RefreshCw size={18} />}
										primary={true}
										className="w-full"
									>
										Reset Simulation
									</Button>
								</div>
							</div>
						)}

						{activeTab === "about" && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold text-gray-800 mb-2">
									About This Simulator
								</h3>
								<p className="text-gray-700 text-sm sm:text-base">
									This interactive simulator demonstrates the principles of
									vehicle suspension dynamics using a realistic physics model.
									It helps engineers, students, and enthusiasts understand how
									different suspension parameters affect vehicle behavior.
								</p>

								<div className="bg-gray-50 p-4 rounded">
									<h4 className="font-semibold text-gray-800 mb-2">
										How It Works
									</h4>
									<p className="text-gray-700 text-sm">
										The simulation uses a mass-spring-damper model where the
										equation of motion is:
									</p>
									<div className="bg-blue-100 p-2 rounded my-2 text-center font-medium">
										m·ẍ + c·ẋ + k·x = F(t)
									</div>
									<p className="text-gray-700 text-sm">
										The damping ratio (ζ = c/2√km) determines whether the system
										is underdamped (ζ &lt; 1), critically damped (ζ = 1), or
										overdamped (ζ &gt; 1).
									</p>
								</div>

								<div className="bg-gray-50 p-4 rounded">
									<h4 className="font-semibold text-gray-800 mb-2">
										Applications
									</h4>
									<ul className="space-y-1 text-sm text-gray-700">
										<li>
											• Educational tool for automotive engineering students
										</li>
										<li>• Reference for suspension tuning and design</li>
										<li>
											• Visualizing the effects of different road conditions
										</li>
										<li>
											• Understanding the trade-offs between comfort and
											handling
										</li>
									</ul>
								</div>

								<div className="bg-gray-50 p-4 rounded">
									<h4 className="font-semibold text-gray-800 mb-2">Features</h4>
									<ul className="space-y-1 text-sm text-gray-700">
										<li>
											• Realistic physics simulation of suspension dynamics
										</li>
										<li>
											• Interactive controls for all suspension parameters
										</li>
										<li>
											• Multiple road types to test suspension performance
										</li>
										<li>• Visual feedback on damping characteristics</li>
										<li>• Responsive design that works on all devices</li>
									</ul>
								</div>

								<div className="mt-4">
									<Button
										onClick={() =>
											showToastNotification(
												"Contact feature coming soon!",
												"info"
											)
										}
										primary={true}
									>
										Contact Us
									</Button>
								</div>
							</div>
						)}
					</div>

					{}
					<div className="col-span-1 lg:col-span-2 order-1 lg:order-2">
						<div className="bg-white rounded-xl shadow-lg overflow-hidden">
							<canvas
								ref={canvasRef}
								width={800}
								height={500}
								className="w-full h-[350px] sm:h-[450px] md:h-[500px] bg-gray-50"
							/>

							{}
							<div className="bg-gray-800 text-white p-2 sm:p-4">
								<div className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm">
									<div className="flex items-center space-x-1 sm:space-x-2">
										<div className="bg-blue-500 h-2 w-2 sm:h-3 sm:w-3 rounded-full"></div>
										<span>Vehicle Body</span>
									</div>
									<div className="flex items-center space-x-1 sm:space-x-2">
										<div
											className={`${
												dampingType === "Underdamped"
													? "bg-orange-500"
													: dampingType === "Critically Damped"
													? "bg-green-500"
													: "bg-blue-500"
											} h-2 w-2 sm:h-3 sm:w-3 rounded-full`}
										></div>
										<span>Springs/Dampers</span>
									</div>
									<div className="flex items-center space-x-1 sm:space-x-2">
										<div className="bg-gray-500 h-2 w-2 sm:h-3 sm:w-3 rounded-full"></div>
										<span>Wheels</span>
									</div>
									<div>
										<span className="font-medium">Type: </span>
										<span
											className={
												dampingType === "Underdamped"
													? "text-orange-300"
													: dampingType === "Critically Damped"
													? "text-green-300"
													: "text-blue-300"
											}
										>
											{dampingType}
										</span>
									</div>
								</div>
							</div>
						</div>

						{}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-6">
							<div className="bg-white rounded-lg shadow p-2 sm:p-4 text-center">
								<p className="text-xs sm:text-sm text-gray-500">
									Spring Stiffness
								</p>
								<p className="text-lg sm:text-2xl font-bold text-blue-600">
									{(springStiffness / 1000).toFixed(0)}{" "}
									<span className="text-xs sm:text-sm">kN/m</span>
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-2 sm:p-4 text-center">
								<p className="text-xs sm:text-sm text-gray-500">Damping</p>
								<p className="text-lg sm:text-2xl font-bold text-blue-600">
									{(dampingCoefficient / 1000).toFixed(1)}{" "}
									<span className="text-xs sm:text-sm">kNs/m</span>
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-2 sm:p-4 text-center">
								<p className="text-xs sm:text-sm text-gray-500">
									Damping Ratio
								</p>
								<p className="text-lg sm:text-2xl font-bold text-blue-600">
									{dampingRatio.toFixed(2)}
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-2 sm:p-4 text-center">
								<p className="text-xs sm:text-sm text-gray-500">Speed</p>
								<p className="text-lg sm:text-2xl font-bold text-blue-600">
									{speed} <span className="text-xs sm:text-sm">km/h</span>
								</p>
							</div>
						</div>
					</div>
				</div>

				{}
				<footer className="mt-6 sm:mt-12 text-center text-gray-600 text-xs sm:text-sm">
					<p>Vehicle Suspension Simulator • Interactive Educational Tool</p>
					<div className="mt-2 flex justify-center space-x-4">
						<button
							onClick={() =>
								showToastNotification("Terms of Service coming soon!", "info")
							}
							className="text-blue-600 hover:underline cursor-pointer"
						>
							Terms
						</button>
						<button
							onClick={() =>
								showToastNotification("Privacy Policy coming soon!", "info")
							}
							className="text-blue-600 hover:underline cursor-pointer"
						>
							Privacy
						</button>
						<button
							onClick={() =>
								showToastNotification("Contact page coming soon!", "info")
							}
							className="text-blue-600 hover:underline cursor-pointer"
						>
							Contact
						</button>
					</div>
				</footer>
			</div>

			{}
			<Toast message={toastMessage} isVisible={showToast} type={toastType} />
		</div>
	);
};

export default SuspensionSimulator;
