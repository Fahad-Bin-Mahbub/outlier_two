'use client'
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet";

// Types
interface Note {
	id: string;
	title: string;
	content: string;
	lastEdited: number;
	editors: string[];
	color?: string;
	tags?: string[];
	isPinned?: boolean;
	versions?: NoteVersion[];
	comments?: Comment[];
	permissions?: { [userId: string]: "read" | "write" | "admin" };
	lastSynced?: number;
	template?: string;
}

interface User {
	id: string;
	name: string;
	isActive: boolean;
	isTyping: boolean;
	lastActivity: number;
	avatar?: string;
	cursorPosition?: { line: number; ch: number };
}

// New interfaces
interface NoteVersion {
	timestamp: number;
	content: string;
	author: string;
}

interface Comment {
	id: string;
	author: string;
	text: string;
	timestamp: number;
	replyTo?: string;
	position?: number; // Position in the content
}

// Format types
type TextFormat =
	| "bold"
	| "italic"
	| "underline"
	| "h1"
	| "h2"
	| "h3"
	| "bullet"
	| "numbered"
	| "code"
	| "quote"
	| "link"
	| "task";

// Available note colors
const noteColors = [
	{ name: "Default", value: "white" },
	{ name: "Blue", value: "#e6f0ff" },
	{ name: "Green", value: "#e6fff0" },
	{ name: "Yellow", value: "#fffde6" },
	{ name: "Pink", value: "#ffe6f0" },
	{ name: "Purple", value: "#f0e6ff" },
];

// Note templates
const noteTemplates = [
	{
		id: "blank",
		name: "Blank Note",
		content: "",
	},
	{
		id: "meeting",
		name: "Meeting Notes",
		content:
			"# Meeting: [Title]\n\n## Date: [Date]\n\n## Attendees\n- \n\n## Agenda\n1. \n\n## Action Items\n- [ ] \n",
	},
	{
		id: "journal",
		name: "Daily Journal",
		content:
			"# Journal: [Date]\n\n## Mood\n\n## Highlights\n- \n\n## Thoughts\n\n## Goals for Tomorrow\n- [ ] \n",
	},
	{
		id: "project",
		name: "Project Plan",
		content:
			"# Project: [Name]\n\n## Objective\n\n## Timeline\n- Start date: \n- End date: \n\n## Tasks\n- [ ] \n\n## Resources Needed\n- \n",
	},
];

