"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
	id: string;
	name: string;
	price: number;
	salePrice?: number;
	category: string;
	image: string;
	isNew?: boolean;
	isFeatured?: boolean;
	rating: number;
	description?: string;
	colors?: string[];
	sizes?: string[];
	stock?: number;
};

type Testimonial = {
	id: string;
	name: string;
	image: string;
	comment: string;
	rating: number;
};

type FAQ = {
	id: string;
	question: string;
	answer: string;
};

type CartItem = {
	product: Product;
	quantity: number;
	size?: string;
	color?: string;
};

const products: Product[] = [
	{
		id: "1",
		name: "Winter Jacket",
		price: 199.99,
		salePrice: 149.99,
		category: "outerwear",
		image:
			"https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=687&auto=format&fit=crop",
		isFeatured: true,
		rating: 4.8,
		description:
			"Premium thermal winter jacket with water-resistant exterior and cozy fleece lining. Perfect for extreme cold conditions.",
		colors: ["Black", "Navy", "Forest Green"],
		sizes: ["S", "M", "L", "XL"],
		stock: 15,
	},
	{
		id: "2",
		name: "Wool Scarf",
		price: 49.99,
		salePrice: 39.99,
		category: "accessories",
		image:
			"https://images.unsplash.com/photo-1609803384069-19f3e5a70e75?q=80&w=2977&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		isNew: true,
		rating: 4.5,
		description:
			"Soft, luxurious wool scarf handcrafted from premium materials. Keeps you warm while adding style to any outfit.",
		colors: ["Gray", "Red", "Beige"],
		sizes: ["One Size"],
		stock: 30,
	},
	{
		id: "3",
		name: "Snow Boots",
		price: 129.99,
		salePrice: 99.99,
		category: "footwear",
		image:
			"https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=712&auto=format&fit=crop",
		isFeatured: true,
		rating: 4.9,
		description:
			"Waterproof snow boots with insulated lining and rugged traction soles. Designed for comfort in snowy conditions.",
		colors: ["Black", "Brown", "White"],
		sizes: ["7", "8", "9", "10", "11"],
		stock: 12,
	},
	{
		id: "4",
		name: "Cashmere Sweater",
		price: 89.99,
		category: "clothing",
		image:
			"https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=687&auto=format&fit=crop",
		rating: 4.7,
		description:
			"Luxuriously soft cashmere sweater with ribbed cuffs and hem. A timeless addition to your winter wardrobe.",
		colors: ["Cream", "Navy", "Burgundy"],
		sizes: ["S", "M", "L"],
		stock: 18,
	},
	{
		id: "5",
		name: "Thermal Gloves",
		price: 34.99,
		salePrice: 24.99,
		category: "accessories",
		image:
			"https://plus.unsplash.com/premium_photo-1682123887677-990dc4334cc1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		isNew: true,
		rating: 4.6,
		description:
			"Thermal touchscreen-compatible gloves that keep hands warm while allowing device use. Windproof and water-resistant.",
		colors: ["Black", "Gray"],
		sizes: ["S/M", "L/XL"],
		stock: 25,
	},
	{
		id: "6",
		name: "Knit Beanie",
		price: 29.99,
		category: "accessories",
		image:
			"https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=687&auto=format&fit=crop",
		rating: 4.4,
		description:
			"Classic knit beanie with fold-over design. Made from soft acrylic yarn for warmth and comfort.",
		colors: ["Black", "Gray", "Blue", "Red"],
		sizes: ["One Size"],
		stock: 40,
	},
	{
		id: "7",
		name: "Parka Coat",
		price: 249.99,
		salePrice: 199.99,
		category: "outerwear",
		image:
			"https://images.unsplash.com/photo-1617615068863-b588af542203?q=80&w=3126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		isFeatured: true,
		rating: 4.9,
		description:
			"Premium parka with faux fur hood and multiple pockets. Designed for maximum warmth in extreme conditions.",
		colors: ["Olive", "Navy", "Black"],
		sizes: ["S", "M", "L", "XL", "XXL"],
		stock: 10,
	},
	{
		id: "8",
		name: "Fleece Pullover",
		price: 79.99,
		category: "clothing",
		image:
			"https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=687&auto=format&fit=crop",
		rating: 4.5,
		description:
			"Soft, warm fleece pullover with quarter-zip design. Perfect for layering or as a standalone piece.",
		colors: ["Gray", "Blue", "Black"],
		sizes: ["S", "M", "L", "XL"],
		stock: 22,
	},
];

const testimonials: Testimonial[] = [
	{
		id: "1",
		name: "Sarah Johnson",
		image:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop",
		comment:
			"The Winter Jacket exceeded my expectations. It's warm, stylish, and perfect for harsh winters!",
		rating: 5,
	},
	{
		id: "2",
		name: "Michael Chen",
		image:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop",
		comment:
			"Fast shipping and excellent customer service. The Snow Boots are incredibly comfortable and waterproof.",
		rating: 4.5,
	},
	{
		id: "3",
		name: "Emma Wilson",
		image:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=687&auto=format&fit=crop",
		comment:
			"I love the quality of the Cashmere Sweater! It's so soft and the color is exactly as shown online.",
		rating: 5,
	},
];

const faqs: FAQ[] = [
	{
		id: "1",
		question: "How long does shipping take?",
		answer:
			"Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery.",
	},
	{
		id: "2",
		question: "What is your return policy?",
		answer:
			"We offer a 30-day return policy on all unworn items with original tags and packaging.",
	},
	{
		id: "3",
		question: "Are the products true to size?",
		answer:
			"Yes, our products are true to size. Please refer to our size guide for specific measurements.",
	},
	{
		id: "4",
		question: "Do you ship internationally?",
		answer:
			"Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days.",
	},
];

const DecorativeCircle = ({ className }: { className: string }) => (
	<div className={`absolute rounded-full bg-gradient-to-tr ${className}`}></div>
);

const DecorativeDots = ({ className }: { className: string }) => (
	<div className={`absolute ${className}`}>
		{[...Array(12)].map((_, i) => (
			<div
				key={i}
				className="h-1.5 w-1.5 bg-blue-500 rounded-full m-1"
				style={{
					opacity: 0.2 + (i % 3) * 0.2,
					display: "inline-block",
				}}
			></div>
		))}
	</div>
);

