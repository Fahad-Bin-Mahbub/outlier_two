"use client";
import React, { useState, useMemo, useEffect } from "react";
import { FiSliders, FiCopy, FiPlay, FiPause, FiSave } from "react-icons/fi";
import { RiSpeedLine, RiDragMoveLine, RiScales2Line } from "react-icons/ri";
import { MdSwapVert, MdSwapHoriz } from "react-icons/md";

interface SpringConfig {
	mass: number;
	stiffness: number;
	damping: number;
	speed: number;
}

interface Preset {
	id: string;
	name: string;
	config: SpringConfig;
}

function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
	React.useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth < 1024);
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
	return isMobile;
}

interface SpringPanelProps {
	config: SpringConfig;
	setConfig: React.Dispatch<React.SetStateAction<SpringConfig>>;
	presets: Preset[];
	setPresets: React.Dispatch<React.SetStateAction<Preset[]>>;
	selectedPreset: string | null;
	setSelectedPreset: React.Dispatch<React.SetStateAction<string | null>>;
	isVertical: boolean;
	setIsVertical: React.Dispatch<React.SetStateAction<boolean>>;
	playAnimation: () => void;
	generateCSS: (
		canvas: { width: number; height: number },
		forCopy?: boolean
	) => string;
	hidePlayButton?: boolean;
	onCopyCSS: () => void;
	isPlaying: boolean;
	canvasSize: { width: number; height: number };
}

