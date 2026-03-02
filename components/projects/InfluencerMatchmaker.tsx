"use client";
"use client";

import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "react";
import {
	Search,
	Filter,
	X,
	Users,
	TrendingUp,
	Heart,
	MessageCircle,
	Share2,
	Eye,
	BarChart3,
	Calendar,
	DollarSign,
	MapPin,
	Instagram,
	Youtube,
	Ticket,
	Star,
	ChevronDown,
	ChevronRight,
	Grip,
} from "lucide-react";

// Types
interface Influencer {
	id: string;
	name: string;
	handle: string;
	avatar: string;
	followers: number;
	engagementRate: number;
	category: string;
	location: string;
	platforms: Platform[];
	verified: boolean;
	rating: number;
	priceRange: string;
	audienceDemographics: AudienceDemographics;
	engagementTrends: EngagementTrend[];
	topContent: ContentPost[];
	bio: string;
	recentCollaborations: string[];
}

interface Platform {
	name: "Instagram" | "YouTube" | "TikTok";
	followers: number;
	engagementRate: number;
	icon: React.ComponentType<any>;
}

interface AudienceDemographics {
	ageGroups: { range: string; percentage: number }[];
	genders: { type: string; percentage: number }[];
	locations: { country: string; percentage: number }[];
}

interface EngagementTrend {
	month: string;
	engagement: number;
	reach: number;
}

interface ContentPost {
	id: string;
	title: string;
	thumbnail: string;
	likes: number;
	comments: number;
	shares: number;
	views: number;
	platform: string;
}

interface FilterState {
	category: string;
	followersMin: number;
	followersMax: number;
	engagementMin: number;
	engagementMax: number;
	location: string;
	platform: string;
}

interface SearchHistory {
	query: string;
	timestamp: number;
}

interface CampaignProposal {
	influencerId: string;
	campaignType: string;
	budget: string;
	duration: string;
	deliverables: string[];
	timeline: string;
	message: string;
}