const Toast = ({
	message,
	isVisible,
	onClose,
	type = "info",
}: {
	message: string;
	isVisible: boolean;
	onClose: () => void;
	type?: "success" | "error" | "info";
}) => {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				onClose();
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isVisible, onClose]);

	const getBgColor = () => {
		switch (type) {
			case "success":
				return "border-green-600 bg-green-50";
			case "error":
				return "border-red-600 bg-red-50";
			default:
				return "border-blue-600 bg-white";
		}
	};

	const getIcon = () => {
		switch (type) {
			case "success":
				return (
					<div className="bg-green-100 p-2 rounded-full mr-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-green-600"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				);
			case "error":
				return (
					<div className="bg-red-100 p-2 rounded-full mr-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-red-600"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				);
			default:
				return (
					<div className="bg-blue-100 p-2 rounded-full mr-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-blue-600"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				);
		}
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 50 }}
					className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 shadow-xl rounded-lg px-4 py-3 z-50 flex items-center border-l-4 ${getBgColor()}`}
				>
					{getIcon()}
					<p className="text-gray-800 font-medium">{message}</p>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const Stars = ({ rating }: { rating: number }) => {
	const fullStars = Math.floor(rating);
	const halfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

	return (
		<div className="flex">
			{[...Array(fullStars)].map((_, i) => (
				<svg
					key={`full-${i}`}
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 text-yellow-500"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
				</svg>
			))}
			{halfStar && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 text-yellow-500"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
				</svg>
			)}
			{[...Array(emptyStars)].map((_, i) => (
				<svg
					key={`empty-${i}`}
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 text-gray-300"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
				</svg>
			))}
		</div>
	);
};

const ProductCard = ({
	product,
	onViewProduct,
	onAddToCart,
	onAddToWishlist,
}: {
	product: Product;
	onViewProduct: (product: Product) => void;
	onAddToCart: (product: Product) => void;
	onAddToWishlist: (product: Product) => void;
}) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg group relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<DecorativeCircle className="from-blue-100/40 to-blue-200/30 w-20 h-20 -top-5 -left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
			<DecorativeCircle className="from-blue-50/30 to-blue-100/20 w-16 h-16 -bottom-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />

			<div className="relative h-56 overflow-hidden">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
				/>

				<div className="absolute top-2 left-2 flex flex-col space-y-1">
					{product.isNew && (
						<span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md">
							NEW
						</span>
					)}
					{product.salePrice && (
						<span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-md">
							SALE
						</span>
					)}
				</div>

				{product.stock && product.stock < 5 && (
					<div className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-md">
						Only {product.stock} left
					</div>
				)}

				<div
					className={`absolute inset-0 bg-black bg-opacity-20 
          ${isHovered ? "opacity-100" : "opacity-0"} 
          transition-opacity duration-300 flex items-center justify-center`}
				>
					<button
						onClick={() => onViewProduct(product)}
						className="bg-white text-gray-800 p-2 rounded-full mr-2 hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer transform hover:scale-105"
						aria-label={`View ${product.name}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
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
					</button>
					<button
						onClick={() => onAddToCart(product)}
						className="bg-white text-gray-800 p-2 rounded-full mr-2 hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer transform hover:scale-105"
						aria-label={`Add ${product.name} to cart`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
						</svg>
					</button>
					<button
						onClick={() => onAddToWishlist(product)}
						className="bg-white text-gray-800 p-2 rounded-full hover:bg-rose-600 hover:text-white transition-colors duration-200 cursor-pointer transform hover:scale-105"
						aria-label={`Add ${product.name} to wishlist`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div className="p-4 relative">
				<div className="flex justify-between items-start mb-1">
					<h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
					<Stars rating={product.rating} />
				</div>
				<p className="text-gray-600 text-sm mb-3">
					{product.category.charAt(0).toUpperCase() + product.category.slice(1)}
				</p>

				<div className="flex justify-between items-center">
					<div>
						{product.salePrice ? (
							<div className="flex items-center">
								<span className="text-lg font-bold text-blue-700">
									${product.salePrice.toFixed(2)}
								</span>
								<span className="ml-2 text-sm text-gray-500 line-through">
									${product.price.toFixed(2)}
								</span>
							</div>
						) : (
							<span className="text-lg font-bold text-gray-800">
								${product.price.toFixed(2)}
							</span>
						)}
					</div>

					<button
						onClick={() => onAddToCart(product)}
						className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
						aria-label={`Add ${product.name} to cart`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
					</button>
				</div>

				{product.colors && (
					<div className="mt-3 flex items-center">
						<span className="text-xs text-gray-500 mr-2">Colors:</span>
						<div className="flex space-x-1">
							{product.colors.map((color, index) => {
								let bgClass = "bg-gray-300";
								if (color.toLowerCase() === "black") bgClass = "bg-gray-800";
								if (color.toLowerCase() === "white")
									bgClass = "bg-white border border-gray-300";
								if (color.toLowerCase() === "navy") bgClass = "bg-blue-900";
								if (color.toLowerCase() === "gray") bgClass = "bg-gray-400";
								if (color.toLowerCase() === "red") bgClass = "bg-red-600";
								if (color.toLowerCase() === "blue") bgClass = "bg-blue-600";
								if (
									color.toLowerCase() === "green" ||
									color.toLowerCase() === "forest green"
								)
									bgClass = "bg-green-700";
								if (
									color.toLowerCase() === "beige" ||
									color.toLowerCase() === "cream"
								)
									bgClass = "bg-yellow-100";
								if (color.toLowerCase() === "burgundy") bgClass = "bg-red-800";
								if (color.toLowerCase() === "olive") bgClass = "bg-yellow-700";
								if (color.toLowerCase() === "brown") bgClass = "bg-yellow-800";

								return (
									<div
										key={`${product.id}-color-${index}`}
										className={`w-3 h-3 rounded-full ${bgClass}`}
										title={color}
									></div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
};

const ProductModal = ({
	product,
	isOpen,
	onClose,
	onAddToCart,
}: {
	product: Product | null;
	isOpen: boolean;
	onClose: () => void;
	onAddToCart: (
		product: Product,
		quantity: number,
		options: { size?: string; color?: string }
	) => void;
}) => {
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		if (product) {
			setSelectedSize(product.sizes ? product.sizes[0] : "");
			setSelectedColor(product.colors ? product.colors[0] : "");
			setQuantity(1);
		}
	}, [product]);

	if (!product) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 cursor-pointer"
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ type: "spring", damping: 20 }}
						className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row cursor-pointer"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 cursor-pointer"
							onClick={onClose}
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						<div className="md:w-1/2 relative">
							<div className="w-full h-full overflow-hidden bg-gray-100">
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-full object-cover"
								/>
							</div>

							<div className="absolute top-4 left-4 flex flex-col gap-2">
								{product.isNew && (
									<span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
										NEW
									</span>
								)}
								{product.salePrice && (
									<span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
										SALE
									</span>
								)}
							</div>
						</div>

						<div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
							<div>
								<h2 className="text-2xl font-bold text-gray-800 mb-2">
									{product.name}
								</h2>
								<div className="flex items-center gap-2 mb-4">
									<Stars rating={product.rating} />
									<span className="text-sm text-gray-500">
										({product.rating.toFixed(1)})
									</span>
								</div>

								<div className="mb-4">
									{product.salePrice ? (
										<div className="flex items-center">
											<span className="text-2xl font-bold text-blue-700 mr-2">
												${product.salePrice.toFixed(2)}
											</span>
											<span className="text-gray-500 line-through">
												${product.price.toFixed(2)}
											</span>
											<span className="ml-2 bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded">
												Save ${(product.price - product.salePrice).toFixed(2)}
											</span>
										</div>
									) : (
										<span className="text-2xl font-bold text-gray-800">
											${product.price.toFixed(2)}
										</span>
									)}
								</div>

								<p className="text-gray-700 mb-6">{product.description}</p>

								{product.stock && (
									<div className="mb-4">
										<span
											className={`text-sm font-medium ${
												product.stock < 5 ? "text-orange-600" : "text-green-600"
											}`}
										>
											{product.stock < 5
												? `Only ${product.stock} left in stock!`
												: "In Stock"}
										</span>
									</div>
								)}

								{product.colors && product.colors.length > 0 && (
									<div className="mb-4">
										<h3 className="text-sm font-medium text-gray-900 mb-2">
											Color
										</h3>
										<div className="flex space-x-2">
											{product.colors.map((color) => {
												let bgClass = "bg-gray-300";
												if (color.toLowerCase() === "black")
													bgClass = "bg-gray-800";
												if (color.toLowerCase() === "white")
													bgClass = "bg-white border border-gray-300";
												if (color.toLowerCase() === "navy")
													bgClass = "bg-blue-900";
												if (color.toLowerCase() === "gray")
													bgClass = "bg-gray-400";
												if (color.toLowerCase() === "red")
													bgClass = "bg-red-600";
												if (color.toLowerCase() === "blue")
													bgClass = "bg-blue-600";
												if (
													color.toLowerCase() === "green" ||
													color.toLowerCase() === "forest green"
												)
													bgClass = "bg-green-700";
												if (
													color.toLowerCase() === "beige" ||
													color.toLowerCase() === "cream"
												)
													bgClass = "bg-yellow-100";
												if (color.toLowerCase() === "burgundy")
													bgClass = "bg-red-800";
												if (color.toLowerCase() === "olive")
													bgClass = "bg-yellow-700";
												if (color.toLowerCase() === "brown")
													bgClass = "bg-yellow-800";

												return (
													<button
														key={color}
														onClick={() => setSelectedColor(color)}
														className={`relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
															selectedColor === color
																? "ring-2 ring-offset-2 ring-blue-500"
																: ""
														}`}
														title={color}
													>
														<span
															className={`w-7 h-7 rounded-full ${bgClass}`}
														></span>
													</button>
												);
											})}
										</div>
									</div>
								)}

								{product.sizes && product.sizes.length > 0 && (
									<div className="mb-6">
										<h3 className="text-sm font-medium text-gray-900 mb-2">
											Size
										</h3>
										<div className="flex flex-wrap gap-2">
											{product.sizes.map((size) => (
												<button
													key={size}
													onClick={() => setSelectedSize(size)}
													className={`px-3 py-1 border text-sm font-medium rounded-md cursor-pointer ${
														selectedSize === size
															? "bg-blue-600 text-white border-blue-600"
															: "border-gray-300 text-gray-700 hover:border-blue-400"
													}`}
												>
													{size}
												</button>
											))}
										</div>
									</div>
								)}

								<div className="mb-6">
									<h3 className="text-sm font-medium text-gray-900 mb-2">
										Quantity
									</h3>
									<div className="flex items-center">
										<button
											onClick={() => setQuantity(Math.max(1, quantity - 1))}
											className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100 cursor-pointer"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 12H4"
												/>
											</svg>
										</button>
										<input
											type="number"
											min="1"
											max={product.stock || 99}
											value={quantity}
											onChange={(e) => {
												const val = parseInt(e.target.value);
												if (
													!isNaN(val) &&
													val > 0 &&
													val <= (product.stock || 99)
												) {
													setQuantity(val);
												}
											}}
											className="w-12 text-center border-t border-b border-gray-300 py-2 focus:outline-none"
										/>
										<button
											onClick={() =>
												setQuantity(Math.min(product.stock || 99, quantity + 1))
											}
											className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100 cursor-pointer"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 6v6m0 0v6m0-6h6m-6 0H6"
												/>
											</svg>
										</button>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-2 mt-2">
									<button
										onClick={() => {
											onAddToCart(product, quantity, {
												size: selectedSize,
												color: selectedColor,
											});
											onClose();
										}}
										className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
										</svg>
										Add to Cart
									</button>
									<button
										onClick={onClose}
										className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
									>
										Continue Shopping
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const CartModal = ({
	isOpen,
	onClose,
	cartItems,
	onUpdateQuantity,
	onRemoveItem,
}: {
	isOpen: boolean;
	onClose: () => void;
	cartItems: CartItem[];
	onUpdateQuantity: (index: number, newQuantity: number) => void;
	onRemoveItem: (index: number) => void;
}) => {
	const subtotal = cartItems.reduce(
		(total, item) =>
			total + (item.product.salePrice || item.product.price) * item.quantity,
		0
	);

	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-black bg-opacity-50 z-40"
						onClick={onClose}
						aria-hidden="true"
					/>

					<div className="fixed inset-0 z-50 overflow-y-auto pt-16 pb-6 px-4 flex items-center justify-center">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ type: "spring", damping: 25 }}
							className="relative bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md flex flex-col"
							style={{ maxHeight: "calc(100vh - 140px)" }}
							ref={modalRef}
							onClick={(e) => e.stopPropagation()}
							role="dialog"
							aria-modal="true"
							aria-labelledby="cart-modal-title"
						>
							<div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white z-10">
								<h2
									id="cart-modal-title"
									className="text-xl font-bold text-gray-800"
								>
									Your Cart ({cartItems.length})
								</h2>
								<button
									onClick={onClose}
									className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
									aria-label="Close cart"
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="overflow-y-auto flex-grow">
								{cartItems.length === 0 ? (
									<div className="text-center py-8 px-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-12 w-12 mx-auto text-gray-400 mb-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
											/>
										</svg>
										<p className="text-gray-600 mb-4">Your cart is empty</p>
										<button
											onClick={onClose}
											className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
										>
											Continue Shopping
										</button>
									</div>
								) : (
									<div className="p-4 space-y-4">
										{cartItems.map((item, index) => (
											<div
												key={`${item.product.id}-${index}`}
												className="flex border-b border-gray-200 pb-4"
											>
												<div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
													<img
														src={item.product.image}
														alt={item.product.name}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="ml-3 flex-grow min-w-0">
													<div className="flex justify-between">
														<h3 className="text-gray-800 font-medium truncate pr-2">
															{item.product.name}
														</h3>
														<button
															onClick={() => onRemoveItem(index)}
															className="text-gray-400 hover:text-gray-600 flex-shrink-0"
															aria-label={`Remove ${item.product.name} from cart`}
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
																	d="M6 18L18 6M6 6l12 12"
																/>
															</svg>
														</button>
													</div>

													<div className="flex flex-wrap text-sm text-gray-500 gap-x-2">
														{item.size && <p>Size: {item.size}</p>}
														{item.color && <p>Color: {item.color}</p>}
													</div>

													<div className="flex justify-between items-center mt-2">
														<div className="flex items-center border border-gray-300 rounded-md">
															<button
																onClick={() =>
																	onUpdateQuantity(
																		index,
																		Math.max(1, item.quantity - 1)
																	)
																}
																className="px-2 py-1 text-gray-600 hover:bg-gray-100"
																aria-label="Decrease quantity"
															>
																-
															</button>
															<span className="px-2 py-1 text-sm">
																{item.quantity}
															</span>
															<button
																onClick={() =>
																	onUpdateQuantity(index, item.quantity + 1)
																}
																className="px-2 py-1 text-gray-600 hover:bg-gray-100"
																aria-label="Increase quantity"
															>
																+
															</button>
														</div>
														<p className="font-medium text-gray-800">
															$
															{(
																(item.product.salePrice || item.product.price) *
																item.quantity
															).toFixed(2)}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{cartItems.length > 0 && (
								<div className="border-t border-gray-200 p-4 bg-gray-50">
									<div className="flex justify-between mb-2">
										<span className="text-gray-600">Subtotal</span>
										<span className="font-medium">${subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between mb-2">
										<span className="text-gray-600">Shipping</span>
										<span className="font-medium">Calculated at checkout</span>
									</div>
									<div className="flex justify-between mb-4 border-t border-gray-200 pt-2 mt-2">
										<span className="text-lg font-medium">Total</span>
										<span className="text-lg font-bold">
											${subtotal.toFixed(2)}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										<button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200">
											Checkout
										</button>
										<button
											onClick={onClose}
											className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200"
										>
											Continue Shopping
										</button>
									</div>
								</div>
							)}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};

const TestimonialCard = ({
	testimonial,
	isActive,
	index,
	activeIndex,
}: {
	testimonial: Testimonial;
	isActive: boolean;
	index: number;
	activeIndex: number;
}) => {
	return (
		<motion.div
			key={testimonial.id}
			className="testimonial-card absolute w-full"
			initial={{ opacity: 0 }}
			animate={{
				opacity: isActive ? 1 : 0,
				x: `${(index - activeIndex) * 100}%`,
				scale: isActive ? 1 : 0.9,
			}}
			transition={{ duration: 0.5 }}
			style={{
				display: Math.abs(index - activeIndex) <= 1 ? "block" : "none",
			}}
		>
			<div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mx-4 md:mx-auto max-w-2xl border border-blue-100 relative overflow-hidden">
				<DecorativeCircle className="from-blue-50 to-blue-100 w-32 h-32 -top-16 -right-16 opacity-30" />
				<DecorativeCircle className="from-blue-50 to-blue-100 w-24 h-24 -bottom-12 -left-12 opacity-30" />
				<DecorativeDots className="top-6 right-6" />

				<div className="flex flex-col sm:flex-row items-center mb-6 relative z-10">
					<img
						src={testimonial.image}
						alt={testimonial.name}
						className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 mb-4 sm:mb-0"
					/>
					<div className="ml-0 sm:ml-4 text-center sm:text-left">
						<h3 className="text-xl font-medium text-gray-800 mb-1">
							{testimonial.name}
						</h3>
						<Stars rating={testimonial.rating} />
					</div>
				</div>
				<div className="relative z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-12 w-12 text-blue-100 absolute top-0 left-0 -mt-4 -ml-2 z-0"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M6.625 2.625A3.375 3.375 0 0010 6v1.5c0 .621-.504 1.125-1.125 1.125H8.25v.563c0 .823.666 1.488 1.488 1.488h.984c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H8.25A3.375 3.375 0 014.875 14.5v-3.375c0-.621.504-1.125 1.125-1.125H6v-.563A3.375 3.375 0 016.625 2.625zM15.375 2.625A3.375 3.375 0 0118.75 6v1.5c0 .621-.504 1.125-1.125 1.125h-.625v.563c0 .823.666 1.488 1.488 1.488h.984c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H17A3.375 3.375 0 0113.625 14.5v-3.375c0-.621.504-1.125 1.125-1.125h.625v-.563a3.375 3.375 0 010-6.813z" />
					</svg>
					<p className="text-gray-700 italic text-lg relative z-10 pl-4">
						"{testimonial.comment}"
					</p>
				</div>
			</div>
		</motion.div>
	);
};

const AnimatedBanner = () => {
	return (
		<div className="relative overflow-hidden bg-blue-600 py-2">
			<div className="animate-marquee whitespace-nowrap">
				<span className="mx-4 text-white font-medium">
					🔥 Flash Sale - Up to 50% Off
				</span>
				<span className="mx-4 text-white font-medium">
					⚡ Free Shipping on Orders Over $75
				</span>
				<span className="mx-4 text-white font-medium">
					🎁 Buy One Get One 50% Off Accessories
				</span>
				<span className="mx-4 text-white font-medium">
					❄️ New Winter Collection Now Available
				</span>
				<span className="mx-4 text-white font-medium">
					🔥 Flash Sale - Up to 50% Off
				</span>
			</div>
		</div>
	);
};

const EnhancedNewsletter = () => {
	const [email, setEmail] = useState("");
	const [preference, setPreference] = useState("all");
	const [subscribed, setSubscribed] = useState(false);
	const [error, setError] = useState("");

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		setSubscribed(true);
		setError("");
	};

	if (subscribed) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="max-w-2xl mx-auto text-center"
			>
				<div className="bg-white rounded-lg p-8 shadow-lg">
					<div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h3 className="text-2xl font-bold text-gray-800 mb-2">
						Thanks for subscribing!
					</h3>
					<p className="text-gray-600 mb-6">
						You've been added to our mailing list. Get ready for exclusive deals
						and updates!
					</p>
					<button
						onClick={() => setSubscribed(false)}
						className="px-4 py-2 text-blue-600 underline"
					>
						Return to subscription form
					</button>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="bg-white rounded-lg p-6 md:p-8 shadow-lg relative overflow-hidden">
				<DecorativeCircle className="from-blue-100 to-blue-200 w-32 h-32 -top-10 -right-10 opacity-40" />
				<DecorativeCircle className="from-blue-100 to-blue-200 w-32 h-32 -bottom-10 -left-10 opacity-30" />
				<DecorativeDots className="bottom-6 right-6" />

				<div className="text-center mb-6 relative z-10">
					<h2 className="text-3xl font-bold text-gray-800 mb-2">
						Stay Connected
					</h2>
					<p className="text-gray-600">
						Subscribe to receive exclusive offers, early access to new products,
						and personalized recommendations.
					</p>
				</div>

				<form onSubmit={handleSubscribe} className="relative z-10">
					<div className="mb-4">
						<input
							type="email"
							placeholder="Your email address"
							className={`w-full px-4 py-3 rounded-lg border text-black ${
								error ? "border-red-500" : "border-gray-300"
							} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (error) setError("");
							}}
							required
						/>
						{error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
					</div>

					<div className="mb-6">
						<p className="text-sm text-gray-600 mb-2">I'm interested in:</p>
						<div className="flex flex-wrap gap-2">
							{[
								"All Products",
								"New Arrivals",
								"Sales & Promotions",
								"Seasonal Collections",
							].map((option) => {
								const value = option.toLowerCase().replace(/\s+/g, "_");
								return (
									<label
										key={value}
										className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
											preference === value ||
											(value === "all_products" && preference === "all")
												? "bg-blue-600 text-white"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
									>
										<input
											type="radio"
											name="preference"
											value={value === "all_products" ? "all" : value}
											checked={
												preference === value ||
												(value === "all_products" && preference === "all")
											}
											onChange={(e) => setPreference(e.target.value)}
											className="sr-only"
										/>
										{option}
									</label>
								);
							})}
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 hover:shadow-lg transform hover:translate-y-0.5 flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
						</svg>
						Subscribe
					</button>

					<p className="text-xs text-gray-500 text-center mt-4">
						By subscribing, you agree to our Privacy Policy and consent to
						receive marketing communications. You can unsubscribe at any time.
					</p>
				</form>
			</div>
		</div>
	);
};

const StorefrontPage = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [toastMessage, setToastMessage] = useState<string>("");
	const [toastType, setToastType] = useState<"success" | "error" | "info">(
		"info"
	);
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
	const [timeLeft, setTimeLeft] = useState({
		hours: 5,
		minutes: 30,
		seconds: 0,
	});
	const [expandedFAQs, setExpandedFAQs] = useState<{ [key: string]: boolean }>(
		{}
	);
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
	const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
	const [isNavbarSticky, setIsNavbarSticky] = useState(false);
	const [productModalOpen, setProductModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
	const [sortOption, setSortOption] = useState("featured");

	const navbarRef = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLDivElement>(null);

	const categories = [
		"all",
		...Array.from(new Set(products.map((p) => p.category))),
	];

	const sortProducts = (productsToSort: Product[]) => {
		let sorted = [...productsToSort];

		switch (sortOption) {
			case "price-low":
				sorted.sort(
					(a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
				);
				break;
			case "price-high":
				sorted.sort(
					(a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
				);
				break;
			case "newest":
				sorted = sorted
					.filter((p) => p.isNew)
					.concat(sorted.filter((p) => !p.isNew));
				break;
			case "rating":
				sorted.sort((a, b) => b.rating - a.rating);
				break;
			case "featured":
			default:
				sorted = sorted
					.filter((p) => p.isFeatured)
					.concat(sorted.filter((p) => !p.isFeatured));
				break;
		}

		return sorted;
	};

	const filteredProducts = sortProducts(
		products.filter((product) => {
			const matchesCategory =
				selectedCategory === "all" || product.category === selectedCategory;
			const matchesSearch = product.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		})
	);

	const handleViewProduct = (product: Product) => {
		setSelectedProduct(product);
		setProductModalOpen(true);

		if (!recentlyViewed.some((p) => p.id === product.id)) {
			const updatedRecentlyViewed = [product, ...recentlyViewed].slice(0, 4);
			setRecentlyViewed(updatedRecentlyViewed);

			localStorage.setItem(
				"recentlyViewed",
				JSON.stringify(updatedRecentlyViewed)
			);
		}
	};

	const handleAddToCart = (
		product: Product,
		quantity: number = 1,
		options: { size?: string; color?: string } = {}
	) => {
		const newItem: CartItem = {
			product,
			quantity,
			...options,
		};

		setCartItems((prev) => [...prev, newItem]);
		showToastMessage(`${product.name} added to cart!`, "success");
	};

	const handleAddToWishlist = (product: Product) => {
		if (!wishlistItems.some((p) => p.id === product.id)) {
			setWishlistItems((prev) => [...prev, product]);
			showToastMessage(`${product.name} added to wishlist!`, "success");
		} else {
			showToastMessage(`${product.name} is already in your wishlist`, "info");
		}
	};

	const handleUpdateCartQuantity = (index: number, newQuantity: number) => {
		setCartItems((prev) =>
			prev.map((item, i) =>
				i === index ? { ...item, quantity: newQuantity } : item
			)
		);
	};

	const handleRemoveCartItem = (index: number) => {
		setCartItems((prev) => prev.filter((_, i) => i !== index));
	};

	const showToastMessage = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		setToastMessage(message);
		setToastType(type);
		setShowToast(true);
	};

	const toggleFAQ = (id: string) => {
		setExpandedFAQs((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const handleDefaultAction = (action: string) => {
		showToastMessage(`${action} action clicked`);
	};

	const closeToast = () => {
		setShowToast(false);
	};

	const goToPrevTestimonial = () => {
		setActiveTestimonialIndex((prev) =>
			prev === 0 ? testimonials.length - 1 : prev - 1
		);
	};

	const goToNextTestimonial = () => {
		setActiveTestimonialIndex((prev) =>
			prev === testimonials.length - 1 ? 0 : prev + 1
		);
	};

	useEffect(() => {
		const savedRecentlyViewed = localStorage.getItem("recentlyViewed");
		if (savedRecentlyViewed) {
			try {
				const parsed = JSON.parse(savedRecentlyViewed);
				setRecentlyViewed(parsed);
			} catch (error) {
				console.error("Error parsing recently viewed products", error);
			}
		}
	}, []);

	useEffect(() => {
		const countdown = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) {
					return { ...prev, seconds: prev.seconds - 1 };
				} else if (prev.minutes > 0) {
					return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
				} else if (prev.hours > 0) {
					return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
				} else {
					clearInterval(countdown);
					return { hours: 24, minutes: 0, seconds: 0 };
				}
			});
		}, 1000);

		return () => clearInterval(countdown);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
		}, 7000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 100) {
				setIsNavbarSticky(true);
				if (mainRef.current && navbarRef.current) {
					mainRef.current.style.paddingTop = `${navbarRef.current.offsetHeight}px`;
				}
			} else {
				setIsNavbarSticky(false);
				if (mainRef.current) {
					mainRef.current.style.paddingTop = "0";
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
			<AnimatedBanner />

			<header
				ref={navbarRef}
				className={`bg-white shadow-md z-50 transition-all duration-300 ${
					isNavbarSticky ? "fixed top-0 left-0 right-0 shadow-lg" : ""
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center">
							<a
								href="#"
								className="flex items-center"
								onClick={(e) => {
									e.preventDefault();
									handleDefaultAction("Home");
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-blue-600"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
										clipRule="evenodd"
									/>
									<path d="M10 4a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
								</svg>
								<span className="ml-2 text-xl font-bold text-blue-600">
									WinterChill
								</span>
							</a>
						</div>

						<nav className="hidden md:flex space-x-8">
							{["Home", "Shop", "Sale", "About", "Contact"].map((item) => (
								<a
									key={item}
									href="#"
									className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
									onClick={(e) => {
										e.preventDefault();
										handleDefaultAction(item);
									}}
								>
									{item}
									<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
								</a>
							))}
						</nav>

						<div className="flex items-center space-x-4">
							<div className="relative hidden md:block">
								<input
									type="text"
									placeholder="Search products..."
									className="pl-8 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-40 lg:w-64 transition-all duration-200"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 text-gray-500 absolute left-3 top-2.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>

							<button
								className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 relative hidden md:block"
								onClick={() => handleDefaultAction("Wishlist")}
								aria-label="View wishlist"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
								{wishlistItems.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
										{wishlistItems.length}
									</span>
								)}
							</button>

							<button
								className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 relative"
								onClick={() => setCartDrawerOpen(true)}
								aria-label="View cart"
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
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
								{cartItems.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
										{cartItems.length}
									</span>
								)}
							</button>

							<button
								className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 hidden md:block"
								onClick={() => handleDefaultAction("Account")}
								aria-label="My account"
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
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</button>

							<button
								className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								aria-label="Toggle menu"
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
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>
					</div>

					<AnimatePresence>
						{mobileMenuOpen && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="md:hidden py-2"
							>
								<div className="flex flex-col space-y-3 pb-3">
									{["Home", "Shop", "Sale", "About", "Contact"].map((item) => (
										<a
											key={item}
											href="#"
											className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50"
											onClick={(e) => {
												e.preventDefault();
												setMobileMenuOpen(false);
												handleDefaultAction(item);
											}}
										>
											{item}
										</a>
									))}
									<div className="relative px-3 py-2">
										<input
											type="text"
											placeholder="Search products..."
											className="w-full pl-8 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
										/>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 text-gray-500 absolute left-6 top-4.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</header>

			<main ref={mainRef}>
				<section className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 py-8 md:py-16 relative overflow-hidden">
					<DecorativeCircle className="from-blue-200/30 to-blue-300/20 w-64 h-64 -bottom-32 -right-32" />
					<DecorativeCircle className="from-blue-200/30 to-blue-300/20 w-48 h-48 top-8 -left-24" />

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
						<div className="flex flex-col md:flex-row items-center">
							<div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
								>
									<span className="inline-block bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-3">
										LIMITED TIME OFFER
									</span>
									<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
										Winter Flash Sale
									</h1>
									<p className="text-lg text-gray-700 mb-6 md:pr-10">
										Get up to 50% off on our premium winter collection. Limited
										time offer - don't miss out!
									</p>

									<div className="bg-white p-4 rounded-lg shadow-md inline-flex items-center space-x-3 mb-6">
										<div className="text-center">
											<div className="text-xl font-bold text-gray-800">
												{timeLeft.hours.toString().padStart(2, "0")}
											</div>
											<div className="text-xs text-gray-500">Hours</div>
										</div>
										<div className="text-2xl font-bold text-gray-400">:</div>
										<div className="text-center">
											<div className="text-xl font-bold text-gray-800">
												{timeLeft.minutes.toString().padStart(2, "0")}
											</div>
											<div className="text-xs text-gray-500">Minutes</div>
										</div>
										<div className="text-2xl font-bold text-gray-400">:</div>
										<div className="text-center">
											<div className="text-xl font-bold text-gray-800">
												{timeLeft.seconds.toString().padStart(2, "0")}
											</div>
											<div className="text-xs text-gray-500">Seconds</div>
										</div>
									</div>

									<button
										className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer flex items-center"
										onClick={() => {
											setSelectedCategory("all");
											const shopSection =
												document.getElementById("shop-section");
											if (shopSection) {
												shopSection.scrollIntoView({ behavior: "smooth" });
											}
										}}
									>
										Shop Now
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 ml-2"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
								</motion.div>
							</div>

							<div className="md:w-1/2">
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5, delay: 0.2 }}
									className="relative"
								>
									<img
										src="https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=1974&auto=format&fit=crop"
										alt="Winter Collection"
										className="rounded-lg shadow-lg w-full h-80 md:h-96 object-cover"
									/>
									<div className="absolute top-4 right-4 bg-rose-600 text-white px-4 py-2 rounded-lg text-lg font-bold animate-pulse shadow-md">
										SALE
									</div>
								</motion.div>
							</div>
						</div>
					</div>
				</section>

				<section
					id="shop-section"
					className="py-6 bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm"
				>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-0">
							<h2 className="text-xl font-semibold text-gray-800 mb-3 md:mb-0">
								Shop By Category
							</h2>
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<button
										key={category}
										onClick={() => setSelectedCategory(category)}
										className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
											selectedCategory === category
												? "bg-blue-600 text-white shadow-md"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										} cursor-pointer`}
									>
										{category.charAt(0).toUpperCase() + category.slice(1)}
									</button>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="py-4 bg-gray-50 border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex flex-col sm:flex-row justify-between items-center">
							<p className="text-gray-500 mb-3 sm:mb-0">
								Showing {filteredProducts.length} products
							</p>

							<div className="flex items-center">
								<label htmlFor="sort" className="text-gray-700 mr-2 text-sm">
									Sort by:
								</label>
								<select
									id="sort"
									value={sortOption}
									onChange={(e) => setSortOption(e.target.value)}
									className="bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="featured">Featured</option>
									<option value="newest">Newest</option>
									<option value="rating">Best Rating</option>
									<option value="price-low">Price: Low to High</option>
									<option value="price-high">Price: High to Low</option>
								</select>
							</div>
						</div>
					</div>
				</section>

				<section className="py-12 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
							<span className="mr-2">Featured Products</span>
							{selectedCategory !== "all" && (
								<span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
									{selectedCategory.charAt(0).toUpperCase() +
										selectedCategory.slice(1)}
								</span>
							)}
						</h2>

						{filteredProducts.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{filteredProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										onViewProduct={handleViewProduct}
										onAddToCart={handleAddToCart}
										onAddToWishlist={handleAddToWishlist}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-16 bg-white rounded-lg shadow-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-16 w-16 text-gray-400 mx-auto mb-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<h3 className="text-xl font-medium text-gray-700 mb-2">
									No products found
								</h3>
								<p className="text-gray-600 mb-6">
									Try changing your search or filter criteria
								</p>
								<button
									onClick={() => {
										setSelectedCategory("all");
										setSearchQuery("");
									}}
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
								>
									Clear Filters
								</button>
							</div>
						)}
					</div>
				</section>

				<section className="py-16 bg-blue-50 overflow-hidden relative">
					<DecorativeCircle className="from-blue-100/50 to-blue-200/30 w-64 h-64 -top-20 -left-20" />
					<DecorativeCircle className="from-blue-100/50 to-blue-200/30 w-48 h-48 -bottom-16 -right-16" />

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
						<div className="text-center mb-12">
							<span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
								TESTIMONIALS
							</span>
							<h2 className="text-3xl font-bold text-gray-800 mb-4">
								What Our Customers Say
							</h2>
							<div className="w-16 h-1 bg-blue-600 mx-auto"></div>
						</div>

						<div className="relative max-w-4xl mx-auto">
							<div className="overflow-hidden h-72 md:h-56">
								<div className="relative h-full">
									{testimonials.map((testimonial, idx) => (
										<TestimonialCard
											key={testimonial.id}
											testimonial={testimonial}
											isActive={idx === activeTestimonialIndex}
											index={idx}
											activeIndex={activeTestimonialIndex}
										/>
									))}
								</div>
							</div>

							<div className="flex items-center justify-between mt-8">
								<button
									onClick={goToPrevTestimonial}
									className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-200"
									aria-label="Previous testimonial"
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
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>

								<div className="flex justify-center space-x-2">
									{testimonials.map((_, idx) => (
										<button
											key={idx}
											onClick={() => setActiveTestimonialIndex(idx)}
											className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
												idx === activeTestimonialIndex
													? "bg-blue-600 w-6"
													: "bg-gray-300"
											}`}
											aria-label={`Go to testimonial ${idx + 1}`}
										/>
									))}
								</div>

								<button
									onClick={goToNextTestimonial}
									className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-200"
									aria-label="Next testimonial"
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
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</section>

				<section className="py-16 bg-white relative overflow-hidden">
					<DecorativeCircle className="from-gray-100 to-gray-200 w-48 h-48 -top-24 -right-24 opacity-50" />
					<DecorativeCircle className="from-gray-100 to-gray-200 w-32 h-32 -bottom-16 -left-16 opacity-50" />

					<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
						<div className="text-center mb-12">
							<span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
								SUPPORT
							</span>
							<h2 className="text-3xl font-bold text-gray-800 mb-4">
								Frequently Asked Questions
							</h2>
							<p className="text-gray-600">Got questions? We've got answers.</p>
						</div>

						<div className="space-y-4">
							{faqs.map((faq) => (
								<div
									key={faq.id}
									className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md relative"
								>
									<button
										className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center cursor-pointer"
										onClick={() => toggleFAQ(faq.id)}
										aria-expanded={expandedFAQs[faq.id] ? "true" : "false"}
										aria-controls={`faq-answer-${faq.id}`}
									>
										<span className="font-medium text-gray-800">
											{faq.question}
										</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
												expandedFAQs[faq.id] ? "transform rotate-180" : ""
											}`}
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</button>

									<AnimatePresence>
										{expandedFAQs[faq.id] && (
											<motion.div
												id={`faq-answer-${faq.id}`}
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="overflow-hidden"
											>
												<div className="px-6 py-4 bg-white border-t border-gray-100">
													<p className="text-gray-700">{faq.answer}</p>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							))}
						</div>
					</div>
				</section>

				{recentlyViewed.length > 0 && (
					<section className="py-12 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
						<DecorativeCircle className="from-gray-200/30 to-gray-300/20 w-40 h-40 -top-20 -right-20" />
						<DecorativeCircle className="from-gray-200/30 to-gray-300/20 w-32 h-32 bottom-10 left-10" />

						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
							<div className="flex justify-between items-center mb-8">
								<h2 className="text-2xl font-bold text-gray-800">
									Recently Viewed
								</h2>
								<button
									onClick={() => {
										setRecentlyViewed([]);
										localStorage.removeItem("recentlyViewed");
										showToastMessage("Recently viewed items cleared", "info");
									}}
									className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 mr-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
									Clear History
								</button>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{recentlyViewed.map((product) => (
									<motion.div
										key={`recent-${product.id}`}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md relative group"
									>
										<DecorativeCircle className="from-blue-100/40 to-blue-200/30 w-16 h-16 -top-5 -left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

										<div className="relative h-40 overflow-hidden">
											<img
												src={product.image}
												alt={product.name}
												className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
											/>
											{product.salePrice && (
												<span className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-md">
													SALE
												</span>
											)}

											<div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
												<button
													onClick={() => handleViewProduct(product)}
													className="bg-white text-gray-800 p-2 rounded-full mr-2 hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer transform hover:scale-105"
													aria-label={`View ${product.name}`}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5"
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
												</button>
												<button
													onClick={() => handleAddToCart(product)}
													className="bg-white text-gray-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer transform hover:scale-105"
													aria-label={`Add ${product.name} to cart`}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
													</svg>
												</button>
											</div>
										</div>

										<div className="p-4">
											<h3 className="text-lg font-medium text-gray-800 mb-1">
												{product.name}
											</h3>

											<div className="flex justify-between items-center">
												{product.salePrice ? (
													<div className="flex items-center">
														<span className="text-lg font-bold text-blue-700">
															${product.salePrice.toFixed(2)}
														</span>
														<span className="ml-2 text-sm text-gray-500 line-through">
															${product.price.toFixed(2)}
														</span>
													</div>
												) : (
													<span className="text-lg font-bold text-gray-800">
														${product.price.toFixed(2)}
													</span>
												)}

												<button
													onClick={() => handleAddToCart(product)}
													className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
													aria-label={`Add ${product.name} to cart`}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth={2}
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M12 6v6m0 0v6m0-6h6m-6 0H6"
														/>
													</svg>
												</button>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</section>
				)}

				<section className="py-16 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white relative overflow-hidden">
					<DecorativeCircle className="from-white/10 to-white/5 w-96 h-96 -top-48 -right-48" />
					<DecorativeCircle className="from-white/10 to-white/5 w-96 h-96 -bottom-48 -left-48" />
					<DecorativeDots className="top-8 right-8 opacity-30" />
					<DecorativeDots className="bottom-8 left-8 opacity-30" />

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
						<EnhancedNewsletter />
					</div>
				</section>
			</main>

			<footer className="bg-gray-900 text-gray-200 relative overflow-hidden">
				<DecorativeCircle className="from-gray-800/50 to-gray-800/30 w-96 h-96 -top-48 -right-48" />

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-blue-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
										clipRule="evenodd"
									/>
									<path d="M10 4a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
								</svg>
								<span className="ml-2 text-xl font-bold text-white">
									WinterChill
								</span>
							</div>
							<p className="text-gray-400 mb-4">
								Quality winter apparel for every adventure.
							</p>
							<div className="flex space-x-4">
								{["facebook", "twitter", "instagram", "youtube"].map(
									(social) => (
										<a
											key={social}
											href="#"
											onClick={(e) => {
												e.preventDefault();
												handleDefaultAction(`${social} social`);
											}}
											className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
											aria-label={social}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
											</svg>
										</a>
									)
								)}
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Shop</h3>
							<ul className="space-y-2">
								{[
									"All Products",
									"New Arrivals",
									"Best Sellers",
									"Discounted",
								].map((item) => (
									<li key={item}>
										<a
											href="#"
											className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
											onClick={(e) => {
												e.preventDefault();
												handleDefaultAction(`${item} page`);
											}}
										>
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Help</h3>
							<ul className="space-y-2">
								{[
									"Contact Us",
									"FAQs",
									"Shipping & Returns",
									"Track Order",
								].map((item) => (
									<li key={item}>
										<a
											href="#"
											className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
											onClick={(e) => {
												e.preventDefault();
												handleDefaultAction(`${item} page`);
											}}
										>
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Contact</h3>
							<ul className="space-y-2 text-gray-400">
								<li className="flex items-start">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2 mt-0.5 text-gray-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
											clipRule="evenodd"
										/>
									</svg>
									<span>
										123 Winter St, Snowville
										<br />
										Arctic, AC 12345
									</span>
								</li>
								<li className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2 text-gray-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
									</svg>
									<span>(123) 456-7890</span>
								</li>
								<li className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2 text-gray-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
									<span>support@winterchill.com</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400 text-sm">
							© 2025 WinterChill. All rights reserved.
						</p>
						<div className="mt-4 md:mt-0 flex space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									handleDefaultAction("Privacy Policy");
								}}
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									handleDefaultAction("Terms of Service");
								}}
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									handleDefaultAction("Cookie Policy");
								}}
							>
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</footer>

			<Toast
				message={toastMessage}
				isVisible={showToast}
				onClose={closeToast}
				type={toastType}
			/>

			<ProductModal
				product={selectedProduct}
				isOpen={productModalOpen}
				onClose={() => setProductModalOpen(false)}
				onAddToCart={handleAddToCart}
			/>

			<CartModal
				isOpen={cartDrawerOpen}
				onClose={() => setCartDrawerOpen(false)}
				cartItems={cartItems}
				onUpdateQuantity={handleUpdateCartQuantity}
				onRemoveItem={handleRemoveCartItem}
			/>

			<div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-2">
				<button
					onClick={() => setCartDrawerOpen(true)}
					className={`p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 relative ${
						cartItems.length > 0 ? "animate-bounce" : ""
					}`}
					aria-label="View cart"
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
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					{cartItems.length > 0 && (
						<span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
							{cartItems.length}
						</span>
					)}
				</button>

				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					className="p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200"
					aria-label="Back to top"
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
				</button>
			</div>

			<style jsx global>{`
				@keyframes marquee {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}
				button,
				a {
					cursor: pointer;
				}
				.animate-marquee {
					display: flex;
					white-space: nowrap;
					animation: marquee 20s linear infinite;
				}

				.sticky-header {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: 50;
					box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
						0 2px 4px -1px rgba(0, 0, 0, 0.06);
				}

				.testimonial-card {
					width: 100%;
					max-width: 100%;
				}

				@media (max-width: 640px) {
					.testimonial-card {
						padding-left: 1rem;
						padding-right: 1rem;
					}
				}
			`}</style>
		</div>
	);
};

export default StorefrontPage;
