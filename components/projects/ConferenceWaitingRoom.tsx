"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
	FaMicrophone,
	FaMicrophoneSlash,
	FaVideo,
	FaVideoSlash,
	FaCog,
	FaUsers,
	FaClock,
	FaWifi,
	FaCheckCircle,
	FaTimesCircle,
	FaExclamationCircle,
	FaChevronDown,
	FaTimes,
	FaCalendarAlt,
	FaCheckSquare,
	FaBuilding,
	FaUser,
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";

const useAudioLevel = () => {
	const [audioLevel, setAudioLevel] = useState(0);
	const [isRecording, setIsRecording] = useState(false);
	const streamRef = useRef(null);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const dataArrayRef = useRef(null);
	const rafIdRef = useRef(null);

	const startRecording = useCallback(async () => {
		try {
			if (streamRef.current) {
				setIsRecording(true);
				return;
			}

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;

			const AudioContext = window.AudioContext || window.webkitAudioContext;
			const audioContext = new AudioContext();
			audioContextRef.current = audioContext;

			const analyser = audioContext.createAnalyser();
			analyser.fftSize = 256;
			analyserRef.current = analyser;

			const source = audioContext.createMediaStreamSource(stream);
			source.connect(analyser);

			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			dataArrayRef.current = dataArray;

			const updateAudioLevel = () => {
				if (!analyserRef.current || !dataArrayRef.current) return;

				analyserRef.current.getByteFrequencyData(dataArrayRef.current);

				let sum = 0;
				for (let i = 0; i < dataArrayRef.current.length; i++) {
					sum += dataArrayRef.current[i];
				}
				const average = sum / dataArrayRef.current.length;

				const normalizedLevel = Math.min(
					100,
					Math.max(0, (average * 100) / 255)
				);
				setAudioLevel(normalizedLevel);

				rafIdRef.current = requestAnimationFrame(updateAudioLevel);
			};

			updateAudioLevel();
			setIsRecording(true);
		} catch (error) {
			console.error("Error starting audio recording:", error);
			stopRecording();
		}
	}, []);

	const stopRecording = useCallback(() => {
		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}

		if (audioContextRef.current && audioContextRef.current.state !== "closed") {
			audioContextRef.current.close();
			audioContextRef.current = null;
		}

		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}

		analyserRef.current = null;
		dataArrayRef.current = null;
		setAudioLevel(0);
		setIsRecording(false);
	}, []);

	useEffect(() => {
		return () => {
			stopRecording();
		};
	}, [stopRecording]);

	return [startRecording, stopRecording, audioLevel, isRecording];
};

interface Device {
	id: string;
	label: string;
}
interface DeviceTestStatus {
	status: "idle" | "testing" | "success" | "failed" | "warning";
	message?: string;
}

interface ModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	variant?: "default" | "error" | "warning" | "success";
}

interface UserSettings {
	name: string;
	company: string;
	selectedAudioDevice: string;
	selectedVideoDevice: string;
	isAudioEnabled: boolean;
	isVideoEnabled: boolean;
}

const Modal: React.FC<ModalProps> = ({
	title,
	isOpen,
	onClose,
	children,
	variant = "default",
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && modalRef.current) {
			modalRef.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const getVariantStyles = () => {
		switch (variant) {
			case "error":
				return {
					accent: "bg-red-500",
					icon: "🚨",
					title: "text-red-400",
					border: "border-red-500/30",
					glow: "shadow-red-500/20",
				};
			case "warning":
				return {
					accent: "bg-amber-500",
					icon: "⚠️",
					title: "text-amber-400",
					border: "border-amber-500/30",
					glow: "shadow-amber-500/20",
				};
			case "success":
				return {
					accent: "bg-emerald-500",
					icon: "✅",
					title: "text-emerald-400",
					border: "border-emerald-500/30",
					glow: "shadow-emerald-500/20",
				};
			default:
				return {
					accent: "bg-blue-500",
					icon: "ℹ️",
					title: "text-blue-400",
					border: "border-blue-500/30",
					glow: "shadow-blue-500/20",
				};
		}
	};

	const styles = getVariantStyles();

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center p-4"
				onClick={onClose}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
			>
				<motion.div
					className="absolute inset-0 bg-black/80 backdrop-blur-md"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				/>

				<motion.div
					ref={modalRef}
					className={`
						relative w-full max-w-lg mx-auto
						bg-gradient-to-br from-slate-900/95 to-slate-800/95
						border-2 ${styles.border} ${styles.glow}
						rounded-2xl shadow-2xl backdrop-blur-xl
						focus:outline-none focus:ring-4 focus:ring-blue-500/50
					`}
					onClick={(e) => e.stopPropagation()}
					initial={{ scale: 0.9, y: 20, opacity: 0 }}
					animate={{ scale: 1, y: 0, opacity: 1 }}
					exit={{ scale: 0.9, y: 20, opacity: 0 }}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 25,
						duration: 0.3,
					}}
					tabIndex={-1}
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
				>
					<div
						className={`absolute left-0 top-4 bottom-4 w-1 ${styles.accent} rounded-r-full`}
					/>

					<div className="p-8 pl-12">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3 flex-1">
								<motion.span
									className="text-2xl"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
								>
									{styles.icon}
								</motion.span>

								<h3
									id="modal-title"
									className={`text-2xl font-bold ${styles.title} leading-tight`}
								>
									{title}
								</h3>
							</div>

							<motion.button
								onClick={onClose}
								className={`
									ml-4 p-3 rounded-xl 
									text-slate-400 hover:text-white
									hover:bg-white/10 active:bg-white/20
									transition-all duration-200
									focus:outline-none focus:ring-2 focus:ring-white/50
									group
								`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								aria-label="Close modal"
							>
								<FaTimes className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" />
							</motion.button>
						</div>

						<motion.div
							className="text-slate-200 leading-relaxed"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1, duration: 0.3 }}
						>
							{children}
						</motion.div>
					</div>

					<div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

