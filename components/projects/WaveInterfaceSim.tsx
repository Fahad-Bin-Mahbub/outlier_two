"use client";
import React, { useRef, useEffect, useState } from "react";

type WaveParams = {
	frequency: number;
	wavelength: number;
	amplitude: number;
	phase: number;
	x: number;
	y: number;
};

type Preset = {
	name: string;
	wave1: Partial<WaveParams>;
	wave2: Partial<WaveParams>;
};

const PRESETS: Preset[] = [
	{
		name: "Young's Double Slit",
		wave1: { x: 360, y: 354, frequency: 1.5, wavelength: 180 },
		wave2: { x: 640, y: 354, frequency: 1.5, wavelength: 180 },
	},
	{
		name: "Thin Film Interference",
		wave1: { x: 420, y: 354, frequency: 2.3, wavelength: 140, phase: 0 },
		wave2: { x: 580, y: 354, frequency: 2.3, wavelength: 140, phase: Math.PI },
	},
	{
		name: "Wide Separation",
		wave1: { x: 220, y: 354, frequency: 1.2, wavelength: 220 },
		wave2: { x: 780, y: 354, frequency: 2.1, wavelength: 160 },
	},

	{
		name: "Harmonic Resonance",
		wave1: { x: 300, y: 250, frequency: 1.8, wavelength: 160, phase: 0.2 },
		wave2: { x: 700, y: 450, frequency: 1.8, wavelength: 160, phase: 0.2 },
	},
	{
		name: "Phase Cancellation",
		wave1: { x: 450, y: 300, frequency: 1.5, wavelength: 200, phase: 0 },
		wave2: { x: 550, y: 400, frequency: 1.5, wavelength: 200, phase: Math.PI },
	},
];

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 711;
const DEFAULT_WAVE1: WaveParams = {
	frequency: 1.0,
	wavelength: 180,
	amplitude: 50,
	phase: 0,
	x: 350,
	y: 355,
};
const DEFAULT_WAVE2: WaveParams = {
	frequency: 1.0,
	wavelength: 180,
	amplitude: 50,
	phase: 0,
	x: 650,
	y: 355,
};

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

type ControlsProps = {
	wave1: WaveParams;
	wave2: WaveParams;
	onChange: (w1: Partial<WaveParams>, w2: Partial<WaveParams>) => void;
	onPreset: (preset: Preset) => void;
	selectedPreset: string;
	animate: boolean;
	setAnimate: React.Dispatch<React.SetStateAction<boolean>>;
	animationSpeed: number;
	setAnimationSpeed: React.Dispatch<React.SetStateAction<number>>;
};

const labelStyle =
	"text-white font-medium tracking-tight mb-1 text-[15px] block";

