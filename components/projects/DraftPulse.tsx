"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";

class ApiService {
	private static instance: ApiService;
	private posts: Post[] = [];
	private notifications: Notification[] = [];
	private realtimeUpdateCallbacks: (() => void)[] = [];
	private settings = {
		autoPublish: true,
		emailNotifications: true,
		defaultPlatform: "Twitar",
		timezone: "UTC",
	};

	private getRandomLikes(): number {
		return Math.floor(Math.random() * 1000) + 50;
	}

	private getRandomComments(): number {
		return Math.floor(Math.random() * 100) + 5;
	}

	private getRandomShares(): number {
		return Math.floor(Math.random() * 200) + 10;
	}

	private getRandomIncrement(type: "likes" | "comments" | "shares"): number {
		// Fixed: Always return 1 for consistent user interactions
		return 1;
	}

	private constructor() {
		this.posts = [
			{
				id: "1",
				content:
					"Just launched our new productivity dashboard! Revolutionize your workflow with cutting-edge innovation and real-time analytics.",
				scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
				platform: "Twitar",
				status: "scheduled",
				imageUrl:
					"https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg",
				likes: this.getRandomLikes(),
				comments: 2, // Fixed: Match actual postComments length
				shares: this.getRandomShares(),
				liked: false,
				postComments: [
					{
						id: "c1",
						text: "This looks amazing! Already using it and love the features.",
						author: "Sarah Johnson",
						timestamp: new Date(Date.now() - 30 * 60 * 1000),
					},
					{
						id: "c2",
						text: "Finally! This is exactly what we needed.",
						author: "Mike Chen",
						timestamp: new Date(Date.now() - 45 * 60 * 1000),
					},
				],
			},
			{
				id: "2",
				content:
					"Dive deep into the future of digital transformation. Our latest insights reveal game-changing trends shaping tomorrow.",
				scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
				platform: "Linkin",
				status: "draft",
				imageUrl:
					"https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg",
				likes: this.getRandomLikes(),
				comments: 1, // Fixed: Match actual postComments length
				shares: this.getRandomShares(),
				liked: true,
				postComments: [
					{
						id: "c3",
						text: "Great insights! Thanks for sharing.",
						author: "Alex Rodriguez",
						timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
					},
				],
			},
			{
				id: "3",
				content:
					"Behind the scenes of creativity. Where design meets innovation in our studio workspace.",
				scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				platform: "Intagraam",
				status: "scheduled",
				imageUrl:
					"https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg",
				likes: this.getRandomLikes(),
				comments: 2, // Fixed: Match actual postComments length
				shares: this.getRandomShares(),
				liked: false,
				postComments: [
					{
						id: "c4",
						text: "😍 Love the aesthetic!",
						author: "Emma Davis",
						timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
					},
					{
						id: "c5",
						text: "Such an inspiring workspace!",
						author: "David Wilson",
						timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
					},
				],
			},
			{
				id: "4",
				content:
					"Community spotlight! Amazing success stories from our incredible users worldwide.",
				scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
				platform: "facelook",
				status: "published",
				imageUrl:
					"https://images.pexels.com/photos/325521/pexels-photo-325521.jpeg",
				likes: this.getRandomLikes(),
				comments: 2, // Fixed: Match actual postComments length
				shares: this.getRandomShares(),
				liked: true,
				postComments: [
					{
						id: "c6",
						text: "Proud to be part of this community!",
						author: "Lisa Thompson",
						timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
					},
					{
						id: "c7",
						text: "Amazing stories, keep them coming!",
						author: "James Brown",
						timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
					},
				],
			},
		];

		this.startRealtimeUpdates();

		setTimeout(() => {
			this.checkScheduledPosts();
		}, 1000);

		this.notifications = [
			{
				id: "1",
				message:
					"Your post about the new productivity dashboard is scheduled to publish in 2 hours",
				type: "info",
				timestamp: new Date(),
			},
			{
				id: "2",
				message: "Post published successfully on Twitar",
				type: "success",
				timestamp: new Date(Date.now() - 30 * 60 * 1000),
			},
			{
				id: "3",
				message: "New comment on your LinkIn post",
				type: "info",
				timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
			},
			{
				id: "4",
				message: "Reminder: 3 posts scheduled for tomorrow",
				type: "warning",
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
			},
		];
	}

	static getInstance(): ApiService {
		if (!ApiService.instance) {
			ApiService.instance = new ApiService();
		}
		return ApiService.instance;
	}

	async getPosts(): Promise<Post[]> {
		await this.simulateDelay();
		return [...this.posts];
	}

	async createPost(post: Omit<Post, "id">): Promise<Post> {
		await this.simulateDelay();
		const newPost = {
			...post,
			id: Math.random().toString(36).substring(7),
			likes: 0,
			comments: 0,
			shares: 0,
			liked: false,
			postComments: [],
		};

		const existingPost = this.posts.find(
			(p) =>
				p.content === post.content &&
				p.platform === post.platform &&
				p.scheduledFor.getTime() === post.scheduledFor.getTime()
		);

		if (existingPost) {
			return existingPost;
		}

		this.posts.push(newPost);
		return newPost;
	}

	async updatePost(postId: string, updates: Partial<Post>): Promise<Post> {
		await this.simulateDelay();
		const index = this.posts.findIndex((p) => p.id === postId);
		if (index === -1) throw new Error("Post not found");

		this.posts[index] = { ...this.posts[index], ...updates };
		return this.posts[index];
	}

	async deletePost(postId: string): Promise<void> {
		await this.simulateDelay();
		const index = this.posts.findIndex((p) => p.id === postId);
		if (index === -1) throw new Error("Post not found");
		this.posts.splice(index, 1);
	}

	async likePost(postId: string): Promise<Post> {
		await this.simulateDelay();
		const post = this.posts.find((p) => p.id === postId);
		if (!post) throw new Error("Post not found");

		post.liked = !post.liked;
		// Fixed: Always increment/decrement by exactly 1
		post.likes = post.liked
			? (post.likes || 0) + 1
			: Math.max((post.likes || 1) - 1, 0);
		return post;
	}

	async addComment(
		postId: string,
		comment: Omit<Comment, "id">
	): Promise<Comment> {
		await this.simulateDelay();
		const post = this.posts.find((p) => p.id === postId);
		if (!post) throw new Error("Post not found");

		const newComment = {
			...comment,
			id: Math.random().toString(36).substring(7),
		};

		const commentExists = post.postComments?.some(
			(c) =>
				c.text === comment.text &&
				c.author === comment.author &&
				Math.abs(c.timestamp.getTime() - comment.timestamp.getTime()) < 1000
		);

		if (!commentExists) {
			post.postComments = [...(post.postComments || []), newComment];
			// Fixed: Always increment by exactly 1
			post.comments = (post.comments || 0) + 1;
		}

		return newComment;
	}

	async sharePost(postId: string): Promise<Post> {
		await this.simulateDelay();
		const post = this.posts.find((p) => p.id === postId);
		if (!post) throw new Error("Post not found");

		// Fixed: Always increment by exactly 1
		post.shares = (post.shares || 0) + 1;
		return post;
	}

	async getNotifications(): Promise<Notification[]> {
		await this.simulateDelay();
		return this.notifications;
	}

	async addNotification(
		notification: Omit<Notification, "id">
	): Promise<Notification> {
		await this.simulateDelay();
		const newNotification = {
			...notification,
			id: Math.random().toString(36).substring(7),
		};
		this.notifications.unshift(newNotification);
		return newNotification;
	}

	async clearNotifications(): Promise<void> {
		await this.simulateDelay();
		this.notifications = [];
	}

	async getSettings(): Promise<typeof this.settings> {
		await this.simulateDelay();
		return this.settings;
	}

	async updateSettings(
		updates: Partial<typeof this.settings>
	): Promise<typeof this.settings> {
		await this.simulateDelay();
		this.settings = { ...this.settings, ...updates };
		return this.settings;
	}

	private async simulateDelay(
		min: number = 500,
		max: number = 1500
	): Promise<void> {
		const delay = Math.floor(Math.random() * (max - min + 1)) + min;
		await new Promise((resolve) => setTimeout(resolve, delay));
	}

	onRealtimeUpdate(callback: () => void): () => void {
		this.realtimeUpdateCallbacks.push(callback);
		return () => {
			this.realtimeUpdateCallbacks = this.realtimeUpdateCallbacks.filter(
				(cb) => cb !== callback
			);
		};
	}

	private notifyRealtimeUpdate(): void {
		this.realtimeUpdateCallbacks.forEach((callback) => callback());
	}

	private checkScheduledPosts(): void {
		const now = new Date();
		let hasUpdates = false;

		this.posts.forEach((post) => {
			if (
				post.status === "scheduled" &&
				post.scheduledFor <= now &&
				this.settings.autoPublish
			) {
				post.status = "published";
				hasUpdates = true;

				this.notifications.unshift({
					id: Math.random().toString(36).substring(7),
					message: `Post "${post.content.slice(
						0,
						30
					)}..." has been automatically published`,
					type: "success",
					timestamp: new Date(),
				});
			}

			if (
				post.status === "draft" &&
				post.nextAction &&
				post.scheduledFor <= now
			) {
				if (post.nextAction === "publish") {
					post.status = "published";
					hasUpdates = true;

					this.notifications.unshift({
						id: Math.random().toString(36).substring(7),
						message: `Draft post "${post.content.slice(
							0,
							30
						)}..." has been automatically published`,
						type: "success",
						timestamp: new Date(),
					});
				} else if (post.nextAction === "schedule") {
					post.status = "scheduled";
					hasUpdates = true;

					this.notifications.unshift({
						id: Math.random().toString(36).substring(7),
						message: `Draft post "${post.content.slice(
							0,
							30
						)}..." has been moved to scheduled`,
						type: "info",
						timestamp: new Date(),
					});
				}

				post.nextAction = null;
			}
		});

		if (hasUpdates) {
			this.notifyRealtimeUpdate();
		}
	}

	async checkAndPublishScheduledPosts(): Promise<void> {
		this.checkScheduledPosts();
	}

	private startRealtimeUpdates(): void {
		setInterval(() => {
			this.checkScheduledPosts();
		}, 10000);

		// Fixed: Removed automatic engagement increments that were causing numbers to change randomly
		// Only keep the scheduled post publishing functionality above
	}
}

const api = ApiService.getInstance();

