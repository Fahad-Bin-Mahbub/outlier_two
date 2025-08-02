"use client";
import React, {
	useRef,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from "react";

const PHYSICS_CONFIG = {
	GRAVITY: 0.7,
	MAX_PARTICLES: 120,
	TARGET_FPS: 60,
	COLLISION_RESTITUTION: 0.88,
	BOUNDARY_RESTITUTION: 0.72,
	BOUNDARY_FRICTION: 0.92,
	MIN_VELOCITY_THRESHOLD: 1,
	SPATIAL_GRID_SIZE: 80,
	BOUNDARY_MARGIN: 8,
	COLLISION_ITERATIONS: 8,
	SEPARATION_ITERATIONS: 6,
	SEPARATION_FORCE: 0.6,
	RANDOMNESS_FACTOR: 0.02,
	OVERLAP_TOLERANCE: 0.1,
} as const;

const CAMERA_CONFIG = {
	GYRO_SMOOTHING: 0.12,
	GYRO_DEADZONE: 0.5,
	MAX_TILT_SENSITIVITY: 1.8,
	CAMERA_INTERPOLATION: 0.15,
	ZOOM_RANGE: [0.85, 1.16] as const,
	MOVEMENT_SCALE: { x: 0.06, y: 0.04 },
	TILT_DIVISORS: { gamma: 60, beta: 75 },
} as const;

const UI_CONFIG = {
	TOUCH_FEEDBACK_DURATION: 180,
	PRESET_CHANGE_DEBOUNCE: 250,
	RESIZE_DEBOUNCE: 100,
	PARTICLE_SIZE_RANGE: [12, 20],
	SWIPE_THRESHOLD: 40,
} as const;

const THEME = {
	light: {
		bg: "#f0f4fb",
		bgPanel: "#ffffff",
		bgCanvas: "linear-gradient(180deg, #f9fbff 88%, #d6e6ff 100%)",
		bgPreset: "#f4f6fa",
		textPrimary: "#1a1c2c",
		textSecondary: "#7280a7",
		shadow: "0 4px 28px -4px #4D96FF18",
		border: "#dbe6ff",
		modalBackdrop: "#222e42dd",
		accentYellow: "#D4AF37",
		textShadow: "0 1px 2px rgba(212,175,55,0.15)",
	},
	dark: {
		bg: "#11131e",
		bgPanel: "#1a1c2c",
		bgCanvas: "linear-gradient(180deg, #1f2233 88%, #2a304d 100%)",
		bgPreset: "#24283b",
		textPrimary: "#f0f4fb",
		textSecondary: "#8a96c1",
		shadow: "0 4px 28px -4px #00000040",
		border: "#303652",
		modalBackdrop: "#0a0a0fdd",
		accentYellow: "#F7DC6F",
		textShadow: "0 1px 8px rgba(247,220,111,0.25)",
	},
} as const;

const COLOR_PALETTE = [
	"#FF6B81",
	"#F7DC6F",
	"#6BCB77",
	"#4D96FF",
	"#FF6F91",
	"#FF9671",
	"#9D65C9",
] as const;

const ACCENTS = [
	"#4D96FF",
	"#F7DC6F",
	"#6BCB77",
	"#FF6B81",
	"#9D65C9",
] as const;

const randomColor = () =>
	COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
const clamp = (val: number, min: number, max: number) =>
	Math.max(min, Math.min(max, val));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const smoothStep = (t: number) => t * t * (3 - 2 * t);

const addRandomness = (value: number, factor: number) =>
	value + (Math.random() - 0.5) * factor;

const createDebouncer = () => {
	let timeoutId: number | null = null;
	return (fn: () => void, delay: number) => {
		if (timeoutId !== null) clearTimeout(timeoutId);
		timeoutId = setTimeout(fn, delay);
		return () => {
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
		};
	};
};

type Particle = {
	id: number;
	x: number;
	y: number;
	r: number;
	color: string;
	vx: number;
	vy: number;
	mass: number;
	gridX: number;
	gridY: number;
};

type Preset = {
	name: string;
	mass: number;
	friction: number;
	velocity: number;
};

type Camera = {
	x: number;
	y: number;
	zoom: number;
	tilt: { x: number; y: number };
};

type Boundaries = {
	left: number;
	right: number;
	top: number;
	bottom: number;
};

class SpatialGrid {
	private grid: Map<string, Particle[]> = new Map();
	private readonly cellSize: number;

	constructor(cellSize: number = PHYSICS_CONFIG.SPATIAL_GRID_SIZE) {
		this.cellSize = cellSize;
	}

	clear() {
		this.grid.clear();
	}

	private getKey(x: number, y: number): string {
		return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
	}

	insert(particle: Particle) {
		const key = this.getKey(particle.x, particle.y);
		if (!this.grid.has(key)) {
			this.grid.set(key, []);
		}
		this.grid.get(key)!.push(particle);

		particle.gridX = Math.floor(particle.x / this.cellSize);
		particle.gridY = Math.floor(particle.y / this.cellSize);
	}

	getNearbyParticles(particle: Particle): Particle[] {
		const nearby: Particle[] = [];
		const { gridX, gridY } = particle;

		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				const key = `${gridX + dx},${gridY + dy}`;
				const cell = this.grid.get(key);
				if (cell) {
					nearby.push(...cell);
				}
			}
		}
		return nearby;
	}
}

function enforceBoundaryConstraints(
	particles: Particle[],
	boundaries: Boundaries
): void {
	for (const p of particles) {
		let wasConstrained = false;

		if (p.y + p.r > boundaries.bottom) {
			p.y = boundaries.bottom - p.r;
			p.vy *= -PHYSICS_CONFIG.BOUNDARY_RESTITUTION;
			p.vx *= PHYSICS_CONFIG.BOUNDARY_FRICTION;
			if (Math.abs(p.vy) < PHYSICS_CONFIG.MIN_VELOCITY_THRESHOLD) p.vy = 0;
			wasConstrained = true;
		}

		if (p.y - p.r < boundaries.top) {
			p.y = boundaries.top + p.r;
			p.vy *= -PHYSICS_CONFIG.BOUNDARY_RESTITUTION;
			wasConstrained = true;
		}

		if (p.x - p.r < boundaries.left) {
			p.x = boundaries.left + p.r;
			p.vx *= -PHYSICS_CONFIG.BOUNDARY_RESTITUTION;
			wasConstrained = true;
		}

		if (p.x + p.r > boundaries.right) {
			p.x = boundaries.right - p.r;
			p.vx *= -PHYSICS_CONFIG.BOUNDARY_RESTITUTION;
			wasConstrained = true;
		}

		if (wasConstrained) {
			p.vx = addRandomness(p.vx, PHYSICS_CONFIG.RANDOMNESS_FACTOR * 0.5);
			p.vy = addRandomness(p.vy, PHYSICS_CONFIG.RANDOMNESS_FACTOR * 0.5);
		}
	}
}