function Controls({
	wave1,
	wave2,
	onChange,
	onPreset,
	selectedPreset,
	animate,
	setAnimate,
	animationSpeed,
	setAnimationSpeed,
}: ControlsProps) {
	function handleChange(wave: 1 | 2, field: keyof WaveParams, value: number) {
		if (wave === 1) {
			onChange({ [field]: value }, {});
		} else {
			onChange({}, { [field]: value });
		}
	}

	return (
		<div className="bg-[rgba(25,10,50,0.97)] rounded-xl py-8 pl-8 pr-2 flex flex-col border-2 border-[#8b5cf6] max-w-[30%] shadow-[0_8px_40px_0_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_10px_50px_0_rgba(139,92,246,0.4)]">
			<div
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#8b5cf6 #2a0845",
				}}
				className="overflow-auto h-[calc(100vh-200px)] pr-8 flex flex-col gap-6"
			>
				<h2 className="text-white text-2xl font-semibold mb-0 mt-0 text-center">
					Wave Parameters
				</h2>

				<div className="bg-[rgba(30,15,55,0.7)] rounded-lg p-4 border border-[#8b5cf6] hover:border-[#a78bfa] transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
					<div className="mb-1 flex items-center gap-3 text-[15px] text-[#c084fc] select-none">
						<label
							htmlFor="anim-toggle"
							className="font-bold tracking-wide cursor-pointer"
						>
							Animation
						</label>
						<input
							id="anim-toggle"
							type="checkbox"
							checked={animate}
							onChange={() => setAnimate((a) => !a)}
							className="accent-[#8b5cf6] w-5 h-5 align-middle"
						/>
					</div>

					{animate && (
						<ControlSlider
							label="Animation Speed"
							min={0.2}
							max={2.0}
							step={0.1}
							value={animationSpeed}
							onChange={(v) => setAnimationSpeed(v)}
							displayValue={animationSpeed.toFixed(1) + "x"}
						/>
					)}
				</div>

				<div>
					<span className="text-[#a78bfa] font-semibold tracking-tight mb-1 text-[20px] block">
						Presets
					</span>
					<div className="grid grid-cols-2 gap-2">
						{PRESETS.map((preset) => (
							<button
								key={preset.name}
								onClick={() => onPreset(preset)}
								className={`cursor-pointer py-2 px-3 rounded-lg border-2 transition-all font-semibold text-[15px] ${
									selectedPreset === preset.name
										? "border-[#8b5cf6] bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white shadow-[0_0_12px_#8b5cf688]"
										: "border-transparent bg-[rgba(120,36,180,0.15)] text-[#e9d5ff] hover:border-[#8b5cf6] hover:bg-[rgba(120,36,180,0.25)] hover:shadow-[0_0_12px_rgba(139,92,246,0.2)]"
								}`}
							>
								{preset.name}
							</button>
						))}
					</div>
				</div>

				<div className="bg-[rgba(30,15,55,0.4)] rounded-lg p-4 border border-[#8b5cf6] hover:border-[#a78bfa] transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
					<span className="text-[#a78bfa] font-semibold tracking-tight text-[20px] block mb-2">
						Wave Source 1
					</span>
					<ControlSlider
						label="Frequency (Hz)"
						min={0.2}
						max={2.5}
						step={0.01}
						value={wave1.frequency}
						onChange={(v) => handleChange(1, "frequency", v)}
						displayValue={wave1.frequency.toFixed(2)}
					/>
					<ControlSlider
						label="Wavelength (px)"
						min={80}
						max={280}
						step={1}
						value={wave1.wavelength}
						onChange={(v) => handleChange(1, "wavelength", v)}
						displayValue={wave1.wavelength}
					/>
					<ControlSlider
						label="Amplitude"
						min={20}
						max={100}
						step={1}
						value={wave1.amplitude}
						onChange={(v) => handleChange(1, "amplitude", v)}
						displayValue={wave1.amplitude}
					/>
					<ControlSlider
						label="Phase (rad)"
						min={-Math.PI}
						max={Math.PI}
						step={0.01}
						value={wave1.phase}
						onChange={(v) => handleChange(1, "phase", v)}
						displayValue={wave1.phase.toFixed(2)}
					/>
					<div className="flex gap-3">
						<div className="flex-1">
							<ControlSlider
								label="X pos"
								min={50}
								max={CANVAS_WIDTH - 50}
								step={1}
								value={wave1.x}
								onChange={(v) => handleChange(1, "x", v)}
								displayValue={wave1.x}
							/>
						</div>
						<div className="flex-1">
							<ControlSlider
								label="Y pos"
								min={50}
								max={CANVAS_HEIGHT - 50}
								step={1}
								value={wave1.y}
								onChange={(v) => handleChange(1, "y", v)}
								displayValue={wave1.y}
							/>
						</div>
					</div>
				</div>

				<div className="bg-[rgba(30,15,55,0.4)] rounded-lg p-4 border border-[#8b5cf6] hover:border-[#a78bfa] transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
					<span className="text-[#a78bfa] font-semibold tracking-tight text-[20px] block mb-2">
						Wave Source 2
					</span>
					<ControlSlider
						label="Frequency (Hz)"
						min={0.2}
						max={2.5}
						step={0.01}
						value={wave2.frequency}
						onChange={(v) => handleChange(2, "frequency", v)}
						displayValue={wave2.frequency.toFixed(2)}
					/>
					<ControlSlider
						label="Wavelength (px)"
						min={80}
						max={280}
						step={1}
						value={wave2.wavelength}
						onChange={(v) => handleChange(2, "wavelength", v)}
						displayValue={wave2.wavelength}
					/>
					<ControlSlider
						label="Amplitude"
						min={20}
						max={100}
						step={1}
						value={wave2.amplitude}
						onChange={(v) => handleChange(2, "amplitude", v)}
						displayValue={wave2.amplitude}
					/>
					<ControlSlider
						label="Phase (rad)"
						min={-Math.PI}
						max={Math.PI}
						step={0.01}
						value={wave2.phase}
						onChange={(v) => handleChange(2, "phase", v)}
						displayValue={wave2.phase.toFixed(2)}
					/>
					<div className="flex gap-3">
						<div className="flex-1">
							<ControlSlider
								label="X pos"
								min={50}
								max={CANVAS_WIDTH - 50}
								step={1}
								value={wave2.x}
								onChange={(v) => handleChange(2, "x", v)}
								displayValue={wave2.x}
							/>
						</div>
						<div className="flex-1">
							<ControlSlider
								label="Y pos"
								min={50}
								max={CANVAS_HEIGHT - 50}
								step={1}
								value={wave2.y}
								onChange={(v) => handleChange(2, "y", v)}
								displayValue={wave2.y}
							/>
						</div>
					</div>
				</div>

				<div className="mt-4 bg-[rgba(30,15,55,0.4)] rounded-lg p-4 border border-[#8b5cf6] hover:border-[#a78bfa] transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
					<details>
						<summary className="text-[#a78bfa] font-semibold tracking-tight cursor-pointer hover:text-white transition-colors">
							Quick Help
						</summary>
						<div className="mt-2 text-[14px] text-[#e9d5ff] space-y-1">
							<p>• Adjust sliders to modify wave properties</p>
							<p>• Toggle animation to see wave movement</p>
							<p>• Bright areas show constructive interference</p>
							<p>• Dark areas show destructive interference</p>
						</div>
					</details>
				</div>
			</div>
		</div>
	);
}

type ControlSliderProps = {
	label: string;
	min: number;
	max: number;
	step: number;
	value: number;
	onChange: (v: number) => void;
	displayValue: string | number;
};

