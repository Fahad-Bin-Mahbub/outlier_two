'use client'
import React, { useState, useEffect, useRef, useCallback } from "react";

// TypeScript interfaces
interface BeatPattern {
	id: string;
	name: string;
	bpm: number;
	timestamp: number;
}

interface AudioData {
	dataArray: Uint8Array;
	bufferLength: number;
}

const DJPracticeApp: React.FC = () => {
	// Audio state
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [audioData, setAudioData] = useState<AudioData | null>(null);
	const [currentBPM, setCurrentBPM] = useState<number>(0);
	const [savedPatterns, setSavedPatterns] = useState<BeatPattern[]>([]);
	const [beatTimes, setBeatTimes] = useState<number[]>([]);
	const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
	const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
	const [patternName, setPatternName] = useState<string>("");
	const [notification, setNotification] = useState<string | null>(null);

	// Refs
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	const beatDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const prevVolumeRef = useRef<number>(0);
	const beatCountRef = useRef<number>(0);
	const lastBeatTimeRef = useRef<number>(0);
	const tempBPMRef = useRef<number[]>([]);

	// Initialize Audio Context and Analyzer
	const initAudioContext = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Create audio context
			const audioContext = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
			audioContextRef.current = audioContext;

			// Create analyzer
			const analyser = audioContext.createAnalyser();
			analyser.fftSize = 2048;
			analyserRef.current = analyser;

			// Connect source to analyzer
			const source = audioContext.createMediaStreamSource(stream);
			source.connect(analyser);
			sourceRef.current = source;

			// Set up audio data
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			setAudioData({ dataArray, bufferLength });

			// Start analyzing
			setIsRecording(true);
			drawWaveform();
			startBeatDetection();

			// Show notification with haptic feedback if available
			showNotificationWithHaptic("Microphone connected");
		} catch (error) {
			console.error("Error accessing microphone:", error);
			showNotificationWithHaptic("Error: Microphone access denied");
		}
	}, []);

	// Stop recording
	const stopRecording = useCallback(() => {
		if (audioContextRef.current) {
			if (sourceRef.current) {
				sourceRef.current.disconnect();
				sourceRef.current = null;
			}

			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}

			if (beatDetectionIntervalRef.current) {
				clearInterval(beatDetectionIntervalRef.current);
				beatDetectionIntervalRef.current = null;
			}

			setIsRecording(false);
			showNotificationWithHaptic("Recording stopped");
		}
	}, []);

	// Load saved patterns from localStorage
	useEffect(() => {
		const savedData = localStorage.getItem("djPracticePatterns");
		if (savedData) {
			setSavedPatterns(JSON.parse(savedData));
		}

		// Clean up on unmount
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (beatDetectionIntervalRef.current) {
				clearInterval(beatDetectionIntervalRef.current);
			}
			if (
				audioContextRef.current &&
				audioContextRef.current.state !== "closed"
			) {
				audioContextRef.current.close();
			}
		};
	}, []);

	// Draw waveform
	const drawWaveform = useCallback(() => {
		if (!canvasRef.current || !analyserRef.current || !audioData) return;

		const canvas = canvasRef.current;
		const canvasCtx = canvas.getContext("2d");
		if (!canvasCtx) return;

		// Set canvas dimensions
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		const { width, height } = canvas;
		const { dataArray, bufferLength } = audioData;

		// Get audio data
		analyserRef.current.getByteTimeDomainData(dataArray);

		// Clear canvas
		canvasCtx.fillStyle = "rgba(240, 255, 255, 0.2)";
		canvasCtx.fillRect(0, 0, width, height);

		// Draw waveform
		canvasCtx.lineWidth = 3;
		canvasCtx.strokeStyle = "#00CED1";
		canvasCtx.beginPath();

		const sliceWidth = width / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const v = dataArray[i] / 128.0;
			const y = (v * height) / 2;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.stroke();

		// Continue animation
		animationFrameRef.current = requestAnimationFrame(drawWaveform);
	}, [audioData]);

	// Start beat detection
	const startBeatDetection = useCallback(() => {
		if (!analyserRef.current || !audioData) return;

		beatDetectionIntervalRef.current = setInterval(() => {
			if (!analyserRef.current || !audioData) return;

			// Get audio data
			const { dataArray } = audioData;
			analyserRef.current.getByteTimeDomainData(dataArray);

			// Calculate current volume
			let sum = 0;
			for (let i = 0; i < dataArray.length; i++) {
				sum += Math.abs(dataArray[i] - 128);
			}
			const currentVolume = sum / dataArray.length;

			// Detect beat
			const threshold = 10;
			const now = Date.now();

			if (
				currentVolume > threshold &&
				currentVolume > prevVolumeRef.current * 1.1 &&
				now - lastBeatTimeRef.current > 200
			) {
				// Beat detected
				beatCountRef.current++;
				const beatTime = now;
				lastBeatTimeRef.current = beatTime;

				// Update beat times array (keep last 8 beats)
				const newBeatTimes = [...beatTimes, beatTime].slice(-8);
				setBeatTimes(newBeatTimes);

				// Calculate BPM
				if (newBeatTimes.length >= 2) {
					const timeDiffs = [];
					for (let i = 1; i < newBeatTimes.length; i++) {
						timeDiffs.push(newBeatTimes[i] - newBeatTimes[i - 1]);
					}

					const avgTimeDiff =
						timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
					const bpm = Math.round(60000 / avgTimeDiff);

					// Store temporary BPM
					tempBPMRef.current.push(bpm);
					if (tempBPMRef.current.length > 5) {
						tempBPMRef.current.shift();
					}

					// Calculate average BPM
					const avgBPM = Math.round(
						tempBPMRef.current.reduce((a, b) => a + b, 0) /
							tempBPMRef.current.length
					);

					// Update BPM if it's reasonable
					if (avgBPM >= 60 && avgBPM <= 200) {
						setCurrentBPM(avgBPM);
					}
				}

				// Trigger haptic feedback for beat
				if ("vibrate" in navigator) {
					navigator.vibrate(20);
				}
			}

			prevVolumeRef.current = currentVolume;
		}, 20);
	}, [audioData, beatTimes]);

	// Save current pattern
	const savePattern = useCallback(() => {
		if (patternName.trim() === "") {
			showNotificationWithHaptic("Please enter a pattern name");
			return;
		}

		const newPattern: BeatPattern = {
			id: Date.now().toString(),
			name: patternName.trim(),
			bpm: currentBPM,
			timestamp: Date.now(),
		};

		const updatedPatterns = [...savedPatterns, newPattern];
		setSavedPatterns(updatedPatterns);
		localStorage.setItem("djPracticePatterns", JSON.stringify(updatedPatterns));

		setShowSaveModal(false);
		setPatternName("");
		setSelectedPattern(newPattern.id);
		showNotificationWithHaptic("Pattern saved");
	}, [patternName, currentBPM, savedPatterns]);

	// Delete pattern
	const deletePattern = useCallback(
		(id: string) => {
			const updatedPatterns = savedPatterns.filter(
				(pattern) => pattern.id !== id
			);
			setSavedPatterns(updatedPatterns);
			localStorage.setItem(
				"djPracticePatterns",
				JSON.stringify(updatedPatterns)
			);

			if (selectedPattern === id) {
				setSelectedPattern(null);
			}

			showNotificationWithHaptic("Pattern deleted");
		},
		[savedPatterns, selectedPattern]
	);

	// Show notification with haptic feedback
	const showNotificationWithHaptic = (message: string) => {
		setNotification(message);

		// Haptic feedback
		if ("vibrate" in navigator) {
			navigator.vibrate(50);
		}

		// Clear notification after 2 seconds
		setTimeout(() => {
			setNotification(null);
		}, 2000);
	};

	return (
		<div className="dj-practice-app">
			<div className="app-container">
				<header className="app-header">
					<h1>DJ Practice Studio</h1>
					<p className="app-subtitle">Analyze beats in real-time</p>
				</header>

				<main className="app-content">
					{/* Waveform Visualization */}
					<div className="waveform-container">
						<canvas ref={canvasRef} className="waveform-canvas"></canvas>
						<div className="bpm-display">
							<div className="bpm-value">{currentBPM}</div>
							<div className="bpm-label">BPM</div>
						</div>
					</div>

					{/* Beat Markers */}
					<div className="beat-markers-container">
						{Array.from({ length: 8 }).map((_, index) => {
							const isActive =
								beatTimes.length > 0 &&
								index < beatTimes.length &&
								Date.now() - beatTimes[beatTimes.length - 1 - index] < 2000;

							return (
								<div
									key={index}
									className={`beat-marker ${isActive ? "active" : ""}`}
								>
									<div className="beat-marker-inner"></div>
								</div>
							);
						})}
					</div>

					{/* Controls */}
					<div className="controls">
						<button
							className={`control-button ${isRecording ? "recording" : ""}`}
							onClick={isRecording ? stopRecording : initAudioContext}
						>
							{isRecording ? "Stop" : "Start"}
						</button>

						<button
							className="control-button save-button"
							onClick={() => setShowSaveModal(true)}
							disabled={!isRecording || currentBPM === 0}
						>
							Save Pattern
						</button>
					</div>

					{/* Saved Patterns */}
					<div className="saved-patterns">
						<h2>Saved Patterns</h2>
						{savedPatterns.length === 0 ? (
							<p className="no-patterns">No saved patterns yet</p>
						) : (
							<div className="patterns-list">
								{savedPatterns.map((pattern) => (
									<div
										key={pattern.id}
										className={`pattern-item ${
											selectedPattern === pattern.id ? "selected" : ""
										}`}
										onClick={() => setSelectedPattern(pattern.id)}
									>
										<div className="pattern-info">
											<div className="pattern-name">{pattern.name}</div>
											<div className="pattern-bpm">{pattern.bpm} BPM</div>
										</div>
										<button
											className="delete-button"
											onClick={(e) => {
												e.stopPropagation();
												deletePattern(pattern.id);
											}}
										>
											Delete
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</main>

				{/* Save Modal */}
				{showSaveModal && (
					<div className="modal-overlay">
						<div className="modal">
							<h2>Save Beat Pattern</h2>
							<div className="modal-content">
								<label htmlFor="patternName">Pattern Name:</label>
								<input
									type="text"
									id="patternName"
									value={patternName}
									onChange={(e) => setPatternName(e.target.value)}
									placeholder="e.g., House Rhythm"
								/>
								<div className="modal-bpm">Current BPM: {currentBPM}</div>
							</div>
							<div className="modal-actions">
								<button onClick={() => setShowSaveModal(false)}>Cancel</button>
								<button onClick={savePattern}>Save</button>
							</div>
						</div>
					</div>
				)}

				{/* Notification */}
				{notification && <div className="notification">{notification}</div>}
			</div>

			<style jsx>{`
				/* Base Styles */
				* {
					box-sizing: border-box;
					margin: 0;
					padding: 0;
					font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
				}

				.dj-practice-app {
					display: flex;
					justify-content: center;
					align-items: center;
					min-height: 100vh;
					background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
					padding: 16px;
				}

				.app-container {
					width: 100%;
					max-width: 480px;
					background-color: white;
					border-radius: 24px;
					box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1),
						0 4px 8px rgba(0, 0, 0, 0.05);
					overflow: hidden;
					position: relative;
					padding-bottom: 20px;
				}

				/* Header */
				.app-header {
					background: linear-gradient(135deg, #20b2aa 0%, #00ced1 100%);
					color: white;
					padding: 24px;
					text-align: center;
					border-radius: 24px 24px 0 0;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
				}

				.app-header h1 {
					font-size: 28px;
					margin-bottom: 8px;
					font-weight: 600;
				}

				.app-subtitle {
					font-size: 16px;
					opacity: 0.9;
				}

				/* Main Content */
				.app-content {
					padding: 20px;
				}

				/* Waveform */
				.waveform-container {
					height: 180px;
					background-color: rgba(240, 255, 255, 0.5);
					border-radius: 16px;
					position: relative;
					margin-bottom: 24px;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
					overflow: hidden;
				}

				.waveform-canvas {
					width: 100%;
					height: 100%;
				}

				/* BPM Display */
				.bpm-display {
					position: absolute;
					top: 16px;
					right: 16px;
					background-color: rgba(0, 206, 209, 0.85);
					color: white;
					border-radius: 50%;
					width: 70px;
					height: 70px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
				}

				.bpm-value {
					font-size: 24px;
					font-weight: bold;
					line-height: 1;
				}

				.bpm-label {
					font-size: 14px;
					opacity: 0.9;
				}

				/* Beat Markers */
				.beat-markers-container {
					display: flex;
					justify-content: center;
					gap: 16px;
					margin-bottom: 24px;
					flex-wrap: wrap;
				}

				.beat-marker {
					width: 50px;
					height: 50px;
					border-radius: 50%;
					background-color: #f0f8ff;
					display: flex;
					justify-content: center;
					align-items: center;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					transition: all 0.2s ease;
				}

				.beat-marker-inner {
					width: 70%;
					height: 70%;
					border-radius: 50%;
					background-color: #e0f7fa;
					transition: all 0.1s ease;
				}

				.beat-marker.active {
					transform: scale(1.1);
					background-color: #00ced1;
				}

				.beat-marker.active .beat-marker-inner {
					background-color: #20b2aa;
				}

				/* Controls */
				.controls {
					display: flex;
					gap: 16px;
					margin-bottom: 24px;
				}

				.control-button {
					flex: 1;
					padding: 14px 20px;
					border: none;
					border-radius: 12px;
					background-color: #e0f7fa;
					color: #00838f;
					font-size: 16px;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.2s ease;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
				}

				.control-button:hover {
					background-color: #b2ebf2;
				}

				.control-button:active {
					transform: translateY(2px);
					box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
				}

				.control-button.recording {
					background-color: #ff6b6b;
					color: white;
				}

				.control-button:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				/* Saved Patterns */
				.saved-patterns {
					background-color: #f5f5f5;
					border-radius: 16px;
					padding: 20px;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
				}

				.saved-patterns h2 {
					font-size: 18px;
					margin-bottom: 16px;
					color: #333;
				}

				.no-patterns {
					text-align: center;
					color: #888;
					padding: 16px 0;
				}

				.patterns-list {
					display: flex;
					flex-direction: column;
					gap: 12px;
					max-height: 200px;
					overflow-y: auto;
				}

				.pattern-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: white;
					border-radius: 12px;
					padding: 14px 16px;
					cursor: pointer;
					transition: all 0.2s ease;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
				}

				.pattern-item:hover {
					background-color: #f0f8ff;
				}

				.pattern-item.selected {
					background-color: #e0f7fa;
					border-left: 4px solid #00ced1;
				}

				.pattern-name {
					font-weight: 600;
					margin-bottom: 4px;
				}

				.pattern-bpm {
					font-size: 14px;
					color: #666;
				}

				.delete-button {
					background-color: #ffebee;
					color: #d32f2f;
					border: none;
					border-radius: 8px;
					padding: 8px 12px;
					font-size: 14px;
					cursor: pointer;
					transition: all 0.2s ease;
				}

				.delete-button:hover {
					background-color: #ffcdd2;
				}

				/* Modal */
				.modal-overlay {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: rgba(0, 0, 0, 0.5);
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 1000;
				}

				.modal {
					background-color: white;
					border-radius: 16px;
					padding: 24px;
					width: 90%;
					max-width: 360px;
					box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
				}

				.modal h2 {
					margin-bottom: 16px;
					color: #333;
					text-align: center;
				}

				.modal-content {
					margin-bottom: 24px;
				}

				.modal label {
					display: block;
					margin-bottom: 8px;
					color: #555;
				}

				.modal input {
					width: 100%;
					padding: 12px 16px;
					border: 1px solid #ddd;
					border-radius: 8px;
					font-size: 16px;
					margin-bottom: 16px;
				}

				.modal-bpm {
					text-align: center;
					font-size: 18px;
					font-weight: 600;
					color: #00838f;
				}

				.modal-actions {
					display: flex;
					justify-content: flex-end;
					gap: 12px;
				}

				.modal-actions button {
					padding: 10px 20px;
					border: none;
					border-radius: 8px;
					font-size: 16px;
					cursor: pointer;
					transition: all 0.2s ease;
				}

				.modal-actions button:first-child {
					background-color: #f5f5f5;
					color: #555;
				}

				.modal-actions button:last-child {
					background-color: #00ced1;
					color: white;
				}

				/* Notification */
				.notification {
					position: fixed;
					bottom: 24px;
					left: 50%;
					transform: translateX(-50%);
					background-color: rgba(0, 0, 0, 0.8);
					color: white;
					padding: 12px 24px;
					border-radius: 50px;
					font-size: 16px;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
					z-index: 1000;
					animation: fadeIn 0.3s, fadeOut 0.3s 1.7s;
				}

				/* Responsive Adjustments */
				@media (max-width: 480px) {
					.app-header h1 {
						font-size: 24px;
					}

					.waveform-container {
						height: 150px;
					}

					.beat-marker {
						width: 42px;
						height: 42px;
					}

					.bpm-display {
						width: 60px;
						height: 60px;
					}

					.bpm-value {
						font-size: 20px;
					}

					.control-button {
						padding: 12px 16px;
						font-size: 15px;
					}
				}

				/* Animations */
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translate(-50%, 20px);
					}
					to {
						opacity: 1;
						transform: translate(-50%, 0);
					}
				}

				@keyframes fadeOut {
					from {
						opacity: 1;
						transform: translate(-50%, 0);
					}
					to {
						opacity: 0;
						transform: translate(-50%, 20px);
					}
				}
			`}</style>
		</div>
	);
};

export default DJPracticeApp;