function resolveCollisions(particles: Particle[]): void {
	for (let i = 0; i < particles.length; i++) {
		for (let j = i + 1; j < particles.length; j++) {
			const p1 = particles[i];
			const p2 = particles[j];

			const dx = p2.x - p1.x;
			const dy = p2.y - p1.y;
			const distSq = dx * dx + dy * dy;
			const minDist = p1.r + p2.r;
			const minDistSq = minDist * minDist;

			if (distSq < minDistSq && distSq > 0.01) {
				const dist = Math.sqrt(distSq);
				const nx = dx / dist;
				const ny = dy / dist;

				const vx1 = p1.vx,
					vy1 = p1.vy;
				const vx2 = p2.vx,
					vy2 = p2.vy;

				const rvx = vx1 - vx2;
				const rvy = vy1 - vy2;
				const speed = rvx * nx + rvy * ny;

				if (speed < 0) {
					const totalMass = p1.mass + p2.mass;
					const restitution = PHYSICS_CONFIG.COLLISION_RESTITUTION;
					const impulse = ((1 + restitution) * speed) / totalMass;

					const impulseX =
						impulse * nx * p2.mass +
						addRandomness(0, PHYSICS_CONFIG.RANDOMNESS_FACTOR);
					const impulseY =
						impulse * ny * p2.mass +
						addRandomness(0, PHYSICS_CONFIG.RANDOMNESS_FACTOR);

					p1.vx -= impulseX;
					p1.vy -= impulseY;
					p2.vx +=
						impulse * nx * p1.mass +
						addRandomness(0, PHYSICS_CONFIG.RANDOMNESS_FACTOR);
					p2.vy +=
						impulse * ny * p1.mass +
						addRandomness(0, PHYSICS_CONFIG.RANDOMNESS_FACTOR);
				}
			}
		}
	}

	separateOverlappingParticles(particles);
}

function separateOverlappingParticles(particles: Particle[]): void {
	for (let iter = 0; iter < PHYSICS_CONFIG.SEPARATION_ITERATIONS; iter++) {
		let hasOverlaps = false;
		let maxOverlap = 0;

		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const p1 = particles[i];
				const p2 = particles[j];

				const dx = p2.x - p1.x;
				const dy = p2.y - p1.y;
				const distSq = dx * dx + dy * dy;
				const minDist = p1.r + p2.r + PHYSICS_CONFIG.OVERLAP_TOLERANCE;

				if (distSq < minDist * minDist && distSq > 0.01) {
					hasOverlaps = true;
					const dist = Math.sqrt(distSq);
					const overlap = minDist - dist;
					maxOverlap = Math.max(maxOverlap, overlap);

					const nx = dx / dist;
					const ny = dy / dist;

					const totalMass = p1.mass + p2.mass;
					const p1Authority = p2.mass / totalMass;
					const p2Authority = p1.mass / totalMass;

					const separationForce = overlap * PHYSICS_CONFIG.SEPARATION_FORCE;
					const p1SeparationX = -nx * separationForce * p1Authority;
					const p1SeparationY = -ny * separationForce * p1Authority;
					const p2SeparationX = nx * separationForce * p2Authority;
					const p2SeparationY = ny * separationForce * p2Authority;

					p1.x +=
						p1SeparationX +
						addRandomness(0, PHYSICS_CONFIG.RANDOMNESS_FACTOR * 0.1);
					p1.y +=
						p1SeparationY +
						addRandomness(0, PHYSICS_CONFIG.RANDOMNESS_FACTOR * 0.1);
					p2.x +=
						p2SeparationX +
						addRandomness(0, PHYSICS_CONFIG.RANDOMNESS_FACTOR * 0.1);
					p2.y +=
						p2SeparationY +
						addRandomness(0, PHYSICS_CONFIG.RANDOMNESS_FACTOR * 0.1);

					const separationVelocity = overlap * 0.1;
					p1.vx += p1SeparationX * separationVelocity;
					p1.vy += p1SeparationY * separationVelocity;
					p2.vx += p2SeparationX * separationVelocity;
					p2.vy += p2SeparationY * separationVelocity;
				}
			}
		}

		if (!hasOverlaps || maxOverlap < PHYSICS_CONFIG.OVERLAP_TOLERANCE * 0.1) {
			break;
		}
	}
}

const IconArrowLeft = React.memo(() => (
	<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
	</svg>
));

const IconArrowRight = React.memo(() => (
	<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
	</svg>
));

const IconSun = React.memo(() => (
	<svg
		fill="#8A96C2"
		viewBox="-7.5 0 32 32"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M9.75 8.25v0.219c0 0.844-0.375 1.25-1.156 1.25s-1.125-0.406-1.125-1.25v-0.219c0-0.813 0.344-1.219 1.125-1.219s1.156 0.406 1.156 1.219zM12.063 9.25l0.156-0.188c0.469-0.688 1.031-0.781 1.625-0.344 0.625 0.438 0.719 1.031 0.25 1.719l-0.188 0.156c-0.469 0.688-1.031 0.781-1.625 0.313-0.625-0.438-0.688-0.969-0.219-1.656zM5 9.063l0.125 0.188c0.469 0.688 0.406 1.219-0.188 1.656-0.625 0.469-1.219 0.375-1.688-0.313l-0.125-0.156c-0.469-0.688-0.406-1.281 0.188-1.719 0.625-0.438 1.219-0.281 1.688 0.344zM8.594 11.125c2.656 0 4.844 2.188 4.844 4.875 0 2.656-2.188 4.813-4.844 4.813-2.688 0-4.844-2.156-4.844-4.813 0-2.688 2.156-4.875 4.844-4.875zM1.594 12.5l0.219 0.063c0.813 0.25 1.063 0.719 0.844 1.469-0.25 0.75-0.75 0.969-1.531 0.719l-0.219-0.063c-0.781-0.25-1.063-0.719-0.844-1.469 0.25-0.75 0.75-0.969 1.531-0.719zM15.375 12.563l0.219-0.063c0.813-0.25 1.313-0.031 1.531 0.719s-0.031 1.219-0.844 1.469l-0.188 0.063c-0.813 0.25-1.313 0.031-1.531-0.719-0.25-0.75 0.031-1.219 0.813-1.469zM8.594 18.688c1.469 0 2.688-1.219 2.688-2.688 0-1.5-1.219-2.719-2.688-2.719-1.5 0-2.719 1.219-2.719 2.719 0 1.469 1.219 2.688 2.719 2.688zM0.906 17.281l0.219-0.063c0.781-0.25 1.281-0.063 1.531 0.688 0.219 0.75-0.031 1.219-0.844 1.469l-0.219 0.063c-0.781 0.25-1.281 0.063-1.531-0.688-0.219-0.75 0.063-1.219 0.844-1.469zM16.094 17.219l0.188 0.063c0.813 0.25 1.063 0.719 0.844 1.469s-0.719 0.938-1.531 0.688l-0.219-0.063c-0.781-0.25-1.063-0.719-0.813-1.469 0.219-0.75 0.719-0.938 1.531-0.688zM3.125 21.563l0.125-0.188c0.469-0.688 1.063-0.75 1.688-0.313 0.594 0.438 0.656 0.969 0.188 1.656l-0.125 0.188c-0.469 0.688-1.063 0.75-1.688 0.313-0.594-0.438-0.656-0.969-0.188-1.656zM13.906 21.375l0.188 0.188c0.469 0.688 0.375 1.219-0.25 1.656-0.594 0.438-1.156 0.375-1.625-0.313l-0.156-0.188c-0.469-0.688-0.406-1.219 0.219-1.656 0.594-0.438 1.156-0.375 1.625 0.313zM9.75 23.469v0.25c0 0.844-0.375 1.25-1.156 1.25s-1.125-0.406-1.125-1.25v-0.25c0-0.844 0.344-1.25 1.125-1.25s1.156 0.406 1.156 1.25z" />
	</svg>
));

