"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types and interfaces
interface APIEndpoint {
	id: string;
	name: string;
	url: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers: Record<string, string>;
	body?: string;
	response?: string;
	position: { x: number; y: number };
	validation?: {
		isValid: boolean;
		errors: string[];
	};
	isDraft?: boolean;
}

interface Connection {
	id: string;
	source: string;
	target: string;
	sourceHandle?: string;
	targetHandle?: string;
}

interface DragState {
	isDragging: boolean;
	draggedId: string | null;
	offset: { x: number; y: number };
}

interface TemporaryConnectionLineProps {
	sourceId: string;
	endpoints: APIEndpoint[];
	canvasRef: React.RefObject<HTMLDivElement | null>;
	darkMode: boolean;
}

// Helper Components
const Logo = ({ darkMode, size = "normal" }) => (
	<div className="flex items-center">
		<div
			className={`flex items-center justify-center rounded-lg overflow-hidden 
      ${size === "large" ? "w-12 h-12" : "w-8 h-8"} 
      ${darkMode ? "bg-indigo-500" : "bg-indigo-600"}`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={`${size === "large" ? "w-7 h-7" : "w-5 h-5"} text-white`}
			>
				<path d="M4 11a9 9 0 0 1 9 9"></path>
				<path d="M4 4a16 16 0 0 1 16 16"></path>
				<circle cx="5" cy="19" r="2"></circle>
			</svg>
		</div>
		<div
			className={`ml-2 font-bold ${size === "large" ? "text-2xl" : "text-lg"} ${
				darkMode ? "text-white" : "text-gray-800"
			}`}
		>
			APIConnect
			<span
				className={`${
					darkMode ? "text-indigo-300" : "text-indigo-600"
				} font-extrabold`}
			>
				Pro
			</span>
		</div>
	</div>
);

// Loading Screen Component
const LoadingScreen = ({ darkMode, isLoading, setIsLoading }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2200);
		return () => clearTimeout(timer);
	}, [setIsLoading]);

	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${
						darkMode ? "bg-gray-900" : "bg-white"
					}`}
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="text-center"
					>
						<Logo darkMode={darkMode} size="large" />

						<div className="mt-8 relative">
							<div
								className={`w-48 h-1.5 rounded-full ${
									darkMode ? "bg-gray-700" : "bg-gray-200"
								}`}
							></div>
							<motion.div
								className={`absolute top-0 left-0 h-1.5 rounded-full ${
									darkMode ? "bg-indigo-400" : "bg-indigo-600"
								}`}
								initial={{ width: 0 }}
								animate={{ width: "100%" }}
								transition={{ duration: 2 }}
							></motion.div>
						</div>

						<p
							className={`mt-6 text-sm ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							Loading your workspace...
						</p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

