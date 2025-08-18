"use client";

import { useState, useEffect } from "react";
import { Heart, Bookmark, Share2, Sun, Moon, Clock, X } from "lucide-react";

interface Article {
	source: {
		id: string | null;
		name: string;
	};
	author: string;
	title: string;
	description: string;
	url: string;
	urlToImage: string;
	publishedAt: string;
	content: string;
}

interface CategoryArticles {
	[category: string]: Article[];
}

const NEWS_API_KEY = "5a2ec591054e4e4d8cffd1ac925b4dc1";

const Model = () => {
	const [articles, setArticles] = useState<CategoryArticles>({
		business: [],
		entertainment: [],
		health: [],
		science: [],
		sports: [],
		technology: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
	const [savedArticles, setSavedArticles] = useState<Article[]>([]);
	const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [sortOrder, setSortOrder] = useState("newest");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const [articleToShare, setArticleToShare] = useState<Article | null>(null);
	const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
	const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

	const categories = [
		"all",
		"business",
		"entertainment",
		"health",
		"science",
		"sports",
		"technology",
	];

	const fetchArticles = async () => {
		setLoading(true);
		setError(null);

		try {
			const categoryEndpoints = categories
				.filter((cat) => cat !== "all")
				.map(
					(cat) =>
						`https://newsapi.org/v2/top-headlines?country=us&category=${cat}&pageSize=10&apiKey=${NEWS_API_KEY}`
				);

			const allArticlesEndpoint = `https://newsapi.org/v2/top-headlines?country=us&pageSize=40&apiKey=${NEWS_API_KEY}`;

			const requests = [...categoryEndpoints, allArticlesEndpoint];

			const responses = await Promise.all(requests.map((url) => fetch(url)));

			const data = await Promise.all(
				responses.map((res) => {
					if (!res.ok) {
						throw new Error(`HTTP error! status: ${res.status}`);
					}
					return res.json();
				})
			);

			const categoryArticles: CategoryArticles = {};

			categories
				.filter((cat) => cat !== "all")
				.forEach((cat, index) => {
					categoryArticles[cat] = data[index]?.articles || [];
				});

			categoryArticles["all"] = data[data.length - 1]?.articles || [];

			setArticles(categoryArticles);
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch news articles. Please try again later.");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchArticles();
	}, []);

	useEffect(() => {
		const favorites = JSON.parse(
			localStorage.getItem("favoriteArticles") || "[]"
		);
		const saved = JSON.parse(localStorage.getItem("savedArticles") || "[]");

		setFavoriteArticles(favorites);
		setSavedArticles(saved);
	}, []);

	const handleFavorite = (article: Article) => {
		const updatedFavorites = [...favoriteArticles];
		const articleIndex = updatedFavorites.findIndex(
			(a) => a.url === article.url
		);

		if (articleIndex !== -1) {
			updatedFavorites.splice(articleIndex, 1);
		} else {
			updatedFavorites.push(article);
		}

		setFavoriteArticles(updatedFavorites);
		localStorage.setItem("favoriteArticles", JSON.stringify(updatedFavorites));
	};

	const handleSaveArticle = (article: Article) => {
		const updatedSavedArticles = [...savedArticles];
		const articleIndex = updatedSavedArticles.findIndex(
			(a) => a.url === article.url
		);

		if (articleIndex !== -1) {
			updatedSavedArticles.splice(articleIndex, 1);
		} else {
			updatedSavedArticles.push(article);
		}

		setSavedArticles(updatedSavedArticles);
		localStorage.setItem("savedArticles", JSON.stringify(updatedSavedArticles));
	};

	const handleSelectArticle = (article: Article) => {
		setSelectedArticle(article);
	};

	const handleCloseModal = () => {
		setSelectedArticle(null);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredArticles = () => {
		let result =
			selectedCategory === "all" ? articles["all"] : articles[selectedCategory];

		if (searchTerm) {
			result = result.filter(
				(article) =>
					article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					article.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		return result.sort((a, b) => {
			const dateA = new Date(a.publishedAt).getTime();
			const dateB = new Date(b.publishedAt).getTime();

			return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
		});
	};

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortOrder(e.target.value);
	};

	const handleShareClick = (article: Article) => {
		setArticleToShare(article);
		setIsShareModalOpen(true);
	};

	const handleCloseShareModal = () => {
		setIsShareModalOpen(false);
		setArticleToShare(null);
	};

	const handleCopyLink = () => {
		if (articleToShare) {
			navigator.clipboard.writeText(articleToShare.url);
			alert("Link copied to clipboard!");
			handleCloseShareModal();
		}
	};

	const handleOpenFavoriteModal = () => {
		setIsFavoriteModalOpen(true);
	};

	const handleCloseFavoriteModal = () => {
		setIsFavoriteModalOpen(false);
	};

	const handleOpenSavedModal = () => {
		setIsSavedModalOpen(true);
	};

	const handleCloseSavedModal = () => {
		setIsSavedModalOpen(false);
	};

	const shareOnFacebook = (article: Article) => {
		const encodedUrl = encodeURIComponent(article.url);
		const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
		window.open(facebookShareUrl, "_blank");
	};

	const shareOnTwitter = (article: Article) => {
		const encodedUrl = encodeURIComponent(article.url);
		const encodedTitle = encodeURIComponent(article.title);
		const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
		window.open(twitterShareUrl, "_blank");
	};

	const shareOnLinkedIn = (article: Article) => {
		const encodedUrl = encodeURIComponent(article.url);
		const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
		window.open(linkedInShareUrl, "_blank");
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
				<div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
				<div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg shadow-md max-w-md w-full">
					<p className="text-red-500 dark:text-red-400 text-center font-medium">
						{error}
					</p>
					<button
						onClick={fetchArticles}
						className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${
				isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
			}`}
		>
			<header className="bg-blue-600 dark:bg-blue-800 shadow-lg sticky top-0 z-10">
				<div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center">
						<h1
							className="text-2xl sm:text-3xl font-bold text-white flex items-center cursor-pointer"
							onClick={() => setSelectedCategory("all")}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 sm:h-8 sm:w-8 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 19l7-7 3 3-7 7-3-3zM12 5l-7 7-3-3 7-7 3 3zM5 5l7 7-7 7-7-7 7-7z"
								/>
							</svg>
							NewsHub
						</h1>

						<div className="flex items-center space-x-2">
							<button
								className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-300"
								onClick={toggleDarkMode}
								aria-label={
									isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
								}
							>
								{isDarkMode ? (
									<Sun className="h-5 w-5" />
								) : (
									<Moon className="h-5 w-5" />
								)}
							</button>

							<button
								className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-300 md:hidden"
								onClick={toggleMobileMenu}
								aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
							>
								{isMobileMenuOpen ? (
									<X className="h-5 w-5" />
								) : (
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
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>

					<div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between">
						<nav
							className={`${
								isMobileMenuOpen
									? "max-h-[300px] opacity-100"
									: "max-h-0 md:max-h-full opacity-0 md:opacity-100"
							} overflow-hidden transition-all duration-300 ease-in-out flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6`}
						>
							{categories.map((category) => (
								<button
									key={category}
									className={`capitalize text-sm sm:text-base font-medium ${
										selectedCategory === category
											? "text-white border-b-2 border-white"
											: "text-gray-200 hover:text-white transition-colors duration-300"
									}`}
									onClick={() => {
										setSelectedCategory(category);
										setIsMobileMenuOpen(false);
									}}
								>
									{category}
								</button>
							))}
						</nav>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
					<div className="flex items-center space-x-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-blue-500 dark:text-blue-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clipRule="evenodd"
							/>
						</svg>
						<input
							type="search"
							className="w-full md:w-64 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
							placeholder="Search news..."
							value={searchTerm}
							onChange={handleSearch}
						/>
					</div>

					<div className="flex items-center space-x-2">
						<label className="text-sm font-medium">Sort by:</label>
						<select
							className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
							value={sortOrder}
							onChange={handleSortChange}
						>
							<option value="newest">Newest</option>
							<option value="oldest">Oldest</option>
						</select>

						<button
							className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
							onClick={handleOpenFavoriteModal}
							aria-label="View Favorites"
						>
							<Heart className="h-5 w-5" />
						</button>

						<button
							className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
							onClick={handleOpenSavedModal}
							aria-label="View Saved Articles"
						>
							<Bookmark className="h-5 w-5" />
						</button>
					</div>
				</div>

				{filteredArticles().length === 0 ? (
					<div className="text-center py-12 px-4">
						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400 mb-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V5a2 2 0 00-2-2h-2M5 3h14"
								/>
							</svg>
							<h3 className="text-xl font-medium mb-2">No articles found</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Try adjusting your search or filter criteria.
							</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredArticles().map((article, index) => (
							<article
								key={index}
								className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
							>
								<div className="relative h-48 overflow-hidden">
									<img
										src={article.urlToImage || "/placeholder.jpg"}
										alt={article.title}
										className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
									/>
									<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
									<div className="absolute top-4 left-4 right-4 flex justify-between items-start">
										<span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
											{article.source.name}
										</span>
										<div className="flex space-x-2">
											<button
												className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-300"
												onClick={() => handleFavorite(article)}
												aria-label={
													favoriteArticles.some((a) => a.url === article.url)
														? "Remove from favorites"
														: "Add to favorites"
												}
											>
												<Heart
													className={`h-5 w-5 ${
														favoriteArticles.some((a) => a.url === article.url)
															? "fill-current text-red-500"
															: ""
													}`}
												/>
											</button>
											<button
												className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-300"
												onClick={() => handleSaveArticle(article)}
												aria-label={
													savedArticles.some((a) => a.url === article.url)
														? "Remove from saved"
														: "Save article"
												}
											>
												<Bookmark
													className={`h-5 w-5 ${
														savedArticles.some((a) => a.url === article.url)
															? "fill-current text-blue-500"
															: ""
													}`}
												/>
											</button>
										</div>
									</div>
								</div>

								<div className="p-5">
									<h3 className="text-xl font-bold mb-2 line-clamp-2">
										{article.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
										{article.description}
									</p>

									<div className="flex justify-between items-center mb-4">
										<div className="flex items-center space-x-2">
											<Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{new Date(article.publishedAt).toLocaleDateString()}
											</span>
										</div>
										<button
											className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
											onClick={() => handleSelectArticle(article)}
										>
											Read more
										</button>
									</div>

									<div className="flex space-x-2">
										<button
											className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
											onClick={() => handleShareClick(article)}
										>
											<Share2 className="h-4 w-4" />
											<span className="text-xs">Share</span>
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				)}
			</main>

			{selectedArticle && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={handleCloseModal}
				>
					<div
						className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="relative h-64">
							<img
								src={selectedArticle.urlToImage || "/placeholder.jpg"}
								alt={selectedArticle.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>
							<button
								className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-300"
								onClick={handleCloseModal}
								aria-label="Close Modal"
							>
								<X className="h-5 w-5" />
							</button>
							<div className="absolute bottom-0 left-0 right-0 p-6">
								<span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full mb-3 inline-block">
									{selectedArticle.source.name}
								</span>
								<h2 className="text-3xl font-bold text-white mb-2">
									{selectedArticle.title}
								</h2>
								<div className="flex items-center space-x-4 text-white/90">
									<div className="flex items-center space-x-1">
										<Clock className="h-4 w-4" />
										<span className="text-sm">
											{new Date(selectedArticle.publishedAt).toLocaleDateString(
												"en-US",
												{
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												}
											)}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="p-6">
							<div className="prose dark:prose-invert max-w-none mb-6">
								<p>{selectedArticle.content}</p>
								<p className="text-gray-600 dark:text-gray-400 italic">
									Author: {selectedArticle.author || "Unknown"}
								</p>
							</div>

							<div className="flex space-x-2 mb-4">
								<button
									className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
									onClick={() => handleFavorite(selectedArticle)}
								>
									<Heart
										className={`h-5 w-5 ${
											favoriteArticles.some(
												(a) => a.url === selectedArticle.url
											)
												? "fill-current text-red-500"
												: ""
										}`}
									/>
									<span>
										{favoriteArticles.some((a) => a.url === selectedArticle.url)
											? "Favorited"
											: "Favorite"}
									</span>
								</button>

								<button
									className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
									onClick={() => handleSaveArticle(selectedArticle)}
								>
									<Bookmark
										className={`h-5 w-5 ${
											savedArticles.some((a) => a.url === selectedArticle.url)
												? "fill-current text-blue-500"
												: ""
										}`}
									/>
									<span>
										{savedArticles.some((a) => a.url === selectedArticle.url)
											? "Saved"
											: "Save"}
									</span>
								</button>

								<button
									className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-300"
									onClick={() => handleShareClick(selectedArticle)}
								>
									<Share2 className="h-5 w-5" />
									<span>Share</span>
								</button>
							</div>

							<a
								href={selectedArticle.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
							>
								Read full article on {selectedArticle.source.name}
							</a>
						</div>
					</div>
				</div>
			)}

			{isShareModalOpen && articleToShare && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={handleCloseShareModal}
				>
					<div
						className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-xl font-bold">Share Article</h3>
								<button
									className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
									onClick={handleCloseShareModal}
									aria-label="Close Modal"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
									Share with
								</h4>
								<div className="flex space-x-4">
									<button
										className="flex flex-col items-center space-y-2 w-1/3"
										onClick={() => shareOnFacebook(articleToShare)}
									>
										<div className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-300">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
											</svg>
										</div>
										<span className="text-xs text-gray-600 dark:text-gray-300">
											Facebook
										</span>
									</button>

									<button
										className="flex flex-col items-center space-y-2 w-1/3"
										onClick={() => shareOnTwitter(articleToShare)}
									>
										<div className="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-colors duration-300">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.35 4.453A4.21 4.21 0 004 8.583a4.158 4.158 0 001.287.27 4.472 4.472 0 001.67-1.11l.061-.18z" />
											</svg>
										</div>
										<span className="text-xs text-gray-600 dark:text-gray-300">
											Twitter
										</span>
									</button>

									<button
										className="flex flex-col items-center space-y-2 w-1/3"
										onClick={() => shareOnLinkedIn(articleToShare)}
									>
										<div className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center text-white transition-colors duration-300">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.63-1.848 3.354-1.848 3.583 0 4.243 2.357 4.243 5.417v6.332zM7.34 8.983c-.87 0-1.574-.725-1.574-1.62 0-.895.703-1.62 1.574-1.62.87 0 1.574.725 1.574 1.62 0 .895-.704 1.62-1.574 1.62zm-4.673 11.47H6.22v-6.969H2.667v6.969z" />
											</svg>
										</div>
										<span className="text-xs text-gray-600 dark:text-gray-300">
											LinkedIn
										</span>
									</button>
								</div>
							</div>

							<div>
								<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
									Or copy link
								</h4>
								<button
									className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
									onClick={handleCopyLink}
								>
									Copy to clipboard
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{isFavoriteModalOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={handleCloseFavoriteModal}
				>
					<div
						className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-xl font-bold">Favorite Articles</h3>
								<button
									className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
									onClick={handleCloseFavoriteModal}
									aria-label="Close Modal"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							{favoriteArticles.length === 0 ? (
								<div className="text-center py-6">
									<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
										<p className="text-gray-600 dark:text-gray-300 mb-2">
											No favorite articles yet
										</p>
										<button
											className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
											onClick={handleCloseFavoriteModal}
										>
											Browse articles
										</button>
									</div>
								</div>
							) : (
								<div className="max-h-[60vh] overflow-y-auto space-y-4">
									{favoriteArticles.map((article) => (
										<div
											key={article.url}
											className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
										>
											<h4 className="font-medium text-sm mb-1">
												{article.title}
											</h4>
											<div className="flex justify-between items-center">
												<span className="text-xs text-gray-500 dark:text-gray-400">
													{new Date(article.publishedAt).toLocaleDateString()}
												</span>
												<div className="flex space-x-2">
													<button
														className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
														onClick={() => handleSelectArticle(article)}
													>
														View
													</button>
													<button
														className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
														onClick={() => handleFavorite(article)}
													>
														Remove
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{isSavedModalOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={handleCloseSavedModal}
				>
					<div
						className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-xl font-bold">Saved Articles</h3>
								<button
									className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
									onClick={handleCloseSavedModal}
									aria-label="Close Modal"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							{savedArticles.length === 0 ? (
								<div className="text-center py-6">
									<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
										<p className="text-gray-600 dark:text-gray-300 mb-2">
											No saved articles yet
										</p>
										<button
											className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
											onClick={handleCloseSavedModal}
										>
											Browse articles
										</button>
									</div>
								</div>
							) : (
								<div className="max-h-[60vh] overflow-y-auto space-y-4">
									{savedArticles.map((article) => (
										<div
											key={article.url}
											className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
										>
											<h4 className="font-medium text-sm mb-1">
												{article.title}
											</h4>
											<div className="flex justify-between items-center">
												<span className="text-xs text-gray-500 dark:text-gray-400">
													{new Date(article.publishedAt).toLocaleDateString()}
												</span>
												<div className="flex space-x-2">
													<button
														className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
														onClick={() => handleSelectArticle(article)}
													>
														View
													</button>
													<button
														className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
														onClick={() => handleSaveArticle(article)}
													>
														Remove
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Model;
