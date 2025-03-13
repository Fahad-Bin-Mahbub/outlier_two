"use client";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import {
	Home,
	Search,
	Bell,
	User,
	Plus,
	Heart,
	MessageCircle,
	Bookmark,
	ChevronLeft,
	ImageIcon,
	SmileIcon,
	LogOut,
	Moon,
	Sun,
	Settings,
	X,
	LinkIcon,
	Share2,
	Send,
	MoreHorizontal,
	Flag,
	AlignLeft,
	Image,
	Info,
	Users,
	CheckCircle,
	Clock,
	ArrowUp,
} from "lucide-react";

interface UserData {
	id: number;
	name: string;
	username: string;
	avatar: string;
	bio: string;
	following: number;
	followers: number;
}

interface GroupData {
	id: number;
	name: string;
	description: string;
	cover: string;
	icon: string;
	members: number;
	posts: number;
	joined: boolean;
	category: string;
}

interface CommentData {
	id: number;
	userId: number;
	content: string;
	timestamp: string;
}

interface PostData {
	id: number;
	userId: number;
	groupId: number;
	content: string;
	image?: string;
	timestamp: string;
	likes: number;
	reactions: Record<string, number>;
	comments: CommentData[];
	liked: boolean;
	userReaction: string | null;
	bookmarked: boolean;
}

interface AlertData {
	id: number;
	type: string;
	userId: number;
	postId?: number;
	groupId?: number;
	timestamp: string;
	read: boolean;
}

interface ToastProps {
	message: string;
	type: "success" | "error" | "info";
	onClose: () => void;
}

interface StyleConfig {
	bgPrimary: string;
	bgSecondary: string;
	bgTertiary: string;
	bgHover: string;
	bgActiveNav: string;
	bgButton: string;
	bgButtonHover: string;
	bgSecondaryButton: string;
	bgSecondaryButtonHover: string;
	textPrimary: string;
	textSecondary: string;
	textTertiary: string;
	border: string;
	input: string;
	cardBg: string;
	accentText: string;
	accentTextHover: string;
	secondaryAccentText: string;
	secondaryAccentTextHover: string;
	accentBorder: string;
	accentBg: string;
	accentBgLight: string;
	shadow: string;
	icon: string;
	gradientFrom: string;
	gradientVia: string;
	gradientTo: string;
	gradientHeaderFrom: string;
	gradientHeaderTo: string;
	gradientProfileFrom: string;
	gradientProfileTo: string;
}

interface GroupInfoBoxProps {
	group: GroupData;
	onSelect: () => void;
	onToggleJoin: () => void;
	styles: StyleConfig;
	delay?: number;
}

interface EmojiReactionPickerProps {
	onSelect: (emoji: string) => void;
	onClose: () => void;
	styles: StyleConfig;
}

interface SinglePostDisplayProps {
	pData: PostData;
	uData: UserData;
	gData: GroupData;
	toggleLike: (postId: number) => void;
	toggleBookmark: (postId: number) => void;
	handleCreateComment: (postId: number, content: string) => void;
	updateReaction: (
		postId: number,
		newReaction: string | null,
		oldReaction: string | null
	) => void;
	styles: StyleConfig;
	delay?: number;
	showToast: (message: string, type?: string) => void;
}

interface SidePanelProps {
	currentView: string;
	setCurrentView: (view: string) => void;
	setActiveGroupData: (group: GroupData | null) => void;
	setSearchActive: (active: boolean) => void;
	setCreateGroupPopup: (show: boolean) => void;
	styleConfig: StyleConfig;
}

interface ToastData {
	message: string;
	type: string;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`fixed bottom-4 right-4 z-50 flex items-center rounded-lg px-4 py-3 shadow-lg transform transition-all duration-300 ease-in-out animate-fade-in ${
				type === "success"
					? "bg-green-500 text-white"
					: type === "error"
					? "bg-red-500 text-white"
					: "bg-blue-500 text-white"
			}`}
		>
			{type === "success" && <CheckCircle className="h-5 w-5 mr-2" />}
			{type === "error" && <X className="h-5 w-5 mr-2" />}
			{type === "info" && <Info className="h-5 w-5 mr-2" />}
			<p className="text-sm font-medium">{message}</p>
			<button
				onClick={onClose}
				className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
};

const sampleUserData: UserData[] = [
	{
		id: 1,
		name: "Alex Morgan",
		username: "alexmorgan",
		avatar:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
		bio: "Book lover, amateur chef, and outdoor enthusiast. Always seeking new adventures and interesting stories.",
		following: 182,
		followers: 214,
	},
	{
		id: 2,
		name: "Jordan Smith",
		username: "jordansmith",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
		bio: "Travel enthusiast and photography lover",
		following: 142,
		followers: 356,
	},
	{
		id: 3,
		name: "Taylor Williams",
		username: "taylorw",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
		bio: "Gaming fan and tech geek",
		following: 89,
		followers: 102,
	},
	{
		id: 4,
		name: "Casey Johnson",
		username: "caseyj",
		avatar:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
		bio: "Fitness instructor and nutrition coach",
		following: 211,
		followers: 543,
	},
	{
		id: 5,
		name: "Riley Cooper",
		username: "rileyc",
		avatar:
			"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
		bio: "Foodie and cooking experimenter",
		following: 167,
		followers: 328,
	},
];

const loggedInUser = sampleUserData[0];

const sampleGroupData: GroupData[] = [
	{
		id: 1,
		name: "Book Lovers Club",
		description:
			"A community for sharing book recommendations, reviews, and discussions about literature of all genres.",
		cover:
			"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
		icon: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
		members: 2452,
		posts: 852,
		joined: true,
		category: "Literature",
	},
	{
		id: 2,
		name: "Gaming Universe",
		description:
			"From console to PC, retro to cutting-edge, share your gaming experiences and find new friends to play with.",
		cover:
			"https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdhbWluZ3xlbnwwfHwwfHx8MA%3D%3D",
		icon: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGdhbWluZ3xlbnwwfHwwfHx8MA%3D%3D",
		members: 3621,
		posts: 1421,
		joined: false,
		category: "Gaming",
	},
	{
		id: 3,
		name: "Culinary Adventures",
		description:
			"Share recipes, cooking tips, and food photos. From beginners to experts, everyone is welcome in this foodie haven.",
		cover:
			"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvb2tpbmd8ZW58MHx8MHx8fDA%3D",
		icon: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvb2tpbmd8ZW58MHx8MHx8fDA%3D",
		members: 1876,
		posts: 753,
		joined: true,
		category: "Food & Cooking",
	},
	{
		id: 4,
		name: "Photography Enthusiasts",
		description:
			"A space to share your photography, get feedback, learn techniques, and discover amazing photography spots.",
		cover:
			"https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBob3RvZ3JhcGh5fGVufDB8fDB8fHww",
		icon: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtZXJhfGVufDB8fDB8fHww",
		members: 2134,
		posts: 943,
		joined: false,
		category: "Photography",
	},
	{
		id: 5,
		name: "Fitness Community",
		description:
			"Share workout routines, fitness milestones, nutrition advice, and motivate each other to reach health goals.",
		cover:
			"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZpdG5lc3N8ZW58MHx8MHx8fDA%3D",
		icon: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZpdG5lc3N8ZW58MHx8MHx8fDA%3D",
		members: 1923,
		posts: 682,
		joined: true,
		category: "Fitness & Health",
	},
	{
		id: 6,
		name: "Travel Explorers",
		description:
			"Share travel experiences, hidden gems, travel tips, and plan group adventures with fellow explorers.",
		cover:
			"https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
		icon: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
		members: 2765,
		posts: 1024,
		joined: false,
		category: "Travel",
	},
];

const samplePostData: PostData[] = [
	{
		id: 1,
		userId: 1,
		groupId: 1,
		content:
			"Just finished reading 'The Midnight Library' by Matt Haig. Absolutely loved the concept of exploring different life possibilities. Has anyone else read it? What did you think?",
		timestamp: "2 hours ago",
		likes: 24,
		reactions: {
			"👍": 14,
			"❤️": 8,
			"😮": 2,
		},
		comments: [
			{
				id: 1,
				userId: 3,
				content:
					"One of my favorites! The way it explores regret and possibility is so powerful.",
				timestamp: "1 hour ago",
			},
			{
				id: 2,
				userId: 5,
				content:
					"I have it on my reading list! Moving it up after seeing your recommendation.",
				timestamp: "45 minutes ago",
			},
		],
		liked: true,
		userReaction: null,
		bookmarked: false,
	},
	{
		id: 2,
		userId: 4,
		groupId: 5,
		content:
			"Completed my first 10K run today! Been training for months and finally broke the 50-minute barrier. So proud of this milestone!",
		image:
			"https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cnVubmluZ3xlbnwwfHwwfHx8MA%3D%3D",
		timestamp: "4 hours ago",
		likes: 47,
		reactions: {
			"👍": 22,
			"🔥": 15,
			"❤️": 10,
		},
		comments: [
			{
				id: 3,
				userId: 2,
				content: "That's amazing! Congratulations on breaking your goal!",
				timestamp: "3 hours ago",
			},
		],
		userReaction: null,
		liked: false,
		bookmarked: true,
	},
	{
		id: 3,
		userId: 5,
		groupId: 3,
		content:
			"Made homemade pasta for the first time today! The process was so therapeutic and the results were delicious. Paired with a simple garlic and olive oil sauce.",
		image:
			"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWVtYWRlJTIwcGFzdGF8ZW58MHx8MHx8fDA%3D",
		timestamp: "Yesterday",
		likes: 36,
		reactions: {
			"👍": 16,
			"😂": 12,
			"❤️": 8,
		},
		comments: [
			{
				id: 4,
				userId: 1,
				content: "Looks amazing! Would you share your recipe?",
				timestamp: "Yesterday",
			},
			{
				id: 5,
				userId: 3,
				content:
					"Nothing beats homemade pasta! Have you tried adding herbs to the dough?",
				timestamp: "20 hours ago",
			},
		],
		userReaction: null,
		liked: true,
		bookmarked: true,
	},
	{
		id: 4,
		userId: 2,
		groupId: 2,
		content:
			"Just reached Diamond rank in League of Legends after grinding all season! The climb was tough but so worth it.",
		timestamp: "2 days ago",
		likes: 32,
		reactions: {
			"👍": 15,
			"🔥": 10,
			"😮": 7,
		},
		comments: [
			{
				id: 6,
				userId: 3,
				content: "Congrats! That's impressive. What role do you main?",
				timestamp: "1 day ago",
			},
		],
		userReaction: null,
		liked: false,
		bookmarked: false,
	},
	{
		id: 5,
		userId: 3,
		groupId: 1,
		content:
			"I've been reading more fantasy lately and just discovered Brandon Sanderson's Mistborn series. The magic system is unlike anything I've seen before. Anyone else a fan?",
		timestamp: "3 days ago",
		likes: 19,
		reactions: {
			"👍": 9,
			"❤️": 6,
			"😢": 4,
		},
		comments: [
			{
				id: 7,
				userId: 1,
				content:
					"Mistborn is fantastic! If you like that, you should check out his Stormlight Archive series next.",
				timestamp: "2 days ago",
			},
		],
		userReaction: null,
		liked: true,
		bookmarked: false,
	},
];

