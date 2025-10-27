"use client";

import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface FishPrintItem {
	id: number;
	title: string;
	description: string;
	imageUrl: string;
	technique: string;
	era: string;
	materials: string[];
}

interface TechniqueStep {
	id: number;
	title: string;
	description: string;
	imageUrl: string;
}

const fishPrintItems: FishPrintItem[] = [
	{
		id: 1,
		title: "Traditional Carp Gyotaku",
		description:
			"A classic Japanese fish printing (Gyotaku) of a carp, showcasing the detailed scales and fins with traditional black sumi ink on washi paper.",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/a/a5/Gyotaku-SadFish-small.jpg",
		technique: "Direct Method (Chokusetsu-ho)",
		era: "Edo Period",
		materials: ["Sumi ink", "Washi paper", "Fish specimen"],
	},
	{
		id: 2,
		title: "Sea Bream Impression",
		description:
			"A delicate Gyotaku print of a sea bream, created using the direct method (chokusetsu-hō) with natural pigments on handmade paper.",
		imageUrl:
			"https://images.unsplash.com/photo-1687382898799-77882ea4dfbe?q=80&w=3153&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		technique: "Direct Method (Chokusetsu-ho)",
		era: "Modern",
		materials: ["Natural pigments", "Handmade paper", "Fish specimen"],
	},
	{
		id: 3,
		title: "Mackerel Study",
		description:
			"This Gyotaku print captures the sleek lines and distinctive pattern of a mackerel using traditional techniques with subtle details.",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Fish_Catalogue_MAN_Napoli_Inv120177_n01.jpg/800px-Fish_Catalogue_MAN_Napoli_Inv120177_n01.jpg",
		technique: "Indirect Method (Kansetsu-ho)",
		era: "Modern",
		materials: ["Water-based ink", "Rice paper", "Fish specimen"],
	},
	{
		id: 4,
		title: "Colorful Gyotaku",
		description:
			"A vibrant interpretation of Gyotaku art, blending traditional technique with color accents to highlight the fish's natural beauty.",
		imageUrl:
			"https://images.unsplash.com/photo-1701964621522-9b660d6ebcbc?q=80&w=3197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		technique: "Transfer Dyeing Method (Tensha-ho)",
		era: "Contemporary",
		materials: ["Colored pigments", "Specialty paper", "Fish specimen"],
	},
	{
		id: 5,
		title: "Contemporary Fish Print",
		description:
			"A modern take on the traditional Gyotaku showing artistic impression of a fish, demonstrating the versatility of this Japanese art form.",
		imageUrl:
			"https://images.unsplash.com/photo-1719338204176-bdcad1a18f4f?q=80&w=2388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		technique: "Mixed Method",
		era: "Contemporary",
		materials: ["Mixed media", "Textured paper", "Digital enhancement"],
	},
	{
		id: 6,
		title: "Ocean Blues Study",
		description:
			"An elegant blue-toned Gyotaku print that captures the essence of ocean life with a contemporary artistic vision.",
		imageUrl:
			"https://images.unsplash.com/photo-1525873020571-08690094e301?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		technique: "Contemporary Method",
		era: "Modern",
		materials: ["Blue pigments", "Cotton paper", "Mixed media"],
	},
];

