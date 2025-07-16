"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Define types for projects and blog posts
interface Project {
	id: number;
	title: string;
	description: string;
	image: string;
	category: string;
	link: string;
}

interface BlogPost {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	image: string;
}

export default function PortfolioGPTExport() {
	// State management
	const [darkMode, setDarkMode] = useState(false);
	const [activeCategory, setActiveCategory] = useState("all");
	const [contactForm, setContactForm] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Sample projects data
	const projects: Project[] = [
		{
			id: 1,
			title: "E-commerce Platform",
			description:
				"A full-stack e-commerce solution with payment integration and responsive design.",
			image: "https://via.placeholder.com/300",
			category: "web",
			link: "#",
		},
		{
			id: 2,
			title: "Health Tracking App",
			description:
				"Mobile app for tracking health metrics and workout routines with data visualization.",
			image: "https://via.placeholder.com/300",
			category: "mobile",
			link: "#",
		},
		{
			id: 3,
			title: "Data Visualization Dashboard",
			description:
				"Interactive dashboard for visualizing complex datasets with real-time updates.",
			image: "https://via.placeholder.com/300",
			category: "data",
			link: "#",
		},
		{
			id: 4,
			title: "Educational Platform",
			description:
				"Online learning platform with course management and interactive assessments.",
			image: "https://via.placeholder.com/300",
			category: "web",
			link: "#",
		},
		{
			id: 5,
			title: "AR Navigation App",
			description:
				"Augmented reality app for indoor navigation in complex buildings and spaces.",
			image: "https://via.placeholder.com/300",
			category: "mobile",
			link: "#",
		},
		{
			id: 6,
			title: "Machine Learning Model",
			description:
				"Predictive analytics model for business forecasting with actionable insights.",
			image: "https://via.placeholder.com/300",
			category: "data",
			link: "#",
		},
	];

	// Sample blog posts data
	const blogPosts: BlogPost[] = [
		{
			id: 1,
			title: "Getting Started with Next.js",
			excerpt:
				"Learn the basics of Next.js and how to create your first app with modern techniques.",
			date: "2023-06-15",
			image: "https://via.placeholder.com/200",
		},
		{
			id: 2,
			title: "The Power of TypeScript",
			excerpt:
				"Why TypeScript is becoming the standard for large-scale JavaScript applications.",
			date: "2023-05-22",
			image: "https://via.placeholder.com/200",
		},
		{
			id: 3,
			title: "Responsive Design Techniques",
			excerpt:
				"Modern approaches to building responsive, mobile-first websites that look great everywhere.",
			date: "2023-04-10",
			image: "https://via.placeholder.com/200",
		},
	];

	// Filter projects based on category
	const filteredProjects =
		activeCategory === "all"
			? projects
			: projects.filter((project) => project.category === activeCategory);

	// Event handlers
	const handleContactChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setContactForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", contactForm);
		setContactForm({ name: "", email: "", message: "" });
		alert("Thank you for your message! I will get back to you soon.");
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		setMobileMenuOpen(false);
	};

	return (
		<div className={darkMode ? "dark-mode" : "light-mode"}>
			{/* CSS styles */}
			<style jsx global>{`
				:root {
					--midnight-blue: ${darkMode ? "#0A0A23" : "#191970"};
					--dark-blue: ${darkMode ? "#0F1629" : "#0F1629"};
					--medium-blue: ${darkMode ? "#2A3A5A" : "#3B4F7D"};
					--light-blue: ${darkMode ? "#5A7CC0" : "#7E9EF0"};
					--accent-blue: ${darkMode ? "#4E9AE6" : "#64B5F6"};
					--text-color: ${darkMode ? "#F0F8FF" : "#0F1629"};
					--bg-color: ${darkMode ? "#0A0A23" : "#F0F8FF"};
					--card-bg: ${darkMode
						? "rgba(15, 22, 41, 0.7)"
						: "rgba(240, 248, 255, 0.7)"};
					--card-border: ${darkMode
						? "rgba(126, 158, 240, 0.1)"
						: "rgba(126, 158, 240, 0.2)"};
					--nav-bg: ${darkMode
						? "rgba(10, 10, 35, 0.8)"
						: "rgba(240, 248, 255, 0.8)"};
				}

				* {
					box-sizing: border-box;
					margin: 0;
					padding: 0;
					font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
						sans-serif;
				}

				html,
				body {
					scroll-behavior: smooth;
					overflow-x: hidden;
				}

				body {
					background: var(--bg-color);
					color: var(--text-color);
					transition: background 0.3s ease, color 0.3s ease;
				}

				.container {
					max-width: 1200px;
					margin: 0 auto;
					padding: 0 20px;
				}

				/* Glassmorphism Styles */
				.glass-card {
					background: var(--card-bg);
					backdrop-filter: blur(10px);
					-webkit-backdrop-filter: blur(10px);
					border-radius: 16px;
					border: 1px solid var(--card-border);
					padding: 24px;
					box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
					transition: transform 0.3s ease, box-shadow 0.3s ease;
				}

				.glass-card:hover {
					transform: translateY(-5px);
					box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
				}

				/* Navigation */
				.navbar {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: 1000;
					background: var(--nav-bg);
					backdrop-filter: blur(10px);
					-webkit-backdrop-filter: blur(10px);
					border-bottom: 1px solid var(--card-border);
					transition: background 0.3s ease;
				}

				.nav-container {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 16px 20px;
					max-width: 1200px;
					margin: 0 auto;
				}

				.logo {
					font-size: 1.5rem;
					font-weight: 700;
					color: var(--accent-blue);
				}

				.nav-links {
					display: flex;
					gap: 24px;
				}

				.nav-link {
					cursor: pointer;
					color: var(--text-color);
					text-decoration: none;
					transition: color 0.3s ease;
					font-weight: 500;
				}

				.nav-link:hover {
					color: var(--accent-blue);
				}

				.mobile-menu-btn {
					display: none;
					background: none;
					border: none;
					color: var(--text-color);
					font-size: 1.5rem;
					cursor: pointer;
				}

				.mobile-menu {
					position: fixed;
					top: 60px;
					left: 0;
					right: 0;
					background: var(--nav-bg);
					backdrop-filter: blur(10px);
					-webkit-backdrop-filter: blur(10px);
					padding: 20px;
					display: flex;
					flex-direction: column;
					gap: 16px;
					border-bottom: 1px solid var(--card-border);
					z-index: 999;
					animation: slideDown 0.3s ease;
				}

				@keyframes slideDown {
					from {
						opacity: 0;
						transform: translateY(-20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				/* Hero Section */
				.hero {
					padding: 120px 0 80px;
					display: flex;
					flex-direction: column;
					align-items: center;
					text-align: center;
					min-height: 100vh;
					position: relative;
					overflow: hidden;
				}

				.hero::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: radial-gradient(
							circle at top right,
							var(--light-blue) 0%,
							transparent 50%
						),
						radial-gradient(
							circle at bottom left,
							var(--medium-blue) 0%,
							transparent 50%
						);
					opacity: 0.1;
					z-index: -1;
				}

				.profile-container {
					margin-bottom: 32px;
				}

				.profile-image {
					width: 150px;
					height: 150px;
					border-radius: 50%;
					object-fit: cover;
					border: 4px solid var(--accent-blue);
					box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
				}

				.hero-content {
					max-width: 800px;
				}

				.hero-title {
					font-size: 3rem;
					margin-bottom: 16px;
					background: linear-gradient(
						90deg,
						var(--medium-blue),
						var(--accent-blue)
					);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
					color: transparent;
				}

				.hero-subtitle {
					font-size: 1.5rem;
					margin-bottom: 24px;
					color: var(--medium-blue);
				}

				.hero-text {
					font-size: 1.1rem;
					line-height: 1.6;
					margin-bottom: 32px;
				}

				.hero-buttons {
					display: flex;
					gap: 16px;
					justify-content: center;
				}

				.btn {
					padding: 12px 24px;
					border-radius: 8px;
					font-weight: 500;
					cursor: pointer;
					transition: all 0.3s ease;
					border: none;
					font-size: 1rem;
				}

				.btn-primary {
					background: var(--accent-blue);
					color: white;
				}

				.btn-primary:hover {
					background: var(--medium-blue);
					transform: translateY(-2px);
				}

				.btn-outline {
					background: transparent;
					border: 2px solid var(--accent-blue);
					color: var(--accent-blue);
				}

				.btn-outline:hover {
					background: var(--accent-blue);
					color: white;
					transform: translateY(-2px);
				}

				/* Projects Section */
				.projects {
					padding: 80px 0;
				}

				.section-title {
					font-size: 2.5rem;
					margin-bottom: 48px;
					text-align: center;
					position: relative;
				}

				.section-title::after {
					content: "";
					position: absolute;
					bottom: -12px;
					left: 50%;
					transform: translateX(-50%);
					width: 80px;
					height: 4px;
					background: var(--accent-blue);
					border-radius: 2px;
				}

				.filter-container {
					display: flex;
					justify-content: center;
					gap: 16px;
					margin-bottom: 40px;
					flex-wrap: wrap;
				}

				.filter-btn {
					padding: 8px 16px;
					border-radius: 20px;
					cursor: pointer;
					transition: all 0.3s ease;
					border: 1px solid var(--card-border);
					background: var(--card-bg);
					color: var(--text-color);
					font-size: 0.9rem;
				}

				.filter-btn.active {
					background: var(--accent-blue);
					color: white;
				}

				.projects-grid {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
					gap: 24px;
				}

				.project-card {
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				.project-image {
					width: 100%;
					height: 200px;
					object-fit: cover;
					border-radius: 12px;
					margin-bottom: 16px;
				}

				.project-title {
					font-size: 1.3rem;
					margin-bottom: 12px;
					color: var(--accent-blue);
				}

				.project-description {
					margin-bottom: 16px;
					line-height: 1.5;
					flex-grow: 1;
				}

				.project-link {
					align-self: flex-start;
					color: var(--accent-blue);
					text-decoration: none;
					display: flex;
					align-items: center;
					gap: 8px;
					font-weight: 500;
					transition: color 0.3s ease;
				}

				.project-link:hover {
					color: var(--medium-blue);
				}

				/* Contact Section */
				.contact {
					padding: 80px 0;
					background: var(--dark-blue);
					position: relative;
				}

				.contact::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: radial-gradient(
						circle at top right,
						var(--medium-blue) 0%,
						transparent 50%
					);
					opacity: 0.05;
					z-index: 0;
				}

				.contact-container {
					position: relative;
					z-index: 1;
					max-width: 800px;
					margin: 0 auto;
				}

				.contact-form {
					margin-top: 32px;
				}

				.form-group {
					margin-bottom: 24px;
				}

				.form-label {
					display: block;
					margin-bottom: 8px;
					font-weight: 500;
				}

				.form-input,
				.form-textarea {
					width: 100%;
					padding: 12px 16px;
					border-radius: 8px;
					border: 1px solid var(--card-border);
					background: var(--card-bg);
					color: var(--text-color);
					font-size: 1rem;
					font-family: inherit;
					transition: border-color 0.3s ease;
				}

				.form-input:focus,
				.form-textarea:focus {
					outline: none;
					border-color: var(--accent-blue);
				}

				.form-textarea {
					min-height: 150px;
					resize: vertical;
				}

				/* Blog Section */
				.blog {
					padding: 80px 0;
				}

				.blog-grid {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
					gap: 24px;
				}

				.blog-card {
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				.blog-image {
					width: 100%;
					height: 160px;
					object-fit: cover;
					border-radius: 12px;
					margin-bottom: 16px;
				}

				.blog-title {
					font-size: 1.3rem;
					margin-bottom: 12px;
					color: var(--accent-blue);
				}

				.blog-excerpt {
					margin-bottom: 16px;
					line-height: 1.5;
					flex-grow: 1;
				}

				.blog-date {
					color: var(--medium-blue);
					font-size: 0.9rem;
				}

				.blog-link {
					margin-top: 16px;
					align-self: flex-start;
					color: var(--accent-blue);
					text-decoration: none;
					display: flex;
					align-items: center;
					gap: 8px;
					font-weight: 500;
					transition: color 0.3s ease;
				}

				.blog-link:hover {
					color: var(--medium-blue);
				}

				/* Footer */
				.footer {
					padding: 40px 0;
					text-align: center;
					background: var(--dark-blue);
					color: var(--text-color);
				}

				.social-links {
					display: flex;
					justify-content: center;
					gap: 20px;
					margin-bottom: 20px;
				}

				.social-link {
					color: var(--text-color);
					font-size: 1.1rem;
					transition: color 0.3s ease;
					text-decoration: none;
				}

				.social-link:hover {
					color: var(--accent-blue);
				}

				.copyright {
					font-size: 0.9rem;
					color: var(--medium-blue);
				}

				/* Dark Mode Toggle */
				.dark-mode-toggle {
					position: fixed;
					bottom: 20px;
					right: 20px;
					width: 50px;
					height: 50px;
					border-radius: 50%;
					background: var(--medium-blue);
					color: white;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					border: none;
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
					z-index: 99;
					transition: background 0.3s ease, transform 0.3s ease;
				}

				.dark-mode-toggle:hover {
					background: var(--accent-blue);
					transform: scale(1.1);
				}

				/* Responsive Design */
				@media (max-width: 768px) {
					.hero-title {
						font-size: 2.5rem;
					}

					.hero-subtitle {
						font-size: 1.2rem;
					}

					.section-title {
						font-size: 2rem;
					}

					.nav-links {
						display: none;
					}

					.mobile-menu-btn {
						display: block;
					}

					.hero-buttons {
						flex-direction: column;
						gap: 12px;
						width: 100%;
						max-width: 300px;
					}

					.btn {
						width: 100%;
					}
				}

				@media (max-width: 480px) {
					.hero-title {
						font-size: 2rem;
					}

					.section-title {
						font-size: 1.8rem;
					}

					.projects-grid,
					.blog-grid {
						grid-template-columns: 1fr;
					}

					.filter-container {
						flex-direction: column;
						align-items: center;
					}

					.filter-btn {
						width: 100%;
						max-width: 300px;
					}
				}
			`}</style>

			{/* Navigation */}
			<nav className="navbar">
				<div className="nav-container">
					<div className="logo">Portfolio</div>
					<div className="nav-links">
						<span className="nav-link" onClick={() => scrollToSection("hero")}>
							Home
						</span>
						<span
							className="nav-link"
							onClick={() => scrollToSection("projects")}
						>
							Projects
						</span>
						<span className="nav-link" onClick={() => scrollToSection("blog")}>
							Blog
						</span>
						<span
							className="nav-link"
							onClick={() => scrollToSection("contact")}
						>
							Contact
						</span>
					</div>
					<button
						className="mobile-menu-btn"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle mobile menu"
					>
						{mobileMenuOpen ? "✕" : "☰"}
					</button>
				</div>
				{mobileMenuOpen && (
					<div className="mobile-menu">
						<span className="nav-link" onClick={() => scrollToSection("hero")}>
							Home
						</span>
						<span
							className="nav-link"
							onClick={() => scrollToSection("projects")}
						>
							Projects
						</span>
						<span className="nav-link" onClick={() => scrollToSection("blog")}>
							Blog
						</span>
						<span
							className="nav-link"
							onClick={() => scrollToSection("contact")}
						>
							Contact
						</span>
					</div>
				)}
			</nav>

			{/* Hero Section */}
			<section id="hero" className="hero">
				<div className="container">
					<motion.div
						className="profile-container"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<img
							src="https://via.placeholder.com/150"
							alt="Profile"
							
							className="profile-image"
							
						/>
					</motion.div>
					<motion.div
						className="hero-content"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<h1 className="hero-title">Jane Doe</h1>
						<h2 className="hero-subtitle">
							Frontend Developer & UI/UX Designer
						</h2>
						<p className="hero-text">
							I'm a passionate frontend developer and UI/UX designer with over 5
							years of experience creating beautiful, responsive, and
							user-friendly web applications. I specialize in React, Next.js,
							and modern frontend frameworks to build scalable and performant
							solutions.
						</p>
						<div className="hero-buttons">
							<button
								className="btn btn-primary"
								onClick={() => scrollToSection("projects")}
							>
								View Projects
							</button>
							<button
								className="btn btn-outline"
								onClick={() => scrollToSection("contact")}
							>
								Contact Me
							</button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Projects Section */}
			<section id="projects" className="projects">
				<div className="container">
					<h2 className="section-title">My Projects</h2>
					<div className="filter-container">
						<button
							className={`filter-btn ${
								activeCategory === "all" ? "active" : ""
							}`}
							onClick={() => setActiveCategory("all")}
						>
							All Projects
						</button>
						<button
							className={`filter-btn ${
								activeCategory === "web" ? "active" : ""
							}`}
							onClick={() => setActiveCategory("web")}
						>
							Web Development
						</button>
						<button
							className={`filter-btn ${
								activeCategory === "mobile" ? "active" : ""
							}`}
							onClick={() => setActiveCategory("mobile")}
						>
							Mobile Apps
						</button>
						<button
							className={`filter-btn ${
								activeCategory === "data" ? "active" : ""
							}`}
							onClick={() => setActiveCategory("data")}
						>
							Data Projects
						</button>
					</div>

					<motion.div
						className="projects-grid"
						layout
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<AnimatePresence>
							{filteredProjects.map((project) => (
								<motion.div
									key={project.id}
									className="glass-card project-card"
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.3 }}
								>
									<img
										src={project.image}
										alt={project.title}
									
										className="project-image"
									/>
									<h3 className="project-title">{project.title}</h3>
									<p className="project-description">{project.description}</p>
									<a href={project.link} className="project-link">
										View Project →
									</a>
								</motion.div>
							))}
						</AnimatePresence>
					</motion.div>
				</div>
			</section>

			{/* Blog Section */}
			<section id="blog" className="blog">
				<div className="container">
					<h2 className="section-title">From My Blog</h2>
					<div className="blog-grid">
						{blogPosts.map((post) => (
							<motion.div
								key={post.id}
								className="glass-card blog-card"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}
							>
								<img
									src={post.image}
									alt={post.title}
									
									className="blog-image"
								/>
								<h3 className="blog-title">{post.title}</h3>
								<p className="blog-excerpt">{post.excerpt}</p>
								<p className="blog-date">{post.date}</p>
								<a href="#" className="blog-link">
									Read More →
								</a>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="contact">
				<div className="container contact-container">
					<h2 className="section-title">Get In Touch</h2>
					<motion.form
						className="contact-form glass-card"
						onSubmit={handleContactSubmit}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<div className="form-group">
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={contactForm.name}
								onChange={handleContactChange}
								className="form-input"
								placeholder="Your name"
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email" className="form-label">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={contactForm.email}
								onChange={handleContactChange}
								className="form-input"
								placeholder="Your email"
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="message" className="form-label">
								Message
							</label>
							<textarea
								id="message"
								name="message"
								value={contactForm.message}
								onChange={handleContactChange}
								className="form-textarea"
								placeholder="Your message"
								required
							/>
						</div>
						<button type="submit" className="btn btn-primary">
							Send Message
						</button>
					</motion.form>
				</div>
			</section>

			{/* Footer */}
			<footer className="footer">
				<div className="container">
					<div className="social-links">
						<a href="#" className="social-link">
							GitHub
						</a>
						<a href="#" className="social-link">
							LinkedIn
						</a>
						<a href="#" className="social-link">
							Twitter
						</a>
						<a href="#" className="social-link">
							Instagram
						</a>
					</div>
					<p className="copyright">
						© {new Date().getFullYear()} Jane Doe. All rights reserved.
					</p>
				</div>
			</footer>

			{/* Dark Mode Toggle */}
			<button
				className="dark-mode-toggle"
				onClick={toggleDarkMode}
				aria-label="Toggle dark mode"
			>
				{darkMode ? "☀️" : "🌙"}
			</button>
		</div>
	);
}