const MobileNotesApp: React.FC = () => {
	// State
	const [notes, setNotes] = useState<Note[]>(() => {
		const saved = localStorage.getItem("mobileNotes");
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch (e) {
				console.error("Failed to parse saved notes", e);
				return getDefaultNotes();
			}
		}
		return getDefaultNotes();
	});

	// Additional state variables
	const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || "");
	const [username, setUsername] = useState<string>(
		() =>
			localStorage.getItem("notesUsername") ||
			`User${Math.floor(Math.random() * 1000)}`
	);
	const [activeUsers, setActiveUsers] = useState<User[]>([]);
	const [showShareModal, setShowShareModal] = useState(false);
	const [expandedMenu, setExpandedMenu] = useState(false);
	const [showFormatPanel, setShowFormatPanel] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [darkMode, setDarkMode] = useState(() => {
		const saved = localStorage.getItem("darkMode");
		return saved ? JSON.parse(saved) : false;
	});
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [showTagsModal, setShowTagsModal] = useState(false);
	const [newTag, setNewTag] = useState("");
	const [linkCopied, setLinkCopied] = useState(false);
	const [sharePermission, setSharePermission] = useState<
		"view" | "comment" | "edit"
	>("view");
	const [isOffline, setIsOffline] = useState(!navigator.onLine);
	const [searchResults, setSearchResults] = useState<Note[]>([]);
	const [pinnedNotes, setPinnedNotes] = useState<string[]>(() => {
		return notes.filter((note) => note.isPinned).map((note) => note.id);
	});
	const [showTemplatesModal, setShowTemplatesModal] = useState(false);

	// New state variables
	const [selectedFormat, setSelectedFormat] = useState<TextFormat | null>(null);
	const [isSyncing, setIsSyncing] = useState(false);
	const [showVersionHistory, setShowVersionHistory] = useState(false);
	const [showCommentModal, setShowCommentModal] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [selectedTextForComment, setSelectedTextForComment] = useState("");
	const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
	const [viewMode, setViewMode] = useState<"edit" | "read">("edit");
	const [focusMode, setFocusMode] = useState(false);

	// Refs
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const typingTimerRef = useRef<number | null>(null);
	const selectionRangeRef = useRef<Range | null>(null);

	// Get default notes
	function getDefaultNotes(): Note[] {
		return [
			{
				id: "note1",
				title: "Welcome to MobileNotes",
				content:
					"Welcome to your collaborative notes app! Here are some features:\n\n• Real-time collaboration\n• Mobile-friendly interface\n• Share notes with others\n• Customize note colors\n• Add tags to organize notes\n• Pin important notes\n• Rich text formatting\n• Version history\n• Comments\n• Offline mode\n\nTry creating your first note by tapping the + button in the top right.",
				lastEdited: Date.now(),
				editors: ["system"],
				color: "#e6f0ff",
				tags: ["welcome", "tutorial"],
				isPinned: true,
				versions: [
					{
						timestamp: Date.now() - 86400000, // 1 day ago
						content: "Welcome to your collaborative notes app!",
						author: "system",
					},
				],
			},
		];
	}

	// Get active note
	const activeNote = notes.find((note) => note.id === activeNoteId) || notes[0];

	// Persistence effects
	useEffect(() => {
		localStorage.setItem("mobileNotes", JSON.stringify(notes));
	}, [notes]);

	useEffect(() => {
		localStorage.setItem("notesUsername", username);
	}, [username]);

	useEffect(() => {
		localStorage.setItem("darkMode", JSON.stringify(darkMode));
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	// User presence simulation
	useEffect(() => {
		// Register current user
		const currentUser: User = {
			id: username,
			name: username,
			isActive: true,
			isTyping: false,
			lastActivity: Date.now(),
		};

		const addCurrentUser = () => {
			setActiveUsers((prev) => {
				const existingUsers = prev.filter((user) => user.id !== username);
				return [...existingUsers, currentUser];
			});
		};

		// Initial registration
		addCurrentUser();

		// Set up heartbeat
		const interval = setInterval(() => {
			// Update user timestamps
			addCurrentUser();

			// Clean inactive users
			setActiveUsers((prev) =>
				prev.filter((user) => Date.now() - user.lastActivity < 20000)
			);

			// Simulate occasional other users (for demo)
			if (Math.random() > 0.7) {
				simulateRandomUser();
			}
		}, 5000);

		return () => {
			clearInterval(interval);
			if (typingTimerRef.current) {
				window.clearTimeout(typingTimerRef.current);
			}
		};
	}, [username, activeNoteId]);

	// Simulate random user activity
	const simulateRandomUser = () => {
		const randomNames = ["Alice", "Bob", "Charlie", "Dana", "Ellie", "Frank"];
		const randomName =
			randomNames[Math.floor(Math.random() * randomNames.length)];

		const randomUser: User = {
			id: randomName,
			name: randomName,
			isActive: true,
			isTyping: Math.random() > 0.5,
			lastActivity: Date.now(),
		};

		setActiveUsers((prev) => {
			// Remove if already exists
			const existing = prev.filter((user) => user.id !== randomUser.id);
			return [...existing, randomUser];
		});

		// Add user to current note editors
		if (!activeNote.editors.includes(randomName)) {
			setNotes((prev) =>
				prev.map((note) =>
					note.id === activeNoteId
						? { ...note, editors: [...note.editors, randomName] }
						: note
				)
			);

			// Sometimes simulate a content change
			if (Math.random() > 0.7) {
				setTimeout(() => {
					const comments = [
						`\n\n${randomName}: I think we should discuss this further.`,
						`\n\n${randomName}: Good point!`,
						`\n\n${randomName}: Let me add something here...`,
					];
					const randomComment =
						comments[Math.floor(Math.random() * comments.length)];

					setNotes((prev) =>
						prev.map((note) =>
							note.id === activeNoteId
								? {
										...note,
										content: note.content + randomComment,
										lastEdited: Date.now(),
								  }
								: note
						)
					);
				}, 2000);
			}
		}
	};

	// Handle content change
	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const content = e.target.value;

		// Update note content
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === activeNoteId
					? {
							...note,
							content: content,
							lastEdited: Date.now(),
							editors: note.editors.includes(username)
								? note.editors
								: [...note.editors, username],
					  }
					: note
			)
		);

		// Show typing indicator
		setActiveUsers((prev) => {
			const others = prev.filter((user) => user.id !== username);
			return [
				...others,
				{
					id: username,
					name: username,
					isActive: true,
					isTyping: true,
					lastActivity: Date.now(),
				},
			];
		});

		// Clear previous timer
		if (typingTimerRef.current) {
			window.clearTimeout(typingTimerRef.current);
		}

		// Set timer to clear typing indicator
		typingTimerRef.current = window.setTimeout(() => {
			setActiveUsers((prev) => {
				return prev.map((user) =>
					user.id === username
						? { ...user, isTyping: false, lastActivity: Date.now() }
						: user
				);
			});
		}, 2000);
	};

	// Add new note
	const addNewNote = () => {
		const newNote: Note = {
			id: `note${Date.now()}`,
			title: `Note ${notes.length + 1}`,
			content: "",
			lastEdited: Date.now(),
			editors: [username],
		};

		setNotes((prev) => [...prev, newNote]);
		setActiveNoteId(newNote.id);
		setExpandedMenu(false);

		// Focus editor
		setTimeout(() => {
			if (editorRef.current) {
				editorRef.current.focus();
			}
		}, 100);
	};

	// Share note
	const handleShare = () => {
		setShowShareModal(true);
		setExpandedMenu(false);
	};

	// Handle note title change
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value.trim() || `Note ${activeNoteId.slice(-4)}`;

		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === activeNoteId
					? { ...note, title: title, lastEdited: Date.now() }
					: note
			)
		);
	};

	// Format timestamp
	const formatTime = (timestamp: number): string => {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Copy share link
	const copyShareLink = () => {
		const shareLink = `https://notes.example.com/shared/${activeNoteId}`;
		navigator.clipboard
			.writeText(shareLink)
			.then(() => {
				alert("Share link copied!");
				setShowShareModal(false);
			})
			.catch((err) => {
				console.error("Failed to copy", err);
				alert("Failed to copy link: " + shareLink);
			});
	};

	// Delete note
	const deleteNote = () => {
		if (notes.length <= 1) {
			alert("Cannot delete the last note");
			return;
		}

		if (confirm("Are you sure you want to delete this note?")) {
			setNotes((prev) => {
				const remaining = prev.filter((note) => note.id !== activeNoteId);
				setActiveNoteId(remaining[0].id);
				return remaining;
			});
		}

		setExpandedMenu(false);
	};

	// Toggle pin for a note
	const togglePin = () => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === activeNoteId ? { ...note, isPinned: !note.isPinned } : note
			)
		);
		setExpandedMenu(false);
	};

	// Change note color
	const changeNoteColor = (color: string) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === activeNoteId ? { ...note, color } : note
			)
		);
		setShowFormatPanel(false);
	};

	// Add tag to note
	const addTagToNote = () => {
		if (!newTag.trim()) return;

		const tag = newTag.trim().toLowerCase();

		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === activeNoteId
					? {
							...note,
							tags: note.tags
								? Array.from(new Set([...note.tags, tag]))
								: [tag],
					  }
					: note
			)
		);

		setNewTag("");
	};

	// Remove tag from note
	const removeTagFromNote = (tagToRemove: string) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === activeNoteId && note.tags
					? {
							...note,
							tags: note.tags.filter((tag) => tag !== tagToRemove),
					  }
					: note
			)
		);
	};

	// Filter notes by search term
	const filteredNotes = notes.filter((note) => {
		if (!searchTerm) return true;
		const term = searchTerm.toLowerCase();
		return (
			note.title.toLowerCase().includes(term) ||
			note.content.toLowerCase().includes(term) ||
			(note.tags && note.tags.some((tag) => tag.includes(term)))
		);
	});

	// Sort notes with pinned first
	const sortedNotes = [...filteredNotes].sort((a, b) => {
		// Pinned notes first
		if (a.isPinned && !b.isPinned) return -1;
		if (!a.isPinned && b.isPinned) return 1;

		// Then by last edited (most recent first)
		return b.lastEdited - a.lastEdited;
	});

	// Save the current state as a version
	const saveVersion = () => {
		if (!activeNote) return;

		const newVersion: NoteVersion = {
			timestamp: Date.now(),
			content: activeNote.content,
			author: username,
		};

		setNotes((prev) =>
			prev.map((note) =>
				note.id === activeNoteId
					? {
							...note,
							versions: note.versions
								? [...note.versions, newVersion]
								: [newVersion],
					  }
					: note
			)
		);

		// Show notification
		alert("Version saved");
	};

	// Restore a previous version
	const restoreVersion = (timestamp: number) => {
		if (!activeNote || !activeNote.versions) return;

		const versionToRestore = activeNote.versions.find(
			(v) => v.timestamp === timestamp
		);
		if (!versionToRestore) return;

		// First save current as a version
		const currentVersion: NoteVersion = {
			timestamp: Date.now(),
			content: activeNote.content,
			author: username,
		};

		setNotes((prev) =>
			prev.map((note) =>
				note.id === activeNoteId
					? {
							...note,
							content: versionToRestore.content,
							lastEdited: Date.now(),
							versions: [...(note.versions || []), currentVersion],
					  }
					: note
			)
		);

		setShowVersionHistory(false);
	};

	// Format text in the editor
	const formatText = (format: TextFormat) => {
		if (!editorRef.current) return;

		// Save cursor position
		const start = editorRef.current.selectionStart;
		const end = editorRef.current.selectionEnd;
		const selectedText = editorRef.current.value.substring(start, end);

		// Skip if no selection and not adding tasks
		if (start === end && format !== "task") {
			setSelectedFormat(format);
			return;
		}

		let formattedText = "";
		let cursorOffset = 0;

		switch (format) {
			case "bold":
				formattedText = `**${selectedText}**`;
				cursorOffset = 2;
				break;
			case "italic":
				formattedText = `*${selectedText}*`;
				cursorOffset = 1;
				break;
			case "underline":
				formattedText = `__${selectedText}__`;
				cursorOffset = 2;
				break;
			case "h1":
				formattedText = `# ${selectedText}`;
				cursorOffset = 2;
				break;
			case "h2":
				formattedText = `## ${selectedText}`;
				cursorOffset = 3;
				break;
			case "h3":
				formattedText = `### ${selectedText}`;
				cursorOffset = 4;
				break;
			case "bullet":
				formattedText = selectedText
					.split("\n")
					.map((line) => `- ${line}`)
					.join("\n");
				cursorOffset = 2;
				break;
			case "numbered":
				formattedText = selectedText
					.split("\n")
					.map((line, i) => `${i + 1}. ${line}`)
					.join("\n");
				cursorOffset = 3;
				break;
			case "code":
				formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
				cursorOffset = 4;
				break;
			case "quote":
				formattedText = selectedText
					.split("\n")
					.map((line) => `> ${line}`)
					.join("\n");
				cursorOffset = 2;
				break;
			case "task":
				formattedText = selectedText
					? selectedText
							.split("\n")
							.map((line) => `- [ ] ${line}`)
							.join("\n")
					: "- [ ] ";
				cursorOffset = 6;
				break;
			case "link":
				formattedText = `[${selectedText}](url)`;
				cursorOffset = 1;
				break;
		}

		if (formattedText) {
			// Replace selected text with formatted text
			const newContent =
				editorRef.current.value.substring(0, start) +
				formattedText +
				editorRef.current.value.substring(end);

			// Update content
			setNotes((prev) =>
				prev.map((note) =>
					note.id === activeNoteId
						? { ...note, content: newContent, lastEdited: Date.now() }
						: note
				)
			);

			// Set cursor position after the operation
			setTimeout(() => {
				if (editorRef.current) {
					editorRef.current.focus();
					editorRef.current.setSelectionRange(
						start + formattedText.length,
						start + formattedText.length
					);
				}
			}, 0);
		}

		setSelectedFormat(null);
	};

	// Add comment to the note
	const addComment = () => {
		if (!commentText.trim() || !activeNoteId) return;

		const newComment: Comment = {
			id: `comment-${Date.now()}`,
			author: username,
			text: commentText,
			timestamp: Date.now(),
			position: editorRef.current?.selectionStart || 0,
		};

		setNotes((prev) =>
			prev.map((note) =>
				note.id === activeNoteId
					? {
							...note,
							comments: note.comments
								? [...note.comments, newComment]
								: [newComment],
					  }
					: note
			)
		);

		setCommentText("");
		setShowCommentModal(false);
	};

	// Create note from template
	const createFromTemplate = (templateId: string) => {
		const template = noteTemplates.find((t) => t.id === templateId);
		if (!template) return;

		const newNote: Note = {
			id: `note${Date.now()}`,
			title: template.name,
			content: template.content,
			lastEdited: Date.now(),
			editors: [username],
			template: templateId,
		};

		setNotes((prev) => [...prev, newNote]);
		setActiveNoteId(newNote.id);
		setShowTemplatesModal(false);

		// Focus editor
		setTimeout(() => {
			if (editorRef.current) {
				editorRef.current.focus();
			}
		}, 100);
	};

	// Online/offline status effect
	useEffect(() => {
		// Listen for online/offline status
		const handleOnlineStatus = () => {
			if (navigator.onLine) {
				setIsOffline(false);
				syncNotes();
			} else {
				// Mark as offline in UI
				setIsOffline(true);
			}
		};

		window.addEventListener("online", handleOnlineStatus);
		window.addEventListener("offline", handleOnlineStatus);

		// Initial check
		handleOnlineStatus();

		return () => {
			window.removeEventListener("online", handleOnlineStatus);
			window.removeEventListener("offline", handleOnlineStatus);
		};
	}, []);

	// Sync notes with "server"
	const syncNotes = async () => {
		// Get notes that have changed since last sync
		const unsyncedNotes = notes.filter(
			(note) => !note.lastSynced || note.lastEdited > note.lastSynced
		);

		if (unsyncedNotes.length === 0) return;

		// In a real app, you'd send these to your backend
		try {
			setIsSyncing(true);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Update sync timestamps
			setNotes((prev) =>
				prev.map((note) => ({
					...note,
					lastSynced: Date.now(),
				}))
			);

			setIsSyncing(false);
		} catch (error) {
			console.error("Sync failed:", error);
			setIsSyncing(false);
		}
	};

	// Save notes locally
	useEffect(() => {
		if (notes.length > 0) {
			localStorage.setItem("mobileNotes", JSON.stringify(notes));

			// If online, try to sync changes
			if (navigator.onLine && !isSyncing) {
				// Debounce sync operation
				const timer = setTimeout(() => {
					syncNotes();
				}, 2000);

				return () => clearTimeout(timer);
			}
		}
	}, [notes]);

	// Auto-save current note as version every 5 minutes
	useEffect(() => {
		if (!activeNote) return;

		const autoSaveInterval = setInterval(() => {
			// Only save if there have been edits
			if (
				activeNote.lastEdited >
				(activeNote.versions?.slice(-1)[0]?.timestamp || 0)
			) {
				const newVersion: NoteVersion = {
					timestamp: Date.now(),
					content: activeNote.content,
					author: username + " (auto-save)",
				};

				setNotes((prev) =>
					prev.map((note) =>
						note.id === activeNoteId
							? {
									...note,
									versions: note.versions
										? [...note.versions, newVersion]
										: [newVersion],
							  }
							: note
					)
				);
			}
		}, 5 * 60 * 1000); // 5 minutes

		return () => clearInterval(autoSaveInterval);
	}, [activeNoteId, activeNote]);

	// Add searchNotes function
	const searchNotes = (notes: Note[], term: string): Note[] => {
		if (!term.trim()) return [];

		const lowerCaseTerm = term.toLowerCase();
		return notes.filter(
			(note) =>
				note.title.toLowerCase().includes(lowerCaseTerm) ||
				note.content.toLowerCase().includes(lowerCaseTerm) ||
				(note.tags &&
					note.tags.some((tag) => tag.toLowerCase().includes(lowerCaseTerm)))
		);
	};

	return (
		<div
			className={`flex flex-col h-screen ${
				darkMode
					? "dark bg-gray-900 text-gray-100"
					: "bg-gray-100 text-gray-900"
			}`}
		>
			<Helmet>
				{" "}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>{" "}
			</Helmet>

			{/* Header */}
			<header
				className={`${
					darkMode ? "bg-gray-800" : "bg-indigo-600"
				} text-white p-3 shadow-md`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<h1 className="text-xl font-bold">NotesApp</h1>
						{/* Toggle dark mode */}
						<button
							onClick={() => setDarkMode(!darkMode)}
							className="p-1.5 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 transition-colors"
							aria-label={
								darkMode ? "Switch to light mode" : "Switch to dark mode"
							}
						>
							{darkMode ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
										clipRule="evenodd"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
								</svg>
							)}
						</button>
					</div>

					<div className="flex items-center space-x-2">
						{/* Search button */}
						<button
							onClick={() => setShowSearch(!showSearch)}
							className={`p-2 rounded-full ${
								darkMode ? "bg-gray-700" : "bg-indigo-500"
							} hover:opacity-80 transition-colors`}
							aria-label="Search notes"
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
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>

						{/* Menu button */}
						<div className="relative">
							<button
								onClick={() => setExpandedMenu(!expandedMenu)}
								className={`p-2 rounded-full ${
									darkMode ? "bg-gray-700" : "bg-indigo-500"
								} hover:opacity-80 transition-colors`}
								aria-label="Menu"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
								</svg>
							</button>

							{expandedMenu && (
								<div
									className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-10 ${
										darkMode
											? "bg-gray-800 text-gray-100"
											: "bg-white text-gray-800"
									}`}
								>
									<button
										onClick={addNewNote}
										className={`flex items-center w-full text-left px-4 py-2 ${
											darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
										} transition-colors`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6v6m0 0v6m0-6h6m-6 0H6"
											/>
										</svg>
										New Note
									</button>
									<button
										onClick={() => setShowTagsModal(true)}
										className={`flex items-center w-full text-left px-4 py-2 ${
											darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
										} transition-colors`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
											/>
										</svg>
										Manage Tags
									</button>
									<button
										onClick={togglePin}
										className={`flex items-center w-full text-left px-4 py-2 ${
											darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
										} transition-colors`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
											/>
										</svg>
										{activeNote?.isPinned ? "Unpin Note" : "Pin Note"}
									</button>
									<button
										onClick={() => setShowFormatPanel(!showFormatPanel)}
										className={`flex items-center w-full text-left px-4 py-2 ${
											darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
										} transition-colors`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
											/>
										</svg>
										Change Note Color
									</button>
									<button
										onClick={handleShare}
										className={`flex items-center w-full text-left px-4 py-2 ${
											darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
										} transition-colors`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
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
										Share Note
									</button>
									<div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
									<button
										onClick={deleteNote}
										className={`flex items-center w-full text-left px-4 py-2 text-red-600 dark:text-red-400 ${
											darkMode
												? "hover:bg-red-900 hover:bg-opacity-20"
												: "hover:bg-red-50"
										} transition-colors`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
										Delete Note
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Search bar */}
				{showSearch && (
					<div className="mt-3 relative">
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search notes..."
							className={`w-full p-2 pr-8 rounded-lg ${
								darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
							} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm("")}
								className="absolute right-2 top-2 text-gray-500"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						)}
					</div>
				)}
			</header>

			{/* User identification and note actions bar */}
			<div
				className={`${
					darkMode ? "bg-gray-700" : "bg-indigo-100"
				} px-3 py-2 flex justify-between items-center border-b ${
					darkMode ? "border-gray-600" : "border-indigo-200"
				}`}
			>
				<div className="flex items-center space-x-2">
					<span
						className={`text-sm ${
							darkMode ? "text-gray-300" : "text-indigo-700"
						}`}
					>
						Active as:
					</span>
					<button
						onClick={() => setShowProfileModal(true)}
						className={`text-sm flex items-center space-x-1 ${
							darkMode
								? "text-white bg-gray-600"
								: "text-indigo-900 bg-indigo-200"
						} px-2 py-1 rounded-full`}
					>
						<span>{username}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>

				<div>
					<button
						onClick={addNewNote}
						className={`${
							darkMode
								? "bg-gray-600 hover:bg-gray-500"
								: "bg-indigo-500 hover:bg-indigo-600"
						} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 mr-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						New Note
					</button>
				</div>
			</div>

			{/* Note color picker panel */}
			{showFormatPanel && (
				<div
					className={`p-3 ${darkMode ? "bg-gray-700" : "bg-white"} border-b ${
						darkMode ? "border-gray-600" : "border-gray-200"
					}`}
				>
					<p
						className={`text-xs mb-2 ${
							darkMode ? "text-gray-300" : "text-gray-500"
						}`}
					>
						Note Color:
					</p>
					<div className="flex flex-wrap gap-2">
						{noteColors.map((color) => (
							<button
								key={color.value}
								onClick={() => changeNoteColor(color.value)}
								className={`w-8 h-8 rounded-full border ${
									activeNote?.color === color.value
										? "ring-2 ring-offset-2 ring-indigo-500"
										: ""
								}`}
								style={{ backgroundColor: color.value }}
								title={color.name}
								aria-label={`Set note color to ${color.name}`}
							/>
						))}
					</div>
				</div>
			)}

			{/* Tags modal */}
			{showTagsModal && (
				<div
					className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10`}
				>
					<div
						className={`rounded-lg w-full max-w-md p-4 ${
							darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
						}`}
					>
						<h3 className="text-lg font-bold mb-2">Manage Tags</h3>

						{/* Add new tag */}
						<div className="flex mb-4">
							<input
								type="text"
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
								placeholder="Add a tag..."
								className={`flex-grow px-3 py-2 rounded-l border ${
									darkMode
										? "bg-gray-700 border-gray-600 text-white"
										: "bg-white border-gray-300 text-gray-800"
								} focus:outline-none focus:ring-1 focus:ring-indigo-500`}
								onKeyPress={(e) => e.key === "Enter" && addTagToNote()}
							/>
							<button
								onClick={addTagToNote}
								className="px-4 py-2 rounded-r bg-indigo-600 text-white hover:bg-indigo-700"
							>
								Add
							</button>
						</div>

						{/* Current tags */}
						<div className="mb-4">
							<p
								className={`text-sm font-medium mb-2 ${
									darkMode ? "text-gray-300" : "text-gray-600"
								}`}
							>
								Current Tags:
							</p>
							<div className="flex flex-wrap gap-2">
								{activeNote?.tags?.map((tag) => (
									<div
										key={tag}
										className={`flex items-center px-2 py-1 rounded-full text-xs ${
											darkMode
												? "bg-gray-700 text-gray-200"
												: "bg-gray-200 text-gray-800"
										}`}
									>
										{tag}
										<button
											onClick={() => removeTagFromNote(tag)}
											className="ml-1 text-gray-500 hover:text-gray-700"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
								))}
								{(!activeNote?.tags || activeNote.tags.length === 0) && (
									<span
										className={`text-xs italic ${
											darkMode ? "text-gray-400" : "text-gray-500"
										}`}
									>
										No tags yet
									</span>
								)}
							</div>
						</div>

						<div className="flex justify-end">
							<button
								onClick={() => setShowTagsModal(false)}
								className={`px-4 py-2 rounded ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600"
										: "bg-gray-200 hover:bg-gray-300"
								}`}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Note tabs - Scrollable for mobile */}
			<div
				className={`overflow-x-auto ${
					darkMode ? "bg-gray-800" : "bg-white"
				} shadow-sm`}
			>
				<div className="flex space-x-1 p-2 min-w-max">
					{sortedNotes.map((note) => (
						<button
							key={note.id}
							onClick={() => setActiveNoteId(note.id)}
							className={`flex items-center px-3 py-2 rounded-md text-sm ${
								note.id === activeNoteId
									? darkMode
										? "bg-indigo-600 text-white"
										: "bg-indigo-500 text-white"
									: darkMode
									? "bg-gray-700 text-gray-200 hover:bg-gray-600"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}
						>
							{note.isPinned && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3 w-3 mr-1"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
								</svg>
							)}
							{note.title || `Note ${note.id.slice(-4)}`}
							{note.editors.length > 1 && (
								<span className="ml-1 text-xs">({note.editors.length})</span>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Active users */}
			{activeUsers.length > 1 && (
				<div
					className={`${
						darkMode
							? "bg-gray-700 border-gray-600"
							: "bg-gray-100 border-gray-200"
					} px-3 py-2 border-t border-b`}
				>
					<div className="flex items-center space-x-2 overflow-x-auto">
						<span
							className={`text-xs ${
								darkMode ? "text-gray-400" : "text-gray-500"
							} whitespace-nowrap`}
						>
							Active:
						</span>
						{activeUsers.map((user) => (
							<div
								key={user.id}
								className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
									user.isTyping
										? darkMode
											? "bg-green-800 text-green-100"
											: "bg-green-100 text-green-800"
										: darkMode
										? "bg-gray-600 text-gray-200"
										: "bg-gray-200 text-gray-800"
								}`}
							>
								{user.name}
								{user.isTyping && (
									<span className="inline-block ml-1 animate-pulse">✎</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{activeNote && (
				<>
					{/* Title input */}
					<div
						className={`px-3 py-2 ${
							darkMode
								? "bg-gray-800 border-gray-700"
								: "bg-white border-gray-200"
						} border-b`}
					>
						<input
							type="text"
							value={activeNote.title}
							onChange={handleTitleChange}
							placeholder="Note title"
							className={`w-full font-bold text-lg border-0 focus:outline-none px-0 ${
								darkMode
									? "bg-gray-800 text-white placeholder-gray-500"
									: "bg-white text-gray-900 placeholder-gray-400"
							}`}
						/>
						<div className="flex flex-wrap justify-between text-xs mt-1">
							<span className={darkMode ? "text-gray-400" : "text-gray-500"}>
								Last edited: {formatTime(activeNote.lastEdited)}
							</span>

							<div className="flex flex-wrap gap-1 items-center">
								{activeNote.tags && activeNote.tags.length > 0 && (
									<>
										<span
											className={darkMode ? "text-gray-400" : "text-gray-500"}
										>
											Tags:
										</span>
										{activeNote.tags.map((tag) => (
											<span
												key={tag}
												className={`inline-block px-1.5 py-0.5 rounded-sm text-xs ${
													darkMode
														? "bg-gray-700 text-gray-300"
														: "bg-gray-200 text-gray-700"
												}`}
											>
												{tag}
											</span>
										))}
									</>
								)}
							</div>
						</div>
					</div>

					{/* Editor */}
					<div className="flex-grow overflow-hidden p-3 relative">
						<textarea
							ref={editorRef}
							value={activeNote.content}
							onChange={handleContentChange}
							placeholder="Start typing your note here..."
							className={`w-full h-full resize-none rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
								darkMode
									? "bg-gray-700 text-gray-100 placeholder-gray-500 border border-gray-600"
									: `border ${
											activeNote.color ? "bg-opacity-50" : "bg-white"
									  } text-gray-900`
							}`}
							style={{
								direction: "ltr",
								backgroundColor:
									!darkMode && activeNote.color ? activeNote.color : undefined,
							}}
						></textarea>
					</div>
				</>
			)}

			{/* Share Modal */}
			{showShareModal && (
				<div
					className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10`}
				>
					<div
						className={`rounded-lg w-full max-w-md p-4 ${
							darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
						}`}
					>
						<h3 className="text-lg font-bold mb-4">Share Note</h3>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Shareable Link
							</label>
							<div className="flex">
								<input
									type="text"
									value={`https://notes.example.com/${activeNote?.id}`}
									readOnly
									className={`flex-grow px-3 py-2 rounded-l border ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-800"
									} focus:outline-none`}
								/>
								<button
									onClick={() => {
										navigator.clipboard.writeText(
											`https://notes.example.com/${activeNote?.id}`
										);
										setLinkCopied(true);
										setTimeout(() => setLinkCopied(false), 2000);
									}}
									className="px-3 py-2 rounded-r bg-indigo-600 text-white"
								>
									{linkCopied ? "Copied!" : "Copy"}
								</button>
							</div>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Permissions
							</label>
							<div className="flex items-center mb-2">
								<input
									type="radio"
									id="view"
									name="permission"
									value="view"
									checked={sharePermission === "view"}
									onChange={() => setSharePermission("view")}
									className="mr-2"
								/>
								<label htmlFor="view">View only</label>
							</div>
							<div className="flex items-center mb-2">
								<input
									type="radio"
									id="comment"
									name="permission"
									value="comment"
									checked={sharePermission === "comment"}
									onChange={() => setSharePermission("comment")}
									className="mr-2"
								/>
								<label htmlFor="comment">Can comment</label>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									id="edit"
									name="permission"
									value="edit"
									checked={sharePermission === "edit"}
									onChange={() => setSharePermission("edit")}
									className="mr-2"
								/>
								<label htmlFor="edit">Can edit</label>
							</div>
						</div>

						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setShowShareModal(false)}
								className={`px-4 py-2 rounded ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600"
										: "bg-gray-200 hover:bg-gray-300"
								}`}
							>
								Cancel
							</button>
							<button
								onClick={() => {
									setShowShareModal(false);
									// Implement share functionality
								}}
								className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
							>
								Share
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Offline status indicator */}
			{isOffline && (
				<div
					className={`fixed top-0 left-0 right-0 p-2 text-center text-sm bg-yellow-500 text-yellow-900 z-10`}
				>
					You're offline. Changes will be synced when you reconnect.
				</div>
			)}

			{/* Expanded menu */}
			{expandedMenu && (
				<div
					className={`fixed inset-0 bg-black bg-opacity-50 flex justify-end z-20`}
					onClick={() => setExpandedMenu(false)}
				>
					<div
						className={`w-64 h-full ${
							darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
						} shadow-lg overflow-y-auto`}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-4 border-b border-gray-200 dark:border-gray-700">
							<h3 className="font-bold text-lg">Menu</h3>
						</div>

						<div className="p-2">
							<button
								onClick={() => {
									setShowProfileModal(true);
									setExpandedMenu(false);
								}}
								className={`w-full text-left p-3 rounded mb-1 flex items-center ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Profile
							</button>

							<button
								onClick={() => {
									setShowSearch(!showSearch);
									setExpandedMenu(false);
								}}
								className={`w-full text-left p-3 rounded mb-1 flex items-center ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
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
								Search
							</button>

							<button
								onClick={() => {
									setDarkMode(!darkMode);
									localStorage.setItem("darkMode", (!darkMode).toString());
									setExpandedMenu(false);
								}}
								className={`w-full text-left p-3 rounded mb-1 flex items-center ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									{darkMode ? (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									) : (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
										/>
									)}
								</svg>
								{darkMode ? "Light Mode" : "Dark Mode"}
							</button>

							<button
								onClick={() => {
									setShowTemplatesModal(true);
									setExpandedMenu(false);
								}}
								className={`w-full text-left p-3 rounded mb-1 flex items-center ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
									/>
								</svg>
								Templates
							</button>

							<div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

							<button
								onClick={() => {
									// Implement export to PDF functionality
									setExpandedMenu(false);
								}}
								className={`w-full text-left p-3 rounded mb-1 flex items-center ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								Export as PDF
							</button>

							<button
								onClick={() => {
									// Implement logout functionality
									setExpandedMenu(false);
								}}
								className={`w-full text-left p-3 rounded mb-1 flex items-center ${
									darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Log Out
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Search panel */}
			{showSearch && (
				<div
					className={`fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 px-4 z-10`}
				>
					<div
						className={`rounded-lg w-full max-w-md p-4 ${
							darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
						}`}
					>
						<div className="mb-4">
							<div className="flex items-center mb-4">
								<input
									type="text"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder="Search notes..."
									className={`flex-grow px-3 py-2 rounded-l border ${
										darkMode
											? "bg-gray-700 border-gray-600 text-white"
											: "bg-white border-gray-300 text-gray-800"
									} focus:outline-none`}
									autoFocus
								/>
								<button
									onClick={() => searchNotes(notes, searchTerm)}
									className="px-3 py-2 rounded-r bg-indigo-600 text-white"
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
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</button>
							</div>

							{/* Search results */}
							<div className="max-h-80 overflow-y-auto">
								{searchResults.length > 0 ? (
									searchResults.map((note) => (
										<div
											key={note.id}
											className={`mb-2 p-3 rounded cursor-pointer ${
												darkMode
													? "bg-gray-700 hover:bg-gray-600"
													: "bg-gray-100 hover:bg-gray-200"
											}`}
											onClick={() => {
												setActiveNoteId(note.id);
												setShowSearch(false);
											}}
										>
											<div className="font-medium">{note.title}</div>
											<div className="text-xs opacity-70 mt-1">
												Last edited: {formatTime(note.lastEdited)}
											</div>
										</div>
									))
								) : searchTerm ? (
									<div className="text-center py-6 opacity-70">
										No matching notes found
									</div>
								) : null}
							</div>
						</div>

						<div className="flex justify-end">
							<button
								onClick={() => setShowSearch(false)}
								className={`px-4 py-2 rounded ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600"
										: "bg-gray-200 hover:bg-gray-300"
								}`}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Mobile Bottom Toolbar */}
			<div
				className={`fixed bottom-0 left-0 right-0 border-t ${
					darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
				} flex items-center justify-around py-3 z-10`}
			>
				<button
					onClick={() => setExpandedMenu(true)}
					className={`p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
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

				<button
					onClick={() => setShowSearch(true)}
					className={`p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
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
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>

				<button
					onClick={addNewNote}
					className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full h-12 w-12 flex items-center justify-center"
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>

				<button
					onClick={() => {
						if (activeNote) {
							setPinnedNotes((prev) => {
								// If already pinned, unpin it
								if (prev.includes(activeNote.id)) {
									return prev.filter((id) => id !== activeNote.id);
								}
								// Otherwise pin it
								return [...prev, activeNote.id];
							});
						}
					}}
					className={`p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
					disabled={!activeNote}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill={
							activeNote && pinnedNotes.includes(activeNote.id)
								? "currentColor"
								: "none"
						}
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
						/>
					</svg>
				</button>

				<button
					onClick={() => {
						if (activeNote) {
							setShowShareModal(true);
						}
					}}
					className={`p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
					disabled={!activeNote}
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
							d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.48-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
						/>
					</svg>
				</button>
			</div>

			{/* Existing modals and other UI components... */}
		</div>
	);
};

export default MobileNotesApp;