// Landing Page Component
const LandingPage = ({ darkMode, onStart }) => {
	return (
		<div
			className={`min-h-screen ${
				darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
			}`}
		>
			{/* Hero Section */}
			<div
				className={`px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative overflow-hidden ${
					darkMode
						? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
						: "bg-gradient-to-br from-gray-50 via-white to-indigo-50"
				}`}
			>
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
							backgroundSize: "60px 60px",
						}}
					></div>
				</div>

				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col items-center text-center">
						<Logo darkMode={darkMode} size="large" />

						<h1
							className={`mt-8 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Build API Workflows{" "}
							<span
								className={`${
									darkMode ? "text-indigo-400" : "text-indigo-600"
								}`}
							>
								Visually
							</span>
						</h1>

						<p
							className={`mt-6 max-w-2xl text-xl ${
								darkMode ? "text-gray-300" : "text-gray-600"
							}`}
						>
							Design, connect, and test your API chains with a simple
							drag-and-drop interface. No coding required.
						</p>

						<div className="mt-10">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className={`px-8 py-4 rounded-lg font-bold text-lg shadow-lg ${
									darkMode
										? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-700/30"
										: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30"
								} transition-all duration-200`}
								onClick={onStart}
							>
								Start Building Now
							</motion.button>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2
							className={`text-3xl font-bold ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Powerful Features for API Management
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								title: "Visual Workflow Builder",
								description:
									"Drag, drop, and connect API endpoints to create complex workflows",
								icon: (
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
											d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
										/>
									</svg>
								),
							},
							{
								title: "Request Testing",
								description:
									"Test your API endpoints directly within the interface",
								icon: (
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
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								),
							},
							{
								title: "Response Validation",
								description: "Validate API responses against expected schemas",
								icon: (
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
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
										/>
									</svg>
								),
							},
							{
								title: "Custom Headers",
								description:
									"Add and manage custom headers for your API requests",
								icon: (
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
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								),
							},
							{
								title: "Multiple HTTP Methods",
								description:
									"Support for GET, POST, PUT, DELETE, and PATCH methods",
								icon: (
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
											d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
										/>
									</svg>
								),
							},
							{
								title: "Export & Import",
								description: "Share your API workflows with your team",
								icon: (
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
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
								),
							},
						].map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 + 0.2 }}
								className={`p-6 rounded-xl ${
									darkMode
										? "bg-gray-800 hover:bg-gray-750"
										: "bg-white hover:bg-gray-50"
								} shadow-lg transition-all duration-200 border ${
									darkMode ? "border-gray-700" : "border-gray-200"
								} hover:shadow-xl`}
							>
								<div
									className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${
										darkMode
											? "bg-indigo-900/50 text-indigo-400"
											: "bg-indigo-100 text-indigo-600"
									}`}
								>
									{feature.icon}
								</div>
								<h3
									className={`text-xl font-bold mb-2 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									{feature.title}
								</h3>
								<p
									className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
								>
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className={`py-16 ${darkMode ? "bg-gray-800" : "bg-indigo-50"}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2
						className={`text-3xl font-bold mb-8 ${
							darkMode ? "text-white" : "text-gray-900"
						}`}
					>
						Ready to Streamline Your API Workflow?
					</h2>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className={`px-8 py-4 rounded-lg font-bold text-lg shadow-lg ${
							darkMode
								? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-700/30"
								: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30"
						} transition-all duration-200`}
						onClick={onStart}
					>
						Get Started Now
					</motion.button>
				</div>
			</div>

			{/* Footer */}
			<footer
				className={`py-12 ${
					darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-600"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="col-span-1 md:col-span-2">
							<Logo darkMode={darkMode} size="normal" />
							<p className="mt-4 max-w-md">
								Build, test, and deploy API workflows with our intuitive visual
								builder. Trusted by developers worldwide.
							</p>
						</div>
						<div>
							<h3
								className={`text-sm font-semibold uppercase tracking-wider ${
									darkMode ? "text-gray-200" : "text-gray-900"
								}`}
							>
								Resources
							</h3>
							<ul className="mt-4 space-y-2">
								<li>
									<a href="#" className="hover:underline">
										Documentation
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										API Reference
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										Tutorials
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										Blog
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3
								className={`text-sm font-semibold uppercase tracking-wider ${
									darkMode ? "text-gray-200" : "text-gray-900"
								}`}
							>
								Company
							</h3>
							<ul className="mt-4 space-y-2">
								<li>
									<a href="#" className="hover:underline">
										About
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										Careers
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										Contact
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										Privacy
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-12 pt-8 border-t border-gray-800 text-center">
						<p>© 2025 APIConnectPro. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

// Temporary connection line component for visual feedback during connection
const TemporaryConnectionLine: React.FC<TemporaryConnectionLineProps> = ({
	sourceId,
	endpoints,
	canvasRef,
	darkMode,
}) => {
	const source = endpoints.find((ep) => ep.id === sourceId);

	const [mousePosition, setMousePosition] = useState(() => {
		if (source) {
			const sourceX = source.position.x + 200;
			const sourceY = source.position.y + 35;
			return { x: sourceX, y: sourceY };
		}
		return { x: 0, y: 0 };
	});

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvasRef.current?.getBoundingClientRect();
			if (rect) {
				setMousePosition({
					x: e.clientX - rect.left,
					y: e.clientY - rect.top,
				});
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault();
			const rect = canvasRef.current?.getBoundingClientRect();
			if (rect && e.touches[0]) {
				setMousePosition({
					x: e.touches[0].clientX - rect.left,
					y: e.touches[0].clientY - rect.top,
				});
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("touchmove", handleTouchMove);
		};
	}, [canvasRef, source]);

	if (!source) return null;

	const sourceX = source.position.x + 200;
	const sourceY = source.position.y + 35;

	const controlPointOffset = 50;

	const cp1x = sourceX + controlPointOffset;
	const cp1y = sourceY;
	const cp2x = mousePosition.x - controlPointOffset;
	const cp2y = mousePosition.y;

	return (
		<path
			d={`M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${mousePosition.x} ${mousePosition.y}`}
			stroke={darkMode ? "#818cf8" : "#6366f1"}
			strokeWidth="2"
			fill="none"
			strokeDasharray="5,5"
			pointerEvents="none"
		/>
	);
};

// Connection component with hover state
const ConnectionLine: React.FC<{
	connection: Connection;
	endpoints: APIEndpoint[];
	removeConnection: (id: string) => void;
	darkMode: boolean;
}> = ({ connection, endpoints, removeConnection, darkMode }) => {
	const [isHovered, setIsHovered] = useState(false);

	const source = endpoints.find((ep) => ep.id === connection.source);
	const target = endpoints.find((ep) => ep.id === connection.target);

	if (!source || !target) return null;

	const sourceX = source.position.x + 200;
	const sourceY = source.position.y + 35;
	const targetX = target.position.x;
	const targetY = target.position.y + 35;

	const controlPointOffset = 50;

	const cp1x = sourceX + controlPointOffset;
	const cp1y = sourceY;
	const cp2x = targetX - controlPointOffset;
	const cp2y = targetY;

	// Calculate midpoint for delete button
	const midX = (sourceX + targetX) / 2;
	const midY = (sourceY + targetY) / 2 - 10;

	return (
		<g
			key={connection.id}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<path
				d={`M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`}
				stroke={
					isHovered
						? darkMode
							? "#f9fafb"
							: "#4338ca"
						: darkMode
						? "#818cf8"
						: "#6366f1"
				}
				strokeWidth={isHovered ? "3" : "2"}
				fill="none"
				className="cursor-pointer"
				onClick={() => removeConnection(connection.id)}
			/>
			<circle
				cx={sourceX}
				cy={sourceY}
				r="4"
				fill={darkMode ? "#818cf8" : "#6366f1"}
			/>
			<circle
				cx={targetX}
				cy={targetY}
				r="4"
				fill={darkMode ? "#818cf8" : "#6366f1"}
			/>

			{/* Delete button that appears on hover */}
			{isHovered && (
				<g
					transform={`translate(${midX}, ${midY})`}
					onClick={() => removeConnection(connection.id)}
					className="cursor-pointer"
				>
					<circle
						r="12"
						className={`${
							darkMode
								? "fill-gray-700 stroke-indigo-400"
								: "fill-white stroke-indigo-500"
						} stroke-[1.5px]`}
					/>
					<text
						className={`${
							darkMode ? "fill-gray-50" : "fill-indigo-700"
						} text-center text-sm font-bold`}
						textAnchor="middle"
						dominantBaseline="middle"
					>
						×
					</text>
				</g>
			)}
		</g>
	);
};

// Tooltip component
const Tooltip = ({ children, text, position = "top" }) => {
	const [isVisible, setIsVisible] = useState(false);

	const positions = {
		top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
		bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
		left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
		right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
	};

	return (
		<div
			className="relative flex items-center justify-center"
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{children}
			{isVisible && (
				<div className={`absolute ${positions[position]} z-50`}>
					<div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
						{text}
					</div>
				</div>
			)}
		</div>
	);
};

// endpoint card component
const EndpointCard: React.FC<{
	endpoint: APIEndpoint;
	isSelected: boolean;
	connectingFrom: string | null;
	handleStartDrag: (e: React.MouseEvent | React.TouchEvent, id: string) => void;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setPanelMode: React.Dispatch<React.SetStateAction<"add" | "edit" | null>>;
	setSelectedEndpoint: (id: string | null) => void;
	deleteEndpoint: (id: string) => void;
	handleConnectorClick: (id: string) => void;
	darkMode: boolean;
	isMobile: boolean;
}> = ({
	endpoint,
	isSelected,
	connectingFrom,
	handleStartDrag,
	setSelectedEndpoint,
	deleteEndpoint,
	setSidebarOpen,
	setPanelMode,
	handleConnectorClick,
	darkMode,
	isMobile,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	// Get method colors
	const getMethodColor = (method: string) => {
		switch (method) {
			case "GET":
				return "bg-gradient-to-r from-emerald-500 to-emerald-600";
			case "POST":
				return "bg-gradient-to-r from-blue-500 to-blue-600";
			case "PUT":
				return "bg-gradient-to-r from-amber-500 to-amber-600";
			case "DELETE":
				return "bg-gradient-to-r from-red-500 to-red-600";
			case "PATCH":
				return "bg-gradient-to-r from-purple-600 to-purple-700";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.2 }}
			className={`absolute w-[200px] min-h-[70px] p-3 rounded-lg shadow-md select-none z-10
        ${
					darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
				} 
        ${
					isSelected
						? `border-2 ${
								darkMode
									? "border-indigo-400 shadow-indigo-200/10"
									: "border-indigo-500 shadow-indigo-200/20"
						  }`
						: "border-2"
				} 
        ${
					!endpoint.validation?.isValid
						? `${
								darkMode
									? "border-red-500 bg-red-900/20"
									: "border-red-500 bg-red-50"
						  }`
						: ""
				}
        ${
					isHovered && !isSelected
						? `transform -translate-y-0.5 shadow-lg ${
								darkMode
									? "border-indigo-300 bg-gray-600"
									: "border-purple-400 bg-gray-50"
						  }`
						: ""
				} transition-all duration-200 cursor-grab active:cursor-grabbing`}
			style={{
				left: `${endpoint.position.x}px`,
				top: `${endpoint.position.y}px`,
				zIndex: isSelected ? 1100 : 1000,
			}}
			onMouseDown={(e) => handleStartDrag(e, endpoint.id)}
			onTouchStart={(e) => handleStartDrag(e, endpoint.id)}
			onClick={() => {
				setSelectedEndpoint(endpoint.id);
				setPanelMode("edit");
				if (isMobile) {
					setSidebarOpen(false);
				}
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex items-center gap-2 mb-2">
				<span
					className={`px-2 py-0.5 rounded text-xs font-semibold text-white shadow-sm ${getMethodColor(
						endpoint.method
					)}`}
				>
					{endpoint.method}
				</span>
				<span
					className={`flex-1 font-medium text-sm overflow-hidden whitespace-nowrap overflow-ellipsis ${
						darkMode ? "text-gray-100" : "text-gray-800"
					}`}
				>
					{endpoint.name || "Unnamed Endpoint"}
				</span>
			</div>

			<div
				className={`text-xs overflow-hidden whitespace-nowrap overflow-ellipsis text-center ${
					darkMode ? "text-gray-400" : "text-gray-500"
				}`}
			>
				{endpoint.url}
			</div>

			{endpoint.validation && !endpoint.validation.isValid && (
				<div
					className={`mt-2 p-2 rounded text-xs ${
						darkMode
							? "bg-red-900/30 border border-red-400"
							: "bg-red-100 border border-red-200"
					}`}
				>
					{endpoint.validation.errors.map((error, i) => (
						<div
							key={i}
							className={`${darkMode ? "text-red-300" : "text-red-600"}`}
						>
							⚠ {error}
						</div>
					))}
				</div>
			)}

			{/* connector for outgoing connections (right side) */}
			<Tooltip text="Output Connector" position="right">
				<div
					className={`absolute w-[30px] h-[30px] right-[-15px] top-1/2 transform -translate-y-1/2 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-all duration-200 border-2
            ${
							darkMode
								? "bg-indigo-400 border-gray-700"
								: "bg-indigo-500 border-white"
						}
            ${
							connectingFrom === endpoint.id
								? `scale-110 ${
										darkMode ? "shadow-indigo-400/40" : "shadow-indigo-500/40"
								  } shadow-[0_0_0_4px]`
								: ""
						}
            ${
							isHovered && connectingFrom !== endpoint.id
								? `scale-110 ${
										darkMode ? "shadow-indigo-400/20" : "shadow-indigo-500/20"
								  } shadow-[0_0_0_3px]`
								: ""
						}`}
					onClick={(e) => {
						e.stopPropagation();
						handleConnectorClick(endpoint.id);
					}}
					onTouchStart={(e) => {
						e.stopPropagation();
						handleConnectorClick(endpoint.id);
					}}
				>
					<span className="pointer-events-none">OUT</span>
				</div>
			</Tooltip>

			{/* connector for incoming connections (left side) */}
			<Tooltip text="Input Connector" position="left">
				<div
					className={`absolute w-[30px] h-[30px] left-[-15px] top-1/2 transform -translate-y-1/2 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-all duration-200 border-2
            ${
							darkMode
								? "bg-indigo-400 border-gray-700"
								: "bg-indigo-500 border-white"
						}
            ${
							connectingFrom && connectingFrom !== endpoint.id
								? `border-dashed ${
										darkMode ? "shadow-indigo-400/20" : "shadow-indigo-500/20"
								  } shadow-[0_0_0_3px]`
								: ""
						}
            ${
							isHovered && connectingFrom !== endpoint.id
								? `scale-110 ${
										darkMode ? "shadow-indigo-400/20" : "shadow-indigo-500/20"
								  } shadow-[0_0_0_3px]`
								: ""
						}`}
					onClick={(e) => {
						e.stopPropagation();
						handleConnectorClick(endpoint.id);
					}}
					onTouchStart={(e) => {
						e.stopPropagation();
						handleConnectorClick(endpoint.id);
					}}
				>
					<span className="pointer-events-none">IN</span>
				</div>
			</Tooltip>

			{isHovered && endpoint.response && (
				<motion.div
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 5 }}
					className={`absolute top-full left-0 mt-2 w-[300px] max-h-[150px] overflow-auto p-2 rounded border z-[100]
            ${
							darkMode
								? "bg-gray-700 border-gray-600"
								: "bg-white border-gray-300"
						} shadow-lg`}
				>
					<div className="flex justify-between items-center mb-1">
						<span
							className={`text-xs font-medium ${
								darkMode ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Response Preview
						</span>
					</div>
					<pre
						className={`m-0 text-xs whitespace-pre-wrap break-words ${
							darkMode ? "text-gray-100" : "text-gray-800"
						}`}
					>
						{endpoint.response}
					</pre>
				</motion.div>
			)}
		</motion.div>
	);
};

// Empty State Component
const EmptyState = ({ darkMode, onAddEndpoint }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="absolute inset-0 flex flex-col items-center justify-center"
		>
			<div
				className={`text-center max-w-md mx-auto p-8 rounded-xl ${
					darkMode ? "bg-gray-800/50" : "bg-white/50"
				}`}
			>
				<div
					className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
						darkMode ? "bg-gray-700" : "bg-indigo-100"
					}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`h-10 w-10 ${
							darkMode ? "text-indigo-400" : "text-indigo-600"
						}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</div>
				<h3
					className={`text-xl font-bold mb-2 ${
						darkMode ? "text-white" : "text-gray-900"
					}`}
				>
					No endpoints yet
				</h3>
				<p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
					Start by adding your first API endpoint to the canvas
				</p>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onAddEndpoint}
					className={`px-4 py-2 rounded-lg ${
						darkMode
							? "bg-indigo-500 hover:bg-indigo-400 text-white"
							: "bg-indigo-600 hover:bg-indigo-500 text-white"
					} font-medium shadow-md transition-all duration-200`}
				>
					Add First Endpoint
				</motion.button>
			</div>
		</motion.div>
	);
};

// Notification Component
const Notification = ({ message, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 5000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`fixed top-4 right-4 z-[2000] px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
				type === "success"
					? "bg-green-600 text-white"
					: type === "error"
					? "bg-red-600 text-white"
					: "bg-blue-600 text-white"
			}`}
		>
			<div className="flex-shrink-0">
				{type === "success" ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
				) : type === "error" ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
				)}
			</div>
			<div className="text-sm font-medium">{message}</div>
			<button
				onClick={onClose}
				className="ml-auto text-white opacity-70 hover:opacity-100 transition-opacity"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</motion.div>
	);
};

