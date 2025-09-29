"use client"
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';


const IconSun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const IconMoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);


const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconCompass = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconHeartFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const IconPlusSquare = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const IconMessageCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconBookmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconMoreHorizontal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconBookmarkFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconGrid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);


const currentUser = {
  username: 'your_username',
  fullName: 'Your Full Name',
  profilePic: 'https://picsum.photos/150/150',
  bio: 'Travel enthusiast | Photography lover | Coffee addict',
  posts: 24,
  followers: 348,
  following: 216
};


const stories = [
  { id: 1, username: 'johndoe', profilePic: 'https://picsum.photos/32/32?random=1' },
  { id: 2, username: 'travelgram', profilePic: 'https://picsum.photos/32/32?random=2' },
  { id: 3, username: 'foodie_lover', profilePic: 'https://picsum.photos/32/32?random=3' },
  { id: 4, username: 'fitness_coach', profilePic: 'https://picsum.photos/32/32?random=4' },
  { id: 5, username: 'pet_paradise', profilePic: 'https://picsum.photos/32/32?random=5' },
  { id: 6, username: 'artsy_vibes', profilePic: 'https://picsum.photos/32/32?random=6' },
  { id: 7, username: 'mountain_hiker', profilePic: 'https://picsum.photos/32/32?random=7' },
  { id: 8, username: 'beachlife', profilePic: 'https://picsum.photos/32/32?random=8' },
];


const suggestions = [
  { id: 1, username: 'photography_pro', fullName: 'Professional Photography', profilePic: 'https://picsum.photos/32/32?random=21', reason: 'New to Instagram' },
  { id: 2, username: 'travel_addict', fullName: 'Travel Inspiration', profilePic: 'https://picsum.photos/32/32?random=22', reason: 'Followed by user3' },
  { id: 3, username: 'fitness_guru', fullName: 'Fitness & Wellness', profilePic: 'https://picsum.photos/32/32?random=23', reason: 'Suggested for you' },
  { id: 4, username: 'food_heaven', fullName: 'Culinary Adventures', profilePic: 'https://picsum.photos/32/32?random=24', reason: 'Followed by user5' },
  { id: 5, username: 'nature_explorer', fullName: 'Nature & Wildlife', profilePic: 'https://picsum.photos/32/32?random=25', reason: 'New to Instagram' },
];

const posts = [
  {
    id: 1,
    username: 'johndoe',
    userProfilePic: 'https://picsum.photos/32/32?random=10',
    image: 'https://picsum.photos/600/600?random=100',
    caption: 'Beautiful day outside! #nature #photography',
    likes: 120,
    comments: [
      { username: 'jane_smith', text: 'Amazing shot!' },
      { username: 'photoLover', text: 'The colors are incredible 😍' },
    ],
    timePosted: '2 HOURS AGO',
    savedBy: []
  },
  {
    id: 2,
    username: 'travel_addict',
    userProfilePic: 'https://picsum.photos/32/32?random=11',
    image: 'https://picsum.photos/600/600?random=101',
    caption: 'Exploring new places ✈️ #travel #adventure',
    likes: 243,
    comments: [
      { username: 'worldtraveler', text: 'Where is this?' },
      { username: 'adventure_time', text: 'Adding this to my bucket list!' },
      { username: 'photoexpert', text: 'Great composition' },
    ],
    timePosted: '5 HOURS AGO',
    savedBy: ['your_username']
  },
  {
    id: 3,
    username: 'your_username',
    userProfilePic: 'https://picsum.photos/32/32?random=12',
    image: 'https://picsum.photos/600/600?random=102',
    caption: 'Perfect beach day! 🏖️ #beach #summer #vacation',
    likes: 189,
    comments: [
      { username: 'beach_lover', text: 'Wish I was there!' },
      { username: 'sun_seeker', text: 'Beautiful view!' },
    ],
    timePosted: '1 DAY AGO',
    savedBy: []
  },
  {
    id: 4,
    username: 'your_username',
    userProfilePic: 'https://picsum.photos/32/32?random=13',
    image: 'https://picsum.photos/600/600?random=103',
    caption: 'Morning coffee ritual ☕ #coffee #morning',
    likes: 97,
    comments: [
      { username: 'coffee_addict', text: 'Perfect way to start the day!' },
    ],
    timePosted: '3 DAYS AGO',
    savedBy: ['user1']
  },
  
  {
    id: 5,
    username: 'foodie_gal',
    userProfilePic: 'https://picsum.photos/32/32?random=14',
    image: 'https://picsum.photos/600/600?random=104',
    caption: 'Delicious brunch! #foodie #brunch #yummy',
    likes: 155,
    comments: [
      { username: 'chef_mike', text: 'Looks tasty!' },
      { username: 'hungry_guy', text: 'I need this now!' },
    ],
    timePosted: '6 HOURS AGO',
    savedBy: []
  },
  {
    id: 6,
    username: 'art_lover',
    userProfilePic: 'https://picsum.photos/32/32?random=15',
    image: 'https://picsum.photos/600/600?random=105',
    caption: 'Visited the gallery today. So inspiring! #art #museum #culture',
    likes: 88,
    comments: [
      { username: 'creative_soul', text: 'Love this piece!' },
    ],
    timePosted: '10 HOURS AGO',
    savedBy: ['your_username']
  },
];


const profilePosts = posts.filter(post => post.username === currentUser.username);


const savedPosts = posts.filter(post => post.savedBy.includes(currentUser.username));


