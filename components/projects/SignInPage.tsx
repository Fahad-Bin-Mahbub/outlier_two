"use client";

import { useState, useEffect } from "react";
import {
	Info,
	EyeOff,
	Eye,
	LogIn,
	RefreshCw,
	CheckCircle,
	Moon,
	Sun,
	Github,
	Twitter,
	Facebook,
	Key,
	User,
	Shield,
	Settings,
	Menu,
} from "lucide-react";

export default function SignInPageExport() {
	const CORRECT_USERNAME = "andromeda_user";
	const CORRECT_PASSWORD = "st@rw@rs2023";

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [showMfa, setShowMfa] = useState(false);
	const [mfaCode, setMfaCode] = useState("");
	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		if (!password) {
			setPasswordStrength(0);
			return;
		}

		let strength = 0;

		if (password.length >= 8) strength += 1;

		if (/\d/.test(password)) strength += 1;

		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

		if (/[A-Z]/.test(password)) strength += 1;

		setPasswordStrength(strength);
	}, [password]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		if (!username || !password) {
			setError("Please enter both username and password.");
			return;
		}

		setIsLoading(true);

		setTimeout(() => {
			if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
				if (Math.random() > 0.5) {
					setShowMfa(true);
				} else {
					setIsLoggedIn(true);
				}
			} else {
				setError("Invalid username or password. Try using the hint button.");
			}
			setIsLoading(false);
		}, 800);
	};

	const handleMfaSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			setShowMfa(false);
			setIsLoggedIn(true);
			setIsLoading(false);
		}, 800);
	};

	const handleReset = () => {
		setUsername("");
		setPassword("");
		setError("");
		setIsLoggedIn(false);
		setShowHint(false);
		setShowMfa(false);
		setMfaCode("");
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleHint = () => {
		setShowHint(!showHint);
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const toggleMenu = () => {
		setShowMenu(!showMenu);
	};

	const getPasswordStrengthText = () => {
		switch (passwordStrength) {
			case 0:
				return "Weak";
			case 1:
				return "Fair";
			case 2:
				return "Moderate";
			case 3:
				return "Strong";
			case 4:
				return "Very Strong";
			default:
				return "";
		}
	};

	const getPasswordStrengthColor = () => {
		switch (passwordStrength) {
			case 0:
				return "bg-red-500";
			case 1:
				return "bg-orange-500";
			case 2:
				return "bg-yellow-500";
			case 3:
				return "bg-green-500";
			case 4:
				return "bg-emerald-500";
			default:
				return "bg-gray-200";
		}
	};

	const backgroundPattern = darkMode ? (
		<div className="absolute inset-0 overflow-hidden opacity-10">
			<div className="galaxy-stars absolute inset-0"></div>
		</div>
	) : (
		<div className="absolute inset-0 overflow-hidden opacity-10">
			<div className="light-particles absolute inset-0"></div>
		</div>
	);

	const renderLoginForm = () => (
		<div
			className={`${
				darkMode ? "bg-gray-800 text-white" : "bg-white"
			} rounded-xl shadow-lg overflow-hidden relative z-10 border ${
				darkMode ? "border-gray-700" : "border-gray-100"
			}`}
		>
			<div className="p-6">
				<form onSubmit={handleSubmit} noValidate className="space-y-5">
					{error && (
						<div
							className={`${
								darkMode
									? "bg-red-800 border-red-600"
									: "bg-red-50 border-red-500"
							} border-l-4 p-4 rounded-md animate-fadeIn`}
							role="alert"
							aria-live="assertive"
						>
							<div className="flex items-center">
								<svg
									className="h-5 w-5 text-red-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
								<span
									className={`text-sm font-medium ${
										darkMode ? "text-red-200" : "text-red-700"
									}`}
								>
									{error}
								</span>
							</div>
						</div>
					)}

					{showHint && (
						<div
							className={`${
								darkMode
									? "bg-blue-800 border-blue-600"
									: "bg-blue-50 border-blue-500"
							} border-l-4 p-4 rounded-md mb-4 animate-fadeIn`}
						>
							<div className="flex">
								<div className="flex-shrink-0">
									<Info
										className={`h-5 w-5 ${
											darkMode ? "text-blue-200" : "text-blue-500"
										}`}
									/>
								</div>
								<div className="ml-3">
									<p
										className={`text-sm ${
											darkMode ? "text-blue-200" : "text-blue-700"
										} font-medium`}
									>
										Hints:
									</p>
									<ul
										className={`mt-1 text-sm ${
											darkMode ? "text-blue-200" : "text-blue-700"
										} list-disc list-inside`}
									>
										<li>
											Username: Related to the name of the UI ("andromeda_user")
										</li>
										<li>
											Password: Combines a popular sci-fi franchise with the
											year 2023 ("st@rw@rs2023")
										</li>
									</ul>
								</div>
							</div>
						</div>
					)}

					<div className="relative">
						<label
							htmlFor="username"
							className={`block text-sm font-medium ${
								darkMode ? "text-gray-200" : "text-gray-700"
							} mb-1`}
						>
							Username
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<User
									className={`h-5 w-5 ${
										darkMode ? "text-gray-400" : "text-gray-400"
									}`}
								/>
							</div>
							<input
								id="username"
								name="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter your username"
								className={`w-full pl-10 pr-4 py-2 border ${
									darkMode
										? "bg-gray-700 border-gray-600 placeholder-gray-300 text-white"
										: "bg-white border-gray-300 placeholder-gray-400"
								} rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
								aria-describedby={error ? "error-message" : undefined}
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className={`block text-sm font-medium ${
								darkMode ? "text-gray-200" : "text-gray-700"
							} mb-1`}
						>
							Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Key
									className={`h-5 w-5 ${
										darkMode ? "text-gray-400" : "text-gray-400"
									}`}
								/>
							</div>
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className={`w-full pl-10 pr-10 py-2 border ${
									darkMode
										? "bg-gray-700 border-gray-600 placeholder-gray-300 text-white"
										: "bg-white border-gray-300 placeholder-gray-400"
								} rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
								aria-describedby={error ? "error-message" : undefined}
							/>
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
									darkMode
										? "text-gray-300 hover:text-white"
										: "text-gray-500 hover:text-gray-700"
								} transition-colors cursor-pointer`}
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>

						{}
						{password && (
							<div className="mt-2 animate-fadeIn">
								<div className="flex justify-between items-center mb-1">
									<span
										className={`text-xs ${
											darkMode ? "text-gray-200" : "text-gray-500"
										}`}
									>
										Password strength:{" "}
										<span
											className={`font-medium ${
												passwordStrength >= 3
													? darkMode
														? "text-emerald-300"
														: "text-emerald-600"
													: darkMode
													? "text-yellow-300"
													: "text-yellow-600"
											}`}
										>
											{getPasswordStrengthText()}
										</span>
									</span>
								</div>
								<div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
									<div
										className={`h-full ${getPasswordStrengthColor()} transition-all duration-300 ease-out`}
										style={{ width: `${(passwordStrength / 4) * 100}%` }}
									></div>
								</div>
							</div>
						)}
					</div>

					<div className="flex items-center mt-2">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							checked={rememberMe}
							onChange={() => setRememberMe(!rememberMe)}
							className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer ${
								darkMode ? "bg-gray-600 border-gray-500" : ""
							}`}
						/>
						<label
							htmlFor="remember-me"
							className={`ml-2 block text-sm ${
								darkMode ? "text-gray-200" : "text-gray-700"
							} cursor-pointer`}
						>
							Remember me
						</label>

						<button
							type="button"
							className={`ml-auto text-sm font-medium ${
								darkMode
									? "text-indigo-300 hover:text-indigo-200"
									: "text-indigo-600 hover:text-indigo-500"
							} cursor-pointer`}
						>
							Forgot password?
						</button>
					</div>

					<div className="flex items-center justify-between pt-2">
						<button
							type="button"
							onClick={toggleHint}
							className={`text-sm font-medium ${
								darkMode
									? "text-indigo-300 hover:text-indigo-200"
									: "text-indigo-600 hover:text-indigo-500"
							} flex items-center transition-colors cursor-pointer`}
						>
							<Info className="h-4 w-4 mr-1" />
							{showHint ? "Hide hint" : "Need a hint?"}
						</button>

						<button
							type="button"
							onClick={handleReset}
							className={`text-sm font-medium ${
								darkMode
									? "text-indigo-300 hover:text-indigo-200"
									: "text-indigo-600 hover:text-indigo-500"
							} flex items-center transition-colors cursor-pointer`}
						>
							<RefreshCw className="h-4 w-4 mr-1" />
							Reset form
						</button>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
							isLoading
								? "opacity-70 cursor-not-allowed"
								: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
						} transition-all duration-200 transform hover:-translate-y-0.5`}
						aria-label={isLoading ? "Signing in, please wait" : "Sign in"}
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
								Signing in...
							</>
						) : (
							<>
								<LogIn className="h-4 w-4 mr-1" />
								Sign in
							</>
						)}
					</button>

					{}
					<div className="relative my-3">
						<div className="absolute inset-0 flex items-center">
							<div
								className={`w-full border-t ${
									darkMode ? "border-gray-600" : "border-gray-300"
								}`}
							></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span
								className={`px-2 ${
									darkMode
										? "bg-gray-800 text-gray-300"
										: "bg-white text-gray-500"
								}`}
							>
								Or continue with
							</span>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-3 mt-1">
						<button
							type="button"
							className={`py-2 px-4 flex justify-center items-center border rounded-md shadow-sm text-sm font-medium ${
								darkMode
									? "border-gray-600 hover:bg-gray-700 text-gray-200"
									: "border-gray-300 hover:bg-gray-50 text-gray-700"
							} transition-colors cursor-pointer`}
						>
							<Github className="h-4 w-4" />
						</button>
						<button
							type="button"
							className={`py-2 px-4 flex justify-center items-center border rounded-md shadow-sm text-sm font-medium ${
								darkMode
									? "border-gray-600 hover:bg-gray-700 text-gray-200"
									: "border-gray-300 hover:bg-gray-50 text-gray-700"
							} transition-colors cursor-pointer`}
						>
							<Twitter className="h-4 w-4" />
						</button>
						<button
							type="button"
							className={`py-2 px-4 flex justify-center items-center border rounded-md shadow-sm text-sm font-medium ${
								darkMode
									? "border-gray-600 hover:bg-gray-700 text-gray-200"
									: "border-gray-300 hover:bg-gray-50 text-gray-700"
							} transition-colors cursor-pointer`}
						>
							<Facebook className="h-4 w-4" />
						</button>
					</div>
				</form>
			</div>

			<div
				className={`px-6 py-3 ${
					darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-500"
				} text-xs text-center`}
			>
				For demonstration purposes only. Remember to secure credentials in a
				production environment.
			</div>
		</div>
	);

	const renderMfaForm = () => (
		<div
			className={`${
				darkMode ? "bg-gray-800 text-white" : "bg-white"
			} rounded-xl shadow-lg overflow-hidden relative z-10 border ${
				darkMode ? "border-gray-700" : "border-gray-100"
			}`}
		>
			<div className="p-6">
				<div className="text-center mb-6">
					<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
						<Shield className="h-8 w-8 text-indigo-600" />
					</div>
					<h3
						className={`text-xl font-semibold ${
							darkMode ? "text-white" : "text-gray-800"
						} mb-2`}
					>
						Two-factor Authentication
					</h3>
					<p className={`${darkMode ? "text-gray-200" : "text-gray-600"} mb-2`}>
						Please enter the verification code from your authenticator app
					</p>
					<p
						className={`text-xs ${
							darkMode ? "text-gray-300" : "text-gray-500"
						}`}
					>
						(For demo: any 6 digits will work)
					</p>
				</div>

				<form onSubmit={handleMfaSubmit} className="space-y-5">
					<div>
						<div className="mt-1">
							<input
								type="text"
								maxLength="6"
								placeholder="000000"
								value={mfaCode}
								onChange={(e) =>
									setMfaCode(e.target.value.replace(/\D/g, "").substr(0, 6))
								}
								className={`block w-full px-3 py-3 text-center text-xl tracking-widest ${
									darkMode
										? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
										: "border-gray-300 placeholder-gray-400"
								} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
								required
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading || mfaCode.length !== 6}
						className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
							isLoading || mfaCode.length !== 6
								? "opacity-70 cursor-not-allowed"
								: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
						} transition-all duration-200`}
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
								Verifying...
							</>
						) : (
							"Verify"
						)}
					</button>

					<div className="text-center">
						<button
							type="button"
							onClick={handleReset}
							className={`text-sm font-medium ${
								darkMode
									? "text-indigo-300 hover:text-indigo-200"
									: "text-indigo-600 hover:text-indigo-500"
							} cursor-pointer`}
						>
							Back to login
						</button>
					</div>
				</form>
			</div>
		</div>
	);

	const renderWelcomeScreen = () => (
		<div
			className={`${
				darkMode ? "bg-gray-800 text-white" : "bg-white"
			} rounded-xl shadow-lg overflow-hidden relative z-10 border ${
				darkMode ? "border-gray-700" : "border-gray-100"
			}`}
			aria-live="polite"
		>
			<div className="p-8 text-center">
				<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
					<CheckCircle className="h-8 w-8 text-green-600" />
				</div>
				<h3
					className={`text-xl font-semibold ${
						darkMode ? "text-white" : "text-gray-800"
					} mb-2 animate-fadeIn`}
				>
					Welcome back, <span className="text-indigo-500">{username}</span>!
				</h3>
				<p className={`${darkMode ? "text-gray-200" : "text-gray-600"} mb-6`}>
					You have successfully signed in to Andromeda UI.
				</p>

				<div
					className={`${
						darkMode ? "bg-gray-900" : "bg-gray-50"
					} p-5 rounded-lg mb-6 text-sm ${
						darkMode ? "text-gray-200" : "text-gray-700"
					} animate-fadeIn`}
				>
					<div className="flex items-center justify-center mb-4">
						<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
							<svg
								className="w-10 h-10 text-indigo-600"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					</div>
					<p className="font-medium mb-2 text-base">Account Details:</p>
					<div
						className={`grid grid-cols-2 gap-2 ${
							darkMode ? "bg-gray-800" : "bg-white"
						} p-3 rounded-md`}
					>
						<p className="text-left">Username:</p>
						<p className="text-right font-medium">{username}</p>
						<p className="text-left">Account Type:</p>
						<p className="text-right font-medium">Administrator</p>
						<p className="text-left">Last Login:</p>
						<p className="text-right font-medium">
							{new Date().toLocaleString()}
						</p>
						<p className="text-left">Status:</p>
						<p className="text-right font-medium text-green-500">Active</p>
					</div>
				</div>

				<div className="flex space-x-3">
					<button
						onClick={handleReset}
						className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer"
					>
						Sign out
					</button>

					<button
						className={`flex justify-center items-center py-2 px-4 border ${
							darkMode
								? "border-gray-600 hover:bg-gray-700"
								: "border-gray-300 hover:bg-gray-50"
						} rounded-md shadow-sm text-sm font-medium ${
							darkMode ? "text-gray-200" : "text-gray-700"
						} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer`}
					>
						<Settings className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<div
			className={`min-h-screen relative ${
				darkMode
					? "bg-gray-900"
					: "bg-gradient-to-br from-indigo-50 to-purple-100"
			} flex flex-col justify-center p-4 transition-colors duration-500`}
		>
			{backgroundPattern}

			{}
			<div className="absolute top-4 right-4 z-20">
				<button
					onClick={toggleMenu}
					className={`p-2 rounded-full ${
						darkMode
							? "bg-gray-800 text-gray-200 hover:bg-gray-700"
							: "bg-white text-gray-700 hover:bg-gray-100"
					} shadow-md transition-colors duration-200 cursor-pointer`}
					aria-label="Menu"
				>
					<Menu className="h-5 w-5" />
				</button>

				{showMenu && (
					<div
						className={`absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg ${
							darkMode
								? "bg-gray-800 ring-1 ring-black ring-opacity-5"
								: "bg-white ring-1 ring-black ring-opacity-5"
						} overflow-hidden transform origin-top-right transition-all duration-200 ease-out animate-fadeIn`}
					>
						<div className="py-1">
							<button
								onClick={toggleDarkMode}
								className={`flex items-center w-full px-4 py-2 text-sm ${
									darkMode
										? "text-gray-200 hover:bg-gray-700"
										: "text-gray-700 hover:bg-gray-100"
								} cursor-pointer`}
							>
								{darkMode ? (
									<>
										<Sun className="h-4 w-4 mr-2" />
										Light Mode
									</>
								) : (
									<>
										<Moon className="h-4 w-4 mr-2" />
										Dark Mode
									</>
								)}
							</button>
							<button
								className={`flex items-center w-full px-4 py-2 text-sm ${
									darkMode
										? "text-gray-200 hover:bg-gray-700"
										: "text-gray-700 hover:bg-gray-100"
								} cursor-pointer`}
							>
								<Info className="h-4 w-4 mr-2" />
								Help & Support
							</button>
						</div>
					</div>
				)}
			</div>

			<div className="w-full max-w-md mx-auto">
				<div className="text-center mb-8 animate-fadeIn">
					<div className="flex justify-center mb-4">
						<div
							className={`${
								darkMode ? "bg-indigo-700" : "bg-indigo-600"
							} text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:rotate-3 hover:scale-110 duration-300`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-10 w-10"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
								<path
									fillRule="evenodd"
									d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					</div>
					<h2
						className={`text-3xl font-bold ${
							darkMode ? "text-white" : "text-indigo-700"
						} animate-fadeIn`}
					>
						Andromeda UI
					</h2>
					<h3
						className={`text-xl font-semibold ${
							darkMode ? "text-gray-200" : "text-gray-700"
						} animate-fadeIn`}
					>
						Secure Sign-In
					</h3>
				</div>

				{!isLoggedIn && !showMfa && renderLoginForm()}
				{showMfa && renderMfaForm()}
				{isLoggedIn && renderWelcomeScreen()}

				<div
					className={`mt-6 text-center text-sm ${
						darkMode ? "text-gray-400" : "text-gray-500"
					}`}
				>
					<p>© {new Date().getFullYear()} Andromeda UI. All rights reserved.</p>
				</div>
			</div>

			{}
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.4s ease-out forwards;
				}

				@keyframes pulse {
					0%,
					100% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.05);
					}
				}

				.galaxy-stars {
					background-image: radial-gradient(
							2px 2px at 20px 30px,
							#eee,
							rgba(0, 0, 0, 0)
						),
						radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
						radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0, 0, 0, 0)),
						radial-gradient(2px 2px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
						radial-gradient(2px 2px at 130px 80px, #fff, rgba(0, 0, 0, 0)),
						radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0, 0, 0, 0));
					background-repeat: repeat;
					background-size: 200px 200px;
				}

				.light-particles {
					background-image: linear-gradient(
							to right,
							rgba(128, 120, 255, 0.1) 1px,
							transparent 1px
						),
						linear-gradient(
							to bottom,
							rgba(128, 120, 255, 0.1) 1px,
							transparent 1px
						);
					background-size: 14px 14px;
				}
			`}</style>
		</div>
	);
}
