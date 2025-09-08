"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	FaGithub,
	FaLinkedin,
	FaTwitter,
	FaEnvelope,
	FaArrowDown,
	FaCode,
	FaPalette,
	FaServer,
	FaMobile,
	FaArrowRight,
	FaTimes,
	FaCalendarAlt,
	FaLink,
	FaExternalLinkAlt,
	FaMapMarkerAlt,
	FaBriefcase,
	FaGraduationCap,
} from "react-icons/fa";

interface Experience {
	company: string;
	position: string;
	period: string;
	description: string;
	location?: string;
}

interface Project {
	title: string;
	description: string;
	image: string;
	link: string;
	tags: string[];
	longDescription?: string;
}

interface SkillCategory {
	name: string;
	icon: React.ReactNode;
	items: string[];
}

interface FormData {
	name: string;
	email: string;
	message: string;
}

interface FormErrors {
	name: string;
	email: string;
	message: string;
}

export default function PortfolioExport(): JSX.Element {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const toggleMenu = () => setMenuOpen(!menuOpen);
	const [activeSection, setActiveSection] = useState<string>("about");
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		message: "",
	});
	const [errors, setErrors] = useState<FormErrors>({
		name: "",
		email: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const [scrollProgress, setScrollProgress] = useState<number>(0);

	const experiences: Experience[] = [
		{
			company: "Tech Innovations Inc.",
			position: "Senior Frontend Developer",
			period: "2020 - Present",
			description:
				"Lead developer for enterprise web applications. Architected and implemented modern UI solutions using React and TypeScript. Managed a team of 5 developers and improved application performance by 40%.",
			location: "San Francisco, CA",
		},
		{
			company: "Creative Digital Agency",
			position: "UI/UX Developer",
			period: "2018 - 2020",
			description:
				"Designed and developed responsive websites for various clients, focusing on user experience and interactive elements. Created design systems that improved development efficiency by 30%.",
			location: "New York, NY",
		},
		{
			company: "Startup Hub",
			position: "Junior Web Developer",
			period: "2016 - 2018",
			description:
				"Worked on frontend development for startup projects, gaining experience with modern JavaScript frameworks and responsive design. Contributed to 15+ successful product launches.",
			location: "Boston, MA",
		},
	];

	const projects: Project[] = [
		{
			title: "E-Commerce Platform",
			description:
				"A full-stack e-commerce solution with real-time inventory management, secure payment processing, and personalized user recommendations.",
			image:
				"https://images.unsplash.com/photo-1661956602944-249bcd04b63f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			link: "#",
			tags: ["React", "Node.js", "MongoDB"],
			longDescription:
				"The E-Commerce Platform is a comprehensive solution designed to provide businesses with a robust online store. Built with a modern tech stack including React for the frontend and Node.js with MongoDB for the backend, it offers real-time inventory management, secure payment processing with Stripe integration, and personalized user recommendations based on browsing history and purchase patterns.\n\nKey features include a responsive design that works seamlessly across all devices, advanced search and filtering options, user reviews and ratings, wishlist functionality, and an intuitive admin dashboard for managing products, orders, and customer data. The platform also includes detailed analytics to help business owners understand their sales trends and customer behavior.",
		},
		{
			title: "AI Image Generator",
			description:
				"Web application that generates unique artwork using deep learning algorithms, allowing users to create and customize stunning visual content.",
			image:
				"https://images.unsplash.com/photo-1682687220063-4742bd7fd538?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			link: "#",
			tags: ["Python", "TensorFlow", "React"],
			longDescription:
				"The AI Image Generator leverages cutting-edge machine learning algorithms to create unique, high-quality artwork based on user inputs. Built with Python and TensorFlow on the backend and React on the frontend, this application allows users to describe what they want to see, and the AI generates corresponding images.\n\nThe system uses a combination of Generative Adversarial Networks (GANs) and Transformer-based models to understand textual descriptions and convert them into visual content. Users can further refine the generated images through an intuitive interface, adjusting parameters like style, color palette, and composition. The application also includes features for saving favorite generations, sharing creations on social media, and exploring a gallery of community-generated artwork.",
		},
		{
			title: "Interactive Portfolio",
			description:
				"A responsive portfolio website with immersive 3D elements, animations, and a custom CMS for easy content management.",
			image:
				"https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			link: "#",
			tags: ["Next.js", "TypeScript", "Three.js"],
			longDescription:
				"The Interactive Portfolio is a cutting-edge personal website template designed for creative professionals. Built with Next.js and TypeScript, it features immersive 3D elements powered by Three.js that respond to user interactions, creating a memorable browsing experience.\n\nThe portfolio includes smooth page transitions, parallax scrolling effects, and dynamic content loading for optimal performance. The integrated custom CMS allows non-technical users to easily update projects, skills, and personal information without touching code. The design is fully responsive, ensuring a perfect display on devices of all sizes, and includes accessibility features to make the content available to everyone. Advanced analytics tracking provides insights into visitor behavior and engagement.",
		},
		{
			title: "Productivity Dashboard",
			description:
				"Personal productivity tracking application with goal setting, time management tools, and data visualization.",
			image:
				"https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			link: "#",
			tags: ["Vue.js", "Firebase", "D3.js"],
			longDescription:
				"The Productivity Dashboard is a comprehensive personal management tool designed to help users track their productivity, set and achieve goals, and visualize their progress over time. Built with Vue.js and Firebase, with data visualization powered by D3.js, this application provides a seamless experience across devices.\n\nFeatures include a customizable dashboard where users can configure widgets based on their needs, a Pomodoro timer with customizable work/break intervals, a task management system with prioritization and deadlines, habit tracking with streak counting, goal setting with milestone tracking, and detailed reports and analytics showing productivity trends. The application also offers reminder notifications, integrations with popular calendar services, and data export functionality for backup or external analysis.",
		},
	];

	const skills: SkillCategory[] = [
		{
			name: "Frontend Development",
			icon: <FaCode />,
			items: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
		},
		{
			name: "UI/UX Design",
			icon: <FaPalette />,
			items: ["Figma", "Adobe XD", "Responsive Design", "Animation"],
		},
		{
			name: "Backend Development",
			icon: <FaServer />,
			items: ["Node.js", "Python", "MongoDB", "PostgreSQL"],
		},
		{
			name: "Mobile Development",
			icon: <FaMobile />,
			items: ["React Native", "Flutter", "iOS", "Android"],
		},
	];

	const openModal = (project: Project) => {
		setSelectedProject(project);
		setModalOpen(true);
		document.body.style.overflow = "hidden";
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedProject(null);
		document.body.style.overflow = "auto";
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		let valid = true;
		let newErrors = { name: "", email: "", message: "" };

		if (!formData.name) {
			newErrors.name = "Name is required";
			valid = false;
		}

		if (!formData.email) {
			newErrors.email = "Email is required";
			valid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
			valid = false;
		}

		if (!formData.message) {
			newErrors.message = "Message is required";
			valid = false;
		}

		setErrors(newErrors);

		if (valid) {
			setIsSubmitting(true);
			setTimeout(() => {
				setIsSubmitting(false);
				setSuccess(true);
				setFormData({ name: "", email: "", message: "" });
				setTimeout(() => setSuccess(false), 3000);
			}, 1000);
		}
	};

	const sectionsRef = useRef<HTMLElement[] | null>(null);

	useEffect(() => {
		setActiveSection("about");

		const sectionElements = document.querySelectorAll("section");
		sectionsRef.current = Array.from(sectionElements) as HTMLElement[];

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const target = entry.target as HTMLElement;
						target.classList.add("opacity-100", "translate-y-0");
						setActiveSection(target.id);
					}
				});
			},
			{ threshold: 0.1 }
		);

		sectionsRef.current.forEach((section) => observer.observe(section));

		setTimeout(() => {
			const timelineItems = document.querySelectorAll(".timeline-item");
			timelineItems.forEach((item, index) => {
				setTimeout(() => {
					item.classList.add("opacity-100", "translate-y-0");
				}, index * 300);
			});
		}, 500);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const totalHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const progress = (window.scrollY / totalHeight) * 100;
			setScrollProgress(progress);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && modalOpen) {
				closeModal();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [modalOpen]);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 text-gray-100 bg-gray-900 font-sans">
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Inria+Sans:wght@300;400;700&display=swap");

				html {
					scroll-behavior: smooth;
				}
				body {
					font-family: "Roboto", sans-serif;
					margin: 0;
					background-color: #0a0a0a;
					color: #f4f4f4;
					background-image: url("https://www.transparenttextures.com/patterns/cartographer.png");
				}

				@keyframes float {
					0% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-20px);
					}
					100% {
						transform: translateY(0px);
					}
				}

				@keyframes pulse {
					0% {
						transform: scale(1);
						opacity: 0.5;
					}
					50% {
						transform: scale(1.02);
						opacity: 0.8;
					}
					100% {
						transform: scale(1);
						opacity: 0.5;
					}
				}

				.animate-float {
					animation: float 6s ease-in-out infinite;
				}

				.animate-pulse-slow {
					animation: pulse 2s ease-in-out infinite;
				}

				.timeline-line {
					background: linear-gradient(to bottom, #f97316, #ff6b6b);
					box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
				}

				::-webkit-scrollbar {
					width: 8px;
				}

				::-webkit-scrollbar-track {
					background: rgba(10, 10, 10, 0.8);
				}

				::-webkit-scrollbar-thumb {
					background: linear-gradient(to bottom, #f97316, #ff6b6b);
					border-radius: 4px;
				}

				::-webkit-scrollbar-thumb:hover {
					background: linear-gradient(to bottom, #ff6b6b, #f97316);
				}
			`}</style>

			<header
				className="relative py-24 md:py-32 text-center overflow-hidden min-h-screen flex flex-col justify-center items-center"
				style={{
					background:
						'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%), url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>
				<h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-['Inria_Sans'] m-0 animate-fadeIn bg-gradient-to-r from-orange-500 to-rose-400 text-transparent bg-clip-text">
					John Doe
				</h1>
				<p
					className="text-xl sm:text-2xl mt-6 opacity-0 animate-fadeIn max-w-md mx-auto px-4"
					style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
				>
					Creative Developer & Digital Artist
				</p>
				<div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-8 px-2">
					<a
						href="#"
						className="text-white bg-orange-500/20 hover:bg-orange-500 p-2 sm:p-3 rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer"
						aria-label="GitHub"
					>
						<FaGithub className="text-xl sm:text-2xl" />
					</a>
					<a
						href="#"
						className="text-white bg-orange-500/20 hover:bg-orange-500 p-2 sm:p-3 rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer"
						aria-label="LinkedIn"
					>
						<FaLinkedin className="text-xl sm:text-2xl" />
					</a>
					<a
						href="#"
						className="text-white bg-orange-500/20 hover:bg-orange-500 p-2 sm:p-3 rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer"
						aria-label="Twitter"
					>
						<FaTwitter className="text-xl sm:text-2xl" />
					</a>
					<a
						href="#"
						className="text-white bg-orange-500/20 hover:bg-orange-500 p-2 sm:p-3 rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer"
						aria-label="Email"
					>
						<FaEnvelope className="text-xl sm:text-2xl" />
					</a>
				</div>
				<FaArrowDown
					className="absolute bottom-8 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl animate-float cursor-pointer"
					onClick={() =>
						document
							.getElementById("about")
							?.scrollIntoView({ behavior: "smooth" })
					}
				/>
			</header>

			<nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-50 shadow-md shadow-black/30 py-3 sm:py-4 px-4 sm:px-6">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					<a
						href="#"
						className="text-2xl sm:text-3xl font-['Inria_Sans'] font-bold bg-gradient-to-r from-orange-500 to-rose-400 text-transparent bg-clip-text"
						onClick={() =>
							document
								.getElementById("header")
								?.scrollIntoView({ behavior: "smooth" })
						}
					>
						JD
					</a>

					<button
						className="md:hidden text-2xl bg-transparent border-none text-white p-2 cursor-pointer z-50 focus:outline-none"
						onClick={toggleMenu}
						aria-label="Toggle menu"
					>
						{menuOpen ? <FaTimes /> : "☰"}
					</button>

					<div
						className={`
                        ${menuOpen ? "flex" : "hidden"} 
                        md:flex absolute md:static top-0 right-0 h-screen md:h-auto pt-20 md:pt-0 
                        w-64 md:w-auto flex-col md:flex-row items-center justify-center md:justify-center 
                        bg-gray-900/98 md:bg-transparent md:p-0 gap-6 md:gap-4 lg:gap-8 shadow-md 
                        shadow-black/30 md:shadow-none transition-all duration-300 z-40`}
					>
						<ul className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-2 lg:space-x-6">
							<li>
								<a
									href="#about"
									className={`py-2 px-3 md:px-4 rounded-full transition-all duration-300 font-['Inria_Sans'] text-base md:text-base relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300 cursor-pointer ${
										activeSection === "about"
											? "bg-orange-500/20 text-orange-500"
											: "text-white"
									}`}
									onClick={() => setMenuOpen(false)}
								>
									About
								</a>
							</li>
							<li>
								<a
									href="#experience"
									className={`py-2 px-3 md:px-4 rounded-full transition-all duration-300 font-['Inria_Sans'] text-base md:text-base relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300 cursor-pointer ${
										activeSection === "experience"
											? "bg-orange-500/20 text-orange-500"
											: "text-white"
									}`}
									onClick={() => setMenuOpen(false)}
								>
									Experience
								</a>
							</li>
							<li>
								<a
									href="#projects"
									className={`py-2 px-3 md:px-4 rounded-full transition-all duration-300 font-['Inria_Sans'] text-base md:text-base relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300 cursor-pointer ${
										activeSection === "projects"
											? "bg-orange-500/20 text-orange-500"
											: "text-white"
									}`}
									onClick={() => setMenuOpen(false)}
								>
									Projects
								</a>
							</li>
							<li>
								<a
									href="#skills"
									className={`py-2 px-3 md:px-4 rounded-full transition-all duration-300 font-['Inria_Sans'] text-base md:text-base relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300 cursor-pointer ${
										activeSection === "skills"
											? "bg-orange-500/20 text-orange-500"
											: "text-white"
									}`}
									onClick={() => setMenuOpen(false)}
								>
									Skills
								</a>
							</li>
							<li>
								<a
									href="#contact"
									className={`py-2 px-3 md:px-4 rounded-full transition-all duration-300 font-['Inria_Sans'] text-base md:text-base relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300 cursor-pointer ${
										activeSection === "contact"
											? "bg-orange-500/20 text-orange-500"
											: "text-white"
									}`}
									onClick={() => setMenuOpen(false)}
								>
									Contact
								</a>
							</li>
						</ul>
						<a
							href="#contact"
							className="hidden md:flex items-center bg-gradient-to-r from-orange-700 to-orange-600 text-white py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer"
						>
							Hire Me
						</a>
					</div>
				</div>
			</nav>

			<div className="fixed top-0 left-0 w-full h-1 bg-orange-500/10 z-50">
				<div
					className="h-full bg-gradient-to-r from-orange-500 to-rose-400 transition-all duration-100 ease-out shadow-lg shadow-orange-500/30"
					style={{ width: `${scrollProgress}%` }}
				></div>
			</div>

			<section
				id="about"
				className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-20 py-20 md:py-32 px-4 md:px-10 min-h-screen opacity-0 -translate-y-4 transition-all duration-1000 ease-out"
				style={{
					background:
						'linear-gradient(135deg, rgba(26, 26, 26, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%), url("https://www.transparenttextures.com/patterns/diagmonds-light.png")',
				}}
			>
				<div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 flex-shrink-0">
					<div className="absolute inset-0 -m-5 border-2 border-orange-500/20 rounded-full animate-pulse-slow"></div>
					<div
						className="absolute inset-0 -m-2.5 border-2 border-orange-500/10 rounded-full animate-pulse-slow"
						style={{ animationDelay: "0.5s" }}
					></div>

					<img
						src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
						alt="John Doe"
						className="w-full h-full rounded-full border-4 border-orange-500 shadow-lg shadow-orange-500/30 object-cover animate-float transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50"
					/>
				</div>

				<div className="max-w-xl relative">
					<div className="absolute inset-0 -m-5 border-2 border-orange-500/20 rounded-2xl animate-pulse-slow"></div>

					<h2
						className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 font-['Inria_Sans'] animate-fadeInUp"
						style={{ animationFillMode: "forwards" }}
					>
						About Me
					</h2>

					<p
						className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 text-gray-300 animate-fadeInUp"
						style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
					>
						I'm a passionate developer and digital artist with over 7 years of
						experience creating immersive web experiences. I specialize in
						building applications that blend technical excellence with stunning
						visual design.
					</p>

					<p
						className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 text-gray-300 animate-fadeInUp"
						style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
					>
						My work focuses on the intersection of technology and art, creating
						digital experiences that surprise and delight users while solving
						real business problems. I'm constantly exploring new technologies
						and techniques to push the boundaries of what's possible on the web.
					</p>

					<div className="mb-8 grid grid-cols-2 gap-4">
						<div className="bg-gray-800/50 p-4 rounded-lg flex flex-col items-center">
							<FaBriefcase className="text-orange-500 text-xl mb-2" />
							<span className="text-sm text-gray-300">7+ Years Experience</span>
						</div>
						<div className="bg-gray-800/50 p-4 rounded-lg flex flex-col items-center">
							<FaGraduationCap className="text-orange-500 text-xl mb-2" />
							<span className="text-sm text-gray-300">
								M.S. Computer Science
							</span>
						</div>
					</div>

					<button
						onClick={() =>
							document
								.getElementById("contact")
								?.scrollIntoView({ behavior: "smooth" })
						}
						className="bg-gradient-to-r from-orange-500 to-rose-400 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg font-medium flex items-center gap-3 overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer opacity-0 animate-fadeInUp w-full sm:w-auto justify-center sm:justify-start"
						style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
					>
						Get in Touch{" "}
						<FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
						<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500 ease-out"></span>
					</button>
				</div>
			</section>

			<section
				id="experience"
				className="py-20 md:py-24 px-4 opacity-0 -translate-y-4 transition-all duration-1000 ease-out"
				style={{
					background:
						'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(26, 26, 26, 0.8) 100%), url("https://www.transparenttextures.com/patterns/cubes.png")',
				}}
			>
				<div className="max-w-5xl mx-auto">
					<div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
						<h2 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-400 font-['Inria_Sans']">
							Professional Journey
						</h2>
						<p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
							Here's where my career has taken me so far, with each role
							building on the last to create a unique blend of skills and
							expertise.
						</p>
					</div>

					<div className="relative py-8 sm:py-10">
						<div className="absolute left-1/2 top-0 bottom-0 w-1 timeline-line -translate-x-1/2 md:flex hidden"></div>
						<div className="absolute left-6 top-0 bottom-0 w-1 timeline-line md:hidden"></div>

						{experiences.map((exp, index) => (
							<div
								key={index}
								className={`timeline-item opacity-0 translate-y-8 transition-all duration-1000 ease-out relative mb-8 sm:mb-12 ${
									index % 2 === 0
										? "md:pr-16 md:mr-auto md:ml-0 md:pl-0"
										: "md:pl-16 md:ml-auto md:mr-0 md:pr-0"
								} md:w-5/12 pl-16`}
								style={{ transitionDelay: `${index * 200}ms` }}
							>
								<div
									className={`absolute w-5 h-5 rounded-full bg-orange-500 z-10 top-5 ${
										index % 2 === 0
											? "md:right-0 md:translate-x-1/2 md:left-auto"
											: "md:left-0 md:-translate-x-1/2 md:right-auto"
									} left-4`}
								>
									<div className="absolute inset-0 rounded-full bg-orange-500/50 animate-ping"></div>
								</div>

								<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-5 sm:p-6 rounded-xl border border-orange-500/10 shadow-xl shadow-black/20 transition-all duration-500 hover:shadow-2xl hover:border-orange-500/30 hover:-translate-y-1 hover:-rotate-1 relative overflow-hidden group">
									<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

									<div className="space-y-3 text-left">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
											<h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 font-['Inria_Sans'] order-1">
												{exp.company}
											</h3>

											<span className="text-orange-500 flex items-center gap-1 text-xs sm:text-sm order-2">
												<FaCalendarAlt className="text-orange-500/70" />
												{exp.period}
											</span>
										</div>

										<h4 className="text-lg sm:text-xl text-orange-500 font-medium">
											{exp.position}
										</h4>

										{exp.location && (
											<div className="text-gray-400 flex items-center gap-2 text-xs sm:text-sm">
												<FaMapMarkerAlt className="text-orange-500/70" />
												{exp.location}
											</div>
										)}

										<p className="text-gray-300 text-sm sm:text-base leading-relaxed pt-1">
											{exp.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section
				id="projects"
				className="py-20 md:py-24 px-4 opacity-0 -translate-y-4 transition-all duration-1000 ease-out"
				style={{
					background:
						'linear-gradient(135deg, rgba(26, 26, 26, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%), url("https://www.transparenttextures.com/patterns/asfalt-light.png")',
				}}
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
						<h2 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-400 font-['Inria_Sans']">
							Featured Projects
						</h2>
						<p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
							Explore my latest work and discover how I combine creativity with
							technical expertise to deliver exceptional results.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
						{projects.map((project, index) => (
							<div
								key={index}
								className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl cursor-pointer overflow-hidden border border-orange-500/10 shadow-xl shadow-black/20 transition-all duration-500 hover:shadow-2xl hover:border-orange-500/20 hover:-translate-y-2 group relative"
								style={{ animationDelay: `${index * 200}ms` }}
								onClick={() => openModal(project)}
							>
								<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

								<div className="h-48 sm:h-56 w-full overflow-hidden">
									<img
										src={project.image}
										alt={project.title}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
								</div>

								<div className="p-4 sm:p-6">
									<h3 className="text-xl sm:text-2xl font-bold text-white font-['Inria_Sans'] mb-2 sm:mb-4">
										{project.title}
									</h3>

									<p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-5 leading-relaxed">
										{project.description}
									</p>

									<div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
										{project.tags.map((tag, tagIndex) => (
											<span
												key={tagIndex}
												className="bg-orange-500/10 text-orange-500 py-1 sm:py-1.5 px-2 sm:px-3 rounded-full text-xs sm:text-sm border border-orange-500/20 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-orange-500/30"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section
				id="skills"
				className="py-20 md:py-24 px-4 opacity-0 -translate-y-4 transition-all duration-1000 ease-out"
				style={{
					background:
						'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(26, 26, 26, 0.8) 100%), url("https://www.transparenttextures.com/patterns/brushed-alum.png")',
				}}
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
						<h2 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-400 font-['Inria_Sans']">
							Skills & Expertise
						</h2>
						<p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
							I've worked with a wide range of technologies and tools to create
							modern, efficient, and scalable solutions.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						{skills.map((category, index) => (
							<div
								key={index}
								className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-5 sm:p-8 rounded-xl border border-orange-500/10 shadow-xl shadow-black/20 transition-all duration-500 hover:shadow-2xl hover:border-orange-500/20 hover:-translate-y-1 group relative overflow-hidden"
								style={{ animationDelay: `${index * 200}ms` }}
							>
								<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

								<h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 font-['Inria_Sans']">
									<span className="text-orange-500 bg-orange-500/10 p-2 sm:p-3 rounded-lg text-xl sm:text-2xl">
										{category.icon}
									</span>
									{category.name}
								</h3>

								<div className="flex flex-wrap gap-2 sm:gap-3">
									{category.items.map((skill, skillIndex) => (
										<span
											key={skillIndex}
											className="bg-orange-500/10 text-orange-500 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-sm sm:text-base border border-orange-500/20 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-orange-500/30 relative overflow-hidden group"
										>
											<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
											{skill}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section
				id="contact"
				className="py-20 md:py-24 px-4 opacity-0 -translate-y-4 transition-all duration-1000 ease-out"
				style={{
					background:
						'linear-gradient(135deg, rgba(26, 26, 26, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%), url("https://www.transparenttextures.com/patterns/dark-geometric.png")',
				}}
			>
				<h2 className="text-4xl sm:text-5xl font-bold mb-12 sm:mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-400 font-['Inria_Sans']">
					Get in Touch
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
					<div className="flex flex-col gap-6 sm:gap-8">
						<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-6 sm:p-8 rounded-xl border border-orange-500/10 shadow-xl shadow-black/20 transition-all duration-500 hover:shadow-2xl hover:border-orange-500/20 hover:-translate-y-1">
							<h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-400 font-['Inria_Sans']">
								Let's Work Together
							</h3>

							<p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-5 sm:mb-6">
								I'm always open to discussing new projects, creative ideas or
								opportunities to be part of your visions.
							</p>

							<div className="flex flex-col gap-3 sm:gap-4">
								<div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg">
									<FaEnvelope className="text-orange-500 text-lg sm:text-xl" />
									<a
										href="mailto:john.doe@example.com"
										className="text-white hover:text-orange-500 transition-colors duration-300"
									>
										john.doe@example.com
									</a>
								</div>

								<div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg">
									<FaLinkedin className="text-orange-500 text-lg sm:text-xl" />
									<a
										href="https://linkedin.com/in/johndoe"
										target="_blank"
										rel="noopener noreferrer"
										className="text-white hover:text-orange-500 transition-colors duration-300"
									>
										linkedin.com/in/johndoe
									</a>
								</div>

								<div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg">
									<FaGithub className="text-orange-500 text-lg sm:text-xl" />
									<a
										href="https://github.com/johndoe"
										target="_blank"
										rel="noopener noreferrer"
										className="text-white hover:text-orange-500 transition-colors duration-300"
									>
										github.com/johndoe
									</a>
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-6 sm:p-8 rounded-xl border border-orange-500/10 shadow-xl shadow-black/20 hidden md:block">
							<h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-400 font-['Inria_Sans']">
								Working Hours
							</h3>
							<ul className="space-y-2">
								<li className="flex justify-between text-gray-300">
									<span>Monday - Friday</span>
									<span>9:00 AM - 6:00 PM</span>
								</li>
								<li className="flex justify-between text-gray-300">
									<span>Saturday</span>
									<span>10:00 AM - 4:00 PM</span>
								</li>
								<li className="flex justify-between text-gray-300">
									<span>Sunday</span>
									<span>Closed</span>
								</li>
							</ul>
						</div>
					</div>

					<form
						className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-6 sm:p-8 rounded-xl border border-orange-500/10 shadow-xl shadow-black/20"
						onSubmit={handleSubmit}
					>
						{success && (
							<div className="bg-green-500/10 text-green-500 p-3 sm:p-4 rounded-lg mb-5 sm:mb-6 text-center border border-green-500/20">
								Message sent successfully! I'll get back to you soon.
							</div>
						)}

						<div className="mb-4 sm:mb-6">
							<label
								htmlFor="name"
								className="block mb-2 text-base sm:text-lg font-medium text-white"
							>
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Your name"
								className={`w-full p-3 sm:p-4 bg-white/5 border ${
									errors.name ? "border-red-500" : "border-white/10"
								} rounded-lg text-white text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-orange-500 focus:shadow-md focus:shadow-orange-500/20`}
								aria-invalid={!!errors.name}
								aria-describedby={errors.name ? "name-error" : undefined}
							/>
							{errors.name && (
								<p
									id="name-error"
									className="mt-1 text-red-500 text-xs sm:text-sm"
								>
									{errors.name}
								</p>
							)}
						</div>

						<div className="mb-4 sm:mb-6">
							<label
								htmlFor="email"
								className="block mb-2 text-base sm:text-lg font-medium text-white"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="Your email"
								className={`w-full p-3 sm:p-4 bg-white/5 border ${
									errors.email ? "border-red-500" : "border-white/10"
								} rounded-lg text-white text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-orange-500 focus:shadow-md focus:shadow-orange-500/20`}
								aria-invalid={!!errors.email}
								aria-describedby={errors.email ? "email-error" : undefined}
							/>
							{errors.email && (
								<p
									id="email-error"
									className="mt-1 text-red-500 text-xs sm:text-sm"
								>
									{errors.email}
								</p>
							)}
						</div>

						<div className="mb-5 sm:mb-6">
							<label
								htmlFor="message"
								className="block mb-2 text-base sm:text-lg font-medium text-white"
							>
								Message
							</label>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleInputChange}
								placeholder="Your message"
								rows={5}
								className={`w-full p-3 sm:p-4 bg-white/5 border ${
									errors.message ? "border-red-500" : "border-white/10"
								} rounded-lg text-white text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-orange-500 focus:shadow-md focus:shadow-orange-500/20 resize-y`}
								aria-invalid={!!errors.message}
								aria-describedby={errors.message ? "message-error" : undefined}
							></textarea>
							{errors.message && (
								<p
									id="message-error"
									className="mt-1 text-red-500 text-xs sm:text-sm"
								>
									{errors.message}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-gradient-to-r from-orange-700 to-orange-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg font-medium relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden"
						>
							{isSubmitting ? "Sending..." : "Send Message"}
							<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out"></span>
						</button>
					</form>
				</div>
			</section>

			<footer className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
				<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>

				<div className="absolute top-20 right-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-10 left-10 w-72 h-72 bg-rose-400/5 rounded-full blur-3xl"></div>

				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-rose-400 text-white p-3 rounded-full shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 z-50"
					aria-label="Back to top"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>

				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
						<div className="flex flex-col gap-4 sm:gap-5">
							<h3 className="text-xl sm:text-2xl font-bold text-white font-['Inria_Sans'] relative inline-block mb-2">
								About Me
								<span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-orange-500 to-rose-400"></span>
							</h3>
							<div className="mb-2">
								<img
									src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
									alt="John Doe"
									className="w-16 h-16 rounded-full border-2 border-orange-500/30 mb-4 object-cover"
								/>
								<p className="text-sm sm:text-base text-gray-400 leading-relaxed">
									I'm a passionate developer and digital artist dedicated to
									creating beautiful and functional web experiences that deliver
									real business value.
								</p>
							</div>
							<div className="flex gap-3 sm:gap-4 mt-1">
								<a
									href="#"
									className="text-white bg-gradient-to-br from-orange-500/10 to-rose-400/10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-orange-500 hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/30 cursor-pointer border border-orange-500/20"
									aria-label="GitHub"
								>
									<FaGithub className="text-base sm:text-lg" />
								</a>
								<a
									href="#"
									className="text-white bg-gradient-to-br from-orange-500/10 to-rose-400/10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-orange-500 hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/30 cursor-pointer border border-orange-500/20"
									aria-label="LinkedIn"
								>
									<FaLinkedin className="text-base sm:text-lg" />
								</a>
								<a
									href="#"
									className="text-white bg-gradient-to-br from-orange-500/10 to-rose-400/10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-orange-500 hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/30 cursor-pointer border border-orange-500/20"
									aria-label="Twitter"
								>
									<FaTwitter className="text-base sm:text-lg" />
								</a>
								<a
									href="#"
									className="text-white bg-gradient-to-br from-orange-500/10 to-rose-400/10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-orange-500 hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/30 cursor-pointer border border-orange-500/20"
									aria-label="Email"
								>
									<FaEnvelope className="text-base sm:text-lg" />
								</a>
							</div>
						</div>

						<div className="flex flex-col gap-2 sm:gap-3">
							<h3 className="text-xl sm:text-2xl font-bold text-white font-['Inria_Sans'] relative inline-block mb-4">
								Quick Links
								<span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-orange-500 to-rose-400"></span>
							</h3>
							<div className="grid grid-cols-1 gap-3">
								<a
									href="#about"
									className="text-gray-300 flex items-center gap-2 transition-all duration-300 hover:text-orange-500 hover:translate-x-1 group cursor-pointer text-sm sm:text-base"
								>
									<FaArrowRight className="text-orange-500/70 transition-transform duration-300 group-hover:translate-x-1" />{" "}
									About Me
								</a>
								<a
									href="#experience"
									className="text-gray-300 flex items-center gap-2 transition-all duration-300 hover:text-orange-500 hover:translate-x-1 group cursor-pointer text-sm sm:text-base"
								>
									<FaArrowRight className="text-orange-500/70 transition-transform duration-300 group-hover:translate-x-1" />{" "}
									Experience
								</a>
								<a
									href="#projects"
									className="text-gray-300 flex items-center gap-2 transition-all duration-300 hover:text-orange-500 hover:translate-x-1 group cursor-pointer text-sm sm:text-base"
								>
									<FaArrowRight className="text-orange-500/70 transition-transform duration-300 group-hover:translate-x-1" />{" "}
									Projects
								</a>
								<a
									href="#skills"
									className="text-gray-300 flex items-center gap-2 transition-all duration-300 hover:text-orange-500 hover:translate-x-1 group cursor-pointer text-sm sm:text-base"
								>
									<FaArrowRight className="text-orange-500/70 transition-transform duration-300 group-hover:translate-x-1" />{" "}
									Skills
								</a>
								<a
									href="#contact"
									className="text-gray-300 flex items-center gap-2 transition-all duration-300 hover:text-orange-500 hover:translate-x-1 group cursor-pointer text-sm sm:text-base"
								>
									<FaArrowRight className="text-orange-500/70 transition-transform duration-300 group-hover:translate-x-1" />{" "}
									Contact
								</a>
							</div>
						</div>

						<div className="flex flex-col gap-2 sm:gap-3">
							<h3 className="text-xl sm:text-2xl font-bold text-white font-['Inria_Sans'] relative inline-block mb-4">
								Services
								<span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-orange-500 to-rose-400"></span>
							</h3>
							<div className="grid grid-cols-1 gap-3">
								<div className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
									<FaCode className="text-orange-500/70" /> Web Development
								</div>
								<div className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
									<FaPalette className="text-orange-500/70" /> UI/UX Design
								</div>
								<div className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
									<FaMobile className="text-orange-500/70" /> Mobile Apps
								</div>
								<div className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
									<FaServer className="text-orange-500/70" /> Backend Solutions
								</div>
								<div className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-orange-500/70"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
									</svg>{" "}
									Digital Strategy
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-3 sm:gap-4">
							<h3 className="text-xl sm:text-2xl font-bold text-white font-['Inria_Sans'] relative inline-block mb-4">
								Stay Connected
								<span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-orange-500 to-rose-400"></span>
							</h3>

							<div className="mb-4 w-full">
								<p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-3">
									Subscribe to my newsletter for the latest updates and
									insights.
								</p>
								<div className="flex flex-col sm:flex-row gap-2 w-full max-w-full">
									<input
										type="email"
										placeholder="Your email address"
										className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500 w-full sm:flex-1"
									/>
									<button className="bg-gradient-to-r from-orange-500 to-rose-400 text-white py-2 px-4 rounded-lg text-sm font-medium hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 whitespace-nowrap">
										Subscribe
									</button>
								</div>
							</div>

							<div className="space-y-3">
								<a
									href="mailto:john.doe@example.com"
									className="text-gray-300 flex items-center gap-2 transition-all duration-300 hover:text-orange-500 cursor-pointer text-sm sm:text-base"
								>
									<FaEnvelope className="text-orange-500/70 flex-shrink-0" />{" "}
									john.doe@example.com
								</a>
								<a
									href="https://linkedin.com/in/johndoe"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-300 flex items-center gap-2 transition-all duration-300 hover:text-orange-500 cursor-pointer text-sm sm:text-base"
								>
									<FaLinkedin className="text-orange-500/70 flex-shrink-0" />{" "}
									linkedin.com/in/johndoe
								</a>
								<a
									href="https://github.com/johndoe"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-300 flex items-center gap-2 transition-all duration-300 hover:text-orange-500 cursor-pointer text-sm sm:text-base"
								>
									<FaGithub className="text-orange-500/70 flex-shrink-0" />{" "}
									github.com/johndoe
								</a>
							</div>
						</div>
					</div>

					<div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-gray-500 text-xs sm:text-sm order-2 md:order-1 text-center md:text-left">
							&copy; {new Date().getFullYear()} John Doe. All rights reserved.
							Designed with
							<span className="text-orange-500 mx-1">♥</span>
							and code.
						</p>

						<div className="flex items-center gap-4 sm:gap-6 order-1 md:order-2">
							<a
								href="#"
								className="text-gray-400 text-xs sm:text-sm hover:text-orange-500 transition-colors duration-300 cursor-pointer"
							>
								Privacy Policy
							</a>
							<span className="text-gray-600">|</span>
							<a
								href="#"
								className="text-gray-400 text-xs sm:text-sm hover:text-orange-500 transition-colors duration-300 cursor-pointer"
							>
								Terms of Service
							</a>
							<span className="text-gray-600">|</span>
							<a
								href="#"
								className="text-gray-400 text-xs sm:text-sm hover:text-orange-500 transition-colors duration-300 cursor-pointer"
							>
								Sitemap
							</a>
						</div>
					</div>
				</div>
			</footer>

			{modalOpen && selectedProject && (
				<div
					className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
					onClick={closeModal}
				>
					<div
						className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto relative animate-fadeIn"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="h-1 w-full bg-gradient-to-r from-orange-500 to-rose-400 rounded-t-xl"></div>

						<button
							onClick={closeModal}
							className="absolute top-4 right-4 bg-gray-800/50 text-white/80 rounded-full p-2 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer"
							aria-label="Close modal"
						>
							<FaTimes className="text-lg sm:text-xl" />
						</button>

						<div className="p-6 sm:p-8">
							<h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-['Inria_Sans']">
								{selectedProject.title}
							</h2>

							<div className="flex flex-wrap gap-2 mb-4">
								{selectedProject.tags.map((tag, tagIndex) => (
									<span
										key={tagIndex}
										className="bg-orange-500/10 text-orange-500 py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm border border-orange-500/20"
									>
										{tag}
									</span>
								))}
							</div>

							<div className="mb-6 rounded-lg overflow-hidden border border-gray-700/50">
								<img
									src={selectedProject.image}
									alt={selectedProject.title}
									className="w-full h-auto"
								/>
							</div>

							<div className="prose prose-invert max-w-none">
								<h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-2">
									Project Overview
								</h3>

								<p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
									{selectedProject.longDescription ||
										selectedProject.description}
								</p>

								<a
									href={selectedProject.link}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-700 to-orange-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer mt-4"
								>
									Visit Project <FaExternalLinkAlt />
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