// main component
const APIConnectorBuilder: React.FC = () => {
	const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
		{
			id: "1",
			name: "Get Users",
			url: "https://api.example.com/users",
			method: "GET",
			headers: { "Content-Type": "application/json" },
			position: { x: 500, y: 250 },
			response: `[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]`,
			validation: { isValid: true, errors: [] },
		},
		{
			id: "2",
			name: "Create User",
			url: "https://api.example.com/users",
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: `{
  "name": "John Doe",
  "email": "john.doe@example.com"
}`,
			position: { x: 350, y: 150 },
			response: `{
  "id": 3,
  "name": "John Doe",
  "email": "john.doe@example.com"
}`,
			validation: { isValid: true, errors: [] },
		},
		{
			id: "3",
			name: "Delete User",
			url: "https://api.example.com/users/3",
			method: "DELETE",
			headers: { Authorization: "Bearer token" },
			position: { x: 600, y: 100 },
			response: `{
  "success": true,
  "message": "User deleted"
}`,
			validation: { isValid: true, errors: [] },
		},
	]);
	const [connections, setConnections] = useState<Connection[]>([]);
	const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [panelMode, setPanelMode] = useState<"add" | "edit" | null>(null);
	const [dragState, setDragState] = useState<DragState>({
		isDragging: false,
		draggedId: null,
		offset: { x: 0, y: 0 },
	});
	const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
	const canvasRef = useRef<HTMLDivElement | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [darkMode, setDarkMode] = useState(true);
	const [windowHeight, setWindowHeight] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [showLanding, setShowLanding] = useState(true);
	const [notification, setNotification] = useState<{
		show: boolean;
		message: string;
		type: "success" | "error" | "info";
	}>({
		show: false,
		message: "",
		type: "info",
	});

	// Check for mobile device and set window height
	useEffect(() => {
		const checkMobile = () => {
			const mobileBreakpoint = 768;
			const currentIsMobile = window.innerWidth < mobileBreakpoint;
			setIsMobile(currentIsMobile);

			// Set window height for calculating canvas size
			setWindowHeight(window.innerHeight);

			// Only auto-close sidebar on mobile
			if (currentIsMobile && sidebarOpen) {
				setSidebarOpen(false);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [sidebarOpen]);

	// Load font
	useEffect(() => {
		const link = document.createElement("link");
		link.href =
			"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
		link.rel = "stylesheet";
		document.head.appendChild(link);
	}, []);

	// Reset endpoints when starting
	const handleStartApp = () => {
		setShowLanding(false);
		// Clear demo endpoints for a fresh start
		setEndpoints([]);
		setConnections([]);
	};

	const showNotification = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		setNotification({
			show: true,
			message,
			type,
		});
	};

	const validateEndpoint = (
		endpoint: APIEndpoint
	): { isValid: boolean; errors: string[] } => {
		const errors: string[] = [];

		if (!endpoint.url || !endpoint.url.startsWith("http")) {
			errors.push("Invalid URL format");
		}

		if (
			endpoint.method === "POST" ||
			endpoint.method === "PUT" ||
			endpoint.method === "PATCH"
		) {
			try {
				if (endpoint.body) JSON.parse(endpoint.body);
			} catch {
				errors.push("Invalid JSON body");
			}
		}

		return { isValid: errors.length === 0, errors };
	};

	const addEndpoint = () => {
		// find a spot that doesn't overlap any existing card (200×70 box)
		const getPos = () => {
			const gapX = 220,
				gapY = 100;
			let x = 150,
				y = 150;
			// bump right/down until clear
			while (
				endpoints.some(
					(ep) =>
						Math.abs(ep.position.x - x) < gapX &&
						Math.abs(ep.position.y - y) < gapY
				)
			) {
				x += gapX;
				if (x > window.innerWidth - gapX) {
					x = 150;
					y += gapY;
				}
			}
			return { x, y };
		};
		const position = getPos();
		const newEndpoint: APIEndpoint = {
			id: Date.now().toString(),
			name: "",
			url: "https://api.example.com/",
			method: "GET",
			headers: { "Content-Type": "application/json" },
			position,
			validation: { isValid: true, errors: [] },
			isDraft: true,
		};
		setEndpoints([...endpoints, newEndpoint]);
		setSelectedEndpoint(newEndpoint.id);
		setPanelMode("add");
		if (!isMobile) {
			setSidebarOpen(true);
		}

		showNotification("New endpoint added", "success");
	};

	const updateEndpoint = (id: string, updates: Partial<APIEndpoint>) => {
		setEndpoints(
			endpoints.map((ep) => {
				if (ep.id === id) {
					const updated = { ...ep, ...updates };
					const validation = validateEndpoint(updated);
					return { ...updated, validation };
				}
				return ep;
			})
		);
	};

	const deleteEndpoint = (id: string) => {
		setEndpoints(endpoints.filter((ep) => ep.id !== id));
		setConnections(
			connections.filter((conn) => conn.source !== id && conn.target !== id)
		);
		if (selectedEndpoint === id) {
			setSelectedEndpoint(null);
			setPanelMode(null);
		}

		showNotification("Endpoint deleted", "info");
	};

	// handle mouse and touch events for dragging
	const handleStartDrag = useCallback(
		(e: React.MouseEvent | React.TouchEvent, endpointId: string) => {
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

			const rect = canvasRef.current?.getBoundingClientRect();
			if (!rect) return;

			const endpoint = endpoints.find((ep) => ep.id === endpointId);
			if (!endpoint) return;

			setDragState({
				isDragging: true,
				draggedId: endpointId,
				offset: {
					x: clientX - rect.left - endpoint.position.x,
					y: clientY - rect.top - endpoint.position.y,
				},
			});
		},
		[endpoints]
	);

	const handleDrag = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!dragState.isDragging || !dragState.draggedId) return;

			if ("touches" in e) e.preventDefault();

			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

			const rect = canvasRef.current?.getBoundingClientRect();
			if (!rect) return;

			const newX = clientX - rect.left - dragState.offset.x;
			const newY = clientY - rect.top - dragState.offset.y;

			updateEndpoint(dragState.draggedId, {
				position: { x: Math.max(0, newX), y: Math.max(0, newY) },
			});
		},
		[dragState, updateEndpoint]
	);

	const handleEndDrag = useCallback(() => {
		setDragState({
			isDragging: false,
			draggedId: null,
			offset: { x: 0, y: 0 },
		});
	}, []);

	useEffect(() => {
		if (dragState.isDragging) {
			document.addEventListener("mousemove", handleDrag);
			document.addEventListener("mouseup", handleEndDrag);
			document.addEventListener("touchmove", handleDrag, { passive: false });
			document.addEventListener("touchend", handleEndDrag);
			return () => {
				document.removeEventListener("mousemove", handleDrag);
				document.removeEventListener("mouseup", handleEndDrag);
				document.removeEventListener("touchmove", handleDrag);
				document.removeEventListener("touchend", handleEndDrag);
			};
		}
	}, [dragState.isDragging, handleDrag, handleEndDrag]);

	const handleConnectorClick = (endpointId: string) => {
		if (!connectingFrom) {
			setConnectingFrom(endpointId);
		} else if (connectingFrom === endpointId) {
			setConnectingFrom(null);
		} else {
			const source = connectingFrom;
			const target = endpointId;
			setConnectingFrom(null);

			const existingConnection = connections.find(
				(conn) =>
					(conn.source === source && conn.target === target) ||
					(conn.source === target && conn.target === source)
			);

			if (existingConnection) {
				removeConnection(existingConnection.id);
				return;
			}

			const newConnection: Connection = {
				id: Date.now().toString(),
				source,
				target,
			};

			if (source === target) return;

			setConnections((prevConnections) => [...prevConnections, newConnection]);
			showNotification("Connection created", "success");
		}
	};

	// remove connection
	const removeConnection = (id: string) => {
		setConnections(connections.filter((conn) => conn.id !== id));
		showNotification("Connection removed", "info");
	};

	const closePanel = () => {
		setPanelMode(null);
		if (isMobile) {
			setSidebarOpen(false);
		}
	};

	// Calculate the available height for the canvas
	const headerHeight = isMobile ? 60 : 70;
	const footerHeight = 150; // Adjusted footer height
	const canvasHeight = windowHeight - headerHeight - footerHeight;

	const mainAppContent = (
		<div
			className={`flex flex-col h-screen w-screen overflow-hidden font-inter ${
				darkMode ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			{/* Toolbar */}
			<div
				className={`flex justify-between items-center border-b shadow-md sticky top-0 z-[1000] px-3 md:px-5 py-3
          ${
						darkMode
							? "bg-gray-800 border-gray-700 shadow-black/30"
							: "bg-white border-gray-200 shadow-black/5"
					}`}
			>
				<div className="flex items-center">
					{isMobile && (
						<button
							className={`border-none bg-transparent text-xl cursor-pointer p-1.5 flex items-center justify-center mr-2 ${
								darkMode ? "text-gray-200" : "text-gray-600"
							}`}
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							☰
						</button>
					)}
					<Logo darkMode={darkMode} size="normal" />
				</div>

				<div className="flex items-center gap-3">
					<Tooltip text="Add new endpoint">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={`bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none py-1.5 px-3 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap
                  ${isMobile ? "text-xs" : ""}`}
							onClick={addEndpoint}
						>
							+ Add Endpoint
						</motion.button>
					</Tooltip>

					<Tooltip text={darkMode ? "Light mode" : "Dark mode"}>
						<div className="flex items-center justify-center">
							<label className="switch relative inline-block w-[46px] h-6 cursor-pointer">
								<input
									type="checkbox"
									className="opacity-0 w-0 h-0"
									checked={darkMode}
									onChange={() => setDarkMode(!darkMode)}
								/>
								<span
									className={`slider absolute cursor-pointer inset-0 ${
										darkMode ? "bg-indigo-500" : "bg-gray-300"
									} transition-all duration-300 rounded-full before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-300 ${
										darkMode ? "before:translate-x-[24px]" : ""
									}`}
								></span>
								<span className="absolute right-[-22px] top-[3px] text-sm">
									{darkMode ? "🌙" : "☀️"}
								</span>
							</label>
						</div>
					</Tooltip>

					<div className="hidden md:flex ml-2">
						<Tooltip text="Save Project">
							<button
								className={`p-2 rounded-full transition-colors ${
									darkMode
										? "hover:bg-gray-700 text-gray-300 hover:text-white"
										: "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
								}`}
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
										d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
									/>
								</svg>
							</button>
						</Tooltip>

						<Tooltip text="Settings">
							<button
								className={`p-2 rounded-full transition-colors ${
									darkMode
										? "hover:bg-gray-700 text-gray-300 hover:text-white"
										: "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
								}`}
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
										d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</button>
						</Tooltip>

						<Tooltip text="Help">
							<button
								className={`p-2 rounded-full transition-colors ${
									darkMode
										? "hover:bg-gray-700 text-gray-300 hover:text-white"
										: "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
								}`}
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
										d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</button>
						</Tooltip>
					</div>
				</div>
			</div>

			{/* Main Content Area with Sidebar and Canvas */}
			<div className="flex flex-1 relative overflow-hidden">
				{/* Sidebar - Docs Panel */}
				<motion.div
					className={`fixed top-[70px] bottom-0 border-r shadow-lg overflow-y-auto overflow-x-hidden z-30
            ${
							darkMode
								? "bg-gray-800 text-gray-100 border-gray-700 shadow-black/50"
								: "bg-white text-gray-800 border-gray-200 shadow-black/10"
						}`}
					style={{ height: `calc(100% - ${headerHeight}px)` }}
					initial={false}
					animate={{
						x: sidebarOpen ? 0 : -300,
						width: sidebarOpen ? (isMobile ? "100%" : "300px") : 0,
					}}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
				>
					<div className="p-5">
						<div className="flex justify-between items-center mb-6">
							<h2
								className={`m-0 text-xl font-semibold ${
									darkMode ? "text-gray-100" : "text-gray-800"
								}`}
							>
								API Reference
							</h2>
							{sidebarOpen && (
								<button
									className={`border-none bg-transparent text-2xl leading-none cursor-pointer z-[3] opacity-70 hover:opacity-100 transition-opacity ${
										darkMode ? "text-gray-200" : "text-gray-600"
									}`}
									onClick={() => setSidebarOpen(false)}
								>
									×
								</button>
							)}
						</div>

						<div className="mb-7">
							<h3
								className={`text-base font-medium mb-3 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Quick Start
							</h3>
							<ol
								className={`pl-5 space-y-2 text-sm leading-relaxed ${
									darkMode ? "text-gray-300" : "text-gray-600"
								}`}
							>
								<li>
									Click <strong>"Add Endpoint"</strong> to create a new API
									endpoint
								</li>
								<li>Click on an endpoint to configure it</li>
								<li>Click the connector dots to link endpoints</li>
								<li>Drag endpoints to rearrange them</li>
								<li>Click on connection lines to remove them</li>
							</ol>
						</div>

						<div className="mb-7">
							<h3
								className={`text-base font-medium mb-3 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Methods
							</h3>
							<div className="flex flex-col gap-2">
								<div className="p-2 rounded text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-emerald-500 to-emerald-600">
									GET - Retrieve data
								</div>
								<div className="p-2 rounded text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-blue-500 to-blue-600">
									POST - Create new data
								</div>
								<div className="p-2 rounded text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-amber-500 to-amber-600">
									PUT - Update data
								</div>
								<div className="p-2 rounded text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-red-500 to-red-600">
									DELETE - Remove data
								</div>
								<div className="p-2 rounded text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-purple-600 to-purple-700">
									PATCH - Partially update data
								</div>
							</div>
						</div>

						<div className="mb-7">
							<h3
								className={`text-base font-medium mb-3 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Headers
							</h3>
							<pre
								className={`p-3 rounded text-xs overflow-auto shadow-inner ${
									darkMode
										? "bg-gray-900 text-gray-100"
										: "bg-gray-900 text-gray-100"
								}`}
							>
								{`{
  "Content-Type": "application/json",
  "Authorization": "Bearer token"
}`}
							</pre>
						</div>
					</div>
				</motion.div>

				{/* Main Workspace */}
				<motion.div
					className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
					initial={false}
					animate={{
						marginLeft: !isMobile && sidebarOpen ? "300px" : "0",
						marginRight: !isMobile && panelMode ? "350px" : "0",
					}}
				>
					{/* Toggle sidebar button for desktop */}
					{!isMobile && (
						<Tooltip
							text={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
							position="right"
						>
							<motion.button
								className={`fixed top-[80px] ${
									sidebarOpen ? "left-[305px]" : "left-[5px]"
								} w-8 h-8 rounded-full flex items-center justify-center shadow-md cursor-pointer z-[31] transition-all duration-300 text-xs
                  ${
										darkMode
											? "bg-gray-700 text-gray-100 border border-gray-600 hover:bg-gray-600"
											: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
									}`}
								onClick={() => setSidebarOpen(!sidebarOpen)}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								{sidebarOpen ? "◀" : "▶"}
							</motion.button>
						</Tooltip>
					)}

					{/* Canvas */}
					<div
						ref={canvasRef}
						className={`flex-1 relative overflow-auto min-w-0 min-h-0 ${
							darkMode ? "bg-gray-900" : "bg-gray-50"
						} 
              ${
								darkMode
									? "bg-[radial-gradient(#4a5568_1px,transparent_1px)]"
									: "bg-[radial-gradient(#d1d5db_1px,transparent_1px)]"
							} bg-[size:20px_20px]`}
						style={{
							touchAction: dragState.isDragging ? "none" : "auto",
							minHeight: `${canvasHeight}px`,
						}}
					>
						<svg className="absolute top-0 left-0 w-full h-full z-0 overflow-visible">
							{connections.map((connection) => (
								<ConnectionLine
									key={connection.id}
									connection={connection}
									endpoints={endpoints}
									removeConnection={removeConnection}
									darkMode={darkMode}
								/>
							))}
							{connectingFrom && (
								<TemporaryConnectionLine
									sourceId={connectingFrom}
									endpoints={endpoints}
									canvasRef={canvasRef}
									darkMode={darkMode}
								/>
							)}
						</svg>

						<AnimatePresence>
							{endpoints.map((endpoint) => (
								<EndpointCard
									key={endpoint.id}
									endpoint={endpoint}
									isSelected={selectedEndpoint === endpoint.id}
									connectingFrom={connectingFrom}
									handleStartDrag={handleStartDrag}
									setSelectedEndpoint={setSelectedEndpoint}
									deleteEndpoint={deleteEndpoint}
									setSidebarOpen={setSidebarOpen}
									setPanelMode={setPanelMode}
									handleConnectorClick={handleConnectorClick}
									darkMode={darkMode}
									isMobile={isMobile}
								/>
							))}
						</AnimatePresence>

						{endpoints.length === 0 && (
							<EmptyState darkMode={darkMode} onAddEndpoint={addEndpoint} />
						)}
					</div>

					{/* Footer */}
					<footer
						className={`border-t shadow-inner ${
							darkMode
								? "bg-gray-800 border-gray-700 text-gray-100"
								: "bg-white border-gray-200 text-gray-800"
						}`}
					>
						<div className="container mx-auto px-4 py-3">
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								<div className="col-span-2 md:col-span-1">
									<div className="flex items-center h-full">
										<Logo darkMode={darkMode} size="normal" />
									</div>
								</div>
								<div className="hidden md:block">
									<div className="flex items-center justify-center h-full">
										<div className="flex space-x-4">
											<a
												href="#"
												className={`text-sm transition-colors duration-200 ${
													darkMode
														? "text-indigo-300 hover:text-indigo-200"
														: "text-indigo-600 hover:text-indigo-800"
												}`}
											>
												Documentation
											</a>
											<a
												href="#"
												className={`text-sm transition-colors duration-200 ${
													darkMode
														? "text-indigo-300 hover:text-indigo-200"
														: "text-indigo-600 hover:text-indigo-800"
												}`}
											>
												API Reference
											</a>
											<a
												href="#"
												className={`text-sm transition-colors duration-200 ${
													darkMode
														? "text-indigo-300 hover:text-indigo-200"
														: "text-indigo-600 hover:text-indigo-800"
												}`}
											>
												Support
											</a>
										</div>
									</div>
								</div>
								<div>
									<div className="flex items-center justify-end h-full">
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											© 2025 APIConnectPro. All rights reserved.
										</p>
									</div>
								</div>
							</div>
						</div>
					</footer>
				</motion.div>

				{/* Properties Panel - Fixed on the right */}
				<AnimatePresence>
					{panelMode && selectedEndpoint && (
						<motion.div
							className={`
                ${
									darkMode
										? "bg-gray-800 text-gray-100 border-gray-700 shadow-black/40"
										: "bg-white text-gray-800 border-gray-200 shadow-black/10"
								}
                ${
									isMobile
										? "fixed bottom-0 left-0 right-0 max-h-[60vh] border-t shadow-[0_-2px_8px_rgba(0,0,0,0.05)] z-30"
										: "fixed top-[70px] right-0 bottom-0 w-[350px] border-l shadow-[-2px_0_10px_rgba(0,0,0,0.1)] z-30"
								}
                overflow-y-auto overflow-x-hidden`}
							initial={isMobile ? { y: 300 } : { x: 350 }}
							animate={isMobile ? { y: 0 } : { x: 0 }}
							exit={isMobile ? { y: 300 } : { x: 350 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						>
							<div className="p-5">
								<div className="flex justify-between items-center mb-5">
									<h3
										className={`m-0 text-lg font-semibold ${
											darkMode ? "text-gray-100" : "text-gray-800"
										}`}
									>
										{panelMode === "add"
											? "Create New Endpoint"
											: "Edit Endpoint"}
									</h3>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										className={`bg-transparent border-none text-2xl cursor-pointer p-0 leading-none opacity-70 transition-opacity duration-200 hover:opacity-100
                      ${darkMode ? "text-gray-300" : "text-gray-500"}`}
										onClick={closePanel}
									>
										×
									</motion.button>
								</div>
								{(() => {
									const endpoint = endpoints.find(
										(ep) => ep.id === selectedEndpoint
									);
									if (!endpoint) return null;
									return (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 }}
										>
											<div className="mb-4">
												<label
													className={`block mb-1.5 text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Name
												</label>
												<input
													className={`w-full max-w-full p-2.5 border rounded-md text-sm outline-none transition-all duration-200 box-border
                            ${
															darkMode
																? "bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-400"
																: "bg-white border-gray-300 text-gray-800 focus:border-indigo-500"
														}`}
													value={endpoint.name}
													onChange={(e) =>
														updateEndpoint(endpoint.id, {
															name: e.target.value,
														})
													}
													placeholder="Enter endpoint name"
												/>
											</div>
											<div className="mb-4">
												<label
													className={`block mb-1.5 text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													URL
												</label>
												<input
													className={`w-full max-w-full p-2.5 border rounded-md text-sm outline-none transition-all duration-200 box-border
                            ${
															darkMode
																? "bg-gray-700 text-gray-100"
																: "bg-white text-gray-800"
														}
                            ${
															endpoint.validation &&
															endpoint.validation.errors.includes(
																"Invalid URL format"
															)
																? `${
																		darkMode
																			? "border-red-500 bg-red-900/20 shadow-red-500/10 shadow-[0_0_0_3px]"
																			: "border-red-500 bg-red-50 shadow-red-500/10 shadow-[0_0_0_3px]"
																  }`
																: `${
																		darkMode
																			? "border-gray-600 focus:border-indigo-400"
																			: "border-gray-300 focus:border-indigo-500"
																  }`
														}`}
													value={endpoint.url}
													onChange={(e) =>
														updateEndpoint(endpoint.id, { url: e.target.value })
													}
													placeholder="https://api.example.com/"
												/>
												{endpoint.validation &&
													endpoint.validation.errors.includes(
														"Invalid URL format"
													) && (
														<div
															className={`text-xs mt-1 font-medium ${
																darkMode ? "text-red-300" : "text-red-600"
															}`}
														>
															URL must start with http:// or https://
														</div>
													)}
											</div>
											<div className="mb-4">
												<label
													className={`block mb-1.5 text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Method
												</label>
												<select
													className={`w-full min-w-0 max-w-full p-2.5 border rounded-md text-sm outline-none cursor-pointer box-border transition-all duration-200 appearance-none bg-no-repeat bg-right-[0.7rem] bg-center bg-[length:1.5em_1.5em] pr-8
                            ${
															darkMode
																? "bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-400"
																: "bg-white border-gray-300 text-gray-800 focus:border-indigo-500"
														}`}
													style={{
														backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='${
															darkMode ? "%23f9fafb" : "%231e293b"
														}'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
													}}
													value={endpoint.method}
													onChange={(e) =>
														updateEndpoint(endpoint.id, {
															method: e.target.value as APIEndpoint["method"],
														})
													}
												>
													<option value="GET">GET</option>
													<option value="POST">POST</option>
													<option value="PUT">PUT</option>
													<option value="DELETE">DELETE</option>
													<option value="PATCH">PATCH</option>
												</select>
											</div>
											<div className="mb-4">
												<label
													className={`block mb-1.5 text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Headers
												</label>
												<textarea
													className={`w-full max-w-full min-h-[100px] p-2.5 border rounded-md text-sm font-mono outline-none resize-vertical box-border
                            ${
															darkMode
																? "bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-400"
																: "bg-white border-gray-300 text-gray-800 focus:border-indigo-500"
														}`}
													value={JSON.stringify(endpoint.headers, null, 2)}
													onChange={(e) => {
														try {
															const headers = JSON.parse(e.target.value);
															updateEndpoint(endpoint.id, { headers });
														} catch {}
													}}
												/>
											</div>
											{(endpoint.method === "POST" ||
												endpoint.method === "PUT" ||
												endpoint.method === "PATCH") && (
												<div className="mb-4">
													<label
														className={`block mb-1.5 text-sm font-medium ${
															darkMode ? "text-gray-300" : "text-gray-700"
														}`}
													>
														Request Body
													</label>
													<textarea
														className={`w-full max-w-full min-h-[100px] p-2.5 border rounded-md text-sm font-mono outline-none resize-vertical box-border
                              ${
																darkMode
																	? "bg-gray-700 text-gray-100"
																	: "bg-white text-gray-800"
															}
                              ${
																endpoint.validation &&
																endpoint.validation.errors.includes(
																	"Invalid JSON body"
																)
																	? `${
																			darkMode
																				? "border-red-500 bg-red-900/20 shadow-red-500/10 shadow-[0_0_0_3px]"
																				: "border-red-500 bg-red-50 shadow-red-500/10 shadow-[0_0_0_3px]"
																	  }`
																	: `${
																			darkMode
																				? "border-gray-600 focus:border-indigo-400"
																				: "border-gray-300 focus:border-indigo-500"
																	  }`
															}`}
														value={endpoint.body || ""}
														onChange={(e) =>
															updateEndpoint(endpoint.id, {
																body: e.target.value,
															})
														}
														placeholder='{"key": "value"}'
													/>
													{endpoint.validation &&
														endpoint.validation.errors.includes(
															"Invalid JSON body"
														) && (
															<div
																className={`text-xs mt-1 font-medium ${
																	darkMode ? "text-red-300" : "text-red-600"
																}`}
															>
																Please enter valid JSON
															</div>
														)}
												</div>
											)}
											<div className="mb-4">
												<label
													className={`block mb-1.5 text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Expected Response
												</label>
												<textarea
													className={`w-full max-w-full min-h-[100px] p-2.5 border rounded-md text-sm font-mono outline-none resize-vertical box-border
                            ${
															darkMode
																? "bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-400"
																: "bg-white border-gray-300 text-gray-800 focus:border-indigo-500"
														}`}
													value={endpoint.response || ""}
													onChange={(e) =>
														updateEndpoint(endpoint.id, {
															response: e.target.value,
														})
													}
													placeholder="Define expected response format..."
												/>
											</div>
											{(() => {
												const isConnected = connections.some(
													(conn) =>
														conn.source === selectedEndpoint ||
														conn.target === selectedEndpoint
												);
												if (!isConnected) return null;
												return (
													<div className="mt-5">
														<h4
															className={`text-base font-medium mb-2 ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															Request Preview
														</h4>
														<pre
															className={`p-3 rounded text-xs overflow-auto shadow-inner
                              ${
																darkMode
																	? "bg-gray-900 text-gray-100"
																	: "bg-gray-900 text-gray-100"
															}`}
														>
															{endpoint.body ?? "— no request body defined —"}
														</pre>

														<h4
															className={`text-base font-medium mb-2 mt-4 ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															Response Preview
														</h4>
														<pre
															className={`p-3 rounded text-xs overflow-auto shadow-inner
                              ${
																darkMode
																	? "bg-gray-900 text-gray-100"
																	: "bg-gray-900 text-gray-100"
															}`}
														>
															{endpoint.response ??
																"— no expected response defined —"}
														</pre>
													</div>
												);
											})()}
											<div className="flex flex-wrap gap-2 mt-6">
												<motion.button
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none py-2.5 px-5 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
													onClick={() => {
														// Mark as not draft
														if (panelMode === "add") {
															setEndpoints(
																endpoints.map((ep) =>
																	ep.id === selectedEndpoint
																		? {
																				...ep,
																				isDraft: false,
																				validation: validateEndpoint(ep),
																		  }
																		: ep
																)
															);
															showNotification("Endpoint saved", "success");
														} else {
															showNotification("Changes saved", "success");
														}
														closePanel();
													}}
												>
													Save
												</motion.button>

												<motion.button
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white border-none py-2.5 px-5 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
													onClick={closePanel}
												>
													Cancel
												</motion.button>

												<motion.button
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white border-none py-2.5 px-5 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md mt-3"
													onClick={() => {
														deleteEndpoint(selectedEndpoint);
														closePanel();
													}}
												>
													Delete Endpoint
												</motion.button>
											</div>
										</motion.div>
									);
								})()}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Notification System */}
			<AnimatePresence>
				{notification.show && (
					<Notification
						message={notification.message}
						type={notification.type}
						onClose={() => setNotification({ ...notification, show: false })}
					/>
				)}
			</AnimatePresence>
		</div>
	);

	return (
		<>
			<LoadingScreen
				darkMode={darkMode}
				isLoading={isLoading}
				setIsLoading={setIsLoading}
			/>

			{!isLoading &&
				(showLanding ? (
					<LandingPage darkMode={darkMode} onStart={handleStartApp} />
				) : (
					mainAppContent
				))}
		</>
	);
};

export default APIConnectorBuilder;
