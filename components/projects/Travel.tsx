"use client";
import React, { useState, useRef } from "react";
import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
} from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

interface BlogPost {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	image: string;
	category: string;
}

interface Service {
	id: number;
	title: string;
	description: string;
	icon: React.ReactNode;
}

interface CaseStudy {
	id: number;
	title: string;
	category: string;
	image: string;
}

interface Testimonial {
	id: number;
	name: string;
	role: string;
	avatar: string;
	content: string;
}

interface MapLocation {
	name: string;
	address: string;
	coordinates: {
		lat: number;
		lng: number;
	};
}

const HomePage: React.FC = () => {
	const [contactForm, setContactForm] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [emailSubscription, setEmailSubscription] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeLocation, setActiveLocation] = useState<number>(0);
	const [mapZoom, setMapZoom] = useState<number>(15);
	const [isHeaderActive, setIsHeaderActive] = useState(false);

	const heroRef = useRef<HTMLDivElement>(null);
	const servicesRef = useRef<HTMLDivElement>(null);
	const workRef = useRef<HTMLDivElement>(null);
	const blogRef = useRef<HTMLDivElement>(null);
	const contactRef = useRef<HTMLDivElement>(null);

	const { scrollY } = useScroll();
	const heroY = useTransform(scrollY, [0, 500], [0, -150]);
	const parallaxY = useTransform(scrollY, [0, 1000], [0, -250]);

	React.useEffect(() => {
		const handleScroll = (entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			setIsHeaderActive(!entry.isIntersecting);
		};

		const observer = new IntersectionObserver(handleScroll, {
			root: null,
			threshold: 0.1,
			rootMargin: "-100px",
		});

		if (heroRef.current) {
			observer.observe(heroRef.current);
		}

		return () => {
			if (heroRef.current) {
				observer.unobserve(heroRef.current);
			}
		};
	}, []);

	const colors = {
		primary: "#FF8E3C",
		secondary: "#F9C784",
		accent: "#FFA41B",
		light: "#FFF8E1",
		dark: "#2D2A32",
		neumorphicShadow:
			"10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.1)",
	};

	const locations: MapLocation[] = [
		{
			name: "San Francisco HQ",
			address: "123 Creative Avenue, Suite 500, San Francisco, CA 94103",
			coordinates: {
				lat: 37.7749,
				lng: -122.4194,
			},
		},
		{
			name: "New York Studio",
			address: "456 Design Street, Floor 12, New York, NY 10001",
			coordinates: {
				lat: 40.7128,
				lng: -74.006,
			},
		},
		{
			name: "London Office",
			address: "78 Arts Lane, Westminster, London SW1A 1AA, UK",
			coordinates: {
				lat: 51.5074,
				lng: -0.1278,
			},
		},
	];

	const getMapUrl = () => {
		const location = locations[activeLocation];
		return `https://www.google.com/maps/embed/v1/place?key=YOUR_TRAVEL_API_KEY_HERE&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=${mapZoom}`;
	};

	const services: Service[] = [
		{
			id: 1,
			title: "Brand Strategy",
			description:
				"We craft unique brand identities that resonate with your audience and differentiate your business in the market.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-10 w-10"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
					/>
				</svg>
			),
		},
		{
			id: 2,
			title: "Digital Marketing",
			description:
				"Data-driven marketing strategies to help you reach and engage with your ideal customers across all digital channels.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-10 w-10"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
					/>
				</svg>
			),
		},
		{
			id: 3,
			title: "Web Development",
			description:
				"Custom, high-performance websites and applications designed to deliver exceptional user experiences.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-10 w-10"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
					/>
				</svg>
			),
		},
		{
			id: 4,
			title: "Content Creation",
			description:
				"Creative content that tells your story, engages your audience, and drives meaningful results.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-10 w-10"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
					/>
				</svg>
			),
		},
	];

	const caseStudies: CaseStudy[] = [
		{
			id: 1,
			title: "Artisan Coffee Rebrand",
			category: "Brand Strategy, Packaging Design",
			image:
				"https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
		},
		{
			id: 2,
			title: "EcoFriendly App",
			category: "UI/UX Design, Development",
			image:
				"https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
		},
		{
			id: 3,
			title: "Luxury Timepiece Campaign",
			category: "Digital Marketing, Content Creation",
			image:
				"https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
		},
	];

	const testimonials: Testimonial[] = [
		{
			id: 1,
			name: "Sarah Johnson",
			role: "Marketing Director, TechCorp",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
			content:
				"Working with CreativeFlow transformed our brand's digital presence. Their strategic approach and creative execution exceeded our expectations, resulting in a 40% increase in engagement.",
		},
		{
			id: 2,
			name: "David Chen",
			role: "CEO, Startly",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
			content:
				"The team at CreativeFlow is exceptional. They understood our startup's needs and delivered a website that not only looks beautiful but also converts visitors into customers.",
		},
		{
			id: 3,
			name: "Amanda Rodriguez",
			role: "Creative Director, Fashionista",
			avatar:
				"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
			content:
				"As a fashion brand, visuals are everything to us. CreativeFlow delivered a stunning digital campaign that perfectly captured our brand essence and resonated with our audience.",
		},
	];

	const blogPosts: BlogPost[] = [
		{
			id: 1,
			title: "The Future of Digital Design",
			excerpt:
				"Exploring the latest trends in digital design and what it means for brands in today's rapidly evolving landscape.",
			date: "May 5, 2025",
			image:
				"https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			category: "Design",
		},
		{
			id: 2,
			title: "Creating Effective Marketing Campaigns",
			excerpt:
				"Learn the key strategic elements that make marketing campaigns deeply resonate with target audiences.",
			date: "April 28, 2025",
			image:
				"https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			category: "Marketing",
		},
		{
			id: 3,
			title: "User Experience: The Key to Retention",
			excerpt:
				"How thoughtful UX design can dramatically improve customer retention and satisfaction metrics for your digital products.",
			date: "April 15, 2025",
			image:
				"https://images.unsplash.com/photo-1596638787647-904d822d751e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			category: "UX",
		},
	];

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		toast.success("Thanks for contacting us! We'll get back to you soon.");
		setContactForm({ name: "", email: "", message: "" });
	};

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		toast.success("You've successfully subscribed to our newsletter!");
		setEmailSubscription("");
	};

	const handleNavClick = (ref: React.RefObject<HTMLDivElement>) => {
		setIsMenuOpen(false);
		ref.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleGenericButtonClick = () => {
		toast("This feature is coming soon!", {
			icon: "🚀",
			style: {
				borderRadius: "10px",
				background: colors.light,
				color: colors.primary,
			},
		});
	};

	const handleLocationChange = (index: number) => {
		setActiveLocation(index);
	};

	const handleZoomIn = () => {
		setMapZoom((prev) => Math.min(prev + 1, 20));
	};

	const handleZoomOut = () => {
		setMapZoom((prev) => Math.max(prev - 1, 10));
	};

	return (
		<div className="font-sans overflow-x-hidden">
			<Toaster position="bottom-right" />

			<motion.header
				className={`fixed w-full z-50 transition-all duration-500 py-4 ${
					isHeaderActive
						? "bg-white/90 backdrop-blur-md shadow-lg"
						: "bg-transparent"
				}`}
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="container mx-auto px-6 flex justify-between items-center">
					<motion.div
						className="text-3xl font-bold"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.8 }}
					>
						<span
							className={`transition-colors duration-500 ${
								isHeaderActive ? "text-orange-600" : "text-white"
							}`}
						>
							Creative<span className="text-[#FFA41B]">Flow</span>
						</span>
					</motion.div>

					<nav className="hidden md:flex space-x-10">
						{[
							{ name: "Home", ref: heroRef },
							{ name: "Services", ref: servicesRef },
							{ name: "Work", ref: workRef },
							{ name: "Blog", ref: blogRef },
							{ name: "Contact", ref: contactRef },
						].map((item, index) => (
							<motion.button
								key={item.name}
								onClick={() => handleNavClick(item.ref)}
								className={`text-lg font-semibold transition-colors duration-500 ${
									isHeaderActive
										? "text-orange-600 hover:text-[#FF8200]"
										: "text-white hover:text-[#FFA41B]"
								}`}
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.1 * index, duration: 0.5 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{item.name}
							</motion.button>
						))}
					</nav>

					<motion.div
						className="md:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.5 }}
					>
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className={`focus:outline-none z-50 relative ${
								isHeaderActive ? "text-gray-800" : "text-white"
							}`}
							aria-label="Toggle menu"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-7 w-7"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d={
										isMenuOpen
											? "M6 18L18 6M6 6l12 12"
											: "M4 6h16M4 12h16M4 18h16"
									}
								/>
							</svg>
						</button>
					</motion.div>
				</div>

				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							className="md:hidden fixed inset-0 bg-gradient-to-r from-[#FF8200]/95 to-[#F5DF4D]/95 backdrop-blur-lg pt-24 px-6 z-40"
							initial={{ opacity: 0, y: -20, height: 0 }}
							animate={{ opacity: 1, y: 0, height: "100vh" }}
							exit={{ opacity: 0, y: -20, height: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<div className="flex flex-col items-center justify-center h-full space-y-8">
								{[
									{ name: "Home", ref: heroRef },
									{ name: "Services", ref: servicesRef },
									{ name: "Work", ref: workRef },
									{ name: "Blog", ref: blogRef },
									{ name: "Contact", ref: contactRef },
								].map((item, index) => (
									<motion.button
										key={item.name}
										onClick={() => handleNavClick(item.ref)}
										className="text-2xl font-bold text-white hover:text-[#FFF8E1] transition-colors w-full text-center"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 * index, duration: 0.3 }}
										whileHover={{ scale: 1.05, x: 10 }}
										exit={{ opacity: 0, y: 20 }}
									>
										{item.name}
									</motion.button>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.header>

			<section ref={heroRef} className="relative h-screen overflow-hidden">
				<div className="absolute inset-0 z-0 overflow-hidden">
					<motion.div
						className="w-full h-full bg-cover bg-center"
						style={{
							backgroundImage:
								'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80")',
							filter: "brightness(0.7)",
							y: heroY,
						}}
					/>

					<motion.div
						className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-[#FF8200]/20  blur-2xl"
						animate={{
							scale: [1, 1.2, 1],
							x: [0, 30, 0],
							y: [0, -30, 0],
						}}
						transition={{
							duration: 8,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>

					<motion.div
						className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-[#F5DF4D]/20 blur-2xl"
						animate={{
							scale: [1, 1.3, 1],
							x: [0, -40, 0],
							y: [0, 40, 0],
						}}
						transition={{
							duration: 10,
							repeat: Infinity,
							repeatType: "reverse",
							delay: 1,
						}}
					/>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.8 }}
					transition={{ duration: 1.5 }}
					className="absolute inset-0 bg-gradient-to-r from-[#FF8200]/10 to-[#F5DF4D]/40  z-10"
				/>

				<div className="relative z-20 h-full container mx-auto px-6 flex flex-col justify-center">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="max-w-2xl"
					>
						<h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
							Bringing Your{" "}
							<motion.span
								className="text-[#F5DF4D] relative inline-block"
								animate={{
									textShadow: [
										"0 0 5px rgba(245, 223, 77, 0)",
										"0 0 20px rgba(245, 223, 77, 0.5)",
										"0 0 5px rgba(245, 223, 77, 0)",
									],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									repeatType: "reverse",
								}}
							>
								Creative Vision
							</motion.span>{" "}
							to Life
						</h1>

						<motion.p
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-lg"
						>
							We craft digital experiences that captivate, inspire, and deliver
							results for ambitious brands and businesses.
						</motion.p>

						<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
							<motion.button
								onClick={() => handleNavClick(servicesRef)}
								className="px-8 py-4 bg-[#FF8200] text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl relative overflow-hidden group"
								initial={{ opacity: 0, y: 30, scale: 0.9 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.6 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.98 }}
							>
								<span className="relative z-10">Our Services</span>
								<motion.span
									className="absolute inset-0 bg-[#FFA41B] rounded-full"
									initial={{ scale: 0, x: "-50%", y: "-50%" }}
									whileHover={{ scale: 1.5 }}
									transition={{ duration: 0.4 }}
									style={{
										originX: 0.5,
										originY: 0.5,
										left: "50%",
										top: "50%",
									}}
								/>
							</motion.button>

							<motion.button
								onClick={() => handleNavClick(contactRef)}
								className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-medium text-lg relative overflow-hidden group"
								initial={{ opacity: 0, y: 30, scale: 0.9 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.7 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.98 }}
							>
								<span className="relative z-10">Get in Touch</span>
								<motion.span
									className="absolute inset-0 bg-white/20"
									initial={{ scale: 0, x: "-50%", y: "-50%" }}
									whileHover={{ scale: 1.5 }}
									transition={{ duration: 0.4 }}
									style={{
										originX: 0.5,
										originY: 0.5,
										left: "50%",
										top: "50%",
									}}
								/>
							</motion.button>
						</div>
					</motion.div>
				</div>

				<div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: 1.2,
							y: {
								duration: 0.8,
								repeat: Infinity,
								repeatType: "reverse",
							},
						}}
						animate={{ y: [0, 10, 0] }}
					>
						<button
							onClick={() => handleNavClick(servicesRef)}
							className="text-white cursor-pointer bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all"
							aria-label="Scroll down"
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
									d="M19 14l-7 7m0 0l-7-7m7 7V3"
								/>
							</svg>
						</button>
					</motion.div>
				</div>
			</section>

			<section ref={servicesRef} className="py-24 bg-white">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="inline-block px-6 py-2 rounded-full bg-[#FFF8E1] mb-4"
						>
							<span className="text-[#FF8E3C] font-medium">What We Offer</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
						>
							Our <span className="text-[#FF8E3C]">Services</span>
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="text-gray-600 max-w-2xl mx-auto text-lg"
						>
							We offer a comprehensive range of creative services to help your
							business stand out and succeed in today's competitive digital
							landscape.
						</motion.p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{services.map((service, index) => (
							<motion.div
								key={service.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{
									y: -8,
									transition: { type: "spring", stiffness: 400, damping: 10 },
								}}
								className="bg-white rounded-2xl p-8 transition-all duration-300"
								style={{
									boxShadow:
										"8px 8px 16px rgba(0, 0, 0, 0.05), -8px -8px 16px rgba(255, 255, 255, 0.8)",
									border: "1px solid rgba(255, 255, 255, 0.7)",
								}}
							>
								<div className="text-[#FF8E3C] mb-5">{service.icon}</div>
								<h3 className="text-xl font-semibold text-gray-800 mb-3">
									{service.title}
								</h3>
								<p className="text-gray-600">{service.description}</p>
								<motion.button
									onClick={handleGenericButtonClick}
									className="mt-6 text-[#FF8E3C] font-medium flex items-center cursor-pointer group"
									whileHover={{ x: 5 }}
								>
									Learn more
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										/>
									</svg>
								</motion.button>
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						viewport={{ once: true }}
						className="mt-16 text-center"
					>
						<motion.button
							onClick={handleGenericButtonClick}
							className="px-8 py-3 bg-[#FF8E3C] text-white rounded-full font-medium shadow-lg"
							whileHover={{ scale: 1.05, boxShadow: colors.neumorphicShadow }}
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							View All Services
						</motion.button>
					</motion.div>
				</div>
			</section>

			<section ref={workRef} className="py-24 bg-[#FFF8E1]">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="inline-block px-6 py-2 rounded-full bg-white mb-4"
						>
							<span className="text-[#FF8E3C] font-medium">Our Portfolio</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
						>
							Our <span className="text-[#FF8E3C]">Featured</span> Work
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="text-gray-600 max-w-2xl mx-auto text-lg"
						>
							Take a look at some of our recent projects that showcase our
							expertise and creative approach.
						</motion.p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{caseStudies.map((study, index) => (
							<motion.div
								key={study.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -8 }}
								className="group relative overflow-hidden rounded-2xl shadow-lg"
								style={{
									boxShadow:
										"8px 8px 16px rgba(0, 0, 0, 0.05), -8px -8px 16px rgba(255, 255, 255, 0.5)",
								}}
							>
								<div className="aspect-w-16 aspect-h-9">
									<img
										src={study.image}
										alt={study.title}
										className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<h3 className="text-white text-xl font-semibold">
										{study.title}
									</h3>
									<p className="text-white/80 mt-2">{study.category}</p>
									<motion.button
										onClick={handleGenericButtonClick}
										className="mt-4 text-white font-medium flex items-center cursor-pointer group"
										whileHover={{ x: 5 }}
									>
										View Case Study
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M14 5l7 7m0 0l-7 7m7-7H3"
											/>
										</svg>
									</motion.button>
								</div>
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						viewport={{ once: true }}
						className="mt-16 text-center"
					>
						<motion.button
							onClick={handleGenericButtonClick}
							className="px-8 py-3 bg-[#FF8E3C] text-white rounded-full font-medium shadow-lg"
							whileHover={{ scale: 1.05, boxShadow: colors.neumorphicShadow }}
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							View All Projects
						</motion.button>
					</motion.div>
				</div>
			</section>

			<section className="py-24 bg-white relative overflow-hidden">
				<motion.div
					className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#FFF8E1] opacity-70"
					style={{ y: parallaxY }}
				/>
				<motion.div
					className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-[#FFF8E1] opacity-70"
					style={{ y: useTransform(scrollY, [0, 1000], [0, 150]) }}
				/>

				<div className="container mx-auto px-6 relative z-10">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="inline-block px-6 py-2 rounded-full bg-[#FFF8E1] mb-4"
						>
							<span className="text-[#FF8E3C] font-medium">Testimonials</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
						>
							What Our <span className="text-[#FF8E3C]">Clients</span> Say
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="text-gray-600 max-w-2xl mx-auto text-lg"
						>
							Don't just take our word for it. Here's what our clients have to
							say about working with us.
						</motion.p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={testimonial.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{
									y: -8,
									boxShadow:
										"12px 12px 24px rgba(0, 0, 0, 0.08), -12px -12px 24px rgba(255, 255, 255, 0.8)",
								}}
								className="p-8 rounded-2xl bg-white transition-all duration-300"
								style={{
									boxShadow:
										"8px 8px 16px rgba(0, 0, 0, 0.05), -8px -8px 16px rgba(255, 255, 255, 0.8)",
									border: "1px solid rgba(255, 255, 255, 0.7)",
								}}
							>
								<div className="flex items-center mb-4">
									<img
										src={testimonial.avatar}
										alt={testimonial.name}
										className="w-12 h-12 rounded-full object-cover border-2 border-[#FF8E3C]"
									/>
									<div className="ml-4">
										<h3 className="font-semibold text-gray-800">
											{testimonial.name}
										</h3>
										<p className="text-gray-600 text-sm">{testimonial.role}</p>
									</div>
								</div>
								<div className="flex text-[#F9C784] mb-4">
									{[...Array(5)].map((_, i) => (
										<svg
											key={i}
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
								<p className="text-gray-700 italic">"{testimonial.content}"</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section ref={blogRef} className="py-24 bg-[#FFF8E1]">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="inline-block px-6 py-2 rounded-full bg-white mb-4"
						>
							<span className="text-[#FF8E3C] font-medium">Our Blog</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
						>
							Our <span className="text-[#FF8E3C]">Insights</span>
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="text-gray-600 max-w-2xl mx-auto text-lg"
						>
							Discover our latest thoughts and insights on design, marketing,
							and digital trends.
						</motion.p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{blogPosts.map((post, index) => (
							<motion.div
								key={post.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{
									y: -8,
									boxShadow:
										"12px 12px 24px rgba(0, 0, 0, 0.08), -12px -12px 24px rgba(255, 255, 255, 0.8)",
								}}
								className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
								style={{
									boxShadow:
										"8px 8px 16px rgba(0, 0, 0, 0.05), -8px -8px 16px rgba(255, 255, 255, 0.8)",
									border: "1px solid rgba(255, 255, 255, 0.7)",
								}}
							>
								<div className="h-48 overflow-hidden">
									<img
										src={post.image}
										alt={post.title}
										className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
									/>
								</div>
								<div className="p-6">
									<div className="flex items-center mb-4">
										<span className="text-sm text-[#FF8E3C] bg-orange-100 px-3 py-1 rounded-full">
											{post.category}
										</span>
										<span className="text-sm text-gray-500 ml-auto">
											{post.date}
										</span>
									</div>
									<h3 className="text-xl font-semibold text-gray-800 mb-3">
										{post.title}
									</h3>
									<p className="text-gray-600 mb-4">{post.excerpt}</p>
									<motion.button
										onClick={handleGenericButtonClick}
										className="text-[#FF8E3C] font-medium flex items-center cursor-pointer group"
										whileHover={{ x: 5 }}
									>
										Read More
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M14 5l7 7m0 0l-7 7m7-7H3"
											/>
										</svg>
									</motion.button>
								</div>
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						viewport={{ once: true }}
						className="mt-16 text-center"
					>
						<motion.button
							onClick={handleGenericButtonClick}
							className="px-8 py-3 bg-[#FF8E3C] text-white rounded-full font-medium shadow-lg"
							whileHover={{ scale: 1.05, boxShadow: colors.neumorphicShadow }}
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							View All Articles
						</motion.button>
					</motion.div>
				</div>
			</section>

			<section className="py-24 bg-white relative overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
					<motion.div
						animate={{
							y: [0, 20, 0],
							x: [0, 10, 0],
						}}
						transition={{
							duration: 8,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="absolute top-20 left-10 w-24 h-24 rounded-full bg-[#F9C784]/10"
					/>
					<motion.div
						animate={{
							y: [0, -20, 0],
							x: [0, -15, 0],
						}}
						transition={{
							duration: 10,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 1,
						}}
						className="absolute top-40 right-20 w-32 h-32 rounded-full bg-[#FF8E3C]/10"
					/>
					<motion.div
						animate={{
							y: [0, 15, 0],
							x: [0, -10, 0],
						}}
						transition={{
							duration: 7,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 2,
						}}
						className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full bg-[#F9C784]/10"
					/>
				</div>

				<div className="container mx-auto px-6 relative z-10">
					<div className="max-w-4xl mx-auto">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
							style={{
								boxShadow:
									"10px 10px 30px rgba(0, 0, 0, 0.05), -10px -10px 30px rgba(255, 255, 255, 0.8)",
								border: "1px solid rgba(255, 255, 255, 0.7)",
								background:
									"linear-gradient(120deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
							}}
						>
							<div className="absolute top-0 right-0 w-32 h-32 bg-[#F9C784] rounded-full -mt-16 -mr-16 opacity-20" />
							<div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FF8E3C] rounded-full -mb-20 -ml-20 opacity-10" />

							<div className="relative z-10">
								<div className="text-center mb-8">
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5 }}
										className="inline-block px-6 py-2 rounded-full bg-[#FFF8E1] mb-4"
									>
										<span className="text-[#FF8E3C] font-medium">
											Stay Updated
										</span>
									</motion.div>
									<motion.h2
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: 0.1 }}
										className="text-3xl font-bold text-gray-800 mb-4"
									>
										Stay Updated with Our Newsletter
									</motion.h2>
									<motion.p
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: 0.2 }}
										className="text-gray-600"
									>
										Subscribe to our newsletter to receive the latest insights
										on design, marketing, and digital trends.
									</motion.p>
								</div>

								<motion.form
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.3 }}
									onSubmit={handleSubscribe}
									className="flex flex-col md:flex-row gap-4"
								>
									<input
										type="email"
										placeholder="Your email address"
										value={emailSubscription}
										onChange={(e) => setEmailSubscription(e.target.value)}
										className="flex-grow px-5 py-3 rounded-full text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8E3C]/50 shadow-inner"
										required
									/>
									<motion.button
										type="submit"
										className="px-8 py-3 bg-[#FF8E3C] text-white rounded-full font-medium shadow-lg whitespace-nowrap"
										whileHover={{
											scale: 1.05,
											boxShadow: colors.neumorphicShadow,
										}}
										whileTap={{ scale: 0.98 }}
										transition={{ type: "spring", stiffness: 400, damping: 10 }}
									>
										Subscribe Now
									</motion.button>
								</motion.form>

								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.4 }}
									className="text-gray-500 text-sm text-center mt-4"
								>
									We respect your privacy. Unsubscribe at any time.
								</motion.p>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<section ref={contactRef} className="py-24 bg-[#FFF8E1]">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="inline-block px-6 py-2 rounded-full bg-white mb-4"
						>
							<span className="text-[#FF8E3C] font-medium">Contact Us</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
						>
							Get in <span className="text-[#FF8E3C]">Touch</span>
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="text-gray-600 max-w-2xl mx-auto text-lg"
						>
							Have a project in mind or just want to say hello? We'd love to
							hear from you.
						</motion.p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="rounded-2xl p-8"
							style={{
								boxShadow:
									"10px 10px 30px rgba(0, 0, 0, 0.05), -10px -10px 30px rgba(255, 255, 255, 0.5)",
								border: "1px solid rgba(255, 255, 255, 0.7)",
								background:
									"linear-gradient(120deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
							}}
						>
							<h3 className="text-2xl font-semibold text-gray-800 mb-6">
								Send Us a Message
							</h3>

							<form onSubmit={handleContactSubmit}>
								<div className="mb-6">
									<label
										htmlFor="name"
										className="block text-gray-700 font-medium mb-2"
									>
										Your Name
									</label>
									<input
										type="text"
										id="name"
										value={contactForm.name}
										onChange={(e) =>
											setContactForm({ ...contactForm, name: e.target.value })
										}
										className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF8E3C]/50 shadow-inner"
										required
									/>
								</div>

								<div className="mb-6">
									<label
										htmlFor="email"
										className="block text-gray-700 font-medium mb-2"
									>
										Your Email
									</label>
									<input
										type="email"
										id="email"
										value={contactForm.email}
										onChange={(e) =>
											setContactForm({ ...contactForm, email: e.target.value })
										}
										className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF8E3C]/50 shadow-inner"
										required
									/>
								</div>

								<div className="mb-6">
									<label
										htmlFor="message"
										className="block text-gray-700 font-medium mb-2"
									>
										Your Message
									</label>
									<textarea
										id="message"
										value={contactForm.message}
										onChange={(e) =>
											setContactForm({
												...contactForm,
												message: e.target.value,
											})
										}
										rows={5}
										className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF8E3C]/50 shadow-inner resize-none"
										required
									/>
								</div>

								<motion.button
									type="submit"
									className="w-full px-8 py-3 bg-[#FF8E3C] text-white rounded-full font-medium shadow-lg"
									whileHover={{
										scale: 1.02,
										boxShadow: colors.neumorphicShadow,
									}}
									whileTap={{ scale: 0.98 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
								>
									Send Message
								</motion.button>
							</form>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="flex flex-col"
						>
							<motion.div
								className="rounded-2xl p-8 mb-8"
								style={{
									boxShadow:
										"10px 10px 30px rgba(0, 0, 0, 0.05), -10px -10px 30px rgba(255, 255, 255, 0.5)",
									border: "1px solid rgba(255, 255, 255, 0.7)",
									background:
										"linear-gradient(120deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
								}}
							>
								<h3 className="text-2xl font-semibold text-gray-800 mb-6">
									Contact Information
								</h3>

								<div className="space-y-6">
									<div className="flex items-start">
										<div className="text-[#FF8E3C] mr-4">
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
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="font-medium text-gray-800">
												Our Location
											</h4>
											<p className="text-gray-600 mt-1">
												{locations[activeLocation].address}
											</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="text-[#FF8E3C] mr-4">
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
													d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="font-medium text-gray-800">Email Us</h4>
											<p className="text-gray-600 mt-1">
												hello@creativeflow.co
											</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="text-[#FF8E3C] mr-4">
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
													d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="font-medium text-gray-800">Call Us</h4>
											<p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="text-[#FF8E3C] mr-4">
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
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="font-medium text-gray-800">
												Working Hours
											</h4>
											<p className="text-gray-600 mt-1">
												Monday - Friday: 9AM - 6PM
												<br />
												Saturday: 10AM - 4PM
											</p>
										</div>
									</div>
								</div>
							</motion.div>

							<div
								className="rounded-2xl overflow-hidden shadow-lg relative"
								style={{
									boxShadow:
										"10px 10px 30px rgba(0, 0, 0, 0.05), -10px -10px 30px rgba(255, 255, 255, 0.5)",
									border: "1px solid rgba(255, 255, 255, 0.7)",
									height: "400px",
								}}
							>
								<div className="bg-white absolute top-0 left-0 z-10 w-full p-4 flex justify-between items-center">
									<h3 className="text-lg font-semibold text-gray-800">
										Find Us
									</h3>
									<div className="flex space-x-1">
										{locations.map((location, index) => (
											<button
												key={index}
												onClick={() => handleLocationChange(index)}
												className={`px-3 py-1 text-sm rounded-full transition-all ${
													activeLocation === index
														? "bg-[#FF8E3C] text-white font-medium"
														: "bg-white text-gray-600 hover:bg-gray-100"
												}`}
											>
												{location.name}
											</button>
										))}
									</div>
								</div>

								<div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
									<button
										onClick={handleZoomIn}
										className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-700"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
									<button
										onClick={handleZoomOut}
										className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-700"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
								</div>

								<iframe
									src={getMapUrl()}
									className="w-full h-full border-0 mt-12"
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									title="Location Map"
								></iframe>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<footer className="bg-gray-900 text-white pt-16 pb-8">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
						<div>
							<div className="text-2xl font-bold mb-6">
								<span className="text-[#FF8E3C]">Creative</span>
								<span className="text-[#F9C784]">Flow</span>
							</div>
							<p className="text-gray-400 mb-6">
								We craft digital experiences that captivate, inspire, and
								deliver results for ambitious brands and businesses.
							</p>
							<div className="flex space-x-4">
								<motion.a
									href="#"
									onClick={handleGenericButtonClick}
									className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
									whileHover={{ scale: 1.2, color: "#F9C784" }}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
									</svg>
								</motion.a>
								<motion.a
									href="#"
									onClick={handleGenericButtonClick}
									className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
									whileHover={{ scale: 1.2, color: "#F9C784" }}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
									</svg>
								</motion.a>
								<motion.a
									href="#"
									onClick={handleGenericButtonClick}
									className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
									whileHover={{ scale: 1.2, color: "#F9C784" }}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
								</motion.a>
								<motion.a
									href="#"
									onClick={handleGenericButtonClick}
									className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
									whileHover={{ scale: 1.2, color: "#F9C784" }}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
									</svg>
								</motion.a>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-6">Quick Links</h3>
							<ul className="space-y-3">
								<li>
									<motion.button
										onClick={() => handleNavClick(heroRef)}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Home
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={() => handleNavClick(servicesRef)}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Services
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={() => handleNavClick(workRef)}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Work
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={() => handleNavClick(blogRef)}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Blog
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={() => handleNavClick(contactRef)}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Contact
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={handleGenericButtonClick}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										About Us
									</motion.button>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-6">Services</h3>
							<ul className="space-y-3">
								<li>
									<motion.button
										onClick={handleGenericButtonClick}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Brand Strategy
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={handleGenericButtonClick}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Digital Marketing
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={handleGenericButtonClick}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Web Development
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={handleGenericButtonClick}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										Content Creation
									</motion.button>
								</li>
								<li>
									<motion.button
										onClick={handleGenericButtonClick}
										className="text-gray-400 hover:text-[#FFA41B] transition-colors cursor-pointer"
										whileHover={{ x: 5, color: "#F9C784" }}
									>
										UI/UX Design
									</motion.button>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-6">Contact Us</h3>
							<ul className="space-y-3">
								<li className="flex items-start">
									<div className="text-[#FFA41B] mr-3">
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
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</div>
									<span className="text-gray-400">{locations[0].address}</span>
								</li>
								<li className="flex items-start">
									<div className="text-[#FFA41B] mr-3">
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
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<span className="text-gray-400">hello@creativeflow.co</span>
								</li>
								<li className="flex items-start">
									<div className="text-[#FFA41B] mr-3">
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
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
									</div>
									<span className="text-gray-400">+1 (555) 123-4567</span>
								</li>
							</ul>
						</div>
					</div>

					<hr className="border-gray-800 my-8" />

					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-500 text-sm">
							© {new Date().getFullYear()} CreativeFlow. All rights reserved.
						</p>
						<div className="flex space-x-6 mt-4 md:mt-0">
							<motion.button
								onClick={handleGenericButtonClick}
								className="text-gray-500 text-sm hover:text-[#FFA41B] transition-colors cursor-pointer"
								whileHover={{ y: -2, color: "#F9C784" }}
							>
								Privacy Policy
							</motion.button>
							<motion.button
								onClick={handleGenericButtonClick}
								className="text-gray-500 text-sm hover:text-[#FFA41B] transition-colors cursor-pointer"
								whileHover={{ y: -2, color: "#F9C784" }}
							>
								Terms of Service
							</motion.button>
							<motion.button
								onClick={handleGenericButtonClick}
								className="text-gray-500 text-sm hover:text-[#FFA41B] transition-colors cursor-pointer"
								whileHover={{ y: -2, color: "#F9C784" }}
							>
								Cookie Policy
							</motion.button>
						</div>
					</div>
				</div>
			</footer>

			<motion.button
				onClick={() => handleNavClick(heroRef)}
				className="fixed bottom-8 right-8 z-50 bg-[#FF8E3C] text-white rounded-full p-3 shadow-lg"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				whileHover={{ scale: 1.1, backgroundColor: "#F9C784" }}
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
						d="M5 10l7-7m0 0l7 7m-7-7v18"
					/>
				</svg>
			</motion.button>

			<style jsx global>{`
				button,
				a {
					cursor: pointer;
				}

				html {
					scroll-behavior: smooth;
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

				.animate-float {
					animation: float 3s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
};

export default HomePage;
