"use client";

import React, { useState, useEffect } from "react";
import {
	X,
	Bell,
	Search,
	Coffee,
	Utensils,
	Cake,
	Leaf,
	GlassWater,
	Croissant,
	ChefHat,
	Clock,
	Users,
	CheckCircle,
	UserPlus,
	Star,
	StarHalf,
	Heart,
	MessageCircle,
	BookOpen,
	Save,
	LayoutGrid,
	Plus,
	Globe,
	ThumbsUp,
	Filter,
	User,
	Settings,
	LogOut,
	Share2,
} from "lucide-react";

import { Toaster, toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

type User = {
	id: string;
	username: string;
	name: string;
	profileImage: string;
	following: number;
	followers: number;
	bio: string;
	location: string;
	joinDate: string;
	recipeCount: number;
};

type Recipe = {
	id: string;
	title: string;
	description: string;
	authorId: string;
	authorName: string;
	authorImage: string;
	coverImage: string;
	preparationTime: number;
	cookingTime: number;
	servings: number;
	difficulty: "Easy" | "Medium" | "Hard";
	cuisine: string;
	ingredients: Ingredient[];
	instructions: string[];
	likes: number;
	comments: Comment[];
	savedCount: number;
	createdAt: string;
	nutritionFacts: NutritionFacts;
	tags: string[];
	rating: number;
	categories: string[];
	ratingCount?: number;
};

type Ingredient = {
	name: string;
	amount: string;
	unit: string;
};

type Comment = {
	id: string;
	userId: string;
	username: string;
	userImage: string;
	content: string;
	createdAt: string;
	likes: number;
};

type NutritionFacts = {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
	fiber: number;
	sugar: number;
};

type Notification = {
	id: string;
	type: "like" | "comment" | "follow" | "mention";
	content: string;
	from: {
		id: string;
		name: string;
		image: string;
	};
	createdAt: string;
	read: boolean;
	relatedItemId: string;
};
type RecipeCategory = {
	id: string;
	name: string;
	icon: React.ReactNode; 
	description: string;
	slug: string;
};

const recipeCategories: RecipeCategory[] = [
	{
		id: "cat1",
		name: "Breakfast",
		icon: <Coffee className="h-5 w-5" />,
		description: "Start your day with these delicious breakfast recipes",
		slug: "breakfast",
	},
	{
		id: "cat2",
		name: "Main Dishes",
		icon: <Utensils className="h-5 w-5" />,
		description: "Satisfying main courses for lunch and dinner",
		slug: "main-dishes",
	},
	{
		id: "cat3",
		name: "Desserts",
		icon: <Cake className="h-5 w-5" />,
		description: "Sweet treats to end your meal",
		slug: "desserts",
	},
	{
		id: "cat4",
		name: "Vegetarian",
		icon: <Leaf className="h-5 w-5" />,
		description: "Delicious meat-free recipes",
		slug: "vegetarian",
	},
	{
		id: "cat5",
		name: "Quick & Easy",
		icon: <Clock className="h-5 w-5" />,
		description: "Ready in 30 minutes or less",
		slug: "quick-easy",
	},
	{
		id: "cat6",
		name: "Healthy",
		icon: <Heart className="h-5 w-5" />,
		description: "Nutritious and balanced meals",
		slug: "healthy",
	},
	{
		id: "cat7",
		name: "Baking",
		icon: <Croissant className="h-5 w-5" />,
		description: "Breads, pastries, and baked goods",
		slug: "baking",
	},
	{
		id: "cat8",
		name: "Drinks",
		icon: <GlassWater className="h-5 w-5" />,
		description: "Refreshing beverages and cocktails",
		slug: "drinks",
	},
];

const mockUsers: User[] = [
	{
		id: "user1",
		username: "olivia_pasta",
		name: "Olivia Martinez",
		profileImage:
			"https://img.freepik.com/premium-vector/man-profile_1083548-15963.jpg?w=1380",
		following: 245,
		followers: 1890,
		bio: "Professional chef with a passion for Italian cuisine. Cookbook author & food blogger.",
		location: "Milan, Italy",
		joinDate: "May 2022",
		recipeCount: 78,
	},
	{
		id: "user2",
		username: "chef_thomas",
		name: "Thomas Chen",
		profileImage:
			"https://img.freepik.com/premium-vector/portrait-middle-age-male-man-with-ball-hidden_684058-2608.jpg?w=1380",
		following: 102,
		followers: 3450,
		bio: "Culinary school graduate specializing in fusion Asian cuisine. Food photographer.",
		location: "Singapore",
		joinDate: "January 2021",
		recipeCount: 156,
	},
	{
		id: "user3",
		username: "dessert_queen",
		name: "Sarah Johnson",
		profileImage:
			"https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg?t=st=1743355875~exp=1743359475~hmac=aad09d49ad50dee6b132a48a6443d5551e105707ab1ceb376fbb8fdaa659a28a&w=1380",
		following: 320,
		followers: 5600,
		bio: "Pastry chef with a sweet tooth. Creating decadent desserts that look as good as they taste!",
		location: "Paris, France",
		joinDate: "April 2023",
		recipeCount: 94,
	},
];

const mockRecipes: Recipe[] = [
	{
		id: "recipe1",
		title: "Authentic Carbonara",
		description:
			"Traditional Roman pasta dish with eggs, cheese, pancetta, and pepper.",
		authorId: "user1",
		authorName: "Olivia Martinez",
		authorImage:
			"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
		coverImage:
			"https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=640",
		preparationTime: 15,
		cookingTime: 15,
		servings: 4,
		difficulty: "Medium",
		cuisine: "Italian",
		ingredients: [
			{ name: "Spaghetti", amount: "400", unit: "g" },
			{ name: "Guanciale", amount: "150", unit: "g" },
			{ name: "Egg yolks", amount: "6", unit: "" },
			{ name: "Pecorino Romano", amount: "50", unit: "g" },
			{ name: "Black pepper", amount: "2", unit: "tsp" },
		],
		instructions: [
			"Bring a large pot of salted water to boil and cook spaghetti according to package instructions.",
			"While pasta is cooking, heat a large skillet over medium heat. Add diced guanciale and cook until crispy, about 5 minutes.",
			"In a bowl, whisk together egg yolks and grated pecorino cheese. Season with black pepper.",
			"Drain pasta, reserving a cup of pasta water. Add pasta to the skillet with guanciale, toss to coat in the fat.",
			"Remove from heat, add the egg mixture, stirring quickly. If needed, add a splash of pasta water to create a creamy sauce.",
			"Serve immediately with extra grated cheese and black pepper.",
		],
		likes: 1245,
		comments: [
			{
				id: "comment1",
				userId: "user2",
				username: "chef_thomas",
				userImage:
					"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
				content:
					"Finally, a carbonara recipe without cream! Perfect execution.",
				createdAt: "2 days ago",
				likes: 28,
			},
			{
				id: "comment2",
				userId: "user3",
				username: "dessert_queen",
				userImage:
					"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
				content:
					"Made this last night and it was incredible! The technique is everything.",
				createdAt: "1 day ago",
				likes: 15,
			},
		],
		savedCount: 876,
		createdAt: "March 15, 2025",
		nutritionFacts: {
			calories: 520,
			protein: 24,
			carbs: 58,
			fat: 22,
			fiber: 2,
			sugar: 1,
		},
		tags: ["pasta", "italian", "dinner", "quick", "traditional"],
		rating: 4.8,
		categories: ["cat2", "cat5"], 
		ratingCount: 260,
	},
	{
		id: "recipe2",
		title: "Mango Sticky Rice",
		description:
			"Sweet Thai dessert made with glutinous rice, fresh mango, and coconut milk.",
		authorId: "user2",
		authorName: "Thomas Chen",
		authorImage:
			"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
		coverImage:
			"https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=640",
		preparationTime: 20,
		cookingTime: 30,
		servings: 4,
		difficulty: "Easy",
		cuisine: "Thai",
		ingredients: [
			{ name: "Glutinous rice", amount: "250", unit: "g" },
			{ name: "Coconut milk", amount: "400", unit: "ml" },
			{ name: "Sugar", amount: "100", unit: "g" },
			{ name: "Salt", amount: "1/4", unit: "tsp" },
			{ name: "Ripe mangoes", amount: "2", unit: "" },
			{ name: "Toasted mung beans", amount: "2", unit: "tbsp" },
		],
		instructions: [
			"Soak the glutinous rice in water for at least 4 hours or overnight.",
			"Drain the rice and steam for 25-30 minutes until cooked.",
			"In a pot, heat 300ml coconut milk with sugar and salt until sugar dissolves. Do not boil.",
			"Pour the warm coconut milk mixture over the hot steamed rice and stir well. Cover and let sit for 30 minutes.",
			"Mix the remaining coconut milk with a pinch of salt and set aside as a sauce.",
			"Peel and slice the mangoes. Serve the sticky rice with mango slices, drizzle with coconut sauce, and sprinkle with toasted mung beans.",
		],
		likes: 956,
		comments: [
			{
				id: "comment3",
				userId: "user1",
				username: "olivia_pasta",
				userImage:
					"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
				content:
					"I never thought making this at home would be so simple! Delicious!",
				createdAt: "3 days ago",
				likes: 32,
			},
		],
		savedCount: 724,
		createdAt: "March 20, 2025",
		nutritionFacts: {
			calories: 420,
			protein: 5,
			carbs: 76,
			fat: 12,
			fiber: 3,
			sugar: 36,
		},
		tags: ["dessert", "thai", "fruit", "sweet", "asian"],
		rating: 4.7,
		categories: ["cat3", "cat4"], 
		ratingCount: 190,
	},
	{
		id: "recipe3",
		title: "Chocolate Soufflé",
		description:
			"Light and fluffy chocolate dessert that's sure to impress your guests.",
		authorId: "user3",
		authorName: "Sarah Johnson",
		authorImage:
			"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
		coverImage:
			"https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=640",
		preparationTime: 25,
		cookingTime: 15,
		servings: 6,
		difficulty: "Hard",
		cuisine: "French",
		ingredients: [
			{ name: "Dark chocolate", amount: "200", unit: "g" },
			{ name: "Butter", amount: "50", unit: "g" },
			{ name: "Eggs", amount: "6", unit: "" },
			{ name: "Sugar", amount: "100", unit: "g" },
			{ name: "Flour", amount: "2", unit: "tbsp" },
			{ name: "Vanilla extract", amount: "1", unit: "tsp" },
		],
		instructions: [
			"Preheat oven to 375°F (190°C). Butter six ramekins and coat with sugar.",
			"Melt chocolate and butter together in a double boiler.",
			"Separate eggs. Add egg yolks to the chocolate mixture and stir well.",
			"In a separate bowl, whip egg whites until foamy. Gradually add sugar and continue whipping until stiff peaks form.",
			"Fold flour into the chocolate mixture, then gently fold in the egg whites in three additions.",
			"Pour the batter into the prepared ramekins and smooth the tops.",
			"Bake for 12-15 minutes until risen but still slightly wobbly in the center.",
			"Serve immediately with a dusting of powdered sugar.",
		],
		likes: 1876,
		comments: [
			{
				id: "comment4",
				userId: "user2",
				username: "chef_thomas",
				userImage:
					"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
				content:
					"Tried this recipe for Valentine's Day dinner. It was perfect!",
				createdAt: "1 week ago",
				likes: 54,
			},
			{
				id: "comment5",
				userId: "user1",
				username: "olivia_pasta",
				userImage:
					"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
				content:
					"The detailed instructions helped me nail this on the first try. Thanks Sarah!",
				createdAt: "5 days ago",
				likes: 42,
			},
		],
		savedCount: 1245,
		createdAt: "March 10, 2025",
		nutritionFacts: {
			calories: 320,
			protein: 8,
			carbs: 28,
			fat: 20,
			fiber: 2,
			sugar: 24,
		},
		tags: ["dessert", "chocolate", "french", "baking", "impressive"],
		rating: 4.9,
		categories: ["cat3", "cat7"],
		ratingCount: 390,
	},
];

const mockNotifications: Notification[] = [
	{
		id: "notif1",
		type: "like",
		content: "liked your Authentic Carbonara recipe",
		from: {
			id: "user2",
			name: "Thomas Chen",
			image:
				"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
		},
		createdAt: "10 minutes ago",
		read: false,
		relatedItemId: "recipe1",
	},
	{
		id: "notif2",
		type: "comment",
		content: "commented on your Chocolate Soufflé recipe",
		from: {
			id: "user1",
			name: "Olivia Martinez",
			image:
				"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
		},
		createdAt: "1 hour ago",
		read: false,
		relatedItemId: "recipe3",
	},
	{
		id: "notif3",
		type: "follow",
		content: "started following you",
		from: {
			id: "user3",
			name: "Sarah Johnson",
			image:
				"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1743353878~exp=1743357478~hmac=fcfde4f041958d7b7705be89ef14fafd37a4cd3fe542f6926b4fb46a5e2088bf&w=1060",
		},
		createdAt: "2 days ago",
		read: true,
		relatedItemId: "user3",
	},
];


const cuisineOptions = [
	"Italian",
	"French",
	"Japanese",
	"Chinese",
	"Indian",
	"Mexican",
	"Thai",
	"Mediterranean",
	"American",
	"Middle Eastern",
	"Korean",
	"Spanish",
	"Greek",
];


export default function RecipeblogExport() {

	const [activeTab, setActiveTab] = useState("discover");
	const [userRatings, setUserRatings] = useState<{ [key: string]: number }>({});
	const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
	const [followedUsers, setFollowedUsers] = useState<string[]>([]);
	const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
	const [likedRecipes, setLikedRecipes] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
	const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
	const [isCreateRecipeModalOpen, setIsCreateRecipeModalOpen] = useState(false);
	const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
		useState(false);
	const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [activeFilters, setActiveFilters] = useState({
		cuisine: "",
		difficulty: "",
		timeRange: "all", 
		category: "",
	});

	const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
		title: "",
		description: "",
		ingredients: [],
		instructions: [],
		preparationTime: 0,
		cookingTime: 0,
		servings: 2,
		difficulty: "Medium",
		cuisine: "",
		tags: [],
	});
	useEffect(() => {
		const savedFollowing = localStorage.getItem("followedUsers");
		if (savedFollowing) {
			setFollowedUsers(JSON.parse(savedFollowing));
		}
	}, []);
	useEffect(() => {
		const savedRatings = localStorage.getItem("userRatings");
		if (savedRatings) {
			setUserRatings(JSON.parse(savedRatings));
		}
	}, []);


	useEffect(() => {
		localStorage.setItem("userRatings", JSON.stringify(userRatings));
	}, [userRatings]);
	
	useEffect(() => {
		localStorage.setItem("followedUsers", JSON.stringify(followedUsers));
	}, [followedUsers]);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isFilterMenuOpen && !event.target.closest("[data-filter-menu]")) {
				setIsFilterMenuOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isFilterMenuOpen]);

	useEffect(() => {
		if (
			searchQuery.trim() === "" &&
			activeFilters.cuisine === "" &&
			activeFilters.difficulty === "" &&
			activeFilters.timeRange === "all"
		) {
			setFilteredRecipes(recipes);
		} else {
			let filtered = [...recipes];

			
			if (searchQuery.trim() !== "") {
				const query = searchQuery.toLowerCase();
				filtered = filtered.filter(
					(recipe) =>
						recipe.title.toLowerCase().includes(query) ||
						recipe.description.toLowerCase().includes(query) ||
						recipe.tags.some((tag) => tag.toLowerCase().includes(query)) ||
						recipe.cuisine.toLowerCase().includes(query) ||
						recipe.authorName.toLowerCase().includes(query)
				);
			}

			
			if (activeFilters.cuisine) {
				filtered = filtered.filter(
					(recipe) => recipe.cuisine === activeFilters.cuisine
				);
			}

			
			if (activeFilters.difficulty) {
				filtered = filtered.filter(
					(recipe) => recipe.difficulty === activeFilters.difficulty
				);
			}

			// Apply time range filter
			if (activeFilters.timeRange !== "all") {
				const totalTime = (recipe) =>
					recipe.preparationTime + recipe.cookingTime;

				if (activeFilters.timeRange === "quick") {
					filtered = filtered.filter((recipe) => totalTime(recipe) <= 30);
				} else if (activeFilters.timeRange === "medium") {
					filtered = filtered.filter(
						(recipe) => totalTime(recipe) > 30 && totalTime(recipe) <= 60
					);
				} else if (activeFilters.timeRange === "long") {
					filtered = filtered.filter((recipe) => totalTime(recipe) > 60);
				}
			}
			if (activeFilters.category) {
				filtered = filtered.filter((recipe) =>
					recipe.categories.includes(activeFilters.category)
				);
			}

			setFilteredRecipes(filtered);
		}
	}, [
		searchQuery,
		recipes,
		activeFilters.cuisine,
		activeFilters.difficulty,
		activeFilters.timeRange,
	]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				isNotificationDrawerOpen &&
				event.target.closest("[data-notification-drawer]") === null
			) {
				setIsNotificationDrawerOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isNotificationDrawerOpen]);
	useEffect(() => {
		const savedLikes = localStorage.getItem("likedRecipes");
		if (savedLikes) {
			setLikedRecipes(JSON.parse(savedLikes));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes));
	}, [likedRecipes]);

	useEffect(() => {
		const savedCookbook = localStorage.getItem("savedRecipes");
		if (savedCookbook) {
			setSavedRecipes(JSON.parse(savedCookbook));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
	}, [savedRecipes]);
	const handleRateRecipe = (recipeId: string, rating: number) => {
		setUserRatings((prev) => ({
			...prev,
			[recipeId]: rating,
		}));

		setRecipes((prevRecipes) =>
			prevRecipes.map((recipe) => {
				if (recipe.id === recipeId) {
					const oldTotal = recipe.rating * recipe.ratingCount;
					const newTotal = oldTotal + rating;
					const newCount = recipe.ratingCount + 1;
					const newAverage = newTotal / newCount;

					return {
						...recipe,
						rating: parseFloat(newAverage.toFixed(1)),
						ratingCount: newCount,
					};
				}
				return recipe;
			})
		);

		toast.success("Rating submitted!", {
			description: `You rated this recipe ${rating} stars.`,
			duration: 3000,
		});
	};
	const handleFollowUser = (userId: string) => {
		if (followedUsers.includes(userId)) {
			setFollowedUsers((prev) => prev.filter((id) => id !== userId));
			setCurrentUser((prev) => ({
				...prev,
				following: prev.following - 1,
			}));

			const userToUnfollow = mockUsers.find((user) => user.id === userId);
			if (userToUnfollow) {
				toast.error("Unfollowed", {
					description: `You are no longer following ${userToUnfollow.name}.`,
					duration: 3000,
				});
			}
		} else {
			setFollowedUsers((prev) => [...prev, userId]);
			setCurrentUser((prev) => ({
				...prev,
				following: prev.following + 1,
			}));

			const userToFollow = mockUsers.find((user) => user.id === userId);
			if (userToFollow) {
				toast.success("Followed!", {
					description: `You are now following ${userToFollow.name}.`,
					duration: 3000,
				});
			}
		}
	};
	const handleLikeRecipe = (recipeId: string) => {
		setIsLoading({ ...isLoading, [`like-${recipeId}`]: true });

		setTimeout(() => {
			if (likedRecipes.includes(recipeId)) {
				setLikedRecipes((prev) => prev.filter((id) => id !== recipeId));
				setRecipes((prevRecipes) =>
					prevRecipes.map((recipe) =>
						recipe.id === recipeId
							? { ...recipe, likes: recipe.likes - 1 }
							: recipe
					)
				);
				toast.error("Recipe unliked", {
					description:
						"This recipe has been removed from your liked collection.",
					duration: 3000,
				});
			} else {
				setLikedRecipes((prev) => [...prev, recipeId]);
				setRecipes((prevRecipes) =>
					prevRecipes.map((recipe) =>
						recipe.id === recipeId
							? { ...recipe, likes: recipe.likes + 1 }
							: recipe
					)
				);
				toast.success("Recipe liked!", {
					description: "This recipe has been added to your liked collection.",
					duration: 3000,
				});
			}

			setIsLoading({ ...isLoading, [`like-${recipeId}`]: false });
		}, 300); 
	};
	const isRecipeLiked = (recipeId: string | undefined) => {
		if (!recipeId) return false;
		return likedRecipes.includes(recipeId);
	};

	const handleSaveRecipe = (recipeId: string) => {
		if (savedRecipes.includes(recipeId)) {
			setSavedRecipes((prev) => prev.filter((id) => id !== recipeId));
			setRecipes((prevRecipes) =>
				prevRecipes.map((recipe) =>
					recipe.id === recipeId
						? { ...recipe, savedCount: recipe.savedCount - 1 }
						: recipe
				)
			);
			toast.error("Recipe removed from cookbook!", {
				description: "This recipe has been removed from your cookbook.",
				duration: 3000,
			});
		} else {
			setSavedRecipes((prev) => [...prev, recipeId]);
			setRecipes((prevRecipes) =>
				prevRecipes.map((recipe) =>
					recipe.id === recipeId
						? { ...recipe, savedCount: recipe.savedCount + 1 }
						: recipe
				)
			);
			toast.success("Recipe saved!", {
				description: "This recipe has been added to your cookbook.",
				duration: 3000,
			});
		}
	};

	const handleAddComment = (recipeId: string, comment: string) => {
		if (!comment.trim()) return;

		const newComment: Comment = {
			id: `comment${Date.now()}`,
			userId: currentUser.id,
			username: currentUser.username,
			userImage: currentUser.profileImage,
			content: comment,
			createdAt: "Just now",
			likes: 0,
		};

		setRecipes((prevRecipes) =>
			prevRecipes.map((recipe) =>
				recipe.id === recipeId
					? { ...recipe, comments: [newComment, ...recipe.comments] }
					: recipe
			)
		);

		if (selectedRecipe && selectedRecipe.id === recipeId) {
			setSelectedRecipe({
				...selectedRecipe,
				comments: [newComment, ...selectedRecipe.comments],
			});
		}

		toast.success("Comment posted!", {
			description: "Your comment has been posted successfully.",
			duration: 3000,
		});
	};

	const handleCreateRecipe = () => {
		if (!newRecipe.title || !newRecipe.description) {
			toast.error("Missing information", {
				description: "Please fill in all required fields.",
				duration: 3000,
			});
			return;
		}

		const createdRecipe: Recipe = {
			id: `recipe${Date.now()}`,
			title: newRecipe.title || "Untitled Recipe",
			description: newRecipe.description || "No description provided",
			authorId: currentUser.id,
			authorName: currentUser.name,
			authorImage: currentUser.profileImage,
			coverImage: "/api/placeholder/640/360",
			preparationTime: newRecipe.preparationTime || 0,
			cookingTime: newRecipe.cookingTime || 0,
			servings: newRecipe.servings || 2,
			difficulty: newRecipe.difficulty || "Medium",
			cuisine: newRecipe.cuisine || "Other",
			ingredients: newRecipe.ingredients || [],
			instructions: newRecipe.instructions || [],
			likes: 0,
			comments: [],
			savedCount: 0,
			createdAt: "Just now",
			nutritionFacts: {
				calories: 0,
				protein: 0,
				carbs: 0,
				fat: 0,
				fiber: 0,
				sugar: 0,
			},
			tags: newRecipe.tags || [],
			rating: 0,
		};

		setRecipes((prevRecipes) => [createdRecipe, ...prevRecipes]);
		setNewRecipe({
			title: "",
			description: "",
			ingredients: [],
			instructions: [],
			preparationTime: 0,
			cookingTime: 0,
			servings: 2,
			difficulty: "Medium",
			cuisine: "",
			tags: [],
		});

		setIsCreateRecipeModalOpen(false);

		toast.error("Recipe published!", {
			description: "Your new recipe has been published successfully.",
			duration: 3000,
		});
	};

	const handleOpenRecipeDetails = (recipe: Recipe) => {
		setSelectedRecipe(recipe);
		setIsRecipeModalOpen(true);
	};

	const handleOpenUserProfile = (userId: string) => {
		const user = mockUsers.find((u) => u.id === userId);
		if (user) {
			setSelectedUser(user);
			setIsUserProfileModalOpen(true);
		}
	};

	const StarRating = ({ rating }: { rating: number }) => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;

		return (
			<div className="flex items-center">
				{[...Array(fullStars)].map((_, i) => (
					<Star
						key={`star-${i}`}
						className="w-4 h-4 fill-amber-400 text-amber-400"
					/>
				))}
				{hasHalfStar && (
					<StarHalf className="w-4 h-4 fill-amber-400 text-amber-400" />
				)}
				{[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
					<Star key={`empty-star-${i}`} className="w-4 h-4 text-amber-400" />
				))}
				<span className="ml-1 text-sm text-amber-400">{rating.toFixed(1)}</span>
			</div>
		);
	};

	const NutritionChart = ({
		nutritionFacts,
	}: {
		nutritionFacts: NutritionFacts;
	}) => {
		const data = [
			{ name: "Protein", value: nutritionFacts.protein, color: "#38bdf8" },
			{ name: "Carbs", value: nutritionFacts.carbs, color: "#fb7185" },
			{ name: "Fat", value: nutritionFacts.fat, color: "#fbbf24" },
			{ name: "Fiber", value: nutritionFacts.fiber, color: "#34d399" },
			{ name: "Sugar", value: nutritionFacts.sugar, color: "#a78bfa" },
		];

		return (
			<div className="h-[200px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							innerRadius={60}
							outerRadius={80}
							paddingAngle={5}
							dataKey="value"
							label={({ name, value }) => `${name}: ${value}g`}
							labelLine={false}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<RechartsTooltip />
					</PieChart>
				</ResponsiveContainer>
			</div>
		);
	};

	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
	};

	const staggerContainer = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};
	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 font-sans">
			<Toaster richColors position="top-right" />
			<nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg shadow-md">
							<ChefHat className="h-6 w-6 text-white" />
						</div>
						<h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
							Globites
						</h1>
					</div>

					<div className="hidden md:flex items-center flex-1 max-w-xl mx-10">
						<div className="relative w-full group">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-orange-500 transition-colors" />
							<Input
								type="text"
								placeholder="Search recipes, ingredients, cuisines..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 bg-gray-50 border-gray-200 rounded-full focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-300 shadow-sm"
							/>
						</div>
					</div>


					<div className="flex items-center space-x-4">

						<div className="md:hidden">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
								className="hover:bg-gray-100 rounded-full cursor-pointer"
							>
								<Search className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors" />
							</Button>
						</div>

						<Button
							variant="default"
							size="sm"
							className="hidden md:flex cursor-pointer items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-sm"
							onClick={() => setIsCreateRecipeModalOpen(true)}
						>
							<Plus className="h-4 w-4" />
							<span>New Recipe</span>
						</Button>


						<div className="relative">
							<Button
								variant="ghost"
								size="icon"
								onClick={() =>
									setIsNotificationDrawerOpen(!isNotificationDrawerOpen)
								}
								className="relative hover:bg-gray-100 rounded-full cursor-pointer"
							>
								<Bell className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors" />
								{notifications.some((n) => !n.read) && (
									<span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
								)}
							</Button>

							{isNotificationDrawerOpen && (
								<motion.div
									data-notification-drawer
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-20"
								>
									<div className="p-4 border-b border-gray-200 flex justify-between items-center">
										<h3 className="font-semibold text-gray-800">
											Notifications
										</h3>
										<Badge
											variant="outline"
											className="bg-gray-100 text-gray-600 text-xs border-gray-200"
										>
											{notifications.filter((n) => !n.read).length} new
										</Badge>
									</div>
									<div className="max-h-96 overflow-y-auto">
										{notifications.length === 0 ? (
											<div className="p-8 text-center text-gray-500">
												<Bell className="h-10 w-10 mx-auto mb-3 text-gray-300" />
												<p>No notifications yet</p>
											</div>
										) : (
											notifications.map((notification) => (
												<motion.div
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													key={notification.id}
													className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
														!notification.read ? "bg-orange-50" : ""
													}`}
												>
													<div className="flex items-start space-x-3">
														<Avatar className="h-9 w-9 border-2 border-orange-100">
															<AvatarImage
																src={notification.from.image}
																alt={notification.from.name}
															/>
															<AvatarFallback className="bg-orange-100 text-orange-600">
																{notification.from.name.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<div className="flex-1 space-y-1">
															<p className="text-sm leading-tight">
																<span className="font-medium text-gray-900">
																	{notification.from.name}
																</span>{" "}
																<span className="text-gray-700">
																	{notification.content}
																</span>
															</p>
															<p className="text-xs text-gray-500">
																{notification.createdAt}
															</p>
														</div>
													</div>
												</motion.div>
											))
										)}
									</div>
									<div className="p-3 border-t border-gray-200 text-center bg-gray-50">
										<Button
											variant="ghost"
											size="sm"
											className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 text-xs w-full transition-colors"
										>
											Mark all as read
										</Button>
									</div>
								</motion.div>
							)}
						</div>

						{/* User Profile Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-9 w-9 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-orange-200 transition-all"
									size="icon"
								>
									<Avatar className="h-full w-full">
										<AvatarImage
											src={currentUser.profileImage}
											alt={currentUser.name}
										/>
										<AvatarFallback className="bg-orange-100 text-orange-600">
											{currentUser.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56 bg-white border-gray-200 rounded-xl shadow-xl"
								align="end"
							>
								<div className="p-2">
									<div className="flex items-center space-x-3 p-2 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 mb-1">
										<Avatar className="h-10 w-10 border-2 border-white">
											<AvatarImage
												src={currentUser.profileImage}
												alt={currentUser.name}
											/>
											<AvatarFallback className="bg-orange-100 text-orange-600">
												{currentUser.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium text-gray-900">
												{currentUser.name}
											</p>
											<p className="text-xs text-gray-500">
												@{currentUser.username}
											</p>
										</div>
									</div>
								</div>
								<DropdownMenuSeparator className="bg-gray-200" />
								<div className="p-1">
									<DropdownMenuItem
										className="hover:bg-orange-50 rounded-lg cursor-pointer px-2 py-1.5 flex items-center"
										onClick={() => handleOpenUserProfile(currentUser.id)}
									>
										<User className="w-4 h-4 mr-2 text-orange-500" />
										<span>My Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="hover:bg-orange-50 rounded-lg cursor-pointer px-2 py-1.5 flex items-center"
										onClick={() => {
											setActiveTab("cookbook");
											// Close dropdown if needed
										}}
									>
										<BookOpen className="w-4 h-4 mr-2 text-orange-500" />
										<span>My Cookbook</span>
									</DropdownMenuItem>
									<DropdownMenuItem className="hover:bg-orange-50 rounded-lg cursor-pointer px-2 py-1.5 flex items-center">
										<Settings className="w-4 h-4 mr-2 text-orange-500" />
										<span>Settings</span>
									</DropdownMenuItem>
								</div>
								<DropdownMenuSeparator className="bg-gray-200" />
								<div className="p-1">
									<DropdownMenuItem className="hover:bg-red-50 rounded-lg cursor-pointer px-2 py-1.5 flex items-center text-red-500 hover:text-red-600">
										<LogOut className="w-4 h-4 mr-2" />
										<span>Log out</span>
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				{isMobileSearchOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden px-4 pb-3"
					>
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								type="text"
								placeholder="Search recipes, ingredients..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 bg-gray-50 border-gray-200 rounded-full focus:border-orange-500 focus:ring-orange-500/30"
								autoFocus
							/>
						</div>
					</motion.div>
				)}
			</nav>

			<main className="container mx-auto px-4 py-6">
				<Tabs
					defaultValue="discover"
					className="w-full"
					onValueChange={setActiveTab}
					value={activeTab}
				>
					<div className="flex justify-between items-center mb-6">
						<TabsList className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
							<TabsTrigger
								value="discover"
								className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
							>
								<Globe className="h-4 w-4 mr-2" />
								Discover
							</TabsTrigger>
							<TabsTrigger
								value="trending"
								className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
							>
								<Star className="h-4 w-4 mr-2" />
								Trending
							</TabsTrigger>
							<TabsTrigger
								value="following"
								className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
							>
								<Users className="h-4 w-4 mr-2" />
								Following
							</TabsTrigger>
							<TabsTrigger
								value="cookbook"
								className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
							>
								<BookOpen className="h-4 w-4 mr-2" />
								Cookbook
							</TabsTrigger>
							<TabsTrigger
								value="categories"
								className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
							>
								<LayoutGrid className="h-4 w-4 mr-2" />
								Categories
							</TabsTrigger>
						</TabsList>

						<div
							className="flex items-center space-x-2 relative"
							data-filter-menu
						>
							<Button
								variant="outline"
								size="sm"
								className="text-gray-600 cursor-pointer hover:text-orange-500 border-gray-200 hover:border-orange-200 hover:bg-orange-50 rounded-lg transition-colors"
								onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
							>
								<Filter className="h-4 w-4 mr-1.5" />
								Filters
								{Object.values(activeFilters).some(
									(v) => v !== "" && v !== "all"
								) && (
									<div className="ml-1.5 h-2 w-2 rounded-full bg-orange-500"></div>
								)}
							</Button>

							{isFilterMenuOpen && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
								>
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-medium text-gray-800">
											Filter Recipes
										</h3>
									</div>

									<div className="p-4 space-y-4">
										{/* Cuisine filter */}
										<div>
											<Label
												htmlFor="cuisine-filter"
												className="text-sm text-gray-600"
											>
												Cuisine
											</Label>
											<select
												id="cuisine-filter"
												className="w-full mt-1 rounded-md bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30"
												value={activeFilters.cuisine}
												onChange={(e) =>
													setActiveFilters({
														...activeFilters,
														cuisine: e.target.value,
													})
												}
											>
												<option value="">All Cuisines</option>
												{cuisineOptions.map((cuisine) => (
													<option key={cuisine} value={cuisine}>
														{cuisine}
													</option>
												))}
											</select>
										</div>

										{/* Difficulty filter */}
										<div>
											<Label
												htmlFor="difficulty-filter"
												className="text-sm text-gray-600"
											>
												Difficulty
											</Label>
											<select
												id="difficulty-filter"
												className="w-full mt-1 rounded-md bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30"
												value={activeFilters.difficulty}
												onChange={(e) =>
													setActiveFilters({
														...activeFilters,
														difficulty: e.target.value,
													})
												}
											>
												<option value="">Any Difficulty</option>
												<option value="Easy">Easy</option>
												<option value="Medium">Medium</option>
												<option value="Hard">Hard</option>
											</select>
										</div>

										{/* Time range filter */}
										<div>
											<Label className="text-sm text-gray-600">
												Preparation Time
											</Label>
											<div className="grid grid-cols-3 gap-2 mt-1">
												<Button
													variant={
														activeFilters.timeRange === "all"
															? "default"
															: "outline"
													}
													size="sm"
													className={
														activeFilters.timeRange === "all"
															? "bg-orange-500 text-white"
															: "border-gray-200"
													}
													onClick={() =>
														setActiveFilters({
															...activeFilters,
															timeRange: "all",
														})
													}
												>
													Any Time
												</Button>
												<Button
													variant={
														activeFilters.timeRange === "quick"
															? "default"
															: "outline"
													}
													size="sm"
													className={
														activeFilters.timeRange === "quick"
															? "bg-orange-500 text-white"
															: "border-gray-200"
													}
													onClick={() =>
														setActiveFilters({
															...activeFilters,
															timeRange: "quick",
														})
													}
												>
													&lt;30 min
												</Button>
												<Button
													variant={
														activeFilters.timeRange === "medium"
															? "default"
															: "outline"
													}
													size="sm"
													className={
														activeFilters.timeRange === "medium"
															? "bg-orange-500 text-white"
															: "border-gray-200"
													}
													onClick={() =>
														setActiveFilters({
															...activeFilters,
															timeRange: "medium",
														})
													}
												>
													30-60 min
												</Button>
											</div>
										</div>
									</div>

									<div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
										<Button
											variant="ghost"
											size="sm"
											className="text-gray-600"
											onClick={() => {
												setActiveFilters({
													cuisine: "",
													difficulty: "",
													timeRange: "all",
													category: "",
												});
											}}
										>
											Reset Filters
										</Button>
										<Button
											size="sm"
											className="bg-orange-500 text-white hover:bg-orange-600"
											onClick={() => setIsFilterMenuOpen(false)}
										>
											Apply Filters
										</Button>
									</div>
								</motion.div>
							)}
						</div>
					</div>

					<TabsContent value="discover" className="mt-0 outline-none">
						{/* Featured Recipe */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mb-10"
						>
							<div className="relative rounded-2xl overflow-hidden group shadow-xl">
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
								<img
									src="https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1200"
									alt="Featured Recipe"
									className="w-full h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
									<div className="max-w-2xl">
										<div className="flex items-center space-x-2 mb-3">
											<Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-sm">
												Featured Recipe
											</Badge>
											<Badge className="bg-white/80 hover:bg-white text-gray-800 border-0 backdrop-blur-sm">
												Italian
											</Badge>
										</div>
										<h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
											Authentic Carbonara
										</h2>
										<p className="text-gray-200 mb-4 max-w-3xl leading-relaxed">
											Traditional Roman pasta dish with eggs, cheese, pancetta,
											and pepper. A true taste of Italy in just 30 minutes.
										</p>
										<div className="flex flex-wrap items-center gap-6 text-white">
											<div className="flex items-center">
												<Clock className="h-4 w-4 mr-1 text-orange-300" />
												<span>30 min</span>
											</div>
											<div className="flex items-center">
												<Users className="h-4 w-4 mr-1 text-orange-300" />
												<span>Serves 4</span>
											</div>
											<div className="flex items-center">
												<StarRating rating={4.8} />
											</div>
										</div>
										<div className="flex items-center mt-6 gap-3 flex-wrap">
											<Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md">
												View Recipe
											</Button>
											<Button
												variant="outline"
												className="border-white/40 bg-white/10 hover:bg-white/20 text-white gap-2"
											>
												<Heart className="h-4 w-4" />
												Save
											</Button>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Categories Scroll */}
						<div className="mb-10">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold text-gray-900">
									Popular Categories
								</h2>
								<Button
									variant="link"
									className="text-orange-500 hover:text-orange-600 p-0"
									onClick={() => {
										setActiveTab("discover");
										setIsUserProfileModalOpen(false);
									}}
								>
									View All
								</Button>
							</div>
							<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-100">
								{[
									"Italian",
									"Asian",
									"Desserts",
									"Quick & Easy",
									"Vegetarian",
									"Breakfast",
									"Soups",
									"Grilling",
								].map((category) => {
									const imageUrls = {
										Italian:
											"https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=320",
										Asian:
											"https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=320",
										Desserts:
											"https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=320",
										"Quick & Easy":
											"https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=320",
										Vegetarian:
											"https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=320",
										Breakfast:
											"https://images.pexels.com/photos/2662875/pexels-photo-2662875.jpeg?auto=compress&cs=tinysrgb&w=320",
										Soups:
											"https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=320",
										Grilling:
											"https://images.pexels.com/photos/1857732/pexels-photo-1857732.jpeg",
									};

									return (
										<motion.div
											whileHover={{ y: -5 }}
											key={category}
											className="min-w-[160px] relative group cursor-pointer rounded-xl overflow-hidden shadow-md"
										>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
											<img
												src={
													imageUrls[category] ||
													"https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=320"
												}
												alt={category}
												className="w-full h-[120px] object-cover rounded-xl"
											/>
											<div className="absolute inset-0 flex items-center justify-center">
												<p className="font-medium text-white text-lg drop-shadow-md group-hover:text-orange-200 transition-colors">
													{category}
												</p>
											</div>
										</motion.div>
									);
								})}
							</div>
						</div>

						{/* Recipe Grid */}
						{/* Recipe Grid */}
						<div>
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-bold text-gray-900">
									Latest Recipes
								</h2>
								<div className="flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										className="border-gray-200 hover:border-orange-200 hover:bg-orange-50 text-gray-600"
									>
										Newest
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="border-gray-200 hover:border-orange-200 hover:bg-orange-50 text-gray-600"
									>
										Popular
									</Button>
								</div>
							</div>
							{/* Active filters display */}
							{(activeFilters.cuisine ||
								activeFilters.difficulty ||
								activeFilters.timeRange !== "all" ||
								searchQuery) && (
								<div className="mb-6 flex flex-wrap gap-2 items-center">
									<span className="text-sm text-gray-600">Active filters:</span>

									{searchQuery && (
										<Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 gap-1">
											Search: {searchQuery}
											<X
												className="h-3 w-3 cursor-pointer"
												onClick={(e) => {
													e.stopPropagation();
													setSearchQuery("");
												}}
											/>
										</Badge>
									)}

									{activeFilters.cuisine && (
										<Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 gap-1">
											Cuisine: {activeFilters.cuisine}
											<X
												className="h-3 w-3 cursor-pointer"
												onClick={(e) => {
													e.stopPropagation();
													setActiveFilters({ ...activeFilters, cuisine: "" });
												}}
											/>
										</Badge>
									)}

									{activeFilters.difficulty && (
										<Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 gap-1">
											Difficulty: {activeFilters.difficulty}
											<X
												className="h-3 w-3 cursor-pointer"
												onClick={(e) => {
													e.stopPropagation();
													setActiveFilters({
														...activeFilters,
														difficulty: "",
													});
												}}
											/>
										</Badge>
									)}

									{activeFilters.timeRange !== "all" && (
										<Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 gap-1">
											Time:{" "}
											{activeFilters.timeRange === "quick"
												? "Under 30 min"
												: activeFilters.timeRange === "medium"
												? "30-60 min"
												: "Over 60 min"}
											<X
												className="h-3 w-3 cursor-pointer"
												onClick={(e) => {
													e.stopPropagation();
													setActiveFilters({
														...activeFilters,
														timeRange: "all",
													});
												}}
											/>
										</Badge>
									)}

									<Button
										variant="ghost"
										size="sm"
										className="text-gray-500 hover:text-orange-500 p-0 h-auto"
										onClick={() => {
											setSearchQuery("");
											setActiveFilters({
												cuisine: "",
												difficulty: "",
												timeRange: "all",
												category: "",
											});
										}}
									>
										Clear all
									</Button>
								</div>
							)}
							{filteredRecipes.length === 0 ? (
								<div className="min-h-[300px] flex items-center justify-center">
									<div className="text-center space-y-4">
										<Search className="h-16 w-16 text-gray-300 mx-auto" />
										<h3 className="text-xl font-medium text-gray-900">
											No recipes found
										</h3>
										<p className="text-gray-600 max-w-md">
											{searchQuery
												? `No recipes match "${searchQuery}"`
												: "No recipes match your selected filters"}
										</p>
										<Button
											variant="outline"
											className="border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-orange-500 hover:text-orange-600"
											onClick={() => {
												setSearchQuery("");
												setActiveFilters({
													cuisine: "",
													difficulty: "",
													timeRange: "all",
													category: "",
												});
											}}
										>
											Clear All Filters
										</Button>
									</div>
								</div>
							) : (
								<>
									<motion.div
										initial="hidden"
										animate="visible"
										variants={staggerContainer}
										className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
									>
										{filteredRecipes.map((recipe) => (
											<motion.div
												key={recipe.id}
												variants={fadeInUp}
												whileHover={{ y: -5 }}
												className="group"
											>
												<Card
													className="overflow-hidden bg-white border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-orange-100 rounded-xl"
													onClick={() => handleOpenRecipeDetails(recipe)}
												>
													<div className="aspect-video relative overflow-hidden">
														<img
															src={recipe.coverImage}
															alt={recipe.title}
															className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
														<div className="absolute top-2 left-2 flex flex-wrap gap-2">
															<Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm">
																{recipe.cuisine}
															</Badge>
															{recipe.difficulty === "Easy" && (
																<Badge className="bg-green-500 text-white border-0 shadow-sm">
																	Easy
																</Badge>
															)}
															{recipe.difficulty === "Medium" && (
																<Badge className="bg-amber-500 text-white border-0 shadow-sm">
																	Medium
																</Badge>
															)}
															{recipe.difficulty === "Hard" && (
																<Badge className="bg-red-500 text-white border-0 shadow-sm">
																	Hard
																</Badge>
															)}
														</div>
														<div className="absolute bottom-3 right-3 flex space-x-1">
															<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																<Heart
																	className={`h-4 w-4 ${
																		likedRecipes.includes(recipe.id)
																			? "fill-rose-500"
																			: ""
																	} text-rose-500`}
																/>
															</div>
															<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																<MessageCircle className="h-4 w-4 text-blue-500" />
															</div>
															<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																<Share2 className="h-4 w-4 text-orange-500" />
															</div>
														</div>
													</div>
													<CardContent className="p-5">
														<div className="flex items-center space-x-2 mb-3">
															<Avatar className="h-6 w-6 border border-orange-200">
																<AvatarImage src={recipe.authorImage} />
																<AvatarFallback className="bg-orange-100 text-orange-500">
																	{recipe.authorName.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<span className="text-sm text-gray-600">
																{recipe.authorName}
															</span>
														</div>
														<h3 className="text-lg font-bold mb-2 text-gray-900">
															{recipe.title}
														</h3>
														<p className="text-gray-600 text-sm line-clamp-2 mb-3">
															{recipe.description}
														</p>
														<div className="flex justify-between items-center mt-4">
															<div className="flex items-center space-x-4">
																<div className="flex items-center text-gray-500 text-sm">
																	<Clock className="h-3.5 w-3.5 mr-1 text-orange-500" />
																	<span>
																		{recipe.preparationTime +
																			recipe.cookingTime}{" "}
																		min
																	</span>
																</div>
																<div className="flex items-center text-gray-500 text-sm">
																	<Users className="h-3.5 w-3.5 mr-1 text-orange-500" />
																	<span>{recipe.servings}</span>
																</div>
															</div>
															<StarRating rating={recipe.rating} />
														</div>
													</CardContent>
													<div className="px-5 pb-5 pt-0 flex justify-between border-t border-gray-100">
														<div className="flex items-center space-x-1 text-sm text-gray-500">
															<Heart
																className={`h-3.5 w-3.5 ${
																	likedRecipes.includes(recipe.id)
																		? "fill-rose-500 text-rose-500"
																		: "text-rose-500"
																}`}
															/>
															<span>{recipe.likes}</span>
														</div>
														<div className="flex items-center space-x-1 text-sm text-gray-500">
															<MessageCircle className="h-3.5 w-3.5 text-blue-500" />
															<span>{recipe.comments.length}</span>
														</div>
														<div className="flex items-center space-x-1 text-sm text-gray-500">
															<Save className="h-3.5 w-3.5 text-amber-500" />
															<span>{recipe.savedCount}</span>
														</div>
													</div>
												</Card>
											</motion.div>
										))}
									</motion.div>

									<div className="mt-10 text-center">
										<Button
											variant="outline"
											className="border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-orange-500 hover:text-orange-600 px-8 shadow-sm"
										>
											Load More Recipes
										</Button>
									</div>
								</>
							)}
						</div>
					</TabsContent>

					<TabsContent value="trending" className="mt-0 outline-none">
						<div className="min-h-[400px] flex items-center justify-center">
							<div className="text-center space-y-4">
								<Star className="h-16 w-16 text-orange-500 mx-auto" />
								<h3 className="text-xl font-medium text-gray-900">
									Trending Recipes
								</h3>
								<p className="text-gray-600 max-w-md">
									Discover what's hot and trending in the culinary world right
									now
								</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="following" className="mt-0 outline-none">
						{followedUsers.length === 0 ? (
							<div className="min-h-[400px] flex items-center justify-center">
								<div className="text-center space-y-4">
									<Users className="h-16 w-16 text-orange-500 mx-auto" />
									<h3 className="text-xl font-medium text-gray-900">
										Follow More Chefs
									</h3>
									<p className="text-gray-600 max-w-md">
										Start following your favorite chefs to see their latest
										recipes here
									</p>
									<Button
										className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 mt-2"
										onClick={() => setActiveTab("following")}
									>
										Discover Chefs
									</Button>
								</div>
							</div>
						) : (
							<div className="space-y-8">
								<div className="flex justify-between items-center">
									<h2 className="text-xl font-bold text-gray-900">
										Chefs You Follow
									</h2>
								</div>

								{/* Followed chefs grid */}
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
									{mockUsers
										.filter((user) => followedUsers.includes(user.id))
										.map((user) => (
											<Card
												key={user.id}
												className="overflow-hidden  hover:border-orange-300 transition-all cursor-pointer"
												onClick={() => handleOpenUserProfile(user.id)}
											>
												<div className="aspect-square relative">
													<img
														src={user.profileImage}
														alt={user.name}
														className="w-full h-full object-cover"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
													<div className="absolute bottom-3 left-0 right-0 px-4">
														<h3 className="font-medium text-white">
															{user.name}
														</h3>
														<p className="text-sm text-gray-200 mt-1">
															{user.recipeCount} recipes
														</p>
													</div>
												</div>
											</Card>
										))}
								</div>

								<div className="mt-12">
									<h2 className="text-xl font-bold text-gray-900 mb-6">
										Recent Recipes From Chefs You Follow
									</h2>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{recipes
											.filter((recipe) =>
												followedUsers.includes(recipe.authorId)
											)
											.sort(
												(a, b) =>
													new Date(b.createdAt).getTime() -
													new Date(a.createdAt).getTime()
											)
											.slice(0, 6)
											.map((recipe) => (
												<motion.div
													key={recipe.id}
													variants={fadeInUp}
													whileHover={{ y: -5 }}
													className="group"
												>
													<Card
														className="overflow-hidden bg-white border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-orange-100 rounded-xl"
														onClick={() => handleOpenRecipeDetails(recipe)}
													>
														<div className="aspect-video relative overflow-hidden">
															<img
																src={recipe.coverImage}
																alt={recipe.title}
																className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
															/>
															<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
															<div className="absolute top-2 left-2 flex flex-wrap gap-2">
																<Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm">
																	{recipe.cuisine}
																</Badge>
																{recipe.difficulty === "Easy" && (
																	<Badge className="bg-green-500 text-white border-0 shadow-sm">
																		Easy
																	</Badge>
																)}
																{recipe.difficulty === "Medium" && (
																	<Badge className="bg-amber-500 text-white border-0 shadow-sm">
																		Medium
																	</Badge>
																)}
																{recipe.difficulty === "Hard" && (
																	<Badge className="bg-red-500 text-white border-0 shadow-sm">
																		Hard
																	</Badge>
																)}
															</div>
															<div className="absolute bottom-3 right-3 flex space-x-1">
																<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																	<Heart
																		className={`h-4 w-4 mr-1.5 ${
																			isRecipeLiked(selectedRecipe?.id)
																				? "fill-rose-500"
																				: ""
																		} text-rose-500`}
																	/>
																</div>
																<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																	<MessageCircle className="h-4 w-4 text-blue-500" />
																</div>
																<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																	<Share2 className="h-4 w-4 text-orange-500" />
																</div>
															</div>
														</div>
														<CardContent className="p-5">
															<div className="flex items-center space-x-2 mb-3">
																<Avatar className="h-6 w-6 border border-orange-200">
																	<AvatarImage src={recipe.authorImage} />
																	<AvatarFallback className="bg-orange-100 text-orange-500">
																		{recipe.authorName.charAt(0)}
																	</AvatarFallback>
																</Avatar>
																<span className="text-sm text-gray-600">
																	{recipe.authorName}
																</span>
															</div>
															<h3 className="text-lg font-bold mb-2 text-gray-900">
																{recipe.title}
															</h3>
															<p className="text-gray-600 text-sm line-clamp-2 mb-3">
																{recipe.description}
															</p>
															<div className="flex justify-between items-center mt-4">
																<div className="flex items-center space-x-4">
																	<div className="flex items-center text-gray-500 text-sm">
																		<Clock className="h-3.5 w-3.5 mr-1 text-orange-500" />
																		<span>
																			{recipe.preparationTime +
																				recipe.cookingTime}{" "}
																			min
																		</span>
																	</div>
																	<div className="flex items-center text-gray-500 text-sm">
																		<Users className="h-3.5 w-3.5 mr-1 text-orange-500" />
																		<span>{recipe.servings}</span>
																	</div>
																</div>
																<StarRating rating={recipe.rating} />
															</div>
														</CardContent>
														<div className="px-5 pb-5 pt-0 flex justify-between border-t border-gray-100">
															<div className="flex items-center space-x-1 text-sm text-gray-500">
																<Heart
																	className={`h-4 w-4 mr-1.5 ${
																		isRecipeLiked(selectedRecipe?.id)
																			? "fill-rose-500"
																			: ""
																	} text-rose-500`}
																/>
																<span>{recipe.likes}</span>
															</div>
															<div className="flex items-center space-x-1 text-sm text-gray-500">
																<MessageCircle className="h-3.5 w-3.5 text-blue-500" />
																<span>{recipe.comments.length}</span>
															</div>
															<div className="flex items-center space-x-1 text-sm text-gray-500">
																<Save className="h-3.5 w-3.5 text-amber-500" />
																<span>{recipe.savedCount}</span>
															</div>
														</div>
													</Card>
												</motion.div>
											))}
									</div>
								</div>
							</div>
						)}
					</TabsContent>
					<TabsContent value="cookbook" className="mt-0 outline-none">
						<div className="space-y-6">
							<h2 className="text-xl font-bold text-gray-900">My Cookbook</h2>
							{savedRecipes.length === 0 ? (
								<div className="min-h-[400px] flex items-center justify-center">
									<div className="text-center space-y-4">
										<BookOpen className="h-16 w-16 text-orange-500 mx-auto" />
										<h3 className="text-xl font-medium text-gray-900">
											Your cookbook is empty
										</h3>
										<p className="text-gray-600 max-w-md">
											Start saving recipes you love to build your personal
											cookbook
										</p>
										<Button
											className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 mt-2"
											onClick={() => setActiveTab("discover")}
										>
											Browse Recipes
										</Button>
									</div>
								</div>
							) : (
								<motion.div
									initial="hidden"
									animate="visible"
									variants={staggerContainer}
									className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
								>
									{recipes
										.filter((recipe) => savedRecipes.includes(recipe.id))
										.map((recipe) => (
											<motion.div
												key={recipe.id}
												variants={fadeInUp}
												whileHover={{ y: -5 }}
												className="group"
											>
												<Card
													className="overflow-hidden bg-white border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-orange-100 rounded-xl"
													onClick={() => handleOpenRecipeDetails(recipe)}
												>
													<div className="aspect-video relative overflow-hidden">
														<img
															src={recipe.coverImage}
															alt={recipe.title}
															className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
														<div className="absolute top-2 left-2 flex flex-wrap gap-2">
															<Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm">
																{recipe.cuisine}
															</Badge>
															{recipe.difficulty === "Easy" && (
																<Badge className="bg-green-500 text-white border-0 shadow-sm">
																	Easy
																</Badge>
															)}
															{recipe.difficulty === "Medium" && (
																<Badge className="bg-amber-500 text-white border-0 shadow-sm">
																	Medium
																</Badge>
															)}
															{recipe.difficulty === "Hard" && (
																<Badge className="bg-red-500 text-white border-0 shadow-sm">
																	Hard
																</Badge>
															)}
														</div>
														<div className="absolute bottom-3 right-3 flex space-x-1">
															<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																<Heart
																	className={`h-4 w-4 mr-1.5 ${
																		isRecipeLiked(selectedRecipe?.id)
																			? "fill-rose-500"
																			: ""
																	} text-rose-500`}
																/>
															</div>
															<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																<MessageCircle className="h-4 w-4 text-blue-500" />
															</div>
															<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																<Share2 className="h-4 w-4 text-orange-500" />
															</div>
														</div>
													</div>
													<CardContent className="p-5">
														<div className="flex items-center space-x-2 mb-3">
															<Avatar className="h-6 w-6 border border-orange-200">
																<AvatarImage src={recipe.authorImage} />
																<AvatarFallback className="bg-orange-100 text-orange-500">
																	{recipe.authorName.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<span className="text-sm text-gray-600">
																{recipe.authorName}
															</span>
														</div>
														<h3 className="text-lg font-bold mb-2 text-gray-900">
															{recipe.title}
														</h3>
														<p className="text-gray-600 text-sm line-clamp-2 mb-3">
															{recipe.description}
														</p>
														<div className="flex justify-between items-center mt-4">
															<div className="flex items-center space-x-4">
																<div className="flex items-center text-gray-500 text-sm">
																	<Clock className="h-3.5 w-3.5 mr-1 text-orange-500" />
																	<span>
																		{recipe.preparationTime +
																			recipe.cookingTime}{" "}
																		min
																	</span>
																</div>
																<div className="flex items-center text-gray-500 text-sm">
																	<Users className="h-3.5 w-3.5 mr-1 text-orange-500" />
																	<span>{recipe.servings}</span>
																</div>
															</div>
															<StarRating rating={recipe.rating} />
														</div>
													</CardContent>
													<div className="px-5 pb-5 pt-0 flex justify-between border-t border-gray-100">
														<div className="flex items-center space-x-1 text-sm text-gray-500">
															<Heart
																className={`h-4 w-4 mr-1.5 ${
																	isRecipeLiked(selectedRecipe?.id)
																		? "fill-rose-500"
																		: ""
																} text-rose-500`}
															/>
															<span>{recipe.likes}</span>
														</div>
														<div className="flex items-center space-x-1 text-sm text-gray-500">
															<MessageCircle className="h-3.5 w-3.5 text-blue-500" />
															<span>{recipe.comments.length}</span>
														</div>
														<div className="flex items-center space-x-1 text-sm text-gray-500">
															<Save className="h-3.5 w-3.5 text-amber-500" />
															<span>{recipe.savedCount}</span>
														</div>
													</div>
												</Card>
											</motion.div>
										))}
								</motion.div>
							)}
						</div>
					</TabsContent>
					<TabsContent value="categories" className="mt-0 outline-none">
						<div className="space-y-8">
							<h2 className="text-xl font-bold text-gray-900">
								Recipe Categories
							</h2>

							{/* Category grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{recipeCategories.map((category) => (
									<Card
										key={category.id}
										className="hover:border-orange-300 transition-all cursor-pointer group"
										onClick={() => {
											setActiveFilters((prev) => ({
												...prev,
												category: category.id,
											}));
											setActiveTab("categories");
										}}
									>
										<CardContent className="p-6 flex items-center space-x-4">
											<div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-200 transition-colors">
												{category.icon}
											</div>
											<div>
												<h3 className="font-medium text-gray-900">
													{category.name}
												</h3>
												<p className="text-sm text-gray-500 mt-1">
													{category.description}
												</p>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Category detail view (shown when a category is selected) */}
							{activeFilters.category && (
								<div className="mt-8">
									<div className="flex items-center justify-between mb-4">
										<h2 className="text-xl font-bold text-gray-900">
											{
												recipeCategories.find(
													(c) => c.id === activeFilters.category
												)?.name
											}{" "}
											Recipes
										</h2>
										<Button
											variant="ghost"
											className="text-gray-500 hover:text-orange-500"
											onClick={() =>
												setActiveFilters((prev) => ({ ...prev, category: "" }))
											}
										>
											<X className="h-4 w-4 mr-2" />
											Clear
										</Button>
									</div>

									{/* Recipe grid for category */}
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{recipes
											.filter((recipe) =>
												recipe.categories.includes(activeFilters.category)
											)
											.map((recipe) => (
												<motion.div
													key={recipe.id}
													variants={fadeInUp}
													whileHover={{ y: -5 }}
													className="group"
												>
													<Card
														className="overflow-hidden bg-white border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-orange-100 rounded-xl"
														onClick={() => handleOpenRecipeDetails(recipe)}
													>
														<div className="aspect-video relative overflow-hidden">
															<img
																src={recipe.coverImage}
																alt={recipe.title}
																className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
															/>
															<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
															<div className="absolute top-2 left-2 flex flex-wrap gap-2">
																<Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm">
																	{recipe.cuisine}
																</Badge>
																{recipe.difficulty === "Easy" && (
																	<Badge className="bg-green-500 text-white border-0 shadow-sm">
																		Easy
																	</Badge>
																)}
																{recipe.difficulty === "Medium" && (
																	<Badge className="bg-amber-500 text-white border-0 shadow-sm">
																		Medium
																	</Badge>
																)}
																{recipe.difficulty === "Hard" && (
																	<Badge className="bg-red-500 text-white border-0 shadow-sm">
																		Hard
																	</Badge>
																)}
															</div>
															<div className="absolute bottom-3 right-3 flex space-x-1">
																<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																	<Heart
																		className={`h-4 w-4 mr-1.5 ${
																			isRecipeLiked(selectedRecipe?.id)
																				? "fill-rose-500"
																				: ""
																		} text-rose-500`}
																	/>
																</div>
																<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																	<MessageCircle className="h-4 w-4 text-blue-500" />
																</div>
																<div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
																	<Share2 className="h-4 w-4 text-orange-500" />
																</div>
															</div>
														</div>
														<CardContent className="p-5">
															<div className="flex items-center space-x-2 mb-3">
																<Avatar className="h-6 w-6 border border-orange-200">
																	<AvatarImage src={recipe.authorImage} />
																	<AvatarFallback className="bg-orange-100 text-orange-500">
																		{recipe.authorName.charAt(0)}
																	</AvatarFallback>
																</Avatar>
																<span className="text-sm text-gray-600">
																	{recipe.authorName}
																</span>
															</div>
															<h3 className="text-lg font-bold mb-2 text-gray-900">
																{recipe.title}
															</h3>
															<p className="text-gray-600 text-sm line-clamp-2 mb-3">
																{recipe.description}
															</p>
															<div className="flex justify-between items-center mt-4">
																<div className="flex items-center space-x-4">
																	<div className="flex items-center text-gray-500 text-sm">
																		<Clock className="h-3.5 w-3.5 mr-1 text-orange-500" />
																		<span>
																			{recipe.preparationTime +
																				recipe.cookingTime}{" "}
																			min
																		</span>
																	</div>
																	<div className="flex items-center text-gray-500 text-sm">
																		<Users className="h-3.5 w-3.5 mr-1 text-orange-500" />
																		<span>{recipe.servings}</span>
																	</div>
																</div>
																<StarRating rating={recipe.rating} />
															</div>
														</CardContent>
														<div className="px-5 pb-5 pt-0 flex justify-between border-t border-gray-100">
															<div className="flex items-center space-x-1 text-sm text-gray-500">
																<Heart
																	className={`h-4 w-4 mr-1.5 ${
																		isRecipeLiked(selectedRecipe?.id)
																			? "fill-rose-500"
																			: ""
																	} text-rose-500`}
																/>
																<span>{recipe.likes}</span>
															</div>
															<div className="flex items-center space-x-1 text-sm text-gray-500">
																<MessageCircle className="h-3.5 w-3.5 text-blue-500" />
																<span>{recipe.comments.length}</span>
															</div>
															<div className="flex items-center space-x-1 text-sm text-gray-500">
																<Save className="h-3.5 w-3.5 text-amber-500" />
																<span>{recipe.savedCount}</span>
															</div>
														</div>
													</Card>
												</motion.div>
											))}
									</div>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</main>

			{/* Recipe Details Modal */}
			<Dialog
				open={selectedRecipe !== null && isRecipeModalOpen}
				onOpenChange={() => setIsRecipeModalOpen(false)}
			>
				<DialogContent className="bg-white border-gray-200 text-gray-800 max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-xl shadow-xl">
					{selectedRecipe && (
						<div>
							<DialogTitle className="sr-only">
								{selectedRecipe.title} Recipe Details
							</DialogTitle>
							<div className="relative h-[300px]">
								<img
									src={selectedRecipe.coverImage}
									alt={selectedRecipe.title}
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

								<div className="absolute bottom-0 inset-x-0 p-6">
									<div className="flex justify-between items-end">
										<div>
											<div className="flex items-center space-x-2 mb-2">
												<Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
													{selectedRecipe.cuisine}
												</Badge>
												<Badge className="bg-white/90 text-gray-800 border-0">
													{selectedRecipe.difficulty}
												</Badge>
											</div>
											<h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
												{selectedRecipe.title}
											</h2>
											<div className="flex items-center space-x-3">
												<div
													className="flex items-center space-x-2 cursor-pointer"
													onClick={() =>
														handleOpenUserProfile(selectedRecipe.authorId)
													}
												>
													<Avatar className="h-6 w-6 border-2 border-white/50">
														<AvatarImage src={selectedRecipe.authorImage} />
														<AvatarFallback>
															{selectedRecipe.authorName.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm text-gray-100">
														{selectedRecipe.authorName}
													</span>
												</div>
												<span className="text-gray-300 text-sm">•</span>
												<span className="text-gray-300 text-sm">
													{selectedRecipe.createdAt}
												</span>
											</div>
										</div>

										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="sm"
												className="border-gray-200 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-800"
												onClick={() => handleLikeRecipe(selectedRecipe.id)}
												disabled={isLoading[`like-${selectedRecipe.id}`]}
											>
												{isLoading[`like-${selectedRecipe.id}`] ? (
													<span className="animate-pulse">...</span>
												) : (
													<>
														<Heart
															className={`h-4 w-4 mr-1.5 ${
																likedRecipes.includes(selectedRecipe.id)
																	? "fill-rose-500"
																	: ""
															} text-rose-500`}
														/>
														<span>{selectedRecipe.likes}</span>
													</>
												)}
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="border-gray-200 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-800"
												onClick={() => handleSaveRecipe(selectedRecipe.id)}
											>
												<Save
													className={`h-4 w-4 mr-1.5 ${
														savedRecipes.includes(selectedRecipe.id)
															? "fill-amber-500"
															: ""
													} text-amber-500`}
												/>
												<span>Save</span>
											</Button>
										</div>
									</div>
								</div>
							</div>

							<div className="p-6">
								<Tabs defaultValue="recipe" className="w-full">
									<TabsList className="bg-gray-100/80 p-1 rounded-lg border border-gray-200 mb-6">
										<TabsTrigger
											value="recipe"
											className="rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
										>
											Recipe
										</TabsTrigger>
										<TabsTrigger
											value="nutrition"
											className="rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
										>
											Nutrition
										</TabsTrigger>
										<TabsTrigger
											value="comments"
											className="rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
										>
											Comments ({selectedRecipe.comments.length})
										</TabsTrigger>
									</TabsList>

									<TabsContent
										value="recipe"
										className="space-y-8 mt-0 outline-none"
									>
										<div>
											<p className="text-gray-700 mb-6 text-lg leading-relaxed">
												{selectedRecipe.description}
											</p>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
												<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-orange-50 border border-orange-100 flex-grow">
													<Clock className="h-6 w-6 text-orange-500 mb-2" />
													<p className="text-sm text-gray-500">Prep Time</p>
													<p className="text-lg font-medium text-gray-900">
														{selectedRecipe.preparationTime} min
													</p>
												</div>
												<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-orange-50 border border-orange-100 flex-grow">
													<ChefHat className="h-6 w-6 text-orange-500 mb-2" />
													<p className="text-sm text-gray-500">Cook Time</p>
													<p className="text-lg font-medium text-gray-900">
														{selectedRecipe.cookingTime} min
													</p>
												</div>
												<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-orange-50 border border-orange-100 flex-grow">
													<Users className="h-6 w-6 text-orange-500 mb-2" />
													<p className="text-sm text-gray-500">Servings</p>
													<p className="text-lg font-medium text-gray-900">
														{selectedRecipe.servings}
													</p>
												</div>
											</div>
										</div>

										<div>
											<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
												<span className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3 text-white">
													1
												</span>
												Ingredients
											</h3>
											<div className="bg-orange-50 rounded-xl border border-orange-100 p-5">
												<ul className="space-y-3">
													{selectedRecipe.ingredients.map(
														(ingredient, index) => (
															<li
																key={index}
																className="flex items-center pb-3 border-b border-orange-100 last:border-0 last:pb-0"
															>
																<div className="h-2 w-2 rounded-full bg-orange-500 mr-3"></div>
																<span className="text-gray-900 font-medium">
																	{ingredient.amount} {ingredient.unit}
																</span>
																<span className="mx-2 text-gray-400">•</span>
																<span className="text-gray-700">
																	{ingredient.name}
																</span>
															</li>
														)
													)}
												</ul>
											</div>
										</div>

										<div>
											<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
												<span className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3 text-white">
													2
												</span>
												Instructions
											</h3>
											<div className="space-y-4">
												{selectedRecipe.instructions.map(
													(instruction, index) => (
														<div key={index} className="flex space-x-4">
															<div className="flex-shrink-0 mt-1">
																<div className="w-7 h-7 rounded-full bg-white border-2 border-orange-300 flex items-center justify-center text-orange-500 text-sm font-medium shadow-sm">
																	{index + 1}
																</div>
															</div>
															<div className="flex-1 pb-5 border-b border-gray-100 last:border-0">
																<p className="text-gray-700">{instruction}</p>
															</div>
														</div>
													)
												)}
											</div>
										</div>

										<div>
											<h3 className="text-xl font-bold text-gray-900 mb-4">
												Tags
											</h3>
											<div className="flex flex-wrap gap-2">
												{selectedRecipe.tags.map((tag) => (
													<Badge
														key={tag}
														className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-0"
													>
														#{tag}
													</Badge>
												))}
											</div>
										</div>
										<div className="mt-6 border-t border-gray-100 pt-6">
											<h3 className="text-lg font-medium text-gray-900 mb-4">
												Rate this Recipe
											</h3>

											<div className="flex items-center space-x-1">
												{[1, 2, 3, 4, 5].map((star) => (
													<button
														key={star}
														type="button"
														onClick={() =>
															handleRateRecipe(selectedRecipe.id, star)
														}
														className="focus:outline-none"
													>
														<Star
															className={`h-8 w-8 ${
																(userRatings[selectedRecipe.id] || 0) >= star
																	? "fill-amber-400 text-amber-400"
																	: "text-gray-300 hover:text-amber-200"
															} transition-colors`}
														/>
													</button>
												))}

												<span className="ml-3 text-gray-500">
													{userRatings[selectedRecipe.id]
														? `Your rating: ${userRatings[selectedRecipe.id]}/5`
														: "Tap to rate"}
												</span>
											</div>

											<div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
												<Star className="h-4 w-4 fill-amber-400 text-amber-400" />
												<span>
													<span className="font-medium">
														{selectedRecipe.rating}
													</span>
													/5 from{" "}
													<span className="font-medium">
														{selectedRecipe.ratingCount}
													</span>{" "}
													ratings
												</span>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="nutrition" className="mt-0 outline-none">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Card className="bg-white border-gray-200 shadow-sm">
													<CardHeader className="pb-2">
														<CardTitle className="text-lg text-gray-900">
															Nutrition Facts
														</CardTitle>
														<CardDescription>Per Serving</CardDescription>
													</CardHeader>
													<CardContent>
														<div className="space-y-2">
															<div className="flex justify-between py-2 border-b border-gray-100">
																<span className="font-medium text-gray-900">
																	Calories
																</span>
																<span className="text-gray-700">
																	{selectedRecipe.nutritionFacts.calories}
																</span>
															</div>
															<div className="flex justify-between py-2 border-b border-gray-100">
																<span className="font-medium text-gray-900">
																	Protein
																</span>
																<span className="text-gray-700">
																	{selectedRecipe.nutritionFacts.protein}g
																</span>
															</div>
															<div className="flex justify-between py-2 border-b border-gray-100">
																<span className="font-medium text-gray-900">
																	Carbs
																</span>
																<span className="text-gray-700">
																	{selectedRecipe.nutritionFacts.carbs}g
																</span>
															</div>
															<div className="flex justify-between py-2 border-b border-gray-100">
																<span className="font-medium text-gray-900">
																	Fat
																</span>
																<span className="text-gray-700">
																	{selectedRecipe.nutritionFacts.fat}g
																</span>
															</div>
															<div className="flex justify-between py-2 border-b border-gray-100">
																<span className="font-medium text-gray-900">
																	Fiber
																</span>
																<span className="text-gray-700">
																	{selectedRecipe.nutritionFacts.fiber}g
																</span>
															</div>
															<div className="flex justify-between py-2">
																<span className="font-medium text-gray-900">
																	Sugar
																</span>
																<span className="text-gray-700">
																	{selectedRecipe.nutritionFacts.sugar}g
																</span>
															</div>
														</div>
													</CardContent>
												</Card>
											</div>
											<div>
												<Card className="bg-white border-gray-200 shadow-sm h-full">
													<CardHeader className="pb-2">
														<CardTitle className="text-lg text-gray-900">
															Macronutrient Breakdown
														</CardTitle>
														<CardDescription>
															Visual representation
														</CardDescription>
													</CardHeader>
													<CardContent>
														<NutritionChart
															nutritionFacts={selectedRecipe.nutritionFacts}
														/>
													</CardContent>
												</Card>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="comments" className="mt-0 outline-none">
										<div className="space-y-6">
											<div className="flex space-x-4">
												<Avatar className="h-10 w-10 border-2 border-orange-100">
													<AvatarImage
														src={currentUser.profileImage}
														alt={currentUser.name}
													/>
													<AvatarFallback className="bg-orange-100 text-orange-600">
														{currentUser.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<Textarea
														placeholder="Share your experience or ask a question..."
														className="bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 mb-2 resize-none"
														id="comment"
													/>
													<Button
														className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
														onClick={() => {
															const commentElem = document.getElementById(
																"comment"
															) as HTMLTextAreaElement;
															if (commentElem && commentElem.value.trim()) {
																handleAddComment(
																	selectedRecipe.id,
																	commentElem.value
																);
																commentElem.value = "";
															}
														}}
													>
														Post Comment
													</Button>
												</div>
											</div>

											<div className="space-y-4">
												{selectedRecipe.comments.length === 0 ? (
													<div className="text-center py-8">
														<MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
														<p className="text-gray-500">
															No comments yet. Be the first to share your
															thoughts!
														</p>
													</div>
												) : (
													selectedRecipe.comments.map((comment) => (
														<motion.div
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															key={comment.id}
														>
															<Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
																<CardHeader className="pb-2">
																	<div className="flex justify-between items-start">
																		<div className="flex items-center space-x-3">
																			<Avatar className="h-8 w-8 border border-orange-100">
																				<AvatarImage
																					src={comment.userImage}
																					alt={comment.username}
																				/>
																				<AvatarFallback className="bg-orange-100 text-orange-600">
																					{comment.username.charAt(0)}
																				</AvatarFallback>
																			</Avatar>
																			<div>
																				<p className="text-sm font-medium text-gray-900">
																					{comment.username}
																				</p>
																				<p className="text-xs text-gray-500">
																					{comment.createdAt}
																				</p>
																			</div>
																		</div>
																	</div>
																</CardHeader>
																<CardContent>
																	<p className="text-gray-700">
																		{comment.content}
																	</p>
																</CardContent>
																<CardFooter className="pt-0 flex justify-end">
																	<Button
																		variant="ghost"
																		size="sm"
																		className="text-gray-500 hover:text-orange-500 hover:bg-orange-50"
																	>
																		<ThumbsUp className="h-4 w-4 mr-1" />
																		<span>{comment.likes}</span>
																	</Button>
																</CardFooter>
															</Card>
														</motion.div>
													))
												)}
											</div>
										</div>
									</TabsContent>
								</Tabs>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Create recipe modal */}
			<Dialog
				open={isCreateRecipeModalOpen}
				onOpenChange={setIsCreateRecipeModalOpen}
			>
				<DialogContent className="bg-white border-gray-200 text-gray-800 max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold flex items-center text-gray-900">
							<div className="mr-3 h-8 w-8 rounded-md bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-md">
								<ChefHat className="h-5 w-5 text-white" />
							</div>
							Create New Recipe
						</DialogTitle>
						<DialogDescription className="text-gray-600">
							Share your culinary creations with the world. Fill in the details
							below to create your recipe.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6">
						<div className="space-y-4">
							<div>
								<Label htmlFor="title" className="text-gray-700">
									Recipe Title
								</Label>
								<Input
									id="title"
									placeholder="E.g., Classic Chocolate Chip Cookies"
									className="bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 mt-1.5 shadow-sm"
									value={newRecipe.title}
									onChange={(e) =>
										setNewRecipe({ ...newRecipe, title: e.target.value })
									}
								/>
							</div>

							<div>
								<Label htmlFor="description" className="text-gray-700">
									Description
								</Label>
								<Textarea
									id="description"
									placeholder="Tell us about your recipe, its history, or what makes it special..."
									className="bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 min-h-24 mt-1.5 shadow-sm"
									value={newRecipe.description}
									onChange={(e) =>
										setNewRecipe({ ...newRecipe, description: e.target.value })
									}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<Label htmlFor="prepTime" className="text-gray-700">
										Preparation Time
									</Label>
									<Input
										id="prepTime"
										type="number"
										min={0}
										className="bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 mt-1.5 shadow-sm"
										value={newRecipe.preparationTime}
										onChange={(e) =>
											setNewRecipe({
												...newRecipe,
												preparationTime: parseInt(e.target.value) || 0,
											})
										}
									/>
								</div>

								<div>
									<Label htmlFor="cookTime" className="text-gray-700">
										Cooking Time
									</Label>
									<Input
										id="cookTime"
										type="number"
										min={0}
										className="bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 mt-1.5 shadow-sm"
										value={newRecipe.cookingTime}
										onChange={(e) =>
											setNewRecipe({
												...newRecipe,
												cookingTime: parseInt(e.target.value) || 0,
											})
										}
									/>
								</div>

								<div>
									<Label htmlFor="servings" className="text-gray-700">
										Servings
									</Label>
									<Input
										id="servings"
										type="number"
										min={1}
										className="bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 mt-1.5 shadow-sm"
										value={newRecipe.servings}
										onChange={(e) =>
											setNewRecipe({
												...newRecipe,
												servings: parseInt(e.target.value) || 1,
											})
										}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="difficulty" className="text-gray-700">
										Difficulty Level
									</Label>
									<select
										id="difficulty"
										className="w-full rounded-md bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 text-gray-800 py-2 mt-1.5 shadow-sm"
										value={newRecipe.difficulty}
										onChange={(e) =>
											setNewRecipe({
												...newRecipe,
												difficulty: e.target.value as
													| "Easy"
													| "Medium"
													| "Hard",
											})
										}
									>
										<option value="Easy">Easy</option>
										<option value="Medium">Medium</option>
										<option value="Hard">Hard</option>
									</select>
								</div>

								<div>
									<Label htmlFor="cuisine" className="text-gray-700">
										Cuisine Type
									</Label>
									<select
										id="cuisine"
										className="w-full rounded-md bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 text-gray-800 py-2 mt-1.5 shadow-sm"
										value={newRecipe.cuisine}
										onChange={(e) =>
											setNewRecipe({ ...newRecipe, cuisine: e.target.value })
										}
									>
										<option value="">Select a cuisine</option>
										{cuisineOptions.map((cuisine) => (
											<option key={cuisine} value={cuisine}>
												{cuisine}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<Label htmlFor="tags" className="text-gray-700">
									Tags (comma separated)
								</Label>
								<Input
									id="tags"
									placeholder="E.g., dessert, chocolate, quick, vegan"
									className="bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 mt-1.5 shadow-sm"
									value={newRecipe.tags?.join(", ") || ""}
									onChange={(e) =>
										setNewRecipe({
											...newRecipe,
											tags: e.target.value
												.split(",")
												.map((tag) => tag.trim())
												.filter((tag) => tag),
										})
									}
								/>
							</div>
						</div>

						<div className="border-t border-gray-200 pt-6">
							<h3 className="text-lg font-medium mb-4 text-gray-900">
								Ingredients
							</h3>
							<p className="text-gray-600 text-sm mb-4">
								Add each ingredient with its quantity and unit of measurement.
							</p>

							<div className="space-y-4">
								{(newRecipe.ingredients || []).map((ingredient, index) => (
									<div key={index} className="flex items-center space-x-3">
										<Input
											className="flex-1 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 shadow-sm"
											placeholder="Ingredient name"
											value={ingredient.name}
											onChange={(e) => {
												const updatedIngredients = [
													...(newRecipe.ingredients || []),
												];
												updatedIngredients[index].name = e.target.value;
												setNewRecipe({
													...newRecipe,
													ingredients: updatedIngredients,
												});
											}}
										/>
										<Input
											className="w-24 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 shadow-sm"
											placeholder="Amount"
											value={ingredient.amount}
											onChange={(e) => {
												const updatedIngredients = [
													...(newRecipe.ingredients || []),
												];
												updatedIngredients[index].amount = e.target.value;
												setNewRecipe({
													...newRecipe,
													ingredients: updatedIngredients,
												});
											}}
										/>
										<Input
											className="w-20 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 shadow-sm"
											placeholder="Unit"
											value={ingredient.unit}
											onChange={(e) => {
												const updatedIngredients = [
													...(newRecipe.ingredients || []),
												];
												updatedIngredients[index].unit = e.target.value;
												setNewRecipe({
													...newRecipe,
													ingredients: updatedIngredients,
												});
											}}
										/>
										<Button
											variant="ghost"
											size="icon"
											className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 w-10 rounded-full"
											onClick={() => {
												const updatedIngredients = [
													...(newRecipe.ingredients || []),
												];
												updatedIngredients.splice(index, 1);
												setNewRecipe({
													...newRecipe,
													ingredients: updatedIngredients,
												});
											}}
										>
											✕
										</Button>
									</div>
								))}

								<Button
									variant="outline"
									className="w-full border-dashed border-gray-300 hover:border-orange-300 hover:bg-orange-50 text-orange-500 hover:text-orange-600"
									onClick={() => {
										const updatedIngredients = [
											...(newRecipe.ingredients || []),
											{ name: "", amount: "", unit: "" },
										];
										setNewRecipe({
											...newRecipe,
											ingredients: updatedIngredients,
										});
									}}
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Ingredient
								</Button>
							</div>
						</div>

						<div className="border-t border-gray-200 pt-6">
							<h3 className="text-lg font-medium mb-4 text-gray-900">
								Instructions
							</h3>
							<p className="text-gray-600 text-sm mb-4">
								Add step-by-step instructions for preparing your recipe.
							</p>

							<div className="space-y-4">
								{(newRecipe.instructions || []).map((instruction, index) => (
									<div key={index} className="flex space-x-3">
										<div className="flex-shrink-0 mt-1">
											<div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
												{index + 1}
											</div>
										</div>
										<div className="flex-1">
											<Textarea
												className="bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 min-h-20 shadow-sm"
												placeholder={`Step ${index + 1} instructions...`}
												value={instruction}
												onChange={(e) => {
													const updatedInstructions = [
														...(newRecipe.instructions || []),
													];
													updatedInstructions[index] = e.target.value;
													setNewRecipe({
														...newRecipe,
														instructions: updatedInstructions,
													});
												}}
											/>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 mt-1 rounded-full"
											onClick={() => {
												const updatedInstructions = [
													...(newRecipe.instructions || []),
												];
												updatedInstructions.splice(index, 1);
												setNewRecipe({
													...newRecipe,
													instructions: updatedInstructions,
												});
											}}
										>
											✕
										</Button>
									</div>
								))}

								<Button
									variant="outline"
									className="w-full border-dashed border-gray-300 hover:border-orange-300 hover:bg-orange-50 text-orange-500 hover:text-orange-600"
									onClick={() => {
										const updatedInstructions = [
											...(newRecipe.instructions || []),
											"",
										];
										setNewRecipe({
											...newRecipe,
											instructions: updatedInstructions,
										});
									}}
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Step
								</Button>
							</div>
						</div>
					</div>

					<DialogFooter className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
						<Button
							variant="outline"
							onClick={() => setIsCreateRecipeModalOpen(false)}
							className="border-gray-300 hover:bg-gray-50 text-gray-700"
						>
							Cancel
						</Button>
						<Button
							className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-sm"
							onClick={handleCreateRecipe}
						>
							Publish Recipe
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="md:hidden fixed bottom-6 right-6 z-10">
				<Button
					className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg text-white border-0"
					onClick={() => setIsCreateRecipeModalOpen(true)}
				>
					<Plus className="h-6 w-6" />
				</Button>
			</div>

			<div className="md:hidden fixed bottom-20 inset-x-4 z-10 bg-white border border-gray-200 rounded-full shadow-lg overflow-hidden">
				<div className="relative flex items-center">
					<Search className="absolute left-3 text-gray-400 h-4 w-4" />
					<Input
						type="text"
						placeholder="Search recipes, ingredients..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 pr-10 py-3 bg-transparent border-0 focus:ring-0"
					/>
					{searchQuery && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-1 h-8 w-8 text-gray-400 hover:text-orange-500"
							onClick={() => setSearchQuery("")}
						>
							✕
						</Button>
					)}
				</div>
			</div>

			{/* User profile modal */}
			<Dialog
				open={isUserProfileModalOpen}
				onOpenChange={setIsUserProfileModalOpen}
			>
				<DialogContent className="bg-white border-gray-200 text-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-0 shadow-xl">
					{selectedUser && (
						<>
							<DialogTitle className="sr-only">
								{selectedUser.name}'s Profile
							</DialogTitle>
							<div className="relative h-40 bg-gradient-to-r from-orange-400 to-red-500">
								<div className="absolute -bottom-16 left-6">
									<Avatar className="h-32 w-32 border-4 border-white shadow-xl">
										<AvatarImage
											src={selectedUser.profileImage}
											alt={selectedUser.name}
										/>
										<AvatarFallback className="text-3xl bg-orange-100 text-orange-600">
											{selectedUser.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</div>
							</div>

							<div className="pt-20 px-6 pb-6">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
									<div>
										<h2 className="text-2xl font-bold text-gray-900">
											{selectedUser.name}
										</h2>
										<p className="text-orange-500 mb-1">
											@{selectedUser.username}
										</p>
										<div className="flex items-center text-sm text-gray-500">
											<Globe className="h-4 w-4 mr-1" />
											<span>{selectedUser.location}</span>
											<span className="mx-2">•</span>
											<Clock className="h-4 w-4 mr-1" />
											<span>Joined {selectedUser.joinDate}</span>
										</div>
									</div>

									{selectedUser && selectedUser.id !== currentUser.id && (
										<Button
											className={`mt-4 md:mt-0 ${
												followedUsers.includes(selectedUser.id)
													? "bg-white border border-orange-500 text-orange-500 hover:bg-orange-50"
													: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
											} shadow-sm`}
											onClick={() => handleFollowUser(selectedUser.id)}
										>
											{followedUsers.includes(selectedUser.id) ? (
												<>
													<CheckCircle className="h-4 w-4 mr-2" />
													Following
												</>
											) : (
												<>
													<UserPlus className="h-4 w-4 mr-2" />
													Follow Chef
												</>
											)}
										</Button>
									)}
								</div>

								<div className="mb-6">
									<p className="text-gray-700 leading-relaxed">
										{selectedUser.bio}
									</p>
								</div>

								<div className="flex space-x-6 mb-8 border-b border-gray-200 pb-6">
									<div className="text-center">
										<p className="text-2xl font-bold text-gray-900">
											{selectedUser.recipeCount}
										</p>
										<p className="text-sm text-gray-500">Recipes</p>
									</div>
									<div className="text-center">
										<p className="text-2xl font-bold text-gray-900">
											{selectedUser.followers}
										</p>
										<p className="text-sm text-gray-500">Followers</p>
									</div>
									<div className="text-center">
										<p className="text-2xl font-bold text-gray-900">
											{selectedUser.following}
										</p>
										<p className="text-sm text-gray-500">Following</p>
									</div>
								</div>

								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<h3 className="text-xl font-medium text-gray-900">
											Top Recipes
										</h3>
										<Button
											variant="link"
											className="text-orange-500 hover:text-orange-600 p-0"
											onClick={() => {
												setActiveTab("discover");
												setIsUserProfileModalOpen(false);
											}}
										>
											View All
										</Button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{recipes
											.filter((recipe) => recipe.authorId === selectedUser.id)
											.sort((a, b) => b.likes - a.likes)
											.slice(0, 4)
											.map((recipe) => (
												<Card
													key={recipe.id}
													className="bg-white border-gray-200 cursor-pointer hover:border-orange-300 transition-all group overflow-hidden shadow-sm"
													onClick={() => {
														setIsUserProfileModalOpen(false);
														setTimeout(() => {
															handleOpenRecipeDetails(recipe);
														}, 300);
													}}
												>
													<div className="relative h-32 overflow-hidden">
														<img
															src={recipe.coverImage}
															alt={recipe.title}
															className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
														<div className="absolute bottom-3 left-3 right-3">
															<h4 className="text-white font-medium mb-1">
																{recipe.title}
															</h4>
															<div className="flex justify-between items-center text-sm">
																<StarRating rating={recipe.rating} />
																<div className="flex items-center text-white">
																	<Heart
																		className={`h-4 w-4 mr-1.5 ${
																			isRecipeLiked(selectedRecipe?.id)
																				? "fill-rose-500"
																				: ""
																		} text-rose-500`}
																	/>
																	<span>{recipe.likes}</span>
																</div>
															</div>
														</div>
													</div>
												</Card>
											))}
									</div>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