const ConferenceWaitingRoom = () => {
	const defaultSettings: UserSettings = {
		name: "",
		company: "",
		selectedAudioDevice: "",
		selectedVideoDevice: "",
		isAudioEnabled: false,
		isVideoEnabled: false,
	};

	const [name, setName] = useState<string>("");
	const [company, setCompany] = useState<string>("");
	const [hasStartedJoining, setHasStartedJoining] = useState<boolean>(false);
	const [joinAttempted, setJoinAttempted] = useState<boolean>(false);
	const [isClientSide, setIsClientSide] = useState<boolean>(false);

	const [queuePosition, setQueuePosition] = useState<number>(3);
	const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(
		Math.floor(Math.random() * 5) + 2
	);

	const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
	const webcamRef = useRef<Webcam>(null);

	const [startRecording, stopRecording, audioLevel, isRecording] =
		useAudioLevel();

	const [deviceTests, setDeviceTests] = useState<{
		camera: DeviceTestStatus;
		microphone: DeviceTestStatus;
		network: DeviceTestStatus;
	}>({
		camera: { status: "idle" },
		microphone: { status: "idle" },
		network: { status: "idle" },
	});

	const [networkSpeed, setNetworkSpeed] = useState<string | null>(null);
	const [availableAudioDevices, setAvailableAudioDevices] = useState<Device[]>(
		[]
	);
	const [availableVideoDevices, setAvailableVideoDevices] = useState<Device[]>(
		[]
	);
	const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
	const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");

	const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
	const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(true);
	const [joinTime] = useState<Date>(new Date());
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const [loadingDevices, setLoadingDevices] = useState<boolean>(true);
	const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [errorTitle, setErrorTitle] = useState<string>("");
	const [shouldRunTests, setShouldRunTests] = useState<boolean>(false);

	const [meeting, setMeeting] = useState<{
		title: string;
		host: string;
		startTime: string;
		agenda: Array<{ title: string; time: string }>;
	}>({
		title: "Quarterly Product Review",
		host: "Sarah Johnson",
		startTime: "10:00 AM",
		agenda: [
			{ title: "Welcome & Introductions", time: "10:00 AM" },
			{ title: "Q2 Performance Overview", time: "10:15 AM" },
			{ title: "Product Roadmap Discussion", time: "10:45 AM" },
			{ title: "Q&A Session", time: "11:15 AM" },
			{ title: "Next Steps & Closing", time: "11:45 AM" },
		],
	});

	useEffect(() => {
		setIsClientSide(true);

		try {
			const savedSettings = localStorage.getItem("conferenceUserSettings");
			if (savedSettings) {
				const settings: UserSettings = JSON.parse(savedSettings);
				setName(settings.name || "");
				setCompany(settings.company || "");
				setSelectedAudioDevice(settings.selectedAudioDevice || "");
				setSelectedVideoDevice(settings.selectedVideoDevice || "");
				setIsAudioEnabled(settings.isAudioEnabled || false);
				setIsVideoEnabled(settings.isVideoEnabled || false);
			}

			const joinStatus = localStorage.getItem("conferenceJoinAttempted");
			setJoinAttempted(!!joinStatus);
		} catch (e) {
			console.error("Error loading saved settings:", e);
		}

		setShouldRunTests(true);
	}, []);

	useEffect(() => {
		if (isClientSide) {
			if (isAudioEnabled) {
				startRecording();
				setDeviceTests((prev) => ({
					...prev,
					microphone: { status: "success" },
				}));
			} else {
				stopRecording();
				setDeviceTests((prev) => ({
					...prev,
					microphone: { status: "idle" },
				}));
			}
		}
	}, [isAudioEnabled, startRecording, stopRecording, isClientSide]);

	const showError = (title: string, message: string) => {
		setErrorTitle(title);
		setErrorMessage(message);
		setShowErrorModal(true);
	};

	const saveUserSettings = useCallback(() => {
		if (!isClientSide) return;

		try {
			const settings: UserSettings = {
				name,
				company,
				selectedAudioDevice,
				selectedVideoDevice,
				isAudioEnabled,
				isVideoEnabled,
			};
			localStorage.setItem("conferenceUserSettings", JSON.stringify(settings));
		} catch (e) {
			console.error("Error saving settings:", e);
		}
	}, [
		name,
		company,
		selectedAudioDevice,
		selectedVideoDevice,
		isAudioEnabled,
		isVideoEnabled,
		isClientSide,
	]);

	useEffect(() => {
		if (isClientSide) {
			saveUserSettings();
		}
	}, [
		name,
		company,
		selectedAudioDevice,
		selectedVideoDevice,
		isAudioEnabled,
		isVideoEnabled,
		saveUserSettings,
		isClientSide,
	]);

	const enumerateDevices = useCallback(async () => {
		if (!isClientSide) return;

		setLoadingDevices(true);
		try {
			console.log("Enumerating media devices");

			let tempStream: MediaStream | null = null;

			try {
				tempStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				});
				console.log(
					"Got temporary stream for permissions:",
					tempStream.getTracks().length
				);
			} catch (err) {
				console.warn("Could not get initial permissions:", err);
			}

			const devices = await navigator.mediaDevices.enumerateDevices();
			console.log("Found devices:", devices.length);

			const audioInputs = devices
				.filter((d) => d.kind === "audioinput")
				.map((d, i) => ({
					id: d.deviceId,
					label: d.label || `Microphone ${i + 1}`,
				}));

			const videoInputs = devices
				.filter((d) => d.kind === "videoinput")
				.map((d, i) => ({
					id: d.deviceId,
					label: d.label || `Camera ${i + 1}`,
				}));

			console.log("Audio inputs:", audioInputs.length);
			console.log("Video inputs:", videoInputs.length);

			setAvailableAudioDevices(audioInputs);
			setAvailableVideoDevices(videoInputs);

			if (
				audioInputs.length > 0 &&
				(!selectedAudioDevice ||
					!audioInputs.find((d) => d.id === selectedAudioDevice))
			) {
				setSelectedAudioDevice(audioInputs[0].id);
			}

			if (
				videoInputs.length > 0 &&
				(!selectedVideoDevice ||
					!videoInputs.find((d) => d.id === selectedVideoDevice))
			) {
				setSelectedVideoDevice(videoInputs[0].id);
			}

			if (tempStream) {
				tempStream.getTracks().forEach((track) => track.stop());
			}
		} catch (err) {
			console.error("Error enumerating devices:", err);
		} finally {
			setLoadingDevices(false);
		}
	}, [selectedAudioDevice, selectedVideoDevice, isClientSide]);

	useEffect(() => {
		if (!isClientSide) return;

		enumerateDevices();

		const handleDeviceChange = () => {
			enumerateDevices();
			setShouldRunTests(true);
		};

		navigator.mediaDevices?.addEventListener(
			"devicechange",
			handleDeviceChange
		);

		return () => {
			navigator.mediaDevices?.removeEventListener(
				"devicechange",
				handleDeviceChange
			);

			if (isAudioEnabled) {
				stopRecording();
			}
		};
	}, [enumerateDevices, stopRecording, isClientSide, isAudioEnabled]);

	const toggleVideo = () => {
		if (!isVideoEnabled && availableVideoDevices.length === 0) {
			showError("No Camera", "No cameras detected. Please connect a camera.");
			return;
		}

		setIsVideoEnabled((prev) => !prev);
		setShouldRunTests(true);
	};

	const toggleAudio = () => {
		if (!isAudioEnabled && availableAudioDevices.length === 0) {
			showError(
				"No Microphone",
				"No microphones detected. Please connect a microphone."
			);
			return;
		}

		setIsAudioEnabled((prev) => !prev);
	};

	const testNetworkSpeed = useCallback(async () => {
		if (!isClientSide) return;

		setDeviceTests((prev) => ({ ...prev, network: { status: "testing" } }));

		try {
			const startTime = Date.now();

			const response = await fetch("https://www.google.com");
			await response.text();

			const endTime = Date.now();
			const duration = (endTime - startTime) / 1000;

			const fileSizeInBits = 1 * 8 * 1024 * 1024;
			const speedMbps = (fileSizeInBits / duration / 1024 / 1024).toFixed(1);

			setNetworkSpeed(speedMbps);

			const speedValue = parseFloat(speedMbps);
			if (speedValue < 1) {
				setDeviceTests((prev) => ({
					...prev,
					network: { status: "failed", message: "Poor connection" },
				}));
			} else if (speedValue < 5) {
				setDeviceTests((prev) => ({
					...prev,
					network: { status: "warning", message: "Fair connection" },
				}));
			} else {
				setDeviceTests((prev) => ({ ...prev, network: { status: "success" } }));
			}
		} catch (error) {
			console.error("Network test failed:", error);
			setDeviceTests((prev) => ({
				...prev,
				network: { status: "failed", message: "Network test failed" },
			}));
		}
	}, [isClientSide]);

	const testMicrophone = useCallback(async () => {
		if (!isClientSide || !isAudioEnabled) {
			setDeviceTests((prev) => ({
				...prev,
				microphone: { status: "idle" },
			}));
			return;
		}

		setDeviceTests((prev) => ({ ...prev, microphone: { status: "testing" } }));

		try {
			startRecording();

			await new Promise((resolve) => setTimeout(resolve, 500));

			setDeviceTests((prev) => ({
				...prev,
				microphone: { status: "success" },
			}));
		} catch (error) {
			setDeviceTests((prev) => ({
				...prev,
				microphone: { status: "failed", message: (error as Error).message },
			}));
		}
	}, [startRecording, isAudioEnabled, isClientSide]);

	const testCamera = useCallback(async () => {
		if (!isClientSide || !isVideoEnabled) {
			setDeviceTests((prev) => ({
				...prev,
				camera: { status: "idle" },
			}));
			return;
		}

		setDeviceTests((prev) => ({ ...prev, camera: { status: "testing" } }));

		try {
			if (webcamRef.current && webcamRef.current.video) {
				setDeviceTests((prev) => ({
					...prev,
					camera: { status: "success" },
				}));
				return;
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: selectedVideoDevice
					? { deviceId: { exact: selectedVideoDevice } }
					: true,
				audio: false,
			});

			setDeviceTests((prev) => ({
				...prev,
				camera: { status: "success" },
			}));

			stream.getTracks().forEach((track) => track.stop());
		} catch (error) {
			setDeviceTests((prev) => ({
				...prev,
				camera: { status: "failed", message: (error as Error).message },
			}));
		}
	}, [selectedVideoDevice, isVideoEnabled, isClientSide]);

	const runAllTests = useCallback(() => {
		if (!isClientSide) return;

		if (isVideoEnabled) {
			testCamera();
		} else {
			setDeviceTests((prev) => ({
				...prev,
				camera: { status: "idle" },
			}));
		}

		if (isAudioEnabled) {
			testMicrophone();
		} else {
			setDeviceTests((prev) => ({
				...prev,
				microphone: { status: "idle" },
			}));
		}

		testNetworkSpeed();
	}, [
		testCamera,
		testMicrophone,
		testNetworkSpeed,
		isVideoEnabled,
		isAudioEnabled,
		isClientSide,
	]);

	useEffect(() => {
		if (isClientSide && !loadingDevices && shouldRunTests) {
			runAllTests();
			setShouldRunTests(false);
		}
	}, [runAllTests, loadingDevices, shouldRunTests, isClientSide]);

	const getTestIcon = (status: DeviceTestStatus["status"]) => {
		switch (status) {
			case "success":
				return <FaCheckCircle className="w-4 h-4 text-emerald-400" />;
			case "failed":
				return <FaTimesCircle className="w-4 h-4 text-red-400" />;
			case "warning":
				return <FaExclamationCircle className="w-4 h-4 text-yellow-400" />;
			case "testing":
				return <CgSpinner className="w-4 h-4 text-teal-400 animate-spin" />;
			default:
				return <div className="w-4 h-4 bg-slate-600 rounded-full" />;
		}
	};

	const formatWaitTime = () => {
		const now = new Date();
		const diff = Math.floor((now.getTime() - joinTime.getTime()) / 1000);
		const minutes = Math.floor(diff / 60);
		const seconds = diff % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
			2,
			"0"
		)}`;
	};

	useEffect(() => {
		if (!isClientSide) return;

		const interval = setInterval(() => {
			setQueuePosition((prev) => {
				const shouldDecrease = Math.random() > (prev <= 2 ? 0.8 : 0.7);
				return shouldDecrease ? Math.max(1, prev - 1) : prev;
			});

			setEstimatedWaitTime((prev) => {
				if (queuePosition <= 1) return 0;
				return Math.max(0, prev - (Math.random() > 0.7 ? 1 : 0));
			});
		}, 7000);

		return () => clearInterval(interval);
	}, [queuePosition, isClientSide]);

	const handleJoin = () => {
		if (!canJoin || !isClientSide) return;

		setIsJoining(true);
		localStorage.setItem("conferenceJoinAttempted", "true");
		setJoinAttempted(true);

		setTimeout(() => {
			setErrorTitle("Success");
			setErrorMessage("You have successfully joined the conference!");
			setShowErrorModal(true);
			setIsJoining(false);
		}, 2000);
	};

	const canJoin =
		name &&
		queuePosition === 1 &&
		(deviceTests.camera.status !== "failed" || !isVideoEnabled) &&
		(deviceTests.microphone.status !== "failed" || !isAudioEnabled);

	useEffect(() => {
		if (isClientSide && joinAttempted && name && !hasStartedJoining) {
			setHasStartedJoining(true);
			setQueuePosition(1);
		}
	}, [joinAttempted, name, hasStartedJoining, isClientSide]);

	useEffect(() => {
		if (isClientSide && showWelcomeMessage) {
			const timer = setTimeout(() => setShowWelcomeMessage(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [showWelcomeMessage, isClientSide]);

	const videoConstraints = isVideoEnabled
		? {
				width: 1280,
				height: 720,
				facingMode: "user",
				deviceId: selectedVideoDevice
					? { exact: selectedVideoDevice }
					: undefined,
		  }
		: false;

	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row antialiased font-sans overflow-hidden">
			<AnimatePresence>
				{showWelcomeMessage && joinAttempted && name && (
					<motion.div
						className="fixed top-4 right-4 bg-teal-900/80 backdrop-blur-md p-4 rounded-lg border border-teal-700 shadow-lg z-50 max-w-xs"
						initial={{ x: 100, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: 100, opacity: 0 }}
					>
						<div className="flex items-start">
							<div className="flex-shrink-0 text-teal-400">
								<FaCheckSquare className="h-6 w-6" />
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-teal-300">
									Welcome back, {name}!
								</p>
								<p className="mt-1 text-sm text-slate-300">
									We've saved your settings and moved you to the front of the
									queue.
								</p>
							</div>
							<button
								className="ml-auto flex-shrink-0 text-slate-400 hover:text-white"
								onClick={() => setShowWelcomeMessage(false)}
							>
								<FaTimes className="h-5 w-5" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="lg:w-1/3 p-4 lg:p-8 flex flex-col justify-between border-r border-gray-800/50 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
				<div>
					<div className="flex items-center mb-4">
						<div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
							<FaUsers className="w-5 h-5" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-slate-100">
								Virtual Waiting Room
							</h1>
							<p className="text-teal-400 text-sm">{meeting.title}</p>
						</div>
					</div>
					<p className="text-slate-400 text-sm mb-6">
						Complete your details and prepare to join.
					</p>

					<div className="space-y-6">
						<motion.div
							className="backdrop-blur-xl bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 shadow-lg"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<h2 className="text-lg font-semibold text-teal-400 mb-3 flex items-center">
								<FaUser className="mr-2" /> Your Details
							</h2>
							<div className="space-y-4">
								<div>
									<label
										htmlFor="nameInput"
										className="block text-sm font-medium text-gray-300 mb-1.5"
									>
										Full Name <span className="text-red-500">*</span>
									</label>
									<input
										id="nameInput"
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
										placeholder="E.g., Jane Doe"
									/>
								</div>
								<div>
									<label
										htmlFor="companyInput"
										className="block text-sm font-medium text-gray-300 mb-1.5"
									>
										Company (Optional)
									</label>
									<input
										id="companyInput"
										type="text"
										value={company}
										onChange={(e) => setCompany(e.target.value)}
										className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
										placeholder="E.g., Acme Corp"
									/>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="backdrop-blur-xl bg-teal-500/10 rounded-xl p-5 border border-teal-500/30 shadow-lg"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-lg font-semibold text-teal-300">
									Queue Position
								</h2>
								<FaClock className="w-5 h-5 text-teal-400" />
							</div>
							<div className="text-center">
								<motion.div
									className="text-4xl font-bold text-teal-400 mb-1.5"
									key={queuePosition}
									initial={{ scale: 1.5, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ type: "spring", stiffness: 300, damping: 20 }}
								>
									#{queuePosition}
								</motion.div>
								<p className="text-slate-400 text-sm">in line</p>
								<div className="mt-3 text-xs text-slate-500">
									Waiting time: {formatWaitTime()}
								</div>
								{estimatedWaitTime > 0 && queuePosition > 1 && (
									<div className="mt-2 text-sm text-teal-300">
										Estimated time until entry: ~{estimatedWaitTime} min
									</div>
								)}
							</div>
						</motion.div>

						<motion.div
							className="backdrop-blur-xl bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 shadow-lg"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-lg font-semibold text-teal-400">
									Device Check
								</h2>
								<button
									onClick={() => {
										setShouldRunTests(true);
									}}
									className="text-teal-400 hover:text-teal-300 text-xs sm:text-sm font-medium focus-visible:ring-1 focus-visible:ring-teal-400 rounded px-2 py-1 hover:bg-teal-900/30 transition-colors"
								>
									Retest All
								</button>
							</div>
							<div className="space-y-4 text-sm">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<FaVideo className="w-4 h-4 text-slate-400" />
										Camera
									</div>
									<div className="flex items-center gap-2">
										{deviceTests.camera.message &&
											deviceTests.camera.status === "failed" && (
												<span className="text-xs text-red-400">
													{deviceTests.camera.message}
												</span>
											)}
										{getTestIcon(deviceTests.camera.status)}
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<FaMicrophone className="w-4 h-4 text-slate-400" />
										Microphone
									</div>
									<div className="flex items-center gap-2">
										{isAudioEnabled && (
											<div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
												<motion.div
													className="h-full bg-teal-400"
													initial={{ width: 0 }}
													animate={{
														width: `${Math.min(audioLevel * 1.5, 100)}%`,
													}}
													transition={{ duration: 0.1 }}
												/>
											</div>
										)}
										{deviceTests.microphone.message &&
											deviceTests.microphone.status === "failed" && (
												<span className="text-xs text-red-400">
													{deviceTests.microphone.message}
												</span>
											)}
										{getTestIcon(deviceTests.microphone.status)}
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<FaWifi className="w-4 h-4 text-slate-400" />
										Network
									</div>
									<div className="flex items-center gap-2">
										{networkSpeed && (
											<span className="text-xs text-slate-400">
												({networkSpeed} Mbps)
											</span>
										)}
										{getTestIcon(deviceTests.network.status)}
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
				<p className="text-xs text-slate-600 text-center mt-6 px-6 pb-6 lg:pb-0">
					{new Date().getFullYear()} NextGen Conference
				</p>
			</div>

			<div className="lg:w-2/3 p-4 lg:p-8 flex flex-col bg-slate-800/30">
				<div className="flex-1 mb-6 relative">
					<motion.div
						className="backdrop-blur-xl bg-slate-800/70 rounded-lg p-3 mb-4 border border-slate-700/50 shadow-lg flex justify-between items-center"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<div>
							<h2 className="font-medium text-teal-400">{meeting.title}</h2>
							<p className="text-xs text-slate-400">
								Hosted by {meeting.host} • Starting at {meeting.startTime}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<div className="hidden sm:flex items-center">
								<span className="text-sm text-slate-300">Queue: </span>
								<span className="ml-1 text-sm font-semibold text-teal-400">
									#{queuePosition}
								</span>
							</div>
							<div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
							<div className="flex items-center">
								<FaClock className="text-slate-400 w-3 h-3 mr-1" />
								<span className="text-sm text-slate-300">
									{formatWaitTime()}
								</span>
							</div>
						</div>
					</motion.div>

					<motion.div
						className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700/50"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							delay: 0.2,
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
					>
						{isVideoEnabled && (
							<Webcam
								ref={webcamRef}
								audio={false}
								videoConstraints={videoConstraints}
								className="w-full h-full object-cover transform scale-x-[-1]"
								mirrored={true}
								onUserMediaError={(err) => {
									console.error("Webcam error:", err);
									setDeviceTests((prev) => ({
										...prev,
										camera: {
											status: "failed",
											message:
												err.name === "NotAllowedError"
													? "Camera permission denied"
													: "Failed to access camera",
										},
									}));
								}}
								onUserMedia={() => {
									setDeviceTests((prev) => ({
										...prev,
										camera: { status: "success" },
									}));
								}}
							/>
						)}

						{(!isVideoEnabled || !webcamRef.current) && (
							<div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/70 backdrop-blur-sm">
								<div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-700 rounded-full flex items-center justify-center mb-4 border-2 border-slate-600">
									{name ? (
										<span className="text-3xl sm:text-4xl font-bold text-slate-400">
											{name.charAt(0).toUpperCase()}
										</span>
									) : (
										<FaVideoSlash className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500" />
									)}
								</div>
								<p className="text-slate-400 text-sm sm:text-base">
									{deviceTests.camera.status === "failed" && isVideoEnabled
										? `Camera: ${deviceTests.camera.message || "Unavailable"}`
										: "Camera is off"}
								</p>
							</div>
						)}

						<div className="absolute top-4 left-4 backdrop-blur-md bg-black/40 rounded-lg px-3 py-1.5 text-sm text-white flex items-center gap-2">
							<motion.div
								className={`w-2 h-2 rounded-full ${
									isVideoEnabled && webcamRef.current?.video
										? "bg-green-400"
										: "bg-red-400"
								}`}
								animate={{
									scale:
										isVideoEnabled && webcamRef.current?.video
											? [1, 1.2, 1]
											: 1,
								}}
								transition={{ repeat: Infinity, duration: 2 }}
							/>
							{isVideoEnabled && webcamRef.current?.video
								? "Camera On"
								: "Camera Off"}
						</div>

						{name && (
							<div className="absolute bottom-4 left-4 backdrop-blur-md bg-black/40 rounded-lg px-3 py-1.5">
								<p className="text-white font-medium text-sm">{name}</p>
								{company && <p className="text-slate-300 text-xs">{company}</p>}
							</div>
						)}
					</motion.div>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 items-center">
					<div className="flex-1 w-full sm:w-auto">
						<motion.div
							className="backdrop-blur-xl bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50 shadow-lg"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<div className="flex justify-center gap-3 sm:gap-4">
								<motion.button
									onClick={toggleAudio}
									title={
										isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"
									}
									className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus:outline-none ${
										deviceTests.microphone.status === "failed" && isAudioEnabled
											? "bg-red-600/70 hover:bg-red-500/70 text-white"
											: isAudioEnabled
											? "bg-teal-500 hover:bg-teal-400 text-white focus-visible:ring-teal-400"
											: "bg-slate-700 hover:bg-slate-600 text-slate-300 focus-visible:ring-slate-500"
									}`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{isAudioEnabled ? (
										<FaMicrophone className="w-5 h-5" />
									) : (
										<FaMicrophoneSlash className="w-5 h-5" />
									)}
								</motion.button>

								<motion.button
									onClick={toggleVideo}
									title={isVideoEnabled ? "Turn Camera Off" : "Turn Camera On"}
									className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus:outline-none ${
										deviceTests.camera.status === "failed" && isVideoEnabled
											? "bg-red-600/70 hover:bg-red-500/70 text-white"
											: isVideoEnabled
											? "bg-teal-500 hover:bg-teal-400 text-white focus-visible:ring-teal-400"
											: "bg-slate-700 hover:bg-slate-600 text-slate-300 focus-visible:ring-slate-500"
									}`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{isVideoEnabled ? (
										<FaVideo className="w-5 h-5" />
									) : (
										<FaVideoSlash className="w-5 h-5" />
									)}
								</motion.button>

								<motion.button
									onClick={() => setShowSettingsModal(true)}
									title="Settings"
									className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-teal-300 transition-all duration-200 transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-teal-400 focus:outline-none"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<FaCog className="w-5 h-5" />
								</motion.button>
							</div>
						</motion.div>
					</div>

					<div className="w-full sm:w-auto sm:flex-shrink-0 lg:w-1/3">
						<motion.button
							onClick={handleJoin}
							disabled={!canJoin || isJoining}
							className={`w-full py-3.5 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus:outline-none ${
								canJoin && !isJoining
									? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white focus-visible:ring-teal-400"
									: "bg-slate-700 text-slate-500 cursor-not-allowed"
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							whileHover={canJoin && !isJoining ? { scale: 1.03 } : {}}
							whileTap={canJoin && !isJoining ? { scale: 0.97 } : {}}
						>
							{isJoining ? (
								<div className="flex items-center justify-center">
									<CgSpinner className="animate-spin mr-2 h-5 w-5" />
									<span>Joining...</span>
								</div>
							) : deviceTests.camera.status === "failed" && isVideoEnabled ? (
								"Fix Camera Issues"
							) : deviceTests.microphone.status === "failed" &&
							  isAudioEnabled ? (
								"Fix Microphone Issues"
							) : !name ? (
								"Enter Your Name"
							) : queuePosition === 1 ? (
								"Join Conference Now"
							) : (
								"Waiting to Join..."
							)}
						</motion.button>
					</div>
				</div>

				<div className="hidden lg:block mt-6">
					<motion.div
						className="backdrop-blur-xl bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-lg"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						<div className="flex items-center mb-4">
							<FaCalendarAlt className="text-teal-400 mr-2" />
							<h3 className="text-lg font-semibold text-teal-400">
								Today's Agenda
							</h3>
						</div>
						<div className="space-y-3 text-sm">
							{meeting.agenda.map((item, index) => (
								<motion.div
									key={index}
									className="flex justify-between items-center text-slate-300 p-2 hover:bg-slate-700/30 rounded-lg transition-colors"
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6 + index * 0.1 }}
								>
									<p>{item.title}</p>
									<p className="text-teal-400">{item.time}</p>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>

			<AnimatePresence>
				{showSettingsModal && (
					<Modal
						title="Device Settings"
						isOpen={showSettingsModal}
						onClose={() => setShowSettingsModal(false)}
					>
						<div className="space-y-4 text-slate-300">
							<div>
								<label
									htmlFor="micSelect"
									className="block text-sm font-medium mb-1"
								>
									Microphone:
								</label>
								<select
									id="micSelect"
									value={selectedAudioDevice}
									onChange={(e) => {
										setSelectedAudioDevice(e.target.value);
										setShouldRunTests(true);
									}}
									className="w-full p-2.5 rounded-md bg-slate-700 border border-slate-600 text-slate-100 focus:ring-teal-500 focus:border-teal-500 outline-none"
									disabled={
										availableAudioDevices.length === 0 || loadingDevices
									}
								>
									{loadingDevices && <option>Loading devices...</option>}
									{!loadingDevices && availableAudioDevices.length === 0 && (
										<option>No microphones found</option>
									)}
									{!loadingDevices &&
										availableAudioDevices.map((device) => (
											<option key={device.id} value={device.id}>
												{device.label}
											</option>
										))}
								</select>
							</div>

							<div>
								<label
									htmlFor="camSelect"
									className="block text-sm font-medium mb-1"
								>
									Camera:
								</label>
								<select
									id="camSelect"
									value={selectedVideoDevice}
									onChange={(e) => {
										setSelectedVideoDevice(e.target.value);
										setShouldRunTests(true);
									}}
									className="w-full p-2.5 rounded-md bg-slate-700 border border-slate-600 text-slate-100 focus:ring-teal-500 focus:border-teal-500 outline-none"
									disabled={
										availableVideoDevices.length === 0 || loadingDevices
									}
								>
									{loadingDevices && <option>Loading devices...</option>}
									{!loadingDevices && availableVideoDevices.length === 0 && (
										<option>No cameras found</option>
									)}
									{!loadingDevices &&
										availableVideoDevices.map((device) => (
											<option key={device.id} value={device.id}>
												{device.label}
											</option>
										))}
								</select>
							</div>

							<motion.button
								onClick={() => {
									setShouldRunTests(true);
									setShowSettingsModal(false);
								}}
								className="w-full mt-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-colors duration-200"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Apply & Retest Devices
							</motion.button>
						</div>
					</Modal>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showErrorModal && (
					<Modal
						title={errorTitle}
						isOpen={showErrorModal}
						onClose={() => setShowErrorModal(false)}
						variant={errorTitle === "Success" ? "success" : "error"}
					>
						<div className="text-slate-300 mb-4">{errorMessage}</div>
						<motion.button
							onClick={() => setShowErrorModal(false)}
							className="w-full px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-colors duration-200"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							Close
						</motion.button>
					</Modal>
				)}
			</AnimatePresence>

			<style>{`
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        
        @keyframes scaleUp { 0% { transform: scale(0.95) translateY(10px); opacity:0; } 100% { transform: scale(1) translateY(0px); opacity:1; } }
        .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
        
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #475569 #334155; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #334155; border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #4b5563; border-radius: 10px; border: 1px solid #334155; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: #6b7280; }
        
        @media (max-width: 640px) {
          .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        }
      `}</style>
		</div>
	);
};

export default ConferenceWaitingRoom;
