"use client";
import React, { useState, useEffect, useRef } from "react";

type Project = {
	id: number;
	title: string;
	description: string;
	category: string;
	image: string;
	link: string;
};

type BlogPost = {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	image: string;
	link: string;
	content?: string;
};

type Theme = {
	name: string;
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	text: string;
	glass: string;
	buttonText: string;
	buttonBorder: string;
	buttonHover: string;
	toastBg: string;
	toastText: string;
};

type FormErrors = {
	name: string;
	email: string;
	message: string;
};

const PortfolioLayout: React.FC = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [activeFilter, setActiveFilter] = useState("all");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [currentTheme, setCurrentTheme] = useState<number>(0);
	const [isLoaded, setIsLoaded] = useState(false);

	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
	const [modalAnimationActive, setModalAnimationActive] = useState(false);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [formErrors, setFormErrors] = useState<FormErrors>({
		name: "",
		email: "",
		message: "",
	});
	const [formSubmitted, setFormSubmitted] = useState(false);

	const heroRef = useRef<HTMLDivElement>(null);
	const projectsRef = useRef<HTMLDivElement>(null);
	const blogRef = useRef<HTMLDivElement>(null);
	const contactRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				closeModals();
			}
		};

		if (isProjectModalOpen || isBlogModalOpen) {
			document.addEventListener("mousedown", handleClickOutside);

			const scrollY = window.scrollY;
			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";
		}

		return () => {
			if (isProjectModalOpen || isBlogModalOpen) {
				document.removeEventListener("mousedown", handleClickOutside);

				const scrollY = document.body.style.top;
				document.body.style.position = "";
				document.body.style.top = "";
				document.body.style.width = "";
				window.scrollTo(0, parseInt(scrollY || "0") * -1);
			}
		};
	}, [isProjectModalOpen, isBlogModalOpen]);

	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeModals();
			}
		};

		window.addEventListener("keydown", handleEscKey);
		return () => {
			window.removeEventListener("keydown", handleEscKey);
		};
	}, []);

	const themes: Theme[] = [
		{
			name: "Blue Eclipse",
			primary: "bg-blue-900",
			secondary: "bg-blue-800",
			accent: "bg-blue-500",
			background: isDarkMode ? "bg-gray-900" : "bg-gray-100",
			text: isDarkMode ? "text-gray-100" : "text-gray-900",
			glass: isDarkMode
				? "bg-blue-900/30 backdrop-blur-md border border-blue-700/50"
				: "bg-white/70 backdrop-blur-md border border-blue-200",
			buttonText: "text-blue-500",
			buttonBorder: "border-blue-500",
			buttonHover: "hover:bg-blue-500/10",
			toastBg: "bg-blue-500",
			toastText: "text-white",
		},
		{
			name: "Purple Haze",
			primary: "bg-purple-900",
			secondary: "bg-purple-800",
			accent: "bg-purple-500",
			background: isDarkMode ? "bg-gray-900" : "bg-gray-100",
			text: isDarkMode ? "text-gray-100" : "text-gray-900",
			glass: isDarkMode
				? "bg-purple-900/30 backdrop-blur-md border border-purple-700/50"
				: "bg-white/70 backdrop-blur-md border border-purple-200",
			buttonText: "text-purple-500",
			buttonBorder: "border-purple-500",
			buttonHover: "hover:bg-purple-500/10",
			toastBg: "bg-purple-500",
			toastText: "text-white",
		},
		{
			name: "Emerald Dream",
			primary: "bg-emerald-900",
			secondary: "bg-emerald-800",
			accent: "bg-emerald-500",
			background: isDarkMode ? "bg-gray-900" : "bg-gray-100",
			text: isDarkMode ? "text-gray-100" : "text-gray-900",
			glass: isDarkMode
				? "bg-emerald-900/30 backdrop-blur-md border border-emerald-700/50"
				: "bg-white/70 backdrop-blur-md border border-emerald-200",
			buttonText: "text-emerald-500",
			buttonBorder: "border-emerald-500",
			buttonHover: "hover:bg-emerald-500/10",
			toastBg: "bg-emerald-500",
			toastText: "text-white",
		},
	];

	const projects: Project[] = [
		{
			id: 1,
			title: "E-Commerce Platform",
			description:
				"A fully responsive e-commerce solution with cart functionality and payment integration.",
			category: "web",
			image:
				"https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
			link: "#",
		},
		{
			id: 2,
			title: "Finance Dashboard",
			description:
				"Interactive dashboard for monitoring financial metrics with real-time data visualization.",
			category: "dashboard",
			image:
				"https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
			link: "#",
		},
		{
			id: 3,
			title: "Travel App",
			description:
				"Mobile application for travelers with itinerary planning and local recommendations.",
			category: "mobile",
			image:
				"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
			link: "#",
		},
		{
			id: 4,
			title: "Healthcare Portal",
			description:
				"Secure patient portal for healthcare providers with appointment scheduling.",
			category: "web",
			image:
				"https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
			link: "#",
		},
		{
			id: 5,
			title: "AI Image Generator",
			description:
				"Web application that uses machine learning to generate unique images from text prompts.",
			category: "ai",
			image:
				"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
			link: "#",
		},
		{
			id: 6,
			title: "Fitness Tracker",
			description:
				"Wearable device companion app for tracking fitness goals and health metrics.",
			category: "mobile",
			image:
				"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
			link: "#",
		},
	];

	const blogPosts: BlogPost[] = [
		{
			id: 1,
			title: "The Future of Web Development",
			excerpt:
				"Exploring emerging technologies and frameworks that are shaping the future of web development.",
			date: "May 2, 2025",
			image:
				"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
			link: "#",
			content: `<p>The web development landscape is evolving at an unprecedented pace, with new technologies and methodologies emerging constantly. As we move forward, several key trends are reshaping how developers approach their craft.</p>
					<p>WebAssembly (WASM) is gaining momentum as a powerful complement to JavaScript, enabling high-performance computing in the browser. This technology allows developers to run code written in languages like C++, Rust, and Go directly in web browsers at near-native speeds.</p>
					<p>Frameworks are increasingly adopting meta-frameworks approaches. Next.js for React, Nuxt for Vue, and SvelteKit for Svelte all provide unified solutions for rendering, routing, and data fetching. These meta-frameworks simplify development workflows while delivering optimized performance.</p>
					<p>Serverless architecture continues to transform backend development, with platforms like Vercel, Netlify, and AWS Amplify making it easier than ever to deploy and scale web applications without managing traditional server infrastructure.</p>
					<p>Edge computing is bringing computation closer to users, with technologies like Cloudflare Workers and Deno Deploy allowing code execution at edge locations worldwide, dramatically reducing latency for global audiences.</p>`,
		},
		{
			id: 2,
			title: "Optimizing React Performance",
			excerpt:
				"Practical tips and techniques for improving the performance of your React applications.",
			date: "April 28, 2025",
			image:
				"https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
			link: "#",
			content: `<p>Performance optimization is crucial for delivering smooth, responsive React applications. By implementing key strategies, you can significantly enhance your app's user experience.</p>
					<p>Component memoization using React.memo, useMemo, and useCallback effectively prevents unnecessary re-renders. This technique is especially valuable for computationally expensive operations or when rendering large lists of items.</p>
					<p>Code splitting with React.lazy and Suspense reduces initial bundle sizes by loading components only when needed. This approach can dramatically improve initial load times, particularly for large applications with multiple routes.</p>
					<p>Virtual lists through libraries like react-window or react-virtualized efficiently render only the visible portion of long lists, maintaining smooth scrolling performance even with thousands of items.</p>
					<p>State management optimization is essential - consider whether you need global state or if local state would suffice. For global state, evaluate whether Context API meets your needs or if more robust solutions like Redux, Recoil, or Jotai would be more appropriate.</p>
					<p>Performance profiling using React Developer Tools helps identify bottlenecks in your application. The Profiler tab allows you to record rendering performance and pinpoint components that may benefit from optimization.</p>`,
		},
		{
			id: 3,
			title: "Designing for Accessibility",
			excerpt:
				"Why accessibility matters and how to implement inclusive design principles in your projects.",
			date: "April 15, 2025",
			image:
				"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
			link: "#",
			content: `<p>Accessibility is not just about compliance—it's about creating digital products that everyone can use, regardless of abilities or disabilities. Implementing accessible design benefits all users and expands your audience reach.</p>
					<p>Semantic HTML forms the foundation of accessible web applications. Using the correct elements like buttons, headings, and landmarks helps assistive technologies understand and navigate your content properly.</p>
					<p>Keyboard navigation is essential for users who cannot use a mouse. Ensure all interactive elements are focusable and that focus states are clearly visible. Implement logical tab order and provide keyboard shortcuts for common actions.</p>
					<p>Color contrast must meet WCAG standards to ensure text is readable for users with visual impairments. Use tools like the WebAIM Contrast Checker to verify your color combinations meet at least AA standard (4.5:1 for normal text).</p>
					<p>Alternative text for images conveys important information to screen reader users. Write concise, descriptive alt text that communicates the image's purpose or content rather than merely describing what's visually apparent.</p>
					<p>ARIA attributes supplement HTML when native semantics aren't sufficient. However, they should be used sparingly—the first rule of ARIA is "don't use ARIA if you can use native HTML instead."</p>
					<p>Regular testing with assistive technologies like screen readers helps identify issues that automated tools might miss. Include people with disabilities in your user testing process for the most comprehensive feedback.</p>`,
		},
	];

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoaded(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateForm = (): boolean => {
		const errors: FormErrors = {
			name: "",
			email: "",
			message: "",
		};
		let isValid = true;

		if (!name.trim()) {
			errors.name = "Name is required";
			isValid = false;
		}

		if (!email.trim()) {
			errors.email = "Email is required";
			isValid = false;
		} else if (!isValidEmail(email)) {
			errors.email = "Please enter a valid email";
			isValid = false;
		}

		if (!message.trim()) {
			errors.message = "Message is required";
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	const showToastNotification = (message: string) => {
		setToastMessage(message);
		setShowToast(true);
		setTimeout(() => {
			setShowToast(false);
		}, 3000);
	};

	const handleEmptyLink = (e: React.MouseEvent, message: string) => {
		e.preventDefault();
		showToastNotification(message);
	};

	const toggleTheme = () => {
		setCurrentTheme((prev) => (prev + 1) % themes.length);
		showToastNotification(
			`Theme changed to ${themes[(currentTheme + 1) % themes.length].name}`
		);
	};

	const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
		if (ref.current) {
			ref.current.scrollIntoView({ behavior: "smooth" });
		}
		setIsMenuOpen(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setFormSubmitted(true);

		if (validateForm()) {
			showToastNotification("Message sent successfully!");
			setName("");
			setEmail("");
			setMessage("");
			setFormSubmitted(false);
		} else {
			showToastNotification("Please fill in all required fields");
		}
	};

	const openProjectModal = (project: Project, e: React.MouseEvent) => {
		e.preventDefault();
		setSelectedProject(project);
		setIsProjectModalOpen(true);
		setModalAnimationActive(true);
	};

	const openBlogModal = (blog: BlogPost, e: React.MouseEvent) => {
		e.preventDefault();
		setSelectedBlog(blog);
		setIsBlogModalOpen(true);
		setModalAnimationActive(true);
	};

	const closeModals = () => {
		setIsProjectModalOpen(false);
		setIsBlogModalOpen(false);
		setModalAnimationActive(false);
	};

	const filteredProjects =
		activeFilter === "all"
			? projects
			: projects.filter((project) => project.category === activeFilter);

	const theme = themes[currentTheme];

	return (
		<div
			className={`min-h-screen ${theme.background} ${theme.text} transition-colors duration-300 font-poppins`}
		>
			{/* Background blobs */}
			<div className="fixed inset-0 -z-10 overflow-hidden">
				<div
					className={`absolute top-0 left-0 w-1/3 h-1/3 rounded-full ${theme.primary} opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-blob`}
				></div>
				<div
					className={`absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full ${theme.secondary} opacity-20 blur-3xl transform translate-x-1/3 translate-y-1/3 animate-blob animation-delay-2000`}
				></div>
				<div
					className={`absolute top-1/2 left-1/2 w-1/3 h-1/3 rounded-full ${theme.accent} opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000`}
				></div>
			</div>

			{/* Header */}
			<header
				className={`fixed top-0 left-0 right-0 z-50 ${theme.glass} transition-all duration-300`}
			>
				<div className="container mx-auto px-4 py-3 flex justify-between items-center">
					<a
						href="#"
						className="text-xl sm:text-2xl font-bold tracking-tight group"
						onClick={(e) => handleEmptyLink(e, "Home link clicked")}
					>
						<span
							className={`text-transparent bg-clip-text bg-gradient-to-r from-${
								theme.accent.split("-")[1]
							}-400 to-${theme.accent.split("-")[1]}-600 group-hover:from-${
								theme.accent.split("-")[1]
							}-500 group-hover:to-${
								theme.accent.split("-")[1]
							}-700 transition-all duration-300`}
						>
							Alex
						</span>
						<span className="ml-1">Chen</span>
					</a>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex space-x-8">
						<button
							onClick={() => scrollToSection(heroRef)}
							className={`text-sm font-medium hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
						>
							Home
						</button>
						<button
							onClick={() => scrollToSection(projectsRef)}
							className={`text-sm font-medium hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
						>
							Projects
						</button>
						<button
							onClick={() => scrollToSection(blogRef)}
							className={`text-sm font-medium hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
						>
							Blog
						</button>
						<button
							onClick={() => scrollToSection(contactRef)}
							className={`text-sm font-medium hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
						>
							Contact
						</button>
					</nav>

					{/* Desktop Theme Toggles */}
					<div className="hidden md:flex items-center space-x-3">
						<button
							onClick={toggleTheme}
							className={`p-2 rounded-full ${theme.accent} text-white hover:brightness-110 transition-all duration-300 cursor-pointer`}
							aria-label="Change theme"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
								/>
							</svg>
						</button>
						<button
							onClick={() => setIsDarkMode(!isDarkMode)}
							className={`p-2 rounded-full ${theme.accent} text-white hover:brightness-110 transition-all duration-300 cursor-pointer`}
							aria-label="Toggle dark mode"
						>
							{isDarkMode ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-4 h-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-4 h-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
									/>
								</svg>
							)}
						</button>
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 rounded-lg hover:bg-blue-800/20 transition-colors duration-300 cursor-pointer"
						aria-label="Toggle menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="w-5 h-5"
						>
							{isMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
				</div>

				{/* Mobile Menu */}
				<div
					className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
						isMenuOpen ? "max-h-80" : "max-h-0"
					}`}
				>
					<div className="container mx-auto px-4 pb-4 space-y-3">
						<button
							onClick={() => scrollToSection(heroRef)}
							className={`block w-full text-left py-2 text-sm hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
						>
							Home
						</button>
						<button
							onClick={() => scrollToSection(projectsRef)}
							className={`block w-full text-left py-2 text-sm hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
						>
							Projects
						</button>
						<button
							onClick={() => scrollToSection(blogRef)}
							className={`block w-full text-left py-2 text-sm hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
						>
							Blog
						</button>
						<button
							onClick={() => scrollToSection(contactRef)}
							className={`block w-full text-left py-2 text-sm hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
						>
							Contact
						</button>

						{/* Mobile Theme Toggles */}
						<div className="flex items-center space-x-3 pt-2">
							<button
								onClick={toggleTheme}
								className={`p-2 rounded-full ${theme.accent} text-white hover:brightness-110 transition-all duration-300 cursor-pointer`}
								aria-label="Change theme"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-4 h-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
									/>
								</svg>
							</button>
							<button
								onClick={() => setIsDarkMode(!isDarkMode)}
								className={`p-2 rounded-full ${theme.accent} text-white hover:brightness-110 transition-all duration-300 cursor-pointer`}
								aria-label="Toggle dark mode"
							>
								{isDarkMode ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										className="w-4 h-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										className="w-4 h-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section
				ref={heroRef}
				className={`min-h-screen flex items-center pt-20 sm:pt-24 pb-8 sm:pb-12 transition-opacity duration-1000 ${
					isLoaded ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
						<div className="w-full md:w-1/2 order-2 md:order-1 mt-6 md:mt-0">
							<div className="space-y-4 md:space-y-6 max-w-lg">
								<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
									<span className="block">Full-Stack</span>
									<span
										className={`text-transparent bg-clip-text bg-gradient-to-r from-${
											theme.accent.split("-")[1]
										}-400 to-${theme.accent.split("-")[1]}-600`}
									>
										Developer & UX Designer
									</span>
								</h1>
								<p className="text-base sm:text-lg opacity-90 leading-relaxed">
									Hi, I'm Alex! I specialize in creating innovative web
									applications and mobile experiences with React, Next.js, and
									TypeScript. With 5+ years of experience building solutions for
									startups and enterprises, I combine technical expertise with
									human-centered design principles to deliver products that
									users love.
								</p>
								<div className="flex flex-col xs:flex-row gap-3">
									<button
										onClick={() => scrollToSection(projectsRef)}
										className={`px-4 py-2 sm:px-5 sm:py-3 rounded-lg ${theme.accent} text-white hover:brightness-110 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-xs sm:text-sm`}
									>
										View Portfolio
									</button>
									<button
										onClick={() => scrollToSection(contactRef)}
										className={`px-4 py-2 sm:px-5 sm:py-3 rounded-lg border-2 ${theme.buttonBorder} ${theme.buttonHover} transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-xs sm:text-sm`}
									>
										Contact Me
									</button>
								</div>
							</div>
						</div>

						<div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
							<div
								className={`relative w-56 h-56 sm:w-64 sm:h-64 ${theme.glass} rounded-full p-3 transform hover:scale-105 transition-transform duration-300 animate-float`}
							>
								<img
									src="https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=881&q=80"
									alt="Profile"
									className="w-full h-full object-cover rounded-full"
								/>
								<div
									className={`absolute -bottom-4 -right-4 ${theme.accent} rounded-full p-2 shadow-lg`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="white"
										className="w-5 h-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-16 md:mt-24">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
							<div
								className={`${theme.glass} p-4 md:p-6 rounded-xl transform hover:scale-105 transition-all duration-300`}
							>
								<div
									className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${theme.buttonText}`}
								>
									5+
								</div>
								<div className="text-xs md:text-sm font-medium opacity-80">
									Years Experience
								</div>
							</div>
							<div
								className={`${theme.glass} p-4 md:p-6 rounded-xl transform hover:scale-105 transition-all duration-300`}
							>
								<div
									className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${theme.buttonText}`}
								>
									100+
								</div>
								<div className="text-xs md:text-sm font-medium opacity-80">
									Projects Completed
								</div>
							</div>
							<div
								className={`${theme.glass} p-4 md:p-6 rounded-xl transform hover:scale-105 transition-all duration-300`}
							>
								<div
									className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${theme.buttonText}`}
								>
									50+
								</div>
								<div className="text-xs md:text-sm font-medium opacity-80">
									Happy Clients
								</div>
							</div>
							<div
								className={`${theme.glass} p-4 md:p-6 rounded-xl transform hover:scale-105 transition-all duration-300`}
							>
								<div
									className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${theme.buttonText}`}
								>
									12
								</div>
								<div className="text-xs md:text-sm font-medium opacity-80">
									Awards Received
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Projects Section */}
			<section
				ref={projectsRef}
				className="py-12 md:py-20 transition-opacity duration-1000 delay-200"
			>
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
						<h2 className="text-2xl md:text-3xl font-bold mb-3">
							Featured Projects
						</h2>
						<p className="text-sm md:text-base opacity-80">
							Explore my latest work across web, mobile, and AI development.
						</p>
					</div>

					{/* Project Filters */}
					<div className="flex flex-wrap justify-center gap-2 mb-8">
						<button
							onClick={() => setActiveFilter("all")}
							className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all duration-300 cursor-pointer ${
								activeFilter === "all"
									? `${theme.accent} text-white`
									: `${theme.glass} ${theme.buttonHover}`
							}`}
						>
							All Projects
						</button>
						<button
							onClick={() => setActiveFilter("web")}
							className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all duration-300 cursor-pointer ${
								activeFilter === "web"
									? `${theme.accent} text-white`
									: `${theme.glass} ${theme.buttonHover}`
							}`}
						>
							Web
						</button>
						<button
							onClick={() => setActiveFilter("mobile")}
							className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all duration-300 cursor-pointer ${
								activeFilter === "mobile"
									? `${theme.accent} text-white`
									: `${theme.glass} ${theme.buttonHover}`
							}`}
						>
							Mobile
						</button>
						<button
							onClick={() => setActiveFilter("dashboard")}
							className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all duration-300 cursor-pointer ${
								activeFilter === "dashboard"
									? `${theme.accent} text-white`
									: `${theme.glass} ${theme.buttonHover}`
							}`}
						>
							Dashboard
						</button>
						<button
							onClick={() => setActiveFilter("ai")}
							className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all duration-300 cursor-pointer ${
								activeFilter === "ai"
									? `${theme.accent} text-white`
									: `${theme.glass} ${theme.buttonHover}`
							}`}
						>
							AI
						</button>
					</div>

					{/* Projects Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						{filteredProjects.map((project) => (
							<div
								key={project.id}
								className={`${theme.glass} rounded-xl overflow-hidden group transition-transform duration-300 transform hover:-translate-y-1 cursor-pointer`}
								onClick={(e) => openProjectModal(project, e)}
							>
								<div className="relative overflow-hidden h-40 sm:h-48">
									<img
										src={project.image}
										alt={project.title}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
										<span className="px-3 py-1 bg-white text-black rounded-lg font-medium text-xs hover:bg-gray-100 transition-colors duration-300">
											View Details
										</span>
									</div>
								</div>
								<div className="p-4">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-bold">{project.title}</h3>
										<span
											className={`text-xs uppercase px-2 py-1 rounded-full ${theme.accent} text-white font-semibold ml-2`}
										>
											{project.category}
										</span>
									</div>
									<p className="text-xs opacity-80 line-clamp-2">
										{project.description}
									</p>
								</div>
							</div>
						))}
					</div>

					<div className="text-center mt-8">
						<button
							onClick={(e) => handleEmptyLink(e, "View all projects clicked")}
							className={`px-4 py-2 rounded-lg border-2 ${theme.buttonBorder} ${theme.buttonHover} transition-all duration-300 cursor-pointer text-sm`}
						>
							View All Projects
						</button>
					</div>
				</div>
			</section>

			{/* Blog Section */}
			<section
				ref={blogRef}
				className="py-12 md:py-20 transition-opacity duration-1000 delay-400"
			>
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
						<h2 className="text-2xl md:text-3xl font-bold mb-3">
							Latest from the Blog
						</h2>
						<p className="text-sm md:text-base opacity-80">
							Thoughts, insights, and guides on development and design.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
						{blogPosts.map((post) => (
							<div
								key={post.id}
								className={`${theme.glass} rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
								onClick={(e) => openBlogModal(post, e)}
							>
								<div className="relative overflow-hidden h-40">
									<img
										src={post.image}
										alt={post.title}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<div
										className={`absolute top-2 left-2 ${theme.accent} text-white text-xs px-2 py-0.5 rounded-full`}
									>
										{post.date}
									</div>
								</div>
								<div className="p-4">
									<h3 className={`text-lg font-bold mb-2 duration-300`}>
										{post.title}
									</h3>
									<p className="text-xs opacity-80 mb-3 line-clamp-2">
										{post.excerpt}
									</p>
									<span
										className={`${theme.buttonText} font-medium text-xs hover:brightness-90 transition-colors duration-300 flex items-center`}
									>
										Read More
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											className="w-3 h-3 ml-1"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M14 5l7 7m0 0l-7 7m7-7H3"
											/>
										</svg>
									</span>
								</div>
							</div>
						))}
					</div>

					<div className="text-center mt-8">
						<button
							onClick={(e) => handleEmptyLink(e, "View all articles clicked")}
							className={`px-4 py-2 rounded-lg border-2 ${theme.buttonBorder} ${theme.buttonHover} transition-all duration-300 cursor-pointer text-sm`}
						>
							View All Articles
						</button>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section
				ref={contactRef}
				className="py-12 md:py-20 transition-opacity duration-1000 delay-600"
			>
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className={`${theme.glass} rounded-2xl overflow-hidden`}>
							<div className="grid grid-cols-1 md:grid-cols-2">
								<div className="p-6 md:p-8">
									<h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
									<p className="text-sm opacity-80 mb-6">
										Have a project in mind or want to collaborate? Send me a
										message!
									</p>

									<form onSubmit={handleSubmit} className="space-y-3">
										<div>
											<label
												htmlFor="name"
												className="block text-xs font-medium mb-1"
											>
												Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="name"
												value={name}
												onChange={(e) => setName(e.target.value)}
												placeholder="Your name"
												className={`w-full px-3 py-2 text-sm rounded-lg bg-opacity-50 ${
													isDarkMode ? "bg-gray-800" : "bg-white"
												} border ${
													formErrors.name && formSubmitted
														? "border-red-500"
														: isDarkMode
														? "border-gray-700"
														: "border-gray-200"
												} ${
													theme.buttonText === "text-blue-500"
														? "focus:border-blue-500"
														: theme.buttonText === "text-purple-500"
														? "focus:border-purple-500"
														: "focus:border-emerald-500"
												} focus:outline-none transition-colors duration-300`}
											/>
											{formErrors.name && formSubmitted && (
												<p className="text-red-500 text-xs mt-1">
													{formErrors.name}
												</p>
											)}
										</div>
										<div>
											<label
												htmlFor="email"
												className="block text-xs font-medium mb-1"
											>
												Email <span className="text-red-500">*</span>
											</label>
											<input
												type="email"
												id="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="Your email"
												className={`w-full px-3 py-2 text-sm rounded-lg bg-opacity-50 ${
													isDarkMode ? "bg-gray-800" : "bg-white"
												} border ${
													formErrors.email && formSubmitted
														? "border-red-500"
														: isDarkMode
														? "border-gray-700"
														: "border-gray-200"
												} ${
													theme.buttonText === "text-blue-500"
														? "focus:border-blue-500"
														: theme.buttonText === "text-purple-500"
														? "focus:border-purple-500"
														: "focus:border-emerald-500"
												} focus:outline-none transition-colors duration-300`}
											/>
											{formErrors.email && formSubmitted && (
												<p className="text-red-500 text-xs mt-1">
													{formErrors.email}
												</p>
											)}
										</div>
										<div>
											<label
												htmlFor="message"
												className="block text-xs font-medium mb-1"
											>
												Message <span className="text-red-500">*</span>
											</label>
											<textarea
												id="message"
												value={message}
												onChange={(e) => setMessage(e.target.value)}
												placeholder="Your message"
												rows={4}
												className={`w-full px-3 py-2 text-sm rounded-lg bg-opacity-50 ${
													isDarkMode ? "bg-gray-800" : "bg-white"
												} border ${
													formErrors.message && formSubmitted
														? "border-red-500"
														: isDarkMode
														? "border-gray-700"
														: "border-gray-200"
												} ${
													theme.buttonText === "text-blue-500"
														? "focus:border-blue-500"
														: theme.buttonText === "text-purple-500"
														? "focus:border-purple-500"
														: "focus:border-emerald-500"
												} focus:outline-none transition-colors duration-300`}
											></textarea>
											{formErrors.message && formSubmitted && (
												<p className="text-red-500 text-xs mt-1">
													{formErrors.message}
												</p>
											)}
										</div>
										<button
											type="submit"
											className={`w-full py-2 rounded-lg ${theme.accent} text-white hover:brightness-110 transition-all duration-300 cursor-pointer text-sm`}
										>
											Send Message
										</button>
									</form>
								</div>

								<div className={`relative overflow-hidden hidden md:block`}>
									<div className="absolute inset-0 bg-black opacity-70"></div>
									<img
										src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
										alt="Contact"
										className="absolute inset-0 w-full h-full object-cover"
									/>
									<div className="absolute inset-0 flex items-center justify-center p-8">
										<div className="text-white text-center">
											<div className="flex justify-center mb-4">
												<div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														className="w-10 h-10"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
														/>
													</svg>
												</div>
											</div>
											<h3 className="text-xl font-bold mb-3">
												Contact Information
											</h3>
											<div className="space-y-3 max-w-xs mx-auto bg-black/40 p-4 rounded-lg">
												<div className="flex items-center space-x-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														className="w-4 h-4"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
														/>
													</svg>
													<span className="text-sm">+1 (555) 123-4567</span>
												</div>
												<div className="flex items-center space-x-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														className="w-4 h-4"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
														/>
													</svg>
													<span className="text-sm">
														hello@skylineportfolio.com
													</span>
												</div>
												<div className="flex items-center space-x-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														className="w-4 h-4"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
														/>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
														/>
													</svg>
													<span className="text-sm">San Francisco, CA</span>
												</div>
											</div>
											<div className="flex justify-center space-x-3 mt-6">
												<a
													href="#"
													onClick={(e) => handleEmptyLink(e, "Twitter clicked")}
													className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition-colors duration-300 cursor-pointer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="bi bi-twitter"
														viewBox="0 0 16 16"
													>
														<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
													</svg>
												</a>
												<a
													href="#"
													onClick={(e) =>
														handleEmptyLink(e, "LinkedIn clicked")
													}
													className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition-colors duration-300 cursor-pointer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="bi bi-linkedin"
														viewBox="0 0 16 16"
													>
														<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
													</svg>
												</a>
												<a
													href="#"
													onClick={(e) => handleEmptyLink(e, "GitHub clicked")}
													className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition-colors duration-300 cursor-pointer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="bi bi-github"
														viewBox="0 0 16 16"
													>
														<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
													</svg>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 md:py-12 border-t border-gray-800/20 mt-8">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-6 md:mb-0">
							<a
								href="#"
								className="text-xl font-bold"
								onClick={(e) => handleEmptyLink(e, "Logo clicked")}
							>
								<span
									className={`text-transparent bg-clip-text bg-gradient-to-r from-${
										theme.accent.split("-")[1]
									}-400 to-${theme.accent.split("-")[1]}-600`}
								>
									Alex
								</span>
								<span className="ml-1">Chen</span>
							</a>
							<p className="mt-2 text-xs opacity-70 max-w-md">
								Building innovative web and mobile solutions that combine
								beautiful design with scalable architecture. Passionate about
								creating digital experiences that make a difference.
							</p>
						</div>

						<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
							<div>
								<h5 className="text-xs font-semibold mb-3">Navigation</h5>
								<ul className="space-y-2 text-xs">
									<li>
										<button
											onClick={() => scrollToSection(heroRef)}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Home
										</button>
									</li>
									<li>
										<button
											onClick={() => scrollToSection(projectsRef)}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Projects
										</button>
									</li>
									<li>
										<button
											onClick={() => scrollToSection(blogRef)}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Blog
										</button>
									</li>
									<li>
										<button
											onClick={() => scrollToSection(contactRef)}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Contact
										</button>
									</li>
								</ul>
							</div>
							<div>
								<h5 className="text-xs font-semibold mb-3">Services</h5>
								<ul className="space-y-2 text-xs">
									<li>
										<a
											href="#"
											onClick={(e) =>
												handleEmptyLink(e, "Web Development clicked")
											}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Web Development
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) =>
												handleEmptyLink(e, "UI/UX Design clicked")
											}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											UI/UX Design
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => handleEmptyLink(e, "Mobile Apps clicked")}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Mobile Apps
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => handleEmptyLink(e, "Consulting clicked")}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Consulting
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h5 className="text-xs font-semibold mb-3">Connect</h5>
								<ul className="space-y-2 text-xs">
									<li>
										<a
											href="#"
											onClick={(e) => handleEmptyLink(e, "Twitter clicked")}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Twitter
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => handleEmptyLink(e, "LinkedIn clicked")}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											LinkedIn
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => handleEmptyLink(e, "GitHub clicked")}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											GitHub
										</a>
									</li>
									<li>
										<a
											href="#"
											onClick={(e) => handleEmptyLink(e, "Dribbble clicked")}
											className={`opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
										>
											Dribbble
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-800/20 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
						<p className="text-xs opacity-70">
							© {new Date().getFullYear()} Skyline Portfolio. All rights
							reserved.
						</p>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<a
								href="#"
								onClick={(e) => handleEmptyLink(e, "Privacy Policy clicked")}
								className={`text-xs opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
							>
								Privacy Policy
							</a>
							<a
								href="#"
								onClick={(e) => handleEmptyLink(e, "Terms of Service clicked")}
								className={`text-xs opacity-70 hover:opacity-100 hover:${theme.buttonText} transition-colors duration-300 cursor-pointer`}
							>
								Terms of Service
							</a>
						</div>
					</div>
				</div>
			</footer>

			{/* Project Modal */}
			{isProjectModalOpen && selectedProject && (
				<div className="fixed inset-0 z-50 overflow-auto bg-black/70 flex items-center justify-center p-3 sm:p-4">
					<div
						ref={modalRef}
						className={`relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl ${
							theme.background
						} ${
							theme.text
						} rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
							modalAnimationActive
								? "scale-100 opacity-100"
								: "scale-95 opacity-0"
						} max-h-[90vh] flex flex-col`}
					>
						<div className="relative h-48 sm:h-56 md:h-64 flex-shrink-0">
							<img
								src={selectedProject.image}
								alt={selectedProject.title}
								className="w-full h-full object-cover"
							/>
							<button
								onClick={closeModals}
								className="absolute cursor-pointer top-2 right-2 sm:top-4 sm:right-4 bg-black/50 text-white rounded-full p-1.5 sm:p-2 hover:bg-black/70 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-4 h-4 sm:w-5 sm:h-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
							<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
								<div className="flex items-start justify-between flex-wrap gap-1">
									<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
										{selectedProject.title}
									</h2>
									<span
										className={`text-xs uppercase px-2 py-1 rounded-full ${theme.accent} text-white font-semibold ml-2`}
									>
										{selectedProject.category}
									</span>
								</div>
							</div>
						</div>
						<div className="p-4 sm:p-6 overflow-y-auto flex-grow">
							<div className="mb-4 sm:mb-6">
								<h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
									Project Overview
								</h3>
								<p className="text-xs sm:text-sm">
									{selectedProject.description}
								</p>

								{/* Additional description */}
								<div className="mt-3 sm:mt-4 text-xs sm:text-sm">
									<p>
										This was a challenging project that required implementing
										complex functionality while maintaining a clean, intuitive
										user interface. I utilized modern technologies and best
										practices to ensure optimal performance and scalability.
									</p>
								</div>
							</div>

							<div className="mb-4 sm:mb-6">
								<h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
									Technologies Used
								</h3>
								<div className="flex flex-wrap gap-1.5 sm:gap-2">
									{/* Technology tags */}
									<span
										className={`text-xs px-2 sm:px-3 py-1 rounded-full ${theme.glass}`}
									>
										React
									</span>
									<span
										className={`text-xs px-2 sm:px-3 py-1 rounded-full ${theme.glass}`}
									>
										TypeScript
									</span>
									<span
										className={`text-xs px-2 sm:px-3 py-1 rounded-full ${theme.glass}`}
									>
										Next.js
									</span>
									<span
										className={`text-xs px-2 sm:px-3 py-1 rounded-full ${theme.glass}`}
									>
										Tailwind CSS
									</span>
									<span
										className={`text-xs px-2 sm:px-3 py-1 rounded-full ${theme.glass}`}
									>
										Node.js
									</span>
								</div>
							</div>

							<div className="mb-4 sm:mb-6">
								<h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
									Key Features
								</h3>
								<ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
									<li>Responsive design across all device sizes</li>
									<li>Real-time data synchronization</li>
									<li>Advanced filtering and sorting capabilities</li>
									<li>Optimized performance with lazy loading</li>
									<li>Comprehensive analytics dashboard</li>
								</ul>
							</div>

							<div className="flex justify-between items-center border-t border-gray-200/20 pt-3 sm:pt-4 mt-3 sm:mt-4 flex-wrap gap-2">
								<div className="text-xs sm:text-sm opacity-80">
									Completed: March 2025
								</div>
								<a
									href={selectedProject.link}
									onClick={(e) => handleEmptyLink(e, "Visit project clicked")}
									className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${theme.accent} text-white hover:brightness-110 transition-all duration-300 cursor-pointer text-xs`}
								>
									Visit Project
								</a>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Blog Modal */}
			{isBlogModalOpen && selectedBlog && (
				<div className="fixed inset-0 z-50 overflow-auto bg-black/70 flex items-center justify-center p-3 sm:p-4">
					<div
						ref={modalRef}
						className={`relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl ${
							theme.background
						} ${
							theme.text
						} rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
							modalAnimationActive
								? "scale-100 opacity-100"
								: "scale-95 opacity-0"
						} max-h-[85vh] flex flex-col`}
					>
						<div className="relative h-40 sm:h-48 flex-shrink-0">
							<img
								src={selectedBlog.image}
								alt={selectedBlog.title}
								className="w-full h-full object-cover"
							/>
							<button
								onClick={closeModals}
								className="absolute cursor-pointer top-2 right-2 sm:top-4 sm:right-4 bg-black/50 text-white rounded-full p-1.5 sm:p-2 hover:bg-black/70 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-4 h-4 sm:w-5 sm:h-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
							<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
								<span
									className={`inline-block ${theme.accent} text-white text-xs px-2 py-0.5 rounded-full mb-1 sm:mb-2`}
								>
									{selectedBlog.date}
								</span>
								<h2 className="text-lg sm:text-xl font-bold text-white">
									{selectedBlog.title}
								</h2>
							</div>
						</div>
						<div className="p-4 sm:p-6 overflow-y-auto flex-grow">
							<div
								className="prose prose-xs sm:prose-sm max-w-none"
								dangerouslySetInnerHTML={{ __html: selectedBlog.content || "" }}
							></div>

							<div className="border-t border-gray-200/20 pt-3 sm:pt-4 mt-4 sm:mt-6">
								<h3 className="text-base sm:text-lg font-semibold mb-2">
									Share this article
								</h3>
								<div className="flex space-x-2 sm:space-x-3">
									<a
										href="#"
										onClick={(e) =>
											handleEmptyLink(e, "Share on Twitter clicked")
										}
										className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${theme.accent} text-white flex items-center justify-center hover:brightness-110 transition-colors duration-300`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											fill="currentColor"
											className="bi bi-twitter"
											viewBox="0 0 16 16"
										>
											<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
										</svg>
									</a>
									<a
										href="#"
										onClick={(e) =>
											handleEmptyLink(e, "Share on LinkedIn clicked")
										}
										className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${theme.accent} text-white flex items-center justify-center hover:brightness-110 transition-colors duration-300`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											fill="currentColor"
											className="bi bi-linkedin"
											viewBox="0 0 16 16"
										>
											<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
										</svg>
									</a>
									<a
										href="#"
										onClick={(e) =>
											handleEmptyLink(e, "Share on Facebook clicked")
										}
										className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${theme.accent} text-white flex items-center justify-center hover:brightness-110 transition-colors duration-300`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											fill="currentColor"
											className="bi bi-facebook"
											viewBox="0 0 16 16"
										>
											<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
										</svg>
									</a>
								</div>
							</div>

							<div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/20">
								<div className="flex items-center justify-between flex-wrap gap-2">
									<div className="flex items-center">
										<img
											src="https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=881&q=80"
											alt="Author"
											className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3"
										/>
										<div>
											<p className="text-xs sm:text-sm font-medium">
												Alex Chen
											</p>
											<p className="text-xs opacity-70">
												Software Developer & UX Designer
											</p>
										</div>
									</div>
									<a
										href={selectedBlog.link}
										onClick={(e) => handleEmptyLink(e, "More articles clicked")}
										className={`text-xs ${theme.accent} text-white px-2 sm:px-3 py-1 rounded-full hover:brightness-110 transition-all duration-300 cursor-pointer`}
									>
										More Articles
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div
				className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg ${
					theme.toastBg
				} ${
					theme.toastText
				} transform transition-all duration-300 cursor-pointer z-50 text-sm ${
					showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
				}`}
				onClick={() => setShowToast(false)}
			>
				<div className="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						className="w-4 h-4 mr-2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{toastMessage}</span>
				</div>
			</div>

			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");
				* {
					font-family: "Montserrat", sans-serif;
				}

				@keyframes float {
					0% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-10px);
					}
					100% {
						transform: translateY(0px);
					}
				}

				@keyframes blob {
					0% {
						transform: translate(-50%, -50%) scale(1);
					}
					33% {
						transform: translate(-30%, -70%) scale(1.1);
					}
					66% {
						transform: translate(-70%, -30%) scale(0.9);
					}
					100% {
						transform: translate(-50%, -50%) scale(1);
					}
				}

				.animate-float {
					animation: float 6s ease-in-out infinite;
				}

				.animate-blob {
					animation: blob 12s ease-in-out infinite;
				}

				.animation-delay-2000 {
					animation-delay: 2s;
				}

				.animation-delay-4000 {
					animation-delay: 4s;
				}

				@media (min-width: 320px) {
					.xs\\:flex-row {
						flex-direction: row;
					}
				}

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				/* Additional style for links with hover effects */
				.hover-effect {
					position: relative;
				}

				.hover-effect::after {
					content: "";
					position: absolute;
					width: 0;
					height: 2px;
					bottom: -2px;
					left: 0;
					transition: width 0.3s ease;
				}

				.hover-effect:hover::after {
					width: 100%;
				}
			`}</style>
		</div>
	);
};

export default PortfolioLayout;