const IconMoon = React.memo(() => (
	<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M12.3 4.88c.15.42.06.89-.25 1.21-1.14 1.14-1.14 2.99 0 4.13.62.62 1.44.93 2.26.93.43 0 .86-.09 1.27-.26.54-1.78-.17-3.66-1.54-5.03-.49-.49-1.13-.74-1.74-.74-.23 0-.46.03-.68.1zM9.5 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65C5.97 21.5 7.68 22 9.5 22c5.52 0 10-4.48 10-10S15.02 2 9.5 2z" />
	</svg>
));

const IconDownload = React.memo(() => (
	<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
		<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
	</svg>
));

const IconClear = React.memo(() => (
	<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
		<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
	</svg>
));

const IconHeart = React.memo(() => (
	<svg
		viewBox="0 0 24 24"
		width="14"
		height="14"
		fill="#4D96FF"
		style={{ display: "inline", verticalAlign: "middle" }}
	>
		<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
	</svg>
));

const GlobalStyles = React.memo(
	({ theme }: { theme: (typeof THEME)["light"] }) => (
		<style>{`
    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
    
    :root {
      --bg: ${theme.bg};
      --bg-panel: ${theme.bgPanel};
      --bg-canvas: ${theme.bgCanvas};
      --bg-preset: ${theme.bgPreset};
      --text-primary: ${theme.textPrimary};
      --text-secondary: ${theme.textSecondary};
      --shadow: ${theme.shadow};
      --border: ${theme.border};
      --modal-backdrop: ${theme.modalBackdrop};
      --font-heading: 'Outfit', system-ui, sans-serif;
      --font-body: 'Quicksand', system-ui, sans-serif;
    }
    
    [data-theme="light"] {
      --accent-yellow: #D4AF37;
      --text-shadow: 0 1px 2px rgba(212,175,55,0.15);
    }
    
    [data-theme="dark"] {
      --accent-yellow: #F7DC6F;
      --text-shadow: 0 1px 8px rgba(247,220,111,0.25);
    }

    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100dvh;
    }

    body {
      background: var(--bg);
font-family: var(--font-body);      
transition: background 0.3s ease, color 0.3s ease;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    * { 
      box-sizing: border-box; 
    }

    .no-select {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
    }

    @keyframes fadeIn { 
      from { opacity: 0; transform: scale(0.97); } 
      to { opacity: 1; transform: scale(1); } 
    }

    @keyframes touchFeedback { 
      0% { opacity: 0.75; stroke-width: 3; }
    }

    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-panel); 
      transition: background 0.3s ease;
    }

    .controls-panel {
      display: flex;
      flex-direction: column;
      gap: 16px; 
      padding: 16px;
      background-color: var(--bg-panel);
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .sim-container {
      flex-grow: 1; 
      min-height: 0; 
      background: var(--bg-canvas);
      border-radius: 16px;
      margin: 0 16px 16px 16px;
      overflow: hidden;
      position: relative;
      transition: margin 0.3s ease, border-radius 0.3s ease;
    }

    @media (min-width: 992px), (orientation: landscape) and (min-width: 600px) {
      .app-shell {
        flex-direction: row;
        padding: 16px;
        gap: 16px;
        background: var(--bg);
      }
      .controls-panel {
        width: 360px;
        height: 100%;
        overflow-y: auto;
        padding: 24px;
        border-radius: 16px;
        box-shadow: var(--shadow);
      }
      .sim-container {
        margin: 0;
        border-radius: 16px;
        height: 100%;
      }
    }

    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
    }
    
    .title { 
      font-weight: 800; 
      font-size: 26px; 
      letter-spacing: -1.2px; 
      color: var(--accent-color, #4D96FF); 
    }
    
    .title .playground { 
      color: var(--accent-yellow, #F7DC6F); 
      text-shadow: var(--text-shadow, 0 1px 8px rgba(247,220,111,0.25)); 
    }
    
    .theme-toggle { 
      background: var(--bg-preset); 
      border: 1px solid var(--border); 
      color: var(--text-secondary); 
      width: 36px; 
      height: 36px; 
      border-radius: 50%; 
      display: grid; 
      place-items: center; 
      cursor: pointer; 
      transition: all 0.2s ease; 
    }
    
    .theme-toggle:hover { 
      border-color: var(--accent-color, #4D96FF); 
      color: var(--accent-color, #4D96FF); 
      transform: scale(1.1) rotate(15deg); 
    }

    .instructions { 
      text-align: center; 
      font-size: 14px; 
      color: var(--text-secondary); 
      line-height: 1.6; 
    }
    
    .instructions b { 
      font-weight: 600; 
      color: var(--accent-color, #4D96FF); 
    }
    
    .preset-swiper { 
      user-select: none; 
      background: var(--bg-preset); 
      border-radius: 16px; 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      padding: 8px; 
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); 
      border: 1px solid var(--border); 
      cursor: grab; 
      touch-action: pan-x;
    }
    
    .preset-swiper:active { 
      cursor: grabbing; 
    }
    
    .preset-swiper-btn { 
      border: none; 
      background: var(--accent-color, #4D96FF); 
      color: #fff; 
      border-radius: 12px; 
      width: 40px; 
      height: 40px; 
      display: grid; 
      place-items: center; 
      cursor: pointer; 
      transition: all 0.2s ease; 
      opacity: 0.9; 
    }
    
    .preset-swiper-btn:hover { 
      opacity: 1; 
      transform: scale(1.05); 
    }
    
    .preset-swiper-btn:active { 
      transform: scale(0.95); 
    }
    
    .preset-name { 
      font-weight: 700; 
      font-size: 18px; 
      color: var(--accent-color, #4D96FF); 
      letter-spacing: 0.5px; 
    }

    .sliders-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr 1fr; 
      gap: 12px; 
    }
    
    .slider-container { 
      display: flex; 
      flex-direction: column; 
      gap: 8px; 
    }
    
    .slider-label { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      font-size: 13px; 
      color: var(--text-primary); 
      font-weight: 500; 
    }
    
    .slider-value { 
      font-weight: 600; 
      color: var(--accent-color, #4D96FF); 
      background: var(--bg-preset); 
      padding: 2px 6px; 
      border-radius: 6px; 
    }
    
    input[type="range"] { 
      -webkit-appearance: none; 
      appearance: none; 
      width: 100%; 
      height: 6px; 
      background: var(--bg-preset); 
      border-radius: 3px; 
      outline: none; 
      cursor: pointer; 
    }
    
    input[type="range"]::-webkit-slider-thumb { 
      -webkit-appearance: none; 
      appearance: none; 
      width: 18px; 
      height: 18px; 
      background: var(--accent-color, #4D96FF); 
      border-radius: 50%; 
      border: 3px solid var(--bg-panel); 
      box-shadow: 0 0 0 1px var(--border); 
      margin-top: -6px; 
      transition: transform 0.1s ease; 
    }
    
    input[type="range"]:active::-webkit-slider-thumb { 
      transform: scale(1.2); 
    }
    
    input[type="range"]::-moz-range-thumb { 
      width: 18px; 
      height: 18px; 
      background: var(--accent-color, #4D96FF); 
      border-radius: 50%; 
      border: 3px solid var(--bg-panel); 
      box-shadow: 0 0 0 1px var(--border); 
    }

    .sim-wrapper { 
      position: relative; 
      width: 100%; 
      height: 100%; 
    }
    
    .sim-svg { 
      display: block; 
      width: 100%; 
      height: 100%; 
      touch-action: manipulation; 
      user-select: none; 
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }
    
    .sim-controls { 
      position: absolute; 
      right: 12px; 
      bottom: 12px; 
      z-index: 8; 
      display: flex; 
      gap: 8px; 
    }
    
    .sim-btn { 
      background: rgba(255, 255, 255, 0.6); 
      backdrop-filter: blur(5px); 
      -webkit-backdrop-filter: blur(5px); 
      color: #333; 
      border: 1px solid rgba(0,0,0,0.05); 
      border-radius: 50%; 
      width: 40px; 
      height: 40px; 
      display: grid; 
      place-items: center; 
      cursor: pointer; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
      transition: all 0.2s ease; 
    }
    
    .sim-btn:hover { 
      transform: scale(1.1); 
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
    }

    .modal-overlay { 
      position: fixed; 
      inset: 0; 
      background: var(--modal-backdrop); 
      backdrop-filter: blur(8px); 
      -webkit-backdrop-filter: blur(8px); 
      z-index: 22; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      animation: fadeIn 0.3s ease; 
    }
    
    .modal-content { 
      background: var(--bg-panel); 
      border-radius: 16px; 
      padding: 20px; 
      width: 90vw; 
      max-width: 450px; 
      box-shadow: 0 4px 24px #00000033; 
      text-align: center; 
      display: flex; 
      flex-direction: column; 
      gap: 16px; 
      animation: fadeIn 0.3s ease 50ms backwards; 
    }
    
    .modal-preview { 
      max-width: 100%; 
      max-height: 40vh; 
      overflow: auto; 
      border-radius: 12px; 
      background: var(--bg-preset); 
      border: 1px solid var(--border); 
      display: flex; 
      justify-content: center; 
      align-items: center; 
    }
    
    .modal-preview svg { 
      display: block; 
      width: 100%; 
      height: auto; 
    }
    
    .modal-buttons { 
      display: flex; 
      flex-direction: column; 
      gap: 10px; 
    }
    
    .modal-btn { 
      border: none; 
      border-radius: 12px; 
      font-weight: 600; 
      padding: 12px 18px; 
      font-size: 15px; 
      cursor: pointer; 
      transition: all 0.2s ease; 
    }
    
    .modal-btn.primary { 
      background: var(--accent-yellow); 
      color: var(--bg-panel);
      font-weight: 700;
    }
    
    .modal-btn.primary:hover { 
      filter: brightness(1.05); 
    }
    
    .modal-btn.secondary { 
      background: var(--bg-preset); 
      color: var(--text-primary); 
    }
    
    .modal-btn.secondary:hover { 
      filter: brightness(0.95); 
    }

    .footer { 
      margin-top: auto; 
      text-align: center; 
      font-size: 12px; 
      color: var(--text-secondary); 
      font-weight: 500; 
      opacity: 0.8; 
      padding-top: 10px; 
    }
    
    .footer a { 
      color: var(--accent-color, #4D96FF); 
      text-decoration: none; 
    }

    .gyro-permission-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      padding: 12px 24px;
      background: var(--accent-color, #4D96FF);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .gyro-permission-btn:hover {
      transform: translate(-50%, -50%) scale(1.05);
      box-shadow: 0 6px 16px rgba(0,0,0,0.3);
    }
    
    .gyro-permission-btn:active {
      transform: translate(-50%, -50%) scale(0.95);
    }

    .touch-feedback {
      pointer-events: none;
      animation: touchFeedback ${UI_CONFIG.TOUCH_FEEDBACK_DURATION}ms ease-out;
    }

    .sim-svg * {
      will-change: transform;
    }
    
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `}</style>
	)
);

