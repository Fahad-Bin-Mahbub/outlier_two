"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	FaSearch,
	FaBars,
	FaTimes,
	FaHeart,
	FaStar,
	FaList,
	FaTh,
	FaSignInAlt,
	FaUserPlus,
	FaArrowRight,
	FaChevronLeft,
	FaChevronRight,
	FaMapMarkerAlt,
	FaPhone,
	FaEnvelope,
	FaClock,
	FaShoppingCart,
	FaTruck,
	FaEye,
	FaBookmark,
	FaHome,
	FaBook,
} from "react-icons/fa";

interface Book {
	id: number;
	title: string;
	author: string;
	genre: string;
	publicationYear: number;
	rating: number;
	image: string;
	description: string;
	isFavorite: boolean;
	price: number;
}

interface CartItem {
	book: Book;
	quantity: number;
}

const books: Book[] = [
	{
		id: 1,
		title: "To Kill a Mockingbird",
		author: "Harper Lee",
		genre: "Fiction",
		publicationYear: 1960,
		rating: 4.8,
		image:
			"https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800",
		description:
			"A story of racial injustice and the loss of innocence in a small Southern town.",
		isFavorite: false,
		price: 12.99,
	},
	{
		id: 2,
		title: "1984",
		author: "George Orwell",
		genre: "Sci-Fi",
		publicationYear: 1949,
		rating: 4.5,
		image:
			"https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg",
		description: "A dystopian novel about totalitarianism and surveillance.",
		isFavorite: false,
		price: 9.99,
	},
	{
		id: 3,
		title: "Sapiens",
		author: "Yuval Noah Harari",
		genre: "Non-Fiction",
		publicationYear: 2011,
		rating: 4.7,
		image:
			"https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg?auto=compress&cs=tinysrgb&w=800",
		description: "A brief history of humankind, exploring our past and future.",
		isFavorite: false,
		price: 15.99,
	},
	{
		id: 4,
		title: "The Hobbit",
		author: "J.R.R. Tolkien",
		genre: "Fantasy",
		publicationYear: 1937,
		rating: 4.6,
		image:
			"https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=60",
		description: "A fantasy adventure following Bilbo Baggins.",
		isFavorite: false,
		price: 14.99,
	},
	{
		id: 5,
		title: "Pride and Prejudice",
		author: "Jane Austen",
		genre: "Fiction",
		publicationYear: 1813,
		rating: 4.4,
		image:
			"https://images.pexels.com/photos/1029609/pexels-photo-1029609.jpeg?auto=compress&cs=tinysrgb&w=800",
		description: "A romantic novel exploring love and social class.",
		isFavorite: false,
		price: 8.99,
	},
	{
		id: 6,
		title: "Dune",
		author: "Frank Herbert",
		genre: "Sci-Fi",
		publicationYear: 1965,
		rating: 4.3,
		image:
			"https://cdn.pixabay.com/photo/2018/01/17/18/43/book-3088775_1280.jpg",
		description: "A science fiction epic set on the desert planet Arrakis.",
		isFavorite: false,
		price: 11.99,
	},
	{
		id: 7,
		title: "The Catcher in the Rye",
		author: "J.D. Salinger",
		genre: "Fiction",
		publicationYear: 1951,
		rating: 4.2,
		image:
			"https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800",
		description: "A story of teenage rebellion and alienation.",
		isFavorite: false,
		price: 10.99,
	},
	{
		id: 8,
		title: "Educated",
		author: "Tara Westover",
		genre: "Non-Fiction",
		publicationYear: 2018,
		rating: 4.9,
		image:
			"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=60",
		description: "A memoir of a womans quest for knowledge.",
		isFavorite: false,
		price: 13.99,
	},
	{
		id: 9,
		title: "The Great Gatsby",
		author: "F. Scott Fitzgerald",
		genre: "Fiction",
		publicationYear: 1925,
		rating: 4.1,
		image:
			"https://cdn.pixabay.com/photo/2024/03/19/19/08/book-8643904_1280.jpg",
		description: "A tale of wealth, love, and the American Dream.",
		isFavorite: false,
		price: 7.99,
	},
	{
		id: 10,
		title: "The Alchemist",
		author: "Paulo Coelho",
		genre: "Fiction",
		publicationYear: 1988,
		rating: 4.0,
		image:
			"https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=800",
		description: "A philosophical journey of self-discovery.",
		isFavorite: false,
		price: 9.49,
	},
	{
		id: 11,
		title: "Brave New World",
		author: "Aldous Huxley",
		genre: "Sci-Fi",
		publicationYear: 1932,
		rating: 4.3,
		image:
			"https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?auto=format&fit=crop&w=800&q=60",
		description: "A futuristic novel exploring a controlled society.",
		isFavorite: false,
		price: 10.49,
	},
	{
		id: 12,
		title: "The Lord of the Rings",
		author: "J.R.R. Tolkien",
		genre: "Fantasy",
		publicationYear: 1954,
		rating: 4.9,
		image:
			"https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=60",
		description: "An epic fantasy saga of good versus evil.",
		isFavorite: false,
		price: 19.99,
	},
	{
		id: 13,
		title: "Becoming",
		author: "Michelle Obama",
		genre: "Biography",
		publicationYear: 2018,
		rating: 4.7,
		image:
			"https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg?auto=compress&cs=tinysrgb&w=800",
		description: "A memoir by the former First Lady of the United States.",
		isFavorite: false,
		price: 16.99,
	},
	{
		id: 14,
		title: "The Da Vinci Code",
		author: "Dan Brown",
		genre: "Mystery",
		publicationYear: 2003,
		rating: 4.2,
		image:
			"https://cdn.pixabay.com/photo/2016/05/28/07/05/book-1421097_1280.jpg",
		description: "A thrilling mystery involving art and religion.",
		isFavorite: false,
		price: 11.49,
	},
	{
		id: 15,
		title: "Atomic Habits",
		author: "James Clear",
		genre: "Non-Fiction",
		publicationYear: 2018,
		rating: 4.8,
		image:
			"https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg?auto=compress&cs=tinysrgb&w=800",
		description: "A guide to building good habits and breaking bad ones.",
		isFavorite: false,
		price: 14.49,
	},
	{
		id: 16,
		title: "Frankenstein",
		author: "Mary Shelley",
		genre: "Fiction",
		publicationYear: 1818,
		rating: 4.4,
		image:
			"https://cdn.pixabay.com/photo/2019/02/14/14/38/book-3996723_1280.jpg",
		description: "A tale of creation and consequence.",
		isFavorite: false,
		price: 8.49,
	},
	{
		id: 17,
		title: "The Name of the Wind",
		author: "Patrick Rothfuss",
		genre: "Fantasy",
		publicationYear: 2007,
		rating: 4.6,
		image:
			"https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=60",
		description: "A magical tale of a gifted young mans journey.",
		isFavorite: false,
		price: 12.49,
	},
	{
		id: 18,
		title: "Gone Girl",
		author: "Gillian Flynn",
		genre: "Mystery",
		publicationYear: 2012,
		rating: 4.3,
		image:
			"https://cdn.pixabay.com/photo/2019/11/19/22/24/watch-4638673_1280.jpg",
		description: "A psychological thriller about a missing woman.",
		isFavorite: false,
		price: 10.99,
	},
	{
		id: 19,
		title: "Thinking, Fast and Slow",
		author: "Daniel Kahneman",
		genre: "Non-Fiction",
		publicationYear: 2011,
		rating: 4.5,
		image:
			"https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg?auto=compress&cs=tinysrgb&w=800",
		description: "An exploration of human decision-making.",
		isFavorite: false,
		price: 13.49,
	},
	{
		id: 20,
		title: "The Handmaids Tale",
		author: "Margaret Atwood",
		genre: "Sci-Fi",
		publicationYear: 1985,
		rating: 4.4,
		image:
			"https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?auto=format&fit=crop&w=800&q=60",
		description: "A dystopian tale of a totalitarian regime.",
		isFavorite: false,
		price: 11.99,
	},
];

