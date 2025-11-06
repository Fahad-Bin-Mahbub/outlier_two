"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	Search,
	Moon,
	Sun,
	Plus,
	Edit,
	Trash2,
	Copy,
	Save,
	Code,
	Folder,
	Tag,
	Settings,
	ChevronDown,
	ChevronRight,
	ChevronLeft,
	Clock,
	Star,
	Github,
	Check,
	Twitter,
	Linkedin,
	Bookmark,
	Download,
	Upload,
	FileText,
	Info,
	AlertCircle,
	ArrowLeftCircle,
	Grid,
	Layout,
	List,
	Filter,
	BookOpen,
	Share2,
	Gift,
	ExternalLink,
} from "lucide-react";

type Snippet = {
	id: string;
	title: string;
	code: string;
	language: string;
	description: string;
	tags: string[];
	category: string;
	created: Date;
	lastAccessed?: Date;
	isFavorite: boolean;
	useCount: number;
};

type Category = {
	id: string;
	name: string;
	snippetCount: number;
	icon?: string;
};

type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "a-z" | "z-a" | "most-used";

const SnippetProApp = () => {
	const [darkMode, setDarkMode] = useState(false);
	const [snippets, setSnippets] = useState<Snippet[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
	const [filterType, setFilterType] = useState<
		"all" | "favorites" | "recents" | "search"
	>("all");
	const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [sortOption, setSortOption] = useState<SortOption>("newest");
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(true);
	const [mostUsedTags, setMostUsedTags] = useState<string[]>([]);
	const [notification, setNotification] = useState<{
		show: boolean;
		message: string;
		type: "success" | "error" | "info" | "";
		id?: string;
	}>({
		show: false,
		message: "",
		type: "",
	});
	const [copySuccess, setCopySuccess] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [showMobileNav, setShowMobileNav] = useState(false);
	const [showSortOptions, setShowSortOptions] = useState(false);
	const [favoriteSnippets, setFavoriteSnippets] = useState<Snippet[]>([]);
	const [recentSnippets, setRecentSnippets] = useState<Snippet[]>([]);
	const [userPreferences, setUserPreferences] = useState({
		fontSize: 14,
		tabSize: 2,
		autoSave: false,
		showLineNumbers: true,
		defaultView: "grid" as ViewMode,
		highlightCurrentLine: true,
		autoCloseBrackets: true,
		snippetsPerPage: 9,
		theme: "default",
	});
	const [newCategory, setNewCategory] = useState("");
	const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [breadcrumbs, setBreadcrumbs] = useState<
		{ id: string; name: string }[]
	>([]);
	const [showExportModal, setShowExportModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);
	const [isProUser, setIsProUser] = useState(false);
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [onboardingStep, setOnboardingStep] = useState(1);

	const snippetsPerPage = userPreferences.snippetsPerPage;
	const totalPages = Math.ceil(filteredSnippets.length / snippetsPerPage);
	const currentSnippetsPage = filteredSnippets.slice(
		(currentPage - 1) * snippetsPerPage,
		currentPage * snippetsPerPage
	);

	useEffect(() => {
		const initialCategories: Category[] = [
			{ id: "cat1", name: "JavaScript", snippetCount: 4, icon: "javascript" },
			{ id: "cat2", name: "React", snippetCount: 3, icon: "react" },
			{ id: "cat3", name: "CSS", snippetCount: 2, icon: "css" },
			{ id: "cat4", name: "TypeScript", snippetCount: 3, icon: "typescript" },
			{ id: "cat5", name: "HTML", snippetCount: 1, icon: "html" },
			{ id: "cat6", name: "Node.js", snippetCount: 2, icon: "nodejs" },
		];

		const initialSnippets: Snippet[] = [
			{
				id: "snip1",
				title: "React useEffect Hook",
				code: `useEffect(() => {
  // This runs after every render
  const subscription = props.source.subscribe();
  
  // Optional cleanup function
  return () => {
    subscription.unsubscribe();
  };
}, [props.source]);`,
				language: "javascript",
				description:
					"Basic React useEffect hook with dependency array and cleanup",
				tags: ["react", "hooks", "effect"],
				category: "React",
				created: new Date("2025-04-20"),
				lastAccessed: new Date("2025-05-09"),
				isFavorite: true,
				useCount: 12,
			},
			{
				id: "snip2",
				title: "TypeScript Interface vs Type",
				code: `// Interface
interface User {
  id: number;
  name: string;
}

// Type
type User = {
  id: number;
  name: string;
}

// Extending interface
interface Employee extends User {
  department: string;
}

// Extending type
type Employee = User & {
  department: string;
}`,
				language: "typescript",
				description:
					"Comparison between TypeScript interface and type definitions",
				tags: ["typescript", "interface", "type"],
				category: "TypeScript",
				created: new Date("2025-04-22"),
				lastAccessed: new Date("2025-05-07"),
				isFavorite: false,
				useCount: 8,
			},
			{
				id: "snip3",
				title: "CSS Grid Layout",
				code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
}

.grid-item {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}`,
				language: "css",
				description: "Responsive CSS grid layout with auto-fill and minmax",
				tags: ["css", "grid", "responsive"],
				category: "CSS",
				created: new Date("2025-04-25"),
				lastAccessed: new Date("2025-05-08"),
				isFavorite: false,
				useCount: 5,
			},
			{
				id: "snip4",
				title: "Modern JavaScript Array Methods",
				code: `// Filter array
const filtered = numbers.filter(num => num > 10);

// Map array
const doubled = numbers.map(num => num * 2);

// Reduce array
const sum = numbers.reduce((total, num) => total + num, 0);

// Find in array
const found = users.find(user => user.id === 42);

// Some (any) condition
const hasAdmin = users.some(user => user.role === 'admin');

// Every condition
const allActive = users.every(user => user.isActive);`,
				language: "javascript",
				description: "Common array methods in modern JavaScript",
				tags: ["javascript", "array", "methods"],
				category: "JavaScript",
				created: new Date("2025-04-27"),
				lastAccessed: new Date("2025-05-10"),
				isFavorite: true,
				useCount: 18,
			},
			{
				id: "snip5",
				title: "React Context API",
				code: `// Create context
const ThemeContext = React.createContext('light');

// Provider component
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// Consumer component with useContext
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}`,
				language: "javascript",
				description: "Using React Context API for state management",
				tags: ["react", "context", "state"],
				category: "React",
				created: new Date("2025-04-29"),
				lastAccessed: new Date("2025-05-05"),
				isFavorite: false,
				useCount: 7,
			},
			{
				id: "snip6",
				title: "TypeScript Generics",
				code: `// Generic function
function getFirstElement<T>(array: T[]): T | undefined {
  return array[0];
}

// Usage
const numbers = [1, 2, 3];
const firstNumber = getFirstElement<number>(numbers);

// Generic interface
interface Box<T> {
  value: T;
}

// Usage
const stringBox: Box<string> = { value: 'Hello TypeScript' };`,
				language: "typescript",
				description: "Using TypeScript generics for reusable components",
				tags: ["typescript", "generics", "functions"],
				category: "TypeScript",
				created: new Date("2025-05-01"),
				lastAccessed: new Date("2025-05-09"),
				isFavorite: true,
				useCount: 10,
			},
			{
				id: "snip7",
				title: "CSS Animation",
				code: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animated-element {
  animation: fadeIn 1.5s ease-in-out;
}

.hover-effect {
  transition: transform 0.3s ease;
}

.hover-effect:hover {
  transform: scale(1.05);
}`,
				language: "css",
				description: "CSS animations and transitions for UI elements",
				tags: ["css", "animation", "transition"],
				category: "CSS",
				created: new Date("2025-05-03"),
				lastAccessed: new Date("2025-05-06"),
				isFavorite: false,
				useCount: 9,
			},
			{
				id: "snip8",
				title: "JavaScript Async/Await",
				code: `// Basic async/await
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Parallel async operations
async function fetchMultipleUsers(userIds) {
  const promises = userIds.map(id => 
    fetch(\`/api/users/\${id}\`).then(res => res.json())
  );
  
  const users = await Promise.all(promises);
  return users;
}`,
				language: "javascript",
				description: "Using async/await for asynchronous operations",
				tags: ["javascript", "async", "promises"],
				category: "JavaScript",
				created: new Date("2025-05-05"),
				lastAccessed: new Date("2025-05-10"),
				isFavorite: false,
				useCount: 11,
			},
			{
				id: "snip9",
				title: "TypeScript Utility Types",
				code: `// Original interface
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Partial - all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit - exclude specific properties
type PublicUser = Omit<User, 'email' | 'password'>;

// Required - all properties required
type StrictUser = Required<PartialUser>;

// Readonly - all properties readonly
type ImmutableUser = Readonly<User>;`,
				language: "typescript",
				description: "Common TypeScript utility types",
				tags: ["typescript", "utility", "types"],
				category: "TypeScript",
				created: new Date("2025-05-07"),
				lastAccessed: new Date("2025-05-09"),
				isFavorite: false,
				useCount: 6,
			},
			{
				id: "snip10",
				title: "React Custom Hooks",
				code: `// useLocalStorage hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`,
				language: "javascript",
				description: "Creating custom React hooks for reusable logic",
				tags: ["react", "hooks", "custom"],
				category: "React",
				created: new Date("2025-05-09"),
				lastAccessed: new Date("2025-05-10"),
				isFavorite: false,
				useCount: 4,
			},
			{
				id: "snip11",
				title: "HTML Semantic Elements",
				code: `<header>
  <h1>Website Title</h1>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>

<main>
  <section id="hero">
    <h2>Welcome to our site</h2>
  </section>
  
  <article>
    <h2>Article Title</h2>
    <p>Article content goes here...</p>
    <figure>
      <img src="image.jpg" alt="Description">
      <figcaption>Image caption</figcaption>
    </figure>
  </article>
  
  <aside>
    <h3>Related Information</h3>
    <p>Sidebar content...</p>
  </aside>
</main>

<footer>
  <p>&copy; 2025 Company Name</p>
</footer>`,
				language: "html",
				description:
					"Proper usage of HTML5 semantic elements for better accessibility and SEO",
				tags: ["html", "semantic", "accessibility"],
				category: "HTML",
				created: new Date("2025-05-04"),
				lastAccessed: new Date("2025-05-08"),
				isFavorite: false,
				useCount: 7,
			},
			{
				id: "snip12",
				title: "Node.js Express Server",
				code: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  // Get users from database
  res.json([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  // Save user to database
  res.status(201).json({ id: 3, name });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
				language: "javascript",
				description:
					"Basic Express.js server setup with routes and error handling",
				tags: ["nodejs", "express", "server"],
				category: "Node.js",
				created: new Date("2025-05-06"),
				lastAccessed: new Date("2025-05-09"),
				isFavorite: false,
				useCount: 9,
			},
		];

		setCategories(initialCategories);
		setSnippets(initialSnippets);
		setFilteredSnippets(initialSnippets);

		// Extract most used tags
		const allTags = initialSnippets.flatMap((snippet) => snippet.tags);
		const tagCounts = allTags.reduce((acc, tag) => {
			acc[tag] = (acc[tag] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const sortedTags = Object.entries(tagCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([tag]) => tag);

		setMostUsedTags(sortedTags);

		// Initialize favorites
		const favorites = initialSnippets.filter((snippet) => snippet.isFavorite);
		setFavoriteSnippets(favorites);

		// Initialize recents
		const recents = [...initialSnippets]
			.sort(
				(a, b) =>
					new Date(b.lastAccessed || 0).getTime() -
					new Date(a.lastAccessed || 0).getTime()
			)
			.slice(0, 5);
		setRecentSnippets(recents);

		// Check system preference for dark/light mode
		if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			setDarkMode(true);
		}

		// Set initial view mode from preferences
		setViewMode(userPreferences.defaultView);

		// Check for first-time users
		const isFirstVisit = !localStorage.getItem("hasVisitedBefore");
		if (isFirstVisit) {
			setShowOnboarding(true);
			localStorage.setItem("hasVisitedBefore", "true");
		}

		// Reset pagination
		setCurrentPage(1);
	}, []);

	useEffect(() => {
		let filtered = [...snippets];

		// Apply filter based on filter type
		if (filterType === "favorites") {
			filtered = filtered.filter((snippet) => snippet.isFavorite);
		} else if (filterType === "recents") {
			filtered = [...snippets]
				.sort(
					(a, b) =>
						new Date(b.lastAccessed || b.created).getTime() -
						new Date(a.lastAccessed || a.created).getTime()
				)
				.slice(0, 5);
		} else if (searchQuery) {
			// Handle search query
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(snippet) =>
					snippet.title.toLowerCase().includes(query) ||
					snippet.description.toLowerCase().includes(query) ||
					snippet.code.toLowerCase().includes(query) ||
					snippet.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Filter by category
		if (selectedCategory !== "all") {
			filtered = filtered.filter(
				(snippet) => snippet.category === selectedCategory
			);
		}

		// Apply sorting
		switch (sortOption) {
			case "newest":
				filtered = filtered.sort(
					(a, b) =>
						new Date(b.created).getTime() - new Date(a.created).getTime()
				);
				break;
			case "oldest":
				filtered = filtered.sort(
					(a, b) =>
						new Date(a.created).getTime() - new Date(b.created).getTime()
				);
				break;
			case "a-z":
				filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "z-a":
				filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case "most-used":
				filtered = filtered.sort((a, b) => b.useCount - a.useCount);
				break;
		}

		setFilteredSnippets(filtered);
		// Reset to first page when filters change
		setCurrentPage(1);
	}, [snippets, searchQuery, selectedCategory, sortOption, filterType]);
	useEffect(() => {
		document.body.classList.toggle("dark-mode", darkMode);
		document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
	}, [darkMode]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				searchInputRef.current?.focus();
			}

			if (e.key === "Escape") {
				if (isEditing) {
					setIsEditing(false);
				} else if (showDeleteModal) {
					setShowDeleteModal(false);
				} else if (showSettings) {
					setShowSettings(false);
				} else if (showExportModal) {
					setShowExportModal(false);
				} else if (showUpgradeModal) {
					setShowUpgradeModal(false);
				}
			}

			if ((e.ctrlKey || e.metaKey) && e.key === "s" && isEditing) {
				e.preventDefault();
				saveSnippet();
			}

			if ((e.ctrlKey || e.metaKey) && e.key === "n") {
				e.preventDefault();
				createNewSnippet();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isEditing,
		showDeleteModal,
		showSettings,
		showExportModal,
		showUpgradeModal,
	]);

	useEffect(() => {
		const crumbs = [{ id: "home", name: "Home" }];

		if (selectedCategory !== "all") {
			crumbs.push({ id: "category", name: selectedCategory });
		}

		if (currentSnippet) {
			crumbs.push({ id: currentSnippet.id, name: currentSnippet.title });
		}

		setBreadcrumbs(crumbs);
	}, [selectedCategory, currentSnippet]);

	const copyToClipboard = (code: string, snippetId?: string) => {
		navigator.clipboard
			.writeText(code)
			.then(() => {
				setCopySuccess("Copied!");
				setTimeout(() => setCopySuccess(""), 2000);

				showNotification("Snippet copied to clipboard!", "success");

				if (snippetId) {
					incrementSnippetUseCount(snippetId);
				}
			})
			.catch((err) => {
				console.error("Failed to copy:", err);
				showNotification("Failed to copy snippet", "error");
			});
	};

	const incrementSnippetUseCount = (snippetId: string) => {
		const updatedSnippets = snippets.map((snippet) =>
			snippet.id === snippetId
				? {
						...snippet,
						useCount: snippet.useCount + 1,
						lastAccessed: new Date(),
				  }
				: snippet
		);

		setSnippets(updatedSnippets);

		const updatedRecents = [...updatedSnippets]
			.sort(
				(a, b) =>
					new Date(b.lastAccessed || 0).getTime() -
					new Date(a.lastAccessed || 0).getTime()
			)
			.slice(0, 5);
		setRecentSnippets(updatedRecents);
	};

	const showNotification = (
		message: string,
		type: "success" | "error" | "info"
	) => {
		const id = Math.random().toString(36).substring(2, 9);
		setNotification({ show: true, message, type, id });

		setTimeout(() => {
			setNotification((prev) =>
				prev.id === id ? { show: false, message: "", type: "" } : prev
			);
		}, 3000);
	};

	const createNewSnippet = useCallback(() => {
		if (snippets.length >= 12 && !isProUser) {
			setShowUpgradeModal(true);
			return;
		}

		const newSnippet: Snippet = {
			id: `snip${Date.now()}`,
			title: "New Snippet",
			code: "// Add your code here",
			language: "javascript",
			description: "Description of your snippet",
			tags: [],
			category: categories.length > 0 ? categories[0].name : "Uncategorized",
			created: new Date(),
			lastAccessed: new Date(),
			isFavorite: false,
			useCount: 0,
		};

		setSnippets((prev) => [...prev, newSnippet]);
		setCurrentSnippet(newSnippet);
		setIsEditing(true);
		showNotification("New snippet created", "success");
	}, [categories, snippets.length, isProUser]);

	const saveSnippet = () => {
		if (!currentSnippet) return;

		const updatedSnippet = {
			...currentSnippet,
			lastAccessed: new Date(),
		};

		const updatedSnippets = snippets.map((snippet) =>
			snippet.id === updatedSnippet.id ? updatedSnippet : snippet
		);

		setSnippets(updatedSnippets);
		setCurrentSnippet(updatedSnippet);
		setIsEditing(false);

		updateCategorySnippetCounts(updatedSnippets);

		if (updatedSnippet.isFavorite) {
			setFavoriteSnippets((prev) =>
				prev.some((s) => s.id === updatedSnippet.id)
					? prev.map((s) => (s.id === updatedSnippet.id ? updatedSnippet : s))
					: [...prev, updatedSnippet]
			);
		} else {
			setFavoriteSnippets((prev) =>
				prev.filter((s) => s.id !== updatedSnippet.id)
			);
		}

		const updatedRecents = [...updatedSnippets]
			.sort(
				(a, b) =>
					new Date(b.lastAccessed || 0).getTime() -
					new Date(a.lastAccessed || 0).getTime()
			)
			.slice(0, 5);
		setRecentSnippets(updatedRecents);

		showNotification("Snippet saved successfully", "success");
	};

	const updateCategorySnippetCounts = (updatedSnippets: Snippet[]) => {
		const categoryCounts: Record<string, number> = {};

		updatedSnippets.forEach((snippet) => {
			categoryCounts[snippet.category] =
				(categoryCounts[snippet.category] || 0) + 1;
		});

		const updatedCategories = categories.map((category) => ({
			...category,
			snippetCount: categoryCounts[category.name] || 0,
		}));

		setCategories(updatedCategories);
	};

	const deleteSnippet = (id: string) => {
		setSnippetToDelete(id);
		setShowDeleteModal(true);
	};

	const confirmDeleteSnippet = () => {
		if (!snippetToDelete) return;

		const updatedSnippets = snippets.filter(
			(snippet) => snippet.id !== snippetToDelete
		);
		setSnippets(updatedSnippets);

		if (currentSnippet && currentSnippet.id === snippetToDelete) {
			setCurrentSnippet(null);
			setIsEditing(false);
		}

		setFavoriteSnippets((prev) => prev.filter((s) => s.id !== snippetToDelete));
		setRecentSnippets((prev) => prev.filter((s) => s.id !== snippetToDelete));

		updateCategorySnippetCounts(updatedSnippets);

		setShowDeleteModal(false);
		setSnippetToDelete(null);
		showNotification("Snippet deleted", "success");
	};

	const toggleFavorite = (id: string) => {
		const updatedSnippets = snippets.map((snippet) =>
			snippet.id === id
				? { ...snippet, isFavorite: !snippet.isFavorite }
				: snippet
		);

		setSnippets(updatedSnippets);

		if (currentSnippet && currentSnippet.id === id) {
			setCurrentSnippet({
				...currentSnippet,
				isFavorite: !currentSnippet.isFavorite,
			});
		}

		const snippet = updatedSnippets.find((s) => s.id === id);
		if (snippet) {
			if (snippet.isFavorite) {
				setFavoriteSnippets((prev) => [...prev, snippet]);
				showNotification("Added to favorites", "success");
			} else {
				setFavoriteSnippets((prev) => prev.filter((s) => s.id !== id));
				showNotification("Removed from favorites", "info");
			}
		}
	};

	const viewSnippet = (snippet: Snippet) => {
		const updatedSnippet = {
			...snippet,
			lastAccessed: new Date(),
			useCount: snippet.useCount + 1,
		};

		const updatedSnippets = snippets.map((s) =>
			s.id === snippet.id ? updatedSnippet : s
		);
		setSnippets(updatedSnippets);

		setCurrentSnippet(updatedSnippet);

		const updatedRecents = [
			updatedSnippet,
			...recentSnippets.filter((s) => s.id !== snippet.id),
		].slice(0, 5);
		setRecentSnippets(updatedRecents);
	};

	const goBack = () => {
		setCurrentSnippet(null);
		setIsEditing(false);
	};

	const addNewCategory = () => {
		if (!newCategory.trim()) return;

		if (
			categories.some(
				(cat) => cat.name.toLowerCase() === newCategory.toLowerCase()
			)
		) {
			showNotification("Category already exists", "error");
			return;
		}

		const newCategoryObj: Category = {
			id: `cat${Date.now()}`,
			name: newCategory,
			snippetCount: 0,
			icon: "folder",
		};

		setCategories([...categories, newCategoryObj]);
		setNewCategory("");
		setShowNewCategoryInput(false);
		showNotification("New category added", "success");
	};

	const updateSnippetField = (field: keyof Snippet, value: any) => {
		if (!currentSnippet) return;

		setCurrentSnippet({
			...currentSnippet,
			[field]: value,
		});

		if (
			userPreferences.autoSave &&
			field !== "title" &&
			field !== "description"
		) {
			const timer = setTimeout(() => {
				saveSnippet();
			}, 1000);

			return () => clearTimeout(timer);
		}
	};

	const exportSnippets = () => {
		const dataStr = JSON.stringify(snippets, null, 2);
		const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
			dataStr
		)}`;

		const exportFileDefaultName = `snippetpro-export-${
			new Date().toISOString().split("T")[0]
		}.json`;

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();

		setShowExportModal(false);
		showNotification("Snippets exported successfully", "success");
	};

	const importSnippets = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedSnippets = JSON.parse(
					e.target?.result as string
				) as Snippet[];

				if (snippets.length + importedSnippets.length > 12 && !isProUser) {
					showNotification("Upgrade to Pro to import more snippets", "error");
					setShowUpgradeModal(true);
					return;
				}

				const newSnippets = importedSnippets.map((snippet) => ({
					...snippet,
					id: `snip${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				}));

				setSnippets((prev) => [...prev, ...newSnippets]);
				showNotification(`Imported ${newSnippets.length} snippets`, "success");

				updateCategorySnippetCounts([...snippets, ...newSnippets]);

				const newCategories = new Set(newSnippets.map((s) => s.category));
				const existingCategories = new Set(categories.map((c) => c.name));

				const categoriesToAdd = Array.from(newCategories).filter(
					(c) => !existingCategories.has(c)
				);

				if (categoriesToAdd.length > 0) {
					const additionalCategories = categoriesToAdd.map((name) => ({
						id: `cat${Date.now()}-${Math.random()
							.toString(36)
							.substring(2, 5)}`,
						name,
						snippetCount: newSnippets.filter((s) => s.category === name).length,
						icon: "folder",
					}));

					setCategories((prev) => [...prev, ...additionalCategories]);
				}
			} catch (error) {
				console.error("Error importing snippets:", error);
				showNotification(
					"Failed to import snippets. Invalid file format.",
					"error"
				);
			}
		};
		reader.readAsText(file);

		event.target.value = "";
	};

	const goToPage = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
		window.scrollTo(0, 0);
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(new Date(date));
	};

	const formatRelativeTime = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - new Date(date).getTime();

		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) {
			return days === 1 ? "Yesterday" : `${days} days ago`;
		} else if (hours > 0) {
			return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
		} else if (minutes > 0) {
			return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
		} else {
			return "Just now";
		}
	};

	const getLanguageIcon = (language: string) => {
		switch (language.toLowerCase()) {
			case "javascript":
				return <div className="text-yellow-400 font-bold text-lg">JS</div>;
			case "typescript":
				return <div className="text-blue-500 font-bold text-lg">TS</div>;
			case "css":
				return <div className="text-pink-500 font-bold text-lg">CSS</div>;
			case "html":
				return <div className="text-orange-500 font-bold text-lg">HTML</div>;
			case "python":
				return <div className="text-green-500 font-bold text-lg">PY</div>;
			default:
				return <Code size={18} />;
		}
	};

	const nextOnboardingStep = () => {
		if (onboardingStep < 4) {
			setOnboardingStep(onboardingStep + 1);
		} else {
			setShowOnboarding(false);
		}
	};

	const handleUpgrade = () => {
		setIsProUser(true);
		setShowUpgradeModal(false);
		showNotification(
			"Upgraded to SnippetPro Premium! Enjoy all features.",
			"success"
		);
	};

	const Navigation = () => (
		<nav className="flex items-center text-sm mb-4 overflow-x-auto whitespace-nowrap pb-1">
			{breadcrumbs.map((crumb, index) => (
				<React.Fragment key={crumb.id}>
					{index > 0 && (
						<ChevronRight
							size={14}
							className={`mx-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
						/>
					)}
					<button
						onClick={() => {
							if (crumb.id === "home") {
								setCurrentSnippet(null);
							} else if (crumb.id === "category") {
								setCurrentSnippet(null);
							} else {
							}
						}}
						className={`hover:underline ${
							index === breadcrumbs.length - 1
								? darkMode
									? "text-white font-medium"
									: "text-gray-900 font-medium"
								: darkMode
								? "text-gray-400 hover:text-gray-300"
								: "text-gray-600 hover:text-gray-800"
						}`}
					>
						{crumb.name}
					</button>
				</React.Fragment>
			))}
		</nav>
	);

	const SnippetCard = ({ snippet }: { snippet: Snippet }) => (
		<div
			onClick={() => viewSnippet(snippet)}
			className={`relative rounded-xl shadow-sm border transition-all cursor-pointer transform hover:scale-102 hover:shadow-md ${
				darkMode
					? "bg-gray-800 border-gray-700 hover:bg-gray-750"
					: "bg-white border-gray-100 hover:bg-gray-50"
			} p-5 flex flex-col`}
		>
			<div className="flex justify-between items-start mb-2">
				<div className="flex items-center">
					<div className={`mr-3 p-2 rounded-lg bg-opacity-20`}>
						{getLanguageIcon(snippet.language)}
					</div>
					<h3 className="font-semibold text-lg text-clip mr-2">
						{snippet.title}
					</h3>
				</div>
				<button
					onClick={(e) => {
						e.stopPropagation();
						toggleFavorite(snippet.id);
					}}
					className={`p-1.5 rounded-full transition-colors ${
						snippet.isFavorite
							? "text-yellow-400 bg-yellow-50"
							: darkMode
							? "text-gray-400 hover:text-yellow-400 hover:bg-gray-700"
							: "text-gray-300 hover:text-yellow-400 hover:bg-gray-100"
					}`}
					aria-label={
						snippet.isFavorite ? "Remove from favorites" : "Add to favorites"
					}
				>
					<Star
						size={16}
						className={snippet.isFavorite ? "fill-current" : ""}
					/>
				</button>
			</div>

			<p
				className={`text-sm mb-3 line-clamp-2 flex-grow ${
					darkMode ? "text-gray-400" : "text-gray-600"
				}`}
			>
				{snippet.description}
			</p>

			<div className="flex flex-wrap items-center gap-2 mb-3">
				<div
					className={`px-2 py-0.5 rounded-full text-xs ${
						darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
					} flex items-center`}
				>
					<Folder size={12} className="mr-1" />
					{snippet.category}
				</div>

				<div
					className={`px-2 py-0.5 rounded-full text-xs ${
						darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
					}`}
				>
					<Clock size={12} className="inline mr-1" />
					{formatRelativeTime(snippet.lastAccessed || snippet.created)}
				</div>
			</div>

			<div className="flex flex-wrap gap-1.5 mb-1">
				{snippet.tags.slice(0, 3).map((tag, index) => (
					<div
						key={index}
						className={`px-2 py-0.5 rounded-full text-xs ${
							darkMode
								? "bg-blue-900 bg-opacity-40 text-blue-300"
								: "bg-blue-50 text-blue-700"
						}`}
					>
						#{tag}
					</div>
				))}
				{snippet.tags.length > 3 && (
					<div
						className={`px-2 py-0.5 rounded-full text-xs ${
							darkMode
								? "bg-gray-700 text-gray-400"
								: "bg-gray-100 text-gray-600"
						}`}
					>
						+{snippet.tags.length - 3}
					</div>
				)}
			</div>
		</div>
	);

	const SnippetListItem = ({ snippet }: { snippet: Snippet }) => (
		<div
			onClick={() => viewSnippet(snippet)}
			className={`relative rounded-lg shadow-sm border p-3 transition-all cursor-pointer hover:shadow-md ${
				darkMode
					? "bg-gray-800 border-gray-700 hover:bg-gray-750"
					: "bg-white border-gray-100 hover:bg-gray-50"
			} flex justify-between items-center`}
		>
			<div className="flex items-center flex-grow min-w-0">
				<div className={`mr-3 p-1.5 rounded-lg bg-opacity-20`}>
					{getLanguageIcon(snippet.language)}
				</div>
				<div className="min-w-0">
					<h3 className="font-medium text-base truncate">{snippet.title}</h3>
					<p
						className={`text-xs truncate ${
							darkMode ? "text-gray-400" : "text-gray-600"
						}`}
					>
						{snippet.description}
					</p>
				</div>
			</div>

			<div className="flex items-center ml-4">
				<div
					className={`hidden sm:block mr-3 px-2 py-0.5 rounded-full text-xs ${
						darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
					}`}
				>
					{snippet.category}
				</div>

				<button
					onClick={(e) => {
						e.stopPropagation();
						toggleFavorite(snippet.id);
					}}
					className={`p-1.5 rounded-full transition-colors ${
						snippet.isFavorite
							? "text-yellow-400 bg-yellow-50"
							: darkMode
							? "text-gray-400 hover:text-yellow-400 hover:bg-gray-700"
							: "text-gray-300 hover:text-yellow-400 hover:bg-gray-100"
					}`}
					aria-label={
						snippet.isFavorite ? "Remove from favorites" : "Add to favorites"
					}
				>
					<Star
						size={16}
						className={snippet.isFavorite ? "fill-current" : ""}
					/>
				</button>
			</div>
		</div>
	);

	return (
		<div
			className={`flex flex-col min-h-screen transition-colors duration-200 ${
				darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
			}`}
		>
			{}
			<header
				className={`sticky top-0 z-50 ${
					darkMode ? "bg-gray-800" : "bg-white"
				} shadow-sm border-b ${
					darkMode ? "border-gray-700" : "border-gray-200"
				}`}
			>
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					<div className="flex items-center">
						<div className="flex items-center mr-6">
							<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-sm">
								<Code size={22} className="text-white" />
							</div>
							<h1 className="ml-2.5 text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
								SnippetPro
							</h1>
							{isProUser && (
								<span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-full shadow-sm">
									PREMIUM
								</span>
							)}
						</div>

						{}
						<div
							className={`relative hidden md:block max-w-md transition-all duration-300 ${
								isSearchFocused ? "w-96" : "w-64"
							}`}
						>
							<div
								className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
									darkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								<Search size={16} />
							</div>
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Search snippets (Ctrl+K)"
								className={`py-2 pl-10 pr-4 block w-full rounded-lg ${
									darkMode
										? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
										: "bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
								} transition-all border`}
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									if (e.target.value) {
										setFilterType("search");
									} else {
										setFilterType("all");
									}
								}}
								onFocus={() => setIsSearchFocused(true)}
								onBlur={() => setIsSearchFocused(false)}
							/>
							{searchQuery && (
								<button
									onClick={() => {
										setSearchQuery("");
										setFilterType("all");
									}}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`h-4 w-4 ${
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							)}
						</div>
					</div>

					<div className="flex items-center space-x-3">
						{}
						<button
							onClick={() => setDarkMode(!darkMode)}
							className={`p-2 rounded-lg ${
								darkMode
									? "bg-gray-700 hover:bg-gray-600 text-gray-200"
									: "bg-gray-100 hover:bg-gray-200 text-gray-700"
							} transition-colors`}
							aria-label="Toggle theme"
							title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
						>
							{darkMode ? <Sun size={18} /> : <Moon size={18} />}
						</button>

						{}
						<div className="relative hidden sm:block">
							<button
								onClick={() => setShowExportModal(!showExportModal)}
								className={`p-2 rounded-lg ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600 text-gray-200"
										: "bg-gray-100 hover:bg-gray-200 text-gray-700"
								} transition-colors`}
								aria-label="Import/Export"
								title="Import/Export"
							>
								<Download size={18} />
							</button>
							{showExportModal && (
								<div
									className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
										darkMode
											? "bg-gray-800 border border-gray-700"
											: "bg-white border border-gray-200"
									} z-50`}
								>
									<div className="py-1">
										<button
											onClick={exportSnippets}
											className={`flex items-center w-full px-4 py-2 text-sm ${
												darkMode
													? "hover:bg-gray-700 text-gray-200"
													: "hover:bg-gray-100 text-gray-700"
											}`}
										>
											<Download size={16} className="mr-2" />
											Export Snippets
										</button>
										<label
											className={`flex items-center w-full px-4 py-2 text-sm cursor-pointer ${
												darkMode
													? "hover:bg-gray-700 text-gray-200"
													: "hover:bg-gray-100 text-gray-700"
											}`}
										>
											<Upload size={16} className="mr-2" />
											Import Snippets
											<input
												type="file"
												accept=".json"
												className="hidden"
												onChange={importSnippets}
											/>
										</label>
									</div>
								</div>
							)}
						</div>

						{}
						<button
							onClick={() => setShowSettings(!showSettings)}
							className={`p-2 rounded-lg ${
								darkMode
									? "bg-gray-700 hover:bg-gray-600 text-gray-200"
									: "bg-gray-100 hover:bg-gray-200 text-gray-700"
							} transition-colors`}
							aria-label="Settings"
							title="Settings"
						>
							<Settings size={18} />
						</button>

						{}
						<button
							onClick={createNewSnippet}
							className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all shadow-sm"
						>
							<Plus size={18} className="mr-1.5" />
							<span>New Snippet</span>
						</button>

						{}
						{!isProUser && (
							<button
								onClick={() => setShowUpgradeModal(true)}
								className="hidden sm:flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none transition-all shadow-sm text-sm"
							>
								<Gift size={14} className="mr-1" />
								<span>Upgrade</span>
							</button>
						)}

						{}
						<button
							onClick={() => setShowMobileNav(!showMobileNav)}
							className="md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
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
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>

				{}
				<div className="md:hidden px-4 pb-3">
					<div className="relative">
						<div
							className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							<Search size={16} />
						</div>
						<input
							type="text"
							placeholder="Search snippets..."
							className={`py-2 pl-10 pr-4 block w-full rounded-lg border ${
								darkMode
									? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
									: "bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
							}`}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={`h-4 w-4 ${
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}
					</div>
				</div>

				{}
				{showMobileNav && (
					<div
						className={`md:hidden ${
							darkMode ? "bg-gray-800" : "bg-white"
						} shadow-lg p-4 border-t ${
							darkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<div className="flex flex-col space-y-2">
							<button
								onClick={() => {
									createNewSnippet();
									setShowMobileNav(false);
								}}
								className="flex items-center w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all shadow-sm"
							>
								<Plus size={18} className="mr-2" />
								<span>New Snippet</span>
							</button>

							{!isProUser && (
								<button
									onClick={() => {
										setShowUpgradeModal(true);
										setShowMobileNav(false);
									}}
									className="flex items-center w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none transition-all shadow-sm"
								>
									<Gift size={18} className="mr-2" />
									<span>Upgrade to Premium</span>
								</button>
							)}

							<div
								className={`pt-2 border-t ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<div className="mb-2 font-medium">Categories</div>
								<ul className="space-y-1">
									<li>
										<button
											onClick={() => {
												setSelectedCategory("all");
												setShowMobileNav(false);
											}}
											className={`w-full text-left py-2 px-4 rounded-md ${
												selectedCategory === "all"
													? "bg-blue-600 text-white"
													: darkMode
													? "hover:bg-gray-700"
													: "hover:bg-gray-100"
											}`}
										>
											All Snippets
										</button>
									</li>
									{categories.map((category) => (
										<li key={category.id}>
											<button
												onClick={() => {
													setSelectedCategory(category.name);
													setShowMobileNav(false);
												}}
												className={`w-full text-left py-2 px-4 rounded-md ${
													selectedCategory === category.name
														? "bg-blue-600 text-white"
														: darkMode
														? "hover:bg-gray-700"
														: "hover:bg-gray-100"
												}`}
											>
												{category.name} ({category.snippetCount})
											</button>
										</li>
									))}
								</ul>
							</div>

							<div
								className={`pt-2 border-t ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<div className="mb-2 font-medium">Quick Access</div>
								<ul className="space-y-1">
									<li>
										<button
											onClick={() => {
												setShowMobileNav(false);
											}}
											className={`w-full flex items-center justify-between py-2 px-4 rounded-md ${
												searchQuery === "favorite:true"
													? "bg-blue-600 text-white"
													: darkMode
													? "hover:bg-gray-700"
													: "hover:bg-gray-100"
											}`}
										>
											<div className="flex items-center">
												<Star size={16} className="mr-2 text-yellow-400" />
												<span>Favorites</span>
											</div>
											<span className="text-sm px-2 py-0.5 rounded-full bg-opacity-50">
												{favoriteSnippets.length}
											</span>
										</button>
									</li>
									<li>
										<button
											onClick={() => {
												setShowMobileNav(false);
											}}
											className={`w-full flex items-center justify-between py-2 px-4 rounded-md ${
												searchQuery === "recent:true"
													? "bg-blue-600 text-white"
													: darkMode
													? "hover:bg-gray-700"
													: "hover:bg-gray-100"
											}`}
										>
											<div className="flex items-center">
												<Clock size={16} className="mr-2 text-green-400" />
												<span>Recent</span>
											</div>
											<span className="text-sm px-2 py-0.5 rounded-full bg-opacity-50">
												{recentSnippets.length}
											</span>
										</button>
									</li>
								</ul>
							</div>

							<div
								className={`pt-2 border-t ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<div className="flex items-center justify-between">
									<div className="mb-2 font-medium">Display</div>
									<div
										className={`flex rounded-lg overflow-hidden border ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
									>
										<button
											onClick={() => {
												setViewMode("grid");
												setShowMobileNav(false);
											}}
											className={`p-2 ${
												viewMode === "grid"
													? "bg-blue-600 text-white"
													: darkMode
													? "bg-gray-700 text-gray-400"
													: "bg-gray-100 text-gray-600"
											}`}
										>
											<Grid size={16} />
										</button>
										<button
											onClick={() => {
												setViewMode("list");
												setShowMobileNav(false);
											}}
											className={`p-2 ${
												viewMode === "list"
													? "bg-blue-600 text-white"
													: darkMode
													? "bg-gray-700 text-gray-400"
													: "bg-gray-100 text-gray-600"
											}`}
										>
											<List size={16} />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</header>

			<main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-8 gap-6">
				{}
				<aside
					className={`hidden md:block md:col-span-2 ${
						darkMode ? "bg-gray-800" : "bg-white"
					} rounded-xl shadow-sm border ${
						darkMode ? "border-gray-700" : "border-gray-200"
					} transition-colors p-4 h-fit sticky top-24`}
				>
					<div className="mb-4">
						<button
							onClick={() => setSelectedCategory("all")}
							className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
								selectedCategory === "all"
									? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
									: darkMode
									? "hover:bg-gray-700"
									: "hover:bg-gray-100"
							}`}
						>
							<span className="font-medium">All Snippets</span>
							<span
								className={`text-sm px-2 py-0.5 rounded-full ${
									selectedCategory === "all"
										? "bg-white bg-opacity-20 text-black"
										: darkMode
										? "bg-gray-700"
										: "bg-gray-200"
								}`}
							>
								{snippets.length}
							</span>
						</button>
					</div>

					<div className="mb-2 flex items-center justify-between">
						<h3 className="font-semibold">Categories</h3>
						<button
							onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
							className={`p-1 rounded-md transition-colors ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
							}`}
						>
							{showCategoryDropdown ? (
								<ChevronDown size={16} />
							) : (
								<ChevronRight size={16} />
							)}
						</button>
					</div>

					{showCategoryDropdown && (
						<div className="space-y-1 mb-4 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
							{categories.map((category) => (
								<button
									key={category.id}
									onClick={() => setSelectedCategory(category.name)}
									className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
										selectedCategory === category.name
											? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
											: darkMode
											? "hover:bg-gray-700"
											: "hover:bg-gray-100"
									}`}
								>
									<span>{category.name}</span>
									<span
										className={`text-xs px-2 py-0.5 rounded-full ${
											selectedCategory === category.name
												? "bg-white bg-opacity-20 text-black"
												: darkMode
												? "bg-gray-700 text-gray-300"
												: "bg-gray-200 text-gray-700"
										}`}
									>
										{category.snippetCount}
									</span>
								</button>
							))}

							{}
							{showNewCategoryInput ? (
								<div className="mt-2">
									<div className="flex items-center space-x-2 mb-2">
										<input
											type="text"
											placeholder="Category name"
											className={`block flex-grow py-1 px-2 text-sm rounded-md border ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white"
													: "bg-gray-100 border-gray-200 text-gray-900"
											}`}
											value={newCategory}
											onChange={(e) => setNewCategory(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") addNewCategory();
												if (e.key === "Escape") setShowNewCategoryInput(false);
											}}
										/>
										<button
											onClick={addNewCategory}
											className="p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
											title="Add"
										>
											<Plus size={16} />
										</button>
									</div>
									<button
										onClick={() => {
											setShowNewCategoryInput(false);
											setNewCategory("");
										}}
										className={`w-full text-center text-xs py-1 rounded-md ${
											darkMode
												? "text-gray-400 hover:bg-gray-700"
												: "text-gray-500 hover:bg-gray-100"
										}`}
									>
										Cancel
									</button>
								</div>
							) : (
								<button
									onClick={() => setShowNewCategoryInput(true)}
									className={`w-full flex items-center p-2 rounded-md text-sm transition-colors ${
										darkMode
											? "text-blue-400 hover:bg-gray-700"
											: "text-blue-600 hover:bg-gray-100"
									}`}
								>
									<Plus size={14} className="mr-1" />
									<span>Add Category</span>
								</button>
							)}
						</div>
					)}

					<div className="mb-2 flex items-center justify-between">
						<h3 className="font-semibold">Popular Tags</h3>
					</div>
					<div className="flex flex-wrap gap-2 mb-6">
						{mostUsedTags.map((tag) => (
							<button
								key={tag}
								onClick={() => setSearchQuery(tag)}
								className={`px-3 py-1 text-xs rounded-full ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
										: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
								} transition-colors`}
							>
								#{tag}
							</button>
						))}
					</div>

					<div
						className={`border-t ${
							darkMode ? "border-gray-700" : "border-gray-200"
						} pt-4`}
					>
						<button
							onClick={() => {
								setFilterType("favorites");
								setSelectedCategory("all");
							}}
							className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
								filterType === "favorites"
									? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
									: darkMode
									? "hover:bg-gray-700"
									: "hover:bg-gray-100"
							}`}
						>
							<div className="flex items-center">
								<Star size={16} className="mr-2 text-yellow-400" />
								<span>Favorites</span>
							</div>
							<span
								className={`text-xs px-2 py-0.5 rounded-full ${
									filterType === "favorites"
										? "bg-white bg-opacity-20 text-black"
										: darkMode
										? "bg-gray-700"
										: "bg-gray-200"
								}`}
							>
								{favoriteSnippets.length}
							</span>
						</button>

						<button
							onClick={() => {
								setFilterType("recents");
								setSelectedCategory("all");
							}}
							className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
								filterType === "recents"
									? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
									: darkMode
									? "hover:bg-gray-700"
									: "hover:bg-gray-100"
							}`}
						>
							<div className="flex items-center">
								<Clock size={16} className="mr-2 text-green-400" />
								<span>Recent</span>
							</div>
							<span
								className={`text-xs px-2 py-0.5 rounded-full ${
									filterType === "recents"
										? "bg-white bg-opacity-20 text-black"
										: darkMode
										? "bg-gray-700"
										: "bg-gray-200"
								}`}
							>
								{recentSnippets.length}
							</span>
						</button>
					</div>

					{}
					{!isProUser && (
						<div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100">
							<h4 className="font-medium text-amber-900 flex items-center">
								<Gift size={16} className="mr-1.5 text-yellow-500" />
								Premium Features
							</h4>
							<p className="mt-2 text-xs text-amber-800">
								Unlock unlimited snippets, advanced features, and cloud backup
							</p>
							<button
								onClick={() => setShowUpgradeModal(true)}
								className="mt-2 w-full py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 font-medium text-sm rounded-md hover:from-yellow-500 hover:to-amber-600 transition-colors shadow-sm"
							>
								Upgrade Now
							</button>
						</div>
					)}
				</aside>

				{}
				<div className="md:col-span-6">
					{}
					{(currentSnippet || selectedCategory !== "all") && <Navigation />}

					{}
					{currentSnippet && (
						<div className="mb-4">
							<button
								onClick={goBack}
								className={`flex items-center px-3 py-1.5 rounded-md ${
									darkMode
										? "bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300"
										: "bg-white hover:bg-gray-50 border border-gray-200 text-gray-700"
								} transition-colors shadow-sm`}
							>
								<ChevronLeft size={16} className="mr-1" />
								<span>Back to snippets</span>
							</button>
						</div>
					)}

					{}
					{!currentSnippet && (
						<div className="flex flex-wrap justify-between items-center mb-4 gap-2">
							<div className="flex items-center">
								<h2 className="text-lg font-semibold mr-3">
									{filterType === "favorites"
										? "Favorite Snippets"
										: filterType === "recents"
										? "Recent Snippets"
										: selectedCategory !== "all"
										? `${selectedCategory} Snippets`
										: "All Snippets"}
								</h2>
								<div
									className={`text-sm rounded-full px-3 py-0.5 ${
										darkMode
											? "bg-blue-900 bg-opacity-40 text-blue-300"
											: "bg-blue-100 text-blue-800"
									} `}
								>
									{filteredSnippets.length} snippets
								</div>
							</div>

							<div className="flex items-center space-x-2">
								{}
								<div className="relative hidden sm:block">
									<button
										onClick={() => setShowSortOptions(!showSortOptions)}
										className={`flex items-center px-3 py-1.5 rounded-md ${
											darkMode
												? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
												: "bg-white hover:bg-gray-50 border border-gray-200"
										} transition-colors shadow-sm`}
									>
										<Filter size={16} className="mr-1.5" />
										<span>Sort</span>
										<ChevronDown size={14} className="ml-1" />
									</button>
									{showSortOptions && (
										<div
											className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
												darkMode
													? "bg-gray-800 border border-gray-700"
													: "bg-white border border-gray-200"
											} z-10`}
										>
											<div className="py-1">
												{[
													{ value: "newest", label: "Newest First" },
													{ value: "oldest", label: "Oldest First" },
													{ value: "a-z", label: "A to Z" },
													{ value: "z-a", label: "Z to A" },
													{ value: "most-used", label: "Most Used" },
												].map((option) => (
													<button
														key={option.value}
														onClick={() => {
															setSortOption(option.value as SortOption);
															setShowSortOptions(false);
														}}
														className={`flex items-center w-full px-4 py-2 text-sm ${
															sortOption === option.value
																? "bg-blue-600 text-white"
																: darkMode
																? "hover:bg-gray-700 text-gray-200"
																: "hover:bg-gray-100 text-gray-700"
														}`}
													>
														{sortOption === option.value && (
															<Check size={16} className="mr-2" />
														)}
														{!sortOption === option.value && (
															<div className="w-4 mr-2"></div>
														)}
														{option.label}
													</button>
												))}
											</div>
										</div>
									)}
								</div>

								{}
								<div
									className={`hidden sm:flex rounded-md overflow-hidden border ${
										darkMode ? "border-gray-700" : "border-gray-200"
									}`}
								>
									<button
										onClick={() => setViewMode("grid")}
										className={`p-1.5 ${
											viewMode === "grid"
												? "bg-blue-600 text-white"
												: darkMode
												? "bg-gray-800 hover:bg-gray-700 text-gray-400"
												: "bg-white hover:bg-gray-50 text-gray-600"
										}`}
										title="Grid view"
									>
										<Grid size={16} />
									</button>
									<button
										onClick={() => setViewMode("list")}
										className={`p-1.5 ${
											viewMode === "list"
												? "bg-blue-600 text-white"
												: darkMode
												? "bg-gray-800 hover:bg-gray-700 text-gray-400"
												: "bg-white hover:bg-gray-50 text-gray-600"
										}`}
										title="List view"
									>
										<List size={16} />
									</button>
								</div>

								{}
								<button
									onClick={createNewSnippet}
									className="sm:hidden flex items-center p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
									title="New snippet"
								>
									<Plus size={18} />
								</button>
							</div>
						</div>
					)}

					{}
					{filteredSnippets.length === 0 && !currentSnippet && !isEditing && (
						<div
							className={`rounded-xl shadow-sm border ${
								darkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white border-gray-200"
							} p-8 text-center`}
						>
							<div
								className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center ${
									darkMode ? "border-gray-700" : "border-gray-100"
								} mb-4`}
							>
								<FileText
									size={36}
									className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
								/>
							</div>
							<h3 className="text-xl font-bold mb-2">No snippets found</h3>
							<p
								className={`mb-4 ${
									darkMode ? "text-gray-400" : "text-gray-600"
								}`}
							>
								{searchQuery
									? "No snippets match your search criteria."
									: "You don't have any snippets in this category yet."}
							</p>
							<button
								onClick={createNewSnippet}
								className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
							>
								<Plus size={18} className="mr-1.5" />
								Create New Snippet
							</button>
						</div>
					)}

					{}
					{isEditing && currentSnippet ? (
						<div
							className={`rounded-xl shadow-sm border ${
								darkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white border-gray-200"
							} p-5`}
						>
							<div className="mb-4">
								<label
									className={`block mb-1 font-medium ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Title
								</label>
								<input
									type="text"
									value={currentSnippet.title}
									onChange={(e) => updateSnippetField("title", e.target.value)}
									className={`block w-full px-4 py-2 rounded-lg border ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
											: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
									}`}
								/>
							</div>

							<div className="mb-4">
								<label
									className={`block mb-1 font-medium ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Description
								</label>
								<textarea
									value={currentSnippet.description}
									onChange={(e) =>
										updateSnippetField("description", e.target.value)
									}
									className={`block w-full px-4 py-2 rounded-lg border ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
											: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
									}`}
									rows={2}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div>
									<label
										className={`block mb-1 font-medium ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Language
									</label>
									<select
										value={currentSnippet.language}
										onChange={(e) =>
											updateSnippetField("language", e.target.value)
										}
										className={`block w-full px-4 py-2 rounded-lg border ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
												: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
										}`}
									>
										<option value="javascript">JavaScript</option>
										<option value="typescript">TypeScript</option>
										<option value="html">HTML</option>
										<option value="css">CSS</option>
										<option value="python">Python</option>
										<option value="java">Java</option>
										<option value="rust">Rust</option>
										<option value="go">Go</option>
									</select>
								</div>

								<div>
									<label
										className={`block mb-1 font-medium ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Category
									</label>
									<select
										value={currentSnippet.category}
										onChange={(e) =>
											updateSnippetField("category", e.target.value)
										}
										className={`block w-full px-4 py-2 rounded-lg border ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
												: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
										}`}
									>
										{categories.map((category) => (
											<option key={category.id} value={category.name}>
												{category.name}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="mb-4">
								<label
									className={`block mb-1 font-medium ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Tags (comma separated)
								</label>
								<input
									type="text"
									value={currentSnippet.tags.join(", ")}
									onChange={(e) =>
										updateSnippetField(
											"tags",
											e.target.value
												.split(",")
												.map((tag) => tag.trim())
												.filter((tag) => tag)
										)
									}
									className={`block w-full px-4 py-2 rounded-lg border ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
											: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
									}`}
									placeholder="E.g. react, hooks, state"
								/>
							</div>

							<div className="mb-4">
								<div className="flex items-center justify-between mb-1">
									<label
										className={`font-medium ${
											darkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Code
									</label>
									<div className="flex items-center space-x-2">
										<div
											className={`text-xs ${
												darkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Press Ctrl+S to save
										</div>
										<div
											className={`px-2 py-0.5 rounded-md text-xs ${
												darkMode
													? "bg-gray-700 text-gray-300"
													: "bg-gray-100 text-gray-700"
											}`}
										>
											{currentSnippet.language.toUpperCase()}
										</div>
									</div>
								</div>
								<textarea
									value={currentSnippet.code}
									onChange={(e) => updateSnippetField("code", e.target.value)}
									className={`block w-full px-4 py-2 rounded-lg border font-mono ${
										darkMode
											? "bg-gray-900 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
											: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
									}`}
									rows={12}
									style={{ fontSize: `${userPreferences.fontSize}px` }}
								/>
							</div>

							<div className="flex items-center mb-4">
								<input
									type="checkbox"
									id="favorite-checkbox"
									checked={currentSnippet.isFavorite}
									onChange={(e) =>
										updateSnippetField("isFavorite", e.target.checked)
									}
									className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label
									htmlFor="favorite-checkbox"
									className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
								>
									Add to favorites
								</label>
							</div>

							<div className="flex flex-wrap justify-end gap-2">
								<button
									onClick={() => setIsEditing(false)}
									className={`px-4 py-2 rounded-lg border ${
										darkMode
											? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
											: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200"
									} transition-colors`}
								>
									Cancel
								</button>
								<button
									onClick={saveSnippet}
									className="px-4 py-2 flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
								>
									<Save size={18} className="mr-1.5" />
									Save
								</button>
							</div>
						</div>
					) : currentSnippet ? (
						<div
							className={`rounded-xl shadow-sm border ${
								darkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white border-gray-200"
							} p-5`}
						>
							<div className="flex flex-wrap justify-between items-start mb-4">
								<div className="flex items-start">
									<div className={`mr-3 mt-1 p-2 rounded-lg bg-opacity-20`}>
										{getLanguageIcon(currentSnippet.language)}
									</div>
									<div>
										<h2 className="text-xl font-bold">
											{currentSnippet.title}
										</h2>
										<p
											className={`mt-1 ${
												darkMode ? "text-gray-400" : "text-gray-600"
											}`}
										>
											{currentSnippet.description}
										</p>
									</div>
								</div>

								<div className="flex space-x-2 mt-3 sm:mt-0">
									<button
										onClick={() => toggleFavorite(currentSnippet.id)}
										className={`p-2 rounded-md transition-colors ${
											currentSnippet.isFavorite
												? "text-yellow-400 bg-yellow-50"
												: darkMode
												? "text-gray-400 hover:text-yellow-400 hover:bg-gray-700"
												: "text-gray-500 hover:text-yellow-400 hover:bg-gray-100"
										}`}
										aria-label={
											currentSnippet.isFavorite
												? "Remove from favorites"
												: "Add to favorites"
										}
										title={
											currentSnippet.isFavorite
												? "Remove from favorites"
												: "Add to favorites"
										}
									>
										<Star
											size={20}
											className={
												currentSnippet.isFavorite ? "fill-current" : ""
											}
										/>
									</button>

									<button
										onClick={() => setIsEditing(true)}
										className={`p-2 rounded-md ${
											darkMode
												? "bg-gray-700 hover:bg-gray-600 text-blue-400"
												: "bg-gray-100 hover:bg-gray-200 text-blue-600"
										} transition-colors`}
										aria-label="Edit snippet"
										title="Edit snippet"
									>
										<Edit size={18} />
									</button>

									<button
										onClick={() =>
											copyToClipboard(currentSnippet.code, currentSnippet.id)
										}
										className={`p-2 rounded-md ${
											darkMode
												? "bg-gray-700 hover:bg-gray-600 text-green-400"
												: "bg-gray-100 hover:bg-gray-200 text-green-600"
										} transition-colors`}
										aria-label="Copy to clipboard"
										title="Copy to clipboard"
									>
										<Copy size={18} />
									</button>

									<button
										onClick={() => deleteSnippet(currentSnippet.id)}
										className={`p-2 rounded-md ${
											darkMode
												? "bg-gray-700 hover:bg-gray-600 text-red-400"
												: "bg-gray-100 hover:bg-gray-200 text-red-600"
										} transition-colors`}
										aria-label="Delete snippet"
										title="Delete snippet"
									>
										<Trash2 size={18} />
									</button>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-2 mb-3">
								<div
									className={`px-3 py-1 rounded-full text-xs ${
										darkMode ? "bg-gray-700" : "bg-gray-100"
									} flex items-center`}
								>
									<span className={`mr-1.5 w-2 h-2 rounded-full `}></span>
									{currentSnippet.language}
								</div>
								<div
									className={`px-3 py-1 rounded-full text-xs ${
										darkMode
											? "bg-gray-700 text-gray-300"
											: "bg-gray-100 text-gray-700"
									}`}
								>
									<Folder size={12} className="inline mr-1" />
									{currentSnippet.category}
								</div>
								<div
									className={`px-3 py-1 rounded-full text-xs ${
										darkMode
											? "bg-gray-700 text-gray-300"
											: "bg-gray-100 text-gray-700"
									}`}
								>
									<Clock size={12} className="inline mr-1" />
									{formatDate(currentSnippet.created)}
								</div>
								<div
									className={`px-3 py-1 rounded-full text-xs ${
										darkMode
											? "bg-gray-700 text-gray-300"
											: "bg-gray-100 text-gray-700"
									}`}
								>
									<Bookmark size={12} className="inline mr-1" />
									{currentSnippet.useCount}{" "}
									{currentSnippet.useCount === 1 ? "use" : "uses"}
								</div>
							</div>

							<div className="mb-4 flex flex-wrap gap-2">
								{currentSnippet.tags.map((tag, index) => (
									<div
										key={index}
										className={`px-2 py-1 rounded-full text-xs ${
											darkMode
												? "bg-blue-900 bg-opacity-40 text-blue-300"
												: "bg-blue-50 text-blue-700 border border-blue-100"
										}`}
									>
										#{tag}
									</div>
								))}
							</div>

							<div className="overflow-hidden rounded-lg border mb-3 flex flex-col">
								<div
									className={`flex items-center justify-between px-4 py-2 border-b ${
										darkMode
											? "bg-gray-900 border-gray-700 text-gray-300"
											: "bg-gray-50 border-gray-200 text-gray-700"
									}`}
								>
									<div className="flex items-center">
										<span className="font-medium text-sm">
											{currentSnippet.language}
										</span>
									</div>
									<div className="flex items-center">
										<button
											onClick={() =>
												copyToClipboard(currentSnippet.code, currentSnippet.id)
											}
											className={`p-1 rounded text-xs flex items-center ${
												darkMode
													? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
													: "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
											}`}
											title="Copy code"
										>
											<Copy size={14} className="mr-1" />
											Copy
										</button>
									</div>
								</div>
								<pre
									className={`w-full p-4 overflow-x-auto font-mono ${
										darkMode
											? "bg-gray-900 text-gray-100"
											: "bg-gray-50 text-gray-800"
									}`}
									style={{ fontSize: `${userPreferences.fontSize}px` }}
								>
									<code>{currentSnippet.code}</code>
								</pre>
							</div>

							{copySuccess && (
								<div className="mt-2 text-sm text-green-500 flex items-center justify-end">
									<Check size={16} className="mr-1" />
									{copySuccess}
								</div>
							)}

							<div
								className={`mt-6 flex flex-wrap justify-between items-center pt-4 border-t ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<div className="text-sm">
									<span
										className={darkMode ? "text-gray-400" : "text-gray-600"}
									>
										Created:{" "}
									</span>
									<span
										className={darkMode ? "text-gray-300" : "text-gray-700"}
									>
										{formatDate(currentSnippet.created)}
									</span>
								</div>
								<div className="flex space-x-2">
									<button
										onClick={() => setIsEditing(true)}
										className="px-4 py-2 flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
									>
										<Edit size={16} className="mr-1.5" />
										Edit Snippet
									</button>
								</div>
							</div>
						</div>
					) : (
						<>
							{}
							{viewMode === "grid" ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{currentSnippetsPage.map((snippet) => (
										<SnippetCard key={snippet.id} snippet={snippet} />
									))}
								</div>
							) : (
								<div className="flex flex-col space-y-2">
									{currentSnippetsPage.map((snippet) => (
										<SnippetListItem key={snippet.id} snippet={snippet} />
									))}
								</div>
							)}

							{}
							{totalPages > 1 && (
								<div className="mt-6 flex justify-center">
									<nav
										className={`inline-flex rounded-md shadow-sm border ${
											darkMode ? "border-gray-700" : "border-gray-200"
										}`}
										aria-label="Pagination"
									>
										<button
											onClick={() => goToPage(currentPage - 1)}
											disabled={currentPage === 1}
											className={`px-3 py-2 rounded-l-md ${
												currentPage === 1
													? darkMode
														? "bg-gray-800 text-gray-500 cursor-not-allowed"
														: "bg-gray-100 text-gray-400 cursor-not-allowed"
													: darkMode
													? "bg-gray-800 hover:bg-gray-700 text-gray-300"
													: "bg-white hover:bg-gray-50 text-gray-700"
											} text-sm font-medium`}
										>
											Previous
										</button>
										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											(page) => (
												<button
													key={page}
													onClick={() => goToPage(page)}
													className={`px-3 py-2 ${
														currentPage === page
															? "bg-blue-600 text-white"
															: darkMode
															? "bg-gray-800 hover:bg-gray-700 text-gray-300"
															: "bg-white hover:bg-gray-50 text-gray-700"
													} text-sm font-medium`}
												>
													{page}
												</button>
											)
										)}
										<button
											onClick={() => goToPage(currentPage + 1)}
											disabled={currentPage === totalPages}
											className={`px-3 py-2 rounded-r-md ${
												currentPage === totalPages
													? darkMode
														? "bg-gray-800 text-gray-500 cursor-not-allowed"
														: "bg-gray-100 text-gray-400 cursor-not-allowed"
													: darkMode
													? "bg-gray-800 hover:bg-gray-700 text-gray-300"
													: "bg-white hover:bg-gray-50 text-gray-700"
											} text-sm font-medium`}
										>
											Next
										</button>
									</nav>
								</div>
							)}
						</>
					)}
				</div>
			</main>

			{}
			<footer
				className={`mt-auto py-6 ${
					darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"
				} border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
			>
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center mb-4 md:mb-0">
							<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-sm mr-2">
								<Code size={18} className="text-white" />
							</div>
							<span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
								SnippetPro
							</span>
						</div>

						<div className="flex flex-col text-sm items-center md:items-end">
							<p className="mb-1">© 2025 SnippetPro. All rights reserved.</p>
							<div className="flex space-x-3">
								<a href="#" className="hover:underline">
									Privacy Policy
								</a>
								<span>•</span>
								<a href="#" className="hover:underline">
									Terms of Service
								</a>
							</div>
						</div>

						<div className="flex space-x-4 mt-4 md:mt-0">
							<a
								href="#"
								className={`p-2 rounded-full ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								} transition-colors`}
								title="GitHub"
							>
								<Github size={18} />
							</a>
							<a
								href="#"
								className={`p-2 rounded-full ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								} transition-colors`}
								title="Twitter"
							>
								<Twitter size={18} />
							</a>
							<a
								href="#"
								className={`p-2 rounded-full ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								} transition-colors`}
								title="LinkedIn"
							>
								<Linkedin size={18} />
							</a>
						</div>
					</div>
				</div>
			</footer>

			{}
			{notification.show && (
				<div
					className={`fixed bottom-4 right-4 px-5 py-3 rounded-lg shadow-lg transition-all transform animate-slide-up max-w-sm flex items-center ${
						notification.type === "success"
							? "bg-green-600 text-white"
							: notification.type === "error"
							? "bg-red-600 text-white"
							: "bg-blue-600 text-white"
					}`}
				>
					{notification.type === "success" && (
						<Check size={18} className="mr-2" />
					)}
					{notification.type === "error" && (
						<AlertCircle size={18} className="mr-2" />
					)}
					{notification.type === "info" && <Info size={18} className="mr-2" />}
					{notification.message}
				</div>
			)}

			{}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
					<div
						className={`relative rounded-xl shadow-lg max-w-md w-full p-6 ${
							darkMode ? "bg-gray-800" : "bg-white"
						} animate-slide-up`}
					>
						<h3 className="text-xl font-bold mb-2">Delete Snippet</h3>
						<p className={darkMode ? "text-gray-300" : "text-gray-700"}>
							Are you sure you want to delete this snippet? This action cannot
							be undone.
						</p>
						<div className="flex justify-end space-x-3 mt-6">
							<button
								onClick={() => setShowDeleteModal(false)}
								className={`px-4 py-2 rounded-lg ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600 text-white"
										: "bg-gray-200 hover:bg-gray-300 text-gray-800"
								}`}
							>
								Cancel
							</button>
							<button
								onClick={confirmDeleteSnippet}
								className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{}
			{showSettings && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
					<div
						className={`relative rounded-xl shadow-lg max-w-md w-full p-6 ${
							darkMode ? "bg-gray-800" : "bg-white"
						} animate-slide-up overflow-y-auto max-h-[90vh]`}
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-bold">Settings</h3>
							<button
								onClick={() => setShowSettings(false)}
								className={`p-1.5 rounded-full ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-6">
							<div>
								<h4
									className={`font-semibold text-lg mb-3 ${
										darkMode ? "text-gray-200" : "text-gray-800"
									}`}
								>
									Display Options
								</h4>
								<div className="space-y-4">
									<div>
										<label
											className={`block mb-1 font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Font Size
										</label>
										<div className="flex items-center">
											<input
												type="range"
												min="12"
												max="24"
												value={userPreferences.fontSize}
												onChange={(e) =>
													setUserPreferences({
														...userPreferences,
														fontSize: parseInt(e.target.value),
													})
												}
												className="w-full mr-2"
											/>
											<span className="w-10 text-center">
												{userPreferences.fontSize}px
											</span>
										</div>
									</div>

									<div>
										<label
											className={`block mb-1 font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Default View
										</label>
										<div className="flex">
											<button
												onClick={() =>
													setUserPreferences({
														...userPreferences,
														defaultView: "grid",
													})
												}
												className={`flex-1 flex items-center justify-center p-2 ${
													userPreferences.defaultView === "grid"
														? "bg-blue-600 text-white"
														: darkMode
														? "bg-gray-700 text-gray-300"
														: "bg-gray-100 text-gray-700"
												} rounded-l-md`}
											>
												<Grid size={16} className="mr-1.5" />
												Grid
											</button>
											<button
												onClick={() =>
													setUserPreferences({
														...userPreferences,
														defaultView: "list",
													})
												}
												className={`flex-1 flex items-center justify-center p-2 ${
													userPreferences.defaultView === "list"
														? "bg-blue-600 text-white"
														: darkMode
														? "bg-gray-700 text-gray-300"
														: "bg-gray-100 text-gray-700"
												} rounded-r-md`}
											>
												<List size={16} className="mr-1.5" />
												List
											</button>
										</div>
									</div>

									<div>
										<label
											className={`block mb-1 font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Items Per Page
										</label>
										<select
											value={userPreferences.snippetsPerPage}
											onChange={(e) =>
												setUserPreferences({
													...userPreferences,
													snippetsPerPage: parseInt(e.target.value),
												})
											}
											className={`block w-full px-4 py-2 rounded-lg border ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white"
													: "bg-gray-50 border-gray-300 text-gray-900"
											}`}
										>
											<option value="6">6 snippets</option>
											<option value="9">9 snippets</option>
											<option value="12">12 snippets</option>
											<option value="15">15 snippets</option>
											<option value="24">24 snippets</option>
										</select>
									</div>
								</div>
							</div>

							<div>
								<h4
									className={`font-semibold text-lg mb-3 ${
										darkMode ? "text-gray-200" : "text-gray-800"
									}`}
								>
									Editor Settings
								</h4>
								<div className="space-y-4">
									<div>
										<label
											className={`block mb-1 font-medium ${
												darkMode ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Tab Size
										</label>
										<select
											value={userPreferences.tabSize}
											onChange={(e) =>
												setUserPreferences({
													...userPreferences,
													tabSize: parseInt(e.target.value),
												})
											}
											className={`block w-full px-4 py-2 rounded-lg border ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white"
													: "bg-gray-50 border-gray-300 text-gray-900"
											}`}
										>
											<option value="2">2 spaces</option>
											<option value="4">4 spaces</option>
											<option value="8">8 spaces</option>
										</select>
									</div>

									<div className="flex items-center">
										<input
											type="checkbox"
											id="auto-save"
											checked={userPreferences.autoSave}
											onChange={(e) =>
												setUserPreferences({
													...userPreferences,
													autoSave: e.target.checked,
												})
											}
											className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<label
											htmlFor="auto-save"
											className={darkMode ? "text-gray-300" : "text-gray-700"}
										>
											Auto-save when editing
										</label>
									</div>

									<div className="flex items-center">
										<input
											type="checkbox"
											id="line-numbers"
											checked={userPreferences.showLineNumbers}
											onChange={(e) =>
												setUserPreferences({
													...userPreferences,
													showLineNumbers: e.target.checked,
												})
											}
											className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<label
											htmlFor="line-numbers"
											className={darkMode ? "text-gray-300" : "text-gray-700"}
										>
											Show line numbers
										</label>
									</div>

									<div className="flex items-center">
										<input
											type="checkbox"
											id="highlight-line"
											checked={userPreferences.highlightCurrentLine}
											onChange={(e) =>
												setUserPreferences({
													...userPreferences,
													highlightCurrentLine: e.target.checked,
												})
											}
											className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<label
											htmlFor="highlight-line"
											className={darkMode ? "text-gray-300" : "text-gray-700"}
										>
											Highlight current line
										</label>
									</div>

									<div className="flex items-center">
										<input
											type="checkbox"
											id="auto-brackets"
											checked={userPreferences.autoCloseBrackets}
											onChange={(e) =>
												setUserPreferences({
													...userPreferences,
													autoCloseBrackets: e.target.checked,
												})
											}
											className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<label
											htmlFor="auto-brackets"
											className={darkMode ? "text-gray-300" : "text-gray-700"}
										>
											Auto-close brackets
										</label>
									</div>
								</div>
							</div>

							<div
								className={`pt-4 border-t ${
									darkMode ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<div className="flex justify-between items-center">
									<button
										onClick={() => {
											showNotification(
												"All settings reset to defaults",
												"info"
											);
											setUserPreferences({
												fontSize: 14,
												tabSize: 2,
												autoSave: true,
												showLineNumbers: true,
												defaultView: "grid",
												highlightCurrentLine: true,
												autoCloseBrackets: true,
												snippetsPerPage: 9,
												theme: "default",
											});
										}}
										className={`px-4 py-2 rounded-lg ${
											darkMode
												? "bg-gray-700 hover:bg-gray-600 text-white"
												: "bg-gray-100 hover:bg-gray-200 text-gray-800"
										}`}
									>
										Reset to Default
									</button>
									<button
										onClick={() => setShowSettings(false)}
										className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm"
									>
										Save Changes
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{}
			{showUpgradeModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
					<div
						className={`relative rounded-xl shadow-lg max-w-md w-full p-6 overflow-hidden ${
							darkMode ? "bg-gray-800" : "bg-white"
						} animate-slide-up`}
					>
						{}
						<div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rounded-full opacity-10 -mr-10 -mt-10"></div>
						<div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600 rounded-full opacity-10 -ml-10 -mb-10"></div>

						<h3 className="text-2xl font-bold mb-1 relative">
							Upgrade to SnippetPro Premium
							<span className="absolute -top-1 -right-1 w-20 h-20 bg-yellow-400 rounded-full opacity-10"></span>
						</h3>
						<p
							className={`${
								darkMode ? "text-gray-300" : "text-gray-700"
							} mb-4 relative`}
						>
							Take your productivity to the next level with premium features.
						</p>

						<ul className="space-y-2 mb-6 relative">
							{[
								"Unlimited code snippets",
								"Cloud sync across devices",
								"Advanced code editor features",
								"Team sharing & collaboration",
								"Custom themes and branding",
								"Automatic backups",
							].map((feature, index) => (
								<li
									key={index}
									className={`flex items-center ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									<Check size={16} className="mr-2 text-green-500" />
									{feature}
								</li>
							))}
						</ul>

						<div
							className={`flex flex-col mb-4 py-3 px-4 rounded-lg ${
								darkMode ? "bg-blue-900" : "bg-blue-50"
							} relative`}
						>
							<div className="flex justify-between items-center">
								<span className="text-blue-500 font-medium">Monthly</span>
								<span className="text-xl font-bold text-blue-500">$5.99</span>
							</div>
							<div className="flex justify-between items-center mt-2">
								<span className="text-blue-500 font-medium">
									Annual (save 20%)
								</span>
								<span className="text-xl font-bold text-blue-600">$49.99</span>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 relative">
							<button
								onClick={() => setShowUpgradeModal(false)}
								className={`flex-1 px-4 py-2 rounded-lg ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600 text-white"
										: "bg-gray-200 hover:bg-gray-300 text-gray-800"
								}`}
							>
								Maybe Later
							</button>
							<button
								onClick={handleUpgrade}
								className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 shadow-sm"
							>
								Upgrade Now
							</button>
						</div>
					</div>
				</div>
			)}

			{}
			{showOnboarding && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
					<div
						className={`relative rounded-xl shadow-lg max-w-md w-full p-6 ${
							darkMode ? "bg-gray-800" : "bg-white"
						} animate-slide-up`}
					>
						<button
							onClick={() => setShowOnboarding(false)}
							className={`absolute top-4 right-4 p-1 rounded-full ${
								darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						<div className="flex items-center justify-center mb-4">
							<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
								<Code size={30} className="text-white" />
							</div>
						</div>

						{onboardingStep === 1 && (
							<>
								<h3 className="text-xl font-bold text-center mb-2">
									Welcome to SnippetPro!
								</h3>
								<p
									className={`text-center mb-4 ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									The easiest way to organize and access your code snippets.
								</p>
								<div className="flex justify-center mb-6">
									<img
										src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=300"
										alt="Code snippet illustration"
										className="rounded-lg w-64 h-auto object-cover"
									/>
								</div>
							</>
						)}

						{onboardingStep === 2 && (
							<>
								<h3 className="text-xl font-bold text-center mb-2">
									Create & Organize
								</h3>
								<p
									className={`text-center mb-4 ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Create new snippets and organize them by language, category,
									and tags.
								</p>
								<div className="flex flex-col space-y-3 mb-6">
									<div
										className={`flex items-center p-3 rounded-lg ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Plus size={18} className="mr-3 text-blue-500" />
										<span>Create new snippets quickly</span>
									</div>
									<div
										className={`flex items-center p-3 rounded-lg ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Folder size={18} className="mr-3 text-blue-500" />
										<span>Organize by categories</span>
									</div>
									<div
										className={`flex items-center p-3 rounded-lg ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Tag size={18} className="mr-3 text-blue-500" />
										<span>Add tags for easy filtering</span>
									</div>
								</div>
							</>
						)}

						{onboardingStep === 3 && (
							<>
								<h3 className="text-xl font-bold text-center mb-2">
									Find & Use
								</h3>
								<p
									className={`text-center mb-4 ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Quickly find and reuse your code snippets whenever you need
									them.
								</p>
								<div className="flex flex-col space-y-3 mb-6">
									<div
										className={`flex items-center p-3 rounded-lg ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Search size={18} className="mr-3 text-blue-500" />
										<span>Search across all snippets</span>
									</div>
									<div
										className={`flex items-center p-3 rounded-lg ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Star size={18} className="mr-3 text-yellow-400" />
										<span>Mark favorites for quick access</span>
									</div>
									<div
										className={`flex items-center p-3 rounded-lg ${
											darkMode ? "bg-gray-700" : "bg-gray-100"
										}`}
									>
										<Copy size={18} className="mr-3 text-blue-500" />
										<span>Copy code with one click</span>
									</div>
								</div>
							</>
						)}

						{onboardingStep === 4 && (
							<>
								<h3 className="text-xl font-bold text-center mb-2">
									Ready to Start?
								</h3>
								<p
									className={`text-center mb-4 ${
										darkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									You're all set! Explore SnippetPro and boost your coding
									productivity.
								</p>
								<div className="flex justify-center mb-6">
									<div
										className={`p-4 rounded-lg ${
											darkMode ? "bg-gray-700" : "bg-blue-50"
										} max-w-xs`}
									>
										<h4 className="font-medium text-center mb-2">Pro Tip</h4>
										<p className="text-sm text-center">
											Use keyboard shortcuts like Ctrl+K to search and Ctrl+N to
											create new snippets!
										</p>
									</div>
								</div>
							</>
						)}

						<div
							className={`flex justify-between items-center pt-4 border-t ${
								darkMode ? "border-gray-700" : "border-gray-200"
							}`}
						>
							<div className="flex space-x-1">
								{[1, 2, 3, 4].map((step) => (
									<div
										key={step}
										className={`w-2 h-2 rounded-full ${
											step === onboardingStep
												? "bg-blue-600"
												: darkMode
												? "bg-gray-600"
												: "bg-gray-300"
										}`}
									></div>
								))}
							</div>
							<button
								onClick={nextOnboardingStep}
								className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm"
							>
								{onboardingStep < 4 ? "Next" : "Get Started"}
							</button>
						</div>
					</div>
				</div>
			)}

			{}
			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes slide-up {
					from {
						transform: translateY(10px);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}

				.animate-fade-in {
					animation: fade-in 0.2s ease-out;
				}

				.animate-slide-up {
					animation: slide-up 0.3s ease-out;
				}

				.hover\:scale-102:hover {
					transform: scale(1.02);
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
					height: 6px;
				}

				.custom-scrollbar::-webkit-scrollbar-track {
					background: ${darkMode
						? "rgba(31, 41, 55, 0.5)"
						: "rgba(243, 244, 246, 0.5)"};
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: ${darkMode
						? "rgba(75, 85, 99, 0.5)"
						: "rgba(209, 213, 219, 0.5)"};
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: ${darkMode
						? "rgba(75, 85, 99, 0.8)"
						: "rgba(156, 163, 175, 0.8)"};
				}
			`}</style>
		</div>
	);
};

export default SnippetProApp;