const PRESETS: Preset[] = [
	{ name: "Bouncy", mass: 0.8, friction: 0.02, velocity: 13 },
	{ name: "Heavy", mass: 2.4, friction: 0.1, velocity: 8 },
	{ name: "Slippery", mass: 1.0, friction: 0.01, velocity: 16 },
	{ name: "Sticky", mass: 1.5, friction: 0.24, velocity: 6 },
	{ name: "Light", mass: 0.5, friction: 0.03, velocity: 12 },
] as const;

type SliderProps = {
	label: string;
	min: number;
	max: number;
	step: number;
	value: number;
	onChange: (v: number) => void;
};

const Slider = React.memo(
	({ label, min, max, step, value, onChange }: SliderProps) => {
		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				onChange(Number(e.target.value));
			},
			[onChange]
		);

		return (
			<div className="slider-container">
				<div className="slider-label">
					<span>{label}</span>
					<span className="slider-value">{Number(value).toFixed(2)}</span>
				</div>
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={handleChange}
				/>
			</div>
		);
	}
);

function useSwipe(
	onSwipeLeft: () => void,
	onSwipeRight: () => void
): [React.RefObject<HTMLDivElement>] {
	const touchStartX = useRef<number>(0);
	const touchEndX = useRef<number>(0);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const handleTouchStart = (e: TouchEvent) => {
			touchStartX.current = e.touches[0].clientX;
		};

		const handleTouchMove = (e: TouchEvent) => {
			touchEndX.current = e.touches[0].clientX;
		};

		const handleTouchEnd = () => {
			const delta = touchEndX.current - touchStartX.current;
			if (Math.abs(delta) > UI_CONFIG.SWIPE_THRESHOLD) {
				if (delta < 0) onSwipeLeft();
				else onSwipeRight();
			}
		};

		node.addEventListener("touchstart", handleTouchStart, { passive: true });
		node.addEventListener("touchmove", handleTouchMove, { passive: true });
		node.addEventListener("touchend", handleTouchEnd, { passive: true });

		return () => {
			node.removeEventListener("touchstart", handleTouchStart);
			node.removeEventListener("touchmove", handleTouchMove);
			node.removeEventListener("touchend", handleTouchEnd);
		};
	}, [onSwipeLeft, onSwipeRight]);

	return [ref];
}