const heroImages = [
	"https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D",
	"https://images.unsplash.com/photo-1709924168698-620ea32c3488?w=600&auto=format&fit=crop&q=60",
	"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D",
	"https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGJvb2t8ZW58MHx8MHx8fDA%3D",
];

const BookSearch: React.FC = () => {
	const [currentPage, setCurrentPage] = useState<string>("home");
	const [booksList, setBooksList] = useState<Book[]>(books);
	const [favorites, setFavorites] = useState<Book[]>([]);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedGenre, setSelectedGenre] = useState<string>("All");
	const [selectedAuthor, setSelectedAuthor] = useState<string>("All");
	const [yearRange, setYearRange] = useState<number[]>([1800, 2025]);
	const [sortBy, setSortBy] = useState<string>("relevance");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
	const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
	const [authMode, setAuthMode] = useState<"login" | "signup">("login");
	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const [notification, setNotification] = useState<string>("");
	const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		slideIntervalRef.current = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % heroImages.length);
		}, 8000);

		return () => {
			if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const showPage = (pageId: string) => {
		setCurrentPage(pageId);
		setIsMobileMenuOpen(false);
		scrollToTop();
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const openAuthModal = (mode: "login" | "signup") => {
		setAuthMode(mode);
		setIsAuthModalOpen(true);
		setIsMobileMenuOpen(false);
	};

	const closeModal = () => {
		setIsAuthModalOpen(false);
		setIsCartModalOpen(false);
	};

	const toggleFavorite = (id: number, e: React.MouseEvent) => {
		e.stopPropagation();
		const updatedBooks = booksList.map((book) =>
			book.id === id ? { ...book, isFavorite: !book.isFavorite } : book
		);
		setBooksList(updatedBooks);

		const book = updatedBooks.find((b) => b.id === id);
		if (book && book.isFavorite) {
			setFavorites([...favorites, book]);
			showNotification(`"${book.title}" added to favorites`);
		} else {
			setFavorites(favorites.filter((b) => b.id !== id));
			showNotification(`"${book ? book.title : ""}" removed from favorites`);
		}
	};

	const showNotification = (message: string) => {
		setNotification(message);
		setTimeout(() => setNotification(""), 3000);
	};

	const addToCart = (book: Book, e?: React.MouseEvent) => {
		if (e) e.stopPropagation();

		const existingItem = cart.find((item) => item.book.id === book.id);
		if (existingItem) {
			setCart(
				cart.map((item) =>
					item.book.id === book.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			);
		} else {
			setCart([...cart, { book, quantity: 1 }]);
		}
		showNotification(`"${book.title}" added to cart`);
	};

	const updateCartQuantity = (bookId: number, delta: number) => {
		setCart(
			cart
				.map((item) =>
					item.book.id === bookId
						? { ...item, quantity: Math.max(0, item.quantity + delta) }
						: item
				)
				.filter((item) => item.quantity > 0)
		);
	};

	const simulateShipping = () => {
		showNotification("Processing your order...");
		setTimeout(() => {
			showNotification("Order shipped successfully!");
			setCart([]);
		}, 2000);
	};

	const performSearch = (term: string) => {
		setSearchTerm(term);
	};

	const filterBooks = () => {
		let filtered = booksList.filter(
			(book) =>
				(selectedGenre === "All" || book.genre === selectedGenre) &&
				(selectedAuthor === "All" || book.author === selectedAuthor) &&
				book.publicationYear >= yearRange[0] &&
				book.publicationYear <= yearRange[1] &&
				(book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					book.author.toLowerCase().includes(searchTerm.toLowerCase()))
		);

		if (sortBy === "relevance") {
			filtered = filtered.sort((a, b) => {
				const aScore = a.title.toLowerCase().includes(searchTerm.toLowerCase())
					? 1
					: 0;
				const bScore = b.title.toLowerCase().includes(searchTerm.toLowerCase())
					? 1
					: 0;
				return bScore - aScore;
			});
		} else if (sortBy === "newest") {
			filtered = filtered.sort((a, b) => b.publicationYear - a.publicationYear);
		} else if (sortBy === "oldest") {
			filtered = filtered.sort((a, b) => a.publicationYear - b.publicationYear);
		} else if (sortBy === "price_low") {
			filtered = filtered.sort((a, b) => a.price - b.price);
		} else if (sortBy === "price_high") {
			filtered = filtered.sort((a, b) => b.price - a.price);
		} else if (sortBy === "rating") {
			filtered = filtered.sort((a, b) => b.rating - a.rating);
		}

		return filtered;
	};

	const genres = ["All", ...new Set(books.map((b) => b.genre))];
	const authors = ["All", ...new Set(books.map((b) => b.author))];
	const filteredBooks = filterBooks();

	const renderHome = () => {
		const featuredBooks = filteredBooks.slice(0, 8);
		return (
			<div className="page active">
				<div className="hero-container flex flex-col md:flex-row bg-gradient-to-r from-[#f4f7fc] to-[#e9effd] rounded-2xl mb-8 md:mb-16 overflow-hidden shadow-lg">
					<div className="hero-content w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center">
						<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-3 md:mb-6 font-poppins animate-fadeDown">
							Discover Your Next{" "}
							<span className="text-[#f97316]">Adventure</span>
						</h1>
						<p className="text-base md:text-lg text-[#475569] mb-4 md:mb-8 font-roboto animate-fadeUp">
							Explore thousands of books, find your favorites, and build your
							personal library with ease.
						</p>
						<button
							className="bg-[#f97316] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-2 hover:bg-[#ea580c] transition-all w-fit font-roboto cursor-pointer transform hover:scale-105 active:scale-95 shadow-md animate-fadeUp"
							onClick={() =>
								document
									.querySelector(".section-title")
									?.scrollIntoView({ behavior: "smooth" })
							}
						>
							Start Exploring <FaArrowRight className="animate-bounce-right" />
						</button>
					</div>
					<div className="hero-slider w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-[400px] relative overflow-hidden">
						{heroImages.map((img, index) => (
							<div
								key={index}
								className={`slide absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
									index === currentSlide ? "opacity-100" : "opacity-0"
								}`}
							>
								<img
									src={img}
									alt={`Slide ${index}`}
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
							</div>
						))}
						<div className="slider-nav absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 z-10">
							<button
								className="bg-white/80 text-[#1e3a8a] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white transition-all cursor-pointer transform hover:scale-110 active:scale-95"
								onClick={() => {
									if (slideIntervalRef.current)
										clearInterval(slideIntervalRef.current);
									setCurrentSlide(
										(prev) => (prev - 1 + heroImages.length) % heroImages.length
									);
									slideIntervalRef.current = setInterval(() => {
										setCurrentSlide((prev) => (prev + 1) % heroImages.length);
									}, 8000);
								}}
							>
								<FaChevronLeft />
							</button>
							<div className="slider-dots flex gap-2">
								{heroImages.map((_, index) => (
									<span
										key={index}
										className={`dot w-2 md:w-3 h-2 md:h-3 rounded-full cursor-pointer transition-all ${
											index === currentSlide
												? "bg-[#f97316] scale-125"
												: "bg-white/50"
										}`}
										onClick={() => {
											if (slideIntervalRef.current)
												clearInterval(slideIntervalRef.current);
											setCurrentSlide(index);
											slideIntervalRef.current = setInterval(() => {
												setCurrentSlide(
													(prev) => (prev + 1) % heroImages.length
												);
											}, 8000);
										}}
									/>
								))}
							</div>
							<button
								className="bg-white/80 text-[#1e3a8a] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white transition-all cursor-pointer transform hover:scale-110 active:scale-95"
								onClick={() => {
									if (slideIntervalRef.current)
										clearInterval(slideIntervalRef.current);
									setCurrentSlide((prev) => (prev + 1) % heroImages.length);
									slideIntervalRef.current = setInterval(() => {
										setCurrentSlide((prev) => (prev + 1) % heroImages.length);
									}, 8000);
								}}
							>
								<FaChevronRight />
							</button>
						</div>
					</div>
				</div>
				<div className="section-title flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 animate-fadeUp">
					<h2 className="text-2xl md:text-3xl text-[#1e3a8a] font-bold font-poppins">
						Featured Books
					</h2>
					<button
						className="flex items-center gap-2 px-4 py-2 text-[#1e3a8a] border-2 border-[#1e3a8a] rounded-lg hover:bg-[#1e3a8a] hover:text-white transition-all mt-4 sm:mt-0 font-roboto cursor-pointer transform hover:scale-105 active:scale-95"
						onClick={() => showPage("books")}
					>
						See All <FaArrowRight className="animate-bounce-right" />
					</button>
				</div>
				{renderBooks(featuredBooks)}
			</div>
		);
	};

	const renderBooksPage = () => {
		return (
			<div className="page active animate-fadeIn">
				<h2 className="text-3xl md:text-4xl text-[#1e3a8a] font-bold mb-6 md:mb-8 font-poppins">
					Browse Books
				</h2>
				<div className="filter-search mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label className="text-sm font-medium text-[#475569] mb-1 block font-roboto">
							Search
						</label>
						<div className="relative">
							<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
							<input
								type="text"
								placeholder="Search books..."
								className="pl-10 pr-4 py-2 rounded-lg border border-[#e2e8f0] w-full focus:border-[#1e3a8a] outline-none font-roboto transition-all"
								value={searchTerm}
								onChange={(e) => performSearch(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<label className="text-sm font-medium text-[#475569] mb-1 block font-roboto">
							Sort By
						</label>
						<select
							className="px-4 py-2 rounded-lg border border-[#e2e8f0] w-full focus:border-[#1e3a8a] outline-none font-roboto cursor-pointer transition-all"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
						>
							<option value="relevance">Relevance</option>
							<option value="newest">Newest First</option>
							<option value="oldest">Oldest First</option>
							<option value="price_low">Price: Low to High</option>
							<option value="price_high">Price: High to Low</option>
							<option value="rating">Highest Rated</option>
						</select>
					</div>
					<div>
						<label className="text-sm font-medium text-[#475569] mb-1 block font-roboto">
							Genre
						</label>
						<select
							className="px-4 py-2 rounded-lg border border-[#e2e8f0] w-full focus:border-[#1e3a8a] outline-none font-roboto cursor-pointer transition-all"
							value={selectedGenre}
							onChange={(e) => setSelectedGenre(e.target.value)}
						>
							{genres.map((genre) => (
								<option key={genre} value={genre}>
									{genre}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="text-sm font-medium text-[#475569] mb-1 block font-roboto">
							Author
						</label>
						<select
							className="px-4 py-2 rounded-lg border border-[#e2e8f0] w-full focus:border-[#1e3a8a] outline-none font-roboto cursor-pointer transition-all"
							value={selectedAuthor}
							onChange={(e) => setSelectedAuthor(e.target.value)}
						>
							{authors.map((author) => (
								<option key={author} value={author}>
									{author}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-[#475569] mr-2 font-roboto">
							View:
						</label>
						<button
							className={`p-2 cursor-pointer rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
								viewMode === "grid"
									? "bg-[#1e3a8a] text-white"
									: "bg-[#e2e8f0] text-[#64748b] hover:bg-[#d1d5db]"
							}`}
							onClick={() => setViewMode("grid")}
							aria-label="Grid View"
						>
							<FaTh />
						</button>
						<button
							className={`p-2 cursor-pointer rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
								viewMode === "list"
									? "bg-[#1e3a8a] text-white"
									: "bg-[#e2e8f0] text-[#64748b] hover:bg-[#d1d5db]"
							}`}
							onClick={() => setViewMode("list")}
							aria-label="List View"
						>
							<FaList />
						</button>
					</div>
				</div>
				{filteredBooks.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-xl shadow-sm animate-fadeIn">
						<FaSearch className="text-6xl text-[#e2e8f0] mb-6 mx-auto" />
						<p className="text-lg text-[#475569] font-roboto">
							No books found matching your criteria
						</p>
						<button
							className="mt-4 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#2d4eaa] transition-all font-roboto"
							onClick={() => {
								setSearchTerm("");
								setSelectedGenre("All");
								setSelectedAuthor("All");
							}}
						>
							Clear Filters
						</button>
					</div>
				) : (
					renderBooks(filteredBooks)
				)}
			</div>
		);
	};

	const renderFavorites = () => {
		return (
			<div className="page active animate-fadeIn">
				<h2 className="text-3xl md:text-4xl text-[#1e3a8a] font-bold mb-6 md:mb-8 font-poppins">
					Your Favorite Books
				</h2>
				{favorites.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-xl shadow-sm">
						<FaHeart className="text-6xl text-[#e2e8f0] mb-6 mx-auto" />
						<p className="text-lg text-[#475569] font-roboto">
							Your favorites list is empty
						</p>
						<button
							className="mt-4 bg-[#f97316] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#ea580c] transition-all font-roboto"
							onClick={() => showPage("books")}
						>
							Browse Books
						</button>
					</div>
				) : (
					renderBooks(favorites)
				)}
			</div>
		);
	};

	const renderCartModal = () => {
		const total = cart.reduce(
			(sum, item) => sum + item.book.price * item.quantity,
			0
		);
		return (
			<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[200] backdrop-blur-sm animate-fadeIn">
				<div className="bg-white p-6 md:p-8 rounded-2xl w-[90%] max-w-lg relative shadow-xl">
					<button
						className="absolute top-4 right-4 text-xl text-[#64748b] hover:text-[#f97316] transition-all cursor-pointer transform hover:scale-110 active:scale-95"
						onClick={closeModal}
						aria-label="Close Cart"
					>
						<FaTimes />
					</button>
					<h3 className="text-xl md:text-2xl text-[#1e3a8a] font-semibold mb-4 md:mb-6 font-poppins">
						Your Cart
					</h3>
					{cart.length === 0 ? (
						<div className="text-center py-8">
							<FaShoppingCart className="text-4xl text-[#e2e8f0] mb-4 mx-auto" />
							<p className="text-[#475569] font-roboto mb-4">
								Your cart is empty.
							</p>
							<button
								className="bg-[#f97316] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#ea580c] transition-all font-roboto"
								onClick={() => {
									closeModal();
									showPage("books");
								}}
							>
								Browse Books
							</button>
						</div>
					) : (
						<>
							<div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar mb-4">
								{cart.map((item) => (
									<div
										key={item.book.id}
										className="flex justify-between items-center mb-4 p-3 bg-[#f8fafc] rounded-lg hover:bg-[#f1f5f9] transition-all"
									>
										<div className="flex items-center gap-3">
											<img
												src={item.book.image}
												alt={item.book.title}
												className="w-12 h-16 object-cover rounded hidden xs:block"
											/>
											<div>
												<h4 className="text-base md:text-lg font-semibold text-[#1e3a8a] font-poppins">
													{item.book.title}
												</h4>
												<p className="text-xs md:text-sm text-[#475569] font-roboto">
													${item.book.price.toFixed(2)} x {item.quantity} = $
													{(item.book.price * item.quantity).toFixed(2)}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-1 md:gap-2">
											<button
												className="px-2 py-1 bg-[#e2e8f0] rounded hover:bg-[#d1d5db] transition-all cursor-pointer"
												onClick={() => updateCartQuantity(item.book.id, -1)}
												aria-label="Decrease Quantity"
											>
												-
											</button>
											<span className="w-6 text-center">{item.quantity}</span>
											<button
												className="px-2 py-1 bg-[#e2e8f0] rounded hover:bg-[#d1d5db] transition-all cursor-pointer"
												onClick={() => updateCartQuantity(item.book.id, 1)}
												aria-label="Increase Quantity"
											>
												+
											</button>
										</div>
									</div>
								))}
							</div>
							<div className="pt-4 border-t border-[#e2e8f0]">
								<div className="flex justify-between items-center mb-4">
									<span className="text-[#475569] font-roboto">Subtotal:</span>
									<span className="text-[#1e3a8a] font-semibold font-roboto">
										${total.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between items-center mb-4">
									<span className="text-[#475569] font-roboto">Shipping:</span>
									<span className="text-[#1e3a8a] font-semibold font-roboto">
										Free
									</span>
								</div>
								<div className="flex justify-between items-center mb-6 pt-2 border-t border-[#e2e8f0]">
									<span className="text-base md:text-lg font-semibold text-[#1e3a8a] font-poppins">
										Total:
									</span>
									<span className="text-base md:text-lg font-semibold text-[#1e3a8a] font-poppins">
										${total.toFixed(2)}
									</span>
								</div>
								<div className="flex flex-col xs:flex-row justify-between gap-2">
									<button
										className="order-2 xs:order-1 text-[#1e3a8a] border border-[#1e3a8a] px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1e3a8a] hover:text-white transition-all font-roboto cursor-pointer"
										onClick={closeModal}
									>
										Continue Shopping
									</button>
									<button
										className="order-1 xs:order-2 bg-[#f97316] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all font-roboto cursor-pointer"
										onClick={simulateShipping}
									>
										Checkout <FaTruck />
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		);
	};

	const renderAuthModal = () => {
		return (
			<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[200] backdrop-blur-sm animate-fadeIn">
				<div className="bg-white p-6 md:p-8 rounded-2xl w-[90%] max-w-lg relative shadow-xl">
					<button
						className="absolute top-4 right-4 text-xl text-[#64748b] hover:text-[#f97316] transition-all cursor-pointer transform hover:scale-110 active:scale-95"
						onClick={closeModal}
						aria-label="Close Modal"
					>
						<FaTimes />
					</button>
					<h3 className="text-xl md:text-2xl text-[#1e3a8a] font-semibold mb-4 md:mb-6 font-poppins">
						{authMode === "login" ? "Log In" : "Sign Up"}
					</h3>

					<div className="mb-6">
						<div className="flex border border-[#e2e8f0] rounded-lg overflow-hidden mb-6">
							<button
								className={`flex-1 py-2 text-center font-medium transition-all cursor-pointer ${
									authMode === "login"
										? "bg-[#1e3a8a] text-white"
										: "bg-white text-[#64748b] hover:bg-[#f1f5f9]"
								}`}
								onClick={() => setAuthMode("login")}
							>
								Log In
							</button>
							<button
								className={`flex-1 py-2 text-center font-medium transition-all cursor-pointer ${
									authMode === "signup"
										? "bg-[#1e3a8a] text-white"
										: "bg-white text-[#64748b] hover:bg-[#f1f5f9]"
								}`}
								onClick={() => setAuthMode("signup")}
							>
								Sign Up
							</button>
						</div>

						{authMode === "signup" && (
							<div className="mb-4">
								<label className="text-sm font-medium text-[#475569] mb-1 block font-roboto">
									Username
								</label>
								<input
									type="text"
									placeholder="Enter your username"
									className="w-full p-3 border border-[#e2e8f0] rounded-lg focus:border-[#1e3a8a] outline-none font-roboto transition-all"
								/>
							</div>
						)}

						<div className="mb-4">
							<label className="text-sm font-medium text-[#475569] mb-1 block font-roboto">
								Email
							</label>
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full p-3 border border-[#e2e8f0] rounded-lg focus:border-[#1e3a8a] outline-none font-roboto transition-all"
							/>
						</div>

						<div className="mb-4">
							<label className="text-sm font-medium text-[#475569] mb-1 block font-roboto">
								Password
							</label>
							<input
								type="password"
								placeholder="Enter your password"
								className="w-full p-3 border border-[#e2e8f0] rounded-lg focus:border-[#1e3a8a] outline-none font-roboto transition-all"
							/>
						</div>

						{authMode === "signup" && (
							<div className="mb-4">
								<label className="text-sm font-medium text-[#475569] mb-1 block font-roboto">
									Confirm Password
								</label>
								<input
									type="password"
									placeholder="Confirm your password"
									className="w-full p-3 border border-[#e2e8f0] rounded-lg focus:border-[#1e3a8a] outline-none font-roboto transition-all"
								/>
							</div>
						)}

						{authMode === "login" && (
							<div className="flex justify-between mb-4">
								<label className="flex items-center text-sm text-[#475569] cursor-pointer">
									<input type="checkbox" className="mr-2" />
									Remember me
								</label>
								<a href="#" className="text-sm text-[#1e3a8a] hover:underline">
									Forgot password?
								</a>
							</div>
						)}
					</div>

					<button
						className="w-full bg-[#f97316] text-white py-3 rounded-lg hover:bg-[#ea580c] transition-all font-roboto cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
						onClick={() => {
							showNotification(
								`${
									authMode === "login" ? "Logged in" : "Signed up"
								} successfully!`
							);
							closeModal();
						}}
					>
						{authMode === "login" ? "Log In" : "Sign Up"}
					</button>

					{authMode === "login" ? (
						<p className="text-center mt-4 text-sm text-[#475569]">
							Don't have an account?{" "}
							<button
								className="text-[#1e3a8a] font-medium hover:underline cursor-pointer"
								onClick={() => setAuthMode("signup")}
							>
								Sign up
							</button>
						</p>
					) : (
						<p className="text-center mt-4 text-sm text-[#475569]">
							Already have an account?{" "}
							<button
								className="text-[#1e3a8a] font-medium hover:underline cursor-pointer"
								onClick={() => setAuthMode("login")}
							>
								Log in
							</button>
						</p>
					)}
				</div>
			</div>
		);
	};

	const renderBooks = (booksToRender: Book[]) => {
		if (viewMode === "grid") {
			return (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fadeIn">
					{booksToRender.map((book) => (
						<div
							key={book.id}
							className="book-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group relative border border-gray-100"
						>
							<div className="absolute top-4 left-4 z-10">
								<div className="bg-[#1e3a8a]/90 text-white text-xs px-3 py-1 rounded-full font-medium">
									{book.genre}
								</div>
							</div>

							<div className="relative w-full h-56 md:h-64 overflow-hidden">
								<img
									src={book.image}
									alt={book.title}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

								<button
									className={`absolute top-4 right-4 p-2.5 rounded-full ${
										book.isFavorite
											? "bg-white text-[#f97316]"
											: "bg-white/80 text-gray-500"
									} hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer shadow-md`}
									onClick={(e) => toggleFavorite(book.id, e)}
									aria-label={
										book.isFavorite
											? "Remove from favorites"
											: "Add to favorites"
									}
								>
									<FaHeart className={book.isFavorite ? "animate-pulse" : ""} />
								</button>

								<div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-t from-black/90 to-black/0 text-white">
									<div className="flex gap-1">
										{[...Array(5)].map((_, i) => (
											<FaStar
												key={i}
												className={
													i < Math.round(book.rating)
														? "text-[#f97316]"
														: "text-gray-400/70"
												}
												size={14}
											/>
										))}
										<span className="text-sm ml-1 font-medium">
											{book.rating}
										</span>
									</div>
									<span className="text-sm">{book.publicationYear}</span>
								</div>
							</div>

							<div className="p-5 flex flex-col">
								<h4 className="text-xl font-semibold text-[#1e3a8a] font-poppins line-clamp-1 mb-1 group-hover:text-[#f97316] transition-colors">
									{book.title}
								</h4>
								<p className="text-sm text-[#475569] font-roboto mb-2">
									by <span className="font-medium">{book.author}</span>
								</p>

								<p className="text-sm text-[#475569] font-roboto mb-4 line-clamp-3 min-h-[4.5em]">
									{book.description}
								</p>

								<div className="mt-auto pt-3 border-t border-gray-100">
									<div className="flex justify-between items-center mb-3">
										<p className="text-xl font-bold text-[#1e3a8a] font-poppins">
											${book.price.toFixed(2)}
										</p>
										<div className="flex gap-2">
											<button
												className="bg-[#e2e8f0] text-[#1e3a8a] p-2 rounded-lg hover:bg-[#d1d5db] transition-all cursor-pointer"
												onClick={() => {
													showNotification(
														`Viewing details for "${book.title}"`
													);
												}}
												aria-label="View details"
											>
												<FaEye />
											</button>
											<button
												className={`p-2 rounded-lg transition-all cursor-pointer ${
													book.isFavorite
														? "bg-[#fee2e2] text-[#f97316]"
														: "bg-[#e2e8f0] text-[#1e3a8a] hover:bg-[#d1d5db]"
												}`}
												onClick={(e) => toggleFavorite(book.id, e)}
												aria-label={
													book.isFavorite
														? "Remove from favorites"
														: "Add to favorites"
												}
											>
												<FaHeart
													className={book.isFavorite ? "animate-pulse" : ""}
												/>
											</button>
										</div>
									</div>

									<button
										className="w-full bg-[#f97316] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all font-medium cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
										onClick={(e) => addToCart(book, e)}
										aria-label={`Add ${book.title} to cart`}
									>
										<FaShoppingCart size={16} /> Add to Cart
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			);
		} else {
			return (
				<div className="flex flex-col gap-5 animate-fadeIn">
					{booksToRender.map((book) => (
						<div
							key={book.id}
							className="book-card flex flex-col sm:flex-row bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group relative border border-gray-100"
						>
							<div className="relative sm:w-[200px] md:w-[220px] h-[220px] overflow-hidden flex-shrink-0">
								<div className="absolute top-3 left-3 z-10">
									<div className="bg-[#1e3a8a]/90 text-white text-xs px-3 py-1 rounded-full font-medium">
										{book.genre}
									</div>
								</div>

								<img
									src={book.image}
									alt={book.title}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>

								<div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

								<button
									className={`absolute top-3 right-3 p-2.5 rounded-full ${
										book.isFavorite
											? "bg-white text-[#f97316]"
											: "bg-white/80 text-gray-500"
									} hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer shadow-md`}
									onClick={(e) => toggleFavorite(book.id, e)}
									aria-label={
										book.isFavorite
											? "Remove from favorites"
											: "Add to favorites"
									}
								>
									<FaHeart className={book.isFavorite ? "animate-pulse" : ""} />
								</button>
							</div>

							<div className="flex-1 p-5 flex flex-col">
								<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
									<div>
										<h4 className="text-xl font-semibold text-[#1e3a8a] font-poppins group-hover:text-[#f97316] transition-colors">
											{book.title}
										</h4>
										<p className="text-sm text-[#475569] font-roboto">
											by <span className="font-medium">{book.author}</span> •{" "}
											{book.publicationYear}
										</p>
									</div>

									<div className="flex flex-row md:flex-col items-center md:items-end gap-3">
										<div className="flex gap-1 items-center">
											{[...Array(5)].map((_, i) => (
												<FaStar
													key={i}
													className={
														i < Math.round(book.rating)
															? "text-[#f97316]"
															: "text-[#e2e8f0]"
													}
												/>
											))}
											<span className="text-sm ml-1 text-[#64748b] font-medium">
												{book.rating}
											</span>
										</div>

										<p className="text-xl font-bold text-[#1e3a8a] font-poppins md:mt-1">
											${book.price.toFixed(2)}
										</p>
									</div>
								</div>

								<p className="text-sm text-[#475569] font-roboto mb-4">
									{book.description}
								</p>

								<div className="mt-auto pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
									<div className="flex gap-2">
										<button
											className="bg-[#e2e8f0] text-[#1e3a8a] p-2.5 rounded-lg hover:bg-[#d1d5db] transition-all cursor-pointer"
											onClick={() => {
												showNotification(`Viewing details for "${book.title}"`);
											}}
											aria-label="View details"
										>
											<FaEye />
										</button>

										<button
											className={`p-2.5 rounded-lg transition-all cursor-pointer ${
												book.isFavorite
													? "bg-[#fee2e2] text-[#f97316]"
													: "bg-[#e2e8f0] text-[#1e3a8a] hover:bg-[#d1d5db]"
											}`}
											onClick={(e) => toggleFavorite(book.id, e)}
											aria-label={
												book.isFavorite
													? "Remove from favorites"
													: "Add to favorites"
											}
										>
											<FaHeart
												className={book.isFavorite ? "animate-pulse" : ""}
											/>
										</button>

										<button
											className="bg-[#e2e8f0] text-[#1e3a8a] p-2.5 rounded-lg hover:bg-[#d1d5db] transition-all cursor-pointer"
											onClick={() => {
												showNotification(
													`Added "${book.title}" to reading list`
												);
											}}
											aria-label="Add to reading list"
										>
											<FaBookmark />
										</button>
									</div>

									<button
										className="sm:w-auto w-full bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all font-medium cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
										onClick={(e) => addToCart(book, e)}
										aria-label={`Add ${book.title} to cart`}
									>
										<FaShoppingCart /> Add to Cart
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			);
		}
	};

	return (
		<div className="min-h-screen bg-[#f8fafc] text-[#1e3a8a] font-sans">
			{}
			<header className="bg-white py-3 md:py-4 px-4 sticky top-0 z-50 shadow-sm">
				<nav className="max-w-7xl mx-auto flex justify-between items-center">
					<div
						className="logo flex items-center gap-2 md:gap-3 cursor-pointer"
						onClick={() => showPage("home")}
					>
						<div className="w-8 h-8 md:w-10 md:h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center transition-transform hover:scale-110">
							<span className="text-white text-base md:text-xl">📚</span>
						</div>
						<span className="text-xl md:text-2xl font-bold font-poppins">
							Book Wallah
						</span>
					</div>
					<div className="nav-links hidden md:flex gap-6 md:gap-8">
						{["home", "books", "favorites"].map((page) => (
							<a
								key={page}
								className={`text-lg font-medium cursor-pointer transition-all font-roboto relative ${
									currentPage === page
										? "text-[#f97316]"
										: "text-[#1e3a8a] hover:text-[#f97316]"
								}`}
								onClick={() => showPage(page)}
							>
								{page === "favorites" ? (
									<div className="flex items-center gap-1">
										<FaHeart
											className={`${
												currentPage === page ? "animate-pulse" : ""
											}`}
										/>
										<span>Favorites</span>
										{favorites.length > 0 && (
											<span className="ml-1 bg-[#f97316] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
												{favorites.length}
											</span>
										)}
									</div>
								) : (
									<span className="relative">
										{page.charAt(0).toUpperCase() + page.slice(1)}
										{currentPage === page && (
											<span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f97316] transform animate-growWidth"></span>
										)}
									</span>
								)}
							</a>
						))}
					</div>
					<div className="nav-right flex items-center gap-2 sm:gap-3 md:gap-5">
						<div className="search-container relative hidden sm:block">
							<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
							<input
								type="text"
								placeholder="Search books..."
								className="pl-10 pr-4 py-2 rounded-lg border border-[#e2e8f0] focus:border-[#1e3a8a] transition-all outline-none font-roboto w-32 md:w-auto"
								value={searchTerm}
								onChange={(e) => performSearch(e.target.value)}
							/>
						</div>
						<button
							className="bg-[#f97316] hidden md:flex text-white cursor-pointer px-3 lg:px-5 py-2 rounded-lg items-center gap-2 hover:bg-[#ea580c] transition-all font-roboto transform hover:scale-105 active:scale-95"
							onClick={() => openAuthModal("login")}
						>
							<FaSignInAlt /> Sign In
						</button>
						<button
							className="relative p-2 cursor-pointer rounded-lg bg-[#e2e8f0] text-[#1e3a8a] hover:bg-[#d1d5db] transition-all transform hover:scale-110 active:scale-95"
							onClick={() => setIsCartModalOpen(true)}
							aria-label="View Cart"
						>
							<FaShoppingCart />
							{cart.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-[#f97316] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
									{cart.reduce((sum, item) => sum + item.quantity, 0)}
								</span>
							)}
						</button>
						<div className="mobile-menu md:hidden">
							<FaBars
								className="text-xl cursor-pointer p-1 rounded-md hover:bg-[#e2e8f0] transition-all"
								onClick={toggleMobileMenu}
							/>
						</div>
					</div>
				</nav>
			</header>

			{}
			<div
				className={`mobile-nav fixed top-0 left-0 w-3/4 h-full bg-[#1e3a8a] text-white p-6 transition-all duration-300 z-[201] transform ${
					isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
				}`}
			>
				<button
					className="absolute top-4 right-4 text-2xl hover:text-[#f97316] transition-all cursor-pointer"
					onClick={toggleMobileMenu}
					aria-label="Close Menu"
				>
					<FaTimes />
				</button>

				<div className="py-4 flex items-center gap-3 border-b border-white/10 mb-6">
					<div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
						<span className="text-white text-xl">📚</span>
					</div>
					<span className="text-xl font-bold font-poppins">Book Wallah</span>
				</div>

				<div className="search-container relative mb-6">
					<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
					<input
						type="text"
						placeholder="Search books..."
						className="pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white w-full focus:bg-white/20 transition-all outline-none font-roboto placeholder-white/70"
						value={searchTerm}
						onChange={(e) => performSearch(e.target.value)}
					/>
				</div>

				{["home", "books", "favorites"].map((page) => (
					<a
						key={page}
						className={`flex items-center gap-3 py-3 pl-2 border-b border-white/10 cursor-pointer text-base hover:bg-white/10 rounded-lg transition-all ${
							currentPage === page ? "text-[#f97316] bg-white/5" : "text-white"
						}`}
						onClick={() => showPage(page)}
					>
						{page === "home" && <FaHome className="text-lg" />}
						{page === "books" && <FaBook className="text-lg" />}
						{page === "favorites" && (
							<div className="relative">
								<FaHeart
									className={`text-lg ${
										currentPage === page ? "animate-pulse" : ""
									}`}
								/>
								{favorites.length > 0 && (
									<span className="absolute -top-2 -right-2 bg-[#f97316] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
										{favorites.length}
									</span>
								)}
							</div>
						)}
						<span className="font-roboto">
							{page.charAt(0).toUpperCase() + page.slice(1)}
						</span>
					</a>
				))}

				<div className="mt-6 space-y-3">
					<a
						className="flex items-center gap-3 py-3 pl-2 cursor-pointer text-base hover:bg-white/10 rounded-lg transition-all text-white"
						onClick={() => openAuthModal("login")}
					>
						<FaSignInAlt className="text-lg" />
						<span className="font-roboto">Login</span>
					</a>

					<a
						className="flex items-center gap-3 py-3 pl-2 cursor-pointer text-base hover:bg-white/10 rounded-lg transition-all text-white"
						onClick={() => openAuthModal("signup")}
					>
						<FaUserPlus className="text-lg" />
						<span className="font-roboto">Sign Up</span>
					</a>

					<a
						className="flex items-center gap-3 py-3 pl-2 cursor-pointer text-base hover:bg-white/10 rounded-lg transition-all text-white"
						onClick={() => {
							setIsCartModalOpen(true);
							setIsMobileMenuOpen(false);
						}}
					>
						<div className="relative">
							<FaShoppingCart className="text-lg" />
							{cart.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-[#f97316] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
									{cart.reduce((sum, item) => sum + item.quantity, 0)}
								</span>
							)}
						</div>
						<span className="font-roboto">View Cart</span>
					</a>
				</div>
			</div>

			{}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/30 z-[200] backdrop-blur-sm"
					onClick={toggleMobileMenu}
				></div>
			)}

			{}
			<main className="max-w-7xl mx-auto px-4 py-4 md:py-8 min-h-[calc(100vh-200px)]">
				{currentPage === "home" && renderHome()}
				{currentPage === "books" && renderBooksPage()}
				{currentPage === "favorites" && renderFavorites()}
			</main>

			{}
			{isAuthModalOpen && renderAuthModal()}

			{}
			{isCartModalOpen && renderCartModal()}

			{}
			{notification && (
				<div className="fixed bottom-4 right-4 md:bottom-5 md:right-5 bg-[#1e3a8a] text-white px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-lg z-[1000] flex items-center gap-2 animate-slideIn">
					{notification.includes("favorites") ? (
						<FaHeart className="text-[#f97316]" />
					) : notification.includes("cart") ? (
						<FaShoppingCart className="text-[#f97316]" />
					) : notification.includes("shipped") ? (
						<FaTruck className="text-[#f97316] animate-bounce" />
					) : notification.includes("Logged in") ||
					  notification.includes("Signed up") ? (
						<FaSignInAlt className="text-[#f97316]" />
					) : (
						<FaTruck />
					)}
					{notification}
				</div>
			)}

			{}
			<footer className="bg-[#1e3a8a] text-white py-6 md:py-8 px-4">
				<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
					<div className="footer-about">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 sm:w-9 h-8 sm:h-9 bg-white/10 rounded-full flex items-center justify-center">
								<span className="text-white text-lg sm:text-xl">📚</span>
							</div>
							<span className="text-xl sm:text-2xl font-bold font-poppins">
								Book Wallah
							</span>
						</div>
						<p className="text-white/70 text-sm sm:text-base font-roboto">
							Your one-stop platform for discovering and purchasing books across
							all genres.
						</p>
					</div>
					<div className="footer-links">
						<h4 className="text-base sm:text-lg font-medium mb-3 md:mb-4 font-poppins">
							Quick Links
						</h4>
						<ul>
							{["home", "books", "favorites"].map((page) => (
								<li key={page} className="mb-2">
									<a
										href="#"
										className="text-white/70 hover:text-white flex items-center gap-2 hover:pl-1 transition-all text-sm sm:text-base font-roboto"
										onClick={(e) => {
											e.preventDefault();
											showPage(page);
											scrollToTop();
										}}
									>
										<FaChevronRight className="text-xs" />{" "}
										{page.charAt(0).toUpperCase() + page.slice(1)}
									</a>
								</li>
							))}
						</ul>
					</div>
					<div className="footer-links">
						<h4 className="text-base sm:text-lg font-medium mb-3 md:mb-4 font-poppins">
							Resources
						</h4>
						<ul>
							{["Blog", "FAQs", "Support", "About Us"].map((resource) => (
								<li key={resource} className="mb-2">
									<a
										href="#"
										className="text-white/70 hover:text-white flex items-center gap-2 hover:pl-1 transition-all text-sm sm:text-base font-roboto"
									>
										<FaChevronRight className="text-xs" /> {resource}
									</a>
								</li>
							))}
						</ul>
					</div>
					<div className="footer-links">
						<h4 className="text-base sm:text-lg font-medium mb-3 md:mb-4 font-poppins">
							Contact Us
						</h4>
						<ul>
							<li className="mb-2">
								<a
									href="#"
									className="text-white/70 hover:text-white flex items-center gap-2 hover:pl-1 transition-all text-sm sm:text-base font-roboto"
								>
									<FaMapMarkerAlt className="text-xs flex-shrink-0" /> 123
									Library Lifeline, Delhi, India
								</a>
							</li>
							<li className="mb-2">
								<a
									href="#"
									className="text-white/70 hover:text-white flex items-center gap-2 hover:pl-1 transition-all text-sm sm:text-base font-roboto"
								>
									<FaPhone className="text-xs flex-shrink-0" /> +91 000xxxxxx00
								</a>
							</li>
							<li className="mb-2">
								<a
									href="#"
									className="text-white/70 hover:text-white flex items-center gap-2 hover:pl-1 transition-all text-sm sm:text-base font-roboto"
								>
									<FaEnvelope className="text-xs flex-shrink-0" />{" "}
									support@bookwallah.com
								</a>
							</li>
							<li className="mb-2">
								<a
									href="#"
									className="text-white/70 hover:text-white flex items-center gap-2 hover:pl-1 transition-all text-sm sm:text-base font-roboto"
								>
									<FaClock className="text-xs flex-shrink-0" /> Mon-Fri: 9am -
									6pm
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-6 md:mt-8 text-center pt-4 border-t border-white/10 text-white/50 text-xs sm:text-sm font-roboto">
					<p>© 2025 Book Wallah. All rights reserved.</p>
				</div>
			</footer>

			{}
			<FaHome className="hidden" />
			<FaBook className="hidden" />

			<style jsx>{`
				@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@400;500&display=swap");

				.font-poppins {
					font-family: "Poppins", sans-serif;
				}
				.font-roboto {
					font-family: "Roboto", sans-serif;
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 4px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: #f1f5f9;
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #cbd5e1;
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #94a3b8;
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.5s ease forwards;
				}

				@keyframes fadeUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fadeUp {
					animation: fadeUp 0.6s ease forwards;
				}

				@keyframes fadeDown {
					from {
						opacity: 0;
						transform: translateY(-20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fadeDown {
					animation: fadeDown 0.6s ease forwards;
				}

				@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateX(30px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}
				.animate-slideIn {
					animation: slideIn 0.3s ease forwards;
				}

				@keyframes bounceRight {
					0%,
					100% {
						transform: translateX(0);
					}
					50% {
						transform: translateX(3px);
					}
				}
				.animate-bounce-right {
					animation: bounceRight 1s infinite;
				}

				@keyframes growWidth {
					from {
						transform: scaleX(0);
					}
					to {
						transform: scaleX(1);
					}
				}
				.animate-growWidth {
					animation: growWidth 0.3s ease forwards;
					transform-origin: left;
				}

				.line-clamp-1 {
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				@media (min-width: 475px) {
					.xs\\:flex-row {
						flex-direction: row;
					}
					.xs\\:order-1 {
						order: 1;
					}
					.xs\\:order-2 {
						order: 2;
					}
					.xs\\:w-1\\/4 {
						width: 25%;
					}
					.xs\\:grid-cols-2 {
						grid-template-columns: repeat(2, minmax(0, 1fr));
					}
					.xs\\:block {
						display: block;
					}
				}
			`}</style>
		</div>
	);
};

export default BookSearch;