export default function InstagramExport() {
	const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
		{}
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [showSearchResults, setShowSearchResults] = useState(false);
	const [currentView, setCurrentView] = useState("feed"); 
	const [profileView, setProfileView] = useState("posts"); 
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [newPostCaption, setNewPostCaption] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [filteredPosts, setFilteredPosts] = useState(posts);
	const [filteredStories, setFilteredStories] = useState(stories);
	const [darkMode, setDarkMode] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [likedPosts, setLikedPosts] = useState<number[]>([]);
	const [savedPostIds, setSavedPostIds] = useState<number[]>(
		posts
			.filter((post) => post.savedBy.includes(currentUser.username))
			.map((post) => post.id)
	);

	
	const formattedUsername = (username: string) => {
		return username.startsWith("pg_") ? username : `pg_${username}`;
	};

	
	const formatUsernames = () => {
		currentUser.username = formattedUsername(currentUser.username);

		stories.forEach((story) => {
			story.username = formattedUsername(story.username);
		});

		suggestions.forEach((suggestion) => {
			suggestion.username = formattedUsername(suggestion.username);
		});

		posts.forEach((post) => {
			post.username = formattedUsername(post.username);
			post.comments.forEach((comment) => {
				comment.username = formattedUsername(comment.username);
			});
		});
	};

	
	useEffect(() => {
		if (isClient) {
			formatUsernames();
		}
	}, [isClient]);

	
	useEffect(() => {
		if (typeof window !== "undefined") {
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			setDarkMode(prefersDark);
		}
	}, []);

	
	useEffect(() => {
		setIsClient(true);
		setIsMobile(window.innerWidth <= 768);

		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	
	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	
	const toggleComments = (postId: number) => {
		setShowComments((prev) => ({
			...prev,
			[postId]: !prev[postId],
		}));
	};

	
	const toggleLike = (postId: number) => {
		if (likedPosts.includes(postId)) {
			setLikedPosts(likedPosts.filter((id) => id !== postId));
			
			setFilteredPosts((prevPosts) =>
				prevPosts.map((post) =>
					post.id === postId ? { ...post, likes: post.likes - 1 } : post
				)
			);
		} else {
			setLikedPosts([...likedPosts, postId]);
			
			setFilteredPosts((prevPosts) =>
				prevPosts.map((post) =>
					post.id === postId ? { ...post, likes: post.likes + 1 } : post
				)
			);
		}
	};

	
	const toggleSave = (postId: number) => {
		if (savedPostIds.includes(postId)) {
			setSavedPostIds(savedPostIds.filter((id) => id !== postId));
		} else {
			setSavedPostIds([...savedPostIds, postId]);
		}
	};

	
	const navigateTo = (view: string) => {
		setCurrentView(view);
		
		if (view !== "search") {
			setSearchTerm("");
			setShowSearchResults(false);
		}
	};

	
	const handleSearchClick = () => {
		if (isMobile) {
			navigateTo("search");
		}
	};

	
	const toggleProfileView = (view: "posts" | "saved") => {
		setProfileView(view);
	};

	
	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (value) {
			setShowSearchResults(true);

			
			const matchedPosts = posts.filter(
				(post) =>
					post.username.toLowerCase().includes(value.toLowerCase()) ||
					post.caption.toLowerCase().includes(value.toLowerCase())
			);
			setFilteredPosts(matchedPosts);

			
			const matchedStories = stories.filter((story) =>
				story.username.toLowerCase().includes(value.toLowerCase())
			);
			setFilteredStories(matchedStories);
		} else {
			setShowSearchResults(false);
			setFilteredPosts(posts);
			setFilteredStories(stories);
		}
	};

	
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	
	const handleSelectImage = () => {
		fileInputRef.current?.click();
	};

	
	const resetCreatePostForm = () => {
		setImagePreview(null);
		setNewPostCaption("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	
	const handleCreatePost = () => {
		if (!imagePreview) return;

		alert("This is a demo. In a real app, this would create a new post!");
		resetCreatePostForm();
		navigateTo("feed");
	};

	
	const highlightText = (text: string, term: string) => {
		if (!term.trim()) return text;

		const regex = new RegExp(
			`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
			"gi"
		);
		const parts = text.split(regex);

		return parts.map((part, index) =>
			regex.test(part) ? (
				<mark
					key={`highlight-${index}`}
					style={{ backgroundColor: "#ffcc80", padding: 0 }}
				>
					{part}
				</mark>
			) : (
				part
			)
		);
	};

	
	const mainClassName = `main ${isMobile ? "mobile-layout" : "desktop-layout"}`;

	return (
		<div className={`container ${darkMode ? "dark-mode" : "light-mode"}`}>
			<Head>
				<title>Photogram</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>

			{}
			<nav className="navbar">
				<div className="navContainer">
					<div className="logo" onClick={() => navigateTo("feed")}>
						<h1>Photogram</h1>
					</div>

					{!isMobile && (
						<div className="searchBar">
							<span className="searchIcon">
								<IconSearch />
							</span>
							<input
								type="text"
								placeholder="Search"
								value={searchTerm}
								onChange={handleSearchChange}
							/>
							{searchTerm && (
								<button
									className="clearSearch"
									onClick={() => setSearchTerm("")}
								>
									<IconX />
								</button>
							)}
						</div>
					)}

					{isMobile && (
						<button onClick={toggleDarkMode} className="mobileToggle">
							{darkMode ? <IconSun /> : <IconMoon />}
						</button>
					)}

					<div className="navIcons">
						<span
							className={`navIcon ${currentView === "feed" ? "active" : ""}`}
							onClick={() => navigateTo("feed")}
						>
							<IconHome />
						</span>
						<span className="navIcon">
							<IconSend />
						</span>
						<span
							className={`navIcon ${currentView === "create" ? "active" : ""}`}
							onClick={() => navigateTo("create")}
						>
							<IconPlusSquare />
						</span>
						<span className="navIcon">
							<IconCompass />
						</span>
						<span className="navIcon">
							<IconHeart />
						</span>
						{!isMobile && (
							<button onClick={toggleDarkMode} className="modeToggle">
								{darkMode ? <IconSun /> : <IconMoon />}
							</button>
						)}
						<div
							className={`profilePic ${
								currentView === "profile" ? "active" : ""
							}`}
							onClick={() => navigateTo("profile")}
						>
							<img src={currentUser.profilePic} alt="Profile" />
						</div>
					</div>
				</div>
			</nav>

			<main className={mainClassName}>
				{}
				{currentView === "search" && isMobile && (
					<div className="searchView">
						<div className="searchViewHeader">
							<div className="mobileSearchBar">
								<span className="searchIcon">
									<IconSearch />
								</span>
								<input
									type="text"
									placeholder="Search"
									value={searchTerm}
									onChange={handleSearchChange}
									autoFocus
								/>
								{searchTerm && (
									<button
										className="clearSearch"
										onClick={() => setSearchTerm("")}
									>
										<IconX />
									</button>
								)}
							</div>
							<button
								className="cancelButton"
								onClick={() => navigateTo("feed")}
							>
								Cancel
							</button>
						</div>

						{showSearchResults && searchTerm ? (
							<div className="searchResults mobileSearchResults">
								<h3>Search Results</h3>

								{filteredStories.length > 0 && (
									<div className="searchSection">
										<h4>Users</h4>
										{filteredStories.map((story) => (
											<div key={`story-${story.id}`} className="searchUser">
												<div className="searchUserPic">
													<img src={story.profilePic} alt={story.username} />
												</div>
												<span className="searchUsername">
													{highlightText(story.username, searchTerm)}
												</span>
											</div>
										))}
									</div>
								)}

								{filteredPosts.length > 0 && (
									<div className="searchSection">
										<h4>Posts</h4>
										{filteredPosts.map((post) => (
											<div key={`post-${post.id}`} className="searchPost">
												<div className="searchPostImage">
													<img src={post.image} alt="Post" />
												</div>
												<div className="searchPostDetails">
													<div className="searchPostUser">
														<img
															src={post.userProfilePic}
															alt={post.username}
														/>
														<span>
															{highlightText(post.username, searchTerm)}
														</span>
													</div>
													<p className="searchPostCaption">
														{highlightText(post.caption, searchTerm)}
													</p>
												</div>
											</div>
										))}
									</div>
								)}

								{filteredStories.length === 0 && filteredPosts.length === 0 && (
									<div className="noResults">
										<p>No results found for "{searchTerm}"</p>
									</div>
								)}
							</div>
						) : (
							<div className="exploreGrid">
								{posts.map((post, index) => (
									<div key={`explore-${post.id}`} className="exploreItem">
										<img src={post.image} alt="Explore" />
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{}
				<div className={`content ${currentView}`}>
					{}
					{currentView === "feed" && !showSearchResults && (
						<>
							{}
							<div className="stories">
								<div className="storiesContainer">
									{stories.map((story, index) => (
										<div key={`story-${story.id}`} className="story">
											<div className="storyRing">
												<img src={story.profilePic} alt={story.username} />
											</div>
											<p>{story.username}</p>
										</div>
									))}
								</div>
							</div>

							{}
							<div className="posts">
								{filteredPosts.map((post) => (
									<div key={`post-${post.id}`} className="post">
										<div className="postHeader">
											<div className="postUser">
												<div className="postUserPic">
													<img src={post.userProfilePic} alt={post.username} />
												</div>
												<span className="postUsername">{post.username}</span>
											</div>
											<span className="actionIcon moreActions">
												<IconMoreHorizontal />
											</span>
										</div>

										<div className="postImage">
											<img
												src={post.image}
												alt="Post"
												onDoubleClick={() =>
													!likedPosts.includes(post.id) && toggleLike(post.id)
												}
											/>
											{likedPosts.includes(post.id) && (
												<div className="heartAnimation">
													<IconHeartFilled />
												</div>
											)}
										</div>

										<div className="postActions">
											<div className="mainActions">
												<span
													className={`actionIcon ${
														likedPosts.includes(post.id) ? "liked" : ""
													}`}
													onClick={() => toggleLike(post.id)}
												>
													{likedPosts.includes(post.id) ? (
														<IconHeartFilled />
													) : (
														<IconHeart />
													)}
												</span>
												<span
													className="actionIcon"
													onClick={() => toggleComments(post.id)}
												>
													<IconMessageCircle />
												</span>
												<span className="actionIcon sendIcon">
													<IconSend />
												</span>
											</div>
											<span
												className={`actionIcon ${
													savedPostIds.includes(post.id) ? "saved" : ""
												}`}
												onClick={() => toggleSave(post.id)}
											>
												{savedPostIds.includes(post.id) ? (
													<IconBookmarkFilled />
												) : (
													<IconBookmark />
												)}
											</span>
										</div>

										<div className="postInfo">
											<p className="likes">{post.likes} likes</p>
											<p className="caption">
												<span className="captionUsername">{post.username}</span>{" "}
												{post.caption}
											</p>

											<div
												className={`comments ${
													showComments[post.id] ? "show" : ""
												}`}
											>
												{post.comments.map((comment, index) => (
													<p
														key={`comment-${post.id}-${index}`}
														className="comment"
													>
														<span className="commentUsername">
															{comment.username}
														</span>{" "}
														{comment.text}
													</p>
												))}
											</div>

											<p
												className="viewComments"
												onClick={() => toggleComments(post.id)}
											>
												{showComments[post.id]
													? "Hide comments"
													: `View all ${post.comments.length} comments`}
											</p>

											<p className="timePosted">{post.timePosted}</p>
										</div>

										<div className="addComment">
											<input type="text" placeholder="Add a comment..." />
											<button>Post</button>
										</div>
									</div>
								))}
							</div>
						</>
					)}

					{}
					{currentView === "profile" && (
						<div className="profileContainer">
							{}
							<div className="profileHeader">
								<div className="profileHeaderLeft">
									<div className="profilePicLarge">
										<img
											src={currentUser.profilePic}
											alt={currentUser.username}
										/>
									</div>
								</div>
								<div className="profileHeaderRight">
									<div className="profileUsername">
										<h2>{currentUser.username}</h2>
										<button className="editProfileBtn">Edit Profile</button>
									</div>
									<div className="profileStats">
										<div className="profileStat">
											<span className="statNumber">{currentUser.posts}</span>{" "}
											posts
										</div>
										<div className="profileStat">
											<span className="statNumber">
												{currentUser.followers}
											</span>{" "}
											followers
										</div>
										<div className="profileStat">
											<span className="statNumber">
												{currentUser.following}
											</span>{" "}
											following
										</div>
									</div>
									<div className="profileBio">
										<p className="fullName">{currentUser.fullName}</p>
										<p className="bioText">{currentUser.bio}</p>
									</div>
								</div>
							</div>

							{}
							<div className="profileTabs">
								<div
									className={`profileTab ${
										profileView === "posts" ? "active" : ""
									}`}
									onClick={() => toggleProfileView("posts")}
								>
									<IconGrid />
									<span>POSTS</span>
								</div>
								<div
									className={`profileTab ${
										profileView === "saved" ? "active" : ""
									}`}
									onClick={() => toggleProfileView("saved")}
								>
									<IconBookmark />
									<span>SAVED</span>
								</div>
							</div>

							{}
							<div className="profileGrid">
								{(profileView === "posts"
									? profilePosts
									: posts.filter((post) => savedPostIds.includes(post.id))
								).map((post) => (
									<div key={`profile-post-${post.id}`} className="gridItem">
										<img src={post.image} alt="Post" />
										<div className="gridItemOverlay">
											<span>
												<IconHeart /> {post.likes}
											</span>
											<span>
												<IconMessageCircle /> {post.comments.length}
											</span>
										</div>
									</div>
								))}

								{(profileView === "posts"
									? profilePosts.length === 0
									: savedPostIds.length === 0) && (
									<div className="noPostsMessage">
										{profileView === "posts"
											? "You haven't posted anything yet."
											: "You haven't saved any posts yet."}
									</div>
								)}
							</div>
						</div>
					)}

					{}
					{currentView === "create" && (
						<div className="createPostContainer">
							<div className="createPostHeader">
								<h2>Create new post</h2>
								<button
									className="closeButton"
									onClick={() => navigateTo("feed")}
								>
									<IconX />
								</button>
							</div>

							<div className="createPostContent">
								{!imagePreview ? (
									<div className="uploadArea" onClick={handleSelectImage}>
										<div className="uploadIcon">
											<IconPlusSquare />
										</div>
										<p>Click to upload a photo</p>
										<input
											type="file"
											ref={fileInputRef}
											accept="image/*"
											onChange={handleFileChange}
											style={{ display: "none" }}
										/>
									</div>
								) : (
									<div className="createPostPreview">
										<div className="previewImage">
											<img src={imagePreview} alt="Preview" />
											<button
												className="changeImageBtn"
												onClick={handleSelectImage}
											>
												Change Image
											</button>
										</div>

										<div className="createPostDetails">
											<div className="createPostUser">
												<div className="postUserPic">
													<img
														src={currentUser.profilePic}
														alt={currentUser.username}
													/>
												</div>
												<span className="postUsername">
													{currentUser.username}
												</span>
											</div>

											<textarea
												placeholder="Write a caption for your post..."
												value={newPostCaption}
												onChange={(e) => setNewPostCaption(e.target.value)}
												rows={5}
												className="captionTextarea"
											></textarea>

											<div className="createPostWarning">
												<div className="warningIcon">⚠️</div>
												<div className="warningText">
													<p className="warningTitle">Demo Only</p>
													<p>
														This is a demonstration. Your post won't actually be
														saved since there is no database connected.
													</p>
												</div>
											</div>

											<button
												className={`createPostBtn ${
													imagePreview ? "active" : ""
												}`}
												onClick={handleCreatePost}
												disabled={!imagePreview}
											>
												{imagePreview ? "Share Post" : "Select an Image"}
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
				{currentView === "feed" &&
					!showSearchResults &&
					isClient &&
					!isMobile && (
						<div className="sidebar">
							{}
							<div className="sidebarUserProfile">
								<div className="sidebarUserPic">
									<img
										src={currentUser.profilePic}
										alt={currentUser.username}
									/>
								</div>
								<div className="sidebarUserInfo">
									<p className="sidebarUsername">{currentUser.username}</p>
									<p className="sidebarFullName">{currentUser.fullName}</p>
								</div>
								<button className="switchButton">Switch</button>
							</div>

							{}
							<div className="suggestions">
								<div className="suggestionsHeader">
									<span>Suggestions For You</span>
									<button>See All</button>
								</div>

								{suggestions.map((suggestion) => (
									<div
										key={`suggestion-${suggestion.id}`}
										className="suggestion"
									>
										<div className="suggestionLeft">
											<div className="suggestionPic">
												<img
													src={suggestion.profilePic}
													alt={suggestion.username}
												/>
											</div>
											<div className="suggestionInfo">
												<p className="suggestionUsername">
													{suggestion.username}
												</p>
												<p className="suggestionReason">{suggestion.reason}</p>
											</div>
										</div>
										<button className="followButton">Follow</button>
									</div>
								))}
							</div>

							{}
							<div className="footerLinks">
								<div className="links">
									<a href="#">About</a> • <a href="#">Help</a> •{" "}
									<a href="#">Press</a> • <a href="#">API</a> •
									<a href="#">Jobs</a> • <a href="#">Privacy</a> •{" "}
									<a href="#">Terms</a> • <a href="#">Locations</a> •
									<a href="#">Language</a> • <a href="#">Meta Verified</a>
								</div>
								<div className="copyright">© 2023 PHOTOGRAM</div>
							</div>
						</div>
					)}

				{}
				{isClient && isMobile && (
					<div className="mobileNavBar">
						<span
							className={`navIcon ${currentView === "feed" ? "active" : ""}`}
							onClick={() => navigateTo("feed")}
						>
							<IconHome />
						</span>
						<span className="navIcon" onClick={handleSearchClick}>
							<IconSearch />
						</span>
						<span
							className={`navIcon ${currentView === "create" ? "active" : ""}`}
							onClick={() => navigateTo("create")}
						>
							<IconPlusSquare />
						</span>
						<span className="navIcon">
							<IconHeart />
						</span>
						<span
							className={`navIcon ${currentView === "profile" ? "active" : ""}`}
							onClick={() => navigateTo("profile")}
						>
							<IconUser />
						</span>
					</div>
				)}

				{}
				{showSearchResults && searchTerm && !isMobile && (
					<div className="searchResults">
						<h3>Search Results</h3>

						{filteredStories.length > 0 && (
							<div className="searchSection">
								<h4>Users</h4>
								{filteredStories.map((story) => (
									<div key={`story-${story.id}`} className="searchUser">
										<div className="searchUserPic">
											<img src={story.profilePic} alt={story.username} />
										</div>
										<span className="searchUsername">
											{highlightText(story.username, searchTerm)}
										</span>
									</div>
								))}
							</div>
						)}

						{filteredPosts.length > 0 && (
							<div className="searchSection">
								<h4>Posts</h4>
								{filteredPosts.map((post) => (
									<div key={`post-${post.id}`} className="searchPost">
										<div className="searchPostImage">
											<img src={post.image} alt="Post" />
										</div>
										<div className="searchPostDetails">
											<div className="searchPostUser">
												<img src={post.userProfilePic} alt={post.username} />
												<span>{highlightText(post.username, searchTerm)}</span>
											</div>
											<p className="searchPostCaption">
												{highlightText(post.caption, searchTerm)}
											</p>
										</div>
									</div>
								))}
							</div>
						)}

						{filteredStories.length === 0 && filteredPosts.length === 0 && (
							<div className="noResults">
								<p>No results found for "{searchTerm}"</p>
							</div>
						)}
					</div>
				)}
			</main>

			<style jsx>{`
				.light-mode {
					--bg-primary: #fafafa;
					--bg-secondary: #ffffff;
					--text-primary: #262626;
					--text-secondary: #8e8e8e;
					--border-color: #dbdbdb;
					--accent-color: #0095f6;
					--accent-hover: #1877f2;
					--like-color: #ed4956;
					--input-bg: #efefef;
					--shadow-color: rgba(0, 0, 0, 0.2);
				}

				.dark-mode {
					--bg-primary: #121212;
					--bg-secondary: #1a1a1a;
					--text-primary: #e8e8e8;
					--text-secondary: #9d9d9d;
					--border-color: #383838;
					--accent-color: #0095f6;
					--accent-hover: #1877f2;
					--like-color: #ed4956;
					--input-bg: #262626;
					--shadow-color: rgba(0, 0, 0, 0.4);
				}

				.storiesContainer {
					display: flex;
					padding: 0 16px;
				}

				.story {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 80px;
					min-width: 80px;
					margin: 0 4px;
					cursor: pointer;
					transition: transform 0.2s ease;
				}

				.story:hover {
					transform: scale(1.05);
				}

				.storyRing {
					width: 64px;
					height: 64px;
					border-radius: 50%;
					background: linear-gradient(
						45deg,
						#f09433,
						#e6683c,
						#dc2743,
						#cc2366,
						#bc1888
					);
					padding: 2px;
					margin-bottom: 8px;
					display: flex;
					justify-content: center;
					align-items: center;
					transition: all 0.3s ease;
					position: relative;
					overflow: hidden;
				}

				.storyRing:after {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(
						45deg,
						#f09433,
						#e6683c,
						#dc2743,
						#cc2366,
						#bc1888
					);
					border-radius: 50%;
					opacity: 0.7;
					z-index: -1;
				}

				.storyRing img {
					width: 60px;
					height: 60px;
					border-radius: 50%;
					border: 2px solid var(--bg-secondary);
					object-fit: cover;
					transition: transform 0.3s ease;
				}

				.story:hover .storyRing img {
					transform: scale(1.1);
				}

				.story p {
					font-size: 12px;
					max-width: 74px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: var(--text-primary);
					transition: color 0.3s ease;
				}

				.container {
					background-color: var(--bg-primary);
					color: var(--text-primary);
					transition: background-color 0.3s ease, color 0.3s ease;
					min-height: 100vh;
				}

				.modeToggle {
					background: none;
					border: none;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0;
					color: var(--text-primary);
					transition: transform 0.2s ease, color 0.2s ease;
					margin-right: 10px;
				}

				.modeToggle:hover {
					transform: scale(1.15);
					color: var(--accent-color);
				}

				.navbar,
				.postHeader,
				.profileContainer,
				.searchResults,
				.createPostContainer {
					background-color: var(--bg-secondary);
					border-color: var(--border-color);
				}

				.logo h1 {
					color: var(--text-primary);
					transition: transform 0.3s ease;
				}

				.logo:hover h1 {
					transform: scale(1.05);
				}

				.searchBar {
					background-color: var(--input-bg);
					transition: box-shadow 0.3s ease;
				}

				.searchBar:focus-within {
					box-shadow: 0 0 0 2px var(--accent-color);
				}

				.searchBar input {
					color: var(--text-primary);
				}

				.searchIcon {
					color: var(--text-secondary);
				}

				.navIcon,
				.postUsername,
				.likes,
				.caption,
				.comment {
					color: var(--text-primary);
				}

				.navIcon.active {
					color: var(--accent-color);
				}

				.profilePic.active {
					border: 2px solid var(--accent-color);
				}

				.viewComments,
				.timePosted {
					color: var(--text-secondary);
				}

				.post,
				.stories {
					background-color: var(--bg-secondary);
					border-color: var(--border-color);
					transition: box-shadow 0.3s ease;
				}

				.post:hover {
					box-shadow: 0 4px 12px var(--shadow-color);
				}

				.addComment input {
					background-color: transparent;
					color: var(--text-primary);
				}

				.addComment button {
					color: var(--accent-color);
					transition: color 0.2s ease;
				}

				.addComment button:hover {
					color: var(--accent-hover);
				}

				.container {
					width: 100%;
					max-width: 100%;
					margin: 0 auto;
				}

				.navbar {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					height: 60px;
					background-color: var(--bg-secondary);
					border-bottom: 1px solid var(--border-color);
					display: flex;
					align-items: center;
					z-index: 100;
					transition: all 0.3s ease;
				}

				.navContainer {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 975px;
					max-width: 100%;
					padding: 0 20px;
					margin: 0 auto;
					position: relative;
				}

				.logo h1 {
					font-family: "Dancing Script", cursive;
					font-size: 28px;
					font-weight: 500;
					cursor: pointer;
				}

				.searchBar {
					display: flex;
					align-items: center;
					background-color: var(--input-bg);
					border-radius: 8px;
					padding: 0 16px;
					height: 36px;
					width: 268px;
					position: relative;
				}

				.searchIcon {
					color: var(--text-secondary);
					position: absolute;
					left: 12px;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 16px;
					height: 16px;
				}

				.searchIcon svg {
					width: 16px;
					height: 16px;
				}

				.searchBar input {
					background-color: transparent;
					border: none;
					outline: none;
					padding-left: 24px;
					width: 100%;
					font-size: 14px;
				}

				.clearSearch {
					background: none;
					border: none;
					cursor: pointer;
					color: var(--text-secondary);
					padding: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: color 0.2s ease;
				}

				.clearSearch:hover {
					color: var(--text-primary);
				}

				.clearSearch svg {
					width: 16px;
					height: 16px;
				}

				.navIcons {
					display: flex;
					align-items: center;
					gap: 22px;
					color: var(--text-primary);
				}

				.navIcon {
					cursor: pointer;
					transition: transform 0.2s ease, color 0.2s ease;
				}

				.navIcon:hover {
					transform: scale(1.1);
					color: var(--accent-color);
				}

				.profilePic {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					overflow: hidden;
					cursor: pointer;
					transition: transform 0.2s ease, border 0.2s ease;
				}

				.profilePic:hover {
					transform: scale(1.1);
				}

				.profilePic img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.main {
					padding-top: 84px;
					padding-bottom: 30px;
					width: 100%;
					margin: 0 auto;
				}

				.desktop-layout {
					max-width: 975px;
					display: flex;
					justify-content: space-between;
				}

				.mobile-layout {
					max-width: 614px;
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.content {
					transition: opacity 0.3s ease, transform 0.3s ease;
					opacity: 1;
					transform: translateY(0);
				}

				.content.feed {
					animation: fadeIn 0.5s ease;
				}

				.content.profile {
					animation: slideIn 0.5s ease;
				}

				.content.create {
					animation: popIn 0.4s ease;
				}

				.content.search {
					animation: fadeIn 0.5s ease;
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes slideIn {
					from {
						transform: translateX(30px);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}

				@keyframes popIn {
					0% {
						transform: scale(0.9);
						opacity: 0;
					}
					70% {
						transform: scale(1.03);
						opacity: 1;
					}
					100% {
						transform: scale(1);
						opacity: 1;
					}
				}

				.sidebar {
					flex-direction: column;
					width: 293px;
					position: sticky;
					top: 84px;
					padding-top: 24px;
					margin-left: 28px;
					height: fit-content;
				}

				.stories {
					display: flex;
					overflow-x: auto;
					padding: 16px 0;
					background-color: var(--bg-secondary);
					border: 1px solid var(--border-color);
					border-radius: 8px;
					margin-bottom: 24px;
					scrollbar-width: none;
					width: 100%;
					position: relative;
				}

				.stories::-webkit-scrollbar {
					display: none;
				}

				.heartAnimation {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: white;
					opacity: 0;
					animation: heartBeat 1s ease;
					pointer-events: none;
				}

				.heartAnimation svg {
					width: 80px;
					height: 80px;
					filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
				}

				@keyframes heartBeat {
					0% {
						transform: translate(-50%, -50%) scale(0);
						opacity: 0;
					}
					15% {
						transform: translate(-50%, -50%) scale(1.2);
						opacity: 1;
					}
					30% {
						transform: translate(-50%, -50%) scale(1);
						opacity: 1;
					}
					45% {
						transform: translate(-50%, -50%) scale(1.1);
						opacity: 1;
					}
					60% {
						transform: translate(-50%, -50%) scale(1);
						opacity: 1;
					}
					100% {
						transform: translate(-50%, -50%) scale(1);
						opacity: 0;
					}
				}

				.searchBar {
					display: flex;
					align-items: center;
					background-color: var(--input-bg);
					border-radius: 8px;
					padding: 0 16px;
					height: 36px;
					width: 268px;
					position: relative;
				}

				.modeToggle {
					background: none;
					border: none;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0;
					color: var(--text-primary);
					transition: transform 0.2s ease, color 0.2s ease;
					margin-right: 10px;
				}

				.mobileToggle {
					position: absolute;
					right: 20px;
					top: 50%;
					transform: translateY(-50%);
					background: none;
					border: none;
					cursor: pointer;
					display: none;
					color: var(--text-primary);
					z-index: 10;
					align-items: center;
					justify-content: center;
					width: 32px;
					height: 32px;
				}

				.searchResults {
					background-color: var(--bg-secondary);
					border: 1px solid var(--border-color);
					border-radius: 8px;
					margin-bottom: 24px;
					padding: 16px;
					width: 614px;
					max-width: 100%;
					margin: 0 auto 24px;
					box-shadow: 0 0 5px var(--shadow-color);
					animation: fadeIn 0.3s ease;
				}

				.searchResults h3 {
					margin-bottom: 16px;
					font-size: 16px;
					font-weight: 600;
					color: var(--text-primary);
				}

				.searchSection {
					margin-bottom: 24px;
				}

				.searchSection h4 {
					font-size: 14px;
					font-weight: 600;
					margin-bottom: 12px;
					color: var(--text-secondary);
				}

				.searchUser {
					display: flex;
					align-items: center;
					gap: 12px;
					padding: 8px 0;
					cursor: pointer;
					transition: background-color 0.2s ease;
				}

				.searchUser:hover {
					background-color: var(--bg-primary);
				}

				.searchUserPic {
					width: 44px;
					height: 44px;
					border-radius: 50%;
					overflow: hidden;
				}

				.searchUserPic img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					transition: transform 0.3s ease;
				}

				.searchUser:hover .searchUserPic img {
					transform: scale(1.1);
				}

				.searchUsername {
					font-size: 14px;
					font-weight: 600;
					color: var(--text-primary);
				}

				.searchPost {
					display: flex;
					gap: 12px;
					padding: 12px 0;
					border-bottom: 1px solid var(--border-color);
					cursor: pointer;
					transition: background-color 0.2s ease;
				}

				.searchPost:last-child {
					border-bottom: none;
				}

				.searchPost:hover {
					background-color: var(--bg-primary);
				}

				.searchPostImage {
					width: 60px;
					height: 60px;
					overflow: hidden;
					border-radius: 4px;
				}

				.searchPostImage img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					transition: transform 0.3s ease;
				}

				.searchPost:hover .searchPostImage img {
					transform: scale(1.1);
				}

				.searchPostDetails {
					flex: 1;
				}

				.searchPostUser {
					display: flex;
					align-items: center;
					gap: 8px;
					margin-bottom: 4px;
				}

				.searchPostUser img {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					object-fit: cover;
				}

				.searchPostUser span {
					font-size: 14px;
					font-weight: 600;
					color: var(--text-primary);
				}

				.searchPostCaption {
					font-size: 14px;
					color: var(--text-primary);
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.noResults {
					text-align: center;
					padding: 32px 0;
					color: var(--text-secondary);
				}

				.post {
					background-color: var(--bg-secondary);
					border: 1px solid var(--border-color);
					border-radius: 8px;
					margin-bottom: 24px;
					width: 100%;
					animation: fadeInUp 0.5s ease;
					animation-fill-mode: both;
				}

				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.posts .post:nth-child(1) {
					animation-delay: 0.1s;
				}
				.posts .post:nth-child(2) {
					animation-delay: 0.2s;
				}
				.posts .post:nth-child(3) {
					animation-delay: 0.3s;
				}
				.posts .post:nth-child(4) {
					animation-delay: 0.4s;
				}
				.posts .post:nth-child(5) {
					animation-delay: 0.5s;
				}
				.posts .post:nth-child(6) {
					animation-delay: 0.6s;
				}

				.postHeader {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 14px 16px;
				}

				.postUser {
					display: flex;
					align-items: center;
					gap: 10px;
				}

				.postUserPic {
					width: 32px;
					height: 32px;
					border-radius: 50%;
					overflow: hidden;
					transition: transform 0.3s ease;
				}

				.postUser:hover .postUserPic {
					transform: scale(1.1);
				}

				.postUserPic img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.postUsername {
					font-weight: 600;
					font-size: 14px;
					cursor: pointer;
					transition: color 0.2s ease;
				}

				.postUsername:hover {
					color: var(--accent-color);
				}

				.postImage {
					width: 100%;
					position: relative;
					overflow: hidden;
				}

				.postImage img {
					width: 100%;
					height: auto;
					max-height: 767px;
					object-fit: cover;
					transition: transform 0.5s ease;
					cursor: pointer;
				}

				.postImage:hover img {
					transform: scale(1.02);
				}

				.postActions {
					display: flex;
					justify-content: space-between;
					padding: 8px 16px;
				}

				.mainActions {
					display: flex;
					gap: 16px;
				}

				.actionIcon {
					cursor: pointer;
					transition: transform 0.2s ease, color 0.2s ease;
				}

				.actionIcon:hover {
					transform: scale(1.1);
				}

				.actionIcon.liked {
					color: var(--like-color);
				}

				.actionIcon.saved {
					color: var(--text-primary);
				}

				.actionIcon.moreActions {
					opacity: 0.7;
					transition: opacity 0.2s ease;
				}

				.actionIcon.moreActions:hover {
					opacity: 1;
				}

				.actionIcon.sendIcon {
					transform: rotate(-20deg);
					transition: transform 0.2s ease;
				}

				.actionIcon.sendIcon:hover {
					transform: scale(1.1) rotate(-20deg);
				}

				.postInfo {
					padding: 0 16px 16px;
				}

				.likes {
					font-weight: 600;
					font-size: 14px;
					margin-bottom: 8px;
				}

				.caption {
					font-size: 14px;
					margin-bottom: 8px;
				}

				.captionUsername,
				.commentUsername {
					font-weight: 600;
					margin-right: 4px;
					cursor: pointer;
					transition: color 0.2s ease;
				}

				.captionUsername:hover,
				.commentUsername:hover {
					color: var(--accent-color);
				}

				.viewComments {
					color: var(--text-secondary);
					font-size: 14px;
					cursor: pointer;
					margin-bottom: 8px;
					transition: color 0.2s ease;
				}

				.viewComments:hover {
					color: var(--text-primary);
				}

				.comments {
					max-height: 0;
					overflow: hidden;
					transition: max-height 0.3s ease;
				}

				.comments.show {
					max-height: 300px;
					margin-bottom: 8px;
				}

				.comment {
					font-size: 14px;
					margin-bottom: 4px;
					transition: background-color 0.2s ease;
					padding: 3px 0;
					border-radius: 4px;
				}

				.comment:hover {
					background-color: var(--bg-primary);
				}

				.timePosted {
					color: var(--text-secondary);
					font-size: 10px;
					text-transform: uppercase;
					margin-bottom: 8px;
				}

				.addComment {
					display: flex;
					justify-content: space-between;
					padding: 16px;
					border-top: 1px solid var(--border-color);
				}

				.addComment input {
					width: 90%;
					border: none;
					outline: none;
					font-size: 14px;
				}

				.addComment button {
					color: var(--accent-color);
					font-weight: 600;
					border: none;
					background-color: transparent;
					cursor: pointer;
					opacity: 0.7;
					transition: opacity 0.2s ease;
				}

				.addComment button:hover {
					opacity: 1;
				}

				.profileContainer {
					background-color: var(--bg-secondary);
					border-radius: 8px;
					border: 1px solid var(--border-color);
					margin-bottom: 24px;
					width: 100%;
				}

				.profileHeader {
					display: flex;
					padding: 32px 16px;
					border-bottom: 1px solid var(--border-color);
				}

				.profileHeaderLeft {
					flex: 0 0 150px;
					margin-right: 32px;
					display: flex;
					justify-content: center;
				}

				.profilePicLarge {
					width: 150px;
					height: 150px;
					border-radius: 50%;
					overflow: hidden;
					transition: transform 0.3s ease;
				}

				.profilePicLarge:hover {
					transform: scale(1.05);
				}

				.profilePicLarge img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.profileHeaderRight {
					flex: 1;
				}

				.profileUsername {
					display: flex;
					align-items: center;
					margin-bottom: 20px;
				}

				.profileUsername h2 {
					font-size: 28px;
					font-weight: 300;
					margin-right: 20px;
					color: var(--text-primary);
				}

				.editProfileBtn {
					background: transparent;
					border: 1px solid var(--border-color);
					border-radius: 4px;
					padding: 5px 9px;
					font-weight: 600;
					font-size: 14px;
					cursor: pointer;
					color: var(--text-primary);
					transition: background-color 0.2s ease, border-color 0.2s ease;
				}

				.editProfileBtn:hover {
					background-color: var(--bg-primary);
					border-color: var(--text-secondary);
				}

				.profileStats {
					display: flex;
					margin-bottom: 20px;
				}

				.profileStat {
					margin-right: 40px;
					font-size: 16px;
					color: var(--text-primary);
					transition: transform 0.2s ease;
					cursor: pointer;
				}

				.profileStat:hover {
					transform: translateY(-2px);
				}

				.statNumber {
					font-weight: 600;
				}

				.profileBio {
					font-size: 14px;
					color: var(--text-primary);
				}

				.fullName {
					font-weight: 600;
					margin-bottom: 5px;
				}

				.bioText {
					white-space: pre-line;
				}

				.profileTabs {
					display: flex;
					border-bottom: 1px solid var(--border-color);
				}

				.profileTab {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 16px 0;
					cursor: pointer;
					color: var(--text-secondary);
					border-top: 1px solid transparent;
					gap: 6px;
					transition: color 0.3s ease, border-color 0.3s ease;
				}

				.profileTab.active {
					color: var(--text-primary);
					border-top: 1px solid var(--text-primary);
				}

				.profileTab svg {
					width: 12px;
					height: 12px;
				}

				.profileTab span {
					font-size: 12px;
					font-weight: 600;
					letter-spacing: 1px;
				}

				.profileGrid {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 2px;
					padding: 2px;
				}

				.gridItem {
					aspect-ratio: 1;
					position: relative;
					cursor: pointer;
					overflow: hidden;
				}

				.gridItem img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					transition: transform 0.4s ease;
				}

				.gridItemOverlay {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(0, 0, 0, 0.3);
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 20px;
					color: white;
					opacity: 0;
					transition: opacity 0.3s ease, background 0.3s ease;
				}

				.gridItem:hover .gridItemOverlay {
					opacity: 1;
				}

				.gridItem:hover img {
					transform: scale(1.1);
				}

				.gridItemOverlay span {
					display: flex;
					align-items: center;
					gap: 6px;
					font-weight: 600;
				}

				.noPostsMessage {
					grid-column: 1 / -1;
					padding: 40px 0;
					text-align: center;
					color: var(--text-secondary);
				}

				.createPostContainer {
					background-color: var(--bg-secondary);
					border-radius: 8px;
					border: 1px solid var(--border-color);
					margin-bottom: 24px;
					overflow: hidden;
					width: 100%;
					animation: scaleIn 0.3s ease;
				}

				@keyframes scaleIn {
					from {
						transform: scale(0.95);
						opacity: 0;
					}
					to {
						transform: scale(1);
						opacity: 1;
					}
				}

				.createPostHeader {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 10px 16px;
					border-bottom: 1px solid var(--border-color);
				}

				.createPostHeader h2 {
					font-size: 16px;
					font-weight: 600;
					color: var(--text-primary);
				}

				.closeButton {
					background: none;
					border: none;
					cursor: pointer;
					padding: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--text-primary);
					transition: transform 0.2s ease, color 0.2s ease;
				}

				.closeButton:hover {
					transform: scale(1.1);
					color: var(--accent-color);
				}

				.closeButton svg {
					width: 20px;
					height: 20px;
				}

				.createPostContent {
					padding: 0;
				}

				.uploadArea {
					padding: 60px 20px;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					border: 2px dashed var(--border-color);
					margin: 20px;
					border-radius: 8px;
					transition: border-color 0.3s ease, background-color 0.3s ease;
				}

				.uploadArea:hover {
					border-color: var(--accent-color);
					background-color: rgba(0, 149, 246, 0.05);
				}

				.uploadIcon {
					margin-bottom: 20px;
					color: var(--text-primary);
					transition: transform 0.3s ease, color 0.3s ease;
				}

				.uploadArea:hover .uploadIcon {
					transform: scale(1.2);
					color: var(--accent-color);
				}

				.uploadIcon svg {
					width: 48px;
					height: 48px;
				}

				.uploadArea p {
					font-size: 14px;
					color: var(--text-secondary);
					transition: color 0.3s ease;
				}

				.uploadArea:hover p {
					color: var(--accent-color);
				}

				.createPostPreview {
					display: flex;
					flex-direction: column;
				}

				.previewImage {
					position: relative;
					width: 100%;
					max-height: 350px;
					overflow: hidden;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: var(--bg-primary);
				}

				.previewImage img {
					max-width: 100%;
					max-height: 350px;
					object-fit: contain;
					animation: fadeIn 0.5s ease;
				}

				.changeImageBtn {
					position: absolute;
					bottom: 10px;
					right: 10px;
					background-color: rgba(0, 0, 0, 0.7);
					color: white;
					border: none;
					border-radius: 4px;
					padding: 8px 12px;
					font-size: 12px;
					cursor: pointer;
					transition: background-color 0.2s ease, transform 0.2s ease;
				}

				.changeImageBtn:hover {
					background-color: rgba(0, 0, 0, 0.9);
					transform: translateY(-2px);
				}

				.createPostDetails {
					padding: 16px;
				}

				.createPostUser {
					display: flex;
					align-items: center;
					gap: 10px;
					margin-bottom: 16px;
				}

				.captionTextarea {
					width: 100%;
					border: none;
					outline: none;
					resize: none;
					font-size: 14px;
					margin-bottom: 16px;
					padding: 12px;
					border: 1px solid var(--border-color);
					border-radius: 4px;
					background-color: var(--bg-primary);
					color: var(--text-primary);
					transition: border-color 0.2s ease, box-shadow 0.2s ease;
				}

				.captionTextarea:focus {
					border-color: var(--accent-color);
					box-shadow: 0 0 0 1px var(--accent-color);
				}

				.createPostWarning {
					margin-bottom: 16px;
					padding: 12px;
					background-color: rgba(255, 204, 0, 0.1);
					border-left: 4px solid #ffcc00;
					border-radius: 4px;
					display: flex;
					align-items: flex-start;
					gap: 12px;
					animation: slideInLeft 0.5s ease;
				}

				@keyframes slideInLeft {
					from {
						transform: translateX(-20px);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}

				.warningIcon {
					font-size: 20px;
				}

				.warningText {
					flex: 1;
				}

				.warningTitle {
					font-weight: 600;
					margin-bottom: 4px;
					color: #cc9900;
				}

				.warningText p:last-child {
					font-size: 12px;
					line-height: 1.4;
					color: var(--text-secondary);
				}

				.createPostBtn {
					width: 100%;
					background-color: var(--accent-color);
					opacity: 0.7;
					color: white;
					border: none;
					border-radius: 4px;
					padding: 8px 0;
					font-weight: 600;
					cursor: pointer;
					transition: opacity 0.2s ease, transform 0.2s ease;
				}

				.createPostBtn.active {
					opacity: 1;
				}

				.createPostBtn.active:hover {
					transform: translateY(-2px);
					box-shadow: 0 2px 8px rgba(0, 149, 246, 0.3);
				}

				.createPostBtn:disabled {
					opacity: 0.3;
					cursor: not-allowed;
					transform: none !important;
					box-shadow: none !important;
				}

				.sidebar {
					flex-direction: column;
					width: 293px;
					position: sticky;
					top: 84px;
					padding-top: 24px;
					margin-left: 28px;
					height: fit-content;
					animation: fadeInRight 0.5s ease;
				}

				@keyframes fadeInRight {
					from {
						transform: translateX(20px);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}

				.sidebarUserProfile {
					display: flex;
					align-items: center;
					margin-bottom: 24px;
				}

				.sidebarUserPic {
					width: 56px;
					height: 56px;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 12px;
					transition: transform 0.3s ease;
				}

				.sidebarUserPic:hover {
					transform: scale(1.05);
				}

				.sidebarUserPic img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.sidebarUserInfo {
					flex: 1;
				}

				.sidebarUsername {
					font-weight: 600;
					font-size: 14px;
					color: var(--text-primary);
					cursor: pointer;
					transition: color 0.2s ease;
				}

				.sidebarUsername:hover {
					color: var(--accent-color);
				}

				.sidebarFullName {
					font-size: 14px;
					color: var(--text-secondary);
				}

				.switchButton {
					background: none;
					border: none;
					color: var(--accent-color);
					font-weight: 600;
					font-size: 12px;
					cursor: pointer;
					transition: color 0.2s ease;
				}

				.switchButton:hover {
					color: var(--accent-hover);
				}

				.suggestions {
					margin-bottom: 24px;
					animation: fadeIn 0.5s ease;
					animation-delay: 0.2s;
					animation-fill-mode: both;
				}

				.suggestionsHeader {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14px;
				}

				.suggestionsHeader span {
					font-size: 14px;
					font-weight: 600;
					color: var(--text-secondary);
				}

				.suggestionsHeader button {
					background: none;
					border: none;
					font-size: 12px;
					font-weight: 600;
					color: var(--text-primary);
					cursor: pointer;
					transition: color 0.2s ease;
				}

				.suggestionsHeader button:hover {
					color: var(--accent-color);
				}

				.suggestion {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14px;
					padding: 6px 0;
					border-radius: 4px;
					transition: background-color 0.2s ease;
				}

				.suggestion:hover {
					background-color: var(--bg-primary);
				}

				.suggestionLeft {
					display: flex;
					align-items: center;
				}

				.suggestionPic {
					width: 32px;
					height: 32px;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 12px;
					transition: transform 0.3s ease;
				}

				.suggestion:hover .suggestionPic {
					transform: scale(1.1);
				}

				.suggestionPic img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.suggestionInfo {
					display: flex;
					flex-direction: column;
				}

				.suggestionUsername {
					font-size: 14px;
					font-weight: 600;
					color: var(--text-primary);
					cursor: pointer;
					transition: color 0.2s ease;
				}

				.suggestionUsername:hover {
					color: var(--accent-color);
				}

				.suggestionReason {
					font-size: 12px;
					color: var(--text-secondary);
				}

				.followButton {
					background: none;
					border: none;
					color: var(--accent-color);
					font-weight: 600;
					font-size: 12px;
					cursor: pointer;
					transition: color 0.2s ease, transform 0.2s ease;
				}

				.followButton:hover {
					color: var(--accent-hover);
					transform: scale(1.05);
				}

				.footerLinks {
					color: var(--text-secondary);
					font-size: 12px;
					animation: fadeIn 0.5s ease;
					animation-delay: 0.4s;
					animation-fill-mode: both;
				}

				.links {
					margin-bottom: 16px;
					line-height: 1.6;
				}

				.links a {
					color: var(--text-secondary);
					text-decoration: none;
					margin: 0 2px;
					transition: color 0.2s ease;
				}

				.links a:hover {
					color: var(--text-primary);
					text-decoration: underline;
				}

				.copyright {
					font-size: 12px;
					color: var(--text-secondary);
					text-transform: uppercase;
				}

				@media (min-width: 1025px) {
					.main {
						padding-top: 84px;
						width: 975px;
						max-width: 100%;
						margin: 0 auto;
						display: flex;
						flex-direction: row;
						justify-content: space-between;
					}

					.content {
						width: 614px;
					}

					.searchResults {
						position: absolute;
						top: 60px;
						width: 375px;
						left: 50%;
						transform: translateX(-50%);
						box-shadow: 0 0 5px var(--shadow-color);
						z-index: 50;
					}
				}

				@media (min-width: 768px) and (max-width: 1024px) {
					.main {
						width: 100%;
						max-width: 614px;
						margin: 0 auto;
					}

					.content {
						width: 100%;
					}

					.searchResults {
						width: 100%;
						margin: 0 auto 24px;
					}
				}

				@media (max-width: 768px) {
					.main {
						flex-direction: column;
						width: 100%;
						max-width: 614px;
					}

					.content {
						width: 100%;
						margin-right: 0;
						margin-bottom: 70px;
					}

					.sidebar {
						display: none !important;
					}

					.mobileNavBar {
						display: flex !important;
						position: fixed;
						bottom: 0;
						left: 0;
						right: 0;
						height: 50px;
						background-color: var(--bg-secondary);
						border-top: 1px solid var(--border-color);
						z-index: 100;
						animation: slideUp 0.3s ease;
					}

					@keyframes slideUp {
						from {
							transform: translateY(100%);
						}
						to {
							transform: translateY(0);
						}
					}

					.navContainer {
						padding: 0 10px;
					}

					.searchBar {
						display: none;
					}

					.post {
						border-radius: 0;
						border-left: none;
						border-right: none;
					}

					.stories {
						border-left: none;
						border-right: none;
						border-radius: 0;
					}

					.profileContainer,
					.searchResults,
					.createPostContainer {
						border-radius: 0;
						border-left: none;
						border-right: none;
					}

					.profileHeader {
						flex-direction: column;
						align-items: center;
						padding: 16px;
					}

					.profileHeaderLeft {
						margin-right: 0;
						margin-bottom: 20px;
					}

					.profileHeaderRight {
						display: flex;
						flex-direction: column;
						align-items: center;
						text-align: center;
					}

					.profileUsername {
						flex-direction: column;
						gap: 10px;
					}

					.profileStats {
						justify-content: space-around;
						width: 100%;
					}

					.profileStat {
						margin-right: 0;
						text-align: center;
					}

					.searchResults {
						margin-top: 0;
						border-left: none;
						border-right: none;
						border-radius: 0;
					}

					.profileGrid {
						grid-template-columns: repeat(3, 1fr);
						gap: 1px;
					}

					.createPostPreview {
						flex-direction: column;
					}

					.previewImage {
						border-bottom: 1px solid var(--border-color);
					}

					.navIcons {
						gap: 16px;
					}

					.navbar .navIcons {
						display: none;
					}

					.navbar {
						height: 44px;
						border-bottom: none;
						box-shadow: none;
					}

					.logo h1 {
						font-size: 24px;
					}

					.postHeader {
						padding: 8px 12px;
					}

					.postActions {
						padding: 6px 12px;
					}

					.postInfo {
						padding: 0 12px 12px;
					}

					.storyRing {
						width: 62px;
						height: 62px;
					}

					.storyRing img {
						width: 58px;
						height: 58px;
					}

					.stories {
						padding: 8px 0;
						background: transparent;
						box-shadow: none;
						border: none;
						margin-top: 0;
					}

					.container::before {
						content: "";
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						height: 100vh;
						background: linear-gradient(
							45deg,
							#f09433,
							#e6683c,
							#dc2743,
							#cc2366,
							#bc1888
						);
						opacity: 0.05;
						z-index: -1;
					}

					.sidebar {
						display: none;
					}
				}

				@media (max-width: 375px) {
					.navIcons {
						gap: 12px;
					}

					.profileStats {
						font-size: 14px;
					}

					.profileGrid {
						grid-template-columns: repeat(2, 1fr);
					}
				}

				.mobileNavBar {
					position: fixed;
					bottom: 0;
					left: 0;
					right: 0;
					height: 50px;
					background-color: var(--bg-secondary);
					border-top: 1px solid var(--border-color);
					display: none;
					align-items: center;
					justify-content: space-around;
					padding: 0 20px;
					z-index: 100;
				}

				.mobileNavBar .navIcon {
					transition: transform 0.2s ease, color 0.2s ease;
				}

				.mobileNavBar .navIcon:hover,
				.mobileNavBar .navIcon.active {
					color: var(--accent-color);
					transform: translateY(-3px);
				}

				.mobileProfilePic {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					overflow: hidden;
				}

				.mobileProfilePic img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.searchResults {
					background-color: var(--bg-secondary);
					border: 1px solid var(--border-color);
					border-radius: 8px;
					margin-bottom: 24px;
					padding: 16px;
					width: 614px;
					max-width: 100%;
					margin: 0 auto 24px;
					box-shadow: 0 0 5px var(--shadow-color);
				}

				.searchView {
					width: 100%;
					height: 100%;
					background-color: var(--bg-secondary);
					display: flex;
					flex-direction: column;
					animation: fadeIn 0.3s ease;
				}

				.searchViewHeader {
					display: flex;
					align-items: center;
					padding: 10px 16px;
					border-bottom: 1px solid var(--border-color);
					background-color: var(--bg-secondary);
					position: sticky;
					top: 0;
					z-index: 10;
				}

				.mobileSearchBar {
					flex: 1;
					display: flex;
					align-items: center;
					background-color: var(--input-bg);
					border-radius: 8px;
					padding: 0 12px;
					height: 36px;
					position: relative;
				}

				.cancelButton {
					background: none;
					border: none;
					color: var(--accent-color);
					font-weight: 600;
					font-size: 14px;
					padding: 0 0 0 16px;
					cursor: pointer;
					transition: opacity 0.2s ease;
				}

				.cancelButton:hover {
					opacity: 0.8;
				}

				.mobileSearchResults {
					width: 100%;
					margin: 0;
					border: none;
					box-shadow: none;
					border-radius: 0;
				}

				.exploreGrid {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 2px;
					padding: 2px;
					width: 100%;
					animation: fadeIn 0.4s ease;
				}

				.exploreItem {
					aspect-ratio: 1;
					position: relative;
					overflow: hidden;
				}

				.exploreItem img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					transition: transform 0.4s ease;
				}

				.exploreItem:hover img {
					transform: scale(1.05);
				}

				.mobileToggle {
					position: absolute;
					right: 20px;
					top: 50%;
					transform: translateY(-50%);
					background: none;
					border: none;
					cursor: pointer;
					display: none;
					color: var(--text-primary);
					z-index: 10;
					align-items: center;
					justify-content: center;
					width: 32px;
					height: 32px;
				}

				.mobileToggle svg {
					width: 24px;
					height: 24px;
				}

				@media (max-width: 768px) {
					.mobileToggle {
						display: flex;
					}

					.logo {
						flex: 1;
						display: flex;
						justify-content: center;
					}

					.logo h1 {
						font-size: 24px;
					}
				}
			`}</style>

			<style jsx global>{`
				* {
					box-sizing: border-box;
					margin: 0;
					padding: 0;
					font-family: "Roboto", sans-serif;
				}

				body {
					background-color: var(--bg-primary, #fafafa);
					transition: background-color 0.3s ease;
				}

				mark {
					background-color: #ffcc80;
					padding: 0;
					border-radius: 2px;
				}

				html {
					scroll-behavior: smooth;
				}

				::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}

				::-webkit-scrollbar-track {
					background: var(--bg-primary);
				}

				::-webkit-scrollbar-thumb {
					background: var(--border-color);
					border-radius: 4px;
				}

				::-webkit-scrollbar-thumb:hover {
					background: var(--text-secondary);
				}

				* {
					-webkit-tap-highlight-color: transparent;
				}

				button:focus,
				input:focus,
				textarea:focus {
					outline: none;
				}

				* {
					transition-property: color, background-color, border-color, opacity,
						box-shadow, transform;
					transition-duration: 0.2s;
					transition-timing-function: ease;
				}
			`}</style>
		</div>
	);
}