type PresetSwiperProps = {
	presets: Preset[];
	current: number;
	setCurrent: (i: number) => void;
};

const PresetSwiper = React.memo(
	({ presets, current, setCurrent }: PresetSwiperProps) => {
		const [isDebouncing, setIsDebouncing] = useState(false);
		const [dragStartX, setDragStartX] = useState<number | null>(null);
		const debouncer = useMemo(() => createDebouncer(), []);

		const handlePresetChange = useCallback(
			(direction: "left" | "right") => {
				if (isDebouncing) return;
				setIsDebouncing(true);

				setCurrent(
					direction === "left"
						? (current + 1) % presets.length
						: (current - 1 + presets.length) % presets.length
				);

				debouncer(
					() => setIsDebouncing(false),
					UI_CONFIG.PRESET_CHANGE_DEBOUNCE
				);
			},
			[isDebouncing, setCurrent, presets.length, current, debouncer]
		);

		const handleMouseDown = useCallback((e: React.MouseEvent) => {
			setDragStartX(e.clientX);
			document.body.style.userSelect = "none";
		}, []);

		const handleMouseMove = useCallback(
			(e: React.MouseEvent) => {
				if (dragStartX !== null) {
					const delta = e.clientX - dragStartX;
					if (Math.abs(delta) > UI_CONFIG.SWIPE_THRESHOLD) {
						handlePresetChange(delta < 0 ? "left" : "right");
						setDragStartX(null);
						document.body.style.userSelect = "";
					}
				}
			},
			[dragStartX, handlePresetChange]
		);

		const handleMouseUp = useCallback(() => {
			setDragStartX(null);
			document.body.style.userSelect = "";
		}, []);

		const onLeft = useCallback(
			() => handlePresetChange("left"),
			[handlePresetChange]
		);
		const onRight = useCallback(
			() => handlePresetChange("right"),
			[handlePresetChange]
		);
		const [swipeRef] = useSwipe(onLeft, onRight);

		return (
			<div
				ref={swipeRef}
				className="preset-swiper"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				style={{ cursor: dragStartX !== null ? "grabbing" : "grab" }}
			>
				<button
					className="preset-swiper-btn"
					onClick={() => handlePresetChange("right")}
					aria-label="Previous Preset"
					disabled={isDebouncing}
				>
					<IconArrowLeft />
				</button>
				<div className="preset-name">{presets[current].name}</div>
				<button
					className="preset-swiper-btn"
					onClick={() => handlePresetChange("left")}
					aria-label="Next Preset"
					disabled={isDebouncing}
				>
					<IconArrowRight />
				</button>
			</div>
		);
	}
);

type ParticleSimProps = {
	width: number;
	height: number;
	mass: number;
	friction: number;
	velocity: number;
	camera: Camera;
	cameraRef: React.RefObject<Camera>;
	onExportSVG: (svg: string) => void;
	onClear: () => void;
	particles: Particle[];
	setParticles: React.Dispatch<React.SetStateAction<Particle[]>>;
};

