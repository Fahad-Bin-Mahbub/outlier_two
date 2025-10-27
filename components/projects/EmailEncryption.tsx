"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	HashRouter as Router,
	Routes,
	Route,
	Link,
	useNavigate,
	useLocation,
	useParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import * as LucideIcons from "lucide-react";
import { useSpring, animated } from "react-spring";

// Types
interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	twoFactorEnabled: boolean;
	encryptionKeys: EncryptionKey[];
	connectedAccounts: ConnectedAccount[];
	profileImage?: string;
}

interface EncryptionKey {
	id: string;
	name: string;
	publicKey: string;
	privateKey: string;
	fingerprint: string;
	createdAt: Date;
	isActive: boolean;
}

interface ConnectedAccount {
	id: string;
	provider: "gmail" | "outlook" | "yahoo" | "other";
	email: string;
	connected: boolean;
}

interface Email {
	id: string;
	from: string;
	to: string[];
	cc?: string[];
	bcc?: string[];
	subject: string;
	body: string;
	attachments: Attachment[];
	isEncrypted: boolean;
	encryptionLevel: "standard" | "high";
	timestamp: Date;
	read: boolean;
	starred: boolean;
	folder: "inbox" | "sent" | "drafts" | "trash" | "encrypted" | "archived";
	expiresAt?: Date;
	readReceipt?: boolean;
	passwordProtected?: boolean;
	passwordHint?: string;
	labels?: string[];
}

interface Attachment {
	id: string;
	name: string;
	type: string;
	size: number;
	url: string;
	isEncrypted: boolean;
}

interface Label {
	id: string;
	name: string;
	color: string;
}

// Main App Component
function EmailEncryption() {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

	// Check if user is logged in on component mount
	useEffect(() => {
		// Simulate a loading state for better UX
		setTimeout(() => {
			const user = localStorage.getItem("user");
			if (user) {
				setCurrentUser(JSON.parse(user));
				setIsLoggedIn(true);
			}

			// Check for dark mode preference
			const savedDarkMode = localStorage.getItem("darkMode") === "true";
			setDarkMode(savedDarkMode);
			setLoading(false);
		}, 800);
	}, []);

	// Apply dark mode class to body
	useEffect(() => {
		if (darkMode) {
			document.body.classList.add("dark");
			document.documentElement.style.colorScheme = "dark";
		} else {
			document.body.classList.remove("dark");
			document.documentElement.style.colorScheme = "light";
		}
		localStorage.setItem("darkMode", darkMode.toString());
	}, [darkMode]);

	// Handle login
	const handleLogin = (user: User) => {
		setCurrentUser(user);
		setIsLoggedIn(true);
		localStorage.setItem("user", JSON.stringify(user));
		toast.success(`Welcome back, ${user.name}!`);
	};

	// Handle logout
	const handleLogout = () => {
		setCurrentUser(null);
		setIsLoggedIn(false);
		localStorage.removeItem("user");
		toast.success("You've been securely logged out.");
	};

	// Toggle dark mode
	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		toast(darkMode ? "Light mode activated" : "Dark mode activated", {
			icon: darkMode ? "🌞" : "🌙",
		});
	};

	if (loading) {
		return (
			<div
				className={`min-h-screen flex items-center justify-center ${
					darkMode ? "bg-gray-900" : "bg-gray-50"
				}`}
			>
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
					<h2
						className={`text-xl font-semibold ${
							darkMode ? "text-white" : "text-gray-800"
						}`}
					>
						Loading SecureEmail...
					</h2>
					<p
						className={`text-sm mt-2 ${
							darkMode ? "text-gray-400" : "text-gray-500"
						}`}
					>
						Please wait while we set up your secure environment
					</p>
				</div>
			</div>
		);
	}

	return (
		<Router>
			<div className={darkMode ? "dark" : ""}>
				<Toaster
					position="top-right"
					toastOptions={{
						style: {
							background: darkMode ? "#374151" : "#ffffff",
							color: darkMode ? "#ffffff" : "#1f2937",
							boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
							borderRadius: "8px",
						},
						duration: 3000,
					}}
				/>
				<div
					className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}
				>
					<AnimatePresence mode="wait">
						<Routes>
							<Route
								path="/"
								element={
									isLoggedIn ? (
										<Dashboard
											user={currentUser}
											onLogout={handleLogout}
											darkMode={darkMode}
											toggleDarkMode={toggleDarkMode}
										/>
									) : (
										<LandingPage
											onLogin={handleLogin}
											darkMode={darkMode}
											toggleDarkMode={toggleDarkMode}
										/>
									)
								}
							/>
							<Route
								path="/login"
								element={<Login onLogin={handleLogin} darkMode={darkMode} />}
							/>
							<Route
								path="/register"
								element={<Register onLogin={handleLogin} darkMode={darkMode} />}
							/>
							<Route
								path="/security-setup"
								element={
									<SecuritySetup user={currentUser} darkMode={darkMode} />
								}
							/>
							<Route
								path="/dashboard/*"
								element={
									<Dashboard
										user={currentUser}
										onLogout={handleLogout}
										darkMode={darkMode}
										toggleDarkMode={toggleDarkMode}
									/>
								}
							/>
							<Route
								path="/compose"
								element={<Compose user={currentUser} darkMode={darkMode} />}
							/>
							<Route
								path="/view-email/:id"
								element={<ViewEmail user={currentUser} darkMode={darkMode} />}
							/>
							<Route
								path="/settings"
								element={<Settings user={currentUser} darkMode={darkMode} />}
							/>
						</Routes>
					</AnimatePresence>
				</div>
			</div>
		</Router>
	);
}