const TypographyStyles = () => (
	<style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    :root {
      --font-display: 'Manrope', system-ui, -apple-system, sans-serif;
      --font-heading: 'Manrope', system-ui, -apple-system, sans-serif;
      --font-body: 'Manrope', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient 8s ease infinite;
    }
    
    .font-display { font-family: var(--font-display); }
    .font-heading { font-family: var(--font-heading); }
    .font-body { font-family: var(--font-body); }
    .font-mono { font-family: var(--font-mono); }
    
    .text-display { font-size: clamp(3rem, 8vw, 6rem); line-height: 0.9; letter-spacing: -0.02em; }
    .text-hero { font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1.1; letter-spacing: -0.015em; }
    .text-title { font-size: clamp(1.5rem, 4vw, 2.5rem); line-height: 1.2; letter-spacing: -0.01em; }
    .text-subtitle { font-size: clamp(1.125rem, 2.5vw, 1.5rem); line-height: 1.3; }
    .text-body-lg { font-size: 1.125rem; line-height: 1.6; }
    .text-body { font-size: 1rem; line-height: 1.5; }
    .text-body-sm { font-size: 0.875rem; line-height: 1.4; }
    .text-caption { font-size: 0.75rem; line-height: 1.3; letter-spacing: 0.025em; }
    
    .font-light { font-weight: 300; }
    .font-normal { font-weight: 400; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .font-extrabold { font-weight: 800; }
    
    /* Calendar Input Dark Mode Styles */
    [data-dark-mode="true"] input[type="datetime-local"] {
      color: white !important;
    }
    
    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      filter: invert(1) brightness(200%) !important;
    }

    /* Override any browser default styles */
    input[type="datetime-local"]::-webkit-inner-spin-button,
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      position: absolute;
      right: 8px;
      cursor: pointer;
    }

    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
      color: white !important;
    }

    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit {
      color: white !important;
    }

    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit-text {
      color: white !important;
    }

    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit-month-field,
    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit-day-field,
    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit-year-field,
    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit-hour-field,
    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit-minute-field,
    [data-dark-mode="true"] input[type="datetime-local"]::-webkit-datetime-edit-ampm-field {
      color: white !important;
    }
    
    .datetime-upward {
      position: relative;
      display: flex;
      flex-direction: column-reverse;
      margin-top: 250px;
      margin-bottom: -200px;
    }
    
    .datetime-upward input[type="datetime-local"] {
      order: 2;
      z-index: 1000;
      direction: ltr;
      text-align: left;
      padding-right: 44px !important;
    }
    
    .datetime-upward::before {
      content: '';
      order: 1;
      height: 250px;
      width: 100%;
      pointer-events: none;
    }
    
    .datetime-upward input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      z-index: 1001;
    }
    
    /* Calendar icon color for dark/light mode - robust selector */
    .dark .datetime-upward input[type="datetime-local"]::-webkit-calendar-picker-indicator,
    .dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      filter: invert(1) brightness(2) !important;
    }
    
    .datetime-upward input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      filter: invert(0) !important;
    }
    
    .datetime-upward input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
    
    @media screen and (max-width: 767px) {
      .datetime-upward {
        margin-top: 150px;
        margin-bottom: -100px;
      }
      
      .datetime-upward input[type="datetime-local"] {
        font-size: 16px !important;
      }
    }
  `}</style>
);

interface Post {
	id: string;
	content: string;
	scheduledFor: Date;
	platform: "Twitar" | "Intagraam" | "Linkin" | "facelook";
	status: "draft" | "scheduled" | "published" | "failed";
	imageUrl?: string;
	likes?: number;
	comments?: number;
	shares?: number;
	liked?: boolean;
	postComments?: Comment[];
	nextAction?: "publish" | "schedule" | null;
}

interface Comment {
	id: string;
	text: string;
	author: string;
	timestamp: Date;
}

interface Toast {
	id: string;
	type: "success" | "error" | "warning" | "info";
	message: string;
}

interface NewsletterToast {
	id: string;
	type: "success" | "error";
	message: string;
}

interface Notification {
	id: string;
	message: string;
	type: "info" | "warning" | "success";
	timestamp: Date;
}

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({
	onComplete,
}) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(timer);
					setTimeout(onComplete, 500);
					return 100;
				}
				return prev + Math.random() * 3 + 1;
			});
		}, 50);

		return () => clearInterval(timer);
	}, [onComplete]);

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
			<div className="text-center">
				<div className="relative mb-8">
					<div className="relative">
						<div className="absolute -inset-4 bg-gradient-to-r from-teal-400/10 via-cyan-400/10 to-blue-400/10 rounded-2xl blur-xl animate-pulse"></div>
						<div
							className="absolute -inset-8 bg-gradient-to-r from-teal-400/5 via-cyan-400/5 to-blue-400/5 rounded-3xl blur-2xl animate-pulse"
							style={{ animationDelay: "0.5s" }}
						></div>

						<h1 className="text-6xl font-bold relative">
							<span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
								Social
							</span>
							<span
								className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-gradient"
								style={{ animationDelay: "0.5s" }}
							>
								Flow
							</span>
						</h1>

						<div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-400/0 via-cyan-400/50 to-teal-400/0 rounded-full"></div>
						<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-teal-400/0 via-cyan-400/30 to-teal-400/0 rounded-full"></div>
					</div>
				</div>

				<div className="w-64 h-2 bg-gray-700/50 rounded-full overflow-hidden mb-4">
					<div
						className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full transition-all duration-300"
						style={{ width: `${progress}%` }}
					></div>
				</div>
			</div>
		</div>
	);
};

const FloatingParticles: React.FC = () => (
	<div className="fixed inset-0 overflow-hidden pointer-events-none">
		{[...Array(6)].map((_, i) => (
			<div
				key={i}
				className="absolute w-1 h-1 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full animate-pulse"
				style={{
					left: `${Math.random() * 100}%`,
					top: `${Math.random() * 100}%`,
					animationDelay: `${Math.random() * 4}s`,
					animationDuration: `${4 + Math.random() * 3}s`,
				}}
			/>
		))}
	</div>
);

const NetworkStatus: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
	const [isOnline, setIsOnline] = useState(true);
	const [showStatus, setShowStatus] = useState(false);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			setShowStatus(true);
			setTimeout(() => setShowStatus(false), 3000);
		};

		const handleOffline = () => {
			setIsOnline(false);
			setShowStatus(true);
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	if (!showStatus) return null;

	return (
		<div
			className={`fixed bottom-4 left-4 z-50 flex items-center p-3 rounded-xl shadow-lg backdrop-blur-xl border transition-all duration-500 transform ${
				isOnline
					? `${
							darkMode
								? "bg-emerald-600/30 text-emerald-100 border-emerald-400/40"
								: "bg-emerald-50 text-emerald-700 border-emerald-200"
					  }`
					: `${
							darkMode
								? "bg-red-600/30 text-red-100 border-red-400/40"
								: "bg-red-50 text-red-700 border-red-200"
					  }`
			}`}
		>
			{isOnline ? (
				<WifiIcon className="w-5 h-5 mr-2" />
			) : (
				<WifiOffIcon className="w-5 h-5 mr-2" />
			)}
			<span className="font-body text-body-sm font-medium">
				{isOnline ? "Back Online" : "Connection Lost"}
			</span>
		</div>
	);
};

const SearchDropdown: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	darkMode: boolean;
	posts: Post[];
	onPostSelect: (post: Post) => void;
}> = ({ isOpen, onClose, darkMode, posts, onPostSelect }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	const filteredPosts = posts.filter(
		(post) =>
			post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.status.toLowerCase().includes(searchTerm.toLowerCase())
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			ref={dropdownRef}
			className={`fixed sm:absolute top-16 sm:top-full right-0 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 ${
				darkMode
					? "bg-gray-800/95 border-gray-600/50"
					: "bg-white/95 border-slate-200/50"
			} backdrop-blur-xl rounded-2xl border shadow-2xl z-[60] max-h-[calc(100vh-8rem)] overflow-hidden`}
		>
			<div className="p-4 sm:p-6">
				<div className="flex items-center justify-between mb-4">
					<h3
						className={`font-heading text-body-lg font-semibold ${
							darkMode ? "text-white" : "text-slate-800"
						}`}
					>
						Search Posts
					</h3>
					<button
						onClick={onClose}
						className={`p-1 cursor-pointer ${
							darkMode
								? "hover:bg-gray-700/50 text-gray-400 hover:text-white"
								: "hover:bg-black/10 text-slate-600"
						} rounded-full transition-colors`}
					>
						<XIcon className="w-4 h-4" />
					</button>
				</div>

				<div className="mb-4">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search by content, platform, or status..."
						className={`w-full p-3 font-body text-body ${
							darkMode
								? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-300"
								: "bg-white/70 border-slate-300 text-slate-800 placeholder-slate-500"
						} border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
						autoFocus
					/>
				</div>

				<div className="max-h-[calc(100vh-16rem)] overflow-y-auto space-y-3">
					{filteredPosts.map((post) => (
						<div
							key={post.id}
							onClick={() => {
								onPostSelect(post);
								onClose();
							}}
							className={`p-3 ${
								darkMode
									? "bg-gray-700/30 hover:bg-gray-600/40 border-gray-600/30"
									: "bg-slate-50/50 hover:bg-slate-100/50 border-slate-200/30"
							} rounded-xl transition-colors border cursor-pointer group`}
						>
							<div className="flex justify-between items-start mb-2">
								<span
									className={`font-mono text-caption font-medium px-2 py-1 rounded ${
										darkMode
											? "bg-gray-600 text-gray-200"
											: "bg-slate-200 text-slate-700"
									}`}
								>
									{post.platform}
								</span>
								<span
									className={`font-mono text-caption px-2 py-1 rounded ${
										post.status === "published"
											? "bg-green-100 text-green-700"
											: post.status === "scheduled"
											? "bg-yellow-100 text-yellow-700"
											: post.status === "failed"
											? "bg-red-100 text-red-700"
											: "bg-gray-100 text-gray-700"
									}`}
								>
									{post.status}
								</span>
							</div>
							<p
								className={`font-body text-body-sm ${
									darkMode ? "text-gray-200" : "text-slate-700"
								} line-clamp-2 leading-relaxed group-hover:text-teal-500 transition-colors`}
							>
								{post.content}
							</p>
						</div>
					))}
					{filteredPosts.length === 0 && (
						<p
							className={`font-body text-body text-center ${
								darkMode ? "text-gray-300" : "text-slate-500"
							} py-8`}
						>
							{searchTerm
								? "No posts found matching your search."
								: "Start typing to search..."}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

const NotificationsDropdown: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	darkMode: boolean;
	notifications: Notification[];
	onClearAll: () => void;
}> = ({ isOpen, onClose, darkMode, notifications, onClearAll }) => {
	const [showConfirmClear, setShowConfirmClear] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			ref={dropdownRef}
			className={`fixed sm:absolute top-16 sm:top-full right-0 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 ${
				darkMode
					? "bg-gray-800/95 border-gray-600/50"
					: "bg-white/95 border-slate-200/50"
			} backdrop-blur-xl rounded-2xl border shadow-2xl z-[60] max-h-[calc(100vh-8rem)] overflow-hidden`}
		>
			<div className="p-4 sm:p-6">
				<div className="flex items-center justify-between mb-4">
					<h3
						className={`font-heading text-body-lg font-semibold ${
							darkMode ? "text-white" : "text-slate-800"
						}`}
					>
						Notifications
					</h3>
					<button
						onClick={onClose}
						className={`p-1 cursor-pointer ${
							darkMode
								? "hover:bg-gray-700/50 text-gray-400 hover:text-white"
								: "hover:bg-black/10 text-slate-600"
						} rounded-full transition-colors`}
					>
						<XIcon className="w-4 h-4" />
					</button>
				</div>

				{notifications.length > 0 && (
					<div className="flex justify-end mb-4">
						{!showConfirmClear ? (
							<button
								onClick={() => setShowConfirmClear(true)}
								className={`font-body text-body-sm cursor-pointer ${
									darkMode
										? "text-gray-300 hover:text-white"
										: "text-slate-500 hover:text-slate-600"
								} transition-colors`}
							>
								Clear All
							</button>
						) : (
							<div className="flex space-x-2">
								<button
									onClick={() => setShowConfirmClear(false)}
									className={`font-body text-body-sm cursor-pointer ${
										darkMode
											? "text-gray-300 hover:text-white"
											: "text-slate-500 hover:text-slate-600"
									} transition-colors`}
								>
									Cancel
								</button>
								<button
									onClick={() => {
										onClearAll();
										setShowConfirmClear(false);
									}}
									className="font-body text-body-sm cursor-pointer text-red-400 hover:text-red-300 transition-colors"
								>
									Confirm
								</button>
							</div>
						)}
					</div>
				)}

				<div className="max-h-[calc(100vh-16rem)] overflow-y-auto space-y-3">
					{notifications.map((notification) => (
						<div
							key={notification.id}
							className={`p-3 ${
								darkMode
									? "bg-gray-700/30 border-gray-600/30"
									: "bg-slate-50/50 border-slate-200/30"
							} rounded-xl border`}
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p
										className={`font-body text-body-sm ${
											darkMode ? "text-gray-200" : "text-slate-700"
										} mb-1 leading-relaxed`}
									>
										{notification.message}
									</p>
									<p
										className={`font-mono text-caption ${
											darkMode ? "text-gray-300" : "text-slate-500"
										}`}
									>
										{notification.timestamp.toLocaleTimeString()}
									</p>
								</div>
								<div
									className={`w-2 h-2 rounded-full ml-3 mt-1 ${
										notification.type === "success"
											? "bg-green-400"
											: notification.type === "warning"
											? "bg-yellow-400"
											: "bg-blue-400"
									}`}
								></div>
							</div>
						</div>
					))}
					{notifications.length === 0 && (
						<p
							className={`font-body text-body text-center ${
								darkMode ? "text-gray-300" : "text-slate-500"
							} py-8`}
						>
							No new notifications.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<line x1="5" y1="12" x2="19" y2="12" />
		<polyline points="12,5 19,12 12,19" />
	</svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
		<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
	</svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
		<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
	</svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
		<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
	</svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
		<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
	</svg>
);

const Header: React.FC<{
	darkMode: boolean;
	onSearch: () => void;
	onNotifications: () => void;
	searchOpen: boolean;
	notificationsOpen: boolean;
	notifications: Notification[];
	posts: Post[];
	onPostSelect: (post: Post) => void;
	onClearAllNotifications: () => void;
	onCloseSearch: () => void;
	onCloseNotifications: () => void;
	activeSection: string;
	onNavigate: (section: string) => void;
	mobileSidebarOpen: boolean;
	onToggleMobileSidebar: () => void;
	isVisible: boolean;
}> = ({
	darkMode,
	onSearch,
	onNotifications,
	searchOpen,
	notificationsOpen,
	notifications,
	posts,
	onPostSelect,
	onClearAllNotifications,
	onCloseSearch,
	onCloseNotifications,
	activeSection,
	onNavigate,
	mobileSidebarOpen,
	onToggleMobileSidebar,
	isVisible,
}) => (
	<header
		className={` fixed ${
			darkMode ? "bg-gray-50/95 border-gray-200" : "bg-white/95 border-gray-100"
		} backdrop-blur-xl border-b fixed top-0 left-0 right-0 z-40 shadow-sm transition-all duration-300 ease-in-out ${
			isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
		}`}
	>
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between h-16">
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-3">
						<span className="flex items-center">
							<MessageIcon
								className="w-7 h-7 text-teal-600 drop-shadow-sm"
								aria-hidden="true"
							/>
						</span>
						<h1 className="font-display text-xl font-bold text-gray-800">
							DraftPulse
						</h1>
					</div>
				</div>

				<div className="hidden md:flex flex-1 justify-center">
					<nav className="flex items-center space-x-8">
						{[
							{ id: "home", label: "Home" },
							{ id: "about", label: "About Us" },
							{ id: "dashboard", label: "Dashboard" },
						].map((item) => (
							<button
								key={item.id}
								onClick={() => onNavigate(item.id)}
								className={`relative px-4 py-2 font-heading text-sm font-semibold transition-all duration-200 rounded-lg cursor-pointer ${
									activeSection === item.id
										? darkMode
											? "text-teal-600 bg-teal-50/10"
											: "text-teal-600 bg-teal-50"
										: darkMode
										? "text-gray-600 hover:text-teal-600 hover:bg-gray-100/10"
										: "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
								}`}
							>
								{item.label}
								{activeSection === item.id && (
									<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full"></div>
								)}
							</button>
						))}
					</nav>
				</div>

				<div className="flex items-center space-x-3">
					<div className="relative">
						<button
							onClick={onSearch}
							className={`p-2.5 rounded-xl cursor-pointer ${
								darkMode
									? "hover:bg-gray-200/50 text-gray-600 hover:text-gray-800"
									: "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
							} transition-all duration-200 ${
								searchOpen
									? "bg-teal-500/20 text-teal-600 ring-2 ring-teal-500/20"
									: "hover:shadow-sm"
							}`}
							title="Search posts"
						>
							<SearchIcon className="w-5 h-5" />
						</button>
						<SearchDropdown
							isOpen={searchOpen}
							onClose={onCloseSearch}
							darkMode={darkMode}
							posts={posts}
							onPostSelect={onPostSelect}
						/>
					</div>

					<div className="relative">
						<button
							onClick={onNotifications}
							className={`p-2.5 rounded-xl cursor-pointer ${
								darkMode
									? "hover:bg-gray-200/50 text-gray-600 hover:text-gray-800"
									: "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
							} transition-all duration-200 relative ${
								notificationsOpen
									? "bg-teal-500/20 text-teal-600 ring-2 ring-teal-500/20"
									: "hover:shadow-sm"
							}`}
							title="Notifications"
						>
							<BellIcon className="w-5 h-5" />
							{notifications.length > 0 && (
								<span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full ring-2 ring-white animate-pulse">
									{notifications.length > 9 ? "9+" : notifications.length}
								</span>
							)}
						</button>
						<NotificationsDropdown
							isOpen={notificationsOpen}
							onClose={onCloseNotifications}
							darkMode={darkMode}
							notifications={notifications}
							onClearAll={onClearAllNotifications}
						/>
					</div>

					<div className="md:hidden">
						<button
							onClick={onToggleMobileSidebar}
							className={`p-2.5 rounded-xl cursor-pointer ${
								darkMode
									? "hover:bg-gray-200/50 text-gray-600 hover:text-gray-800"
									: "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
							} transition-all duration-200 ${
								mobileSidebarOpen
									? "bg-teal-500/20 text-teal-600 ring-2 ring-teal-500/20"
									: "hover:shadow-sm"
							}`}
							title="Menu"
						>
							<MenuIcon className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>
);

const AboutUsSection: React.FC<{ darkMode: boolean; posts: Post[] }> = ({
	darkMode,
	posts,
}) => {
	const platformStats = React.useMemo(() => {
		const stats = {
			Twitar: { scheduled: 0, total: 0, hasActivity: false },
			Linkin: { scheduled: 0, total: 0, hasActivity: false },
			Intagraam: { scheduled: 0, total: 0, hasActivity: false },
			facelook: { scheduled: 0, total: 0, hasActivity: false },
		};

		posts.forEach((post) => {
			const platform = post.platform === "Linkin" ? "Linkin" : post.platform;
			if (stats[platform]) {
				stats[platform].total++;
				if (post.status === "scheduled") {
					stats[platform].scheduled++;
				}
				stats[platform].hasActivity = true;
			}
		});

		return stats;
	}, [posts]);
	return (
		<section
			className={`relative py-6 ${
				darkMode ? "bg-gray-800/30" : "bg-white/50"
			} backdrop-blur-xl`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<p
						className={`font-heading text-sm font-semibold tracking-widest uppercase mb-4 ${
							darkMode ? "text-teal-400" : "text-teal-600"
						}`}
					></p>
					<h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
						One app for all your
						<br />
						<span className="text-teal-600">social media things</span>
					</h2>
					<p
						className={`font-body text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed ${
							darkMode ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Remove all the friction that stands in the way of your social media
						success.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					<div
						className={`relative overflow-hidden rounded-3xl p-8 lg:p-12 ${
							darkMode
								? "bg-gradient-to-br from-teal-900/40 to-teal-800/60 border border-teal-700/30"
								: "bg-gradient-to-br from-teal-600 to-teal-700 border border-teal-500/20"
						} shadow-2xl backdrop-blur-xl`}
					>
						<div className="relative z-10">
							<h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-8">
								Grow engagement
								<br />
								faster
							</h3>

							<div className="relative">
								<div className="flex items-end justify-center space-x-3 h-32 mb-4">
									{[20, 35, 25, 45, 60, 40, 75, 55, 85].map((height, index) => (
										<div
											key={index}
											className="bg-white/30 rounded-t-md transition-all duration-1000 hover:bg-white/50"
											style={{
												height: `${height}%`,
												width: "20px",
												animationDelay: `${index * 0.1}s`,
											}}
										/>
									))}
								</div>
								<div className="text-center">
									<div className="inline-flex items-center text-white/90">
										<ArrowRightIcon className="w-8 h-8 transform rotate-[-45deg] mr-2" />
										<span className="font-display text-2xl font-bold">
											+125%
										</span>
									</div>
									<p className="text-white/70 text-sm mt-1">
										Average engagement boost
									</p>
								</div>
							</div>
						</div>

						<div className="absolute inset-0 opacity-10">
							<div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
							<div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg"></div>
						</div>
					</div>

					<div
						className={`relative overflow-hidden rounded-3xl p-8 lg:p-12 ${
							darkMode
								? "bg-gradient-to-br from-gray-800/60 to-gray-700/80 border border-gray-600/30"
								: "bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200/50"
						} shadow-2xl backdrop-blur-xl`}
					>
						<div className="relative z-10">
							<h3
								className={`font-heading text-2xl lg:text-3xl font-bold mb-8 ${
									darkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Schedule across
								<br />
								all platforms
							</h3>

							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<div>
										<p
											className={`font-heading font-semibold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Twitar
										</p>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											{platformStats.Twitar.scheduled} posts scheduled
										</p>
									</div>
									<div
										className={`px-3 py-1 rounded-full text-xs font-bold ${
											platformStats.Twitar.hasActivity
												? darkMode
													? "bg-emerald-600/20 text-emerald-400"
													: "bg-emerald-500/20 text-emerald-700"
												: darkMode
												? "bg-gray-600/20 text-gray-400"
												: "bg-gray-500/20 text-gray-600"
										}`}
									>
										{platformStats.Twitar.hasActivity ? "Active" : "Inactive"}
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<p
											className={`font-heading font-semibold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											LinkIn
										</p>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											{platformStats.Linkin.scheduled} posts scheduled
										</p>
									</div>
									<div
										className={`px-3 py-1 rounded-full text-xs font-bold ${
											platformStats.Linkin.hasActivity
												? darkMode
													? "bg-emerald-600/20 text-emerald-400"
													: "bg-emerald-500/20 text-emerald-700"
												: darkMode
												? "bg-gray-600/20 text-gray-400"
												: "bg-gray-500/20 text-gray-600"
										}`}
									>
										{platformStats.Linkin.hasActivity ? "Active" : "Inactive"}
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<p
											className={`font-heading font-semibold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Intagraam
										</p>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											{platformStats.Intagraam.scheduled} posts scheduled
										</p>
									</div>
									<div
										className={`px-3 py-1 rounded-full text-xs font-bold ${
											platformStats.Intagraam.hasActivity
												? darkMode
													? "bg-emerald-600/20 text-emerald-400"
													: "bg-emerald-500/20 text-emerald-700"
												: darkMode
												? "bg-gray-600/20 text-gray-400"
												: "bg-gray-500/20 text-gray-600"
										}`}
									>
										{platformStats.Intagraam.hasActivity
											? "Active"
											: "Inactive"}
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<p
											className={`font-heading font-semibold ${
												darkMode ? "text-white" : "text-gray-900"
											}`}
										>
											Facelook
										</p>
										<p
											className={`text-sm ${
												darkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											{platformStats.facelook.scheduled} posts scheduled
										</p>
									</div>
									<div
										className={`px-3 py-1 rounded-full text-xs font-bold ${
											platformStats.facelook.hasActivity
												? darkMode
													? "bg-emerald-600/20 text-emerald-400"
													: "bg-emerald-500/20 text-emerald-700"
												: darkMode
												? "bg-gray-600/20 text-gray-400"
												: "bg-gray-500/20 text-gray-600"
										}`}
									>
										{platformStats.facelook.hasActivity ? "Active" : "Inactive"}
									</div>
								</div>

								<div className="flex items-center justify-center pt-4">
									<div
										className={`relative w-16 h-16 rounded-full border-2 ${
											darkMode ? "border-gray-600" : "border-gray-400"
										} flex items-center justify-center`}
									>
										<div className="absolute inset-0 rounded-full border-2 border-teal-500 border-dashed animate-spin opacity-60"></div>
										<div
											className={`w-8 h-8 rounded-full ${
												darkMode ? "bg-gray-700" : "bg-gray-300"
											} flex items-center justify-center`}
										>
											<SparklesIcon className="w-4 h-4 text-teal-500" />
										</div>
									</div>
								</div>
								<p
									className={`text-center text-sm font-medium ${
										darkMode ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Synchronized publishing across all platforms
								</p>
							</div>
						</div>

						<div className="absolute inset-0 opacity-5">
							<div className="absolute top-6 right-6 w-40 h-40 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-2xl"></div>
							<div className="absolute bottom-6 left-6 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl"></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

const HeroSection: React.FC<{
	onCreatePost: () => void;
}> = ({ onCreatePost }) => {
	return (
		<section className="relative min-h-[90vh] bg-white overflow-hidden">
			<div className="absolute inset-0">
				<div className="absolute top-20 left-10 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl"></div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-20">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center min-h-[70vh]">
					<div className="order-1">
						<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
							Schedule Your
							<br />
							<span className="text-teal-600">Social Presence.</span>
						</h1>

						<p className="font-body text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-lg">
							Streamline your social media workflow with intelligent scheduling,
							real-time interaction tracking, and seamless multi-platform
							management. Experience responsive design that adapts perfectly to
							your mobile and desktop needs.
						</p>

						<button
							onClick={onCreatePost}
							className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-teal-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg hover:bg-teal-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
						>
							Get Started
							<ArrowRightIcon className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
						</button>
					</div>

					<div className="order-2">
						<div className="relative">
							<img
								src="https://images.pexels.com/photos/29583312/pexels-photo-29583312.jpeg?_gl=1*1shzrvn*_ga*MTc4MzI0Mjg2MS4xNzUwOTI1MjM1*_ga_8JE65Q40S6*czE3NTExOTA1OTMkbzMkZzEkdDE3NTExOTA4NDYkajckbDAkaDA."
								alt="Team collaboration workspace"
								className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
								loading="lazy"
							/>

							<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl sm:rounded-2xl pointer-events-none"></div>

							<div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-500/20 rounded-full blur-xl"></div>
							<div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

const LikeAnimation: React.FC<{ show: boolean; darkMode?: boolean }> = ({
	show,
}) => {
	if (!show) return null;

	return (
		<div className="absolute inset-0 pointer-events-none flex items-center justify-center">
			<div className="animate-ping">
				<HeartIcon className="w-8 h-8 text-red-400 fill-red-400" />
			</div>
			<div className="absolute animate-bounce">
				<span className="text-red-400 text-sm font-bold">+1</span>
			</div>
		</div>
	);
};

const CommentsModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	darkMode: boolean;
	post: Post | null;
	onAddComment: (postId: string, comment: string) => void;
}> = ({ isOpen, onClose, darkMode, post, onAddComment }) => {
	const [newComment, setNewComment] = useState("");
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen || !post) return null;

	const handleSubmitComment = () => {
		if (newComment.trim()) {
			onAddComment(post.id, newComment.trim());
			setNewComment("");
		}
	};

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div
				ref={modalRef}
				className={`${
					darkMode
						? "bg-gray-800/95 border-gray-600/30"
						: "bg-white/90 border-white/30"
				} backdrop-blur-xl rounded-3xl p-4 sm:p-6 w-[calc(100%-2rem)] sm:w-full max-w-2xl mx-4 sm:mx-auto border shadow-2xl flex flex-col max-h-[90vh] animate-slideIn`}
			>
				<div className="flex justify-between items-center mb-4">
					<h3
						className={`text-xl sm:text-2xl font-bold ${
							darkMode ? "text-white" : "text-slate-800"
						}`}
					>
						Comments
					</h3>
					<button
						onClick={onClose}
						className={`p-2 cursor-pointer ${
							darkMode
								? "hover:bg-white/10 text-white"
								: "hover:bg-black/10 text-slate-800"
						} rounded-full transition-colors`}
					>
						<XIcon className="w-5 h-5" />
					</button>
				</div>

				<div
					className={`${
						darkMode
							? "bg-gray-700/40 border-gray-600/40"
							: "bg-slate-50/50 border-slate-200/30"
					} rounded-xl p-3 sm:p-4 border mb-4`}
				>
					<div className="flex items-center mb-2">
						<div
							className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
								post.platform === "Twitar"
									? "from-sky-500 to-blue-600"
									: post.platform === "Intagraam"
									? "from-purple-500 to-pink-600"
									: post.platform === "Linkin"
									? "from-blue-600 to-indigo-700"
									: "from-blue-600 to-purple-700"
							}`}
						>
							{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
						</div>
					</div>
					<p
						className={`${
							darkMode ? "text-gray-200" : "text-slate-700"
						} text-sm break-words whitespace-pre-wrap`}
					>
						{post.content}
					</p>
				</div>

				<div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-0">
					{post.postComments && post.postComments.length > 0 ? (
						post.postComments.map((comment) => (
							<div
								key={comment.id}
								className={`${
									darkMode
										? "bg-gray-700/30 border-gray-600/30"
										: "bg-slate-50/80 border-slate-200/50"
								} rounded-xl p-3 sm:p-4 border`}
							>
								<div className="flex justify-between items-start mb-2">
									<span
										className={`font-semibold text-sm ${
											darkMode ? "text-teal-400" : "text-teal-600"
										}`}
									>
										{comment.author}
									</span>
									<span
										className={`text-xs ${
											darkMode ? "text-gray-300" : "text-slate-500"
										}`}
									>
										{comment.timestamp.toLocaleTimeString()}
									</span>
								</div>
								<p
									className={`${
										darkMode ? "text-gray-200" : "text-slate-700"
									} text-sm leading-relaxed break-words whitespace-pre-wrap overflow-hidden`}
								>
									{comment.text}
								</p>
							</div>
						))
					) : (
						<p
							className={`text-center ${
								darkMode ? "text-gray-300" : "text-slate-500"
							} py-8`}
						>
							No comments yet. Be the first to comment!
						</p>
					)}
				</div>

				<div className="flex gap-2">
					<textarea
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Write a comment..."
						className={`flex-1 p-2 sm:p-3 rounded-xl border resize-none min-h-[80px] max-h-[200px] ${
							darkMode
								? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-teal-500/50"
								: "bg-white/50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-teal-500"
						} focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all`}
					/>
					<button
						onClick={handleSubmitComment}
						disabled={!newComment.trim()}
						className={`px-4 py-2 rounded-xl ${
							newComment.trim()
								? "bg-teal-500 text-white hover:bg-teal-600 cursor-pointer"
								: darkMode
								? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
								: "bg-slate-100 text-slate-400 cursor-not-allowed"
						} transition-colors`}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

const PreviewModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	darkMode: boolean;
	post: Post | null;
}> = ({ isOpen, onClose, darkMode, post }) => {
	if (!isOpen || !post) return null;

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div
				className={`${
					darkMode
						? "bg-gray-800/95 border-gray-600/30"
						: "bg-white/90 border-white/30"
				} backdrop-blur-xl rounded-3xl p-6 sm:p-8 w-[calc(100%-2rem)] sm:w-full max-w-lg mx-4 sm:mx-auto border shadow-2xl flex flex-col`}
				style={{ minHeight: 0 }}
			>
				<div className="flex justify-between items-center mb-6">
					<h3
						className={`text-xl sm:text-2xl font-bold ${
							darkMode ? "text-white" : "text-slate-800"
						}`}
					>
						Post Preview
					</h3>
					<button
						onClick={onClose}
						className={`p-2 cursor-pointer ${
							darkMode
								? "hover:bg-white/10 text-white"
								: "hover:bg-black/10 text-slate-800"
						} rounded-full transition-colors`}
					>
						<XIcon className="w-6 h-6" />
					</button>
				</div>
				<div
					className={`${
						darkMode ? "bg-slate-700/30" : "bg-slate-50/50"
					} rounded-xl p-6 border ${
						darkMode ? "border-slate-600/30" : "border-slate-200/30"
					} overflow-y-auto`}
					style={{ maxHeight: "60vh" }}
				>
					<div className="flex items-center mb-4">
						<div
							className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
								post.platform === "Twitar"
									? "from-sky-500 to-blue-600"
									: post.platform === "Intagraam"
									? "from-purple-500 to-pink-600"
									: post.platform === "Linkin"
									? "from-blue-600 to-indigo-700"
									: "from-blue-600 to-purple-700"
							}`}
						>
							{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
						</div>
					</div>
					{post.imageUrl && (
						<div className="mb-4 rounded-xl overflow-hidden">
							<SafeImage
								src={post.imageUrl}
								alt="Post preview"
								className="w-full h-48 object-cover"
								fallbackClassName="w-full h-48"
								darkMode={darkMode}
							/>
						</div>
					)}
					<p
						className={`${
							darkMode ? "text-slate-200" : "text-slate-700"
						} mb-4 leading-relaxed break-words whitespace-pre-wrap`}
					>
						{post.content}
					</p>
					{post.status === "published" && (
						<div
							className={`flex items-center justify-between text-sm ${
								darkMode ? "text-slate-400" : "text-slate-500"
							}`}
						>
							<div className="flex items-center space-x-4">
								<div className="flex items-center">
									<HeartIcon className="w-4 h-4 mr-1 text-red-400" />
									<span>{post.likes}</span>
								</div>
								<div className="flex items-center">
									<MessageIcon className="w-4 h-4 mr-1 text-blue-400" />
									<span>{post.comments}</span>
								</div>
								<div className="flex items-center">
									<ShareIcon className="w-4 h-4 mr-1 text-green-400" />
									<span>{post.shares}</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

interface SettingsType {
	autoPublish: boolean;
	emailNotifications: boolean;
	defaultPlatform: string;
	timezone: string;
}

const SettingsModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	darkMode: boolean;
	settings: SettingsType;
	onUpdateSettings: (settings: Partial<SettingsType>) => void;
}> = ({ isOpen, onClose, darkMode, settings, onUpdateSettings }) => {
	const [localSettings, setLocalSettings] = useState(settings);

	const handleSave = () => {
		onUpdateSettings(localSettings);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div
				className={`${
					darkMode ? "bg-slate-800/90" : "bg-white/90"
				} backdrop-blur-xl rounded-3xl p-6 sm:p-8 w-[calc(100%-2rem)] sm:w-full max-w-2xl mx-4 sm:mx-auto border ${
					darkMode ? "border-slate-700/30" : "border-white/30"
				} shadow-2xl`}
			>
				<div className="flex justify-between items-center mb-6">
					<h3
						className={`text-xl sm:text-2xl font-bold ${
							darkMode ? "text-white" : "text-slate-800"
						}`}
					>
						Settings
					</h3>
					<button
						onClick={onClose}
						className={`p-2 cursor-pointer ${
							darkMode
								? "hover:bg-white/10 text-white"
								: "hover:bg-black/10 text-slate-800"
						} rounded-full transition-colors`}
					>
						<XIcon className="w-6 h-6" />
					</button>
				</div>

				<div className="space-y-6">
					<div>
						<label
							className={`block text-sm font-semibold ${
								darkMode ? "text-slate-300" : "text-slate-700"
							} mb-3`}
						>
							Auto-publish posts
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={localSettings.autoPublish}
								onChange={(e) =>
									setLocalSettings((prev: SettingsType) => ({
										...prev,
										autoPublish: e.target.checked,
									}))
								}
								className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
							/>
							<span
								className={`ml-2 text-sm ${
									darkMode ? "text-slate-300" : "text-slate-600"
								}`}
							>
								Automatically publish scheduled posts
							</span>
						</label>
					</div>

					<div>
						<label
							className={`block text-sm font-semibold ${
								darkMode ? "text-slate-300" : "text-slate-700"
							} mb-3`}
						>
							Email notifications
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={localSettings.emailNotifications}
								onChange={(e) =>
									setLocalSettings((prev: SettingsType) => ({
										...prev,
										emailNotifications: e.target.checked,
									}))
								}
								className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
							/>
							<span
								className={`ml-2 text-sm ${
									darkMode ? "text-slate-300" : "text-slate-600"
								}`}
							>
								Receive email notifications for important updates
							</span>
						</label>
					</div>

					<div>
						<label
							className={`block text-sm font-semibold ${
								darkMode ? "text-slate-300" : "text-slate-700"
							} mb-3`}
						>
							Default Platform
						</label>
						<select
							value={localSettings.defaultPlatform}
							onChange={(e) =>
								setLocalSettings((prev: SettingsType) => ({
									...prev,
									defaultPlatform: e.target.value,
								}))
							}
							className={`w-full p-3 ${
								darkMode
									? "bg-slate-700/50 border-slate-600 text-white"
									: "bg-white/70 border-slate-300 text-slate-800"
							} border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
						>
							<option value="Twitar">Twitar</option>
							<option value="Intagraam">Intagraam</option>
							<option value="Linkin">LinkIn</option>
							<option value="facelook">Facelook</option>
						</select>
					</div>

					<div>
						<label
							className={`block text-sm font-semibold ${
								darkMode ? "text-slate-300" : "text-slate-700"
							} mb-3`}
						>
							Time Zone
						</label>
						<select
							value={localSettings.timezone}
							onChange={(e) =>
								setLocalSettings((prev: SettingsType) => ({
									...prev,
									timezone: e.target.value,
								}))
							}
							className={`w-full p-3 ${
								darkMode
									? "bg-slate-700/50 border-slate-600 text-white"
									: "bg-white/70 border-slate-300 text-slate-800"
							} border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
						>
							<option value="UTC">UTC</option>
							<option value="America/New_York">Eastern Time</option>
							<option value="America/Chicago">Central Time</option>
							<option value="America/Denver">Mountain Time</option>
							<option value="America/Los_Angeles">Pacific Time</option>
						</select>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
					<button
						onClick={onClose}
						className={`px-6 py-3 cursor-pointer ${
							darkMode
								? "text-slate-300 hover:bg-slate-700/50"
								: "text-slate-600 hover:bg-slate-100/50"
						} rounded-xl transition-colors order-2 sm:order-1`}
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold order-1 sm:order-2 cursor-pointer"
					>
						Save Settings
					</button>
				</div>
			</div>
		</div>
	);
};

const Footer: React.FC<{
	darkMode: boolean;
	newsletterEmail: string;
	onNewsletterEmailChange: (email: string) => void;
	onNewsletterSubmit: () => void;
	isSubscribing: boolean;
}> = ({
	darkMode,
	newsletterEmail,
	onNewsletterEmailChange,
	onNewsletterSubmit,
	isSubscribing,
}) => (
	<footer className="relative bg-teal-600 backdrop-blur-xl border-t border-teal-500/30 mt-20">
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			<div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
			<div className="absolute bottom-0 right-1/4 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl"></div>
			<div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-600 to-teal-700"></div>
		</div>

		<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{/* Brand Section */}
				<div className="col-span-1 text-center md:text-left">
					<h3 className="text-2xl md:text-xl font-semibold text-teal-50 mb-4">
						DraftPulse
					</h3>
					<p className="text-base md:text-sm text-teal-50/70 leading-relaxed px-6 md:px-0">
						Streamline your social media presence with our intuitive scheduling
						platform. Create, plan, and automate your content strategy.
					</p>
				</div>

				{/* Features Section */}
				<div className="col-span-1 text-center md:text-left">
					<h3 className="text-2xl md:text-xl font-semibold text-teal-50 mb-4">
						Key Features
					</h3>
					<ul className="space-y-3 md:space-y-2 text-base md:text-sm text-teal-50/70">
						<li className="flex items-center justify-center md:justify-start">
							<span className="mr-2">•</span>
							Smart Content Scheduling
						</li>
						<li className="flex items-center justify-center md:justify-start">
							<span className="mr-2">•</span>
							Multi-Platform Support
						</li>
						<li className="flex items-center justify-center md:justify-start">
							<span className="mr-2">•</span>
							Analytics Dashboard
						</li>
						<li className="flex items-center justify-center md:justify-start">
							<span className="mr-2">•</span>
							Team Collaboration
						</li>
					</ul>
				</div>

				{/* Newsletter Section */}
				<div className="col-span-1 flex flex-col items-center md:items-end">
					<div className="w-full max-w-xs">
						<h3 className="text-2xl md:text-xl font-semibold text-teal-50 mb-4 text-center md:text-right">
							Stay Updated
						</h3>
						<div className="relative w-full md:w-auto flex justify-center md:justify-end">
							<input
								type="email"
								placeholder="Enter your email"
								value={newsletterEmail}
								onChange={(e) => onNewsletterEmailChange(e.target.value)}
								className={`w-64 md:w-48 py-2 md:py-1.5 px-4 md:px-2 text-sm md:text-xs rounded-lg ${
									darkMode
										? "bg-gray-800 text-gray-200 placeholder-gray-400"
										: "bg-white text-gray-900 placeholder-gray-500"
								} focus:outline-none focus:ring-2 focus:ring-teal-500`}
							/>
							<button
								onClick={onNewsletterSubmit}
								disabled={isSubscribing}
								className="absolute right-8 md:right-2 top-1/2 -translate-y-1/2 cursor-pointer disabled:cursor-not-allowed"
							>
								{isSubscribing ? (
									<div className="animate-spin w-4 md:w-3 h-4 md:h-3 border-2 border-teal-500 border-t-transparent rounded-full" />
								) : (
									<SendIcon className="w-4 md:w-3 h-4 md:h-3 text-teal-500" />
								)}
							</button>
						</div>
						<p className="mt-3 md:mt-2 text-sm md:text-[10px] text-teal-50/50 text-center md:text-right">
							Join our newsletter for the latest updates and tips
						</p>
					</div>
				</div>
			</div>
		</div>
	</footer>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<rect x="3" y="4" width="18" height="18" rx="2" />
		<line x1="16" y1="2" x2="16" y2="6" />
		<line x1="8" y1="2" x2="8" y2="6" />
		<line x1="3" y1="10" x2="21" y2="10" />
	</svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="12" cy="12" r="10" />
		<polyline points="12 6 12 12 16 14" />
	</svg>
);
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<line x1="22" y1="2" x2="11" y2="13" />
		<polygon points="22 2 15 22 11 13 2 9 22 2" />
	</svg>
);
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M12 20h9" />
		<path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 2 21l1.5-5L16.5 3.5z" />
	</svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<polyline points="3 6 5 6 21 6" />
		<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
	</svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<line x1="12" y1="5" x2="12" y2="19" />
		<line x1="5" y1="12" x2="19" y2="12" />
	</svg>
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="12" cy="12" r="10" />
		<path d="M9 12l2 2 4-4" />
	</svg>
);
const AlertCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="12" cy="12" r="10" />
		<line x1="12" y1="8" x2="12" y2="12" />
		<line x1="12" y1="16" x2="12.01" y2="16" />
	</svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);
const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M12 2v4m0 12v4m8-8h-4m-8 0H2m15.07-6.93l-2.83 2.83m-8.48 8.48l-2.83 2.83m0-14.14l2.83 2.83m8.48 8.48l2.83 2.83" />
	</svg>
);
const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="18" cy="5" r="3" />
		<circle cx="6" cy="12" r="3" />
		<circle cx="18" cy="19" r="3" />
		<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
		<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
	</svg>
);
const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
	</svg>
);
const MessageIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
	</svg>
);
const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<line x1="12" y1="20" x2="12" y2="10" />
		<line x1="18" y1="20" x2="18" y2="4" />
		<line x1="6" y1="20" x2="6" y2="16" />
	</svg>
);
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
	</svg>
);
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="12" cy="12" r="5" />
		<line x1="12" y1="1" x2="12" y2="3" />
		<line x1="12" y1="21" x2="12" y2="23" />
		<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
		<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
		<line x1="1" y1="12" x2="3" y2="12" />
		<line x1="21" y1="12" x2="23" y2="12" />
		<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
		<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
	</svg>
);
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<line x1="3" y1="12" x2="21" y2="12" />
		<line x1="3" y1="6" x2="21" y2="6" />
		<line x1="3" y1="18" x2="21" y2="18" />
	</svg>
);
const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="12" cy="12" r="3" />
		<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
	</svg>
);
const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
		<path d="M13.73 21a2 2 0 0 1-3.46 0" />
	</svg>
);
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
);
const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<polygon points="5 3 19 12 5 21 5 3" />
	</svg>
);
const WifiIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M5 13a10 10 0 0 1 14 0" />
		<path d="M8.5 16.5a5 5 0 0 1 7 0" />
		<line x1="12" y1="20" x2="12.01" y2="20" />
	</svg>
);
const WifiOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<line x1="1" y1="1" x2="23" y2="23" />
		<path d="M16.72 11.06A10.94 10.94 0 0 0 12 10c-2.28 0-4.41.72-6.14 1.94" />
		<path d="M5 13a10 10 0 0 1 14 0" />
		<path d="M8.5 16.5a5 5 0 0 1 7 0" />
		<line x1="12" y1="20" x2="12.01" y2="20" />
	</svg>
);

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
		<circle cx="8.5" cy="8.5" r="1.5" />
		<polyline points="21,15 16,10 5,21" />
	</svg>
);

const SafeImage: React.FC<{
	src?: string;
	alt: string;
	className?: string;
	fallbackClassName?: string;
	darkMode?: boolean;
	onError?: () => void;
}> = ({
	src,
	alt,
	className,
	fallbackClassName,
	darkMode = false,
	onError,
}) => {
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const handleError = () => {
		setHasError(true);
		setIsLoading(false);
		onError?.();
	};

	const handleLoad = () => {
		setIsLoading(false);
		setHasError(false);
	};

	if (!src || hasError) {
		return (
			<div
				className={`${
					fallbackClassName || className
				} flex items-center justify-center ${
					darkMode
						? "bg-slate-700/50 text-slate-400"
						: "bg-slate-100 text-slate-500"
				} border-2 border-dashed ${
					darkMode ? "border-slate-600" : "border-slate-300"
				}`}
			>
				<div className="text-center p-4">
					<ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
					<p className="text-sm font-medium opacity-75">
						{hasError ? "Failed to load image" : "No image"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			{isLoading && (
				<div
					className={`absolute inset-0 ${
						fallbackClassName || className
					} flex items-center justify-center ${
						darkMode ? "bg-slate-700/50" : "bg-slate-100"
					}`}
				>
					<div className="w-6 h-6 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></div>
				</div>
			)}
			<img
				src={src}
				alt={alt}
				className={className}
				onError={handleError}
				onLoad={handleLoad}
				style={{ display: isLoading ? "none" : "block" }}
			/>
		</div>
	);
};

const getDaysInMonth = (year: number, month: number) =>
	new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
	new Date(year, month, 1).getDay();
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const CustomTimePicker: React.FC<{
	darkMode: boolean;
	value: number;
	onChange: (value: number) => void;
	max: number;
	label: string;
}> = ({ darkMode, value, onChange, max, label }) => {
	const [isOpen, setIsOpen] = useState(false);
	const pickerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const options = Array.from({ length: max + 1 }, (_, i) => i);

	return (
		<div className="flex flex-col items-center relative" ref={pickerRef}>
			<label className="text-xs mb-0.5 sm:mb-1">{label}</label>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`w-12 sm:w-14 p-1 sm:p-1.5 rounded-lg flex items-center justify-between ${
					darkMode
						? "bg-slate-700/50 border-slate-600 text-white"
						: "bg-white border-slate-300 text-slate-800"
				} border focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs`}
			>
				<span>{value.toString().padStart(2, "0")}</span>
				<svg
					className="w-2.5 h-2.5 sm:w-3 sm:h-3"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
			{isOpen && (
				<div
					className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30"
					onClick={() => setIsOpen(false)}
				>
					<div
						className={`w-20 sm:w-24 max-h-48 sm:max-h-64 overflow-y-auto rounded-lg shadow-lg ${
							darkMode
								? "bg-slate-700/95 border-slate-600"
								: "bg-white border-slate-200"
						} border p-1.5 sm:p-2 flex flex-col items-center animate-slideIn`}
						onClick={(e) => e.stopPropagation()}
					>
						{options.map((option) => (
							<button
								key={option}
								onClick={() => {
									onChange(option);
									setIsOpen(false);
								}}
								className={`w-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-center ${
									value === option
										? "bg-teal-500 text-white"
										: darkMode
										? "hover:bg-gray-600/50 text-white"
										: "hover:bg-slate-100 text-slate-800"
								}`}
							>
								{option.toString().padStart(2, "0")}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const CustomCalendar: React.FC<{
	darkMode: boolean;
	selectedDate: Date;
	onSelect: (date: Date) => void;
	onClose: () => void;
}> = ({ darkMode, selectedDate, onSelect, onClose }) => {
	const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
	const [selectedHour, setSelectedHour] = useState(
		selectedDate ? selectedDate.getHours() : new Date().getHours()
	);
	const [selectedMinute, setSelectedMinute] = useState(
		selectedDate ? selectedDate.getMinutes() : new Date().getMinutes()
	);
	const [view, setView] = useState<"calendar" | "time">("calendar");

	const daysInMonth = getDaysInMonth(
		currentDate.getFullYear(),
		currentDate.getMonth()
	);
	const firstDayOfMonth = getFirstDayOfMonth(
		currentDate.getFullYear(),
		currentDate.getMonth()
	);

	const handleDateSelect = (day: number) => {
		const newDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			day,
			selectedHour,
			selectedMinute
		);
		onSelect(newDate);
		setView("time");
	};

	const handleTimeSelect = () => {
		const newDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate(),
			selectedHour,
			selectedMinute
		);
		onSelect(newDate);
		onClose();
	};

	const prevMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
		);
	};

	const nextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
		);
	};

	return (
		<div
			className={`w-full rounded-xl ${
				darkMode ? "text-white" : "text-slate-800"
			}`}
		>
			{view === "calendar" ? (
				<>
					<div className="flex items-center justify-between mb-2 sm:mb-3">
						<button
							onClick={prevMonth}
							className={`p-0.5 sm:p-1 rounded-lg ${
								darkMode ? "hover:bg-gray-600/50" : "hover:bg-slate-100"
							}`}
						>
							<svg
								className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
						<h3 className="font-semibold text-xs sm:text-sm">
							{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
						</h3>
						<button
							onClick={nextMonth}
							className={`p-0.5 sm:p-1 rounded-lg ${
								darkMode ? "hover:bg-gray-600/50" : "hover:bg-slate-100"
							}`}
						>
							<svg
								className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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

					<div className="grid grid-cols-7 gap-0.5 mb-1">
						{DAYS.map((day) => (
							<div
								key={day}
								className="text-center text-xs font-medium py-0.5 sm:py-1"
							>
								{day}
							</div>
						))}
					</div>

					<div className="grid grid-cols-7 gap-0.5">
						{Array.from({ length: firstDayOfMonth }).map((_, index) => (
							<div key={`empty-${index}`} />
						))}
						{Array.from({ length: daysInMonth }).map((_, index) => {
							const day = index + 1;
							const isSelected =
								currentDate.getFullYear() === selectedDate?.getFullYear() &&
								currentDate.getMonth() === selectedDate?.getMonth() &&
								day === selectedDate?.getDate();

							return (
								<button
									key={day}
									onClick={() => handleDateSelect(day)}
									className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-medium flex items-center justify-center
                    ${
											isSelected
												? "bg-teal-500 text-white"
												: darkMode
												? "hover:bg-gray-600/50"
												: "hover:bg-slate-100"
										}`}
								>
									{day}
								</button>
							);
						})}
					</div>
				</>
			) : (
				<div className="p-2 sm:p-3">
					<div className="flex justify-between items-center mb-3 sm:mb-4">
						<button
							onClick={() => setView("calendar")}
							className={`p-0.5 sm:p-1 rounded-lg ${
								darkMode ? "hover:bg-gray-600/50" : "hover:bg-slate-100"
							}`}
						>
							<svg
								className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
						<h3 className="font-semibold text-xs sm:text-sm">Set Time</h3>
						<div className="w-5 sm:w-6" />
					</div>

					<div className="flex gap-2 sm:gap-3 justify-center mb-3 sm:mb-4">
						<CustomTimePicker
							darkMode={darkMode}
							value={selectedHour}
							onChange={setSelectedHour}
							max={23}
							label="Hour"
						/>
						<CustomTimePicker
							darkMode={darkMode}
							value={selectedMinute}
							onChange={setSelectedMinute}
							max={59}
							label="Minute"
						/>
					</div>

					<button
						onClick={handleTimeSelect}
						className="w-full py-1.5 sm:py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-xs sm:text-sm"
					>
						Confirm
					</button>
				</div>
			)}
		</div>
	);
};

const PostSkeleton: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
	<div
		className={`h-auto min-h-[420px] flex flex-col ${
			darkMode
				? "bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60"
				: "bg-gradient-to-br from-white/95 via-white/90 to-slate-50/95"
		} backdrop-blur-xl rounded-2xl p-5 border ${
			darkMode ? "border-slate-700/30" : "border-white/40"
		} shadow-xl`}
	>
		<div className="flex items-center justify-between mb-3 flex-shrink-0">
			<div
				className={`h-7 w-24 ${
					darkMode
						? "bg-gradient-to-r from-slate-700/50 to-slate-600/30"
						: "bg-gradient-to-r from-slate-200/80 to-slate-300/60"
				} rounded-full animate-pulse shadow-lg`}
			></div>
			<div
				className={`h-7 w-24 ${
					darkMode
						? "bg-gradient-to-r from-slate-700/50 to-slate-600/30"
						: "bg-gradient-to-r from-slate-200/80 to-slate-300/60"
				} rounded-full animate-pulse shadow-lg`}
			></div>
		</div>

		<div className="mb-3 flex-shrink-0">
			<div
				className={`h-40 ${
					darkMode
						? "bg-gradient-to-br from-slate-700/50 to-slate-600/30"
						: "bg-gradient-to-br from-slate-200/70 to-slate-300/50"
				} rounded-xl animate-pulse shadow-md`}
			></div>
		</div>

		<div className="flex-1 flex flex-col">
			<div className="h-[4.2rem] mb-3 flex-shrink-0 space-y-2">
				<div
					className={`h-4 ${
						darkMode
							? "bg-gradient-to-r from-slate-700/40 to-slate-600/20"
							: "bg-gradient-to-r from-slate-200/60 to-slate-300/40"
					} rounded w-3/4 animate-pulse`}
				></div>
				<div
					className={`h-4 ${
						darkMode
							? "bg-gradient-to-r from-slate-700/40 to-slate-600/20"
							: "bg-gradient-to-r from-slate-200/60 to-slate-300/40"
					} rounded w-full animate-pulse`}
				></div>
				<div
					className={`h-4 ${
						darkMode
							? "bg-gradient-to-r from-slate-700/40 to-slate-600/20"
							: "bg-gradient-to-r from-slate-200/60 to-slate-300/40"
					} rounded w-2/3 animate-pulse`}
				></div>
			</div>

			<div
				className={`mb-3 bg-gradient-to-r ${
					darkMode
						? "from-slate-700/50 to-slate-600/30"
						: "from-slate-100/80 to-slate-50/50"
				} rounded-lg px-3 py-2 animate-pulse`}
			>
				<div className="flex items-center">
					<div
						className={`h-3.5 w-3.5 ${
							darkMode ? "bg-slate-600/50" : "bg-slate-300/60"
						} rounded mr-2`}
					></div>
					<div
						className={`h-3 w-32 ${
							darkMode ? "bg-slate-600/50" : "bg-slate-300/60"
						} rounded`}
					></div>
				</div>
			</div>

			<div className="flex-1 min-h-[1rem]"></div>

			<div className="flex items-center justify-between mt-auto pt-3 border-t border-opacity-20 border-gray-400">
				<div
					className={`bg-gradient-to-r ${
						darkMode
							? "from-slate-700/40 to-slate-600/20"
							: "from-slate-100/60 to-slate-50/40"
					} rounded-lg px-3 py-1.5 animate-pulse`}
				>
					<div className="flex items-center">
						<div
							className={`h-3.5 w-3.5 ${
								darkMode ? "bg-slate-600/50" : "bg-slate-300/60"
							} rounded mr-2`}
						></div>
						<div
							className={`h-3 w-16 ${
								darkMode ? "bg-slate-600/50" : "bg-slate-300/60"
							} rounded`}
						></div>
					</div>
				</div>
				<div className="flex space-x-1">
					<div
						className={`h-8 w-8 ${
							darkMode ? "bg-slate-700/40" : "bg-slate-200/60"
						} rounded-lg animate-pulse`}
					></div>
					<div
						className={`h-8 w-8 ${
							darkMode ? "bg-slate-700/40" : "bg-slate-200/60"
						} rounded-lg animate-pulse`}
					></div>
					<div
						className={`h-8 w-8 ${
							darkMode ? "bg-slate-700/40" : "bg-slate-200/60"
						} rounded-lg animate-pulse`}
					></div>
				</div>
			</div>
		</div>
	</div>
);

const SkeletonLoader: React.FC = () => {
	return (
		<div className="min-h-screen bg-slate-50 relative overflow-hidden">
			<div className="absolute inset-0 bg-teal-50/30 backdrop-blur-3xl"></div>

			<div className="relative p-4 sm:p-6 lg:p-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<div className="h-12 w-48 bg-gradient-to-r from-slate-200/80 to-slate-300/60 rounded-lg mx-auto mb-4 animate-pulse"></div>
						<div className="h-6 w-96 bg-gradient-to-r from-slate-200/60 to-slate-300/40 rounded-lg mx-auto animate-pulse"></div>
					</div>

					<div className="flex justify-center mb-8">
						<div className="h-12 w-40 bg-gradient-to-r from-slate-200/80 to-slate-300/60 rounded-xl animate-pulse"></div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
						{[1, 2, 3, 4, 5, 6].map((index) => (
							<PostSkeleton key={index} darkMode={false} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const CustomScrollbarStyles = () => (
	<style>{`
    /* Hide Scrollbars */
    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: transparent;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    /* Firefox - Hide scrollbars */
    html {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    /* Hide scrollbars for all elements */
    * {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    *::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background: transparent;
    }

    /* Newsletter toast animations */
    @keyframes slideInFromRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutToRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .animate-slideInFromRight {
      animation: slideInFromRight 0.4s ease-out;
    }
    
    .animate-slideOutToRight {
      animation: slideOutToRight 0.3s ease-in;
    }
  `}</style>
);

const MobileSidebar: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	darkMode: boolean;
	activeSection: string;
	onNavigate: (section: string) => void;
}> = ({ isOpen, onClose, darkMode, activeSection, onNavigate }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const handleNavigate = (section: string) => {
		onNavigate(section);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 md:hidden">
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div
				className={`fixed top-0 right-0 h-full w-full max-w-sm ${
					darkMode ? "bg-gray-900" : "bg-white"
				} shadow-2xl transform transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div
					className={`flex items-center justify-between p-6 border-b ${
						darkMode ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<div className="flex items-center space-x-3">
						<MessageIcon
							className="w-7 h-7 text-teal-600 drop-shadow-sm"
							aria-hidden="true"
						/>
						<span
							className={`font-display text-xl font-bold ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							DraftPulse
						</span>
					</div>
					<button
						onClick={onClose}
						className={`p-2 rounded-lg cursor-pointer ${
							darkMode
								? "hover:bg-gray-800 text-gray-400 hover:text-white"
								: "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
						} transition-all duration-200`}
					>
						<XIcon className="w-6 h-6" />
					</button>
				</div>

				<div className="p-6 space-y-2">
					{[
						{ id: "home", label: "Home" },
						{ id: "about", label: "About Us" },
						{ id: "dashboard", label: "Dashboard" },
					].map((item) => (
						<button
							key={item.id}
							onClick={() => handleNavigate(item.id)}
							className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 cursor-pointer ${
								activeSection === item.id
									? darkMode
										? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
										: "bg-teal-50 text-teal-600 border border-teal-200"
									: darkMode
									? "hover:bg-gray-800 text-gray-300 hover:text-white"
									: "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
							}`}
						>
							<span className="font-heading font-semibold">{item.label}</span>
							{activeSection === item.id && (
								<div className="ml-auto w-2 h-2 bg-teal-500 rounded-full" />
							)}
						</button>
					))}
				</div>

				<div
					className={`absolute bottom-0 left-0 right-0 p-6 border-t ${
						darkMode ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<p
						className={`text-sm text-center ${
							darkMode ? "text-gray-400" : "text-gray-500"
						}`}
					>
						Social Media Scheduler
					</p>
				</div>
			</div>
		</div>
	);
};

const NewsletterToast: React.FC<{
	toast: NewsletterToast;
	darkMode: boolean;
	onClose: (id: string) => void;
}> = ({ toast, darkMode, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose(toast.id);
		}, 4000);

		return () => clearTimeout(timer);
	}, [toast.id, onClose]);

	return (
		<div className="fixed top-4 left-4 right-4 sm:top-auto sm:bottom-20 sm:right-4 sm:left-auto z-50 animate-slideInFromTop sm:animate-slideInFromRight">
			<div
				className={`
        flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-xl border max-w-sm mx-auto sm:mx-0
        ${
					toast.type === "success"
						? darkMode
							? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
							: "bg-emerald-50/95 border-emerald-200/50 text-emerald-700"
						: darkMode
						? "bg-red-500/20 border-red-400/30 text-red-300"
						: "bg-red-50/95 border-red-200/50 text-red-700"
				}
      `}
			>
				<div className="flex items-center">
					{toast.type === "success" ? (
						<CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
					) : (
						<AlertCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
					)}
					<p className="font-body text-sm font-medium">{toast.message}</p>
				</div>
				<button
					onClick={() => onClose(toast.id)}
					className={`ml-3 p-1 rounded-full transition-colors cursor-pointer ${
						darkMode
							? "hover:bg-white/10 text-gray-400 hover:text-white"
							: "hover:bg-black/10 text-gray-500 hover:text-gray-700"
					}`}
				>
					<XIcon className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

const SocialMediaScheduler: React.FC = () => {
	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
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
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideInFromTop {
        from {
          opacity: 0;
          transform: translateY(-100%);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
      .animate-slideIn {
        animation: slideIn 0.3s ease-out;
      }
      .animate-slideInFromTop {
        animation: slideInFromTop 0.4s ease-out;
      }
    `;
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	const validateImageUrl = (url: string): boolean => {
		try {
			new URL(url);
			return /\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?.*)?$/i.test(url);
		} catch {
			return false;
		}
	};

	const checkImageExists = (url: string): Promise<boolean> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
			img.src = url;
			setTimeout(() => resolve(false), 5000);
		});
	};

	const validateImageUrlWithState = async (url: string, key: string) => {
		if (!url.trim()) {
			setImageValidationState((prev) => ({ ...prev, [key]: "idle" }));
			return;
		}

		if (!validateImageUrl(url)) {
			setImageValidationState((prev) => ({ ...prev, [key]: "invalid" }));
			return;
		}

		setImageValidationState((prev) => ({ ...prev, [key]: "validating" }));

		try {
			const isValid = await checkImageExists(url);
			setImageValidationState((prev) => ({
				...prev,
				[key]: isValid ? "valid" : "invalid",
			}));
		} catch (error) {
			setImageValidationState((prev) => ({ ...prev, [key]: "invalid" }));
		}
	};

	const debounceTimeouts = useRef<{ [key: string]: number }>({});

	const debouncedValidateImage = (url: string, key: string) => {
		if (debounceTimeouts.current[key]) {
			clearTimeout(debounceTimeouts.current[key]);
		}

		debounceTimeouts.current[key] = setTimeout(() => {
			validateImageUrlWithState(url, key);
		}, 1000);
	};

	const [isLoading, setIsLoading] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
	const [notificationsDropdownOpen, setNotificationsDropdownOpen] =
		useState(false);
	const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
	const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [showNewPostForm, setShowNewPostForm] = useState(false);
	const [newPost, setNewPost] = useState<{
		content: string;
		platform: "Twitar" | "Intagraam" | "Linkin" | "facelook";
		scheduledFor: string;
		imageUrl?: string;
		status: "draft" | "scheduled" | "published";
		nextAction?: "publish" | "schedule" | null;
	}>({
		content: "",
		platform: "Twitar",
		scheduledFor: "",
		imageUrl: "",
		status: "draft",
		nextAction: null,
	});
	const [hoveredCard, setHoveredCard] = useState<string | null>(null);
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [showCommentsModal, setShowCommentsModal] = useState(false);
	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const [previewingPost, setPreviewingPost] = useState<Post | null>(null);
	const [commentingPost, setCommentingPost] = useState<Post | null>(null);
	const [likeAnimations, setLikeAnimations] = useState<{
		[key: string]: boolean;
	}>({});
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [settings, setSettings] = useState({
		autoPublish: true,
		emailNotifications: true,
		defaultPlatform: "Twitar",
		timezone: "UTC",
	});
	const [newPostLoading, setNewPostLoading] = useState(false);
	const [searchSelectedPostId, setSearchSelectedPostId] = useState<
		string | null
	>(null);
	const [imageValidationState, setImageValidationState] = useState<{
		[key: string]: "idle" | "validating" | "valid" | "invalid";
	}>({});
	const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
		{}
	);
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [newsletterToasts, setNewsletterToasts] = useState<NewsletterToast[]>(
		[]
	);
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [activeSection, setActiveSection] = useState("home");
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const postRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				const [initialPosts, initialNotifications, initialSettings] =
					await Promise.all([
						api.getPosts(),
						api.getNotifications(),
						api.getSettings(),
					]);

				setPosts(initialPosts);
				setNotifications(initialNotifications);
				setSettings(initialSettings);
			} catch (error) {
				showToast("error", "Failed to load initial data");
			} finally {
				setIsLoading(false);
			}
		};

		loadInitialData();

		const unsubscribe = api.onRealtimeUpdate(() => {
			Promise.all([api.getPosts(), api.getNotifications()])
				.then(([updatedPosts, updatedNotifications]) => {
					const autoPublishedPosts = updatedPosts.filter((updatedPost) => {
						const oldPost = posts.find((p) => p.id === updatedPost.id);
						return (
							oldPost &&
							oldPost.status === "scheduled" &&
							updatedPost.status === "published"
						);
					});

					autoPublishedPosts.forEach((post) => {
						showToast(
							"success",
							`Post "${post.content.slice(
								0,
								30
							)}..." was automatically published!`
						);
					});

					setPosts(updatedPosts);
					setNotifications(updatedNotifications);
				})
				.catch((error) => {
					console.error("Failed to refresh data:", error);
				});
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const sections = ["home", "about", "dashboard"];
			const headerHeight = 64;

			if (
				currentScrollY < 100 ||
				searchDropdownOpen ||
				notificationsDropdownOpen ||
				mobileSidebarOpen
			) {
				setIsHeaderVisible(true);
			} else if (Math.abs(currentScrollY - lastScrollY) > 5) {
				if (currentScrollY > lastScrollY && currentScrollY > 100) {
					setIsHeaderVisible(false);
				} else if (currentScrollY < lastScrollY) {
					setIsHeaderVisible(true);
				}
			}

			setLastScrollY(currentScrollY);

			for (const sectionId of sections) {
				const element = document.getElementById(sectionId);
				if (element) {
					const rect = element.getBoundingClientRect();
					const elementTop = rect.top + window.scrollY - headerHeight;
					const elementBottom = elementTop + element.offsetHeight;
					const scrollPosition = window.scrollY + headerHeight + 100;

					if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
						setActiveSection(sectionId);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [
		lastScrollY,
		searchDropdownOpen,
		notificationsDropdownOpen,
		mobileSidebarOpen,
	]);

	const showToast = (
		type: "success" | "error" | "warning" | "info",
		message: string
	) => {
		const id = Math.random().toString(36).substring(7);
		setToasts((prev) => [...prev, { id, type, message }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 5000);
	};

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleNewsletterSubmit = async () => {
		if (!newsletterEmail.trim()) {
			showNewsletterToast("error", "Please enter your email address");
			return;
		}

		if (!validateEmail(newsletterEmail)) {
			showNewsletterToast("error", "Please enter a valid email address");
			return;
		}

		setIsSubscribing(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));

			showNewsletterToast(
				"success",
				"Successfully subscribed to our newsletter!"
			);
			setNewsletterEmail("");
		} catch (error) {
			showNewsletterToast("error", "Failed to subscribe. Please try again.");
		} finally {
			setIsSubscribing(false);
		}
	};

	const showNewsletterToast = (type: "success" | "error", message: string) => {
		const id = Math.random().toString(36).substring(7);
		setNewsletterToasts((prev) => [...prev, { id, type, message }]);
	};

	const closeNewsletterToast = (id: string) => {
		setNewsletterToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			const headerHeight = 64;
			const elementPosition = element.offsetTop - headerHeight;

			window.scrollTo({
				top: elementPosition,
				behavior: "smooth",
			});

			setActiveSection(sectionId);
		}
	};

	const handleAction = async (postId: string, action: string) => {
		setLoading((prev) => ({ ...prev, [postId]: true }));

		try {
			if (action === "publish") {
				const updatedPost = await api.updatePost(postId, {
					status: "published",
				});
				setPosts((prev) =>
					prev.map((post) => (post.id === postId ? updatedPost : post))
				);
				showToast("success", "Post published successfully!");
				await api.addNotification({
					message: "Post published successfully",
					type: "success",
					timestamp: new Date(),
				});
			} else if (action === "delete") {
				await api.deletePost(postId);
				setPosts((prev) => prev.filter((post) => post.id !== postId));
				showToast("success", "Post deleted successfully!");
				await api.addNotification({
					message: "Post deleted",
					type: "info",
					timestamp: new Date(),
				});
			} else if (action === "schedule") {
				const updatedPost = await api.updatePost(postId, {
					status: "scheduled",
				});
				setPosts((prev) =>
					prev.map((post) => (post.id === postId ? updatedPost : post))
				);
				showToast("success", "Post scheduled successfully!");
				await api.addNotification({
					message: "Post scheduled for publishing",
					type: "info",
					timestamp: new Date(),
				});
			} else if (action === "edit") {
				const postToEdit = posts.find((post) => post.id === postId);
				if (postToEdit) {
					setEditingPost(postToEdit);
				}
			} else if (action === "preview") {
				const postToPreview = posts.find((post) => post.id === postId);
				if (postToPreview) {
					setPreviewingPost(postToPreview);
					setShowPreviewModal(true);
				}
			}
		} catch (error) {
			showToast("error", "Action failed. Please try again.");
		} finally {
			setLoading((prev) => ({ ...prev, [postId]: false }));
		}
	};

	const handleLike = async (postId: string) => {
		try {
			const updatedPost = await api.likePost(postId);
			setPosts((prev) =>
				prev.map((post) => (post.id === postId ? updatedPost : post))
			);

			setLikeAnimations((prev) => ({ ...prev, [postId]: true }));
			setTimeout(() => {
				setLikeAnimations((prev) => ({ ...prev, [postId]: false }));
			}, 1000);

			if (updatedPost.liked) {
				await api.addNotification({
					message: `You liked "${updatedPost.content.slice(0, 30)}..."`,
					type: "success",
					timestamp: new Date(),
				});
				showToast("success", "Post liked!");
			}
		} catch (error) {
			showToast("error", "Failed to like post");
		}
	};

	const handleComment = (postId: string) => {
		const post = posts.find((p) => p.id === postId);
		if (post) {
			setCommentingPost(post);
			setShowCommentsModal(true);
		}
	};

	const handleAddComment = async (postId: string, commentText: string) => {
		try {
			await api.addComment(postId, {
				text: commentText,
				author: "You",
				timestamp: new Date(),
			});

			const updatedPosts = await api.getPosts();
			const updatedPost = updatedPosts.find((post) => post.id === postId);
			if (updatedPost) {
				setPosts((prevPosts) =>
					prevPosts.map((post) => (post.id === postId ? updatedPost : post))
				);
				setCommentingPost(updatedPost);
			}

			showToast("success", "Comment added successfully!");
			await api.addNotification({
				message: "New comment added",
				type: "success",
				timestamp: new Date(),
			});
		} catch (error) {
			showToast("error", "Failed to add comment");
		}
	};

	const handleShare = async (postId: string) => {
		const post = posts.find((p) => p.id === postId);
		if (!post) return;

		// Create share data
		const shareData = {
			title: `Check out this ${post.platform} post!`,
			text: post.content,
			url: post.imageUrl || window.location.href,
		};

		try {
			// Check if Web Share API is supported
			if (navigator.share) {
				await navigator.share(shareData);

				// Only increment share count if sharing was successful (not cancelled)
				const updatedPost = await api.sharePost(postId);
				setPosts((prev) =>
					prev.map((post) => (post.id === postId ? updatedPost : post))
				);
				showToast("success", "Post shared successfully!");
				await api.addNotification({
					message: "Post shared",
					type: "success",
					timestamp: new Date(),
				});
			} else {
				// Fallback for browsers that don't support Web Share API
				if (navigator.clipboard) {
					const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
					await navigator.clipboard.writeText(shareText);
					showToast("success", "Post content copied to clipboard!");
				} else {
					// Last resort fallback
					const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
					const textArea = document.createElement("textarea");
					textArea.value = shareText;
					textArea.style.position = "fixed";
					textArea.style.left = "-999999px";
					textArea.style.top = "-999999px";
					document.body.appendChild(textArea);
					textArea.focus();
					textArea.select();
					document.execCommand("copy");
					textArea.remove();
					showToast("success", "Post content copied to clipboard!");
				}

				// Still increment share count for fallback actions
				const updatedPost = await api.sharePost(postId);
				setPosts((prev) =>
					prev.map((post) => (post.id === postId ? updatedPost : post))
				);
				await api.addNotification({
					message: "Post shared",
					type: "success",
					timestamp: new Date(),
				});
			}
		} catch (error: any) {
			// Handle cases where user cancels the share dialog
			if (error instanceof Error && error.name === "AbortError") {
				// User cancelled sharing, don't show error or increment count
				return;
			}
			showToast("error", "Failed to share post");
			console.error("Share failed:", error);
		}
	};

	const handleEditPost = async () => {
		if (!editingPost) return;

		const validationKey = `edit-${editingPost.id}`;
		const validationState = imageValidationState[validationKey];
		if (editingPost.imageUrl && validationState === "invalid") {
			showToast("error", "Please provide a valid image URL or remove it");
			return;
		}

		if (editingPost.imageUrl && validationState === "validating") {
			showToast("warning", "Please wait for image validation to complete");
			return;
		}

		const postToUpdate = { ...editingPost };
		const postId = editingPost.id;
		setEditingPost(null);
		setImageValidationState((prev) => ({ ...prev, [validationKey]: "idle" }));
		setLoading((prev) => ({ ...prev, [postId]: true }));

		try {
			const updatedPost = await api.updatePost(postId, postToUpdate);
			setPosts((prev) =>
				prev.map((post) => (post.id === postId ? updatedPost : post))
			);
			showToast("success", "Post updated successfully!");
			await api.addNotification({
				message: "Post updated",
				type: "success",
				timestamp: new Date(),
			});
		} catch (error) {
			showToast("error", "Failed to update post");
		} finally {
			setLoading((prev) => ({ ...prev, [postId]: false }));
		}
	};

	const DEFAULT_IMAGE_URL =
		"https://images.pexels.com/photos/697244/pexels-photo-697244.jpeg";

	const createNewPost = async () => {
		if (!newPost.content.trim()) {
			showToast("error", "Please enter post content");
			return;
		}

		if (!newPost.imageUrl?.trim()) {
			showToast("error", "Image URL is required to create a post");
			return;
		}

		const validationState = imageValidationState["new-post"];
		if (validationState === "invalid") {
			showToast("error", "Please provide a valid image URL");
			return;
		}

		if (validationState === "validating") {
			showToast("warning", "Please wait for image validation to complete");
			return;
		}

		if (validationState !== "valid") {
			showToast("error", "Please provide a valid image URL");
			return;
		}

		setShowNewPostForm(false);
		setNewPost({
			content: "",
			platform: "Twitar",
			scheduledFor: "",
			imageUrl: "",
			status: "draft",
			nextAction: null,
		});
		setImageValidationState((prev) => ({ ...prev, "new-post": "idle" }));
		setNewPostLoading(true);

		try {
			const createdPost = await api.createPost({
				content: newPost.content,
				platform: newPost.platform,
				scheduledFor: new Date(newPost.scheduledFor),
				status: newPost.status,
				imageUrl: newPost.imageUrl,
				nextAction: newPost.nextAction,
			});
			setPosts((prev) => [createdPost, ...prev]);
			showToast("success", "Post created successfully!");
			await api.addNotification({
				message: "New post created",
				type: "success",
				timestamp: new Date(),
			});
		} catch (error) {
			showToast("error", "Failed to create post");
		} finally {
			setNewPostLoading(false);
		}
	};

	const handleClearAllNotifications = async () => {
		try {
			await api.clearNotifications();
			setNotifications([]);
			showToast("success", "All notifications cleared");
		} catch (error) {
			showToast("error", "Failed to clear notifications");
		}
	};

	const handleUpdateSettings = async (updates: Partial<typeof settings>) => {
		try {
			const updatedSettings = await api.updateSettings(updates);
			setSettings(updatedSettings);
			showToast("success", "Settings updated successfully");
		} catch (error) {
			showToast("error", "Failed to update settings");
		}
	};

	const platformColors = {
		Twitar: darkMode ? "from-sky-500 to-blue-600" : "from-sky-400 to-blue-500",
		Intagraam: darkMode
			? "from-purple-500 to-pink-600"
			: "from-purple-400 to-pink-500",
		Linkin: darkMode
			? "from-blue-600 to-indigo-700"
			: "from-blue-500 to-indigo-600",
		facelook: darkMode
			? "from-blue-600 to-purple-700"
			: "from-blue-500 to-purple-600",
	};

	const statusConfig = {
		draft: {
			bg: darkMode
				? "bg-gradient-to-r from-gray-700 to-gray-600"
				: "bg-gradient-to-r from-slate-100 to-slate-200",
			text: darkMode ? "text-gray-200" : "text-slate-700",
		},
		scheduled: {
			bg: darkMode
				? "bg-gradient-to-r from-amber-600 to-orange-600"
				: "bg-gradient-to-r from-amber-100 to-orange-200",
			text: darkMode ? "text-amber-100" : "text-amber-800",
		},
		published: {
			bg: darkMode
				? "bg-gradient-to-r from-emerald-600 to-teal-600"
				: "bg-gradient-to-r from-emerald-100 to-teal-200",
			text: darkMode ? "text-emerald-100" : "text-emerald-800",
		},
		failed: {
			bg: darkMode
				? "bg-gradient-to-r from-red-600 to-rose-600"
				: "bg-gradient-to-r from-red-100 to-rose-200",
			text: darkMode ? "text-red-100" : "text-red-800",
		},
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	useEffect(() => {
		const anyModalOpen =
			showNewPostForm ||
			editingPost ||
			showSettingsModal ||
			showPreviewModal ||
			showCommentsModal;
		if (anyModalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [
		showNewPostForm,
		editingPost,
		showSettingsModal,
		showPreviewModal,
		showCommentsModal,
	]);

	const platformDropdownRef = useRef<HTMLDivElement>(null);
	const statusDropdownRef = useRef<HTMLDivElement>(null);
	const datePickerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				platformDropdownRef.current &&
				!platformDropdownRef.current.contains(event.target as Node)
			) {
				setPlatformDropdownOpen(false);
			}
			if (
				statusDropdownRef.current &&
				!statusDropdownRef.current.contains(event.target as Node)
			) {
				setStatusDropdownOpen(false);
			}
			if (
				datePickerRef.current &&
				!datePickerRef.current.contains(event.target as Node)
			) {
				setDatePickerOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const header = document.querySelector("header");
			if (header && header.contains(event.target as Node)) {
				return;
			}

			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				if (showNewPostForm) {
					setShowNewPostForm(false);
					setImageValidationState((prev) => ({ ...prev, "new-post": "idle" }));
				}
				if (editingPost) {
					const editKey = `edit-${editingPost.id}`;
					setEditingPost(null);
					setImageValidationState((prev) => ({ ...prev, [editKey]: "idle" }));
				}
			}
		};

		if (showNewPostForm || editingPost) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showNewPostForm, editingPost]);

	const handleUnschedule = async (postId: string) => {
		setLoading((prev) => ({ ...prev, [postId]: true }));
		try {
			const updatedPost = await api.updatePost(postId, { status: "draft" });
			setPosts((prev) =>
				prev.map((post) => (post.id === postId ? updatedPost : post))
			);
			showToast("success", "Post unscheduled and set to draft!");
			await api.addNotification({
				message: "Post unscheduled",
				type: "info",
				timestamp: new Date(),
			});
		} catch (error) {
			showToast("error", "Failed to unschedule post");
		} finally {
			setLoading((prev) => ({ ...prev, [postId]: false }));
		}
	};

	useEffect(() => {
		if (searchSelectedPostId && postRefs.current[searchSelectedPostId]) {
			postRefs.current[searchSelectedPostId]?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			const timeout = setTimeout(() => setSearchSelectedPostId(null), 2500);
			return () => clearTimeout(timeout);
		}
	}, [searchSelectedPostId]);

	if (isLoading) {
		return <SkeletonLoader />;
	}

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${
				darkMode ? "bg-gray-900" : "bg-slate-50"
			} relative overflow-hidden`}
			data-dark-mode={darkMode}
		>
			<CustomScrollbarStyles />
			<FloatingParticles />
			<NetworkStatus darkMode={darkMode} />

			<div
				className={`absolute inset-0 ${
					darkMode ? "bg-blue-900/5" : "bg-teal-50/30"
				} backdrop-blur-3xl`}
			></div>

			<div className="relative">
				<Header
					darkMode={darkMode}
					onSearch={() => setSearchDropdownOpen(!searchDropdownOpen)}
					onNotifications={() =>
						setNotificationsDropdownOpen(!notificationsDropdownOpen)
					}
					searchOpen={searchDropdownOpen}
					notificationsOpen={notificationsDropdownOpen}
					notifications={notifications}
					posts={posts}
					onPostSelect={(post) => {
						setSearchSelectedPostId(post.id);
						setSearchDropdownOpen(false);
					}}
					onClearAllNotifications={handleClearAllNotifications}
					onCloseSearch={() => setSearchDropdownOpen(false)}
					onCloseNotifications={() => setNotificationsDropdownOpen(false)}
					activeSection={activeSection}
					onNavigate={scrollToSection}
					mobileSidebarOpen={mobileSidebarOpen}
					onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
					isVisible={isHeaderVisible}
				/>
			</div>

			<div className="fixed top-20 right-4 z-[100] space-y-3 max-w-sm">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`flex items-center p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 transform translate-x-0 ${
							toast.type === "success"
								? `${
										darkMode
											? "bg-emerald-600/90 text-emerald-100 border-emerald-400/40 shadow-emerald-500/30"
											: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-200/50"
								  }`
								: toast.type === "error"
								? `${
										darkMode
											? "bg-red-600/90 text-red-100 border-red-400/40 shadow-red-500/30"
											: "bg-red-50 text-red-700 border-red-200 shadow-red-200/50"
								  }`
								: toast.type === "warning"
								? `${
										darkMode
											? "bg-yellow-600/90 text-yellow-100 border-yellow-400/40 shadow-yellow-500/30"
											: "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-200/50"
								  }`
								: `${
										darkMode
											? "bg-blue-600/90 text-blue-100 border-blue-400/40 shadow-blue-500/30"
											: "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-200/50"
								  }`
						}`}
					>
						{toast.type === "success" ? (
							<CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
						) : (
							<AlertCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
						)}
						<span className="font-body text-body-sm font-medium flex-1">
							{toast.message}
						</span>
						<button
							onClick={() =>
								setToasts((prev) => prev.filter((t) => t.id !== toast.id))
							}
							className={`ml-3 p-1 ${
								darkMode ? "hover:bg-white/20" : "hover:bg-black/10"
							} rounded-full transition-colors`}
						>
							<XIcon className="w-4 h-4" />
						</button>
					</div>
				))}
			</div>

			<SettingsModal
				isOpen={showSettingsModal}
				onClose={() => setShowSettingsModal(false)}
				darkMode={darkMode}
				settings={settings}
				onUpdateSettings={handleUpdateSettings}
			/>

			<PreviewModal
				isOpen={showPreviewModal}
				onClose={() => setShowPreviewModal(false)}
				darkMode={darkMode}
				post={previewingPost}
			/>

			<CommentsModal
				isOpen={showCommentsModal}
				onClose={() => setShowCommentsModal(false)}
				darkMode={darkMode}
				post={commentingPost}
				onAddComment={handleAddComment}
			/>

			<div id="home" className="pt-16">
				<HeroSection onCreatePost={() => setShowNewPostForm(true)} />
			</div>

			<div id="about">
				<AboutUsSection darkMode={darkMode} posts={posts} />
			</div>

			<div
				id="dashboard"
				className="relative z-10 pt-16 pb-4 px-4 sm:pt-20 sm:pb-6 sm:px-6 lg:pt-24 lg:pb-8 lg:px-8"
			>
				<TypographyStyles />
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<p className="font-heading text-sm font-semibold tracking-widest uppercase mb-4 text-teal-600"></p>
						<h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-gray-900">
							Your Social Media
							<br />
							<span className="text-teal-600">Dashboard</span>
						</h2>
						<p className="font-body text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed text-gray-600">
							Manage all your social media posts in one place with intelligent
							scheduling and powerful analytics.
						</p>
					</div>

					{(showNewPostForm || editingPost) && (
						<div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 pb-6 px-4 animate-fadeIn overflow-y-auto">
							<div
								ref={modalRef}
								className="w-full max-w-md animate-slideIn my-auto"
							>
								<div className="bg-white border-gray-200 rounded-2xl border shadow-2xl overflow-hidden max-h-[calc(100vh-8rem)] flex flex-col">
									<div className="relative px-5 py-4 flex-shrink-0 bg-gray-50 border-gray-200 border-b">
										<div className="flex justify-between items-center">
											<h3 className="font-heading text-lg font-bold text-gray-900">
												{editingPost ? "Edit Post" : "Create New Post"}
											</h3>
											<button
												onClick={() => {
													setShowNewPostForm(false);
													setEditingPost(null);
													setNewPost({
														content: "",
														platform: "Twitar",
														scheduledFor: "",
														imageUrl: "",
														status: "draft",
														nextAction: null,
													});
													setImageValidationState((prev) => ({
														...prev,
														"new-post": "idle",
														...(editingPost && {
															[`edit-${editingPost.id}`]: "idle",
														}),
													}));
												}}
												className="p-1.5 hover:bg-black/5 text-gray-500 hover:text-gray-700 rounded-lg transition-all duration-200"
											>
												<XIcon className="w-4 h-4" />
											</button>
										</div>
									</div>
									<div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
										<div className="space-y-2">
											<label className="block font-body text-xs font-semibold tracking-wide text-gray-700 uppercase">
												Platform
											</label>
											<div className="relative" ref={platformDropdownRef}>
												<button
													type="button"
													onClick={() =>
														setPlatformDropdownOpen(!platformDropdownOpen)
													}
													className="w-full p-3 flex items-center justify-between bg-gray-50/70 border-gray-200/70 text-gray-800 hover:bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400/50 transition-all duration-200 backdrop-blur-sm"
												>
													<span className="font-medium text-sm">
														{editingPost
															? editingPost.platform
															: newPost.platform}
													</span>
													<svg
														className={`w-4 h-4 transition-transform duration-300 text-gray-500 ${
															platformDropdownOpen ? "rotate-180" : ""
														}`}
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</button>

												{platformDropdownOpen && (
													<div className="absolute z-20 w-full mt-2 bg-white/95 border-gray-200/80 border rounded-xl shadow-xl overflow-hidden backdrop-blur-xl animate-slideIn">
														{["Twitar", "Intagraam", "Linkin", "facelook"].map(
															(platform) => (
																<button
																	key={platform}
																	onClick={() => {
																		if (editingPost) {
																			setEditingPost((prev) =>
																				prev
																					? {
																							...prev,
																							platform: platform as any,
																					  }
																					: null
																			);
																		} else {
																			setNewPost((prev) => ({
																				...prev,
																				platform: platform as any,
																			}));
																		}
																		setPlatformDropdownOpen(false);
																	}}
																	className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
																		(editingPost
																			? editingPost.platform
																			: newPost.platform) === platform
																			? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
																			: "text-gray-700 hover:bg-gray-50"
																	}`}
																>
																	{platform}
																</button>
															)
														)}
													</div>
												)}
											</div>
										</div>
										<div className="space-y-2">
											<label className="block font-body text-xs font-semibold tracking-wide text-gray-700 uppercase">
												Post Status
											</label>
											<div className="relative" ref={statusDropdownRef}>
												<button
													type="button"
													onClick={() =>
														setStatusDropdownOpen(!statusDropdownOpen)
													}
													className="w-full p-3 flex items-center justify-between bg-gray-50/70 border-gray-200/70 text-gray-800 hover:bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400/50 transition-all duration-200 backdrop-blur-sm"
												>
													<span className="flex items-center font-medium text-sm">
														<span
															className={`inline-block w-2.5 h-2.5 rounded-full mr-2.5 ${
																(editingPost
																	? editingPost.status
																	: newPost.status) === "draft"
																	? "bg-gray-400"
																	: (editingPost
																			? editingPost.status
																			: newPost.status) === "scheduled"
																	? "bg-amber-400"
																	: "bg-emerald-400"
															}`}
														></span>
														{(editingPost ? editingPost.status : newPost.status)
															.charAt(0)
															.toUpperCase() +
															(editingPost
																? editingPost.status
																: newPost.status
															).slice(1)}
													</span>
													<svg
														className={`w-4 h-4 transition-transform duration-300 text-gray-500 ${
															statusDropdownOpen ? "rotate-180" : ""
														}`}
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</button>

												{statusDropdownOpen && (
													<div className="absolute z-20 w-full mt-2 bg-white/95 border-gray-200/80 border rounded-xl shadow-xl overflow-hidden backdrop-blur-xl animate-slideIn">
														{(["draft", "scheduled", "published"] as const).map(
															(status) => (
																<button
																	key={status}
																	onClick={() => {
																		if (editingPost) {
																			setEditingPost((prev) =>
																				prev ? { ...prev, status } : null
																			);
																		} else {
																			setNewPost((prev) => ({
																				...prev,
																				status,
																			}));
																		}
																		setStatusDropdownOpen(false);
																	}}
																	className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 flex items-center ${
																		(editingPost
																			? editingPost.status
																			: newPost.status) === status
																			? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
																			: "text-gray-700 hover:bg-gray-50"
																	}`}
																>
																	<span
																		className={`inline-block w-2.5 h-2.5 rounded-full mr-2.5 ${
																			status === "draft"
																				? "bg-gray-400"
																				: status === "scheduled"
																				? "bg-amber-400"
																				: "bg-emerald-400"
																		}`}
																	></span>
																	{status.charAt(0).toUpperCase() +
																		status.slice(1)}
																</button>
															)
														)}
													</div>
												)}
											</div>
										</div>

										{((editingPost && editingPost.status === "draft") ||
											(!editingPost && newPost.status === "draft")) &&
											(editingPost
												? editingPost.scheduledFor
												: newPost.scheduledFor) && (
												<div className="space-y-2 p-4 bg-blue-50/50 border border-blue-200/50 rounded-xl">
													<label className="block font-body text-xs font-semibold tracking-wide text-blue-700 uppercase">
														What should happen at the scheduled time?
													</label>
													<p className="text-sm text-blue-600 mb-3">
														Since you've set this as a draft with a scheduled
														time, choose what should happen automatically:
													</p>
													<div className="space-y-2">
														<label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-blue-100/50 transition-colors">
															<input
																type="radio"
																name="nextAction"
																value="publish"
																checked={
																	(editingPost
																		? editingPost.nextAction
																		: newPost.nextAction) === "publish"
																}
																onChange={(e) => {
																	if (editingPost) {
																		setEditingPost((prev) =>
																			prev
																				? {
																						...prev,
																						nextAction: e.target
																							.value as "publish",
																				  }
																				: null
																		);
																	} else {
																		setNewPost((prev) => ({
																			...prev,
																			nextAction: e.target.value as "publish",
																		}));
																	}
																}}
																className="w-4 h-4 text-blue-600 border-blue-300 focus:ring-blue-500"
															/>
															<div className="ml-3">
																<span className="text-sm font-medium text-gray-900">
																	Publish immediately
																</span>
																<p className="text-xs text-gray-600">
																	The post will be published at the scheduled
																	time
																</p>
															</div>
														</label>
														<label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-blue-100/50 transition-colors">
															<input
																type="radio"
																name="nextAction"
																value="schedule"
																checked={
																	(editingPost
																		? editingPost.nextAction
																		: newPost.nextAction) === "schedule"
																}
																onChange={(e) => {
																	if (editingPost) {
																		setEditingPost((prev) =>
																			prev
																				? {
																						...prev,
																						nextAction: e.target
																							.value as "schedule",
																				  }
																				: null
																		);
																	} else {
																		setNewPost((prev) => ({
																			...prev,
																			nextAction: e.target.value as "schedule",
																		}));
																	}
																}}
																className="w-4 h-4 text-blue-600 border-blue-300 focus:ring-blue-500"
															/>
															<div className="ml-3">
																<span className="text-sm font-medium text-gray-900">
																	Move to scheduled
																</span>
																<p className="text-xs text-gray-600">
																	The post will become scheduled (ready for
																	publishing)
																</p>
															</div>
														</label>
														<label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-blue-100/50 transition-colors">
															<input
																type="radio"
																name="nextAction"
																value=""
																checked={
																	!(editingPost
																		? editingPost.nextAction
																		: newPost.nextAction)
																}
																onChange={() => {
																	if (editingPost) {
																		setEditingPost((prev) =>
																			prev
																				? { ...prev, nextAction: null }
																				: null
																		);
																	} else {
																		setNewPost((prev) => ({
																			...prev,
																			nextAction: null,
																		}));
																	}
																}}
																className="w-4 h-4 text-blue-600 border-blue-300 focus:ring-blue-500"
															/>
															<div className="ml-3">
																<span className="text-sm font-medium text-gray-900">
																	Do nothing
																</span>
																<p className="text-xs text-gray-600">
																	Keep as draft, no automatic action
																</p>
															</div>
														</label>
													</div>
												</div>
											)}

										<div className="space-y-2">
											<label className="block font-body text-xs font-semibold tracking-wide text-gray-700 uppercase">
												Content
											</label>
											<textarea
												value={
													editingPost ? editingPost.content : newPost.content
												}
												onChange={(e) => {
													if (editingPost) {
														setEditingPost((prev) =>
															prev ? { ...prev, content: e.target.value } : null
														);
													} else {
														setNewPost((prev) => ({
															...prev,
															content: e.target.value,
														}));
													}
												}}
												placeholder="What's on your mind?"
												className="w-full p-3 text-sm bg-gray-50/70 border-gray-200/70 text-gray-800 placeholder-gray-500 focus:bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400/50 transition-all duration-200 resize-none backdrop-blur-sm"
												rows={3}
											/>
										</div>
										<div className="space-y-2">
											<label className="block font-body text-xs font-semibold tracking-wide text-gray-700 uppercase">
												Schedule For
											</label>
											<div className="relative" ref={datePickerRef}>
												<button
													type="button"
													onClick={() => setDatePickerOpen(!datePickerOpen)}
													className="w-full p-3 flex items-center justify-between bg-gray-50/70 border-gray-200/70 text-gray-800 hover:bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400/50 transition-all duration-200 backdrop-blur-sm"
												>
													<span className="font-medium text-sm">
														{editingPost
															? editingPost.scheduledFor.toLocaleString(
																	"en-US",
																	{
																		year: "numeric",
																		month: "short",
																		day: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																	}
															  )
															: newPost.scheduledFor
															? new Date(newPost.scheduledFor).toLocaleString(
																	"en-US",
																	{
																		year: "numeric",
																		month: "short",
																		day: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																	}
															  )
															: "Select date and time"}
													</span>
													<CalendarIcon className="w-4 h-4 text-gray-500" />
												</button>

												{datePickerOpen && (
													<div
														className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30"
														onClick={() => setDatePickerOpen(false)}
													>
														<div
															className="w-full max-w-[280px] sm:max-w-xs p-2 sm:p-3 bg-white border-slate-200 border rounded-2xl shadow-2xl relative animate-slideIn"
															onClick={(e) => e.stopPropagation()}
														>
															<CustomCalendar
																darkMode={false}
																selectedDate={
																	editingPost
																		? editingPost.scheduledFor
																		: newPost.scheduledFor
																		? new Date(newPost.scheduledFor)
																		: new Date()
																}
																onSelect={(date) => {
																	if (editingPost) {
																		setEditingPost((prev) =>
																			prev
																				? { ...prev, scheduledFor: date }
																				: null
																		);
																	} else {
																		setNewPost((prev) => ({
																			...prev,
																			scheduledFor: date.toISOString(),
																		}));
																	}
																}}
																onClose={() => setDatePickerOpen(false)}
															/>
														</div>
													</div>
												)}
											</div>
										</div>
										<div className="space-y-2">
											<label className="block font-body text-xs font-semibold tracking-wide text-gray-700 uppercase">
												Image URL{" "}
												{!editingPost && (
													<span className="text-red-400 normal-case">*</span>
												)}
												{editingPost && (
													<span className="text-gray-500 normal-case font-normal">
														{" "}
														(optional)
													</span>
												)}
											</label>
											<div className="relative">
												<input
													type="url"
													required={!editingPost}
													value={
														editingPost
															? editingPost.imageUrl || ""
															: newPost.imageUrl || ""
													}
													onChange={(e) => {
														const url = e.target.value;
														const key = editingPost
															? `edit-${editingPost.id}`
															: "new-post";

														if (editingPost) {
															setEditingPost((prev) =>
																prev ? { ...prev, imageUrl: url } : null
															);
														} else {
															setNewPost((prev) => ({
																...prev,
																imageUrl: url,
															}));
														}

														debouncedValidateImage(url, key);
													}}
													placeholder={
														!editingPost
															? "https://example.com/image.jpg (required)"
															: "https://example.com/image.jpg"
													}
													className={`w-full p-3 pr-10 text-sm bg-gray-50/70 border-gray-200/70 text-gray-800 placeholder-gray-500 focus:bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400/50 transition-all duration-200 backdrop-blur-sm ${
														imageValidationState[
															editingPost
																? `edit-${editingPost.id}`
																: "new-post"
														] === "invalid"
															? "border-red-300 bg-red-50/50"
															: imageValidationState[
																	editingPost
																		? `edit-${editingPost.id}`
																		: "new-post"
															  ] === "valid"
															? "border-green-300 bg-green-50/50"
															: ""
													}`}
												/>

												<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
													{imageValidationState[
														editingPost ? `edit-${editingPost.id}` : "new-post"
													] === "validating" && (
														<div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
													)}
													{imageValidationState[
														editingPost ? `edit-${editingPost.id}` : "new-post"
													] === "valid" && (
														<CheckCircleIcon className="w-4 h-4 text-green-500" />
													)}
													{imageValidationState[
														editingPost ? `edit-${editingPost.id}` : "new-post"
													] === "invalid" && (
														<AlertCircleIcon className="w-4 h-4 text-red-500" />
													)}
												</div>
											</div>

											{imageValidationState[
												editingPost ? `edit-${editingPost.id}` : "new-post"
											] === "invalid" && (
												<p className="mt-1 text-sm text-red-500 font-body">
													Please enter a valid image URL (jpg, png, gif, etc.)
												</p>
											)}
											{imageValidationState[
												editingPost ? `edit-${editingPost.id}` : "new-post"
											] === "valid" && (
												<p className="mt-1 text-sm text-green-500 font-body">
													Image URL is valid ✓
												</p>
											)}

											{(editingPost
												? editingPost.imageUrl
												: newPost.imageUrl) && (
												<div className="mt-2">
													<SafeImage
														src={
															editingPost
																? editingPost.imageUrl
																: newPost.imageUrl
														}
														alt="Image preview"
														className="w-full h-24 object-cover rounded-lg shadow-md"
														fallbackClassName="w-full h-24 rounded-lg"
														darkMode={darkMode}
														onError={() => {
															const key = editingPost
																? `edit-${editingPost.id}`
																: "new-post";
															setImageValidationState((prev) => ({
																...prev,
																[key]: "invalid",
															}));
														}}
													/>
												</div>
											)}
										</div>
									</div>

									<div className="px-5 py-3 flex-shrink-0 bg-gradient-to-r from-gray-50/80 to-gray-100/50 border-gray-200/50 border-t backdrop-blur-xl">
										<div className="flex justify-end gap-2.5">
											<button
												onClick={() => {
													setShowNewPostForm(false);
													setEditingPost(null);
												}}
												className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100/50 border border-gray-300/50 hover:border-gray-400/50 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
											>
												Cancel
											</button>
											<button
												onClick={editingPost ? handleEditPost : createNewPost}
												disabled={
													loading.newPost ||
													(editingPost
														? loading[editingPost.id] || false
														: false) ||
													(!editingPost &&
														(!newPost.content.trim() ||
															!newPost.imageUrl?.trim() ||
															!newPost.scheduledFor ||
															imageValidationState["new-post"] ===
																"validating" ||
															imageValidationState["new-post"] === "invalid" ||
															imageValidationState["new-post"] === "idle"))
												}
												className="px-5 py-2 text-sm bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed font-semibold"
											>
												{loading.newPost ||
												(editingPost
													? loading[editingPost.id] || false
													: false) ? (
													<div className="flex items-center">
														<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
														{editingPost ? "Saving..." : "Creating..."}
													</div>
												) : editingPost ? (
													"Save Changes"
												) : (
													"Create Post"
												)}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
						{newPostLoading && <PostSkeleton darkMode={false} />}
						{posts.map((post) => (
							<div
								key={post.id}
								ref={(el) => {
									postRefs.current[post.id] = el;
								}}
								onMouseEnter={() => setHoveredCard(post.id)}
								onMouseLeave={() => setHoveredCard(null)}
								className={`group relative h-auto min-h-[420px] flex flex-col ${
									post.status === "draft"
										? "bg-gradient-to-br from-white/95 via-white/90 to-slate-50/95 hover:ring-2 hover:ring-teal-400/50 hover:shadow-teal-400/20 focus-within:ring-2 focus-within:ring-teal-400/50"
										: post.status === "scheduled"
										? "bg-gradient-to-br from-amber-50/80 via-white/90 to-slate-50/95 hover:ring-2 hover:ring-amber-400/50 hover:shadow-amber-400/20"
										: post.status === "published"
										? "bg-gradient-to-br from-emerald-50/80 via-white/90 to-slate-50/95 hover:ring-2 hover:ring-emerald-400/50 hover:shadow-emerald-400/20"
										: "bg-gradient-to-br from-red-50/80 via-white/90 to-slate-50/95 hover:ring-2 hover:ring-red-400/50 hover:shadow-red-400/20"
								} backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-xl transition-all duration-300 ${
									hoveredCard === post.id
										? "scale-[1.02] shadow-2xl"
										: "shadow-lg"
								} ${
									searchSelectedPostId === post.id
										? "ring-2 ring-teal-400/70 z-20"
										: ""
								} overflow-hidden cursor-pointer`}
							>
								{loading[post.id] ? (
									<PostSkeleton darkMode={false} />
								) : (
									<>
										<div className="relative z-10 flex flex-col h-full">
											<div className="flex items-center justify-between mb-4 flex-shrink-0">
												<div
													className={`relative inline-flex items-center px-3 py-2 rounded-xl font-heading text-xs font-semibold text-white backdrop-blur-sm border border-white/20 ${
														post.platform === "Twitar"
															? "bg-gradient-to-r from-sky-500/90 to-sky-600/90"
															: post.platform === "Intagraam"
															? "bg-gradient-to-r from-purple-500/90 to-pink-600/90"
															: post.platform === "Linkin"
															? "bg-gradient-to-r from-blue-600/90 to-indigo-700/90"
															: "bg-gradient-to-r from-blue-500/90 to-purple-600/90"
													} shadow-lg hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300`}
												>
													<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-50"></div>
													<span className="relative z-10 tracking-wide">
														{post.platform.charAt(0).toUpperCase() +
															post.platform.slice(1)}
													</span>
												</div>

												<div
													className={`relative inline-flex items-center px-3 py-2 rounded-xl font-heading text-xs font-semibold backdrop-blur-sm border ${
														post.status === "draft"
															? "bg-gradient-to-r from-slate-100/90 to-slate-200/90 text-slate-700 border-slate-300/40 shadow-slate-200/30"
															: post.status === "scheduled"
															? "bg-gradient-to-r from-amber-100/90 to-orange-200/90 text-amber-800 border-amber-300/40 shadow-amber-200/30"
															: post.status === "published"
															? "bg-gradient-to-r from-emerald-100/90 to-teal-200/90 text-emerald-800 border-emerald-300/40 shadow-emerald-200/30"
															: "bg-gradient-to-r from-red-100/90 to-rose-200/90 text-red-800 border-red-300/40 shadow-red-200/30"
													} shadow-lg hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300`}
												>
													<div
														className={`absolute inset-0 rounded-xl opacity-30 ${
															post.status === "draft"
																? "bg-gradient-to-r from-white/5 to-transparent"
																: post.status === "scheduled"
																? "bg-gradient-to-r from-white/10 to-transparent"
																: post.status === "published"
																? "bg-gradient-to-r from-white/10 to-transparent"
																: "bg-gradient-to-r from-white/10 to-transparent"
														}`}
													></div>
													<div
														className={`w-2 h-2 rounded-full mr-2 relative z-10 ${
															post.status === "draft"
																? "bg-gray-400"
																: post.status === "scheduled"
																? "bg-amber-300 animate-pulse"
																: post.status === "published"
																? "bg-emerald-300"
																: "bg-red-300"
														}`}
													></div>
													<span className="relative z-10 tracking-wide">
														{post.status.charAt(0).toUpperCase() +
															post.status.slice(1)}
													</span>
												</div>
											</div>

											<div className="mb-3 flex-shrink-0 relative">
												<div className="rounded-xl overflow-hidden h-40 relative group/image">
													<SafeImage
														src={post.imageUrl}
														alt="Post preview"
														className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
														fallbackClassName="w-full h-full"
														darkMode={false}
														onError={() => {
															setImageErrors((prev) => ({
																...prev,
																[post.id]: true,
															}));
														}}
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
												</div>
											</div>

											<div className="flex-1 flex flex-col">
												<div className="h-[4.2rem] mb-3 flex-shrink-0">
													<p
														className="font-body text-sm text-slate-800 leading-relaxed overflow-hidden font-medium h-full"
														style={{
															display: "-webkit-box",
															WebkitLineClamp: 3,
															WebkitBoxOrient: "vertical",
															lineHeight: "1.4rem",
														}}
													>
														{post.content}
													</p>
												</div>

												<div className="flex items-center font-body text-xs text-slate-600 mb-3 bg-gradient-to-r from-slate-100/80 to-slate-50/50 rounded-lg px-3 py-2 backdrop-blur-sm border border-slate-200/50">
													<CalendarIcon
														className={`w-3.5 h-3.5 mr-2 ${
															post.status === "scheduled"
																? "text-amber-400"
																: post.status === "published"
																? "text-emerald-400"
																: "text-slate-500"
														}`}
													/>
													<span className="font-medium">
														{formatDate(post.scheduledFor)}
													</span>
												</div>

												{post.status === "draft" && post.nextAction && (
													<div className="flex items-center font-body text-xs text-blue-600 mb-3 bg-gradient-to-r from-blue-50/80 to-blue-100/50 rounded-lg px-3 py-2 backdrop-blur-sm border border-blue-200/50">
														{post.nextAction === "publish" ? (
															<>
																<PlayIcon className="w-3.5 h-3.5 mr-2 text-blue-500" />
																<span className="font-medium">
																	Will publish at scheduled time
																</span>
															</>
														) : (
															<>
																<SendIcon className="w-3.5 h-3.5 mr-2 text-blue-500" />
																<span className="font-medium">
																	Will move to scheduled at scheduled time
																</span>
															</>
														)}
													</div>
												)}

												{post.status === "published" && (
													<div className="flex items-center justify-between font-body text-xs text-slate-600 mb-3 bg-gradient-to-r from-slate-50/80 to-white/60 rounded-xl px-4 py-3 backdrop-blur-sm border border-slate-200/40">
														<div className="flex items-center space-x-6">
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	handleLike(post.id);
																}}
																className={`flex items-center group transition-all duration-200 relative hover:scale-110 cursor-pointer ${
																	post.liked
																		? "text-red-400"
																		: "text-slate-500 hover:text-red-500"
																}`}
															>
																<HeartIcon
																	className={`w-4 h-4 mr-1.5 transition-all ${
																		post.liked
																			? "text-red-400 fill-red-400 scale-110"
																			: "group-hover:scale-110"
																	}`}
																/>
																<span className="font-heading font-bold">
																	{post.likes}
																</span>
																<LikeAnimation
																	show={likeAnimations[post.id]}
																	darkMode={false}
																/>
															</button>
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	handleComment(post.id);
																}}
																className="flex items-center group hover:text-blue-400 transition-all duration-200 hover:scale-110 cursor-pointer"
															>
																<MessageIcon className="w-4 h-4 mr-1.5 text-blue-400 transition-all group-hover:scale-110" />
																<span className="font-heading font-bold">
																	{post.comments}
																</span>
															</button>
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	handleShare(post.id);
																}}
																className="flex items-center group hover:text-green-400 transition-all duration-200 hover:scale-110 cursor-pointer"
															>
																<ShareIcon className="w-4 h-4 mr-1.5 text-green-400 transition-all group-hover:scale-110" />
																<span className="font-heading font-bold">
																	{post.shares}
																</span>
															</button>
														</div>
													</div>
												)}

												<div className="flex-1 min-h-[1rem]"></div>

												<div className="flex justify-between items-center mt-auto pt-3 border-t border-opacity-20 border-gray-400">
													<div className="flex items-center font-body text-xs text-slate-600 bg-gradient-to-r from-slate-100/60 to-slate-50/40 rounded-lg px-3 py-1.5 backdrop-blur-sm">
														{post.status === "draft" && (
															<ClockIcon className="w-3.5 h-3.5 mr-2 text-amber-400" />
														)}
														{post.status === "scheduled" && (
															<CalendarIcon className="w-3.5 h-3.5 mr-2 text-blue-400" />
														)}
														{post.status === "published" && (
															<CheckCircleIcon className="w-3.5 h-3.5 mr-2 text-emerald-400" />
														)}
														{post.status === "failed" && (
															<AlertCircleIcon className="w-3.5 h-3.5 mr-2 text-red-400" />
														)}
														<span className="font-medium">
															{post.status === "draft"
																? "Draft"
																: post.status === "scheduled"
																? "Scheduled"
																: post.status === "published"
																? "Published"
																: "Failed"}
														</span>
													</div>

													<div
														className={`flex space-x-0.5 sm:space-x-1 transition-all duration-300 ${
															hoveredCard === post.id
																? "opacity-100 scale-100"
																: "opacity-0 scale-95"
														}`}
													>
														{post.status === "draft" && (
															<>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleAction(post.id, "publish");
																	}}
																	disabled={loading[post.id]}
																	className="p-1.5 sm:p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-110 active:scale-95 shadow-lg hover:shadow-green-500/20 cursor-pointer"
																	title="Publish Now"
																>
																	<PlayIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleAction(post.id, "schedule");
																	}}
																	className="p-1.5 sm:p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-blue-500/20 cursor-pointer"
																	title="Schedule Post"
																>
																	<SendIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
																</button>
															</>
														)}
														{post.status === "scheduled" && (
															<>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleAction(post.id, "publish");
																	}}
																	disabled={loading[post.id]}
																	className="p-1.5 sm:p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-110 active:scale-95 shadow-lg hover:shadow-green-500/20 cursor-pointer"
																	title="Publish Now"
																>
																	<PlayIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleUnschedule(post.id);
																	}}
																	disabled={loading[post.id]}
																	className="p-1.5 sm:p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-110 active:scale-95 shadow-lg hover:shadow-yellow-500/20 cursor-pointer"
																	title="Unschedule (Set to Draft)"
																>
																	<ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
																</button>
															</>
														)}
														{post.status === "published" && null}
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleAction(post.id, "preview");
															}}
															className="p-1.5 sm:p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-purple-500/20 cursor-pointer"
															title="Preview Post"
														>
															<EyeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleAction(post.id, "edit");
															}}
															className="p-1.5 sm:p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
															title="Edit Post"
														>
															<EditIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleAction(post.id, "delete");
															}}
															className="p-1.5 sm:p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-red-500/20 cursor-pointer"
															title="Delete Post"
														>
															<TrashIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
														</button>
													</div>
												</div>
											</div>

											{loading[post.id] && (
												<div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
													<div className="w-8 h-8 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin"></div>
												</div>
											)}
										</div>
									</>
								)}
							</div>
						))}
					</div>

					{posts.length === 0 && (
						<div className="text-center py-12">
							<CalendarIcon className="w-20 h-20 mx-auto mb-6" />
							<h3 className="text-xl font-bold mb-2 text-slate-800">
								No Posts Yet
							</h3>
							<p className="text-slate-600">
								Create your first post to get started!
							</p>
						</div>
					)}
				</div>
			</div>

			<Footer
				darkMode={darkMode}
				newsletterEmail={newsletterEmail}
				onNewsletterEmailChange={setNewsletterEmail}
				onNewsletterSubmit={handleNewsletterSubmit}
				isSubscribing={isSubscribing}
			/>

			<MobileSidebar
				isOpen={mobileSidebarOpen}
				onClose={() => setMobileSidebarOpen(false)}
				darkMode={darkMode}
				activeSection={activeSection}
				onNavigate={scrollToSection}
			/>

			{newsletterToasts.map((toast) => (
				<NewsletterToast
					key={toast.id}
					toast={toast}
					darkMode={darkMode}
					onClose={closeNewsletterToast}
				/>
			))}
			<style jsx>{`
				button,
				a {
					cursor: pointer;
				}
			`}</style>
		</div>
	);
};

export default SocialMediaScheduler;