const ParticleSim = React.memo(
	({
		width,
		height,
		mass,
		friction,
		velocity,
		camera,
		cameraRef,
		onExportSVG,
		onClear,
		particles,
		setParticles,
	}: ParticleSimProps) => {
		const [touchFeedback, setTouchFeedback] = useState<{
			x: number;
			y: number;
			show: boolean;
		}>({ x: 0, y: 0, show: false });

		const latestValuesRef = useRef({ camera, friction });
		const pid = useRef<number>(1);
		const lastFrameTime = useRef<number>(0);

		latestValuesRef.current = { camera, friction };

		const handleTap = useCallback(
			(e: React.TouchEvent | React.MouseEvent) => {
				if (particles.length >= PHYSICS_CONFIG.MAX_PARTICLES) return;

				let clientX: number, clientY: number;
				if ("touches" in e) {
					clientX = e.touches[0].clientX;
					clientY = e.touches[0].clientY;
				} else {
					clientX = e.clientX;
					clientY = e.clientY;
				}

				const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
				if (!rect) return;

				const x = ((clientX - rect.left) / rect.width) * width;
				const y = ((clientY - rect.top) / rect.height) * height;
				const a = Math.random() * Math.PI * 2;
				const v = velocity;
				const [minR, maxR] = UI_CONFIG.PARTICLE_SIZE_RANGE;
				const r = minR + Math.random() * (maxR - minR);

				const worldX = (x - camera.x) / camera.zoom;
				const worldY = (y - camera.y) / camera.zoom;

				const newParticle: Particle = {
					id: pid.current++,
					x: worldX,
					y: worldY,
					r,
					color: randomColor(),
					vx: Math.cos(a) * v,
					vy: Math.sin(a) * v,
					mass,
					gridX: 0,
					gridY: 0,
				};

				setParticles((prev) => [...prev, newParticle]);

				setTouchFeedback({ x: x, y: y, show: true });
				setTimeout(
					() => setTouchFeedback((f) => ({ ...f, show: false })),
					UI_CONFIG.TOUCH_FEEDBACK_DURATION
				);
			},
			[width, height, mass, velocity, camera, setParticles, particles.length]
		);

		useEffect(() => {
			if (width === 0 || height === 0) return;

			let frame: number;
			let isVisible = true;
			const frameInterval = 1000 / PHYSICS_CONFIG.TARGET_FPS;

			const handleVisibilityChange = () => {
				isVisible = !document.hidden;
				if (isVisible && !frame) {
					lastFrameTime.current = performance.now();
					frame = requestAnimationFrame(step);
				}
			};

			document.addEventListener("visibilitychange", handleVisibilityChange);

			function step(currentTime: number) {
				if (!isVisible) return;

				if (currentTime - lastFrameTime.current < frameInterval) {
					frame = requestAnimationFrame(step);
					return;
				}
				lastFrameTime.current = currentTime;

				setParticles((prev) => {
					if (prev.length === 0) {
						frame = requestAnimationFrame(step);
						return prev;
					}

					const currentCamera = cameraRef.current || {
						x: 0,
						y: 0,
						zoom: 1,
						tilt: { x: 0, y: 0 },
					};
					const currentTilt = currentCamera.tilt;
					const currentFriction = latestValuesRef.current.friction;

					const boundaries: Boundaries = {
						left:
							-currentCamera.x / currentCamera.zoom +
							PHYSICS_CONFIG.BOUNDARY_MARGIN,
						right:
							(width - currentCamera.x) / currentCamera.zoom -
							PHYSICS_CONFIG.BOUNDARY_MARGIN,
						top:
							-currentCamera.y / currentCamera.zoom +
							PHYSICS_CONFIG.BOUNDARY_MARGIN,
						bottom:
							(height - currentCamera.y) / currentCamera.zoom -
							PHYSICS_CONFIG.BOUNDARY_MARGIN,
					};

					const next = prev.map((p) => {
						const tiltEffect = CAMERA_CONFIG.MAX_TILT_SENSITIVITY;
						const tiltGravityX =
							PHYSICS_CONFIG.GRAVITY * currentTilt.x * tiltEffect;
						const tiltGravityY =
							PHYSICS_CONFIG.GRAVITY * currentTilt.y * tiltEffect;

						p.vx += tiltGravityX;
						p.vy += PHYSICS_CONFIG.GRAVITY + tiltGravityY;

						p.vx *= 1 - currentFriction;
						p.vy *= 1 - currentFriction;

						p.x += p.vx;
						p.y += p.vy;

						return p;
					});

					resolveCollisions(next);

					enforceBoundaryConstraints(next, boundaries);

					separateOverlappingParticles(next);

					const margin = 300;
					const filtered = next.filter(
						(p) =>
							p.x + p.r > boundaries.left - margin &&
							p.x - p.r < boundaries.right + margin &&
							p.y + p.r > boundaries.top - margin &&
							p.y - p.r < boundaries.bottom + margin
					);

					frame = requestAnimationFrame(step);
					return filtered;
				});
			}

			lastFrameTime.current = performance.now();
			frame = requestAnimationFrame(step);

			return () => {
				if (frame) cancelAnimationFrame(frame);
				document.removeEventListener(
					"visibilitychange",
					handleVisibilityChange
				);
			};
		}, [width, height, setParticles, cameraRef]);

		const handleExportSVG = useCallback(() => {
			const currentTheme =
				THEME[(document.body.dataset.theme as "light" | "dark") || "light"];
			let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background: ${currentTheme.bgCanvas};">`;

			for (let p of particles) {
				const screenX = p.x * camera.zoom + camera.x;
				const screenY = p.y * camera.zoom + camera.y;
				svg += `<circle cx="${screenX}" cy="${screenY}" r="${
					p.r * camera.zoom
				}" fill="${p.color}" />`;
			}
			svg += `</svg>`;
			onExportSVG(svg);
		}, [width, height, particles, camera, onExportSVG]);

		const renderedParticles = useMemo(
			() =>
				particles.map((p) => (
					<circle
						key={p.id}
						cx={p.x}
						cy={p.y}
						r={p.r}
						fill={p.color}
						style={{ filter: `drop-shadow(0 2px 8px ${p.color}44)` }}
					/>
				)),
			[particles]
		);

		return (
			<div className="sim-wrapper">
				<svg
					className="sim-svg no-select"
					viewBox={`0 0 ${width} ${height}`}
					onMouseDown={(e) => {
						if (!window.matchMedia("(pointer: coarse)").matches) {
							handleTap(e);
						}
					}}
					onTouchStart={(e) => {
						e.preventDefault();
						handleTap(e);
					}}
					onTouchEnd={(e) => {
						e.preventDefault();
					}}
				>
					<g
						transform={`translate(${camera.x} ${camera.y}) scale(${camera.zoom})`}
					>
						{renderedParticles}
					</g>
					{touchFeedback.show && (
						<circle
							className="touch-feedback"
							cx={touchFeedback.x}
							cy={touchFeedback.y}
							r={34}
							fill="none"
							stroke="var(--accent-yellow)"
							strokeWidth={3}
							opacity={0.75}
							style={{
								transformOrigin: "center",
								willChange: "opacity, stroke-width",
							}}
						/>
					)}
				</svg>
				<div className="sim-controls">
					<button
						className="sim-btn"
						onClick={onClear}
						aria-label="Clear Particles"
					>
						<IconClear />
					</button>
					<button
						className="sim-btn"
						onClick={handleExportSVG}
						aria-label="Export SVG"
					>
						<IconDownload />
					</button>
				</div>
			</div>
		);
	}
);