// Enhanced LandingPage Component
function LandingPage({
	onLogin,
	darkMode,
	toggleDarkMode,
}: {
	onLogin: (user: User) => void;
	darkMode: boolean;
	toggleDarkMode: () => void;
}) {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	// Spring animation for hero elements
	const heroAnimation = useSpring({
		from: { opacity: 0, transform: "translateY(40px)" },
		to: { opacity: 1, transform: "translateY(0)" },
		delay: 200,
	});

	const featureAnimation = useSpring({
		from: { opacity: 0, transform: "translateY(40px)" },
		to: { opacity: 1, transform: "translateY(0)" },
		delay: 500,
	});

	// Demo login for testing
	const handleDemoLogin = () => {
		// Show loading state
		toast.loading("Setting up your demo account...");

		setTimeout(() => {
			const demoUser: User = {
				id: "demo-user",
				name: "Demo User",
				email: "demo@example.com",
				password: "demo-password",
				twoFactorEnabled: false,
				encryptionKeys: [
					{
						id: "default-key",
						name: "Default Key",
						publicKey: "demo-public-key",
						privateKey: "demo-private-key",
						fingerprint: "AB:CD:EF:12:34:56",
						createdAt: new Date(),
						isActive: true,
					},
				],
				connectedAccounts: [
					{
						id: "gmail-account",
						provider: "gmail",
						email: "demo@gmail.com",
						connected: true,
					},
				],
				profileImage:
					"https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff",
			};

			toast.dismiss();
			toast.success("Demo account ready!");
			onLogin(demoUser);
			navigate("/dashboard");
		}, 1500);
	};
	const scrollToSection = (sectionId: any) => {
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div
			className={`flex flex-col min-h-screen ${
				darkMode ? "text-white" : "text-gray-800"
			}`}
		>
			{/* Navigation Bar */}
			<nav
				className={`sticky top-0 z-50 border-b shadow-sm ${
					darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
									<LucideIcons.Shield className="h-6 w-6" />
								</div>
								<span
									className={`ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
										darkMode
											? "from-indigo-400 to-purple-400"
											: "from-indigo-600 to-purple-600"
									}`}
								>
									SecureEmail
								</span>
							</div>
							<div className="hidden sm:ml-8 sm:flex sm:space-x-8 items-center">
								<a
									href="#features"
									onClick={(e) => {
										e.preventDefault();
										scrollToSection("features");
										setMenuOpen(false);
									}}
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
										darkMode
											? "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
											: "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
									}`}
								>
									Features
								</a>
								<a
									href="#how-it-works"
									onClick={(e) => {
										e.preventDefault();
										scrollToSection("how-it-works");
										setMenuOpen(false);
									}}
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
										darkMode
											? "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
											: "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
									}`}
								>
									How It Works
								</a>
								<a
									href="#pricing"
									onClick={(e) => {
										e.preventDefault();
										scrollToSection("pricing");
										setMenuOpen(false);
									}}
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
										darkMode
											? "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
											: "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
									}`}
								>
									Pricing
								</a>
							</div>
						</div>
						<div className="flex items-center">
							<button
								onClick={toggleDarkMode}
								className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
									darkMode
										? "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
										: "text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
								}`}
								aria-label="Toggle dark mode"
							>
								{darkMode ? (
									<LucideIcons.Sun className="h-5 w-5" />
								) : (
									<LucideIcons.Moon className="h-5 w-5" />
								)}
							</button>
							<div className="ml-4 flex items-center space-x-4">
								<Link
									to="/login"
									className={`hidden md:inline-flex px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
										darkMode
											? "text-gray-300 hover:text-indigo-400"
											: "text-gray-500 hover:text-indigo-600"
									}`}
								>
									Log in
								</Link>
								<Link
									to="/register"
									className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5"
								>
									Register
								</Link>
							</div>

							{/* Mobile menu button */}
							<div className="md:hidden ml-2">
								<button
									onClick={() => setMenuOpen(!menuOpen)}
									className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
										darkMode
											? "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
											: "text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
									}`}
								>
									{menuOpen ? (
										<LucideIcons.X className="h-6 w-6" />
									) : (
										<LucideIcons.Menu className="h-6 w-6" />
									)}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				<AnimatePresence>
					{menuOpen && (
						<motion.div
							className="md:hidden"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
						>
							<div
								className={`px-2 pt-2 pb-3 space-y-1 border-t ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										scrollToSection("features");
										setMenuOpen(false);
									}}
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
										darkMode
											? "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
											: "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
									}`}
								>
									Features
								</a>
								<a
									href="#how-it-works"
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
										darkMode
											? "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
											: "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
									}`}
									onClick={() => setMenuOpen(false)}
								>
									How It Works
								</a>
								<a
									href="#pricing"
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
										darkMode
											? "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
											: "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
									}`}
									onClick={() => setMenuOpen(false)}
								>
									Pricing
								</a>
								<Link
									to="/login"
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
										darkMode
											? "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
											: "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
									}`}
									onClick={() => setMenuOpen(false)}
								>
									Log in
								</Link>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</nav>

			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-20 sm:py-28 overflow-hidden">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
				<div className="absolute right-0 top-0 -mr-40 -mt-40 w-80 h-80 rounded-full bg-purple-400 filter blur-3xl opacity-30"></div>
				<div className="absolute left-0 bottom-0 -ml-40 -mb-40 w-80 h-80 rounded-full bg-indigo-400 filter blur-3xl opacity-30"></div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
						<animated.div
							style={heroAnimation}
							className="mb-12 lg:mb-0 text-center sm:text-left"
						>
							<span className="inline-block px-3 py-1 mb-5 text-xs font-semibold text-indigo-100 bg-indigo-700 bg-opacity-50 rounded-full shadow-lg">
								Military-Grade Encryption for Everyone
							</span>
							<h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
								Secure Your Email <br className="hidden md:block" />
								<span className="text-indigo-200">Without Compromises</span>
							</h1>
							<p className="mt-6 text-xl text-indigo-100 max-w-3xl">
								Add an extra layer of protection to your existing email accounts
								with end-to-end encryption, timed self-destruction, and advanced
								security features.
							</p>
							<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
								<Link
									to="/register"
									className="bg-white text-indigo-600 hover:text-indigo-700 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
								>
									<LucideIcons.Shield className="mr-2 h-5 w-5" />
									Get Started Free
								</Link>
								<button
									onClick={handleDemoLogin}
									className="bg-indigo-800 bg-opacity-50 text-white hover:bg-opacity-70 font-medium px-6 py-3 rounded-lg border border-indigo-200 border-opacity-40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
								>
									<LucideIcons.Play className="mr-2 h-5 w-5" />
									Try Instant Demo
								</button>
							</div>
							<div className="mt-6 text-indigo-200 text-sm flex items-center justify-center sm:justify-start">
								<LucideIcons.CheckCircle className="h-5 w-5 mr-2" />
								No credit card required
							</div>
						</animated.div>

						<animated.div style={featureAnimation} className="relative">
							<div
								className={`rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105 ${
									darkMode ? "bg-gray-800" : "bg-white"
								}`}
							>
								<div className="px-6 py-6">
									<div className="flex justify-between items-center mb-6">
										<div className="flex items-center">
											<div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white">
												<LucideIcons.Mail className="h-5 w-5" />
											</div>
											<div className="ml-3">
												<h3
													className={`text-lg font-semibold ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													New Encrypted Message
												</h3>
												<p
													className={`text-sm ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													From: secure-team@example.com
												</p>
											</div>
										</div>
										<div className="flex">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												<LucideIcons.Lock className="h-3 w-3 mr-1" />
												Encrypted
											</span>
										</div>
									</div>

									<div
										className={`border-t py-5 space-y-4 ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
									>
										<div>
											<h4
												className={`text-sm font-medium ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Subject
											</h4>
											<p
												className={`mt-1 text-base font-medium ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Your secure documents are ready
											</p>
										</div>

										<div>
											<h4
												className={`text-sm font-medium ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Message
											</h4>
											<div
												className={`mt-1 p-3 rounded-lg ${
													darkMode ? "bg-gray-700" : "bg-gray-50"
												}`}
											>
												<p
													className={`text-sm ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Your confidential documents have been encrypted and
													are ready for review. Please click the button below to
													securely access them.
												</p>
												<button className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200">
													View Secure Documents
												</button>
											</div>
										</div>

										<div>
											<h4
												className={`text-sm font-medium ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Security
											</h4>
											<div
												className={`mt-2 flex items-center text-sm ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												<LucideIcons.Clock className="h-4 w-4 mr-1 text-amber-500" />
												<span>Expires in 7 days</span>
											</div>
											<div
												className={`mt-1 flex items-center text-sm ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												<LucideIcons.ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
												<span>AES-256 encryption</span>
											</div>
										</div>
									</div>
								</div>

								<div
									className={`px-6 py-4 border-t flex justify-between ${
										darkMode
											? "bg-gray-750 border-gray-700"
											: "bg-gray-50 border-gray-200"
									}`}
								>
									<button
										className={`font-medium text-sm flex items-center ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										<LucideIcons.Reply className="mr-1 h-4 w-4" />
										Reply
									</button>
									<button
										className={`font-medium text-sm flex items-center ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										<LucideIcons.Forward className="mr-1 h-4 w-4" />
										Forward
									</button>
								</div>
							</div>

							<div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg">
								<LucideIcons.Lock className="h-6 w-6" />
							</div>

							<div
								className={`absolute -bottom-4 -left-4 w-48 h-10 p-2 rounded-lg flex items-center justify-center shadow-md ${
									darkMode ? "bg-green-900" : "bg-green-100"
								}`}
							>
								<span
									className={`text-xs font-medium ${
										darkMode ? "text-green-200" : "text-green-800"
									}`}
								>
									<LucideIcons.Shield className="inline-block h-3 w-3 mr-1" />
									End-to-End Encrypted
								</span>
							</div>
						</animated.div>
					</div>

					{/* Trusted by section */}
					<div className="mt-20 text-center relative overflow-hidden">
						{/* Background gradient orbs */}
						<div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
						<div className="absolute top-10 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

						<div className="relative z-10">
							<p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 text-sm font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in">
								Trusted by leading organizations
							</p>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 justify-items-center">
								{[
									{
										name: "Acme Inc",
										icon: "Building2",
										color: "from-blue-400 to-indigo-500",
									},
									{
										name: "GlobalTech",
										icon: "Globe",
										color: "from-green-400 to-emerald-500",
									},
									{
										name: "SecureCorp",
										icon: "Shield",
										color: "from-purple-400 to-violet-500",
									},
									{
										name: "DataGuard",
										icon: "Database",
										color: "from-pink-400 to-rose-500",
									},
								].map((company, index) => {
									const IconComponent = LucideIcons[company.icon];
									return (
										<div
											key={index}
											className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:rotate-1 cursor-pointer"
											style={{
												animationDelay: `${index * 200}ms`,
											}}
										>
											{/* Glow effect */}
											<div
												className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${company.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}
											></div>

											{/* Content */}
											<div className="relative z-10 flex flex-col items-center space-y-3">
												<div
													className={`p-3 rounded-xl bg-gradient-to-r ${company.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
												>
													<IconComponent className="h-6 w-6 text-white" />
												</div>
												<span className="text-white/90 group-hover:text-white font-bold text-lg transition-colors duration-300">
													{company.name}
												</span>
											</div>

											{/* Shine effect */}
											<div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
												<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Floating particles */}
							<div
								className="absolute top-0 left-0 w-2 h-2 bg-indigo-400 rounded-full animate-ping"
								style={{ animationDelay: "0s" }}
							></div>
							<div
								className="absolute top-20 right-10 w-1 h-1 bg-purple-400 rounded-full animate-ping"
								style={{ animationDelay: "2s" }}
							></div>
							<div
								className="absolute bottom-10 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping"
								style={{ animationDelay: "4s" }}
							></div>
						</div>

						<style jsx>{`
							@keyframes fade-in {
								from {
									opacity: 0;
									transform: translateY(20px);
								}
								to {
									opacity: 1;
									transform: translateY(0);
								}
							}
							.animate-fade-in {
								animation: fade-in 0.8s ease-out forwards;
							}
						`}</style>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id="features"
				className={`py-16 sm:py-24 ${darkMode ? "bg-gray-900" : "bg-white"}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<span
							className={`inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full ${
								darkMode
									? "text-indigo-400 bg-indigo-900 bg-opacity-50"
									: "text-indigo-600 bg-indigo-100"
							}`}
						>
							Key Features
						</span>
						<h2
							className={`text-3xl font-extrabold sm:text-4xl ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Email Encryption Made Simple
						</h2>
						<p
							className={`mt-4 max-w-2xl mx-auto text-xl ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							Protect your privacy without sacrificing convenience with our
							comprehensive security suite.
						</p>
					</div>

					<div className="mt-16">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{/* Feature 1 */}
							<motion.div
								whileHover={{
									y: -8,
									boxShadow:
										"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
								}}
								transition={{ duration: 0.2 }}
								className={`rounded-xl p-8 shadow-lg hover:shadow-xl border transition-all duration-200 ${
									darkMode
										? "bg-gradient-to-br from-gray-800 to-gray-750 border-gray-700"
										: "bg-gradient-to-br from-gray-50 to-white border-gray-200"
								}`}
							>
								<div
									className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
										darkMode
											? "bg-indigo-900 text-indigo-400"
											: "bg-indigo-100 text-indigo-600"
									}`}
								>
									<LucideIcons.Lock className="h-6 w-6" />
								</div>
								<h3
									className={`text-xl font-bold mb-3 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									End-to-End Encryption
								</h3>
								<p className={darkMode ? "text-gray-300" : "text-gray-600"}>
									Your messages are encrypted before they leave your device and
									can only be decrypted by the intended recipient.
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm font-semibold ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Military-grade AES-256 encryption
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Zero knowledge architecture
										</span>
									</li>
								</ul>
							</motion.div>

							{/* Feature 2 */}
							<motion.div
								whileHover={{
									y: -8,
									boxShadow:
										"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
								}}
								transition={{ duration: 0.2 }}
								className={`rounded-xl p-8 shadow-lg hover:shadow-xl border transition-all duration-200 ${
									darkMode
										? "bg-gradient-to-br from-gray-800 to-gray-750 border-gray-700"
										: "bg-gradient-to-br from-gray-50 to-white border-gray-200"
								}`}
							>
								<div
									className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
										darkMode
											? "bg-purple-900 text-purple-400"
											: "bg-purple-100 text-purple-600"
									}`}
								>
									<LucideIcons.Mail className="h-6 w-6" />
								</div>
								<h3
									className={`text-xl font-bold mb-3 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Use Your Existing Email
								</h3>
								<p className={darkMode ? "text-gray-300" : "text-gray-600"}>
									No need to create a new email address. Simply connect your
									Gmail, Outlook, or Yahoo account.
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Works with all major email providers
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Seamless integration
										</span>
									</li>
								</ul>
							</motion.div>

							{/* Feature 3 */}
							<motion.div
								whileHover={{
									y: -8,
									boxShadow:
										"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
								}}
								transition={{ duration: 0.2 }}
								className={`rounded-xl p-8 shadow-lg hover:shadow-xl border transition-all duration-200 ${
									darkMode
										? "bg-gradient-to-br from-gray-800 to-gray-750 border-gray-700"
										: "bg-gradient-to-br from-gray-50 to-white border-gray-200"
								}`}
							>
								<div
									className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
										darkMode
											? "bg-blue-900 text-blue-400"
											: "bg-blue-100 text-blue-600"
									}`}
								>
									<LucideIcons.KeyRound className="h-6 w-6" />
								</div>
								<h3
									className={`text-xl font-bold mb-3 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Two-Factor Authentication
								</h3>
								<p className={darkMode ? "text-gray-300" : "text-gray-600"}>
									Add an extra layer of security with 2FA to protect your
									encrypted emails from unauthorized access.
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Authenticator app support
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											SMS verification option
										</span>
									</li>
								</ul>
							</motion.div>

							{/* Feature 4 */}
							<motion.div
								whileHover={{
									y: -8,
									boxShadow:
										"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
								}}
								transition={{ duration: 0.2 }}
								className={`rounded-xl p-8 shadow-lg hover:shadow-xl border transition-all duration-200 ${
									darkMode
										? "bg-gradient-to-br from-gray-800 to-gray-750 border-gray-700"
										: "bg-gradient-to-br from-gray-50 to-white border-gray-200"
								}`}
							>
								<div
									className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
										darkMode
											? "bg-amber-900 text-amber-400"
											: "bg-amber-100 text-amber-600"
									}`}
								>
									<LucideIcons.Timer className="h-6 w-6" />
								</div>
								<h3
									className={`text-xl font-bold mb-3 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Self-Destructing Messages
								</h3>
								<p className={darkMode ? "text-gray-300" : "text-gray-600"}>
									Set your emails to expire after a specified time for enhanced
									privacy and data control.
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Customizable expiration times
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Complete data removal
										</span>
									</li>
								</ul>
							</motion.div>

							{/* Feature 5 */}
							<motion.div
								whileHover={{
									y: -8,
									boxShadow:
										"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
								}}
								transition={{ duration: 0.2 }}
								className={`rounded-xl p-8 shadow-lg hover:shadow-xl border transition-all duration-200 ${
									darkMode
										? "bg-gradient-to-br from-gray-800 to-gray-750 border-gray-700"
										: "bg-gradient-to-br from-gray-50 to-white border-gray-200"
								}`}
							>
								<div
									className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
										darkMode
											? "bg-green-900 text-green-400"
											: "bg-green-100 text-green-600"
									}`}
								>
									<LucideIcons.FileText className="h-6 w-6" />
								</div>
								<h3
									className={`text-xl font-bold mb-3 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Encrypted Attachments
								</h3>
								<p className={darkMode ? "text-gray-300" : "text-gray-600"}>
									Share files securely with end-to-end encrypted attachments
									that only the recipient can access.
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Large file support (up to 100MB)
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											All file types supported
										</span>
									</li>
								</ul>
							</motion.div>

							{/* Feature 6 */}
							<motion.div
								whileHover={{
									y: -8,
									boxShadow:
										"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
								}}
								transition={{ duration: 0.2 }}
								className={`rounded-xl p-8 shadow-lg hover:shadow-xl border transition-all duration-200 ${
									darkMode
										? "bg-gradient-to-br from-gray-800 to-gray-750 border-gray-700"
										: "bg-gradient-to-br from-gray-50 to-white border-gray-200"
								}`}
							>
								<div
									className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
										darkMode
											? "bg-pink-900 text-pink-400"
											: "bg-pink-100 text-pink-600"
									}`}
								>
									<LucideIcons.KeySquare className="h-6 w-6" />
								</div>
								<h3
									className={`text-xl font-bold mb-3 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Password Protected Emails
								</h3>
								<p className={darkMode ? "text-gray-300" : "text-gray-600"}>
									Send encrypted emails to anyone, even if they don't use our
									service, with password protection.
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Custom password hints
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Works with any email recipient
										</span>
									</li>
								</ul>
							</motion.div>
						</div>
					</div>

					{/* Feature callout */}
					<div className="mt-20">
						<div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
							<div className="px-6 py-12 sm:px-12 lg:px-16">
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
									<div>
										<h3 className="text-2xl font-bold text-white">
											Advanced Security Dashboard
										</h3>
										<p className="mt-4 text-indigo-100">
											Monitor your security status, manage encryption keys, and
											track email activity all from one intuitive dashboard.
										</p>
										<div className="mt-8">
											<Link
												to="/register"
												className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300"
											>
												<LucideIcons.ShieldCheck className="mr-2 h-5 w-5" />
												Try It Now
											</Link>
										</div>
									</div>
									<div className="relative">
										<div
											className={`rounded-lg shadow-xl overflow-hidden p-4 ${
												darkMode ? "bg-gray-800" : "bg-white"
											}`}
										>
											<div className="flex justify-between items-center mb-4">
												<h4
													className={`text-lg font-semibold ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Security Overview
												</h4>
												<span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
													Protected
												</span>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div
													className={`p-4 rounded-lg ${
														darkMode ? "bg-gray-750" : "bg-gray-50"
													}`}
												>
													<div className="flex items-center">
														<div
															className={`w-10 h-10 rounded-full flex items-center justify-center ${
																darkMode
																	? "bg-blue-900 text-blue-400"
																	: "bg-blue-100 text-blue-600"
															}`}
														>
															<LucideIcons.Key className="h-5 w-5" />
														</div>
														<div className="ml-3">
															<p
																className={`text-sm font-medium ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																Encryption Keys
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																3 active keys
															</p>
														</div>
													</div>
												</div>

												<div
													className={`p-4 rounded-lg ${
														darkMode ? "bg-gray-750" : "bg-gray-50"
													}`}
												>
													<div className="flex items-center">
														<div
															className={`w-10 h-10 rounded-full flex items-center justify-center ${
																darkMode
																	? "bg-green-900 text-green-400"
																	: "bg-green-100 text-green-600"
															}`}
														>
															<LucideIcons.ShieldCheck className="h-5 w-5" />
														</div>
														<div className="ml-3">
															<p
																className={`text-sm font-medium ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																Security Score
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																98/100 - Excellent
															</p>
														</div>
													</div>
												</div>

												<div
													className={`p-4 rounded-lg ${
														darkMode ? "bg-gray-750" : "bg-gray-50"
													}`}
												>
													<div className="flex items-center">
														<div
															className={`w-10 h-10 rounded-full flex items-center justify-center ${
																darkMode
																	? "bg-purple-900 text-purple-400"
																	: "bg-purple-100 text-purple-600"
															}`}
														>
															<LucideIcons.Mail className="h-5 w-5" />
														</div>
														<div className="ml-3">
															<p
																className={`text-sm font-medium ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																Encrypted Emails
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																142 sent this month
															</p>
														</div>
													</div>
												</div>

												<div
													className={`p-4 rounded-lg ${
														darkMode ? "bg-gray-750" : "bg-gray-50"
													}`}
												>
													<div className="flex items-center">
														<div
															className={`w-10 h-10 rounded-full flex items-center justify-center ${
																darkMode
																	? "bg-amber-900 text-amber-400"
																	: "bg-amber-100 text-amber-600"
															}`}
														>
															<LucideIcons.Clock className="h-5 w-5" />
														</div>
														<div className="ml-3">
															<p
																className={`text-sm font-medium ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																Expiring Messages
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																3 in next 24 hours
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* Decorative elements */}
										<div className="absolute -bottom-3 -right-3 w-16 h-16 bg-purple-300 rounded-full filter blur-xl opacity-70"></div>
										<div className="absolute -top-3 -left-3 w-16 h-16 bg-indigo-300 rounded-full filter blur-xl opacity-70"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section
				id="how-it-works"
				className={`py-16 sm:py-24 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<span
							className={`inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full ${
								darkMode
									? "text-indigo-400 bg-indigo-900 bg-opacity-50"
									: "text-indigo-600 bg-indigo-100"
							}`}
						>
							The Process
						</span>
						<h2
							className={`text-3xl font-extrabold sm:text-4xl ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							How Email Encryption Works
						</h2>
						<p
							className={`mt-4 max-w-2xl mx-auto text-xl ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							Understanding the basics of secure email communication.
						</p>
					</div>

					<div className="mt-16">
						<div className="relative">
							{/* The line connecting the steps for desktop */}
							<div className="hidden lg:block absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 transform -translate-x-1/2"></div>

							<div className="space-y-16 lg:space-y-28">
								{/* Step 1 */}
								<div className="relative">
									<div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
										<div className="mb-8 lg:mb-0 lg:pr-12 text-center lg:text-right order-2 lg:order-1">
											<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mb-4 lg:mb-0 lg:hidden">
												1
											</span>
											<h3
												className={`text-2xl font-bold mb-4 ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Register and Connect
											</h3>
											<p
												className={darkMode ? "text-gray-300" : "text-gray-600"}
											>
												Create an account and connect your existing email
												address. We'll generate your personal encryption keys to
												secure your communications.
											</p>
											<div
												className={`mt-6 rounded-lg p-4 shadow-md inline-block text-left ${
													darkMode ? "bg-gray-750" : "bg-white"
												}`}
											>
												<div className="flex items-start">
													<LucideIcons.Key
														className={`h-5 w-5 mt-0.5 mr-2 ${
															darkMode ? "text-indigo-400" : "text-indigo-600"
														}`}
													/>
													<div>
														<p
															className={`text-sm font-medium ${
																darkMode ? "text-white" : "text-gray-900"
															}`}
														>
															Your public key is shared with recipients
														</p>
														<p
															className={`text-xs mt-1 ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															They use this to encrypt messages only you can
															read
														</p>
													</div>
												</div>
											</div>
										</div>

										<div className="order-1 lg:order-2 relative">
											{/* The numbered circle for desktop */}
											<div className="hidden lg:flex absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl items-center justify-center shadow-lg">
												1
											</div>

											<div
												className={`rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border ${
													darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-white border-gray-200"
												}`}
											>
												<div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
												<div className="p-6">
													<div className="flex justify-between items-center mb-6">
														<div className="flex items-center">
															<LucideIcons.Shield
																className={`h-8 w-8 ${
																	darkMode
																		? "text-indigo-400"
																		: "text-indigo-600"
																}`}
															/>
															<span
																className={`ml-2 text-xl font-bold ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																SecureEmail
															</span>
														</div>
														<span
															className={`text-xs font-medium ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															STEP 1
														</span>
													</div>

													<div className="space-y-5">
														<div>
															<label
																className={`block text-sm font-medium mb-1 ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Full Name
															</label>
															<input
																type="text"
																className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																value="Sarah Johnson"
																readOnly
															/>
														</div>

														<div>
															<label
																className={`block text-sm font-medium mb-1 ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Email Address
															</label>
															<input
																type="email"
																className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																value="sarah@example.com"
																readOnly
															/>
														</div>

														<div className="pt-3">
															<button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center">
																<LucideIcons.Key className="mr-2 h-5 w-5" />
																Generate Encryption Keys
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Step 2 */}
								<div className="relative">
									<div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
										<div className="order-1 relative">
											{/* The numbered circle for desktop */}
											<div className="hidden lg:flex absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl items-center justify-center shadow-lg">
												2
											</div>

											<div
												className={`rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border ${
													darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-white border-gray-200"
												}`}
											>
												<div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
												<div className="p-6">
													<div className="flex justify-between items-center mb-6">
														<div className="flex items-center">
															<LucideIcons.PenTool
																className={`h-7 w-7 ${
																	darkMode
																		? "text-indigo-400"
																		: "text-indigo-600"
																}`}
															/>
															<span
																className={`ml-2 text-lg font-bold ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																New Encrypted Message
															</span>
														</div>
														<span
															className={`text-xs font-medium ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															STEP 2
														</span>
													</div>

													<div className="space-y-3">
														<div>
															<label
																className={`block text-sm font-medium mb-1 ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																To
															</label>
															<input
																type="text"
																className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																value="alex@company.com"
																readOnly
															/>
														</div>

														<div>
															<label
																className={`block text-sm font-medium mb-1 ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Subject
															</label>
															<input
																type="text"
																className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																value="Confidential Project Update"
																readOnly
															/>
														</div>

														<div>
															<label
																className={`block text-sm font-medium mb-1 ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Message
															</label>
															<div
																className={`w-full h-20 px-3 py-2 border rounded-md shadow-sm text-sm overflow-hidden ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
															>
																Here's the latest update on our confidential
																project. Please review the attached documents
																and let me know your thoughts.
															</div>
														</div>

														<div className="flex items-center pt-2">
															<div
																className={`flex items-center px-3 py-1 rounded-full ${
																	darkMode ? "bg-green-900" : "bg-green-100"
																}`}
															>
																<LucideIcons.Lock
																	className={`h-4 w-4 mr-1 ${
																		darkMode
																			? "text-green-400"
																			: "text-green-600"
																	}`}
																/>
																<span
																	className={`text-xs font-medium ${
																		darkMode
																			? "text-green-200"
																			: "text-green-800"
																	}`}
																>
																	End-to-End Encrypted
																</span>
															</div>
															<div className="ml-auto">
																<button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 text-sm flex items-center">
																	<LucideIcons.Send className="mr-1.5 h-4 w-4" />
																	Send Secure
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div className="mt-8 lg:mt-0 lg:pl-12 text-center lg:text-left order-2">
											<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mb-4 lg:mb-0 lg:hidden">
												2
											</span>
											<h3
												className={`text-2xl font-bold mb-4 ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Compose Encrypted Emails
											</h3>
											<p
												className={darkMode ? "text-gray-300" : "text-gray-600"}
											>
												Write your email as usual, with the added security of
												end-to-end encryption. Add attachments, set expiration
												times, and enhance security with passwords.
											</p>
											<div
												className={`mt-6 rounded-lg p-4 shadow-md inline-block text-left ${
													darkMode ? "bg-gray-750" : "bg-white"
												}`}
											>
												<div className="flex items-start">
													<LucideIcons.Lock
														className={`h-5 w-5 mt-0.5 mr-2 ${
															darkMode ? "text-green-400" : "text-green-600"
														}`}
													/>
													<div>
														<p
															className={`text-sm font-medium ${
																darkMode ? "text-white" : "text-gray-900"
															}`}
														>
															Your message is encrypted locally
														</p>
														<p
															className={`text-xs mt-1 ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															No one, not even SecureEmail, can read your
															messages
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Step 3 */}
								<div className="relative">
									<div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
										<div className="mb-8 lg:mb-0 lg:pr-12 text-center lg:text-right order-2 lg:order-1">
											<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mb-4 lg:mb-0 lg:hidden">
												3
											</span>
											<h3
												className={`text-2xl font-bold mb-4 ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Secure Delivery
											</h3>
											<p
												className={darkMode ? "text-gray-300" : "text-gray-600"}
											>
												Your message is encrypted and can only be decrypted by
												the intended recipient, even if they don't use
												SecureEmail.
											</p>
											<div
												className={`mt-6 rounded-lg p-4 shadow-md inline-block text-left ${
													darkMode ? "bg-gray-750" : "bg-white"
												}`}
											>
												<div className="flex items-start">
													<LucideIcons.Shield
														className={`h-5 w-5 mt-0.5 mr-2 ${
															darkMode ? "text-indigo-400" : "text-indigo-600"
														}`}
													/>
													<div>
														<p
															className={`text-sm font-medium ${
																darkMode ? "text-white" : "text-gray-900"
															}`}
														>
															Secure transit protection
														</p>
														<p
															className={`text-xs mt-1 ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															Your message remains encrypted during delivery
														</p>
													</div>
												</div>
											</div>
										</div>

										<div className="order-1 lg:order-2 relative">
											{/* The numbered circle for desktop */}
											<div className="hidden lg:flex absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl items-center justify-center shadow-lg">
												3
											</div>

											<div
												className={`rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border ${
													darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-white border-gray-200"
												}`}
											>
												<div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
												<div className="p-6">
													<div className="flex justify-between items-center mb-6">
														<span
															className={`text-xs font-medium ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															STEP 3
														</span>
														<div className="flex items-center space-x-1 text-amber-500">
															<LucideIcons.Star
																fill="currentColor"
																className="h-4 w-4"
															/>
															<LucideIcons.Star
																fill="currentColor"
																className="h-4 w-4"
															/>
															<LucideIcons.Star
																fill="currentColor"
																className="h-4 w-4"
															/>
															<LucideIcons.Star
																fill="currentColor"
																className="h-4 w-4"
															/>
															<LucideIcons.Star
																fill="currentColor"
																className="h-4 w-4"
															/>
														</div>
													</div>

													<div className="flex justify-center">
														<div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
															<div
																className={`w-16 h-16 rounded-full flex items-center justify-center ${
																	darkMode ? "bg-gray-800" : "bg-white"
																}`}
															>
																<LucideIcons.Lock
																	className={`h-8 w-8 ${
																		darkMode
																			? "text-indigo-400"
																			: "text-indigo-600"
																	}`}
																/>
															</div>
														</div>
													</div>

													<div className="text-center mt-6">
														<h4
															className={`text-lg font-bold mb-2 ${
																darkMode ? "text-white" : "text-gray-900"
															}`}
														>
															Secure Transmission
														</h4>
														<p
															className={`text-sm ${
																darkMode ? "text-gray-300" : "text-gray-600"
															}`}
														>
															Your message is being delivered with
															military-grade encryption
														</p>

														<div className="mt-4 flex flex-col items-center">
															<div
																className={`w-full h-2 rounded-full overflow-hidden ${
																	darkMode ? "bg-gray-700" : "bg-gray-200"
																}`}
															>
																<div className="h-full bg-green-500 rounded-full w-2/3 animate-progress"></div>
															</div>
															<p
																className={`text-xs mt-2 ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																Message secured and in transit
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Step 4 */}
								<div className="relative">
									<div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
										<div className="order-1 relative">
											{/* The numbered circle for desktop */}
											<div className="hidden lg:flex absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl items-center justify-center shadow-lg">
												4
											</div>

											<div
												className={`rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border ${
													darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-white border-gray-200"
												}`}
											>
												<div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
												<div className="p-6">
													<div className="flex justify-between items-center mb-6">
														<div className="flex items-center">
															<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
																<span className="text-lg font-bold text-indigo-600">
																	A
																</span>
															</div>
															<div className="ml-3">
																<p
																	className={`text-sm font-medium ${
																		darkMode ? "text-white" : "text-gray-900"
																	}`}
																>
																	Alex Chen
																</p>
																<p
																	className={`text-xs ${
																		darkMode ? "text-gray-400" : "text-gray-500"
																	}`}
																>
																	alex@company.com
																</p>
															</div>
														</div>
														<span
															className={`text-xs font-medium ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															STEP 4
														</span>
													</div>

													<div
														className={`rounded-lg p-4 mb-4 ${
															darkMode ? "bg-gray-800" : "bg-gray-50"
														}`}
													>
														<div className="flex items-center justify-between mb-3">
															<h4
																className={`text-base font-semibold ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																Confidential Project Update
															</h4>
															<span
																className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
																	darkMode
																		? "bg-green-900 text-green-200"
																		: "bg-green-100 text-green-800"
																}`}
															>
																<LucideIcons.Lock className="mr-1 h-3 w-3" />
																Decrypted
															</span>
														</div>
														<p
															className={`text-sm ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															Here's the latest update on our confidential
															project. Please review the attached documents and
															let me know your thoughts.
														</p>
														<div className="mt-3 flex items-center">
															<div
																className={`flex items-center px-3 py-1 rounded-md text-xs ${
																	darkMode
																		? "bg-gray-700 text-gray-300"
																		: "bg-gray-100 text-gray-700"
																}`}
															>
																<LucideIcons.FileText
																	className={`h-3.5 w-3.5 mr-1.5 ${
																		darkMode
																			? "text-indigo-400"
																			: "text-indigo-600"
																	}`}
																/>
																project-update.pdf (2.4 MB)
															</div>
														</div>
													</div>

													<div className="flex justify-between">
														<button
															type="button"
															className={`px-3 py-1.5 border text-sm font-medium rounded-md transition-colors duration-200 flex items-center ${
																darkMode
																	? "border-gray-600 text-gray-300 hover:bg-gray-700"
																	: "border-gray-300 text-gray-700 hover:bg-gray-50"
															}`}
														>
															<LucideIcons.Reply className="mr-1.5 h-4 w-4" />
															Reply
														</button>
														<button
															type="button"
															className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center"
														>
															<LucideIcons.Download className="mr-1.5 h-4 w-4" />
															Download
														</button>
													</div>
												</div>
											</div>
										</div>

										<div className="mt-8 lg:mt-0 lg:pl-12 text-center lg:text-left order-2">
											<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mb-4 lg:mb-0 lg:hidden">
												4
											</span>
											<h3
												className={`text-2xl font-bold mb-4 ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Secure Reading
											</h3>
											<p
												className={darkMode ? "text-gray-300" : "text-gray-600"}
											>
												Recipients can securely view and reply to your encrypted
												emails. They'll know exactly when messages will expire
												and can access password-protected files.
											</p>
											<div
												className={`mt-6 rounded-lg p-4 shadow-md inline-block text-left ${
													darkMode ? "bg-gray-750" : "bg-white"
												}`}
											>
												<div className="flex items-start">
													<LucideIcons.Eye
														className={`h-5 w-5 mt-0.5 mr-2 ${
															darkMode ? "text-indigo-400" : "text-indigo-600"
														}`}
													/>
													<div>
														<p
															className={`text-sm font-medium ${
																darkMode ? "text-white" : "text-gray-900"
															}`}
														>
															Read receipts (optional)
														</p>
														<p
															className={`text-xs mt-1 ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															Know exactly when your message is read
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Call to action within how it works */}
					<div className="mt-20 text-center">
						<div className="inline-block p-0.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
							<div
								className={`rounded-lg px-6 py-8 sm:px-10 sm:py-10 ${
									darkMode ? "bg-gray-800" : "bg-white"
								}`}
							>
								<h3
									className={`text-2xl font-bold mb-4 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Ready to secure your communications?
								</h3>
								<p
									className={`text-lg mb-8 ${
										darkMode ? "text-gray-300" : "text-gray-600"
									}`}
								>
									Join thousands of users who trust SecureEmail for their
									confidential communications.
								</p>
								<div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
									<Link
										to="/register"
										className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
									>
										<LucideIcons.UserPlus className="mr-2 h-5 w-5" />
										Create Free Account
									</Link>
									<button
										onClick={handleDemoLogin}
										className={`px-6 py-3 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center ${
											darkMode
												? "bg-gray-700 text-indigo-400"
												: "bg-white text-indigo-600"
										}`}
									>
										<LucideIcons.Play className="mr-2 h-5 w-5" />
										Try Instant Demo
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section
				id="pricing"
				className={`py-16 sm:py-24 ${darkMode ? "bg-gray-900" : "bg-white"}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<span
							className={`inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full ${
								darkMode
									? "text-indigo-400 bg-indigo-900 bg-opacity-50"
									: "text-indigo-600 bg-indigo-100"
							}`}
						>
							Pricing Plans
						</span>
						<h2
							className={`text-3xl font-extrabold sm:text-4xl ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Simple, Transparent Pricing
						</h2>
						<p
							className={`mt-4 max-w-2xl mx-auto text-xl ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							Choose the plan that fits your security needs. No hidden fees.
						</p>
					</div>

					<div className="mt-16 grid grid-cols-1 gap-y-6 sm:gap-y-0 sm:gap-x-6 lg:gap-x-8 md:grid-cols-3">
						{/* Free Plan */}
						<motion.div
							whileHover={{
								y: -8,
								boxShadow:
									"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
							}}
							transition={{ duration: 0.2 }}
							className={`rounded-2xl shadow-lg overflow-hidden border ${
								darkMode
									? "bg-gradient-to-br from-gray-800 to-gray-750 border-gray-700"
									: "bg-gradient-to-br from-gray-50 to-white border-gray-200"
							}`}
						>
							<div className="p-8">
								<div className="flex justify-between items-center">
									<h3
										className={`text-xl font-bold ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Free
									</h3>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											darkMode
												? "bg-blue-900 text-blue-200"
												: "bg-blue-100 text-blue-800"
										}`}
									>
										Personal
									</span>
								</div>
								<p
									className={`mt-4 text-sm ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Perfect for personal use and trying out our service.
								</p>
								<div className="mt-6 flex items-baseline">
									<span
										className={`text-5xl font-extrabold ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										$0
									</span>
									<span
										className={`ml-1 text-xl font-medium ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										/month
									</span>
								</div>
								<Link
									to="/register"
									className="mt-8 block w-full bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm py-3 px-4 text-sm font-medium text-white text-center transition-colors duration-200"
								>
									Sign Up Free
								</Link>
							</div>
							<div className="px-8 pb-8">
								<h4
									className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									What's included
								</h4>
								<ul className="space-y-4">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											End-to-end encrypted emails
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Connect 1 email account
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											500MB encrypted storage
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Basic encryption features
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Community support
										</span>
									</li>
								</ul>
							</div>
						</motion.div>

						{/* Pro Plan */}
						<motion.div
							whileHover={{
								y: -8,
								boxShadow:
									"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
							}}
							transition={{ duration: 0.2 }}
							className={`rounded-2xl shadow-xl overflow-hidden border-2 relative z-10 ${
								darkMode
									? "bg-gradient-to-br from-gray-800 to-gray-750 border-indigo-400"
									: "bg-gradient-to-br from-gray-50 to-white border-indigo-500"
							}`}
						>
							<div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
							<div className="absolute -top-5 inset-x-0 flex justify-center">
								<span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
									MOST POPULAR
								</span>
							</div>
							<div className="p-8 pt-10">
								<div className="flex justify-between items-center">
									<h3
										className={`text-xl font-bold ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Pro
									</h3>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											darkMode
												? "bg-indigo-900 text-indigo-200"
												: "bg-indigo-100 text-indigo-800"
										}`}
									>
										Individual
									</span>
								</div>
								<p
									className={`mt-4 text-sm ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Enhanced features for individuals with advanced security
									needs.
								</p>
								<div className="mt-6 flex items-baseline">
									<span
										className={`text-5xl font-extrabold ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										$4.99
									</span>
									<span
										className={`ml-1 text-xl font-medium ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										/month
									</span>
								</div>
								<Link
									to="/register"
									className="mt-8 block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border border-transparent rounded-md shadow-sm py-3 px-4 text-sm font-medium text-white text-center transition-colors duration-200"
								>
									Try Pro Free for 14 Days
								</Link>
							</div>
							<div className="px-8 pb-8">
								<h4
									className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									What's included
								</h4>
								<ul className="space-y-4">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											All Free features
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Connect up to 5 email accounts
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											5GB encrypted storage
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Self-destructing emails
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Advanced encryption options
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Priority support
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Custom security dashboard
										</span>
									</li>
								</ul>
							</div>
						</motion.div>

						{/* Business Plan */}
						<motion.div
							whileHover={{
								y: -8,
								boxShadow:
									"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
							}}
							transition={{ duration: 0.2 }}
							className={`rounded-2xl shadow-lg overflow-hidden border ${
								darkMode
									? "bg-gradient-to-br from-gray-800 to-gray-750 border-gray-700"
									: "bg-gradient-to-br from-gray-50 to-white border-gray-200"
							}`}
						>
							<div className="p-8">
								<div className="flex justify-between items-center">
									<h3
										className={`text-xl font-bold ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Business
									</h3>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											darkMode
												? "bg-purple-900 text-purple-200"
												: "bg-purple-100 text-purple-800"
										}`}
									>
										Team
									</span>
								</div>
								<p
									className={`mt-4 text-sm ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									For teams and businesses with stringent security requirements.
								</p>
								<div className="mt-6 flex items-baseline">
									<span
										className={`text-5xl font-extrabold ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										$9.99
									</span>
									<span
										className={`ml-1 text-xl font-medium ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										/user/month
									</span>
								</div>
								<Link
									to="/register"
									className="mt-8 block w-full bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm py-3 px-4 text-sm font-medium text-white text-center transition-colors duration-200"
								>
									Contact Sales
								</Link>
							</div>
							<div className="px-8 pb-8">
								<h4
									className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									What's included
								</h4>
								<ul className="space-y-4">
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											All Pro features
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Connect unlimited email accounts
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											20GB storage per user
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Admin control panel
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											HIPAA & GDPR compliance
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Team management features
										</span>
									</li>
									<li className="flex items-start">
										<LucideIcons.CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
										<span
											className={`text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											24/7 dedicated support
										</span>
									</li>
								</ul>
							</div>
						</motion.div>
					</div>

					{/* FAQ Section */}
					<div className="mt-20">
						<div className="text-center mb-12">
							<h3
								className={`text-2xl font-bold ${
									darkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Frequently Asked Questions
							</h3>
							<p
								className={`mt-4 ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Have questions? We've got answers.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{[
								{
									question: "How secure is SecureEmail?",
									answer:
										"SecureEmail uses AES-256 bit encryption, the same standard used by banks and governments worldwide. Your messages are end-to-end encrypted, meaning only you and your recipient can read them.",
								},
								{
									question: "Can I use SecureEmail with my existing email?",
									answer:
										"Yes! SecureEmail works with all major email providers including Gmail, Outlook, Yahoo, and more. There's no need to create a new email address.",
								},
								{
									question:
										"What happens if the recipient doesn't use SecureEmail?",
									answer:
										"Recipients who don't use SecureEmail will receive a secure link to view your encrypted message. You can also add password protection for additional security.",
								},
								{
									question: "Is there a limit to file attachments?",
									answer:
										"Free accounts can send encrypted attachments up to 25MB. Pro accounts can send up to 100MB, and Business accounts have a 1GB attachment limit.",
								},
							].map((faq, index) => (
								<div
									key={index}
									className={`rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200 ${
										darkMode ? "bg-gray-800" : "bg-white"
									}`}
								>
									<h4
										className={`text-lg font-semibold mb-3 ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										{faq.question}
									</h4>
									<p className={darkMode ? "text-gray-300" : "text-gray-600"}>
										{faq.answer}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-16 sm:py-20">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
				<div className="absolute right-0 top-0 -mr-40 -mt-40 w-80 h-80 rounded-full bg-purple-400 filter blur-3xl opacity-30"></div>
				<div className="absolute left-0 bottom-0 -ml-40 -mb-40 w-80 h-80 rounded-full bg-indigo-400 filter blur-3xl opacity-30"></div>

				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
					<h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
						<span className="block">Ready to secure your emails?</span>
						<span className="block text-indigo-200">
							Start encrypting your communications today.
						</span>
					</h2>
					<div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 lg:ml-8 space-x-4">
						<div className="inline-flex rounded-md shadow">
							<Link
								to="/register"
								className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition-colors duration-200"
							>
								<LucideIcons.UserPlus className="mr-2 h-5 w-5" />
								Get started
							</Link>
						</div>
						<div className="inline-flex rounded-md shadow">
							<a
								href="#how-it-works"
								className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 bg-opacity-60 hover:bg-opacity-70 transition-colors duration-200"
							>
								<LucideIcons.Info className="mr-2 h-5 w-5" />
								Learn more
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className={darkMode ? "bg-gray-900" : "bg-white"}>
				<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="col-span-1 md:col-span-2">
							<div className="flex items-center">
								<div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
									<LucideIcons.Shield className="h-6 w-6" />
								</div>
								<span
									className={`ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
										darkMode
											? "from-indigo-400 to-purple-400"
											: "from-indigo-600 to-purple-600"
									}`}
								>
									SecureEmail
								</span>
							</div>
							<p
								className={`mt-4 max-w-md ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Secure your email communications with military-grade encryption.
								Protect your privacy and stay compliant with data protection
								regulations without changing your email address.
							</p>
							<div className="mt-6 flex space-x-6">
								<a
									href="#"
									className={`transition-colors duration-200 ${
										darkMode
											? "text-gray-400 hover:text-indigo-400"
											: "text-gray-400 hover:text-indigo-600"
									}`}
									aria-label="Twitter"
								>
									<LucideIcons.Twitter className="h-6 w-6" />
								</a>
								<a
									href="#"
									className={`transition-colors duration-200 ${
										darkMode
											? "text-gray-400 hover:text-indigo-400"
											: "text-gray-400 hover:text-indigo-600"
									}`}
									aria-label="LinkedIn"
								>
									<LucideIcons.Linkedin className="h-6 w-6" />
								</a>
								<a
									href="#"
									className={`transition-colors duration-200 ${
										darkMode
											? "text-gray-400 hover:text-indigo-400"
											: "text-gray-400 hover:text-indigo-600"
									}`}
									aria-label="GitHub"
								>
									<LucideIcons.Github className="h-6 w-6" />
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
								Product
							</h3>
							<ul className="mt-4 space-y-4">
								<li>
									<a
										href="#"
										className={`text-base transition-colors duration-200 ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="#how-it-works"
										className={`text-base transition-colors duration-200 ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										How It Works
									</a>
								</li>
								<li>
									<a
										href="#pricing"
										className={`text-base transition-colors duration-200 ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										Pricing
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-base transition-colors duration-200 ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										Roadmap
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
								Support
							</h3>
							<ul className="mt-4 space-y-4">
								<li>
									<a
										href="#"
										className={`text-base transition-colors duration-200 ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-base transition-colors duration-200 ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										Contact Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-base transition-colors duration-200 ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-base transition-colors duration-200 ${
											darkMode
												? "text-gray-400 hover:text-indigo-400"
												: "text-gray-500 hover:text-indigo-600"
										}`}
									>
										Terms of Service
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div
						className={`mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center ${
							darkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<p className="text-base text-gray-400 text-center sm:text-left">
							&copy; {new Date().getFullYear()} SecureEmail. All rights
							reserved.
						</p>
						<div className="mt-4 sm:mt-0">
							<button
								onClick={toggleDarkMode}
								className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
									darkMode
										? "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
										: "text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
								}`}
								aria-label="Toggle dark mode"
							>
								{darkMode ? (
									<LucideIcons.Sun className="h-5 w-5" />
								) : (
									<LucideIcons.Moon className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

// Enhanced Login Component
function Login({
	onLogin,
	darkMode,
}: {
	onLogin: (user: User) => void;
	darkMode: boolean;
}) {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showSocialModal, setShowSocialModal] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState<
		"google" | "facebook" | null
	>(null);
	const [socialStep, setSocialStep] = useState(0);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	// Spring animation for form
	const formAnimation = useSpring({
		from: { opacity: 0, transform: "translateY(30px)" },
		to: { opacity: 1, transform: "translateY(0)" },
		config: { tension: 280, friction: 25 },
	});

	// Background particles animation
	const particlesAnimation = useSpring({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: { duration: 2000 },
	});

	const createDemoUser = (provider: string, email: string, name: string) => {
		return {
			id: `${provider}-${Date.now()}`,
			name: name,
			email: email,
			password: "",
			twoFactorEnabled: false,
			encryptionKeys: [
				{
					id: "default-key",
					name: "Default Key",
					publicKey: "demo-public-key",
					privateKey: "demo-private-key",
					fingerprint: "AB:CD:EF:12:34:56",
					createdAt: new Date(),
					isActive: true,
				},
			],
			connectedAccounts: [
				{
					id: `${provider}-account`,
					provider: provider,
					email: email,
					connected: true,
				},
			],
			profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
				name
			)}&background=6366f1&color=fff`,
		};
	};

	const handleSocialLogin = async (provider: "google" | "facebook") => {
		setSelectedProvider(provider);
		setShowSocialModal(true);
		setSocialStep(0);
		setError("");

		// Simulate OAuth flow steps
		const steps = [
			"Redirecting to " + (provider === "google" ? "Google" : "Facebook"),
			"Authenticating with " + (provider === "google" ? "Google" : "Facebook"),
			"Verifying permissions",
			"Creating secure session",
		];

		for (let i = 0; i < steps.length; i++) {
			setTimeout(() => {
				setSocialStep(i);
			}, i * 800);
		}

		// Complete the flow
		setTimeout(() => {
			const demoUsers = {
				google: {
					email: "demo.user@gmail.com",
					name: "Demo User",
				},
				facebook: {
					email: "demo.user@facebook.com",
					name: "Demo User",
				},
			};

			const userData = demoUsers[provider];
			const user = createDemoUser(provider, userData.email, userData.name);

			toast.success(
				`Successfully signed in with ${
					provider.charAt(0).toUpperCase() + provider.slice(1)
				}!`
			);
			setShowSocialModal(false);
			onLogin(user);
			navigate("/dashboard");
		}, 3500);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		// Validate inputs
		if (!email) {
			setError("Email is required");
			setIsLoading(false);
			return;
		}

		if (!password) {
			setError("Password is required");
			setIsLoading(false);
			return;
		}

		// Simulate login API call
		setTimeout(() => {
			// For demo, just check if email and password are entered
			if (email && password) {
				const user: User = {
					id: "demo-user",
					name: email.split("@")[0],
					email: email,
					password: password,
					twoFactorEnabled: false,
					encryptionKeys: [
						{
							id: "default-key",
							name: "Default Key",
							publicKey: "demo-public-key",
							privateKey: "demo-private-key",
							fingerprint: "AB:CD:EF:12:34:56",
							createdAt: new Date(),
							isActive: true,
						},
					],
					connectedAccounts: [
						{
							id: "gmail-account",
							provider: "gmail",
							email: email,
							connected: true,
						},
					],
					profileImage: `https://ui-avatars.com/api/?name=${
						email.split("@")[0]
					}&background=6366f1&color=fff`,
				};

				toast.success("Login successful!");
				onLogin(user);
				navigate("/dashboard");
			} else {
				setError("Please enter both email and password.");
			}
			setIsLoading(false);
		}, 1500);
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
				darkMode ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			{/* Background Effects */}
			<animated.div
				style={particlesAnimation}
				className="absolute inset-0 overflow-hidden pointer-events-none"
			>
				{/* Floating orbs */}
				<div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

				{/* Animated particles */}
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className="absolute w-2 h-2 bg-indigo-400/30 rounded-full animate-ping"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animationDuration: `${2 + Math.random() * 2}s`,
						}}
					></div>
				))}
			</animated.div>

			{/* Back button */}
			<div className="absolute top-5 left-5 z-10">
				<Link
					to="/"
					className={`flex items-center transition-all duration-300 px-4 py-2 rounded-lg backdrop-blur-sm ${
						darkMode
							? "text-gray-400 hover:text-indigo-400 bg-gray-800/50 hover:bg-gray-700/50"
							: "text-gray-500 hover:text-indigo-600 bg-white/50 hover:bg-white/70"
					}`}
				>
					<LucideIcons.ArrowLeft className="h-5 w-5 mr-2" />
					<span>Back to Home</span>
				</Link>
			</div>

			<animated.div
				style={formAnimation}
				className={`max-w-md w-full space-y-8 p-10 rounded-2xl shadow-2xl backdrop-blur-sm border relative z-10 ${
					darkMode
						? "bg-gray-800/80 border-gray-700/50"
						: "bg-white/80 border-gray-200/50"
				}`}
			>
				{/* Header */}
				<div className="text-center">
					<div className="flex justify-center mb-6">
						<div className="relative">
							<div className="h-16 w-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
								<LucideIcons.Shield className="h-8 w-8" />
							</div>
							<div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
						</div>
					</div>
					<h2
						className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}
					>
						Welcome Back
					</h2>
					<p
						className={`mt-3 text-sm ${
							darkMode ? "text-gray-400" : "text-gray-600"
						}`}
					>
						Sign in to your SecureEmail account or{" "}
						<Link
							to="/register"
							className={`font-medium transition-colors duration-200 ${
								darkMode
									? "text-indigo-400 hover:text-indigo-300"
									: "text-indigo-600 hover:text-indigo-500"
							}`}
						>
							create a new account
						</Link>
					</p>
				</div>

				{/* Social Login Buttons */}
				<div className="space-y-3">
					<button
						type="button"
						onClick={() => handleSocialLogin("google")}
						disabled={showSocialModal}
						className={`relative w-full flex items-center justify-center py-3 px-4 border rounded-xl shadow-sm text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] ${
							darkMode
								? "border-gray-600 text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 hover:border-gray-500"
								: "border-gray-300 text-gray-700 bg-white/50 hover:bg-white/70 hover:border-gray-400"
						} ${showSocialModal ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						<svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Continue with Google
					</button>

					<button
						type="button"
						onClick={() => handleSocialLogin("facebook")}
						disabled={showSocialModal}
						className={`relative w-full flex items-center justify-center py-3 px-4 border rounded-xl shadow-sm text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] ${
							darkMode
								? "border-gray-600 text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 hover:border-gray-500"
								: "border-gray-300 text-gray-700 bg-white/50 hover:bg-white/70 hover:border-gray-400"
						} ${showSocialModal ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						<svg className="h-5 w-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
							<path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
						</svg>
						Continue with Facebook
					</button>
				</div>

				{/* Divider */}
				<div className="flex items-center justify-center">
					<div
						className={`flex-grow border-t ${
							darkMode ? "border-gray-600" : "border-gray-300"
						}`}
					></div>
					<span
						className={`flex-shrink mx-4 text-sm font-medium ${
							darkMode ? "text-gray-400" : "text-gray-500"
						}`}
					>
						or continue with email
					</span>
					<div
						className={`flex-grow border-t ${
							darkMode ? "border-gray-600" : "border-gray-300"
						}`}
					></div>
				</div>

				{/* Email/Password Form */}
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-5">
						<div>
							<label
								htmlFor="email-address"
								className={`block text-sm font-medium mb-2 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Email address
							</label>
							<div className="relative group">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<LucideIcons.Mail
										className={`h-5 w-5 transition-colors ${
											email ? "text-indigo-500" : "text-gray-400"
										}`}
									/>
								</div>
								<input
									id="email-address"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 sm:text-sm ${
										darkMode
											? "border-gray-600 bg-gray-700/50 text-white focus:bg-gray-700"
											: "border-gray-300 bg-white/50 text-gray-900 focus:bg-white"
									}`}
									placeholder="you@example.com"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className={`block text-sm font-medium mb-2 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Password
							</label>
							<div className="relative group">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<LucideIcons.KeyRound
										className={`h-5 w-5 transition-colors ${
											password ? "text-indigo-500" : "text-gray-400"
										}`}
									/>
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className={`appearance-none block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 sm:text-sm ${
										darkMode
											? "border-gray-600 bg-gray-700/50 text-white focus:bg-gray-700"
											: "border-gray-300 bg-white/50 text-gray-900 focus:bg-white"
									}`}
									placeholder="••••••••"
								/>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
									>
										{showPassword ? (
											<LucideIcons.EyeOff className="h-5 w-5" />
										) : (
											<LucideIcons.Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Error Display */}
					{error && (
						<div
							className={`rounded-xl p-4 border ${
								darkMode
									? "bg-red-900/20 border-red-800/50"
									: "bg-red-50 border-red-200"
							}`}
						>
							<div className="flex">
								<div className="flex-shrink-0">
									<LucideIcons.AlertCircle className="h-5 w-5 text-red-400" />
								</div>
								<div className="ml-3">
									<h3
										className={`text-sm font-medium ${
											darkMode ? "text-red-200" : "text-red-800"
										}`}
									>
										{error}
									</h3>
								</div>
							</div>
						</div>
					)}

					{/* Remember Me & Forgot Password */}
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
							/>
							<label
								htmlFor="remember-me"
								className={`ml-2 block text-sm ${
									darkMode ? "text-gray-300" : "text-gray-900"
								}`}
							>
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<a
								href="#"
								className={`font-medium transition-colors duration-200 hover:underline ${
									darkMode
										? "text-indigo-400 hover:text-indigo-300"
										: "text-indigo-600 hover:text-indigo-500"
								}`}
							>
								Forgot password?
							</a>
						</div>
					</div>

					{/* Submit Button */}
					<div>
						<button
							type="submit"
							disabled={isLoading || showSocialModal}
							className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
								isLoading || showSocialModal
									? "opacity-70 cursor-not-allowed"
									: ""
							}`}
						>
							{isLoading ? (
								<div className="flex items-center">
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Signing in...
								</div>
							) : (
								<div className="flex items-center">
									<LucideIcons.LogIn className="mr-2 h-5 w-5" />
									Sign in to SecureEmail
								</div>
							)}
						</button>
					</div>
				</form>

				{/* Social Login Modal */}
				{showSocialModal && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div
							className={`relative max-w-md w-full rounded-2xl shadow-2xl border p-8 ${
								darkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white border-gray-200"
							}`}
						>
							{/* Close button */}
							<button
								onClick={() => setShowSocialModal(false)}
								className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
							>
								<LucideIcons.X className="h-5 w-5" />
							</button>

							{/* Modal content */}
							<div className="text-center">
								{/* Provider icon */}
								<div className="flex justify-center mb-6">
									<div
										className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${
											selectedProvider === "google"
												? "bg-gradient-to-br from-blue-500 to-red-500"
												: "bg-gradient-to-br from-blue-600 to-blue-700"
										}`}
									>
										{selectedProvider === "google" ? (
											<svg className="h-8 w-8" viewBox="0 0 24 24">
												<path
													d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
													fill="white"
												/>
												<path
													d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													fill="white"
												/>
												<path
													d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
													fill="white"
												/>
												<path
													d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
													fill="white"
												/>
											</svg>
										) : (
											<svg className="h-8 w-8" fill="white" viewBox="0 0 24 24">
												<path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
											</svg>
										)}
									</div>
								</div>

								{/* Title */}
								<h3
									className={`text-xl font-bold mb-2 ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									{selectedProvider === "google"
										? "Connecting to Google"
										: "Connecting to Facebook"}
								</h3>

								<p
									className={`text-sm mb-6 ${
										darkMode ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Please wait while we securely authenticate your account
								</p>

								{/* Progress steps */}
								<div className="space-y-4">
									{[
										`Redirecting to ${
											selectedProvider === "google" ? "Google" : "Facebook"
										}`,
										`Authenticating with ${
											selectedProvider === "google" ? "Google" : "Facebook"
										}`,
										"Verifying permissions",
										"Creating secure session",
									].map((step, index) => (
										<div key={index} className="flex items-center space-x-3">
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center ${
													index <= socialStep
														? "bg-green-500 text-white"
														: index === socialStep + 1
														? "bg-indigo-500 text-white animate-pulse"
														: darkMode
														? "bg-gray-700 text-gray-400"
														: "bg-gray-200 text-gray-500"
												}`}
											>
												{index < socialStep ? (
													<LucideIcons.Check className="h-4 w-4" />
												) : index === socialStep ? (
													<div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
												) : (
													<span className="text-sm font-medium">
														{index + 1}
													</span>
												)}
											</div>
											<span
												className={`text-sm ${
													index <= socialStep
														? darkMode
															? "text-green-400"
															: "text-green-600"
														: index === socialStep
														? darkMode
															? "text-indigo-400"
															: "text-indigo-600"
														: darkMode
														? "text-gray-500"
														: "text-gray-400"
												}`}
											>
												{step}
											</span>
										</div>
									))}
								</div>

								{/* Loading bar */}
								<div
									className={`mt-6 w-full bg-gray-200 rounded-full h-2 ${
										darkMode ? "bg-gray-700" : "bg-gray-200"
									}`}
								>
									<div
										className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700"
										style={{ width: `${((socialStep + 1) / 4) * 100}%` }}
									></div>
								</div>
							</div>
						</div>
					</div>
				)}
			</animated.div>
		</div>
	);
}

// Enhanced Register Component
function Register({
	onLogin,
	darkMode,
}: {
	onLogin: (user: User) => void;
	darkMode: boolean;
}) {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Spring animation for form
	const formAnimation = useSpring({
		from: { opacity: 0, transform: "translateY(20px)" },
		to: { opacity: 1, transform: "translateY(0)" },
		config: { tension: 300, friction: 20 },
	});

	// Handle form changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});

		// Clear errors for this field
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	// Password strength checker
	const checkPasswordStrength = (password: string): number => {
		let strength = 0;

		if (password.length >= 8) strength += 1;
		if (/[A-Z]/.test(password)) strength += 1;
		if (/[a-z]/.test(password)) strength += 1;
		if (/[0-9]/.test(password)) strength += 1;
		if (/[^A-Za-z0-9]/.test(password)) strength += 1;

		return strength;
	};

	const getPasswordStrengthLabel = (strength: number): string => {
		if (strength === 0) return "Very Weak";
		if (strength === 1) return "Weak";
		if (strength === 2) return "Fair";
		if (strength === 3) return "Good";
		if (strength === 4) return "Strong";
		return "Very Strong";
	};

	const getPasswordStrengthColor = (strength: number): string => {
		if (strength === 0) return "bg-red-500";
		if (strength === 1) return "bg-red-400";
		if (strength === 2) return "bg-yellow-500";
		if (strength === 3) return "bg-yellow-400";
		if (strength === 4) return "bg-green-500";
		return "bg-green-400";
	};

	// Validate form data
	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		} else if (checkPasswordStrength(formData.password) < 3) {
			newErrors.password = "Password is too weak";
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (!formData.agreeToTerms) {
			newErrors.agreeToTerms = "You must agree to the terms and conditions";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			setIsLoading(true);

			// Simulate API call
			setTimeout(() => {
				// Create a user object
				const user: User = {
					id: `user-${Date.now()}`,
					name: formData.name,
					email: formData.email,
					password: formData.password,
					twoFactorEnabled: false,
					encryptionKeys: [
						{
							id: "default-key",
							name: "Default Key",
							publicKey: "generated-public-key",
							privateKey: "generated-private-key",
							fingerprint: "AB:CD:EF:12:34:56",
							createdAt: new Date(),
							isActive: true,
						},
					],
					connectedAccounts: [],
					profileImage: `https://ui-avatars.com/api/?name=${formData.name.replace(
						" ",
						"+"
					)}&background=6366f1&color=fff`,
				};

				toast.success("Account created successfully!");
				onLogin(user);
				setIsLoading(false);
				setStep(2);
			}, 1500);
		}
	};

	// Handle email connection
	const handleConnectEmail = (
		provider: "gmail" | "outlook" | "yahoo" | "other"
	) => {
		setIsLoading(true);

		// Show provider-specific message
		const providerNames = {
			gmail: "Google",
			outlook: "Microsoft",
			yahoo: "Yahoo",
			other: "email provider",
		};

		toast.loading(`Connecting to ${providerNames[provider]}...`);

		// Simulate connection
		setTimeout(() => {
			toast.dismiss();
			toast.success(`Connected to ${providerNames[provider]} successfully!`);
			setIsLoading(false);
			navigate("/security-setup");
		}, 1500);
	};

	const passwordStrength = checkPasswordStrength(formData.password);

	return (
		<div
			className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
				darkMode ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			<div className="absolute top-5 left-5">
				<Link
					to="/"
					className={`flex items-center transition-colors duration-200 ${
						darkMode
							? "text-gray-400 hover:text-indigo-400"
							: "text-gray-500 hover:text-indigo-600"
					}`}
				>
					<LucideIcons.ArrowLeft className="h-5 w-5 mr-1" />
					<span>Back to Home</span>
				</Link>
			</div>

			<animated.div
				style={formAnimation}
				className={`max-w-md w-full space-y-8 p-10 rounded-xl shadow-xl ${
					darkMode ? "bg-gray-800" : "bg-white"
				}`}
			>
				{step === 1 ? (
					/* Step 1: Account Creation */
					<>
						<div>
							<div className="flex justify-center">
								<div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
									<LucideIcons.UserPlus className="h-8 w-8" />
								</div>
							</div>
							<h2
								className={`mt-6 text-center text-3xl font-extrabold ${
									darkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Create your account
							</h2>
							<p
								className={`mt-2 text-center text-sm ${
									darkMode ? "text-gray-400" : "text-gray-600"
								}`}
							>
								Already have an account?{" "}
								<Link
									to="/login"
									className={`font-medium transition-colors duration-200 ${
										darkMode
											? "text-indigo-400 hover:text-indigo-300"
											: "text-indigo-600 hover:text-indigo-500"
									}`}
								>
									Sign in
								</Link>
							</p>
						</div>

						<div className="flex justify-center space-x-4">
							<button
								type="button"
								className={`flex items-center justify-center py-2.5 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
									darkMode
										? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
										: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
								}`}
							>
								<svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									/>
								</svg>
								Google
							</button>
							<button
								type="button"
								className={`flex items-center justify-center py-2.5 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
									darkMode
										? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
										: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
								}`}
							>
								<svg
									className="h-5 w-5 mr-2"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
								</svg>
								Facebook
							</button>
						</div>

						<div className="flex items-center justify-center">
							<div
								className={`flex-grow border-t ${
									darkMode ? "border-gray-600" : "border-gray-300"
								}`}
							></div>
							<span
								className={`flex-shrink mx-4 text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								or with email
							</span>
							<div
								className={`flex-grow border-t ${
									darkMode ? "border-gray-600" : "border-gray-300"
								}`}
							></div>
						</div>

						<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
							<div className="rounded-md -space-y-px">
								<div className="mb-5">
									<label
										htmlFor="name"
										className={`block text-sm font-medium mb-1 ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Full name
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<LucideIcons.User className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="name"
											name="name"
											type="text"
											autoComplete="name"
											required
											value={formData.name}
											onChange={handleChange}
											className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
												darkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 bg-white text-gray-900"
											}`}
											placeholder="John Smith"
										/>
									</div>
									{errors.name && (
										<p
											className={`mt-1 text-sm ${
												darkMode ? "text-red-400" : "text-red-600"
											}`}
										>
											{errors.name}
										</p>
									)}
								</div>

								<div className="mb-5">
									<label
										htmlFor="email-address"
										className={`block text-sm font-medium mb-1 ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Email address
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<LucideIcons.Mail className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="email-address"
											name="email"
											type="email"
											autoComplete="email"
											required
											value={formData.email}
											onChange={handleChange}
											className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
												darkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 bg-white text-gray-900"
											}`}
											placeholder="you@example.com"
										/>
									</div>
									{errors.email && (
										<p
											className={`mt-1 text-sm ${
												darkMode ? "text-red-400" : "text-red-600"
											}`}
										>
											{errors.email}
										</p>
									)}
								</div>

								<div className="mb-5">
									<label
										htmlFor="password"
										className={`block text-sm font-medium mb-1 ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<LucideIcons.KeyRound className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="password"
											name="password"
											type={showPassword ? "text" : "password"}
											autoComplete="new-password"
											required
											value={formData.password}
											onChange={handleChange}
											className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
												darkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 bg-white text-gray-900"
											}`}
											placeholder="••••••••"
										/>
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="text-gray-400 hover:text-gray-500 focus:outline-none"
											>
												{showPassword ? (
													<LucideIcons.EyeOff className="h-5 w-5" />
												) : (
													<LucideIcons.Eye className="h-5 w-5" />
												)}
											</button>
										</div>
									</div>

									{/* Password strength indicator */}
									{formData.password && (
										<div className="mt-2">
											<div className="flex items-center justify-between mb-1">
												<div
													className={`text-xs font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Password strength:{" "}
													{getPasswordStrengthLabel(passwordStrength)}
												</div>
												<div
													className={`text-xs font-medium ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													{passwordStrength}/5
												</div>
											</div>
											<div
												className={`w-full h-2 rounded-full overflow-hidden ${
													darkMode ? "bg-gray-700" : "bg-gray-200"
												}`}
											>
												<div
													className={`h-full ${getPasswordStrengthColor(
														passwordStrength
													)} rounded-full`}
													style={{ width: `${(passwordStrength / 5) * 100}%` }}
												></div>
											</div>
										</div>
									)}

									{errors.password && (
										<p
											className={`mt-1 text-sm ${
												darkMode ? "text-red-400" : "text-red-600"
											}`}
										>
											{errors.password}
										</p>
									)}
								</div>

								<div className="mb-5">
									<label
										htmlFor="confirm-password"
										className={`block text-sm font-medium mb-1 ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Confirm Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<LucideIcons.KeyRound className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="confirm-password"
											name="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											autoComplete="new-password"
											required
											value={formData.confirmPassword}
											onChange={handleChange}
											className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
												darkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 bg-white text-gray-900"
											}`}
											placeholder="••••••••"
										/>
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
											<button
												type="button"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
												className="text-gray-400 hover:text-gray-500 focus:outline-none"
											>
												{showConfirmPassword ? (
													<LucideIcons.EyeOff className="h-5 w-5" />
												) : (
													<LucideIcons.Eye className="h-5 w-5" />
												)}
											</button>
										</div>
									</div>
									{errors.confirmPassword && (
										<p
											className={`mt-1 text-sm ${
												darkMode ? "text-red-400" : "text-red-600"
											}`}
										>
											{errors.confirmPassword}
										</p>
									)}
								</div>
							</div>

							<div className="flex items-center">
								<input
									id="agree-terms"
									name="agreeToTerms"
									type="checkbox"
									checked={formData.agreeToTerms}
									onChange={handleChange}
									className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded ${
										darkMode ? "border-gray-700" : "border-gray-300"
									}`}
								/>
								<label
									htmlFor="agree-terms"
									className={`ml-2 block text-sm ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									I agree to the{" "}
									<a
										href="#"
										className={`font-medium transition-colors duration-200 ${
											darkMode
												? "text-indigo-400 hover:text-indigo-300"
												: "text-indigo-600 hover:text-indigo-500"
										}`}
									>
										Terms of Service
									</a>{" "}
									and{" "}
									<a
										href="#"
										className={`font-medium transition-colors duration-200 ${
											darkMode
												? "text-indigo-400 hover:text-indigo-300"
												: "text-indigo-600 hover:text-indigo-500"
										}`}
									>
										Privacy Policy
									</a>
								</label>
							</div>
							{errors.agreeToTerms && (
								<p
									className={`text-sm ${
										darkMode ? "text-red-400" : "text-red-600"
									}`}
								>
									{errors.agreeToTerms}
								</p>
							)}

							<div>
								<button
									type="submit"
									disabled={isLoading}
									className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
										isLoading ? "opacity-70 cursor-not-allowed" : ""
									}`}
								>
									{isLoading ? (
										<div className="flex items-center">
											<svg
												className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Creating Account...
										</div>
									) : (
										<div className="flex items-center">
											<LucideIcons.UserPlus className="mr-2 h-5 w-5" />
											Create Account
										</div>
									)}
								</button>
							</div>
						</form>
					</>
				) : (
					/* Step 2: Connect Email */
					<>
						<div>
							<div className="flex justify-center">
								<div
									className={`w-16 h-16 rounded-full flex items-center justify-center ${
										darkMode ? "bg-green-900" : "bg-green-100"
									}`}
								>
									<LucideIcons.CheckCircle
										className={`h-10 w-10 ${
											darkMode ? "text-green-400" : "text-green-600"
										}`}
									/>
								</div>
							</div>
							<h2
								className={`mt-6 text-center text-3xl font-extrabold ${
									darkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Account Created Successfully
							</h2>
							<p
								className={`mt-2 text-center text-sm ${
									darkMode ? "text-gray-400" : "text-gray-600"
								}`}
							>
								Now let's connect your existing email account
							</p>
						</div>

						<div className="mt-8 space-y-4">
							<p
								className={`text-sm ${
									darkMode ? "text-gray-300" : "text-gray-600"
								}`}
							>
								Connect your existing email account to start using secure,
								encrypted email. We don't access your emails, we just add a
								layer of encryption to your communications.
							</p>

							<div className="grid grid-cols-1 gap-4 mt-6">
								<button
									onClick={() => handleConnectEmail("gmail")}
									disabled={isLoading}
									className={`flex items-center justify-between py-4 px-4 border rounded-lg shadow-sm transition-colors duration-200 ${
										darkMode
											? "border-gray-600 bg-gray-800 hover:bg-gray-700"
											: "border-gray-300 bg-white hover:bg-gray-50"
									}`}
								>
									<div className="flex items-center">
										<svg
											className="h-6 w-6 mr-4 text-red-500"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
												fill="#4285F4"
											/>
											<path
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
												fill="#34A853"
											/>
											<path
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
												fill="#FBBC05"
											/>
											<path
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
												fill="#EA4335"
											/>
										</svg>
										<span
											className={`text-sm font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Connect Gmail Account
										</span>
									</div>
									<LucideIcons.ArrowRight className="h-5 w-5 text-gray-400" />
								</button>

								<button
									onClick={() => handleConnectEmail("outlook")}
									disabled={isLoading}
									className={`flex items-center justify-between py-4 px-4 border rounded-lg shadow-sm transition-colors duration-200 ${
										darkMode
											? "border-gray-600 bg-gray-800 hover:bg-gray-700"
											: "border-gray-300 bg-white hover:bg-gray-50"
									}`}
								>
									<div className="flex items-center">
										<svg
											className="h-6 w-6 mr-4 text-blue-500"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path d="M2 6L10 4V20L2 18V6Z" fill="#0078D4" />
											<path d="M12 4L22 2V22L12 20V4Z" fill="#0078D4" />
										</svg>
										<span
											className={`text-sm font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Connect Outlook Account
										</span>
									</div>
									<LucideIcons.ArrowRight className="h-5 w-5 text-gray-400" />
								</button>

								<button
									onClick={() => handleConnectEmail("yahoo")}
									disabled={isLoading}
									className={`flex items-center justify-between py-4 px-4 border rounded-lg shadow-sm transition-colors duration-200 ${
										darkMode
											? "border-gray-600 bg-gray-800 hover:bg-gray-700"
											: "border-gray-300 bg-white hover:bg-gray-50"
									}`}
								>
									<div className="flex items-center">
										<svg
											className="h-6 w-6 mr-4 text-purple-600"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path
												d="M19.828 7.242H16.3V3h-3.194v4.242h-3.523v3.872h3.523v12.244h3.194V11.114h3.528v-3.872z"
												fill="#6001D2"
											/>
										</svg>
										<span
											className={`text-sm font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Connect Yahoo Account
										</span>
									</div>
									<LucideIcons.ArrowRight className="h-5 w-5 text-gray-400" />
								</button>

								<button
									onClick={() => handleConnectEmail("other")}
									disabled={isLoading}
									className={`flex items-center justify-between py-4 px-4 border rounded-lg shadow-sm transition-colors duration-200 ${
										darkMode
											? "border-gray-600 bg-gray-800 hover:bg-gray-700"
											: "border-gray-300 bg-white hover:bg-gray-50"
									}`}
								>
									<div className="flex items-center">
										<LucideIcons.Mail className="h-6 w-6 mr-4 text-gray-500" />
										<span
											className={`text-sm font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Connect Other Email Provider
										</span>
									</div>
									<LucideIcons.ArrowRight className="h-5 w-5 text-gray-400" />
								</button>
							</div>

							{isLoading && (
								<div className="flex justify-center mt-4">
									<svg
										className="animate-spin h-6 w-6 text-indigo-600"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								</div>
							)}

							<div className="text-center mt-4">
								<button
									onClick={() => navigate("/security-setup")}
									className={`text-sm font-medium transition-colors duration-200 ${
										darkMode
											? "text-indigo-400 hover:text-indigo-300"
											: "text-indigo-600 hover:text-indigo-500"
									}`}
								>
									Skip for now
								</button>
							</div>
						</div>
					</>
				)}
			</animated.div>
		</div>
	);
}

// Enhanced SecuritySetup Component
function SecuritySetup({
	user,
	darkMode,
}: {
	user: User | null;
	darkMode: boolean;
}) {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
	const [backupCodesVisible, setBackupCodesVisible] = useState(false);
	const [generatingKeys, setGeneratingKeys] = useState(false);
	const [keyGenerated, setKeyGenerated] = useState(false);
	const [activeKeyId, setActiveKeyId] = useState("default");
	const [keys, setKeys] = useState([
		{
			id: "default",
			name: "Default Encryption Key",
			algorithm: "RSA-4096",
			fingerprint: "AB:CD:EF:12:34:56",
			created: new Date(),
			isActive: true,
			publicKey: "DEFAULT_PUBLIC_KEY_PLACEHOLDER",
			privateKey: "DEFAULT_PRIVATE_KEY_PLACEHOLDER",
		},
	]);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [pendingKeyAction, setPendingKeyAction] = useState(null);

	// Spring animation for content
	const contentAnimation = useSpring({
		from: { opacity: 0, transform: "translateY(20px)" },
		to: { opacity: 1, transform: "translateY(0)" },
	});

	// Generate QR code URL (in a real app, this would be a real QR code)
	const twoFactorQrCode =
		"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SecureEmail:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=SecureEmail";

	// Handle completion of security setup
	const handleComplete = () => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			toast.success("Security setup completed successfully!");
			setIsLoading(false);
			navigate("/dashboard");
		}, 1000);
	};

	// Generate new keys
	const handleGenerateKeys = () => {
		setGeneratingKeys(true);

		// Simulate key generation
		setTimeout(() => {
			const newKey = {
				id: `key_${Date.now()}`,
				name: "New Encryption Key",
				algorithm: "RSA-4096",
				fingerprint: "XY:Z1:23:45:67:89",
				created: new Date(),
				isActive: false,
				publicKey: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA${Math.random()
					.toString(36)
					.substring(2, 15)}
${Math.random().toString(36).substring(2, 15)}${Math.random()
					.toString(36)
					.substring(2, 15)}
-----END PUBLIC KEY-----`,
				privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC${Math.random()
					.toString(36)
					.substring(2, 15)}
${Math.random().toString(36).substring(2, 15)}${Math.random()
					.toString(36)
					.substring(2, 15)}
-----END PRIVATE KEY-----`,
			};

			setKeys((prev) => [...prev, newKey]);
			setGeneratingKeys(false);
			setKeyGenerated(true);
			toast.success("New encryption keys generated successfully!");
		}, 2000);
	};

	// Export key functionality
	const handleExportKey = (keyData: any, type = "both") => {
		try {
			let content = "";
			let filename = "";

			if (type === "public") {
				content = keyData.publicKey;
				filename = `${keyData.name.replace(/\s+/g, "_")}_public_key.pem`;
			} else if (type === "private") {
				content = keyData.privateKey;
				filename = `${keyData.name.replace(/\s+/g, "_")}_private_key.pem`;
			} else {
				content = `${keyData.publicKey}\n\n${keyData.privateKey}`;
				filename = `${keyData.name.replace(/\s+/g, "_")}_keypair.pem`;
			}

			const blob = new Blob([content], { type: "text/plain" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toast.success(
				`${type === "both" ? "Keypair" : type + " key"} exported successfully!`
			);
		} catch (error) {
			toast.error("Failed to export key. Please try again.");
		}
	};

	// Set key as active
	const handleSetKeyActive = (keyId: any) => {
		setPendingKeyAction({ type: "activate", keyId });
		setShowConfirmDialog(true);
	};

	// Confirm key action
	const confirmKeyAction = () => {
		if (pendingKeyAction?.type === "activate") {
			setKeys((prev) =>
				prev.map((key) => ({
					...key,
					isActive: key.id === pendingKeyAction.keyId,
				}))
			);
			setActiveKeyId(pendingKeyAction.keyId);
			toast.success("Encryption key activated successfully!");
		}
		setShowConfirmDialog(false);
		setPendingKeyAction(null);
	};

	// Copy backup codes to clipboard
	const copyBackupCodes = async () => {
		try {
			const codesText = backupCodes.join("\n");
			await navigator.clipboard.writeText(codesText);
			toast.success("Backup codes copied to clipboard!");
		} catch (error) {
			toast.error("Failed to copy backup codes. Please copy them manually.");
		}
	};

	// Backup codes
	const backupCodes = [
		"ABCD-EFGH-IJKL",
		"MNOP-QRST-UVWX",
		"1234-5678-9012",
		"3456-7890-1234",
		"WXYZ-ABCD-EFGH",
		"5678-9012-3456",
		"IJKL-MNOP-QRST",
		"7890-1234-5678",
	];

	return (
		<div
			className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
				darkMode ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			{/* Confirmation Dialog */}
			{showConfirmDialog && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div
						className={`max-w-md w-full mx-4 p-6 rounded-lg shadow-xl ${
							darkMode ? "bg-gray-800" : "bg-white"
						}`}
					>
						<div className="flex items-center mb-4">
							<LucideIcons.AlertTriangle className="h-6 w-6 text-amber-500 mr-3" />
							<h3
								className={`text-lg font-medium ${
									darkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Confirm Key Activation
							</h3>
						</div>
						<p
							className={`text-sm mb-6 ${
								darkMode ? "text-gray-300" : "text-gray-600"
							}`}
						>
							Are you sure you want to activate this encryption key? This will
							deactivate your current key and may affect access to previously
							encrypted emails.
						</p>
						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setShowConfirmDialog(false)}
								className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
									darkMode
										? "text-gray-300 bg-gray-700 hover:bg-gray-600"
										: "text-gray-700 bg-gray-100 hover:bg-gray-200"
								}`}
							>
								Cancel
							</button>
							<button
								onClick={confirmKeyAction}
								className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
							>
								Activate Key
							</button>
						</div>
					</div>
				</div>
			)}

			<div
				className={`max-w-md w-full space-y-8 p-10 rounded-xl shadow-xl ${
					darkMode ? "bg-gray-800" : "bg-white"
				}`}
			>
				{/* Progress bar */}
				<div className="w-full">
					<div className="relative pt-1">
						<div className="flex mb-2 items-center justify-between">
							<div>
								<span
									className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 ${
										darkMode ? "bg-indigo-900 text-indigo-300" : "bg-indigo-200"
									}`}
								>
									Security Setup
								</span>
							</div>
							<div className="text-right">
								<span
									className={`text-xs font-semibold inline-block ${
										darkMode ? "text-indigo-400" : "text-indigo-600"
									}`}
								>
									Step {step} of 2
								</span>
							</div>
						</div>
						<div
							className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${
								darkMode ? "bg-indigo-900" : "bg-indigo-200"
							}`}
						>
							<div
								style={{ width: step === 1 ? "50%" : "100%" }}
								className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
							></div>
						</div>
					</div>
				</div>

				<div>
					<div className="flex justify-center">
						<div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
							<LucideIcons.Shield className="h-8 w-8" />
						</div>
					</div>
					<h2
						className={`mt-6 text-center text-3xl font-extrabold ${
							darkMode ? "text-white" : "text-gray-900"
						}`}
					>
						{step === 1 ? "Two-Factor Authentication" : "Encryption Keys"}
					</h2>
					<p
						className={`mt-2 text-center text-sm ${
							darkMode ? "text-gray-400" : "text-gray-600"
						}`}
					>
						{step === 1
							? "Secure your account with two-factor authentication"
							: "Manage your encryption keys"}
					</p>
				</div>

				<animated.div style={contentAnimation} className="mt-8">
					{/* Step 1: Two-Factor Authentication */}
					{step === 1 && (
						<div className="space-y-6">
							<div
								className={`p-5 rounded-lg border ${
									darkMode
										? "bg-indigo-900 bg-opacity-20 border-indigo-800"
										: "bg-indigo-50 border-indigo-100"
								}`}
							>
								<div className="flex">
									<div className="flex-shrink-0">
										<LucideIcons.Info
											className={`h-5 w-5 ${
												darkMode ? "text-indigo-400" : "text-indigo-600"
											}`}
										/>
									</div>
									<div className="ml-3">
										<h3
											className={`text-sm font-medium ${
												darkMode ? "text-indigo-200" : "text-indigo-800"
											}`}
										>
											Why use two-factor authentication?
										</h3>
										<p
											className={`mt-2 text-sm ${
												darkMode ? "text-indigo-300" : "text-indigo-700"
											}`}
										>
											Two-factor authentication adds an extra layer of security
											to your account. Even if someone discovers your password,
											they won't be able to access your encrypted emails without
											the second factor.
										</p>
									</div>
								</div>
							</div>

							<div className="flex flex-col items-center space-y-6">
								<div
									className={`p-3 rounded-lg shadow-md ${
										darkMode ? "bg-gray-700" : "bg-white"
									}`}
								>
									<img
										src={twoFactorQrCode}
										alt="Two-factor authentication QR code"
										className="h-48 w-48 rounded-lg"
									/>
								</div>
								<div className="text-center">
									<p
										className={`text-sm mb-2 ${
											darkMode ? "text-gray-400" : "text-gray-600"
										}`}
									>
										Scan this QR code with your authenticator app (like Google
										Authenticator, Authy, or Microsoft Authenticator).
									</p>
									<p
										className={`text-sm font-medium ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Or enter this code manually:{" "}
										<span
											className={`font-mono px-2 py-1 rounded ${
												darkMode ? "bg-gray-800" : "bg-gray-100"
											}`}
										>
											JBSWY3DPEHPK3PXP
										</span>
									</p>
								</div>

								{/* Backup codes section */}
								<div className="w-full">
									<div
										className={`border-t pt-4 w-full ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
									>
										<button
											onClick={() => setBackupCodesVisible(!backupCodesVisible)}
											className={`flex items-center justify-between w-full text-left text-sm font-medium transition-colors duration-200 ${
												darkMode
													? "text-indigo-400 hover:text-indigo-200"
													: "text-indigo-600 hover:text-indigo-800"
											}`}
										>
											<span>View backup codes</span>
											{backupCodesVisible ? (
												<LucideIcons.ChevronUp className="h-5 w-5" />
											) : (
												<LucideIcons.ChevronDown className="h-5 w-5" />
											)}
										</button>

										{backupCodesVisible && (
											<div
												className={`mt-4 p-4 rounded-lg border ${
													darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-gray-50 border-gray-200"
												}`}
											>
												<div className="mb-2 flex justify-between items-center">
													<h4
														className={`text-sm font-medium ${
															darkMode ? "text-gray-300" : "text-gray-700"
														}`}
													>
														Recovery Codes
													</h4>
													<button
														onClick={copyBackupCodes}
														className={`text-xs flex items-center transition-colors duration-200 ${
															darkMode
																? "text-indigo-400 hover:text-indigo-200"
																: "text-indigo-600 hover:text-indigo-800"
														}`}
													>
														<LucideIcons.Copy className="h-3 w-3 mr-1" />
														Copy All
													</button>
												</div>
												<p
													className={`text-xs mb-3 ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													Save these codes in a secure location. Each code can
													only be used once.
												</p>
												<div className="grid grid-cols-2 gap-2">
													{backupCodes.map((code, index) => (
														<div
															key={index}
															className={`font-mono text-xs p-2 rounded border text-center ${
																darkMode
																	? "bg-gray-700 border-gray-600"
																	: "bg-white border-gray-200"
															}`}
														>
															{code}
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</div>

								<div className="flex items-center">
									<div className="flex items-center h-5">
										<input
											id="enable-2fa"
											name="enable-2fa"
											type="checkbox"
											checked={twoFactorEnabled}
											onChange={(e) => setTwoFactorEnabled(e.target.checked)}
											className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded ${
												darkMode ? "border-gray-600" : "border-gray-300"
											}`}
										/>
									</div>
									<div className="ml-3 text-sm">
										<label
											htmlFor="enable-2fa"
											className={`font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Enable two-factor authentication
										</label>
										<p className={darkMode ? "text-gray-400" : "text-gray-500"}>
											I have saved my recovery codes
										</p>
									</div>
								</div>
							</div>

							<div
								className={`flex justify-between mt-6 pt-6 border-t ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<button
									onClick={() => navigate("/dashboard")}
									className={`text-sm font-medium transition-colors duration-200 flex items-center ${
										darkMode
											? "text-indigo-400 hover:text-indigo-300"
											: "text-indigo-600 hover:text-indigo-500"
									}`}
								>
									<LucideIcons.ArrowLeft className="mr-1 h-4 w-4" />
									Skip for now
								</button>
								<button
									onClick={() => setStep(2)}
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
								>
									Next
									<LucideIcons.ArrowRight className="ml-2 h-4 w-4" />
								</button>
							</div>
						</div>
					)}

					{/* Step 2: Encryption Keys */}
					{step === 2 && (
						<div className="space-y-6">
							<div
								className={`p-5 rounded-lg border ${
									darkMode
										? "bg-indigo-900 bg-opacity-20 border-indigo-800"
										: "bg-indigo-50 border-indigo-100"
								}`}
							>
								<div className="flex">
									<div className="flex-shrink-0">
										<LucideIcons.Key
											className={`h-5 w-5 ${
												darkMode ? "text-indigo-400" : "text-indigo-600"
											}`}
										/>
									</div>
									<div className="ml-3">
										<h3
											className={`text-sm font-medium ${
												darkMode ? "text-indigo-200" : "text-indigo-800"
											}`}
										>
											About Encryption Keys
										</h3>
										<p
											className={`mt-2 text-sm ${
												darkMode ? "text-indigo-300" : "text-indigo-700"
											}`}
										>
											Your encryption keys are used to secure your emails. We've
											generated a pair of keys for you automatically - a public
											key that others use to send you encrypted messages, and a
											private key that only you can use to decrypt them.
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								{keys.map((keyData) => (
									<div
										key={keyData.id}
										className={`border rounded-lg overflow-hidden ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
									>
										<div
											className={`px-4 py-3 border-b ${
												darkMode
													? "bg-gray-750 border-gray-700"
													: "bg-gray-50 border-gray-200"
											}`}
										>
											<div className="flex justify-between items-center">
												<h3
													className={`text-sm font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													{keyData.name}
												</h3>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														keyData.isActive
															? darkMode
																? "bg-green-900 text-green-200"
																: "bg-green-100 text-green-800"
															: darkMode
															? "bg-yellow-900 text-yellow-200"
															: "bg-yellow-100 text-yellow-800"
													}`}
												>
													{keyData.isActive ? "Active" : "Inactive"}
												</span>
											</div>
										</div>
										<div
											className={`px-4 py-4 ${
												darkMode ? "bg-gray-800" : "bg-white"
											}`}
										>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p
														className={`text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														<span className="font-medium">Algorithm:</span>{" "}
														{keyData.algorithm}
													</p>
													<p
														className={`text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														<span className="font-medium">Created:</span>{" "}
														{keyData.created.toLocaleDateString()}
													</p>
												</div>
												<div>
													<p
														className={`text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														<span className="font-medium">Fingerprint:</span>{" "}
														<span className="font-mono">
															{keyData.fingerprint}
														</span>
													</p>
													<p
														className={`text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														<span className="font-medium">Expiration:</span>{" "}
														Never
													</p>
												</div>
											</div>
											<div className="mt-4 flex flex-wrap gap-2">
												{/* Export Options */}
												<div className="relative group">
													<button
														type="button"
														className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded transition-colors duration-200 ${
															darkMode
																? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
																: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
														} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
													>
														<LucideIcons.Download className="mr-1 h-4 w-4" />
														Export
														<LucideIcons.ChevronDown className="ml-1 h-3 w-3" />
													</button>
													<div
														className={`absolute bottom-full left-0 mb-1 w-40 rounded-md shadow-lg ${
															darkMode ? "bg-gray-700" : "bg-white"
														} ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10`}
													>
														<div className="py-1">
															<button
																onClick={() =>
																	handleExportKey(keyData, "public")
																}
																className={`block w-full text-left px-4 py-2 text-xs ${
																	darkMode
																		? "text-gray-300 hover:bg-gray-600"
																		: "text-gray-700 hover:bg-gray-100"
																}`}
															>
																Public Key
															</button>
															<button
																onClick={() =>
																	handleExportKey(keyData, "private")
																}
																className={`block w-full text-left px-4 py-2 text-xs ${
																	darkMode
																		? "text-gray-300 hover:bg-gray-600"
																		: "text-gray-700 hover:bg-gray-100"
																}`}
															>
																Private Key
															</button>
															<button
																onClick={() => handleExportKey(keyData, "both")}
																className={`block w-full text-left px-4 py-2 text-xs ${
																	darkMode
																		? "text-gray-300 hover:bg-gray-600"
																		: "text-gray-700 hover:bg-gray-100"
																}`}
															>
																Both Keys
															</button>
														</div>
													</div>
												</div>

												{keyData.id === "default" ? (
													<button
														type="button"
														onClick={handleGenerateKeys}
														disabled={generatingKeys}
														className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded transition-colors duration-200 ${
															darkMode
																? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
																: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
														} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
															generatingKeys
																? "opacity-70 cursor-not-allowed"
																: ""
														}`}
													>
														{generatingKeys ? (
															<>
																<svg
																	className={`animate-spin -ml-1 mr-2 h-4 w-4 ${
																		darkMode ? "text-gray-300" : "text-gray-700"
																	}`}
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																>
																	<circle
																		className="opacity-25"
																		cx="12"
																		cy="12"
																		r="10"
																		stroke="currentColor"
																		strokeWidth="4"
																	></circle>
																	<path
																		className="opacity-75"
																		fill="currentColor"
																		d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																	></path>
																</svg>
																Generating...
															</>
														) : (
															<>
																<LucideIcons.RefreshCw className="mr-1 h-4 w-4" />
																Regenerate
															</>
														)}
													</button>
												) : !keyData.isActive ? (
													<button
														type="button"
														onClick={() => handleSetKeyActive(keyData.id)}
														className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
													>
														<LucideIcons.Check className="mr-1 h-4 w-4" />
														Set as Active
													</button>
												) : (
													<span
														className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded ${
															darkMode
																? "bg-green-900 text-green-200"
																: "bg-green-100 text-green-800"
														}`}
													>
														<LucideIcons.Check className="mr-1 h-4 w-4" />
														Currently Active
													</span>
												)}
											</div>
										</div>
									</div>
								))}

								<div
									className={`p-4 rounded-lg border ${
										darkMode
											? "bg-amber-900 bg-opacity-20 border-amber-800"
											: "bg-amber-50 border-amber-100"
									}`}
								>
									<div className="flex">
										<div className="flex-shrink-0">
											<LucideIcons.AlertTriangle className="h-5 w-5 text-amber-400" />
										</div>
										<div className="ml-3">
											<h3
												className={`text-sm font-medium ${
													darkMode ? "text-amber-200" : "text-amber-800"
												}`}
											>
												Important Security Notice
											</h3>
											<p
												className={`mt-2 text-sm ${
													darkMode ? "text-amber-300" : "text-amber-700"
												}`}
											>
												Make sure to back up your encryption keys securely. If
												you lose them, you won't be able to decrypt your emails.
												We don't store a copy of your private keys anywhere.
											</p>
										</div>
									</div>
								</div>
							</div>

							<div
								className={`flex justify-between mt-6 pt-6 border-t ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<button
									onClick={() => setStep(1)}
									className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md transition-colors duration-200 ${
										darkMode
											? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
											: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
									} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
								>
									<LucideIcons.ArrowLeft className="mr-2 h-4 w-4" />
									Back
								</button>
								<button
									onClick={handleComplete}
									disabled={isLoading}
									className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
										isLoading ? "opacity-70 cursor-not-allowed" : ""
									}`}
								>
									{isLoading ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Processing...
										</>
									) : (
										<>
											Complete Setup
											<LucideIcons.Check className="ml-2 h-4 w-4" />
										</>
									)}
								</button>
							</div>
						</div>
					)}
				</animated.div>
			</div>
		</div>
	);
}

// Enhanced Dashboard Component
function Dashboard({
	user,
	onLogout,
	darkMode,
	toggleDarkMode,
}: {
	user: User | null;
	onLogout: () => void;
	darkMode: boolean;
	toggleDarkMode: () => void;
}) {
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState<string>("inbox");
	const [emails, setEmails] = useState<Email[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
	const [showComposeModal, setShowComposeModal] = useState<boolean>(false);
	const [showNotifications, setShowNotifications] = useState<boolean>(false);
	const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
	const [labels, setLabels] = useState<Label[]>([
		{ id: "1", name: "Work", color: "blue" },
		{ id: "2", name: "Personal", color: "green" },
		{ id: "3", name: "Urgent", color: "red" },
		{ id: "4", name: "Projects", color: "purple" },
	]);
	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
	const [isSelectAll, setIsSelectAll] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [notifications, setNotifications] = useState([
		{
			id: "1",
			title: "New encrypted message",
			description: "You have a new encrypted message from alex@example.com",
			time: "5 minutes ago",
			read: false,
		},
		{
			id: "2",
			title: "Encryption key expiring",
			description: "Your encryption key will expire in 14 days",
			time: "1 day ago",
			read: false,
		},
		{
			id: "3",
			title: "Security update available",
			description: "A new security update is available for your account",
			time: "3 days ago",
			read: true,
		},
	]);

	// Reference for click outside handling
	const userMenuRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);

	// Animation for email list
	const emailListAnimation = useSpring({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: { duration: 300 },
	});

	// Handle clicks outside of dropdown menus
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setShowUserMenu(false);
			}
			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target as Node)
			) {
				setShowNotifications(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Generate mock emails
	useEffect(() => {
		// Show loading state
		setIsRefreshing(true);

		// Generate some mock emails with delay to simulate API call
		setTimeout(() => {
			const mockEmails: Email[] = [
				{
					id: "1",
					from: "john.doe@example.com",
					to: [user?.email || "you@example.com"],
					subject: "Welcome to SecureEmail!",
					body: "Thank you for joining SecureEmail. We are excited to have you on board. This is a secure platform for all your email communication needs.",
					attachments: [],
					isEncrypted: true,
					encryptionLevel: "high",
					timestamp: new Date(Date.now() - 3600000), // 1 hour ago
					read: false,
					starred: true,
					folder: "inbox",
					labels: ["2"],
				},
				{
					id: "2",
					from: "marketing@company.com",
					to: [user?.email || "you@example.com"],
					subject: "Special Offer Inside",
					body: "We have a special offer just for you! Click the link below to claim your discount.",
					attachments: [],
					isEncrypted: false,
					encryptionLevel: "standard",
					timestamp: new Date(Date.now() - 86400000), // 1 day ago
					read: true,
					starred: false,
					folder: "inbox",
				},
				{
					id: "3",
					from: user?.email || "you@example.com",
					to: ["jane.smith@example.com"],
					subject: "Confidential Project Proposal",
					body: "Please find attached the confidential project proposal we discussed yesterday.",
					attachments: [
						{
							id: "att1",
							name: "proposal.pdf",
							type: "application/pdf",
							size: 2500000,
							url: "#",
							isEncrypted: true,
						},
					],
					isEncrypted: true,
					encryptionLevel: "high",
					timestamp: new Date(Date.now() - 172800000), // 2 days ago
					read: true,
					starred: false,
					folder: "sent",
					expiresAt: new Date(Date.now() + 604800000), // 7 days from now
					readReceipt: true,
					labels: ["1", "4"],
				},
				{
					id: "4",
					from: "team@secureemail.com",
					to: [user?.email || "you@example.com"],
					subject: "Your Encryption Keys",
					body: "Your encryption keys have been generated successfully. Remember to keep them safe!",
					attachments: [],
					isEncrypted: true,
					encryptionLevel: "high",
					timestamp: new Date(Date.now() - 259200000), // 3 days ago
					read: true,
					starred: true,
					folder: "inbox",
				},
				{
					id: "5",
					from: "david.wilson@example.com",
					to: [user?.email || "you@example.com"],
					subject: "Meeting Notes - Encrypted",
					body: "Please find the encrypted meeting notes from our discussion yesterday.",
					attachments: [
						{
							id: "att2",
							name: "meeting-notes.docx",
							type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
							size: 1200000,
							url: "#",
							isEncrypted: true,
						},
					],
					isEncrypted: true,
					encryptionLevel: "high",
					timestamp: new Date(Date.now() - 345600000), // 4 days ago
					read: false,
					starred: false,
					folder: "encrypted",
					labels: ["1", "3"],
				},
				{
					id: "6",
					from: user?.email || "you@example.com",
					to: ["support@secureemail.com"],
					subject: "Question about Features",
					body: "I was wondering if you could provide more information about the expiration feature for emails.",
					attachments: [],
					isEncrypted: true,
					encryptionLevel: "standard",
					timestamp: new Date(Date.now() - 432000000), // 5 days ago
					read: true,
					starred: false,
					folder: "sent",
				},
				{
					id: "7",
					from: "notifications@service.com",
					to: [user?.email || "you@example.com"],
					subject: "Account Verification",
					body: "Please verify your account by clicking the link below.",
					attachments: [],
					isEncrypted: false,
					encryptionLevel: "standard",
					timestamp: new Date(Date.now() - 518400000), // 6 days ago
					read: true,
					starred: false,
					folder: "inbox",
				},
				{
					id: "8",
					from: "newsletter@tech.com",
					to: [user?.email || "you@example.com"],
					subject: "Weekly Tech Digest",
					body: "Check out the latest tech news and updates from around the world.",
					attachments: [],
					isEncrypted: false,
					encryptionLevel: "standard",
					timestamp: new Date(Date.now() - 604800000), // 7 days ago
					read: true,
					starred: false,
					folder: "inbox",
				},
				{
					id: "9",
					from: "alex.morgan@example.com",
					to: [user?.email || "you@example.com"],
					subject: "Security Conference Invitation",
					body: "You're invited to speak at our upcoming security conference on email encryption technologies.",
					attachments: [
						{
							id: "att3",
							name: "invitation.pdf",
							type: "application/pdf",
							size: 1800000,
							url: "#",
							isEncrypted: true,
						},
					],
					isEncrypted: true,
					encryptionLevel: "high",
					timestamp: new Date(Date.now() - 259200000), // 3 days ago
					read: false,
					starred: true,
					folder: "inbox",
					labels: ["1", "2"],
				},
				{
					id: "10",
					from: "security-alerts@secureemail.com",
					to: [user?.email || "you@example.com"],
					subject: "Security Alert: New Device Login",
					body: "We detected a new login to your account from a new device. If this was you, you can ignore this message.",
					attachments: [],
					isEncrypted: true,
					encryptionLevel: "high",
					timestamp: new Date(Date.now() - 86400000), // 1 day ago
					read: false,
					starred: false,
					folder: "inbox",
					labels: ["3"],
				},
			];

			setEmails(mockEmails);
			setIsRefreshing(false);
		}, 1000);
	}, [user]);

	// Handle email selection
	const toggleEmailSelection = (emailId: string) => {
		if (selectedEmails.includes(emailId)) {
			setSelectedEmails(selectedEmails.filter((id) => id !== emailId));
		} else {
			setSelectedEmails([...selectedEmails, emailId]);
		}
	};

	// Handle select all
	const toggleSelectAll = () => {
		if (isSelectAll) {
			setSelectedEmails([]);
		} else {
			setSelectedEmails(filteredEmails.map((email) => email.id));
		}
		setIsSelectAll(!isSelectAll);
	};

	// Get emails for the current folder
	const filteredEmails = emails
		.filter((email) => {
			// Apply folder filter
			if (activeTab === "starred") {
				return email.starred;
			} else {
				return email.folder === activeTab;
			}
		})
		.filter((email) => {
			// Apply search filter if there's a search term
			if (!searchTerm) return true;

			const term = searchTerm.toLowerCase();
			return (
				email.subject.toLowerCase().includes(term) ||
				email.from.toLowerCase().includes(term) ||
				email.body.toLowerCase().includes(term)
			);
		});

	// Handle email click
	const handleEmailClick = (emailId: string) => {
		// Mark email as read
		setEmails(
			emails.map((email) =>
				email.id === emailId ? { ...email, read: true } : email
			)
		);

		// Navigate to email view
		navigate(`/view-email/${emailId}`);
	};

	// Handle refresh
	const handleRefresh = () => {
		setIsRefreshing(true);

		setTimeout(() => {
			toast.success("Inbox refreshed");
			setIsRefreshing(false);
		}, 1000);
	};

	// Handle star toggle
	const toggleStar = (emailId: string, e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent email click

		setEmails(
			emails.map((email) =>
				email.id === emailId ? { ...email, starred: !email.starred } : email
			)
		);

		toast.success("Email updated");
	};

	// Delete selected emails
	const deleteSelectedEmails = () => {
		// Update emails state to move selected emails to trash
		setEmails(
			emails.map((email) =>
				selectedEmails.includes(email.id)
					? { ...email, folder: "trash" }
					: email
			)
		);

		toast.success(
			`${selectedEmails.length} ${
				selectedEmails.length === 1 ? "email" : "emails"
			} moved to trash`
		);
		setSelectedEmails([]);
		setIsSelectAll(false);
	};

	// Archive selected emails
	const archiveSelectedEmails = () => {
		// Update emails state to archive selected emails
		setEmails(
			emails.map((email) =>
				selectedEmails.includes(email.id)
					? { ...email, folder: "archived" }
					: email
			)
		);

		toast.success(
			`${selectedEmails.length} ${
				selectedEmails.length === 1 ? "email" : "emails"
			} archived`
		);
		setSelectedEmails([]);
		setIsSelectAll(false);
	};

	// Mark selected emails as read/unread
	const markSelectedEmailsAs = (readStatus: boolean) => {
		// Update emails state to mark selected emails as read/unread
		setEmails(
			emails.map((email) =>
				selectedEmails.includes(email.id)
					? { ...email, read: readStatus }
					: email
			)
		);

		toast.success(
			`${selectedEmails.length} ${
				selectedEmails.length === 1 ? "email" : "emails"
			} marked as ${readStatus ? "read" : "unread"}`
		);
		setSelectedEmails([]);
		setIsSelectAll(false);
	};

	// Handle logout
	const handleLogout = () => {
		// Show confirmation toast
		toast(
			(t) => (
				<div className="flex items-center">
					<span>Are you sure you want to log out?</span>
					<div className="ml-4 flex space-x-2">
						<button
							onClick={() => {
								toast.dismiss(t.id);
								onLogout();
								navigate("/");
							}}
							className="px-2 py-1 bg-red-500 text-white text-xs rounded"
						>
							Yes
						</button>
						<button
							onClick={() => toast.dismiss(t.id)}
							className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded"
						>
							No
						</button>
					</div>
				</div>
			),
			{ duration: 5000 }
		);
	};

	// Format date for display
	const formatDate = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();

		// If today, show time
		if (diff < 86400000) {
			// less than 24 hours
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		}

		// If this year, show month and day
		if (date.getFullYear() === now.getFullYear()) {
			return date.toLocaleDateString([], { month: "short", day: "numeric" });
		}

		// Otherwise show full date
		return date.toLocaleDateString();
	};

	// Get label info by id
	const getLabelInfo = (labelId: string) => {
		return labels.find((label) => label.id === labelId);
	};

	// Get label color class
	const getLabelColorClass = (color: string) => {
		const colorMap: Record<string, string> = {
			blue: darkMode
				? "bg-blue-900 bg-opacity-50 text-blue-300"
				: "bg-blue-100 text-blue-800",
			green: darkMode
				? "bg-green-900 bg-opacity-50 text-green-300"
				: "bg-green-100 text-green-800",
			red: darkMode
				? "bg-red-900 bg-opacity-50 text-red-300"
				: "bg-red-100 text-red-800",
			yellow: darkMode
				? "bg-yellow-900 bg-opacity-50 text-yellow-300"
				: "bg-yellow-100 text-yellow-800",
			purple: darkMode
				? "bg-purple-900 bg-opacity-50 text-purple-300"
				: "bg-purple-100 text-purple-800",
			indigo: darkMode
				? "bg-indigo-900 bg-opacity-50 text-indigo-300"
				: "bg-indigo-100 text-indigo-800",
			pink: darkMode
				? "bg-pink-900 bg-opacity-50 text-pink-300"
				: "bg-pink-100 text-pink-800",
		};

		return (
			colorMap[color] ||
			(darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800")
		);
	};

	// Get unread count for a folder
	const getUnreadCount = (folder: string) => {
		return emails.filter((email) => email.folder === folder && !email.read)
			.length;
	};

	// Add key handlers for keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl/Cmd + N to compose new email
			if ((e.ctrlKey || e.metaKey) && e.key === "n") {
				e.preventDefault();
				setShowComposeModal(true);
			}

			// Ctrl/Cmd + R to refresh
			if ((e.ctrlKey || e.metaKey) && e.key === "r") {
				e.preventDefault();
				handleRefresh();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div
			className={`h-screen flex flex-col ${
				darkMode ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			{/* Header */}
			<header
				className={`z-10 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
			>
				<div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
					{/* Logo section */}
					<div className="flex-shrink-0 flex items-center">
						<div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
							<LucideIcons.Shield className="h-6 w-6" />
						</div>
						<span
							className={`ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
								darkMode
									? "from-indigo-400 to-purple-400"
									: "from-indigo-600 to-purple-600"
							}`}
						>
							SecureEmail
						</span>
					</div>

					{/* Search section - now using flex items-center to ensure vertical alignment */}
					<div className="flex-1 flex items-center justify-center px-4 max-w-xl mx-auto">
						<div className="w-full relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<LucideIcons.Search className="h-5 w-5 text-gray-400" />
							</div>
							<input
								id="search"
								className={`block w-full pl-10 pr-3 py-2 rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out ${
									darkMode
										? "bg-gray-700 border-none placeholder-gray-400 text-white"
										: "bg-gray-100 border-none text-gray-900"
								}`}
								placeholder="Search emails"
								type="search"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							{searchTerm && (
								<button
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setSearchTerm("")}
								>
									<LucideIcons.X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
								</button>
							)}
						</div>
					</div>

					{/* Actions section */}
					<div className="flex items-center space-x-1">
						{/* Dark mode toggle */}
						<button
							onClick={toggleDarkMode}
							className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
								darkMode
									? "text-gray-300 hover:text-white hover:bg-gray-700"
									: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
							}`}
							aria-label="Toggle dark mode"
						>
							{darkMode ? (
								<LucideIcons.Sun className="h-6 w-6" />
							) : (
								<LucideIcons.Moon className="h-6 w-6" />
							)}
						</button>

						{/* Notifications dropdown */}
						<div className="relative" ref={notificationsRef}>
							<button
								onClick={() => setShowNotifications(!showNotifications)}
								className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 relative ${
									darkMode
										? "text-gray-300 hover:text-white hover:bg-gray-700"
										: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
								}`}
							>
								<span className="sr-only">View notifications</span>
								<LucideIcons.Bell className="h-6 w-6" />
								{notifications.some((n) => !n.read) && (
									<span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
								)}
							</button>

							<AnimatePresence>
								{showNotifications && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										transition={{ duration: 0.2 }}
										className={`origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg focus:outline-none z-50 overflow-hidden ${
											darkMode ? "bg-gray-800" : "bg-white"
										}`}
									>
										<div
											className={`px-4 py-3 ${
												darkMode ? "bg-gray-750" : "bg-gray-50"
											}`}
										>
											<div className="flex justify-between items-center">
												<h3
													className={`text-sm font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Notifications
												</h3>
												<span
													className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
														darkMode
															? "bg-indigo-900 text-indigo-200"
															: "bg-indigo-100 text-indigo-800"
													}`}
												>
													{notifications.filter((n) => !n.read).length} new
												</span>
											</div>
										</div>
										<div className="max-h-60 overflow-y-auto">
											{notifications.length === 0 ? (
												<div
													className={`px-4 py-6 text-center ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													<LucideIcons.BellOff className="mx-auto h-8 w-8 mb-2" />
													<p>No notifications</p>
												</div>
											) : (
												notifications.map((notification) => (
													<div
														key={notification.id}
														className={`px-4 py-3 ${
															darkMode
																? "hover:bg-gray-700"
																: "hover:bg-gray-50"
														} ${
															!notification.read
																? darkMode
																	? "bg-indigo-900 bg-opacity-20"
																	: "bg-indigo-50"
																: ""
														}`}
													>
														<div className="flex justify-between items-start">
															<div>
																<p
																	className={`text-sm font-medium ${
																		darkMode ? "text-white" : "text-gray-900"
																	}`}
																>
																	{notification.title}
																</p>
																<p
																	className={`text-xs mt-0.5 ${
																		darkMode ? "text-gray-400" : "text-gray-500"
																	}`}
																>
																	{notification.description}
																</p>
																<p
																	className={`text-xs mt-1 ${
																		darkMode ? "text-gray-500" : "text-gray-400"
																	}`}
																>
																	{notification.time}
																</p>
															</div>
															{!notification.read && (
																<span className="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
															)}
														</div>
													</div>
												))
											)}
										</div>
										<div
											className={`px-4 py-2 text-center ${
												darkMode ? "bg-gray-750" : "bg-gray-50"
											}`}
										>
											<button
												className={`text-sm font-medium transition-colors duration-200 ${
													darkMode
														? "text-indigo-400 hover:text-indigo-300"
														: "text-indigo-600 hover:text-indigo-700"
												}`}
												onClick={() => {
													setNotifications(
														notifications.map((n) => ({ ...n, read: true }))
													);
												}}
											>
												Mark all as read
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Profile dropdown */}
						<div className="relative" ref={userMenuRef}>
							<button
								onClick={() => setShowUserMenu(!showUserMenu)}
								className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								id="user-menu"
								aria-expanded="false"
								aria-haspopup="true"
							>
								<span className="sr-only">Open user menu</span>
								<img
									className="h-9 w-9 rounded-full ring-2 ring-indigo-500 ring-opacity-50"
									src={
										user?.profileImage ||
										`https://ui-avatars.com/api/?name=${
											user?.name || "User"
										}&background=6366f1&color=fff`
									}
									alt={user?.name || "User"}
								/>
							</button>

							<AnimatePresence>
								{showUserMenu && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										transition={{ duration: 0.2 }}
										className={`origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg focus:outline-none z-50 overflow-hidden ${
											darkMode ? "bg-gray-800" : "bg-white"
										}`}
									>
										<div className="py-1">
											<div
												className={`px-4 py-3 ${
													darkMode ? "bg-gray-750" : "bg-gray-50"
												}`}
											>
												<p
													className={`text-sm font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													{user?.name}
												</p>
												<p
													className={`text-xs truncate ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													{user?.email}
												</p>
											</div>
											<a
												href="#"
												className={`block px-4 py-2 text-sm transition-colors duration-200 ${
													darkMode
														? "text-gray-300 hover:bg-gray-700 hover:text-white"
														: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
												}`}
											>
												Your Profile
											</a>
											<a
												href="#settings"
												onClick={() => navigate("/settings")}
												className={`block px-4 py-2 text-sm transition-colors duration-200 ${
													darkMode
														? "text-gray-300 hover:bg-gray-700 hover:text-white"
														: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
												}`}
											>
												Settings
											</a>
											<button
												onClick={handleLogout}
												className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
													darkMode
														? "text-gray-300 hover:bg-gray-700 hover:text-white"
														: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
												}`}
											>
												Sign out
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<div className="hidden md:flex md:flex-shrink-0">
					<div
						className={`flex flex-col w-64 ${
							darkMode ? "bg-gray-800" : "bg-white"
						}`}
					>
						<div className="p-4">
							<button
								onClick={() => setShowComposeModal(true)}
								className="w-full flex justify-center py-2 px-4 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
							>
								<LucideIcons.PenSquare className="mr-2 h-5 w-5" />
								Compose
							</button>
						</div>
						<div className="flex-1 flex flex-col overflow-y-auto">
							<nav className="flex-1 px-2 py-2 space-y-1">
								<button
									onClick={() => setActiveTab("inbox")}
									className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
										activeTab === "inbox"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
									}`}
								>
									<LucideIcons.Inbox className="mr-3 h-5 w-5" />
									Inbox
									{getUnreadCount("inbox") > 0 && (
										<span className="ml-auto py-0.5 px-2 rounded-full text-xs bg-indigo-600 text-white">
											{getUnreadCount("inbox")}
										</span>
									)}
								</button>

								<button
									onClick={() => setActiveTab("encrypted")}
									className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
										activeTab === "encrypted"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
									}`}
								>
									<LucideIcons.Lock className="mr-3 h-5 w-5" />
									Encrypted
									{getUnreadCount("encrypted") > 0 && (
										<span className="ml-auto py-0.5 px-2 rounded-full text-xs bg-indigo-600 text-white">
											{getUnreadCount("encrypted")}
										</span>
									)}
								</button>

								<button
									onClick={() => setActiveTab("starred")}
									className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
										activeTab === "starred"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
									}`}
								>
									<LucideIcons.Star className="mr-3 h-5 w-5" />
									Starred
								</button>

								<button
									onClick={() => setActiveTab("sent")}
									className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
										activeTab === "sent"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
									}`}
								>
									<LucideIcons.SendHorizontal className="mr-3 h-5 w-5" />
									Sent
								</button>

								<button
									onClick={() => setActiveTab("drafts")}
									className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
										activeTab === "drafts"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
									}`}
								>
									<LucideIcons.FileEdit className="mr-3 h-5 w-5" />
									Drafts
								</button>

								<button
									onClick={() => setActiveTab("trash")}
									className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
										activeTab === "trash"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
									}`}
								>
									<LucideIcons.Trash2 className="mr-3 h-5 w-5" />
									Trash
								</button>

								<div className="pt-4 mt-2 mb-2">
									<div
										className={`px-3 flex justify-between items-center text-xs font-semibold uppercase tracking-wider ${
											darkMode
												? "text-gray-400 after:content-[''] after:block after:h-[1px] after:bg-gray-700 after:w-full after:ml-2"
												: "text-gray-500 after:content-[''] after:block after:h-[1px] after:bg-gray-200 after:w-full after:ml-2"
										}`}
									>
										<div className="flex items-center space-x-2">
											<span>Labels</span>
											<button
												className={`transition-colors duration-200 p-0.5 rounded-full ${
													darkMode
														? "hover:bg-gray-700 hover:text-indigo-400"
														: "hover:bg-gray-200 hover:text-indigo-600"
												}`}
											>
												<LucideIcons.Plus className="h-3 w-3" />
											</button>
										</div>
									</div>
								</div>

								{labels.map((label) => (
									<button
										key={label.id}
										className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors duration-200 ${
											darkMode
												? "text-gray-300 hover:bg-gray-700 hover:text-white"
												: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
										}`}
									>
										<div
											className={`h-3 w-3 rounded-full mr-3`}
											style={{
												backgroundColor:
													label.color === "blue"
														? "#3b82f6"
														: label.color === "green"
														? "#10b981"
														: label.color === "red"
														? "#ef4444"
														: label.color === "purple"
														? "#8b5cf6"
														: "#6366f1",
											}}
										></div>
										{label.name}
									</button>
								))}
							</nav>

							<div
								className={`mt-6 px-3 py-4 mx-2 rounded-lg ${
									darkMode ? "bg-gray-750" : "bg-gray-50"
								}`}
							>
								<h3
									className={`text-xs font-semibold uppercase tracking-wider ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Connected Accounts
								</h3>
								<ul className="mt-2 space-y-1">
									{user?.connectedAccounts.map((account) => (
										<li
											key={account.id}
											className={`flex items-center px-2 py-1.5 text-sm ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											{account.provider === "gmail" && (
												<svg
													className="mr-2 h-4 w-4 text-red-500"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path
														d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
														fill="#4285F4"
													/>
													<path
														d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
														fill="#34A853"
													/>
													<path
														d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
														fill="#FBBC05"
													/>
													<path
														d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
														fill="#EA4335"
													/>
												</svg>
											)}
											{account.provider === "outlook" && (
												<svg
													className="mr-2 h-4 w-4 text-blue-500"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M2 6L10 4V20L2 18V6Z" fill="#0078D4" />
													<path d="M12 4L22 2V22L12 20V4Z" fill="#0078D4" />
												</svg>
											)}
											{account.provider === "yahoo" && (
												<svg
													className="mr-2 h-4 w-4 text-purple-600"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path
														d="M19.828 7.242H16.3V3h-3.194v4.242h-3.523v3.872h3.523v12.244h3.194V11.114h3.528v-3.872z"
														fill="#6001D2"
													/>
												</svg>
											)}
											{account.provider === "other" && (
												<LucideIcons.Mail className="mr-2 h-4 w-4 text-gray-500" />
											)}
											<span className="truncate">{account.email}</span>
											<div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
										</li>
									))}
									<li className="mt-3">
										<button
											className={`flex items-center px-2 py-1.5 text-sm transition-colors duration-200 ${
												darkMode
													? "text-indigo-400 hover:text-indigo-300"
													: "text-indigo-600 hover:text-indigo-700"
											}`}
										>
											<LucideIcons.Plus className="mr-2 h-4 w-4" />
											Add Account
										</button>
									</li>
								</ul>
							</div>

							<div className="px-3 py-4 mx-2 mt-4 mb-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
								<div className="flex items-center justify-between">
									<h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
										Storage
									</h3>
									<span className="text-xs text-indigo-100">30% used</span>
								</div>
								<div
									className={`mt-2 w-full rounded-full h-2.5 overflow-hidden ${
										darkMode ? "bg-indigo-900" : "bg-indigo-100"
									} bg-opacity-50`}
								>
									<div
										className={`${
											darkMode ? "bg-indigo-100" : "bg-indigo-900"
										} h-2.5 rounded-full w-[30%]`}
									></div>
								</div>
								<div className="mt-1 text-xs flex justify-between text-indigo-100">
									<span>1.5 GB of 5 GB used</span>
									<button className="transition-colors duration-200 font-medium hover:text-white hover:underline">
										Upgrade
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile menu button */}
				<div className="md:hidden fixed bottom-4 right-4 z-50">
					<button
						onClick={() => setShowMobileMenu(!showMobileMenu)}
						className="p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{showMobileMenu ? (
							<LucideIcons.X className="h-6 w-6" />
						) : (
							<LucideIcons.Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile sidebar */}
				<AnimatePresence>
					{showMobileMenu && (
						<motion.div
							initial={{ opacity: 0, x: -300 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -300 }}
							transition={{ duration: 0.3 }}
							className="fixed inset-0 z-40 flex md:hidden"
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.75 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="fixed inset-0 bg-gray-600 bg-opacity-75"
								onClick={() => setShowMobileMenu(false)}
							/>

							<motion.div
								className={`relative flex-1 flex flex-col max-w-xs w-full shadow-xl ${
									darkMode ? "bg-gray-800" : "bg-white"
								}`}
								initial={{ x: "-100%" }}
								animate={{ x: 0 }}
								exit={{ x: "-100%" }}
								transition={{ duration: 0.3 }}
							>
								<div className="pt-5 pb-4 flex items-center justify-between px-4">
									<div className="flex items-center">
										<div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
											<LucideIcons.Shield className="h-6 w-6" />
										</div>
										<span
											className={`ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
												darkMode
													? "from-indigo-400 to-purple-400"
													: "from-indigo-600 to-purple-600"
											}`}
										>
											SecureEmail
										</span>
									</div>
									<button
										onClick={() => setShowMobileMenu(false)}
										className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
									>
										<span className="sr-only">Close sidebar</span>
										<LucideIcons.X
											className={`h-6 w-6 ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										/>
									</button>
								</div>

								<div className="mt-5 flex-1 h-0 overflow-y-auto">
									<nav className="px-2 space-y-1">
										{/* Mobile nav items - same as desktop sidebar but with onclick that also closes mobile menu */}
										{/* ... */}
									</nav>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Main content area */}
				<div
					className={`flex-1 flex flex-col w-0 overflow-hidden ${
						darkMode ? "bg-gray-900" : "bg-gray-50"
					}`}
				>
					{/* Email list header */}
					<div
						className={`relative z-5 flex-shrink-0 flex h-16 shadow-sm ${
							darkMode ? "bg-gray-800" : "bg-white"
						}`}
					>
						<div className="flex-1 px-4 flex justify-between">
							<div className="flex-1 flex items-center">
								<h1
									className={`text-xl font-semibold capitalize ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									{activeTab}
								</h1>
								{selectedEmails.length > 0 && (
									<span
										className={`ml-2 text-sm ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										({selectedEmails.length} selected)
									</span>
								)}
							</div>
							<div className="ml-4 flex items-center md:ml-6 space-x-2">
								{/* Email actions buttons */}
								{selectedEmails.length > 0 ? (
									<>
										<button
											onClick={() => markSelectedEmailsAs(true)}
											className={`p-1.5 rounded-md transition-colors duration-200 group relative ${
												darkMode
													? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
											}`}
										>
											<span className="sr-only">Mark as read</span>
											<LucideIcons.MailCheck className="h-5 w-5" />
											<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
												Mark as read
											</span>
										</button>
										<button
											onClick={() => markSelectedEmailsAs(false)}
											className={`p-1.5 rounded-md transition-colors duration-200 group relative ${
												darkMode
													? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
											}`}
										>
											<span className="sr-only">Mark as unread</span>
											<LucideIcons.Mail className="h-5 w-5" />
											<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
												Mark as unread
											</span>
										</button>
										<button
											onClick={archiveSelectedEmails}
											className={`p-1.5 rounded-md transition-colors duration-200 group relative ${
												darkMode
													? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
											}`}
										>
											<span className="sr-only">Archive</span>
											<LucideIcons.Archive className="h-5 w-5" />
											<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
												Archive
											</span>
										</button>
										<button
											onClick={deleteSelectedEmails}
											className={`p-1.5 rounded-md transition-colors duration-200 group relative ${
												darkMode
													? "text-red-400 hover:text-red-300 hover:bg-gray-700"
													: "text-red-500 hover:text-red-700 hover:bg-red-50"
											}`}
										>
											<span className="sr-only">Delete</span>
											<LucideIcons.Trash2 className="h-5 w-5" />
											<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
												Delete
											</span>
										</button>
									</>
								) : (
									<>
										<button
											onClick={handleRefresh}
											disabled={isRefreshing}
											className={`p-1.5 rounded-md transition-colors duration-200 group relative ${
												darkMode
													? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
											} ${isRefreshing ? "animate-spin" : ""}`}
										>
											<span className="sr-only">Refresh</span>
											<LucideIcons.RefreshCw className="h-5 w-5" />
											<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
												Refresh
											</span>
										</button>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Email list */}
					<animated.div
						style={emailListAnimation}
						className="flex-1 overflow-auto"
					>
						<div
							className={`rounded-lg m-4 shadow-sm ${
								darkMode ? "bg-gray-800" : "bg-white"
							}`}
						>
							{filteredEmails.length === 0 ? (
								<div className="py-20">
									<div className="text-center">
										<LucideIcons.MailX
											className={`mx-auto h-12 w-12 ${
												darkMode ? "text-gray-600" : "text-gray-400"
											}`}
										/>
										<h3
											className={`mt-2 text-lg font-medium ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											No emails
										</h3>
										<p
											className={`mt-1 text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{searchTerm
												? "No emails match your search criteria."
												: `No emails in ${activeTab}.`}
										</p>
										<div className="mt-6">
											<button
												onClick={() => setShowComposeModal(true)}
												className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
											>
												<LucideIcons.PenSquare className="mr-2 h-5 w-5" />
												Compose New Email
											</button>
										</div>
									</div>
								</div>
							) : (
								<div>
									{/* Select all header */}
									<div
										className={`px-4 py-3 flex items-center rounded-t-lg ${
											darkMode ? "bg-gray-750" : "bg-gray-50"
										}`}
									>
										<div className="flex items-center">
											<input
												id="select-all"
												name="select-all"
												type="checkbox"
												className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer ${
													darkMode
														? "bg-gray-700 border-gray-600"
														: "bg-white border-gray-300"
												}`}
												checked={isSelectAll}
												onChange={toggleSelectAll}
											/>
											<label htmlFor="select-all" className="sr-only">
												Select all
											</label>
										</div>
										<div
											className={`ml-3 text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{filteredEmails.length}{" "}
											{filteredEmails.length === 1 ? "email" : "emails"}
										</div>
									</div>

									<ul className="divide-y divide-gray-100 dark:divide-gray-700">
										{filteredEmails.map((email) => (
											<motion.li
												key={email.id}
												whileHover={{
													backgroundColor: darkMode
														? "rgba(55, 65, 81, 0.5)"
														: "rgba(243, 244, 246, 0.5)",
												}}
												className={`relative ${
													!email.read
														? darkMode
															? "bg-indigo-900 bg-opacity-20"
															: "bg-indigo-50"
														: ""
												} ${
													selectedEmails.includes(email.id)
														? darkMode
															? "bg-indigo-900 bg-opacity-40"
															: "bg-indigo-100"
														: ""
												}`}
											>
												<div className="px-4 py-4 sm:px-6 flex items-center">
													<div
														className="flex items-center pr-4"
														onClick={(e) => e.stopPropagation()}
													>
														<input
															id={`select-${email.id}`}
															name={`select-${email.id}`}
															type="checkbox"
															className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer ${
																darkMode
																	? "bg-gray-700 border-gray-600"
																	: "bg-white border-gray-300"
															}`}
															checked={selectedEmails.includes(email.id)}
															onChange={() => toggleEmailSelection(email.id)}
														/>
														<label
															htmlFor={`select-${email.id}`}
															className="sr-only"
														>
															Select email
														</label>
													</div>

													<div
														className="flex-1 min-w-0 cursor-pointer"
														onClick={() => handleEmailClick(email.id)}
													>
														<div className="flex justify-between items-center mb-1">
															<div className="flex items-center space-x-3">
																<div className="flex-shrink-0">
																	<div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white uppercase shadow-sm">
																		{email.from.split("@")[0].charAt(0)}
																	</div>
																</div>
																<div className="min-w-0 flex-1">
																	<p
																		className={`text-sm font-medium truncate ${
																			!email.read
																				? darkMode
																					? "text-white"
																					: "text-gray-900"
																				: darkMode
																				? "text-gray-300"
																				: "text-gray-700"
																		}`}
																	>
																		{email.from === user?.email
																			? `Me (${user.email})`
																			: email.from}
																	</p>
																	<p
																		className={`text-xs truncate ${
																			darkMode
																				? "text-gray-400"
																				: "text-gray-500"
																		}`}
																	>
																		To: {email.to.join(", ")}
																	</p>
																</div>
															</div>
															<div className="flex flex-shrink-0 flex-col items-end">
																<p
																	className={`text-sm whitespace-nowrap ${
																		darkMode ? "text-gray-400" : "text-gray-500"
																	}`}
																>
																	{formatDate(email.timestamp)}
																</p>
																<div className="mt-1 flex items-center space-x-2">
																	<button
																		onClick={(e) => toggleStar(email.id, e)}
																		className={`transition-colors duration-200 ${
																			email.starred
																				? "text-yellow-500"
																				: darkMode
																				? "text-gray-400 hover:text-yellow-500"
																				: "text-gray-400 hover:text-yellow-500"
																		}`}
																	>
																		{email.starred ? (
																			<LucideIcons.Star className="h-4 w-4 fill-current" />
																		) : (
																			<LucideIcons.Star className="h-4 w-4" />
																		)}
																	</button>

																	{email.isEncrypted && (
																		<span
																			className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
																				darkMode
																					? "bg-green-900 text-green-200"
																					: "bg-green-100 text-green-800"
																			}`}
																		>
																			<LucideIcons.Lock className="mr-1 h-3 w-3" />
																			Encrypted
																		</span>
																	)}

																	{email.attachments.length > 0 && (
																		<span
																			className={
																				darkMode
																					? "text-indigo-400"
																					: "text-indigo-500"
																			}
																		>
																			<LucideIcons.Paperclip className="h-4 w-4" />
																		</span>
																	)}
																</div>
															</div>
														</div>

														<div className="mt-2">
															<h3
																className={`text-base truncate ${
																	!email.read
																		? darkMode
																			? "font-semibold text-white"
																			: "font-semibold text-gray-900"
																		: darkMode
																		? "font-normal text-gray-300"
																		: "font-normal text-gray-700"
																}`}
															>
																{email.subject}
															</h3>
															<p
																className={`mt-1 text-sm line-clamp-1 ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																{email.body}
															</p>

															{/* Labels */}
															{email.labels && email.labels.length > 0 && (
																<div className="mt-2 flex flex-wrap gap-1.5">
																	{email.labels.map((labelId) => {
																		const label = getLabelInfo(labelId);
																		if (!label) return null;
																		return (
																			<span
																				key={labelId}
																				className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLabelColorClass(
																					label.color
																				)}`}
																			>
																				{label.name}
																			</span>
																		);
																	})}
																</div>
															)}

															{/* Attachments */}
															{email.attachments.length > 0 && (
																<div className="mt-2 flex flex-wrap gap-2">
																	{email.attachments.map((attachment) => (
																		<div
																			key={attachment.id}
																			className={`flex items-center text-xs rounded-md px-2 py-1 ${
																				darkMode
																					? "bg-gray-700 text-gray-300"
																					: "bg-gray-100 text-gray-700"
																			}`}
																		>
																			<LucideIcons.FileText
																				className={`mr-1.5 h-3.5 w-3.5 ${
																					darkMode
																						? "text-indigo-400"
																						: "text-indigo-500"
																				}`}
																			/>
																			{attachment.name}
																			{attachment.isEncrypted && (
																				<LucideIcons.Lock
																					className={`ml-1 h-3 w-3 ${
																						darkMode
																							? "text-green-400"
																							: "text-green-500"
																					}`}
																				/>
																			)}
																		</div>
																	))}
																</div>
															)}
														</div>
													</div>
												</div>
											</motion.li>
										))}
									</ul>
								</div>
							)}
						</div>
					</animated.div>
				</div>
			</div>

			{/* Compose Modal */}
			<AnimatePresence>
				{showComposeModal && (
					<Compose
						user={user}
						darkMode={darkMode}
						onClose={() => setShowComposeModal(false)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
// Enhanced Compose Component
// Enhanced Compose Component
// Enhanced Compose Component with Improved Visual Design
function Compose({
	user,
	darkMode,
	onClose,
}: {
	user: User | null;
	darkMode: boolean;
	onClose?: () => void;
}) {
	const navigate = useNavigate();
	const [recipient, setRecipient] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [attachments, setAttachments] = useState<File[]>([]);
	const [isEncrypted, setIsEncrypted] = useState(true);
	const [encryptionLevel, setEncryptionLevel] = useState<"standard" | "high">(
		"standard"
	);
	const [expiresAt, setExpiresAt] = useState<string>("");
	const [readReceipt, setReadReceipt] = useState(false);
	const [passwordProtected, setPasswordProtected] = useState(false);
	const [password, setPassword] = useState("");
	const [passwordHint, setPasswordHint] = useState("");
	const [showEncryptedPreview, setShowEncryptedPreview] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const [isDraft, setIsDraft] = useState(false);
	const [recipients, setRecipients] = useState<string[]>([]);
	const [ccVisible, setCcVisible] = useState(false);
	const [bccVisible, setBccVisible] = useState(false);
	const [cc, setCc] = useState("");
	const [bcc, setBcc] = useState("");
	const [showAddKeyModal, setShowAddKeyModal] = useState(false);
	const [selectedEncryptionKey, setSelectedEncryptionKey] =
		useState("default-key");
	const [encryptionKeys, setEncryptionKeys] = useState([
		{ id: "default-key", name: "Default Key (4096-bit RSA)" },
		{ id: "work-key", name: "Work Key (2048-bit RSA)" },
	]);
	const [newKeyName, setNewKeyName] = useState("");
	const [newKeyBits, setNewKeyBits] = useState("4096");
	const [isGeneratingKey, setIsGeneratingKey] = useState(false);
	const [draftSaved, setDraftSaved] = useState(false);
	const [draftSaving, setDraftSaving] = useState(false);
	const [draftId, setDraftId] = useState<string | null>(null);
	const [customExpiryTime, setCustomExpiryTime] = useState("");
	const [showCustomExpiry, setShowCustomExpiry] = useState(false);
	const [formTouched, setFormTouched] = useState(false);
	const [showEmailFormatting, setShowEmailFormatting] = useState(false);

	// File input ref for custom button
	const fileInputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const minimizedRef = useRef<HTMLDivElement>(null);
	const dropzoneRef = useRef<HTMLDivElement>(null);
	const ccInputRef = useRef<HTMLInputElement>(null);
	const bccInputRef = useRef<HTMLInputElement>(null);

	// Animation for overlay only
	const overlayAnimation = useSpring({
		opacity: isMinimized ? 0 : 0.75,
		config: { tension: 300, friction: 30 },
	});

	// Auto-save draft every 30 seconds if content has changed
	useEffect(() => {
		if (!formTouched) return;

		const autoSaveTimer = setTimeout(() => {
			handleSaveAsDraft(true);
		}, 30000);

		return () => clearTimeout(autoSaveTimer);
	}, [recipient, subject, message, recipients, formTouched]);

	// Set form as touched when any field changes
	useEffect(() => {
		if (
			recipient ||
			subject ||
			message ||
			recipients.length > 0 ||
			attachments.length > 0
		) {
			setFormTouched(true);
		}
	}, [recipient, subject, message, recipients, attachments]);

	// Handle drag and drop for attachments
	useEffect(() => {
		const dropzone = dropzoneRef.current;
		if (!dropzone) return;

		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dropzone.classList.add(darkMode ? "bg-gray-700" : "bg-gray-100");
			dropzone.classList.add("border-indigo-500");
		};

		const handleDragLeave = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dropzone.classList.remove(darkMode ? "bg-gray-700" : "bg-gray-100");
			dropzone.classList.remove("border-indigo-500");
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dropzone.classList.remove(darkMode ? "bg-gray-700" : "bg-gray-100");
			dropzone.classList.remove("border-indigo-500");

			if (e.dataTransfer?.files) {
				const newFiles = Array.from(e.dataTransfer.files);
				setAttachments((prev) => [...prev, ...newFiles]);
			}
		};

		dropzone.addEventListener("dragover", handleDragOver);
		dropzone.addEventListener("dragleave", handleDragLeave);
		dropzone.addEventListener("drop", handleDrop);

		return () => {
			dropzone.removeEventListener("dragover", handleDragOver);
			dropzone.removeEventListener("dragleave", handleDragLeave);
			dropzone.removeEventListener("drop", handleDrop);
		};
	}, [darkMode]);

	// Handle file upload
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setAttachments([...attachments, ...newFiles]);
			setFormTouched(true);
		}
	};

	// Remove attachment
	const removeAttachment = (index: number) => {
		setAttachments(attachments.filter((_, i) => i !== index));
	};

	// Format file size
	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + " B";
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
		else return (bytes / 1048576).toFixed(1) + " MB";
	};

	// Handle recipient input
	const handleRecipientInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === "," || e.key === ";") {
			e.preventDefault();
			if (recipient.trim()) {
				setRecipients([...recipients, recipient.trim()]);
				setRecipient("");
			}
		}
	};

	// Handle cc recipient input
	const handleCcInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === "," || e.key === ";") {
			e.preventDefault();
			if (cc.trim() && cc.includes("@")) {
				const newCcValue = [...recipients, cc.trim()];
				setRecipients(newCcValue);
				setCc("");
			}
		}
	};

	// Handle bcc recipient input
	const handleBccInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === "," || e.key === ";") {
			e.preventDefault();
			if (bcc.trim() && bcc.includes("@")) {
				const newBccValue = [...recipients, bcc.trim()];
				setRecipients(newBccValue);
				setBcc("");
			}
		}
	};

	// Remove recipient
	const removeRecipient = (index: number) => {
		setRecipients(recipients.filter((_, i) => i !== index));
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form
		if (recipients.length === 0 && recipient.trim() === "") {
			toast.error("Please enter at least one recipient");
			return;
		}

		if (subject.trim() === "") {
			toast.error("Please enter a subject");
			return;
		}

		if (message.trim() === "") {
			toast.error("Please enter a message");
			return;
		}

		if (passwordProtected && password.trim() === "") {
			toast.error("Please enter a password");
			return;
		}

		setIsSending(true);

		// Add the current input recipient to the list if any
		let allRecipients = [...recipients];
		if (recipient.trim()) {
			allRecipients.push(recipient.trim());
		}

		// If a draft exists, delete it before sending
		if (draftId) {
			// In a real app, you would call an API to delete the draft
			console.log(`Deleting draft ${draftId} before sending`);
		}

		// Simulate sending email
		setTimeout(() => {
			setIsSending(false);
			toast.success("Email sent securely!");
			if (onClose) onClose();
		}, 1500);
	};

	// Save as draft
	const handleSaveAsDraft = (silent = false) => {
		// Don't save if nothing has changed
		if (!formTouched) return;

		setDraftSaving(true);

		// Collect draft data
		const draftData = {
			id: draftId || `draft-${Date.now()}`,
			subject: subject,
			message: message,
			recipients: [...recipients, ...(recipient ? [recipient] : [])],
			cc: cc,
			bcc: bcc,
			attachments: attachments,
			isEncrypted: isEncrypted,
			encryptionLevel: encryptionLevel,
			expiresAt: expiresAt,
			readReceipt: readReceipt,
			passwordProtected: passwordProtected,
			password: password,
			passwordHint: passwordHint,
			timestamp: new Date(),
		};

		// In a real app, you would call an API to save the draft
		setTimeout(() => {
			// Set draft ID if it doesn't exist
			if (!draftId) {
				setDraftId(draftData.id);
			}

			setDraftSaving(false);
			setDraftSaved(true);
			setIsDraft(true);

			if (!silent) {
				toast.success("Email saved as draft");
				setTimeout(() => {
					if (onClose) onClose();
				}, 1000);
			} else {
				// Show a more subtle notification for auto-save
				toast("Draft saved automatically", {
					icon: "📝",
					duration: 2000,
				});
			}

			// Reset draft saved flag after a delay
			setTimeout(() => {
				setDraftSaved(false);
			}, 3000);
		}, 800);
	};

	// Encrypt/Decrypt preview toggle
	const toggleEncryptedPreview = () => {
		setShowEncryptedPreview(!showEncryptedPreview);
	};

	// Handle adding new encryption key
	const handleAddKey = () => {
		setShowAddKeyModal(true);
	};

	// Handle generating new encryption key
	const handleGenerateNewKey = (e: React.FormEvent) => {
		e.preventDefault();

		if (!newKeyName.trim()) {
			toast.error("Please enter a key name");
			return;
		}

		setIsGeneratingKey(true);

		// Simulate key generation
		setTimeout(() => {
			const newKey = {
				id: `key-${Date.now()}`,
				name: `${newKeyName} (${newKeyBits}-bit RSA)`,
			};

			setEncryptionKeys([...encryptionKeys, newKey]);
			setSelectedEncryptionKey(newKey.id);
			setIsGeneratingKey(false);
			setShowAddKeyModal(false);

			toast.success(
				`New encryption key "${newKeyName}" generated successfully!`
			);
			setNewKeyName("");
		}, 1500);
	};

	// Handle expiry time change
	const handleExpiryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setExpiresAt(value);
		setShowCustomExpiry(value === "custom");
	};

	// Handle custom expiry input
	const handleCustomExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCustomExpiryTime(e.target.value);
	};

	// Add key handlers for keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Escape to close
			if (e.key === "Escape") {
				if (onClose) onClose();
			}

			// Ctrl/Cmd + Enter to send
			if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
				if (formRef.current) {
					e.preventDefault();
					formRef.current.dispatchEvent(
						new Event("submit", { cancelable: true, bubbles: true })
					);
				}
			}

			// Ctrl/Cmd + S to save draft
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault();
				handleSaveAsDraft();
			}

			// Ctrl/Cmd + M to minimize/maximize
			if ((e.ctrlKey || e.metaKey) && e.key === "m") {
				e.preventDefault();
				setIsMinimized(!isMinimized);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose, recipient, subject, message, isMinimized]);

	return (
		<>
			{/* Overlay */}
			<animated.div
				style={overlayAnimation}
				className="fixed inset-0 bg-gray-600 z-40"
				onClick={isMinimized ? () => setIsMinimized(false) : onClose}
			></animated.div>

			{/* Modal */}
			{!isMinimized && (
				<div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
					<div
						className={`rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col pointer-events-auto mx-4 md:mx-auto overflow-hidden ${
							darkMode ? "bg-gray-800" : "bg-white"
						}`}
					>
						{/* Header */}
						<div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-lg flex items-center justify-between">
							<h2 className="text-xl font-bold text-white flex items-center">
								<LucideIcons.PenSquare className="mr-2 h-6 w-6" />
								Compose Secure Email
							</h2>
							<div className="flex items-center space-x-3">
								<div className="flex items-center space-x-1 bg-white/20 rounded-md px-2 py-1">
									{draftSaved && (
										<span className="text-xs text-white font-medium">
											Draft saved
										</span>
									)}
									{draftSaving && (
										<span className="text-xs text-white flex items-center">
											<svg
												className="animate-spin h-3 w-3 mr-1"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Saving...
										</span>
									)}
									{!draftSaved && !draftSaving && (
										<span className="text-xs text-white font-medium opacity-0">
											Draft
										</span>
									)}
								</div>
								<div className="flex items-center space-x-2">
									<button
										onClick={() => setIsMinimized(!isMinimized)}
										className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none p-1.5 rounded-md hover:bg-white/20"
										title="Minimize"
									>
										<LucideIcons.Minimize2 className="h-5 w-5" />
									</button>
									<button
										onClick={onClose}
										className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none p-1.5 rounded-md hover:bg-white/20"
										title="Close"
									>
										<LucideIcons.X className="h-5 w-5" />
									</button>
								</div>
							</div>
						</div>

						{/* Content */}
						<div
							ref={dropzoneRef}
							className="flex-1 overflow-auto transition-colors duration-200 border-2 border-transparent"
						>
							<form ref={formRef} onSubmit={handleSubmit} className="">
								{/* Email composition section */}
								<div
									className={`px-6 py-5 ${
										darkMode ? "bg-gray-800" : "bg-white"
									}`}
								>
									{/* From field with enhanced key selection */}
									<div className="mb-5">
										<label
											htmlFor="from"
											className={`block text-sm font-medium mb-2 ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											From
										</label>
										<div className="flex items-center">
											<span
												className={`px-3 py-2.5 rounded-l-md border border-r-0 text-sm ${
													darkMode
														? "bg-gray-700 text-gray-300 border-gray-600"
														: "bg-gray-100 text-gray-700 border-gray-300"
												}`}
											>
												{user?.email || "you@example.com"}
											</span>

											{/* Key selector with prominent add button */}
											<div className="relative flex-grow">
												<select
													className={`h-full block w-full py-2.5 pl-3 pr-10 rounded-none border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
														darkMode
															? "border-gray-600 bg-gray-700 text-white"
															: "border-gray-300 bg-white text-gray-900"
													}`}
													value={selectedEncryptionKey}
													onChange={(e) => {
														if (e.target.value === "add-key") {
															setShowAddKeyModal(true);
														} else {
															setSelectedEncryptionKey(e.target.value);
														}
													}}
												>
													{encryptionKeys.map((key) => (
														<option key={key.id} value={key.id}>
															{key.name}
														</option>
													))}
												</select>
											</div>

											{/* Prominent Add Key Button */}
											<button
												type="button"
												onClick={handleAddKey}
												className={`flex items-center justify-center h-full px-4 py-2.5 border border-l-0 rounded-r-md transition-colors duration-200 ${
													darkMode
														? "bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-600"
														: "bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200"
												}`}
												title="Add New Encryption Key"
											>
												<LucideIcons.Plus className="h-5 w-5" />
												<span className="ml-1 font-medium">New Key</span>
											</button>
										</div>
										<p
											className={`mt-1 text-xs ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Select the encryption key you want to use or create a new
											one.
										</p>
									</div>

									{/* Recipients separator */}
									<div
										className={`mb-5 pb-4 border-b ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
									>
										{/* To field */}
										<div className="mb-3">
											<label
												htmlFor="recipient"
												className={`block text-sm font-medium mb-2 ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												To
											</label>
											<div
												className={`flex flex-wrap items-center border rounded-md p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 ${
													darkMode
														? "border-gray-600 bg-gray-700"
														: "border-gray-300 bg-white"
												}`}
											>
												{recipients.map((email, index) => (
													<div
														key={index}
														className={`m-1 flex items-center rounded-full pl-3 pr-1 py-1 text-sm ${
															darkMode
																? "bg-indigo-900 bg-opacity-50 text-indigo-200"
																: "bg-indigo-100 text-indigo-800"
														}`}
													>
														<span className="truncate max-w-xs">{email}</span>
														<button
															type="button"
															onClick={() => removeRecipient(index)}
															className={`ml-1 flex-shrink-0 h-5 w-5 rounded-full inline-flex items-center justify-center focus:outline-none ${
																darkMode
																	? "text-indigo-400 hover:text-indigo-500 hover:bg-indigo-800"
																	: "text-indigo-400 hover:text-indigo-500 hover:bg-indigo-200"
															}`}
														>
															<span className="sr-only">Remove {email}</span>
															<LucideIcons.X className="h-3 w-3" />
														</button>
													</div>
												))}
												<input
													type="text"
													id="recipient"
													value={recipient}
													onChange={(e) => setRecipient(e.target.value)}
													onKeyDown={handleRecipientInput}
													className={`flex-1 border-0 focus:ring-0 min-w-[8rem] p-1.5 placeholder-gray-500 sm:text-sm bg-transparent ${
														darkMode
															? "text-white placeholder-gray-400"
															: "text-gray-900"
													}`}
													placeholder={
														recipients.length === 0
															? "recipient@example.com"
															: ""
													}
												/>
											</div>
											<div className="mt-2 flex justify-start space-x-3 text-xs">
												<button
													type="button"
													onClick={() => {
														setCcVisible(!ccVisible);
														if (!ccVisible) {
															setTimeout(() => ccInputRef.current?.focus(), 0);
														}
													}}
													className={`font-medium transition-colors duration-200 px-2 py-1 rounded ${
														ccVisible
															? darkMode
																? "bg-indigo-900 text-indigo-300"
																: "bg-indigo-100 text-indigo-700"
															: darkMode
															? "text-indigo-400 hover:text-indigo-300 hover:bg-gray-700"
															: "text-indigo-600 hover:text-indigo-500 hover:bg-gray-100"
													}`}
												>
													{ccVisible ? "Hide Cc" : "Add Cc"}
												</button>
												<button
													type="button"
													onClick={() => {
														setBccVisible(!bccVisible);
														if (!bccVisible) {
															setTimeout(() => bccInputRef.current?.focus(), 0);
														}
													}}
													className={`font-medium transition-colors duration-200 px-2 py-1 rounded ${
														bccVisible
															? darkMode
																? "bg-indigo-900 text-indigo-300"
																: "bg-indigo-100 text-indigo-700"
															: darkMode
															? "text-indigo-400 hover:text-indigo-300 hover:bg-gray-700"
															: "text-indigo-600 hover:text-indigo-500 hover:bg-gray-100"
													}`}
												>
													{bccVisible ? "Hide Bcc" : "Add Bcc"}
												</button>
											</div>
										</div>

										{/* Cc field */}
										{ccVisible && (
											<div className="mb-3">
												<label
													htmlFor="cc"
													className={`block text-sm font-medium mb-2 ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Cc
												</label>
												<div className="mt-1">
													<input
														ref={ccInputRef}
														type="text"
														id="cc"
														value={cc}
														onChange={(e) => setCc(e.target.value)}
														onKeyDown={handleCcInput}
														className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md p-2.5 ${
															darkMode
																? "border-gray-600 bg-gray-700 text-white"
																: "border-gray-300 bg-white text-gray-900"
														}`}
														placeholder="cc@example.com"
													/>
												</div>
											</div>
										)}

										{/* Bcc field */}
										{bccVisible && (
											<div className="mb-3">
												<label
													htmlFor="bcc"
													className={`block text-sm font-medium mb-2 ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Bcc
												</label>
												<div className="mt-1">
													<input
														ref={bccInputRef}
														type="text"
														id="bcc"
														value={bcc}
														onChange={(e) => setBcc(e.target.value)}
														onKeyDown={handleBccInput}
														className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md p-2.5 ${
															darkMode
																? "border-gray-600 bg-gray-700 text-white"
																: "border-gray-300 bg-white text-gray-900"
														}`}
														placeholder="bcc@example.com"
													/>
												</div>
											</div>
										)}
									</div>

									{/* Subject field */}
									<div className="mb-5">
										<label
											htmlFor="subject"
											className={`block text-sm font-medium mb-2 ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Subject
										</label>
										<div className="mt-1">
											<input
												type="text"
												id="subject"
												value={subject}
												onChange={(e) => setSubject(e.target.value)}
												className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md p-2.5 ${
													darkMode
														? "border-gray-600 bg-gray-700 text-white"
														: "border-gray-300 bg-white text-gray-900"
												}`}
												placeholder="Email subject"
											/>
										</div>
									</div>

									{/* Message field */}
									<div className="mb-5">
										<div className="flex justify-between items-center mb-2">
											<label
												htmlFor="message"
												className={`block text-sm font-medium ${
													darkMode ? "text-gray-300" : "text-gray-700"
												}`}
											>
												Message
											</label>

											{/* Text formatting toolbar */}
											<div
												className={`flex items-center space-x-1 border rounded-md p-1 ${
													darkMode
														? "border-gray-700 bg-gray-750"
														: "border-gray-200 bg-gray-50"
												}`}
											>
												<button
													type="button"
													className={`p-1 rounded ${
														darkMode
															? "hover:bg-gray-700 text-gray-300"
															: "hover:bg-gray-200 text-gray-700"
													}`}
													title="Bold"
												>
													<LucideIcons.Bold className="h-4 w-4" />
												</button>
												<button
													type="button"
													className={`p-1 rounded ${
														darkMode
															? "hover:bg-gray-700 text-gray-300"
															: "hover:bg-gray-200 text-gray-700"
													}`}
													title="Italic"
												>
													<LucideIcons.Italic className="h-4 w-4" />
												</button>
												<button
													type="button"
													className={`p-1 rounded ${
														darkMode
															? "hover:bg-gray-700 text-gray-300"
															: "hover:bg-gray-200 text-gray-700"
													}`}
													title="Underline"
												>
													<LucideIcons.Underline className="h-4 w-4" />
												</button>
												<span
													className={`h-4 border-r mx-1 ${
														darkMode ? "border-gray-600" : "border-gray-300"
													}`}
												></span>
												<button
													type="button"
													className={`p-1 rounded ${
														darkMode
															? "hover:bg-gray-700 text-gray-300"
															: "hover:bg-gray-200 text-gray-700"
													}`}
													title="Bullet List"
												>
													<LucideIcons.List className="h-4 w-4" />
												</button>
												<button
													type="button"
													className={`p-1 rounded ${
														darkMode
															? "hover:bg-gray-700 text-gray-300"
															: "hover:bg-gray-200 text-gray-700"
													}`}
													title="Numbered List"
												>
													<LucideIcons.ListOrdered className="h-4 w-4" />
												</button>
												<span
													className={`h-4 border-r mx-1 ${
														darkMode ? "border-gray-600" : "border-gray-300"
													}`}
												></span>
												<button
													type="button"
													onClick={toggleEncryptedPreview}
													className={`p-1 rounded flex items-center ${
														showEncryptedPreview
															? darkMode
																? "bg-green-900 text-green-300"
																: "bg-green-100 text-green-700"
															: darkMode
															? "hover:bg-gray-700 text-gray-300"
															: "hover:bg-gray-200 text-gray-700"
													}`}
													title={
														showEncryptedPreview
															? "Show normal view"
															: "Show encrypted view"
													}
												>
													{showEncryptedPreview ? (
														<>
															<LucideIcons.Eye className="h-4 w-4 mr-1" />
															<span className="text-xs font-medium">
																Preview
															</span>
														</>
													) : (
														<>
															<LucideIcons.Lock className="h-4 w-4 mr-1" />
															<span className="text-xs font-medium">
																Encrypted
															</span>
														</>
													)}
												</button>
											</div>
										</div>

										<div className="relative">
											<textarea
												id="message"
												rows={12}
												value={
													showEncryptedPreview
														? "-----BEGIN ENCRYPTED MESSAGE-----\nA4tB9wZ2EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8\nEpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2\nLx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2EpQmFs8K7\nA4tB9wZ2EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8\nPzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVd\n-----END ENCRYPTED MESSAGE-----"
														: message
												}
												onChange={(e) => setMessage(e.target.value)}
												className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md p-3 ${
													showEncryptedPreview
														? darkMode
															? "font-mono text-green-400 bg-gray-900 border-gray-700"
															: "font-mono text-green-600 bg-gray-100 border-gray-300"
														: darkMode
														? "bg-gray-700 text-white border-gray-600"
														: "bg-white text-gray-900 border-gray-300"
												}`}
												placeholder="Write your message here..."
												disabled={showEncryptedPreview}
											/>
										</div>
										<p
											className={`mt-2 text-xs flex items-center ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{isEncrypted ? (
												<>
													<LucideIcons.Lock className="inline-block h-3.5 w-3.5 mr-1 text-green-500" />
													This message will be encrypted end-to-end and can only
													be read by the recipient.
												</>
											) : (
												<>
													<LucideIcons.AlertTriangle className="inline-block h-3.5 w-3.5 mr-1 text-amber-500" />
													Warning: This message will NOT be encrypted.
												</>
											)}
										</p>
									</div>
								</div>

								{/* Attachments section */}
								<div
									className={`px-6 py-5 ${
										darkMode ? "bg-gray-750" : "bg-gray-50"
									} border-y ${
										darkMode ? "border-gray-700" : "border-gray-200"
									}`}
								>
									<div className="flex items-center justify-between mb-3">
										<h3
											className={`text-sm font-semibold ${
												darkMode ? "text-gray-200" : "text-gray-700"
											}`}
										>
											Attachments{" "}
											{attachments.length > 0 ? `(${attachments.length})` : ""}
										</h3>
										<button
											type="button"
											onClick={() => fileInputRef.current?.click()}
											className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
										>
											<LucideIcons.Paperclip className="mr-1.5 h-4 w-4" />
											Attach Files
										</button>
										<input
											type="file"
											ref={fileInputRef}
											onChange={handleFileChange}
											className="hidden"
											multiple
										/>
									</div>

									{attachments.length === 0 ? (
										<div
											className={`border-2 border-dashed rounded-lg p-6 text-center ${
												darkMode
													? "border-gray-600 text-gray-400 hover:bg-gray-700/50 hover:border-gray-500"
													: "border-gray-300 text-gray-500 hover:bg-gray-100 hover:border-gray-400"
											} transition-colors duration-200 cursor-pointer`}
											onClick={() => fileInputRef.current?.click()}
										>
											<LucideIcons.Upload className="mx-auto h-8 w-8 mb-2 text-gray-400" />
											<p className="text-sm font-medium">
												Drag and drop files here, or click to browse
											</p>
											<p className="text-xs mt-1">
												{isEncrypted
													? "Files will be encrypted before sending"
													: "Warning: Files will not be encrypted"}
											</p>
										</div>
									) : (
										<div className="mt-2 space-y-2 max-h-48 overflow-y-auto p-1">
											{attachments.map((file, index) => (
												<div
													key={index}
													className={`flex items-center justify-between rounded-md p-2.5 border ${
														darkMode
															? "bg-gray-800 border-gray-700 hover:bg-gray-700"
															: "bg-white border-gray-200 hover:bg-gray-50"
													} transition-colors duration-150`}
												>
													<div className="flex items-center space-x-3 overflow-hidden">
														<div
															className={`h-10 w-10 rounded flex items-center justify-center flex-shrink-0 ${
																darkMode
																	? "bg-indigo-900 text-indigo-300"
																	: "bg-indigo-100 text-indigo-600"
															}`}
														>
															<LucideIcons.File className="h-5 w-5" />
														</div>
														<div className="min-w-0">
															<p
																className={`text-sm truncate font-medium ${
																	darkMode ? "text-gray-200" : "text-gray-700"
																}`}
															>
																{file.name}
															</p>
															<div className="flex items-center">
																<span
																	className={`text-xs flex-shrink-0 ${
																		darkMode ? "text-gray-400" : "text-gray-500"
																	}`}
																>
																	{formatFileSize(file.size)}
																</span>
																{isEncrypted && (
																	<span
																		className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
																			darkMode
																				? "bg-green-900 text-green-200"
																				: "bg-green-100 text-green-800"
																		}`}
																	>
																		<LucideIcons.Lock className="mr-0.5 h-3 w-3" />
																		Encrypted
																	</span>
																)}
															</div>
														</div>
													</div>
													<button
														type="button"
														onClick={() => removeAttachment(index)}
														className={`ml-2 p-1.5 rounded-full transition-colors duration-200 ${
															darkMode
																? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
																: "text-gray-400 hover:text-gray-500 hover:bg-gray-200"
														}`}
													>
														<LucideIcons.X className="h-4 w-4" />
													</button>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Security options section */}
								<div
									className={`px-6 py-5 ${
										darkMode ? "bg-gray-800" : "bg-white"
									}`}
								>
									<div className="flex items-center justify-between mb-4">
										<h3
											className={`text-base font-semibold ${
												darkMode ? "text-gray-200" : "text-gray-700"
											}`}
										>
											Security Options
										</h3>
										<button
											type="button"
											className={`text-xs font-medium flex items-center px-2.5 py-1.5 rounded ${
												darkMode
													? "text-indigo-400 hover:text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50"
													: "text-indigo-600 hover:text-indigo-500 bg-indigo-50 hover:bg-indigo-100"
											}`}
										>
											<LucideIcons.Shield className="mr-1 h-3.5 w-3.5" />
											Apply Security Template
										</button>
									</div>

									{/* Security options grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
										{/* Left column */}
										<div className="space-y-5">
											{/* Encryption toggle */}
											<div
												className={`rounded-lg border p-4 ${
													isEncrypted
														? darkMode
															? "bg-green-900/20 border-green-800"
															: "bg-green-50 border-green-200"
														: darkMode
														? "bg-yellow-900/20 border-yellow-800"
														: "bg-yellow-50 border-yellow-200"
												}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														{isEncrypted ? (
															<LucideIcons.Lock
																className={`h-5 w-5 mr-3 ${
																	darkMode ? "text-green-400" : "text-green-600"
																}`}
															/>
														) : (
															<LucideIcons.Unlock
																className={`h-5 w-5 mr-3 ${
																	darkMode
																		? "text-yellow-400"
																		: "text-yellow-600"
																}`}
															/>
														)}
														<span
															className={`text-sm font-medium ${
																isEncrypted
																	? darkMode
																		? "text-green-300"
																		: "text-green-700"
																	: darkMode
																	? "text-yellow-300"
																	: "text-yellow-700"
															}`}
														>
															End-to-End Encryption
														</span>
													</div>
													<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
														<input
															type="checkbox"
															name="toggle-encryption"
															id="toggle-encryption"
															checked={isEncrypted}
															onChange={() => setIsEncrypted(!isEncrypted)}
															className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																darkMode
																	? "bg-gray-300 border-gray-600"
																	: "bg-white border-gray-300"
															}`}
														/>
														<label
															htmlFor="toggle-encryption"
															className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
																isEncrypted
																	? "bg-green-600"
																	: darkMode
																	? "bg-gray-600"
																	: "bg-gray-300"
															}`}
														></label>
													</div>
												</div>
												<p
													className={`mt-2 text-xs ${
														isEncrypted
															? darkMode
																? "text-green-400"
																: "text-green-600"
															: darkMode
															? "text-yellow-400"
															: "text-yellow-600"
													}`}
												>
													{isEncrypted
														? "This message will be encrypted and can only be read by the recipient."
														: "Warning: This message will NOT be encrypted and can be read by others."}
												</p>
											</div>

											{/* Encryption level (only if encryption is enabled) */}
											{isEncrypted && (
												<div
													className={`rounded-lg border p-4 ${
														darkMode
															? "bg-gray-750 border-gray-700"
															: "bg-gray-50 border-gray-200"
													}`}
												>
													<label
														className={`text-sm font-medium block mb-3 ${
															darkMode ? "text-gray-200" : "text-gray-700"
														}`}
													>
														Encryption Level
													</label>
													<div className="flex items-center space-x-4">
														<div className="flex items-center">
															<input
																id="encryption-standard"
																name="encryption-level"
																type="radio"
																checked={encryptionLevel === "standard"}
																onChange={() => setEncryptionLevel("standard")}
																className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 ${
																	darkMode
																		? "border-gray-600"
																		: "border-gray-300"
																}`}
															/>
															<label
																htmlFor="encryption-standard"
																className={`ml-2 block text-sm ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Standard (AES-256)
															</label>
														</div>
														<div className="flex items-center">
															<input
																id="encryption-high"
																name="encryption-level"
																type="radio"
																checked={encryptionLevel === "high"}
																onChange={() => setEncryptionLevel("high")}
																className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 ${
																	darkMode
																		? "border-gray-600"
																		: "border-gray-300"
																}`}
															/>
															<label
																htmlFor="encryption-high"
																className={`ml-2 block text-sm ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																High (AES-256 + ChaCha20)
															</label>
														</div>
													</div>
													<div
														className={`mt-2 text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														High encryption provides additional security but may
														not be supported by all recipients.
													</div>
												</div>
											)}

											{/* Password protection */}
											<div
												className={`rounded-lg border p-4 ${
													passwordProtected
														? darkMode
															? "bg-purple-900/20 border-purple-800"
															: "bg-purple-50 border-purple-200"
														: darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-gray-50 border-gray-200"
												}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<LucideIcons.KeySquare
															className={`h-5 w-5 mr-3 ${
																passwordProtected
																	? darkMode
																		? "text-purple-400"
																		: "text-purple-600"
																	: darkMode
																	? "text-gray-400"
																	: "text-gray-500"
															}`}
														/>
														<span
															className={`text-sm font-medium ${
																passwordProtected
																	? darkMode
																		? "text-purple-300"
																		: "text-purple-700"
																	: darkMode
																	? "text-gray-300"
																	: "text-gray-700"
															}`}
														>
															Password Protection
														</span>
													</div>
													<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
														<input
															type="checkbox"
															name="toggle-password"
															id="toggle-password"
															checked={passwordProtected}
															onChange={() =>
																setPasswordProtected(!passwordProtected)
															}
															className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																darkMode
																	? "bg-gray-300 border-gray-600"
																	: "bg-white border-gray-300"
															}`}
														/>
														<label
															htmlFor="toggle-password"
															className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
																passwordProtected
																	? "bg-purple-600"
																	: darkMode
																	? "bg-gray-600"
																	: "bg-gray-300"
															}`}
														></label>
													</div>
												</div>
												<p
													className={`mt-2 text-xs ${
														passwordProtected
															? darkMode
																? "text-purple-400"
																: "text-purple-600"
															: darkMode
															? "text-gray-400"
															: "text-gray-500"
													}`}
												>
													Require a password to view this message, even if the
													recipient doesn't use SecureEmail.
												</p>

												{/* Password and hint fields (only if password protection is enabled) */}
												{passwordProtected && (
													<div className="mt-3 space-y-3">
														<div>
															<label
																htmlFor="password"
																className={`block text-xs font-medium mb-1 ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Password
															</label>
															<div className="relative rounded-md shadow-sm">
																<input
																	type="password"
																	id="password"
																	value={password}
																	onChange={(e) => setPassword(e.target.value)}
																	className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md pr-10 p-2 ${
																		darkMode
																			? "border-gray-600 bg-gray-700 text-white"
																			: "border-gray-300 bg-white text-gray-900"
																	}`}
																	placeholder="Enter a password"
																/>
																<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
																	<LucideIcons.KeySquare className="h-5 w-5 text-gray-400" />
																</div>
															</div>
														</div>
														<div>
															<label
																htmlFor="password-hint"
																className={`block text-xs font-medium mb-1 ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Password Hint (Optional)
															</label>
															<div className="mt-1">
																<input
																	type="text"
																	id="password-hint"
																	value={passwordHint}
																	onChange={(e) =>
																		setPasswordHint(e.target.value)
																	}
																	className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md p-2 ${
																		darkMode
																			? "border-gray-600 bg-gray-700 text-white"
																			: "border-gray-300 bg-white text-gray-900"
																	}`}
																	placeholder="Enter a hint for the recipient"
																/>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* Right column */}
										<div className="space-y-5">
											{/* Expiration setting */}
											<div
												className={`rounded-lg border p-4 ${
													expiresAt
														? darkMode
															? "bg-blue-900/20 border-blue-800"
															: "bg-blue-50 border-blue-200"
														: darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-gray-50 border-gray-200"
												}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<LucideIcons.Clock
															className={`h-5 w-5 mr-3 ${
																expiresAt
																	? darkMode
																		? "text-blue-400"
																		: "text-blue-600"
																	: darkMode
																	? "text-gray-400"
																	: "text-gray-500"
															}`}
														/>
														<span
															className={`text-sm font-medium ${
																expiresAt
																	? darkMode
																		? "text-blue-300"
																		: "text-blue-700"
																	: darkMode
																	? "text-gray-300"
																	: "text-gray-700"
															}`}
														>
															Message Expiration
														</span>
													</div>
													<select
														value={expiresAt}
														onChange={handleExpiryChange}
														className={`block rounded-md border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
															darkMode
																? "border-gray-600 bg-gray-700 text-white"
																: "border-gray-300 bg-white text-gray-900"
														}`}
													>
														<option value="">Never expires</option>
														<option value="1h">1 Hour</option>
														<option value="24h">24 Hours</option>
														<option value="7d">7 Days</option>
														<option value="30d">30 Days</option>
														<option value="custom">Custom...</option>
													</select>
												</div>
												<p
													className={`mt-2 text-xs ${
														expiresAt
															? darkMode
																? "text-blue-400"
																: "text-blue-600"
															: darkMode
															? "text-gray-400"
															: "text-gray-500"
													}`}
												>
													{expiresAt
														? "This message will self-destruct after the specified time."
														: "This message will not expire automatically."}
												</p>

												{/* Custom expiry time (only shown when "Custom" is selected) */}
												{showCustomExpiry && (
													<div className="mt-3">
														<div className="flex items-center space-x-3">
															<input
																type="number"
																value={customExpiryTime}
																onChange={handleCustomExpiryChange}
																min="1"
																className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border rounded-md p-2 ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																placeholder="1"
															/>
															<select
																className={`block rounded-md border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																defaultValue="days"
															>
																<option value="minutes">Minutes</option>
																<option value="hours">Hours</option>
																<option value="days">Days</option>
																<option value="weeks">Weeks</option>
															</select>
														</div>
													</div>
												)}
											</div>

											{/* Read receipt */}
											<div
												className={`rounded-lg border p-4 ${
													readReceipt
														? darkMode
															? "bg-amber-900/20 border-amber-800"
															: "bg-amber-50 border-amber-200"
														: darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-gray-50 border-gray-200"
												}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<LucideIcons.Eye
															className={`h-5 w-5 mr-3 ${
																readReceipt
																	? darkMode
																		? "text-amber-400"
																		: "text-amber-600"
																	: darkMode
																	? "text-gray-400"
																	: "text-gray-500"
															}`}
														/>
														<span
															className={`text-sm font-medium ${
																readReceipt
																	? darkMode
																		? "text-amber-300"
																		: "text-amber-700"
																	: darkMode
																	? "text-gray-300"
																	: "text-gray-700"
															}`}
														>
															Read Receipt
														</span>
													</div>
													<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
														<input
															type="checkbox"
															name="toggle-read-receipt"
															id="toggle-read-receipt"
															checked={readReceipt}
															onChange={() => setReadReceipt(!readReceipt)}
															className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																darkMode
																	? "bg-gray-300 border-gray-600"
																	: "bg-white border-gray-300"
															}`}
														/>
														<label
															htmlFor="toggle-read-receipt"
															className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
																readReceipt
																	? "bg-amber-600"
																	: darkMode
																	? "bg-gray-600"
																	: "bg-gray-300"
															}`}
														></label>
													</div>
												</div>
												<p
													className={`mt-2 text-xs ${
														readReceipt
															? darkMode
																? "text-amber-400"
																: "text-amber-600"
															: darkMode
															? "text-gray-400"
															: "text-gray-500"
													}`}
												>
													Get notified when your message is read by the
													recipient.
												</p>
											</div>

											{/* Additional security options */}
											<div
												className={`rounded-lg border p-4 ${
													darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-gray-50 border-gray-200"
												}`}
											>
												<h4
													className={`text-sm font-medium mb-3 ${
														darkMode ? "text-gray-200" : "text-gray-700"
													}`}
												>
													Additional Security
												</h4>
												<div className="space-y-3">
													<div className="flex items-center">
														<input
															id="prevent-forwarding"
															name="prevent-forwarding"
															type="checkbox"
															className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded ${
																darkMode ? "border-gray-600" : "border-gray-300"
															}`}
														/>
														<label
															htmlFor="prevent-forwarding"
															className={`ml-2 block text-sm ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															Prevent forwarding
														</label>
													</div>
													<div className="flex items-center">
														<input
															id="disable-copy"
															name="disable-copy"
															type="checkbox"
															className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded ${
																darkMode ? "border-gray-600" : "border-gray-300"
															}`}
														/>
														<label
															htmlFor="disable-copy"
															className={`ml-2 block text-sm ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															Disable copy & paste
														</label>
													</div>
													<div className="flex items-center">
														<input
															id="no-screenshots"
															name="no-screenshots"
															type="checkbox"
															className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded ${
																darkMode ? "border-gray-600" : "border-gray-300"
															}`}
														/>
														<label
															htmlFor="no-screenshots"
															className={`ml-2 block text-sm ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															Prevent screenshots
														</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>

						{/* Footer actions */}
						<div
							className={`px-6 py-4 rounded-b-lg flex items-center justify-between border-t ${
								darkMode
									? "bg-gray-750 border-gray-700"
									: "bg-gray-50 border-gray-200"
							}`}
						>
							<div className="flex items-center space-x-2 flex-wrap">
								{isEncrypted ? (
									<span
										className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
											darkMode
												? "bg-green-900 text-green-200"
												: "bg-green-100 text-green-800"
										}`}
									>
										<LucideIcons.Lock className="mr-1 h-3 w-3" />
										Encrypted
									</span>
								) : (
									<span
										className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
											darkMode
												? "bg-yellow-900 text-yellow-200"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										<LucideIcons.AlertTriangle className="mr-1 h-3 w-3" />
										Unencrypted
									</span>
								)}

								{passwordProtected && (
									<span
										className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
											darkMode
												? "bg-purple-900 text-purple-200"
												: "bg-purple-100 text-purple-800"
										}`}
									>
										<LucideIcons.KeySquare className="mr-1 h-3 w-3" />
										Password Protected
									</span>
								)}

								{expiresAt && (
									<span
										className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
											darkMode
												? "bg-blue-900 text-blue-200"
												: "bg-blue-100 text-blue-800"
										}`}
									>
										<LucideIcons.Clock className="mr-1 h-3 w-3" />
										{expiresAt === "1h"
											? "Expires: 1 Hour"
											: expiresAt === "24h"
											? "Expires: 24 Hours"
											: expiresAt === "7d"
											? "Expires: 7 Days"
											: expiresAt === "30d"
											? "Expires: 30 Days"
											: expiresAt === "custom"
											? `Expires: ${customExpiryTime || "Custom"}`
											: "Expires: Custom"}
									</span>
								)}

								{readReceipt && (
									<span
										className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
											darkMode
												? "bg-amber-900 text-amber-200"
												: "bg-amber-100 text-amber-800"
										}`}
									>
										<LucideIcons.Eye className="mr-1 h-3 w-3" />
										Read Receipt
									</span>
								)}
							</div>

							<div className="flex space-x-3">
								<div className="flex items-center space-x-2">
									<button
										type="button"
										onClick={() => handleSaveAsDraft()}
										disabled={draftSaving}
										className={`inline-flex items-center px-3.5 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
											darkMode
												? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
												: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
										} ${draftSaving ? "opacity-70 cursor-not-allowed" : ""}`}
									>
										{draftSaving ? (
											<>
												<svg
													className="animate-spin h-4 w-4 mr-2 text-gray-500"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Saving...
											</>
										) : (
											<>
												<LucideIcons.Save className="mr-2 h-4 w-4" />
												Save Draft
											</>
										)}
									</button>
									<button
										type="button"
										onClick={onClose}
										className={`inline-flex items-center px-3.5 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
											darkMode
												? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
												: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
										}`}
									>
										<LucideIcons.X className="mr-2 h-4 w-4" />
										Cancel
									</button>
								</div>
								<button
									type="submit"
									onClick={handleSubmit}
									disabled={isSending}
									className={`inline-flex items-center px-5 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
										isSending ? "opacity-70 cursor-not-allowed" : ""
									}`}
								>
									{isSending ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Sending...
										</>
									) : (
										<>
											<LucideIcons.Send className="mr-2 h-4 w-4" />
											Send Secure Email
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Minimized compose button */}
			{isMinimized && (
				<div
					ref={minimizedRef}
					className="fixed bottom-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg shadow-lg cursor-pointer z-50 flex items-center space-x-3 pr-4"
					onClick={() => setIsMinimized(false)}
				>
					<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
						<LucideIcons.PenSquare className="h-5 w-5" />
					</div>
					<div className="flex flex-col">
						<span className="font-medium text-sm">New Message</span>
						<span className="text-xs text-white/80 truncate max-w-[150px]">
							{subject || "No subject"}
						</span>
					</div>
					<div className="ml-2 flex-shrink-0 bg-white/20 rounded-full h-2 w-2 animate-pulse"></div>
				</div>
			)}

			{/* Add New Key Modal */}
			{showAddKeyModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
					<div
						className={`w-full max-w-md rounded-lg shadow-xl overflow-hidden ${
							darkMode ? "bg-gray-800" : "bg-white"
						}`}
					>
						{/* Modal header */}
						<div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-bold text-white flex items-center">
									<LucideIcons.Key className="mr-2 h-5 w-5" />
									Generate New Encryption Key
								</h3>
								<button
									onClick={() => setShowAddKeyModal(false)}
									className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none p-1.5 rounded-md hover:bg-white/20"
								>
									<LucideIcons.X className="h-5 w-5" />
								</button>
							</div>
						</div>

						{/* Modal body */}
						<div className="p-6">
							<div
								className={`p-4 mb-5 rounded-lg border ${
									darkMode
										? "bg-indigo-900/20 border-indigo-800"
										: "bg-indigo-50 border-indigo-100"
								}`}
							>
								<div className="flex">
									<div className="flex-shrink-0">
										<LucideIcons.Info
											className={`h-5 w-5 ${
												darkMode ? "text-indigo-400" : "text-indigo-600"
											}`}
										/>
									</div>
									<div className="ml-3">
										<p
											className={`text-sm ${
												darkMode ? "text-indigo-300" : "text-indigo-700"
											}`}
										>
											Encryption keys are used to secure your emails. Larger
											keys provide more security but may be slower to process.
										</p>
									</div>
								</div>
							</div>

							<form onSubmit={handleGenerateNewKey} className="space-y-5">
								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Key Name
									</label>
									<input
										type="text"
										value={newKeyName}
										onChange={(e) => setNewKeyName(e.target.value)}
										placeholder="e.g. Personal Key, Work Key"
										className={`w-full p-2.5 border rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "bg-white border-gray-300 text-gray-900"
										} focus:ring-indigo-500 focus:border-indigo-500`}
										required
									/>
								</div>

								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Key Size
									</label>
									<select
										value={newKeyBits}
										onChange={(e) => setNewKeyBits(e.target.value)}
										className={`w-full p-2.5 border rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "bg-white border-gray-300 text-gray-900"
										} focus:ring-indigo-500 focus:border-indigo-500`}
									>
										<option value="2048">2048-bit RSA</option>
										<option value="3072">3072-bit RSA</option>
										<option value="4096">4096-bit RSA (Recommended)</option>
									</select>
									<p
										className={`mt-1 text-xs ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										4096-bit keys offer the strongest security and are
										recommended for most users.
									</p>
								</div>

								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Key Expiration
									</label>
									<select
										className={`w-full p-2.5 border rounded-md ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "bg-white border-gray-300 text-gray-900"
										} focus:ring-indigo-500 focus:border-indigo-500`}
										defaultValue="never"
									>
										<option value="never">Never expires</option>
										<option value="6months">6 months</option>
										<option value="1year">1 year</option>
										<option value="2years">2 years</option>
									</select>
								</div>
							</form>
						</div>

						{/* Modal footer */}
						<div
							className={`px-6 py-4 border-t flex justify-end space-x-3 ${
								darkMode
									? "border-gray-700 bg-gray-750"
									: "border-gray-200 bg-gray-50"
							}`}
						>
							<button
								type="button"
								onClick={() => setShowAddKeyModal(false)}
								className={`px-4 py-2 border rounded-md text-sm font-medium ${
									darkMode
										? "border-gray-600 text-gray-300 hover:bg-gray-700"
										: "border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}
							>
								Cancel
							</button>
							<button
								type="submit"
								onClick={handleGenerateNewKey}
								disabled={isGeneratingKey}
								className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-sm font-medium shadow-sm ${
									isGeneratingKey ? "opacity-70 cursor-not-allowed" : ""
								}`}
							>
								{isGeneratingKey ? (
									<>
										<svg
											className="animate-spin inline-block h-4 w-4 mr-2 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Generating Key...
									</>
								) : (
									<>
										<LucideIcons.Key className="inline-block h-4 w-4 mr-2" />
										Generate Key
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Add custom CSS for toggle switch */}
			<style jsx>{`
				.toggle-checkbox:checked {
					transform: translateX(1.5rem);
				}
				.toggle-checkbox:checked + .toggle-label {
					background-color: #4f46e5;
				}
			`}</style>
		</>
	);
}

// Enhanced ViewEmail Component
function ViewEmail({
	user,
	darkMode,
}: {
	user: User | null;
	darkMode: boolean;
}) {
	const navigate = useNavigate();
	const { id } = useParams();
	const [email, setEmail] = useState<Email | null>(null);
	const [isDecrypted, setIsDecrypted] = useState(false);
	const [password, setPassword] = useState("");
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [isLoadingEmail, setIsLoadingEmail] = useState(true);
	const [showEncryptedContent, setShowEncryptedContent] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [replyMessage, setReplyMessage] = useState("");
	const [showForwardBox, setShowForwardBox] = useState(false);
	const [forwardRecipient, setForwardRecipient] = useState("");
	const [forwardMessage, setForwardMessage] = useState("");

	// Animation for email view
	const emailViewAnimation = useSpring({
		from: { opacity: 0, transform: "translateY(20px)" },
		to: { opacity: 1, transform: "translateY(0)" },
		config: { tension: 280, friction: 24 },
	});

	// Fetch email data
	useEffect(() => {
		// Simulate API call to fetch email
		setTimeout(() => {
			// This is mock data, in a real app, you'd fetch from an API
			const mockEmail: Email = {
				id: "1",
				from: "john.doe@example.com",
				to: [user?.email || "you@example.com"],
				subject: "Welcome to SecureEmail!",
				body: "Thank you for joining SecureEmail. We are excited to have you on board. This is a secure platform for all your email communication needs.\n\nWith SecureEmail, you can send end-to-end encrypted emails to anyone, even if they don't use our service. Your data is protected with military-grade encryption, ensuring that only you and your intended recipients can read your messages.\n\nSome key features include:\n- End-to-end encryption\n- Self-destructing messages\n- Password protection\n- Encrypted attachments\n\nIf you have any questions, feel free to reply to this email or contact our support team.\n\nBest regards,\nThe SecureEmail Team",
				attachments: [
					{
						id: "att1",
						name: "getting-started.pdf",
						type: "application/pdf",
						size: 2500000,
						url: "#",
						isEncrypted: true,
					},
				],
				isEncrypted: true,
				encryptionLevel: "high",
				timestamp: new Date(Date.now() - 3600000), // 1 hour ago
				read: true,
				starred: true,
				folder: "inbox",
				expiresAt: new Date(Date.now() + 604800000), // 7 days from now
				readReceipt: true,
				passwordProtected: true,
				passwordHint: "The name of our service (lowercase)",
				labels: ["2"],
			};

			setEmail(mockEmail);
			setIsLoadingEmail(false);

			// If email is password protected, show password modal
			if (mockEmail.passwordProtected) {
				setShowPasswordModal(true);
			} else {
				setIsDecrypted(true);
			}

			// Prepare forward message
			setForwardMessage(
				`\n\n---------- Forwarded message ----------\nFrom: ${
					mockEmail.from
				}\nDate: ${mockEmail.timestamp.toLocaleString()}\nSubject: ${
					mockEmail.subject
				}\nTo: ${mockEmail.to.join(", ")}\n\n${mockEmail.body}`
			);
		}, 1000);
	}, [id, user]);

	// Handle password submission
	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!password) {
			toast.error("Password is required");
			return;
		}

		// For demo, just check if password is "secureemail" (the hint says "name of our service lowercase")
		if (password.toLowerCase() === "secureemail") {
			setIsDecrypted(true);
			setShowPasswordModal(false);
			toast.success("Email decrypted successfully");
		} else {
			toast.error("Incorrect password. Please try again.");
		}
	};

	// Handle reply submission
	const handleReplySubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!replyMessage.trim()) {
			toast.error("Reply message is required");
			return;
		}

		toast.success("Reply sent securely");
		setShowReplyBox(false);
		setReplyMessage("");
	};

	// Handle forward submission
	const handleForwardSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!forwardRecipient.trim()) {
			toast.error("Recipient is required");
			return;
		}

		toast.success("Email forwarded securely");
		setShowForwardBox(false);
	};

	// Format date for display
	const formatDate = (date: Date) => {
		return date.toLocaleString(undefined, {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Format expiration date
	const formatExpirationDate = (date: Date) => {
		const now = new Date();
		const diff = date.getTime() - now.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

		if (days > 0) {
			return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${
				hours > 1 ? "s" : ""
			}`;
		} else {
			return `${hours} hour${hours > 1 ? "s" : ""}`;
		}
	};

	// Format file size
	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + " B";
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
		else return (bytes / 1048576).toFixed(1) + " MB";
	};

	// Handle download
	const handleDownload = (attachmentId: string) => {
		setIsDownloading(true);

		// Simulate download
		setTimeout(() => {
			toast.success("File downloaded securely");
			setIsDownloading(false);
		}, 1500);
	};

	return (
		<div
			className={`min-h-screen flex flex-col ${
				darkMode ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			{/* Header */}
			<header className={`shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16">
					<div className="flex items-center">
						<button
							onClick={() => navigate("/dashboard")}
							className={`inline-flex items-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200 ${
								darkMode
									? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
									: "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
							}`}
						>
							<LucideIcons.ArrowLeft className="h-6 w-6" />
						</button>
						<span
							className={`ml-2 text-xl font-semibold flex items-center ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							<LucideIcons.Mail
								className={`mr-2 h-5 w-5 ${
									darkMode ? "text-indigo-400" : "text-indigo-600"
								}`}
							/>
							View Email
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={() => navigate("/dashboard")}
							className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
								darkMode
									? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
									: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
							}`}
						>
							<LucideIcons.Inbox className="mr-1.5 h-5 w-5" />
							Back to Inbox
						</button>
					</div>
				</div>
			</header>

			{/* Email content */}
			<main className="flex-1 py-6">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					{isLoadingEmail ? (
						<div
							className={`shadow-lg rounded-lg p-6 flex justify-center items-center h-96 ${
								darkMode ? "bg-gray-800" : "bg-white"
							}`}
						>
							<div className="text-center">
								<div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
								<h2
									className={`text-xl font-medium ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Loading email...
								</h2>
								<p
									className={`mt-1 text-sm ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Please wait while we retrieve your secure message
								</p>
							</div>
						</div>
					) : email ? (
						<animated.div style={emailViewAnimation}>
							<div
								className={`shadow-lg rounded-lg overflow-hidden ${
									darkMode ? "bg-gray-800" : "bg-white"
								}`}
							>
								{/* Email header */}
								<div
									className={`px-6 py-4 border-b ${
										darkMode
											? "border-gray-700 bg-gray-750"
											: "border-gray-200 bg-gray-50"
									}`}
								>
									<div className="flex justify-between items-start">
										<h1
											className={`text-xl font-bold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											{email.subject}
										</h1>
										<div className="flex space-x-2">
											<button
												className={`transition-colors duration-200 ${
													darkMode
														? "text-gray-400 hover:text-gray-300"
														: "text-gray-400 hover:text-gray-500"
												}`}
											>
												<LucideIcons.Star
													className={`h-5 w-5 ${
														email.starred ? "text-yellow-500 fill-current" : ""
													}`}
												/>
											</button>
											<button
												className={`transition-colors duration-200 ${
													darkMode
														? "text-gray-400 hover:text-gray-300"
														: "text-gray-400 hover:text-gray-500"
												}`}
											>
												<LucideIcons.MoreHorizontal className="h-5 w-5" />
											</button>
										</div>
									</div>

									<div className="mt-4 flex flex-col sm:flex-row sm:items-start">
										<div className="flex-shrink-0 mb-3 sm:mb-0">
											<div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white uppercase shadow-sm">
												{email.from.split("@")[0].charAt(0)}
											</div>
										</div>
										<div className="sm:ml-4 flex-1">
											<div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
												<div>
													<p
														className={`text-base font-medium ${
															darkMode ? "text-white" : "text-gray-900"
														}`}
													>
														{email.from}
													</p>
													<p
														className={`text-sm ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														To: {email.to.join(", ")}
													</p>
												</div>
												<div
													className={`mt-2 sm:mt-0 text-sm ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													{formatDate(email.timestamp)}
												</div>
											</div>

											{/* Labels */}
											{email.labels && email.labels.length > 0 && (
												<div className="mt-2 flex flex-wrap gap-1.5">
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
															darkMode
																? "bg-green-900 bg-opacity-50 text-green-300"
																: "bg-green-100 text-green-800"
														}`}
													>
														Personal
													</span>
												</div>
											)}
										</div>
									</div>

									{/* Security badges */}
									<div className="mt-4 flex flex-wrap gap-2">
										{email.isEncrypted && (
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													isDecrypted
														? darkMode
															? "bg-green-900 text-green-200"
															: "bg-green-100 text-green-800"
														: darkMode
														? "bg-yellow-900 text-yellow-200"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												<LucideIcons.Lock className="mr-1 h-3 w-3" />
												{isDecrypted ? "Decrypted" : "Encrypted"}
											</span>
										)}
										{email.encryptionLevel === "high" && (
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													darkMode
														? "bg-indigo-900 text-indigo-200"
														: "bg-indigo-100 text-indigo-800"
												}`}
											>
												<LucideIcons.Shield className="mr-1 h-3 w-3" />
												High Encryption
											</span>
										)}
										{email.passwordProtected && (
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													darkMode
														? "bg-purple-900 text-purple-200"
														: "bg-purple-100 text-purple-800"
												}`}
											>
												<LucideIcons.KeySquare className="mr-1 h-3 w-3" />
												Password Protected
											</span>
										)}
										{email.expiresAt && (
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													darkMode
														? "bg-blue-900 text-blue-200"
														: "bg-blue-100 text-blue-800"
												}`}
											>
												<LucideIcons.Clock className="mr-1 h-3 w-3" />
												Expires in {formatExpirationDate(email.expiresAt)}
											</span>
										)}
										{email.readReceipt && (
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													darkMode
														? "bg-amber-900 text-amber-200"
														: "bg-amber-100 text-amber-800"
												}`}
											>
												<LucideIcons.Eye className="mr-1 h-3 w-3" />
												Read Receipt
											</span>
										)}
									</div>
								</div>

								{/* Email body */}
								<div className="px-6 py-6">
									{isDecrypted ? (
										<>
											{/* Decrypted content */}
											<div className="prose max-w-none">
												{email.body.split("\n\n").map((paragraph, index) => (
													<p
														key={index}
														className={`mb-4 ${
															darkMode ? "text-gray-300" : "text-gray-700"
														}`}
													>
														{paragraph}
													</p>
												))}
											</div>

											{/* View encrypted version button */}
											<div className="mt-6 flex justify-end">
												<button
													onClick={() =>
														setShowEncryptedContent(!showEncryptedContent)
													}
													className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
														darkMode
															? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
															: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
													}`}
												>
													{showEncryptedContent ? (
														<>
															<LucideIcons.EyeOff className="mr-1.5 h-4 w-4" />
															Hide Encrypted Version
														</>
													) : (
														<>
															<LucideIcons.Eye className="mr-1.5 h-4 w-4" />
															View Encrypted Version
														</>
													)}
												</button>
											</div>

											{/* Encrypted content preview */}
											{showEncryptedContent && (
												<div
													className={`mt-4 p-4 rounded-md ${
														darkMode ? "bg-gray-900" : "bg-gray-100"
													}`}
												>
													<div className="flex justify-between items-center mb-2">
														<h3
															className={`text-sm font-medium ${
																darkMode ? "text-white" : "text-gray-900"
															}`}
														>
															Encrypted Content
														</h3>
														<span
															className={`text-xs ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															{email.encryptionLevel === "high"
																? "AES-256 + ChaCha20"
																: "AES-256"}
														</span>
													</div>
													<pre
														className={`font-mono text-xs whitespace-pre-wrap break-all overflow-auto max-h-60 p-3 rounded ${
															darkMode
																? "text-green-400 bg-black bg-opacity-30"
																: "text-green-600 bg-black bg-opacity-5"
														}`}
													>
														{`-----BEGIN ENCRYPTED MESSAGE-----
A4tB9wZ2EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8
EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2
Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2EpQmFs8K7
TbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2EpQmFs8K7Lx1Dj3H6Y9o0vRn
A4tB9wZ2EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8
EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2
Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2EpQmFs8K7
A4tB9wZ2EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVdPzX5WqSrG7IkMlO2NeQfJhCaB8
PzX5WqSrG7IkMlO2NeQfJhCaB8A4tB9wZ2EpQmFs8K7Lx1Dj3H6Y9o0vRnTbUcVd
-----END ENCRYPTED MESSAGE-----`}
													</pre>
													<div
														className={`mt-2 text-xs ${
															darkMode ? "text-gray-400" : "text-gray-500"
														}`}
													>
														This is what your email looks like to anyone who
														doesn't have the decryption key.
													</div>
												</div>
											)}

											{/* Attachments */}
											{email.attachments.length > 0 && (
												<div className="mt-8">
													<h3
														className={`text-sm font-medium mb-4 flex items-center ${
															darkMode ? "text-white" : "text-gray-900"
														}`}
													>
														<LucideIcons.Paperclip className="mr-2 h-4 w-4 text-gray-500" />
														Attachments ({email.attachments.length})
													</h3>
													<div className="space-y-3">
														{email.attachments.map((attachment) => (
															<div
																key={attachment.id}
																className={`flex items-center p-3 border rounded-lg ${
																	darkMode
																		? "border-gray-700 bg-gray-750"
																		: "border-gray-200 bg-gray-50"
																}`}
															>
																<div
																	className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded ${
																		darkMode ? "bg-indigo-900" : "bg-indigo-100"
																	}`}
																>
																	<LucideIcons.FileText
																		className={`h-6 w-6 ${
																			darkMode
																				? "text-indigo-400"
																				: "text-indigo-600"
																		}`}
																	/>
																</div>
																<div className="ml-4 flex-1">
																	<div className="flex items-center justify-between">
																		<div>
																			<h4
																				className={`text-sm font-medium ${
																					darkMode
																						? "text-white"
																						: "text-gray-900"
																				}`}
																			>
																				{attachment.name}
																			</h4>
																			<p
																				className={`text-xs ${
																					darkMode
																						? "text-gray-400"
																						: "text-gray-500"
																				}`}
																			>
																				{formatFileSize(attachment.size)}
																			</p>
																		</div>
																		<div className="flex items-center">
																			{attachment.isEncrypted && (
																				<span
																					className={`mr-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
																						darkMode
																							? "bg-green-900 text-green-200"
																							: "bg-green-100 text-green-800"
																					}`}
																				>
																					<LucideIcons.Lock className="mr-1 h-3 w-3" />
																					Encrypted
																				</span>
																			)}
																			<button
																				onClick={() =>
																					handleDownload(attachment.id)
																				}
																				disabled={isDownloading}
																				className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																					isDownloading
																						? "opacity-70 cursor-not-allowed"
																						: ""
																				}`}
																			>
																				{isDownloading ? (
																					<>
																						<svg
																							className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
																							xmlns="http://www.w3.org/2000/svg"
																							fill="none"
																							viewBox="0 0 24 24"
																						>
																							<circle
																								className="opacity-25"
																								cx="12"
																								cy="12"
																								r="10"
																								stroke="currentColor"
																								strokeWidth="4"
																							></circle>
																							<path
																								className="opacity-75"
																								fill="currentColor"
																								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																							></path>
																						</svg>
																						Downloading...
																					</>
																				) : (
																					<>
																						<LucideIcons.Download className="mr-1.5 h-3 w-3" />
																						Download
																					</>
																				)}
																			</button>
																		</div>
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{/* Reply box */}
											{showReplyBox && (
												<div
													className={`mt-8 border-t pt-6 ${
														darkMode ? "border-gray-700" : "border-gray-200"
													}`}
												>
													<h3
														className={`text-sm font-medium mb-4 ${
															darkMode ? "text-white" : "text-gray-900"
														}`}
													>
														Reply to {email.from}
													</h3>
													<form onSubmit={handleReplySubmit}>
														<div className="mt-1">
															<textarea
																rows={6}
																value={replyMessage}
																onChange={(e) =>
																	setReplyMessage(e.target.value)
																}
																className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																placeholder="Write your reply here..."
															></textarea>
														</div>
														<div className="mt-4 flex justify-between items-center">
															<div className="flex items-center space-x-4">
																<div className="flex items-center">
																	<input
																		id="reply-encrypted"
																		name="reply-encrypted"
																		type="checkbox"
																		className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded ${
																			darkMode
																				? "border-gray-600"
																				: "border-gray-300"
																		}`}
																		checked
																	/>
																	<label
																		htmlFor="reply-encrypted"
																		className={`ml-2 block text-sm ${
																			darkMode
																				? "text-gray-300"
																				: "text-gray-700"
																		}`}
																	>
																		Encrypt reply
																	</label>
																</div>
																<div className="flex items-center">
																	<input
																		id="reply-receipt"
																		name="reply-receipt"
																		type="checkbox"
																		className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded ${
																			darkMode
																				? "border-gray-600"
																				: "border-gray-300"
																		}`}
																	/>
																	<label
																		htmlFor="reply-receipt"
																		className={`ml-2 block text-sm ${
																			darkMode
																				? "text-gray-300"
																				: "text-gray-700"
																		}`}
																	>
																		Request read receipt
																	</label>
																</div>
															</div>
															<div className="flex space-x-2">
																<button
																	type="button"
																	onClick={() => setShowReplyBox(false)}
																	className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																		darkMode
																			? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
																			: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
																	}`}
																>
																	Cancel
																</button>
																<button
																	type="submit"
																	className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
																>
																	<LucideIcons.Send className="mr-1.5 h-4 w-4" />
																	Send Reply
																</button>
															</div>
														</div>
													</form>
												</div>
											)}

											{/* Forward box */}
											{showForwardBox && (
												<div
													className={`mt-8 border-t pt-6 ${
														darkMode ? "border-gray-700" : "border-gray-200"
													}`}
												>
													<h3
														className={`text-sm font-medium mb-4 ${
															darkMode ? "text-white" : "text-gray-900"
														}`}
													>
														Forward Email
													</h3>
													<form onSubmit={handleForwardSubmit}>
														<div>
															<label
																htmlFor="forward-to"
																className={`block text-sm font-medium ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																To
															</label>
															<div className="mt-1">
																<input
																	type="email"
																	id="forward-to"
																	value={forwardRecipient}
																	onChange={(e) =>
																		setForwardRecipient(e.target.value)
																	}
																	className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
																		darkMode
																			? "border-gray-600 bg-gray-700 text-white"
																			: "border-gray-300 bg-white text-gray-900"
																	}`}
																	placeholder="recipient@example.com"
																/>
															</div>
														</div>
														<div className="mt-4">
															<label
																htmlFor="forward-message"
																className={`block text-sm font-medium ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Message
															</label>
															<div className="mt-1">
																<textarea
																	id="forward-message"
																	rows={8}
																	value={forwardMessage}
																	onChange={(e) =>
																		setForwardMessage(e.target.value)
																	}
																	className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md font-mono ${
																		darkMode
																			? "border-gray-600 bg-gray-700 text-white"
																			: "border-gray-300 bg-white text-gray-900"
																	}`}
																></textarea>
															</div>
														</div>
														<div className="mt-4 flex justify-between items-center">
															<div className="flex items-center space-x-4">
																<div className="flex items-center">
																	<input
																		id="forward-encrypted"
																		name="forward-encrypted"
																		type="checkbox"
																		className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded ${
																			darkMode
																				? "border-gray-600"
																				: "border-gray-300"
																		}`}
																		checked
																	/>
																	<label
																		htmlFor="forward-encrypted"
																		className={`ml-2 block text-sm ${
																			darkMode
																				? "text-gray-300"
																				: "text-gray-700"
																		}`}
																	>
																		Encrypt message
																	</label>
																</div>
																<div className="flex items-center">
																	<input
																		id="forward-attachments"
																		name="forward-attachments"
																		type="checkbox"
																		className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded ${
																			darkMode
																				? "border-gray-600"
																				: "border-gray-300"
																		}`}
																		checked
																	/>
																	<label
																		htmlFor="forward-attachments"
																		className={`ml-2 block text-sm ${
																			darkMode
																				? "text-gray-300"
																				: "text-gray-700"
																		}`}
																	>
																		Include attachments
																	</label>
																</div>
															</div>
															<div className="flex space-x-2">
																<button
																	type="button"
																	onClick={() => setShowForwardBox(false)}
																	className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																		darkMode
																			? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
																			: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
																	}`}
																>
																	Cancel
																</button>
																<button
																	type="submit"
																	className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
																>
																	<LucideIcons.Send className="mr-1.5 h-4 w-4" />
																	Forward
																</button>
															</div>
														</div>
													</form>
												</div>
											)}
										</>
									) : (
										/* Locked content */
										<div className="text-center py-16">
											<div
												className={`rounded-full p-6 inline-flex items-center justify-center mb-4 ${
													darkMode
														? "bg-indigo-900 bg-opacity-20"
														: "bg-indigo-100"
												}`}
											>
												<LucideIcons.Lock
													className={`h-12 w-12 ${
														darkMode ? "text-indigo-400" : "text-indigo-600"
													}`}
												/>
											</div>
											<h3
												className={`mt-2 text-xl font-bold ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												This message is encrypted
											</h3>
											<p
												className={`mt-2 text-base max-w-md mx-auto ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Enter the password to decrypt this message and view its
												contents securely.
											</p>
											<div className="mt-6">
												<button
													onClick={() => setShowPasswordModal(true)}
													className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
												>
													<LucideIcons.KeySquare className="mr-2 h-5 w-5" />
													Enter Password
												</button>
											</div>
										</div>
									)}
								</div>

								{/* Actions */}
								<div
									className={`px-6 py-4 border-t flex justify-between ${
										darkMode
											? "bg-gray-750 border-gray-700"
											: "bg-gray-50 border-gray-200"
									}`}
								>
									<div>
										<button
											onClick={() => navigate("/dashboard")}
											className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
												darkMode
													? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
													: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
											}`}
										>
											<LucideIcons.ArrowLeft className="mr-1.5 h-5 w-5" />
											Back
										</button>
									</div>
									{isDecrypted && (
										<div className="flex space-x-3">
											<button
												onClick={() => {
													if (showReplyBox) {
														setShowReplyBox(false);
													} else {
														setShowReplyBox(true);
														setShowForwardBox(false);
													}
												}}
												className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
													darkMode
														? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
														: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
												}`}
											>
												<LucideIcons.Reply className="mr-1.5 h-5 w-5" />
												Reply
											</button>
											<button
												onClick={() => {
													if (showForwardBox) {
														setShowForwardBox(false);
													} else {
														setShowForwardBox(true);
														setShowReplyBox(false);
													}
												}}
												className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
											>
												<LucideIcons.Forward className="mr-1.5 h-5 w-5" />
												Forward
											</button>
										</div>
									)}
								</div>
							</div>
						</animated.div>
					) : (
						<div
							className={`shadow-lg rounded-lg p-6 ${
								darkMode ? "bg-gray-800" : "bg-white"
							}`}
						>
							<div className="text-center">
								<LucideIcons.AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
								<h3
									className={`mt-2 text-lg font-medium ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									No email found
								</h3>
								<p
									className={`mt-1 text-sm ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									The email you're looking for does not exist or has been
									deleted.
								</p>
								<div className="mt-6">
									<button
										onClick={() => navigate("/dashboard")}
										className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
									>
										<LucideIcons.Inbox className="mr-1.5 h-5 w-5" />
										Back to Inbox
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</main>

			{/* Password modal */}
			<AnimatePresence>
				{showPasswordModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className={`rounded-lg shadow-xl max-w-md w-full p-6 mx-4 ${
								darkMode ? "bg-gray-800" : "bg-white"
							}`}
						>
							<div className="text-center">
								<div
									className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
										darkMode ? "bg-indigo-900" : "bg-indigo-100"
									}`}
								>
									<LucideIcons.KeySquare
										className={`h-10 w-10 ${
											darkMode ? "text-indigo-400" : "text-indigo-600"
										}`}
									/>
								</div>
								<h3
									className={`mt-4 text-xl font-bold ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Password Required
								</h3>
								<p
									className={`mt-2 text-base ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									This message is protected with a password. Please enter the
									password to view it.
								</p>
								{email?.passwordHint && (
									<div
										className={`mt-4 p-4 rounded-md border ${
											darkMode
												? "bg-yellow-900 bg-opacity-20 border-yellow-800"
												: "bg-yellow-50 border-yellow-100"
										}`}
									>
										<div className="flex">
											<div className="flex-shrink-0">
												<LucideIcons.HelpCircle className="h-5 w-5 text-yellow-400" />
											</div>
											<div className="ml-3 text-left">
												<h3
													className={`text-sm font-medium ${
														darkMode ? "text-yellow-200" : "text-yellow-800"
													}`}
												>
													Password Hint
												</h3>
												<p
													className={`mt-1 text-sm ${
														darkMode ? "text-yellow-300" : "text-yellow-700"
													}`}
												>
													{email.passwordHint}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
							<form onSubmit={handlePasswordSubmit} className="mt-6">
								<div>
									<label
										htmlFor="password"
										className={`block text-sm font-medium ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Password
									</label>
									<div className="mt-1 relative rounded-md shadow-sm">
										<input
											type="password"
											id="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md pr-10 ${
												darkMode
													? "border-gray-600 bg-gray-700 text-white"
													: "border-gray-300 bg-white text-gray-900"
											}`}
											placeholder="Enter password"
											autoFocus
										/>
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
											<LucideIcons.KeySquare className="h-5 w-5 text-gray-400" />
										</div>
									</div>
								</div>
								<div className="mt-6 flex justify-end space-x-3">
									<button
										type="button"
										onClick={() => navigate("/dashboard")}
										className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
											darkMode
												? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
												: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
										}`}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
									>
										<LucideIcons.Unlock className="mr-1.5 h-5 w-5" />
										Decrypt Message
									</button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// Enhanced Settings Component
function Settings({
	user,
	darkMode,
}: {
	user: User | null;
	darkMode: boolean;
}) {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("general");
	const [profileName, setProfileName] = useState(user?.name || "");
	const [profileEmail, setProfileEmail] = useState(user?.email || "");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showAddKeyModal, setShowAddKeyModal] = useState(false);
	const [showAddAccountModal, setShowAddAccountModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isGeneratingKey, setIsGeneratingKey] = useState(false);
	const [keyName, setKeyName] = useState("");
	const [keyBits, setKeyBits] = useState("4096");

	// Animation for content
	const contentAnimation = useSpring({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: { tension: 280, friction: 24 },
	});

	// Handle save profile
	const handleSaveProfile = () => {
		setIsSaving(true);

		// Simulate API call
		setTimeout(() => {
			toast.success("Profile updated successfully");
			setIsSaving(false);
		}, 1500);
	};

	// Handle key generation
	const handleGenerateKey = (e: React.FormEvent) => {
		e.preventDefault();

		if (!keyName) {
			toast.error("Key name is required");
			return;
		}

		setIsGeneratingKey(true);

		// Simulate API call
		setTimeout(() => {
			toast.success("New encryption key generated successfully");
			setIsGeneratingKey(false);
			setShowAddKeyModal(false);
			setKeyName("");
		}, 2000);
	};

	// Handle add email account
	const handleAddAccount = (provider: string) => {
		toast.success(`Connected to ${provider} successfully`);
		setShowAddAccountModal(false);
	};

	return (
		<div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex justify-between items-center mb-6">
					<h1
						className={`text-2xl font-bold flex items-center ${
							darkMode ? "text-white" : "text-gray-900"
						}`}
					>
						<LucideIcons.Settings
							className={`mr-2 h-6 w-6 ${
								darkMode ? "text-indigo-400" : "text-indigo-600"
							}`}
						/>
						Settings
					</h1>
					<button
						onClick={() => navigate("/dashboard")}
						className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
							darkMode
								? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
								: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
						}`}
					>
						<LucideIcons.ArrowLeft className="mr-1.5 h-5 w-5" />
						Back to Inbox
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{/* Sidebar */}
					<div className="md:col-span-1">
						<div
							className={`shadow rounded-lg overflow-hidden ${
								darkMode ? "bg-gray-800" : "bg-white"
							}`}
						>
							<div
								className={`p-4 border-b ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<div className="flex items-center space-x-3">
									<img
										src={
											user?.profileImage ||
											`https://ui-avatars.com/api/?name=${
												user?.name || "User"
											}&background=6366f1&color=fff`
										}
										alt={user?.name || "User"}
										className="h-12 w-12 rounded-full"
									/>
									<div>
										<h3
											className={`text-sm font-medium ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											{user?.name}
										</h3>
										<p
											className={`text-xs ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{user?.email}
										</p>
									</div>
								</div>
							</div>
							<nav className="space-y-1 p-2" aria-label="Settings">
								<button
									onClick={() => setActiveTab("general")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										activeTab === "general"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-750 transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
									}`}
								>
									<LucideIcons.User className="mr-3 h-5 w-5" />
									General
								</button>
								<button
									onClick={() => setActiveTab("security")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										activeTab === "security"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-750 transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
									}`}
								>
									<LucideIcons.Shield className="mr-3 h-5 w-5" />
									Security
								</button>
								<button
									onClick={() => setActiveTab("encryption")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										activeTab === "encryption"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-750 transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
									}`}
								>
									<LucideIcons.Key className="mr-3 h-5 w-5" />
									Encryption Keys
								</button>
								<button
									onClick={() => setActiveTab("accounts")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										activeTab === "accounts"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-750 transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
									}`}
								>
									<LucideIcons.Mail className="mr-3 h-5 w-5" />
									Connected Accounts
								</button>
								<button
									onClick={() => setActiveTab("notifications")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										activeTab === "notifications"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-750 transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
									}`}
								>
									<LucideIcons.Bell className="mr-3 h-5 w-5" />
									Notifications
								</button>
								<button
									onClick={() => setActiveTab("billing")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										activeTab === "billing"
											? darkMode
												? "bg-indigo-900 bg-opacity-40 text-indigo-200"
												: "bg-indigo-50 text-indigo-700"
											: darkMode
											? "text-gray-300 hover:bg-gray-750 transition-colors duration-200"
											: "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
									}`}
								>
									<LucideIcons.CreditCard className="mr-3 h-5 w-5" />
									Billing
								</button>
							</nav>
						</div>
					</div>

					{/* Main content */}
					<div className="md:col-span-3">
						<animated.div style={contentAnimation}>
							<div
								className={`shadow rounded-lg ${
									darkMode ? "bg-gray-800" : "bg-white"
								}`}
							>
								{/* General Settings */}
								{activeTab === "general" && (
									<div className="p-6">
										<h2
											className={`text-lg font-medium mb-4 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Profile Information
										</h2>
										<div className="space-y-6">
											<div>
												<label
													htmlFor="name"
													className={`block text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Name
												</label>
												<div className="mt-1">
													<input
														type="text"
														id="name"
														value={profileName}
														onChange={(e) => setProfileName(e.target.value)}
														className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
															darkMode
																? "border-gray-600 bg-gray-700 text-white"
																: "border-gray-300 bg-white text-gray-900"
														}`}
													/>
												</div>
											</div>

											<div>
												<label
													htmlFor="email"
													className={`block text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Email
												</label>
												<div className="mt-1">
													<input
														type="email"
														id="email"
														value={profileEmail}
														onChange={(e) => setProfileEmail(e.target.value)}
														className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
															darkMode
																? "border-gray-600 bg-gray-700 text-white"
																: "border-gray-300 bg-white text-gray-900"
														}`}
													/>
												</div>
											</div>

											<div>
												<label
													htmlFor="profile-picture"
													className={`block text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Profile Picture
												</label>
												<div className="mt-1 flex items-center space-x-4">
													<img
														src={
															user?.profileImage ||
															`https://ui-avatars.com/api/?name=${
																user?.name || "User"
															}&background=6366f1&color=fff`
														}
														alt={user?.name || "User"}
														className="h-16 w-16 rounded-full"
													/>
													<button
														type="button"
														className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
															darkMode
																? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
																: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
														}`}
													>
														<LucideIcons.Upload className="mr-1.5 h-4 w-4" />
														Change Picture
													</button>
												</div>
											</div>

											<div>
												<label
													htmlFor="language"
													className={`block text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Language
												</label>
												<div className="mt-1">
													<select
														id="language"
														className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
															darkMode
																? "border-gray-600 bg-gray-700 text-white"
																: "border-gray-300 bg-white text-gray-900"
														}`}
														defaultValue="en"
													>
														<option value="en">English</option>
														<option value="fr">Français</option>
														<option value="es">Español</option>
														<option value="de">Deutsch</option>
														<option value="ja">日本語</option>
													</select>
												</div>
											</div>

											<div>
												<label
													htmlFor="timezone"
													className={`block text-sm font-medium ${
														darkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													Timezone
												</label>
												<div className="mt-1">
													<select
														id="timezone"
														className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
															darkMode
																? "border-gray-600 bg-gray-700 text-white"
																: "border-gray-300 bg-white text-gray-900"
														}`}
														defaultValue="utc"
													>
														<option value="utc">UTC (GMT+0)</option>
														<option value="est">Eastern Time (GMT-5)</option>
														<option value="cst">Central Time (GMT-6)</option>
														<option value="mst">Mountain Time (GMT-7)</option>
														<option value="pst">Pacific Time (GMT-8)</option>
													</select>
												</div>
											</div>

											<div
												className={`border-t pt-5 ${
													darkMode ? "border-gray-700" : "border-gray-200"
												}`}
											>
												<div className="flex justify-end">
													<button
														type="button"
														onClick={handleSaveProfile}
														disabled={isSaving}
														className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
															isSaving ? "opacity-70 cursor-not-allowed" : ""
														}`}
													>
														{isSaving ? (
															<>
																<svg
																	className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																>
																	<circle
																		className="opacity-25"
																		cx="12"
																		cy="12"
																		r="10"
																		stroke="currentColor"
																		strokeWidth="4"
																	></circle>
																	<path
																		className="opacity-75"
																		fill="currentColor"
																		d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																	></path>
																</svg>
																Saving...
															</>
														) : (
															<>
																<LucideIcons.Save className="mr-1.5 h-4 w-4" />
																Save Changes
															</>
														)}
													</button>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Security Settings */}
								{activeTab === "security" && (
									<div className="p-6">
										<h2
											className={`text-lg font-medium mb-4 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Security Settings
										</h2>
										<div className="space-y-6">
											<div>
												<h3
													className={`text-base font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Change Password
												</h3>
												<div className="mt-3 space-y-4">
													<div>
														<label
															htmlFor="current-password"
															className={`block text-sm font-medium ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															Current Password
														</label>
														<div className="mt-1">
															<input
																type="password"
																id="current-password"
																className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																placeholder="••••••••"
															/>
														</div>
													</div>
													<div>
														<label
															htmlFor="new-password"
															className={`block text-sm font-medium ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															New Password
														</label>
														<div className="mt-1">
															<input
																type="password"
																id="new-password"
																className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																placeholder="••••••••"
															/>
														</div>
													</div>
													<div>
														<label
															htmlFor="confirm-password"
															className={`block text-sm font-medium ${
																darkMode ? "text-gray-300" : "text-gray-700"
															}`}
														>
															Confirm New Password
														</label>
														<div className="mt-1">
															<input
																type="password"
																id="confirm-password"
																className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
																	darkMode
																		? "border-gray-600 bg-gray-700 text-white"
																		: "border-gray-300 bg-white text-gray-900"
																}`}
																placeholder="••••••••"
															/>
														</div>
													</div>
													<div className="flex justify-end">
														<button
															type="button"
															className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
														>
															<LucideIcons.Check className="mr-1.5 h-4 w-4" />
															Update Password
														</button>
													</div>
												</div>
											</div>

											<div
												className={`border-t pt-6 ${
													darkMode ? "border-gray-700" : "border-gray-200"
												}`}
											>
												<h3
													className={`text-base font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Two-Factor Authentication
												</h3>
												<div className="mt-3">
													<div className="flex items-center justify-between">
														<div>
															<p
																className={`text-sm ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																Add an extra layer of security to your account
																by requiring a verification code in addition to
																your password.
															</p>
														</div>
														<div className="ml-4 relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
															<input
																type="checkbox"
																name="toggle-2fa"
																id="toggle-2fa"
																className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																	darkMode
																		? "bg-gray-300 border-gray-600"
																		: "bg-white border-gray-300"
																}`}
																defaultChecked={user?.twoFactorEnabled}
															/>
															<label
																htmlFor="toggle-2fa"
																className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
																	user?.twoFactorEnabled
																		? "bg-indigo-600"
																		: darkMode
																		? "bg-gray-600"
																		: "bg-gray-300"
																}`}
															></label>
														</div>
													</div>
													{user?.twoFactorEnabled && (
														<div className="mt-4">
															<button
																type="button"
																className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																	darkMode
																		? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
																		: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
																}`}
															>
																<LucideIcons.Settings className="mr-1 h-3 w-3" />
																Configure
															</button>
															<button
																type="button"
																className={`ml-2 inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																	darkMode
																		? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
																		: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
																}`}
															>
																<LucideIcons.RefreshCw className="mr-1 h-3 w-3" />
																Reset Backup Codes
															</button>
														</div>
													)}
												</div>
											</div>

											<div
												className={`border-t pt-6 ${
													darkMode ? "border-gray-700" : "border-gray-200"
												}`}
											>
												<h3
													className={`text-base font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Login History
												</h3>
												<p
													className={`mt-1 text-sm ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													Recent login activity for your account.
												</p>
												<div className="mt-3">
													<div
														className={`shadow overflow-hidden border sm:rounded-md ${
															darkMode
																? "bg-gray-750 border-gray-700"
																: "bg-gray-50 border-gray-200"
														}`}
													>
														<ul
															className={`divide-y ${
																darkMode ? "divide-gray-700" : "divide-gray-200"
															}`}
														>
															{[
																{
																	date: "June 30, 2025, 10:23 AM",
																	device: "Chrome on Windows",
																	location: "Netrakona, BD",
																	current: true,
																},
																{
																	date: "June 28, 2025, 3:45 PM",
																	device: "Firefox on macOS",
																	location: "Netrakona, BD",
																	current: false,
																},
																{
																	date: "June 25, 2025, 9:12 AM",
																	device: "Safari on iPhone",
																	location: "Dhaka, BD",
																	current: false,
																},
															].map((session, index) => (
																<li key={index}>
																	<div className="px-4 py-4 sm:px-6">
																		<div className="flex items-center justify-between">
																			<div className="flex items-center">
																				<LucideIcons.Monitor className="h-5 w-5 text-gray-400 mr-3" />
																				<p
																					className={`text-sm font-medium truncate ${
																						darkMode
																							? "text-white"
																							: "text-gray-900"
																					}`}
																				>
																					{session.device}
																				</p>
																				{session.current && (
																					<span
																						className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																							darkMode
																								? "bg-green-900 text-green-200"
																								: "bg-green-100 text-green-800"
																						}`}
																					>
																						Current
																					</span>
																				)}
																			</div>
																			<div className="ml-2 flex-shrink-0">
																				<button
																					type="button"
																					className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																						darkMode
																							? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
																							: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
																					}`}
																				>
																					Sign Out
																				</button>
																			</div>
																		</div>
																		<div className="mt-2 sm:flex sm:justify-between">
																			<div className="sm:flex">
																				<p
																					className={`flex items-center text-sm ${
																						darkMode
																							? "text-gray-400"
																							: "text-gray-500"
																					}`}
																				>
																					<LucideIcons.MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
																					{session.location}
																				</p>
																			</div>
																			<div
																				className={`mt-2 flex items-center text-sm sm:mt-0 ${
																					darkMode
																						? "text-gray-400"
																						: "text-gray-500"
																				}`}
																			>
																				<LucideIcons.Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
																				<p>{session.date}</p>
																			</div>
																		</div>
																	</div>
																</li>
															))}
														</ul>
													</div>
												</div>
											</div>

											<div
												className={`border-t pt-6 ${
													darkMode ? "border-gray-700" : "border-gray-200"
												}`}
											>
												<h3
													className={`text-base font-medium ${
														darkMode ? "text-red-400" : "text-red-600"
													}`}
												>
													Delete Account
												</h3>
												<p
													className={`mt-1 text-sm ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													Permanently delete your account and all associated
													data. This action cannot be undone.
												</p>
												<div className="mt-3">
													<button
														type="button"
														onClick={() => setShowDeleteModal(true)}
														className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
													>
														<LucideIcons.Trash2 className="mr-1.5 h-4 w-4" />
														Delete Account
													</button>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Encryption Keys Settings */}
								{activeTab === "encryption" && (
									<div className="p-6">
										<div className="flex justify-between items-center mb-4">
											<h2
												className={`text-lg font-medium ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Encryption Keys
											</h2>
											<button
												type="button"
												onClick={() => setShowAddKeyModal(true)}
												className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
											>
												<LucideIcons.Plus className="mr-1.5 h-4 w-4" />
												Add New Key
											</button>
										</div>

										<div
											className={`p-4 rounded-md border mb-6 ${
												darkMode
													? "bg-indigo-900 bg-opacity-20 border-indigo-800"
													: "bg-indigo-50 border-indigo-100"
											}`}
										>
											<div className="flex">
												<div className="flex-shrink-0">
													<LucideIcons.Info
														className={`h-5 w-5 ${
															darkMode ? "text-indigo-400" : "text-indigo-600"
														}`}
													/>
												</div>
												<div className="ml-3">
													<h3
														className={`text-sm font-medium ${
															darkMode ? "text-indigo-200" : "text-indigo-800"
														}`}
													>
														About Encryption Keys
													</h3>
													<p
														className={`mt-2 text-sm ${
															darkMode ? "text-indigo-300" : "text-indigo-700"
														}`}
													>
														Encryption keys are used to secure your emails. We
														recommend having at least one active key at all
														times. You can create multiple keys for different
														purposes or contacts.
													</p>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											{/* Default Key */}
											<div
												className={`border rounded-lg overflow-hidden ${
													darkMode ? "border-gray-700" : "border-gray-200"
												}`}
											>
												<div
													className={`px-4 py-3 border-b ${
														darkMode
															? "bg-gray-750 border-gray-700"
															: "bg-gray-50 border-gray-200"
													}`}
												>
													<div className="flex justify-between items-center">
														<h3
															className={`text-sm font-medium ${
																darkMode ? "text-white" : "text-gray-900"
															}`}
														>
															Default Key
														</h3>
														<span
															className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																darkMode
																	? "bg-green-900 text-green-200"
																	: "bg-green-100 text-green-800"
															}`}
														>
															Active
														</span>
													</div>
												</div>
												<div
													className={`px-4 py-4 ${
														darkMode ? "bg-gray-800" : "bg-white"
													}`}
												>
													<div className="grid grid-cols-2 gap-4">
														<div>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																<span className="font-medium">Algorithm:</span>{" "}
																RSA-4096
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																<span className="font-medium">Created:</span>{" "}
																{new Date().toLocaleDateString()}
															</p>
														</div>
														<div>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																<span className="font-medium">
																	Fingerprint:
																</span>{" "}
																<span className="font-mono">
																	AB:CD:EF:12:34:56
																</span>
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																<span className="font-medium">Expiration:</span>{" "}
																Never
															</p>
														</div>
													</div>
													<div className="mt-4 flex space-x-2">
														<button
															type="button"
															className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																darkMode
																	? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
																	: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
															}`}
														>
															<LucideIcons.Download className="mr-1 h-4 w-4" />
															Export
														</button>
														<button
															type="button"
															className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																darkMode
																	? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
																	: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
															}`}
														>
															<LucideIcons.RefreshCw className="mr-1 h-4 w-4" />
															Renew
														</button>
													</div>
												</div>
											</div>

											{/* Secondary Key */}
											<div
												className={`border rounded-lg overflow-hidden ${
													darkMode ? "border-gray-700" : "border-gray-200"
												}`}
											>
												<div
													className={`px-4 py-3 border-b ${
														darkMode
															? "bg-gray-750 border-gray-700"
															: "bg-gray-50 border-gray-200"
													}`}
												>
													<div className="flex justify-between items-center">
														<h3
															className={`text-sm font-medium ${
																darkMode ? "text-white" : "text-gray-900"
															}`}
														>
															Work Key
														</h3>
														<span
															className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																darkMode
																	? "bg-yellow-900 text-yellow-200"
																	: "bg-yellow-100 text-yellow-800"
															}`}
														>
															Inactive
														</span>
													</div>
												</div>
												<div
													className={`px-4 py-4 ${
														darkMode ? "bg-gray-800" : "bg-white"
													}`}
												>
													<div className="grid grid-cols-2 gap-4">
														<div>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																<span className="font-medium">Algorithm:</span>{" "}
																RSA-2048
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																<span className="font-medium">Created:</span>{" "}
																{new Date(
																	Date.now() - 7776000000
																).toLocaleDateString()}{" "}
																{/* 90 days ago */}
															</p>
														</div>
														<div>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																<span className="font-medium">
																	Fingerprint:
																</span>{" "}
																<span className="font-mono">
																	XY:Z1:23:45:67:89
																</span>
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																<span className="font-medium">Expiration:</span>{" "}
																{new Date(
																	Date.now() + 7776000000
																).toLocaleDateString()}{" "}
																{/* 90 days from now */}
															</p>
														</div>
													</div>
													<div className="mt-4 flex space-x-2">
														<button
															type="button"
															className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																darkMode
																	? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
																	: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
															}`}
														>
															<LucideIcons.Download className="mr-1 h-4 w-4" />
															Export
														</button>
														<button
															type="button"
															className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
														>
															<LucideIcons.Check className="mr-1 h-4 w-4" />
															Set as Active
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Connected Accounts Settings */}
								{activeTab === "accounts" && (
									<div className="p-6">
										<div className="flex justify-between items-center mb-4">
											<h2
												className={`text-lg font-medium ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Connected Email Accounts
											</h2>
											<button
												type="button"
												onClick={() => setShowAddAccountModal(true)}
												className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
											>
												<LucideIcons.Plus className="mr-1.5 h-4 w-4" />
												Add Account
											</button>
										</div>

										<p
											className={`text-sm mb-6 ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Connect your existing email accounts to send and receive
											encrypted emails through SecureEmail.
										</p>

										<div className="space-y-4">
											{user?.connectedAccounts.map((account) => (
												<div
													key={account.id}
													className={`border rounded-lg overflow-hidden ${
														darkMode ? "border-gray-700" : "border-gray-200"
													}`}
												>
													<div
														className={`px-4 py-4 ${
															darkMode ? "bg-gray-800" : "bg-white"
														}`}
													>
														<div className="flex items-center justify-between">
															<div className="flex items-center">
																{account.provider === "gmail" && (
																	<div
																		className={`h-10 w-10 flex items-center justify-center rounded-full ${
																			darkMode ? "bg-red-900" : "bg-red-100"
																		}`}
																	>
																		<svg
																			className={`h-6 w-6 ${
																				darkMode
																					? "text-red-400"
																					: "text-red-600"
																			}`}
																			viewBox="0 0 24 24"
																			fill="currentColor"
																		>
																			<path
																				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
																				fill="#4285F4"
																			/>
																			<path
																				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
																				fill="#34A853"
																			/>
																			<path
																				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
																				fill="#FBBC05"
																			/>
																			<path
																				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
																				fill="#EA4335"
																			/>
																		</svg>
																	</div>
																)}
																{account.provider === "outlook" && (
																	<div
																		className={`h-10 w-10 flex items-center justify-center rounded-full ${
																			darkMode ? "bg-blue-900" : "bg-blue-100"
																		}`}
																	>
																		<svg
																			className={`h-6 w-6 ${
																				darkMode
																					? "text-blue-400"
																					: "text-blue-600"
																			}`}
																			viewBox="0 0 24 24"
																			fill="currentColor"
																		>
																			<path
																				d="M2 6L10 4V20L2 18V6Z"
																				fill="#0078D4"
																			/>
																			<path
																				d="M12 4L22 2V22L12 20V4Z"
																				fill="#0078D4"
																			/>
																		</svg>
																	</div>
																)}
																{account.provider === "yahoo" && (
																	<div
																		className={`h-10 w-10 flex items-center justify-center rounded-full ${
																			darkMode
																				? "bg-purple-900"
																				: "bg-purple-100"
																		}`}
																	>
																		<svg
																			className={`h-6 w-6 ${
																				darkMode
																					? "text-purple-400"
																					: "text-purple-600"
																			}`}
																			viewBox="0 0 24 24"
																			fill="currentColor"
																		>
																			<path
																				d="M19.828 7.242H16.3V3h-3.194v4.242h-3.523v3.872h3.523v12.244h3.194V11.114h3.528v-3.872z"
																				fill="#6001D2"
																			/>
																		</svg>
																	</div>
																)}
																{account.provider === "other" && (
																	<div
																		className={`h-10 w-10 flex items-center justify-center rounded-full ${
																			darkMode ? "bg-gray-700" : "bg-gray-100"
																		}`}
																	>
																		<LucideIcons.Mail
																			className={`h-6 w-6 ${
																				darkMode
																					? "text-gray-400"
																					: "text-gray-600"
																			}`}
																		/>
																	</div>
																)}
																<div className="ml-4">
																	<h4
																		className={`text-sm font-medium ${
																			darkMode ? "text-white" : "text-gray-900"
																		}`}
																	>
																		{account.email}
																	</h4>
																	<p
																		className={`text-xs capitalize ${
																			darkMode
																				? "text-gray-400"
																				: "text-gray-500"
																		}`}
																	>
																		{account.provider}
																	</p>
																</div>
															</div>
															<div className="flex items-center">
																<span
																	className={`mr-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																		darkMode
																			? "bg-green-900 text-green-200"
																			: "bg-green-100 text-green-800"
																	}`}
																>
																	Connected
																</span>
																<button
																	type="button"
																	className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
																		darkMode
																			? "text-gray-400 hover:text-gray-300"
																			: "text-gray-400 hover:text-gray-500"
																	}`}
																>
																	<LucideIcons.MoreVertical className="h-5 w-5" />
																</button>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Notifications Settings */}
								{activeTab === "notifications" && (
									<div className="p-6">
										<h2
											className={`text-lg font-medium mb-4 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Notification Preferences
										</h2>
										<p
											className={`text-sm mb-6 ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Manage how and when you receive notifications about your
											secure emails.
										</p>

										<div className="space-y-6">
											{/* Email Notifications */}
											<div>
												<h3
													className={`text-base font-medium mb-4 ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Email Notifications
												</h3>
												<div className="space-y-4">
													<div className="flex items-center justify-between">
														<div>
															<span
																className={`text-sm font-medium ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																New Message Notifications
															</span>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																Receive an email when you get a new encrypted
																message
															</p>
														</div>
														<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
															<input
																type="checkbox"
																name="toggle-new-message"
																id="toggle-new-message"
																defaultChecked={true}
																className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																	darkMode
																		? "bg-gray-300 border-gray-600"
																		: "bg-white border-gray-300"
																}`}
															/>
															<label
																htmlFor="toggle-new-message"
																className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out bg-indigo-600"
															></label>
														</div>
													</div>

													<div className="flex items-center justify-between">
														<div>
															<span
																className={`text-sm font-medium ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Read Receipt Notifications
															</span>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																Receive an email when your sent messages are
																read
															</p>
														</div>
														<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
															<input
																type="checkbox"
																name="toggle-read-receipt"
																id="toggle-read-receipt"
																defaultChecked={true}
																className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																	darkMode
																		? "bg-gray-300 border-gray-600"
																		: "bg-white border-gray-300"
																}`}
															/>
															<label
																htmlFor="toggle-read-receipt"
																className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out bg-indigo-600"
															></label>
														</div>
													</div>

													<div className="flex items-center justify-between">
														<div>
															<span
																className={`text-sm font-medium ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Expiring Message Reminders
															</span>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																Receive an email before your messages are set to
																expire
															</p>
														</div>
														<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
															<input
																type="checkbox"
																name="toggle-expire-reminder"
																id="toggle-expire-reminder"
																defaultChecked={true}
																className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																	darkMode
																		? "bg-gray-300 border-gray-600"
																		: "bg-white border-gray-300"
																}`}
															/>
															<label
																htmlFor="toggle-expire-reminder"
																className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out bg-indigo-600"
															></label>
														</div>
													</div>
												</div>
											</div>

											{/* In-App Notifications */}
											<div
												className={`border-t pt-6 ${
													darkMode ? "border-gray-700" : "border-gray-200"
												}`}
											>
												<h3
													className={`text-base font-medium mb-4 ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													In-App Notifications
												</h3>
												<div className="space-y-4">
													<div className="flex items-center justify-between">
														<div>
															<span
																className={`text-sm font-medium ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Desktop Notifications
															</span>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																Show browser notifications when you receive new
																messages
															</p>
														</div>
														<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
															<input
																type="checkbox"
																name="toggle-desktop-notifications"
																id="toggle-desktop-notifications"
																defaultChecked={true}
																className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																	darkMode
																		? "bg-gray-300 border-gray-600"
																		: "bg-white border-gray-300"
																}`}
															/>
															<label
																htmlFor="toggle-desktop-notifications"
																className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out bg-indigo-600"
															></label>
														</div>
													</div>

													<div className="flex items-center justify-between">
														<div>
															<span
																className={`text-sm font-medium ${
																	darkMode ? "text-gray-300" : "text-gray-700"
																}`}
															>
																Sound Alerts
															</span>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																Play a sound when you receive new messages
															</p>
														</div>
														<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
															<input
																type="checkbox"
																name="toggle-sound-alerts"
																id="toggle-sound-alerts"
																defaultChecked={false}
																className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
																	darkMode
																		? "bg-gray-300 border-gray-600"
																		: "bg-white border-gray-300"
																}`}
															/>
															<label
																htmlFor="toggle-sound-alerts"
																className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
																	darkMode ? "bg-gray-600" : "bg-gray-300"
																}`}
															></label>
														</div>
													</div>
												</div>
											</div>

											{/* Save button */}
											<div
												className={`border-t pt-5 ${
													darkMode ? "border-gray-700" : "border-gray-200"
												}`}
											>
												<div className="flex justify-end">
													<button
														type="button"
														className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
													>
														<LucideIcons.Save className="mr-1.5 h-4 w-4" />
														Save Preferences
													</button>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Billing Settings */}
								{activeTab === "billing" && (
									<div className="p-6">
										<h2
											className={`text-lg font-medium mb-4 ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Billing and Subscription
										</h2>

										{/* Current Plan */}
										<div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white p-6 mb-6">
											<div className="flex justify-between items-start">
												<div>
													<span className="inline-block px-2 py-1 bg-white bg-opacity-20 rounded text-xs font-medium mb-2">
														Current Plan
													</span>
													<h3 className="text-2xl font-bold">Pro Plan</h3>
													<div className="mt-1 text-indigo-100">
														$4.99 / month
													</div>
													<p className="mt-2 text-sm text-indigo-100">
														Your next billing date is July 15, 2025
													</p>
												</div>
												<button className="px-4 py-2 bg-white text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors duration-200">
													Upgrade Plan
												</button>
											</div>
											<div className="mt-4 grid grid-cols-3 gap-4">
												<div className="bg-white bg-opacity-10 rounded-lg p-3">
													<h4 className="text-xs font-medium text-indigo-100">
														Storage
													</h4>
													<div className="mt-1 text-lg font-bold">
														1.5 GB / 5 GB
													</div>
													<div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-1.5">
														<div
															className="bg-white h-1.5 rounded-full"
															style={{ width: "30%" }}
														></div>
													</div>
												</div>
												<div className="bg-white bg-opacity-10 rounded-lg p-3">
													<h4 className="text-xs font-medium text-indigo-100">
														Email Accounts
													</h4>
													<div className="mt-1 text-lg font-bold">1 / 5</div>
													<div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-1.5">
														<div
															className="bg-white h-1.5 rounded-full"
															style={{ width: "20%" }}
														></div>
													</div>
												</div>
												<div className="bg-white bg-opacity-10 rounded-lg p-3">
													<h4 className="text-xs font-medium text-indigo-100">
														Features
													</h4>
													<div className="mt-1 text-sm font-bold">
														All Pro Features
													</div>
													<div className="mt-1 text-xs text-indigo-100">
														<LucideIcons.Check className="inline-block h-3 w-3 mr-1" />
														Self-destructing emails
													</div>
												</div>
											</div>
										</div>

										{/* Payment Method */}
										<div className="mb-8">
											<h3
												className={`text-base font-medium mb-4 ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Payment Method
											</h3>
											<div
												className={`border rounded-lg p-4 ${
													darkMode
														? "bg-gray-750 border-gray-700"
														: "bg-gray-50 border-gray-200"
												}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<div
															className={`h-10 w-16 rounded flex items-center justify-center ${
																darkMode ? "bg-blue-900" : "bg-blue-100"
															}`}
														>
															<LucideIcons.CreditCard
																className={`h-6 w-6 ${
																	darkMode ? "text-blue-400" : "text-blue-600"
																}`}
															/>
														</div>
														<div className="ml-4">
															<p
																className={`text-sm font-medium ${
																	darkMode ? "text-white" : "text-gray-900"
																}`}
															>
																Visa ending in 4242
															</p>
															<p
																className={`text-xs ${
																	darkMode ? "text-gray-400" : "text-gray-500"
																}`}
															>
																Expires 12/2028
															</p>
														</div>
													</div>
													<button
														className={`text-sm font-medium ${
															darkMode
																? "text-indigo-400 hover:text-indigo-300"
																: "text-indigo-600 hover:text-indigo-800"
														}`}
													>
														Update
													</button>
												</div>
											</div>
										</div>

										{/* Billing History */}
										<div>
											<h3
												className={`text-base font-medium mb-4 ${
													darkMode ? "text-white" : "text-gray-900"
												}`}
											>
												Billing History
											</h3>
											<div
												className={`border rounded-lg overflow-hidden ${
													darkMode
														? "bg-gray-800 border-gray-700"
														: "bg-white border-gray-200"
												}`}
											>
												<div className="overflow-x-auto">
													<table
														className={`min-w-full divide-y ${
															darkMode ? "divide-gray-700" : "divide-gray-200"
														}`}
													>
														<thead
															className={
																darkMode ? "bg-gray-750" : "bg-gray-50"
															}
														>
															<tr>
																<th
																	scope="col"
																	className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
																		darkMode ? "text-gray-400" : "text-gray-500"
																	}`}
																>
																	Date
																</th>
																<th
																	scope="col"
																	className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
																		darkMode ? "text-gray-400" : "text-gray-500"
																	}`}
																>
																	Description
																</th>
																<th
																	scope="col"
																	className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
																		darkMode ? "text-gray-400" : "text-gray-500"
																	}`}
																>
																	Amount
																</th>
																<th
																	scope="col"
																	className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
																		darkMode ? "text-gray-400" : "text-gray-500"
																	}`}
																>
																	Receipt
																</th>
															</tr>
														</thead>
														<tbody
															className={`divide-y ${
																darkMode
																	? "bg-gray-800 divide-gray-700"
																	: "bg-white divide-gray-200"
															}`}
														>
															{[
																{
																	date: "June 15, 2025",
																	description: "Pro Plan - Monthly",
																	amount: "$4.99",
																},
																{
																	date: "May 15, 2025",
																	description: "Pro Plan - Monthly",
																	amount: "$4.99",
																},
																{
																	date: "April 15, 2025",
																	description: "Pro Plan - Monthly",
																	amount: "$4.99",
																},
															].map((invoice, index) => (
																<tr key={index}>
																	<td
																		className={`px-6 py-4 whitespace-nowrap text-sm ${
																			darkMode ? "text-white" : "text-gray-900"
																		}`}
																	>
																		{invoice.date}
																	</td>
																	<td
																		className={`px-6 py-4 whitespace-nowrap text-sm ${
																			darkMode
																				? "text-gray-400"
																				: "text-gray-500"
																		}`}
																	>
																		{invoice.description}
																	</td>
																	<td
																		className={`px-6 py-4 whitespace-nowrap text-sm ${
																			darkMode ? "text-white" : "text-gray-900"
																		}`}
																	>
																		{invoice.amount}
																	</td>
																	<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
																		<button
																			className={
																				darkMode
																					? "text-indigo-400 hover:text-indigo-300"
																					: "text-indigo-600 hover:text-indigo-800"
																			}
																		>
																			Download
																		</button>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</animated.div>
					</div>
				</div>
			</div>

			{/* Delete Account Modal */}
			<AnimatePresence>
				{showDeleteModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className={`rounded-lg shadow-xl max-w-md w-full p-6 mx-4 ${
								darkMode ? "bg-gray-800" : "bg-white"
							}`}
						>
							<div className="text-center">
								<div
									className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
										darkMode ? "bg-red-900" : "bg-red-100"
									}`}
								>
									<LucideIcons.AlertOctagon
										className={`h-10 w-10 ${
											darkMode ? "text-red-400" : "text-red-600"
										}`}
									/>
								</div>
								<h3
									className={`mt-4 text-xl font-bold ${
										darkMode ? "text-white" : "text-gray-900"
									}`}
								>
									Delete Account
								</h3>
								<p
									className={`mt-2 text-base ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Are you sure you want to delete your account? This action is
									permanent and all of your data will be erased.
								</p>
								<div
									className={`mt-6 p-4 rounded-md border text-left ${
										darkMode
											? "bg-red-900 bg-opacity-20 border-red-800"
											: "bg-red-50 border-red-100"
									}`}
								>
									<div className="flex">
										<div className="flex-shrink-0">
											<LucideIcons.AlertTriangle className="h-5 w-5 text-red-400" />
										</div>
										<div className="ml-3">
											<h3
												className={`text-sm font-medium ${
													darkMode ? "text-red-200" : "text-red-800"
												}`}
											>
												Warning
											</h3>
											<div
												className={`mt-2 text-sm ${
													darkMode ? "text-red-300" : "text-red-700"
												}`}
											>
												<ul className="list-disc pl-5 space-y-1">
													<li>
														All your encrypted emails will be permanently
														deleted
													</li>
													<li>
														Your encryption keys will be permanently destroyed
													</li>
													<li>Connected email accounts will be disconnected</li>
													<li>This action cannot be undone</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between">
								<button
									type="button"
									onClick={() => setShowDeleteModal(false)}
									className={`mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
										darkMode
											? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
											: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
									}`}
								>
									Cancel
								</button>
								<button
									type="button"
									className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
								>
									<LucideIcons.Trash2 className="mr-1.5 h-4 w-4" />
									Permanently Delete Account
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Add Encryption Key Modal */}
			<AnimatePresence>
				{showAddKeyModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className={`rounded-lg shadow-xl max-w-md w-full p-6 mx-4 ${
								darkMode ? "bg-gray-800" : "bg-white"
							}`}
						>
							<div>
								<div className="flex justify-between items-center">
									<h3
										className={`text-lg font-medium ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Generate New Encryption Key
									</h3>
									<button
										type="button"
										onClick={() => setShowAddKeyModal(false)}
										className={`rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
											darkMode
												? "bg-gray-800 text-gray-400 hover:text-gray-300"
												: "bg-white text-gray-400 hover:text-gray-500"
										}`}
									>
										<span className="sr-only">Close</span>
										<LucideIcons.X className="h-6 w-6" />
									</button>
								</div>
								<p
									className={`mt-2 text-sm ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Create a new encryption key for secure communication. You can
									have multiple keys for different purposes.
								</p>

								<form onSubmit={handleGenerateKey} className="mt-6 space-y-4">
									<div>
										<label
											htmlFor="key-name"
											className={`block text-sm font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Key Name
										</label>
										<div className="mt-1">
											<input
												type="text"
												id="key-name"
												value={keyName}
												onChange={(e) => setKeyName(e.target.value)}
												className={`shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
													darkMode
														? "border-gray-600 bg-gray-700 text-white"
														: "border-gray-300 bg-white text-gray-900"
												}`}
												placeholder="e.g., Personal Key, Work Key"
												required
											/>
										</div>
										<p
											className={`mt-1 text-xs ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Choose a descriptive name to help you identify this key.
										</p>
									</div>

									<div>
										<label
											htmlFor="key-type"
											className={`block text-sm font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Key Type
										</label>
										<div className="mt-1">
											<select
												id="key-type"
												className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
													darkMode
														? "border-gray-600 bg-gray-700 text-white"
														: "border-gray-300 bg-white text-gray-900"
												}`}
												defaultValue="rsa"
											>
												<option value="rsa">RSA (Recommended)</option>
												<option value="ecc">ECC</option>
												<option value="ed25519">Ed25519</option>
											</select>
										</div>
									</div>

									<div>
										<label
											htmlFor="key-bits"
											className={`block text-sm font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Key Size
										</label>
										<div className="mt-1">
											<select
												id="key-bits"
												value={keyBits}
												onChange={(e) => setKeyBits(e.target.value)}
												className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
													darkMode
														? "border-gray-600 bg-gray-700 text-white"
														: "border-gray-300 bg-white text-gray-900"
												}`}
											>
												<option value="2048">2048 bits</option>
												<option value="3072">3072 bits</option>
												<option value="4096">4096 bits (Recommended)</option>
											</select>
										</div>
										<p
											className={`mt-1 text-xs ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Larger keys provide more security but may be slower.
										</p>
									</div>

									<div>
										<label
											htmlFor="key-expiration"
											className={`block text-sm font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Key Expiration
										</label>
										<div className="mt-1">
											<select
												id="key-expiration"
												className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md ${
													darkMode
														? "border-gray-600 bg-gray-700 text-white"
														: "border-gray-300 bg-white text-gray-900"
												}`}
												defaultValue="never"
											>
												<option value="never">Never expires</option>
												<option value="6months">6 months</option>
												<option value="1year">1 year</option>
												<option value="2years">2 years</option>
											</select>
										</div>
									</div>

									<div className="mt-6 flex justify-end space-x-3">
										<button
											type="button"
											onClick={() => setShowAddKeyModal(false)}
											className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
												darkMode
													? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
													: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
											}`}
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={isGeneratingKey}
											className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
												isGeneratingKey ? "opacity-70 cursor-not-allowed" : ""
											}`}
										>
											{isGeneratingKey ? (
												<>
													<svg
														className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
													>
														<circle
															className="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															strokeWidth="4"
														></circle>
														<path
															className="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Generating...
												</>
											) : (
												<>
													<LucideIcons.Key className="mr-1.5 h-4 w-4" />
													Generate Key
												</>
											)}
										</button>
									</div>
								</form>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Add Email Account Modal */}
			<AnimatePresence>
				{showAddAccountModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className={`rounded-lg shadow-xl max-w-md w-full p-6 mx-4 ${
								darkMode ? "bg-gray-800" : "bg-white"
							}`}
						>
							<div>
								<div className="flex justify-between items-center">
									<h3
										className={`text-lg font-medium ${
											darkMode ? "text-white" : "text-gray-900"
										}`}
									>
										Connect Email Account
									</h3>
									<button
										type="button"
										onClick={() => setShowAddAccountModal(false)}
										className={`rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
											darkMode
												? "bg-gray-800 text-gray-400 hover:text-gray-300"
												: "bg-white text-gray-400 hover:text-gray-500"
										}`}
									>
										<span className="sr-only">Close</span>
										<LucideIcons.X className="h-6 w-6" />
									</button>
								</div>
								<p
									className={`mt-2 text-sm ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Connect your existing email accounts to send and receive
									encrypted emails through SecureEmail.
								</p>

								<div className="mt-6 space-y-4">
									<button
										onClick={() => handleAddAccount("Gmail")}
										className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-colors duration-200 ${
											darkMode
												? "border-gray-600 hover:bg-gray-700"
												: "border-gray-300 hover:bg-gray-50"
										}`}
									>
										<div className="flex items-center">
											<div
												className={`h-10 w-10 flex items-center justify-center rounded-full ${
													darkMode ? "bg-red-900" : "bg-red-100"
												}`}
											>
												<svg
													className={`h-6 w-6 ${
														darkMode ? "text-red-400" : "text-red-600"
													}`}
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path
														d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
														fill="#4285F4"
													/>
													<path
														d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
														fill="#34A853"
													/>
													<path
														d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
														fill="#FBBC05"
													/>
													<path
														d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
														fill="#EA4335"
													/>
												</svg>
											</div>
											<div className="ml-4">
												<h4
													className={`text-sm font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Connect Gmail
												</h4>
												<p
													className={`text-xs ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													Secure your Gmail messages with end-to-end encryption
												</p>
											</div>
										</div>
										<LucideIcons.ArrowRight className="h-5 w-5 text-gray-400" />
									</button>

									<button
										onClick={() => handleAddAccount("Outlook")}
										className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-colors duration-200 ${
											darkMode
												? "border-gray-600 hover:bg-gray-700"
												: "border-gray-300 hover:bg-gray-50"
										}`}
									>
										<div className="flex items-center">
											<div
												className={`h-10 w-10 flex items-center justify-center rounded-full ${
													darkMode ? "bg-blue-900" : "bg-blue-100"
												}`}
											>
												<svg
													className={`h-6 w-6 ${
														darkMode ? "text-blue-400" : "text-blue-600"
													}`}
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M2 6L10 4V20L2 18V6Z" fill="#0078D4" />
													<path d="M12 4L22 2V22L12 20V4Z" fill="#0078D4" />
												</svg>
											</div>
											<div className="ml-4">
												<h4
													className={`text-sm font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Connect Outlook
												</h4>
												<p
													className={`text-xs ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													Secure your Outlook messages with end-to-end
													encryption
												</p>
											</div>
										</div>
										<LucideIcons.ArrowRight className="h-5 w-5 text-gray-400" />
									</button>

									<button
										onClick={() => handleAddAccount("Yahoo")}
										className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-colors duration-200 ${
											darkMode
												? "border-gray-600 hover:bg-gray-700"
												: "border-gray-300 hover:bg-gray-50"
										}`}
									>
										<div className="flex items-center">
											<div
												className={`h-10 w-10 flex items-center justify-center rounded-full ${
													darkMode ? "bg-purple-900" : "bg-purple-100"
												}`}
											>
												<svg
													className={`h-6 w-6 ${
														darkMode ? "text-purple-400" : "text-purple-600"
													}`}
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path
														d="M19.828 7.242H16.3V3h-3.194v4.242h-3.523v3.872h3.523v12.244h3.194V11.114h3.528v-3.872z"
														fill="#6001D2"
													/>
												</svg>
											</div>
											<div className="ml-4">
												<h4
													className={`text-sm font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Connect Yahoo Mail
												</h4>
												<p
													className={`text-xs ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													Secure your Yahoo messages with end-to-end encryption
												</p>
											</div>
										</div>
										<LucideIcons.ArrowRight className="h-5 w-5 text-gray-400" />
									</button>

									<button
										onClick={() => handleAddAccount("Other Provider")}
										className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-colors duration-200 ${
											darkMode
												? "border-gray-600 hover:bg-gray-700"
												: "border-gray-300 hover:bg-gray-50"
										}`}
									>
										<div className="flex items-center">
											<div
												className={`h-10 w-10 flex items-center justify-center rounded-full ${
													darkMode ? "bg-gray-700" : "bg-gray-100"
												}`}
											>
												<LucideIcons.Mail
													className={`h-6 w-6 ${
														darkMode ? "text-gray-400" : "text-gray-600"
													}`}
												/>
											</div>
											<div className="ml-4">
												<h4
													className={`text-sm font-medium ${
														darkMode ? "text-white" : "text-gray-900"
													}`}
												>
													Connect Other Email
												</h4>
												<p
													className={`text-xs ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													Connect any other email provider via IMAP/SMTP
												</p>
											</div>
										</div>
										<LucideIcons.ArrowRight className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="mt-6 flex justify-end">
									<button
										type="button"
										onClick={() => setShowAddAccountModal(false)}
										className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
											darkMode
												? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
												: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
										}`}
									>
										Cancel
									</button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Add custom CSS for toggle switch */}
			<style jsx>{`
				.toggle-checkbox:checked {
					transform: translateX(1.5rem);
				}
				.toggle-checkbox:checked + .toggle-label {
					background-color: #4f46e5;
				}
				
			`}</style>
		</div>
	);
}

export default EmailEncryption;