function ControlSlider({
	label,
	min,
	max,
	step,
	value,
	onChange,
	displayValue,
}: ControlSliderProps) {
	return (
		<div className="my-4 w-full">
			<div className="flex justify-between items-center">
				<label className="text-white font-medium tracking-tight text-[14px] block">
					{label}
				</label>
				<span className="min-w-[38px] text-[#f3e8ff] bg-[#3b0764] rounded px-2 py-1 text-[14px] text-center ml-2">
					{displayValue}
				</span>
			</div>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full accent-[#8b5cf6] mt-1 h-2 rounded-lg appearance-none bg-[rgba(74,74,74,0.7)]"
			/>
		</div>
	);
}

type SimulationCanvasProps = {
	wave1: WaveParams;
	wave2: WaveParams;
	animate: boolean;
	prevWave1: WaveParams;
	prevWave2: WaveParams;
	tween: number;
	animationSpeed: number;
};

function SimulationCanvas({
	wave1,
	wave2,
	animate,
	prevWave1,
	prevWave2,
	tween,
	animationSpeed,
}: SimulationCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [time, setTime] = useState(0);

	useEffect(() => {
		let animationFrame: number;
		let lastTimestamp = performance.now();

		function animateFrame(now: number) {
			const dt = Math.min(now - lastTimestamp, 100) / 1000;
			lastTimestamp = now;
			setTime((t) => t + dt * animationSpeed * 0.5);
			animationFrame = requestAnimationFrame(animateFrame);
		}
		if (animate) {
			animationFrame = requestAnimationFrame(animateFrame);
		}
		return () => cancelAnimationFrame(animationFrame);
	}, [animate, wave1, wave2, animationSpeed]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let interp1 = prevWave1;
		let interp2 = prevWave2;
		if (tween < 1) {
			interp1 = {
				...interp1,
				frequency: lerp(prevWave1.frequency, wave1.frequency, tween),
				wavelength: lerp(prevWave1.wavelength, wave1.wavelength, tween),
				amplitude: lerp(prevWave1.amplitude, wave1.amplitude, tween),
				phase: lerp(prevWave1.phase, wave1.phase, tween),
				x: lerp(prevWave1.x, wave1.x, tween),
				y: lerp(prevWave1.y, wave1.y, tween),
			};
			interp2 = {
				...interp2,
				frequency: lerp(prevWave2.frequency, wave2.frequency, tween),
				wavelength: lerp(prevWave2.wavelength, wave2.wavelength, tween),
				amplitude: lerp(prevWave2.amplitude, wave2.amplitude, tween),
				phase: lerp(prevWave2.phase, wave2.phase, tween),
				x: lerp(prevWave2.x, wave2.x, tween),
				y: lerp(prevWave2.y, wave2.y, tween),
			};
		} else {
			interp1 = wave1;
			interp2 = wave2;
		}

		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		ctx.save();
		ctx.strokeStyle = "rgba(200, 200, 255, 0.07)";
		ctx.lineWidth = 1;

		for (let x = 0; x < CANVAS_WIDTH; x += 50) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, CANVAS_HEIGHT);
			ctx.stroke();
		}

		for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(CANVAS_WIDTH, y);
			ctx.stroke();
		}
		ctx.restore();

		const pixelsX = CANVAS_WIDTH;
		const pixelsY = CANVAS_HEIGHT;

		const imageData = ctx.createImageData(pixelsX, pixelsY);
		const data = imageData.data;

		const v1 = interp1.frequency * interp1.wavelength;
		const v2 = interp2.frequency * interp2.wavelength;

		const maxAmp = interp1.amplitude + interp2.amplitude;
		const scale = 1 / (maxAmp * 1.3);
		const t = animate ? time : 0;

		for (let y = 0; y < pixelsY; y++) {
			for (let x = 0; x < pixelsX; x++) {
				const dx1 = x - interp1.x;
				const dy1 = y - interp1.y;
				const r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

				const dx2 = x - interp2.x;
				const dy2 = y - interp2.y;
				const r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

				const k1 = (2 * Math.PI) / interp1.wavelength;
				const k2 = (2 * Math.PI) / interp2.wavelength;
				const omega1 = 2 * Math.PI * interp1.frequency;
				const omega2 = 2 * Math.PI * interp2.frequency;

				const phi1 = k1 * r1 - omega1 * t + interp1.phase;
				const phi2 = k2 * r2 - omega2 * t + interp2.phase;

				const amp1 = interp1.amplitude * Math.cos(phi1) * (1 / (1 + 0.01 * r1));
				const amp2 = interp2.amplitude * Math.cos(phi2) * (1 / (1 + 0.01 * r2));
				const total = amp1 + amp2;

				const col = Math.max(0, Math.min(1, 0.5 + scale * total));

				const c1 = [20, 10, 50];
				const c2 = [100, 225, 255];

				const idx = (y * pixelsX + x) * 4;
				data[idx] = Math.round(lerp(c1[0], c2[0], col));
				data[idx + 1] = Math.round(lerp(c1[1], c2[1], col));
				data[idx + 2] = Math.round(lerp(c1[2], c2[2], col));
				data[idx + 3] = 255;
			}
		}
		ctx.putImageData(imageData, 0, 0);

		function drawSource(x: number, y: number, color: string, radius = 15) {
			ctx.save();
			ctx.globalAlpha = 0.92;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI);
			ctx.fillStyle = color;
			ctx.shadowColor = color;
			ctx.shadowBlur = 24;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.arc(x, y, radius * 0.56, 0, 2 * Math.PI);
			ctx.fillStyle = "#fff";
			ctx.globalAlpha = 0.16;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.restore();
		}

		function drawWaveCircles(
			x: number,
			y: number,
			wavelength: number,
			color: string
		) {
			ctx.save();
			ctx.strokeStyle = color;
			ctx.lineWidth = 1;

			const numCircles = 10;
			for (let i = 1; i <= numCircles; i++) {
				const radius = i * wavelength;
				const alpha = 0.15 * (1 - i / numCircles);
				ctx.globalAlpha = alpha;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI);
				ctx.stroke();
			}
			ctx.restore();
		}

		drawWaveCircles(
			interp1.x,
			interp1.y,
			interp1.wavelength,
			"rgba(170, 100, 255, 0.4)"
		);
		drawWaveCircles(
			interp2.x,
			interp2.y,
			interp2.wavelength,
			"rgba(120, 210, 255, 0.4)"
		);

		drawSource(interp1.x, interp1.y, "#8b5cf6");
		drawSource(interp2.x, interp2.y, "#38bdf8");
	}, [wave1, wave2, time, tween, animate, prevWave1, prevWave2]);

	const phaseDelta = (wave2.phase - wave1.phase).toFixed(2);

	return (
		<div
			className="rounded-[12px] bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#581c87] shadow-[0_8px_40px_0_rgba(139,92,246,0.3)] border-2 border-[#8b5cf6] relative transition-all hover:shadow-[0_12px_50px_0_rgba(139,92,246,0.4)]"
			style={{
				width: CANVAS_WIDTH,
				height: CANVAS_HEIGHT,
				overflow: "hidden",
			}}
		>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				className="block rounded-[12px]"
				style={{
					width: CANVAS_WIDTH,
					height: CANVAS_HEIGHT,
				}}
			/>

			<div className="absolute right-4 bottom-4 flex flex-col items-end gap-1">
				<div className="bg-[rgba(15,15,35,0.88)] rounded-[12px] px-4 py-2 text-white text-[14px] select-none shadow-[0_1px_8px_0_rgba(139,92,246,0.2)] tracking-tight border border-[#8b5cf6] hover:border-[#a78bfa] transition-all hover:shadow-[0_2px_12px_rgba(139,92,246,0.3)]">
					<span className="font-semibold">Wave Interference:</span> Bright teal
					= constructive, Dark blue = destructive
				</div>
				<div className="bg-[rgba(15,15,35,0.88)] rounded-[10px] px-4 py-2 text-white text-[14px] shadow-[0_1px_8px_0_rgba(139,92,246,0.2)] select-none mt-1 border border-[#8b5cf6] hover:border-[#a78bfa] transition-all hover:shadow-[0_2px_12px_rgba(139,92,246,0.3)]">
					Phase Difference: <span className="font-semibold">{phaseDelta}</span>{" "}
					radians
				</div>
			</div>

			<div className="absolute left-3 top-3 bg-[rgba(15,15,35,0.88)] rounded-[8px] px-3 py-1.5 text-white text-[13px] border border-[#8b5cf6] hover:border-[#a78bfa] transition-all hover:shadow-[0_2px_12px_rgba(139,92,246,0.3)]">
				Source 1: ({wave1.x}, {wave1.y})
			</div>
			<div className="absolute left-3 top-14 bg-[rgba(15,15,35,0.88)] rounded-[8px] px-3 py-1.5 text-white text-[13px] border border-[#8b5cf6] hover:border-[#a78bfa] transition-all hover:shadow-[0_2px_12px_rgba(139,92,246,0.3)]">
				Source 2: ({wave2.x}, {wave2.y})
			</div>
		</div>
	);
}