function useGyroCamera(
	bounds: { width: number; height: number },
	zoomRange: readonly [number, number]
) {
	const [camera, setCamera] = useState<Camera>({
		x: 0,
		y: 0,
		zoom: 1,
		tilt: { x: 0, y: 0 },
	});
	const cameraRef = useRef(camera);
	const [hasPermission, setHasPermission] = useState(false);
	const lastUpdateTime = useRef<number>(0);
	const targetCamera = useRef<Camera>({
		x: 0,
		y: 0,
		zoom: 1,
		tilt: { x: 0, y: 0 },
	});
	const isIOS =
		/iPad|iPhone|iPod/.test(navigator.userAgent) ||
		(typeof DeviceOrientationEvent !== "undefined" &&
			typeof (DeviceOrientationEvent as any).requestPermission === "function");
	const isAndroid = /Android/i.test(navigator.userAgent);

	useEffect(() => {
		let smoothedGamma = 0,
			smoothedBeta = 0,
			smoothedAlpha = 0;
		const throttleMs = 1000 / PHYSICS_CONFIG.TARGET_FPS;
		let orientationListenerAdded = false;

		function getOrientationAngle(): number {
			if (
				window.screen.orientation &&
				typeof window.screen.orientation.angle === "number"
			) {
				return window.screen.orientation.angle;
			}
			if (typeof window.orientation === "number") {
				return window.orientation;
			}
			return 0;
		}

		function handleOrientation(e: DeviceOrientationEvent) {
			if (e.gamma === null || e.beta === null) return;

			const now = performance.now();
			if (now - lastUpdateTime.current < throttleMs) return;
			lastUpdateTime.current = now;

			let { gamma, beta, alpha } = e;
			gamma = gamma || 0;
			beta = beta || 0;
			alpha = alpha || 0;

			if (Math.abs(gamma) < CAMERA_CONFIG.GYRO_DEADZONE) gamma = 0;
			if (Math.abs(beta - 45) < CAMERA_CONFIG.GYRO_DEADZONE) beta = 45;

			smoothedGamma = lerp(smoothedGamma, gamma, CAMERA_CONFIG.GYRO_SMOOTHING);
			smoothedBeta = lerp(smoothedBeta, beta, CAMERA_CONFIG.GYRO_SMOOTHING);
			smoothedAlpha = lerp(smoothedAlpha, alpha, CAMERA_CONFIG.GYRO_SMOOTHING);

			let processedGamma = smoothedGamma;
			let processedBeta = smoothedBeta;
			let orientation = getOrientationAngle();

			if (isIOS) {
				switch (orientation) {
					case 90:
						[processedGamma, processedBeta] = [-processedBeta, processedGamma];
						break;
					case -90:
					case 270:
						[processedGamma, processedBeta] = [processedBeta, -processedGamma];
						break;
					case 180:
						processedGamma = -processedGamma;
						processedBeta = -processedBeta;
						break;
				}
			} else if (isAndroid) {
				if (orientation === 270) orientation = -90;
				switch (orientation) {
					case 90:
						[processedGamma, processedBeta] = [processedBeta, -processedGamma];
						break;
					case -90:
						[processedGamma, processedBeta] = [-processedBeta, processedGamma];
						break;
					case 180:
						processedGamma = -processedGamma;
						processedBeta = -processedBeta;
						break;
				}
			}

			const maxX = bounds.width * CAMERA_CONFIG.MOVEMENT_SCALE.x;
			const maxY = bounds.height * CAMERA_CONFIG.MOVEMENT_SCALE.y;

			const x = clamp((processedGamma / 45) * maxX, -maxX, maxX);
			const y = clamp(((processedBeta - 30) / 90) * maxY, -maxY, maxY);
			const tiltX = clamp(
				processedGamma / CAMERA_CONFIG.TILT_DIVISORS.gamma,
				-1,
				1
			);
			const tiltY = clamp(
				(processedBeta - 45) / CAMERA_CONFIG.TILT_DIVISORS.beta,
				-1,
				1
			);
			const zoom = clamp(
				1 + (smoothedAlpha / 720) * 0.06,
				zoomRange[0],
				zoomRange[1]
			);

			targetCamera.current = { x, y, zoom, tilt: { x: tiltX, y: tiltY } };
		}

		function interpolateCamera() {
			const current = cameraRef.current;
			const target = targetCamera.current;
			const factor = CAMERA_CONFIG.CAMERA_INTERPOLATION;

			const newCamera = {
				x: lerp(current.x, target.x, factor),
				y: lerp(current.y, target.y, factor),
				zoom: lerp(current.zoom, target.zoom, factor),
				tilt: {
					x: lerp(current.tilt.x, target.tilt.x, factor),
					y: lerp(current.tilt.y, target.tilt.y, factor),
				},
			};

			cameraRef.current = newCamera;
			setCamera(newCamera);
			requestAnimationFrame(interpolateCamera);
		}

		function addOrientationListeners() {
			if (orientationListenerAdded) return;

			if (isIOS) {
				window.addEventListener(
					"deviceorientationabsolute",
					handleOrientation,
					{ passive: true }
				);
				window.addEventListener("deviceorientation", handleOrientation, {
					passive: true,
				});
			} else {
				window.addEventListener("deviceorientation", handleOrientation, {
					passive: true,
				});
			}

			orientationListenerAdded = true;
		}

		function removeOrientationListeners() {
			window.removeEventListener("deviceorientation", handleOrientation);
			window.removeEventListener(
				"deviceorientationabsolute",
				handleOrientation
			);
			orientationListenerAdded = false;
		}

		async function initializeGyroscope() {
			try {
				if (
					isIOS &&
					typeof (DeviceOrientationEvent as any).requestPermission ===
						"function"
				) {
					const permission = await (
						DeviceOrientationEvent as any
					).requestPermission();

					if (permission === "granted") {
						addOrientationListeners();
						setHasPermission(true);
					} else {
						setHasPermission(false);
					}
				} else {
					addOrientationListeners();
					setHasPermission(true);
				}
			} catch (err) {
				console.error("Gyroscope initialization failed:", err);
				setHasPermission(false);
				try {
					addOrientationListeners();
					setHasPermission(true);
				} catch (fallbackErr) {
					console.error("Gyroscope fallback failed:", fallbackErr);
				}
			}
		}

		const hasOrientationSupport = typeof DeviceOrientationEvent !== "undefined";
		if (!hasOrientationSupport) {
			setHasPermission(false);
			requestAnimationFrame(interpolateCamera);
			return;
		}

		initializeGyroscope();
		requestAnimationFrame(interpolateCamera);

		const orientationChangeListener = () => {
			setTimeout(() => {
				const resetTarget = { x: 0, y: 0, zoom: 1, tilt: { x: 0, y: 0 } };
				targetCamera.current = resetTarget;
			}, 100);
		};

		window.addEventListener("orientationchange", orientationChangeListener);

		return () => {
			removeOrientationListeners();
			window.removeEventListener(
				"orientationchange",
				orientationChangeListener
			);
		};
	}, [bounds.width, bounds.height, zoomRange, isIOS, isAndroid]);

	return [camera, hasPermission, cameraRef] as const;
}

