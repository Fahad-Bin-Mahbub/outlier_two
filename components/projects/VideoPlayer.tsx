"use client";
import React, {
	useState,
	useRef,
	useEffect,
	ChangeEvent,
	useCallback,
	useMemo,
	createContext,
	useContext,
} from "react";
import {
	Search,
	Upload,
	Play,
	Pause,
	Volume2,
	Maximize,
	Heart,
	Share2,
	MessageCircle,
	TrendingUp,
	Clock,
	Eye,
	User,
	Home,
	Compass,
	Bookmark,
	Settings,
	X,
	Send,
	Filter,
	Grid3X3,
	List,
	Star,
	ThumbsUp,
	MoreVertical,
	ChevronDown,
	ChevronUp,
	Loader2,
} from "lucide-react";


const createTheme = (isDark = false) => ({
	primary: isDark ? "#8BA6E9" : "#6C8CE9",
	secondary: isDark ? "#DE8FDE" : "#D16AD1",
	accent: isDark ? "#77D1AA" : "#5ED3A2",
	bg: isDark ? "#161625" : "#ECEDF5",
	surface: isDark ? "#1E1E30" : "#F0F2FA",
	cream: isDark ? "#1C1C35" : "#FFF7F0",
	pink: isDark ? "#9A6B96" : "#FCCFE8",
	blue: isDark ? "#5586D9" : "#A6C8FF",
	mint: isDark ? "#5AA785" : "#C2F2E3",
	shadow: isDark ? "rgba(0, 0, 0, 0.45)" : "rgba(163, 177, 198, 0.5)",
	shadowLight: isDark
		? "rgba(255, 255, 255, 0.04)"
		: "rgba(255, 255, 255, 0.8)",
	glassOverlay: isDark ? "rgba(30, 30, 48, 0.75)" : "rgba(255, 255, 255, 0.6)",
	gradient: {
		primary: isDark
			? "linear-gradient(120deg, #9BA3EB, #8BA6E9)"
			: "linear-gradient(120deg, #7B97EC, #6C8CE9)",
		secondary: isDark
			? "linear-gradient(120deg, #DE8FDE, #CB6ECB)"
			: "linear-gradient(120deg, #D16AD1, #C655C6)",
		accent: isDark
			? "linear-gradient(120deg, #77D1AA, #5AC294)"
			: "linear-gradient(120deg, #5ED3A2, #49BE8D)",
		surface: isDark
			? "linear-gradient(145deg, #20203A, #1A1A2E)"
			: "linear-gradient(145deg, #F4F6FD, #E6EAFC)",
	},
	text: {
		primary: isDark ? "#E6E7FF" : "#2D2F48",
		secondary: isDark ? "#B9BACE" : "#4B4D68",
		muted: isDark ? "#8285A5" : "#6E738A",
		light: isDark ? "#575979" : "#9CA3BC",
		onPrimary: "#FFFFFF",
		onAccent: isDark ? "#1A1A2E" : "#FFFFFF",
	},
	neomorphism: {
		flat: isDark
			? "6px 6px 12px rgba(0, 0, 0, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.04)"
			: "6px 6px 12px rgba(163, 177, 198, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.8)",
		pressed: isDark
			? "inset 2px 2px 5px rgba(0, 0, 0, 0.7), inset -2px -2px 5px rgba(255, 255, 255, 0.05)"
			: "inset 2px 2px 5px rgba(163, 177, 198, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
		concave: isDark
			? "inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.04)"
			: "inset 6px 6px 12px rgba(163, 177, 198, 0.4), inset -6px -6px 12px rgba(255, 255, 255, 0.8)",
		convex: isDark
			? "6px 6px 12px rgba(0, 0, 0, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.04), inset 1px 1px 0 rgba(255, 255, 255, 0.05), inset -1px -1px 0 rgba(0, 0, 0, 0.5)"
			: "6px 6px 12px rgba(163, 177, 198, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.8), inset 1px 1px 0 rgba(255, 255, 255, 0.8), inset -1px -1px 0 rgba(163, 177, 198, 0.4)",
		highlight: isDark
			? "inset 1px 1px 2px rgba(255, 255, 255, 0.08)"
			: "inset 1px 1px 2px rgba(255, 255, 255, 1)",
		active: isDark
			? "0 0 10px rgba(139, 166, 233, 0.6), 0 0 20px rgba(139, 166, 233, 0.2)"
			: "0 0 10px rgba(108, 140, 233, 0.6), 0 0 20px rgba(108, 140, 233, 0.2)",
	},
});


