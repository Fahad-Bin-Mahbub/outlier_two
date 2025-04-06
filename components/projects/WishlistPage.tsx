"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	FiHeart,
	FiShoppingCart,
	FiShare2,
	FiX,
	FiFilter,
	FiChevronDown,
	FiCheck,
	FiSearch,
	FiInstagram,
	FiTwitter,
	FiMail,
	FiFacebook,
	FiUser,
	FiMenu,
	FiHome,
	FiTag,
	FiGrid,
	FiStar,
	FiClock,
	FiArrowRight,
	FiShieldOff,
	FiArrowUp,
	FiShoppingBag,
	FiCreditCard,
	FiTruck,
	FiPhone,
	FiPlus,
	FiMinus,
	FiChevronRight,
	FiChevronLeft,
	FiTrash2,
	FiInfo,
} from "react-icons/fi";

interface Product {
	id: number;
	name: string;
	category: string;
	price: number;
	popularity: number;
	image: string;
	description: string;
	dateAdded: Date;
	colors?: string[];
	sizes?: string[];
	discount?: number;
	stock?: number;
}

interface SortOption {
	id: string;
	name: string;
	field: keyof Product;
	direction: "asc" | "desc";
}

interface FilterState {
	categories: string[];
	priceRange: [number, number];
	minPopularity: number;
	searchQuery: string;
}

interface CartItem {
	productId: number;
	quantity: number;
	selectedColor?: string;
	selectedSize?: string;
}

