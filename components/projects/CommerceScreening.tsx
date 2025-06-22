"use client";

import { AnimatePresence, motion, PanInfo } from "framer-motion";
import {
	ChevronRight,
	Filter,
	Minus,
	Moon,
	Plus,
	ShoppingCart,
	Sun,
	Trash2,
	X,
} from "lucide-react";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { FormEvent, useEffect, useMemo, useState } from "react";

const inter = Manrope({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-manrope",
});

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-plus-jakarta-sans",
});

interface Product {
	id: number;
	name: string;
	price: number;
	image: string;
	category: "men" | "women" | "kids" | "accessories" | "new arrivals" | "sale";
	size?: "XS" | "S" | "M" | "L" | "XL";
	color?: string;
}

interface CartItem {
	product: Product;
	quantity: number;
}

const products: Product[] = [
	{
		id: 1,
		name: "Premium Cotton T-Shirt",
		price: 29.99,
		image:
			"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
		category: "men",
		size: "M",
		color: "Blue",
	},
	{
		id: 2,
		name: "Elegant Women's Dress",
		price: 49.99,
		image:
			"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29tZW4lMjBkcmVzc3xlbnwwfHwwfHx8Mg%3D%3D",
		category: "women",
		size: "S",
		color: "Red",
	},
	{
		id: 3,
		name: "Casual Kids Jeans",
		price: 39.99,
		image:
			"https://images.unsplash.com/photo-1666379685317-f37a716bc4ec?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2lkJTIwamVhbnN8ZW58MHx8MHx8fDI%3D",
		category: "kids",
		size: "L",
		color: "Blue",
	},
	{
		id: 4,
		name: "Designer Handbag",
		price: 99.99,
		image:
			"https://images.unsplash.com/photo-1659011559233-7685997dee4e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RGVzaWduZXIlMjBIYW5kYmFnfGVufDB8MXwwfHx8Mg%3D%3D",
		category: "accessories",
		color: "Brown",
	},
	{
		id: 5,
		name: "Sports Running Shoes",
		price: 79.99,
		image:
			"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
		category: "accessories",
		size: "XL",
		color: "Black",
	},
	{
		id: 6,
		name: "Vintage Style Watch",
		price: 59.99,
		image:
			"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop",
		category: "accessories",
		color: "Silver",
	},
	{
		id: 7,
		name: "Cozy Winter Jacket",
		price: 89.99,
		image:
			"https://images.unsplash.com/photo-1613422448762-c13f05ae758a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8V2ludGVyJTIwSmFja2V0fGVufDB8MXwwfHx8Mg%3D%3D",
		category: "men",
		size: "L",
		color: "Gray",
	},
	{
		id: 8,
		name: "Summer Beach Dress",
		price: 39.99,
		image:
			"https://images.unsplash.com/flagged/photo-1576663842078-d7f7379d8540?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2glMjBkcmVzc3xlbnwwfDF8MHx8fDI%3D",
		category: "women",
		size: "M",
		color: "Yellow",
	},
	{
		id: 9,
		name: "Kids Cartoon Hoodie",
		price: 29.99,
		image:
			"https://images.unsplash.com/photo-1540987173746-7a87c08d3ab7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8a2lkJTIwSG9vZGllfGVufDB8MXwwfHx8Mg%3D%3D",
		category: "kids",
		size: "S",
		color: "Green",
	},
	{
		id: 10,
		name: "Luxury Leather Belt",
		price: 49.99,
		image:
			"https://images.unsplash.com/photo-1666723043169-22e29545675c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGVhdGhlciUyMGJlbHR8ZW58MHwxfDB8fHwy",
		category: "accessories",
		color: "Black",
	},
	{
		id: 11,
		name: "Fashion Sunglasses",
		price: 19.99,
		image:
			"https://images.unsplash.com/photo-1577744486770-020ab432da65?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VuZ2xhc3Nlc3xlbnwwfDF8MHx8fDI%3D",
		category: "accessories",
		color: "Purple",
	},
	{
		id: 12,
		name: "Premium Denim Jeans",
		price: 69.99,
		image:
			"https://images.unsplash.com/photo-1714729382668-7bc3bb261662?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRlbmltfGVufDB8MXwwfHx8Mg%3D%3D",
		category: "men",
		size: "XL",
		color: "Indigo",
	},
	{
		id: 13,
		name: "Elegant Evening Gown",
		price: 79.99,
		image:
			"https://images.unsplash.com/photo-1610048616025-11a3dcc9fd0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z293bnxlbnwwfDF8MHx8fDI%3D",
		category: "women",
		size: "L",
		color: "Navy",
	},
	{
		id: 14,
		name: "Kids Backpack",
		price: 39.99,
		image:
			"https://images.unsplash.com/photo-1599868082389-59b00bb8760d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVkJTIwc2Nob29sJTIwYmFnfGVufDB8MXwwfHx8Mg%3D%3D",
		category: "accessories",
		color: "Red",
	},
	{
		id: 15,
		name: "Designer Wallet",
		price: 29.99,
		image:
			"https://images.unsplash.com/photo-1636023189308-06668418548d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhbGxldHxlbnwwfDF8MHx8fDI%3D",
		category: "accessories",
		color: "Brown",
	},
	{
		id: 16,
		name: "Casual T-Shirt",
		price: 19.99,
		image:
			"https://images.unsplash.com/photo-1600328759671-85927887458d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dCUyMHNoaXJ0fGVufDB8MXwwfHx8Mg%3D%3D",
		category: "men",
		size: "S",
		color: "White",
	},
];

