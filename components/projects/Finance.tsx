"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
	AreaChart,
	Area,
} from "recharts";
import {
	Sun,
	Moon,
	Menu,
	X,
	File,
	Download,
	AlertTriangle,
	DollarSign,
	Home,
	CreditCard,
	PieChart as PieChartIcon,
	Target,
	Bell,
	ChevronRight,
	ChevronLeft,
	BriefcaseMedical,
	Coffee,
	FileText,
	ShoppingBag,
	Truck,
	Film,
	Zap,
	Activity,
	BookOpen,
	Globe,
	Twitter,
	Linkedin,
	Plus,
	Filter,
	Calendar,
	TrendingUp,
	Settings,
	User,
	Eye,
	EyeOff,
	Search,
	Trash2,
	Edit,
	Clock,
	Clipboard,
} from "lucide-react";

const exportToPDF = (elementId, filename) => {
	alert(`PDF export of ${elementId} as ${filename}.pdf would happen here.`);
};

const exportToCSV = (data, filename) => {
	if (!data || !data.length) return;

	const headers = Object.keys(data[0]);
	const csvRows = [
		headers.join(","),
		...data.map((row) =>
			headers
				.map((header) => {
					const value = row[header] ?? "";
					const escaped =
						typeof value === "string" ? value.replace(/"/g, '""') : value;
					return `"${escaped}"`;
				})
				.join(",")
		),
	];

	const csvContent = csvRows.join("\n");
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", `${filename}.csv`);
	link.style.visibility = "hidden";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

interface Transaction {
	id: number;
	description: string;
	amount: number;
	date: string;
	category: string;
	isRecurring?: boolean;
	notes?: string;
}

interface Budget {
	id: number;
	category: string;
	limit: number;
	spent: number;
	startDate?: string;
	endDate?: string;
}

interface Goal {
	id: number;
	name: string;
	target: number;
	saved: number;
	deadline?: string;
	priority?: "low" | "medium" | "high";
}

interface Notification {
	id: number;
	message: string;
	type: "info" | "warning" | "error" | "success";
	timestamp: string;
	read: boolean;
	source?: string;
}

interface Account {
	id: number;
	name: string;
	type: string;
	balance: number;
	currency: string;
}

const CATEGORIES = [
	{ name: "Food", icon: <Coffee size={16} /> },
	{ name: "Housing", icon: <Home size={16} /> },
	{ name: "Transportation", icon: <Truck size={16} /> },
	{ name: "Entertainment", icon: <Film size={16} /> },
	{ name: "Utilities", icon: <Zap size={16} /> },
	{ name: "Healthcare", icon: <BriefcaseMedical size={16} /> },
	{ name: "Shopping", icon: <ShoppingBag size={16} /> },
	{ name: "Travel", icon: <Globe size={16} /> },
	{ name: "Education", icon: <BookOpen size={16} /> },
	{ name: "Income", icon: <DollarSign size={16} /> },
	{ name: "Other", icon: <FileText size={16} /> },
];

const TIME_PERIODS = [
	{ value: "7days", label: "Last 7 Days" },
	{ value: "30days", label: "Last 30 Days" },
	{ value: "90days", label: "Last 90 Days" },
	{ value: "ytd", label: "Year to Date" },
	{ value: "custom", label: "Custom Range" },
];

const LARGE_TRANSACTION_THRESHOLD = 500;
const SUSPICIOUS_AMOUNT_CHANGE = 200;
const RECURRING_THRESHOLD = 3;
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];

const fetchBankTransactions = async (): Promise<Transaction[]> => {
	return new Promise((resolve) =>
		setTimeout(
			() =>
				resolve([
					{
						id: 1,
						description: "Grocery Store",
						amount: 75,
						date: "2023-10-01",
						category: "Food",
					},
					{
						id: 2,
						description: "Salary Deposit",
						amount: -1500,
						date: "2023-10-02",
						category: "Income",
					},
					{
						id: 3,
						description: "Rent Payment",
						amount: 800,
						date: "2023-10-03",
						category: "Housing",
					},
					{
						id: 4,
						description: "Gas Station",
						amount: 45,
						date: "2023-10-05",
						category: "Transportation",
					},
					{
						id: 5,
						description: "Netflix Subscription",
						amount: 15,
						date: "2023-10-06",
						category: "Entertainment",
						isRecurring: true,
					},
					{
						id: 6,
						description: "Pharmacy",
						amount: 35,
						date: "2023-10-08",
						category: "Healthcare",
					},
					{
						id: 7,
						description: "Water Bill",
						amount: 55,
						date: "2023-10-10",
						category: "Utilities",
						isRecurring: true,
					},
					{
						id: 8,
						description: "Overtime Pay",
						amount: -200,
						date: "2023-10-15",
						category: "Income",
					},
					{
						id: 9,
						description: "Restaurant",
						amount: 85,
						date: "2023-10-18",
						category: "Food",
					},
				]),
			1000
		)
	);
};

const MENU_ITEMS = [
	{ key: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
	{ key: "transactions", label: "Transactions", icon: <Activity size={20} /> },
	{ key: "budgets", label: "Budgets", icon: <PieChartIcon size={20} /> },
	{ key: "goals", label: "Goals", icon: <Target size={20} /> },
	{ key: "bank", label: "Accounts", icon: <CreditCard size={20} /> },
	{ key: "reports", label: "Reports", icon: <FileText size={20} /> },
	{ key: "notifications", label: "Notifications", icon: <Bell size={20} /> },
	{ key: "about", label: "About", icon: <BookOpen size={20} /> },
	{ key: "settings", label: "Settings", icon: <Settings size={20} /> },
];

const FinancialDashboard = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [filteredTransactions, setFilteredTransactions] = useState<
		Transaction[]
	>([]);
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [goals, setGoals] = useState<Goal[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [tempExpanded, setTempExpanded] = useState(false);
	const [activeSection, setActiveSection] = useState("dashboard");
	const [activeSubSection, setActiveSubSection] = useState("overview");
	const [isLoading, setIsLoading] = useState(true);
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTimePeriod, setSelectedTimePeriod] = useState("30days");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedCurrency, setSelectedCurrency] = useState("USD");
	const [showPasswordField, setShowPasswordField] = useState(false);
	const [isBalanceHidden, setIsBalanceHidden] = useState(false);
	const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
	const [customDateRange, setCustomDateRange] = useState({
		start: "",
		end: "",
	});
	const [showCustomDateRange, setShowCustomDateRange] = useState(false);

	const [newTransaction, setNewTransaction] = useState({
		description: "",
		amount: "",
		category: CATEGORIES[0].name,
		date: new Date().toISOString().split("T")[0],
		notes: "",
		isRecurring: false,
	});
	const [newBudget, setNewBudget] = useState({
		category: CATEGORIES[0].name,
		limit: "",
		startDate: new Date().toISOString().split("T")[0],
		endDate: "",
	});
	const [newGoal, setNewGoal] = useState({
		name: "",
		target: "",
		deadline: "",
		priority: "medium" as "low" | "medium" | "high",
	});
	const [editingItem, setEditingItem] = useState<any>(null);
	const [editingType, setEditingType] = useState<
		"transaction" | "budget" | "goal" | null
	>(null);

	const [isMobile, setIsMobile] = useState(false);
	const chartRef = useRef(null);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth >= 768) setIsSidebarOpen(false);
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);

			try {
				const data = await fetchBankTransactions();
				setTransactions(data);
				setFilteredTransactions(data);

				const initialBudgets = [
					{
						id: 1,
						category: "Food",
						limit: 300,
						spent: 200,
						startDate: "2023-10-01",
						endDate: "2023-10-31",
					},
					{
						id: 2,
						category: "Housing",
						limit: 1000,
						spent: 800,
						startDate: "2023-10-01",
						endDate: "2023-10-31",
					},
					{
						id: 3,
						category: "Transportation",
						limit: 150,
						spent: 45,
						startDate: "2023-10-01",
						endDate: "2023-10-31",
					},
					{
						id: 4,
						category: "Entertainment",
						limit: 100,
						spent: 15,
						startDate: "2023-10-01",
						endDate: "2023-10-31",
					},
				];
				setBudgets(initialBudgets);

				const initialGoals = [
					{
						id: 1,
						name: "Vacation",
						target: 2000,
						saved: 500,
						deadline: "2023-12-31",
						priority: "medium" as "medium",
					},
					{
						id: 2,
						name: "Emergency Fund",
						target: 5000,
						saved: 1200,
						deadline: "2024-06-30",
						priority: "high" as "high",
					},
				];
				setGoals(initialGoals);

				const initialAccounts = [
					{
						id: 1,
						name: "Main Checking",
						type: "checking",
						balance: 2500,
						currency: "USD",
					},
					{
						id: 2,
						name: "Savings",
						type: "savings",
						balance: 5000,
						currency: "USD",
					},
					{
						id: 3,
						name: "Investment",
						type: "investment",
						balance: 10000,
						currency: "USD",
					},
				];
				setAccounts(initialAccounts);

				checkBudgetsAndNotify(data, initialBudgets);
				checkSuspiciousTransactions(data);

				setIsLoading(false);
			} catch (error) {
				console.error("Error loading data:", error);
				setIsLoading(false);

				addNotification("Failed to load data. Please try again.", "error");
			}
		};

		loadData();
	}, []);

	useEffect(() => {
		if (transactions.length === 0) return;

		let filtered = [...transactions];

		if (searchTerm) {
			const lowerSearchTerm = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(t) =>
					t.description.toLowerCase().includes(lowerSearchTerm) ||
					t.category.toLowerCase().includes(lowerSearchTerm)
			);
		}

		if (selectedCategory !== "all") {
			filtered = filtered.filter((t) => t.category === selectedCategory);
		}

		const today = new Date();
		let startDate: Date;

		switch (selectedTimePeriod) {
			case "7days":
				startDate = new Date(today);
				startDate.setDate(today.getDate() - 7);
				filtered = filtered.filter((t) => new Date(t.date) >= startDate);
				break;
			case "30days":
				startDate = new Date(today);
				startDate.setDate(today.getDate() - 30);
				filtered = filtered.filter((t) => new Date(t.date) >= startDate);
				break;
			case "90days":
				startDate = new Date(today);
				startDate.setDate(today.getDate() - 90);
				filtered = filtered.filter((t) => new Date(t.date) >= startDate);
				break;
			case "ytd":
				startDate = new Date(today.getFullYear(), 0, 1);
				filtered = filtered.filter((t) => new Date(t.date) >= startDate);
				break;
			case "custom":
				if (customDateRange.start && customDateRange.end) {
					const customStart = new Date(customDateRange.start);
					const customEnd = new Date(customDateRange.end);
					customEnd.setHours(23, 59, 59, 999);
					filtered = filtered.filter((t) => {
						const transactionDate = new Date(t.date);
						return (
							transactionDate >= customStart && transactionDate <= customEnd
						);
					});
				}
				break;
		}

		setFilteredTransactions(filtered);
	}, [
		transactions,
		searchTerm,
		selectedCategory,
		selectedTimePeriod,
		customDateRange,
	]);

	const isLargeTransaction = (amount: number) => {
		return Math.abs(amount) >= LARGE_TRANSACTION_THRESHOLD;
	};

	const formatCurrency = (amount: number) => {
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: selectedCurrency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

		return formatter.format(amount);
	};

	const checkSuspiciousTransactions = (trans: Transaction[]) => {
		const categoryGroups = {};
		trans.forEach((t) => {
			if (!categoryGroups[t.category]) {
				categoryGroups[t.category] = [];
			}
			categoryGroups[t.category].push(t);
		});

		Object.keys(categoryGroups).forEach((category) => {
			const transactions = categoryGroups[category];
			if (transactions.length < 2) return;

			transactions.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
			);

			const categoryTotal = transactions.reduce(
				(sum, t) => sum + Math.abs(t.amount),
				0
			);
			const categoryAvg = categoryTotal / transactions.length;

			transactions.forEach((t) => {
				const percentDiff = (Math.abs(t.amount) / categoryAvg) * 100;

				if (percentDiff > SUSPICIOUS_AMOUNT_CHANGE && Math.abs(t.amount) > 50) {
					addNotification(
						`Unusual ${t.category} transaction: ${
							t.description
						} for ${formatCurrency(t.amount)}. This is ${Math.round(
							percentDiff - 100
						)}% higher than average.`,
						"warning"
					);
				}
			});
		});
	};

	const addNotification = (
		message: string,
		type: "info" | "warning" | "error" | "success",
		source?: string
	) => {
		const notification: Notification = {
			id: Date.now() + Math.random(),
			message,
			type,
			timestamp: new Date().toLocaleString(),
			read: false,
			source,
		};

		setNotifications((prev) => [notification, ...prev]);
	};

	const updateBudgets = (
		trans: Transaction[],
		budgetList: Budget[] = budgets
	) => {
		setBudgets((prev) =>
			prev.map((b) => {
				const spent = trans
					.filter(
						(t) =>
							t.category === b.category &&
							t.amount > 0 &&
							(!b.startDate || new Date(t.date) >= new Date(b.startDate)) &&
							(!b.endDate || new Date(t.date) <= new Date(b.endDate))
					)
					.reduce((sum, t) => sum + t.amount, 0);

				return { ...b, spent };
			})
		);
	};

	const checkBudgetsAndNotify = (
		trans: Transaction[],
		budgetList: Budget[] = budgets
	) => {
		const newNotifs: Notification[] = [];

		budgetList.forEach((b) => {
			const spent = trans
				.filter(
					(t) =>
						t.category === b.category &&
						t.amount > 0 &&
						(!b.startDate || new Date(t.date) >= new Date(b.startDate)) &&
						(!b.endDate || new Date(t.date) <= new Date(b.endDate))
				)
				.reduce((sum, t) => sum + t.amount, 0);

			const usage = spent / b.limit;

			if (
				usage > 1 &&
				!notifications.some(
					(n) =>
						n.message.includes(`${b.category} budget exceeded`) &&
						n.type === "error"
				)
			) {
				newNotifs.push({
					id: Date.now() + Math.random(),
					message: `${
						b.category
					} budget exceeded! You've spent ${formatCurrency(
						spent
					)} of your ${formatCurrency(b.limit)} limit.`,
					type: "error",
					timestamp: new Date().toLocaleString(),
					read: false,
					source: "budget",
				});
			} else if (
				usage > 0.8 &&
				usage <= 1 &&
				!notifications.some(
					(n) =>
						n.message.includes(`${b.category} nearing limit`) &&
						n.type === "warning"
				)
			) {
				newNotifs.push({
					id: Date.now() + Math.random(),
					message: `${b.category} nearing limit (${(usage * 100).toFixed(
						0
					)}%). You've spent ${formatCurrency(spent)} of your ${formatCurrency(
						b.limit
					)} limit.`,
					type: "warning",
					timestamp: new Date().toLocaleString(),
					read: false,
					source: "budget",
				});
			}
		});

		if (newNotifs.length > 0) {
			setNotifications((prev) => [...newNotifs, ...prev]);
		}
	};

	const markNotificationAsRead = (id: number) => {
		setNotifications((prev) =>
			prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
		);
	};

	const markAllNotificationsAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	};

	const removeNotification = (id: number) => {
		setNotifications((prev) => prev.filter((notif) => notif.id !== id));
	};

	const addTransaction = () => {
		if (
			!newTransaction.description ||
			!newTransaction.amount ||
			!newTransaction.category
		)
			return;

		const amount = parseFloat(newTransaction.amount);

		const transaction: Transaction = {
			id: Date.now(),
			date: newTransaction.date || new Date().toISOString().split("T")[0],
			description: newTransaction.description,
			amount: amount,
			category: newTransaction.category,
			isRecurring: newTransaction.isRecurring,
			notes: newTransaction.notes,
		};

		const updatedTransactions = [...transactions, transaction];
		setTransactions(updatedTransactions);

		detectRecurringTransactions(transaction, updatedTransactions);

		if (isLargeTransaction(amount)) {
			addNotification(
				`Large ${amount > 0 ? "expense" : "income"} detected: ${formatCurrency(
					Math.abs(amount)
				)} for ${transaction.description}`,
				amount > 0 ? "warning" : "info",
				"transaction"
			);
		}

		updateBudgets(updatedTransactions);
		checkBudgetsAndNotify(updatedTransactions);

		setNewTransaction({
			description: "",
			amount: "",
			category: CATEGORIES[0].name,
			date: new Date().toISOString().split("T")[0],
			notes: "",
			isRecurring: false,
		});

		addNotification(
			`Transaction added successfully: ${transaction.description}`,
			"success"
		);
	};

	const detectRecurringTransactions = (
		newTransaction: Transaction,
		allTransactions: Transaction[]
	) => {
		const similarTransactions = allTransactions.filter(
			(t) =>
				t.id !== newTransaction.id &&
				t.description.toLowerCase() ===
					newTransaction.description.toLowerCase() &&
				t.category === newTransaction.category
		);

		if (
			similarTransactions.length >= RECURRING_THRESHOLD - 1 &&
			!newTransaction.isRecurring
		) {
			addNotification(
				`Detected recurring transaction pattern: ${newTransaction.description}. You may want to mark it as recurring.`,
				"info",
				"transaction"
			);
		}
	};

	const updateTransaction = (transaction: Transaction) => {
		setTransactions((prev) =>
			prev.map((t) => (t.id === transaction.id ? transaction : t))
		);
		updateBudgets([...transactions]);
		setEditingItem(null);
		setEditingType(null);

		addNotification(
			`Transaction updated: ${transaction.description}`,
			"success"
		);
	};

	const deleteTransaction = (id: number) => {
		const transactionToDelete = transactions.find((t) => t.id === id);
		if (!transactionToDelete) return;

		setTransactions((prev) => prev.filter((t) => t.id !== id));
		updateBudgets(transactions.filter((t) => t.id !== id));

		addNotification(
			`Transaction deleted: ${transactionToDelete.description}`,
			"info"
		);
	};

	const addBudget = () => {
		if (!newBudget.category || !newBudget.limit) return;

		const budget: Budget = {
			id: Date.now(),
			category: newBudget.category,
			limit: parseFloat(newBudget.limit),
			spent: 0,
			startDate: newBudget.startDate,
			endDate: newBudget.endDate || undefined,
		};

		const updatedBudgets = [...budgets, budget];
		setBudgets(updatedBudgets);

		updateBudgets(transactions, updatedBudgets);
		checkBudgetsAndNotify(transactions, updatedBudgets);

		setNewBudget({
			category: CATEGORIES[0].name,
			limit: "",
			startDate: new Date().toISOString().split("T")[0],
			endDate: "",
		});

		addNotification(`Budget added for ${budget.category}`, "success");
	};

	const updateBudget = (budget: Budget) => {
		setBudgets((prev) => prev.map((b) => (b.id === budget.id ? budget : b)));
		checkBudgetsAndNotify(transactions);
		setEditingItem(null);
		setEditingType(null);

		addNotification(`Budget updated for ${budget.category}`, "success");
	};

	const deleteBudget = (id: number) => {
		const budgetToDelete = budgets.find((b) => b.id === id);
		if (!budgetToDelete) return;

		setBudgets((prev) => prev.filter((b) => b.id !== id));

		addNotification(`Budget deleted for ${budgetToDelete.category}`, "info");
	};

	const addGoal = () => {
		if (!newGoal.name || !newGoal.target) return;

		const goal: Goal = {
			id: Date.now(),
			name: newGoal.name,
			target: parseFloat(newGoal.target),
			saved: 0,
			deadline: newGoal.deadline || undefined,
			priority: newGoal.priority,
		};

		setGoals((prev) => [...prev, goal]);

		setNewGoal({
			name: "",
			target: "",
			deadline: "",
			priority: "medium",
		});

		addNotification(`New goal added: ${goal.name}`, "success");
	};

	const updateGoalProgress = (goalId: number, amount: number) => {
		setGoals((prev) =>
			prev.map((g) => {
				if (g.id === goalId) {
					const newSaved = Math.max(0, g.saved + amount);

					if (newSaved >= g.target && g.saved < g.target) {
						addNotification(
							`Congratulations! You've reached your ${g.name} goal!`,
							"success"
						);
					}
					return { ...g, saved: newSaved };
				}
				return g;
			})
		);
	};

	const updateGoal = (goal: Goal) => {
		setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
		setEditingItem(null);
		setEditingType(null);

		addNotification(`Goal updated: ${goal.name}`, "success");
	};

	const deleteGoal = (id: number) => {
		const goalToDelete = goals.find((g) => g.id === id);
		if (!goalToDelete) return;

		setGoals((prev) => prev.filter((g) => g.id !== id));

		addNotification(`Goal deleted: ${goalToDelete.name}`, "info");
	};

	const exportTransactionsToCSV = () => {
		const data = filteredTransactions.map((t) => ({
			Description: t.description,
			Amount: t.amount,
			Category: t.category,
			Date: t.date,
			Recurring: t.isRecurring ? "Yes" : "No",
			Notes: t.notes || "",
		}));
		exportToCSV(data, "transactions");
		addNotification("Transactions exported to CSV", "success");
	};

	const exportTransactionsToPDF = () => {
		exportToPDF("transactions-table", "transactions");
		addNotification("Transactions exported to PDF", "success");
	};

	const exportBudgetsToCSV = () => {
		const data = budgets.map((b) => ({
			Category: b.category,
			Limit: b.limit,
			Spent: b.spent,
			Remaining: b.limit - b.spent,
			PercentUsed: ((b.spent / b.limit) * 100).toFixed(2) + "%",
			StartDate: b.startDate || "N/A",
			EndDate: b.endDate || "N/A",
		}));
		exportToCSV(data, "budgets");
		addNotification("Budgets exported to CSV", "success");
	};

	const exportGoalsToCSV = () => {
		const data = goals.map((g) => ({
			Name: g.name,
			Target: g.target,
			Saved: g.saved,
			Remaining: g.target - g.saved,
			PercentComplete: ((g.saved / g.target) * 100).toFixed(2) + "%",
			Deadline: g.deadline || "N/A",
			Priority: g.priority || "Medium",
		}));
		exportToCSV(data, "goals");
		addNotification("Goals exported to CSV", "success");
	};

	const exportFinancialReport = () => {
		const data = [
			{
				Section: "Income Summary",
				Total: totalIncome,
				Details: "Total income for selected period",
			},
			{
				Section: "Expense Summary",
				Total: totalExpenses,
				Details: "Total expenses for selected period",
			},
			{
				Section: "Net Income",
				Total: totalIncome - totalExpenses,
				Details: "Income minus expenses",
			},
			{
				Section: "Savings Rate",
				Total:
					totalIncome > 0
						? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(2) +
						  "%"
						: "0%",
				Details: "Percentage of income saved",
			},
		];

		const categoryData = CATEGORIES.map((cat) => {
			const categoryExpenses = filteredTransactions
				.filter((t) => t.category === cat.name && t.amount > 0)
				.reduce((sum, t) => sum + t.amount, 0);

			return {
				Section: `${cat.name} Expenses`,
				Total: categoryExpenses,
				Details: `Total spent on ${cat.name.toLowerCase()}`,
			};
		}).filter((item) => item.Total > 0);

		exportToCSV([...data, ...categoryData], "financial-report");
		addNotification("Financial report exported to CSV", "success");
	};

	const totalIncome = useMemo(
		() =>
			filteredTransactions
				.filter((t) => t.amount < 0)
				.reduce((sum, t) => sum + Math.abs(t.amount), 0),
		[filteredTransactions]
	);

	const totalExpenses = useMemo(
		() =>
			filteredTransactions
				.filter((t) => t.amount > 0)
				.reduce((sum, t) => sum + t.amount, 0),
		[filteredTransactions]
	);

	const spendingData = useMemo(
		() => budgets.map((b) => ({ name: b.category, value: b.spent })),
		[budgets]
	);

	const categorySpendingData = useMemo(() => {
		const data = {};
		filteredTransactions.forEach((t) => {
			if (t.amount > 0) {
				if (!data[t.category]) {
					data[t.category] = 0;
				}
				data[t.category] += t.amount;
			}
		});

		return Object.keys(data).map((category) => ({
			name: category,
			value: data[category],
		}));
	}, [filteredTransactions]);

	const monthlyTrendsData = useMemo(() => {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 5);

		const months = [];
		for (let i = 0; i < 6; i++) {
			const date = new Date(startDate);
			date.setMonth(date.getMonth() + i);
			months.push({
				month: date.toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				}),
				income: 0,
				expenses: 0,
				date: date,
			});
		}

		transactions.forEach((t) => {
			const transDate = new Date(t.date);
			const matchingMonth = months.find(
				(m) =>
					m.date.getMonth() === transDate.getMonth() &&
					m.date.getFullYear() === transDate.getFullYear()
			);

			if (matchingMonth) {
				if (t.amount < 0) {
					matchingMonth.income += Math.abs(t.amount);
				} else {
					matchingMonth.expenses += t.amount;
				}
			}
		});

		return months;
	}, [transactions]);

	const projectionData = useMemo(() => {
		const averageMonthlyIncome =
			monthlyTrendsData.reduce((sum, m) => sum + m.income, 0) /
			monthlyTrendsData.length;
		const averageMonthlyExpenses =
			monthlyTrendsData.reduce((sum, m) => sum + m.expenses, 0) /
			monthlyTrendsData.length;

		return Array.from({ length: 6 }, (_, i) => {
			const month = new Date();
			month.setMonth(month.getMonth() + i + 1);
			return {
				month: month.toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				}),
				income: averageMonthlyIncome * (1 + i * 0.02),
				expenses: averageMonthlyExpenses * (1 + i * 0.01),
				savings:
					averageMonthlyIncome * (1 + i * 0.02) -
					averageMonthlyExpenses * (1 + i * 0.01),
			};
		});
	}, [monthlyTrendsData]);

	const theme = {
		bg: isDarkMode ? "bg-gray-900" : "bg-white",
		text: isDarkMode ? "text-gray-200" : "text-gray-900",
		cardBg: isDarkMode ? "bg-gray-800" : "bg-gray-100",
		cardBorder: isDarkMode ? "border-gray-700" : "border-gray-300",
		inputBg: isDarkMode ? "bg-gray-700" : "bg-white",
		inputBorder: isDarkMode ? "border-gray-600" : "border-gray-300",
		accent: isDarkMode ? "bg-blue-600" : "bg-blue-700",
		accentHover: isDarkMode ? "hover:bg-blue-700" : "hover:bg-blue-800",
		sectionBg: isDarkMode ? "bg-gray-700" : "bg-white",
		sectionBorder: isDarkMode ? "border-gray-600" : "border-gray-200",
		muted: isDarkMode ? "text-gray-300" : "text-gray-500",
		highlight: isDarkMode ? "bg-gray-700" : "bg-gray-50",
		highlightHover: isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200",
		success: isDarkMode ? "text-green-300" : "text-green-600",
		warning: isDarkMode ? "text-yellow-300" : "text-yellow-600",
		error: isDarkMode ? "text-red-300" : "text-red-600",
		info: isDarkMode ? "text-blue-300" : "text-blue-600",
	};

	const getCategoryIcon = (categoryName) => {
		const category = CATEGORIES.find((c) => c.name === categoryName);
		return category ? category.icon : <FileText size={16} />;
	};

	const getProgressColor = (percentage) => {
		if (percentage >= 100) return "bg-red-500 dark:bg-red-500";
		if (percentage >= 80) return "bg-yellow-500 dark:bg-yellow-500";
		return "bg-green-500 dark:bg-green-500";
	};

	const getPriorityColor = (priority) => {
		if (priority === "high") return "text-red-500 dark:text-red-300";
		if (priority === "medium") return "text-yellow-500 dark:text-yellow-300";
		return "text-green-500 dark:text-green-300";
	};

	const getAccountIcon = (type) => {
		switch (type.toLowerCase()) {
			case "checking":
				return <CreditCard size={24} />;
			case "savings":
				return <DollarSign size={24} />;
			case "investment":
				return <TrendingUp size={24} />;
			default:
				return <CreditCard size={24} />;
		}
	};

	const getNotificationIcon = (type, size = 18) => {
		switch (type) {
			case "error":
				return <AlertTriangle size={size} className="text-red-500" />;
			case "warning":
				return <AlertTriangle size={size} className="text-yellow-500" />;
			case "success":
				return <Check size={size} className="text-green-500" />;
			case "info":
			default:
				return <Bell size={size} className="text-blue-500" />;
		}
	};

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<Helmet>
				{" "}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>{" "}
			</Helmet>

			<div
				className={`min-h-screen flex font-sans transition-colors duration-300 ${theme.bg} ${theme.text} overflow-x-hidden`}
			>
				{}
				<header
					className={`md:hidden fixed top-0 left-0 right-0 z-50 ${theme.cardBg} shadow-md px-4 py-3 flex justify-between items-center`}
				>
					<button
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className="text-2xl text-blue-600 dark:text-blue-400 focus:outline-none"
						aria-label="Toggle menu"
					>
						{isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
					<h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
						FinancePro
					</h1>
					<div className="flex items-center space-x-3">
						<button
							onClick={() => setIsDarkMode(!isDarkMode)}
							className={`p-2 rounded-full ${theme.highlight} focus:outline-none`}
							aria-label="Toggle theme"
						>
							{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
						</button>
						{unreadNotificationsCount > 0 && (
							<button
								onClick={() => setActiveSection("notifications")}
								className={`p-2 rounded-full ${theme.highlight} relative focus:outline-none`}
								aria-label="Notifications"
							>
								<Bell size={18} />
								<span className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-600 text-white dark:text-gray-100 text-xs w-5 h-5 flex items-center justify-center rounded-full">
									{unreadNotificationsCount}
								</span>
							</button>
						)}
					</div>
				</header>

				{}
				<nav
					onMouseEnter={() => {
						if (isCollapsed) setTempExpanded(true);
					}}
					onMouseLeave={() => {
						if (isCollapsed) setTempExpanded(false);
					}}
					className={`fixed inset-y-0 left-0 z-40 transition-all duration-150 ease-in-out ${
						isMobile ? "w-64" : isCollapsed && !tempExpanded ? "w-20" : "w-64"
					} ${theme.cardBg} shadow-2xl ${
						isSidebarOpen ? "translate-x-0" : "-translate-x-full"
					} md:translate-x-0`}
				>
					<div className="p-6 flex justify-between items-center">
						{isCollapsed && !tempExpanded ? (
							<div className="text-blue-600 dark:text-blue-400">
								<Home size={24} />
							</div>
						) : (
							<h2 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
								FinancePro
							</h2>
						)}
					</div>
					<ul className="space-y-2 px-4">
						{MENU_ITEMS.map((item) => (
							<li
								key={item.key}
								className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-base font-medium transition-all duration-200 ${
									activeSection === item.key
										? "bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-white shadow-md"
										: `hover:bg-gray-100 dark:hover:bg-gray-700 ${theme.text}`
								}`}
								onClick={() => {
									setActiveSection(item.key);
									if (isMobile) setIsSidebarOpen(false);
								}}
							>
								<span>{item.icon}</span>
								{!(isCollapsed && !tempExpanded) && (
									<span className="sidebar-content">{item.label}</span>
								)}
								{item.key === "notifications" &&
									unreadNotificationsCount > 0 && (
										<span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
											{unreadNotificationsCount}
										</span>
									)}
							</li>
						))}
					</ul>
					{}
					<div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2">
						<button
							onClick={() => setIsDarkMode(!isDarkMode)}
							className={`p-3 rounded-full ${theme.highlight} ${theme.highlightHover} flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none`}
							aria-label="Toggle theme"
						>
							{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
						</button>
						<button
							onClick={() => setIsCollapsed(!isCollapsed)}
							className={`p-3 rounded-full ${theme.highlight} ${theme.highlightHover} flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none`}
							aria-label="Toggle sidebar"
						>
							{isCollapsed ? (
								<ChevronRight size={20} />
							) : (
								<ChevronLeft size={20} />
							)}
						</button>
					</div>
				</nav>

				{}
				<main
					className={`flex-1 overflow-auto transition-all duration-300 md:${
						isCollapsed && !tempExpanded ? "ml-20" : "ml-64"
					}`}
				>
					<div className="pb-6 px-4 md:p-6 w-full max-w-full">
						{}
						<header className="flex flex-col md:flex-row md:justify-between md:items-center my-6 gap-4">
							<h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
								{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
							</h1>

							{}
							{!isLoading && (
								<div className="flex flex-wrap gap-2">
									{activeSection === "dashboard" && (
										<div className="flex gap-2">
											<select
												value={selectedTimePeriod}
												onChange={(e) => {
													setSelectedTimePeriod(e.target.value);
													if (e.target.value === "custom") {
														setShowCustomDateRange(true);
													} else {
														setShowCustomDateRange(false);
													}
												}}
												className={`p-2 text-sm rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500`}
											>
												{TIME_PERIODS.map((period) => (
													<option key={period.value} value={period.value}>
														{period.label}
													</option>
												))}
											</select>

											<button
												onClick={exportFinancialReport}
												className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
											>
												<Download size={16} />
												<span className="hidden sm:inline">Export Report</span>
											</button>
										</div>
									)}

									{activeSection === "transactions" && (
										<div className="flex flex-wrap gap-2">
											<div className="relative">
												<Search
													className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
													size={16}
												/>
												<input
													type="text"
													placeholder="Search transactions"
													value={searchTerm}
													onChange={(e) => setSearchTerm(e.target.value)}
													className={`pl-10 p-2 text-sm rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 w-full`}
												/>
											</div>

											<select
												value={selectedCategory}
												onChange={(e) => setSelectedCategory(e.target.value)}
												className={`p-2 text-sm rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500`}
											>
												<option value="all">All Categories</option>
												{CATEGORIES.map((cat) => (
													<option key={cat.name} value={cat.name}>
														{cat.name}
													</option>
												))}
											</select>

											<div className="flex gap-2">
												<button
													onClick={exportTransactionsToCSV}
													className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
													title="Export as CSV"
												>
													<Download size={16} />
													<span className="hidden sm:inline">CSV</span>
												</button>
												<button
													onClick={exportTransactionsToPDF}
													className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
													title="Export as PDF"
												>
													<File size={16} />
													<span className="hidden sm:inline">PDF</span>
												</button>
											</div>
										</div>
									)}

									{activeSection === "budgets" && (
										<button
											onClick={exportBudgetsToCSV}
											className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
										>
											<Download size={16} />
											<span className="hidden sm:inline">Export CSV</span>
										</button>
									)}

									{activeSection === "goals" && (
										<button
											onClick={exportGoalsToCSV}
											className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
										>
											<Download size={16} />
											<span className="hidden sm:inline">Export CSV</span>
										</button>
									)}

									{activeSection === "bank" && (
										<button
											onClick={() => setIsBalanceHidden(!isBalanceHidden)}
											className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
										>
											{isBalanceHidden ? (
												<Eye size={16} />
											) : (
												<EyeOff size={16} />
											)}
											<span className="hidden sm:inline">
												{isBalanceHidden ? "Show" : "Hide"} Balances
											</span>
										</button>
									)}
								</div>
							)}
						</header>
						{activeSection === "about" && (
							<div className="space-y-6">
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-2xl font-bold mb-6">About FinancePro</h2>

									<div className="space-y-4">
										<div>
											<h3 className="text-xl font-semibold mb-2">
												Our Mission
											</h3>
											<p className={`${theme.muted}`}>
												At FinancePro, we're committed to empowering individuals
												and businesses to take control of their financial
												health. Our platform provides intuitive tools for
												personal finance management, budgeting, and financial
												planning.
											</p>
										</div>

										<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
											<h3 className="text-xl font-semibold mb-2">Features</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="flex items-start gap-3">
													<PieChartIcon className="text-blue-500 mt-1" />
													<div>
														<h4 className="font-medium">
															Comprehensive Budgeting
														</h4>
														<p className={`text-sm ${theme.muted}`}>
															Track expenses, set limits, and get real-time
															budget insights
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<Target className="text-green-500 mt-1" />
													<div>
														<h4 className="font-medium">Goal Tracking</h4>
														<p className={`text-sm ${theme.muted}`}>
															Set and monitor financial goals with progress
															visualization
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<Activity className="text-purple-500 mt-1" />
													<div>
														<h4 className="font-medium">Financial Analytics</h4>
														<p className={`text-sm ${theme.muted}`}>
															Detailed reports and interactive charts for better
															insights
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<Bell className="text-yellow-500 mt-1" />
													<div>
														<h4 className="font-medium">Smart Alerts</h4>
														<p className={`text-sm ${theme.muted}`}>
															Customizable notifications for important financial
															events
														</p>
													</div>
												</div>
											</div>
										</div>

										<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
											<h3 className="text-xl font-semibold mb-4">Our Team</h3>
											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
												{[
													{ name: "Alex Johnson", role: "CEO & Founder" },
													{ name: "Maria Chen", role: "Lead Developer" },
													{ name: "Sam Wilson", role: "Product Designer" },
													{ name: "Priya Patel", role: "Financial Analyst" },
												].map((member, index) => (
													<div
														key={index}
														className={`${theme.sectionBg} p-4 rounded-lg`}
													>
														<div className="w-16 h-16 bg-blue-500 rounded-full mb-3 flex items-center justify-center text-white">
															{member.name.charAt(0)}
														</div>
														<h4 className="font-medium">{member.name}</h4>
														<p className={`text-sm ${theme.muted}`}>
															{member.role}
														</p>
													</div>
												))}
											</div>
										</div>

										<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
											<h3 className="text-xl font-semibold mb-2">Contact Us</h3>
											<div className="space-y-2">
												<p className={`${theme.muted}`}>
													Email:{" "}
													<a
														href="mailto:support@financepro.app"
														className="text-blue-500 hover:underline"
													>
														support@financepro.app
													</a>
												</p>
												<p className={`${theme.muted}`}>
													Office: 123 Financial Street, New York, NY 10001
												</p>
											</div>
										</div>
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 rounded-xl shadow-lg`}
								>
									<div className="flex flex-col md:flex-row justify-between items-center">
										<div className="mb-2 md:mb-0">
											<p className={`text-sm ${theme.muted}`}>Version 1.0.0</p>
											<p className={`text-xs ${theme.muted}`}>
												Last updated: April 2025
											</p>
										</div>
										<div className="flex space-x-4">
											<a
												href="#"
												className={`text-sm ${theme.muted} hover:text-blue-500`}
											>
												Privacy Policy
											</a>
											<a
												href="#"
												className={`text-sm ${theme.muted} hover:text-blue-500`}
											>
												Terms of Service
											</a>
										</div>
									</div>
								</div>
							</div>
						)}
						{}
						{showCustomDateRange && (
							<div
								className={`${theme.cardBg} ${theme.cardBorder} p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-end`}
							>
								<div className="flex-1">
									<label
										htmlFor="startDate"
										className={`block text-sm ${theme.muted} mb-1`}
									>
										Start Date
									</label>
									<input
										type="date"
										id="startDate"
										value={customDateRange.start}
										onChange={(e) =>
											setCustomDateRange({
												...customDateRange,
												start: e.target.value,
											})
										}
										className={`p-2 w-full rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500`}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="endDate"
										className={`block text-sm ${theme.muted} mb-1`}
									>
										End Date
									</label>
									<input
										type="date"
										id="endDate"
										value={customDateRange.end}
										onChange={(e) =>
											setCustomDateRange({
												...customDateRange,
												end: e.target.value,
											})
										}
										className={`p-2 w-full rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500`}
									/>
								</div>
								<button
									onClick={() => setShowCustomDateRange(false)}
									className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
								>
									Close
								</button>
							</div>
						)}

						{}
						{activeSection === "dashboard" && (
							<div className="space-y-6">
								{isLoading ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
										{[...Array(4)].map((_, i) => (
											<div
												key={i}
												className={`${theme.cardBg} ${theme.cardBorder} p-6 rounded-xl shadow-lg animate-pulse`}
											>
												<div
													className={`h-4 ${
														isDarkMode ? "bg-gray-700" : "bg-gray-300"
													} rounded w-1/2 mb-4`}
												></div>
												<div
													className={`h-8 ${
														isDarkMode ? "bg-gray-700" : "bg-gray-300"
													} rounded`}
												></div>
											</div>
										))}
									</div>
								) : (
									<>
										{}
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`}
											>
												<div className="flex justify-between items-start">
													<div>
														<h3
															className={`text-sm font-medium ${theme.muted}`}
														>
															Net Income
														</h3>
														<p className="text-xl md:text-2xl font-semibold text-green-600 dark:text-green-400">
															{formatCurrency(totalIncome - totalExpenses)}
														</p>
													</div>
													<div
														className={`p-2 rounded-full ${theme.highlight}`}
													>
														<DollarSign size={20} className="text-green-500" />
													</div>
												</div>
												<p className={`mt-2 text-sm ${theme.muted}`}>
													{selectedTimePeriod === "custom"
														? `From ${customDateRange.start} to ${customDateRange.end}`
														: TIME_PERIODS.find(
																(p) => p.value === selectedTimePeriod
														  )?.label}
												</p>
											</div>

											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`}
											>
												<div className="flex justify-between items-start">
													<div>
														<h3
															className={`text-sm font-medium ${theme.muted}`}
														>
															Total Income
														</h3>
														<p className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400">
															{formatCurrency(totalIncome)}
														</p>
													</div>
													<div
														className={`p-2 rounded-full ${theme.highlight}`}
													>
														<TrendingUp size={20} className="text-blue-500" />
													</div>
												</div>
												<p className={`mt-2 text-sm ${theme.muted}`}>
													{
														filteredTransactions.filter((t) => t.amount < 0)
															.length
													}{" "}
													transactions
												</p>
											</div>

											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`}
											>
												<div className="flex justify-between items-start">
													<div>
														<h3
															className={`text-sm font-medium ${theme.muted}`}
														>
															Total Expenses
														</h3>
														<p className="text-xl md:text-2xl font-semibold text-purple-600 dark:text-purple-400">
															{formatCurrency(totalExpenses)}
														</p>
													</div>
													<div
														className={`p-2 rounded-full ${theme.highlight}`}
													>
														<Activity size={20} className="text-purple-500" />
													</div>
												</div>
												<p className={`mt-2 text-sm ${theme.muted}`}>
													{
														filteredTransactions.filter((t) => t.amount > 0)
															.length
													}{" "}
													transactions
												</p>
											</div>

											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`}
											>
												<div className="flex justify-between items-start">
													<div>
														<h3
															className={`text-sm font-medium ${theme.muted}`}
														>
															Savings Rate
														</h3>
														<p className="text-xl md:text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
															{totalIncome > 0
																? `${(
																		((totalIncome - totalExpenses) /
																			totalIncome) *
																		100
																  ).toFixed(1)}%`
																: "0%"}
														</p>
													</div>
													<div
														className={`p-2 rounded-full ${theme.highlight}`}
													>
														<Target size={20} className="text-emerald-500" />
													</div>
												</div>
												<p className={`mt-2 text-sm ${theme.muted}`}>
													{totalIncome > totalExpenses
														? "On track"
														: "Needs attention"}
												</p>
											</div>
										</div>

										{}
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
											{}
											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
											>
												<div className="flex justify-between items-center mb-2 md:mb-4">
													<h2 className="text-base md:text-lg font-semibold">
														Spending by Category
													</h2>
													<button
														onClick={() =>
															exportToCSV(
																categorySpendingData,
																"spending-by-category"
															)
														}
														className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
														title="Export as CSV"
													>
														<Download size={16} />
													</button>
												</div>
												<div className="h-60 md:h-64 w-full">
													{categorySpendingData.length > 0 ? (
														<ResponsiveContainer width="100%" height="100%">
															<PieChart>
																<Pie
																	data={categorySpendingData}
																	dataKey="value"
																	nameKey="name"
																	cx="50%"
																	cy="50%"
																	outerRadius={isMobile ? 70 : 90}
																	animationDuration={800}
																	label={({ name, percent }) =>
																		`${name}: ${(percent * 100).toFixed(1)}%`
																	}
																	labelLine={false}
																>
																	{categorySpendingData.map((_, index) => (
																		<Cell
																			key={`cell-${index}`}
																			fill={
																				isDarkMode
																					? [
																							"#4ADE80",
																							"#60A5FA",
																							"#C084FC",
																							"#F472B6",
																							"#FB923C",
																							"#FBBF24",
																					  ][index % 6]
																					: [
																							"#22C55E",
																							"#3B82F6",
																							"#9333EA",
																							"#DB2777",
																							"#EA580C",
																							"#D97706",
																					  ][index % 6]
																			}
																		/>
																	))}
																</Pie>
																<Tooltip
																	formatter={(value) => [
																		formatCurrency(value),
																		"Amount",
																	]}
																	contentStyle={{
																		backgroundColor: isDarkMode
																			? "#374151"
																			: "#fff",
																		color: isDarkMode ? "#fff" : "#000",
																		border: "none",
																		borderRadius: "8px",
																		boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
																	}}
																/>
															</PieChart>
														</ResponsiveContainer>
													) : (
														<div className="h-full flex flex-col items-center justify-center">
															<p className={`${theme.muted} text-center`}>
																No category spending data available
															</p>
														</div>
													)}
												</div>
											</div>

											{}
											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
											>
												<div className="flex justify-between items-center mb-2 md:mb-4">
													<h2 className="text-base md:text-lg font-semibold">
														Monthly Trends
													</h2>
													<button
														onClick={() =>
															exportToCSV(monthlyTrendsData, "monthly-trends")
														}
														className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
														title="Export as CSV"
													>
														<Download size={16} />
													</button>
												</div>
												<div className="h-60 md:h-64 w-full">
													<ResponsiveContainer width="100%" height="100%">
														<BarChart data={monthlyTrendsData}>
															<CartesianGrid
																strokeDasharray="3 3"
																stroke={isDarkMode ? "#4B5563" : "#E5E7EB"}
															/>
															<XAxis
																dataKey="month"
																stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
															/>
															<YAxis
																stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
															/>
															<Tooltip
																formatter={(value) => [
																	formatCurrency(value),
																	"Amount",
																]}
																contentStyle={{
																	backgroundColor: isDarkMode
																		? "#374151"
																		: "#fff",
																	color: isDarkMode ? "#fff" : "#000",
																	border: "none",
																	borderRadius: "8px",
																	boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
																}}
															/>
															<Legend />
															<Bar
																dataKey="income"
																name="Income"
																fill={isDarkMode ? "#4ADE80" : "#36B37E"}
																radius={[4, 4, 0, 0]}
															/>
															<Bar
																dataKey="expenses"
																name="Expenses"
																fill={isDarkMode ? "#F87171" : "#EF4444"}
																radius={[4, 4, 0, 0]}
															/>
														</BarChart>
													</ResponsiveContainer>
												</div>
											</div>

											{}
											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
											>
												<div className="flex justify-between items-center mb-2 md:mb-4">
													<h2 className="text-base md:text-lg font-semibold">
														Financial Projection
													</h2>
													<button
														onClick={() =>
															exportToCSV(
																projectionData,
																"financial-projection"
															)
														}
														className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
														title="Export as CSV"
													>
														<Download size={16} />
													</button>
												</div>
												<div className="h-60 md:h-64 w-full">
													<ResponsiveContainer width="100%" height="100%">
														<AreaChart data={projectionData}>
															<CartesianGrid
																strokeDasharray="3 3"
																stroke={isDarkMode ? "#4B5563" : "#E5E7EB"}
															/>
															<XAxis
																dataKey="month"
																stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
															/>
															<YAxis
																stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
															/>
															<Tooltip
																formatter={(value) => [
																	formatCurrency(value),
																	"Amount",
																]}
																contentStyle={{
																	backgroundColor: isDarkMode
																		? "#374151"
																		: "#fff",
																	color: isDarkMode ? "#fff" : "#000",
																	border: "none",
																	borderRadius: "8px",
																	boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
																}}
															/>
															<Legend />
															<Area
																type="monotone"
																dataKey="income"
																name="Projected Income"
																stroke={isDarkMode ? "#4ADE80" : "#36B37E"}
																fill={
																	isDarkMode
																		? "rgba(74, 222, 128, 0.2)"
																		: "rgba(54, 179, 126, 0.2)"
																}
																activeDot={{ r: 6 }}
															/>
															<Area
																type="monotone"
																dataKey="expenses"
																name="Projected Expenses"
																stroke={isDarkMode ? "#F87171" : "#EF4444"}
																fill={
																	isDarkMode
																		? "rgba(248, 113, 113, 0.2)"
																		: "rgba(239, 68, 68, 0.2)"
																}
																activeDot={{ r: 6 }}
															/>
															<Area
																type="monotone"
																dataKey="savings"
																name="Projected Savings"
																stroke={isDarkMode ? "#60A5FA" : "#3B82F6"}
																fill={
																	isDarkMode
																		? "rgba(96, 165, 250, 0.2)"
																		: "rgba(59, 130, 246, 0.2)"
																}
																activeDot={{ r: 6 }}
															/>
														</AreaChart>
													</ResponsiveContainer>
												</div>
											</div>

											{}
											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
											>
												<div className="flex justify-between items-center mb-4">
													<h2 className="text-base md:text-lg font-semibold">
														Budget Overview
													</h2>
													<button
														onClick={() => setActiveSection("budgets")}
														className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
													>
														View All
													</button>
												</div>
												<div className="space-y-4">
													{budgets.slice(0, 3).map((budget) => {
														const usage = (budget.spent / budget.limit) * 100;
														return (
															<div
																key={budget.id}
																className={`${
																	theme.sectionBg
																} p-3 rounded-lg shadow-sm ${
																	usage >= 100
																		? "border-l-4 border-red-500"
																		: usage >= 80
																		? "border-l-4 border-yellow-500"
																		: ""
																}`}
															>
																<div className="flex justify-between items-center mb-1">
																	<div className="flex items-center">
																		<div
																			className={`mr-2 p-1.5 rounded-full ${
																				isDarkMode
																					? "bg-gray-700"
																					: "bg-gray-200"
																			}`}
																		>
																			{getCategoryIcon(budget.category)}
																		</div>
																		<span className="font-medium text-sm">
																			{budget.category}
																		</span>
																	</div>
																	<span
																		className={`text-xs font-medium ${
																			usage >= 100
																				? theme.error
																				: usage >= 80
																				? theme.warning
																				: theme.success
																		}`}
																	>
																		{usage.toFixed(1)}%
																	</span>
																</div>
																<div className="flex justify-between text-xs mb-1">
																	<span className={theme.muted}>
																		{formatCurrency(budget.spent)} of{" "}
																		{formatCurrency(budget.limit)}
																	</span>
																	<span className={theme.muted}>
																		{formatCurrency(
																			budget.limit - budget.spent
																		)}{" "}
																		remaining
																	</span>
																</div>
																<div
																	className={`h-1.5 ${
																		isDarkMode ? "bg-gray-600" : "bg-gray-200"
																	} rounded-full overflow-hidden`}
																>
																	<div
																		className={`h-full ${getProgressColor(
																			usage
																		)} transition-all duration-500`}
																		style={{
																			width: `${Math.min(usage, 100)}%`,
																		}}
																	></div>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</div>

										{}
										<div
											className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
										>
											<div className="flex justify-between items-center mb-4">
												<h2 className="text-base md:text-lg font-semibold">
													Recent Activity
												</h2>
												<button
													onClick={() => setActiveSection("transactions")}
													className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
												>
													View All
												</button>
											</div>
											<div className="overflow-x-auto">
												<table className="w-full min-w-full">
													<thead>
														<tr className={`${theme.sectionBorder} border-b`}>
															<th className="text-left py-3 px-4 text-sm font-medium">
																Description
															</th>
															<th className="text-left py-3 px-4 text-sm font-medium">
																Category
															</th>
															<th className="text-left py-3 px-4 text-sm font-medium">
																Date
															</th>
															<th className="text-right py-3 px-4 text-sm font-medium">
																Amount
															</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-gray-700">
														{filteredTransactions
															.slice(0, 5)
															.map((transaction) => (
																<tr
																	key={transaction.id}
																	className={`${theme.highlightHover}`}
																>
																	<td className="py-3 px-4">
																		<div className="flex items-center">
																			<div
																				className={`mr-3 p-1.5 rounded-full ${
																					isDarkMode
																						? "bg-gray-700"
																						: "bg-gray-200"
																				}`}
																			>
																				{getCategoryIcon(transaction.category)}
																			</div>
																			<span className="font-medium text-sm">
																				{transaction.description}
																			</span>
																			{transaction.isRecurring && (
																				<span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
																					Recurring
																				</span>
																			)}
																		</div>
																	</td>
																	<td className="py-3 px-4 text-sm">
																		{transaction.category}
																	</td>
																	<td className="py-3 px-4 text-sm">
																		{new Date(
																			transaction.date
																		).toLocaleDateString()}
																	</td>
																	<td
																		className={`py-3 px-4 text-sm font-medium text-right ${
																			transaction.amount < 0
																				? theme.success
																				: theme.info
																		}`}
																	>
																		{transaction.amount < 0 ? "-" : "+"}
																		{formatCurrency(
																			Math.abs(transaction.amount)
																		)}
																	</td>
																</tr>
															))}
													</tbody>
												</table>
											</div>
										</div>

										{}
										{notifications.length > 0 && (
											<div
												className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
											>
												<div className="flex justify-between items-center mb-4">
													<h2 className="text-base md:text-lg font-semibold">
														Recent Alerts
													</h2>
													<button
														onClick={() => setActiveSection("notifications")}
														className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
													>
														View All
													</button>
												</div>
												<div className="space-y-3">
													{notifications.slice(0, 3).map((notification) => (
														<div
															key={notification.id}
															className={`p-3 rounded-lg ${
																notification.type === "error"
																	? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
																	: notification.type === "warning"
																	? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500"
																	: notification.type === "success"
																	? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
																	: "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
															} ${notification.read ? "opacity-70" : ""}`}
														>
															<div className="flex">
																<div className="mr-3 mt-1">
																	{notification.type === "error" ? (
																		<AlertTriangle
																			size={18}
																			className="text-red-500"
																		/>
																	) : notification.type === "warning" ? (
																		<AlertTriangle
																			size={18}
																			className="text-yellow-500"
																		/>
																	) : notification.type === "success" ? (
																		<Check
																			size={18}
																			className="text-green-500"
																		/>
																	) : (
																		<Bell size={18} className="text-blue-500" />
																	)}
																</div>
																<div className="flex-1">
																	<p
																		className={`text-sm font-medium ${
																			notification.type === "error"
																				? "text-red-700 dark:text-red-400"
																				: notification.type === "warning"
																				? "text-yellow-700 dark:text-yellow-400"
																				: notification.type === "success"
																				? "text-green-700 dark:text-green-400"
																				: "text-blue-700 dark:text-blue-400"
																		}`}
																	>
																		{notification.message}
																	</p>
																	<p className={`text-xs ${theme.muted} mt-1`}>
																		{notification.timestamp}
																	</p>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										)}
									</>
								)}
							</div>
						)}

						{}
						{activeSection === "transactions" && (
							<div className="space-y-6">
								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										{editingType === "transaction"
											? "Edit Transaction"
											: "Add Transaction"}
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Description
											</label>
											<input
												type="text"
												placeholder="Description"
												value={
													editingType === "transaction"
														? editingItem.description
														: newTransaction.description
												}
												onChange={(e) =>
													editingType === "transaction"
														? setEditingItem({
																...editingItem,
																description: e.target.value,
														  })
														: setNewTransaction({
																...newTransaction,
																description: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											/>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Amount
											</label>
											<input
												type="number"
												placeholder="Amount (negative for income)"
												value={
													editingType === "transaction"
														? editingItem.amount
														: newTransaction.amount
												}
												onChange={(e) =>
													editingType === "transaction"
														? setEditingItem({
																...editingItem,
																amount: e.target.value,
														  })
														: setNewTransaction({
																...newTransaction,
																amount: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											/>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Category
											</label>
											<select
												value={
													editingType === "transaction"
														? editingItem.category
														: newTransaction.category
												}
												onChange={(e) =>
													editingType === "transaction"
														? setEditingItem({
																...editingItem,
																category: e.target.value,
														  })
														: setNewTransaction({
																...newTransaction,
																category: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											>
												{CATEGORIES.map((category) => (
													<option key={category.name} value={category.name}>
														{category.name}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Date
											</label>
											<input
												type="date"
												value={
													editingType === "transaction"
														? editingItem.date
														: newTransaction.date
												}
												onChange={(e) =>
													editingType === "transaction"
														? setEditingItem({
																...editingItem,
																date: e.target.value,
														  })
														: setNewTransaction({
																...newTransaction,
																date: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											/>
										</div>

										<div className="md:col-span-2">
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Notes
											</label>
											<input
												type="text"
												placeholder="Optional notes"
												value={
													editingType === "transaction"
														? editingItem.notes || ""
														: newTransaction.notes
												}
												onChange={(e) =>
													editingType === "transaction"
														? setEditingItem({
																...editingItem,
																notes: e.target.value,
														  })
														: setNewTransaction({
																...newTransaction,
																notes: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											/>
										</div>
									</div>

									<div className="flex items-center mt-4">
										<input
											type="checkbox"
											id="isRecurring"
											checked={
												editingType === "transaction"
													? !!editingItem.isRecurring
													: !!newTransaction.isRecurring
											}
											onChange={(e) =>
												editingType === "transaction"
													? setEditingItem({
															...editingItem,
															isRecurring: e.target.checked,
													  })
													: setNewTransaction({
															...newTransaction,
															isRecurring: e.target.checked,
													  })
											}
											className="rounded text-blue-600 focus:ring-blue-500 mr-2"
										/>
										<label htmlFor="isRecurring" className="text-sm">
											Mark as recurring
										</label>
									</div>

									<div className="flex gap-2 mt-4">
										{editingType === "transaction" ? (
											<>
												<button
													onClick={() => {
														updateTransaction({
															...editingItem,
															amount: parseFloat(editingItem.amount),
														});
													}}
													className={`flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-md ${theme.accentHover} transition-all duration-200`}
												>
													Update Transaction
												</button>
												<button
													onClick={() => {
														setEditingItem(null);
														setEditingType(null);
													}}
													className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-md transition-all duration-200"
												>
													Cancel
												</button>
											</>
										) : (
											<button
												onClick={addTransaction}
												className={`flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200`}
											>
												<Plus size={16} />
												Add Transaction
											</button>
										)}
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<div className="flex justify-between items-center mb-4">
										<h2 className="text-base md:text-lg font-semibold">
											Transactions
										</h2>
										<div className="flex gap-2">
											<button
												onClick={exportTransactionsToCSV}
												className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
											>
												<Download size={16} />
												<span>CSV</span>
											</button>
											<button
												onClick={exportTransactionsToPDF}
												className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
											>
												<File size={16} />
												<span>PDF</span>
											</button>
										</div>
									</div>

									{isLoading ? (
										<div className="space-y-4">
											{[...Array(3)].map((_, i) => (
												<div
													key={i}
													className={`h-16 ${
														isDarkMode ? "bg-gray-700" : "bg-gray-300"
													} rounded animate-pulse`}
												></div>
											))}
										</div>
									) : (
										<>
											{filteredTransactions.length === 0 ? (
												<div className="text-center py-8">
													<p className={theme.muted}>No transactions found</p>
													<p className="text-sm mt-2">
														Try adjusting your filters or add a new transaction
													</p>
												</div>
											) : (
												<div
													className="overflow-x-auto"
													id="transactions-table"
												>
													<table className="w-full min-w-full">
														<thead>
															<tr className={`${theme.sectionBorder} border-b`}>
																<th className="text-left py-3 px-4 text-sm font-medium">
																	Description
																</th>
																<th className="text-left py-3 px-4 text-sm font-medium">
																	Category
																</th>
																<th className="text-left py-3 px-4 text-sm font-medium">
																	Date
																</th>
																<th className="text-right py-3 px-4 text-sm font-medium">
																	Amount
																</th>
																<th className="text-right py-3 px-4 text-sm font-medium">
																	Actions
																</th>
															</tr>
														</thead>
														<tbody className="divide-y divide-gray-700">
															{filteredTransactions.map((transaction) => (
																<tr
																	key={transaction.id}
																	className={`${theme.highlightHover} ${
																		isLargeTransaction(transaction.amount)
																			? "bg-yellow-50 dark:bg-yellow-900/10"
																			: ""
																	}`}
																>
																	<td className="py-3 px-4">
																		<div className="flex items-center">
																			<div
																				className={`mr-3 p-1.5 rounded-full ${
																					isDarkMode
																						? "bg-gray-700"
																						: "bg-gray-200"
																				}`}
																			>
																				{getCategoryIcon(transaction.category)}
																			</div>
																			<div>
																				<span className="font-medium text-sm">
																					{transaction.description}
																				</span>
																				{transaction.notes && (
																					<p
																						className={`text-xs ${theme.muted}`}
																					>
																						{transaction.notes}
																					</p>
																				)}
																			</div>
																			{transaction.isRecurring && (
																				<span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
																					Recurring
																				</span>
																			)}
																		</div>
																	</td>
																	<td className="py-3 px-4 text-sm">
																		{transaction.category}
																	</td>
																	<td className="py-3 px-4 text-sm">
																		{new Date(
																			transaction.date
																		).toLocaleDateString()}
																	</td>
																	<td
																		className={`py-3 px-4 text-sm font-medium text-right ${
																			transaction.amount < 0
																				? theme.success
																				: theme.info
																		} flex items-center justify-end`}
																	>
																		{transaction.amount < 0 ? "-" : "+"}
																		{formatCurrency(
																			Math.abs(transaction.amount)
																		)}
																		{isLargeTransaction(transaction.amount) && (
																			<AlertTriangle
																				size={16}
																				className="ml-2 text-yellow-500"
																				title="Large transaction"
																			/>
																		)}
																	</td>
																	<td className="py-3 px-4 text-right">
																		<div className="flex justify-end gap-1">
																			<button
																				onClick={() => {
																					setEditingItem(transaction);
																					setEditingType("transaction");
																				}}
																				className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
																				title="Edit"
																			>
																				<Edit size={16} />
																			</button>
																			<button
																				onClick={() =>
																					deleteTransaction(transaction.id)
																				}
																				className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
																				title="Delete"
																			>
																				<Trash2 size={16} />
																			</button>
																		</div>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						)}

						{}
						{activeSection === "budgets" && (
							<div className="space-y-6">
								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										{editingType === "budget" ? "Edit Budget" : "Add Budget"}
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Category
											</label>
											<select
												value={
													editingType === "budget"
														? editingItem.category
														: newBudget.category
												}
												onChange={(e) =>
													editingType === "budget"
														? setEditingItem({
																...editingItem,
																category: e.target.value,
														  })
														: setNewBudget({
																...newBudget,
																category: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											>
												{CATEGORIES.map((category) => (
													<option key={category.name} value={category.name}>
														{category.name}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Monthly Limit
											</label>
											<input
												type="number"
												placeholder="Limit"
												value={
													editingType === "budget"
														? editingItem.limit
														: newBudget.limit
												}
												onChange={(e) =>
													editingType === "budget"
														? setEditingItem({
																...editingItem,
																limit: e.target.value,
														  })
														: setNewBudget({
																...newBudget,
																limit: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											/>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Start Date
											</label>
											<input
												type="date"
												value={
													editingType === "budget"
														? editingItem.startDate || ""
														: newBudget.startDate
												}
												onChange={(e) =>
													editingType === "budget"
														? setEditingItem({
																...editingItem,
																startDate: e.target.value,
														  })
														: setNewBudget({
																...newBudget,
																startDate: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											/>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												End Date (Optional)
											</label>
											<input
												type="date"
												value={
													editingType === "budget"
														? editingItem.endDate || ""
														: newBudget.endDate
												}
												onChange={(e) =>
													editingType === "budget"
														? setEditingItem({
																...editingItem,
																endDate: e.target.value,
														  })
														: setNewBudget({
																...newBudget,
																endDate: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
											/>
										</div>
									</div>

									<div className="flex gap-2 mt-4">
										{editingType === "budget" ? (
											<>
												<button
													onClick={() => {
														updateBudget({
															...editingItem,
															limit: parseFloat(editingItem.limit),
														});
													}}
													className={`flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-md ${theme.accentHover} transition-all duration-200`}
												>
													Update Budget
												</button>
												<button
													onClick={() => {
														setEditingItem(null);
														setEditingType(null);
													}}
													className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-md transition-all duration-200"
												>
													Cancel
												</button>
											</>
										) : (
											<button
												onClick={addBudget}
												className={`flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-md ${theme.accentHover} transition-all duration-200`}
											>
												<Plus size={16} />
												Add Budget
											</button>
										)}
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<div className="flex justify-between items-center mb-4">
										<h2 className="text-base md:text-lg font-semibold">
											Your Budgets
										</h2>
										<button
											onClick={exportBudgetsToCSV}
											className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
										>
											<Download size={16} />
											<span className="text-sm">Export</span>
										</button>
									</div>

									{isLoading ? (
										<div className="space-y-4">
											{[...Array(2)].map((_, i) => (
												<div
													key={i}
													className={`h-16 ${
														isDarkMode ? "bg-gray-700" : "bg-gray-300"
													} rounded animate-pulse`}
												></div>
											))}
										</div>
									) : (
										<>
											{budgets.length === 0 ? (
												<div className="text-center py-8">
													<p className={theme.muted}>No budgets found</p>
													<p className="text-sm mt-2">
														Create a budget to start tracking your spending
													</p>
												</div>
											) : (
												<div className="space-y-6">
													{budgets.map((budget) => {
														const usage = (budget.spent / budget.limit) * 100;
														return (
															<div
																key={budget.id}
																className={`${
																	theme.sectionBg
																} p-4 rounded-lg shadow-sm ${
																	usage >= 100
																		? "border-l-4 border-red-500"
																		: usage >= 80
																		? "border-l-4 border-yellow-500"
																		: ""
																}`}
															>
																<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
																	<div className="flex items-center mb-2 sm:mb-0">
																		<div
																			className={`mr-3 p-2 rounded-full ${
																				isDarkMode
																					? "bg-gray-700"
																					: "bg-gray-200"
																			}`}
																		>
																			{getCategoryIcon(budget.category)}
																		</div>
																		<div>
																			<h3 className="font-medium">
																				{budget.category}
																			</h3>
																			<p className={`text-xs ${theme.muted}`}>
																				{budget.startDate && budget.endDate
																					? `${new Date(
																							budget.startDate
																					  ).toLocaleDateString()} to ${new Date(
																							budget.endDate
																					  ).toLocaleDateString()}`
																					: budget.startDate
																					? `From ${new Date(
																							budget.startDate
																					  ).toLocaleDateString()}`
																					: "No date range"}
																			</p>
																		</div>
																	</div>
																	<div className="flex sm:flex-col sm:items-end">
																		<div className="flex gap-2">
																			<button
																				onClick={() => {
																					setEditingItem(budget);
																					setEditingType("budget");
																				}}
																				className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
																				title="Edit"
																			>
																				<Edit size={16} />
																			</button>
																			<button
																				onClick={() => deleteBudget(budget.id)}
																				className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
																				title="Delete"
																			>
																				<Trash2 size={16} />
																			</button>
																		</div>
																	</div>
																</div>

																<div className="flex justify-between items-center text-sm mb-1">
																	<span
																		className={`font-medium ${
																			usage >= 100
																				? theme.error
																				: usage >= 80
																				? theme.warning
																				: theme.success
																		}`}
																	>
																		{usage.toFixed(1)}% used
																		{usage >= 100 && (
																			<AlertTriangle
																				size={14}
																				className="inline ml-1"
																			/>
																		)}
																	</span>
																	<span className={theme.muted}>
																		{formatCurrency(budget.spent)} of{" "}
																		{formatCurrency(budget.limit)}
																	</span>
																</div>

																<div
																	className={`h-2 ${
																		isDarkMode ? "bg-gray-600" : "bg-gray-200"
																	} rounded-full overflow-hidden`}
																>
																	<div
																		className={`h-full ${getProgressColor(
																			usage
																		)} transition-all duration-500`}
																		style={{
																			width: `${Math.min(usage, 100)}%`,
																		}}
																	></div>
																</div>

																<div className="flex justify-between mt-3 text-sm">
																	<span className={theme.muted}>
																		Remaining:{" "}
																		{formatCurrency(
																			budget.limit - budget.spent
																		)}
																	</span>
																	<span className={theme.muted}>
																		Daily: {formatCurrency(budget.limit / 30)}
																	</span>
																</div>
															</div>
														);
													})}
												</div>
											)}
										</>
									)}
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										Category Spending Analysis
									</h2>
									<div className="h-64 md:h-80 w-full">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={categorySpendingData}>
												<CartesianGrid
													strokeDasharray="3 3"
													stroke={isDarkMode ? "#4B5563" : "#E5E7EB"}
												/>
												<XAxis
													dataKey="name"
													stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
												/>
												<YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
												<Tooltip
													formatter={(value) => [
														formatCurrency(value),
														"Amount",
													]}
													contentStyle={{
														backgroundColor: isDarkMode ? "#374151" : "#fff",
														color: isDarkMode ? "#fff" : "#000",
														border: "none",
														borderRadius: "8px",
														boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
													}}
												/>
												<Bar
													dataKey="value"
													name="Spending"
													fill={isDarkMode ? "#60A5FA" : "#3B82F6"}
													radius={[4, 4, 0, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>
							</div>
						)}

						{}
						{activeSection === "goals" && (
							<div className="space-y-6">
								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										{editingType === "goal"
											? "Edit Goal"
											: "Add Financial Goal"}
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Goal Name
											</label>
											<input
												type="text"
												placeholder="Goal Name"
												value={
													editingType === "goal"
														? editingItem.name
														: newGoal.name
												}
												onChange={(e) =>
													editingType === "goal"
														? setEditingItem({
																...editingItem,
																name: e.target.value,
														  })
														: setNewGoal({ ...newGoal, name: e.target.value })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 w-full`}
											/>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Target Amount
											</label>
											<input
												type="number"
												placeholder="Target Amount"
												value={
													editingType === "goal"
														? editingItem.target
														: newGoal.target
												}
												onChange={(e) =>
													editingType === "goal"
														? setEditingItem({
																...editingItem,
																target: e.target.value,
														  })
														: setNewGoal({ ...newGoal, target: e.target.value })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 w-full`}
											/>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Deadline (Optional)
											</label>
											<input
												type="date"
												value={
													editingType === "goal"
														? editingItem.deadline || ""
														: newGoal.deadline
												}
												onChange={(e) =>
													editingType === "goal"
														? setEditingItem({
																...editingItem,
																deadline: e.target.value,
														  })
														: setNewGoal({
																...newGoal,
																deadline: e.target.value,
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 w-full`}
											/>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Priority
											</label>
											<select
												value={
													editingType === "goal"
														? editingItem.priority || "medium"
														: newGoal.priority
												}
												onChange={(e) =>
													editingType === "goal"
														? setEditingItem({
																...editingItem,
																priority: e.target.value,
														  })
														: setNewGoal({
																...newGoal,
																priority: e.target.value as
																	| "low"
																	| "medium"
																	| "high",
														  })
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 w-full`}
											>
												<option value="low">Low</option>
												<option value="medium">Medium</option>
												<option value="high">High</option>
											</select>
										</div>
									</div>

									{editingType === "goal" && (
										<div className="mt-4">
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Current Savings
											</label>
											<input
												type="number"
												value={editingItem.saved || 0}
												onChange={(e) =>
													setEditingItem({
														...editingItem,
														saved: parseFloat(e.target.value),
													})
												}
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 w-full sm:w-1/2`}
											/>
										</div>
									)}

									<div className="flex gap-2 mt-4">
										{editingType === "goal" ? (
											<>
												<button
													onClick={() => {
														updateGoal({
															...editingItem,
															target: parseFloat(editingItem.target),
															saved: parseFloat(editingItem.saved || 0),
														});
													}}
													className={`flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-md ${theme.accentHover} transition-all duration-200`}
												>
													Update Goal
												</button>
												<button
													onClick={() => {
														setEditingItem(null);
														setEditingType(null);
													}}
													className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-md transition-all duration-200"
												>
													Cancel
												</button>
											</>
										) : (
											<button
												onClick={addGoal}
												className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500"
											>
												<Plus size={16} />
												Add Goal
											</button>
										)}
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<div className="flex justify-between items-center mb-4">
										<h2 className="text-base md:text-lg font-semibold">
											Your Financial Goals
										</h2>
										<button
											onClick={exportGoalsToCSV}
											className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
										>
											<Download size={16} />
											<span className="text-sm">Export</span>
										</button>
									</div>

									{isLoading ? (
										<div className="space-y-4">
											{[...Array(2)].map((_, i) => (
												<div
													key={i}
													className={`h-16 ${
														isDarkMode ? "bg-gray-700" : "bg-gray-300"
													} rounded animate-pulse`}
												></div>
											))}
										</div>
									) : (
										<>
											{goals.length === 0 ? (
												<div className="text-center py-8">
													<p className={theme.muted}>No goals found</p>
													<p className="text-sm mt-2">
														Create a financial goal to start tracking your
														progress
													</p>
												</div>
											) : (
												<div className="space-y-6">
													{goals.map((goal) => {
														const progress = (goal.saved / goal.target) * 100;
														const daysLeft = goal.deadline
															? Math.ceil(
																	(new Date(goal.deadline).getTime() -
																		new Date().getTime()) /
																		(1000 * 60 * 60 * 24)
															  )
															: null;

														return (
															<div
																key={goal.id}
																className={`${
																	theme.sectionBg
																} p-4 rounded-lg shadow-sm border-l-4 ${
																	goal.priority === "high"
																		? "border-red-500 dark:border-red-600"
																		: goal.priority === "medium"
																		? "border-yellow-500 dark:border-yellow-600"
																		: "border-green-500 dark:border-green-600"
																}`}
															>
																<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
																	<div className="flex items-center mb-2 sm:mb-0">
																		<div
																			className={`mr-3 p-2 rounded-full ${
																				isDarkMode
																					? "bg-gray-700"
																					: "bg-gray-200"
																			}`}
																		>
																			<Target size={16} />
																		</div>
																		<div>
																			<h3 className="font-medium break-all">
																				{goal.name}
																			</h3>
																			{goal.deadline && (
																				<p
																					className={`text-xs ${
																						daysLeft && daysLeft < 0
																							? "text-red-500 dark:text-red-400"
																							: theme.muted
																					}`}
																				>
																					{daysLeft && daysLeft > 0
																						? `${daysLeft} days left`
																						: daysLeft === 0
																						? "Due today"
																						: "Past deadline"}
																					{" • "}
																					{new Date(
																						goal.deadline
																					).toLocaleDateString()}
																				</p>
																			)}
																		</div>
																	</div>
																	<div className="flex sm:flex-col sm:items-end">
																		<div className="flex gap-2">
																			<button
																				onClick={() => {
																					setEditingItem(goal);
																					setEditingType("goal");
																				}}
																				className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
																				title="Edit"
																			>
																				<Edit size={16} />
																			</button>
																			<button
																				onClick={() => deleteGoal(goal.id)}
																				className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
																				title="Delete"
																			>
																				<Trash2 size={16} />
																			</button>
																		</div>
																	</div>
																</div>

																<div className="flex justify-between items-center text-sm mb-1">
																	<span className="font-medium text-purple-500 dark:text-purple-400">
																		{progress.toFixed(1)}% completed
																	</span>
																	<span className={theme.muted}>
																		{formatCurrency(goal.saved)} of{" "}
																		{formatCurrency(goal.target)}
																	</span>
																</div>

																<div
																	className={`h-2 ${
																		isDarkMode ? "bg-gray-600" : "bg-gray-200"
																	} rounded-full overflow-hidden`}
																>
																	<div
																		className="h-full bg-purple-500 transition-all"
																		style={{
																			width: `${Math.min(progress, 100)}%`,
																		}}
																	></div>
																</div>

																<div className="flex justify-between mt-3 text-sm">
																	<span className={theme.muted}>
																		Remaining:{" "}
																		{formatCurrency(goal.target - goal.saved)}
																	</span>
																	{goal.deadline &&
																		daysLeft &&
																		daysLeft > 0 && (
																			<span className={theme.muted}>
																				{formatCurrency(
																					(goal.target - goal.saved) / daysLeft
																				)}
																				/day needed
																			</span>
																		)}
																</div>

																{}
																<div className="mt-4 pt-3 border-t border-gray-700 dark:border-gray-600">
																	<div className="flex items-center gap-2">
																		<button
																			onClick={() =>
																				updateGoalProgress(goal.id, 10)
																			}
																			className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded"
																		>
																			+$10
																		</button>
																		<button
																			onClick={() =>
																				updateGoalProgress(goal.id, 25)
																			}
																			className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded"
																		>
																			+$25
																		</button>
																		<button
																			onClick={() =>
																				updateGoalProgress(goal.id, 50)
																			}
																			className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded"
																		>
																			+$50
																		</button>
																		<button
																			onClick={() =>
																				updateGoalProgress(goal.id, 100)
																			}
																			className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded"
																		>
																			+$100
																		</button>
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											)}
										</>
									)}
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										Goal Progress
									</h2>
									<div className="h-64 w-full">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart
												data={goals.map((g) => ({
													name: g.name,
													saved: g.saved,
													remaining: g.target - g.saved,
												}))}
												layout="vertical"
											>
												<CartesianGrid
													strokeDasharray="3 3"
													stroke={isDarkMode ? "#4B5563" : "#E5E7EB"}
												/>
												<XAxis
													type="number"
													stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
												/>
												<YAxis
													dataKey="name"
													type="category"
													stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
													width={100}
												/>
												<Tooltip
													formatter={(value) => [
														formatCurrency(value),
														"Amount",
													]}
													contentStyle={{
														backgroundColor: isDarkMode ? "#374151" : "#fff",
														color: isDarkMode ? "#fff" : "#000",
														border: "none",
														borderRadius: "8px",
														boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
													}}
												/>
												<Legend />
												<Bar
													dataKey="saved"
													name="Saved"
													stackId="a"
													fill={isDarkMode ? "#8B5CF6" : "#7C3AED"}
												/>
												<Bar
													dataKey="remaining"
													name="Remaining"
													stackId="a"
													fill={isDarkMode ? "#4B5563" : "#D1D5DB"}
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>
							</div>
						)}

						{}
						{activeSection === "bank" && (
							<div className="space-y-6">
								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-lg font-semibold mb-6">
										Connected Accounts
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{accounts.map((account) => (
											<div
												key={account.id}
												className={`${
													account.type === "checking"
														? "bg-blue-600 dark:bg-blue-700"
														: account.type === "savings"
														? "bg-purple-600 dark:bg-purple-700"
														: "bg-emerald-600 dark:bg-emerald-700"
												} text-white p-6 rounded-xl shadow-md`}
											>
												<div className="flex justify-between items-start mb-8">
													<div>
														<p className="text-xs opacity-80">
															{account.type.charAt(0).toUpperCase() +
																account.type.slice(1)}{" "}
															Account
														</p>
														<p className="text-lg font-medium">
															{account.name}
														</p>
													</div>
													<div className="text-2xl">
														{getAccountIcon(account.type)}
													</div>
												</div>
												<div className="flex justify-between items-end">
													<p className="text-sm opacity-80">Balance</p>
													<p className="text-xl font-semibold">
														{isBalanceHidden
															? "••••••"
															: formatCurrency(account.balance)}
														<button
															className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
															onClick={() =>
																setIsBalanceHidden(!isBalanceHidden)
															}
														>
															{isBalanceHidden ? (
																<Eye size={16} />
															) : (
																<EyeOff size={16} />
															)}
														</button>
													</p>
												</div>
											</div>
										))}

										{}
										<div
											className={`border-2 border-dashed ${theme.sectionBorder} p-6 rounded-xl flex flex-col items-center justify-center text-center`}
										>
											<div
												className={`w-12 h-12 ${theme.highlight} rounded-full flex items-center justify-center mb-3`}
											>
												<Plus size={24} className={theme.muted} />
											</div>
											<h3 className="font-medium mb-1">Link a new account</h3>
											<p className={`text-sm ${theme.muted} mb-4`}>
												Connect your other bank accounts
											</p>
											<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
												Connect Account
											</button>
										</div>
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-6 rounded-xl shadow-lg`}
								>
									<div className="flex justify-between items-center mb-4">
										<h2 className="text-lg font-semibold">
											Recent Account Activity
										</h2>
										<button
											onClick={exportTransactionsToCSV}
											className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
										>
											<Download size={16} />
											<span className="text-sm">Export</span>
										</button>
									</div>

									{isLoading ? (
										<ul className="space-y-4">
											{[...Array(3)].map((_, i) => (
												<li
													key={i}
													className={`h-12 ${
														isDarkMode ? "bg-gray-700" : "bg-gray-300"
													} rounded animate-pulse`}
												></li>
											))}
										</ul>
									) : (
										<ul className="space-y-4">
											{transactions.slice(0, 5).map((t) => (
												<li
													key={t.id}
													className={`flex justify-between items-center p-4 ${
														theme.sectionBg
													} rounded-lg transition-all duration-200 shadow-sm ${
														isLargeTransaction(t.amount)
															? "border-l-4 border-yellow-500"
															: ""
													}`}
												>
													<div className="flex items-center overflow-hidden">
														<div
															className={`mr-3 p-2 rounded-full ${
																isDarkMode ? "bg-gray-700" : "bg-gray-200"
															}`}
														>
															{getCategoryIcon(t.category)}
														</div>
														<div>
															<p className="font-medium truncate">
																{t.description}
															</p>
															<p className={`text-xs ${theme.muted}`}>
																{new Date(t.date).toLocaleDateString()} •{" "}
																{t.category}
															</p>
														</div>
													</div>
													<span
														className={`text-sm md:text-base ${
															t.amount < 0 ? theme.success : theme.info
														} ml-4 flex items-center`}
													>
														{t.amount < 0 ? "-" : "+"}{" "}
														{formatCurrency(Math.abs(t.amount))}
														{isLargeTransaction(t.amount) && (
															<AlertTriangle
																size={16}
																className="ml-2 text-yellow-500"
															/>
														)}
													</span>
												</li>
											))}
										</ul>
									)}

									<div className="mt-4 text-center">
										<button
											onClick={() => setActiveSection("transactions")}
											className="text-blue-600 dark:text-blue-400 hover:underline"
										>
											View All Transactions
										</button>
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-lg font-semibold mb-4">
										Account Management
									</h2>
									<div className="space-y-4">
										<div
											className={`${theme.sectionBg} p-4 rounded-lg flex items-center justify-between`}
										>
											<div className="flex items-center">
												<div
													className={`mr-3 p-2 rounded-full ${theme.highlight}`}
												>
													<BriefcaseMedical
														size={20}
														className="text-blue-500"
													/>
												</div>
												<div>
													<h3 className="font-medium">
														Link External Accounts
													</h3>
													<p className={`text-sm ${theme.muted}`}>
														Connect to other financial institutions
													</p>
												</div>
											</div>
											<button className="text-blue-600 dark:text-blue-400">
												<ChevronRight size={20} />
											</button>
										</div>

										<div
											className={`${theme.sectionBg} p-4 rounded-lg flex items-center justify-between`}
										>
											<div className="flex items-center">
												<div
													className={`mr-3 p-2 rounded-full ${theme.highlight}`}
												>
													<Clipboard size={20} className="text-green-500" />
												</div>
												<div>
													<h3 className="font-medium">Schedule Transfers</h3>
													<p className={`text-sm ${theme.muted}`}>
														Set up automatic transfers between accounts
													</p>
												</div>
											</div>
											<button className="text-blue-600 dark:text-blue-400">
												<ChevronRight size={20} />
											</button>
										</div>

										<div
											className={`${theme.sectionBg} p-4 rounded-lg flex items-center justify-between`}
										>
											<div className="flex items-center">
												<div
													className={`mr-3 p-2 rounded-full ${theme.highlight}`}
												>
													<Clock size={20} className="text-purple-500" />
												</div>
												<div>
													<h3 className="font-medium">Scheduled Payments</h3>
													<p className={`text-sm ${theme.muted}`}>
														Manage your recurring bills and payments
													</p>
												</div>
											</div>
											<button className="text-blue-600 dark:text-blue-400">
												<ChevronRight size={20} />
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

						{}
						{activeSection === "reports" && (
							<div className="space-y-6">
								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-6">
										Generate Financial Reports
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<div
											className={`${theme.sectionBg} p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
										>
											<div className="flex items-center mb-3">
												<div
													className={`p-2 rounded-full ${theme.highlight} mr-3`}
												>
													<FileText size={18} className="text-blue-500" />
												</div>
												<h3 className="font-medium">Monthly Summary</h3>
											</div>
											<p className={`text-sm ${theme.muted} mb-4`}>
												Overview of your monthly income, expenses, and savings
											</p>
											<button
												onClick={exportFinancialReport}
												className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
											>
												<Download size={16} />
												Generate Report
											</button>
										</div>

										<div
											className={`${theme.sectionBg} p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
										>
											<div className="flex items-center mb-3">
												<div
													className={`p-2 rounded-full ${theme.highlight} mr-3`}
												>
													<PieChartIcon size={18} className="text-purple-500" />
												</div>
												<h3 className="font-medium">Spending Analysis</h3>
											</div>
											<p className={`text-sm ${theme.muted} mb-4`}>
												Detailed breakdown of your spending by category
											</p>
											<button
												onClick={() =>
													exportToCSV(
														categorySpendingData,
														"category-spending-report"
													)
												}
												className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
											>
												<Download size={16} />
												Generate Report
											</button>
										</div>

										<div
											className={`${theme.sectionBg} p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
										>
											<div className="flex items-center mb-3">
												<div
													className={`p-2 rounded-full ${theme.highlight} mr-3`}
												>
													<TrendingUp size={18} className="text-green-500" />
												</div>
												<h3 className="font-medium">Budget Performance</h3>
											</div>
											<p className={`text-sm ${theme.muted} mb-4`}>
												Analysis of your budget adherence and recommendations
											</p>
											<button
												onClick={() => exportBudgetsToCSV()}
												className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
											>
												<Download size={16} />
												Generate Report
											</button>
										</div>
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										Custom Report Builder
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Report Type
											</label>
											<select
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
												defaultValue="transactions"
											>
												<option value="transactions">
													Transactions Report
												</option>
												<option value="budgets">Budget Report</option>
												<option value="goals">Goals Report</option>
												<option value="comprehensive">
													Comprehensive Financial Report
												</option>
											</select>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Time Period
											</label>
											<select
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
												defaultValue="30days"
											>
												{TIME_PERIODS.map((period) => (
													<option key={period.value} value={period.value}>
														{period.label}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Categories
											</label>
											<select
												className={`p-3 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
												defaultValue="all"
												multiple
												size={4}
											>
												<option value="all">All Categories</option>
												{CATEGORIES.map((cat) => (
													<option key={cat.name} value={cat.name}>
														{cat.name}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className={`block text-sm ${theme.muted} mb-1`}>
												Report Format
											</label>
											<div className="grid grid-cols-2 gap-2 mt-2">
												<button
													className={`p-3 rounded-lg border ${theme.inputBorder} ${theme.inputBg} hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2`}
												>
													<File size={16} />
													PDF
												</button>
												<button
													className={`p-3 rounded-lg border ${theme.inputBorder} ${theme.inputBg} hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center gap-2`}
												>
													<Download size={16} />
													CSV
												</button>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2 mt-6">
										<input
											type="checkbox"
											id="includeCharts"
											className="rounded text-blue-600 focus:ring-blue-500"
											defaultChecked
										/>
										<label htmlFor="includeCharts" className="text-sm">
											Include charts and visualizations
										</label>

										<input
											type="checkbox"
											id="includeRecommendations"
											className="ml-4 rounded text-blue-600 focus:ring-blue-500"
											defaultChecked
										/>
										<label htmlFor="includeRecommendations" className="text-sm">
											Include financial recommendations
										</label>
									</div>

									<button className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 flex items-center gap-2">
										<FileText size={16} />
										Generate Custom Report
									</button>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										Scheduled Reports
									</h2>
									<p className={`${theme.muted} mb-4`}>
										Set up automatic reports to be delivered to your email on a
										schedule.
									</p>

									<div className={`${theme.sectionBg} p-4 rounded-lg mb-4`}>
										<div className="flex justify-between items-center">
											<div>
												<h3 className="font-medium">
													Monthly Financial Summary
												</h3>
												<p className={`text-sm ${theme.muted}`}>
													Delivered on the 1st of each month
												</p>
											</div>
											<div className="flex items-center">
												<span className="text-green-500 text-sm mr-2">
													Active
												</span>
												<button className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
													<Trash2 size={16} />
												</button>
											</div>
										</div>
									</div>

									<button className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 flex items-center gap-2">
										<Plus size={16} />
										Schedule New Report
									</button>
								</div>
							</div>
						)}

						{}
						{activeSection === "notifications" && (
							<div
								className={`${theme.cardBg} ${theme.cardBorder} p-6 rounded-xl shadow-lg`}
							>
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-lg font-semibold">Notifications</h2>
									{notifications.length > 0 && (
										<button
											onClick={markAllNotificationsAsRead}
											className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
										>
											Mark all as read
										</button>
									)}
								</div>

								{notifications.length === 0 ? (
									<div className="text-center py-8">
										<Bell size={32} className={`mx-auto mb-2 ${theme.muted}`} />
										<p className={theme.muted}>No notifications yet!</p>
										<p className="text-sm mt-2">
											We'll notify you about important financial events.
										</p>
									</div>
								) : (
									<ul className="space-y-4">
										{notifications.map((notification) => (
											<li
												key={notification.id}
												className={`p-4 rounded-lg shadow-sm ${
													notification.type === "error"
														? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
														: notification.type === "warning"
														? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500"
														: notification.type === "success"
														? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
														: "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
												} ${notification.read ? "opacity-70" : ""}`}
											>
												<div className="flex justify-between">
													<div className="flex overflow-hidden">
														<div className="mr-3 mt-1">
															{notification.type === "error" ? (
																<AlertTriangle
																	size={18}
																	className="text-red-500"
																/>
															) : notification.type === "warning" ? (
																<AlertTriangle
																	size={18}
																	className="text-yellow-500"
																/>
															) : notification.type === "success" ? (
																<Check size={18} className="text-green-500" />
															) : (
																<Bell size={18} className="text-blue-500" />
															)}
														</div>
														<div>
															<p
																className={`text-sm font-medium break-words ${
																	notification.type === "error"
																		? "text-red-700 dark:text-red-400"
																		: notification.type === "warning"
																		? "text-yellow-700 dark:text-yellow-400"
																		: notification.type === "success"
																		? "text-green-700 dark:text-green-400"
																		: "text-blue-700 dark:text-blue-400"
																}`}
															>
																{notification.message}
															</p>
															<div className="flex items-center mt-1">
																<p className={`text-xs ${theme.muted}`}>
																	{notification.timestamp}
																</p>
																{notification.source && (
																	<span
																		className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
																			notification.source === "transaction"
																				? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
																				: notification.source === "budget"
																				? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
																				: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
																		}`}
																	>
																		{notification.source}
																	</span>
																)}
															</div>
														</div>
													</div>
													<div className="flex ml-3">
														{!notification.read && (
															<button
																onClick={() =>
																	markNotificationAsRead(notification.id)
																}
																className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
																title="Mark as read"
															>
																<Check size={16} />
															</button>
														)}
														<button
															onClick={() =>
																removeNotification(notification.id)
															}
															className={`${theme.muted} hover:text-gray-700 dark:hover:text-gray-300 transition-colors`}
															title="Remove notification"
														>
															<X size={18} />
														</button>
													</div>
												</div>
											</li>
										))}
									</ul>
								)}

								{}
								<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
									<h3 className="text-base font-medium mb-4">
										Notification Preferences
									</h3>
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">Budget Alerts</p>
												<p className={`text-xs ${theme.muted}`}>
													Notify when budgets are close to limits
												</p>
											</div>
											<div className="relative inline-block w-10 h-6">
												<input
													type="checkbox"
													className="opacity-0 w-0 h-0"
													id="budget-toggle"
													defaultChecked
												/>
												<label
													htmlFor="budget-toggle"
													className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 before:shadow-md before:checked:transform before:checked:translate-x-4 before:checked:bg-blue-500 dark:before:checked:bg-blue-400"
												></label>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">Large Transaction Alerts</p>
												<p className={`text-xs ${theme.muted}`}>
													Notify for unusually large transactions
												</p>
											</div>
											<div className="relative inline-block w-10 h-6">
												<input
													type="checkbox"
													className="opacity-0 w-0 h-0"
													id="transaction-toggle"
													defaultChecked
												/>
												<label
													htmlFor="transaction-toggle"
													className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 before:checked:transform before:checked:translate-x-4 before:checked:bg-blue-600"
												></label>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">Goal Progress Updates</p>
												<p className={`text-xs ${theme.muted}`}>
													Notify about savings goal milestones
												</p>
											</div>
											<div className="relative inline-block w-10 h-6">
												<input
													type="checkbox"
													className="opacity-0 w-0 h-0"
													id="goal-toggle"
													defaultChecked
												/>
												<label
													htmlFor="goal-toggle"
													className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 before:checked:transform before:checked:translate-x-4 before:checked:bg-blue-600"
												></label>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">Email Notifications</p>
												<p className={`text-xs ${theme.muted}`}>
													Send important alerts to email
												</p>
											</div>
											<div className="relative inline-block w-10 h-6">
												<input
													type="checkbox"
													className="opacity-0 w-0 h-0"
													id="email-toggle"
													defaultChecked
												/>
												<label
													htmlFor="email-toggle"
													className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 before:checked:transform before:checked:translate-x-4 before:checked:bg-blue-600"
												></label>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{}
						{activeSection === "settings" && (
							<div className="space-y-6">
								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										User Preferences
									</h2>
									<div className="space-y-4">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">Display Theme</h3>
												<p className={`text-sm ${theme.muted}`}>
													Choose between light and dark mode
												</p>
											</div>
											<div className="flex items-center gap-3">
												<button
													onClick={() => setIsDarkMode(false)}
													className={`p-3 rounded-lg ${
														!isDarkMode
															? "bg-blue-100 text-blue-600 ring-2 ring-blue-500"
															: "bg-gray-100 dark:bg-gray-700"
													}`}
												>
													<Sun size={20} />
												</button>
												<button
													onClick={() => setIsDarkMode(true)}
													className={`p-3 rounded-lg ${
														isDarkMode
															? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500 dark:ring-blue-400"
															: "bg-gray-100 dark:bg-gray-700"
													}`}
												>
													<Moon size={20} />
												</button>
											</div>
										</div>

										<div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">Currency</h3>
												<p className={`text-sm ${theme.muted}`}>
													Select your preferred currency
												</p>
											</div>
											<select
												value={selectedCurrency}
												onChange={(e) => setSelectedCurrency(e.target.value)}
												className={`p-2.5 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full md:w-auto`}
											>
												{CURRENCIES.map((currency) => (
													<option key={currency} value={currency}>
														{currency}
													</option>
												))}
											</select>
										</div>

										<div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">Balance Visibility</h3>
												<p className={`text-sm ${theme.muted}`}>
													Hide or show account balances
												</p>
											</div>
											<div className="relative inline-block w-10 h-6">
												<input
													type="checkbox"
													className="opacity-0 w-0 h-0"
													id="balance-toggle"
													checked={!isBalanceHidden}
													onChange={() => setIsBalanceHidden(!isBalanceHidden)}
												/>
												<label
													htmlFor="balance-toggle"
													className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 before:checked:transform before:checked:translate-x-4 before:checked:bg-blue-600"
												></label>
											</div>
										</div>

										<div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">Default Time Period</h3>
												<p className={`text-sm ${theme.muted}`}>
													Default time range for reports and dashboards
												</p>
											</div>
											<select
												value={selectedTimePeriod}
												onChange={(e) => setSelectedTimePeriod(e.target.value)}
												className={`p-2.5 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full md:w-auto`}
											>
												{TIME_PERIODS.map((period) => (
													<option key={period.value} value={period.value}>
														{period.label}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										Security Settings
									</h2>
									<div className="space-y-4">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">Password</h3>
												<p className={`text-sm ${theme.muted}`}>
													Change your account password
												</p>
											</div>
											<button
												onClick={() => setShowPasswordField(!showPasswordField)}
												className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
											>
												Change Password
											</button>
										</div>

										{showPasswordField && (
											<div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
												<div>
													<label
														className={`block text-sm ${theme.muted} mb-1`}
													>
														Current Password
													</label>
													<input
														type="password"
														className={`p-2.5 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
														placeholder="Enter current password"
													/>
												</div>
												<div>
													<label
														className={`block text-sm ${theme.muted} mb-1`}
													>
														New Password
													</label>
													<input
														type="password"
														className={`p-2.5 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
														placeholder="Enter new password"
													/>
												</div>
												<div>
													<label
														className={`block text-sm ${theme.muted} mb-1`}
													>
														Confirm New Password
													</label>
													<input
														type="password"
														className={`p-2.5 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full`}
														placeholder="Confirm new password"
													/>
												</div>
												<div className="flex justify-end gap-2">
													<button
														className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
														onClick={() => setShowPasswordField(false)}
													>
														Cancel
													</button>
													<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
														Update Password
													</button>
												</div>
											</div>
										)}

										<div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">
													Two-Factor Authentication
												</h3>
												<p className={`text-sm ${theme.muted}`}>
													Add an extra layer of security
												</p>
											</div>
											<div className="relative inline-block w-10 h-6">
												<input
													type="checkbox"
													className="opacity-0 w-0 h-0"
													id="tfa-toggle"
												/>
												<label
													htmlFor="tfa-toggle"
													className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 before:checked:transform before:checked:translate-x-4 before:checked:bg-blue-600"
												></label>
											</div>
										</div>

										<div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">Login Activity</h3>
												<p className={`text-sm ${theme.muted}`}>
													Review your recent login history
												</p>
											</div>
											<button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
												View Activity
											</button>
										</div>
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										Data Management
									</h2>
									<div className="space-y-4">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">Export All Data</h3>
												<p className={`text-sm ${theme.muted}`}>
													Download a complete copy of your financial data
												</p>
											</div>
											<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
												<Download size={16} />
												Export Data
											</button>
										</div>

										<div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium">Data Retention</h3>
												<p className={`text-sm ${theme.muted}`}>
													Choose how long to keep transaction history
												</p>
											</div>
											<select
												className={`p-2.5 rounded-lg ${theme.inputBorder} ${theme.inputBg} focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 w-full md:w-auto`}
												defaultValue="indefinitely"
											>
												<option value="6months">6 Months</option>
												<option value="1year">1 Year</option>
												<option value="3years">3 Years</option>
												<option value="5years">5 Years</option>
												<option value="indefinitely">Indefinitely</option>
											</select>
										</div>

										<div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="mb-2 md:mb-0">
												<h3 className="font-medium text-red-600 dark:text-red-400">
													Delete Account
												</h3>
												<p className={`text-sm ${theme.muted}`}>
													Permanently delete your account and all data
												</p>
											</div>
											<button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
												Delete Account
											</button>
										</div>
									</div>
								</div>

								{}
								<div
									className={`${theme.cardBg} ${theme.cardBorder} p-4 md:p-6 rounded-xl shadow-lg`}
								>
									<h2 className="text-base md:text-lg font-semibold mb-4">
										About FinancePro
									</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-medium">Version</h3>
											<p className={theme.muted}>v1.0.0</p>
										</div>
										<div>
											<h3 className="font-medium">Privacy Policy</h3>
											<p className={`text-sm ${theme.muted} mb-2`}>
												Last updated: April 2025
											</p>
											<a
												href="#"
												className="text-blue-600 dark:text-blue-400 hover:underline"
											>
												View Privacy Policy
											</a>
										</div>
										<div>
											<h3 className="font-medium">Terms of Service</h3>
											<p className={`text-sm ${theme.muted} mb-2`}>
												Last updated: April 2025
											</p>
											<a
												href="#"
												className="text-blue-600 dark:text-blue-400 hover:underline"
											>
												View Terms of Service
											</a>
										</div>
										<div>
											<h3 className="font-medium">Support</h3>
											<p className={`text-sm ${theme.muted} mb-2`}>
												Need help with your account?
											</p>
											<a
												href="#"
												className="text-blue-600 dark:text-blue-400 hover:underline"
											>
												Contact Support
											</a>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
					{}
					<footer className={`${theme.cardBg} py-8 px-6 mt-12`}>
						<div className="max-w-7xl mx-auto">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
								{}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
										FinancePro
									</h3>
									<p className={`${theme.muted} text-sm leading-relaxed`}>
										Empowering financial freedom through innovative tools and
										insights.
									</p>
									<div className="flex space-x-4">
										<a
											href="#"
											className={`${theme.muted} hover:text-blue-600 dark:hover:text-blue-400`}
										>
											<Globe size={20} />
										</a>
										<a
											href="#"
											className={`${theme.muted} hover:text-blue-600 dark:hover:text-blue-400`}
										>
											<Twitter size={20} />
										</a>
										<a
											href="#"
											className={`${theme.muted} hover:text-blue-600 dark:hover:text-blue-400`}
										>
											<Linkedin size={20} />
										</a>
									</div>
								</div>

								{}
								<div className="space-y-4">
									<h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
										Resources
									</h4>
									<ul className="space-y-2">
										{["Documentation", "Guides", "Blog", "Security"].map(
											(item) => (
												<li key={item}>
													<a
														href="#"
														className={`${theme.muted} text-sm hover:text-blue-600 dark:hover:text-blue-400`}
													>
														{item}
													</a>
												</li>
											)
										)}
									</ul>
								</div>

								{}
								<div className="space-y-4">
									<h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
										Legal
									</h4>
									<ul className="space-y-2">
										{[
											"Privacy Policy",
											"Terms of Service",
											"Cookie Policy",
											"Licenses",
										].map((item) => (
											<li key={item}>
												<a
													href="#"
													className={`${theme.muted} text-sm hover:text-blue-600 dark:hover:text-blue-400`}
												>
													{item}
												</a>
											</li>
										))}
									</ul>
								</div>

								{}
								<div className="space-y-4">
									<h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
										Stay Updated
									</h4>
									<div className="flex flex-col space-y-3">
										<input
											type="email"
											placeholder="Enter your email"
											className={`p-2 rounded-lg text-sm ${theme.inputBg} ${theme.inputBorder} focus:ring-2 focus:ring-blue-500`}
										/>
										<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
											Subscribe
										</button>
									</div>
								</div>
							</div>

							{}
							<div className={`border-t ${theme.sectionBorder} pt-6 mt-8`}>
								<div className="flex flex-col md:flex-row justify-between items-center">
									<p className={`${theme.muted} text-sm mb-2 md:mb-0`}>
										© 2025 FinancePro. All rights reserved.
									</p>
									<div className="flex space-x-4">
										<span className={`${theme.muted} text-sm`}>v1.0.0</span>
										<span className={`${theme.muted} text-sm`}>•</span>
										<a
											href="#"
											className={`${theme.muted} text-sm hover:text-blue-600 dark:hover:text-blue-400`}
										>
											Status
										</a>
									</div>
								</div>
							</div>
						</div>
					</footer>
				</main>

				{}
				{isSidebarOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
						onClick={() => setIsSidebarOpen(false)}
					></div>
				)}

				{}
				<style jsx>{`
					::-webkit-scrollbar {
						width: 8px;
						height: 8px;
					}
					::-webkit-scrollbar-track {
						background: ${isDarkMode ? "#1F2937" : "#F3F4F6"};
					}
					::-webkit-scrollbar-thumb {
						background: ${isDarkMode ? "#4B5563" : "#9CA3AF"};
						border-radius: 4px;
					}
					::-webkit-scrollbar-thumb:hover {
						background: ${isDarkMode ? "#6B7280" : "#6B7280"};
					}
					.break-words {
						word-wrap: break-word;
						word-break: break-word;
					}
					.transition-all {
						transition-property: all;
						transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
					}
					input[type="checkbox"]:checked + label {
						background-color: #3b82f6;
					}
					input[type="checkbox"]:checked + label:before {
						transform: translateX(16px);
					}
					.sidebar-content {
						transition-delay: 0.05s;
					}
				`}</style>
			</div>
		</div>
	);
};

const Check = (props) => {
	const size = props.size || 24;
	const className = props.className || "";

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	);
};

export default FinancialDashboard;