const customCss = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(108, 140, 233, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(108, 140, 233, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(108, 140, 233, 0);
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.hover-glow {
  transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 15px rgba(108, 140, 233, 0.5);
}
`;


interface Comment {
	id: string;
	user: string;
	avatar: string;
	text: string;
	createdAt: Date;
	likes?: number;
}

interface Video {
	id: string;
	url: string;
	title: string;
	description: string;
	tags: string[];
	category: string;
	uploadedAt: Date;
	comments: Comment[];
	views: number;
	likes?: number;
	user: string;
	duration?: string;
}

interface UserSettings {
	darkMode: boolean;
	autoPlay: boolean;
}

interface UserProfile {
	email: string;
	name: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}


const ToastContext = createContext<{
  showToast: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children, theme }: { children: React.ReactNode, theme: any }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {}
      <div className="fixed bottom-6 right-6 z-50 space-y-4 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-500 animate-slide-in"
            style={{
              background: theme.surface,
              boxShadow: theme.neomorphism.flat,
              borderLeft: `4px solid ${
                toast.type === "error" 
                  ? "#FF5A5A" 
                  : toast.type === "success" 
                  ? theme.accent 
                  : toast.type === "warning"
                  ? "#FFB547"
                  : theme.primary
              }`,
            }}
          >
            <p style={{ color: theme.text.primary }}>{toast.message}</p>
            <button
              onClick={() => 
                setToasts((prev) => 
                  prev.filter((t) => t.id !== toast.id)
                )
              }
              className="ml-4 p-1 rounded-full hover:bg-opacity-10 hover:bg-white"
            >
              <X className="w-4 h-4" style={{ color: theme.text.muted }} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};


const initialVideoData: Video[] = [
	{
		id: "1",
		url: "https://www.w3schools.com/html/mov_bbb.mp4",
		title: "Big Buck Bunny - Animated Short Film",
		description:
			"Watch this delightful animated short film featuring Big Buck Bunny. A fun and entertaining piece of animation that showcases modern 3D animation techniques.",
		tags: ["animation", "entertainment", "3d", "short"],
		category: "Entertainment",
		uploadedAt: new Date(Date.now() - 86400000),
		comments: [
			{
				id: "c1",
				user: "Sarah M",
				avatar: "",
				text: "Love the animation quality!",
				createdAt: new Date(Date.now() - 3600000),
				likes: 12,
			},
			{
				id: "c2",
				user: "DevGuy42",
				avatar: "",
				text: "Classic animated short, never gets old",
				createdAt: new Date(Date.now() - 7200000),
				likes: 8,
			},
		],
		views: 15420,
		likes: 234,
		user: "AnimationStudio",
		duration: "9:56",
	},
	{
		id: "2",
		url: "https://www.w3schools.com/html/movie.mp4",
		title: "Wildlife Documentary: Bears in Their Natural Habitat",
		description:
			"Observe magnificent bears in their natural environment. This wildlife documentary captures the beauty and power of these amazing creatures in the wild.",
		tags: ["wildlife", "nature", "bears", "documentary"],
		category: "Nature",
		uploadedAt: new Date(Date.now() - 172800000),
		comments: [
			{
				id: "c3",
				user: "NatureLover",
				avatar: "",
				text: "Amazing footage of these beautiful creatures!",
				createdAt: new Date(Date.now() - 14400000),
				likes: 15,
			},
		],
		views: 8750,
		likes: 187,
		user: "WildlifeFilms",
		duration: "5:30",
	},
	{
		id: "3",
		url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		title: "Creative Animation Showcase",
		description:
			"Discover the art of modern animation in this creative showcase. See how talented animators bring characters and stories to life through digital artistry.",
		tags: ["animation", "creative", "art", "digital"],
		category: "Entertainment",
		uploadedAt: new Date(Date.now() - 432000000),
		comments: [
			{
				id: "c4",
				user: "ArtLover",
				avatar: "",
				text: "The creativity is amazing!",
				createdAt: new Date(Date.now() - 86400000),
				likes: 7,
			},
		],
		views: 4150,
		likes: 76,
		user: "CreativeStudios",
		duration: "9:43",
	},
];


const formatNumber = (num: number): string => {
	if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
	if (num >= 1000) return (num / 1000).toFixed(1) + "K";
	return num.toString();
};

const formatTime = (seconds: number): string => {
	if (!seconds || isNaN(seconds)) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const timeAgo = (date: Date): string => {
	const now = new Date();
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diff < 60) return `${diff}s ago`;
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
	if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
	return `${Math.floor(diff / 31536000)}y ago`;
};


const useVideoData = () => {
	const [videos, setVideos] = useState<Video[]>(initialVideoData);
	
	const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

	const updateVideoViews = useCallback((videoId: string) => {
		setVideos((prev) =>
			prev.map((v) => (v.id === videoId ? { ...v, views: v.views + 1 } : v))
		);
	}, []);

	const updateVideoLikes = useCallback(
		(videoId: string) => {
			setVideos((prev) =>
				prev.map((v) => {
					if (v.id === videoId) {
						
						const isLiked = likedVideos.has(videoId);

						
						if (isLiked) {
							setLikedVideos((prev) => {
								const newSet = new Set(prev);
								newSet.delete(videoId);
								return newSet;
							});
							
							return { ...v, likes: Math.max(0, (v.likes || 0) - 1) };
						} else {
							setLikedVideos((prev) => {
								const newSet = new Set(prev);
								newSet.add(videoId);
								return newSet;
							});
							
							return { ...v, likes: (v.likes || 0) + 1 };
						}
					}
					return v;
				})
			);
		},
		[likedVideos]
	);

	
	const isVideoLiked = useCallback(
		(videoId: string) => {
			return likedVideos.has(videoId);
		},
		[likedVideos]
	);

	const addComment = useCallback(
		(videoId: string, user: string, text: string) => {
			const newComment: Comment = {
				id: `c${Date.now()}`,
				user,
				avatar: "",
				text,
				createdAt: new Date(),
				likes: 0,
			};

			setVideos((prev) =>
				prev.map((v) =>
					v.id === videoId
						? {
								...v,
								comments: [newComment, ...v.comments],
						  }
						: v
				)
			);
		},
		[]
	);

	const addVideo = useCallback((videoData: any) => {
		const newVideo: Video = {
			id: `vid_${Date.now()}`,
			url: URL.createObjectURL(videoData.file),
			title: videoData.title,
			description: videoData.description,
			tags: videoData.tags,
			category: videoData.category,
			uploadedAt: new Date(),
			comments: [],
			views: 0,
			likes: 0,
			user: videoData.user,
			duration: "0:00",
		};

		setVideos((prev) => [newVideo, ...prev]);
		return newVideo.id;
	}, []);

	return {
		videos,
		updateVideoViews,
		updateVideoLikes,
		addComment,
		addVideo,
		isVideoLiked,
	};
};

const useUserPreferences = () => {
	const [settings, setSettings] = useState<UserSettings>({
		darkMode: false,
		autoPlay: false,
	});

	const [user, setUser] = useState<UserProfile | null>(null);
	const [viewHistory, setViewHistory] = useState<string[]>([]);
	const [favorites, setFavorites] = useState<string[]>([]);

	const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
		setSettings((prev) => ({ ...prev, ...newSettings }));
	}, []);

	const login = useCallback((email: string, password: string) => {
		try {
			const name = email.split("@")[0];
			setUser({ email, name });
			return true;
		} catch (error) {
			console.error("Login failed:", error);
			return false;
		}
	}, []);

	const logout = useCallback(() => {
		setUser(null);
	}, []);

	const addToHistory = useCallback((videoId: string) => {
		setViewHistory((prev) => {
			const updated = [videoId, ...prev.filter((id) => id !== videoId)];
			return updated.slice(0, 15);
		});
	}, []);

	const toggleFavorite = useCallback((videoId: string) => {
		setFavorites((prev) =>
			prev.includes(videoId)
				? prev.filter((id) => id !== videoId)
				: [...prev, videoId]
		);
	}, []);

	return {
		settings,
		user,
		viewHistory,
		favorites,
		updateSettings,
		login,
		logout,
		addToHistory,
		toggleFavorite,
	};
};


const NeumorphicBox: React.FC<{
	children: React.ReactNode;
	variant?: "flat" | "pressed" | "concave" | "convex";
	className?: string;
	onClick?: () => void;
	style?: React.CSSProperties;
	active?: boolean;
	theme: any;
}> = ({
	children,
	variant = "flat",
	className = "",
	onClick,
	style = {},
	active = false,
	theme,
}) => {
	const boxShadow =
		theme.neomorphism[variant] +
		(active ? `, ${theme.neomorphism.active}` : "");

	return (
		<div
			className={`rounded-2xl transition-all duration-300 ${className} ${
				onClick ? "cursor-pointer hover:scale-[1.03]" : ""
			}`}
			onClick={onClick}
			style={{
				background:
					variant === "convex" ? theme.gradient.surface : theme.surface,
				boxShadow,
				...style,
			}}
		>
			{children}
		</div>
	);
};

const NeumorphicButton: React.FC<{
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	style?: React.CSSProperties;
	variant?: "primary" | "secondary" | "accent" | "neutral";
	size?: "sm" | "md" | "lg";
	icon?: boolean;
	active?: boolean;
	disabled?: boolean;
	theme: any;
  type?: "button" | "submit" | "reset";
}> = ({
	children,
	onClick,
	className = "",
	style = {},
	variant = "neutral",
	size = "md",
	icon = false,
	active = false,
	disabled = false,
	theme,
  type = "button",
}) => {
	const getSize = () => {
		if (icon) {
			switch (size) {
				case "sm":
					return "p-2";
				case "lg":
					return "p-4";
				default:
					return "p-3";
			}
		}

		switch (size) {
			case "sm":
				return "px-3 py-2 text-sm";
			case "lg":
				return "px-6 py-3 text-lg";
			default:
				return "px-4 py-2.5";
		}
	};

	const getVariantStyle = () => {
		if (disabled) {
			return {
				background: theme.surface,
				color: theme.text.light,
				boxShadow: theme.neomorphism.flat,
				opacity: 0.7,
				cursor: "not-allowed",
			};
		}

		switch (variant) {
			case "primary":
				return {
					background: theme.gradient.primary,
					color: theme.text.onPrimary,
					boxShadow: active
						? theme.neomorphism.pressed + `, ${theme.neomorphism.active}`
						: theme.neomorphism.flat,
				};
			case "secondary":
				return {
					background: theme.gradient.secondary,
					color: theme.text.onPrimary,
					boxShadow: active
						? theme.neomorphism.pressed + `, ${theme.neomorphism.active}`
						: theme.neomorphism.flat,
				};
			case "accent":
				return {
					background: theme.gradient.accent,
					color: theme.text.onAccent,
					boxShadow: active
						? theme.neomorphism.pressed + `, ${theme.neomorphism.active}`
						: theme.neomorphism.flat,
				};
			default:
				return {
					background: theme.surface,
					color: theme.text.primary,
					boxShadow: active
						? theme.neomorphism.pressed + `, ${theme.neomorphism.active}`
						: theme.neomorphism.flat,
				};
		}
	};

	return (
		<button
			type={type}
			onClick={disabled ? undefined : onClick}
			className={`rounded-xl font-medium flex items-center justify-center transition-all duration-300 ${getSize()} ${className} ${
				active ? "scale-95" : "hover:scale-105"
			} ${disabled ? "" : "active:scale-95"}`}
			style={{
				...getVariantStyle(),
				...style,
			}}
			disabled={disabled}
		>
			{children}
		</button>
	);
};


const HeroSection = ({ theme, onSearch }: { theme: any, onSearch: (query: string) => void }) => {
  const [searchValue, setSearchValue] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
  };
  
  return (
    <NeumorphicBox 
      className="my-8 overflow-hidden relative" 
      theme={theme}
      style={{
        background: `linear-gradient(135deg, ${theme.cream}, ${theme.pink})`,
      }}
    >
      <div className="relative z-10 py-16 px-8 md:px-16 flex flex-col items-center text-center">
        <h1 
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ color: theme.text.primary }}
        >
          Discover, Share, and <span style={{ color: theme.primary }}>Create</span>
        </h1>
        <p 
          className="text-xl md:text-2xl max-w-3xl mb-10"
          style={{ color: theme.text.secondary }}
        >
          Your premier destination for amazing video content from creators around the world.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-10">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6"
              style={{ color: theme.text.muted }}
            />
            <input
              type="text"
              placeholder="What do you want to watch today?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl text-lg focus:outline-none transition-all duration-300 group-hover:scale-[1.02] focus:scale-[1.02]"
              style={{
                background: theme.surface,
                boxShadow: `${theme.neomorphism.flat}, 0 10px 30px ${theme.shadow}`,
                border: "none",
                color: theme.text.primary,
              }}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-white font-semibold"
              style={{
                background: theme.gradient.primary,
                boxShadow: theme.neomorphism.flat,
              }}
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="flex flex-wrap justify-center gap-4">
          <div 
            className="flex items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full px-5 py-2.5 text-sm"
            style={{ color: theme.text.primary }}
          >
            <Play className="w-5 h-5 mr-2" />
            100K+ Videos
          </div>
          <div 
            className="flex items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full px-5 py-2.5 text-sm"
            style={{ color: theme.text.primary }}
          >
            <User className="w-5 h-5 mr-2" />
            20K+ Creators
          </div>
          <div 
            className="flex items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full px-5 py-2.5 text-sm"
            style={{ color: theme.text.primary }}
          >
            <Eye className="w-5 h-5 mr-2" />
            50M+ Monthly Views
          </div>
        </div>
      </div>
      
      {}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
        style={{ background: `linear-gradient(120deg, ${theme.primary}, ${theme.secondary})` }}
      ></div>
      <div 
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10"
        style={{ background: `linear-gradient(120deg, ${theme.accent}, ${theme.primary})` }}
      ></div>
    </NeumorphicBox>
  );
};

const FeaturedCreators = ({ theme }: { theme: any }) => {
  const { showToast } = useToast();
  
  const creators = [
    { id: 1, name: "Alex Studio", subscribers: "1.2M", category: "Technology", avatar: "A" },
    { id: 2, name: "Nature World", subscribers: "890K", category: "Nature", avatar: "N" },
    { id: 3, name: "Music Vibes", subscribers: "2.5M", category: "Music", avatar: "M" },
    { id: 4, name: "Gaming Pro", subscribers: "3.7M", category: "Gaming", avatar: "G" },
  ];
  
  const handleFollowClick = (name: string) => {
    showToast(`You are now following ${name}!`, "success");
  };
  
  return (
    <section className="my-16">
      <div className="flex justify-between items-center mb-8">
        <h2 
          className="text-3xl font-bold"
          style={{ color: theme.text.primary }}
        >
          Featured Creators
        </h2>
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            showToast("View all creators would open here", "info");
          }}
          className="flex items-center transition-all hover:scale-105"
          style={{ color: theme.primary }}
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {creators.map((creator) => (
          <NeumorphicBox 
            key={creator.id} 
            variant="convex" 
            className="p-6 flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.03] cursor-pointer"
            theme={theme}
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-2xl font-bold"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                color: "white",
                boxShadow: theme.neomorphism.convex
              }}
            >
              {creator.avatar}
            </div>
            <h3 
              className="text-xl font-bold mb-1"
              style={{ color: theme.text.primary }}
            >
              {creator.name}
            </h3>
            <p 
              className="text-sm mb-3"
              style={{ color: theme.text.muted }}
            >
              {creator.category}
            </p>
            <p 
              className="font-medium mb-6"
              style={{ color: theme.text.secondary }}
            >
              {creator.subscribers} subscribers
            </p>
            <NeumorphicButton
              onClick={() => handleFollowClick(creator.name)}
              variant="primary"
              className="w-full"
              theme={theme}
            >
              Follow
            </NeumorphicButton>
          </NeumorphicBox>
        ))}
      </div>
    </section>
  );
};

const AppFeatures = ({ theme }: { theme: any }) => {
  const features = [
    {
      icon: "🎬",
      title: "High-Quality Streaming",
      description: "Enjoy smooth streaming with adaptive quality up to 4K resolution."
    },
    {
      icon: "🔍",
      title: "Smart Discovery",
      description: "Our algorithm learns what you like to recommend perfect content."
    },
    {
      icon: "🔄",
      title: "Cross-Device Sync",
      description: "Start watching on one device and continue seamlessly on another."
    },
    {
      icon: "📱",
      title: "Mobile Experience",
      description: "Take your favorite videos wherever you go with our mobile app."
    }
  ];
  
  return (
    <section className="my-20">
      <h2 
        className="text-3xl font-bold text-center mb-12"
        style={{ color: theme.text.primary }}
      >
        Why Choose VideoHub
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((feature, index) => (
          <NeumorphicBox
            key={index}
            variant="flat"
            className="p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105"
            theme={theme}
          >
            <div 
              className="text-4xl mb-4 w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: theme.surface,
                boxShadow: theme.neomorphism.convex,
              }}
            >
              {feature.icon}
            </div>
            <h3 
              className="text-xl font-bold mb-3"
              style={{ color: theme.text.primary }}
            >
              {feature.title}
            </h3>
            <p style={{ color: theme.text.secondary }}>
              {feature.description}
            </p>
          </NeumorphicBox>
        ))}
      </div>
    </section>
  );
};

const Footer = ({ theme }: { theme: any }) => {
  const { showToast } = useToast();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Thanks for subscribing to our newsletter!", "success");
  };
  
  const handleLinkClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    showToast(`${label} page would open here`, "info");
  };
  
  return (
    <footer
      style={{
        background: theme.surface,
        boxShadow: `0 -8px 30px ${theme.shadow}`,
        borderTop: `1px solid ${theme.shadowLight}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: theme.gradient.primary,
                  boxShadow: theme.neomorphism.convex,
                }}
              >
                <Play className="w-5 h-5 text-white fill-current" />
              </div>
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: theme.text.primary }}
              >
                VideoHub
              </span>
            </div>
            <p style={{ color: theme.text.secondary }}>
              Share and discover amazing videos from creators around the world.
            </p>
            <div className="flex space-x-4 pt-2">
              {["Twitter", "Facebook", "Instagram", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  onClick={(e) => handleLinkClick(e, social)}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    background: theme.surface,
                    boxShadow: theme.neomorphism.flat,
                    color: theme.text.primary,
                  }}
                >
                  {social === "Twitter" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>}
                  {social === "Facebook" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>}
                  {social === "Instagram" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
                  {social === "YouTube" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>}
                </a>
              ))}
            </div>
          </div>
          
          {}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-6" style={{ color: theme.text.primary }}>
              Explore
            </h3>
            <ul className="space-y-4">
              {["Trending", "New Uploads", "Categories", "Live Streams", "Premium Content"].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    onClick={(e) => handleLinkClick(e, link)}
                    className="transition-colors hover:scale-105 inline-block"
                    style={{ color: theme.text.secondary }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-6" style={{ color: theme.text.primary }}>
              Company
            </h3>
            <ul className="space-y-4">
              {["About Us", "Careers", "Press", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    onClick={(e) => handleLinkClick(e, link)}
                    className="transition-colors hover:scale-105 inline-block"
                    style={{ color: theme.text.secondary }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-6" style={{ color: theme.text.primary }}>
              Stay Updated
            </h3>
            <p className="mb-4" style={{ color: theme.text.secondary }}>
              Subscribe to our newsletter for the latest updates and featured content.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
                style={{
                  background: theme.surface,
                  boxShadow: theme.neomorphism.concave,
                  border: "none",
                  color: theme.text.primary,
                }}
                required
              />
              <NeumorphicButton
                type="submit"
                variant="accent"
                className="w-full"
                theme={theme}
              >
                Subscribe
              </NeumorphicButton>
            </form>
          </div>
        </div>
        
        {}
        <div 
          className="pt-12 mt-12 border-t flex flex-col md:flex-row justify-between items-center" 
          style={{ borderColor: theme.shadowLight }}
        >
          <p style={{ color: theme.text.muted }} className="mb-4 md:mb-0">
            © 2025 VideoHub. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center space-x-6">
            {["Terms", "Privacy", "Cookies", "FAQ", "Help"].map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => handleLinkClick(e, link)}
                className="text-sm hover:scale-105 transition-transform"
                style={{ color: theme.text.muted }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};


const VideoPlayer: React.FC<{
	video: Video;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	theme: any;
	autoPlay: boolean;
}> = React.memo(({ video, isLoading, setIsLoading, theme, autoPlay }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(1);
	const [showControls, setShowControls] = useState(true);

	useEffect(() => {
		const vid = videoRef.current;
		if (!vid) return;

		const handleLoadedData = () => {
			setIsLoading(false);
			setDuration(vid.duration);
			if (autoPlay) {
				vid.play().catch((err) => {
					console.warn("Autoplay failed:", err);
				});
				setIsPlaying(true);
			}
		};

		const handleTimeUpdate = () => {
			if (vid.duration) {
				setCurrentTime(vid.currentTime);
				setProgress((vid.currentTime / vid.duration) * 100);
			}
		};

		const handleWaiting = () => setIsLoading(true);
		const handleCanPlay = () => setIsLoading(false);
		const handleError = (e: Event) => {
			console.error("Video loading error:", e);
			setIsLoading(false);
		};

		vid.addEventListener("loadeddata", handleLoadedData);
		vid.addEventListener("timeupdate", handleTimeUpdate);
		vid.addEventListener("waiting", handleWaiting);
		vid.addEventListener("canplay", handleCanPlay);
		vid.addEventListener("error", handleError);

		return () => {
			vid.removeEventListener("loadeddata", handleLoadedData);
			vid.removeEventListener("timeupdate", handleTimeUpdate);
			vid.removeEventListener("waiting", handleWaiting);
			vid.removeEventListener("canplay", handleCanPlay);
			vid.removeEventListener("error", handleError);
		};
	}, [video.url, setIsLoading, autoPlay]);

	const togglePlay = useCallback(() => {
		if (videoRef.current) {
			try {
				if (isPlaying) {
					videoRef.current.pause();
				} else {
					videoRef.current.play();
				}
				setIsPlaying(!isPlaying);
			} catch (error) {
				console.error("Playback error:", error);
			}
		}
	}, [isPlaying]);

	const handleProgressClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (videoRef.current && duration) {
				const rect = e.currentTarget.getBoundingClientRect();
				const percent = (e.clientX - rect.left) / rect.width;
				const newTime = percent * duration;
				videoRef.current.currentTime = newTime;
			}
		},
		[duration]
	);

	const handleFullscreen = useCallback(() => {
		if (videoRef.current) {
			try {
				if (document.fullscreenElement) {
					document.exitFullscreen();
				} else {
					videoRef.current.requestFullscreen();
				}
			} catch (error) {
				console.error("Fullscreen error:", error);
			}
		}
	}, []);

	const handleVolumeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newVol = parseFloat(e.target.value);
			setVolume(newVol);
			if (videoRef.current) {
				videoRef.current.volume = newVol;
			}
		},
		[]
	);

	return (
		<div
			className="relative bg-black aspect-video group cursor-pointer overflow-hidden rounded-t-2xl"
			onClick={togglePlay}
			onMouseEnter={() => setShowControls(true)}
			onMouseLeave={() => setShowControls(false)}
		>
			{isLoading && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 backdrop-blur-sm">
					<div className="flex flex-col items-center space-y-4">
						<Loader2 className="w-12 h-12 animate-spin text-white" />
						<p className="text-white text-sm">Loading video...</p>
					</div>
				</div>
			)}

			<video
				ref={videoRef}
				src={video.url}
				className="w-full h-full object-cover"
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
				preload="metadata"
			/>

			<div
				className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 transition-all duration-300 ${
					showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
				}`}
			>
				<div
					className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4 group/progress relative overflow-hidden"
					onClick={handleProgressClick}
				>
					{}
					<div className="absolute inset-0 rounded-full backdrop-blur-sm bg-white/10"></div>

					{}
					<div
						className="h-full rounded-full transition-all duration-100 group-hover/progress:h-3 relative"
						style={{
							width: `${progress}%`,
							background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
							boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
						}}
					>
						{}
						<div
							className="absolute inset-0 rounded-full opacity-50"
							style={{
								background:
									"linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
							}}
						></div>
					</div>
				</div>

				<div className="flex items-center justify-between text-white">
					<div className="flex items-center space-x-6">
						<button
							onClick={(e) => {
								e.stopPropagation();
								togglePlay();
							}}
							className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-glow active:scale-95"
							aria-label={isPlaying ? "Pause" : "Play"}
							style={{
								boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
								background: "rgba(255, 255, 255, 0.1)",
								backdropFilter: "blur(4px)",
							}}
						>
							{isPlaying ? (
								<Pause className="w-6 h-6" />
							) : (
								<Play className="w-6 h-6 fill-current" />
							)}
						</button>

						<div
							className="flex items-center space-x-3"
							onClick={(e) => e.stopPropagation()}
						>
							<Volume2 className="w-5 h-5" />
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={volume}
								onChange={handleVolumeChange}
								onMouseDown={(e) => e.stopPropagation()}
								onMouseUp={(e) => e.stopPropagation()}
								className="w-24 volume-slider"
								aria-label="Volume"
								style={{
									
									appearance: "none",
									height: "4px",
									borderRadius: "2px",
									background: `linear-gradient(to right, white ${
										volume * 100
									}%, rgba(255, 255, 255, 0.3) ${volume * 100}%)`,
								}}
							/>
						</div>

						<span className="text-sm font-medium">
							{formatTime(currentTime)} / {formatTime(duration)}
						</span>
					</div>

					<button
						onClick={(e) => {
							e.stopPropagation();
							handleFullscreen();
						}}
						className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-glow active:scale-95"
						aria-label="Fullscreen"
						style={{
							boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
							background: "rgba(255, 255, 255, 0.1)",
							backdropFilter: "blur(4px)",
						}}
					>
						<Maximize className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
});

VideoPlayer.displayName = "VideoPlayer";


const VideoInfo: React.FC<{
	video: Video;
	onLike: () => void;
	onAddComment: (videoId: string, user: string, text: string) => void;
	onSearchTag: (tag: string) => void;
	onShare: () => void;
	onBookmark: () => void;
	isBookmarked: boolean;
	isLiked: boolean;
	theme: any;
}> = React.memo(
	({
		video,
		onLike,
		onAddComment,
		onSearchTag,
		onShare,
		onBookmark,
		isBookmarked,
		isLiked,
		theme,
	}) => {
		const [commentText, setCommentText] = useState("");
		const [userName, setUserName] = useState("Anonymous User");
		const [showAllComments, setShowAllComments] = useState(false);

		const submitComment = useCallback(() => {
			if (commentText.trim() && userName.trim()) {
				onAddComment(video.id, userName.trim(), commentText.trim());
				setCommentText("");
			}
		}, [commentText, userName, video.id, onAddComment]);

		const handleKeyPress = useCallback(
			(e: React.KeyboardEvent) => {
				if (e.key === "Enter" && e.ctrlKey) {
					submitComment();
				}
			},
			[submitComment]
		);

		return (
			<div className="p-8 space-y-8">
				{}
				<div>
					<h1
						className="text-3xl font-bold mb-4 leading-tight"
						style={{ color: theme.text.primary }}
					>
						{video.title}
					</h1>

					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
						<div className="flex items-center space-x-4">
							<div
								className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
								style={{
									background: theme.gradient.primary,
									boxShadow: theme.neomorphism.convex,
								}}
							>
								<User className="w-6 h-6 text-white" />
							</div>
							<div>
								<p
									className="font-bold text-lg"
									style={{ color: theme.text.primary }}
								>
									{video.user}
								</p>
								<p
									className="text-sm flex items-center space-x-3"
									style={{ color: theme.text.muted }}
								>
									<span className="flex items-center space-x-1">
										<Eye className="w-4 h-4" />
										<span>{formatNumber(video.views)} views</span>
									</span>
									<span>•</span>
									<span className="flex items-center space-x-1">
										<Clock className="w-4 h-4" />
										<span>{timeAgo(video.uploadedAt)}</span>
									</span>
								</p>
							</div>
						</div>

						{}
						<div className="flex flex-wrap items-center gap-4">
							<NeumorphicButton
								onClick={onLike}
								variant={isLiked ? "primary" : "neutral"}
								active={isLiked}
								className="flex items-center space-x-2"
								theme={theme}
							>
								<ThumbsUp
									className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
								/>
								<span>{formatNumber(video.likes || 0)}</span>
							</NeumorphicButton>

							<NeumorphicButton
								onClick={onShare}
								variant="neutral"
								className="flex items-center space-x-2"
								theme={theme}
							>
								<Share2 className="w-5 h-5" />
								<span>Share</span>
							</NeumorphicButton>

							<NeumorphicButton
								onClick={onBookmark}
								variant={isBookmarked ? "secondary" : "neutral"}
								active={isBookmarked}
								className="flex items-center space-x-2"
								theme={theme}
							>
								<Bookmark
									className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
								/>
								<span>{isBookmarked ? "Saved" : "Save"}</span>
							</NeumorphicButton>
						</div>
					</div>
				</div>

				{}
				<NeumorphicBox variant="concave" className="p-6" theme={theme}>
					<p
						className="text-base leading-relaxed mb-4"
						style={{ color: theme.text.primary }}
					>
						{video.description}
					</p>
					<div className="flex flex-wrap gap-3">
						{video.tags.map((tag) => (
							<button
								key={tag}
								onClick={() => onSearchTag(tag)}
								className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
								style={{
									background: theme.mint,
									color: theme.text.primary,
									boxShadow: theme.neomorphism.flat,
								}}
								aria-label={`Search for ${tag}`}
							>
								#{tag}
							</button>
						))}
					</div>
				</NeumorphicBox>

				{}
				<div className="space-y-6">
					<h3
						className="text-2xl font-bold flex items-center"
						style={{ color: theme.text.primary }}
					>
						<MessageCircle className="w-6 h-6 mr-3" />
						Comments ({video.comments.length})
					</h3>

					{}
					<div className="flex space-x-4">
						<div
							className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
							style={{
								background: theme.gradient.secondary,
								boxShadow: theme.neomorphism.convex,
							}}
						>
							<User className="w-6 h-6 text-white" />
						</div>
						<div className="flex-1 space-y-4">
							<input
								type="text"
								placeholder="Your name"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none transition-all duration-300"
								style={{
									background: theme.surface,
									boxShadow: theme.neomorphism.concave,
									border: "none",
									color: theme.text.primary,
								}}
								maxLength={50}
							/>
							<textarea
								placeholder="Add a thoughtful comment... (Ctrl+Enter to submit)"
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								onKeyDown={handleKeyPress}
								className="w-full p-4 rounded-xl focus:outline-none resize-none transition-all duration-300"
								rows={4}
								style={{
									background: theme.surface,
									boxShadow: theme.neomorphism.concave,
									border: "none",
									color: theme.text.primary,
								}}
								maxLength={500}
							/>
							<div className="flex justify-between items-center">
								<span className="text-xs" style={{ color: theme.text.muted }}>
									{commentText.length}/500 characters
								</span>
								<NeumorphicButton
									onClick={submitComment}
									variant="primary"
									disabled={!commentText.trim() || !userName.trim()}
									theme={theme}
								>
									Post Comment
								</NeumorphicButton>
							</div>
						</div>
					</div>

					{}
					<div className="space-y-6">
						{video.comments
							.slice(0, showAllComments ? undefined : 3)
							.map((comment) => (
								<div key={comment.id} className="flex space-x-4">
									<div
										className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
										style={{
											background: `linear-gradient(135deg, ${theme.blue}, ${theme.pink})`,
											boxShadow: theme.neomorphism.convex,
										}}
									>
										<span className="text-white text-sm font-bold">
											{comment.user[0]?.toUpperCase() || "A"}
										</span>
									</div>
									<div className="flex-1">
										<div className="flex items-center space-x-3 mb-2">
											<span
												className="font-semibold"
												style={{ color: theme.text.primary }}
											>
												{comment.user}
											</span>
											<span
												className="text-xs"
												style={{ color: theme.text.muted }}
											>
												{timeAgo(comment.createdAt)}
											</span>
										</div>
										<p
											className="mb-3 leading-relaxed"
											style={{ color: theme.text.primary }}
										>
											{comment.text}
										</p>
										<div className="flex items-center space-x-6 text-sm">
											<button
												className="flex items-center space-x-2 transition-colors hover:scale-105"
												style={{
													color: theme.text.muted,
												}}
											>
												<Heart className="w-4 h-4" />
												<span>{comment.likes || 0}</span>
											</button>
											<button
												className="transition-colors hover:scale-105"
												style={{
													color: theme.text.muted,
												}}
											>
												Reply
											</button>
										</div>
									</div>
								</div>
							))}

						{video.comments.length > 3 && (
							<button
								onClick={() => setShowAllComments((prev) => !prev)}
								className="flex items-center space-x-2 font-semibold transition-all duration-300 hover:scale-105"
								style={{ color: theme.primary }}
							>
								{showAllComments ? (
									<>
										<ChevronUp className="w-5 h-5" />
										<span>Show Less</span>
									</>
								) : (
									<>
										<ChevronDown className="w-5 h-5" />
										<span>Show {video.comments.length - 3} More Comments</span>
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}
);

VideoInfo.displayName = "VideoInfo";


const VideoCard: React.FC<{
	video: Video;
	onSelect: () => void;
	isActive: boolean;
	onBookmark: (videoId: string) => void;
	isBookmarked: boolean;
	theme: any;
}> = React.memo(
	({ video, onSelect, isActive, onBookmark, isBookmarked, theme }) => (
		<NeumorphicBox
			onClick={onSelect}
			variant={isActive ? "pressed" : "convex"}
			active={isActive}
			className="group overflow-hidden cursor-pointer transition-all duration-500"
			theme={theme}
		>
			<div
				className="relative aspect-video overflow-hidden"
				style={{
					background: `linear-gradient(135deg, ${theme.cream}, ${theme.pink})`,
				}}
			>
				{}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>

				{}
				<div className="absolute inset-0 flex items-center justify-center z-20 group-hover:scale-110 transition-transform duration-500">
					<div
						className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg"
						style={{
							background: theme.glassOverlay,
							backdropFilter: "blur(5px)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
							border: "1px solid rgba(255, 255, 255, 0.2)",
						}}
					>
						<Play
							className="w-8 h-8 fill-current ml-1 transform group-hover:scale-110 transition-transform"
							style={{ color: "white" }}
						/>
					</div>
				</div>

				{}
				{video.duration && (
					<div
						className="absolute bottom-3 right-3 px-3 py-1 rounded-lg text-white text-sm font-semibold z-20"
						style={{
							background: "rgba(0,0,0,0.7)",
							backdropFilter: "blur(4px)",
							boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
							border: "1px solid rgba(255, 255, 255, 0.1)",
						}}
					>
						{video.duration}
					</div>
				)}

				{}
				<div
					className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold z-20"
					style={{
						background:
							theme[video.category === "Technology" ? "blue" : "pink"],
						color: "white",
						boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
						border: "1px solid rgba(255, 255, 255, 0.2)",
					}}
				>
					{video.category}
				</div>
			</div>

			{}
			<div className="p-6">
				<div className="flex items-start justify-between mb-3">
					<h3
						className="font-bold text-lg flex-1 line-clamp-2 leading-tight group-hover:text-opacity-80 transition-all"
						style={{ color: theme.text.primary }}
					>
						{video.title}
					</h3>
					<NeumorphicButton
						onClick={(e) => {
							e.stopPropagation();
							onBookmark(video.id);
						}}
						variant={isBookmarked ? "secondary" : "neutral"}
						size="sm"
						icon
						active={isBookmarked}
						className="ml-3 flex-shrink-0"
						theme={theme}
						aria-label={
							isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
						}
					>
						<Bookmark
							className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
						/>
					</NeumorphicButton>
				</div>

				{}
				<div
					className="flex items-center text-sm space-x-4 mb-4"
					style={{ color: theme.text.muted }}
				>
					<span className="font-medium">{video.user}</span>
					<span className="flex items-center space-x-1">
						<Eye className="w-4 h-4" />
						<span>{formatNumber(video.views)}</span>
					</span>
					<span className="flex items-center space-x-1">
						<Heart className="w-4 h-4" />
						<span>{video.likes || 0}</span>
					</span>
				</div>

				{}
				<div className="flex flex-wrap gap-2">
					{video.tags.slice(0, 3).map((tag) => (
						<span
							key={tag}
							className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
							style={{
								background: theme.mint,
								color: theme.text.primary,
								boxShadow: theme.neomorphism.highlight,
							}}
						>
							#{tag}
						</span>
					))}
				</div>
			</div>
		</NeumorphicBox>
	)
);

VideoCard.displayName = "VideoCard";


const VideoListItem: React.FC<{
	video: Video;
	onSelect: () => void;
	isActive: boolean;
	onBookmark: (videoId: string) => void;
	isBookmarked: boolean;
	theme: any;
}> = React.memo(
	({ video, onSelect, isActive, onBookmark, isBookmarked, theme }) => (
		<NeumorphicBox
			onClick={onSelect}
			variant={isActive ? "pressed" : "flat"}
			active={isActive}
			className="group cursor-pointer p-6"
			theme={theme}
		>
			<div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
				<div
					className="relative w-full md:w-60 aspect-video rounded-xl overflow-hidden flex-shrink-0"
					style={{
						background: `linear-gradient(135deg, ${theme.cream}, ${theme.pink})`,
						boxShadow: theme.neomorphism.flat,
					}}
				>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
					<div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
						<div
							className="w-12 h-12 rounded-full flex items-center justify-center"
							style={{
								background: theme.glassOverlay,
								backdropFilter: "blur(5px)",
								boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
								border: "1px solid rgba(255, 255, 255, 0.2)",
							}}
						>
							<Play
								className="w-6 h-6 fill-current ml-0.5"
								style={{ color: "white" }}
							/>
						</div>
					</div>
					{video.duration && (
						<div
							className="absolute bottom-2 right-2 px-2 py-1 rounded text-white text-xs font-semibold"
							style={{
								background: "rgba(0,0,0,0.7)",
								backdropFilter: "blur(4px)",
							}}
						>
							{video.duration}
						</div>
					)}
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between mb-3">
						<h3
							className="font-bold text-xl flex-1 group-hover:text-opacity-80 transition-all leading-tight"
							style={{
								color: theme.text.primary,
							}}
						>
							{video.title}
						</h3>
						<div className="flex items-center space-x-3 ml-4 flex-shrink-0">
							<NeumorphicButton
								onClick={(e) => {
									e.stopPropagation();
									onBookmark(video.id);
								}}
								variant={isBookmarked ? "secondary" : "neutral"}
								size="sm"
								icon
								active={isBookmarked}
								theme={theme}
								aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
							>
								<Bookmark
									className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
								/>
							</NeumorphicButton>
							<span
								className="px-3 py-1 rounded-full text-xs font-semibold"
								style={{
									background:
										theme[video.category === "Technology" ? "blue" : "pink"],
									color: "white",
									boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
								}}
							>
								{video.category}
							</span>
						</div>
					</div>
					<div
						className="flex items-center text-sm space-x-6 mb-4"
						style={{ color: theme.text.muted }}
					>
						<span className="font-semibold">{video.user}</span>
						<span className="flex items-center space-x-1">
							<Eye className="w-4 h-4" />
							<span>{formatNumber(video.views)} views</span>
						</span>
						<span className="flex items-center space-x-1">
							<Heart className="w-4 h-4" />
							<span>{video.likes || 0} likes</span>
						</span>
						<span className="flex items-center space-x-1">
							<Clock className="w-4 h-4" />
							<span>{timeAgo(video.uploadedAt)}</span>
						</span>
					</div>
					<p
						className="text-sm mb-4 line-clamp-2 leading-relaxed"
						style={{ color: theme.text.secondary }}
					>
						{video.description}
					</p>
					<div className="flex flex-wrap gap-2">
						{video.tags.slice(0, 5).map((tag) => (
							<span
								key={tag}
								className="px-3 py-1 rounded-full text-xs font-medium"
								style={{
									background: theme.mint,
									color: theme.text.primary,
									boxShadow: theme.neomorphism.highlight,
								}}
							>
								#{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</NeumorphicBox>
	)
);

VideoListItem.displayName = "VideoListItem";

const RecommendationCard: React.FC<{
	video: Video;
	onSelect: () => void;
	theme: any;
}> = React.memo(({ video, onSelect, theme }) => (
	<NeumorphicBox
		onClick={onSelect}
		variant="flat"
		className="flex space-x-4 p-3"
		theme={theme}
	>
		<div
			className="w-24 h-16 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden"
			style={{
				background: `linear-gradient(135deg, ${theme.cream}, ${theme.pink})`,
				boxShadow: "inset 2px 2px 5px rgba(0, 0, 0, 0.1)",
			}}
		>
			{}
			<div
				className="absolute inset-0 flex items-center justify-center"
				style={{ backdropFilter: "blur(1px)" }}
			>
				<div
					className="w-8 h-8 rounded-full flex items-center justify-center"
					style={{
						background: theme.glassOverlay,
						backdropFilter: "blur(3px)",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
					}}
				>
					<Play className="w-4 h-4 fill-current ml-0.5 text-white" />
				</div>
			</div>

			{}
			{video.duration && (
				<div
					className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-white text-[10px] font-semibold"
					style={{
						background: "rgba(0,0,0,0.7)",
						backdropFilter: "blur(2px)",
					}}
				>
					{video.duration}
				</div>
			)}
		</div>
		<div className="flex-1 min-w-0">
			<p
				className="text-sm font-semibold line-clamp-2 mb-1"
				style={{ color: theme.text.primary }}
			>
				{video.title}
			</p>
			<p className="text-xs mb-1" style={{ color: theme.text.muted }}>
				{video.user}
			</p>
			<p className="text-xs" style={{ color: theme.text.muted }}>
				{formatNumber(video.views)} views • {timeAgo(video.uploadedAt)}
			</p>
		</div>
	</NeumorphicBox>
));

RecommendationCard.displayName = "RecommendationCard";

const TrendingItem: React.FC<{
	video: Video;
	rank: number;
	onSelect: () => void;
	theme: any;
}> = React.memo(({ video, rank, onSelect, theme }) => (
	<div
		onClick={onSelect}
		className="flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
	>
		<div
			className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
			style={{
				background: `linear-gradient(145deg, ${theme.secondary}, ${theme.primary})`,
				boxShadow: theme.neomorphism.convex,
			}}
		>
			{rank}
		</div>
		<div className="flex-1 min-w-0">
			<p
				className="text-sm font-semibold truncate mb-1"
				style={{ color: theme.text.primary }}
			>
				{video.title}
			</p>
			<p
				className="text-xs flex items-center space-x-2"
				style={{ color: theme.text.muted }}
			>
				<Eye className="w-3 h-3" />
				<span>{formatNumber(video.views)} views</span>
				<Heart className="w-3 h-3" />
				<span>{video.likes || 0}</span>
			</p>
		</div>
	</div>
));

TrendingItem.displayName = "TrendingItem";


const UploadModal: React.FC<{
	onClose: () => void;
	onUpload: (data: any) => void;
	theme: any;
}> = React.memo(({ onClose, onUpload, theme }) => {
	const [file, setFile] = useState<File | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [category, setCategory] = useState("Technology");
	const [user, setUser] = useState("My Channel");
	const [tagInput, setTagInput] = useState("");
	const [isUploading, setIsUploading] = useState(false);

	const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			
			if (selectedFile.size > 500 * 1024 * 1024) {
				
				alert("File size must be less than 500MB");
				return;
			}
			if (!selectedFile.type.startsWith("video/")) {
				alert("Please select a valid video file");
				return;
			}
			setFile(selectedFile);
		}
	}, []);

	const handleTagKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === ",") {
				e.preventDefault();
				const tag = tagInput.trim().toLowerCase();
				if (tag && !tags.includes(tag) && tags.length < 10) {
					setTags((prev) => [...prev, tag]);
					setTagInput("");
				}
			}
		},
		[tagInput, tags]
	);

	const removeTag = useCallback((tagToRemove: string) => {
		setTags((prev) => prev.filter((t) => t !== tagToRemove));
	}, []);

	const handleSubmit = useCallback(async () => {
		if (file && title.trim() && tags.length > 0) {
			setIsUploading(true);
			try {
				await new Promise((resolve) => setTimeout(resolve, 2000)); 
				onUpload({
					file,
					title: title.trim(),
					description: description.trim(),
					tags,
					category,
					user: user.trim(),
				});
			} catch (error) {
				console.error("Upload error:", error);
				alert("Upload failed. Please try again.");
			} finally {
				setIsUploading(false);
			}
		}
	}, [file, title, description, tags, category, user, onUpload]);

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50 p-4"
			style={{
				background: "rgba(0,0,0,0.7)",
				backdropFilter: "blur(10px)",
			}}
		>
			<NeumorphicBox
				className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
				theme={theme}
			>
				<div
					className="p-8 border-b"
					style={{ borderColor: "rgba(255,255,255,0.1)" }}
				>
					<div className="flex items-center justify-between">
						<h2
							className="text-3xl font-bold"
							style={{ color: theme.text.primary }}
						>
							Upload Your Video
						</h2>
						<NeumorphicButton
							onClick={onClose}
							variant="neutral"
							icon
							theme={theme}
							aria-label="Close"
						>
							<X className="w-6 h-6" />
						</NeumorphicButton>
					</div>
				</div>

				<div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						{}
						<div>
							<label
								className="block text-lg font-semibold mb-4"
								style={{ color: theme.text.primary }}
							>
								Video File
							</label>
							<NeumorphicBox
								variant="concave"
								className="p-8 text-center transition-all duration-300 hover:scale-[1.02] border-2 border-dashed"
								style={{
									borderColor: file ? theme.primary : "rgba(255,255,255,0.1)",
									background: file ? `${theme.primary}10` : theme.surface,
								}}
								theme={theme}
							>
								<Upload
									className="w-12 h-12 mx-auto mb-4"
									style={{ color: file ? theme.primary : theme.text.muted }}
								/>
								<input
									type="file"
									accept="video}
						<div>
							<label
								className="block text-lg font-semibold mb-3"
								style={{ color: theme.text.primary }}
							>
								Title
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
								placeholder="Give your video an awesome title..."
								maxLength={100}
								style={{
									background: theme.surface,
									boxShadow: theme.neomorphism.concave,
									border: "none",
									color: theme.text.primary,
									fontSize: "16px",
								}}
							/>
							<p className="text-xs mt-2" style={{ color: theme.text.muted }}>
								{title.length}/100 characters
							</p>
						</div>

						{}
						<div>
							<label
								className="block text-lg font-semibold mb-3"
								style={{ color: theme.text.primary }}
							>
								Description
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="w-full px-4 py-3 rounded-xl focus:outline-none resize-none transition-all duration-300"
								rows={5}
								placeholder="Tell viewers about your video..."
								maxLength={500}
								style={{
									background: theme.surface,
									boxShadow: theme.neomorphism.concave,
									border: "none",
									color: theme.text.primary,
									fontSize: "16px",
								}}
							/>
							<p className="text-xs mt-2" style={{ color: theme.text.muted }}>
								{description.length}/500 characters
							</p>
						</div>
					</div>

					<div className="space-y-6">
						{}
						<div>
							<label
								className="block text-lg font-semibold mb-3"
								style={{ color: theme.text.primary }}
							>
								Tags
							</label>
							<input
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={handleTagKeyPress}
								className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
								placeholder="Add tags (press Enter or comma to add)"
								style={{
									background: theme.surface,
									boxShadow: theme.neomorphism.concave,
									border: "none",
									color: theme.text.primary,
									fontSize: "16px",
								}}
							/>
							<div className="flex flex-wrap gap-3 mt-4">
								{tags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
										style={{
											background: theme.mint,
											color: theme.text.primary,
											boxShadow: theme.neomorphism.flat,
										}}
									>
										#{tag}
										<button
											onClick={() => removeTag(tag)}
											className="ml-2 hover:scale-110 transition-transform"
											aria-label={`Remove ${tag} tag`}
										>
											<X className="w-4 h-4" />
										</button>
									</span>
								))}
							</div>
							<p className="text-xs mt-2" style={{ color: theme.text.muted }}>
								{tags.length}/10 tags
							</p>
						</div>

						{}
						<div className="grid grid-cols-1 gap-6">
							<div>
								<label
									className="block text-lg font-semibold mb-3"
									style={{ color: theme.text.primary }}
								>
									Category
								</label>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
									style={{
										background: theme.surface,
										boxShadow: theme.neomorphism.concave,
										border: "none",
										color: theme.text.primary,
										fontSize: "16px",
									}}
								>
									<option value="Technology">💻 Technology</option>
									<option value="Entertainment">🎬 Entertainment</option>
									<option value="Nature">🌿 Nature</option>
									<option value="Wellness">🧘 Wellness</option>
								</select>
							</div>

							<div>
								<label
									className="block text-lg font-semibold mb-3"
									style={{ color: theme.text.primary }}
								>
									Channel Name
								</label>
								<input
									type="text"
									value={user}
									onChange={(e) => setUser(e.target.value)}
									className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
									placeholder="Your channel name"
									maxLength={50}
									style={{
										background: theme.surface,
										boxShadow: theme.neomorphism.concave,
										border: "none",
										color: theme.text.primary,
										fontSize: "16px",
									}}
								/>
							</div>
						</div>

						{}
						<div className="pt-6">
							<NeumorphicButton
								onClick={handleSubmit}
								variant="primary"
								disabled={
									!file || !title.trim() || tags.length === 0 || isUploading
								}
								className="w-full py-4 text-lg font-semibold"
								theme={theme}
							>
								{isUploading ? (
									<>
										<Loader2 className="w-6 h-6 animate-spin mr-3" />
										<span>Uploading...</span>
									</>
								) : (
									<>
										<Upload className="w-6 h-6 mr-3" />
										<span>Upload Video</span>
									</>
								)}
							</NeumorphicButton>
						</div>
					</div>
                    </div>
			</NeumorphicBox>
		</div>
	);
});

UploadModal.displayName = "UploadModal";

const SettingsModal: React.FC<{
	settings: UserSettings;
	onUpdateSettings: (settings: Partial<UserSettings>) => void;
	onClose: () => void;
	theme: any;
}> = React.memo(({ settings, onUpdateSettings, onClose, theme }) => (
	<div
		className="fixed inset-0 flex items-center justify-center z-50 p-4"
		style={{
			background: "rgba(0,0,0,0.7)",
			backdropFilter: "blur(10px)",
		}}
	>
		<NeumorphicBox className="max-w-md w-full p-6" theme={theme}>
			<div className="flex items-center justify-between mb-6">
				<h3
					className="text-2xl font-bold"
					style={{ color: theme.text.primary }}
				>
					Settings
				</h3>
				<NeumorphicButton
					onClick={onClose}
					variant="neutral"
					size="sm"
					icon
					theme={theme}
					aria-label="Close settings"
				>
					<X className="w-5 h-5" />
				</NeumorphicButton>
			</div>
			<div className="space-y-4">
				{[
					{ key: "darkMode", label: "Dark Mode", icon: "🌙" },
					{ key: "autoPlay", label: "Auto-play", icon: "▶️" },
				].map(({ key, label, icon }) => (
					<NeumorphicBox
						key={key}
						variant="flat"
						className="flex items-center justify-between p-4"
						theme={theme}
					>
						<span
							className="flex items-center"
							style={{ color: theme.text.primary }}
						>
							<span className="mr-3">{icon}</span>
							{label}
						</span>
						<div
							onClick={() =>
								onUpdateSettings({
									[key]: !settings[key as keyof UserSettings],
								})
							}
							className="w-12 h-6 rounded-full relative transition-all hover:scale-105 cursor-pointer"
							style={{
								background: settings[key as keyof UserSettings]
									? theme.gradient.primary
									: theme.text.light,
								boxShadow: settings[key as keyof UserSettings]
									? `0 0 10px ${theme.primary}40`
									: "none",
							}}
							aria-label={`Toggle ${label}`}
						>
							<div
								className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300"
								style={{
									transform: settings[key as keyof UserSettings]
										? "translateX(1.5rem)"
										: "translateX(0.125rem)",
									boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
								}}
							/>
						</div>
					</NeumorphicBox>
				))}
			</div>
		</NeumorphicBox>
	</div>
));

SettingsModal.displayName = "SettingsModal";

const LoginModal: React.FC<{
	onClose: () => void;
	onLogin: (email: string, password: string) => void;
	theme: any;
}> = React.memo(({ onClose, onLogin, theme }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (email.trim() && password.trim()) {
				setIsLoading(true);
				try {
					await new Promise((resolve) => setTimeout(resolve, 1000)); 
					onLogin(email.trim(), password);
				} catch (error) {
					console.error("Login error:", error);
					alert("Login failed. Please try again.");
				} finally {
					setIsLoading(false);
				}
			}
		},
		[email, password, onLogin]
	);

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50 p-4"
			style={{
				background: "rgba(0,0,0,0.7)",
				backdropFilter: "blur(10px)",
			}}
		>
			<NeumorphicBox className="max-w-md w-full p-8" theme={theme}>
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center">
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
							style={{
								background: theme.gradient.primary,
								boxShadow: theme.neomorphism.convex,
							}}
						>
							<Play className="w-5 h-5 text-white fill-current" />
						</div>
						<h3
							className="text-2xl font-bold"
							style={{ color: theme.text.primary }}
						>
							Login to VideoHub
						</h3>
					</div>
					<NeumorphicButton
						onClick={onClose}
						variant="neutral"
						size="sm"
						icon
						theme={theme}
						aria-label="Close login"
					>
						<X className="w-5 h-5" />
					</NeumorphicButton>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							className="block text-sm font-medium mb-2"
							style={{ color: theme.text.primary }}
						>
							Email
						</label>
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
							style={{
								background: theme.surface,
								boxShadow: theme.neomorphism.concave,
								border: `1px solid ${theme.bg}`,
								color: theme.text.primary,
							}}
							required
							disabled={isLoading}
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-2"
							style={{ color: theme.text.primary }}
						>
							Password
						</label>
						<input
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
							style={{
								background: theme.surface,
								boxShadow: theme.neomorphism.concave,
								border: `1px solid ${theme.bg}`,
								color: theme.text.primary,
							}}
							required
							disabled={isLoading}
						/>
					</div>

					<NeumorphicButton
						type="submit"
						variant="primary"
						disabled={isLoading}
						className="w-full py-4 mt-6 text-lg"
						theme={theme}
					>
						{isLoading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin mr-3" />
								<span>Logging in...</span>
							</>
						) : (
							<span>Login</span>
						)}
					</NeumorphicButton>

					<div className="text-center mt-4">
						<button
							type="button"
							className="text-sm transition-all hover:scale-105 hover:text-opacity-80"
							style={{ color: theme.primary }}
							disabled={isLoading}
						>
							Don't have an account? Sign up
						</button>
					</div>
				</form>
			</NeumorphicBox>
		</div>
	);
});

LoginModal.displayName = "LoginModal";


const VideoApp: React.FC = () => {
	const {
		videos,
		updateVideoViews,
		updateVideoLikes,
		addComment,
		addVideo,
		isVideoLiked,
	} = useVideoData();

	const {
		settings,
		user,
		viewHistory,
		favorites,
		updateSettings,
		login,
		logout,
		addToHistory,
		toggleFavorite,
	} = useUserPreferences();

	
	const [currentVideoId, setCurrentVideoId] = useState<string>(
		videos[0]?.id || ""
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [activeTab, setActiveTab] = useState("home");

	
	const [showUpload, setShowUpload] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [showBookmarks, setShowBookmarks] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const theme = useMemo(
		() => createTheme(settings.darkMode),
		[settings.darkMode]
	);
	
	const currentVideo = useMemo(
		() => videos.find((v) => v.id === currentVideoId),
		[videos, currentVideoId]
	);

	
	const filteredVideos = useMemo(() => {
		if (showBookmarks) {
			return videos.filter((video) => favorites.includes(video.id));
		}

		let filtered = videos;

		if (selectedCategory !== "all") {
			filtered = filtered.filter(
				(video) => video.category === selectedCategory
			);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(video) =>
					video.title.toLowerCase().includes(query) ||
					video.description.toLowerCase().includes(query) ||
					video.tags.some((tag) => tag.toLowerCase().includes(query)) ||
					video.user.toLowerCase().includes(query)
			);
		}

		return filtered;
	}, [videos, showBookmarks, favorites, selectedCategory, searchQuery]);

	
	const trendingVideos = useMemo(() => {
		return [...videos]
			.sort((a, b) => {
				const scoreA =
					(a.likes || 0) * 3 + a.views * 0.1 + a.comments.length * 5;
				const scoreB =
					(b.likes || 0) * 3 + b.views * 0.1 + b.comments.length * 5;
				return scoreB - scoreA;
			})
			.slice(0, 5);
	}, [videos]);

	const recommendations = useMemo(() => {
		if (viewHistory.length === 0) return [];

		const watchedTags = viewHistory
			.map((id) => videos.find((v) => v.id === id))
			.filter(Boolean)
			.flatMap((v) => v!.tags);

		const tagCounts = watchedTags.reduce((acc, tag) => {
			acc[tag] = (acc[tag] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return videos
			.filter((v) => v.id !== currentVideoId)
			.map((v) => ({
				...v,
				score: v.tags.reduce((score, tag) => score + (tagCounts[tag] || 0), 0),
			}))
			.sort((a, b) => b.score - a.score)
			.slice(0, 4);
	}, [videos, viewHistory, currentVideoId]);

	const categories = useMemo(
		() => Array.from(new Set(videos.map((v) => v.category))),
		[videos]
	);
	
	const allTags = useMemo(
		() => Array.from(new Set(videos.flatMap((v) => v.tags))),
		[videos]
	);

	
	const [toasts, setToasts] = useState<Toast[]>([]);
	
	const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = "info") => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);
		
		
		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 4000);
	}, []);

	
	const handleSearch = useCallback(async (query: string) => {
		setSearchQuery(query);
		if (query.trim()) {
			setIsSearching(true);
			setTimeout(() => setIsSearching(false), 300);
		}
	}, []);

	const selectVideo = useCallback(
		(id: string) => {
			setIsLoading(true);
			setCurrentVideoId(id);
			addToHistory(id);
			updateVideoViews(id);
		},
		[addToHistory, updateVideoViews]
	);

	const likeVideo = useCallback(
		(videoId: string) => {
			updateVideoLikes(videoId);
			if (!isVideoLiked(videoId)) {
				showToast("Thanks for liking this video!", "success");
			}
		},
		[updateVideoLikes, isVideoLiked, showToast]
	);

	const shareVideo = useCallback(async (video: Video) => {
		const shareUrl = `${window.location.origin}?v=${video.id}`;

		try {
			if (navigator.share) {
				await navigator.share({
					title: video.title,
					text: video.description,
					url: shareUrl,
				});
				showToast("Video shared successfully!", "success");
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(shareUrl);
				showToast("Video link copied to clipboard!", "success");
			} else {
				prompt("Copy this link to share the video:", shareUrl);
				showToast("Video link ready to share", "info");
			}
		} catch (error) {
			console.error("Share failed:", error);
			showToast("Couldn't share the video. Try again later.", "error");
		}
	}, [showToast]);

	const handleNavigation = useCallback(
		(tab: string) => {
			setActiveTab(tab);
			setShowBookmarks(false);

			if (tab === "home") {
				setSearchQuery("");
				setSelectedCategory("all");
				setCurrentVideoId(videos[0]?.id || "");
			} else if (tab !== "search" && tab !== "bookmarks") {
				
				showToast(`${tab.charAt(0).toUpperCase() + tab.slice(1)} feature coming soon!`, "info");
			}
		},
		[videos, showToast]
	);

	const clearSearch = useCallback(() => {
		setSearchQuery("");
		setSelectedCategory("all");
		setShowBookmarks(false);
	}, []);

	const handleLogin = useCallback(
		(email: string, password: string) => {
			const success = login(email, password);
			if (success) {
				setShowLogin(false);
				showToast(`Welcome back, ${email.split('@')[0]}!`, "success");
			}
		},
		[login, showToast]
	);

	const handleLogout = useCallback(() => {
		logout();
		showToast("You've been logged out successfully", "info");
	}, [logout, showToast]);

	const uploadVideo = useCallback(
		(videoData: any) => {
			try {
				const newVideoId = addVideo(videoData);
				setShowUpload(false);
				setCurrentVideoId(newVideoId);
				showToast("Video uploaded successfully!", "success");
			} catch (error) {
				console.error("Upload failed:", error);
				showToast("Upload failed. Please try again.", "error");
			}
		},
		[addVideo, showToast]
	);

	const bookmarkVideo = useCallback(
		(videoId: string) => {
			toggleFavorite(videoId);
			const isBookmarked = favorites.includes(videoId);
			showToast(
				isBookmarked 
					? "Video removed from your bookmarks" 
					: "Video added to your bookmarks!",
				isBookmarked ? "info" : "success"
			);
		},
		[toggleFavorite, favorites, showToast]
	);

	
	useEffect(() => {
		const style = document.createElement('style');
		style.textContent = customCss;
		document.head.appendChild(style);
		
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			<div
				className="min-h-screen transition-colors duration-500"
				style={{
					background: theme.bg,
					fontFamily: '"Inter", system-ui, sans-serif',
				}}
			>
				{}
				<nav
					className="sticky top-0 z-50 border-b backdrop-blur-xl"
					style={{
						background: `${theme.bg}E6`,
						borderColor: "rgba(255,255,255,0.05)",
						boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
					}}
				>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							{}
							<div className="flex items-center space-x-8">
								<div className="flex items-center space-x-3">
									<div
										className="w-10 h-10 rounded-xl flex items-center justify-center group cursor-pointer transition-all duration-300 hover:scale-110"
										style={{
											background: theme.gradient.primary,
											boxShadow: theme.neomorphism.convex,
										}}
									>
										<Play className="w-5 h-5 text-white fill-current group-hover:scale-110 transition-transform" />
									</div>
									<span
										className="text-2xl font-bold tracking-tight cursor-pointer transition-all duration-300 hover:scale-105"
										onClick={() => handleNavigation("home")}
										style={{ color: theme.text.primary }}
									>
										VideoHub
									</span>
								</div>
							</div>

							{}
							<div className="flex-1 max-w-2xl mx-8">
								<div className="relative group">
									<Search
										className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
										style={{
											color: isSearching ? theme.primary : theme.text.muted,
										}}
									/>
									{isSearching && (
										<Loader2
											className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin"
											style={{ color: theme.primary }}
										/>
									)}
									<input
										type="text"
										placeholder="Search videos, creators, topics..."
										value={searchQuery}
										onChange={(e) => handleSearch(e.target.value)}
										className="w-full pl-12 pr-12 py-3 rounded-2xl focus:outline-none transition-all duration-300 group-hover:scale-[1.02] focus:scale-[1.02]"
										style={{
											background: theme.surface,
											boxShadow: searchQuery
												? `${theme.neomorphism.concave}, 0 0 0 2px ${theme.primary}`
												: theme.neomorphism.concave,
											border: "none",
											color: theme.text.primary,
											fontSize: "16px",
										}}
									/>
									{searchQuery && (
										<button
											onClick={clearSearch}
											className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-all duration-200 p-1 rounded-full"
											style={{
												background: theme.bg,
												color: theme.text.muted,
												boxShadow: theme.neomorphism.flat,
											}}
											aria-label="Clear search"
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>

							{}
							<div className="flex items-center space-x-4">
								<NeumorphicButton
									onClick={() => setShowUpload(true)}
									variant="primary"
									className="flex items-center space-x-2 group"
									theme={theme}
								>
									<Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
									<span className="font-semibold">Upload</span>
								</NeumorphicButton>

								<NeumorphicButton
									onClick={() => {
										setShowBookmarks(!showBookmarks);
										if (!showBookmarks) {
											setSearchQuery("");
											setSelectedCategory("all");
										}
									}}
									variant={showBookmarks ? "secondary" : "neutral"}
									active={showBookmarks}
									icon
									className="relative"
									theme={theme}
									aria-label="Bookmarks"
								>
									<Bookmark
										className={`w-5 h-5 ${showBookmarks ? "fill-current" : ""}`}
									/>
									{favorites.length > 0 && (
										<span
											className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
											style={{
												boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
											}}
										>
											{favorites.length}
										</span>
									)}
								</NeumorphicButton>

								<NeumorphicButton
									onClick={() => setShowSettings(!showSettings)}
									variant={showSettings ? "accent" : "neutral"}
									active={showSettings}
									icon
									theme={theme}
									aria-label="Settings"
								>
									<Settings className="w-5 h-5" />
								</NeumorphicButton>

								{user ? (
									<NeumorphicButton
										onClick={handleLogout}
										variant="secondary"
										className="flex items-center space-x-2"
										theme={theme}
									>
										<User className="w-5 h-5" />
										<span className="font-medium">{user.name}</span>
									</NeumorphicButton>
								) : (
									<NeumorphicButton
										onClick={() => setShowLogin(true)}
										variant="neutral"
										icon
										theme={theme}
									>
										<User className="w-5 h-5" />
									</NeumorphicButton>
								)}
							</div>
						</div>
					</div>
				</nav>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{}
					{activeTab === "home" && !searchQuery && !showBookmarks && (
						<HeroSection 
							theme={theme} 
							onSearch={handleSearch}
						/>
					)}
					
					<div className="flex flex-col lg:flex-row gap-8">
						{}
						<div className="flex-1 space-y-8">
							{}
							<NeumorphicBox
								className="p-6 flex flex-wrap items-center justify-between gap-6"
								theme={theme}
							>
								<div className="flex items-center space-x-6">
									<div className="flex items-center space-x-3">
										<Filter
											className="w-5 h-5"
											style={{ color: theme.text.secondary }}
										/>
										<select
											value={selectedCategory}
											onChange={(e) => setSelectedCategory(e.target.value)}
											className="px-4 py-2 text-sm rounded-xl focus:outline-none transition-all duration-300 hover:scale-105"
											style={{
												background: theme.surface,
												boxShadow: theme.neomorphism.concave,
												border: "none",
												color: theme.text.primary,
											}}
										>
											<option value="all">All Categories</option>
											{categories.map((cat) => (
												<option key={cat} value={cat}>
													{cat}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="flex items-center space-x-3">
									{[
										{ mode: "grid", icon: Grid3X3 },
										{ mode: "list", icon: List },
									].map(({ mode, icon: Icon }) => (
										<NeumorphicButton
											key={mode}
											onClick={() => setViewMode(mode as "grid" | "list")}
											variant="neutral"
											active={viewMode === mode}
											icon
											size="sm"
											theme={theme}
											aria-label={`${mode} view`}
										>
											<Icon className="w-5 h-5" />
										</NeumorphicButton>
									))}
								</div>
							</NeumorphicBox>

							{}
							{currentVideo && (
								<NeumorphicBox
									theme={theme}
									className="overflow-hidden"
									style={{
										
										boxShadow: `${theme.neomorphism.flat}, 0 10px 40px ${
											settings.darkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)"
										}`,
									}}
								>
									<VideoPlayer
										video={currentVideo}
										isLoading={isLoading}
										setIsLoading={setIsLoading}
										theme={theme}
										autoPlay={settings.autoPlay}
									/>
									<VideoInfo
										video={currentVideo}
										onLike={() => likeVideo(currentVideo.id)}
										onAddComment={addComment}
										onSearchTag={handleSearch}
										onShare={() => shareVideo(currentVideo)}
										onBookmark={() => bookmarkVideo(currentVideo.id)}
										isBookmarked={favorites.includes(currentVideo.id)}
										isLiked={isVideoLiked(currentVideo.id)}
										theme={theme}
									/>
								</NeumorphicBox>
							)}

							{}
							<div className="space-y-6">
								<div className="flex justify-between items-center">
									<h2
										className="text-3xl font-bold tracking-tight"
										style={{ color: theme.text.primary }}
									>
										{showBookmarks ? (
											<>
												<Bookmark
													className="inline w-8 h-8 mr-3"
													style={{ color: theme.secondary }}
												/>
												Bookmarked Videos
											</>
										) : searchQuery ? (
											<>
												Search Results
												<span
													className="text-lg font-normal ml-2"
													style={{ color: theme.text.muted }}
												>
													for "{searchQuery}"
												</span>
											</>
										) : (
											"Discover Videos"
										)}
									</h2>
									<div className="flex items-center space-x-2">
										<span style={{ color: theme.text.muted }} className="text-sm">
											{filteredVideos.length} videos found
										</span>
										{isSearching && (
											<Loader2
												className="w-4 h-4 animate-spin"
												style={{ color: theme.primary }}
											/>
										)}
									</div>
								</div>

								{filteredVideos.length === 0 ? (
									<NeumorphicBox
										variant="concave"
										className="text-center py-20"
										theme={theme}
									>
										{showBookmarks ? (
											<>
												<Bookmark
													className="w-20 h-20 mx-auto mb-6"
													style={{ color: theme.text.light }}
												/>
												<h3
													className="text-2xl font-bold mb-3"
													style={{ color: theme.text.primary }}
												>
													No Bookmarked Videos
												</h3>
												<p
													className="text-lg mb-6"
													style={{ color: theme.text.muted }}
												>
													Start bookmarking videos you want to watch later!
												</p>
												<NeumorphicButton
													onClick={() => setShowBookmarks(false)}
													variant="primary"
													theme={theme}
												>
													Browse Videos
												</NeumorphicButton>
											</>
										) : (
											<>
												<Search
													className="w-20 h-20 mx-auto mb-6"
													style={{ color: theme.text.light }}
												/>
												<h3
													className="text-2xl font-bold mb-3"
													style={{ color: theme.text.primary }}
												>
													{searchQuery
														? `No results for "${searchQuery}"`
														: "No videos found"}
												</h3>
												<p
													className="text-lg mb-6"
													style={{ color: theme.text.muted }}
												>
													{searchQuery
														? "Try different keywords or check your spelling"
														: "Try adjusting your filters or search for something specific"}
												</p>
												{searchQuery && (
													<NeumorphicButton
														onClick={clearSearch}
														variant="primary"
														theme={theme}
													>
														Clear Search
													</NeumorphicButton>
												)}
											</>
										)}
									</NeumorphicBox>
								) : viewMode === "grid" ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
										{filteredVideos.map((video) => (
											<VideoCard
												key={video.id}
												video={video}
												onSelect={() => selectVideo(video.id)}
												isActive={video.id === currentVideoId}
												onBookmark={bookmarkVideo}
												isBookmarked={favorites.includes(video.id)}
												theme={theme}
											/>
										))}
									</div>
								) : (
									<div className="space-y-6">
										{filteredVideos.map((video) => (
											<VideoListItem
												key={video.id}
												video={video}
												onSelect={() => selectVideo(video.id)}
												isActive={video.id === currentVideoId}
												onBookmark={bookmarkVideo}
												isBookmarked={favorites.includes(video.id)}
												theme={theme}
											/>
										))}
									</div>
								)}
							</div>
						</div>

						{}
						<aside className="w-full lg:w-80 space-y-8 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-8">
							{" "}
							{}
							{recommendations.length > 0 && (
								<NeumorphicBox className="p-6" theme={theme}>
									<h3
										className="text-xl font-bold mb-6 flex items-center"
										style={{ color: theme.text.primary }}
									>
										<Star
											className="w-6 h-6 mr-3"
											style={{ color: theme.primary }}
										/>
										Recommended for You
									</h3>
									<div className="space-y-4">
										{recommendations.map((video) => (
											<RecommendationCard
												key={video.id}
												video={video}
												onSelect={() => selectVideo(video.id)}
												theme={theme}
											/>
										))}
									</div>
								</NeumorphicBox>
							)}
							{}
							<NeumorphicBox className="p-6" theme={theme}>
								<h3
									className="text-xl font-bold mb-6 flex items-center"
									style={{ color: theme.text.primary }}
								>
									<TrendingUp
										className="w-6 h-6 mr-3"
										style={{ color: theme.secondary }}
									/>
									Trending Now
								</h3>
								<div className="space-y-4">
									{trendingVideos.map((video, idx) => (
										<TrendingItem
											key={video.id}
											video={video}
											rank={idx + 1}
											onSelect={() => selectVideo(video.id)}
											theme={theme}
										/>
									))}
								</div>
							</NeumorphicBox>
							{}
							<NeumorphicBox className="p-6" theme={theme}>
								<h3
									className="text-xl font-bold mb-6"
									style={{ color: theme.text.primary }}
								>
									Popular Tags
								</h3>
								<div className="flex flex-wrap gap-3">
									{allTags.slice(0, 12).map((tag) => (
										<button
											key={tag}
											onClick={() => handleSearch(tag)}
											className="px-4 py-2 text-sm rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
											style={{
												background: theme.pink,
												color: theme.text.primary,
												boxShadow: theme.neomorphism.flat,
											}}
										>
											#{tag}
										</button>
									))}
								</div>
							</NeumorphicBox>
						</aside>
					</div>
					
					{}
					{activeTab === "home" && !searchQuery && !showBookmarks && (
						<AppFeatures theme={theme} />
					)}
					
					{}
					{activeTab === "home" && !searchQuery && !showBookmarks && (
						<FeaturedCreators theme={theme} />
					)}
					
					{}
					<NeumorphicBox
						className="my-16 p-10 text-center"
						theme={theme}
						style={{
							background: `linear-gradient(135deg, ${theme.blue}40, ${theme.pink}40)`,
						}}
					>
						<h2 
							className="text-3xl font-bold mb-6"
							style={{ color: theme.text.primary }}
						>
							Ready to share your creativity with the world?
						</h2>
						<p 
							className="text-xl max-w-3xl mx-auto mb-10"
							style={{ color: theme.text.secondary }}
						>
							Join thousands of creators who are building their audience on VideoHub
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<NeumorphicButton
								onClick={() => setShowUpload(true)}
								variant="primary"
								className="py-4 px-10 text-lg font-bold pulse-animation"
								theme={theme}
							>
								<Upload className="w-5 h-5 mr-3" />
								Upload Your First Video
							</NeumorphicButton>
							
							<NeumorphicButton
								onClick={() => showToast("Creator program info coming soon!", "info")}
								variant="neutral"
								className="py-4 px-10 text-lg font-bold"
								theme={theme}
							>
								Learn About Creator Program
							</NeumorphicButton>
						</div>
					</NeumorphicBox>
				</div>
				
				{}
				<Footer theme={theme} />

				{}
				<div 
					className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-opacity-95 backdrop-blur-md border-t flex justify-around items-center py-3 px-2"
					style={{
						background: theme.bg,
						borderColor: "rgba(255,255,255,0.05)",
						boxShadow: "0 -5px 20px rgba(0,0,0,0.1)",
					}}
				>
					{[
						{ icon: Home, label: "Home", id: "home" },
						{ icon: Compass, label: "Explore", id: "explore" },
						{ icon: Upload, label: "Upload", id: "upload" },
						{ icon: Bookmark, label: "Saved", id: "bookmarks" },
						{ icon: User, label: "Profile", id: "profile" },
					].map((item) => (
						<button
							key={item.id}
							onClick={() => {
								if (item.id === "upload") {
									setShowUpload(true);
								} else if (item.id === "bookmarks") {
									setShowBookmarks(!showBookmarks);
									if (showBookmarks) {
										handleNavigation("home");
									}
								} else if (item.id === "home") {
									handleNavigation("home");
								} else {
									showToast(`${item.label} feature coming soon!`, "info");
								}
							}}
							className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-all"
							style={{
								color: 
									(activeTab === item.id) || 
									(item.id === "bookmarks" && showBookmarks) 
										? theme.primary 
										: theme.text.muted
							}}
						>
							<item.icon className="w-6 h-6" />
							<span className="text-xs">{item.label}</span>
						</button>
					))}
				</div>

				{}
				{showUpload && (
					<UploadModal
						onClose={() => setShowUpload(false)}
						onUpload={uploadVideo}
						theme={theme}
					/>
				)}

				{showSettings && (
					<SettingsModal
						settings={settings}
						onUpdateSettings={updateSettings}
						onClose={() => setShowSettings(false)}
						theme={theme}
					/>
				)}

				{showLogin && !user && (
					<LoginModal
						onClose={() => setShowLogin(false)}
						onLogin={handleLogin}
						theme={theme}
					/>
				)}
				
				{}
				<div className="fixed bottom-6 right-6 z-50 space-y-4 max-w-md">
					{toasts.map((toast) => (
						<div
							key={toast.id}
							className="flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-500 animate-slide-in"
							style={{
								background: theme.surface,
								boxShadow: theme.neomorphism.flat,
								borderLeft: `4px solid ${
									toast.type === "error" 
										? "#FF5A5A" 
										: toast.type === "success" 
										? theme.accent 
										: toast.type === "warning"
										? "#FFB547"
										: theme.primary
								}`,
							}}
						>
							<p style={{ color: theme.text.primary }}>{toast.message}</p>
							<button
								onClick={() => 
									setToasts((prev) => 
										prev.filter((t) => t.id !== toast.id)
									)
								}
								className="ml-4 p-1 rounded-full hover:bg-opacity-10 hover:bg-white"
							>
								<X className="w-4 h-4" style={{ color: theme.text.muted }} />
							</button>
						</div>
					))}
				</div>
			</div>
		</ToastContext.Provider>
	);
};

export default VideoApp;
                    