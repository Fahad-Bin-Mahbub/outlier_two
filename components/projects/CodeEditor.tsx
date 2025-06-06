"use client";
import React, { useState, useRef, useEffect } from "react";

interface FileData {
	name: string;
	language: string;
	content: string;
	formatted?: boolean;
}

interface FileTreeItem {
	name: string;
	type: "file" | "folder";
	language?: string;
	children?: FileTreeItem[];
	expanded?: boolean;
	path: string;
}

interface ErrorItem {
	line: number;
	message: string;
	type: "error" | "warning";
}

const CodeEditor: React.FC = () => {
	const [isDark, setIsDark] = useState<boolean>(true);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const [errors, setErrors] = useState<ErrorItem[]>([]);
	const [isEditing, setIsEditing] = useState<boolean>(true);
	const [showErrorDetails, setShowErrorDetails] = useState<boolean>(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const highlightRef = useRef<HTMLDivElement>(null);
	const lastScrollY = useRef<number>(0);

	const [tabsVisible, setTabsVisible] = useState<boolean>(true);

	const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
		null
	);
	const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
		null
	);
	const [isSwipeActive, setIsSwipeActive] = useState<boolean>(false);
	const tabsRef = useRef<HTMLDivElement>(null);

	const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
	const [saveStatus, setSaveStatus] = useState<"saving" | "success" | "error">(
		"success"
	);

	const [showNewFileModal, setShowNewFileModal] = useState<boolean>(false);
	const [newFileName, setNewFileName] = useState<string>("");
	const [selectedPath, setSelectedPath] = useState<string>("");

	const [fileTree, setFileTree] = useState<FileTreeItem[]>([
		{
			name: "src",
			type: "folder",
			expanded: true,
			path: "src",
			children: [
				{
					name: "components",
					type: "folder",
					expanded: true,
					path: "src/components",
					children: [
						{
							name: "component.tsx",
							type: "file",
							language: "typescript",
							path: "src/components/component.tsx",
						},
						{
							name: "Button.tsx",
							type: "file",
							language: "typescript",
							path: "src/components/Button.tsx",
						},
					],
				},
				{
					name: "utils",
					type: "folder",
					expanded: false,
					path: "src/utils",
					children: [
						{
							name: "helpers.js",
							type: "file",
							language: "javascript",
							path: "src/utils/helpers.js",
						},
						{
							name: "constants.js",
							type: "file",
							language: "javascript",
							path: "src/utils/constants.js",
						},
					],
				},
				{
					name: "app.js",
					type: "file",
					language: "javascript",
					path: "src/app.js",
				},
				{
					name: "index.js",
					type: "file",
					language: "javascript",
					path: "src/index.js",
				},
			],
		},
		{
			name: "styles",
			type: "folder",
			expanded: true,
			path: "styles",
			children: [
				{
					name: "styles.css",
					type: "file",
					language: "css",
					path: "styles/styles.css",
				},
				{
					name: "globals.css",
					type: "file",
					language: "css",
					path: "styles/globals.css",
				},
			],
		},
		{
			name: "api",
			type: "folder",
			expanded: false,
			path: "api",
			children: [
				{
					name: "api.py",
					type: "file",
					language: "python",
					path: "api/api.py",
				},
				{
					name: "routes.py",
					type: "file",
					language: "python",
					path: "api/routes.py",
				},
			],
		},
		{
			name: "config.json",
			type: "file",
			language: "json",
			path: "config.json",
		},
		{
			name: "README.md",
			type: "file",
			language: "markdown",
			path: "README.md",
		},
	]);

	const [files, setFiles] = useState<FileData[]>([
		{
			name: "app.js",
			language: "javascript",
			content: `// Modern JavaScript Example
const app = {
  init() {
    console.log('App initialized');
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM ready');
    });
  }
};

app.init();`,
		},
		{
			name: "styles.css",
			language: "css",
			content: `/* Modern CSS with Grid & Flexbox */
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;
  padding: 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}`,
		},
		{
			name: "component.tsx",
			language: "typescript",
			content: `// TypeScript React Component
interface Props {
  title: string;
  count: number;
}

const Component: React.FC<Props> = ({ title, count }) => {
  const [state, setState] = useState<number>(0);
  
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return (
    <div className="component">
      <h2>{title}</h2>
      <p>Count: {count}</p>
    </div>
  );
};

export default Component;`,
		},
		{
			name: "api.py",
			language: "python",
			content: `# Python API Example
from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route('/api/data')
def get_data():
    data = {
        'message': 'Hello World',
        'status': 'success',
        'items': [1, 2, 3, 4]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)`,
		},
		{
			name: "config.json",
			language: "json",
			content: `{
  "name": "mobile-editor",
  "version": "1.0.0",
  "settings": {
    "theme": "dark",
    "fontSize": 14,
    "tabSize": 2
  },
  "features": [
    "syntax-highlighting",
    "error-detection",
    "mobile-optimized"
  ]
}`,
		},
		{
			name: "README.md",
			language: "markdown",
			content: `# Mobile Code Editor

A clean, minimal code editor optimized for mobile devices.

## Features

- **Syntax Highlighting** - Support for 6+ languages
- **Error Detection** - Real-time error checking
- **Mobile First** - Touch-optimized interface
- **Dark/Light Theme** - Easy theme switching

## Supported Languages

- JavaScript/TypeScript
- CSS/SCSS  
- Python
- JSON
- Markdown
- HTML

> Simple, clean, and efficient.`,
		},
	]);

	const updateFileContent = (newContent: string) => {
		const updatedFiles = [...files];
		updatedFiles[activeTab].content = newContent;
		setFiles(updatedFiles);
	};

	const handleSave = () => {
		setSaveStatus("saving");
		setShowSaveModal(true);

		setTimeout(() => {
			try {
				localStorage.setItem("editor-files", JSON.stringify(files));
				setSaveStatus("success");
			} catch (error) {
				setSaveStatus("error");
			}
		}, 800);
	};

	const closeSaveModal = () => {
		setShowSaveModal(false);
	};

	const handleFormat = () => {
		const currentFile = files[activeTab];

		if (currentFile.formatted) return;

		let formattedContent = currentFile.content;

		if (
			currentFile.language === "javascript" ||
			currentFile.language === "typescript"
		) {
			formattedContent = formattedContent
				.replace(/;\s*}/g, ";\n}")
				.replace(/{\s*/g, "{\n  ")
				.replace(/}\s*/g, "\n}")
				.replace(/,\s*/g, ",\n  ");
		} else if (currentFile.language === "css") {
			formattedContent = formattedContent
				.replace(/{\s*/g, " {\n  ")
				.replace(/;\s*/g, ";\n  ")
				.replace(/}\s*/g, "\n}\n");
		} else if (currentFile.language === "json") {
			try {
				const parsed = JSON.parse(formattedContent);
				formattedContent = JSON.stringify(parsed, null, 2);
			} catch (e) {
				alert("Invalid JSON format");
				return;
			}
		}

		const updatedFiles = [...files];
		updatedFiles[activeTab].content = formattedContent;
		updatedFiles[activeTab].formatted = true;
		setFiles(updatedFiles);
	};

	const toggleEditMode = () => {
		setIsEditing(!isEditing);
		if (!isEditing && textareaRef.current) {
			setTimeout(() => textareaRef.current?.focus(), 100);
		}
	};

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const updatedFiles = [...files];
		updatedFiles[activeTab].content = e.target.value;
		updatedFiles[activeTab].formatted = false;
		setFiles(updatedFiles);
	};

	const handleTextareaScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
		if (highlightRef.current && textareaRef.current) {
			highlightRef.current.scrollTop = textareaRef.current.scrollTop;
			highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;

			const currentScrollY = textareaRef.current.scrollTop;
			const scrollThreshold = 50;

			if (
				currentScrollY > lastScrollY.current &&
				currentScrollY > scrollThreshold &&
				tabsVisible
			) {
				setTabsVisible(false);
			}

			lastScrollY.current = currentScrollY;
		}
	};

	const showTabs = () => {
		setTabsVisible(true);
	};

	const toggleFolder = (targetPath: string) => {
		const updateTree = (items: FileTreeItem[]): FileTreeItem[] => {
			return items.map((item) => {
				if (item.path === targetPath && item.type === "folder") {
					return { ...item, expanded: !item.expanded };
				}
				if (item.children) {
					return { ...item, children: updateTree(item.children) };
				}
				return item;
			});
		};
		setFileTree(updateTree(fileTree));
	};

	const openNewFileModal = (folderPath: string = "") => {
		setNewFileName("");
		setSelectedPath(folderPath);
		setShowNewFileModal(true);
	};

	const createNewFile = () => {
		if (!newFileName || !newFileName.trim()) {
			return;
		}

		const fileName = newFileName.trim();
		const extension = fileName.split(".").pop()?.toLowerCase() || "";
		const languageMap: Record<string, string> = {
			js: "javascript",
			ts: "typescript",
			tsx: "typescript",
			jsx: "javascript",
			css: "css",
			scss: "css",
			py: "python",
			json: "json",
			md: "markdown",
			html: "html",
		};

		const language = languageMap[extension] || "text";
		const newFile: FileData = {
			name: fileName,
			language,
			content: `// New ${language} file\n\n`,
			formatted: false,
		};

		const updatedFiles = [...files, newFile];
		setFiles(updatedFiles);
		setActiveTab(updatedFiles.length - 1);

		if (selectedPath) {
			const addFileToTree = (items: FileTreeItem[]): FileTreeItem[] => {
				return items.map((item) => {
					if (item.path === selectedPath && item.type === "folder") {
						const newFilePath = `${selectedPath}/${fileName}`;
						const newFileItem: FileTreeItem = {
							name: fileName,
							type: "file",
							language,
							path: newFilePath,
						};

						return {
							...item,
							expanded: true,
							children: [...(item.children || []), newFileItem],
						};
					}

					if (item.children) {
						return {
							...item,
							children: addFileToTree(item.children),
						};
					}

					return item;
				});
			};

			setFileTree(addFileToTree(fileTree));
		} else {
			const newFileItem: FileTreeItem = {
				name: fileName,
				type: "file",
				language,
				path: fileName,
			};

			setFileTree([...fileTree, newFileItem]);
		}

		setShowNewFileModal(false);
	};

	const handleFileSelect = (filePath: string) => {
		const fileName = filePath.split("/").pop() || "";

		const fileIndex = files.findIndex((f) => f.name === fileName);

		if (fileIndex !== -1) {
			setActiveTab(fileIndex);
		} else {
			const extension = fileName.split(".").pop()?.toLowerCase() || "";
			const languageMap: Record<string, string> = {
				js: "javascript",
				ts: "typescript",
				tsx: "typescript",
				jsx: "javascript",
				css: "css",
				scss: "css",
				py: "python",
				json: "json",
				md: "markdown",
				html: "html",
			};

			const language = languageMap[extension] || "text";
			const newFile: FileData = {
				name: fileName,
				language,
				content: `// Empty ${language} file\n\n`,
				formatted: false,
			};

			const updatedFiles = [...files, newFile];
			setFiles(updatedFiles);
			setActiveTab(updatedFiles.length - 1);
		}

		setSidebarOpen(false);
	};

	const renderFileTree = (
		items: FileTreeItem[],
		depth: number = 0
	): JSX.Element[] => {
		return items.map((item, index) => (
			<div key={`${item.path}-${index}`}>
				<div
					className={`flex items-center py-1.5 px-2 ${
						item.type === "folder" ? "font-medium" : ""
					} cursor-pointer rounded-sm ${
						isDark ? "hover:bg-gray-800/70" : "hover:bg-gray-100"
					} transition-colors`}
					style={{ paddingLeft: `${depth * 12 + 12}px` }}
					onClick={() => {
						if (item.type === "folder") {
							toggleFolder(item.path);
						} else {
							handleFileSelect(item.path);
						}
					}}
				>
					<div className="flex items-center w-full">
						{item.type === "folder" ? (
							<span
								className={`flex items-center justify-center w-4 h-4 mr-1.5 text-xs 
                ${isDark ? "text-gray-400" : "text-gray-500"} 
                transition-transform duration-200 ${
									item.expanded ? "rotate-0" : "-rotate-90"
								}`}
							>
								▼
							</span>
						) : (
							<span
								className={`w-2 h-2 mr-2 ml-1 rounded-full ${
									item.language === "javascript"
										? "bg-yellow-400"
										: item.language === "typescript"
										? "bg-blue-500"
										: item.language === "css"
										? "bg-blue-600"
										: item.language === "python"
										? "bg-blue-700"
										: item.language === "json"
										? "bg-gray-600"
										: item.language === "markdown"
										? "bg-blue-800"
										: "bg-gray-400"
								}`}
							/>
						)}

						<span
							className={`truncate text-sm ${
								item.type === "folder"
									? isDark
										? "text-gray-200"
										: "text-gray-700"
									: isDark
									? "text-gray-300"
									: "text-gray-600"
							}`}
						>
							{item.name}
						</span>
					</div>
				</div>

				{item.type === "folder" && (
					<div className={`relative ${item.expanded ? "block" : "hidden"}`}>
						<div
							className={`absolute left-5 top-0 bottom-0 w-px ${
								isDark ? "bg-gray-700" : "bg-gray-300"
							}`}
						></div>
						<div className="pl-2">
							{renderFileTree(item.children || [], depth + 1)}
							<div
								className={`flex items-center py-1 px-2 text-xs ${
									isDark
										? "text-gray-500 hover:text-gray-300 hover:bg-gray-800/60"
										: "text-gray-400 hover:text-gray-600 hover:bg-gray-100/80"
								} cursor-pointer rounded-sm transition-colors`}
								style={{ paddingLeft: `${(depth + 1) * 12 + 12}px` }}
								onClick={(e) => {
									e.stopPropagation();
									openNewFileModal(item.path);
								}}
							>
								<span className="mr-1.5 text-xs">+</span>
								<span>Add file</span>
							</div>
						</div>
					</div>
				)}
			</div>
		));
	};

	const goToErrorLine = (lineNumber: number) => {
		if (textareaRef.current) {
			const textarea = textareaRef.current;
			const lines = textarea.value.split("\n");
			let charPosition = 0;

			for (let i = 0; i < lineNumber - 1 && i < lines.length; i++) {
				charPosition += lines[i].length + 1; // +1 for newline character
			}

			textarea.focus();
			textarea.setSelectionRange(
				charPosition,
				charPosition + (lines[lineNumber - 1]?.length || 0)
			);

			const lineHeight = 21;
			const scrollTop =
				(lineNumber - 1) * lineHeight - textarea.clientHeight / 2;
			textarea.scrollTop = Math.max(0, scrollTop);
		}
	};

	useEffect(() => {
		const savedFiles = localStorage.getItem("editor-files");
		if (savedFiles) {
			try {
				const parsedFiles = JSON.parse(savedFiles);
				setFiles(parsedFiles);
			} catch (e) {
				console.error("Failed to load saved files");
			}
		}
	}, []);

	const minSwipeDistance = 50;
	const maxVerticalMovement = 100;

	const onTouchStart = (e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	};

	const onTouchMove = (e: React.TouchEvent) => {
		if (!touchStart) return;

		const currentTouch = {
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		};

		setTouchEnd(currentTouch);

		const deltaX = Math.abs(currentTouch.x - touchStart.x);
		const deltaY = Math.abs(currentTouch.y - touchStart.y);

		const isHorizontalSwipe = deltaX > deltaY && deltaX > 20;

		if (isHorizontalSwipe && deltaY < maxVerticalMovement) {
			setIsSwipeActive(true);
		}
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) {
			setIsSwipeActive(false);
			return;
		}

		const distanceX = touchStart.x - touchEnd.x;
		const distanceY = Math.abs(touchStart.y - touchEnd.y);
		const isLeftSwipe = distanceX > minSwipeDistance;
		const isRightSwipe = distanceX < -minSwipeDistance;

		if (distanceY < maxVerticalMovement) {
			if (isLeftSwipe && activeTab < files.length - 1) {
				setActiveTab(activeTab + 1);

				if (typeof navigator !== "undefined" && navigator.vibrate) {
					navigator.vibrate(10);
				}
			} else if (isRightSwipe && activeTab > 0) {
				setActiveTab(activeTab - 1);

				if (typeof navigator !== "undefined" && navigator.vibrate) {
					navigator.vibrate(10);
				}
			}
		}

		setIsSwipeActive(false);
		setTouchStart(null);
		setTouchEnd(null);
	};

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl/Cmd + S to save
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault();
				handleSave();
			}
			// Escape to close save modal
			if (e.key === "Escape" && showSaveModal) {
				e.preventDefault();
				closeSaveModal();
			}
			// Escape to close new file modal
			if (e.key === "Escape" && showNewFileModal) {
				e.preventDefault();
				setShowNewFileModal(false);
			}
			// Ctrl/Cmd + T to toggle tabs
			if ((e.ctrlKey || e.metaKey) && e.key === "t") {
				e.preventDefault();
				setTabsVisible(!tabsVisible);
			}
			// Ctrl/Cmd + Shift + F to format
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
				e.preventDefault();
				handleFormat();
			}
			// Ctrl/Cmd + E to toggle edit mode
			if ((e.ctrlKey || e.metaKey) && e.key === "e") {
				e.preventDefault();
				toggleEditMode();
			}
			// Ctrl/Cmd + B to toggle sidebar
			if ((e.ctrlKey || e.metaKey) && e.key === "b") {
				e.preventDefault();
				setSidebarOpen(!sidebarOpen);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [sidebarOpen, isEditing, showSaveModal, tabsVisible, showNewFileModal]);

	useEffect(() => {
		if (saveStatus === "success" && showSaveModal) {
			const timer = setTimeout(() => {
				closeSaveModal();
			}, 3000); // Auto-close after 3 seconds
			return () => clearTimeout(timer);
		}
	}, [saveStatus, showSaveModal]);

	const closeFile = (index: number, e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent tab click event

		if (files.length === 1) {
			alert("Cannot close the last file");
			return;
		}

		const updatedFiles = files.filter((_, i) => i !== index);
		setFiles(updatedFiles);

		// Adjust active tab if necessary
		if (index === activeTab) {
			// If closing the active tab, switch to the previous tab or first tab
			setActiveTab(index > 0 ? index - 1 : 0);
		} else if (index < activeTab) {
			// If closing a tab before the active one, adjust the active tab index
			setActiveTab(activeTab - 1);
		}
	};

	// Get language icon
	const getLanguageIcon = (language: string): string => {
		const icons: Record<string, string> = {
			javascript: "JS",
			typescript: "TS",
			css: "CSS",
			python: "PY",
			json: "JSON",
			markdown: "MD",
			file: "FILE",
		};
		return icons[language] || "FILE";
	};

	// Enhanced syntax highlighting for multiple languages
	const syntaxHighlight = (code: string, language: string): string => {
		const patterns: Record<
			string,
			Array<{ pattern: RegExp; className: string }>
		> = {
			javascript: [
				{
					pattern:
						/\b(const|let|var|function|if|else|for|while|return|import|export|class|extends|async|await|try|catch|finally|throw|new|this|super|static|default|case|switch|break|continue|do)\b/g,
					className: "keyword",
				},
				{
					pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g,
					className: "literal",
				},
				{
					pattern: /\/\/.*$/gm,
					className: "comment",
				},
				{
					pattern: /\/\*[\s\S]*?\*\//g,
					className: "comment",
				},
				{
					pattern: /'([^'\\]|\\.)*'|"([^"\\]|\\.)*"|`([^`\\]|\\.)*`/g,
					className: "string",
				},
				{
					pattern: /\b\d+\.?\d*\b/g,
					className: "number",
				},
				{
					pattern:
						/\b(console|document|window|Array|Object|String|Number|Boolean|Date|Math|JSON)\b/g,
					className: "builtin",
				},
			],
			typescript: [
				{
					pattern:
						/\b(const|let|var|function|if|else|for|while|return|import|export|class|extends|async|await|interface|type|enum|namespace|module|declare|public|private|protected|readonly|static|abstract)\b/g,
					className: "keyword",
				},
				{
					pattern: /\b(string|number|boolean|any|void|never|unknown|object)\b/g,
					className: "type",
				},
				{
					pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g,
					className: "literal",
				},
				{
					pattern: /\/\/.*$/gm,
					className: "comment",
				},
				{
					pattern: /\/\*[\s\S]*?\*\//g,
					className: "comment",
				},
				{
					pattern: /'([^'\\]|\\.)*'|"([^"\\]|\\.)*"|`([^`\\]|\\.)*`/g,
					className: "string",
				},
				{
					pattern: /\b\d+\.?\d*\b/g,
					className: "number",
				},
				{
					pattern:
						/\b(React|useState|useEffect|useCallback|useMemo|FC|Component)\b/g,
					className: "builtin",
				},
			],
			css: [
				{
					pattern: /([.#@][a-zA-Z-_][a-zA-Z0-9-_]*)/g,
					className: "selector",
				},
				{
					pattern: /([a-zA-Z-]+)(\s*:)/g,
					className: "property",
				},
				{
					pattern: /\/\*[\s\S]*?\*\//g,
					className: "comment",
				},
				{
					pattern: /(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\))/g,
					className: "color",
				},
				{
					pattern: /(\d+px|\d+em|\d+rem|\d+%|\d+vh|\d+vw)/g,
					className: "unit",
				},
				{
					pattern:
						/\b(important|inherit|initial|unset|auto|none|flex|grid|block|inline|relative|absolute|fixed)\b/g,
					className: "value",
				},
			],
			python: [
				{
					pattern:
						/\b(def|class|if|else|elif|for|while|return|import|from|try|except|finally|with|as|pass|break|continue|global|nonlocal|lambda|yield|raise|assert|del|and|or|not|in|is)\b/g,
					className: "keyword",
				},
				{
					pattern: /\b(True|False|None)\b/g,
					className: "literal",
				},
				{
					pattern: /#.*$/gm,
					className: "comment",
				},
				{
					pattern:
						/'([^'\\]|\\.)*'|"([^"\\]|\\.)*"|'''[\s\S]*?'''|"""[\s\S]*?"""/g,
					className: "string",
				},
				{
					pattern: /\b\d+\.?\d*\b/g,
					className: "number",
				},
				{
					pattern:
						/\b(print|len|range|str|int|float|list|dict|tuple|set|bool|type|isinstance|hasattr|getattr|setattr)\b/g,
					className: "builtin",
				},
				{
					pattern: /\b[A-Z_][A-Z0-9_]*\b/g,
					className: "constant",
				},
			],
			json: [
				{
					pattern: /"([^"\\]|\\.)*"(?=\s*:)/g,
					className: "property",
				},
				{
					pattern: /"([^"\\]|\\.)*"(?!\s*:)/g,
					className: "string",
				},
				{
					pattern: /\b(true|false|null)\b/g,
					className: "literal",
				},
				{
					pattern: /\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g,
					className: "number",
				},
			],
			markdown: [
				{
					pattern: /^#{1,6}\s.*$/gm,
					className: "header",
				},
				{
					pattern: /\*\*([^*]+)\*\*/g,
					className: "bold",
				},
				{
					pattern: /\*([^*]+)\*/g,
					className: "italic",
				},
				{
					pattern: /`([^`]+)`/g,
					className: "code",
				},
				{
					pattern: /^>.*$/gm,
					className: "quote",
				},
				{
					pattern: /\[([^\]]+)\]\(([^)]+)\)/g,
					className: "link",
				},
				{
					pattern: /!\[([^\]]*)\]\(([^)]+)\)/g,
					className: "image",
				},
			],
		};

		let highlighted = code
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");

		if (patterns[language]) {
			patterns[language].forEach(({ pattern, className }) => {
				highlighted = highlighted.replace(pattern, (match) => {
					return `<span class="syntax-${className}">${match}</span>`;
				});
			});
		}

		return highlighted;
	};

	// Enhanced error checking for multiple languages with better logic
	useEffect(() => {
		const checkErrors = (): void => {
			const newErrors: ErrorItem[] = [];
			const currentFile = files[activeTab];
			const lines = currentFile.content.split("\n");

			// JSON validation - check entire content at once
			if (currentFile.language === "json") {
				try {
					if (currentFile.content.trim()) {
						JSON.parse(currentFile.content);
					}
				} catch (e) {
					const error = e as Error;
					// Try to extract line number from error message
					const lineMatch = error.message.match(/line (\d+)/i);
					const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 1;

					newErrors.push({
						line: lineNumber,
						message: `JSON syntax error: ${error.message}`,
						type: "error",
					});
				}
			}

			lines.forEach((line: string, index: number) => {
				const trimmedLine = line.trim();
				const lineNumber = index + 1;

				// Skip empty lines
				if (!trimmedLine) return;

				// JavaScript/TypeScript errors
				if (
					currentFile.language === "javascript" ||
					currentFile.language === "typescript"
				) {
					// Skip comments
					if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*"))
						return;

					// Missing semicolon for simple statements
					if (
						(trimmedLine.startsWith("const ") ||
							trimmedLine.startsWith("let ") ||
							trimmedLine.startsWith("var ") ||
							trimmedLine.includes("console.log(")) &&
						!trimmedLine.endsWith(";") &&
						!trimmedLine.endsWith("{") &&
						!trimmedLine.endsWith(",")
					) {
						newErrors.push({
							line: lineNumber,
							message: "Missing semicolon",
							type: "warning",
						});
					}

					// Check for unbalanced braces
					const openBraces = (trimmedLine.match(/\{/g) || []).length;
					const closeBraces = (trimmedLine.match(/\}/g) || []).length;

					if (openBraces > closeBraces) {
						// Count braces in the rest of the file to see if they're balanced overall
						const remainingLines = lines.slice(index + 1);
						const remainingOpenBraces =
							remainingLines.join("").split("{").length - 1;
						const remainingCloseBraces =
							remainingLines.join("").split("}").length - 1;

						if (remainingCloseBraces < openBraces - closeBraces) {
							newErrors.push({
								line: lineNumber,
								message: "Unclosed brace '{'",
								type: "error",
							});
						}
					} else if (closeBraces > openBraces) {
						// Check if there are unmatched closing braces
						const previousLines = lines.slice(0, index);
						const previousOpenBraces =
							previousLines.join("").split("{").length - 1;
						const previousCloseBraces =
							previousLines.join("").split("}").length - 1;

						if (
							previousOpenBraces <
							previousCloseBraces + (closeBraces - openBraces)
						) {
							newErrors.push({
								line: lineNumber,
								message: "Unexpected closing brace '}'",
								type: "error",
							});
						}
					}

					// Check for unbalanced parentheses
					const openParens = (trimmedLine.match(/\(/g) || []).length;
					const closeParens = (trimmedLine.match(/\)/g) || []).length;

					if (openParens > closeParens && !trimmedLine.includes("//")) {
						newErrors.push({
							line: lineNumber,
							message: "Unclosed parenthesis '('",
							type: "error",
						});
					} else if (closeParens > openParens && !trimmedLine.includes("//")) {
						newErrors.push({
							line: lineNumber,
							message: "Unexpected closing parenthesis ')'",
							type: "error",
						});
					}

					// Check for unbalanced brackets
					const openBrackets = (trimmedLine.match(/\[/g) || []).length;
					const closeBrackets = (trimmedLine.match(/\]/g) || []).length;

					if (openBrackets > closeBrackets && !trimmedLine.includes("//")) {
						newErrors.push({
							line: lineNumber,
							message: "Unclosed bracket '['",
							type: "error",
						});
					} else if (
						closeBrackets > openBrackets &&
						!trimmedLine.includes("//")
					) {
						newErrors.push({
							line: lineNumber,
							message: "Unexpected closing bracket ']'",
							type: "error",
						});
					}

					// Check for unclosed strings (basic)
					const quotes = (trimmedLine.match(/"/g) || []).length;
					if (quotes % 2 !== 0 && !trimmedLine.includes("//")) {
						newErrors.push({
							line: lineNumber,
							message: "Unclosed string literal",
							type: "error",
						});
					}

					// Check for common typos
					if (trimmedLine.includes("cosole.")) {
						newErrors.push({
							line: lineNumber,
							message: "Did you mean 'console'?",
							type: "error",
						});
					}

					// Undefined variable check (basic)
					if (
						trimmedLine.includes("undefined") &&
						!trimmedLine.includes("===") &&
						!trimmedLine.includes("typeof")
					) {
						newErrors.push({
							line: lineNumber,
							message: "Potential undefined variable usage",
							type: "warning",
						});
					}
				}

				// CSS errors
				if (currentFile.language === "css") {
					// Skip comments and selectors
					if (
						trimmedLine.startsWith("/*") ||
						trimmedLine.startsWith(".") ||
						trimmedLine.startsWith("#") ||
						trimmedLine.startsWith("@")
					)
						return;

					// Missing semicolon in property declarations
					if (
						trimmedLine.includes(":") &&
						!trimmedLine.includes(";") &&
						!trimmedLine.includes("{") &&
						!trimmedLine.includes("}")
					) {
						newErrors.push({
							line: lineNumber,
							message: "Missing semicolon in CSS property",
							type: "warning",
						});
					}
				}

				// Python errors
				if (currentFile.language === "python") {
					// Skip comments
					if (trimmedLine.startsWith("#")) return;

					// Missing colon after control structures
					if (
						(trimmedLine.startsWith("def ") ||
							trimmedLine.startsWith("class ") ||
							trimmedLine.startsWith("if ") ||
							trimmedLine.startsWith("for ") ||
							trimmedLine.startsWith("while ") ||
							trimmedLine === "else") &&
						!trimmedLine.endsWith(":") &&
						!trimmedLine.includes("#")
					) {
						newErrors.push({
							line: lineNumber,
							message: "Missing colon",
							type: "error",
						});
					}

					// Basic indentation check
					if (
						line.startsWith(" ") &&
						!line.startsWith("    ") &&
						!line.startsWith("\t")
					) {
						newErrors.push({
							line: lineNumber,
							message: "Indentation should be 4 spaces",
							type: "warning",
						});
					}
				}

				// TypeScript specific
				if (currentFile.language === "typescript") {
					// Check for 'any' type
					if (trimmedLine.includes(": any")) {
						newErrors.push({
							line: lineNumber,
							message: "Consider using a more specific type instead of 'any'",
							type: "warning",
						});
					}
				}

				// Markdown checks
				if (currentFile.language === "markdown") {
					// Empty links
					if (trimmedLine.includes("](") && trimmedLine.includes("]()")) {
						newErrors.push({
							line: lineNumber,
							message: "Empty link URL",
							type: "warning",
						});
					}

					// Images without alt text
					if (trimmedLine.includes("![") && trimmedLine.includes("![]")) {
						newErrors.push({
							line: lineNumber,
							message: "Image missing alt text",
							type: "warning",
						});
					}
				}
			});

			setErrors(newErrors);
		};

		// Debounce error checking
		const timeoutId = setTimeout(checkErrors, 300);
		return () => clearTimeout(timeoutId);
	}, [activeTab, files]);

	const currentFile = files[activeTab];

	return (
		<div
			className={`h-screen flex flex-col overflow-hidden ${
				isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
			}`}
		>
			{/* Header */}
			<div
				className={`relative z-10 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 ${
					isDark
						? "bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700"
						: "bg-gradient-to-r from-white to-gray-50 border-b border-gray-200"
				} shadow-md`}
			>
				<div
					className={`font-bold text-lg md:text-xl bg-clip-text text-transparent ${
						isDark
							? "bg-gradient-to-r from-blue-400 to-purple-500"
							: "bg-gradient-to-r from-blue-500 to-purple-600"
					} flex items-center gap-2`}
				>
					<span>◆</span>
					CodeLab Pro
				</div>
				<div className="flex gap-2">
					<button
						className={`px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-medium transition ${
							isDark
								? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
								: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
						} shadow-sm`}
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
						Files
					</button>
					<button
						className={`px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-medium transition ${
							isDark
								? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
								: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
						} shadow-sm`}
						onClick={() => setIsDark(!isDark)}
					>
						{isDark ? "Light" : "Dark"}
					</button>
				</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<div
					className={`fixed inset-0 z-50 transition-transform duration-300 transform ${
						sidebarOpen ? "translate-x-0" : "-translate-x-full"
					} md:relative md:translate-x-0 md:w-60 ${
						isDark
							? "bg-gray-900 border-r border-gray-700"
							: "bg-gray-50 border-r border-gray-200"
					}`}
					style={{ top: "56px", height: "calc(100vh - 56px)" }}
				>
					<div
						className={`flex justify-between items-center p-3 ${
							isDark ? "border-b border-gray-700" : "border-b border-gray-200"
						}`}
					>
						<div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
							Explorer
						</div>
						<button
							className={`w-5 h-5 flex items-center justify-center rounded ${
								isDark
									? "border border-gray-700 hover:bg-gray-800"
									: "border border-gray-200 hover:bg-gray-100"
							}`}
							onClick={() => openNewFileModal()}
						>
							+
						</button>
					</div>
					<div className="overflow-y-auto h-full">
						{renderFileTree(fileTree)}
						<div
							className={`flex items-center p-3 cursor-pointer ${
								isDark
									? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
									: "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
							}`}
							onClick={() => openNewFileModal()}
						>
							<span className="text-sm mr-2">+</span>
							<span className="text-sm">Add new file...</span>
						</div>
					</div>
				</div>

				{/* Editor area */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Toolbar */}
					<div
						className={`${
							isDark ? "border-b border-gray-700" : "border-b border-gray-200"
						} 
              transition-all duration-300 transform ${
								tabsVisible ? "opacity-100" : "opacity-0 h-0 -mt-10"
							}`}
					>
						<div className="flex items-center px-4 py-2">
							<button
								className={`px-2 py-1 text-xs rounded ${
									isDark
										? "hover:bg-gray-800 text-gray-400"
										: "hover:bg-gray-100 text-gray-600"
								} mr-2`}
								onClick={handleSave}
							>
								Save
							</button>
							<button
								className={`px-2 py-1 text-xs rounded ${
									isDark
										? "hover:bg-gray-800 text-gray-400"
										: "hover:bg-gray-100 text-gray-600"
								} mr-2`}
								onClick={handleFormat}
							>
								Format
							</button>
							<button
								className={`px-2 py-1 text-xs rounded ${
									isDark
										? "hover:bg-gray-800 text-gray-400"
										: "hover:bg-gray-100 text-gray-600"
								}`}
								onClick={() => setShowErrorDetails(!showErrorDetails)}
							>
								Issues ({errors.length})
							</button>
						</div>
					</div>

					{/* Current File Indicator - shows when tabs are hidden */}
					{!tabsVisible && (
						<div
							className={`fixed left-1/2 transform -translate-x-1/2 top-4 z-50 
                px-3 py-2 rounded-full ${
									isDark
										? "bg-gray-800 border border-gray-700"
										: "bg-white border border-gray-200"
								} shadow-lg backdrop-blur-md`}
						>
							<div className="flex items-center gap-2">
								<div
									className={`flex items-center justify-center w-5 h-4 text-xs font-semibold rounded text-white
                    ${
											currentFile.language === "javascript"
												? "bg-yellow-400 text-black"
												: ""
										}
                    ${
											currentFile.language === "typescript" ? "bg-blue-500" : ""
										}
                    ${currentFile.language === "css" ? "bg-blue-600" : ""}
                    ${currentFile.language === "python" ? "bg-blue-700" : ""}
                    ${currentFile.language === "json" ? "bg-gray-700" : ""}
                    ${currentFile.language === "markdown" ? "bg-blue-800" : ""}
                  `}
								>
									{getLanguageIcon(currentFile.language)}
								</div>
								<span className="max-w-[150px] truncate text-sm font-medium">
									{currentFile.name}
								</span>
								<span className="text-xs text-gray-500">
									({activeTab + 1}/{files.length})
								</span>
							</div>
						</div>
					)}

					{/* Floating Toolbar - appears when tabs/toolbar are hidden */}
					{!tabsVisible && (
						<div
							className={`fixed top-16 right-4 z-50 p-2 rounded-3xl flex flex-col gap-1.5 
                ${
									isDark
										? "bg-gradient-to-b from-gray-800 to-gray-700 border border-gray-700"
										: "bg-gradient-to-b from-white to-gray-50 border border-gray-200"
								} shadow-lg backdrop-blur-md`}
						>
							<button
								className={`w-9 h-9 rounded-full flex items-center justify-center ${
									isDark
										? "bg-gradient-to-r from-green-600 to-green-500 text-white"
										: "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
								}`}
								onClick={showTabs}
								title="Show tabs and toolbar"
							>
								<span className="text-sm">▲</span>
							</button>
							<button
								className={`w-9 h-9 rounded-full flex items-center justify-center ${
									isDark
										? "hover:bg-gray-700 text-gray-300"
										: "hover:bg-gray-100 text-gray-700"
								}`}
								onClick={handleSave}
								title="Save files"
							>
								<span className="text-sm">S</span>
							</button>
							<button
								className={`w-9 h-9 rounded-full flex items-center justify-center ${
									isDark
										? "hover:bg-gray-700 text-gray-300"
										: "hover:bg-gray-100 text-gray-700"
								}`}
								onClick={handleFormat}
								title="Format code"
							>
								<span className="text-sm">F</span>
							</button>
							<button
								className={`w-9 h-9 rounded-full flex items-center justify-center relative ${
									isDark
										? "hover:bg-gray-700 text-gray-300"
										: "hover:bg-gray-100 text-gray-700"
								}`}
								onClick={() => setShowErrorDetails(!showErrorDetails)}
								title={`Issues (${errors.length})`}
							>
								<span className="text-sm">!</span>
								{errors.length > 0 && (
									<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-semibold bg-red-600 text-white rounded-full border-2 border-gray-800">
										{errors.length}
									</span>
								)}
							</button>
						</div>
					)}

					{/* Tabs */}
					<div
						className={`flex overflow-x-auto ${
							isDark ? "border-b border-gray-700" : "border-b border-gray-200"
						} 
              transition-all duration-300 transform ${
								tabsVisible ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
							}`}
						ref={tabsRef}
					>
						{files.map((file, index) => (
							<div
								key={index}
								className={`flex items-center py-3 px-4 whitespace-nowrap cursor-pointer min-w-[120px] max-w-[200px]
                  ${
										index === activeTab
											? isDark
												? "bg-gray-900 text-blue-400 border-b-2 border-blue-500"
												: "bg-white text-blue-600 border-b-2 border-blue-500"
											: isDark
											? "hover:bg-gray-800"
											: "hover:bg-gray-50"
									} ${
									isDark
										? "border-r border-gray-700"
										: "border-r border-gray-200"
								}`}
								onClick={() => setActiveTab(index)}
							>
								<span className="flex-1 truncate">{file.name}</span>
								{files.length > 1 && (
									<button
										className={`ml-2 w-5 h-5 flex items-center justify-center rounded-sm ${
											isDark
												? "text-gray-500 hover:bg-gray-700 hover:text-gray-300"
												: "text-gray-400 hover:bg-gray-200 hover:text-gray-700"
										}`}
										onClick={(e) => closeFile(index, e)}
										title="Close file"
									>
										×
									</button>
								)}
							</div>
						))}
					</div>

					{/* Code area */}
					<div
						className={`flex-1 relative overflow-hidden touch-manipulation ${
							isSwipeActive ? (isDark ? "bg-gray-900/95" : "bg-white/95") : ""
						}`}
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}
					>
						{files.length > 1 && isSwipeActive && (
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
								<div
									className={`flex items-center gap-2 ${
										isDark
											? "bg-gray-900/95 text-gray-200"
											: "bg-white/95 text-gray-800"
									} py-2 px-4 rounded-full shadow-lg backdrop-blur-md border ${
										isDark ? "border-gray-700" : "border-gray-200"
									}`}
								>
									{activeTab > 0 && (
										<span className="text-blue-500 font-bold">‹</span>
									)}
									<span className="text-sm whitespace-nowrap">
										{`${currentFile.name} (${activeTab + 1}/${files.length})`}
									</span>
									{activeTab < files.length - 1 && (
										<span className="text-blue-500 font-bold">›</span>
									)}
								</div>
							</div>
						)}

						{errors.length > 0 && (
							<div
								className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-lg cursor-pointer text-sm"
								onClick={() => setShowErrorDetails(!showErrorDetails)}
							>
								{errors.length} {errors.length === 1 ? "issue" : "issues"}
								<span className="text-xs">{showErrorDetails ? "▼" : "▲"}</span>
							</div>
						)}

						<div className={`flex h-full`}>
							{/* Line numbers */}
							<div
								className={`py-4 px-2 text-right min-w-[48px] select-none ${
									isDark
										? "bg-gray-900 text-gray-500 border-r border-gray-700"
										: "bg-gray-50 text-gray-400 border-r border-gray-200"
								} font-mono text-xs leading-relaxed`}
							>
								{currentFile.content.split("\n").map((_, index) => (
									<div
										key={index}
										className={
											errors.some((e) => e.line === index + 1)
												? "text-red-500"
												: ""
										}
									>
										{index + 1}
									</div>
								))}
							</div>

							{/* Code editor */}
							<div className="flex-1 relative overflow-hidden min-h-0">
								{/* Highlighted Code Background */}
								<div
									ref={highlightRef}
									className={`absolute inset-0 p-4 font-mono text-xs leading-relaxed whitespace-pre overflow-hidden pointer-events-none ${
										isDark ? "text-gray-200" : "text-gray-800"
									}`}
									dangerouslySetInnerHTML={{
										__html: syntaxHighlight(
											currentFile.content,
											currentFile.language
										),
									}}
								/>

								{/* Transparent Textarea Overlay */}
								<textarea
									ref={textareaRef}
									className={`absolute inset-0 p-4 font-mono text-xs leading-relaxed bg-transparent text-transparent border-none outline-none resize-none whitespace-pre overflow-auto z-10 ${
										isDark
											? "caret-blue-400 selection:bg-blue-900/30"
											: "caret-blue-600 selection:bg-blue-100/80"
									}`}
									value={currentFile.content}
									onChange={handleTextareaChange}
									onScroll={handleTextareaScroll}
									spellCheck={false}
									placeholder="Start typing your code here..."
								/>
							</div>
						</div>
					</div>

					{/* Error Panel */}
					{errors.length > 0 && showErrorDetails && (
						<div
							className={`${
								isDark
									? "bg-gray-800 border-t border-gray-700"
									: "bg-gray-50 border-t border-gray-200"
							} max-h-[40vh] min-h-[200px] overflow-y-auto`}
						>
							<div
								className={`flex items-center justify-between p-3 ${
									isDark
										? "bg-gray-900 border-b border-gray-700"
										: "bg-white border-b border-gray-200"
								}`}
							>
								<div className="flex items-center gap-2 font-medium">
									<span className="text-red-500">!</span>
									Problems ({errors.length})
								</div>
								<button
									className={`${
										isDark
											? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
											: "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
									} p-1 rounded`}
									onClick={() => setShowErrorDetails(false)}
								>
									×
								</button>
							</div>
							<div>
								{errors.map((error, index) => (
									<div
										key={index}
										className={`${
											isDark
												? "border-b border-gray-700/20 hover:bg-gray-700/30"
												: "border-b border-gray-200/20 hover:bg-gray-100/30"
										} p-3 cursor-pointer`}
										onClick={() => goToErrorLine(error.line)}
									>
										<div className="md:flex items-start">
											<div className="mr-3 mt-0.5">
												<span
													className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold ${
														error.type === "error"
															? "bg-red-600 text-white"
															: "bg-amber-500 text-white"
													}`}
												>
													{error.type === "error" ? "×" : "!"}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<div className="text-sm">{error.message}</div>
												<div className="text-xs mt-1 text-gray-500">
													Line {error.line} • {currentFile.name}
												</div>
											</div>
											<div
												className={`mt-2 md:mt-0 text-xs font-semibold uppercase px-2 py-0.5 rounded ${
													error.type === "error"
														? isDark
															? "bg-red-900/20 text-red-400"
															: "bg-red-100 text-red-600"
														: isDark
														? "bg-amber-900/20 text-amber-400"
														: "bg-amber-100 text-amber-600"
												}`}
											>
												{error.type}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Status bar */}
					<div
						className={`flex items-center justify-between px-4 py-2 text-xs ${
							isDark
								? "bg-gray-900 border-t border-gray-700"
								: "bg-white border-t border-gray-200"
						}`}
					>
						<div>
							{currentFile.language.toUpperCase()} •{" "}
							{currentFile.content.split("\n").length} lines •{" "}
							{currentFile.content.length} chars
						</div>
						<div>
							{errors.length > 0 && (
								<span
									className={`${
										errors.some((e) => e.type === "error")
											? isDark
												? "text-red-400"
												: "text-red-600"
											: isDark
											? "text-amber-400"
											: "text-amber-600"
									}`}
								>
									{errors.filter((e) => e.type === "error").length} errors,{" "}
									{errors.filter((e) => e.type === "warning").length} warnings
								</span>
							)}
							{errors.length === 0 && (
								<span className="text-green-500">No issues</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Save Modal */}
			{showSaveModal && (
				<div
					className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
					onClick={closeSaveModal}
				>
					<div
						className={`w-full max-w-md rounded-xl ${
							isDark
								? "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700"
								: "bg-gradient-to-b from-white to-gray-50 border border-gray-200"
						} shadow-2xl overflow-hidden`}
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className={`flex items-center justify-between p-4 md:p-5 ${
								isDark ? "border-b border-gray-700" : "border-b border-gray-200"
							}`}
						>
							<h3 className="text-lg font-semibold flex items-center gap-2">
								{saveStatus === "saving" && "Saving Files..."}
								{saveStatus === "success" && "Files Saved Successfully!"}
								{saveStatus === "error" && "Save Failed"}
							</h3>
							<button
								className={`text-2xl ${
									isDark
										? "text-gray-400 hover:text-gray-200"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={closeSaveModal}
							>
								×
							</button>
						</div>

						<div className="p-4 md:p-5">
							{saveStatus === "saving" && (
								<div className="text-center">
									<div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
										<div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-progress"></div>
									</div>
									<p>Saving {files.length} files to local storage...</p>
								</div>
							)}

							{saveStatus === "success" && (
								<div>
									<div className="mb-4">
										<p className="font-medium mb-2">Successfully saved:</p>
										<ul className="max-h-[200px] overflow-y-auto">
											{files.map((file, index) => (
												<li
													key={index}
													className={`flex items-center rounded p-2 mb-1 ${
														isDark
															? "bg-gray-900 border border-gray-700"
															: "bg-gray-50 border border-gray-200"
													}`}
												>
													<span
														className={`inline-flex items-center justify-center w-5 h-4 text-xs font-semibold rounded text-white mr-2
                              ${
																file.language === "javascript"
																	? "bg-yellow-400 text-black"
																	: ""
															}
                              ${
																file.language === "typescript"
																	? "bg-blue-500"
																	: ""
															}
                              ${file.language === "css" ? "bg-blue-600" : ""}
                              ${file.language === "python" ? "bg-blue-700" : ""}
                              ${file.language === "json" ? "bg-gray-700" : ""}
                              ${
																file.language === "markdown"
																	? "bg-blue-800"
																	: ""
															}
                            `}
													>
														{getLanguageIcon(file.language)}
													</span>
													{file.name}
													<span className="ml-auto text-xs text-gray-500">
														{file.content.length} chars
													</span>
												</li>
											))}
										</ul>
									</div>
									<div
										className={`p-3 rounded-lg ${
											isDark
												? "bg-blue-900/20 border-l-4 border-blue-500"
												: "bg-blue-50 border-l-4 border-blue-500"
										}`}
									>
										<small className="text-gray-500">
											Files saved to browser's local storage
										</small>
									</div>
								</div>
							)}

							{saveStatus === "error" && (
								<div className="text-red-500">
									<p>Failed to save files. This might be due to:</p>
									<ul className="list-disc pl-5 my-3 space-y-1">
										<li>Browser storage quota exceeded</li>
										<li>Browser doesn't support local storage</li>
										<li>Storage access denied</li>
									</ul>
									<button
										className={`px-4 py-2 rounded mt-3 ${
											isDark
												? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
												: "bg-gray-100 hover:bg-gray-200 border border-gray-200"
										}`}
										onClick={handleSave}
									>
										Try Again
									</button>
								</div>
							)}
						</div>

						<div
							className={`p-4 text-right ${
								isDark ? "border-t border-gray-700" : "border-t border-gray-200"
							}`}
						>
							<button
								className={`px-4 py-2 rounded ${
									saveStatus === "success"
										? isDark
											? "bg-green-600 hover:bg-green-700"
											: "bg-blue-600 hover:bg-blue-700"
										: isDark
										? "bg-gray-700 hover:bg-gray-600"
										: "bg-gray-200 hover:bg-gray-300"
								} text-white font-medium`}
								onClick={closeSaveModal}
								disabled={saveStatus === "saving"}
							>
								{saveStatus === "saving" ? "Please wait..." : "Close"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* New File Modal */}
			{showNewFileModal && (
				<div
					className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
					onClick={() => setShowNewFileModal(false)}
				>
					<div
						className={`w-full max-w-md rounded-xl ${
							isDark
								? "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700"
								: "bg-gradient-to-b from-white to-gray-50 border border-gray-200"
						} shadow-2xl overflow-hidden`}
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className={`flex items-center justify-between p-4 md:p-5 ${
								isDark ? "border-b border-gray-700" : "border-b border-gray-200"
							}`}
						>
							<h3 className="text-lg font-semibold">New File</h3>
							<button
								className={`text-2xl ${
									isDark
										? "text-gray-400 hover:text-gray-200"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => setShowNewFileModal(false)}
							>
								×
							</button>
						</div>

						<div className="p-4 md:p-5">
							<div className="mb-4">
								<label
									className="block text-sm font-medium mb-1"
									htmlFor="fileName"
								>
									File Name (with extension)
								</label>
								<input
									type="text"
									id="fileName"
									className={`w-full px-3 py-2 rounded-lg ${
										isDark
											? "bg-gray-900 border border-gray-700 text-gray-200 focus:border-blue-500"
											: "bg-white border border-gray-300 text-gray-800 focus:border-blue-500"
									} focus:outline-none focus:ring-1 focus:ring-blue-500`}
									value={newFileName}
									onChange={(e) => setNewFileName(e.target.value)}
									placeholder="e.g. app.js, styles.css, etc."
									autoFocus
								/>
							</div>

							{selectedPath && (
								<div
									className={`p-3 rounded-lg ${
										isDark ? "bg-blue-900/20" : "bg-blue-50"
									}`}
								>
									<p className="text-sm">
										<span className="text-gray-500">Adding to: </span>
										<span
											className={`font-medium ${
												isDark ? "text-blue-400" : "text-blue-600"
											}`}
										>
											{selectedPath}
										</span>
									</p>
								</div>
							)}
						</div>

						<div
							className={`p-4 flex justify-end gap-2 ${
								isDark ? "border-t border-gray-700" : "border-t border-gray-200"
							}`}
						>
							<button
								className={`px-4 py-2 rounded ${
									isDark
										? "bg-gray-700 hover:bg-gray-600 text-gray-200"
										: "bg-gray-200 hover:bg-gray-300 text-gray-700"
								}`}
								onClick={() => setShowNewFileModal(false)}
							>
								Cancel
							</button>
							<button
								className={`px-4 py-2 rounded ${
									isDark
										? "bg-blue-600 hover:bg-blue-700 text-white"
										: "bg-blue-600 hover:bg-blue-700 text-white"
								} font-medium`}
								onClick={createNewFile}
								disabled={!newFileName.trim()}
							>
								Create
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Sidebar overlay for mobile */}
			{sidebarOpen && (
				<div
					className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Custom tailwind styles */}
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

				html {
					font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
						"Segoe UI", Roboto, sans-serif !important;
				}

				body {
					font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
						"Segoe UI", Roboto, sans-serif !important;
				}

				* {
					font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
						"Segoe UI", Roboto, sans-serif !important;
				}
				@keyframes progress {
					0% {
						transform: translateX(-100%);
					}
					50% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(100%);
					}
				}
				.animate-progress {
					animation: progress 2s ease-in-out infinite;
				}

				/* Syntax Highlighting Styles */
				.syntax-keyword {
					color: ${isDark ? "#ff7b72" : "#d73a49"};
					font-weight: 600;
				}
				.syntax-type {
					color: ${isDark ? "#79c0ff" : "#005cc5"};
					font-weight: 500;
				}
				.syntax-string {
					color: ${isDark ? "#a5d6ff" : "#032f62"};
				}
				.syntax-comment {
					color: ${isDark ? "#8b949e" : "#6a737d"};
					font-style: italic;
				}
				.syntax-number {
					color: ${isDark ? "#79c0ff" : "#005cc5"};
				}
				.syntax-literal {
					color: ${isDark ? "#79c0ff" : "#005cc5"};
					font-weight: 500;
				}
				.syntax-builtin {
					color: ${isDark ? "#d2a8ff" : "#6f42c1"};
					font-weight: 500;
				}
				.syntax-constant {
					color: ${isDark ? "#79c0ff" : "#005cc5"};
					font-weight: 600;
				}
				.syntax-property {
					color: ${isDark ? "#79c0ff" : "#005cc5"};
				}
				.syntax-selector {
					color: ${isDark ? "#7ee787" : "#22863a"};
					font-weight: 500;
				}
				.syntax-value {
					color: ${isDark ? "#a5d6ff" : "#032f62"};
				}
				.syntax-color {
					color: ${isDark ? "#ffa657" : "#e36209"};
					font-weight: 500;
				}
				.syntax-unit {
					color: ${isDark ? "#79c0ff" : "#005cc5"};
				}
				.syntax-header {
					color: ${isDark ? "#1f6feb" : "#0969da"};
					font-weight: bold;
				}
				.syntax-bold {
					font-weight: bold;
					color: ${isDark ? "#f0f6fc" : "#24292f"};
				}
				.syntax-italic {
					font-style: italic;
					color: ${isDark ? "#f0f6fc" : "#24292f"};
				}
				.syntax-code {
					background: ${isDark
						? "rgba(110, 118, 129, 0.4)"
						: "rgba(175, 184, 193, 0.2)"};
					padding: 2px 4px;
					border-radius: 3px;
					color: ${isDark ? "#f0f6fc" : "#24292f"};
				}
				.syntax-quote {
					color: ${isDark ? "#8b949e" : "#6a737d"};
					border-left: 4px solid ${isDark ? "#30363d" : "#dfe2e5"};
					padding-left: 12px;
					font-style: italic;
				}
				.syntax-link {
					color: ${isDark ? "#58a6ff" : "#0969da"};
					text-decoration: underline;
				}
				.syntax-image {
					color: ${isDark ? "#f85149" : "#d73a49"};
				}
			`}</style>
		</div>
	);
};

export default CodeEditor;