// Mock Data
const mockInfluencers: Influencer[] = [
	{
		id: "1",
		name: "Emma Rodriguez",
		handle: "@emmabeauty",
		avatar:
			"https://plus.unsplash.com/premium_photo-1690086519096-0594592709d3?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		followers: 2500000,
		engagementRate: 4.8,
		category: "Beauty",
		location: "Los Angeles, CA",
		platforms: [
			{
				name: "Instagram",
				followers: 2500000,
				engagementRate: 4.8,
				icon: Instagram,
			},
			{
				name: "YouTube",
				followers: 1200000,
				engagementRate: 3.2,
				icon: Youtube,
			},
			{ name: "TikTok", followers: 800000, engagementRate: 6.1, icon: Ticket },
		],
		verified: true,
		rating: 4.9,
		priceRange: "$5,000 - $15,000",
		bio: "Beauty enthusiast sharing makeup tutorials, skincare routines, and lifestyle content. Brand partnerships with Sephora, Urban Decay, and Glossier.",
		recentCollaborations: [
			"Sephora",
			"Urban Decay",
			"Glossier",
			"Fenty Beauty",
		],
		audienceDemographics: {
			ageGroups: [
				{ range: "18-24", percentage: 35 },
				{ range: "25-34", percentage: 45 },
				{ range: "35-44", percentage: 15 },
				{ range: "45+", percentage: 5 },
			],
			genders: [
				{ type: "Female", percentage: 85 },
				{ type: "Male", percentage: 12 },
				{ type: "Other", percentage: 3 },
			],
			locations: [
				{ country: "United States", percentage: 60 },
				{ country: "Canada", percentage: 15 },
				{ country: "United Kingdom", percentage: 10 },
				{ country: "Australia", percentage: 8 },
				{ country: "Other", percentage: 7 },
			],
		},
		engagementTrends: [
			{ month: "Jan", engagement: 4.2, reach: 2100000 },
			{ month: "Feb", engagement: 4.5, reach: 2250000 },
			{ month: "Mar", engagement: 4.8, reach: 2400000 },
			{ month: "Apr", engagement: 4.6, reach: 2300000 },
			{ month: "May", engagement: 4.9, reach: 2450000 },
			{ month: "Jun", engagement: 4.8, reach: 2400000 },
		],
		topContent: [
			{
				id: "1",
				title: "Summer Glow Makeup Tutorial",
				thumbnail:
					"https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300&h=200&fit=crop",
				likes: 125000,
				comments: 3200,
				shares: 1800,
				views: 850000,
				platform: "Instagram",
			},
			{
				id: "2",
				title: "Skincare Routine for Acne-Prone Skin",
				thumbnail:
					"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
				likes: 98000,
				comments: 5600,
				shares: 2100,
				views: 720000,
				platform: "YouTube",
			},
		],
	},
	{
		id: "2",
		name: "Alex Chen",
		handle: "@techwithalex",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		followers: 1800000,
		engagementRate: 5.2,
		category: "Technology",
		location: "San Francisco, CA",
		platforms: [
			{
				name: "YouTube",
				followers: 1800000,
				engagementRate: 5.2,
				icon: Youtube,
			},
			{
				name: "Instagram",
				followers: 900000,
				engagementRate: 4.1,
				icon: Instagram,
			},
			{ name: "Ticket", followers: 600000, engagementRate: 7.3, icon: Ticket },
		],
		verified: true,
		rating: 4.8,
		priceRange: "$8,000 - $20,000",
		bio: "Tech reviewer and early adopter sharing the latest gadgets, software, and digital trends. Trusted by millions for honest tech reviews.",
		recentCollaborations: ["Apple", "Samsung", "Google", "Microsoft"],
		audienceDemographics: {
			ageGroups: [
				{ range: "18-24", percentage: 25 },
				{ range: "25-34", percentage: 50 },
				{ range: "35-44", percentage: 20 },
				{ range: "45+", percentage: 5 },
			],
			genders: [
				{ type: "Male", percentage: 70 },
				{ type: "Female", percentage: 28 },
				{ type: "Other", percentage: 2 },
			],
			locations: [
				{ country: "United States", percentage: 45 },
				{ country: "India", percentage: 20 },
				{ country: "United Kingdom", percentage: 12 },
				{ country: "Canada", percentage: 10 },
				{ country: "Other", percentage: 13 },
			],
		},
		engagementTrends: [
			{ month: "Jan", engagement: 4.8, reach: 1650000 },
			{ month: "Feb", engagement: 5.1, reach: 1720000 },
			{ month: "Mar", engagement: 5.3, reach: 1800000 },
			{ month: "Apr", engagement: 5.0, reach: 1750000 },
			{ month: "May", engagement: 5.4, reach: 1850000 },
			{ month: "Jun", engagement: 5.2, reach: 1800000 },
		],
		topContent: [
			{
				id: "3",
				title: "iPhone 15 Pro Max Deep Dive Review",
				thumbnail:
					"https://images.unsplash.com/photo-1592286062529-db47e6fbc7d8?w=300&h=200&fit=crop",
				likes: 89000,
				comments: 2800,
				shares: 3200,
				views: 1200000,
				platform: "YouTube",
			},
			{
				id: "4",
				title: "AI Tools That Will Change Your Life",
				thumbnail:
					"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
				likes: 156000,
				comments: 4100,
				shares: 5600,
				views: 980000,
				platform: "TikTok",
			},
		],
	},
	{
		id: "3",
		name: "Sarah Johnson",
		handle: "@sarahfitslife",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
		followers: 3200000,
		engagementRate: 6.1,
		category: "Fitness",
		location: "Miami, FL",
		platforms: [
			{
				name: "Instagram",
				followers: 3200000,
				engagementRate: 6.1,
				icon: Instagram,
			},
			{ name: "TikTok", followers: 2100000, engagementRate: 8.2, icon: Ticket },
			{
				name: "YouTube",
				followers: 850000,
				engagementRate: 4.5,
				icon: Youtube,
			},
		],
		verified: true,
		rating: 4.7,
		priceRange: "$6,000 - $18,000",
		bio: "Certified personal trainer and nutrition coach inspiring millions to live their healthiest life. Partner with leading fitness and wellness brands.",
		recentCollaborations: ["Nike", "Lululemon", "MyProtein", "Fitbit"],
		audienceDemographics: {
			ageGroups: [
				{ range: "18-24", percentage: 30 },
				{ range: "25-34", percentage: 40 },
				{ range: "35-44", percentage: 25 },
				{ range: "45+", percentage: 5 },
			],
			genders: [
				{ type: "Female", percentage: 75 },
				{ type: "Male", percentage: 23 },
				{ type: "Other", percentage: 2 },
			],
			locations: [
				{ country: "United States", percentage: 55 },
				{ country: "Brazil", percentage: 15 },
				{ country: "United Kingdom", percentage: 10 },
				{ country: "Canada", percentage: 8 },
				{ country: "Other", percentage: 12 },
			],
		},
		engagementTrends: [
			{ month: "Jan", engagement: 5.8, reach: 2800000 },
			{ month: "Feb", engagement: 6.0, reach: 2900000 },
			{ month: "Mar", engagement: 6.3, reach: 3100000 },
			{ month: "Apr", engagement: 5.9, reach: 2950000 },
			{ month: "May", engagement: 6.2, reach: 3050000 },
			{ month: "Jun", engagement: 6.1, reach: 3000000 },
		],
		topContent: [
			{
				id: "5",
				title: "30-Day Ab Challenge Results",
				thumbnail:
					"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
				likes: 198000,
				comments: 8900,
				shares: 12000,
				views: 1500000,
				platform: "TikTok",
			},
			{
				id: "6",
				title: "What I Eat in a Day - High Protein",
				thumbnail:
					"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop",
				likes: 145000,
				comments: 6700,
				shares: 8900,
				views: 1200000,
				platform: "Instagram",
			},
		],
	},
	{
		id: "4",
		name: "Marcus Williams",
		handle: "@marcusstyle",
		avatar:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
		followers: 1500000,
		engagementRate: 4.3,
		category: "Fashion",
		location: "New York, NY",
		platforms: [
			{
				name: "Instagram",
				followers: 1500000,
				engagementRate: 4.3,
				icon: Instagram,
			},
			{ name: "TikTok", followers: 950000, engagementRate: 5.8, icon: Ticket },
			{
				name: "YouTube",
				followers: 420000,
				engagementRate: 3.1,
				icon: Youtube,
			},
		],
		verified: true,
		rating: 4.6,
		priceRange: "$4,000 - $12,000",
		bio: "Men's fashion influencer and style consultant. Collaborating with premium fashion brands to showcase timeless and trendy styles.",
		recentCollaborations: ["Zara", "H&M", "Ralph Lauren", "Tommy Hilfiger"],
		audienceDemographics: {
			ageGroups: [
				{ range: "18-24", percentage: 40 },
				{ range: "25-34", percentage: 35 },
				{ range: "35-44", percentage: 20 },
				{ range: "45+", percentage: 5 },
			],
			genders: [
				{ type: "Male", percentage: 60 },
				{ type: "Female", percentage: 38 },
				{ type: "Other", percentage: 2 },
			],
			locations: [
				{ country: "United States", percentage: 50 },
				{ country: "United Kingdom", percentage: 20 },
				{ country: "Canada", percentage: 12 },
				{ country: "Germany", percentage: 8 },
				{ country: "Other", percentage: 10 },
			],
		},
		engagementTrends: [
			{ month: "Jan", engagement: 4.0, reach: 1350000 },
			{ month: "Feb", engagement: 4.2, reach: 1400000 },
			{ month: "Mar", engagement: 4.5, reach: 1450000 },
			{ month: "Apr", engagement: 4.1, reach: 1380000 },
			{ month: "May", engagement: 4.4, reach: 1420000 },
			{ month: "Jun", engagement: 4.3, reach: 1400000 },
		],
		topContent: [
			{
				id: "7",
				title: "Summer Style Essentials for Men",
				thumbnail:
					"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
				likes: 76000,
				comments: 2100,
				shares: 3400,
				views: 890000,
				platform: "Instagram",
			},
			{
				id: "8",
				title: "Outfit Transitions: Day to Night",
				thumbnail:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
				likes: 92000,
				comments: 3800,
				shares: 5200,
				views: 1100000,
				platform: "TikTok",
			},
		],
	},
	{
		id: "5",
		name: "Maya Patel",
		handle: "@mayatravels",
		avatar:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
		followers: 2800000,
		engagementRate: 5.7,
		category: "Travel",
		location: "London, UK",
		platforms: [
			{
				name: "Instagram",
				followers: 2800000,
				engagementRate: 5.7,
				icon: Instagram,
			},
			{
				name: "YouTube",
				followers: 1600000,
				engagementRate: 4.2,
				icon: Youtube,
			},
			{ name: "TikTok", followers: 1200000, engagementRate: 7.1, icon: Ticket },
		],
		verified: true,
		rating: 4.8,
		priceRange: "$7,000 - $22,000",
		bio: "Travel photographer and adventure seeker sharing hidden gems and travel tips from around the world. Trusted by luxury travel brands.",
		recentCollaborations: ["Airbnb", "Booking.com", "Emirates", "Marriott"],
		audienceDemographics: {
			ageGroups: [
				{ range: "18-24", percentage: 25 },
				{ range: "25-34", percentage: 45 },
				{ range: "35-44", percentage: 25 },
				{ range: "45+", percentage: 5 },
			],
			genders: [
				{ type: "Female", percentage: 65 },
				{ type: "Male", percentage: 33 },
				{ type: "Other", percentage: 2 },
			],
			locations: [
				{ country: "United Kingdom", percentage: 25 },
				{ country: "United States", percentage: 30 },
				{ country: "Australia", percentage: 15 },
				{ country: "Germany", percentage: 12 },
				{ country: "Other", percentage: 18 },
			],
		},
		engagementTrends: [
			{ month: "Jan", engagement: 5.2, reach: 2400000 },
			{ month: "Feb", engagement: 5.5, reach: 2550000 },
			{ month: "Mar", engagement: 5.8, reach: 2700000 },
			{ month: "Apr", engagement: 5.6, reach: 2650000 },
			{ month: "May", engagement: 5.9, reach: 2750000 },
			{ month: "Jun", engagement: 5.7, reach: 2700000 },
		],
		topContent: [
			{
				id: "9",
				title: "Hidden Gems of Santorini",
				thumbnail:
					"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop",
				likes: 189000,
				comments: 7200,
				shares: 15000,
				views: 1800000,
				platform: "Instagram",
			},
			{
				id: "10",
				title: "Solo Female Travel Safety Tips",
				thumbnail:
					"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop",
				likes: 234000,
				comments: 12000,
				shares: 28000,
				views: 2100000,
				platform: "TikTok",
			},
		],
	},
	{
		id: "6",
		name: "David Kim",
		handle: "@davidcooks",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		followers: 1200000,
		engagementRate: 7.2,
		category: "Food",
		location: "Seattle, WA",
		platforms: [
			{ name: "TikTok", followers: 1200000, engagementRate: 7.2, icon: Ticket },
			{
				name: "Instagram",
				followers: 800000,
				engagementRate: 5.8,
				icon: Instagram,
			},
			{
				name: "YouTube",
				followers: 650000,
				engagementRate: 4.9,
				icon: Youtube,
			},
		],
		verified: true,
		rating: 4.9,
		priceRange: "$3,000 - $10,000",
		bio: "Chef and food content creator making cooking accessible and fun. Partnering with kitchen brands and food companies worldwide.",
		recentCollaborations: [
			"HelloFresh",
			"Blue Apron",
			"KitchenAid",
			"Williams Sonoma",
		],
		audienceDemographics: {
			ageGroups: [
				{ range: "18-24", percentage: 35 },
				{ range: "25-34", percentage: 40 },
				{ range: "35-44", percentage: 20 },
				{ range: "45+", percentage: 5 },
			],
			genders: [
				{ type: "Female", percentage: 55 },
				{ type: "Male", percentage: 43 },
				{ type: "Other", percentage: 2 },
			],
			locations: [
				{ country: "United States", percentage: 45 },
				{ country: "Canada", percentage: 20 },
				{ country: "United Kingdom", percentage: 15 },
				{ country: "Australia", percentage: 10 },
				{ country: "Other", percentage: 10 },
			],
		},
		engagementTrends: [
			{ month: "Jan", engagement: 6.8, reach: 1050000 },
			{ month: "Feb", engagement: 7.0, reach: 1100000 },
			{ month: "Mar", engagement: 7.3, reach: 1150000 },
			{ month: "Apr", engagement: 7.1, reach: 1120000 },
			{ month: "May", engagement: 7.4, reach: 1180000 },
			{ month: "Jun", engagement: 7.2, reach: 1150000 },
		],
		topContent: [
			{
				id: "11",
				title: "60-Second Pasta Recipes",
				thumbnail:
					"https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop",
				likes: 156000,
				comments: 8900,
				shares: 23000,
				views: 2500000,
				platform: "TikTok",
			},
			{
				id: "12",
				title: "Korean BBQ at Home",
				thumbnail:
					"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop",
				likes: 98000,
				comments: 5600,
				shares: 12000,
				views: 1200000,
				platform: "Instagram",
			},
		],
	},
];