const SpringPanel: React.FC<SpringPanelProps> = ({
	config,
	setConfig,
	presets,
	setPresets,
	selectedPreset,
	setSelectedPreset,
	isVertical,
	setIsVertical,
	playAnimation,
	generateCSS,
	hidePlayButton,
	onCopyCSS,
	isPlaying,
	canvasSize,
}) => {
	const [showPresetForm, setShowPresetForm] = useState(false);
	const [presetName, setPresetName] = useState("");
	const [presetError, setPresetError] = useState("");

	const [massInput, setMassInput] = useState(config.mass.toString());
	const [stiffnessInput, setStiffnessInput] = useState(
		config.stiffness.toString()
	);
	const [dampingInput, setDampingInput] = useState(config.damping.toString());
	const [speedInput, setSpeedInput] = useState(config.speed.toString());

	React.useEffect(() => {
		setMassInput(config.mass.toString());
		setStiffnessInput(config.stiffness.toString());
		setDampingInput(config.damping.toString());
		setSpeedInput(config.speed.toString());
	}, [config]);

	const handleSavePreset = () => {
		if (!presetName.trim()) {
			setPresetError("Please enter a preset name before saving.");
			return;
		}

		const existingPreset = presets.find(
			(preset) => preset.name === presetName.trim()
		);

		if (existingPreset) {
			setPresetError(
				"This preset already exists. Please choose a different name."
			);
			return;
		}

		const newPreset = {
			id: Date.now().toString(),
			name: presetName.trim(),
			config: { ...config },
		};
		setPresets([...presets, newPreset]);
		setPresetName("");
		setShowPresetForm(false);
		setPresetError("");
	};

	const handleCopyCSS = () => {
		navigator.clipboard.writeText(generateCSS(canvasSize, true));
		onCopyCSS();
	};

	return (
		<div className="bg-gradient-to-br from-[#06283D]/90 to-[#1E5F74]/85 backdrop-blur-xl border border-[#47B5FF]/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.6)] transition-shadow duration-300 rounded-2xl p-5 lg:p-7 h-full overflow-y-auto">
			<h1 className="font-display text-xl lg:text-2xl font-bold text-white mb-6 lg:mb-8 flex items-center">
				<FiSliders className="mr-3 h-5 lg:h-6 w-5 lg:w-6 text-[#47B5FF]" />
				Spring Playground
			</h1>
			<div className="space-y-6 lg:space-y-8">
				<div>
					<div className="flex justify-between items-center mb-3">
						<label className="text-white font-display flex items-center">
							<RiScales2Line className="mr-2 text-[#47B5FF]" />
							Mass: {config.mass.toFixed(1)}
						</label>
						<input
							type="number"
							value={massInput}
							onChange={(e) => {
								setMassInput(e.target.value);
							}}
							onBlur={() => {
								let value = parseFloat(massInput);
								if (isNaN(value)) value = 0.1;
								if (value < 0.1) value = 0.1;
								if (value > 5) value = 5;
								setConfig({ ...config, mass: value });
								setMassInput(value.toString());
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									let value = parseFloat(massInput);
									if (isNaN(value)) value = 0.1;
									if (value < 0.1) value = 0.1;
									if (value > 5) value = 5;
									setConfig({ ...config, mass: value });
									setMassInput(value.toString());
								}
							}}
							min="0.1"
							max="5"
							step="0.1"
							className="w-20 h-8 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 px-2 font-display text-white shadow-lg focus:ring-2 focus:ring-[#47B5FF]/50 focus:outline-none"
						/>
					</div>
					<div className="relative">
						<div className="absolute inset-0 bg-[#47B5FF]/10 rounded-full"></div>
						<input
							type="range"
							min="0.1"
							max="5"
							step="0.1"
							value={config.mass}
							onChange={(e) =>
								setConfig({ ...config, mass: parseFloat(e.target.value) })
							}
							className="w-full h-2 bg-transparent appearance-none z-10 relative [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#47B5FF] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(71,181,255,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
						/>
						<div
							className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-[#47B5FF] to-[#DFF6FF] rounded-full -translate-y-1/2 pointer-events-none"
							style={{ width: `${((config.mass - 0.1) / 4.9) * 100}%` }}
						></div>
					</div>
				</div>
				<div>
					<div className="flex justify-between items-center mb-3">
						<label className="text-white font-display flex items-center">
							<RiSpeedLine className="mr-2 text-[#47B5FF]" />
							Stiffness: {config.stiffness.toFixed(0)}
						</label>
						<input
							type="number"
							value={stiffnessInput}
							onChange={(e) => {
								setStiffnessInput(e.target.value);
							}}
							onBlur={() => {
								let value = parseFloat(stiffnessInput);
								if (isNaN(value)) value = 1;
								if (value < 1) value = 1;
								if (value > 500) value = 500;
								setConfig({ ...config, stiffness: value });
								setStiffnessInput(value.toString());
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									let value = parseFloat(stiffnessInput);
									if (isNaN(value)) value = 1;
									if (value < 1) value = 1;
									if (value > 500) value = 500;
									setConfig({ ...config, stiffness: value });
									setStiffnessInput(value.toString());
								}
							}}
							min="1"
							max="500"
							step="1"
							className="w-20 h-8 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 px-2 font-display text-white shadow-lg focus:ring-2 focus:ring-[#47B5FF]/50 focus:outline-none"
						/>
					</div>
					<div className="relative">
						<div className="absolute inset-0 bg-[#47B5FF]/10 rounded-full"></div>
						<input
							type="range"
							min="1"
							max="500"
							step="1"
							value={config.stiffness}
							onChange={(e) =>
								setConfig({ ...config, stiffness: parseFloat(e.target.value) })
							}
							className="w-full h-2 bg-transparent appearance-none z-10 relative [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#47B5FF] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(71,181,255,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
						/>
						<div
							className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-[#47B5FF] to-[#DFF6FF] rounded-full -translate-y-1/2 pointer-events-none"
							style={{ width: `${((config.stiffness - 1) / 499) * 100}%` }}
						></div>
					</div>
				</div>
				<div>
					<div className="flex justify-between items-center mb-3">
						<label className="text-white font-display flex items-center">
							<RiDragMoveLine className="mr-2 text-[#47B5FF]" />
							Damping: {config.damping.toFixed(1)}
						</label>
						<input
							type="number"
							value={dampingInput}
							onChange={(e) => {
								setDampingInput(e.target.value);
							}}
							onBlur={() => {
								let value = parseFloat(dampingInput);
								if (isNaN(value)) value = 0;
								if (value < 0) value = 0;
								if (value > 50) value = 50;
								setConfig({ ...config, damping: value });
								setDampingInput(value.toString());
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									let value = parseFloat(dampingInput);
									if (isNaN(value)) value = 0;
									if (value < 0) value = 0;
									if (value > 50) value = 50;
									setConfig({ ...config, damping: value });
									setDampingInput(value.toString());
								}
							}}
							min="0"
							max="50"
							step="0.5"
							className="w-20 h-8 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 px-2 font-display text-white shadow-lg focus:ring-2 focus:ring-[#47B5FF]/50 focus:outline-none"
						/>
					</div>
					<div className="relative">
						<div className="absolute inset-0 bg-[#47B5FF]/10 rounded-full"></div>
						<input
							type="range"
							min="0"
							max="50"
							step="0.5"
							value={config.damping}
							onChange={(e) =>
								setConfig({ ...config, damping: parseFloat(e.target.value) })
							}
							className="w-full h-2 bg-transparent appearance-none z-10 relative [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#47B5FF] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(71,181,255,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
						/>
						<div
							className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-[#47B5FF] to-[#DFF6FF] rounded-full -translate-y-1/2 pointer-events-none"
							style={{ width: `${(config.damping / 50) * 100}%` }}
						></div>
					</div>
				</div>
				<div>
					<div className="flex justify-between items-center mb-3">
						<label className="text-white font-display flex items-center">
							<FiPlay className="mr-2 text-[#47B5FF]" />
							Speed: {config.speed.toFixed(1)}x
						</label>
						<input
							type="number"
							value={speedInput}
							onChange={(e) => {
								setSpeedInput(e.target.value);
							}}
							onBlur={() => {
								let value = parseFloat(speedInput);
								if (isNaN(value)) value = 0.1;
								if (value < 0.1) value = 0.1;
								if (value > 3) value = 3;
								setConfig({ ...config, speed: value });
								setSpeedInput(value.toString());
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									let value = parseFloat(speedInput);
									if (isNaN(value)) value = 0.1;
									if (value < 0.1) value = 0.1;
									if (value > 3) value = 3;
									setConfig({ ...config, speed: value });
									setSpeedInput(value.toString());
								}
							}}
							min="0.1"
							max="3"
							step="0.1"
							className="w-20 h-8 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 px-2 font-display text-white shadow-lg focus:ring-2 focus:ring-[#47B5FF]/50 focus:outline-none"
						/>
					</div>
					<div className="relative">
						<div className="absolute inset-0 bg-[#47B5FF]/10 rounded-full"></div>
						<input
							type="range"
							min="0.1"
							max="3"
							step="0.1"
							value={config.speed}
							onChange={(e) =>
								setConfig({ ...config, speed: parseFloat(e.target.value) })
							}
							className="w-full h-2 bg-transparent appearance-none z-10 relative [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#47B5FF] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(71,181,255,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
						/>
						<div
							className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-[#47B5FF] to-[#DFF6FF] rounded-full -translate-y-1/2 pointer-events-none"
							style={{ width: `${((config.speed - 0.1) / 2.9) * 100}%` }}
						></div>
					</div>
				</div>
			</div>
			<div className="mt-6 lg:mt-8 space-y-3 lg:space-y-4">
				<button
					onClick={() => setIsVertical(!isVertical)}
					className="max-w-md mx-auto w-full lg:w-full p-2.5 lg:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all font-display flex items-center justify-center text-sm lg:text-base shadow-lg active:scale-95"
				>
					{isVertical ? (
						<MdSwapVert className="mr-2 text-lg lg:text-xl text-[#47B5FF]" />
					) : (
						<MdSwapHoriz className="mr-2 text-lg lg:text-xl text-[#47B5FF]" />
					)}
					{isVertical ? "Vertical Motion" : "Horizontal Motion"}
				</button>
				{!hidePlayButton && (
					<button
						onClick={playAnimation}
						className="max-w-md mx-auto w-full lg:w-full px-6 lg:px-8 py-3 lg:py-4 rounded-xl bg-gradient-to-r from-[#0D6EFD] to-[#47B5FF] text-white font-display font-semibold hover:from-[#0B5ED7] hover:to-[#3B9AE1] transition-all shadow-[0_4px_14px_0_rgba(71,181,255,0.4)] flex items-center justify-center text-sm lg:text-base active:scale-95"
					>
						{isPlaying ? (
							<FiPause className="mr-2" />
						) : (
							<FiPlay className="mr-2" />
						)}
						{isPlaying ? "Pause Animation" : "Play Animation"}
					</button>
				)}
			</div>
			<div className="mt-8 lg:mt-10">
				<h3 className="text-white font-display font-semibold mb-3 flex items-center text-sm lg:text-base">
					<FiSave className="mr-2 text-[#47B5FF]" />
					Presets
				</h3>
				<div className="grid grid-cols-2 gap-2 mb-3">
					{presets.map((preset) => (
						<div
							key={preset.id}
							className={`p-2.5 lg:p-3 rounded-xl backdrop-blur-md cursor-pointer transition-all text-sm lg:text-base shadow-lg ${
								selectedPreset === preset.id
									? "bg-[#47B5FF]/30 border border-[#47B5FF]/50"
									: "bg-white/10 border border-white/20 hover:bg-white/15"
							}`}
							onClick={() => {
								setConfig(preset.config);
								setSelectedPreset(preset.id);
							}}
						>
							<div className="flex justify-between items-center">
								<span className="text-white font-display">{preset.name}</span>
								<button
									onClick={(e) => {
										e.stopPropagation();
										const newPresets = presets.filter(
											(p) => p.id !== preset.id
										);
										setPresets(newPresets);
										if (selectedPreset === preset.id) setSelectedPreset(null);
									}}
									className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-6 w-8 rounded-xl flex items-center justify-center transition-colors font-bold text-lg"
								>
									×
								</button>
							</div>
						</div>
					))}
				</div>
				{!showPresetForm && (
					<div className="flex flex-col gap-2">
						<button
							onClick={() => {
								setShowPresetForm(true);
								setPresetError("");
							}}
							className="max-w-md mx-auto w-full lg:w-full p-2.5 lg:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all font-display flex items-center justify-center text-sm lg:text-base shadow-lg active:scale-95"
						>
							<FiSave className="mr-2 text-[#47B5FF]" />
							Save Current as Preset
						</button>
						{presetError && (
							<div className="text-red-300 text-xs text-center max-w-md mx-auto">
								{presetError}
							</div>
						)}
					</div>
				)}
				{showPresetForm && (
					<div className="flex flex-col gap-2 mt-2 max-w-md mx-auto">
						<input
							type="text"
							value={presetName}
							onChange={(e) => {
								setPresetName(e.target.value);
								if (presetError) setPresetError("");
							}}
							placeholder="Preset name"
							maxLength={10}
							className="rounded-full bg-white/20 backdrop-blur-md text-center font-display text-white shadow-lg focus:ring-2 focus:ring-[#47B5FF]/50 focus:outline-none border border-white/30 transition-all duration-200 px-4 py-2"
							autoFocus
						/>
						{presetError && (
							<div className="text-red-300 text-xs text-center">
								{presetError}
							</div>
						)}
						<div className="flex gap-2">
							<button
								onClick={handleSavePreset}
								className="flex-1 rounded-full bg-gradient-to-r from-[#0D6EFD] to-[#47B5FF] text-white font-display font-semibold px-4 py-2 hover:from-[#0B5ED7] hover:to-[#3B9AE1] transition-all shadow-lg active:scale-95"
							>
								Save
							</button>
							<button
								onClick={() => {
									setShowPresetForm(false);
									setPresetName("");
									setPresetError("");
								}}
								className="flex-1 rounded-full bg-white/10 backdrop-blur-md text-white font-display font-semibold px-4 py-2 hover:bg-white/20 transition-all shadow-lg active:scale-95 border border-white/20"
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>
			<div className="mt-8 lg:mt-10">
				<h3 className="text-white font-display font-semibold mb-3 text-sm lg:text-base flex items-center">
					<FiCopy className="mr-2 text-[#47B5FF]" />
					Generated CSS
				</h3>
				<div className="relative">
					<pre className="bg-[#06283D]/80 backdrop-blur-md border border-[#47B5FF]/30 rounded-xl p-3 lg:p-4 text-[#DFF6FF] font-mono text-xs lg:text-sm overflow-auto max-h-[150px] lg:max-h-[200px] whitespace-pre shadow-inner">
						{typeof generateCSS === "function"
							? generateCSS(canvasSize, true)
							: ""}
					</pre>
				</div>
				<button
					onClick={handleCopyCSS}
					className="max-w-md mx-auto w-full lg:w-full p-2.5 lg:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all font-display flex items-center justify-center text-sm lg:text-base shadow-lg mt-3 active:scale-95"
				>
					<FiCopy className="mr-2 text-[#47B5FF]" />
					Copy CSS
				</button>
			</div>
		</div>
	);
};

interface SpringPreviewProps {
	isAnimating: boolean;
	generateCSS: (
		canvas: { width: number; height: number },
		forCopy?: boolean
	) => string;
	isVertical: boolean;
	canvasSize: { width: number; height: number };
}

const SpringPreview: React.FC<
	SpringPreviewProps & { noRounded?: boolean; extraClassName?: string }
> = ({
	isAnimating,
	generateCSS,
	isVertical,
	canvasSize,
	noRounded = false,
	extraClassName = "",
}) => {
	const previewRef = React.useRef<HTMLDivElement>(null);

	return (
		<div
			ref={previewRef}
			className={`h-full relative bg-gradient-to-br from-[#06283D]/80 to-[#1E5F74]/75 backdrop-blur-xl border border-[#47B5FF]/30 ${
				noRounded ? "" : "rounded-2xl"
			} shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.6)] transition-shadow duration-300 overflow-hidden flex flex-col ${extraClassName}`}
		>
			<div className="p-4 lg:p-6 border-b border-[#47B5FF]/30 bg-[#06283D]/90">
				<h2 className="font-display text-xl lg:text-2xl font-bold text-white text-center">
					Spring Animation
				</h2>
			</div>
			<div className="flex-1 flex items-center justify-center relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwNjI4M0QiIG9wYWNpdHk9IjAuMSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PGNpcmNsZSBzdHJva2U9IiM0N0I1RkYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIiBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiLz48L2c+PC9zdmc+')]">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#06283D]/40"></div>
				<div
					className={`h-1/3 aspect-square bg-gradient-to-br from-[#0D6EFD] to-[#47B5FF] rounded-2xl shadow-[0_0_30px_0_rgba(71,181,255,0.4)] border border-[#47B5FF]/70 absolute transition-all duration-500 ease-in-out mobile-small-square ${
						isAnimating ? "spring-animated" : "animate-pulse"
					}`}
					style={{
						left: "50%",
						top: "50%",
						transformOrigin: "center",
						transform: isAnimating
							? undefined
							: isVertical
							? "translate(-50%, -50%)"
							: "translate(-50%, -50%)",
					}}
				/>

				{}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-[90%] h-[90%] border-2 border-[#47B5FF]/10 rounded-xl"></div>
					<div className="absolute w-[70%] h-[70%] border border-[#47B5FF]/10 rounded-xl"></div>
					<div className="absolute w-[50%] h-[50%] border border-[#47B5FF]/10 rounded-xl"></div>
					<div className="absolute w-[30%] h-[30%] border border-[#47B5FF]/10 rounded-xl"></div>
					{}
					<div className="absolute h-full w-[1px] bg-[#47B5FF]/10"></div>
					<div className="absolute w-full h-[1px] bg-[#47B5FF]/10"></div>
				</div>
			</div>
			<style>
				{typeof generateCSS === "function"
					? generateCSS(canvasSize, false)
					: ""}
			</style>
			<style>{`
        @media (max-width: 440px) {
          .mobile-small-square {
            height: 24vw !important;
            min-height: 40px !important;
            max-height: 60px !important;
          }
        }
      `}</style>
		</div>
	);
};

interface LayoutProps extends SpringPanelProps {
	isAnimating: boolean;
}

const DesktopLayout: React.FC<
	LayoutProps & { canvasSize: { width: number; height: number } }
> = (props) => (
	<div className="flex h-screen w-full bg-gradient-to-br from-[#06283D] via-[#1A3C40] to-[#256D85] overflow-hidden">
		<div className="w-[400px] p-6 h-full overflow-auto">
			<SpringPanel {...props} />
		</div>
		<div className="flex-1 p-6 h-full">
			<SpringPreview
				isAnimating={props.isAnimating}
				generateCSS={props.generateCSS}
				isVertical={props.isVertical}
				canvasSize={props.canvasSize}
			/>
		</div>
	</div>
);

const MobileLayout: React.FC<
	LayoutProps & { canvasSize: { width: number; height: number } }
> = (props) => (
	<div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#06283D] via-[#1A3C40] to-[#256D85] overflow-hidden">
		<div className="flex-1 flex items-stretch justify-center">
			<div
				className="w-full min-h-[65vh] flex-1 flex items-center justify-center"
				style={{ maxWidth: "100vw" }}
			>
				<div className="w-full h-full mb-4">
					<SpringPreview
						isAnimating={props.isAnimating}
						generateCSS={props.generateCSS}
						isVertical={props.isVertical}
						canvasSize={props.canvasSize}
						noRounded={true}
					/>
				</div>
			</div>
		</div>
		<div className="w-full flex-none flex justify-center px-4 mb-2 mt-4">
			<button
				onClick={props.playAnimation}
				className="max-w-md mx-auto w-full lg:w-full px-6 lg:px-8 py-3 lg:py-4 rounded-xl bg-gradient-to-r from-[#0D6EFD] to-[#47B5FF] text-white font-display font-semibold hover:from-[#0B5ED7] hover:to-[#3B9AE1] transition-all shadow-[0_4px_14px_0_rgba(71,181,255,0.4)] flex items-center justify-center text-sm lg:text-base active:scale-95"
			>
				{props.isPlaying ? (
					<FiPause className="mr-2" />
				) : (
					<FiPlay className="mr-2" />
				)}
				{props.isPlaying ? "Pause Animation" : "Play Animation"}
			</button>
		</div>
		<div className="w-full p-4">
			<SpringPanel {...props} hidePlayButton />
		</div>
	</div>
);

const SpringAnimationGenerator: React.FC = () => {
	const [config, setConfig] = useState<SpringConfig>({
		mass: 1,
		stiffness: 100,
		damping: 10,
		speed: 1,
	});

	const HORIZONTAL_AMPLITUDE_MULTIPLIER = 2.5;
	const VERTICAL_AMPLITUDE_MULTIPLIER = 1.8;

	const [isAnimating, setIsAnimating] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isVertical, setIsVertical] = useState(false);
	const [showCopied, setShowCopied] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [presets, setPresets] = useState<Preset[]>([
		{
			id: "1",
			name: "Gentle",
			config: { mass: 1, stiffness: 120, damping: 14, speed: 1 },
		},
		{
			id: "2",
			name: "Bouncy",
			config: { mass: 1, stiffness: 180, damping: 8, speed: 1 },
		},
		{
			id: "3",
			name: "Stiff",
			config: { mass: 1, stiffness: 280, damping: 20, speed: 1 },
		},
		{
			id: "4",
			name: "Elastic",
			config: { mass: 1.2, stiffness: 150, damping: 5, speed: 1 },
		},
	]);
	const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
	const previewRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			!(window as any).tailwindConfigInjected
		) {
			(window as any).tailwindConfigInjected = true;

			const style = document.createElement("style");
			style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Comfortaa:wght@300;400;500;600;700&display=swap');
                
                .shadow-blue-soft {
                  box-shadow: 0 4px 14px -1px rgba(71, 181, 255, 0.2), 0 2px 8px -1px rgba(71, 181, 255, 0.15);
                }
                
                .shadow-blue-strong {
                  box-shadow: 0 10px 25px -3px rgba(71, 181, 255, 0.3), 0 4px 12px -2px rgba(71, 181, 255, 0.2);
                }
                
                .shadow-blue-strong:hover {
                  box-shadow: 0 20px 35px -5px rgba(71, 181, 255, 0.35), 0 10px 20px -5px rgba(71, 181, 255, 0.2);
                }
                
                .font-display {
                  font-family: 'Quicksand', 'Comfortaa', sans-serif;
                }
                
                @media (min-width: 1396px) {
                  .xxl\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
                }
                
                .animate-in {
                  animation: slideIn 0.3s ease-out;
                }
                
                .slide-in-from-right-2 {
                  animation: slideInFromRight 0.3s ease-out;
                }
                
                @keyframes slideIn {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideInFromRight {
                  from { opacity: 0; transform: translateX(100%); }
                  to { opacity: 1; transform: translateX(0); }
                }
                
                
                ::-webkit-scrollbar {
                  width: 8px;
                  height: 8px;
                  background-color: transparent;
                }
                
                ::-webkit-scrollbar-track {
                  background-color: rgba(6, 40, 61, 0.2);
                  border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                  background-color: rgba(71, 181, 255, 0.6);
                  border-radius: 10px;
                  border: 2px solid rgba(6, 40, 61, 0.3);
                  background-clip: padding-box;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                  background-color: rgba(71, 181, 255, 0.8);
                }
                
                ::-webkit-scrollbar-corner {
                  background-color: transparent;
                }
              `;
			document.head.appendChild(style);
		}
	}, []);

	useEffect(() => {
		function updateSize() {
			if (previewRef.current) {
				setCanvasSize({
					width: previewRef.current.offsetWidth,
					height: previewRef.current.offsetHeight,
				});
			}
		}
		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	const springKeyframes = useMemo(() => {
		const steps = 120;
		const springSteps = [];
		const boxSize = canvasSize.width > 600 ? 80 : 64;
		let amplitude =
			150 *
			(isVertical
				? VERTICAL_AMPLITUDE_MULTIPLIER
				: HORIZONTAL_AMPLITUDE_MULTIPLIER);
		if (canvasSize.width && canvasSize.height) {
			amplitude = isVertical
				? ((canvasSize.height - boxSize) / 2) * VERTICAL_AMPLITUDE_MULTIPLIER
				: ((canvasSize.width - boxSize) / 2) * HORIZONTAL_AMPLITUDE_MULTIPLIER;
		}
		const endingSteps = 20;

		for (let i = 0; i <= steps; i++) {
			const t = i / steps;
			const dampingFactor = Math.exp(-config.damping * t);
			const angularFrequency = Math.sqrt(config.stiffness / config.mass);
			const springFactor = Math.sin(angularFrequency * t * Math.PI * 2);

			let position;
			if (i > steps - endingSteps) {
				const endingProgress = (i - (steps - endingSteps)) / endingSteps;
				const smoothEnd = 1 - endingProgress * endingProgress;
				position = dampingFactor * springFactor * amplitude * smoothEnd;
			} else {
				position = dampingFactor * springFactor * amplitude;
			}

			springSteps.push({
				percentage: (i / steps) * 100,
				position: position,
			});
		}

		return springSteps;
	}, [config, canvasSize, isVertical]);

	const generateCSS = (
		canvas: { width: number; height: number },
		forCopy = false
	) => {
		const boxSize = canvas.width > 600 ? 80 : 64;
		let amplitude =
			150 *
			(isVertical
				? VERTICAL_AMPLITUDE_MULTIPLIER
				: HORIZONTAL_AMPLITUDE_MULTIPLIER);
		if (canvas.width && canvas.height) {
			amplitude = isVertical
				? ((canvas.height - boxSize) / 2) * VERTICAL_AMPLITUDE_MULTIPLIER
				: ((canvas.width - boxSize) / 2) * HORIZONTAL_AMPLITUDE_MULTIPLIER;
		}

		const keyframePoints = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
		const keyframes = keyframePoints
			.map((percent) => {
				const stepIndex = Math.round((percent / 100) * springKeyframes.length);
				const step =
					springKeyframes[Math.min(stepIndex, springKeyframes.length - 1)];

				const transform = isVertical
					? `translate(-50%, calc(-50% + ${step.position.toFixed(1)}px))`
					: `translate(calc(-50% + ${step.position.toFixed(1)}px), -50%)`;

				return `  ${percent}% { transform: ${transform}; }`;
			})
			.join("\n");

		const duration = (2 / config.speed).toFixed(1);

		return `
@keyframes springAnimation {
${keyframes}
}

.spring-animated {
  animation: springAnimation ${duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite;${
			forCopy
				? ""
				: `
  animation-play-state: ${isPlaying ? "running" : "paused"};`
		}
}






`;
	};

	const playAnimation = () => {
		if (isPlaying) {
			setIsPlaying(false);
			setIsAnimating(false);
		} else {
			setIsPlaying(true);
			setIsAnimating(false);
			requestAnimationFrame(() => setIsAnimating(true));
		}
	};

	const isMobile = useIsMobile();

	const handleCopyCSS = () => {
		navigator.clipboard.writeText(generateCSS(canvasSize, true));
		setShowCopied(true);
		setTimeout(() => setIsVisible(true), 10);
		setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => setShowCopied(false), 300);
		}, 1700);
	};

	const layoutProps = {
		config,
		setConfig,
		presets,
		setPresets,
		selectedPreset,
		setSelectedPreset,
		isVertical,
		setIsVertical,
		playAnimation,
		generateCSS,
		isAnimating,
		onCopyCSS: handleCopyCSS,
		isPlaying,
		canvasSize,
	};

	return (
		<>
			<link
				href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Comfortaa:wght@300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<div className="absolute inset-0 bg-gradient-noise opacity-5"></div>
			{isMobile ? (
				<MobileLayout {...layoutProps} />
			) : (
				<DesktopLayout {...layoutProps} />
			)}
			{showCopied && (
				<div
					className={`fixed top-4 right-4 z-50 bg-gradient-to-r from-[#0D6EFD] to-[#47B5FF] text-white px-4 py-3 rounded-xl shadow-[0_4px_14px_0_rgba(71,181,255,0.4)] border border-[#47B5FF]/50 font-display text-sm transform transition-all duration-300 ease-out ${
						isVisible ? "translate-x-0" : "translate-x-full"
					}`}
				>
					<div className="flex items-center">
						<FiCopy className="mr-2" />
						CSS copied to clipboard!
					</div>
				</div>
			)}
			<style>{`
                .bg-gradient-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
            `}</style>
		</>
	);
};

export default SpringAnimationGenerator;