const sampleAlertData: AlertData[] = [
	{
		id: 1,
		type: "like",
		userId: 3,
		postId: 1,
		timestamp: "2 minutes ago",
		read: false,
	},
	{
		id: 2,
		type: "comment",
		userId: 5,
		postId: 1,
		timestamp: "45 minutes ago",
		read: false,
	},
	{
		id: 3,
		type: "follow",
		userId: 4,
		timestamp: "1 hour ago",
		read: true,
	},
	{
		id: 4,
		type: "groupInvite",
		userId: 2,
		groupId: 2,
		timestamp: "3 hours ago",
		read: true,
	},
	{
		id: 5,
		type: "like",
		userId: 2,
		postId: 3,
		timestamp: "Yesterday",
		read: true,
	},
];

const findUser = (userId: number): UserData => {
	return sampleUserData.find((user) => user.id === userId) || sampleUserData[0];
};

const findGroup = (groupId: number): GroupData => {
	return (
		sampleGroupData.find((group) => group.id === groupId) || sampleGroupData[0]
	);
};

const fetchStyleSettings = (darkThemeFlag: boolean): StyleConfig => {
	if (darkThemeFlag) {
		return {
			bgPrimary: "bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950",
			bgSecondary: "bg-slate-900",
			bgTertiary: "bg-slate-800/80",
			bgHover: "hover:bg-slate-700/50",
			bgActiveNav: "bg-teal-400/15",
			bgButton: "bg-teal-400",
			bgButtonHover: "hover:bg-teal-300",
			bgSecondaryButton: "bg-fuchsia-500",
			bgSecondaryButtonHover: "hover:bg-fuchsia-400",
			textPrimary: "text-gray-100",
			textSecondary: "text-gray-400",
			textTertiary: "text-gray-500",
			border: "border-gray-700/60",
			input: "bg-slate-800 border-gray-700 placeholder-gray-500 text-gray-200",
			cardBg: "bg-slate-800",
			accentText: "text-teal-400",
			accentTextHover: "hover:text-teal-300",
			secondaryAccentText: "text-fuchsia-500",
			secondaryAccentTextHover: "hover:text-fuchsia-400",
			accentBorder: "border-teal-400",
			accentBg: "bg-teal-400",
			accentBgLight: "bg-teal-400/10",
			shadow: "shadow-black/30",
			icon: "text-teal-400",
			gradientFrom: "from-teal-400",
			gradientVia: "via-fuchsia-500",
			gradientTo: "to-sky-500",
			gradientHeaderFrom: "from-slate-900/95",
			gradientHeaderTo: "to-indigo-950/90",
			gradientProfileFrom: "from-fuchsia-500/20",
			gradientProfileTo: "to-teal-400/20",
		};
	} else {
		return {
			bgPrimary: "bg-gradient-to-br from-slate-50 via-white to-violet-50",
			bgSecondary: "bg-white",
			bgTertiary: "bg-slate-100",
			bgHover: "hover:bg-gray-100/80",
			bgActiveNav: "bg-green-600/10",
			bgButton: "bg-green-600",
			bgButtonHover: "hover:bg-green-700",
			bgSecondaryButton: "bg-pink-500",
			bgSecondaryButtonHover: "hover:bg-pink-600",
			textPrimary: "text-gray-900",
			textSecondary: "text-gray-600",
			textTertiary: "text-gray-500",
			border: "border-gray-200",
			input: "bg-white border-gray-300 placeholder-gray-400 text-gray-900",
			cardBg: "bg-white",
			accentText: "text-green-600",
			accentTextHover: "hover:text-green-700",
			secondaryAccentText: "text-pink-500",
			secondaryAccentTextHover: "hover:text-pink-600",
			accentBorder: "border-green-600",
			accentBg: "bg-green-600",
			accentBgLight: "bg-green-600/10",
			shadow: "shadow-gray-300/50",
			icon: "text-green-600",
			gradientFrom: "from-green-600",
			gradientVia: "via-pink-500",
			gradientTo: "to-amber-500",
			gradientHeaderFrom: "from-white/95",
			gradientHeaderTo: "to-slate-100/90",
			gradientProfileFrom: "from-pink-500/15",
			gradientProfileTo: "to-green-600/15",
		};
	}
};

