"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	FaCode,
	FaMobile,
	FaPalette,
	FaChartLine,
	FaSearch,
	FaShoppingCart,
	FaTwitter,
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaMoon,
	FaSun,
	FaEnvelope,
	FaPhone,
	FaMapMarkerAlt,
	FaQuoteLeft,
	FaCheck,
} from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

interface FormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	company: string;
	jobTitle: string;
	subject: string;
	message: string;
	budget: string;
	timeline: string;
	hearAbout: string;
}

interface FormErrors {
	[key: string]: string;
}

interface FieldTouched {
	[key: string]: boolean;
}

const useDarkMode = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem("darkMode");
		if (saved) {
			setIsDark(JSON.parse(saved));
		} else {
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			setIsDark(prefersDark);
		}
	}, []);

	const toggleDarkMode = () => {
		const newMode = !isDark;
		setIsDark(newMode);
		localStorage.setItem("darkMode", JSON.stringify(newMode));
	};

	return { isDark, toggleDarkMode };
};

const LoadingScreen: React.FC<{ onComplete: () => void; isDark: boolean }> = ({
	onComplete,
	isDark,
}) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					setTimeout(onComplete, 500);
					return 100;
				}
				return prev + Math.random() * 15;
			});
		}, 200);

		return () => clearInterval(interval);
	}, [onComplete]);

	return (
		<div
			className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-500 ${
				isDark
					? "bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
					: "bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600"
			}`}
			role="status"
			aria-live="polite"
			aria-label="Loading application"
		>
			<div className="absolute inset-0 overflow-hidden" aria-hidden="true">
				<div
					className={`absolute top-20 left-20 w-32 h-32 rounded-full animate-pulse ${
						isDark ? "bg-purple-700/30" : "bg-white/20"
					}`}
					style={{ animationDuration: "4s" }}
				/>
				<div
					className={`absolute bottom-20 right-20 w-24 h-24 rounded-full animate-bounce ${
						isDark ? "bg-blue-600/20" : "bg-teal-300/30"
					}`}
					style={{ animationDuration: "6s" }}
				/>
				<div
					className={`absolute top-1/2 left-10 w-16 h-16 rounded-full animate-ping ${
						isDark ? "bg-indigo-700/20" : "bg-purple-300/25"
					}`}
					style={{ animationDuration: "8s" }}
				/>
			</div>

			<div className="text-center relative z-10">
				<div className="mb-8 relative">
					<div
						className={`w-36 h-36 rounded-3xl shadow-2xl flex items-center justify-center mb-6 mx-auto transition-all duration-300 hover:scale-105 ${
							isDark
								? "bg-gray-800 border border-purple-700/30"
								: "bg-white/90 backdrop-blur-sm"
						}`}
					>
						<svg
							width="70"
							height="70"
							viewBox="0 0 70 70"
							className={isDark ? "text-indigo-400" : "text-indigo-600"}
							aria-hidden="true"
						>
							<path
								d="M35 12L47 24L35 36L23 24L35 12Z"
								fill="currentColor"
								className="animate-pulse"
							/>
							<circle
								cx="35"
								cy="42"
								r="10"
								fill="currentColor"
								opacity="0.7"
							/>
							<path
								d="M17 52L35 58L53 52"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								className="animate-bounce"
								strokeLinecap="round"
							/>
						</svg>
					</div>
				</div>

				<h1
					className={`text-5xl font-bold mb-2 font-playfair ${
						isDark ? "text-white" : "text-white"
					}`}
				>
					MythForm
				</h1>
				<p
					className={`text-xl mb-12 font-poppins ${
						isDark ? "text-purple-200" : "text-white/90"
					}`}
				>
					Creative Studio
				</p>

				<div className="w-64 mx-auto">
					<div
						className={`rounded-full h-2.5 mb-4 ${
							isDark ? "bg-gray-700" : "bg-white/20"
						}`}
						role="progressbar"
						aria-valuenow={Math.round(progress)}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="Loading progress"
					>
						<div
							className={`rounded-full h-2.5 transition-all duration-300 ease-out ${
								isDark
									? "bg-gradient-to-r from-blue-500 to-purple-500"
									: "bg-gradient-to-r from-teal-300 to-white"
							}`}
							style={{ width: `${progress}%` }}
						/>
					</div>
					<p className={`font-poppins ${isDark ? "text-white" : "text-white"}`}>
						Loading Experience
					</p>
					<p
						className={`text-sm font-poppins ${
							isDark ? "text-purple-200" : "text-white/80"
						}`}
						aria-live="polite"
					>
						{Math.round(progress)}%
					</p>
				</div>
			</div>
		</div>
	);
};

const SuccessModal: React.FC<{ isDark: boolean; onClose: () => void }> = ({
	isDark,
	onClose,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}

			if (e.key === "Tab") {
				if (document.activeElement === closeButtonRef.current && !e.shiftKey) {
					e.preventDefault();
					closeButtonRef.current?.focus();
				} else if (
					document.activeElement === closeButtonRef.current &&
					e.shiftKey
				) {
					e.preventDefault();
					closeButtonRef.current?.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		closeButtonRef.current?.focus();

		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);

			document.body.style.overflow = "";
		};
	}, [onClose]);

	return (
		<div
			ref={modalRef}
			className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
			role="dialog"
			aria-modal="true"
			aria-labelledby="success-title"
			aria-describedby="success-description"
			onClick={(e) => {
				if (e.target === modalRef.current) onClose();
			}}
		>
			<div
				className={`p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 transform animate-bounce-in ${
					isDark ? "bg-gray-800 border border-purple-700/30" : "bg-white"
				}`}
			>
				<div
					className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
						isDark
							? "bg-gradient-to-br from-indigo-600 to-purple-600"
							: "bg-gradient-to-br from-teal-500 to-blue-600"
					}`}
					aria-hidden="true"
				>
					<FaCheck className="w-10 h-10 text-white" />
				</div>
				<h3
					id="success-title"
					className={`text-2xl font-bold mb-3 font-playfair ${
						isDark ? "text-white" : "text-gray-900"
					}`}
				>
					Form Submitted Successfully!
				</h3>
				<p
					id="success-description"
					className={`text-base mb-6 font-poppins ${
						isDark ? "text-purple-200" : "text-gray-600"
					}`}
				>
					Thank you for reaching out. We'll get back to you within 24 hours.
				</p>
				<button
					ref={closeButtonRef}
					onClick={onClose}
					className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
						isDark
							? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white focus:ring-indigo-400"
							: "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white focus:ring-blue-500"
					}`}
					aria-label="Close success message dialog"
				>
					Close
				</button>
			</div>
		</div>
	);
};

const CustomDropdown: React.FC<{
	options: string[];
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	error?: string;
	onBlur?: () => void;
	isDark: boolean;
	id: string;
	"aria-describedby"?: string;
	disabled?: boolean;
}> = ({
	options,
	value,
	onChange,
	placeholder,
	error,
	onBlur,
	isDark,
	id,
	"aria-describedby": ariaDescribedBy,
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		optionRefs.current = optionRefs.current.slice(0, options.length);
	}, [options]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setFocusedOptionIndex(-1);
				if (onBlur) onBlur();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onBlur]);

	useEffect(() => {
		if (isOpen && focusedOptionIndex >= 0) {
			optionRefs.current[focusedOptionIndex]?.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [isOpen, focusedOptionIndex]);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (disabled) return;

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					const selectedIndex = options.findIndex((option) => option === value);
					setFocusedOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
				} else {
					setFocusedOptionIndex((prev) =>
						prev < options.length - 1 ? prev + 1 : 0
					);
				}
				break;
			case "ArrowUp":
				event.preventDefault();
				if (isOpen) {
					setFocusedOptionIndex((prev) =>
						prev > 0 ? prev - 1 : options.length - 1
					);
				}
				break;
			case "Enter":
			case " ":
				event.preventDefault();
				if (isOpen && focusedOptionIndex >= 0) {
					onChange(options[focusedOptionIndex]);
					setIsOpen(false);
					setFocusedOptionIndex(-1);
					buttonRef.current?.focus();
				} else {
					setIsOpen(!isOpen);
					if (!isOpen) {
						const selectedIndex = options.findIndex(
							(option) => option === value
						);
						setFocusedOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
					}
				}
				break;
			case "Escape":
				event.preventDefault();
				setIsOpen(false);
				setFocusedOptionIndex(-1);
				buttonRef.current?.focus();
				if (onBlur) onBlur();
				break;
			case "Tab":
				setIsOpen(false);
				setFocusedOptionIndex(-1);
				if (onBlur) onBlur();
				break;
			case "Home":
				if (isOpen) {
					event.preventDefault();
					setFocusedOptionIndex(0);
				}
				break;
			case "End":
				if (isOpen) {
					event.preventDefault();
					setFocusedOptionIndex(options.length - 1);
				}
				break;
		}
	};

	const handleOptionClick = (option: string, index: number) => {
		if (disabled) return;
		onChange(option);
		setIsOpen(false);
		setFocusedOptionIndex(-1);
		buttonRef.current?.focus();
	};

	const getOptionBackground = (index: number, option: string) => {
		if (index === focusedOptionIndex) {
			return isDark ? "bg-indigo-600 text-white" : "bg-teal-600 text-white";
		}
		if (value === option) {
			return isDark
				? "bg-indigo-500/30 text-white"
				: "bg-teal-100 text-teal-800";
		}
		return isDark
			? "text-white hover:bg-gray-600"
			: "text-gray-900 hover:bg-teal-50";
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				ref={buttonRef}
				type="button"
				id={id}
				onClick={() => {
					if (disabled) return;
					setIsOpen(!isOpen);
					if (!isOpen) {
						const selectedIndex = options.findIndex(
							(option) => option === value
						);
						setFocusedOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
					}
				}}
				onBlur={() => {
					if (onBlur && !isOpen) onBlur();
				}}
				onKeyDown={handleKeyDown}
				disabled={disabled}
				className={`w-full px-4 py-3 text-left border-2 rounded-xl transition-all duration-200 font-poppins transform ${
					disabled
						? "opacity-70 cursor-not-allowed"
						: "hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5"
				} ${
					error
						? `${
								isDark
									? "border-red-400 bg-red-900/20 text-white"
									: "border-red-500 bg-red-50 text-gray-900"
						  } focus:border-red-400`
						: `${
								isDark
									? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400"
									: "bg-white border-teal-500 text-gray-900 hover:border-teal-500"
						  } ${isDark ? "focus:border-indigo-400" : "focus:border-teal-600"}`
				} focus:outline-none focus:ring-2 ${
					isDark ? "focus:ring-indigo-400/20" : "focus:ring-teal-600/20"
				}`}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-describedby={ariaDescribedBy}
				aria-invalid={error ? "true" : "false"}
				aria-label={value ? `Selected: ${value}` : placeholder}
			>
				<span
					className={`block truncate ${
						value
							? isDark
								? "text-white"
								: "text-gray-900"
							: isDark
							? "text-gray-300"
							: "text-gray-500"
					}`}
				>
					{value || placeholder}
				</span>
				<span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
					<svg
						className={`w-5 h-5 transition-transform duration-200 ${
							isOpen ? "rotate-180" : ""
						} ${isDark ? "text-purple-300" : "text-gray-400"}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</span>
			</button>

			{isOpen && !disabled && (
				<div
					ref={listRef}
					className={`absolute z-50 w-full mt-1 border rounded-xl shadow-xl transform animate-fade-in overflow-hidden ${
						isDark
							? "bg-gray-700 border-purple-600/30"
							: "bg-white border-teal-500"
					}`}
					role="listbox"
					aria-labelledby={id}
					tabIndex={-1}
				>
					<div
						className={`max-h-48 overflow-y-auto overflow-x-hidden ${
							isDark
								? "scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700"
								: "scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-100"
						}`}
					>
						{options.map((option, index) => (
							<div
								key={index}
								ref={(el) => (optionRefs.current[index] = el)}
								role="option"
								aria-selected={value === option}
								id={`${id}-option-${index}`}
								onClick={() => handleOptionClick(option, index)}
								onMouseEnter={() => setFocusedOptionIndex(index)}
								onMouseLeave={() => setFocusedOptionIndex(-1)}
								className={`w-full px-4 py-3 text-left transition-all duration-150 font-poppins cursor-pointer ${
									index === 0 ? "rounded-t-xl" : ""
								} ${
									index === options.length - 1 ? "rounded-b-xl" : ""
								} ${getOptionBackground(
									index,
									option
								)} hover:scale-[1.02] hover:shadow-sm`}
								tabIndex={-1}
							>
								<span className="block truncate">{option}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const TestimonialCard: React.FC<{
	quote: string;
	author: string;
	role: string;
	company: string;
	isDark: boolean;
}> = ({ quote, author, role, company, isDark }) => {
	return (
		<div
			className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
				isDark
					? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
					: "bg-gradient-to-br from-white to-teal-50/30"
			}`}
		>
			<FaQuoteLeft
				className={`w-10 h-10 mb-4 ${
					isDark ? "text-indigo-400" : "text-teal-500"
				}`}
			/>
			<p
				className={`mb-4 font-poppins italic ${
					isDark ? "text-purple-200" : "text-gray-700"
				}`}
			>
				"{quote}"
			</p>
			<div>
				<p
					className={`font-bold font-playfair ${
						isDark ? "text-white" : "text-gray-900"
					}`}
				>
					{author}
				</p>
				<p
					className={`text-sm font-poppins ${
						isDark ? "text-indigo-300" : "text-teal-700"
					}`}
				>
					{role}, {company}
				</p>
			</div>
		</div>
	);
};

const FeatureCard: React.FC<{
	icon: React.ReactNode;
	title: string;
	description: string;
	isDark: boolean;
}> = ({ icon, title, description, isDark }) => {
	return (
		<div
			className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
				isDark
					? "bg-gradient-to-br from-gray-800/80 to-gray-800 border border-purple-700/20"
					: "bg-gradient-to-br from-white to-teal-50/30 backdrop-blur-sm"
			}`}
		>
			<div
				className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
					isDark ? "bg-indigo-500/20" : "bg-teal-100"
				}`}
			>
				<div
					className={`text-2xl ${isDark ? "text-indigo-400" : "text-teal-600"}`}
				>
					{icon}
				</div>
			</div>
			<h3
				className={`text-xl font-bold mb-2 font-playfair ${
					isDark ? "text-white" : "text-gray-900"
				}`}
			>
				{title}
			</h3>
			<p
				className={`font-poppins ${
					isDark ? "text-purple-200" : "text-gray-700"
				}`}
			>
				{description}
			</p>
		</div>
	);
};

const NavLink: React.FC<{
	href: string;
	label: string;
	isDark: boolean;
	active?: boolean;
	onClick?: () => void;
}> = ({ href, label, isDark, active = false, onClick }) => {
	return (
		<a
			href={href}
			onClick={onClick}
			className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
				active
					? isDark
						? "bg-gradient-to-r from-indigo-800 to-purple-800 text-white"
						: "bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800"
					: isDark
					? "text-purple-200 hover:bg-gray-700 hover:text-white"
					: "text-gray-700 hover:bg-teal-50 hover:text-teal-800"
			} focus:outline-none focus:ring-2 ${
				isDark ? "focus:ring-indigo-400" : "focus:ring-teal-500"
			}`}
		>
			{label}
		</a>
	);
};

const ContactForm: React.FC = () => {
	const { isDark, toggleDarkMode } = useDarkMode();
	const [isLoading, setIsLoading] = useState(true);
	const [showMainContent, setShowMainContent] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		company: "",
		jobTitle: "",
		subject: "",
		message: "",
		budget: "",
		timeline: "",
		hearAbout: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<FieldTouched>({});
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [announceMessage, setAnnounceMessage] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("home");
	const [formCompletion, setFormCompletion] = useState(0);

	const errorSummaryRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const announceRef = useRef<HTMLDivElement>(null);
	const firstNameRef = useRef<HTMLInputElement>(null);

	const homeRef = useRef<HTMLElement>(null);
	const servicesRef = useRef<HTMLElement>(null);
	const testimonialsRef = useRef<HTMLElement>(null);
	const contactFormRef = useRef<HTMLElement>(null);
	const faqRef = useRef<HTMLElement>(null);

	const emailPattern =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const phonePattern =
		/^(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

	const budgetOptions = [
		"$5,000 - $10,000",
		"$10,000 - $25,000",
		"$25,000 - $50,000",
		"$50,000 - $100,000",
		"$100,000+",
	];

	const timelineOptions = [
		"1-2 weeks",
		"1 month",
		"2-3 months",
		"3-6 months",
		"6+ months",
	];

	const hearAboutOptions = [
		"Social Media",
		"Referral",
		"Search Engine",
		"Advertisement",
		"Event/Conference",
		"Other",
	];

	const formFields = [
		"firstName",
		"lastName",
		"email",
		"phone",
		"company",
		"jobTitle",
		"subject",
		"budget",
		"timeline",
		"hearAbout",
		"message",
	];

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
	}, [isDark]);

	useEffect(() => {
		if (showMainContent && !isLoading && firstNameRef.current) {
			firstNameRef.current.focus();
		}
	}, [showMainContent, isLoading]);

	useEffect(() => {
		if (!submitSuccess && hasSubmitted && firstNameRef.current) {
			firstNameRef.current.focus();
		}
	}, [submitSuccess, hasSubmitted]);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100;

			if (homeRef.current && scrollPosition < homeRef.current.offsetHeight) {
				setActiveSection("home");
			} else if (
				servicesRef.current &&
				scrollPosition <
					servicesRef.current.offsetTop + servicesRef.current.offsetHeight
			) {
				setActiveSection("services");
			} else if (
				testimonialsRef.current &&
				scrollPosition <
					testimonialsRef.current.offsetTop +
						testimonialsRef.current.offsetHeight
			) {
				setActiveSection("testimonials");
			} else if (
				contactFormRef.current &&
				scrollPosition <
					contactFormRef.current.offsetTop + contactFormRef.current.offsetHeight
			) {
				setActiveSection("contact-form");
			} else if (faqRef.current) {
				setActiveSection("faq");
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const requiredFields = [
			"firstName",
			"lastName",
			"email",
			"phone",
			"company",
			"subject",
			"message",
			"budget",
			"timeline",
			"hearAbout",
		];

		const validFields = requiredFields.filter(
			(field) => formData[field as keyof FormData] && !errors[field]
		);

		const percentage = Math.round(
			(validFields.length / requiredFields.length) * 100
		);
		setFormCompletion(percentage);
	}, [formData, errors]);

	const announceToScreenReader = (message: string) => {
		setAnnounceMessage(message);
		setTimeout(() => setAnnounceMessage(""), 1000);
	};

	const scrollToSection = (sectionId: string) => {
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: "smooth" });
			setActiveSection(sectionId);
			setIsMenuOpen(false);
		}
	};

	const validateField = (
		name: string,
		value: string,
		isTouched: boolean = false
	): string => {
		switch (name) {
			case "firstName":
			case "lastName":
				if (!value.trim())
					return `${name === "firstName" ? "First" : "Last"} name is required`;
				if (value.trim().length < 2)
					return `${
						name === "firstName" ? "First" : "Last"
					} name must be at least 2 characters`;
				return "";

			case "email":
				if (!value.trim()) return "Email address is required";
				return !emailPattern.test(value)
					? "Please enter a valid email address in the format: name@example.com"
					: "";

			case "phone":
				if (!value.trim()) return "Phone number is required";
				return !phonePattern.test(value.replace(/\s/g, ""))
					? "Please enter a valid phone number (e.g., +1 (123) 456-7890)"
					: "";

			case "company":
				return !value.trim() ? "Company name is required" : "";

			case "subject":
				if (!value.trim()) return "Subject is required";
				return value.length < 5
					? "Subject must be at least 5 characters long"
					: "";

			case "message":
				if (!value.trim()) return "Message is required";
				return value.length < 10
					? "Message must be at least 10 characters long"
					: "";

			case "budget":
				return !value
					? "Please select a budget range from the dropdown menu"
					: "";

			case "timeline":
				return !value
					? "Please select a project timeline from the dropdown menu"
					: "";

			case "hearAbout":
				return !value
					? "Please select how you heard about us from the dropdown menu"
					: "";

			default:
				return "";
		}
	};

	const handleInputChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (touched[name] || hasSubmitted) {
			const error = validateField(name, value, true);
			setErrors((prev) => {
				const newErrors = { ...prev, [name]: error };

				if (prev[name] && !error) {
					announceToScreenReader(`${name} field error resolved`);
				}

				return newErrors;
			});
		}
	};

	const handleBlur = (name: string) => {
		setTouched((prev) => ({ ...prev, [name]: true }));
		const error = validateField(name, formData[name as keyof FormData], true);
		setErrors((prev) => {
			const newErrors = { ...prev, [name]: error };

			if (!prev[name] && error) {
				announceToScreenReader(`Error in ${name}: ${error}`);
			}

			return newErrors;
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setHasSubmitted(true);

		const newErrors: FormErrors = {};
		const newTouched: FieldTouched = {};

		Object.keys(formData).forEach((key) => {
			newTouched[key] = true;
			const error = validateField(key, formData[key as keyof FormData], true);
			if (error) newErrors[key] = error;
		});

		setTouched(newTouched);
		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			const errorCount = Object.keys(newErrors).length;
			announceToScreenReader(
				`Form submission failed. Please correct ${errorCount} error${
					errorCount > 1 ? "s" : ""
				} before submitting.`
			);

			setTimeout(() => {
				errorSummaryRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
				errorSummaryRef.current?.focus();
			}, 100);
			return;
		}

		setIsSubmitting(true);
		announceToScreenReader("Submitting form, please wait...");

		const progressBar = document.createElement("div");
		progressBar.className = isDark
			? "fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 z-50"
			: "fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 z-50";
		document.body.appendChild(progressBar);

		let width = 0;
		const interval = setInterval(() => {
			if (width >= 90) {
				clearInterval(interval);
			} else {
				width += 5;
				progressBar.style.width = width + "%";
			}
		}, 100);

		await new Promise((resolve) => setTimeout(resolve, 2000));

		clearInterval(interval);
		progressBar.style.width = "100%";
		setTimeout(() => {
			document.body.removeChild(progressBar);
		}, 300);

		setIsSubmitting(false);
		setSubmitSuccess(true);
		announceToScreenReader(
			"Form submitted successfully! We will get back to you within 24 hours."
		);
	};

	const handleSuccessClose = () => {
		setSubmitSuccess(false);
		setHasSubmitted(false);
		setFormData({
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			company: "",
			jobTitle: "",
			subject: "",
			message: "",
			budget: "",
			timeline: "",
			hearAbout: "",
		});
		setTouched({});
		setErrors({});
		announceToScreenReader(
			"Form has been reset and is ready for a new message."
		);

		setTimeout(() => {
			firstNameRef.current?.focus();
		}, 100);
	};

	const getErrorSummary = () => {
		if (!hasSubmitted) return [];
		return Object.entries(errors)
			.filter(([_, error]) => error)
			.map(([field, error]) => ({ field, error }));
	};

	const handleLogoClick = () => {
		setShowMainContent(false);
		setIsLoading(true);
	};

	const formatPhoneNumber = (value: string) => {
		const digits = value.replace(/\D/g, "");

		if (digits.length <= 3) {
			return digits;
		} else if (digits.length <= 6) {
			return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
		} else if (digits.length <= 10) {
			return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
		} else {
			return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(
				4,
				7
			)}-${digits.slice(7, 11)}`;
		}
	};

	if (isLoading) {
		return (
			<LoadingScreen
				onComplete={() => {
					setIsLoading(false);
					setShowMainContent(true);
				}}
				isDark={isDark}
			/>
		);
	}

	const errorSummary = getErrorSummary();

	return (
		<div
			className={`min-h-screen transition-all duration-500 relative ${
				isDark
					? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
					: "bg-gradient-to-br from-teal-50 via-white to-blue-50"
			}`}
		>
			<div
				ref={announceRef}
				aria-live="assertive"
				aria-atomic="true"
				className="sr-only"
				role="status"
			>
				{announceMessage}
			</div>

			<div
				className="absolute inset-0 overflow-hidden pointer-events-none"
				aria-hidden="true"
			>
				<div
					className={`absolute top-20 left-20 w-64 h-64 rounded-full animate-pulse ${
						isDark ? "bg-purple-900/10" : "bg-teal-200/10"
					}`}
					style={{ animationDuration: "6s" }}
				/>
				<div
					className={`absolute bottom-32 right-32 w-48 h-48 rounded-full animate-bounce ${
						isDark ? "bg-indigo-900/8" : "bg-blue-100/15"
					}`}
					style={{ animationDuration: "8s" }}
				/>
				<div
					className={`absolute top-1/2 left-16 w-32 h-32 rounded-full animate-ping ${
						isDark ? "bg-purple-800/12" : "bg-teal-200/20"
					}`}
					style={{ animationDuration: "10s" }}
				/>
				<div
					className={`absolute top-32 right-20 w-20 h-20 rounded-full animate-pulse ${
						isDark ? "bg-indigo-800/15" : "bg-blue-300/25"
					}`}
					style={{ animationDuration: "7s" }}
				/>
			</div>

			<div
				className="absolute inset-0 pointer-events-none opacity-20"
				aria-hidden="true"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${
						isDark ? "6366F1" : "0D9488"
					}' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
				}}
			/>

			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-poppins { font-family: 'Montserrat', sans-serif; }
        button,a{
        cursor: pointer;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDark ? "#6366f1" : "#0d9488"};
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? "#4f46e5" : "#0f766e"};
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
          background: ${isDark ? "#64748b" : "#9ca3af"};
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          overflow-x: hidden;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        
        .break-words {
          word-break: break-word;
        }
        
        .overflow-wrap-anywhere {
          overflow-wrap: anywhere;
        }
        
        
        input:focus, textarea:focus, button:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${
						isDark ? "rgba(99, 102, 241, 0.4)" : "rgba(13, 148, 136, 0.4)"
					};
        }
        
        .progress-gradient {
          background: ${
						isDark
							? "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)"
							: "linear-gradient(90deg, #0d9488 0%, #3b82f6 100%)"
					};
        }
        
        
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.8;
          }
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

			<header
				className={`px-4 sm:px-6 py-4 sm:py-6 sticky top-0 z-40 shadow-lg ${
					isDark
						? "bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm border-b border-purple-700/30"
						: "bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm border-b border-teal-100"
				}`}
			>
				<div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
					<div className="flex items-center">
						<button
							onClick={handleLogoClick}
							className="flex items-center space-x-3 sm:space-x-3 transition-all duration-200 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg focus:ring-indigo-400"
							aria-label="Reload page"
						>
							<div
								className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1 ${
									isDark
										? "bg-gray-800 border border-purple-700/30"
										: "bg-gradient-to-br from-teal-500 to-blue-500 border border-teal-100"
								}`}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M12 4L16 8L12 12L8 8L12 4Z"
										fill={isDark ? "#a78bfa" : "#ffffff"}
										className="group-hover:scale-110 transition-transform duration-200"
									/>
									<circle
										cx="12"
										cy="16"
										r="3"
										fill={isDark ? "#a78bfa" : "#ffffff"}
										opacity="0.7"
									/>
								</svg>
							</div>
							<div>
								<h1
									className={`text-lg sm:text-xl lg:text-2xl font-bold font-playfair transition-colors duration-200 ${
										isDark
											? "text-white group-hover:text-purple-300"
											: "text-gray-900 group-hover:text-teal-600"
									}`}
								>
									MythForm
								</h1>
								<p
									className={`text-xs sm:text-sm font-poppins ${
										isDark ? "text-indigo-200" : "text-teal-600"
									}`}
								>
									Creative Studio
								</p>
							</div>
						</button>
					</div>

					<nav className="hidden md:flex items-center space-x-1">
						<NavLink
							href="#home"
							label="Home"
							isDark={isDark}
							active={activeSection === "home"}
							onClick={() => scrollToSection("home")}
						/>
						<NavLink
							href="#services"
							label="Services"
							isDark={isDark}
							active={activeSection === "services"}
							onClick={() => scrollToSection("services")}
						/>
						<NavLink
							href="#testimonials"
							label="Testimonials"
							isDark={isDark}
							active={activeSection === "testimonials"}
							onClick={() => scrollToSection("testimonials")}
						/>
						<NavLink
							href="#contact-form"
							label="Contact"
							isDark={isDark}
							active={activeSection === "contact-form"}
							onClick={() => scrollToSection("contact-form")}
						/>
						<NavLink
							href="#faq"
							label="FAQ"
							isDark={isDark}
							active={activeSection === "faq"}
							onClick={() => scrollToSection("faq")}
						/>
					</nav>

					<div className="flex items-center">
						<a
							href="#contact-form"
							onClick={() => scrollToSection("contact-form")}
							className={`hidden sm:inline-block mr-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
								isDark
									? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-400"
									: "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 focus:ring-teal-500"
							}`}
						>
							Get a Quote
						</a>

						<button
							onClick={toggleDarkMode}
							className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-xl hover:-translate-y-1 ml-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
								isDark
									? "bg-gray-800 border border-purple-700/30 focus:ring-indigo-400"
									: "bg-white border border-teal-100 focus:ring-teal-500"
							}`}
							aria-label={
								isDark ? "Switch to light mode" : "Switch to dark mode"
							}
						>
							{isDark ? (
								<FaSun
									className="sm:w-5 sm:h-5 w-4 h-4 text-amber-300"
									aria-hidden="true"
								/>
							) : (
								<FaMoon
									className="sm:w-5 sm:h-5 w-4 h-4 text-indigo-500"
									aria-hidden="true"
								/>
							)}
						</button>

						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className={`ml-2 md:hidden p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
								isDark
									? "text-white hover:bg-gray-700 focus:ring-indigo-400"
									: "text-gray-800 hover:bg-teal-50 focus:ring-teal-500"
							}`}
							aria-expanded={isMenuOpen}
							aria-label="Main menu"
							aria-controls="mobile-menu"
						>
							{isMenuOpen ? (
								<HiOutlineX className="w-6 h-6" />
							) : (
								<HiOutlineMenu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				{isMenuOpen && (
					<div
						id="mobile-menu"
						className={`md:hidden mt-4 rounded-xl overflow-hidden shadow-lg ${
							isDark
								? "bg-gray-800 border border-purple-700/30"
								: "bg-white border border-teal-100"
						}`}
					>
						<nav className="flex flex-col">
							<a
								href="#home"
								onClick={() => scrollToSection("home")}
								className={`px-4 py-3 text-sm font-medium transition-all duration-200 ${
									activeSection === "home"
										? isDark
											? "bg-gradient-to-r from-indigo-800 to-purple-800 text-white"
											: "bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800"
										: isDark
										? "text-purple-200 hover:bg-gray-700 hover:text-white"
										: "text-gray-800 hover:bg-teal-50 hover:text-teal-800"
								} focus:outline-none focus:ring-2 focus:ring-inset ${
									isDark ? "focus:ring-indigo-400" : "focus:ring-teal-500"
								}`}
							>
								Home
							</a>
							<a
								href="#services"
								onClick={() => scrollToSection("services")}
								className={`px-4 py-3 text-sm font-medium transition-all duration-200 ${
									activeSection === "services"
										? isDark
											? "bg-gradient-to-r from-indigo-800 to-purple-800 text-white"
											: "bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800"
										: isDark
										? "text-purple-200 hover:bg-gray-700 hover:text-white"
										: "text-gray-800 hover:bg-teal-50 hover:text-teal-800"
								} focus:outline-none focus:ring-2 focus:ring-inset ${
									isDark ? "focus:ring-indigo-400" : "focus:ring-teal-500"
								}`}
							>
								Services
							</a>
							<a
								href="#testimonials"
								onClick={() => scrollToSection("testimonials")}
								className={`px-4 py-3 text-sm font-medium transition-all duration-200 ${
									activeSection === "testimonials"
										? isDark
											? "bg-gradient-to-r from-indigo-800 to-purple-800 text-white"
											: "bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800"
										: isDark
										? "text-purple-200 hover:bg-gray-700 hover:text-white"
										: "text-gray-800 hover:bg-teal-50 hover:text-teal-800"
								} focus:outline-none focus:ring-2 focus:ring-inset ${
									isDark ? "focus:ring-indigo-400" : "focus:ring-teal-500"
								}`}
							>
								Testimonials
							</a>
							<a
								href="#contact-form"
								onClick={() => scrollToSection("contact-form")}
								className={`px-4 py-3 text-sm font-medium transition-all duration-200 ${
									activeSection === "contact-form"
										? isDark
											? "bg-gradient-to-r from-indigo-800 to-purple-800 text-white"
											: "bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800"
										: isDark
										? "text-purple-200 hover:bg-gray-700 hover:text-white"
										: "text-gray-800 hover:bg-teal-50 hover:text-teal-800"
								} focus:outline-none focus:ring-2 focus:ring-inset ${
									isDark ? "focus:ring-indigo-400" : "focus:ring-teal-500"
								}`}
							>
								Contact
							</a>
							<a
								href="#faq"
								onClick={() => scrollToSection("faq")}
								className={`px-4 py-3 text-sm font-medium transition-all duration-200 ${
									activeSection === "faq"
										? isDark
											? "bg-gradient-to-r from-indigo-800 to-purple-800 text-white"
											: "bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800"
										: isDark
										? "text-purple-200 hover:bg-gray-700 hover:text-white"
										: "text-gray-800 hover:bg-teal-50 hover:text-teal-800"
								} focus:outline-none focus:ring-2 focus:ring-inset ${
									isDark ? "focus:ring-indigo-400" : "focus:ring-teal-500"
								}`}
							>
								FAQ
							</a>
						</nav>
					</div>
				)}
			</header>

			<section
				id="home"
				ref={homeRef}
				className="px-4 sm:px-6 py-16 md:py-24 relative z-10"
			>
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col items-center text-center">
						<h2
							className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-8 font-playfair leading-tight max-w-4xl ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						>
							Turn Your{" "}
							<span
								className={`bg-clip-text text-transparent ${
									isDark
										? "bg-gradient-to-r from-indigo-400 to-purple-400"
										: "bg-gradient-to-r from-teal-500 to-blue-500"
								}`}
							>
								Vision
							</span>{" "}
							Into Digital Reality
						</h2>
						<p
							className={`text-lg sm:text-xl max-w-3xl mx-auto font-poppins leading-relaxed mb-10 ${
								isDark ? "text-purple-200" : "text-gray-700"
							}`}
						>
							We create stunning digital experiences that captivate your
							audience and elevate your brand. Let's build something amazing
							together.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 mt-4">
							<a
								href="#contact-form"
								onClick={() => scrollToSection("contact-form")}
								className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
									isDark
										? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-400"
										: "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:ring-teal-500"
								}`}
							>
								Get Started
							</a>
							<a
								href="#services"
								onClick={() => scrollToSection("services")}
								className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
									isDark
										? "bg-gray-800 text-white border border-purple-700/30 hover:bg-gray-700 focus:ring-indigo-400"
										: "bg-white text-teal-600 border border-teal-500 hover:bg-teal-50 focus:ring-teal-500"
								}`}
							>
								Our Services
							</a>
						</div>
					</div>
				</div>
			</section>

			<section
				id="services"
				ref={servicesRef}
				className="px-4 sm:px-6 py-16 md:py-20 relative z-10"
			>
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2
							className={`text-3xl sm:text-4xl font-bold mb-4 font-playfair ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						>
							Our Services
						</h2>
						<div className="w-24 h-1 mx-auto my-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
						<p
							className={`text-lg max-w-3xl mx-auto font-poppins ${
								isDark ? "text-purple-200" : "text-gray-700"
							}`}
						>
							We offer a comprehensive range of digital solutions to help your
							business thrive
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
						<FeatureCard
							icon={<FaCode />}
							title="Web Development"
							description="Custom websites built with the latest technologies for optimal performance and user experience."
							isDark={isDark}
						/>
						<FeatureCard
							icon={<FaMobile />}
							title="Mobile Applications"
							description="Native and cross-platform mobile apps that provide seamless experiences across all devices."
							isDark={isDark}
						/>
						<FeatureCard
							icon={<FaPalette />}
							title="UI/UX Design"
							description="Intuitive interfaces and engaging user experiences that keep customers coming back."
							isDark={isDark}
						/>
						<FeatureCard
							icon={<FaChartLine />}
							title="Digital Marketing"
							description="Data-driven strategies to increase your online presence and drive qualified traffic."
							isDark={isDark}
						/>
						<FeatureCard
							icon={<FaSearch />}
							title="SEO Optimization"
							description="Improve your search engine rankings and drive organic traffic to your website."
							isDark={isDark}
						/>
						<FeatureCard
							icon={<FaShoppingCart />}
							title="E-commerce Solutions"
							description="Comprehensive online stores with secure payment processing and inventory management."
							isDark={isDark}
						/>
					</div>
				</div>
			</section>

			<section
				id="testimonials"
				ref={testimonialsRef}
				className="px-4 sm:px-6 py-16 md:py-20 relative z-10 overflow-hidden"
			>
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2
							className={`text-3xl sm:text-4xl font-bold mb-4 font-playfair ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						>
							What Our Clients Say
						</h2>
						<div className="w-24 h-1 mx-auto my-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
						<p
							className={`text-lg max-w-3xl mx-auto font-poppins ${
								isDark ? "text-purple-200" : "text-gray-700"
							}`}
						>
							Trusted by businesses worldwide to deliver exceptional digital
							experiences
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
						<TestimonialCard
							quote="Working with MythForm Studio transformed our online presence. Their attention to detail and creative solutions exceeded our expectations."
							author="Sarah Johnson"
							role="Marketing Director"
							company="Elevate Industries"
							isDark={isDark}
						/>
						<TestimonialCard
							quote="The team at MythForm delivered our project on time and within budget. Their commitment to quality is truly impressive."
							author="Michael Chen"
							role="CEO"
							company="Nexus Technologies"
							isDark={isDark}
						/>
						<TestimonialCard
							quote="Our e-commerce sales increased by 200% after implementing MythForm's design and optimization strategies. Highly recommended!"
							author="Amanda Rodriguez"
							role="E-commerce Manager"
							company="StyleHub"
							isDark={isDark}
						/>
					</div>
				</div>
			</section>

			<section className="px-4 sm:px-6 py-16 relative z-10">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-10">
						<h3
							className={`text-xl font-semibold mb-2 font-playfair ${
								isDark ? "text-purple-200" : "text-gray-700"
							}`}
						>
							Trusted By Leading Brands
						</h3>
					</div>

					<div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
						<div
							className={`w-32 h-12 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30 shadow-md"
							}`}
						>
							<div
								className={`font-bold ${
									isDark ? "text-indigo-400" : "text-teal-600"
								}`}
							>
								BRAND 1
							</div>
						</div>
						<div
							className={`w-32 h-12 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30 shadow-md"
							}`}
						>
							<div
								className={`font-bold ${
									isDark ? "text-indigo-400" : "text-teal-600"
								}`}
							>
								BRAND 2
							</div>
						</div>
						<div
							className={`w-32 h-12 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30 shadow-md"
							}`}
						>
							<div
								className={`font-bold ${
									isDark ? "text-indigo-400" : "text-teal-600"
								}`}
							>
								BRAND 3
							</div>
						</div>
						<div
							className={`w-32 h-12 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30 shadow-md"
							}`}
						>
							<div
								className={`font-bold ${
									isDark ? "text-indigo-400" : "text-teal-600"
								}`}
							>
								BRAND 4
							</div>
						</div>
						<div
							className={`w-32 h-12 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30 shadow-md"
							}`}
						>
							<div
								className={`font-bold ${
									isDark ? "text-indigo-400" : "text-teal-600"
								}`}
							>
								BRAND 5
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="px-4 sm:px-6 py-16 md:py-20 relative z-10">
				<div
					className={`max-w-5xl mx-auto rounded-3xl shadow-2xl overflow-hidden ${
						isDark
							? "bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border border-purple-700/30"
							: "bg-gradient-to-r from-teal-600 to-blue-600"
					}`}
				>
					<div className="px-6 sm:px-10 py-12 sm:py-16 text-center">
						<h2 className="text-3xl sm:text-4xl font-bold mb-6 font-playfair text-white">
							Ready to Start Your Project?
						</h2>
						<p className="text-lg max-w-3xl mx-auto font-poppins mb-8 text-white/90">
							Let's discuss how we can help bring your vision to life. Fill out
							the form below, and our team will get back to you within 24 hours.
						</p>
						<a
							href="#contact-form"
							onClick={() => scrollToSection("contact-form")}
							className={`inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
								isDark
									? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 focus:ring-indigo-400"
									: "bg-white text-teal-700 hover:bg-teal-50 focus:ring-white"
							}`}
						>
							Get Started Now
						</a>
					</div>
				</div>
			</section>

			<main
				id="contact-form"
				ref={contactFormRef}
				className="px-4 sm:px-6 pb-20 pt-8 relative z-10"
				aria-labelledby="contact-heading"
			>
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2
							id="contact-heading"
							className={`text-3xl sm:text-4xl font-bold mb-4 font-playfair ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						>
							Let's Create Something Amazing
						</h2>
						<div className="w-24 h-1 mx-auto my-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
						<p
							className={`text-lg max-w-3xl mx-auto font-poppins leading-relaxed ${
								isDark ? "text-purple-200" : "text-gray-700"
							}`}
						>
							Ready to transform your vision into reality? Share your project
							details with us, and let's embark on a creative journey together.
						</p>
					</div>

					{errorSummary.length > 0 && (
						<div
							ref={errorSummaryRef}
							className={`max-w-6xl mx-auto mb-8 p-5 rounded-xl border ${
								isDark
									? "bg-red-900/20 border-red-800/50 text-red-400"
									: "bg-red-50 border-red-200 text-red-700"
							}`}
							role="alert"
							aria-labelledby="error-heading"
							tabIndex={-1}
						>
							<h3
								id="error-heading"
								className="font-bold text-lg font-poppins mb-3"
							>
								Please correct the following {errorSummary.length}{" "}
								{errorSummary.length === 1 ? "error" : "errors"} before
								submitting:
							</h3>
							<ul className="list-disc pl-5 space-y-2">
								{errorSummary.map(({ field, error }, index) => (
									<li key={index}>
										<a
											href={`#${field}`}
											className="underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded"
											onClick={(e) => {
												e.preventDefault();
												const element = document.getElementById(field);
												element?.focus();
												element?.scrollIntoView({
													behavior: "smooth",
													block: "center",
												});
											}}
										>
											{error}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}

					<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2">
							<div
								className={`backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:shadow-3xl ${
									isDark
										? "bg-gradient-to-br from-gray-800/90 to-gray-800/80 border border-purple-700/30"
										: "bg-gradient-to-br from-white/95 to-teal-50/30 border border-teal-100/50"
								}`}
							>
								<h3
									className={`text-xl sm:text-2xl font-bold mb-6 font-playfair ${
										isDark ? "text-indigo-400" : "text-teal-600"
									}`}
								>
									Contact Information
								</h3>

								<div className="mb-8">
									<div className="flex justify-between items-center mb-2">
										<span
											className={`text-sm font-medium ${
												isDark ? "text-purple-200" : "text-gray-600"
											}`}
										>
											Form Completion
										</span>
										<span
											className={`text-sm font-medium ${
												isDark ? "text-indigo-400" : "text-teal-600"
											}`}
										>
											{formCompletion}%
										</span>
									</div>
									<div
										className={`h-2 rounded-full ${
											isDark ? "bg-gray-700" : "bg-gray-200"
										}`}
										role="progressbar"
										aria-valuenow={formCompletion}
										aria-valuemin={0}
										aria-valuemax={100}
										aria-label="Form completion progress"
									>
										<div
											className={`h-2 rounded-full transition-all duration-500 ease-out progress-gradient`}
											style={{ width: `${formCompletion}%` }}
										/>
									</div>
								</div>

								<form
									ref={formRef}
									onSubmit={handleSubmit}
									className="space-y-6"
									noValidate
									aria-label="Contact form"
								>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
										<div>
											<label
												htmlFor="firstName"
												className={`block text-sm font-semibold mb-2 font-poppins ${
													isDark ? "text-indigo-400" : "text-teal-600"
												}`}
											>
												First Name <span aria-hidden="true">*</span>
												<span className="sr-only"> (required)</span>
											</label>
											<input
												ref={firstNameRef}
												type="text"
												id="firstName"
												name="firstName"
												value={formData.firstName}
												onChange={(e) =>
													handleInputChange("firstName", e.target.value)
												}
												onBlur={() => handleBlur("firstName")}
												className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-poppins transform hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 ${
													errors.firstName
														? `${
																isDark
																	? "border-red-400 bg-red-900/20 text-white"
																	: "border-red-500 bg-red-50 text-gray-900"
														  } focus:border-red-400`
														: `${
																isDark
																	? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400"
																	: "bg-white border-teal-500 text-gray-900 hover:border-teal-500"
														  } ${
																isDark
																	? "focus:border-indigo-400"
																	: "focus:border-teal-600"
														  }`
												} focus:outline-none focus:ring-2 ${
													isDark
														? "focus:ring-indigo-400/20"
														: "focus:ring-teal-600/20"
												}`}
												aria-describedby={
													errors.firstName ? "firstName-error" : undefined
												}
												aria-invalid={errors.firstName ? "true" : "false"}
												aria-required="true"
												autoComplete="given-name"
												disabled={isSubmitting}
											/>
											{errors.firstName && (
												<p
													id="firstName-error"
													className={`mt-1 text-sm font-poppins animate-fade-in ${
														isDark ? "text-red-400" : "text-red-500"
													}`}
													role="alert"
												>
													{errors.firstName}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor="lastName"
												className={`block text-sm font-semibold mb-2 font-poppins ${
													isDark ? "text-indigo-400" : "text-teal-600"
												}`}
											>
												Last Name <span aria-hidden="true">*</span>
												<span className="sr-only"> (required)</span>
											</label>
											<input
												type="text"
												id="lastName"
												name="lastName"
												value={formData.lastName}
												onChange={(e) =>
													handleInputChange("lastName", e.target.value)
												}
												onBlur={() => handleBlur("lastName")}
												className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-poppins transform hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 ${
													errors.lastName
														? `${
																isDark
																	? "border-red-400 bg-red-900/20 text-white"
																	: "border-red-500 bg-red-50 text-gray-900"
														  } focus:border-red-400`
														: `${
																isDark
																	? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400"
																	: "bg-white border-teal-500 text-gray-900 hover:border-teal-500"
														  } ${
																isDark
																	? "focus:border-indigo-400"
																	: "focus:border-teal-600"
														  }`
												} focus:outline-none focus:ring-2 ${
													isDark
														? "focus:ring-indigo-400/20"
														: "focus:ring-teal-600/20"
												}`}
												aria-describedby={
													errors.lastName ? "lastName-error" : undefined
												}
												aria-invalid={errors.lastName ? "true" : "false"}
												aria-required="true"
												autoComplete="family-name"
												disabled={isSubmitting}
											/>
											{errors.lastName && (
												<p
													id="lastName-error"
													className={`mt-1 text-sm font-poppins animate-fade-in ${
														isDark ? "text-red-400" : "text-red-500"
													}`}
													role="alert"
												>
													{errors.lastName}
												</p>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
										<div>
											<label
												htmlFor="email"
												className={`block text-sm font-semibold mb-2 font-poppins ${
													isDark ? "text-indigo-400" : "text-teal-600"
												}`}
											>
												Email Address <span aria-hidden="true">*</span>
												<span className="sr-only"> (required)</span>
											</label>
											<input
												type="email"
												id="email"
												name="email"
												value={formData.email}
												onChange={(e) =>
													handleInputChange("email", e.target.value)
												}
												onBlur={() => handleBlur("email")}
												className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-poppins transform hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 ${
													errors.email
														? `${
																isDark
																	? "border-red-400 bg-red-900/20 text-white"
																	: "border-red-500 bg-red-50 text-gray-900"
														  } focus:border-red-400`
														: `${
																isDark
																	? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400"
																	: "bg-white border-teal-500 text-gray-900 hover:border-teal-500"
														  } ${
																isDark
																	? "focus:border-indigo-400"
																	: "focus:border-teal-600"
														  }`
												} focus:outline-none focus:ring-2 ${
													isDark
														? "focus:ring-indigo-400/20"
														: "focus:ring-teal-600/20"
												}`}
												aria-describedby={
													errors.email ? "email-error" : undefined
												}
												aria-invalid={errors.email ? "true" : "false"}
												aria-required="true"
												autoComplete="email"
												placeholder="name@example.com"
												disabled={isSubmitting}
											/>
											{errors.email && (
												<p
													id="email-error"
													className={`mt-1 text-sm font-poppins animate-fade-in ${
														isDark ? "text-red-400" : "text-red-500"
													}`}
													role="alert"
												>
													{errors.email}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor="phone"
												className={`block text-sm font-semibold mb-2 font-poppins ${
													isDark ? "text-indigo-400" : "text-teal-600"
												}`}
											>
												Phone Number <span aria-hidden="true">*</span>
												<span className="sr-only"> (required)</span>
											</label>
											<input
												type="tel"
												id="phone"
												name="phone"
												value={formData.phone}
												onChange={(e) => {
													const rawValue = e.target.value.replace(
														/[^\d+\s()-]/g,
														""
													);
													const formattedValue = formatPhoneNumber(rawValue);
													handleInputChange("phone", formattedValue);
												}}
												onBlur={() => handleBlur("phone")}
												className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-poppins transform hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 ${
													errors.phone
														? `${
																isDark
																	? "border-red-400 bg-red-900/20 text-white"
																	: "border-red-500 bg-red-50 text-gray-900"
														  } focus:border-red-400`
														: `${
																isDark
																	? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400"
																	: "bg-white border-teal-500 text-gray-900 hover:border-teal-500"
														  } ${
																isDark
																	? "focus:border-indigo-400"
																	: "focus:border-teal-600"
														  }`
												} focus:outline-none focus:ring-2 ${
													isDark
														? "focus:ring-indigo-400/20"
														: "focus:ring-teal-600/20"
												}`}
												aria-describedby={
													errors.phone ? "phone-error" : undefined
												}
												aria-invalid={errors.phone ? "true" : "false"}
												aria-required="true"
												autoComplete="tel"
												placeholder="(123) 456-7890"
												disabled={isSubmitting}
											/>
											{errors.phone && (
												<p
													id="phone-error"
													className={`mt-1 text-sm font-poppins animate-fade-in ${
														isDark ? "text-red-400" : "text-red-500"
													}`}
													role="alert"
												>
													{errors.phone}
												</p>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
										<div>
											<label
												htmlFor="company"
												className={`block text-sm font-semibold mb-2 font-poppins ${
													isDark ? "text-indigo-400" : "text-teal-600"
												}`}
											>
												Company Name <span aria-hidden="true">*</span>
												<span className="sr-only"> (required)</span>
											</label>
											<input
												type="text"
												id="company"
												name="company"
												value={formData.company}
												onChange={(e) =>
													handleInputChange("company", e.target.value)
												}
												onBlur={() => handleBlur("company")}
												className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-poppins transform hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 ${
													errors.company
														? `${
																isDark
																	? "border-red-400 bg-red-900/20 text-white"
																	: "border-red-500 bg-red-50 text-gray-900"
														  } focus:border-red-400`
														: `${
																isDark
																	? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400"
																	: "bg-white border-teal-500 text-gray-900 hover:border-teal-500"
														  } ${
																isDark
																	? "focus:border-indigo-400"
																	: "focus:border-teal-600"
														  }`
												} focus:outline-none focus:ring-2 ${
													isDark
														? "focus:ring-indigo-400/20"
														: "focus:ring-teal-600/20"
												}`}
												aria-describedby={
													errors.company ? "company-error" : undefined
												}
												aria-invalid={errors.company ? "true" : "false"}
												aria-required="true"
												autoComplete="organization"
												disabled={isSubmitting}
											/>
											{errors.company && (
												<p
													id="company-error"
													className={`mt-1 text-sm font-poppins animate-fade-in ${
														isDark ? "text-red-400" : "text-red-500"
													}`}
													role="alert"
												>
													{errors.company}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor="jobTitle"
												className={`block text-sm font-semibold mb-2 font-poppins ${
													isDark ? "text-indigo-400" : "text-teal-600"
												}`}
											>
												Job Title
											</label>
											<input
												type="text"
												id="jobTitle"
												name="jobTitle"
												value={formData.jobTitle}
												onChange={(e) =>
													handleInputChange("jobTitle", e.target.value)
												}
												className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-poppins transform hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 ${
													isDark
														? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400 focus:border-indigo-400"
														: "bg-white border-teal-500 text-gray-900 hover:border-teal-500 focus:border-teal-600"
												} focus:outline-none focus:ring-2 ${
													isDark
														? "focus:ring-indigo-400/20"
														: "focus:ring-teal-600/20"
												}`}
												autoComplete="organization-title"
												disabled={isSubmitting}
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="subject"
											className={`block text-sm font-semibold mb-2 font-poppins ${
												isDark ? "text-indigo-400" : "text-teal-600"
											}`}
										>
											Subject <span aria-hidden="true">*</span>
											<span className="sr-only"> (required)</span>
										</label>
										<input
											type="text"
											id="subject"
											name="subject"
											value={formData.subject}
											onChange={(e) =>
												handleInputChange("subject", e.target.value)
											}
											onBlur={() => handleBlur("subject")}
											className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-poppins transform hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 ${
												errors.subject
													? `${
															isDark
																? "border-red-400 bg-red-900/20 text-white"
																: "border-red-500 bg-red-50 text-gray-900"
													  } focus:border-red-400`
													: `${
															isDark
																? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400"
																: "bg-white border-teal-500 text-gray-900 hover:border-teal-500"
													  } ${
															isDark
																? "focus:border-indigo-400"
																: "focus:border-teal-600"
													  }`
											} focus:outline-none focus:ring-2 ${
												isDark
													? "focus:ring-indigo-400/20"
													: "focus:ring-teal-600/20"
											}`}
											aria-describedby={
												errors.subject ? "subject-error" : undefined
											}
											aria-invalid={errors.subject ? "true" : "false"}
											aria-required="true"
											disabled={isSubmitting}
										/>
										{errors.subject && (
											<p
												id="subject-error"
												className={`mt-1 text-sm font-poppins animate-fade-in ${
													isDark ? "text-red-400" : "text-red-500"
												}`}
												role="alert"
											>
												{errors.subject}
											</p>
										)}
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
										<div>
											<label
												htmlFor="budget"
												className={`block text-sm font-semibold mb-2 font-poppins ${
													isDark ? "text-indigo-400" : "text-teal-600"
												}`}
											>
												Budget Range <span aria-hidden="true">*</span>
												<span className="sr-only"> (required)</span>
											</label>
											<CustomDropdown
												options={budgetOptions}
												value={formData.budget}
												onChange={(value) => handleInputChange("budget", value)}
												placeholder="Select budget range"
												error={errors.budget}
												onBlur={() => handleBlur("budget")}
												isDark={isDark}
												id="budget"
												aria-describedby={
													errors.budget ? "budget-error" : undefined
												}
												disabled={isSubmitting}
											/>
											{errors.budget && (
												<p
													id="budget-error"
													className={`mt-1 text-sm font-poppins animate-fade-in ${
														isDark ? "text-red-400" : "text-red-500"
													}`}
													role="alert"
												>
													{errors.budget}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor="timeline"
												className={`block text-sm font-semibold mb-2 font-poppins ${
													isDark ? "text-indigo-400" : "text-teal-600"
												}`}
											>
												Timeline <span aria-hidden="true">*</span>
												<span className="sr-only"> (required)</span>
											</label>
											<CustomDropdown
												options={timelineOptions}
												value={formData.timeline}
												onChange={(value) =>
													handleInputChange("timeline", value)
												}
												placeholder="Select timeline"
												error={errors.timeline}
												onBlur={() => handleBlur("timeline")}
												isDark={isDark}
												id="timeline"
												aria-describedby={
													errors.timeline ? "timeline-error" : undefined
												}
												disabled={isSubmitting}
											/>
											{errors.timeline && (
												<p
													id="timeline-error"
													className={`mt-1 text-sm font-poppins animate-fade-in ${
														isDark ? "text-red-400" : "text-red-500"
													}`}
													role="alert"
												>
													{errors.timeline}
												</p>
											)}
										</div>
									</div>

									<div>
										<label
											htmlFor="hearAbout"
											className={`block text-sm font-semibold mb-2 font-poppins ${
												isDark ? "text-indigo-400" : "text-teal-600"
											}`}
										>
											How did you hear about us?{" "}
											<span aria-hidden="true">*</span>
											<span className="sr-only"> (required)</span>
										</label>
										<CustomDropdown
											options={hearAboutOptions}
											value={formData.hearAbout}
											onChange={(value) =>
												handleInputChange("hearAbout", value)
											}
											placeholder="Select an option"
											error={errors.hearAbout}
											onBlur={() => handleBlur("hearAbout")}
											isDark={isDark}
											id="hearAbout"
											aria-describedby={
												errors.hearAbout ? "hearAbout-error" : undefined
											}
											disabled={isSubmitting}
										/>
										{errors.hearAbout && (
											<p
												id="hearAbout-error"
												className={`mt-1 text-sm font-poppins animate-fade-in ${
													isDark ? "text-red-400" : "text-red-500"
												}`}
												role="alert"
											>
												{errors.hearAbout}
											</p>
										)}
									</div>

									<div>
										<label
											htmlFor="message"
											className={`block text-sm font-semibold mb-2 font-poppins ${
												isDark ? "text-indigo-400" : "text-teal-600"
											}`}
										>
											Message <span aria-hidden="true">*</span>
											<span className="sr-only"> (required)</span>
										</label>
										<textarea
											id="message"
											name="message"
											rows={6}
											value={formData.message}
											onChange={(e) => {
												const value = e.target.value;
												handleInputChange("message", value);

												const charCountIndicator = document.getElementById(
													"char-count-indicator"
												);
												if (charCountIndicator) {
													const percentage = Math.min(
														(value.length / 500) * 100,
														100
													);
													charCountIndicator.style.width = `${percentage}%`;

													if (percentage > 90) {
														charCountIndicator.classList.add("bg-amber-500");
													} else {
														charCountIndicator.classList.remove("bg-amber-500");
													}
												}
											}}
											onBlur={() => handleBlur("message")}
											maxLength={500}
											className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-poppins resize-none transform hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 ${
												errors.message
													? `${
															isDark
																? "border-red-400 bg-red-900/20 text-white"
																: "border-red-500 bg-red-50 text-gray-900"
													  } focus:border-red-400`
													: `${
															isDark
																? "bg-gray-700 border-purple-600/30 text-white hover:border-indigo-400"
																: "bg-white border-teal-500 text-gray-900 hover:border-teal-500"
													  } ${
															isDark
																? "focus:border-indigo-400"
																: "focus:border-teal-600"
													  }`
											} focus:outline-none focus:ring-2 ${
												isDark
													? "focus:ring-indigo-400/20"
													: "focus:ring-teal-600/20"
											}`}
											aria-describedby={
												errors.message ? "message-error" : "message-counter"
											}
											aria-invalid={errors.message ? "true" : "false"}
											aria-required="true"
											disabled={isSubmitting}
											placeholder="Tell us about your project..."
										/>
										<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
											{errors.message ? (
												<p
													id="message-error"
													className={`text-sm font-poppins animate-fade-in ${
														isDark ? "text-red-400" : "text-red-500"
													}`}
													role="alert"
												>
													{errors.message}
												</p>
											) : (
												<div aria-hidden="true" />
											)}
											<div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-col">
												<div
													className={`w-32 h-1.5 rounded-full ${
														isDark ? "bg-gray-700" : "bg-gray-200"
													} mb-1`}
												>
													<div
														id="char-count-indicator"
														className={`h-1.5 rounded-full transition-all duration-300 ${
															isDark ? "bg-indigo-500" : "bg-teal-500"
														}`}
														style={{
															width: `${Math.min(
																(formData.message.length / 500) * 100,
																100
															)}%`,
														}}
													/>
												</div>
												<p
													id="message-counter"
													className={`text-sm font-poppins ${
														isDark ? "text-purple-200" : "text-gray-500"
													}`}
													aria-live="polite"
												>
													{formData.message.length}/500 characters
												</p>
											</div>
										</div>
									</div>

									<button
										type="submit"
										disabled={isSubmitting}
										aria-describedby={
											isSubmitting ? "submit-status" : undefined
										}
										aria-label={
											isSubmitting
												? "Sending message, please wait"
												: "Send contact form message"
										}
										className={`w-full py-4 px-8 rounded-xl font-semibold text-white transition-all duration-200 font-poppins transform ${
											isSubmitting
												? `${
														isDark ? "bg-gray-500" : "bg-gray-400"
												  } cursor-not-allowed`
												: `${
														isDark
															? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
															: "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
												  } hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]`
										} focus:outline-none focus:ring-4 ${
											isDark
												? "focus:ring-indigo-400/30"
												: "focus:ring-teal-600/30"
										} shadow-lg`}
									>
										{isSubmitting ? (
											<div className="flex items-center justify-center space-x-2">
												<div
													className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
													aria-hidden="true"
												/>
												<span id="submit-status">Sending...</span>
											</div>
										) : (
											"Submit"
										)}
									</button>

									<div
										className={`mt-4 text-sm font-poppins ${
											isDark ? "text-purple-200/80" : "text-gray-500"
										}`}
										aria-live="polite"
									>
										<p>
											<span aria-hidden="true">💡</span> Press{" "}
											<kbd
												className={`px-1.5 py-0.5 rounded ${
													isDark ? "bg-gray-500" : "bg-gray-100"
												}`}
											>
												Tab
											</kbd>{" "}
											to navigate between form fields. Fields marked with{" "}
											<span aria-hidden="true">*</span> are required.
										</p>
									</div>
								</form>
							</div>
						</div>

						<div className="lg:col-span-1">
							<div
								className={`backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:sticky lg:top-24 transition-all duration-300 hover:shadow-3xl ${
									isDark
										? "bg-gradient-to-br from-gray-800/90 to-gray-800/80 border border-purple-700/30"
										: "bg-gradient-to-br from-white/95 to-teal-50/30 border border-teal-100/50"
								}`}
							>
								<h3
									className={`text-xl sm:text-2xl font-bold mb-6 font-playfair ${
										isDark ? "text-indigo-400" : "text-teal-600"
									}`}
								>
									Form Preview
								</h3>

								{Object.values(formData).some((value) => value.trim()) ? (
									<div className="space-y-4 font-poppins">
										{formData.firstName && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Name:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.firstName} {formData.lastName}
												</span>
											</div>
										)}

										{formData.email && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Email:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.email}
												</span>
											</div>
										)}

										{formData.phone && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Phone:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.phone}
												</span>
											</div>
										)}

										{formData.company && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Company:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.company}
												</span>
											</div>
										)}

										{formData.jobTitle && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Job Title:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.jobTitle}
												</span>
											</div>
										)}

										{formData.subject && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Subject:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.subject}
												</span>
											</div>
										)}

										{formData.budget && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Budget:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.budget}
												</span>
											</div>
										)}

										{formData.timeline && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Timeline:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.timeline}
												</span>
											</div>
										)}

										{formData.hearAbout && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Heard About Us:{" "}
												</span>
												<span
													className={`${
														isDark ? "text-white" : "text-gray-900"
													} break-words`}
												>
													{formData.hearAbout}
												</span>
											</div>
										)}

										{formData.message && (
											<div className="animate-fade-in">
												<span
													className={`font-semibold ${
														isDark ? "text-indigo-400" : "text-teal-600"
													}`}
												>
													Message:{" "}
												</span>
												<div
													className={`mt-2 p-4 rounded-lg break-words overflow-wrap-anywhere ${
														isDark
															? "bg-gray-700 text-white"
															: "bg-teal-50 text-gray-900"
													}`}
												>
													{formData.message}
												</div>
											</div>
										)}
									</div>
								) : (
									<div className="text-center py-12">
										<svg
											className={`w-16 h-16 mx-auto mb-4 ${
												isDark ? "text-gray-600" : "text-gray-400"
											}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										<p
											className={`font-poppins ${
												isDark ? "text-purple-200" : "text-gray-500"
											}`}
										>
											Start filling the form to see your information preview
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			<section
				id="faq"
				ref={faqRef}
				className="px-4 sm:px-6 py-16 md:py-20 relative z-10"
			>
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-16">
						<h2
							className={`text-3xl sm:text-4xl font-bold mb-4 font-playfair ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						>
							Frequently Asked Questions
						</h2>
						<div className="w-24 h-1 mx-auto my-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
						<p
							className={`text-lg max-w-3xl mx-auto font-poppins ${
								isDark ? "text-purple-200" : "text-gray-700"
							}`}
						>
							Have questions? We've got answers to help you make informed
							decisions.
						</p>
					</div>

					<div className="space-y-6">
						<div
							className={`rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30"
							}`}
						>
							<div className="p-6">
								<h3
									className={`text-xl font-bold mb-3 font-playfair ${
										isDark ? "text-white" : "text-gray-900"
									}`}
								>
									What services does MythForm Studio offer?
								</h3>
								<p
									className={`font-poppins ${
										isDark ? "text-purple-200" : "text-gray-700"
									}`}
								>
									We offer a comprehensive range of digital services including
									web development, mobile app development, UI/UX design, digital
									marketing, SEO optimization, and e-commerce solutions. Our
									team specializes in creating custom solutions tailored to your
									unique business needs.
								</p>
							</div>
						</div>

						<div
							className={`rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30"
							}`}
						>
							<div className="p-6">
								<h3
									className={`text-xl font-bold mb-3 font-playfair ${
										isDark ? "text-white" : "text-gray-900"
									}`}
								>
									How long does it take to complete a project?
								</h3>
								<p
									className={`font-poppins ${
										isDark ? "text-purple-200" : "text-gray-700"
									}`}
								>
									Project timelines vary based on complexity and scope. A simple
									website might take 2-4 weeks, while complex web applications
									or mobile apps can take 3-6 months. During our initial
									consultation, we'll provide a detailed timeline based on your
									specific requirements.
								</p>
							</div>
						</div>

						<div
							className={`rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30"
							}`}
						>
							<div className="p-6">
								<h3
									className={`text-xl font-bold mb-3 font-playfair ${
										isDark ? "text-white" : "text-gray-900"
									}`}
								>
									What is your process for new projects?
								</h3>
								<p
									className={`font-poppins ${
										isDark ? "text-purple-200" : "text-gray-700"
									}`}
								>
									Our process begins with a discovery phase to understand your
									goals and requirements. We then create wireframes and
									prototypes, followed by design and development. Throughout the
									project, we maintain open communication and provide regular
									updates. After thorough testing, we launch your project and
									provide ongoing support.
								</p>
							</div>
						</div>

						<div
							className={`rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] ${
								isDark
									? "bg-gradient-to-br from-gray-800 to-gray-800/80 border border-purple-700/20"
									: "bg-gradient-to-br from-white to-teal-50/30"
							}`}
						>
							<div className="p-6">
								<h3
									className={`text-xl font-bold mb-3 font-playfair ${
										isDark ? "text-white" : "text-gray-900"
									}`}
								>
									Do you provide ongoing maintenance and support?
								</h3>
								<p
									className={`font-poppins ${
										isDark ? "text-purple-200" : "text-gray-700"
									}`}
								>
									Yes, we offer various maintenance and support packages to
									ensure your digital assets remain secure, up-to-date, and
									performing optimally. Our support team is available to address
									any issues promptly and implement regular updates to keep your
									technology current.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer
				className={`px-4 sm:px-6 py-12 relative z-10 shadow-inner ${
					isDark
						? "bg-gradient-to-br from-gray-900 to-gray-900/95 border-t border-purple-900/30"
						: "bg-gradient-to-br from-teal-50 to-white border-t border-teal-100 shadow-lg"
				}`}
			>
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
						<div>
							<div className="flex items-center mb-6">
								<div
									className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
										isDark
											? "bg-gradient-to-br from-indigo-900 to-purple-900 border border-purple-700/30"
											: "bg-gradient-to-br from-teal-500 to-blue-500"
									}`}
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										aria-hidden="true"
									>
										<path
											d="M12 4L16 8L12 12L8 8L12 4Z"
											fill={isDark ? "#a78bfa" : "#ffffff"}
										/>
										<circle
											cx="12"
											cy="16"
											r="3"
											fill={isDark ? "#a78bfa" : "#ffffff"}
											opacity="0.7"
										/>
									</svg>
								</div>
								<h3
									className={`text-xl font-bold font-playfair ${
										isDark ? "text-white" : "text-gray-900"
									}`}
								>
									MythForm
								</h3>
							</div>
							<p
								className={`font-poppins mb-6 ${
									isDark ? "text-purple-200" : "text-gray-600"
								}`}
							>
								Transforming ideas into exceptional digital experiences through
								innovative design and cutting-edge technology.
							</p>
						</div>

						<div>
							<h4
								className={`text-lg font-bold mb-4 font-playfair ${
									isDark ? "text-white" : "text-gray-900"
								}`}
							>
								Services
							</h4>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										Web Development
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										Mobile Applications
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										UI/UX Design
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										Digital Marketing
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										E-commerce Solutions
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4
								className={`text-lg font-bold mb-4 font-playfair ${
									isDark ? "text-white" : "text-gray-900"
								}`}
							>
								Company
							</h4>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										About Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										Case Studies
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										Testimonials
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										Careers
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`font-poppins ${
											isDark
												? "text-purple-200 hover:text-indigo-400"
												: "text-gray-600 hover:text-teal-600"
										} transition-colors duration-200 focus:outline-none focus:underline`}
									>
										Blog
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4
								className={`text-lg font-bold mb-4 font-playfair ${
									isDark ? "text-white" : "text-gray-900"
								}`}
							>
								Contact
							</h4>
							<ul className="space-y-3">
								<li className="flex items-start">
									<FaEnvelope
										className={`w-5 h-5 mr-3 mt-0.5 ${
											isDark ? "text-indigo-400" : "text-teal-600"
										}`}
										aria-hidden="true"
									/>
									<span
										className={`font-poppins ${
											isDark ? "text-purple-200" : "text-gray-600"
										}`}
									>
										info@mythform.com
									</span>
								</li>
								<li className="flex items-start">
									<FaPhone
										className={`w-5 h-5 mr-3 mt-0.5 ${
											isDark ? "text-indigo-400" : "text-teal-600"
										}`}
										aria-hidden="true"
									/>
									<span
										className={`font-poppins ${
											isDark ? "text-purple-200" : "text-gray-600"
										}`}
									>
										+1 (800) 123-4567
									</span>
								</li>
								<li className="flex items-start">
									<FaMapMarkerAlt
										className={`w-5 h-5 mr-3 mt-0.5 ${
											isDark ? "text-indigo-400" : "text-teal-600"
										}`}
										aria-hidden="true"
									/>
									<span
										className={`font-poppins ${
											isDark ? "text-purple-200" : "text-gray-600"
										}`}
									>
										123 Creative Ave, Suite 100
										<br />
										San Francisco, CA 94103
									</span>
								</li>
							</ul>
						</div>
					</div>

					<div
						className={`pt-6 border-t ${
							isDark ? "border-purple-900/30" : "border-teal-100"
						}`}
					>
						<div className="flex flex-wrap justify-center gap-4">
							<a
								href="#"
								className={`text-sm ${
									isDark
										? "text-purple-400 hover:text-indigo-400"
										: "text-teal-500 hover:text-blue-600"
								} transition-colors duration-200 focus:outline-none focus:underline`}
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className={`text-sm ${
									isDark
										? "text-purple-400 hover:text-indigo-400"
										: "text-teal-500 hover:text-blue-600"
								} transition-colors duration-200 focus:outline-none focus:underline`}
							>
								Terms of Service
							</a>
							<a
								href="#"
								className={`text-sm ${
									isDark
										? "text-purple-400 hover:text-indigo-400"
										: "text-teal-500 hover:text-blue-600"
								} transition-colors duration-200 focus:outline-none focus:underline`}
							>
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</footer>

			{submitSuccess && (
				<SuccessModal isDark={isDark} onClose={handleSuccessClose} />
			)}
		</div>
	);
};
export default ContactForm;