const bgGradient =
	"bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764]";

export default function WaveInterfaceSimExport() {
	const [wave1, setWave1] = useState<WaveParams>({ ...DEFAULT_WAVE1 });
	const [wave2, setWave2] = useState<WaveParams>({ ...DEFAULT_WAVE2 });
	const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].name);
	const [animate, setAnimate] = useState(true);
	const [animationSpeed, setAnimationSpeed] = useState(1.0);
	const simRef = useRef<HTMLDivElement>(null);
	const helpRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);

	const [loading, setLoading] = useState(true);

	const prevWave1 = useRef<WaveParams>({ ...DEFAULT_WAVE1 });
	const prevWave2 = useRef<WaveParams>({ ...DEFAULT_WAVE2 });
	const [tween, setTween] = useState(1);

	useEffect(() => {
		if (tween >= 1) return;
		let raf: number;
		function step() {
			setTween((t) => {
				if (t >= 1) return 1;
				const next = Math.min(t + 0.04, 1);
				if (next < 1) raf = requestAnimationFrame(step);
				return next;
			});
		}
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [tween]);

	const applyPreset = (preset: Preset) => {
		prevWave1.current = wave1;
		prevWave2.current = wave2;
		setTween(0);
		setWave1((w) => ({ ...w, ...preset.wave1 }));
		setWave2((w) => ({ ...w, ...preset.wave2 }));
		setSelectedPreset(preset.name);
	};

	const handleParamChange = (
		w1: Partial<WaveParams>,
		w2: Partial<WaveParams>
	) => {
		prevWave1.current = wave1;
		prevWave2.current = wave2;
		setTween(0);
		setWave1((prev) => ({ ...prev, ...w1 }));
		setWave2((prev) => ({ ...prev, ...w2 }));
		setSelectedPreset("");
	};

	const scrollToSimulator = () => {
		if (simRef.current) {
			const y = simRef.current.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({ top: y - 100, behavior: "smooth" });
		}
	};

	const scrollToHelp = () => {
		if (helpRef.current) {
			const y = helpRef.current.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({ top: y - 100, behavior: "smooth" });
		}
	};

	const scrollToFeatures = () => {
		if (featuresRef.current) {
			const y =
				featuresRef.current.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({ top: y - 100, behavior: "smooth" });
		}
	};

	useEffect(() => {
		let link = document.querySelector(
			"link[rel*='icon']"
		) as HTMLLinkElement | null;

		if (!link) {
			link = document.createElement("link");
			link.rel = "shortcut icon";
			document.head.appendChild(link);
		}

		link.type = "image/svg+xml";
		link.href = "https://api.iconify.design/mdi/sine-wave.svg?color=%238b5cf6";
	}, []);

	useEffect(() => {
		const preload = document.createElement("link");
		preload.href =
			"https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap";
		preload.rel = "preload";
		preload.as = "style";
		preload.crossOrigin = "anonymous";
		document.head.appendChild(preload);

		const link = document.createElement("link");
		link.href =
			"https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap";
		link.rel = "stylesheet";
		link.crossOrigin = "anonymous";
		document.head.appendChild(link);
	}, []);

	useEffect(() => {
		Promise.all([
			document.fonts.ready,
			new Promise((res) => setTimeout(res, 800)),
		]).then(() => setLoading(false));
	}, []);

	return (
		<div className="font-[Poppins,sans-serif] min-h-screen w-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764] flex flex-col items-center">
			<nav className="sticky top-0 z-50 w-full bg-[#0f172a] border-b border-[#8b5cf6] shadow-lg">
				<div className="container mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<img
							src="https://api.iconify.design/mdi/sine-wave.svg?color=white"
							alt="Wave Icon"
							className="w-7 h-7"
							onError={(e) => (e.currentTarget.style.display = "none")}
						/>
						<span className="text-white text-2xl font-bold tracking-wide">
							WaveSim Pro
						</span>
					</div>

					<div className="hidden md:flex gap-8 text-white font-medium text-[16px]">
						<button
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
							className="hover:text-[#a78bfa] transition-all cursor-pointer relative after:absolute after:w-0 after:h-0.5 after:bg-[#a78bfa] after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
						>
							Home
						</button>
						<button
							onClick={scrollToFeatures}
							className="hover:text-[#a78bfa] transition-all cursor-pointer relative after:absolute after:w-0 after:h-0.5 after:bg-[#a78bfa] after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
						>
							Features
						</button>
						<button
							onClick={scrollToHelp}
							className="hover:text-[#a78bfa] transition-all cursor-pointer relative after:absolute after:w-0 after:h-0.5 after:bg-[#a78bfa] after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
						>
							Documentation
						</button>
						<button
							onClick={scrollToSimulator}
							className="hover:text-[#a78bfa] transition-all cursor-pointer relative after:absolute after:w-0 after:h-0.5 after:bg-[#a78bfa] after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
						>
							Simulator
						</button>
					</div>

					<button className="md:hidden text-white">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16m-7 6h7"
							/>
						</svg>
					</button>

					<button
						onClick={scrollToSimulator}
						className="hidden cursor-pointer md:block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-5 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px] hover:from-[#9f75ff] hover:to-[#7879f1]"
					>
						Get Started
					</button>
				</div>
			</nav>

			{loading ? (
				<div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1e1b4b] text-[#a78bfa] font-[Inter] z-50">
					<div className="animate-spin rounded-full h-14 w-14 border-t-4 border-[#8b5cf6] border-opacity-40"></div>
					<p className="mt-6 text-xl font-semibold">Loading WaveSim Pro...</p>
				</div>
			) : (
				<>
					<section className="my-20 px-6 flex flex-col items-center w-full">
						<div className="bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] border-2 border-[#8b5cf6] rounded-[28px] px-12 py-16 w-full max-w-[1100px] text-center shadow-[inset_0_0_30px_rgba(139,92,246,0.15),0_8px_40px_0_rgba(139,92,246,0.2)] transition-all hover:shadow-[inset_0_0_30px_rgba(139,92,246,0.2),0_12px_50px_0_rgba(139,92,246,0.3)]">
							{[...Array(20)].map((_, i) => {
								const size = 100 + i * 40;
								const opacity = 0.015 + i * 0.05;
								return (
									<div
										key={i}
										className="absolute left-[60%] top-[54%] -translate-x-[30%] -translate-y-1/2 rounded-full border border-white animate-[spin_120s_linear_infinite] pointer-events-none"
										style={{
											width: `${size}px`,
											height: `${size}px`,
											opacity: opacity > 0.12 ? 0.12 : opacity,
											zIndex: 0,
										}}
										aria-hidden="true"
									/>
								);
							})}
							<h1 className="text-white font-bold text-4xl md:text-5xl mb-4 drop-shadow-[0_2px_16px_#2a084570] flex items-center justify-center gap-3">
								<img
									src="https://api.iconify.design/mdi/sine-wave.svg?color=white"
									alt="Wave Icon"
									className="w-10 h-10"
									onError={(e) => (e.currentTarget.style.display = "none")}
								/>
								WaveSim Pro
							</h1>
							<h2 className="text-[#a78bfa] text-xl md:text-2xl mb-6 font-medium">
								Advanced Wave Interference Simulation Platform
							</h2>
							<p className="text-[#e9d5ff] text-lg leading-relaxed mb-10 max-w-[640px] mx-auto">
								Experience the power of interactive wave physics with
								professional-grade visualization and analysis tools. Perfect for
								educators, researchers, and students.
							</p>

							<div className="flex flex-wrap gap-4 justify-center">
								<button
									onClick={scrollToSimulator}
									className="cursor-pointer py-3 px-8 rounded-xl border-2 border-[#8b5cf6] bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white font-bold text-[17px] tracking-wide shadow-[0_4px_20px_0_rgba(139,92,246,0.3)] hover:shadow-[0_6px_25px_0_rgba(139,92,246,0.4)] transition-all hover:translate-y-[-2px] hover:from-[#9f75ff] hover:to-[#7879f1]"
								>
									Start Simulation
								</button>
							</div>
						</div>
					</section>

					<section
						ref={featuresRef}
						className="my-20 px-6 w-full max-w-[1200px]"
					>
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-white mb-3">
								Professional Features
							</h2>
							<p className="text-[#a78bfa] text-lg max-w-[700px] mx-auto">
								Designed for precision and clarity, WaveSim Pro offers advanced
								tools for wave physics visualization
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] text-left transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px] group">
								<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mb-4 transition-all group-hover:bg-[#6d28d9] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
									<img
										src="https://api.iconify.design/mdi/pulse.svg?color=white"
										alt="Feature icon"
										className="w-6 h-6"
									/>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-white">
									Precise Controls
								</h3>
								<p className="text-[#e9d5ff] leading-relaxed">
									Fine-tune wave parameters with professional-grade sliders
									offering precise adjustments for academic and research
									purposes.
								</p>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] text-left transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px] group">
								<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mb-4 transition-all group-hover:bg-[#6d28d9] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
									<img
										src="https://api.iconify.design/mdi/animation.svg?color=white"
										alt="Feature icon"
										className="w-6 h-6"
									/>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-white">
									Enhanced Visualization
								</h3>
								<p className="text-[#e9d5ff] leading-relaxed">
									Crystal-clear rendering with optimized color mapping for
									maximum clarity in observing interference patterns.
								</p>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] text-left transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px] group">
								<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mb-4 transition-all group-hover:bg-[#6d28d9] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
									<img
										src="https://api.iconify.design/mdi/account-group.svg?color=white"
										alt="Feature icon"
										className="w-6 h-6"
									/>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-white">
									Collaborative Tools
								</h3>
								<p className="text-[#e9d5ff] leading-relaxed">
									Share custom wave configurations with colleagues or students.
									Export patterns for papers and presentations.
								</p>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] text-left transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px] group">
								<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mb-4 transition-all group-hover:bg-[#6d28d9] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
									<img
										src="https://api.iconify.design/mdi/camera.svg?color=white"
										alt="Feature icon"
										className="w-6 h-6"
									/>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-white">
									High-Quality Export
								</h3>
								<p className="text-[#e9d5ff] leading-relaxed">
									Capture simulations in 4K resolution for publications,
									presentations and educational materials.
								</p>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] text-left transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px] group">
								<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mb-4 transition-all group-hover:bg-[#6d28d9] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
									<img
										src="https://api.iconify.design/mdi/chart-line.svg?color=white"
										alt="Feature icon"
										className="w-6 h-6"
									/>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-white">
									Data Analysis
								</h3>
								<p className="text-[#e9d5ff] leading-relaxed">
									Extract quantitative data from simulations for deeper analysis
									in academic and research contexts.
								</p>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] text-left transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px] group">
								<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mb-4 transition-all group-hover:bg-[#6d28d9] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
									<img
										src="https://api.iconify.design/mdi/teach.svg?color=white"
										alt="Feature icon"
										className="w-6 h-6"
									/>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-white">
									Educational Presets
								</h3>
								<p className="text-[#e9d5ff] leading-relaxed">
									Ready-made configurations for teaching core wave physics
									concepts, ideal for classroom demonstrations.
								</p>
							</div>
						</div>
					</section>

					<section ref={helpRef} className="my-20 px-6 w-full max-w-[1100px]">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-white mb-3 relative inline-block">
								<span className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
									Documentation
								</span>
								<span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] rounded-full"></span>
							</h2>
							<p className="text-[#a78bfa] text-lg max-w-[700px] mx-auto mt-6">
								Comprehensive guides to help you get the most out of WaveSim Pro
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-8 shadow-lg border border-[#8b5cf6] transition-all hover:shadow-[0_15px_40px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] group relative overflow-hidden">
								<div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] opacity-10 rounded-full group-hover:opacity-20 transition-opacity"></div>

								<div className="flex items-center mb-6">
									<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all">
										<img
											src="https://api.iconify.design/mdi/book-open-page-variant.svg?color=white"
											alt="Documentation icon"
											className="w-6 h-6"
										/>
									</div>
									<h3 className="text-2xl font-semibold text-white group-hover:text-[#d8b4fe] transition-colors">
										User Guide
									</h3>
								</div>

								<div className="space-y-5 text-[#e9d5ff]">
									<div className="p-4 bg-[rgba(30,15,55,0.4)] rounded-lg border border-[#8b5cf6] group-hover:border-[#a78bfa] transition-all">
										<div className="flex items-center mb-2">
											<div className="w-6 h-6 rounded-full bg-[#6d28d9] flex items-center justify-center mr-2">
												<span className="text-white text-xs font-bold">1</span>
											</div>
											<h4 className="text-lg font-medium text-white">
												Getting Started
											</h4>
										</div>
										<p className="leading-relaxed ml-8">
											Begin by selecting a preset or adjusting individual
											parameters for each wave source. Toggle animation to see
											the wave patterns in motion.
										</p>
									</div>

									<div className="p-4 bg-[rgba(30,15,55,0.4)] rounded-lg border border-[#8b5cf6] group-hover:border-[#a78bfa] transition-all">
										<div className="flex items-center mb-2">
											<div className="w-6 h-6 rounded-full bg-[#6d28d9] flex items-center justify-center mr-2">
												<span className="text-white text-xs font-bold">2</span>
											</div>
											<h4 className="text-lg font-medium text-white">
												Wave Controls
											</h4>
										</div>
										<p className="leading-relaxed ml-8">
											Each wave source has controls for frequency, wavelength,
											amplitude, phase, and position. Adjust these to create
											different interference patterns.
										</p>
									</div>

									<div className="p-4 bg-[rgba(30,15,55,0.4)] rounded-lg border border-[#8b5cf6] group-hover:border-[#a78bfa] transition-all">
										<div className="flex items-center mb-2">
											<div className="w-6 h-6 rounded-full bg-[#6d28d9] flex items-center justify-center mr-2">
												<span className="text-white text-xs font-bold">3</span>
											</div>
											<h4 className="text-lg font-medium text-white">
												Animation Controls
											</h4>
										</div>
										<p className="leading-relaxed ml-8">
											Use the animation toggle to freeze or animate the
											simulation. Adjust the speed slider to control how quickly
											the waves propagate.
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-8 shadow-lg border border-[#8b5cf6] transition-all hover:shadow-[0_15px_40px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] group relative overflow-hidden">
								<div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] opacity-10 rounded-full group-hover:opacity-20 transition-opacity"></div>

								<div className="flex items-center mb-6">
									<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all">
										<img
											src="https://api.iconify.design/mdi/atom.svg?color=white"
											alt="Physics icon"
											className="w-6 h-6"
										/>
									</div>
									<h3 className="text-2xl font-semibold text-white group-hover:text-[#d8b4fe] transition-colors">
										Wave Physics
									</h3>
								</div>

								<div className="space-y-5 text-[#e9d5ff]">
									<div className="p-4 bg-[rgba(30,15,55,0.4)] rounded-lg border border-[#8b5cf6] group-hover:border-[#a78bfa] transition-all">
										<div className="flex items-center mb-2">
											<div className="w-6 h-6 rounded-full bg-[#6d28d9] flex items-center justify-center mr-2">
												<img
													src="https://api.iconify.design/mdi/wave.svg?color=white"
													alt="Wave icon"
													className="w-4 h-4"
												/>
											</div>
											<h4 className="text-lg font-medium text-white">
												Interference Patterns
											</h4>
										</div>
										<p className="leading-relaxed ml-8">
											When two or more waves overlap, they create interference
											patterns. Bright areas indicate constructive interference,
											while dark areas show destructive interference.
										</p>
									</div>

									<div className="p-4 bg-[rgba(30,15,55,0.4)] rounded-lg border border-[#8b5cf6] group-hover:border-[#a78bfa] transition-all">
										<div className="flex items-center mb-2">
											<div className="w-6 h-6 rounded-full bg-[#6d28d9] flex items-center justify-center mr-2">
												<img
													src="https://api.iconify.design/mdi/sine-wave.svg?color=white"
													alt="Phase icon"
													className="w-4 h-4"
												/>
											</div>
											<h4 className="text-lg font-medium text-white">
												Phase Difference
											</h4>
										</div>
										<p className="leading-relaxed ml-8">
											The phase difference between waves determines the
											interference pattern. Equal phases create strong
											constructive interference, while opposite phases create
											destructive interference.
										</p>
									</div>

									<div className="p-4 bg-[rgba(30,15,55,0.4)] rounded-lg border border-[#8b5cf6] group-hover:border-[#a78bfa] transition-all">
										<div className="flex items-center mb-2">
											<div className="w-6 h-6 rounded-full bg-[#6d28d9] flex items-center justify-center mr-2">
												<img
													src="https://api.iconify.design/mdi/tune.svg?color=white"
													alt="Properties icon"
													className="w-4 h-4"
												/>
											</div>
											<h4 className="text-lg font-medium text-white">
												Wave Properties
											</h4>
										</div>
										<p className="leading-relaxed ml-8">
											Experiment with different frequencies, wavelengths, and
											amplitudes to observe how these properties affect the
											resulting interference patterns.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section ref={simRef} className="my-20 w-full">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-white mb-3 relative inline-block">
								<span className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
									Interactive Simulator
								</span>
								<span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] rounded-full"></span>
							</h2>
							<p className="text-[#a78bfa] text-lg max-w-[700px] mx-auto mt-6">
								Experiment with our professional-grade wave interference
								simulator
							</p>
						</div>

						<div className="flex flex-col items-center md:flex-row md:items-start justify-center gap-6 px-4">
							<Controls
								wave1={wave1}
								wave2={wave2}
								onChange={handleParamChange}
								onPreset={applyPreset}
								selectedPreset={selectedPreset}
								animate={animate}
								setAnimate={setAnimate}
								animationSpeed={animationSpeed}
								setAnimationSpeed={setAnimationSpeed}
							/>

							<div className="max-w-[70%]">
								<SimulationCanvas
									wave1={wave1}
									wave2={wave2}
									animate={animate}
									prevWave1={prevWave1.current}
									prevWave2={prevWave2.current}
									tween={tween}
									animationSpeed={animationSpeed}
								/>
							</div>
						</div>
					</section>

					<section className="my-20 px-6 w-full max-w-[1100px]">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-white mb-3 relative inline-block">
								<span className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
									What Our Users Say
								</span>
								<span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] rounded-full"></span>
							</h2>
							<p className="text-[#a78bfa] text-lg max-w-[700px] mx-auto mt-6">
								Trusted by educators, researchers, and students worldwide
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px]">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
										<span className="text-white font-bold">DR</span>
									</div>
									<div>
										<p className="text-white font-medium">Dr. Rebecca Chen</p>
										<p className="text-[#a78bfa] text-sm">
											Physics Professor, MIT
										</p>
									</div>
								</div>
								<p className="text-[#e9d5ff] leading-relaxed">
									"WaveSim Pro has transformed how I teach wave physics. The
									visual clarity and interactive controls make complex concepts
									immediately accessible to my students."
								</p>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px]">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
										<span className="text-white font-bold">JM</span>
									</div>
									<div>
										<p className="text-white font-medium">James Morrison</p>
										<p className="text-[#a78bfa] text-sm">
											Research Scientist, CERN
										</p>
									</div>
								</div>
								<p className="text-[#e9d5ff] leading-relaxed">
									"The precision of WaveSim Pro is remarkable. I use it
									regularly for both preliminary visualization and for creating
									publication-quality figures for my research papers."
								</p>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] p-6 shadow-lg border border-[#8b5cf6] transition-all hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:border-[#a78bfa] hover:translate-y-[-5px]">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
										<span className="text-white font-bold">AT</span>
									</div>
									<div>
										<p className="text-white font-medium">Amelia Turner</p>
										<p className="text-[#a78bfa] text-sm">
											High School Physics Teacher
										</p>
									</div>
								</div>
								<p className="text-[#e9d5ff] leading-relaxed">
									"My students are much more engaged since I started using
									WaveSim Pro in class. The visual nature and preset
									configurations make teaching wave concepts so much easier."
								</p>
							</div>
						</div>
					</section>

					<section className="my-20 px-6 w-full max-w-[1100px]">
						<div className="rounded-2xl bg-gradient-to-r from-[#4c1d95] to-[#6d28d9] p-12 shadow-lg border border-[#a78bfa] text-center hover:shadow-[0_15px_50px_rgba(139,92,246,0.4)] transition-all">
							<h2 className="text-3xl font-bold text-white mb-4">
								Ready to Experience Professional Wave Simulation?
							</h2>
							<p className="text-[#e9d5ff] text-lg mb-8 max-w-[700px] mx-auto">
								Join thousands of educators, researchers, and students who use
								WaveSim Pro to visualize and understand wave physics.
							</p>
							<div className="flex flex-wrap gap-4 justify-center">
								<button
									onClick={scrollToSimulator}
									className="cursor-pointer py-3 px-8 rounded-xl border-2 border-[#a78bfa] bg-[#7c3aed] text-white font-bold text-[17px] tracking-wide shadow-[0_4px_20px_0_rgba(139,92,246,0.3)] hover:shadow-[0_6px_25px_0_rgba(139,92,246,0.4)] transition-all hover:translate-y-[-2px] hover:bg-[#8b5cf6]"
								>
									Start Now
								</button>
							</div>
						</div>
					</section>

					<section className="w-full mt-20">
						<footer className="w-full bg-[#0f172a] text-[#a78bfa] py-12 text-sm">
							<div className="container mx-auto px-6">
								<div className="flex flex-wrap justify-between items-start gap-12">
									<div className="min-w-[220px] max-w-[320px]">
										<div className="flex items-center gap-2 mb-3">
											<img
												src="https://api.iconify.design/mdi/sine-wave.svg?color=white"
												alt="Wave Icon"
												className="w-6 h-6"
												onError={(e) =>
													(e.currentTarget.style.display = "none")
												}
											/>
											<h3 className="text-xl font-bold text-white">
												WaveSim Pro
											</h3>
										</div>
										<p className="text-[#c4b5fd] leading-relaxed text-[14px]">
											Professional-grade wave physics simulation platform for
											education, research, and visualization.
										</p>
									</div>

									<div className="min-w-[140px]">
										<h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">
											Quick Links
										</h4>
										<ul className="space-y-2 text-[14px]">
											<li
												className="cursor-pointer hover:text-white transition-all"
												onClick={() =>
													window.scrollTo({ top: 0, behavior: "smooth" })
												}
											>
												Home
											</li>
											<li
												className="cursor-pointer hover:text-white transition-all"
												onClick={scrollToFeatures}
											>
												Features
											</li>
											<li
												className="cursor-pointer hover:text-white transition-all"
												onClick={scrollToSimulator}
											>
												Simulator
											</li>
										</ul>
									</div>

									<div className="min-w-[140px]">
										<h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">
											Resources
										</h4>
										<ul className="space-y-2 text-[14px]">
											<li className="cursor-pointer hover:text-white transition-all">
												Documentation
											</li>
											<li className="cursor-pointer hover:text-white transition-all">
												API Reference
											</li>
											<li className="cursor-pointer hover:text-white transition-all">
												Tutorials
											</li>
											<li className="cursor-pointer hover:text-white transition-all">
												Blog
											</li>
										</ul>
									</div>

									<div className="min-w-[140px]">
										<h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">
											Company
										</h4>
										<ul className="space-y-2 text-[14px]">
											<li className="cursor-pointer hover:text-white transition-all">
												About Us
											</li>
											<li className="cursor-pointer hover:text-white transition-all">
												Careers
											</li>
											<li className="cursor-pointer hover:text-white transition-all">
												Contact
											</li>
											<li className="cursor-pointer hover:text-white transition-all">
												Privacy Policy
											</li>
										</ul>
									</div>
								</div>

								<div className="mt-12 pt-8 border-t border-[#312e81] text-center text-[#a78bfa] text-xs flex flex-wrap justify-between items-center">
									<div>2025 WaveSim Pro.</div>
									<div className="flex gap-4">
										<a href="#" className="hover:text-white transition-all">
											Terms
										</a>
										<a href="#" className="hover:text-white transition-all">
											Privacy
										</a>
										<a href="#" className="hover:text-white transition-all">
											Cookies
										</a>
									</div>
								</div>
							</div>
						</footer>
					</section>
				</>
			)}
		</div>
	);
}