const WishlistPage: React.FC = () => {
	const initialProducts: Product[] = [
		{
			id: 1,
			name: "Minimalist Desk Lamp",
			category: "Home Decor",
			price: 79.99,
			popularity: 4.7,
			image:
				"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			description:
				"A sleek, adjustable desk lamp with warm light perfect for your home office.",
			dateAdded: new Date("2024-05-01"),
			colors: ["Black", "White", "Brushed Gold"],
			sizes: [],
			discount: 0,
			stock: 15,
		},
		{
			id: 2,
			name: "Wireless Noise-Cancelling Headphones",
			category: "Electronics",
			price: 249.99,
			popularity: 4.9,
			image:
				"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			description:
				"Premium wireless headphones with active noise cancellation and 30-hour battery life.",
			dateAdded: new Date("2024-05-12"),
			colors: ["Black", "White", "Navy"],
			sizes: [],
			discount: 10,
			stock: 8,
		},
		{
			id: 3,
			name: "Handcrafted Ceramic Mug Set",
			category: "Kitchen",
			price: 39.99,
			popularity: 4.3,
			image:
				"https://plus.unsplash.com/premium_photo-1719609141104-afeaa94f458c?q=80&w=3206&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			description:
				"Set of 4 artisanal ceramic mugs, each with unique glaze patterns.",
			dateAdded: new Date("2024-04-28"),
			colors: ["Mixed"],
			sizes: [],
			discount: 0,
			stock: 20,
		},
		{
			id: 4,
			name: "Organic Cotton Throw Blanket",
			category: "Home Decor",
			price: 59.99,
			popularity: 4.5,
			image:
				"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			description:
				"Soft, eco-friendly blanket made from 100% organic cotton in a classic herringbone pattern.",
			dateAdded: new Date("2024-05-05"),
			colors: ["Beige", "Gray", "Terracotta"],
			sizes: ["Small", "Large"],
			discount: 15,
			stock: 12,
		},
		{
			id: 5,
			name: "Smart Fitness Watch",
			category: "Electronics",
			price: 199.99,
			popularity: 4.8,
			image:
				"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			description:
				"Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.",
			dateAdded: new Date("2024-05-10"),
			colors: ["Black", "Silver", "Rose Gold"],
			sizes: ["S", "M", "L"],
			discount: 5,
			stock: 7,
		},
		{
			id: 6,
			name: "Handmade Leather Wallet",
			category: "Accessories",
			price: 45.99,
			popularity: 4.6,
			image:
				"https://images.unsplash.com/photo-1512358958014-b651a7ee1773?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			description:
				"Slim, full-grain leather wallet with RFID protection and multiple card slots.",
			dateAdded: new Date("2024-04-15"),
			colors: ["Brown", "Black", "Tan"],
			sizes: [],
			discount: 0,
			stock: 25,
		},
		{
			id: 7,
			name: "Stainless Steel Water Bottle",
			category: "Kitchen",
			price: 29.99,
			popularity: 4.4,
			image:
				"https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			description:
				"Double-walled insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
			dateAdded: new Date("2024-05-07"),
			colors: ["Silver", "Black", "Blue", "Red"],
			sizes: ["500ml", "750ml", "1L"],
			discount: 0,
			stock: 30,
		},
		{
			id: 8,
			name: "Natural Scented Candle",
			category: "Home Decor",
			price: 24.99,
			popularity: 4.2,
			image:
				"https://images.unsplash.com/photo-1528351655744-27cc30462816?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			description:
				"Hand-poured soy wax candle with essential oils and a wooden wick.",
			dateAdded: new Date("2024-04-30"),
			colors: ["Vanilla", "Sandalwood", "Lavender", "Cedar"],
			sizes: ["Small", "Medium", "Large"],
			discount: 20,
			stock: 18,
		},

		{
			id: 9,
			name: "Professional Drawing Tablet",
			category: "Electronics",
			price: 389.99,
			popularity: 4.8,
			image:
				"https://images.unsplash.com/photo-1588200618450-3a5b52d856a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			description:
				"High-precision drawing tablet with tilt recognition and 8192 pressure levels.",
			dateAdded: new Date("2024-05-03"),
			colors: ["Black"],
			sizes: ["Medium", "Large"],
			discount: 0,
			stock: 5,
		},
		{
			id: 10,
			name: "Gourmet Coffee Sampler",
			category: "Food & Drink",
			price: 49.99,
			popularity: 4.7,
			image:
				"https://images.unsplash.com/photo-1669296672433-ade3251b78fd?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			description:
				"Collection of premium single-origin coffee beans from around the world.",
			dateAdded: new Date("2024-05-08"),
			colors: [],
			sizes: ["250g", "500g", "1kg"],
			discount: 10,
			stock: 22,
		},
		{
			id: 11,
			name: "Vintage-Inspired Record Player",
			category: "Electronics",
			price: 159.99,
			popularity: 4.5,
			image:
				"https://plus.unsplash.com/premium_photo-1682125816787-4db071ef2da8?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			description:
				"Modern record player with Bluetooth connectivity in a classic design.",
			dateAdded: new Date("2024-05-14"),
			colors: ["Walnut", "Black", "Cherry"],
			sizes: [],
			discount: 0,
			stock: 10,
		},
		{
			id: 12,
			name: "Premium Yoga Mat",
			category: "Fitness",
			price: 69.99,
			popularity: 4.6,
			image:
				"https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			description: "Eco-friendly, non-slip yoga mat with alignment guides.",
			dateAdded: new Date("2024-04-20"),
			colors: ["Purple", "Blue", "Black", "Green"],
			sizes: ["Standard", "Extra Long"],
			discount: 15,
			stock: 14,
		},
	];

	const recentlyViewedProducts: Product[] = [
		initialProducts[9],
		initialProducts[1],
		initialProducts[4],
		initialProducts[11],
	];

	const recommendedProducts: Product[] = [
		initialProducts[10],
		initialProducts[11],
		initialProducts[9],
		initialProducts[0],
	];

	const sortOptions: SortOption[] = [
		{
			id: "newest",
			name: "Newest First",
			field: "dateAdded",
			direction: "desc",
		},
		{
			id: "priceAsc",
			name: "Price: Low to High",
			field: "price",
			direction: "asc",
		},
		{
			id: "priceDesc",
			name: "Price: High to Low",
			field: "price",
			direction: "desc",
		},
		{
			id: "popularity",
			name: "Most Popular",
			field: "popularity",
			direction: "desc",
		},
		{ id: "nameAsc", name: "Name: A-Z", field: "name", direction: "asc" },
	];

	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [filteredProducts, setFilteredProducts] =
		useState<Product[]>(initialProducts);
	const [selectedProducts, setSelectedProducts] = useState<number[]>([
		1, 2, 3, 4, 5, 6, 7, 8,
	]);
	const [cartItems, setCartItems] = useState<CartItem[]>([
		{ productId: 3, quantity: 1 },
		{ productId: 7, quantity: 2, selectedColor: "Black" },
	]);
	const [activeSort, setActiveSort] = useState<SortOption>(sortOptions[0]);
	const [showSortDropdown, setShowSortDropdown] = useState(false);
	const [showFilterPanel, setShowFilterPanel] = useState(false);
	const [showShareOptions, setShowShareOptions] = useState<number | null>(null);
	const [filters, setFilters] = useState<FilterState>({
		categories: [],
		priceRange: [0, 400],
		minPopularity: 0,
		searchQuery: "",
	});
	const [notification, setNotification] = useState<{
		message: string;
		type: "success" | "error" | "info";
	} | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isSmallMobile, setIsSmallMobile] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const [selectedForShare, setSelectedForShare] = useState<Product | null>(
		null
	);
	const [showCartPanel, setShowCartPanel] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showQuickView, setShowQuickView] = useState<Product | null>(null);
	const [selectedColor, setSelectedColor] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [navbarFixed, setNavbarFixed] = useState(false);
	const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
	const [showWishlistOptions, setShowWishlistOptions] = useState(false);
	const [showShareWishlistModal, setShowShareWishlistModal] = useState(false);
	const [activeWishlist, setActiveWishlist] = useState("My Wishlist");
	const [showProductDropdown, setShowProductDropdown] = useState<number | null>(
		null
	);

	const [wishlists, setWishlists] = useState([
		"My Wishlist",
		"Birthday Ideas",
		"Home Office Setup",
	]);

	const categories = Array.from(new Set(products.map((p) => p.category)));

	const sortRef = useRef<HTMLDivElement>(null);
	const filterRef = useRef<HTMLDivElement>(null);
	const shareModalRef = useRef<HTMLDivElement>(null);
	const cartPanelRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const quickViewRef = useRef<HTMLDivElement>(null);
	const wishlistOptionsRef = useRef<HTMLDivElement>(null);
	const shareWishlistModalRef = useRef<HTMLDivElement>(null);
	const productDropdownRefs = useRef<{
		[key: number]: HTMLDivElement | null;
	}>();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
			setIsSmallMobile(window.innerWidth < 480);
			if (window.innerWidth >= 768) {
				setShowFilterPanel(false);
				setShowMobileMenu(false);
			}
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 80) {
				setNavbarFixed(true);
			} else {
				setNavbarFixed(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowNewsletterPopup(true);
		}, 30000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
				setShowSortDropdown(false);
			}
			if (
				shareModalRef.current &&
				!shareModalRef.current.contains(event.target as Node)
			) {
				setShowShareModal(false);
			}
			if (
				shareWishlistModalRef.current &&
				!shareWishlistModalRef.current.contains(event.target as Node)
			) {
				setShowShareWishlistModal(false);
			}
			if (
				cartPanelRef.current &&
				!cartPanelRef.current.contains(event.target as Node) &&
				!(event.target as Element).closest("[data-cart-toggle]")
			) {
				setShowCartPanel(false);
			}
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node) &&
				!(event.target as Element).closest("[data-menu-toggle]")
			) {
				setShowMobileMenu(false);
			}
			if (
				quickViewRef.current &&
				!quickViewRef.current.contains(event.target as Node)
			) {
				setShowQuickView(null);
			}
			if (
				wishlistOptionsRef.current &&
				!wishlistOptionsRef.current.contains(event.target as Node) &&
				!(event.target as Element).closest("[data-wishlist-toggle]")
			) {
				setShowWishlistOptions(false);
			}

			if (showProductDropdown !== null) {
				const dropdownRef = productDropdownRefs.current[showProductDropdown];
				if (
					dropdownRef &&
					!dropdownRef.contains(event.target as Node) &&
					!(event.target as Element).closest(
						`[data-dropdown-toggle="${showProductDropdown}"]`
					)
				) {
					setShowProductDropdown(null);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showProductDropdown]);

	useEffect(() => {
		let result = [...products];

		if (filters.categories.length > 0) {
			result = result.filter((p) => filters.categories.includes(p.category));
		}

		result = result.filter(
			(p) =>
				p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
		);

		result = result.filter((p) => p.popularity >= filters.minPopularity);

		if (filters.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			result = result.filter(
				(p) =>
					p.name.toLowerCase().includes(query) ||
					p.description.toLowerCase().includes(query) ||
					p.category.toLowerCase().includes(query)
			);
		}

		result = result.filter((p) => selectedProducts.includes(p.id));

		result.sort((a, b) => {
			const fieldA = a[activeSort.field];
			const fieldB = b[activeSort.field];

			if (fieldA < fieldB) return activeSort.direction === "asc" ? -1 : 1;
			if (fieldA > fieldB) return activeSort.direction === "asc" ? 1 : -1;
			return 0;
		});

		setFilteredProducts(result);
	}, [products, selectedProducts, filters, activeSort]);

	const calculateCartTotal = () => {
		return cartItems.reduce((total, item) => {
			const product = products.find((p) => p.id === item.productId);
			if (!product) return total;

			let price = product.price;
			if (product.discount) {
				price = price * (1 - product.discount / 100);
			}

			return total + price * item.quantity;
		}, 0);
	};

	const getProductById = (productId: number) => {
		return products.find((p) => p.id === productId);
	};

	const handleAddToCart = (
		productId: number,
		quantity = 1,
		color?: string,
		size?: string
	) => {
		const existingItem = cartItems.find(
			(item) =>
				item.productId === productId &&
				item.selectedColor === (color || undefined) &&
				item.selectedSize === (size || undefined)
		);

		if (existingItem) {
			setCartItems(
				cartItems.map((item) =>
					item.productId === productId &&
					item.selectedColor === (color || undefined) &&
					item.selectedSize === (size || undefined)
						? { ...item, quantity: item.quantity + quantity }
						: item
				)
			);
		} else {
			setCartItems([
				...cartItems,
				{
					productId,
					quantity,
					selectedColor: color || undefined,
					selectedSize: size || undefined,
				},
			]);
		}

		setNotification({
			message: "Added to cart successfully!",
			type: "success",
		});

		setTimeout(() => {
			setNotification(null);
		}, 3000);

		setShowCartPanel(true);
	};

	const updateCartItemQuantity = (index: number, newQuantity: number) => {
		if (newQuantity < 1) return;

		const updatedCart = [...cartItems];
		updatedCart[index].quantity = newQuantity;
		setCartItems(updatedCart);
	};

	const handleRemoveFromCart = (index: number) => {
		setCartItems(cartItems.filter((_, i) => i !== index));

		setNotification({
			message: "Item removed from cart",
			type: "info",
		});

		setTimeout(() => {
			setNotification(null);
		}, 3000);
	};

	const handleRemoveFromWishlist = (productId: number) => {
		setSelectedProducts(selectedProducts.filter((id) => id !== productId));

		setNotification({
			message: "Removed from wishlist",
			type: "info",
		});

		setTimeout(() => {
			setNotification(null);
		}, 3000);
	};

	const moveToWishlist = (productId: number, targetWishlist: string) => {
		setNotification({
			message: `Moved to "${targetWishlist}"`,
			type: "success",
		});

		setTimeout(() => {
			setNotification(null);
		}, 3000);

		setShowProductDropdown(null);
	};

	const handleShareProduct = (product: Product) => {
		setSelectedForShare(product);
		setShowShareModal(true);
		setShowProductDropdown(null);
	};

	const handleShareWishlist = () => {
		setShowShareWishlistModal(true);
	};

	const shareVia = (platform: string) => {
		if (!selectedForShare && !showShareWishlistModal) return;

		const shareUrl = selectedForShare
			? `https://example.com/product/${selectedForShare.id}`
			: `https://example.com/wishlist/${activeWishlist
					.replace(/\s+/g, "-")
					.toLowerCase()}`;

		const shareText = selectedForShare
			? `Check out this ${selectedForShare.name} I found!`
			: `Check out my "${activeWishlist}" wishlist!`;

		let shareLink = "";

		switch (platform) {
			case "facebook":
				shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					shareUrl
				)}`;
				break;
			case "twitter":
				shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
					shareText
				)}&url=${encodeURIComponent(shareUrl)}`;
				break;
			case "instagram":
				alert(
					"Instagram sharing would be implemented with their API in a real app"
				);
				break;
			case "email":
				shareLink = `mailto:?subject=${encodeURIComponent(
					"Check out this " + (selectedForShare ? "product" : "wishlist")
				)}&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
				break;
		}

		if (shareLink) {
			window.open(shareLink, "_blank");
		}

		setShowShareModal(false);
		setShowShareWishlistModal(false);
		setNotification({
			message: `Shared via ${platform}!`,
			type: "success",
		});

		setTimeout(() => {
			setNotification(null);
		}, 3000);
	};

	const toggleCategoryFilter = (category: string) => {
		if (filters.categories.includes(category)) {
			setFilters({
				...filters,
				categories: filters.categories.filter((c) => c !== category),
			});
		} else {
			setFilters({
				...filters,
				categories: [...filters.categories, category],
			});
		}
	};

	const handlePriceRangeChange = (index: number, value: number) => {
		const newPriceRange = [...filters.priceRange] as [number, number];
		newPriceRange[index] = value;
		setFilters({
			...filters,
			priceRange: newPriceRange,
		});
	};

	const clearFilters = () => {
		setFilters({
			categories: [],
			priceRange: [0, 400],
			minPopularity: 0,
			searchQuery: "",
		});
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilters({
			...filters,
			searchQuery: e.target.value,
		});
	};

	const openQuickView = (product: Product) => {
		setShowQuickView(product);
		setSelectedColor(
			product.colors && product.colors.length > 0 ? product.colors[0] : null
		);
		setSelectedSize(
			product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
		);
	};

	const getDiscountedPrice = (product: Product) => {
		if (!product.discount) return product.price;
		return product.price * (1 - product.discount / 100);
	};

	const calculateSavings = (product: Product) => {
		if (!product.discount) return 0;
		return product.price - getDiscountedPrice(product);
	};

	const createNewWishlist = (name: string) => {
		if (name && !wishlists.includes(name)) {
			setWishlists([...wishlists, name]);
			setActiveWishlist(name);
		}
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const toggleProductDropdown = (productId: number) => {
		if (showProductDropdown === productId) {
			setShowProductDropdown(null);
		} else {
			setShowProductDropdown(productId);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-sans">
			{showNewsletterPopup && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
					<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-0 overflow-hidden animate-scale-in">
						<div className="relative h-40 bg-gradient-to-r from-violet-700 to-indigo-700">
							<div className="absolute inset-0 opacity-20">
								<svg
									viewBox="0 0 100 100"
									className="absolute inset-0 w-full h-full"
								>
									<path
										fill="none"
										stroke="white"
										strokeWidth="0.5"
										d="M10,10 L90,10 L90,90 L10,90 L10,10 Z"
									></path>
									<circle
										cx="50"
										cy="50"
										r="30"
										fill="none"
										stroke="white"
										strokeWidth="0.5"
									></circle>
									<circle
										cx="50"
										cy="50"
										r="20"
										fill="none"
										stroke="white"
										strokeWidth="0.5"
									></circle>
									<circle
										cx="50"
										cy="50"
										r="10"
										fill="none"
										stroke="white"
										strokeWidth="0.5"
									></circle>
								</svg>
							</div>
							<div className="absolute inset-0 flex items-center justify-center">
								<h3 className="text-white text-xl sm:text-3xl font-bold tracking-tight px-4 text-center">
									Get 15% Off Your First Order
								</h3>
							</div>
						</div>
						<div className="p-4 sm:p-6">
							<p className="text-slate-700 mb-4 text-sm sm:text-base">
								Subscribe to our newsletter and receive a welcome discount, plus
								updates on new arrivals and special offers.
							</p>
							<div className="flex flex-col sm:flex-row mb-4 gap-2">
								<input
									type="email"
									placeholder="Your email address"
									className="flex-grow px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
								/>
								<button className="bg-violet-700 hover:bg-violet-800 text-white px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg font-medium transition-colors text-sm sm:text-base">
									Subscribe
								</button>
							</div>
							<div className="text-xs text-slate-600 mb-3">
								By subscribing, you agree to our Privacy Policy and consent to
								receive updates from our company.
							</div>
							<button
								onClick={() => setShowNewsletterPopup(false)}
								className="text-xs sm:text-sm text-slate-700 hover:text-violet-700 transition-colors"
							>
								No thanks, I'll pay full price
							</button>
						</div>
						<button
							onClick={() => setShowNewsletterPopup(false)}
							className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
						>
							<FiX className="w-5 h-5" />
						</button>
					</div>
				</div>
			)}

			<div className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white text-center py-2 text-xs sm:text-sm font-medium px-2">
				<span className="hidden xs:inline">
					📦 Free shipping on orders over $75 |{" "}
				</span>
				<span>Use code WELCOME15 for 15% off your first order</span>
			</div>

			<header
				className={`bg-white ${
					navbarFixed
						? "fixed top-0 left-0 right-0 z-30 shadow-md animate-slide-down"
						: "relative z-20 shadow-sm"
				}`}
			>
				<div className="bg-slate-50 py-1 sm:py-2 border-b border-slate-100">
					<div className="max-w-7xl mx-auto px-3 sm:px-6 flex justify-between items-center text-xs text-slate-600">
						<div className="hidden md:flex items-center space-x-4">
							<a href="#" className="hover:text-violet-700 transition-colors">
								Store Locator
							</a>
							<a href="#" className="hover:text-violet-700 transition-colors">
								Customer Service
							</a>
							<a href="#" className="hover:text-violet-700 transition-colors">
								Track Order
							</a>
						</div>
						<div className="flex items-center space-x-3 sm:space-x-4 ml-auto">
							<a href="#" className="hover:text-violet-700 transition-colors">
								Sign In
							</a>
							<span className="text-slate-300">|</span>
							<a href="#" className="hover:text-violet-700 transition-colors">
								Create Account
							</a>
						</div>
					</div>
				</div>

				<div className="px-3 py-3 sm:px-6 sm:py-4">
					<div className="max-w-7xl mx-auto flex justify-between items-center">
						<div className="flex items-center">
							{isMobile && (
								<button
									className="mr-2 text-slate-700"
									onClick={() => setShowMobileMenu(true)}
									data-menu-toggle
								>
									<FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
								</button>
							)}
							<a href="#" className="flex items-center">
								<div className="text-xl sm:text-2xl font-bold text-slate-800">
									<span className="text-violet-700">Vibe</span>Market
								</div>
							</a>
						</div>

						<nav className="hidden md:flex items-center space-x-8">
							<a
								href="#"
								className="font-medium text-slate-700 hover:text-violet-700 transition-colors px-1 py-2"
							>
								Home
							</a>
							<div className="relative group">
								<button className="font-medium text-slate-700 hover:text-violet-700 transition-colors px-1 py-2 flex items-center">
									Shop
									<FiChevronDown className="ml-1 w-4 h-4" />
								</button>
								<div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
									<div className="py-2 mt-2 bg-white rounded-lg shadow-xl border border-slate-100">
										<a
											href="#"
											className="block px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
										>
											Electronics
										</a>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
										>
											Home Decor
										</a>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
										>
											Kitchen
										</a>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
										>
											Accessories
										</a>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
										>
											Food & Drink
										</a>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
										>
											Fitness
										</a>
									</div>
								</div>
							</div>
							<a
								href="#"
								className="font-medium text-slate-700 hover:text-violet-700 transition-colors px-1 py-2"
							>
								New Arrivals
							</a>
							<a
								href="#"
								className="font-medium text-slate-700 hover:text-violet-700 transition-colors px-1 py-2"
							>
								Sale
							</a>
							<a
								href="#"
								className="font-medium text-violet-700 px-1 py-2 border-b-2 border-violet-700"
							>
								My Wishlist
							</a>
						</nav>

						<div className="flex items-center space-x-2 sm:space-x-4">
							<button className="hidden md:block text-slate-700 hover:text-violet-700 transition-colors">
								<FiSearch className="w-5 h-5" />
							</button>
							<button className="hidden md:block text-slate-700 hover:text-violet-700 transition-colors">
								<FiUser className="w-5 h-5" />
							</button>
							<button className="text-violet-700 relative">
								<FiHeart className="w-5 h-5" />
								<span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-600 text-white rounded-full text-xs flex items-center justify-center">
									{selectedProducts.length}
								</span>
							</button>
							<button
								className="relative"
								onClick={() => setShowCartPanel(true)}
								data-cart-toggle
							>
								<FiShoppingCart className="w-5 h-5 text-slate-700" />
								{cartItems.length > 0 && (
									<span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-600 text-white rounded-full text-xs flex items-center justify-center">
										{cartItems.length}
									</span>
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{showMobileMenu && (
				<div
					className="fixed inset-0 z-40 bg-black bg-opacity-50"
					onClick={() => setShowMobileMenu(false)}
				>
					<div
						className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-xl animate-slide-in-left overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
						ref={mobileMenuRef}
					>
						<div className="flex justify-between items-center p-4 border-b">
							<div className="text-xl font-bold text-slate-800">
								<span className="text-violet-700">Vibe</span>Market
							</div>
							<button onClick={() => setShowMobileMenu(false)}>
								<FiX className="w-5 h-5 text-slate-500" />
							</button>
						</div>
						<div className="p-4">
							<div className="mb-6">
								<div className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">
									Account
								</div>
								<div className="space-y-2">
									<a
										href="#"
										className="block py-2 text-sm text-slate-700 hover:text-violet-700 transition-colors"
									>
										Sign In / Register
									</a>
									<a
										href="#"
										className="block py-2 text-sm text-slate-700 hover:text-violet-700 transition-colors"
									>
										My Orders
									</a>
									<a
										href="#"
										className="block py-2 text-sm text-violet-700 font-medium"
									>
										My Wishlist
									</a>
								</div>
							</div>
							<div className="mb-6">
								<div className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">
									Shop By Category
								</div>
								<div className="space-y-2">
									{categories.map((category) => (
										<a
											key={category}
											href="#"
											className="block py-2 text-sm text-slate-700 hover:text-violet-700 transition-colors"
										>
											{category}
										</a>
									))}
								</div>
							</div>
							<div className="mb-6">
								<div className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">
									Customer Service
								</div>
								<div className="space-y-2">
									<a
										href="#"
										className="block py-2 text-sm text-slate-700 hover:text-violet-700 transition-colors"
									>
										Contact Us
									</a>
									<a
										href="#"
										className="block py-2 text-sm text-slate-700 hover:text-violet-700 transition-colors"
									>
										FAQs
									</a>
									<a
										href="#"
										className="block py-2 text-sm text-slate-700 hover:text-violet-700 transition-colors"
									>
										Shipping & Returns
									</a>
								</div>
							</div>
							<div className="pt-4 border-t border-slate-100">
								<div className="flex space-x-3">
									<a
										href="#"
										className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-violet-100 hover:text-violet-700 transition-colors"
									>
										<FiFacebook className="w-4 h-4" />
									</a>
									<a
										href="#"
										className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-violet-100 hover:text-violet-700 transition-colors"
									>
										<FiInstagram className="w-4 h-4" />
									</a>
									<a
										href="#"
										className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-violet-100 hover:text-violet-700 transition-colors"
									>
										<FiTwitter className="w-4 h-4" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{showCartPanel && (
				<div
					className="fixed inset-0 z-40 bg-black bg-opacity-50 animate-fade-in"
					onClick={() => setShowCartPanel(false)}
				>
					<div
						className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl animate-slide-in-right overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
						ref={cartPanelRef}
					>
						<div className="flex justify-between items-center p-4 sm:p-5 border-b">
							<h3 className="font-bold text-base sm:text-lg text-slate-800">
								Your Cart ({cartItems.length})
							</h3>
							<button onClick={() => setShowCartPanel(false)}>
								<FiX className="w-5 h-5 text-slate-500" />
							</button>
						</div>

						{cartItems.length > 0 ? (
							<>
								<div className="p-4 sm:p-5 space-y-4 flex-grow overflow-y-auto max-h-[calc(100vh-250px)]">
									{cartItems.map((item, index) => {
										const product = getProductById(item.productId);
										if (!product) return null;

										const discountedPrice = getDiscountedPrice(product);

										return (
											<div
												key={index}
												className="flex gap-3 sm:gap-4 pb-4 border-b border-slate-100"
											>
												<div className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
													<img
														src={product.image}
														alt={product.name}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="flex-grow min-w-0">
													<h4 className="font-medium text-sm sm:text-base text-slate-800 mb-1 truncate">
														{product.name}
													</h4>
													<div className="flex text-xs sm:text-sm text-slate-600 mb-2 flex-wrap">
														{item.selectedColor && (
															<span className="mr-2">
																Color: {item.selectedColor}
															</span>
														)}
														{item.selectedSize && (
															<span>Size: {item.selectedSize}</span>
														)}
													</div>
													<div className="flex justify-between items-center">
														<div className="flex items-center border rounded-md">
															<button
																onClick={() =>
																	updateCartItemQuantity(
																		index,
																		item.quantity - 1
																	)
																}
																className="px-1.5 sm:px-2 py-1 text-slate-500 hover:text-violet-700"
																disabled={item.quantity <= 1}
															>
																<FiMinus className="w-3 h-3" />
															</button>
															<span className="px-1 sm:px-2 py-1 text-xs sm:text-sm">
																{item.quantity}
															</span>
															<button
																onClick={() =>
																	updateCartItemQuantity(
																		index,
																		item.quantity + 1
																	)
																}
																className="px-1.5 sm:px-2 py-1 text-slate-500 hover:text-violet-700"
															>
																<FiPlus className="w-3 h-3" />
															</button>
														</div>
														<div className="flex flex-col items-end">
															{product.discount ? (
																<>
																	<span className="font-medium text-sm sm:text-base">
																		$
																		{(discountedPrice * item.quantity).toFixed(
																			2
																		)}
																	</span>
																	<span className="text-xs text-slate-500 line-through">
																		$
																		{(product.price * item.quantity).toFixed(2)}
																	</span>
																</>
															) : (
																<span className="font-medium text-sm sm:text-base">
																	${(product.price * item.quantity).toFixed(2)}
																</span>
															)}
														</div>
													</div>
												</div>
												<button
													onClick={() => handleRemoveFromCart(index)}
													className="text-slate-400 hover:text-red-600 transition-colors self-start mt-1"
													aria-label="Remove item"
												>
													<FiTrash2 className="w-4 h-4" />
												</button>
											</div>
										);
									})}
								</div>

								<div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50">
									<div className="space-y-3 mb-4">
										<div className="flex justify-between text-sm">
											<span className="text-slate-700">Subtotal</span>
											<span className="font-medium">
												${calculateCartTotal().toFixed(2)}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-slate-700">Shipping</span>
											<span className="font-medium">
												{calculateCartTotal() > 75 ? (
													<span className="text-green-600">Free</span>
												) : (
													"$4.99"
												)}
											</span>
										</div>
										<div className="flex justify-between font-medium">
											<span>Total</span>
											<span>
												$
												{(
													calculateCartTotal() +
													(calculateCartTotal() > 75 ? 0 : 4.99)
												).toFixed(2)}
											</span>
										</div>
									</div>

									<div className="space-y-3">
										<button className="w-full py-2.5 sm:py-3 bg-violet-700 hover:bg-violet-800 text-white font-medium rounded-lg transition-colors text-sm sm:text-base">
											Checkout Securely
										</button>
										<button
											onClick={() => setShowCartPanel(false)}
											className="w-full py-2.5 sm:py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm sm:text-base"
										>
											Continue Shopping
										</button>
									</div>
								</div>
							</>
						) : (
							<div className="flex flex-col items-center justify-center h-64 p-5">
								<div className="w-14 h-14 sm:w-16 sm:h-16 text-slate-300 mb-4">
									<FiShoppingCart className="w-full h-full" />
								</div>
								<h3 className="font-medium text-base sm:text-lg text-slate-700 mb-2">
									Your cart is empty
								</h3>
								<p className="text-slate-600 text-center mb-4 text-sm sm:text-base">
									Looks like you haven't added any items to your cart yet.
								</p>
								<button
									onClick={() => setShowCartPanel(false)}
									className="px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
								>
									Start Shopping
								</button>
							</div>
						)}
					</div>
				</div>
			)}

			<div className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white">
				<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div>
							<div className="text-xs sm:text-sm mb-2 text-white text-opacity-90">
								<a href="#" className="hover:underline">
									Home
								</a>{" "}
								/ <span className="opacity-90">My Wishlists</span>
							</div>
							<div className="flex items-center">
								<h1 className="text-xl sm:text-3xl font-bold">My Wishlists</h1>
								<div className="relative ml-3" ref={wishlistOptionsRef}>
									<button
										onClick={() => setShowWishlistOptions(!showWishlistOptions)}
										className="text-white opacity-90 hover:opacity-100 transition-opacity"
										data-wishlist-toggle
									>
										<FiChevronDown className="w-5 h-5" />
									</button>

									{showWishlistOptions && (
										<div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 animate-fade-in">
											<div className="py-1">
												{wishlists.map((list) => (
													<button
														key={list}
														className={`w-full px-4 py-2 text-left text-sm ${
															activeWishlist === list
																? "bg-violet-50 text-violet-700 font-medium"
																: "text-slate-700 hover:bg-slate-50"
														}`}
														onClick={() => {
															setActiveWishlist(list);
															setShowWishlistOptions(false);
														}}
													>
														{list}
													</button>
												))}
												<div className="border-t border-slate-100 mt-1 pt-1">
													<button
														className="w-full px-4 py-2 text-left text-sm text-violet-700 hover:bg-violet-50"
														onClick={() => {
															const name = prompt("Enter new wishlist name:");
															if (name) createNewWishlist(name);
															setShowWishlistOptions(false);
														}}
													>
														<FiPlus className="inline-block mr-2" />
														Create New Wishlist
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="mt-4 md:mt-0 flex space-x-2">
							<div className="text-xs sm:text-sm flex items-center bg-white bg-opacity-20 rounded-full px-3 sm:px-4 py-1.5">
								<span className="font-medium mr-1">
									{filteredProducts.length}
								</span>{" "}
								items
							</div>
							<div className="text-xs sm:text-sm flex items-center bg-white bg-opacity-20 rounded-full px-3 sm:px-4 py-1.5">
								<span className="font-medium mr-1">
									${calculateCartTotal().toFixed(2)}
								</span>{" "}
								in cart
							</div>
						</div>
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
					<div className="relative w-full sm:w-auto flex-1 max-w-md">
						<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							placeholder="Search your wishlist..."
							value={filters.searchQuery}
							onChange={handleSearchChange}
							className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
						/>
					</div>

					<div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
						{isMobile && (
							<button
								onClick={() => setShowFilterPanel(!showFilterPanel)}
								className="flex items-center gap-2 py-2 px-3 sm:px-4 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow text-xs sm:text-sm font-medium text-slate-700"
							>
								<FiFilter className="text-violet-600" />
								Filters
							</button>
						)}

						<div className="relative z-10 flex-1 sm:flex-none" ref={sortRef}>
							<button
								onClick={() => setShowSortDropdown(!showSortDropdown)}
								className="flex items-center justify-between gap-2 py-2 px-3 sm:px-4 w-full sm:w-auto rounded-full bg-white shadow-sm hover:shadow-md transition-shadow text-xs sm:text-sm font-medium text-slate-700"
							>
								<span>Sort: {activeSort.name}</span>
								<FiChevronDown
									className={`transform transition-transform ${
										showSortDropdown ? "rotate-180" : ""
									}`}
								/>
							</button>

							{showSortDropdown && (
								<div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-20 animate-fade-in">
									<div className="py-1">
										{sortOptions.map((option) => (
											<button
												key={option.id}
												onClick={() => {
													setActiveSort(option);
													setShowSortDropdown(false);
												}}
												className={`w-full px-4 py-2 text-left text-sm hover:bg-violet-50 flex items-center ${
													activeSort.id === option.id
														? "text-violet-700 font-medium"
														: "text-slate-700"
												}`}
											>
												{activeSort.id === option.id && (
													<FiCheck className="mr-2" />
												)}
												{option.name}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-5 sm:gap-6">
					{(!isMobile || showFilterPanel) && (
						<div
							className={`
                ${
									isMobile
										? "fixed inset-0 z-20 bg-slate-900 bg-opacity-50"
										: "w-64"
								} 
                ${isMobile ? "animate-fade-in" : ""}
              `}
							onClick={isMobile ? () => setShowFilterPanel(false) : undefined}
						>
							<div
								className={`
                  ${
										isMobile
											? "absolute right-0 top-0 bottom-0 w-3/4 max-w-xs"
											: "w-full"
									} 
                  bg-white shadow-md rounded-lg p-4
                  ${isMobile ? "animate-slide-in-right" : ""}
                `}
								onClick={(e) => e.stopPropagation()}
								ref={filterRef}
							>
								<div className="flex items-center justify-between mb-4">
									<h2 className="font-bold text-slate-800">Filters</h2>
									{isMobile && (
										<button
											onClick={() => setShowFilterPanel(false)}
											className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
										>
											<FiX className="text-slate-500" />
										</button>
									)}
								</div>

								<div className="mb-5 sm:mb-6">
									<h3 className="font-medium text-xs sm:text-sm text-slate-600 mb-2">
										Categories
									</h3>
									<div className="space-y-1">
										{categories.map((category) => (
											<label
												key={category}
												className="flex items-center gap-2 cursor-pointer"
											>
												<input
													type="checkbox"
													checked={filters.categories.includes(category)}
													onChange={() => toggleCategoryFilter(category)}
													className="w-4 h-4 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
												/>
												<span className="text-xs sm:text-sm text-slate-700">
													{category}
												</span>
											</label>
										))}
									</div>
								</div>

								<div className="mb-5 sm:mb-6">
									<h3 className="font-medium text-xs sm:text-sm text-slate-600 mb-2">
										Price Range
									</h3>
									<div className="space-y-3">
										<div className="flex justify-between text-xs text-slate-600">
											<span>${filters.priceRange[0]}</span>
											<span>${filters.priceRange[1]}</span>
										</div>
										<div className="relative pt-1">
											<input
												type="range"
												min="0"
												max="400"
												step="10"
												value={filters.priceRange[0]}
												onChange={(e) =>
													handlePriceRangeChange(0, parseInt(e.target.value))
												}
												className="w-full appearance-none h-1 bg-slate-200 rounded outline-none slider-thumb"
											/>
											<input
												type="range"
												min="0"
												max="400"
												step="10"
												value={filters.priceRange[1]}
												onChange={(e) =>
													handlePriceRangeChange(1, parseInt(e.target.value))
												}
												className="w-full appearance-none h-1 bg-slate-200 rounded outline-none slider-thumb"
											/>
										</div>
									</div>
								</div>

								<div className="mb-5 sm:mb-6">
									<h3 className="font-medium text-xs sm:text-sm text-slate-600 mb-2">
										Min. Rating
									</h3>
									<select
										value={filters.minPopularity}
										onChange={(e) =>
											setFilters({
												...filters,
												minPopularity: parseFloat(e.target.value),
											})
										}
										className="w-full p-2 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-700"
									>
										<option value={0}>Any Rating</option>
										<option value={3}>3+ Stars</option>
										<option value={4}>4+ Stars</option>
										<option value={4.5}>4.5+ Stars</option>
									</select>
								</div>

								<div className="mb-5 sm:mb-6">
									<h3 className="font-medium text-xs sm:text-sm text-slate-600 mb-2">
										Date Added
									</h3>
									<select className="w-full p-2 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-700">
										<option>All Time</option>
										<option>Last 7 Days</option>
										<option>Last 30 Days</option>
										<option>Last 90 Days</option>
									</select>
								</div>

								<div className="mb-5 sm:mb-6">
									<h3 className="font-medium text-xs sm:text-sm text-slate-600 mb-2">
										Availability
									</h3>
									<div className="space-y-1">
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												className="w-4 h-4 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
											/>
											<span className="text-xs sm:text-sm text-slate-700">
												In Stock Only
											</span>
										</label>
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												className="w-4 h-4 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
											/>
											<span className="text-xs sm:text-sm text-slate-700">
												On Sale
											</span>
										</label>
									</div>
								</div>

								<button
									onClick={clearFilters}
									className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-md transition"
								>
									Clear All Filters
								</button>
							</div>
						</div>
					)}

					<div className="flex-1">
						<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-5 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
							<h2 className="font-semibold text-base sm:text-lg text-slate-800">
								{activeWishlist}{" "}
								<span className="text-xs sm:text-sm font-normal text-slate-500">
									({filteredProducts.length} items)
								</span>
							</h2>
							<div className="flex flex-wrap gap-2">
								<button
									className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
									onClick={() => {
										filteredProducts.forEach((product) => {
											if (
												!cartItems.some((item) => item.productId === product.id)
											) {
												handleAddToCart(product.id);
											}
										});
									}}
								>
									<FiShoppingCart className="mr-1.5" />
									Add All to Cart
								</button>
								<button
									className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 border border-slate-300 text-xs sm:text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
									onClick={handleShareWishlist}
								>
									<FiShare2 className="mr-1.5" />
									Share List
								</button>
							</div>
						</div>

						{filteredProducts.length === 0 ? (
							<div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 text-center">
								<div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 text-slate-300">
									<FiHeart className="w-full h-full" />
								</div>
								<h3 className="text-base sm:text-lg font-medium text-slate-700 mb-2">
									Your wishlist is empty
								</h3>
								<p className="text-sm text-slate-600 mb-4">
									No items match your current filters.
								</p>
								<div className="flex justify-center gap-3">
									<button
										onClick={clearFilters}
										className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-violet-700 hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
									>
										Clear All Filters
									</button>
									<button className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-slate-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
										Browse Products
									</button>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
								{filteredProducts.map((product) => {
									const discountedPrice = getDiscountedPrice(product);

									return (
										<div
											key={product.id}
											className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
										>
											<div className="relative overflow-hidden">
												<div className="w-full h-full pt-[75%] relative">
													<img
														src={product.image}
														alt={product.name}
														className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
														loading="lazy"
													/>
												</div>
												<button
													onClick={() => handleRemoveFromWishlist(product.id)}
													className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center text-red-600 hover:bg-opacity-100 transition-all z-10"
													aria-label="Remove from wishlist"
												>
													<FiX />
												</button>

												<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<button
														onClick={() => openQuickView(product)}
														className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-md shadow-md text-slate-800 font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-xs sm:text-sm"
													>
														Quick View
													</button>
												</div>

												{product.discount && product.discount > 0 && (
													<div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-rose-600 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
														{product.discount}% OFF
													</div>
												)}

												{product.stock && product.stock <= 5 && (
													<div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-amber-100 text-amber-800 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-medium">
														Only {product.stock} left!
													</div>
												)}
											</div>
											<div className="p-3 sm:p-4 flex-1 flex flex-col">
												<div className="mb-1 sm:mb-2 flex flex-wrap gap-1 sm:gap-2">
													<span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-violet-100 text-violet-800">
														{product.category}
													</span>
													<span className="text-xs text-slate-500">
														Added {formatDate(product.dateAdded)}
													</span>
												</div>
												<h3 className="font-medium text-slate-800 mb-1 text-sm sm:text-lg line-clamp-1">
													{product.name}
												</h3>
												<p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 flex-1">
													{product.description}
												</p>

												{product.colors && product.colors.length > 0 && (
													<div className="mb-2 sm:mb-3">
														<div className="flex items-center space-x-1">
															{product.colors.slice(0, 4).map((color) => (
																<div
																	key={color}
																	className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-200 cursor-pointer hover:scale-110 transition-transform"
																	style={{
																		backgroundColor:
																			color === "Black"
																				? "#000"
																				: color === "White"
																				? "#fff"
																				: color === "Navy"
																				? "#0a3977"
																				: color === "Silver"
																				? "#c0c0c0"
																				: color === "Brushed Gold"
																				? "#d4af37"
																				: color === "Rose Gold"
																				? "#b76e79"
																				: color === "Gray"
																				? "#808080"
																				: color === "Beige"
																				? "#f5f5dc"
																				: color === "Terracotta"
																				? "#e2725b"
																				: color === "Red"
																				? "#e74c3c"
																				: color === "Blue"
																				? "#3498db"
																				: color === "Brown"
																				? "#8b4513"
																				: color === "Tan"
																				? "#d2b48c"
																				: color === "Green"
																				? "#2ecc71"
																				: color === "Purple"
																				? "#9b59b6"
																				: "#ddd",
																	}}
																	title={color}
																>
																	{color === "White" && (
																		<div className="w-full h-full rounded-full border border-slate-200"></div>
																	)}
																</div>
															))}
															{product.colors.length > 4 && (
																<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">
																	+{product.colors.length - 4}
																</div>
															)}
														</div>
													</div>
												)}

												<div className="mt-auto">
													<div className="flex justify-between items-center mb-2 sm:mb-3">
														<div>
															{product.discount && product.discount > 0 ? (
																<div className="flex items-baseline gap-1.5">
																	<span className="font-bold text-slate-800 text-sm sm:text-base">
																		${discountedPrice.toFixed(2)}
																	</span>
																	<span className="text-xs text-slate-500 line-through">
																		${product.price.toFixed(2)}
																	</span>
																</div>
															) : (
																<span className="font-bold text-slate-800 text-sm sm:text-base">
																	${product.price.toFixed(2)}
																</span>
															)}
														</div>
														<div className="flex items-center text-amber-400 text-xs sm:text-sm">
															{"★".repeat(Math.floor(product.popularity))}
															{product.popularity % 1 >= 0.5 && "★"}
															<span className="ml-1 text-slate-700">
																{product.popularity.toFixed(1)}
															</span>
														</div>
													</div>
													<div className="flex gap-1.5 sm:gap-2">
														<button
															onClick={() => handleAddToCart(product.id)}
															disabled={cartItems.some(
																(item) => item.productId === product.id
															)}
															className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
																cartItems.some(
																	(item) => item.productId === product.id
																)
																	? "bg-green-100 text-green-700"
																	: "bg-violet-700 hover:bg-violet-800 text-white"
															}`}
														>
															{cartItems.some(
																(item) => item.productId === product.id
															)
																? "In Cart"
																: "Add to Cart"}
														</button>
														<div className="relative">
															<button
																onClick={() => handleShareProduct(product)}
																className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors"
																aria-label="Share"
															>
																<FiShare2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
															</button>
														</div>
														<div className="relative">
															<button
																onClick={() =>
																	toggleProductDropdown(product.id)
																}
																className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
																aria-label="More options"
																data-dropdown-toggle={product.id}
															>
																<FiChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
															</button>

															{showProductDropdown === product.id && (
																<div
																	className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white z-20 animate-fade-in"
																	ref={(el) =>
																		(productDropdownRefs.current[product.id] =
																			el)
																	}
																>
																	<div className="py-1">
																		<button
																			className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
																			onClick={() =>
																				handleRemoveFromWishlist(product.id)
																			}
																		>
																			<FiTrash2 className="mr-2 w-4 h-4 text-slate-500" />
																			Remove from Wishlist
																		</button>
																		<div className="border-t border-slate-100 mt-1 pt-1">
																			<div className="px-4 py-1 text-xs text-slate-500">
																				Move to another wishlist:
																			</div>
																			{wishlists
																				.filter(
																					(list) => list !== activeWishlist
																				)
																				.map((list) => (
																					<button
																						key={list}
																						className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
																						onClick={() =>
																							moveToWishlist(product.id, list)
																						}
																					>
																						<FiArrowRight className="mr-2 w-4 h-4 text-slate-500" />
																						{list}
																					</button>
																				))}
																		</div>
																	</div>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}

						<div className="mt-8 sm:mt-12">
							<div className="flex items-center justify-between mb-4 sm:mb-5">
								<h2 className="text-lg sm:text-xl font-bold text-slate-800">
									Recently Viewed
								</h2>
								<a
									href="#"
									className="text-xs sm:text-sm font-medium text-violet-700 hover:text-violet-800 flex items-center"
								>
									View All <FiChevronRight className="ml-1" />
								</a>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
								{recentlyViewedProducts.map((product) => (
									<div
										key={product.id}
										className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-all"
									>
										<div className="relative pt-[75%]">
											<img
												src={product.image}
												alt={product.name}
												className="absolute inset-0 w-full h-full object-cover"
												loading="lazy"
											/>
											{product.discount && product.discount > 0 && (
												<div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-rose-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
													{product.discount}% OFF
												</div>
											)}
										</div>
										<div className="p-2 sm:p-3">
											<h3 className="font-medium text-slate-800 text-xs sm:text-sm line-clamp-1">
												{product.name}
											</h3>
											<div className="flex justify-between items-center mt-1">
												{product.discount && product.discount > 0 ? (
													<div className="flex items-baseline gap-1">
														<span className="font-medium text-slate-800 text-xs sm:text-sm">
															${getDiscountedPrice(product).toFixed(2)}
														</span>
														<span className="text-xs text-slate-500 line-through">
															${product.price.toFixed(2)}
														</span>
													</div>
												) : (
													<span className="font-medium text-slate-800 text-xs sm:text-sm">
														${product.price.toFixed(2)}
													</span>
												)}
												<button
													className="text-slate-400 hover:text-violet-700 transition-colors"
													onClick={() => {
														if (!selectedProducts.includes(product.id)) {
															setSelectedProducts([
																...selectedProducts,
																product.id,
															]);
															setNotification({
																message: "Added to wishlist",
																type: "success",
															});
															setTimeout(() => setNotification(null), 3000);
														}
													}}
												>
													<FiHeart
														className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
															selectedProducts.includes(product.id)
																? "fill-violet-700 text-violet-700"
																: ""
														}`}
													/>
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="mt-8 sm:mt-12">
							<div className="flex items-center justify-between mb-4 sm:mb-5">
								<h2 className="text-lg sm:text-xl font-bold text-slate-800">
									You Might Also Like
								</h2>
								<a
									href="#"
									className="text-xs sm:text-sm font-medium text-violet-700 hover:text-violet-800 flex items-center"
								>
									View All <FiChevronRight className="ml-1" />
								</a>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
								{recommendedProducts.map((product) => (
									<div
										key={product.id}
										className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-all"
									>
										<div className="relative pt-[75%]">
											<img
												src={product.image}
												alt={product.name}
												className="absolute inset-0 w-full h-full object-cover"
												loading="lazy"
											/>
											{product.discount && product.discount > 0 && (
												<div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-rose-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
													{product.discount}% OFF
												</div>
											)}
										</div>
										<div className="p-2 sm:p-3">
											<h3 className="font-medium text-slate-800 text-xs sm:text-sm line-clamp-1">
												{product.name}
											</h3>
											<div className="flex justify-between items-center mt-1">
												{product.discount && product.discount > 0 ? (
													<div className="flex items-baseline gap-1">
														<span className="font-medium text-slate-800 text-xs sm:text-sm">
															${getDiscountedPrice(product).toFixed(2)}
														</span>
														<span className="text-xs text-slate-500 line-through">
															${product.price.toFixed(2)}
														</span>
													</div>
												) : (
													<span className="font-medium text-slate-800 text-xs sm:text-sm">
														${product.price.toFixed(2)}
													</span>
												)}
												<button
													className="text-slate-400 hover:text-violet-700 transition-colors"
													onClick={() => {
														if (!selectedProducts.includes(product.id)) {
															setSelectedProducts([
																...selectedProducts,
																product.id,
															]);
															setNotification({
																message: "Added to wishlist",
																type: "success",
															});
															setTimeout(() => setNotification(null), 3000);
														}
													}}
												>
													<FiHeart
														className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
															selectedProducts.includes(product.id)
																? "fill-violet-700 text-violet-700"
																: ""
														}`}
													/>
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>

			<footer className="bg-slate-900 text-white mt-12 sm:mt-16">
				<div className="bg-violet-800 py-6 sm:py-8">
					<div className="max-w-7xl mx-auto px-4 sm:px-6">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
							<div>
								<h3 className="text-lg sm:text-xl font-bold mb-1">
									Get exclusive offers & updates
								</h3>
								<p className="text-sm text-violet-100">
									Subscribe to our newsletter for special deals and new arrivals
								</p>
							</div>
							<div className="flex max-w-md w-full">
								<input
									type="email"
									placeholder="Your email address"
									className="flex-grow px-3 py-2 sm:px-4 sm:py-3 rounded-l-lg focus:outline-none text-slate-800 text-sm"
								/>
								<button className="bg-slate-900 hover:bg-slate-800 px-3 py-2 sm:px-5 sm:py-3 rounded-r-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap">
									Subscribe
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
						<div className="col-span-2 md:col-span-1">
							<div className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
								<span className="text-violet-400">Vibe</span>Market
							</div>
							<p className="text-slate-400 mb-4 sm:mb-5 text-sm">
								We curate unique, high-quality products for modern living. Our
								mission is to help you discover items that bring joy and
								functionality to your everyday life.
							</p>
							<div className="flex space-x-3">
								<a
									href="#"
									className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-violet-700 transition-colors"
								>
									<FiFacebook />
								</a>
								<a
									href="#"
									className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-violet-700 transition-colors"
								>
									<FiTwitter />
								</a>
								<a
									href="#"
									className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-violet-700 transition-colors"
								>
									<FiInstagram />
								</a>
							</div>
						</div>

						<div>
							<h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
								Shop
							</h4>
							<ul className="space-y-1.5 sm:space-y-2">
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										New Arrivals
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Best Sellers
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Sale
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Home Decor
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Electronics
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Kitchen
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
								Account
							</h4>
							<ul className="space-y-1.5 sm:space-y-2">
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										My Account
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Orders
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-violet-400 hover:text-white transition-colors text-sm"
									>
										My Wishlist
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Track Order
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Returns
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
								Support
							</h4>
							<ul className="space-y-1.5 sm:space-y-2">
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Contact Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										FAQs
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Shipping Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Returns & Exchanges
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-slate-400 hover:text-white transition-colors text-sm"
									>
										Terms of Service
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-slate-800 pt-6 sm:pt-8 pb-4">
						<div className="flex flex-col md:flex-row justify-between items-center">
							<div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mb-4 md:mb-0">
								<div className="flex items-center">
									<FiTruck className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400 mr-2" />
									<span className="text-xs sm:text-sm">Free Shipping $75+</span>
								</div>
								<div className="flex items-center">
									<FiShieldOff className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400 mr-2" />
									<span className="text-xs sm:text-sm">Secure Checkout</span>
								</div>
								<div className="flex items-center">
									<FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400 mr-2" />
									<span className="text-xs sm:text-sm">Easy Returns</span>
								</div>
							</div>
							<div className="flex space-x-2">
								<img
									src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
									alt="Visa"
									className="h-6 sm:h-8 w-auto grayscale hover:grayscale-0 transition-all"
								/>
								<img
									src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
									alt="Mastercard"
									className="h-6 sm:h-8 w-auto grayscale hover:grayscale-0 transition-all"
								/>
								<img
									src="https://cdn-icons-png.flaticon.com/512/196/196539.png"
									alt="PayPal"
									className="h-6 sm:h-8 w-auto grayscale hover:grayscale-0 transition-all"
								/>
								<img
									src="https://cdn-icons-png.flaticon.com/512/196/196565.png"
									alt="American Express"
									className="h-6 sm:h-8 w-auto grayscale hover:grayscale-0 transition-all"
								/>
							</div>
						</div>
					</div>

					<div className="border-t border-slate-800 pt-6 text-center text-slate-400 text-xs sm:text-sm">
						<p>© 2025 VibeMarket. All rights reserved.</p>
					</div>
				</div>
			</footer>

			{showShareModal && selectedForShare && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4"
					onClick={() => setShowShareModal(false)}
				>
					<div
						className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-4 sm:p-5 animate-scale-in"
						onClick={(e) => e.stopPropagation()}
						ref={shareModalRef}
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-bold text-base sm:text-lg text-slate-800">
								Share this item
							</h3>
							<button
								onClick={() => setShowShareModal(false)}
								className="text-slate-500 hover:text-slate-700"
							>
								<FiX className="w-5 h-5" />
							</button>
						</div>
						<div className="flex items-center gap-3 mb-5">
							<img
								src={selectedForShare.image}
								alt={selectedForShare.name}
								className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md"
							/>
							<div>
								<h4 className="font-medium text-slate-800 line-clamp-1 text-sm sm:text-base">
									{selectedForShare.name}
								</h4>
								<p className="text-xs sm:text-sm text-slate-600">
									${selectedForShare.price}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={() => shareVia("facebook")}
								className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs sm:text-sm"
							>
								<FiFacebook />
								<span>Facebook</span>
							</button>
							<button
								onClick={() => shareVia("twitter")}
								className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors text-xs sm:text-sm"
							>
								<FiTwitter />
								<span>Twitter</span>
							</button>
							<button
								onClick={() => shareVia("instagram")}
								className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-md bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors text-xs sm:text-sm"
							>
								<FiInstagram />
								<span>Instagram</span>
							</button>
							<button
								onClick={() => shareVia("email")}
								className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-md bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors text-xs sm:text-sm"
							>
								<FiMail />
								<span>Email</span>
							</button>
						</div>
						<div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100">
							<p className="text-xs sm:text-sm text-slate-600 mb-2">
								Or copy link
							</p>
							<div className="flex">
								<input
									type="text"
									value={`https://example.com/product/${selectedForShare.id}`}
									className="flex-grow px-3 py-2 bg-slate-50 rounded-l-md text-xs sm:text-sm text-slate-700 focus:outline-none"
									readOnly
								/>
								<button className="px-3 py-2 bg-violet-700 text-white rounded-r-md hover:bg-violet-800 transition-colors text-xs sm:text-sm">
									Copy
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{showShareWishlistModal && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4"
					onClick={() => setShowShareWishlistModal(false)}
				>
					<div
						className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-4 sm:p-5 animate-scale-in"
						onClick={(e) => e.stopPropagation()}
						ref={shareWishlistModalRef}
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-bold text-base sm:text-lg text-slate-800">
								Share "{activeWishlist}"
							</h3>
							<button
								onClick={() => setShowShareWishlistModal(false)}
								className="text-slate-500 hover:text-slate-700"
							>
								<FiX className="w-5 h-5" />
							</button>
						</div>
						<div className="flex gap-3 mb-5 items-center">
							<div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-violet-100 rounded-md flex items-center justify-center text-violet-600">
								<FiHeart className="w-8 h-8" />
							</div>
							<div>
								<h4 className="font-medium text-slate-800 line-clamp-1 text-sm sm:text-base">
									{activeWishlist}
								</h4>
								<p className="text-xs sm:text-sm text-slate-600">
									{filteredProducts.length} items
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={() => shareVia("facebook")}
								className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs sm:text-sm"
							>
								<FiFacebook />
								<span>Facebook</span>
							</button>
							<button
								onClick={() => shareVia("twitter")}
								className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors text-xs sm:text-sm"
							>
								<FiTwitter />
								<span>Twitter</span>
							</button>
							<button
								onClick={() => shareVia("instagram")}
								className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-md bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors text-xs sm:text-sm"
							>
								<FiInstagram />
								<span>Instagram</span>
							</button>
							<button
								onClick={() => shareVia("email")}
								className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-md bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors text-xs sm:text-sm"
							>
								<FiMail />
								<span>Email</span>
							</button>
						</div>
						<div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100">
							<p className="text-xs sm:text-sm text-slate-600 mb-2">
								Or copy link
							</p>
							<div className="flex">
								<input
									type="text"
									value={`https://example.com/wishlist/${activeWishlist
										.replace(/\s+/g, "-")
										.toLowerCase()}`}
									className="flex-grow px-3 py-2 bg-slate-50 rounded-l-md text-xs sm:text-sm text-slate-700 focus:outline-none"
									readOnly
								/>
								<button className="px-3 py-2 bg-violet-700 text-white rounded-r-md hover:bg-violet-800 transition-colors text-xs sm:text-sm">
									Copy
								</button>
							</div>
						</div>
						<div className="mt-4 pt-3 border-t border-slate-100">
							<div className="flex items-center mb-2">
								<input
									type="checkbox"
									id="make-wishlist-public"
									className="mr-2 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
								/>
								<label
									htmlFor="make-wishlist-public"
									className="text-xs sm:text-sm text-slate-700"
								>
									Make this wishlist public
								</label>
							</div>
							<p className="text-xs text-slate-500">
								Public wishlists can be viewed by anyone with the link. Private
								wishlists are only visible to you.
							</p>
						</div>
					</div>
				</div>
			)}

			{showQuickView && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4"
					onClick={() => setShowQuickView(null)}
				>
					<div
						className="bg-white rounded-lg shadow-xl max-w-4xl w-full animate-scale-in overflow-hidden max-h-[90vh]"
						onClick={(e) => e.stopPropagation()}
						ref={quickViewRef}
					>
						<div className="flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
							<div className="w-full md:w-1/2 bg-slate-50 max-h-[40vh] md:max-h-[90vh] flex-shrink-0">
								<div className="w-full h-full relative">
									<img
										src={showQuickView.image}
										alt={showQuickView.name}
										className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
							</div>

							<div className="w-full md:w-1/2 p-4 sm:p-5 md:p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
											{showQuickView.name}
										</h3>
										<p className="text-sm text-slate-600 mb-3 sm:mb-4">
											{showQuickView.category}
										</p>
									</div>
									<button
										onClick={() => setShowQuickView(null)}
										className="text-slate-400 hover:text-slate-600 transition-colors"
									>
										<FiX className="w-5 h-5" />
									</button>
								</div>

								<div className="mb-4">
									<div className="flex items-center gap-2 mb-3 sm:mb-4">
										<div className="flex items-center text-amber-400">
											{"★".repeat(Math.floor(showQuickView.popularity))}
											{showQuickView.popularity % 1 >= 0.5 && "★"}
											<span className="text-slate-700 ml-1 text-sm">
												{showQuickView.popularity.toFixed(1)}
											</span>
										</div>
										<span className="text-xs sm:text-sm text-slate-500">
											({Math.floor(showQuickView.popularity * 47)} reviews)
										</span>
									</div>

									<div className="flex items-baseline gap-2 mb-2">
										{showQuickView.discount && showQuickView.discount > 0 ? (
											<>
												<span className="text-xl sm:text-2xl font-bold text-slate-800">
													${getDiscountedPrice(showQuickView).toFixed(2)}
												</span>
												<span className="text-sm sm:text-lg text-slate-500 line-through">
													${showQuickView.price.toFixed(2)}
												</span>
												<span className="text-xs sm:text-sm text-rose-600 font-medium">
													Save ${calculateSavings(showQuickView).toFixed(2)}
												</span>
											</>
										) : (
											<span className="text-xl sm:text-2xl font-bold text-slate-800">
												${showQuickView.price.toFixed(2)}
											</span>
										)}
									</div>

									{showQuickView.stock && showQuickView.stock <= 5 ? (
										<div className="text-amber-700 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
											Only {showQuickView.stock} left in stock - order soon
										</div>
									) : (
										<div className="text-green-700 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
											In Stock
										</div>
									)}
								</div>

								<p className="text-sm text-slate-700 mb-5 sm:mb-6">
									{showQuickView.description}
								</p>

								{showQuickView.colors && showQuickView.colors.length > 0 && (
									<div className="mb-4 sm:mb-5">
										<h4 className="font-medium text-sm sm:text-base text-slate-800 mb-2">
											Color
										</h4>
										<div className="flex flex-wrap gap-2">
											{showQuickView.colors.map((color) => (
												<button
													key={color}
													className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
														selectedColor === color
															? "border-violet-700"
															: "border-transparent hover:border-slate-300"
													} transition-colors`}
													style={{
														backgroundColor:
															color === "Black"
																? "#000"
																: color === "White"
																? "#fff"
																: color === "Navy"
																? "#0a3977"
																: color === "Silver"
																? "#c0c0c0"
																: color === "Brushed Gold"
																? "#d4af37"
																: color === "Rose Gold"
																? "#b76e79"
																: color === "Gray"
																? "#808080"
																: color === "Beige"
																? "#f5f5dc"
																: color === "Terracotta"
																? "#e2725b"
																: color === "Red"
																? "#e74c3c"
																: color === "Blue"
																? "#3498db"
																: color === "Brown"
																? "#8b4513"
																: color === "Tan"
																? "#d2b48c"
																: color === "Green"
																? "#2ecc71"
																: color === "Purple"
																? "#9b59b6"
																: "#ddd",
													}}
													onClick={() => setSelectedColor(color)}
													aria-label={`Select ${color} color`}
												>
													{color === "White" && (
														<div className="w-full h-full rounded-full bg-white"></div>
													)}
													{selectedColor === color && (
														<div className="flex items-center justify-center w-full h-full">
															<FiCheck
																className={`${
																	color === "White" ||
																	color === "Beige" ||
																	color === "Silver"
																		? "text-black"
																		: "text-white"
																}`}
															/>
														</div>
													)}
												</button>
											))}
										</div>
									</div>
								)}

								{showQuickView.sizes && showQuickView.sizes.length > 0 && (
									<div className="mb-5 sm:mb-6">
										<h4 className="font-medium text-sm sm:text-base text-slate-800 mb-2">
											Size
										</h4>
										<div className="flex flex-wrap gap-2">
											{showQuickView.sizes.map((size) => (
												<button
													key={size}
													className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
														selectedSize === size
															? "bg-violet-100 text-violet-800 border-2 border-violet-600"
															: "bg-slate-100 text-slate-700 border-2 border-transparent hover:bg-slate-200"
													} transition-colors`}
													onClick={() => setSelectedSize(size)}
												>
													{size}
												</button>
											))}
										</div>
									</div>
								)}

								<div className="flex items-center gap-3 mb-5 sm:mb-6">
									<div className="flex items-center border rounded-md">
										<button
											className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-slate-500 hover:text-violet-700"
											onClick={() => {
												const quantity =
													document.getElementById("quickview-quantity");
												if (quantity && parseInt(quantity.value) > 1) {
													quantity.value = (
														parseInt(quantity.value) - 1
													).toString();
												}
											}}
										>
											<FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
										</button>
										<input
											type="number"
											id="quickview-quantity"
											defaultValue="1"
											min="1"
											max="99"
											className="w-10 sm:w-12 text-center border-none focus:ring-0 p-0 text-sm sm:text-base"
										/>
										<button
											className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-slate-500 hover:text-violet-700"
											onClick={() => {
												const quantity =
													document.getElementById("quickview-quantity");
												if (quantity) {
													quantity.value = (
														parseInt(quantity.value) + 1
													).toString();
												}
											}}
										>
											<FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
										</button>
									</div>
									<button
										className="flex-1 py-1.5 sm:py-2 px-3 sm:px-4 bg-violet-700 hover:bg-violet-800 text-white font-medium rounded-md transition-colors text-xs sm:text-sm"
										onClick={() => {
											const quantity =
												document.getElementById("quickview-quantity");
											handleAddToCart(
												showQuickView.id,
												quantity ? parseInt(quantity.value) : 1,
												selectedColor,
												selectedSize
											);
											setShowQuickView(null);
										}}
									>
										Add to Cart
									</button>
								</div>

								<div className="flex items-center gap-4 mb-4">
									<button
										className="flex items-center text-slate-600 hover:text-violet-700 transition-colors"
										onClick={() => handleShareProduct(showQuickView)}
									>
										<FiShare2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
										<span className="text-xs sm:text-sm">Share</span>
									</button>

									{!selectedProducts.includes(showQuickView.id) ? (
										<button
											className="flex items-center text-slate-600 hover:text-violet-700 transition-colors"
											onClick={() => {
												setSelectedProducts([
													...selectedProducts,
													showQuickView.id,
												]);
												setNotification({
													message: "Added to wishlist",
													type: "success",
												});
												setTimeout(() => setNotification(null), 3000);
											}}
										>
											<FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
											<span className="text-xs sm:text-sm">
												Add to Wishlist
											</span>
										</button>
									) : (
										<button
											className="flex items-center text-violet-700 transition-colors"
											onClick={() => handleRemoveFromWishlist(showQuickView.id)}
										>
											<FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 fill-violet-700" />
											<span className="text-xs sm:text-sm">
												Remove from Wishlist
											</span>
										</button>
									)}
								</div>

								<div className="border-t border-slate-200 pt-4 mt-auto">
									<div className="flex flex-wrap gap-2 sm:gap-6">
										<div className="flex items-center text-slate-600">
											<FiTruck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-violet-700" />
											<span className="text-xs sm:text-sm">
												Free shipping over $75
											</span>
										</div>
										<div className="flex items-center text-slate-600">
											<FiCreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-violet-700" />
											<span className="text-xs sm:text-sm">
												Secure checkout
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="border-t border-slate-200 p-4 sm:p-5">
							<div className="flex items-center justify-between overflow-x-auto whitespace-nowrap pb-1">
								<button className="text-xs sm:text-sm font-medium text-violet-700 border-b-2 border-violet-700 pb-1 px-1">
									Product Details
								</button>
								<button className="text-xs sm:text-sm text-slate-600 hover:text-slate-800 pb-1 px-1">
									Specifications
								</button>
								<button className="text-xs sm:text-sm text-slate-600 hover:text-slate-800 pb-1 px-1">
									Reviews ({Math.floor(showQuickView.popularity * 47)})
								</button>
								<button className="text-xs sm:text-sm text-slate-600 hover:text-slate-800 pb-1 px-1">
									Shipping & Returns
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{notification && (
				<div
					className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-up ${
						notification.type === "success"
							? "bg-green-100 text-green-800"
							: notification.type === "error"
							? "bg-red-100 text-red-800"
							: "bg-blue-100 text-blue-800"
					}`}
				>
					{notification.type === "success" ? (
						<FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
					) : notification.type === "error" ? (
						<FiX className="w-4 h-4 sm:w-5 sm:h-5" />
					) : (
						<FiInfo className="w-4 h-4 sm:w-5 sm:h-5" />
					)}
					<span className="text-xs sm:text-sm">{notification.message}</span>
				</div>
			)}

			<button
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-700 text-white shadow-lg flex items-center justify-center hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all z-20"
				aria-label="Back to top"
			>
				<FiArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes slideUp {
					from {
						transform: translateY(1rem);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}

				@keyframes slideInRight {
					from {
						transform: translateX(100%);
					}
					to {
						transform: translateX(0);
					}
				}

				@keyframes slideInLeft {
					from {
						transform: translateX(-100%);
					}
					to {
						transform: translateX(0);
					}
				}

				@keyframes slideDown {
					from {
						transform: translateY(-100%);
					}
					to {
						transform: translateY(0);
					}
				}

				@keyframes scaleIn {
					from {
						transform: scale(0.9);
						opacity: 0;
					}
					to {
						transform: scale(1);
						opacity: 1;
					}
				}

				@keyframes pulseHeart {
					0%,
					100% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.15);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.3s ease forwards;
				}

				.animate-slide-up {
					animation: slideUp 0.3s ease forwards;
				}

				.animate-slide-in-right {
					animation: slideInRight 0.3s ease forwards;
				}

				.animate-slide-in-left {
					animation: slideInLeft 0.3s ease forwards;
				}

				.animate-slide-down {
					animation: slideDown 0.3s ease forwards;
				}

				.animate-scale-in {
					animation: scaleIn 0.3s ease forwards;
				}

				.animate-pulse-heart {
					animation: pulseHeart 0.5s ease-in-out;
				}

				.slider-thumb::-webkit-slider-thumb {
					appearance: none;
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: #6d28d9;
					cursor: pointer;
				}

				.slider-thumb::-moz-range-thumb {
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: #6d28d9;
					cursor: pointer;
				}

				@media (min-width: 480px) {
					.xs\:inline {
						display: inline;
					}
				}

				.pt-\[75\%\] {
					padding-top: 75%;
				}
			`}</style>
		</div>
	);
};

export default WishlistPage;