const MemoizedGroupInfoBox = memo(
	({ group, onSelect, onToggleJoin, styles, delay = 0 }: GroupInfoBoxProps) => {
		return (
			<div
				className={`rounded-lg ${styles.cardBg} shadow-sm border ${styles.border} overflow-hidden animate-fade-in card-hover flex flex-col`}
				style={{ animationDelay: `${delay}ms` }}
			>
				<div
					className="relative h-24 img-zoom cursor-pointer"
					onClick={onSelect}
				>
					<img
						src={group.cover}
						alt={group.name}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
				</div>

				<div className="p-3 flex flex-col flex-grow">
					<div className="flex items-start justify-between mb-1.5">
						<div className="flex items-center min-w-0 mr-2">
							<img
								src={group.icon}
								alt=""
								className={`h-9 w-9 rounded-md object-cover border ${styles.border} shadow-sm mr-2 flex-shrink-0`}
							/>
							<div className="min-w-0">
								<h3
									className={`font-semibold text-sm ${styles.textPrimary} truncate cursor-pointer ${styles.accentTextHover}`}
									onClick={onSelect}
								>
									{group.name}
								</h3>
								<p className={`text-xs ${styles.textTertiary} truncate`}>
									{group.category} • {group.members} members
								</p>
							</div>
						</div>
					</div>

					<p
						className={`text-xs ${styles.textSecondary} mt-1 mb-2 line-clamp-2 flex-grow`}
					>
						{group.description}
					</p>

					<div className="flex justify-between items-center mt-auto pt-1">
						<button
							className={`text-xs ${styles.accentText} ${styles.accentTextHover} cursor-pointer`}
							onClick={onSelect}
						>
							View Group
						</button>
						<button
							className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex-shrink-0 cursor-pointer ${
								group.joined
									? `${styles.bgTertiary} ${styles.textPrimary} hover:bg-red-500/80 hover:text-white`
									: `${styles.bgButton} text-white ${styles.bgButtonHover}`
							}`}
							onClick={(e) => {
								e.stopPropagation();
								onToggleJoin();
							}}
						>
							{group.joined ? "Leave" : "Join"}
						</button>
					</div>
				</div>
			</div>
		);
	}
);

const EmojiReactionPicker = memo(
	({ onSelect, onClose, styles }: EmojiReactionPickerProps) => {
		const reactions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

		return (
			<div
				className={`absolute -top-10 -left-2 p-2 rounded-lg shadow-lg ${styles.cardBg} border ${styles.border} flex flex-wrap gap-1 z-30 animate-scale-in max-w-xs`}
			>
				{reactions.map((emoji) => (
					<button
						key={emoji}
						className={`p-1.5 rounded-md hover:bg-gray-200/20 text-lg transition-colors transform hover:scale-110 cursor-pointer`}
						onClick={() => {
							onSelect(emoji);
							onClose();
						}}
					>
						{emoji}
					</button>
				))}
			</div>
		);
	}
);

const SinglePostDisplay = memo(
	({
		pData,
		uData,
		gData,
		toggleLike,
		toggleBookmark,
		handleCreateComment,
		updateReaction,
		styles,
		delay = 0,
		showToast,
	}: SinglePostDisplayProps) => {
		const [commentText, setCommentText] = useState("");
		const [showCommentsArea, setShowCommentsArea] = useState(false);
		const [showReactionPicker, setShowReactionPicker] = useState(false);
		const [showPostOptions, setShowPostOptions] = useState(false);
		const optionsRef = useRef<HTMLDivElement>(null);
		const [localPostData, setLocalPostData] = useState<PostData>(pData);

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					optionsRef.current &&
					!optionsRef.current.contains(event.target as Node)
				) {
					setShowPostOptions(false);
				}
			};
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		useEffect(() => {
			setLocalPostData(pData);
		}, [pData]);

		const handleAddReaction = (emoji: string) => {
			setLocalPostData((prev) => {
				const newReactions = { ...prev.reactions };

				if (prev.userReaction && newReactions[prev.userReaction]) {
					newReactions[prev.userReaction] = Math.max(
						0,
						newReactions[prev.userReaction] - 1
					);
				}

				if (emoji !== prev.userReaction) {
					newReactions[emoji] = (newReactions[emoji] || 0) + 1;
				}

				return {
					...prev,
					userReaction: emoji !== prev.userReaction ? emoji : null,
					reactions: newReactions,

					liked: emoji !== prev.userReaction ? false : prev.liked,
				};
			});

			const newReaction = localPostData.userReaction === emoji ? null : emoji;
			const oldReaction = localPostData.userReaction;
			updateReaction(pData.id, newReaction, oldReaction);

			showToast(
				newReaction ? "Reaction added!" : "Reaction removed",
				"success"
			);
		};

		const totalReactions = localPostData.reactions
			? Object.values(localPostData.reactions).reduce((a, b) => a + b, 0)
			: 0;

		return (
			<div
				className={`rounded-lg ${styles.cardBg} shadow-sm border ${styles.border} animate-fade-in card-hover overflow-hidden`}
				style={{ animationDelay: `${delay}ms` }}
			>
				<div
					className={`p-3 flex items-start space-x-2.5 border-b ${styles.border}`}
				>
					<img
						src={uData.avatar}
						alt={uData.name}
						className="h-9 w-9 rounded-full object-cover flex-shrink-0"
					/>
					<div className="flex-1 min-w-0">
						<div className="flex items-baseline justify-between">
							<div className="flex items-baseline flex-grow min-w-0">
								<p
									className={`font-medium text-sm ${styles.textPrimary} truncate mr-1.5`}
								>
									{uData.name}
								</p>
								<p className={`text-xs ${styles.textTertiary} flex-shrink-0`}>
									· {localPostData.timestamp}
								</p>
							</div>
							<div className="relative" ref={optionsRef}>
								<button
									className={`p-1 rounded-full ${styles.textTertiary} hover:${styles.textPrimary} ${styles.bgHover} cursor-pointer`}
									onClick={() => setShowPostOptions(!showPostOptions)}
								>
									<MoreHorizontal className="h-4 w-4" />
								</button>
								{showPostOptions && (
									<div
										className={`absolute right-0 mt-1 w-36 rounded-md shadow-lg py-1 ${styles.cardBg} border ${styles.border} z-30 animate-scale-in`}
									>
										<button
											className={`flex items-center w-full px-3 py-2 text-xs ${styles.textSecondary} ${styles.bgHover} hover:${styles.textPrimary} cursor-pointer`}
											onClick={() => {
												setShowPostOptions(false);
												showToast("Post saved to your bookmarks", "success");
											}}
										>
											<Bookmark className="h-3.5 w-3.5 mr-2" />
											Save post
										</button>
										<button
											className={`flex items-center w-full px-3 py-2 text-xs ${styles.textSecondary} ${styles.bgHover} hover:${styles.textPrimary} cursor-pointer`}
											onClick={() => {
												setShowPostOptions(false);
												showToast("Post shared to your timeline", "success");
											}}
										>
											<Share2 className="h-3.5 w-3.5 mr-2" />
											Share post
										</button>
										<button
											className={`flex items-center w-full px-3 py-2 text-xs ${styles.textSecondary} ${styles.bgHover} hover:text-red-500 cursor-pointer`}
											onClick={() => {
												setShowPostOptions(false);
												showToast("Post reported", "info");
											}}
										>
											<Flag className="h-3.5 w-3.5 mr-2" />
											Report post
										</button>
									</div>
								)}
							</div>
						</div>
						<p className={`text-xs ${styles.textTertiary} flex items-center`}>
							in{" "}
							<button
								className={`ml-1 ${styles.accentText} ${styles.accentTextHover} font-medium cursor-pointer`}
							>
								{gData.name}
							</button>
						</p>
					</div>
				</div>

				<div className="p-3">
					<p
						className={`${styles.textPrimary} text-sm mb-2.5 whitespace-pre-wrap`}
					>
						{localPostData.content}
					</p>

					{localPostData.image && (
						<div
							className={`rounded-md overflow-hidden mb-2.5 border ${styles.border} img-zoom aspect-video`}
						>
							<img
								src={localPostData.image}
								alt="Post"
								className="w-full h-full object-cover"
							/>
						</div>
					)}

					{totalReactions > 0 && (
						<div
							className={`flex items-center mb-2 pb-1.5 ${styles.textTertiary} text-xs`}
						>
							<div className="flex -space-x-1 mr-1.5">
								{Object.keys(localPostData.reactions || {})
									.filter((emoji) => localPostData.reactions[emoji] > 0)
									.slice(0, 3)
									.map((emoji, idx) => (
										<div
											key={emoji}
											className={`rounded-full flex items-center justify-center h-5 w-5 ${
												idx === 0
													? "bg-blue-500"
													: idx === 1
													? "bg-red-500"
													: "bg-green-500"
											} text-white text-xs shadow-sm border border-white`}
										>
											{emoji}
										</div>
									))}
							</div>
							<span>
								{totalReactions}{" "}
								{totalReactions === 1 ? "reaction" : "reactions"}
							</span>
						</div>
					)}

					<div className="flex items-center justify-between pt-1.5 border-t border-gray-200 dark:border-gray-700">
						<div className="flex space-x-4 relative">
							<button
								className={`flex items-center space-x-1 ${styles.textSecondary} ${styles.bgHover} p-1.5 px-2 rounded-md hover:${styles.textPrimary} transition-colors cursor-pointer`}
								onClick={() => setShowReactionPicker(!showReactionPicker)}
							>
								{localPostData.userReaction ? (
									<span className="text-base mr-1">
										{localPostData.userReaction}
									</span>
								) : (
									<Heart
										className={`h-4 w-4 ${
											localPostData.liked ? "fill-red-500 text-red-500" : ""
										}`}
									/>
								)}
								<span className="text-xs">
									{localPostData.userReaction ? "Reacted" : "React"}
								</span>
							</button>

							{showReactionPicker && (
								<EmojiReactionPicker
									onSelect={handleAddReaction}
									onClose={() => setShowReactionPicker(false)}
									styles={styles}
								/>
							)}

							<button
								className={`flex items-center space-x-1 ${styles.textSecondary} ${styles.bgHover} p-1.5 px-2 rounded-md hover:${styles.textPrimary} transition-colors cursor-pointer`}
								onClick={() => setShowCommentsArea(!showCommentsArea)}
							>
								<MessageCircle className="h-4 w-4" />
								<span className="text-xs">Comment</span>
							</button>

							<button
								className={`flex items-center space-x-1 ${styles.textSecondary} ${styles.bgHover} p-1.5 px-2 rounded-md hover:${styles.textPrimary} transition-colors cursor-pointer`}
								onClick={() => {
									showToast("Post shared!", "success");
								}}
							>
								<Share2 className="h-4 w-4" />
								<span className="text-xs">Share</span>
							</button>
						</div>

						<button
							className={`${styles.textSecondary} ${styles.bgHover} p-1.5 rounded-md hover:${styles.textPrimary} transition-colors cursor-pointer`}
							onClick={() => toggleBookmark(localPostData.id)}
						>
							<Bookmark
								className={`h-4 w-4 ${
									localPostData.bookmarked
										? "fill-emerald-500 text-emerald-500"
										: ""
								}`}
							/>
						</button>
					</div>
				</div>

				{showCommentsArea && (
					<div className={`border-t ${styles.border} px-3 pt-2 pb-3`}>
						<div className="flex space-x-2 mb-3">
							<img
								src={loggedInUser.avatar}
								alt={loggedInUser.name}
								className="h-7 w-7 rounded-full object-cover flex-shrink-0"
							/>
							<div className="flex-1 relative">
								<input
									type="text"
									placeholder="Add a comment..."
									value={commentText}
									onChange={(e) => setCommentText(e.target.value)}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" &&
											!e.shiftKey &&
											commentText.trim()
										) {
											e.preventDefault();
											handleCreateComment(localPostData.id, commentText);
											setCommentText("");
											showToast("Comment added!", "success");
										}
									}}
									className={`w-full p-1.5 px-3 pr-8 rounded-full border ${styles.input} focus:ring-emerald-500 focus:border-emerald-500 transition-all text-xs`}
								/>
								<button
									className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full cursor-pointer ${
										commentText.trim()
											? `${styles.accentText} ${styles.accentTextHover} hover:bg-emerald-500/10`
											: styles.textTertiary
									} transition-colors`}
									disabled={!commentText.trim()}
									onClick={() => {
										if (commentText.trim()) {
											handleCreateComment(localPostData.id, commentText);
											setCommentText("");
											showToast("Comment added!", "success");
										}
									}}
								>
									<Send className="h-4 w-4" />
								</button>
							</div>
						</div>

						{localPostData.comments.length > 0 ? (
							<div className="space-y-2">
								{localPostData.comments.map((comment) => {
									const commentUser = findUser(comment.userId);
									return (
										<div key={comment.id} className="flex space-x-2">
											<img
												src={commentUser.avatar}
												alt={commentUser.name}
												className="h-7 w-7 rounded-full object-cover mt-0.5 flex-shrink-0"
											/>
											<div
												className={`flex-1 px-2.5 py-1.5 rounded-md ${styles.bgTertiary}`}
											>
												<div className="flex items-baseline mb-0.5">
													<p
														className={`text-xs font-medium ${styles.textPrimary} mr-1.5`}
													>
														{commentUser.name}
													</p>
													<span
														className={`text-xs ${styles.textTertiary} flex-shrink-0`}
													>
														· {comment.timestamp}
													</span>
												</div>
												<p
													className={`text-xs ${styles.textSecondary} whitespace-pre-wrap`}
												>
													{comment.content}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<p className={`text-xs ${styles.textTertiary} text-center py-1`}>
								Be the first to comment!
							</p>
						)}
					</div>
				)}
			</div>
		);
	}
);

const SidePanel = memo(
	({
		currentView,
		setCurrentView,
		setActiveGroupData,
		setSearchActive,
		setCreateGroupPopup,
		styleConfig,
		showToast,
	}: SidePanelProps) => (
		<aside
			className={`hidden md:block w-60 lg:w-64 ${styleConfig.bgSecondary} border-r ${styleConfig.border} h-screen sticky top-0 overflow-hidden`}
		>
			<div className="flex flex-col h-full">
				<div className="p-4 space-y-2 flex-grow overflow-y-auto">
					{[
						{ icon: Home, label: "Home", id: "home" },
						{ icon: Search, label: "Discover", id: "discover" },
						{ icon: Bookmark, label: "My Groups", id: "groups" },
						{ icon: User, label: "Profile", id: "profile" },
					].map((item) => (
						<button
							key={item.id}
							className={`flex items-center space-x-3 w-full p-2.5 rounded-lg transition-colors cursor-pointer ${
								currentView === item.id
									? `${styleConfig.bgActiveNav} ${styleConfig.accentText}`
									: `${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary}`
							}`}
							onClick={() => {
								setCurrentView(item.id);
								setActiveGroupData(null);
								setSearchActive(false);
							}}
						>
							<item.icon
								className={`h-5 w-5 ${
									currentView === item.id
										? styleConfig.accentText
										: styleConfig.textSecondary
								}`}
							/>
							<span className="font-medium text-sm">{item.label}</span>
						</button>
					))}
					<button
						className={`flex items-center space-x-3 w-full p-2.5 rounded-lg ${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} transition-colors mt-4 pulse-effect cursor-pointer`}
						onClick={() => setCreateGroupPopup(true)}
					>
						<Plus className="h-5 w-5" />
						<span className="font-medium text-sm">Create Group</span>
					</button>
				</div>

				<div className={`p-4 border-t ${styleConfig.border} flex-shrink-0`}>
					<div className={`p-3 rounded-lg ${styleConfig.bgTertiary} mb-3`}>
						<h4
							className={`text-xs font-medium ${styleConfig.textPrimary} mb-1.5`}
						>
							Need help?
						</h4>
						<p className={`text-xs ${styleConfig.textSecondary} mb-2`}>
							Check out our community guidelines and FAQs
						</p>
						<button
							className={`text-xs ${styleConfig.accentText} ${styleConfig.accentTextHover} font-medium cursor-pointer flex items-center`}
							onClick={() => showToast("Help center coming soon!", "info")}
						>
							<Info className="h-3.5 w-3.5 mr-1.5" />
							Help Center
						</button>
					</div>

					<button
						className={`flex items-center space-x-3 w-full p-2.5 rounded-lg ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary} transition-colors cursor-pointer`}
						onClick={() => showToast("Settings feature coming soon!", "info")}
					>
						<Settings className="h-5 w-5" />
						<span className="font-medium text-sm">Settings</span>
					</button>

					<button
						className={`flex items-center space-x-3 w-full p-2.5 rounded-lg ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:text-red-500 transition-colors cursor-pointer mt-2`}
						onClick={() => showToast("Logged out successfully", "success")}
					>
						<LogOut className="h-5 w-5" />
						<span className="font-medium text-sm">Sign Out</span>
					</button>
				</div>
			</div>
		</aside>
	)
);

const GroupHub = () => {
	const [darkThemeFlag, setDarkThemeFlag] = useState(false);
	const [currentView, setCurrentView] = useState("home");
	const [notifPanelOpen, setNotifPanelOpen] = useState(false);
	const [createGroupPopup, setCreateGroupPopup] = useState(false);
	const [userDropdownVisible, setUserDropdownVisible] = useState(false);
	const [activeGroupData, setActiveGroupData] = useState<GroupData | null>(
		null
	);
	const [userGroupList, setUserGroupList] = useState<GroupData[]>([]);
	const [postFeedItems, setPostFeedItems] =
		useState<PostData[]>(samplePostData);
	const [alertList, setAlertList] = useState<AlertData[]>(sampleAlertData);
	const [newPostText, setNewPostText] = useState("");
	const [imageForPost, setImageForPost] = useState<string | null>(null);
	const [imgUrlField, setImgUrlField] = useState("");
	const [urlInputVisible, setUrlInputVisible] = useState(false);
	const [emojiSelectorOpen, setEmojiSelectorOpen] = useState(false);
	const [emojiOptions] = useState([
		"😀",
		"😂",
		"❤️",
		"👍",
		"🤔",
		"✨",
		"🎉",
		"🚀",
	]);
	const [groupNameInput, setGroupNameInput] = useState("");
	const [groupDescInput, setGroupDescInput] = useState("");
	const [groupCatInput, setGroupCatInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [displayGroupResults, setDisplayGroupResults] =
		useState<GroupData[]>(sampleGroupData);
	const [searchActive, setSearchActive] = useState(false);
	const [sideNavOpen, setSideNavOpen] = useState(false);
	const [toast, setToast] = useState<ToastData | null>(null);

	const notifDropdownRef = useRef<HTMLDivElement>(null);
	const profMenuRef = useRef<HTMLDivElement>(null);
	const emojiBoxRef = useRef<HTMLDivElement>(null);
	const scrollToTopRef = useRef<HTMLDivElement>(null);

	const styleConfig = fetchStyleSettings(darkThemeFlag);

	const showToast = useCallback((message: string, type: string = "info") => {
		setToast({ message, type });
	}, []);

	useEffect(() => {
		setUserGroupList(sampleGroupData.filter((group) => group.joined));
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				notifDropdownRef.current &&
				!notifDropdownRef.current.contains(event.target as Node)
			) {
				setNotifPanelOpen(false);
			}
			if (
				profMenuRef.current &&
				!profMenuRef.current.contains(event.target as Node)
			) {
				setUserDropdownVisible(false);
			}
			if (
				emojiBoxRef.current &&
				!emojiBoxRef.current.contains(event.target as Node)
			) {
				const emojiButton = document.getElementById("emoji-button");
				if (!emojiButton || !emojiButton.contains(event.target as Node)) {
					setEmojiSelectorOpen(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (searchQuery.trim()) {
			setDisplayGroupResults(
				sampleGroupData.filter(
					(group) =>
						group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						group.description
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						group.category.toLowerCase().includes(searchQuery.toLowerCase())
				)
			);
			setSearchActive(true);
		} else {
			setDisplayGroupResults(sampleGroupData);
			setSearchActive(false);
		}
	}, [searchQuery]);

	useEffect(() => {
		if (
			imgUrlField.trim() &&
			(imgUrlField.startsWith("http://") || imgUrlField.startsWith("https://"))
		) {
			setImageForPost(imgUrlField.trim());
		} else {
			setImageForPost(null);
		}
	}, [imgUrlField]);

	useEffect(() => {
		const inlineCss = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.4s ease-out forwards;
      }
      
      .animate-scale-in {
        animation: scaleIn 0.3s ease-out forwards;
      }
      
      .animate-slide-in-right {
        animation: slideInRight 0.4s ease-out forwards;
      }
      
      .animate-slide-in-left {
        animation: slideInLeft 0.4s ease-out forwards;
      }
      
      .delay-100 {
        animation-delay: 100ms;
      }
      
      .delay-200 {
        animation-delay: 200ms;
      }
      
      .delay-300 {
        animation-delay: 300ms;
      }
      
      .focus-ring {
        @apply focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all;
      }
      
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        @apply bg-emerald-500/30 rounded-full;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        @apply bg-emerald-500/50;
      }
      
      .card-hover {
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        border: 1px solid transparent;
      }
      
      .card-hover:hover {
        transform: translateY(-3px) scale(1.01);
        box-shadow: 0 10px 20px -5px ${
					darkThemeFlag ? "rgba(0,0,0,0.4)" : "rgba(100,116,139,0.15)"
				};
        border-color: ${
					darkThemeFlag ? "rgba(45, 212, 191, 0.3)" : "rgba(79, 70, 229, 0.4)"
				};
      }
      
      .img-zoom {
        overflow: hidden;
      }
      
      .img-zoom img {
        transition: transform 0.5s ease;
      }
      
      .img-zoom:hover img {
        transform: scale(1.05);
      }
      
      @keyframes buttonPulse {
        0% {
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
          box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
      }
      
      .pulse-effect:hover {
        animation: buttonPulse 1.5s infinite;
      }
      
      .bg-pattern {
         background-image: radial-gradient(${
						darkThemeFlag ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)"
					} 1px, transparent 1px);
         background-size: 12px 12px;
      }
    `;

		const styleElement = document.createElement("style");
		styleElement.innerHTML = inlineCss;
		document.head.appendChild(styleElement);

		return () => {
			document.head.removeChild(styleElement);
		};
	}, [darkThemeFlag]);

	const switchColorMode = useCallback(() => {
		setDarkThemeFlag(!darkThemeFlag);
	}, [darkThemeFlag]);

	const updateGroupMembership = useCallback(
		(group: GroupData) => {
			const updatedGroups = sampleGroupData.map((g) =>
				g.id === group.id ? { ...g, joined: !g.joined } : g
			);

			sampleGroupData.length = 0;
			sampleGroupData.push(...updatedGroups);

			setDisplayGroupResults([...sampleGroupData]);

			if (group.joined) {
				setUserGroupList((prev) => prev.filter((g) => g.id !== group.id));
				showToast(`Left the "${group.name}" group`, "info");
			} else {
				setUserGroupList((prev) => [...prev, { ...group, joined: true }]);
				showToast(`Joined the "${group.name}" group`, "success");
			}

			if (activeGroupData && activeGroupData.id === group.id) {
				setActiveGroupData({ ...group, joined: !group.joined });
			}
		},
		[activeGroupData, showToast]
	);

	const submitNewPost = useCallback(() => {
		if ((!newPostText.trim() && !imgUrlField.trim()) || !activeGroupData)
			return;

		const newPost: PostData = {
			id: postFeedItems.length + 1,
			userId: loggedInUser.id,
			groupId: activeGroupData.id,
			content: newPostText,
			image: imgUrlField.trim() || undefined,
			timestamp: "Just now",
			likes: 0,
			reactions: {},
			comments: [],
			liked: false,
			bookmarked: false,
			userReaction: null,
		};

		setPostFeedItems([newPost, ...postFeedItems]);
		setNewPostText("");
		setImgUrlField("");
		setImageForPost(null);
		setUrlInputVisible(false);
		showToast("Post created successfully!", "success");
	}, [newPostText, imgUrlField, activeGroupData, postFeedItems, showToast]);

	const addEmojiToPost = useCallback((emoji: string) => {
		setNewPostText((prev) => prev + emoji);
		setEmojiSelectorOpen(false);
	}, []);

	const resetImageLink = useCallback(() => {
		setImgUrlField("");
		setImageForPost(null);
		setUrlInputVisible(false);
	}, []);

	const changeLikeStatus = useCallback(
		(postId: number) => {
			setPostFeedItems((prev) =>
				prev.map((post) => {
					if (post.id === postId) {
						const newLikedStatus = !post.liked;
						return {
							...post,
							liked: newLikedStatus,
							likes: newLikedStatus ? post.likes + 1 : post.likes - 1,
						};
					}
					return post;
				})
			);
			showToast("Post liked!", "success");
		},
		[showToast]
	);

	const updateReaction = useCallback(
		(
			postId: number,
			newReaction: string | null,
			oldReaction: string | null
		) => {
			setPostFeedItems((prev) =>
				prev.map((post) => {
					if (post.id === postId) {
						const updatedReactions = { ...post.reactions };

						if (oldReaction && updatedReactions[oldReaction]) {
							updatedReactions[oldReaction] = Math.max(
								0,
								updatedReactions[oldReaction] - 1
							);
						}

						if (newReaction) {
							updatedReactions[newReaction] =
								(updatedReactions[newReaction] || 0) + 1;
						}

						return {
							...post,
							userReaction: newReaction,
							reactions: updatedReactions,

							liked: newReaction ? false : post.liked,
						};
					}
					return post;
				})
			);
		},
		[]
	);

	const changeBookmarkStatus = useCallback(
		(postId: number) => {
			setPostFeedItems((prev) =>
				prev.map((post) => {
					if (post.id === postId) {
						const newStatus = !post.bookmarked;
						showToast(
							newStatus
								? "Post saved to bookmarks"
								: "Post removed from bookmarks",
							newStatus ? "success" : "info"
						);
						return {
							...post,
							bookmarked: newStatus,
						};
					}
					return post;
				})
			);
		},
		[showToast]
	);

	const submitNewComment = useCallback((postId: number, content: string) => {
		if (!content.trim()) return;

		setPostFeedItems((prev) =>
			prev.map((post) => {
				if (post.id === postId) {
					const newComment: CommentData = {
						id: post.comments.length + 1,
						userId: loggedInUser.id,
						content,
						timestamp: "Just now",
					};
					return {
						...post,
						comments: [...post.comments, newComment],
					};
				}
				return post;
			})
		);
	}, []);

	const submitNewGroup = useCallback(() => {
		if (
			!groupNameInput.trim() ||
			!groupDescInput.trim() ||
			!groupCatInput.trim()
		)
			return;

		const newGroup: GroupData = {
			id: sampleGroupData.length + 1,
			name: groupNameInput,
			description: groupDescInput,
			cover:
				"https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGNvbW11bml0eXxlbnwwfHwwfHx8MA%3D%3D",
			icon: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JvdXB8ZW58MHx8MHx8fDA%3D",
			members: 1,
			posts: 0,
			joined: true,
			category: groupCatInput,
		};

		sampleGroupData.push(newGroup);
		setUserGroupList([...userGroupList, newGroup]);
		setDisplayGroupResults([...displayGroupResults, newGroup]);
		setCreateGroupPopup(false);
		setGroupNameInput("");
		setGroupDescInput("");
		setGroupCatInput("");
		showToast(`Group "${newGroup.name}" created successfully!`, "success");
	}, [
		groupNameInput,
		groupDescInput,
		groupCatInput,
		userGroupList,
		displayGroupResults,
		showToast,
	]);

	const goBackHome = useCallback(() => {
		setActiveGroupData(null);
		setCurrentView("home");
	}, []);

	const fetchRelevantPosts = useCallback(() => {
		if (activeGroupData) {
			return postFeedItems.filter(
				(post) => post.groupId === activeGroupData.id
			);
		}

		if (currentView === "home") {
			const joinedGroupIds = userGroupList.map((group) => group.id);
			return postFeedItems.filter((post) =>
				joinedGroupIds.includes(post.groupId)
			);
		}

		return [];
	}, [activeGroupData, currentView, postFeedItems, userGroupList]);

	const clearAlerts = useCallback(() => {
		setAlertList((prev) => prev.map((notif) => ({ ...notif, read: true })));
		showToast("All notifications marked as read", "success");
	}, [showToast]);

	const newAlertsNum = alertList.filter((n) => !n.read).length;

	return (
		<div
			className={`min-h-screen ${styleConfig.bgPrimary} ${styleConfig.textPrimary} font-sans transition-colors duration-200`}
		>
			{}
			{sideNavOpen && (
				<div
					className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
					onClick={() => setSideNavOpen(false)}
				>
					<div
						className={`${styleConfig.bgSecondary} h-full w-4/5 max-w-xs animate-slide-in-left shadow-xl flex flex-col`}
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className={`p-4 flex justify-between items-center border-b ${styleConfig.border}`}
						>
							<h2
								className={`text-xl font-semibold ${styleConfig.textPrimary}`}
							>
								InterestHub
							</h2>
							<button
								onClick={() => setSideNavOpen(false)}
								className="cursor-pointer"
							>
								<X className={`h-6 w-6 ${styleConfig.textPrimary}`} />
							</button>
						</div>

						<div className="p-4 overflow-y-auto flex-grow">
							<div className="flex items-center space-x-3 mb-6">
								<img
									src={loggedInUser.avatar}
									alt={loggedInUser.name}
									className="h-12 w-12 rounded-full object-cover"
								/>
								<div>
									<p className={`font-medium ${styleConfig.textPrimary}`}>
										{loggedInUser.name}
									</p>
									<p className={`text-sm ${styleConfig.textTertiary}`}>
										@{loggedInUser.username}
									</p>
								</div>
							</div>

							<nav className="space-y-1">
								{[
									{ icon: Home, label: "Home", id: "home" },
									{ icon: Search, label: "Discover", id: "discover" },
									{ icon: Bookmark, label: "My Groups", id: "groups" },
									{ icon: User, label: "Profile", id: "profile" },
								].map((item) => (
									<button
										key={item.id}
										className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${
											currentView === item.id
												? `${styleConfig.bgActiveNav} ${styleConfig.accentText}`
												: `${styleConfig.bgSecondary} ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary}`
										}`}
										onClick={() => {
											setCurrentView(item.id);
											setSideNavOpen(false);
										}}
									>
										<item.icon
											className={`h-5 w-5 ${
												currentView === item.id
													? styleConfig.accentText
													: styleConfig.textSecondary
											}`}
										/>
										<span>{item.label}</span>
									</button>
								))}

								<button
									className={`flex items-center space-x-3 w-full p-3 rounded-lg ${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} transition-colors mt-4 cursor-pointer`}
									onClick={() => {
										setCreateGroupPopup(true);
										setSideNavOpen(false);
									}}
								>
									<Plus className="h-5 w-5" />
									<span>Create Group</span>
								</button>
							</nav>
						</div>
						<div
							className={`p-4 mt-auto border-t ${styleConfig.border} flex-shrink-0 space-y-2`}
						>
							<button
								className={`flex items-center space-x-3 w-full p-3 rounded-lg ${styleConfig.bgTertiary} ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary} transition-colors cursor-pointer`}
								onClick={() =>
									showToast("Settings feature coming soon!", "info")
								}
							>
								<Settings className="h-5 w-5" />
								<span>Settings</span>
							</button>

							<button
								className={`flex items-center space-x-3 w-full p-3 rounded-lg ${styleConfig.bgTertiary} ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary} transition-colors cursor-pointer`}
								onClick={() => showToast("Logout feature coming soon!", "info")}
							>
								<LogOut className="h-5 w-5" />
								<span>Logout</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{}
			<header
				className={`sticky top-0 z-30 bg-gradient-to-r ${styleConfig.gradientHeaderFrom} ${styleConfig.gradientHeaderTo} border-b ${styleConfig.border} shadow-sm transition-colors duration-200`}
			>
				<div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<button
								className={`md:hidden mr-3 ${styleConfig.textSecondary} hover:${styleConfig.textPrimary} cursor-pointer`}
								onClick={() => setSideNavOpen(true)}
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
							<div
								className="flex items-center cursor-pointer"
								onClick={() => {
									setCurrentView("home");
									setActiveGroupData(null);
								}}
							>
								<div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 rounded-lg mr-2">
									<Users className="h-6 w-6 text-white" />
								</div>
								<h1
									className={`text-xl font-semibold hidden sm:block ${styleConfig.textPrimary}`}
								>
									InterestHub
								</h1>
							</div>
						</div>

						<div className="hidden md:block flex-1 max-w-md mx-8">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Search className={`h-5 w-5 ${styleConfig.textTertiary}`} />
								</div>
								<input
									type="search"
									placeholder="Search groups..."
									className={`block w-full pl-10 pr-3 py-1.5 rounded-full border ${styleConfig.input} focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm`}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex items-center space-x-2 sm:space-x-3">
							<button
								onClick={switchColorMode}
								className={`p-2 rounded-lg ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary} transition-colors cursor-pointer`}
								title={
									darkThemeFlag ? "Switch to Light Mode" : "Switch to Dark Mode"
								}
							>
								{darkThemeFlag ? (
									<Sun className="h-5 w-5" />
								) : (
									<Moon className="h-5 w-5" />
								)}
							</button>

							<div className="relative" ref={notifDropdownRef}>
								<button
									className={`p-2.5 rounded-lg relative ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary} transition-colors cursor-pointer`}
									onClick={() => setNotifPanelOpen(!notifPanelOpen)}
								>
									<Bell className="h-5 w-5" />
									{newAlertsNum > 0 && (
										<span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-medium border-2 border-white">
											{newAlertsNum}
										</span>
									)}
								</button>

								{notifPanelOpen && (
									<div
										className={`absolute right-0 mt-2 w-65 sm:w-80 rounded-lg shadow-lg py-1 ${styleConfig.bgSecondary} border ${styleConfig.border} z-50 animate-scale-in max-h-[80vh] overflow-auto`}
									>
										<div
											className={`flex justify-between items-center px-4 py-2 border-b ${styleConfig.border} sticky top-0 ${styleConfig.bgSecondary} z-10`}
										>
											<h3 className="font-medium">Notifications</h3>
											<button
												className={`text-sm ${styleConfig.accentText} ${styleConfig.accentTextHover} cursor-pointer`}
												onClick={clearAlerts}
											>
												Mark all as read
											</button>
										</div>
										<div className="max-h-96 overflow-y-auto">
											{alertList.length > 0 ? (
												alertList.map((notification) => {
													const user = findUser(notification.userId);
													let content = "";
													let iconComponent = null;

													switch (notification.type) {
														case "like":
															content = " liked your post";
															iconComponent = (
																<Heart className="h-4 w-4 text-red-500" />
															);
															break;
														case "comment":
															content = " commented on your post";
															iconComponent = (
																<MessageCircle className="h-4 w-4 text-blue-500" />
															);
															break;
														case "follow":
															content = " started following you";
															iconComponent = (
																<User className="h-4 w-4 text-purple-500" />
															);
															break;
														case "groupInvite":
															const group = notification.groupId
																? findGroup(notification.groupId)
																: null;
															content = ` invited you to join ${
																group?.name || "a group"
															}`;
															iconComponent = (
																<Plus className="h-4 w-4 text-emerald-500" />
															);
															break;
														default:
															break;
													}

													return (
														<div
															key={notification.id}
															className={`px-4 py-3 flex items-start border-b ${
																styleConfig.border
															} ${
																notification.read
																	? ""
																	: styleConfig.accentBgLight
															} hover:${styleConfig.bgHover}`}
														>
															<div className="flex-shrink-0 mr-3">
																<img
																	src={user.avatar}
																	alt={user.name}
																	className="h-8 w-8 rounded-full object-cover"
																/>
															</div>
															<div className="flex-1 min-w-0">
																<div className="flex items-center mb-1">
																	<p
																		className={`text-sm font-medium ${styleConfig.textPrimary} mr-1`}
																	>
																		{user.name}
																	</p>
																	<div className="flex items-center">
																		{iconComponent}
																	</div>
																</div>
																<p
																	className={`text-sm ${styleConfig.textSecondary}`}
																>
																	{user.name}
																	{content}
																</p>
																<p
																	className={`text-xs ${styleConfig.textTertiary} mt-1`}
																>
																	{notification.timestamp}
																</p>
															</div>
														</div>
													);
												})
											) : (
												<div className="px-4 py-6 text-center">
													<p className={`${styleConfig.textSecondary}`}>
														No notifications yet
													</p>
												</div>
											)}
										</div>
									</div>
								)}
							</div>

							<div className="relative" ref={profMenuRef}>
								<button
									className="flex items-center space-x-2 cursor-pointer"
									onClick={() => setUserDropdownVisible(!userDropdownVisible)}
								>
									<img
										src={loggedInUser.avatar}
										alt={loggedInUser.name}
										className={`h-8 w-8 rounded-full object-cover border-2 ${styleConfig.accentBorder}`}
									/>
								</button>

								{userDropdownVisible && (
									<div
										className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 ${styleConfig.bgSecondary} border ${styleConfig.border} z-50 animate-scale-in`}
									>
										<div className={`px-4 py-3 border-b ${styleConfig.border}`}>
											<p
												className={`text-sm font-medium ${styleConfig.textPrimary}`}
											>
												{loggedInUser.name}
											</p>
											<p className={`text-sm ${styleConfig.textTertiary}`}>
												@{loggedInUser.username}
											</p>
										</div>

										<div className="py-1">
											<button
												className={`flex items-center px-4 py-2.5 w-full text-left ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary} cursor-pointer`}
												onClick={() => {
													setCurrentView("profile");
													setUserDropdownVisible(false);
												}}
											>
												<User className="h-4 w-4 mr-3" />
												<span>My Profile</span>
											</button>

											<button
												className={`flex items-center px-4 py-2.5 w-full text-left ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary} cursor-pointer`}
												onClick={() => {
													setUserDropdownVisible(false);
													showToast("Settings feature coming soon!", "info");
												}}
											>
												<Settings className="h-4 w-4 mr-3" />
												<span>Settings</span>
											</button>

											<div
												className={`border-t ${styleConfig.border} my-1`}
											></div>

											<button
												className={`flex items-center px-4 py-2.5 w-full text-left ${styleConfig.textSecondary} ${styleConfig.bgHover} hover:${styleConfig.textPrimary} cursor-pointer`}
												onClick={() => {
													setUserDropdownVisible(false);
													showToast("Logout feature coming soon!", "info");
												}}
											>
												<LogOut className="h-4 w-4 mr-3" />
												<span>Sign out</span>
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="md:hidden pb-3 px-2">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className={`h-5 w-5 ${styleConfig.textTertiary}`} />
							</div>
							<input
								type="search"
								placeholder="Search groups..."
								className={`block w-full pl-10 pr-3 py-1.5 rounded-full border ${styleConfig.input} focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm`}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-full mx-auto md:flex">
				<SidePanel
					currentView={currentView}
					setCurrentView={setCurrentView}
					setActiveGroupData={setActiveGroupData}
					setSearchActive={setSearchActive}
					setCreateGroupPopup={setCreateGroupPopup}
					styleConfig={styleConfig}
                    showToast={showToast}
				/>

				<main
					className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 w-full md:w-auto"
					ref={scrollToTopRef}
				>
					{activeGroupData ? (
						<div className="animate-fade-in">
							<div
								className={`rounded-lg overflow-hidden ${styleConfig.cardBg} shadow-sm border ${styleConfig.border} mb-4 md:mb-5`}
							>
								<div className="relative h-32 md:h-40">
									<img
										src={activeGroupData.cover}
										alt={activeGroupData.name}
										className="w-full h-full object-cover"
									/>
									<div
										className={`absolute inset-0 bg-gradient-to-t ${styleConfig.gradientProfileFrom} ${styleConfig.gradientProfileTo} opacity-80`}
									></div>
									<button
										className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
										onClick={goBackHome}
									>
										<ChevronLeft className="h-5 w-5" />
									</button>
								</div>
								<div className="p-4 md:p-5 relative">
									<div className="flex flex-col sm:flex-row sm:items-end">
										<div className="absolute -top-10 left-4 md:left-5 sm:static sm:mr-3 flex-shrink-0">
											<img
												src={activeGroupData.icon}
												alt=""
												className={`h-16 w-16 md:h-18 md:w-18 rounded-lg object-cover border-4 ${styleConfig.bgSecondary} shadow-md`}
											/>
										</div>
										<div className="pt-8 sm:pt-0 sm:flex-1 min-w-0">
											<h1
												className={`text-lg md:text-xl font-semibold ${styleConfig.textPrimary} truncate`}
											>
												{activeGroupData.name}
											</h1>
											<p
												className={`text-xs ${styleConfig.textTertiary} mt-0.5 mb-1 truncate`}
											>
												{activeGroupData.category} • {activeGroupData.members}{" "}
												members • {activeGroupData.posts} posts
											</p>
											<p
												className={`text-sm ${styleConfig.textSecondary} line-clamp-2`}
											>
												{activeGroupData.description}
											</p>
										</div>
										<div className="mt-3 sm:mt-0 sm:ml-3 flex-shrink-0">
											<button
												className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors w-full sm:w-auto cursor-pointer ${
													activeGroupData.joined
														? `${styleConfig.bgTertiary} ${styleConfig.textPrimary} hover:bg-red-500/80 hover:text-white`
														: `${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover}`
												}`}
												onClick={() => updateGroupMembership(activeGroupData)}
											>
												{activeGroupData.joined ? "Leave Group" : "Join Group"}
											</button>
										</div>
									</div>
								</div>
							</div>

							{activeGroupData.joined && (
								<div
									className={`rounded-lg ${styleConfig.cardBg} shadow-sm border ${styleConfig.border} p-3 mb-4 md:mb-5 animate-fade-in`}
								>
									<div className="flex items-start space-x-2.5">
										<img
											src={loggedInUser.avatar}
											alt={loggedInUser.name}
											className="h-9 w-9 rounded-full object-cover"
										/>
										<div className="flex-1">
											<textarea
												placeholder={`Share something in ${activeGroupData.name}...`}
												value={newPostText}
												onChange={(e) => setNewPostText(e.target.value)}
												className={`w-full p-2 px-3 rounded-md border ${styleConfig.input} resize-none focus:ring-emerald-500 focus:border-emerald-500 min-h-[50px] text-sm`}
											/>
											{urlInputVisible && (
												<div className="mt-2 relative">
													<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
														<LinkIcon
															className={`h-4 w-4 ${styleConfig.textTertiary}`}
														/>
													</div>
													<input
														type="url"
														placeholder="Paste image URL here..."
														value={imgUrlField}
														onChange={(e) => setImgUrlField(e.target.value)}
														className={`w-full pl-9 pr-3 py-1.5 rounded-md border ${styleConfig.input} focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
													/>
												</div>
											)}
											{imageForPost && (
												<div
													className={`mt-2 relative rounded-md overflow-hidden border ${styleConfig.border}`}
												>
													<img
														src={imageForPost}
														alt="Post preview"
														className="w-full h-48 object-cover"
														onError={() => setImageForPost(null)}
													/>
													<button
														className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
														onClick={resetImageLink}
													>
														<X className="h-4 w-4" />
													</button>
												</div>
											)}
											<div className="flex justify-between items-center mt-2">
												<div className="flex space-x-1 relative">
													<button
														className={`p-2 rounded-lg ${
															styleConfig.textSecondary
														} ${styleConfig.bgHover} ${
															styleConfig.secondaryAccentTextHover
														} transition-colors cursor-pointer ${
															urlInputVisible ? styleConfig.accentBgLight : ""
														}`}
														onClick={() => setUrlInputVisible(!urlInputVisible)}
													>
														<ImageIcon className="h-4 w-4" />
													</button>
													<div ref={emojiBoxRef}>
														<button
															id="emoji-button"
															className={`p-2 rounded-lg ${styleConfig.textSecondary} ${styleConfig.bgHover} ${styleConfig.secondaryAccentTextHover} transition-colors cursor-pointer`}
															onClick={() =>
																setEmojiSelectorOpen(!emojiSelectorOpen)
															}
														>
															<SmileIcon className="h-4 w-4" />
														</button>
														{emojiSelectorOpen && (
															<div
																className={`absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg border ${styleConfig.border} ${styleConfig.bgSecondary} flex space-x-1 z-10 animate-scale-in`}
															>
																{emojiOptions.map((emoji) => (
																	<button
																		key={emoji}
																		onClick={() => addEmojiToPost(emoji)}
																		className={`p-1 rounded ${styleConfig.bgHover} text-lg cursor-pointer`}
																	>
																		{emoji}
																	</button>
																))}
															</div>
														)}
													</div>
												</div>
												<button
													className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${
														newPostText.trim() || imgUrlField.trim()
															? `${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} pulse-effect`
															: `${styleConfig.bgTertiary} ${styleConfig.textTertiary}`
													}`}
													disabled={!newPostText.trim() && !imgUrlField.trim()}
													onClick={submitNewPost}
												>
													Post
												</button>
											</div>
										</div>
									</div>
								</div>
							)}

							<div className="space-y-3 md:space-y-4">
								{fetchRelevantPosts().length > 0 ? (
									fetchRelevantPosts().map((post, index) => (
										<SinglePostDisplay
											key={post.id}
											pData={post}
											uData={findUser(post.userId)}
											gData={findGroup(post.groupId)}
											toggleLike={changeLikeStatus}
											toggleBookmark={changeBookmarkStatus}
											handleCreateComment={submitNewComment}
											updateReaction={updateReaction}
											styles={styleConfig}
											delay={index * 100}
											showToast={showToast}
										/>
									))
								) : (
									<div
										className={`rounded-xl ${styleConfig.cardBg} shadow-md p-8 text-center animate-fade-in border ${styleConfig.border}`}
									>
										<div
											className={`w-16 h-16 mx-auto rounded-full ${styleConfig.accentBgLight} flex items-center justify-center mb-4`}
										>
											<MessageCircle
												className={`h-8 w-8 ${styleConfig.accentText}`}
											/>
										</div>
										<h3
											className={`text-xl font-semibold ${styleConfig.textPrimary} mb-2`}
										>
											No posts yet
										</h3>
										<p
											className={`${styleConfig.textSecondary} max-w-md mx-auto`}
										>
											{activeGroupData.joined
												? "Be the first to post in this group and start the conversation!"
												: "Join this group to see posts and be part of the conversation."}
										</p>
										{!activeGroupData.joined && (
											<button
												className={`mt-4 px-4 py-2 rounded-lg ${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} transition-colors cursor-pointer`}
												onClick={() => updateGroupMembership(activeGroupData)}
											>
												Join Group
											</button>
										)}
									</div>
								)}
							</div>
						</div>
					) : (
						<>
							{searchActive ? (
								<div className="animate-fade-in">
									<div className="mb-4 md:mb-5">
										<h2
											className={`text-lg font-semibold ${styleConfig.textPrimary} mb-3`}
										>
											Search Results for &quot;{searchQuery}&quot;
										</h2>
										{displayGroupResults.length > 0 ? (
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
												{displayGroupResults.map((group, index) => (
													<MemoizedGroupInfoBox
														key={group.id}
														group={group}
														onSelect={() => setActiveGroupData(group)}
														onToggleJoin={() => updateGroupMembership(group)}
														styles={styleConfig}
														delay={index * 100}
													/>
												))}
											</div>
										) : (
											<div
												className={`rounded-xl ${styleConfig.cardBg} shadow-md p-8 text-center border ${styleConfig.border}`}
											>
												<div
													className={`w-16 h-16 mx-auto rounded-full ${styleConfig.accentBgLight} flex items-center justify-center mb-4`}
												>
													<Search
														className={`h-8 w-8 ${styleConfig.accentText}`}
													/>
												</div>
												<h3
													className={`text-xl font-semibold ${styleConfig.textPrimary} mb-2`}
												>
													No results found
												</h3>
												<p
													className={`${styleConfig.textSecondary} max-w-md mx-auto`}
												>
													We couldn&apos;t find any groups matching &quot;
													{searchQuery}&quot;. Try a different search term or
													create a new group!
												</p>
												<button
													className={`mt-4 px-4 py-2 rounded-lg ${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} transition-colors cursor-pointer`}
													onClick={() => setCreateGroupPopup(true)}
												>
													Create Group
												</button>
											</div>
										)}
									</div>
								</div>
							) : (
								<>
									{currentView === "home" && (
										<div className="animate-fade-in space-y-3 md:space-y-4">
											{userGroupList.length === 0 ? (
												<div
													className={`rounded-xl ${styleConfig.cardBg} shadow-md p-8 text-center border ${styleConfig.border}`}
												>
													<div
														className={`w-16 h-16 mx-auto rounded-full ${styleConfig.accentBgLight} flex items-center justify-center mb-4`}
													>
														<Users
															className={`h-8 w-8 ${styleConfig.accentText}`}
														/>
													</div>
													<h3
														className={`text-xl font-semibold ${styleConfig.textPrimary} mb-2`}
													>
														Join some groups to get started
													</h3>
													<p
														className={`${styleConfig.textSecondary} max-w-md mx-auto mb-4`}
													>
														Your feed will show posts from the groups you join.
														Discover groups that match your interests!
													</p>
													<button
														className={`px-4 py-2 rounded-lg ${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} transition-colors cursor-pointer`}
														onClick={() => setCurrentView("discover")}
													>
														Discover Groups
													</button>
												</div>
											) : fetchRelevantPosts().length === 0 ? (
												<div
													className={`rounded-xl ${styleConfig.cardBg} shadow-md p-8 text-center border ${styleConfig.border}`}
												>
													<div
														className={`w-16 h-16 mx-auto rounded-full ${styleConfig.accentBgLight} flex items-center justify-center mb-4`}
													>
														<MessageCircle
															className={`h-8 w-8 ${styleConfig.accentText}`}
														/>
													</div>
													<h3
														className={`text-xl font-semibold ${styleConfig.textPrimary} mb-2`}
													>
														No posts yet
													</h3>
													<p
														className={`${styleConfig.textSecondary} max-w-md mx-auto`}
													>
														There are no posts in your groups yet. Be the first
														to start a conversation!
													</p>
												</div>
											) : (
												fetchRelevantPosts().map((post, index) => (
													<SinglePostDisplay
														key={post.id}
														pData={post}
														uData={findUser(post.userId)}
														gData={findGroup(post.groupId)}
														toggleLike={changeLikeStatus}
														toggleBookmark={changeBookmarkStatus}
														handleCreateComment={submitNewComment}
														updateReaction={updateReaction}
														styles={styleConfig}
														delay={index * 100}
														showToast={showToast}
													/>
												))
											)}
										</div>
									)}

									{currentView === "discover" && (
										<div className="animate-fade-in">
											<div className="mb-4 md:mb-5">
												<h2
													className={`text-lg font-semibold ${styleConfig.textPrimary} mb-1.5`}
												>
													Discover Groups
												</h2>
												<p className={`text-sm ${styleConfig.textSecondary}`}>
													Find communities interests
												</p>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
												{sampleGroupData.map((group, index) => (
													<MemoizedGroupInfoBox
														key={group.id}
														group={group}
														onSelect={() => setActiveGroupData(group)}
														onToggleJoin={() => updateGroupMembership(group)}
														styles={styleConfig}
														delay={index * 100}
													/>
												))}
											</div>
										</div>
									)}

									{currentView === "groups" && (
										<div className="animate-fade-in">
											<div className="mb-4 md:mb-5">
												<h2
													className={`text-lg font-semibold ${styleConfig.textPrimary} mb-1.5`}
												>
													My Groups
												</h2>
												<p className={`text-sm ${styleConfig.textSecondary}`}>
													Communities you&apos;ve joined
												</p>
											</div>
											{userGroupList.length > 0 ? (
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
													{userGroupList.map((group, index) => (
														<MemoizedGroupInfoBox
															key={group.id}
															group={group}
															onSelect={() => setActiveGroupData(group)}
															onToggleJoin={() => updateGroupMembership(group)}
															styles={styleConfig}
															delay={index * 100}
														/>
													))}
												</div>
											) : (
												<div
													className={`rounded-xl ${styleConfig.cardBg} shadow-md p-8 text-center border ${styleConfig.border}`}
												>
													<div
														className={`w-16 h-16 mx-auto rounded-full ${styleConfig.accentBgLight} flex items-center justify-center mb-4`}
													>
														<Bookmark
															className={`h-8 w-8 ${styleConfig.accentText}`}
														/>
													</div>
													<h3
														className={`text-xl font-semibold ${styleConfig.textPrimary} mb-2`}
													>
														You haven&apos;t joined any groups yet
													</h3>
													<p
														className={`${styleConfig.textSecondary} max-w-md mx-auto mb-4`}
													>
														Discover and join groups that match your interests
														to see them here.
													</p>
													<div className="flex flex-col sm:flex-row justify-center gap-3">
														<button
															className={`px-4 py-2 rounded-lg ${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} transition-colors cursor-pointer`}
															onClick={() => setCurrentView("discover")}
														>
															Discover Groups
														</button>
														<button
															className={`px-4 py-2 rounded-lg ${styleConfig.bgTertiary} ${styleConfig.textPrimary} ${styleConfig.bgHover} transition-colors cursor-pointer`}
															onClick={() => setCreateGroupPopup(true)}
														>
															Create a Group
														</button>
													</div>
												</div>
											)}
										</div>
									)}

									{currentView === "profile" && (
										<div className="animate-fade-in">
											<div
												className={`rounded-lg overflow-hidden ${styleConfig.cardBg} shadow-sm border ${styleConfig.border} mb-4 md:mb-5`}
											>
												<div className="relative h-32 md:h-56">
													<img
														src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1200&auto=format&fit=crop"
														alt="Profile cover"
														className="w-full h-full object-cover"
													/>
													<div
														className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent`}
													></div>
													<div className="absolute inset-0 opacity-20 bg-pattern"></div>
												</div>

												<div className="p-4 md:p-5 relative">
													<div className="flex flex-col sm:flex-row sm:items-end">
														<div className="absolute -top-10 left-4 md:left-5 sm:static sm:mr-3 flex-shrink-0">
															<img
																src={loggedInUser.avatar}
																alt={loggedInUser.name}
																className={`h-20 w-20 md:h-22 md:w-22 rounded-full object-cover border-4 ${styleConfig.bgSecondary} shadow-md`}
															/>
														</div>

														<div className="pt-12 sm:pt-0 sm:flex-1 min-w-0">
															<h1
																className={`text-lg md:text-xl font-semibold ${styleConfig.textPrimary}`}
															>
																{loggedInUser.name}
															</h1>
															<p
																className={`text-sm ${styleConfig.textTertiary} mb-1.5`}
															>
																@{loggedInUser.username}
															</p>
															<p
																className={`text-sm ${styleConfig.textSecondary} mb-3`}
															>
																{loggedInUser.bio}
															</p>

															<div className="flex space-x-4 md:space-x-5">
																<div>
																	<p
																		className={`font-medium ${styleConfig.textPrimary}`}
																	>
																		{loggedInUser.following}
																	</p>
																	<p
																		className={`text-xs ${styleConfig.textTertiary}`}
																	>
																		Following
																	</p>
																</div>
																<div>
																	<p
																		className={`font-medium ${styleConfig.textPrimary}`}
																	>
																		{loggedInUser.followers}
																	</p>
																	<p
																		className={`text-xs ${styleConfig.textTertiary}`}
																	>
																		Followers
																	</p>
																</div>
																<div>
																	<p
																		className={`font-medium ${styleConfig.textPrimary}`}
																	>
																		{userGroupList.length}
																	</p>
																	<p
																		className={`text-xs ${styleConfig.textTertiary}`}
																	>
																		Groups
																	</p>
																</div>
															</div>
														</div>

														<div className="mt-3 sm:mt-0 sm:ml-3 flex-shrink-0">
															<button
																className={`px-3 py-1.5 rounded-md text-xs font-medium ${styleConfig.bgTertiary} ${styleConfig.textPrimary} ${styleConfig.bgHover} transition-colors cursor-pointer`}
																onClick={() =>
																	showToast(
																		"Profile editing coming soon!",
																		"info"
																	)
																}
															>
																Edit Profile
															</button>
														</div>
													</div>
												</div>
											</div>

											<div className="mb-4 md:mb-5">
												<h2
													className={`text-base font-semibold ${styleConfig.textPrimary} mb-3`}
												>
													Your Groups
												</h2>

												{userGroupList.length > 0 ? (
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
														{userGroupList.map((group, index) => (
															<MemoizedGroupInfoBox
																key={group.id}
																group={group}
																onSelect={() => setActiveGroupData(group)}
																onToggleJoin={() =>
																	updateGroupMembership(group)
																}
																styles={styleConfig}
																delay={index * 100}
															/>
														))}
													</div>
												) : (
													<div
														className={`rounded-xl ${styleConfig.cardBg} shadow-md p-8 text-center border ${styleConfig.border}`}
													>
														<p className={`${styleConfig.textSecondary}`}>
															You haven&apos;t joined any groups yet.
														</p>
														<button
															className={`mt-3 px-4 py-2 rounded-lg ${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} transition-colors cursor-pointer`}
															onClick={() => setCurrentView("discover")}
														>
															Discover Groups
														</button>
													</div>
												)}
											</div>

											<div>
												<h2
													className={`text-base font-semibold ${styleConfig.textPrimary} mb-3`}
												>
													Your Posts
												</h2>

												{postFeedItems.filter(
													(post) => post.userId === loggedInUser.id
												).length > 0 ? (
													<div className="space-y-3 md:space-y-4">
														{postFeedItems
															.filter((post) => post.userId === loggedInUser.id)
															.map((post, index) => (
																<SinglePostDisplay
																	key={post.id}
																	pData={post}
																	uData={findUser(post.userId)}
																	gData={findGroup(post.groupId)}
																	toggleLike={changeLikeStatus}
																	toggleBookmark={changeBookmarkStatus}
																	handleCreateComment={submitNewComment}
																	updateReaction={updateReaction}
																	styles={styleConfig}
																	delay={index * 100}
																	showToast={showToast}
																/>
															))}
													</div>
												) : (
													<div
														className={`rounded-xl ${styleConfig.cardBg} shadow-md p-8 text-center border ${styleConfig.border}`}
													>
														<p className={`${styleConfig.textSecondary}`}>
															You haven&apos;t created any posts yet.
														</p>
														<button
															className={`mt-3 px-4 py-2 rounded-lg ${styleConfig.bgButton} text-white ${styleConfig.bgButtonHover} transition-colors cursor-pointer`}
															onClick={() => {
																if (userGroupList.length > 0) {
																	setActiveGroupData(userGroupList[0]);
																} else {
																	setCurrentView("discover");
																}
															}}
														>
															{userGroupList.length > 0
																? "Create a Post"
																: "Join Groups to Post"}
														</button>
													</div>
												)}
											</div>
										</div>
									)}
								</>
							)}
						</>
					)}
				</main>

				<aside className="hidden lg:block w-72 xl:w-80 px-4 py-6 sticky top-16 h-screen overflow-y-auto">
					<div
						className={`p-4 rounded-lg ${styleConfig.bgSecondary} border ${styleConfig.border}`}
					>
						<h3
							className={`font-semibold text-sm mb-3 ${styleConfig.textPrimary}`}
						>
							Suggested Groups
						</h3>
						<div className="space-y-3">
							{sampleGroupData
								.filter((group) => !group.joined)
								.slice(0, 3)
								.map((group) => (
									<div
										key={group.id}
										className={`flex items-center space-x-3 p-2 rounded-md ${styleConfig.bgHover} cursor-pointer`}
										onClick={() => setActiveGroupData(group)}
									>
										<img
											src={group.icon}
											alt={group.name}
											className="h-9 w-9 rounded-md object-cover flex-shrink-0"
										/>
										<div className="min-w-0">
											<p
												className={`text-sm font-medium ${styleConfig.textPrimary} truncate`}
											>
												{group.name}
											</p>
											<p
												className={`text-xs ${styleConfig.textTertiary} truncate`}
											>
												{group.members} members
											</p>
										</div>
									</div>
								))}
						</div>
					</div>

					<div
						className={`mt-4 p-4 rounded-lg ${styleConfig.bgSecondary} border ${styleConfig.border}`}
					>
						<h3
							className={`font-semibold text-sm mb-3 ${styleConfig.textPrimary}`}
						>
							Active Now
						</h3>
						<div className="space-y-3">
							{sampleUserData.slice(1, 4).map((user) => (
								<div
									key={user.id}
									className={`flex items-center space-x-3 p-2 rounded-md ${styleConfig.bgHover} cursor-pointer`}
									onClick={() =>
										showToast(`View ${user.name}'s profile`, "info")
									}
								>
									<div className="relative">
										<img
											src={user.avatar}
											alt={user.name}
											className="h-9 w-9 rounded-full object-cover flex-shrink-0"
										/>
										<div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
									</div>
									<div className="min-w-0">
										<p
											className={`text-sm font-medium ${styleConfig.textPrimary} truncate`}
										>
											{user.name}
										</p>
										<p
											className={`text-xs ${styleConfig.textTertiary} truncate`}
										>
											Online now
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</aside>
			</div>

			
			<div className="md:hidden sticky bottom-0 inset-x-0 z-30">
				<div
					className={`flex justify-around ${styleConfig.bgSecondary} border-t ${styleConfig.border} px-2 py-1.5`}
				>
					{[
						{ icon: Home, label: "Home", id: "home" },
						{ icon: Search, label: "Discover", id: "discover" },
						{ icon: Plus, label: "Create", id: "create" },
						{ icon: Bookmark, label: "Groups", id: "groups" },
						{ icon: User, label: "Profile", id: "profile" },
					].map((item) => (
						<button
							key={item.id}
							className={`flex flex-col items-center justify-center p-2 rounded-md w-16 cursor-pointer ${
								currentView === item.id
									? `${styleConfig.accentText} ${styleConfig.accentBgLight}`
									: styleConfig.textTertiary
							} transition-colors ${styleConfig.bgHover} hover:${
								styleConfig.textPrimary
							}`}
							onClick={() => {
								if (item.id === "create") {
									setCreateGroupPopup(true);
								} else {
									setCurrentView(item.id);
								}
							}}
						>
							<item.icon className="h-5 w-5" />
							<span className="text-xs mt-1">{item.label}</span>
						</button>
					))}
				</div>
			</div>

			
			{createGroupPopup && (
				<div
					className="fixed inset-0 z-50 overflow-y-auto"
					aria-labelledby="modal-title"
					role="dialog"
					aria-modal="true"
				>
					<div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
							aria-hidden="true"
							onClick={() => setCreateGroupPopup(false)}
						></div>

						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>

						<div
							className={`inline-block align-bottom ${styleConfig.bgSecondary} rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-scale-in border ${styleConfig.border} max-w-[95%] sm:w-full`}
							onClick={(e) => e.stopPropagation()}
						>
							<div
								className={`px-5 pt-6 pb-3 sm:pb-4 ${styleConfig.bgSecondary}`}
							>
								<div className="sm:flex sm:items-start">
									<div
										className={`mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full ${styleConfig.accentBgLight} sm:mx-0 sm:h-12 sm:w-12 shadow-sm`}
									>
										<Plus className={`h-7 w-7 ${styleConfig.accentText}`} />
									</div>
									<div className="mt-4 text-center sm:mt-0 sm:ml-5 sm:text-left w-full">
										<h3
											className={`text-xl leading-6 font-semibold ${styleConfig.textPrimary} mb-1`}
											id="modal-title"
										>
											Create a New Group
										</h3>
										<p className={`text-sm ${styleConfig.textSecondary} mb-4`}>
											Fill in the details to create your community
										</p>

										<div className="mt-5 space-y-5">
											<div>
												<label
													htmlFor="group-name"
													className={`block text-sm font-medium ${styleConfig.textPrimary} mb-1.5`}
												>
													Group Name
												</label>
												<input
													type="text"
													id="group-name"
													className={`block w-full rounded-lg px-4 py-2.5 ${styleConfig.input} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm text-base`}
													placeholder="Enter a memorable name"
													value={groupNameInput}
													onChange={(e) => setGroupNameInput(e.target.value)}
												/>
											</div>

											<div>
												<label
													htmlFor="group-category"
													className={`block text-sm font-medium ${styleConfig.textPrimary} mb-1.5`}
												>
													Category
												</label>
												<select
													id="group-category"
													className={`block w-full rounded-lg px-4 py-2.5 ${styleConfig.input} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm appearance-none bg-no-repeat bg-right text-base cursor-pointer`}
													style={{
														backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${
															darkThemeFlag
																? "rgb(156, 163, 175)"
																: "rgb(107, 114, 128)"
														}' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
														backgroundSize: "1.25rem",
														paddingRight: "2.5rem",
													}}
													value={groupCatInput}
													onChange={(e) => setGroupCatInput(e.target.value)}
												>
													<option value="">Select a category</option>
													<option value="Literature">Literature</option>
													<option value="Gaming">Gaming</option>
													<option value="Food & Cooking">Food & Cooking</option>
													<option value="Photography">Photography</option>
													<option value="Fitness & Health">
														Fitness & Health
													</option>
													<option value="Travel">Travel</option>
													<option value="Technology">Technology</option>
													<option value="Art & Design">Art & Design</option>
													<option value="Music">Music</option>
													<option value="Education">Education</option>
												</select>
											</div>

											<div>
												<label
													htmlFor="group-description"
													className={`block text-sm font-medium ${styleConfig.textPrimary} mb-1.5`}
												>
													Description
												</label>
												<textarea
													id="group-description"
													rows={4}
													className={`block w-full rounded-lg px-4 py-2.5 ${styleConfig.input} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm resize-none text-base`}
													placeholder="What's your group about? Be specific to attract the right members"
													value={groupDescInput}
													onChange={(e) => setGroupDescInput(e.target.value)}
												/>
												<p
													className={`mt-1.5 text-xs ${styleConfig.textTertiary}`}
												>
													{groupDescInput.length}/500 characters
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className={`px-5 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t ${styleConfig.border} ${styleConfig.bgTertiary}`}
							>
								<button
									type="button"
									className={`w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 ${styleConfig.bgButton} text-base font-medium text-white ${styleConfig.bgButtonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
									onClick={submitNewGroup}
									disabled={
										!groupNameInput.trim() ||
										!groupDescInput.trim() ||
										!groupCatInput.trim()
									}
								>
									<Plus className="h-5 w-5 mr-1.5" />
									Create Group
								</button>
								<button
									type="button"
									className={`mt-3 w-full inline-flex justify-center items-center rounded-lg border ${styleConfig.border} shadow-sm px-5 py-2.5 ${styleConfig.bgSecondary} ${styleConfig.textPrimary} ${styleConfig.bgHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:w-auto transition-colors cursor-pointer`}
									onClick={() => setCreateGroupPopup(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type as "success" | "error" | "info"}
					onClose={() => setToast(null)}
				/>
			)}
		</div>
	);
};

export default GroupHub;