const techniqueSteps: TechniqueStep[] = [
	{
		id: 1,
		title: "Prepare the Fish",
		description:
			"Clean the fish thoroughly and pat it dry. Position the fins and other features as you want them to appear in the print.",
		imageUrl:
			"https://images.unsplash.com/photo-1584435609732-11134b5b836d?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
	{
		id: 2,
		title: "Apply the Ink",
		description:
			"Using a brush, apply ink or paint directly to the surface of the fish. Be sure to cover all details you want to capture.",
		imageUrl:
			"https://images.unsplash.com/photo-1589717413535-d9beff8dd3d1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
	{
		id: 3,
		title: "Position the Paper",
		description:
			"Carefully place paper over the inked fish. In traditional Gyotaku, washi (Japanese paper) is used for its durability and texture.",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1713364681469-b9a00a4accf2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
	{
		id: 4,
		title: "Press the Paper",
		description:
			"Gently press the paper onto the fish, ensuring contact with all inked areas but being careful not to smudge the image.",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1725075086636-b996a2d07782?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
	{
		id: 5,
		title: "Remove the Print",
		description:
			"Carefully peel the paper away from the fish, starting from one edge and working across to avoid smudging.",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1675425205217-54859e951245?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
	{
		id: 6,
		title: "Let it Dry",
		description:
			"Allow the print to dry completely. Once dry, you may add additional details or color as desired.",
		imageUrl:
			"https://images.unsplash.com/photo-1712700504489-b3e240144ee3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
];

const historyContent = {
	title: "The History of Gyotaku",
	periods: [
		{
			era: "Origins (Early 1800s)",
			description:
				"Gyotaku (魚拓) began in Japan during the early 19th century as a practical way for fishermen to record their catches. The term comes from 'gyo' (fish) and 'taku' (rubbing or impression).",
		},
		{
			era: "Development (Late 1800s - Early 1900s)",
			description:
				"The technique evolved from a simple recording method to an art form as practitioners began to refine their methods and explore artistic possibilities.",
		},
		{
			era: "Modern Revival (Post-WWII)",
			description:
				"After World War II, there was renewed interest in traditional Japanese arts, including Gyotaku. Artists began exploring new applications and techniques.",
		},
		{
			era: "Contemporary Art (Present Day)",
			description:
				"Today, Gyotaku is practiced worldwide as both a traditional craft and contemporary art form. Artists combine traditional methods with modern materials and perspectives.",
		},
	],
};

const fadeIn = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: "easeOut" },
	},
	hover: {
		y: -8,
		boxShadow:
			"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
		transition: { duration: 0.2, ease: "easeOut" },
	},
};

const logoAnimation = {
	hidden: { scale: 0.8, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 10,
		},
	},
};

export default function GyotakuAppExport() {
	const [activeSection, setActiveSection] = useState<
		"showcase" | "technique" | "history" | "interactive"
	>("showcase");
	const [selectedPrint, setSelectedPrint] = useState<FishPrintItem | null>(
		null
	);
	const [currentStep, setCurrentStep] = useState(1);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSimulating, setIsSimulating] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [activeSection]);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const notify = (message: string) => {
		toast.info(message, {
			position: "bottom-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			className: "bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700",
		});
	};

	useEffect(() => {
		if (isSimulating && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.fillStyle = "#f8fafc";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				ctx.strokeStyle = "#4f46e5";
				ctx.lineWidth = 3;
				ctx.beginPath();

				ctx.moveTo(canvas.width * 0.2, canvas.height * 0.5);
				ctx.quadraticCurveTo(
					canvas.width * 0.4,
					canvas.height * 0.25,
					canvas.width * 0.8,
					canvas.height * 0.5
				);
				ctx.quadraticCurveTo(
					canvas.width * 0.4,
					canvas.height * 0.75,
					canvas.width * 0.2,
					canvas.height * 0.5
				);

				ctx.moveTo(canvas.width * 0.8, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.9, canvas.height * 0.3);
				ctx.lineTo(canvas.width * 0.95, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.9, canvas.height * 0.7);
				ctx.lineTo(canvas.width * 0.8, canvas.height * 0.5);

				ctx.moveTo(canvas.width * 0.3, canvas.height * 0.4);
				ctx.arc(canvas.width * 0.3, canvas.height * 0.4, 5, 0, Math.PI * 2);

				ctx.moveTo(canvas.width * 0.4, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.4, canvas.height * 0.4);

				ctx.moveTo(canvas.width * 0.5, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.5, canvas.height * 0.35);

				ctx.moveTo(canvas.width * 0.6, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.6, canvas.height * 0.6);

				ctx.stroke();
				ctx.closePath();

				ctx.fillStyle = "#4f46e5";
				ctx.font = '18px "Poppins", sans-serif';
				ctx.fillText("Click and drag to apply ink to the fish", 20, 30);

				ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
				ctx.lineWidth = 1;

				for (let i = 0; i < canvas.width; i += 20) {
					ctx.beginPath();
					ctx.moveTo(i, 0);
					ctx.lineTo(i, canvas.height);
					ctx.stroke();
				}

				for (let i = 0; i < canvas.height; i += 20) {
					ctx.beginPath();
					ctx.moveTo(0, i);
					ctx.lineTo(canvas.width, i);
					ctx.stroke();
				}
			}
		}
	}, [isSimulating]);

	const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current || !isSimulating) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		let lastX = x;
		let lastY = y;

		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.beginPath();
		ctx.arc(x, y, 8, 0, Math.PI * 2);
		ctx.fill();

		canvas.onmousemove = (moveEvent) => {
			const moveX = moveEvent.clientX - rect.left;
			const moveY = moveEvent.clientY - rect.top;

			ctx.lineWidth = 16;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";

			ctx.beginPath();
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(moveX, moveY);
			ctx.stroke();

			lastX = moveX;
			lastY = moveY;
		};

		window.onmouseup = () => {
			canvas.onmousemove = null;
			window.onmouseup = null;
		};
	};

	const handlePrintSimulation = () => {
		if (!canvasRef.current || !isSimulating) return;

		notify("Creating your Gyotaku print...");

		setTimeout(() => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			let alpha = 0;
			const interval = setInterval(() => {
				alpha += 0.05;

				if (alpha >= 0.7) {
					clearInterval(interval);
					notify("Your Gyotaku print is ready!");
				}

				ctx.fillStyle = `rgba(255, 252, 235, ${alpha})`;
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				for (let i = 0; i < 200; i++) {
					const x = Math.random() * canvas.width;
					const y = Math.random() * canvas.height;
					const size = Math.random() * 2 + 1;

					ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
					ctx.beginPath();
					ctx.arc(x, y, size, 0, Math.PI * 2);
					ctx.fill();
				}
			}, 50);
		}, 1000);
	};

	const resetCanvas = () => {
		if (!canvasRef.current || !isSimulating) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let alpha = 1;
		const fadeOut = setInterval(() => {
			alpha -= 0.1;

			if (alpha <= 0) {
				clearInterval(fadeOut);

				ctx.fillStyle = "#f8fafc";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				ctx.strokeStyle = "#4f46e5";
				ctx.lineWidth = 3;
				ctx.beginPath();

				ctx.moveTo(canvas.width * 0.2, canvas.height * 0.5);
				ctx.quadraticCurveTo(
					canvas.width * 0.4,
					canvas.height * 0.25,
					canvas.width * 0.8,
					canvas.height * 0.5
				);
				ctx.quadraticCurveTo(
					canvas.width * 0.4,
					canvas.height * 0.75,
					canvas.width * 0.2,
					canvas.height * 0.5
				);

				ctx.moveTo(canvas.width * 0.8, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.9, canvas.height * 0.3);
				ctx.lineTo(canvas.width * 0.95, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.9, canvas.height * 0.7);
				ctx.lineTo(canvas.width * 0.8, canvas.height * 0.5);

				ctx.moveTo(canvas.width * 0.3, canvas.height * 0.4);
				ctx.arc(canvas.width * 0.3, canvas.height * 0.4, 5, 0, Math.PI * 2);

				ctx.moveTo(canvas.width * 0.4, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.4, canvas.height * 0.4);

				ctx.moveTo(canvas.width * 0.5, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.5, canvas.height * 0.35);

				ctx.moveTo(canvas.width * 0.6, canvas.height * 0.5);
				ctx.lineTo(canvas.width * 0.6, canvas.height * 0.6);

				ctx.stroke();
				ctx.closePath();

				ctx.fillStyle = "#4f46e5";
				ctx.font = '18px "Poppins", sans-serif';
				ctx.fillText("Click and drag to apply ink to the fish", 20, 30);

				ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
				ctx.lineWidth = 1;

				for (let i = 0; i < canvas.width; i += 20) {
					ctx.beginPath();
					ctx.moveTo(i, 0);
					ctx.lineTo(i, canvas.height);
					ctx.stroke();
				}

				for (let i = 0; i < canvas.height; i += 20) {
					ctx.beginPath();
					ctx.moveTo(0, i);
					ctx.lineTo(canvas.width, i);
					ctx.stroke();
				}

				notify("Canvas reset. Start again!");
			}

			ctx.fillStyle = `rgba(248, 250, 252, ${0.1})`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}, 30);
	};

	const [showcaseRef, showcaseInView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const [techniqueRef, techniqueInView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const [historyRef, historyInView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const [interactiveRef, interactiveInView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans">
			<ToastContainer />

			{}
			<header className="bg-white shadow-lg sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 md:h-20 items-center">
						<motion.div
							initial="hidden"
							animate="visible"
							variants={logoAnimation}
							className="flex items-center space-x-3"
						>
							<div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
									<path d="M15 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
								</svg>
								<motion.div
									animate={{ scale: [1, 1.2, 1] }}
									transition={{
										duration: 2,
										ease: "easeInOut",
										repeat: Infinity,
										repeatDelay: 5,
									}}
									className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-yellow-400"
								/>
							</div>
							<h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text tracking-tight">
								Gyotaku{" "}
								<span className="hidden sm:inline">
									• The Art of Fish Printing
								</span>
							</h1>
						</motion.div>

						{}
						<nav className="hidden md:flex space-x-1">
							{[
								{ id: "showcase", label: "Showcase" },
								{ id: "technique", label: "Technique" },
								{ id: "history", label: "History" },
								{
									id: "interactive",
									label: "Try It Yourself",
									action: () => setIsSimulating(true),
								},
							].map((item) => (
								<motion.button
									key={item.id}
									onClick={() => {
										setActiveSection(item.id as any);
										if (item.action) item.action();
									}}
									className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden ${
										activeSection === item.id
											? "bg-indigo-100 text-indigo-700"
											: "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
									}`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{item.label}
									{activeSection === item.id && (
										<motion.div
											layoutId="activeIndicator"
											className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
											initial={false}
										/>
									)}
								</motion.button>
							))}
						</nav>

						{}
						<motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none cursor-pointer"
								aria-label={isMenuOpen ? "Close menu" : "Open menu"}
							>
								<AnimatePresence mode="wait">
									{isMenuOpen ? (
										<motion.svg
											key="close"
											initial={{ rotate: 0 }}
											animate={{ rotate: 90 }}
											exit={{ rotate: 0 }}
											transition={{ duration: 0.2 }}
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
												d="M6 18L18 6M6 6l12 12"
											/>
										</motion.svg>
									) : (
										<motion.svg
											key="menu"
											initial={{ rotate: 90 }}
											animate={{ rotate: 0 }}
											exit={{ rotate: 90 }}
											transition={{ duration: 0.2 }}
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
										</motion.svg>
									)}
								</AnimatePresence>
							</button>
						</motion.div>
					</div>
				</div>

				{}
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							className="md:hidden bg-white shadow-lg rounded-b-lg mx-4 overflow-hidden"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<div className="px-2 pt-2 pb-3 space-y-1">
								{[
									{ id: "showcase", label: "Showcase" },
									{ id: "technique", label: "Technique" },
									{ id: "history", label: "History" },
									{
										id: "interactive",
										label: "Try It Yourself",
										action: () => setIsSimulating(true),
									},
								].map((item, index) => (
									<motion.button
										key={item.id}
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: index * 0.1, duration: 0.3 }}
										onClick={() => {
											setActiveSection(item.id as any);
											setIsMenuOpen(false);
											if (item.action) item.action();
										}}
										className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
											activeSection === item.id
												? "bg-indigo-100 text-indigo-700"
												: "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
										}`}
									>
										{item.label}
									</motion.button>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</header>

			{}
			<AnimatePresence>
				{!isLoaded && (
					<motion.div
						className="fixed inset-0 bg-white z-50 flex items-center justify-center"
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
					>
						<motion.div
							className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-600"
							animate={{ rotate: 360 }}
							transition={{ duration: 1, ease: "linear", repeat: Infinity }}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{}
				<motion.div
					initial="hidden"
					animate="visible"
					variants={fadeIn}
					className="mb-12 text-center"
				>
					<motion.h2
						className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.8 }}
					>
						Discover the Japanese Art of{" "}
						<span className="text-indigo-600 relative">
							Gyotaku
							<motion.span
								className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-200"
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{ delay: 1, duration: 0.8 }}
							/>
						</span>
					</motion.h2>
					<motion.p
						className="max-w-3xl mx-auto text-lg text-gray-600"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.8 }}
					>
						Explore the traditional Japanese technique of fish printing, an art
						form that captures the beauty and detail of fish through direct
						impression.
					</motion.p>

					{}
					<motion.div
						className="mt-8 flex justify-center space-x-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8, duration: 0.8 }}
					>
						<span className="h-1 w-10 bg-indigo-200 rounded-full"></span>
						<span className="h-1 w-20 bg-indigo-400 rounded-full"></span>
						<span className="h-1 w-10 bg-indigo-200 rounded-full"></span>
					</motion.div>
				</motion.div>

				{}
				{activeSection === "showcase" && (
					<motion.section
						ref={showcaseRef}
						initial="hidden"
						animate={showcaseInView ? "visible" : "hidden"}
						variants={fadeIn}
						className="py-4"
					>
						<motion.h3
							className="text-2xl font-bold text-gray-900 mb-8 flex items-center"
							variants={fadeIn}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mr-2 text-indigo-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Gyotaku Print Collection
						</motion.h3>

						<AnimatePresence mode="wait">
							{selectedPrint ? (
								<>
									{}
									<motion.div
										key="overlay"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
										className="fixed inset-0 bg-black/30 z-10"
										onClick={() => setSelectedPrint(null)}
									/>

									<motion.div
										key="detail"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.3 }}
										className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 relative z-20"
									>
										<div className="md:flex">
											<div className="md:w-1/2 relative group overflow-hidden">
												<img
													src={selectedPrint.imageUrl}
													alt={selectedPrint.title}
													className="w-full h-64 md:h-auto object-cover transition-transform duration-700 group-hover:scale-110"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											</div>
											<div className="p-6 md:w-1/2">
												<div className="flex justify-between items-start">
													<motion.h3
														className="text-2xl font-bold text-gray-900 mb-2"
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: 0.1 }}
													>
														{selectedPrint.title}
													</motion.h3>

													{}
													<motion.button
														onClick={(e) => {
															e.stopPropagation();
															setSelectedPrint(null);
														}}
														className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-3 hover:bg-gray-100 rounded-full absolute top-2 right-2 z-30"
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-6 w-6"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
															strokeWidth={2}
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M6 18L18 6M6 6l12 12"
															/>
														</svg>
													</motion.button>
												</div>
												<motion.p
													className="text-gray-600 mb-6"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 0.2 }}
												>
													{selectedPrint.description}
												</motion.p>

												<motion.div
													className="space-y-4"
													initial="hidden"
													animate="visible"
													variants={staggerContainer}
												>
													<motion.div variants={fadeIn}>
														<h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
															Technique
														</h4>
														<p className="mt-1 text-gray-900">
															{selectedPrint.technique}
														</p>
													</motion.div>
													<motion.div variants={fadeIn}>
														<h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
															Historical Era
														</h4>
														<p className="mt-1 text-gray-900">
															{selectedPrint.era}
														</p>
													</motion.div>
													<motion.div variants={fadeIn}>
														<h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
															Materials
														</h4>
														<div className="mt-1 flex flex-wrap gap-2">
															{selectedPrint.materials.map(
																(material, index) => (
																	<motion.span
																		key={index}
																		className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
																		initial={{ opacity: 0, scale: 0.8 }}
																		animate={{ opacity: 1, scale: 1 }}
																		transition={{ delay: 0.3 + index * 0.1 }}
																	>
																		{material}
																	</motion.span>
																)
															)}
														</div>
													</motion.div>
												</motion.div>

												<motion.div
													className="mt-8"
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.5 }}
												>
													<motion.button
														onClick={() => {
															notify(
																"Interesting fact: Gyotaku was originally used by fishermen to record their catches!"
															);
														}}
														className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer transition-all duration-300"
														whileHover={{
															scale: 1.05,
															boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
														}}
														whileTap={{ scale: 0.95 }}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="-ml-1 mr-2 h-5 w-5"
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
														Learn More
													</motion.button>
												</motion.div>
											</div>
										</div>
									</motion.div>
								</>
							) : (
								<motion.div
									key="grid"
									variants={staggerContainer}
									initial="hidden"
									animate="visible"
									className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
								>
									{fishPrintItems.map((item) => (
										<motion.div
											key={item.id}
											variants={cardVariants}
											whileHover="hover"
											className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
											onClick={() => setSelectedPrint(item)}
										>
											<div className="h-48 overflow-hidden relative">
												<img
													src={item.imageUrl}
													alt={item.title}
													className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
													<span className="text-white font-medium px-4 py-2 text-sm">
														{item.era}
													</span>
												</div>
											</div>
											<div className="p-5">
												<h4 className="text-lg font-semibold text-gray-900 mb-1">
													{item.title}
												</h4>
												<p className="text-gray-600 text-sm mb-3 line-clamp-2">
													{item.description}
												</p>
												<div className="flex justify-between items-center">
													<span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
														{item.technique}
													</span>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 text-indigo-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M13 7l5 5m0 0l-5 5m5-5H6"
														/>
													</svg>
												</div>
											</div>
										</motion.div>
									))}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.section>
				)}

				{}
				{activeSection === "technique" && (
					<motion.section
						ref={techniqueRef}
						initial="hidden"
						animate={techniqueInView ? "visible" : "hidden"}
						variants={fadeIn}
						className="py-4"
					>
						<motion.h3
							className="text-2xl font-bold text-gray-900 mb-8 flex items-center"
							variants={fadeIn}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mr-2 text-indigo-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
								/>
							</svg>
							The Gyotaku Technique
						</motion.h3>

						<motion.div className="mb-12" variants={fadeIn}>
							<p className="text-lg text-gray-600 mb-8">
								Gyotaku involves creating detailed impressions of fish using ink
								and paper. The process captures the intricate details of the
								fish's scales, fins, and form. There are two main approaches:
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
								<motion.div
									className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all duration-300"
									whileHover={{ y: -5 }}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 }}
								>
									<h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
										<span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full text-white mr-3 shadow-md">
											1
										</span>
										Direct Method (Chokusetsu-ho)
									</h4>
									<p className="text-gray-600">
										In this traditional approach, ink is applied directly to the
										fish's surface and paper is pressed against it to create an
										impression. This method produces detailed, high-contrast
										prints that capture the fish's texture.
									</p>
									<div className="mt-6 flex justify-center">
										<img
											src="https://images.unsplash.com/photo-1701964621522-9b660d6ebcbc?q=80&w=3197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
											alt="Direct Method Example"
											className="h-32 w-auto rounded-lg shadow-sm"
										/>
									</div>
								</motion.div>

								<motion.div
									className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all duration-300"
									whileHover={{ y: -5 }}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
								>
									<h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
										<span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 rounded-full text-white mr-3 shadow-md">
											2
										</span>
										Indirect Method (Kansetsu-ho)
									</h4>
									<p className="text-gray-600">
										A more modern technique where a thin layer of plastic or
										silk is placed over the fish before applying ink. This
										creates softer, more delicate impressions and allows for
										multiple prints from a single application.
									</p>
									<div className="mt-6 flex justify-center">
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Gyotaku-SadFish-small.jpg"
											alt="Indirect Method Example"
											className="h-32 w-auto rounded-lg shadow-sm"
										/>
									</div>
								</motion.div>
							</div>
						</motion.div>

						{}
						<motion.div
							className="mb-16"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							<h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
								The Gyotaku Process
							</h4>

							{}
							<div className="flex justify-center mb-8">
								{techniqueSteps.map((step, index) => (
									<motion.div
										key={step.id}
										className="mx-1 md:mx-2"
										initial={{ opacity: 0.5 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.05 * index }}
									>
										<div className="w-6 h-1.5 rounded-full bg-indigo-500"></div>
									</motion.div>
								))}
							</div>

							{}
							<div className="overflow-x-auto hide-scrollbar pb-4">
								<div className="flex space-x-6 min-w-max px-4">
									{techniqueSteps.map((step, index) => (
										<motion.div
											key={step.id}
											className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-80 flex-shrink-0"
											initial={{ opacity: 0, x: 50 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.1 * index }}
											whileHover={{ scale: 1.03 }}
										>
											{}
											<div className="relative h-48 overflow-hidden">
												<img
													src={step.imageUrl}
													alt={`Step ${step.id}: ${step.title}`}
													className="w-full h-full object-cover"
												/>

												{}
												<div className="absolute top-0 left-0 m-4 px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full">
													<span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
														Step {step.id}
													</span>
												</div>
											</div>

											{}
											<div className="p-6">
												<h5 className="text-xl font-bold text-gray-900 mb-3">
													{step.title}
												</h5>
												<p className="text-gray-600 mb-4">{step.description}</p>

												{}
												{(step.id === 2 || step.id === 4 || step.id === 5) && (
													<div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border-l-4 border-indigo-500">
														<p className="text-sm text-gray-800 flex items-start">
															<span className="font-medium text-indigo-700 mr-1">
																Pro tip:
															</span>
															{step.id === 2 &&
																"Start with water-based inks for easier cleanup as you learn the technique."}
															{step.id === 4 &&
																"Work from the center outward to minimize air bubbles and ensure even contact."}
															{step.id === 5 &&
																"Practice the peeling technique on scrap paper first to develop the right touch."}
														</p>
													</div>
												)}
											</div>
										</motion.div>
									))}
								</div>
							</div>

							{}
							<style jsx>{`
								.hide-scrollbar::-webkit-scrollbar {
									display: none;
								}
								.hide-scrollbar {
									-ms-overflow-style: none;
									scrollbar-width: none;
								}
							`}</style>
						</motion.div>

						{}
						<motion.div
							className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-sm border border-indigo-100 mb-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
						>
							<h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 mr-2 text-indigo-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
								Pro Tips for Better Prints
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
								<div className="flex items-start space-x-3">
									<span className="text-indigo-500 font-bold">•</span>
									<p>
										Use fresh fish with firm flesh for the best results and most
										detailed prints.
									</p>
								</div>
								<div className="flex items-start space-x-3">
									<span className="text-indigo-500 font-bold">•</span>
									<p>
										Experiment with different paper types - washi, rice paper,
										and mulberry all create unique effects.
									</p>
								</div>
								<div className="flex items-start space-x-3">
									<span className="text-indigo-500 font-bold">•</span>
									<p>
										Apply ink with a gentle dabbing motion rather than brushing
										to maintain detail.
									</p>
								</div>
								<div className="flex items-start space-x-3">
									<span className="text-indigo-500 font-bold">•</span>
									<p>
										Try different pressure levels when pressing the paper -
										lighter for delicate impressions.
									</p>
								</div>
							</div>
						</motion.div>
					</motion.section>
				)}

				{}
				{activeSection === "history" && (
					<motion.section
						ref={historyRef}
						initial="hidden"
						animate={historyInView ? "visible" : "hidden"}
						variants={fadeIn}
						className="py-4"
					>
						<motion.h3
							className="text-2xl font-bold text-gray-900 mb-8 flex items-center"
							variants={fadeIn}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mr-2 text-indigo-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{historyContent.title}
						</motion.h3>

						<motion.div
							className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 border border-gray-100"
							variants={fadeIn}
						>
							<div className="p-8">
								<motion.div
									className="flex justify-center mb-8"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.2 }}
								>
									<img
										src="https://images.unsplash.com/photo-1573455494060-c5595004fb6c?q=80&w=2940&auto=format&fit=crop"
										alt="Historical Japanese Print"
										className="h-48 object-cover rounded-lg shadow-md"
									/>
								</motion.div>

								<motion.p
									className="text-lg text-gray-600 mb-8 leading-relaxed"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
								>
									Gyotaku (魚拓) literally means "fish rubbing" in Japanese.
									This traditional form of nature printing has evolved from a
									practical documentation method to a respected art form with a
									rich cultural heritage.
								</motion.p>

								<motion.div
									className="border-l-4 border-indigo-200 pl-6 py-2 mb-10 bg-indigo-50 rounded-r-lg"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
								>
									<p className="text-gray-600 italic">
										"Gyotaku stands at the intersection of art and nature,
										science and beauty. It captures not just the form of the
										fish, but a moment in time and a connection to the natural
										world."
									</p>
									<p className="text-right text-sm text-gray-500 mt-2">
										— Boshu Nagase, Master Printmaker
									</p>
								</motion.div>

								<motion.div
									className="space-y-12"
									initial="hidden"
									animate="visible"
									variants={staggerContainer}
								>
									{historyContent.periods.map((period, index) => (
										<motion.div
											key={index}
											className="md:flex items-start group"
											variants={fadeIn}
											whileHover={{ x: 5 }}
										>
											<div className="md:w-1/4 mb-4 mr-8 md:mb-0">
												<h4 className="text-xl font-semibold text-indigo-700 px-4 py-2 rounded-lg inline-block">
													{period.era}
												</h4>
											</div>
											<div className="md:w-3/4 md:pl-8 relative">
												<div className="absolute top-0 left-0 h-full w-1 bg-indigo-100 rounded-full hidden md:block -ml-4"></div>
												<p className="text-gray-600 text-justify leading-relaxed pl-4 border-l-2 border-indigo-200 py-1">
													{period.description}
												</p>
											</div>
										</motion.div>
									))}
								</motion.div>

								<motion.div
									className="mt-12 pt-8 border-t border-gray-200"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.8 }}
								>
									<h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2 text-indigo-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
											/>
										</svg>
										Cultural Significance
									</h4>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<p className="text-gray-600 leading-relaxed">
											Gyotaku represents the Japanese appreciation for the
											natural world and the traditional connection between art
											and daily life. What began as a practical method for
											fishermen to record their catches transformed into a
											unique art form that preserves both cultural heritage and
											natural history.
										</p>
										<p className="text-gray-600 leading-relaxed">
											The art of Gyotaku embodies several key Japanese aesthetic
											principles: simplicity, precision, respect for nature, and
											finding beauty in the everyday. Today, it serves as a
											cultural bridge, connecting traditional practices with
											contemporary artistic expression.
										</p>
									</div>

									<motion.div
										className="flex justify-center mt-8"
										initial={{ scale: 0.9, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ delay: 1 }}
									>
										<img
											src="https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=2841&auto=format&fit=crop"
											alt="Japanese Culture"
											className="h-40 object-cover rounded-lg shadow-md"
										/>
									</motion.div>
								</motion.div>
							</div>
						</motion.div>
					</motion.section>
				)}

				{}
				{activeSection === "interactive" && (
					<motion.section
						ref={interactiveRef}
						initial="hidden"
						animate={interactiveInView ? "visible" : "hidden"}
						variants={fadeIn}
						className="py-4"
					>
						<motion.h3
							className="text-2xl font-bold text-gray-900 mb-8 flex items-center"
							variants={fadeIn}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mr-2 text-indigo-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
								/>
							</svg>
							Try Gyotaku Yourself
						</motion.h3>

						<motion.div
							className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 border border-gray-100"
							variants={fadeIn}
						>
							<div className="p-8">
								<motion.p
									className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2 }}
								>
									Experience the art of Gyotaku through this simple interactive
									simulation. Click and drag to apply "ink" to the fish, then
									create your print.
								</motion.p>

								<motion.div
									className="flex justify-center mb-8"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
								>
									<div className="relative">
										<canvas
											ref={canvasRef}
											width={800}
											height={400}
											className="border border-gray-200 rounded-xl bg-gray-50 cursor-pointer shadow-inner"
											onMouseDown={handleCanvasMouseDown}
										/>
										<div className="absolute top-2 right-2 bg-white/80 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 backdrop-blur-sm">
											Interactive Canvas
										</div>
									</div>
								</motion.div>

								<motion.div
									className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-10"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									<motion.button
										onClick={handlePrintSimulation}
										className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 cursor-pointer shadow-md flex items-center justify-center"
										whileHover={{
											scale: 1.05,
											boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
										}}
										whileTap={{ scale: 0.95 }}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
											/>
										</svg>
										Create Print
									</motion.button>
									<motion.button
										onClick={resetCanvas}
										className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2 text-gray-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
											/>
										</svg>
										Reset
									</motion.button>
								</motion.div>

								<motion.div
									className="mt-8 border-t border-gray-200 pt-8"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
								>
									<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
										<span className="w-8 h-1 bg-indigo-200 rounded-full mr-3"></span>
										Tips for Creating Gyotaku Prints
										<span className="w-8 h-1 bg-indigo-200 rounded-full ml-3"></span>
									</h4>

									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-600">
										{[
											{
												icon: (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-8 w-8 text-indigo-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
														/>
													</svg>
												),
												tip: "Start with a fresh, clean fish with distinct features.",
											},
											{
												icon: (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-8 w-8 text-indigo-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
														/>
													</svg>
												),
												tip: "Pat the fish dry before applying ink to ensure clean impressions.",
											},
											{
												icon: (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-8 w-8 text-indigo-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
														/>
													</svg>
												),
												tip: "Apply ink evenly but not too thickly to capture detail.",
											},
											{
												icon: (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-8 w-8 text-indigo-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
														/>
													</svg>
												),
												tip: "Use a soft brush for ink application to avoid damaging the fish.",
											},
											{
												icon: (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-8 w-8 text-indigo-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
														/>
													</svg>
												),
												tip: "Japanese washi paper works best, but any absorbent paper will work for beginners.",
											},
											{
												icon: (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-8 w-8 text-indigo-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
												),
												tip: "Press firmly but gently to capture all details without smudging.",
											},
										].map((item, index) => (
											<motion.div
												key={index}
												className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.5 + index * 0.1 }}
												whileHover={{ y: -5 }}
											>
												<div className="mb-3">{item.icon}</div>
												<p>{item.tip}</p>
											</motion.div>
										))}
									</div>
								</motion.div>
							</div>
						</motion.div>

						{}
						<motion.div
							className="mb-8"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.7 }}
						>
							<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2 text-indigo-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								Get Inspired
							</h4>

							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
								{[
									"https://upload.wikimedia.org/wikipedia/commons/a/a5/Gyotaku-SadFish-small.jpg",
									"https://images.unsplash.com/photo-1687382898799-77882ea4dfbe?q=80&w=3153&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
									"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Fish_Catalogue_MAN_Napoli_Inv120177_n01.jpg/800px-Fish_Catalogue_MAN_Napoli_Inv120177_n01.jpg",
									"https://images.unsplash.com/photo-1701964621522-9b660d6ebcbc?q=80&w=3197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
									"https://images.unsplash.com/photo-1719338204176-bdcad1a18f4f?q=80&w=2388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
									"https://images.unsplash.com/photo-1525873020571-08690094e301?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
								].map((src, index) => (
									<motion.div
										key={index}
										className="overflow-hidden rounded-lg shadow-sm h-24 sm:h-32"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.7 + index * 0.1 }}
										whileHover={{
											scale: 1.05,
											boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
										}}
									>
										<img
											src={src}
											alt={`Inspiration ${index + 1}`}
											className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
										/>
									</motion.div>
								))}
							</div>
						</motion.div>
					</motion.section>
				)}
			</main>

			{}
			<footer className="bg-gray-900 text-white pt-12 pb-8 mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div>
							<h5 className="text-lg font-semibold mb-4 text-indigo-300">
								About Gyotaku
							</h5>
							<ul className="space-y-2 text-gray-400">
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() => notify("Exploring the history of Gyotaku")}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										History
									</button>
								</li>
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() => notify("Learning about Gyotaku techniques")}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Techniques
									</button>
								</li>
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() =>
											notify("Famous Gyotaku masters and their work")
										}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Masters
									</button>
								</li>
							</ul>
						</div>

						<div>
							<h5 className="text-lg font-semibold mb-4 text-indigo-300">
								Resources
							</h5>
							<ul className="space-y-2 text-gray-400">
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() =>
											notify("Finding Gyotaku supplies and materials")
										}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Materials
									</button>
								</li>
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() =>
											notify("Workshops and classes for learning Gyotaku")
										}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Workshops
									</button>
								</li>
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() =>
											notify("Books and publications about Gyotaku")
										}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Publications
									</button>
								</li>
							</ul>
						</div>

						<div>
							<h5 className="text-lg font-semibold mb-4 text-indigo-300">
								Gallery
							</h5>
							<ul className="space-y-2 text-gray-400">
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() => notify("Traditional Gyotaku gallery")}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Traditional
									</button>
								</li>
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() => notify("Contemporary Gyotaku gallery")}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Contemporary
									</button>
								</li>
								<li className="hover:text-indigo-300 transition-colors duration-200">
									<button
										className="flex items-center cursor-pointer"
										onClick={() => notify("User submitted Gyotaku prints")}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Community
									</button>
								</li>
							</ul>
						</div>

						<div>
							<h5 className="text-lg font-semibold mb-4 text-indigo-300">
								Connect
							</h5>
							<div className="flex space-x-4 mb-4">
								{["facebook", "twitter", "instagram", "youtube"].map(
									(social, index) => (
										<motion.button
											key={social}
											className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors duration-300"
											onClick={() => notify(`Following us on ${social}`)}
											whileHover={{ y: -5 }}
											whileTap={{ scale: 0.9 }}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
												/>
											</svg>
										</motion.button>
									)
								)}
							</div>
							<button
								onClick={() => notify("Subscribing to our newsletter")}
								className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium transition-colors duration-300"
							>
								Subscribe to Newsletter
							</button>
						</div>
					</motion.div>

					<motion.div
						className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.5 }}
					>
						<div className="mb-4 md:mb-0">
							<div className="flex items-center space-x-2">
								<div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
										<path d="M15 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
									</svg>
								</div>
								<p className="text-gray-400 text-sm">
									© {new Date().getFullYear()}{" "}
									<span className="text-indigo-300">Gyotaku Art Explorer</span>.
									All rights reserved.
								</p>
							</div>
							<p className="text-gray-500 text-xs mt-1">
								Celebrating the traditional Japanese art of fish printing.
							</p>
						</div>

						<div className="flex space-x-6">
							<button
								className="text-gray-400 hover:text-indigo-300 text-sm transition-colors cursor-pointer"
								onClick={() => notify("Exploring more about Gyotaku")}
							>
								Learn More
							</button>
							<button
								className="text-gray-400 hover:text-indigo-300 text-sm transition-colors cursor-pointer"
								onClick={() => notify("Finding Gyotaku supplies")}
							>
								Supplies
							</button>
							<button
								className="text-gray-400 hover:text-indigo-300 text-sm transition-colors cursor-pointer"
								onClick={() => notify("Reading about Gyotaku artists")}
							>
								Artists
							</button>
							<button
								className="text-gray-400 hover:text-indigo-300 text-sm transition-colors cursor-pointer"
								onClick={() =>
									notify("Learning about fish species used in Gyotaku")
								}
							>
								Fish Species
							</button>
						</div>
					</motion.div>
				</div>
			</footer>

			{}
			<AnimatePresence>
				{isLoaded && (
					<motion.button
						className="fixed bottom-6 right-6 bg-indigo-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-indigo-700 focus:outline-none"
						onClick={() => {
							window.scrollTo({
								top: 0,
								behavior: "smooth",
							});
						}}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
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
								d="M5 15l7-7 7 7"
							/>
						</svg>
					</motion.button>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{isLoaded && (
					<motion.div
						className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50 border-t border-gray-200"
						initial={{ y: 100 }}
						animate={{ y: 0 }}
						transition={{ delay: 1.5, duration: 0.5 }}
					>
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
							<div className="flex items-center mb-4 sm:mb-0">
								<div className="flex-shrink-0 mr-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8 text-indigo-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
										/>
									</svg>
								</div>
								<div>
									<p className="text-gray-600">
										We use cookies to enhance your experience. By continuing to
										visit this site you agree to our use of cookies.
									</p>
								</div>
							</div>
							<div className="flex space-x-3">
								<motion.button
									className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => {
										notify("Preferences saved!");
										document
											.querySelector(".fixed.bottom-0")
											?.classList.add("hidden");
									}}
								>
									Accept All
								</motion.button>
								<motion.button
									className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => {
										notify("Cookie preferences updated!");
										document
											.querySelector(".fixed.bottom-0")
											?.classList.add("hidden");
									}}
								>
									Customize
								</motion.button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<AnimatePresence>
				{isLoaded && (
					<motion.div
						className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent"
							animate={{ rotate: 360 }}
							transition={{ duration: 1, ease: "linear", repeat: Infinity }}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{}
			<div className="fixed top-20 right-4 z-50">
				<motion.button
					className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => {
						notify("Accessibility options coming soon!");
					}}
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
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</motion.button>
			</div>

			{}
			<div className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<motion.div
					className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl relative"
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
				>
					<button
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
						onClick={() => {
							document
								.querySelector(".fixed.inset-0.bg-black")
								?.classList.add("hidden");
						}}
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
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					<h3 className="text-2xl font-bold text-gray-900 mb-4">
						Join Our Newsletter
					</h3>
					<p className="text-gray-600 mb-6">
						Stay updated with the latest Gyotaku techniques, events, and
						inspiration.
					</p>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
								placeholder="your@email.com"
							/>
						</div>
						<div className="flex items-center">
							<input
								type="checkbox"
								id="consent"
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="consent"
								className="ml-2 block text-sm text-gray-700"
							>
								I agree to receive email communications.
							</label>
						</div>
						<button
							className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
							onClick={() => {
								notify("Subscribed to newsletter!");
								document
									.querySelector(".fixed.inset-0.bg-black")
									?.classList.add("hidden");
							}}
						>
							Subscribe
						</button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

const globalStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
    100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-pulse-custom {
    animation: pulse 2s infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0) 40%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  }
  
  
  @media (max-width: 640px) {
    .sm\\:text-clip {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .mobile-padding {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .mobile-stack > * {
      margin-bottom: 0.75rem;
    }
  }
  
  
  body {
    font-family: 'Inter', 'Poppins', 'Segoe UI', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  
  html {
    scroll-behavior: smooth;
  }
  
  
  img {
    image-rendering: optimizeQuality;
  }
  
  
  button:focus, a:focus, input:focus {
    outline: 2px solid rgba(79, 70, 229, 0.5);
    outline-offset: 2px;
  }
  
  
  * {
    will-change: auto;
  }
  
  .hardware-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
  }
`;

if (typeof document !== "undefined") {
	const styleElement = document.createElement("style");
	styleElement.appendChild(document.createTextNode(globalStyles));
	document.head.appendChild(styleElement);
}