const categories: string[] = [
	"all",
	"men",
	"women",
	"kids",
	"accessories",
	"new arrivals",
	"sale",
];

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const buttonVariants = {
	hover: { scale: 1.05, transition: { duration: 0.2 } },
	tap: { scale: 0.95 },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
	return Math.abs(offset) * velocity;
};

const Shop = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [orderCompleted, setOrderCompleted] = useState<boolean>(false);
	const [activeSection, setActiveSection] = useState<string>("hero");
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [email, setEmail] = useState(["", ""]);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			if (typeof window !== "undefined") {
				setIsMobile(window.innerWidth < 768);
			}
		};

		const handleResize = () => {
			checkMobile();
		};

		checkMobile();
		if (typeof window !== "undefined") {
			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (typeof window !== "undefined") {
				const sections = ["hero", "featured", "products", "contact"];
				const sectionElements = sections.map((id) =>
					document.getElementById(id)
				);
				const scrollPosition = window.scrollY + window.innerHeight / 3;

				for (let i = sectionElements.length - 1; i >= 0; i--) {
					const section = sectionElements[i];
					if (section && section.offsetTop <= scrollPosition) {
						setActiveSection(section.id);
						break;
					}
				}
			}
		};

		if (typeof window !== "undefined") {
			window.addEventListener("scroll", handleScroll);
			return () => window.removeEventListener("scroll", handleScroll);
		}
	}, []);

	const handleSubscribe = (e: FormEvent) => {
		e.preventDefault();
		setToastMessage(`${email} is now subscribed!`);
		setEmail(["", ""]);
		setTimeout(() => {
			setToastMessage(null);
		}, 3000);
	};

	const handleAddToCart = (product: Product) => {
		const existingItemIndex = cartItems.findIndex(
			(item) => item.product.id === product.id
		);

		if (existingItemIndex !== -1) {
			const updatedCartItems = [...cartItems];
			updatedCartItems[existingItemIndex].quantity += 1;
			setCartItems(updatedCartItems);
		} else {
			setCartItems([...cartItems, { product, quantity: 1 }]);
		}

		setToastMessage(`Added ${product.name} to cart`);
		setTimeout(() => {
			setToastMessage(null);
		}, 3000);
	};

	const handleUpdateQuantity = (productId: number, quantity: number) => {
		if (quantity === 0) {
			handleRemoveFromCart(productId);
			return;
		}

		const updatedCartItems = cartItems.map((item) =>
			item.product.id === productId ? { ...item, quantity } : item
		);
		setCartItems(updatedCartItems);
	};

	const handleRemoveFromCart = (productId: number) => {
		const updatedCartItems = cartItems.filter(
			(item) => item.product.id !== productId
		);
		setCartItems(updatedCartItems);
	};

	const handleCheckout = () => {
		setOrderCompleted(true);

		setTimeout(() => {
			setCartItems([]);
			setIsCartOpen(false);

			setTimeout(() => {
				setOrderCompleted(false);
			}, 1000);
		}, 2000);
	};

	const filteredProducts = useMemo(() => {
		if (selectedCategory === "all") {
			return products;
		} else if (selectedCategory === "new arrivals") {
			return [...products].sort((a, b) => a.id - b.id).slice(0, 8);
		} else if (selectedCategory === "sale") {
			return products.filter((product) => product.price < 50);
		} else {
			return products.filter(
				(product) => product.category === selectedCategory
			);
		}
	}, [selectedCategory]);

	const navItems = [
		{ name: "Home", href: "#hero" },
		{ name: "Featured", href: "#featured" },
		{ name: "Products", href: "#products" },
		{ name: "Contact", href: "#contact" },
	];

	const scrollToSection = (id: string) => {
		if (typeof window !== "undefined") {
			const element = document.getElementById(id);
			if (element) {
				const offset = 30;
				const elementPosition = element.getBoundingClientRect().top;
				const offsetPosition = elementPosition + window.pageYOffset - offset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});
			}
		}
	};

	const handleDragEnd = (
		event: globalThis.MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		const swipe = swipePower(info.offset.x, info.velocity.x);

		if (swipe < -swipeConfidenceThreshold) {
			setIsCartOpen(true);
		} else if (swipe > swipeConfidenceThreshold) {
			setIsCartOpen(false);
		}
	};

	const cartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

	return (
		<div
			className={`min-h-screen ${inter.variable} ${plusJakartaSans.variable} ${
				darkMode ? "bg-[#070b13] text-gray-300" : "bg-white text-gray-800"
			}`}
			style={{ fontFamily: "var(--font-manrope)" }}
		>
			<header
				className={`sticky top-0 z-50 border-b shadow-sm ${
					darkMode
						? "bg-[#13141d] border-[#282b33]"
						: "bg-white border-gray-200"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center">
						<div className="flex items-center">
							<div className="flex items-center space-x-1.5 mr-2">
								<div className="w-3 h-3 bg-amber-500 rounded-full"></div>
								<div className="w-3 h-3 bg-teal-400 rounded-full"></div>
								<div className="w-3 h-3 bg-purple-500 rounded-full"></div>
							</div>
							<h1
								className="text-2xl hidden sm:block font-extralight tracking-wider"
								style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
							>
								MODERN
								<span className="font-bold ml-1">COLLECTIONS</span>
							</h1>
							<div className="hidden md:block h-6 w-px bg-gray-300 mx-4"></div>
							<nav className="hidden md:flex space-x-8">
								{navItems.map((item) => (
									<button
										key={item.name}
										onClick={() => scrollToSection(item.href.substring(1))}
										className={`text-sm cursor-pointer font-medium transition-colors ${
											activeSection === item.href.substring(1)
												? "text-amber-500"
												: darkMode
												? ""
												: "text-gray-600 hover:text-gray-900"
										}`}
									>
										{item.name}
									</button>
								))}
							</nav>
						</div>
						<div className="flex items-center gap-4">
							<motion.button
								whileHover="hover"
								whileTap="tap"
								variants={buttonVariants}
								className={`relative cursor-pointer p-2 transition-colors ${
									darkMode ? "" : "text-gray-600 hover:text-gray-900"
								}`}
								onClick={() => setDarkMode((prev) => !prev)}
							>
								{darkMode ? (
									<Sun className="w-5 h-5" />
								) : (
									<Moon className="w-5 h-5" />
								)}
							</motion.button>
							<motion.button
								whileHover="hover"
								whileTap="tap"
								variants={buttonVariants}
								className={`relative cursor-pointer p-2 transition-colors ${
									darkMode ? "" : "text-gray-600 hover:text-gray-900"
								}`}
								onClick={() => setIsCartOpen(!isCartOpen)}
							>
								<ShoppingCart className="w-5 h-5" />
								{cartQuantity > 0 && (
									<span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
										{cartQuantity}
									</span>
								)}
							</motion.button>
							<motion.button
								whileHover="hover"
								whileTap="tap"
								variants={buttonVariants}
								className={`md:hidden cursor-pointer p-2 transition-colors ${
									darkMode ? "" : "text-gray-600 hover:text-gray-900"
								}`}
								onClick={() => setIsFilterOpen(!isFilterOpen)}
							>
								<Filter className="w-5 h-5" />
							</motion.button>
						</div>
					</div>
				</div>
			</header>

			<AnimatePresence>
				{isCartOpen && (
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						className={`fixed top-0 right-0 w-full sm:w-96 h-screen shadow-lg z-50 border-l  ${
							darkMode
								? "bg-[#070b13] border-[#282b33]"
								: "bg-white border-gray-200"
						}`}
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						onDragEnd={handleDragEnd}
					>
						<CartModal
							darkMode={darkMode}
							onClose={() => setIsCartOpen(false)}
							cartItems={cartItems}
							onUpdateQuantity={handleUpdateQuantity}
							onRemoveFromCart={handleRemoveFromCart}
							onCheckout={handleCheckout}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{isFilterOpen && isMobile && (
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						className={`fixed top-0 left-0 w-80 h-screen shadow-lg z-50 border-r p-6 ${
							darkMode
								? "bg-[#13141d] border-[#282b33]"
								: "bg-white border-gray-200"
						}`}
					>
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-lg font-semibold">Filters</h2>
							<motion.button
								whileHover="hover"
								whileTap="tap"
								variants={buttonVariants}
								onClick={() => setIsFilterOpen(false)}
								className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
							>
								<X className="w-5 h-5" />
							</motion.button>
						</div>
						<CategoryFilter
							darkMode={darkMode}
							categories={categories}
							selectedCategory={selectedCategory}
							onCategoryChange={(category) => {
								setSelectedCategory(category);
								setIsFilterOpen(false);
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<main>
				<section
					id="hero"
					className={`relative h-[80vh] overflow-hidden bg-gradient-to-br ${
						darkMode
							? "from-[#070b13] to-[#1c1e26]"
							: "from-gray-50 to-gray-100"
					}`}
				>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="absolute inset-0 z-10 bg-gradient-to-r from-amber-500/20 to-teal-400/20 mix-blend-multiply"
					></motion.div>
					<div className="absolute inset-0 overflow-hidden">
						<motion.div
							initial={{ x: 0, y: 0 }}
							animate={{
								x: [0, 20, 0],
								y: [0, -15, 0],
							}}
							transition={{
								duration: 12,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
							}}
							className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl"
						></motion.div>
						<motion.div
							initial={{ x: 0, y: 0 }}
							animate={{
								x: [0, -20, 0],
								y: [0, 15, 0],
							}}
							transition={{
								duration: 10,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
							}}
							className="absolute bottom-20 right-1/4 w-56 h-56 rounded-full bg-teal-400/10 blur-3xl"
						></motion.div>
						<motion.div
							initial={{ x: 0, y: 0 }}
							animate={{
								x: [0, 15, 0],
								y: [0, -10, 0],
							}}
							transition={{
								duration: 8,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
							}}
							className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl"
						></motion.div>

						<div className="absolute inset-0 overflow-hidden">
							{[
								{ top: "10%", left: "5%", size: 20, color: "bg-amber-500/10" },
								{ top: "25%", right: "8%", size: 36, color: "bg-teal-400/10" },
								{
									top: "40%",
									left: "15%",
									size: 28,
									color: "bg-purple-500/10",
								},
								{
									top: "55%",
									right: "12%",
									size: 32,
									color: "bg-amber-500/10",
								},
								{ top: "70%", left: "20%", size: 24, color: "bg-teal-400/10" },
							].map((circle, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{
										opacity: [0, 1, 0],
										scale: [0.8, 1.2, 0.8],
										y: [0, -15, 0],
									}}
									transition={{
										duration: 3,
										repeat: Number.POSITIVE_INFINITY,
										delay: index * 0.5,
									}}
									className={`absolute w-${circle.size} h-${circle.size} rounded-full ${circle.color} blur-xl`}
									style={{ top: circle.top, left: circle.left }}
								></motion.div>
							))}
						</div>
					</div>
					<div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
						<div className="w-full">
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.2 }}
								className="max-w-2xl"
							>
								<div className="inline-block mb-6">
									<div className="flex items-center space-x-2 mb-3">
										<span className="h-px w-12 bg-amber-500"></span>
										<span className="text-sm uppercase tracking-widest text-amber-500 font-medium">
											New Collection
										</span>
									</div>
									<h1
										className="text-6xl font-black mb-4"
										style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
									>
										Elevate Your Style
										<br />
										<span className="text-amber-500">Modern</span> Essentials
									</h1>
									<p
										className={`text-lg mb-8 ${
											darkMode ? "" : "text-gray-600"
										}`}
									>
										Discover our curated collection of timeless pieces,
										meticulously crafted for the modern individual. Quality,
										style, and comfort come together in our latest arrivals.
									</p>
									<div className="flex flex-wrap gap-3">
										<motion.a
											whileHover="hover"
											whileTap="tap"
											variants={buttonVariants}
											href="#products"
											className="inline-flex items-center px-8 py-4 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-all"
										>
											Explore Collection
											<ChevronRight className="w-5 h-5 ml-2" />
										</motion.a>
										<motion.a
											whileHover="hover"
											whileTap="tap"
											variants={buttonVariants}
											href="#featured"
											className={`inline-flex items-center px-8 py-4 text-amber-500 rounded-lg shadow-lg border border-amber-500  transition-all ${
												darkMode ? "" : "bg-white hover:bg-amber-50"
											}`}
										>
											Featured Items
											<ChevronRight className="w-5 h-5 ml-2" />
										</motion.a>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				<section
					id="featured"
					className={`py-24 bg-gradient-to-b ${
						darkMode ? " from-[#070b13] to-[#13141d]" : "from-white to-gray-50"
					}`}
				>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="text-center mb-16"
						>
							<div className="inline-block mb-6">
								<div className="flex items-center space-x-2 mb-3">
									<span className="h-px w-12 bg-amber-500"></span>
									<span className="text-sm uppercase tracking-widest text-amber-500 font-medium">
										Exclusive Picks
									</span>
								</div>
								<h2
									className="text-4xl font-extrabold mb-4"
									style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
								>
									Featured Collections
								</h2>
								<p
									className={`text-lg max-w-2xl mx-auto ${
										darkMode ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Handpicked items that define our brand aesthetic. Each piece
									tells a story of craftsmanship and timeless appeal.
								</p>
							</div>
						</motion.div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							{[
								{
									name: "Luxury Menswear",
									description:
										"Elevate your wardrobe with our premium menswear collection. Tailored perfection meets modern sophistication.",
									image:
										"https://images.unsplash.com/photo-1605106702734-205df224ecce?w=700&auto=format&fit=crop&q=60",
									gradient: "from-amber-500/20 to-amber-600/20",
								},
								{
									name: "Exclusive Womenswear",
									description:
										"Discover the art of elegance with our curated womenswear. Each piece is a blend of comfort and haute couture.",
									image:
										"https://plus.unsplash.com/premium_photo-1732473760222-389820a18261?w=700&auto=format&fit=crop&q=60",
									gradient: "from-teal-500/20 to-teal-600/20",
								},
							].map((collection, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="group relative bg-white rounded-2xl shadow-xl overflow-hidden"
								>
									<div className="relative h-96 overflow-hidden">
										<div
											className={`absolute inset-0 bg-gradient-to-r ${collection.gradient} mix-blend-multiply z-10`}
										></div>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={collection.image}
											alt={collection.name}
											className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
										<div className="absolute bottom-0 left-0 p-8 z-20">
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												whileInView={{ opacity: 1, y: 0 }}
												viewport={{ once: true }}
												transition={{ duration: 0.5, delay: 0.2 }}
											>
												<h3
													className="text-3xl font-bold text-white mb-3"
													style={{
														fontFamily: "var(--font-plus-jakarta-sans)",
													}}
												>
													{collection.name}
												</h3>
												<p className="text-gray-200 mb-6 max-w-xl">
													{collection.description}
												</p>
												<motion.a
													whileHover="hover"
													href="#products"
													whileTap="tap"
													variants={buttonVariants}
													onClick={() =>
														setSelectedCategory(
															collection.name === "Luxury Menswear"
																? "men"
																: "women"
														)
													}
													className={`inline-flex items-center px-6 py-3 rounded-lg shadow-md  transition-colors ${
														darkMode
															? "bg-[#1c1e26] border-[#282b33] border"
															: "bg-white text-gray-800 hover:bg-gray-100"
													}`}
												>
													Explore Collection
													<ChevronRight className="w-5 h-5 ml-2" />
												</motion.a>
											</motion.div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section
					id="products"
					className={`py-24  ${darkMode ? "bg-[#070b13]" : "bg-white"}`}
				>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="text-center mb-16"
						>
							<div className="inline-block mb-6">
								<div className="flex items-center space-x-2 mb-3">
									<span className="h-px w-12 bg-amber-500"></span>
									<span className="text-sm uppercase tracking-widest text-amber-500 font-medium">
										Shop by Category
									</span>
								</div>
								<h2
									className="text-4xl font-extrabold mb-4"
									style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
								>
									Browse Our Collection
								</h2>
								<p
									className={`text-lg max-w-2xl mx-auto ${
										darkMode ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Discover products tailored to your style. From casual wear to
									luxury accessories, we have something for everyone.
								</p>
							</div>

							<div className="flex justify-center mb-12">
								<div className="w-full">
									<div className="hidden md:flex flex-wrap justify-center gap-3 mb-6">
										{categories.map((category) => (
											<motion.button
												key={category}
												whileHover="hover"
												whileTap="tap"
												variants={buttonVariants}
												onClick={() => setSelectedCategory(category)}
												className={`px-6 py-3 cursor-pointer rounded-lg transition-all ${
													selectedCategory === category
														? "bg-amber-500 text-white shadow-lg"
														: darkMode
														? "bg-[#1c1e26] border border-[#282b33]"
														: "bg-gray-100 text-gray-600 hover:bg-gray-200"
												}`}
											>
												<span className="capitalize">{category}</span>
											</motion.button>
										))}
									</div>

									<div className="md:hidden flex justify-center mb-6">
										<motion.button
											whileHover="hover"
											whileTap="tap"
											variants={buttonVariants}
											onClick={() => setIsFilterOpen(!isFilterOpen)}
											className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition-colors"
										>
											<span className="capitalize">
												{selectedCategory === "all"
													? "All Products"
													: selectedCategory}
											</span>
										</motion.button>
									</div>
								</div>
							</div>
						</motion.div>

						<motion.div
							key={selectedCategory}
							initial="hidden"
							animate="show"
							exit="hidden"
							variants={container}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
						>
							{filteredProducts.map((product) => (
								<motion.div
									key={product.id}
									variants={{
										hidden: { opacity: 0, y: 10 },
										show: { opacity: 1, y: 0, transition: { type: "spring" } },
									}}
									className={`group relative border rounded-xl shadow-md overflow-hidden ${
										darkMode
											? "bg-[#13141d] border-[#282b33]"
											: "bg-white border-transparent"
									}`}
								>
									<div className="relative h-72 overflow-hidden">
										{product.category === "new arrivals" && (
											<span className="absolute top-4 right-4 bg-white text-amber-500 text-xs font-medium px-3 py-1 rounded-full z-10">
												New
											</span>
										)}
										{product.category === "sale" && (
											<span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full z-10">
												Sale
											</span>
										)}
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<div className="absolute bottom-0 left-0 w-full px-6 py-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
											<motion.button
												whileHover="hover"
												whileTap="tap"
												variants={buttonVariants}
												onClick={() => handleAddToCart(product)}
												className="w-full cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center shadow-md"
											>
												<ShoppingCart className="w-4 h-4 mr-2" />
												Add to Cart
											</motion.button>
										</div>
									</div>
									<div className="p-6">
										<div className="flex justify-between items-start mb-3">
											<h3
												className="text-lg font-bold"
												style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
											>
												{product.name}
											</h3>
											<span className="text-lg font-bold text-amber-500">
												${product.price}
											</span>
										</div>
										<div className="flex flex-wrap gap-2 mb-4">
											{product.size && (
												<span
													className={`px-3 py-1 text-xs font-medium border rounded-full ${
														darkMode
															? "bg-[#1c1e26] border-[#282b33]"
															: "bg-gray-100 text-gray-700 border-transparent"
													}`}
												>
													{product.size}
												</span>
											)}
											{product.color && (
												<span
													className={`px-3 py-1 text-xs font-medium border rounded-full ${
														darkMode
															? "bg-[#1c1e26] border-[#282b33]"
															: "bg-gray-100 text-gray-700 border-transparent"
													}`}
												>
													{product.color}
												</span>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>

				<section
					id="contact"
					className={`py-24 bg-gradient-to-br ${
						darkMode
							? "from-amber-900 to-teal-900"
							: " from-amber-500 to-teal-500"
					}`}
				>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="text-center mb-16"
						>
							<div className="inline-block mb-6">
								<div className="flex items-center space-x-2 mb-3">
									<span className="h-px w-12 bg-white/30"></span>
									<span className="text-sm uppercase tracking-widest text-white/90 font-medium">
										Join Our Community
									</span>
								</div>
								<h2
									className="text-4xl font-extrabold text-white mb-4"
									style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
								>
									Subscribe to Our Newsletter
								</h2>
								<p className="text-lg text-white/80 max-w-2xl mx-auto">
									Get exclusive access to new arrivals, special offers, and
									styling tips from our expert team.
								</p>
							</div>

							<div className="max-w-xl mx-auto">
								<form
									onSubmit={handleSubscribe}
									className="flex flex-col md:flex-row gap-3"
								>
									<input
										type="email"
										value={email[0]}
										required
										onChange={(e) => setEmail([e.target.value, ""])}
										placeholder="Enter your email address"
										className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
									/>
									<motion.button
										type="submit"
										whileHover="hover"
										whileTap="tap"
										variants={buttonVariants}
										disabled={email[0] === ""}
										className={`px-8 disabled:cursor-not-allowed cursor-pointer py-4 text-amber-500 rounded-lg shadow-lg transition-colors ${
											darkMode
												? "bg-[#1c1e26] border border-[#282b33]"
												: "bg-white hover:bg-gray-100"
										}`}
									>
										Subscribe Now
									</motion.button>
								</form>
								<p className="text-white/60 text-sm mt-4">
									By subscribing, you agree to our Privacy Policy and consent to
									receive updates from our team.
								</p>
							</div>
						</motion.div>
					</div>
				</section>
			</main>

			<footer
				className={`border-t ${
					darkMode
						? "bg-[#13141d] border-[#282b33]"
						: "bg-white border-gray-200"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						<div className="flex flex-col items-center md:items-start">
							<div className="flex items-center space-x-1.5 mb-3">
								<div className="w-2 h-2 bg-amber-500 rounded-full"></div>
								<div className="w-2 h-2 bg-teal-400 rounded-full"></div>
								<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
							</div>
							<h2
								className="text-2xl font-extralight tracking-wider mb-4"
								style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
							>
								MODERN
								<span className="font-bold ml-1">COLLECTIONS</span>
							</h2>
							<p className="text-gray-500 text-center md:text-left mb-6 max-w-xs">
								Elevate your wardrobe with our curated collection of timeless
								pieces. Quality, style, and comfort come together in our
								carefully crafted designs.
							</p>
							<div className="flex space-x-4">
								{[
									{
										name: "Facebook",
										path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
									},
									{
										name: "Instagram",
										path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
									},
									{
										name: "Twitter",
										path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
									},
								].map((social) => (
									<motion.a
										key={social.name}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										href="#"
										className="text-gray-400 hover:text-gray-600 transition-colors"
									>
										<span className="sr-only">{social.name}</span>
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d={social.path}
												clipRule="evenodd"
											/>
										</svg>
									</motion.a>
								))}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-8 md:gap-12">
							<div>
								<h3 className="text-sm font-semibold mb-6">Customer Service</h3>
								<ul className="space-y-5">
									{[
										"Contact Us",
										"Shipping Information",
										"Returns & Exchanges",
										"Order Tracking",
										"FAQ",
									].map((item) => (
										<li key={item}>
											<motion.a
												whileHover={{ x: 5 }}
												href="#"
												className="text-gray-500 hover:text-amber-500 transition-colors"
											>
												{item}
											</motion.a>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h3 className="text-sm font-semibold mb-6">Company</h3>
								<ul className="space-y-5">
									{[
										"About Us",
										"Careers",
										"Sustainability",
										"Press",
										"Blog",
									].map((item) => (
										<li key={item}>
											<motion.a
												whileHover={{ x: 5 }}
												href="#"
												className="text-gray-500 hover:text-amber-500 transition-colors"
											>
												{item}
											</motion.a>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div
							className={`p-6 rounded-lg shadow-md ${
								darkMode
									? "bg-[#1c1e26] border-[#282b33] border"
									: "bg-gray-100"
							}`}
						>
							<h3 className="text-sm font-semibold mb-5">Stay Connected</h3>
							<p className="text-gray-500 mb-4">
								Subscribe to receive exclusive offers, early access to new
								arrivals, and personalized recommendations.
							</p>
							<form onSubmit={handleSubscribe} className="flex flex-col gap-3">
								<input
									type="email"
									value={email[1]}
									required
									onChange={(e) => setEmail(["", e.target.value])}
									placeholder="Enter your email address"
									className={`px-4 py-3  border  rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
										darkMode
											? "bg-[#1c1e26] border-[#282b33]"
											: "bg-white border-gray-300"
									}`}
								/>
								<motion.button
									whileHover="hover"
									type="submit"
									whileTap="tap"
									variants={buttonVariants}
									disabled={email[1] === ""}
									className="px-6 cursor-pointer py-3 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition-colors"
								>
									Subscribe Now
								</motion.button>
							</form>
						</div>
					</div>

					<div
						className={`mt-12 pt-8 border-t ${
							darkMode ? "border-[#282b33]" : "border-gray-200"
						}`}
					>
						<div className="flex flex-col md:flex-row justify-between items-center">
							<p className="text-gray-400 text-sm mb-4 md:mb-0">
								© {new Date().getFullYear()} Modern Collections. All rights
								reserved.
							</p>
							<div className="flex space-x-8">
								<motion.a
									whileHover={{ y: -5 }}
									href="#"
									className="text-gray-400 hover:text-amber-500 transition-colors"
								>
									Privacy Policy
								</motion.a>
								<motion.a
									whileHover={{ y: -5 }}
									href="#"
									className="text-gray-400 hover:text-amber-500 transition-colors"
								>
									Terms of Service
								</motion.a>
								<motion.a
									whileHover={{ y: -5 }}
									href="#"
									className="text-gray-400 hover:text-amber-500 transition-colors"
								>
									Cookie Policy
								</motion.a>
							</div>
						</div>
					</div>
				</div>
			</footer>
			<AnimatePresence>
				{toastMessage && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className={`fixed bottom-4 right-4  px-6 py-3 rounded-lg shadow-lg flex items-center z-50 ${
							darkMode
								? "bg-[#1c1e26] border-[#282b33] border"
								: "bg-amber-500 text-white"
						}`}
					>
						<span className="mr-3">{toastMessage}</span>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => setToastMessage(null)}
							className="ml-2 cursor-pointer text-white transition-colors"
						>
							<X className="w-4 h-4" />
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{orderCompleted && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 sm:px-0"
					>
						<motion.div
							initial={{ y: 20 }}
							animate={{ y: 0 }}
							className={`p-8 rounded-2xl shadow-2xl max-w-md w-full text-center ${
								darkMode ? "bg-[#1c1e26] border border-[#282b33]" : "bg-white"
							}`}
						>
							<motion.div
								initial={{ rotate: 0 }}
								animate={{ rotate: 360 }}
								transition={{ duration: 0.5 }}
								className="w-20 h-20 mx-auto mb-4 relative"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-teal-500 rounded-full opacity-75 animate-pulse"></div>
								<div
									className={`absolute inset-0 rounded-full flex items-center justify-center ${
										darkMode
											? "bg-[#13141d] border-[#282b33] border"
											: "bg-white"
									}`}
								>
									<span className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-teal-500 text-transparent bg-clip-text">
										✓
									</span>
								</div>
							</motion.div>
							<h2
								className="text-2xl font-extrabold mb-3"
								style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
							>
								Order Confirmed!
							</h2>
							<p
								className={`mb-6 ${
									darkMode ? "text-gray-400" : "text-gray-600"
								}`}
							>
								Thank you for your purchase. Your order has been successfully
								processed and will be shipped soon.
							</p>
							<motion.button
								whileHover="hover"
								whileTap="tap"
								variants={buttonVariants}
								onClick={() => setOrderCompleted(false)}
								className="px-8 py-4 cursor-pointer bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-all"
							>
								Continue Shopping
							</motion.button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

interface CategoryFilterProps {
	darkMode: boolean;
	categories: string[];
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({
	darkMode,
	categories,
	selectedCategory,
	onCategoryChange,
}: CategoryFilterProps) => {
	return (
		<div className="space-y-6">
			{categories.map((category) => (
				<motion.div
					key={category}
					whileHover={{ x: 5 }}
					className="relative overflow-hidden"
				>
					<motion.button
						whileHover="hover"
						whileTap="tap"
						variants={buttonVariants}
						onClick={() => onCategoryChange(category)}
						className={`w-full text-left px-6 py-3 rounded-lg transition-all ${
							selectedCategory === category
								? "bg-amber-500 text-white shadow-lg"
								: darkMode
								? "bg-[#1c1e26] border-[#282b33] border"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
					>
						<span className="capitalize">{category}</span>
					</motion.button>
				</motion.div>
			))}
		</div>
	);
};

interface CartModalProps {
	darkMode: boolean;
	onClose: () => void;
	cartItems: CartItem[];
	onUpdateQuantity: (productId: number, quantity: number) => void;
	onRemoveFromCart: (productId: number) => void;
	onCheckout: () => void;
}

const CartModal = ({
	darkMode,
	onClose,
	cartItems,
	onUpdateQuantity,
	onRemoveFromCart,
	onCheckout,
}: CartModalProps) => {
	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.product.price * item.quantity,
		0
	);
	const shipping = 5.0;
	const total = subtotal + shipping;
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="h-full flex flex-col"
		>
			<header
				className={`px-6 py-4 border-b ${
					darkMode ? "border-[#282b33]" : "border-gray-200"
				}`}
			>
				<div className="flex justify-between items-center">
					<h2
						className="text-xl font-bold"
						style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
					>
						Shopping Cart
					</h2>
					<motion.button
						whileHover="hover"
						whileTap="tap"
						variants={buttonVariants}
						onClick={onClose}
						className={`cursor-pointer p-2 transition-colors ${
							darkMode ? "" : "text-gray-600 hover:text-gray-900"
						}`}
					>
						<X className="w-5 h-5" />
					</motion.button>
				</div>
			</header>

			<div className="flex-1 overflow-y-auto p-6">
				{cartItems.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="h-full flex flex-col items-center justify-center"
					>
						<ShoppingCart
							className={`w-12 h-12 mb-4 ${darkMode ? "" : "text-gray-400"}`}
						/>
						<p>Your cart is empty</p>
						<motion.button
							whileHover="hover"
							whileTap="tap"
							variants={buttonVariants}
							onClick={onClose}
							className="mt-4 cursor-pointer px-6 py-3 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition-colors"
						>
							Continue Shopping
						</motion.button>
					</motion.div>
				) : (
					<motion.ul
						initial="hidden"
						animate="show"
						variants={container}
						className="space-y-6"
					>
						{cartItems.map((item) => (
							<motion.li
								key={item.product.id}
								variants={{
									hidden: { opacity: 0, y: 10 },
									show: { opacity: 1, y: 0, transition: { type: "spring" } },
								}}
								className={`flex items-center justify-between p-4 rounded-lg shadow-sm border  ${
									darkMode
										? "bg-[#13141d] border-[#282b33]"
										: "bg-white border-gray-100"
								}`}
							>
								<div className="flex items-center">
									<div className="w-20 h-20 rounded-lg overflow-hidden mr-4">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={item.product.image}
											alt={item.product.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<h3
											className="text-base font-bold"
											style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
										>
											{item.product.name}
										</h3>
										<p className="text-sm font-bold text-amber-500">
											${item.product.price}
										</p>
										<div className="flex items-center mt-2">
											<motion.button
												whileTap={{ scale: 0.9 }}
												onClick={() =>
													onUpdateQuantity(
														item.product.id,
														Math.max(1, item.quantity - 1)
													)
												}
												className={`p-1 rounded-full  hover:bg-gray-200 transition-colors  ${
													darkMode
														? "bg-[#1c1e26] border border-[#282b33]"
														: "bg-gray-100 text-gray-600"
												}`}
											>
												<Minus className="w-3 h-3" />
											</motion.button>
											<span className="mx-3 text-sm font-medium">
												{item.quantity}
											</span>
											<motion.button
												whileTap={{ scale: 0.9 }}
												onClick={() =>
													onUpdateQuantity(item.product.id, item.quantity + 1)
												}
												className={`p-1 rounded-full  hover:bg-gray-200 transition-colors  ${
													darkMode
														? "bg-[#1c1e26] border border-[#282b33]"
														: "bg-gray-100 text-gray-600"
												}`}
											>
												<Plus className="w-3 h-3" />
											</motion.button>
										</div>
									</div>
								</div>
								<div className="flex items-center">
									<p className="text-base font-bold mr-4">
										${(item.product.price * item.quantity).toFixed(2)}
									</p>
									<motion.button
										whileTap={{ scale: 0.9 }}
										onClick={() => onRemoveFromCart(item.product.id)}
										className="p-2 cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
									>
										<Trash2 className="w-4 h-4" />
									</motion.button>
								</div>
							</motion.li>
						))}
					</motion.ul>
				)}
			</div>

			{cartItems.length > 0 && (
				<div
					className={`p-6 border-t  ${
						darkMode
							? "bg-[#13141d] border-[#282b33]"
							: "border-gray-200 bg-gray-50"
					}`}
				>
					<div className="flex justify-between items-center mb-6">
						<span className="text-lg font-medium">Subtotal</span>
						<span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
					</div>

					<div className="flex justify-between items-center mb-6">
						<span className="text-lg font-medium">Shipping</span>
						<span className="text-lg font-bold">${shipping.toFixed(2)}</span>
					</div>

					<div className="flex justify-between items-center mb-6">
						<span className="text-lg font-medium">Total</span>
						<span className="text-xl font-bold text-amber-500">
							${total.toFixed(2)}
						</span>
					</div>

					<motion.button
						whileHover="hover"
						whileTap="tap"
						variants={buttonVariants}
						onClick={onCheckout}
						className="w-full px-6 py-4 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-all"
					>
						Proceed to Checkout
					</motion.button>
				</div>
			)}
		</motion.div>
	);
};

export default Shop;
