"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function TravelGPTExport() {
	// For parallax effect
	const [scrollY, setScrollY] = useState(0);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#FFFACD] to-[#FFE4B5]">
			{/* Header/Navigation */}
			<header className="fixed w-full z-50 bg-white bg-opacity-90 backdrop-blur-sm">
				<nav className="container mx-auto py-4 px-6 flex justify-between items-center">
					<div className="text-2xl font-bold text-[#FF8C00]">
						<span className="text-[#F5DF4D]">Mango</span>Creative
					</div>
					<div className="hidden md:flex space-x-8">
						<a
							href="#home"
							className="text-gray-700 hover:text-[#FF8C00] transition-colors"
						>
							Home
						</a>
						<a
							href="#services"
							className="text-gray-700 hover:text-[#FF8C00] transition-colors"
						>
							Services
						</a>
						<a
							href="#blog"
							className="text-gray-700 hover:text-[#FF8C00] transition-colors"
						>
							Blog
						</a>
						<a
							href="#contact"
							className="text-gray-700 hover:text-[#FF8C00] transition-colors"
						>
							Contact
						</a>
					</div>
					<div className="md:hidden">
						<button
							className="text-gray-700"
							onClick={() => setMenuOpen(!menuOpen)}
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
									d="M4 6h16M4 12h16m-7 6h7"
								/>
							</svg>
						</button>
					</div>
				</nav>

				{/* Mobile menu */}
				{menuOpen && (
					<div className="md:hidden bg-white p-4">
						<div className="flex flex-col space-y-3">
							<a
								href="#home"
								className="text-gray-700 hover:text-[#FF8C00] transition-colors p-2"
								onClick={() => setMenuOpen(false)}
							>
								Home
							</a>
							<a
								href="#services"
								className="text-gray-700 hover:text-[#FF8C00] transition-colors p-2"
								onClick={() => setMenuOpen(false)}
							>
								Services
							</a>
							<a
								href="#blog"
								className="text-gray-700 hover:text-[#FF8C00] transition-colors p-2"
								onClick={() => setMenuOpen(false)}
							>
								Blog
							</a>
							<a
								href="#contact"
								className="text-gray-700 hover:text-[#FF8C00] transition-colors p-2"
								onClick={() => setMenuOpen(false)}
							>
								Contact
							</a>
						</div>
					</div>
				)}
			</header>

			{/* Hero Section */}
			<section
				id="home"
				className="relative h-screen flex items-center justify-center overflow-hidden"
			>
				<div
					className="absolute inset-0 z-0"
					style={{
						transform: `translateY(${scrollY * 0.5}px)`,
						backgroundImage:
							'url("https://images.unsplash.com/photo-1562071707-7249ab429b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
						backgroundSize: "cover",
						backgroundPosition: "center",
						filter: "brightness(0.7)",
					}}
				/>
				<div className="container mx-auto px-6 z-10 text-center">
					<h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
						Creative Solutions for
						<br />
						Modern Businesses
					</h1>
					<p className="text-xl md:text-2xl text-white mb-10 max-w-3xl mx-auto">
						We bring your ideas to life with stunning design and cutting-edge
						technology
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<button
							className="
              px-8 py-3 bg-[#F5DF4D] hover:bg-[#FFB347] text-gray-800 font-medium
              rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)]
              transform hover:-translate-y-1 transition-all duration-300
            "
						>
							Get Started
						</button>
						<button
							className="
              px-8 py-3 bg-transparent border-2 border-white text-white font-medium
              hover:bg-white hover:text-[#FF8C00]
              rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.1)]
              transform hover:-translate-y-1 transition-all duration-300
            "
						>
							Our Work
						</button>
					</div>
				</div>
				<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FFE4B5] to-transparent"></div>
			</section>

			{/* Services Section */}
			<section id="services" className="py-20 bg-white">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-800 mb-4">
							Our Services
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							We provide comprehensive digital services to help your business
							thrive in the digital landscape.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Service Card 1 */}
						<div
							className="
              bg-[#FFFACD] rounded-lg p-8
              shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)]
              hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.05),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]
              transition-all duration-300 group
            "
						>
							<div className="w-16 h-16 bg-[#F5DF4D] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-semibold text-gray-800 mb-3">
								Web Design
							</h3>
							<p className="text-gray-600 mb-4">
								Beautiful, responsive websites that engage your audience and
								represent your brand effectively.
							</p>
							<a
								href="#"
								className="text-[#FF8C00] hover:text-[#FFB347] font-medium flex items-center"
							>
								Learn more
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
						</div>

						{/* Service Card 2 */}
						<div
							className="
              bg-[#FFFACD] rounded-lg p-8
              shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)]
              hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.05),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]
              transition-all duration-300 group
            "
						>
							<div className="w-16 h-16 bg-[#FFB347] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-semibold text-gray-800 mb-3">
								Web Development
							</h3>
							<p className="text-gray-600 mb-4">
								Custom web applications with robust functionality, security, and
								seamless user experience.
							</p>
							<a
								href="#"
								className="text-[#FF8C00] hover:text-[#FFB347] font-medium flex items-center"
							>
								Learn more
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
						</div>

						{/* Service Card 3 */}
						<div
							className="
              bg-[#FFFACD] rounded-lg p-8
              shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)]
              hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.05),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]
              transition-all duration-300 group
            "
						>
							<div className="w-16 h-16 bg-[#FF8C00] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-semibold text-gray-800 mb-3">
								Brand Strategy
							</h3>
							<p className="text-gray-600 mb-4">
								Strategic brand development to help you stand out in the market
								and connect with your audience.
							</p>
							<a
								href="#"
								className="text-[#FF8C00] hover:text-[#FFB347] font-medium flex items-center"
							>
								Learn more
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Blog Section */}
			<section id="blog" className="py-20 bg-[#FFFACD]">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-800 mb-4">
							Our Blog & Case Studies
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Insights, trends, and success stories from our team of digital
							experts.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
						{/* Blog Card 1 */}
						<div
							className="
              bg-white rounded-xl overflow-hidden
              shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)]
              hover:shadow-[8px_8px_20px_rgba(0,0,0,0.07),-8px_-8px_20px_rgba(255,255,255,0.9)]
              transition-all duration-300 transform hover:-translate-y-2
            "
						>
							<div className="h-60 relative overflow-hidden">
								<img
									src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
									alt="UX Design"
									
									style={{ objectFit: "cover" }}
									className="transition-transform duration-500 hover:scale-105"
								/>
							</div>
							<div className="p-6">
								<span className="text-sm text-[#FF8C00] font-medium">
									UX Design • May 15, 2023
								</span>
								<h3 className="text-xl font-bold text-gray-800 mt-2 mb-3">
									10 UX Principles That Will Improve Your Customer Experience
								</h3>
								<p className="text-gray-600 mb-4">
									Learn how to apply key UX principles to create more engaging
									and effective customer experiences.
								</p>
								<a
									href="#"
									className="text-[#FF8C00] hover:text-[#FFB347] font-medium flex items-center"
								>
									Read more
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 ml-1"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>

						{/* Blog Card 2 */}
						<div
							className="
              bg-white rounded-xl overflow-hidden
              shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)]
              hover:shadow-[8px_8px_20px_rgba(0,0,0,0.07),-8px_-8px_20px_rgba(255,255,255,0.9)]
              transition-all duration-300 transform hover:-translate-y-2
            "
						>
							<div className="h-60 relative overflow-hidden">
								<img
									src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
									alt="Case Study"
									
									style={{ objectFit: "cover" }}
									className="transition-transform duration-500 hover:scale-105"
								/>
							</div>
							<div className="p-6">
								<span className="text-sm text-[#FF8C00] font-medium">
									Case Study • April 28, 2023
								</span>
								<h3 className="text-xl font-bold text-gray-800 mt-2 mb-3">
									How We Helped XYZ Company Increase Conversions by 150%
								</h3>
								<p className="text-gray-600 mb-4">
									A detailed look at our strategy and execution that led to
									remarkable results for our client.
								</p>
								<a
									href="#"
									className="text-[#FF8C00] hover:text-[#FFB347] font-medium flex items-center"
								>
									Read more
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 ml-1"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>

						{/* Blog Card 3 */}
						<div
							className="
              bg-white rounded-xl overflow-hidden
              shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)]
              hover:shadow-[8px_8px_20px_rgba(0,0,0,0.07),-8px_-8px_20px_rgba(255,255,255,0.9)]
              transition-all duration-300 transform hover:-translate-y-2
            "
						>
							<div className="h-60 relative overflow-hidden">
								<img
									src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
									alt="Web Development"
									
									style={{ objectFit: "cover" }}
									className="transition-transform duration-500 hover:scale-105"
								/>
							</div>
							<div className="p-6">
								<span className="text-sm text-[#FF8C00] font-medium">
									Development • March 12, 2023
								</span>
								<h3 className="text-xl font-bold text-gray-800 mt-2 mb-3">
									The Future of Web Development: Trends to Watch in 2023
								</h3>
								<p className="text-gray-600 mb-4">
									Exploring emerging technologies and methodologies that are
									shaping the future of web development.
								</p>
								<a
									href="#"
									className="text-[#FF8C00] hover:text-[#FFB347] font-medium flex items-center"
								>
									Read more
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 ml-1"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>
					</div>

					<div className="text-center mt-12">
						<button
							className="
              px-8 py-3 bg-[#F5DF4D] hover:bg-[#FFB347] text-gray-800 font-medium
              rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)]
              transform hover:-translate-y-1 transition-all duration-300
            "
						>
							View All Posts
						</button>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="py-20 bg-white">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-800 mb-4">
							Get In Touch
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Ready to start your project? Contact us today and let's create
							something amazing together.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Contact Form */}
						<div
							className="
              bg-[#FFFACD] rounded-lg p-8
              shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)]
            "
						>
							<h3 className="text-2xl font-semibold text-gray-800 mb-6">
								Send Us a Message
							</h3>

							<form className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label
											htmlFor="name"
											className="block text-gray-700 font-medium mb-2"
										>
											Name
										</label>
										<input
											type="text"
											id="name"
											className="
                        w-full px-4 py-3 bg-white rounded-lg
                        shadow-[inset_3px_3px_5px_rgba(0,0,0,0.05),inset_-3px_-3px_5px_rgba(255,255,255,0.5)]
                        focus:outline-none focus:ring-2 focus:ring-[#FFB347]
                      "
											placeholder="Your name"
										/>
									</div>
									<div>
										<label
											htmlFor="email"
											className="block text-gray-700 font-medium mb-2"
										>
											Email
										</label>
										<input
											type="email"
											id="email"
											className="
                        w-full px-4 py-3 bg-white rounded-lg
                        shadow-[inset_3px_3px_5px_rgba(0,0,0,0.05),inset_-3px_-3px_5px_rgba(255,255,255,0.5)]
                        focus:outline-none focus:ring-2 focus:ring-[#FFB347]
                      "
											placeholder="Your email"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="subject"
										className="block text-gray-700 font-medium mb-2"
									>
										Subject
									</label>
									<input
										type="text"
										id="subject"
										className="
                      w-full px-4 py-3 bg-white rounded-lg
                      shadow-[inset_3px_3px_5px_rgba(0,0,0,0.05),inset_-3px_-3px_5px_rgba(255,255,255,0.5)]
                      focus:outline-none focus:ring-2 focus:ring-[#FFB347]
                    "
										placeholder="Subject"
									/>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-gray-700 font-medium mb-2"
									>
										Message
									</label>
									<textarea
										id="message"
										rows={5}
										className="
                      w-full px-4 py-3 bg-white rounded-lg
                      shadow-[inset_3px_3px_5px_rgba(0,0,0,0.05),inset_-3px_-3px_5px_rgba(255,255,255,0.5)]
                      focus:outline-none focus:ring-2 focus:ring-[#FFB347]
                    "
										placeholder="Your message"
									></textarea>
								</div>

								<button
									type="submit"
									className="
                  w-full px-8 py-3 bg-[#FF8C00] hover:bg-[#FFB347] text-white font-medium
                  rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)]
                  transform hover:-translate-y-1 transition-all duration-300
                "
								>
									Send Message
								</button>
							</form>
						</div>

						{/* Map and Contact Info */}
						<div>
							{/* Map */}
							<div
								className="
                h-64 bg-gray-200 rounded-lg mb-8 overflow-hidden
                shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)]
                relative
              "
							>
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573363034!2d-73.9878531!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
									className="w-full h-full border-0"
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								></iframe>
							</div>

							{/* Contact Information */}
							<div
								className="
                bg-[#FFFACD] rounded-lg p-8
                shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)]
              "
							>
								<h3 className="text-2xl font-semibold text-gray-800 mb-6">
									Contact Information
								</h3>

								<div className="space-y-4">
									<div className="flex items-start">
										<div className="flex-shrink-0 mt-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-[#FF8C00]"
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
										<div className="ml-4">
											<h4 className="text-lg font-medium text-gray-800">
												Address
											</h4>
											<p className="text-gray-600">
												123 Creative Street, Design District, CA 90210
											</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="flex-shrink-0 mt-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-[#FF8C00]"
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
										<div className="ml-4">
											<h4 className="text-lg font-medium text-gray-800">
												Phone
											</h4>
											<p className="text-gray-600">+1 (555) 123-4567</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="flex-shrink-0 mt-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-[#FF8C00]"
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
										<div className="ml-4">
											<h4 className="text-lg font-medium text-gray-800">
												Email
											</h4>
											<p className="text-gray-600">info@mangocreative.com</p>
										</div>
									</div>
								</div>

								{/* Newsletter Subscription */}
								<div className="mt-8 pt-8 border-t border-gray-200">
									<h4 className="text-lg font-medium text-gray-800 mb-4">
										Subscribe to our newsletter
									</h4>
									<div className="flex">
										<input
											type="email"
											className="
                        flex-1 px-4 py-2 bg-white rounded-l-lg
                        shadow-[inset_3px_3px_5px_rgba(0,0,0,0.05),inset_-3px_-3px_5px_rgba(255,255,255,0.5)]
                        focus:outline-none
                      "
											placeholder="Your email"
										/>
										<button
											className="
                      px-4 py-2 bg-[#FF8C00] hover:bg-[#FFB347] text-white rounded-r-lg
                      transition-colors duration-300
                    "
										>
											Subscribe
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div>
							<h3 className="text-2xl font-bold mb-4">
								<span className="text-[#F5DF4D]">Mango</span>Creative
							</h3>
							<p className="text-gray-400 mb-4">
								We create digital experiences that delight and inspire.
							</p>
							<div className="flex space-x-4">
								<a
									href="#"
									className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
								>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
								>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
								>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
								>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>

						<div>
							<h4 className="text-xl font-semibold mb-4">Services</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Web Design
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Web Development
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Brand Strategy
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										UI/UX Design
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Digital Marketing
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-xl font-semibold mb-4">Resources</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Case Studies
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Portfolio
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Testimonials
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										FAQ
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-xl font-semibold mb-4">Company</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										About Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Team
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Careers
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Contact
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#F5DF4D] transition-colors"
									>
										Privacy Policy
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
						<p>
							&copy; {new Date().getFullYear()} MangoCreative. All rights
							reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
