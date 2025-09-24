"use client";
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

interface User {
	id: number;
	name: string;
	username: string;
	bio: string;
	interests: string[];
	avatar: string;
	followers: number;
	following: number;
}

interface Comment {
	id: number;
	userId: number;
	username: string;
	text: string;
	timestamp: string;
}

interface Post {
	id: number;
	userId: number;
	username: string;
	userAvatar: string;
	content: string;
	image: string;
	timestamp: string;
	likes: number;
	comments: Comment[];
}

interface Message {
	id: number;
	senderId: number;
	text: string;
	timestamp: string;
}

interface Conversations {
	[key: string]: Message[];
}

export default function SocialFeedExport() {
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const initialUsers: User[] = [
		{
			id: 1,
			name: "Alex Johnson",
			username: "alexj",
			bio: "Photography enthusiast and travel lover",
			interests: ["photography", "travel", "hiking"],
			avatar: "https://randomuser.me/api/portraits/men/1.jpg",
			followers: 124,
			following: 56,
		},
		{
			id: 2,
			name: "Sam Wilson",
			username: "samwilson",
			bio: "Food blogger and home chef",
			interests: ["cooking", "food photography", "baking"],
			avatar: "https://randomuser.me/api/portraits/women/2.jpg",
			followers: 89,
			following: 112,
		},
		{
			id: 3,
			name: "Taylor Smith",
			username: "taylorskydiver",
			bio: "Extreme sports athlete and adventure seeker",
			interests: ["skydiving", "rock climbing", "snowboarding"],
			avatar: "https://randomuser.me/api/portraits/men/3.jpg",
			followers: 215,
			following: 78,
		},
		{
			id: 4,
			name: "Jordan Lee",
			username: "jordanlee",
			bio: "Digital artist and gaming enthusiast",
			interests: ["digital art", "gaming", "anime"],
			avatar: "https://randomuser.me/api/portraits/women/4.jpg",
			followers: 178,
			following: 92,
		},
		{
			id: 5,
			name: "Diana daniles",
			username: "caseymorgan",
			bio: "Musician and instrument collector",
			interests: ["guitar", "piano", "music production"],
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
			followers: 156,
			following: 104,
		},
		{
			id: 6,
			name: "Jamie nada",
			username: "jamieRivers",
			bio: "Book lover and aspiring writer",
			interests: ["reading", "writing", "poetry"],
			avatar: "https://randomuser.me/api/portraits/women/6.jpg",
			followers: 98,
			following: 77,
		},
		{
			id: 7,
			name: "Riley Parker",
			username: "rileyp",
			bio: "Fitness trainer and nutrition enthusiast",
			interests: ["fitness", "nutrition", "yoga"],
			avatar: "https://randomuser.me/api/portraits/men/7.jpg",
			followers: 245,
			following: 112,
		},
	];

	const initialPosts: Post[] = [
		{
			id: 1,
			userId: 1,
			username: "alexj",
			userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
			content:
				"Just captured this beautiful sunset at the beach yesterday! #photography #sunset",
			image:
				"https://plus.unsplash.com/premium_photo-1673002094195-f18084be89ce?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			timestamp: "2023-06-15T14:30:00Z",
			likes: 24,
			comments: [
				{
					id: 1,
					userId: 2,
					username: "samwilson",
					text: "Amazing shot!",
					timestamp: "2023-06-15T15:12:00Z",
				},
				{
					id: 2,
					userId: 3,
					username: "taylorskydiver",
					text: "That looks incredible!",
					timestamp: "2023-06-15T16:45:00Z",
				},
			],
		},
		{
			id: 2,
			userId: 2,
			username: "samwilson",
			userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
			content:
				"Tried a new chocolate cake recipe today. It came out perfect! #baking #dessert",
			image:
				"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			timestamp: "2023-06-14T19:15:00Z",
			likes: 18,
			comments: [
				{
					id: 3,
					userId: 1,
					username: "alexj",
					text: "That looks delicious! Recipe?",
					timestamp: "2023-06-14T20:30:00Z",
				},
			],
		},
		{
			id: 3,
			userId: 3,
			username: "taylorskydiver",
			userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
			content:
				"First skydive of the season! The adrenaline rush is unmatched. #skydiving #adventure",
			image:
				"https://images.unsplash.com/photo-1630879937467-4afa290b1a6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			timestamp: "2023-06-13T11:20:00Z",
			likes: 42,
			comments: [],
		},
		{
			id: 4,
			userId: 4,
			username: "jordanlee",
			userAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
			content:
				"Just finished this digital artwork inspired by my favorite game. 40+ hours of work but totally worth it! #digitalart #gaming",
			image:
				"https://plus.unsplash.com/premium_photo-1685200149585-b341370fd974?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			timestamp: "2023-06-12T09:45:00Z",
			likes: 67,
			comments: [
				{
					id: 4,
					userId: 5,
					username: "caseymorgan",
					text: "The details are incredible!",
					timestamp: "2023-06-12T10:20:00Z",
				},
			],
		},
		{
			id: 5,
			userId: 5,
			username: "caseymorgan",
			userAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
			content:
				"Added a new vintage guitar to my collection today. The tone is absolutely perfect! #music #guitar #vintage",
			image:
				"https://plus.unsplash.com/premium_photo-1661315456164-a095579e1c77?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			timestamp: "2023-06-11T16:30:00Z",
			likes: 33,
			comments: [
				{
					id: 5,
					userId: 1,
					username: "alexj",
					text: "Beautiful instrument!",
					timestamp: "2023-06-11T17:15:00Z",
				},
			],
		},
		{
			id: 6,
			userId: 6,
			username: "jamieRivers",
			userAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
			content:
				'Just finished reading "The Midnight Library". Highly recommend! #books #reading',
			image:
				"https://images.unsplash.com/photo-1711896099542-53253887088a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			timestamp: "2023-06-10T10:45:00Z",
			likes: 29,
			comments: [],
		},
		{
			id: 7,
			userId: 7,
			username: "rileyp",
			userAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
			content:
				"Morning workout complete! Nothing beats the feeling after a good training session. #fitness #motivation",
			image:
				"https://images.unsplash.com/photo-1418874586588-88661ed80c4a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			timestamp: "2023-06-09T08:30:00Z",
			likes: 45,
			comments: [
				{
					id: 6,
					userId: 2,
					username: "samwilson",
					text: "You're making me feel guilty for skipping my workout!",
					timestamp: "2023-06-09T09:15:00Z",
				},
			],
		},
	];

	const [users, setUsers] = useState<User[]>(initialUsers);
	const [posts, setPosts] = useState<Post[]>(initialPosts);
	const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [view, setView] = useState<
		"feed" | "profile" | "messages" | "discover" | "editProfile"
	>("feed");
	const [newPostContent, setNewPostContent] = useState<string>("");
	const [newCommentTexts, setNewCommentTexts] = useState<
		Record<number, string>
	>({});
	const [messageRecipient, setMessageRecipient] = useState<User | null>(null);
	const [messageContent, setMessageContent] = useState<string>("");
	const [conversations, setConversations] = useState<Conversations>({});
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
	const [showNotifications, setShowNotifications] = useState<boolean>(false);
	const [friendsOnline, setFriendsOnline] = useState<number[]>([2, 3, 5]);
	const mainContentRef = useRef<HTMLDivElement>(null);

	const [editName, setEditName] = useState<string>("");
	const [editUsername, setEditUsername] = useState<string>("");
	const [editBio, setEditBio] = useState<string>("");
	const [editInterests, setEditInterests] = useState<string>("");
	const [editAvatar, setEditAvatar] = useState<string>("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const prefersDark =
				window.matchMedia &&
				window.matchMedia("(prefers-color-scheme: dark)").matches;
			setDarkMode(prefersDark);
		}

		setConversations({
			"1-2": [
				{
					id: 1,
					senderId: 1,
					text: "Hey Sam, your cake looks amazing!",
					timestamp: "2023-06-14T21:00:00Z",
				},
				{
					id: 2,
					senderId: 2,
					text: "Thanks Alex! I can share the recipe if you want",
					timestamp: "2023-06-14T21:15:00Z",
				},
			],
			"1-3": [
				{
					id: 3,
					senderId: 1,
					text: "That skydiving photo is epic!",
					timestamp: "2023-06-13T13:30:00Z",
				},
				{
					id: 4,
					senderId: 3,
					text: "Thanks! You should try it sometime!",
					timestamp: "2023-06-13T14:20:00Z",
				},
			],
			"1-5": [
				{
					id: 5,
					senderId: 1,
					text: "Which guitar would you recommend for a beginner?",
					timestamp: "2023-06-15T09:30:00Z",
				},
				{
					id: 6,
					senderId: 5,
					text: "I'd suggest starting with a Yamaha FG800, great sound quality for the price!",
					timestamp: "2023-06-15T10:45:00Z",
				},
				{
					id: 7,
					senderId: 1,
					text: "Thanks for the recommendation!",
					timestamp: "2023-06-15T11:20:00Z",
				},
			],
			"1-6": [
				{
					id: 8,
					senderId: 6,
					text: "Have you read any good books lately?",
					timestamp: "2023-06-14T15:30:00Z",
				},
				{
					id: 9,
					senderId: 1,
					text: 'I just finished "Project Hail Mary" - it was fantastic!',
					timestamp: "2023-06-14T16:15:00Z",
				},
			],
			"1-7": [
				{
					id: 10,
					senderId: 7,
					text: "Hey Alex, I saw your hiking photos. Where was that trail?",
					timestamp: "2023-06-12T14:25:00Z",
				},
				{
					id: 11,
					senderId: 1,
					text: "That was at Eagle Peak - amazing views!",
					timestamp: "2023-06-12T15:10:00Z",
				},
			],
		});
	}, []);

	useEffect(() => {
		if (searchTerm) {
			const filtered = users.filter(
				(user) =>
					user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.interests.some((interest) =>
						interest.toLowerCase().includes(searchTerm.toLowerCase())
					)
			);
			setFilteredUsers(filtered);
		} else {
			setFilteredUsers(users);
		}
	}, [searchTerm, users]);

	useEffect(() => {
		if (darkMode) {
			document.body.classList.add("dark-mode");
		} else {
			document.body.classList.remove("dark-mode");
		}
	}, [darkMode]);

	useEffect(() => {
		if (mainContentRef.current) {
			mainContentRef.current.scrollTop = 0;
		}
	}, [view]);

	useEffect(() => {
		if (view === "editProfile" && currentUser) {
			setEditName(currentUser.name);
			setEditUsername(currentUser.username);
			setEditBio(currentUser.bio);
			setEditInterests(currentUser.interests.join(", "));
			setEditAvatar(currentUser.avatar);
		}
	}, [view, currentUser]);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	const handlePostSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newPostContent.trim()) return;

		const hashtags = newPostContent.match(/#\w+/g) || [];
		const imageKeyword =
			hashtags.length > 0
				? hashtags[0].substring(1)
				: ["nature", "art", "travel", "food", "technology"][
						Math.floor(Math.random() * 5)
				  ];

		const newPost: Post = {
			id: posts.length + 1,
			userId: currentUser.id,
			username: currentUser.username,
			userAvatar: currentUser.avatar,
			content: newPostContent,
			image: `https://source.unsplash.com/random/400x300/?${imageKeyword}`,
			timestamp: new Date().toISOString(),
			likes: 0,
			comments: [],
		};

		setPosts([newPost, ...posts]);
		setNewPostContent("");
	};

	const handleLike = (postId: number) => {
		setPosts(
			posts.map((post) =>
				post.id === postId ? { ...post, likes: post.likes + 1 } : post
			)
		);
	};

	const handleAddComment = (postId: number) => {
		if (!newCommentTexts[postId]?.trim()) return;

		const newComment: Comment = {
			id: Date.now(),
			userId: currentUser.id,
			username: currentUser.username,
			text: newCommentTexts[postId],
			timestamp: new Date().toISOString(),
		};

		setPosts(
			posts.map((post) =>
				post.id === postId
					? { ...post, comments: [...post.comments, newComment] }
					: post
			)
		);

		setNewCommentTexts({ ...newCommentTexts, [postId]: "" });
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageContent.trim() || !messageRecipient) return;

		const newMessage: Message = {
			id: Date.now(),
			senderId: currentUser.id,
			text: messageContent,
			timestamp: new Date().toISOString(),
		};

		const conversationKey =
			currentUser.id < messageRecipient.id
				? `${currentUser.id}-${messageRecipient.id}`
				: `${messageRecipient.id}-${currentUser.id}`;

		const updatedConversations = {
			...conversations,
			[conversationKey]: [
				...(conversations[conversationKey] || []),
				newMessage,
			],
		};

		setConversations(updatedConversations);
		setMessageContent("");
	};

	const handleFollowUser = (user: User) => {
		setUsers(
			users.map((u) =>
				u.id === user.id
					? { ...u, followers: u.followers + 1 }
					: u.id === currentUser.id
					? { ...u, following: u.following + 1 }
					: u
			)
		);
	};

	const handleProfileUpdate = (e: React.FormEvent) => {
		e.preventDefault();

		const updatedUser: User = {
			...currentUser,
			name: editName,
			username: editUsername,
			bio: editBio,
			interests: editInterests.split(",").map((interest) => interest.trim()),
			avatar: editAvatar,
		};

		setUsers(
			users.map((user) => (user.id === currentUser.id ? updatedUser : user))
		);

		setCurrentUser(updatedUser);

		setPosts(
			posts.map((post) =>
				post.userId === currentUser.id
					? { ...post, username: editUsername, userAvatar: editAvatar }
					: post
			)
		);

		setView("profile");
		setSelectedUser(updatedUser);
	};

	const getConversationsForCurrentUser = () => {
		const userConversations: {
			user: User;
			lastMessage: Message | null;
			key: string;
		}[] = [];

		users
			.filter((user) => user.id !== currentUser.id)
			.forEach((user) => {
				const key1 = `${currentUser.id}-${user.id}`;
				const key2 = `${user.id}-${currentUser.id}`;
				const conversationKey = conversations[key1] ? key1 : key2;
				const conversation = conversations[conversationKey];

				if (conversation) {
					const sortedMessages = [...conversation].sort(
						(a, b) =>
							new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
					);
					userConversations.push({
						user,
						lastMessage: sortedMessages[0] || null,
						key: conversationKey,
					});
				} else {
					userConversations.push({
						user,
						lastMessage: null,
						key:
							currentUser.id < user.id
								? `${currentUser.id}-${user.id}`
								: `${user.id}-${currentUser.id}`,
					});
				}
			});

		return userConversations.sort((a, b) => {
			if (!a.lastMessage && !b.lastMessage) return 0;
			if (!a.lastMessage) return 1;
			if (!b.lastMessage) return -1;
			return (
				new Date(b.lastMessage.timestamp).getTime() -
				new Date(a.lastMessage.timestamp).getTime()
			);
		});
	};

	const renderSidebarNavigation = () => (
		<div
			className={`sidebar ${
				darkMode ? "bg-gray-900 text-white" : "bg-white"
			} h-full p-4 flex flex-col justify-between`}
		>
			<div>
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold tracking-tight">HobbyHub</h1>
				</div>

				<div className="space-y-2">
					<button
						onClick={() => {
							setView("feed");
							setMobileMenuOpen(false);
						}}
						className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer ${
							view === "feed"
								? darkMode
									? "bg-blue-600 text-white"
									: "bg-blue-100 text-blue-800"
								: darkMode
								? "hover:bg-gray-800"
								: "hover:bg-gray-100"
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
							/>
						</svg>
						<span>Feed</span>
					</button>

					<button
						onClick={() => {
							setView("discover");
							setMobileMenuOpen(false);
						}}
						className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer ${
							view === "discover"
								? darkMode
									? "bg-blue-600 text-white"
									: "bg-blue-100 text-blue-800"
								: darkMode
								? "hover:bg-gray-800"
								: "hover:bg-gray-100"
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
						<span>Discover</span>
					</button>

					<button
						onClick={() => {
							setView("messages");
							setMobileMenuOpen(false);
						}}
						className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer ${
							view === "messages"
								? darkMode
									? "bg-blue-600 text-white"
									: "bg-blue-100 text-blue-800"
								: darkMode
								? "hover:bg-gray-800"
								: "hover:bg-gray-100"
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
							/>
						</svg>
						<span>Messages</span>
					</button>

					<button
						onClick={() => {
							setView("profile");
							setSelectedUser(currentUser);
							setMobileMenuOpen(false);
						}}
						className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer ${
							(view === "profile" && selectedUser?.id === currentUser.id) ||
							view === "editProfile"
								? darkMode
									? "bg-blue-600 text-white"
									: "bg-blue-100 text-blue-800"
								: darkMode
								? "hover:bg-gray-800"
								: "hover:bg-gray-100"
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<span>Profile</span>
					</button>
				</div>
			</div>
			<div
				className={`mt-8 p-3 rounded-lg ${
					darkMode ? "bg-gray-800" : "bg-gray-50"
				}`}
			>
				<div className="flex items-center space-x-3">
					<img
						src={currentUser.avatar}
						alt={currentUser.name}
						className="w-10 h-10 rounded-full object-cover"
					/>
					<div>
						<p className="font-medium">{currentUser.name}</p>
						<p
							className={`text-sm ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							@{currentUser.username}
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	const renderHeader = () => (
		<header
			className={`fixed top-0 left-0 right-0 z-10 px-4 py-2 flex items-center justify-between shadow-sm ${
				darkMode
					? "bg-gray-900 text-white border-b border-gray-800"
					: "bg-white border-b border-gray-200"
			}`}
		>
			<div className="flex items-center">
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="mr-2 block md:hidden  cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</button>
				<h1 className="text-2xl font-bold tracking-tight">HobbyHub</h1>
			</div>

			<div className="flex items-center space-x-2">
				<button
					onClick={() => setShowNotifications(!showNotifications)}
					className="p-2 rounded-full relative cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
						/>
					</svg>
					<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
				</button>
				<button
					onClick={toggleDarkMode}
					className="p-2 rounded-full cursor-pointer"
				>
					{darkMode ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
							/>
						</svg>
					)}
				</button>
			</div>

			{showNotifications && (
				<div
					className={`absolute top-14 right-2 w-72 ${
						darkMode ? "bg-gray-800 shadow-xl" : "bg-white shadow-lg"
					} rounded-lg overflow-hidden z-20`}
				>
					<div
						className={`p-3 font-medium border-b ${
							darkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						Notifications
					</div>
					<div className="max-h-80 overflow-y-auto">
						<div
							className={`p-3 flex items-start space-x-3 ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
							}`}
						>
							<img
								src="https://randomuser.me/api/portraits/women/2.jpg"
								alt="User"
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div>
								<p
									className={`text-sm ${
										darkMode ? "text-gray-200" : "text-gray-800"
									}`}
								>
									<span className="font-medium">Sam Wilson</span> liked your
									post about photography
								</p>
								<p
									className={`text-xs ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									2 hours ago
								</p>
							</div>
						</div>
						<div
							className={`p-3 flex items-start space-x-3 ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
							}`}
						>
							<img
								src="https://randomuser.me/api/portraits/men/3.jpg"
								alt="User"
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div>
								<p
									className={`text-sm ${
										darkMode ? "text-gray-200" : "text-gray-800"
									}`}
								>
									<span className="font-medium">Taylor Smith</span> commented on
									your post
								</p>
								<p
									className={`text-xs ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									5 hours ago
								</p>
							</div>
						</div>
						<div
							className={`p-3 flex items-start space-x-3 ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
							}`}
						>
							<img
								src="https://randomuser.me/api/portraits/women/4.jpg"
								alt="User"
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div>
								<p
									className={`text-sm ${
										darkMode ? "text-gray-200" : "text-gray-800"
									}`}
								>
									<span className="font-medium">Jordan Lee</span> started
									following you
								</p>
								<p
									className={`text-xs ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Yesterday
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	);

	const renderFeed = () => (
		<div className="space-y-6 pb-20">
			<div
				className={`${
					darkMode ? "bg-gray-800 text-white" : "bg-white"
				} p-4 rounded-lg shadow-sm`}
			>
				<form onSubmit={handlePostSubmit} className="space-y-2">
					<div className="flex space-x-3">
						<img
							src={currentUser.avatar}
							alt={currentUser.username}
							className="w-10 h-10 rounded-full object-cover"
						/>
						<textarea
							className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								darkMode
									? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
									: "bg-white border-gray-300 placeholder-gray-500"
							}`}
							placeholder={`What's your latest hobby update, ${
								currentUser.name.split(" ")[0]
							}?`}
							rows={3}
							value={newPostContent}
							onChange={(e) => setNewPostContent(e.target.value)}
						></textarea>
					</div>
					<div className="flex justify-between items-center ml-12">
						<div className="flex space-x-2">
							<button
								type="button"
								className={`p-2 rounded-full cursor-pointer ${
									darkMode
										? "text-gray-300 hover:text-blue-400"
										: "text-gray-500 hover:text-blue-500"
								}`}
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
										d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</button>
							<button
								type="button"
								className={`p-2 rounded-full cursor-pointer ${
									darkMode
										? "text-gray-300 hover:text-blue-400"
										: "text-gray-500 hover:text-blue-500"
								}`}
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
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</button>
						</div>
						<button
							type="submit"
							className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Post
						</button>
					</div>
				</form>
			</div>

			{posts
				.sort(
					(a, b) =>
						new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
				)
				.map((post) => (
					<div
						key={post.id}
						className={`${
							darkMode ? "bg-gray-800 text-white" : "bg-white"
						} p-4 rounded-lg shadow-sm`}
					>
						<div className="flex items-start space-x-3">
							<img
								src={post.userAvatar}
								alt={post.username}
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between">
									<div>
										<button
											onClick={() => {
												setView("profile");
												setSelectedUser(
													users.find((u) => u.id === post.userId) || null
												);
											}}
											className="font-medium hover:underline cursor-pointer"
										>
											{post.username}
										</button>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{formatDate(post.timestamp)}
										</p>
									</div>
									<button
										className={`${
											darkMode
												? "text-gray-400 hover:text-gray-300"
												: "text-gray-500 hover:text-gray-700"
										} cursor-pointer`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
										</svg>
									</button>
								</div>
								<p className="mt-1 whitespace-pre-wrap break-words">
									{post.content}
								</p>
								{post.image && (
									<div className="mt-3 rounded-lg overflow-hidden">
										<img
											src={post.image}
											alt="Post content"
											className="w-full h-auto object-cover"
										/>
									</div>
								)}
								<div className="mt-4 flex items-center space-x-4">
									<button
										onClick={() => handleLike(post.id)}
										className={`flex items-center space-x-1 cursor-pointer ${
											darkMode
												? "text-gray-300 hover:text-blue-400"
												: "text-gray-500 hover:text-blue-500"
										}`}
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
												d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
											/>
										</svg>
										<span>{post.likes}</span>
									</button>
									<button
										className={`flex items-center space-x-1 cursor-pointer ${
											darkMode
												? "text-gray-300 hover:text-blue-400"
												: "text-gray-500 hover:text-blue-500"
										}`}
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
												d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
											/>
										</svg>
										<span>{post.comments.length}</span>
									</button>
									<button
										className={`flex items-center space-x-1 cursor-pointer ${
											darkMode
												? "text-gray-300 hover:text-blue-400"
												: "text-gray-500 hover:text-blue-500"
										}`}
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
												d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
											/>
										</svg>
										<span>Share</span>
									</button>
								</div>

								{post.comments.length > 0 && (
									<div
										className={`mt-4 space-y-3 pt-3 ${
											darkMode
												? "border-t border-gray-700"
												: "border-t border-gray-100"
										}`}
									>
										{post.comments.map((comment) => (
											<div key={comment.id} className="flex space-x-2">
												<img
													src={
														users.find((u) => u.id === comment.userId)
															?.avatar ||
														"https://randomuser.me/api/portraits/lego/1.jpg"
													}
													alt={comment.username}
													className="w-8 h-8 rounded-full object-cover"
												/>
												<div
													className={`flex-1 p-2 rounded-lg ${
														darkMode ? "bg-gray-700" : "bg-gray-50"
													}`}
												>
													<div className="flex items-center justify-between">
														<button
															onClick={() => {
																setView("profile");
																setSelectedUser(
																	users.find((u) => u.id === comment.userId) ||
																		null
																);
															}}
															className="font-medium text-sm hover:underline cursor-pointer"
														>
															{comment.username}
														</button>
														<span
															className={`text-xs ${
																darkMode ? "text-gray-400" : "text-gray-500"
															}`}
														>
															{formatDate(comment.timestamp)}
														</span>
													</div>
													<p className="text-sm mt-1">{comment.text}</p>
												</div>
											</div>
										))}
									</div>
								)}

								<div className="mt-4 flex space-x-2">
									<img
										src={currentUser.avatar}
										alt={currentUser.username}
										className="w-8 h-8 rounded-full object-cover"
									/>
									<div className="flex-1 relative">
										<input
											type="text"
											placeholder="Add a comment..."
											className={`w-full pl-3 pr-10 py-2 border rounded-full ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
													: "bg-white border-gray-300 placeholder-gray-500"
											}`}
											value={newCommentTexts[post.id] || ""}
											onChange={(e) =>
												setNewCommentTexts({
													...newCommentTexts,
													[post.id]: e.target.value,
												})
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleAddComment(post.id);
												}
											}}
										/>
										<button
											onClick={() => handleAddComment(post.id)}
											className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 cursor-pointer"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
		</div>
	);

	const renderMessages = () => (
		<div className={`space-y-4 h-full pb-20`}>
			<div
				className={`${
					darkMode ? "bg-gray-800 text-white" : "bg-white"
				} p-4 rounded-lg shadow-sm`}
			>
				<h2 className="text-xl font-semibold mb-4">Messages</h2>

				<div className="mb-6">
					<h3
						className={`text-sm font-medium mb-2 ${
							darkMode ? "text-gray-400" : "text-gray-500"
						}`}
					>
						Online Friends
					</h3>
					<div className="flex space-x-2 overflow-x-auto pb-2">
						{users
							.filter((user) => friendsOnline.includes(user.id))
							.map((user) => (
								<button
									key={user.id}
									onClick={() => {
										setMessageRecipient(user);
									}}
									className="flex flex-col items-center space-y-1 min-w-max cursor-pointer"
								>
									<div className="relative">
										<img
											src={user.avatar}
											alt={user.name}
											className="w-12 h-12 rounded-full object-cover"
										/>
										<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
									</div>
									<span className="text-xs">{user.name.split(" ")[0]}</span>
								</button>
							))}
					</div>
				</div>

				<div>
					<h3
						className={`text-sm font-medium mb-2 ${
							darkMode ? "text-gray-400" : "text-gray-500"
						}`}
					>
						Recent Conversations
					</h3>
					<div className="space-y-2">
						{getConversationsForCurrentUser().map(
							({ user, lastMessage, key }) => (
								<button
									key={key}
									onClick={() => setMessageRecipient(user)}
									className={`w-full flex items-center space-x-3 p-3 rounded-lg transition cursor-pointer ${
										messageRecipient?.id === user.id
											? darkMode
												? "bg-gray-700"
												: "bg-blue-50"
											: darkMode
											? "hover:bg-gray-700"
											: "hover:bg-gray-100"
									}`}
								>
									<div className="relative">
										<img
											src={user.avatar}
											alt={user.name}
											className="w-10 h-10 rounded-full object-cover"
										/>
										{friendsOnline.includes(user.id) && (
											<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
										)}
									</div>
									<div className="flex-1 min-w-0 text-left">
										<div className="flex justify-between items-baseline">
											<h4 className="font-medium truncate">{user.name}</h4>
											{lastMessage && (
												<span
													className={`text-xs ${
														darkMode ? "text-gray-400" : "text-gray-500"
													}`}
												>
													{new Date(lastMessage.timestamp).toLocaleDateString(
														undefined,
														{ month: "short", day: "numeric" }
													)}
												</span>
											)}
										</div>
										<p
											className={`text-sm truncate ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{lastMessage
												? `${
														lastMessage.senderId === currentUser.id
															? "You: "
															: ""
												  }${lastMessage.text}`
												: "Start a conversation"}
										</p>
									</div>
								</button>
							)
						)}
					</div>
				</div>
			</div>

			{messageRecipient && (
				<div
					className={`${
						darkMode ? "bg-gray-800 text-white" : "bg-white"
					} p-4 rounded-lg shadow-sm`}
				>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-3">
							<img
								src={messageRecipient.avatar}
								alt={messageRecipient.name}
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div>
								<h3 className="font-medium">{messageRecipient.name}</h3>
								<p
									className={`text-xs ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									{friendsOnline.includes(messageRecipient.id)
										? "Online"
										: "Offline"}
								</p>
							</div>
						</div>
						<button
							className={`${
								darkMode
									? "text-gray-400 hover:text-gray-300"
									: "text-gray-500 hover:text-gray-700"
							} cursor-pointer`}
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
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</button>
					</div>

					<div
						className={`min-h-64 max-h-96 overflow-y-auto mb-4 px-2 py-1 ${
							darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
						} rounded-lg`}
					>
						{(() => {
							const conversationKey =
								currentUser.id < messageRecipient.id
									? `${currentUser.id}-${messageRecipient.id}`
									: `${messageRecipient.id}-${currentUser.id}`;

							const conversation = conversations[conversationKey] || [];

							return conversation.length > 0 ? (
								<div className="space-y-3 py-3">
									{conversation.map((message) => (
										<div
											key={message.id}
											className={`flex ${
												message.senderId === currentUser.id
													? "justify-end"
													: "justify-start"
											}`}
										>
											<div
												className={`max-w-3/4 px-3 py-2 rounded-lg ${
													message.senderId === currentUser.id
														? darkMode
															? "bg-blue-600 text-white"
															: "bg-blue-500 text-white"
														: darkMode
														? "bg-gray-700"
														: "bg-white"
												}`}
											>
												<p className="text-sm">{message.text}</p>
												<p
													className={`text-xs mt-1 ${
														message.senderId === currentUser.id
															? "text-blue-200"
															: darkMode
															? "text-gray-400"
															: "text-gray-500"
													}`}
												>
													{formatDate(message.timestamp)}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="h-full flex items-center justify-center">
									<p
										className={`text-sm ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										No messages yet. Start a conversation!
									</p>
								</div>
							);
						})()}
					</div>

					<form onSubmit={handleSendMessage} className="flex space-x-2">
						<input
							type="text"
							placeholder="Type a message..."
							className={`flex-1 pl-3 pr-10 py-2 border rounded-full ${
								darkMode
									? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
									: "bg-white border-gray-300 placeholder-gray-500"
							}`}
							value={messageContent}
							onChange={(e) => setMessageContent(e.target.value)}
						/>
						<button
							type="submit"
							className="p-2 cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
							</svg>
						</button>
					</form>
				</div>
			)}
		</div>
	);

	const renderProfile = () => {
		const user = selectedUser || currentUser;
		const isCurrentUser = user.id === currentUser.id;
		const userPosts = posts.filter((post) => post.userId === user.id);

		return (
			<div className="space-y-6 pb-20">
				<div
					className={`${
						darkMode ? "bg-gray-800 text-white" : "bg-white"
					} p-4 rounded-lg shadow-sm`}
				>
					<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
						<img
							src={user.avatar}
							alt={user.name}
							className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-4 sm:mb-0 object-cover"
						/>
						<div className="flex-1 min-w-0">
							<h2 className="text-2xl font-bold truncate">{user.name}</h2>
							<p
								className={`${
									darkMode ? "text-gray-400" : "text-gray-500"
								} truncate`}
							>
								@{user.username}
							</p>
							<p className="mt-2 break-words">{user.bio}</p>

							<div className="mt-4 flex flex-wrap gap-2">
								{user.interests.map((interest, index) => (
									<span
										key={index}
										className={`px-3 py-1 text-sm rounded-full ${
											darkMode
												? "bg-gray-700 text-blue-300"
												: "bg-blue-100 text-blue-800"
										}`}
									>
										#{interest}
									</span>
								))}
							</div>
						</div>
					</div>

					<div
						className={`mt-6 flex justify-between border-t pt-4 ${
							darkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<div>
							<p className="text-xl font-bold">{user.followers}</p>
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Followers
							</p>
						</div>
						<div>
							<p className="text-xl font-bold">{user.following}</p>
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Following
							</p>
						</div>
						<div>
							<p className="text-xl font-bold">{userPosts.length}</p>
							<p
								className={`text-sm ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								Posts
							</p>
						</div>
					</div>

					{isCurrentUser ? (
						<div className="mt-6">
							<button
								onClick={() => setView("editProfile")}
								className="w-full cursor-pointer py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								Edit Profile
							</button>
						</div>
					) : (
						<div className="mt-6 flex space-x-3">
							<button
								onClick={() => handleFollowUser(user)}
								className="flex-1 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								Follow
							</button>
							<button
								onClick={() => {
									setView("messages");
									setMessageRecipient(user);
								}}
								className={`flex-1 py-2 rounded-lg border cursor-pointer ${
									darkMode
										? "border-gray-600 hover:bg-gray-700"
										: "border-gray-300 hover:bg-gray-100"
								}`}
							>
								Message
							</button>
						</div>
					)}
				</div>

				<div
					className={`${
						darkMode ? "bg-gray-800 text-white" : "bg-white"
					} p-4 rounded-lg shadow-sm`}
				>
					<h3 className="text-xl font-semibold mb-4">Posts</h3>

					{userPosts.length > 0 ? (
						<div className="space-y-6">
							{userPosts
								.sort(
									(a, b) =>
										new Date(b.timestamp).getTime() -
										new Date(a.timestamp).getTime()
								)
								.map((post) => (
									<div
										key={post.id}
										className={`${
											darkMode
												? "border-t border-gray-700"
												: "border-t border-gray-200"
										} pt-4 first:border-t-0 first:pt-0`}
									>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-500"
											} mb-2`}
										>
											{formatDate(post.timestamp)}
										</p>
										<p className="whitespace-pre-wrap break-words">
											{post.content}
										</p>
										{post.image && (
											<div className="mt-3 rounded-lg overflow-hidden">
												<img
													src={post.image}
													alt="Post content"
													className="w-full h-auto object-cover"
												/>
											</div>
										)}
										<div className="mt-3 flex items-center space-x-4">
											<div
												className={`flex items-center space-x-1 ${
													darkMode ? "text-gray-300" : "text-gray-500"
												}`}
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
														d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
													/>
												</svg>
												<span>{post.likes}</span>
											</div>
											<div
												className={`flex items-center space-x-1 ${
													darkMode ? "text-gray-300" : "text-gray-500"
												}`}
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
														d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
													/>
												</svg>
												<span>{post.comments.length}</span>
											</div>
										</div>
									</div>
								))}
						</div>
					) : (
						<p
							className={`text-center py-6 ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							No posts yet.
						</p>
					)}
				</div>
			</div>
		);
	};

	const renderEditProfile = () => (
		<div className="space-y-6 pb-20">
			<div
				className={`${
					darkMode ? "bg-gray-800 text-white" : "bg-white"
				} p-4 rounded-lg shadow-sm`}
			>
				<h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

				<form onSubmit={handleProfileUpdate} className="space-y-4">
					<div>
						<label
							className={`block text-sm font-medium mb-1 ${
								darkMode ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Profile Photo
						</label>
						<div className="flex items-center space-x-4">
							<img
								src={editAvatar}
								alt="Profile Preview"
								className="w-20 h-20 rounded-full object-cover"
							/>
							<div className="flex-1">
								<input
									type="text"
									className={`w-full p-2 border rounded-lg ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300"
									}`}
									placeholder="Enter image URL"
									value={editAvatar}
									onChange={(e) => setEditAvatar(e.target.value)}
								/>
								<p
									className={`mt-1 text-xs ${
										darkMode ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Enter the URL of your profile image
								</p>
							</div>
						</div>
					</div>

					<div>
						<label
							className={`block text-sm font-medium mb-1 ${
								darkMode ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Name
						</label>
						<input
							type="text"
							className={`w-full p-2 border rounded-lg ${
								darkMode
									? "bg-gray-700 border-gray-600 text-white"
									: "bg-white border-gray-300"
							}`}
							placeholder="Your full name"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							required
						/>
					</div>

					<div>
						<label
							className={`block text-sm font-medium mb-1 ${
								darkMode ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Username
						</label>
						<input
							type="text"
							className={`w-full p-2 border rounded-lg ${
								darkMode
									? "bg-gray-700 border-gray-600 text-white"
									: "bg-white border-gray-300"
							}`}
							placeholder="Your username"
							value={editUsername}
							onChange={(e) => setEditUsername(e.target.value)}
							required
						/>
					</div>

					<div>
						<label
							className={`block text-sm font-medium mb-1 ${
								darkMode ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Bio
						</label>
						<textarea
							className={`w-full p-2 border rounded-lg ${
								darkMode
									? "bg-gray-700 border-gray-600 text-white"
									: "bg-white border-gray-300"
							}`}
							placeholder="Tell us about yourself"
							rows={3}
							value={editBio}
							onChange={(e) => setEditBio(e.target.value)}
						></textarea>
					</div>

					<div>
						<label
							className={`block text-sm font-medium mb-1 ${
								darkMode ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Interests
						</label>
						<input
							type="text"
							className={`w-full p-2 border rounded-lg ${
								darkMode
									? "bg-gray-700 border-gray-600 text-white"
									: "bg-white border-gray-300"
							}`}
							placeholder="photography, cooking, travel, etc. (comma separated)"
							value={editInterests}
							onChange={(e) => setEditInterests(e.target.value)}
						/>
					</div>

					<div className="flex space-x-3 pt-2">
						<button
							type="button"
							onClick={() => {
								setView("profile");
								setSelectedUser(currentUser);
							}}
							className={`flex-1 py-2 rounded-lg border cursor-pointer ${
								darkMode
									? "border-gray-600 hover:bg-gray-700"
									: "border-gray-300 hover:bg-gray-100"
							}`}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);

	const renderDiscover = () => (
		<div className="space-y-6 pb-20">
			<div
				className={`${
					darkMode ? "bg-gray-800 text-white" : "bg-white"
				} p-4 rounded-lg shadow-sm`}
			>
				<h2 className="text-xl font-semibold mb-4">Discover</h2>

				<div className="mb-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Search users, interests, or hobbies..."
							className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
								darkMode
									? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
									: "bg-white border-gray-300 placeholder-gray-500"
							}`}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
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

				<div className="space-y-1">
					<h3
						className={`text-sm font-medium py-2 ${
							darkMode ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Popular Interests
					</h3>
					<div className="flex flex-wrap gap-2 mb-4">
						{[
							"photography",
							"cooking",
							"travel",
							"fitness",
							"gaming",
							"music",
							"art",
							"reading",
							"hiking",
							"technology",
						].map((interest) => (
							<button
								key={interest}
								onClick={() => setSearchTerm(interest)}
								className={`px-3 py-1 text-sm rounded-full cursor-pointer ${
									darkMode
										? "bg-gray-700 text-blue-300 hover:bg-gray-600"
										: "bg-blue-100 text-blue-800 hover:bg-blue-200"
								}`}
							>
								#{interest}
							</button>
						))}
					</div>
				</div>

				<div className="mt-6">
					<h3
						className={`text-sm font-medium py-2 ${
							darkMode ? "text-gray-300" : "text-gray-600"
						}`}
					>
						{searchTerm
							? `Results for "${searchTerm}"`
							: "People you might like"}
					</h3>

					<div className=" sm:grid-cols-2 gap-4 grid grid-cols-1">
						{filteredUsers
							.filter((user) => user.id !== currentUser.id)
							.map((user) => (
								<div
									key={user.id}
									className={`p-4 rounded-lg border ${
										darkMode ? "border-gray-700" : "border-gray-200"
									}`}
								>
									<div className="flex items-center space-x-3">
										<img
											src={user.avatar}
											alt={user.name}
											className="w-12 h-12 rounded-full object-cover"
										/>
										<div className="flex-1 min-w-0">
											<button
												onClick={() => {
													setView("profile");
													setSelectedUser(user);
												}}
												className="font-medium hover:underline truncate block cursor-pointer"
											>
												{user.name}
											</button>
											<p
												className={`text-sm truncate ${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												@{user.username}
											</p>
										</div>
										<button
											onClick={() => handleFollowUser(user)}
											className={`px-3 py-1 rounded-lg text-sm cursor-pointer ${
												darkMode
													? " hover:bg-blue-700 bg-blue-600 text-white"
													: "bg-blue-500 text-white hover:bg-blue-600"
											}`}
										>
											Follow
										</button>
									</div>
									<p
										className={`mt-2 text-sm truncate ${
											darkMode ? "text-gray-300" : "text-gray-600"
										}`}
									>
										{user.bio}
									</p>
									<div className="mt-2 flex flex-wrap gap-1">
										{user.interests.slice(0, 3).map((interest, index) => (
											<span
												key={index}
												className={`px-2 py-0.5 text-xs rounded-full ${
													darkMode
														? "text-blue-300 bg-gray-600"
														: "bg-blue-100 text-blue-800"
												}`}
											>
												#{interest}
											</span>
										))}
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<Helmet>
				<title>HobbyHub - Connect with Hobbyists</title>
				<meta
					name="description"
					content="Join HobbyHub to connect with people who share your passions and interests!"
				/>
				<style>{`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu;
            background-color: ${darkMode ? "#1f2937" : "#f3f4f6"};
          }
          .dark-mode {
            background-color: #1f2937;
            color: #ffffff;
          }
          .sidebar {
            width: 280px;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 20;
            transition: transform 0.3s ease-in-out;
          }
          @media (max-width: 768px) {
            .sidebar {
              transform: translateX(${mobileMenuOpen ? "0" : "-100%"});
            }
            .main-content {
              margin-left: 0 !important;
            }
          }
          .main-content {
            margin-left: 280px;
            padding: 80px 20px 20px;
            max-width: 800px;
            margin-right: auto;
            margin-left: auto;
          }
          @media (max-width: 768px) {
            .main-content {
              padding: 70px 16px 16px;
            }
          }
        `}</style>
			</Helmet>

			<div className="min-h-screen">
				{renderSidebarNavigation()}

				<div className="main-content">
					{renderHeader()}

					<main ref={mainContentRef}>
						{view === "feed" && renderFeed()}
						{view === "messages" && renderMessages()}
						{view === "profile" && renderProfile()}
						{view === "editProfile" && renderEditProfile()}
						{view === "discover" && renderDiscover()}
					</main>
				</div>
			</div>
		</>
	);
}