const categories = [
	"All",
	"Beauty",
	"Technology",
	"Fitness",
	"Fashion",
	"Travel",
	"Food",
	"Lifestyle",
	"Gaming",
];
const locations = [
	"All",
	"Los Angeles, CA",
	"San Francisco, CA",
	"Miami, FL",
	"New York, NY",
	"London, UK",
	"Seattle, WA",
];
const platforms = ["All", "Instagram", "YouTube", "TikTok"];

// Simple Chart Components
const SimpleBarChart: React.FC<{
	data: { label: string; value: number }[];
	title: string;
}> = ({ data, title }) => {
	const maxValue = Math.max(...data.map((d) => d.value));

	return (
		<div className="bg-white p-4 rounded-lg border">
			<h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
			<div className="space-y-2">
				{data.map((item, index) => (
					<div key={index} className="flex items-center space-x-3">
						<span className="text-xs text-gray-600 w-16">{item.label}</span>
						<div className="flex-1 bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-500 h-2 rounded-full transition-all duration-500"
								style={{ width: `${(item.value / maxValue) * 100}%` }}
							/>
						</div>
						<span className="text-xs text-gray-700 font-medium w-8">
							{item.value}%
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

const SimpleLineChart: React.FC<{ data: EngagementTrend[]; title: string }> = ({
	data,
	title,
}) => {
	const maxEngagement = Math.max(...data.map((d) => d.engagement));

	return (
		<div className="bg-white p-4 rounded-lg border">
			<h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
			<div className="flex items-end space-x-2 h-32">
				{data.map((item, index) => (
					<div key={index} className="flex-1 flex flex-col items-center">
						<div
							className="bg-green-500 w-full rounded-t transition-all duration-500 hover:bg-green-600"
							style={{ height: `${(item.engagement / maxEngagement) * 100}%` }}
							title={`${item.month}: ${item.engagement}%`}
						/>
						<span className="text-xs text-gray-600 mt-1">{item.month}</span>
					</div>
				))}
			</div>
		</div>
	);
};

// Main Component
const InfluencerMatchmaker: React.FC = () => {
	// State
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<FilterState>({
		category: "All",
		followersMin: 0,
		followersMax: 10000000,
		engagementMin: 0,
		engagementMax: 10,
		location: "All",
		platform: "All",
	});

	const [selectedInfluencer, setSelectedInfluencer] =
		useState<Influencer | null>(null);
	const [comparisonList, setComparisonList] = useState<Influencer[]>([]);
	const [showComparison, setShowComparison] = useState(false);
	const [showCampaignModal, setShowCampaignModal] = useState(false);
	const [campaignInfluencer, setCampaignInfluencer] =
		useState<Influencer | null>(null);
	const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
	const [showFilters, setShowFilters] = useState(false);
	const [draggedInfluencer, setDraggedInfluencer] = useState<Influencer | null>(
		null
	);

	// Campaign form state
	const [campaignStep, setCampaignStep] = useState(1);
	const [campaignData, setCampaignData] = useState<CampaignProposal>({
		influencerId: "",
		campaignType: "",
		budget: "",
		duration: "",
		deliverables: [],
		timeline: "",
		message: "",
	});

	// Load data from localStorage on mount
	useEffect(() => {
		const savedSearchHistory = localStorage.getItem(
			"influencer_search_history"
		);
		const savedFilters = localStorage.getItem("influencer_filters");
		const savedComparison = localStorage.getItem("influencer_comparison");

		if (savedSearchHistory) {
			setSearchHistory(JSON.parse(savedSearchHistory));
		}
		if (savedFilters) {
			setFilters(JSON.parse(savedFilters));
		}
		if (savedComparison) {
			setComparisonList(JSON.parse(savedComparison));
		}
	}, []);

	// Save to localStorage whenever state changes
	useEffect(() => {
		localStorage.setItem(
			"influencer_search_history",
			JSON.stringify(searchHistory)
		);
	}, [searchHistory]);

	useEffect(() => {
		localStorage.setItem("influencer_filters", JSON.stringify(filters));
	}, [filters]);

	useEffect(() => {
		localStorage.setItem(
			"influencer_comparison",
			JSON.stringify(comparisonList)
		);
	}, [comparisonList]);

	// Filter influencers based on search and filters
	const filteredInfluencers = useMemo(() => {
		return mockInfluencers.filter((influencer) => {
			const matchesSearch =
				searchQuery === "" ||
				influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				influencer.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
				influencer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
				influencer.location.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesCategory =
				filters.category === "All" || influencer.category === filters.category;
			const matchesFollowers =
				influencer.followers >= filters.followersMin &&
				influencer.followers <= filters.followersMax;
			const matchesEngagement =
				influencer.engagementRate >= filters.engagementMin &&
				influencer.engagementRate <= filters.engagementMax;
			const matchesLocation =
				filters.location === "All" || influencer.location === filters.location;
			const matchesPlatform =
				filters.platform === "All" ||
				influencer.platforms.some((p) => p.name === filters.platform);

			return (
				matchesSearch &&
				matchesCategory &&
				matchesFollowers &&
				matchesEngagement &&
				matchesLocation &&
				matchesPlatform
			);
		});
	}, [searchQuery, filters]);

	// Handle search with history
	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);
			if (query && !searchHistory.some((h) => h.query === query)) {
				const newHistory = [
					{ query, timestamp: Date.now() },
					...searchHistory,
				].slice(0, 10);
				setSearchHistory(newHistory);
			}
		},
		[searchHistory]
	);

	// Drag and drop handlers
	const handleDragStart = (e: React.DragEvent, influencer: Influencer) => {
		setDraggedInfluencer(influencer);
		e.dataTransfer.effectAllowed = "copy";
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (
			draggedInfluencer &&
			!comparisonList.find((inf) => inf.id === draggedInfluencer.id)
		) {
			setComparisonList([...comparisonList, draggedInfluencer]);
		}
		setDraggedInfluencer(null);
	};

	// Campaign modal handlers
	const openCampaignModal = (influencer: Influencer) => {
		setCampaignInfluencer(influencer);
		setCampaignData({ ...campaignData, influencerId: influencer.id });
		setShowCampaignModal(true);
		setCampaignStep(1);
	};

	const formatNumber = (num: number): string => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		}
		return num.toString();
	};

	// Influencer Card Component
	const InfluencerCard: React.FC<{ influencer: Influencer }> = ({
		influencer,
	}) => (
		<div
			className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
			draggable
			onDragStart={(e) => handleDragStart(e, influencer)}
			onClick={() => setSelectedInfluencer(influencer)}
		>
			<div className="p-6">
				<div className="flex items-center space-x-4 mb-4">
					<div className="relative">
						<img
							src={influencer.avatar}
							alt={influencer.name}
							className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
						/>
						{influencer.verified && (
							<div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
								<div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
									<div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
								</div>
							</div>
						)}
					</div>
					<div className="flex-1">
						<h3 className="font-bold text-lg text-gray-900">
							{influencer.name}
						</h3>
						<p className="text-gray-600 text-sm">{influencer.handle}</p>
						<div className="flex items-center space-x-1 mt-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`w-3 h-3 ${
										i < Math.floor(influencer.rating)
											? "text-yellow-400 fill-current"
											: "text-gray-300"
									}`}
								/>
							))}
							<span className="text-xs text-gray-600 ml-1">
								{influencer.rating}
							</span>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Followers</span>
						<span className="font-semibold text-gray-900">
							{formatNumber(influencer.followers)}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Engagement</span>
						<span className="font-semibold text-green-600">
							{influencer.engagementRate}%
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Category</span>
						<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
							{influencer.category}
						</span>
					</div>

					<div className="flex items-center text-sm text-gray-600">
						<MapPin className="w-4 h-4 mr-1" />
						{influencer.location}
					</div>

					<div className="flex items-center space-x-2">
						{influencer.platforms.map((platform, index) => (
							<div
								key={index}
								className="flex items-center space-x-1 text-xs text-gray-600"
							>
								<platform.icon className="w-3 h-3" />
								<span>{formatNumber(platform.followers)}</span>
							</div>
						))}
					</div>

					<div className="pt-3 border-t border-gray-100">
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-600">Price Range</span>
							<span className="font-semibold text-gray-900">
								{influencer.priceRange}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-4 flex space-x-2">
					<button
						onClick={(e) => {
							e.stopPropagation();
							openCampaignModal(influencer);
						}}
						className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
					>
						Create Campaign
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							if (!comparisonList.find((inf) => inf.id === influencer.id)) {
								setComparisonList([...comparisonList, influencer]);
							}
						}}
						className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
					>
						Compare
					</button>
				</div>
			</div>
		</div>
	);

	// Detail Modal Component
	const DetailModal: React.FC<{
		influencer: Influencer;
		onClose: () => void;
	}> = ({ influencer, onClose }) => (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<img
							src={influencer.avatar}
							alt={influencer.name}
							className="w-16 h-16 rounded-full object-cover"
						/>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{influencer.name}
							</h2>
							<p className="text-gray-600">{influencer.handle}</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-6 h-6 text-gray-500" />
					</button>
				</div>

				<div className="p-6 space-y-8">
					{/* Bio and Basic Info */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
						<p className="text-gray-700 leading-relaxed">{influencer.bio}</p>
						<div className="mt-4 grid grid-cols-2 gap-4">
							<div className="bg-gray-50 p-4 rounded-lg">
								<h4 className="font-semibold text-gray-900">Price Range</h4>
								<p className="text-lg font-bold text-green-600">
									{influencer.priceRange}
								</p>
							</div>
							<div className="bg-gray-50 p-4 rounded-lg">
								<h4 className="font-semibold text-gray-900">
									Recent Collaborations
								</h4>
								<div className="flex flex-wrap gap-1 mt-2">
									{influencer.recentCollaborations.map((brand, index) => (
										<span
											key={index}
											className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
										>
											{brand}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Platform Statistics */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Platform Performance
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{influencer.platforms.map((platform, index) => (
								<div
									key={index}
									className="bg-white border border-gray-200 rounded-lg p-4"
								>
									<div className="flex items-center space-x-2 mb-3">
										<platform.icon className="w-5 h-5" />
										<span className="font-semibold">{platform.name}</span>
									</div>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">Followers</span>
											<span className="font-semibold">
												{formatNumber(platform.followers)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">Engagement</span>
											<span className="font-semibold text-green-600">
												{platform.engagementRate}%
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Charts */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<SimpleBarChart
							data={influencer.audienceDemographics.ageGroups.map((g) => ({
								label: g.range,
								value: g.percentage,
							}))}
							title="Audience Age Distribution"
						/>
						<SimpleBarChart
							data={influencer.audienceDemographics.genders.map((g) => ({
								label: g.type,
								value: g.percentage,
							}))}
							title="Audience Gender Distribution"
						/>
					</div>

					<SimpleLineChart
						data={influencer.engagementTrends}
						title="Engagement Trends (Last 6 Months)"
					/>

					{/* Top Content */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Top Performing Content
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{influencer.topContent.map((content) => (
								<div
									key={content.id}
									className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
								>
									<img
										src={content.thumbnail}
										alt={content.title}
										className="w-full h-32 object-cover"
									/>
									<div className="p-4">
										<h4 className="font-semibold text-gray-900 mb-2">
											{content.title}
										</h4>
										<div className="flex items-center space-x-4 text-sm text-gray-600">
											<div className="flex items-center space-x-1">
												<Heart className="w-4 h-4" />
												<span>{formatNumber(content.likes)}</span>
											</div>
											<div className="flex items-center space-x-1">
												<MessageCircle className="w-4 h-4" />
												<span>{formatNumber(content.comments)}</span>
											</div>
											<div className="flex items-center space-x-1">
												<Eye className="w-4 h-4" />
												<span>{formatNumber(content.views)}</span>
											</div>
										</div>
										<div className="mt-2">
											<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
												{content.platform}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// Comparison Modal Component
	const ComparisonModal: React.FC<{
		influencers: Influencer[];
		onClose: () => void;
	}> = ({ influencers, onClose }) => (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-900">
						Influencer Comparison
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-6 h-6 text-gray-500" />
					</button>
				</div>

				<div className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 font-semibold text-gray-900">
										Metric
									</th>
									{influencers.map((influencer) => (
										<th
											key={influencer.id}
											className="text-center py-3 px-4 min-w-[200px]"
										>
											<div className="flex flex-col items-center space-y-2">
												<img
													src={influencer.avatar}
													alt={influencer.name}
													className="w-12 h-12 rounded-full object-cover"
												/>
												<div>
													<p className="font-semibold text-gray-900">
														{influencer.name}
													</p>
													<p className="text-sm text-gray-600">
														{influencer.handle}
													</p>
												</div>
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{[
									{
										label: "Followers",
										getValue: (inf: Influencer) => formatNumber(inf.followers),
									},
									{
										label: "Engagement Rate",
										getValue: (inf: Influencer) => `${inf.engagementRate}%`,
									},
									{
										label: "Category",
										getValue: (inf: Influencer) => inf.category,
									},
									{
										label: "Location",
										getValue: (inf: Influencer) => inf.location,
									},
									{
										label: "Rating",
										getValue: (inf: Influencer) => `${inf.rating}/5`,
									},
									{
										label: "Price Range",
										getValue: (inf: Influencer) => inf.priceRange,
									},
								].map((row, rowIndex) => (
									<tr
										key={rowIndex}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-3 px-4 font-medium text-gray-900">
											{row.label}
										</td>
										{influencers.map((influencer) => (
											<td key={influencer.id} className="py-3 px-4 text-center">
												{row.getValue(influencer)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="mt-6 flex justify-center">
						<button
							onClick={() => setComparisonList([])}
							className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
						>
							Clear Comparison
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	// Campaign Modal Component
	const CampaignModal: React.FC = () => {
		const nextStep = () => setCampaignStep(Math.min(campaignStep + 1, 4));
		const prevStep = () => setCampaignStep(Math.max(campaignStep - 1, 1));

		const submitCampaign = () => {
			// Here you would typically send the campaign data to your backend
			console.log("Campaign submitted:", campaignData);
			alert("Campaign proposal sent successfully!");
			setShowCampaignModal(false);
			setCampaignStep(1);
			setCampaignData({
				influencerId: "",
				campaignType: "",
				budget: "",
				duration: "",
				deliverables: [],
				timeline: "",
				message: "",
			});
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
					<div className="sticky top-0 bg-white border-b border-gray-200 p-6">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-900">
								Create Campaign Proposal
							</h2>
							<button
								onClick={() => setShowCampaignModal(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X className="w-6 h-6 text-gray-500" />
							</button>
						</div>

						{/* Progress indicator */}
						<div className="mt-4 flex items-center space-x-2">
							{[1, 2, 3, 4].map((step) => (
								<div key={step} className="flex items-center">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
											step <= campaignStep
												? "bg-blue-600 text-white"
												: "bg-gray-200 text-gray-600"
										}`}
									>
										{step}
									</div>
									{step < 4 && (
										<div
											className={`w-8 h-1 ${
												step < campaignStep ? "bg-blue-600" : "bg-gray-200"
											}`}
										/>
									)}
								</div>
							))}
						</div>
					</div>

					<div className="p-6">
						{campaignStep === 1 && (
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-gray-900">
									Campaign Details
								</h3>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Campaign Type
									</label>
									<select
										value={campaignData.campaignType}
										onChange={(e) =>
											setCampaignData({
												...campaignData,
												campaignType: e.target.value,
											})
										}
										className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									>
										<option value="">Select campaign type</option>
										<option value="product-launch">Product Launch</option>
										<option value="brand-awareness">Brand Awareness</option>
										<option value="sponsored-post">Sponsored Post</option>
										<option value="giveaway">Giveaway/Contest</option>
										<option value="long-term">Long-term Partnership</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Budget Range
									</label>
									<select
										value={campaignData.budget}
										onChange={(e) =>
											setCampaignData({
												...campaignData,
												budget: e.target.value,
											})
										}
										className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									>
										<option value="">Select budget range</option>
										<option value="under-5k">Under $5,000</option>
										<option value="5k-10k">$5,000 - $10,000</option>
										<option value="10k-25k">$10,000 - $25,000</option>
										<option value="25k-50k">$25,000 - $50,000</option>
										<option value="over-50k">Over $50,000</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Campaign Duration
									</label>
									<select
										value={campaignData.duration}
										onChange={(e) =>
											setCampaignData({
												...campaignData,
												duration: e.target.value,
											})
										}
										className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									>
										<option value="">Select duration</option>
										<option value="1-week">1 Week</option>
										<option value="2-weeks">2 Weeks</option>
										<option value="1-month">1 Month</option>
										<option value="3-months">3 Months</option>
										<option value="6-months">6 Months</option>
										<option value="ongoing">Ongoing</option>
									</select>
								</div>
							</div>
						)}

						{campaignStep === 2 && (
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-gray-900">
									Deliverables
								</h3>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										What do you need?
									</label>
									<div className="space-y-3">
										{[
											"Instagram Posts",
											"Instagram Stories",
											"Instagram Reels",
											"YouTube Video",
											"TikTok Video",
											"Blog Post",
											"Product Review",
											"Unboxing Video",
											"Live Stream",
											"User-Generated Content",
										].map((deliverable) => (
											<label
												key={deliverable}
												className="flex items-center space-x-3"
											>
												<input
													type="checkbox"
													checked={campaignData.deliverables.includes(
														deliverable
													)}
													onChange={(e) => {
														if (e.target.checked) {
															setCampaignData({
																...campaignData,
																deliverables: [
																	...campaignData.deliverables,
																	deliverable,
																],
															});
														} else {
															setCampaignData({
																...campaignData,
																deliverables: campaignData.deliverables.filter(
																	(d) => d !== deliverable
																),
															});
														}
													}}
													className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
												/>
												<span className="text-gray-700">{deliverable}</span>
											</label>
										))}
									</div>
								</div>
							</div>
						)}

						{campaignStep === 3 && (
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-gray-900">
									Timeline & Requirements
								</h3>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Preferred Timeline
									</label>
									<select
										value={campaignData.timeline}
										onChange={(e) =>
											setCampaignData({
												...campaignData,
												timeline: e.target.value,
											})
										}
										className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									>
										<option value="">Select timeline</option>
										<option value="asap">ASAP</option>
										<option value="within-week">Within 1 Week</option>
										<option value="within-month">Within 1 Month</option>
										<option value="flexible">Flexible</option>
									</select>
								</div>
							</div>
						)}

						{campaignStep === 4 && (
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-gray-900">
									Personal Message
								</h3>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Message to {campaignInfluencer?.name}
									</label>
									<textarea
										value={campaignData.message}
										onChange={(e) =>
											setCampaignData({
												...campaignData,
												message: e.target.value,
											})
										}
										placeholder="Write a personalized message explaining your campaign goals and why you'd like to work with this influencer..."
										rows={6}
										className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
									/>
								</div>

								<div className="bg-gray-50 p-4 rounded-lg">
									<h4 className="font-semibold text-gray-900 mb-2">
										Campaign Summary
									</h4>
									<div className="space-y-1 text-sm text-gray-700">
										<p>
											<strong>Type:</strong> {campaignData.campaignType}
										</p>
										<p>
											<strong>Budget:</strong> {campaignData.budget}
										</p>
										<p>
											<strong>Duration:</strong> {campaignData.duration}
										</p>
										<p>
											<strong>Timeline:</strong> {campaignData.timeline}
										</p>
										<p>
											<strong>Deliverables:</strong>{" "}
											{campaignData.deliverables.join(", ")}
										</p>
									</div>
								</div>
							</div>
						)}

						<div className="mt-8 flex items-center justify-between">
							<button
								onClick={prevStep}
								disabled={campaignStep === 1}
								className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								Previous
							</button>

							{campaignStep < 4 ? (
								<button
									onClick={nextStep}
									className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
								>
									Next
								</button>
							) : (
								<button
									onClick={submitCampaign}
									className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
								>
									Send Proposal
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Influencer Matchmaker
							</h1>
							<p className="text-gray-600 mt-1">
								Find the perfect influencers for your brand campaigns
							</p>
						</div>

						{/* Comparison indicator */}
						{comparisonList.length > 0 && (
							<div
								className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
								onClick={() => setShowComparison(true)}
							>
								<div className="flex items-center space-x-2">
									<BarChart3 className="w-5 h-5" />
									<span>Compare ({comparisonList.length})</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* Search and Filters */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					{/* Search Bar */}
					<div className="relative mb-6">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search influencers by name, category, or location..."
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
						/>
					</div>

					{/* Search History */}
					{searchHistory.length > 0 && (
						<div className="mb-6">
							<h3 className="text-sm font-medium text-gray-700 mb-2">
								Recent Searches
							</h3>
							<div className="flex flex-wrap gap-2">
								{searchHistory.slice(0, 5).map((search, index) => (
									<button
										key={index}
										onClick={() => setSearchQuery(search.query)}
										className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
									>
										{search.query}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Filter Toggle */}
					<div className="flex items-center justify-between mb-4">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
						>
							<Filter className="w-5 h-5" />
							<span>Filters</span>
							{showFilters ? (
								<ChevronDown className="w-4 h-4" />
							) : (
								<ChevronRight className="w-4 h-4" />
							)}
						</button>

						{/* Results count */}
						<span className="text-sm text-gray-600">
							{filteredInfluencers.length} influencer
							{filteredInfluencers.length !== 1 ? "s" : ""} found
						</span>
					</div>

					{/* Filters */}
					{showFilters && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category
								</label>
								<select
									value={filters.category}
									onChange={(e) =>
										setFilters({ ...filters, category: e.target.value })
									}
									className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Location
								</label>
								<select
									value={filters.location}
									onChange={(e) =>
										setFilters({ ...filters, location: e.target.value })
									}
									className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									{locations.map((location) => (
										<option key={location} value={location}>
											{location}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Platform
								</label>
								<select
									value={filters.platform}
									onChange={(e) =>
										setFilters({ ...filters, platform: e.target.value })
									}
									className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									{platforms.map((platform) => (
										<option key={platform} value={platform}>
											{platform}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Followers Range
								</label>
								<div className="flex space-x-2">
									<input
										type="number"
										placeholder="Min"
										value={filters.followersMin || ""}
										onChange={(e) =>
											setFilters({
												...filters,
												followersMin: parseInt(e.target.value) || 0,
											})
										}
										className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
									<input
										type="number"
										placeholder="Max"
										value={
											filters.followersMax === 10000000
												? ""
												: filters.followersMax
										}
										onChange={(e) =>
											setFilters({
												...filters,
												followersMax: parseInt(e.target.value) || 10000000,
											})
										}
										className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Engagement Rate (%)
								</label>
								<div className="flex space-x-2">
									<input
										type="number"
										step="0.1"
										placeholder="Min"
										value={filters.engagementMin || ""}
										onChange={(e) =>
											setFilters({
												...filters,
												engagementMin: parseFloat(e.target.value) || 0,
											})
										}
										className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
									<input
										type="number"
										step="0.1"
										placeholder="Max"
										value={
											filters.engagementMax === 10 ? "" : filters.engagementMax
										}
										onChange={(e) =>
											setFilters({
												...filters,
												engagementMax: parseFloat(e.target.value) || 10,
											})
										}
										className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
							</div>

							<div className="flex items-end">
								<button
									onClick={() =>
										setFilters({
											category: "All",
											followersMin: 0,
											followersMax: 10000000,
											engagementMin: 0,
											engagementMax: 10,
											location: "All",
											platform: "All",
										})
									}
									className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
								>
									Reset Filters
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Comparison Drop Zone */}
			{comparisonList.length > 0 && (
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
					<div
						className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-4"
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<Grip className="w-5 h-5 text-blue-600" />
								<span className="text-blue-800 font-medium">
									Comparison List ({comparisonList.length})
								</span>
							</div>
							<div className="flex space-x-2">
								<button
									onClick={() => setShowComparison(true)}
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
								>
									Compare
								</button>
								<button
									onClick={() => setComparisonList([])}
									className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
								>
									Clear
								</button>
							</div>
						</div>
						{comparisonList.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2">
								{comparisonList.map((influencer) => (
									<div
										key={influencer.id}
										className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg"
									>
										<img
											src={influencer.avatar}
											alt={influencer.name}
											className="w-6 h-6 rounded-full object-cover"
										/>
										<span className="text-sm font-medium text-gray-900">
											{influencer.name}
										</span>
										<button
											onClick={() =>
												setComparisonList(
													comparisonList.filter(
														(inf) => inf.id !== influencer.id
													)
												)
											}
											className="text-gray-500 hover:text-red-600 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Influencer Grid */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
				{filteredInfluencers.length === 0 ? (
					<div className="text-center py-12">
						<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No influencers found
						</h3>
						<p className="text-gray-600">
							Try adjusting your search or filter criteria
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredInfluencers.map((influencer) => (
							<InfluencerCard key={influencer.id} influencer={influencer} />
						))}
					</div>
				)}
			</div>

			{/* Modals */}
			{selectedInfluencer && (
				<DetailModal
					influencer={selectedInfluencer}
					onClose={() => setSelectedInfluencer(null)}
				/>
			)}

			{showComparison && comparisonList.length > 0 && (
				<ComparisonModal
					influencers={comparisonList}
					onClose={() => setShowComparison(false)}
				/>
			)}

			{showCampaignModal && <CampaignModal />}
		</div>
	);
};

export default InfluencerMatchmaker;