export default function MotionPhysicsExport() {
	const simContainerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
	const [presetIdx, setPresetIdx] = useState(0);
	const [params, setParams] = useState<Preset>(PRESETS[0]);
	const [camera, hasGyroPermission, cameraRef] = useGyroCamera(
		size,
		CAMERA_CONFIG.ZOOM_RANGE
	);
	const [svgExport, setSvgExport] = useState<string | null>(null);
	const [particles, setParticles] = useState<Particle[]>([]);
	const [showPermissionBtn, setShowPermissionBtn] = useState(false);
	const debouncer = useMemo(() => createDebouncer(), []);

	const theme = useMemo(() => THEME[themeMode], [themeMode]);
	const accent = useMemo(() => {
		const baseAccent = ACCENTS[presetIdx % ACCENTS.length];
		if (baseAccent === "#F7DC6F") {
			return themeMode === "light" ? "#D4AF37" : "#F7DC6F";
		}
		return baseAccent;
	}, [presetIdx, themeMode]);

	useEffect(() => {
		const handleResize = () => {
			debouncer(() => {
				if (simContainerRef.current) {
					const { width, height } =
						simContainerRef.current.getBoundingClientRect();
					setSize({ width, height });
				}
			}, UI_CONFIG.RESIZE_DEBOUNCE);
		};

		handleResize();
		const resizeObserver = new ResizeObserver(handleResize);
		if (simContainerRef.current) {
			resizeObserver.observe(simContainerRef.current);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, [debouncer]);

	useEffect(() => {
		setParams(PRESETS[presetIdx]);
	}, [presetIdx]);

	useEffect(() => {
		const prefersDark =
			window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
		setThemeMode(prefersDark ? "dark" : "light");
	}, []);

	useEffect(() => {
		document.body.dataset.theme = themeMode;
	}, [themeMode]);

	useEffect(() => {
		const isIOS =
			/iPad|iPhone|iPod/.test(navigator.userAgent) ||
			(typeof DeviceOrientationEvent !== "undefined" &&
				typeof (DeviceOrientationEvent as any).requestPermission ===
					"function");
		setShowPermissionBtn(isIOS && !hasGyroPermission);
	}, [hasGyroPermission]);

	const handleDownloadSVG = useCallback(() => {
		if (!svgExport) return;
		const blob = new Blob([svgExport], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "motion-playground.svg";
		a.click();
		URL.revokeObjectURL(url);
		setSvgExport(null);
	}, [svgExport]);

	const requestGyroPermission = useCallback(async () => {
		try {
			if (
				typeof (DeviceOrientationEvent as any).requestPermission === "function"
			) {
				const permission = await (
					DeviceOrientationEvent as any
				).requestPermission();
				if (permission === "granted") {
					setShowPermissionBtn(false);
					setTimeout(() => {
						window.location.reload();
					}, 100);
				} else {
					alert(
						"Motion access denied. Please enable it in Settings > Safari > Motion & Orientation Access, then refresh the page."
					);
				}
			}
		} catch (error) {
			console.error("Error requesting gyroscope permission:", error);
			setTimeout(() => {
				window.location.reload();
			}, 500);
		}
	}, []);

	const toggleTheme = useCallback(() => {
		setThemeMode((t) => (t === "light" ? "dark" : "light"));
	}, []);

	const clearParticles = useCallback(() => {
		setParticles([]);
	}, []);

	const handleMassChange = useCallback((v: number) => {
		setParams((p) => ({ ...p, mass: v }));
	}, []);

	const handleFrictionChange = useCallback((v: number) => {
		setParams((p) => ({ ...p, friction: v }));
	}, []);

	const handleVelocityChange = useCallback((v: number) => {
		setParams((p) => ({ ...p, velocity: v }));
	}, []);

	return (
		<>
			<GlobalStyles theme={theme} />
			<div
				className="app-shell"
				style={{ "--accent-color": accent } as React.CSSProperties}
			>
				{showPermissionBtn && (
					<button
						className="gyro-permission-btn"
						onClick={requestGyroPermission}
					>
						Enable Motion Controls
					</button>
				)}

				<div className="controls-panel">
					<header className="header">
						<h1 className="title">
							Motion<span className="playground">Playground</span>
						</h1>
						<button
							className="theme-toggle"
							onClick={toggleTheme}
							aria-label="Toggle Theme"
						>
							{themeMode === "light" ? <IconMoon /> : <IconSun />}
						</button>
					</header>

					<p className="instructions">
						<b>Tap</b> to spawn, <b>swipe</b> presets, <b>tilt</b> to control
						gravity.
						{particles.length >= PHYSICS_CONFIG.MAX_PARTICLES && (
							<>
								<br />
								<small>
									Max particles reached ({PHYSICS_CONFIG.MAX_PARTICLES})
								</small>
							</>
						)}
					</p>

					<PresetSwiper
						presets={PRESETS}
						current={presetIdx}
						setCurrent={setPresetIdx}
					/>

					<div className="sliders-grid">
						<Slider
							label="Mass"
							min={0.4}
							max={2.8}
							step={0.02}
							value={params.mass}
							onChange={handleMassChange}
						/>
						<Slider
							label="Friction"
							min={0.01}
							max={0.26}
							step={0.005}
							value={params.friction}
							onChange={handleFrictionChange}
						/>
						<Slider
							label="Velocity"
							min={3}
							max={21}
							step={0.1}
							value={params.velocity}
							onChange={handleVelocityChange}
						/>
					</div>
				</div>

				<div ref={simContainerRef} className="sim-container">
					{size.width > 0 && (
						<ParticleSim
							width={size.width}
							height={size.height}
							mass={params.mass}
							friction={params.friction}
							velocity={params.velocity}
							camera={camera}
							cameraRef={cameraRef}
							particles={particles}
							setParticles={setParticles}
							onExportSVG={setSvgExport}
							onClear={clearParticles}
						/>
					)}
				</div>

				{svgExport && (
					<div className="modal-overlay" onClick={() => setSvgExport(null)}>
						<div className="modal-content" onClick={(e) => e.stopPropagation()}>
							<h2
								style={{
									margin: 0,
									fontSize: 18,
									fontWeight: 700,
									color: "var(--text-primary)",
								}}
							>
								Export Preview
							</h2>
							<div
								className="modal-preview"
								dangerouslySetInnerHTML={{ __html: svgExport }}
							/>
							<div className="modal-buttons">
								<button
									className="modal-btn primary"
									onClick={handleDownloadSVG}
								>
									Save SVG and Close
								</button>
								<button
									className="modal-btn secondary"
									onClick={() => setSvgExport(null)}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
