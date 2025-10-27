"use client";
import React, { useEffect, useState } from "react";
import {
	FaSearch,
	FaBolt,
	FaWrench,
	FaBuilding,
	FaStar,
	FaBox,
	FaCog,
} from "react-icons/fa";
import { FiShield, FiTrendingUp, FiActivity } from "react-icons/fi";

type ResourceType = "gold" | "coal" | "emerald" | "rock" | "empty";
type Obstacle = "gas" | "cavein" | "none";
type DrillLevel = "basic" | "advanced" | "master" | "quantum" | "plasma";
type SpecialUpgrade =
	| "scanner"
	| "shield"
	| "amplifier"
	| "excavator"
	| "stabilizer";
type Cell = {
	type: ResourceType;
	obstacle: Obstacle;
	revealed: boolean;
	drill: boolean;
};

const WIDTH = 12;
const HEIGHT = 8;
const MAX_THREAT = 20;
const MAX_HAMMERS = 30;
const WIN_RESOURCES = 12;

const icons: Record<ResourceType | Obstacle | "drill", string> = {
	gold: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#FFA500" stroke-width="2"/><path d="M12 5L14 9H10L12 5Z" fill="#FFFF00"/><circle cx="12" cy="12" r="3" fill="#FFA500"/></svg>`,
	coal: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="14" height="14" rx="3" fill="#2C3E50" stroke="#1A252F" stroke-width="2"/><circle cx="10" cy="10" r="1" fill="#34495E"/><circle cx="14" cy="14" r="1" fill="#34495E"/></svg>`,
	emerald: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,3 18,9 12,21 6,9" fill="#00D084" stroke="#00A86B" stroke-width="2"/><polygon points="12,6 15,10 12,18 9,10" fill="#00FF9F"/></svg>`,
	rock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5L9 3L18 8L16 18L7 16L5 5Z" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="2"/><circle cx="10" cy="8" r="1" fill="#95A5A6"/><circle cx="14" cy="12" r="1" fill="#95A5A6"/></svg>`,
	empty: "",
	gas: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="rgba(52, 152, 219, 0.2)" stroke="#3498DB" stroke-width="2" stroke-dasharray="2,2"/><circle cx="12" cy="12" r="4" fill="#3498DB" opacity="0.6"/><circle cx="12" cy="12" r="2" fill="#85C1E9"/></svg>`,
	cavein: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12L7 8L12 14L16 10L20 12L18 16L6 16Z" fill="#8B4513" stroke="#654321" stroke-width="2"/><path d="M8 10L10 12L12 10L14 12L16 10" stroke="#A0522D" stroke-width="1"/></svg>`,
	drill: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="#E8F4FD" stroke="#2196F3" stroke-width="2"/><path d="M12 4V20M4 12H20" stroke="#1976D2" stroke-width="3" stroke-linecap="round"/></svg>`,
	none: "",
};

const upgradeTiers: Record<
	DrillLevel,
	{
		cost: Record<string, number>;
		vision: number;
		rockCost: number;
		obstacleSafe: boolean;
		unlockLevel: number;
		description: string;
	}
> = {
	basic: {
		cost: {},
		vision: 2,
		rockCost: 3,
		obstacleSafe: false,
		unlockLevel: 0,
		description: "Standard mining equipment for basic operations",
	},
	advanced: {
		cost: { gold: 2, coal: 2 },
		vision: 3,
		rockCost: 2,
		obstacleSafe: false,
		unlockLevel: 3,
		description: "Enhanced drilling with improved efficiency",
	},
	master: {
		cost: { gold: 3, emerald: 3 },
		vision: 4,
		rockCost: 1,
		obstacleSafe: true,
		unlockLevel: 6,
		description: "Professional-grade equipment with safety protocols",
	},
	quantum: {
		cost: { gold: 5, emerald: 4, coal: 3 },
		vision: 5,
		rockCost: 1,
		obstacleSafe: true,
		unlockLevel: 9,
		description: "Quantum-enhanced drilling with matter manipulation",
	},
	plasma: {
		cost: { gold: 8, emerald: 6, coal: 5 },
		vision: 6,
		rockCost: 0,
		obstacleSafe: true,
		unlockLevel: 12,
		description: "Plasma-based extraction with zero resistance drilling",
	},
};

const specialUpgrades: Record<
	SpecialUpgrade,
	{
		cost: Record<string, number>;
		duration: number;
		effect: string;
		icon: React.ComponentType<any>;
		unlockLevel: number;
	}
> = {
	scanner: {
		cost: { gold: 1, coal: 1 },
		duration: 5,
		effect: "Reveals all resources in vision range",
		icon: FaSearch,
		unlockLevel: 2,
	},
	shield: {
		cost: { emerald: 2, coal: 1 },
		duration: 3,
		effect: "Immune to all obstacle damage",
		icon: FiShield,
		unlockLevel: 4,
	},
	amplifier: {
		cost: { gold: 2, emerald: 1 },
		duration: 4,
		effect: "Double resource extraction rate",
		icon: FaBolt,
		unlockLevel: 5,
	},
	excavator: {
		cost: { gold: 3, coal: 2 },
		duration: 6,
		effect: "Zero hammer cost for all operations",
		icon: FaWrench,
		unlockLevel: 7,
	},
	stabilizer: {
		cost: { emerald: 3, gold: 2 },
		duration: 5,
		effect: "Prevents all threat level increases",
		icon: FaBuilding,
		unlockLevel: 8,
	},
};

function getRandomType(): ResourceType {
	const r = Math.random();
	if (r < 0.13) return "gold";
	if (r < 0.23) return "emerald";
	if (r < 0.4) return "coal";
	if (r < 0.85) return "rock";
	return "empty";
}

function getRandomObstacle(): Obstacle {
	const r = Math.random();
	if (r < 0.08) return "gas";
	if (r < 0.13) return "cavein";
	return "none";
}

export default function DrillingExport() {
	const [grid, setGrid] = useState<Cell[][]>([]);
	const [inventory, setInventory] = useState<Record<string, number>>({});
	const [threat, setThreat] = useState<number>(0);
	const [hammers, setHammers] = useState<number>(MAX_HAMMERS);
	const [player, setPlayer] = useState<{ x: number; y: number }>({
		x: Math.floor(WIDTH / 2),
		y: 0,
	});
	const [selected, setSelected] = useState<{ x: number; y: number } | null>(
		null
	);
	const [intro, setIntro] = useState(true);
	const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);
	const [gameOverReason, setGameOverReason] = useState<string>("");
	const [notification, setNotification] = useState<string | null>(null);
	const [drillLevel, setDrillLevel] = useState<DrillLevel>("basic");
	const [previewUpgrade, setPreviewUpgrade] = useState<DrillLevel | null>(null);
	const [activeSpecialUpgrades, setActiveSpecialUpgrades] = useState<
		Record<SpecialUpgrade, number>
	>({} as Record<SpecialUpgrade, number>);
	const [equipmentHealth, setEquipmentHealth] = useState<number>(100);
	const [researchPoints, setResearchPoints] = useState<number>(0);
	const [operationsCount, setOperationsCount] = useState<number>(0);

	useEffect(() => {
		if (intro || selected || previewUpgrade || gameOver) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [intro, selected, previewUpgrade, gameOver]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href =
				"https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap";
			document.head.appendChild(link);
		}
	}, []);

	useEffect(() => {
		const init: Cell[][] = [];
		for (let y = 0; y < HEIGHT; y++) {
			const row: Cell[] = [];
			for (let x = 0; x < WIDTH; x++) {
				row.push({
					type: getRandomType(),
					obstacle: getRandomObstacle(),
					revealed: y < 2,
					drill: false,
				});
			}
			init.push(row);
		}
		setGrid(init);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveSpecialUpgrades((prev) => {
				const updated = { ...prev };
				Object.keys(updated).forEach((key) => {
					const upgrade = key as SpecialUpgrade;
					if (updated[upgrade] > 0) {
						updated[upgrade]--;
						if (updated[upgrade] === 0) {
							delete updated[upgrade];
							setNotification(
								`${specialUpgrades[upgrade].effect} effect expired`
							);
							setTimeout(() => setNotification(null), 2000);
						}
					}
				});
				return updated;
			});
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (gameOver) return;
		const collected = Object.values(inventory).reduce(
			(sum, v) => sum + (v || 0),
			0
		);
		if (collected >= WIN_RESOURCES) {
			setGameOver("win");
		} else if (threat >= MAX_THREAT) {
			setGameOver("lose");
			setGameOverReason(
				"Critical threat level reached! Operations suspended for safety."
			);
		} else if (hammers <= 0) {
			setGameOver("lose");
			setGameOverReason("Drilling equipment exhausted! Mission incomplete.");
		} else if (equipmentHealth <= 0) {
			setGameOver("lose");
			setGameOverReason("Equipment failure! All systems offline.");
		}
	}, [inventory, threat, hammers, gameOver, equipmentHealth]);

	function drill(x: number, y: number) {
		if (selected || grid[y][x].drill || gameOver) return;
		const currentUpgrade = upgradeTiers[drillLevel];
		const freeExcavation = activeSpecialUpgrades.excavator > 0;
		if (
			grid[y][x].type === "rock" &&
			currentUpgrade.rockCost > hammers &&
			!freeExcavation
		) {
			setNotification(
				`Insufficient drilling capacity for rock extraction (${currentUpgrade.rockCost} units required)`
			);
			setTimeout(() => setNotification(null), 3000);
			return;
		}
		setSelected({ x, y });
	}

	function confirmDrill() {
		if (!selected || gameOver) return;
		const { x, y } = selected;
		const newGrid = [...grid];
		const cell = newGrid[y][x];
		const currentUpgrade = upgradeTiers[drillLevel];
		cell.drill = true;
		cell.revealed = true;

		const inv = { ...inventory };
		const freeExcavation = activeSpecialUpgrades.excavator > 0;
		const doubleAmount = activeSpecialUpgrades.amplifier > 0;
		let hammerCost = freeExcavation ? 0 : 1;

		if (cell.type !== "rock" && cell.type !== "empty") {
			const resourceAmount = doubleAmount ? 2 : 1;
			inv[cell.type] = (inv[cell.type] || 0) + resourceAmount;
			setNotification(
				`Resource acquired: ${resourceAmount}x ${cell.type.toUpperCase()}${
					doubleAmount ? " (AMPLIFIED)" : ""
				}`
			);
		} else if (cell.type === "rock") {
			hammerCost = freeExcavation ? 0 : currentUpgrade.rockCost;
			setNotification(
				`Rock formation cleared | Equipment usage: ${hammerCost} units${
					freeExcavation ? " (FREE)" : ""
				}`
			);
		} else {
			setNotification("Excavation complete - No resources detected");
		}

		setResearchPoints((prev) => prev + 1);
		setOperationsCount((prev) => prev + 1);

		let threatIncrease = 0;
		const shielded = activeSpecialUpgrades.shield > 0;
		const stabilized = activeSpecialUpgrades.stabilizer > 0;

		if (cell.obstacle === "gas" && !currentUpgrade.obstacleSafe && !shielded) {
			threatIncrease = stabilized ? 0 : 2;
			setNotification((prev) =>
				prev
					? `${prev} | ${
							shielded
								? "SHIELDED"
								: stabilized
								? "STABILIZED"
								: "ALERT: Gas pocket breached!"
					  }`
					: `${
							shielded
								? "SHIELDED"
								: stabilized
								? "STABILIZED"
								: "ALERT: Gas pocket breached!"
					  }`
			);
		}
		if (
			cell.obstacle === "cavein" &&
			!currentUpgrade.obstacleSafe &&
			!shielded
		) {
			threatIncrease = stabilized ? 0 : 3;
			setNotification((prev) =>
				prev
					? `${prev} | ${
							shielded
								? "SHIELDED"
								: stabilized
								? "STABILIZED"
								: "WARNING: Structural instability detected!"
					  }`
					: `${
							shielded
								? "SHIELDED"
								: stabilized
								? "STABILIZED"
								: "WARNING: Structural instability detected!"
					  }`
			);
		}

		if (threatIncrease > 0) {
			setThreat((t) => t + threatIncrease);
		}

		if (!freeExcavation) {
			setEquipmentHealth((prev) =>
				Math.max(0, prev - (cell.type === "rock" ? 3 : 1))
			);
		}

		setGrid(newGrid);
		setInventory(inv);
		setHammers((h) => h - hammerCost);
		setPlayer({ x, y });
		setSelected(null);

		setTimeout(() => setNotification(null), 4000);
	}

	function canAffordUpgrade(tier: DrillLevel): boolean {
		const cost = upgradeTiers[tier].cost;
		const collected = Object.values(inventory).reduce((sum, v) => sum + v, 0);
		return (
			Object.entries(cost).every(
				([resource, amount]) => (inventory[resource] || 0) >= amount
			) && collected >= upgradeTiers[tier].unlockLevel
		);
	}

	function canAffordSpecialUpgrade(upgrade: SpecialUpgrade): boolean {
		const cost = specialUpgrades[upgrade].cost;
		const collected = Object.values(inventory).reduce((sum, v) => sum + v, 0);
		return (
			Object.entries(cost).every(
				([resource, amount]) => (inventory[resource] || 0) >= amount
			) &&
			collected >= specialUpgrades[upgrade].unlockLevel &&
			!(upgrade in activeSpecialUpgrades)
		);
	}

	function purchaseUpgrade(tier: DrillLevel) {
		if (!canAffordUpgrade(tier)) {
			setNotification("Insufficient resources for equipment upgrade");
			setTimeout(() => setNotification(null), 3000);
			return;
		}
		const cost = upgradeTiers[tier].cost;
		const newInventory = { ...inventory };
		Object.entries(cost).forEach(([resource, amount]) => {
			newInventory[resource] = (newInventory[resource] || 0) - amount;
		});
		setInventory(newInventory);
		setDrillLevel(tier);
		setPreviewUpgrade(null);
		setEquipmentHealth(100);
		setNotification(
			`Equipment upgraded to ${
				tier.charAt(0).toUpperCase() + tier.slice(1)
			} Class Drilling System`
		);
		setTimeout(() => setNotification(null), 3000);
	}

	function purchaseSpecialUpgrade(upgrade: SpecialUpgrade) {
		if (!canAffordSpecialUpgrade(upgrade)) {
			setNotification("Cannot activate special upgrade");
			setTimeout(() => setNotification(null), 3000);
			return;
		}
		const cost = specialUpgrades[upgrade].cost;
		const newInventory = { ...inventory };
		Object.entries(cost).forEach(([resource, amount]) => {
			newInventory[resource] = (newInventory[resource] || 0) - amount;
		});
		setInventory(newInventory);
		setActiveSpecialUpgrades((prev) => ({
			...prev,
			[upgrade]: specialUpgrades[upgrade].duration,
		}));
		setNotification(
			`${specialUpgrades[upgrade].effect} activated for ${specialUpgrades[upgrade].duration} operations`
		);
		setTimeout(() => setNotification(null), 3000);
	}

	function repairEquipment() {
		const cost = Math.ceil((100 - equipmentHealth) / 10);
		if ((inventory.coal || 0) < cost) {
			setNotification(`Insufficient coal for repairs (${cost} required)`);
			setTimeout(() => setNotification(null), 3000);
			return;
		}
		const newInventory = { ...inventory };
		newInventory.coal = (newInventory.coal || 0) - cost;
		setInventory(newInventory);
		setEquipmentHealth(100);
		setNotification(`Equipment fully repaired using ${cost} coal`);
		setTimeout(() => setNotification(null), 3000);
	}

	function handleGameOverReset() {
		setGrid([]);
		setInventory({});
		setThreat(0);
		setHammers(MAX_HAMMERS);
		setPlayer({ x: Math.floor(WIDTH / 2), y: 0 });
		setSelected(null);
		setGameOver(null);
		setGameOverReason("");
		setNotification(null);
		setDrillLevel("basic");
		setPreviewUpgrade(null);
		setActiveSpecialUpgrades({} as Record<SpecialUpgrade, number>);
		setEquipmentHealth(100);
		setResearchPoints(0);
		setOperationsCount(0);

		const init: Cell[][] = [];
		for (let y = 0; y < HEIGHT; y++) {
			const row: Cell[] = [];
			for (let x = 0; x < WIDTH; x++) {
				row.push({
					type: getRandomType(),
					obstacle: getRandomObstacle(),
					revealed: y < 2,
					drill: false,
				});
			}
			init.push(row);
		}
		setGrid(init);
	}

	function handleModalClose(e: React.MouseEvent, closeModal: () => void) {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	}

	const totalResources = Object.values(inventory).reduce(
		(sum, v) => sum + v,
		0
	);
	const threatPercentage = (threat / MAX_THREAT) * 100;
	const hammerPercentage = (hammers / MAX_HAMMERS) * 100;
	const healthPercentage = equipmentHealth;
	const currentVision =
		upgradeTiers[drillLevel].vision +
		(activeSpecialUpgrades.scanner > 0 ? 2 : 0);

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white w-full"
			style={{
				fontFamily: "'Poppins', sans-serif",
			}}
		>
			<style jsx>{`
				.cursor-pointer {
					cursor: pointer;
				}

				button {
					cursor: pointer;
				}

				.clickable-cell {
					cursor: pointer;
				}

				.clickable-cell:hover {
					cursor: pointer;
				}

				.upgrade-card:hover {
					cursor: pointer;
				}

				.interactive:hover {
					cursor: pointer;
				}

				.scrollbar-thin::-webkit-scrollbar {
					width: 4px;
				}

				.scrollbar-thin::-webkit-scrollbar-track {
					background: #475569;
					border-radius: 2px;
				}

				.scrollbar-thin::-webkit-scrollbar-thumb {
					background: #64748b;
					border-radius: 2px;
				}

				.scrollbar-thin::-webkit-scrollbar-thumb:hover {
					background: #94a3b8;
				}

				.excavation-shaft {
					perspective: 2000px;
					perspective-origin: center top;
				}

				.mining-layers-container {
					position: relative;
					transform-style: preserve-3d;
					transform: rotateX(60deg) rotateY(0deg);
				}

				.mining-layer {
					transform-style: preserve-3d;
					position: relative;
				}

				.layer-background {
					position: absolute;
					top: -25px;
					left: -20px;
					right: -20px;
					bottom: -25px;
					border-radius: 12px;
					z-index: -1;
				}

				.mining-cell-3d {
					transform-style: preserve-3d;
					position: relative;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.mining-cell-3d::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(
						145deg,
						rgba(255, 255, 255, 0.1) 0%,
						rgba(255, 255, 255, 0.05) 40%,
						rgba(0, 0, 0, 0.1) 100%
					);
					border-radius: inherit;
					pointer-events: none;
					z-index: 1;
				}

				.mining-cell-3d::after {
					content: "";
					position: absolute;
					top: 100%;
					left: 5%;
					right: 5%;
					height: 8px;
					background: linear-gradient(
						to bottom,
						rgba(0, 0, 0, 0.4),
						transparent
					);
					border-radius: 0 0 8px 8px;
					transform: translateZ(-1px);
					pointer-events: none;
					z-index: -1;
				}

				.cell-walls {
					position: absolute;
					inset: 0;
					pointer-events: none;
					z-index: 0;
				}

				.cell-wall-left {
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					width: 4px;
					background: linear-gradient(
						to right,
						rgba(0, 0, 0, 0.3),
						transparent
					);
					transform: rotateY(-90deg) translateZ(2px);
				}

				.cell-wall-right {
					position: absolute;
					right: 0;
					top: 0;
					bottom: 0;
					width: 4px;
					background: linear-gradient(to left, rgba(0, 0, 0, 0.3), transparent);
					transform: rotateY(90deg) translateZ(2px);
				}

				.cell-wall-bottom {
					position: absolute;
					left: 0;
					right: 0;
					bottom: 0;
					height: 4px;
					background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
					transform: rotateX(90deg) translateZ(2px);
				}

				.shaft-walls {
					position: absolute;
					inset: 0;
					pointer-events: none;
					z-index: -2;
				}

				.shaft-wall-left {
					position: absolute;
					left: -30px;
					top: 0;
					bottom: 0;
					width: 30px;
					background: linear-gradient(to right, #1a1a1a, #2d2d2d, transparent);
					transform: rotateY(15deg);
					border-radius: 0 8px 8px 0;
				}

				.shaft-wall-right {
					position: absolute;
					right: -30px;
					top: 0;
					bottom: 0;
					width: 30px;
					background: linear-gradient(to left, #1a1a1a, #2d2d2d, transparent);
					transform: rotateY(-15deg);
					border-radius: 8px 0 0 8px;
				}

				.excavation-glow {
					position: absolute;
					inset: -20px;
					background: radial-gradient(
						ellipse at center,
						rgba(59, 130, 246, 0.1) 0%,
						rgba(59, 130, 246, 0.05) 30%,
						transparent 70%
					);
					border-radius: 20px;
					pointer-events: none;
					z-index: -3;
				}

				.player-indicator {
					position: absolute;
					top: -8px;
					right: -8px;
					width: 16px;
					height: 16px;
					background: radial-gradient(circle, #3b82f6, #1e40af);
					border: 2px solid white;
					border-radius: 50%;
					box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
					animation: pulse-glow 2s infinite;
					z-index: 10;
				}

				@keyframes pulse-glow {
					0%,
					100% {
						box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
						transform: scale(1);
					}
					50% {
						box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
						transform: scale(1.1);
					}
				}

				.scanner-overlay {
					position: absolute;
					inset: 0;
					background: linear-gradient(
							45deg,
							transparent 30%,
							rgba(6, 182, 212, 0.2) 50%,
							transparent 70%
						),
						radial-gradient(
							circle at center,
							rgba(6, 182, 212, 0.15),
							transparent 60%
						);
					border: 1px solid rgba(6, 182, 212, 0.4);
					border-radius: inherit;
					z-index: 5;
					animation: scanner-sweep 3s infinite;
				}

				@keyframes scanner-sweep {
					0%,
					100% {
						opacity: 0.3;
					}
					50% {
						opacity: 0.7;
					}
				}

				.depth-layer-0 {
					transform: translateZ(40px);
					filter: brightness(1.2) contrast(1.1);
				}
				.depth-layer-1 {
					transform: translateZ(30px);
					filter: brightness(1.1) contrast(1.05);
				}
				.depth-layer-2 {
					transform: translateZ(20px);
					filter: brightness(1);
				}
				.depth-layer-3 {
					transform: translateZ(10px);
					filter: brightness(0.95);
				}
				.depth-layer-4 {
					transform: translateZ(0px);
					filter: brightness(0.9);
				}
				.depth-layer-5 {
					transform: translateZ(-10px);
					filter: brightness(0.85) contrast(0.95);
				}
				.depth-layer-6 {
					transform: translateZ(-20px);
					filter: brightness(0.8) contrast(0.9);
				}
				.depth-layer-7 {
					transform: translateZ(-30px);
					filter: brightness(0.75) contrast(0.85);
				}

				.soil-layer-0 {
					background: linear-gradient(135deg, #8b7355, #a0522d);
				}
				.soil-layer-1 {
					background: linear-gradient(135deg, #8b7355, #a0522d, #8b4513);
				}
				.soil-layer-2 {
					background: linear-gradient(135deg, #a0522d, #8b4513, #654321);
				}
				.soil-layer-3 {
					background: linear-gradient(135deg, #8b4513, #654321, #5d4e37);
				}
				.soil-layer-4 {
					background: linear-gradient(135deg, #654321, #5d4e37, #4a4a4a);
				}
				.soil-layer-5 {
					background: linear-gradient(135deg, #5d4e37, #4a4a4a, #3c3c3c);
				}
				.soil-layer-6 {
					background: linear-gradient(135deg, #4a4a4a, #3c3c3c, #2f2f2f);
				}
				.soil-layer-7 {
					background: linear-gradient(135deg, #3c3c3c, #2f2f2f, #1a1a1a);
				}

				@media (max-width: 1536px) {
					.mining-grid {
						grid-template-columns: repeat(12, 3rem);
					}
					.mining-cell-3d {
						width: 3rem;
						height: 3rem;
					}
				}

				@media (max-width: 1280px) {
					.mining-grid {
						grid-template-columns: repeat(12, 2.75rem);
					}
					.mining-cell-3d {
						width: 2.75rem;
						height: 2.75rem;
					}
				}

				@media (max-width: 1024px) {
					.mining-grid {
						grid-template-columns: repeat(12, 2.5rem);
					}
					.mining-cell-3d {
						width: 2.5rem;
						height: 2.5rem;
					}
				}
			`}</style>

			<header className="bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700 shadow-xl">
				<div className="w-full px-4 sm:px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
									<path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
								</svg>
							</div>
							<div>
								<h1 className="text-xl sm:text-2xl font-bold">
									Deep Diggers Mining Corp.
								</h1>
								<p className="text-blue-200 text-sm">
									Advanced Resource Extraction Operations
								</p>
							</div>
						</div>
						<div className="text-right">
							<div className="text-sm text-blue-200">Current Drill Level</div>
							<div className="text-lg font-semibold capitalize">
								{drillLevel} Class
							</div>
						</div>
					</div>
				</div>
			</header>

			{intro && (
				<div
					className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
					onClick={(e) => handleModalClose(e, () => setIntro(false))}
				>
					<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full mx-4 border border-slate-700">
						<div className="text-center">
							<div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg width="40" height="40" viewBox="0 0 24 24" fill="white">
									<path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
								</svg>
							</div>
							<h1 className="text-2xl sm:text-3xl font-bold mb-4">
								Deep Diggers Mining Operations
							</h1>
							<p className="mb-8 text-slate-300 leading-relaxed text-sm sm:text-base">
								Welcome to our advanced underground resource extraction
								facility. Navigate through subterranean layers, extract valuable
								minerals, and manage operational risks. You have {MAX_HAMMERS}{" "}
								drilling operations to gather {WIN_RESOURCES} resource units for
								mission success.
							</p>
							<button
								onClick={() => setIntro(false)}
								className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold px-8 py-4 rounded-lg transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
							>
								Initiate Mining Operations
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="w-full p-3 sm:p-4 lg:p-6 pb-32">
				<div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
					{}
					<div className="flex-1 min-w-0">
						<div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-4 sm:p-6 lg:p-8 h-fit">
							<h2 className="text-xl sm:text-2xl font-bold mb-6 lg:mb-10 text-center flex items-center justify-center gap-3">
								<FaStar className="w-5 h-5 sm:w-6 sm:h-6" />
								Underground Excavation Shaft
							</h2>

							<div className="excavation-shaft flex justify-center mb-6 lg:mb-8">
								<div className="relative">
									<div className="excavation-glow"></div>

									<div className="shaft-walls">
										<div className="shaft-wall-left"></div>
										<div className="shaft-wall-right"></div>
									</div>

									<div className="mining-layers-container">
										{grid.map((row, y) => (
											<div
												key={y}
												className={`mining-layer depth-layer-${y} grid gap-1 p-2 sm:p-4 relative mining-grid`}
												style={{
													gridTemplateColumns: `repeat(${WIDTH}, 3.5rem)`,
													transform: `translateZ(${
														(HEIGHT - y - 1) * 16
													}px) scale(${1 - y * 0.05})`,
													marginBottom: y < HEIGHT - 1 ? "-5px" : "0",
												}}
											>
												<div
													className={`layer-background soil-layer-${y}`}
												></div>

												{row.map((cell, x) => {
													const visible =
														Math.abs(x - player.x) <= currentVision &&
														Math.abs(y - player.y) <= currentVision;
													const scannerRevealed =
														activeSpecialUpgrades.scanner > 0 && visible;
													const isEmptyRevealed =
														cell.revealed && cell.type === "empty";
													const isPlayerPosition =
														player.x === x && player.y === y;

													return (
														<div
															key={`${x}-${y}`}
															className={`
                                w-14 h-14 flex items-center justify-center rounded-lg border-2 relative mining-cell-3d
                                ${
																	visible
																		? "border-slate-400 bg-gradient-to-br from-slate-600 to-slate-700 cursor-pointer"
																		: "border-slate-800 bg-slate-900"
																}
                                ${
																	cell.drill
																		? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600"
																		: ""
																}
                                ${
																	isEmptyRevealed
																		? "bg-gradient-to-br from-slate-700 to-slate-800"
																		: ""
																}
                                ${
																	visible && !cell.drill
																		? "hover:scale-110 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/30 clickable-cell"
																		: ""
																}
                              `}
															onClick={() => visible && drill(x, y)}
															style={{
																boxShadow: visible
																	? "0 8px 16px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)"
																	: "0 4px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.05)",
																filter: `brightness(${1 - y * 0.08})`,
															}}
														>
															<div className="cell-walls">
																<div className="cell-wall-left"></div>
																<div className="cell-wall-right"></div>
																<div className="cell-wall-bottom"></div>
															</div>

															{(cell.revealed || scannerRevealed) && (
																<div className="relative z-10">
																	{cell.type !== "empty" && (
																		<div
																			className="icon-container"
																			dangerouslySetInnerHTML={{
																				__html: icons[cell.type],
																			}}
																			style={{
																				filter:
																					"drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
																				transform: "translateZ(2px)",
																			}}
																		/>
																	)}
																	{cell.obstacle !== "none" && (
																		<div
																			className="icon-container absolute top-0 left-0"
																			dangerouslySetInnerHTML={{
																				__html: icons[cell.obstacle],
																			}}
																			style={{
																				filter:
																					"drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
																				transform: "translateZ(3px)",
																			}}
																		/>
																	)}
																</div>
															)}

															{scannerRevealed && !cell.revealed && (
																<div className="scanner-overlay"></div>
															)}

															{isPlayerPosition && (
																<div className="player-indicator"></div>
															)}
														</div>
													);
												})}
											</div>
										))}
									</div>
								</div>
							</div>

							<div className="text-center text-slate-400 text-sm">
								Current Depth: {player.y + 1} meters underground | Vision Range:{" "}
								{currentVision} units
							</div>
						</div>
					</div>

					{}
					<div className="xl:w-80 2xl:w-96 flex-shrink-0 space-y-4 lg:space-y-6">
						{}
						<div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-4 flex flex-col">
							<h2 className="text-sm font-bold mb-4 flex items-center gap-3">
								<FaBox className="w-5 h-5" />
								Resource Inventory
							</h2>
							<div
								className="overflow-y-auto scrollbar-thin pr-1 flex-1"
								style={{ maxHeight: "300px" }}
							>
								<div className="space-y-3">
									{Object.entries(inventory).length === 0 ? (
										<div className="text-slate-400 text-center py-4 border border-slate-600 rounded-lg bg-slate-700/50">
											No resources extracted
										</div>
									) : (
										Object.entries(inventory).map(([k, v]) => (
											<div
												key={k}
												className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600"
											>
												<div className="flex items-center gap-3">
													<div
														className="icon-container"
														dangerouslySetInnerHTML={{
															__html: icons[k as keyof typeof icons],
														}}
													/>
													<span className="capitalize font-medium">{k}</span>
												</div>
												<span className="font-bold text-lg">{v}</span>
											</div>
										))
									)}
								</div>
								<div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700">
									<h3 className="font-semibold mb-2 text-blue-200">
										Mission Objective
									</h3>
									<div className="flex justify-between items-center">
										<span className="text-sm text-slate-300">Progress</span>
										<span className="font-bold">
											{totalResources}/{WIN_RESOURCES}
										</span>
									</div>
									<div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
										<div
											className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
											style={{
												width: `${Math.min(
													(totalResources / WIN_RESOURCES) * 100,
													100
												)}%`,
											}}
										/>
									</div>
								</div>
								<div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-700">
									<div className="flex justify-between items-center">
										<span className="text-sm text-purple-200">
											Research Points
										</span>
										<span className="font-bold text-purple-200">
											{researchPoints}
										</span>
									</div>
								</div>
							</div>
						</div>

						{}
						<div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-4 flex flex-col">
							<h2 className="text-sm font-bold mb-4 flex items-center gap-3">
								<FaCog className="w-5 h-5" />
								Equipment Management
							</h2>

							<div
								className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1"
								style={{ maxHeight: "600px" }}
							>
								<div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
									<div className="flex justify-between items-center mb-2">
										<h4 className="font-semibold">Equipment Health</h4>
										<span className="text-sm">{equipmentHealth}%</span>
									</div>
									<div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
										<div
											className={`h-2 transition-all duration-500 rounded-full ${
												healthPercentage > 70
													? "bg-gradient-to-r from-green-500 to-green-400"
													: healthPercentage > 30
													? "bg-gradient-to-r from-yellow-500 to-yellow-400"
													: "bg-gradient-to-r from-red-500 to-red-400"
											}`}
											style={{ width: `${healthPercentage}%` }}
										/>
									</div>
									{equipmentHealth < 100 && (
										<button
											onClick={repairEquipment}
											className={`mt-2 w-full px-3 py-1 rounded text-sm transition-all duration-200 ${
												(inventory.coal || 0) >=
												Math.ceil((100 - equipmentHealth) / 10)
													? "bg-green-600 hover:bg-green-700 cursor-pointer"
													: "bg-slate-600 cursor-not-allowed"
											}`}
											disabled={
												(inventory.coal || 0) <
												Math.ceil((100 - equipmentHealth) / 10)
											}
										>
											Repair ({Math.ceil((100 - equipmentHealth) / 10)} coal)
										</button>
									)}
								</div>

								{Object.keys(activeSpecialUpgrades).length > 0 && (
									<div className="p-4 bg-green-900/20 rounded-lg border border-green-700">
										<h4 className="font-semibold mb-2 text-green-200">
											Active Enhancements
										</h4>
										<div className="space-y-2">
											{Object.entries(activeSpecialUpgrades).map(
												([upgrade, duration]) => {
													const UpgradeIcon =
														specialUpgrades[upgrade as SpecialUpgrade].icon;
													return (
														<div
															key={upgrade}
															className="flex items-center justify-between text-sm"
														>
															<span className="flex items-center gap-2">
																<UpgradeIcon className="w-4 h-4" />
																<span className="capitalize">{upgrade}</span>
															</span>
															<span className="text-green-300">
																{duration} ops
															</span>
														</div>
													);
												}
											)}
										</div>
									</div>
								)}

								<div className="space-y-3">
									<h4 className="font-semibold text-blue-200">Drill Systems</h4>
									{(
										[
											"basic",
											"advanced",
											"master",
											"quantum",
											"plasma",
										] as DrillLevel[]
									).map((tier) => (
										<div
											key={tier}
											className={`p-3 rounded-lg border transition-all duration-200 ${
												drillLevel === tier
													? "bg-blue-900/30 border-blue-600"
													: totalResources >= upgradeTiers[tier].unlockLevel
													? "bg-slate-700/50 border-slate-600 hover:border-slate-500 cursor-pointer upgrade-card"
													: "bg-slate-800/50 border-slate-700 opacity-50"
											}`}
										>
											<div className="flex justify-between items-center mb-2">
												<h5 className="font-semibold capitalize text-sm">
													{tier} Class
												</h5>
												{drillLevel === tier ? (
													<span className="px-2 py-1 bg-blue-600 text-xs rounded-full">
														Active
													</span>
												) : totalResources >= upgradeTiers[tier].unlockLevel ? (
													<button
														className={`px-2 py-1 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
															canAffordUpgrade(tier)
																? "bg-blue-600 hover:bg-blue-700 text-white"
																: "bg-slate-600 text-slate-400 cursor-not-allowed"
														}`}
														onClick={() => setPreviewUpgrade(tier)}
														disabled={drillLevel === tier}
													>
														Preview
													</button>
												) : (
													<span className="px-2 py-1 bg-slate-700 text-xs rounded-full">
														Locked
													</span>
												)}
											</div>
											<div className="text-xs text-slate-300 space-y-1">
												<div>
													Cost:{" "}
													{Object.entries(upgradeTiers[tier].cost).length
														? Object.entries(upgradeTiers[tier].cost)
																.map(([k, v]) => `${v}x ${k}`)
																.join(", ")
														: "Standard"}
												</div>
												<div>
													Vision: {upgradeTiers[tier].vision} | Rock Cost:{" "}
													{upgradeTiers[tier].rockCost}
												</div>
												<div>
													Safety:{" "}
													{upgradeTiers[tier].obstacleSafe
														? "Enhanced"
														: "Standard"}
												</div>
												<div className="text-slate-400 italic text-xs">
													{upgradeTiers[tier].description}
												</div>
											</div>
										</div>
									))}
								</div>

								<div className="space-y-3">
									<h4 className="font-semibold text-purple-200">
										Special Enhancements
									</h4>
									{(Object.keys(specialUpgrades) as SpecialUpgrade[]).map(
										(upgrade) => {
											const UpgradeIcon = specialUpgrades[upgrade].icon;
											return (
												<div
													key={upgrade}
													className={`p-3 rounded-lg border transition-all duration-200 ${
														upgrade in activeSpecialUpgrades
															? "bg-green-900/20 border-green-600"
															: totalResources >=
															  specialUpgrades[upgrade].unlockLevel
															? "bg-slate-700/50 border-slate-600 hover:border-slate-500 cursor-pointer upgrade-card"
															: "bg-slate-800/50 border-slate-700 opacity-50"
													}`}
												>
													<div className="flex justify-between items-center mb-2">
														<h5 className="font-semibold capitalize text-sm flex items-center gap-2">
															<UpgradeIcon className="w-4 h-4" />
															{upgrade}
														</h5>
														{upgrade in activeSpecialUpgrades ? (
															<span className="px-2 py-1 bg-green-600 text-xs rounded-full">
																Active
															</span>
														) : totalResources >=
														  specialUpgrades[upgrade].unlockLevel ? (
															<button
																className={`px-2 py-1 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
																	canAffordSpecialUpgrade(upgrade)
																		? "bg-purple-600 hover:bg-purple-700 text-white"
																		: "bg-slate-600 text-slate-400 cursor-not-allowed"
																}`}
																onClick={() => purchaseSpecialUpgrade(upgrade)}
																disabled={!canAffordSpecialUpgrade(upgrade)}
															>
																Activate
															</button>
														) : (
															<span className="px-2 py-1 bg-slate-700 text-xs rounded-full">
																Locked
															</span>
														)}
													</div>
													<div className="text-xs text-slate-300 space-y-1">
														<div>
															Cost:{" "}
															{Object.entries(specialUpgrades[upgrade].cost)
																.map(([k, v]) => `${v}x ${k}`)
																.join(", ")}
														</div>
														<div>
															Duration: {specialUpgrades[upgrade].duration}{" "}
															operations
														</div>
														<div className="text-slate-400 italic text-xs">
															{specialUpgrades[upgrade].effect}
														</div>
													</div>
												</div>
											);
										}
									)}
								</div>

								<div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
									<h4 className="font-semibold mb-2 flex items-center gap-2">
										<FiTrendingUp className="w-4 h-4" />
										Operation Statistics
									</h4>
									<div className="text-xs text-slate-300 space-y-1">
										<div>Total Operations: {operationsCount}</div>
										<div>Current Vision Range: {currentVision} units</div>
										<div>
											Equipment Class:{" "}
											{drillLevel.charAt(0).toUpperCase() + drillLevel.slice(1)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 shadow-2xl z-30">
				<div className="w-full px-4 sm:px-6 py-3 sm:py-4">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
						<div>
							<div className="flex justify-between items-center mb-2">
								<h3 className="font-semibold text-red-200 text-sm">
									Operational Risk Level
								</h3>
								<span className="text-xs sm:text-sm text-slate-300">
									{threat}/{MAX_THREAT}
								</span>
							</div>
							<div className="w-full h-2 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
								<div
									className="h-2 sm:h-3 transition-all duration-500 rounded-full"
									style={{
										width: `${threatPercentage}%`,
										background:
											threatPercentage > 75
												? "linear-gradient(to right, #DC2626, #EF4444)"
												: threatPercentage > 50
												? "linear-gradient(to right, #F59E0B, #FBBF24)"
												: "linear-gradient(to right, #10B981, #34D399)",
									}}
								/>
							</div>
							<p className="text-xs mt-1 text-slate-400">
								Safety protocols active below {MAX_THREAT} units
							</p>
						</div>

						<div>
							<div className="flex justify-between items-center mb-2">
								<h3 className="font-semibold text-blue-200 text-sm">
									Equipment Capacity
								</h3>
								<span className="text-xs sm:text-sm text-slate-300">
									{hammers} operations remaining
								</span>
							</div>
							<div className="w-full h-2 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
								<div
									className="h-2 sm:h-3 bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 rounded-full"
									style={{ width: `${hammerPercentage}%` }}
								/>
							</div>
							<p className="text-xs mt-1 text-slate-400">
								Drilling operations available
							</p>
						</div>

						<div>
							<div className="flex justify-between items-center mb-2">
								<h3 className="font-semibold text-green-200 flex items-center gap-2 text-sm">
									<FiActivity className="w-3 h-3 sm:w-4 sm:h-4" />
									Equipment Health
								</h3>
								<span className="text-xs sm:text-sm text-slate-300">
									{equipmentHealth}%
								</span>
							</div>
							<div className="w-full h-2 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
								<div
									className={`h-2 sm:h-3 transition-all duration-500 rounded-full ${
										healthPercentage > 70
											? "bg-gradient-to-r from-green-500 to-green-400"
											: healthPercentage > 30
											? "bg-gradient-to-r from-yellow-500 to-yellow-400"
											: "bg-gradient-to-r from-red-500 to-red-400"
									}`}
									style={{ width: `${healthPercentage}%` }}
								/>
							</div>
							<p className="text-xs mt-1 text-slate-400">
								Equipment condition status
							</p>
						</div>
					</div>
				</div>
			</div>

			{}
			{notification && (
				<div className="fixed top-20 sm:top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 sm:px-6 py-3 rounded-lg shadow-2xl border border-slate-600 z-40 max-w-xs sm:max-w-md text-center">
					<div className="font-medium text-sm sm:text-base">{notification}</div>
				</div>
			)}

			{}
			{selected && (
				<div
					className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40"
					onClick={(e) => handleModalClose(e, () => setSelected(null))}
				>
					<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full mx-4">
						<h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
							Confirm Drilling Operation
						</h3>
						<p className="text-slate-300 mb-6 text-center text-sm sm:text-base">
							Execute drilling at coordinates ({selected.x}, {selected.y})?
						</p>
						<div className="flex gap-4">
							<button
								className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm sm:text-base"
								onClick={confirmDrill}
							>
								Confirm Operation
							</button>
							<button
								className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm sm:text-base"
								onClick={() => setSelected(null)}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{previewUpgrade && (
				<div
					className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40"
					onClick={(e) => handleModalClose(e, () => setPreviewUpgrade(null))}
				>
					<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full mx-4">
						<h3 className="text-lg sm:text-xl font-bold mb-4 text-center capitalize">
							{previewUpgrade} Class Drilling System
						</h3>
						<p className="text-slate-400 text-sm mb-6 text-center italic">
							{upgradeTiers[previewUpgrade].description}
						</p>
						<div className="space-y-3 mb-6 text-sm">
							<div className="flex justify-between">
								<span className="text-slate-300">Investment Required:</span>
								<span className="font-medium">
									{Object.entries(upgradeTiers[previewUpgrade].cost).length
										? Object.entries(upgradeTiers[previewUpgrade].cost)
												.map(([k, v]) => `${v}x ${k}`)
												.join(", ")
										: "Standard Equipment"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-300">Vision Range:</span>
								<span className="font-medium">
									{upgradeTiers[previewUpgrade].vision} units
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-300">Rock Drilling Cost:</span>
								<span className="font-medium">
									{upgradeTiers[previewUpgrade].rockCost} units
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-300">Safety Enhancement:</span>
								<span className="font-medium">
									{upgradeTiers[previewUpgrade].obstacleSafe ? "Yes" : "No"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-300">Unlock Requirement:</span>
								<span className="font-medium">
									{upgradeTiers[previewUpgrade].unlockLevel} resources
								</span>
							</div>
						</div>
						<div className="flex gap-4">
							<button
								className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
									canAffordUpgrade(previewUpgrade)
										? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 cursor-pointer"
										: "bg-slate-600 cursor-not-allowed opacity-50"
								}`}
								onClick={() => purchaseUpgrade(previewUpgrade)}
								disabled={!canAffordUpgrade(previewUpgrade)}
							>
								Authorize Purchase
							</button>
							<button
								className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm sm:text-base"
								onClick={() => setPreviewUpgrade(null)}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{gameOver && (
				<div
					className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
					onClick={(e) => handleModalClose(e, () => {})}
				>
					<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-700 max-w-lg w-full mx-4">
						<div className="text-center">
							<div
								className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
									gameOver === "win" ? "bg-green-600" : "bg-red-600"
								}`}
							>
								{gameOver === "win" ? (
									<svg
										width="32"
										height="32"
										className="sm:w-10 sm:h-10"
										viewBox="0 0 24 24"
										fill="white"
									>
										<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
									</svg>
								) : (
									<svg
										width="32"
										height="32"
										className="sm:w-10 sm:h-10"
										viewBox="0 0 24 24"
										fill="white"
									>
										<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
									</svg>
								)}
							</div>
							<h1 className="text-2xl sm:text-3xl font-bold mb-4">
								{gameOver === "win"
									? "Mission Accomplished"
									: "Operation Terminated"}
							</h1>
							<p className="mb-8 text-slate-300 leading-relaxed text-sm sm:text-base">
								{gameOver === "win"
									? `Congratulations! Resource extraction successful with ${totalResources} units collected. Operations completed within safety parameters.`
									: gameOverReason}
							</p>
							<button
								onClick={handleGameOverReset}
								className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold px-6 sm:px-8 py-4 rounded-lg transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
							>
								Initialize New Operation
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
